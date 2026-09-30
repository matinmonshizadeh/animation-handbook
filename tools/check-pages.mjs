#!/usr/bin/env node
// Browser check for guided-steps demo pages: a development tool, not part of the site.
// Needs the local Chrome and a static server for the repo (python -m http.server 8731 --bind 127.0.0.1).
// Usage: node tools/check-pages.mjs [--base http://127.0.0.1:8731] [--out <folder>] <page or category folder>...
//   e.g. node tools/check-pages.mjs animations/02-entrance-and-exit
// A folder with no index.html of its own stands for the page folders inside it. Each page is loaded at six screen
// setups and prints one line for each (ok or FAIL); problems are printed and screenshots saved, by default into
// a folder of its own in the temp folder, whose path is printed. Console warnings count as problems too (the page
// script warns about settings that have no label or value). On plays-once pages the desktop run also checks that
// Replay and a setting change visibly move the stage; on loop pages it checks that the stage moves, that Pause stops
// it and Play starts it again (twice over), and the reduced-motion run checks that the loop starts paused. On do-it
// pages every press of Show me is recorded from the start of the document: the desktop run checks that the page pressed
// it exactly once on arrival and waits for that run to end, the reduced-motion run checks that it pressed it not at
// all; both then check that the stage is at rest, that pressing Show me visibly moves it, that the run brings it
// back to rest and that a real click inside the stage reaches the page as hb:input. On scroll pages the desktop and
// reduced-motion runs check that the visitor can scroll the box (overflow-y auto or scroll), that the box scrolls by itself
// on arrival (not under reduced motion), that Play scrolls it, that Back to top, pressed while Play runs, returns it to the top and
// stops it, that on a scroller with CSS scroll snapping the snapping is off while Play runs and back once the run is
// stopped, and that a real wheel turn stops Play (over the stage beside an inner scroller, where there is room there,
// so the stage-wide stop is tried too). The 320px phone runs the page checks (overflow, small targets, chips, README)
// and takes screenshots, and nothing more.
// Without --out every run writes into a new hb-check-<date>-<time>-<process id> folder (--out picks another one).
// Nothing is emptied or removed, so runs going on at the same time, in other lanes or terminals, never wipe each
// other's screenshots. The temporary Chrome profile (hb-chrome-* in the temp folder) is removed when the run ends, trying
// again for up to 10 s while Chrome lets go of its files; one that stays is named in the output.
// Exit code 1 on any problem.
import { execFileSync, spawn } from 'node:child_process';
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
// A run without --out gets a folder of its own (start time and process id), so runs going on at the same time never
// share one.
const stamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
const OUT = givenOut || join(tmpdir(), `hb-check-${stamp}-${process.pid}`);
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
mkdirSync(OUT, { recursive: true });
console.log(`Screenshots go to ${OUT}`);

const SETUPS = [
  { name: 'desktop', width: 1280, height: 800, full: true, moves: true },
  { name: 'laptop', width: 1366, height: 657 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'phone', width: 375, height: 812, mobile: true, scale: 2 },
  { name: 'phone-reduced', width: 375, height: 812, mobile: true, scale: 2, reduce: true },
  { name: 'phone-small', width: 320, height: 640, mobile: true, scale: 2 }
];

// Runs inside the page. Returns the page kind, the Loop switch state, the player switches and the problems found.
const CHECK = `(() => {
  const r = el => el.getBoundingClientRect();
  const phone = innerWidth <= 600;
  const problems = [];
  if (!document.querySelector('.hb-page')) problems.push('not a guided-steps page');
  // Measured against clientWidth: under mobile emulation the browser widens innerWidth to fit overflowing content.
  if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1) problems.push('horizontal overflow');
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

// Runs at the start of every document, before the page's own scripts: records each press of a Show me button, whether it
// came from the visitor or from the page script, so the press on arrival can be counted exactly whatever the run's length,
// and the type of every hb:input the shared script sends, so a real click inside the stage can be seen to reach the page.
const RECORD = `(() => {
  window.__hbShowMe = [];
  window.__hbInput = [];
  document.addEventListener('click', e => {
    if (e.target.closest && e.target.closest('[data-hb-demo]')) window.__hbShowMe.push({ trusted: e.isTrusted });
  }, true);
  document.addEventListener('hb:input', e => window.__hbInput.push(e.detail && e.detail.type));
})()`;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const withTimeout = (promise, ms) => Promise.race([promise, sleep(ms).then(() => { throw new Error('timeout'); })]);

const profile = mkdtempSync(join(tmpdir(), 'hb-chrome-'));
// Chrome's helper processes can outlive the browser process with files of the profile open (on a busy machine even a killed
// Chrome can need several seconds to let go), and on Windows a folder with an open file in it cannot be removed. rmSync fails
// at once there (its maxRetries and retryDelay do not apply), so the removal is tried again every 200 ms for up to 10 s, and
// a folder that stays is named.
async function removeProfile() {
  const end = Date.now() + 10000;
  for (;;) {
    try { rmSync(profile, { recursive: true, force: true }); return; }
    catch { if (Date.now() >= end) break; }
    await sleep(200);
  }
  console.error(`Could not remove the temporary Chrome profile: ${profile}`);
}
// chrome.kill() ends the browser process only. On Windows its helper processes (renderers, the crash handler) then live on
// for a long while on a busy machine, so the whole tree is ended (while the browser process is still there to name it).
function stopChrome() {
  if (process.platform === 'win32' && chrome.pid && chrome.exitCode === null) {
    try { execFileSync('taskkill', ['/PID', String(chrome.pid), '/T', '/F'], { stdio: 'ignore', timeout: 10000 }); return; } catch {}
  }
  chrome.kill();
}
// Port 0: Chrome picks a free port and writes it into DevToolsActivePort in its profile folder,
// so a Chrome left over from an earlier run can never be picked up by mistake.
// No LCD text: text that gets its own layer during a transition (even one that does not move it) would
// otherwise be drawn with different antialiasing, and the stage comparisons would see a change nobody can see.
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--disable-lcd-text',
  '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
const chromeExited = new Promise(resolve => chrome.once('exit', resolve));
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

// True when the stage shows something different from its first capture within ms milliseconds.
async function stageChanges(ms) {
  const first = await stageShot();
  for (const end = Date.now() + ms; Date.now() < end;) {
    await sleep(200);
    if (await stageShot() !== first) return true;
  }
  return false;
}

// Loop pages: the stage keeps changing, holds still at once after Pause and moves again after Play. Under reduced
// motion the loop starts paused and Play still starts it. With data-hb-slowmo="css", Slow motion must slow every
// animation on the stage and turning it off must restore the speed.
async function loopProblems(reduced) {
  if (!(await evaluate(`!!document.querySelector('[data-hb-pause]')`))) return ['no Pause button to check'];
  const state = () => evaluate(`document.querySelector('[data-hb-pause]').getAttribute('data-state')`);
  const press = () => evaluate(`document.querySelector('[data-hb-pause]').click()`);
  const problems = [];
  if (reduced) {
    if (await state() !== 'paused') problems.push('the loop does not start paused under reduced motion');
    else if (await stageChanges(4000)) problems.push('the stage moves while paused under reduced motion');
    await press();
    if (!(await stageChanges(4000))) problems.push('Play does not start the loop under reduced motion');
    return problems;
  }
  if (!(await stageChanges(4000))) return ['the loop is not moving'];
  await press();
  await sleep(300);
  if (await stageChanges(4000)) problems.push('Pause does not stop the stage');
  await press();
  if (!(await stageChanges(4000))) problems.push('Play does not start the stage again');
  await press();
  await sleep(300);
  if (await stageChanges(4000)) problems.push('a second Pause does not stop the stage');
  await press();
  if (!(await stageChanges(4000))) problems.push('a second Play does not start the stage again');
  if (await evaluate(`!!document.querySelector('[data-hb-slowmo="css"]')`)) {
    const rates = () => evaluate(`new Promise(done => requestAnimationFrame(() => done(document.querySelector('.hb-page .stage').getAnimations({ subtree: true }).map(a => a.playbackRate))))`);
    const toggle = () => evaluate(`document.querySelector('[data-hb-slowmo]').click()`);
    await toggle();
    await sleep(200);
    const slow = await rates();
    if (!slow.length || slow.some(r => r >= 1)) problems.push('Slow motion does not slow the stage');
    await toggle();
    await sleep(200);
    if ((await rates()).some(r => r !== 1)) problems.push('turning Slow motion off does not restore the speed');
  }
  return problems;
}

// True when two stage captures (base64 PNG) show the same picture. After a full-page capture, headless Chrome can leave
// a couple of faint stale pixels at the edge of something that scaled up and came back (two pixels, 26 of 765 apart, were
// seen); a real leftover differs in far more pixels and far more strongly. So pixels that differ by 64 or less (summed
// over red, green and blue) do not count, and neither do the first few that differ more.
async function samePicture(a, b) {
  if (a === b) return true;
  return evaluate(`new Promise(done => {
    const load = src => new Promise(resolve => { const img = new Image(); img.onload = () => resolve(img); img.src = 'data:image/png;base64,' + src; });
    Promise.all([load(${JSON.stringify(a)}), load(${JSON.stringify(b)})]).then(([x, y]) => {
      if (x.width !== y.width || x.height !== y.height) { done(false); return; }
      const read = img => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0); return g.getImageData(0, 0, c.width, c.height).data; };
      const p = read(x), q = read(y);
      let visible = 0;
      for (let i = 0; i < p.length; i += 4) if (Math.abs(p[i] - q[i]) + Math.abs(p[i + 1] - q[i + 1]) + Math.abs(p[i + 2] - q[i + 2]) > 64) visible++;
      done(visible <= Math.max(8, Math.round(x.width * x.height / 10000)));
    });
  })`);
}

// Do-it pages: the page presses Show me once by itself on arrival and not at all under reduced motion (the presses are
// recorded from the start of the document, so this holds for a run of any length). Show me runs on arrival, so the
// desktop check first waits for that run to end. The stage must then be at rest, Show me must visibly move it, and the run
// must bring it back to rest. The first capture after the press comes straight after it (under reduced motion the stage
// changes at once and goes back after a hold of about 1.2 s, which a busy machine can let pass before a capture that
// waited first); more follow every 200 ms for 1.6 s.
async function demoProblems(reduced) {
  if (!(await evaluate(`!!document.querySelector('[data-hb-demo]')`))) return ['no Show me button to check'];
  const problems = [];
  const presses = await evaluate(`(window.__hbShowMe || []).length`);
  if (reduced && presses) problems.push('Show me is pressed on arrival under reduced motion');
  if (!reduced && presses !== 1) problems.push(presses ? `Show me is pressed ${presses} times on arrival, not once` : 'Show me is not pressed on arrival');
  if (!reduced) await sleep(5000);
  if (await stageChanges(reduced ? 1500 : 800)) {
    problems.push(reduced ? 'the stage moves by itself under reduced motion' : 'the stage is not at rest after the run on arrival (it keeps moving by itself)');
    return problems;
  }
  const rest = await stageShot();
  await evaluate(`document.querySelector('[data-hb-demo]').click()`);
  let moved = false;
  for (let i = 0; i < 9 && !moved; i++) { if (i) await sleep(200); moved = (await stageShot()) !== rest; }
  if (!moved) { problems.push('Show me does not visibly move the stage'); return problems; }
  let back = false;
  for (let i = 0; i < 32 && !back; i++) { await sleep(250); back = await samePicture(await stageShot(), rest); }
  if (!back) problems.push('the run does not bring the stage back to rest');
  // A real click inside the stage reaches the page as hb:input. A press sends one for the press first; an activation that
  // comes with no pointer or key event (assistive technology) sends only the one for the click.
  const spot = await evaluate(`(() => { const r = document.querySelector('.hb-page .stage').getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + Math.min(r.height, innerHeight - r.top) / 2 }; })()`);
  const heardBefore = await evaluate(`window.__hbInput.length`);
  for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: spot.x, y: spot.y, button: 'left', clickCount: 1 });
  await sleep(100);
  const heard = await evaluate(`window.__hbInput.slice(${heardBefore})`);
  if (!heard.includes('click')) problems.push(`a click inside the stage does not reach the page as hb:input (heard: ${heard.join(', ') || 'nothing'})`);
  return problems;
}

// Scroll pages: the box scrolls by itself on arrival (not under reduced motion); Play scrolls it; Back to top, pressed
// while Play runs, returns it to the top and stops it (at 0 half a second later and still at 0 a little over a second
// later, so both the jump and the stop are seen whatever the arrival did); on a scroller with CSS scroll snapping the
// snapping is off 300 ms into Play and back once the run has been stopped; a real wheel turn stops Play. The wheel goes
// to the stage beside an inner scroller where there is room there (the stage-wide stop), else to the box, and the box is
// read once it has settled: a snapping box glides to its snap point after the turn.
async function scrollProblems(reduced) {
  const box = `(document.querySelector('[data-hb-scroller]') || document.querySelector('.hb-page .stage'))`;
  const pos = () => evaluate(`${box}.scrollTop`);
  const snap = () => evaluate(`getComputedStyle(${box}).scrollSnapType`);
  const press = selector => evaluate(`document.querySelector('${selector}').click()`);
  const problems = [];
  // The visitor must be able to scroll the box. The shared default is overflow:hidden, which the script can still scroll, so
  // every check below would pass on a box nobody can scroll by hand.
  const overflow = await evaluate(`getComputedStyle(${box}).overflowY`);
  if (overflow !== 'auto' && overflow !== 'scroll') problems.push(`the box cannot be scrolled by the visitor (overflow-y is ${overflow}, not auto or scroll)`);
  const startSnap = await snap(); // under reduced motion nothing has run yet: this is the page's own snap type
  const arrived = await pos();
  if (reduced && arrived > 0) problems.push('the box scrolls by itself under reduced motion');
  if (!reduced && arrived <= 0) problems.push('the box does not scroll by itself on arrival');
  await press('[data-hb-autoscroll]');
  await sleep(800);
  if (await pos() <= 0) problems.push('Play does not scroll the box');
  await press('[data-hb-top]');
  await sleep(500);
  const atTop = await pos() === 0;
  await sleep(600);
  if (!atTop || await pos() !== 0) problems.push('Back to top does not return the box to the top and stop it');
  // The page's own snap type: read before anything ran (reduced motion), else with the run stopped (a mark left behind
  // would show as "none" here, but the reduced-motion run sees it)
  const snaps = reduced ? startSnap : await snap();
  await press('[data-hb-autoscroll]');
  await sleep(300);
  if (snaps !== 'none' && await snap() !== 'none') problems.push('scroll snapping is not turned off while Play runs');
  await sleep(500);
  const spot = await evaluate(`(() => {
    const b = ${box}, s = document.querySelector('.hb-page .stage');
    if (b !== s) {
      const r = s.getBoundingClientRect(), x = r.left + 3, y = r.top + 3, hit = document.elementFromPoint(x, y);
      if (hit && s.contains(hit) && !b.contains(hit)) return { x, y };
    }
    const r = b.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + Math.min(r.height, innerHeight - r.top) / 2 };
  })()`);
  await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: spot.x, y: spot.y, deltaX: 0, deltaY: 40 });
  let held = await pos();
  for (let i = 0; i < 15; i++) { await sleep(100); const next = await pos(); if (next === held) break; held = next; }
  await sleep(600);
  if (await pos() !== held) problems.push('turning the wheel does not stop Play');
  else if (snaps !== 'none' && await snap() !== snaps) problems.push('scroll snapping does not come back when the wheel stops Play');
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
  await send('Page.addScriptToEvaluateOnNewDocument', { source: RECORD });

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
        if (result.kind === 'loop' && (setup.moves || setup.reduce)) problems.push(...await loopProblems(!!setup.reduce));
        if (result.kind === 'do' && (setup.moves || setup.reduce)) problems.push(...await demoProblems(!!setup.reduce));
        if (result.kind === 'scroll' && (setup.moves || setup.reduce)) problems.push(...await scrollProblems(!!setup.reduce));
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
  stopChrome();
  await Promise.race([chromeExited, sleep(5000)]);
  await removeProfile();
}
process.exit(failures ? 1 : 0);
