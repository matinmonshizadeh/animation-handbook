# Guided-Steps Rollout: Text & Typography — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the fourteen Text & Typography pages to the guided-steps page, add the "loops" kind of page (Pause, and Slow motion for demos that run forever), and fix the text issues carried over from Entrance & Exit.

**Architecture:** Task 1 fixes the carried-over text issues on three Entrance & Exit pages. Task 2 teaches the shared files (`assets/css/demo-page.css`, `assets/js/demo-page.js`), the page checks and the browser tool about loop pages. Task 3 writes the content sheet that decides each page's kind, plain settings, words and prompt. Tasks 4–10 convert two pages each. Task 11 checks both converted categories in a browser.

**Tech Stack:** Plain HTML, CSS and vanilla JavaScript (no build step); Node's built-in test runner; `tools/check-pages.mjs` (Node and the local Chrome).

**Specs:** `docs/superpowers/specs/2026-09-27-demo-page-guided-steps-design.md`, `docs/superpowers/specs/2026-09-27-demo-page-rollout-design.md`. **Reference pages:** the thirteen Entrance & Exit pages (`animations/02-entrance-and-exit/*/`), all live in the guided-steps design; `rotate-in` is the model for plays-once pages.

## Global Constraints

- Plain HTML + CSS + vanilla JS only. No build step, no frameworks, no npm packages, no CDN scripts or fonts.
- In scope: the fourteen pages in `animations/05-text-typography/`, their READMEs and home-page cards; `split-text-reveal`, `word-by-word-reveal` and the `letter-by-letter-stagger` README in Entrance & Exit (Task 1 only); the version number on the Entrance & Exit pages' shared-file links (Task 2 only); the shared files, the tests and the browser tool. `assets/css/handbook.css`, `assets/js/handbook.js` and `tests/handbook.test.js` stay as they are.
- Two kinds of page in this category:
  - **Plays once:** `<body class="hb" data-hb-kind="once" data-hb-autoplay>`; Watch it help line "It plays by itself. Turn on slow motion to see each part of the movement."; player bar Replay · Loop · Slow motion; Try it help line "Change a setting and the animation plays again." — exactly as on the Entrance & Exit pages.
  - **Loops:** `<body class="hb" data-hb-kind="loop">` (no autoplay attribute); Watch it help line "It moves by itself. Pause it to look closely." or, with Slow motion, "It moves by itself. Pause it to look closely, or turn on slow motion to see each part of the movement."; player bar Pause (and Slow motion where it works), no Replay and no Loop; Try it help line "Change a setting and see the difference as it moves."
- The Pause button is exactly `<button class="hb-play" type="button" id="btn-pause" data-hb-pause="css" data-state="playing"><svg class="hb-ic hb-i-pause" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg><svg class="hb-ic hb-i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3l14 9-14 9z"/></svg><span class="hb-pause-label">Pause</span></button>`, with `data-hb-pause` written without a value when the page's own script runs the loop (see Task 2). It has no `aria-pressed`: its label already says what it will do.
- Reduced motion (user ruling): Loop and Slow motion are shown switched off and cannot be switched on, with a short note; Replay, Pause and Play still work; loops start paused (the shared script does this).
- Stage font (user ruling): stage text uses the site font (it inherits it; no `font-family` on stage text); only an effect about typing may use a typewriter font, which is the system stack `ui-monospace,'SFMono-Regular',Menlo,Consolas,'Liberation Mono',monospace`. No `@font-face` in any page; the old `Bricolage` and `PlexMono` faces go.
- Replay must restart the animation on the animated pieces themselves (rebuild or reset the pieces, force a reflow with `void el.offsetWidth`, then show them), never only on their container.
- Every player switch and every input, select and textarea in Try it has `autocomplete="off"`.
- The shared files are linked as `../../../assets/css/demo-page.css?v=3` and `../../../assets/js/demo-page.js?v=3` on every guided-steps page (this plan changes both files, so the number goes from 2 to 3 everywhere).
- Settings rules: plain labels, named choices over numbers, switches for on/off, one hint each (at most 60 characters), one to three main settings, the rest under More options, playback is not a setting, no readouts; colour pickers become named swatches; radio groups become choice buttons; text values appear quoted in "Your settings".
- Prompts: 60–130 words, fill-in parts in square brackets, end with "Match the settings listed below.", no code, nothing stated as fixed that a setting controls, a reduced-motion sentence, a touch equivalent for any hover.
- Touch targets at least 44×44px on phones; hover rules only inside `@media (hover: hover)`; stage text contrast at least 4.5:1; no horizontal scroll from 320px up.
- Words on the page are plain; never "stunning", "amazing" or "powerful"; no code anywhere on the page.
- Text & Typography pages keep `--ui-accent:#ff6f8b` (the category colour) and the category line `05.NN · Text &amp; Typography`.
- Tests: `node --test "tests/*.test.js"` from the repo root (the directory form does not work on this machine). Browser check: `node tools/check-pages.mjs <page or category folder>` with the static server at `http://127.0.0.1:8731` (start one from the repo root with `python -m http.server 8731 --bind 127.0.0.1` if nothing answers).
- Scratch files go in `.superpowers/scratch/` (ignored by git). Never delete with a wildcard or a command substitution in the path.
- Commit messages: a lower-case prefix (`feat:`, `test:`, `docs:`, `fix:`) and a plain sentence.

---

### Task 1: Carried-over text fixes in Entrance & Exit

**Files:**
- Modify: `animations/02-entrance-and-exit/split-text-reveal/index.html`, `animations/02-entrance-and-exit/split-text-reveal/README.md`
- Modify: `animations/02-entrance-and-exit/word-by-word-reveal/index.html`, `animations/02-entrance-and-exit/word-by-word-reveal/README.md`
- Modify: `animations/02-entrance-and-exit/letter-by-letter-stagger/README.md`

**Interfaces:**
- Produces: the word-keeping pattern (letters of one word inside one `span` that cannot break) that Tasks 4–10 reuse for any text they split into letters.

Today the words in Split Text Reveal (Words mode) and Word-by-Word Reveal are separated by a space *and* a `margin-right:0.28em`, so the gaps look loose; in Split Text's Letters mode every letter is its own inline block, so a line can break in the middle of a word; and the Letter-by-Letter README shows a raw non-breaking space where the page's source has the escape `'\u00a0'`.

- [ ] **Step 1: Split Text Reveal — one space between words, words kept whole**

In the `<style>` of `split-text-reveal/index.html`, replace these three lines:

```css
    /* word spacing */
    [data-mode="words"] .unit{margin-right:0.28em}
    [data-mode="chars"] .unit{margin-right:0.01em}
```

with:

```css
    /* Letters mode: the letters of one word sit in one box that never breaks, so lines break only between words */
    .unit-word{display:inline-block;white-space:nowrap}
    [data-mode="chars"] .unit{margin-right:0.01em}
```

In `split()`, replace the Letters branch:

```js
    if(mode==='chars'){
      let unitIdx=0;
      [...text].forEach(c=>{
        if(c===' '){target.appendChild(document.createTextNode(' '));return;}
        const s=document.createElement('span');s.className='unit';s.style.setProperty('--i',unitIdx++);
        s.textContent=c;target.appendChild(s);
      });
    } else {
```

with:

```js
    if(mode==='chars'){
      let unitIdx=0;
      text.split(/\s+/).filter(Boolean).forEach((word,wi,all)=>{
        const w=document.createElement('span');w.className='unit-word';
        [...word].forEach(c=>{
          const s=document.createElement('span');s.className='unit';s.style.setProperty('--i',unitIdx++);
          s.textContent=c;w.appendChild(s);
        });
        target.appendChild(w);
        if(wi<all.length-1)target.appendChild(document.createTextNode(' '));
      });
    } else {
```

The letters keep their order and their `--i` values (spaces never had one), so the timing is unchanged.

In `split-text-reveal/README.md`, replace the How it works snippet that starts with `[...text].forEach(c => {` (the eight lines of that fenced block) with the same logic in the README's spacing:

```js
text.split(/\s+/).filter(Boolean).forEach((word, wi, all) => {
  const w = document.createElement('span');
  w.className = 'unit-word';                 // keeps the word's letters on one line
  [...word].forEach(c => {
    const s = document.createElement('span');
    s.className = 'unit';
    s.style.setProperty('--i', unitIdx++);   // drives its transition-delay
    s.textContent = c;
    w.appendChild(s);
  });
  target.appendChild(w);
  if (wi < all.length - 1) target.appendChild(document.createTextNode(' '));
});
```

- [ ] **Step 2: Word-by-Word Reveal — one space between words**

In `word-by-word-reveal/index.html`, change `.word{display:inline-block;margin-right:0.28em;` to `.word{display:inline-block;` (the rest of the rule stays). In `word-by-word-reveal/README.md`, make the same change in the How it works snippet (line 28: `.word{display:inline-block;margin-right:0.28em;opacity:0;` becomes `.word{display:inline-block;opacity:0;`).

- [ ] **Step 3: Letter-by-Letter README escape**

In `letter-by-letter-stagger/README.md` line 20, the character between the quotes after `c===' '?` is a raw non-breaking space (bytes `C2 A0`). Replace the quoted raw character with the six characters `\u00a0` so the line reads exactly as in the page's source:

```js
  s.textContent=c===' '?'\u00a0':c; // a lone plain space would collapse inside its inline-block
```

Confirm with `LC_ALL=C grep -c $'\xc2\xa0' animations/02-entrance-and-exit/letter-by-letter-stagger/README.md` (prints `0`).

- [ ] **Step 4: Check**

Run `node --test "tests/*.test.js"` (all pass) and `node tools/check-pages.mjs animations/02-entrance-and-exit/split-text-reveal animations/02-entrance-and-exit/word-by-word-reveal` (ten `ok` lines; start the static server first if needed). Then, with a throwaway script in `.superpowers/scratch/` that drives headless Chrome over the DevTools protocol the way `tools/check-pages.mjs` does, open Split Text Reveal at 320×800, choose Letters in "Split into", type `Motion design makes interfaces easier to understand` into "Your text", wait for the reveal to finish, and confirm: every `.unit-word` sits on one line (its `getClientRects().length` is 1 and all its letters share one `top`), and the gap between the last letter of one word and the first letter of the next equals the width of a space in the stage font (measure a `' '` in a hidden span with the same font; within 1px). Do the same gap check on Word-by-Word Reveal between two `.word` spans. Report the measured numbers.

- [ ] **Step 5: Commit**

```bash
git add animations/02-entrance-and-exit/split-text-reveal/index.html animations/02-entrance-and-exit/split-text-reveal/README.md animations/02-entrance-and-exit/word-by-word-reveal/index.html animations/02-entrance-and-exit/word-by-word-reveal/README.md animations/02-entrance-and-exit/letter-by-letter-stagger/README.md
git commit -m "fix: keep words whole and spaces even on the Entrance & Exit text pages"
```

---

### Task 2: Loop pages in the shared template, the page checks and the browser tool

**Files:**
- Modify: `assets/js/demo-page.js`, `assets/css/demo-page.css`
- Modify: `tests/demo-page.test.js`, `tests/pages.test.js`, `tools/check-pages.mjs`
- Modify: the thirteen `animations/02-entrance-and-exit/*/index.html` (`?v=2` becomes `?v=3` on both shared-file links)
- Scratch only (not committed): `.superpowers/scratch/loop-css/` and `.superpowers/scratch/loop-page/`

**Interfaces:**
- Produces, for Tasks 4–10:
  - The Pause button (markup in Global Constraints). With `data-hb-pause="css"` the shared script pauses the stage's CSS animations itself, by putting the class `hb-paused` on the `.stage` (the stylesheet then holds every CSS animation on the stage and its `::before`/`::after`, overriding the page's own `animation-play-state` only while paused). With `data-hb-pause` without a value, the page pauses its own loop.
  - The event `hb:pause` on `document`, with `event.detail.paused` (`true` or `false`), sent every time the Pause button changes state, in both modes, including when the shared script pauses a loop on arrival under reduced motion. A page whose script runs timers or animation frames listens for it and stops or restarts them; a step already under way may finish.
  - The Slow motion switch as on Rotate In, with `data-hb-slowmo="css"` when the shared script should slow the stage: while it is on, every CSS animation and transition on the stage runs at a third of its speed (`playbackRate` 1/3, including animations that start later); turning it off restores speed 1. Without a value, the page slows its own timings. A page with both CSS animations and its own timers may use `css` for the animations and also scale its own timers while `slow.checked` is true.
  - Loops start paused under reduced motion (the shared script does it and sends `hb:pause`); a page's own reduced-motion CSS may simplify the looping movement but must not remove or pause it, or Play would do nothing.
  - The reduced-motion note in the player bar: "It starts paused and Slow motion is off because your device is set to reduce motion." (loop with Slow motion), "It starts paused because your device is set to reduce motion." (loop without it); plays-once pages keep "Loop and Slow motion are off because your device is set to reduce motion." On wide screens the note now sits beside the controls instead of on a line of its own.
  - The page checks: a loop page has exactly one Pause button, in the player bar, starting in the playing state, and no Replay, Loop or autoplay; every guided-steps page links the same version of the shared files.
  - The browser tool: on loop pages, the desktop run checks that the stage moves, that Pause stops it (after up to 1.5 s for a step under way), that Play starts it again and, with `data-hb-slowmo="css"`, that Slow motion slows every animation on the stage and turning it off restores the speed; the phone run with reduced motion checks that the loop starts paused, stays still and moves after Play.

- [ ] **Step 1: Write the failing unit test**

In `tests/demo-page.test.js`, add at the end:

```js
test('motionNote says what reduced motion changes in the player bar', () => {
  assert.equal(DP.motionNote({ loop: true, slow: true }), 'Loop and Slow motion are off because your device is set to reduce motion.');
  assert.equal(DP.motionNote({ loop: true }), 'Loop is off because your device is set to reduce motion.');
  assert.equal(DP.motionNote({ slow: true }), 'Slow motion is off because your device is set to reduce motion.');
  assert.equal(DP.motionNote({ pause: true, slow: true }), 'It starts paused and Slow motion is off because your device is set to reduce motion.');
  assert.equal(DP.motionNote({ pause: true }), 'It starts paused because your device is set to reduce motion.');
  assert.equal(DP.motionNote({}), '');
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `node --test "tests/*.test.js"`
Expected: this one test fails with `TypeError: DP.motionNote is not a function`; everything else passes.

- [ ] **Step 3: Add the helper, Pause, CSS slow motion and the new note to `assets/js/demo-page.js`**

1. Replace the file's opening comment (lines 1–5) with:

```js
/* Animation Handbook — shared behaviour for the guided-steps demo pages.
 * Fills in "Your settings", Copy prompt, the README's "What it is" and "Similar
 * animations", plays the demo on arrival, replays it when a setting changes, runs
 * Pause and CSS slow motion on loop pages, and follows reduced motion (Loop and
 * Slow motion greyed out, loops start paused).
 * The pure helpers are exported for tests/demo-page.test.js. */
```

2. After the `quoteText` function, add:

```js
  // The reduced-motion note for the player bar, from what the bar holds ({ loop, slow, pause } as booleans);
  // '' when reduced motion changes nothing there.
  function motionNote(has) {
    var off = [has.loop && 'Loop', has.slow && 'Slow motion'].filter(Boolean);
    var parts = [];
    if (has.pause) parts.push('It starts paused');
    if (off.length) parts.push(off.join(' and ') + (off.length > 1 ? ' are' : ' is') + ' off');
    return parts.length ? parts.join(' and ') + ' because your device is set to reduce motion.' : '';
  }
```

and add `motionNote: motionNote` to the object the factory returns (after `quoteText: quoteText`).

3. In `boot`, directly after `var slowCtl = page.querySelector('[data-hb-slowmo]');`, add:

```js
    var pauseCtl = page.querySelector('[data-hb-pause]');
    var stage = page.querySelector('.stage');
    var player = page.querySelector('.hb-player');
```

4. Replace the whole reduced-motion block — from the comment `// While the device asks for reduced motion, Loop and Slow motion are switched off and cannot be switched` down to the closing `}` of `followReducedMotion` — with:

```js
    // Loops: Pause stops the demo and Play starts it again. With data-hb-pause="css" a class on the stage holds its
    // CSS animations; the "hb:pause" event goes out either way, so a page that runs its own timers can stop them.
    var paused = false;
    function setPaused(next) {
      paused = next;
      pauseCtl.setAttribute('data-state', paused ? 'paused' : 'playing');
      var label = pauseCtl.querySelector('.hb-pause-label');
      if (label) label.textContent = paused ? 'Play' : 'Pause';
      if (stage && pauseCtl.getAttribute('data-hb-pause') === 'css') stage.classList.toggle('hb-paused', paused);
      doc.dispatchEvent(new win.CustomEvent('hb:pause', { detail: { paused: paused } }));
    }

    // Slow motion with data-hb-slowmo="css": while it is on, every CSS animation and transition on the stage runs at a
    // third of its speed, including ones that start later. Without the value, the page slows its own timings.
    var slowing = false;
    function slowStage() {
      var rate = slowCtl.checked ? 1 / 3 : 1;
      stage.getAnimations({ subtree: true }).forEach(function (a) { if (a.playbackRate !== rate) a.playbackRate = rate; });
      slowing = slowCtl.checked;
      if (slowing) win.requestAnimationFrame(slowStage);
    }

    // While the device asks for reduced motion, Loop and Slow motion are switched off and cannot be switched on, a
    // loop starts paused, and a note in the player bar says why. Replay and Play still work.
    var playerSwitches = [loopCtl, slowCtl].filter(Boolean);
    var noteEl = null;
    function followReducedMotion() {
      var reduced = !!(reduce && reduce.matches);
      playerSwitches.forEach(function (sw) {
        if (reduced) sw.checked = false;
        sw.disabled = reduced;
        var label = sw.closest('label.hb-toggle');
        if (label) label.classList.toggle('is-disabled', reduced);
      });
      if (reduced && pauseCtl && !paused) setPaused(true);
      var note = reduced ? motionNote({ loop: !!loopCtl, slow: !!slowCtl, pause: !!pauseCtl }) : '';
      if (note && !noteEl && player) {
        noteEl = doc.createElement('p');
        noteEl.className = 'hb-player-note';
        noteEl.textContent = note;
        player.appendChild(noteEl);
      } else if (!note && noteEl) {
        noteEl.parentNode.removeChild(noteEl);
        noteEl = null;
      }
    }
```

(The note used to be inserted after the last switch; on every existing page that is the end of the player bar, so appending gives the same place.)

5. In the setup lines at the end of `boot`, directly after `if (slowCtl) slowCtl.addEventListener('change', replay);`, add:

```js
    if (pauseCtl) pauseCtl.addEventListener('click', function () { setPaused(!paused); });
    if (slowCtl && stage && stage.getAnimations && slowCtl.getAttribute('data-hb-slowmo') === 'css') {
      slowCtl.addEventListener('change', function () { if (!slowing) slowStage(); });
    }
```

(`followReducedMotion()` and its two listener lines stay where they are, after these.)

- [ ] **Step 4: Run the tests**

Run: `node --test "tests/*.test.js"`
Expected: all pass, including `motionNote says what reduced motion changes in the player bar`.

- [ ] **Step 5: Add the styles to `assets/css/demo-page.css`**

1. Replace this line:

```css
.hb-player-note{flex-basis:100%;margin:0;font:400 13px/1.4 var(--hb-font);color:var(--hb-muted)}
```

with:

```css
/* The note sits beside the controls when there is room, so it does not push the page down */
.hb-player-note{flex:1 1 240px;margin:0;font:400 13px/1.4 var(--hb-font);color:var(--hb-muted)}
/* Pause on loop pages: a pause icon while the demo moves, a play icon while it is paused */
[data-hb-pause] .hb-i-play,[data-hb-pause][data-state="paused"] .hb-i-pause{display:none}
[data-hb-pause][data-state="paused"] .hb-i-play{display:inline}
/* data-hb-pause="css": the shared script puts hb-paused on the stage, which holds every CSS animation on it */
.hb-page .stage.hb-paused,.hb-page .stage.hb-paused::before,.hb-page .stage.hb-paused::after,
.hb-page .stage.hb-paused *,.hb-page .stage.hb-paused *::before,.hb-page .stage.hb-paused *::after{animation-play-state:paused!important}
```

2. In the `@media(max-width:600px)` block, replace:

```css
  /* Three controls do not fit on one line at phone widths: Replay takes the first row, the two switches share the
     second, and the reduced-motion note gets a row of its own */
  .hb-player{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
  .hb-play,.hb-player-note{grid-column:1/-1}
```

with:

```css
  /* Three controls do not fit on one line at phone widths: Replay takes the first row, the two switches share the
     second, and the reduced-motion note gets a row of its own. On a loop page Pause and Slow motion share one row. */
  .hb-player{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
  .hb-play,.hb-player-note{grid-column:1/-1}
  .hb-player:has(> [data-hb-pause] + .hb-toggle) > .hb-play{grid-column:auto}
```

- [ ] **Step 6: Page checks for loop pages and for the shared-file version**

In `tests/pages.test.js`, directly after this block:

```js
    if (kind === 'once') {
      assert.equal(count(html, 'data-hb-replay'), 1, 'one Replay control');
      assert.ok(player.includes('data-hb-replay'), 'Replay is in the player bar');
    }
```

add:

```js
    if (kind === 'loop') {
      assert.equal(count(html, 'data-hb-pause'), 1, 'one Pause control');
      assert.match(player, /<button class="hb-play" type="button" id="btn-pause" data-hb-pause(?:="css")? data-state="playing">/,
        'Pause is in the player bar and starts in the playing state');
      assert.equal(count(html, 'data-hb-replay') + count(html, 'data-hb-loop') + count(html, 'data-hb-autoplay'), 0,
        'a loop has no Replay, Loop or autoplay');
    }
```

and after the closing `}` of the `for (const d of steps)` loop (before the home page font test), add:

```js
test('every guided-steps page links the same version of the shared files', () => {
  const versions = new Set(steps.flatMap(d => [...pageOf(d).matchAll(/demo-page\.(?:css|js)\?v=(\d+)/g)].map(m => m[1])));
  assert.equal(versions.size, 1, `versions in use: ${[...versions].join(', ')}`);
});
```

- [ ] **Step 7: Bump the shared-file version**

On the thirteen Entrance & Exit pages change `demo-page.css?v=2` to `demo-page.css?v=3` and `demo-page.js?v=2` to `demo-page.js?v=3` (for example `sed -i 's/demo-page\.css?v=2/demo-page.css?v=3/; s/demo-page\.js?v=2/demo-page.js?v=3/' animations/02-entrance-and-exit/*/index.html`, then `git diff --stat` shows 13 files, 2 lines each).

Run: `node --test "tests/*.test.js"` — all pass.

- [ ] **Step 8: Teach the browser tool about loops**

In `tools/check-pages.mjs`:

1. In the header comment, replace the two lines `// label or value). On plays-once pages the desktop run also checks that Replay and a setting change visibly move` and `// the stage. Exit code 1 on any problem.` with:

```js
// label or value). On plays-once pages the desktop run also checks that Replay and a setting change visibly move
// the stage; on loop pages it checks that the stage moves, that Pause stops it and Play starts it again, and the
// reduced-motion run checks that the loop starts paused. Exit code 1 on any problem.
```

2. Directly after the `movementProblems` function, add:

```js
// True when the stage shows something different from its first capture within ms milliseconds.
async function stageChanges(ms) {
  const first = await stageShot();
  for (const end = Date.now() + ms; Date.now() < end;) {
    await sleep(200);
    if (await stageShot() !== first) return true;
  }
  return false;
}

// Loop pages: the stage keeps changing, holds still after Pause (a step already under way may finish first) and moves
// again after Play. Under reduced motion the loop starts paused and Play still starts it. With data-hb-slowmo="css",
// Slow motion must slow every animation on the stage and turning it off must restore the speed.
async function loopProblems(reduced) {
  if (!(await evaluate(`!!document.querySelector('[data-hb-pause]')`))) return ['no Pause button to check'];
  const state = () => evaluate(`document.querySelector('[data-hb-pause]').getAttribute('data-state')`);
  const press = () => evaluate(`document.querySelector('[data-hb-pause]').click()`);
  const problems = [];
  if (reduced) {
    if (await state() !== 'paused') problems.push('the loop does not start paused under reduced motion');
    else if (await stageChanges(1500)) problems.push('the stage moves while paused under reduced motion');
    await press();
    if (!(await stageChanges(4000))) problems.push('Play does not start the loop under reduced motion');
    return problems;
  }
  if (!(await stageChanges(4000))) return ['the loop is not moving'];
  await press();
  await sleep(1500);
  if (await stageChanges(1500)) problems.push('Pause does not stop the stage');
  await press();
  if (!(await stageChanges(4000))) problems.push('Play does not start the stage again');
  if (await evaluate(`!!document.querySelector('[data-hb-slowmo="css"]')`)) {
    const rates = () => evaluate(`document.querySelector('.hb-page .stage').getAnimations({ subtree: true }).map(a => a.playbackRate)`);
    const toggle = () => evaluate(`document.querySelector('[data-hb-slowmo]').click()`);
    await toggle();
    await sleep(200);
    const slow = await rates();
    if (!slow.length || slow.some(r => r >= 1)) problems.push('Slow motion does not slow the stage');
    await toggle();
    await sleep(200);
    if ((await rates()).some(r => r !== 1)) problems.push('turning Slow motion off does not restore the speed');
  }
  return problems;
}
```

3. Directly after the line `if (setup.moves && !setup.reduce && result.kind === 'once') problems.push(...await movementProblems());`, add:

```js
        if (result.kind === 'loop' && (setup.moves || setup.reduce)) problems.push(...await loopProblems(!!setup.reduce));
```

- [ ] **Step 9: Prove it on two scratch loop pages**

Make two folders, `.superpowers/scratch/loop-css/` and `.superpowers/scratch/loop-page/` (three levels below the repo root, like a demo page, so the `../../../assets/…` links work). Copy `animations/02-entrance-and-exit/fade-in-out/index.html` and its `README.md` into each, then edit each `index.html`:

- body: `<body class="hb" data-hb-kind="loop">`;
- Watch it help line: "It moves by itself. Pause it to look closely, or turn on slow motion to see each part of the movement.";
- the stage holds only `<div class="dot"></div>`, and the demo's `<style>` gets `.stage{display:flex;align-items:center;justify-content:center}` and `.dot{width:40px;height:40px;border-radius:50%;background:var(--ui-accent)}`;
- the player bar holds the Pause button from Global Constraints and the Slow motion switch as on Rotate In;
- the page's own `<script>` is replaced.

In **loop-css**: `data-hb-pause="css"` and `data-hb-slowmo="css"`; the style adds `@keyframes hb-test-slide{from{transform:translateX(-120px)}to{transform:translateX(120px)}}` and `.dot{animation:hb-test-slide 1.2s ease-in-out infinite alternate}`; the script is empty.

In **loop-page**: `data-hb-pause` and `data-hb-slowmo` without values; the script is:

```html
<script>
(()=>{
  const dot=document.querySelector('.dot'), slow=document.querySelector('[data-hb-slowmo]');
  let x=0, dir=1, timer=0;
  function step(){ x+=dir*20; if(Math.abs(x)>=120) dir=-dir; dot.style.transform=`translateX(${x}px)`; timer=setTimeout(step, slow.checked?900:300); }
  document.addEventListener('hb:pause', e=>{ clearTimeout(timer); if(!e.detail.paused) step(); });
  step();
})();
</script>
```

Run: `node tools/check-pages.mjs .superpowers/scratch/loop-css .superpowers/scratch/loop-page`
Expected: ten `ok` lines. If a problem shows, fix the shared code (not the scratch page) unless the scratch page does not follow this step. Leave the scratch folders in place (they are ignored by git).

- [ ] **Step 10: Run everything and commit**

Run: `node --test "tests/*.test.js"` — all pass. Run: `node tools/check-pages.mjs animations/02-entrance-and-exit` — 65 `ok` lines (nothing changes for plays-once pages except the note's place on wide screens). Then:

```bash
git add assets/js/demo-page.js assets/css/demo-page.css tests/demo-page.test.js tests/pages.test.js tools/check-pages.mjs animations/02-entrance-and-exit/*/index.html
git commit -m "feat: support looping demos with Pause and CSS slow motion"
```

---

### Task 3: The content sheet for Text & Typography

**Files:**
- Create: `docs/superpowers/plans/2026-09-28-text-typography-content.md`

**Interfaces:**
- Consumes: each page's current `index.html` and `README.md`; the Entrance & Exit content sheet (`docs/superpowers/plans/2026-09-27-entrance-exit-content.md`) and the live Entrance & Exit pages as the model for tone and decisions; the loop-page interfaces from Task 2; "How to convert a page" below.
- Produces: one section per page that Tasks 4–10 follow exactly.

This task decides words and settings; it writes no code. Read each page's current `index.html` (controls, ranges, defaults and the whole script) and `README.md` before writing its section.

- [ ] **Step 1: Write one section per page, in this format**

```markdown
## <slug> — <Title>

- **Kind:** once | loop — <why, in one line>
- **Description:** <one sentence, at most 80 characters, plain words; the lede, the meta descriptions and the home card>
- **Watch it help line:** default | <custom line, when the default for the kind does not fit>
- **Player bar:** once: Replay · Loop · Slow motion (say which, and why any is left out) | loop: Pause (css | page) · Slow motion (css | page | none — and why)
- **Sequence:** once: what one cycle does ("plays in, holds 900ms, plays out, waits 500ms") | loop: what runs, and for "page" which timers or animation frames stop on `hb:pause` and how they start again
- **Slow motion:** once, or loop with "page": which durations and timers are multiplied by 3 | "css"
- **Stage font:** site font | typewriter font (only for an effect about typing; say why)
- **Stage:** what stays on the stage; readouts, captions and notes removed; `hb-dots` yes/no; `hb-grow` when typed text must fit; a height variable if needed

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|

- **Removed:** <old controls that go away and why (Restart, Apply, Auto-loop, speed sliders reaching zero, readouts, notes)>
- **Good for:** <3–5 tags> · **Avoid on:** <1–3 tags>
- **Prompt:** <the prompt, 60–130 words, ending "Match the settings listed below.">
- **README What it is:** keep | <rewritten in plain words, no code>
- **README Key parameters:** <one row per setting: Parameter | Default | Effect, names exactly as on the page>
- **README See also:** <each link, its text equal to the target page's `<h1>`, with one plain phrase after " — ">
- **README How it works:** <what must change so the snippets match the new code, or "unchanged">
- **Pager:** Previous and Next, as the page links today
```

Rules for the content:

- **Settings** follow Global Constraints and the Entrance & Exit sheet's rules: Duration and speed numbers become Speed (Slow · Normal · Fast, keeping the old default as Normal and roughly 1.6× and 0.6× of it for Slow and Fast), easing becomes Feel with plain names, distances, sizes and delays become three or four named steps; keep a slider only when sliding through values is the point (say why) and give it a plain value; colour pickers become named swatches; text inputs become "Your text" (a textarea stays a textarea when each line or word is a separate item, labelled for what it holds, e.g. "Your words, one per line"). Choose the one to three settings that change the effect most as the main ones.
- **Sets in the demo:** say exactly which variable, class or code value each choice sets (for example "--dur 1000ms / 600ms / 350ms"), so the implementer does not have to guess.
- **Every choice must be something the demo can already do;** do not invent behaviour, and do not drop a setting that changes the technique itself (move it to More options). A speed setting never reaches zero: Pause does that now.
- **Kinds:** a demo that cycles forever with no natural end is a loop; a demo that plays through and stops is plays once. Every page in this category is one of the two (there are no do-it pages yet: "Show me" arrives with 3D & Advanced). A loop may use "css" for Pause only if its looping movement is CSS animations (`@keyframes`) on the stage; a loop driven by timers or animation frames uses "page", even when CSS transitions draw each step. A page with both may use "css" and also stop its own timers on `hb:pause` (say so under Sequence).
- **Reduced motion:** for a loop, say what its reduced-motion CSS keeps (it may simplify the movement but not remove or pause it; the shared script starts the loop paused). For plays once, as on the Entrance & Exit pages.
- **Variable Font Morph:** it names the `Recursive` font, which the page never loads, so its Casual axis only works where that font is installed. The site font (Schibsted Grotesk) is variable in weight from 400 to 900 and is loaded on every page: the demo morphs its weight, and a slant can stay only as the skew the page already applies. Say in the README's Production notes that a font with more axes (Recursive, for example) adds more to morph.
- **Tags:** short nouns, like Rotate In's ("Icons", "Badges and stars"; "Text", "Wide boxes and cards").
- **Prompts:** say what the viewer sees and the one or two rules that make it look right; keep the reduced-motion sentence; never state as fixed what a setting controls.

The pages, in order: enter-exit-typography, kinetic-typography, outline-to-fill, scramble-text, text-clip-path-reveal, typewriter-effect, glitch-text, marquee-ticker, rotate-word-carousel, text-morphing, text-gradient-animation, text-on-path, variable-font-morph, wavy-text.

- [ ] **Step 2: Check the sheet**

For each section: one to three main settings; every setting has a hint of at most 60 characters; every choice has its "Sets in the demo" value; the prompt is 60–130 words and ends with "Match the settings listed below."; the Key parameters names equal the Setting names; every See also link text equals its target's `<h1>` (read the target page); a loop with "css" Pause has only `@keyframes` animations looping on its stage.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/plans/2026-09-28-text-typography-content.md
git commit -m "docs: content sheet for the Text & Typography rollout"
```

---

### How to convert a page (Tasks 4–10)

Each of Tasks 4–10 converts two pages. For each page, follow its section of the content sheet (`docs/superpowers/plans/2026-09-28-text-typography-content.md`) exactly, and use the live Entrance & Exit pages as the reference for every part of the page that is not the demo itself: `rotate-in` for plays-once pages; for text pieces and typed text, `split-text-reveal` and `letter-by-letter-stagger`.

1. **Read** the page's current `index.html` and `README.md`, its content-sheet section, and `animations/02-entrance-and-exit/rotate-in/index.html`.
2. **Head:** keep the title, canonical link, icons and Open Graph and Twitter tags; set every description (meta, `og:description`, `twitter:description`, JSON-LD `description`) to the sheet's Description. Link `<link rel="stylesheet" href="../../../assets/css/demo-page.css?v=3">` and `<script src="../../../assets/js/demo-page.js?v=3" defer></script>` after the page's own `<style>`, exactly as on Rotate In.
3. **The demo's `<style>`:** keep `:root` (with `--ui-accent:#ff6f8b`), the reset line and every rule the stage content needs. Delete the `@font-face` lines, the old layout and control rules (`body` padding, `header`, `.layout`, `aside`, `.note`, `.lbl`, `.kv`, `.div`, `.sr`, `.sv`, `select`, `input[type=text]`, `textarea`, `.seg`, `.tog`, `.btn-row`, `button.rst`, `button.act`, `.preset-btn`, the `.ah-bar` styles, the old mobile block) and rules for removed readouts. Remove `font-family` from stage text so it uses the site font (a typewriter font only where the sheet says so, with the stack from Global Constraints). The stage's height comes from the shared stylesheet: remove `--stage-h` and fixed stage heights; set `--hb-stage-h` or `--hb-stage-h-phone` only if the sheet says so; add `hb-grow` where the sheet says so. Keep the demo's reduced-motion rule; on a loop page it may simplify the movement but must not remove or pause it.
4. **Body:** `<body class="hb" data-hb-kind="once" data-hb-autoplay>` or `<body class="hb" data-hb-kind="loop">` as the sheet's Kind says, then Rotate In's structure:
   - Top bar: the home link as on Rotate In, and the pager with the sheet's Previous and Next links, in the Entrance & Exit markup: a Previous link is `<a href="../<prev>/" rel="prev" aria-label="Previous: <Name>"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg><span><span class="hb-dir">Previous: </span><Name></span></a>`; a Next link is `<a href="../<next>/" rel="next" aria-label="Next: <Name>"><span><span class="hb-dir">Next: </span><Name></span><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></a>`. Delete the old injected `.ah-bar` markup and its script.
   - Header: the category line (`05.NN · Text &amp; Typography`, NN as the page has it today), the title, and the Description as the lede.
   - Step 1: "Watch it" with the help line for the kind (or the sheet's), the `.stage` holding only the demo's animated content, then the player bar: plays once — Rotate In's; loop — the Pause button from Global Constraints (`data-hb-pause="css"` or without a value, as the sheet says), followed by Rotate In's Slow motion switch (`data-hb-slowmo="css"` or without a value) when the sheet has Slow motion. Every switch unchecked, with `autocomplete="off"`.
   - Step 2: "Try it" with the help line for the kind, the main settings in `div.hb-settings`, the rest in `details.hb-options` exactly as on Rotate In, each control in the markup table of the rollout spec, with its hint and `autocomplete="off"` on every input, select and textarea.
   - Step 3: the prompt card exactly as on Rotate In, with the sheet's prompt.
   - About (What it is with the README link as fallback; Good for and Avoid on tags), Similar animations and the footer exactly as on Rotate In.
5. **Script:** rewrite the page's script so that:
   - **plays once:** the Replay button (`id="btn-play"`, `data-hb-replay`) plays from the start and keeps looping when Loop is on; switching Loop off lets the current cycle finish with the text shown (Rotate In's `cycle()`/`play()` pattern); Slow motion multiplies the sheet's durations and the timers that wait for them by 3 (not the pauses), taking effect on the next play; every play restarts the animated pieces themselves (rebuild or reset them hidden, `void el.offsetWidth`, then show them). The shared script replays after every setting change and turns Loop on at arrival; the page's script must not do either itself.
   - **loop, Pause "css":** the looping CSS animations run from page load with no Replay, Loop or autoplay code. If the page also has timers (for example random glitches), it stops them on `document`'s `hb:pause` event when `e.detail.paused` is true and starts them again when it is false.
   - **loop, Pause "page":** the page starts its loop at load and listens for `hb:pause`: paused → clear its timers or cancel its animation frame; not paused → carry on from where it is. With Slow motion "page", the durations of movements and the timers that wait for a movement to finish are multiplied by 3 while the switch is on; holds between movements keep their length, as on plays-once pages. A `change` on the switch takes effect from the next step at the latest.
   - **every loop:** changing a setting while paused shows the new setting without starting the loop again (for "css" pages the shared class already holds new animations). Register the `hb:pause` listener at the top level of the page's inline script: the shared script runs after it and may pause the loop on arrival, so a listener added later (for example in a `DOMContentLoaded` handler) would miss that.
   - **every page:** the page's script reaches the player controls by their ids (`btn-play`, `loop-tog`, `slow-tog`, `btn-pause`), never by their `data-hb-*` attributes: the page checks count those attribute names anywhere in the file.
   - every setting sets what its "Sets in the demo" column says; choice buttons toggle `.on` and `aria-pressed` (Rotate In's `choices()` helper); sliders update their `output.hb-value` with the plain value; swatches toggle `aria-pressed`; typed text is added with `textContent` or `createTextNode`, never as HTML, and text split into letters keeps each word's letters in one `span` that cannot break (Task 1's `.unit-word` pattern, with one normal space between words);
   - nothing remains of the old controls, readouts, Restart or Apply buttons, or `data-hb-reset`/`data-hb-skip` markers.
6. **README:** What it is as the sheet says (no code); replace the Key parameters table with the sheet's rows; bring How it works in line with the new code; See also lines as in the sheet. Leave When to use it and Production notes as they are unless they name a removed control or the sheet says otherwise.
7. **Home page:** in `index.html`, set the page's card description (the third string of its `['<slug>','<Title>','…']` entry) to the Description, escaping any `'` as `\'`.
8. **Check:** run `node --test "tests/*.test.js"` (all pass) and `node tools/check-pages.mjs animations/05-text-typography/<slug>` (five `ok` lines: it tests Replay and a setting change on plays-once pages, and moving, Pause, Play, CSS slow motion and the reduced-motion start on loops). Open the page's desktop and phone screenshots with the Read tool and compare them with Rotate In's: same structure, the animation visible on the stage, nothing overlapping or cut off.
9. **Commit** each page on its own: `feat: move <Title> to the guided-steps page`.

### Task 4: Enter/Exit Typography and Kinetic Typography

**Files:** `animations/05-text-typography/enter-exit-typography/{index.html,README.md}`, `animations/05-text-typography/kinetic-typography/{index.html,README.md}`, `index.html` (their two card descriptions)

- [ ] **Step 1:** Convert `enter-exit-typography` by following "How to convert a page" and its content-sheet section; run the checks; commit.
- [ ] **Step 2:** Convert `kinetic-typography` the same way; run the checks; commit.

### Task 5: Outline to Fill and Scramble Text

**Files:** `animations/05-text-typography/outline-to-fill/{index.html,README.md}`, `animations/05-text-typography/scramble-text/{index.html,README.md}`, `index.html` (their two card descriptions)

Outline to Fill shows two ways of filling side by side; keep both in the one stage.

- [ ] **Step 1:** Convert `outline-to-fill` by following "How to convert a page" and its content-sheet section; run the checks; commit.
- [ ] **Step 2:** Convert `scramble-text` the same way; run the checks; commit.

### Task 6: Text Clip-Path Reveal and Typewriter Effect

**Files:** `animations/05-text-typography/text-clip-path-reveal/{index.html,README.md}`, `animations/05-text-typography/typewriter-effect/{index.html,README.md}`, `index.html` (their two card descriptions)

Both take typed text that can run to several lines: use `hb-grow` where the sheet says so.

- [ ] **Step 1:** Convert `text-clip-path-reveal` by following "How to convert a page" and its content-sheet section; run the checks; commit.
- [ ] **Step 2:** Convert `typewriter-effect` the same way; run the checks; commit.

### Task 7: Glitch Text and Marquee Ticker

**Files:** `animations/05-text-typography/glitch-text/{index.html,README.md}`, `animations/05-text-typography/marquee-ticker/{index.html,README.md}`, `index.html` (their two card descriptions)

Both are loops that already use `animation-play-state` for their own hover pause; that keeps working because the shared Pause only adds a class. Marquee Ticker's reduced-motion rule pauses the rows with `!important` today; it must go (the shared script starts the loop paused, and Play must be able to start it).

- [ ] **Step 1:** Convert `glitch-text` by following "How to convert a page" and its content-sheet section; run the checks; commit.
- [ ] **Step 2:** Convert `marquee-ticker` the same way; run the checks; commit.

### Task 8: Rotate Word Carousel and Text Morphing

**Files:** `animations/05-text-typography/rotate-word-carousel/{index.html,README.md}`, `animations/05-text-typography/text-morphing/{index.html,README.md}`, `index.html` (their two card descriptions)

Both loop through words forever on timers; their Restart buttons go (Pause replaces them).

- [ ] **Step 1:** Convert `rotate-word-carousel` by following "How to convert a page" and its content-sheet section; run the checks; commit.
- [ ] **Step 2:** Convert `text-morphing` the same way; run the checks; commit.

### Task 9: Text Gradient Animation and Text on Path

**Files:** `animations/05-text-typography/text-gradient-animation/{index.html,README.md}`, `animations/05-text-typography/text-on-path/{index.html,README.md}`, `index.html` (their two card descriptions)

Text on Path moves its text with animation frames (a "page" loop); its speed setting must not reach zero.

- [ ] **Step 1:** Convert `text-gradient-animation` by following "How to convert a page" and its content-sheet section; run the checks; commit.
- [ ] **Step 2:** Convert `text-on-path` the same way; run the checks; commit.

### Task 10: Variable Font Morph and Wavy Text

**Files:** `animations/05-text-typography/variable-font-morph/{index.html,README.md}`, `animations/05-text-typography/wavy-text/{index.html,README.md}`, `index.html` (their two card descriptions)

- [ ] **Step 1:** Convert `variable-font-morph` by following "How to convert a page" and its content-sheet section; run the checks; commit.
- [ ] **Step 2:** Convert `wavy-text` the same way; run the checks; commit.

(If the sheet gives a page a different kind than its task's note suggests, follow the sheet.)

---

### Task 11: Check both categories in a browser

The controller runs this task; its screenshots go to the user.

- [ ] **Step 1:** Run `node tools/check-pages.mjs animations/02-entrance-and-exit animations/05-text-typography`. Expected: 135 lines, every one `ok`.
- [ ] **Step 2:** Open the fourteen new pages' desktop and phone screenshots. Expected: the same structure as the Entrance & Exit pages, the demo visible on the stage, settings readable, nothing overlapping.
- [ ] **Step 3:** In the in-app browser, on two loop pages (one "css", one "page") and two plays-once pages (one with typed text), change every setting and confirm the chips follow and the demo shows the change; press Pause and Play; press Copy prompt and confirm the copied text ends with the settings line.
- [ ] **Step 4:** Anything found goes to one fix dispatch with the complete list; the fixes are reviewed and committed like any task.
