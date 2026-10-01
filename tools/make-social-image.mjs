#!/usr/bin/env node
// Draws og-image.png, the picture that social sites show for every page and the README shows at its top: the top of the
// light home page (the "N free animations" pill, the question, the search box and the nine place tiles) at 1200×630.
// A development tool, not part of the site. Needs the local Chrome and a static server for the repo
// (python -m http.server 8731 --bind 127.0.0.1).
// Usage: node tools/make-social-image.mjs [--base http://127.0.0.1:8731] [--out og-image.png]
// Run it again when the picture would change: a new animation changes the count in the pill.
// The page is laid out 1080 pixels wide and drawn at 1200/1080 of its size, so its words stay readable when a social site
// shows the picture small. For the picture only, the line under the question, the Popular suggestions and the counts under
// the tiles are left out (so the tiles fit with room under them), the question is drawn at its full size and the GitHub
// button shows no star count (the request for it is blocked: a number in the picture would soon be out of date). Every
// animation is stopped at the same moment of its loop, so every run draws the same picture.
// The temporary Chrome profile (hb-social-* in the temp folder) is removed when the run ends, trying again for up to 10 s
// while Chrome lets go of its files; one that stays is named in the output. Exit code 1 on any problem.
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);
function option(name, fallback) {
  const i = args.indexOf(name);
  if (i < 0) return fallback;
  const value = args[i + 1];
  args.splice(i, 2);
  return value;
}
const BASE = (option('--base', 'http://127.0.0.1:8731') || '').replace(/\/$/, '');
const OUT = resolve(option('--out', join(ROOT, 'og-image.png')) || '');
if (args.length || !BASE) {
  console.error('Usage: node tools/make-social-image.mjs [--base http://127.0.0.1:8731] [--out og-image.png]');
  process.exit(2);
}

const WIDTH = 1200, HEIGHT = 630; // the picture, as the home page's og:image:width and og:image:height say
const LAYOUT = 1080, LAYOUT_HEIGHT = HEIGHT * LAYOUT / WIDTH; // the size the page is laid out at: 1080×567
const SCALE = WIDTH / LAYOUT;
// The moment every animation is stopped at, in ms from the start of its loop: the Buttons tile shows its press ring,
// the Menus & forms tile three lines and the Page intros tile its whole page.
const MOMENT = 6240;
// For the picture only (see the top of this file). Two floating shapes sat beside the lines that are left out; they move
// up beside the search box.
const PICTURE_CSS = `
.home-hero .sub, .home-hero .pop, .pl-count, .gh-c:empty { display: none }
.home-hero { padding-top: 32px }
.h1 { font-size: 64px }
.fl3 { top: 206px }
.fl6 { top: 222px }`;

const sleep = ms => new Promise(done => setTimeout(done, ms));
const withTimeout = (promise, ms, what) => Promise.race([promise, sleep(ms).then(() => { throw new Error(`${what} took longer than ${ms / 1000} s`); })]);

const profile = mkdtempSync(join(tmpdir(), 'hb-social-'));
// Chrome's helper processes can keep files of the profile open for a while after the browser process ends, and on Windows a
// folder with an open file in it cannot be removed, so the removal is tried again every 200 ms for up to 10 s.
async function removeProfile() {
  const end = Date.now() + 10000;
  let why;
  for (;;) {
    try { rmSync(profile, { recursive: true, force: true }); return; }
    catch (err) { why = err.code || err.message; if (Date.now() >= end) break; }
    await sleep(200);
  }
  console.error(`Could not remove the temporary Chrome profile: ${profile} (${why})`);
}
// As in tools/check-pages.mjs: chrome.kill() ends the browser process only, so on Windows its helper processes are ended too,
// picked by this run's own profile folder in their command line (passed through the environment, so no quoting can go wrong).
function stopChrome() {
  chrome.kill();
  if (process.platform !== 'win32') return;
  try {
    execFileSync('powershell', ['-NoProfile', '-NonInteractive', '-Command',
      `Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.CommandLine -and $env:HB_PROFILE -and $_.CommandLine.Contains($env:HB_PROFILE) } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }`],
      { stdio: 'ignore', timeout: 20000, windowsHide: true, env: { ...process.env, HB_PROFILE: profile } });
  } catch {}
}
// Port 0: Chrome picks a free port and writes it into DevToolsActivePort in its profile folder. The sRGB color profile keeps
// the colors the same on every machine.
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-color-profile=srgb',
  '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
const chromeExited = new Promise(done => chrome.once('exit', done));
chrome.once('error', async err => {
  console.error(`Could not start Chrome at ${CHROME} (${err.message}). Set CHROME to its path.`);
  await removeProfile();
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
  return new Promise((done, fail) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) { fail(new Error(`${method}: Chrome is not connected`)); return; }
    const id = ++nextId;
    pending.set(id, msg => (msg.error ? fail(new Error(`${method}: ${msg.error.message}`)) : done(msg.result)));
    ws.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const { result, exceptionDetails } = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (exceptionDetails) throw new Error(exceptionDetails.exception?.description || exceptionDetails.text);
  return result.value;
}

// Runs in the page once it has loaded: waits for the site font, adds the picture's styles, stops every animation at MOMENT
// and reports what the picture will show.
const PREPARE = `(async () => {
  const frames = n => new Promise(done => { const tick = () => (--n ? requestAnimationFrame(tick) : done()); requestAnimationFrame(tick); });
  await document.fonts.ready;
  const style = document.createElement('style');
  style.textContent = ${JSON.stringify(PICTURE_CSS)};
  document.head.append(style);
  await frames(2);
  for (const a of document.getAnimations()) { a.pause(); a.currentTime = ${MOMENT}; }
  await frames(2);
  const tiles = [...document.querySelectorAll('#places .place')];
  return {
    theme: document.documentElement.dataset.theme,
    font: document.fonts.check('800 64px "Schibsted Grotesk"'),
    pill: (document.querySelector('.home-hero .pill') || {}).textContent || '',
    tiles: tiles.length,
    bottom: Math.max(...tiles.map(t => t.getBoundingClientRect().bottom)),
    height: innerHeight
  };
})()`;

let failed = false;
try {
  ws = new WebSocket(await pageSocket());
  await new Promise((done, fail) => {
    ws.addEventListener('open', done, { once: true });
    ws.addEventListener('error', () => fail(new Error('Could not connect to Chrome')), { once: true });
  });
  ws.addEventListener('message', event => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); } else listeners.forEach(fn => fn(msg));
  });
  await send('Page.enable');
  await send('Network.enable');
  await send('Network.setBlockedURLs', { urls: ['*://api.github.com/*'] });
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.setItem('ah-theme', 'light'); } catch (e) {}` });
  await send('Emulation.setDeviceMetricsOverride', { width: LAYOUT, height: LAYOUT_HEIGHT, deviceScaleFactor: SCALE, mobile: false });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'light' }, { name: 'prefers-reduced-motion', value: 'no-preference' }] });
  let onLoad;
  const loaded = new Promise(done => { onLoad = msg => { if (msg.method === 'Page.loadEventFired') done(); }; listeners.add(onLoad); });
  const nav = await send('Page.navigate', { url: `${BASE}/` });
  if (nav.errorText) throw new Error(`Could not open ${BASE}/ (${nav.errorText}). Is the repo served there?`);
  await withTimeout(loaded, 20000, 'Loading the home page');
  listeners.delete(onLoad);
  const page = await withTimeout(evaluate(PREPARE), 20000, 'Preparing the page');
  const problems = [];
  if (page.theme !== 'light') problems.push(`the page is in the ${page.theme} theme, not the light one`);
  if (!page.font) problems.push('the site font did not load');
  if (!/^\d+ free animations/.test(page.pill.trim())) problems.push(`the pill reads "${page.pill.trim()}"`);
  if (page.tiles !== 9) problems.push(`${page.tiles} place tiles, not 9`);
  else if (page.bottom > page.height - 8) problems.push(`the tiles end at ${Math.round(page.bottom)} of ${page.height} pixels: they do not fit`);
  if (problems.length) throw new Error(`Not drawn: ${problems.join('; ')}`);
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: LAYOUT, height: LAYOUT_HEIGHT, scale: 1 } });
  const png = Buffer.from(shot.data, 'base64');
  const size = { width: png.readUInt32BE(16), height: png.readUInt32BE(20) }; // from the PNG's header
  if (size.width !== WIDTH || size.height !== HEIGHT) throw new Error(`Chrome drew ${size.width}×${size.height}, not ${WIDTH}×${HEIGHT}`);
  writeFileSync(OUT, png);
  console.log(`Wrote ${OUT}: ${WIDTH}×${HEIGHT}, ${Math.round(png.length / 1024)} KB, the pill reads "${page.pill.trim()}"`);
} catch (err) {
  console.error(err.message);
  failed = true;
} finally {
  if (ws) ws.close();
  stopChrome();
  await Promise.race([chromeExited, sleep(5000)]);
  await removeProfile();
}
process.exit(failed ? 1 : 0);
