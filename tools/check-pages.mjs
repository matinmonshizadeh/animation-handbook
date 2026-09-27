#!/usr/bin/env node
// Browser check for guided-steps demo pages: a development tool, not part of the site.
// Needs the local Chrome and a static server for the repo (python -m http.server 8731 --bind 127.0.0.1).
// Usage: node tools/check-pages.mjs [--base http://127.0.0.1:8731] [--out <folder>] <page folder>...
//   e.g. node tools/check-pages.mjs animations/02-entrance-and-exit/fade-in-out
// Each page is loaded at five screen setups; problems are printed and screenshots saved. Exit code 1 on any problem.
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = Number(process.env.CDP_PORT || 9333);
const args = process.argv.slice(2);
function option(name, fallback) {
  const i = args.indexOf(name);
  if (i < 0) return fallback;
  const value = args[i + 1];
  args.splice(i, 2);
  return value;
}
const BASE = option('--base', 'http://127.0.0.1:8731').replace(/\/$/, '');
const OUT = option('--out', mkdtempSync(join(tmpdir(), 'hb-check-')));
const pages = args.map(p => p.replace(/\\/g, '/').replace(/^\.?\//, '').replace(/\/?(index\.html)?$/, '/'));
if (!pages.length) {
  console.error('Usage: node tools/check-pages.mjs [--base URL] [--out DIR] <page folder>...');
  process.exit(2);
}
mkdirSync(OUT, { recursive: true });

const SETUPS = [
  { name: 'desktop', width: 1280, height: 800, full: true },
  { name: 'laptop', width: 1366, height: 657 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'phone', width: 375, height: 812, mobile: true, scale: 2 },
  { name: 'phone-reduced', width: 375, height: 812, mobile: true, scale: 2, reduce: true }
];

// Runs inside the page. Returns the page kind, the Loop switch state and the problems found.
const CHECK = `(() => {
  const r = el => el.getBoundingClientRect();
  const phone = innerWidth <= 600;
  const problems = [];
  if (document.documentElement.scrollWidth > innerWidth + 1) problems.push('horizontal overflow');
  if (phone) {
    const small = [...document.querySelectorAll('.hb-bar a, .hb-page button, .hb-page summary, .hb-page select, .hb-page input[type=range], .hb-page .hb-text, label.hb-toggle, label.hb-switch-row, .hb-foot a, .hb-rel')]
      .filter(el => el.getClientRects().length && !el.closest('.stage'))
      .filter(el => { const b = r(el); return b.width < 44 || b.height < 44; })
      .map(el => el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '') + ' ' + Math.round(r(el).width) + 'x' + Math.round(r(el).height));
    if (small.length) problems.push('small targets: ' + small.join(', '));
  }
  const player = document.querySelector('.hb-player');
  if (innerWidth >= 1025 && player && r(player).bottom > innerHeight) problems.push('player bar below the first screen');
  const tryIt = document.querySelector('.hb-try');
  const shown = el => { for (let n = el; n && n !== tryIt; n = n.parentElement) { if (n.hidden || n.hasAttribute('data-hb-skip') || getComputedStyle(n).display === 'none') return false; } return true; };
  const controls = tryIt ? [...tryIt.querySelectorAll('input[type=range], input[type=checkbox], input[type=text], textarea, select, .seg, .swatches')].filter(shown).length : 0;
  const chips = document.querySelectorAll('.hb-chips li').length;
  if (chips !== controls) problems.push('chips ' + chips + ' vs settings ' + controls);
  if (!document.querySelector('.hb-what-text p')) problems.push('What it is is empty');
  const loop = document.querySelector('[data-hb-loop]');
  return { kind: document.body.dataset.hbKind || '', loop: loop ? loop.checked : null, problems };
})()`;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'hb-chrome-'))}`, 'about:blank'], { stdio: 'ignore' });

async function pageSocket() {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find(t => t.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(200);
  }
  throw new Error('Chrome did not start (set CHROME to its path if it is not in the default place)');
}

const ws = new WebSocket(await pageSocket());
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let nextId = 0;
const pending = new Map();
const listeners = new Set();
ws.addEventListener('message', event => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); } else listeners.forEach(fn => fn(msg));
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++nextId;
  pending.set(id, msg => (msg.error ? reject(new Error(`${method}: ${msg.error.message}`)) : resolve(msg.result)));
  ws.send(JSON.stringify({ id, method, params }));
});
const evaluate = async expression => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.value;

const errors = [];
listeners.add(msg => {
  if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text);
  if (msg.method === 'Runtime.consoleAPICalled' && (msg.params.type === 'error' || msg.params.type === 'warning')) {
    errors.push(msg.params.args.map(a => a.value ?? a.description).join(' '));
  }
  if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') errors.push(msg.params.entry.text + ' ' + (msg.params.entry.url || ''));
});
await send('Page.enable');
await send('Runtime.enable');
await send('Log.enable');

let failures = 0;
for (const page of pages) {
  for (const setup of SETUPS) {
    errors.length = 0;
    await send('Emulation.setDeviceMetricsOverride', { width: setup.width, height: setup.height, deviceScaleFactor: setup.scale || 1, mobile: !!setup.mobile });
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: setup.reduce ? 'reduce' : 'no-preference' }] });
    const loaded = new Promise(resolve => {
      const onLoad = msg => { if (msg.method === 'Page.loadEventFired') { listeners.delete(onLoad); resolve(); } };
      listeners.add(onLoad);
    });
    await send('Page.navigate', { url: `${BASE}/${page}` });
    await loaded;
    await sleep(2000);
    const result = await evaluate(CHECK);
    const problems = [...result.problems, ...errors.map(e => 'console: ' + e)];
    if (result.kind === 'once' && result.loop !== null) {
      if (setup.reduce && result.loop) problems.push('Loop switched on under reduced motion');
      if (!setup.reduce && !result.loop) problems.push('did not start playing on arrival (Loop is off)');
    }
    const name = page.replace(/\/$/, '').split('/').pop();
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(OUT, `${name}-${setup.name}.png`), Buffer.from(shot.data, 'base64'));
    if (setup.full) {
      const { cssContentSize } = await send('Page.getLayoutMetrics');
      const full = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
        clip: { x: 0, y: 0, width: setup.width, height: Math.ceil(cssContentSize.height), scale: 1 } });
      writeFileSync(join(OUT, `${name}-${setup.name}-full.png`), Buffer.from(full.data, 'base64'));
    }
    if (problems.length) failures++;
    console.log(`${problems.length ? 'FAIL' : 'ok  '} ${name} ${setup.name}${problems.length ? ' — ' + problems.join('; ') : ''}`);
  }
}
console.log(`Screenshots: ${OUT}`);
ws.close();
chrome.kill();
process.exit(failures ? 1 : 0);
