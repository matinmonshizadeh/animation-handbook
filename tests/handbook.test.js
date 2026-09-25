// Unit tests for the pure helpers in assets/js/handbook.js.
// Run from the repo root: node --test "tests/*.test.js"
const test = require('node:test');
const assert = require('node:assert/strict');
const HB = require('../assets/js/handbook.js');

test('escapeHtml escapes markup characters', () => {
  assert.equal(HB.escapeHtml('<a href="x">&</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;');
});

test('plain drops code and bold markers and escapes', () => {
  assert.equal(HB.plain('`ease-out` **fast** <b>'), 'ease-out fast &lt;b&gt;');
});

test('inline shows code as plain text and renders links, bold and italics', () => {
  assert.equal(HB.inline('Use `opacity` on **one** *hero* [card](../scale-in/)'),
    'Use opacity on <strong>one</strong> <em>hero</em> <a href="../scale-in/">card</a>');
  assert.equal(HB.inline('a < b'), 'a &lt; b');
});

test('sections splits a README by its ## headings', () => {
  const md = '# Title\r\n\r\n## What it is\r\nLine one\r\nline two\r\n\r\n## When to use it\r\n- A\r\n- B\r\n';
  assert.deepEqual(HB.sections(md), { 'What it is': 'Line one\nline two', 'When to use it': '- A\n- B' });
});

test('sections keeps ### lines inside the section they belong to', () => {
  assert.deepEqual(HB.sections('## A\n### not a section\nx'), { A: '### not a section\nx' });
});

test('paragraphs joins wrapped lines and splits on blank lines', () => {
  assert.equal(HB.paragraphs('One\ntwo.\n\nThree `x`.'), '<p>One two.</p><p>Three x.</p>');
  assert.equal(HB.paragraphs(undefined), '');
});

test('bullets returns the list items as inline HTML', () => {
  assert.deepEqual(HB.bullets('- Hero **copy**\nnot a bullet\n- Toasts'), ['Hero <strong>copy</strong>', 'Toasts']);
});

test('cleanName drops parentheticals that hold code', () => {
  assert.equal(HB.cleanName('Duration (`--dur`)'), 'Duration');
  assert.equal(HB.cleanName('Perspective (`--persp`, on parent)'), 'Perspective');
  assert.equal(HB.cleanName('Two curtains (split)'), 'Two curtains (split)');
});

test('table reads Key parameters rows and skips the header and divider', () => {
  const md = '| Parameter | Default | Effect |\n|-----------|---------|--------|\n' +
    '| Duration (`--dur`) | 600ms | Under 150ms **barely** registers |\n| Easing | `ease-out` | Settles gently |';
  assert.deepEqual(HB.table(md), [
    { name: 'Duration', value: '600ms', effect: 'Under 150ms <strong>barely</strong> registers' },
    { name: 'Easing', value: 'ease-out', effect: 'Settles gently' }
  ]);
  assert.deepEqual(HB.table(''), []);
});

test('seeAlso reads name, link and description', () => {
  const md = '- [Scale In](../scale-in/) — the same entrance without the overshoot\n- [Blur In](../blur-in/)\nText';
  assert.deepEqual(HB.seeAlso(md), [
    { name: 'Scale In', href: '../scale-in/', desc: 'the same entrance without the overshoot' },
    { name: 'Blur In', href: '../blur-in/', desc: '' }
  ]);
});

test('settingsLine joins label and value pairs and skips empty ones', () => {
  assert.equal(HB.settingsLine([
    { label: 'Duration', value: '600ms' }, { label: 'Easing', value: 'Ease out' }, { label: 'Mode', value: '' }
  ]), 'Duration 600ms, Easing Ease out');
  assert.equal(HB.settingsLine([]), '');
});
