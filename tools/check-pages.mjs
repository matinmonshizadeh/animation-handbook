#!/usr/bin/env node
// Browser check for guided-steps demo pages: a development tool, not part of the site.
// Needs the local Chrome and a static server for the repo (python -m http.server 8731 --bind 127.0.0.1).
// Usage: node tools/check-pages.mjs [--base http://127.0.0.1:8731] [--out <folder>] <page or category folder, or home>...
//   e.g. node tools/check-pages.mjs animations/02-entrance-and-exit
//   node tools/check-pages.mjs home   checks the home page at the same six setups: overflow, small targets on phones,
//   the search box and the place tiles on the first screen, the tile counts and the eight Start cards. The desktop run
//   also tries the tiles, the search and Show all and compares Copy prompt with every page's own; the phone run tries a
//   tile, the slim bar and long words; the reduced-motion run checks that nothing moves.
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
// again for up to 10 s while Chrome lets go of its files; one that stays is named in the output. Ctrl+C, or an error thrown
// outside the run, does the same before the exit.
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
const pages = args.map(p => (p === 'home' ? p : p.replace(/\\/g, '/').replace(/^\.?\//, '').replace(/\/?(index\.html)?$/, '/')))
  .flatMap(p => {
    if (p === 'home' || isPage(p) || !existsSync(join(ROOT, p))) return [p];
    const inside = readdirSync(join(ROOT, p), { withFileTypes: true })
      .filter(d => d.isDirectory() && isPage(p + d.name)).map(d => `${p}${d.name}/`).sort();
    return inside.length ? inside : [p];
  });
if (!pages.length) {
  console.error('Usage: node tools/check-pages.mjs [--base URL] [--out DIR] <page or category folder, or home>...');
  process.exit(2);
}
mkdirSync(OUT, { recursive: true });
console.log(`Screenshots go to ${OUT}`);

const SETUPS = [
  { name: 'desktop', width: 1280, height: 800, full: true, moves: true, firstScreen: true },
  { name: 'laptop', width: 1366, height: 657 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'phone', width: 375, height: 812, mobile: true, scale: 2, firstScreen: true },
  { name: 'phone-reduced', width: 375, height: 812, mobile: true, scale: 2, reduce: true, firstScreen: true },
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
      .map(el => el.tagName.toLowerCase() + (el.getAttribute('class') ? '.' + el.getAttribute('class').split(' ')[0] : '') + ' ' + Math.round(r(el).width) + 'x' + Math.round(r(el).height));
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

// Runs inside the home page. Returns the problems found: overflow, small targets on phones, the search box and the first
// row of place tiles on the first screen (the setups marked firstScreen: 1280×800 and 375×812), the tile counts, and the eight
// Start cards. A missing search box or place tile is a problem of its own, so the first-screen tests never skip silently.
const homeCheck = firstScreen => `(() => {
  const r = el => el.getBoundingClientRect();
  const phone = innerWidth <= 600;
  const problems = [];
  if (!document.getElementById('places')) problems.push('not the new home page');
  if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1) problems.push('horizontal overflow');
  if (phone) {
    const small = [...document.querySelectorAll('.top a, .top button, .search button, #q, #q2, .pop button, .place, .card .copy, .pillbtn, .bigbtn, .pinbar button, .foot a')]
      .filter(el => el.getClientRects().length)
      .filter(el => { const b = r(el); return b.width < 44 || b.height < 44; })
      .map(el => el.tagName.toLowerCase() + (el.getAttribute('class') ? '.' + el.getAttribute('class').split(' ')[0] : '') + ' ' + Math.round(r(el).width) + 'x' + Math.round(r(el).height));
    if (small.length) problems.push('small targets: ' + small.join(', '));
  }
  const search = document.querySelector('.search'), tile = document.querySelector('.place');
  if (!search) problems.push('no search box');
  else if (${firstScreen} && r(search).bottom > innerHeight) problems.push('search box below the first screen');
  if (!tile) problems.push('no place tiles');
  else if (${firstScreen} && r(tile).bottom > innerHeight) problems.push('place tiles below the first screen');
  const counts = [...document.querySelectorAll('.pl-count')].map(el => el.textContent.trim());
  if (counts.length !== 9 || counts.some(t => !/^[1-9]\\d* animations?$/.test(t))) problems.push('tile counts: ' + counts.join(' | '));
  const cards = document.querySelectorAll('#cards .card').length;
  if (cards !== 8) problems.push('Start shows ' + cards + ' cards, not 8');
  return { problems };
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

// Runs at the start of every document when the run checks the home page: stores a GitHub star count in the home page's own
// format, with a fresh time, so the page shows it and never asks api.github.com. That request depends on the network and on
// GitHub's limit (60 an hour per address, and every run starts with an empty profile), and Chrome logs a failed one as a
// console error, which would fail every setup. The four digits give the button the width of a well-known repository's count.
const STARS = `(() => {
  try { localStorage.setItem('gh-star-count', JSON.stringify({ count: 1234, ts: Date.now() })); } catch {}
})()`;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const withTimeout = (promise, ms) => Promise.race([promise, sleep(ms).then(() => { throw new Error('timeout'); })]);

const profile = mkdtempSync(join(tmpdir(), 'hb-chrome-'));
// Chrome's helper processes can outlive the browser process with files of the profile open (on a busy machine even a killed
// Chrome can need several seconds to let go), and on Windows a folder with an open file in it cannot be removed. rmSync fails
// at once there (its maxRetries and retryDelay do not apply), so the removal is tried again every 200 ms for up to 10 s, and
// a folder that stays is named, with the error the last try gave.
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
// chrome.kill() ends the browser process only. Its helper processes (renderers, the GPU and utility processes, the crash
// handler) then live on for a long while on a busy machine, so on Windows they are ended too, picked by this run's own profile
// folder in their command line (its name has a random part). Not by walking the process tree from Chrome's PID, as taskkill /T
// does: a process keeps the PID of a parent that died long ago and PIDs are reused, so that walk can reach unrelated processes.
// The folder goes to the script through the environment, so no quoting can go wrong.
function stopChrome() {
  chrome.kill();
  if (process.platform !== 'win32') return;
  try {
    execFileSync('powershell', ['-NoProfile', '-NonInteractive', '-Command',
      `Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.CommandLine -and $env:HB_PROFILE -and $_.CommandLine.Contains($env:HB_PROFILE) } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }`],
      { stdio: 'ignore', timeout: 20000, windowsHide: true, env: { ...process.env, HB_PROFILE: profile } });
  } catch {}
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
let aborting = false; // set by abort() below: the run stops where it is and only the cleanup goes on
const pending = new Map();
const listeners = new Set();
// The console errors and warnings of the setup being checked, and the loads that failed: each one fails the setup.
const errors = [];
function send(method, params = {}) {
  if (aborting) return new Promise(() => {});
  return new Promise((resolve, reject) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) { reject(new Error(`${method}: Chrome is not connected`)); return; }
    const id = ++nextId;
    pending.set(id, msg => (msg.error ? reject(new Error(`${method}: ${msg.error.message}`)) : resolve(msg.result)));
    ws.send(JSON.stringify({ id, method, params }));
  });
}
function failPending(reason) {
  if (aborting) return;
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

// Presses the Copy prompt button of the card at index the way a visitor does: scrolled into view, the pointer moved onto it with
// no button held, then a real mouse press and release at its center (btn.click() would pass even with the card's stretched link
// laid over the button). Returns what covers the button at its center, if anything, and then presses nothing (a press on the
// link would leave the page).
async function pressCopyButton(index) {
  const spot = await evaluate(`(() => {
    const btn = document.querySelectorAll('#cards .card .copy')[${index}];
    btn.scrollIntoView({ block: 'center' });
    const b = btn.getBoundingClientRect(), x = b.left + b.width / 2, y = b.top + b.height / 2, hit = document.elementFromPoint(x, y);
    const covered = btn.contains(hit) ? '' : hit ? hit.tagName.toLowerCase() + (hit.getAttribute('class') ? '.' + hit.getAttribute('class').split(' ')[0] : '') : 'nothing';
    return { x, y, covered };
  })()`);
  if (spot.covered) return spot.covered;
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: spot.x, y: spot.y, button: 'none' });
  for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: spot.x, y: spot.y, button: 'left', clickCount: 1 });
  return '';
}

// Home page, desktop run: the Copy prompt button, pressed for real, puts a page's text on the clipboard and says so (the
// clipboard is stubbed: a headless run cannot grant it); when the clipboard refuses, it says "Open to copy" and its name says
// which animation; then, for every page, the home page's text equals what the page's own Copy prompt gives before any change.
// Leaves the home page.
async function homeCopyProblems() {
  const problems = [];
  await evaluate(`(() => {
    window.__clipboardGot = null;
    navigator.clipboard.write = async items => { window.__clipboardGot = await (await items[0].getType('text/plain')).text(); };
    navigator.clipboard.writeText = async text => { window.__clipboardGot = text; };
  })()`);
  const covered = await pressCopyButton(0);
  if (covered) problems.push(`Copy prompt button is covered by ${covered} at its center`);
  else {
    const wiring = await evaluate(`(async () => {
      for (let i = 0; i < 60 && window.__clipboardGot === null; i++) await new Promise(r => setTimeout(r, 50));
      await new Promise(r => setTimeout(r, 50));
      const btn = document.querySelector('#cards .card .copy'), url = btn.closest('.card').querySelector('.title a').getAttribute('href');
      return { same: window.__clipboardGot === await promptFor(url), label: btn.textContent.trim(), toast: document.getElementById('toast').classList.contains('show') };
    })()`);
    if (!wiring.same || wiring.label !== 'Copied' || !wiring.toast) problems.push(`Copy prompt button: ${JSON.stringify(wiring)}`);
  }
  // Second pass, on the second card: the browser refuses the clipboard. The button offers to open the page, and its name starts
  // with what it shows and says which animation it belongs to.
  await evaluate(`(() => {
    const refuse = async () => { throw new DOMException('denied', 'NotAllowedError'); };
    navigator.clipboard.write = refuse;
    navigator.clipboard.writeText = refuse;
  })()`);
  const coveredAgain = await pressCopyButton(1);
  if (coveredAgain) problems.push(`Copy prompt button of the second card is covered by ${coveredAgain} at its center`);
  else {
    const refused = await evaluate(`(async () => {
      const btn = document.querySelectorAll('#cards .card .copy')[1];
      for (let i = 0; i < 60 && btn.textContent.trim() === 'Copy prompt'; i++) await new Promise(r => setTimeout(r, 50));
      return { label: btn.textContent.trim(), name: btn.getAttribute('aria-label') || '', animation: btn.closest('.card').querySelector('.title a').textContent.trim() };
    })()`);
    if (refused.label !== 'Open to copy' || !refused.name.startsWith(refused.label) || !refused.name.includes(refused.animation)) {
      problems.push(`Copy prompt with the clipboard refused: ${JSON.stringify(refused)} (expected "Open to copy" and a name that starts with it and names the animation)`);
    }
  }
  // Every page's text as the home page gives it, read six at a time: Python's stock server refuses connections when many
  // arrive together. A read that fails with a network error (fetch rejects with a TypeError when no answer comes back) is
  // tried once more, a moment later; an HTTP error is not. When that second try works, the failed load Chrome logged for the
  // first one is taken out of the console errors.
  const items = await evaluate(`(async () => {
    const items = [];
    let next = 0;
    const read = async url => {
      try { return { url, text: await promptFor(url) }; }
      catch (err) {
        if (!(err instanceof TypeError)) return { url, text: 'ERROR ' + err.message };
        await new Promise(r => setTimeout(r, 300));
        const again = await promptFor(url).then(text => ({ text }), e => ({ text: 'ERROR ' + e.message }));
        return { url, ...again, retried: new URL(url, location.href).href };
      }
    };
    const reader = async () => { while (next < ALL.length) { const i = next++; items[i] = await read(ALL[i].url); } };
    await Promise.all(Array.from({ length: 6 }, reader));
    return items;
  })()`);
  for (const { text, retried } of items) {
    if (!retried || text.startsWith('ERROR ')) continue;
    const logged = errors.findIndex(e => e.startsWith('Failed to load resource: net::') && e.endsWith(' ' + retried));
    if (logged >= 0) errors.splice(logged, 1);
  }
  for (const { url, text } of items) {
    let onLoad;
    const loaded = new Promise(resolve => { onLoad = msg => { if (msg.method === 'Page.loadEventFired') resolve(); }; listeners.add(onLoad); });
    await send('Page.navigate', { url: `${BASE}/${url}` });
    try { await withTimeout(loaded, LOAD_TIMEOUT); } catch { problems.push(`${url} did not load`); }
    listeners.delete(onLoad);
    const own = await evaluate(`DemoPage.pageCopyText(document, window)`);
    if (own !== text) problems.push(`Copy prompt text differs for ${url}${text.startsWith('ERROR ') ? ` (${text})` : ''}`);
  }
  return problems;
}

// Home page, desktop run: a tile press shows that place, presses that tile (and no other) and changes the address, Show
// all shows the rest, Back returns to the start, a plain sentence finds the right animations, a typed word finds the other
// forms of its word and one letter already finds cards, typing only replaces the address (spaces as %20), a word with no
// match says so, All animations lists every card under its seven headings with the card titles a level below them, Browse
// all pressed there adds no history step, an address opened directly shows its view, "/" puts keyboard focus in the search
// box and Escape on the empty box keeps the picked place, and the old ?q= and ?cat= links still work. Keyboard focus is not
// dropped or left behind when a pressed button hides or the page scrolls away: Show all puts it on the first new card;
// Clear, a suggestion in the Nothing-found panel, Browse all (the button and the link) and Back after Show all put it on
// the results heading. A tile pressed while a search box keeps focus (a tap on iOS leaves it there) empties both boxes.
// Leaves the home page on ?cat=micro-interactions.
async function homeViewProblems() {
  const problems = [];
  const view = () => evaluate(`({ title: document.getElementById('results-title').textContent, cards: document.querySelectorAll('#cards .card').length,
    groups: document.querySelectorAll('#cards .group').length, more: document.getElementById('more').hidden ? '' : document.getElementById('more-label').textContent,
    search: location.search, pressed: [...document.querySelectorAll('#places .place[aria-pressed="true"]')].map(b => b.dataset.place).join() })`);
  const type = text => evaluate(`(() => { const q = document.getElementById('q'); q.value = ${JSON.stringify(text)}; q.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  // The cards a search shows, its results line, and whether it says that nothing matches.
  const results = () => evaluate(`({ names: [...document.querySelectorAll('#cards .card .title a')].map(a => a.textContent),
    sub: document.getElementById('results-sub').textContent, none: !document.getElementById('empty').hidden })`);
  // Where keyboard focus is: an id, "card link N" for a card's title link, or the tag name.
  const focused = () => evaluate(`(() => { const a = document.activeElement, links = [...document.querySelectorAll('#cards .card .title a')];
    return a.id || (links.includes(a) ? 'card link ' + (links.indexOf(a) + 1) : a.tagName.toLowerCase()); })()`);
  // A press as the keyboard makes it: the control has focus, then it is activated.
  const press = selector => evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); el.focus(); el.click(); })()`);
  // A real key press, which goes to whatever has keyboard focus.
  const key = async (name, code, keyCode, text) => {
    await send('Input.dispatchKeyEvent', { type: text ? 'keyDown' : 'rawKeyDown', key: name, code, text, windowsVirtualKeyCode: keyCode });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: name, code, windowsVirtualKeyCode: keyCode });
  };
  // Opens an address as a new visit would.
  const load = async query => {
    let onLoad;
    const loaded = new Promise(resolve => { onLoad = msg => { if (msg.method === 'Page.loadEventFired') resolve(); }; listeners.add(onLoad); });
    await send('Page.navigate', { url: `${BASE}/${query}` });
    try { await withTimeout(loaded, LOAD_TIMEOUT); } catch { problems.push(`${query} did not load`); }
    listeners.delete(onLoad);
    await sleep(300);
  };
  await evaluate(`document.querySelector('.place[data-place="btn"]').click()`);
  await sleep(300);
  let v = await view();
  if (v.title !== 'Buttons' || v.cards !== 8 || v.more !== 'Show all 15' || v.search !== '?place=buttons' || v.pressed !== 'btn') problems.push(`Buttons tile: ${JSON.stringify(v)}`);
  await press('#more-btn');
  await sleep(300);
  v = await view();
  if (v.cards !== 15 || v.more !== '' || v.search !== '?place=buttons&all=1') problems.push(`Show all: ${JSON.stringify(v)}`);
  let on = await focused();
  if (on !== 'card link 9') problems.push(`Show all: keyboard focus is on ${on}, not on the ninth card's link`);
  await evaluate(`history.back()`);
  await sleep(500);
  v = await view();
  if (v.title !== 'Good places to start' || v.cards !== 8 || v.search !== '' || v.pressed !== '') problems.push(`Back: ${JSON.stringify(v)}`);
  on = await focused();
  if (on !== 'results-title') problems.push(`Back after Show all: keyboard focus is on ${on}, not on the results heading`);
  await evaluate(`document.querySelector('.place[data-place="text"]').click()`);
  await sleep(300);
  await press('#clear-view');
  await sleep(300);
  v = await view();
  on = await focused();
  if (v.title !== 'Good places to start' || v.cards !== 8 || on !== 'results-title') problems.push(`Clear: ${JSON.stringify(v)}, keyboard focus is on ${on}`);
  await evaluate(`document.getElementById('q').focus()`);
  await type('fade');
  await sleep(300);
  await evaluate(`document.querySelector('.place[data-place="text"]').click()`);
  await sleep(300);
  v = await view();
  const boxes = await evaluate(`[document.getElementById('q').value, document.getElementById('q2').value]`);
  if (v.title !== 'Text' || v.pressed !== 'text' || boxes.join('') !== '') problems.push(`Text tile pressed while the search box has focus: ${JSON.stringify(v)}, the boxes hold ${JSON.stringify(boxes)}`);
  await type('a button that bounces when clicked');
  await sleep(300);
  const found = await evaluate(`[...document.querySelectorAll('#cards .card .title a')].map(a => a.textContent)`);
  if (found[0] !== 'Click / Tap Ripple' || !found.slice(0, 4).includes('Bounce In')) problems.push(`search order: ${found.slice(0, 5).join(', ')}`);
  if ((v = await view()).pressed) problems.push(`search: a tile stays pressed: ${JSON.stringify(v)}`);
  // Word endings: "snapping" and "blurred" find their short forms, "ring" is not cut down to "r" (Ambient Ripple Effect
  // says "Rings"), "scrolling" finds as many as "scroll", and the first letter typed already finds cards.
  for (const [word, name] of [['snapping', 'Snap Scrolling'], ['blurred', 'Blur In'], ['ring', 'Ambient Ripple Effect']]) {
    await type(word);
    await sleep(300);
    const got = await results();
    if (!got.names.includes(name)) problems.push(`search "${word}" does not find ${name}: ${got.none ? 'nothing matches' : got.names.join(', ')}`);
  }
  await type('scroll');
  await sleep(300);
  const scroll = (await results()).sub;
  await type('scrolling');
  await sleep(300);
  const scrolling = (await results()).sub;
  if (scrolling !== scroll) problems.push(`search "scrolling": ${scrolling}, "scroll": ${scroll}`);
  await type('b');
  await sleep(300);
  const letter = await results();
  if (letter.none || !letter.names.length) problems.push(`search "b": ${letter.none ? 'nothing matches' : 'no cards'}`);
  const steps = await evaluate(`history.length`);
  await type('fade in');
  await sleep(300);
  const address = await evaluate(`({ search: location.search, steps: history.length })`);
  if (address.search !== '?q=fade%20in' || address.steps !== steps) problems.push(`typing "fade in": the address is ${address.search}${address.steps !== steps ? ' and a history step was added' : ''}`);
  await type('zebra');
  await sleep(300);
  const empty = await evaluate(`!document.getElementById('empty').hidden && document.getElementById('empty-title').textContent`);
  if (empty !== 'Nothing matches “zebra” yet') problems.push(`nothing found: ${empty}`);
  await press('#empty [data-q]');
  await sleep(300);
  v = await view();
  on = await focused();
  if (!v.title.startsWith('Results for') || v.cards === 0 || on !== 'results-title') problems.push(`Nothing-found suggestion: ${JSON.stringify(v)}, keyboard focus is on ${on}`);
  await type('zebra');
  await sleep(300);
  await press('#more-btn');
  await sleep(500);
  v = await view();
  on = await focused();
  if (v.title !== 'All animations' || on !== 'results-title') problems.push(`Browse all button: ${JSON.stringify(v)}, keyboard focus is on ${on}`);
  const stepsBefore = await evaluate(`history.length`);
  await press('#nav-all');
  await sleep(500);
  const all = await evaluate(`({ groups: document.querySelectorAll('#cards .group').length, cards: document.querySelectorAll('#cards .card').length, search: location.search,
    steps: history.length, level4: document.querySelectorAll('#cards .card .title[aria-level="4"]').length, named: document.querySelectorAll('#cards .group[aria-labelledby]').length,
    pressed: document.querySelectorAll('#places .place[aria-pressed="true"]').length })`);
  if (all.groups !== 7 || all.cards !== 129 || all.search !== '?view=all' || all.pressed) problems.push(`All animations: ${JSON.stringify(all)}`);
  if (all.steps !== stepsBefore) problems.push('Browse all pressed in All animations adds a history step');
  if (all.level4 !== 129 || all.named) problems.push(`All animations: ${all.level4} card titles at level 4, not 129, and ${all.named} group sections named, not 0`);
  on = await focused();
  if (on !== 'results-title') problems.push(`Browse all link: keyboard focus is on ${on}, not on the results heading`);
  await type('fade');
  await sleep(300);
  const levels = await evaluate(`document.querySelectorAll('#cards .card .title[aria-level]').length`);
  if (levels) problems.push(`search after All animations: ${levels} card titles keep a level`);
  // An address opened directly shows its view. There "/" puts keyboard focus in the search box, and Escape on the empty
  // box only leaves the box: the place and its address stay.
  await load('?place=buttons');
  v = await view();
  if (v.title !== 'Buttons' || v.cards !== 8 || v.more !== 'Show all 15' || v.pressed !== 'btn') problems.push(`?place=buttons: ${JSON.stringify(v)}`);
  await key('/', 'Slash', 191, '/');
  await sleep(100);
  on = await focused();
  if (on !== 'q') problems.push(`"/": keyboard focus is on ${on}, not in the search box`);
  await key('Escape', 'Escape', 27);
  await sleep(300);
  v = await view();
  on = await focused();
  if (v.title !== 'Buttons' || v.search !== '?place=buttons' || v.pressed !== 'btn' || on === 'q') problems.push(`Escape in the empty search box: ${JSON.stringify(v)}, keyboard focus is on ${on}`);
  for (const [query, want] of [['?view=all', { title: 'All animations', groups: 7, cards: 129, pressed: '' }], ['?place=buttons&all=1', { title: 'Buttons', cards: 15, more: '', pressed: 'btn' }]]) {
    await load(query);
    v = await view();
    if (Object.keys(want).some(k => v[k] !== want[k])) problems.push(`${query}: ${JSON.stringify(v)}`);
  }
  // Old links keep working: ?q= opens the search, ?cat= opens All animations at that category's heading.
  for (const [query, want] of [['?q=fade', 'Results for “fade”'], ['?cat=micro-interactions', 'All animations']]) {
    await load(query);
    const got = await evaluate(`({ title: document.getElementById('results-title').textContent,
      top: (() => { const g = document.getElementById('cat-micro-interactions'); return g ? Math.round(g.getBoundingClientRect().top) : null; })() })`);
    if (got.title !== want) problems.push(`${query}: heading "${got.title}"`);
    if (query.startsWith('?cat=') && (got.top === null || Math.abs(got.top - 12) > 24)) problems.push(`${query}: the category heading is at ${got.top}px, not at the top`);
  }
  return problems;
}

// Home page, phone run: a tile press scrolls to the results, and the slim bar sticks to the top with that place pressed.
// There, and again in All animations, every control in the bar, on the cards and under them is at least 44×44 and nothing
// overflows sideways. Emptying the bar's own search box keeps the bar, and the focus in the box, until the box is left. A
// chip pressed again goes away with the bar, so keyboard focus moves to the results heading. The back arrow goes away too
// and scrolls to the top, so keyboard focus moves to the first place tile, which is on screen there.
async function homePhoneProblems() {
  const now = () => evaluate(`(() => { const a = document.activeElement;
    return { title: document.getElementById('results-title').textContent, focus: a.id || (a.matches('.place') ? 'tile ' + a.dataset.place : a.tagName.toLowerCase()),
      shown: getComputedStyle(document.getElementById('pinbar')).display !== 'none', scrolled: Math.round(scrollY) }; })()`);
  const press = selector => evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); el.focus(); el.click(); })()`);
  const typeInBar = text => evaluate(`(() => { const box = document.getElementById('q2'); box.value = ${JSON.stringify(text)}; box.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  // Every visible button, link and field in the bar, on the cards and under them is at least 44×44, and nothing overflows
  // sideways. A card's title link is stretched over its whole card (an absolutely placed ::after), so it counts as the card.
  const fit = where => evaluate(`(() => {
    const r = el => el.getBoundingClientRect();
    const stretched = el => { const after = getComputedStyle(el, '::after');
      return el.tagName === 'A' && el.offsetParent && after.content !== 'none' && after.display !== 'none' && after.position === 'absolute'
        && ['top', 'right', 'bottom', 'left'].every(side => after[side] === '0px'); };
    const small = [...document.querySelectorAll('#pinbar :is(button, a, input), #cards :is(button, a, input), #more :is(button, a, input)')]
      .filter(el => el.getClientRects().length)
      .map(el => [el, r(stretched(el) ? el.offsetParent : el)])
      .filter(([, b]) => b.width < 44 || b.height < 44)
      .map(([el, b]) => (el.id || el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '')) + ' ' + Math.round(b.width) + 'x' + Math.round(b.height));
    const found = [];
    if (small.length) found.push('small targets: ' + small.slice(0, 6).join(', ') + (small.length > 6 ? ' and ' + (small.length - 6) + ' more' : ''));
    if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1) found.push('horizontal overflow');
    return found;
  })()`).then(found => found.map(p => `phone, ${where}: ${p}`));
  await evaluate(`document.querySelector('.place[data-place="text"]').click()`);
  await sleep(900);
  const v = await evaluate(`(() => { const bar = document.getElementById('pinbar');
    return { title: document.getElementById('results-title').textContent, shown: getComputedStyle(bar).display !== 'none',
      top: Math.round(bar.getBoundingClientRect().top), pressed: [...bar.querySelectorAll('[aria-pressed="true"]')].map(b => b.textContent) }; })()`);
  const problems = v.title === 'Text' && v.shown && Math.abs(v.top) <= 1 && v.pressed.join() === 'Text' ? [] : [`phone, Text tile: ${JSON.stringify(v)}`];
  problems.push(...await fit('Text'));
  // This headless Chrome never has its page in focus, so a script's focus() and blur() send no focus events, and the bar
  // listens for one (leaving its box). The page counts as focused for the rest of this run, as it does for a visitor.
  await send('Emulation.setFocusEmulationEnabled', { enabled: true });
  try {
    await evaluate(`document.getElementById('q2').focus()`);
    await typeInBar('fade');
    await sleep(200);
    await typeInBar('');
    await sleep(200);
    let b = await now();
    if (b.title !== 'Good places to start' || !b.shown || b.focus !== 'q2') problems.push(`phone, search box in the bar emptied: ${JSON.stringify(b)}`);
    await evaluate(`document.getElementById('q2').blur()`);
    await sleep(200);
    b = await now();
    if (b.shown) problems.push(`phone, the bar stays after its emptied search box is left: ${JSON.stringify(b)}`);
    await evaluate(`document.querySelector('.place[data-place="text"]').click()`);
    await sleep(900);
    await press('.pchip[data-place="text"]');
    await sleep(300);
    b = await now();
    if (b.title !== 'Good places to start' || b.shown || b.focus !== 'results-title') problems.push(`phone, pressed chip pressed again: ${JSON.stringify(b)}`);
    await evaluate(`document.querySelector('.place[data-place="text"]').click()`);
    await sleep(900);
    await press('#pin-back');
    await sleep(1300);
    b = await now();
    if (b.title !== 'Good places to start' || b.shown || b.focus !== 'tile btn' || b.scrolled > 1) problems.push(`phone, back arrow: ${JSON.stringify(b)}`);
    await press('#more-btn');
    await sleep(900);
    b = await now();
    if (b.title !== 'All animations' || !b.shown) problems.push(`phone, Browse all: ${JSON.stringify(b)}`);
    problems.push(...await fit('All animations'));
  } finally {
    await send('Emulation.setFocusEmulationEnabled', { enabled: false });
  }
  return problems;
}

// The end of the run, done once: after the last page, after Ctrl+C and after an error outside the main flow.
let cleaning = null;
function cleanUp() {
  cleaning ??= (async () => {
    if (ws) ws.close();
    stopChrome();
    await Promise.race([chromeExited, sleep(5000)]);
    await removeProfile();
  })();
  return cleaning;
}
// Ctrl+C (or a closed terminal) and an error thrown outside the main flow, in a socket listener for one, skip the finally
// below and would leave Chrome running and the profile unnamed. So the run stops where it is (send() no longer answers, which
// keeps the pages still to come from failing one after the other), the same cleanup runs, and the exit code is 1.
async function abort(what) {
  aborting = true;
  console.error(what);
  await cleanUp().catch(() => {});
  process.exit(1);
}
for (const signal of ['SIGINT', 'SIGTERM', 'SIGBREAK', 'SIGHUP']) process.on(signal, () => abort(`Interrupted (${signal}).`));
process.on('uncaughtException', err => abort(err?.stack || String(err)));

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
  if (pages.includes('home')) await send('Page.addScriptToEvaluateOnNewDocument', { source: STARS });

  for (const page of pages) {
    const parts = page.replace(/\/$/, '').split('/');
    const home = page === 'home';
    const name = home ? 'home' : parts.length > 1 ? `${parts[parts.length - 2].slice(0, 2)}-${parts[parts.length - 1]}` : parts[0];
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
        await send('Page.navigate', { url: home ? `${BASE}/` : `${BASE}/${page}` });
        try { await withTimeout(loaded, LOAD_TIMEOUT); } catch { problems.push(`page did not finish loading within ${LOAD_TIMEOUT / 1000} s`); }
        listeners.delete(onLoad);
        await sleep(2000);
        const result = await evaluate(home ? homeCheck(!!setup.firstScreen) : CHECK);
        problems.push(...result.problems);
        if (!home) {
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
        }
        const shot = await send('Page.captureScreenshot', { format: 'png' });
        writeFileSync(join(OUT, `${name}-${setup.name}.png`), Buffer.from(shot.data, 'base64'));
        if (setup.full) {
          const { cssContentSize } = await send('Page.getLayoutMetrics');
          const full = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
            clip: { x: 0, y: 0, width: setup.width, height: Math.ceil(cssContentSize.height), scale: 1 } });
          writeFileSync(join(OUT, `${name}-${setup.name}-full.png`), Buffer.from(full.data, 'base64'));
        }
        if (!home) {
          if (setup.moves && !setup.reduce && result.kind === 'once') problems.push(...await movementProblems());
          if (result.kind === 'loop' && (setup.moves || setup.reduce)) problems.push(...await loopProblems(!!setup.reduce));
          if (result.kind === 'do' && (setup.moves || setup.reduce)) problems.push(...await demoProblems(!!setup.reduce));
          if (result.kind === 'scroll' && (setup.moves || setup.reduce)) problems.push(...await scrollProblems(!!setup.reduce));
        }
        if (home) {
          if (setup.moves) problems.push(...await homeViewProblems());
          if (setup.name === 'phone') problems.push(...await homePhoneProblems());
          if (setup.moves) problems.push(...await homeCopyProblems());
        }
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
  await cleanUp();
}
process.exit(failures ? 1 : 0);
