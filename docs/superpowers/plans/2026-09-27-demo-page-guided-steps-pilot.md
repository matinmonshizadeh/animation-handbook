# Guided-Steps Demo Page — Rotate In Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Rotate In demo page as the approved "guided steps" page (Watch it → Try it → Copy the prompt → About → Similar animations) so the user can approve it before every other page follows.

**Architecture:** Two new shared files hold the page chrome: `assets/css/demo-page.css` (layout and look) and `assets/js/demo-page.js` (a UMD script whose pure helpers are unit-tested in Node and whose `boot` adds "Your settings" chips, Copy prompt, the README sections, autoplay and replay-on-change). The Rotate In page is rewritten against that template; its own inline script still drives the animation and wires the player bar and plain-language settings. The first redesign's `handbook.css`/`handbook.js` stay untouched for the other twelve Entrance & Exit pages.

**Tech Stack:** Plain HTML, CSS and vanilla JavaScript (no build step); Node's built-in test runner for tests; headless Chrome or the in-app browser for visual checks.

**Spec:** `docs/superpowers/specs/2026-09-27-demo-page-guided-steps-design.md`

## Global Constraints

- Plain HTML + CSS + vanilla JS only. No build step, no frameworks, no npm packages, no CDN scripts or fonts.
- Only `animations/02-entrance-and-exit/rotate-in/` moves to the new template. The other twelve Entrance & Exit pages, `assets/css/handbook.css`, `assets/js/handbook.js`, `tests/handbook.test.js`, `tools/` and the home page `index.html` stay unchanged.
- New shared files: `assets/css/demo-page.css` and `assets/js/demo-page.js` (UMD: pure helpers exported for Node tests, auto-boot in the browser).
- Layout: one centred column with 960px of content at most; stage height `clamp(300px, 100svh - 420px, 440px)` so the stage and player bar fit on a laptop's first screen, and 300px at ≤ 600px; settings two per row from 760px, one per row below.
- Breakpoints: phone ≤ 600px, tablet 601–1024px, desktop ≥ 1025px.
- Touch targets at least 44×44px on phones; hover rules only inside `@media (hover: hover)`.
- Animate only `transform` and `opacity`; respect `prefers-reduced-motion`.
- Each chip reads `<label>: <value>`. The copied text is the prompt, a blank line, then `Settings from the demo: ` + the chips joined with `, ` + `.`
- The Copy prompt button shows "Copied" for 1.5 seconds; if the clipboard is blocked it selects the prompt and shows "Press Ctrl+C to copy" (or "Press ⌘C to copy" on a Mac).
- Autoplay about 400ms after load (Loop turned on; with reduced motion, Replay is pressed once instead). A setting change replays about 250ms after the last change. Slow motion makes the spins three times slower and leaves the pauses as they are.
- Words on the page are plain; never "stunning", "amazing" or "powerful"; no code anywhere on the page.
- The category colour comes from the page's `--ui-accent` (`#5fd88a` for Entrance & Exit).
- Fonts: Schibsted Grotesk from `assets/fonts/schibsted-latin.woff2` and `assets/fonts/schibsted-latin-ext.woff2`.
- Run tests with `node --test "tests/*.test.js"` from the repo root (`node --test tests/` fails on this machine).
- Commit messages: a lower-case prefix (`feat:`, `test:`, `docs:`, `fix:`) and a plain sentence.

## File structure

| File | Responsibility |
|---|---|
| `assets/js/demo-page.js` (new) | Pure helpers (HTML escaping, the README Markdown subset, See also parsing, the settings line, prompt highlighting) and the page behaviour (`readSettings`, `boot`) |
| `assets/css/demo-page.css` (new) | Fonts, colour tokens, top bar, the column, step headers, stage frame, player bar, switches, settings, More options, prompt card, chips, About, related cards, footer, responsive and reduced-motion rules |
| `tests/demo-page.test.js` (new) | Unit tests for the pure helpers |
| `tests/pages.test.js` (modify) | Accept both layouts; static checks for guided-steps pages |
| `animations/02-entrance-and-exit/rotate-in/index.html` (rewrite) | The pilot page: markup in the new template and the demo's own script |
| `animations/02-entrance-and-exit/rotate-in/README.md` (rewrite) | Key parameters, How it works and See also brought in line with the new settings |

A static server for the site runs at `http://127.0.0.1:8731`. If nothing answers there, start one from the repo root with `python -m http.server 8731 --bind 127.0.0.1` (in the background).

---

### Task 1: Pure helpers for the new page script

**Files:**
- Create: `assets/js/demo-page.js`
- Test: `tests/demo-page.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces: `require('../assets/js/demo-page.js')` in Node, `window.DemoPage` in the browser, with:
  - `escapeHtml(s: string): string`
  - `plain(s: string): string` — Markdown code and bold markers removed, HTML-escaped
  - `isSafeHref(href: string): boolean` — true only for relative paths, `#` anchors and `http(s):` URLs; false for `//host`
  - `inline(md: string): string` — inline Markdown to HTML; code becomes plain text; unsafe links become their label
  - `sections(md: string): { [heading: string]: string }` — README split by `## ` headings
  - `paragraphs(text: string): string` — `<p>` per blank-line-separated block
  - `seeAlso(text: string): Array<{ name: string, href: string, desc: string }>`
  - `settingsLine(items: Array<{ label: string, value: string }>): string` — `"Speed: Normal, Fades in: on"`
  - `markFill(text: string): string` — escaped HTML with each `[...]` wrapped in `<mark class="hb-fill">`

- [ ] **Step 1: Write the failing tests**

Create `tests/demo-page.test.js`:

```js
// Unit tests for the pure helpers in assets/js/demo-page.js.
// Run from the repo root: node --test "tests/*.test.js"
const test = require('node:test');
const assert = require('node:assert/strict');
const DP = require('../assets/js/demo-page.js');

test('escapeHtml escapes markup characters', () => {
  assert.equal(DP.escapeHtml('<a href="x">&</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;');
});

test('plain drops code and bold markers and escapes', () => {
  assert.equal(DP.plain('`ease-out` **fast** <b>'), 'ease-out fast &lt;b&gt;');
});

test('isSafeHref allows relative, anchor and http(s) links only', () => {
  for (const ok of ['../scale-in/', 'README.md', '#top', '/animation-handbook/', 'https://example.com/p', 'http://example.com']) {
    assert.equal(DP.isSafeHref(ok), true, ok);
  }
  for (const bad of ['javascript:alert(1)', 'data:text/html,x', '//evil.example/x', 'mailto:a@b.c']) {
    assert.equal(DP.isSafeHref(bad), false, bad);
  }
});

test('inline shows code as plain text and renders links, bold and italics', () => {
  assert.equal(DP.inline('Use `opacity` on **one** *hero* [card](../scale-in/)'),
    'Use opacity on <strong>one</strong> <em>hero</em> <a href="../scale-in/">card</a>');
  assert.equal(DP.inline('a < b'), 'a &lt; b');
});

test('inline links only safe targets and keeps parentheses around links', () => {
  assert.ok(!DP.inline('[x](javascript:alert(1))').includes('<a'), 'no link for javascript: URLs');
  assert.ok(!DP.inline('[x](//evil.example/)').includes('<a'), 'no link for protocol-relative URLs');
  assert.equal(DP.inline('[a](https://example.com/p)'), '<a href="https://example.com/p">a</a>');
  assert.equal(DP.inline('(see [Scale In](../scale-in/))'), '(see <a href="../scale-in/">Scale In</a>)');
});

test('sections splits a README by its ## headings', () => {
  const md = '# Title\r\n\r\n## What it is\r\nLine one\r\nline two\r\n\r\n## When to use it\r\n- A\r\n- B\r\n';
  assert.deepEqual(DP.sections(md), { 'What it is': 'Line one\nline two', 'When to use it': '- A\n- B' });
});

test('sections keeps ### lines inside the section they belong to', () => {
  assert.deepEqual(DP.sections('## A\n### not a section\nx'), { A: '### not a section\nx' });
});

test('paragraphs joins wrapped lines and splits on blank lines', () => {
  assert.equal(DP.paragraphs('One\ntwo.\n\nThree `x`.'), '<p>One two.</p><p>Three x.</p>');
  assert.equal(DP.paragraphs(undefined), '');
});

test('seeAlso reads name, link and description', () => {
  const md = '- [Scale In](../scale-in/) — grows from small, with no spin\n- [Blur In](../blur-in/)\nText';
  assert.deepEqual(DP.seeAlso(md), [
    { name: 'Scale In', href: '../scale-in/', desc: 'grows from small, with no spin' },
    { name: 'Blur In', href: '../blur-in/', desc: '' }
  ]);
});

test('settingsLine writes "label: value" pairs and skips incomplete ones', () => {
  assert.equal(DP.settingsLine([
    { label: 'Speed', value: 'Normal' }, { label: 'Fades in', value: 'on' },
    { label: 'Mode', value: '' }, { label: '', value: 'x' }
  ]), 'Speed: Normal, Fades in: on');
  assert.equal(DP.settingsLine([]), '');
  assert.equal(DP.settingsLine(undefined), '');
});

test('markFill highlights the parts in square brackets and escapes the rest', () => {
  assert.equal(DP.markFill('Add it to [the icon you want] & <go>.'),
    'Add it to <mark class="hb-fill">[the icon you want]</mark> &amp; &lt;go&gt;.');
  assert.equal(DP.markFill('No brackets here.'), 'No brackets here.');
});
```

- [ ] **Step 2: Run the tests to see them fail**

Run: `node --test "tests/*.test.js"`
Expected: `tests/demo-page.test.js` fails with `Cannot find module '../assets/js/demo-page.js'`; the other test files still pass.

- [ ] **Step 3: Write the helpers**

Create `assets/js/demo-page.js`:

```js
/* Animation Handbook — shared behaviour for the guided-steps demo pages.
 * The pure helpers are exported for tests/demo-page.test.js. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) { module.exports = api; return; }
  root.DemoPage = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------- Pure helpers ---------- */

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Text with Markdown code and bold markers removed, safe to insert as HTML.
  function plain(s) {
    return escapeHtml(String(s).replace(/`/g, '').replace(/\*\*/g, ''));
  }

  // Only relative paths, "#" anchors and http(s) URLs are link targets. Anything else, including
  // protocol-relative "//host" links, is rendered as plain text instead.
  function isSafeHref(href) {
    href = String(href);
    return /^(?:https?:|#|\.{0,2}\/|[\w.-]+(?:\/|$))/i.test(href) && !/^\/\//.test(href) &&
      !/^[a-z][a-z0-9+.-]*:/i.test(href.replace(/^https?:/i, ''));
  }

  // Inline Markdown from README prose. Inline code becomes plain text: the site shows no code.
  function inline(md) {
    return escapeHtml(md)
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, label, href) {
        return isSafeHref(href) ? '<a href="' + href + '">' + label + '</a>' : label;
      })
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  }

  // A README split into { "What it is": "...", ... } by its "## " headings.
  function sections(md) {
    var out = {}, current = null, buf = [];
    String(md).replace(/\r\n?/g, '\n').split('\n').forEach(function (line) {
      var m = /^##\s+(.+?)\s*$/.exec(line);
      if (m) {
        if (current) out[current] = buf.join('\n').trim();
        current = m[1];
        buf = [];
      } else if (current) {
        buf.push(line);
      }
    });
    if (current) out[current] = buf.join('\n').trim();
    return out;
  }

  function paragraphs(text) {
    return String(text || '').split(/\n\s*\n/)
      .map(function (p) { return p.trim(); })
      .filter(Boolean)
      .map(function (p) { return '<p>' + inline(p.replace(/\s*\n\s*/g, ' ')) + '</p>'; })
      .join('');
  }

  // "- [Name](../slug/) — description" lines as [{ name, href, desc }].
  function seeAlso(text) {
    return String(text || '').split('\n').map(function (l) {
      var m = /^\s*[-*]\s+\[([^\]]+)\]\(([^)\s]+)\)\s*(?:[—–-]\s*(.*))?$/.exec(l);
      return m ? { name: plain(m[1]), href: m[2], desc: m[3] ? inline(m[3]) : '' } : null;
    }).filter(Boolean);
  }

  // [{ label: 'Speed', value: 'Normal' }, ...] as "Speed: Normal, ...", skipping incomplete pairs.
  function settingsLine(items) {
    return (items || [])
      .filter(function (i) { return i && i.label && i.value; })
      .map(function (i) { return i.label + ': ' + i.value; })
      .join(', ');
  }

  // The prompt as HTML with each [part to fill in] highlighted.
  function markFill(text) {
    return escapeHtml(text).replace(/\[[^\]\n]+\]/g, function (part) {
      return '<mark class="hb-fill">' + part + '</mark>';
    });
  }

  return {
    escapeHtml: escapeHtml, plain: plain, isSafeHref: isSafeHref, inline: inline, sections: sections,
    paragraphs: paragraphs, seeAlso: seeAlso, settingsLine: settingsLine, markFill: markFill
  };
});
```

- [ ] **Step 4: Run the tests to see them pass**

Run: `node --test "tests/*.test.js"`
Expected: every test passes (the 62 existing ones plus the 11 new ones in `tests/demo-page.test.js`).

- [ ] **Step 5: Commit**

```bash
git add assets/js/demo-page.js tests/demo-page.test.js
git commit -m "feat: add the helpers for the guided-steps demo page"
```

---

### Task 2: The page stylesheet and the Rotate In page

**Files:**
- Create: `assets/css/demo-page.css`
- Rewrite: `animations/02-entrance-and-exit/rotate-in/index.html`
- Rewrite: `animations/02-entrance-and-exit/rotate-in/README.md`
- Rewrite: `tests/pages.test.js`

**Interfaces:**
- Consumes: `assets/js/demo-page.js` from Task 1 (the page links it; until Task 3 it only defines `window.DemoPage`).
- Produces, for Task 3 (the shared script relies on these exact class names and markers):
  - `<main class="hb-page">` wrapping everything between the top bar and the footer
  - `<section class="hb-step hb-watch">` containing `.stage` and `<div class="hb-player">` with `[data-hb-replay]` (button), `input[data-hb-loop]` and `input[data-hb-slowmo]` (checkboxes)
  - `<section class="hb-step hb-try">` containing every setting; settings inside `<details class="hb-options">` count too
  - `<p class="hb-prompt">` (plain text only), `<div class="hb-chips-box" hidden>` with `<ul class="hb-chips">`, `<button class="hb-copy" type="button">` with `<span class="hb-copy-label">`
  - `<div class="hb-what-text">` (starts with a link to README.md), `<section class="hb-related" hidden>` with `<div class="hb-rel-list">`
  - CSS hooks the script toggles: `.hb-prompt.is-clamped`, `.hb-prompt-more`, `.hb-copy.is-done`, `mark.hb-fill`, `a.hb-rel` (with `<b>` name and `<span>` description)
  - The demo's Replay button restarts the animation and keeps looping when Loop is on; switching Loop on starts looping; Slow motion takes effect on the next play.

- [ ] **Step 1: Write the failing page checks**

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

const demos = fs.readdirSync(ANIM, { withFileTypes: true }).filter(c => c.isDirectory()).flatMap(c =>
  fs.readdirSync(path.join(ANIM, c.name), { withFileTypes: true }).filter(d => d.isDirectory())
    .map(d => ({ cat: c.name, slug: d.name, dir: path.join(ANIM, c.name, d.name) })));
const pageOf = d => read(path.join(d.dir, 'index.html'));
const converted = demos.filter(d => pageOf(d).includes('<main class="hb-view">'));
const steps = demos.filter(d => pageOf(d).includes('<main class="hb-page">'));

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
    assert.match(html, /<body class="hb"( data-hb-autoplay)?>/);
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
    assert.equal(count(html, 'data-hb-replay'), 1, 'one Replay control');
    assert.ok(player.includes('data-hb-replay'), 'Replay is in the player bar');
    for (const marker of ['data-hb-loop', 'data-hb-slowmo']) {
      assert.ok(count(html, marker) <= 1, `at most one ${marker}`);
      assert.equal(count(player, marker), count(html, marker), `${marker} is in the player bar`);
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

  test(`${d.slug}: every Key parameters name is a setting in Try it`, () => {
    const tryIt = between(pageOf(d), '<section class="hb-step hb-try"', '<section class="hb-step hb-prompt-step"')
      .replace(/<[^>]+>/g, ' ');
    const rows = sections(read(path.join(d.dir, 'README.md')))['Key parameters'].split('\n').slice(2);
    for (const row of rows) {
      const name = (row.split('|')[1] || '').trim();
      if (name) assert.ok(tryIt.includes(name), `setting "${name}"`);
    }
  });
}

const PILOT_SLUGS = ['fade-in-out', 'slide-in', 'slide-up-reveal', 'scale-in', 'clip-path-reveal', 'curtain-reveal',
  'split-text-reveal', 'letter-by-letter-stagger', 'word-by-word-reveal', 'blur-in', 'flip-in', 'bounce-in', 'rotate-in'];

for (const slug of PILOT_SLUGS) {
  test(`README for ${slug} is ready for the site`, () => {
    const dir = path.join(ANIM, PILOT, slug);
    const s = sections(read(path.join(dir, 'README.md')));
    for (const h of ['What it is', 'When to use it', 'Key parameters', 'See also']) assert.ok(s[h], `section ${h}`);
    assert.ok(!s['What it is'].includes('`'), 'What it is has no code');
    assert.ok(!s['Key parameters'].includes('`'), 'Key parameters has no code');
    assert.ok(table(s['Key parameters']).length > 0, 'Key parameters has rows');
    for (const [, href] of s['See also'].matchAll(/\]\(([^)\s]+)\)/g)) {
      assert.ok(isDemoDir(path.resolve(dir, href)), `See also link ${href}`);
    }
  });
}

for (const d of converted.filter(c => c.cat === PILOT)) {
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
  const html = read(path.join(ROOT, 'index.html'));
  assert.ok(html.includes("url('assets/fonts/schibsted-latin.woff2')"), 'Latin font file');
  assert.ok(html.includes("url('assets/fonts/schibsted-latin-ext.woff2')"), 'Latin Extended font file');
  for (const old of ['Bricolage', 'PlexMono', 'var(--mono)', '--mono:']) assert.ok(!html.includes(old), `still uses ${old}`);
  assert.ok(html.includes('See 129 web animations move, learn when to use each one, and copy a prompt to build it.'));
});
```

- [ ] **Step 2: Run the tests to see the new check fail**

Run: `node --test "tests/*.test.js"`
Expected: exactly one failure, `Rotate In uses the guided-steps page`; everything else passes.

- [ ] **Step 3: Create the page stylesheet**

Create `assets/css/demo-page.css`:

```css
/* Animation Handbook — page chrome for the guided-steps demo pages.
   Linked after each demo's own <style>, so these rules win where they overlap.
   The animation keeps its own styles; this file lays out the page around it:
   top bar, header, the three steps, About, related cards and footer. */

@font-face{font-family:'Schibsted Grotesk';src:url('../fonts/schibsted-latin-ext.woff2') format('woff2');font-weight:400 900;font-style:normal;font-display:swap;
  unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:'Schibsted Grotesk';src:url('../fonts/schibsted-latin.woff2') format('woff2');font-weight:400 900;font-style:normal;font-display:swap;
  unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}

:root{
  --hb-font:'Schibsted Grotesk',system-ui,-apple-system,'Segoe UI',sans-serif;
  --disp:var(--hb-font);--mono:var(--hb-font);
  --hb-bg:#0b0b0d;--hb-panel:#111114;
  --hb-ink:#f4f4f2;--hb-text:#e6e6e8;--hb-soft:#d6d6da;--hb-dim:#adadb2;--hb-muted:#8a8a92;
  --hb-line:rgba(255,255,255,.085);--hb-edge:rgba(255,255,255,.16);--hb-edge-2:rgba(255,255,255,.36);
  --hb-accent:var(--ui-accent,#6ea8ff);--hb-bar:56px;
}

body.hb{margin:0;padding:0;background:var(--hb-bg);color:var(--hb-ink);font-family:var(--hb-font);-webkit-font-smoothing:antialiased}
body.hb :focus-visible{outline:2px solid var(--hb-accent);outline-offset:3px}
/* Demo styles often set display on their own classes; keep the hidden attribute authoritative. */
body.hb [hidden]{display:none!important}
.hb-ic{width:18px;height:18px;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}

/* Top bar */
.hb-bar{position:sticky;top:0;z-index:50;box-sizing:border-box;height:var(--hb-bar);display:flex;align-items:center;justify-content:space-between;gap:12px;
  padding:0 clamp(8px,3vw,40px);background:rgba(11,11,13,.9);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-bottom:1px solid var(--hb-line)}
.hb-bar a{display:inline-flex;align-items:center;gap:8px;min-height:44px;min-width:44px;padding:0 8px;border-radius:8px;color:var(--hb-dim);
  text-decoration:none;font:500 15px/1 var(--hb-font)}
.hb-bar .hb-home{color:var(--hb-ink);font-weight:700;font-size:16px;letter-spacing:-.01em}
.hb-mark{width:26px;height:26px;flex:none}
.hb-mark .g{fill:var(--hb-bg);stroke:var(--hb-ink);stroke-width:1.8}
.hb-mark .b{fill:var(--hb-ink)}
.hb-pager{display:flex;gap:4px}
.hb-bar .hb-ic{width:16px;height:16px}

/* The page: one centred column */
.hb-page{box-sizing:border-box;width:100%;max-width:1040px;margin:0 auto;
  padding:clamp(24px,4vw,40px) clamp(16px,4vw,40px) clamp(40px,6vw,64px);display:flex;flex-direction:column;gap:clamp(32px,4vw,40px)}
.hb-head{margin:0;display:flex;flex-direction:column;gap:8px}
.hb-cat{margin:0;font:600 14px/1.3 var(--hb-font);letter-spacing:.04em;color:var(--hb-accent)}
.hb-page h1{margin:0;font:800 clamp(40px,6vw,64px)/1 var(--hb-font);letter-spacing:-.035em;color:var(--hb-ink)}
.hb-lede{margin:0;font:400 clamp(17px,2vw,20px)/1.5 var(--hb-font);color:var(--hb-dim)}

/* Steps */
.hb-step{display:flex;flex-direction:column;gap:clamp(16px,2.4vw,24px)}
.hb-step+.hb-step{padding-top:clamp(28px,4vw,36px);border-top:1px solid var(--hb-line)}
.hb-watch{gap:16px}
.hb-step-head{display:flex;align-items:flex-start;gap:14px}
.hb-num{flex:none;display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;
  background:var(--hb-accent);color:#0b0b0d;font:800 16px/1 var(--hb-font)}
.hb-step-head h2{margin:0;font:700 clamp(22px,2.6vw,26px)/1.2 var(--hb-font);letter-spacing:-.015em;color:var(--hb-ink)}
.hb-step-head p{margin:4px 0 0;font:400 16px/1.5 var(--hb-font);color:var(--hb-dim)}

/* Step 1: stage and player bar. 420px is roughly everything above and below the stage on the
   first screen, so on a laptop the stage and the player bar are both visible on arrival. */
.hb-page .stage{box-sizing:border-box;width:100%;min-width:0;min-height:0;margin:0;flex:none;
  height:clamp(300px,calc(100vh - 420px),440px);height:clamp(300px,calc(100svh - 420px),440px);
  border:1px solid rgba(255,255,255,.1);border-radius:12px;overflow:hidden}
.hb-page .stage.hb-dots{background-image:radial-gradient(rgba(255,255,255,.075) 1px,transparent 1.5px);background-size:24px 24px;background-position:center}
.hb-player{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
.hb-play,.hb-toggle{box-sizing:border-box;display:inline-flex;align-items:center;gap:10px;min-height:44px;padding:0 18px;
  border:1px solid rgba(255,255,255,.18);border-radius:8px;background:none;color:var(--hb-ink);font:500 15px/1 var(--hb-font);cursor:pointer}

/* Switches: a checkbox drawn as a track and knob (gradients, so no pseudo-elements on the input) */
.hb-switch{appearance:none;-webkit-appearance:none;flex:none;width:32px;height:20px;margin:0;border-radius:999px;cursor:pointer;
  background:radial-gradient(circle at 10px 50%,var(--hb-ink) 6.5px,transparent 7px) rgba(255,255,255,.22)}
.hb-switch:checked{background:radial-gradient(circle at 22px 50%,#0b0b0d 6.5px,transparent 7px) var(--hb-accent)}
.hb-toggle:has(:focus-visible),.hb-switch-row:has(:focus-visible){outline:2px solid var(--hb-accent);outline-offset:3px}
.hb-toggle .hb-switch:focus-visible,.hb-switch-row .hb-switch:focus-visible{outline:none}

/* Step 2: settings */
.hb-settings{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px 32px}
.hb-setting{display:flex;flex-direction:column;gap:10px;min-width:0}
.hb-setting-name{margin:0;font:600 17px/1.3 var(--hb-font);color:var(--hb-ink)}
.hb-hint{margin:0;font:400 14px/1.45 var(--hb-font);color:var(--hb-muted)}
.hb-page .seg{display:flex;flex-wrap:wrap;gap:8px}
.hb-page .seg button{box-sizing:border-box;min-height:44px;padding:0 16px;border:1px solid var(--hb-edge);border-radius:8px;background:none;
  color:var(--hb-soft);font:500 15px/1.2 var(--hb-font);cursor:pointer;transition:background-color .15s,border-color .15s,color .15s}
.hb-page .seg button.on,.hb-page .seg button[aria-pressed="true"]{border-color:var(--hb-accent);color:var(--hb-accent);
  background:color-mix(in srgb,var(--hb-accent) 12%,transparent)}
.hb-switch-row{box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:52px;padding:0 16px;
  border:1px solid rgba(255,255,255,.14);border-radius:8px;font:500 15px/1.3 var(--hb-font);color:var(--hb-ink);cursor:pointer}
.hb-options>summary{display:inline-flex;align-items:center;gap:6px;min-height:44px;list-style:none;cursor:pointer;
  font:600 15px/1 var(--hb-font);color:var(--hb-accent)}
.hb-options>summary::-webkit-details-marker{display:none}
.hb-options>summary .hb-ic{transition:transform .2s}
.hb-options[open]>summary .hb-ic{transform:rotate(180deg)}
.hb-options .hb-less,.hb-options[open] .hb-more-label{display:none}
.hb-options[open] .hb-less{display:inline}
.hb-options>.hb-settings{margin-top:16px}

/* Step 3: the prompt card */
.hb-card{display:flex;flex-direction:column;gap:20px;padding:clamp(18px,3vw,28px);border:1px solid rgba(255,255,255,.12);border-radius:12px;background:var(--hb-panel)}
.hb-prompt{margin:0;font:400 17px/1.65 var(--hb-font);color:var(--hb-text)}
.hb-fill{padding:1px 5px;border-radius:4px;background:rgba(255,255,255,.1);color:var(--hb-ink)}
.hb-prompt-more{display:none;align-self:flex-start;min-height:44px;margin-top:-12px;padding:0;border:0;background:none;
  color:var(--hb-accent);font:600 15px/1 var(--hb-font);cursor:pointer}
.hb-chips-box{display:flex;flex-direction:column;gap:10px}
.hb-chips-title{margin:0;font:400 14px/1.4 var(--hb-font);color:var(--hb-muted)}
.hb-chips{display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0;list-style:none}
.hb-chips li{padding:6px 12px;border-radius:999px;background:color-mix(in srgb,var(--hb-accent) 12%,transparent);color:var(--hb-accent);
  font:500 14px/1.3 var(--hb-font)}
.hb-copy-row{display:flex;flex-wrap:wrap;align-items:center;gap:12px 20px}
.hb-copy-row .hb-hint{flex:1 1 260px}
.hb-copy{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:52px;padding:0 26px;border:0;
  border-radius:8px;background:var(--hb-ink);color:#0b0b0d;font:700 16px/1 var(--hb-font);cursor:pointer}
.hb-copy .hb-i-done,.hb-copy.is-done .hb-i-copy{display:none}
.hb-copy.is-done .hb-i-done{display:inline}

/* About and related animations */
.hb-about{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(24px,5vw,48px);padding-top:clamp(28px,4vw,36px);
  border-top:1px solid var(--hb-line)}
.hb-about h2,.hb-related h2{margin:0 0 12px;font:700 22px/1.2 var(--hb-font);letter-spacing:-.01em;color:var(--hb-ink)}
.hb-about h3{margin:20px 0 12px;font:600 16px/1.3 var(--hb-font);color:var(--hb-dim)}
.hb-what-text p{margin:0;font:400 16px/1.7 var(--hb-font);color:var(--hb-dim)}
.hb-what-text p+p{margin-top:12px}
.hb-what-text a{color:var(--hb-ink)}
.hb-tags{display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0;list-style:none}
.hb-tags li{padding:8px 14px;border:1px solid rgba(255,255,255,.14);border-radius:999px;font:400 15px/1.2 var(--hb-font);color:var(--hb-soft)}
.hb-avoid li{border-style:dashed;color:var(--hb-muted)}
.hb-rel-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}
.hb-rel{display:flex;flex-direction:column;gap:6px;padding:18px 20px;border:1px solid rgba(255,255,255,.12);border-radius:10px;text-decoration:none}
.hb-rel b{font:700 18px/1.25 var(--hb-font);color:var(--hb-ink)}
.hb-rel span{font:400 14px/1.45 var(--hb-font);color:var(--hb-muted)}

/* Footer */
.hb-foot{box-sizing:border-box;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 16px;
  padding:16px clamp(16px,4vw,40px) 24px;border-top:1px solid var(--hb-line);font:400 14px/1.4 var(--hb-font);color:var(--hb-muted)}
.hb-foot a{display:inline-flex;align-items:center;min-height:44px;color:var(--hb-dim);text-decoration:none}

@media(hover:hover){
  .hb-bar a:hover{color:var(--hb-ink)}
  .hb-play:hover,.hb-toggle:hover,.hb-switch-row:hover{border-color:var(--hb-edge-2)}
  .hb-page .seg button:hover{border-color:rgba(255,255,255,.34);color:var(--hb-ink)}
  .hb-page .seg button.on:hover,.hb-page .seg button[aria-pressed="true"]:hover{border-color:var(--hb-accent);color:var(--hb-accent)}
  .hb-options>summary:hover,.hb-prompt-more:hover{color:color-mix(in srgb,var(--hb-accent) 70%,#fff)}
  .hb-copy:hover{background:#fff}
  .hb-rel:hover{border-color:color-mix(in srgb,var(--hb-accent) 55%,transparent)}
  .hb-foot a:hover{color:var(--hb-ink)}
}

@media(max-width:759px){
  .hb-settings,.hb-about{grid-template-columns:minmax(0,1fr)}
}
@media(max-width:600px){
  .hb-bar .hb-dir{display:none}
  .hb-page .stage{height:300px}
  .hb-step-head{gap:12px}
  .hb-num{width:30px;height:30px;font-size:15px}
  .hb-step-head p{font-size:15px}
  .hb-player{gap:8px}
  .hb-play,.hb-toggle{gap:8px;padding:0 12px;font-size:14px}
  .hb-page .seg button{flex:1 1 0;min-width:0;padding:0 8px}
  .hb-prompt{font-size:16px;line-height:1.6}
  .hb-prompt.is-clamped{display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden}
  .hb-prompt-more{display:inline-flex;align-items:center}
  .hb-copy{width:100%}
}
@media(prefers-reduced-motion:reduce){
  .hb-page .seg button,.hb-options>summary .hb-ic{transition:none}
}
```

- [ ] **Step 4: Rewrite the Rotate In page**

Replace `animations/02-entrance-and-exit/rotate-in/index.html` with:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rotate In — Animation Handbook</title>
  <meta name="description" content="Spins into place while it grows. Best for icons, stars and badges.">
  <link rel="canonical" href="https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/rotate-in/">
  <link rel="icon" type="image/png" sizes="96x96" href="../../../favicon.png">
  <link rel="icon" type="image/svg+xml" href="../../../favicon.svg">
  <link rel="apple-touch-icon" href="../../../apple-touch-icon.png">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Animation Handbook">
  <meta property="og:title" content="Rotate In — Animation Handbook">
  <meta property="og:description" content="Spins into place while it grows. Best for icons, stars and badges.">
  <meta property="og:url" content="https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/rotate-in/">
  <meta property="og:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Rotate In — Animation Handbook">
  <meta name="twitter:description" content="Spins into place while it grows. Best for icons, stars and badges.">
  <meta name="twitter:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <script type="application/ld+json">{"@context": "https://schema.org", "@type": "TechArticle", "headline": "Rotate In", "name": "Rotate In", "description": "Spins into place while it grows. Best for icons, stars and badges.", "url": "https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/rotate-in/", "inLanguage": "en", "articleSection": "Entrance & Exit", "isPartOf": {"@type": "WebSite", "name": "Animation Handbook", "url": "https://matinmonshizadeh.github.io/animation-handbook/"}, "author": {"@type": "Person", "name": "matinmonshizadeh"}, "keywords": "web animation, CSS animation, Entrance & Exit, Rotate In"}</script>
  <style>
    :root{--ui-accent:#5fd88a;--dur:600ms;--ease:cubic-bezier(.34,1.56,.64,1);--rot-start:-180deg;--scale-start:0;--opacity-dur:var(--dur)}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    .stage{display:flex;align-items:center;justify-content:center;background:#0b0b0d}
    .icon{width:150px;height:150px;display:flex;align-items:center;justify-content:center;
      opacity:0;transform:rotate(var(--rot-start)) scale(var(--scale-start));
      transition:transform var(--dur) var(--ease),opacity var(--opacity-dur) var(--ease);will-change:transform,opacity}
    .icon.in{opacity:1;transform:rotate(0deg) scale(1)}
    .icon svg{width:100%;height:100%}
    @media(prefers-reduced-motion:reduce){.icon{transition:opacity 300ms linear!important;transform:none!important}}
  </style>
  <link rel="stylesheet" href="../../../assets/css/demo-page.css">
  <script src="../../../assets/js/demo-page.js" defer></script>
</head>
<body class="hb" data-hb-autoplay>
<nav class="hb-bar" aria-label="Animation Handbook">
  <a class="hb-home" href="../../../"><svg class="hb-mark" viewBox="0 0 32 32" aria-hidden="true"><g class="g"><circle cx="11.16" cy="20.84" r="6.1"/><circle cx="15.12" cy="16.88" r="6.1"/><circle cx="18.51" cy="13.49" r="6.1"/></g><circle class="b" cx="21.2" cy="10.8" r="6.6"/></svg><span>Animation Handbook</span></a>
  <span class="hb-pager"><a href="../bounce-in/" rel="prev" aria-label="Previous: Bounce In"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg><span class="hb-dir">Previous:</span> <span class="hb-name">Bounce In</span></a></span>
</nav>
<main class="hb-page">
  <header class="hb-head">
    <p class="hb-cat">02.13 · Entrance &amp; Exit</p>
    <h1>Rotate In</h1>
    <p class="hb-lede">Spins into place while it grows. Best for icons, stars and badges.</p>
  </header>

  <section class="hb-step hb-watch" aria-labelledby="hb-watch-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">1</span>
      <div><h2 id="hb-watch-title">Watch it</h2><p>It plays by itself. Turn on slow motion to see each part of the movement.</p></div>
    </div>
    <div class="stage hb-dots">
      <div class="icon" id="icon" role="img" aria-label="A round icon spinning into place">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="50" cy="50" r="18" fill="#58a6ff" opacity=".9"/>
          <circle cx="50" cy="50" r="28" stroke="#58a6ff" stroke-width="3" opacity=".4"/>
          <path d="M50 14 L54 22 L63 20 L60 29 L68 33 L60 37 L63 46 L54 44 L50 52 L46 44 L37 46 L40 37 L32 33 L40 29 L37 20 L46 22Z" fill="#58a6ff" opacity=".7"/>
        </svg>
      </div>
    </div>
    <div class="hb-player">
      <button class="hb-play" type="button" id="btn-play" data-hb-replay><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>Replay</button>
      <label class="hb-toggle"><input class="hb-switch" type="checkbox" role="switch" id="loop-tog" data-hb-loop><span>Loop</span></label>
      <label class="hb-toggle"><input class="hb-switch" type="checkbox" role="switch" id="slow-tog" data-hb-slowmo><span>Slow motion</span></label>
    </div>
  </section>

  <section class="hb-step hb-try" aria-labelledby="hb-try-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">2</span>
      <div><h2 id="hb-try-title">Try it</h2><p>Change a setting and the animation plays again.</p></div>
    </div>
    <div class="hb-settings">
      <div class="hb-setting">
        <p class="hb-setting-name" id="spin-lbl">How much it spins</p>
        <div class="seg" id="spin-seg" role="group" aria-labelledby="spin-lbl">
          <button type="button" data-turn="90" aria-pressed="false">¼ turn</button>
          <button type="button" data-turn="180" class="on" aria-pressed="true">½ turn</button>
          <button type="button" data-turn="360" aria-pressed="false">Full turn</button>
        </div>
        <p class="hb-hint">A bigger spin feels more playful.</p>
      </div>
      <div class="hb-setting">
        <p class="hb-setting-name" id="speed-lbl">Speed</p>
        <div class="seg" id="speed-seg" role="group" aria-labelledby="speed-lbl">
          <button type="button" data-ms="1000" aria-pressed="false">Slow</button>
          <button type="button" data-ms="600" class="on" aria-pressed="true">Normal</button>
          <button type="button" data-ms="350" aria-pressed="false">Fast</button>
        </div>
        <p class="hb-hint">Slow is easy to follow. Fast feels snappy.</p>
      </div>
    </div>
    <details class="hb-options">
      <summary><span class="hb-more-label">More options</span><span class="hb-less">Fewer options</span><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary>
      <div class="hb-settings">
        <div class="hb-setting">
          <p class="hb-setting-name" id="dir-lbl">Spin direction</p>
          <div class="seg" id="dir-seg" role="group" aria-labelledby="dir-lbl">
            <button type="button" data-dir="-1" class="on" aria-pressed="true">Clockwise</button>
            <button type="button" data-dir="1" aria-pressed="false">Counter-clockwise</button>
          </div>
          <p class="hb-hint">Which way it turns as it lands.</p>
        </div>
        <div class="hb-setting">
          <label class="hb-switch-row"><span>Bounce at the end</span><input class="hb-switch" type="checkbox" role="switch" id="bounce-tog" checked></label>
          <p class="hb-hint">Goes slightly too far, then settles.</p>
        </div>
        <div class="hb-setting">
          <label class="hb-switch-row"><span>Grows from small</span><input class="hb-switch" type="checkbox" role="switch" id="scale-tog" checked></label>
          <p class="hb-hint">Makes the spin look like an arrival.</p>
        </div>
        <div class="hb-setting">
          <label class="hb-switch-row"><span>Fades in</span><input class="hb-switch" type="checkbox" role="switch" id="fade-tog" checked></label>
          <p class="hb-hint">Softens the first moment.</p>
        </div>
      </div>
    </details>
  </section>

  <section class="hb-step hb-prompt-step" aria-labelledby="hb-prompt-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">3</span>
      <div><h2 id="hb-prompt-title">Copy the prompt</h2><p>Paste it into an AI assistant such as ChatGPT, Claude or Cursor to build this in your own project.</p></div>
    </div>
    <div class="hb-card">
      <p class="hb-prompt">Add a rotate-in entrance to [the icon or badge you want to animate]. It should spin around its center as it appears. Growing from small at the same time makes it look like it is arriving rather than just turning, and a slight overshoot at the end makes the spin land instead of gliding to a stop. Use this on round or symmetric shapes like icons, stars, gears and badges; it looks wrong on text or wide rectangles. If the visitor has reduced motion turned on, show it in place without spinning. Match the settings listed below.</p>
      <div class="hb-chips-box" hidden>
        <p class="hb-chips-title">Your settings</p>
        <ul class="hb-chips"></ul>
      </div>
      <div class="hb-copy-row">
        <button class="hb-copy" type="button"><svg class="hb-ic hb-i-copy" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><svg class="hb-ic hb-i-done" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span class="hb-copy-label" aria-live="polite">Copy prompt</span></button>
        <p class="hb-hint">Replace the words in brackets with your own element. Your settings are added at the end.</p>
      </div>
    </div>
  </section>

  <section class="hb-about" aria-labelledby="hb-what-title">
    <div class="hb-what">
      <h2 id="hb-what-title">What it is</h2>
      <div class="hb-what-text"><p>The full explanation is in <a href="README.md">README.md</a>.</p></div>
    </div>
    <div class="hb-fit">
      <h2>Good for</h2>
      <ul class="hb-tags hb-good"><li>Icons</li><li>Badges and stars</li><li>Logos</li><li>Small decorations</li></ul>
      <h3>Avoid on</h3>
      <ul class="hb-tags hb-avoid"><li>Text</li><li>Wide boxes and cards</li></ul>
    </div>
  </section>

  <section class="hb-related" aria-labelledby="hb-related-title" hidden>
    <h2 id="hb-related-title">Similar animations</h2>
    <div class="hb-rel-list"></div>
  </section>
</main>
<footer class="hb-foot"><span>Animation Handbook</span><a href="#top">Back to top ↑</a></footer>
<script>
  const icon=document.getElementById('icon');
  const vars=document.documentElement.style;
  const loopTog=document.getElementById('loop-tog'),slowTog=document.getElementById('slow-tog');
  const bounceTog=document.getElementById('bounce-tog'),scaleTog=document.getElementById('scale-tog'),fadeTog=document.getElementById('fade-tog');
  const motionOk=!window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const SPRINGY='cubic-bezier(.34,1.56,.64,1)',SMOOTH='cubic-bezier(.2,.7,.3,1)';
  let turn=180,ms=600,dir=-1,timers=[];

  function dur(){return slowTog.checked?ms*3:ms}
  function apply(){
    vars.setProperty('--rot-start',dir*turn+'deg');
    vars.setProperty('--dur',dur()+'ms');
    vars.setProperty('--ease',bounceTog.checked?SPRINGY:SMOOTH);
    vars.setProperty('--scale-start',scaleTog.checked?'0':'1');
    vars.setProperty('--opacity-dur',fadeTog.checked?'var(--dur)':'0s');
  }
  function later(fn,wait){timers.push(setTimeout(fn,wait))}
  function spinIn(){
    // snap back to the starting pose without a transition so every play starts from the beginning
    icon.style.setProperty('transition','none','important');
    icon.classList.remove('in');void icon.offsetWidth;
    icon.style.removeProperty('transition');
    icon.classList.add('in');
  }
  // One play spins in. While Loop is on it then waits, spins out, waits and plays again;
  // switching Loop off lets the icon finish landed. Slow motion stretches the spins, not the waits.
  function cycle(){
    apply();spinIn();
    if(!loopTog.checked||!motionOk)return;
    later(()=>{
      if(!loopTog.checked)return;
      icon.classList.remove('in');
      later(cycle,dur()+500);
    },dur()+900);
  }
  function play(){timers.forEach(clearTimeout);timers=[];cycle()}

  document.getElementById('btn-play').addEventListener('click',play);
  loopTog.addEventListener('change',()=>{if(loopTog.checked)play()});
  function choices(id,pick){
    const buttons=document.querySelectorAll('#'+id+' button');
    buttons.forEach(b=>b.addEventListener('click',()=>{
      buttons.forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',String(x===b))});
      pick(b.dataset);
    }));
  }
  choices('spin-seg',d=>{turn=+d.turn});
  choices('speed-seg',d=>{ms=+d.ms});
  choices('dir-seg',d=>{dir=+d.dir});
  apply();
</script>
</body>
</html>
```

- [ ] **Step 5: Rewrite the Rotate In README**

Replace `animations/02-entrance-and-exit/rotate-in/README.md` with:

````markdown
# Rotate In

## What it is

Rotate In spins an element around its center as it enters, usually while it grows from small, so it reads as arriving rather than just turning in place. The spin is easiest to follow when the shape looks right at every angle, so it suits round or symmetric marks such as icons, stars, gears and badges, not text or wide rectangles.

## When to use it
- Icon and badge reveals — achievement unlocks, status indicators, loading-to-done transitions
- Logos or emblems where a spin reinforces a "coming together" moment
- Small decorative elements that can absorb an energetic entrance
- Anywhere the resting shape is symmetric enough that a mid-spin frame still looks intentional

## How it works
The element starts rotated and scaled down, then transitions both back to their resting values when the `.in` class is added. A springy easing gives the spin a slight overshoot so it feels like it lands:

```css
.icon{
  opacity:0;
  transform:rotate(var(--rot-start)) scale(var(--scale-start));
  transition:transform var(--dur) var(--ease),
             opacity var(--opacity-dur) var(--ease)}
.icon.in{opacity:1;transform:rotate(0deg) scale(1)}
```

Every setting only changes a custom property. The starting angle is the chosen amount of turn, signed by the direction, and switching the bounce off swaps the springy curve for a smooth one:

```js
function apply(){
  vars.setProperty('--rot-start',dir*turn+'deg');
  vars.setProperty('--dur',dur()+'ms');
  vars.setProperty('--ease',bounceTog.checked?SPRINGY:SMOOTH);
  vars.setProperty('--scale-start',scaleTog.checked?'0':'1');
  vars.setProperty('--opacity-dur',fadeTog.checked?'var(--dur)':'0s');
}
```

A negative starting angle spins clockwise into place and a positive one counter-clockwise; either way the element lands at `rotate(0deg)`. Each play first snaps the icon back to its starting pose with the transition switched off, so a replay always spins in from the beginning. Slow motion multiplies the duration by three.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| How much it spins | ½ turn | How far it turns on the way in: a quarter turn, half a turn or a full turn |
| Speed | Normal | How long the spin takes: slow is 1000ms, normal 600ms and fast 350ms |
| Spin direction | Clockwise | Which way it turns as it lands |
| Bounce at the end | on | Goes slightly past its resting angle and settles back, so the spin lands instead of gliding to a stop |
| Grows from small | on | Starts tiny and grows while it spins, which turns a spin into an arrival |
| Fades in | on | Fades in as it spins instead of appearing at once |

## Production notes
- **Symmetry matters**: rotating text or a rectangle looks like it fell over, not like it entered. The demo deliberately uses a symmetric icon so every intermediate frame reads correctly.
- **Scale sells the arrival**: rotation alone spins the element where it already is; adding `scale(0) → scale(1)` makes it feel like it travels in from nothing. The two combined are what create the "landing" quality.
- **Decouple opacity timing**: the demo gives the fade its own duration (`--opacity-dur`), so you can, for example, fade in quickly while the spin continues — a fully-transparent spin start can otherwise look like a glitch.
- **Reduced motion**: the icon drops to a plain 300ms opacity fade with no rotation or scale when `prefers-reduced-motion` is set, and the demo does not loop.
- **Framer Motion**: animate `rotate` and `scale` together in a variant, with a spring transition for the landing overshoot.
- **GSAP**: tween `rotation` and `scale` with a `back.out` ease; `back` provides the overshoot in one keyword.

## See also
- [Flip In](../flip-in/) — swings in like a card turning over
- [Scale In](../scale-in/) — grows from small, with no spin
- [Bounce In](../bounce-in/) — lands with a springy bounce
````

- [ ] **Step 6: Run the tests to see them pass**

Run: `node --test "tests/*.test.js"`
Expected: every test passes, including `Rotate In uses the guided-steps page`, `02-entrance-and-exit/rotate-in uses the guided-steps page correctly` and `rotate-in: every Key parameters name is a setting in Try it`.

- [ ] **Step 7: Look at the page**

With the static server on port 8731 running, take a full-page screenshot and open it with the Read tool:

```bash
PROFILE="$(cygpath -w "$(mktemp -d)")"
OUT="$(cygpath -w "$(mktemp -d)")\\rotate-in-task2.png"
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --hide-scrollbars \
  --run-all-compositor-stages-before-draw --virtual-time-budget=3000 --user-data-dir="$PROFILE" \
  --window-size=1280,2600 --screenshot="$OUT" "http://127.0.0.1:8731/animations/02-entrance-and-exit/rotate-in/"
echo "$OUT"
```

Expected at this stage (the shared script has no `boot` yet): the top bar, header, three numbered steps, the framed stage (the icon is not shown yet because nothing has played), the player bar, two settings side by side with hints, "More options", the prompt card with the Copy prompt button, What it is with the README link, Good for and Avoid on tags, and the footer. Nothing overlaps and nothing runs off the right edge.

- [ ] **Step 8: Commit**

```bash
git add assets/css/demo-page.css animations/02-entrance-and-exit/rotate-in/index.html animations/02-entrance-and-exit/rotate-in/README.md tests/pages.test.js
git commit -m "feat: rebuild the Rotate In page as the guided-steps pilot"
```

---

### Task 3: The page behaviour in the shared script

**Files:**
- Modify (replace the whole file): `assets/js/demo-page.js`
- Test: `tests/demo-page.test.js`

**Interfaces:**
- Consumes: the helpers from Task 1 (`escapeHtml`, `isSafeHref`, `sections`, `paragraphs`, `seeAlso`, `settingsLine`, `markFill`) and the markup, class names and markers listed under Task 2's "Produces".
- Produces: `readSettings(doc: Document, scope: Element, win: Window): Array<{ label: string, value: string }>` and `boot(doc: Document, win: Window): void`, both exported; in the browser the script boots itself.

- [ ] **Step 1: Write the failing test**

Append to `tests/demo-page.test.js`:

```js
test('the module exports boot and readSettings without touching a DOM', () => {
  assert.equal(typeof DP.boot, 'function');
  assert.equal(typeof DP.readSettings, 'function');
});
```

- [ ] **Step 2: Run the tests to see it fail**

Run: `node --test "tests/*.test.js"`
Expected: one failure, `the module exports boot and readSettings without touching a DOM` (`'undefined' !== 'function'`).

- [ ] **Step 3: Add the page behaviour**

Replace `assets/js/demo-page.js` with:

```js
/* Animation Handbook — shared behaviour for the guided-steps demo pages.
 * Fills in "Your settings", Copy prompt, the README's "What it is" and "Similar
 * animations", plays the demo on arrival and replays it when a setting changes.
 * The pure helpers are exported for tests/demo-page.test.js. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) { module.exports = api; return; }
  root.DemoPage = api;
  if (typeof document === 'undefined') return;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { api.boot(document, root); });
  } else {
    api.boot(document, root);
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------- Pure helpers ---------- */

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Text with Markdown code and bold markers removed, safe to insert as HTML.
  function plain(s) {
    return escapeHtml(String(s).replace(/`/g, '').replace(/\*\*/g, ''));
  }

  // Only relative paths, "#" anchors and http(s) URLs are link targets. Anything else, including
  // protocol-relative "//host" links, is rendered as plain text instead.
  function isSafeHref(href) {
    href = String(href);
    return /^(?:https?:|#|\.{0,2}\/|[\w.-]+(?:\/|$))/i.test(href) && !/^\/\//.test(href) &&
      !/^[a-z][a-z0-9+.-]*:/i.test(href.replace(/^https?:/i, ''));
  }

  // Inline Markdown from README prose. Inline code becomes plain text: the site shows no code.
  function inline(md) {
    return escapeHtml(md)
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, label, href) {
        return isSafeHref(href) ? '<a href="' + href + '">' + label + '</a>' : label;
      })
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  }

  // A README split into { "What it is": "...", ... } by its "## " headings.
  function sections(md) {
    var out = {}, current = null, buf = [];
    String(md).replace(/\r\n?/g, '\n').split('\n').forEach(function (line) {
      var m = /^##\s+(.+?)\s*$/.exec(line);
      if (m) {
        if (current) out[current] = buf.join('\n').trim();
        current = m[1];
        buf = [];
      } else if (current) {
        buf.push(line);
      }
    });
    if (current) out[current] = buf.join('\n').trim();
    return out;
  }

  function paragraphs(text) {
    return String(text || '').split(/\n\s*\n/)
      .map(function (p) { return p.trim(); })
      .filter(Boolean)
      .map(function (p) { return '<p>' + inline(p.replace(/\s*\n\s*/g, ' ')) + '</p>'; })
      .join('');
  }

  // "- [Name](../slug/) — description" lines as [{ name, href, desc }].
  function seeAlso(text) {
    return String(text || '').split('\n').map(function (l) {
      var m = /^\s*[-*]\s+\[([^\]]+)\]\(([^)\s]+)\)\s*(?:[—–-]\s*(.*))?$/.exec(l);
      return m ? { name: plain(m[1]), href: m[2], desc: m[3] ? inline(m[3]) : '' } : null;
    }).filter(Boolean);
  }

  // [{ label: 'Speed', value: 'Normal' }, ...] as "Speed: Normal, ...", skipping incomplete pairs.
  function settingsLine(items) {
    return (items || [])
      .filter(function (i) { return i && i.label && i.value; })
      .map(function (i) { return i.label + ': ' + i.value; })
      .join(', ');
  }

  // The prompt as HTML with each [part to fill in] highlighted.
  function markFill(text) {
    return escapeHtml(text).replace(/\[[^\]\n]+\]/g, function (part) {
      return '<mark class="hb-fill">' + part + '</mark>';
    });
  }

  /* ---------- Page behaviour ---------- */

  var CONTROLS = 'input[type=range], input[type=checkbox], select, .seg, .swatches';

  function text(node) { return node ? node.textContent.replace(/\s+/g, ' ').trim() : ''; }

  function labelFor(doc, control) {
    var own = control.getAttribute('data-hb-label');
    if (own) return own;
    var by = control.getAttribute('aria-labelledby');
    if (by && doc.getElementById(by)) return text(doc.getElementById(by));
    var wrap = control.closest('label');
    if (wrap) return text(wrap);
    var byFor = control.id && doc.querySelector('label[for="' + control.id + '"]');
    return byFor ? text(byFor) : '';
  }

  function valueFor(control) {
    if (control.matches('input[type=range]')) {
      var row = control.closest('.sr');
      var shown = row && row.querySelector('.sv');
      return shown ? text(shown) : (control.getAttribute('aria-valuetext') || control.value);
    }
    if (control.matches('input[type=checkbox]')) return control.checked ? 'on' : 'off';
    if (control.matches('select')) return control.selectedOptions[0] ? text(control.selectedOptions[0]) : control.value;
    var active = control.querySelector('.on, [aria-pressed="true"]');
    return active ? (active.getAttribute('aria-label') || text(active)) : '';
  }

  // A control counts unless it, or anything between it and the scope, is hidden, skipped or
  // display:none. Controls inside a closed More options still count: <details> hides them another way.
  function isShown(control, scope, win) {
    for (var node = control; node && node !== scope; node = node.parentElement) {
      if (node.hidden || node.hasAttribute('data-hb-skip')) return false;
      if (win.getComputedStyle(node).display === 'none') return false;
    }
    return true;
  }

  // The demo's current settings in page order, as [{ label, value }].
  function readSettings(doc, scope, win) {
    return Array.prototype.filter.call(scope.querySelectorAll(CONTROLS), function (control) {
      return isShown(control, scope, win);
    }).map(function (control) {
      return { label: labelFor(doc, control), value: valueFor(control) };
    });
  }

  function boot(doc, win) {
    var page = doc.querySelector('.hb-page');
    var promptEl = page && page.querySelector('.hb-prompt');
    if (!promptEl) return;

    var tryStep = page.querySelector('.hb-try');
    var chipsBox = page.querySelector('.hb-chips-box');
    var chips = chipsBox && chipsBox.querySelector('.hb-chips');
    var copyBtn = page.querySelector('.hb-copy');
    var replayCtl = page.querySelector('[data-hb-replay]');
    var loopCtl = page.querySelector('[data-hb-loop]');
    var slowCtl = page.querySelector('[data-hb-slowmo]');
    var reduce = win.matchMedia ? win.matchMedia('(prefers-reduced-motion: reduce)') : null;
    var promptText = text(promptEl);

    function settings() {
      if (!tryStep) return [];
      return readSettings(doc, tryStep, win).filter(function (s) { return s.label && s.value; });
    }
    function copyText() {
      var line = settingsLine(settings());
      return promptText + (line ? '\n\nSettings from the demo: ' + line + '.' : '');
    }
    function replay() { if (replayCtl) replayCtl.click(); }

    // The prompt: highlight the part to fill in; on phones show five lines until "Show the full prompt".
    function setUpPrompt() {
      promptEl.innerHTML = markFill(promptText);
      promptEl.id = promptEl.id || 'hb-prompt';
      promptEl.classList.add('is-clamped');
      var toggle = doc.createElement('button');
      toggle.type = 'button';
      toggle.className = 'hb-prompt-more';
      toggle.setAttribute('aria-controls', promptEl.id);
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Show the full prompt';
      toggle.addEventListener('click', function () {
        var open = !promptEl.classList.toggle('is-clamped');
        toggle.setAttribute('aria-expanded', String(open));
        toggle.textContent = open ? 'Show less' : 'Show the full prompt';
      });
      promptEl.insertAdjacentElement('afterend', toggle);
    }

    function refreshChips() {
      if (!chips) return;
      var items = settings();
      chips.innerHTML = items.map(function (s) {
        return '<li>' + escapeHtml(s.label) + ': ' + escapeHtml(s.value) + '</li>';
      }).join('');
      chipsBox.hidden = !items.length;
    }

    function setUpCopy() {
      var label = copyBtn.querySelector('.hb-copy-label') || copyBtn;
      var timer = 0;
      function show(message, done) {
        label.textContent = message;
        copyBtn.classList.toggle('is-done', done);
        win.clearTimeout(timer);
        timer = win.setTimeout(function () {
          label.textContent = 'Copy prompt';
          copyBtn.classList.remove('is-done');
        }, 1500);
      }
      function selectInstead() {
        var range = doc.createRange();
        range.selectNodeContents(promptEl);
        var selection = win.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        show(/Mac|iPhone|iPad/.test(win.navigator.platform || win.navigator.userAgent) ? 'Press ⌘C to copy' : 'Press Ctrl+C to copy', false);
      }
      copyBtn.addEventListener('click', function () {
        var clip = win.navigator.clipboard;
        if (clip && clip.writeText) clip.writeText(copyText()).then(function () { show('Copied', true); }, selectInstead);
        else selectInstead();
      });
    }

    // What it is and Similar animations from the README. Opened from disk, the README link stays.
    function loadReadme() {
      var what = page.querySelector('.hb-what-text');
      var related = page.querySelector('.hb-related');
      if (!what || win.location.protocol === 'file:' || !win.fetch) return;
      win.fetch('README.md').then(function (res) {
        if (!res.ok) throw new Error('README ' + res.status);
        return res.text();
      }).then(function (md) {
        var s = sections(md);
        if (s['What it is']) what.innerHTML = paragraphs(s['What it is']);
        var list = related && related.querySelector('.hb-rel-list');
        var cards = seeAlso(s['See also']).filter(function (r) { return isSafeHref(r.href); });
        if (!list || !cards.length) return;
        list.innerHTML = cards.map(function (r) {
          var desc = r.desc.replace(/^[a-z]/, function (c) { return c.toUpperCase(); });
          return '<a class="hb-rel" href="' + escapeHtml(r.href) + '"><b>' + r.name + '</b>' +
            (desc ? '<span>' + desc + '</span>' : '') + '</a>';
        }).join('');
        related.hidden = false;
      }).catch(function () {});
    }

    // Changing a setting updates the chips and replays the animation shortly after the last change.
    var replayTimer = 0;
    function onSettingsChange(e) {
      if (e.type === 'click' && !e.target.closest('.seg, .swatches')) return;
      win.setTimeout(refreshChips, 0);
      win.clearTimeout(replayTimer);
      replayTimer = win.setTimeout(replay, 250);
    }

    setUpPrompt();
    if (copyBtn) setUpCopy();
    if (tryStep) ['input', 'change', 'click'].forEach(function (type) { tryStep.addEventListener(type, onSettingsChange); });
    if (slowCtl) slowCtl.addEventListener('change', replay);
    if (doc.body.hasAttribute('data-hb-autoplay')) {
      win.setTimeout(function () {
        if (loopCtl && !(reduce && reduce.matches)) {
          if (!loopCtl.checked) loopCtl.click();
        } else {
          replay();
        }
      }, 400);
    }
    refreshChips();
    loadReadme();
  }

  return {
    escapeHtml: escapeHtml, plain: plain, isSafeHref: isSafeHref, inline: inline, sections: sections,
    paragraphs: paragraphs, seeAlso: seeAlso, settingsLine: settingsLine, markFill: markFill,
    readSettings: readSettings, boot: boot
  };
});
```

- [ ] **Step 4: Run the tests to see them pass**

Run: `node --test "tests/*.test.js"`
Expected: every test passes.

- [ ] **Step 5: Look at the page**

With the static server on port 8731 running, take the same full-page screenshot as in Task 2 (name it `rotate-in-task3.png`) and open it with the Read tool.

Expected now: the icon is visible on the stage (autoplay ran), the Loop switch is on, the prompt has its bracketed part highlighted, "Your settings" shows six chips (How much it spins: ½ turn · Speed: Normal · Spin direction: Clockwise · Bounce at the end: on · Grows from small: on · Fades in: on), What it is shows the README paragraph, and Similar animations shows three cards (Flip In, Scale In, Bounce In) with capitalised descriptions.

- [ ] **Step 6: Commit**

```bash
git add assets/js/demo-page.js tests/demo-page.test.js
git commit -m "feat: add chips, copy, README sections and autoplay to the guided-steps page"
```

---

### Task 4: Check the pilot in a real browser

The controller runs this task in the in-app browser (`preview_start` with the `static-site` configuration opens port 8731), because its screenshots go to the user. Anything found here is fixed in `assets/css/demo-page.css`, `assets/js/demo-page.js` or the Rotate In page, the tests are re-run, and the fix is committed.

**Files:**
- Modify only if a check fails: `assets/css/demo-page.css`, `assets/js/demo-page.js`, `animations/02-entrance-and-exit/rotate-in/index.html`

**Interfaces:**
- Consumes: everything from Tasks 1–3.
- Produces: screenshots for the user at desktop, tablet and phone sizes.

- [ ] **Step 1: Open the page**

Open `http://127.0.0.1:8731/animations/02-entrance-and-exit/rotate-in/` and read the console. Expected: no errors.

- [ ] **Step 2: Run the layout check at each size**

At 1280×800, 768×1024 and 375×812, reload and run:

```js
(() => {
  const r = el => el.getBoundingClientRect();
  const small = [...document.querySelectorAll('.hb-bar a, button, summary, label.hb-toggle, label.hb-switch-row, .hb-foot a, .hb-rel')]
    .filter(el => el.getClientRects().length)
    .filter(el => r(el).width < 44 || r(el).height < 44)
    .map(el => `${el.tagName.toLowerCase()}.${el.className} ${Math.round(r(el).width)}x${Math.round(r(el).height)}`);
  return {
    overflowX: document.documentElement.scrollWidth > innerWidth,
    smallTargets: small,
    stageAndPlayerOnFirstScreen: r(document.querySelector('.hb-player')).bottom <= innerHeight,
    settingsColumns: getComputedStyle(document.querySelector('.hb-settings')).gridTemplateColumns.split(' ').length,
    chips: [...document.querySelectorAll('.hb-chips li')].map(li => li.textContent),
    whatItIs: document.querySelector('.hb-what-text').textContent.trim().slice(0, 40),
    related: [...document.querySelectorAll('.hb-rel b')].map(b => b.textContent),
    loopOn: document.querySelector('[data-hb-loop]').checked
  };
})()
```

Expected at every size: `overflowX` false, `smallTargets` empty, six chips, `whatItIs` starting "Rotate In spins an element", `related` `["Flip In","Scale In","Bounce In"]`, `loopOn` true. `stageAndPlayerOnFirstScreen` true at 1280×800. `settingsColumns` 2 at 1280 and 768, 1 at 375.

- [ ] **Step 3: Try every control (1280×800)**

- "Full turn": the icon replays with a full turn; the chip reads "How much it spins: Full turn".
- "Fast", then "Slow": the replay speed changes; the Speed chip follows.
- Open More options: the label reads "Fewer options"; "Counter-clockwise" reverses the spin; each switch changes the chip to "off" and the replay loses the bounce, the growth or the fade.
- Slow motion on: the next spin is three times slower; the pauses between loops are unchanged.
- Loop off: the icon finishes landed and stays; Replay then plays it once.
- Copy prompt: the button reads "Copied" with a tick, then "Copy prompt" again after 1.5s; the clipboard holds the prompt, a blank line and `Settings from the demo: How much it spins: …, Speed: …, Spin direction: …, Bounce at the end: …, Grows from small: …, Fades in: ….`

- [ ] **Step 4: Phone checks (375×812)**

- The top bar shows "‹ Bounce In" without the word "Previous:".
- Settings sit one per row and their choices fill the width.
- The prompt shows five lines and "Show the full prompt"; tapping it shows the whole prompt and "Show less".
- The Copy prompt button fills the card's width.

- [ ] **Step 5: Reduced motion**

Emulate `prefers-reduced-motion: reduce` and reload. Expected: Loop stays off, the icon fades in once without spinning, and changing a setting fades it in again.

- [ ] **Step 6: Screenshots and commit**

Take screenshots at 1280×800 (first screen and full page), 768×1024 and 375×812 for the user. If anything was fixed, run `node --test "tests/*.test.js"` (all pass) and commit only the files that changed, with a message that names the fix, for example:

```bash
git add assets/css/demo-page.css
git commit -m "fix: keep the player bar on one line on phones"
```
