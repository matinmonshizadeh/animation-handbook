# See Inside and Compare: Phase 0 and the First Batch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the shared files, the page check and the review kit ready for See inside and Compare on every page, take the paused learning path off the branch, freeze the shared files at `?v=10`, then build both views on the first seven pages (one per category, Parallax Scrolling included) and put them in front of the owner.

**Architecture:** Phase 0 changes only shared pieces, one agent per shared file: the clean-up of the learning path (one revertable commit), the shared script's "play once after a mode press" (ruling 1), the page check's do-it path, run waits and caption, id and name checks (with a fixture site that proves each rule), the switch tests and the final gate, the review kit for any list of pages, and one version bump. The first batch then builds each page's two views in that page's own code, in its own slot (worktree, branch, port), checked by the page check and reviewed by a fresh agent; the batch is merged through category branches and shown to the owner with the review kit's stills, clips and Normal before-and-after counts.

**Tech Stack:** Plain HTML, CSS and vanilla JavaScript (no build, no packages); Node 22+ (`node --test`, built-in `WebSocket`); headless Chrome driven over the DevTools protocol (`tools/check-pages.mjs`, the review kit); WebGL 1 and canvas 2D on two pages; Python's `http.server` for local serving; ffmpeg (through Python's `imageio_ffmpeg`) for the kit's clips.

**Spec:** `docs/superpowers/specs/2026-10-13-see-inside-compare-rollout-design.md` (sections 1 to 5 and 7; section 6's docs are written at integration, in the next plan) and `docs/superpowers/specs/2026-10-13-next-projects-coordination.md` (where the two differ, the coordination file wins). Read both, and CLAUDE.md, before any task. The reference build is Parallax Scrolling as it stands on `feat/see-inside-compare` (`animations/01-scroll-based/parallax-scrolling/index.html`); the page surveys are `.superpowers/sdd/2026-10-13-learn-pilot/rollout-survey-01-03.md`, `-04.md` and `-05-07.md`.

## Global Constraints

- **Checkout and branch:** the main checkout `C:/Users/matin/OneDrive/Desktop/Projects/animation-handbook` stays on `feat/see-inside-compare` for the whole run; it is never switched. Nothing is pushed, nothing is merged into `main`, nothing is published.
- **Merges:** `git merge --no-ff` only; never rebase, never squash. The coordinator (the main session) merges Phase 0 lanes and categories into `feat/see-inside-compare`; a lane lead merges an approved slot into `sic/cat-NN`, and, for a fix round after the batch is on the branch (Task 14, Step 6), `feat/see-inside-compare` into the slot branch first.
- **Phase 0 lanes:** worktree `.claude/worktrees/sic-00<x>` on branch `sic/00<x>` (x = a to e), each made from the head of `feat/see-inside-compare` when its task starts, removed once merged.
- **Page slots (first batch):** worktree `.claude/worktrees/sic-<NN>a` on branch `sic/<NN>a`, made from `feat/see-inside-compare` after Task 6; category branches `sic/cat-NN`, made from `feat/see-inside-compare` after Task 6.
- **Ports:** 8800 = the before-pictures server (detached checkout of `main` in `.claude/worktrees/sic-before`); the 20 slots 01a 8801, 01b 8802, 01c 8803, 02a 8804, 02b 8805, 03a 8806, 03b 8807, 04a 8808, 04b 8809, 04c 8810, 04d 8811, 05a 8812, 05b 8813, 06a 8814, 06b 8815, 06c 8816, 06d 8817, 07a 8818, 07b 8819, 07c 8820; Phase 0 borrows 8801 to 8806 and 8809 before any slot exists; 8731 = the owner's preview of the main checkout (`.claude/launch.json`, `static-site`). Never 8901 to 8909 (finder), 8931 to 8939 (Famous effects) or 8990 (releases).
- **Run folder:** `.superpowers/sdd/2026-10-13-see-inside-compare/` (git-ignored, in the main checkout): `ledger.md`, `lanes/`, `briefs/`, `checks/`, `kit/`, `scratch/<lane>/`, the slot pool `slots/`, `slot.mjs`, `first-batch-rulings.json`. If Phase 0 starts on another day, the folder is named by that day and the name below changes everywhere at once.
- **Shell variables:** every Bash call that uses them starts with `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; FX=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/fixtures` (each Bash call starts in a fresh shell).
- **Machine:** at most eight Chrome runs at once on the machine, for every project: every page check and every kit run goes through `node $RUN/slot.mjs run <who> -- <command>`. The other projects take slots in the same pool with a plain `mkdir slot-N` / `rmdir slot-N` (`list` shows them with `?`); a `?` slot older than two hours (the folder's time: `ls -ld $RUN/slots/slot-N`) is reported to its project's coordinator, never removed by a rollout agent. Headless Chrome only; never the browser pane (it is the owner's; only Task 14 opens pages there, for the owner). One server and one scratch folder (`$RUN/scratch/<lane>/`) per lane.
- **Servers:** `python -m http.server <port> --bind 127.0.0.1`, started from the worktree root as a background command, stopped when the task ends.
- **No `git stash`** (every worktree shares it). To compare versions: `git show <rev>:<path> > <scratch file>`.
- **Version:** the shared files stay at `?v=9` until Task 6 bumps every animation page and the home page to `?v=10` in one commit, on tracked files only (`git ls-files`), line endings kept (`i/lf w/crlf`; `sed -b`). After Task 6, `assets/css/demo-page.css`, `assets/js/demo-page.js` and `tests/demo-page.test.js` are frozen (and, during the first batch, `tools/check-pages.mjs` and `tests/pages.test.js` too: a lane that needs a change writes it in its ledger and tells the coordinator); a shared change the owner asks for at Task 14 takes `?v=11` before the other 159 pages start.
- **Pages:** a first-batch task changes only its page's `index.html` (fix rounds add commits to the same file). No README, home page, `CATS`, prompt, setting, chip or tag changes. `node tools/make-skill.mjs` must write identical files.
- **Names:** never `hb-view` anywhere in a page. The switch and notes markup are exactly as on Parallax Scrolling. Every page CSS selector part that contains `data-hb-mode` starts its stage part with `.stage[data-hb-mode="inside"]` or `.stage[data-hb-mode="compare"]` (attribute straight after `.stage`); no rule on `[data-hb-mode="normal"]`. No element's class is exactly `lbl` (the tests' old-markup guard): a label class always has a second name.
- **The page's `hb:mode` listener (spec section 1):** `document.addEventListener('hb:mode', …)` at the top level of the page's inline script; hears every press, never one at boot; draws the current state at once; safe to run twice; never scrolls, moves focus, presses a control, stops Play or changes Pause. The shared script, not the page, plays the demo once after See inside or Compare (ruling 1).
- **Copies:** made once (at load or on first entry); ids removed or renamed (gradients, masks, filters, `for`); `inert`; `aria-hidden="true"`; not rendered outside Compare.
- **Captions:** every label and half name carries `data-hb-caption`; at least 12px as drawn; 4.5:1 against its own backing; inside the stage; covering neither the part it names nor another caption; at most six (four on phones); amounts as a beginner says them, never ms, px, deg or CSS names.
- **Notes:** exactly two, `p[data-hb-for="inside"]` then `p[data-hb-for="compare"]`, direct children of `div.hb-mode-notes`; one or two plain sentences, about 35 words at most, on what the visitor sees; the Compare note names the halves by their labels; a note says left and right only on a page whose halves never stack, otherwise it names the halves by their labels only; when the stage looks like Normal until the visitor acts, the note ends with what to do; a note the script rewrites (a setting, reduced motion) uses the markup's own words for the default state.
- **Motion:** only transform and opacity animate; a frame loop moves by elapsed time (`FRAME = 1000 / 60`, `dt = lastT === null ? 0 : Math.min(ts - lastT, 50)`, each step × `dt / FRAME`, × 1/3 in Slow motion); on phones each Compare half gets half the budget (particles, dots, tiles); a blur is never doubled; one WebGL context.
- **Reduced motion:** every mode is a still picture that still teaches; no mode adds movement; the shared script presses nothing.
- **Phones:** the box keeps its size in every mode, Compare included (ruling 4); halves side by side while each keeps about 160px of scene, else stacked; anything a mode adds that can be pressed is at least 44×44px (checked by hand: the page check skips the stage); hover and drag keep their touch equivalents.
- **Words and size:** no code on the page; American spelling; no hype; about 300 lines for the demo plus about 150 for its two views.
- **Checks:** tests are `node --test "tests/*.test.js"` from the worktree root: all pass. The page check is `node tools/check-pages.mjs --base http://127.0.0.1:<port> --out <folder> <page or category folder, or home>`: six `ok` lines per page.
- **Acceptance for each page (spec section 1), confirmed line by line by a reviewer who is never the builder:** (1) clear from the picture alone in the mode screenshots at 1280 and 375, start outlines where a movement is shrunk; (2) every mode still under reduced motion and still teaching; (3) Normal at rest pixel-identical to before (a few antialiased corner pixels aside; random pages by eye), Try it, chips and prompt unchanged; (4) a mode change never scrolls the page or the box, moves focus, stops Play or changes Pause, shows the current state at once, then plays once on plays-once and do-it pages (not under reduced motion); (5) notes as above; (6) captions as above; (7) every setting visibly changes See inside and Compare; (8) phones as above; (9) keyboard works in every mode as in Normal, copies inert and hidden from screen readers, a named picture names each mode, a control's name contains its visible words; (10) light enough, as above; (11) tests pass and six `ok` lines; (12) words and size as above.
- **People:** builders and reviewers run on the strongest model. One builder per page, then one fresh reviewer (never the builder); at most three fix rounds by the same builder, then the lead escalates (a design question goes to the owner). Every Phase 0 task is reviewed by a fresh agent before it is merged.
- **Commits:** messages in the repository's plain-words style: `feat: …`, `fix: …`, `test: …`, `chore: …`, `docs: …`; merge commits say what they bring.

## Phases

| Step | Tasks | Where | Runs |
|---|---|---|---|
| 0-A | Task 0 (run folder, slot pool, before-pictures server) | the main checkout, the run folder, `sic-before` (8800) | first and alone; the finder and Famous effects already take slots in the same pool with a plain `mkdir slot-N` / `rmdir slot-N`, which works beside `slot.mjs` |
| 0-B | Task 1 (the clean-up) | `sic-00a` / `sic/00a`, port 8801 | alone; reviewed, then merged |
| 0-C | Task 2 (shared script), Task 3 (page check and fixtures), Task 4 (switch tests and Parallax's notes), Task 5 (review kit) | `sic-00b` (8802), `sic-00c` (8803; fixture site 8809), `sic-00d` (8804), outside the repository (main checkout served on 8805) | in parallel, each from the merged Task 1; no two touch the same file; merged in the order 2, 4, 3 (Task 5 is not in the repository; its real run, Step 7, waits for the merge of Task 3 and ends before Task 6 is merged). The seven lane leads write the first-batch briefs (Step 1 of Tasks 7 to 13) at the same time |
| 0-D | Task 6 (`?v=10`, whole-site check) | `sic-00e`, port 8806 | alone; merged; the shared files are frozen; Phase 0 worktrees removed |
| 1 | Tasks 7 to 13 (one page each) | `sic-01a` 8801, `sic-02a` 8804, `sic-03a` 8806, `sic-04a` 8808, `sic-05a` 8812, `sic-06a` 8814, `sic-07a` 8818 | in parallel; each builder then a fresh reviewer; the lane lead merges the approved slot into `sic/cat-NN` |
| 2 | Task 14 (merge the batch, the kit run, the owner's review) | the main checkout, the owner's preview (8731) | after the seven categories are approved |

### Who touches which file

| File | Task |
|---|---|
| `learn/` (removed), `tests/learn.test.js` (removed), `docs/superpowers/specs/2026-10-13-learn-pilot-design.md` (status line) | 1 |
| `assets/css/demo-page.css` | 1 |
| `assets/js/demo-page.js`, `tests/demo-page.test.js` | 1 (one comment, one test name), then 2 |
| `tools/check-pages.mjs` | 1 (the `learn` target out), then 3 |
| `tests/pages.test.js` | 1 (lesson selectors out, guard test in), then 4 |
| `animations/01-scroll-based/parallax-scrolling/index.html` | 1 (lesson line, nav and link out), 4 (notes in two sentences), 6 (version), 7 (the batch's changes) |
| every `animations/*/*/index.html` and `index.html`: the version line only | 6 |
| each first-batch page | its own task (8 to 13) and Task 6's version line |
| outside the repository: `$RUN/*`, `$FX/sic-gen.mjs`, `$FX/README.md`, `$KIT/*` | 0, 3, 5 |

---
### Task 0: Run folder, slot pool and the before-pictures server (coordinator)

**Files:**
- Create (outside the repository): `$RUN/slot.mjs`, `$RUN/slot.test.mjs`, `$RUN/ledger.md`, `$RUN/first-batch-rulings.json`, folders `$RUN/slots`, `$RUN/lanes`, `$RUN/briefs`, `$RUN/checks`, `$RUN/kit`, `$RUN/scratch`
- Create: worktree `.claude/worktrees/sic-before` (detached at `main`; nobody commits in it)
- No repository file changes.

**Interfaces:**
- Consumes: Phase 0 item 1 (fix wave A, round 2), already merged at `765521a`.
- Produces: `node $RUN/slot.mjs take <who>` prints the slot it took (`slot-1` … `slot-8`), waiting while none is free, and records no process (a slot taken by hand is freed only with `free`); `free <slot-N>`; `list`; `sweep` (frees the slots of a `run` whose own process and command have both ended; never a slot taken by hand, nor another project's plain `mkdir` slot, which has no `who.json`); `run <who> -- <command…>` (takes a slot, records its own pid and its command's, runs the command, frees the slot, exits with the command's code). Environment: `SLOT_POOL` (pool folder, default `$RUN/slots`), `SLOT_WAIT` (seconds, default 3600). The before-pictures site at `http://127.0.0.1:8800` (the pages of `main`).

- [ ] **Step 1: Confirm that Phase 0 item 1 is already in**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; git -C $REPO merge-base --is-ancestor f775fe1 feat/see-inside-compare && echo "fix wave A round 2 is in"; git -C $REPO log --oneline -1 765521a`
Expected: `fix wave A round 2 is in` and `765521a Merge the final review's fix wave A, round 2: …`. Then `cd $REPO && node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"`: `ℹ fail 0`. Write in the ledger (Step 7) that item 1 needed no work.

- [ ] **Step 2: Write the failing tests of the slot pool**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; mkdir -p $RUN/slots $RUN/lanes $RUN/briefs $RUN/checks $RUN/kit $RUN/scratch`

Create `$RUN/slot.test.mjs`:

```js
// Tests of slot.mjs: node --test slot.test.mjs (from the run folder). They use a pool of their own in the temp folder.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const POOL = mkdtempSync(join(tmpdir(), 'sic-pool-'));
process.env.SLOT_POOL = POOL;
const { tryTake, free, list, sweep } = await import('./slot.mjs');
const SLOT = join(import.meta.dirname, 'slot.mjs');
const env = extra => ({ env: { ...process.env, SLOT_POOL: POOL, ...extra }, encoding: 'utf8' });

test('eight slots, then none until one is freed', () => {
  const taken = Array.from({ length: 8 }, (_, i) => tryTake(`t${i}`));
  assert.deepEqual(taken, ['slot-1', 'slot-2', 'slot-3', 'slot-4', 'slot-5', 'slot-6', 'slot-7', 'slot-8']);
  assert.equal(tryTake('t9'), null);
  free('slot-3');
  assert.equal(tryTake('t10'), 'slot-3');
  assert.equal(list().length, 8);
  taken.forEach(free);
  assert.deepEqual(list(), []);
});

test('sweep frees a slot whose process has ended and keeps a live one', () => {
  tryTake('dead', 999999);
  tryTake('alive', process.pid);
  assert.deepEqual(sweep(), ['slot-1']);
  assert.deepEqual(list().map(s => s.who), ['alive']);
  free('slot-2');
});

test('sweep never frees a slot taken by hand, nor one whose command still runs after its run process ended', () => {
  tryTake('hand', null);
  tryTake('orphan', 999999);
  writeFileSync(join(POOL, 'slot-2', 'who.json'), JSON.stringify({ who: 'orphan', pid: 999999, child: process.pid, since: new Date().toISOString() }));
  assert.deepEqual(sweep(), []);
  assert.deepEqual(list().map(s => s.who), ['hand', 'orphan']);
  free('slot-1');
  free('slot-2');
});

test('run takes a slot, passes on the exit code and frees the slot afterwards', () => {
  const r = spawnSync(process.execPath, [SLOT, 'run', 'tester', '--', process.execPath, '-e', 'process.exit(3)'], env({}));
  assert.equal(r.status, 3);
  assert.deepEqual(list(), []);
});

test('run waits while every slot is taken, and gives up after SLOT_WAIT', () => {
  for (let i = 0; i < 8; i++) tryTake(`busy${i}`);
  const r = spawnSync(process.execPath, [SLOT, 'run', 'late', '--', process.execPath, '-e', '0'], env({ SLOT_WAIT: '1' }));
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /no slot came free/);
  for (let n = 1; n <= 8; n++) free(`slot-${n}`);
});
```

- [ ] **Step 3: Run them and see them fail**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $RUN && node --test slot.test.mjs`
Expected: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…slot.mjs'`, then `✖ slot.test.mjs` and `ℹ fail 1`.

- [ ] **Step 4: Write the slot pool**

Create `$RUN/slot.mjs`:

```js
#!/usr/bin/env node
// The machine-wide pool of page-check slots: at most eight Chrome runs at once (page checks and review-kit runs, of every
// project running at the time). A run takes a slot by creating its folder, which fails when the folder is there already, so two
// runs never take the same slot; it frees the slot by removing the folder. Not part of the repository.
//   node slot.mjs take <who>                 takes a free slot and prints its name (slot-1 … slot-8); waits while none is free;
//                                            records no process, so only free frees it
//   node slot.mjs free <slot-N>              frees that slot
//   node slot.mjs list                       prints the slots taken, by whom and since when
//   node slot.mjs sweep                      frees the slots of a run whose own process and command have both ended (a run killed
//                                            before it could free its slot); never a slot taken by hand, nor a slot with no
//                                            who.json (another project's plain mkdir slot)
//   node slot.mjs run <who> -- <command…>    takes a slot, runs the command (its output shown as it comes), frees the slot when
//                                            the command ends or on Ctrl+C, and exits with the command's exit code
// SLOT_POOL sets the pool folder (default: slots/ beside this file); SLOT_WAIT the longest wait for a free slot, in seconds
// (default 3600).
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const POOL = process.env.SLOT_POOL || join(HERE, 'slots');
const SIZE = 8;
const WAIT_MS = Number(process.env.SLOT_WAIT ?? 3600) * 1000;
const sleep = ms => new Promise(done => setTimeout(done, ms));

// Takes the first free slot for `who` (pid: the process that holds it, or null for none, which sweep never frees) and returns
// its name, or null when all eight are taken.
export function tryTake(who, pid = process.pid) {
  mkdirSync(POOL, { recursive: true });
  for (let n = 1; n <= SIZE; n++) {
    const dir = join(POOL, `slot-${n}`);
    try { mkdirSync(dir); } catch (err) { if (err.code === 'EEXIST') continue; throw err; }
    writeFileSync(join(dir, 'who.json'), JSON.stringify({ who, pid, since: new Date().toISOString() }));
    return `slot-${n}`;
  }
  return null;
}
export async function take(who, pid) {
  for (const end = Date.now() + WAIT_MS; ; await sleep(2000)) {
    const slot = tryTake(who, pid);
    if (slot) return slot;
    if (Date.now() >= end) throw new Error(`no slot came free in ${WAIT_MS / 1000} s`);
  }
}
export function free(slot) {
  if (!/^slot-[1-8]$/.test(slot)) throw new Error(`not a slot: ${slot}`);
  rmSync(join(POOL, slot), { recursive: true, force: true });
}
export function list() {
  if (!existsSync(POOL)) return [];
  return readdirSync(POOL).filter(n => /^slot-[1-8]$/.test(n)).sort().map(slot => {
    let info = {};
    try { info = JSON.parse(readFileSync(join(POOL, slot, 'who.json'), 'utf8')); } catch { /* a slot being taken right now */ }
    return { slot, ...info };
  });
}
const alive = pid => { try { process.kill(pid, 0); return true; } catch (err) { return err.code === 'EPERM'; } };
// A slot is swept when its run's own process has ended and so has the command it started (a run stopped hard, as a stopped
// background command on Windows is, can leave its command and Chrome running)
export function sweep() {
  const freed = list().filter(s => s.pid && !alive(s.pid) && !(s.child && alive(s.child))).map(s => s.slot);
  freed.forEach(free);
  return freed;
}

async function main(argv) {
  const [cmd, ...rest] = argv;
  // From the command line no process outlives this call that the pool could watch (Git Bash runs node under a stub that
  // ends with it), so a slot taken by hand records none: sweep never frees it, and it is freed by hand with free.
  if (cmd === 'take' && rest[0]) { console.log(await take(rest[0], null)); return 0; }
  if (cmd === 'free' && rest[0]) { free(rest[0]); return 0; }
  if (cmd === 'list') {
    for (const s of list()) console.log(`${s.slot}  ${s.who || '?'}  pid ${s.pid || '?'}  since ${s.since || '?'}`);
    return 0;
  }
  if (cmd === 'sweep') { console.log(sweep().join(' ') || 'nothing to free'); return 0; }
  if (cmd === 'run' && rest[0] && rest[1] === '--' && rest.length > 2) {
    const slot = await take(rest[0]);
    const child = spawn(rest[2], rest.slice(3), { stdio: 'inherit', shell: false });
    // The slot names this process and the command's, so sweep frees it only once both have ended
    writeFileSync(join(POOL, slot, 'who.json'), JSON.stringify({ who: rest[0], pid: process.pid, child: child.pid, since: new Date().toISOString() }));
    let done = false;
    const finish = code => { if (done) return; done = true; free(slot); process.exit(code); };
    for (const signal of ['SIGINT', 'SIGTERM', 'SIGBREAK', 'SIGHUP']) process.on(signal, () => { child.kill(); finish(130); });
    child.on('error', err => { console.error(`could not start ${rest[2]}: ${err.message}`); finish(127); });
    child.on('exit', code => finish(code ?? 1));
    return new Promise(() => {}); // finish() ends the process
  }
  console.error('usage: node slot.mjs take <who> | free <slot-N> | list | sweep | run <who> -- <command…>');
  return 2;
}
if (resolve(process.argv[1] || '').toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  main(process.argv.slice(2)).then(code => process.exit(code), err => { console.error(err.message); process.exit(1); });
}
```

- [ ] **Step 5: Run the tests and see them pass**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $RUN && node --test slot.test.mjs`
Expected: `ℹ tests 5`, `ℹ pass 5`, `ℹ fail 0`. Then `node $RUN/slot.mjs list` prints nothing, or only other projects' slots (shown with `?`).

- [ ] **Step 6: The before-pictures checkout and its server**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; git -C $REPO worktree add --detach $REPO/.claude/worktrees/sic-before main`
Then start, as a background command: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-before && python -m http.server 8800 --bind 127.0.0.1`
Check: `curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8800/animations/02-entrance-and-exit/fade-in-out/` prints `200`. This server stays up for the whole run (Tasks 6 to 14 read it). Nobody commits in `sic-before`; when `main` moves (the finder or Famous effects going live), refresh it with `git -C $REPO/.claude/worktrees/sic-before checkout --detach main` (neither project changes an animation page, so Normal's before-pictures stay valid).

- [ ] **Step 7: The ledger and the rulings file**

Create `$RUN/ledger.md`:

```markdown
# SDD ledger: docs/superpowers/plans/2026-10-13-see-inside-compare-phase0-first-batch.md

Branch feat/see-inside-compare (main checkout, never switched). Run folder .superpowers/sdd/2026-10-13-see-inside-compare/.
Slot pool: node slot.mjs run <who> -- <command> (8 at once, every project). Before-pictures: sic-before (detached main) on 8800.

Task 0: Phase 0 item 1 (fix wave A, round 2) already merged at 765521a; tests pass; pool and before-pictures server ready.
```

Create `$RUN/first-batch-rulings.json` (read by the review kit, Task 5 and Task 14):

```json
{
  "shrinks": ["animations/01-scroll-based/parallax-scrolling/"],
  "mistakes": ["animations/05-text-typography/marquee-ticker/", "animations/07-ambient-background/flow-field/"]
}
```

- [ ] **Step 8: No commit**

Everything in this task is git-ignored or a worktree; `git -C $REPO status --short` shows nothing new. Tell the finder's and Famous effects' coordinators (the same main session) that `slot.mjs` is ready in the pool they already use: their plain mkdir/rmdir slots work beside `slot.mjs`; nothing to change.

- [ ] **Step 9: Review (a fresh agent)**

A fresh reviewer gets this task and reads `$RUN/slot.mjs` and `$RUN/slot.test.mjs`, then runs `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $RUN && node --test --test-reporter=spec slot.test.mjs 2>&1 | grep -E "^ℹ (pass|fail)"` (`ℹ pass 5`, `ℹ fail 0`). They confirm: two runs never take the same slot; `take` from the command line records no process, so no `sweep` frees a slot whose check is still running; `sweep` frees only a slot whose `run` process and command have both ended, never another project's plain slot (no `who.json`); `run` frees its slot when the command ends or on a signal and passes on the command's exit code. Their findings are fixed before Task 1 starts; a ledger line.

---

### Task 1: The learning path and the idea lessons wait on `feat/learn-pilot` (the clean-up)

**Files:**
- Delete: `learn/index.html`, `learn/follows-the-scroll/index.html`, `learn/far-things-move-slower/index.html`, `tests/learn.test.js`
- Modify: `animations/01-scroll-based/parallax-scrolling/index.html` (line 85, the lesson line; line 175, the See inside note; lines 235-240, the lesson nav; script lines 275 and 332)
- Modify: `assets/css/demo-page.css` (lines 198-214, 234-235, 262-268, 331-333)
- Modify: `tools/check-pages.mjs` (line 4; lines 42-43; lines 76-93; line 113; line 118; lines 130-134)
- Modify: `tests/pages.test.js` (top requires; the stylesheet test, lines 561-608; a new guard test after it)
- Modify: `assets/js/demo-page.js` (line 10), `tests/demo-page.test.js` (lines 132 and 278)
- Modify: `docs/superpowers/specs/2026-10-13-learn-pilot-design.md` (a status line under its title)
- Line numbers are those of `03a00d0`.

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: ONE commit, `chore: the learning path and the idea lessons wait on feat/learn-pilot`, that the learning path's resumption will revert (fix rounds amend it: the spec wants one commit to revert). After it: no `learn/`, no lesson CSS, no `learn` target in the page check, Parallax's See inside note is a plain `<p data-hb-for="inside" hidden>` that the script writes with `insideNote.textContent` (no `span.say`), and a guard test `while the learning path waits, no tracked page links into learn/ and the shared stylesheet has none of its rules`.

- [ ] **Step 1: The lane**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; git -C $REPO worktree add -b sic/00a $REPO/.claude/worktrees/sic-00a feat/see-inside-compare`
Work in `$REPO/.claude/worktrees/sic-00a` for the rest of this task.

- [ ] **Step 2: Write the failing guard test**

In `tests/pages.test.js`, after the line `const vm = require('node:vm');` add:

```js
const { execFileSync } = require('node:child_process');
```

After the test that starts `test('the shared stylesheet draws the mode switch beside the Watch heading` (it ends just before `test('the home page uses Schibsted Grotesk and asks what to animate'`), add:

```js
// The learning path and the idea lessons wait on feat/learn-pilot (docs/superpowers/specs/2026-10-13-see-inside-compare-rollout-design.md,
// section 5): no tracked page links into learn/ and the shared stylesheet keeps none of their rules. Delete this test when the
// learning path resumes (its first step reverts the clean-up commit, which takes this test away too).
test('while the learning path waits, no tracked page links into learn/ and the shared stylesheet has none of its rules', () => {
  let pages;
  try {
    pages = execFileSync('git', ['ls-files', '--', '*.html'], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split(/\r?\n/).filter(Boolean);
  } catch {
    // No git here (a copy from a source zip): every page in the folder, outside git's, the agents' and the packages' folders
    const walk = dir => fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap(e => e.isDirectory()
      ? (['.git', '.claude', '.superpowers', 'node_modules'].includes(e.name) ? [] : walk(path.join(dir, e.name)))
      : e.name.endsWith('.html') ? [path.join(dir, e.name)] : []);
    pages = walk('');
  }
  assert.ok(pages.length > 100, `the tracked pages are found (${pages.length})`);
  const linking = pages.filter(f => /href="(?:(?:\.\.\/)+|\/animation-handbook\/)?learn\//.test(read(path.join(ROOT, f))));
  assert.deepEqual(linking, [], 'pages that link into learn/');
  assert.ok(!fs.existsSync(path.join(ROOT, 'learn')), 'the learn/ folder is gone');
  const css = read(path.join(ROOT, 'assets', 'css', 'demo-page.css')).replace(/\/\*[\s\S]*?\*\//g, '');
  for (const name of ['hb-lesson', 'hb-why', 'hb-seen', 'hb-learn', 'hb-path']) assert.ok(!css.includes(name), `no ${name} rule`);
});
```

- [ ] **Step 3: Run it and see it fail**

Run: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-00a && node --test --test-reporter=spec tests/pages.test.js 2>&1 | grep -E "^✖ |AssertionError|^ℹ (pass|fail)|parallax-scrolling/index.html"`
Expected: `ℹ fail 1` and `✖ while the learning path waits, no tracked page links into learn/ and the shared stylesheet has none of its rules` (named again under `✖ failing tests:`), with `AssertionError [ERR_ASSERTION]: pages that link into learn/` and lines that list only `'animations/01-scroll-based/parallax-scrolling/index.html'` (the lesson pages link to each other without the `learn/` part, so only Parallax is listed; the folder and the CSS assertions would fail next).

- [ ] **Step 4: Remove the learning path's files**

Run: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-00a && git rm -q -r learn tests/learn.test.js`

- [ ] **Step 5: Parallax Scrolling without its lesson line, lesson nav and lesson link**

In `animations/01-scroll-based/parallax-scrolling/index.html`:

Delete the line
```html
    <p class="hb-lesson"><a href="../../../learn/">Learning path · Lesson 22 of 25</a></p>
```

Replace
```html
      <p data-hb-for="inside" hidden><span class="say">Inside, the picture is four flat layers. As the box scrolls, the far layers move least and the near grass moves most. Scroll the box or press Play to watch.</span> <a href="../../../learn/far-things-move-slower/">The idea: far things move slower</a></p>
```
with
```html
      <p data-hb-for="inside" hidden>Inside, the picture is four flat layers. As the box scrolls, the far layers move least and the near grass moves most. Scroll the box or press Play to watch.</p>
```

Delete these six lines (between `</section>` of `section.hb-related` and `</main>`):
```html
  <nav class="hb-lesson-nav" aria-label="Learning path">
    <h2 class="hb-lesson-title">Learning path</h2>
    <a class="hb-lesson-prev" href="../../../learn/far-things-move-slower/"><span>← Lesson 21</span><b>Far things move slower</b></a>
    <a class="hb-lesson-next" href="../../06-3d-advanced/parallax-3d-tilt/"><span>Lesson 23 →</span><b>Parallax 3D Tilt</b></a>
    <a class="hb-lesson-all" href="../../../learn/">All 25 lessons</a>
  </nav>
```

In the script replace `  const insideSay   = document.querySelector('[data-hb-for="inside"] .say');` with `  const insideNote  = document.querySelector('[data-hb-for="inside"]');` and `    insideSay.textContent   = notes.inside;` with `    insideNote.textContent  = notes.inside;`.

- [ ] **Step 6: The shared stylesheet without the lesson CSS**

In `assets/css/demo-page.css` delete, exactly:

the block (lines 198-214)
```css
/* The learning path: the lesson line beside the category line (below it on phones), the previous and next lessons at the end
   of a page of the path, and an idea lesson's Why it works and Where you'll see it */
.hb-lesson{margin:0;font:600 14px/1.3 var(--hb-font);letter-spacing:.02em}
.hb-lesson a{color:var(--hb-dim);text-decoration:underline;text-decoration-color:var(--hb-edge-2);text-underline-offset:4px}
.hb-lesson-nav{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;padding-top:clamp(28px,4vw,36px);border-top:1px solid var(--hb-line)}
.hb-lesson-title{grid-column:1/-1;margin:0;font:700 22px/1.2 var(--hb-font);letter-spacing:-.01em;color:var(--hb-ink)}
.hb-lesson-prev,.hb-lesson-next{display:flex;flex-direction:column;gap:6px;padding:18px 20px;border:1px solid rgba(255,255,255,.12);
  border-radius:10px;text-decoration:none}
.hb-lesson-next{grid-column:2;text-align:right}
.hb-lesson-prev span,.hb-lesson-next span{font:600 14px/1.3 var(--hb-font);color:var(--hb-accent)}
.hb-lesson-prev b,.hb-lesson-next b{font:700 18px/1.25 var(--hb-font);color:var(--hb-ink)}
.hb-lesson-all{grid-column:1/-1;justify-self:start;display:inline-flex;align-items:center;min-height:44px;color:var(--hb-dim);
  font:600 15px/1 var(--hb-font)}
.hb-why,.hb-seen{padding-top:clamp(28px,4vw,36px);border-top:1px solid var(--hb-line)}
.hb-why h2,.hb-seen h2{margin:0 0 12px;font:700 22px/1.2 var(--hb-font);letter-spacing:-.01em;color:var(--hb-ink)}
.hb-why p{margin:0;max-width:68ch;font:400 17px/1.7 var(--hb-font);color:var(--hb-dim)}
.hb-why p+p{margin-top:12px}
```
and the blank line after it; the two hover rules inside `@media(hover:hover){…}`
```css
  .hb-lesson-prev:hover,.hb-lesson-next:hover{border-color:color-mix(in srgb,var(--hb-accent) 55%,transparent)}
  .hb-lesson a:hover,.hb-lesson-all:hover{color:var(--hb-ink)}
```
the whole 601px block with its comment
```css
/* From 601px the lesson line shares the category line's row, at its right end, so the header grows no taller */
@media(min-width:601px){
  .hb-head:has(> .hb-lesson){display:grid;grid-template-columns:auto minmax(0,1fr);column-gap:16px}
  .hb-head:has(> .hb-lesson) > *{grid-column:1/-1}
  .hb-head:has(> .hb-lesson) > .hb-cat{grid-column:1}
  .hb-head:has(> .hb-lesson) > .hb-lesson{grid-column:2;justify-self:end;align-self:center}
}
```
and the three phone rules at the end of `@media(max-width:600px){…}`
```css
  .hb-lesson a{display:inline-flex;align-items:center;min-height:44px}
  .hb-lesson-nav{grid-template-columns:minmax(0,1fr)}
  .hb-lesson-next{grid-column:auto}
```

- [ ] **Step 7: The page check without the `learn` target**

In `tools/check-pages.mjs`:

Line 4 becomes
```js
// Usage: node tools/check-pages.mjs [--base http://127.0.0.1:8731] [--out <folder>] <page or category folder, or home>...
```

Delete lines 42-43:
```js
// "learn" stands for the Learn page and every idea lesson in learn/: the page checks run there too, without the prompt parts
// (chips, What it is), and each lesson's kind is worked like any other page's. "learn/index.html" is the Learn page alone.
```

Replace the page list (from `const pages = args.map(` to the `process.exit(2);` of its usage error, then `}`) with:
```js
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
```

In `CHECK`, delete the line `  const learn = document.body.classList.contains('hb-learn');`, remove `, .hb-lesson a, .hb-lesson-nav a, .hb-path a` from the small-target selector list (it then ends `… .hb-star-row a, .hb-rel')]`), and replace
```js
  // Learn pages have no prompt, so no chips, and no README
  if (!learn && chips !== controls) problems.push('chips ' + chips + ' vs settings ' + controls);
  const what = document.querySelector('.hb-what-text');
  if (!learn && (!what || !what.querySelector('p'))) problems.push('What it is is missing');
  else if (!learn && what.querySelector('a[href="README.md"]')) problems.push('What it is did not load from the README');
```
with
```js
  if (chips !== controls) problems.push('chips ' + chips + ' vs settings ' + controls);
  const what = document.querySelector('.hb-what-text');
  if (!what || !what.querySelector('p')) problems.push('What it is is missing');
  else if (what.querySelector('a[href="README.md"]')) problems.push('What it is did not load from the README');
```

- [ ] **Step 8: The stylesheet test without the lesson selectors**

In `tests/pages.test.js`, in the test that starts `test('the shared stylesheet draws the mode switch beside the Watch heading and the note beside a short player bar from 761px, hides an empty notes box, and styles the lesson line, the lesson nav and the idea lessons\' sections'`:
- its title becomes `'the shared stylesheet draws the mode switch beside the Watch heading and the note beside a short player bar from 761px, and hides an empty notes box'`;
- the selector loop becomes `for (const sel of ['.hb-page .seg.hb-modes', '.hb-mode-notes p']) assert.ok(has(sel), sel);` (one line in place of the two);
- delete its last assertion, `assert.match(css, /@media\(min-width:601px\)\{\s*\.hb-head:has\(> \.hb-lesson\)\{display:grid/, 'from 601px the lesson line shares the category row');`.

- [ ] **Step 9: The shared script's comment and its test's words**

In `assets/js/demo-page.js` line 10, `Pages without a prompt (the idea lessons) get everything but the prompt parts.` becomes `Pages without a prompt get everything but the prompt parts.`

In `tests/demo-page.test.js` line 132, `// for Compare; noPrompt leaves the prompt out, as on an idea lesson.` becomes `// for Compare; noPrompt leaves the prompt out.`; line 278's title `'a page with no prompt, such as an idea lesson, still gets its player: a scroll page scrolls on arrival and notes reduced motion'` becomes `'a page with no prompt still gets its player: a scroll page scrolls on arrival and notes reduced motion'`.

- [ ] **Step 10: The pilot spec's status line**

In `docs/superpowers/specs/2026-10-13-learn-pilot-design.md`, between the title line `# Learn pilot: design` and the blank line after it, add a blank line and:

```markdown
> **Status (2026-10-13):** See inside (A) and Compare (B) roll out to every page by `2026-10-13-see-inside-compare-rollout-design.md`.
> The learning path (C) and Motion basics (D) wait on `feat/learn-pilot`; the commit "chore: the learning path and the idea lessons
> wait on feat/learn-pilot" took them off `feat/see-inside-compare`, and reverting it is the first step when they resume.
```

- [ ] **Step 11: Run the tests and the leftovers search**

Run: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-00a && node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)|^✔ while the learning path waits"`
Expected: `✔ while the learning path waits, no tracked page links into learn/ …` and `ℹ fail 0`.
Run: `git grep -n -e "hb-lesson" -e "hb-learn" -e "hb-why" -e "hb-seen" -e "hb-path" -e "idea lesson" -e "learn/" -- . ':!docs' ':!tests/pages.test.js'`
Expected: no output.
Run the same search on `-- tests/pages.test.js` alone: `git grep -n -e "hb-lesson" -e "hb-learn" -e "hb-why" -e "hb-seen" -e "hb-path" -e "idea lesson" -e "learn/" -- tests/pages.test.js`
Expected: only the six lines of the guard test (its two comment lines, its title, the two assertion messages and the list of names).

- [ ] **Step 12: Page check**

Start, as a background command: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-00a && python -m http.server 8801 --bind 127.0.0.1`
Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $REPO/.claude/worktrees/sic-00a && node $RUN/slot.mjs run sic-00a -- node tools/check-pages.mjs --base http://127.0.0.1:8801 --out $RUN/checks/sic-00a animations/01-scroll-based/parallax-scrolling home`
Expected: twelve `ok` lines. Open `$RUN/checks/sic-00a/01-parallax-scrolling-desktop-full.png` (Read tool): the header has the category line and the title, with no lesson line; the page ends with Similar animations and the footer, with no Learning path. `grep -c learn tools/check-pages.mjs` prints `0`. Stop the server.

- [ ] **Step 13: Commit (one commit)**

```bash
cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-00a
git add animations/01-scroll-based/parallax-scrolling/index.html assets/css/demo-page.css assets/js/demo-page.js tests/demo-page.test.js tests/pages.test.js tools/check-pages.mjs docs/superpowers/specs/2026-10-13-learn-pilot-design.md
git status --short   # 4 lines "D " (staged by Step 4) and 7 lines "M ", nothing unstaged
git commit -m "chore: the learning path and the idea lessons wait on feat/learn-pilot"
git show --stat HEAD | tail -12
git show --stat HEAD | tail -1
```
Expected: 11 files changed (4 deleted); the last line starts `11 files changed`. If it does not, stop before the review. Fix rounds after review use `git commit --amend --no-edit` on this same commit, so the clean-up stays one commit to revert.

- [ ] **Step 14: Review and merge (coordinator)**

A fresh reviewer gets: spec section 5, this task, and `git -C $REPO/.claude/worktrees/sic-00a show HEAD`. They confirm every item of section 5's Removed, Kept and Added lists (Kept: the boot without a prompt and its test, the underlined note link rule and the test that every note link opens an existing page), that the commit is the only one on `sic/00a`, and that nothing outside those lists changed. Then:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook
cd $REPO && git merge --no-ff sic/00a -m "Merge Phase 0, Task 1: the learning path and the idea lessons wait on feat/learn-pilot"
node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"
git worktree remove .claude/worktrees/sic-00a && git branch -d sic/00a
```
Expected: `ℹ fail 0`. Write the clean-up commit's hash in the ledger (the commit to revert later).

---
### Task 2: Shared script: a mode press plays the demo once (ruling 1), Copy prompt only with a prompt, the event order pinned

**Files:**
- Modify: `assets/js/demo-page.js` (header comment lines 9-10; `setUpModes`, lines 488-509; the call `if (copyBtn) setUpCopy();`, line 543)
- Test: `tests/demo-page.test.js` (the `standInPage` helper, lines 125-188; new tests after `'the mode switch gives the class on to the pressed mode only'`)
- Line numbers are those of `03a00d0` (Task 1 changes only one comment line and one test title in these files).

**Interfaces:**
- Consumes: Task 1's merge.
- Produces: after the page's `hb:mode` listeners have run for See inside or Compare (the pressed mode too), the shared script clicks `[data-hb-replay]` on a `data-hb-kind="once"` page or `[data-hb-demo]` on a `data-hb-kind="do"` page, once; never under reduced motion, never after Normal, never on scroll or loop pages. A mode press on a do-it page counts as the visitor's action, so the Show me press on arrival is skipped. `setUpCopy` runs only when the page has a prompt. Task 3's page check waits for the run this press starts.

- [ ] **Step 1: The lane**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; git -C $REPO worktree add -b sic/00b $REPO/.claude/worktrees/sic-00b feat/see-inside-compare`
Work in `$REPO/.claude/worktrees/sic-00b`.

- [ ] **Step 2: Extend the stand-in page in `tests/demo-page.test.js`**

In `standInPage`:

Replace `  const timers = [], sent = [];` with:
```js
  const timers = [], sent = [], log = [];
```

In the `node()` factory replace `click() { this.clicks++; }` with:
```js
click() { this.clicks++; if (this.onClick) this.onClick(); }
```

Replace `  const stage = node(), player = node(), prompt = node(), demo = node(), play = node(), top = node();` with:
```js
  const stage = node(), player = node(), prompt = node(), demo = node(), play = node(), top = node(), replay = node();
  // A loop's Pause button: the shared script looks for its label inside it
  const pause = Object.assign(node(), { querySelector: () => null });
  replay.onClick = () => log.push('Replay');
  demo.onClick = () => log.push('Show me');
```

In the `wanted` object add, after `'[data-hb-demo]': kind === 'do' && demo,`:
```js
    '[data-hb-replay]': kind === 'once' && replay, '[data-hb-pause]': kind === 'loop' && pause,
```

Replace `dispatchEvent: event => sent.push(event),` in `doc` with:
```js
dispatchEvent: event => {
    // What the page could see when hb:mode reached it: the stage's mark, the pressed buttons and the notes on show
    if (event.type === 'hb:mode') {
      event.seen = { mark: stage.getAttribute('data-hb-mode'), pressed: modeButtons.map(b => b.getAttribute('aria-pressed')), shown: notes.map(n => !n.hidden) };
      log.push('hb:mode ' + event.detail.mode);
    }
    sent.push(event);
  },
```

Replace the return line with:
```js
  return { doc, win, stage, player, demo, play, replay, pause, button, anchors, sent, log, modeButtons, notes,
    runTimers: () => timers.forEach(t => t.fn()), timerDelays: () => timers.map(t => t.ms) };
```

Extend the helper's comment (the paragraph above `function standInPage`) with two lines:
```js
// A plays-once page also has Replay and a loop has Pause; `log` keeps, in order, every hb:mode sent and every press of Replay
// or Show me, and each hb:mode event carries `seen`: the stage's mark, the buttons' aria-pressed and the notes on show then.
```

- [ ] **Step 3: Write the failing tests** (after the test `'the mode switch gives the class on to the pressed mode only'`)

```js
test('a mode press changes the buttons, the notes and the stage mark before hb:mode is sent', () => {
  const page = standInPage('scroll', false, {}, null, null, { modes: true });
  page.modeButtons[1].emit('click', visitor);
  page.modeButtons[2].emit('click', visitor);
  assert.deepEqual(page.sent.filter(e => e.type === 'hb:mode').map(e => e.seen), [
    { mark: 'inside', pressed: ['false', 'true', 'false'], shown: [true, false] },
    { mark: 'compare', pressed: ['false', 'false', 'true'], shown: [false, true] }
  ]);
});

test('See inside and Compare play a plays-once page once, pressing Replay after hb:mode; the pressed mode again plays again; Normal plays nothing', () => {
  const page = standInPage('once', false, {}, null, null, { modes: true });
  const [normal, inside, compare] = page.modeButtons;
  inside.emit('click', visitor);
  compare.emit('click', visitor);
  compare.emit('click', visitor);
  normal.emit('click', visitor);
  assert.deepEqual(page.log, ['hb:mode inside', 'Replay', 'hb:mode compare', 'Replay', 'hb:mode compare', 'Replay', 'hb:mode normal']);
});

test('See inside and Compare press Show me on a do-it page after hb:mode, and the Show me press on arrival is then skipped', () => {
  const page = standInPage('do', false, {}, null, null, { modes: true });
  page.modeButtons[2].emit('click', visitor);
  assert.deepEqual(page.log, ['hb:mode compare', 'Show me']);
  page.runTimers();
  assert.equal(page.demo.clicks, 1, 'the press on arrival is skipped: the visitor acted first');
});

test('under reduced motion a mode press plays nothing', () => {
  for (const kind of ['once', 'do']) {
    const page = standInPage(kind, true, {}, null, null, { modes: true });
    page.modeButtons[1].emit('click', visitor);
    page.modeButtons[2].emit('click', visitor);
    assert.deepEqual(page.log, ['hb:mode inside', 'hb:mode compare'], kind);
  }
});

test('a mode press plays nothing on a scroll page or a loop', () => {
  const scroll = standInPage('scroll', false, {}, null, null, { modes: true });
  scroll.modeButtons[1].emit('click', visitor);
  assert.equal(scroll.play.clicks, 0, 'Play is not pressed');
  const loop = standInPage('loop', false, {}, null, null, { modes: true });
  loop.modeButtons[2].emit('click', visitor);
  assert.equal(loop.pause.clicks, 0, 'Pause is not pressed');
  assert.deepEqual(loop.log, ['hb:mode compare']);
});

test('a page without a prompt does not set up Copy prompt, even when it has the button', () => {
  const page = standInPage('once', false, {}, { prompt: '', controls: null, clipboard: { writeText: () => Promise.resolve() } }, null, { noPrompt: true });
  assert.equal((page.button.handlers.click || []).length, 0);
});
```

- [ ] **Step 4: Run them and see them fail**

Run: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-00b && node --test --test-reporter=spec tests/demo-page.test.js 2>&1 | grep -E "^✖ |^ℹ (pass|fail)"`
Expected: `ℹ fail 3`, and the `✖` lines (each failing test is named twice: in the run, then again under `✖ failing tests:`) name three tests: `✖ See inside and Compare play a plays-once page once…` (the log has no `Replay`), `✖ See inside and Compare press Show me on a do-it page…` (no `Show me`), `✖ a page without a prompt does not set up Copy prompt…` (one click handler). The event-order test, the reduced-motion test and the scroll-or-loop test already pass: they pin what must not change. See the event-order test fail once by mutation: in `assets/js/demo-page.js` move the line `doc.dispatchEvent(new win.CustomEvent('hb:mode', { detail: { mode: mode } }));` to the top of `choose()`, run the file again (the event-order test fails), and put the line back.

- [ ] **Step 5: Implement in `assets/js/demo-page.js`**

In the header comment replace the two lines
```js
 * The mode switch (Normal, See inside, Compare) marks the stage with data-hb-mode, shows that mode's note and sends
 * "hb:mode", so the page draws the mode. Pages without a prompt get everything but the prompt parts.
```
with
```js
 * The mode switch (Normal, See inside, Compare) marks the stage with data-hb-mode, shows that mode's note and sends
 * "hb:mode", so the page draws the mode; after See inside or Compare it plays the demo once (Replay or Show me), except under
 * reduced motion. Pages without a prompt get everything but the prompt parts.
```

Replace the whole `setUpModes` function and its comment with:
```js
    // See inside and Compare: the mode switch above the stage. Pressing a mode presses its button (one at a time), marks the
    // stage with data-hb-mode and shows the note for that mode (Normal has none), and only then sends "hb:mode", so the page
    // finds the buttons, the notes and the mark already changed when it draws the mode. A press on the mode already pressed
    // sends "hb:mode" again. Nothing scrolls and nothing takes focus, and a running Play goes on: the switch sits outside the
    // stage, whose input stops Play.
    // Once the page has drawn See inside or Compare, the demo plays once by itself so the view is seen working: Replay on a
    // plays-once page, Show me on a do-it page (a press of a mode is the visitor acting, so the Show me press on arrival is then
    // skipped). Never under reduced motion, never after Normal, never on a scroll page (Play is there for that) or a loop (it is
    // already moving). The page's own hb:mode listener presses nothing.
    function setUpModes() {
      var buttons = Array.prototype.slice.call(modesCtl.querySelectorAll('[data-hb-mode]'));
      var notes = Array.prototype.slice.call(page.querySelectorAll('[data-hb-for]'));
      var kind = doc.body.getAttribute('data-hb-kind');
      function playOnce() {
        if (reduce && reduce.matches) return;
        if (kind === 'once' && replayCtl) replayCtl.click();
        else if (kind === 'do' && demoCtl) { visitorActed = true; demoCtl.click(); }
      }
      function choose(mode) {
        buttons.forEach(function (b) {
          var on = b.getAttribute('data-hb-mode') === mode;
          b.classList.toggle('on', on);
          b.setAttribute('aria-pressed', String(on));
        });
        notes.forEach(function (n) { n.hidden = n.getAttribute('data-hb-for') !== mode; });
        if (stage) stage.setAttribute('data-hb-mode', mode);
        doc.dispatchEvent(new win.CustomEvent('hb:mode', { detail: { mode: mode } }));
        if (mode !== 'normal') playOnce();
      }
      buttons.forEach(function (b) {
        b.addEventListener('click', function () { choose(b.getAttribute('data-hb-mode')); });
      });
      if (stage) stage.setAttribute('data-hb-mode', 'normal');
    }
```

Replace `    if (copyBtn) setUpCopy();` with:
```js
    if (promptEl && copyBtn) setUpCopy();
```

(`visitorActed` is a `var` of `boot()` declared above `setUpModes`, at line 418; `setUpModes()` is called at the end of `boot()`, after that declaration has run.)

- [ ] **Step 6: Run all tests**

Run: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-00b && node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)|^✔ (a mode press|See inside and Compare|under reduced motion a mode press|a page without a prompt does not set up)"`
Expected: the six new tests' `✔` lines and `ℹ fail 0`.

- [ ] **Step 7: A real page still behaves**

Start, as a background command: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-00b && python -m http.server 8802 --bind 127.0.0.1`
Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $REPO/.claude/worktrees/sic-00b && node $RUN/slot.mjs run sic-00b -- node tools/check-pages.mjs --base http://127.0.0.1:8802 --out $RUN/checks/sic-00b animations/01-scroll-based/parallax-scrolling animations/02-entrance-and-exit/fade-in-out animations/04-micro-interactions/magnetic-button`
Expected: eighteen `ok` lines (Parallax is a scroll page, so nothing is pressed after a mode press; the other two have no switch yet and must be exactly as before). Stop the server.

- [ ] **Step 8: Commit**

```bash
cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-00b
git add assets/js/demo-page.js tests/demo-page.test.js
git commit -m "feat: pressing See inside or Compare plays a plays-once or do-it demo once (never under reduced motion), and Copy prompt is set up only on a page with a prompt"
```

- [ ] **Step 9: Review and merge (coordinator)**

A fresh reviewer gets spec section 4 item 4, ruling 1, this task and `git -C $REPO/.claude/worktrees/sic-00b diff feat/see-inside-compare...sic/00b`; they confirm each case of ruling 1 has a test, that pages without the switch take exactly the old path (no new code runs without `[data-hb-modes]`), and that the shared script never presses anything for a page's own `hb:mode` listener. Then `cd $REPO && git merge --no-ff sic/00b -m "Merge Phase 0, Task 2: a mode press plays the demo once, and Copy prompt only with a prompt"`, tests (`node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"`: `ℹ fail 0`), `git worktree remove .claude/worktrees/sic-00b && git branch -d sic/00b`, a ledger line.

---

### Task 3: Page check: the do-it path, rest as 750 ms unchanged, waiting for the run a mode press starts, and captions, ids and names in every mode

**Files:**
- Modify: `tools/check-pages.mjs`: the header paragraph that starts `// A page with the mode switch (Normal, See inside, Compare)` (lines 26-41 at `03a00d0`); `settledShot` (lines 285-296) becomes `restShot`, and `stillShot` (lines 336-347) goes; two lines of `movementProblems` (308 and 312); a new `TIMERS` constant after `STARS` (after line 187); new `waitForRun`, `pictureName` and `captionProblems` after `watchStepShot` (after line 420); `modeProblems` (lines 422-575: its comment, `look` and everything after `capture`); one line before `await send('Page.addScriptToEvaluateOnNewDocument', { source: RECORD });` (line 1253). Task 1 removed about a dozen lines above some of these; find each place by the code quoted below.
- Create (outside the repository): `$FX/sic-gen.mjs`
- Modify (outside the repository): `$FX/README.md` (a new section 0 after its title)

**Interfaces:**
- Consumes: Task 1's merge (no `learn` target, no `hb-learn` exceptions). Ruling 1 as Task 2 builds it (the fixtures' inline script stands in for it, so this task does not wait for Task 2).
- Produces: `restShot(wait = 0)` → `{ shot, still }` (rest = the stage unchanged for 750 ms, four captures 250 ms apart, up to 10 s); `waitForRun()` → `true` when no page timer of 6 s or less is waiting and no finite animation on the stage runs, three looks in a row (up to 12 s); `captionProblems(label)` → problem strings; `pictureName()` → the stage's (or its canvas's or picture's) `aria-label`, or `null`; the instrumentation `TIMERS` (`window.__hbWaiting()`). Problem messages the builders will meet: `the demo does not come to rest before the modes are tried (…)`, `<Mode>: the run it started does not end within 12 s`, `the stage does not come to rest in <Mode>`, `<Mode>: the box changes size (Npx, not Mpx)`, `<Mode>: the player bar moves (Npx below the top of the box, not Mpx)`, `<Mode>: N labels (at most M here)`, `<Mode>: the label "…" is not inside the stage`, `<Mode>: the label "…" is drawn at Npx (at least 12px)`, `<Mode>: the labels "…" and "…" overlap`, `<Mode>: ids used twice: …`, `<Mode>: the control "…" is named "…", which leaves out its visible words`, `the picture's name is the same in <Mode> and <Mode>: "…"`.

- [ ] **Step 1: The lane**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; git -C $REPO worktree add -b sic/00c $REPO/.claude/worktrees/sic-00c feat/see-inside-compare`
Work in `$REPO/.claude/worktrees/sic-00c`.

- [ ] **Step 2: Write the fixture site (the failing test)**

The fixtures are this task's test: small guided-steps pages with the switch, some right and some with one defect each, in one site root with its own copy of the check. The pilot's roots used the `learn` target, which Task 1 removed, so the new generator puts them in four fixture categories. Create `$FX/sic-gen.mjs`:

```js
// Fixture site for the page check, rollout Phase 0 (Task 3 of docs/superpowers/plans/2026-10-13-see-inside-compare-phase0-first-batch.md).
// Not part of the repository. Builds one site root holding a copy of a worktree's tools/check-pages.mjs and four fixture
// categories. Every page is a small guided-steps page with the mode switch, driven by an inline script in place of the shared
// script (it also plays a plays-once or do-it demo once after See inside or Compare, as the shared script does since Phase 0),
// some right and some with one deliberate defect each:
//   animations/90-ok        the pages that are right (fix wave A's faA, without the Learn page)
//   animations/91-old       the defects of the pilot's first rounds (faB)
//   animations/92-wave-a    the rules added in fix wave A (faC)
//   animations/93-phase0    the rules added in Phase 0: the do-it path, runs that hold still, captions, ids, names, snapping, resizes,
//                           the box's size
// usage: node sic-gen.mjs <root to build> <worktree with tools/check-pages.mjs>
// The root folder itself stays (a server may be running in it); its animations/ and tools/ are written again.
import { copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const [OUT, WT] = process.argv.slice(2).map(p => (p ? resolve(p) : p));
if (!OUT || !WT || !existsSync(join(WT, 'tools', 'check-pages.mjs'))) {
  console.error('usage: node sic-gen.mjs <root to build> <worktree with tools/check-pages.mjs>');
  process.exit(2);
}
const WRAP_RULE = '.hb-mode-notes:not(:has([data-hb-for]:not([hidden]))){position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}';
const OLD_RULE = '.hb-mode-notes:not(:has(> p:not([hidden]))){position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}';

const CSS = `
:root{--bg:#0e0e11;--ink:#f2f2f4;--accent:#c8f169}
*{box-sizing:border-box}
html,body{margin:0}
body{background:var(--bg);color:var(--ink);font:16px/1.4 system-ui,sans-serif}
a{color:var(--accent)}
.hb-bar{display:flex;gap:8px;padding:4px 16px}
.hb-bar a,.hb-foot a{display:inline-flex;align-items:center;min-height:44px;min-width:44px;padding:0 12px}
.hb-page{max-width:1000px;margin:0 auto;padding:0 16px 24px;display:flex;flex-direction:column;gap:10px}
.hb-head h1{margin:0;font-size:clamp(24px,5vw,40px)}
.hb-head p{margin:2px 0}
.hb-page button{min-height:44px;min-width:44px;padding:0 14px;border:1px solid #666;background:none;color:inherit;border-radius:8px;font:inherit;cursor:pointer}
.hb-page button[aria-pressed=true]{border-color:var(--accent);color:var(--accent)}
.seg{display:flex;flex-wrap:wrap;gap:8px}
.stage{position:relative;height:240px;overflow:hidden;border:1px solid #444;border-radius:8px;background:#1b1b22}
[data-hb-kind=scroll] .stage{overflow-y:auto;overflow-x:hidden}
[data-hb-kind=scroll] .stage.inner{overflow:hidden}
.inner .scroller{height:100%;overflow-y:auto;overflow-x:hidden}
[data-hb-autoscrolling]{scroll-snap-type:none!important}
.hb-player{display:flex;gap:8px;align-items:center;flex-wrap:wrap;min-height:44px}
.hb-switch-row{display:inline-flex;align-items:center;gap:8px;min-height:44px;min-width:44px}
.hb-mode-notes p,.hb-what-text p{margin:4px 0}
.hb-chips{margin:0;padding:0;list-style:none}
.hb-foot{display:flex;gap:16px;padding:8px 16px;flex-wrap:wrap}
.scene{position:relative;width:100%;height:100%}
.scene.tall{height:1400px;background:repeating-linear-gradient(#1b1b22 0 120px,#2a2a55 120px 240px)}
.pin{position:sticky;top:0;height:240px;width:100%}
.box{position:absolute;left:12%;top:40%;width:70px;height:70px;border-radius:10px;background:#66ccff}
.twin{position:absolute;left:55%;top:40%;width:70px;height:70px;border-radius:10px;background:#ffcc66}
.tag{position:absolute;left:12%;top:10%;padding:8px 12px;border-radius:6px;background:#ff66cc;color:#111;font-weight:700}
.wide{height:4px;width:3000px;background:#ff3333}
@keyframes slide{from{transform:translateX(0)}to{transform:translateX(420%)}}
.sq{animation:slide 3s linear infinite alternate}
.stage.hb-paused .sq{animation-play-state:paused}
@keyframes rise{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}
.stage.go .box{animation:rise .8s ease both}
@keyframes reveal{from{opacity:0}to{opacity:1}}
.stage.delay.go .box{animation:reveal .5s ease .9s both}
@keyframes wander{from{transform:translateX(0)}to{transform:translateX(60px)}}
.wander{animation:wander 1.7s linear infinite}
.cap{position:absolute;padding:4px 8px;border-radius:6px;background:#111;color:#fff;font-weight:600;line-height:1.2;white-space:nowrap}
.box.slides{transition:transform .6s ease}
.stage.go-do .box{transform:translateX(160px)}
.badge{position:absolute;right:10%;top:12%;padding:6px 10px;border-radius:6px;background:#3c3;color:#111;font-weight:700}
.stagebtn{position:absolute;right:8px;bottom:8px}
canvas.dots{position:absolute;inset:0;width:100%;height:100%}
.snapbox{scroll-snap-type:y mandatory}
.snapscene .pinlayer{position:sticky;top:0;height:0;z-index:2}
.snapscene .sec{height:240px;scroll-snap-align:start;display:grid;place-items:center;font-size:28px;border-bottom:1px solid #333}
.stage.short .sec{height:200px}
`;

const SCRIPT = `
(function () {
  var D = __DEFECTS__;
  var stage = document.querySelector('.stage');
  var scroller = document.querySelector('[data-hb-scroller]') || stage;
  var kind = document.body.getAttribute('data-hb-kind');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tag = stage.querySelector('.tag'), twin = stage.querySelector('.twin'), wide = document.querySelector('.wide');
  var notes = document.querySelectorAll('[data-hb-for]');
  var buttons = document.querySelectorAll('.hb-modes [data-hb-mode]');
  var auto = false, raf = 0, last = null;
  function stopAuto() { cancelAnimationFrame(raf); raf = 0; auto = false; last = null; scroller.removeAttribute('data-hb-autoscrolling'); }
  // Labels (data-hb-caption) for the modes, each [left, top, words, size in px]: made once, shown in their own mode only
  if (D.caps) Object.keys(D.caps).forEach(function (m) {
    D.caps[m].forEach(function (c) {
      var el = document.createElement('span');
      el.className = 'cap cap-' + m; el.setAttribute('data-hb-caption', ''); el.hidden = true;
      el.style.left = c[0]; el.style.top = c[1]; el.style.fontSize = c[3] + 'px'; el.textContent = c[2];
      stage.appendChild(el);
    });
  });
  function draw(mode) {
    if (D.noReturn && mode === 'normal') return;
    var m = D.same && mode === 'compare' ? 'inside' : mode;
    tag.hidden = !(m === 'inside' && D.noChange !== 'inside');
    twin.hidden = !(m === 'compare' && D.noChange !== 'compare');
    if (wide) wide.hidden = D.overflow !== mode;
    stage.querySelectorAll('.cap').forEach(function (el) { el.hidden = !el.classList.contains('cap-' + mode); });
    if (D.label) stage.setAttribute('aria-label', D.label[mode]);
    if (D.dup && mode === 'compare' && !stage.querySelector('.dupcopy')) {
      var copy = document.createElement('span'); copy.id = 'dup'; copy.className = 'dupcopy'; copy.hidden = true; stage.appendChild(copy);
    }
    if (D.relayout) stage.classList.toggle('short', mode === 'inside');
  }
  if (D.label) stage.setAttribute('aria-label', D.label.normal);
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      var mode = b.getAttribute('data-hb-mode');
      buttons.forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      if (D.noMark !== mode) stage.setAttribute('data-hb-mode', mode);
      if (!(D.normalLeavesNote && mode === 'normal')) {
        notes.forEach(function (n) {
          var mine = n.getAttribute('data-hb-for') === mode;
          if (D.otherNote && mode !== 'normal') { if (mine) n.hidden = false; return; }
          n.hidden = !mine || D.noNote === mode;
        });
      }
      if (D.lateNormal && mode === 'normal') setTimeout(function () { draw(mode); }, D.lateNormal); else draw(mode);
      if (D.playStops && auto) stopAuto();
      if (D.resetBox) scroller.scrollTop = 0;
      if (D.scrollPage) window.scrollTo(0, 150);
      if (D.focusStage) { stage.setAttribute('tabindex', '-1'); stage.focus(); }
      if (D.focusButton) b.focus();
      document.dispatchEvent(new CustomEvent('hb:mode', { detail: { mode: mode } }));
      // As the shared script does: See inside or Compare plays a plays-once or do-it demo once, never under reduced motion
      if (!reduce && mode !== 'normal') {
        var sel = kind === 'once' ? '[data-hb-replay]' : kind === 'do' ? '[data-hb-demo]' : '';
        var run = sel && document.querySelector(sel);
        if (run) run.click();
      }
    });
  });
  if (D.jsDraw) {
    var drawn = stage.querySelector('.box'), ticking = false;
    var redraw = function () {
      var max = scroller.scrollHeight - scroller.clientHeight, p = max > 0 ? scroller.scrollTop / max : 0;
      drawn.style.transform = 'translateY(' + Math.round(p * 60) + 'px)';
      twin.style.transform = 'translateY(' + Math.round(p * 20) + 'px)';
      ticking = false;
    };
    scroller.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(redraw); } }, { passive: true });
    document.addEventListener('hb:mode', redraw);
    redraw();
  }
  if (kind === 'loop') {
    var pause = document.querySelector('[data-hb-pause]');
    var setPaused = function (p) { stage.classList.toggle('hb-paused', p); pause.setAttribute('data-state', p ? 'paused' : 'playing'); pause.textContent = p ? 'Play' : 'Pause'; };
    pause.addEventListener('click', function () { setPaused(pause.getAttribute('data-state') !== 'paused'); });
    setPaused(reduce);
  }
  if (kind === 'scroll') {
    var play = document.querySelector('[data-hb-autoscroll]'), top = document.querySelector('[data-hb-top]');
    var step = function (ts) {
      if (!auto) return;
      var dt = last === null ? 0 : Math.min(ts - last, 50); last = ts;
      var max = scroller.scrollHeight - scroller.clientHeight;
      scroller.scrollTop = Math.min(max, scroller.scrollTop + max / 6000 * dt);
      if (scroller.scrollTop >= max) { stopAuto(); return; }
      raf = requestAnimationFrame(step);
    };
    var startAuto = function () {
      stopAuto();
      if (scroller.scrollTop >= scroller.scrollHeight - scroller.clientHeight - 1) scroller.scrollTop = 0;
      scroller.setAttribute('data-hb-autoscrolling', '');
      auto = true; raf = requestAnimationFrame(step);
    };
    if (play) play.addEventListener('click', startAuto);
    if (top) top.addEventListener('click', function () { stopAuto(); scroller.scrollTop = 0; });
    ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(function (t) {
      stage.addEventListener(t, function (e) { if (e.isTrusted) stopAuto(); }, { passive: true });
    });
    if (!reduce) startAuto();
  }
  if (kind === 'once') {
    var replay = document.querySelector('[data-hb-replay]'), loop = document.querySelector('[data-hb-loop]'), slow = document.querySelector('[data-hb-slowmo]');
    var timer = 0;
    var playOnce = function () { stage.classList.remove('go'); void stage.offsetWidth; stage.classList.add('go'); };
    var tick = function () { clearTimeout(timer); if (loop.checked) { playOnce(); timer = setTimeout(tick, 2600); } };
    replay.addEventListener('click', function () { playOnce(); if (loop.checked) { clearTimeout(timer); timer = setTimeout(tick, 2600); } });
    loop.addEventListener('change', function () { if (loop.checked) tick(); else clearTimeout(timer); });
    // a setting change replays the stage 250 ms later, as the shared script does
    document.querySelectorAll('.hb-try .seg button').forEach(function (c) {
      c.addEventListener('click', function () {
        document.querySelectorAll('.hb-try .seg button').forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
        setTimeout(playOnce, 250);
      });
    });
    if (reduce) { loop.checked = false; slow.checked = false; loop.disabled = true; slow.disabled = true; playOnce(); }
    else { playOnce(); setTimeout(function () { loop.checked = true; tick(); }, 400); }
  }
  if (kind === 'do') {
    var demo = document.querySelector('[data-hb-demo]'), reset = document.querySelector('[data-hb-reset]');
    var mover = stage.querySelector('.box'), badge = stage.querySelector('.badge'), acted = false, runT = [], badgeT = 0;
    mover.classList.add('slides');
    var stopRun = function () { runT.forEach(clearTimeout); runT = []; stage.classList.remove('go-do'); };
    var endless = function () { setTimeout(endless, 500); };
    // Show me: the box slides across, holds still on a timer, and slides back (about two seconds); with D.endless it also
    // starts a chain of timers that never ends
    demo.addEventListener('click', function (e) {
      if (e.isTrusted) acted = true;
      stopRun();
      stage.classList.add('go-do');
      runT.push(setTimeout(function () { stage.classList.remove('go-do'); }, 600 + (D.hold || 1000)));
      if (D.endless) endless();
    });
    if (reset) reset.addEventListener('click', function () { stopRun(); clearTimeout(badgeT); badge.hidden = true; });
    // As the shared script does: the visitor's own input in the stage goes out as hb:input
    ['pointerdown', 'keydown', 'wheel', 'touchstart', 'click'].forEach(function (t) {
      stage.addEventListener(t, function (e) {
        if (!e.isTrusted) return;
        acted = true;
        document.dispatchEvent(new CustomEvent('hb:input', { detail: { type: t } }));
      }, { capture: true, passive: true });
    });
    // A click in the stage shows a result that goes back by itself on a timer
    stage.addEventListener('click', function (e) {
      if (!e.isTrusted || !D.revert) return;
      badge.hidden = false; clearTimeout(badgeT);
      badgeT = setTimeout(function () { badge.hidden = true; }, D.revert);
    });
    if (!reduce) setTimeout(function () { if (!acted) demo.click(); }, 400);
  }
  // A canvas of dots drawn again, at random, on every resize of the window, even one that leaves the stage as it was
  if (D.resizeCanvas) {
    var cv = document.createElement('canvas'); cv.className = 'dots'; cv.setAttribute('aria-hidden', 'true'); stage.prepend(cv);
    var paint = function () {
      cv.width = stage.clientWidth; cv.height = stage.clientHeight;
      var g = cv.getContext('2d'); g.fillStyle = '#7fd';
      for (var i = 0; i < 60; i++) { g.beginPath(); g.arc(Math.random() * cv.width, Math.random() * cv.height, 3, 0, 7); g.fill(); }
    };
    addEventListener('resize', paint); paint();
  }
})();
`;

function player(kind, d) {
  if (kind === 'loop') return '<button type="button" data-hb-pause data-state="playing">Pause</button>';
  if (kind === 'scroll') {
    const html = (d.dropPlay ? '' : '<button type="button" data-hb-autoscroll>Play</button>') + (d.dropTop ? '' : '<button type="button" data-hb-top>Back to top</button>');
    return html || '<span>Nothing to play</span>';
  }
  if (kind === 'once') {
    return '<button type="button" data-hb-replay>Replay</button>'
      + '<label class="hb-switch-row"><input type="checkbox" role="switch" class="hb-switch" data-hb-loop autocomplete="off"><span>Loop</span></label>'
      + '<label class="hb-switch-row"><input type="checkbox" role="switch" class="hb-switch" data-hb-slowmo autocomplete="off"><span>Slow motion</span></label>';
  }
  if (kind === 'do') return '<button type="button" data-hb-demo>Show me</button>' + (d.noReset ? '' : '<button type="button" data-hb-reset>Reset</button>');
  return '<span>Nothing to play</span>';
}

const MODE_BUTTONS = [
  ['normal', 'Normal', ' class="on" aria-pressed="true"'],
  ['inside', 'See inside', ' aria-pressed="false"'],
  ['compare', 'Compare', ' aria-pressed="false"']
];

function page({ title, kind = '', defects = {}, smallFoot = false, tryChoice = false, rule = '', wrapNotes = false, inner = false, pageTall = false, noWhat = false, snap = false }) {
  const autoplay = kind && kind !== 'loop' ? ' data-hb-autoplay' : '';
  const kindAttr = kind ? ` data-hb-kind="${kind}"` : '';
  const boxClass = ['box', kind === 'loop' ? 'sq' : '', defects.neverRest === 'always' ? 'wander' : ''].filter(Boolean).join(' ');
  const twinClass = ['twin', defects.neverRest === 'compare' ? 'wander' : ''].filter(Boolean).join(' ');
  const stageClass = ['stage', defects.delayReveal ? 'delay' : '', inner ? 'inner' : '', snap ? 'snapbox' : ''].filter(Boolean).join(' ');
  const footStyle = smallFoot ? ' style="min-height:0;height:24px"' : '';
  const dropped = defects.drop || [];
  const modeButtons = MODE_BUTTONS.filter(([m]) => !dropped.includes(m))
    .map(([m, label, extra]) => `<button type="button" data-hb-mode="${m}"${extra}>${label}</button>`).join('\n      ');
  const tryHtml = tryChoice
    ? '\n  <section class="hb-try"><div class="seg" role="group" aria-label="Speed"><button type="button" aria-pressed="true">Slow</button><button type="button" aria-pressed="false">Fast</button></div></section>'
    : '';
  const extras = (kind === 'do' ? '<span class="badge" hidden>Saved</span>' : '')
    + (defects.stageButton ? `<button type="button" class="stagebtn" aria-label="${defects.stageButton.label}">${defects.stageButton.text}</button>` : '')
    + (defects.dup ? '<span id="dup" hidden></span>' : '');
  let scene;
  if (snap) scene = `<div class="snapscene"><div class="pinlayer"><div class="tag" hidden>Inside</div><div class="${twinClass}" hidden></div></div>${[1, 2, 3, 4, 5].map(n => `<div class="sec">${n}</div>`).join('')}</div>`;
  else if (kind === 'scroll') scene = `<div class="scene tall"><div class="pin"><div class="${boxClass}"></div><div class="tag" hidden>Inside</div><div class="${twinClass}" hidden></div></div></div>`;
  else scene = `<div class="scene"><div class="${boxClass}"></div><div class="tag" hidden>Inside</div><div class="${twinClass}" hidden></div>${extras}</div>`;
  const stageInner = inner ? `<div class="scroller" data-hb-scroller>${scene}</div>` : scene;
  const noteP = `<p data-hb-for="inside" hidden>The inside note.</p>\n      <p data-hb-for="compare" hidden>The compare note.</p>`;
  const notesHtml = wrapNotes ? `<div class="wrap">\n      ${noteP}\n      </div>` : noteP;
  const what = noWhat ? '' : '\n  <section class="hb-about"><div class="hb-what-text"><p>A fixture page for the page check.</p></div></section>';
  const spacer = pageTall ? '\n  <div style="height:1500px"></div>' : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<link rel="icon" href="data:,">
<style>${CSS}${rule}</style>
</head>
<body class="hb"${kindAttr}${autoplay}>
<nav class="hb-bar" aria-label="Fixture"><a class="hb-home" href="../../../">Home</a><a class="hb-star" href="#">Star</a></nav>
<main class="hb-page">
  <header class="hb-head">
    <p class="hb-cat">Fixture</p>
    <h1>${title}</h1>
    <p class="hb-lede">A fixture page for the page check.</p>
  </header>
  <section class="hb-watch">
    <div class="hb-step-head"><h2>1 · Watch it</h2></div>
    <div class="seg hb-modes" role="group" aria-label="What the box shows" data-hb-modes>
      ${modeButtons}
    </div>
    <div class="${stageClass}" data-hb-mode="normal">${stageInner}</div>
    <div class="hb-player">${player(kind, defects)}</div>
    <div class="hb-mode-notes" aria-live="polite">
      ${notesHtml}
    </div>
  </section>${tryHtml}
  <section class="hb-prompt-step"><ul class="hb-chips">${tryChoice ? '<li>Speed: Slow</li>' : ''}</ul></section>${what}
  <div class="wide" hidden></div>${spacer}
</main>
<footer class="hb-foot"><span>Fixture</span><a href="#"${footStyle}>Source</a><a href="#top"${footStyle}>Back to top</a></footer>
<script>${SCRIPT.replace('__DEFECTS__', () => JSON.stringify(defects))}</script>
</body>
</html>
`;
}

const SETS = {
  '90-ok': {
    'ok-plain': { title: 'OK plain' },
    'ok-loop': { title: 'OK loop', kind: 'loop' },
    'ok-scroll': { title: 'OK scroll', kind: 'scroll' },
    'ok-scroll-inner': { title: 'OK scroll inner', kind: 'scroll', inner: true },
    'ok-once': { title: 'OK once', kind: 'once' },
    'ok-once-delay': { title: 'OK once delay', kind: 'once', tryChoice: true, defects: { delayReveal: true } },
    'ok-latenormal': { title: 'OK late Normal', defects: { lateNormal: 450 } },
    'ok-focusbutton': { title: 'OK focus on the button', defects: { focusButton: true } },
    'ok-wrapnote': { title: 'OK wrapped notes', wrapNotes: true, rule: WRAP_RULE },
    'ok-scroll-js': { title: 'OK scroll, drawn by script on scroll', kind: 'scroll', defects: { jsDraw: true } }
  },
  '91-old': {
    'bad-marks': { title: 'Bad marks', defects: { noMark: 'inside', noNote: 'compare', overflow: 'compare' } },
    'bad-pictures': { title: 'Bad pictures', defects: { noChange: 'inside', noReturn: true } },
    'bad-same': { title: 'Bad same', defects: { same: true } },
    'bad-playstops': { title: 'Bad play stops', kind: 'scroll', defects: { playStops: true } },
    'bad-othernote': { title: 'Bad other note', defects: { otherNote: true } },
    'bad-normal': { title: 'Bad Normal', defects: { noMark: 'normal', normalLeavesNote: true } },
    'bad-small': { title: 'Bad small', smallFoot: true },
    // was "not a Learn page" (the chips and What it is checks then apply): now a page without What it is
    'bad-notlearn': { title: 'Bad no What it is', noWhat: true }
  },
  '92-wave-a': {
    'bad-scrollsbox': { title: 'Bad scrolls the box', kind: 'scroll', defects: { resetBox: true } },
    'bad-focus': { title: 'Bad moves focus', defects: { focusStage: true } },
    'bad-scrollspage': { title: 'Bad scrolls the page', pageTall: true, defects: { scrollPage: true } },
    'bad-clipnote': { title: 'Bad clipped note', wrapNotes: true, rule: OLD_RULE },
    'bad-nobutton-a': { title: 'Bad no button A', defects: { drop: ['inside', 'normal'] } },
    'bad-nobutton-b': { title: 'Bad no button B', defects: { drop: ['compare'] } },
    'bad-scroll-nobuttons': { title: 'Bad scroll no buttons', kind: 'scroll', defects: { dropPlay: true, dropTop: true } },
    'bad-neverrest-compare': { title: 'Bad never rest compare', defects: { neverRest: 'compare' } },
    'bad-neverrest-always': { title: 'Bad never rest always', defects: { neverRest: 'always' } }
  },
  '93-phase0': {
    'ok-do-revert': { title: 'OK do-it page whose result goes back on a timer', kind: 'do', defects: { revert: 2000, hold: 1000 } },
    'ok-loop-resize': { title: 'OK paused loop that redraws on every resize', kind: 'loop', defects: { resizeCanvas: true } },
    'ok-snap': { title: 'OK scroll snapping', kind: 'scroll', snap: true },
    'ok-captions': { title: 'OK labels, names and ids', defects: {
      caps: { inside: [['8%', '10%', 'Inside label', 13], ['8%', '70%', 'Another label', 13]], compare: [['8%', '10%', 'Without', 13], ['55%', '10%', 'With', 13]] },
      label: { normal: 'A fixture picture', inside: 'The fixture picture taken apart', compare: 'The fixture picture twice, without and with' },
      stageButton: { text: 'Start now', label: 'Start now, the fixture demo' } } },
    // a control whose only visible sign is a symbol, named in words: a symbol is not a word
    'ok-glyph-name': { title: 'OK sign named in words', defects: { stageButton: { text: '×', label: 'Close the panel' } } },
    'bad-caption-small': { title: 'Bad small label', defects: { caps: { inside: [['8%', '10%', 'Tiny label', 10]] } } },
    'bad-caption-outside': { title: 'Bad label outside the stage', defects: { caps: { inside: [['8%', '-40px', 'Outside label', 13]] } } },
    'bad-caption-overlap': { title: 'Bad labels on each other', defects: { caps: { inside: [['8%', '10%', 'First label', 13], ['10%', '12%', 'Second label', 13]] } } },
    'bad-caption-many': { title: 'Bad five labels', defects: { caps: { inside: [5, 23, 41, 59, 77].map((top, i) => ['4%', `${top}%`, `Label ${i + 1}`, 13]) } } },
    'bad-dup-id': { title: 'Bad copy keeps an id', defects: { dup: true } },
    'bad-label-same': { title: 'Bad name stays the same', defects: { label: { normal: 'A fixture picture', inside: 'A fixture picture', compare: 'A fixture picture' } } },
    'bad-name': { title: 'Bad control name', defects: { stageButton: { text: 'Start now', label: 'Open the menu' } } },
    'bad-snap-relayout': { title: 'Bad mode that changes the snapping content', kind: 'scroll', snap: true, defects: { relayout: true } },
    'bad-do-endless': { title: 'Bad run that never ends', kind: 'do', defects: { endless: true, noReset: true } },
    'bad-box-size': { title: 'Bad Compare that makes the box taller', rule: '.stage[data-hb-mode="compare"]{height:300px}' }
  }
};

rmSync(join(OUT, 'animations'), { recursive: true, force: true });
mkdirSync(join(OUT, 'tools'), { recursive: true });
copyFileSync(join(WT, 'tools', 'check-pages.mjs'), join(OUT, 'tools', 'check-pages.mjs'));
for (const [cat, pages] of Object.entries(SETS)) {
  for (const [slug, opts] of Object.entries(pages)) {
    mkdirSync(join(OUT, 'animations', cat, slug), { recursive: true });
    writeFileSync(join(OUT, 'animations', cat, slug, 'index.html'), page(opts));
  }
  console.log(`${cat}: ${Object.keys(pages).length} pages`);
}
console.log(`check script from ${WT}`);
```

- [ ] **Step 3: Run the fixtures with today's check and see the new rules go unchecked**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; FX=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/fixtures; mkdir -p $RUN/scratch/sic-00c/sicfx && node $FX/sic-gen.mjs $RUN/scratch/sic-00c/sicfx $REPO/.claude/worktrees/sic-00c`
Expected: `90-ok: 10 pages`, `91-old: 8 pages`, `92-wave-a: 9 pages`, `93-phase0: 15 pages`.
Start, as a background command: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.superpowers/sdd/2026-10-13-see-inside-compare/scratch/sic-00c/sicfx && python -m http.server 8809 --bind 127.0.0.1`
Run, as a background command (a fixture category takes about ten minutes): `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; S=$RUN/scratch/sic-00c; node $RUN/slot.mjs run sic-00c-before -- node $S/sicfx/tools/check-pages.mjs --base http://127.0.0.1:8809 --out $S/out-before animations/93-phase0 > $S/93-before.log 2>&1`
When it has ended (the log's last line is `Screenshots: …`), run `grep -E "^(ok|FAIL)" $S/93-before.log | cut -c1-90`.
Expected: `bad-caption-small`, `bad-caption-outside`, `bad-caption-overlap`, `bad-caption-many`, `bad-dup-id`, `bad-label-same`, `bad-name`, `bad-do-endless` and `bad-box-size` print `ok` at every setup (their rules do not exist yet); `ok-do-revert` prints `FAIL` at `desktop` and `phone-reduced` (the 250 ms rest catches the run's hold or the result that goes back on its timer); `bad-snap-relayout` prints `FAIL` at `desktop` and `phone-reduced` (the box rule of fix wave A). Keep the log for the review.

- [ ] **Step 4: Implement the check**

In `tools/check-pages.mjs`:

(a) Replace the header paragraph from `// A page with the mode switch (Normal, See inside, Compare): at every setup each mode marks the stage, shows its own note` down to `// mid-movement.` with:

```js
// A page with the mode switch (Normal, See inside, Compare): at every setup each mode marks the stage, shows its own note
// (one that is on show: rendered, not clipped away) and no other (Normal shows none) and overflows nothing, a mode change
// moves neither the page nor the keyboard focus (the pressed button itself may take it), and the box keeps its size and the
// player bar its place under it (a stage that grows with its text, hb-grow, aside). In each mode the labels and half names
// (data-hb-caption) on show must be inside the stage, at least 12px as drawn, clear of each other and at most six (four on
// phones); no id may be used twice (a copy that kept one); a control in the stage named with aria-label must say its visible
// words; and where the page names its picture (an aria-label on the stage, or on its canvas or picture), each mode must name it
// differently. A plays-once page is tried with Loop off and a do-it page from rest (Reset where it has one). On both, except under
// reduced motion, a press of See inside or Compare plays the demo once (the shared script presses Replay or Show me), and the
// check waits for that run to end (no timer of the page set for 6 s or less still waiting, no animation on the stage running
// apart from endless ones) and then for the stage to rest before it looks. Only setTimeout timers and animations are seen: a run
// driven by a frame loop or by setInterval shows only as a stage that changes, so a pause of 750 ms or more inside it would pass
// for rest (a run holds its pauses with setTimeout). The stage is at rest when it has not changed for 750 ms. The whole Watch
// step (its heading, the switch, the stage, the player bar and the notes) is saved as a screenshot of See inside and of Compare
// (Normal's is the setup's own screenshot); a mode button the page lacks is named. At the desktop and
// reduced-motion setups, with the stage at rest (a scroll page with its box at the middle of its range, a loop paused), the box
// does not scroll either, See inside and Compare must each change the stage and differ from each other, Normal must bring the
// first picture back, and on a scroll page Play must keep scrolling through a mode change. Each mode's screenshot is taken after
// that mode's own picture checks, by scrolling the page until the step shows and taking it with plain clips (in parts, joined,
// where it is taller than the window), so the window is not resized and no scroll box moves: the Normal check that follows sees
// the page as it was. Chrome's capture beyond the viewport, which resizes the window for a moment and sends every scroll box to
// the top (a page can redraw itself for that), is only the last resort for a step that cannot be made to show. Either way each of
// those two screenshots must show the stage as it was seen at rest in that mode (the stage is cut out of it and compared, and the
// screenshot taken again, after putting the box back, up to three more times if it differs). A stage that never comes to rest is
// a problem of its own, and nothing is compared with a frame taken in mid-movement.
```

(b) After the `STARS` constant (it ends with `})()\`;` after `try { localStorage.setItem('gh-star-count', …); } catch {}`) add the block below; the blank line before `const sleep` stays in place. (Not after `RECORD`: Famous effects rewrites the first line of the `STARS` comment, and a block there would meet that change in the merge.)

```js

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
```

(c) Replace the whole `settledShot` function and its comment (`// Waits 3 s for the demo to settle, then (for slower demos) until two captures 250ms apart match.` … `}`) with:

```js
// The stage once it has come to rest: after waiting `wait` ms, captures 250 ms apart until the picture has stayed the same for
// 750 ms (four captures in a row), for up to 10 s. still says whether it did; when it did not, shot is only the last frame of a
// movement that goes on and is not worth comparing with anything.
async function restShot(wait = 0) {
  if (wait) await sleep(wait);
  let shot = await stageShot(), same = 0;
  for (const end = Date.now() + 10000; Date.now() < end;) {
    await sleep(250);
    const next = await stageShot();
    if (next !== shot) { shot = next; same = 0; continue; }
    if (++same === 3) return { shot, still: true };
  }
  return { shot, still: false };
}
```

In `movementProblems` replace `const settled = await settledShot();` with `const settled = (await restShot(3000)).shot;` and `const settledAgain = await settledShot();` with `const settledAgain = (await restShot(3000)).shot;`.

Delete the whole `stillShot` function and its two-line comment (`// The stage once it has stopped changing: captures 250 ms apart until two in a row match (up to 4 s). still says whether it` … `}`).

(d) After the `watchStepShot` function (before the comment `// Pages with the mode switch: see the header comment.`) add:

```js
// After a press that may start a run (Replay or Show me, pressed by the shared script after a mode press, or Reset): waits until
// no timer of the page set for 6 s or less is waiting (TIMERS counts them) and no animation on the stage runs (one that never
// ends, such as a blinking caret, does not count), three looks in a row 100 ms apart, for up to 12 s. A run often holds still
// on a timer between two moves, so a stage that has not changed for a while is not yet a run that has ended. A frame loop or a
// setInterval is not seen here: such a run is waited for only by restShot, so its pauses must be setTimeout holds. Says whether
// it ended.
async function waitForRun() {
  const calm = () => evaluate(`(() => {
    const stage = document.querySelector('.hb-page .stage');
    const busy = document.getAnimations().some(a => {
      const t = a.effect && a.effect.target;
      return a.playState === 'running' && t && stage.contains(t) && a.effect.getComputedTiming().endTime !== Infinity;
    });
    return !busy && (window.__hbWaiting ? window.__hbWaiting() : 0) === 0;
  })()`);
  let quiet = 0;
  for (const end = Date.now() + 12000; Date.now() < end; await sleep(100)) {
    quiet = (await calm()) ? quiet + 1 : 0;
    if (quiet === 3) return true;
  }
  return false;
}

// The name the page gives its picture (the stage's aria-label, else its canvas's or picture's), or null where it gives none.
const pictureName = () => evaluate(`(() => {
  const stage = document.querySelector('.hb-page .stage');
  const named = stage.hasAttribute('aria-label') ? stage : stage.querySelector('canvas[aria-label], [role="img"][aria-label], svg[aria-label]');
  return named ? named.getAttribute('aria-label') : null;
})()`);

// The labels and half names (data-hb-caption) of the mode on show: every one that is drawn must be inside the stage, at least
// 12px as drawn (its smallest text, scaled as it is drawn) and clear of the others, and there are at most six (four on phones).
// No id may be used twice on the page (a copy that kept one), and a control in the stage that is named with aria-label must say
// its visible words. label names the mode in each problem.
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
    for (const c of stage.querySelectorAll('button, a[href], input, select, textarea, [role="button"], [role="link"], [role="switch"], [role="checkbox"], [role="tab"]')) {
      if (!c.getClientRects().length || c.closest('[inert], [aria-hidden="true"]')) continue;
      // a form field's value is not its label; only an input button shows its words as its value
      const shown = c.matches('input[type="button"], input[type="submit"], input[type="reset"]') ? c.value : c.matches('input, select, textarea') ? '' : c.innerText;
      const own = wordsOf(c.getAttribute('aria-label')), seen = wordsOf(shown);
      if (own && seen && !own.includes(seen)) out.push('the control "' + shown.replace(/\\s+/g, ' ').trim().slice(0, 40) + '" is named "' + c.getAttribute('aria-label') + '", which leaves out its visible words');
    }
    return out;
  })()`);
  return found.map(p => `${label}: ${p}`);
}
```

(e) Replace the comment above `async function modeProblems(name, setup, kind) {` (the three lines that start `// Pages with the mode switch: see the header comment.`) with:

```js
// Pages with the mode switch: see the header comment. name and setup name the screenshots; kind is the page kind. The page is
// left in Normal and, on a plays-once page, with Loop off; at the desktop and reduced-motion setups a loop is also left paused
// and a scroll page with Play stopped and the box at the top.
```

Inside `modeProblems` keep everything from its first line through the end of `const capture = async (mode, expected) => { … };` exactly as it is, except `look` and its comment (from `// What the page shows now:` to the `})()\`);` that ends `look`), which become:

```js
  // What the page shows now: the mark on the stage, the notes on show (by the mode each belongs to; a note counts only when the
  // box around the notes is rendered, taller than 1px, not clipped away), any sideways overflow, the box's height and how far
  // below its top the player bar starts (and whether the box grows with its text, hb-grow), and what the last press changed: the
  // page's scroll, the box's scroll, and keyboard focus (named when it went anywhere but to the pressed button).
  const look = () => evaluate(`(() => {
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
      box: !!was && !!box && Math.abs(box.scrollTop - was.top) >= 1,
      focus: was && a && a !== was.focus && a !== was.button ? name(a) : ''
    };
  })()`);
```

Replace everything after `capture` (from `const deep = !!(setup.moves || setup.reduce);` down to, but not including, the function's closing `}`) with:

```js
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
  if ((kind === 'once' || kind === 'do') && !(await waitForRun())) problems.push('the demo does not come to rest before the modes are tried (a timer or an animation of the page keeps going for 12 s)');
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
    const rest = await restShot();
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
  const shots = {}, named = {};
  for (const mode of ['inside', 'compare']) {
    const label = labels[mode];
    await settleBox();
    if (!(await press(mode))) continue;
    await sleep(700);
    const now = await look();
    if (now.mode !== mode) problems.push(`${label}: the stage is not marked data-hb-mode="${mode}"`);
    if (now.overflow) problems.push(`${label}: horizontal overflow`);
    if (!now.notes.includes(mode)) problems.push(`${label}: its note is not shown`);
    if (now.notes.some(n => n !== mode)) problems.push(`${label}: the other note is still shown`);
    unmoved(label, now);
    sized(label, now);
    if (runs && !(await waitForRun())) problems.push(`${label}: the run it started does not end within 12 s`);
    if (pictures || runs) {
      const rest = await restShot();
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
      const rest = await restShot();
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
```

(f) In the main block, **before** `await send('Page.addScriptToEvaluateOnNewDocument', { source: RECORD });` add (not after it: Famous effects changes the `STARS` line that follows it):

```js
  await send('Page.addScriptToEvaluateOnNewDocument', { source: TIMERS });
```

Check: `node --check tools/check-pages.mjs` prints nothing; `grep -n "settledShot\|stillShot" tools/check-pages.mjs` prints nothing.
Then the merge with the other projects' checks, each on its own (Git for Windows' `git.exe` cannot read `<(…)` paths, and the working file has CRLF, so LF copies in the scratch folder): `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; S=$RUN/scratch/sic-00c; cd $REPO/.claude/worktrees/sic-00c && tr -d '\r' < tools/check-pages.mjs > $S/ours.mjs; git show d3e1786:tools/check-pages.mjs > $S/base.mjs; for b in fx/check fx/frame af/check; do git rev-parse -q --verify $b > /dev/null || continue; git show $b:tools/check-pages.mjs > $S/theirs.mjs; git merge-file -p $S/ours.mjs $S/base.mjs $S/theirs.mjs > /dev/null; echo "$b $?"; done`
Expected: `fx/check 0`, `fx/frame 0`, `af/check 0` (no conflict; a branch already merged and deleted prints nothing).

- [ ] **Step 5: Run the fixtures with the new check and compare with the expected table**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cp $REPO/.claude/worktrees/sic-00c/tools/check-pages.mjs $RUN/scratch/sic-00c/sicfx/tools/`
Then start these four runs, each as a background command of its own (`<c>` is `90-ok`, `91-old`, `92-wave-a` and `93-phase0` in turn):
`REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; S=$RUN/scratch/sic-00c; node $RUN/slot.mjs run sic-00c-<c> -- node $S/sicfx/tools/check-pages.mjs --base http://127.0.0.1:8809 --out $S/out-<c> animations/<c> > $S/<c>.log 2>&1`
When the four have ended (each log's last line is `Screenshots: …`), run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; S=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare/scratch/sic-00c; for c in 90-ok 91-old 92-wave-a 93-phase0; do echo "$c: $(grep -c '^ok' $S/$c.log) ok, $(grep -c '^FAIL' $S/$c.log) FAIL"; done; grep '^FAIL' $S/93-phase0.log | cut -c1-140`
Expected:

| Category | Lines | Expected |
|---|---|---|
| `90-ok` | 60 | 60 `ok`, 0 `FAIL` |
| `91-old` | 48 | 15 `ok`, 33 `FAIL`: `bad-marks`, `bad-normal`, `bad-notlearn` (`What it is is missing`), `bad-othernote` (6 each); `bad-small` (`phone`, `phone-reduced`, `phone-small`: `small targets:` two footer links 24px tall); `bad-pictures`, `bad-same`, `bad-playstops` (`desktop`, `phone-reduced`) |
| `92-wave-a` | 54 | 16 `ok`, 38 `FAIL`: `bad-clipnote`, `bad-focus`, `bad-nobutton-a`, `bad-nobutton-b`, `bad-scrollspage` (6 each); `bad-scrollsbox`, `bad-scroll-nobuttons`, `bad-neverrest-compare`, `bad-neverrest-always` (`desktop`, `phone-reduced`) |
| `93-phase0` | 90 | 37 `ok`, 53 `FAIL`: `ok-do-revert`, `ok-loop-resize`, `ok-snap`, `ok-captions`, `ok-glyph-name` all `ok`; `bad-caption-small` (`See inside: the label "Tiny label" is drawn at 10.0px (at least 12px)`), `bad-caption-outside` (`See inside: the label "Outside label" is not inside the stage`), `bad-caption-overlap` (`See inside: the labels "First label" and "Second label" overlap`), `bad-dup-id` (`Compare: ids used twice: dup`), `bad-label-same` (`the picture's name is the same in Normal and See inside: "A fixture picture"`), `bad-name` (`See inside: the control "Start now" is named "Open the menu", which leaves out its visible words`), `bad-do-endless` (`the demo does not come to rest before the modes are tried (…)`), `bad-box-size` (`Compare: the box changes size (300px, not 240px)`): 6 each; `bad-caption-many` at `phone`, `phone-reduced`, `phone-small` (`See inside: 5 labels (at most 4 here)`); `bad-snap-relayout` at `desktop`, `phone-reduced` (`See inside: the box scrolled`) |

Every page of `90-ok`, `91-old` and `92-wave-a` passes or fails at exactly the setups the pilot's README gives for its faA, faB and faC (its Learn page aside). If a line differs, fix the check, not the fixture, unless the fixture is plainly wrong (then say so in the report). Stop the fixture server when done.

- [ ] **Step 6: Real pages**

Start, as a background command: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-00c && python -m http.server 8803 --bind 127.0.0.1`
Run, as a background command: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $REPO/.claude/worktrees/sic-00c && node $RUN/slot.mjs run sic-00c -- node tools/check-pages.mjs --base http://127.0.0.1:8803 --out $RUN/checks/sic-00c animations/01-scroll-based/parallax-scrolling animations/02-entrance-and-exit/fade-in-out animations/03-page-transitions/overlay-wipe animations/04-micro-interactions/magnetic-button animations/07-ambient-background/flow-field home > $RUN/checks/sic-00c.log 2>&1`
When it has ended: `grep -cE "^ok" $RUN/checks/sic-00c.log` prints `36` and `grep -c "^FAIL" $RUN/checks/sic-00c.log` prints `0`. Expected: 36 `ok` lines (Parallax runs the new mode code; the others run `restShot` in `movementProblems` and the `TIMERS` wrapper, which must change nothing). Stop the server.

- [ ] **Step 7: The fixtures' README**

In `$FX/README.md`, after its first line (the title), add:

```markdown

## 0. The rollout's fixture site (Phase 0, Task 3): `sic-gen.mjs`
`node sic-gen.mjs <root to build> <worktree with tools/check-pages.mjs>` builds one site root: a copy of that worktree's
`tools/check-pages.mjs` and four fixture categories under `animations/` (the check no longer has the `learn` target, so the
fixtures are pages of categories now). Serve the root (`python -m http.server <port> --bind 127.0.0.1`) and run the root's own
copy of the check on each category, through the slot pool:

    node <run folder>/slot.mjs run fixtures -- node <root>/tools/check-pages.mjs --base http://127.0.0.1:<port> --out <folder> animations/90-ok

After changing the check script, copy it into `<root>/tools/` (or build the root again while no server runs in it). Each page's
inline script stands in for the shared script, ruling 1 included: after See inside or Compare it presses Replay on a plays-once
page and Show me on a do-it page, not under reduced motion.

Expected with the check of Phase 0 Task 3 (six lines per page, one per setup):

| Category | Pages | Expected |
|---|---|---|
| `90-ok` | the ten pages of faA | 60 ok |
| `91-old` | the eight pages of faB (`bad-small` now has small footer links; `bad-notlearn` is now a page without What it is) | 33 FAIL: `bad-marks`, `bad-normal`, `bad-notlearn`, `bad-othernote` (6 each); `bad-small` (3 phones); `bad-pictures`, `bad-same`, `bad-playstops` (desktop and phone-reduced) |
| `92-wave-a` | the nine pages of faC | 38 FAIL: `bad-clipnote`, `bad-focus`, `bad-nobutton-a`, `bad-nobutton-b`, `bad-scrollspage` (6 each); `bad-scrollsbox`, `bad-scroll-nobuttons`, `bad-neverrest-compare`, `bad-neverrest-always` (desktop and phone-reduced) |
| `93-phase0` | `ok-do-revert` (a do-it page whose run holds still for a second and whose result goes back on a timer), `ok-loop-resize` (a paused loop that redraws on every resize), `ok-snap` (a snapping scroll page), `ok-captions` (labels, names and ids done right), `ok-glyph-name` (a control whose only visible sign is ×, named in words), and ten `bad-*` pages, one rule each | 53 FAIL: `bad-caption-small`, `bad-caption-outside`, `bad-caption-overlap`, `bad-dup-id`, `bad-label-same`, `bad-name`, `bad-do-endless`, `bad-box-size` (6 each); `bad-caption-many` (3 phones); `bad-snap-relayout` (desktop and phone-reduced) |

With the check before Phase 0 (`765521a`), `ok-do-revert` fails at desktop and phone-reduced and the nine new-rule `bad-*` pages
pass: that is the gap Phase 0 closed. The sections below are the history of the pilot's rounds; their roots (faA, faB, faC) use
the removed `learn` target and run only with the check of `765521a` or older.
```

- [ ] **Step 8: Commit**

```bash
cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-00c
git add tools/check-pages.mjs
git commit -m "feat: the page check waits for the run a mode press starts, tries do-it pages from rest, counts rest as 750 ms unchanged, and checks every mode's labels, ids and control names and the picture's name"
```
(`$FX/sic-gen.mjs` and `$FX/README.md` are git-ignored: name them in the report and the ledger.)

- [ ] **Step 9: Review and merge (coordinator)**

A fresh reviewer gets spec section 4 items 2 to 4 (the check's part), the pilot's final review part 1 Important 3 and part 3 Minor 5, this task, the diff, the four fixture logs and the `93-before.log` of Step 3; they rerun `90-ok` and `93-phase0` themselves (through the pool, as in Step 5 but into their own `$S/review-<c>.log` and `--out $S/out-review-<c>`), serving `$RUN/scratch/sic-00c/sicfx` on 8809 for the rerun (as a background command: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.superpowers/sdd/2026-10-13-see-inside-compare/scratch/sic-00c/sicfx && python -m http.server 8809 --bind 127.0.0.1`) and stopping it after, and confirm each expected line, that `waitForRun` cannot pass a run that holds on a timer, and that pages without the switch take the old path apart from `restShot` in `movementProblems`. Merge after Task 2 and Task 4: `cd $REPO && git merge --no-ff sic/00c -m "Merge Phase 0, Task 3: the mode check's do-it path, run waits, rest and caption checks"`, tests, worktree and branch removed, a ledger line.

---
### Task 4: Switch tests on every page that has the switch, the final gate, and Parallax's notes in two sentences

**Files:**
- Modify: `tests/pages.test.js` (the mode-switch block, lines 309-325 at `03a00d0`: the `MODES` constant and its `for` loop; one new stylesheet test after it)
- Modify: `animations/01-scroll-based/parallax-scrolling/index.html` (the two notes in the Watch step; the `NOTES` table's `moving` and `movingFlat.inside` and `stillFlat.compare` strings)

**Interfaces:**
- Consumes: Task 1's merge (Parallax's See inside note is a plain `<p>`).
- Produces: `const SWITCHED` (the pages the switch tests cover: today the pages with `data-hb-modes`; at integration the marked line becomes `const SWITCHED = steps;`, the final gate). For every page in `SWITCHED`: the existing template test, plus `<slug>: exactly two notes, See inside then Compare, each one or two sentences` and `<slug>: the page's script listens for hb:mode, and its styles mark modes on the stage only`. One stylesheet test: `on phones the mode switch's own rule outranks the rule for choice buttons, so its three buttons share the row equally`. Tasks 7 to 13 turn these tests on for their page by adding the switch.

- [ ] **Step 1: The lane**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; git -C $REPO worktree add -b sic/00d $REPO/.claude/worktrees/sic-00d feat/see-inside-compare`
Work in `$REPO/.claude/worktrees/sic-00d`.

- [ ] **Step 2: Write the failing tests**

In `tests/pages.test.js` replace the block from the comment `// The mode switch (See inside and Compare), exactly as in the template, between the Watch step's heading and its stage, with` down to the closing `}` of its `for` loop with:

```js
// The pages the switch tests cover. FINAL GATE: while the rollout runs these are the pages that have the switch; at integration
// this line becomes `const SWITCHED = steps;`, so an animation page without the switch fails
// (docs/superpowers/specs/2026-10-13-see-inside-compare-rollout-design.md, section 4, item 5).
const SWITCHED = steps.filter(d => pageOf(d).includes('data-hb-modes'));
// The mode switch (See inside and Compare), exactly as in the template, between the Watch step's heading and its stage, with
// a note for See inside and one for Compare after the player bar, both hidden until their mode is pressed.
const MODES = '<div class="seg hb-modes" role="group" aria-label="What the box shows" data-hb-modes><button type="button" data-hb-mode="normal" class="on" aria-pressed="true">Normal</button><button type="button" data-hb-mode="inside" aria-pressed="false">See inside</button><button type="button" data-hb-mode="compare" aria-pressed="false">Compare</button></div>';
// The notes box exactly: the See inside note, then the Compare note, each a direct child of the box and hidden at first.
const NOTES_BOX = /<div class="hb-mode-notes" aria-live="polite"><p data-hb-for="inside" hidden>((?:(?!<\/p>)[\s\S])*)<\/p><p data-hb-for="compare" hidden>((?:(?!<\/p>)[\s\S])*)<\/p><\/div>/;
const sentencesIn = html => decode(html.replace(/<[^>]+>/g, '')).split(/[.!?](?:\s|$)/).filter(s => s.trim()).length;
// The index of the bracket that closes the one at `at` in a script (round, square and curly brackets counted together),
// stepping over strings, template text (its ${…} parts are read as code), comments and regular expressions; -1 when it is
// never closed.
function closingOf(src, at) {
  let depth = 0;
  for (let i = at; i < src.length; i++) {
    const c = src[i];
    if (c === '"' || c === "'") {
      for (i++; i < src.length && src[i] !== c; i++) if (src[i] === '\\') i++;
    } else if (c === '`') {
      for (i++; i < src.length && src[i] !== '`'; i++) {
        if (src[i] === '\\') i++;
        else if (src[i] === '$' && src[i + 1] === '{') { i = closingOf(src, i + 1); if (i < 0) return -1; }
      }
    } else if (c === '/' && src[i + 1] === '/') {
      i = src.indexOf('\n', i);
      if (i < 0) return -1;
    } else if (c === '/' && src[i + 1] === '*') {
      i = src.indexOf('*/', i + 2) + 1;
      if (i < 1) return -1;
    } else if (c === '/' && /(?:^|[(,=:[!&|?{};])\s*$/.test(src.slice(Math.max(0, i - 80), i))) {
      // a regular expression: up to its closing slash, past escapes and character classes
      for (i++; i < src.length && src[i] !== '/'; i++) {
        if (src[i] === '\\') i++;
        else if (src[i] === '[') while (++i < src.length && src[i] !== ']') if (src[i] === '\\') i++;
      }
    } else if ('([{'.includes(c)) depth++;
    else if (')]}'.includes(c) && --depth === 0) return i;
  }
  return -1;
}
for (const d of SWITCHED) {
  test(`${d.slug}: the mode switch is as in the template, before the stage, with a note for See inside and Compare`, () => {
    const html = pageOf(d), flat = html.replace(/>\s+</g, '><');
    assert.equal(count(html, 'data-hb-modes'), 1, 'one mode switch');
    assert.ok(flat.includes(MODES), 'the mode switch is exactly as in the template');
    const watch = between(flat, '<section class="hb-step hb-watch"', '</section>');
    const at = watch.indexOf(MODES);
    const stageAt = watch.search(/<div class="stage[\s"]/);
    assert.ok(stageAt > -1 && at > watch.indexOf('<div class="hb-step-head">') && at < stageAt, 'between the heading and the stage');
    const notes = between(watch, '<div class="hb-mode-notes" aria-live="polite">', '</div>');
    assert.ok(notes && watch.indexOf(notes) > watch.indexOf('<div class="hb-player">'), 'the notes come after the player bar');
    for (const mode of ['inside', 'compare']) assert.equal(count(notes, `<p data-hb-for="${mode}" hidden>`), 1, `one ${mode} note, hidden at first`);
    for (const [, href] of notes.matchAll(/<a href="([^"]+)"/g)) assert.ok(isDemoDir(path.resolve(d.dir, href)), `note link ${href}`);
  });

  test(`${d.slug}: exactly two notes, See inside then Compare, each one or two sentences`, () => {
    const flat = pageOf(d).replace(/>\s+</g, '><');
    const box = between(flat, '<section class="hb-step hb-watch"', '</section>').match(NOTES_BOX);
    assert.ok(box, 'the notes box holds the See inside note and then the Compare note, each a direct child, and nothing else');
    for (const [i, name] of [[1, 'See inside'], [2, 'Compare']]) {
      const n = sentencesIn(box[i]);
      assert.ok(n >= 1 && n <= 2, `the ${name} note has ${n} sentences`);
    }
  });

  test(`${d.slug}: the page's script listens for hb:mode, and its styles mark modes on the stage only`, () => {
    const html = pageOf(d);
    const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n');
    assert.match(script, /document\.addEventListener\(\s*['"]hb:mode['"]/, 'the page script listens for hb:mode on document');
    // The listener is in place once the script has run: no load or DOMContentLoaded handler holds it, whether written in the call
    // or as a named function (a load listener for something else, such as Scrollspy Navigation's remeasure, is fine)
    const listen = script.search(/document\.addEventListener\(\s*['"]hb:mode['"]/);
    for (const m of script.matchAll(/addEventListener\(\s*['"](?:DOMContentLoaded|load)['"]\s*,\s*([A-Za-z_$][\w$]*)?\s*(\(|=>)?/g)) {
      const name = m[1] && !m[2] && !/^(?:function|async)$/.test(m[1]) ? m[1].replace(/\$/g, '\\$') : '';
      const def = name ? script.search(new RegExp(`function\\s+${name}\\s*\\(|\\b(?:const|let|var)\\s+${name}\\s*=`)) : -1;
      const from = name ? (def > -1 ? script.indexOf('{', def) : -1) : m.index + m[0].indexOf('(');
      if (from < 0) continue;
      const to = closingOf(script, from);
      assert.ok(!(listen > from && listen < (to < 0 ? script.length : to)),
        `the hb:mode listener is not in place at the top level: it waits for the page to load (${m[0].trim()}…)`);
    }
    const style = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');
    const marked = cssRules(style).flatMap(r => r.selector.split(',').map(s => s.trim())).filter(s => s.includes('data-hb-mode'));
    for (const sel of marked) {
      assert.ok(!/data-hb-mode=["']?normal/.test(sel), `no rule for Normal: ${sel}`);
      assert.match(sel, /\.stage\[data-hb-mode="(?:inside|compare)"\]/, `a mode rule names the stage: ${sel}`);
    }
  });
}

test("on phones the mode switch's own rule outranks the rule for choice buttons, so its three buttons share the row equally", () => {
  const bare = read(path.join(ROOT, 'assets', 'css', 'demo-page.css')).replace(/\/\*[\s\S]*?\*\//g, '');
  const modes = cssRules(blockOf(bare, '@media(max-width:760px){')).find(r => r.selector === '.hb-page .seg.hb-modes button');
  const seg = cssRules(blockOf(bare, '@media(max-width:600px){')).find(r => r.selector === '.hb-page .seg button');
  assert.ok(modes && /(^|;)\s*flex:\s*1 1 0\s*(;|$)/.test(modes.body), 'up to 760px the mode buttons share their row equally (flex: 1 1 0)');
  assert.ok(seg && /(^|;)\s*flex:/.test(seg.body), 'the phone rule for choice buttons sets flex too');
  assert.ok(outranks(specificity(modes.selector), specificity(seg.selector)), `${modes.selector} must outrank ${seg.selector}`);
});
```

- [ ] **Step 3: Run them and see them fail**

Run: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-00d && node --test --test-reporter=spec tests/pages.test.js 2>&1 | grep -E "^✖ |AssertionError"`
Expected: one failure, `✖ parallax-scrolling: exactly two notes, See inside then Compare, each one or two sentences` (named again under `✖ failing tests:`), with `AssertionError [ERR_ASSERTION]: the See inside note has 3 sentences`. The phone-rule test passes at once (it pins the specificity fix of the pilot); see it fail once by mutation: in `assets/css/demo-page.css` change `.hb-page .seg.hb-modes button{flex:1 1 0;padding:0 6px}` to `.hb-modes button{flex:1 1 0;padding:0 6px}`, run the same command (it fails: `✖ on phones the mode switch's own rule outranks …` with `.hb-modes button must outrank .hb-page .seg button`, or the rule is not found), and undo the change (`git checkout -- assets/css/demo-page.css`).

- [ ] **Step 4: Parallax Scrolling's notes in two sentences, its Compare note naming the halves**

In `animations/01-scroll-based/parallax-scrolling/index.html` replace the two notes with:

```html
      <p data-hb-for="inside" hidden>Inside, the picture is four flat layers: as the box scrolls, the far layers move least and the near grass moves most. Scroll the box or press Play to watch.</p>
      <p data-hb-for="compare" hidden>Without parallax (left), every layer moves the same and the picture looks flat; with parallax (right), each moves its own amount and it looks deep. Scroll the box or press Play to watch.</p>
```

In the script's `NOTES` table replace `moving` with the same two strings, `movingFlat.inside` and `stillFlat.compare` with two-sentence versions:

```js
    moving: {
      inside:  'Inside, the picture is four flat layers: as the box scrolls, the far layers move least and the near grass moves most. Scroll the box or press Play to watch.',
      compare: 'Without parallax (left), every layer moves the same and the picture looks flat; with parallax (right), each moves its own amount and it looks deep. Scroll the box or press Play to watch.',
    },
```
```js
      inside:  'Inside, the picture is four flat layers; Depth is set to Flat, so they all move the same and the picture looks flat. Scroll the box or press Play to watch.',
```
(that is `movingFlat.inside`)
```js
      compare: 'Both sides are shown still, as they stand halfway down the box; Depth is set to Flat, so they match. Pick another Depth in Try it to see the difference.',
```
(that is `stillFlat.compare`). The script overwrites the markup at load with `NOTES.moving` (or a variant), so the markup and `NOTES.moving` stay word for word the same.

- [ ] **Step 5: Run all tests**

Run: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-00d && node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)|^✔ parallax-scrolling: (the mode switch is as in the template|exactly two notes|the page's script listens)"`
Expected: the three switch tests' `✔` lines for Parallax and `ℹ fail 0`.

- [ ] **Step 6: Page check**

Start, as a background command: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-00d && python -m http.server 8804 --bind 127.0.0.1`
Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $REPO/.claude/worktrees/sic-00d && node $RUN/slot.mjs run sic-00d -- node tools/check-pages.mjs --base http://127.0.0.1:8804 --out $RUN/checks/sic-00d animations/01-scroll-based/parallax-scrolling`
Expected: six `ok` lines; in `01-parallax-scrolling-desktop-compare.png` the note under the stage reads the new Compare sentence. Stop the server.

- [ ] **Step 7: Commit**

```bash
cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-00d
git add tests/pages.test.js animations/01-scroll-based/parallax-scrolling/index.html
git commit -m "test: every page with the switch has two notes of one or two sentences, listens for hb:mode and marks modes on the stage only, behind one final-gate line; Parallax Scrolling's notes now say each view in two sentences"
```

- [ ] **Step 8: Review and merge (coordinator)**

A fresh reviewer gets spec section 4 item 5, this task and the diff; they confirm the final-gate line is the only switch between "pages with the switch" and "every page", and that each new test fails for the right reason: in the lane worktree they break Parallax's page one way at a time (a third `<p data-hb-for="inside" hidden>` note; a three-sentence Compare note; a rule `.stage[data-hb-mode="normal"] .layer{}`; a rule `[data-hb-mode="inside"] .layer{}`; the `hb:mode` listener wrapped in `document.addEventListener('DOMContentLoaded', () => { … })`), run `node --test tests/pages.test.js`, read the failure, and undo it with `git checkout -- animations/01-scroll-based/parallax-scrolling/index.html`. One change must pass, since the load rule is narrow (Scrollspy Navigation listens for `load` to measure again): `addEventListener('load', () => {});` added after the `hb:mode` listener; undo it the same way. They also confirm Parallax's notes still say what the visitor sees. Then `cd $REPO && git merge --no-ff sic/00d -m "Merge Phase 0, Task 4: the switch tests and the final gate"`, tests, worktree and branch removed, a ledger line.

---
### Task 5: The review kit for any list of pages: stills, clips, Normal before and after, galleries

**Files (all outside the repository, in `$KIT` = `.superpowers/sdd/2026-10-13-learn-pilot/review-kit/`):**
- Create: `$KIT/kit-lib.mjs` (pure helpers), `$KIT/record.test.mjs` (their tests)
- Rename: `$KIT/record.mjs` → `$KIT/record-pilot.mjs` (the pilot's kit, kept as it is; its md5 is `16954e07f433b77042dc5702b72dd26a`)
- Create: `$KIT/record.mjs` (the new kit), assembled from new code and four unchanged slices of `record-pilot.mjs`: lines 81-94 (settings), 110-293 (small helpers, ffmpeg and Chrome, the browser), 397-503 (recording and encoding a clip) and 605-617 (`runClip`)
- Modify: `$KIT/README.md` (a new section at the top)

**Interfaces:**
- Consumes: the slot pool (Task 0), the before-pictures server on 8800 (Task 0), `$RUN/first-batch-rulings.json` (Task 0). Ruling 1 as Task 2 builds it (the kit only presses the mode button; on pages of the first batch the shared script plays the demo).
- Produces: `node $KIT/record.mjs --base <url> [--before <url>] [--out <dir>] [--rulings <file>] [--only stills|clips|before] [--gallery] [--press <selector>]… [--clean] [--timed] [--keep-frames] <page or category folder>…`. `--press` (any number of times) presses those controls in order once each page has loaded, so a run pictures the views under another setting (acceptance line 7); it does not apply to the `--before` comparison. Outputs in `--out`: `stills/<NN>-<slug>-<mode>-<1280|375|375-reduced>.png`, `clips/<NN>-<slug>-clip-<mode>.mp4` and `.webp` (or `.gif`), `before/<NN>-<slug>-<1280|375>-main.png`, `-branch.png`, `-diff.png`, `index.html` (or `gallery-<NN>.html` with `--gallery`), `manifest.json`. Log lines a builder reads: `ok    <NN>-<slug>-before-1280  <any> of <total> pixels differ (<visible> visibly)`. Exit code 0 when the run finished (skips are not failures), 1 when an item failed twice, 2 for a bad argument or a site that does not answer.

- [ ] **Step 1: Write the failing tests of the kit's pure helpers**

Create `$KIT/record.test.mjs`:

```js
// Tests of the review kit's pure helpers: node --test record.test.mjs (from the kit's folder)
import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { expandPages, shortName, clipPlan, clipCaption, rulingsFor, countDiff, RULINGS } from './kit-lib.mjs';

const ROOT = fileURLToPath(new URL('../../../../', import.meta.url)); // the repository root

test('expandPages takes page and category folders in the order given, each page once', () => {
  const pages = expandPages(ROOT, ['animations/02-entrance-and-exit/fade-in-out', 'animations\\07-ambient-background',
    './animations/02-entrance-and-exit/fade-in-out/index.html']);
  assert.equal(pages[0], 'animations/02-entrance-and-exit/fade-in-out/');
  assert.ok(pages.includes('animations/07-ambient-background/flow-field/'));
  assert.equal(pages.filter(p => p.endsWith('/fade-in-out/')).length, 1);
  assert.deepEqual(pages.slice(1), [...pages.slice(1)].sort(), 'a category folder gives its pages in order');
  assert.throws(() => expandPages(ROOT, ['animations/99-nothing']), /not a page or a category folder/);
});

test('shortName names a page by its category number and slug', () => {
  assert.equal(shortName('animations/05-text-typography/marquee-ticker/'), '05-marquee-ticker');
});

test('clipPlan: Normal plays the demo its own way; a mode press plays plays-once and do-it pages by itself; a scroll page then gets Play', () => {
  assert.deepEqual(clipPlan('once', 'normal'), { mode: null, then: 'Replay' });
  assert.deepEqual(clipPlan('do', 'normal'), { mode: null, then: 'Show me' });
  assert.deepEqual(clipPlan('scroll', 'normal'), { mode: null, then: 'Play' });
  assert.deepEqual(clipPlan('loop', 'normal'), { mode: null, then: null });
  assert.deepEqual(clipPlan('once', 'inside'), { mode: 'inside', then: null });
  assert.deepEqual(clipPlan('do', 'compare'), { mode: 'compare', then: null });
  assert.deepEqual(clipPlan('scroll', 'compare'), { mode: 'compare', then: 'Play' });
  assert.match(clipCaption('do', 'inside'), /"See inside" is pressed, and the demo plays once by itself/);
});

test('rulingsFor names each ruling beside the picture or clip that shows it', () => {
  const flags = { shrinks: ['animations/01-scroll-based/parallax-scrolling/'], mistakes: ['animations/05-text-typography/marquee-ticker/'] };
  const fade = 'animations/02-entrance-and-exit/fade-in-out/', parallax = 'animations/01-scroll-based/parallax-scrolling/', marquee = 'animations/05-text-typography/marquee-ticker/';
  assert.deepEqual(rulingsFor(fade, 'once', 'clip', 'inside', 1280, flags), [1]);
  assert.deepEqual(rulingsFor(fade, 'once', 'clip', 'normal', 1280, flags), []);
  assert.deepEqual(rulingsFor(parallax, 'scroll', 'clip', 'inside', 1280, flags), [2]);
  assert.deepEqual(rulingsFor(marquee, 'loop', 'clip', 'compare', 1280, flags), [3]);
  assert.deepEqual(rulingsFor(marquee, 'loop', 'still', 'compare', 375, flags), [3, 4]);
  for (const n of [1, 2, 3, 4]) assert.match(RULINGS[n], new RegExp(`^Ruling ${n}: `));
});

test('countDiff counts the pixels that differ at all and those that differ visibly', () => {
  const a = new Uint8ClampedArray([0, 0, 0, 255, 10, 10, 10, 255, 100, 100, 100, 255]);
  const b = new Uint8ClampedArray([0, 0, 0, 255, 12, 10, 10, 255, 200, 100, 100, 255]);
  assert.deepEqual(countDiff(a, b), { any: 2, visible: 1, total: 3 });
});
```

- [ ] **Step 2: Run them and see them fail**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; cd $KIT && node --test record.test.mjs`
Expected: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…kit-lib.mjs'`, then `✖ record.test.mjs` and `ℹ fail 1`.

- [ ] **Step 3: Write the pure helpers**

Create `$KIT/kit-lib.mjs`:

```js
// Pure helpers of the review kit (record.mjs), kept apart so record.test.mjs can test them without Chrome.
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// The pages to picture, as "animations/<category>/<slug>/", from page folders and category folders (a folder with no index.html
// of its own stands for the page folders in it, sorted), in the order given, each page once.
export function expandPages(root, args) {
  const out = [];
  for (const arg of args) {
    const p = arg.replace(/\\/g, '/').replace(/^\.?\//, '').replace(/\/?(index\.html)?$/, '/');
    if (existsSync(join(root, p, 'index.html'))) { if (!out.includes(p)) out.push(p); continue; }
    const inside = existsSync(join(root, p)) ? readdirSync(join(root, p), { withFileTypes: true })
      .filter(d => d.isDirectory() && existsSync(join(root, p, d.name, 'index.html'))).map(d => `${p}${d.name}/`).sort() : [];
    if (!inside.length) throw new Error(`${arg} is not a page or a category folder`);
    for (const q of inside) if (!out.includes(q)) out.push(q);
  }
  return out;
}

// "05-marquee-ticker" for animations/05-text-typography/marquee-ticker/
export function shortName(page) {
  const [, cat, slug] = page.replace(/\/$/, '').split('/');
  return `${cat.slice(0, 2)}-${slug}`;
}

// What a clip presses after its moment at rest. Normal: what plays the demo in Normal (Replay, Show me or Play; nothing for a
// loop, which moves by itself). See inside and Compare: the mode button, which plays a plays-once or do-it page once by itself
// (ruling 1); a scroll page then gets Play.
export function clipPlan(kind, mode) {
  const own = { once: 'Replay', do: 'Show me', scroll: 'Play' }[kind] || null;
  if (mode === 'normal') return { mode: null, then: own };
  return { mode, then: kind === 'scroll' ? 'Play' : null };
}
export function clipCaption(kind, mode) {
  const label = { inside: 'See inside', compare: 'Compare' }[mode];
  if (mode === 'normal') {
    return { once: 'Replay is pressed: the demo plays once.', do: 'Show me is pressed: the demo plays one example.',
      scroll: 'Play is pressed, and the box scrolls down by itself.', loop: 'It moves by itself.' }[kind] || 'The page as it is.';
  }
  if (kind === 'once' || kind === 'do') return `"${label}" is pressed, and the demo plays once by itself.`;
  if (kind === 'scroll') return `"${label}" is pressed, then Play, and the box scrolls down by itself.`;
  return `"${label}" is pressed, and it goes on moving.`;
}

export const RULINGS = {
  1: 'Ruling 1: pressing See inside or Compare plays the animation once by itself (never under reduced motion).',
  2: 'Ruling 2: where See inside shrinks a movement, a faint outline marks where each moving part started.',
  3: 'Ruling 3: Compare shows a common mistake beside the right way.',
  4: 'Ruling 4: on phones the box keeps its size in every mode, Compare included.'
};
// The rulings to name beside a picture or clip. what is "clip" or "still", mode its mode, width 1280 or 375; flags
// { shrinks: [pages], mistakes: [pages] } come from --rulings.
export function rulingsFor(page, kind, what, mode, width, flags = {}) {
  const out = [];
  if (what === 'clip' && mode !== 'normal' && (kind === 'once' || kind === 'do')) out.push(1);
  if (mode === 'inside' && (flags.shrinks || []).includes(page)) out.push(2);
  if (mode === 'compare' && (flags.mistakes || []).includes(page)) out.push(3);
  if (what === 'still' && mode === 'compare' && width === 375) out.push(4);
  return out;
}

// How many pixels of two RGBA arrays of the same size differ at all, and how many visibly (by more than 64, summed over red,
// green and blue, as the page check counts them). record.mjs also runs it inside Chrome, as text.
export function countDiff(a, b) {
  let any = 0, visible = 0;
  for (let i = 0; i < a.length; i += 4) {
    const d = Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]);
    if (d > 0) any++;
    if (d > 64) visible++;
  }
  return { any, visible, total: a.length / 4 };
}

export const KIND_WORDS = { once: 'plays once', do: 'the visitor acts', scroll: 'scroll', loop: 'moves by itself' };
```

- [ ] **Step 4: Run the tests and see them pass**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; cd $KIT && node --test record.test.mjs`
Expected: `ℹ tests 5`, `ℹ pass 5`, `ℹ fail 0`.

- [ ] **Step 5: Keep the pilot's kit and write the new parts**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; cd $KIT && md5sum record.mjs && mv record.mjs record-pilot.mjs`
Expected: `16954e07f433b77042dc5702b72dd26a`. (If it differs, the slices below no longer match: stop and tell the coordinator.)

Create `$KIT/new-a.mjs` (the head):

```js
#!/usr/bin/env node
// Review kit: pictures and short clips of any handbook pages for the owner's review, Normal compared with the same page on
// main, and galleries for the final look. A development tool, not part of the site; it writes only inside its output folder and
// in the system temp folder (a Chrome profile hb-kit-chrome-* and frame folders hb-kit-frames-*, removed at the end).
//
//   node record.mjs --base http://127.0.0.1:8731 [--before http://127.0.0.1:8800] [--out DIR] [--rulings FILE] [--clean]
//                   [--only stills|clips|before] [--gallery] [--timed] [--keep-frames] <page or category folder>...
//
// For each page (its kind is read from its file): nine pictures (Normal, See inside and Compare at 1280x800, at 375x812 and at
// 375x812 with reduce motion on), each of the Watch step brought into view once the demo has come to rest; three clips at
// 1280x800 of about seven seconds (a moment at rest, then: Normal plays the demo its own way, with Replay, Show me or Play, or a
// loop just goes on; See inside and Compare press the mode, which plays a plays-once or do-it page once by itself, and a scroll
// page then gets Play). With --before (a server of main's pages), Normal at rest on both sites at 1280 and 375, the number of
// pixels that differ, and the two pictures with the differences painted red. With --gallery, only pictures: Normal, See inside
// and Compare at 1280 and 375 for every page, one gallery file per category (gallery-NN.html). --rulings names a JSON file
// { "shrinks": [pages], "mistakes": [pages] } that says beside which pictures and clips rulings 2 and 3 are named. --press
// <selector>, any number of times, presses those controls in order once each page has loaded (a setting's choice, a switch), to
// picture the views under another setting; it does not apply to the --before comparison. index.html shows everything with plain
// captions; manifest.json holds the same as data. Both open from disk.
// Needs Node 22 or later, the local Chrome (CHROME sets its path) and, for clips, ffmpeg (FFMPEG sets its path; else Python's
// imageio_ffmpeg, else the PATH). Run it through the slot pool: node <run folder>/slot.mjs run kit -- node record.mjs …
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expandPages, shortName, clipPlan, clipCaption, rulingsFor, countDiff, RULINGS, KIND_WORDS } from './kit-lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../../../..');
const args = process.argv.slice(2);
function flag(name) {
  const i = args.indexOf(name);
  if (i < 0) return false;
  args.splice(i, 1);
  return true;
}
function option(name, fallback) {
  const i = args.indexOf(name);
  if (i < 0) return fallback;
  const value = args[i + 1];
  if (value === undefined || value.startsWith('--')) usage(`${name} needs a value`);
  args.splice(i, 2);
  return value;
}
function usage(problem) {
  const text = [
    'Usage: node record.mjs [--base URL] [--before URL] [--out DIR] [--rulings FILE] [--only stills|clips|before] [--gallery] [--clean] [--timed] [--keep-frames] <page or category folder>...',
    '  --base         the served branch to picture (default http://127.0.0.1:8731)',
    '  --before       the served main to compare Normal with (python -m http.server 8800 in a detached checkout of main)',
    '  --out          where everything goes (default: the out folder next to this script)',
    '  --rulings      a JSON file { "shrinks": [pages], "mistakes": [pages] } for the captions of rulings 2 and 3',
    '  --only         make only the pictures (stills), the clips, or the Normal comparison (before)',
    '  --gallery      only pictures: Normal, See inside and Compare at 1280 and 375, one gallery file per category',
    '  --press SEL    press this control once the page has loaded (repeatable, in order), e.g. --press "#speed-seg [data-ms=\'1000\']"',
    '  --clean        first remove stills/, clips/, before/, index.html, the galleries and manifest.json from the output folder',
    '  --timed        record clips with timed screenshots instead of the screencast',
    '  --keep-frames  keep the frame folder of each clip, to find out why a clip looks wrong',
    '  Needs the local Chrome (CHROME sets its path) and, for clips, ffmpeg (FFMPEG sets its path).',
  ].join('\n');
  if (problem) { console.error(`${problem}\n${text}`); process.exit(2); }
  console.log(text);
  process.exit(0);
}
if (flag('--help') || flag('-h')) usage();
const BASE = option('--base', 'http://127.0.0.1:8731').replace(/\/+$/, '');
const BEFORE = option('--before', '').replace(/\/+$/, '');
const OUT = resolve(option('--out', join(HERE, 'out')));
const ONLY = option('--only', '');
const RULINGS_FILE = option('--rulings', '');
const GALLERY = flag('--gallery');
const CLEAN = flag('--clean');
const FORCE_TIMED = flag('--timed');
const KEEP_FRAMES = flag('--keep-frames');
// --press <selector>, any number of times: the controls to press, in order, once a page has loaded
const PRESSES = [];
for (let i = args.indexOf('--press'); i >= 0; i = args.indexOf('--press')) {
  if (args[i + 1] === undefined) usage('--press needs a selector');
  PRESSES.push(args[i + 1]);
  args.splice(i, 2);
}
const PRESS_NOTE = PRESSES.length ? ` · after pressing ${PRESSES.join(', then ')}` : '';
if (ONLY && !['stills', 'clips', 'before'].includes(ONLY)) usage('--only is stills, clips or before');
if (ONLY === 'before' && !BEFORE) usage('--only before needs --before');
const unknown = args.filter(a => a.startsWith('-'));
if (unknown.length) usage(`Unknown option: ${unknown.join(' ')}`);
let PAGES = [];
try { PAGES = expandPages(ROOT, args); } catch (err) { usage(err.message); }
if (!PAGES.length) usage('Name at least one page or category folder');
const FLAGS = RULINGS_FILE ? JSON.parse(readFileSync(RULINGS_FILE, 'utf8')) : {};
const WANT_STILLS = GALLERY || !ONLY || ONLY === 'stills';
const WANT_CLIPS = !GALLERY && (!ONLY || ONLY === 'clips');
const WANT_BEFORE = !GALLERY && !!BEFORE && (!ONLY || ONLY === 'before');

```

Create `$KIT/new-b.mjs` (setups and what the kit looks for; it follows the settings slice):

```js

// ---------- the screen setups and what the kit looks for -------------------------------------------------------------------
const DESKTOP = { key: '1280', width: 1280, height: 800, scale: 1, mobile: false, reduce: false, short: 'Computer, 1280 wide' };
const PHONE = { key: '375', width: 375, height: 812, scale: 2, mobile: true, reduce: false, short: 'Phone, 375 wide' };
const PHONE_REDUCED = { key: '375-reduced', width: 375, height: 812, scale: 2, mobile: true, reduce: true, short: 'Phone, 375 wide, reduce motion on' };
const MODES = ['normal', 'inside', 'compare'];
const MODE_LABEL = { normal: 'Normal', inside: 'See inside', compare: 'Compare' };
// The box that scrolls on a scroll page: the page's marked scroller, else its stage (as the shared page script reads it).
const BOX = `(document.querySelector('[data-hb-scroller]') || document.querySelector('.hb-page .stage'))`;
const CLIP_MS = 7000; // a clip lasts about this long; a scroll page's lasts until its box has reached the end
// Runs at the start of every document: counts the page's timers that are still waiting (as the page check does), so the kit can
// tell when a run has ended.
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
// A page's kind and title, read from its file in this checkout (the same on main and on the branch)
const fileOf = path => readFileSync(join(ROOT, path, 'index.html'), 'utf8');
const kindOf = path => (fileOf(path).match(/data-hb-kind="(\w+)"/) || [])[1] || '';
const titleOf = path => ((fileOf(path).match(/<h1>([^<]*)<\/h1>/) || [])[1] || path).replace(/&amp;/g, '&');

```

Create `$KIT/new-c.mjs` (looking at a page, and what to make; it follows the browser slice):

```js

// ---------- looking at a page --------------------------------------------------------------------------------------------
// The page must be on the site: ask for its index.html (a folder with no index.html can still answer with a file list).
const known = new Map();
async function requirePage(base, path) {
  const key = `${base}/${path}`;
  if (!known.has(key)) {
    known.set(key, (async () => {
      const url = `${base}/${path}index.html`;
      let res = await fetch(url, { method: 'HEAD' });
      if (res.status === 405 || res.status === 501) res = await fetch(url);
      return res.ok ? '' : `the page is not on the site (${url} answers ${res.status})`;
    })().catch(err => `the site did not answer for ${key} (${err.message})`));
  }
  const problem = await known.get(key);
  if (problem) throw new Skip(problem);
}
// Opens a page at a screen setup and waits until it has loaded, with its fonts. The timer count runs in every document.
async function openPage(base, path, setup) {
  const page = await getPage();
  if (!page.timers) { await page.send('Page.addScriptToEvaluateOnNewDocument', { source: TIMERS }); page.timers = true; }
  await page.send('Emulation.setDeviceMetricsOverride', { width: setup.width, height: setup.height, deviceScaleFactor: setup.scale, mobile: setup.mobile });
  await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: setup.reduce ? 'reduce' : 'no-preference' }] });
  let off = () => {};
  const loaded = new Promise(done => { off = page.on(msg => { if (msg.method === 'Page.loadEventFired') done(); }); });
  try {
    const nav = await page.send('Page.navigate', { url: `${base}/${path}` });
    if (nav.errorText) throw new Error(`could not open ${base}/${path}: ${nav.errorText}`);
    await withTimeout(loaded, 25000, 'Loading the page');
  } finally { off(); }
  await page.evaluate('document.fonts && document.fonts.ready ? document.fonts.ready.then(() => true) : true');
  if (!(await page.evaluate(`!!document.querySelector('.hb-page')`))) throw new Skip(`the address opened, but it is not a handbook page (${base}/${path})`);
  return page;
}
const press = (page, selector) => page.evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return false; el.click(); return true; })()`);
const has = (page, selector) => page.evaluate(`!!document.querySelector(${JSON.stringify(selector)})`);
// Waits until no timer of the page (6 s or less) is waiting and no finite animation on the stage runs, three looks in a row
// 100 ms apart, for up to 12 s: the end of a run, holds and all.
async function runEnded(page) {
  let quiet = 0;
  for (const end = Date.now() + 12000; Date.now() < end; await sleep(100)) {
    const calm = await page.evaluate(`(() => {
      const stage = document.querySelector('.hb-page .stage');
      const busy = !!stage && document.getAnimations().some(a => {
        const t = a.effect && a.effect.target;
        return a.playState === 'running' && t && stage.contains(t) && a.effect.getComputedTiming().endTime !== Infinity;
      });
      return !busy && (window.__hbWaiting ? window.__hbWaiting() : 0) === 0;
    })()`);
    quiet = calm ? quiet + 1 : 0;
    if (quiet === 3) return true;
  }
  return false;
}
// The stage's rectangle as a PNG (base64)
async function stageShot(page) {
  const box = await page.evaluate(`(() => { const b = document.querySelector('.hb-page .stage').getBoundingClientRect();
    return { x: b.left + scrollX, y: b.top + scrollY, width: b.width, height: b.height }; })()`);
  return (await page.send('Page.captureScreenshot', { format: 'png', clip: { ...box, scale: 1 } })).data;
}
// Waits until the stage has looked the same for 750 ms (four captures 250 ms apart), for up to 10 s; says whether it did
async function rest(page) {
  let last = await stageShot(page), same = 0;
  for (const end = Date.now() + 10000; Date.now() < end;) {
    await sleep(250);
    const now = await stageShot(page);
    if (now !== last) { last = now; same = 0; continue; }
    if (++same === 3) return true;
  }
  return false;
}
// Waits until the box has scrolled to its end (or the time is up); says whether it moved at all.
async function scrollEnded(page, ms) {
  let moved = false;
  for (const end = Date.now() + ms; Date.now() < end;) {
    const { top, max } = await page.evaluate(`(() => { const b = ${BOX}; return { top: b.scrollTop, max: b.scrollHeight - b.clientHeight }; })()`);
    if (top > 0) moved = true;
    if (moved && top >= max - 2) return { moved, done: true };
    await sleep(100);
  }
  return { moved, done: false };
}
async function scrollBox(page, fraction) {
  await page.evaluate(`(() => { const b = ${BOX}; b.scrollTo({ top: Math.round((b.scrollHeight - b.clientHeight) * ${fraction}), behavior: 'instant' }); })()`);
}
// Brings the demo to rest the same way on every site and in every mode, by its kind: a scroll page stopped with Back to top
// (once its run on arrival has begun) and its box at the middle; a plays-once page with Loop off and its play over; a do-it page
// after its run on arrival, with Reset where it has one; a loop paused (it starts paused under reduce motion). Says whether the
// stage came to rest.
async function ready(page, setup, kind) {
  if (kind === 'scroll') {
    if (setup.reduce) await sleep(600);
    else for (let i = 0; i < 40 && !(await page.evaluate(`${BOX}.scrollTop > 0`)); i++) await sleep(100);
    for (let attempt = 0; attempt < 3; attempt++) {
      if (!(await press(page, '[data-hb-top]'))) { await scrollEnded(page, 10000); break; }
      await sleep(500);
      if (await page.evaluate(`${BOX}.scrollTop === 0`)) break;
    }
    await scrollBox(page, 0.5);
  } else if (kind === 'once') {
    await sleep(900);
    await page.evaluate(`(() => { const l = document.querySelector('[data-hb-loop]'); if (l && l.checked) l.click(); })()`);
  } else if (kind === 'do') {
    await sleep(setup.reduce ? 900 : 4500);
    await press(page, '[data-hb-reset]');
  } else {
    await sleep(900);
    await page.evaluate(`(() => { const p = document.querySelector('[data-hb-pause]'); if (p && p.getAttribute('data-state') !== 'paused') p.click(); })()`);
  }
  await runEnded(page);
  return rest(page);
}
// Says (by skipping) when the page has no button for the mode; Normal needs none, as every page starts in it.
async function requireMode(page, mode) {
  if (mode !== 'normal' && !(await has(page, `.hb-modes [data-hb-mode="${mode}"]`))) throw new Skip(`the page has no "${MODE_LABEL[mode]}" button yet`);
}
// Brings the Watch step into view, its top just under the pinned top bar, so a picture of the screen shows the switch, the
// stage, the player bar and the note under it
async function stepIntoView(page) {
  await page.evaluate(`(async () => {
    const step = document.querySelector('.hb-watch'), bar = document.querySelector('.hb-bar');
    const top = step.getBoundingClientRect().top + scrollY - (bar ? bar.getBoundingClientRect().height : 0) - 8;
    scrollTo({ top: Math.max(0, top), behavior: 'instant' });
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  })()`);
}
async function capture(page, file) {
  const shot = await page.send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(file, Buffer.from(shot.data, 'base64'));
}

// The controls named with --press, pressed in order once the page has loaded (on a plays-once page the shared script replays it
// after a setting changes; ready() then waits for that run)
async function pressAll(ctx, page) {
  for (const sel of PRESSES) {
    if (!(await press(page, sel))) ctx.note(`Nothing on the page matches --press ${sel}.`);
    await sleep(300);
  }
}

// ---------- what to make, in the order it is shown --------------------------------------------------------------------------
const items = [];
// A picture of one page in one mode at one setup, the demo at rest
async function pageStill(ctx, path, mode, setup, file) {
  await requirePage(BASE, path);
  const page = await openPage(BASE, path, setup);
  await requireMode(page, mode);
  await pressAll(ctx, page);
  if (!(await ready(page, setup, kindOf(path)))) ctx.note('The stage did not come to rest before the button was pressed.');
  if (mode !== 'normal') {
    await press(page, `.hb-modes [data-hb-mode="${mode}"]`);
    await sleep(AFTER_MODE_MS);
    const marked = await page.evaluate(`document.querySelector('.hb-page .stage').getAttribute('data-hb-mode')`);
    if (marked !== mode) ctx.note(`After pressing "${MODE_LABEL[mode]}" the box is marked "${marked || 'nothing'}".`);
    await runEnded(page);
    if (!(await rest(page))) ctx.note('The stage did not come to rest in this mode.');
  }
  await stepIntoView(page);
  await capture(page, join(OUT, file));
}
// A clip of one page in one mode at 1280x800 (see clipPlan)
async function pageClip(ctx, path, mode, how) {
  await requirePage(BASE, path);
  const kind = kindOf(path);
  const page = await openPage(BASE, path, DESKTOP);
  await requireMode(page, mode);
  await pressAll(ctx, page);
  await ready(page, DESKTOP, kind);
  if (kind === 'scroll') await press(page, '[data-hb-top]'); // a scroll page's clip starts with the box at the top
  if (kind === 'loop') await page.evaluate(`(() => { const p = document.querySelector('[data-hb-pause]'); if (p && p.getAttribute('data-state') === 'paused') p.click(); })()`);
  await stepIntoView(page);
  const plan = clipPlan(kind, mode);
  return recordClip(page, DESKTOP, how, async () => {
    const start = Date.now();
    await sleep(LEAD_MS);
    if (plan.mode) { await press(page, `.hb-modes [data-hb-mode="${plan.mode}"]`); await sleep(AFTER_MODE_MS); }
    if (plan.then === 'Replay') await press(page, '[data-hb-replay]');
    if (plan.then === 'Show me') await press(page, '[data-hb-demo]');
    if (plan.then === 'Play') {
      await press(page, '[data-hb-autoscroll]');
      const end = await scrollEnded(page, 12000);
      if (!end.moved) ctx.note('Play did not scroll the box.');
    }
    const left = CLIP_MS - (Date.now() - start);
    if (left > 0) await sleep(left);
    await sleep(HOLD_MS);
  });
}
// Normal at rest on main (--before) and on the branch (--base) at one setup, and how many pixels differ. A loop is pictured with
// reduce motion on, so it stands paused at its first frame on both sites.
async function beforeAfter(ctx, path, setup, item) {
  const kind = kindOf(path), use = kind === 'loop' ? { ...setup, reduce: true } : setup, pics = {};
  for (const [side, base] of [['before', BEFORE], ['after', BASE]]) {
    await requirePage(base, path);
    const page = await openPage(base, path, use);
    if (!(await ready(page, use, kind))) ctx.note(`On ${side === 'before' ? 'main' : 'this branch'} the stage did not come to rest.`);
    pics[side] = await stageShot(page);
    writeFileSync(join(OUT, item.files[side]), Buffer.from(pics[side], 'base64'));
  }
  const page = await getPage();
  const result = await page.evaluate(`new Promise(done => {
    const countDiff = ${countDiff.toString()};
    const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + src; });
    Promise.all([load(${JSON.stringify(pics.before)}), load(${JSON.stringify(pics.after)})]).then(([x, y]) => {
      if (x.width !== y.width || x.height !== y.height) { done({ size: [x.width, x.height, y.width, y.height] }); return; }
      const read = img => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0); return g.getImageData(0, 0, c.width, c.height).data; };
      const p = read(x), q = read(y), counts = countDiff(p, q);
      // the pixels that differ, painted red over a faint copy of the branch's picture
      const c = document.createElement('canvas'); c.width = y.width; c.height = y.height; const g = c.getContext('2d');
      g.globalAlpha = .35; g.drawImage(y, 0, 0); g.globalAlpha = 1;
      const red = g.getImageData(0, 0, c.width, c.height);
      for (let i = 0; i < p.length; i += 4) if (p[i] !== q[i] || p[i + 1] !== q[i + 1] || p[i + 2] !== q[i + 2]) { red.data[i] = 255; red.data[i + 1] = 0; red.data[i + 2] = 0; red.data[i + 3] = 255; }
      g.putImageData(red, 0, 0);
      done({ ...counts, png: c.toDataURL('image/png').split(',')[1] });
    });
  })`);
  if (result.size) throw new Error(`the stage is ${result.size[0]}x${result.size[1]} on main and ${result.size[2]}x${result.size[3]} on this branch`);
  writeFileSync(join(OUT, item.files.diff), Buffer.from(result.png, 'base64'));
  item.info = { any: result.any, visible: result.visible, total: result.total };
}
// What an item makes, so a file left by an earlier run is not left beside an item that is not made this time.
function removeOutputs(item) {
  const files = item.type === 'clip' ? ['mp4', 'webp', 'gif'].map(ext => `clips/${item.id}.${ext}`) : Object.values(item.files || { file: item.file });
  for (const file of files) {
    try { rmSync(join(OUT, file), { force: true }); } catch { /* a file another program holds is left as it is */ }
  }
}
for (const path of PAGES) {
  const id = shortName(path), kind = kindOf(path), title = titleOf(path);
  const base = { page: path, pageId: id, kind, title, status: 'todo' };
  if (WANT_STILLS) {
    for (const mode of MODES) {
      for (const setup of GALLERY ? [DESKTOP, PHONE] : [DESKTOP, PHONE, PHONE_REDUCED]) {
        const file = `stills/${id}-${mode}-${setup.key}.png`;
        items.push({ ...base, notes: [], type: 'still', id: `${id}-${mode}-${setup.key}`, mode, setup: setup.key, file,
          caption: `${MODE_LABEL[mode]} · ${setup.short}${PRESS_NOTE}`, rulings: rulingsFor(path, kind, 'still', mode, setup.width, FLAGS),
          make: ctx => pageStill(ctx, path, mode, setup, file) });
      }
    }
  }
  if (WANT_CLIPS) {
    for (const mode of MODES) {
      items.push({ ...base, notes: [], type: 'clip', id: `${id}-clip-${mode}`, mode, caption: `${MODE_LABEL[mode]} · ${clipCaption(kind, mode)}${PRESS_NOTE}`,
        rulings: rulingsFor(path, kind, 'clip', mode, 1280, FLAGS), record: (ctx, how) => pageClip(ctx, path, mode, how) });
    }
  }
  if (WANT_BEFORE) {
    for (const setup of [DESKTOP, PHONE]) {
      const item = { ...base, notes: [], type: 'before', id: `${id}-before-${setup.key}`, setup: setup.key,
        caption: `Normal at rest, main beside this branch · ${setup.short}${kind === 'loop' ? ' (reduce motion on, so the loop stands still)' : ''}`,
        files: { before: `before/${id}-${setup.key}-main.png`, after: `before/${id}-${setup.key}-branch.png`, diff: `before/${id}-${setup.key}-diff.png` } };
      item.make = ctx => beforeAfter(ctx, path, setup, item);
      items.push(item);
    }
  }
}

```

Create `$KIT/new-d.mjs` (the index, the galleries and the run; it follows the `runClip` slice):

```js

// ---------- the index page and the galleries ------------------------------------------------------------------------------
const PAGE_CSS = `
  :root{--ink:#1c1d21;--muted:#575b66;--line:#d6d9e0;--bg:#f4f5f7;--card:#fff;--accent:#2a56d4;--warn:#8a4300;--gap:#e9ebf0;--rule:#0b5d3b}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.55 "Segoe UI",system-ui,-apple-system,Roboto,Arial,sans-serif}
  .wrap{max-width:1280px;margin:0 auto;padding:28px 20px 72px}
  h1{font-size:30px;line-height:1.2;margin:0 0 6px}
  h2{font-size:25px;margin:56px 0 6px;padding-top:26px;border-top:2px solid var(--line)}
  h3{font-size:19px;margin:30px 0 10px}
  h4{font-size:17px;margin:18px 0 8px}
  p{margin:0 0 12px}
  .lede{color:var(--muted);max-width:75ch}
  .made{color:var(--muted);font-size:15px}
  a{color:var(--accent)}
  .toc{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 4px;padding:0;list-style:none}
  .toc a{display:inline-block;padding:8px 14px;border:1px solid var(--line);border-radius:999px;background:var(--card);color:var(--ink);text-decoration:none}
  .gaps{margin:14px 0;padding:10px 14px;border:1px solid var(--line);border-radius:10px;background:var(--card);font-size:15px}
  .gaps ul{margin:8px 0 0;padding-left:20px}
  figure{margin:0;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px;min-width:0}
  figure img,figure video{display:block;width:100%;height:auto;border-radius:6px;background:#0b0b0d}
  figcaption{margin-top:10px;font-size:15px}
  .meta,.warn,.rule{display:block;margin-top:3px;font-size:14px}
  .meta{color:var(--muted)}
  .warn{color:var(--warn)}
  .rule{color:var(--rule);font-weight:600}
  .clips{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,560px),1fr));gap:16px}
  .row{display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start}
  .row .wide{flex:2 1 480px}
  .row .narrow{flex:0 1 240px}
  .gap .empty{display:flex;flex-direction:column;justify-content:center;gap:4px;min-height:150px;padding:14px;border-radius:6px;background:var(--gap);color:var(--muted);font-size:15px}
  .gap .empty b{color:var(--ink)}
  .pair{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
  .count{display:block;font-size:16px;font-weight:600}
`;
function figure(item, cls = '') {
  const notes = item.notes.map(n => `<span class="warn">${esc(n)}</span>`).join('');
  const rules = (item.rulings || []).map(n => `<span class="rule">${esc(RULINGS[n])}</span>`).join('');
  if (item.status !== 'ok') {
    const word = item.status === 'skipped' ? 'Not made' : item.status === 'failed' ? 'Failed' : 'Not part of this run';
    return `<figure class="gap ${cls}"><div class="empty"><b>${word}</b>${item.reason ? `<span>${esc(item.reason)}</span>` : ''}</div><figcaption>${esc(item.caption)}</figcaption></figure>`;
  }
  if (item.type === 'still') {
    return `<figure class="${cls}"><a href="${item.file}" target="_blank" rel="noopener"><img src="${item.file}" alt="${esc(item.caption)}" loading="lazy"></a><figcaption>${esc(item.caption)}${rules}${notes}</figcaption></figure>`;
  }
  if (item.type === 'before') {
    const i = item.info, share = (100 * i.any / i.total).toFixed(2);
    const pics = ['before', 'after', 'diff'].map(k => `<a href="${item.files[k]}" target="_blank" rel="noopener"><img src="${item.files[k]}" alt="${k}" loading="lazy"></a>`).join('');
    return `<figure class="${cls}"><div class="pair">${pics}</div><figcaption><span class="count">${i.any} of ${i.total} pixels differ (${share}%), ${i.visible} of them visibly</span>${esc(item.caption)}. Left: main; middle: this branch; right: the differences in red.${notes}</figcaption></figure>`;
  }
  const i = item.info;
  const links = `<a href="${item.files.mp4}">MP4 video (${size(i.mp4Bytes)})</a> · <a href="${item.files.small}" target="_blank" rel="noopener">animated ${i.smallKind} picture (${size(i.smallBytes)})</a>`;
  return `<figure class="clip ${cls}"><video controls loop muted playsinline preload="auto"><source src="${item.files.mp4}" type="video/mp4"><img src="${item.files.small}" alt="${esc(item.caption)}"></video>` +
    `<figcaption>${esc(item.caption)}<span class="meta">${i.seconds} seconds · ${links}</span>${rules}${notes}</figcaption></figure>`;
}
function framePage(title, lede, toc, body) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<style>${PAGE_CSS}</style>
</head>
<body>
<div class="wrap">
<h1>${esc(title)}</h1>
<p class="lede">${esc(lede)}</p>
<p class="made">Made ${esc(new Date().toLocaleString('en-GB'))} from ${esc(BASE)}${BEFORE ? ` (main: ${esc(BEFORE)})` : ''}</p>
${toc}
${body}
</div>
<script>
  // Clips play while they are on screen and stop when they are not.
  (function () {
    var videos = document.querySelectorAll('video');
    if (!('IntersectionObserver' in window)) return;
    var watcher = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { var p = e.target.play(); if (p && p.catch) p.catch(function () {}); } else e.target.pause(); });
    }, { threshold: 0.5 });
    videos.forEach(function (v) { watcher.observe(v); });
  })();
</script>
</body>
</html>
`;
}
function pageSection(path) {
  const mine = items.filter(it => it.page === path && it.status !== 'omitted');
  if (!mine.length) return '';
  const { pageId, title, kind } = mine[0];
  let html = `<section id="${pageId}"><h2>${esc(title)}</h2><p class="lede">${esc(path)} · ${esc(KIND_WORDS[kind] || 'kind not read')}</p>`;
  const clips = mine.filter(it => it.type === 'clip');
  if (clips.length) html += `<h3>Clips</h3><div class="clips">${clips.map(c => figure(c)).join('')}</div>`;
  const stills = mine.filter(it => it.type === 'still');
  if (stills.length) {
    html += '<h3>Pictures</h3><p class="lede">The Watch step after each button was pressed and the demo had come to rest. The last column has reduce motion on, so every mode must be a still picture there.</p>';
    for (const mode of MODES) {
      const row = stills.filter(s => s.mode === mode);
      if (row.length) html += `<h4>${MODE_LABEL[mode]}</h4><div class="row">${row.map(s => figure(s, s.setup === '1280' ? 'wide' : 'narrow')).join('')}</div>`;
    }
  }
  const befores = mine.filter(it => it.type === 'before');
  if (befores.length) html += `<h3>Normal before and after</h3><div class="row">${befores.map(b => figure(b, 'wide')).join('')}</div>`;
  return html + '</section>';
}
function renderIndex() {
  const gaps = items.filter(it => it.status === 'skipped' || it.status === 'failed');
  const toc = `<ul class="toc">${PAGES.filter(p => items.some(it => it.page === p)).map(p => `<li><a href="#${shortName(p)}">${esc(titleOf(p))}</a></li>`).join('')}</ul>` +
    (gaps.length ? `<details class="gaps" open><summary>${gaps.length} not made</summary><ul>${gaps.map(it => `<li><b>${esc(it.id)}</b>: ${esc(it.reason)}</li>`).join('')}</ul></details>` : '');
  return framePage('See inside and Compare: pictures and clips',
    'For each page: three clips (Normal, See inside, Compare), then each button pictured on a computer, a phone, and a phone with reduce motion on, then Normal on main beside Normal on this branch. Green lines name the ruling a picture or clip shows. Click a picture to open it full size.',
    toc, PAGES.map(pageSection).join('\n'));
}
function renderGallery(cat) {
  const body = PAGES.filter(p => p.split('/')[1] === cat).map(path => {
    const row = items.filter(it => it.page === path && it.type === 'still');
    return `<section id="${shortName(path)}"><h2>${esc(titleOf(path))}</h2><div class="row">${row.map(s => figure(s, s.setup === '1280' ? 'wide' : 'narrow')).join('')}</div></section>`;
  }).join('\n');
  return framePage(`Gallery: ${cat}`, 'Every page of the category: Normal, See inside and Compare on a computer and on a phone.', '', body);
}

// ---------- the run --------------------------------------------------------------------------------------------------------
let cleaning = null;
function cleanUp() {
  cleaning ??= (async () => {
    if (browser) await browser.close().catch(() => {});
    for (const dir of [...tempDirs]) removeDir(dir);
  })();
  return cleaning;
}
async function abort(why) {
  console.error(why);
  await cleanUp().catch(() => {});
  process.exit(1);
}
for (const signal of ['SIGINT', 'SIGTERM', 'SIGBREAK', 'SIGHUP']) process.on(signal, () => abort(`Interrupted (${signal}).`));
process.on('uncaughtException', err => abort(err?.stack || String(err)));
process.on('unhandledRejection', err => abort(err?.stack || String(err)));

const CATS = [...new Set(PAGES.map(p => p.split('/')[1]))];
let failures = 0;
try {
  for (const [name, base] of [['--base', BASE], ...(BEFORE ? [['--before', BEFORE]] : [])]) {
    const answer = await fetch(`${base}/`).catch(() => null);
    if (!answer || !answer.ok) { console.error(`The site does not answer at ${base}/ (${name}). Serve it first: python -m http.server <port> --bind 127.0.0.1`); process.exit(2); }
  }
  if (!CHROME) { console.error('Chrome was not found. Set the CHROME variable to its path.'); process.exit(2); }
  if (WANT_CLIPS && !FFMPEG) log('warn', 'ffmpeg was not found: the clips will be skipped (set FFMPEG to its path, or install the Python package imageio-ffmpeg)');
  if (CLEAN) {
    for (const name of ['stills', 'clips', 'before', 'index.html', 'manifest.json', ...CATS.map(c => `gallery-${c.slice(0, 2)}.html`)]) {
      try { rmSync(join(OUT, name), { recursive: true, force: true }); } catch (err) { log('warn', `could not remove ${name} from the output folder (${err.code || err.message})`); }
    }
  }
  for (const dir of ['stills', 'clips', 'before']) mkdirSync(join(OUT, dir), { recursive: true });
  log('info', `${PAGES.length} pages, ${items.length} items, from ${BASE} into ${OUT}`);
  for (const item of items) {
    const ctx = { note: text => { item.notes.push(text); log('note', `${item.id}: ${text}`); } };
    // A try that fails (Chrome crashed, the computer was too busy) is made once more with a fresh Chrome before it counts as failed.
    for (let attempt = 1; ; attempt++) {
      item.notes.length = 0;
      try {
        if (item.type === 'clip') {
          await withTimeout(runClip(item, ctx), CLIP_TIMEOUT_MS, 'The clip');
          log('ok', `${item.id}  ${item.info.seconds} s, ${item.info.recordedFrames} frames (${item.info.recordedHow}), MP4 ${size(item.info.mp4Bytes)}, ${item.info.smallKind} ${size(item.info.smallBytes)}`);
        } else if (item.type === 'before') {
          await withTimeout(item.make(ctx), STILL_TIMEOUT_MS, 'The comparison');
          log('ok', `${item.id}  ${item.info.any} of ${item.info.total} pixels differ (${item.info.visible} visibly)`);
        } else {
          await withTimeout(item.make(ctx), STILL_TIMEOUT_MS, 'The picture');
          item.info = { bytes: statSync(join(OUT, item.file)).size };
          log('ok', `${item.id}.png  ${size(item.info.bytes)}`);
        }
        item.status = 'ok';
        break;
      } catch (err) {
        removeOutputs(item);
        if (err instanceof Skip) { item.status = 'skipped'; item.reason = err.message; log('skip', `${item.id}: ${err.message}`); break; }
        if (browser) { await browser.close().catch(() => {}); browser = null; }
        if (attempt === 1) { log('retry', `${item.id}: ${err.message}; trying once more`); continue; }
        item.status = 'failed';
        item.reason = err.message;
        failures++;
        log('FAIL', `${item.id}: ${err.message}`);
        break;
      }
    }
  }
  if (GALLERY) {
    for (const cat of CATS) {
      writeFileSync(join(OUT, `gallery-${cat.slice(0, 2)}.html`), renderGallery(cat));
      console.log(`Open ${join(OUT, `gallery-${cat.slice(0, 2)}.html`)}`);
    }
  } else {
    writeFileSync(join(OUT, 'index.html'), renderIndex());
    console.log(`Open ${join(OUT, 'index.html')}`);
  }
  writeFileSync(join(OUT, 'manifest.json'), JSON.stringify({ made: new Date().toISOString(), base: BASE, before: BEFORE || null, pages: PAGES,
    items: items.map(({ make, record, ...rest }) => rest) }, null, 1));
  const n = (type, status) => items.filter(it => it.type === type && it.status === status).length;
  log('done', `${n('still', 'ok')} pictures, ${n('clip', 'ok')} clips and ${n('before', 'ok')} comparisons made, ${items.filter(it => it.status === 'skipped').length} skipped, ${failures} failed`);
} catch (err) {
  console.error(err?.stack || String(err));
  failures++;
} finally {
  await cleanUp();
}
process.exit(failures ? 1 : 0);
```

- [ ] **Step 6: Assemble the new kit**

Run:
```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit
cd $KIT && { cat new-a.mjs; sed -n '81,94p' record-pilot.mjs; cat new-b.mjs; sed -n '110,293p' record-pilot.mjs; cat new-c.mjs; sed -n '397,503p' record-pilot.mjs; echo; sed -n '605,617p' record-pilot.mjs; cat new-d.mjs; } > record.mjs && rm new-a.mjs new-b.mjs new-c.mjs new-d.mjs
node --check record.mjs && node record.mjs --help | head -2 && node --test --test-reporter=spec record.test.mjs 2>&1 | grep -E "^ℹ (pass|fail)"
```
Expected: no syntax error; the usage's first line; `ℹ pass 5` and `ℹ fail 0`. `sed -n '81,94p' record-pilot.mjs | head -1` is the `// ---------- settings you may want to change` line and `sed -n '605p' record-pilot.mjs` is `async function runClip(item, ctx) {`.

- [ ] **Step 7: A real run**

This step waits for the merge of Task 3 (the last merge of step 0-C), and its runs end before Task 6 is merged, so the served tree does not change while the kit runs and holds the shared script whose ruling 1 the kit relies on. Write in the ledger which merge it saw (`git -C /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook log --oneline -1`).
Start, as a background command (it serves the main checkout, which then holds the merges of Tasks 1, 2, 4 and 3): `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook && python -m http.server 8805 --bind 127.0.0.1`
Run, as a background command:
`REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; node $RUN/slot.mjs run kit-test -- node $KIT/record.mjs --base http://127.0.0.1:8805 --before http://127.0.0.1:8800 --rulings $RUN/first-batch-rulings.json --out $RUN/scratch/kit-test --clean animations/01-scroll-based/parallax-scrolling animations/02-entrance-and-exit/fade-in-out > $RUN/scratch/kit-test.log 2>&1`
When it has ended, `tail -3 $RUN/scratch/kit-test.log`. Expected: `12 pictures, 4 clips and 4 comparisons made, 8 skipped, 0 failed` (Parallax: 9 pictures, 3 clips; Fade In / Fade Out has no switch yet: its 3 Normal pictures and its Normal clip are made, its 6 mode pictures and 2 mode clips are skipped with `the page has no "See inside" button yet` or `"Compare"`); the four comparison lines say `0 of … pixels differ (0 visibly)` or a handful of pixels at Parallax's rounded corners. Open `$RUN/scratch/kit-test/index.html` and three of its pictures with the Read tool: the Parallax clips carry the green ruling 2 line beside See inside, Fade In's Normal clip shows Replay playing the card, each comparison shows main, branch and an all-gray difference picture.
Then the gallery path: `node $RUN/slot.mjs run kit-test -- node $KIT/record.mjs --base http://127.0.0.1:8805 --out $RUN/scratch/kit-gallery --gallery animations/01-scroll-based/parallax-scrolling` (foreground, about a minute): `gallery-01.html` with six pictures. And `--press`: `node $RUN/slot.mjs run kit-test -- node $KIT/record.mjs --base http://127.0.0.1:8805 --out $RUN/scratch/kit-press --only stills --press "#depth-seg [data-depth='flat']" animations/01-scroll-based/parallax-scrolling`: nine pictures whose captions end `after pressing #depth-seg [data-depth='flat']`, the Compare ones with both halves alike and the note saying Depth is set to Flat. Stop the server.

- [ ] **Step 8: The kit's README**

In `$KIT/README.md`, after its first line (the title), add:

```markdown

## The rollout's kit (record.mjs, from Phase 0 of the See inside and Compare rollout)
`record.mjs` now takes any list of pages and category folders and reads each page's kind. The pilot's kit, which made the Parallax and
Learn pictures, is kept as `record-pilot.mjs`. Run it through the slot pool:

    node <run folder>/slot.mjs run kit -- node record.mjs --base http://127.0.0.1:8731 --before http://127.0.0.1:8800 \
      --rulings <run folder>/first-batch-rulings.json --out <folder> --clean <page or category folder>...

For each page: nine pictures (Normal, See inside, Compare at 1280x800, 375x812, and 375x812 with reduce motion on, each after the
demo has come to rest), three clips at 1280x800 (Normal plays the demo its own way; See inside and Compare press the mode, which plays
a plays-once or do-it page once by itself; a scroll page then gets Play), and with `--before` Normal at rest on main beside this
branch at 1280 and 375 with the number of pixels that differ and a picture of them in red. `--only before` makes only the comparison
(what a builder runs for acceptance line 3); `--press "<selector>"` (any number of times) presses a setting's choice or a switch once
each page has loaded, so `--only stills` then pictures the views under that setting (acceptance line 7); `--gallery` makes only
pictures, one `gallery-NN.html` per category, for the owner's final look. `kit-lib.mjs` holds the pure helpers, tested by
`node --test record.test.mjs`.
```

- [ ] **Step 9: No commit; review**

Nothing here is in the repository. A fresh reviewer runs `node --test record.test.mjs`, reads `record.mjs` (the new parts and the seams between the slices), opens the Step 7 `index.html`, and confirms spec section 3 ("What the owner sees") and section 4 item 8 are met: nine stills and three clips per page, the kind read per page, Normal before and after with the count, captions naming rulings 1 to 4 where they show, `--gallery` with one file per category. A ledger line names the files.

---
### Task 6: One bump to `?v=10`, the whole-site check, and the shared files frozen

**Files:**
- Modify: the version line of every tracked `animations/*/*/index.html` (166 pages: both the stylesheet and the script link) and of `index.html` (the home page links only the script): `?v=9` → `?v=10`

**Interfaces:**
- Consumes: Tasks 1 to 4 merged into `feat/see-inside-compare` (Task 5 is outside the repository). The test `every guided-steps page and the home page link the same version of the shared files`.
- Produces: every page and the home page at `?v=10`; from the merge of this task on, `assets/css/demo-page.css`, `assets/js/demo-page.js`, `tests/demo-page.test.js`, `tools/check-pages.mjs` and `tests/pages.test.js` are frozen for the first batch. The ledger line `Phase 0 done at <merge hash>; shared files frozen at v=10`.

- [ ] **Step 1: The lane**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; git -C $REPO log --oneline -8 feat/see-inside-compare; git -C $REPO worktree add -b sic/00e $REPO/.claude/worktrees/sic-00e feat/see-inside-compare`
Expected: the merges of Tasks 1, 2, 4 and 3 at the top. Work in `$REPO/.claude/worktrees/sic-00e`.

- [ ] **Step 2: See what has to change**

Run: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-00e && git ls-files -- 'animations/*/*/index.html' index.html | wc -l; git grep -l 'demo-page\.\(css\|js\)?v=9' -- 'animations/*/*/index.html' index.html | wc -l; git grep -l 'demo-page\.\(css\|js\)?v=10' -- '*.html' | wc -l; git ls-files --eol -- index.html animations/02-entrance-and-exit/fade-in-out/index.html`
Expected: `167`, `167`, `0`, and `i/lf    w/crlf` for both files (the line endings to keep).

- [ ] **Step 3: Bump, on tracked files only, keeping line endings**

```bash
cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-00e
git ls-files -- 'animations/*/*/index.html' index.html | xargs sed -b -i 's/demo-page\.css?v=9"/demo-page.css?v=10"/; s/demo-page\.js?v=9"/demo-page.js?v=10"/'
```

- [ ] **Step 4: Check the bump**

Run: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-00e && git grep -l 'v=9"' -- 'animations/*/*/index.html' index.html | wc -l; git grep -l 'demo-page\.css?v=10"' -- '*.html' | wc -l; git grep -l 'demo-page\.js?v=10"' -- '*.html' | wc -l; git diff --shortstat; git ls-files --eol -- index.html animations/02-entrance-and-exit/fade-in-out/index.html; git ls-files --eol -- 'animations/*/*/index.html' index.html | grep -vc 'w/crlf'`
Expected: `0`; `166`; `167`; `167 files changed, 333 insertions(+), 333 deletions(-)`; `i/lf    w/crlf` for both; `0` (no page lost its CRLF line endings in the working tree). Then `node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"`: `ℹ fail 0`. Then `node tools/make-skill.mjs && git status --short -- skills llms.txt`: no output (the skill and `llms.txt` are unchanged).

- [ ] **Step 5: The whole-site check**

Start, as a background command: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-00e && python -m http.server 8806 --bind 127.0.0.1`
Start eight runs, each as a background command of its own, with `<target>` and `<log>` taken in turn from: `animations/01-scroll-based` and `01`, `animations/02-entrance-and-exit` and `02`, `animations/03-page-transitions` and `03`, `animations/04-micro-interactions` and `04`, `animations/05-text-typography` and `05`, `animations/06-3d-advanced` and `06`, `animations/07-ambient-background` and `07`, `home` and `home`:
`REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $REPO/.claude/worktrees/sic-00e && node $RUN/slot.mjs run site-<log> -- node tools/check-pages.mjs --base http://127.0.0.1:8806 --out $RUN/checks/site-<log> <target> > $RUN/checks/site-<log>.log 2>&1; echo "EXIT=$?" >> $RUN/checks/site-<log>.log`
When all eight logs end with `EXIT=…` (about 30 minutes; the pool runs at most eight at once, so other projects' checks may make some wait), run: `RUN=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.superpowers/sdd/2026-10-13-see-inside-compare; cat $RUN/checks/site-*.log | grep -c "^ok"; cat $RUN/checks/site-*.log | grep "^FAIL"; grep -h "EXIT=" $RUN/checks/site-*.log`
Expected: `1002` (166 pages and the home page, six setups each), no `FAIL` line, eight `EXIT=0`. A `FAIL` on a page without the switch can only come from `restShot` in `movementProblems` or from the `TIMERS` wrapper: find which with the page's log line, fix it in Task 3's code (a new commit on this lane, reviewed), and run that category again. Stop the server.

- [ ] **Step 6: Commit**

```bash
cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-00e
git add -u -- animations index.html
git commit -m "chore: the shared files are at version 10 on all 166 animation pages and the home page"
```

- [ ] **Step 7: Review, merge, freeze (coordinator)**

A fresh reviewer checks by script that every changed file differs from its parent only in the version strings (`git diff feat/see-inside-compare...sic/00e -U0 | grep '^[-+][^-+]' | grep -v 'demo-page\.\(css\|js\)?v=' | wc -l` prints `0`) and that the whole-site logs show 1002 `ok` and no `FAIL`. Then:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook
cd $REPO && git merge --no-ff sic/00e -m "Merge Phase 0, Task 6: the shared files at version 10 everywhere; Phase 0 is done"
node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"
git worktree remove .claude/worktrees/sic-00e && git branch -d sic/00e
git worktree list | grep sic-00
```
Expected: `ℹ fail 0`; the last command prints nothing (every Phase 0 lane is gone). Ledger: `Phase 0 done at <merge hash>; shared files frozen at v=10`. From here until Task 14 asks for one, no agent changes `assets/css/demo-page.css`, `assets/js/demo-page.js`, `tests/demo-page.test.js`, `tools/check-pages.mjs` or `tests/pages.test.js`; a lane that thinks one needs a change writes it in its ledger and tells the coordinator.

---
## The first batch

Every page task below follows the same order: the brief (written by the lane lead during Phase 0, step 0-C), the slot (after Task 6), the failing check, the build, the tests, the page check with its screenshots and the tuning, Normal before and after, one commit, then a fresh reviewer and the lane's merge into `sic/cat-NN`. Each task repeats its own commands so it can be read alone. The starting code below is a first draft for the builder: the brief and the acceptance govern, and a clearer picture wins (the report says why).

### Task 7: 01.02 Parallax Scrolling: start outlines in See inside (ruling 2) and the final review's small fixes

**Files:**
- Modify: `animations/01-scroll-based/parallax-scrolling/index.html`: the `<style>` block (the See inside rules), the layers in `#main` (a start outline before each), the four `.tag` spans and the `p.side` (caption marks), the See inside note, and in the script the twin's clean-up line, the comment above `const k`, and the `NOTES` table.

**Interfaces:**
- Consumes: Task 1 (no lesson parts; the script writes the See inside note through `insideNote`), Task 4 (notes in two sentences; Compare's note names the halves), Task 3 (the caption, id and name checks), Task 5 (`record.mjs --only before`), Task 6 (`?v=10`).
- Produces: the category 01 reference, and the reference for ruling 2 (every page that shrinks a movement): `span.start.s1` … `.s4`, one before each layer, drawn only in See inside, at the layer's place in the fan without its scroll movement.

- [ ] **Step 1: The brief** (the 01 lane lead, during Phase 0)

Write `$RUN/briefs/01.02-parallax-scrolling.md`:

```markdown
# 01.02 Parallax Scrolling: brief (first batch)
Kind: scroll (Play, Back to top). See inside (the four layers fanned out, each labeled with words and a bar) and Compare
("Without parallax" / "With parallax") exist from the pilot; this round adds ruling 2 and the final review's small fixes.
1. Ruling 2: in See inside each layer moves about a fifth as far as in Normal. Draw a faint dashed outline of each layer's card at
   its place with the box at the top, just behind the card, so the gap that opens as the box scrolls shows how far it moved.
   Under reduced motion nothing moves, so each outline sits under its card.
2. Labels drawn sharp in See inside (no will-change there).
3. Notes: one or two sentences each, naming the halves "Without parallax" and "With parallax"; the reduced-motion Compare note
   says "each layer has moved its own amount"; the See inside note mentions the outlines.
4. The comment at the See inside factor says it moves layers about a fifth as far on screen.
5. data-hb-caption on the four layer labels and the two half names.
Pitfalls: the Compare copy loses the outlines; no outline crosses a label's words; every card and outline stays inside the box at
every Depth and scroll position; Normal pixel-identical.
Survey row: rollout-survey-01-03.md, 01.02. Reference for the PULL-APART pages and for every page that shrinks a movement.
```

- [ ] **Step 2: The slot** (after Task 6)

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; git -C $REPO worktree add -b sic/01a $REPO/.claude/worktrees/sic-01a feat/see-inside-compare`
Start, as a background command: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-01a && python -m http.server 8801 --bind 127.0.0.1`
The lane's ledger is `$RUN/lanes/01.md`; write a line there at every step that changes something.

- [ ] **Step 3: See the gaps (the failing check)**

Run: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-01a && F=animations/01-scroll-based/parallax-scrolling/index.html; grep -c 'data-hb-caption' $F; grep -c 'class="start' $F; grep -c 'will-change:auto}' $F; grep -c 'each its own amount' $F`
Expected: `0`, `0`, `1` (only the reduced-motion rule at the end of the style block), `1`. After the build: `5` (four labels and one half name; the copy's half name is cloned at load), `4`, `2`, `0`.

- [ ] **Step 4: Styles**

In the `<style>` block replace `    .twin,.tag,.side{display:none}` with `    .twin,.tag,.side,.start{display:none}`, and replace the See inside block from its comment `/* See inside: the four layers fanned out from the far sky at the top left to the near grass at the bottom right, each` through the rule `.stage[data-hb-mode="inside"] #l4{translate:20% 22.6%}` with:

```css
    /* See inside: the four layers fanned out from the far sky at the top left to the near grass at the bottom right, each
       outlined and labeled with how far it moves. Each step down is taller than a label, so no layer hides the label of the
       one behind it, even on a phone, and the fan sits high enough that the near grass, which moves most, stays inside the
       box to the end of the scroll. The labels are drawn at 34px and the outline at 4px, and they shrink with their layer to
       about 13px and 1.5px; the layers lose will-change here, so the labels are drawn at their size and stay sharp.
       Behind each layer a faint dashed outline marks where that layer stood with the box at the top: the script moves the
       layer from there as the box scrolls, so the gap that opens shows how far it went (ruling 2). */
    .stage[data-hb-mode="inside"] .layers{overflow:visible;background:none}
    /* Each layer reads as a sheet: a faint fill behind its drawing */
    .stage[data-hb-mode="inside"] .layer{outline:4px solid rgba(244,244,242,.6);outline-offset:-4px;scale:.375;
      background:rgba(255,255,255,.08);will-change:auto}
    .stage[data-hb-mode="inside"] .start{display:block;position:absolute;top:0;left:0;width:100%;height:100%;scale:.375;
      outline:4px dashed rgba(244,244,242,.42);outline-offset:-4px;pointer-events:none}
    .stage[data-hb-mode="inside"] #l1,.stage[data-hb-mode="inside"] .s1{translate:-20% -29.6%}
    .stage[data-hb-mode="inside"] #l2,.stage[data-hb-mode="inside"] .s2{translate:-6.67% -12.2%}
    .stage[data-hb-mode="inside"] #l3,.stage[data-hb-mode="inside"] .s3{translate:6.67% 5.2%}
    .stage[data-hb-mode="inside"] #l4,.stage[data-hb-mode="inside"] .s4{translate:20% 22.6%}
```

- [ ] **Step 5: Markup**

In `#main`: change `<p class="side">With parallax</p>` to `<p class="side" data-hb-caption>With parallax</p>`; put `<span class="start s1" aria-hidden="true"></span>` on its own line right before `<div class="layer" id="l1">`, and likewise `s2` before `#l2`, `s3` before `#l3`, `s4` before `#l4`; change each `<span class="tag">` to `<span class="tag" data-hb-caption>`.

Replace the See inside note with:
```html
      <p data-hb-for="inside" hidden>Inside, the picture is four flat layers, each with a faint outline where it started: the far ones move least and the near grass most. Scroll the box or press Play to watch.</p>
```

- [ ] **Step 6: Script**

Replace `  twin.querySelectorAll('.tag').forEach(t => t.remove());` with:
```js
  twin.querySelectorAll('.tag, .start').forEach(t => t.remove());
```
and the comment line just above it, `// Compare's left side: a copy of the scene without parallax, named "Without parallax". The copy loses its ids (its sky` / `// gradient gets one of its own) and its labels.`, keeps its words with `and its labels` changed to `its labels and its start outlines`.

Replace the comment `    // See inside moves every layer half as far, so the moves keep their proportions and the near grass stays in the box` with:
```js
    // See inside moves each layer half as far within its card, and the card is drawn at three eighths of its size, so on
    // screen a layer moves about a fifth as far as in Normal: every move keeps its proportion, the near grass stays inside the
    // box, and the start outlines show how far each layer has gone
```

In `NOTES` set:
```js
    moving: {
      inside:  'Inside, the picture is four flat layers, each with a faint outline where it started: the far ones move least and the near grass most. Scroll the box or press Play to watch.',
      compare: 'Without parallax (left), every layer moves the same and the picture looks flat; with parallax (right), each moves its own amount and it looks deep. Scroll the box or press Play to watch.',
    },
    movingFlat: {
      inside:  'Inside, the picture is four flat layers; Depth is set to Flat, so they all move the same and the picture looks flat. Scroll the box or press Play to watch.',
      compare: 'Depth is set to Flat, so Without parallax and With parallax move the same. Pick another Depth in Try it, then scroll the box or press Play to watch.',
    },
    still: {
      inside:  'Inside, the picture is four flat layers, shown still. Each bar shows how far that layer would move: least for the far sky, most for the near grass.',
      compare: 'Both sides are shown still, as they stand halfway down the box: without parallax every layer has moved the same, with parallax each layer has moved its own amount.',
    },
    stillFlat: {
      inside:  'Inside, the picture is four flat layers, shown still. Depth is set to Flat, so every bar is the same: the layers would all move together and the picture would look flat.',
      compare: 'Both sides are shown still, halfway down the box; Depth is set to Flat, so Without parallax and With parallax match. Pick another Depth in Try it to see the difference.',
    },
```

- [ ] **Step 7: Tests**

Run: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-01a && node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"` and the Step 3 greps.
Expected: `ℹ fail 0`; greps `5`, `4`, `2`, `0`.

- [ ] **Step 8: Page check, screenshots, tuning**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $REPO/.claude/worktrees/sic-01a && node $RUN/slot.mjs run sic-01a -- node tools/check-pages.mjs --base http://127.0.0.1:8801 --out $RUN/checks/01-parallax-scrolling/1 animations/01-scroll-based/parallax-scrolling`
Expected: six `ok` lines. Open with the Read tool, in `$RUN/checks/01-parallax-scrolling/1/`: `01-parallax-scrolling-desktop-inside.png`, `-phone-inside.png`, `-phone-reduced-inside.png`, `-desktop-compare.png`, `-phone-compare.png`, `-phone-reduced-compare.png` (at desktop and phone-reduced the mode screenshots are taken with the box at the middle of its range; at phone the box stands wherever the arrival's Play left it). Tune the outline's dash and alpha (`rgba(244,244,242,.42)`, `4px dashed`) until, at 1280 and at 375: the gaps between the outlines and their cards grow from the sky (hardly any) to the grass (largest), no outline crosses a label's words, and under reduced motion each outline sits under its card. Zoom on the Hills label at 1280 (Read the screenshot and look closely): its letters are as crisp as the Normal step heading's. Run the page check again after every change (a new round folder `…/2`, `…/3`); it must stay at six `ok`.

- [ ] **Step 9: Normal before and after**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; node $RUN/slot.mjs run sic-01a -- node $KIT/record.mjs --base http://127.0.0.1:8801 --before http://127.0.0.1:8800 --only before --out $RUN/kit/01-parallax-scrolling --clean animations/01-scroll-based/parallax-scrolling`
Expected: two `ok` lines `01-parallax-scrolling-before-1280  0 of … pixels differ (0 visibly)` and the same for `375`, or a few pixels at the stage's rounded corners (0 visibly). More than that: Normal changed; find out why before going on.

- [ ] **Step 10: Commit**

```bash
cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-01a
git add animations/01-scroll-based/parallax-scrolling/index.html
git commit -m "feat: Parallax Scrolling's See inside outlines where each layer started and draws its labels sharp, and its notes name the halves"
```

- [ ] **Step 11: Review, fix rounds, merge into `sic/cat-01`**

The lane lead dispatches a fresh reviewer (never the builder) with: the brief, `git -C $REPO/.claude/worktrees/sic-01a diff feat/see-inside-compare...sic/01a`, the newest `$RUN/checks/01-parallax-scrolling/<round>/` (screenshots and the check's output), `$RUN/kit/01-parallax-scrolling/index.html`, and the 12 acceptance lines of the Global Constraints. The reviewer confirms each line (1: outlines show the gap at 1280 and 375; 3: the before-and-after count; 6: labels at 12px or more, sharp; and the others), checks what the page check cannot (the outlines follow the layers' fan at every Depth: one kit run per Depth, `node $RUN/slot.mjs run review-01 -- node $KIT/record.mjs --base http://127.0.0.1:8801 --only stills --press "#depth-seg [data-depth='deep']" --out $RUN/kit/01-parallax-deep animations/01-scroll-based/parallax-scrolling`, and the same for `flat` and `shallow`; those stills stand at mid-scroll, so also: at Flat on a phone, Back to top, then Play to the end, and look at the Sky and Hills labels. If the next layer's start outline crosses them, `.stage[data-hb-mode="inside"] .start{z-index:-1}` paints every outline under every card (the sticky frame holds them), at the cost of the part of each gap that the card above covers: that is the builder's call, stated in the report), and answers Approved or Changes needed with a list. The builder fixes (at most three rounds, each a new commit and a new check round). When approved:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare
cd $REPO/.claude/worktrees/sic-01a && git switch -c sic/cat-01 feat/see-inside-compare && git merge --no-ff sic/01a -m "Merge slot 01a: Parallax Scrolling's start outlines and fixes"
node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"   # ℹ fail 0
```
Then, as a background command, the category's page check: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $REPO/.claude/worktrees/sic-01a && node $RUN/slot.mjs run cat-01 -- node tools/check-pages.mjs --base http://127.0.0.1:8801 --out $RUN/checks/cat-01 animations/01-scroll-based > $RUN/checks/cat-01.log 2>&1`. When it has ended (the log's last line is `Screenshots: …`): `grep -c '^ok' $RUN/checks/cat-01.log` prints `162` and `grep -c '^FAIL' $RUN/checks/cat-01.log` prints `0`. Only then `git switch sic/01a` (the slot keeps its own branch for later pages), stop the server, and tell the coordinator `sic/cat-01` is ready (ledger line).

---

### Task 8: 02.01 Fade In / Fade Out: a graph of how solid the card is (See inside), "Appears at once" beside "Fades in" (Compare)

**Files:**
- Modify: `animations/02-entrance-and-exit/fade-in-out/index.html`: the `<style>` block (lines 23-34 at `03a00d0`), the stage (lines 56-62), the notes after the player bar (new, after line 67), the switch before the stage (new, after line 55), the `<script>` (lines 135-180).

**Interfaces:**
- Consumes: Task 2 (a press of See inside or Compare presses Replay), Task 3 (run waits; captions), Task 4 (switch tests), Task 6 (`?v=10`).
- Produces: the category 02 reference and the reference for the CURVE and TIMELINE pictures (24 pages) and for "between plays the halves rest on a posed moment".

- [ ] **Step 1: The brief** (the 02 lane lead, during Phase 0)

Write `$RUN/briefs/02.01-fade-in-out.md`:

```markdown
# 02.01 Fade In / Fade Out: brief (first batch)
Kind: plays once (Replay, Loop, Slow motion; the page slows its own fades). Category reference for 02; reference for CURVE/TIMELINE.
See inside: the card beside a graph of how solid it is over time (below it on phones). The line rises with the fade in in the
shape of the Feel's own curve, stays at the top for the hold, and with Loop on falls with the fade out; a dot rides it with the
card (across with the time since the play began, up with the card's real opacity). Labels: "Solid", "See-through",
"Fades in, about half a second" (words from Speed and Slow motion), "Stays", "Fades out" (Loop on only).
Compare: "Appears at once" (a copy with no fade, left) / "Fades in" (the card itself, right). Replay, Loop and Slow motion reach both
(one class on both cards). With Loop off, between plays the right card rests a fifth of a second into its fade ("A fifth of a second
in"), so Speed, Feel and Slow motion change the still too; with Loop on (the state after arrival) it fades in and out with the copy,
so the Compare note says the rest comes with Loop off.
Reduced motion: See inside still, the dot where the fade in ends; Compare posed as above; both notes say "shown still".
Phones: See inside stacks a compact card over the graph (four labels at most: "Stays" hidden); Compare side by side (each half
about 165px), cards compact.
Pitfalls: the copy must not take the reduced-motion 300 ms fade (!important beats it); the posed rule must start .stage[data-hb-mode="compare"];
Normal unchanged (the stage gains position:relative only); a Replay run holds its pauses with setTimeout, not inside a frame loop
(the page check's run wait sees only setTimeout timers and animations).
Survey row: rollout-survey-01-03.md, 02.01. This page is the reference for its kind of picture.
```

- [ ] **Step 2: The slot** (after Task 6)

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; git -C $REPO worktree add -b sic/02a $REPO/.claude/worktrees/sic-02a feat/see-inside-compare`
Start, as a background command: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-02a && python -m http.server 8804 --bind 127.0.0.1`
Ledger: `$RUN/lanes/02.md`.

- [ ] **Step 3: Turn on the switch tests for this page (the failing test)**

In `animations/02-entrance-and-exit/fade-in-out/index.html`, between `</div>` of `div.hb-step-head` and `<div class="stage hb-dots">`, add:

```html
    <div class="seg hb-modes" role="group" aria-label="What the box shows" data-hb-modes>
      <button type="button" data-hb-mode="normal" class="on" aria-pressed="true">Normal</button>
      <button type="button" data-hb-mode="inside" aria-pressed="false">See inside</button>
      <button type="button" data-hb-mode="compare" aria-pressed="false">Compare</button>
    </div>
```

After `</div>` of `div.hb-player`, add:

```html
    <div class="hb-mode-notes" aria-live="polite">
      <p data-hb-for="inside" hidden>The graph shows how solid the card is over time: it fades in, then stays, and with Loop on it fades out too. The dot rides the line as the card plays.</p>
      <p data-hb-for="compare" hidden>On the left, Appears at once: the card is simply there. On the right, Fades in: it turns from see-through to solid, and with Loop off it rests a fifth of a second in.</p>
    </div>
```

Run: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-02a && node --test --test-reporter=spec tests/pages.test.js 2>&1 | grep -E "^✖ |AssertionError"`
Expected: `✖ fade-in-out: the page's script listens for hb:mode, and its styles mark modes on the stage only` (named again under `✖ failing tests:`), with `AssertionError [ERR_ASSERTION]: the page script listens for hb:mode on document`.

- [ ] **Step 4: Styles**

Replace the whole `<style>` block with:

```html
  <style>
    :root{--ui-accent:#5fd88a;--ui-muted:#8a8a92;--dur:600ms;--ease:ease-out}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    .stage{position:relative;display:flex;align-items:center;justify-content:center;background:#0b0b0d}
    .card{background:#161b22;border:1px solid #30363d;border-radius:12px;padding:clamp(28px,5vw,48px);text-align:center;max-width:320px;
      opacity:0;transition:opacity var(--dur) var(--ease);will-change:opacity}
    .card.in{opacity:1}
    .card-icon{font-size:32px;margin-bottom:14px;opacity:.6}
    .card-title{font-size:clamp(17px,2.5vw,22px);font-weight:bold;margin-bottom:8px}
    .card-sub{font-size:11px;color:var(--ui-muted);line-height:1.65}
    /* See inside and Compare. Their labels are plain words on a dark backing. */
    .twin,.graph,.side,.when{display:none}
    .lbl{position:absolute;padding:3px 7px;border-radius:5px;background:rgba(11,11,13,.88);color:#f4f4f2;font:600 13px/1.2 var(--hb-font);white-space:nowrap}
    /* See inside: the card beside a graph of how solid it is over time (below it on phones). The line rises with the fade in, in
       the shape of the Feel, stays at the top while the card stays, and with Loop on falls with the fade out; the dot rides it as
       the card plays: across with the time, up with how solid the card is. */
    .stage[data-hb-mode="inside"]{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);align-items:center;
      gap:clamp(12px,3vw,32px);padding:clamp(12px,3vw,32px)}
    .stage[data-hb-mode="inside"] .card{justify-self:center}
    .stage[data-hb-mode="inside"] .graph{display:block}
    .graph{position:relative;width:100%;max-width:460px;aspect-ratio:300/170;justify-self:center}
    .graph svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
    .graph .axis{fill:none;stroke:rgba(244,244,242,.5);stroke-width:1.5}
    .graph .curve{fill:none;stroke:var(--ui-accent);stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
    .graph .dot{fill:#f4f4f2}
    .graph .lbl{transform:translateX(-50%)}
    .graph .y1,.graph .y0{left:0;transform:none}
    .graph .y1{top:0}
    .graph .y0{top:70%}
    .graph .xin,.graph .xout{top:86%}
    .graph .xstay{top:-6%}
    /* Compare: the card twice. On the left a copy that appears at once (no fade); on the right the card itself, which fades. Between
       plays the right card is held a fifth of a second into its fade, so the still picture shows the difference too. */
    .stage[data-hb-mode="compare"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));align-items:center;justify-items:center;
      gap:2px;padding:48px clamp(8px,2vw,24px) 40px}
    .stage[data-hb-mode="compare"] .twin,.stage[data-hb-mode="compare"] .side{display:block}
    .stage[data-hb-mode="compare"] .card{max-width:100%}
    .card.twin{transition:none!important}
    .side{top:12px}
    .side.first{left:12px}
    .side.second{left:calc(50% + 12px)}
    .when{right:12px;bottom:10px}
    .stage[data-hb-mode="compare"].posed .when{display:block}
    .stage[data-hb-mode="compare"].posed .card:not(.twin){opacity:var(--posed,.5)!important;transition:none!important}
    @media(max-width:600px){
      .stage[data-hb-mode="inside"]{grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);gap:8px}
      .stage[data-hb-mode="inside"] .card,.stage[data-hb-mode="compare"] .card{padding:14px 16px}
      .stage[data-hb-mode="inside"] .card-sub,.stage[data-hb-mode="compare"] .card-sub{display:none}
      .stage[data-hb-mode="inside"] .card-icon,.stage[data-hb-mode="compare"] .card-icon{font-size:22px;margin-bottom:6px}
      .graph .xstay{display:none}
      .when{left:calc(50% + 8px);right:8px;white-space:normal;text-align:center}
    }
    @media(prefers-reduced-motion:reduce){.card{transition:opacity 300ms linear!important}}
  </style>
```

- [ ] **Step 5: Markup**

Replace the stage (from `<div class="stage hb-dots">` to its closing `</div>`) with:

```html
    <div class="stage hb-dots">
      <div class="card" id="card">
        <div class="card-icon">◈</div>
        <div class="card-title">Fade In</div>
        <div class="card-sub">Nothing moves or changes size; it only goes from see-through to solid.</div>
      </div>
      <div class="graph" aria-hidden="true">
        <svg viewBox="0 0 300 170">
          <path class="axis" d="M70 16V140H290"/>
          <path class="curve" id="curve" d="M70 140"/>
          <circle class="dot" id="dot" r="6"/>
        </svg>
        <span class="lbl y1" data-hb-caption>Solid</span>
        <span class="lbl y0" data-hb-caption>See-through</span>
        <span class="lbl xin" id="lbl-in" data-hb-caption>Fades in</span>
        <span class="lbl xstay" id="lbl-stay" data-hb-caption>Stays</span>
        <span class="lbl xout" id="lbl-out" data-hb-caption>Fades out</span>
      </div>
      <p class="lbl side first" aria-hidden="true" data-hb-caption>Appears at once</p>
      <p class="lbl side second" aria-hidden="true" data-hb-caption>Fades in</p>
      <p class="lbl when" aria-hidden="true" data-hb-caption>A fifth of a second in</p>
    </div>
```

- [ ] **Step 6: Script**

Replace the whole `<script>` (from `<script>` after the footer to `</script>`) with:

```html
<script>
  const card=document.getElementById('card');
  const stage=card.parentElement;
  const vars=document.documentElement.style;
  const loopTog=document.getElementById('loop-tog'),slowTog=document.getElementById('slow-tog');
  const motionOk=!window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  let ms=600,ease='ease-out',timers=[];
  // See inside and Compare. The Feel choices as the four numbers of their speed curves (the browser's own), the page's hold before
  // a fade out and wait before the next play with Loop on, where the graph's line runs (in the drawing's units), and the moment
  // Compare holds between plays.
  const CURVES={'ease-out':[0,0,.58,1],'ease-in-out':[.42,0,.58,1],linear:[0,0,1,1]};
  const HOLD=800,WAIT=300,X0=70,X1=290,YT=16,YB=140,POSE_MS=200;
  const curve=document.getElementById('curve'),dot=document.getElementById('dot');
  const lblIn=document.getElementById('lbl-in'),lblStay=document.getElementById('lbl-stay'),lblOut=document.getElementById('lbl-out');
  // Compare's first card: a copy that appears and leaves at once (no fade), out of reach of the keyboard and screen readers
  const twin=card.cloneNode(true);
  twin.removeAttribute('id');twin.classList.add('twin');twin.inert=true;twin.setAttribute('aria-hidden','true');
  card.before(twin);
  // Under reduced motion both views are still pictures, and their notes say so
  if(!motionOk){
    document.querySelector('[data-hb-for="inside"]').textContent='The graph shows how solid the card gets over time, shown still: the dot sits where the fade in ends.';
    document.querySelector('[data-hb-for="compare"]').textContent='Shown still, a fifth of a second in: on the left, Appears at once, the card is fully there; on the right, Fades in, it is only part of the way.';
  }
  let mode='normal',cycleStart=-1e9,dotRaf=0;

  function dur(){return slowTog.checked?ms*3:ms}
  function apply(){
    vars.setProperty('--dur',dur()+'ms');
    vars.setProperty('--ease',ease);
  }
  function later(fn,wait){timers.push(setTimeout(fn,wait))}
  function setIn(on){card.classList.toggle('in',on);twin.classList.toggle('in',on)}
  function fadeIn(){
    cycleStart=performance.now();
    // snap back to fully transparent without a transition so every play restarts from invisible
    card.style.setProperty('transition','none','important');
    setIn(false);void card.offsetWidth;
    card.style.removeProperty('transition');
    setIn(true);
    if(mode==='inside')ride();
  }
  // One play fades in. While Loop is on it then holds, fades out, waits and plays again;
  // switching Loop off lets the card finish visible. Slow motion stretches the fades, not the waits.
  // In Compare a play lifts the pose, and once it is over the right card is held at its moment again.
  function cycle(){
    apply();
    if(motionOk)pose(false);
    fadeIn();
    if(!loopTog.checked||!motionOk){
      if(motionOk&&mode==='compare')later(()=>pose(true),dur()+700);
      return;
    }
    later(()=>{
      if(!loopTog.checked)return;
      setIn(false);
      later(cycle,dur()+300);
    },dur()+800);
  }
  function play(){timers.forEach(clearTimeout);timers=[];cycle()}

  // The value of a speed curve at a share x of its time: the curve's own t for x found by halving, then its height there
  function curveAt([a,b,c,e],x){
    const at=(p,q,t)=>3*p*t*(1-t)*(1-t)+3*q*t*t*(1-t)+t*t*t;
    let lo=0,hi=1,t=x;
    for(let i=0;i<30;i++){t=(lo+hi)/2;if(at(a,c,t)<x)lo=t;else hi=t}
    return at(b,e,t);
  }
  // A play's parts in ms: the fade in and the hold, and with Loop on the fade out and the wait
  function parts(){const d=dur();return loopTog.checked&&motionOk?[d,HOLD,d,WAIT]:[d,HOLD]}
  function words(t){return t<=400?'about a third of a second':t<=700?'about half a second':t<=1200?'about a second':t<=2000?'about two seconds':'about three seconds'}
  // The graph: across is time, up is how solid the card is; each fade is drawn with the Feel's own curve
  function drawGraph(){
    const p=parts(),total=p.reduce((s,v)=>s+v,0),[a,b,c,e]=CURVES[ease],h=YB-YT;
    const x=t=>(X0+(X1-X0)*t/total).toFixed(1);
    let d=`M${X0} ${YB}C${x(p[0]*a)} ${YB-h*b} ${x(p[0]*c)} ${YB-h*e} ${x(p[0])} ${YT}H${x(p[0]+p[1])}`;
    if(p.length>2){
      const o=p[0]+p[1];
      d+=`C${x(o+p[2]*a)} ${YT+h*b} ${x(o+p[2]*c)} ${YT+h*e} ${x(o+p[2])} ${YB}H${X1}`;
    }
    curve.setAttribute('d',d);
    const at=(el,t)=>{el.style.left=(100*x(t)/300).toFixed(1)+'%'};
    lblIn.textContent='Fades in, '+words(p[0]);
    at(lblIn,p[0]/2);at(lblStay,p[0]+p[1]/2);
    lblOut.hidden=p.length<3;
    if(p.length>2)at(lblOut,p[0]+p[1]+p[2]/2);
  }
  // The dot: across with the time since the play began, up with how solid the card is right now (still: where the fade in ends)
  function placeDot(){
    const p=parts(),total=p.reduce((s,v)=>s+v,0);
    const t=motionOk?Math.min(Math.max(performance.now()-cycleStart,0),total):p[0];
    const solid=motionOk?parseFloat(getComputedStyle(card).opacity):1;
    dot.style.transform=`translate(${X0+(X1-X0)*t/total}px,${YB-(YB-YT)*solid}px)`;
    return t<total;
  }
  function ride(){
    cancelAnimationFrame(dotRaf);
    const step=()=>{dotRaf=placeDot()&&mode==='inside'&&motionOk?requestAnimationFrame(step):0};
    step();
  }
  // Compare's still moment: a fifth of a second into the fade, the right card as solid as its fade has made it by then
  function pose(on){
    stage.classList.toggle('posed',on);
    if(on)stage.style.setProperty('--posed',curveAt(CURVES[ease],Math.min(1,POSE_MS/dur())).toFixed(3));
  }
  function refresh(){
    drawGraph();
    if(mode==='inside')placeDot();
    if(stage.classList.contains('posed'))pose(true);
  }

  // The mode switch: draws the mode at once. The shared script then presses Replay (not under reduced motion), which plays it.
  document.addEventListener('hb:mode',e=>{
    const was=mode;mode=e.detail.mode;
    // Leaving Compare's held moment shows the card as it now is, at once, with no fade
    if(was==='compare'&&mode!=='compare'){card.style.setProperty('transition','none','important');pose(false);void card.offsetWidth;card.style.removeProperty('transition');}
    pose(mode==='compare'&&!(loopTog.checked&&motionOk));
    refresh();
    if(mode==='inside'&&motionOk)ride();
  });

  document.getElementById('btn-play').addEventListener('click',play);
  loopTog.addEventListener('change',()=>{
    if(loopTog.checked)play();
    else if(mode==='compare')later(()=>pose(true),dur()+700);
    refresh();
  });
  slowTog.addEventListener('change',refresh);
  function choices(id,pick){
    const buttons=document.querySelectorAll('#'+id+' button');
    buttons.forEach(b=>b.addEventListener('click',()=>{
      buttons.forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',String(x===b))});
      pick(b.dataset);
      refresh();
    }));
  }
  choices('speed-seg',d=>{ms=+d.ms});
  choices('feel-seg',d=>{ease=d.ease});
  apply();
  drawGraph();
</script>
```

- [ ] **Step 7: Tests**

Run: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-02a && node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)|^✔ fade-in-out: (the mode switch is as in the template|exactly two notes|the page's script listens)"`
Expected: the three switch tests' `✔` lines for `fade-in-out` and `ℹ fail 0`.

- [ ] **Step 8: Page check, screenshots, tuning**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $REPO/.claude/worktrees/sic-02a && node $RUN/slot.mjs run sic-02a -- node tools/check-pages.mjs --base http://127.0.0.1:8804 --out $RUN/checks/02-fade-in-out/1 animations/02-entrance-and-exit/fade-in-out`
Expected: six `ok` lines (the check turns Loop off, presses See inside, waits for the Replay the shared script presses, and so on). Open `02-fade-in-out-desktop-inside.png`, `-phone-inside.png`, `-phone-reduced-inside.png`, `-desktop-compare.png`, `-phone-compare.png`, `-phone-reduced-compare.png` in `$RUN/checks/02-fade-in-out/1/`. Tune (sizes, label places, the graph's plot area `X0`, `X1`, `YT`, `YB` and the label `top` values) until, at 1280 and at 375: the graph reads as "rises, stays" at a glance; every label is clear of the line's start, of the dot and of the others; the card and the graph both fit with room; in Compare the right card is visibly fainter than the left one and the "A fifth of a second in" label sits by it; under reduced motion both are still pictures that teach. Then look at the motion, which the screenshots cannot show: run `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; node $RUN/slot.mjs run sic-02a -- node $KIT/record.mjs --base http://127.0.0.1:8804 --only clips --keep-frames --out $RUN/kit/02-fade-in-out-clips animations/02-entrance-and-exit/fade-in-out` and Read three frames from the middle of the See inside clip's kept frame folder (the log names it): the dot sits on the line in each. In the Compare clip's frames the left card is solid while the right one is part way. Acceptance 7 by eye, one kit run per other choice: `node $RUN/slot.mjs run sic-02a -- node $KIT/record.mjs --base http://127.0.0.1:8804 --only stills --press "#speed-seg [data-ms='1000']" --out $RUN/kit/02-fade-in-out-slow animations/02-entrance-and-exit/fade-in-out`, then the same with `"#speed-seg [data-ms='350']"` (`…-fast`), `"#feel-seg [data-ease='ease-in-out']"` (`…-gentle`) and `"#feel-seg [data-ease='linear']"` (`…-even`); in each, See inside's curve or words and Compare's right card differ from the default run's. Rerun the page check after every change (a new round folder); six `ok` each time.

- [ ] **Step 9: Normal before and after**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; node $RUN/slot.mjs run sic-02a -- node $KIT/record.mjs --base http://127.0.0.1:8804 --before http://127.0.0.1:8800 --only before --out $RUN/kit/02-fade-in-out --clean animations/02-entrance-and-exit/fade-in-out`
Expected: `0 of … pixels differ (0 visibly)` at 1280 and at 375.

- [ ] **Step 10: Commit**

```bash
cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-02a
git add animations/02-entrance-and-exit/fade-in-out/index.html
git commit -m "feat: Fade In / Fade Out shows a graph of how solid the card is over time (See inside) and the card appearing at once beside the card fading in (Compare)"
```

- [ ] **Step 11: Review, fix rounds, merge into `sic/cat-02`**

The lane lead dispatches a fresh reviewer with: the brief, `git -C $REPO/.claude/worktrees/sic-02a diff feat/see-inside-compare...sic/02a`, the newest check round folder and output, `$RUN/kit/02-fade-in-out/index.html` and the clips, and the 12 acceptance lines. Beyond the check, the reviewer confirms the per-frame work (the dot's loop runs only in See inside while a play lasts, moves by time, and stops; the copy never takes a transition), that a Replay run holds its pauses with `setTimeout`, not inside a frame loop, that Replay, Loop and Slow motion reach both cards, that every Speed and Feel changes See inside and Compare, and that the notes match what shows; verdict Approved or Changes needed. At most three fix rounds. When approved:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook
cd $REPO/.claude/worktrees/sic-02a && git switch -c sic/cat-02 feat/see-inside-compare && git merge --no-ff sic/02a -m "Merge slot 02a: Fade In / Fade Out's See inside and Compare"
node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"   # ℹ fail 0
```
Then, as a background command: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $REPO/.claude/worktrees/sic-02a && node $RUN/slot.mjs run cat-02 -- node tools/check-pages.mjs --base http://127.0.0.1:8804 --out $RUN/checks/cat-02 animations/02-entrance-and-exit > $RUN/checks/cat-02.log 2>&1`. When it has ended (the log's last line is `Screenshots: …`): `grep -c '^ok' $RUN/checks/cat-02.log` prints `84` and `grep -c '^FAIL' $RUN/checks/cat-02.log` prints `0`. Only then `git switch sic/02a`, stop the server, ledger line, tell the coordinator `sic/cat-02` is ready.

---
### Task 9: 03.14 Overlay Wipe: the change's three steps with the panel see-through (See inside), "Switches at once" beside "Panel sweeps over" (Compare)

**Files:**
- Modify: `animations/03-page-transitions/overlay-wipe/index.html`: the `<style>` block (the `.stage` rule, line 26; new rules before `</style>`, line 53), the switch before the stage (after line 74), the stage (lines 75-80), the notes after the player bar (after line 85), the `<script>` (lines 173-297: new constants and functions, and small changes to `showPage`, `finish`, `settle`, `navigate`, the `hb:input` listener and `choices`).

**Interfaces:**
- Consumes: Task 2 (a press of See inside or Compare presses Show me), Task 3 (Reset and the run wait before the pictures; captions), Task 4 (switch tests), Task 6 (`?v=10`).
- Produces: the category 03 reference (the fourteen small-site transitions): a copy of the small site (`div.box.twin`) that follows `current` at the moment a change starts; numbered bars on a time line with a marker (the cover, swap, uncover picture: Curtain Reveal and Flash / Light Leak draw their own versions); a posed panel at rest (See inside: covering, see-through; Compare: half way); the reduced-motion posed still.

- [ ] **Step 1: The brief** (the 03 lane lead, during Phase 0)

Write `$RUN/briefs/03.14-overlay-wipe.md`:

```markdown
# 03.14 Overlay Wipe: brief (first batch)
Kind: do-it, click (Show me visits the next page, holds 1.2 s and comes back; Reset; the page slows itself). Category reference for 03.
See inside: the panel see-through, so the page changing behind it shows; under the page area a strip of numbered bars on one time
line: 1 the panel comes in, 2 the page changes behind it (the covered stay), 3 the panel leaves (with Two stacked panels a lighter
bar leads in and trails out); a marker moves through them during a change. Key: "1 Panel comes in", "2 Page changes behind it",
"3 Panel leaves" (+ "Light bar: the second panel"). The strip stands for 1.6 s (4.8 in slow motion), so Speed changes the bars.
At rest the panel stands over the page (see-through, the next page's name on it) with the marker at bar 2.
Compare: "Switches at once" (a copy of the small site, inert, that changes page the moment the real one starts to) / "Panel sweeps
over" (the real site). Clicks, Show me and Reset reach both (the copy follows the real site). At rest the real panel stands half
way across (with Two stacked panels the light one a quarter further in, so the setting shows). The half names sit at the bottom of
each half, not at its top as spec section 1 has them, because the top of each half holds the small site's nav.
Reduced motion (the page fades instead): both views are posed stills (the same poses); notes say "shown still".
Phones: Compare side by side (about 170px each: nav buttons tighter, page text cut to the eyebrow and heading); stacked at 360px
and below. The real nav buttons stay 44px (check by hand).
Pitfalls: the copy has no ids and no buttons (spans); the pose is lifted the moment a change starts and comes back only when no
change or way back is pending; Normal unchanged (the nav and page area are wrapped in div.box, which lays out as before); a Show me
run holds its pauses with setTimeout, not inside a frame loop (the page check's run wait sees only setTimeout timers and animations).
Survey row: rollout-survey-01-03.md, 03.14. Twins in look: Curtain Reveal (02.06) and Flash (03.07) draw their own pictures.
```

- [ ] **Step 2: The slot** (after Task 6)

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; git -C $REPO worktree add -b sic/03a $REPO/.claude/worktrees/sic-03a feat/see-inside-compare`
Start, as a background command: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-03a && python -m http.server 8806 --bind 127.0.0.1`
Ledger: `$RUN/lanes/03.md`.

- [ ] **Step 3: Turn on the switch tests for this page (the failing test)**

In `animations/03-page-transitions/overlay-wipe/index.html`, between `</div>` of `div.hb-step-head` and `<div class="stage">`, add:

```html
    <div class="seg hb-modes" role="group" aria-label="What the box shows" data-hb-modes>
      <button type="button" data-hb-mode="normal" class="on" aria-pressed="true">Normal</button>
      <button type="button" data-hb-mode="inside" aria-pressed="false">See inside</button>
      <button type="button" data-hb-mode="compare" aria-pressed="false">Compare</button>
    </div>
```

After `</div>` of `div.hb-player`, add:

```html
    <div class="hb-mode-notes" aria-live="polite">
      <p data-hb-for="inside" hidden>Inside, the panel is see-through, so the page changing behind it shows; the bars are the change's three steps, and the marker moves through them. Click Work or About, or press Show me.</p>
      <p data-hb-for="compare" hidden>Switches at once: the page simply changes; Panel sweeps over: a panel covers it while it changes. Click Work or About, or press Show me.</p>
    </div>
```

Run: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-03a && node --test --test-reporter=spec tests/pages.test.js 2>&1 | grep -E "^✖ |AssertionError"`
Expected: `✖ overlay-wipe: the page's script listens for hb:mode, and its styles mark modes on the stage only` (named again under `✖ failing tests:`), with `AssertionError [ERR_ASSERTION]: the page script listens for hb:mode on document`.

- [ ] **Step 4: Styles**

Replace `    .stage{display:flex;flex-direction:column;overflow:hidden;background:var(--bg);color:var(--ui-text)}` with:
```css
    .stage{position:relative;display:flex;flex-direction:column;overflow:hidden;background:var(--bg);color:var(--ui-text)}
```

Before `  </style>` add:

```css
    /* The small site: its nav row over its page area. In Compare a copy of it, the twin, sits beside it. */
    .box{display:flex;flex-direction:column;flex:1;min-height:0;min-width:0}
    .twin,.steps,.lbl{display:none}
    .twin .nav-btn{display:inline-flex;align-items:center}
    .lbl{padding:2px 7px;border-radius:5px;background:#111114;color:#f4f4f2;font:600 12px/1.25 var(--hb-font);white-space:nowrap}
    /* See inside: the panel see-through, so the page changing behind it shows, and under the page area the change's three steps
       as numbered bars on one time line, with a marker that moves through them while a change runs. At rest the panel stands
       over the page, with the marker where the page changes. */
    .stage[data-hb-mode="inside"] .panel{opacity:.55}
    .stage[data-hb-mode="inside"].posed .wipe{display:block}
    .stage[data-hb-mode="inside"] .steps{display:block}
    .stage[data-hb-mode="inside"] .steps .lbl{display:inline-block}
    .steps{flex:none;padding:8px 14px 10px;background:#111114;border-top:1px solid var(--ui-border)}
    .bars{position:relative;height:30px}
    .bar{position:absolute;top:8px;height:18px;border-radius:4px;background:var(--panel);color:#0b0b0d;font:700 12px/18px var(--hb-font);
      text-align:center;overflow:hidden}
    .bar.swap{background:repeating-linear-gradient(135deg,var(--panel) 0 5px,color-mix(in srgb,var(--panel) 35%,#111114) 5px 9px)}
    /* The "2" sits on a chip of the panel's own color, so it reads as well as the "1" and the "3" over the dark stripes */
    .bar .chip{display:inline-block;padding:0 4px;border-radius:3px;line-height:14px;background:var(--panel)}
    .bar.lead{top:0;height:6px;background:color-mix(in srgb,var(--panel) 45%,#fff)}
    .mark{position:absolute;left:0;top:0;width:2px;height:30px;background:#f4f4f2}
    .key{display:flex;flex-wrap:wrap;gap:6px 12px;margin-top:6px}
    /* Compare: on the left the copy, which changes page at once; on the right the real site, whose panel sweeps over. At rest the
       real site's panel stands half way across, so the still picture shows the sweep; with two panels the light one stands a
       quarter further in, so it shows beside the front one. */
    .stage[data-hb-mode="compare"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px;background:#2a2a30}
    .stage[data-hb-mode="compare"] .twin{display:flex}
    .stage[data-hb-mode="compare"] .side{display:block}
    .stage[data-hb-mode="compare"].posed .box:not(.twin) .wipe{display:block}
    .stage[data-hb-mode="compare"].posed .box:not(.twin) .panel{transform:var(--half)}
    .stage[data-hb-mode="compare"].posed .box:not(.twin) .panel.back{transform:var(--lead)}
    .side{position:absolute;bottom:10px}
    .side.first{left:10px}
    .side.second{left:calc(50% + 10px)}
    @media(max-width:600px){
      .stage[data-hb-mode="compare"] .mini-nav{gap:4px;padding:6px}
      .stage[data-hb-mode="compare"] .nav-btn{padding:0 6px;font-size:12px}
      .stage[data-hb-mode="compare"] .pc{padding:12px;gap:6px}
      .stage[data-hb-mode="compare"] .ph{font-size:16px}
      .stage[data-hb-mode="compare"] .pp,.stage[data-hb-mode="compare"] .pgrid,.stage[data-hb-mode="compare"] .pstat{display:none}
    }
    @media(max-width:360px){
      .stage[data-hb-mode="compare"]{grid-template-columns:minmax(0,1fr);grid-template-rows:repeat(2,minmax(0,1fr))}
      .stage[data-hb-mode="compare"] .side.first{bottom:calc(50% + 10px)}
      .stage[data-hb-mode="compare"] .side.second{left:10px}
    }
```

- [ ] **Step 5: Markup**

Replace the stage (from `<div class="stage">` to its closing `</div>`) with:

```html
    <div class="stage">
      <div class="box" id="box">
        <nav class="mini-nav" id="nav" aria-label="Demo pages"></nav>
        <div class="page-area" id="page-area">
          <div class="wipe" id="wipe" aria-hidden="true"><span class="panel back" id="back"></span><span class="panel front" id="front"><b class="pname" id="pname"></b></span></div>
        </div>
      </div>
      <div class="steps" aria-hidden="true">
        <div class="bars"><span class="bar lead" id="b-lead-in"></span><span class="bar lead" id="b-lead-out"></span><span class="bar" id="b-in">1</span><span class="bar swap" id="b-swap"><span class="chip">2</span></span><span class="bar" id="b-out">3</span><span class="mark" id="mark"></span></div>
        <p class="key"><span class="lbl k" data-hb-caption>1 Panel comes in</span><span class="lbl k" data-hb-caption>2 Page changes behind it</span><span class="lbl k" data-hb-caption>3 Panel leaves</span><span class="lbl k" id="l-lead" data-hb-caption hidden>Light bar: the second panel</span></p>
      </div>
      <p class="lbl side first" aria-hidden="true" data-hb-caption>Switches at once</p>
      <p class="lbl side second" aria-hidden="true" data-hb-caption>Panel sweeps over</p>
    </div>
```

- [ ] **Step 6: Script**

(a) Replace the line `  const nav=document.getElementById('nav'),area=document.getElementById('page-area'),wipe=document.getElementById('wipe');` with:
```js
  const box=document.getElementById('box'),stage=box.parentElement;
  const nav=document.getElementById('nav'),area=document.getElementById('page-area'),wipe=document.getElementById('wipe');
```

(b) After the line `  const TO={ltr:'translateX(100%)',rtl:'translateX(-100%)',btt:'translateY(-100%)',ttb:'translateY(100%)'};` add:
```js
  // Half way in, for each direction: where Compare's still picture holds the panel; with two panels the light one, which leads,
  // stands a quarter further in
  const HALF={ltr:'translateX(-50%)',rtl:'translateX(50%)',btt:'translateY(50%)',ttb:'translateY(-50%)'};
  const LEAD={ltr:'translateX(-25%)',rtl:'translateX(25%)',btt:'translateY(25%)',ttb:'translateY(-25%)'};
```

(c) After the `PAGES.forEach((p,i)=>{ … });` block add:
```js
  // Compare's first half: the same small site, changing page at once. A copy built from the same pages, with no ids and no
  // buttons, out of the Tab order and hidden from screen readers; it changes page the moment a change of the real site starts (a
  // click, Show me, Reset), so one input drives both halves.
  const twin=document.createElement('div');
  twin.className='box twin';twin.inert=true;twin.setAttribute('aria-hidden','true');
  twin.innerHTML=`<div class="mini-nav">${PAGES.map(p=>`<span class="nav-btn">${p.name}</span>`).join('')}</div>`+
    `<div class="page-area">${PAGES.map(p=>`<div class="page" style="background:${p.bg}">${p.html}</div>`).join('')}</div>`;
  box.before(twin);
  const twinPages=[...twin.querySelectorAll('.page')],twinNav=[...twin.querySelectorAll('.nav-btn')];
  function showTwin(n){twinPages.forEach((el,i)=>el.classList.toggle('active',i===n));twinNav.forEach((b,i)=>b.classList.toggle('active',i===n))}
  // See inside's bars, on a time line of 1.6 seconds (three times that in slow motion), and its marker
  const mark=document.getElementById('mark'),bars=mark.parentElement,lblLead=document.getElementById('l-lead');
  const B={in:'b-in',swap:'b-swap',out:'b-out',leadIn:'b-lead-in',leadOut:'b-lead-out'};
  Object.keys(B).forEach(k=>{B[k]=document.getElementById(B[k])});
  const SPAN=1600;
  let mode='normal',changeAt=0,markRaf=0;
  // Under reduced motion both views are still pictures, and their notes say so
  if(!motionOk){
    document.querySelector('[data-hb-for="inside"]').textContent='Inside, shown still: the see-through panel covers the page while it changes, and the bars are the three steps of the change.';
    document.querySelector('[data-hb-for="compare"]').textContent='Shown still: Switches at once has simply changed page; Panel sweeps over has its panel caught half way across.';
  }
```

(d) In `showPage(n)` add `    showTwin(n);` after `    updateNav(n);`. In `finish()` add `    pose();` as its last line (after `if(then)then();`). In `settle()` add `    pose();` as its last line (after `showPage(current);`).

(e) In `navigate(next,then)`, right after `    const prev=current;current=next;updateNav(next);` add:
```js
    // The copy changes page at once; the pose goes, and the marker starts with the change
    showTwin(next);stage.classList.remove('posed');changeAt=performance.now();
    if(mode==='inside'&&motionOk)rideMark();
```

(f) Replace `  document.addEventListener('hb:input',()=>{afterMove=null;cancel(wayBack);wayBack=0});` with:
```js
  document.addEventListener('hb:input',()=>{afterMove=null;cancel(wayBack);wayBack=0;pose()});
```

(g) Before `  function choices(id,pick){` add:
```js
  // One change, in ms, as navigate() runs it: the front panel comes in after the lead, the page is covered for the stay (it changes
  // at the start of it), then the front panel leaves; with two panels the lighter one comes in first and leaves last
  function plan(){
    const ms=sweepMs*(slowTog.checked?3:1),stay=ms/4,lead=twoTog.checked?ms/4:0;
    return{ms,stay,lead,total:2*ms+stay+2*lead};
  }
  function drawSteps(){
    const p=plan(),span=SPAN*(slowTog.checked?3:1);
    const set=(el,from,len)=>{el.style.left=(100*from/span).toFixed(2)+'%';el.style.width=(100*len/span).toFixed(2)+'%'};
    set(B.in,p.lead,p.ms);set(B.swap,p.lead+p.ms,p.stay);set(B.out,p.lead+p.ms+p.stay,p.ms);
    set(B.leadIn,0,p.ms);set(B.leadOut,2*p.lead+p.ms+p.stay,p.ms);
    B.leadIn.hidden=B.leadOut.hidden=lblLead.hidden=!twoTog.checked;
  }
  // The marker at time t of a change, on the bars' time line
  function placeMark(t){
    const span=SPAN*(slowTog.checked?3:1);
    mark.style.transform=`translateX(${(bars.clientWidth*Math.min(t,span)/span).toFixed(1)}px)`;
  }
  function rideMark(){
    cancelAnimationFrame(markRaf);
    const step=()=>{const t=performance.now()-changeAt;placeMark(t);markRaf=t<plan().total&&mode==='inside'?requestAnimationFrame(step):0};
    step();
  }
  // At rest in See inside and Compare the panel stands still at a telling moment: in See inside over the page, see-through,
  // with the marker where the page changes; in Compare half way across the real site. A change lifts the pose.
  function pose(){
    const on=mode!=='normal'&&!animating&&!wayBack;
    stage.classList.toggle('posed',on);
    if(!on)return;
    nameEl.textContent=PAGES[(current+1)%PAGES.length].name;
    back.hidden=!twoTog.checked;
    stage.style.setProperty('--half',HALF[dir]);stage.style.setProperty('--lead',LEAD[dir]);
    const p=plan();placeMark(p.lead+p.ms);
  }
  // The mode switch: draws the mode at once. The shared script then presses Show me (not under reduced motion), which plays it.
  document.addEventListener('hb:mode',e=>{
    mode=e.detail.mode;
    drawSteps();
    pose();
  });
  // The posed marker is placed in pixels, so a new size of the window (a phone turned) places it again
  addEventListener('resize',()=>{if(mode==='inside'&&!animating&&!wayBack)pose()});

```

(h) In `choices`, after `      pick(b.dataset);` add `      drawSteps();pose();`. After the three `choices(…)` calls add:
```js
  twoTog.addEventListener('change',()=>{drawSteps();pose()});
  slowTog.addEventListener('change',()=>{drawSteps();pose()});
```
and after the final `  showPage(0);` add `  drawSteps();`.

- [ ] **Step 7: Tests**

Run: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-03a && node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ fail 0`.

- [ ] **Step 8: Page check, screenshots, tuning**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $REPO/.claude/worktrees/sic-03a && node $RUN/slot.mjs run sic-03a -- node tools/check-pages.mjs --base http://127.0.0.1:8806 --out $RUN/checks/03-overlay-wipe/1 animations/03-page-transitions/overlay-wipe`
Expected: six `ok` lines (before the modes the check presses Reset and waits; each mode press starts Show me, about 3.3 s with its hold, which the check waits for). Open `03-overlay-wipe-desktop-inside.png`, `-phone-inside.png`, `-phone-reduced-inside.png`, `-desktop-compare.png`, `-phone-compare.png`, `-phone-reduced-compare.png`, and `03-overlay-wipe-phone-small-inside.png` and `-phone-small-compare.png` (the setup's own `03-overlay-wipe-phone-small.png` shows Normal). Tune (the strip's height and padding, the key's gap, the bars' height, the see-through `.55`, the Compare text cuts) until: the page's heading reads through the see-through panel; the three numbered bars and the key read at 1280 and 375; in Compare the right half's panel stands half across with "Switches at once" and "Panel sweeps over" clear of the page text; at 320 the halves stack and each shows its nav and heading; at 320 each half name sits in its own half; every real nav button is at least 44×44 in Compare at 375 and 320 (measure in the screenshot: 44 CSS px are 88 pixels at scale 2). Motion: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; node $RUN/slot.mjs run sic-03a -- node $KIT/record.mjs --base http://127.0.0.1:8806 --only clips --keep-frames --out $RUN/kit/03-overlay-wipe-clips animations/03-page-transitions/overlay-wipe`; in the See inside clip's frames the marker passes bar 1 while the panel comes in, bar 2 while it covers, bar 3 while it leaves; in the Compare clip's frames the left half changes page in one frame while the right half's panel sweeps. Acceptance 7: kit runs with `--only stills --press "#dir-seg [data-dir='btt']"`, `--press "#color-sw [data-c='#3fd6c4']"`, `--press "#two-tog"` and `--press "#speed-seg [data-ms='550']"` (each into its own `--out`): the pose's side, the colors, the light bars and the bar lengths change. Six `ok` after every change.

- [ ] **Step 9: Normal before and after**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; node $RUN/slot.mjs run sic-03a -- node $KIT/record.mjs --base http://127.0.0.1:8806 --before http://127.0.0.1:8800 --only before --out $RUN/kit/03-overlay-wipe --clean animations/03-page-transitions/overlay-wipe`
Expected: `0 of … pixels differ (0 visibly)` at 1280 and at 375.

- [ ] **Step 10: Commit**

```bash
cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-03a
git add animations/03-page-transitions/overlay-wipe/index.html
git commit -m "feat: Overlay Wipe shows the change's three steps with the panel see-through (See inside) and a page that switches at once beside the sweeping panel (Compare)"
```

- [ ] **Step 11: Review, fix rounds, merge into `sic/cat-03`**

The lane lead dispatches a fresh reviewer with: the brief, `git -C $REPO/.claude/worktrees/sic-03a diff feat/see-inside-compare...sic/03a`, the newest check round and output, the kit's before-and-after and clips, and the 12 acceptance lines. Beyond the check they confirm: the copy follows every change (a click on Work, Show me, Reset; under reduced motion too), is inert and has no ids or buttons; the pose never shows while a change or its way back is pending; the marker's frame loop runs only during a change in See inside and moves by time; a Show me run holds its pauses with `setTimeout`, not inside a frame loop; Show me's run on a mode press leaves the real site on its first page. Verdict; at most three fix rounds. When approved:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook
cd $REPO/.claude/worktrees/sic-03a && git switch -c sic/cat-03 feat/see-inside-compare && git merge --no-ff sic/03a -m "Merge slot 03a: Overlay Wipe's See inside and Compare"
node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"   # ℹ fail 0
```
Then, as a background command: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $REPO/.claude/worktrees/sic-03a && node $RUN/slot.mjs run cat-03 -- node tools/check-pages.mjs --base http://127.0.0.1:8806 --out $RUN/checks/cat-03 animations/03-page-transitions > $RUN/checks/cat-03.log 2>&1`. When it has ended (the log's last line is `Screenshots: …`): `grep -c '^ok' $RUN/checks/cat-03.log` prints `96` and `grep -c '^FAIL' $RUN/checks/cat-03.log` prints `0`. Only then `git switch sic/03a`, stop the server, ledger line, tell the coordinator `sic/cat-03` is ready.

---

### Task 10: 04.05 Magnetic Button: the pull's reach, rest and lean (See inside), "Stays put" with a ghost pointer beside "Leans toward you" (Compare)

**Files:**
- Modify: `animations/04-micro-interactions/magnetic-button/index.html`: new rules before `</style>` (line 34), the switch before the stage (after line 55), the stage (lines 56-58), the notes after the player bar (after line 62), and the `<script>` (lines 130-241: the button lookup, `pull`, `home`, the mouse handlers, and new functions, listeners and setting hooks).

**Interfaces:**
- Consumes: Task 2 (a press of See inside or Compare presses Show me), Task 3 (run waits; captions; the stage's controls' names), Task 4 (switch tests), Task 6 (`?v=10`).
- Produces: the category 04 reference and the reference for the hover pages (about a dozen): an inert first half (`div.mag.twin`), a ghost pointer that mirrors the real or pretend pointer over it, a pretend pointer parked at rest (`pose()`), arrows and rings drawn from the page's own numbers (`radius`, `strength`).

- [ ] **Step 1: The brief** (the 04 lane lead, during Phase 0)

Write `$RUN/briefs/04.05-magnetic-button.md`:

```markdown
# 04.05 Magnetic Button: brief (first batch)
Kind: do-it, hover (Show me moves a pretend pointer to three spots; Slow motion is the shared CSS one). Category reference for 04;
reference for the hover pages.
See inside: a dashed ring as big as Reach around the button's resting place ("Pulls inside this ring"); a dashed outline where the
button rests ("Rests here"); a short arrow over a dark edge (so the button's words stay readable under it) from the resting center
to where the button is pulled now ("Leans toward the pointer");
a faint line to the pointer; "Its label moves a little more". At rest a pretend pointer is parked half way to the ring's edge and the
button leans toward it, so the still picture shows the pull; the visitor's mouse, finger, arrow keys or Show me take over.
Compare: "Stays put" (an inert copy of the button that never moves, with a ghost of the pointer at the same place relative to it) /
"Leans toward you" (the real button). Side by side; stacked on phones (the button is too wide for two per row).
Reduced motion: the views snap to their pose (no glide); Show me is not pressed by a mode press.
Pitfalls: the script must find the real button as button.mag (the copy is a div.mag that comes first); the pose leans from the
resting place, not from where the button is mid-glide; the ring at Long reach is bigger than a phone's stage (it may be cut, the
label stays inside); the four labels must not overlap (the check says so); keyboard: arrows still pull, Escape parks the pose; a Show me
run holds its pauses with setTimeout, not inside a frame loop (the page check's run wait sees only setTimeout timers and animations).
Survey row: rollout-survey-04.md, 04.05.
```

- [ ] **Step 2: The slot** (after Task 6)

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; git -C $REPO worktree add -b sic/04a $REPO/.claude/worktrees/sic-04a feat/see-inside-compare`
Start, as a background command: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-04a && python -m http.server 8808 --bind 127.0.0.1`
Ledger: `$RUN/lanes/04.md`.

- [ ] **Step 3: Turn on the switch tests for this page (the failing test)**

In `animations/04-micro-interactions/magnetic-button/index.html`, between `</div>` of `div.hb-step-head` and `<div class="stage hb-dots">`, add:

```html
    <div class="seg hb-modes" role="group" aria-label="What the box shows" data-hb-modes>
      <button type="button" data-hb-mode="normal" class="on" aria-pressed="true">Normal</button>
      <button type="button" data-hb-mode="inside" aria-pressed="false">See inside</button>
      <button type="button" data-hb-mode="compare" aria-pressed="false">Compare</button>
    </div>
```

After `</div>` of `div.hb-player`, add:

```html
    <div class="hb-mode-notes" aria-live="polite">
      <p data-hb-for="inside" hidden>Inside, the ring shows how far the pull reaches: the button leans part of the way toward the pointer, and its label a little further. Point near it, or press Show me.</p>
      <p data-hb-for="compare" hidden>Stays put: the button ignores the pointer, shown as a ghost. Leans toward you: point near it, or press Show me, and it is pulled toward the pointer.</p>
    </div>
```

Run: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-04a && node --test --test-reporter=spec tests/pages.test.js 2>&1 | grep -E "^✖ |AssertionError"`
Expected: `✖ magnetic-button: the page's script listens for hb:mode, and its styles mark modes on the stage only` (named again under `✖ failing tests:`), with `AssertionError [ERR_ASSERTION]: the page script listens for hb:mode on document`.

- [ ] **Step 4: Styles**

Before `  </style>` add:

```css
    /* See inside and Compare. Drawn over the stage from the page's own numbers: the ring the pull reaches, the button's resting
       place, the lean (an arrow from where the button rests to where it is pulled, over a dark edge so the button's words stay
       readable under it), a faint line to the pointer, a pretend pointer, and in Compare a ghost of the pointer over the copy
       that stays put. */
    .twin,.views,.lbl{display:none}
    .views{position:absolute;inset:0;pointer-events:none}
    .views svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
    .ring,.rest,.lean-edge,.lean,.toward,.pointer,.ghost{display:none}
    .ring{fill:rgba(255,157,92,.06);stroke:rgba(255,157,92,.75);stroke-width:2;stroke-dasharray:6 6}
    .rest{fill:none;stroke:rgba(244,244,242,.6);stroke-width:2;stroke-dasharray:5 5}
    .lean-edge{fill:none;stroke:#0b0b0d;stroke-width:6;stroke-linecap:round;stroke-linejoin:round}
    .lean{fill:none;stroke:#f4f4f2;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
    .toward{stroke:rgba(244,244,242,.45);stroke-width:1.5;stroke-dasharray:3 5}
    .pointer path,.ghost path{fill:#f4f4f2;stroke:#0b0b0d;stroke-width:1.5;stroke-linejoin:round}
    .ghost{opacity:.7}
    .lbl{position:absolute;padding:3px 7px;border-radius:5px;background:rgba(11,11,13,.88);color:#f4f4f2;font:600 13px/1.2 var(--hb-font);white-space:nowrap}
    .stage[data-hb-mode="inside"] .views,.stage[data-hb-mode="compare"] .views{display:block}
    .stage[data-hb-mode="inside"] .ring,.stage[data-hb-mode="inside"] .rest,.stage[data-hb-mode="inside"] .lean-edge,
    .stage[data-hb-mode="inside"] .lean,.stage[data-hb-mode="inside"] .toward,.stage[data-hb-mode="compare"] .toward{display:inline}
    .stage[data-hb-mode="inside"].pretend .pointer,.stage[data-hb-mode="compare"].pretend .pointer,.stage[data-hb-mode="compare"] .ghost{display:inline}
    .stage[data-hb-mode="inside"] .in-l,.stage[data-hb-mode="compare"] .cmp-l{display:block}
    /* Compare: the button twice, side by side (one above the other on phones): on the left a copy that stays put, on the right
       the real one */
    .stage[data-hb-mode="compare"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));place-items:center}
    .stage[data-hb-mode="compare"] .twin{display:inline-block;grid-column:1;grid-row:1}
    .stage[data-hb-mode="compare"] .mag:not(.twin){grid-column:2;grid-row:1}
    .cmp-l{top:12px}
    .cmp-l.first{left:12px}
    .cmp-l.second{left:calc(50% + 12px)}
    @media(max-width:600px){
      .stage[data-hb-mode="compare"]{grid-template-columns:minmax(0,1fr);grid-template-rows:repeat(2,minmax(0,1fr))}
      .stage[data-hb-mode="compare"] .mag:not(.twin){grid-column:1;grid-row:2}
      .stage[data-hb-mode="compare"] .cmp-l.second{left:12px;top:calc(50% + 8px)}
    }
    /* Under reduced motion the views take their pose at once, with no glide */
    @media(prefers-reduced-motion:reduce){
      .stage[data-hb-mode="inside"] .mag,.stage[data-hb-mode="inside"] .mag .mag-label,
      .stage[data-hb-mode="compare"] .mag,.stage[data-hb-mode="compare"] .mag .mag-label{transition:none}
    }
```

- [ ] **Step 5: Markup**

Replace the stage (from `<div class="stage hb-dots">` to its closing `</div>`) with:

```html
    <div class="stage hb-dots">
      <div class="mag twin" aria-hidden="true" inert><span class="mag-label">Get Started</span></div>
      <button class="mag" type="button"><span class="mag-label">Get Started</span></button>
      <div class="views" aria-hidden="true">
        <svg>
          <circle class="ring" id="ring" r="0"/>
          <rect class="rest" id="rest"/>
          <line class="toward" id="toward"/>
          <path class="lean-edge" id="lean-edge"/>
          <path class="lean" id="lean"/>
          <g class="pointer" id="pointer"><path d="M0 0V19L5 14.5L8.5 22L11.5 20.7L8 13.3H14.5Z"/></g>
          <g class="ghost" id="ghost"><path d="M0 0V19L5 14.5L8.5 22L11.5 20.7L8 13.3H14.5Z"/></g>
        </svg>
        <span class="lbl in-l" id="l-reach" data-hb-caption>Pulls inside this ring</span>
        <span class="lbl in-l" id="l-rest" data-hb-caption>Rests here</span>
        <span class="lbl in-l" id="l-lean" data-hb-caption>Leans toward the pointer</span>
        <span class="lbl in-l" id="l-label" data-hb-caption>Its label moves a little more</span>
        <span class="lbl cmp-l first" data-hb-caption>Stays put</span>
        <span class="lbl cmp-l second" data-hb-caption>Leans toward you</span>
      </div>
    </div>
```

- [ ] **Step 6: Script**

(a) Replace `  const btn=stage.querySelector('.mag');` with:
```js
  const btn=stage.querySelector('button.mag');
```
and after `  const slowTog=document.getElementById('slow-tog');` add:
```js
  // See inside and Compare: the copy that stays put, the drawn parts and their labels; P is the point pulling now (null at home)
  const twin=stage.querySelector('.mag.twin');
  const $=id=>document.getElementById(id);
  const ring=$('ring'),rest=$('rest'),toward=$('toward'),lean=$('lean'),leanEdge=$('lean-edge'),pointer=$('pointer'),ghost=$('ghost');
  const L={reach:$('l-reach'),rest:$('l-rest'),lean:$('l-lean'),label:$('l-label')};
  let mode='normal',P=null,mouseIn=false;
```

(b) Replace the functions `pull` and `home` with:
```js
  // The pull takes a point on the stage (from its top left corner). The mouse, a finger and Show me all call it.
  // It measures from where the button is now, moved or not, and sends the button home when the point is out of reach.
  function pull(px,py){
    P={x:px,y:py};
    const s=stage.getBoundingClientRect(),b=btn.getBoundingClientRect();
    const dx=px-(b.left+b.width/2-s.left),dy=py-(b.top+b.height/2-s.top),dist=Math.hypot(dx,dy);
    if(dist<radius){
      const f=1-dist/radius; // full strength at the button's center, easing to none at the edge of Reach
      const tx=dx*strength*f,ty=dy*strength*f;
      btn.style.setProperty('--tx',tx+'px');btn.style.setProperty('--ty',ty+'px');
      label.style.transform=`translate(${tx*0.35}px,${ty*0.35}px)`;
      drawViews();
    }else home();
  }
  // Home: the button goes back to its place. In See inside and Compare, with nothing else pulling it, the pose takes over.
  function home(){
    btn.style.removeProperty('--tx');btn.style.removeProperty('--ty');label.style.transform='';
    P=null;
    if(mode!=='normal'&&idle())pose();else drawViews();
  }
  // The button's resting center in the pull's frame (the stage's border box): its layout box, which the pull never moves
  function restCenter(){return{x:stage.clientLeft+btn.offsetLeft+btn.offsetWidth/2,y:stage.clientTop+btn.offsetTop+btn.offsetHeight/2}}
  function idle(){return!mouseIn&&touchId===null&&!keyed&&!running()}
  // The pose: a pretend pointer parked half way to the edge of the ring, up and to the right, and the button leaning toward it as
  // the pull would lean it from its resting place
  function pose(){
    if(mode==='normal')return;
    const c=restCenter(),k=radius/2,px=c.x+k*.8,py=c.y-k*.6;
    const tx=(px-c.x)*strength*.5,ty=(py-c.y)*strength*.5;
    btn.style.setProperty('--tx',tx+'px');btn.style.setProperty('--ty',ty+'px');
    label.style.transform=`translate(${tx*0.35}px,${ty*0.35}px)`;
    P={x:px,y:py};
    drawViews();
  }
  // Draws the views for the pull on show (nothing in Normal). The drawing's frame is the stage's padding box.
  function drawViews(){
    if(mode==='normal')return;
    const c=restCenter(),ox=stage.clientLeft,oy=stage.clientTop,cx=c.x-ox,cy=c.y-oy;
    const tx=parseFloat(btn.style.getPropertyValue('--tx'))||0,ty=parseFloat(btn.style.getPropertyValue('--ty'))||0;
    ring.setAttribute('cx',cx);ring.setAttribute('cy',cy);ring.setAttribute('r',radius);
    rest.setAttribute('x',btn.offsetLeft);rest.setAttribute('y',btn.offsetTop);
    rest.setAttribute('width',btn.offsetWidth);rest.setAttribute('height',btn.offsetHeight);rest.setAttribute('rx',btn.offsetHeight/2);
    // The lean as an arrow, from where the button rests to where the pull has taken its center (none while it rests), with two
    // short head strokes, drawn over a dark edge so the button's words stay readable under it
    const len=Math.hypot(tx,ty),ang=Math.atan2(ty,tx),hx=cx+tx,hy=cy+ty,head=Math.min(9,len/2);
    const arrow=len<1?'':`M${cx} ${cy}L${hx} ${hy}M${hx-Math.cos(ang-.6)*head} ${hy-Math.sin(ang-.6)*head}L${hx} ${hy}L${hx-Math.cos(ang+.6)*head} ${hy-Math.sin(ang+.6)*head}`;
    lean.setAttribute('d',arrow);leanEdge.setAttribute('d',arrow);
    stage.classList.toggle('pretend',!!P&&!mouseIn);
    toward.style.display=ghost.style.display=P?'':'none';
    if(P){
      toward.setAttribute('x1',cx);toward.setAttribute('y1',cy);toward.setAttribute('x2',P.x-ox);toward.setAttribute('y2',P.y-oy);
      pointer.setAttribute('transform',`translate(${P.x-ox} ${P.y-oy})`);
      const t={x:twin.offsetLeft+twin.offsetWidth/2,y:twin.offsetTop+twin.offsetHeight/2};
      ghost.setAttribute('transform',`translate(${t.x+P.x-c.x} ${t.y+P.y-c.y})`);
    }
    if(mode==='inside')placeLabels(cx,cy);
  }
  // See inside's four labels, each beside the part it names and kept inside the stage
  function placeLabels(cx,cy){
    const W=stage.clientWidth,H=stage.clientHeight,ox=stage.clientLeft,oy=stage.clientTop;
    const put=(el,x,y)=>{el.style.left=Math.max(6,Math.min(W-el.offsetWidth-6,x))+'px';el.style.top=Math.max(6,Math.min(H-el.offsetHeight-6,y))+'px'};
    const p=P?{x:P.x-ox,y:P.y-oy}:{x:cx,y:cy};
    put(L.reach,cx-L.reach.offsetWidth/2,cy-radius-L.reach.offsetHeight-6);
    put(L.rest,cx-L.rest.offsetWidth/2,btn.offsetTop+btn.offsetHeight+12);
    put(L.label,cx-L.label.offsetWidth/2,btn.offsetTop+btn.offsetHeight+12+L.rest.offsetHeight+6);
    put(L.lean,p.x+20,p.y-L.lean.offsetHeight-6);
  }
```

(c) Replace the mouse block `if(hasHover){ … }` with:
```js
  if(hasHover){
    stage.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')mouseIn=true});
    stage.addEventListener('pointermove',e=>{
      if(e.pointerType!=='mouse')return;
      mouseIn=true;
      if(e.isTrusted&&running())stopRun();
      pointAt(e);
    });
    stage.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'){mouseIn=false;stopRun()}});
  }
```

(d) After the line `  document.addEventListener('hb:input',()=>{if(running())stopRun()});` add:
```js
  // The mode switch: draws the mode at once (in See inside and Compare the pose, in Normal the button at home). The shared script
  // then presses Show me (not under reduced motion), which plays it.
  document.addEventListener('hb:mode',e=>{
    mode=e.detail.mode;
    if(idle())home();else drawViews();
  });
  // A new size of the window moves the button's resting place, so the views are drawn again
  addEventListener('resize',()=>{if(mode!=='normal'){if(idle())pose();else drawViews()}});
```

(e) In `choices`, after `      pick(b.dataset);` add `      if(mode!=='normal'){if(idle())pose();else drawViews()}`.

- [ ] **Step 7: Tests**

Run: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-04a && node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ fail 0` (the keyboard test for the pointer pages still passes: the stage holds the real button and the script handles the arrow keys).

- [ ] **Step 8: Page check, screenshots, tuning**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $REPO/.claude/worktrees/sic-04a && node $RUN/slot.mjs run sic-04a -- node tools/check-pages.mjs --base http://127.0.0.1:8808 --out $RUN/checks/04-magnetic-button/1 animations/04-micro-interactions/magnetic-button`
Expected: six `ok` lines. Open `04-magnetic-button-desktop-inside.png`, `-phone-inside.png`, `-phone-reduced-inside.png`, `-desktop-compare.png`, `-phone-compare.png`, `-phone-reduced-compare.png`. Tune (label places in `placeLabels`, the pose's direction and distance, the ring's dash and alpha) until, at 1280 and at 375: the ring, the dashed resting outline, the leaning button and the pretend pointer read as one story; the four labels are apart (the check fails on an overlap) and none covers the button's words; in Compare the copy sits centered in its half with the ghost pointer at the same place relative to it as the pretend pointer to the real button, and the real button visibly leans. Motion: a kit clips run (`REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; node $RUN/slot.mjs run sic-04a -- node $KIT/record.mjs --base http://127.0.0.1:8808 --only clips --keep-frames --out $RUN/kit/04-magnetic-button-clips animations/04-micro-interactions/magnetic-button`): during Show me the pretend pointer jumps spot to spot and the lean arrow follows each pull; in Compare the ghost moves with it over the still copy. Keyboard and touch by hand in the clips' absence: read the code path (arrow keys call `pull`, Escape and blur call `home`, a finger's `pointerup` calls `home`) and confirm each ends in the pose. Acceptance 7: kit runs with `--only stills --press "#strength-seg [data-strength='0.5']"` and `--press "#reach-seg [data-reach='240']"`: the lean and the ring change in both views. Six `ok` after every change.

- [ ] **Step 9: Normal before and after**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; node $RUN/slot.mjs run sic-04a -- node $KIT/record.mjs --base http://127.0.0.1:8808 --before http://127.0.0.1:8800 --only before --out $RUN/kit/04-magnetic-button --clean animations/04-micro-interactions/magnetic-button`
Expected: `0 of … pixels differ (0 visibly)` at 1280 and at 375.

- [ ] **Step 10: Commit**

```bash
cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-04a
git add animations/04-micro-interactions/magnetic-button/index.html
git commit -m "feat: Magnetic Button shows how far its pull reaches and how far it leans (See inside) and a button that stays put beside the one that leans toward you (Compare)"
```

- [ ] **Step 11: Review, fix rounds, merge into `sic/cat-04`**

The lane lead dispatches a fresh reviewer with: the brief, `git -C $REPO/.claude/worktrees/sic-04a diff feat/see-inside-compare...sic/04a`, the newest check round and output, the kit's before-and-after and clips, and the 12 acceptance lines. Beyond the check they confirm: hover, a finger, the arrow keys and Show me all work in both modes as in Normal; the copy is inert, has no button and never moves; the pose leans from the resting place; a Show me run holds its pauses with `setTimeout`, not inside a frame loop; under reduced motion the views snap. Verdict; at most three fix rounds. When approved:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook
cd $REPO/.claude/worktrees/sic-04a && git switch -c sic/cat-04 feat/see-inside-compare && git merge --no-ff sic/04a -m "Merge slot 04a: Magnetic Button's See inside and Compare"
node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"   # ℹ fail 0
```
Then, as a background command: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $REPO/.claude/worktrees/sic-04a && node $RUN/slot.mjs run cat-04 -- node tools/check-pages.mjs --base http://127.0.0.1:8808 --out $RUN/checks/cat-04 animations/04-micro-interactions > $RUN/checks/cat-04.log 2>&1`. When it has ended (the log's last line is `Screenshots: …`): `grep -c '^ok' $RUN/checks/cat-04.log` prints `246` and `grep -c '^FAIL' $RUN/checks/cat-04.log` prints `0`. Only then `git switch sic/04a`, stop the server, ledger line, tell the coordinator `sic/cat-04` is ready.

---
### Task 11: 05.06 Marquee / Ticker: the strip zoomed out (See inside), "One copy" above "Two copies" (Compare, a common mistake)

**Files:**
- Modify: `animations/05-text-typography/marquee-ticker/index.html`: the `<style>` block (the `.stage` rule, line 26; new rules before `</style>`, line 39), the switch before the stage (after line 60), the stage (line 61), the notes after the player bar (after line 65), the `<script>` (lines 162-244: the containers, `buildRow`, `rebuild`, the Speed choice, and new functions and a listener).

**Interfaces:**
- Consumes: Task 3 (paused loops at the deep setups; captions), Task 4 (switch tests), Task 6 (`?v=10`). The shared CSS pause and Slow motion (`data-hb-pause="css"`, `data-hb-slowmo="css"`) reach every animation in the stage, the views' ones included.
- Produces: the category 05 reference, the reference for the pages whose Your text must feed the copy (19) and for a Compare that shows a common mistake (ruling 3): the rows move into `div.rows` (classes `r1`, `r2`, `r3`), `buildViews()` builds See inside's zoomed strip and Compare's one-copy row from the first row's own numbers on every rebuild.

- [ ] **Step 1: The brief** (the 05 lane lead, during Phase 0)

Write `$RUN/briefs/05.06-marquee-ticker.md`:

```markdown
# 05.06 Marquee / Ticker: brief (first batch)
Kind: loop (Pause and Slow motion are the shared CSS ones; pointing at a row, or tapping it, pauses that row). Category reference for
05; reference for Your text (19 pages) and for a Compare with a common mistake (ruling 3).
See inside: the first row stays at the top, still moving; below it the same strip zoomed out: the track's two identical copies end
to end, outlined ("Copy 1", "Copy 2, the same"), and the box as a window sliding over them in time with the row ("In the box"); a
line where it jumps back ("Jumps back here") and an arrow as long as the slide. The window pauses when the row does.
Compare (ruling 3): on top "One copy" (the mistake: one copy of the text slides out by its own width, leaves a gap and jumps back);
below "Two copies" (the first row itself). Pause and Slow motion reach both.
Reduced motion (starts paused): See inside still, the arrow shows the slide; Compare holds the one copy 70% of the way out, the gap
plain.
Every setting and Your text rebuild the rows and the views.
Pitfalls: never display:none a moving row (its animation would restart, and Normal would not come back): the other two rows are
taken out of the flow and hidden, not removed; measure from the first row, never from a hidden view; the one-copy row is inert; a
label that rides a moving part must stay inside the stage at both ends of its travel, at 320.
Phones: the halves stack (a strip needs the width); the zoomed text is only texture, the labels carry the words.
Survey row: rollout-survey-05-07.md, 05.06.
```

- [ ] **Step 2: The slot** (after Task 6)

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; git -C $REPO worktree add -b sic/05a $REPO/.claude/worktrees/sic-05a feat/see-inside-compare`
Start, as a background command: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-05a && python -m http.server 8812 --bind 127.0.0.1`
Ledger: `$RUN/lanes/05.md`.

- [ ] **Step 3: Turn on the switch tests for this page (the failing test)**

In `animations/05-text-typography/marquee-ticker/index.html`, between `</div>` of `div.hb-step-head` and `<div class="stage hb-dots" id="stage"></div>`, add:

```html
    <div class="seg hb-modes" role="group" aria-label="What the box shows" data-hb-modes>
      <button type="button" data-hb-mode="normal" class="on" aria-pressed="true">Normal</button>
      <button type="button" data-hb-mode="inside" aria-pressed="false">See inside</button>
      <button type="button" data-hb-mode="compare" aria-pressed="false">Compare</button>
    </div>
```

After `</div>` of `div.hb-player`, add:

```html
    <div class="hb-mode-notes" aria-live="polite">
      <p data-hb-for="inside" hidden>Inside, the strip is two identical copies end to end and the box is a window sliding over them; it jumps back at the second copy, which looks the same, so the jump never shows.</p>
      <p data-hb-for="compare" hidden>On top, One copy: the text slides out, leaves a gap and jumps back. Below, Two copies: a second copy fills the gap, so the loop has no seam.</p>
    </div>
```

Run: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-05a && node --test --test-reporter=spec tests/pages.test.js 2>&1 | grep -E "^✖ |AssertionError"`
Expected: `✖ marquee-ticker: the page's script listens for hb:mode, and its styles mark modes on the stage only` (named again under `✖ failing tests:`), with `AssertionError [ERR_ASSERTION]: the page script listens for hb:mode on document`.

- [ ] **Step 4: Styles**

Replace `    .stage{display:flex;flex-direction:column;justify-content:center;background:#08080a}` with:
```css
    .stage{position:relative;display:flex;flex-direction:column;justify-content:center;background:#08080a}
```

Before `  </style>` add:

```css
    /* The rows sit in a box of their own, laid out as the stage lays them out */
    .rows{display:flex;flex-direction:column}
    .zoom,.solo,.lbl{display:none}
    .lbl{position:absolute;padding:3px 7px;border-radius:5px;background:rgba(8,8,10,.9);color:#f4f4f2;font:600 13px/1.2 var(--hb-font);white-space:nowrap}
    /* In See inside and Compare the second and third rows stay where they were, unseen and out of the flow but never removed, so
       their movement goes on for Normal */
    .stage[data-hb-mode="inside"],.stage[data-hb-mode="compare"]{justify-content:flex-start}
    .stage[data-hb-mode="inside"] .rows .marq-row:not(.r1),.stage[data-hb-mode="compare"] .rows .marq-row:not(.r1){position:absolute;left:0;right:0;visibility:hidden}
    /* See inside: the first row at the top, still moving; below it the same strip zoomed out: its two identical copies end to end,
       and the box as a window sliding over them. When the window reaches the second copy it jumps back to the first, which looks
       the same, so the jump never shows. */
    .stage[data-hb-mode="inside"] .zoom{display:block}
    .stage[data-hb-mode="inside"] .zoom .lbl{display:block}
    .zoom{position:relative;flex:1;margin:10px clamp(10px,2vw,20px)}
    .ztrack{position:absolute;left:0;display:flex;width:max-content;white-space:nowrap;transform-origin:0 0}
    .zcopy{position:absolute;border:2px solid rgba(244,244,242,.6);border-radius:6px}
    .zwin{position:absolute;left:0;border:3px solid var(--ui-accent);border-radius:6px;animation:zwin linear infinite}
    @keyframes zwin{from{transform:translateX(0)}to{transform:translateX(var(--zgo,0px))}}
    .zwin .lbl{left:0;top:calc(100% + 6px)}
    .zjump{position:absolute;width:2px;background:#f4f4f2}
    .zarrow{position:absolute;left:0;height:3px;border-radius:2px;background:var(--ui-accent)}
    @media(hover:hover){.stage[data-hb-mode="inside"]:has(.r1:hover) .zwin{animation-play-state:paused}}
    .stage[data-hb-mode="inside"]:has(.r1.paused) .zwin{animation-play-state:paused}
    /* Compare: on top the common mistake, a single copy of the text that slides out, leaves a gap and jumps back; below it the
       first row with its two copies, which loops with no seam */
    .stage[data-hb-mode="compare"]{display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:repeat(2,minmax(0,1fr))}
    .stage[data-hb-mode="compare"] .solo{display:flex;flex-direction:column;justify-content:center;grid-row:1}
    .stage[data-hb-mode="compare"] .rows{grid-row:2;justify-content:center}
    .stage[data-hb-mode="compare"] .side{display:block}
    .side{left:12px}
    .side.first{top:10px}
    .side.second{top:calc(50% + 6px)}
    .solo-track{display:flex;width:max-content;white-space:nowrap;animation:soloL linear infinite}
    @keyframes soloL{from{transform:translateX(0)}to{transform:translateX(-100%)}}
```

- [ ] **Step 5: Markup**

Replace `    <div class="stage hb-dots" id="stage"></div>` with:

```html
    <div class="stage hb-dots" id="stage">
      <div class="rows" id="rows"></div>
      <div class="zoom" id="zoom" aria-hidden="true" inert></div>
      <div class="solo" id="solo" aria-hidden="true" inert></div>
      <p class="lbl side first" aria-hidden="true" data-hb-caption>One copy</p>
      <p class="lbl side second" aria-hidden="true" data-hb-caption>Two copies</p>
    </div>
```

- [ ] **Step 6: Script**

(a) After `  const stage=document.getElementById('stage');` add:
```js
  const rows=document.getElementById('rows'),zoom=document.getElementById('zoom'),solo=document.getElementById('solo');
  const reduceMQ=matchMedia('(prefers-reduced-motion: reduce)');
  // Under reduced motion the loop starts paused, so both views are still pictures, and their notes say so
  if(reduceMQ.matches){
    document.querySelector('[data-hb-for="inside"]').textContent='Inside, shown still: the strip is two identical copies end to end, and the arrow shows how far the box slides before it jumps back to the start.';
    document.querySelector('[data-hb-for="compare"]').textContent='Shown still: on top, One copy, the text has slid most of the way out and left a gap; below, Two copies, the second copy fills it.';
  }
```

(b) In `buildRow`, replace `    stage.appendChild(row);` with `    rows.appendChild(row);`.

(c) In `rebuild`, replace `    stage.innerHTML='';` with `    rows.innerHTML='';`, replace the three `buildRow(…)` lines with:
```js
    buildRow(text,separator,false,'r1');
    buildRow(text,separator,true,'accent r2');
    buildRow(text+' '+separator+' '+text,separator,false,'r3');
```
and after `    document.querySelectorAll('.marq-track').forEach(t=>updateSpeed(t,frac));` add `    buildViews();`.

(d) Replace `  choices('speed-seg',d=>{spd=+d.spd;refreshSpeeds()});` with `  choices('speed-seg',d=>{spd=+d.spd;refreshSpeeds();buildViews()});`.

(e) Before `  txtIn.addEventListener('input',rebuild);` add:
```js
  // See inside and Compare are drawn from the first row as it stands (its text, its copies, its width and its speed) and built
  // again with the rows, so every setting and Your text reach them. Sizes come from the first row, which is always shown.
  function buildViews(){
    const row=rows.querySelector('.r1'),track=row&&row.querySelector('.marq-track');
    if(!track)return;
    const copyW=track.scrollWidth/2,rowW=stage.clientWidth,rowH=row.offsetHeight,itemW=track.firstElementChild.offsetWidth;
    const zoomW=Math.max(1,stage.clientWidth-2*Math.min(20,Math.max(10,stage.clientWidth*.02)));
    const k=Math.min(1,zoomW/track.scrollWidth),h=rowH*k,cw=copyW*k;
    zoom.innerHTML='';
    const add=(cls,css,words)=>{
      const el=document.createElement(words===undefined?'div':'span');el.className=cls;
      for(const [p,v] of Object.entries(css))el.style.setProperty(p,v);
      if(words!==undefined){el.textContent=words;el.setAttribute('data-hb-caption','')}
      zoom.appendChild(el);return el;
    };
    // the whole strip, drawn small enough to fit, with its two copies outlined
    const strip=track.cloneNode(true);
    strip.className='ztrack';strip.removeAttribute('aria-live');strip.style.top='26px';strip.style.transform=`scale(${k})`;
    zoom.appendChild(strip);
    add('zcopy',{left:'0px',top:'22px',width:cw+'px',height:h+8+'px'});
    add('zcopy',{left:cw+'px',top:'22px',width:cw+'px',height:h+8+'px'});
    add('lbl',{left:'2px',top:'0px'},'Copy 1');
    add('lbl',{left:cw+2+'px',top:'0px'},'Copy 2, the same');
    // the box as a window over the strip: it slides one copy's width, as long as the row takes, then starts over
    const win=add('zwin',{top:'18px',width:rowW*k+'px',height:h+16+'px','--zgo':cw+'px','animation-duration':track.durMs+'ms'});
    const shows=document.createElement('span');shows.className='lbl';shows.textContent='In the box';shows.setAttribute('data-hb-caption','');
    win.appendChild(shows);
    add('zjump',{left:cw-1+'px',top:'14px',height:h+64+'px'});
    add('zarrow',{top:h+74+'px',width:cw+'px'});
    add('lbl',{left:Math.max(0,cw-150)+'px',top:h+84+'px'},'Jumps back here');
    // Compare's mistake: the same text, but one copy of it, sliding by its own width before it starts over
    solo.innerHTML='';
    const srow=document.createElement('div');srow.className='marq-row solo-row';
    const st=document.createElement('div');st.className='solo-track';
    st.appendChild(makeItem(getContent(),separator,false));
    srow.appendChild(st);solo.appendChild(srow);
    st.style.animationDuration=Math.round(itemW/spd*1000)+'ms';
    syncWindow();
    poseSolo();
  }
  // The window keeps time with the first row: both cover one copy's width in the same time
  function syncWindow(){
    const t=rows.querySelector('.r1 .marq-track'),w=zoom.querySelector('.zwin');
    const a=t&&t.getAnimations()[0],b=w&&w.getAnimations()[0];
    if(a&&b&&a.currentTime!=null)b.currentTime=a.currentTime%t.durMs;
  }
  // Under reduced motion Compare's mistake is held at its telling moment: the one copy most of the way out, the gap plain
  function poseSolo(){
    if(!reduceMQ.matches)return;
    const t=solo.querySelector('.solo-track'),a=t&&t.getAnimations()[0];
    if(a&&a.effect)a.currentTime=.7*a.effect.getComputedTiming().duration;
  }
  // The mode switch: draws the mode at once. A view's animation starts when the view is shown, so the window is set to the first
  // row's place then, and under reduced motion the mistake is posed. Pause and Slow motion reach every animation in the stage.
  document.addEventListener('hb:mode',e=>{
    syncWindow();
    if(e.detail.mode==='compare')poseSolo();
  });

```

- [ ] **Step 7: Tests**

Run: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-05a && node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ fail 0`.

- [ ] **Step 8: Page check, screenshots, tuning**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $REPO/.claude/worktrees/sic-05a && node $RUN/slot.mjs run sic-05a -- node tools/check-pages.mjs --base http://127.0.0.1:8812 --out $RUN/checks/05-marquee-ticker/1 animations/05-text-typography/marquee-ticker`
Expected: six `ok` lines ("Normal brings the first picture back" holds only if no moving row was restarted: if it fails, a row was hidden with display:none somewhere). Open `05-marquee-ticker-desktop-inside.png`, `-phone-inside.png`, `-phone-reduced-inside.png`, `-desktop-compare.png`, `-phone-compare.png`, `-phone-reduced-compare.png`. Tune (the zoom's vertical places, the label places, the window's border) until, at 1280 and at 375: two outlined copies, the window over the first, the jump line at the second copy's start and the arrow under them read at a glance; the four labels are apart and inside the stage; in Compare the one-copy row shows a plain gap (at rest under reduced motion it is 70% out), and both half names sit clear of the text. Motion: a kit clips run (`REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; node $RUN/slot.mjs run sic-05a -- node $KIT/record.mjs --base http://127.0.0.1:8812 --only clips --keep-frames --out $RUN/kit/05-marquee-ticker-clips animations/05-text-typography/marquee-ticker`): in See inside's frames the window slides right while the top row slides left, and both start over together; in Compare's frames the top row empties and jumps while the bottom row never shows a gap. Acceptance 7: kit runs with `--only stills --press "#size-seg [data-size='64']"`, `--press "#gap-seg [data-gap='80']"`, `--press "#sep-seg [data-sep='★']"` and `--press "#speed-seg [data-spd='130']"` (the last one changes the motion only: check it in a clips run with the same `--press`). Your text: by hand in a clips run is not possible, so read the code path (`txtIn` input → `rebuild()` → `buildViews()`), and the reviewer confirms. Six `ok` after every change.

- [ ] **Step 9: Normal before and after**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; node $RUN/slot.mjs run sic-05a -- node $KIT/record.mjs --base http://127.0.0.1:8812 --before http://127.0.0.1:8800 --only before --out $RUN/kit/05-marquee-ticker --clean animations/05-text-typography/marquee-ticker`
Expected (the loop is pictured with reduce motion on, standing at its start): `0 of … pixels differ` at 1280 and 375, or a few visibly where a row stood a fraction of a pixel apart; open the three pictures and compare by eye.

- [ ] **Step 10: Commit**

```bash
cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-05a
git add animations/05-text-typography/marquee-ticker/index.html
git commit -m "feat: Marquee / Ticker shows its strip zoomed out as two copies under a sliding window (See inside) and the one-copy mistake above the two-copy loop (Compare)"
```

- [ ] **Step 11: Review, fix rounds, merge into `sic/cat-05`**

The lane lead dispatches a fresh reviewer with: the brief, `git -C $REPO/.claude/worktrees/sic-05a diff feat/see-inside-compare...sic/05a`, the newest check round and output, the kit's before-and-after and clips, and the 12 acceptance lines. Beyond the check they confirm: no moving row is ever display:none; Pause holds every row, the window and the one copy at once, Slow motion slows all of them; pointing at the first row pauses the window too; Your text and every setting rebuild both views; in Compare change Text size and type in Your text, then press See inside: the window covers only the box's share of the strip. Verdict; at most three fix rounds. When approved:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook
cd $REPO/.claude/worktrees/sic-05a && git switch -c sic/cat-05 feat/see-inside-compare && git merge --no-ff sic/05a -m "Merge slot 05a: Marquee / Ticker's See inside and Compare"
node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"   # ℹ fail 0
```
Then, as a background command: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $REPO/.claude/worktrees/sic-05a && node $RUN/slot.mjs run cat-05 -- node tools/check-pages.mjs --base http://127.0.0.1:8812 --out $RUN/checks/cat-05 animations/05-text-typography > $RUN/checks/cat-05.log 2>&1`. When it has ended (the log's last line is `Screenshots: …`): `grep -c '^ok' $RUN/checks/cat-05.log` prints `114` and `grep -c '^FAIL' $RUN/checks/cat-05.log` prints `0`. Only then `git switch sic/05a`, stop the server, ledger line, tell the coordinator `sic/cat-05` is ready.

---

### Task 12: 06.05 Fluid / Liquid Simulation: the plain circles and the melt zones (See inside), "Hard circles" beside "Melting" (Compare, one WebGL context)

**Files:**
- Modify: `animations/06-3d-advanced/fluid-simulation/index.html`: new rules before `</style>` (line 29), the switch before the stage (after line 50), the stage's labels (after line 53), the notes after the player bar (after line 58), and the `<script>` (lines 169-331: the shader `FS`, the uniform list, `render` and a new `view`, `fail`, `aim`, and a new listener).

**Interfaces:**
- Consumes: Task 3 (paused loops at the deep setups; captions; the picture's name changes with the mode), Task 4 (switch tests), Task 6 (`?v=10`).
- Produces: the category 06 reference and the WebGL reference (8 pages): one context drawn in two viewports for Compare (`view(x, w, kind, mouseBall)`, uniforms `uOrigin` and `uView`), See inside as a shader pass, labels as page text over the canvas, the canvas's name per mode.

- [ ] **Step 1: The brief** (the 06 lane lead, during Phase 0)

Write `$RUN/briefs/06.05-fluid-simulation.md`:

```markdown
# 06.05 Fluid / Liquid Simulation: brief (first batch)
Kind: loop, WebGL (the page pauses and slows itself; one blob follows the pointer or a finger). Category reference for 06; reference
for the 8 WebGL pages.
See inside: the liquid dimmed; each blob's own plain circle outlined in white; where the melting adds liquid outside every plain
circle (the soft necks), shaded gold. A key in the corner: "White rings: each blob's own circle", "Gold: where two melt together".
Melting changes the gold zones; every other setting changes the blobs as in Normal.
Compare: one canvas, two viewports of the same context, a thin line between: "Hard circles" (the plain minimum: circles that only
overlap, sharp corners) / "Melting" (the page as set). Both use the same clock and the same pointer, so the blobs match; the
pointer is read over the second half only (a pointer over the first half moves nothing).
Reduced motion: the loop starts paused; a mode change draws one frame at once; the paused frame already shows overlaps.
The canvas's aria-label says what each mode shows. The no-WebGL message covers every mode (labels hidden then).
Pitfalls: never a second WebGL context; the phone pixel cap stays; uv must be measured from each viewport's own origin; GLSL
smoothstep with edge0 >= edge1 is undefined, so new code writes 1.-smoothstep(a,b,x).
Survey row: rollout-survey-05-07.md, 06.05.
```

- [ ] **Step 2: The slot** (after Task 6)

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; git -C $REPO worktree add -b sic/06a $REPO/.claude/worktrees/sic-06a feat/see-inside-compare`
Start, as a background command: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-06a && python -m http.server 8814 --bind 127.0.0.1`
Ledger: `$RUN/lanes/06.md`.

- [ ] **Step 3: Turn on the switch tests for this page (the failing test)**

In `animations/06-3d-advanced/fluid-simulation/index.html`, between `</div>` of `div.hb-step-head` and `<div class="stage" id="stage">`, add:

```html
    <div class="seg hb-modes" role="group" aria-label="What the box shows" data-hb-modes>
      <button type="button" data-hb-mode="normal" class="on" aria-pressed="true">Normal</button>
      <button type="button" data-hb-mode="inside" aria-pressed="false">See inside</button>
      <button type="button" data-hb-mode="compare" aria-pressed="false">Compare</button>
    </div>
```

After `</div>` of `div.hb-player`, add:

```html
    <div class="hb-mode-notes" aria-live="polite">
      <p data-hb-for="inside" hidden>Inside, each blob is a plain circle, outlined in white; where two come close, the melting adds liquid between them, shaded gold.</p>
      <p data-hb-for="compare" hidden>On the left, Hard circles: the blobs only overlap, with sharp corners where they meet. On the right, Melting: they flow into one shape with soft necks between them.</p>
    </div>
```

Run: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-06a && node --test --test-reporter=spec tests/pages.test.js 2>&1 | grep -E "^✖ |AssertionError"`
Expected: `✖ fluid-simulation: the page's script listens for hb:mode, and its styles mark modes on the stage only` (named again under `✖ failing tests:`), with `AssertionError [ERR_ASSERTION]: the page script listens for hb:mode on document`.

- [ ] **Step 4: Styles**

Before `  </style>` add:

```css
    /* See inside and Compare: plain words over the picture (the picture itself is drawn by the shader) */
    .key,.side{display:none}
    .lbl{position:absolute;padding:3px 8px;border-radius:5px;background:rgba(3,8,16,.9);color:#f4f4f2;font:600 13px/1.2 var(--hb-font);white-space:nowrap}
    .key{position:absolute;left:10px;bottom:10px;flex-direction:column;align-items:flex-start;gap:6px}
    .key .lbl{position:static}
    .stage[data-hb-mode="inside"] .key{display:flex}
    .stage[data-hb-mode="compare"] .side{display:block}
    .side{top:10px}
    .side.first{left:10px}
    .side.second{left:calc(50% + 10px)}
    .stage.no-gl .key,.stage.no-gl .side{display:none!important}
```

- [ ] **Step 5: Markup**

After `      <div class="no-webgl" id="no-webgl">WebGL not available in this browser.</div>` add:

```html
      <div class="key" aria-hidden="true"><span class="lbl k" data-hb-caption>White rings: each blob's own circle</span><span class="lbl k" data-hb-caption>Gold: where two melt together</span></div>
      <p class="lbl side first" aria-hidden="true" data-hb-caption>Hard circles</p>
      <p class="lbl side second" aria-hidden="true" data-hb-caption>Melting</p>
```

- [ ] **Step 6: Script**

(a) After `let COLOR=[88/255,166/255,255/255];` add:
```js
// See inside and Compare: the mode on show, and what the canvas says it shows in each one
let mode='normal';
const LABELS={normal:cvs.getAttribute('aria-label'),
  inside:'The blobs dimmed, each one\'s own circle outlined in white and the places where two melt together shaded gold',
  compare:'Two copies of the blobs side by side: hard circles that only overlap on the left, blobs that melt together on the right'};
```

(b) Replace the whole `FS` string with:
```js
const FS=`
precision mediump float;
uniform vec2 uRes,uOrigin;uniform float uT;uniform int uBalls,uView;
uniform float uSmooth,uRad;uniform vec2 uMouse;uniform bool uGlow,uMouseBall;
uniform vec3 uColor,uBG;

float smin(float a,float b,float k){
  float h=clamp(.5+.5*(b-a)/k,0.,1.);
  return mix(b,a,h)-k*h*(1.-h);
}

vec2 ball(int i,float t){
  float fi=float(i);
  float s=1.3+fi*.4,o=fi*2.1;
  return vec2(.5+.38*sin(t*s+o),.5+.38*cos(t*s*.7+o*1.3));
}

void main(){
  // uOrigin is where this picture starts on the canvas: Compare draws two pictures side by side
  vec2 uv=(gl_FragCoord.xy-uOrigin)/uRes;
  uv.y=1.-uv.y;
  float d=10.,hard=10.,edge=10.;
  for(int i=0;i<8;i++){
    if(i>=uBalls)break;
    vec2 c=(i==0&&uMouseBall)?uMouse:ball(i,uT);
    float bd=length((uv-c)*vec2(uRes.x/uRes.y,1.))-uRad;
    d=smin(d,bd,uSmooth);
    hard=min(hard,bd);
    edge=min(edge,abs(bd));
  }
  // Compare's first picture: the plain circles, with no melting between them
  if(uView==2)d=hard;
  float inside=smoothstep(.01,-.01,d);
  vec3 rim=uColor*pow(clamp(1.-abs(d)/.05,0.,1.),3.);
  float glow=uGlow?exp(-max(d,0.)/.08)*.4:0.;
  vec3 col=mix(uBG,uColor,inside)+rim*.5+uColor*glow;
  // See inside: the liquid dimmed; where the melting adds liquid outside every plain circle, gold; each plain circle outlined
  if(uView==1){
    col*=.45;
    float melt=(1.-smoothstep(-.004,.004,d))*smoothstep(0.,.004,hard);
    col=mix(col,vec3(1.,.82,.36),melt*.8);
    col=mix(col,vec3(1.),1.-smoothstep(.002,.007,edge));
  }
  gl_FragColor=vec4(col,1.);
}`;
```

(c) In `fail(msg)` add `stage.classList.add('no-gl');` as its first statement.

(d) Replace the uniform list `'uRes uT uBalls uSmooth uRad uMouse uGlow uMouseBall uColor uBG'` with `'uRes uOrigin uT uBalls uView uSmooth uRad uMouse uGlow uMouseBall uColor uBG'`.

(e) In `render(ts)`, replace everything from `  gl.useProgram(prog);` to the end of the function with:
```js
  gl.useProgram(prog);
  gl.uniform1f(U.uT,simT);
  gl.uniform1i(U.uBalls,BALLS);
  gl.uniform1f(U.uSmooth,SMOOTH);
  gl.uniform1f(U.uRad,RAD);
  gl.uniform2f(U.uMouse,shownX,shownY);
  gl.uniform1i(U.uGlow,GLOW?1:0);
  gl.uniform3fv(U.uColor,COLOR);
  gl.uniform3fv(U.uBG,BG);
  // Compare: one context, two pictures side by side with a thin line between them, the plain circles on the left and the melting
  // blobs on the right; the pointer, read over the right half only, moves the same blob in both, so the blobs match.
  if(mode==='compare'){
    const half=Math.floor(W/2),gap=Math.max(1,Math.round(W/400));
    gl.viewport(0,0,W,H);gl.clearColor(.17,.17,.2,1);gl.clear(gl.COLOR_BUFFER_BIT);
    view(0,half-gap,2,MOUSE_BALL);
    view(half+gap,W-half-gap,0,MOUSE_BALL);
  }else view(0,W,mode==='inside'?1:0,MOUSE_BALL);
}
// One picture of the blobs in a part of the canvas, x and w in canvas pixels: kind 0 as it is, 1 See inside, 2 hard circles
function view(x,w,kind,mouseBall){
  gl.viewport(x,0,w,H);
  gl.uniform2f(U.uOrigin,x,0);
  gl.uniform2f(U.uRes,w,H);
  gl.uniform1i(U.uView,kind);
  gl.uniform1i(U.uMouseBall,mouseBall?1:0);
  gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
}
```

(f) Replace `function aim(e){const r=cvs.getBoundingClientRect();mouseX=(e.clientX-r.left)/r.width;mouseY=(e.clientY-r.top)/r.height;}` with:
```js
function aim(e){
  const r=cvs.getBoundingClientRect();
  // In Compare the pointer is read over the second picture only (a pointer over the first half moves nothing), and its blob
  // moves in both pictures, so they match
  if(mode==='compare'){const x=e.clientX-r.left-r.width/2;if(x<0)return;mouseX=x/(r.width/2);}
  else mouseX=(e.clientX-r.left)/r.width;
  mouseY=(e.clientY-r.top)/r.height;
}
```

(g) After the `hb:pause` listener (it ends `});` after `else start();`) add:
```js
// The mode switch: the next frame draws the mode, and while paused one frame is drawn at once. The canvas's name says what it shows.
document.addEventListener('hb:mode',e=>{
  mode=e.detail.mode;
  cvs.setAttribute('aria-label',LABELS[mode]);
  redraw();
});
```

- [ ] **Step 7: Tests**

Run: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-06a && node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ fail 0`.

- [ ] **Step 8: Page check, screenshots, tuning**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $REPO/.claude/worktrees/sic-06a && node $RUN/slot.mjs run sic-06a -- node tools/check-pages.mjs --base http://127.0.0.1:8814 --out $RUN/checks/06-fluid-simulation/1 animations/06-3d-advanced/fluid-simulation`
Expected: six `ok` lines (the canvas's name differs in each mode; no console warning from the shader). If the shader fails to compile, the page shows its message and the console holds the log: fix the shader. Open `06-fluid-simulation-desktop-inside.png`, `-phone-inside.png`, `-phone-reduced-inside.png`, `-desktop-compare.png`, `-phone-compare.png`, `-phone-reduced-compare.png`. Tune (the dimming `.45`, the gold, the outline width `.002`/`.007`, the melt band `.004`) until, at 1280 and at 375: every blob's white ring reads, the gold necks show between blobs that are close and nowhere else, the key reads; in Compare both pictures show the same blobs at the same places, the left with sharp corners where circles overlap, the right melted, and the line between them is thin. If the paused frame under reduced motion shows no two blobs close enough to differ, say so: the still is then posed at a telling time of the views' own (under reduced motion See inside and Compare hand that time to `uT` in place of `simT`), never by changing `simT`, from which Normal's reduced-motion frame is drawn (Step 9 compares it pixel for pixel); a builder's call written in the report. Motion: a kit clips run (`REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; node $RUN/slot.mjs run sic-06a -- node $KIT/record.mjs --base http://127.0.0.1:8814 --only clips --keep-frames --out $RUN/kit/06-fluid-simulation-clips animations/06-3d-advanced/fluid-simulation`); Read three frames from the middle of each mode clip's kept frame folder (the log names it): both halves move together, their blobs at the same places. Acceptance 7: kit runs with `--only stills --press "#melt-seg [data-smooth='0.15']"`, `--press "#count-seg [data-balls='8']"`, `--press "#size-seg [data-rad='0.2']"` and `--press "#glow-tog"`: each changes both views (Melting the gold zones and the right half only). Six `ok` after every change.

- [ ] **Step 9: Normal before and after**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; node $RUN/slot.mjs run sic-06a -- node $KIT/record.mjs --base http://127.0.0.1:8814 --before http://127.0.0.1:8800 --only before --out $RUN/kit/06-fluid-simulation --clean animations/06-3d-advanced/fluid-simulation`
Expected (the loop is pictured with reduce motion on, paused at its first frame): `0 of … pixels differ (0 visibly)` at 1280 and 375.

- [ ] **Step 10: Commit**

```bash
cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-06a
git add animations/06-3d-advanced/fluid-simulation/index.html
git commit -m "feat: Fluid / Liquid Simulation outlines each blob's plain circle and shades where two melt (See inside), and shows hard circles beside melting blobs from one WebGL context (Compare)"
```

- [ ] **Step 11: Review, fix rounds, merge into `sic/cat-06`**

The lane lead dispatches a fresh reviewer with: the brief, `git -C $REPO/.claude/worktrees/sic-06a diff feat/see-inside-compare...sic/06a`, the newest check round and output, the kit's before-and-after and clips, and the 12 acceptance lines. Beyond the check they confirm: one `getContext('webgl')` call (no second context); the phone pixel cap untouched; the context-lost path re-reads the new uniforms (`init()` builds `U` from the list); `uOrigin` makes both halves draw the same blobs; Normal's shader output is unchanged (uView 0, uOrigin 0); in Compare the pointer, read over the second half only, moves the same blob in both halves; a reduced-motion pose, if any, never changes `simT`. Verdict; at most three fix rounds. When approved:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook
cd $REPO/.claude/worktrees/sic-06a && git switch -c sic/cat-06 feat/see-inside-compare && git merge --no-ff sic/06a -m "Merge slot 06a: Fluid / Liquid Simulation's See inside and Compare"
node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"   # ℹ fail 0
```
Then, as a background command: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $REPO/.claude/worktrees/sic-06a && node $RUN/slot.mjs run cat-06 -- node tools/check-pages.mjs --base http://127.0.0.1:8814 --out $RUN/checks/cat-06 animations/06-3d-advanced > $RUN/checks/cat-06.log 2>&1`. When it has ended (the log's last line is `Screenshots: …`): `grep -c '^ok' $RUN/checks/cat-06.log` prints `156` and `grep -c '^FAIL' $RUN/checks/cat-06.log` prints `0`. Only then `git switch sic/06a`, stop the server, ledger line, tell the coordinator `sic/cat-06` is ready.

---

### Task 13: 07.14 Flow Field: the hidden current as arrows (See inside), "Random each step" beside "Follows the current" (Compare, a common mistake, one canvas)

**Files:**
- Modify: `animations/07-ambient-background/flow-field/index.html`: new rules before `</style>` (line 28), the switch before the stage (after line 49), the stage's arrow canvas and labels (after line 51), the notes after the player bar (after line 56), and the `<script>` (lines 157-271: new constants, `init`, `colorFor`, `frame` and a new `move`, a new `drawField`, `changed` and the comment above it, `resize`, the Speed choice, and a new listener).

**Interfaces:**
- Consumes: Task 3 (paused loops at the deep setups; "Normal brings the first picture back"), Task 4 (switch tests), Task 6 (`?v=10`).
- Produces: the category 07 reference and the canvas reference (33 pages): See inside drawn on a second 2D canvas over the first, in the page's own frame step; Compare as one canvas split in two (each half clipped, half the particles each, its own trails); Normal's picture and particles kept while Compare shows and put back after it.

- [ ] **Step 1: The brief** (the 07 lane lead, during Phase 0)

Write `$RUN/briefs/07.14-flow-field.md`:

```markdown
# 07.14 Flow Field: brief (first batch)
Kind: loop, canvas 2D (the page pauses and slows itself; reduced motion starts on a settled picture). Category reference for 07;
reference for the 33 canvas pages and for a Compare with a common mistake (ruling 3).
See inside: small arrows on a grid (one per 36px square) for the invisible current at each spot, turning slowly with the field;
the particles ride them. Labels: "Arrows: the hidden current", "Each particle follows the arrow under it". The arrows are drawn
on a second canvas over the picture, in the page's own frame step; Speed lengthens them, Swirl size changes their pattern.
Compare (ruling 3): one canvas split down the middle, each half clipped, half the particles each with its own trails: "Random each
step" (each particle takes a new random direction every step: it scribbles in place) / "Follows the current" (the page as set).
Normal's picture and particles are kept while Compare shows and put back when it is left (or drawn again if a setting changed).
Reduced motion: paused; a mode change draws a settled picture of that mode at once (arrows over the trails; the split scribbles).
Phones: each half gets half the phone's 500 particles.
Pitfalls: Normal's step must stay exactly the old one (same order, same respawn); the arrows never go on the trail canvas (they would
smear); a setting changed in Compare drops the kept Normal picture.
Survey row: rollout-survey-05-07.md, 07.14.
```

- [ ] **Step 2: The slot** (after Task 6)

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; git -C $REPO worktree add -b sic/07a $REPO/.claude/worktrees/sic-07a feat/see-inside-compare`
Start, as a background command: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-07a && python -m http.server 8818 --bind 127.0.0.1`
Ledger: `$RUN/lanes/07.md`.

- [ ] **Step 3: Turn on the switch tests for this page (the failing test)**

In `animations/07-ambient-background/flow-field/index.html`, between `</div>` of `div.hb-step-head` and `<div class="stage">`, add:

```html
    <div class="seg hb-modes" role="group" aria-label="What the box shows" data-hb-modes>
      <button type="button" data-hb-mode="normal" class="on" aria-pressed="true">Normal</button>
      <button type="button" data-hb-mode="inside" aria-pressed="false">See inside</button>
      <button type="button" data-hb-mode="compare" aria-pressed="false">Compare</button>
    </div>
```

After `</div>` of `div.hb-player`, add:

```html
    <div class="hb-mode-notes" aria-live="polite">
      <p data-hb-for="inside" hidden>Inside, the arrows show the invisible current: at every spot it points one way and turns slowly over time, and each particle follows the arrow under it.</p>
      <p data-hb-for="compare" hidden>On the left, Random each step: each particle picks a new direction every step, so it only scribbles in place. On the right, Follows the current: the particles ride smooth streams.</p>
    </div>
```

Run: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-07a && node --test --test-reporter=spec tests/pages.test.js 2>&1 | grep -E "^✖ |AssertionError"`
Expected: `✖ flow-field: the page's script listens for hb:mode, and its styles mark modes on the stage only` (named again under `✖ failing tests:`), with `AssertionError [ERR_ASSERTION]: the page script listens for hb:mode on document`.

- [ ] **Step 4: Styles**

Before `  </style>` add:

```css
    /* See inside and Compare: a second canvas over the picture for the current's arrows, and plain words over the picture */
    .field,.lbl{display:none}
    .field{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
    .lbl{position:absolute;padding:4px 9px;border-radius:999px;background:rgba(5,6,10,.88);color:#f4f4f2;font:600 13px/1.2 var(--hb-font);white-space:nowrap}
    .stage[data-hb-mode="inside"] .field,.stage[data-hb-mode="inside"] .fl,.stage[data-hb-mode="compare"] .side{display:block}
    .fl.what{left:10px;top:10px}
    .fl.how{left:10px;bottom:10px}
    .side{top:10px}
    .side.first{left:10px}
    .side.second{left:calc(50% + 10px)}
    @media(max-width:360px){.lbl{font-size:12px;padding:3px 7px}.side.second{left:calc(50% + 6px)}}
```

- [ ] **Step 5: Markup**

After `      <canvas id="cvs" aria-hidden="true"></canvas>` add:

```html
      <canvas class="field" id="field" aria-hidden="true"></canvas>
      <p class="lbl fl what" aria-hidden="true" data-hb-caption>Arrows: the hidden current</p>
      <p class="lbl fl how" aria-hidden="true" data-hb-caption>Each particle follows the arrow under it</p>
      <p class="lbl side first" aria-hidden="true" data-hb-caption>Random each step</p>
      <p class="lbl side second" aria-hidden="true" data-hb-caption>Follows the current</p>
```

- [ ] **Step 6: Script**

(a) After `  let parts=[];` add:
```js
  // See inside and Compare: the arrows' canvas, a copy of Normal's picture kept while Compare shows, and one arrow per 36px square
  const field=document.getElementById('field'),fctx=field.getContext('2d');
  const keep=document.createElement('canvas'),kctx=keep.getContext('2d');
  const GRID=36;
  let mode='normal',kept=null;
```

(b) Replace `function init(){parts=Array.from({length:phone.matches?Math.min(COUNT,PHONE_PARTS):COUNT},()=>({x:Math.random()*W,y:Math.random()*H}));}` with:
```js
  // In Compare the particles split in two: the first half lives in the left half of the canvas and the second in the right (on
  // phones each half gets half the phone's particles). Elsewhere every particle may go anywhere, as before.
  function init(){
    const n=phone.matches?Math.min(COUNT,PHONE_PARTS):COUNT,split=mode==='compare';
    parts=Array.from({length:n},(_,i)=>{
      const side=split&&i>=n/2?1:0,x0=split?side*W/2:0,w=split?W/2:W;
      return{x:x0+Math.random()*w,y:Math.random()*H,side};
    });
  }
```

(c) Replace the whole `frame(s,nf)` function (from its comment `// One frame: dim the canvas nf times, …` to its closing `}`) with:
```js
  // One frame: dim the canvas nf times, then move every particle one step along the field and draw that step. s is how many
  // 60 Hz frames it stands for; k is s, or a third of it in slow motion, and shrinks the step and the field's time but not the dim.
  // Compare: each half draws only inside itself; the first half's particles take a random direction every step (the common
  // mistake), the second half's follow the field. See inside draws the arrows after the step.
  function frame(s,nf){
    const k=s*(slowTog.checked?1/3:1);
    ctx.fillStyle=`rgba(5,6,10,${TRAIL})`;
    for(let i=0;i<nf;i++)ctx.fillRect(0,0,W,H);
    if(mode==='compare'){
      const half=W/2;
      for(const side of [0,1]){
        ctx.save();ctx.beginPath();ctx.rect(side*half,0,half,H);ctx.clip();
        for(const p of parts)if(p.side===side)move(p,side?angleAt(p.x,p.y,t):Math.random()*Math.PI*2,k,side*half,half);
        ctx.restore();
      }
      ctx.fillStyle='#2a2b33';ctx.fillRect(half-1,0,2,H);
    }else for(const p of parts)move(p,angleAt(p.x,p.y,t),k,0,W);
    t+=0.01*k;
    if(mode==='inside')drawField();
  }
  // One step of one particle in direction a, drawn; one that leaves its part of the canvas (x0 to x0 + w) starts again somewhere in it
  function move(p,a,k,x0,w){
    const nx=p.x+Math.cos(a)*SPD*k,ny=p.y+Math.sin(a)*SPD*k;
    ctx.strokeStyle=colorFor(p,x0,w);ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(nx,ny);ctx.stroke();
    p.x=nx;p.y=ny;
    if(p.x<x0||p.x>x0+w||p.y<0||p.y>H){p.x=x0+Math.random()*w;p.y=Math.random()*H;}
  }
  // See inside: the current at the middle of every grid square, as a small arrow pointing where the field points there now (it is
  // longer at a higher Speed), on its own canvas over the picture
  function drawField(){
    if(field.width!==W||field.height!==H){field.width=W;field.height=H;}
    fctx.clearRect(0,0,W,H);
    fctx.strokeStyle='rgba(244,244,242,.8)';fctx.lineWidth=1.5;fctx.lineCap='round';
    const len=8+5*SPD;
    fctx.beginPath();
    for(let y=GRID/2;y<H;y+=GRID)for(let x=GRID/2;x<W;x+=GRID){
      const a=angleAt(x,y,t),dx=Math.cos(a)*len/2,dy=Math.sin(a)*len/2;
      fctx.moveTo(x-dx,y-dy);fctx.lineTo(x+dx,y+dy);
      fctx.lineTo(x+dx-Math.cos(a-.6)*5,y+dy-Math.sin(a-.6)*5);
      fctx.moveTo(x+dx,y+dy);fctx.lineTo(x+dx-Math.cos(a+.6)*5,y+dy-Math.sin(a+.6)*5);
    }
    fctx.stroke();
  }
```

(d) Replace `  function changed(){if(paused)prerender();else unseen=true;}` with:
```js
  function changed(){kept=null;if(paused)prerender();else unseen=true;} // a kept Normal picture would show the old setting
```

(e) In `resize()`, after `    W=cvs.width=w;H=cvs.height=h;` add `    kept=null;`.

(f) After the `visibilitychange` listener add:
```js
  // The mode switch draws the mode at once. Compare keeps Normal's picture and particles, splits the particles into its two halves
  // and draws a settled picture of them; leaving Compare puts Normal's back (or draws it again after a setting or size change).
  // See inside draws the arrows over the picture: every frame while it plays, at once while paused.
  document.addEventListener('hb:mode',e=>{
    const was=mode;mode=e.detail.mode;
    if(mode==='compare'&&was!=='compare'){keep.width=W;keep.height=H;kctx.drawImage(cvs,0,0);kept=parts;init();prerender();}
    else if(was==='compare'&&mode!=='compare'){
      if(kept&&keep.width===W&&keep.height===H){ctx.drawImage(keep,0,0);parts=kept;}else{init();prerender();}
      kept=null;
    }
    if(mode==='inside')drawField();else fctx.clearRect(0,0,field.width,field.height);
  });
```

(g) Replace `  choices('speed-seg',d=>{SPD=+d.spd;});` with:
```js
  choices('speed-seg',d=>{SPD=+d.spd;if(mode==='inside'&&paused)drawField();}); // See inside's arrows follow Speed at once, paused too
```
and, in the comment above `changed()`, `Speed changes no picture: it keeps the one on screen.` with `Speed changes no picture in Normal: it keeps the one on screen.`

(h) Rainbow's colors run across the part of the canvas a particle lives in, so in Compare both halves take the same band (with `x0` 0 and `w` the canvas's width, Normal's colors are exactly as before). Replace `  function colorFor(p){` with:
```js
  function colorFor(p,x0=0,w=W){ // x0 and w: the part of the canvas the particle lives in (in Compare, its half)
```
and `    return HUES[Math.floor((p.x/W*120+t*20)%360)];` with:
```js
    return HUES[Math.floor(((p.x-x0)/w*120+t*20)%360)];
```

- [ ] **Step 7: Tests**

Run: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-07a && node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ fail 0`.

- [ ] **Step 8: Page check, screenshots, tuning**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $REPO/.claude/worktrees/sic-07a && node $RUN/slot.mjs run sic-07a -- node tools/check-pages.mjs --base http://127.0.0.1:8818 --out $RUN/checks/07-flow-field/1 animations/07-ambient-background/flow-field`
Expected: six `ok` lines ("Normal brings the first picture back" passes because Compare puts Normal's kept picture back). Open `07-flow-field-desktop-inside.png`, `-phone-inside.png`, `-phone-reduced-inside.png`, `-desktop-compare.png`, `-phone-compare.png`, `-phone-reduced-compare.png`. Tune (`GRID`, the arrows' length, width and alpha, the head's size) until, at 1280 and at 375: the arrows read as a smooth field (neighbors point alike), the trails run along them, the two labels sit clear; in Compare the left half is plainly fuzzy dots and the right half plainly streams, with a thin line between them, at both widths and under reduced motion. Motion: a kit clips run (`REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; node $RUN/slot.mjs run sic-07a -- node $KIT/record.mjs --base http://127.0.0.1:8818 --only clips --keep-frames --out $RUN/kit/07-flow-field-clips animations/07-ambient-background/flow-field`); Read three frames from the middle of each mode clip's kept frame folder (the log names it): the arrows turn slowly and the particles follow them. Acceptance 7: kit runs with `--only stills --press "#scale-seg [data-px='60']"`, `--press "#trail-seg [data-fade='0.04']"`, `--press "#speed-seg [data-spd='1.6']"`, `--press "#count-seg [data-n='1500']"` and `--press "#color-seg [data-col='spectrum']"`: each changes both views (Speed: longer arrows; the rest: the field's pattern, the trails, the density, the colors). Six `ok` after every change.

- [ ] **Step 9: Normal before and after**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; node $RUN/slot.mjs run sic-07a -- node $KIT/record.mjs --base http://127.0.0.1:8818 --before http://127.0.0.1:8800 --only before --out $RUN/kit/07-flow-field --clean animations/07-ambient-background/flow-field`
Expected: many pixels differ (the particles start at random places on both sites): this page is compared by eye. Open the three pictures: the same kind of picture (density, trail length, colors), no arrows, no line down the middle.

- [ ] **Step 10: Commit**

```bash
cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-07a
git add animations/07-ambient-background/flow-field/index.html
git commit -m "feat: Flow Field draws its hidden current as arrows (See inside) and shows particles that pick a random direction each step beside particles that follow the current (Compare)"
```

- [ ] **Step 11: Review, fix rounds, merge into `sic/cat-07`**

The lane lead dispatches a fresh reviewer with: the brief, `git -C $REPO/.claude/worktrees/sic-07a diff feat/see-inside-compare...sic/07a`, the newest check round and output, the kit's before-and-after and clips, and the 12 acceptance lines. Beyond the check they confirm: Normal's step is the old step exactly (same order of drawing, same respawn); the frame loop still moves by elapsed time with the dim once per 60th; the arrows' canvas is cleared and redrawn each frame (no smear) and only in See inside; each Compare half is clipped and has half the particles (phones 250 each); a setting changed in Compare leaves Normal correct afterwards; Pause, press See inside, press Fast: the arrows lengthen at once. Verdict; at most three fix rounds. When approved:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook
cd $REPO/.claude/worktrees/sic-07a && git switch -c sic/cat-07 feat/see-inside-compare && git merge --no-ff sic/07a -m "Merge slot 07a: Flow Field's See inside and Compare"
node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"   # ℹ fail 0
```
Then, as a background command: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $REPO/.claude/worktrees/sic-07a && node $RUN/slot.mjs run cat-07 -- node tools/check-pages.mjs --base http://127.0.0.1:8818 --out $RUN/checks/cat-07 animations/07-ambient-background > $RUN/checks/cat-07.log 2>&1`. When it has ended (the log's last line is `Screenshots: …`): `grep -c '^ok' $RUN/checks/cat-07.log` prints `138` and `grep -c '^FAIL' $RUN/checks/cat-07.log` prints `0`. Only then `git switch sic/07a`, stop the server, ledger line, tell the coordinator `sic/cat-07` is ready.

---
### Task 14: The batch on the branch, the review kit's run, and the owner's review (coordinator)

**Files:**
- Merge into `feat/see-inside-compare`: `sic/cat-01` … `sic/cat-07` (one page each).
- Create (outside the repository): `$RUN/kit/first-batch/` (the kit's stills, clips, comparisons, `index.html`, `manifest.json`).

**Interfaces:**
- Consumes: the seven approved categories (Tasks 7 to 13: each lane's ledger has the reviewer's Approved and a category check with no `FAIL`), the kit (Task 5), the before-pictures server (Task 0), `$RUN/first-batch-rulings.json`.
- Produces: the first batch on `feat/see-inside-compare`; the owner's verdict in `$RUN/ledger.md` (approved, or the list of changes and who makes them).

- [ ] **Step 1: Merge the seven categories, one at a time**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook
cd $REPO && git status --short && git branch --show-current
for n in 01 02 03 04 05 06 07; do git merge --no-ff sic/cat-$n -m "Merge category $n of the first batch of See inside and Compare" || break; node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"; done
```
Expected: an empty status, `feat/see-inside-compare`, then seven merges with no conflict (each category changed one page) and `ℹ fail 0` after each. Then `node tools/make-skill.mjs && git status --short`: nothing (the prompts and settings did not change).

- [ ] **Step 2: The owner's preview**

Start the preview of the main checkout (Claude Browser `preview_start` with the name `static-site`: `python -m http.server 8731` from `.claude/launch.json`; it opens the browser pane, which is where the owner looks). Check: `curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8731/animations/02-entrance-and-exit/fade-in-out/` prints `200`.

- [ ] **Step 3: The kit run on the seven pages**

Run, as a background command (about fifteen minutes):
`REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; node $RUN/slot.mjs run kit-batch -- node $KIT/record.mjs --base http://127.0.0.1:8731 --before http://127.0.0.1:8800 --rulings $RUN/first-batch-rulings.json --out $RUN/kit/first-batch --clean --keep-frames animations/01-scroll-based/parallax-scrolling animations/02-entrance-and-exit/fade-in-out animations/03-page-transitions/overlay-wipe animations/04-micro-interactions/magnetic-button animations/05-text-typography/marquee-ticker animations/06-3d-advanced/fluid-simulation animations/07-ambient-background/flow-field > $RUN/kit/first-batch.log 2>&1`
When it has ended: `tail -2 $RUN/kit/first-batch.log`. Expected: `63 pictures, 21 clips and 14 comparisons made, 0 skipped, 0 failed`. The comparisons say `0 of … pixels differ` for Parallax, Fade In, Overlay Wipe, Magnetic Button and Fluid (a few corner pixels at most), a few for Marquee and many for Flow Field (random particles: by eye).

- [ ] **Step 4: The coordinator looks first**

Open `$RUN/kit/first-batch/index.html` and, with the Read tool, the 1280 and 375 See inside and Compare pictures of each page and one frame from the middle of each mode clip, from its kept frame folder (the log names it) (the clips' captions name ruling 1 beside the See inside and Compare clips of Fade In, Overlay Wipe and Magnetic Button, ruling 2 beside Parallax's See inside, ruling 3 beside the Compare of Marquee and Flow Field, ruling 4 beside every 375 Compare picture). Anything that does not read from the picture alone goes back to its lane as a fix round before the owner sees it (ledger line).

- [ ] **Step 5: Show the owner**

Navigate the browser pane to each page in turn, starting with `/animations/02-entrance-and-exit/fade-in-out/`, and leave it on Parallax Scrolling. Send the owner, in very short plain words: the path of `$RUN/kit/first-batch/index.html` (it opens from disk: clips first, then pictures, then Normal before and after), that the seven pages are open in the browser pane, what each ruling looks like where it shows (pressing See inside or Compare plays it once; Parallax's faint start outlines; Marquee's and Flow Field's mistakes; phones keep the box's size), and one question: "Roll these out to the other 159 pages as they are, or change something first?" Nothing is pushed or merged into `main`.

- [ ] **Step 6: The owner's answer**

Write the answer in `$RUN/ledger.md`. A change to one page goes back to its lane as a fix round: the lane merges `feat/see-inside-compare` into the slot branch first (a merge the coordinator allows for this; it brings the owner's other changes, `?v=11` if any), the same builder fixes, a new reviewer pass, then `git switch sic/cat-NN && git merge --no-ff sic/NNa` (the category branch exists already, so no `-c`), the category check again, and the coordinator merges `sic/cat-NN` into `feat/see-inside-compare` again. A change to a shared file (`assets/css/demo-page.css`, `assets/js/demo-page.js`, `tools/check-pages.mjs`) is made by the coordinator in one lane `sic/00f` from the head of `feat/see-inside-compare`, with its own test first, reviewed, merged, and followed by one more bump to `?v=11` on every animation page and the home page (as Task 6, tracked files only, line endings kept) before any of the 159 pages starts. Then the owner sees the changed pages (Steps 3 to 5 again, for those pages only) until they approve. The ledger's last line: `First batch approved by the owner on <date>; shared files at v=<N>`.

---

## After this plan: the other 159 pages

They get a plan of their own, written once the owner has approved the batch. While the owner looks (Task 14), the lane leads may already write the 159 briefs (no code), in the format of Step 1 of Tasks 7 to 13, each from its survey row, its page and its README's How it works, naming the closest first-batch page. That plan will need:

- **The owner's verdict on the batch** and every change it brought, applied (with `?v=11` if a shared file changed), so the seven references are final before anyone copies them.
- **Every existing slot `a` branch and `sic/cat-NN` first takes the head of `feat/see-inside-compare`** (the owner's changes, `?v=11` if any) before its next page.
- **The 159 briefs**, with the spec's hard cases written into the briefs they concern: the 41 canvas and WebGL pages (one canvas split, one WebGL context in two viewports), the seven second-world pages (Cloth / Soft-Body Simulation, 2D Physics, Flocking, Fireworks, GPGPU Particle System, Liquid Glass, Abstract Geometric Motion, Elastic Transition's live spring: same fixed steps from one accumulator, first in their slots), the 62 do-it pages (hover, press, drag and form rules), the about 55 pages whose Compare reduced motion erases (posed stills), the random-piece pages, the pages with a "Shows the …" switch or a "Without" setting, the 19 pages with Your text, Snap Scrolling, the flash safety rule, the twins (different pictures, one slot each pair) and the weak views of spec section 2 (the rows marked \* show a mistake or a made-up scene).
- **Slots:** the 20 slots of spec section 7 (01: three, 02: two, 03: two, 04: four, 05: two, 06: four, 07: three; ports 8801 to 8820 as in this plan's Global Constraints), each with its ordered list of pages (hard and heavy first), the category merges done in slot `a`'s worktree as in Tasks 7 to 13.
- **Known risks this plan surfaced:** nine plays-once or do-it pages run an endless CSS animation (`typewriter-effect`, `letter-by-letter-stagger`, `button-loading-states`, `checkmark-draw`, `dynamic-island`, `progress-animation`, `pull-to-refresh`, `skeleton-loader`, `holographic-card`): the run wait ignores endless animations, but a blinking caret still changes the picture, so the 750 ms rest can fail; decide per page before its slot starts (the page holds the caret still in See inside and Compare, or the check learns an exception). A do-it page with a timer that runs while idle fails the run wait (timers of 6 s or less count). A Show me or Replay run that holds its pauses inside a frame loop or a setInterval is seen only as a moving stage, so a pause of 750 ms or more passes for rest: every such brief says to hold them with setTimeout. A snapping page re-snaps if a mode changes the scrolling content. At most four labels on phones. Forty-nine pages are already past 300 lines.
- **Integration (the end of the rollout):** the final gate flipped (`const SWITCHED = steps;`), the docs of spec section 6 (CLAUDE.md, CONTRIBUTING.md, the PR template, README step 2, a CHANGELOG line), `node tools/update-sitemap.mjs`, `node tools/make-skill.mjs` (no change), the whole site in seven runs plus `home` (and `famous` once it exists), the final review in eight parts, the gallery (`record.mjs --gallery` on every category), the owner's final look, the leftover `hb-chrome-*` and `hb-kit-*` temp folders removed with the owner's OK, the slot worktrees removed, and the release by the coordination file's rules.

## Self-review

**Spec coverage (Phase 0 and the first batch):**

| Spec requirement | Task |
|---|---|
| §4.1 fix wave A, round 2 (plain-clip screenshots, the stage checked in them, pointer parked; the note guard and its test) | already merged at `765521a`; Task 0 Step 1 confirms it |
| §4.2 the do-it path: Reset, then rest; rest = unchanged for 750 ms (one helper for `stillShot` and `settledShot`); wait after each press; new fixtures (a timed revert, a paused loop that redraws on resize, scroll snapping); old fixtures as before | Task 3 (`restShot`, `waitForRun`, `TIMERS`, `sic-gen.mjs` with `ok-do-revert`, `ok-loop-resize`, `ok-snap`, `bad-snap-relayout`; categories 90 to 92 keep the old results) |
| §4.3 captions inside the stage, 12px, apart; no id twice; the stage's name changes with the mode; a control's name contains its visible words | Task 3 (`captionProblems`, `pictureName`; `ok-captions`, `ok-glyph-name` and the `bad-caption-*`, `bad-dup-id`, `bad-label-same`, `bad-name` fixtures) |
| §4.4 `setUpCopy` only with a prompt; the comment on pressing the pressed mode; a test that the buttons, notes and mark change before `hb:mode`; ruling 1 with a test per case; the mode check waits for that run | Task 2 (code and six tests), Task 3 (`runs`, `waitForRun`) |
| §4.5 two notes, direct children, one or two sentences; listens for `hb:mode`; no Normal rule, mode rules name `.stage`; the switch's phone rule outranks `.seg`'s; the final gate line | Task 4 |
| §4.6 / §5 the clean-up: `learn/`, `tests/learn.test.js`, Parallax's lesson line, nav and link, the lesson CSS (block, hover rules, 601px block, phone rules), the `learn` target and `hb-learn` exceptions and touch-target selectors, the stylesheet test's lesson selectors, 601px assertion and title; kept: the boot without a prompt and its renamed test, the header comment without "(the idea lessons)", the note link rule and test; added: the guard test; one commit | Task 1 |
| §4.7 one bump to `?v=10`, tracked files only, line endings kept; then frozen; a later shared change takes the next number | Task 6; Task 14 Step 6 (`?v=11`) |
| §4.8 the review kit: any pages, kind read, nine stills and three clips, `--before` with the count, `--gallery` | Task 5 |
| §3 the six first-batch pages with the pictures and halves of the table | Tasks 8 to 13 |
| §3 Parallax: start outlines (ruling 2), labels sharp (no `will-change`), the reduced-motion Compare note, the comment, `data-hb-caption` | Task 7 |
| §3 what the owner sees (stills, clips, Normal before and after, rulings named, pages in the pane; changes applied, a shared one with one more bump) | Task 14 |
| §1 the switch, notes, listener rules, copies, captions, reduced motion, phones, the 12 acceptance lines | Global Constraints; each page task's code, Step 8 tuning and Step 11 review; ruling 4's box size also in Task 3 (`look`, the `bad-box-size` fixture) |
| §2 the brief from the survey row, the builder's freedom, tuning from the mode screenshots, Normal before and after | Step 1, Step 8 and Step 9 of each page task |
| §7 roles, one builder and one fresh reviewer, at most three fix rounds, slots and ports, `sic/cat-NN`, the eight-check pool, headless only, no `git stash`, one server and scratch folder per lane | Global Constraints, Phases, Task 0, each page task's Steps 2 and 11 |
| Coordination: branches and ports, the pool for every project, `main` untouched (before-pictures from a detached checkout), versions, merges with `--no-ff` | Global Constraints, Task 0 Step 6, Task 6, Task 14 |
| §6 docs, sitemap, `make-skill` | at integration (next plan); `make-skill` unchanged is checked in Tasks 6 and 14; the pilot spec's status line is in Task 1 |

**Placeholder scan:** every code step shows its code; the starting code for each page's views is a complete draft with the acceptance and the screenshots to tune against; the few steps that say "tune" name the values to move and the picture each must give.

**Names used across tasks:** `SWITCHED`, `NOTES_BOX` (Task 4); `restShot`, `waitForRun`, `captionProblems`, `pictureName`, `TIMERS`, `window.__hbWaiting` (Task 3; `TIMERS` also in the kit); `playOnce` inside `setUpModes`, `visitorActed` (Task 2); `slot.mjs` `take`, `free`, `list`, `sweep`, `run` (Task 0); `record.mjs` with `--base`, `--before`, `--rulings`, `--only`, `--gallery`, `--press`, and `kit-lib.mjs` `expandPages`, `shortName`, `clipPlan`, `clipCaption`, `rulingsFor`, `countDiff`, `RULINGS`, `KIND_WORDS` (Task 5); `data-hb-caption`, `.stage[data-hb-mode="inside"|"compare"]`, `hb:mode`, `posed` (pages). The run folder `$RUN`, the kit `$KIT` and the fixtures `$FX` are the same paths in every task.
