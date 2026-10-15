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

test('the not-connected line is on the page once, word for word, above the jump row and every entry', () => {
  assert.equal(count(PAGE, LEGAL), 1, 'once');
  assert.ok(PAGE.includes(`<p class="fx-legal">${LEGAL}</p>`), 'in its own paragraph');
  const at = PAGE.indexOf(LEGAL);
  assert.ok(at < PAGE.indexOf('<nav class="fx-jump"'), 'above the jump row');
  assert.ok(PAGE.indexOf('<section class="fx"') < 0 || at < PAGE.indexOf('<section class="fx"'), 'above the first entry');
});

test('the page loads nothing from elsewhere, uses only the site\'s font in its own style and shows no code', async () => {
  const { CSS_START, CSS_END } = await tool();
  for (const bad of ['<img', '<video', '<iframe', '<picture', '<object', '<embed', '@import', 'url(http']) assert.ok(!PAGE.includes(bad), bad);
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
  assert.ok(PAGE.indexOf('<nav class="fx-jump"') < PAGE.indexOf('<section class="fx"'), 'the entries come after the jump row');
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

test('the jump row links each entry once, in page order, each chip starting with its site, and the skip link leads to the first entry', () => {
  const nav = between(PAGE, '<nav class="fx-jump" aria-label="Effects on this page">', '</nav>');
  const links = [...nav.matchAll(/<a href="#([a-z0-9-]+)">([^<]+)<\/a>/g)];
  assert.deepEqual(links.map(m => m[1]), ENTRIES.map(e => e.id), 'one chip per entry, in order');
  for (const [, id, label] of links) assert.ok(decode(label).startsWith(`${ENTRIES.find(e => e.id === id).site} · `), `${id}: "${label}" starts with its site`);
  assert.ok(PAGE.includes(`<a class="skip" href="#${ENTRIES[0].id}">Skip to the first effect</a>`), 'the skip link');
});

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

// The text a visitor reads, with each tag ending a word (textOf above joins the end of one element to the start of the next, so a
// slogan at the end of a card label would run into the card's name and go unseen).
const spaced = html => decode(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

test('no visible text of the page holds a name or slogan the live check saw on a site', () => {
  const shown = spaced(MARKUP);
  assert.ok(shown.includes('Famous effects') && shown.length > 1000, 'the visible text of the whole page');
  for (const phrase of SITE_PHRASES) assert.ok(!names(shown, phrase), `"${phrase}" is in the text of the page`);
});

test(`each entry the live check covered is dated ${CHECKED_DAY}, the day it was checked`, () => {
  const present = ENTRIES.filter(e => CHECKED_IDS.includes(e.id));
  assert.ok(present.length > 0, 'the page holds some of the checked entries');
  for (const e of present) {
    const seen = e.body.match(/<p class="fx-seen">[\s\S]*?<\/p>/);
    assert.ok(seen, `${e.id}: a Seen on line`);
    const days = [...seen[0].matchAll(/<time datetime="([^"]*)">/g)].map(m => m[1]);
    assert.deepEqual(days, [CHECKED_DAY], `${e.id}: its Seen on line is dated ${CHECKED_DAY}`);
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
