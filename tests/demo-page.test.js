// Unit tests for the pure helpers in assets/js/demo-page.js, and for boot() run against a stand-in page.
// Run from the repo root: node --test "tests/*.test.js"
const test = require('node:test');
const assert = require('node:assert/strict');
const DP = require('../assets/js/demo-page.js');

test('escapeHtml escapes markup characters', () => {
  assert.equal(DP.escapeHtml('<a href="x">&</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;');
});

test('plain drops code and bold markers and escapes', () => {
  assert.equal(DP.plain('`ease-out` **fast** <b>'), 'ease-out fast &lt;b&gt;');
});

test('isSafeHref allows relative, anchor and http(s) links only', () => {
  for (const ok of ['../scale-in/', 'README.md', '#top', '/animation-handbook/', 'https://example.com/p', 'http://example.com']) {
    assert.equal(DP.isSafeHref(ok), true, ok);
  }
  for (const bad of ['javascript:alert(1)', 'data:text/html,x', '//evil.example/x', 'mailto:a@b.c']) {
    assert.equal(DP.isSafeHref(bad), false, bad);
  }
});

test('indexHref points a relative link to a folder at its index.html, keeping its query and hash, and leaves other links alone', () => {
  const folders = {
    '../bounce-in/': '../bounce-in/index.html',
    '../../../': '../../../index.html',
    './': './index.html',
    'animations/02-entrance-and-exit/bounce-in/': 'animations/02-entrance-and-exit/bounce-in/index.html',
    '../bounce-in/?from=home': '../bounce-in/index.html?from=home',
    '../bounce-in/#hb-prompt-title': '../bounce-in/index.html#hb-prompt-title',
    '../../../?place=buttons#top': '../../../index.html?place=buttons#top'
  };
  for (const [href, page] of Object.entries(folders)) assert.equal(DP.indexHref(href), page, href);
  // Files, fragments, queries and links to other places stay as they are; so does a link that already names its page.
  for (const href of ['README.md', '../bounce-in/index.html', '#top', '#', '', '?q=fade', '../bounce-in#a/', '../bounce-in?next=/',
    'https://github.com/matinmonshizadeh/animation-handbook', 'https://example.com/a/', 'http://example.com/', '//example.com/a/',
    '/animation-handbook/', 'mailto:a@b.c', 'file:///C:/animation-handbook/']) {
    assert.equal(DP.indexHref(href), href, href);
  }
});

test('inline shows code as plain text and renders links, bold and italics', () => {
  assert.equal(DP.inline('Use `opacity` on **one** *hero* [card](../scale-in/)'),
    'Use opacity on <strong>one</strong> <em>hero</em> <a href="../scale-in/">card</a>');
  assert.equal(DP.inline('a < b'), 'a &lt; b');
});

test('inline links only safe targets and keeps parentheses around links', () => {
  assert.ok(!DP.inline('[x](javascript:alert(1))').includes('<a'), 'no link for javascript: URLs');
  assert.ok(!DP.inline('[x](//evil.example/)').includes('<a'), 'no link for protocol-relative URLs');
  assert.equal(DP.inline('[a](https://example.com/p)'), '<a href="https://example.com/p">a</a>');
  assert.equal(DP.inline('(see [Scale In](../scale-in/))'), '(see <a href="../scale-in/">Scale In</a>)');
});

test('sections splits a README by its ## headings', () => {
  const md = '# Title\r\n\r\n## What it is\r\nLine one\r\nline two\r\n\r\n## When to use it\r\n- A\r\n- B\r\n';
  assert.deepEqual(DP.sections(md), { 'What it is': 'Line one\nline two', 'When to use it': '- A\n- B' });
});

test('sections keeps ### lines inside the section they belong to', () => {
  assert.deepEqual(DP.sections('## A\n### not a section\nx'), { A: '### not a section\nx' });
});

test('paragraphs joins wrapped lines and splits on blank lines', () => {
  assert.equal(DP.paragraphs('One\ntwo.\n\nThree `x`.'), '<p>One two.</p><p>Three x.</p>');
  assert.equal(DP.paragraphs(undefined), '');
});

test('seeAlso reads name, link and description', () => {
  const md = '- [Scale In](../scale-in/) — grows from small, with no spin\n- [Blur In](../blur-in/)\nText';
  assert.deepEqual(DP.seeAlso(md), [
    { name: 'Scale In', href: '../scale-in/', desc: 'grows from small, with no spin' },
    { name: 'Blur In', href: '../blur-in/', desc: '' }
  ]);
});

test('settingsLine writes "label: value" pairs and skips incomplete ones', () => {
  assert.equal(DP.settingsLine([
    { label: 'Speed', value: 'Normal' }, { label: 'Fades in', value: 'on' },
    { label: 'Mode', value: '' }, { label: '', value: 'x' }
  ]), 'Speed: Normal, Fades in: on');
  assert.equal(DP.settingsLine([]), '');
  assert.equal(DP.settingsLine(undefined), '');
});

test('markFill highlights the parts in square brackets and escapes the rest', () => {
  assert.equal(DP.markFill('Add it to [the icon you want] & <go>.'),
    'Add it to <mark class="hb-fill">[the icon you want]</mark> &amp; &lt;go&gt;.');
  assert.equal(DP.markFill('No brackets here.'), 'No brackets here.');
});

test('the module exports boot and readSettings without touching a DOM', () => {
  assert.equal(typeof DP.boot, 'function');
  assert.equal(typeof DP.readSettings, 'function');
});

test('shorten squeezes whitespace and cuts long text with an ellipsis', () => {
  assert.equal(DP.shorten('  Hello \n  world ', 40), 'Hello world');
  assert.equal(DP.shorten('abcdefghij', 5), 'abcd…');
  assert.equal(DP.shorten('abc de', 5), 'abc…');
  assert.equal(DP.shorten('', 5), '');
});

test('quoteText wraps typed text in quotes and keeps the 40-character cut inside them', () => {
  assert.equal(DP.quoteText('Hello, world.', 40), '"Hello, world."');
  assert.equal(DP.quoteText('We build interfaces\nthat disappear.', 40), '"We build interfaces that disappear."');
  const long = DP.quoteText('a'.repeat(50), 40);
  assert.equal(long, '"' + 'a'.repeat(39) + '…"');
  assert.equal(long.length, 42);
  assert.equal(DP.quoteText(' \n ', 40), '');
});

test('motionNote says what reduced motion changes in the player bar', () => {
  assert.equal(DP.motionNote({ loop: true, slow: true }), 'Loop and Slow motion are off because your device is set to reduce motion.');
  assert.equal(DP.motionNote({ loop: true }), 'Loop is off because your device is set to reduce motion.');
  assert.equal(DP.motionNote({ slow: true }), 'Slow motion is off because your device is set to reduce motion.');
  assert.equal(DP.motionNote({ pause: true, slow: true }), 'It starts paused and Slow motion is off because your device is set to reduce motion.');
  assert.equal(DP.motionNote({ pause: true }), 'It starts paused because your device is set to reduce motion.');
  assert.equal(DP.motionNote({ scroll: true }), 'The effects follow the scroll without animating because your device is set to reduce motion.');
  assert.equal(DP.motionNote({ scroll: 'The layers stay still while the box scrolls' }), 'The layers stay still while the box scrolls because your device is set to reduce motion.');
  assert.equal(DP.motionNote({}), '');
});

// boot() takes the document and window it works on, so a stand-in page with just enough DOM can stand for a real one. It holds
// a stage and, by kind, the buttons boot() looks for. Events are sent to the stage by hand (with isTrusted set as a browser
// would), timers wait in a list until the test runs them, and every hb:input the script sends is kept. A Copy prompt test passes
// `copy` ({ prompt, controls, clipboard }) to add a Copy prompt button, text in the prompt, a Try it step holding `controls` (if
// any) and the window's clipboard; no other test gets any of them. A link test passes `links` ({ protocol, hrefs }): the page is
// served over that protocol (http: otherwise) and holds one link for each href.
// `extra` ({ modes, noPrompt }): modes adds the mode switch (Normal, See inside, Compare) and one note for See inside and one
// for Compare; noPrompt leaves the prompt out, as on an idea lesson.
function standInPage(kind, reduced, bodyAttributes, copy, links, extra) {
  const opts = extra || {};
  const timers = [], sent = [];
  const node = () => ({
    attrs: {}, handlers: {}, children: [], clicks: 0, textContent: '', innerHTML: '', classList: { add() {}, remove() {}, toggle() {} },
    addEventListener(type, fn) { (this.handlers[type] = this.handlers[type] || []).push(fn); },
    emit(type, event) { (this.handlers[type] || []).forEach(fn => fn(event)); },
    setAttribute(name, value) { this.attrs[name] = String(value); },
    getAttribute(name) { return name in this.attrs ? this.attrs[name] : null; },
    hasAttribute(name) { return name in this.attrs; },
    removeAttribute(name) { delete this.attrs[name]; },
    appendChild(child) { this.children.push(child); return child; },
    insertAdjacentElement() {}, contains(other) { return other === this; }, click() { this.clicks++; }
  });
  const stage = node(), player = node(), prompt = node(), demo = node(), play = node(), top = node();
  const modeButtons = opts.modes ? ['normal', 'inside', 'compare'].map(mode => {
    const b = node();
    b.setAttribute('data-hb-mode', mode);
    b.setAttribute('aria-pressed', String(mode === 'normal'));
    return b;
  }) : [];
  const notes = opts.modes ? ['inside', 'compare'].map(mode => {
    const p = node();
    p.setAttribute('data-hb-for', mode);
    p.hidden = true;
    return p;
  }) : [];
  const modes = opts.modes && Object.assign(node(), { querySelectorAll: selector => (selector === '[data-hb-mode]' ? modeButtons : []) });
  // The button has no .hb-copy-label inside it, so its own text is the label.
  const button = copy && Object.assign(node(), { querySelector: () => null });
  if (copy) prompt.textContent = copy.prompt;
  const wanted = { '.hb-prompt': !opts.noPrompt && prompt, '.stage': stage, '.hb-player': player, '[data-hb-demo]': kind === 'do' && demo,
    '[data-hb-autoscroll]': kind === 'scroll' && play, '[data-hb-top]': kind === 'scroll' && top, '.hb-copy': button,
    '.hb-try': copy && copy.controls && Object.assign(node(), { querySelectorAll: () => copy.controls }),
    '[data-hb-modes]': modes };
  const page = { querySelector: selector => wanted[selector] || null,
    querySelectorAll: selector => (selector === '[data-hb-for]' ? notes : []) };
  const body = node();
  body.setAttribute('data-hb-kind', kind);
  body.setAttribute('data-hb-autoplay', '');
  Object.keys(bodyAttributes || {}).forEach(name => body.setAttribute(name, bodyAttributes[name]));
  const anchors = ((links && links.hrefs) || []).map(href => { const a = node(); a.setAttribute('href', href); return a; });
  const doc = { body, querySelector: selector => (selector === '.hb-page' ? page : null), createElement: node, dispatchEvent: event => sent.push(event),
    querySelectorAll: selector => (selector === 'a[href]' ? anchors : []) };
  const win = {
    document: doc, // the page's own document, as in a browser
    matchMedia: () => ({ matches: !!reduced, addEventListener() {} }),
    setTimeout: (fn, ms) => timers.push({ fn, ms }),
    clearTimeout() {}, location: { protocol: (links && links.protocol) || 'http:' }, console,
    CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init && init.detail; } }
  };
  if (copy) Object.assign(win, { navigator: { clipboard: copy.clipboard }, getComputedStyle: () => ({ display: '' }) });
  DP.boot(doc, win);
  return { doc, win, stage, player, demo, play, button, anchors, sent, modeButtons, notes,
    runTimers: () => timers.forEach(t => t.fn()), timerDelays: () => timers.map(t => t.ms) };
}
const visitor = { isTrusted: true }, script = { isTrusted: false };

test('a do-it page presses Show me about 400 ms after load when nobody has acted', () => {
  const page = standInPage('do', false);
  assert.ok(page.timerDelays().includes(400));
  page.runTimers();
  assert.equal(page.demo.clicks, 1);
});

test('the Show me press on arrival is skipped after the visitor pressed, keyed, scrolled or touched the stage', () => {
  for (const type of ['pointerdown', 'keydown', 'wheel', 'touchstart', 'click']) {
    const page = standInPage('do', false);
    page.stage.emit(type, visitor);
    page.runTimers();
    assert.equal(page.demo.clicks, 0, type);
    assert.deepEqual(page.sent.map(e => e.type), ['hb:input'], type);
  }
});

test('the Show me press on arrival is skipped after focus arrives in the stage, and focus sends no hb:input', () => {
  const page = standInPage('do', false);
  page.stage.emit('focusin', visitor);
  page.runTimers();
  assert.equal(page.demo.clicks, 0);
  assert.equal(page.sent.length, 0);
});

// Only dispatched events can be tried here: a real focus() call makes a trusted focusin, which does count.
test('events dispatched by script (isTrusted false) do not count as the visitor acting', () => {
  const page = standInPage('do', false);
  for (const type of ['pointerdown', 'keydown', 'wheel', 'touchstart', 'click', 'focusin']) page.stage.emit(type, script);
  page.runTimers();
  assert.equal(page.demo.clicks, 1);
  assert.equal(page.sent.length, 0);
});

test('the Show me press on arrival is skipped after the visitor pressed Show me themselves, which sits outside the stage', () => {
  const page = standInPage('do', false);
  page.demo.emit('click', visitor);
  page.runTimers();
  assert.equal(page.demo.clicks, 0);
  assert.equal(page.sent.length, 0);
  const other = standInPage('do', false);
  other.demo.emit('click', script);
  other.runTimers();
  assert.equal(other.demo.clicks, 1);
});

test('the Show me press on arrival is skipped when focus is already in the stage, as when the visitor got there before the script ran', () => {
  const page = standInPage('do', false);
  page.doc.activeElement = page.stage;
  page.runTimers();
  assert.equal(page.demo.clicks, 0);
  const elsewhere = standInPage('do', false);
  elsewhere.doc.activeElement = elsewhere.doc.body;
  elsewhere.runTimers();
  assert.equal(elsewhere.demo.clicks, 1);
});

test('a do-it page presses nothing on arrival under reduced motion', () => {
  const page = standInPage('do', true);
  page.runTimers();
  assert.equal(page.demo.clicks, 0);
});

test('a scroll page says under reduced motion that the effects follow the scroll without animating', () => {
  const page = standInPage('scroll', true);
  assert.deepEqual(page.player.children.map(c => [c.className, c.textContent]),
    [['hb-player-note', 'The effects follow the scroll without animating because your device is set to reduce motion.']]);
});

test('reduced motion adds no note to a scroll page that is not set to reduce motion, or to a do-it page with nothing to switch off', () => {
  assert.equal(standInPage('scroll', false).player.children.length, 0);
  assert.equal(standInPage('do', true).player.children.length, 0);
});

test('a scroll page can say in its own words what reduced motion does there', () => {
  const page = standInPage('scroll', true, { 'data-hb-motion-note': 'The layers stay still while the box scrolls' });
  assert.deepEqual(page.player.children.map(c => [c.className, c.textContent]),
    [['hb-player-note', 'The layers stay still while the box scrolls because your device is set to reduce motion.']]);
});

test('a scroll page with an empty sentence of its own gets the usual note, and only a scroll page reads the sentence', () => {
  const usual = 'The effects follow the scroll without animating because your device is set to reduce motion.';
  assert.deepEqual(standInPage('scroll', true, { 'data-hb-motion-note': '' }).player.children.map(c => c.textContent), [usual]);
  assert.equal(standInPage('do', true, { 'data-hb-motion-note': 'The layers stay still while the box scrolls' }).player.children.length, 0);
  assert.equal(standInPage('scroll', false, { 'data-hb-motion-note': 'The layers stay still while the box scrolls' }).player.children.length, 0);
});

test('a page with no prompt, such as an idea lesson, still gets its player: a scroll page scrolls on arrival and notes reduced motion', () => {
  const page = standInPage('scroll', false, {}, null, null, { noPrompt: true });
  page.runTimers();
  assert.equal(page.play.clicks, 1);
  const reduced = standInPage('scroll', true, {}, null, null, { noPrompt: true });
  assert.deepEqual(reduced.player.children.map(c => c.className), ['hb-player-note']);
});

test("the mode switch presses one mode at a time, marks the stage, shows only that mode's note and tells the page", () => {
  const page = standInPage('scroll', false, {}, null, null, { modes: true });
  assert.equal(page.stage.getAttribute('data-hb-mode'), 'normal');
  const [normal, inside, compare] = page.modeButtons;
  const pressed = () => page.modeButtons.map(b => b.getAttribute('aria-pressed'));
  const shown = () => page.notes.map(n => !n.hidden);
  const told = () => page.sent.filter(e => e.type === 'hb:mode').map(e => e.detail.mode);
  assert.deepEqual(told(), [], 'nothing is sent at boot');
  inside.emit('click', visitor);
  assert.deepEqual(pressed(), ['false', 'true', 'false']);
  assert.equal(page.stage.getAttribute('data-hb-mode'), 'inside');
  assert.deepEqual(shown(), [true, false]);
  compare.emit('click', visitor);
  assert.deepEqual(pressed(), ['false', 'false', 'true']);
  assert.deepEqual(shown(), [false, true]);
  normal.emit('click', visitor);
  assert.deepEqual(pressed(), ['true', 'false', 'false']);
  assert.deepEqual(shown(), [false, false]);
  assert.equal(page.stage.getAttribute('data-hb-mode'), 'normal');
  assert.deepEqual(told(), ['inside', 'compare', 'normal']);
});

test('a page without the mode switch gets no data-hb-mode and sends no hb:mode', () => {
  const page = standInPage('scroll', false);
  page.runTimers();
  assert.equal(page.stage.getAttribute('data-hb-mode'), null);
  assert.equal(page.sent.filter(e => e.type === 'hb:mode').length, 0);
});

// The stand-in's class lists do nothing, so this test gives the three mode buttons lists that remember what was toggled.
test('the mode switch gives the class on to the pressed mode only', () => {
  const page = standInPage('scroll', false, {}, null, null, { modes: true });
  const classes = page.modeButtons.map(b => {
    const set = new Set();
    b.classList = { toggle: (name, force) => (force ? set.add(name) : set.delete(name)) };
    return set;
  });
  const [normal, inside, compare] = page.modeButtons;
  const marked = () => classes.map(set => set.has('on'));
  inside.emit('click', visitor);
  assert.deepEqual(marked(), [false, true, false]);
  compare.emit('click', visitor);
  assert.deepEqual(marked(), [false, false, true]);
  normal.emit('click', visitor);
  assert.deepEqual(marked(), [true, false, false]);
});

// The home page loads the shared script too and has no .hb-page: boot() returns before it touches anything else.
test('a document with no .hb-page, such as the home page, is skipped without touching anything else', () => {
  const doc = { querySelector: () => null };
  assert.doesNotThrow(() => DP.boot(doc, { document: doc }));
});

// Opened from disk, Chrome shows a folder's listing for a link to the folder, so the links of the page must name index.html there.
test('opened from disk, every link of the page to a folder opens its index.html; over http(s) no link changes', () => {
  const hrefs = ['../../../', '../bounce-in/', '../scale-in/', '../blur-in/?from=home#hb-prompt-title', 'README.md', '#top',
    'https://github.com/matinmonshizadeh/animation-handbook'];
  const fromDisk = ['../../../index.html', '../bounce-in/index.html', '../scale-in/index.html', '../blur-in/index.html?from=home#hb-prompt-title',
    'README.md', '#top', 'https://github.com/matinmonshizadeh/animation-handbook'];
  for (const kind of ['once', 'loop', 'do', 'scroll']) {
    const page = standInPage(kind, false, {}, null, { protocol: 'file:', hrefs });
    assert.deepEqual(page.anchors.map(a => a.getAttribute('href')), fromDisk, `${kind} page opened from disk`);
  }
  for (const protocol of ['http:', 'https:']) {
    const page = standInPage('once', false, {}, null, { protocol, hrefs });
    assert.deepEqual(page.anchors.map(a => a.getAttribute('href')), hrefs, protocol);
  }
});

test('promptWithSettings adds the settings line only when a setting is complete', () => {
  assert.equal(DP.promptWithSettings('Add it.', [{ label: 'Speed', value: 'Normal' }, { label: 'Size', value: 'Big' }]),
    'Add it.\n\nSettings from the demo: Speed: Normal, Size: Big.');
  assert.equal(DP.promptWithSettings('Add it.', []), 'Add it.');
  assert.equal(DP.promptWithSettings('Add it.', [{ label: 'Speed', value: '' }]), 'Add it.');
});

test('pageCopyText reads the prompt and the Try it settings of a page', () => {
  // A stand-in page: a prompt and a Try it step holding one group of choice buttons, "Speed", with "Normal" pressed.
  const pressed = { getAttribute: () => null, textContent: ' Normal ' };
  const seg = { hidden: false, parentElement: null, hasAttribute: () => false, closest: () => null, matches: () => false,
    getAttribute: name => (name === 'aria-labelledby' ? 'speed-lbl' : null), querySelector: () => pressed };
  const tryStep = { querySelectorAll: () => [seg] };
  const prompt = { textContent: 'Add a  fade to [the card].' };
  const page = { querySelector: s => ({ '.hb-prompt': prompt, '.hb-try': tryStep })[s] || null };
  const doc = { querySelector: s => (s === '.hb-page' ? page : null), getElementById: id => (id === 'speed-lbl' ? { textContent: 'Speed' } : null) };
  const win = { getComputedStyle: () => ({ display: '' }) };
  assert.equal(DP.pageCopyText(doc, win), 'Add a fade to [the card].\n\nSettings from the demo: Speed: Normal.');
  const noSettings = { querySelector: s => (s === '.hb-prompt' ? prompt : null) };
  assert.equal(DP.pageCopyText({ querySelector: s => (s === '.hb-page' ? noSettings : null) }, win), 'Add a fade to [the card].');
  assert.equal(DP.pageCopyText({ querySelector: () => null }, win), '');
});

// A choice group labelled `label`, of choices [{ text, pressed, phone }], as the shared script reads one: it asks for the choice
// marked data-hb-phone and for the pressed one.
function choiceGroup(label, choices) {
  const button = choice => ({ textContent: choice.text, getAttribute: () => null });
  return { hidden: false, parentElement: null, hasAttribute: () => false, matches: () => false,
    getAttribute: name => (name === 'data-hb-label' ? label : null),
    querySelector: selector => {
      const found = choices.find(choice => (selector === '[data-hb-phone]' ? choice.phone : choice.pressed));
      return found ? button(found) : null;
    } };
}
// A page as the home page has it once fetched and parsed: its prompt, and a Try it step holding `controls`.
function parsedPage(prompt, controls) {
  const page = { querySelector: s => ({ '.hb-prompt': { textContent: prompt }, '.hb-try': { querySelectorAll: () => controls } })[s] || null };
  return { querySelector: s => (s === '.hb-page' ? page : null), getElementById: () => null };
}
// A window of width × height whose own document is another one, answering the media queries the script asks (a list of
// max-width and max-height features, as on the pages that start a setting lower on phones).
function windowOf(width, height) {
  return { document: {}, getComputedStyle: () => ({ display: '' }),
    matchMedia: query => ({ matches: query.split(',').some(part => {
      const m = /^\s*\(\s*max-(width|height)\s*:\s*(\d+)px\s*\)\s*$/.exec(part);
      if (!m) throw new Error(`unexpected media query: ${query}`);
      return (m[1] === 'width' ? width : height) <= Number(m[2]);
    }) }) };
}

// GPGPU Particle System and Cloth Simulation start a setting lower on phones: their own script presses the choice marked
// data-hb-phone there. The home page reads a page it fetched, where no script ran, so it must count that mark on a phone.
test('a fetched page read on a phone gives the choices marked data-hb-phone and on larger screens the pressed ones; a page in its own window gives what is pressed', () => {
  const prompt = 'Add a cloth to [the banner].';
  // Detail: Medium is pressed in the markup and Low is the phone default; Wind has no phone default.
  const wind = choiceGroup('Wind', [{ text: 'Light' }, { text: 'Medium', pressed: true }]);
  const fetched = parsedPage(prompt, [choiceGroup('Detail', [{ text: 'Low', phone: true }, { text: 'Medium', pressed: true }, { text: 'High' }]), wind]);
  const phone = prompt + '\n\nSettings from the demo: Detail: Low, Wind: Medium.';
  const larger = prompt + '\n\nSettings from the demo: Detail: Medium, Wind: Medium.';
  for (const [width, height, expected, screen] of [[375, 812, phone, 'a phone'], [320, 640, phone, 'a small phone'],
    [812, 375, phone, 'a phone held sideways'], [1280, 800, larger, 'a desktop'], [1366, 657, larger, 'a laptop'], [768, 1024, larger, 'a tablet']]) {
    assert.equal(DP.pageCopyText(fetched, windowOf(width, height)), expected, screen);
  }
  // The page in its own window ran its script, which pressed what counts there, so the pressed choice is read on any screen.
  const own = parsedPage(prompt, [choiceGroup('Detail', [{ text: 'Low', phone: true }, { text: 'Medium' }, { text: 'High', pressed: true }]), wind]);
  for (const [width, height] of [[375, 812], [1280, 800]]) {
    const win = Object.assign(windowOf(width, height), { document: own });
    assert.equal(DP.pageCopyText(own, win), prompt + '\n\nSettings from the demo: Detail: High, Wind: Medium.', `its own window, ${width}px wide`);
  }
});

// The home page passes a stand-in window that only answers getComputedStyle (NO_STYLE in index.html): the window the script
// runs in answers the media query then.
test("on the home page's stand-in window, the window the script runs in says whether the screen is a phone", () => {
  const prompt = 'Add particles to [the hero].';
  const fetched = parsedPage(prompt, [choiceGroup('Number of particles', [{ text: '16,000', phone: true }, { text: '65,000', pressed: true }])]);
  const NO_STYLE = { getComputedStyle: () => ({ display: '' }) };
  const copied = value => `${prompt}\n\nSettings from the demo: Number of particles: ${value}.`;
  const before = Object.getOwnPropertyDescriptor(globalThis, 'matchMedia');
  try {
    globalThis.matchMedia = windowOf(375, 812).matchMedia;
    assert.equal(DP.pageCopyText(fetched, NO_STYLE), copied('16,000'), 'a phone');
    globalThis.matchMedia = windowOf(1280, 800).matchMedia;
    assert.equal(DP.pageCopyText(fetched, NO_STYLE), copied('65,000'), 'a desktop');
    delete globalThis.matchMedia;
    assert.equal(DP.pageCopyText(fetched, NO_STYLE), copied('65,000'), 'where nothing answers media queries');
  } finally {
    if (before) Object.defineProperty(globalThis, 'matchMedia', before);
    else delete globalThis.matchMedia;
  }
});

// The home page copies a card's prompt with pageCopyText, so the button on the page itself has to copy exactly what that gives.
// The clipboard here keeps every text it is asked to write and answers with a promise that is already settled.
test("pressing a page's Copy prompt copies what pageCopyText gives", async () => {
  const prompt = 'Add a fade to [the card].';
  // One group of choice buttons, "Speed", with "Normal" pressed. A page with a setting copies more than its prompt.
  const speed = { hidden: false, parentElement: null, hasAttribute: () => false, matches: () => false,
    getAttribute: name => (name === 'data-hb-label' ? 'Speed' : null),
    querySelector: () => ({ getAttribute: () => null, textContent: ' Normal ' }) };
  const cases = [
    ['a page without a Try it step copies the prompt alone', null, prompt],
    ['a page with a setting copies the prompt and the settings line', [speed], prompt + '\n\nSettings from the demo: Speed: Normal.']
  ];
  for (const [name, controls, expected] of cases) {
    const written = [], accepted = Promise.resolve();
    const clipboard = { writeText: text => { written.push(text); return accepted; } };
    const page = standInPage('once', false, {}, { prompt, controls, clipboard });
    page.button.emit('click', visitor);
    await accepted;
    assert.deepEqual(written, [expected], name);
    assert.equal(written[0], DP.pageCopyText(page.doc, page.win), name);
    assert.equal(page.button.textContent, 'Copied', name);
  }
});
