#!/usr/bin/env node
// One-time migration of legacy demo pages to the shared demo layout.
// See docs/superpowers/specs/2026-09-25-demo-page-redesign-design.md.
// Usage (repo root): node tools/migrate-demo.js tools/migrations/<category>.json [slug ...]
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { escapeHtml } = require('../assets/js/handbook.js');

// Replace `find` exactly once; anything else means the page doesn't have the expected shape.
function replaceOnce(html, find, replacement, step) {
  const count = typeof find === 'string'
    ? html.split(find).length - 1
    : (html.match(new RegExp(find.source, find.flags.includes('g') ? find.flags : find.flags + 'g')) || []).length;
  if (count !== 1) throw new Error(`${step}: expected exactly 1 match, found ${count}`);
  return html.replace(find, typeof replacement === 'function' ? replacement : () => replacement);
}

function pagerLink(rel, target) {
  if (!target) return '';
  const label = rel === 'prev' ? 'Previous' : 'Next';
  const name = `<span class="hb-name">${escapeHtml(target.name)}</span>`;
  return `<a href="${target.href}" rel="${rel}" aria-label="${label}: ${escapeHtml(target.name)}">` +
    (rel === 'prev' ? `‹ ${name}` : `${name} ›`) + '</a>';
}

function topBar(demo) {
  return '<nav class="hb-bar" aria-label="Animation Handbook">' +
    '<a class="hb-home" href="../../../">← <span>Animation Handbook</span></a>' +
    `<span class="hb-pager">${pagerLink('prev', demo.prev)}${pagerLink('next', demo.next)}</span></nav>`;
}

function migrate(html, cfg, demo) {
  if (html.includes('class="hb-view"')) throw new Error('already migrated');
  let out = html.replace(/\r\n/g, '\n');

  // Legacy top bar styles, font files and font variables.
  out = replaceOnce(out, /\n<style id="ah-inject">[\s\S]*?<\/style>/, '', 'ah-inject style');
  const fontFace = /^[ \t]*@font-face\{font-family:'(?:Bricolage|PlexMono)'[^\n]*\n/gm;
  if (!fontFace.test(out)) throw new Error('font-face lines: none found');
  out = out.replace(fontFace, '');
  out = replaceOnce(out, /--disp:[^;}]*;?/, '', '--disp variable');
  out = replaceOnce(out, /--mono:[^;}]*;?/, '', '--mono variable');

  // Shared assets, body marker and the new top bar.
  out = replaceOnce(out, '</head>',
    '<link rel="stylesheet" href="../../../assets/css/handbook.css">\n' +
    '<script src="../../../assets/js/handbook.js" defer></script>\n</head>', '</head>');
  out = replaceOnce(out, '<body>', `<body class="hb"${demo.autoplay ? ' data-hb-autoplay' : ''}>`, '<body>');
  out = replaceOnce(out, /<div class="ah-bar"[^\n]*<\/div>\n/, topBar(demo) + '\n', 'ah-bar');
  out = replaceOnce(out, /\n<script>\(function\(\)\{var b=document\.getElementById\("ah-copy"\)[^\n]*<\/script>/, '', 'copy-source script');

  // The header moves into the side column; the note moves out (its content lives in the README).
  let title = '';
  let lede = '';
  out = replaceOnce(out, /<header>\s*<h1>([\s\S]*?)<\/h1>\s*<p>([\s\S]*?)<\/p>\s*<\/header>\n/,
    (m, h, p) => { title = h.trim(); lede = p.trim(); return ''; }, 'header');
  if (demo.lede) lede = escapeHtml(demo.lede);
  const head =
    '    <header class="hb-head">\n' +
    `      <p class="hb-cat">${demo.number} · ${escapeHtml(cfg.name)}</p>\n` +
    `      <h1>${title}</h1>\n` +
    `      <p class="hb-lede">${lede}</p>\n` +
    '    </header>\n' +
    '    <section class="hb-settings" aria-label="Settings">\n' +
    '      <h2 class="hb-label">Settings</h2>\n';
  out = replaceOnce(out, '<div class="layout">', '<main class="hb-view">', 'layout wrapper');
  out = replaceOnce(out, /(\n[ \t]*)<aside>\n/, (m, indent) => `${indent}<aside class="hb-side">\n${head}`, 'aside open');
  out = replaceOnce(out, /\n[ \t]*<p class="note">[\s\S]*?<\/p>/, '', 'note');
  const take =
    '    </section>\n' +
    '    <div class="hb-take">\n' +
    '      <section class="hb-prompt-box" aria-labelledby="hb-prompt-title">\n' +
    '        <h2 class="hb-label" id="hb-prompt-title">Prompt</h2>\n' +
    `        <p class="hb-prompt">${escapeHtml(demo.prompt)}</p>\n` +
    '      </section>\n' +
    '    </div>\n';
  out = replaceOnce(out, /([ \t]*)<\/aside>\n<\/div>\n/, (m, indent) => `${take}${indent}</aside>\n</main>\n`, 'aside close');

  // Markers the shared script looks for, then one-off edits.
  for (const [id, attrs] of Object.entries(demo.attrs || {})) {
    out = replaceOnce(out, `id="${id}"`, `id="${id}" ${attrs}`, `attrs for #${id}`);
  }
  for (const [find, replacement] of demo.edits || []) {
    out = replaceOnce(out, find, replacement, `edit "${find.slice(0, 40)}"`);
  }
  return out;
}

function main(argv) {
  const [configPath, ...only] = argv;
  if (!configPath) {
    console.error('Usage: node tools/migrate-demo.js <config.json> [slug ...]');
    process.exit(2);
  }
  const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const demos = cfg.demos.filter(d => !only.length || only.includes(d.slug));
  if (only.length && demos.length !== only.length) throw new Error(`unknown slug in: ${only.join(', ')}`);
  const root = path.resolve(__dirname, '..');
  for (const demo of demos) {
    const file = path.join(root, 'animations', cfg.category, demo.slug, 'index.html');
    fs.writeFileSync(file, migrate(fs.readFileSync(file, 'utf8'), cfg, demo));
    console.log('migrated', path.relative(root, file));
  }
}

if (require.main === module) main(process.argv.slice(2));
module.exports = { migrate, topBar, replaceOnce };
