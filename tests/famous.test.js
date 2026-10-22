// Checks the Famous effects page (famous/index.html), its versions (famous/versions/*.html) and the tool that writes its previews
// (tools/make-famous.mjs), from docs/superpowers/specs/2026-10-13-famous-effects-design.md and, where it differs,
// docs/superpowers/specs/2026-10-22-famous-gallery-popup-design.md: first the tool on a small stand-in home page, then the page.
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
  assert.throws(() => replaceBetween(CSS_START + CSS_END + CSS_END, CSS_START, CSS_END, 'x'), /must each be there once/, 'an end marker written twice');
  assert.throws(() => replaceBetween(CSS_END + CSS_START + CSS_END, CSS_START, CSS_END, 'x'), /must each be there once/, 'an end marker before the start too');
  assert.throws(() => replaceBetween(CSS_END + CSS_START, CSS_START, CSS_END, 'x'), /must each be there once/, 'the end before the start');
});

// ---------- The page: its frame ----------
const FILE = path.join(ROOT, 'famous', 'index.html');
// A file's text with Windows line endings read as plain ones: a checkout may hold either.
const read = f => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
const PAGE = read(FILE);
const HOME = read(path.join(ROOT, 'index.html'));
const LIVE = 'https://matinmonshizadeh.github.io/animation-handbook/';
const REPO = 'https://github.com/matinmonshizadeh/animation-handbook';
const TEMPLATE = `${REPO}/issues/new?template=famous_effect.yml`;
const TITLE = 'Famous effects — Animation Handbook';
const LEDE = 'Effects people admire on well-known websites, the handbook animations that make something similar, and a prompt to build your own.';
const LEGAL = "The Animation Handbook is not connected to any of these sites or their owners, and none of them has reviewed or approved this page. Each effect is described in our own words and shown only with the handbook's own demos.";
// The sites the page may name (the twelve entries and the reserves): none belongs in its title or description.
const SITE_NAMES = ['Stripe', 'Apple', 'Lando Norris', 'Linear', 'Wikipedia', 'ChatGPT', 'OpenAI', 'x.com', 'Spotify', 'YouTube', 'Pudding', 'Medium', 'Rockstar', 'Cursor'];
const count = (s, sub) => s.split(sub).length - 1;
// The part of s from the first `from` up to the next `to` after it ('' when `from` is missing).
const between = (s, from, to) => {
  const start = s.indexOf(from);
  if (start < 0) return '';
  const end = s.indexOf(to, start + from.length);
  return s.slice(start, end < 0 ? undefined : end);
};
const decode = s => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
// The words a piece of markup shows: tags dropped, entities decoded, white space squeezed (as the page's Copy prompt reads it).
const textOf = html => decode(html.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();
const meta = attr => { const m = PAGE.match(new RegExp(`<meta ${attr} content="([^"]*)">`)); return m && decode(m[1]); };
// What a visitor reads: the page without its scripts and styles.
const MARKUP = PAGE.replace(/<script\b[\s\S]*?<\/script>/g, '').replace(/<style\b[\s\S]*?<\/style>/g, '');
const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Whether a link or source of famous/index.html names a file of the repository (a folder stands for its index.html).
const isRepoFile = ref => {
  const bare = ref.replace(/[?#].*$/, '');
  if (/^[a-z][a-z0-9+.-]*:/i.test(bare) || bare.startsWith('/')) return false;
  const file = path.resolve(ROOT, 'famous', bare || '.');
  return fs.existsSync(bare === '' || bare.endsWith('/') ? path.join(file, 'index.html') : file);
};

test('famous/index.html: one title and one description for search and social sites, with no company name in them', () => {
  assert.equal(count(PAGE, '<title>'), 1, 'one title');
  assert.ok(PAGE.includes(`<title>${TITLE}</title>`), 'the title');
  for (const attr of ['property="og:title"', 'name="twitter:title"']) assert.equal(meta(attr), TITLE, attr);
  for (const attr of ['name="description"', 'property="og:description"', 'name="twitter:description"']) assert.equal(meta(attr), LEDE, attr);
  assert.ok(PAGE.includes('<h1 class="h1">Famous effects</h1>'), 'the heading');
  assert.ok(PAGE.includes(`<p class="fx-lede">${LEDE}</p>`), 'the lede under it');
  assert.match(PAGE, /<p class="pill">\d+ effects from well-known websites<\/p>/, 'the pill');
  for (const name of SITE_NAMES) assert.ok(!new RegExp(`\\b${escapeRe(name)}\\b`, 'i').test(`${TITLE} ${LEDE}`), `no "${name}" in the title or description`);
});

test('famous/index.html: canonical and og:url are its live address, and it shares the site\'s picture', () => {
  assert.ok(PAGE.includes(`<link rel="canonical" href="${LIVE}famous/">`), 'canonical');
  assert.equal(meta('property="og:url"'), `${LIVE}famous/`);
  for (const attr of ['property="og:image"', 'name="twitter:image"']) assert.equal(meta(attr), `${LIVE}og-image.png`, attr);
});

test('the top bar is the home page\'s, with Famous effects marked as this page', () => {
  const bar = between(PAGE, '<header class="wrap top" id="top">', '</header>');
  for (const part of ['<a class="brand" href="../">', '<a class="lnk" href="../?view=all">Browse all</a>', '<a class="lnk" href="./" aria-current="page">Famous effects</a>',
    '<button type="button" class="icon-btn theme-btn" id="theme-toggle" aria-label="Switch between light and dark">',
    `<a class="gh" id="gh-stars" href="${REPO}" target="_blank" rel="noopener">`]) assert.ok(bar.includes(part), part);
  assert.equal(count(MARKUP, 'aria-current='), 1, 'one current page');
});

test('the light and dark colors and the theme switch are the home page\'s', () => {
  const block = (html, selector) => {
    const css = between(html, '<style>', '</style>'), at = css.indexOf(`${selector}{`);
    assert.ok(at >= 0, selector);
    return css.slice(at, css.indexOf('}', at) + 1).replace(/\s+/g, '');
  };
  for (const selector of [':root', ':root[data-theme="dark"]']) assert.equal(block(PAGE, selector), block(HOME, selector), selector);
  assert.ok(PAGE.includes(HOME.match(/function setTheme\(t\)\{[^\n]*\}/)[0]), 'the same setTheme as the home page');
});

test('the not-connected line is on the page once, word for word, in the hero above the gallery and every entry', () => {
  assert.equal(count(PAGE, LEGAL), 1, 'once');
  assert.ok(PAGE.includes(`<p class="fx-legal">${LEGAL}</p>`), 'in its own paragraph');
  assert.ok(between(PAGE, '<div class="fx-head">', '</div>').includes(LEGAL), 'in the hero');
  const at = PAGE.indexOf(LEGAL);
  assert.ok(at < PAGE.indexOf('<section class="fx-gallery"'), 'above the gallery');
  assert.ok(PAGE.indexOf('<section class="fx"') < 0 || at < PAGE.indexOf('<section class="fx"'), 'above the first entry');
});

test('the page loads nothing from elsewhere, uses only the site\'s font in its own style and shows no code', async () => {
  const { CSS_START, CSS_END } = await tool();
  for (const bad of ['<img', '<video', '<picture', '<object', '<embed', '@import', 'url(http']) assert.ok(!PAGE.includes(bad), bad);
  // the only frames are the entries' versions, which are files of this repository; the page gives a frame its src (from data-src)
  // only while its entry is open, so the markup has none
  for (const [tag] of PAGE.matchAll(/<iframe\b[^>]*>/g)) {
    assert.ok(!/\ssrc=/.test(tag), `a frame with a src: ${tag}`);
    assert.match(tag, /^<iframe title="Our version: [^"]+" data-src="versions\/[a-z0-9-]+\.html">$/, `a frame is titled and names its version: ${tag}`);
  }
  assert.ok(!/demo-page\.(css|js)/.test(PAGE), 'it links neither shared file');
  for (const [, src] of PAGE.matchAll(/\ssrc="([^"]*)"/g)) assert.ok(isRepoFile(src), `src ${src}`);
  for (const [tag] of PAGE.matchAll(/<link\b[^>]*>/g)) {
    if (!/\srel="(stylesheet|icon|apple-touch-icon)"/.test(tag)) continue;
    const href = tag.match(/\shref="([^"]*)"/)[1];
    assert.ok(isRepoFile(href), `link ${href}`);
  }
  const css = between(PAGE, '<style>', '</style>').replace(/url\(\s*(["'])data:[\s\S]*?\1\s*\)/g, '');
  for (const [, ref] of css.matchAll(/url\(\s*['"]?([^'")\s]+)/g)) assert.ok(isRepoFile(ref), `url(${ref})`);
  const own = css.slice(0, css.indexOf(CSS_START)) + css.slice(css.indexOf(CSS_END));
  for (const [, family] of own.matchAll(/font-family:([^;}]+)/g)) assert.match(family.trim(), /^(var\(--disp\)|var\(--text\)|'Schibsted Grotesk')$/, `font-family:${family}`);
  assert.ok(!/`|<code|<pre/.test(MARKUP), 'no backtick, <code> or <pre> outside <script> and <style>');
});

test('the only links that leave the site are the entries\' sites, the GitHub repository and its issue template, each in a new tab', () => {
  const sites = new Set([...PAGE.matchAll(/<p class="fx-seen">Seen on <a href="([^"]+)"/g)].map(m => m[1]));
  for (const [tag, href] of PAGE.matchAll(/<a\b[^>]*\shref="(https?:[^"]*)"[^>]*>/g)) {
    assert.ok(href === REPO || href === TEMPLATE || sites.has(href), `a link that leaves the site: ${href}`);
    assert.match(tag, /\starget="_blank" rel="noopener"/, `${href} opens in a new tab`);
  }
});

test('every link inside the site opens a file of the repository, and from disk a folder link opens its index.html', () => {
  for (const [, href] of PAGE.matchAll(/<a\b[^>]*\shref="([^"]*)"/g)) {
    if (/^https?:/.test(href) || href.startsWith('#')) continue;
    assert.ok(isRepoFile(href), href);
  }
  assert.ok(PAGE.includes("if(location.protocol==='file:')document.querySelectorAll('a[href]').forEach(a=>{"), 'opened from disk, folder links name index.html');
});

test('the footer is the home page\'s, without the count', () => {
  const foot = between(PAGE, '<footer class="wrap foot">', '</footer>');
  assert.ok(foot.includes('<p class="foot-t">Web animations with live demos and copyable prompts.</p>'), 'its line, with no number');
  assert.ok(foot.includes(`<a class="lnk" href="${REPO}" target="_blank" rel="noopener">GitHub</a><a class="lnk" href="#top">Back to top</a>`), 'its links');
  assert.ok(!/\d/.test(textOf(foot)), 'no number in the footer');
});

test('the page script copies, falls back to the copy keys, shortens prompts on phones and shows the message, in the words of the animation pages and the home page', () => {
  const script = [...PAGE.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n');
  const shared = read(path.join(ROOT, 'assets', 'js', 'demo-page.js'));
  for (const words of ['Show the full prompt', 'Show less', 'Press ⌘C to copy', 'Press Ctrl+C to copy']) {
    assert.ok(script.includes(`'${words}'`), `the page says "${words}"`);
    assert.ok(shared.includes(`'${words}'`), `as the animation pages do: "${words}"`);
  }
  assert.ok(script.includes("toast('Prompt copied. Paste it into your AI assistant.')") && HOME.includes("toast('Prompt copied. Paste it into your AI assistant.')"), 'the home page\'s message');
  assert.ok(script.includes("document.execCommand('copy')") && shared.includes("doc.execCommand('copy')"), 'where the clipboard is refused or missing, a hidden text box copies, as on the animation pages');
  assert.ok(script.indexOf("document.execCommand('copy')") < script.indexOf("copyState(btn,'keys')"), 'before the button asks for the copy keys');
  for (const words of ["'Copy prompt'", "'Copied'"]) assert.ok(script.includes(words), words);
  assert.ok(PAGE.includes('<div class="toast" id="toast" role="status" aria-live="polite">'), 'the message box');
});

test('Seen one we should add? opens the Famous effect issue template, which asks for the site and what you see in your own words, with no screenshots or code', () => {
  assert.ok(PAGE.includes(`<a class="fx-suggest" href="${TEMPLATE}" target="_blank" rel="noopener">Suggest it on GitHub<span class="sr"> (opens in a new tab)</span></a>`), 'the Suggest link');
  assert.ok(PAGE.includes('<p class="fx-note">Each entry was checked on its live site in the year shown; a site may have changed since.</p>'), 'the note on dates');
  const yml = read(path.join(ROOT, '.github', 'ISSUE_TEMPLATE', 'famous_effect.yml'));
  assert.match(yml, /^name: Famous effect$/m, 'its name');
  const field = id => yml.split('\n  - type: ').find(part => part.includes(`\n    id: ${id}\n`)) || '';
  for (const id of ['address', 'what']) assert.match(field(id), /\n {4}validations:\n {6}required: true/, `${id} is required`);
  assert.match(yml, /no screenshots, videos or code from the site/i, 'no screenshots or code from the site');
});

test('the two preview blocks are what tools/make-famous.mjs writes from the home page now', async () => {
  const { buildFamous } = await tool();
  assert.ok(buildFamous(ROOT)['famous/index.html'] === PAGE, `famous/index.html is out of date: run ${TOOL}`);
});

// The cards of the home page whose previews this page cannot show: drawn by a script engine, or animated in SVG. Every other
// card builds, so a change to the home page that the tool cannot read (a card, a preview, its rules) fails here at once,
// before a card on this page needs it.
const REFUSED = ['counter-animation', 'scramble-text', 'text-on-path', 'canvas-particle-effect', 'gpgpu-particle-system', 'starfield', 'particle-constellation', 'flow-field'];
test('make-famous: on the real home page every card builds, but the eight whose previews need a script or animate in SVG', async () => {
  const { previewBlocks, homeConst } = await tool();
  const slugs = homeConst(HOME, 'CATS').flatMap(cat => cat.entries.map(([slug]) => slug));
  for (const slug of REFUSED) {
    assert.ok(slugs.includes(slug), `${slug} is a card on the home page`);
    assert.throws(() => previewBlocks(HOME, [slug]), /needs a script engine|animates in SVG/, `${slug} is refused`);
  }
  const rest = [...slugs.filter(slug => !REFUSED.includes(slug))]; // a plain array: CATS comes from the tool's vm context
  const { data } = previewBlocks(HOME, rest); // it throws when a card is not found, or a preview's markup or rules
  assert.deepEqual(data.split('\n').slice(1, -1).map(line => JSON.parse(line.match(/^("[a-z0-9-]+"):/)[1])), rest, 'one preview for every other card, in order');
});

// ---------- The page: entries, cards and prompts ----------
const STARTS = ['loop', 'load', 'scroll', 'hover', 'press'];
const words = s => s.split(/\s+/).filter(Boolean).length;
// Each entry as { id, site, start, body }, in page order.
const ENTRIES = [...PAGE.matchAll(/<section class="fx" id="([a-z0-9-]+)" aria-labelledby="\1-t" data-fx-site="([^"]+)" data-fx-start="([a-z]+)">([\s\S]*?)<\/section>/g)]
  .map(m => ({ id: m[1], site: decode(m[2]), start: m[3], body: m[4] }));
// A card exactly as the template writes it: its accent, slug, label, link, name and line.
const CARD = /<article class="card (c[1-7])" data-slug="([a-z0-9-]+)"><div class="stage"><div class="pv" aria-hidden="true"><\/div><span class="tag">([^<]+)<\/span><\/div><div class="meta"><h4 class="title"><a href="([^"]+)">([^<]+)<\/a><\/h4><p class="desc">([^<]+)<\/p><\/div><\/article>/g;
// The words that would name an entry's site in a prompt: its name (without a leading "The"), its address and the name in that
// address. A single letter, as X, is too short to count ("an X" is a shape); its address still counts.
const siteWords = e => {
  const href = e.body.match(/<p class="fx-seen">Seen on <a href="([^"]+)"/)[1], host = new URL(href).hostname.replace(/^www\./, '');
  return [e.site.replace(/^The /, ''), host, host.split('.').slice(-2)[0]].filter(w => w.length > 1);
};
// Whether text holds word as a word of its own (not inside a longer one), ignoring case.
const names = (text, word) => new RegExp('(^|[^a-z0-9])' + escapeRe(word.toLowerCase()) + '([^a-z0-9]|$)', 'i').test(text);

test('every entry is written as the template says, so the tests below see it', () => {
  assert.ok(ENTRIES.length > 0, 'the page has entries');
  assert.equal(ENTRIES.length, count(PAGE, '<section class="fx"'), 'each <section class="fx"> has its id, aria-labelledby, data-fx-site and data-fx-start in that order');
  assert.equal(new Set(ENTRIES.map(e => e.id)).size, ENTRIES.length, 'every id is unique');
  assert.ok(PAGE.indexOf('<section class="fx-gallery"') < PAGE.indexOf('<section class="fx"'), 'the entries come after the gallery');
});

for (const e of ENTRIES) {
  test(`${e.id}: seen on its site in the year it was checked, a heading, what you see in 25 to 70 words and what starts it`, () => {
    const seen = e.body.match(/<p class="fx-seen">Seen on <a href="(https:\/\/[^"]+)" target="_blank" rel="noopener">([^<]+)<span class="sr"> \(opens in a new tab\)<\/span><\/a> in&nbsp;<time datetime="((\d{4})-\d{2}-\d{2})">(\d{4})<\/time><\/p>/);
    assert.ok(seen, 'Seen on: the site\'s address as a link that opens a new tab, then "in", a no-break space (the year never starts a line) and the year in a <time>');
    const [, href, label, day, year, shown] = seen;
    assert.equal(label, href.replace(/^https:\/\//, '').replace(/^www\./, '').replace(/\/$/, ''), 'the link shows the address without https:// or www.');
    assert.equal(shown, year, 'the year shown is the year of the day checked');
    assert.ok(!Number.isNaN(Date.parse(day)) && Date.parse(day) <= Date.now(), `${day} is a day that has come`);
    assert.equal(count(e.body, '<p class="fx-seen">'), 1, 'one Seen on line');
    assert.equal(count(e.body, '<h2 '), 1, 'one heading');
    assert.ok(e.body.includes(`<h2 id="${e.id}-t" tabindex="-1">`), 'the heading the entry is named by, which a jump focuses');
    const what = e.body.match(/<p class="fx-what">([\s\S]*?)<\/p>/);
    assert.ok(what, 'what you see');
    const n = words(textOf(what[1]));
    assert.ok(n >= 25 && n <= 70, `what you see has ${n} words, not 25 to 70`);
    assert.ok(!/["“”]/.test(textOf(what[1])), 'what you see quotes no words: it says what shows in our own words');
    assert.ok(STARTS.includes(e.start), `data-fx-start "${e.start}" is one of ${STARTS.join(', ')}`);
    assert.ok(e.site.trim(), 'data-fx-site names the site');
    assert.ok(e.body.includes('<h3 class="fx-sub">Build it with these animations</h3>') && e.body.includes('<h3 class="fx-sub">A prompt to build something similar</h3>'), 'its two parts');
  });

  test(`${e.id}: one to three cards, each an animation of the home page with its name, line and page, and a short label`, async () => {
    const { homeConst } = await tool();
    const CATS = homeConst(HOME, 'CATS');
    const cards = [...e.body.matchAll(CARD)];
    assert.equal(cards.length, count(e.body, '<article'), 'every card is written as the template says');
    assert.ok(cards.length >= 1 && cards.length <= 3, `${cards.length} cards, not 1 to 3`);
    for (const [, accent, slug, label, href, name, desc] of cards) {
      const cat = CATS.find(c => c.entries.some(x => x[0] === slug));
      assert.ok(cat, `${slug} is a card on the home page`);
      const [, cardName, line] = cat.entries.find(x => x[0] === slug);
      assert.equal(accent, cat.cat.replace('-cat', ''), `${slug}: its category's accent`);
      assert.equal(href, `../${cat.folder}/${slug}/`, `${slug}: its page's link`);
      assert.ok(fs.existsSync(path.join(ROOT, cat.folder, slug, 'index.html')), `${slug}: its page exists`);
      assert.equal(decode(name), cardName, `${slug}: the home page's name`);
      assert.equal(decode(desc), line, `${slug}: the home page's line`);
      const n = words(decode(label));
      assert.ok(n >= 1 && n <= 3, `${slug}: the label "${label}" has ${n} words, not 1 to 3`);
    }
  });

  test(`${e.id}: its prompt follows the rules for prompts and names no site of the page, and Copy prompt names the entry`, () => {
    const box = e.body.match(/<div class="fx-pbox"><p class="fx-prompt">([\s\S]*?)<\/p><\/div>/);
    assert.ok(box, 'the prompt in its box');
    const prompt = textOf(box[1]), n = words(prompt);
    assert.ok(n >= 60 && n <= 130, `${n} words, not 60 to 130`);
    assert.ok(prompt.startsWith('Add '), 'starts with "Add "');
    const parts = prompt.match(/\[[^\]]+\]/g) || [];
    assert.ok(parts.length >= 1, 'at least one [part to fill in]');
    assert.equal(count(box[1], '<mark>['), parts.length, 'each [part] is marked');
    assert.ok(!/`|<code|<pre/.test(box[1]), 'no code');
    assert.ok(!prompt.includes('Match the settings listed below.'), 'the page has no settings to match');
    assert.match(prompt, /reduced motion/i, 'says what happens under reduced motion');
    if (e.start === 'hover' || e.start === 'press') assert.match(prompt, /\b(touch|tap|finger)/i, 'names touch, a tap or a finger');
    for (const other of ENTRIES) for (const w of siteWords(other)) assert.ok(!names(prompt, w), `names "${w}"`);
    const title = e.body.match(/<h2 [^>]*>([^<]+)<\/h2>/)[1];
    assert.ok(e.body.includes(`<button type="button" class="copy" aria-label="Copy prompt for ${title}">`), 'Copy prompt names its entry');
  });
}

// ---------- The gallery ----------
const GALLERY = between(PAGE, '<section class="fx-gallery"', '</section>');
const TILES = [...GALLERY.matchAll(/<li class="tile" data-fx-tile="([a-z0-9-]+)">([\s\S]*?)<\/li>/g)].map(m => ({ id: m[1], body: m[2] }));
const START_TAGS = { loop: 'Loops', load: 'On load', scroll: 'On scroll', hover: 'On hover', press: 'On press' };
const START_CHIPS = { loop: 'Loops', load: 'Starts on load', scroll: 'Starts on scroll', hover: 'Starts on hover', press: 'Starts on press' };
const hostOf = href => new URL(href).hostname.replace(/^www\./, '');
const seenHref = e => e.body.match(/<p class="fx-seen">Seen on <a href="([^"]+)"/)[1];
const h2Of = e => decode(e.body.match(/<h2 [^>]*>([^<]+)<\/h2>/)[1]);
const cardCount = e => count(e.body, '<article class="card ');
const animations = n => `${n} ${n === 1 ? 'animation' : 'animations'}`;

test('the gallery replaces the jump row: one tile per entry in page order, then the Seen one we should add? tile, and the skip link leads to it', () => {
  assert.ok(!PAGE.includes('fx-jump'), 'no jump row is left');
  assert.ok(PAGE.includes('<section class="fx-gallery" id="fx-gallery" aria-labelledby="fx-gallery-t">'), 'the gallery section');
  assert.ok(GALLERY.includes('<h2 class="sr" id="fx-gallery-t">All effects</h2>'), 'a heading only screen readers see names it');
  assert.ok(GALLERY.includes('<ul class="fx-grid" role="list">'), 'a list');
  assert.deepEqual(TILES.map(tile => tile.id), ENTRIES.map(e => e.id), 'one tile per entry, in page order');
  const items = [...GALLERY.matchAll(/<li class="([^"]*)"/g)].map(m => m[1]);
  assert.equal(items.length, ENTRIES.length + 1, 'and one more');
  assert.equal(items.at(-1), 'tile tile-more', 'the last tile is the suggestion');
  const more = between(GALLERY, '<li class="tile tile-more">', '</li>');
  assert.ok(more.includes('<h3 id="fx-more-t">Seen one we should add?</h3>'), 'its heading');
  assert.ok(more.includes('<p>Seen an effect on a well-known site that you want explained?</p>'), 'its question');
  assert.ok(PAGE.includes(`<a class="skip" href="#fx-gallery">Skip to the effects</a>`), 'the skip link leads to the gallery');
  assert.ok(PAGE.indexOf('<a class="skip"') < PAGE.indexOf('<header class="wrap top"'), 'and is the first thing on the page');
  assert.ok(PAGE.indexOf('<section class="fx-gallery"') < PAGE.indexOf('<div class="fx-list">'), 'the entries come after it');
});

for (const e of ENTRIES) {
  test(`${e.id}: its tile has the entry's title as a link to it, one line of ours, its start, its site and its cards, over a picture tagged Our version`, () => {
    const tile = TILES.find(x => x.id === e.id);
    assert.ok(tile, 'a tile');
    const link = tile.body.match(/<h3 class="t-title"><a href="#([^"]+)">([^<]+)<\/a><\/h3>/);
    assert.ok(link, 'the title is an h3 with a link');
    assert.equal(link[1], e.id, 'to the entry');
    assert.equal(decode(link[2]), h2Of(e), "the entry's own heading");
    const line = tile.body.match(/<p class="t-desc">([^<]+)<\/p>/);
    assert.ok(line, 'one line');
    const text = decode(line[1]);
    assert.ok(text.length >= 25 && text.length <= 90, `the line has ${text.length} characters, not 25 to 90`);
    assert.ok(/[.]$/.test(text) && !/["“”]/.test(text), 'it ends with a full stop and quotes nothing');
    for (const other of ENTRIES) for (const w of siteWords(other)) assert.ok(!names(text, w), `the line names "${w}"`);
    const href = seenHref(e);
    assert.ok(tile.body.includes(`<p class="t-foot"><a class="t-site" href="${href}" target="_blank" rel="noopener">Seen on ${hostOf(href)} <span aria-hidden="true">↗</span><span class="sr"> (opens in a new tab)</span></a><span class="t-count">${animations(cardCount(e))}</span></p>`),
      "the foot: the entry's own site address in a new tab (host without www.), and the number of its cards");
    assert.ok(tile.body.includes(`<div class="t-tags"><span class="t-tag">Our version</span><span class="t-tag t-start">${START_TAGS[e.start]}</span></div>`), 'tagged Our version and with what starts it');
    assert.match(tile.body, /<div class="t-stage">\s*<div class="gp gp-[a-z]+" aria-hidden="true">/, "its picture: ours, hidden from screen readers (the tags and the title say it all)");
    assert.equal(count(tile.body, '<a '), 2, 'two links: the entry and its site');
  });
}

test('the entries are all in one wrapper after the gallery, in page order, so the page still reads as a list without scripts', () => {
  assert.equal(count(PAGE, '<div class="fx-list">'), 1, 'one wrapper');
  const wrapped = between(PAGE, '<div class="fx-list">', '</main>');
  assert.equal(count(wrapped, '<section class="fx"'), ENTRIES.length, 'every entry is inside it');
  assert.deepEqual([...wrapped.matchAll(/<section class="fx" id="([a-z0-9-]+)"/g)].map(m => m[1]), ENTRIES.map(e => e.id), 'in page order');
  assert.ok(!wrapped.includes('<dialog'), 'the pop-up is not in it');
});

const stems = s => new Set((s.toLowerCase().match(/[a-z]{5,}/g) || []).map(w => w.slice(0, 5)));
const promptText = e => textOf(e.body.match(/<div class="fx-pbox"><p class="fx-prompt">([\s\S]*?)<\/p><\/div>/)[1]);
// The word stems every prompt has (visitor, reduced, motion, turned): they say nothing about one entry, so they do not count.
const COMMON_STEMS = (sets => new Set([...sets[0]].filter(s => sets.every(set => set.has(s)))))(ENTRIES.map(e => stems(promptText(e))));
// The player of each kind of entry: its buttons as [data-fx-cmd, label]. A loop's one button swaps between Pause and Play.
const PLAYER = { loop: [['pause', 'Pause']], load: [['replay', 'Replay']], hover: [['show', 'Show me']], press: [['show', 'Show me']], scroll: [['play', 'Play'], ['top', 'Back to top']] };
for (const e of ENTRIES) {
  test(`${e.id}: its parts come in the template's order, with its chips, What you see, Good to know and the link to the real page`, () => {
    const b = e.body, hasVersion = b.includes('<div class="fx-version">');
    const order = ['<p class="fx-seen">', '<h2 ', '<p class="fx-chips">', hasVersion && '<div class="fx-version">', '<h3 class="fx-sub">What you see</h3>', '<p class="fx-what">', '<h3 class="fx-sub">Good to know</h3>', '<dl class="fx-know">',
      '<h3 class="fx-sub">Build it with these animations</h3>', '<div class="fx-cards">', '<h3 class="fx-sub">A prompt to build something similar</h3>', '<div class="fx-pbox">', '<button type="button" class="copy"', '<a class="fx-real"'].filter(Boolean);
    let last = -1;
    for (const part of order) {
      const at = b.indexOf(part);
      assert.ok(at > last, `${part} is there, after the part before it`);
      assert.equal(count(b, part), 1, `${part} is there once`);
      last = at;
    }
    assert.ok(b.includes('<h3 class="fx-sub">What you see</h3>\n    <p class="fx-what">'), 'What you see is the heading right before what you see');
    const chips = b.match(/<p class="fx-chips"><span class="fx-chip">([^<]+)<\/span><span class="fx-chip">([^<]+)<\/span><\/p>/);
    assert.ok(chips, 'two chips');
    assert.equal(chips[1], START_CHIPS[e.start], 'what starts it');
    assert.equal(chips[2], `Made from ${animations(cardCount(e))}`, 'and how many animations it is made from');
    const know = b.match(/<dl class="fx-know">([\s\S]*?)<\/dl>/)[1];
    const pairs = [...know.matchAll(/<div><dt>([^<]+)<\/dt><dd>([^<]+)<\/dd><\/div>/g)];
    assert.equal(count(know, '<dt>'), 3, 'exactly three pairs');
    assert.deepEqual(pairs.map(p => p[1]), ['Starts', 'On phones', 'Reduced motion'], 'Starts, On phones, Reduced motion');
    const prompt = textOf(b.match(/<div class="fx-pbox"><p class="fx-prompt">([\s\S]*?)<\/p><\/div>/)[1]), promptStems = stems(prompt);
    for (const [, label, line] of pairs) {
      const n = words(decode(line));
      assert.ok(n >= 2 && n <= 20 && !/["“”`]/.test(line), `${label}: "${line}" is one short plain line`);
      const shared = [...stems(line)].filter(s => promptStems.has(s) && !COMMON_STEMS.has(s));
      assert.ok(shared.length >= 2, `${label}: "${line}" shares ${shared.length} word stems with the entry's prompt and needs two (not counting ${[...COMMON_STEMS].join(', ')}, which every prompt has)`);
    }
    const href = seenHref(e);
    assert.ok(b.includes(`<a class="fx-real" href="${href}" target="_blank" rel="noopener">Watch the real one on ${hostOf(href)} <span aria-hidden="true">↗</span><span class="sr"> (opens in a new tab)</span></a>`),
      'Watch the real one: the same address as Seen on, in a new tab');
  });
}

test('two different animations on the page never share a preview', async () => {
  const { homeConst } = await tool();
  const CATS = homeConst(HOME, 'CATS'), PV = homeConst(HOME, 'PV');
  const byPreview = new Map();
  for (const slug of new Set([...PAGE.matchAll(CARD)].map(m => m[2]))) {
    const cat = CATS.find(c => c.entries.some(x => x[0] === slug));
    const key = PV[slug] || 'sig' + parseInt(cat.n, 10);
    byPreview.set(key, [...(byPreview.get(key) || []), slug]);
  }
  assert.deepEqual([...byPreview].filter(([, slugs]) => slugs.length > 1).map(([key, slugs]) => `${key}: ${slugs.join(', ')}`), []);
});

test('no company name in the page\'s title, description or social card, and no word that implies approval', () => {
  const head = [TITLE, LEDE, meta('property="og:title"'), meta('property="og:description"'), meta('name="twitter:title"'), meta('name="twitter:description"')].join(' ');
  for (const w of ENTRIES.flatMap(siteWords)) assert.ok(!names(head, w), `"${w}" in the title, description or social card`);
  const shown = textOf(MARKUP.replace(`<p class="fx-legal">${LEGAL}</p>`, ''));
  assert.ok(!/\b(official|officially|approved|endorsed|sponsored|partner|partners|as used by)\b/i.test(shown), 'no word that implies approval');
});

// ---------- What the live check settled ----------
// The names and slogans the live check saw on the sites (its record is in the run folder, not in the repository). The page
// describes each effect in its own words, so none of them is on it. Whole phrases, in any case.
const SITE_PHRASES = [
  'Financial infrastructure to grow your revenue', 'Global GDP running on Stripe', 'Innovation you can see, hear, and feel',
  'Pushing boundaries from the inside out', 'More pixels than a 4K TV', 'Spatial Audio', 'spatial computing', 'micro-OLED', 'McLaren',
  'Redefining limits', 'Defining a legacy', 'The product development system for teams and agents', 'Purpose-built for planning',
  'Designed for the AI era', 'New · Loops', 'HomeView', 'Designed for life at home', 'Shop Special Stores', 'Page Previews',
  'Music for everyone', 'Preview of Spotify', 'Your YouTube history is off', 'In pursuit of democracy', 'Each dot represents',
  'Bright dots are ones', 'Keep scrolling or Skip to next', 'To make Medium work', 'Welcome to the mother chip', 'Pro further', 'A20 Pro'
];
// The entries the live check covered, and the day it checked them. At the owner's review entry 7 gave its place to reserve R3
// (apple-sweep), which the check covered too, and entry 8 was left out, as no other reserve had passed.
const CHECKED_IDS = ['stripe-ribbon', 'apple-scroll', 'landonorris-reveal', 'linear-intro', 'apple-menu', 'wikipedia-previews', 'apple-sweep', 'spotify-cards', 'youtube-loading', 'pudding-chart', 'medium-top-bar'];
const CHECKED_DAY = '2026-10-13';
// Entries checked again on their site before the gallery release, and the day of that check.
const RECHECKED = { 'apple-menu': '2026-10-22', 'apple-scroll': '2026-10-22', 'landonorris-reveal': '2026-10-22', 'linear-intro': '2026-10-22', 'stripe-ribbon': '2026-10-22', 'wikipedia-previews': '2026-10-22' };

// The text a visitor reads, with each tag ending a word (textOf above joins the end of one element to the start of the next, so a
// slogan at the end of a card label would run into the card's name and go unseen).
const spaced = html => decode(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

test('no visible text of the page holds a name or slogan the live check saw on a site', () => {
  const shown = spaced(MARKUP);
  assert.ok(shown.includes('Famous effects') && shown.length > 1000, 'the visible text of the whole page');
  for (const phrase of SITE_PHRASES) assert.ok(!names(shown, phrase), `"${phrase}" is in the text of the page`);
});

test(`each entry the live check covered is dated ${CHECKED_DAY}, or the day it was checked again`, () => {
  const present = ENTRIES.filter(e => CHECKED_IDS.includes(e.id));
  assert.ok(present.length > 0, 'the page holds some of the checked entries');
  for (const e of present) {
    const seen = e.body.match(/<p class="fx-seen">[\s\S]*?<\/p>/);
    assert.ok(seen, `${e.id}: a Seen on line`);
    const days = [...seen[0].matchAll(/<time datetime="([^"]*)">/g)].map(m => m[1]);
    const day = RECHECKED[e.id] || CHECKED_DAY;
    assert.deepEqual(days, [day], `${e.id}: its Seen on line is dated ${day}`);
  }
});

test('the page holds 10 to 12 entries, and its one pill counts them', () => {
  assert.ok(ENTRIES.length >= 10 && ENTRIES.length <= 12, `${ENTRIES.length} entries, not 10 to 12`);
  assert.equal(count(MARKUP, 'class="pill"'), 1, 'one pill');
  assert.ok(MARKUP.includes(`<p class="pill">${ENTRIES.length} effects from well-known websites</p>`), 'the pill gives the number of entries');
});

test('from 601px to 640px the top bar\'s two text links are narrower, so the bar fits beside the logo', () => {
  const band = PAGE.match(/@media\(min-width:601px\) and \(max-width:640px\)\{([^{}]*)\{([^{}]*)\}\}/);
  assert.ok(band, 'a rule for that band');
  assert.equal(band[1], '.top .nav .lnk', 'for the two text links');
  assert.match(band[2], /^padding:0 \d+px$/, 'with less padding');
});

// ---------- Rules the tests did not hold yet (final review B) ----------
// The page's own style (no generated previews, no comments) and its script.
const OWN_CSS = (() => {
  const css = between(PAGE, '<style>', '</style>'), a = css.indexOf('/* ── previews:'), b = css.indexOf('/* ── end of previews ── */');
  return (css.slice(0, a) + css.slice(b)).replace(/\/\*[\s\S]*?\*\//g, '');
})();
const SCRIPT = [...PAGE.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n');
// The top-level blocks of a style, as { head, body }.
const cssBlocks = css => {
  const out = [];
  let depth = 0, head = '', body = '';
  for (const ch of css) {
    if (ch === '{' && depth++ === 0) { body = ''; continue; }
    if (ch === '}' && --depth === 0) { out.push({ head: head.trim(), body }); head = ''; continue; }
    if (depth) body += ch; else head += ch;
  }
  return out;
};

test('one <main> holds the entries, and the only request that leaves the site is the GitHub star count', () => {
  assert.equal(count(MARKUP, '<main'), 1, 'one <main>');
  assert.ok(MARKUP.indexOf('<main') < MARKUP.indexOf('<section class="fx"') && MARKUP.indexOf('</main>') > MARKUP.lastIndexOf('</section>'), 'around the entries');
  const calls = [...SCRIPT.matchAll(/\b(fetch|XMLHttpRequest|sendBeacon|EventSource|WebSocket)\b\s*\(?\s*(['"`]?)([^'"`)]*)/g)].map(m => `${m[1]} ${m[3]}`);
  assert.deepEqual(calls, [`fetch ${REPO.replace('github.com/', 'api.github.com/repos/')}`], 'one request: the star count');
  for (const [tag] of PAGE.matchAll(/<link\b[^>]*>/g)) {
    if (!/\srel="canonical"/.test(tag)) assert.ok(!/\shref="(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(tag), `a <link> that loads from elsewhere: ${tag}`);
  }
});

test('hover effects only where hover exists, the message fades in place under reduced motion, and prompts start at five lines on phones', () => {
  const blocks = cssBlocks(OWN_CSS), block = head => (blocks.find(b => b.head === head) || { body: '' }).body;
  for (const { head, body } of blocks) {
    if (head === '@media(hover:hover)' || head === '@media(prefers-reduced-motion:reduce)') continue; // the second only undoes the lift
    assert.ok(!/:hover/.test(head + body), `a hover rule outside @media(hover:hover): ${head}`);
  }
  assert.match(block('@media(prefers-reduced-motion:reduce)'), /\.toast\{transform:translate\(-50%,0\);transition:opacity \.25s\}/, 'the message does not slide');
  assert.match(block('@media(max-width:600px)'), /\.fx-prompt\.is-clamped\{[^}]*-webkit-line-clamp:5/, 'five lines on phones');
  assert.ok(SCRIPT.includes("p.classList.add('is-clamped');"), 'each prompt starts shortened');
});

// ---------- The pop-up, the pictures of the tiles and Our version (docs/superpowers/specs/2026-10-22-famous-gallery-popup-design.md) ----------
const CSS_BLOCKS = cssBlocks(OWN_CSS);
const blockBody = head => (CSS_BLOCKS.find(b => b.head === head) || { body: '' }).body;
const rule = (blocks, selector) => (blocks.find(b => b.head === selector) || { body: '' }).body;
// The style of one @media block, as its own blocks.
const inner = head => cssBlocks(blockBody(head));
const PHONE = '@media(max-width:600px),(max-height:500px)';

test('the gallery has three columns from 961px, two from 601px and one below, with smaller gaps on phones', () => {
  assert.match(rule(CSS_BLOCKS, '.fx-grid'), /display:grid;grid-template-columns:repeat\(3,minmax\(0,1fr\)\);gap:clamp\(\d+px,[\d.]+vw,\d+px\)/, 'three columns from 961px');
  assert.match(rule(inner('@media(max-width:960px)'), '.fx-grid'), /grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/, 'two columns from 601px to 960px');
  const phone = rule(CSS_BLOCKS.filter(b => b.head === '@media(max-width:600px)').flatMap(b => cssBlocks(b.body)), '.fx-grid');
  assert.match(phone, /grid-template-columns:minmax\(0,1fr\);gap:\d+px/, 'one column below, with a smaller gap');
  assert.match(rule(CSS_BLOCKS, '.t-stage'), /aspect-ratio:16\/10/, 'a 16:10 picture');
});

test('each tile picture is drawn at rest and moves only where motion is allowed, only inside the window, with transform and opacity alone', () => {
  const pictures = [...new Set([...GALLERY.matchAll(/<div class="gp (gp-[a-z]+)" aria-hidden="true">/g)].map(m => m[1]))];
  assert.equal(pictures.length, ENTRIES.length, 'one picture for each entry, no two alike');
  // the part of each picture the loop moves
  const moved = { 'gp-ribbon': '.gp-ribbon .rb', 'gp-visor': '.gp-visor .vz', 'gp-reveal': '.rv-blob', 'gp-intro': '.gp-intro i', 'gp-menu': '.mn-panel', 'gp-wiki': '.wk-card',
    'gp-sweep': '.gp-sweep .sw i', 'gp-cards': '.gp-cards .play', 'gp-load': '.gp-load .ld i b', 'gp-chart': '.gp-chart .bar', 'gp-bar': '.tb-page' };
  const motion = blockBody('@media(prefers-reduced-motion:no-preference)');
  assert.ok(motion, 'the loops are inside @media(prefers-reduced-motion:no-preference)');
  for (const name of pictures) {
    assert.ok(OWN_CSS.includes(`.${name}{`), `${name} is drawn`);
    assert.ok(moved[name], `the test knows what ${name} moves`);
    assert.ok(new RegExp(`${escapeRe(moved[name])}\\{[^}]*animation:g-`).test(motion), `${name}: ${moved[name]} moves where motion is allowed`);
  }
  for (const { head, body } of CSS_BLOCKS) {
    if (!head.startsWith('@') && /animation\s*:/.test(body)) assert.ok(head.startsWith('.fx-dlg[open]'), `${head} moves outside the no-preference block (only the pop-up's fade does, and reduced motion switches that off)`);
  }
  const names = [...OWN_CSS.matchAll(/animation:([a-z-]+) /g)].map(m => m[1]);
  assert.ok(names.length >= pictures.length, 'every picture has a loop');
  for (const name of new Set(names)) assert.ok(CSS_BLOCKS.some(b => b.head === `@keyframes ${name}`), `@keyframes ${name} exists`);
  const frames = CSS_BLOCKS.filter(b => b.head.startsWith('@keyframes '));
  assert.ok(frames.length >= 20, 'the loops have their keyframes');
  for (const { head, body } of frames) {
    const props = [...body.matchAll(/\{([^{}]*)\}/g)].flatMap(m => m[1].split(';').map(d => d.split(':')[0].trim()).filter(Boolean));
    for (const prop of props) assert.ok(prop === 'transform' || prop === 'opacity', `${head} animates ${prop}, not only transform and opacity`);
  }
  assert.ok(OWN_CSS.includes('.js .tile:not(.playing) .gp *{animation-play-state:paused!important}') || /\.js \.tile:not\(\.playing\) \.gp \*,[^{]*\{animation-play-state:paused!important\}/.test(OWN_CSS), 'a tile that is not playing holds still');
  assert.ok(/\.fx-open \.tile \.gp \*,[^{]*\{animation-play-state:paused!important\}/.test(OWN_CSS), 'and so does every tile behind the pop-up');
  assert.ok(SCRIPT.includes("tile.classList.add('playing')") && SCRIPT.includes('io.observe(tile)'), 'the page script plays a tile while it is in the window or holds focus');
});

test('the pop-up is one native dialog with a top bar of three 44px icon buttons, and the list of entries waits out of sight while scripts run', () => {
  assert.equal(count(MARKUP, '<dialog'), 1, 'one dialog');
  const html = between(PAGE, '<dialog class="fx-dlg" id="fx-dlg">', '</dialog>');
  const buttons = [...html.matchAll(/<button type="button" class="icon-btn fx-dbtn[^"]*" data-fx-([a-z]+(?:="[a-z]+")?) aria-label="([^"]+)"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="[^"]+"\/><\/svg><\/button>/g)];
  assert.deepEqual(buttons.map(m => m[2]), ['Previous effect', 'Next effect', 'Close'], 'Previous, Next and Close, each an icon with a name');
  assert.ok(html.indexOf('class="fx-dbar"') < html.indexOf('class="fx-dbody"'), 'the bar, then the body that holds the entry');
  assert.ok(!html.includes('<section'), 'the entries are moved in by the script');
  assert.match(rule(CSS_BLOCKS, '.icon-btn'), /width:44px;height:44px/, 'the buttons are 44px');
  assert.match(rule(CSS_BLOCKS, '.fx-dbar'), /position:sticky;top:0/, 'the bar stays at the top while the entry scrolls');
  assert.ok(rule(CSS_BLOCKS, '.js .fx-list') === 'display:none', 'scripts hide the list');
  assert.ok(/classList\.add\('js'\)/.test(between(PAGE, '<script>', '</script>')) && between(PAGE, '<script>', '</script>').includes('HTMLDialogElement.prototype.showModal'), 'the js class is set at the start, in a browser that has the dialog');
  assert.ok(MARKUP.indexOf('<dialog') > MARKUP.indexOf('id="toast"'), 'after the message box');
});

test('the pop-up is a rounded card in the page\'s surface and line colors, dimmed behind, fading in with a 12px rise, locking the page, and full screen on phones', () => {
  const dlg = rule(CSS_BLOCKS, '.fx-dlg');
  assert.match(dlg, /width:min\(980px,/, 'at most 980px wide');
  assert.match(dlg, /border:1px solid var\(--line\)/, "the page's line");
  assert.match(dlg, /border-radius:24px/, '24px corners');
  assert.match(dlg, /background:var\(--surface\)/, "the page's surface");
  assert.match(dlg, /margin:auto/, 'centered (the page resets margins)');
  assert.match(dlg, /overflow:auto/, 'the dialog itself scrolls');
  assert.match(rule(CSS_BLOCKS, '.fx-dlg::backdrop'), /background:rgba\(/, 'a dim backdrop');
  assert.match(rule(CSS_BLOCKS, '.fx-dlg[open]'), /animation:fx-in /, 'it fades in');
  assert.match(blockBody('@keyframes fx-in'), /from\{opacity:0;transform:translateY\(12px\)\}/, 'with a 12px rise');
  assert.match(rule(CSS_BLOCKS, 'html.fx-open'), /overflow:hidden/, 'the page behind does not scroll');
  const calm = CSS_BLOCKS.filter(b => b.head === '@media(prefers-reduced-motion:reduce)').map(b => b.body).join('\n');
  assert.match(calm, /\.fx-dlg\[open\],\.fx-dlg\[open\]::backdrop\{animation:none\}/, 'under reduced motion it appears at once');
  const phone = inner(PHONE);
  assert.match(rule(phone, '.fx-dlg'), /width:100%;height:100%;max-height:none;border:0;border-radius:0/, 'on phones it fills the screen');
  assert.match(rule(phone, '.fx-dlg .copy'), /position:sticky;bottom:\d+px/, "on phones the entry's own Copy prompt sticks to the bottom");
  assert.match(rule(CSS_BLOCKS, '.fx-stage'), /height:clamp\(240px,calc\(100dvh - 420px\),420px\)/, 'Our version is 420px tall, less in a short window, so it and its player fit the first screen');
  assert.match(rule(phone, '.fx-stage'), /height:min\(300px,calc\(100dvh - 140px\)\)/, 'and 300px on phones, less in a short window');
  assert.match(rule(inner('@media(max-height:500px)'), '.fx-dlg .copy'), /position:static/, 'in a short window Copy prompt does not stick (it would cover the stage)');
  assert.match(rule(CSS_BLOCKS, '.fx-stage'), /background:#08080a/, 'always dark');
});

test('the pop-up\'s script: it opens a tile\'s entry with showModal, pushes the address, replaces it for Previous and Next, and closes every way through one handler', () => {
  for (const part of ['dlg.showModal()', 'history.pushState({fxPushed:true},\'\',\'#\'+id)', 'history.replaceState({fxPushed:pushed()},\'\',\'#\'+id)', 'history.back()',
    "addEventListener('popstate',sync)", "dlg.addEventListener('close',", "e.button||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey", "(at+step+entries.length)%entries.length", 'dlg.setAttribute(\'aria-labelledby\',id+\'-t\')',
    "entry.querySelector('h2').focus({preventScroll:true})", "tile.focus()", "root.classList.add('fx-open')", "root.classList.remove('fx-open')"]) {
    assert.ok(SCRIPT.includes(part), `the script has ${part}`);
  }
  assert.ok(SCRIPT.includes("history.replaceState(null,'',location.pathname+location.search)"), 'a close that did not push goes back to the page address');
  assert.ok(SCRIPT.includes('holder.append(entry)') && SCRIPT.includes('slot.replaceWith(entry)'), "the entry's section is moved in and put back where it was");
});

test('an entry\'s version loads from data-src only while its entry is open, in a fresh frame, and its player sends the command with postMessage', () => {
  assert.ok(SCRIPT.includes('frame.src=frame.dataset.src'), 'the frame gets its src from data-src');
  assert.ok(SCRIPT.includes('const fresh=frame.cloneNode(false)') && SCRIPT.includes("fresh.removeAttribute('src')") && SCRIPT.includes('frame.replaceWith(fresh)'), 'and is replaced by an empty one when its entry closes or changes');
  assert.ok(/startVersion\(entry\)/.test(SCRIPT) && /unmount\(entry\)\{\s*stopVersion\(entry\)/.test(SCRIPT), 'started with its entry, stopped when it goes back to the list');
  assert.ok(SCRIPT.includes("frame.contentWindow.postMessage({fx:cmd},location.protocol==='file:'?'*':location.origin)"), "a player button sends {fx: command} to the frame, naming this site's origin (a page opened from disk has none)");
  assert.ok(SCRIPT.includes("fresh.removeAttribute('data-ready')"), 'the empty frame that replaces a used one is not marked ready (commands would go to a blank page and be lost)');
  assert.ok(SCRIPT.includes('.fx-player [data-fx-cmd]') && SCRIPT.includes("dataset.fxStart==='loop'"), 'any player button works by its data-fx-cmd, and a loop\'s Pause and Play swap');
  assert.ok(!/<iframe[^>]*\ssrc=/.test(PAGE), 'no frame has a src in the markup');
});

test('closing after Previous and Next brings the tile back into view, a double-click does not close what it opened, and a failing set-up falls back to the list', () => {
  assert.ok(SCRIPT.includes('viaBack=goBack&&!fromHistory'), 'a close that goes back in the history is told apart');
  assert.ok(/addEventListener\('popstate',\(\)=>setTimeout\(\(\)=>\{[^]*?tile\.closest\('\.tile'\)\.scrollIntoView\(\{block:'nearest'\}\);[^]*?tile\.focus\(\{preventScroll:true\}\);?[^]*?\},0\),\{once:true\}\)/.test(SCRIPT),
    "once the history has moved (the browser puts the page back where it was after that), the whole tile is scrolled into view and its link keeps focus");
  assert.ok(SCRIPT.includes('e.target===dlg&&downOnBackdrop&&e.detail<2&&outside(e)'), 'the second click of a double-click, which lands on the backdrop, closes nothing');
  assert.ok(SCRIPT.includes("try{popup();}catch(err){document.documentElement.classList.remove('js');}"), 'if the set-up throws, the js class goes and the list shows');
  assert.ok(SCRIPT.includes('catch(err){fail(id);}') && SCRIPT.includes('entry.scrollIntoView();') && SCRIPT.includes('const live=()=>root.classList.contains(\'js\');'), 'a press (or an address) that fails falls back to the list too and jumps to the entry, and the handlers stand down');
  assert.ok(SCRIPT.includes("stage.classList.add('is-focused')") && SCRIPT.includes("stage.classList.remove('is-focused')"), 'the stage shows when the frame holds keyboard focus');
  assert.match(rule(CSS_BLOCKS, '.fx-stage.is-focused'), /outline:3px solid var\(--brand\);outline-offset:3px/, 'as a ring, since the browser draws none inside a frame');
});

test('without scripts Our version stays hidden, and the pop-up says once, in its own bar, that the page is not connected to the site', () => {
  assert.match(rule(CSS_BLOCKS, '.fx-version'), /display:none/, 'hidden until scripts run (a script fills the frame)');
  assert.match(rule(CSS_BLOCKS, '.js .fx-version'), /display:block/, 'and shown with them');
  assert.equal(count(PAGE, 'class="fx-dnote"'), 1, 'one note');
  assert.ok(between(PAGE, '<div class="fx-dbar">', '<div class="fx-dbody">').includes('<p class="fx-dnote">Not connected to the site. Everything shown is our own version.</p>'), 'in the bar of the pop-up, which stays on screen');
  assert.ok(!ENTRIES.some(e => /fx-dnote|Not connected/.test(e.body)), 'not in each entry');
  assert.match(rule(CSS_BLOCKS, '.fx-dnote'), /font-size:12px;[^}]*color:var\(--muted\)/, 'small and muted');
});

test('the tile pictures do not repeat the look of a site: the round play button is a palette color, not green, and the menu button has three lines', () => {
  assert.match(rule(CSS_BLOCKS, '.gp-cards .play'), /background:var\(--c1\)/, 'the play button is the palette blue');
  assert.ok(GALLERY.includes('<div class="mn-btn"><i></i><i></i><i></i></div>'), 'a plain three-line menu button');
});

// ---------- Our version: the frames of the entries and the files they load ----------
const VERSIONS = ENTRIES.filter(e => e.body.includes('<div class="fx-version">'));
// The words a version shows: its markup without scripts and styles, with the words of its labels (title, aria-label, alt, data-alt).
const versionText = html => spaced(html.replace(/<script\b[\s\S]*?<\/script>/g, ' ').replace(/<style\b[\s\S]*?<\/style>/g, ' ')
  + ' ' + [...html.matchAll(/\s(?:aria-label|alt|data-alt|title)="([^"]*)"/g)].map(m => m[1]).join(' '));
const ALL_SITES = ENTRIES.map(e => e.site.replace(/^The /, ''));

test('at least one entry shows Our version', () => assert.ok(VERSIONS.length > 0, 'a .fx-version block'));

for (const e of VERSIONS) {
  test(`${e.id}: its Our version block holds the frame, the label and the player for what starts it`, () => {
    const block = e.body.match(/<div class="fx-version">\s*<div class="fx-stage">\s*<iframe title="Our version: ([^"]+)" data-src="(versions\/[a-z0-9-]+\.html)"><\/iframe>\s*<span class="fx-vlabel" aria-hidden="true">Our version<\/span>\s*<\/div>\s*<div class="fx-player">([\s\S]*?)<\/div>\s*<\/div>/);
    assert.ok(block, 'the stage with its frame and its label, then the player');
    assert.equal(decode(block[1]), h2Of(e), "the frame is titled with the entry's own title");
    assert.equal(block[2], `versions/${e.id}.html`, 'it loads the version of this entry');
    assert.ok(e.body.indexOf('<div class="fx-version">') > e.body.indexOf('<p class="fx-chips">') && e.body.indexOf('<div class="fx-version">') < e.body.indexOf('<p class="fx-what">'), 'right after the chips');
    const buttons = [...block[3].matchAll(/<button type="button" class="fx-pbtn" data-fx-cmd="([a-z]+)">([^<]+)<\/button>/g)].map(m => [m[1], m[2]]);
    assert.deepEqual(buttons, PLAYER[e.start], `the player for a ${e.start} entry`);
    assert.equal(count(block[3], '<button'), buttons.length, 'no other button');
    const hint = block[3].match(/<p class="fx-phint">([^<]+)<\/p>/);
    assert.ok(hint, 'a hint');
    if (e.start === 'scroll') assert.equal(hint[1], 'Built from the prompt below. Scroll inside the box, or press Play.', 'the hint for a scroll entry');
  });

  test(`${e.id}: its version file exists, loads nothing from elsewhere but the site font, is not indexed, has its title, a reduced-motion rule and a message handler that trusts only its parent, and shows no site name`, () => {
    const src = e.body.match(/data-src="(versions\/[a-z0-9-]+\.html)"/)[1];
    const file = path.join(ROOT, 'famous', src);
    assert.ok(fs.existsSync(file), `${src} exists`);
    const html = read(file);
    assert.ok(html.includes('<meta name="robots" content="noindex">'), 'noindex');
    assert.ok(html.includes(`<title>Our version: ${h2Of(e)}</title>`), 'titled Our version: and the entry\'s title');
    // loads nothing from elsewhere: every address in it is a font of the repository (or a data: picture, or a place in the page itself)
    const refs = [...html.matchAll(/\b(?:src|href|srcset|poster|action|data|formaction)\s*=\s*["']([^"']*)["']/g)].map(m => m[1])
      .concat([...html.matchAll(/url\(\s*(["']?)([^"')]*)\1\s*\)/g)].map(m => m[2]));
    for (const ref of refs) assert.ok(ref.startsWith('../../assets/fonts/') || ref.startsWith('data:') || ref.startsWith('#'), `${src} loads ${ref}`);
    for (const ref of refs.filter(r => r.startsWith('../../assets/fonts/'))) assert.ok(fs.existsSync(path.resolve(ROOT, 'famous', 'versions', ref)), `the font ${ref} exists`);
    assert.ok(!/@import|<link\b|<img\b|<iframe\b|<video\b|<audio\b|<object\b|<embed\b|https?:\/\//i.test(html.replace(/\/\*[\s\S]*?\*\//g, '')), 'no import, link, picture, frame or web address');
    const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n');
    assert.ok(!/\b(fetch|XMLHttpRequest|sendBeacon|EventSource|WebSocket|importScripts|import)\s*\(|new\s+(Worker|SharedWorker)\b/.test(script), 'its script makes no request');
    assert.ok(/@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/.test(html) || /matchMedia\(\s*['"]\(prefers-reduced-motion\s*:\s*reduce\)['"]/.test(script), 'a reduced-motion rule');
    assert.ok(/@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/.test(html), 'in its style');
    assert.ok(/matchMedia\(\s*['"]\(prefers-reduced-motion\s*:\s*reduce\)['"]\s*\)/.test(script), 'it asks matchMedia about reduced motion');
    const start = (MARKUP.match(new RegExp(`<section class="fx" id="${e.id}"[^>]*data-fx-start="([a-z]+)"`)) || [])[1];
    const rootRules = [...html.matchAll(/(?:^|[}\s])(?:html|body)\s*(?:,\s*(?:html|body)\s*)*\{([^}]*)\}/g)].map(m => m[1]).join(';');
    if (start === 'scroll') assert.ok(/overscroll-behavior\s*:\s*contain/.test(html), 'its scroller keeps the scroll to itself (overscroll-behavior: contain)');
    else assert.ok(!/overscroll-behavior\s*:\s*contain/.test(rootRules), 'it does not scroll, so html and body leave the wheel and a finger free to scroll the pop-up (no overscroll-behavior: contain there)');
    // a finger kept for the effect (touch-action: none) only where the prompt makes a finger drag drive it, and said so on the html
    const keepsFinger = /touch-action\s*:\s*none/.test(html), saysDrag = /<html\b[^>]*\bdata-fx-touch="drag"/.test(html);
    assert.equal(keepsFinger, saysDrag, keepsFinger ? 'it keeps the finger (touch-action: none), so its html says data-fx-touch="drag"' : 'data-fx-touch="drag" only on a version that keeps the finger');
    if (saysDrag) assert.ok(/\bfinger\b[^.]*\bdrag|\bdrag[^.]*\bfinger\b/i.test(promptText(e)), 'data-fx-touch="drag" only where its prompt makes a finger drag drive the effect');
    if (/requestAnimationFrame/.test(script)) {
      assert.ok(/\bFRAME\s*=\s*1000\s*\/\s*60\b/.test(script) && /Math\.min\(\s*ts\s*-\s*lastT\s*,\s*50\s*\)/.test(script) && /\bdt\s*\)?\s*\/\s*FRAME\b/.test(script), 'its frame loop steps by elapsed time (dt / FRAME), not by a fixed amount a frame');
    }
    assert.ok(/addEventListener\(\s*['"]message['"]/.test(script), 'a message listener');
    assert.ok(/\.source\s*(?:!==|===|!=|==)\s*(?:window\.)?parent\b/.test(script) || /\b(?:window\.)?parent\s*(?:!==|===|!=|==)\s*\w+\.source\b/.test(script), 'that checks the message comes from its parent');
    const text = versionText(html);
    assert.ok(text.length > 40, 'it shows words');
    for (const name of ALL_SITES) assert.ok(!names(text, name), `${src} shows the site name "${name}"`);
    for (const phrase of SITE_PHRASES) assert.ok(!names(text, phrase), `${src} shows "${phrase}"`);
  });
}

test('every entry has its own version', { todo: 'versions come one at a time' }, () => {
  for (const e of ENTRIES) {
    const m = e.body.match(/<iframe title="Our version: [^"]+" data-src="(versions\/[a-z0-9-]+\.html)"/);
    assert.ok(m, `${e.id} has no Our version block yet`);
    assert.equal(m[1], `versions/${e.id}.html`, `${e.id} loads its own file`);
    assert.ok(fs.existsSync(path.join(ROOT, 'famous', m[1])), `${m[1]} exists`);
  }
});
