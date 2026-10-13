// Checks the Famous effects page (famous/index.html) and the tool that writes its previews (tools/make-famous.mjs), from
// docs/superpowers/specs/2026-10-13-famous-effects-design.md: first the tool on a small stand-in home page, then the page.
// Run from the repo root: node --test "tests/*.test.js"
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const ROOT = path.resolve(__dirname, '..');
const TOOL = 'node tools/make-famous.mjs';
const tool = () => import(pathToFileURL(path.join(ROOT, 'tools', 'make-famous.mjs')).href);

// ---------- The tool, on a stand-in home page ----------
// What the tool reads, in small: the accent classes and the base preview rules; a comment that holds a brace and a rule; a
// @property; a preview with a data URI that holds url(…); a rule shared with a preview the page does not show; a preview whose
// key only starts like a shown one; keyframes used and unused; a phone rule beside another page's rule; the reduced-motion
// rule; and CATS, PV, pvMarkup(), engines and STILL.
const FIXTURE_HOME = `<style>
:root{--c1:#6ea8ff}
.c1{--accent:var(--c1)}.c2{--accent:var(--c2)}.c3{--accent:var(--c3)}.c4{--accent:var(--c4)}.c5{--accent:var(--c5)}.c6{--accent:var(--c6)}.c7{--accent:var(--c7)}
.pv{position:absolute;inset:0}
/* a comment with a brace { and a rule .pv-aaa{color:red} inside */
.pv *{will-change:transform}
.card:not(.playing) .pv .anim,.card:not(.playing) .pv .anim::before,.card:not(.playing) .pv .anim::after{animation-play-state:paused!important}
@property --p{syntax:'<percentage>';inherits:false;initial-value:0%}
.pv-aaa{background:url("data:image/svg+xml,%3Csvg filter='url(%23m)'%3E")}
.pv-aaa .x{animation:spin-a 2s linear infinite;--p:10%}
.pv-aaab{background:#111}
.pv-bbb,.pv-zzz{color:red}
@keyframes spin-a{to{transform:rotate(360deg)}}
@keyframes unused{to{opacity:0}}
@media(max-width:600px){.pv-aaa .x{width:5px}.other{color:blue}}
@media(prefers-reduced-motion:reduce){
  .pv .anim,.pv .anim::before,.pv .anim::after{animation-play-state:paused!important}
}
</style>
<script>
const CATS=[{name:'One',cat:'c1-cat',n:'01',folder:'animations/01-one',entries:[['first','First','Line one.'],['second','Second','Line two.'],['third','Third','Line three.'],['fourth','Fourth','Line four.']]}];
const PV={'first':'aaa','second':'bbb','third':'ccc'};
function pvMarkup(k){
  switch(k){
    case 'aaa': return '<span class="x anim"></span>';
    case 'bbb': return '<b class="anim">B</b>';
    case 'ccc': return '';
    default: return '';
  }
}
const engines={ccc:pv=>make(pv,1,true)};
const STILL={bbb:.7};
</script>`;

test('make-famous: the CSS block holds the base rules and, for each preview shown, its rules, its keyframes and the @property it uses', async () => {
  const { previewBlocks } = await tool();
  const lines = previewBlocks(FIXTURE_HOME, ['first', 'second']).css.split('\n');
  for (const line of ['.c1{--accent:var(--c1)}', '.c7{--accent:var(--c7)}', '.pv{position:absolute;inset:0}', '.pv *{will-change:transform}',
    '.card:not(.playing) .pv .anim,.card:not(.playing) .pv .anim::before,.card:not(.playing) .pv .anim::after{animation-play-state:paused!important}',
    '@media(prefers-reduced-motion:reduce){.pv .anim,.pv .anim::before,.pv .anim::after{animation-play-state:paused!important}}',
    "@property --p{syntax:'<percentage>';inherits:false;initial-value:0%}",
    `.pv-aaa{background:url("data:image/svg+xml,%3Csvg filter='url(%23m)'%3E")}`, '.pv-aaa .x{animation:spin-a 2s linear infinite;--p:10%}',
    '@keyframes spin-a{to{transform:rotate(360deg)}}', '@media(max-width:600px){.pv-aaa .x{width:5px}}', '.pv-bbb{color:red}']) {
    assert.ok(lines.includes(line), `the CSS block has the line ${line}`);
  }
  const css = lines.join('\n');
  for (const absent of ['.pv-aaab', '.pv-zzz', 'unused', '.other', '.pv-aaa{color:red}']) assert.ok(!css.includes(absent), `no ${absent}`);
});

test('make-famous: the PREVIEWS block gives each card once, in page order, with its preview key, still point and markup', async () => {
  const { previewBlocks } = await tool();
  assert.equal(previewBlocks(FIXTURE_HOME, ['first', 'second', 'first']).data, ['const PREVIEWS={',
    '"first":{"pv":"aaa","still":0.5,"markup":"<span class=\\"x anim\\"><\\/span>"},',
    '"second":{"pv":"bbb","still":0.7,"markup":"<b class=\\"anim\\">B<\\/b>"}',
    '};'].join('\n'));
  assert.equal(previewBlocks(FIXTURE_HOME, []).data, 'const PREVIEWS={\n};', 'no cards, an empty object');
});

test('make-famous: a card that is not on the home page, or whose preview needs a script or has no markup, stops the tool', async () => {
  const { previewBlocks } = await tool();
  assert.throws(() => previewBlocks(FIXTURE_HOME, ['third']), /needs a script engine/);
  assert.throws(() => previewBlocks(FIXTURE_HOME, ['fourth']), /has no markup/);
  assert.throws(() => previewBlocks(FIXTURE_HOME, ['nowhere']), /not a card on the home page/);
});

test('make-famous: the blocks go between their marker lines, a second run changes nothing, and a missing or doubled marker stops it', async () => {
  const { buildFamousFrom, replaceBetween, CSS_START, CSS_END, JS_START, JS_END } = await tool();
  const page = ['<style>', 'body{margin:0}', CSS_START, 'old css', CSS_END, '</style>', '<article class="card c1" data-slug="second">',
    '<script>', JS_START, 'const PREVIEWS={};', JS_END, 'go();', '</script>'].join('\n');
  const once = buildFamousFrom(FIXTURE_HOME, page);
  assert.equal(buildFamousFrom(FIXTURE_HOME, once), once, 'a second run changes nothing');
  assert.ok(once.includes(`${CSS_START}\n/* the base`), 'the CSS starts right after its first marker');
  assert.ok(once.includes(`.pv-bbb{color:red}\n${CSS_END}`), 'and ends right before its last');
  assert.ok(once.includes(`${JS_START}\nconst PREVIEWS={\n"second":`) && once.includes(`};\n${JS_END}\ngo();`), 'the data between its markers');
  assert.ok(!once.includes('old css'), 'what was between the markers is gone');
  assert.throws(() => replaceBetween('no markers here', CSS_START, CSS_END, 'x'), /must each be there once/);
  assert.throws(() => replaceBetween(CSS_START + CSS_END + CSS_START, CSS_START, CSS_END, 'x'), /must each be there once/);
});
