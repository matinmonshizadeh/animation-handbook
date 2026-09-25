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
