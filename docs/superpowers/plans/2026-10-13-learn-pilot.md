# Learn Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add See inside, Compare, a learning path and two idea lessons to the handbook, on Parallax Scrolling only, for the owner to approve before any rollout.

**Architecture:** The shared page script and stylesheet gain a mode switch (Normal · See inside · Compare) that marks the stage with `data-hb-mode` and sends `hb:mode`, so each page draws its own modes; the shared script also boots on pages without a prompt (idea lessons). A static Learn page (`learn/index.html`) holds the 25-step path, which the tests read as the single source of truth; the pages on the path carry a lesson line and a lesson nav that the tests compare with it. The page check learns the mode switch and a `learn` target.

**Tech Stack:** Plain HTML, CSS and vanilla JavaScript (no build, no dependencies); Node 22+ test runner (`node --test`); the repo's Chrome-driven page check (`tools/check-pages.mjs`).

**Spec:** `docs/superpowers/specs/2026-10-13-learn-pilot-design.md` (read it first).

## Global Constraints

- Branch `feat/learn-pilot`; every lane works in its own git worktree made from it. Nothing is pushed.
- The site shows no code: no code snippets, no backticks, no `<code>` or `<pre>` on any page.
- Plain HTML + CSS + vanilla JS; no dependencies, no CDN; a page loads only files from this repository and works from a checkout.
- Plain words for someone new to animation; American spelling (color, center, gray); no hype ("stunning", "powerful").
- Never use the name `hb-view` anywhere in a page: the tests forbid it as old markup. New names use `hb-mode`.
- Shared files stay at `?v=8` on every page until Task 8 bumps every page, the home page and the Learn pages to `?v=9` at once.
- Touch targets at least 44×44px on phones (≤600px wide); text at least 4.5:1 against its background.
- Animate only `transform` and `opacity`. A JavaScript frame loop moves by elapsed time: `FRAME = 1000 / 60`, `dt = lastT === null ? 0 : Math.min(ts - lastT, 50)`, every step times `dt / FRAME`; a start, a Play and `visibilitychange` set `lastT = null`.
- Reduced motion: loops start paused, nothing is pressed for the visitor on arrival, and each mode shows a still version.
- A page script's `hb:pause` and `hb:mode` listeners sit at the top level of its script (the inline script runs before the deferred shared script).
- Do not use `git stash` (it is shared by every worktree). Compare versions with `git show <rev>:<path> > <scratch file>`.
- Never type a ` ` escape through Write or Edit (it stores the raw character).
- Each lane serves its own worktree on its own port: Task 3 → 8761, Task 4 → 8762, Task 5 → 8763, Task 6 → 8764, Task 7 → 8765, Task 8 → 8770. Serve with `python -m http.server <port> --bind 127.0.0.1` from the worktree root, as a background command; stop it when done.
- Tests: `node --test "tests/*.test.js"` from the worktree root. Page check: `node tools/check-pages.mjs --base http://127.0.0.1:<port> <folder>`; a passing page prints six `ok` lines.
- Commit messages follow the repo's style: `feat: …`, `fix: …`, `test: …`, `docs: …`, in plain words.

## Phases

- **Phase A (in parallel):** Task 1 (shared script), Task 2 (shared stylesheet), Task 3 (page check). Merge all three into `feat/learn-pilot`.
- **Phase B (in parallel, from the merged Phase A):** Task 4 (Parallax Scrolling), Task 5 (Learn page and path tests), Task 6 (lesson 11), Task 7 (lesson 21). Merge all four.
- **Phase C:** Task 8 (integration, version bump, whole-site check, final review), Task 9 (owner review).

---

### Task 1: Shared script — boot without a prompt, and the mode switch

**Files:**
- Modify: `assets/js/demo-page.js` (header comment lines 1-10; `boot()` lines 220-240 and 515-549)
- Test: `tests/demo-page.test.js` (the `standInPage` helper, lines 131-169; new tests at the end of the boot tests)

**Interfaces:**
- Produces: on a page with `[data-hb-modes]`, buttons `[data-hb-mode="normal|inside|compare"]`; a press sets `aria-pressed` and class `on` on exactly one button, sets `data-hb-mode` on `.stage`, un-hides the `[data-hb-for=<mode>]` note inside `.hb-page` (all hidden for `normal`) and dispatches `CustomEvent('hb:mode', { detail: { mode } })` on `document`. At boot the stage gets `data-hb-mode="normal"`; no event is sent at boot.
- Produces: `boot()` runs on any page with `.hb-page`, with or without `.hb-prompt` (idea lessons have none; the home page has no `.hb-page` and is still skipped).

- [ ] **Step 1: Extend the stand-in page in `tests/demo-page.test.js`**

Replace the `standInPage` signature and body parts as follows (keep everything else in the helper as it is):

```js
// `extra` ({ modes, noPrompt }): modes adds the mode switch (Normal, See inside, Compare) and one note for See inside and one
// for Compare; noPrompt leaves the prompt out, as on an idea lesson.
function standInPage(kind, reduced, bodyAttributes, copy, links, extra) {
  const opts = extra || {};
  const timers = [], sent = [];
```

After the line `const stage = node(), player = node(), prompt = node(), demo = node(), play = node(), top = node();` add:

```js
  const modeButtons = opts.modes ? ['normal', 'inside', 'compare'].map(mode => {
    const b = node();
    b.setAttribute('data-hb-mode', mode);
    b.setAttribute('aria-pressed', String(mode === 'normal'));
    return b;
  }) : [];
  const notes = opts.modes ? ['inside', 'compare'].map(mode => {
    const p = node();
    p.setAttribute('data-hb-for', mode);
    p.hidden = true;
    return p;
  }) : [];
  const modes = opts.modes && Object.assign(node(), { querySelectorAll: selector => (selector === '[data-hb-mode]' ? modeButtons : []) });
```

In the `wanted` object change the prompt entry and add the switch:

```js
  const wanted = { '.hb-prompt': !opts.noPrompt && prompt, '.stage': stage, '.hb-player': player, '[data-hb-demo]': kind === 'do' && demo,
    '[data-hb-autoscroll]': kind === 'scroll' && play, '[data-hb-top]': kind === 'scroll' && top, '.hb-copy': button,
    '.hb-try': copy && copy.controls && Object.assign(node(), { querySelectorAll: () => copy.controls }),
    '[data-hb-modes]': modes };
  const page = { querySelector: selector => wanted[selector] || null,
    querySelectorAll: selector => (selector === '[data-hb-for]' ? notes : []) };
```

And return the new parts:

```js
  return { doc, win, stage, player, demo, play, button, anchors, sent, modeButtons, notes,
    runTimers: () => timers.forEach(t => t.fn()), timerDelays: () => timers.map(t => t.ms) };
```

- [ ] **Step 2: Write the failing tests** (after the test "a scroll page with an empty sentence of its own gets the usual note…")

```js
test('a page with no prompt, such as an idea lesson, still gets its player: a scroll page scrolls on arrival and notes reduced motion', () => {
  const page = standInPage('scroll', false, {}, null, null, { noPrompt: true });
  page.runTimers();
  assert.equal(page.play.clicks, 1);
  const reduced = standInPage('scroll', true, {}, null, null, { noPrompt: true });
  assert.deepEqual(reduced.player.children.map(c => c.className), ['hb-player-note']);
});

test("the mode switch presses one mode at a time, marks the stage, shows only that mode's note and tells the page", () => {
  const page = standInPage('scroll', false, {}, null, null, { modes: true });
  assert.equal(page.stage.getAttribute('data-hb-mode'), 'normal');
  const [normal, inside, compare] = page.modeButtons;
  const pressed = () => page.modeButtons.map(b => b.getAttribute('aria-pressed'));
  const shown = () => page.notes.map(n => !n.hidden);
  const told = () => page.sent.filter(e => e.type === 'hb:mode').map(e => e.detail.mode);
  assert.deepEqual(told(), [], 'nothing is sent at boot');
  inside.emit('click', visitor);
  assert.deepEqual(pressed(), ['false', 'true', 'false']);
  assert.equal(page.stage.getAttribute('data-hb-mode'), 'inside');
  assert.deepEqual(shown(), [true, false]);
  compare.emit('click', visitor);
  assert.deepEqual(pressed(), ['false', 'false', 'true']);
  assert.deepEqual(shown(), [false, true]);
  normal.emit('click', visitor);
  assert.deepEqual(pressed(), ['true', 'false', 'false']);
  assert.deepEqual(shown(), [false, false]);
  assert.equal(page.stage.getAttribute('data-hb-mode'), 'normal');
  assert.deepEqual(told(), ['inside', 'compare', 'normal']);
});

test('a page without the mode switch gets no data-hb-mode and sends no hb:mode', () => {
  const page = standInPage('scroll', false);
  page.runTimers();
  assert.equal(page.stage.getAttribute('data-hb-mode'), null);
  assert.equal(page.sent.filter(e => e.type === 'hb:mode').length, 0);
});
```

- [ ] **Step 3: Run the tests and see the new ones fail**

Run: `node --test tests/demo-page.test.js`
Expected: the three new tests FAIL (Play is not clicked without a prompt; no `data-hb-mode`); every older test passes.

- [ ] **Step 4: Implement in `assets/js/demo-page.js`**

In the header comment, after the line about scroll pages, add:

```js
 * The mode switch (Normal, See inside, Compare) marks the stage with data-hb-mode, shows that mode's note and sends
 * "hb:mode", so the page draws the mode. Pages without a prompt (the idea lessons) get everything but the prompt parts.
```

At the start of `boot()` replace

```js
    var page = doc.querySelector('.hb-page');
    var promptEl = page && page.querySelector('.hb-prompt');
    if (!promptEl) return;
```

with

```js
    var page = doc.querySelector('.hb-page');
    if (!page) return;
    var promptEl = page.querySelector('.hb-prompt');
```

After `var topCtl = page.querySelector('[data-hb-top]');` add:

```js
    var modesCtl = page.querySelector('[data-hb-modes]');
```

Before the comment `// While the device asks for reduced motion, Loop and Slow motion are switched off…` add:

```js
    // See inside and Compare: the mode switch above the stage. Pressing a mode presses its button (one at a time), marks the
    // stage with data-hb-mode, shows the note for that mode (Normal has none) and sends "hb:mode", so the page draws the mode.
    // Nothing scrolls and nothing takes focus, and a running Play goes on: the switch sits outside the stage, whose input
    // stops Play.
    function setUpModes() {
      var buttons = Array.prototype.slice.call(modesCtl.querySelectorAll('[data-hb-mode]'));
      var notes = Array.prototype.slice.call(page.querySelectorAll('[data-hb-for]'));
      function choose(mode) {
        buttons.forEach(function (b) {
          var on = b.getAttribute('data-hb-mode') === mode;
          b.classList.toggle('on', on);
          b.setAttribute('aria-pressed', String(on));
        });
        notes.forEach(function (n) { n.hidden = n.getAttribute('data-hb-for') !== mode; });
        if (stage) stage.setAttribute('data-hb-mode', mode);
        doc.dispatchEvent(new win.CustomEvent('hb:mode', { detail: { mode: mode } }));
      }
      buttons.forEach(function (b) {
        b.addEventListener('click', function () { choose(b.getAttribute('data-hb-mode')); });
      });
      if (stage) stage.setAttribute('data-hb-mode', 'normal');
    }
```

Replace `setUpPrompt();` (the call near the end of `boot()`) with `if (promptEl) setUpPrompt();`, and after `if (scrollCtl && scroller) setUpScroll();` add `if (modesCtl) setUpModes();`.

- [ ] **Step 5: Run all tests**

Run: `node --test "tests/*.test.js"`
Expected: every test passes (the page and skill tests are untouched by this change).

- [ ] **Step 6: Commit**

```bash
git add assets/js/demo-page.js tests/demo-page.test.js
git commit -m "feat: the shared script runs on pages without a prompt and drives the mode switch (Normal, See inside, Compare)"
```

---

### Task 2: Shared stylesheet — the mode switch, its notes, the lesson line and nav, and the idea lessons' sections

**Files:**
- Modify: `assets/css/demo-page.css`
- Test: `tests/pages.test.js` (one new test after "the shared stylesheet keeps choice buttons at least 44px wide")

**Interfaces:**
- Consumes (markup from the spec): `div.seg.hb-modes` with `button[data-hb-mode]`; `div.hb-mode-notes > p[data-hb-for]`; `p.hb-lesson > a`; `nav.hb-lesson-nav` with `p.hb-lesson-title`, `a.hb-lesson-prev`, `a.hb-lesson-next` (each `<span>` then `<b>`) and `a.hb-lesson-all`; `section.hb-why` (`h2` + `p`); `section.hb-seen` (`h2` + `div.hb-rel-list` of `a.hb-rel`).
- Produces: from 761px the switch sits at the right end of the Watch step's heading row (the stage does not move down); from 601px the lesson line shares the category line's row; an empty notes box takes no room.

- [ ] **Step 1: Write the failing test** in `tests/pages.test.js`

```js
test('the shared stylesheet draws the mode switch beside the Watch heading from 761px, hides an empty notes box, and styles the lesson line, the lesson nav and the idea lessons\' sections', () => {
  const css = read(path.join(ROOT, 'assets', 'css', 'demo-page.css'));
  const rules = cssRules(css);
  const has = sel => rules.some(r => r.selector.split(',').map(s => s.trim()).includes(sel));
  for (const sel of ['.hb-page .hb-modes', '.hb-mode-notes p', '.hb-lesson', '.hb-lesson a', '.hb-lesson-nav', '.hb-lesson-prev',
    '.hb-lesson-next', '.hb-lesson-all', '.hb-why p', '.hb-seen']) assert.ok(has(sel), sel);
  assert.ok(rules.some(r => r.selector === '.hb-mode-notes:not(:has(> p:not([hidden])))' && /display:none/.test(r.body)),
    'an empty notes box takes no room');
  assert.match(css, /@media\(min-width:761px\)\{\s*\.hb-watch:has\(> \.hb-modes\)\{display:grid/, 'from 761px the switch shares the heading row');
  assert.match(css, /@media\(min-width:601px\)\{\s*\.hb-head:has\(> \.hb-lesson\)\{display:grid/, 'from 601px the lesson line shares the category row');
});
```

- [ ] **Step 2: Run it and see it fail**

Run: `node --test tests/pages.test.js`
Expected: the new test FAILS on `.hb-page .hb-modes`.

- [ ] **Step 3: Add the rules to `assets/css/demo-page.css`**

After the rule `[data-hb-autoscrolling]{scroll-snap-type:none!important}` add:

```css

/* See inside and Compare: the mode switch (Normal · See inside · Compare) above the stage, and under the player bar the note
   that says what the stage shows. Normal has no note, and the empty box then takes no room. From 761px the switch sits at the
   right end of the Watch step's heading row (below), so the stage keeps its place on a laptop's first screen. */
.hb-page .hb-modes{gap:6px}
.hb-mode-notes:not(:has(> p:not([hidden]))){display:none}
.hb-mode-notes p{margin:0;max-width:72ch;font:400 15px/1.55 var(--hb-font);color:var(--hb-dim)}
.hb-mode-notes a{color:var(--hb-ink);text-underline-offset:3px}
```

After the rule `.hb-rel span{…}` add:

```css

/* The learning path: the lesson line beside the category line (below it on phones), the previous and next lessons at the end
   of a page of the path, and an idea lesson's Why it works and Where you'll see it */
.hb-lesson{margin:0;font:600 14px/1.3 var(--hb-font);letter-spacing:.02em}
.hb-lesson a{color:var(--hb-dim);text-decoration:underline;text-decoration-color:var(--hb-edge-2);text-underline-offset:4px}
.hb-lesson-nav{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;padding-top:clamp(28px,4vw,36px);border-top:1px solid var(--hb-line)}
.hb-lesson-title{grid-column:1/-1;margin:0;font:700 22px/1.2 var(--hb-font);letter-spacing:-.01em;color:var(--hb-ink)}
.hb-lesson-prev,.hb-lesson-next{display:flex;flex-direction:column;gap:6px;padding:18px 20px;border:1px solid rgba(255,255,255,.12);
  border-radius:10px;text-decoration:none}
.hb-lesson-next{grid-column:2;text-align:right}
.hb-lesson-prev span,.hb-lesson-next span{font:600 14px/1.3 var(--hb-font);color:var(--hb-accent)}
.hb-lesson-prev b,.hb-lesson-next b{font:700 18px/1.25 var(--hb-font);color:var(--hb-ink)}
.hb-lesson-all{grid-column:1/-1;justify-self:start;display:inline-flex;align-items:center;min-height:44px;color:var(--hb-dim);
  font:600 15px/1 var(--hb-font)}
.hb-why,.hb-seen{padding-top:clamp(28px,4vw,36px);border-top:1px solid var(--hb-line)}
.hb-why h2,.hb-seen h2{margin:0 0 12px;font:700 22px/1.2 var(--hb-font);letter-spacing:-.01em;color:var(--hb-ink)}
.hb-why p{margin:0;max-width:68ch;font:400 17px/1.7 var(--hb-font);color:var(--hb-dim)}
.hb-why p+p{margin-top:12px}
```

Inside the existing `@media(hover:hover){…}` block add:

```css
  .hb-lesson-prev:hover,.hb-lesson-next:hover{border-color:color-mix(in srgb,var(--hb-accent) 55%,transparent)}
  .hb-lesson a:hover,.hb-lesson-all:hover{color:var(--hb-ink)}
```

Before the comment `/* Short laptop screens (1366×768 leaves about 650px of page)…` add:

```css
/* From 601px the lesson line shares the category line's row, at its right end, so the header grows no taller */
@media(min-width:601px){
  .hb-head:has(> .hb-lesson){display:grid;grid-template-columns:auto minmax(0,1fr);column-gap:16px}
  .hb-head:has(> .hb-lesson) > *{grid-column:1/-1}
  .hb-head:has(> .hb-lesson) > .hb-cat{grid-column:1}
  .hb-head:has(> .hb-lesson) > .hb-lesson{grid-column:2;justify-self:end;align-self:center}
}
/* From 761px the mode switch sits at the right end of the Watch step's heading row */
@media(min-width:761px){
  .hb-watch:has(> .hb-modes){display:grid;grid-template-columns:minmax(0,1fr) auto;column-gap:20px;align-items:end}
  .hb-watch:has(> .hb-modes) > *{grid-column:1/-1}
  .hb-watch:has(> .hb-modes) > .hb-step-head{grid-column:1}
  .hb-watch:has(> .hb-modes) > .hb-modes{grid-column:2;flex-wrap:nowrap}
}
/* Up to 760px the switch has a row of its own above the stage, its three buttons sharing it equally */
@media(max-width:760px){
  .hb-page .hb-modes button{flex:1 1 0;padding:0 8px}
}
```

Inside the existing `@media(max-width:600px){…}` block add:

```css
  .hb-lesson a{display:inline-flex;align-items:center;min-height:44px}
  .hb-lesson-nav{grid-template-columns:minmax(0,1fr)}
  .hb-lesson-next{grid-column:auto}
```

- [ ] **Step 4: Run all tests**

Run: `node --test "tests/*.test.js"`
Expected: every test passes.

- [ ] **Step 5: Commit**

```bash
git add assets/css/demo-page.css tests/pages.test.js
git commit -m "feat: the shared stylesheet draws the mode switch and its notes, the lesson line and nav, and the idea lessons' sections"
```

---

### Task 3: Page check — the mode switch and the `learn` target

**Files:**
- Modify: `tools/check-pages.mjs` (header comment lines 1-31; page list lines 55-62; `CHECK` lines 83-110; new helpers after `stageChanges`; the main loop's per-setup checks)

**Interfaces:**
- Consumes: the markup of Tasks 1-2 (`.hb-modes [data-hb-mode]`, `.stage[data-hb-mode]`, `.hb-mode-notes [data-hb-for]`); `body.hb-learn` on Learn pages; `.hb-path a` on the Learn page.
- Produces: `node tools/check-pages.mjs … learn` checks `learn/index.html` and every `learn/<lesson>/` at six setups; screenshots `<name>-<setup>-inside.png` and `<name>-<setup>-compare.png` for pages with the switch.

- [ ] **Step 1: Header comment.** After the sentence ending "…and nothing more." add:

```js
// A page with the mode switch (Normal, See inside, Compare): at every setup each mode marks the stage, shows its note and
// overflows nothing, and a screenshot of each mode is saved. At the desktop and reduced-motion setups, with the stage at rest
// (a scroll page at the top, a loop paused, a plays-once page with Loop off), See inside and Compare must each change the
// stage and differ from each other, Normal must bring the first picture back, and on a scroll page Play must keep scrolling
// through a mode change. "learn" stands for the Learn page and every idea lesson in learn/: the page checks run there too,
// without the prompt parts (chips, What it is), and each lesson's kind is worked like any other page's.
```

and change the usage line to `// Usage: node tools/check-pages.mjs [--base http://127.0.0.1:8731] [--out <folder>] <page or category folder, home or learn>...`.

- [ ] **Step 2: Expand `learn`.** In the `pages` builder, make the `flatMap` callback start with:

```js
    // "learn" stands for the Learn page and every idea lesson in its folder.
    if (p === 'learn/') {
      const lessons = existsSync(join(ROOT, 'learn')) ? readdirSync(join(ROOT, 'learn'), { withFileTypes: true })
        .filter(d => d.isDirectory() && isPage(`learn/${d.name}`)).map(d => `learn/${d.name}/`).sort() : [];
      return ['learn/', ...lessons];
    }
```

and the usage error message to `'Usage: node tools/check-pages.mjs [--base URL] [--out DIR] <page or category folder, home or learn>...'`.

- [ ] **Step 3: `CHECK` on Learn pages.** In `CHECK`, after `const problems = [];` add `const learn = document.body.classList.contains('hb-learn');`. Add `.hb-lesson a, .hb-lesson-nav a, .hb-path a` to the small-target selector list (after `.hb-rel`). Replace

```js
  if (chips !== controls) problems.push('chips ' + chips + ' vs settings ' + controls);
  const what = document.querySelector('.hb-what-text');
  if (!what || !what.querySelector('p')) problems.push('What it is is missing');
  else if (what.querySelector('a[href="README.md"]')) problems.push('What it is did not load from the README');
```

with

```js
  // Learn pages have no prompt, so no chips, and no README
  if (!learn && chips !== controls) problems.push('chips ' + chips + ' vs settings ' + controls);
  const what = document.querySelector('.hb-what-text');
  if (!learn && (!what || !what.querySelector('p'))) problems.push('What it is is missing');
  else if (!learn && what.querySelector('a[href="README.md"]')) problems.push('What it is did not load from the README');
```

- [ ] **Step 4: Add the helpers** after `stageChanges`:

```js
// The stage once it has stopped changing: captures 250 ms apart until two in a row match (up to 4 s).
async function stillShot() {
  let shot = await stageShot();
  for (let i = 0; i < 16; i++) {
    await sleep(250);
    const next = await stageShot();
    if (next === shot) break;
    shot = next;
  }
  return shot;
}

// Pages with the mode switch: see the header comment. name and setup name the screenshots; kind is the page kind.
async function modeProblems(name, setup, kind) {
  if (!(await evaluate(`!!document.querySelector('[data-hb-modes]')`))) return [];
  const problems = [];
  const press = mode => evaluate(`document.querySelector('.hb-modes [data-hb-mode="${mode}"]').click()`);
  const deep = !!(setup.moves || setup.reduce);
  if (deep) {
    if (kind === 'scroll') await evaluate(`document.querySelector('[data-hb-top]').click()`);
    if (kind === 'loop') await evaluate(`(() => { const p = document.querySelector('[data-hb-pause]'); if (p && p.getAttribute('data-state') !== 'paused') p.click(); })()`);
    if (kind === 'once') await evaluate(`(() => { const l = document.querySelector('[data-hb-loop]'); if (l && l.checked) l.click(); })()`);
  }
  const first = deep ? await stillShot() : null;
  const shots = {};
  for (const mode of ['inside', 'compare']) {
    const label = mode === 'inside' ? 'See inside' : 'Compare';
    await press(mode);
    await sleep(700);
    const state = await evaluate(`(() => ({ mode: document.querySelector('.hb-page .stage').getAttribute('data-hb-mode'),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      note: !!document.querySelector('.hb-mode-notes [data-hb-for="${mode}"]:not([hidden])') }))()`);
    if (state.mode !== mode) problems.push(`${label}: the stage is not marked data-hb-mode="${mode}"`);
    if (state.overflow) problems.push(`${label}: horizontal overflow`);
    if (!state.note) problems.push(`${label}: its note is not shown`);
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(OUT, `${name}-${setup.name}-${mode}.png`), Buffer.from(shot.data, 'base64'));
    if (deep) {
      shots[mode] = await stillShot();
      if (await samePicture(shots[mode], first)) problems.push(`${label} does not change the stage`);
    }
  }
  if (deep && await samePicture(shots.inside, shots.compare)) problems.push('See inside and Compare show the same picture');
  await press('normal');
  if (deep && !(await samePicture(await stillShot(), first))) problems.push('Normal does not bring the first picture back');
  if (deep && kind === 'scroll' && !setup.reduce) {
    const box = `(document.querySelector('[data-hb-scroller]') || document.querySelector('.hb-page .stage'))`;
    await evaluate(`document.querySelector('[data-hb-autoscroll]').click()`);
    await sleep(400);
    await press('inside');
    const before = await evaluate(`${box}.scrollTop`);
    await sleep(500);
    if (await evaluate(`${box}.scrollTop`) <= before) problems.push('changing the mode stops Play');
    await evaluate(`document.querySelector('[data-hb-top]').click()`);
    await press('normal');
  }
  return problems;
}
```

- [ ] **Step 5: Call it.** In the main loop, right after the line `if (result.kind === 'scroll' && (setup.moves || setup.reduce)) problems.push(...await scrollProblems(!!setup.reduce));` and still inside that `if (!home) {…}` block, add:

```js
          problems.push(...await modeProblems(name, setup, result.kind));
```

- [ ] **Step 6: Check for regressions.** Serve the worktree on port 8761 and run

`node tools/check-pages.mjs --base http://127.0.0.1:8761 animations/01-scroll-based/parallax-scrolling animations/07-ambient-background/aurora home`

Expected: six `ok` lines for each of the three (no page has the switch yet, so `modeProblems` returns at once). Then run `node tools/check-pages.mjs --base http://127.0.0.1:8761 learn` and expect it to FAIL with "page did not finish loading" or a 404-shaped problem (there is no Learn page yet): this shows the target expands and runs. Stop the server.

- [ ] **Step 7: Commit**

```bash
git add tools/check-pages.mjs
git commit -m "feat: the page check works the mode switch (each mode's note, picture and screenshot) and checks the Learn pages with the learn target"
```

---

### Task 4: Parallax Scrolling — See inside, Compare, notes, lesson line and lesson nav

**Files:**
- Modify: `animations/01-scroll-based/parallax-scrolling/index.html` (style block lines 23-38, Watch step lines 55-127, header lines 49-53, end of `main` lines 180-184, script lines 186-234)
- Test: `tests/pages.test.js` (a new mode-switch test)
- May fix: `tools/check-pages.mjs`, `modeProblems` only, if the page check's mode code has a bug (say so in the report)

**Interfaces:**
- Consumes: Task 1's `hb:mode` event and `data-hb-mode` on the stage; Task 2's CSS classes; Task 3's mode check.
- Produces: the mode-switch template that the rollout will copy; links to `../../../learn/` and `../../../learn/far-things-move-slower/` (made by Tasks 5 and 7).

- [ ] **Step 1: Write the failing test** in `tests/pages.test.js`, after the `for (const d of steps)` block that ends with the pager-link check:

```js
// The mode switch (See inside and Compare), exactly as in the template, between the Watch step's heading and its stage, with
// a note for See inside and one for Compare after the player bar, both hidden until their mode is pressed.
const MODES = '<div class="seg hb-modes" role="group" aria-label="What the box shows" data-hb-modes><button type="button" data-hb-mode="normal" class="on" aria-pressed="true">Normal</button><button type="button" data-hb-mode="inside" aria-pressed="false">See inside</button><button type="button" data-hb-mode="compare" aria-pressed="false">Compare</button></div>';
for (const d of steps.filter(d => pageOf(d).includes('data-hb-modes'))) {
  test(`${d.slug}: the mode switch is as in the template, before the stage, with a note for See inside and Compare`, () => {
    const html = pageOf(d), flat = html.replace(/>\s+</g, '><');
    assert.equal(count(html, 'data-hb-modes'), 1, 'one mode switch');
    assert.ok(flat.includes(MODES), 'the mode switch is exactly as in the template');
    const watch = between(flat, '<section class="hb-step hb-watch"', '</section>');
    const at = watch.indexOf(MODES);
    assert.ok(at > watch.indexOf('<div class="hb-step-head">') && at < watch.indexOf('<div class="stage"'), 'between the heading and the stage');
    const notes = between(watch, '<div class="hb-mode-notes" aria-live="polite">', '</div>');
    assert.ok(notes && watch.indexOf(notes) > watch.indexOf('<div class="hb-player">'), 'the notes come after the player bar');
    for (const mode of ['inside', 'compare']) assert.equal(count(notes, `<p data-hb-for="${mode}" hidden>`), 1, `one ${mode} note, hidden at first`);
    for (const [, href] of notes.matchAll(/<a href="([^"]+)"/g)) assert.ok(isDemoDir(path.resolve(d.dir, href)) || href.includes('/learn/'), `note link ${href}`);
  });
}
```

(The `learn/` exception lasts only until Task 8, which makes the lesson exist; Task 5's tests then check every lesson link.)

Run: `node --test tests/pages.test.js` — expected: no new test runs yet (no page has `data-hb-modes`). Add the switch markup of Step 2, run again and see it FAIL until Steps 2-3 are complete.

- [ ] **Step 2: Markup.** In `header.hb-head`, right after `<p class="hb-cat">01.02 · Scroll-Based</p>` add:

```html
    <p class="hb-lesson"><a href="../../../learn/">Learning path · Lesson 22 of 25</a></p>
```

In the Watch step, between `</div>` of `div.hb-step-head` and the stage, add:

```html
    <div class="seg hb-modes" role="group" aria-label="What the box shows" data-hb-modes>
      <button type="button" data-hb-mode="normal" class="on" aria-pressed="true">Normal</button>
      <button type="button" data-hb-mode="inside" aria-pressed="false">See inside</button>
      <button type="button" data-hb-mode="compare" aria-pressed="false">Compare</button>
    </div>
```

Replace the stage (lines 60-122) with the same SVGs inside a new frame, each layer with its label:

```html
    <div class="stage" id="stage" tabindex="0" role="region" aria-label="A landscape in four layers that move at different speeds">
      <div class="scene">
        <div class="frame">
          <div class="layers" id="main">
            <p class="side">With parallax</p>

            <!-- L1: Sky + stars -->
            <div class="layer" id="l1">
              (the existing L1 svg, unchanged)
              <span class="tag"><b>Sky</b><span></span><i></i></span>
            </div>

            <!-- L2: Distant ridge -->
            <div class="layer" id="l2">
              (the existing L2 svg, unchanged)
              <span class="tag"><b>Hills</b><span></span><i></i></span>
            </div>

            <!-- L3: Pine treeline -->
            <div class="layer" id="l3">
              (the existing L3 svg, unchanged)
              <span class="tag"><b>Trees</b><span></span><i></i></span>
            </div>

            <!-- L4: Foreground grass -->
            <div class="layer" id="l4">
              (the existing L4 svg, unchanged)
              <span class="tag"><b>Grass</b><span></span><i></i></span>
            </div>

          </div>
        </div>
      </div>
    </div>
```

("(the existing … svg, unchanged)" means: keep that `<svg>…</svg>` element exactly as it is in the file today.)

After `</div>` of `div.hb-player` add:

```html
    <div class="hb-mode-notes" aria-live="polite">
      <p data-hb-for="inside" hidden><span class="say">Inside, the picture is four flat layers. As the box scrolls, the far layers move least and the near grass moves most.</span> <a href="../../../learn/far-things-move-slower/">The idea: far things move slower</a></p>
      <p data-hb-for="compare" hidden>On the left every layer moves the same, so the picture looks flat. On the right each layer moves its own amount, so it looks deep.</p>
    </div>
```

After `</section>` of `section.hb-related` (before `</main>`) add:

```html
  <nav class="hb-lesson-nav" aria-label="Learning path">
    <p class="hb-lesson-title">Learning path</p>
    <a class="hb-lesson-prev" href="../../../learn/far-things-move-slower/"><span>← Lesson 21</span><b>Far things move slower</b></a>
    <a class="hb-lesson-next" href="../../06-3d-advanced/parallax-3d-tilt/"><span>Lesson 23 →</span><b>Parallax 3D Tilt</b></a>
    <a class="hb-lesson-all" href="../../../learn/">All 25 lessons</a>
  </nav>
```

- [ ] **Step 3: Styles.** Replace the page's `<style>` block with:

```html
  <style>
    :root{--ui-accent:#6ea8ff}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    .stage{position:relative;overflow-y:auto;scrollbar-width:none;container-type:size;background:#0b0b0d}
    .stage::-webkit-scrollbar{display:none}
    .scene{height:300cqh}
    /* The frame stays put while the box scrolls and holds the scene: one copy, or two side by side in Compare */
    .frame{position:sticky;top:0;height:100cqh;display:grid;grid-template-columns:minmax(0,1fr);overflow:hidden}
    /* matches the top stop of the sky gradient so layer travel never
       exposes the page background above the backmost layer */
    .layers{position:relative;overflow:hidden;background:#0a1628}
    .layer{
      position:absolute;top:0;left:0;width:100%;height:100%;
      will-change:transform;
    }
    .layer svg{width:100%;height:100%}
    .twin,.tag,.side{display:none}
    /* See inside: the four layers pulled apart in depth, far at the back, each outlined and labeled with how far it moves.
       The labels are larger on the far layers, which the depth draws smaller, so all of them read at about the same size. */
    .stage[data-hb-mode="inside"] .layers{overflow:visible;background:none;perspective:1200px;perspective-origin:50% 25%}
    .stage[data-hb-mode="inside"] .layer{outline:2px solid rgba(244,244,242,.6);outline-offset:-2px;rotate:y -34deg;scale:.58}
    .stage[data-hb-mode="inside"] #l1{translate:-34% -4% -320px}
    .stage[data-hb-mode="inside"] #l2{translate:-11% -1% -110px}
    .stage[data-hb-mode="inside"] #l3{translate:11% 1% 100px}
    .stage[data-hb-mode="inside"] #l4{translate:34% 4% 310px}
    .stage[data-hb-mode="inside"] .tag{display:flex}
    .tag{position:absolute;top:6%;left:5%;flex-direction:column;gap:.3em;padding:.4em .6em;border-radius:.4em;
      background:rgba(11,11,13,.86);color:#f4f4f2;font-family:var(--hb-font);font-weight:600;font-size:var(--size);line-height:1.2}
    .tag span{font-weight:400;color:#d6d6da}
    .tag i{display:block;height:.3em;width:calc(var(--far,1) * 5em);border-radius:.15em;background:var(--ui-accent)}
    #l1 .tag{--size:28px} #l2 .tag{--size:24px} #l3 .tag{--size:21px} #l4 .tag{--size:18px}
    /* Compare: the scene without parallax on the left and with it on the right, each named at its top */
    .stage[data-hb-mode="compare"] .frame{grid-template-columns:repeat(2,minmax(0,1fr));gap:2px}
    .stage[data-hb-mode="compare"] .twin,.stage[data-hb-mode="compare"] .side{display:block}
    .side{position:absolute;z-index:5;top:10px;left:10px;padding:5px 10px;border-radius:999px;background:rgba(11,11,13,.82);
      color:#f4f4f2;font:600 13px/1.2 var(--hb-font)}
    @media(prefers-reduced-motion:reduce){.layer{will-change:auto}}
  </style>
```

- [ ] **Step 4: Script.** Replace the page's `<script>` with:

```html
<script>
  // Speed multipliers of the sky, ridge, trees and grass under each Depth choice
  const DEPTHS = {
    flat:    [1, 1, 1, 1],
    shallow: [0.5, 0.65, 0.8, 1],
    normal:  [0.1, 0.3, 0.6, 1],
    deep:    [0, 0.25, 0.7, 1.5],
  };
  const stage    = document.getElementById('stage');
  const main     = document.getElementById('main');
  // Compare's left side: a copy of the scene without parallax, named "Without parallax". The copy loses its ids (its sky
  // gradient gets one of its own) and its labels.
  const twin = main.cloneNode(true);
  twin.querySelectorAll('.tag').forEach(t => t.remove());
  twin.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
  twin.removeAttribute('id');
  twin.classList.add('twin');
  twin.querySelector('linearGradient').id = 'sky-twin';
  twin.querySelector('rect[fill="url(#sky)"]').setAttribute('fill', 'url(#sky-twin)');
  twin.querySelector('.side').textContent = 'Without parallax';
  main.before(twin);
  const copies   = twin.querySelectorAll('.layer');
  const LAYERS   = DEPTHS.normal.map((s, i) => {
    const el = document.getElementById('l' + (i + 1));
    return { el, copy: copies[i], tag: el.querySelector('.tag'), speed: s };
  });
  const motionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const LABELS = {
    normal:  'A landscape in four layers that move at different speeds',
    inside:  'The landscape pulled apart into its four layers, each labeled with how much it moves',
    compare: 'Two copies of the landscape side by side, without parallax on the left and with parallax on the right',
  };
  const insideSay   = document.querySelector('[data-hb-for="inside"] .say');
  const compareNote = document.querySelector('[data-hb-for="compare"]');
  let mode    = 'normal';
  let ticking = false;

  function update() {
    const st       = stage.scrollTop;
    const max      = stage.scrollHeight - stage.clientHeight;
    const progress = max > 0 ? st / max : 0;
    // A layer at 100% travels a quarter of the box, so the grass just leaves it at the end of the scroll
    const MAX_PARALLAX = stage.clientHeight / 4;
    // Reduced motion: the layers never move with the scroll. Compare then shows both sides as they stand halfway down, so
    // the difference still shows without any movement.
    const still    = motionMQ.matches;
    const p        = still ? (mode === 'compare' ? 0.5 : 0) : progress;
    LAYERS.forEach(L => {
      L.el.style.transform   = `translate3d(0,${Math.round(p * MAX_PARALLAX * L.speed)}px,0)`;
      L.copy.style.transform = `translate3d(0,${Math.round(p * MAX_PARALLAX)}px,0)`;
    });
    ticking = false;
  }

  // Each label says how far its layer moves next to the others, in words and as a bar (a share of the longest one); the
  // notes say what Flat does.
  function describe() {
    const speeds = LAYERS.map(L => L.speed), most = Math.max(...speeds);
    const flat   = speeds.every(s => s === speeds[0]);
    LAYERS.forEach(L => {
      const s = L.speed;
      L.tag.querySelector('span').textContent = flat ? 'moves with the rest' : s === 0 ? 'stays still' : s === most ? 'moves most'
        : s <= most * 0.2 ? 'barely moves' : s <= most * 0.5 ? 'moves a little' : 'moves more';
      L.tag.style.setProperty('--far', most ? s / most : 1);
    });
    insideSay.textContent = flat
      ? 'Inside, the picture is four flat layers. Depth is set to Flat, so they all move the same and the picture looks flat.'
      : 'Inside, the picture is four flat layers. As the box scrolls, the far layers move least and the near grass moves most.';
    compareNote.textContent = flat
      ? 'Depth is set to Flat, so both sides move the same. Pick another Depth in Try it to see the difference.'
      : 'On the left every layer moves the same, so the picture looks flat. On the right each layer moves its own amount, so it looks deep.';
  }

  document.addEventListener('hb:mode', e => {
    mode = e.detail.mode;
    stage.setAttribute('aria-label', LABELS[mode]);
    update();
  });
  stage.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  // Reduced motion turned on or off while the page is open
  motionMQ.addEventListener('change', update);

  function choices(id, pick) {
    const buttons = document.querySelectorAll('#' + id + ' button');
    buttons.forEach(b => b.addEventListener('click', () => {
      buttons.forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
      pick(b.dataset);
    }));
  }
  choices('depth-seg', d => {
    DEPTHS[d.depth].forEach((s, i) => { LAYERS[i].speed = s; });
    describe();
    update();
  });

  describe();
  update();
</script>
```

- [ ] **Step 5: Run the tests**

Run: `node --test "tests/*.test.js"`
Expected: all pass, including the new mode-switch test.

- [ ] **Step 6: Page check and screenshots.** Serve on port 8762 and run
`node tools/check-pages.mjs --base http://127.0.0.1:8762 animations/01-scroll-based/parallax-scrolling`.
Expected: six `ok` lines. Open the saved `…-desktop-inside.png`, `…-desktop-compare.png`, `…-phone-inside.png`, `…-phone-compare.png` and `…-phone-reduced-inside.png` with the Read tool and tune only the See inside numbers (`perspective`, `rotate`, `scale`, the four `translate` values, the label sizes) until, at both 1280px and 375px: all four layers are visible as separate outlined planes from far (back) to near (front); every label is readable (about 12px or more on screen) and not cut off; nothing important leaves the box. If the 3D spread cannot meet this at 375px, switch to a flat diagonal fan (no `perspective`, no `rotate`; `scale:.62` and translate offsets of about ±18% across and ±10% down) and keep whichever reads clearer. Re-run the page check after every change; it must stay at six `ok` lines.

- [ ] **Step 7: Commit**

```bash
git add animations/01-scroll-based/parallax-scrolling/index.html tests/pages.test.js
git commit -m "feat: Parallax Scrolling shows its four layers pulled apart (See inside) and the scene without and with parallax side by side (Compare), with a lesson line and the previous and next lessons"
```

---

### Task 5: The Learn page and the path tests

**Files:**
- Create: `learn/index.html`
- Create: `tests/learn.test.js`

**Interfaces:**
- Produces: the path as static `li[data-step][data-kind]` items (with `data-soon` and no link while a step is not built); `body.hb-learn`; the tests that every page of the path matches it.
- Note: lessons 11 and 21 are built in parallel by Tasks 6 and 7. In this task write them as not built yet (exactly like the other unbuilt ideas); Task 8 turns them into links.

- [ ] **Step 1: Write the failing tests** — create `tests/learn.test.js`:

```js
// Static checks for the Learn pages: the learning path on learn/index.html (the single source of truth for the path), the idea
// lessons in learn/<slug>/, and the lesson line and lesson nav on every page of the path that has them.
// Run from the repo root: node --test "tests/*.test.js"
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const LEARN = path.join(ROOT, 'learn');
const ANIM = path.join(ROOT, 'animations');
const read = f => fs.readFileSync(f, 'utf8');
const count = (s, sub) => s.split(sub).length - 1;
const HUB = read(path.join(LEARN, 'index.html'));
const HOME = read(path.join(ROOT, 'index.html'));

// The steps of the path in page order: { n, kind, soon, href (null while not built), title, body }.
const STEPS = [...HUB.matchAll(/<li data-step="(\d+)" data-kind="(idea|animation)"( data-soon)?>([\s\S]*?)<\/li>/g)].map(m => {
  const link = m[4].match(/<a href="([^"]+)"/);
  return { n: Number(m[1]), kind: m[2], soon: !!m[3], href: link ? link[1] : null, title: (m[4].match(/<b>([^<]+)<\/b>/) || [])[1], body: m[4] };
});
const dirOf = href => path.resolve(LEARN, href);
const h1Of = dir => ((read(path.join(dir, 'index.html')).match(/<h1>([^<]+)<\/h1>/) || [])[1] || '').replace(/&amp;/g, '&');
const LESSONS = fs.readdirSync(LEARN, { withFileTypes: true })
  .filter(d => d.isDirectory() && fs.existsSync(path.join(LEARN, d.name, 'index.html'))).map(d => path.join(LEARN, d.name));
const FOOTER = '<footer class="hb-foot"><span>Animation Handbook</span><a href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener">Source on GitHub</a><a href="#top">Back to top ↑</a></footer>';
const STAR = '<a class="hb-star" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener" aria-label="Star on GitHub">';
const version = (html, file) => (html.match(new RegExp(`demo-page\\.${file}\\?v=(\\d+)`)) || [])[1];

test('the path has 25 steps in five chapters of five, numbered in order', () => {
  assert.deepEqual(STEPS.map(s => s.n), Array.from({ length: 25 }, (_, i) => i + 1));
  const chapters = [...HUB.matchAll(/<section class="hb-chapter"[\s\S]*?<\/section>/g)].map(m => count(m[0], '<li data-step='));
  assert.deepEqual(chapters, [5, 5, 5, 5, 5]);
});

test('every built step links to an existing page and shows its title; a step not built yet has no link and says so', () => {
  for (const s of STEPS) {
    if (s.soon) {
      assert.equal(s.href, null, `step ${s.n} has no link`);
      assert.ok(s.body.includes('Not built yet'), `step ${s.n} says Not built yet`);
      continue;
    }
    assert.ok(s.href, `step ${s.n} has a link`);
    const dir = dirOf(s.href);
    assert.ok(fs.existsSync(path.join(dir, 'index.html')), `step ${s.n}: ${s.href} exists`);
    assert.equal(s.title, h1Of(dir), `step ${s.n} shows the page's title`);
    assert.ok(dir.startsWith((s.kind === 'idea' ? LEARN : ANIM) + path.sep), `step ${s.n}: ideas live in learn/, animations in animations/`);
  }
});

test('every idea lesson in learn/ is a built step of the path', () => {
  for (const dir of LESSONS) {
    assert.ok(STEPS.some(s => s.href && s.kind === 'idea' && dirOf(s.href) === dir), `${path.basename(dir)} is a built idea step`);
  }
});

// Every page of the path that has a lesson line or lesson nav: each idea lesson, and any animation page that carries them.
const onPath = STEPS.filter(s => s.href).map(s => ({ step: s, dir: dirOf(s.href) }))
  .filter(p => fs.existsSync(path.join(p.dir, 'index.html')) && read(path.join(p.dir, 'index.html')).includes('class="hb-lesson'));
for (const { step, dir } of onPath) {
  test(`step ${step.n} (${step.title}): its lesson line and lesson nav match the Learn page`, () => {
    const html = read(path.join(dir, 'index.html'));
    const learnHref = path.relative(dir, LEARN).split(path.sep).join('/') + '/';
    const line = step.kind === 'idea' ? `<p class="hb-cat">Lesson ${step.n} of 25 · Idea</p>`
      : `<p class="hb-lesson"><a href="${learnHref}">Learning path · Lesson ${step.n} of 25</a></p>`;
    assert.ok(html.includes(line), `lesson line: ${line}`);
    const nav = html.match(/<nav class="hb-lesson-nav" aria-label="Learning path">([\s\S]*?)<\/nav>/);
    assert.ok(nav, 'lesson nav');
    assert.ok(nav[1].includes('<p class="hb-lesson-title">Learning path</p>'), 'lesson nav title');
    const prev = STEPS[step.n - 2], next = STEPS[step.n];
    for (const [cls, other, label] of [['hb-lesson-prev', prev, prev && `← Lesson ${prev.n}`], ['hb-lesson-next', next, next && `Lesson ${next.n} →`]]) {
      const a = nav[1].match(new RegExp(`<a class="${cls}" href="([^"]+)"><span>([^<]+)</span><b>([^<]+)</b></a>`));
      if (!other) { assert.equal(a, null, `no ${cls} at the end of the path`); continue; }
      assert.ok(other.href, `step ${other.n}, next to step ${step.n}, is built`);
      assert.ok(a, cls);
      assert.equal(a[2], label, `${cls} label`);
      assert.equal(a[3], other.title, `${cls} title`);
      assert.equal(path.resolve(dir, a[1]), dirOf(other.href), `${cls} opens step ${other.n}`);
    }
    assert.ok(nav[1].includes(`<a class="hb-lesson-all" href="${learnHref}">All 25 lessons</a>`), 'All 25 lessons');
    if (step.kind === 'idea') {
      for (const [rel, other, word] of [['prev', prev, 'Previous'], ['next', next, 'Next']]) {
        const a = html.match(new RegExp(`<a href="([^"]+)" rel="${rel}" aria-label="${word} lesson: ([^"]+)">`));
        assert.ok(a, `top bar ${rel} link`);
        assert.equal(path.resolve(dir, a[1]), dirOf(other.href), `top bar ${rel} opens step ${other.n}`);
        assert.equal(a[2], other.title, `top bar ${rel} names step ${other.n}`);
      }
    }
  });
}

for (const file of [path.join(LEARN, 'index.html'), ...LESSONS.map(d => path.join(d, 'index.html'))]) {
  const name = path.relative(ROOT, file).split(path.sep).join('/');
  test(`${name}: the shared frame (top bar with the Star link, footer, shared files at the home page's version) and no code`, () => {
    const html = read(file);
    assert.match(html, /<body class="hb hb-learn"/, 'body class hb hb-learn');
    assert.equal(count(html, '<nav class="hb-bar"'), 1);
    assert.ok(html.includes(STAR), 'the Star link in the top bar');
    assert.equal(count(html, '<main class="hb-page">'), 1);
    assert.equal(count(html, '<header class="hb-head">'), 1);
    assert.ok(html.replace(/>\s+</g, '><').includes(FOOTER), 'the shared footer');
    for (const f of ['css', 'js']) assert.equal(version(html, f), version(HOME, f), `demo-page.${f} at the home page's version`);
    assert.ok(!/`|<code|<pre/.test(html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '')), 'no code on the page');
    assert.ok(!html.includes('hb-view'), 'no old hb-view markup');
  });
}

test('the Learn page names itself and has five chapters', () => {
  assert.ok(HUB.includes('<h1>Learn web animation</h1>'));
  assert.ok(HUB.includes('<p class="hb-lede">25 short lessons, from easy to advanced. You watch and try; you never write code.</p>'));
  assert.equal(count(HUB, '<section class="hb-chapter"'), 5);
});

for (const dir of LESSONS) {
  test(`learn/${path.basename(dir)}: an idea lesson with a stage, Why it works, Where you'll see it and no prompt`, () => {
    const html = read(path.join(dir, 'index.html'));
    const body = html.match(/<body class="hb hb-learn" data-hb-kind="(once|loop|scroll|do)"( data-hb-autoplay)?(?: data-hb-motion-note="[^"]*")?>/);
    assert.ok(body, 'the body declares the page kind');
    for (const part of ['<section class="hb-step hb-watch"', '<div class="hb-player">', '<section class="hb-why"', '<section class="hb-seen"', '<nav class="hb-lesson-nav"']) {
      assert.equal(count(html, part), 1, `exactly one ${part}`);
    }
    assert.ok(!html.includes('hb-prompt'), 'no prompt');
    if (body[1] === 'loop') assert.equal(count(html, 'data-hb-pause'), 1, 'a loop has Pause');
    if (body[1] === 'scroll') {
      assert.ok(body[2], 'a scroll lesson scrolls once on arrival');
      assert.equal(count(html, 'data-hb-autoscroll'), 1, 'Play');
      assert.equal(count(html, 'data-hb-top'), 1, 'Back to top');
    }
    const why = html.match(/<section class="hb-why"[\s\S]*?<\/section>/)[0].replace(/<[^>]+>/g, ' ');
    const sentences = why.replace('Why it works', '').split(/[.!?](?:\s|$)/).filter(s => s.trim()).length;
    assert.ok(sentences >= 2 && sentences <= 4, `Why it works has ${sentences} sentences`);
    const seen = [...html.match(/<section class="hb-seen"[\s\S]*?<\/section>/)[0].matchAll(/<a class="hb-rel" href="([^"]+)"><b>([^<]+)<\/b>/g)];
    assert.ok(seen.length >= 3 && seen.length <= 6, `${seen.length} pages in Where you'll see it`);
    for (const [, href, title] of seen) {
      const target = path.resolve(dir, href);
      assert.ok(target.startsWith(ANIM + path.sep) && fs.existsSync(path.join(target, 'index.html')), `${href} is an animation page`);
      assert.equal(title, h1Of(target), `${href} shows the page's title`);
    }
  });
}
```

- [ ] **Step 2: Run it and see it fail**

Run: `node --test tests/learn.test.js`
Expected: FAIL with `ENOENT … learn/index.html`.

- [ ] **Step 3: Create `learn/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Learn Web Animation — Animation Handbook</title>
  <meta name="description" content="25 short lessons, from easy to advanced. You watch and try; you never write code.">
  <link rel="canonical" href="https://matinmonshizadeh.github.io/animation-handbook/learn/">
  <link rel="icon" type="image/png" sizes="96x96" href="../favicon.png">
  <link rel="icon" type="image/svg+xml" href="../favicon.svg">
  <link rel="apple-touch-icon" href="../apple-touch-icon.png">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Animation Handbook">
  <meta property="og:title" content="Learn Web Animation — Animation Handbook">
  <meta property="og:description" content="25 short lessons, from easy to advanced. You watch and try; you never write code.">
  <meta property="og:url" content="https://matinmonshizadeh.github.io/animation-handbook/learn/">
  <meta property="og:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Learn Web Animation — Animation Handbook">
  <meta name="twitter:description" content="25 short lessons, from easy to advanced. You watch and try; you never write code.">
  <meta name="twitter:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <style>
    :root{--ui-accent:#c8f169}
    .hb-chapter{display:flex;flex-direction:column;gap:14px;padding-top:clamp(28px,4vw,36px);border-top:1px solid var(--hb-line)}
    .hb-chapter h2{margin:0;font:700 clamp(22px,2.6vw,26px)/1.2 var(--hb-font);letter-spacing:-.015em;color:var(--hb-ink)}
    .hb-chapter h2 span{display:block;margin-bottom:4px;font:600 14px/1.3 var(--hb-font);letter-spacing:.04em;color:var(--hb-accent)}
    .hb-path{display:flex;flex-direction:column;gap:10px;margin:0;padding:0;list-style:none}
    .hb-path li > a,.hb-path li > div{display:grid;grid-template-columns:44px minmax(0,1fr);column-gap:16px;row-gap:2px;align-items:center;
      padding:14px 18px;border:1px solid rgba(255,255,255,.12);border-radius:10px;text-decoration:none}
    .hb-path .n{grid-row:1/span 3;display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;
      border:1px solid var(--hb-edge);font:700 16px/1 var(--hb-font);color:var(--hb-ink)}
    .hb-path [data-kind="idea"] .n{border-color:var(--hb-accent);background:var(--hb-accent);color:#0b0b0d}
    .hb-path .k{font:600 13px/1.3 var(--hb-font);color:var(--hb-muted)}
    .hb-path b{font:700 18px/1.25 var(--hb-font);color:var(--hb-ink)}
    .hb-path .line{font:400 15px/1.45 var(--hb-font);color:var(--hb-dim)}
    .hb-path [data-soon] > div{border-style:dashed}
    .hb-path [data-soon] b,.hb-path [data-soon] .line{color:var(--hb-muted)}
    @media(hover:hover){.hb-path a:hover{border-color:color-mix(in srgb,var(--hb-accent) 55%,transparent)}}
  </style>
  <link rel="stylesheet" href="../assets/css/demo-page.css?v=8">
  <script src="../assets/js/demo-page.js?v=8" defer></script>
</head>
<body class="hb hb-learn">
<nav class="hb-bar" aria-label="Animation Handbook">
  <a class="hb-home" href="../"><svg class="hb-mark" viewBox="0 0 32 32" aria-hidden="true"><g class="g"><circle cx="11.16" cy="20.84" r="6.1"/><circle cx="15.12" cy="16.88" r="6.1"/><circle cx="18.51" cy="13.49" r="6.1"/></g><circle class="b" cx="21.2" cy="10.8" r="6.6"/></svg><span>Animation Handbook</span></a>
  <a class="hb-star" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener" aria-label="Star on GitHub"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg><span>Star on GitHub</span></a>
</nav>
<main class="hb-page">
  <header class="hb-head">
    <p class="hb-cat">Learning path</p>
    <h1>Learn web animation</h1>
    <p class="hb-lede">25 short lessons, from easy to advanced. You watch and try; you never write code.</p>
  </header>

  <section class="hb-chapter" aria-labelledby="ch-1">
    <h2 id="ch-1"><span>Chapter 1</span>Appear and leave</h2>
    <ol class="hb-path">
      <li data-step="1" data-kind="idea" data-soon><div><span class="n">1</span><span class="k">Idea · Not built yet</span><b>How long it takes</b><span class="line">Fast feels snappy and slow feels calm: pick the time that fits the moment.</span></div></li>
      <li data-step="2" data-kind="animation"><a href="../animations/02-entrance-and-exit/fade-in-out/"><span class="n">2</span><span class="k">Animation</span><b>Fade In / Fade Out</b><span class="line">Fades in to appear and fades out to leave.</span></a></li>
      <li data-step="3" data-kind="idea" data-soon><div><span class="n">3</span><span class="k">Idea · Not built yet</span><b>Slowing down</b><span class="line">Real things speed up and slow down, so smooth animations do too.</span></div></li>
      <li data-step="4" data-kind="animation"><a href="../animations/02-entrance-and-exit/slide-in/"><span class="n">4</span><span class="k">Animation</span><b>Slide In</b><span class="line">Travels into place from one edge.</span></a></li>
      <li data-step="5" data-kind="animation"><a href="../animations/02-entrance-and-exit/scale-in/"><span class="n">5</span><span class="k">Animation</span><b>Scale In / Zoom In</b><span class="line">Grows from smaller to full size.</span></a></li>
    </ol>
  </section>

  <section class="hb-chapter" aria-labelledby="ch-2">
    <h2 id="ch-2"><span>Chapter 2</span>Answer the visitor</h2>
    <ol class="hb-path">
      <li data-step="6" data-kind="idea" data-soon><div><span class="n">6</span><span class="k">Idea · Not built yet</span><b>Answer every action</b><span class="line">A press, a tap or a hover gets a quick, small reply, so people know it worked.</span></div></li>
      <li data-step="7" data-kind="animation"><a href="../animations/04-micro-interactions/button-press-scale/"><span class="n">7</span><span class="k">Animation</span><b>Button Press Scale</b><span class="line">Shrinks as you press it and springs back as you let go.</span></a></li>
      <li data-step="8" data-kind="animation"><a href="../animations/04-micro-interactions/hover-state/"><span class="n">8</span><span class="k">Animation</span><b>Hover State Animation</b><span class="line">Six ways a card can react when you point at it.</span></a></li>
      <li data-step="9" data-kind="animation"><a href="../animations/04-micro-interactions/toggle-switch/"><span class="n">9</span><span class="k">Animation</span><b>Toggle / Switch Slide</b><span class="line">The knob slides across as the switch turns on or off.</span></a></li>
      <li data-step="10" data-kind="animation"><a href="../animations/04-micro-interactions/loading-spinner/"><span class="n">10</span><span class="k">Animation</span><b>Loading Spinner</b><span class="line">Six small shapes loop to show that something is loading.</span></a></li>
    </ol>
  </section>

  <section class="hb-chapter" aria-labelledby="ch-3">
    <h2 id="ch-3"><span>Chapter 3</span>Move with the scroll</h2>
    <ol class="hb-path">
      <li data-step="11" data-kind="idea" data-soon><div><span class="n">11</span><span class="k">Idea · Not built yet</span><b>Follows the scroll</b><span class="line">Some animations play by themselves; others move only when you scroll.</span></div></li>
      <li data-step="12" data-kind="animation"><a href="../animations/01-scroll-based/reveal-on-scroll/"><span class="n">12</span><span class="k">Animation</span><b>Reveal on Scroll</b><span class="line">Cards appear as they cross a line in the box.</span></a></li>
      <li data-step="13" data-kind="idea" data-soon><div><span class="n">13</span><span class="k">Idea · Not built yet</span><b>One after another</b><span class="line">A short wait between items leads the eye through a group.</span></div></li>
      <li data-step="14" data-kind="animation"><a href="../animations/01-scroll-based/stagger-reveal/"><span class="n">14</span><span class="k">Animation</span><b>Stagger Reveal</b><span class="line">Items in a group appear one after another as it scrolls in.</span></a></li>
      <li data-step="15" data-kind="animation"><a href="../animations/01-scroll-based/progress-bar/"><span class="n">15</span><span class="k">Animation</span><b>Progress Bar</b><span class="line">A bar fills as you read down the page.</span></a></li>
    </ol>
  </section>

  <section class="hb-chapter" aria-labelledby="ch-4">
    <h2 id="ch-4"><span>Chapter 4</span>Change pages</h2>
    <ol class="hb-path">
      <li data-step="16" data-kind="idea" data-soon><div><span class="n">16</span><span class="k">Idea · Not built yet</span><b>Keep your place</b><span class="line">When the page changes, motion shows where things went.</span></div></li>
      <li data-step="17" data-kind="animation"><a href="../animations/03-page-transitions/crossfade/"><span class="n">17</span><span class="k">Animation</span><b>Crossfade Transition</b><span class="line">The old page fades out as the new one fades in.</span></a></li>
      <li data-step="18" data-kind="animation"><a href="../animations/03-page-transitions/slide-transition/"><span class="n">18</span><span class="k">Animation</span><b>Slide Transition</b><span class="line">Pages slide across, and going back slides the other way.</span></a></li>
      <li data-step="19" data-kind="animation"><a href="../animations/03-page-transitions/shared-element-transition/"><span class="n">19</span><span class="k">Animation</span><b>Shared Element Transition</b><span class="line">A picture grows from the list into the next page's header.</span></a></li>
      <li data-step="20" data-kind="animation"><a href="../animations/03-page-transitions/flip-technique/"><span class="n">20</span><span class="k">Animation</span><b>FLIP Technique</b><span class="line">Cards glide to their new places when the layout changes.</span></a></li>
    </ol>
  </section>

  <section class="hb-chapter" aria-labelledby="ch-5">
    <h2 id="ch-5"><span>Chapter 5</span>Depth and 3D</h2>
    <ol class="hb-path">
      <li data-step="21" data-kind="idea" data-soon><div><span class="n">21</span><span class="k">Idea · Not built yet</span><b>Far things move slower</b><span class="line">Near things pass quickly and far things slowly: that is how depth looks.</span></div></li>
      <li data-step="22" data-kind="animation"><a href="../animations/01-scroll-based/parallax-scrolling/"><span class="n">22</span><span class="k">Animation</span><b>Parallax Scrolling</b><span class="line">Far layers move slower than near ones as you scroll.</span></a></li>
      <li data-step="23" data-kind="animation"><a href="../animations/06-3d-advanced/parallax-3d-tilt/"><span class="n">23</span><span class="k">Animation</span><b>Parallax 3D Tilt</b><span class="line">A card tilts toward your pointer, and a light slides over it.</span></a></li>
      <li data-step="24" data-kind="animation"><a href="../animations/06-3d-advanced/flip-card-3d/"><span class="n">24</span><span class="k">Animation</span><b>3D Flip Card</b><span class="line">A card turns over in 3D to show its back.</span></a></li>
      <li data-step="25" data-kind="idea" data-soon><div><span class="n">25</span><span class="k">Idea · Not built yet</span><b>Less is more</b><span class="line">When not to animate, and how to respect people who ask for less motion.</span></div></li>
    </ol>
  </section>
</main>
<footer class="hb-foot"><span>Animation Handbook</span><a href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener">Source on GitHub</a><a href="#top">Back to top ↑</a></footer>
</body>
</html>
```

- [ ] **Step 4: Run all tests**

Run: `node --test "tests/*.test.js"`
Expected: all pass (Parallax's lesson line and nav are not in this worktree yet, and no lesson exists, so those tests are not generated here).

- [ ] **Step 5: Page check.** Serve on port 8763 and run `node tools/check-pages.mjs --base http://127.0.0.1:8763 learn`.
Expected: six `ok` lines for `learn`. Look at `learn-desktop-full.png` and `learn-phone.png` (Read tool): the five chapters read clearly, idea steps stand out by their filled number, unbuilt steps are dashed and muted but still readable (4.5:1), and no card overflows at 320px.

- [ ] **Step 6: Commit**

```bash
git add learn/index.html tests/learn.test.js
git commit -m "feat: a Learn page with a 25-step learning path in five chapters, and tests that keep every page of the path in step with it"
```

---

### Task 6: Lesson 11 · Follows the scroll

**Files:**
- Create: `learn/follows-the-scroll/index.html`

**Interfaces:**
- Consumes: Task 1 (boot without a prompt), Task 2 (lesson CSS), the existing scroll-page behavior (`data-hb-scroller`, Play, Back to top).
- Produces: step 11 of the path (Task 8 links it from the Learn page).

- [ ] **Step 1: Create the page**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Follows the Scroll — Animation Handbook</title>
  <meta name="description" content="Some animations play on their own, like a video. Others follow your scroll: they move when you scroll and stop when you stop.">
  <link rel="canonical" href="https://matinmonshizadeh.github.io/animation-handbook/learn/follows-the-scroll/">
  <link rel="icon" type="image/png" sizes="96x96" href="../../favicon.png">
  <link rel="icon" type="image/svg+xml" href="../../favicon.svg">
  <link rel="apple-touch-icon" href="../../apple-touch-icon.png">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Animation Handbook">
  <meta property="og:title" content="Follows the Scroll — Animation Handbook">
  <meta property="og:description" content="Some animations play on their own, like a video. Others follow your scroll: they move when you scroll and stop when you stop.">
  <meta property="og:url" content="https://matinmonshizadeh.github.io/animation-handbook/learn/follows-the-scroll/">
  <meta property="og:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Follows the Scroll — Animation Handbook">
  <meta name="twitter:description" content="Some animations play on their own, like a video. Others follow your scroll: they move when you scroll and stop when you stop.">
  <meta name="twitter:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <style>
    :root{--ui-accent:#c8f169}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    .stage{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px;background:#0b0b0d;overflow:hidden}
    .panel{position:relative;min-width:0;background:#14151b}
    .view{display:flex;flex-direction:column;justify-content:center;gap:14px;height:100%;padding:clamp(14px,3vw,28px)}
    .name{font:700 clamp(15px,2vw,19px)/1.2 var(--hb-font);color:#f4f4f2}
    .says{font:400 clamp(13px,1.6vw,15px)/1.45 var(--hb-font);color:#c4c4cb}
    .track{position:relative;height:28px;border-bottom:2px dashed rgba(255,255,255,.24)}
    .runner{position:absolute;inset:0;will-change:transform}
    .ball{width:28px;height:28px;border-radius:50%;background:var(--ui-accent)}
    /* Plays by itself: the ball crosses its track on a timer, whatever the visitor does */
    .clock .runner{animation:cross 2.4s ease-in-out infinite alternate}
    @keyframes cross{to{transform:translateX(calc(100% - 28px))}}
    /* Follows the scroll: this panel is the box that scrolls. Its view stays put while the ball sits wherever the scroll says. */
    .scroll{overflow-y:auto;scrollbar-width:none}
    .scroll::-webkit-scrollbar{display:none}
    .scroll .tall{height:300%}
    .scroll .view{position:sticky;top:0;height:calc(100% / 3)}
    .where{font:600 14px/1.3 var(--hb-font);color:var(--ui-accent)}
    @media(prefers-reduced-motion:reduce){.clock .runner{animation:none}}
  </style>
  <link rel="stylesheet" href="../../assets/css/demo-page.css?v=8">
  <script src="../../assets/js/demo-page.js?v=8" defer></script>
</head>
<body class="hb hb-learn" data-hb-kind="scroll" data-hb-autoplay data-hb-motion-note="The ball that plays by itself stays still">
<nav class="hb-bar" aria-label="Animation Handbook">
  <a class="hb-home" href="../../"><svg class="hb-mark" viewBox="0 0 32 32" aria-hidden="true"><g class="g"><circle cx="11.16" cy="20.84" r="6.1"/><circle cx="15.12" cy="16.88" r="6.1"/><circle cx="18.51" cy="13.49" r="6.1"/></g><circle class="b" cx="21.2" cy="10.8" r="6.6"/></svg><span>Animation Handbook</span></a>
  <span class="hb-pager"><a href="../../animations/04-micro-interactions/loading-spinner/" rel="prev" aria-label="Previous lesson: Loading Spinner"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg><span><span class="hb-dir">Previous: </span>Loading Spinner</span></a><a href="../../animations/01-scroll-based/reveal-on-scroll/" rel="next" aria-label="Next lesson: Reveal on Scroll"><span><span class="hb-dir">Next: </span>Reveal on Scroll</span><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></a></span>
  <a class="hb-star" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener" aria-label="Star on GitHub"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg><span>Star on GitHub</span></a>
</nav>
<main class="hb-page">
  <header class="hb-head">
    <p class="hb-cat">Lesson 11 of 25 · Idea</p>
    <h1>Follows the scroll</h1>
    <p class="hb-lede">Some animations play on their own, like a video. Others follow your scroll: they move when you scroll and stop when you stop.</p>
  </header>

  <section class="hb-step hb-watch" aria-labelledby="hb-watch-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">1</span>
      <div><h2 id="hb-watch-title">Scroll it</h2><p>Scroll the right box, or press Play and it scrolls for you. The left ball keeps its own time.</p></div>
    </div>
    <div class="stage" id="stage" role="region" aria-label="Two boxes side by side: a ball that plays by itself, and a ball that follows the scroll of its box">
      <div class="panel clock">
        <div class="view">
          <p class="name">Plays by itself</p>
          <div class="track"><div class="runner"><div class="ball"></div></div></div>
          <p class="says">Moves on a timer, whatever you do.</p>
        </div>
      </div>
      <div class="panel scroll" id="scroll-box" data-hb-scroller tabindex="0" aria-label="A box to scroll: its ball follows the scroll">
        <div class="tall">
          <div class="view">
            <p class="name">Follows the scroll</p>
            <div class="track"><div class="runner" id="scroll-runner"><div class="ball"></div></div></div>
            <p class="says">Goes where the scroll goes. <span class="where" id="where">0% scrolled</span></p>
          </div>
        </div>
      </div>
    </div>
    <div class="hb-player">
      <button class="hb-play" type="button" id="btn-scroll" data-hb-autoscroll><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>Play</button>
      <button class="hb-play" type="button" id="btn-top" data-hb-top><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>Back to top</button>
    </div>
  </section>

  <section class="hb-why" aria-labelledby="hb-why-title">
    <h2 id="hb-why-title">Why it works</h2>
    <p>When an animation follows the scroll, the visitor controls it: scroll slowly and it moves slowly, scroll back and it plays backward, stop and it stops. That ties the movement to reading the page, so it feels like part of it. An animation that plays by itself runs on a clock instead, whatever the visitor does.</p>
  </section>

  <section class="hb-seen" aria-labelledby="hb-seen-title">
    <h2 id="hb-seen-title">Where you'll see it</h2>
    <div class="hb-rel-list">
      <a class="hb-rel" href="../../animations/01-scroll-based/parallax-scrolling/"><b>Parallax Scrolling</b><span>Far layers move slower than near ones as you scroll.</span></a>
      <a class="hb-rel" href="../../animations/01-scroll-based/scrub-animation/"><b>Scrub Animation</b><span>Scroll plays it forward and back, like dragging a video.</span></a>
      <a class="hb-rel" href="../../animations/01-scroll-based/progress-bar/"><b>Progress Bar</b><span>A bar fills as you read down the page.</span></a>
      <a class="hb-rel" href="../../animations/01-scroll-based/text-fill-on-scroll/"><b>Text Fill on Scroll</b><span>Words light up one by one as you scroll.</span></a>
      <a class="hb-rel" href="../../animations/06-3d-advanced/scroll-driven-3d-rotation/"><b>Scroll-Driven 3D Rotation</b><span>Scrolling turns a 3D cube from pose to pose.</span></a>
    </div>
  </section>

  <nav class="hb-lesson-nav" aria-label="Learning path">
    <p class="hb-lesson-title">Learning path</p>
    <a class="hb-lesson-prev" href="../../animations/04-micro-interactions/loading-spinner/"><span>← Lesson 10</span><b>Loading Spinner</b></a>
    <a class="hb-lesson-next" href="../../animations/01-scroll-based/reveal-on-scroll/"><span>Lesson 12 →</span><b>Reveal on Scroll</b></a>
    <a class="hb-lesson-all" href="../">All 25 lessons</a>
  </nav>
</main>
<footer class="hb-foot"><span>Animation Handbook</span><a href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener">Source on GitHub</a><a href="#top">Back to top ↑</a></footer>
<script>
  // The right ball sits as far along its track as the box is scrolled, read once per frame while the box scrolls.
  const box    = document.getElementById('scroll-box');
  const runner = document.getElementById('scroll-runner');
  const where  = document.getElementById('where');
  let ticking  = false;
  function follow() {
    const max = box.scrollHeight - box.clientHeight;
    const p   = max > 0 ? box.scrollTop / max : 0;
    runner.style.transform = `translateX(calc(${p.toFixed(4)} * (100% - 28px)))`;
    where.textContent = `${Math.round(p * 100)}% scrolled`;
    ticking = false;
  }
  box.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(follow); ticking = true; }
  }, { passive: true });
  follow();
</script>
</body>
</html>
```

- [ ] **Step 2: Run all tests** — `node --test "tests/*.test.js"`. Expected: all pass (in this worktree the Learn page does not exist, so `tests/learn.test.js` is not present; Task 8 runs everything together).

- [ ] **Step 3: Page check.** Serve on port 8764 and run `node tools/check-pages.mjs --base http://127.0.0.1:8764 learn/follows-the-scroll`.
Expected: six `ok` lines (the scroll checks run on the right box: it scrolls on arrival, Play, Back to top, a wheel turn stops Play; reduced motion shows the page's own note). Look at the desktop, phone and phone-reduced screenshots: both panels readable at 375px, the right ball part-way along after the arrival run, the left ball at rest under reduced motion.

- [ ] **Step 4: Commit**

```bash
git add learn/follows-the-scroll/index.html
git commit -m "feat: idea lesson 11, Follows the scroll: a ball that plays by itself beside one that follows its box's scroll"
```

---

### Task 7: Lesson 21 · Far things move slower

**Files:**
- Create: `learn/far-things-move-slower/index.html`

**Interfaces:**
- Consumes: Task 1 (boot without a prompt; Pause sends `hb:pause`), Task 2 (lesson CSS).
- Produces: step 21 of the path, linked from Parallax Scrolling's See inside note and lesson nav.

- [ ] **Step 1: Create the page**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Far Things Move Slower — Animation Handbook</title>
  <meta name="description" content="Look out of a moving train: the fence rushes by, the hills crawl and the moon seems to stay put. A short visual lesson on the idea behind parallax.">
  <link rel="canonical" href="https://matinmonshizadeh.github.io/animation-handbook/learn/far-things-move-slower/">
  <link rel="icon" type="image/png" sizes="96x96" href="../../favicon.png">
  <link rel="icon" type="image/svg+xml" href="../../favicon.svg">
  <link rel="apple-touch-icon" href="../../apple-touch-icon.png">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Animation Handbook">
  <meta property="og:title" content="Far Things Move Slower — Animation Handbook">
  <meta property="og:description" content="Look out of a moving train: the fence rushes by, the hills crawl and the moon seems to stay put. A short visual lesson on the idea behind parallax.">
  <meta property="og:url" content="https://matinmonshizadeh.github.io/animation-handbook/learn/far-things-move-slower/">
  <meta property="og:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Far Things Move Slower — Animation Handbook">
  <meta name="twitter:description" content="Look out of a moving train: the fence rushes by, the hills crawl and the moon seems to stay put. A short visual lesson on the idea behind parallax.">
  <meta name="twitter:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <style>
    :root{--ui-accent:#c8f169}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    .stage{position:relative;overflow:hidden;background:#141b33}
    /* Each layer is twice the window's width and repeats halfway, so it can slide forever without a seam */
    .strip{position:absolute;top:0;left:0;width:200%;height:100%;will-change:transform}
    .strip svg{position:absolute;inset:0;width:100%;height:100%}
    .sky{background:linear-gradient(#141b33,#2e2a4a 70%,#3d3456)}
    .moon{position:absolute;top:12%;height:18%;aspect-ratio:1;border-radius:50%;background:#f3e7c4}
    .moon.a{left:14%} .moon.b{left:64%}
    .speeds{position:absolute;inset:0;list-style:none;pointer-events:none}
    .speed{position:absolute;left:clamp(10px,3vw,24px);display:flex;align-items:center;gap:8px;padding:5px 10px;border-radius:999px;
      background:rgba(11,11,13,.8);color:#f4f4f2;font:600 13px/1.2 var(--hb-font)}
    .speed span{font-weight:400;color:#d6d6da}
    .speed i{display:block;height:6px;width:calc(var(--bar,0) * 72px);border-radius:3px;background:var(--ui-accent)}
    .speed:nth-child(1){top:5%} .speed:nth-child(2){top:38%} .speed:nth-child(3){top:60%} .speed:nth-child(4){top:82%}
    @media(prefers-reduced-motion:reduce){.strip{will-change:auto}}
  </style>
  <link rel="stylesheet" href="../../assets/css/demo-page.css?v=8">
  <script src="../../assets/js/demo-page.js?v=8" defer></script>
</head>
<body class="hb hb-learn" data-hb-kind="loop">
<nav class="hb-bar" aria-label="Animation Handbook">
  <a class="hb-home" href="../../"><svg class="hb-mark" viewBox="0 0 32 32" aria-hidden="true"><g class="g"><circle cx="11.16" cy="20.84" r="6.1"/><circle cx="15.12" cy="16.88" r="6.1"/><circle cx="18.51" cy="13.49" r="6.1"/></g><circle class="b" cx="21.2" cy="10.8" r="6.6"/></svg><span>Animation Handbook</span></a>
  <span class="hb-pager"><a href="../../animations/03-page-transitions/flip-technique/" rel="prev" aria-label="Previous lesson: FLIP Technique"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg><span><span class="hb-dir">Previous: </span>FLIP Technique</span></a><a href="../../animations/01-scroll-based/parallax-scrolling/" rel="next" aria-label="Next lesson: Parallax Scrolling"><span><span class="hb-dir">Next: </span>Parallax Scrolling</span><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></a></span>
  <a class="hb-star" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener" aria-label="Star on GitHub"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg><span>Star on GitHub</span></a>
</nav>
<main class="hb-page">
  <header class="hb-head">
    <p class="hb-cat">Lesson 21 of 25 · Idea</p>
    <h1>Far things move slower</h1>
    <p class="hb-lede">Look out of a moving train: the fence rushes by, the hills crawl and the moon seems to stay put. Your eyes use that difference to judge distance.</p>
  </header>

  <section class="hb-step hb-watch" aria-labelledby="hb-watch-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">1</span>
      <div><h2 id="hb-watch-title">Watch it</h2><p>A view from a train window. Each layer slides past at its own speed.</p></div>
    </div>
    <div class="stage" id="stage" role="img" aria-label="A view from a train window: a moon that stays put, mountains that crawl, hills that go faster and a fence that rushes by">
      <div class="strip sky">
        <svg viewBox="0 0 1600 400" preserveAspectRatio="none" aria-hidden="true">
          <defs><pattern id="stars" width="800" height="400" patternUnits="userSpaceOnUse">
            <circle cx="60" cy="40" r="1.5" fill="#fff" opacity=".6"/><circle cx="240" cy="90" r="1.2" fill="#fff" opacity=".5"/>
            <circle cx="390" cy="30" r="1.4" fill="#fff" opacity=".7"/><circle cx="520" cy="110" r="1.1" fill="#fff" opacity=".4"/>
            <circle cx="660" cy="55" r="1.5" fill="#fff" opacity=".6"/><circle cx="760" cy="130" r="1.2" fill="#fff" opacity=".5"/>
          </pattern></defs>
          <rect width="1600" height="400" fill="url(#stars)"/>
        </svg>
        <div class="moon a"></div><div class="moon b"></div>
      </div>
      <div class="strip far">
        <svg viewBox="0 0 1600 400" preserveAspectRatio="none" aria-hidden="true">
          <g id="mtn"><polygon fill="#3b4270" points="0,250 70,190 140,230 230,150 320,215 400,175 480,225 560,160 650,220 730,185 800,250 800,400 0,400"/></g>
          <use href="#mtn" x="800"/>
        </svg>
      </div>
      <div class="strip mid">
        <svg viewBox="0 0 1600 400" preserveAspectRatio="none" aria-hidden="true">
          <g id="hill"><path fill="#2a5a52" d="M0 300 C 100 250, 200 250, 300 290 S 500 330, 600 280 S 750 270, 800 300 L 800 400 L 0 400 Z"/></g>
          <use href="#hill" x="800"/>
        </svg>
      </div>
      <div class="strip near">
        <svg viewBox="0 0 1600 400" preserveAspectRatio="none" aria-hidden="true">
          <defs><pattern id="posts" width="50" height="400" patternUnits="userSpaceOnUse"><rect x="10" y="300" width="8" height="62" fill="#e6d5ad"/></pattern></defs>
          <rect y="355" width="1600" height="45" fill="#1b2a26"/>
          <rect y="316" width="1600" height="5" fill="#d9c7a0"/>
          <rect y="336" width="1600" height="5" fill="#d9c7a0"/>
          <rect width="1600" height="400" fill="url(#posts)"/>
        </svg>
      </div>
      <ul class="speeds" aria-hidden="true">
        <li class="speed"><b>Moon</b><span></span><i></i></li>
        <li class="speed"><b>Mountains</b><span></span><i></i></li>
        <li class="speed"><b>Hills</b><span></span><i></i></li>
        <li class="speed"><b>Fence</b><span></span><i></i></li>
      </ul>
    </div>
    <div class="hb-player">
      <button class="hb-play" type="button" id="btn-pause" data-hb-pause data-state="playing"><svg class="hb-ic hb-i-pause" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg><svg class="hb-ic hb-i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3l14 9-14 9z"/></svg><span class="hb-pause-label">Pause</span></button>
    </div>
  </section>

  <section class="hb-step hb-try" aria-labelledby="hb-try-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">2</span>
      <div><h2 id="hb-try-title">Try it</h2><p>Give every layer the same speed and watch the depth disappear.</p></div>
    </div>
    <div class="hb-settings">
      <div class="hb-setting">
        <label class="hb-switch-row"><span>Same speed for everything</span><input class="hb-switch" type="checkbox" role="switch" id="same" autocomplete="off"></label>
        <p class="hb-hint">On, the scene slides like one flat picture. Off, near things pass faster and it looks deep.</p>
      </div>
    </div>
  </section>

  <section class="hb-why" aria-labelledby="hb-why-title">
    <h2 id="hb-why-title">Why it works</h2>
    <p>Near things cross your view quickly and far things slowly, so your eyes read the difference as distance. Give a picture's far layers small moves and its near layers big moves, and a flat picture looks deep. That is the whole idea behind parallax, and it works best with a few layers and gentle speeds.</p>
  </section>

  <section class="hb-seen" aria-labelledby="hb-seen-title">
    <h2 id="hb-seen-title">Where you'll see it</h2>
    <div class="hb-rel-list">
      <a class="hb-rel" href="../../animations/01-scroll-based/parallax-scrolling/"><b>Parallax Scrolling</b><span>Far layers move slower than near ones as you scroll.</span></a>
      <a class="hb-rel" href="../../animations/01-scroll-based/parallax-depth-of-field/"><b>Parallax Depth-of-Field</b><span>Layers move at their own speed as the focus shifts.</span></a>
      <a class="hb-rel" href="../../animations/06-3d-advanced/2-5d-pseudo-3d/"><b>2.5D / Pseudo-3D</b><span>Flat layers slide by different amounts, faking depth.</span></a>
      <a class="hb-rel" href="../../animations/06-3d-advanced/depth-map-photo/"><b>Depth-Map Photo</b><span>A flat photo turns 3D as you point: near parts shift more.</span></a>
      <a class="hb-rel" href="../../animations/07-ambient-background/wave-layers/"><b>Wave Layers</b><span>Layers of waves drift sideways, each at its own speed.</span></a>
      <a class="hb-rel" href="../../animations/07-ambient-background/grid-dot-pattern-parallax/"><b>Grid / Dot Pattern Parallax</b><span>A dot grid shifts gently against your pointer for depth.</span></a>
    </div>
  </section>

  <nav class="hb-lesson-nav" aria-label="Learning path">
    <p class="hb-lesson-title">Learning path</p>
    <a class="hb-lesson-prev" href="../../animations/03-page-transitions/flip-technique/"><span>← Lesson 20</span><b>FLIP Technique</b></a>
    <a class="hb-lesson-next" href="../../animations/01-scroll-based/parallax-scrolling/"><span>Lesson 22 →</span><b>Parallax Scrolling</b></a>
    <a class="hb-lesson-all" href="../">All 25 lessons</a>
  </nav>
</main>
<footer class="hb-foot"><span>Animation Handbook</span><a href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener">Source on GitHub</a><a href="#top">Back to top ↑</a></footer>
<script>
  const FRAME  = 1000 / 60;
  // Window widths per second: the moon stays put, the mountains crawl, the hills go faster, the fence rushes by
  const SPEEDS = [0, 0.02, 0.07, 0.4];
  const SAME   = 0.1;
  const WORDS  = ['stays put', 'slow', 'faster', 'fastest'];
  const stage  = document.getElementById('stage');
  const strips = [...stage.querySelectorAll('.strip')];
  const tags   = [...stage.querySelectorAll('.speed')];
  const same   = document.getElementById('same');
  const pos    = strips.map(() => 0);
  let lastT = null, raf = 0, paused = false;

  function speedOf(i) { return same.checked ? SAME : SPEEDS[i]; }
  function frame(ts) {
    const dt = lastT === null ? 0 : Math.min(ts - lastT, 50);
    lastT = ts;
    const w = stage.clientWidth;
    strips.forEach((s, i) => {
      pos[i] = (pos[i] + speedOf(i) * w / 60 * (dt / FRAME)) % w;
      s.style.transform = `translate3d(${-pos[i].toFixed(2)}px,0,0)`;
    });
    raf = requestAnimationFrame(frame);
  }
  function start() { if (!raf && !paused && !document.hidden) { lastT = null; raf = requestAnimationFrame(frame); } }
  function stop() { cancelAnimationFrame(raf); raf = 0; }
  // Pause and Play (and reduced motion, which starts the page paused) come from the shared script
  document.addEventListener('hb:pause', e => { paused = e.detail.paused; if (paused) stop(); else start(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });

  // Each label says how fast its layer goes, in words and as a bar a share of the fence's speed
  function describe() {
    tags.forEach((t, i) => {
      t.querySelector('span').textContent = same.checked ? 'same speed' : WORDS[i];
      t.style.setProperty('--bar', speedOf(i) / SPEEDS[3]);
    });
    stage.setAttribute('aria-label', same.checked
      ? 'A view from a train window where every layer slides at the same speed, like one flat picture'
      : 'A view from a train window: a moon that stays put, mountains that crawl, hills that go faster and a fence that rushes by');
  }
  same.addEventListener('change', describe);
  describe();
  start();
</script>
</body>
</html>
```

- [ ] **Step 2: Run all tests** — `node --test "tests/*.test.js"`. Expected: all pass.

- [ ] **Step 3: Page check.** Serve on port 8765 and run `node tools/check-pages.mjs --base http://127.0.0.1:8765 learn/far-things-move-slower`.
Expected: six `ok` lines (the loop checks: it moves, Pause stops it at once and Play starts it again; under reduced motion it starts paused). Look at the desktop, phone and phone-reduced screenshots: the four labels readable and not covering each other at 375px, the bars clearly different (the fence's longest, the moon's none), the scene seamless (no gap at the strip edge after it has moved).

- [ ] **Step 4: Commit**

```bash
git add learn/far-things-move-slower/index.html
git commit -m "feat: idea lesson 21, Far things move slower: a train-window scene whose layers slide at their own speeds, and a switch that makes them move as one"
```

---

### Task 8: Integration, version bump, whole-site check and final review

**Files:**
- Modify: `learn/index.html` (steps 11 and 21 become links)
- Modify: every page that links the shared files (`animations/*/*/index.html`, `index.html`, `learn/**/index.html`): `?v=8` → `?v=9`

- [ ] **Step 1: Merge.** In the main checkout on `feat/learn-pilot`, merge the Phase B lane branches one at a time (`git merge --no-ff <lane branch>`), resolving conflicts if any (none are expected: the lanes touch different files, except that Task 4 may have fixed `modeProblems` in `tools/check-pages.mjs`).

- [ ] **Step 2: Link the built lessons.** In `learn/index.html` replace

```html
      <li data-step="11" data-kind="idea" data-soon><div><span class="n">11</span><span class="k">Idea · Not built yet</span><b>Follows the scroll</b><span class="line">Some animations play by themselves; others move only when you scroll.</span></div></li>
```

with

```html
      <li data-step="11" data-kind="idea"><a href="follows-the-scroll/"><span class="n">11</span><span class="k">Idea</span><b>Follows the scroll</b><span class="line">Some animations play by themselves; others move only when you scroll.</span></a></li>
```

and

```html
      <li data-step="21" data-kind="idea" data-soon><div><span class="n">21</span><span class="k">Idea · Not built yet</span><b>Far things move slower</b><span class="line">Near things pass quickly and far things slowly: that is how depth looks.</span></div></li>
```

with

```html
      <li data-step="21" data-kind="idea"><a href="far-things-move-slower/"><span class="n">21</span><span class="k">Idea</span><b>Far things move slower</b><span class="line">Near things pass quickly and far things slowly: that is how depth looks.</span></a></li>
```

In `tests/pages.test.js` remove the temporary `|| href.includes('/learn/')` from the mode-switch test's note-link check (the lesson now exists).

- [ ] **Step 3: Bump the shared files' version**

```bash
grep -rl --include=index.html "demo-page\.\(css\|js\)?v=8" . | grep -v node_modules | xargs sed -i 's/demo-page\.css?v=8/demo-page.css?v=9/; s/demo-page\.js?v=8/demo-page.js?v=9/'
grep -rl --include=index.html "demo-page\.\(css\|js\)?v=8" . | wc -l
```

Expected: the second command prints `0`. (`sed -i` keeps each file's line endings; check `git diff --stat` shows one changed line per page.)

- [ ] **Step 4: Tests and generated files**

Run: `node --test "tests/*.test.js"` — expected: all pass, now including the lesson-line and lesson-nav tests for steps 11, 21 and 22 and the two idea-lesson tests.
Run: `node tools/make-skill.mjs` then `git status --short` — expected: no change to `skills/` or `llms.txt`.

- [ ] **Step 5: Page checks.** Serve the main checkout on port 8770 (background) and run
`node tools/check-pages.mjs --base http://127.0.0.1:8770 animations/01-scroll-based/parallax-scrolling learn home`
Expected: six `ok` lines for each of: Parallax Scrolling, `learn`, `learn/far-things-move-slower`, `learn/follows-the-scroll`, `home`.
Then the whole site, in seven background runs (one per category folder, each under 30 minutes):
`node tools/check-pages.mjs --base http://127.0.0.1:8770 animations/01-scroll-based` … `animations/07-ambient-background`. Expected: no `FAIL` line anywhere.

- [ ] **Step 6: Final review (two reviewers in parallel).**
  - Reviewer A (visual and plain words): opens the mode screenshots of Parallax Scrolling (desktop, laptop, tablet, phone, phone-reduced, phone-small) and the Learn pages' screenshots; checks See inside and Compare are understandable from the picture alone, labels readable, notes plain, nothing cut off, and that every text follows the Global Constraints.
  - Reviewer B (code and tests): reads the diff `git diff main...feat/learn-pilot`; checks the spec is met, the shared script still behaves exactly as before on every other page, no `hb-view`, frame loops by elapsed time, listeners at the top level, tests meaningful.
  Fix what they find, re-run Steps 4-5 for what changed.

- [ ] **Step 7: Commit, clean up**

```bash
git add -A learn tests animations index.html tools assets
git commit -m "chore: the shared files at v=9 on every page, and the Learn page links the two idea lessons"
```

Stop every server started for the lanes; remove the lane worktrees and branches once merged; delete any `hb-chrome-*` folders left in the temp folder.

---

### Task 9: Owner review

- [ ] **Step 1:** Start the preview (`.claude/launch.json` → `static-site`, port 8731) in the browser pane at `/animations/01-scroll-based/parallax-scrolling/`.
- [ ] **Step 2:** Send the owner the screenshots: Parallax Scrolling in Normal, See inside and Compare at desktop and phone size; the Learn page; the two idea lessons.
- [ ] **Step 3:** Ask, in very short and simple words, whether to roll it out to all 166 animations, and what to change. Nothing is pushed or published without the owner's go-ahead.
