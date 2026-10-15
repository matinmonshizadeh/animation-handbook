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
// so the stage-wide stop is tried too). The 320px phone runs the page checks (overflow, small targets, chips, README),
// takes screenshots and, on a page with the mode switch, tries the modes (below), and nothing more.
// A page with the mode switch (Normal, See inside, Compare): at every setup each mode marks the stage, shows its own note
// (one that is on show: rendered, not clipped away) and no other (Normal shows none) and overflows nothing, a mode change
// moves neither the page nor the keyboard focus (the pressed button itself may take it), and the box keeps its size and the
// player bar its place under it (a stage that grows with its text, hb-grow, aside). In each mode the labels and half names
// (data-hb-caption) on show must be inside the stage, at least 12px as drawn, clear of each other and at most six (four on
// phones); no id may be used twice (a copy that kept one); a control in the stage named with aria-label must say its visible
// words (text hidden from screen readers, see-through, hidden, clipped away or on a face turned away is not counted); and where
// the page names its picture (an aria-label on the stage, or on its canvas or picture, a copy aside), each mode must name it
// differently. A plays-once page is tried with Loop off and a do-it page from rest (Reset where it has one). On both, except
// under reduced motion, a press of See inside or Compare plays the demo once (the shared script presses Replay or Show me), and
// the check waits for that run to end (no timer of the page set for 6 s or less still waiting, no animation on the stage running
// apart from endless ones; up to 30 s, and at once where the press starts no run) and then for the stage to rest before it looks.
// Only setTimeout timers and animations are seen: a move driven by a frame loop or by setInterval shows only as a stage that
// changes, so on these two kinds rest also needs the timers and animations to be quiet (a run that moves by a frame loop and then
// holds on a timer is waited out), and only a pause of 750 ms or more made inside a frame loop or a setInterval loop (TIMERS
// counts setTimeout timers only), with no setTimeout timer waiting, would pass for rest. The stage is at rest when it has not
// changed for 750 ms (the mode check first lets go of keyboard focus left in the stage, whose caret or focus effect would keep
// it changing); every animation in it that never ends (a blinking caret, a loader) is held at its first frame while rest is
// judged and the rest pictures and mode screenshots are taken, except under reduced motion, where every mode must be still. The
// whole Watch step (its heading, the switch, the stage, the player bar and the notes) is saved as a screenshot of See inside and
// of Compare (Normal's is the setup's own screenshot); a
// mode button the page lacks is named. At the desktop and reduced-motion setups, with the stage at rest (a scroll page with its
// box at the middle of its range, a loop paused), the box does not scroll either (read before the run a press starts, which may
// scroll it), See inside and Compare must each change the stage and differ from each other, Normal must bring the first
// picture back, and on a scroll page Play must keep scrolling through a mode change. Each mode's screenshot is taken after
// that mode's own picture checks, by scrolling the page until the step shows and taking it with plain clips (in parts, joined,
// where it is taller than the window), so the window is not resized and no scroll box moves: the Normal check that follows sees
// the page as it was. Chrome's capture beyond the viewport, which resizes the window for a moment and sends every scroll box to
// the top (a page can redraw itself for that), is only the last resort for a step that cannot be made to show. Either way each of
// those two screenshots must show the stage as it was seen at rest in that mode (the stage is cut out of it and compared, and the
// screenshot taken again, after putting the box back, up to three more times if it differs). A stage that never comes to rest is
// a problem of its own, and nothing is compared with a frame taken in mid-movement.
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
    const small = [...document.querySelectorAll('.hb-bar a, .hb-page button, .hb-page summary, .hb-page select, .hb-page input[type=range], .hb-page .hb-text, label.hb-toggle, label.hb-switch-row, .hb-foot a, .hb-star-row a, .hb-rel')]
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

// Runs at the start of every document, before the page's own scripts: keeps count of the page's timers that are still waiting
// (those set for 6 s or less: a longer one is not part of a run), so the mode check can tell when a run has ended.
const TIMERS = `(() => {
  const waiting = new Set(), set = window.setTimeout, clear = window.clearTimeout, clearI = window.clearInterval;
  window.setTimeout = function (fn, ms, ...rest) {
    if (typeof fn !== 'function') return set.apply(window, arguments);
    const id = set.call(window, function () { waiting.delete(id); return fn.apply(this, arguments); }, ms, ...rest);
    if (!(ms > 6000)) waiting.add(id);
    return id;
  };
  window.clearTimeout = function (id) { waiting.delete(id); return clear.call(window, id); };
  window.clearInterval = function (id) { waiting.delete(id); return clearI.call(window, id); };
  window.__hbWaiting = () => waiting.size;
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
// Whether a mouse event has been sent since the page was loaded. Until one has, the page has no pointer in it, and in headless Chrome
// it does not count as focused either (a focus ring a script gives an element stays hidden).
let pointerSent = false;
function send(method, params = {}) {
  if (aborting) return new Promise(() => {});
  if (method === 'Page.navigate') pointerSent = false;
  if (method === 'Input.dispatchMouseEvent') pointerSent = true;
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

// Animations in the stage that never end (iterations Infinity: a blinking caret, a loader) would keep the stage from ever coming
// to rest, and two pictures of the same moment would differ by where they happen to be. While the check judges rest and takes its
// rest pictures and the mode screenshots, holdEndless() pauses each one that runs at its first frame (each call also takes any
// that started since the last), and releaseEndless() puts each back where it was and lets it run on (one the page has dropped
// meanwhile is left alone). A loop the page has paused is not touched, and waitForRun never counts such an animation as a run.
// Nothing is held under reduced motion: there every mode must be a still picture, so an endless movement that is still running
// is a stage that never comes to rest. A held CSS animation no longer follows the page's own animation-play-state (its CSS pause)
// for the rest of that page load; nothing later in the check needs it to (loopProblems runs before the modes, and each setup
// loads the page again).
const holdEndless = () => evaluate(`(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const stage = document.querySelector('.hb-page .stage'), held = window.__hbHeld || (window.__hbHeld = []);
  for (const a of document.getAnimations()) {
    const t = a.effect && a.effect.target;
    if (a.playState !== 'running' || !t || !stage.contains(t) || a.effect.getComputedTiming().iterations !== Infinity) continue;
    held.push({ a, time: a.currentTime });
    a.pause();
    a.currentTime = 0;
  }
})()`);
const releaseEndless = () => evaluate(`(() => {
  for (const { a, time } of window.__hbHeld || []) if (a.playState === 'paused') { a.currentTime = time; a.play(); }
  window.__hbHeld = [];
})()`);
// The stage as stageShot takes it, with the animations that never end held as for a rest picture, so that comparing it with
// one shows only a real change.
async function heldShot() {
  try {
    await holdEndless();
    return await stageShot();
  } finally {
    await releaseEndless();
  }
}

// The stage once it has come to rest: after waiting `wait` ms, captures 250 ms apart until the picture has stayed the same for
// 750 ms (four captures in a row), with the animations that never end held (see holdEndless), for up to 10 s. With calm (rest
// judged after a run), a capture counts towards rest only while runCalm also holds (no timer waiting, no animation running): a run
// that moves by a frame loop and then holds still on a timer, as Page Curl's turn does, looks at rest during that hold. Such a run
// is waited out for up to 30 s, as waitForRun waits. still says whether the stage came to rest; when it did not, shot is only the
// last frame of a movement that goes on and is not worth comparing with anything.
async function restShot(wait = 0, { calm = false } = {}) {
  if (wait) await sleep(wait);
  try {
    await holdEndless();
    let shot = await stageShot(), same = 0;
    for (const end = Date.now() + (calm ? 30000 : 10000); Date.now() < end;) {
      await sleep(250);
      await holdEndless();
      const next = await stageShot();
      if (next !== shot || (calm && !(await runCalm()))) { shot = next; same = 0; continue; }
      if (++same === 3) return { shot, still: true };
    }
    return { shot, still: false };
  } finally {
    await releaseEndless();
  }
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
  const settled = (await restShot(3000)).shot;
  await evaluate(`document.querySelector('[data-hb-replay]').click()`);
  await sleep(120);
  if (await heldShot() === settled) problems.push('Replay does not visibly move the stage');
  const settledAgain = (await restShot(3000)).shot;
  const clicked = await evaluate(`(() => {
    const choice = [...document.querySelectorAll('.hb-try .seg button')]
      .find(b => b.getAttribute('aria-pressed') !== 'true' && b.getClientRects().length);
    if (choice) choice.click();
    return !!choice;
  })()`);
  if (clicked) {
    await sleep(370);
    if (await heldShot() === settledAgain) problems.push('changing a setting does not replay the stage');
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

// What a scroll page moves: its own scroller where it has one, else the stage.
const BOX = `(document.querySelector('[data-hb-scroller]') || document.querySelector('.hb-page .stage'))`;

// The Watch step (its heading, the switch, the stage, the player bar and the notes) as one PNG (base64), with where the stage sits
// in it (CSS pixels from its top left corner) and the device pixel ratio. The page is scrolled until the step shows below the
// pinned top bar, and it is taken with plain clips, as the stage's own pictures are: the window is not resized and no scroll box
// moves, so the page is not redrawn. A step taller than the window is taken in parts that never cut the stage, and the parts are
// joined. The page is scrolled back afterwards. Chrome's capture beyond the viewport is only the last resort, for a step that
// cannot be made to show: it resizes the window for a moment and sends every scroll box back to the top, and the page can
// redraw itself for that, so the stage in the picture is not always the stage that was checked.
async function watchStepShot() {
  const g = await evaluate(`(() => {
    const step = document.querySelector('.hb-watch') || document.querySelector('.hb-page .stage'), stage = document.querySelector('.hb-page .stage');
    const bar = document.querySelector('.hb-bar'), s = step.getBoundingClientRect(), t = stage.getBoundingClientRect();
    return { x: s.left + scrollX, y: s.top + scrollY, width: s.width, height: s.height, at: { x: t.left - s.left, y: t.top - s.top }, stageHeight: t.height,
      bar: bar && ['sticky', 'fixed'].includes(getComputedStyle(bar).position) ? Math.ceil(bar.getBoundingClientRect().height) : 0,
      scroll: { x: scrollX, y: scrollY }, ratio: devicePixelRatio, view: innerHeight };
  })()`);
  // A clip starts at the device pixel nearest its origin and is cut down to whole CSS pixels in size. So the step is cut from a
  // top edge on the device pixel grid, in whole CSS pixels, and the parts join with no gap and no overlap.
  const left = Math.floor(g.x * g.ratio) / g.ratio, top = Math.floor(g.y * g.ratio) / g.ratio;
  const width = Math.ceil(g.x + g.width - left), height = Math.ceil(g.y + g.height - top);
  // The parts: the step cut above and below the stage, each cut piece no taller than what shows below the bar, and neighbors
  // joined while they still fit.
  const room = g.view - g.bar - 1;
  const above = Math.max(0, Math.floor(g.y + g.at.y - top));
  const below = Math.min(height, Math.ceil(g.y + g.at.y + g.stageHeight - top));
  const cuts = [0, above, below, height], parts = [];
  for (let i = 1; i < cuts.length; i++) {
    const n = Math.ceil((cuts[i] - cuts[i - 1]) / room);
    for (let k = 0; k < n; k++) {
      const edge = j => Math.round(cuts[i - 1] + (cuts[i] - cuts[i - 1]) * j / n);
      const last = parts[parts.length - 1];
      if (last && edge(k + 1) - last[0] <= room) last[1] = edge(k + 1); else parts.push([edge(k), edge(k + 1)]);
    }
  }
  const settle = `new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done)))`;
  const taken = [];
  if (below - above <= room) {
    for (const [a, b] of parts) {
      const at = await evaluate(`(async () => {
        scrollTo({ top: ${Math.max(0, Math.floor(top + a - g.bar))}, behavior: 'instant' });
        await ${settle};
        return scrollY;
      })()`);
      if (top + a - at < g.bar - 0.01 || top + b - at > g.view + 0.01) { taken.length = 0; break; }
      const data = (await send('Page.captureScreenshot', { format: 'png', clip: { x: left, y: top + a, width, height: b - a, scale: 1 } })).data;
      taken.push({ data, row: Math.round(a * g.ratio) });
    }
    await evaluate(`(async () => { scrollTo({ left: ${g.scroll.x}, top: ${g.scroll.y}, behavior: 'instant' }); await ${settle}; })()`);
  }
  if (!taken.length) {
    const beyond = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
      clip: { x: g.x, y: g.y, width: g.width, height: g.height, scale: 1 } });
    return { png: beyond.data, stage: g.at, ratio: g.ratio };
  }
  const stage = { x: g.x + g.at.x - left, y: g.y + g.at.y - top };
  if (taken.length === 1) return { png: taken[0].data, stage, ratio: g.ratio };
  const png = await evaluate(`new Promise(done => {
    const parts = ${JSON.stringify(taken)};
    const load = src => new Promise(resolve => { const img = new Image(); img.onload = () => resolve(img); img.src = 'data:image/png;base64,' + src; });
    Promise.all(parts.map(p => load(p.data))).then(images => {
      const c = document.createElement('canvas');
      c.width = images[0].width;
      c.height = Math.max(...images.map((img, i) => parts[i].row + img.height));
      const g = c.getContext('2d');
      images.forEach((img, i) => g.drawImage(img, 0, parts[i].row));
      done(c.toDataURL('image/png').split(',')[1]);
    });
  })`);
  return { png, stage, ratio: g.ratio };
}

// Whether the page shows no run going on: no timer of the page set for 6 s or less is waiting (TIMERS counts them) and no
// animation on the stage runs (one that never ends, such as a blinking caret, does not count).
const runCalm = () => evaluate(`(() => {
  const stage = document.querySelector('.hb-page .stage');
  const busy = document.getAnimations().some(a => {
    const t = a.effect && a.effect.target;
    return a.playState === 'running' && t && stage.contains(t) && a.effect.getComputedTiming().endTime !== Infinity;
  });
  return !busy && (window.__hbWaiting ? window.__hbWaiting() : 0) === 0;
})()`);

// After a press that may start a run (Replay or Show me, pressed by the shared script after a mode press, or Reset): waits until
// runCalm holds three looks in a row 100 ms apart, for up to 30 s: a run as long as Kinetic Typography's (about 16 s, 26 s at
// Slow) is waited out, and where no run starts the wait ends at once. A run often holds still on a timer between two moves, so a
// stage that has not changed for a while is not yet a run that has ended. A move made by a frame loop or by setInterval is not
// seen here: a run that starts with one looks over until its next timer is set, so the rest judgment that follows (restShot with
// calm) also waits while a timer waits or an animation runs. Only a pause made inside a frame loop or a setInterval loop (TIMERS
// counts setTimeout timers only), with no setTimeout timer waiting, would still pass for rest. Says whether the run ended.
async function waitForRun() {
  let quiet = 0;
  for (const end = Date.now() + 30000; Date.now() < end; await sleep(100)) {
    quiet = (await runCalm()) ? quiet + 1 : 0;
    if (quiet === 3) return true;
  }
  return false;
}

// The name the page gives its picture (the stage's aria-label, else its canvas's or picture's), or null where it gives none. A
// copy hidden from screen readers or inert (Compare's) is not the picture, even where it kept the name it was copied with.
const pictureName = () => evaluate(`(() => {
  const stage = document.querySelector('.hb-page .stage');
  const named = stage.hasAttribute('aria-label') ? stage : [...stage.querySelectorAll('canvas[aria-label], [role="img"][aria-label], svg[aria-label]')]
    .find(el => !el.closest('[aria-hidden="true"], [inert]'));
  return named ? named.getAttribute('aria-label') : null;
})()`);

// The labels and half names (data-hb-caption) of the mode on show: every one that is drawn must be inside the stage, at least
// 12px as drawn (its smallest text, scaled as it is drawn) and clear of the others, and there are at most six (four on phones).
// No id may be used twice on the page (a copy that kept one), and a control in the stage that is named with aria-label must say
// its visible words (only the words it shows: see shownText). label names the mode in each problem.
async function captionProblems(label) {
  const found = await evaluate(`(() => {
    const stage = document.querySelector('.hb-page .stage'), s = stage.getBoundingClientRect(), out = [];
    const drawn = el => el.getClientRects().length > 0 &&
      el.checkVisibility({ opacityProperty: true, visibilityProperty: true, checkOpacity: true, checkVisibilityCSS: true });
    const words = el => (el.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 40);
    const size = el => {
      const texts = [el, ...el.querySelectorAll('*')].filter(n => [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim()));
      return Math.min(...texts.map(n => {
        const r = n.getBoundingClientRect(), own = n instanceof SVGGraphicsElement ? n.getBBox().height : n.offsetHeight;
        return parseFloat(getComputedStyle(n).fontSize) * (own > 0 ? r.height / own : 1);
      }));
    };
    const caps = [...stage.querySelectorAll('[data-hb-caption]')].filter(drawn).map(el => ({ el, r: el.getBoundingClientRect() }));
    const most = innerWidth <= 600 ? 4 : 6;
    if (caps.length > most) out.push(caps.length + ' labels (at most ' + most + ' here)');
    for (const { el, r } of caps) {
      if (r.left < s.left - 1 || r.right > s.right + 1 || r.top < s.top - 1 || r.bottom > s.bottom + 1) out.push('the label "' + words(el) + '" is not inside the stage');
      const px = size(el);
      if (px < 11.95) out.push('the label "' + words(el) + '" is drawn at ' + px.toFixed(1) + 'px (at least 12px)');
    }
    for (let i = 0; i < caps.length; i++) for (let j = i + 1; j < caps.length; j++) {
      const a = caps[i], b = caps[j];
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      if (a.r.left < b.r.right - 1 && b.r.left < a.r.right - 1 && a.r.top < b.r.bottom - 1 && b.r.top < a.r.bottom - 1) out.push('the labels "' + words(a.el) + '" and "' + words(b.el) + '" overlap');
    }
    const ids = [...document.querySelectorAll('[id]')].map(e => e.id), twice = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
    if (twice.length) out.push('ids used twice: ' + twice.join(', '));
    const wordsOf = t => (t || '').toLowerCase().replace(/[^\\p{L}\\p{N}]+/gu, ' ').trim();
    // The words a control shows, parted where innerText parts them (at the edge of a block and at a line break), leaving out
    // every text that is not drawn: inside an aria-hidden="true" part, see-through (opacity 0, on it or on a part around it),
    // hidden (visibility), with no box at all (not rendered, or scaled down to nothing), clipped away, or on a face turned away.
    // Clipped away: only the part of a text inside every box around it (up to the stage) that clips what overflows it counts, on
    // the axes that box clips, and a part under 2px across is nothing, as a text kept for screen readers only is. Turned away: a
    // face with backface-visibility: hidden that the transform property, within its 3D context, turns over, as a flip card's back
    // is (clip-path and the rotate property are not worked out). So the closed cards a button holds out of sight (Dynamic Island)
    // or a second label waiting see-through (Copy to Clipboard's Copied!) are not its words.
    const shownText = c => {
      const blockOf = n => { for (let e = n.parentElement; e !== c; e = e.parentElement) if (!getComputedStyle(e).display.startsWith('inline')) return e; return c; };
      // A box clips only on an axis whose overflow is not visible (overflow-x: clip with overflow-y: visible clips sideways only).
      // Every such box around the text counts, even one that does not clip an absolutely placed part because that part's
      // containing block lies outside it (not worked out).
      const shownPart = (n, rects) => {
        let parts = rects.map(r => [r.left, r.top, r.right, r.bottom]);
        for (let e = n.parentElement; e; e = e === stage ? null : e.parentElement) {
          const st = getComputedStyle(e), cx = st.overflowX !== 'visible', cy = st.overflowY !== 'visible';
          if (!cx && !cy) continue;
          const b = e.getBoundingClientRect();
          parts = parts.map(([l, t, r, btm]) => [cx ? Math.max(l, b.left) : l, cy ? Math.max(t, b.top) : t, cx ? Math.min(r, b.right) : r, cy ? Math.min(btm, b.bottom) : btm]);
        }
        return parts.some(([l, t, r, b]) => r - l >= 2 && b - t >= 2);
      };
      const turnedAway = n => {
        for (let e = n.parentElement; e && e !== stage; e = e.parentElement) {
          if (getComputedStyle(e).backfaceVisibility !== 'hidden') continue;
          let m = new DOMMatrix();
          for (let f = e; ; f = f.parentElement) {
            const t = getComputedStyle(f).transform;
            if (t !== 'none') m = new DOMMatrix(t).multiply(m);
            if (!f.parentElement || getComputedStyle(f.parentElement).transformStyle !== 'preserve-3d') break;
          }
          if (m.m33 < 0) return true;
        }
        return false;
      };
      const walk = document.createTreeWalker(c, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
      let text = '', last = null;
      for (let n = walk.nextNode(); n; n = walk.nextNode()) {
        if (n.nodeType !== 3) { if (n.tagName === 'BR') text += ' '; continue; }
        const el = n.parentElement, range = document.createRange();
        range.selectNodeContents(n);
        const rects = [...range.getClientRects()].filter(r => r.width > 0 && r.height > 0);
        if (el.closest('[aria-hidden="true"]') || !el.checkVisibility({ opacityProperty: true, visibilityProperty: true, checkOpacity: true, checkVisibilityCSS: true })
          || !rects.length || !shownPart(n, rects) || turnedAway(n)) continue;
        const block = blockOf(n);
        text += (last && block !== last ? ' ' : '') + n.textContent;
        last = block;
      }
      return text;
    };
    for (const c of stage.querySelectorAll('button, a[href], input, select, textarea, [role="button"], [role="link"], [role="switch"], [role="checkbox"], [role="tab"]')) {
      if (!c.getClientRects().length || c.closest('[inert], [aria-hidden="true"]')) continue;
      // a form field's value is not its label; only an input button shows its words as its value
      const shown = c.matches('input[type="button"], input[type="submit"], input[type="reset"]') ? c.value : c.matches('input, select, textarea') ? '' : shownText(c);
      const own = wordsOf(c.getAttribute('aria-label')), seen = wordsOf(shown);
      if (own && seen && !own.includes(seen)) out.push('the control "' + shown.replace(/\\s+/g, ' ').trim().slice(0, 40) + '" is named "' + c.getAttribute('aria-label') + '", which leaves out its visible words');
    }
    return out;
  })()`);
  return found.map(p => `${label}: ${p}`);
}

// Pages with the mode switch: see the header comment. name and setup name the screenshots; kind is the page kind. The page is
// left in Normal and, on a plays-once page, with Loop off; at the desktop and reduced-motion setups a loop is also left paused
// and a scroll page with Play stopped and the box at the top.
async function modeProblems(name, setup, kind) {
  if (!(await evaluate(`!!document.querySelector('[data-hb-modes]')`))) return [];
  // An earlier check may have left the pointer over the stage, and the page is scrolled to take the screenshots, which would end
  // a hover in the middle of the checks. So where one was sent, the pointer goes to the corner first, and every picture is of the
  // stage without a hover. (Where none was sent the page has no pointer in it, and sending one would also make it focused.)
  if (pointerSent) await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0, button: 'none' });
  // That click (demoProblems makes a real one in the middle of the stage) can also leave keyboard focus in the stage, on a field
  // whose caret blinks or a canvas that draws a focus effect, and the stage would never come to rest. So focus in the stage is let
  // go of: blurred, and moved nowhere else.
  await evaluate(`(() => { const s = document.querySelector('.hb-page .stage'), a = document.activeElement; if (s && a && s.contains(a) && a.blur) a.blur(); })()`);
  const problems = [];
  const labels = { normal: 'Normal', inside: 'See inside', compare: 'Compare' };
  const missing = new Set();
  // Presses a mode's button and says whether the page has it. A page without it gets a problem of its own, said once, in place
  // of a later check that fails for no clear reason. Just before the press it notes where the page and the box are scrolled and
  // what has keyboard focus, for look() to compare with.
  const press = async mode => {
    const found = await evaluate(`(() => {
      const b = document.querySelector('.hb-modes [data-hb-mode="${mode}"]');
      if (!b) return false;
      const box = ${BOX};
      window.__hbBefore = { button: b, focus: document.activeElement, x: scrollX, y: scrollY, top: box ? box.scrollTop : 0 };
      // Where the box is once the page has drawn the mode (its own hb:mode listener came first) and before the run the shared
      // script then starts: look(true) reads the box from here.
      document.addEventListener('hb:mode', () => { window.__hbBefore.atMode = box ? box.scrollTop : 0; }, { once: true });
      b.click();
      return true;
    })()`);
    if (!found && !missing.has(mode)) { missing.add(mode); problems.push(`no ${labels[mode]} button`); }
    return found;
  };
  // What the page shows now: the mark on the stage, the notes on show (by the mode each belongs to; a note counts only when the
  // box around the notes is rendered, taller than 1px, not clipped away), any sideways overflow, the box's height and how far
  // below its top the player bar starts (and whether the box grows with its text, hb-grow), and what the last press changed: the
  // page's scroll, the box's scroll, and keyboard focus (named when it went anywhere but to the pressed button). With run (the
  // press may have started a run: Replay or Show me, pressed by the shared script), the box is read as it was when the page had
  // drawn the mode, before that run began, since a run may scroll its box (the Scroll it do-it pages do); without a hb:mode
  // heard, it is read now.
  const look = (run = false) => evaluate(`(() => {
    const was = window.__hbBefore, a = document.activeElement, wrap = document.querySelector('.hb-mode-notes'), box = ${BOX};
    const stage = document.querySelector('.hb-page .stage'), bar = document.querySelector('.hb-player'), s = stage.getBoundingClientRect();
    const name = el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.getAttribute('class') ? '.' + el.getAttribute('class').split(' ')[0] : '');
    const rendered = !!wrap && wrap.getBoundingClientRect().height > 1;
    return {
      mode: document.querySelector('.hb-page .stage').getAttribute('data-hb-mode'),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      notes: rendered ? [...wrap.querySelectorAll('[data-hb-for]:not([hidden])')].map(n => n.getAttribute('data-hb-for')) : [],
      stageH: Math.round(s.height),
      barTop: bar ? Math.round(bar.getBoundingClientRect().top - s.top) : null,
      grow: stage.classList.contains('hb-grow'),
      page: !!was && (scrollX !== was.x || scrollY !== was.y),
      box: !!was && !!box && Math.abs((${run} && was.atMode !== undefined ? was.atMode : box.scrollTop) - was.top) >= 1,
      focus: was && a && a !== was.focus && a !== was.button ? name(a) : ''
    };
  })()`);
  // Where the box was when the stage was seen at rest (null until then, and where the box is not at rest). settleBox() puts it
  // back when something has moved it, and gives the page a moment to redraw for it.
  let restTop = null;
  const settleBox = async () => {
    if (restTop === null) return;
    const moved = await evaluate(`(() => { const b = ${BOX}; if (!b || Math.abs(b.scrollTop - ${restTop}) < 1) return false; b.scrollTo({ top: ${restTop}, behavior: 'instant' }); return true; })()`);
    if (moved) await sleep(300);
  };
  // The whole Watch step saved as the screenshot of a mode (see watchStepShot). expected is the stage's picture seen at rest in
  // this mode (none at the lighter setups, where the stage may be moving): the stage cut out of the screenshot must be that
  // picture. If it is not, the box is put back, the page given a moment, and the screenshot taken again, up to three more times;
  // a screenshot that never shows the stage as it was seen is a problem of its own. With a picture to show, animations that never
  // end are held as they were for it (see holdEndless; never under reduced motion).
  const capture = async (mode, expected) => {
    let png = '', shows = !expected;
    try {
      for (let attempt = 0; attempt === 0 || (!shows && attempt < 4); attempt++) {
        if (attempt) await sleep(300);
        await settleBox();
        if (expected) await holdEndless();
        const got = await watchStepShot();
        png = got.png;
        if (expected) shows = await stageInShot(png, expected, got.stage, got.ratio);
      }
    } finally {
      await releaseEndless();
    }
    writeFileSync(join(OUT, `${name}-${setup.name}-${mode}.png`), Buffer.from(png, 'base64'));
    if (!shows) problems.push(`the ${labels[mode]} screenshot does not show the stage as checked`);
  };
  const deep = !!(setup.moves || setup.reduce);
  // A press of See inside or Compare on a plays-once or do-it page also plays the demo once (the shared script presses Replay or
  // Show me), except under reduced motion: at every setup the check then waits for that run to end and for the stage to rest.
  const runs = (kind === 'once' || kind === 'do') && !setup.reduce;
  // The pictures are compared at the deep setups, except for a scroll page with no Back to top button: its box cannot be
  // brought to the top, so nothing is compared there (the Play check below names the missing button).
  let pictures = deep;
  if (deep) {
    if (kind === 'scroll') pictures = await evaluate(`(() => { const t = document.querySelector('[data-hb-top]'); if (t) t.click(); return !!t; })()`);
    if (kind === 'loop') await evaluate(`(() => { const p = document.querySelector('[data-hb-pause]'); if (p && p.getAttribute('data-state') !== 'paused') p.click(); })()`);
  }
  // A plays-once page is tried with Loop off at every setup, so each play ends; a do-it page from rest, with Reset where it has
  // one. Whatever still runs then (the last play, the run on arrival, a result that goes back on a timer) is waited for.
  if (kind === 'once') await evaluate(`(() => { const l = document.querySelector('[data-hb-loop]'); if (l && l.checked) l.click(); })()`);
  if (kind === 'do') await evaluate(`(() => { const r = document.querySelector('[data-hb-reset]'); if (r) r.click(); })()`);
  // On those two kinds rest is judged as after a run (restShot with calm), unless the run never ended: the page's timers never
  // stop then, and waiting on them again would only say so again.
  const settles = kind === 'once' || kind === 'do';
  let ended = true;
  if (settles && !(ended = await waitForRun())) problems.push('the demo does not come to rest before the modes are tried (a timer or an animation of the page keeps going for 30 s)');
  // A scroll page is tried with its box at the middle of its range: there a scroll-driven effect shows something, a mode change
  // that sends the box back to the top or draws for the top is seen, and Compare shows its difference in the screenshot.
  if (pictures && kind === 'scroll') await evaluate(`(() => { const b = ${BOX}; b.scrollTo({ top: (b.scrollHeight - b.clientHeight) / 2, behavior: 'instant' }); })()`);
  // A press must not scroll the page or the box, or move keyboard focus (the box is only watched where it is at rest).
  const unmoved = (label, now) => {
    if (now.page) problems.push(`${label}: the page scrolled`);
    if (pictures && now.box) problems.push(`${label}: the box scrolled`);
    if (now.focus) problems.push(`${label}: keyboard focus moved to ${now.focus}`);
  };
  // The first picture is the stage at rest. A stage that never comes to rest is said so, and then no picture is compared with it.
  let first = null;
  if (pictures) {
    const rest = await restShot(0, { calm: settles && ended });
    if (rest.still) first = rest.shot;
    else problems.push('the stage does not come to rest before the modes are tried');
    restTop = await evaluate(`(() => { const b = ${BOX}; return b ? b.scrollTop : 0; })()`);
  }
  // Normal before any press: the box's size and where the player bar starts below it. No mode may change either (ruling 4: the
  // box keeps its size and nothing under it moves); a stage that grows with its text (hb-grow) is left out.
  const normal = await look();
  const sized = (label, now) => {
    if (normal.grow) return;
    if (now.stageH !== normal.stageH) problems.push(`${label}: the box changes size (${now.stageH}px, not ${normal.stageH}px)`);
    else if (now.barTop !== normal.barTop) problems.push(`${label}: the player bar moves (${now.barTop}px below the top of the box, not ${normal.barTop}px)`);
  };
  // Whether every run so far has ended: Normal's rest is judged as after a run only then (a run that never ended keeps its timers
  // going, and Normal would only be said not to rest because of it).
  let allEnded = ended;
  const shots = {}, named = {};
  for (const mode of ['inside', 'compare']) {
    const label = labels[mode];
    await settleBox();
    if (!(await press(mode))) continue;
    await sleep(700);
    const now = await look(runs);
    if (now.mode !== mode) problems.push(`${label}: the stage is not marked data-hb-mode="${mode}"`);
    if (now.overflow) problems.push(`${label}: horizontal overflow`);
    if (!now.notes.includes(mode)) problems.push(`${label}: its note is not shown`);
    if (now.notes.some(n => n !== mode)) problems.push(`${label}: the other note is still shown`);
    unmoved(label, now);
    sized(label, now);
    let runEnded = true;
    if (runs && !(runEnded = await waitForRun())) { problems.push(`${label}: the run it started does not end within 30 s`); allEnded = false; }
    if (pictures || runs) {
      const rest = await restShot(0, { calm: settles && ended && runEnded });
      if (!rest.still) problems.push(`the stage does not come to rest in ${label}`);
      else if (pictures) {
        shots[mode] = rest.shot;
        if (first && await samePicture(rest.shot, first)) problems.push(`${label} does not change the stage`);
      }
    }
    problems.push(...await captionProblems(label));
    named[mode] = await pictureName();
    await capture(mode, shots[mode]);
  }
  if (shots.inside && shots.compare && await samePicture(shots.inside, shots.compare)) problems.push('See inside and Compare show the same picture');
  await settleBox();
  if (await press('normal')) {
    // Only the pictures need the wait; the marks, the notes and the overflow are there at once.
    if (pictures) await sleep(700);
    const now = await look();
    if (now.mode !== 'normal') problems.push('Normal: the stage is not marked data-hb-mode="normal"');
    if (now.overflow) problems.push('Normal: horizontal overflow');
    if (now.notes.length) problems.push('Normal: a note is still shown');
    unmoved('Normal', now);
    sized('Normal', now);
    if (pictures) {
      const rest = await restShot(0, { calm: settles && allEnded });
      if (!rest.still) problems.push('the stage does not come to rest in Normal');
      else if (first && !(await samePicture(rest.shot, first))) problems.push('Normal does not bring the first picture back');
    }
    problems.push(...await captionProblems('Normal'));
    named.normal = await pictureName();
  }
  // Where the page names its picture, each mode names it differently, so a screen reader hears what each one shows.
  if (typeof named.normal === 'string') {
    for (const [a, b] of [['normal', 'inside'], ['normal', 'compare'], ['inside', 'compare']]) {
      if (typeof named[a] === 'string' && named[a] === named[b]) problems.push(`the picture's name is the same in ${labels[a]} and ${labels[b]}: "${named[a]}"`);
    }
  }
  // Play keeps scrolling when the mode changes (Play still works under reduced motion, so this runs there too).
  if (deep && kind === 'scroll') {
    const have = await evaluate(`({ play: !!document.querySelector('[data-hb-autoscroll]'), top: !!document.querySelector('[data-hb-top]') })`);
    if (!have.play) problems.push('no Play button');
    if (!have.top) problems.push('no Back to top button');
    if (have.play && have.top) {
      // From the top, so that Play has its whole run ahead of it while the mode changes.
      await evaluate(`document.querySelector('[data-hb-top]').click()`);
      await evaluate(`document.querySelector('[data-hb-autoscroll]').click()`);
      await sleep(400);
      if (await press('inside')) {
        const before = await evaluate(`${BOX}.scrollTop`);
        await sleep(500);
        if (await evaluate(`${BOX}.scrollTop`) <= before) problems.push('changing the mode stops Play');
      }
      await evaluate(`document.querySelector('[data-hb-top]').click()`);
      await press('normal');
    }
  }
  return problems;
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

// True when the stage, as it shows inside a capture of a bigger area, is the picture of the stage seen on its own. shot is the
// capture (base64 PNG), stage the picture of the stage alone, at where the stage sits in the capture (CSS pixels from its top
// left corner) and ratio the device pixel ratio. The picture is looked for there and a pixel off in each direction (the two
// captures can round the stage's edges differently), and counts as found when no more pixels differ than samePicture allows.
async function stageInShot(shot, stage, at, ratio) {
  return evaluate(`new Promise(done => {
    const load = src => new Promise(resolve => { const img = new Image(); img.onload = () => resolve(img); img.src = 'data:image/png;base64,' + src; });
    Promise.all([load(${JSON.stringify(stage)}), load(${JSON.stringify(shot)})]).then(([a, b]) => {
      const w = a.width, h = a.height, limit = Math.max(8, Math.round(w * h / 10000));
      const read = (img, x, y) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.drawImage(img, x, y, w, h, 0, 0, w, h); return g.getImageData(0, 0, w, h).data; };
      const p = read(a, 0, 0), ox = Math.round(${at.x} * ${ratio}), oy = Math.round(${at.y} * ${ratio});
      for (const [dx, dy] of [[0, 0], [0, -1], [0, 1], [-1, 0], [1, 0], [-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        const q = read(b, ox + dx, oy + dy);
        let visible = 0;
        for (let i = 0; i < p.length; i += 4) if (Math.abs(p[i] - q[i]) + Math.abs(p[i + 1] - q[i + 1]) + Math.abs(p[i + 2] - q[i + 2]) > 64) visible++;
        if (visible <= limit) { done(true); return; }
      }
      done(false);
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
// forms of its word and one letter already finds cards (but not every card: "best" and "for" are no card's words, and a
// typed "best" is left out), typing only replaces the address (spaces as %20), a word with no match says so, All
// animations lists every card under its group headings with the card titles a level below them, Browse all pressed there
// adds no history step, an address opened directly shows its view, "/" puts keyboard focus in the search box and Escape on
// the empty box keeps the picked place, a tile or Popular suggestion press brings the results heading into view with
// keyboard focus (the picked tile pressed again does not scroll), and the old ?q= and ?cat= links still work. Keyboard
// focus is not dropped or left behind when a pressed button hides or the page scrolls away: Show all puts it on the first
// new card; Clear, a suggestion in the Nothing-found panel, Browse all (the button and the link) and Back after Show all
// put it on the results heading. A tile pressed while a search box keeps focus (a tap on iOS leaves it there) empties both
// boxes. Leaves the home page on ?cat=micro-interactions.
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
  // The totals come from the page's data (every entry in CATS, its groups, the cards PLACES puts in Buttons), not from the list
  // the page builds from it (ALL), so a card lost on the way shows up as a missing card below. Adding an animation needs no
  // edit here; the tests compare the counts written in the page with the same data.
  const total = await evaluate(`({ cards: CATS.reduce((n, c) => n + c.entries.length, 0), groups: CATS.length, buttons: Object.values(PLACES).filter(p => p.includes('btn')).length })`);
  if (!total.cards || !total.groups || total.buttons <= 8) problems.push(`the page's own data: ${JSON.stringify(total)} (the Buttons steps below need more than one page of Buttons cards)`);
  await evaluate(`document.querySelector('.place[data-place="btn"]').click()`);
  await sleep(300);
  let v = await view();
  if (v.title !== 'Buttons' || v.cards !== 8 || v.more !== `Show all ${total.buttons}` || v.search !== '?place=buttons' || v.pressed !== 'btn') problems.push(`Buttons tile: ${JSON.stringify(v)}`);
  await press('#more-btn');
  await sleep(300);
  v = await view();
  if (v.cards !== total.buttons || v.more !== '' || v.search !== '?place=buttons&all=1') problems.push(`Show all: ${JSON.stringify(v)}`);
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
  // Button Press Scale comes first: a Buttons card with "button" in its name that springs back as you press it, and the
  // search counts "spring" for "bounce" and "press" for "click". Bounce In, the one name with "bounce", must be on the first
  // page of results (shown before Show all), not at a set place: each new card named for buttons moves it down a place.
  const found = await evaluate(`[...document.querySelectorAll('#cards .card .title a')].map(a => a.textContent)`);
  if (found[0] !== 'Button Press Scale' || !found.includes('Bounce In')) problems.push(`search order: ${found.join(', ')}`);
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
  // Every description ends "Best for …", so neither "best" nor "for" may count as a card's word: "b" finds only the cards with
  // a real word starting with b, and a typed "best" is left out like "for".
  const every = await evaluate(`ALL.length`);
  if (letter.sub === `${every} animations match.`) problems.push(`search "b" finds all ${every} animations (the "Best for" of every description counts)`);
  await type('button');
  await sleep(300);
  const button = await results();
  await type('best button');
  await sleep(300);
  const best = await results();
  if (best.sub !== button.sub || best.names.join() !== button.names.join()) problems.push(`search "best button": ${best.sub} "button": ${button.sub} (a typed "best" counts)`);
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
  if (all.groups !== total.groups || all.cards !== total.cards || all.search !== '?view=all' || all.pressed) problems.push(`All animations: ${JSON.stringify(all)}`);
  if (all.steps !== stepsBefore) problems.push('Browse all pressed in All animations adds a history step');
  if (all.level4 !== total.cards || all.named) problems.push(`All animations: ${all.level4} card titles at level 4, not ${total.cards}, and ${all.named} group sections named, not 0`);
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
  if (v.title !== 'Buttons' || v.cards !== 8 || v.more !== `Show all ${total.buttons}` || v.pressed !== 'btn') problems.push(`?place=buttons: ${JSON.stringify(v)}`);
  await key('/', 'Slash', 191, '/');
  await sleep(100);
  on = await focused();
  if (on !== 'q') problems.push(`"/": keyboard focus is on ${on}, not in the search box`);
  await key('Escape', 'Escape', 27);
  await sleep(300);
  v = await view();
  on = await focused();
  if (v.title !== 'Buttons' || v.search !== '?place=buttons' || v.pressed !== 'btn' || on === 'q') problems.push(`Escape in the empty search box: ${JSON.stringify(v)}, keyboard focus is on ${on}`);
  for (const [query, want] of [['?view=all', { title: 'All animations', groups: total.groups, cards: total.cards, pressed: '' }],
    ['?place=buttons&all=1', { title: 'Buttons', cards: total.buttons, more: '', pressed: 'btn' }]]) {
    await load(query);
    v = await view();
    if (Object.keys(want).some(k => v[k] !== want[k])) problems.push(`${query}: ${JSON.stringify(v)}`);
  }
  // The results come into view at every width: a tile press that picks a place and a Popular suggestion press bring the
  // results heading into the top 60% of the window and give it keyboard focus, so focus is not left on a control that
  // scrolled away. The picked tile pressed again goes back to Start where the page is, without scrolling. Each reading
  // waits for the page to hold still (the scroll is smooth).
  const still = () => evaluate(`new Promise(done => { let last = scrollY, same = 0;
    const tick = () => { same = scrollY === last ? same + 1 : 0; last = scrollY; if (same >= 3) done(); else setTimeout(tick, 100); };
    setTimeout(tick, 100); })`);
  const heading = () => evaluate(`(() => { const t = document.getElementById('results-title'), top = Math.round(t.getBoundingClientRect().top);
    return { title: t.textContent, top, shown: top >= 0 && top <= innerHeight * .6, focus: document.activeElement === t, scrolled: Math.round(scrollY) }; })()`);
  for (const [what, selector] of [['a tile press', '.place[data-place="btn"]'], ['a Popular suggestion press', '.home-hero [data-q]']]) {
    await load('');
    await evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); el.focus({ preventScroll: true }); el.click(); })()`);
    await still();
    const seen = await heading();
    if (!seen.shown || !seen.focus) problems.push(`results after ${what}: the heading is at ${seen.top}px${seen.shown ? '' : ', not in the top 60% of the window'}${seen.focus ? '' : ', and keyboard focus is not on it'}`);
    if (selector.startsWith('.place')) {
      await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
      await still();
      const again = await heading();
      if (again.title !== 'Good places to start' || Math.abs(again.scrolled - seen.scrolled) > 1) problems.push(`the picked tile pressed again: heading "${again.title}", the page scrolled from ${seen.scrolled}px to ${again.scrolled}px`);
    }
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
// overflows sideways. A chip far along the bar's row (Page changes), once pressed, is scrolled fully into the row, and the
// page does not move. Emptying the bar's own search box keeps the bar, and the focus in the box, until the box is left. A
// chip pressed again goes away with the bar, so keyboard focus moves to the results heading. The back arrow goes away too
// and scrolls to the top, so keyboard focus moves to the first place tile, which is on screen there. The keyboard's Search
// key in the bar's box takes keyboard focus out of the box (the keyboard closes) and keeps the bar. A 45-letter word in ?q=
// does not make the page wider than the window.
async function homePhoneProblems() {
  const now = () => evaluate(`(() => { const a = document.activeElement;
    return { title: document.getElementById('results-title').textContent, focus: a.id || (a.matches('.place') ? 'tile ' + a.dataset.place : a.tagName.toLowerCase()),
      shown: getComputedStyle(document.getElementById('pinbar')).display !== 'none', scrolled: Math.round(scrollY) }; })()`);
  const press = selector => evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); el.focus(); el.click(); })()`);
  const typeInBar = text => evaluate(`(() => { const box = document.getElementById('q2'); box.value = ${JSON.stringify(text)}; box.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  // Every visible button, link and field in the bar, on the cards and under them is at least 44×44, and nothing overflows
  // sideways. A card's title link is stretched over its whole card (an absolutely placed ::after), so it counts as the card;
  // the link itself must not be positioned, or its ::after would cover only the link.
  const fit = where => evaluate(`(() => {
    const r = el => el.getBoundingClientRect();
    const stretched = el => { const after = getComputedStyle(el, '::after');
      return el.tagName === 'A' && el.offsetParent && getComputedStyle(el).position === 'static' && after.content !== 'none' && after.display !== 'none'
        && after.position === 'absolute' && ['top', 'right', 'bottom', 'left'].every(side => after[side] === '0px'); };
    const small = [...document.querySelectorAll('#pinbar :is(button, a, input), #cards :is(button, a, input), #more :is(button, a, input)')]
      .filter(el => el.getClientRects().length)
      .map(el => [el, r(stretched(el) ? el.offsetParent : el)])
      .filter(([, b]) => b.width < 44 || b.height < 44)
      .map(([el, b]) => (el.id || el.tagName.toLowerCase() + (el.getAttribute('class') ? '.' + el.getAttribute('class').split(' ')[0] : '')) + ' ' + Math.round(b.width) + 'x' + Math.round(b.height));
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
  // Page changes, the last chip, lies far past the right edge of the row: pressed, it is scrolled fully into the row, and
  // only the row moves (the results heading is on screen here, so the page stays where it is).
  const before = await evaluate(`Math.round(scrollY)`);
  await evaluate(`document.querySelector('.pchip[data-place="page"]').click()`);
  await sleep(700);
  const chip = await evaluate(`(() => { const c = document.querySelector('.pchip[data-place="page"]'), b = c.getBoundingClientRect(), row = c.parentElement.getBoundingClientRect();
    return { title: document.getElementById('results-title').textContent, pressed: c.getAttribute('aria-pressed'), left: Math.round(b.left), right: Math.round(b.right),
      row: Math.round(row.left) + '-' + Math.round(row.right), inside: b.left >= row.left - .5 && b.right <= row.right + .5, scrolled: Math.round(scrollY) }; })()`);
  if (chip.title !== 'Page changes' || chip.pressed !== 'true' || !chip.inside || chip.scrolled !== before) {
    problems.push(`phone, Page changes chip: ${JSON.stringify(chip)}${chip.inside ? '' : ' (not fully inside the row)'}${chip.scrolled !== before ? ` (the page scrolled from ${before}px)` : ''}`);
  }
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
    // The keyboard's Search key (Enter) in the bar's box: keyboard focus leaves the box, so the phone's keyboard closes over
    // the results, and the bar stays while the search is shown.
    await evaluate(`document.getElementById('q2').focus()`);
    await typeInBar('fade');
    await sleep(200);
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', windowsVirtualKeyCode: 13 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
    await sleep(900);
    b = await now();
    if (b.title !== 'Results for “fade”' || !b.shown || b.focus === 'q2') problems.push(`phone, Search key in the bar's box: ${JSON.stringify(b)}${b.focus === 'q2' ? ' (the box keeps keyboard focus)' : ''}`);
  } finally {
    await send('Emulation.setFocusEmulationEnabled', { enabled: false });
  }
  // A 45-letter word in the address: the headings that repeat it break inside the word, so the page is no wider than the window.
  let onLoad;
  const loaded = new Promise(resolve => { onLoad = msg => { if (msg.method === 'Page.loadEventFired') resolve(); }; listeners.add(onLoad); });
  await send('Page.navigate', { url: `${BASE}/?q=pneumonoultramicroscopicsilicovolcanoconiosis` });
  try { await withTimeout(loaded, LOAD_TIMEOUT); } catch { problems.push('phone, ?q= with a 45-letter word did not load'); }
  listeners.delete(onLoad);
  await sleep(300);
  const wide = await evaluate(`({ page: document.documentElement.scrollWidth, window: document.documentElement.clientWidth })`);
  if (wide.page > wide.window + 1) problems.push(`phone, ?q= with a 45-letter word: the page is ${wide.page}px wide in a ${wide.window}px window`);
  return problems;
}

// Home page, reduced-motion phone run, in All animations (every card): nothing runs (every animation in the page, on
// pseudo-elements too, is paused), neither at once nor once every card has been on screen, and every preview holds a still
// frame that shows something. The stage is captured with the preview and again with the preview's contents hidden (its dark
// background stays): the pixels that change must be at least 0.3% of the stage, and the box around them at least 1% of it.
// That is stricter than looking for a visible element, which passes a text clipped out of sight, a clip-path closed to
// nothing or a lone typing cursor.
async function homeMotionProblems() {
  const problems = [];
  await evaluate(`document.getElementById('more-btn').click()`);
  await sleep(800);
  const running = when => evaluate(`document.getAnimations().filter(a => a.playState === 'running').map(a => {
    const t = a.effect && a.effect.target, card = t && t.closest && t.closest('.card'), cls = t && t.getAttribute && t.getAttribute('class');
    return (a.animationName || a.transitionProperty || 'an animation') + ' on ' + (card ? card.dataset.slug : t ? t.tagName.toLowerCase() + (cls ? '.' + cls.split(' ')[0] : '') : 'the page') + ((a.effect && a.effect.pseudoElement) || '');
  })`).then(found => { if (found.length) problems.push(`reduced motion: ${found.length} animations run ${when} (${[...new Set(found)].slice(0, 8).join(', ')})`); });
  await running('in All animations');
  const slugs = await evaluate(`[...document.querySelectorAll('#cards .card')].map(c => c.dataset.slug)`);
  const total = await evaluate(`CATS.reduce((n, c) => n + c.entries.length, 0)`); // from the data, as in the desktop run
  if (slugs.length !== total) problems.push(`reduced motion: All animations shows ${slugs.length} cards, not ${total}`);
  const card = slug => `document.querySelector('#cards .card[data-slug="${slug}"]')`;
  const frames = n => `new Promise(done => { let left = ${n}; const tick = () => (--left ? requestAnimationFrame(tick) : done()); requestAnimationFrame(tick); })`;
  const empty = [];
  for (const slug of slugs) {
    const box = await evaluate(`(async () => { const s = ${card(slug)}.querySelector('.stage'); s.scrollIntoView({ block: 'center' }); await ${frames(2)};
      const b = s.getBoundingClientRect(); return { x: b.left + scrollX, y: b.top + scrollY, width: b.width, height: b.height }; })()`);
    const drawn = (await send('Page.captureScreenshot', { format: 'png', clip: { ...box, scale: 1 } })).data;
    await evaluate(`(async () => { for (const el of ${card(slug)}.querySelector('.pv').children) el.style.visibility = 'hidden'; await ${frames(2)}; })()`);
    const bare = (await send('Page.captureScreenshot', { format: 'png', clip: { ...box, scale: 1 } })).data;
    await evaluate(`{ for (const el of ${card(slug)}.querySelector('.pv').children) el.style.visibility = ''; }`);
    // The pixels that differ by more than 48 (red, green and blue summed) between the two captures: their share of the stage,
    // and the shares of its width and of its height that the box around them takes.
    const seen = await evaluate(`new Promise(done => {
      const load = src => new Promise(resolve => { const img = new Image(); img.onload = () => resolve(img); img.src = 'data:image/png;base64,' + src; });
      Promise.all([load(${JSON.stringify(drawn)}), load(${JSON.stringify(bare)})]).then(([x, y]) => {
        const read = img => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0); return g.getImageData(0, 0, c.width, c.height).data; };
        const p = read(x), q = read(y), w = x.width, h = x.height;
        let changed = 0, left = w, right = -1, top = h, bottom = -1;
        for (let i = 0; i < p.length; i += 4) {
          if (Math.abs(p[i] - q[i]) + Math.abs(p[i + 1] - q[i + 1]) + Math.abs(p[i + 2] - q[i + 2]) <= 48) continue;
          const px = (i / 4) % w, py = Math.floor(i / 4 / w);
          changed++; left = Math.min(left, px); right = Math.max(right, px); top = Math.min(top, py); bottom = Math.max(bottom, py);
        }
        done({ share: changed / (w * h), wide: changed ? (right - left + 1) / w : 0, tall: changed ? (bottom - top + 1) / h : 0 });
      });
    })`);
    if (seen.share < .003 || seen.wide * seen.tall < .01) {
      empty.push(`${slug} (${(seen.share * 100).toFixed(2)}% of the stage, in a box of ${Math.round(seen.wide * 100)}% × ${Math.round(seen.tall * 100)}%)`);
    }
  }
  if (empty.length) problems.push(`reduced motion: ${empty.length} previews show nothing: ${empty.join(', ')}`);
  await running('once every card has been on screen');
  return problems;
}

// ── The finder (?view=find) ──
// Every home setup also opens the finder (finderLayoutProblems). The desktop run works it (finderViewProblems) and the
// reduced-motion run holds it still (finderMotionProblems). These are the finder's own steps; the home checks above are unchanged.

// Opens an address of the site as a new visit does; a load that does not finish is a problem of its own.
async function openHome(query, problems) {
  let onLoad;
  const loaded = new Promise(resolve => { onLoad = msg => { if (msg.method === 'Page.loadEventFired') resolve(); }; listeners.add(onLoad); });
  await send('Page.navigate', { url: `${BASE}/${query}` });
  try { await withTimeout(loaded, LOAD_TIMEOUT); } catch { problems.push(`finder: ${query || 'the home page'} did not load`); }
  listeners.delete(onLoad);
  await sleep(300);
}

// A real mouse click at the middle of the element the selector finds, once it is scrolled to the middle of the window. Returns
// what covers that point when it is not the element or something inside it (covered), and where the page was scrolled to just
// before the click (scrolled), so the caller can tell whether the click scrolled the page.
async function clickAt(selector) {
  const spot = await evaluate(`(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return { covered: 'nothing: the page has no such element' };
    el.scrollIntoView({ block: 'center' });
    const b = el.getBoundingClientRect(), x = b.left + b.width / 2, y = b.top + b.height / 2, hit = document.elementFromPoint(x, y);
    return { x, y, scrolled: Math.round(scrollY),
      covered: el.contains(hit) ? '' : hit ? hit.tagName.toLowerCase() + (hit.getAttribute('class') ? '.' + hit.getAttribute('class').split(' ')[0] : '') : 'nothing' };
  })()`);
  if (spot.covered) return { covered: spot.covered, scrolled: 0 };
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: spot.x, y: spot.y, button: 'none' });
  for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: spot.x, y: spot.y, button: 'left', clickCount: 1 });
  return { covered: '', scrolled: spot.scrolled };
}

// The finder at every setup. On the start page the Find button sits under the Popular line (on a phone 44px tall or more and as
// wide as the column). The finder, opened with three answers in the address: the hero and the place tiles give way to it, its
// cards and the Not here? panel show, nothing overflows sideways, Finder is in the top bar above 600px and the bar's links fit
// beside the brand, the phone bar stays away and, on phones, every answer, button and link of the finder and its results is at
// least 44×44. Screenshots of the finder (the window and the whole page) are saved beside the others.
async function finderLayoutProblems(name, setup) {
  const problems = [];
  await openHome('', problems);
  const cta = await evaluate(`(() => {
    const a = document.querySelector('.find-cta'), pop = document.querySelector('.home-hero .pop'), hero = document.querySelector('.home-hero');
    if (!a || !a.getClientRects().length) return null;
    const b = a.getBoundingClientRect();
    return { width: Math.round(b.width), height: Math.round(b.height), under: !!pop && b.top >= pop.getBoundingClientRect().bottom - 1,
      full: Math.abs(b.width - hero.getBoundingClientRect().width) <= 1 };
  })()`);
  if (!cta) problems.push('finder: no Find button on the start page');
  else {
    if (!cta.under) problems.push('finder: the Find button is not under the Popular line');
    if (setup.width <= 600 && (cta.height < 44 || !cta.full)) problems.push(`finder: on a phone the Find button is ${cta.width}x${cta.height}${cta.full ? '' : ', not as wide as the column'}`);
  }
  await openHome('?view=find&what=text&when=load&how=stagger', problems);
  await sleep(500);
  const found = await evaluate(`(() => {
    const r = el => el.getBoundingClientRect(), shown = el => !!el && !!el.getClientRects().length, out = [];
    if (shown(document.querySelector('.home-hero')) || shown(document.getElementById('places'))) out.push('the hero or the place tiles show in the finder');
    if (!shown(document.getElementById('finder'))) out.push('the finder does not show');
    if (!document.querySelectorAll('#cards .card').length) out.push('no cards for Text or numbers · When the page opened · One after another');
    if (!shown(document.getElementById('find-not'))) out.push('no Not here? panel');
    if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1) out.push('horizontal overflow');
    if (innerWidth > 600 && !shown(document.getElementById('nav-find'))) out.push('no Finder link in the top bar');
    const brand = document.querySelector('.top .brand span'), first = [...document.querySelectorAll('.top .nav > *')].find(shown);
    if (brand && first && r(brand).right > r(first).left - 8) out.push('the top bar links do not fit beside the brand');
    if (getComputedStyle(document.getElementById('pinbar')).display !== 'none') out.push('the phone bar shows');
    if (innerWidth <= 600) {
      const small = [...document.querySelectorAll('#finder .fd-a, #finder button, #find-not a, #find-not button, #cards .card .copy, #more button')]
        .filter(shown).filter(el => { const b = r(el); return b.width < 44 || b.height < 44; })
        .map(el => (el.id || el.tagName.toLowerCase() + '.' + (el.getAttribute('class') || '').split(' ')[0]) + ' ' + Math.round(r(el).width) + 'x' + Math.round(r(el).height));
      if (small.length) out.push('small targets: ' + small.slice(0, 6).join(', ') + (small.length > 6 ? ' and ' + (small.length - 6) + ' more' : ''));
    }
    return out;
  })()`);
  problems.push(...found.map(p => `finder: ${p}`));
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(join(OUT, `${name}-${setup.name}-finder.png`), Buffer.from(shot.data, 'base64'));
  const { cssContentSize } = await send('Page.getLayoutMetrics');
  const full = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: setup.width, height: Math.ceil(cssContentSize.height), scale: 1 } });
  writeFileSync(join(OUT, `${name}-${setup.name}-finder-full.png`), Buffer.from(full.data, 'base64'));
  return problems;
}

// The finder, desktop run. ?view=find opens with three questions, nothing chosen, the heading "Your matches", the line asking for
// an answer and no cards, the tab's title and the Finder link marked as the current page. Real clicks on answers change the cards,
// replace the address (no history step), never scroll the page and leave keyboard focus on the answer; with A menu or form · When I
// scrolled · Slid, Hide-on-Scroll Header is among the first six (case 22 of the finder's test set). The Not here? link is the form's
// address for those answers, in a new tab. See N matches brings the results heading into view with keyboard focus; Start over
// clears the answers and the cards, goes back to ?view=find, scrolls to the top and puts keyboard focus on the finder's heading.
// With more than twelve matches Show all shows the rest, only replacing the address, and puts keyboard focus on the thirteenth card.
// An address opened directly shows the same answers and cards as the clicks. The Find button and the Finder link each enter the
// finder with one history step and keyboard focus on its heading; after an answer, Back returns to the start in one press, and as
// the answer that had keyboard focus is hidden there, focus goes to the results heading. Describe it in words goes back to the start
// with keyboard focus in the search box.
async function finderViewProblems() {
  const problems = [];
  const FIND_TITLE = 'Find an animation you saw — Animation Handbook', ASK = 'Answer a question above, and the animations that match show here.';
  // See N matches and the results line once something matches, each number with its own word ("See 1 match", "1 best match and
  // 9 close matches."), never "See 1 matches"; tests/finder.test.js holds both to the page's own lines.
  const FIND_SEE = /^See (?:1 match|(?!1 )\d+ matches)$/;
  const FIND_LINE = /^(?:1 best match|(?!1 )\d+ best matches)(?: and (?:1 close match|(?!1 )\d+ close matches))?\.$|^No animation fits all your answers\. These come close\.$/;
  const look = () => evaluate(`(() => {
    const $ = id => document.getElementById(id), shown = el => !!el && !!el.getClientRects().length;
    const links = [...document.querySelectorAll('#cards .card .title a')], a = document.activeElement;
    return { hero: shown(document.querySelector('.home-hero')), tiles: shown($('places')), finder: shown($('finder')),
      questions: document.querySelectorAll('#finder fieldset').length,
      checked: [...document.querySelectorAll('#finder .fd-r:checked')].map(r => r.name.slice(3) + '=' + r.value).join('&'),
      title: $('results-title').textContent, sub: $('results-sub').textContent, names: links.map(l => l.textContent),
      more: $('more').hidden ? '' : $('more-label').textContent, search: location.search, steps: history.length, tab: document.title,
      current: $('nav-find') ? $('nav-find').getAttribute('aria-current') : 'no Finder link',
      see: shown($('find-see')) ? $('find-see').textContent : '', notHere: shown($('find-not')),
      focus: a.id || (links.includes(a) ? 'card link ' + (links.indexOf(a) + 1) : a.tagName.toLowerCase()), scrolled: Math.round(scrollY) };
  })()`);
  const press = selector => evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (el) { el.focus(); el.click(); } return !!el; })()`);
  const answer = (question, key) => `#finder .fd-a:has(.fd-r[name="fd-${question}"][value="${key}"])`;
  const still = () => evaluate(`new Promise(done => { let last = scrollY, same = 0;
    const tick = () => { same = scrollY === last ? same + 1 : 0; last = scrollY; if (same >= 3) done(); else setTimeout(tick, 100); };
    setTimeout(tick, 100); })`);
  // A real click on an answer: then the line has been written (400 ms), the page must not have scrolled and keyboard focus must be
  // where the click put it, on the answer.
  const pick = async (question, key) => {
    const spot = await clickAt(answer(question, key));
    if (spot.covered) { problems.push(`finder: the answer ${question}=${key} is covered by ${spot.covered}`); return; }
    await sleep(700);
    const y = await evaluate('Math.round(scrollY)');
    if (Math.abs(y - spot.scrolled) > 1) problems.push(`finder: picking ${question}=${key} scrolled the page from ${spot.scrolled}px to ${y}px`);
    const on = await evaluate(`(() => { const a = document.activeElement; return a.matches('.fd-r') ? a.name.slice(3) + '=' + a.value : a.id || a.tagName.toLowerCase(); })()`);
    if (on !== `${question}=${key}`) problems.push(`finder: picking ${question}=${key} moved keyboard focus away from the answer, to ${on}`);
  };

  // History steps are counted from a cleared history: Chrome keeps 50 entries at most (the run's own page loads have filled them, and a
  // step then adds nothing to history.length), and a step taken after Back drops the entries ahead of the current one (so it adds nothing
  // either). Page.resetNavigationHistory leaves the page being shown as the only entry.
  const clearHistory = () => send('Page.resetNavigationHistory');
  await clearHistory();
  await openHome('?view=find', problems);
  let s = await look();
  if (s.hero || s.tiles || !s.finder || s.questions !== 3 || s.checked || s.names.length || s.title !== 'Your matches' || s.sub !== ASK ||
    s.tab !== FIND_TITLE || s.current !== 'page' || s.see || s.notHere) problems.push(`finder, ?view=find: ${JSON.stringify(s)}`);
  const steps = s.steps;
  for (const [question, key] of [['what', 'menu'], ['when', 'scroll'], ['how', 'slide']]) await pick(question, key);
  s = await look();
  if (s.checked !== 'what=menu&when=scroll&how=slide' || s.search !== '?view=find&what=menu&when=scroll&how=slide' || s.steps !== steps) {
    problems.push(`finder, three answers: chosen ${s.checked}, the address ${s.search}, ${s.steps - steps} history steps added`);
  }
  if (!s.names.slice(0, 6).includes('Hide-on-Scroll Header')) problems.push(`finder: A menu or form · When I scrolled · Slid shows ${s.names.slice(0, 6).join(', ') || 'no cards'} first, not Hide-on-Scroll Header`);
  if (!FIND_SEE.test(s.see) || !s.notHere) problems.push(`finder: See N matches reads "${s.see}", Not here? is ${s.notHere ? 'shown' : 'hidden'}`);
  if (!FIND_LINE.test(s.sub)) problems.push(`finder: the results line "${s.sub}"`);
  const link = await evaluate(`(() => { const a = document.getElementById('find-gh');
    return a ? { href: new URL(a.href).href, want: new URL(findIssueURL({ what: 'menu', when: 'scroll', how: 'slide' })).href, target: a.target, rel: a.rel } : null; })()`);
  if (!link || link.href !== link.want || !link.href.startsWith('https://github.com/matinmonshizadeh/animation-handbook/issues/new?template=animation_not_here.yml&') ||
    link.target !== '_blank' || link.rel !== 'noopener') problems.push(`finder: the Not here? link ${JSON.stringify(link)}`);
  const picked = s.names;
  await press('#find-see');
  await still();
  const seen = await evaluate(`(() => { const t = document.getElementById('results-title'), top = Math.round(t.getBoundingClientRect().top);
    return { top, shown: top >= 0 && top <= innerHeight * .6, focus: document.activeElement === t }; })()`);
  if (!seen.shown || !seen.focus) problems.push(`finder: after See N matches the results heading is at ${seen.top}px${seen.focus ? '' : ', without keyboard focus'}`);
  await press('#find-reset');
  await still();
  await sleep(500);
  s = await look();
  if (s.checked || s.names.length || s.search !== '?view=find' || s.sub !== ASK || s.focus !== 'find-title' || s.see || s.notHere || s.steps !== steps || s.scrolled > 1) {
    problems.push(`finder, Start over: ${JSON.stringify(s)}${s.scrolled > 1 ? ` (the page is ${s.scrolled}px down, not at the top)` : ''}`);
  }
  // More than twelve matches: twelve cards, then Show all shows every one and puts keyboard focus on the thirteenth.
  await openHome('?view=find&what=background', problems);
  s = await look();
  const total = Number((s.more.match(/^Show all (\d+) matches$/) || [])[1]);
  if (!(total > 12) || s.names.length !== 12) problems.push(`finder, The background: ${s.names.length} cards and the button "${s.more}" (twelve cards, then Show all for the rest)`);
  else {
    const opened = s.steps;
    await press('#more-btn');
    await sleep(400);
    s = await look();
    if (s.names.length !== total || s.search !== '?view=find&what=background&all=1' || s.focus !== 'card link 13' || s.more || s.steps !== opened) {
      problems.push(`finder, Show all: ${s.names.length} of ${total} cards, the address ${s.search}, keyboard focus on ${s.focus}, ${s.steps - opened} history steps added (it only replaces the address), ${s.more ? `the button still reads "${s.more}"` : 'the button is gone'}`);
    }
  }
  // An address opened directly shows the same answers and cards as the clicks did.
  await openHome('?view=find&what=menu&when=scroll&how=slide', problems);
  s = await look();
  if (s.checked !== 'what=menu&when=scroll&how=slide' || s.names.join() !== picked.join()) problems.push(`finder, the address opened directly: chosen ${s.checked}, cards ${s.names.join(', ')}; after the clicks: ${picked.join(', ')}`);
  // The ways in: one history step, keyboard focus on the finder's heading; after an answer, Back returns to the start in one press.
  for (const [what, selector] of [['Find button', '.find-cta'], ['Finder link', '#nav-find']]) {
    await openHome('', problems);
    await clearHistory();
    const before = await evaluate('history.length');
    if (!(await press(selector))) { problems.push(`finder: no ${what}`); continue; }
    await still();
    s = await look();
    if (s.search !== '?view=find' || s.steps !== before + 1 || s.focus !== 'find-title' || s.hero || !s.finder) problems.push(`finder, the ${what}: ${JSON.stringify(s)}`);
    await pick('what', 'text');
    await evaluate('history.back()');
    await sleep(700);
    s = await look();
    if (s.search !== '' || !s.hero || s.finder || s.title !== 'Good places to start' || s.tab === FIND_TITLE || s.current !== null || s.focus !== 'results-title') {
      problems.push(`finder, Back after the ${what} and an answer: ${JSON.stringify(s)}${s.focus !== 'results-title' ? ` (keyboard focus is on ${s.focus}, not on the results heading)` : ''}`);
    }
  }
  // Describe it in words: back to the start, one history step, keyboard focus in the search box.
  await openHome('?view=find&what=text', problems);
  await clearHistory();
  const before = await evaluate('history.length');
  if (!(await press('#find-words'))) problems.push('finder: no Describe it in words');
  else {
    await still();
    s = await look();
    if (s.search !== '' || !s.hero || s.focus !== 'q' || s.steps !== before + 1) problems.push(`finder, Describe it in words: ${JSON.stringify(s)}`);
  }
  return problems;
}

// How much two captures of the same box differ: the share of pixels that differ by more than 48 (red, green and blue summed), and
// the shares of the box's width and height that the rectangle around them takes, as in the home page's reduced-motion check.
async function pictureChange(drawn, bare) {
  return evaluate(`new Promise(done => {
    const load = src => new Promise(resolve => { const img = new Image(); img.onload = () => resolve(img); img.src = 'data:image/png;base64,' + src; });
    Promise.all([load(${JSON.stringify(drawn)}), load(${JSON.stringify(bare)})]).then(([x, y]) => {
      const read = img => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0); return g.getImageData(0, 0, c.width, c.height).data; };
      const p = read(x), q = read(y), w = x.width, h = x.height;
      let changed = 0, left = w, right = -1, top = h, bottom = -1;
      for (let i = 0; i < p.length; i += 4) {
        if (Math.abs(p[i] - q[i]) + Math.abs(p[i + 1] - q[i + 1]) + Math.abs(p[i + 2] - q[i + 2]) <= 48) continue;
        const px = (i / 4) % w, py = Math.floor(i / 4 / w);
        changed++; left = Math.min(left, px); right = Math.max(right, px); top = Math.min(top, py); bottom = Math.max(bottom, py);
      }
      done({ share: changed / (w * h), wide: changed ? (right - left + 1) / w : 0, tall: changed ? (bottom - top + 1) / h : 0 });
    });
  })`);
}

// The finder under reduced motion: nothing runs in it, with or without cards (no animation in the page is running, on
// pseudo-elements too), and every How picture holds a still that shows something: captured with its parts and again with them
// hidden (its dark square stays), the pixels that change are at least 0.3% of the picture and the box around them at least 1%.
async function finderMotionProblems() {
  const problems = [];
  for (const query of ['?view=find', '?view=find&what=background']) {
    await openHome(query, problems);
    await sleep(500);
    const running = await evaluate(`document.getAnimations().filter(a => a.playState === 'running').map(a => {
      const t = a.effect && a.effect.target, cls = t && t.getAttribute && t.getAttribute('class');
      return (a.animationName || a.transitionProperty || 'an animation') + ' on ' + (t ? t.tagName.toLowerCase() + (cls ? '.' + cls.split(' ').join('.') : '') : 'the page') + ((a.effect && a.effect.pseudoElement) || '');
    })`);
    if (running.length) problems.push(`finder, reduced motion, ${query}: ${running.length} animations run (${[...new Set(running)].slice(0, 6).join(', ')})`);
  }
  const pics = await evaluate(`typeof FIND_Q === 'undefined' ? [] : FIND_Q.find(q => q.key === 'how').answers.map(a => a.pic)`);
  if (!pics.length) problems.push('finder, reduced motion: the page has no How answers');
  const frames = 'new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done)))';
  const empty = [];
  for (const pic of pics) {
    const box = await evaluate(`(async () => { const p = document.querySelector('#finder .${pic}'); if (!p || !p.getClientRects().length) return null;
      p.scrollIntoView({ block: 'center' }); await ${frames};
      const b = p.getBoundingClientRect(); return { x: b.left + scrollX, y: b.top + scrollY, width: b.width, height: b.height }; })()`);
    if (!box || !box.width || !box.height) { empty.push(`${pic} (no picture)`); continue; }
    const drawn = (await send('Page.captureScreenshot', { format: 'png', clip: { ...box, scale: 1 } })).data;
    await evaluate(`(async () => { for (const el of document.querySelector('#finder .${pic}').children) el.style.visibility = 'hidden'; await ${frames}; })()`);
    const bare = (await send('Page.captureScreenshot', { format: 'png', clip: { ...box, scale: 1 } })).data;
    await evaluate(`{ for (const el of document.querySelector('#finder .${pic}').children) el.style.visibility = ''; }`);
    const seen = await pictureChange(drawn, bare);
    if (seen.share < .003 || seen.wide * seen.tall < .01) empty.push(`${pic} (${(seen.share * 100).toFixed(2)}% of the picture)`);
  }
  if (empty.length) problems.push(`finder, reduced motion: ${empty.length} How pictures show nothing: ${empty.join(', ')}`);
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
  await send('Page.addScriptToEvaluateOnNewDocument', { source: TIMERS });
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
          problems.push(...await modeProblems(name, setup, result.kind));
        }
        if (home) {
          if (setup.moves) problems.push(...await homeViewProblems());
          if (setup.name === 'phone') problems.push(...await homePhoneProblems());
          if (setup.name === 'phone-reduced') problems.push(...await homeMotionProblems());
          if (setup.moves) problems.push(...await homeCopyProblems());
          // The finder (?view=find): opened at every setup; the desktop run works it and the reduced-motion run holds it still.
          problems.push(...await finderLayoutProblems(name, setup));
          if (setup.moves) problems.push(...await finderViewProblems());
          if (setup.reduce) problems.push(...await finderMotionProblems());
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
