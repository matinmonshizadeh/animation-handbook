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

test('every Entrance & Exit demo uses the shared layout', () => {
  const left = demos.filter(d => d.cat === PILOT && !converted.includes(d)).map(d => d.slug);
  assert.deepEqual(left, []);
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

test('the home page uses Schibsted Grotesk and the new intro line', () => {
  const html = read(path.join(ROOT, 'index.html'));
  assert.ok(html.includes("url('assets/fonts/schibsted-latin.woff2')"), 'Latin font file');
  assert.ok(html.includes("url('assets/fonts/schibsted-latin-ext.woff2')"), 'Latin Extended font file');
  for (const old of ['Bricolage', 'PlexMono', 'var(--mono)', '--mono:']) assert.ok(!html.includes(old), `still uses ${old}`);
  assert.ok(html.includes('See 129 web animations move, learn when to use each one, and copy a prompt to build it.'));
});
