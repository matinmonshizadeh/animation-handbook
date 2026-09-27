# Guided-Steps Rollout: Entrance & Exit — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the other twelve Entrance & Exit pages to the approved guided-steps page, with settings rewritten in plain words, and extend the shared template with what they need.

**Architecture:** Task 1 extends the shared files (`assets/css/demo-page.css`, `assets/js/demo-page.js`) and the page checks; Task 2 adds a browser check tool; Task 3 writes a content sheet that decides, page by page, the plain-language settings, hints, tags and wording; Tasks 4–9 convert two pages each from the first redesign's layout to the guided-steps page by following the sheet and the Rotate In reference page; Task 10 checks the whole category in a browser.

**Tech Stack:** Plain HTML, CSS and vanilla JavaScript (no build step); Node's built-in test runner; Node plus the local Chrome (DevTools protocol) for the browser check tool.

**Specs:** `docs/superpowers/specs/2026-09-27-demo-page-guided-steps-design.md` (the page) and `docs/superpowers/specs/2026-09-27-demo-page-rollout-design.md` (the rollout rules). **Reference page:** `animations/02-entrance-and-exit/rotate-in/index.html` and its `README.md`.

## Global Constraints

- Plain HTML + CSS + vanilla JS only. No build step, no frameworks, no npm packages, no CDN scripts or fonts.
- In scope: the twelve pages in `animations/02-entrance-and-exit/` other than `rotate-in`, their READMEs, their cards on the home page (`index.html`, descriptions only), the shared files and the tests. Rotate In only gains `data-hb-kind="once"` and its new home card description. No other category changes. `assets/css/handbook.css`, `assets/js/handbook.js` and `tests/handbook.test.js` stay as they are (they are deleted at the rollout's wrap-up, not here).
- Every Entrance & Exit page is the **plays-once** kind: `<body class="hb" data-hb-kind="once" data-hb-autoplay>`, step 1 "Watch it", a player bar with Replay (and Loop and Slow motion wherever the content sheet says so). Curtain Reveal plays on arrival like the others.
- Stage: the page owns width, border, corners and height (`--hb-stage-h`, `--hb-stage-h-phone`); overflow, background, alignment and perspective belong to the demo.
- Settings follow the rules: plain labels, named choices over numbers, switches for on/off, one hint each, two or three main settings, the rest under More options, playback is not a setting, no readouts. Colour pickers become named swatches; radio groups become choice buttons.
- Each chip reads `<label>: <value>`; the copied text is the prompt, a blank line, then `Settings from the demo: ` + the chips joined with `, ` + `.`
- Prompts: 60–130 words, fill-in parts in square brackets, end with "Match the settings listed below.", no code, nothing stated as fixed that a setting controls, a reduced-motion sentence.
- Touch targets at least 44×44px on phones; hover rules only inside `@media (hover: hover)`; animate only `transform` and `opacity` (and `filter`/`clip-path` where the technique itself is about them); respect `prefers-reduced-motion`.
- Words on the page are plain; never "stunning", "amazing" or "powerful"; no code anywhere on the page.
- The category colour is `--ui-accent: #5fd88a`.
- Tests: `node --test "tests/*.test.js"` from the repo root (the directory form fails on this machine).
- Browser check: a static server runs at `http://127.0.0.1:8731` (start one from the repo root with `python -m http.server 8731 --bind 127.0.0.1` if nothing answers); run `node tools/check-pages.mjs <page folders>`.
- Commit messages: a lower-case prefix (`feat:`, `test:`, `docs:`, `fix:`) and a plain sentence.

## File structure

| File | Change |
|---|---|
| `assets/css/demo-page.css` | Next link and phone top bar, stage ownership, styles for sliders, menus, swatches and text fields |
| `assets/js/demo-page.js` | `shorten`; settings reader for sliders (`.hb-value`), text fields, label fallback; console warning for incomplete settings |
| `tests/demo-page.test.js` | tests for `shorten` |
| `tests/pages.test.js` | page kind, labels and one choice per group, README checks and home card description for every guided-steps page |
| `tools/check-pages.mjs` (new) | browser check tool |
| `docs/superpowers/plans/2026-09-27-entrance-exit-content.md` (new) | the content sheet for the twelve pages |
| `animations/02-entrance-and-exit/*/index.html`, `README.md` | the twelve conversions |
| `index.html` (home) | card descriptions for the thirteen Entrance & Exit pages |

---

### Task 1: Extend the shared template and the page checks

**Files:**
- Modify: `assets/css/demo-page.css`, `assets/js/demo-page.js`, `animations/02-entrance-and-exit/rotate-in/index.html` (body tag only), `index.html` (the `rotate-in` card description only)
- Test: `tests/demo-page.test.js`, `tests/pages.test.js`

**Interfaces:**
- Consumes: the current guided-steps files.
- Produces, for Tasks 4–9: the markup patterns in the table below, `data-hb-kind="once"` on the body, `shorten(text, max)` in `demo-page.js`, and page checks that every converted page must pass.

| Control | Markup the shared files support after this task |
|---|---|
| Choice buttons | `<p class="hb-setting-name" id="X-lbl">Label</p><div class="seg" id="X-seg" role="group" aria-labelledby="X-lbl"><button type="button" class="on" aria-pressed="true">…</button>…</div>` |
| Switch | `<label class="hb-switch-row"><span>Label</span><input class="hb-switch" type="checkbox" role="switch" id="X-tog"></label>` |
| Slider | `<div class="hb-setting-top"><label class="hb-setting-name" for="X-sl">Label</label><output class="hb-value" for="X-sl" id="X-v">Medium</output></div><input type="range" id="X-sl" …>` |
| Menu | `<label class="hb-setting-name" for="X-sel">Label</label><select class="hb-select" id="X-sel">…</select>` |
| Swatches | `<p class="hb-setting-name" id="X-lbl">Label</p><div class="swatches" id="X-sw" role="group" aria-labelledby="X-lbl"><button type="button" class="on" aria-pressed="true" aria-label="Coral" style="background:#ff6f61"></button>…</div>` |
| Text | `<label class="hb-setting-name" for="X-in">Your text</label><input class="hb-text" type="text" id="X-in" value="…">` (or `<textarea class="hb-text" id="X-in">`) |

Each control sits in its own `<div class="hb-setting">` followed by one `<p class="hb-hint">`. In every group, `class` is the first attribute (`<div class="seg" …>`, `<div class="swatches" …>`), which the page checks rely on.

- [ ] **Step 1: Write the failing tests**

Append to `tests/demo-page.test.js`:

```js
test('shorten squeezes whitespace and cuts long text with an ellipsis', () => {
  assert.equal(DP.shorten('  Hello \n  world ', 40), 'Hello world');
  assert.equal(DP.shorten('abcdefghij', 5), 'abcd…');
  assert.equal(DP.shorten('abc de', 5), 'abc…');
  assert.equal(DP.shorten('', 5), '');
});
```

Replace `tests/pages.test.js` with:

```js
// Static checks for demo pages that use the shared layouts, their READMEs and the home page.
// Run from the repo root: node --test "tests/*.test.js"
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sections, table } = require('../assets/js/handbook.js');

const ROOT = path.resolve(__dirname, '..');
const ANIM = path.join(ROOT, 'animations');
const read = f => fs.readFileSync(f, 'utf8');
const count = (s, sub) => s.split(sub).length - 1;
const words = s => s.trim().split(/\s+/).length;
const isDemoDir = dir => fs.existsSync(path.join(dir, 'index.html'));
// The part of s from the first `from` up to the next `to` after it ('' when `from` is missing).
const between = (s, from, to) => {
  const start = s.indexOf(from);
  if (start < 0) return '';
  const end = s.indexOf(to, start + from.length);
  return s.slice(start, end < 0 ? undefined : end);
};
const decode = s => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

const demos = fs.readdirSync(ANIM, { withFileTypes: true }).filter(c => c.isDirectory()).flatMap(c =>
  fs.readdirSync(path.join(ANIM, c.name), { withFileTypes: true }).filter(d => d.isDirectory())
    .map(d => ({ cat: c.name, slug: d.name, dir: path.join(ANIM, c.name, d.name) })));
const pageOf = d => read(path.join(d.dir, 'index.html'));
const converted = demos.filter(d => pageOf(d).includes('<main class="hb-view">'));
const steps = demos.filter(d => pageOf(d).includes('<main class="hb-page">'));
const HOME = read(path.join(ROOT, 'index.html'));

const PILOT = '02-entrance-and-exit';
const PILOT_AUTOPLAY = new Set(['fade-in-out', 'slide-in', 'slide-up-reveal', 'scale-in', 'clip-path-reveal',
  'split-text-reveal', 'letter-by-letter-stagger', 'word-by-word-reveal', 'blur-in', 'flip-in', 'bounce-in', 'rotate-in']);

test('every Entrance & Exit demo uses one of the shared layouts', () => {
  const left = demos.filter(d => d.cat === PILOT && !converted.includes(d) && !steps.includes(d)).map(d => d.slug);
  assert.deepEqual(left, []);
});

test('Rotate In uses the guided-steps page', () => {
  assert.ok(steps.some(d => d.cat === PILOT && d.slug === 'rotate-in'));
});

for (const d of converted) {
  test(`${d.cat}/${d.slug} uses the shared layout correctly`, () => {
    const html = pageOf(d);
    assert.ok(html.includes('<link rel="stylesheet" href="../../../assets/css/handbook.css">'), 'shared stylesheet');
    assert.ok(html.includes('<script src="../../../assets/js/handbook.js" defer></script>'), 'shared script');
    assert.match(html, /<body class="hb"( data-hb-autoplay)?>/);
    for (const legacy of ['ah-bar', 'ah-copy', 'ah-inject', 'Copy source', 'Bricolage', 'PlexMono', 'class="note"', 'class="layout"']) {
      assert.ok(!html.includes(legacy), `legacy markup left: ${legacy}`);
    }
    for (const part of ['<nav class="hb-bar"', '<main class="hb-view">', '<aside class="hb-side">', '<section class="hb-settings"', '<p class="hb-prompt">']) {
      assert.equal(count(html, part), 1, `exactly one ${part}`);
    }
    assert.match(html, /<p class="hb-cat">\d{2}\.\d{2} · [^<]+<\/p>/);
    const prompt = html.match(/<p class="hb-prompt">([^<]*)<\/p>/)[1];
    assert.ok(words(prompt) >= 60 && words(prompt) <= 130, `prompt has ${words(prompt)} words`);
    assert.ok(prompt.trim().endsWith('Match the settings listed below.'), 'prompt ending');
    assert.ok(!prompt.includes('`'), 'prompt contains no code');
    assert.equal(count(html, 'data-hb-replay'), 1, 'one replay control');
    assert.ok(count(html, 'data-hb-reset') <= 1, 'at most one reset control');
    if (d.cat === PILOT) assert.equal(html.includes('data-hb-autoplay'), PILOT_AUTOPLAY.has(d.slug), 'autoplay flag');
    for (const [, href] of html.matchAll(/<a href="([^"]+)" rel="(?:prev|next)"/g)) {
      assert.ok(isDemoDir(path.resolve(d.dir, href)), `pager link ${href}`);
    }
  });
}

for (const d of steps) {
  test(`${d.cat}/${d.slug} uses the guided-steps page correctly`, () => {
    const html = pageOf(d);
    assert.ok(html.includes('<link rel="stylesheet" href="../../../assets/css/demo-page.css">'), 'page stylesheet');
    assert.ok(html.includes('<script src="../../../assets/js/demo-page.js" defer></script>'), 'page script');
    const body = html.match(/<body class="hb" data-hb-kind="(once|loop|scroll|do)"( data-hb-autoplay)?>/);
    assert.ok(body, 'the body declares the page kind');
    const kind = body[1];
    for (const old of ['handbook.css', 'handbook.js', 'hb-view', 'hb-side', 'hb-take', 'ah-bar', 'Copy source', 'Read more',
      'class="note"', 'class="kv"', 'class="lbl"', 'class="btn-row"', 'Bricolage', 'PlexMono']) {
      assert.ok(!html.includes(old), `old markup left: ${old}`);
    }
    for (const part of ['<nav class="hb-bar"', '<main class="hb-page">', '<header class="hb-head">',
      '<section class="hb-step hb-watch"', '<div class="hb-player">', '<section class="hb-step hb-try"',
      '<section class="hb-step hb-prompt-step"', '<p class="hb-prompt">', '<ul class="hb-chips">',
      '<button class="hb-copy" type="button">', '<section class="hb-about"', '<ul class="hb-tags hb-good">',
      '<ul class="hb-tags hb-avoid">', '<section class="hb-related"', '<footer class="hb-foot">']) {
      assert.equal(count(html, part), 1, `exactly one ${part}`);
    }
    assert.match(html, /<p class="hb-cat">\d{2}\.\d{2} · [^<]+<\/p>/);
    const prompt = html.match(/<p class="hb-prompt">([^<]*)<\/p>/)[1];
    assert.ok(words(prompt) >= 60 && words(prompt) <= 130, `prompt has ${words(prompt)} words`);
    assert.ok(prompt.trim().endsWith('Match the settings listed below.'), 'prompt ending');
    assert.ok(!prompt.includes('`'), 'prompt contains no code');
    const player = between(html, '<div class="hb-player">', '</div>');
    if (kind === 'once') {
      assert.equal(count(html, 'data-hb-replay'), 1, 'one Replay control');
      assert.ok(player.includes('data-hb-replay'), 'Replay is in the player bar');
    }
    for (const marker of ['data-hb-loop', 'data-hb-slowmo']) {
      assert.ok(count(html, marker) <= 1, `at most one ${marker}`);
      assert.equal(count(player, marker), count(html, marker), `${marker} is in the player bar`);
      const input = (html.match(new RegExp(`<input[^>]*${marker}[^>]*>`)) || [''])[0];
      assert.ok(!/\schecked\b/.test(input), `${marker} switch starts unchecked`);
    }
    const tryIt = between(html, '<section class="hb-step hb-try"', '<section class="hb-step hb-prompt-step"');
    const main = between(tryIt, '<div class="hb-settings">', '<details class="hb-options">');
    const mainCount = count(main, 'class="hb-setting"');
    assert.ok(mainCount >= 1 && mainCount <= 3, `${mainCount} main settings`);
    assert.equal(count(tryIt, 'class="hb-hint"'), count(tryIt, 'class="hb-setting"'), 'every setting has one hint');
    const good = count(between(html, '<ul class="hb-tags hb-good">', '</ul>'), '<li>');
    const avoid = count(between(html, '<ul class="hb-tags hb-avoid">', '</ul>'), '<li>');
    assert.ok(good >= 3 && good <= 5, `${good} Good for tags`);
    assert.ok(avoid >= 1 && avoid <= 3, `${avoid} Avoid on tags`);
    for (const [, href] of html.matchAll(/<a href="([^"]+)" rel="(?:prev|next)"/g)) {
      assert.ok(isDemoDir(path.resolve(d.dir, href)), `pager link ${href}`);
    }
  });

  test(`${d.slug}: every setting has a label and every choice group has one choice made`, () => {
    const tryIt = between(pageOf(d), '<section class="hb-step hb-try"', '<section class="hb-step hb-prompt-step"');
    for (const [, cls, attrs, inner] of tryIt.matchAll(/<div class="(seg|swatches)"([^>]*)>([\s\S]*?)<\/div>/g)) {
      const labelledBy = (attrs.match(/aria-labelledby="([^"]+)"/) || [])[1];
      assert.ok(/role="group"/.test(attrs), `a ${cls} group has role="group"`);
      assert.ok(labelledBy && tryIt.includes(`id="${labelledBy}"`), `a ${cls} group is labelled`);
      assert.equal(count(inner, 'aria-pressed="true"'), 1, `${labelledBy} has exactly one choice made`);
    }
    for (const [, name, attrs] of tryIt.matchAll(/<(input|select|textarea)\b([^>]*)>/g)) {
      if (/type="checkbox"/.test(attrs)) continue;
      const id = (attrs.match(/\sid="([^"]+)"/) || [])[1];
      assert.ok(id && new RegExp(`<label[^>]*\\sfor="${id}"`).test(tryIt), `${name} ${id || '(no id)'} has a label`);
    }
    assert.equal(count(tryIt, 'type="checkbox"'), count(tryIt, 'class="hb-switch-row"'), 'every switch sits in a labelled switch row');
  });

  test(`${d.slug}: README is ready for the site`, () => {
    const s = sections(read(path.join(d.dir, 'README.md')));
    for (const h of ['What it is', 'When to use it', 'Key parameters', 'See also']) assert.ok(s[h], `section ${h}`);
    assert.ok(!s['What it is'].includes('`'), 'What it is has no code');
    assert.ok(!s['Key parameters'].includes('`'), 'Key parameters has no code');
    assert.ok(table(s['Key parameters']).length > 0, 'Key parameters has rows');
    const links = [...s['See also'].matchAll(/^\s*[-*]\s+\[[^\]]+\]\(([^)\s]+)\)(.*)$/gm)];
    assert.ok(links.length > 0, 'See also has links');
    for (const [, href, rest] of links) {
      assert.ok(isDemoDir(path.resolve(d.dir, href)), `See also link ${href}`);
      assert.match(rest, /^\s*[—–-]\s*\S/, `See also ${href} has a short description`);
    }
  });

  test(`${d.slug}: every Key parameters name is a setting in Try it`, () => {
    const tryIt = between(pageOf(d), '<section class="hb-step hb-try"', '<section class="hb-step hb-prompt-step"')
      .replace(/<[^>]+>/g, ' ');
    const rows = sections(read(path.join(d.dir, 'README.md')))['Key parameters'].split('\n').slice(2);
    for (const row of rows) {
      const name = (row.split('|')[1] || '').trim();
      if (name) assert.ok(tryIt.includes(name), `setting "${name}"`);
    }
  });

  test(`${d.slug}: the home page card uses the page's description`, () => {
    const lede = decode(pageOf(d).match(/<p class="hb-lede">([^<]*)<\/p>/)[1]);
    const entry = HOME.match(new RegExp(`\\['${d.slug}','(?:[^'\\\\]|\\\\.)*','((?:[^'\\\\]|\\\\.)*)'\\]`));
    assert.ok(entry, 'home page entry');
    assert.equal(entry[1].replace(/\\'/g, "'"), lede);
  });
}

for (const d of converted.filter(c => c.cat === PILOT)) {
  test(`README for ${d.slug} is ready for the site`, () => {
    const s = sections(read(path.join(d.dir, 'README.md')));
    for (const h of ['What it is', 'When to use it', 'Key parameters', 'See also']) assert.ok(s[h], `section ${h}`);
    assert.ok(!s['What it is'].includes('`'), 'What it is has no code');
    assert.ok(!s['Key parameters'].includes('`'), 'Key parameters has no code');
    assert.ok(table(s['Key parameters']).length > 0, 'Key parameters has rows');
    for (const [, href] of s['See also'].matchAll(/\]\(([^)\s]+)\)/g)) {
      assert.ok(isDemoDir(path.resolve(d.dir, href)), `See also link ${href}`);
    }
  });

  test(`${d.slug}: every Key parameters name is a control on the page`, () => {
    const html = pageOf(d);
    const panel = html.slice(html.indexOf('<section class="hb-settings"'), html.indexOf('<div class="hb-take">')).replace(/<[^>]+>/g, ' ');
    const rows = sections(read(path.join(d.dir, 'README.md')))['Key parameters'].split('\n').slice(2);
    for (const row of rows) {
      const name = (row.split('|')[1] || '').trim();
      if (name) assert.ok(panel.includes(name), `control label "${name}"`);
    }
  });
}

test('the home page uses Schibsted Grotesk and the new intro line', () => {
  assert.ok(HOME.includes("url('assets/fonts/schibsted-latin.woff2')"), 'Latin font file');
  assert.ok(HOME.includes("url('assets/fonts/schibsted-latin-ext.woff2')"), 'Latin Extended font file');
  for (const old of ['Bricolage', 'PlexMono', 'var(--mono)', '--mono:']) assert.ok(!HOME.includes(old), `still uses ${old}`);
  assert.ok(HOME.includes('See 129 web animations move, learn when to use each one, and copy a prompt to build it.'));
});
```

- [ ] **Step 2: Run the tests to see them fail**

Run: `node --test "tests/*.test.js"`
Expected failures, and only these: `shorten squeezes whitespace…` (`DP.shorten is not a function`), `02-entrance-and-exit/rotate-in uses the guided-steps page correctly` (the body declares no kind), and `rotate-in: the home page card uses the page's description` (the card still has the old text).

- [ ] **Step 3: Extend the settings reader**

In `assets/js/demo-page.js`:

1. Directly after the `markFill` function, add:

```js
  // Text squeezed onto one line and cut to max characters (ending with an ellipsis), for chips.
  function shorten(text, max) {
    var s = String(text).replace(/\s+/g, ' ').trim();
    return s.length > max ? s.slice(0, max - 1).trimEnd() + '…' : s;
  }
```

2. Replace `var CONTROLS = 'input[type=range], input[type=checkbox], select, .seg, .swatches';` with:

```js
  var CONTROLS = 'input[type=range], input[type=checkbox], input[type=text], textarea, select, .seg, .swatches';
```

3. In `labelFor`, replace the last two lines:

```js
    var byFor = control.id && doc.querySelector('label[for="' + control.id + '"]');
    return byFor ? text(byFor) : '';
```

with:

```js
    var byFor = control.id && doc.querySelector('label[for="' + control.id + '"]');
    if (byFor) return text(byFor);
    var setting = control.closest('.hb-setting');
    return setting ? text(setting.querySelector('.hb-setting-name')) : '';
```

4. In `valueFor`, replace the range branch:

```js
    if (control.matches('input[type=range]')) {
      var row = control.closest('.sr');
      var shown = row && row.querySelector('.sv');
      return shown ? text(shown) : (control.getAttribute('aria-valuetext') || control.value);
    }
```

with:

```js
    if (control.matches('input[type=range]')) {
      var setting = control.closest('.hb-setting');
      var shown = setting && setting.querySelector('.hb-value');
      return shown ? text(shown) : (control.getAttribute('aria-valuetext') || control.value);
    }
    if (control.matches('input[type=text], textarea')) return shorten(control.value, 40);
```

5. In `readSettings`, replace `return { label: labelFor(doc, control), value: valueFor(control) };` with:

```js
      return { label: labelFor(doc, control), value: valueFor(control), control: control };
```

6. In `boot`, directly after the `refreshChips` function, add:

```js
    // For page authors: a control without a label or a value is left out of the chips and the copied prompt.
    function warnIncomplete() {
      if (!tryStep || !win.console) return;
      readSettings(doc, tryStep, win).forEach(function (s) {
        if (!s.label || !s.value) win.console.warn('Your settings: this control has no ' + (s.label ? 'value' : 'label') + ' and is left out', s.control);
      });
    }
```

and at the end of `boot`, replace:

```js
    refreshChips();
    loadReadme();
```

with:

```js
    refreshChips();
    warnIncomplete();
    loadReadme();
```

7. In the returned object, add `shorten: shorten,` after `markFill: markFill,`.

- [ ] **Step 4: Extend the stylesheet**

In `assets/css/demo-page.css`:

1. Replace the stage rule (the three lines starting `.hb-page .stage{box-sizing:border-box;`) with:

```css
.hb-page .stage{box-sizing:border-box;width:100%;min-width:0;margin:0;flex:none;
  height:var(--hb-stage-h,clamp(300px,calc(100vh - 420px),440px));height:var(--hb-stage-h,clamp(300px,calc(100svh - 420px),440px));
  border:1px solid rgba(255,255,255,.1);border-radius:12px}
/* Overflow belongs to the demo: this default has zero specificity, so a demo's own .stage rule wins
   (scroll demos scroll inside their stage). A demo that needs another height sets --hb-stage-h or --hb-stage-h-phone. */
:where(.hb-page .stage){min-height:0;overflow:hidden}
```

2. Directly after the line `.hb-options>.hb-settings{margin-top:16px}`, add:

```css
.hb-setting-top{display:flex;align-items:baseline;justify-content:space-between;gap:12px}
.hb-value{font:600 15px/1.3 var(--hb-font);color:var(--hb-accent);white-space:nowrap}
.hb-page .hb-setting input[type=range]{width:100%;min-height:44px;margin:0;accent-color:var(--hb-accent);cursor:pointer}
.hb-select,.hb-text{box-sizing:border-box;width:100%;min-height:44px;padding:0 12px;border:1px solid var(--hb-edge);border-radius:8px;
  background:var(--hb-panel);color:var(--hb-ink);font:500 16px/1.3 var(--hb-font)}
textarea.hb-text{min-height:88px;padding:10px 12px;resize:vertical}
.hb-page .swatches{display:flex;flex-wrap:wrap;gap:10px}
.hb-page .swatches button{box-sizing:border-box;width:44px;height:44px;padding:0;border:2px solid transparent;border-radius:50%;
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.18);cursor:pointer}
.hb-page .swatches button[aria-pressed="true"]{border-color:var(--hb-ink);box-shadow:inset 0 0 0 3px var(--hb-bg)}
```

3. Inside `@media(hover:hover){ … }`, after the `.hb-page .seg button.on:hover…` line, add:

```css
  .hb-page .swatches button:not([aria-pressed="true"]):hover{border-color:var(--hb-edge-2)}
  .hb-select:hover,.hb-text:hover{border-color:var(--hb-edge-2)}
```

4. In the short-screen block (`@media(min-width:601px) and (max-height:760px)`), replace:

```css
  .hb-page .stage{height:clamp(260px,calc(100vh - 330px),440px);height:clamp(260px,calc(100svh - 330px),440px)}
```

with:

```css
  .hb-page .stage{height:var(--hb-stage-h,clamp(260px,calc(100vh - 330px),440px));height:var(--hb-stage-h,clamp(260px,calc(100svh - 330px),440px))}
```

5. In the phone block (`@media(max-width:600px)`), replace `  .hb-page .stage{height:300px}` with:

```css
  .hb-page .stage{height:var(--hb-stage-h-phone,300px)}
  /* With both Previous and Next, phones show only the two chevrons; each link keeps its full name as its label */
  .hb-pager:has(a + a) a > span{display:none}
```

- [ ] **Step 5: Declare Rotate In's kind and update its home card**

In `animations/02-entrance-and-exit/rotate-in/index.html`, replace `<body class="hb" data-hb-autoplay>` with `<body class="hb" data-hb-kind="once" data-hb-autoplay>`.

In `index.html` (the home page), replace:

```
      ['rotate-in','Rotate In','Spins while entering — best on radially-symmetric shapes like icons, stars, and gears.'],
```

with:

```
      ['rotate-in','Rotate In','Spins into place while it grows. Best for icons, stars and badges.'],
```

- [ ] **Step 6: Run the tests to see them pass**

Run: `node --test "tests/*.test.js"`
Expected: every test passes.

- [ ] **Step 7: Check that Rotate In still looks and works the same**

With the static server running, take a desktop screenshot (headless Chrome, `--virtual-time-budget=1600`, 1280×800) of `http://127.0.0.1:8731/animations/02-entrance-and-exit/rotate-in/` and open it with the Read tool: the page looks as before (badge on the stage, player bar visible).

- [ ] **Step 8: Commit**

```bash
git add assets/js/demo-page.js assets/css/demo-page.css tests/demo-page.test.js tests/pages.test.js animations/02-entrance-and-exit/rotate-in/index.html index.html
git commit -m "feat: extend the guided-steps template for the Entrance & Exit rollout"
```

---

### Task 2: A browser check tool

**Files:**
- Create: `tools/check-pages.mjs`

**Interfaces:**
- Consumes: a static server for the repo and the local Chrome.
- Produces: `node tools/check-pages.mjs [--base URL] [--out DIR] <page folder>...` — prints one line per page and screen setup (`ok` or `FAIL — problems`), saves screenshots in DIR (a new temp folder by default, printed at the end), exits with 1 when anything fails.

- [ ] **Step 1: Write the tool**

Create `tools/check-pages.mjs`:

```js
#!/usr/bin/env node
// Browser check for guided-steps demo pages: a development tool, not part of the site.
// Needs the local Chrome and a static server for the repo (python -m http.server 8731 --bind 127.0.0.1).
// Usage: node tools/check-pages.mjs [--base http://127.0.0.1:8731] [--out <folder>] <page folder>...
//   e.g. node tools/check-pages.mjs animations/02-entrance-and-exit/fade-in-out
// Each page is loaded at five screen setups; problems are printed and screenshots saved. Exit code 1 on any problem.
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = Number(process.env.CDP_PORT || 9333);
const args = process.argv.slice(2);
function option(name, fallback) {
  const i = args.indexOf(name);
  if (i < 0) return fallback;
  const value = args[i + 1];
  args.splice(i, 2);
  return value;
}
const BASE = option('--base', 'http://127.0.0.1:8731').replace(/\/$/, '');
const OUT = option('--out', mkdtempSync(join(tmpdir(), 'hb-check-')));
const pages = args.map(p => p.replace(/\\/g, '/').replace(/^\.?\//, '').replace(/\/?(index\.html)?$/, '/'));
if (!pages.length) {
  console.error('Usage: node tools/check-pages.mjs [--base URL] [--out DIR] <page folder>...');
  process.exit(2);
}
mkdirSync(OUT, { recursive: true });

const SETUPS = [
  { name: 'desktop', width: 1280, height: 800, full: true },
  { name: 'laptop', width: 1366, height: 657 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'phone', width: 375, height: 812, mobile: true, scale: 2 },
  { name: 'phone-reduced', width: 375, height: 812, mobile: true, scale: 2, reduce: true }
];

// Runs inside the page. Returns the page kind, the Loop switch state and the problems found.
const CHECK = `(() => {
  const r = el => el.getBoundingClientRect();
  const phone = innerWidth <= 600;
  const problems = [];
  if (document.documentElement.scrollWidth > innerWidth + 1) problems.push('horizontal overflow');
  if (phone) {
    const small = [...document.querySelectorAll('.hb-bar a, .hb-page button, .hb-page summary, .hb-page select, .hb-page input[type=range], .hb-page .hb-text, label.hb-toggle, label.hb-switch-row, .hb-foot a, .hb-rel')]
      .filter(el => el.getClientRects().length && !el.closest('.stage'))
      .filter(el => { const b = r(el); return b.width < 44 || b.height < 44; })
      .map(el => el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '') + ' ' + Math.round(r(el).width) + 'x' + Math.round(r(el).height));
    if (small.length) problems.push('small targets: ' + small.join(', '));
  }
  const player = document.querySelector('.hb-player');
  if (innerWidth >= 1025 && player && r(player).bottom > innerHeight) problems.push('player bar below the first screen');
  const tryIt = document.querySelector('.hb-try');
  const shown = el => { for (let n = el; n && n !== tryIt; n = n.parentElement) { if (n.hidden || n.hasAttribute('data-hb-skip') || getComputedStyle(n).display === 'none') return false; } return true; };
  const controls = tryIt ? [...tryIt.querySelectorAll('input[type=range], input[type=checkbox], input[type=text], textarea, select, .seg, .swatches')].filter(shown).length : 0;
  const chips = document.querySelectorAll('.hb-chips li').length;
  if (chips !== controls) problems.push('chips ' + chips + ' vs settings ' + controls);
  if (!document.querySelector('.hb-what-text p')) problems.push('What it is is empty');
  const loop = document.querySelector('[data-hb-loop]');
  return { kind: document.body.dataset.hbKind || '', loop: loop ? loop.checked : null, problems };
})()`;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'hb-chrome-'))}`, 'about:blank'], { stdio: 'ignore' });

async function pageSocket() {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find(t => t.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(200);
  }
  throw new Error('Chrome did not start (set CHROME to its path if it is not in the default place)');
}

const ws = new WebSocket(await pageSocket());
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let nextId = 0;
const pending = new Map();
const listeners = new Set();
ws.addEventListener('message', event => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); } else listeners.forEach(fn => fn(msg));
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++nextId;
  pending.set(id, msg => (msg.error ? reject(new Error(`${method}: ${msg.error.message}`)) : resolve(msg.result)));
  ws.send(JSON.stringify({ id, method, params }));
});
const evaluate = async expression => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.value;

const errors = [];
listeners.add(msg => {
  if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text);
  if (msg.method === 'Runtime.consoleAPICalled' && (msg.params.type === 'error' || msg.params.type === 'warning')) {
    errors.push(msg.params.args.map(a => a.value ?? a.description).join(' '));
  }
  if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') errors.push(msg.params.entry.text + ' ' + (msg.params.entry.url || ''));
});
await send('Page.enable');
await send('Runtime.enable');
await send('Log.enable');

let failures = 0;
for (const page of pages) {
  for (const setup of SETUPS) {
    errors.length = 0;
    await send('Emulation.setDeviceMetricsOverride', { width: setup.width, height: setup.height, deviceScaleFactor: setup.scale || 1, mobile: !!setup.mobile });
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: setup.reduce ? 'reduce' : 'no-preference' }] });
    const loaded = new Promise(resolve => {
      const onLoad = msg => { if (msg.method === 'Page.loadEventFired') { listeners.delete(onLoad); resolve(); } };
      listeners.add(onLoad);
    });
    await send('Page.navigate', { url: `${BASE}/${page}` });
    await loaded;
    await sleep(2000);
    const result = await evaluate(CHECK);
    const problems = [...result.problems, ...errors.map(e => 'console: ' + e)];
    if (result.kind === 'once' && result.loop !== null) {
      if (setup.reduce && result.loop) problems.push('Loop switched on under reduced motion');
      if (!setup.reduce && !result.loop) problems.push('did not start playing on arrival (Loop is off)');
    }
    const name = page.replace(/\/$/, '').split('/').pop();
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(OUT, `${name}-${setup.name}.png`), Buffer.from(shot.data, 'base64'));
    if (setup.full) {
      const { cssContentSize } = await send('Page.getLayoutMetrics');
      const full = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
        clip: { x: 0, y: 0, width: setup.width, height: Math.ceil(cssContentSize.height), scale: 1 } });
      writeFileSync(join(OUT, `${name}-${setup.name}-full.png`), Buffer.from(full.data, 'base64'));
    }
    if (problems.length) failures++;
    console.log(`${problems.length ? 'FAIL' : 'ok  '} ${name} ${setup.name}${problems.length ? ' — ' + problems.join('; ') : ''}`);
  }
}
console.log(`Screenshots: ${OUT}`);
ws.close();
chrome.kill();
process.exit(failures ? 1 : 0);
```

- [ ] **Step 2: Run it on Rotate In**

Run: `node tools/check-pages.mjs animations/02-entrance-and-exit/rotate-in`
Expected: five `ok` lines (desktop, laptop, tablet, phone, phone-reduced) and the screenshots folder. Open `rotate-in-phone.png` and `rotate-in-desktop.png` with the Read tool: the badge is on the stage and nothing overlaps.

- [ ] **Step 3: Check that it catches problems**

Run it on a page that still uses the first redesign's layout: `node tools/check-pages.mjs animations/02-entrance-and-exit/fade-in-out; echo "exit $?"`. Expected: `FAIL` lines (that page has no "What it is" section on the page yet) and `exit 1`.

- [ ] **Step 4: Commit**

```bash
git add tools/check-pages.mjs
git commit -m "feat: add a browser check tool for guided-steps pages"
```

---

### Task 3: The content sheet for the twelve pages

**Files:**
- Create: `docs/superpowers/plans/2026-09-27-entrance-exit-content.md`

**Interfaces:**
- Consumes: each page's current `index.html` and `README.md`; the Rotate In page and README as the model; the settings rules and markup table in Task 1.
- Produces: one section per page that Tasks 4–9 follow exactly.

This task decides words and settings; it writes no code. Read each page's current `index.html` (controls, their ranges and defaults, the demo's script) and `README.md` before writing its section.

- [ ] **Step 1: Write one section per page, in this format**

```markdown
## <slug> — <Title>

- **Description:** <one sentence, at most 80 characters, plain words; used as the lede, the meta descriptions and the home card>
- **Watch it help line:** default | <custom line, when the default does not fit>
- **Player bar:** Replay · Loop · Slow motion (say which, and why any is left out)
- **Loop sequence:** <what one cycle does, e.g. "plays in, holds 900ms, plays out, waits 500ms">
- **Slow motion:** <which durations and timers are multiplied by 3>

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|

- **Removed:** <old controls that go away and why (playback controls, readouts, notes)>
- **Stage:** <what stays on the stage; readouts or captions removed; `hb-dots` yes/no; a stage height variable if needed>
- **Good for:** <3–5 tags> · **Avoid on:** <1–3 tags>
- **Prompt:** keep | <the rewritten prompt, 60–130 words, ending "Match the settings listed below.">
- **README Key parameters:** <one row per setting: Parameter | Default | Effect, names exactly as on the page>
- **README See also:** <each existing link with one plain phrase after " — ">
- **README How it works:** <what must change so the snippets match the new code, or "unchanged">
```

Rules for the content:

- **Settings:** follow the rules in Global Constraints. Replace number settings with named choices where the numbers carry no meaning for a visitor: Duration (ms) becomes Speed (Slow · Normal · Fast, keeping the old default as Normal and roughly 1.6× and 0.6× of it for Slow and Fast); Easing becomes Feel with plain names (for example Smooth, Springy, Even, Gentle); Transform origin becomes "Grows from" or "Turns around" with plain places; Distance, Start scale, Starting blur, Perspective and stagger delays become three or four named steps (for example Short · Medium · Far). Keep a slider only when sliding through values is the point (say why), and give it a plain value in `output.hb-value`. "Combine with fade" becomes the switch "Fades in". Text inputs become "Your text". Choose the two or three settings that change the effect most as the main ones.
- **Sets in the demo:** say exactly which variable, class or code value each choice sets (for example "--dur 1000ms / 600ms / 350ms"), so the implementer does not have to guess.
- **Every choice must be something the demo can already do**; do not invent new behaviour, and do not drop a setting that changes the technique itself (move it to More options instead).
- **Prompt:** keep the page's current prompt unless it states as fixed something a setting now controls; then reword that part the way Rotate In's prompt was reworded.
- **Tags:** short nouns, like Rotate In's ("Icons", "Badges and stars"; "Text", "Wide boxes and cards").
- **Hints:** one short sentence each, at most 60 characters, saying what it changes or how it feels.

The pages, in order: fade-in-out, slide-in, slide-up-reveal, scale-in, clip-path-reveal, curtain-reveal, split-text-reveal, letter-by-letter-stagger, word-by-word-reveal, blur-in, flip-in, bounce-in.

- [ ] **Step 2: Check the sheet**

For each section: at most three main settings; every setting has a hint of at most 60 characters; every choice has its "Sets in the demo" value; the prompt (kept or rewritten) is 60–130 words and ends with "Match the settings listed below."; the Key parameters names match the Setting names exactly.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/plans/2026-09-27-entrance-exit-content.md
git commit -m "docs: content sheet for the Entrance & Exit rollout"
```

---

### How to convert a page (Tasks 4–9)

Each of Tasks 4–9 converts two pages. For each page, follow its section of the content sheet exactly, and use Rotate In (`animations/02-entrance-and-exit/rotate-in/index.html`) as the reference for every part of the page that is not the demo itself.

1. **Read** the page's current `index.html` and `README.md`, its content-sheet section, and the Rotate In page.
2. **Head:** keep the title, canonical link, icons and Open Graph and Twitter tags; set every description (meta, `og:description`, `twitter:description`, JSON-LD `description`) to the sheet's Description. Replace the `handbook.css`/`handbook.js` links with `<link rel="stylesheet" href="../../../assets/css/demo-page.css">` and `<script src="../../../assets/js/demo-page.js" defer></script>`, placed after the page's own `<style>` exactly as on Rotate In.
3. **The demo's `<style>`:** keep `:root` variables (with `--ui-accent:#5fd88a`), the reset line and every rule the stage content needs; delete the old layout rules (`header`, `.layout`, `aside`, `.note`, `.lbl`, `.kv`, `.div`, `.sr`, `.sv`, `select`, `.seg`, `.tog`, `.btn-row`, `button.act`, the old mobile layout block) and rules for removed readouts. Keep the demo's reduced-motion rule.
4. **Body:** `<body class="hb" data-hb-kind="once" data-hb-autoplay>`, then the top bar, `main.hb-page`, the footer and the script, in Rotate In's structure:
   - Top bar: the home link as on Rotate In, and the pager with this page's Previous and Next links (keep the targets the page has today). A Previous link is `<a href="../<prev>/" rel="prev" aria-label="Previous: <Name>"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg><span><span class="hb-dir">Previous: </span><Name></span></a>`; a Next link is `<a href="../<next>/" rel="next" aria-label="Next: <Name>"><span><span class="hb-dir">Next: </span><Name></span><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></a>`.
   - Header: the page's category line (`02.NN · Entrance &amp; Exit`), its title, and the Description as the lede.
   - Step 1: "Watch it" with the help line, the `.stage` (add `hb-dots` if the sheet says so) holding the demo's animated content without removed readouts or captions, then the player bar with the sheet's controls, using Rotate In's markup (switches unchecked).
   - Step 2: "Try it", the main settings in `div.hb-settings`, the rest in `details.hb-options` exactly as on Rotate In, each control in the markup from Task 1's table, with its hint.
   - Step 3: the prompt card exactly as on Rotate In, with the sheet's prompt.
   - About (What it is with the README link as fallback; Good for and Avoid on tags), Similar animations and the footer exactly as on Rotate In.
5. **Script:** rewrite the page's script so that:
   - the Replay button (`id="btn-play"`, `data-hb-replay`) plays from the start, and keeps looping when Loop is on;
   - the Loop switch (`data-hb-loop`) starts the sheet's loop sequence when switched on, and when switched off lets the current cycle finish with the element shown (Rotate In's `cycle()`/`play()` pattern);
   - the Slow motion switch (`data-hb-slowmo`) multiplies the sheet's durations and the timers that wait for them by 3, taking effect on the next play;
   - every setting sets what its "Sets in the demo" column says; choice buttons toggle `.on` and `aria-pressed` (Rotate In's `choices()` helper); sliders update their `output.hb-value` with the plain value;
   - nothing else remains of the old controls, readouts or `data-hb-reset`/`data-hb-skip` markers;
   - reduced motion still gives the demo's reduced version, and no loop runs under reduced motion.
   The shared script replays the demo after every setting change and turns Loop on at arrival; the page's script must not do either itself.
6. **README:** replace the Key parameters table with the sheet's rows, bring How it works in line with the new code, and give each See also line its plain phrase. Leave What it is, When to use it and Production notes as they are unless they name a removed control.
7. **Home page:** in `index.html`, set the page's card description (the third string of its `['<slug>','<Title>','…']` entry) to the Description, escaping any `'` as `\'`.
8. **Check:** run `node --test "tests/*.test.js"` (all pass) and `node tools/check-pages.mjs animations/02-entrance-and-exit/<slug>` (five `ok` lines). Open the page's desktop and phone screenshots with the Read tool and compare them with Rotate In's: same structure, the animation visible on the stage, nothing overlapping or cut off.
9. **Commit** each page on its own: `feat: move <Title> to the guided-steps page`.

### Task 4: Fade In/Out and Slide In

**Files:** `animations/02-entrance-and-exit/fade-in-out/{index.html,README.md}`, `animations/02-entrance-and-exit/slide-in/{index.html,README.md}`, `index.html` (their two card descriptions)

- [ ] **Step 1:** Convert `fade-in-out` by following "How to convert a page" and its content-sheet section; run the checks; commit.
- [ ] **Step 2:** Convert `slide-in` the same way; run the checks; commit.

### Task 5: Slide Up Reveal and Scale In

**Files:** `animations/02-entrance-and-exit/slide-up-reveal/{index.html,README.md}`, `animations/02-entrance-and-exit/scale-in/{index.html,README.md}`, `index.html` (their two card descriptions)

Keep each line's own `overflow: hidden` wrapper in Slide Up Reveal: the reveal depends on it.

- [ ] **Step 1:** Convert `slide-up-reveal` by following "How to convert a page" and its content-sheet section; run the checks; commit.
- [ ] **Step 2:** Convert `scale-in` the same way; run the checks; commit.

### Task 6: Clip-Path Reveal and Curtain Reveal

**Files:** `animations/02-entrance-and-exit/clip-path-reveal/{index.html,README.md}`, `animations/02-entrance-and-exit/curtain-reveal/{index.html,README.md}`, `index.html` (their two card descriptions)

Curtain Reveal gains `data-hb-autoplay` and plays on arrival. Its colour choices become swatches with colour names.

- [ ] **Step 1:** Convert `clip-path-reveal` by following "How to convert a page" and its content-sheet section; run the checks; commit.
- [ ] **Step 2:** Convert `curtain-reveal` the same way; run the checks; commit.

### Task 7: Split Text Reveal and Letter-by-Letter Stagger

**Files:** `animations/02-entrance-and-exit/split-text-reveal/{index.html,README.md}`, `animations/02-entrance-and-exit/letter-by-letter-stagger/{index.html,README.md}`, `index.html` (their two card descriptions)

Both pages have a text field ("Your text"): rebuilding the letters or words when the text changes stays the page's job; the shared script replays after the change.

- [ ] **Step 1:** Convert `split-text-reveal` by following "How to convert a page" and its content-sheet section; run the checks; commit.
- [ ] **Step 2:** Convert `letter-by-letter-stagger` the same way; run the checks; commit.

### Task 8: Word-by-Word Reveal and Blur In

**Files:** `animations/02-entrance-and-exit/word-by-word-reveal/{index.html,README.md}`, `animations/02-entrance-and-exit/blur-in/{index.html,README.md}`, `index.html` (their two card descriptions)

- [ ] **Step 1:** Convert `word-by-word-reveal` by following "How to convert a page" and its content-sheet section; run the checks; commit.
- [ ] **Step 2:** Convert `blur-in` the same way; run the checks; commit.

### Task 9: Flip In and Bounce In

**Files:** `animations/02-entrance-and-exit/flip-in/{index.html,README.md}`, `animations/02-entrance-and-exit/bounce-in/{index.html,README.md}`, `index.html` (their two card descriptions)

Flip In keeps `perspective` on its `.stage` (the demo's own rule; the shared stylesheet no longer overrides it). Bounce In builds its keyframes in a `<style>` element from its settings; keep that approach.

- [ ] **Step 1:** Convert `flip-in` by following "How to convert a page" and its content-sheet section; run the checks; commit.
- [ ] **Step 2:** Convert `bounce-in` the same way; run the checks; commit.

---

### Task 10: Check the whole category in a browser

The controller runs this task; its screenshots go to the user.

- [ ] **Step 1:** Run `node tools/check-pages.mjs animations/02-entrance-and-exit/*/` (all thirteen pages). Expected: every line `ok`.
- [ ] **Step 2:** Open each page's desktop and phone screenshots. Expected: the same structure as Rotate In on every page, the animation visible on the stage, settings readable, no overlap.
- [ ] **Step 3:** In the in-app browser, on three pages (one with a slider, one with swatches, one with a text field), change every setting and confirm the chips follow and the demo replays; press Copy prompt and confirm the copied text ends with the settings line.
- [ ] **Step 4:** Anything found goes to one fix dispatch with the complete list; the fixes are reviewed and committed like any task.
