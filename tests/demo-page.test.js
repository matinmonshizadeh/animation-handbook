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
// would), timers wait in a list until the test runs them, and every hb:input the script sends is kept.
function standInPage(kind, reduced, bodyAttributes) {
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
  const wanted = { '.hb-prompt': prompt, '.stage': stage, '.hb-player': player, '[data-hb-demo]': kind === 'do' && demo,
    '[data-hb-autoscroll]': kind === 'scroll' && play, '[data-hb-top]': kind === 'scroll' && top };
  const page = { querySelector: selector => wanted[selector] || null };
  const body = node();
  body.setAttribute('data-hb-kind', kind);
  body.setAttribute('data-hb-autoplay', '');
  Object.keys(bodyAttributes || {}).forEach(name => body.setAttribute(name, bodyAttributes[name]));
  const doc = { body, querySelector: selector => (selector === '.hb-page' ? page : null), createElement: node, dispatchEvent: event => sent.push(event) };
  const win = {
    matchMedia: () => ({ matches: !!reduced, addEventListener() {} }),
    setTimeout: (fn, ms) => timers.push({ fn, ms }),
    clearTimeout() {}, location: { protocol: 'http:' }, console,
    CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init && init.detail; } }
  };
  DP.boot(doc, win);
  return { doc, stage, player, demo, sent, runTimers: () => timers.forEach(t => t.fn()), timerDelays: () => timers.map(t => t.ms) };
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
