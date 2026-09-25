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
