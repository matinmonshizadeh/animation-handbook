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

test("every question and answer key is small letters only, the values the 404 page's way into the finder keeps", () => {
  const questions = homeConst('FIND_Q');
  assert.deepEqual(questions.flatMap(q => [q.key, ...q.answers.map(a => a.key)]).filter(key => !/^[a-z]+$/.test(key)), []);
  assert.ok(read(path.join(ROOT, '404.html')).includes(`/^(${questions.map(q => q.key).join('|')})=[a-z]+$/`), '404.html keeps what, when and how');
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

test('the Not here? title and answers are encoded whole, so an answer with &, #, + or % reaches the form as written', () => {
  const questions = homeConst('FIND_Q');
  questions[0].answers[0].words = 'Fish & chips #1 + 50%';
  const page = finder({ FIND_Q: questions }), answers = { what: questions[0].answers[0].key }, words = 'Fish & chips #1 + 50% · Not sure · Not sure';
  const href = page.findIssueURL(answers);
  assert.ok(href.includes('&title=' + encodeURIComponent('[not here] ' + words) + '&answers='), 'the title as encodeURIComponent writes it');
  const url = new URL(href);
  assert.deepEqual([...url.searchParams.keys()], ['template', 'title', 'answers']);
  assert.equal(url.searchParams.get('title'), '[not here] ' + words);
  assert.equal(url.searchParams.get('answers'), words + ' — https://matinmonshizadeh.github.io/animation-handbook/' + page.findQuery(answers));
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

test("a step that changes only the fragment (How it works, Back to top, the skip link) leaves the finder's answers as they are, Not sure included; a step to another address reads it", () => {
  const calls = [];
  const page = finder({ URLSearchParams, location: { search: '', pathname: '/animation-handbook/' }, q: { value: '' }, q2: { value: '' },
    document: { body: {}, activeElement: {} }, gone: () => false, render: () => calls.push('render'), toTitle: () => calls.push('toTitle'),
    findTitle: { focus: () => calls.push('findTitle') }, addEventListener: (type, fn) => { if (type === 'popstate') page.popstate = fn; } });
  for (const name of ['fromURL', 'readURL']) vm.runInContext(source(name), page);
  const start = at("addEventListener('popstate',");
  vm.runInContext(HOME.slice(start, blockEnd(HOME.indexOf('{', start)) + 1) + ')', page);
  const none = { q: '', place: '', view: '', all: false, what: '', when: '', how: '' };
  page.state = { ...none, view: 'find', what: 'text', when: 'unsure' };
  page.location.search = '?view=find&what=text';
  page.popstate();
  assert.deepEqual(plain(page.state), { ...none, view: 'find', what: 'text', when: 'unsure' }, 'the answers stay, Not sure included');
  assert.deepEqual(calls, [], 'nothing is drawn again and keyboard focus stays');
  page.location.search = '?view=find&what=button';
  page.popstate();
  assert.deepEqual(plain(page.state), { ...none, view: 'find', what: 'button' }, "another address's answers, without Not sure, which no address holds");
  assert.deepEqual(calls, ['render'], 'the view is drawn again');
});

test('the ways into the finder: the Find button under the Popular line, Finder right before Browse all, both left out of the social picture', () => {
  assert.equal(count(HOME, `<a class="find-cta" href="?view=find">Don't know the name? Find it</a>`), 1, 'one Find button');
  assert.match(between(HOME, '<section class="wrap home-hero"', '</section>'),
    /<p class="pop"><span>Popular:<\/span>.*<\/p>\s*<a class="find-cta" href="\?view=find">Don't know the name\? Find it<\/a>\s*$/, 'the Find button ends the hero, right under the Popular line');
  assert.match(between(HOME, '<nav class="nav" aria-label="Site">', '</nav>'),
    /<a class="lnk" id="nav-find" href="\?view=find">Finder<\/a>\s*<a class="lnk" id="nav-all" href="\?view=all">Browse all<\/a>/, 'Finder right before Browse all');
  const css = [...HOME.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');
  assert.ok(css.includes('@media(max-width:869px){.top .nav .lnk[href="#how"]{display:none}}'), 'How it works leaves the bar where the three links no longer fit');
  assert.ok(read(path.join(ROOT, 'tools', 'make-social-image.mjs')).includes('.find-cta, #nav-find { display: none }'), 'the social picture leaves both out');
});

// The fields of a GitHub issue form, in order: each item of its body that has an id, with its type, label and whether it is required.
const formFields = yml => yml.split(/\n  - type: /).slice(1).map(item => ({
  type: item.split(/\r?\n/)[0].trim(),
  id: (item.match(/\n    id: (\S+)/) || [])[1],
  label: ((item.match(/\n      label: (.+)/) || [])[1] || '').trim().replace(/^"(.*)"$/, '$1'),
  required: /\n      required: true/.test(item)
})).filter(field => field.id);
const FORM = path.join(ROOT, '.github', 'ISSUE_TEMPLATE', 'animation_not_here.yml');

test('Not here? sits under the cards with its words, its GitHub link in a new tab and Describe it in words', () => {
  const panel = between(HOME, '<div class="fd-not" id="find-not" hidden>', '</div>');
  assert.ok(panel, 'the Not here? panel, hidden until an answer is picked');
  for (const part of ['<h3 class="fd-not-t">Not here?</h3>',
    '<p class="fd-not-s" id="find-not-s">Tell us what you saw. We use it to add the animation or to fix the finder.</p>',
    '<a class="fd-btn" id="find-gh" href="https://github.com/matinmonshizadeh/animation-handbook/issues/new?template=animation_not_here.yml" target="_blank" rel="noopener">Tell us on GitHub</a>',
    '<button type="button" class="pillbtn" id="find-words">Describe it in words</button>',
    '<p class="fd-fine">The form is on GitHub and needs a free account.</p>']) assert.ok(panel.includes(part), part);
  assert.ok(at('id="find-not"') > at('id="more"') && at('id="find-not"') < at('id="how"'), 'under the cards, before How it works');
});

test('the GitHub form for Not here? has its name, title, label and four fields', () => {
  const form = read(FORM);
  assert.match(form, /^name: "Can't find an animation"\r?$/m);
  assert.match(form, /^description: "You saw an animation on a website, and the finder did not show it\."\r?$/m);
  assert.match(form, /^title: "\[not here\] "\r?$/m);
  assert.match(form, /^labels: \["finder"\]\r?$/m);
  assert.deepEqual(formFields(form).map(f => [f.type, f.id, f.label, f.required]), [
    ['input', 'answers', 'Your answers in the finder', false],
    ['input', 'site', 'Where did you see it? A link, and where on the page', true],
    ['textarea', 'what', 'What happened, in your own words', true],
    ['textarea', 'recording', 'A screen recording or picture: drag it into this box', false]
  ]);
});

test('the Not here? link names animation_not_here.yml and fills only fields the form has', () => {
  const fields = formFields(read(FORM)).map(f => f.id);
  const url = new URL(finder().findIssueURL({ what: 'card', when: 'scroll', how: 'pieces' }));
  assert.equal(url.searchParams.get('template'), path.basename(FORM));
  for (const name of url.searchParams.keys()) assert.ok(['template', 'title'].includes(name) || fields.includes(name), `${name} is a field of the form`);
});

test('the issue chooser offers the finder first', () => {
  const config = read(path.join(ROOT, '.github', 'ISSUE_TEMPLATE', 'config.yml'));
  assert.match(config.split(/\r?\n  - name: /)[1] || '', /^Find an animation by what you saw\r?\n    url: https:\/\/matinmonshizadeh\.github\.io\/animation-handbook\/\?view=find\r?\n/);
});

// ── The finder's view as the page runs it ──
// The page's own code for the results line, See N matches, the groups, Not here?, the ways in, an answer and the "/" key, run with
// vm over stand-ins for the page's elements, its history and its listeners, as the fragment-step test above runs popstate.

// A stand-in for an element: it keeps what the code sets on it (hidden, its words, markup, link, attributes and children), records
// keyboard focus and its listeners, and has client rects only while it is not hidden, as a hidden element has none.
const fakeEl = (more = {}) => ({ hidden: false, textContent: '', innerHTML: '', className: '', href: '', value: '', attrs: {}, children: [], on: {},
  focused: null, setAttribute(name, value) { this.attrs[name] = String(value); }, removeAttribute(name) { delete this.attrs[name]; },
  appendChild(child) { this.children.push(child); }, replaceChildren(...children) { this.children = children; },
  addEventListener(type, fn) { this.on[type] = fn; }, focus(options) { this.focused = plain(options || {}); },
  getClientRects() { return this.hidden ? [] : [{}]; }, ...more });
// A statement of the page's script, from `from` up to the semicolon that ends its line, and a listener the page adds.
const statement = from => { const start = at(from); return HOME.slice(start, start + HOME.slice(start).search(/;[ \t]*(\/\/[^\n]*)?\r?\n/) + 1); };
const listener = from => { const start = at(from); return HOME.slice(start, blockEnd(HOME.indexOf('{', start)) + 1) + ')'; };
const SLUGS = homeConst('CATS').flatMap(cat => cat.entries.map(e => e[0]));
// Matches made of the first cards in home order: `best` of them, then `close` more.
const someMatches = (best, close) => ({ best: SLUGS.slice(0, best).map(slug => ({ slug })), close: SLUGS.slice(best, best + close).map(slug => ({ slug })) });
const NONE = { q: '', place: '', view: '', all: false, what: '', when: '', how: '' };
function finderView() {
  const els = {}, calls = [], listeners = {};
  const $ = id => els[id] ??= fakeEl(id === 'places' ? { closest: () => els.placesSection ??= fakeEl() } : {});
  // The radios the page builds from FIND_Q, Not sure last in each question, found by their name as the finder finds them.
  const radios = homeConst('FIND_Q').flatMap(q => [...q.answers.map(a => a.key), 'unsure'].map(value =>
    fakeEl({ name: 'fd-' + q.key, value, checked: false, classList: { contains: name => name === 'fd-r' } })));
  els.finder = fakeEl({ querySelectorAll: selector => radios.filter(r => selector === `.fd-r[name="${r.name}"]`) });
  const CARD = Object.fromEntries(SLUGS.map(slug => { const title = fakeEl(); return [slug, fakeEl({ slug, title, querySelector: s => (s === '.title' ? title : null) })]; }));
  const page = finder({ URLSearchParams, location: { search: '', pathname: '/animation-handbook/' }, $, CARD, cardsBox: $('cards'), q: $('q'), q2: $('q2'), reduce: false,
    history: { pushState: (s, t, url) => calls.push(['push', url]), replaceState: (s, t, url) => calls.push(['replace', url]) },
    document: { title: 'Animation Handbook', activeElement: null, createElement: tag => fakeEl({ tag }), querySelector: s => (s === '.home-hero' ? (els.hero ??= fakeEl()) : null) },
    render: answered => calls.push(['render', answered]), place: cards => calls.push(['place', cards.length]), scrollTo: to => calls.push(['scrollTo', to.top]),
    addEventListener: (type, fn) => { listeners[type] = fn; } });
  for (const from of ['const FIND_PAGE=', 'const gone=', 'const answeredAny=', 'const finderEl=', 'const HOME_TITLE=', 'const findNot=']) vm.runInContext(statement(from), page);
  for (const name of ['findLine', 'showFinder', 'showFound', 'showNotHere', 'enterFind', 'go', 'writeURL']) vm.runInContext(source(name), page);
  for (const from of ["finderEl.addEventListener('change',", "addEventListener('keydown',"]) vm.runInContext(listener(from), page);
  return { page, els, calls, listeners, radios };
}

test("the finder's results line, See N matches, the Best and Close groups and Not here? say what the contract says", () => {
  assert.match(statement('const finderEl='), /navFind=\$\('nav-find'\)/, "the Finder link is found with the finder's other elements, before the code that reads it");
  const { page, els, radios } = finderView();
  const ASK = 'Answer a question above, and the animations that match show here.';
  const line = (answers, best, close) => { page.state = { ...NONE, view: 'find', ...answers }; return page.findLine(someMatches(best, close)); };
  assert.equal(line({}, 0, 0), ASK, 'no answer');
  assert.equal(line({ what: 'unsure', when: 'unsure', how: 'unsure' }, 0, 0), ASK, 'only Not sure');
  assert.equal(line({ what: 'text', how: 'fade' }, 5, 9), '5 best matches and 9 close matches.');
  assert.equal(line({ what: 'text', how: 'fade' }, 1, 1), '1 best match and 1 close match.');
  assert.equal(line({ what: 'text' }, 5, 0), '5 best matches.');
  assert.equal(line({ what: 'text' }, 1, 0), '1 best match.');
  assert.equal(line({ what: 'text', how: 'fade' }, 0, 9), 'No animation fits all your answers. These come close.');
  assert.equal(line({ what: 'text', how: 'fade' }, 0, 0), 'No animation fits these answers yet.');

  // The finder in place of the hero and the tiles, its answers chosen as the state says; See N matches, hidden while nothing matches.
  page.state = { ...NONE, view: 'find', what: 'text', when: 'unsure' };
  const see = () => [els['find-see'].hidden, els['find-see'].textContent];
  page.showFinder(true, someMatches(1, 0));
  assert.deepEqual(see(), [false, 'See 1 match']);
  page.showFinder(true, someMatches(5, 9));
  assert.deepEqual(see(), [false, 'See 14 matches']);
  assert.deepEqual([els.hero.hidden, els.placesSection.hidden, els.finder.hidden, page.document.title, els['nav-find'].attrs['aria-current']],
    [true, true, false, 'Find an animation you saw — Animation Handbook', 'page']);
  assert.deepEqual(radios.filter(r => r.checked).map(r => r.name + '=' + r.value), ['fd-what=text', 'fd-when=unsure']);
  page.showFinder(true, someMatches(0, 0));
  assert.equal(els['find-see'].hidden, true, 'See N matches is hidden while nothing matches');
  page.showFinder(false, null);
  assert.deepEqual([els.hero.hidden, els.placesSection.hidden, els.finder.hidden, page.document.title, 'aria-current' in els['nav-find'].attrs],
    [false, false, true, 'Animation Handbook', false]);

  // Best matches, then Close matches with its line; the first twelve cards until Show all, their titles a level below the headings.
  page.state = { ...NONE, view: 'find', what: 'text', how: 'fade' };
  const groups = () => els.cards.children.map(box => [box.className, box.innerHTML, box.children[0].children.length]);
  page.showFound(someMatches(5, 9));
  assert.deepEqual(groups(), [
    ['group fd-group', '<h3 class="ghead"><span class="gname">Best matches</span><span class="gcount">5 animations</span></h3>', 5],
    ['group fd-group', '<h3 class="ghead"><span class="gname">Close matches</span><span class="gcount">9 animations</span></h3><p class="fd-gline">They fit all but one of your answers.</p>', 7]]);
  assert.ok(els.cards.children.every(box => box.children[0].children.every(card => card.title.attrs['aria-level'] === '4')), 'card titles at level 4');
  page.state.all = true;
  page.showFound(someMatches(5, 9));
  assert.deepEqual(groups().map(g => g[2]), [5, 9], 'Show all shows every card');
  page.showFound(someMatches(1, 1));
  assert.deepEqual(groups().map(g => g[1].match(/"gcount">([^<]*)</)[1]), ['1 animation', '1 animation']);
  page.showFound(someMatches(0, 3));
  assert.deepEqual(groups().map(g => g[1].match(/"gname">([^<]*)</)[1]), ['Close matches'], 'no Best group when no card fits every answer');

  // Not here? shows once a question has a real answer, with its own sentence when nothing fits, and links to the form.
  const notHere = (answers, best, close) => {
    page.state = { ...NONE, view: 'find', ...answers };
    page.showNotHere(true, someMatches(best, close));
    return els['find-not'].hidden ? 'hidden' : els['find-not-s'].textContent;
  };
  assert.equal(notHere({}, 0, 0), 'hidden', 'no answer');
  assert.equal(notHere({ what: 'unsure', how: 'unsure' }, 0, 0), 'hidden', 'only Not sure');
  assert.equal(notHere({ what: 'text', when: 'scroll' }, 3, 2), 'Tell us what you saw. We use it to add the animation or to fix the finder.');
  assert.equal(els['find-gh'].href, page.findIssueURL({ what: 'text', when: 'scroll' }));
  assert.equal(notHere({ what: 'text', when: 'scroll', how: 'pin' }, 0, 0), 'Nothing fits these answers yet. Try Not sure on one question, or tell us what you saw.');
  page.showNotHere(false, null);
  assert.equal(els['find-not'].hidden, true, 'hidden outside the finder');
});

test('the Find button and the Finder link open the finder with one history step, at the top, with keyboard focus on its heading', () => {
  assert.ok(HOME.includes("document.querySelectorAll('.find-cta,#nav-find').forEach(a=>a.addEventListener('click',enterFind));"), 'both ways in');
  const { page, els, calls } = finderView();
  const click = (more = {}) => ({ button: 0, ctrlKey: false, metaKey: false, shiftKey: false, altKey: false, prevented: false, preventDefault() { this.prevented = true; }, ...more });
  page.state = { ...NONE };
  const e = click();
  page.enterFind(e);
  assert.ok(e.prevented, 'the page opens the finder itself');
  assert.deepEqual(calls, [['render', undefined], ['push', '?view=find'], ['scrollTo', 0]]);
  assert.deepEqual([page.state.view, els['find-title'].focused], ['find', { preventScroll: true }]);
  // Already in the finder: no second step and the answers stay; the page goes to the top and the heading takes keyboard focus.
  calls.length = 0;
  els['find-title'].focused = null;
  page.location.search = '?view=find&what=text';
  page.state = { ...NONE, view: 'find', what: 'text' };
  page.enterFind(click());
  assert.deepEqual([calls, page.state.what, els['find-title'].focused], [[['scrollTo', 0]], 'text', { preventScroll: true }]);
  // A click with Ctrl, Cmd, Shift or Alt, or with another button, is left to the browser (a new tab or window).
  calls.length = 0;
  page.state = { ...NONE };
  for (const more of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }]) {
    const other = click(more);
    page.enterFind(other);
    assert.equal(other.prevented, false, JSON.stringify(more));
  }
  assert.deepEqual(calls, []);
});

test('an answer drops Show all and only replaces the address, and in the finder the "/" key is left to the browser', () => {
  const { page, els, calls, listeners, radios } = finderView();
  page.state = { ...NONE, view: 'find', what: 'background', all: true };
  page.location.search = '?view=find&what=background&all=1';
  els.finder.on.change({ target: radios.find(r => r.name === 'fd-how' && r.value === 'fade') });
  assert.deepEqual(plain(page.state), { ...NONE, view: 'find', what: 'background', how: 'fade' });
  assert.deepEqual(calls, [['render', true], ['replace', '?view=find&what=background&how=fade']]);
  // "/" goes to the search box, unless the box is hidden, as it is with the hero in the finder: then nothing happens and the key
  // stays the browser's (its own quick find).
  const press = () => ({ key: '/', prevented: false, preventDefault() { this.prevented = true; } });
  els.q.hidden = true;
  let e = press();
  listeners.keydown(e);
  assert.deepEqual([e.prevented, els.q.focused], [false, null], 'in the finder');
  els.q.hidden = false;
  e = press();
  listeners.keydown(e);
  assert.deepEqual([e.prevented, els.q.focused], [true, {}], 'elsewhere');
});

test('an address that opens the finder shows only the top bar from the first paint until the script has drawn the view, and the page once it is read even if the script failed', () => {
  const head = between(HOME, '(function(){var p=new URLSearchParams(location.search);', '</script>');
  assert.ok(head && at(head) < at('</head>'), 'the line runs in the head');
  const page = finder({ URLSearchParams, location: { search: '' } });
  vm.runInContext(source('fromURL'), page);
  for (const search of ['?view=find', '?view=find&what=text&how=fade', '?q=%20&view=find', '?q=fade&view=find', '?place=buttons&view=find', '?view=all', '?what=text', '']) {
    const added = [], removed = [], read = [];
    vm.runInNewContext(head, { URLSearchParams, location: { search }, addEventListener: (type, fn) => { if (type === 'DOMContentLoaded') read.push(fn); },
      document: { documentElement: { classList: { add: name => added.push(name), remove: name => removed.push(name) } } } });
    page.location.search = search;
    const where = search || 'the start page';
    assert.deepEqual(added, page.fromURL().next.view === 'find' ? ['fd-direct'] : [], `${where}: as the page reads the address`);
    read.forEach(fn => fn());
    assert.deepEqual(removed, added, `${where}: the class goes once the page is read, so a script that failed still leaves the page to see`);
  }
  const main = between(HOME, '<main>', '</main>');
  for (const part of ['<section class="wrap home-hero"', '<section class="wrap" aria-labelledby="places-title">', '<section class="wrap finder" id="finder"',
    '<section class="wrap results" id="results"', '<section class="how" id="how"']) assert.ok(main.includes(part), `${part}… sits in <main>`);
  assert.ok(STYLE.includes('.fd-direct main,.fd-direct .foot{visibility:hidden}'), 'the class hides everything under the top bar and keeps its room');
  assert.match(HOME, /\nconst startCat=readURL\(\);\r?\nrender\(\);\r?\ndocument\.documentElement\.classList\.remove\('fd-direct'\);/, 'the first render takes the class away');
});

test("the page check's patterns for See N matches and the results line take each number only with its own word, as the page writes it", () => {
  const check = read(path.join(ROOT, 'tools', 'check-pages.mjs'));
  const pattern = name => {
    const m = check.match(new RegExp(`const ${name} = (/.+/);\\r?\\n`));
    assert.ok(m, `${name} in tools/check-pages.mjs`);
    return vm.runInNewContext(m[1]);
  };
  const see = pattern('FIND_SEE'), results = pattern('FIND_LINE'), { page, els } = finderView();
  page.state = { ...NONE, view: 'find', what: 'text', how: 'fade' };
  for (const [best, close] of [[1, 0], [1, 1], [5, 0], [5, 9], [11, 1], [21, 0], [0, 1], [0, 21]]) {
    page.showFinder(true, someMatches(best, close));
    const said = page.findLine(someMatches(best, close));
    assert.ok(see.test(els['find-see'].textContent), els['find-see'].textContent);
    assert.ok(results.test(said), said);
  }
  for (const wrong of ['See 1 matches', 'See 2 match', 'See 21 match']) assert.ok(!see.test(wrong), wrong);
  for (const wrong of ['1 best matches.', '2 best match.', '5 best matches and 1 close matches.', '1 best match and 2 close match.']) assert.ok(!results.test(wrong), wrong);
});

test('the phone bar never shows in the finder, even while its own search box has keyboard focus', () => {
  const q2 = {}, bar = { on: null }, page = vm.createContext({ q2, resultsEl: { classList: { toggle: (name, on) => { bar.on = on; } } }, document: { activeElement: q2 } });
  for (const from of ['const isFiltered=', 'const syncBar=']) vm.runInContext(statement(from), page);
  for (const [view, focused, want] of [['find', q2, false], ['find', null, false], ['all', null, true], ['', q2, true], ['', null, false]]) {
    page.state = { ...NONE, view };
    page.document.activeElement = focused;
    vm.runInContext('syncBar()', page);
    assert.equal(bar.on, want, `${view || 'the start'}, ${focused ? 'its box focused' : 'its box not focused'}`);
  }
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
