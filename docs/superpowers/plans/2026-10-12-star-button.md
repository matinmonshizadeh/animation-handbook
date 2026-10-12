# Star Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every visitor gets an easy way to star the repository: a Star link at the end of every animation page's top bar,
a star row under every prompt card, and a round star on the home page for phones.

**Architecture:** Static markup, the same on every page (like the footer), styled by the shared `assets/css/demo-page.css`;
a one-off Node script adds the markup to the 166 pages and bumps the shared files' version. The home page changes only its
own inline CSS and one span. Tests pin the markup character by character; the browser page check proves layout, overflow
and touch targets at six screen setups.

**Tech Stack:** Plain HTML, CSS, vanilla JS. Node 22 for the tests (`node --test`) and tools. Chrome for the page check.

Spec: `docs/superpowers/specs/2026-10-12-star-button-design.md`.

## Global Constraints

- No build step, no frameworks, no npm packages. Do not edit anything under `.claude/worktrees/` (old copies of the site).
- Work on the branch `feat/star-button` in the main checkout. Never push.
- Commits: plain sentence messages in the repo's style (`feat: …`, `docs: …`), no Co-Authored-By or other trailers.
- Files in this checkout have CRLF line endings (`core.autocrlf=true`). Scripts keep each file's own line endings.
- `demo-page.css` changes, so `demo-page.css?v=7` and `demo-page.js?v=7` become `?v=8` on all 166 pages, and the home
  page's `demo-page.js?v=7` becomes `?v=8`, in the same commit (a test fails when versions differ).
- The star icon, everywhere: `<svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>`
- The repository link, everywhere: `href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener"`
- Top-bar Star link (exact): `<a class="hb-star" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener" aria-label="Star on GitHub"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg><span>Star on GitHub</span></a>`
- Star row (exact): `<div class="hb-star-row"><p>Free and open source. If this helped, a star on GitHub helps other people find it.</p><a class="hb-star-btn" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>Star on GitHub</a></div>`
- Phones (600px and less): every control at least 44×44px, no horizontal overflow down to 320px.
- A static server for the repo is running at `http://127.0.0.1:8731` (it serves this checkout). Check with
  `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8731/` (expect `200`). If it is down, ask the controller to
  restart it; do not start servers from a shell.
- Tests: `node --test "tests/*.test.js"` from the repo root. Page check: `node tools/check-pages.mjs --base http://127.0.0.1:8731 <folder>`;
  a passing page prints six `ok` lines, a failure prints `FAIL` and exits 1. Home check: the same with `home`.

---

### Task 1: Star link and star row on every animation page

> Changed after the task review (owner's choice, 2026-10-12): below 1061px the Star link is a round star with no words, and its `hb-star-more` span is gone; after the final review, below 820px it is left out of the top bar (the `max-width:819px` block, not the phone block, hides it). The steps below are as they were first run; the spec holds the change.

**Files:**
- Modify: `assets/css/demo-page.css` (top bar rules near line 39, prompt step rules near line 156, the hover block at
  line 180, the `max-width:1024px` block at line 197, the `max-width:600px` block at line 219)
- Modify: all 166 `animations/*/*/index.html` (markup + version) and `index.html` (version only), via a one-off script
- Create (not committed, the folder is git-ignored): `.superpowers/scratch/add-star.mjs`
- Modify: `tools/check-pages.mjs:90` (phone touch-target list)
- Modify: `CLAUDE.md` (the page template)
- Test: `tests/pages.test.js` (two new tests after the footer test, which ends near line 456)

**Interfaces:**
- Consumes: the helpers already in `tests/pages.test.js`: `read`, `count`, `between`, `cssRules`, `steps`, `pageOf`, `ROOT`, `path`.
- Produces: CSS classes `hb-star`, `hb-star-more`, `hb-star-row`, `hb-star-btn` in `demo-page.css`; shared-file version `v=8`
  (Task 2 relies on the home page already linking `demo-page.js?v=8`).

- [ ] **Step 1: Write the failing tests**

In `tests/pages.test.js`, right after the test `'every guided-steps page has the same footer, with a link to the source on GitHub'`
(it ends with `'pages without exactly this footer');` and `});`), add:

```js
// The Star link at the end of every page's top bar and the star row under its prompt card, the same on every page
// (docs/superpowers/specs/2026-10-12-star-button-design.md).
const STAR_ICON = '<svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>';
const STAR_HREF = 'href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener"';
const BAR_STAR = `<a class="hb-star" ${STAR_HREF} aria-label="Star on GitHub">${STAR_ICON}<span>Star<span class="hb-star-more"> on GitHub</span></span></a>`;
const STAR_ROW = `<div class="hb-star-row"><p>Free and open source. If this helped, a star on GitHub helps other people find it.</p><a class="hb-star-btn" ${STAR_HREF}>${STAR_ICON}Star on GitHub</a></div>`;
test('every guided-steps page asks for a star at the end of its top bar and under its prompt card', () => {
  const lastAfter = (part, piece, before) => part.trimEnd().endsWith(piece) &&
    part.slice(0, part.lastIndexOf(piece)).trimEnd().endsWith(before);
  const wrong = steps.filter(d => {
    const html = pageOf(d);
    const bar = between(html, '<nav class="hb-bar"', '</nav>');
    const promptStep = between(html, '<section class="hb-step hb-prompt-step"', '</section>');
    return count(html, BAR_STAR) !== 1 || !lastAfter(bar, BAR_STAR, '</span>') ||
      count(html, STAR_ROW) !== 1 || !lastAfter(promptStep, STAR_ROW, '</div>');
  }).map(d => `${d.cat}/${d.slug}`);
  assert.deepEqual(wrong, [], 'pages without the Star link right after the pager, or without the star row right after the prompt card');
});

test('the shared stylesheet shortens the Star link to "Star" on tablets and leaves it to the star row on phones', () => {
  const css = read(path.join(ROOT, 'assets/css/demo-page.css')).replace(/\/\*[\s\S]*?\*\//g, '');
  const hides = (media, selector) => cssRules(between(css, `@media(${media}){`, '\n}'))
    .some(rule => rule.selector.split(',').some(part => part.trim() === selector) && /(^|;)\s*display:\s*none\s*(;|$)/.test(rule.body));
  assert.ok(hides('max-width:1024px', '.hb-bar .hb-star-more'), 'tablets read "Star"');
  assert.ok(hides('max-width:600px', '.hb-bar .hb-star'), 'phones leave the Star link out of the top bar');
});
```

- [ ] **Step 2: Run the tests to see them fail**

Run: `node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)"`
Expected: `ℹ pass 1560` and `ℹ fail 2`; every `✖` line names one of the two new tests (166 pages listed as wrong;
`tablets read "Star"`). The reporter may list each failure twice (in place and in its summary).

- [ ] **Step 3: Add the styles to `assets/css/demo-page.css`**

3a. Right after the line `.hb-bar .hb-ic{width:16px;height:16px}` add:

```css
/* The Star link: the last item of the top bar, beside the pager. Computers read "Star on GitHub", tablets "Star" (the words
   go with "Previous: " and "Next: "), and phones leave it out: the star row under the prompt card is theirs. */
.hb-bar .hb-pager{margin-left:auto}
.hb-bar .hb-star{flex:none;padding:0 14px;border:1px solid var(--hb-edge);border-radius:999px;color:var(--hb-soft)}
```

3b. Right after the line `.hb-copy.is-done .hb-i-done{display:inline}` add:

```css
/* Under the prompt card: a sentence and an outline Star on GitHub button (full width on phones) */
.hb-star-row{display:flex;flex-wrap:wrap;align-items:center;gap:12px 20px}
.hb-star-row p{flex:1 1 260px;margin:0;font:400 15px/1.5 var(--hb-font);color:var(--hb-dim)}
.hb-star-btn{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:0 18px;
  border:1px solid var(--hb-edge);border-radius:999px;color:var(--hb-ink);text-decoration:none;font:600 15px/1 var(--hb-font)}
.hb-star-btn .hb-ic{width:16px;height:16px}
```

3c. In the `@media(hover:hover){` block, right after its line `  .hb-bar a:hover{color:var(--hb-ink)}` add:

```css
  .hb-bar .hb-star:hover,.hb-star-btn:hover{border-color:var(--hb-edge-2);color:var(--hb-ink)}
```

3d. Replace the tablet block

```css
/* Tablets and phones: the "Previous: " / "Next: " words go, so two page names fit beside the home link */
@media(max-width:1024px){
  .hb-bar .hb-dir{display:none}
}
```

with

```css
/* Tablets and phones: the "Previous: " / "Next: " words and the Star link's " on GitHub" go, so two page names fit
   beside the home link */
@media(max-width:1024px){
  .hb-bar .hb-dir,.hb-bar .hb-star-more{display:none}
}
```

3e. In the `@media(max-width:600px){` block, right after its line `  .hb-copy{width:100%}` add:

```css
  .hb-bar .hb-star{display:none}
  .hb-star-btn{width:100%}
```

- [ ] **Step 4: Write and run the one-off page script**

Create `.superpowers/scratch/add-star.mjs` (the folder exists and is git-ignored):

```js
// One-off: adds the Star link and the star row to every guided-steps page and moves the shared files from v=7 to v=8.
// Run from the repo root: node .superpowers/scratch/add-star.mjs
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const ICON = '<svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>';
const GH = 'href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener"';
const BAR_STAR = `<a class="hb-star" ${GH} aria-label="Star on GitHub">${ICON}<span>Star<span class="hb-star-more"> on GitHub</span></span></a>`;
const ROW = `<div class="hb-star-row"><p>Free and open source. If this helped, a star on GitHub helps other people find it.</p><a class="hb-star-btn" ${GH}>${ICON}Star on GitHub</a></div>`;
const dirs = d => readdirSync(d, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => join(d, e.name));

let pages = 0;
for (const cat of dirs(join(ROOT, 'animations'))) {
  for (const dir of dirs(cat)) {
    const file = join(dir, 'index.html');
    if (!existsSync(file)) continue;
    let html = readFileSync(file, 'utf8');
    if (!html.includes('<main class="hb-page">')) continue;
    if (html.includes('class="hb-star"') || html.includes('hb-star-row')) throw new Error(`${file}: already has a Star link or row`);
    const NL = html.includes('\r\n') ? '\r\n' : '\n';
    // A: the last item of the top bar, after the pager
    const barEnd = `</span>${NL}</nav>`;
    if (html.split(barEnd).length !== 2) throw new Error(`${file}: the top bar does not end with the pager`);
    html = html.replace(barEnd, `</span>${NL}  ${BAR_STAR}${NL}</nav>`);
    // B: the last part of the prompt step, after the card
    const start = html.indexOf('<section class="hb-step hb-prompt-step"');
    const close = start < 0 ? -1 : html.indexOf(`${NL}  </section>`, start);
    if (close < 0) throw new Error(`${file}: no prompt step`);
    html = html.slice(0, close) + `${NL}    ${ROW}` + html.slice(close);
    // The shared files' version
    if (!html.includes('demo-page.css?v=7') || !html.includes('demo-page.js?v=7')) throw new Error(`${file}: not on v=7`);
    html = html.replace('demo-page.css?v=7', 'demo-page.css?v=8').replace('demo-page.js?v=7', 'demo-page.js?v=8');
    writeFileSync(file, html);
    pages++;
  }
}
const homeFile = join(ROOT, 'index.html');
const home = readFileSync(homeFile, 'utf8');
if (home.split('demo-page.js?v=7').length !== 2) throw new Error('index.html: not on v=7');
writeFileSync(homeFile, home.replace('demo-page.js?v=7', 'demo-page.js?v=8'));
console.log(`${pages} pages and the home page updated`);
```

Run: `node .superpowers/scratch/add-star.mjs`
Expected: `166 pages and the home page updated`
Then: `git diff --stat | tail -1` → `169 files changed` (166 pages, `index.html`, `assets/css/demo-page.css` and
`tests/pages.test.js`). Any other number: find out why before going on.
Spot-check one page: `git diff animations/04-micro-interactions/checkmark-draw/index.html` shows exactly three changes:
the two version lines, the Star link line before `</nav>`, and the star row line after the card's closing `</div>`.

- [ ] **Step 5: Add the star row's button to the page check's phone touch targets**

In `tools/check-pages.mjs` (line 90), in the selector list that starts `'.hb-bar a, .hb-page button, .hb-page summary,`,
add `.hb-star-row a` after `.hb-foot a`, so the list reads `... label.hb-switch-row, .hb-foot a, .hb-star-row a, .hb-rel')]`.

- [ ] **Step 6: Run the tests to see them pass**

Run: `node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)"`
Expected: `ℹ pass 1562`, `ℹ fail 0`, no `✖` lines.

- [ ] **Step 7: Run the page check on every category**

Confirm the server answers (see Global Constraints), then run the seven categories, up to four at a time
(each in its own process; each prints its own temp folder of screenshots):

```bash
for c in 01-scroll-based 02-entrance-and-exit 03-page-transitions 04-micro-interactions; do node tools/check-pages.mjs --base http://127.0.0.1:8731 animations/$c > .superpowers/scratch/check-$c.txt 2>&1 & done; wait
for c in 05-text-typography 06-3d-advanced 07-ambient-background; do node tools/check-pages.mjs --base http://127.0.0.1:8731 animations/$c > .superpowers/scratch/check-$c.txt 2>&1 & done; wait
grep -c "\bok\b" .superpowers/scratch/check-*.txt; grep -l "FAIL" .superpowers/scratch/check-*.txt
```

Expected: 996 `ok` lines in all (166 pages × 6), and no file with `FAIL`. If a page fails, first re-run it alone once
(`node tools/check-pages.mjs --base http://127.0.0.1:8731 animations/<cat>/<slug>`): a busy machine can make a timing
check flaky. If it still fails, read its problem text and screenshots. Fix it when this change caused it (an overflow,
a small target, the star row or the Star link drawn wrong); otherwise stop and report the output to the controller
without changing unrelated code.

- [ ] **Step 8: Update the page template in `CLAUDE.md`**

Replace

```
1. **Top bar** (`nav.hb-bar`): the home link and Previous / Next links to the neighbors in the category
   (`rel="prev"`, `rel="next"`; the first and last page have one).
```

with

```
1. **Top bar** (`nav.hb-bar`): the home link, Previous / Next links to the neighbors in the category
   (`rel="prev"`, `rel="next"`; the first and last page have one) and, last, the **Star on GitHub** link (`a.hb-star`).
```

Replace

```
5. **3 · Copy the prompt** (`section.hb-prompt-step`): prompt (`p.hb-prompt`), "Your settings" chips, **Copy prompt**.
```

with

```
5. **3 · Copy the prompt** (`section.hb-prompt-step`): prompt (`p.hb-prompt`), "Your settings" chips, **Copy prompt**;
   under the card, the star row (`div.hb-star-row`: a sentence and a **Star on GitHub** button).
```

And right before the paragraph that starts `The page owns the stage's width, border, corners and height`, add this
paragraph (followed by a blank line):

```
The Star link and the star row are the same on every page too: copy them from a neighbor (a test compares them).
```

- [ ] **Step 9: Commit**

```bash
git add assets/css/demo-page.css animations index.html tests/pages.test.js tools/check-pages.mjs CLAUDE.md
git status --short | grep -v "^M " ; git commit -q -m "feat: a Star on GitHub link at the end of every animation page's top bar and a star row under its prompt card (shared files v=8)"
```

Expected: `git status --short | grep -v "^M "` prints nothing before the commit (only modified files, nothing new or
deleted); the commit succeeds.

---

### Task 2: Round star on the home page for phones

> Run in a worktree of its own (branch `feat/star-home`, merged into `feat/star-button`): its test went at the end of `tests/pages.test.js`, not after Task 1's tests, whose titles changed in Task 1's fix round. After the final review the test also pins how the round star fits (44px wide, the word hidden from sight, the count gone).

**Files:**
- Modify: `index.html` (the GitHub button's markup near line 1449; the phone rule near line 273; the rule near line 324)
- Modify: `CHANGELOG.md` (a new "Unreleased" heading at the top)
- Test: `tests/pages.test.js` (one new test after the two from Task 1)

**Interfaces:**
- Consumes: `HOME`, `cssRules`, `count` from `tests/pages.test.js`; the home page already links `demo-page.js?v=8` (Task 1).
- Produces: class `gh-t` on the home page (the word "GitHub" inside `#gh-stars`).

- [ ] **Step 1: Write the failing test**

In `tests/pages.test.js`, right after the test `'the shared stylesheet shortens the Star link to "Star" on tablets and leaves it to the star row on phones'`, add:

```js
test('the home page keeps its GitHub button on phones as a round star, and leaves it out only below 360px', () => {
  assert.equal(count(HOME, '</svg><span class="gh-t">GitHub</span> <span class="gh-c" id="gh-star-count"></span></a>'), 1,
    'the word GitHub has a span of its own, so small screens can hide it from sight and still read it out');
  const css = [...HOME.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');
  const hiding = cssRules(css).filter(rule => rule.selector.split(',').some(part => part.trim() === '.gh') &&
    /(^|;)\s*display:\s*none/.test(rule.body));
  assert.equal(hiding.length, 1, 'one rule hides the GitHub button');
  assert.equal(count(HOME, '@media(max-width:359px){.gh{display:none}}'), 1, 'and it is for screens under 360px');
});
```

- [ ] **Step 2: Run the tests to see it fail**

Run: `node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)"`
Expected: `ℹ pass 1562`, `ℹ fail 1`; the `✖` lines name only the new test (the `gh-t` span is missing).

- [ ] **Step 3: Change the home page**

3a. The GitHub button: replace

```html
</svg>GitHub <span class="gh-c" id="gh-star-count"></span></a>
```

with

```html
</svg><span class="gh-t">GitHub</span> <span class="gh-c" id="gh-star-count"></span></a>
```

3b. In the phone block (`@media(max-width:600px){`, near line 273) replace the line

```css
  .top .nav .lnk,.gh{display:none}
```

with

```css
  .top .nav .lnk{display:none}
```

3c. Replace the line (near line 324)

```css
@media(max-width:760px){.gh{display:none}} /* the top bar fits from 601px up */
```

with these three lines:

```css
@media(max-width:760px){.gh{position:relative;width:44px;padding:0;justify-content:center;gap:0}.gh-t{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}.gh-c{display:none}} /* from 760px down the GitHub button is a round star beside the dark-mode button: the word is still read out, the count goes */
@media(min-width:601px) and (max-width:620px){.top .nav .lnk{padding:0 11px}} /* at 601px "Browse all" and "How it works" are there too: a little less padding makes room for the star */
@media(max-width:359px){.gh{display:none}} /* below 360px there is no room for it beside the dark-mode button */
```

- [ ] **Step 4: Run the tests to see them pass**

Run: `node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)"`
Expected: `ℹ pass 1563`, `ℹ fail 0`, no `✖` lines.

- [ ] **Step 5: Measure the top bar at its tight widths**

With the browser tools: open a tab (`mcp__Claude_Browser__tabs_create`), then for each width 601, 620, 700, 760, 360 and
375 set the size (`mcp__Claude_Browser__resize_window` with that `width`, `height` 800 and the tab's id), load
`http://127.0.0.1:8731/` (`mcp__Claude_Browser__navigate`) and run this with `mcp__Claude_Browser__javascript_tool`:
`(() => { const top = document.querySelector('header.top').getBoundingClientRect(), gh = document.getElementById('gh-stars').getBoundingClientRect(); return { right: Math.round(top.right), ghRight: Math.round(gh.right), w: Math.round(gh.width), h: Math.round(gh.height), overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth }; })()`
Expected at every width: `ghRight <= right`, `w` and `h` both 44, `overflow` false. At 359 the button is not shown
(`getComputedStyle(document.getElementById('gh-stars')).display === 'none'`). At 1280 the button still reads
"GitHub ★ …" as before. If 601 does not fit, lower the 11px in the 601–620px rule one pixel at a time until it fits,
and note the measured numbers in the commit message. When done, set the tab back (`resize_window` with preset
`desktop`) and close it (`mcp__Claude_Browser__tabs_close`). If the browser tools are not available to you, stop and
ask the controller to take these measurements.

- [ ] **Step 6: Run the home check**

Run: `node tools/check-pages.mjs --base http://127.0.0.1:8731 home`
Expected: six `ok` lines, exit code 0.

- [ ] **Step 7: Add the changelog line**

In `CHANGELOG.md`, between the intro line (`The main steps of Animation Handbook, newest first, with the number of animations at each one.`)
and `## 1.0.0 — 2026-10-10`, add:

```markdown
## Unreleased

- A Star on GitHub button at the end of every animation page's top bar and under its Copy prompt, and a round star on the
  home page for phones.

```

- [ ] **Step 8: Commit**

```bash
git add index.html tests/pages.test.js CHANGELOG.md
git commit -q -m "feat: the home page keeps its GitHub button on phones as a round star beside the dark-mode button"
```

---

### Finish (controller)

- [ ] Run `node --test "tests/*.test.js"` once more on the branch (expect `ℹ pass 1563`, `ℹ fail 0`).
- [ ] Take screenshots of the result (a page's top bar at 1280px, its star row at 375px, the home page at 375px) and show them to the owner.
- [ ] Ask the owner before merging into `main` and pushing: pushing publishes the site.
