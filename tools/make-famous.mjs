#!/usr/bin/env node
// Writes the previews of the Famous effects page (famous/index.html) from the home page: a development tool, not part of the
// site (docs/superpowers/specs/2026-10-13-famous-effects-design.md, section 4).
// Run it from the repo root after changing the page's cards, or a preview they show on the home page: its key in PV, its case
// in pvMarkup(), its rules or keyframes, or its STILL point. tests/famous.test.js fails until then.
// Usage: node tools/make-famous.mjs
//   It reads the cards of famous/index.html (data-slug on <article class="card cN">, in page order) and, from index.html,
//   CATS, PV, STILL, pvMarkup() and engines (the previews a script draws, which this page has no room for) from its script,
//   and from its style the base preview rules (BASE below), every rule that names a preview the page shows (.pv-<key>, inside
//   @media too, keeping only the parts of a shared selector that name it), the @keyframes those rules and the preview's
//   markup name, and the @property rules they use. It rewrites the text between the two marker lines of each block in
//   famous/index.html: the CSS (CSS_START … CSS_END) and the PREVIEWS object (JS_START … JS_END), which gives each card its
//   preview key, markup and still point. It keeps the page's line endings, writes only when the text changed and prints what
//   it wrote; running it twice changes nothing. buildFamous(root), exported for the test, returns
//   { 'famous/index.html': text } with LF line endings and writes nothing.
// Exit code 1 when a card is not on the home page, its preview needs a script, has no markup or animates in SVG, a base rule
// or a preview's rules cannot be found, or a marker line is missing or written twice.
import { existsSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

export const CSS_START = '/* ── previews: written by tools/make-famous.mjs from the home page; run it again, never edit by hand ── */';
export const CSS_END = '/* ── end of previews ── */';
export const JS_START = '// ── previews: written by tools/make-famous.mjs from the home page; run it again, never edit by hand ──';
export const JS_END = '// ── end of previews ──';
// The home page's rules every preview needs: each category's accent color, the preview box, and its animations paused unless
// its card plays; and, under reduced motion, paused always.
const BASE = ['.c1', '.c2', '.c3', '.c4', '.c5', '.c6', '.c7', '.pv', '.pv *',
  '.card:not(.playing) .pv .anim,.card:not(.playing) .pv .anim::before,.card:not(.playing) .pv .anim::after'];
const BASE_REDUCED = '.pv .anim,.pv .anim::before,.pv .anim::after';
const REDUCED = '@media(prefers-reduced-motion:reduce)';

// Where the bracket that opens at text[from] ('[' or '{') is closed, stepping over strings and // comments (as the tests
// read the home page).
function blockEnd(text, from) {
  const open = text[from], close = open === '[' ? ']' : '}';
  let depth = 0, i = from, quote = null;
  for (; i < text.length; i++) {
    const ch = text[i];
    if (quote) { if (ch === '\\') i++; else if (ch === quote) quote = null; continue; }
    if (ch === '/' && text[i + 1] === '/') { while (i < text.length && text[i] !== '\n') i++; continue; }
    if (ch === "'" || ch === '"' || ch === '`') quote = ch;
    else if (ch === open) depth++;
    else if (ch === close && --depth === 0) break;
  }
  return i;
}
// The value of `const NAME=` in the home page's script: an array or object literal of plain data, read with vm.
export function homeConst(home, name) {
  const start = home.indexOf(`const ${name}=`);
  if (start < 0) throw new Error(`index.html has no const ${name}=`);
  const from = start + `const ${name}=`.length;
  return vm.runInNewContext('(' + home.slice(from, blockEnd(home, from) + 1) + ')');
}
// A function of the home page's script, `function NAME(…){…}`, read with vm (pvMarkup uses no page state).
function homeFunction(home, name) {
  const start = home.indexOf(`function ${name}(`);
  if (start < 0) throw new Error(`index.html has no function ${name}(`);
  return vm.runInNewContext('(' + home.slice(start, blockEnd(home, home.indexOf('{', start)) + 1) + ')');
}
// The previews the home page draws with a script (its engines object): their keys, before each ":" at the top level.
function engineKeys(home) {
  const start = home.indexOf('const engines={');
  if (start < 0) throw new Error('index.html has no const engines={');
  const from = start + 'const engines='.length, keys = [];
  let depth = 0, part = '';
  for (const ch of home.slice(from + 1, blockEnd(home, from)) + ',') {
    if ('({['.includes(ch)) depth++;
    else if (')}]'.includes(ch)) depth--;
    if (ch === ',' && depth === 0) { keys.push(part.split(':')[0].trim()); part = ''; } else part += ch;
  }
  return keys.filter(Boolean);
}
// The style without its comments; a comment mark inside a string (a data URI) does not count.
function stripComments(css) {
  let out = '', quote = null;
  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    if (quote) { out += ch; if (ch === '\\') out += css[++i] ?? ''; else if (ch === quote) quote = null; continue; }
    if (ch === '"' || ch === "'") { quote = ch; out += ch; continue; }
    if (ch === '/' && css[i + 1] === '*') { const end = css.indexOf('*/', i + 2); i = end < 0 ? css.length : end + 1; continue; }
    out += ch;
  }
  return out;
}
// Where the next of the characters in stops is, outside strings (css.length when there is none).
function next(css, from, stops) {
  let quote = null;
  for (let i = from; i < css.length; i++) {
    const ch = css[i];
    if (quote) { if (ch === '\\') i++; else if (ch === quote) quote = null; continue; }
    if (ch === '"' || ch === "'") quote = ch;
    else if (stops.includes(ch)) return i;
  }
  return css.length;
}
const squeeze = s => s.replace(/\s*\n\s*/g, ' ').trim();
// A style (comments already gone) as its top-level items: { kind: 'rule', selector, body } or { kind: 'at', name, head, inner,
// items }, where items are the rules inside an @media or @supports block.
function parseCss(css) {
  const items = [];
  for (let i = 0; i < css.length;) {
    const open = next(css, i, '{;}');
    if (open >= css.length) break;
    const head = css.slice(i, open).trim().replace(/\s+/g, ' ');
    if (css[open] !== '{') { i = open + 1; continue; }
    let depth = 1, j = open + 1;
    while (depth) {
      j = next(css, j, '{}');
      if (j >= css.length) throw new Error(`index.html: the style is not closed after "${head}"`);
      depth += css[j] === '{' ? 1 : -1;
      j++;
    }
    const inner = css.slice(open + 1, j - 1);
    if (head.startsWith('@')) {
      const name = head.slice(1).match(/^[\w-]+/)[0];
      items.push({ kind: 'at', name, head, inner: squeeze(inner), items: name === 'media' || name === 'supports' ? parseCss(inner) : [] });
    } else items.push({ kind: 'rule', selector: head, body: squeeze(inner) });
    i = j;
  }
  return items;
}
// The parts of a selector list, split at its top-level commas.
function parts(selector) {
  const out = [];
  let depth = 0, part = '';
  for (const ch of selector + ',') {
    if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth--;
    if (ch === ',' && depth === 0) { out.push(part.trim()); part = ''; } else part += ch;
  }
  return out;
}
// The parts of a selector list that name the preview key (".pv-mesh", not ".pv-meshy"), joined again; '' when none does.
const picked = (selector, key) => parts(selector).filter(p => new RegExp(`\\.pv-${key}(?![\\w-])`).test(p)).join(',');

// The two blocks for the cards with these slugs (in page order): { css, data }.
export function previewBlocks(home, slugs) {
  const CATS = homeConst(home, 'CATS'), PV = homeConst(home, 'PV'), STILL = homeConst(home, 'STILL');
  const pvMarkup = homeFunction(home, 'pvMarkup'), engines = engineKeys(home);
  const previews = [];
  for (const slug of new Set(slugs)) {
    const cat = CATS.find(c => c.entries.some(e => e[0] === slug));
    if (!cat) throw new Error(`famous/index.html: ${slug} is not a card on the home page`);
    const pv = PV[slug] || 'sig' + parseInt(cat.n, 10);
    if (engines.includes(pv)) throw new Error(`famous/index.html: ${slug} shows the preview ${pv}, which needs a script engine this page does not have`);
    const markup = pvMarkup(pv);
    if (!markup) throw new Error(`famous/index.html: ${slug} shows the preview ${pv}, which has no markup`);
    if (/<animate\b/.test(markup)) throw new Error(`famous/index.html: ${slug} shows the preview ${pv}, which animates in SVG (the home page takes that out under reduced motion; this page does not)`);
    previews.push({ slug, pv, still: STILL[pv] ?? 0.5, markup, name: cat.entries.find(e => e[0] === slug)[1] });
  }
  const items = parseCss(stripComments([...home.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n')));
  const one = (list, selector, where) => {
    const found = list.filter(it => it.kind === 'rule' && it.selector === selector);
    if (found.length !== 1) throw new Error(`index.html: ${found.length} rules for ${selector}${where}, not 1`);
    return `${selector}{${found[0].body}}`;
  };
  const named = name => items.filter(it => it.kind === 'at' && it.name === name).map(it => ({ id: it.head.split(' ')[1], text: `${it.head}{${it.inner}}` }));
  const keyframes = named('keyframes'), properties = named('property');
  const reduced = items.filter(it => it.kind === 'at' && it.head.replace(/\s+/g, '') === REDUCED).flatMap(it => it.items);
  // Each preview: a comment naming it, its rules (inside @media too, only the parts of the selector that name it), and the
  // keyframes that its rules or its markup name.
  const drawn = [...new Set(previews.map(p => p.pv))].map(key => {
    const own = [];
    for (const it of items) {
      if (it.kind === 'rule') { const sel = picked(it.selector, key); if (sel) own.push(`${sel}{${it.body}}`); }
      else if (it.name === 'media' || it.name === 'supports') {
        const inner = it.items.filter(r => r.kind === 'rule' && picked(r.selector, key)).map(r => `${picked(r.selector, key)}{${r.body}}`);
        if (inner.length) own.push(`${it.head}{${inner.join('')}}`);
      }
    }
    if (!own.length) throw new Error(`index.html: no rule draws the preview ${key}`);
    const words = new Set((own.join(' ') + ' ' + previews.find(p => p.pv === key).markup).split(/[\s,:;(){}"'=]+/));
    const who = previews.filter(p => p.pv === key).map(p => p.name).join(', ');
    return [`/* ${key}: ${who} */`, ...own, ...keyframes.filter(k => words.has(k.id)).map(k => k.text)];
  });
  const all = drawn.flat().join('\n') + previews.map(p => p.markup).join('\n');
  const css = ["/* the base: each category's accent color, the preview box, and its animations paused unless its card plays */",
    ...BASE.map(selector => one(items, selector, '')),
    `${REDUCED}{${one(reduced, BASE_REDUCED, ' under reduced motion')}}`,
    ...properties.filter(p => new RegExp(`${p.id}(?![\\w-])`).test(all)).map(p => p.text),
    ...drawn.flat()].join('\n');
  const data = ['const PREVIEWS={',
    ...previews.map((p, i) => JSON.stringify(p.slug) + ':' + JSON.stringify({ pv: p.pv, still: p.still, markup: p.markup }).replace(/<\//g, '<\\/') + (i < previews.length - 1 ? ',' : '')),
    '};'].join('\n');
  return { css, data };
}

// The text with what lies between the start and end marker lines replaced by inner (each marker there once, in that order).
export function replaceBetween(text, start, end, inner) {
  const once = marker => text.indexOf(marker) >= 0 && text.indexOf(marker) === text.lastIndexOf(marker);
  const a = text.indexOf(start), b = text.indexOf(end);
  if (!once(start) || !once(end) || b < a + start.length) throw new Error(`famous/index.html: the lines "${start}" and "${end}" must each be there once, in that order`);
  return text.slice(0, a + start.length) + '\n' + inner + '\n' + text.slice(b);
}
// The slugs of the page's cards, in page order.
export const cardSlugs = page => [...page.matchAll(/<article class="card c[1-7]" data-slug="([a-z0-9-]+)">/g)].map(m => m[1]);
// The page with both blocks written from the home page.
export function buildFamousFrom(home, page) {
  const { css, data } = previewBlocks(home, cardSlugs(page));
  return replaceBetween(replaceBetween(page, CSS_START, CSS_END, css), JS_START, JS_END, data);
}
export function buildFamous(root) {
  const file = join(root, 'famous', 'index.html');
  if (!existsSync(file)) throw new Error('famous/index.html is missing');
  const home = readFileSync(join(root, 'index.html'), 'utf8').replace(/\r\n/g, '\n');
  return { 'famous/index.html': buildFamousFrom(home, readFileSync(file, 'utf8').replace(/\r\n/g, '\n')) };
}

// Run as a command, not imported by the test. The command's path is compared with its real path, so a run through a junction
// or a link counts too.
const self = (() => { try { return realpathSync(process.argv[1]); } catch { return ''; } })();
if (self.toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  const ROOT = fileURLToPath(new URL('..', import.meta.url));
  try {
    const file = join(ROOT, 'famous', 'index.html');
    const text = buildFamous(ROOT)['famous/index.html'];
    const old = readFileSync(file, 'utf8');
    const out = old.includes('\r\n') ? text.replace(/\n/g, '\r\n') : text;
    if (out !== old) writeFileSync(file, out);
    const previews = (text.match(/^"[a-z0-9-]+":\{"pv":/gm) || []).length;
    console.log(`famous/index.html: ${cardSlugs(text).length} cards, ${previews} previews${out === old ? '' : ' (written)'}`);
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  }
}
