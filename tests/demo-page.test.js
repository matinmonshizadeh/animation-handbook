// Unit tests for the pure helpers in assets/js/demo-page.js.
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
  assert.equal(DP.motionNote({}), '');
});
