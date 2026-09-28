#!/usr/bin/env node
// Browser check for guided-steps demo pages: a development tool, not part of the site.
// Needs the local Chrome and a static server for the repo (python -m http.server 8731 --bind 127.0.0.1).
// Usage: node tools/check-pages.mjs [--base http://127.0.0.1:8731] [--out <folder>] <page or category folder>...
//   e.g. node tools/check-pages.mjs animations/02-entrance-and-exit
// A folder with no index.html of its own stands for the page folders inside it. Each page is loaded at five screen
// setups; problems are printed and screenshots saved, by default into hb-check in the temp folder (emptied at the
// start of each run). Console warnings count as problems too (the page script warns about settings that have no
// label or value). On plays-once pages the desktop run also checks that Replay and a setting change visibly move
// the stage. Exit code 1 on any problem.
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const LOAD_TIMEOUT = 20000;
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);
function option(name, fallback) {
  const i = args.indexOf(name);
  if (i < 0) return fallback;
  const value = args[i + 1];
  args.splice(i, 2);
  return value;
}
const BASE = option('--base', 'http://127.0.0.1:8731').replace(/\/$/, '');
const givenOut = option('--out', '');
const OUT = givenOut || join(tmpdir(), 'hb-check');
const isPage = folder => existsSync(join(ROOT, folder, 'index.html'));
// A category folder (no index.html, but page folders inside) is expanded to its pages, so the call works
// in shells that do not expand wildcards, such as PowerShell.
const pages = args.map(p => p.replace(/\\/g, '/').replace(/^\.?\//, '').replace(/\/?(index\.html)?$/, '/'))
  .flatMap(p => {
    if (isPage(p) || !existsSync(join(ROOT, p))) return [p];
    const inside = readdirSync(join(ROOT, p), { withFileTypes: true })
      .filter(d => d.isDirectory() && isPage(p + d.name)).map(d => `${p}${d.name}/`).sort();
    return inside.length ? inside : [p];
  });
if (!pages.length) {
  console.error('Usage: node tools/check-pages.mjs [--base URL] [--out DIR] <page or category folder>...');
  process.exit(2);
}
if (!givenOut) {
  try { rmSync(OUT, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); }
  catch { console.error(`Could not empty ${OUT}; screenshots from an earlier run may remain.`); }
}
mkdirSync(OUT, { recursive: true });

const SETUPS = [
  { name: 'desktop', width: 1280, height: 800, full: true, moves: true },
  { name: 'laptop', width: 1366, height: 657 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'phone', width: 375, height: 812, mobile: true, scale: 2 },
  { name: 'phone-reduced', width: 375, height: 812, mobile: true, scale: 2, reduce: true }
];

// Runs inside the page. Returns the page kind, the Loop switch state, the player switches and the problems found.
const CHECK = `(() => {
  const r = el => el.getBoundingClientRect();
  const phone = innerWidth <= 600;
  const problems = [];
  if (!document.querySelector('.hb-page')) problems.push('not a guided-steps page');
  if (document.documentElement.scrollWidth > innerWidth + 1) problems.push('horizontal overflow');
  if (phone) {
    const small = [...document.querySelectorAll('.hb-bar a, .hb-page button, .hb-page summary, .hb-page select, .hb-page input[type=range], .hb-page .hb-text, label.hb-toggle, label.hb-switch-row, .hb-foot a, .hb-rel')]
      .filter(el => el.getClientRects().length && !el.closest('.stage'))
      .filter(el => { const b = r(el); return b.width < 44 || b.height < 44; })
      .map(el => el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '') + ' ' + Math.round(r(el).width) + 'x' + Math.round(r(el).height));
    if (small.length) problems.push('small targets: ' + small.join(', '));
  }
  const firstScreen = document.querySelector('.hb-player') || document.querySelector('.hb-page .stage');
  if (innerWidth >= 1025 && firstScreen && r(firstScreen).bottom > innerHeight) problems.push('stage or player bar below the first screen');
  const tryIt = document.querySelector('.hb-try');
  const shown = el => { for (let n = el; n && n !== tryIt; n = n.parentElement) { if (n.hidden || n.hasAttribute('data-hb-skip') || getComputedStyle(n).display === 'none') return false; } return true; };
  const controls = tryIt ? [...tryIt.querySelectorAll('input[type=range], input[type=checkbox], input[type=text], textarea, select, .seg, .swatches')].filter(shown).length : 0;
  const chips = document.querySelectorAll('.hb-chips li').length;
  if (chips !== controls) problems.push('chips ' + chips + ' vs settings ' + controls);
  const what = document.querySelector('.hb-what-text');
  if (!what || !what.querySelector('p')) problems.push('What it is is missing');
  else if (what.querySelector('a[href="README.md"]')) problems.push('What it is did not load from the README');
  const loop = document.querySelector('[data-hb-loop]');
  const switches = [...document.querySelectorAll('[data-hb-loop], [data-hb-slowmo]')].map(s =>
    ({ name: s.matches('[data-hb-loop]') ? 'Loop' : 'Slow motion', checked: s.checked, disabled: s.disabled }));
  return { kind: document.body.dataset.hbKind || '', loop: loop ? loop.checked : null, switches, problems };
})()`;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const withTimeout = (promise, ms) => Promise.race([promise, sleep(ms).then(() => { throw new Error('timeout'); })]);

const profile = mkdtempSync(join(tmpdir(), 'hb-chrome-'));
function removeProfile() {
  try { rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 }); }
  catch { console.error(`Could not remove the temporary Chrome profile: ${profile}`); }
}
// Port 0: Chrome picks a free port and writes it into DevToolsActivePort in its profile folder,
// so a Chrome left over from an earlier run can never be picked up by mistake.
// No LCD text: text that gets its own layer during a transition (even one that does not move it) would
// otherwise be drawn with different antialiasing, and the stage comparisons would see a change nobody can see.
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--disable-lcd-text',
  '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
const chromeExited = new Promise(resolve => chrome.once('exit', resolve));
chrome.once('error', err => {
  console.error(`Could not start Chrome at ${CHROME} (${err.message}). Set CHROME to its path.`);
  removeProfile();
  process.exit(2);
});

async function pageSocket() {
  const portFile = join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 100; i++) {
    if (existsSync(portFile)) {
      const port = readFileSync(portFile, 'utf8').split('\n')[0].trim();
      try {
        const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
        const page = list.find(t => t.type === 'page');
        if (page) return page.webSocketDebuggerUrl;
      } catch {}
    }
    await sleep(100);
  }
  throw new Error('Chrome started but its DevTools port did not answer');
}

let ws = null;
let nextId = 0;
const pending = new Map();
const listeners = new Set();
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) { reject(new Error(`${method}: Chrome is not connected`)); return; }
    const id = ++nextId;
    pending.set(id, msg => (msg.error ? reject(new Error(`${method}: ${msg.error.message}`)) : resolve(msg.result)));
    ws.send(JSON.stringify({ id, method, params }));
  });
}
function failPending(reason) {
  for (const done of pending.values()) done({ error: { message: reason } });
  pending.clear();
}
const evaluate = async expression => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.value;

// The stage's rectangle as a PNG (base64), so two moments of the demo can be compared.
async function stageShot() {
  const box = await evaluate(`(() => { const b = document.querySelector('.hb-page .stage').getBoundingClientRect();
    return { x: b.left + scrollX, y: b.top + scrollY, width: b.width, height: b.height }; })()`);
  return (await send('Page.captureScreenshot', { format: 'png', clip: { ...box, scale: 1 } })).data;
}

// Waits 3 s for the demo to settle, then (for slower demos) until two captures 250ms apart match.
async function settledShot() {
  await sleep(3000);
  let shot = await stageShot();
  for (let i = 0; i < 10; i++) {
    await sleep(250);
    const next = await stageShot();
    if (next === shot) break;
    shot = next;
  }
  return shot;
}

// Plays-once pages: with Loop off and the demo settled, pressing Replay and changing a setting must each
// change what the stage shows shortly afterwards (the shared script replays 250ms after a change).
async function movementProblems() {
  const ready = await evaluate(`(() => {
    const loop = document.querySelector('[data-hb-loop]');
    if (loop && loop.checked) loop.click();
    return !!document.querySelector('.hb-page .stage') && !!document.querySelector('[data-hb-replay]');
  })()`);
  if (!ready) return ['no stage or Replay button to check'];
  const problems = [];
  const settled = await settledShot();
  await evaluate(`document.querySelector('[data-hb-replay]').click()`);
  await sleep(120);
  if (await stageShot() === settled) problems.push('Replay does not visibly move the stage');
  const settledAgain = await settledShot();
  const clicked = await evaluate(`(() => {
    const choice = [...document.querySelectorAll('.hb-try .seg button')]
      .find(b => b.getAttribute('aria-pressed') !== 'true' && b.getClientRects().length);
    if (choice) choice.click();
    return !!choice;
  })()`);
  if (clicked) {
    await sleep(370);
    if (await stageShot() === settledAgain) problems.push('changing a setting does not replay the stage');
  }
  return problems;
}

let failures = 0;
try {
  ws = new WebSocket(await pageSocket());
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', () => reject(new Error('Could not connect to Chrome')), { once: true });
  });
  ws.addEventListener('message', event => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); } else listeners.forEach(fn => fn(msg));
  });
  ws.addEventListener('close', () => failPending('Chrome closed the connection'));

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

  for (const page of pages) {
    const parts = page.replace(/\/$/, '').split('/');
    const name = parts.length > 1 ? `${parts[parts.length - 2].slice(0, 2)}-${parts[parts.length - 1]}` : parts[0];
    for (const setup of SETUPS) {
      errors.length = 0;
      const problems = [];
      try {
        await send('Emulation.setDeviceMetricsOverride', { width: setup.width, height: setup.height, deviceScaleFactor: setup.scale || 1, mobile: !!setup.mobile });
        await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: setup.reduce ? 'reduce' : 'no-preference' }] });
        let onLoad;
        const loaded = new Promise(resolve => {
          onLoad = msg => { if (msg.method === 'Page.loadEventFired') resolve(); };
          listeners.add(onLoad);
        });
        await send('Page.navigate', { url: `${BASE}/${page}` });
        try { await withTimeout(loaded, LOAD_TIMEOUT); } catch { problems.push(`page did not finish loading within ${LOAD_TIMEOUT / 1000} s`); }
        listeners.delete(onLoad);
        await sleep(2000);
        const result = await evaluate(CHECK);
        problems.push(...result.problems);
        if (result.kind === 'once' && result.loop !== null && !setup.reduce && !result.loop) {
          problems.push('did not start playing on arrival (Loop is off)');
        }
        // Under reduced motion Loop and Slow motion must be shown switched off and unable to be switched on.
        if (setup.reduce) {
          for (const s of result.switches) {
            if (s.checked) problems.push(`${s.name} is on under reduced motion`);
            else if (!s.disabled) problems.push(`${s.name} can be switched on under reduced motion`);
          }
        }
        const shot = await send('Page.captureScreenshot', { format: 'png' });
        writeFileSync(join(OUT, `${name}-${setup.name}.png`), Buffer.from(shot.data, 'base64'));
        if (setup.full) {
          const { cssContentSize } = await send('Page.getLayoutMetrics');
          const full = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
            clip: { x: 0, y: 0, width: setup.width, height: Math.ceil(cssContentSize.height), scale: 1 } });
          writeFileSync(join(OUT, `${name}-${setup.name}-full.png`), Buffer.from(full.data, 'base64'));
        }
        if (setup.moves && !setup.reduce && result.kind === 'once') problems.push(...await movementProblems());
      } catch (err) {
        problems.push(`check failed: ${err.message}`);
      }
      problems.push(...errors.map(e => 'console: ' + e));
      if (problems.length) failures++;
      console.log(`${problems.length ? 'FAIL' : 'ok  '} ${name} ${setup.name}${problems.length ? ' — ' + problems.join('; ') : ''}`);
    }
  }
  console.log(`Screenshots: ${OUT}`);
} catch (err) {
  console.error(err.message);
  failures++;
} finally {
  if (ws) ws.close();
  chrome.kill();
  await Promise.race([chromeExited, sleep(5000)]);
  removeProfile();
}
process.exit(failures ? 1 : 0);
