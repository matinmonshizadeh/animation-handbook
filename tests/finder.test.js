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
  for (const [, name, body] of STYLE.matchAll(/@keyframes\s+(fd-[\w-]+)\s*\{((?:[^{}]*\{[^{}]*\})*)\s*\}/g)) {
    for (const [, property] of body.matchAll(/([a-z-]+)\s*:/g)) {
      assert.ok(['transform', 'opacity', 'animation-timing-function'].includes(property), `${name} animates ${property}`);
    }
  }
});

test('with reduced motion the How pictures hold still', () => {
  assert.match(STYLE, /@media\(prefers-reduced-motion:reduce\)\{\s*\.fd-pic \*,\.fd-pic \*::before,\.fd-pic \*::after\{animation:none!important\}/);
});

// ── The finder view, its ways in and Not here? ──
// The finder's markup and address, the Find button and the Finder link, and the Not here? panel with its GitHub form.

// ── Every card's answers and the test set ──
// The reviewed answers: every answer given to some card, the rules every page of a kind shares, and the spec's 28 described effects.
