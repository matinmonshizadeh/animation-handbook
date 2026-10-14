// Static checks for the Animation finder on the home page (index.html): its questions (FIND_Q), each card's answers (FIND), the
// matching (findMatches), the finder's markup and pictures, the Not here? link and its GitHub form, and the finder's test set.
// The page's own code is read with vm, as tests/pages.test.js reads the search. Run from the repo root: node --test "tests/*.test.js"
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(f, 'utf8');
const count = (s, sub) => s.split(sub).length - 1;
// The part of s from the first `from` up to the next `to` after it ('' when `from` is missing), as in tests/pages.test.js.
const between = (s, from, to) => {
  const start = s.indexOf(from);
  if (start < 0) return '';
  const end = s.indexOf(to, start + from.length);
  return s.slice(start, end < 0 ? undefined : end);
};
// A value made in a vm context, copied into plain arrays and objects that deepEqual accepts.
const plain = v => JSON.parse(JSON.stringify(v));
const HOME = read(path.join(ROOT, 'index.html'));

// As in tests/pages.test.js: where the bracket that opens at HOME[from] ('[' or '{') is closed, stepping over strings and //
// comments, and the value of `const NAME=` in the home page's script, read with vm.
function blockEnd(from) {
  const open = HOME[from], close = open === '[' ? ']' : '}';
  let depth = 0, i = from, quote = null;
  for (; i < HOME.length; i++) {
    const ch = HOME[i];
    if (quote) { if (ch === '\\') i++; else if (ch === quote) quote = null; continue; }
    if (ch === '/' && HOME[i + 1] === '/') { while (i < HOME.length && HOME[i] !== '\n') i++; continue; }
    if (ch === "'" || ch === '"' || ch === '`') quote = ch;
    else if (ch === open) depth++;
    else if (ch === close && --depth === 0) break;
  }
  return i;
}
function homeConst(name) {
  const start = HOME.indexOf(`const ${name}=`);
  assert.ok(start >= 0, `const ${name} in index.html`);
  const from = start + `const ${name}=`.length;
  return plain(vm.runInNewContext('(' + HOME.slice(from, blockEnd(from) + 1) + ')'));
}
const at = marker => { const i = HOME.indexOf(marker); assert.ok(i >= 0, `${marker} in index.html`); return i; };
const source = name => { const start = at(`function ${name}(`); return HOME.slice(start, blockEnd(HOME.indexOf('{', start)) + 1); };
// The finder as the page runs it: the cards in home order, built by the page's own code from PLACE_LIST up to BY_SLUG (as the
// search tests build them), with FIND_Q, FIND and the finder's functions in one context. `data` adds to the context or replaces
// CATS, PLACES or FIND with test data.
function finder(data = {}) {
  const context = vm.createContext({ CATS: homeConst('CATS'), PLACES: homeConst('PLACES'), FIND_Q: homeConst('FIND_Q'), FIND: homeConst('FIND'), ...data });
  vm.runInContext(HOME.slice(at('const PLACE_LIST=['), at('const BY_SLUG=')), context);
  for (const name of ['findQuery', 'findWords', 'findScore', 'findMatches', 'findIssueURL']) vm.runInContext(source(name), context);
  return context;
}
// The finder over test cards, one group in this order: each [slug, what, when, how], the answers written as FIND writes them.
function cards(rows) {
  const CATS = [{ name: 'Test', cat: 'c1-cat', dot: '#000000', n: '01', desc: 'Test cards.', folder: 'animations/01-test',
    entries: rows.map(([slug]) => [slug, slug, 'A test card. Best for tests.']) }];
  return finder({ CATS, PLACES: Object.fromEntries(rows.map(([slug]) => [slug, ['btn']])), FIND: Object.fromEntries(rows.map(([slug, ...answers]) => [slug, answers])) });
}
const slugs = list => Array.from(list, e => e.slug);

// ── The questions, the answers and the matching ──

const QUESTIONS = [
  ['what', 'What moved?', 2, [['text', 'Text or numbers'], ['card', 'A picture or card'], ['button', 'A button or icon'], ['menu', 'A menu or form'],
    ['loader', 'A loading sign or message'], ['shape', 'A line or shape'], ['particles', 'Dots or particles'], ['background', 'The background'],
    ['page', 'The whole page']]],
  ['when', 'When did it move?', 1, [['scroll', 'When I scrolled'], ['hover', 'When I pointed at it'], ['click', 'When I clicked or tapped'],
    ['drag', 'When I dragged or swiped'], ['load', 'When the page opened'], ['newpage', 'When I went to another page'], ['loop', 'By itself, again and again']]],
  ['how', 'How did it move?', 3, [['fade', 'Faded or blurred'], ['slide', 'Slid'], ['grow', 'Grew or shrank'], ['turn', 'Turned or flipped'],
    ['bounce', 'Bounced or shook'], ['stagger', 'One after another'], ['pieces', 'Broke into pieces'], ['follow', 'Followed my pointer'],
    ['color', 'Changed color or glowed'], ['morph', 'Changed into something else'], ['draw', 'Drew or typed itself'], ['reveal', 'Got uncovered'],
    ['layers', 'Moved in layers'], ['pin', 'Stayed in place while I scrolled'], ['drift', 'Drifted or floated'], ['wave', 'Rippled or waved'],
    ['glitch', 'Glitched or flickered']]]
];

test('FIND_Q holds the three questions in order, with the answers of the spec in their exact words', () => {
  const questions = homeConst('FIND_Q');
  assert.deepEqual(questions.map(q => [q.key, q.title, q.weight, q.answers.map(a => [a.key, a.words])]), QUESTIONS);
  assert.equal(questions[2].hint, 'Pick the picture closest to what you saw.');
  for (const q of questions.slice(0, 2)) {
    for (const a of q.answers) assert.match(a.icon || '', /^(<(path|rect|circle) [^<>]*\/>)+$/, `${a.key}: a still icon in the site's line style`);
  }
  for (const a of questions[2].answers) assert.equal(a.pic, `fd-${a.key}`, `${a.key}: the class of its moving picture`);
});

test('FIND lists every card once, in home order, with 1–3 What, 1–3 When and 1–4 How answers, all known, none twice', () => {
  const find = homeConst('FIND'), questions = homeConst('FIND_Q');
  const all = homeConst('CATS').flatMap(cat => cat.entries.map(e => e[0]));
  assert.deepEqual(Object.keys(find), all, 'FIND lists every card once, in home order');
  const problems = [];
  for (const slug of all) {
    const row = find[slug];
    if (!Array.isArray(row) || row.length !== 3) { problems.push(`${slug}: not three lists`); continue; }
    questions.forEach((q, i) => {
      const keys = String(row[i]).split(' '), most = q.key === 'how' ? 4 : 3;
      if (keys.length > most) problems.push(`${slug}: ${keys.length} ${q.key} answers, at most ${most}`);
      for (const key of keys) if (!q.answers.some(a => a.key === key)) problems.push(`${slug}: "${key}" is not a ${q.key} answer`);
      if (new Set(keys).size !== keys.length) problems.push(`${slug}: a ${q.key} answer twice`);
    });
  }
  assert.deepEqual(problems, []);
});

test('FIND sits right after PLACES', () => {
  const end = blockEnd(HOME.indexOf('{', at('const PLACES='))) + 1;
  assert.match(HOME.slice(end, at('const FIND=')), /^;\s*(\/\/[^\n]*\n\s*)*$/, 'only a comment line between PLACES and FIND');
});

test("a card's points: its main answer earns twice the question's weight, another answer once (the spec's example)", () => {
  const page = cards([['letters', 'text', 'load scroll', 'stagger fade'], ['typewriter', 'text', 'load loop', 'draw stagger'], ['fade', 'card text', 'load scroll click', 'fade']]);
  const answers = { what: 'text', when: 'load', how: 'stagger' };
  assert.deepEqual(plain(page.findScore('letters', answers)), { points: 12, misses: 0, size: 5 });
  assert.deepEqual(plain(page.findScore('typewriter', answers)), { points: 9, misses: 0, size: 5 });
  assert.deepEqual(plain(page.findScore('fade', answers)), { points: 4, misses: 1, size: 6 });
  const found = page.findMatches(answers);
  assert.deepEqual([slugs(found.best), slugs(found.close)], [['letters', 'typewriter'], ['fade']]);
});

test('no answer, or only Not sure, gives no cards, and an unknown key counts as Not sure', () => {
  const page = cards([['a', 'text', 'load', 'fade'], ['b', 'card', 'load', 'fade']]);
  for (const answers of [{}, { what: '', when: '', how: '' }, { what: 'unsure', when: 'unsure', how: 'unsure' }, { what: 'zebra' }]) {
    assert.deepEqual(plain(page.findMatches(answers)), { best: [], close: [] }, JSON.stringify(answers));
  }
  assert.deepEqual(plain(page.findMatches({ what: 'zebra', when: 'unsure', how: 'fade' })), plain(page.findMatches({ how: 'fade' })));
});

test('Best has no miss; Close has exactly one, and only when two or more questions are answered', () => {
  const page = cards([['a', 'text', 'load', 'fade'], ['b', 'card', 'load', 'fade'], ['c', 'card', 'scroll', 'slide']]);
  let found = page.findMatches({ what: 'text' });
  assert.deepEqual([slugs(found.best), slugs(found.close)], [['a'], []], 'one question answered: no Close matches');
  found = page.findMatches({ what: 'text', how: 'fade' });
  assert.deepEqual([slugs(found.best), slugs(found.close)], [['a'], ['b']], 'b misses What only, c misses both');
  found = page.findMatches({ what: 'text', when: 'load', how: 'fade' });
  assert.deepEqual([slugs(found.best), slugs(found.close)], [['a'], ['b']], 'c misses all three');
});

test('a main answer counts double', () => {
  const page = cards([['side', 'card text', 'load', 'fade'], ['main', 'text card', 'load', 'fade']]);
  assert.deepEqual(slugs(page.findMatches({ what: 'text' }).best), ['main', 'side']);
});

test('weights How 3, What 2, When 1: with the rest equal, a card missing When ranks above one missing What, above one missing How', () => {
  const page = cards([['no-how', 'text', 'load', 'slide'], ['no-what', 'card', 'load', 'fade'], ['no-when', 'text', 'scroll', 'fade']]);
  const found = page.findMatches({ what: 'text', when: 'load', how: 'fade' });
  assert.deepEqual([slugs(found.best), slugs(found.close)], [[], ['no-when', 'no-what', 'no-how']]);
});

test('ties go to fewer answers in all, then home order', () => {
  const page = cards([['many', 'text', 'load scroll', 'fade'], ['first', 'text', 'load', 'fade'], ['second', 'text', 'load', 'fade']]);
  assert.deepEqual(slugs(page.findMatches({ what: 'text', when: 'load', how: 'fade' }).best), ['first', 'second', 'many']);
});

test('the finder part of an address and the answers in words', () => {
  const page = finder();
  assert.equal(page.findQuery({ what: 'text', when: 'scroll', how: 'draw' }), '?view=find&what=text&when=scroll&how=draw');
  assert.equal(page.findQuery({ what: 'unsure', when: 'zebra', how: 'draw' }), '?view=find&how=draw');
  assert.equal(page.findQuery({}), '?view=find');
  assert.equal(page.findWords({ what: 'text', when: 'unsure', how: 'draw' }), 'Text or numbers · Not sure · Drew or typed itself');
});

test('the Not here? address opens the form animation_not_here.yml with its title and its answers field filled in', () => {
  const url = new URL(finder().findIssueURL({ what: 'text', when: 'scroll', how: 'draw' }));
  assert.equal(url.origin + url.pathname, 'https://github.com/matinmonshizadeh/animation-handbook/issues/new');
  assert.deepEqual([...url.searchParams.keys()], ['template', 'title', 'answers']);
  assert.equal(url.searchParams.get('template'), 'animation_not_here.yml');
  assert.equal(url.searchParams.get('title'), '[not here] Text or numbers · When I scrolled · Drew or typed itself');
  assert.equal(url.searchParams.get('answers'),
    'Text or numbers · When I scrolled · Drew or typed itself — https://matinmonshizadeh.github.io/animation-handbook/?view=find&what=text&when=scroll&how=draw');
});

// ── The pictures of the How answers ──
// Each How answer moves in a small picture of its own, and reduced motion holds every picture still.

const STYLE = [...HOME.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');

test('every How answer has a moving picture, its keyframes are named fd- and move only transform and opacity, and no keyframes name is used twice', () => {
  const names = [...STYLE.matchAll(/@keyframes\s+([\w-]+)/g)].map(m => m[1]);
  assert.deepEqual(names.filter((name, i) => names.indexOf(name) !== i), [], 'no @keyframes name twice in index.html');
  for (const a of homeConst('FIND_Q')[2].answers) {
    assert.match(STYLE, new RegExp(`\\.${a.pic}[\\s.:{,]`), `a rule draws ${a.pic}`);
    assert.ok(names.some(name => name === a.pic || name.startsWith(a.pic + '-')), `${a.pic} moves: @keyframes ${a.pic}`);
  }
  const bodies = [...STYLE.matchAll(/@keyframes\s+(fd-[\w-]+)\s*\{((?:[^{}]*\{[^{}]*\})*)\s*\}/g)];
  assert.equal(bodies.length, names.filter(name => name.startsWith('fd-')).length, 'every fd- @keyframes body is read');
  for (const [, name, body] of bodies) {
    for (const [, property] of body.matchAll(/([a-z-]+)\s*:/g)) {
      assert.ok(['transform', 'opacity', 'animation-timing-function'].includes(property), `${name} animates ${property}`);
    }
  }
});

test('with reduced motion the How pictures hold still', () => {
  assert.match(STYLE, /@media\(prefers-reduced-motion:reduce\)\{\s*\.fd-pic \*,\.fd-pic \*::before,\.fd-pic \*::after\{animation:none!important\}/);
  const still = (STYLE.match(/@media\(prefers-reduced-motion:reduce\)\{\s*\.fd-pic \*,[\s\S]*?\n\}/) || [''])[0];
  assert.ok(still.includes('.fd-pic::after{content:""'), 'the reduced-motion block draws the small arrow');
});

// ── The finder view, its ways in and Not here? ──
// The finder's markup and address, the Find button and the Finder link, and the Not here? panel with its GitHub form.

test('the finder takes the place of the hero and the tiles: its section, heading, line, questions box and buttons', () => {
  const section = between(HOME, '<section class="wrap finder" id="finder"', '</section>');
  assert.ok(section.startsWith('<section class="wrap finder" id="finder" aria-labelledby="find-title" hidden>'), 'section.finder, hidden until its view opens');
  for (const part of ['<h1 class="h1 fd-h" id="find-title" tabindex="-1">Find an animation you saw</h1>',
    "<p class=\"sub\">Saw an animation on a website and don't know its name? Answer three short questions. The animations that match play below, with their names.</p>",
    '<div class="fd-qs" id="find-qs"></div>',
    '<button type="button" class="fd-btn" id="find-see" hidden>See 0 matches</button>',
    '<button type="button" class="pillbtn" id="find-reset">Start over</button>']) assert.ok(section.includes(part), part);
  const order = ['id="places"', 'id="finder"', 'id="results"'].map(at);
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'the finder comes after the place tiles and before the results');
  assert.ok(HOME.includes("FIND_TITLE='Find an animation you saw — Animation Handbook'"), "the finder's tab title");
});

test('the address keeps the finder and its answers: ?view=find, then what, when and how; an unknown value is Not sure; ?q= still wins', () => {
  const calls = [];
  const page = finder({ URLSearchParams, location: { search: '', pathname: '/animation-handbook/' },
    history: { pushState: (s, t, url) => calls.push(['push', url]), replaceState: (s, t, url) => calls.push(['replace', url]) } });
  for (const name of ['fromURL', 'writeURL']) vm.runInContext(source(name), page);
  const open = search => { page.location.search = search; return plain(page.fromURL().next); };
  const none = { q: '', place: '', view: '', all: false, what: '', when: '', how: '' };
  assert.deepEqual(open('?view=find&what=text&when=scroll&how=draw'), { ...none, view: 'find', what: 'text', when: 'scroll', how: 'draw' });
  assert.deepEqual(open('?view=find&what=zebra&how=fade&all=1'), { ...none, view: 'find', all: true, how: 'fade' });
  assert.deepEqual(open('?q=fade&view=find&what=text'), { ...none, q: 'fade' });
  assert.deepEqual(open('?view=all&what=text'), { ...none, view: 'all' });
  page.location.search = '';
  page.state = { ...none, view: 'find', what: 'text', when: 'unsure', how: 'draw' };
  page.writeURL(true);
  assert.deepEqual(calls.pop(), ['push', '?view=find&what=text&how=draw'], 'entering adds a history step, Not sure stays out');
  page.location.search = '?view=find&what=text&how=draw';
  page.state = { ...none, view: 'find', what: 'text', when: 'scroll', how: 'draw', all: true };
  page.writeURL(false);
  assert.deepEqual(calls.pop(), ['replace', '?view=find&what=text&when=scroll&how=draw&all=1'], 'answers and Show all only replace the address');
});

// ── Every card's answers and the test set ──
// The reviewed answers: every answer given to some card, the rules every page of a kind shares, and the spec's 28 described effects.

test('FIND holds the reviewed answers, not the draft', () => {
  assert.match(HOME, /\/\/ What moved, when and how: the finder's answers for each card, the main one first\.\r?\nconst FIND=\{/);
});

test('every answer of every question is given to at least one card', () => {
  const find = Object.values(homeConst('FIND'));
  homeConst('FIND_Q').forEach((q, i) => {
    for (const a of q.answers) assert.ok(find.some(row => row[i].split(' ').includes(a.key)), `no card answers ${q.key} ${a.key}`);
  });
});

test('the answers keep the rules every page of a kind shares: transitions answer newpage, loops loop, scroll pages scroll', () => {
  const find = homeConst('FIND'), problems = [];
  for (const cat of homeConst('CATS')) {
    for (const [slug] of cat.entries) {
      const kind = (read(path.join(ROOT, cat.folder, slug, 'index.html')).match(/data-hb-kind="(\w+)"/) || [])[1];
      const when = find[slug][1].split(' ');
      if (cat.n === '03' && !when.includes('newpage')) problems.push(`${slug}: a page transition without newpage`);
      if (kind === 'loop' && !when.includes('loop')) problems.push(`${slug}: a loop page without loop`);
      if ((cat.n === '01' || kind === 'scroll') && !when.includes('scroll')) problems.push(`${slug}: a scroll page without scroll`);
    }
  }
  assert.deepEqual(problems, []);
});

// The finder spec's 28 described effects (section 9), frozen before any answers existed: the answers a visitor would pick ('' for
// Not sure) and the animations that count as right. The right lists only grow; a miss is fixed by changing FIND, never a case.
const CASES = [
  [1, 'card', 'scroll', 'pieces', ['Shatter Effect', 'Dissolve Transition']],
  [2, 'background', 'loop', 'color', ['Mesh Gradient Animation', 'Animated Gradient Background']],
  [3, 'text', 'load', 'stagger', ['Letter-by-Letter Stagger', 'Split Text Reveal', 'Word-by-Word Reveal']],
  [4, 'card', 'load', 'grow', ['Scale In / Zoom In']],
  [5, 'card', 'hover', 'grow', ['Hover State Animation']],
  [6, '', 'scroll', 'pin', ['Pin Animation', 'Sticky Section', 'Scrollytelling']],
  [7, 'card', 'scroll', 'grow', ['Zoom Into Image']],
  [8, '', 'scroll', 'layers', ['Parallax Scrolling', 'Parallax Depth-of-Field']],
  [9, 'page', 'click', '', ['Circle Reveal', 'Overlay Wipe', 'Portal / Tunnel Zoom']],
  [10, 'text', 'load', 'reveal', ['Curtain Reveal', 'Text Clip-Path Reveal']],
  [11, 'page', 'scroll', 'slide', ['Smooth (Inertia) Scroll']],
  [12, 'card', 'scroll', 'turn', ['Scroll Image Sequence', 'Scrub Animation', 'Scroll-Driven 3D Rotation']],
  [13, 'text', 'scroll', 'color', ['Text Fill on Scroll']],
  [14, 'card', 'hover', 'follow', ['Spotlight Hover Glow']],
  [15, 'shape', 'loop', 'turn', ['3D Model Orbit']],
  [16, 'button', 'click', 'morph', ['Hamburger Menu Toggle']],
  [17, 'button', 'hover', 'follow', ['Magnetic Button']],
  [18, 'card', 'hover', 'turn', ['Parallax 3D Tilt', 'Holographic Card']],
  [19, 'loader', 'load', 'color', ['Skeleton Loader', 'Shimmer Effect']],
  [20, 'text', 'scroll', '', ['Counter Animation', 'Rolling Numbers']],
  [21, 'page', 'scroll', 'slide', ['Horizontal Scroll']],
  [22, 'menu', 'scroll', 'slide', ['Hide-on-Scroll Header']],
  [23, 'card', 'hover', 'follow', ['Image Trail']],
  [24, 'particles', 'loop', 'drift', ['Particle Constellation', 'Canvas Particle Effect']],
  [25, 'text', 'loop', 'glitch', ['Glitch Text', 'Chromatic Aberration']],
  [26, 'particles', 'loop', 'drift', ['Snow / Rain']],
  [27, 'page', 'newpage', 'slide', ['Overlay Wipe', 'Slide Transition']],
  [28, 'particles', 'click', 'pieces', ['Success Confetti']]
];

test('the test set: a right animation among the first 6 for at least 24 of the 28 described effects, and among the first 12 for at least 27', t => {
  const page = finder(), names = new Set(homeConst('CATS').flatMap(cat => cat.entries.map(e => e[1])));
  let in6 = 0, in12 = 0;
  for (const [n, what, when, how, right] of CASES) {
    for (const name of right) assert.ok(names.has(name), `case ${n}: no card is named ${name}`);
    const found = page.findMatches({ what, when, how }), list = [...found.best, ...found.close].map(e => e.name);
    const position = list.findIndex(name => right.includes(name)) + 1; // 0: not found
    if (position && position <= 6) in6++;
    if (position && position <= 12) in12++;
    t.diagnostic(`case ${n} (${[what, when, how].map(a => a || 'Not sure').join(' · ')}): ${position ? `${list[position - 1]} at ${position}` : 'not found'}` +
      (!position || position > 6 ? `; first six: ${list.slice(0, 6).join(', ')}` : ''));
  }
  assert.ok(in6 >= 24, `${in6} of 28 cases have a right animation among the first 6 (at least 24)`);
  assert.ok(in12 >= 27, `${in12} of 28 cases have a right animation among the first 12 (at least 27)`);
});

// A slug written twice in FIND keeps its first place with the second row's answers, so the value homeConst reads looks right:
// count the rows in the page's text instead.
test('FIND writes one row per card, no slug twice', () => {
  const start = at('const FIND={'), block = HOME.slice(start, blockEnd(HOME.indexOf('{', start)) + 1);
  const rows = Array.from(block.matchAll(/^\s+'([^']+)':\[/gm), m => m[1]), cards = homeConst('CATS').flatMap(cat => cat.entries).length;
  const twice = [...new Set(rows.filter((slug, i) => rows.indexOf(slug) !== i))];
  assert.deepEqual([rows.length, new Set(rows).size], [cards, cards],
    `${rows.length} rows and ${new Set(rows).size} slugs in FIND for ${cards} cards; written twice: ${twice.join(', ') || 'none'}`);
});
