# Guided-Steps Template: Do-It and Scroll Pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Teach the shared guided-steps files, the page checks and the browser tool the last two kinds of page — "do it" pages (Show me, Reset) and "scroll" pages (Play, Back to top) — and pages without settings, so the remaining five categories can be converted in parallel.

**Architecture:** Task 1 makes Try it optional (pages without settings). Task 2 adds the do-it kind. Task 3 adds the scroll kind. Each task changes `assets/js/demo-page.js`, `assets/css/demo-page.css`, `tests/pages.test.js` and `tools/check-pages.mjs` together and proves the change on a scratch page; the last task bumps the shared-file version on every converted page.

**Tech Stack:** Plain HTML, CSS and vanilla JavaScript (no build step); Node's built-in test runner; `tools/check-pages.mjs` (Node and the local Chrome).

**Specs:** `docs/superpowers/specs/2026-09-27-demo-page-rollout-design.md` (four kinds, markers table, reduced motion) and `docs/superpowers/specs/2026-09-27-demo-page-guided-steps-design.md`. **Reference pages:** the 27 converted pages in `animations/02-entrance-and-exit/` and `animations/05-text-typography/` (plays-once and loop kinds).

## Global Constraints

- Plain HTML + CSS + vanilla JS only. No build step, no frameworks, no npm packages, no CDN scripts or fonts.
- The behaviour of the 27 converted pages must not change. Their only edit in this plan is the shared-file version (`?v=3` → `?v=4`, Task 4).
- User rulings that bind every kind: scroll and do-it pages show themselves once on arrival (the box scrolls through once; a Show me run plays once) and then wait for the visitor; with reduced motion nothing runs by itself, and Play, Back to top, Show me and Reset still work when pressed; Loop and Slow motion are greyed out under reduced motion where a page has them.
- Page kinds are declared on the body: `<body class="hb" data-hb-kind="do" data-hb-autoplay>` and `<body class="hb" data-hb-kind="scroll" data-hb-autoplay>` (the autoplay attribute asks for the one run on arrival).
- The page's script reaches the player controls by their ids (`btn-demo`, `btn-reset`, `btn-scroll`, `btn-top`, and the existing ones), never by their `data-hb-*` attributes.
- Every page, every kind: the Watch it step title and help line are written into the page (step 1 may be "Hover it", "Click it", "Drag it", "Press Tab" or "Scroll it"); controls are at least 44×44px on phones; hover effects only inside `@media (hover: hover)` and every hover has a tap equivalent.
- Tests: `node --test "tests/*.test.js"` from the repo root. Browser check: `node tools/check-pages.mjs <page or category folder>` with the static server at `http://127.0.0.1:8731`.
- Scratch files go in `.superpowers/scratch/` (ignored by git). Never delete with a wildcard or a command substitution in the path. Never write a raw non-breaking space; if a backslash-u escape must appear in a file, check afterwards that the file holds the literal characters.
- Commit messages: a lower-case prefix (`feat:`, `test:`, `docs:`, `fix:`) and a plain sentence.

---

### Task 1: Pages without settings

**Files:**
- Modify: `tests/pages.test.js`
- Scratch only: `.superpowers/scratch/no-settings/` (a copy of `animations/02-entrance-and-exit/fade-in-out/` with its Try it step removed)

**Interfaces:**
- Produces, for the category plans: a page whose demo has no settings leaves out the Try it section entirely; its steps are numbered 1 (Watch it or its do/scroll title) and 2 (Copy the prompt); it keeps the `<ul class="hb-chips">` markup (the shared script hides the box when there are no settings); its prompt does not end with "Match the settings listed below."; its README keeps a Key parameters table describing the technique's own values (not settings).

The shared script already copes with a missing Try it (`settings()` returns `[]`, the chips box is hidden, the copied text has no settings line); only the page checks assume every page has settings.

- [ ] **Step 1: Make the page checks accept pages without Try it**

In `tests/pages.test.js`, in the guided-steps page test:
1. Remove `'<section class="hb-step hb-try"'` from the list of parts that must appear exactly once, and add after that loop: `assert.ok(count(html, '<section class="hb-step hb-try"') <= 1, 'at most one Try it step');` and `const hasTry = html.includes('<section class="hb-step hb-try"');`.
2. Replace the prompt-ending assertion with: `if (hasTry) assert.ok(prompt.trim().endsWith('Match the settings listed below.'), 'prompt ending'); else assert.ok(!prompt.includes('Match the settings listed below.'), 'a page without settings does not point to them');`.
3. Wrap the main-settings count and the hint count (from `const tryIt = tryItOf(html);` to the hint assertion) in `if (hasTry) { … }`.
4. In the "every setting has a label" test and the "Try it and the README Key parameters name the same settings" test, return early when the page has no Try it step (`if (!pageOf(d).includes('<section class="hb-step hb-try"')) return;`).
5. In the autocomplete test, change `assert.ok(fields.length > 0, 'the page has fields');` to apply only when the page has a Try it step.
6. `tryItOf` returns `''` when Try it is missing because `between()` finds no start — check that and leave it.

- [ ] **Step 2: Prove it on a scratch page**

Copy `animations/02-entrance-and-exit/fade-in-out/index.html` and `README.md` to `.superpowers/scratch/no-settings/`; delete its whole Try it `<section>`, renumber Copy the prompt to 2, and shorten the prompt so it no longer ends with "Match the settings listed below.". Temporarily copy the folder into `animations/02-entrance-and-exit/zz-no-settings/`, run `node --test "tests/*.test.js"` (the scratch page passes; nothing else changes), then delete that temporary folder by its exact path (`rm -r animations/02-entrance-and-exit/zz-no-settings`) and confirm `git status` shows no trace of it. Run `node tools/check-pages.mjs .superpowers/scratch/no-settings` (six `ok` lines: no chips, no warnings).

- [ ] **Step 3: Commit**

```bash
git add tests/pages.test.js
git commit -m "test: accept guided-steps pages whose demo has no settings"
```

---

### Task 2: Do-it pages — Show me and Reset

**Files:**
- Modify: `assets/js/demo-page.js`, `assets/css/demo-page.css`, `tests/pages.test.js`, `tools/check-pages.mjs`
- Scratch only: `.superpowers/scratch/do-page/`

**Interfaces:**
- Produces, for the category plans:
  - The Show me button, exactly: `<button class="hb-play" type="button" id="btn-demo" data-hb-demo><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"/></svg>Show me</button>`. The page's own click handler plays one example of the interaction (about two to four seconds) and returns the demo to rest.
  - The Reset button, where the demo has a state to reset, exactly: `<button class="hb-play" type="button" id="btn-reset" data-hb-reset><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>Reset</button>`. The page's click handler returns the demo to its starting state.
  - On arrival (body `data-hb-autoplay`, not reduced motion) the shared script presses Show me once, 400ms after load.
  - The document event `hb:input`, sent by the shared script when the visitor presses, types, scrolls, touches or clicks inside the stage (trusted `pointerdown`, `keydown`, `wheel`, `touchstart` or `click`; the click is there for an activation that comes with no pointer or key event, from assistive technology). A page stops a Show me run that is under way when it receives it, leaving the visitor in control.
  - Slow motion may appear on a do-it page where it works (the existing `data-hb-slowmo`, "css" or page mode).
  - On phones, two buttons in the player bar share one row.

- [ ] **Step 1: Write the failing page checks**

In `tests/pages.test.js`, after the `if (kind === 'loop') { … }` block, add:

```js
    if (kind === 'do') {
      assert.equal(count(html, 'data-hb-demo'), 1, 'one Show me control');
      assert.ok(player.includes('<button class="hb-play" type="button" id="btn-demo" data-hb-demo>'), 'Show me is in the player bar');
      assert.ok(count(html, 'data-hb-reset') <= 1 && count(player, 'data-hb-reset') === count(html, 'data-hb-reset'),
        'at most one Reset, in the player bar');
      for (const other of ['data-hb-replay', 'data-hb-loop', 'data-hb-pause', 'data-hb-autoscroll', 'data-hb-top']) {
        assert.equal(count(html, other), 0, `a do-it page has no ${other}`);
      }
    }
```

and add `'data-hb-demo', 'data-hb-reset'` to the marker list that checks "at most one, inside the player bar".

Run: `node --test "tests/*.test.js"` — all pass (no do-it page exists yet); the check is exercised in Step 5.

- [ ] **Step 2: Show me, Reset and visitor input in `assets/js/demo-page.js`**

1. In `boot`, after `var player = page.querySelector('.hb-player');`, add:

```js
    var demoCtl = page.querySelector('[data-hb-demo]');
```

2. Directly before the reduced-motion comment block (`// While the device asks for reduced motion, …`), add:

```js
    // Do-it pages: the visitor's own press, key, wheel or touch inside the stage is sent as "hb:input", so the page
    // can stop a Show me run that is under way and leave the visitor in control.
    function setUpVisitorInput() {
      ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (type) {
        stage.addEventListener(type, function (e) {
          if (e.isTrusted) doc.dispatchEvent(new win.CustomEvent('hb:input', { detail: { type: type } }));
        }, { capture: true, passive: true });
      });
    }
```

3. After the line `if (pauseCtl) pauseCtl.addEventListener('click', function () { setPaused(!paused); });`, add:

```js
    if (demoCtl && stage) setUpVisitorInput();
```

4. In the arrival block (`if (doc.body.hasAttribute('data-hb-autoplay')) { win.setTimeout(function () { … }, 400); }`), make this the first line inside the timeout function, leaving the rest unchanged:

```js
        if (demoCtl) { if (!(reduce && reduce.matches)) demoCtl.click(); return; }
```

(Plays-once pages keep today's behaviour exactly: under reduced motion they press Replay once; otherwise they switch Loop on, or press Replay when Loop is already on or missing. A do-it page runs Show me once, and nothing under reduced motion.)

- [ ] **Step 3: Styles in `assets/css/demo-page.css`**

In the `@media(max-width:600px)` block, after the loop-page rule (`.hb-player:has(> [data-hb-pause] + .hb-toggle) > .hb-play{grid-column:auto}`), add:

```css
  /* Two buttons in the player bar (Show me and Reset, Play and Back to top) share one row */
  .hb-player:has(> .hb-play + .hb-play) > .hb-play{grid-column:auto}
```

- [ ] **Step 4: The browser tool**

In `tools/check-pages.mjs`, after `loopProblems`, add:

```js
// Do-it pages: Show me must visibly move the stage within 1.6 s, and under reduced motion the page must not move by
// itself. Show me runs on arrival, so the desktop check first waits for that run to end.
async function demoProblems(reduced) {
  if (!(await evaluate(`!!document.querySelector('[data-hb-demo]')`))) return ['no Show me button to check'];
  const problems = [];
  if (reduced && await stageChanges(1500)) problems.push('the stage moves by itself under reduced motion');
  if (!reduced) await sleep(5000);
  const rest = await stageShot();
  await evaluate(`document.querySelector('[data-hb-demo]').click()`);
  let moved = false;
  for (let i = 0; i < 8 && !moved; i++) { await sleep(200); moved = (await stageShot()) !== rest; }
  if (!moved) problems.push('Show me does not visibly move the stage');
  return problems;
}
```

and after the loop call site add:

```js
        if (result.kind === 'do' && (setup.moves || setup.reduce)) problems.push(...await demoProblems(!!setup.reduce));
```

Update the header comment to mention do-it pages.

- [ ] **Step 5: Prove it on a scratch do-it page**

Create `.superpowers/scratch/do-page/index.html` and `README.md` from `animations/02-entrance-and-exit/fade-in-out/`: body `data-hb-kind="do" data-hb-autoplay`; step 1 titled "Click it" with the help line "Click the box, or press Show me."; the stage holds one `<button class="box">` that toggles a class `.on` (scale 1 → 1.2 with a 300ms transition) when clicked; the player bar holds Show me and Reset (markup above); the page script: Show me adds `.on`, removes it after 1200ms (one example, then rest), and cancels that timer on `document`'s `hb:input` and on Reset (which also removes `.on`). Temporarily copy it to `animations/02-entrance-and-exit/zz-do-page/`, run the tests with the temporary page's home-card test skipped (`node --test --test-skip-pattern="zz-.*: the home page card" "tests/*.test.js"`; they pass), delete the temporary folder by its exact path, and confirm `git status` is clean of it. Run `node tools/check-pages.mjs .superpowers/scratch/do-page` — six `ok` lines. In headless Chrome confirm: on arrival Show me runs once; under reduced motion nothing runs until Show me is pressed; a real click inside the stage during a run sends `hb:input` and the run stops; on a 375px phone Show me and Reset share one row.

- [ ] **Step 6: Run everything and commit**

Run `node --test "tests/*.test.js"` (all pass) and `node tools/check-pages.mjs animations/02-entrance-and-exit animations/05-text-typography` (162 `ok` lines — nothing changes for the converted pages). Commit:

```bash
git add assets/js/demo-page.js assets/css/demo-page.css tests/pages.test.js tools/check-pages.mjs
git commit -m "feat: support do-it demos with Show me and Reset"
```

---

### Task 3: Scroll pages — Play and Back to top

**Files:**
- Modify: `assets/js/demo-page.js`, `tests/pages.test.js`, `tools/check-pages.mjs`
- Scratch only: `.superpowers/scratch/scroll-page/`

**Interfaces:**
- Produces, for the category plans:
  - The Play button, exactly: `<button class="hb-play" type="button" id="btn-scroll" data-hb-autoscroll><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>Play</button>`. The shared script scrolls the box from where it is to its end at a steady speed (the whole box in about six seconds), starting again from the top when it is already at the end.
  - The Back to top button, exactly: `<button class="hb-play" type="button" id="btn-top" data-hb-top><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>Back to top</button>`. The shared script stops any automatic scroll and jumps the box to the top.
  - The box that scrolls is the `.stage`, or the element marked `data-hb-scroller` when the stage holds its own scroller.
  - The visitor's own wheel, touch, press, key or click input anywhere in the stage (trusted events only) stops an automatic scroll.
  - On arrival (body `data-hb-autoplay`, not reduced motion) the shared script presses Play once, 400ms after load. Under reduced motion nothing scrolls by itself; Play still works.

- [ ] **Step 1: Write the failing page checks**

In `tests/pages.test.js`, after the `if (kind === 'do') { … }` block, add:

```js
    if (kind === 'scroll') {
      assert.equal(count(html, 'data-hb-autoscroll'), 1, 'one Play control');
      assert.equal(count(html, 'data-hb-top'), 1, 'one Back to top control');
      assert.ok(player.includes('id="btn-scroll" data-hb-autoscroll') && player.includes('id="btn-top" data-hb-top'),
        'Play and Back to top are in the player bar');
      assert.ok(count(html, 'data-hb-scroller') <= 1, 'at most one scroller');
      for (const other of ['data-hb-replay', 'data-hb-loop', 'data-hb-pause', 'data-hb-demo']) {
        assert.equal(count(html, other), 0, `a scroll page has no ${other}`);
      }
    }
```

and add `'data-hb-autoscroll', 'data-hb-top'` to the "at most one, inside the player bar" marker list.

- [ ] **Step 2: Automatic scroll in `assets/js/demo-page.js`**

1. In `boot`, after `var demoCtl = …`, add:

```js
    var scrollCtl = page.querySelector('[data-hb-autoscroll]');
    var topCtl = page.querySelector('[data-hb-top]');
    var scroller = page.querySelector('[data-hb-scroller]') || stage;
```

2. After `setUpVisitorInput`, add:

```js
    // Scroll pages: Play scrolls the box from where it is to its end at a steady speed (the whole box in about six
    // seconds), from the top when it is already at the end. The visitor's own wheel, touch, press or key input on the
    // box stops it, and so does Back to top, which jumps the box to the top.
    var FULL_SCROLL_MS = 6000;
    var scrollFrame = 0;
    function stopScroll() {
      if (scrollFrame) win.cancelAnimationFrame(scrollFrame);
      scrollFrame = 0;
    }
    function scrollBox(top) { scroller.scrollTo({ top: top, behavior: 'instant' }); }
    function autoscroll() {
      stopScroll();
      var end = scroller.scrollHeight - scroller.clientHeight;
      if (end <= 0) return;
      if (scroller.scrollTop >= end - 2) scrollBox(0);
      var pos = scroller.scrollTop, last = 0, speed = end / FULL_SCROLL_MS;
      function step(now) {
        if (last) pos = Math.min(end, pos + (now - last) * speed);
        last = now;
        scrollBox(pos);
        scrollFrame = pos < end ? win.requestAnimationFrame(step) : 0;
      }
      scrollFrame = win.requestAnimationFrame(step);
    }
    function setUpScroll() {
      scrollCtl.addEventListener('click', autoscroll);
      if (topCtl) topCtl.addEventListener('click', function () { stopScroll(); scrollBox(0); });
      ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(function (type) {
        scroller.addEventListener(type, function (e) { if (e.isTrusted) stopScroll(); }, { passive: true });
      });
    }
```

3. After `if (demoCtl && stage) setUpVisitorInput();`, add `if (scrollCtl && scroller) setUpScroll();`.

4. In the arrival block, directly after the `if (demoCtl) { … }` line, add:

```js
        if (scrollCtl) { if (!(reduce && reduce.matches)) scrollCtl.click(); return; }
```

- [ ] **Step 3: The browser tool**

In `tools/check-pages.mjs`, after `demoProblems`, add:

```js
// Scroll pages: the box scrolls by itself on arrival (not under reduced motion); Back to top returns it to the top and
// stops it; Play scrolls it; a real wheel turn over the box stops Play.
async function scrollProblems(reduced) {
  const box = `(document.querySelector('[data-hb-scroller]') || document.querySelector('.hb-page .stage'))`;
  const pos = () => evaluate(`${box}.scrollTop`);
  const problems = [];
  const arrived = await pos();
  if (reduced && arrived > 0) problems.push('the box scrolls by itself under reduced motion');
  if (!reduced && arrived <= 0) problems.push('the box does not scroll by itself on arrival');
  await evaluate(`document.querySelector('[data-hb-top]').click()`);
  await sleep(500);
  if (await pos() !== 0) problems.push('Back to top does not return the box to the top and stop it');
  await evaluate(`document.querySelector('[data-hb-autoscroll]').click()`);
  await sleep(800);
  if (await pos() <= 0) problems.push('Play does not scroll the box');
  const c = await evaluate(`(() => { const b = ${box}.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + Math.min(b.height, innerHeight - b.top) / 2 }; })()`);
  await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: c.x, y: c.y, deltaX: 0, deltaY: 40 });
  await sleep(300);
  const held = await pos();
  await sleep(600);
  if (await pos() !== held) problems.push('turning the wheel does not stop Play');
  return problems;
}
```

and after the do-it call site add:

```js
        if (result.kind === 'scroll' && (setup.moves || setup.reduce)) problems.push(...await scrollProblems(!!setup.reduce));
```

Update the header comment to mention scroll pages.

- [ ] **Step 4: Prove it on a scratch scroll page**

Create `.superpowers/scratch/scroll-page/` from `animations/02-entrance-and-exit/fade-in-out/`: body `data-hb-kind="scroll" data-hb-autoplay`; step 1 titled "Scroll it" with the help line "Scroll inside the box, or press Play and it scrolls for you."; the stage gets `overflow-y:auto` in the page's own `.stage` rule and holds twelve tall cards that fade in as they enter the box (an IntersectionObserver with the stage as root); the player bar holds Play and Back to top (markup above); no Try it step (Task 1). Temporarily copy it into `animations/02-entrance-and-exit/zz-scroll-page/`, run the tests with the temporary page's home-card test skipped (`node --test --test-skip-pattern="zz-.*: the home page card" "tests/*.test.js"`), delete the temporary folder by its exact path, confirm `git status` is clean of it. Run `node tools/check-pages.mjs .superpowers/scratch/scroll-page` — six `ok` lines. In headless Chrome confirm: arrival scrolls the box once to its end in about six seconds; a real wheel turn, touch or press stops it; Back to top jumps to the top and stops; Play at the end starts again from the top; under reduced motion nothing scrolls until Play is pressed; on a 375px phone Play and Back to top share one row.

- [ ] **Step 5: Run everything and commit**

Run `node --test "tests/*.test.js"` and `node tools/check-pages.mjs animations/02-entrance-and-exit animations/05-text-typography` (162 `ok` lines). Commit:

```bash
git add assets/js/demo-page.js tests/pages.test.js tools/check-pages.mjs
git commit -m "feat: support scroll demos with Play and Back to top"
```

---

### Task 4: Shared-file version

**Files:** every converted page (`animations/02-entrance-and-exit/*/index.html`, `animations/05-text-typography/*/index.html`)

- [ ] **Step 1:** Change `demo-page.css?v=3` → `?v=4` and `demo-page.js?v=3` → `?v=4` on all 27 pages (the version test requires one version everywhere). Run the tests and `node tools/check-pages.mjs animations/02-entrance-and-exit animations/05-text-typography` (162 `ok`).
- [ ] **Step 2:** Commit — `chore: load version 4 of the shared page files`.
