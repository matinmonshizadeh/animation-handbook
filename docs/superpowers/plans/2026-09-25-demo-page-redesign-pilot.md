# Demo Page Redesign — Foundation + Entrance & Exit Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the shared demo-page layout (big playing demo, side column with settings, prompt preview and Read more), switch the site to Schibsted Grotesk, and convert the 13 Entrance & Exit demos as the pilot the user reviews before any other category changes.

**Architecture:** Each demo keeps its animation code inside its own `index.html`. A shared stylesheet (`assets/css/handbook.css`) and script (`assets/js/handbook.js`) supply the page chrome: layout, fonts, the prompt box, "Read more" (rendered live from the demo's `README.md`) and Replay. A one-time migration tool (`tools/migrate-demo.js`) rewrites each legacy page into the new skeleton from a per-category JSON file that also carries each demo's prompt.

**Tech Stack:** Plain HTML, CSS and vanilla JavaScript (ES5-style in the shared script so it runs everywhere). Node 24's built-in test runner for tests and the migration tool — no npm packages. Headless Chrome and the browser pane for visual checks.

**Spec:** `docs/superpowers/specs/2026-09-25-demo-page-redesign-design.md` · **Approved visual:** `samples/demo-page-design.html`

## Global Constraints

- No build step, no frameworks, no npm packages (CLAUDE.md). Tests use only `node:test`, `node:assert`, `node:fs`, `node:path`.
- No code appears anywhere on the site: no code blocks, no "Copy source" / "Source ↗", README "How it works" and "Production notes" are never rendered, inline code in rendered README text is shown as plain text.
- The copied prompt is the prompt text plus `\n\nSettings from the demo: <label> <value>, ….` generated from the demo's controls.
- Prompts: 60–130 words, tool- and framework-neutral, no code, end with "Match the settings listed below."
- Fonts: Schibsted Grotesk (SIL Open Font License), self-hosted in `assets/fonts/`. Download only after the user approves the download.
- Breakpoints: mobile ≤ 600px, tablet 601–1024px, desktop ≥ 1025px. Touch targets ≥ 44×44px on mobile. Respect `prefers-reduced-motion`.
- Desktop stage fills `100dvh` minus the 48px bar and padding; side column `clamp(300px, 27vw, 370px)`; tablet column 300px; phone stage `56svh`, at least 320px.
- Preserve every demo's animation behaviour exactly (CLAUDE.md refactor rule). Only the page chrome around the stage changes.
- Work on branch `feat/demo-page-redesign`. Commit at the end of each task. Do not push. Do not touch demos outside `animations/02-entrance-and-exit/` (they keep Bricolage and Plex Mono until their own plan).

---

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `assets/js/handbook.js` | Create | Shared page behaviour: README → HTML helpers, settings line, prompt box, Read more, Replay, auto-play |
| `assets/css/handbook.css` | Create | Shared page chrome: fonts, tokens, top bar, layout, side column, restyled controls, prompt box, details |
| `assets/fonts/schibsted-latin.woff2` | Create (download) | Schibsted Grotesk variable 400–900, Latin |
| `assets/fonts/schibsted-latin-ext.woff2` | Create (download) | Schibsted Grotesk variable 400–900, Latin Extended |
| `tools/migrate-demo.js` | Create | One-time rewrite of a legacy demo page into the shared skeleton |
| `tools/migrations/02-entrance-and-exit.json` | Create | Per-demo data for the pilot: number, pager, markers, one-off edits, plain lede, prompt |
| `tests/handbook.test.js` | Create | Unit tests for the pure helpers in `handbook.js` |
| `tests/migrate.test.js` | Create | Tests for `tools/migrate-demo.js` |
| `tests/fixtures/legacy-demo.html` | Create | Minimal legacy page used by the migration tests |
| `tests/pages.test.js` | Create | Static checks for converted pages, pilot READMEs and the home page |
| `animations/02-entrance-and-exit/*/index.html` | Modify (13) | Converted by the migration tool |
| `animations/02-entrance-and-exit/*/README.md` | Modify (13) | Plain-language "What it is" and "Key parameters" |
| `index.html` | Modify | Schibsted Grotesk, new intro line |

Run all tests from the repo root with:

```bash
node --test "tests/*.test.js"
```

---

## Verification kit (used by Tasks 3, 4, 6, 7, 9)

**Start the site.** Use the browser pane's `preview_start` with `{ "name": "static-site" }` (serves the repo on `http://localhost:8731`). Without that tool, run `python -m http.server 8731 --bind 127.0.0.1` from the repo root in the background.

**Page check.** Open a converted demo in the browser pane, set the viewport with `resize_window` (1280×800, 768×1024, then preset `mobile`), reload, and run this with `javascript_tool` (top-level `await` works there):

```js
const q = s => document.querySelector(s);
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(1500);
const res = { page: location.pathname, width: innerWidth };
res.noOverflowX = document.documentElement.scrollWidth <= innerWidth + 1;
const vis = r => r.width * Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
res.stageBiggest = vis(q('.hb-view > .stage').getBoundingClientRect()) > vis(q('.hb-side').getBoundingClientRect());
const line = q('.hb-prompt-box .hb-set');
res.settingsLine = line ? line.textContent : null;
const slider = [...document.querySelectorAll('.hb-settings input[type=range]')].find(r => !r.closest('[data-hb-skip]'));
if (slider) {
  const before = line.textContent;
  slider.value = slider.value === slider.max ? slider.min : slider.max;
  slider.dispatchEvent(new Event('input', { bubbles: true }));
  await wait(50);
  res.settingsLineFollowsSlider = line.textContent !== before;
}
let copied = '';
Object.defineProperty(navigator.clipboard, 'writeText', { configurable: true, value: t => { copied = t; return Promise.resolve(); } });
q('.hb-prompt-box .hb-copy').click();
await wait(50);
res.copyHasPrompt = copied.startsWith(q('.hb-prompt').textContent.trim());
res.copyHasSettings = /\n\nSettings from the demo: .+\.$/.test(copied);
res.replayButton = !!q('.hb-replay');
q('.hb-more').click();
await wait(1500);
const d = q('#details');
res.detailsOpen = !d.hidden;
res.detailsHeadings = [...d.querySelectorAll('h2')].map(h => h.textContent).join(' | ');
res.codeInDetails = d.querySelectorAll('pre, code').length;
res.brokenRelated = [];
for (const a of d.querySelectorAll('.hb-rel')) { const r = await fetch(a.href); if (!r.ok) res.brokenRelated.push(a.getAttribute('href')); }
if (innerWidth <= 600) res.smallTargets = [...document.querySelectorAll('.hb-bar a, .hb-settings .seg button, .hb-settings .act, .hb-settings .tog, .hb-settings select, .hb-copy, .hb-more, .hb-replay')].filter(e => e.getBoundingClientRect().height < 44).length;
res
```

Expected: `noOverflowX: true`, `stageBiggest: true`, `settingsLine` starts with `Your settings:`, `settingsLineFollowsSlider: true`, `copyHasPrompt: true`, `copyHasSettings: true`, `replayButton: true`, `detailsOpen: true`, `detailsHeadings: "What it is | When to use it | What the controls do | Full prompt | Related animations"`, `codeInDetails: 0`, `brokenRelated: []`, and on the phone size `smallTargets: 0`. Then call `read_console_messages` with `onlyErrors: true` — expected: no errors. Reload the page before checking the next size (the check changes a slider).

**Screenshots.** Headless Chrome, one Chrome run per shell command, each with a fresh profile folder:

```bash
OUT="$(cygpath -w /tmp)"
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --hide-scrollbars --user-data-dir="$OUT\\hb-$RANDOM" --window-size=1440,860 --force-device-scale-factor=1 --virtual-time-budget=3000 "--screenshot=$OUT\\hb-desktop.png" "http://localhost:8731/animations/02-entrance-and-exit/bounce-in/"
```

Add `--force-prefers-reduced-motion` for the reduced-motion view. Headless Chrome will not make a window narrower than about 500px, so capture phones through an iframe:

```bash
cat > /tmp/hb-phone.html <<'EOF'
<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#1d1d22}iframe{border:0;width:390px;height:844px;display:block}</style>
<iframe src="http://localhost:8731/animations/02-entrance-and-exit/bounce-in/"></iframe>
EOF
OUT="$(cygpath -w /tmp)"
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --hide-scrollbars --user-data-dir="$OUT\\hb-$RANDOM" --window-size=600,860 --force-device-scale-factor=2 --virtual-time-budget=3000 "--screenshot=$OUT\\hb-phone.png" "file:///$(cygpath -m /tmp)/hb-phone.html"
```

The phone view is the top-left 780×1688 pixels of `hb-phone.png`. Open screenshots with the Read tool and compare them with `samples/demo-page-design.html` at the same size.

---

### Task 1: Shared script — README and settings helpers

**Files:**
- Create: `assets/js/handbook.js`
- Test: `tests/handbook.test.js`

**Interfaces:**
- Produces (exported from `assets/js/handbook.js`, `module.exports` in Node, `window.Handbook` in browsers):
  - `escapeHtml(s: string): string`
  - `plain(s: string): string` — drops backticks and `**`, then escapes
  - `inline(md: string): string` — HTML; inline code → plain text; links, bold, italics
  - `sections(md: string): { [heading: string]: string }` — split on `## ` headings
  - `paragraphs(text: string): string` — `<p>` HTML
  - `bullets(text: string): string[]` — inline HTML per `- ` item
  - `cleanName(s: string): string` — drops parentheticals that contain code
  - `table(text: string): Array<{ name: string, value: string, effect: string }>` — all HTML-safe
  - `seeAlso(text: string): Array<{ name: string, href: string, desc: string }>`
  - `settingsLine(items: Array<{ label: string, value: string }>): string`

- [ ] **Step 1: Write the failing tests**

Create `tests/handbook.test.js`:

```js
// Unit tests for the pure helpers in assets/js/handbook.js.
// Run from the repo root: node --test "tests/*.test.js"
const test = require('node:test');
const assert = require('node:assert/strict');
const HB = require('../assets/js/handbook.js');

test('escapeHtml escapes markup characters', () => {
  assert.equal(HB.escapeHtml('<a href="x">&</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;');
});

test('plain drops code and bold markers and escapes', () => {
  assert.equal(HB.plain('`ease-out` **fast** <b>'), 'ease-out fast &lt;b&gt;');
});

test('inline shows code as plain text and renders links, bold and italics', () => {
  assert.equal(HB.inline('Use `opacity` on **one** *hero* [card](../scale-in/)'),
    'Use opacity on <strong>one</strong> <em>hero</em> <a href="../scale-in/">card</a>');
  assert.equal(HB.inline('a < b'), 'a &lt; b');
});

test('sections splits a README by its ## headings', () => {
  const md = '# Title\r\n\r\n## What it is\r\nLine one\r\nline two\r\n\r\n## When to use it\r\n- A\r\n- B\r\n';
  assert.deepEqual(HB.sections(md), { 'What it is': 'Line one\nline two', 'When to use it': '- A\n- B' });
});

test('sections keeps ### lines inside the section they belong to', () => {
  assert.deepEqual(HB.sections('## A\n### not a section\nx'), { A: '### not a section\nx' });
});

test('paragraphs joins wrapped lines and splits on blank lines', () => {
  assert.equal(HB.paragraphs('One\ntwo.\n\nThree `x`.'), '<p>One two.</p><p>Three x.</p>');
  assert.equal(HB.paragraphs(undefined), '');
});

test('bullets returns the list items as inline HTML', () => {
  assert.deepEqual(HB.bullets('- Hero **copy**\nnot a bullet\n- Toasts'), ['Hero <strong>copy</strong>', 'Toasts']);
});

test('cleanName drops parentheticals that hold code', () => {
  assert.equal(HB.cleanName('Duration (`--dur`)'), 'Duration');
  assert.equal(HB.cleanName('Perspective (`--persp`, on parent)'), 'Perspective');
  assert.equal(HB.cleanName('Two curtains (split)'), 'Two curtains (split)');
});

test('table reads Key parameters rows and skips the header and divider', () => {
  const md = '| Parameter | Default | Effect |\n|-----------|---------|--------|\n' +
    '| Duration (`--dur`) | 600ms | Under 150ms **barely** registers |\n| Easing | `ease-out` | Settles gently |';
  assert.deepEqual(HB.table(md), [
    { name: 'Duration', value: '600ms', effect: 'Under 150ms <strong>barely</strong> registers' },
    { name: 'Easing', value: 'ease-out', effect: 'Settles gently' }
  ]);
  assert.deepEqual(HB.table(''), []);
});

test('seeAlso reads name, link and description', () => {
  const md = '- [Scale In](../scale-in/) — the same entrance without the overshoot\n- [Blur In](../blur-in/)\nText';
  assert.deepEqual(HB.seeAlso(md), [
    { name: 'Scale In', href: '../scale-in/', desc: 'the same entrance without the overshoot' },
    { name: 'Blur In', href: '../blur-in/', desc: '' }
  ]);
});

test('settingsLine joins label and value pairs and skips empty ones', () => {
  assert.equal(HB.settingsLine([
    { label: 'Duration', value: '600ms' }, { label: 'Easing', value: 'Ease out' }, { label: 'Mode', value: '' }
  ]), 'Duration 600ms, Easing Ease out');
  assert.equal(HB.settingsLine([]), '');
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test "tests/*.test.js"`
Expected: FAIL — `Cannot find module '../assets/js/handbook.js'`.

- [ ] **Step 3: Write the helpers**

Create `assets/js/handbook.js`:

```js
/* Animation Handbook — shared behaviour for the demo pages.
 * These helpers turn a demo's README.md into the "Read more" section and build
 * the settings line for the copied prompt. They are exported for tests/handbook.test.js. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Handbook = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Text with Markdown code and bold markers removed, safe to insert as HTML.
  function plain(s) {
    return escapeHtml(String(s).replace(/`/g, '').replace(/\*\*/g, ''));
  }

  // Inline Markdown from README prose. Inline code becomes plain text: the site shows no code.
  function inline(md) {
    return escapeHtml(md)
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
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

  function bullets(text) {
    return String(text || '').split('\n')
      .filter(function (l) { return /^\s*[-*]\s+/.test(l); })
      .map(function (l) { return inline(l.replace(/^\s*[-*]\s+/, '')); });
  }

  // "Duration (`--dur`)" becomes "Duration": parentheticals that hold code are dropped.
  function cleanName(s) {
    return plain(String(s).replace(/\s*\(`[^`]*`[^)]*\)/g, ''));
  }

  // The Key parameters table as [{ name, value, effect }], without its header and divider rows.
  function table(text) {
    var rows = String(text || '').split('\n')
      .filter(function (l) { return /^\s*\|/.test(l); })
      .map(function (l) {
        return l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(function (c) { return c.trim(); });
      });
    return rows.slice(1)
      .filter(function (r) { return !r.every(function (c) { return /^:?-{2,}:?$/.test(c); }); })
      .map(function (r) { return { name: cleanName(r[0] || ''), value: plain(r[1] || ''), effect: inline(r[2] || '') }; });
  }

  // "- [Name](../slug/) — description" lines as [{ name, href, desc }].
  function seeAlso(text) {
    return String(text || '').split('\n').map(function (l) {
      var m = /^\s*[-*]\s+\[([^\]]+)\]\(([^)\s]+)\)\s*(?:[—–-]\s*(.*))?$/.exec(l);
      return m ? { name: plain(m[1]), href: m[2], desc: m[3] ? inline(m[3]) : '' } : null;
    }).filter(Boolean);
  }

  function settingsLine(items) {
    return (items || [])
      .filter(function (i) { return i && i.label && i.value; })
      .map(function (i) { return i.label + ' ' + i.value; })
      .join(', ');
  }

  return {
    escapeHtml: escapeHtml, plain: plain, inline: inline, sections: sections, paragraphs: paragraphs,
    bullets: bullets, cleanName: cleanName, table: table, seeAlso: seeAlso, settingsLine: settingsLine
  };
});
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test "tests/*.test.js"`
Expected: PASS — 11 tests, 0 failures.

- [ ] **Step 5: Commit**

```bash
git add assets/js/handbook.js tests/handbook.test.js
git commit -m "feat: add the shared demo-page script's README and settings helpers"
```

---

### Task 2: Migration tool for legacy demo pages

**Files:**
- Create: `tools/migrate-demo.js`
- Create: `tests/fixtures/legacy-demo.html`
- Test: `tests/migrate.test.js`

**Interfaces:**
- Consumes: `escapeHtml` from `assets/js/handbook.js` (Task 1).
- Produces:
  - `migrate(html: string, cfg: { category: string, name: string }, demo: Demo): string` — throws `Error` whose message starts with the step name when a step does not match exactly once, or `"already migrated"`.
  - `Demo` = `{ slug: string, number: string, prev: { href: string, name: string } | null, next: same | null, autoplay: boolean, attrs?: { [id: string]: string }, edits?: Array<[string, string]>, lede?: string, prompt: string }`
  - CLI: `node tools/migrate-demo.js <config.json> [slug ...]` rewrites `animations/<category>/<slug>/index.html` in place.
  - Output markup contract used by Tasks 3–4: `<body class="hb">` (plus `data-hb-autoplay`), `<nav class="hb-bar">` with `.hb-home` and `.hb-pager` links (`rel="prev"` / `rel="next"`, names in `.hb-name`), `<main class="hb-view">` holding the untouched `.stage` and `<aside class="hb-side">`, which contains `<header class="hb-head">` (`.hb-cat`, `h1`, `.hb-lede`), `<section class="hb-settings">` (`h2.hb-label` + the old controls) and `<div class="hb-take">` with `<section class="hb-prompt-box">` (`h2.hb-label#hb-prompt-title` + `p.hb-prompt`).

- [ ] **Step 1: Write the legacy fixture**

Create `tests/fixtures/legacy-demo.html` (a trimmed copy of the legacy skeleton every demo shares):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sample Demo — Animation Handbook</title>
  <style>
    @font-face{font-family:'Bricolage';src:url('../../../assets/fonts/brico-700.woff2') format('woff2');font-weight:700;font-display:swap}
    @font-face{font-family:'PlexMono';src:url('../../../assets/fonts/plex-400.woff2') format('woff2');font-weight:400;font-display:swap}
    :root{--bg:#0b0b0d;--ui-accent:#5fd88a;--disp:'Bricolage','Arial Narrow',sans-serif;--mono:'PlexMono',ui-monospace,Menlo,Consolas,monospace;--stage-h:620px}
    body{padding:24px}
  </style>
<style id="ah-inject">
.ah-bar{position:fixed}
</style>
</head>
<body>
<div class="ah-bar" role="navigation" aria-label="Animation Handbook"><a class="ah-home" href="../../../">← Animation Handbook</a><span class="ah-actions"><a class="ah-hideSm" href="../a/" rel="prev" title="Previous">‹ Prev</a><button type="button" id="ah-copy" class="ah-hideSm">Copy source</button></span></div>
<header>
  <h1>Sample Demo</h1>
  <p>Uses `code` words in its summary.</p>
</header>
<div class="layout">
  <div class="stage"><div class="card" id="card">Card</div></div>
  <aside>
    <p class="note">A technical note that now lives in the README.</p>
    <div><div class="lbl" id="dur-lbl">Duration</div>
      <div class="sr"><input type="range" id="dur-sl" aria-labelledby="dur-lbl" min="100" max="2000" value="600"><span class="sv" id="dur-v">600ms</span></div>
    </div>
    <label class="tog" for="loop-tog"><input type="checkbox" id="loop-tog"><span>Auto-loop</span></label>
    <div class="btn-row">
      <button class="act pri" id="btn-in">Play in</button>
      <button class="act" id="btn-rst">Reset</button>
    </div>
  </aside>
</div>
<script>
  document.getElementById('btn-in').addEventListener('click',()=>{});
</script>
<script>(function(){var b=document.getElementById("ah-copy");if(!b)return;})();</script>
</body>
</html>
```

- [ ] **Step 2: Write the failing tests**

Create `tests/migrate.test.js`:

```js
// Tests for tools/migrate-demo.js. Run from the repo root: node --test "tests/*.test.js"
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { migrate } = require('../tools/migrate-demo.js');

const legacy = fs.readFileSync(path.join(__dirname, 'fixtures', 'legacy-demo.html'), 'utf8');
const cfg = { category: '02-entrance-and-exit', name: 'Entrance & Exit' };
const demo = {
  slug: 'sample-demo', number: '02.12',
  prev: { href: '../flip-in/', name: 'Flip In' }, next: null,
  autoplay: true,
  attrs: { 'btn-in': 'data-hb-replay', 'btn-rst': 'data-hb-reset', 'loop-tog': 'data-hb-skip data-hb-loop' },
  edits: [['<span>Auto-loop</span>', '<span>Loop it</span>']],
  lede: 'Moves a card into view.',
  prompt: 'Add a <b> & [x] prompt.'
};
const out = migrate(legacy, cfg, demo);

test('removes the legacy chrome, fonts and font variables', () => {
  for (const gone of ['ah-inject', 'ah-bar', 'ah-copy', 'Copy source', 'Bricolage', 'PlexMono', '--disp', '--mono', 'class="note"', 'class="layout"', '<header>']) {
    assert.ok(!out.includes(gone), `still contains ${gone}`);
  }
});

test('links the shared stylesheet and script at the end of <head>', () => {
  assert.ok(out.includes('<link rel="stylesheet" href="../../../assets/css/handbook.css">\n<script src="../../../assets/js/handbook.js" defer></script>\n</head>'));
});

test('marks the body and builds the top bar', () => {
  assert.ok(out.includes('<body class="hb" data-hb-autoplay>'));
  assert.ok(out.includes('<a class="hb-home" href="../../../">← <span>Animation Handbook</span></a>'));
  assert.ok(out.includes('<a href="../flip-in/" rel="prev" aria-label="Previous: Flip In">‹ <span class="hb-name">Flip In</span></a>'));
  assert.ok(!out.includes('rel="next"'));
});

test('moves the title into the side column with the number, category and plain lede', () => {
  assert.ok(out.includes('<main class="hb-view">'));
  assert.ok(out.includes('<aside class="hb-side">'));
  assert.ok(out.includes('<p class="hb-cat">02.12 · Entrance &amp; Exit</p>'));
  assert.ok(out.includes('<h1>Sample Demo</h1>'));
  assert.ok(out.includes('<p class="hb-lede">Moves a card into view.</p>'));
  assert.ok(out.includes('<section class="hb-settings" aria-label="Settings">'));
  assert.ok(out.includes('</aside>\n</main>\n'));
});

test('adds the escaped prompt and keeps the controls and demo script', () => {
  assert.ok(out.includes('<p class="hb-prompt">Add a &lt;b&gt; &amp; [x] prompt.</p>'));
  assert.ok(out.includes('id="dur-sl"'));
  assert.ok(out.includes("document.getElementById('btn-in').addEventListener"));
});

test('applies marker attributes and one-off edits', () => {
  assert.ok(out.includes('id="btn-in" data-hb-replay'));
  assert.ok(out.includes('id="btn-rst" data-hb-reset'));
  assert.ok(out.includes('id="loop-tog" data-hb-skip data-hb-loop'));
  assert.ok(out.includes('<span>Loop it</span>'));
});

test('keeps the original lede when none is given', () => {
  const kept = migrate(legacy, cfg, { ...demo, lede: undefined });
  assert.ok(kept.includes('<p class="hb-lede">Uses `code` words in its summary.</p>'));
});

test('refuses edits that do not match exactly once', () => {
  assert.throws(() => migrate(legacy, cfg, { ...demo, edits: [['<span>Nope</span>', 'x']] }), /edit/);
});

test('refuses to migrate a page twice', () => {
  assert.throws(() => migrate(out, cfg, demo), /already migrated/);
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `node --test "tests/*.test.js"`
Expected: FAIL — `Cannot find module '../tools/migrate-demo.js'`.

- [ ] **Step 4: Write the migration tool**

Create `tools/migrate-demo.js`:

```js
#!/usr/bin/env node
// One-time migration of legacy demo pages to the shared demo layout.
// See docs/superpowers/specs/2026-09-25-demo-page-redesign-design.md.
// Usage (repo root): node tools/migrate-demo.js tools/migrations/<category>.json [slug ...]
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { escapeHtml } = require('../assets/js/handbook.js');

// Replace `find` exactly once; anything else means the page doesn't have the expected shape.
function replaceOnce(html, find, replacement, step) {
  const count = typeof find === 'string'
    ? html.split(find).length - 1
    : (html.match(new RegExp(find.source, find.flags.includes('g') ? find.flags : find.flags + 'g')) || []).length;
  if (count !== 1) throw new Error(`${step}: expected exactly 1 match, found ${count}`);
  return html.replace(find, typeof replacement === 'function' ? replacement : () => replacement);
}

function pagerLink(rel, target) {
  if (!target) return '';
  const label = rel === 'prev' ? 'Previous' : 'Next';
  const name = `<span class="hb-name">${escapeHtml(target.name)}</span>`;
  return `<a href="${target.href}" rel="${rel}" aria-label="${label}: ${escapeHtml(target.name)}">` +
    (rel === 'prev' ? `‹ ${name}` : `${name} ›`) + '</a>';
}

function topBar(demo) {
  return '<nav class="hb-bar" aria-label="Animation Handbook">' +
    '<a class="hb-home" href="../../../">← <span>Animation Handbook</span></a>' +
    `<span class="hb-pager">${pagerLink('prev', demo.prev)}${pagerLink('next', demo.next)}</span></nav>`;
}

function migrate(html, cfg, demo) {
  if (html.includes('class="hb-view"')) throw new Error('already migrated');
  let out = html.replace(/\r\n/g, '\n');

  // Legacy top bar styles, font files and font variables.
  out = replaceOnce(out, /\n<style id="ah-inject">[\s\S]*?<\/style>/, '', 'ah-inject style');
  const fontFace = /^[ \t]*@font-face\{font-family:'(?:Bricolage|PlexMono)'[^\n]*\n/gm;
  if (!fontFace.test(out)) throw new Error('font-face lines: none found');
  out = out.replace(fontFace, '');
  out = replaceOnce(out, /--disp:[^;}]*;?/, '', '--disp variable');
  out = replaceOnce(out, /--mono:[^;}]*;?/, '', '--mono variable');

  // Shared assets, body marker and the new top bar.
  out = replaceOnce(out, '</head>',
    '<link rel="stylesheet" href="../../../assets/css/handbook.css">\n' +
    '<script src="../../../assets/js/handbook.js" defer></script>\n</head>', '</head>');
  out = replaceOnce(out, '<body>', `<body class="hb"${demo.autoplay ? ' data-hb-autoplay' : ''}>`, '<body>');
  out = replaceOnce(out, /<div class="ah-bar"[^\n]*<\/div>\n/, topBar(demo) + '\n', 'ah-bar');
  out = replaceOnce(out, /\n<script>\(function\(\)\{var b=document\.getElementById\("ah-copy"\)[^\n]*<\/script>/, '', 'copy-source script');

  // The header moves into the side column; the note moves out (its content lives in the README).
  let title = '';
  let lede = '';
  out = replaceOnce(out, /<header>\s*<h1>([\s\S]*?)<\/h1>\s*<p>([\s\S]*?)<\/p>\s*<\/header>\n/,
    (m, h, p) => { title = h.trim(); lede = p.trim(); return ''; }, 'header');
  if (demo.lede) lede = escapeHtml(demo.lede);
  const head =
    '    <header class="hb-head">\n' +
    `      <p class="hb-cat">${demo.number} · ${escapeHtml(cfg.name)}</p>\n` +
    `      <h1>${title}</h1>\n` +
    `      <p class="hb-lede">${lede}</p>\n` +
    '    </header>\n' +
    '    <section class="hb-settings" aria-label="Settings">\n' +
    '      <h2 class="hb-label">Settings</h2>\n';
  out = replaceOnce(out, '<div class="layout">', '<main class="hb-view">', 'layout wrapper');
  out = replaceOnce(out, /(\n[ \t]*)<aside>\n/, (m, indent) => `${indent}<aside class="hb-side">\n${head}`, 'aside open');
  out = replaceOnce(out, /\n[ \t]*<p class="note">[\s\S]*?<\/p>/, '', 'note');
  const take =
    '    </section>\n' +
    '    <div class="hb-take">\n' +
    '      <section class="hb-prompt-box" aria-labelledby="hb-prompt-title">\n' +
    '        <h2 class="hb-label" id="hb-prompt-title">Prompt</h2>\n' +
    `        <p class="hb-prompt">${escapeHtml(demo.prompt)}</p>\n` +
    '      </section>\n' +
    '    </div>\n';
  out = replaceOnce(out, /([ \t]*)<\/aside>\n<\/div>\n/, (m, indent) => `${take}${indent}</aside>\n</main>\n`, 'aside close');

  // Markers the shared script looks for, then one-off edits.
  for (const [id, attrs] of Object.entries(demo.attrs || {})) {
    out = replaceOnce(out, `id="${id}"`, `id="${id}" ${attrs}`, `attrs for #${id}`);
  }
  for (const [find, replacement] of demo.edits || []) {
    out = replaceOnce(out, find, replacement, `edit "${find.slice(0, 40)}"`);
  }
  return out;
}

function main(argv) {
  const [configPath, ...only] = argv;
  if (!configPath) {
    console.error('Usage: node tools/migrate-demo.js <config.json> [slug ...]');
    process.exit(2);
  }
  const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const demos = cfg.demos.filter(d => !only.length || only.includes(d.slug));
  if (only.length && demos.length !== only.length) throw new Error(`unknown slug in: ${only.join(', ')}`);
  const root = path.resolve(__dirname, '..');
  for (const demo of demos) {
    const file = path.join(root, 'animations', cfg.category, demo.slug, 'index.html');
    fs.writeFileSync(file, migrate(fs.readFileSync(file, 'utf8'), cfg, demo));
    console.log('migrated', path.relative(root, file));
  }
}

if (require.main === module) main(process.argv.slice(2));
module.exports = { migrate, topBar, replaceOnce };
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `node --test "tests/*.test.js"`
Expected: PASS — 20 tests (11 from Task 1, 9 new), 0 failures.

- [ ] **Step 6: Commit**

```bash
git add tools/migrate-demo.js tests/migrate.test.js tests/fixtures/legacy-demo.html
git commit -m "feat: add a migration tool for moving demos to the shared layout"
```

---

### Task 3: Fonts, shared stylesheet and the first converted page (Bounce In)

**Files:**
- Create: `assets/fonts/schibsted-latin.woff2`, `assets/fonts/schibsted-latin-ext.woff2` (download)
- Create: `assets/css/handbook.css`
- Create: `tools/migrations/02-entrance-and-exit.json`
- Create: `tests/pages.test.js`
- Modify: `animations/02-entrance-and-exit/bounce-in/index.html` (by the migration tool)

**Interfaces:**
- Consumes: the markup contract from Task 2; the category accent `--ui-accent` that every demo already defines in its `:root`.
- Produces: CSS classes used by Task 4's script: `.hb-clamp`, `.hb-set`, `.hb-copy`, `.hb-more`, `.hb-replay`, `.hb-details`, `.hb-details-in`, `.hb-back`, `.hb-about`, `.hb-extra`, `.hb-full`, `.hb-full-text`, `.hb-related`, `.hb-rel-list`, `.hb-rel`, `.hb-note`; the font family name `'Schibsted Grotesk'` and variable `--hb-font`.

- [ ] **Step 1: Get the user's approval, then download the font files**

Ask the user before downloading: "May I download two font files from Google Fonts (fonts.gstatic.com, SIL Open Font License) into `assets/fonts/`: `schibsted-latin.woff2` (46,752 bytes) and `schibsted-latin-ext.woff2` (20,924 bytes)?" Continue only after a clear yes. Then run:

```bash
curl -sSfo assets/fonts/schibsted-latin.woff2 "https://fonts.gstatic.com/s/schibstedgrotesk/v7/Jqz55SSPQuCQF3t8uOwiUL-taUTtap9Gayo.woff2"
curl -sSfo assets/fonts/schibsted-latin-ext.woff2 "https://fonts.gstatic.com/s/schibstedgrotesk/v7/Jqz55SSPQuCQF3t8uOwiUL-taUTtap9Iayoxdg.woff2"
wc -c assets/fonts/schibsted-latin*.woff2 && head -c 4 assets/fonts/schibsted-latin.woff2 && echo && head -c 4 assets/fonts/schibsted-latin-ext.woff2 && echo
```

Expected: `46752` and `20924` bytes, and each file starts with `wOF2`.

- [ ] **Step 2: Write the failing page test**

Create `tests/pages.test.js`:

```js
// Static checks for demo pages that use the shared layout, their READMEs and the home page.
// Run from the repo root: node --test "tests/*.test.js"
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const ANIM = path.join(ROOT, 'animations');
const read = f => fs.readFileSync(f, 'utf8');
const count = (s, sub) => s.split(sub).length - 1;
const words = s => s.trim().split(/\s+/).length;
const isDemoDir = dir => fs.existsSync(path.join(dir, 'index.html'));

const demos = fs.readdirSync(ANIM, { withFileTypes: true }).filter(c => c.isDirectory()).flatMap(c =>
  fs.readdirSync(path.join(ANIM, c.name), { withFileTypes: true }).filter(d => d.isDirectory())
    .map(d => ({ cat: c.name, slug: d.name, dir: path.join(ANIM, c.name, d.name) })));
const converted = demos.filter(d => read(path.join(d.dir, 'index.html')).includes('<main class="hb-view">'));

const PILOT = '02-entrance-and-exit';
const PILOT_AUTOPLAY = new Set(['fade-in-out', 'slide-in', 'slide-up-reveal', 'scale-in', 'clip-path-reveal',
  'split-text-reveal', 'letter-by-letter-stagger', 'word-by-word-reveal', 'blur-in', 'flip-in', 'bounce-in', 'rotate-in']);

test('Bounce In uses the shared layout', () => {
  assert.ok(converted.some(d => d.cat === PILOT && d.slug === 'bounce-in'));
});

for (const d of converted) {
  test(`${d.cat}/${d.slug} uses the shared layout correctly`, () => {
    const html = read(path.join(d.dir, 'index.html'));
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
```

Run: `node --test "tests/*.test.js"`
Expected: FAIL — `Bounce In uses the shared layout`.

- [ ] **Step 3: Write the shared stylesheet**

Create `assets/css/handbook.css`:

```css
/* Animation Handbook — shared page chrome for the demo pages.
   Linked after each demo's own <style>, so these rules win where they overlap.
   The animation itself keeps its own styles; only the layout around it lives here. */

@font-face{font-family:'Schibsted Grotesk';src:url('../fonts/schibsted-latin-ext.woff2') format('woff2');font-weight:400 900;font-style:normal;font-display:swap;
  unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:'Schibsted Grotesk';src:url('../fonts/schibsted-latin.woff2') format('woff2');font-weight:400 900;font-style:normal;font-display:swap;
  unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}

:root{
  --hb-font:'Schibsted Grotesk',system-ui,-apple-system,'Segoe UI',sans-serif;
  --disp:var(--hb-font);--mono:var(--hb-font);
  --hb-bg:#0b0b0d;--hb-panel:#111114;--hb-panel-2:#0d0d10;
  --hb-ink:#f4f4f2;--hb-dim:#adadb2;--hb-muted:#77777e;--hb-line:rgba(255,255,255,.085);
  --hb-accent:var(--ui-accent,#6ea8ff);--hb-bar:48px;
}

body.hb{margin:0;padding:0;background:var(--hb-bg);color:var(--hb-ink);font-family:var(--hb-font);-webkit-font-smoothing:antialiased}
body.hb :focus-visible{outline:2px solid var(--hb-accent);outline-offset:2px}

/* Top bar */
.hb-bar{position:sticky;top:0;z-index:50;height:var(--hb-bar);display:flex;align-items:center;justify-content:space-between;gap:8px;
  padding:0 clamp(6px,1.6vw,16px);background:rgba(11,11,13,.88);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);
  border-bottom:1px solid var(--hb-line);font:500 11px/1 var(--hb-font);letter-spacing:.1em;text-transform:uppercase}
.hb-bar a{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:44px;min-width:44px;padding:0 8px;
  border-radius:6px;color:var(--hb-muted);text-decoration:none}
.hb-bar a:hover{color:var(--hb-ink)}
.hb-bar .hb-home{color:var(--hb-ink)}
.hb-pager{display:flex}

/* First screen: the stage fills the view, the side column sits beside it */
.hb-view{display:grid;grid-template-columns:minmax(0,1fr) clamp(300px,27vw,370px);grid-template-rows:minmax(0,1fr);
  grid-template-areas:"stage side";gap:clamp(10px,1.2vw,16px);padding:clamp(10px,1.2vw,16px);box-sizing:border-box;
  height:calc(100vh - var(--hb-bar));height:calc(100dvh - var(--hb-bar));min-height:560px}
.hb-view>.stage{grid-area:stage;width:auto;height:auto;min-width:0;min-height:0;flex:none;margin:0}
.hb-replay{grid-area:stage;align-self:end;justify-self:end;position:relative;z-index:3;margin:12px;min-height:44px;padding:0 16px;
  border:1px solid var(--hb-line);border-radius:999px;background:rgba(17,17,20,.85);color:var(--hb-dim);font:500 12px/1 var(--hb-font);cursor:pointer}
.hb-replay:hover{color:var(--hb-ink);border-color:rgba(255,255,255,.25)}

.hb-view>.hb-side{grid-area:side;width:auto;min-width:0;min-height:0;overflow-y:auto;display:flex;flex-direction:column;gap:18px;
  padding:18px 18px 0;background:var(--hb-panel);border:1px solid var(--hb-line);border-radius:10px}
.hb-head{margin:0}
.hb-cat{margin:0;font:500 11px/1.3 var(--hb-font);letter-spacing:.14em;text-transform:uppercase;color:var(--hb-accent)}
.hb-side .hb-head h1{margin:8px 0 0;font:800 clamp(28px,2.6vw,36px)/1 var(--hb-font);letter-spacing:-.03em;color:var(--hb-ink)}
.hb-side .hb-lede{margin:8px 0 0;font:400 13px/1.6 var(--hb-font);color:var(--hb-dim)}
.hb-label{margin:0 0 8px;font:500 11px/1 var(--hb-font);letter-spacing:.14em;text-transform:uppercase;color:var(--hb-muted)}

/* Settings: the demo's own controls, restyled compactly */
.hb-settings{display:flex;flex-direction:column;gap:10px}
.hb-settings .lbl{margin:0;font:500 12px/1.3 var(--hb-font);letter-spacing:0;text-transform:none;color:var(--hb-dim)}
.hb-settings div:has(>.sr){display:grid;grid-template-columns:1fr auto;grid-template-areas:"label value" "slider slider";column-gap:10px}
.hb-settings div:has(>.sr)>.lbl{grid-area:label}
.hb-settings .sr{display:contents}
.hb-settings .sr input[type=range]{grid-area:slider;width:100%;min-height:30px;margin:0;accent-color:var(--hb-accent);cursor:pointer}
.hb-settings .sv{grid-area:value;width:auto;font:500 12px/1.3 var(--hb-font);color:var(--hb-ink);text-align:right}
.hb-settings div:has(>select){display:flex;align-items:center;justify-content:space-between;gap:10px}
.hb-settings select,.hb-settings input[type=text],.hb-settings textarea{min-height:32px;padding:6px 8px;border:1px solid var(--hb-line);
  border-radius:6px;background:var(--hb-panel-2);color:var(--hb-ink);font:500 12px/1.4 var(--hb-font)}
.hb-settings input[type=text],.hb-settings textarea{width:100%;font-weight:400}
.hb-settings .seg{display:flex;flex-wrap:wrap;gap:4px}
.hb-settings .seg button{flex:1 1 0;min-width:0;min-height:36px;padding:6px 4px;border:1px solid var(--hb-line);border-radius:6px;
  background:none;color:var(--hb-muted);font:500 12px/1.2 var(--hb-font);cursor:pointer}
.hb-settings .seg button.on{border-color:var(--hb-accent);color:var(--hb-accent);background:color-mix(in srgb,var(--hb-accent) 12%,transparent)}
.hb-settings .tog{display:flex;flex-direction:row-reverse;align-items:center;justify-content:space-between;gap:10px;min-height:36px;
  font:500 12px/1.3 var(--hb-font);color:var(--hb-dim);cursor:pointer}
.hb-settings .tog input{appearance:none;-webkit-appearance:none;flex:none;width:36px;height:20px;margin:0;border-radius:999px;cursor:pointer;
  background:radial-gradient(circle at 10px 50%,var(--hb-ink) 6.5px,transparent 7px) #2a2a30}
.hb-settings .tog input:checked{background:radial-gradient(circle at 26px 50%,#0b0b0d 6.5px,transparent 7px) var(--hb-accent)}
.hb-settings .kv{display:flex;justify-content:space-between;gap:10px;font:400 12px/1.4 var(--hb-font);color:var(--hb-muted)}
.hb-settings .kv .v{color:var(--hb-ink)}
.hb-settings .div{height:1px;margin:2px 0;background:var(--hb-line)}
.hb-settings .btn-row{display:flex;gap:6px}
.hb-settings .act{flex:1;min-height:36px;padding:0 6px;border:1px solid var(--hb-line);border-radius:6px;background:none;
  color:var(--hb-ink);font:500 12px/1 var(--hb-font);cursor:pointer}
.hb-settings .act.pri{border-color:var(--hb-accent);color:var(--hb-accent)}

/* Prompt box and Read more stay visible at the bottom of the column */
.hb-take{margin-top:auto;position:sticky;bottom:0;display:flex;flex-direction:column;gap:10px;padding:12px 0 18px;background:var(--hb-panel)}
.hb-prompt-box{padding:12px;border:1px solid var(--hb-line);border-radius:8px;background:var(--hb-panel-2)}
.hb-prompt{margin:0;font:400 13px/1.6 var(--hb-font);color:var(--hb-ink)}
.hb-clamp{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.hb-set{margin:8px 0 0;font:500 12px/1.5 var(--hb-font);color:var(--hb-accent)}
.hb-copy{display:block;width:100%;margin-top:10px;min-height:44px;border:0;border-radius:6px;background:var(--hb-ink);color:#0b0b0d;
  font:600 12px/1 var(--hb-font);letter-spacing:.04em;cursor:pointer}
.hb-copy:hover{background:#fff}
.hb-more{width:100%;min-height:44px;border:1px solid var(--hb-line);border-radius:6px;background:none;color:var(--hb-dim);
  font:500 12px/1 var(--hb-font);cursor:pointer}
.hb-more:hover{color:var(--hb-ink);border-color:rgba(255,255,255,.25)}

/* Read more: the explanation below the first screen */
.hb-details{border-top:1px solid var(--hb-line);scroll-margin-top:var(--hb-bar)}
.hb-details-in{max-width:1120px;margin:0 auto;padding:clamp(20px,3vw,40px) clamp(16px,3vw,32px) 96px;display:grid;
  grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:clamp(20px,4vw,56px)}
.hb-details .hb-back{grid-column:1/-1;justify-self:start;display:inline-flex;align-items:center;min-height:44px;color:var(--hb-muted);
  text-decoration:none;font:500 11px/1 var(--hb-font);letter-spacing:.1em;text-transform:uppercase}
.hb-details .hb-back:hover{color:var(--hb-ink)}
.hb-details h2{margin:0 0 10px;font:700 20px/1.2 var(--hb-font);letter-spacing:-.01em;color:var(--hb-ink)}
.hb-details section+section{margin-top:34px}
.hb-details p,.hb-details li,.hb-details dd{margin:0;font:400 14px/1.75 var(--hb-font);color:var(--hb-dim)}
.hb-details p+p{margin-top:10px}
.hb-details ul{margin:0;padding:0;list-style:none}
.hb-details li{position:relative;padding-left:18px}
.hb-details li+li{margin-top:4px}
.hb-details li::before{content:"–";position:absolute;left:0;color:var(--hb-accent)}
.hb-details a{color:var(--hb-ink)}
.hb-details dl{margin:0;display:grid;grid-template-columns:minmax(120px,auto) 1fr;gap:12px 20px}
.hb-details dt{font:500 14px/1.5 var(--hb-font);color:var(--hb-ink)}
.hb-details dt small{display:block;font:400 12px/1.4 var(--hb-font);color:var(--hb-muted)}
.hb-full{padding:16px;border:1px solid var(--hb-line);border-radius:10px;background:var(--hb-panel)}
.hb-details .hb-full-text{color:var(--hb-ink);line-height:1.7}
.hb-details .hb-set{margin-top:8px;font:500 12px/1.5 var(--hb-font);color:var(--hb-accent)}
.hb-rel{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--hb-line);
  border-radius:8px;text-decoration:none}
.hb-rel+.hb-rel{margin-top:8px}
.hb-rel:hover{border-color:rgba(255,255,255,.25)}
.hb-rel b{display:block;font:700 16px/1.3 var(--hb-font);color:var(--hb-ink)}
.hb-rel small{display:block;margin-top:2px;font:400 12px/1.5 var(--hb-font);color:var(--hb-muted)}
.hb-rel i{font-style:normal;color:var(--hb-muted)}
.hb-details .hb-note{color:var(--hb-muted)}

@media(max-width:1024px){.hb-view{grid-template-columns:minmax(0,1fr) 300px}}
@media(max-width:760px){.hb-details-in{grid-template-columns:1fr}}
@media(max-width:600px){
  .hb-bar .hb-name{display:none}
  .hb-view{grid-template-columns:minmax(0,1fr);grid-template-rows:auto auto;grid-template-areas:"stage" "side";height:auto;min-height:0}
  .hb-view>.stage{height:calc(100vh * .56);height:calc(100svh * .56);min-height:320px}
  .hb-view>.hb-side{overflow:visible}
  .hb-take{position:static}
  .hb-settings .sr input[type=range],.hb-settings .seg button,.hb-settings .act,.hb-settings .tog,.hb-settings select{min-height:44px}
}
```

- [ ] **Step 4: Write the pilot config with Bounce In**

Create `tools/migrations/02-entrance-and-exit.json`:

```json
{
  "category": "02-entrance-and-exit",
  "name": "Entrance & Exit",
  "demos": [
    {
      "slug": "bounce-in",
      "number": "02.12",
      "prev": { "href": "../flip-in/", "name": "Flip In" },
      "next": { "href": "../rotate-in/", "name": "Rotate In" },
      "autoplay": true,
      "attrs": { "btn-in": "data-hb-replay", "btn-rst": "data-hb-reset", "loop-tog": "data-hb-skip data-hb-loop" },
      "edits": [
        ["    <div class=\"div\"></div>\n    <div class=\"lbl\">Live keyframes</div>\n    <div class=\"kf-block\" id=\"kf-display\">", "    <div class=\"kf-block\" id=\"kf-display\" hidden>"]
      ],
      "lede": "Overshoots its final size and position, then springs back to rest.",
      "prompt": "Add a bounce-in entrance to [the element you want to animate]. When it appears, it should start small and a little below its final spot, grow slightly past full size, dip just under it, then settle, as if it landed with a small spring. Each bounce is smaller than the one before, like energy running out, and one bounce usually looks best. Unless the settings turn it off, fade it in at the same time. Animate only its position, size and opacity so it stays smooth. If the visitor has reduced motion turned on, show the element without the bounce. Match the settings listed below."
    }
  ]
}
```

(The edit removes the "Live keyframes" code readout from view. The element stays in the page, hidden, because the demo's script still writes to it.)

- [ ] **Step 5: Convert Bounce In**

Run: `node tools/migrate-demo.js tools/migrations/02-entrance-and-exit.json bounce-in`
Expected: `migrated animations\02-entrance-and-exit\bounce-in\index.html` (separator may be `/`).

- [ ] **Step 6: Run the tests to verify they pass**

Run: `node --test "tests/*.test.js"`
Expected: PASS — all tests, including `Bounce In uses the shared layout` and `02-entrance-and-exit/bounce-in uses the shared layout correctly`.

- [ ] **Step 7: Check the layout in the browser**

Start the site (Verification kit). Open `http://localhost:8731/animations/02-entrance-and-exit/bounce-in/` at 1280×800, 768×1024 and mobile. Confirm by eye or with `read_page`:
- the top bar shows `← Animation Handbook`, `‹ Flip In`, `Rotate In ›` (arrows only on mobile)
- the stage fills the left side; the side column shows `02.12 · Entrance & Exit`, `Bounce In`, the plain lede, Settings (restyled sliders with the value on the right, segmented buttons, switch-style toggles) and the Prompt box with the full prompt (the three-line clamp, settings line and buttons arrive in Task 4)
- the text is Schibsted Grotesk: in `javascript_tool`, `getComputedStyle(document.querySelector('h1')).fontFamily` starts with `"Schibsted Grotesk"` and `document.fonts.check('800 20px "Schibsted Grotesk"')` is `true`
- `read_console_messages` with `onlyErrors: true` shows no errors, and pressing **Play in** still plays the bounce

- [ ] **Step 8: Commit**

```bash
git add assets/fonts/schibsted-latin.woff2 assets/fonts/schibsted-latin-ext.woff2 assets/css/handbook.css tools/migrations/02-entrance-and-exit.json tests/pages.test.js animations/02-entrance-and-exit/bounce-in/index.html
git commit -m "feat: add the shared demo layout and fonts, and convert Bounce In"
```

---

### Task 4: Shared script — prompt box, Read more, Replay and auto-play

**Files:**
- Modify: `assets/js/handbook.js` (replace the whole file)

**Interfaces:**
- Consumes: Task 1 helpers; Task 2 markup contract; Task 3 CSS classes; demo markers `data-hb-replay`, `data-hb-reset`, `data-hb-loop`, `data-hb-skip`, `data-hb-label`, `body[data-hb-autoplay]`.
- Produces (added exports): `readSettings(doc: Document, scope: Element): Array<{ label, value }>`, `boot(doc: Document, win: Window): void`. Runs `boot` automatically in browsers.

- [ ] **Step 1: Run the unit tests (the helpers must keep passing)**

Run: `node --test "tests/*.test.js"`
Expected: PASS. These tests guard the helpers while the file is rewritten.

- [ ] **Step 2: Replace `assets/js/handbook.js` with the full version**

```js
/* Animation Handbook — shared behaviour for the demo pages.
 * Builds the prompt box (settings line + Copy prompt), "Read more" with the
 * explanation from the demo's README.md, and the stage's Replay button.
 * The pure helpers are exported for tests/handbook.test.js. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) { module.exports = api; return; }
  root.Handbook = api;
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

  // Inline Markdown from README prose. Inline code becomes plain text: the site shows no code.
  function inline(md) {
    return escapeHtml(md)
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
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

  function bullets(text) {
    return String(text || '').split('\n')
      .filter(function (l) { return /^\s*[-*]\s+/.test(l); })
      .map(function (l) { return inline(l.replace(/^\s*[-*]\s+/, '')); });
  }

  // "Duration (`--dur`)" becomes "Duration": parentheticals that hold code are dropped.
  function cleanName(s) {
    return plain(String(s).replace(/\s*\(`[^`]*`[^)]*\)/g, ''));
  }

  // The Key parameters table as [{ name, value, effect }], without its header and divider rows.
  function table(text) {
    var rows = String(text || '').split('\n')
      .filter(function (l) { return /^\s*\|/.test(l); })
      .map(function (l) {
        return l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(function (c) { return c.trim(); });
      });
    return rows.slice(1)
      .filter(function (r) { return !r.every(function (c) { return /^:?-{2,}:?$/.test(c); }); })
      .map(function (r) { return { name: cleanName(r[0] || ''), value: plain(r[1] || ''), effect: inline(r[2] || '') }; });
  }

  // "- [Name](../slug/) — description" lines as [{ name, href, desc }].
  function seeAlso(text) {
    return String(text || '').split('\n').map(function (l) {
      var m = /^\s*[-*]\s+\[([^\]]+)\]\(([^)\s]+)\)\s*(?:[—–-]\s*(.*))?$/.exec(l);
      return m ? { name: plain(m[1]), href: m[2], desc: m[3] ? inline(m[3]) : '' } : null;
    }).filter(Boolean);
  }

  function settingsLine(items) {
    return (items || [])
      .filter(function (i) { return i && i.label && i.value; })
      .map(function (i) { return i.label + ' ' + i.value; })
      .join(', ');
  }

  /* ---------- Page behaviour ---------- */

  var CONTROLS = 'input[type=range], input[type=checkbox], select, .seg, .swatches';

  function text(node) { return node ? node.textContent.replace(/\s+/g, ' ').trim() : ''; }

  function labelFor(doc, control) {
    var own = control.getAttribute('data-hb-label');
    if (own) return own;
    var by = control.getAttribute('aria-labelledby');
    if (by && doc.getElementById(by)) return text(doc.getElementById(by));
    var tog = control.closest('.tog');
    if (tog) return text(tog.querySelector('span') || tog);
    for (var p = control.previousElementSibling; p; p = p.previousElementSibling) {
      if (p.classList.contains('lbl')) return text(p);
    }
    return control.parentElement ? text(control.parentElement.querySelector(':scope > .lbl')) : '';
  }

  function valueFor(control) {
    if (control.matches('input[type=range]')) {
      var row = control.closest('.sr');
      var shown = row && row.querySelector('.sv');
      return shown ? text(shown) : control.value;
    }
    if (control.matches('input[type=checkbox]')) return control.checked ? 'on' : 'off';
    if (control.matches('select')) return control.selectedOptions[0] ? text(control.selectedOptions[0]) : control.value;
    var active = control.querySelector('.on');
    return active ? (active.getAttribute('aria-label') || text(active)) : '';
  }

  // The demo's current settings in page order, skipping playback controls and anything marked data-hb-skip.
  function readSettings(doc, scope) {
    return Array.prototype.filter.call(scope.querySelectorAll(CONTROLS), function (control) {
      return !control.closest('[data-hb-skip], [hidden], .btn-row');
    }).map(function (control) {
      return { label: labelFor(doc, control), value: valueFor(control) };
    });
  }

  function make(doc, tag, className, html) {
    var node = doc.createElement(tag);
    node.className = className;
    if (html) node.innerHTML = html;
    return node;
  }

  function renderAbout(md) {
    var s = sections(md), html = '';
    if (s['What it is']) html += '<section><h2>What it is</h2>' + paragraphs(s['What it is']) + '</section>';
    var uses = bullets(s['When to use it']);
    if (uses.length) {
      html += '<section><h2>When to use it</h2><ul>' +
        uses.map(function (u) { return '<li>' + u + '</li>'; }).join('') + '</ul></section>';
    }
    var params = table(s['Key parameters']);
    if (params.length) {
      html += '<section><h2>What the controls do</h2><dl>' + params.map(function (p) {
        return '<dt>' + p.name + (p.value ? '<small>default ' + p.value + '</small>' : '') + '</dt><dd>' + p.effect + '</dd>';
      }).join('') + '</dl></section>';
    }
    return { html: html, related: seeAlso(s['See also']) };
  }

  function loadReadme(doc, win, details) {
    var about = details.querySelector('.hb-about');
    var fallback = '<p class="hb-note">The full explanation is in <a href="README.md">README.md</a>.</p>';
    if (win.location.protocol === 'file:' || !win.fetch) { about.innerHTML = fallback; return; }
    win.fetch('README.md').then(function (res) {
      if (!res.ok) throw new Error('README ' + res.status);
      return res.text();
    }).then(function (md) {
      var out = renderAbout(md);
      about.innerHTML = out.html || fallback;
      if (!out.related.length) return;
      var box = details.querySelector('.hb-related');
      box.querySelector('.hb-rel-list').innerHTML = out.related.map(function (r) {
        return '<a class="hb-rel" href="' + escapeHtml(r.href) + '"><span><b>' + r.name + '</b>' +
          (r.desc ? '<small>' + r.desc + '</small>' : '') + '</span><i aria-hidden="true">→</i></a>';
      }).join('');
      box.hidden = false;
    }).catch(function () { about.innerHTML = fallback; });
  }

  function boot(doc, win) {
    var view = doc.querySelector('.hb-view');
    var side = view && view.querySelector('.hb-side');
    var promptEl = side && side.querySelector('.hb-prompt');
    if (!promptEl) return;

    var settings = side.querySelector('.hb-settings');
    var title = text(side.querySelector('h1'));
    var promptText = text(promptEl);
    var reduce = win.matchMedia ? win.matchMedia('(prefers-reduced-motion: reduce)') : null;
    var lines = [];

    function currentLine() { return settings ? settingsLine(readSettings(doc, settings)) : ''; }
    function copyText() {
      var line = currentLine();
      return promptText + (line ? '\n\nSettings from the demo: ' + line + '.' : '');
    }
    function refreshLines() {
      var line = currentLine();
      lines.forEach(function (node) { node.textContent = line ? 'Your settings: ' + line : ''; node.hidden = !line; });
    }
    function settingsNode() { var node = make(doc, 'p', 'hb-set'); lines.push(node); return node; }
    function copyButton() {
      var button = make(doc, 'button', 'hb-copy', 'Copy prompt');
      button.type = 'button';
      button.addEventListener('click', function () {
        function show(label) {
          button.textContent = label;
          win.setTimeout(function () { button.textContent = 'Copy prompt'; }, 1500);
        }
        function selectInstead() {
          var range = doc.createRange();
          range.selectNodeContents(promptEl);
          var selection = win.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          show(/Mac|iPhone|iPad/.test(win.navigator.platform || win.navigator.userAgent) ? 'Press ⌘C to copy' : 'Press Ctrl+C to copy');
        }
        var clip = win.navigator.clipboard;
        if (clip && clip.writeText) clip.writeText(copyText()).then(function () { show('Copied ✓'); }, selectInstead);
        else selectInstead();
      });
      return button;
    }
    function scrollBehavior() { return reduce && reduce.matches ? 'auto' : 'smooth'; }

    // Prompt box: three-line preview, the live settings line and Copy prompt.
    promptEl.classList.add('hb-clamp');
    var box = promptEl.closest('.hb-prompt-box') || promptEl.parentElement;
    box.appendChild(settingsNode());
    box.appendChild(copyButton());

    // Read more: the explanation, full prompt and related animations below the first screen.
    var details = make(doc, 'section', 'hb-details',
      '<div class="hb-details-in">' +
        '<a class="hb-back" href="#top">↑ Back to the demo</a>' +
        '<div class="hb-about"><p class="hb-note">Loading the explanation…</p></div>' +
        '<div class="hb-extra">' +
          '<section><h2>Full prompt</h2><div class="hb-full"><p class="hb-full-text"></p></div></section>' +
          '<section class="hb-related" hidden><h2>Related animations</h2><div class="hb-rel-list"></div></section>' +
        '</div>' +
      '</div>');
    details.id = 'details';
    details.hidden = true;
    details.setAttribute('aria-label', 'About ' + title);
    details.querySelector('.hb-full-text').textContent = promptText;
    var full = details.querySelector('.hb-full');
    full.appendChild(settingsNode());
    full.appendChild(copyButton());
    view.insertAdjacentElement('afterend', details);

    var more = make(doc, 'button', 'hb-more');
    more.type = 'button';
    more.setAttribute('aria-controls', 'details');
    (side.querySelector('.hb-take') || side).appendChild(more);
    function setOpen(open, scroll) {
      details.hidden = !open;
      more.setAttribute('aria-expanded', String(open));
      more.textContent = open ? 'Show less ↑' : 'Read more about ' + title + ' ↓';
      if (open && scroll) details.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    }
    setOpen(false, false);
    more.addEventListener('click', function () { setOpen(details.hidden, true); });
    details.querySelector('.hb-back').addEventListener('click', function (e) {
      e.preventDefault();
      win.scrollTo({ top: 0, behavior: scrollBehavior() });
    });
    if (win.location.hash === '#details') win.setTimeout(function () { setOpen(true, true); }, 300);
    loadReadme(doc, win, details);

    // Replay, auto-play and "changing a setting replays it" all press the demo's own buttons.
    var replayCtl = doc.querySelector('[data-hb-replay]');
    var resetCtl = doc.querySelector('[data-hb-reset]');
    var loopCtl = doc.querySelector('[data-hb-loop]');
    function replay() {
      if (resetCtl) resetCtl.click();
      win.requestAnimationFrame(function () {
        win.requestAnimationFrame(function () { replayCtl.click(); });
      });
    }
    if (replayCtl) {
      var replayButton = make(doc, 'button', 'hb-replay', '↻ Replay');
      replayButton.type = 'button';
      replayButton.setAttribute('aria-label', 'Replay the animation');
      replayButton.addEventListener('click', replay);
      view.appendChild(replayButton);
      if (doc.body.hasAttribute('data-hb-autoplay')) win.setTimeout(function () { replayCtl.click(); }, 400);
    }

    var timer = 0;
    function onSettingsChange(e) {
      var target = e.target;
      if (e.type === 'click' && !target.closest('.seg, .swatches')) return;
      if (target.closest('.btn-row, [data-hb-loop]')) return;
      win.setTimeout(refreshLines, 0);
      if (!replayCtl || (loopCtl && loopCtl.checked)) return;
      win.clearTimeout(timer);
      timer = win.setTimeout(replay, 250);
    }
    if (settings) {
      ['input', 'change', 'click'].forEach(function (type) { settings.addEventListener(type, onSettingsChange); });
    }
    refreshLines();
  }

  return {
    escapeHtml: escapeHtml, plain: plain, inline: inline, sections: sections, paragraphs: paragraphs,
    bullets: bullets, cleanName: cleanName, table: table, seeAlso: seeAlso, settingsLine: settingsLine,
    readSettings: readSettings, boot: boot
  };
});
```

- [ ] **Step 3: Run the unit tests**

Run: `node --test "tests/*.test.js"`
Expected: PASS — all tests.

- [ ] **Step 4: Check Bounce In in the browser**

Reload `http://localhost:8731/animations/02-entrance-and-exit/bounce-in/` and run the Page check (Verification kit) at 1280×800, 768×1024 and mobile. Expected values are listed in the kit; for Bounce In, the initial settings line is `Your settings: Overshoot intensity 60%, Duration 1100ms, Bounces 1× Single, Combine with fade on`. Also confirm by hand:
- the card bounces in on its own about 0.4s after load
- **↻ Replay** (bottom-right of the stage) replays it; changing Overshoot or picking **2× Double** replays it after a short pause
- turning on **Auto-loop**, then changing a setting, does not stop the loop
- `http://localhost:8731/animations/02-entrance-and-exit/bounce-in/#details` opens with the details already expanded
Take desktop, phone and reduced-motion screenshots (Verification kit) and compare them with `samples/demo-page-design.html`: same structure and proportions. Under reduced motion the card is visible without bouncing.

- [ ] **Step 5: Commit**

```bash
git add assets/js/handbook.js
git commit -m "feat: add the prompt box, Read more, Replay and auto-play to the shared script"
```

---

### Task 5: Plain-language README pass for the 13 pilot demos

**Files:**
- Modify: `animations/02-entrance-and-exit/<slug>/README.md` for all 13 slugs below
- Modify: `tests/pages.test.js`

**Interfaces:**
- Consumes: `sections`, `table` from `assets/js/handbook.js`.
- Produces: READMEs whose "What it is" and "Key parameters" contain no backticks, with parameter names that match the on-page control labels.

- [ ] **Step 1: Add the failing README checks**

Append to `tests/pages.test.js`:

```js
const { sections, table } = require('../assets/js/handbook.js');
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
    const html = read(path.join(d.dir, 'index.html'));
    const panel = html.slice(html.indexOf('<section class="hb-settings"'), html.indexOf('<div class="hb-take">')).replace(/<[^>]+>/g, ' ');
    const rows = sections(read(path.join(d.dir, 'README.md')))['Key parameters'].split('\n').slice(2);
    for (const row of rows) {
      const name = (row.split('|')[1] || '').trim();
      if (name) assert.ok(panel.includes(name), `control label "${name}"`);
    }
  });
}
```

Run: `node --test "tests/*.test.js"`
Expected: FAIL — the README checks for the 13 slugs (their sections still contain backticks) and the Bounce In control-name check (`Duration (--dur)` is not a label).

- [ ] **Step 2: Replace "What it is" and "Key parameters" in each README**

In each file, replace the body under `## What it is` (up to the next `## ` heading) and the body under `## Key parameters` (up to the next `## ` heading) with the text below. Leave every other section unchanged. Keep one blank line after each heading and before the next heading.

**`fade-in-out/README.md`**

```markdown
## What it is

A fade changes an element's opacity between invisible and fully visible: it fades in to appear and fades out to leave. It is the simplest entrance animation and one of the cheapest to run, because the browser only blends a layer it has already drawn. Since nothing moves or changes shape, a fade reads as a neutral appearance rather than a movement.
```

```markdown
## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Duration | 600ms | Under 150ms barely registers; over a second feels slow for interface elements |
| Easing | Ease out | Starts fast and settles gently, the natural feel for an entrance |
| Hold time | 0.8s | How long the element stays visible before Auto-loop fades it out again |
| Auto-loop | off | Repeats in, hold and out so you can watch it again |
```

**`slide-in/README.md`**

```markdown
## What it is

A slide-in moves an element from a short distance away into its final place. The motion has a direction (from the top, bottom, left or right), so the element seems to arrive from somewhere. Paired with a fade it feels like a natural entrance; on its own it can feel mechanical.
```

```markdown
## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Direction | Top | Which edge the element travels in from |
| Distance | 200px | Short distances (20 to 40px) suit subtle interface motion; long ones feel dramatic |
| Duration | 600ms | Longer distances need more time so the speed still feels believable |
| Easing | Ease out | Slows down into place; Springy adds a small overshoot |
| Combine with fade | on | A slide alone looks mechanical; the fade makes it read as an arrival |
```

**`slide-up-reveal/README.md`**

```markdown
## What it is

A slide-up reveal makes a line of text rise into view from behind an invisible edge, as if it is coming up from underneath a surface. The text moves, but everything below the line stays hidden, so only its arrival is visible. It is the classic entrance for headlines and hero copy.
```

```markdown
## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Technique | Move | Two ways to build it that look identical: moving the text up, or clipping it from below |
| Duration | 700ms | How long each line takes to rise |
| Easing | Smooth | Slows smoothly to a stop; Springy adds a slight settle |
| Line stagger | 60ms | Delay between lines; 40 to 80ms reads as a cascade |
| Multi-line (3 lines) | on | Shows three lines so you can see the stagger |
```

**`scale-in/README.md`**

```markdown
## What it is

A scale-in grows an element from a little smaller than its final size up to full size, usually while it fades in. The anchor point decides where it grows from: its own center, an edge or a corner. With a springy curve the slight overshoot makes the arrival feel physical, as if the element lands in place.
```

```markdown
## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Start scale | 0.80 | Close to 1 is subtle; below 0.5 reads as a big zoom |
| Duration | 500ms | A springy curve needs room to overshoot and settle; under 300ms cuts the bounce short |
| Easing | Springy | Adds the overshoot; Ease out gives a calmer arrival |
| Transform origin | Center | The point the element grows from |
| Combine with fade | on | Stops the element flashing at full strength while it is still tiny |
```

**`clip-path-reveal/README.md`**

```markdown
## What it is

A clip-path reveal uncovers an element by growing a mask shape until the whole element shows. The element is fully drawn the entire time; only the visible part grows. Because nothing moves or fades, the content stays crisp and in place while a shape wipes across it, which gives the effect its cinematic, editorial feel.
```

```markdown
## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Shape | Inset | Inset wipes in from an edge, Circle and Ellipse open like an iris, Swipe cuts in at an angle |
| Direction | Left | For the Inset shape, which side the wipe travels in from |
| Duration | 800ms | A reveal reads best a little slower than a fade, so the wipe can be seen |
| Easing | Smooth | The wipe slows to a stop instead of snapping |
```

**`curtain-reveal/README.md`**

```markdown
## What it is

A curtain reveal happens in three steps: a solid panel slides across the content to cover it, pauses, then slides off the far side to show it. Unlike a clip-path reveal, the content really is hidden behind the moving panel and then uncovered, so the eye notices a clear before and after. It is theatrical on purpose and suits content that deserves the drama.
```

```markdown
## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Curtain speed | 500ms | Time for one pass; the whole reveal takes about two passes plus the pause |
| Pause between | 300ms | The beat where the panel covers everything; it is what makes the change register |
| Direction | Left to right | Which way the panel travels, across or up and down |
| Two curtains (split) | off | Two panels meet in the middle, then part |
| Curtain color | Dark | Strong contrast with the content makes the reveal more dramatic |
```

**`split-text-reveal/README.md`**

```markdown
## What it is

A split-text reveal breaks text into pieces (characters, words or lines) and animates them one after another with a short delay between each. That delay turns a flat fade into a cascade that flows across the text. It is the basis of most animated headline entrances.
```

```markdown
## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Split mode | Words | Characters give the finest cascade, words a readable rhythm, lines a block reveal |
| Animation per unit | Fade up | The small entrance each piece plays: fade up, fade, scale or rotate |
| Stagger delay | 30ms | Delay between pieces; small values ripple, large values feel deliberate |
| Duration per unit | 500ms | How long each piece takes to animate |
| Easing | Smooth | The curve each piece uses; Springy adds a small settle |
```

**`letter-by-letter-stagger/README.md`**

```markdown
## What it is

A letter-by-letter stagger animates each character a moment after the previous one, so a phrase assembles as a cascade instead of appearing all at once. The demo shows two versions: a cascade where every letter plays a small entrance, and a typewriter that reveals letters one at a time behind a blinking cursor.
```

```markdown
## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Mode | Cascade | Cascade animates every letter in turn; Typewriter types them out behind a cursor |
| Per-letter animation | Fade up | The entrance each letter plays in Cascade mode: fade up, fade, scale or rotate |
| Per-letter delay | 35ms | Gap between letters; higher is slower and more theatrical |
| Duration per letter | 400ms | How long each letter takes to settle |
| Show cursor (typewriter) | on | The blinking cursor in Typewriter mode |
```

**`word-by-word-reveal/README.md`**

```markdown
## What it is

A word-by-word reveal animates each word of a passage in turn, rather than all at once or letter by letter. Words are how people read, so a delay of roughly 80 to 120 milliseconds per word follows the eye through a sentence: slow enough to feel intentional, fast enough that nobody waits.
```

```markdown
## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Per-word delay | 80ms | The reading-speed control; below about 40ms the words blur into one reveal |
| Per-word animation | Fade up | The entrance each word plays |
| Duration per word | 450ms | How long each word takes to settle |
| Easing | Smooth | Springy adds a bounce; Linear feels mechanical |
| Sentence pauses | off | Adds an extra pause between sentences |
```

**`blur-in/README.md`**

```markdown
## What it is

Blur In fades an element into view while it sharpens from a heavy blur to crisp focus, like a camera pulling focus onto a subject. The rising opacity and falling blur feel cinematic because they echo how a real lens resolves an image, unlike the flat look of a plain fade.
```

```markdown
## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Mode | Blur + Fade | The full effect; Blur only and Fade only show each half on its own |
| Starting blur | 20px | Higher is a more dramatic focus pull; past about 30px it looks like frosted glass |
| Duration | 700ms | Blur needs a little longer than a plain fade for the lens feel to land |
| Easing | Ease out | Slowing down mimics a lens settling; Linear feels robotic |
| Slight upward drift | on | A small rise while it sharpens, as if it is settling into place |
```

**`flip-in/README.md`**

```markdown
## What it is

Flip In swings an element from edge-on into full view in 3D, like a hinged panel turning toward you. The key detail is that the 3D perspective is set on the element's container, not on the card itself; without it, the turn collapses into a flat squash with no sense of depth.
```

```markdown
## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Flip axis | Y (horiz) | Which way it swings: around a vertical hinge, a horizontal one, or both |
| Starting rotation | 90° | The angle it starts from; 90° starts fully edge-on |
| Perspective | 1000px | How far away the viewer seems; lower is more dramatic, higher is subtler |
| Duration | 600ms | How long the swing takes; a Springy curve adds a satisfying settle |
| Easing | Ease out | Slows the swing as it comes to face you |
| Transform origin | Center | Where the hinge sits; an edge makes it swing from that side |
| Combine with fade | on | Fades it in while it turns |
```

**`bounce-in/README.md`**

```markdown
## What it is

Bounce In brings an element up from small and low, overshoots its final size and position, then springs back to rest, like something landing with momentum. A real bounce isn't one smooth curve: it's a few hand-placed steps, each going a little past the target and coming back.
```

```markdown
## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Overshoot intensity | 60% | How far past full size it grows; 0% means no bounce, 100% is exaggerated |
| Duration | 1100ms | Bounces need room to breathe; too short and the spring reads as a jitter |
| Bounces | 1× Single | How many times it overshoots; almost always one, since more looks cartoonish |
| Combine with fade | on | Whether it fades in while it bounces or is visible from the start |
```

**`rotate-in/README.md`**

```markdown
## What it is

Rotate In spins an element around its center as it enters, usually while it grows from small, so it reads as arriving rather than just turning in place. The spin is easiest to follow when the shape looks right at every angle, so it suits round or symmetric marks such as icons, stars, gears and badges, not text or wide rectangles.
```

```markdown
## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Starting rotation | -180° | The angle it starts from; a larger angle means more spin |
| Extra full rotations | 0× | Adds whole extra turns without changing where it lands |
| Direction | Counter-clockwise | Which way it spins |
| Duration | 600ms | Time for the whole spin |
| Easing | Springy | The overshoot makes the spin land rather than glide to a stop |
| Combine with scale | on | Growing from small turns a spin into an arrival |
| Combine with fade | on | Fades it in as it spins |
```

- [ ] **Step 3: Run the tests to verify they pass**

Run: `node --test "tests/*.test.js"`
Expected: PASS — including the 13 README checks and `bounce-in: every Key parameters name is a control on the page`.

- [ ] **Step 4: Check the rendered explanation**

Reload Bounce In in the browser, click **Read more about Bounce In**. "What it is" shows the new plain paragraph; "What the controls do" lists Overshoot intensity, Duration, Bounces and Combine with fade with their defaults.

- [ ] **Step 5: Commit**

```bash
git add animations/02-entrance-and-exit/*/README.md tests/pages.test.js
git commit -m "docs: rewrite the Entrance & Exit explanations in plain language"
```

---

### Task 6: Convert Fade In/Out, Slide In, Slide Up Reveal, Scale In, Clip-Path Reveal and Curtain Reveal

**Files:**
- Modify: `tools/migrations/02-entrance-and-exit.json`
- Modify: `animations/02-entrance-and-exit/{fade-in-out,slide-in,slide-up-reveal,scale-in,clip-path-reveal,curtain-reveal}/index.html` (by the tool)

**Interfaces:**
- Consumes: `migrate` CLI (Task 2), shared CSS/JS (Tasks 3–4), README pass (Task 5).
- Produces: six more converted pages.

- [ ] **Step 1: Add a failing expectation**

In `tests/pages.test.js`, replace the test `Bounce In uses the shared layout` with:

```js
test('the converted Entrance & Exit demos include this batch', () => {
  const done = new Set(converted.filter(d => d.cat === PILOT).map(d => d.slug));
  for (const slug of ['bounce-in', 'fade-in-out', 'slide-in', 'slide-up-reveal', 'scale-in', 'clip-path-reveal', 'curtain-reveal']) {
    assert.ok(done.has(slug), `${slug} is converted`);
  }
});
```

Run: `node --test "tests/*.test.js"`
Expected: FAIL — `fade-in-out is converted`.

- [ ] **Step 2: Add the six entries to the config**

Append these objects to the `demos` array in `tools/migrations/02-entrance-and-exit.json` (after the Bounce In entry, separated by commas):

```json
{
  "slug": "fade-in-out",
  "number": "02.01",
  "prev": null,
  "next": { "href": "../slide-in/", "name": "Slide In" },
  "autoplay": true,
  "attrs": { "btn-in": "data-hb-replay", "btn-rst": "data-hb-reset", "loop-tog": "data-hb-skip data-hb-loop", "hold-sl": "data-hb-skip" },
  "edits": [],
  "lede": "Goes from invisible to visible to enter, and back again to leave.",
  "prompt": "Add a fade-in and fade-out to [the element you want to show and hide]. When it appears, it should go smoothly from fully transparent to fully visible, and when it leaves it should do the reverse. Nothing moves or changes size; only the opacity changes, which keeps the animation smooth because the browser doesn't need to repaint. Reserve the element's space while it is invisible so the layout doesn't jump, and make sure a hidden element can't be clicked or focused. If the visitor has reduced motion turned on, show and hide it instantly or with a very short fade. Match the settings listed below."
},
{
  "slug": "slide-in",
  "number": "02.02",
  "prev": { "href": "../fade-in-out/", "name": "Fade In / Fade Out" },
  "next": { "href": "../slide-up-reveal/", "name": "Slide Up Reveal" },
  "autoplay": true,
  "attrs": { "btn-in": "data-hb-replay", "btn-rst": "data-hb-reset", "loop-tog": "data-hb-skip data-hb-loop" },
  "edits": [
    ["<button data-dir=\"top\" class=\"on\">↑ Top</button>", "<button data-dir=\"top\" class=\"on\" aria-label=\"From the top\">↑ Top</button>"],
    ["<button data-dir=\"bottom\">↓ Bot</button>", "<button data-dir=\"bottom\" aria-label=\"From the bottom\">↓ Bot</button>"],
    ["<button data-dir=\"left\">← Left</button>", "<button data-dir=\"left\" aria-label=\"From the left\">← Left</button>"],
    ["<button data-dir=\"right\">→ Right</button>", "<button data-dir=\"right\" aria-label=\"From the right\">→ Right</button>"]
  ],
  "lede": "Travels into place from one edge, with or without a fade.",
  "prompt": "Add a slide-in entrance to [the element you want to animate]. It should start a short distance away from its final position, on the side given in the settings, and travel into place, slowing down as it arrives so it feels like it came from somewhere. Unless the settings turn it off, fade it in during the slide too, because a slide on its own tends to look mechanical. Give longer distances a little more time so the speed still feels natural. Move it without changing the layout, so nothing around it shifts. If the visitor has reduced motion turned on, skip the travel and simply show it. Match the settings listed below."
},
{
  "slug": "slide-up-reveal",
  "number": "02.03",
  "prev": { "href": "../slide-in/", "name": "Slide In" },
  "next": { "href": "../scale-in/", "name": "Scale In / Zoom In" },
  "autoplay": true,
  "attrs": { "btn-in": "data-hb-replay", "btn-rst": "data-hb-reset", "loop-tog": "data-hb-skip data-hb-loop", "method-seg": "data-hb-skip", "multi-tog": "data-hb-skip" },
  "edits": [
    ["<div class=\"kv\"><span>Technique</span><span class=\"v\" id=\"tech-val\">", "<div class=\"kv\" hidden><span>Technique</span><span class=\"v\" id=\"tech-val\">"],
    ["<button data-m=\"translatey\" class=\"on\">translateY</button>", "<button data-m=\"translatey\" class=\"on\">Move</button>"],
    ["<button data-m=\"clippath\">clip-path</button>", "<button data-m=\"clippath\">Clip</button>"]
  ],
  "lede": "Text rises into view from behind an invisible edge.",
  "prompt": "Add a slide-up reveal to [your headline or lines of text]. Each line should rise into place from just below an invisible edge, as if it is coming up from behind a solid surface: the text moves, but anything below the line stays hidden, so viewers only see it arrive. When there are several lines, start each one a moment after the line above it so they cascade. The text must stay readable by screen readers and search engines the whole time. If the visitor has reduced motion turned on, show the text immediately without the rise. Match the settings listed below."
},
{
  "slug": "scale-in",
  "number": "02.04",
  "prev": { "href": "../slide-up-reveal/", "name": "Slide Up Reveal" },
  "next": { "href": "../clip-path-reveal/", "name": "Clip-Path Reveal" },
  "autoplay": true,
  "attrs": { "btn-in": "data-hb-replay", "btn-rst": "data-hb-reset", "loop-tog": "data-hb-skip data-hb-loop" },
  "edits": [
    ["<button data-o=\"top left\">Top-L</button>", "<button data-o=\"top left\" aria-label=\"Top left\">Top-L</button>"],
    ["<button data-o=\"bottom center\">Bot</button>", "<button data-o=\"bottom center\" aria-label=\"Bottom\">Bot</button>"]
  ],
  "lede": "Grows from slightly smaller to full size, from a point you choose.",
  "prompt": "Add a scale-in entrance to [the element you want to animate]. It should start a little smaller than its final size and grow to full size, anchored at the point given in the settings: its center, or an edge or corner so it seems to grow out of the button that opened it. A springy curve lets it overshoot slightly and settle, which makes the arrival feel physical. Unless the settings turn it off, fade it in while it grows so it never flashes at full strength while it is still tiny. Animate only its size and opacity. If the visitor has reduced motion turned on, show it at full size without the zoom. Match the settings listed below."
},
{
  "slug": "clip-path-reveal",
  "number": "02.05",
  "prev": { "href": "../scale-in/", "name": "Scale In / Zoom In" },
  "next": { "href": "../curtain-reveal/", "name": "Curtain Reveal" },
  "autoplay": true,
  "attrs": { "btn-in": "data-hb-replay", "btn-rst": "data-hb-reset", "loop-tog": "data-hb-skip data-hb-loop", "outline-tog": "data-hb-skip" },
  "edits": [
    ["<div class=\"kv\"><span>clip-path</span><span class=\"v\" id=\"cp-val\">", "<div class=\"kv\" hidden><span>clip-path</span><span class=\"v\" id=\"cp-val\">"],
    ["<button data-d=\"left\" class=\"on\">←</button>", "<button data-d=\"left\" class=\"on\" aria-label=\"From the left\">←</button>"],
    ["<button data-d=\"right\">→</button>", "<button data-d=\"right\" aria-label=\"From the right\">→</button>"],
    ["<button data-d=\"top\">↑</button>", "<button data-d=\"top\" aria-label=\"From the top\">↑</button>"],
    ["<button data-d=\"bottom\">↓</button>", "<button data-d=\"bottom\" aria-label=\"From the bottom\">↓</button>"],
    ["<button data-d=\"center\">⊙</button>", "<button data-d=\"center\" aria-label=\"From the center\">⊙</button>"]
  ],
  "lede": "A shape uncovers the element while it stays perfectly still.",
  "prompt": "Add a mask reveal to [the image or block you want to reveal]. The element should stay completely still and fully drawn while a shape uncovers it, like a window opening: an edge wipe that travels in from one side, a circle or ellipse that opens from the middle, or an angled swipe. Nothing moves, fades or changes size; only the visible area grows until the whole element shows. Let the wipe slow down as it finishes instead of stopping abruptly. The content must stay accessible even while part of it is hidden. If the visitor has reduced motion turned on, show it fully without the wipe. Match the settings listed below."
},
{
  "slug": "curtain-reveal",
  "number": "02.06",
  "prev": { "href": "../clip-path-reveal/", "name": "Clip-Path Reveal" },
  "next": { "href": "../split-text-reveal/", "name": "Split Text Reveal" },
  "autoplay": false,
  "attrs": { "btn-play": "data-hb-replay", "btn-rst": "data-hb-reset", "loop-tog": "data-hb-skip data-hb-loop" },
  "edits": [
    ["<button data-ax=\"h\" data-dir=\"ltr\" class=\"on\">→ L→R</button>", "<button data-ax=\"h\" data-dir=\"ltr\" class=\"on\" aria-label=\"Left to right\">→ L→R</button>"],
    ["<button data-ax=\"h\" data-dir=\"rtl\">← R→L</button>", "<button data-ax=\"h\" data-dir=\"rtl\" aria-label=\"Right to left\">← R→L</button>"],
    ["<button data-ax=\"v\" data-dir=\"ttb\">↓ Top</button>", "<button data-ax=\"v\" data-dir=\"ttb\" aria-label=\"Top to bottom\">↓ Top</button>"],
    ["<button data-ax=\"v\" data-dir=\"btt\">↑ Bot</button>", "<button data-ax=\"v\" data-dir=\"btt\" aria-label=\"Bottom to top\">↑ Bot</button>"]
  ],
  "lede": "A colored panel covers the content, then slides away to reveal it.",
  "prompt": "Add a curtain reveal to [the content you want to reveal]. A solid colored panel should slide across and cover the content completely, pause for a beat, then keep going and slide off the far side, leaving the content visible. The pause is what makes the change register, so keep it. In split mode, two panels come in from opposite sides, meet in the middle, then part. Pick a panel color that contrasts strongly with the content. Move the panels rather than resizing them so the motion stays smooth. If the visitor has reduced motion turned on, show the content without the curtain. Match the settings listed below."
}
```

Notes for this batch: Curtain Reveal already plays by itself 0.5s after load, so it does not get `data-hb-autoplay`. The `hidden` readouts show CSS code; they stay in the page because the demo scripts write to them. The aria-labels give arrow-only buttons readable names, which the settings line uses.

- [ ] **Step 3: Convert the six pages**

Run: `node tools/migrate-demo.js tools/migrations/02-entrance-and-exit.json fade-in-out slide-in slide-up-reveal scale-in clip-path-reveal curtain-reveal`
Expected: six `migrated …` lines and no error.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test "tests/*.test.js"`
Expected: PASS — including the six new per-page checks and their control-name checks.

- [ ] **Step 5: Check each page in the browser**

For each of the six pages, run the Page check at 1280×800 and mobile (Verification kit) and confirm no console errors. By hand:
- Fade In / Fade Out, Slide In, Slide Up Reveal, Scale In, Clip-Path Reveal play on their own after load; Curtain Reveal plays by itself as before
- Slide Up Reveal's Technique buttons read **Move** / **Clip** and no CSS text shows in the panel; Clip-Path Reveal shows no clip-path value in the panel
- the settings line uses readable words, e.g. Slide In: `Direction From the top`, Clip-Path Reveal: `Direction (inset) From the left`
- **Play out** still plays each exit animation and **Reset** still resets

- [ ] **Step 6: Commit**

```bash
git add tools/migrations/02-entrance-and-exit.json tests/pages.test.js animations/02-entrance-and-exit/fade-in-out/index.html animations/02-entrance-and-exit/slide-in/index.html animations/02-entrance-and-exit/slide-up-reveal/index.html animations/02-entrance-and-exit/scale-in/index.html animations/02-entrance-and-exit/clip-path-reveal/index.html animations/02-entrance-and-exit/curtain-reveal/index.html
git commit -m "feat: convert six more Entrance & Exit demos to the shared layout"
```

---

### Task 7: Convert Split Text Reveal, Letter-by-Letter Stagger, Word-by-Word Reveal, Blur In, Flip In and Rotate In

**Files:**
- Modify: `tools/migrations/02-entrance-and-exit.json`
- Modify: `animations/02-entrance-and-exit/{split-text-reveal,letter-by-letter-stagger,word-by-word-reveal,blur-in,flip-in,rotate-in}/index.html` (by the tool)
- Modify: `tests/pages.test.js`

**Interfaces:**
- Consumes: as Task 6.
- Produces: all 13 Entrance & Exit demos converted.

- [ ] **Step 1: Make the batch check require the whole category**

In `tests/pages.test.js`, replace the test `the converted Entrance & Exit demos include this batch` with:

```js
test('every Entrance & Exit demo uses the shared layout', () => {
  const left = demos.filter(d => d.cat === PILOT && !converted.includes(d)).map(d => d.slug);
  assert.deepEqual(left, []);
});
```

Run: `node --test "tests/*.test.js"`
Expected: FAIL — the remaining six slugs are listed.

- [ ] **Step 2: Add the six entries to the config**

Append to the `demos` array in `tools/migrations/02-entrance-and-exit.json`:

```json
{
  "slug": "split-text-reveal",
  "number": "02.07",
  "prev": { "href": "../curtain-reveal/", "name": "Curtain Reveal" },
  "next": { "href": "../letter-by-letter-stagger/", "name": "Letter-by-Letter Stagger" },
  "autoplay": true,
  "attrs": { "btn-in": "data-hb-replay", "btn-rst": "data-hb-reset", "loop-tog": "data-hb-skip data-hb-loop" },
  "edits": [
    ["<button data-a=\"fade-up\" class=\"on\">↑Fade</button>", "<button data-a=\"fade-up\" class=\"on\" aria-label=\"Fade up\">↑Fade</button>"]
  ],
  "lede": "Text breaks into pieces that animate in one after another.",
  "prompt": "Add a split-text reveal to [your headline]. Break the text into pieces (characters, words or lines) and animate each piece into view one after another with a short delay between them, so the text flows in as a cascade instead of appearing all at once. Every piece plays the same small entrance, such as fading up from slightly below. Screen readers should still read the text as one normal sentence, not as separate pieces, and the text must not reflow or jump while it animates. If the visitor has reduced motion turned on, show the text immediately. Match the settings listed below."
},
{
  "slug": "letter-by-letter-stagger",
  "number": "02.08",
  "prev": { "href": "../split-text-reveal/", "name": "Split Text Reveal" },
  "next": { "href": "../word-by-word-reveal/", "name": "Word-by-Word Reveal" },
  "autoplay": true,
  "attrs": { "btn-play": "data-hb-replay", "btn-rst": "data-hb-reset" },
  "edits": [
    ["<button data-a=\"fade-up\" class=\"on\">↑Fade</button>", "<button data-a=\"fade-up\" class=\"on\" aria-label=\"Fade up\">↑Fade</button>"]
  ],
  "lede": "A phrase assembles one letter at a time, as a cascade or a typewriter.",
  "prompt": "Add a letter-by-letter entrance to [a short phrase or headline]. In cascade mode, every letter plays a small entrance a moment after the previous one, so the phrase assembles from left to right. In typewriter mode, the letters appear one at a time behind a blinking cursor, as if someone is typing. Use it only on short phrases, because long text becomes tedious to wait for. Screen readers should hear the whole phrase once, not letter by letter. If the visitor has reduced motion turned on, show the full phrase immediately. Match the settings listed below."
},
{
  "slug": "word-by-word-reveal",
  "number": "02.09",
  "prev": { "href": "../letter-by-letter-stagger/", "name": "Letter-by-Letter Stagger" },
  "next": { "href": "../blur-in/", "name": "Blur In" },
  "autoplay": true,
  "attrs": { "btn-in": "data-hb-replay", "btn-rst": "data-hb-reset", "loop-tog": "data-hb-skip data-hb-loop" },
  "edits": [
    [">↑ Fade up</option>", ">Fade up</option>"]
  ],
  "lede": "Words appear one after another at a comfortable reading pace.",
  "prompt": "Add a word-by-word reveal to [the paragraph or quote you want to reveal]. Each word should appear a moment after the one before it, at roughly the pace people read, so the text builds up as if it is being spoken. If sentence pauses are on, wait a little longer at the end of each sentence before continuing. Keep the delay short enough that nobody waits for text they could already read. The full text must stay readable by screen readers and must not reflow while it appears. If the visitor has reduced motion turned on, show all the text at once. Match the settings listed below."
},
{
  "slug": "blur-in",
  "number": "02.10",
  "prev": { "href": "../word-by-word-reveal/", "name": "Word-by-Word Reveal" },
  "next": { "href": "../flip-in/", "name": "Flip In" },
  "autoplay": true,
  "attrs": { "btn-in": "data-hb-replay", "btn-rst": "data-hb-reset", "loop-tog": "data-hb-skip data-hb-loop" },
  "edits": [
    ["<span>+ Slight upward translate</span>", "<span>Slight upward drift</span>"]
  ],
  "lede": "Fades in while sharpening from blurred to crisp, like a camera focusing.",
  "prompt": "Add a blur-in entrance to [the element you want to animate]. It should start blurred and transparent, then sharpen into focus while it fades in, like a camera pulling focus onto the subject. It can also drift up slightly as it settles. Use it on one focal element at a time, not on a list or grid, because blur is expensive for the browser to draw. Remove the blur completely once the animation ends. If the visitor has reduced motion turned on, show the element sharp and visible without the effect. Match the settings listed below."
},
{
  "slug": "flip-in",
  "number": "02.11",
  "prev": { "href": "../blur-in/", "name": "Blur In" },
  "next": { "href": "../bounce-in/", "name": "Bounce In" },
  "autoplay": true,
  "attrs": { "btn-in": "data-hb-replay", "btn-rst": "data-hb-reset", "loop-tog": "data-hb-skip data-hb-loop" },
  "edits": [],
  "lede": "Swings into view in 3D, like a hinged card turning toward you.",
  "prompt": "Add a 3D flip-in entrance to [the card you want to animate]. The card should start turned edge-on, like a door seen from the side, and swing toward the viewer until it faces them flat. Give the card's container a 3D perspective so the swing has real depth; without it, the flip looks like a flat squash. The hinge can sit in the middle or along one edge, and the card can fade in while it turns. If the visitor has reduced motion turned on, show the card facing forward without the flip. Match the settings listed below."
},
{
  "slug": "rotate-in",
  "number": "02.13",
  "prev": { "href": "../bounce-in/", "name": "Bounce In" },
  "next": null,
  "autoplay": true,
  "attrs": { "btn-in": "data-hb-replay", "btn-rst": "data-hb-reset", "loop-tog": "data-hb-skip data-hb-loop" },
  "edits": [
    ["<button data-x=\"0\" class=\"on\">0×</button>", "<button data-x=\"0\" class=\"on\" aria-label=\"No extra turns\">0×</button>"],
    ["<button data-x=\"1\">+1×</button>", "<button data-x=\"1\" aria-label=\"One extra turn\">+1×</button>"],
    ["<button data-x=\"2\">+2×</button>", "<button data-x=\"2\" aria-label=\"Two extra turns\">+2×</button>"],
    ["<button data-d=\"ccw\" class=\"on\">↺ CCW</button>", "<button data-d=\"ccw\" class=\"on\" aria-label=\"Counter-clockwise\">↺ CCW</button>"],
    ["<button data-d=\"cw\">↻ CW</button>", "<button data-d=\"cw\" aria-label=\"Clockwise\">↻ CW</button>"]
  ],
  "lede": "Spins into place while growing, best for icons, stars and badges.",
  "prompt": "Add a rotate-in entrance to [the icon or badge you want to animate]. It should spin around its center as it appears, growing from small to full size at the same time, so it looks like it is arriving rather than just turning. Let it overshoot slightly and settle, so the spin lands instead of gliding to a stop. Use this on round or symmetric shapes like icons, stars, gears and badges; it looks wrong on text or wide rectangles. If the visitor has reduced motion turned on, show it in place without spinning. Match the settings listed below."
}
```

Notes for this batch: Letter-by-Letter Stagger has no Auto-loop control; its **Replay** button is the replay control. Text inputs ("Edit text") are left out of the settings line automatically.

- [ ] **Step 3: Convert the six pages**

Run: `node tools/migrate-demo.js tools/migrations/02-entrance-and-exit.json split-text-reveal letter-by-letter-stagger word-by-word-reveal blur-in flip-in rotate-in`
Expected: six `migrated …` lines and no error.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test "tests/*.test.js"`
Expected: PASS — including `every Entrance & Exit demo uses the shared layout`.

- [ ] **Step 5: Check each page in the browser**

For each of the six pages, run the Page check at 1280×800 and mobile and confirm no console errors. By hand:
- each one plays on its own after load
- typing in **Edit text** (Split Text, Letter-by-Letter, Word-by-Word) replays the text after a short pause, and the typed text is not in the settings line
- Blur In's toggle reads **Slight upward drift**; Rotate In's settings line reads `Extra full rotations No extra turns, Direction Counter-clockwise`
- Rotate In's top bar shows only `‹ Bounce In`

- [ ] **Step 6: Commit**

```bash
git add tools/migrations/02-entrance-and-exit.json tests/pages.test.js animations/02-entrance-and-exit/split-text-reveal/index.html animations/02-entrance-and-exit/letter-by-letter-stagger/index.html animations/02-entrance-and-exit/word-by-word-reveal/index.html animations/02-entrance-and-exit/blur-in/index.html animations/02-entrance-and-exit/flip-in/index.html animations/02-entrance-and-exit/rotate-in/index.html
git commit -m "feat: finish converting the Entrance & Exit demos to the shared layout"
```

---

### Task 8: Home page — Schibsted Grotesk and the new intro line

**Files:**
- Modify: `index.html` (lines 50–54 `@font-face`, lines 61–62 font variables, the `.wordmark` rule, every `var(--mono)`, the `.lede` paragraph)
- Modify: `tests/pages.test.js`

**Interfaces:**
- Consumes: `assets/fonts/schibsted-latin*.woff2` (Task 3).
- Produces: the home page in Schibsted Grotesk; CSS variable `--text` replaces `--mono` in `index.html`.

- [ ] **Step 1: Add the failing home page check**

Append to `tests/pages.test.js`:

```js
test('the home page uses Schibsted Grotesk and the new intro line', () => {
  const html = read(path.join(ROOT, 'index.html'));
  assert.ok(html.includes("url('assets/fonts/schibsted-latin.woff2')"), 'Latin font file');
  assert.ok(html.includes("url('assets/fonts/schibsted-latin-ext.woff2')"), 'Latin Extended font file');
  for (const old of ['Bricolage', 'PlexMono', 'var(--mono)', '--mono:']) assert.ok(!html.includes(old), `still uses ${old}`);
  assert.ok(html.includes('See 129 web animations move, learn when to use each one, and copy a prompt to build it.'));
});
```

Run: `node --test "tests/*.test.js"`
Expected: FAIL — `Latin font file`.

- [ ] **Step 2: Replace the font faces**

In `index.html`, replace these five lines:

```css
@font-face{font-family:'Bricolage';src:url('assets/fonts/brico-400.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'Bricolage';src:url('assets/fonts/brico-700.woff2') format('woff2');font-weight:700;font-display:swap}
@font-face{font-family:'Bricolage';src:url('assets/fonts/brico-800.woff2') format('woff2');font-weight:800;font-display:swap}
@font-face{font-family:'PlexMono';src:url('assets/fonts/plex-400.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'PlexMono';src:url('assets/fonts/plex-500.woff2') format('woff2');font-weight:500;font-display:swap}
```

with:

```css
@font-face{font-family:'Schibsted Grotesk';src:url('assets/fonts/schibsted-latin-ext.woff2') format('woff2');font-weight:400 900;font-display:swap;unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:'Schibsted Grotesk';src:url('assets/fonts/schibsted-latin.woff2') format('woff2');font-weight:400 900;font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
```

- [ ] **Step 3: Switch the font variables and wordmark spacing**

Replace:

```css
  --disp:'Bricolage','Arial Narrow',sans-serif;
  --mono:'PlexMono',ui-monospace,"Cascadia Mono",Menlo,Consolas,monospace;
```

with:

```css
  --disp:'Schibsted Grotesk',system-ui,-apple-system,'Segoe UI',sans-serif;
  --text:'Schibsted Grotesk',system-ui,-apple-system,'Segoe UI',sans-serif;
```

Then replace every `var(--mono)` in `index.html` with `var(--text)` (12 places):

```bash
sed -i 's/var(--mono)/var(--text)/g' index.html && grep -o 'var(--text)' index.html | wc -l
```

Expected: `12`.

In the `.wordmark` rule, change `letter-spacing:-.045em` to `letter-spacing:-.035em` (Schibsted Grotesk's heavy weight is wider-set than Bricolage and collides at the old spacing).

- [ ] **Step 4: Update the intro line**

Replace:

```html
    <p class="lede">A reference of 129 web animation techniques. Every entry is a live demo you can open in the browser and read how it works.</p>
```

with:

```html
    <p class="lede">See 129 web animations move, learn when to use each one, and copy a prompt to build it.</p>
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `node --test "tests/*.test.js"`
Expected: PASS — all tests.

- [ ] **Step 6: Check the home page**

Open `http://localhost:8731/` at 1280×800 and mobile. Confirm: the wordmark, headings, chips, search and card text are Schibsted Grotesk (`getComputedStyle(document.querySelector('.wordmark')).fontFamily` starts with `"Schibsted Grotesk"`), the wordmark letters do not touch, nothing overflows horizontally, and `read_console_messages` shows no errors. Take a desktop and a phone screenshot (Verification kit, with the home URL).

- [ ] **Step 7: Commit**

```bash
git add index.html tests/pages.test.js
git commit -m "feat: set the home page in Schibsted Grotesk and mention prompts in the intro"
```

---

### Task 9: Pilot verification and handoff for review

**Files:**
- No code changes expected. Any fix found here goes into the file that owns the problem, with its own commit.

**Interfaces:**
- Consumes: everything above.
- Produces: evidence for the user's pilot review.

- [ ] **Step 1: Run the full test suite**

Run: `node --test "tests/*.test.js"`
Expected: PASS, 0 failures. Record the pass count.

- [ ] **Step 2: Browser matrix for all 13 pilot pages**

For every page in `animations/02-entrance-and-exit/`, run the Page check at 1280×800, 768×1024 and mobile, and `read_console_messages` with `onlyErrors: true`. Every expected value in the Verification kit must hold for every page at every size. Fix any failure in the file that owns it, then rerun the tests:
- shared behaviour or styling: `assets/js/handbook.js` or `assets/css/handbook.css`
- a page's markers, edits, lede or prompt: fix its entry in `tools/migrations/02-entrance-and-exit.json`, restore the original page with `git checkout 2fbdc00 -- animations/02-entrance-and-exit/<slug>/index.html` (commit `2fbdc00` is the spec commit, before any page was converted), then run `node tools/migrate-demo.js tools/migrations/02-entrance-and-exit.json <slug>` again
- explanation text: the demo's `README.md`

- [ ] **Step 3: Reduced-motion check**

For Fade In / Fade Out, Bounce In and Rotate In, take a desktop screenshot with `--force-prefers-reduced-motion` (Verification kit). Expected: the element is visible in its final state; nothing is mid-animation.

- [ ] **Step 4: Offline check**

Open `animations/02-entrance-and-exit/bounce-in/index.html` directly from disk (`file:///…`) in Chrome. Expected: the demo, settings and prompt work; **Read more** shows "The full explanation is in README.md." with a working link.

- [ ] **Step 5: Screenshots for the user**

Take these screenshots (Verification kit) and send them to the user with `SendUserFile`:
- Bounce In, desktop, first screen
- Bounce In, desktop, with `#details` (details open)
- Curtain Reveal, desktop
- Word-by-Word Reveal, phone
- Home page, desktop

- [ ] **Step 6: Stop for review**

Report to the user: the pages converted, the test results, anything that needed a per-demo fix, and the screenshots. Ask them to review the pilot at `http://localhost:8731/animations/02-entrance-and-exit/fade-in-out/` onward. Do not convert any other category; the next plan covers the remaining six categories after the user approves the pilot.

---

## Self-review notes

- Spec coverage: page anatomy (Tasks 3–4), content sources (Tasks 2, 4, 5), README pass (Task 5), prompts and settings line (Tasks 3, 4, 6, 7), behaviour — auto-play, Replay, settings replay, copy fallback, offline (Tasks 4, 9), shared assets (Tasks 1–4), fonts (Tasks 3, 8), home page (Task 8), pilot rollout and verification (Tasks 6, 7, 9). Out of this plan by design: the other six categories, CLAUDE.md/CONTRIBUTING.md updates, deleting the old font files and `samples/demo-page-design.html` (spec rollout steps 3–4, next plan).
- Spec refinement: the spec listed 7 demos that open empty; the pilot audit found that every Entrance & Exit demo whose status starts as "hidden" opens empty, so 12 of 13 get auto-play (Curtain Reveal already plays itself).
