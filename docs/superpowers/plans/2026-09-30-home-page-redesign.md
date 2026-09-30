# Home Page Redesign ("Friendly guide") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the home page with the approved "Friendly guide" design: one plain question with a search box, nine place tiles, views that answer them, big cards with a visible Copy prompt button, phone and tablet layouts and both themes.

**Architecture:** `index.html` stays one self-contained file. Its page styles, markup and home script are rewritten; the preview library (the `.pv-*` styles, `PV`, `pvMarkup`, the canvas engines) and `CATS` stay as they are. Cards are built once and moved between views. Copy prompt reuses one new helper in the shared `assets/js/demo-page.js`, so the home page and every demo page copy the same text. The page check gains a `home` target so each task can check the page in Chrome.

**Tech Stack:** Plain HTML, CSS and vanilla JavaScript (no build step, no packages); Node's built-in test runner; `tools/check-pages.mjs` (Node 22+ and the local Chrome over the DevTools protocol); git worktrees.

**Spec:** `docs/superpowers/specs/2026-09-30-home-page-redesign-design.md`. **Approved design:** https://claude.ai/artifact/KHpLZm8wNVyB8TqUpPPMDC, row "A · Friendly guide" (desktop, phone, phone after tapping Buttons). The canvas files are also on disk for a side-by-side look: `C:\Users\matin\AppData\Local\Temp\claude\C--Users-matin-OneDrive-Desktop-Projects-animation-handbook\30d5309a-3a1d-4776-940d-fa01fd09a7b5\scratchpad\home-design-2\project\` (`Main.dc.html`, `APhone.dc.html`, `APhoneButtons.dc.html`); they are a reference, not code to copy.

## Global Constraints

- CLAUDE.md governs: plain HTML, CSS and vanilla JavaScript; no build step, packages or CDN files; motion with `transform` and `opacity`; text at least 4.5:1 against its background (3:1 at 24px and up); every control at least 44×44px on phones; `prefers-reduced-motion` respected; American spelling; plain words, no hype ("stunning", "amazing", "powerful").
- Breakpoints: phone ≤ 600px, tablet 601–1024px, desktop ≥ 1025px; content at most 1280px wide, centered.
- `index.html` stays one self-contained file. Each `CATS` entry keeps the exact shape `['slug','Name','Description']`: `tests/pages.test.js` matches every card to its page with that shape.
- The preview library does not change: the styles from `/* ── preview library ── */` to the end of the `<style>` element (except the one reduced-motion block Task 4 replaces), `PV`, `pvMarkup` and the canvas engines (`starfield` … `const engines=…`).
- Any change to `assets/js/demo-page.js` or `assets/css/demo-page.css` bumps `?v=N` on every demo page, and from Task 6 on on the home page too, in the same task (today `?v=5`; Task 1 makes it `?v=6`).
- Copy is exactly as in the spec: pill "129 free animations · no coding needed"; heading "What do you want to animate?"; line "Pick a place, or describe it in your own words. Every animation plays live, and each one comes with a ready-made prompt for your AI assistant."; search label "Describe the animation you want", placeholder "For example: a button that bounces when clicked", button "Search"; "Popular:" fade in, typing text, loading spinner, parallax, confetti; views "Good places to start" / "Eight favorites from different places. Pick a place above to see more.", a place's name / "15 animations", "Results for “…”" / "12 animations match." ("1 animation matches."), "All animations" / "129 animations in 7 groups.", "Nothing matches “…” yet" / "Try a simpler word, or pick one of these:"; buttons "Browse all 129 animations", "Show all 15", "Clear"; card buttons "Copy prompt", "Copied", "Open to copy", "Try it"; message "Prompt copied. Paste it into your AI assistant."; How it works: "Watch it" / "Every animation plays right on its page, so you see exactly what you will get.", "Change it to fit" / "Try a few simple settings, like speed or direction, and watch the preview update.", "Copy the prompt" / "Paste it into your AI assistant. It describes the animation in plain words, with your settings.", then "Free and open source (MIT). No sign-up."
- Every task ends green: `node --test "tests/*.test.js"`. From Task 4 on, `node tools/check-pages.mjs --base http://127.0.0.1:<port> home` prints six `ok` lines (Task 3 lands the home check while the old home page still fails it, as its steps say).
- Serve each worktree with its own port: `python -m http.server <port> --bind 127.0.0.1` from the worktree root. Checks run in the agent's own headless Chrome (the page check tool), never in the shared in-app browser pane.
- One commit per concern; never amend, never reset; no attribution lines in commit messages.

## Files

| File | Responsibility | Tasks |
|---|---|---|
| `assets/js/demo-page.js` | new `promptWithSettings()` and `pageCopyText()`; the page's own Copy prompt uses `pageCopyText()` | 1 |
| `animations/*/*/index.html` (129) | `?v=5` → `?v=6` on both shared-file links | 1 |
| `tests/demo-page.test.js` | tests for the two helpers | 1 |
| `index.html` | `PLACES` and `PICKS` data (2); new page styles, markup and home script (4); views, search and address (5); Copy prompt and the shared script link (6) | 2, 4, 5, 6 |
| `tests/pages.test.js` | `homeConst()` helper and place tests (2); home heading and count tests (4); the home page in the version test (6) | 2, 4, 6 |
| `tools/check-pages.mjs` | `home` target with static checks (3); view checks (5); Copy prompt checks (6) | 3, 5, 6 |
| `CLAUDE.md`, `CONTRIBUTING.md` | how to give a new animation its places; the home check | 7 |

## Order

- **Wave 1, in parallel** (each in its own worktree from `main`, each merged into `main` when its review passes): Task 1, Task 2, Task 3, Task 7. They touch different files.
- **Wave 2, one after the other** in one worktree from `main` after wave 1: Task 4, Task 5, Task 6.
- **Task 8** closes the plan: whole-site check, final review, publish.

---

### Task 1: One shared helper builds the copied prompt

**Files:**
- Modify: `assets/js/demo-page.js` (the `settingsLine` helper near line 87, `readSettings` near line 168, `copyText()` inside `boot()` near line 202, the returned API at the end, the header comment)
- Modify: every `animations/<category>/<slug>/index.html` (129 files): `?v=5` → `?v=6`
- Test: `tests/demo-page.test.js`

**Interfaces:**
- Produces: `DemoPage.promptWithSettings(prompt: string, items: {label: string, value: string}[]): string` and `DemoPage.pageCopyText(doc, win): string` (`''` when the page has no `.hb-page .hb-prompt`). `win` needs only `getComputedStyle(node)`. The browser global is `window.DemoPage`; Node gets them from `require('../assets/js/demo-page.js')`.

- [ ] **Step 1: Write the failing tests** — add to the end of `tests/demo-page.test.js`:

```js
test('promptWithSettings adds the settings line only when a setting is complete', () => {
  assert.equal(DP.promptWithSettings('Add it.', [{ label: 'Speed', value: 'Normal' }, { label: 'Size', value: 'Big' }]),
    'Add it.\n\nSettings from the demo: Speed: Normal, Size: Big.');
  assert.equal(DP.promptWithSettings('Add it.', []), 'Add it.');
  assert.equal(DP.promptWithSettings('Add it.', [{ label: 'Speed', value: '' }]), 'Add it.');
});

test('pageCopyText reads the prompt and the Try it settings of a page', () => {
  // A stand-in page: a prompt and a Try it step holding one group of choice buttons, "Speed", with "Normal" pressed.
  const pressed = { getAttribute: () => null, textContent: ' Normal ' };
  const seg = { hidden: false, parentElement: null, hasAttribute: () => false, closest: () => null, matches: () => false,
    getAttribute: name => (name === 'aria-labelledby' ? 'speed-lbl' : null), querySelector: () => pressed };
  const tryStep = { querySelectorAll: () => [seg] };
  const prompt = { textContent: 'Add a  fade to [the card].' };
  const page = { querySelector: s => ({ '.hb-prompt': prompt, '.hb-try': tryStep })[s] || null };
  const doc = { querySelector: s => (s === '.hb-page' ? page : null), getElementById: id => (id === 'speed-lbl' ? { textContent: 'Speed' } : null) };
  const win = { getComputedStyle: () => ({ display: '' }) };
  assert.equal(DP.pageCopyText(doc, win), 'Add a fade to [the card].\n\nSettings from the demo: Speed: Normal.');
  const noSettings = { querySelector: s => (s === '.hb-prompt' ? prompt : null) };
  assert.equal(DP.pageCopyText({ querySelector: s => (s === '.hb-page' ? noSettings : null) }, win), 'Add a fade to [the card].');
  assert.equal(DP.pageCopyText({ querySelector: () => null }, win), '');
});
```

- [ ] **Step 2: Run them and see them fail**

Run: `node --test tests/demo-page.test.js`
Expected: FAIL — `DP.promptWithSettings is not a function` and `DP.pageCopyText is not a function`.

- [ ] **Step 3: Add the helpers**

In `assets/js/demo-page.js`, right after the `settingsLine` function, add:

```js
  // What Copy prompt copies: the prompt, then a blank line and "Settings from the demo: …" when the page has settings.
  function promptWithSettings(prompt, items) {
    var line = settingsLine(items);
    return prompt + (line ? '\n\nSettings from the demo: ' + line + '.' : '');
  }
```

Right after the `readSettings` function, add:

```js
  // What Copy prompt copies on a page, with its settings as they are now. The home page runs it on a page it has
  // fetched and parsed, where every setting is at its default.
  function pageCopyText(doc, win) {
    var page = doc.querySelector('.hb-page');
    var promptEl = page && page.querySelector('.hb-prompt');
    if (!promptEl) return '';
    var tryStep = page.querySelector('.hb-try');
    var items = tryStep ? readSettings(doc, tryStep, win).filter(function (s) { return s.label && s.value; }) : [];
    return promptWithSettings(text(promptEl), items);
  }
```

Inside `boot()`, replace

```js
    function copyText() {
      var line = settingsLine(settings());
      return promptText + (line ? '\n\nSettings from the demo: ' + line + '.' : '');
    }
```

with

```js
    function copyText() { return pageCopyText(doc, win); }
```

(`setUpPrompt()` only wraps the parts to fill in with `<mark>` and puts its button after the prompt, so the prompt's text, and so the copied text, is unchanged.) In the object returned at the end of the file, add `promptWithSettings: promptWithSettings, pageCopyText: pageCopyText` after `settingsLine: settingsLine`. In the header comment, change "Fills in "Your settings", Copy prompt," to "Fills in "Your settings", Copy prompt (its text built by pageCopyText, which the home page uses too),".

- [ ] **Step 4: Run the helper tests**

Run: `node --test tests/demo-page.test.js`
Expected: PASS, every test.

- [ ] **Step 5: Bump the shared files to `?v=6` on every page**

Run from the repo root:

```bash
node -e "const fs=require('fs'),path=require('path');let n=0;for(const c of fs.readdirSync('animations',{withFileTypes:true}).filter(d=>d.isDirectory()))for(const d of fs.readdirSync(path.join('animations',c.name),{withFileTypes:true}).filter(d=>d.isDirectory())){const f=path.join('animations',c.name,d.name,'index.html');if(!fs.existsSync(f))continue;const s=fs.readFileSync(f,'utf8'),t=s.replace(/demo-page\.(css|js)\?v=5/g,'demo-page.$1?v=6');if(t!==s){fs.writeFileSync(f,t);n++;}}console.log(n+' pages')"
```

Expected: `129 pages`. Then `git grep -c "?v=5" -- animations` prints nothing.

- [ ] **Step 6: Run all tests**

Run: `node --test "tests/*.test.js"`
Expected: PASS (the version test sees one version, 6).

- [ ] **Step 7: Check one page of each kind in Chrome**

Serve the worktree (`python -m http.server <port> --bind 127.0.0.1`), then run:

```bash
node tools/check-pages.mjs --base http://127.0.0.1:<port> animations/02-entrance-and-exit/rotate-in animations/07-ambient-background/aurora animations/07-ambient-background/starfield animations/04-micro-interactions/checkmark-draw animations/01-scroll-based/snap-scrolling animations/03-page-transitions/crossfade animations/05-text-typography/wavy-text animations/06-3d-advanced/flip-card-3d
```

Expected: 48 `ok` lines, exit code 0.

- [ ] **Step 8: Commit, in two commits**

```bash
git add assets/js/demo-page.js tests/demo-page.test.js
git commit -m "feat: one shared helper (pageCopyText) builds the copied prompt, for the demo pages and the home page"
git add animations
git commit -m "chore: link the shared files as ?v=6 on every page"
```

---

### Task 2: Place data for every animation

**Files:**
- Modify: `index.html` — insert after the `};` that closes `const PV={` (just before `function pvMarkup(k){`)
- Test: `tests/pages.test.js`

**Interfaces:**
- Produces: in `index.html`'s script, `const PLACES` (slug → array of place keys; the first key labels the card; keys `btn text imgcard bg menu load intro scroll page`) and `const PICKS` (the eight Start slugs, in order). In `tests/pages.test.js`, `homeConst(name)`: evaluates the literal after `const NAME=` in the home page's script and returns it (used again in Task 4).

- [ ] **Step 1: Write the failing tests** — in `tests/pages.test.js`, add `const vm = require('node:vm');` under the other `require` lines, and add after the home page test (`the home page uses Schibsted Grotesk …`):

```js
// The value of `const NAME=` in the home page's script: an array or object literal of plain data, read with vm.
function homeConst(name) {
  const start = HOME.indexOf(`const ${name}=`);
  assert.ok(start >= 0, `const ${name} in index.html`);
  const from = start + `const ${name}=`.length;
  const open = HOME[from], close = open === '[' ? ']' : '}';
  let depth = 0, i = from, quote = null;
  for (; i < HOME.length; i++) {
    const ch = HOME[i];
    if (quote) { if (ch === '\\') i++; else if (ch === quote) quote = null; continue; }
    if (ch === "'" || ch === '"' || ch === '`') quote = ch;
    else if (ch === open) depth++;
    else if (ch === close && --depth === 0) break;
  }
  return vm.runInNewContext('(' + HOME.slice(from, i + 1) + ')');
}
const PLACE_KEYS = ['btn', 'text', 'imgcard', 'bg', 'menu', 'load', 'intro', 'scroll', 'page'];

test('every animation on the home page has one or more places, all of them known', () => {
  const places = homeConst('PLACES');
  const slugs = homeConst('CATS').flatMap(cat => cat.entries.map(e => e[0]));
  assert.deepEqual(Object.keys(places), slugs, 'PLACES lists every card once, in home order');
  for (const slug of slugs) {
    assert.ok(places[slug].length >= 1, `${slug} has a place`);
    for (const key of places[slug]) assert.ok(PLACE_KEYS.includes(key), `${slug}: unknown place ${key}`);
    assert.equal(new Set(places[slug]).size, places[slug].length, `${slug} lists a place twice`);
  }
});

test('every place holds at least one animation', () => {
  const used = new Set(Object.values(homeConst('PLACES')).flat());
  for (const key of PLACE_KEYS) assert.ok(used.has(key), `${key} holds no animation`);
});

test('the eight Start cards are on the home page', () => {
  const picks = homeConst('PICKS'), slugs = new Set(Object.keys(homeConst('PLACES')));
  assert.equal(picks.length, 8);
  for (const slug of picks) assert.ok(slugs.has(slug), slug);
});
```

- [ ] **Step 2: Run them and see them fail**

Run: `node --test tests/pages.test.js`
Expected: FAIL — "const PLACES in index.html".

- [ ] **Step 3: Add the data** — in `index.html`, after the `};` closing `const PV={`, insert:

```js
// Where each animation can go: the place keys of the home page's tiles (the first one labels its card).
const PLACES={
  // 01
  'parallax-depth-of-field':['scroll','imgcard'],
  'parallax-scrolling':['scroll','imgcard'],
  'reverse-scrolling-columns':['scroll','imgcard'],
  'cover-card-to-fixed-header':['scroll','menu'],
  'fly-in-fly-out-contact-list':['scroll'],
  'stacking-cards':['scroll','imgcard'],
  'scroll-trigger':['scroll'],
  'scrub-animation':['scroll'],
  'pin-animation':['scroll'],
  'snap-scrolling':['scroll','imgcard'],
  'scrollytelling':['scroll'],
  'reveal-on-scroll':['scroll','imgcard'],
  'stagger-reveal':['scroll','imgcard'],
  'horizontal-scroll':['scroll','imgcard'],
  'sticky-section':['scroll'],
  'counter-animation':['scroll','text'],
  'progress-bar':['scroll','load'],
  'section-wipe':['scroll'],
  'zoom-into-image':['scroll','imgcard'],
  'scroll-image-sequence':['scroll','imgcard'],
  'smooth-scroll':['scroll'],
  'text-fill-on-scroll':['scroll','text'],
  'scroll-velocity-skew':['scroll','imgcard'],
  'svg-line-draw':['scroll'],
  'scrollspy-nav':['scroll','menu'],
  'scroll-background-color':['scroll','bg'],
  // 02
  'fade-in-out':['intro'],
  'slide-in':['intro','menu','load'],
  'slide-up-reveal':['intro','text'],
  'scale-in':['intro','menu'],
  'clip-path-reveal':['intro','imgcard'],
  'curtain-reveal':['intro'],
  'split-text-reveal':['intro','text'],
  'letter-by-letter-stagger':['intro','text'],
  'word-by-word-reveal':['intro','text'],
  'blur-in':['intro','imgcard'],
  'flip-in':['intro','imgcard'],
  'bounce-in':['intro','load'],
  'rotate-in':['intro'],
  // 03
  'view-transitions-api':['page'],
  'shared-element-transition':['page','imgcard'],
  'morph-transition':['page'],
  'crossfade':['page'],
  'slide-transition':['page'],
  'zoom-transition':['page'],
  'flash-transition':['page'],
  'blur-transition':['page','imgcard'],
  'elastic-transition':['page'],
  'portal-zoom':['page'],
  'dissolve':['page','imgcard'],
  'flip-technique':['page','imgcard'],
  // 04
  'hover-state':['btn','imgcard'],
  'click-ripple':['btn'],
  'focus-ring':['menu'],
  'button-press-scale':['btn'],
  'magnetic-button':['btn'],
  'toggle-switch':['btn','menu'],
  'heart-burst':['btn','load'],
  'success-confetti':['btn','load'],
  'skeleton-loader':['load','imgcard'],
  'shimmer-effect':['load'],
  'loading-spinner':['load'],
  'progress-animation':['load'],
  'checkmark-draw':['load','menu'],
  'form-field-morph':['menu'],
  'badge-pulse':['load','btn'],
  'tooltip-reveal':['btn'],
  'drawer-slide':['menu'],
  'modal-expand':['imgcard','btn'],
  'accordion':['menu'],
  'cursor-follower':['bg'],
  'error-shake':['menu','load'],
  'swipe-to-dismiss':['imgcard'],
  'hamburger-menu-toggle':['menu','btn'],
  'theme-toggle-morph':['btn'],
  'copy-to-clipboard':['btn','load'],
  'star-rating':['menu','btn'],
  'toast-notification':['load'],
  'segmented-control':['menu','btn'],
  'pull-to-refresh':['load'],
  // 05
  'kinetic-typography':['text','intro'],
  'typewriter-effect':['text','intro'],
  'scramble-text':['text'],
  'variable-font-morph':['text'],
  'text-clip-path-reveal':['text','intro'],
  'marquee-ticker':['text'],
  'text-morphing':['text'],
  'text-gradient-animation':['text'],
  'outline-to-fill':['text'],
  'enter-exit-typography':['text','intro'],
  'rotate-word-carousel':['text'],
  'glitch-text':['text'],
  'text-on-path':['text'],
  'wavy-text':['text'],
  // 06
  '3d-model-orbit':['imgcard'],
  'scroll-driven-3d-rotation':['scroll','imgcard'],
  'parallax-3d-tilt':['imgcard'],
  'canvas-particle-effect':['bg'],
  'fluid-simulation':['bg'],
  'glassmorphism-animated':['imgcard','bg'],
  'webgl-shader-animation':['bg'],
  'noise-based-motion':['bg'],
  'svg-path-animation':['imgcard','intro'],
  'chromatic-aberration':['text'],
  '2-5d-pseudo-3d':['imgcard'],
  'ray-marching-sdf':['bg'],
  'gpgpu-particle-system':['bg'],
  'image-distortion-hover':['imgcard'],
  'cloth-simulation':['imgcard'],
  'volumetric-smoke':['bg'],
  'morphing-blob':['bg'],
  'flip-card-3d':['imgcard'],
  // 07
  'animated-gradient-background':['bg'],
  'mesh-gradient':['bg'],
  'aurora':['bg'],
  'grain-overlay':['bg','imgcard'],
  'scanline':['bg'],
  'light-leak':['bg','imgcard'],
  'starfield':['bg'],
  'breathing-glow':['bg','load'],
  'ambient-ripple':['bg'],
  'floating-elements':['bg'],
  'grid-dot-pattern-parallax':['bg'],
  'abstract-geometric-motion':['bg'],
  'particle-constellation':['bg'],
  'flow-field':['bg'],
  'synthwave-grid':['bg'],
  'matrix-rain':['bg'],
  'plasma':['bg']
};
// The eight cards of "Good places to start", in this order.
const PICKS=['click-ripple','typewriter-effect','flip-card-3d','aurora','hamburger-menu-toggle','loading-spinner','parallax-scrolling','slide-up-reveal'];
```

- [ ] **Step 4: Run the tests**

Run: `node --test "tests/*.test.js"`
Expected: PASS. (Nothing on the page uses the new data yet, so the page looks and works as before.)

- [ ] **Step 5: Commit**

```bash
git add index.html tests/pages.test.js
git commit -m "feat: the home page knows where each animation can go (PLACES) and its eight first picks (PICKS)"
```

---

### Task 3: The page check can check the home page

**Files:**
- Modify: `tools/check-pages.mjs` (the header comment, the `pages` list, a new `HOME_CHECK` after `CHECK`, the loop over pages)

**Interfaces:**
- Produces: `node tools/check-pages.mjs --base <url> home` checks the home page at the six setups. Inside the loop, `const home = page === 'home'`; home pages evaluate `HOME_CHECK` instead of `CHECK` and skip the demo-page checks. Later tasks add `homeViewProblems()` (Task 5), `homePhoneProblems()` (Task 5) and `homeCopyProblems()` (Task 6) inside the `if (home)` branch this task adds.

- [ ] **Step 1: Let `home` through the argument list** — replace the `const pages = …` statement with:

```js
const pages = args.map(p => (p === 'home' ? p : p.replace(/\\/g, '/').replace(/^\.?\//, '').replace(/\/?(index\.html)?$/, '/')))
  .flatMap(p => {
    if (p === 'home' || isPage(p) || !existsSync(join(ROOT, p))) return [p];
    const inside = readdirSync(join(ROOT, p), { withFileTypes: true })
      .filter(d => d.isDirectory() && isPage(p + d.name)).map(d => `${p}${d.name}/`).sort();
    return inside.length ? inside : [p];
  });
```

and change the usage message to `Usage: node tools/check-pages.mjs [--base URL] [--out DIR] <page or category folder, or home>...`.

- [ ] **Step 2: Add the home page's in-page check** — right after the `CHECK` constant, add:

```js
// Runs inside the home page. Returns the problems found: overflow, small targets on phones, the search box and the first
// row of place tiles on the first screen (1280×800 and 375×812), the tile counts, and the eight Start cards.
const HOME_CHECK = `(() => {
  const r = el => el.getBoundingClientRect();
  const phone = innerWidth <= 600;
  const problems = [];
  if (!document.getElementById('places')) problems.push('not the new home page');
  if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1) problems.push('horizontal overflow');
  if (phone) {
    const small = [...document.querySelectorAll('.top a, .top button, .search button, .pop button, .place, .card .copy, .pillbtn, .bigbtn, .pinbar button, .foot a')]
      .filter(el => el.getClientRects().length)
      .filter(el => { const b = r(el); return b.width < 44 || b.height < 44; })
      .map(el => el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '') + ' ' + Math.round(r(el).width) + 'x' + Math.round(r(el).height));
    if (small.length) problems.push('small targets: ' + small.join(', '));
  }
  const firstScreen = (innerWidth === 1280 && innerHeight === 800) || (innerWidth === 375 && innerHeight === 812);
  const search = document.querySelector('.search'), tile = document.querySelector('.place');
  if (firstScreen && search && r(search).bottom > innerHeight) problems.push('search box below the first screen');
  if (firstScreen && tile && r(tile).bottom > innerHeight) problems.push('place tiles below the first screen');
  const counts = [...document.querySelectorAll('.pl-count')].map(el => el.textContent.trim());
  if (counts.length !== 9 || counts.some(t => !/^\\d+ animations?$/.test(t))) problems.push('tile counts: ' + counts.join(' | '));
  const cards = document.querySelectorAll('#cards .card').length;
  if (cards !== 8) problems.push('Start shows ' + cards + ' cards, not 8');
  return { problems };
})()`;
```

- [ ] **Step 3: Use it in the loop** — in the `for (const page of pages)` loop:
  - replace the `const name = …` line with
    ```js
    const home = page === 'home';
    const name = home ? 'home' : parts.length > 1 ? `${parts[parts.length - 2].slice(0, 2)}-${parts[parts.length - 1]}` : parts[0];
    ```
  - replace `await send('Page.navigate', { url: `${BASE}/${page}` });` with `await send('Page.navigate', { url: home ? `${BASE}/` : `${BASE}/${page}` });`
  - replace `const result = await evaluate(CHECK);` with `const result = await evaluate(home ? HOME_CHECK : CHECK);`
  - wrap every check after `problems.push(...result.problems);` that reads `result.kind`, `result.loop` or `result.switches` in `if (!home) { … }` (the Loop-on-arrival check and the reduced-motion switches check before the screenshots; the four `movementProblems` / `loopProblems` / `demoProblems` / `scrollProblems` lines after them). The screenshots stay for both.
  - after the `if (!home) { … }` holding those four lines, add the branch later tasks fill:
    ```js
        if (home) {
          // Task 5 and Task 6 add the home page's interaction checks here.
        }
    ```

- [ ] **Step 4: Describe the home target in the header comment** — after the line `//   e.g. node tools/check-pages.mjs animations/02-entrance-and-exit`, add:

```js
//   node tools/check-pages.mjs home   checks the home page at the same six setups: overflow, small targets on phones,
//   the search box and the place tiles on the first screen, the tile counts and the eight Start cards.
```

- [ ] **Step 5: Run it on today's home page and see it fail**

Serve the worktree, then run: `node tools/check-pages.mjs --base http://127.0.0.1:<port> home`
Expected: six `FAIL home …` lines, each naming at least "not the new home page", "tile counts" and "Start shows 0 cards, not 8"; exit code 1. (The home page is rebuilt in Task 4.)

- [ ] **Step 6: Check that demo pages are checked as before**

Run: `node tools/check-pages.mjs --base http://127.0.0.1:<port> animations/02-entrance-and-exit/rotate-in animations/04-micro-interactions/checkmark-draw`
Expected: 12 `ok` lines, exit code 0.

- [ ] **Step 7: Commit**

```bash
git add tools/check-pages.mjs
git commit -m "feat: the page check can check the home page (home): overflow, touch targets, first screen, tile counts, Start cards"
```

---

### Task 4: The new home page: layout, look and Start view

**Files:**
- Modify: `index.html` — the page styles, one reduced-motion block, the `<body>` markup and the home script (the preview library and `CATS` stay)
- Test: `tests/pages.test.js`

**Interfaces:**
- Consumes: `PLACES`, `PICKS` (Task 2); the `home` check (Task 3); the preview library (`PV`, `pvMarkup(k)`, `engines`, `reduce`, `FRAME`).
- Produces for Task 5 and Task 6 (top-level names in the home script): `PLACE_LIST` ({key,name,url}[]), `PLACE` (key → entry), `esc(s)`, `slugify(s)`, `wordsOf(s)`, `ALL` (entries in home order: `{slug,name,desc,cat,places,order,url,nameW,placeW,descW}`), `BY_SLUG`, `ICON_COPY`, `ICON_DONE`, `ICON_OPEN`, `ICON_ARROW`, `io`, `buildCard(e)`, `CARD` (slug → card element with `_play()`/`_pause()`), `$(id)`, `resultsEl`, `cardsBox`, `place(cards)`, `showCards(list)`. Element ids: `top`, `nav-all`, `theme-toggle`, `gh-star-count`, `search-form`, `q`, `q-clear`, `places`, `results`, `pinbar`, `pin-back`, `q2`, `results-title`, `results-sub`, `clear-view`, `cards`, `empty`, `empty-title`, `more`, `more-btn`, `more-label`, `how`, `toast`. Tiles and phone chips carry `data-place="<key>"`; suggestion buttons carry `data-q="<text>"`; tile counts `data-count="<key>"`.

- [ ] **Step 1: Update the home page tests** — in `tests/pages.test.js`, replace the test `the home page uses Schibsted Grotesk and the new intro line` with:

```js
test('the home page uses Schibsted Grotesk and asks what to animate', () => {
  assert.ok(HOME.includes("url('assets/fonts/schibsted-latin.woff2')"), 'Latin font file');
  assert.ok(HOME.includes("url('assets/fonts/schibsted-latin-ext.woff2')"), 'Latin Extended font file');
  for (const old of ['Bricolage', 'PlexMono', 'var(--mono)', '--mono:']) assert.ok(!HOME.includes(old), `still uses ${old}`);
  assert.ok(HOME.includes('<h1 class="h1" id="hero-title">What do you want to animate?</h1>'), 'heading');
  assert.ok(HOME.includes('Pick a place, or describe it in your own words. Every animation plays live, and each one comes with a ready-made prompt for your AI assistant.'), 'intro line');
});

test('the counts written on the home page match its cards', () => {
  const cards = homeConst('CATS').reduce((n, cat) => n + cat.entries.length, 0);
  assert.ok(HOME.includes(`${cards} free animations · no coding needed`), 'hero pill');
  assert.ok(HOME.includes(`<span id="more-label">Browse all ${cards} animations</span>`), 'Browse all button');
});
```

(Move `homeConst` and `PLACE_KEYS` above these tests if they sit below them.)

- [ ] **Step 2: Run the tests and see them fail**

Run: `node --test tests/pages.test.js`
Expected: FAIL — "heading" and "hero pill".

- [ ] **Step 3: Replace the page styles** — in `index.html`, replace everything from the `:root{` rule (the first rule after the two `@font-face` rules) up to, but not including, the comment `/* ── preview library ── */`, with:

```css
:root{
  --bg:#f8f7f4;--surface:#ffffff;--ink:#16161b;--ink-2:#45454f;--muted:#676771;
  --line:#e5e3dc;--line-2:#efede8;--brand:#2f5bea;--ok:#157a43;
  --shadow:0 1px 2px rgba(22,22,27,.04),0 8px 24px rgba(22,22,27,.06);
  --shadow-2:0 2px 4px rgba(22,22,27,.05),0 18px 40px rgba(22,22,27,.11);
  --c1:#6ea8ff;--c2:#5fd88a;--c3:#b98cff;--c4:#ff9d5c;--c5:#ff6f8b;--c6:#3fd6c4;--c7:#ffce5a;
  --disp:'Schibsted Grotesk',system-ui,-apple-system,'Segoe UI',sans-serif;--text:var(--disp);
  --ease:cubic-bezier(.22,1,.36,1);--gut:clamp(16px,4vw,40px);
  color-scheme:light;
}
:root[data-theme="dark"]{
  --bg:#0e0e11;--surface:#17171c;--ink:#f4f4f2;--ink-2:#c6c6cc;--muted:#9c9ca5;
  --line:rgba(255,255,255,.13);--line-2:rgba(255,255,255,.07);--brand:#86a8ff;
  --shadow:0 1px 2px rgba(0,0,0,.3),0 8px 24px rgba(0,0,0,.25);
  --shadow-2:0 2px 4px rgba(0,0,0,.35),0 18px 40px rgba(0,0,0,.45);
  color-scheme:dark;
}
.c1{--accent:var(--c1)}.c2{--accent:var(--c2)}.c3{--accent:var(--c3)}.c4{--accent:var(--c4)}.c5{--accent:var(--c5)}.c6{--accent:var(--c6)}.c7{--accent:var(--c7)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
[hidden]{display:none!important}
html,body{background:var(--bg);color:var(--ink)}
body{font-family:var(--text);font-size:16px;line-height:1.5;-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:inherit}
button,input{font:inherit;color:inherit}
:focus-visible{outline:3px solid var(--brand);outline-offset:3px}
.sr,.places-h{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.skip{position:absolute;left:16px;top:-80px;z-index:100;padding:10px 16px;border-radius:10px;background:var(--ink);color:var(--bg);font-weight:700;text-decoration:none}
.skip:focus{top:12px}
.i{width:18px;height:18px;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.wrap{width:min(1280px,calc(100% - 2 * var(--gut)));margin-inline:auto}

/* top bar */
.top{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:76px}
.brand{display:inline-flex;align-items:center;gap:12px;min-height:44px;text-decoration:none;font-size:17px;font-weight:800;letter-spacing:-.015em;white-space:nowrap}
.mark{width:30px;height:30px;flex:none}
.mark .ring{fill:var(--bg);stroke:currentColor;stroke-width:1.8}
.mark .ball{fill:currentColor}
.nav{display:flex;align-items:center;gap:6px}
.lnk{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 14px;border-radius:999px;text-decoration:none;font-size:15px;font-weight:600;color:var(--ink-2);white-space:nowrap}
.icon-btn{display:inline-grid;place-items:center;width:44px;height:44px;border-radius:999px;border:0;background:none;color:var(--ink-2);cursor:pointer}
.theme-btn .sun,:root[data-theme="dark"] .theme-btn .moon{display:none}
:root[data-theme="dark"] .theme-btn .sun{display:block}
.gh{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 16px;border-radius:999px;border:1px solid var(--line);background:var(--surface);text-decoration:none;font-size:15px;font-weight:600;white-space:nowrap}
.gh-c{color:var(--muted);font-variant-numeric:tabular-nums}
@media(hover:hover){.lnk:hover,.icon-btn:hover{color:var(--ink);background:var(--line-2)}.gh:hover{border-color:var(--ink)}}

/* hero */
.home-hero{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;padding-top:clamp(16px,4vw,56px)}
.float{position:absolute;pointer-events:none;animation:fl 7s ease-in-out infinite}
.fl1{left:6%;top:60px;width:26px;height:26px;border-radius:50%;background:var(--c7)}
.fl2{left:14%;top:240px;width:22px;height:22px;border-radius:6px;background:var(--c1);animation-delay:-2s;animation-duration:8s}
.fl3{left:2%;top:320px;width:30px;height:30px;border-radius:50%;border:5px solid var(--c5);animation-delay:-4s}
.fl4{right:8%;top:80px;width:28px;height:28px;background:var(--c2);clip-path:polygon(50% 0,100% 100%,0 100%);animation-delay:-1s;animation-duration:9s}
.fl5{right:16%;top:280px;width:16px;height:16px;border-radius:50%;background:var(--c3);animation-delay:-3s}
.fl6{right:2%;top:350px;width:24px;height:24px;border-radius:7px;border:5px solid var(--c4);animation-delay:-5s;animation-duration:8s}
@keyframes fl{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-16px) rotate(14deg)}}
.pill{display:inline-flex;align-items:center;gap:10px;padding:8px 16px;border-radius:999px;background:var(--surface);border:1px solid var(--line);font-size:14px;font-weight:600;color:var(--ink-2)}
.pill-dot{position:relative;width:8px;height:8px;border-radius:50%;background:#1f9d57}
.pill-dot::after{content:"";position:absolute;inset:0;border-radius:50%;background:#1f9d57;animation:pdot 2s ease-out infinite}
@keyframes pdot{from{transform:scale(1);opacity:.6}to{transform:scale(2.8);opacity:0}}
.h1{margin-top:22px;font-size:clamp(34px,5.2vw,64px);font-weight:800;line-height:1.04;letter-spacing:-.035em}
.sub{margin-top:18px;max-width:640px;font-size:clamp(16px,1.4vw,19px);line-height:1.55;color:var(--ink-2)}
.search{display:flex;align-items:center;width:min(720px,100%);margin-top:clamp(20px,3vw,34px);padding:8px 8px 8px 24px;border-radius:999px;background:var(--surface);border:1px solid var(--line);box-shadow:var(--shadow)}
.search:focus-within{border-color:var(--brand);box-shadow:0 0 0 3px color-mix(in srgb,var(--brand) 22%,transparent),var(--shadow)}
.search>.i{width:22px;height:22px;color:var(--muted)}
#q{flex:1;min-width:0;min-height:48px;margin-left:12px;border:0;background:none;font-size:17px;outline:none;-webkit-appearance:none;appearance:none}
#q::placeholder,#q2::placeholder{color:var(--muted)}
#q::-webkit-search-cancel-button,#q2::-webkit-search-cancel-button{display:none}
#q:focus-visible,#q2:focus-visible{outline:none}
.clear{display:grid;place-items:center;width:44px;height:44px;flex:none;margin-right:4px;border-radius:999px;border:0;background:none;color:var(--muted);cursor:pointer}
.go{display:inline-flex;align-items:center;justify-content:center;flex:none;min-height:48px;padding:0 26px;border-radius:999px;border:0;background:var(--ink);color:var(--bg);font-size:16px;font-weight:700;cursor:pointer}
.go .i{display:none}
.pop{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:2px;margin-top:12px;font-size:15px;color:var(--muted)}
.pop button{min-height:44px;padding:0 9px;border:0;background:none;color:var(--ink-2);font-size:15px;font-weight:600;text-decoration:underline;text-decoration-color:var(--line);text-underline-offset:5px;cursor:pointer}
@media(hover:hover){.pop button:hover{color:var(--brand);text-decoration-color:currentColor}}

/* place tiles */
.places{display:grid;grid-template-columns:repeat(9,minmax(0,1fr));gap:20px;margin-top:44px}
.place{display:flex;flex-direction:column;align-items:center;padding:0;border:0;border-radius:24px;background:none;text-align:center;cursor:pointer}
.p-btn{--pa:#2f5bea}.p-text{--pa:#d6336c}.p-img{--pa:#7048e8}.p-bg{--pa:#e8890c}.p-menu{--pa:#0c8f7f}.p-load{--pa:#e8590c}.p-intro{--pa:#2b9a4a}.p-scroll{--pa:#3b5b8c}.p-page{--pa:#9c36b5}
.art{position:relative;display:grid;place-items:center;width:100%;height:108px;border-radius:22px;background:color-mix(in srgb,var(--pa) 12%,var(--surface));overflow:hidden;transition:transform .35s var(--ease),box-shadow .25s}
@media(hover:hover){.place:hover .art{transform:translateY(-4px);box-shadow:var(--shadow-2)}}
.place[aria-pressed="true"] .art{box-shadow:0 0 0 3px var(--ink)}
.pl-name{margin-top:12px;font-size:15px;font-weight:700;line-height:1.2}
.pl-count{min-height:1.2em;margin-top:3px;font-size:13px;color:var(--muted)}
.ab-btn{position:relative;z-index:2;display:grid;place-items:center;width:62px;height:28px;border-radius:999px;background:var(--pa);color:#fff;font-size:12px;font-weight:700;animation:abpress 2.4s var(--ease) infinite}
.ab-ring{position:absolute;left:50%;top:50%;width:62px;height:28px;margin:-14px 0 0 -31px;border-radius:999px;border:2px solid var(--pa);opacity:0;animation:abring 2.4s ease-out infinite}
.ab-dot{position:absolute;z-index:3;left:50%;top:50%;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;background:var(--ink);border:2px solid var(--surface);animation:abdot 2.4s var(--ease) infinite}
@keyframes abpress{0%,34%{transform:scale(1)}42%{transform:scale(.88)}56%{transform:scale(1.06)}66%,100%{transform:scale(1)}}
@keyframes abring{0%,38%{transform:scale(1);opacity:0}42%{opacity:.8}80%,100%{transform:scale(1.6,2.1);opacity:0}}
@keyframes abdot{0%{transform:translate(36px,32px);opacity:0}14%{opacity:1}34%{transform:translate(14px,6px)}42%{transform:translate(14px,6px) scale(.8)}52%{transform:translate(14px,6px) scale(1)}80%{opacity:1}100%{transform:translate(36px,32px);opacity:0}}
.at{display:flex;gap:1px;font-size:34px;font-weight:800;letter-spacing:-.02em;color:var(--pa)}
.at span{display:inline-block;animation:atw 1.6s ease-in-out infinite}
.at span:nth-child(1){animation-delay:-1.6s}.at span:nth-child(2){animation-delay:-1.4s}.at span:nth-child(3){animation-delay:-1.2s}
@keyframes atw{0%,100%{transform:translateY(6px)}50%{transform:translateY(-6px)}}
.ai{position:relative;width:72px;height:54px;border-radius:10px;overflow:hidden;background:linear-gradient(#bcd0ff,#e9efff);box-shadow:0 6px 14px rgba(22,22,27,.14);animation:aicard 3.6s var(--ease) infinite}
.ai-sun{position:absolute;right:11px;top:9px;width:12px;height:12px;border-radius:50%;background:#ffb020}
.ai-m1{position:absolute;left:-4px;bottom:-22px;width:44px;height:44px;border-radius:6px;background:var(--pa);transform:rotate(45deg)}
.ai-m2{position:absolute;left:30px;bottom:-28px;width:48px;height:48px;border-radius:6px;background:color-mix(in srgb,var(--pa) 55%,#fff);transform:rotate(45deg)}
@keyframes aicard{0%,100%{transform:rotate(-5deg) translateY(3px)}50%{transform:rotate(4deg) translateY(-4px)}}
.abg{position:absolute;width:72px;height:72px;border-radius:50%;filter:blur(14px);opacity:.9;animation:abg 7s ease-in-out infinite}
.abg.b1{left:6px;top:-12px;background:#ff9d5c}
.abg.b2{right:0;bottom:-18px;background:#ff6f8b;animation-delay:-2.4s}
.abg.b3{left:40px;top:26px;background:#ffce5a;animation-delay:-4.6s}
@keyframes abg{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(12px,-8px) scale(1.15)}66%{transform:translate(-10px,8px) scale(.9)}}
.am{position:relative;width:34px;height:26px}
.am span{position:absolute;left:0;width:34px;height:4px;border-radius:2px;background:var(--pa)}
.am span:nth-child(1){top:0;animation:am1 3s var(--ease) infinite}
.am span:nth-child(2){top:11px;animation:am2 3s var(--ease) infinite}
.am span:nth-child(3){top:22px;animation:am3 3s var(--ease) infinite}
@keyframes am1{0%,30%{transform:none}45%,80%{transform:translateY(11px) rotate(45deg)}95%,100%{transform:none}}
@keyframes am2{0%,30%{opacity:1}40%,85%{opacity:0}95%,100%{opacity:1}}
@keyframes am3{0%,30%{transform:none}45%,80%{transform:translateY(-11px) rotate(-45deg)}95%,100%{transform:none}}
.al{display:flex;flex-direction:column;align-items:center;gap:12px}
.al-spin{width:30px;height:30px;border-radius:50%;border:4px solid color-mix(in srgb,var(--pa) 25%,transparent);border-top-color:var(--pa);animation:alspin .9s linear infinite}
.al-bar{position:relative;width:64px;height:6px;border-radius:3px;overflow:hidden;background:color-mix(in srgb,var(--pa) 22%,transparent)}
.al-bar span{position:absolute;inset:0;background:var(--pa);transform-origin:left;animation:albar 2.6s var(--ease) infinite}
@keyframes alspin{to{transform:rotate(360deg)}}
@keyframes albar{0%{transform:scaleX(0)}70%,100%{transform:scaleX(1)}}
.ap{display:flex;flex-direction:column;gap:6px;width:72px;padding:10px;border-radius:10px;background:var(--surface);box-shadow:0 6px 14px rgba(22,22,27,.12)}
.ap span{display:block;height:8px;border-radius:3px;animation:aprise 3s var(--ease) infinite}
.ap .h{width:70%;height:10px;background:var(--pa);animation-delay:-1.2s}
.ap .l1{width:100%;background:color-mix(in srgb,var(--pa) 30%,transparent);animation-delay:-1.05s}
.ap .l2{width:80%;background:color-mix(in srgb,var(--pa) 30%,transparent);animation-delay:-.9s}
@keyframes aprise{0%,8%{opacity:0;transform:translateY(8px)}30%,80%{opacity:1;transform:none}100%{opacity:0;transform:none}}
.as{position:relative;width:48px;height:76px;border-radius:10px;border:3px solid var(--ink);background:var(--surface);overflow:hidden}
.as-in{position:absolute;left:5px;right:8px;top:0;height:200%;background:repeating-linear-gradient(180deg,color-mix(in srgb,var(--pa) 55%,transparent) 0 9%,transparent 9% 14%,color-mix(in srgb,var(--pa) 25%,transparent) 14% 21%,transparent 21% 25%);animation:asy 4s linear infinite}
.as-bar{position:absolute;right:2px;top:4px;width:3px;height:18px;border-radius:2px;background:var(--pa);animation:asbar 4s linear infinite}
@keyframes asy{to{transform:translateY(-50%)}}
@keyframes asbar{from{transform:translateY(0)}to{transform:translateY(42px)}}
.ax{position:relative;width:64px;height:76px;border-radius:10px;overflow:hidden;box-shadow:0 6px 14px rgba(22,22,27,.14)}
.ax span{position:absolute;inset:0;background:linear-gradient(var(--pa),var(--pa)) 8px 10px/60% 8px no-repeat,linear-gradient(color-mix(in srgb,var(--pa) 30%,transparent),color-mix(in srgb,var(--pa) 30%,transparent)) 8px 26px/80% 6px no-repeat,linear-gradient(color-mix(in srgb,var(--pa) 30%,transparent),color-mix(in srgb,var(--pa) 30%,transparent)) 8px 38px/64% 6px no-repeat,var(--surface)}
.ax .pa{animation:axa 4s var(--ease) infinite}
.ax .pb{background-color:color-mix(in srgb,var(--pa) 18%,var(--surface));animation:axb 4s var(--ease) infinite}
@keyframes axa{0%,32%{transform:translateX(0)}46%,82%{transform:translateX(-100%)}96%,100%{transform:translateX(0)}}
@keyframes axb{0%,32%{transform:translateX(100%)}46%,82%{transform:translateX(0)}96%,100%{transform:translateX(100%)}}

/* results */
.results{margin-top:clamp(40px,6vw,72px);scroll-margin-top:12px}
.pinbar{display:none}
.rhead{display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:16px 24px;margin-bottom:24px}
.rtitle{font-size:clamp(24px,2.6vw,32px);font-weight:800;letter-spacing:-.02em;line-height:1.1}
.rsub{margin-top:6px;font-size:16px;color:var(--muted)}
.pillbtn{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 18px;border-radius:999px;border:1px solid var(--line);background:var(--surface);font-size:15px;font-weight:600;cursor:pointer}
.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px}
.group{scroll-margin-top:12px}
.group+.group{margin-top:56px}
.ghead{display:flex;align-items:baseline;flex-wrap:wrap;gap:6px 12px;margin-bottom:20px;font-weight:800}
.gnum{font-size:26px;color:var(--muted);font-variant-numeric:tabular-nums}
.gname{font-size:22px;letter-spacing:-.015em}
.gcount{font-size:15px;font-weight:400;color:var(--muted)}

/* cards */
.card{position:relative;display:flex;flex-direction:column;padding:10px;border-radius:20px;background:var(--surface);box-shadow:var(--shadow);transition:transform .35s var(--ease),box-shadow .35s var(--ease)}
.card:has(.title a:focus-visible){outline:3px solid var(--brand);outline-offset:3px}
.stage{position:relative;aspect-ratio:16/10;border-radius:12px;overflow:hidden;background:#08080a}
.pv{position:absolute;inset:0;width:100%;height:100%;transition:transform .6s var(--ease);--ink:#f4f4f2;--ink-dim:#adadb2;--muted:#77777e;--line:rgba(255,255,255,.085)}
.tag{position:absolute;z-index:1;left:10px;top:10px;padding:5px 11px;border-radius:999px;background:rgba(255,255,255,.94);color:#16161b;font-size:12px;font-weight:700;line-height:1.2}
.results.no-tags .tag{display:none}
.meta{display:flex;flex-direction:column;flex:1;padding:14px 8px 6px}
.title{font-size:18px;font-weight:700;letter-spacing:-.01em;line-height:1.25}
.title a{text-decoration:none;outline:none}
.title a::after{content:"";position:absolute;inset:0;z-index:2;border-radius:20px}
.desc{flex:1;margin-top:6px;font-size:15px;line-height:1.5;color:var(--ink-2)}
.acts{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:14px}
.copy{position:relative;z-index:3;display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 16px;border-radius:999px;border:1px solid var(--line);background:var(--surface);font-size:14px;font-weight:600;cursor:pointer;transition:background .2s,border-color .2s,color .2s}
.copy.done{background:var(--ok);border-color:var(--ok);color:#fff}
.try{display:inline-flex;align-items:center;gap:6px;padding-right:6px;font-size:15px;font-weight:700;color:var(--brand)}
.try .i{transition:transform .25s var(--ease)}
@media(hover:hover){
  .card:hover{transform:translateY(-4px);box-shadow:var(--shadow-2)}
  .card:hover .pv{transform:scale(1.04)}
  .card:hover .try .i{transform:translateX(3px)}
  .copy:hover,.pillbtn:hover{border-color:var(--ink)}
  .copy.done:hover{border-color:var(--ok)}
}

/* below the cards */
.more{display:flex;justify-content:center;margin-top:36px}
.bigbtn{display:inline-flex;align-items:center;gap:10px;min-height:52px;padding:0 26px;border-radius:999px;border:1.5px solid var(--ink);background:none;font-size:16px;font-weight:700;cursor:pointer;transition:background .2s,color .2s}
@media(hover:hover){.bigbtn:hover{background:var(--ink);color:var(--bg)}}
.empty{display:flex;flex-direction:column;align-items:center;gap:12px;padding:56px 24px;border-radius:20px;background:var(--surface);box-shadow:var(--shadow);text-align:center}
.empty-t{font-size:22px;font-weight:800}
.empty-s{font-size:16px;color:var(--muted)}
.empty .pop{margin-top:0}
.noscript{max-width:60ch;margin-top:16px;line-height:1.7;color:var(--ink-2)}

/* how it works, footer, message */
.how{margin-top:clamp(56px,8vw,96px);padding:clamp(36px,6vw,80px) 0;background:var(--surface);border-block:1px solid var(--line-2)}
.how-head{display:flex;flex-direction:column;align-items:center;gap:6px;margin-bottom:40px;text-align:center}
.steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;list-style:none}
.step{display:flex;flex-direction:column;gap:10px;padding:28px;border-radius:20px;background:var(--bg)}
.step-n{display:grid;place-items:center;width:44px;height:44px;flex:none;border-radius:50%;background:var(--ink);color:var(--bg);font-size:18px;font-weight:800}
.step-t{margin-top:6px;font-size:20px;font-weight:700}
.step-p{margin-top:4px;font-size:16px;line-height:1.55;color:var(--ink-2)}
.fine{margin-top:32px;text-align:center;font-size:15px;color:var(--muted)}
.foot{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px 24px;padding:36px 0 44px}
.foot-t{font-size:15px;color:var(--muted)}
.toast{position:fixed;z-index:60;left:50%;bottom:24px;display:flex;align-items:center;gap:10px;min-height:52px;max-width:calc(100% - 32px);padding:0 18px;border-radius:16px;background:var(--ink);color:var(--bg);font-size:15px;font-weight:600;box-shadow:0 12px 32px rgba(22,22,27,.28);opacity:0;transform:translate(-50%,16px);pointer-events:none;transition:opacity .25s,transform .25s var(--ease)}
.toast.show{opacity:1;transform:translate(-50%,0)}
.toast .ok{display:inline-grid;place-items:center;width:28px;height:28px;flex:none;border-radius:50%;background:#1f9d57;color:#fff}
.toast .ok .i{width:16px;height:16px}

/* tablet */
@media(max-width:1024px){
  .float{display:none}
  .places{display:flex;flex-wrap:wrap;justify-content:center;gap:20px 16px}
  .place{width:calc((100% - 64px) / 5)}
  .grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
}
/* phone */
@media(max-width:600px){
  .top{min-height:60px}
  .nav .lnk,.gh{display:none}
  .brand{gap:10px;font-size:15px}
  .mark{width:28px;height:28px}
  .pill{gap:8px;padding:7px 13px;font-size:13px}
  .search{padding:5px 5px 5px 18px}
  #q{min-height:44px;margin-left:10px;font-size:16px}
  .go{width:44px;min-height:44px;padding:0}
  .go-l{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
  .go .i{display:block}
  .home-hero .pop{flex-wrap:nowrap;justify-content:flex-start;gap:8px;width:calc(100% + 2 * var(--gut));margin-inline:calc(-1 * var(--gut));padding-inline:var(--gut);overflow-x:auto;scrollbar-width:none}
  .home-hero .pop>span{display:none}
  .home-hero .pop button{flex:none;padding:0 14px;border:1px solid var(--line);border-radius:999px;background:var(--surface);font-size:14px;text-decoration:none;white-space:nowrap}
  .places-h{position:static;width:auto;height:auto;overflow:visible;clip:auto;white-space:normal;margin-top:28px;font-size:18px;font-weight:800;letter-spacing:-.01em}
  .places{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px 10px;margin-top:14px}
  .place{width:auto}
  .art{height:92px;border-radius:20px}
  .pl-name{margin-top:8px;font-size:14px}
  .pl-count{margin-top:2px;font-size:12px}
  .results{scroll-margin-top:0}
  .results.filtered .pinbar{position:sticky;top:0;z-index:20;display:flex;flex-direction:column;gap:10px;margin:0 calc(-1 * var(--gut)) 16px;padding:10px var(--gut) 12px;background:var(--surface);border-bottom:1px solid var(--line);box-shadow:0 4px 16px rgba(22,22,27,.06)}
  .pinrow{display:flex;align-items:center;gap:8px}
  .pin-back{display:grid;place-items:center;width:44px;height:44px;flex:none;border-radius:999px;border:1px solid var(--line);background:var(--surface);cursor:pointer}
  .pin-search{display:flex;align-items:center;flex:1;min-width:0;padding:0 14px;border-radius:999px;border:1px solid var(--line);background:var(--bg)}
  .pin-search:focus-within{border-color:var(--brand)}
  .pin-search .i{color:var(--muted)}
  #q2{flex:1;min-width:0;min-height:44px;margin-left:8px;border:0;background:none;font-size:16px;outline:none;-webkit-appearance:none;appearance:none}
  .pchips{display:flex;gap:8px;margin-inline:calc(-1 * var(--gut));padding-inline:var(--gut);overflow-x:auto;scrollbar-width:none}
  .pchip{flex:none;min-height:44px;padding:0 14px;border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--ink-2);font-size:14px;font-weight:600;white-space:nowrap;cursor:pointer}
  .pchip[aria-pressed="true"]{background:var(--ink);border-color:var(--ink);color:var(--surface)}
  .group{scroll-margin-top:136px}
  .rhead{margin-bottom:16px}
  .grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
  .card{padding:6px;border-radius:16px}
  .title a::after{border-radius:16px}
  .stage{border-radius:10px}
  .tag{left:6px;top:6px;padding:3px 8px;font-size:11px}
  .meta{padding:10px 6px 4px}
  .title{font-size:15px}
  .desc{margin-top:4px;font-size:13px;line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .acts{margin-top:10px}
  .copy{width:100%;justify-content:center;padding:0 8px;font-size:13px}
  .try{display:none}
  .how-head{margin-bottom:20px}
  .steps{grid-template-columns:1fr;gap:12px}
  .step{flex-direction:row;align-items:flex-start;gap:14px;padding:16px}
  .step-n{width:40px;height:40px;font-size:16px}
  .step-t{margin-top:0;font-size:17px}
  .step-p{font-size:15px}
  .foot{flex-direction:column;align-items:flex-start}
}

```

- [ ] **Step 4: Replace the preview library's reduced-motion block** — replace the block

```css
@media(prefers-reduced-motion:reduce){
  .pv .anim{animation-play-state:paused!important}
  .card{transition:border-color .2s}
  .card:hover .pv{transform:none}
  .card.playing .live{animation:none;opacity:.6}
}
```

with

```css
@media(prefers-reduced-motion:reduce){
  .pv .anim{animation-play-state:paused!important}
  .art *,.art *::before,.art *::after,.pill-dot::after{animation-play-state:paused!important}
  .float{display:none}
  .card,.card:hover,.card:hover .pv,.place:hover .art{transform:none;transition:none}
}
```

(The tile pictures hold a clear frame: their delays and first keyframes show the button, the word, the card, the blobs, the menu icon, the spinner, the page lines, the phone and the first page.)

- [ ] **Step 5: Replace the markup** — replace everything from `<div class="grid-bg"></div><div class="toplight"></div><div class="grain"></div>` through `</main>` with:

```html
<a class="skip" href="#results">Skip to the animations</a>
<header class="wrap top" id="top">
  <a class="brand" href="./"><svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><circle class="ring" cx="11.16" cy="20.84" r="6.1"/><circle class="ring" cx="15.12" cy="16.88" r="6.1"/><circle class="ring" cx="18.51" cy="13.49" r="6.1"/><circle class="ball" cx="21.2" cy="10.8" r="6.6"/></svg><span>Animation Handbook</span></a>
  <nav class="nav" aria-label="Site">
    <a class="lnk" id="nav-all" href="?view=all">Browse all</a>
    <a class="lnk" href="#how">How it works</a>
    <button type="button" class="icon-btn theme-btn" id="theme-toggle" aria-label="Switch between light and dark">
      <svg class="i moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      <svg class="i sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
    </button>
    <a class="gh" id="gh-stars" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener noreferrer"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>GitHub <span class="gh-c" id="gh-star-count"></span></a>
  </nav>
</header>

<main>
  <section class="wrap home-hero" aria-labelledby="hero-title">
    <span class="float fl1" aria-hidden="true"></span><span class="float fl2" aria-hidden="true"></span><span class="float fl3" aria-hidden="true"></span>
    <span class="float fl4" aria-hidden="true"></span><span class="float fl5" aria-hidden="true"></span><span class="float fl6" aria-hidden="true"></span>
    <p class="pill"><span class="pill-dot" aria-hidden="true"></span>129 free animations · no coding needed</p>
    <h1 class="h1" id="hero-title">What do you want to animate?</h1>
    <p class="sub">Pick a place, or describe it in your own words. Every animation plays live, and each one comes with a ready-made prompt for your AI assistant.</p>
    <form class="search" id="search-form" role="search" action="./" method="get">
      <label class="sr" for="q">Describe the animation you want</label>
      <svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
      <input id="q" name="q" type="search" autocomplete="off" spellcheck="false" placeholder="For example: a button that bounces when clicked">
      <button type="button" class="clear" id="q-clear" aria-label="Clear the search" hidden><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      <button type="submit" class="go"><span class="go-l">Search</span><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
    </form>
    <p class="pop"><span>Popular:</span><button type="button" data-q="fade in">fade in</button><button type="button" data-q="typing text">typing text</button><button type="button" data-q="loading spinner">loading spinner</button><button type="button" data-q="parallax">parallax</button><button type="button" data-q="confetti">confetti</button></p>
  </section>

  <section class="wrap" aria-labelledby="places-title">
    <h2 class="places-h" id="places-title">Or pick a place</h2>
    <div class="places" id="places">
      <button type="button" class="place p-btn" data-place="btn" aria-pressed="false"><span class="art" aria-hidden="true"><span class="ab-btn">Like</span><span class="ab-ring"></span><span class="ab-dot"></span></span><span class="pl-name">Buttons</span><span class="pl-count" data-count="btn"></span></button>
      <button type="button" class="place p-text" data-place="text" aria-pressed="false"><span class="art" aria-hidden="true"><span class="at"><span>W</span><span>o</span><span>w</span></span></span><span class="pl-name">Text</span><span class="pl-count" data-count="text"></span></button>
      <button type="button" class="place p-img" data-place="imgcard" aria-pressed="false"><span class="art" aria-hidden="true"><span class="ai"><span class="ai-sun"></span><span class="ai-m1"></span><span class="ai-m2"></span></span></span><span class="pl-name">Images &amp; cards</span><span class="pl-count" data-count="imgcard"></span></button>
      <button type="button" class="place p-bg" data-place="bg" aria-pressed="false"><span class="art" aria-hidden="true"><span class="abg b1"></span><span class="abg b2"></span><span class="abg b3"></span></span><span class="pl-name">Backgrounds</span><span class="pl-count" data-count="bg"></span></button>
      <button type="button" class="place p-menu" data-place="menu" aria-pressed="false"><span class="art" aria-hidden="true"><span class="am"><span></span><span></span><span></span></span></span><span class="pl-name">Menus &amp; forms</span><span class="pl-count" data-count="menu"></span></button>
      <button type="button" class="place p-load" data-place="load" aria-pressed="false"><span class="art" aria-hidden="true"><span class="al"><span class="al-spin"></span><span class="al-bar"><span></span></span></span></span><span class="pl-name">Loading &amp; messages</span><span class="pl-count" data-count="load"></span></button>
      <button type="button" class="place p-intro" data-place="intro" aria-pressed="false"><span class="art" aria-hidden="true"><span class="ap"><span class="h"></span><span class="l1"></span><span class="l2"></span></span></span><span class="pl-name">Page intros</span><span class="pl-count" data-count="intro"></span></button>
      <button type="button" class="place p-scroll" data-place="scroll" aria-pressed="false"><span class="art" aria-hidden="true"><span class="as"><span class="as-in"></span><span class="as-bar"></span></span></span><span class="pl-name">Scrolling</span><span class="pl-count" data-count="scroll"></span></button>
      <button type="button" class="place p-page" data-place="page" aria-pressed="false"><span class="art" aria-hidden="true"><span class="ax"><span class="pa"></span><span class="pb"></span></span></span><span class="pl-name">Page changes</span><span class="pl-count" data-count="page"></span></button>
    </div>
  </section>

  <section class="wrap results" id="results" aria-labelledby="results-title">
    <div class="pinbar" id="pinbar">
      <div class="pinrow">
        <button type="button" class="pin-back" id="pin-back" aria-label="Back to the start"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></button>
        <div class="pin-search"><label class="sr" for="q2">Describe the animation you want</label><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input id="q2" type="search" autocomplete="off" spellcheck="false" placeholder="Search animations"></div>
      </div>
      <div class="pchips" role="group" aria-label="Places">
        <button type="button" class="pchip" data-place="btn" aria-pressed="false">Buttons</button>
        <button type="button" class="pchip" data-place="text" aria-pressed="false">Text</button>
        <button type="button" class="pchip" data-place="imgcard" aria-pressed="false">Images &amp; cards</button>
        <button type="button" class="pchip" data-place="bg" aria-pressed="false">Backgrounds</button>
        <button type="button" class="pchip" data-place="menu" aria-pressed="false">Menus &amp; forms</button>
        <button type="button" class="pchip" data-place="load" aria-pressed="false">Loading &amp; messages</button>
        <button type="button" class="pchip" data-place="intro" aria-pressed="false">Page intros</button>
        <button type="button" class="pchip" data-place="scroll" aria-pressed="false">Scrolling</button>
        <button type="button" class="pchip" data-place="page" aria-pressed="false">Page changes</button>
      </div>
    </div>
    <div class="rhead">
      <div><h2 class="rtitle" id="results-title">Good places to start</h2><p class="rsub" id="results-sub" aria-live="polite">Eight favorites from different places. Pick a place above to see more.</p></div>
      <button type="button" class="pillbtn" id="clear-view" hidden><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>Clear</button>
    </div>
    <div id="cards"></div>
    <div class="empty" id="empty" hidden>
      <p class="empty-t" id="empty-title">Nothing matches that yet</p>
      <p class="empty-s">Try a simpler word, or pick one of these:</p>
      <p class="pop"><button type="button" data-q="fade in">fade in</button><button type="button" data-q="typing text">typing text</button><button type="button" data-q="loading spinner">loading spinner</button><button type="button" data-q="parallax">parallax</button><button type="button" data-q="confetti">confetti</button></p>
    </div>
    <div class="more" id="more"><button type="button" class="bigbtn" id="more-btn"><span id="more-label">Browse all 129 animations</span><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg></button></div>
    <noscript><p class="noscript">This page shows its animations with JavaScript. All 129 are still easy to reach: see the <a href="https://github.com/matinmonshizadeh/animation-handbook#categories">category list on GitHub</a> or the <a href="sitemap.xml">full sitemap</a>. Each demo is a page of its own under <code>/animations/&lt;category&gt;/&lt;name&gt;/</code>.</p></noscript>
  </section>

  <section class="how" id="how" aria-labelledby="how-title">
    <div class="wrap">
      <div class="how-head"><h2 class="rtitle" id="how-title">How it works</h2><p class="rsub">Three steps, and no code to read.</p></div>
      <ol class="steps">
        <li class="step"><span class="step-n" aria-hidden="true">1</span><div><h3 class="step-t">Watch it</h3><p class="step-p">Every animation plays right on its page, so you see exactly what you will get.</p></div></li>
        <li class="step"><span class="step-n" aria-hidden="true">2</span><div><h3 class="step-t">Change it to fit</h3><p class="step-p">Try a few simple settings, like speed or direction, and watch the preview update.</p></div></li>
        <li class="step"><span class="step-n" aria-hidden="true">3</span><div><h3 class="step-t">Copy the prompt</h3><p class="step-p">Paste it into your AI assistant. It describes the animation in plain words, with your settings.</p></div></li>
      </ol>
      <p class="fine">Free and open source (MIT). No sign-up.</p>
    </div>
  </section>
</main>

<footer class="wrap foot">
  <a class="brand" href="./"><svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><circle class="ring" cx="11.16" cy="20.84" r="6.1"/><circle class="ring" cx="15.12" cy="16.88" r="6.1"/><circle class="ring" cx="18.51" cy="13.49" r="6.1"/><circle class="ball" cx="21.2" cy="10.8" r="6.6"/></svg><span>Animation Handbook</span></a>
  <p class="foot-t">129 web animations with live demos and copyable prompts.</p>
  <nav class="nav" aria-label="Footer"><a class="lnk" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener noreferrer">GitHub</a><a class="lnk" href="#top">Back to top</a></nav>
</footer>
<div class="toast" id="toast" role="status" aria-live="polite"><span class="ok" aria-hidden="true"><svg class="i" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span class="toast-t"></span></div>
```

- [ ] **Step 6: Remove the old grid builder** — delete the statement block that starts with `const root=document.getElementById('root');` and ends with the `});` closing its `CATS.forEach(cat=>{` loop (just before `const reduce=`).

- [ ] **Step 7: Replace the old card, filter, chip and key code** — replace everything from `document.querySelectorAll('.card').forEach(card=>{` (right after the `const engines=…;` line) to the end of the script (the last `addEventListener('keydown',…);` statement, before `</script>`) with:

```js
// ---------- Home page: places and cards ----------
const PLACE_LIST=[
  {key:'btn',name:'Buttons',url:'buttons'},
  {key:'text',name:'Text',url:'text'},
  {key:'imgcard',name:'Images & cards',url:'images-and-cards'},
  {key:'bg',name:'Backgrounds',url:'backgrounds'},
  {key:'menu',name:'Menus & forms',url:'menus-and-forms'},
  {key:'load',name:'Loading & messages',url:'loading-and-messages'},
  {key:'intro',name:'Page intros',url:'page-intros'},
  {key:'scroll',name:'Scrolling',url:'scrolling'},
  {key:'page',name:'Page changes',url:'page-changes'}
];
const PLACE=Object.fromEntries(PLACE_LIST.map(p=>[p.key,p]));
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const slugify=x=>x.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const wordsOf=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().split(' ').filter(Boolean);
// Every animation in home order, with the words search looks at.
const ALL=[];
CATS.forEach(cat=>cat.entries.forEach(([slug,name,desc])=>{
  const places=PLACES[slug]||[];
  ALL.push({slug,name,desc,cat,places,order:ALL.length,url:`${cat.folder}/${slug}/`,
    nameW:wordsOf(name),placeW:wordsOf(places.map(k=>PLACE[k].name).join(' ')),descW:wordsOf(desc+' '+cat.name)});
}));
const BY_SLUG=Object.fromEntries(ALL.map(e=>[e.slug,e]));
const ICON_COPY='<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
const ICON_DONE='<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const ICON_OPEN='<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg>';
const ICON_ARROW='<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

// A preview plays while its card is on screen (on phones, while the card is in the middle of the screen).
const hoverCap=matchMedia('(hover:hover)').matches;
const io='IntersectionObserver'in window?new IntersectionObserver(es=>es.forEach(en=>en.target[en.isIntersecting?'_play':'_pause']()),
  hoverCap?{threshold:.2}:{rootMargin:'-34% 0px -34% 0px'}):null;
function buildCard(e){
  const pv=PV[e.slug]||'sig'+parseInt(e.cat.n,10);
  const card=document.createElement('article');
  card.className='card '+e.cat.cat.replace('-cat','');
  card.dataset.slug=e.slug;card.dataset.pv=pv;
  card.innerHTML=`<div class="stage"><div class="pv pv-${pv}" aria-hidden="true">${pvMarkup(pv)}</div>`+
    `<span class="tag">${esc(e.places.length?PLACE[e.places[0]].name:e.cat.name)}</span></div>`+
    `<div class="meta"><h3 class="title"><a href="${esc(e.url)}">${esc(e.name)}</a></h3><p class="desc">${esc(e.desc)}</p>`+
    `<div class="acts"><button type="button" class="copy" aria-label="${esc('Copy prompt for '+e.name)}">${ICON_COPY}<span class="copy-l">Copy prompt</span></button>`+
    `<span class="try" aria-hidden="true">Try it${ICON_ARROW}</span></div></div>`;
  if(reduce)card.querySelectorAll('animate').forEach(a=>a.remove());
  const eng=engines[pv]?engines[pv](card.querySelector('.pv')):null;
  card._play=()=>{card.classList.add('playing');eng&&eng.play();};
  card._pause=()=>{card.classList.remove('playing');eng&&eng.pause();};
  card.addEventListener('focusin',card._play);
  if(io)io.observe(card);
  return card;
}
const CARD=Object.fromEntries(ALL.map(e=>[e.slug,buildCard(e)]));
const $=id=>document.getElementById(id);
const resultsEl=$('results'),cardsBox=$('cards');
let shown=[];
// Cards that left the page stop. The canvas previews size themselves on resize, so one resize lets them measure their new place.
function place(cards){
  shown.forEach(c=>{if(!cards.includes(c))c._pause();});
  shown=cards;
  if(!io)cards.forEach(c=>c._play());
  dispatchEvent(new Event('resize'));
}
function showCards(list){
  const grid=document.createElement('div');grid.className='grid';
  const cards=list.map(e=>CARD[e.slug]);
  cards.forEach(c=>grid.appendChild(c));
  cardsBox.replaceChildren(grid);
  place(cards);
}
document.querySelectorAll('[data-count]').forEach(el=>{
  const n=ALL.filter(e=>e.places.includes(el.dataset.count)).length;
  el.textContent=n+(n===1?' animation':' animations');
});
showCards(PICKS.map(s=>BY_SLUG[s]));

(function(){const btn=$('theme-toggle');if(!btn)return;
  btn.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='light'?'dark':'light';
    document.documentElement.dataset.theme=next;try{localStorage.setItem('ah-theme',next);}catch(e){}});})();
addEventListener('keydown',e=>{const t=document.activeElement&&document.activeElement.tagName;
  if(e.key==='/'&&t!=='INPUT'&&t!=='TEXTAREA'){e.preventDefault();$('q').focus();}});
```

(The `loadStars` block at the top of the script stays: it still fills `#gh-star-count`.)

- [ ] **Step 8: Run the tests**

Run: `node --test "tests/*.test.js"`
Expected: PASS.

- [ ] **Step 9: Check the page in Chrome and look at it**

Serve the worktree, then run: `node tools/check-pages.mjs --base http://127.0.0.1:<port> home`
Expected: six `ok` lines. Then open the screenshots it names (`home-desktop.png`, `home-desktop-full.png`, `home-tablet.png`, `home-phone.png`, `home-phone-reduced.png`, `home-phone-small.png`) with the Read tool and compare them with the canvas row "A · Friendly guide": the pill, heading, line, search box and Popular row centered; nine tiles in one row on desktop, five plus four on the tablet, three by three on phones; eight Start cards (four across on desktop, two on phones) with a place label, name, description, Copy prompt and (desktop) Try it; How it works; the footer. Fix anything that differs, then rerun the check.

- [ ] **Step 10: Commit**

```bash
git add index.html tests/pages.test.js
git commit -m "feat: the new home page: a plain question, search, nine place tiles, Start cards with Copy prompt, How it works"
```

---

### Task 5: Views, search and the address

**Files:**
- Modify: `index.html` (the home script)
- Modify: `tools/check-pages.mjs` (two new check functions, called in the `if (home)` branch)

**Interfaces:**
- Consumes: everything Task 4 produces (`ALL`, `BY_SLUG`, `PLACE`, `PLACE_LIST`, `CARD`, `esc`, `slugify`, `wordsOf`, `place()`, `showCards()`, `$`, `resultsEl`, `cardsBox`, the element ids, `data-place`, `data-q`).
- Produces: `state` ({q, place, view, all}), `render()`, `go(next, push)`, `readURL()`, `writeURL(push)`, `search(text)`, `queryWords(text)`, `score(e, words)`, `showGroups()`, `toResults()`. Addresses: `?place=<url name>`, `?q=<text>`, `?view=all`, `&all=1` when Show all is pressed, and old `?cat=<category name>` links.

- [ ] **Step 1: Write the failing checks** — in `tools/check-pages.mjs`, add before the `cleanUp()` function:

```js
// Home page, desktop run: a tile press shows that place and changes the address, Show all shows the rest, Back returns to
// the start, a plain sentence finds the right animations, a word with no match says so, All animations lists every card
// under its seven headings, and the old ?q= and ?cat= links still work. Leaves the home page on ?cat=micro-interactions.
async function homeViewProblems() {
  const problems = [];
  const view = () => evaluate(`({ title: document.getElementById('results-title').textContent, cards: document.querySelectorAll('#cards .card').length,
    more: document.getElementById('more').hidden ? '' : document.getElementById('more-label').textContent, search: location.search })`);
  const type = text => evaluate(`(() => { const q = document.getElementById('q'); q.value = ${JSON.stringify(text)}; q.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  await evaluate(`document.querySelector('.place[data-place="btn"]').click()`);
  await sleep(300);
  let v = await view();
  if (v.title !== 'Buttons' || v.cards !== 8 || v.more !== 'Show all 15' || v.search !== '?place=buttons') problems.push(`Buttons tile: ${JSON.stringify(v)}`);
  await evaluate(`document.getElementById('more-btn').click()`);
  await sleep(300);
  v = await view();
  if (v.cards !== 15 || v.more !== '' || v.search !== '?place=buttons&all=1') problems.push(`Show all: ${JSON.stringify(v)}`);
  await evaluate(`history.back()`);
  await sleep(500);
  v = await view();
  if (v.title !== 'Good places to start' || v.cards !== 8 || v.search !== '') problems.push(`Back: ${JSON.stringify(v)}`);
  await type('a button that bounces when clicked');
  await sleep(300);
  const found = await evaluate(`[...document.querySelectorAll('#cards .card .title a')].map(a => a.textContent)`);
  if (found[0] !== 'Click / Tap Ripple' || !found.slice(0, 4).includes('Bounce In')) problems.push(`search order: ${found.slice(0, 5).join(', ')}`);
  await type('zebra');
  await sleep(300);
  const empty = await evaluate(`!document.getElementById('empty').hidden && document.getElementById('empty-title').textContent`);
  if (empty !== 'Nothing matches “zebra” yet') problems.push(`nothing found: ${empty}`);
  await evaluate(`document.getElementById('nav-all').click()`);
  await sleep(500);
  const all = await evaluate(`({ groups: document.querySelectorAll('#cards .group').length, cards: document.querySelectorAll('#cards .card').length, search: location.search })`);
  if (all.groups !== 7 || all.cards !== 129 || all.search !== '?view=all') problems.push(`All animations: ${JSON.stringify(all)}`);
  // Old links keep working: ?q= opens the search, ?cat= opens All animations at that category's heading.
  for (const [query, want] of [['?q=fade', 'Results for “fade”'], ['?cat=micro-interactions', 'All animations']]) {
    let onLoad;
    const loaded = new Promise(resolve => { onLoad = msg => { if (msg.method === 'Page.loadEventFired') resolve(); }; listeners.add(onLoad); });
    await send('Page.navigate', { url: `${BASE}/${query}` });
    try { await withTimeout(loaded, LOAD_TIMEOUT); } catch { problems.push(`${query} did not load`); }
    listeners.delete(onLoad);
    await sleep(300);
    const got = await evaluate(`({ title: document.getElementById('results-title').textContent,
      top: (() => { const g = document.getElementById('cat-micro-interactions'); return g ? Math.round(g.getBoundingClientRect().top) : null; })() })`);
    if (got.title !== want) problems.push(`${query}: heading "${got.title}"`);
    if (query.startsWith('?cat=') && (got.top === null || Math.abs(got.top - 12) > 24)) problems.push(`${query}: the category heading is at ${got.top}px, not at the top`);
  }
  return problems;
}

// Home page, phone run: a tile press scrolls to the results, and the slim bar sticks to the top with that place pressed.
async function homePhoneProblems() {
  await evaluate(`document.querySelector('.place[data-place="text"]').click()`);
  await sleep(900);
  const v = await evaluate(`(() => { const bar = document.getElementById('pinbar');
    return { title: document.getElementById('results-title').textContent, shown: getComputedStyle(bar).display !== 'none',
      top: Math.round(bar.getBoundingClientRect().top), pressed: [...bar.querySelectorAll('[aria-pressed="true"]')].map(b => b.textContent) }; })()`);
  return v.title === 'Text' && v.shown && Math.abs(v.top) <= 1 && v.pressed.join() === 'Text' ? [] : [`phone, Text tile: ${JSON.stringify(v)}`];
}
```

and fill the `if (home)` branch of the loop:

```js
        if (home) {
          if (setup.moves) problems.push(...await homeViewProblems());
          if (setup.name === 'phone') problems.push(...await homePhoneProblems());
        }
```

- [ ] **Step 2: Run the check and see it fail**

Serve the worktree, then run: `node tools/check-pages.mjs --base http://127.0.0.1:<port> home`
Expected: `FAIL home desktop — Buttons tile: …` (the tiles do nothing yet) and `FAIL home phone — phone, Text tile: …`; the other four lines `ok`.

- [ ] **Step 3: Add the views** — in `index.html`, replace the two statements `showCards(PICKS.map(s=>BY_SLUG[s]));` and the final `addEventListener('keydown',…);` of the home script with the code below (the theme button block between them stays where it is):

```js
// ---------- Views, search and the address ----------
const PAGE=8;
const STOP=new Set(['a','an','and','the','that','this','to','for','with','when','on','in','of','my','it','i','want','make','some']);
const stem=w=>w.length>3?w.replace(/(ing|ed|es|s)$/,''):w;
function queryWords(text){return [...new Set(wordsOf(text).filter(w=>!STOP.has(w)).map(stem).filter(w=>w.length>=2))];}
// A word counts 3 in the name, 2 in a place name, 1 in the description or category; each is matched by the start of a word.
function score(e,words){
  let s=0;
  for(const w of words){
    if(e.nameW.some(x=>x.startsWith(w)))s+=3;
    if(e.placeW.some(x=>x.startsWith(w)))s+=2;
    if(e.descW.some(x=>x.startsWith(w)))s+=1;
  }
  return s;
}
function search(text){
  const words=queryWords(text);
  if(!words.length)return [];
  return ALL.map(e=>({e,s:score(e,words)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s||a.e.order-b.e.order).map(x=>x.e);
}
function showGroups(){
  const boxes=[],cards=[];
  CATS.forEach(cat=>{
    const list=ALL.filter(e=>e.cat===cat),box=document.createElement('section');
    box.className='group';box.id='cat-'+slugify(cat.name);box.setAttribute('aria-labelledby',box.id+'-h');
    box.innerHTML=`<h3 class="ghead" id="${box.id}-h"><span class="gnum">${cat.n}</span><span class="gname">${esc(cat.name)}</span><span class="gcount">${list.length} animations</span></h3>`;
    const grid=document.createElement('div');grid.className='grid';
    list.forEach(e=>{grid.appendChild(CARD[e.slug]);cards.push(CARD[e.slug]);});
    box.appendChild(grid);boxes.push(box);
  });
  cardsBox.replaceChildren(...boxes);
  place(cards);
}
const state={q:'',place:'',view:'',all:false};
const q=$('q'),q2=$('q2'),qClear=$('q-clear'),titleEl=$('results-title'),subEl=$('results-sub'),clearBtn=$('clear-view'),
  emptyEl=$('empty'),emptyTitle=$('empty-title'),moreBox=$('more'),moreLabel=$('more-label');
const phone=matchMedia('(max-width:600px)');
let moreAction='all';
function render(){
  const filtered=!!(state.q||state.place||state.view);
  let list=null,title,sub,tags=true;
  if(state.q){
    list=search(state.q);title='Results for “'+state.q+'”';
    sub=list.length===1?'1 animation matches.':list.length+' animations match.';
  }else if(state.place){
    list=ALL.filter(e=>e.places.includes(state.place));title=PLACE[state.place].name;sub=list.length+' animations';tags=false;
  }else if(state.view==='all'){
    title='All animations';sub=ALL.length+' animations in '+CATS.length+' groups.';
  }else{
    list=PICKS.map(s=>BY_SLUG[s]);title='Good places to start';sub='Eight favorites from different places. Pick a place above to see more.';
  }
  titleEl.textContent=title;subEl.textContent=sub;
  resultsEl.classList.toggle('filtered',filtered);
  resultsEl.classList.toggle('no-tags',!tags);
  clearBtn.hidden=!filtered;
  if(list)showCards(state.all||!filtered?list:list.slice(0,PAGE));else showGroups();
  const empty=!!list&&!list.length;
  emptyEl.hidden=!empty;
  if(empty)emptyTitle.textContent='Nothing matches “'+state.q+'” yet';
  if(!filtered||empty){moreAction='all';moreLabel.textContent='Browse all '+ALL.length+' animations';moreBox.hidden=false;}
  else if(list&&!state.all&&list.length>PAGE){moreAction='expand';moreLabel.textContent='Show all '+list.length;moreBox.hidden=false;}
  else moreBox.hidden=true;
  document.querySelectorAll('[data-place]').forEach(b=>b.setAttribute('aria-pressed',String(!state.q&&b.dataset.place===state.place)));
  [q,q2].forEach(input=>{if(input!==document.activeElement&&input.value!==state.q)input.value=state.q;});
  qClear.hidden=!q.value;
}
function writeURL(push){
  const p=new URLSearchParams();
  if(state.q)p.set('q',state.q);
  else if(state.place)p.set('place',PLACE[state.place].url);
  else if(state.view)p.set('view','all');
  if(state.all&&(state.q||state.place))p.set('all','1');
  const url=p.toString()?'?'+p:location.pathname;
  history[push?'pushState':'replaceState'](null,'',url);
}
// Reads the view from the address. Returns the category of an old ?cat= link, to scroll to.
function readURL(){
  const p=new URLSearchParams(location.search),found=PLACE_LIST.find(x=>x.url===p.get('place')),cat=p.get('cat')||'';
  Object.assign(state,{q:(p.get('q')||'').trim(),place:'',view:'',all:p.get('all')==='1'});
  if(!state.q&&found)state.place=found.key;
  else if(!state.q&&(p.get('view')==='all'||cat))state.view='all';
  q.value=q2.value=state.q;
  return cat;
}
function go(next,push){Object.assign(state,{q:'',place:'',view:'',all:false},next);writeURL(push);render();}
const toResults=()=>resultsEl.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
document.addEventListener('click',e=>{
  const tile=e.target.closest('[data-place]');
  if(tile){
    const key=tile.dataset.place;
    go(!state.q&&state.place===key?{}:{place:key},true);
    if(phone.matches&&state.place)toResults();
    return;
  }
  const pick=e.target.closest('[data-q]');
  if(pick){go({q:pick.dataset.q},true);if(phone.matches)toResults();}
});
function typed(input){
  (input===q?q2:q).value=input.value;
  Object.assign(state,{q:input.value.trim(),place:'',view:'',all:false});
  writeURL(false);render();
}
q.addEventListener('input',()=>typed(q));
q2.addEventListener('input',()=>typed(q2));
$('search-form').addEventListener('submit',e=>{e.preventDefault();toResults();});
qClear.addEventListener('click',()=>{q.value='';typed(q);q.focus();});
clearBtn.addEventListener('click',()=>go({},true));
$('pin-back').addEventListener('click',()=>{go({},true);scrollTo({top:0,behavior:reduce?'auto':'smooth'});});
$('more-btn').addEventListener('click',()=>{
  if(moreAction==='all'){go({view:'all'},true);toResults();}
  else{state.all=true;writeURL(false);render();}
});
$('nav-all').addEventListener('click',e=>{e.preventDefault();go({view:'all'},true);toResults();});
addEventListener('popstate',()=>{readURL();render();});
addEventListener('keydown',e=>{
  const el=document.activeElement,t=el&&el.tagName;
  if(e.key==='/'&&t!=='INPUT'&&t!=='TEXTAREA'){e.preventDefault();q.focus();}
  else if(e.key==='Escape'&&(el===q||el===q2)){el.value='';typed(el);el.blur();}
});
const startCat=readURL();
render();
if(startCat){const g=$('cat-'+startCat);if(g)g.scrollIntoView();}
```

- [ ] **Step 4: Run the check**

Run: `node tools/check-pages.mjs --base http://127.0.0.1:<port> home`
Expected: six `ok` lines.

- [ ] **Step 5: Run the tests**

Run: `node --test "tests/*.test.js"`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add index.html tools/check-pages.mjs
git commit -m "feat: the home page's tiles, search, Show all, All animations and address; the check tries them"
```

---

### Task 6: Copy prompt on the cards

**Files:**
- Modify: `index.html` (the `<head>`: one `<script>` line; the end of the home script)
- Modify: `tests/pages.test.js` (the version test)
- Modify: `tools/check-pages.mjs` (a new check function, called in the `if (home)` branch)

**Interfaces:**
- Consumes: `DemoPage.pageCopyText(doc, win)` (Task 1, in `assets/js/demo-page.js?v=6`); `cardsBox`, `$`, `ICON_COPY`, `ICON_DONE`, `ICON_OPEN`, `ALL` (Task 4).
- Produces: `promptFor(url): Promise<string>` (top-level in the home script, cached per page; the check calls it), `writeClipboard(textPromise)`, `toast(message)`, `copyState(button, '' | 'done' | 'fail')`.

- [ ] **Step 1: Put the home page in the version test** — in `tests/pages.test.js`, replace the test `every guided-steps page links the same version of the shared files` with:

```js
test('every guided-steps page and the home page link the same version of the shared files', () => {
  const versions = new Set([...steps.map(pageOf), HOME].flatMap(html => [...html.matchAll(/demo-page\.(?:css|js)\?v=(\d+)/g)].map(m => m[1])));
  assert.equal(versions.size, 1, `versions in use: ${[...versions].join(', ')}`);
  assert.match(HOME, /<script src="assets\/js\/demo-page\.js\?v=\d+" defer><\/script>/, 'the home page links the page script, for Copy prompt');
});
```

- [ ] **Step 2: Add the Copy prompt check** — in `tools/check-pages.mjs`, add before `cleanUp()`:

```js
// Home page, desktop run: the Copy prompt button puts a page's text on the clipboard and says so (the clipboard is stubbed:
// a headless run cannot grant it), then, for every page, the home page's text equals what the page's own Copy prompt gives
// before any change. Leaves the home page.
async function homeCopyProblems() {
  const problems = [];
  const wiring = await evaluate(`(async () => {
    let got = null;
    navigator.clipboard.write = async items => { got = await (await items[0].getType('text/plain')).text(); };
    navigator.clipboard.writeText = async text => { got = text; };
    const btn = document.querySelector('#cards .card .copy');
    btn.click();
    for (let i = 0; i < 60 && got === null; i++) await new Promise(r => setTimeout(r, 50));
    await new Promise(r => setTimeout(r, 50));
    const url = btn.closest('.card').querySelector('.title a').getAttribute('href');
    return { same: got === await promptFor(url), label: btn.textContent.trim(), toast: document.getElementById('toast').classList.contains('show') };
  })()`);
  if (!wiring.same || wiring.label !== 'Copied' || !wiring.toast) problems.push(`Copy prompt button: ${JSON.stringify(wiring)}`);
  const items = await evaluate(`Promise.all(ALL.map(e => promptFor(e.url).then(text => ({ url: e.url, text }), err => ({ url: e.url, text: 'ERROR ' + err.message }))))`);
  for (const { url, text } of items) {
    let onLoad;
    const loaded = new Promise(resolve => { onLoad = msg => { if (msg.method === 'Page.loadEventFired') resolve(); }; listeners.add(onLoad); });
    await send('Page.navigate', { url: `${BASE}/${url}` });
    try { await withTimeout(loaded, LOAD_TIMEOUT); } catch { problems.push(`${url} did not load`); }
    listeners.delete(onLoad);
    const own = await evaluate(`DemoPage.pageCopyText(document, window)`);
    if (own !== text) problems.push(`Copy prompt text differs for ${url}`);
  }
  return problems;
}
```

and in the `if (home)` branch, after the `homeViewProblems()` line, add `if (setup.moves) problems.push(...await homeCopyProblems());` (it must stay the last check of the desktop run: it leaves the home page).

- [ ] **Step 3: Run the test and the check, and see them fail**

Run: `node --test tests/pages.test.js` → FAIL ("the home page links the page script").
Run: `node tools/check-pages.mjs --base http://127.0.0.1:<port> home` → `FAIL home desktop — … promptFor is not defined`.

- [ ] **Step 4: Link the shared page script** — in `index.html`'s `<head>`, right after the theme script line (`<script>document.documentElement.classList.add('js');…</script>`), add:

```html
<script src="assets/js/demo-page.js?v=6" defer></script>
```

(On the home page the script sets nothing up: it only lends `DemoPage.pageCopyText`.)

- [ ] **Step 5: Add Copy prompt** — at the end of the home script (after the Task 5 code), add:

```js
// ---------- Copy prompt on the cards ----------
// The text is the page's own: the home page reads the page's HTML and builds the text with the shared page script
// (DemoPage), every setting at its default. Nothing on a fetched page is laid out, so no control counts as hidden by style.
const pageTexts=new Map(),NO_STYLE={getComputedStyle:()=>({display:''})};
function promptFor(url){
  let text=pageTexts.get(url);
  if(!text){
    text=fetch(url).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.text();}).then(html=>{
      if(!window.DemoPage)throw new Error('the page script has not loaded');
      const t=DemoPage.pageCopyText(new DOMParser().parseFromString(html,'text/html'),NO_STYLE);
      if(!t)throw new Error('no prompt on the page');
      return t;
    });
    text.catch(()=>pageTexts.delete(url));
    pageTexts.set(url,text);
  }
  return text;
}
// Safari only writes the clipboard while the press is fresh, so the text goes in as a promise where the browser allows it.
async function writeClipboard(text){
  const clip=navigator.clipboard;
  if(!clip)throw new Error('no clipboard');
  if(window.ClipboardItem&&clip.write){
    try{await clip.write([new ClipboardItem({'text/plain':text.then(t=>new Blob([t],{type:'text/plain'}))})]);return;}
    catch(err){if(err&&err.name==='NotAllowedError')throw err;}
  }
  await clip.writeText(await text);
}
const toastEl=$('toast');let toastTimer=0;
function toast(message){
  toastEl.querySelector('.toast-t').textContent=message;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>toastEl.classList.remove('show'),2400);
}
function copyState(btn,kind){
  const name=btn.closest('.card').querySelector('.title a').textContent;
  clearTimeout(btn._timer);
  btn.classList.toggle('done',kind==='done');btn.classList.toggle('fail',kind==='fail');
  if(kind==='done'){
    btn.innerHTML=ICON_DONE+'<span class="copy-l">Copied</span>';btn.setAttribute('aria-label','Prompt copied for '+name);
    btn._timer=setTimeout(()=>copyState(btn,''),1800);
  }else if(kind==='fail'){
    btn.innerHTML=ICON_OPEN+'<span class="copy-l">Open to copy</span>';btn.setAttribute('aria-label','Open the page to copy the prompt for '+name);
  }else{
    btn.innerHTML=ICON_COPY+'<span class="copy-l">Copy prompt</span>';btn.setAttribute('aria-label','Copy prompt for '+name);
  }
}
const urlOf=card=>card.querySelector('.title a').getAttribute('href');
cardsBox.addEventListener('click',e=>{
  const btn=e.target.closest('.copy');
  if(!btn)return;
  const url=urlOf(btn.closest('.card'));
  if(btn.classList.contains('fail')){location.href=url+'#hb-prompt-title';return;}
  writeClipboard(promptFor(url)).then(()=>{copyState(btn,'done');toast('Prompt copied. Paste it into your AI assistant.');},()=>copyState(btn,'fail'));
});
// Reading the page starts when the pointer rests on a card or a card gets focus, so the copy is quick.
const warm=e=>{const card=e.target.closest&&e.target.closest('.card');if(card)promptFor(urlOf(card)).catch(()=>{});};
cardsBox.addEventListener('pointerover',warm);
cardsBox.addEventListener('focusin',warm);
```

- [ ] **Step 6: Run the tests and the check**

Run: `node --test "tests/*.test.js"` → PASS.
Run: `node tools/check-pages.mjs --base http://127.0.0.1:<port> home` → six `ok` lines (the desktop run takes a few minutes: it visits all 129 pages). A "Copy prompt text differs for …" line means that page's controls read differently in its HTML than on the live page (for example a control hidden by a style rule, or a default set by the page's script at load): make that page's default visible in its HTML (the `hidden` attribute or `data-hb-skip` for a control that must not count, the pressed or checked state written in the markup), keeping the page's look and behavior exactly, and rerun.

- [ ] **Step 7: Commit**

```bash
git add index.html tests/pages.test.js tools/check-pages.mjs
git commit -m "feat: Copy prompt on every home card copies the page's own prompt and settings; the check compares all 129"
```

(Commit any page fix from Step 6 separately: `fix: <page>: its default settings are written in its HTML, so Copy prompt on the home page matches the page`.)

---

### Task 7: Docs — places and the home check

**Files:**
- Modify: `CLAUDE.md`, `CONTRIBUTING.md`

**Interfaces:**
- Consumes: the names `PLACES`, `PICKS`, the place keys, the `home` check target.

- [ ] **Step 1: CLAUDE.md** — make these four edits:
  1. In "The page", item 2, replace `the category line \`NN.MM · Category\` (its place on the home page)` with `the category line \`NN.MM · Category\` (its place in the home page's All animations list)`.
  2. After the paragraph under **Shared files** that ends "`demo-page.js` runs it.", add the sentence: `The home page links \`demo-page.js\` too (its cards' Copy prompt builds the text with \`DemoPage.pageCopyText\`), with the same \`N\`.`
  3. In "When asked to add a new animation", step 6, append: ` Give it one or more places in \`PLACES\` (right after \`PV\` in the same script): \`btn\` Buttons, \`text\` Text, \`imgcard\` Images & cards, \`bg\` Backgrounds, \`menu\` Menus & forms, \`load\` Loading & messages, \`intro\` Page intros, \`scroll\` Scrolling, \`page\` Page changes; the first one labels its card.`
  4. Under "Tests and the page check", after the **Page check** bullet, add a bullet: `- **Home page:** \`node tools/check-pages.mjs --base http://127.0.0.1:<port> home\` checks the home page at the same six setups (six \`ok\` lines). Its desktop run also tries the tiles, the search and Show all, and compares Copy prompt on the home page with every page's own; run it after changing any page's settings or prompt.`

- [ ] **Step 2: CONTRIBUTING.md** — make these three edits:
  1. In step 5 of adding an animation, after "Register the entry in the root `index.html` `CATS` array (slug, name, one-line description)", insert ", give it one or more places in `PLACES` (the home page's tiles: `btn`, `text`, `imgcard`, `bg`, `menu`, `load`, `intro`, `scroll`, `page`; the first labels its card)".
  2. In the paragraph that says the one-line description is "its card on the home page", keep it as is (still true).
  3. After the code block with `node tools/check-pages.mjs --base http://127.0.0.1:<port> animations/02-entrance-and-exit/rotate-in`, add the paragraph: `The home page has a check of its own: \`node tools/check-pages.mjs --base http://127.0.0.1:<port> home\`. It checks the layout at the six setups, tries the tiles, the search and Show all, and compares Copy prompt on the home page with every page's own prompt and default settings.`

- [ ] **Step 3: Run the tests**

Run: `node --test "tests/*.test.js"` → PASS (nothing in the docs is tested; this guards against a stray edit elsewhere).

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md CONTRIBUTING.md
git commit -m "docs: a new animation gets its places on the home page; the home page check"
```

---

### Task 8: Final check, review and publish

**Files:** none new.

- [ ] **Step 1: Everything merged into one tree** — all task branches merged into `main` locally (wave 1, then wave 2), no conflicts left.

- [ ] **Step 2: All tests**

Run: `node --test "tests/*.test.js"` → PASS.

- [ ] **Step 3: Whole-site check**

Serve the repo, then run:

```bash
node tools/check-pages.mjs --base http://127.0.0.1:<port> home animations/01-scroll-based animations/02-entrance-and-exit animations/03-page-transitions animations/04-micro-interactions animations/05-text-typography animations/06-3d-advanced animations/07-ambient-background
```

Expected: 780 `ok` lines (129 pages × 6 + the home page × 6), exit code 0.

- [ ] **Step 4: Final review** — a fresh reviewer (the most capable model) reviews everything the plan changed against the spec: the look at the six setups (screenshots), both themes, reduced motion, keyboard use (Tab to the tiles, Enter, "/", Escape), the address and Back, Copy prompt and its fallback, text contrast. One fix wave, one scoped re-review.

- [ ] **Step 5: Publish** — with the owner's go-ahead, push `main` (`git push origin main`); GitHub Pages serves it at https://matinmonshizadeh.github.io/animation-handbook/. Clean up worktrees, branches, stray servers and `%TEMP%\hb-chrome-*` profiles.
