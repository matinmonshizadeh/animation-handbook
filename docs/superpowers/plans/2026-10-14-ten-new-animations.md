# Ten New Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the ten new animations of `docs/superpowers/specs/2026-10-13-ten-new-animations-design.md` (166 → 176 pages), each with Normal · See inside · Compare from the start, their home cards and previews, lists, counts and generated files, ready to go live together with the See inside and Compare rollout on the owner's word.

**Architecture:** One lane per page, all ten at once as seats allow: lane *n* works on branch `ten/L<n>` in worktree `.claude/worktrees/ten-L<n>`, served on port `8960 + n`, cut from `feat/ten-animations`, which Task 0 cuts from `feat/see-inside-compare` as soon as the rollout's Phase 0 is merged into it. A lane applies its shared edits with a run-folder tool (`lanes.mjs`), writes its page, README and home preview from the complete code in its task, writes the generated files with the repository's tools, and passes the tests, its page check, the review kit's short screens and the home check before a reviewer approves it. Integration (Task 11, worktree `ten-int`, port 8971) merges `feat/see-inside-compare` again, then the ten lanes in table order (a run-folder tool settles the expected overlaps), links the split sections, sets every count to 176 and adds the test entries with another run-folder tool, and runs every check. A final review on a frozen checkout (`ten-rev`, port 8972) and the owner's look follow (Task 12); the rollout's own plan then merges the branch in, and both go live together on the owner's word.

**Tech Stack:** Plain HTML, CSS and vanilla JavaScript (canvas 2D, SVG, CSS transforms, Web Audio behind one button); Node 22+ (`node --test`, the run-folder tools); the page check `tools/check-pages.mjs` and the rollout's review kit (`record.mjs`) in headless Chrome through the machine's pool (`slot.mjs`, waited on with `wait-log.mjs`); Python's static server.

**Every page in this plan was built and checked before the plan was written,** in scratch copies of the site made from `feat/see-inside-compare` at `d810bce` with the rollout plan's Phase 0 Tasks 2, 3, 4 and 6 applied as that plan wrote them (the shared files at `?v=10`, the page check's do-it path, run waits, rest and caption checks, the switch tests): with its lane's shared edits, each page passed the tests, six `ok` lines of the page check, the review kit's 27 short-screen pictures with no label cut or overlapping, the home check and the check of the old last page it links, and its clips of Normal, See inside and Compare were read frame by frame; then the ten lanes were merged in order with Task 11's commands as written, and the result passed the tests and the page check of all ten pages, the five old last pages, the pages whose See also changed and the home page. Each lane's first five steps (its shared edits, page, README, preview and generated files, then the tests) and Task 11's merges and edits were run again on a copy of `feat/see-inside-compare` at `fce3a2b` (Phase 0, the first batch and the Animation finder merged) and on a copy of `feat/ten-animations` at `ece2689` (Famous effects too): every lane `ℹ fail 0` (1717 pass on `ece2689`), and the integration 1825 pass, 0 fail. Two pre-flight reviews and a re-review (`plan-review-A.md`, `plan-review-B.md`, `plan-rereview.md` in the run folder) were applied, and the changed pages checked again (`plan-fixes.md`). Each task's expected output comes from those runs. The real branch differs from that copy (the rollout's later commits, such as `sic/00f`'s help line and Task 3's review rounds): Task 0 writes the differences in the ledger, and a lane reads its first `FAIL` against them and tunes the page as its steps say.

## Global Constraints

- **CLAUDE.md governs every page** as it reads after the rollout's Phase 0; the rollout spec's section 1 and its acceptance list (`2026-10-13-see-inside-compare-rollout-design.md`) govern both views; where the ten-animations spec and the coordination file disagree, the coordination file (`2026-10-13-next-projects-coordination.md`) wins.
- **The rollout's lessons and rulings bind these pages too**, since the rollout's final review (part 9) judges them by them: `$RUN/lessons.md` (lessons 1 to 21), `$RUN/briefs/RULINGS.md` (rulings 1 to 7), `$RUN/brief-rulings.md` (G1 to G11), `$RUN/briefs/OPEN-QUESTIONS.md` and `$RUN/rulings-159.md` (the owner approved the first batch on 2026-10-15 with no rules). Every builder and reviewer reads them first. A rule the owner gives later is applied to the ten pages, through the lanes' fix loop, before integration (Task 11 Step 1, Task 12 Step 7).
- **One animation = one folder** `animations/<category>/<slug>/` holding exactly `index.html` and `README.md`. No build step, no frameworks, no npm packages, no external dependencies. Pictures are drawn in the page (inline SVG, CSS or canvas commands); no image, sound or font file is added; made-up names only, no real brand, place or person.
- **About 300 lines for the demo plus about 150 for its two views** (the line counts in each task: 306 to 416).
- **Shared files:** `../../../assets/css/demo-page.css?v=N` and `../../../assets/js/demo-page.js?v=N` (defer), after the page's own `<style>`, with N the number the branch's pages use (10 when this plan was written; Task 0 writes it in the ledger, and a lane's Step 2 sets it); Task 11 sets the ten pages to the number the other pages use by then. **This plan never changes a shared file or the version:** a need for a shared change goes in the builder's report, and the coordinator appends it as one line to `$RUN/shared-wishes.md` (page, file, what and why, with one `printf … >>`), which the rollout's integration applies with its next number.
- **The switch and the notes, exactly:** `<div class="seg hb-modes" role="group" aria-label="What the box shows" data-hb-modes>` with Normal (`class="on" aria-pressed="true"`), See inside, Compare, between the Watch heading and the stage; right after the player bar `<div class="hb-mode-notes" aria-live="polite">` holding `<p data-hb-for="inside" hidden>` then `<p data-hb-for="compare" hidden>`, each one or two sentences of at most 35 words (RULINGS 1); a note says left and right only where the halves never stack; a note stays true after every press and setting (lesson 16: under reduced motion "Shown still" only while paused).
- **The `hb:mode` listener** sits at the top level of the page's script, draws the mode at once, never scrolls, moves focus, presses a control, stops Play or changes Pause; mode CSS starts `.stage[data-hb-mode="inside"]` or `.stage[data-hb-mode="compare"]`; no rule on `[data-hb-mode="normal"]`; no class exactly `lbl`.
- **Captions** carry `data-hb-caption`, are at least 12px as drawn and 4.5:1, sit inside the stage, never overlap each other, at most six (four on phones), also on the kit's short screens (lesson 12); where the stage, its canvas or picture has an `aria-label`, it changes with the mode.
- **Owner rulings (2026-10-13):** a press of See inside or Compare plays the demo once (Show me on the do-it pages, Replay on Ink Spread Reveal), never under reduced motion, and the loops are never pressed; on phones the box keeps its size in every mode; Audio Visualizer is silent by default and its Hear it button plays a beat the browser makes (no file, no microphone, no AudioContext before the press).
- **Do-it pages:** Show me runs two to four seconds with its pauses held by `setTimeout` and ends at rest on exactly the picture it started from; `hb:input` and a trusted `focusin` in the stage stop a run; Normal at rest is never posed (G4). **Loops:** Pause freezes the stage at once; going back to Normal gives back the first picture. **Frame loops** move by elapsed time (`FRAME=1000/60`, `dt` at most 50 ms); Fire Effect and Water Ripple take fixed steps from an accumulator; reduced motion is read inside every frame loop. **Compare's halves** differ in one idea only (lesson 17, G9), and each half stays inside its half (lesson 14).
- **What a lane changes:** its folder; the home page's card (`CATS`), `PLACES` row, `PV` key, its preview (CSS at the end of its section's bespoke block, a `case` in `pvMarkup()`, a `STILL` point where needed) and its `FIND` row (the finder is on the branch since `fce3a2b`); every written count set to 167 and its section's count plus one; the root README's catalog line and the category README's line (and 06's Browser requirements or 07's Implementation summary); the generated files by their tools; and, for the first lane of a section (L1, L2, L3, L6, L8), the old last page's Next link. **Never:** `assets/`, `tests/` (a proof edit is put back with `git checkout`), `tools/`, `CLAUDE.md`, `CONTRIBUTING.md`, `og-image.png`, `docs/`, or any other page.
- **Counts:** 167 in each lane; 176 (02: 15, 03: 17, 04: 44, 06: 28, 07: 26) only at integration. **Generated files** (`sitemap.xml`, `llms.txt`, `skills/animation-handbook/`, `og-image.png`, the marked blocks of `famous/index.html`) are never merged by hand: after any merge take either side, run `node tools/update-sitemap.mjs`, `node tools/make-skill.mjs`, `node tools/make-famous.mjs` once `famous/` exists, and (the coordinator only) `node tools/make-social-image.mjs`.
- **Agents:** only the coordinator starts agents, by the rollout's seat count (`seats = 20 − running − 1`; reviews and fix rounds before new lanes, new work taking turns with the rollout's); every builder and reviewer runs on the strongest model; agents start no agents and never open the browser pane. A builder writes only in its worktree, `$TEN/checks/L<n>/` and `$TEN/reports/L<n>/`; a reviewer only in `$TEN/reports/L<n>/`. Each writes its report as a file whose first line is `RESULT: built <commit>`, `RESULT: approved` or `RESULT: changes <count>`, and replies in at most three lines. **Only the coordinator writes `$TEN/ledger.md`**, from those files.
- **Machine:** every Chrome run (page check, review kit, frame times) goes through the pool (`node $RUN/slot.mjs run <who> -- <command>`; at most eight at once on the machine), each as its own background command with its output in a log ending in an `EXIT=<code>` line, waited on with `node $RUN/wait-log.mjs <log>` (again while it says `still running`); headless Chrome only, never the browser pane (the owner's); the coordinator starts and stops each worktree's one server; no `git stash`; no `git config` (a setting a command needs goes on that command, `git -c …`); leftover `hb-chrome-*` temp folders removed only with the owner's OK. The main checkout stays on `feat/see-inside-compare` and is never switched.
- **Every command block** starts with the shell variables below, and every `cd` is written `cd <path> || exit 1`, so a step can never fall back to the main checkout.
- **Git:** merge, never rebase or squash; nothing is pushed; release only on the owner's word, together with the rollout.
- **Words:** no code on the pages, plain labels and hints, American spelling, no hype ("stunning", "amazing", "powerful").

**Shell variables** (Git Bash), at the top of every command block:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
```

`$RUN` holds the machine's check pool (`slot.mjs`, `wait-log.mjs`) and the rollout's lessons and rulings; `$TEN` is this project's run folder (the coordinator made it for the plan's reviews; Task 0 adds the tools, the ledger and the folders for briefs, checks and reports). Lane *n*'s worktree is `$REPO/.claude/worktrees/ten-L<n>`, served on port 8960 + n (L10: 8970); integration's `ten-int` on 8971 and the final review's `ten-rev` on 8972.

---

## Phases and parallel work

| Phase | Tasks | Runs | Waits for |
|---|---|---|---|
| A | Task 0 (coordinator): branch, the owner's answer on the finder and Famous effects, run folder and its four tools, every lane's shared edits tried, the finder rows' check, ten worktrees | alone, about 1 hour | the rollout's Phase 0 merged into `feat/see-inside-compare` |
| B | Tasks 1 to 10, one lane each (a builder, then a reviewer) | as many at once as the seat count allows; their Chrome runs share the pool of eight; lanes of one section (04: L3, L4, L5; 06: L6, L7; 07: L8, L9, L10) never wait for each other | Task 0 |
| C | Task 11 (the coordinator runs the merges) | alone | all ten lanes approved, and every ruling that landed since applied |
| D | Task 12: the final review in three parts at once, fixes by the lanes' builders, the whole-site check in parts, the owner's look, the hand-over to the rollout | parts at once | Task 11 |

The pages are written in full in Tasks 1 to 10, so a lane's builder applies and verifies rather than designs; the slow part of a lane is its checks and review. Expect about 1.5 to 2.5 hours a lane with its review and kit runs, the lanes overlapping as seats allow; integration 1 to 2 hours; the final review and fixes 3 to 4 hours; the whole-site check about 1.5 hours (or the rollout's own, after the merge).

## File structure

| Path | Made by | What it is |
|---|---|---|
| `animations/02-entrance-and-exit/ink-spread-reveal/{index.html,README.md}` | Task 1 | 02.15, plays once (Replay, Loop, Slow motion `css`); SVG mask of growing blots |
| `animations/03-page-transitions/pixelate-transition/{index.html,README.md}` | Task 2 | 03.17, do it (Show me, Reset, Slow motion); canvas drawn small and scaled up |
| `animations/04-micro-interactions/before-after-slider/{index.html,README.md}` | Task 3 | 04.42, do it; a sliding window and two transforms |
| `animations/04-micro-interactions/magnifier-lens/{index.html,README.md}` | Task 4 | 04.43, do it (Show me, Slow motion); a lens holding a bigger vector copy |
| `animations/04-micro-interactions/card-deck-swipe/{index.html,README.md}` | Task 5 | 04.44, do it; a pile of cards with a pivot below |
| `animations/06-3d-advanced/water-ripple/{index.html,README.md}` | Task 6 | 06.27, do it; a two-grid wave simulation on a small canvas |
| `animations/06-3d-advanced/audio-visualizer/{index.html,README.md}` | Task 7 | 06.28, loop (Pause, Slow motion) with Hear it |
| `animations/07-ambient-background/ken-burns/{index.html,README.md}` | Task 8 | 07.24, loop in CSS (Pause `css`, Slow motion `css`) |
| `animations/07-ambient-background/fire-effect/{index.html,README.md}` | Task 9 | 07.25, loop (Pause, Slow motion); a heat grid on small canvases |
| `animations/07-ambient-background/lightning/{index.html,README.md}` | Task 10 | 07.26, loop (Pause, Slow motion); bolts on a canvas |
| `index.html` (home) | Tasks 1-10 (by `lanes.mjs` and each preview step), Task 11 (counts, `FIND`) | cards, `PLACES`, `PV`, previews, `STILL`, `FIND`, counts |
| `README.md`, `animations/{02,03,04,06,07}-*/README.md`, `.github/ISSUE_TEMPLATE/config.yml`, `404.html` | Tasks 1-10 (`lanes.mjs`), Task 11 (`integrate.mjs`) | catalog and list lines, counts |
| The old last pages `shatter-effect`, `cube-transition`, `dynamic-island`, `infinite-zoom`, `game-of-life` (`index.html`) | Tasks 1, 2, 3, 6, 8 (`lanes.mjs`) | the first Next link |
| The new pages' pager lines | Task 11 (`integrate.mjs`) | the split sections linked |
| `tests/pages.test.js` (`KEYBOARD_PAGES`, `PHONE_DEFAULTS`), `tests/finder.test.js` (case 9, if present) | Task 11 (`integrate.mjs`) | test entries |
| Nine existing pages' `README.md` See also (one line each, as the coordination file's map now says), six See also lines between new pages, `CHANGELOG.md` | Task 11 (`integrate.mjs`) | links to and between the new pages, the Unreleased line |
| `sitemap.xml`, `llms.txt`, `skills/animation-handbook/`, `og-image.png`, `famous/index.html` blocks | the tools, after every change and merge | generated |
| `$TEN/lanes.mjs`, `$TEN/frametimes.mjs`, `$TEN/resolve.mjs`, `$TEN/integrate.mjs`, `$TEN/ledger.md`, `$TEN/briefs/`, `$TEN/checks/`, `$TEN/reports/`, `$TEN/final/` | Task 0 (tools, ledger), the lanes and reviewers (checks, reports), Task 12 (final) | run folder (not in the repository) |

---

### Task 0: Branch, the owner's answer, run folder and its tools, every lane tried, the finder rows' check, ten worktrees (coordinator)

**Files:**
- Create (run folder, not in the repository): `$TEN/lanes.mjs`, `$TEN/frametimes.mjs`, `$TEN/resolve.mjs`, `$TEN/integrate.mjs`, `$TEN/ledger.md`, `$TEN/briefs/`, `$TEN/checks/`, `$TEN/reports/`
- Create (git): branch `feat/ten-animations` from `feat/see-inside-compare`; branches `ten/L1` … `ten/L10` with worktrees `.claude/worktrees/ten-L1` … `ten-L10`
- Test: ten scratch exports of `feat/ten-animations` outside the repository (`lanes.mjs` on each, the tests on one); a scratch export of the branch that holds the finder (`integrate.mjs --finder-check`, then `tests/finder.test.js`)

**Interfaces:**
- Consumes: the rollout's Phase 0 merged into `feat/see-inside-compare` (the shared files at `?v=10` or later, `setUpModes` pressing Replay or Show me after a mode press, the page check's `restShot`, `waitForRun` and `captionProblems`, the switch tests; its ledger line `Phase 0 done at …`); the machine pool `$RUN/slot.mjs` and `$RUN/wait-log.mjs`; the rollout's lessons and rulings.
- Produces: `node $TEN/lanes.mjs <n> <root>` (lane *n*'s shared edits; exports `LANES`, `apply(n, root, total = 167)`, `nextLink(slug, title)`; refuses a second run on the same tree); `node $TEN/frametimes.mjs --base <url> [--phone] [--modes normal,inside,compare] <page folder>` (frame times with the CPU slowed four times); `node $TEN/resolve.mjs <file>...` (settles a lane merge's overlaps; exit 1 when one is left for a person); `node $TEN/integrate.mjs <root> [--finder-check]` (the integration's edits); `$TEN/ledger.md` (one line per event, `YYYY-MM-DD HH:MM  L<n>|int|coord  what happened`, written by the coordinator only); the shared-file version `N` and the base's differences in the ledger.

- [ ] **Step 1: Check that Phase 0 is merged, and read the version**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
grep -c "^Phase 0 done at" $RUN/ledger.md
git -C $REPO show feat/see-inside-compare:animations/01-scroll-based/parallax-scrolling/index.html | grep -o 'demo-page\.css?v=[0-9]*'
git -C $REPO show feat/see-inside-compare:tools/check-pages.mjs | grep -c 'async function captionProblems'
git -C $REPO show feat/see-inside-compare:index.html | grep -c '^const FIND={'
git -C $REPO show feat/see-inside-compare:tools/make-famous.mjs > /dev/null 2>&1 && echo "famous: on the branch" || echo "famous: not on the branch"
grep -c "^First batch approved by the owner on .*rulings-159\.md:" $RUN/ledger.md
ls $RUN/slot.mjs $RUN/wait-log.mjs $RUN/lessons.md $RUN/briefs/RULINGS.md $RUN/brief-rulings.md $RUN/briefs/OPEN-QUESTIONS.md $RUN/rulings-159.md
```

Expected (each checked on 2026-10-15): `1` (the rollout's ledger line `Phase 0 done at 513be66; shared files frozen at v=10`, written at the start of a line); `demo-page.css?v=N` with N of 10 or more (10 then; write N down: the lanes set it in their pages); `1`; `1` (the Animation finder is live and `main` was merged into the rollout at `fce3a2b`, so the branch has `const FIND={` and each lane adds its own `FIND` row; `0` would mean it is not there); `famous: not on the branch` (until Famous effects goes live: Step 2); `1` (the owner approved the first batch on 2026-10-15 with `rulings-159.md: 0 rules`); the seven paths. If the first or third prints `0`, Phase 0 is not merged yet: stop and wait.

- [ ] **Step 2: Famous effects: the owner's answer**

The Animation finder is live and on `feat/see-inside-compare` (Step 1), so only Famous effects can be open. If Step 1 printed `famous: on the branch`, go to Step 3. Otherwise the coordination file's rule applies: the coordinator asks the owner whether the ten pages wait for Famous effects or take it in (it then goes live with them), and writes the answer in the ledger once Step 4 has made it. Then:
- **Wait:** stop here until `main`, with Famous effects live, has been merged into `feat/see-inside-compare` (coordination rule 4); then Step 1 again, and Step 3.
- **Take it in:** Step 3a, right after Step 3 and before Step 4 (Step 4's ledger line and Step 5's tries read the branch with it in); the lanes are cut after it.

- [ ] **Step 3: Track this plan, then cut the branch (the main checkout stays where it is)**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
P=docs/superpowers/plans/2026-10-14-ten-new-animations.md
[ "$(git -C $REPO rev-parse --abbrev-ref HEAD)" = feat/see-inside-compare ] || exit 1
git -C $REPO ls-files --error-unmatch $P > /dev/null 2>&1 && echo "plan tracked already" || { git -C $REPO add -- $P && git -C $REPO commit -m "docs: the ten new animations' plan" -- $P; }
git -C $REPO branch feat/ten-animations feat/see-inside-compare
git -C $REPO log --oneline -1 feat/ten-animations
git -C $REPO rev-parse --abbrev-ref HEAD
```

Expected: `plan tracked already` or one commit of this plan alone (the rollout's integration expects an empty status in the main checkout, and the lanes read the plan from there); then that commit as the tip of `feat/ten-animations`, then `feat/see-inside-compare` (the main checkout was not switched).

- [ ] **Step 3a (only on "take it in"): merge Famous effects into `feat/ten-animations`**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
git -C $REPO worktree add $REPO/.claude/worktrees/ten-int feat/ten-animations
cd $REPO/.claude/worktrees/ten-int || exit 1
[ "$(git rev-parse --abbrev-ref HEAD)" = feat/ten-animations ] || exit 1
git -c merge.conflictStyle=diff3 merge --no-ff --no-commit feat/famous-effects; git status --short | grep -E '^(UU|AA|DU|UD) ' || echo "no conflicts"
```

Overlaps are settled by coordination rule 6 (each project keeps its own lines; Phase 0's `tools/check-pages.mjs` and `tests/pages.test.js` against Famous effects' additions); a resolution beyond keeping both sides gets a fresh agent's review before the commit. Then write the generated files, commit and run the tests:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-int || exit 1
[ "$(git rev-parse --abbrev-ref HEAD)" = feat/ten-animations ] || exit 1
node tools/update-sitemap.mjs && node tools/make-skill.mjs && ([ -f tools/make-famous.mjs ] && node tools/make-famous.mjs || true)
git grep -qE '^(<{7}|\|{7}|>{7})( |$)' && { echo "conflict markers left"; exit 1; }
git add -A && git commit -m "Merge feat/famous-effects into feat/ten-animations: it goes live with the ten new animations"
node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)"
```

Expected: `ℹ fail 0`. The coordinator starts the worktree's server as a background command (`cd $REPO/.claude/worktrees/ten-int && python -m http.server 8971 --bind 127.0.0.1`), then runs these two, each as its own background command, and waits on each with `node $RUN/wait-log.mjs <its log>` (again while it says `still running`):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-int || exit 1; mkdir -p $TEN/checks/take-in; node $RUN/slot.mjs run ten-take-in -- node tools/make-social-image.mjs --base http://127.0.0.1:8971 > $TEN/checks/take-in/social.log 2>&1; echo "EXIT=$?" >> $TEN/checks/take-in/social.log
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-int || exit 1; node $RUN/slot.mjs run ten-take-in -- node tools/check-pages.mjs --base http://127.0.0.1:8971 --out $TEN/checks/take-in home $( [ -d famous ] && echo famous ) > $TEN/checks/take-in/check.log 2>&1; echo "EXIT=$?" >> $TEN/checks/take-in/check.log
```

Expected: `EXIT=0` in both logs; six `ok   home …` lines (and six `ok   famous …` where it exists). If the image changed, commit it (`git add og-image.png && git commit -m "Draw the social image again after Famous effects' merge"`, in ten-int after the branch check). Then stop the server and `git -C $REPO worktree remove $REPO/.claude/worktrees/ten-int`. The ledger line comes after Step 4's, once the ledger exists: `<date time>  coord  took in feat/famous-effects at <commit>; it goes live with the rollout`.

- [ ] **Step 4: The run folder, its ledger and its four tools**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
mkdir -p $TEN/briefs $TEN/checks $TEN/reports
N=$(git -C $REPO show feat/ten-animations:animations/01-scroll-based/parallax-scrolling/index.html | grep -o 'demo-page\.css?v=[0-9]*' | grep -o '[0-9]*$')
printf '%s  coord  run folder ready; feat/ten-animations at %s; shared files ?v=%s; finder on the branch: %s; famous: %s; the plan was checked on d810bce with a copy of Phase 0 Tasks 2, 3, 4 and 6; since then on feat/see-inside-compare: %s\n' "$(date '+%F %H:%M')" "$(git -C $REPO rev-parse --short feat/ten-animations)" "$N" "$(git -C $REPO show feat/ten-animations:index.html | grep -c '^const FIND={')" "$(git -C $REPO show feat/ten-animations:tools/make-famous.mjs > /dev/null 2>&1 && echo yes || echo no)" "$(git -C $REPO log --oneline d810bce..feat/ten-animations | wc -l | tr -d ' ') commits ($(git -C $REPO diff --stat d810bce feat/ten-animations -- assets tools/check-pages.mjs tests | tail -1))" >> $TEN/ledger.md
tail -1 $TEN/ledger.md
```

Expected: one ledger line naming the cut commit, the version, the finder and Famous effects, and how far the branch has moved from the base this plan was checked on (the shared files, the page check and the tests); then, if Step 3a ran, its `took in` line and the owner's answer. Write these four files into `$TEN` exactly.

`$TEN/lanes.mjs`:

```js
// The ten lanes' data and the shared edits a lane makes (everything but its own folder and its preview), applied to a site
// root (a run-folder tool of the ten new animations, not part of the repository): node lanes.mjs <lane number> <root>.
// Counts become 167 and the section's count goes up by one, as in a lane; the first lane of a section gives the section's
// old last page its Next link.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const LIVE = 'https://matinmonshizadeh.github.io/animation-handbook/';
export const LANES = {
  1: { slug: 'ink-spread-reveal', cat: '02-entrance-and-exit', n: '02', no: '02.15', title: 'Ink Spread Reveal', catName: 'Entrance & Exit',
    lede: 'Ink drops spread and merge until the picture shows. Best for art and intros.', places: ['imgcard', 'intro'], pv: 'inkspread',
    last: 'shatter-effect', lastTitle: 'Shatter Effect', lastPv: 'shatter', first: true, count: 14, kind: 'once', find: ['card page', 'load scroll click', 'reveal grow'] },
  2: { slug: 'pixelate-transition', cat: '03-page-transitions', n: '03', no: '03.17', title: 'Pixelate Transition', catName: 'Page Transitions',
    lede: 'The page breaks into big pixels, then sharpens into the next. Best for galleries.', places: ['page', 'imgcard'], pv: 'pixelate',
    last: 'cube-transition', lastTitle: 'Cube Transition', lastPv: 'cubepage', first: true, count: 16, kind: 'do', find: ['page card', 'newpage click', 'pieces glitch'] },
  3: { slug: 'before-after-slider', cat: '04-micro-interactions', n: '04', no: '04.42', title: 'Before/After Slider', catName: 'Micro-Interactions',
    lede: 'Drag a line across two pictures to compare them. Best for photo edits.', places: ['imgcard'], pv: 'beforeafter',
    last: 'dynamic-island', lastTitle: 'Dynamic Island', lastPv: 'dynisland', first: true, count: 41, kind: 'do', find: ['card', 'drag', 'reveal slide'] },
  4: { slug: 'magnifier-lens', cat: '04-micro-interactions', n: '04', no: '04.43', title: 'Magnifier Lens', catName: 'Micro-Interactions',
    lede: 'A lens follows your pointer and shows the picture up close. Best for product photos.', places: ['imgcard'], pv: 'magnifier',
    last: 'dynamic-island', lastTitle: 'Dynamic Island', lastPv: 'dynisland', first: false, count: 41, kind: 'do', find: ['card', 'hover drag', 'follow grow'] },
  5: { slug: 'card-deck-swipe', cat: '04-micro-interactions', n: '04', no: '04.44', title: 'Card Deck Swipe', catName: 'Micro-Interactions',
    lede: 'Swipe the top card left or right; the next one rises. Best for quick choices.', places: ['imgcard'], pv: 'deckswipe',
    last: 'dynamic-island', lastTitle: 'Dynamic Island', lastPv: 'dynisland', first: false, count: 41, kind: 'do', find: ['card', 'drag click', 'slide turn'] },
  6: { slug: 'water-ripple', cat: '06-3d-advanced', n: '06', no: '06.27', title: 'Water Ripple', catName: '3D & Advanced',
    lede: 'Ripples spread from your finger and bend the picture below. Best for hero images.', places: ['bg', 'imgcard'], pv: 'waterripple',
    last: 'infinite-zoom', lastTitle: 'Infinite Zoom', lastPv: 'izoom', first: true, count: 26, kind: 'do', find: ['background card', 'drag click hover', 'wave'] },
  7: { slug: 'audio-visualizer', cat: '06-3d-advanced', n: '06', no: '06.28', title: 'Audio Visualizer', catName: '3D & Advanced',
    lede: 'Bars dance to the music, from bass to treble. Best for music players.', places: ['imgcard', 'bg'], pv: 'audioviz',
    last: 'infinite-zoom', lastTitle: 'Infinite Zoom', lastPv: 'izoom', first: false, count: 26, kind: 'loop', find: ['shape background', 'loop', 'bounce grow'] },
  8: { slug: 'ken-burns', cat: '07-ambient-background', n: '07', no: '07.24', title: 'Ken Burns Effect', catName: 'Ambient & Background',
    lede: 'Photos slowly zoom and pan, then fade into the next. Best for hero slideshows.', places: ['imgcard', 'bg', 'intro'], pv: 'kenburns',
    last: 'game-of-life', lastTitle: 'Game of Life', lastPv: 'life', first: true, count: 23, kind: 'loop', find: ['card background', 'loop load', 'grow slide fade'] },
  9: { slug: 'fire-effect', cat: '07-ambient-background', n: '07', no: '07.25', title: 'Fire Effect', catName: 'Ambient & Background',
    lede: 'Flames flicker and rise as heat climbs and cools. Best for game and event pages.', places: ['bg', 'intro'], pv: 'fire',
    last: 'game-of-life', lastTitle: 'Game of Life', lastPv: 'life', first: false, count: 23, kind: 'loop', find: ['background', 'loop', 'glitch color drift'] },
  10: { slug: 'lightning', cat: '07-ambient-background', n: '07', no: '07.26', title: 'Lightning', catName: 'Ambient & Background',
    lede: 'Jagged bolts strike from the clouds and light up the sky. Best for dramatic intros.', places: ['bg', 'intro'], pv: 'lightning',
    last: 'game-of-life', lastTitle: 'Game of Life', lastPv: 'life', first: false, count: 23, kind: 'loop', find: ['background shape', 'loop click', 'glitch color'] }
};
const NEXT_ICON = '<svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';
export const nextLink = (slug, title) => `<a href="../${slug}/" rel="next" aria-label="Next: ${title}"><span><span class="hb-dir">Next: </span>${title}</span>${NEXT_ICON}</a>`;

function edit(root, file, fn) {
  const p = join(root, file), s = readFileSync(p, 'utf8'), crlf = s.includes('\r\n');
  const t = fn(s.replace(/\r\n/g, '\n'));
  if (t === s.replace(/\r\n/g, '\n')) throw new Error(`${file}: nothing changed`);
  writeFileSync(p, crlf ? t.replace(/\n/g, '\r\n') : t);
}
function swap(s, from, to, what) {
  if (!s.includes(from)) throw new Error(`not found (${what}): ${from.slice(0, 120)}`);
  return s.replace(from, to);
}
const esc = s => s.replace(/'/g, "\\'");

export function apply(n, root, total = 167) {
  const L = LANES[n], was = 166;
  // A second run would add the card, PV key and PLACES row again: refuse, so the tree is put back first (git checkout -- .)
  if (readFileSync(join(root, 'index.html'), 'utf8').includes(`
      ['${L.slug}',`)) throw new Error(`lane ${n} is applied already here: put the worktree back with "git checkout -- ." and run again`);
  // Home page: the card, its places, its preview key, the counts
  edit(root, 'index.html', s => {
    const line = s.split('\n').find(l => l.startsWith(`      ['${L.last}',`));
    if (!line) throw new Error('CATS line of ' + L.last);
    s = swap(s, line + '\n', line + '\n' + `      ['${L.slug}','${esc(L.title)}','${esc(L.lede)}'],\n`, 'CATS');
    s = swap(s, `'${L.last}':'${L.lastPv}',`, `'${L.last}':'${L.lastPv}','${L.slug}':'${L.pv}',`, 'PV');
    const placeLine = s.split('\n').find(l => l.startsWith(`  '${L.last}':[`));
    const row = `  '${L.slug}':[${L.places.map(p => `'${p}'`).join(',')}]`;
    s = placeLine.endsWith(',') ? swap(s, placeLine + '\n', placeLine + '\n' + row + ',\n', 'PLACES')
      : swap(s, placeLine + '\n', placeLine + ',\n' + row + '\n', 'PLACES (last row)');
    s = s.split(`${was} Web Animation Techniques`).join(`${total} Web Animation Techniques`)
      .split(`visual reference of ${was} web animation techniques`).join(`visual reference of ${total} web animation techniques`)
      .replace(`${was} free animations · no coding needed`, `${total} free animations · no coding needed`)
      .replace(`Browse all ${was} animations`, `Browse all ${total} animations`)
      .replace(`All ${was} are still easy to reach`, `All ${total} are still easy to reach`)
      .replace(`<p class="foot-t">${was} web animations`, `<p class="foot-t">${total} web animations`);
    // The finder's row (what moved, when, how), after the section's old last page's row, where the finder is on the branch
    const findAt = s.indexOf('\nconst FIND={');
    if (findAt >= 0) {
      const findLine = s.slice(findAt).split('\n').find(l => l.startsWith(`  '${L.last}':[`));
      if (!findLine) throw new Error('FIND row of ' + L.last);
      const findRow = `  '${L.slug}':['${L.find.join("','")}']`;
      s = findLine.endsWith(',') ? swap(s, findLine + '\n', findLine + '\n' + findRow + ',\n', 'FIND')
        : swap(s, findLine + '\n', findLine + ',\n' + findRow + '\n', 'FIND (last row)');
    }
    return s;
  });
  // Root README: counts, the section's counts and the catalog line
  edit(root, 'README.md', s => {
    s = s.replace(`six of its ${was} web animation techniques`, `six of its ${total} web animation techniques`)
      .replace(`**A visual reference of ${was} web animation techniques`, `**A visual reference of ${total} web animation techniques`)
      .replace(`badge/techniques-${was}-`, `badge/techniques-${total}-`)
      .replace(`Here are ${was} web animation techniques`, `Here are ${total} web animation techniques`)
      .replace(`All ${was} techniques, each linked to its live demo.`, `All ${total} techniques, each linked to its live demo.`);
    const esName = L.catName;
    s = swap(s, `| ${L.n} | [${esName}](#${L.n}) | ${L.count} |`, `| ${L.n} | [${esName}](#${L.n}) | ${L.count + 1} |`, 'Categories row');
    s = swap(s, `### ${L.n} · ${esName} · ${L.count} techniques`, `### ${L.n} · ${esName} · ${L.count + 1} techniques`, 'heading');
    s = swap(s, `<details><summary>Browse all ${L.count} techniques in ${esName}</summary>`, `<details><summary>Browse all ${L.count + 1} techniques in ${esName}</summary>`, 'summary');
    const last = s.split('\n').find(l => l.startsWith(`- **[${L.lastTitle}](${LIVE}animations/${L.cat}/${L.last}/)**`));
    if (!last) throw new Error('README catalog line of ' + L.last);
    return swap(s, last + '\n', last + '\n' + `- **[${L.title}](${LIVE}animations/${L.cat}/${L.slug}/)** — ${L.lede}\n`, 'catalog');
  });
  // The category README: its list (and 06's Browser requirements, 07's Implementation summary)
  edit(root, `animations/${L.cat}/README.md`, s => {
    const lines = s.split('\n');
    const i = lines.findIndex(l => l.includes(`](${L.last}/)`));
    if (i < 0) throw new Error('category README line of ' + L.last);
    lines.splice(i + 1, 0, lines[i].startsWith('|') ? `| [${L.title}](${L.slug}/) | ${L.lede} |` : `- [${L.title}](${L.slug}/) — ${L.lede}`);
    s = lines.join('\n');
    if (L.slug === 'audio-visualizer') s = swap(s, '| SVG filter in backdrop-filter (Liquid Glass) |', '| Web Audio (Audio Visualizer) | Every modern browser; the sound starts only after Hear it is pressed, and the bars move without it |\n| SVG filter in backdrop-filter (Liquid Glass) |', 'browser row');
    if (L.slug === 'ken-burns') s = swap(s, 'breathing glow, scanline, wave layers |', 'breathing glow, scanline, wave layers, Ken Burns |', 'CSS keyframes row');
    if (L.slug === 'fire-effect') s = swap(s, 'light rays, game of life |', 'light rays, game of life, fire |', 'Canvas 2D row');
    if (L.slug === 'lightning') s = swap(s, 'light rays, game of life |', 'light rays, game of life, lightning |', 'Canvas 2D row');
    return s;
  });
  edit(root, '.github/ISSUE_TEMPLATE/config.yml', s => swap(s, `See all ${was} techniques`, `See all ${total} techniques`, 'config.yml'));
  edit(root, '404.html', s => swap(s, `>Browse all ${was} animations<`, `>Browse all ${total} animations<`, '404'));
  // The section's old last page gets its first Next link (the first lane of a section only)
  if (L.first) edit(root, `animations/${L.cat}/${L.last}/index.html`, s => {
    const pager = s.match(/<span class="hb-pager">([\s\S]*?)<\/a><\/span>/);
    if (!pager || pager[0].includes('rel="next"')) throw new Error('pager of ' + L.last);
    return s.replace(pager[0], pager[0].slice(0, -'</span>'.length) + nextLink(L.slug, L.title) + '</span>');
  });
}

if (process.argv[1] && process.argv[1].endsWith('lanes.mjs') && process.argv[2]) {
  apply(Number(process.argv[2]), process.argv[3]);
  console.log('lane', process.argv[2], 'shared edits applied to', process.argv[3]);
}
```

`$TEN/frametimes.mjs`:

```js
#!/usr/bin/env node
// Frame times of a demo page with Chrome's CPU slowed four times: a run-folder tool of the ten new animations, not part of the
// repository. It loads the page in headless Chrome at 1280×800 (or --phone: 375×812 at scale 2, as a phone), slows the CPU
// (--rate, default 4), starts the demo (a plays-once page: Loop off, then Replay; a do-it page: Show me; a loop: nothing, it
// moves; --press <selector> clicks that instead, after the start) and records the time between animation frames for --ms
// (default 4000) in each mode given with --modes (default normal; e.g. normal,inside,compare).
// Usage: node frametimes.mjs --base http://127.0.0.1:<port> [--phone] [--rate 4] [--ms 4000] [--modes normal,inside,compare]
//        [--press "<selector>"] <page folder>
// Prints, per mode: frames, the median and 95th-percentile frame time, and the share of frames slower than 20 ms (a frame
// missed at 60 Hz). Exit code 1 when Chrome cannot be started. Needs Node 22+ (WebSocket) and Chrome (CHROME to its path).
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2);
const opt = (name, fallback) => { const i = args.indexOf(name); if (i < 0) return fallback; const v = args[i + 1]; args.splice(i, 2); return v; };
const flag = name => { const i = args.indexOf(name); if (i < 0) return false; args.splice(i, 1); return true; };
const BASE = opt('--base', 'http://127.0.0.1:8961').replace(/\/$/, '');
const RATE = Number(opt('--rate', '4')), MS = Number(opt('--ms', '4000'));
const MODES = opt('--modes', 'normal').split(',');
const PRESS = opt('--press', '');
const PHONE = flag('--phone');
const page = (args[0] || '').replace(/\\/g, '/').replace(/^\.?\//, '').replace(/\/?(index\.html)?$/, '/');
if (!args[0]) { console.error('usage: node frametimes.mjs --base <url> [--phone] [--rate 4] [--ms 4000] [--modes …] [--press <selector>] <page folder>'); process.exit(2); }
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const profile = mkdtempSync(join(tmpdir(), 'hb-chrome-'));
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
chrome.once('error', err => { console.error(`Could not start Chrome at ${CHROME}: ${err.message}`); process.exit(1); });
const done = async code => {
  try { ws && ws.close(); } catch {}
  chrome.kill();
  if (process.platform === 'win32') {
    try { execFileSync('powershell', ['-NoProfile', '-NonInteractive', '-Command', `Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.CommandLine -and $_.CommandLine.Contains($env:HB_PROFILE) } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }`], { stdio: 'ignore', timeout: 20000, env: { ...process.env, HB_PROFILE: profile } }); } catch {}
  }
  for (const end = Date.now() + 10000; Date.now() < end; await sleep(200)) { try { rmSync(profile, { recursive: true, force: true }); break; } catch {} }
  process.exit(code);
};
let ws, id = 0;
const pending = new Map();
const send = (method, params = {}) => new Promise((resolve, reject) => { const n = ++id; pending.set(n, m => m.error ? reject(new Error(m.error.message)) : resolve(m.result)); ws.send(JSON.stringify({ id: n, method, params })); });
const evaluate = async expression => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.value;
try {
  let url = null;
  for (let i = 0; i < 100 && !url; i++) {
    const f = join(profile, 'DevToolsActivePort');
    if (existsSync(f)) { try { const port = readFileSync(f, 'utf8').split('\n')[0].trim(); const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); url = (list.find(t => t.type === 'page') || {}).webSocketDebuggerUrl; } catch {} }
    if (!url) await sleep(100);
  }
  if (!url) throw new Error('Chrome did not answer');
  ws = new WebSocket(url);
  await new Promise((res, rej) => { ws.addEventListener('open', res, { once: true }); ws.addEventListener('error', rej, { once: true }); });
  ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', PHONE ? { width: 375, height: 812, deviceScaleFactor: 2, mobile: true } : { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: `${BASE}/${page}` });
  await sleep(3000);
  await send('Emulation.setCPUThrottlingRate', { rate: RATE });
  const kind = await evaluate(`document.body.dataset.hbKind`);
  console.log(`${page} (${kind}) at ${PHONE ? '375×812, scale 2' : '1280×800'}, CPU slowed ${RATE} times, ${MS} ms per mode`);
  for (const mode of MODES) {
    await evaluate(`(() => { const b = document.querySelector('.hb-modes [data-hb-mode="${mode}"]'); if (b) b.click(); })()`);
    await sleep(400);
    // Start the demo in this mode: a plays-once page replays (Loop off first), a do-it page runs Show me, a loop moves already.
    await evaluate(`(() => {
      const loop = document.querySelector('[data-hb-loop]'); if (loop && loop.checked) loop.click();
      const p = document.querySelector('[data-hb-pause]'); if (p && p.getAttribute('data-state') === 'paused') p.click();
      const start = document.querySelector('[data-hb-replay]') || document.querySelector('[data-hb-demo]'); if (start) start.click();
      ${PRESS ? `const extra = document.querySelector(${JSON.stringify(PRESS)}); if (extra) extra.click();` : ''}
    })()`);
    const t = await evaluate(`new Promise(done => { const times = []; const end = performance.now() + ${MS};
      const step = now => { times.push(now); if (now < end) requestAnimationFrame(step); else done(times); }; requestAnimationFrame(step); })`);
    const d = t.slice(1).map((v, i) => v - t[i]).sort((a, b) => a - b);
    const at = q => d[Math.min(d.length - 1, Math.floor(q * d.length))];
    const slow = d.filter(v => v > 20).length;
    console.log(`  ${mode.padEnd(8)} ${String(d.length).padStart(4)} frames · median ${at(.5).toFixed(1)} ms · 95% ${at(.95).toFixed(1)} ms · ${(100 * slow / Math.max(1, d.length)).toFixed(0)}% slower than 20 ms`);
    await sleep(300);
  }
  await done(0);
} catch (err) { console.error(err.message); await done(1); }
```

`$TEN/resolve.mjs`:

```js
#!/usr/bin/env node
// Resolves the conflicts left when a ten-animations lane is merged into a branch that already holds an earlier lane of the
// same section (a run-folder tool of the ten new animations, not part of the repository). Every conflict keeps both sides,
// the earlier lane's first (ours), then the later lane's (theirs): two lines added at the same place (a card, a PLACES row,
// a preview, a catalog line, a table row) become both lines. Where both lanes changed the same single line by adding to it
// (the PV keys, the STILL points, a row of 07's Implementation summary), the line keeps both additions, ours first. Anything
// else is left in place and named, for a person to resolve, and so is a conflict that shows no base: the merge must be made
// with the diff3 conflict style, for that one command only (never set in the repository's shared config):
//   git -c merge.conflictStyle=diff3 merge --no-ff <lane branch>
// Usage: node resolve.mjs <file>...   (in the worktree, after the merge stopped on conflicts; then `git add` the files)
import { readFileSync, writeFileSync } from 'node:fs';

const START = /^<{7}( |$)/, BASE = /^\|{7}( |$)/, MID = /^={7}$/, END = /^>{7}( |$)/;

// The longest ending the three lines share, so that what each side added in the middle can be put together
function sharedEnd(a, b, c) {
  let n = 0;
  while (n < a.length && n < b.length && n < c.length && a[a.length - 1 - n] === b[b.length - 1 - n] && b[b.length - 1 - n] === c[c.length - 1 - n]) n++;
  return n;
}
// One conflict, settled by keeping both sides (ours first); null when the rules below do not cover it
function settle(ours, base, theirs) {
  if (!base.length) return [...ours, ...theirs];
  // Changes to the same lines, or to lines side by side: line by line, a line one side left alone takes the other side's,
  // and a line both changed keeps both additions
  if (ours.length === base.length && theirs.length === base.length) {
    const out = [];
    for (let i = 0; i < base.length; i++) {
      const [b, o, t] = [base[i], ours[i], theirs[i]];
      const one = o === b ? t : t === b || t === o ? o : joinLine(b, o, t);
      if (one === null) return null;
      out.push(one);
    }
    return out;
  }
  // The same change to the base's lines on both sides, then lines added by each: 07's last PLACES row gets its comma on both
  // sides, then each side's row; ours, now no longer the last row of the list, gets its comma too
  let k = 0;
  while (k < ours.length && k < theirs.length && ours[k] === theirs[k]) k++;
  if (!k || k < base.length) return null;
  const mine = [...ours];
  if (mine.length > k && theirs.length > k && ours[k - 1].endsWith(',') && !mine[mine.length - 1].endsWith(',')) mine[mine.length - 1] += ',';
  return [...mine, ...theirs.slice(k)];
}
// One line both sides added to: the base's start and end, with ours' addition, then theirs'
function joinLine(b, o, t) {
  const n = sharedEnd(b, o, t), head = b.slice(0, b.length - n), tail = b.slice(b.length - n);
  return o.startsWith(head) && t.startsWith(head) && o.endsWith(tail) && t.endsWith(tail)
    ? head + o.slice(head.length, o.length - n) + t.slice(head.length, t.length - n) + tail : null;
}

let left = 0;
for (const file of process.argv.slice(2)) {
  const raw = readFileSync(file, 'utf8'), crlf = raw.includes('\r\n'), lines = raw.replace(/\r\n/g, '\n').split('\n'), out = [];
  let solved = 0, open = 0;
  for (let i = 0; i < lines.length; i++) {
    if (!START.test(lines[i])) { out.push(lines[i]); continue; }
    const ours = [], base = [], theirs = [];
    let j = i + 1, part = ours, sawBase = false;
    for (; j < lines.length && !END.test(lines[j]); j++) {
      if (BASE.test(lines[j])) { part = base; sawBase = true; }
      else if (MID.test(lines[j])) part = theirs;
      else part.push(lines[j]);
    }
    // without the base section an addition cannot be told from a change: that conflict is a person's
    const done = sawBase ? settle(ours, base, theirs) : null;
    if (done) { out.push(...done); solved++; } else { out.push(...lines.slice(i, j + 1)); open++; }
    i = j;
  }
  writeFileSync(file, crlf ? out.join('\n').replace(/\n/g, '\r\n') : out.join('\n'));
  console.log(`${file}: ${solved} resolved${open ? `, ${open} left for a person` : ''}`);
  left += open;
}
process.exit(left ? 1 : 0);
```

`$TEN/integrate.mjs`:

```js
#!/usr/bin/env node
// The integration's own edits, once the ten lanes are merged (a run-folder tool of the ten new animations, not part of the
// repository): the split sections linked (04: Before/After Slider, Magnifier Lens, Card Deck Swipe; 06: Water Ripple, Audio
// Visualizer; 07: Ken Burns Effect, Fire Effect, Lightning), every written count 176 and each section's count, the test
// entries, the finder's rows and its case 9 (only where the finder is on the branch), a See also line on the closest pages,
// the CHANGELOG line, and the ten pages' shared-file version set to the one the other pages use.
// Usage: node integrate.mjs <root> [--finder-check]   Each edit says what it did; an edit already made is skipped and said so.
// --finder-check, for Task 0 on a scratch copy of the finder only: the ten cards, the finder's rows and its case 9.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { LANES } from './lanes.mjs';

const root = process.argv[2], FINDER_CHECK = process.argv.includes('--finder-check');
if (!root || root.startsWith('--')) { console.error('usage: node integrate.mjs <root> [--finder-check]'); process.exit(2); }
const said = [];
function edit(file, fn) {
  const p = join(root, file), raw = readFileSync(p, 'utf8'), crlf = raw.includes('\r\n'), s = raw.replace(/\r\n/g, '\n'), t = fn(s);
  if (t !== s) writeFileSync(p, crlf ? t.replace(/\n/g, '\r\n') : t);
}
function swap(s, from, to, what) {
  if (s.includes(to) && !s.includes(from)) { said.push(`already: ${what}`); return s; }
  if (!s.includes(from)) throw new Error(`not found (${what}): ${from.slice(0, 140)}`);
  said.push(what);
  return s.split(from).join(to);
}
const PAGES = ['02-entrance-and-exit/ink-spread-reveal', '03-page-transitions/pixelate-transition', '04-micro-interactions/before-after-slider',
  '04-micro-interactions/magnifier-lens', '04-micro-interactions/card-deck-swipe', '06-3d-advanced/water-ripple', '06-3d-advanced/audio-visualizer',
  '07-ambient-background/ken-burns', '07-ambient-background/fire-effect', '07-ambient-background/lightning'];

// The split sections: each later page's Previous points to the page before it, which gets its Next link
const ICON_PREV = '<svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
const ICON_NEXT = '<svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';
const prev = (slug, title) => `<a href="../${slug}/" rel="prev" aria-label="Previous: ${title}">${ICON_PREV}<span><span class="hb-dir">Previous: </span>${title}</span></a>`;
const next = (slug, title) => `<a href="../${slug}/" rel="next" aria-label="Next: ${title}"><span><span class="hb-dir">Next: </span>${title}</span>${ICON_NEXT}</a>`;
function links() {
  const CHAINS = [
    ['04-micro-interactions', ['dynamic-island', 'Dynamic Island'], [['before-after-slider', 'Before/After Slider'], ['magnifier-lens', 'Magnifier Lens'], ['card-deck-swipe', 'Card Deck Swipe']]],
    ['06-3d-advanced', ['infinite-zoom', 'Infinite Zoom'], [['water-ripple', 'Water Ripple'], ['audio-visualizer', 'Audio Visualizer']]],
    ['07-ambient-background', ['game-of-life', 'Game of Life'], [['ken-burns', 'Ken Burns Effect'], ['fire-effect', 'Fire Effect'], ['lightning', 'Lightning']]]];
  for (const [cat, old, pages] of CHAINS) for (let i = 1; i < pages.length; i++) {
    const [a, b] = [pages[i - 1], pages[i]], before = i === 1 ? old : pages[i - 2];
    edit(`animations/${cat}/${b[0]}/index.html`, s => swap(s, prev(...old), prev(...a), `${b[1]}: Previous is ${a[1]}`));
    edit(`animations/${cat}/${a[0]}/index.html`, s => swap(s, `${prev(...before)}</span>`, `${prev(...before)}${next(...b)}</span>`, `${a[1]}: Next is ${b[1]}`));
  }
}

// Every written count 176, and each section's count
function counts() {
  const [WAS, NOW] = [167, 176];
  edit('index.html', s => {
    for (const [a, b] of [[`${WAS} Web Animation Techniques`, `${NOW} Web Animation Techniques`], [`visual reference of ${WAS} web animation techniques`, `visual reference of ${NOW} web animation techniques`],
      [`${WAS} free animations · no coding needed`, `${NOW} free animations · no coding needed`], [`Browse all ${WAS} animations`, `Browse all ${NOW} animations`],
      [`All ${WAS} are still easy to reach`, `All ${NOW} are still easy to reach`], [`<p class="foot-t">${WAS} web animations`, `<p class="foot-t">${NOW} web animations`]]) s = swap(s, a, b, `home: ${b}`);
    return s;
  });
  const SECTIONS = [['04', 'Micro-Interactions', 42, 44], ['06', '3D & Advanced', 27, 28], ['07', 'Ambient & Background', 24, 26]];
  edit('README.md', s => {
    for (const [a, b] of [[`six of its ${WAS} web animation techniques`, `six of its ${NOW} web animation techniques`], [`**A visual reference of ${WAS} web animation techniques`, `**A visual reference of ${NOW} web animation techniques`],
      [`badge/techniques-${WAS}-`, `badge/techniques-${NOW}-`], [`Here are ${WAS} web animation techniques`, `Here are ${NOW} web animation techniques`],
      [`All ${WAS} techniques, each linked to its live demo.`, `All ${NOW} techniques, each linked to its live demo.`]]) s = swap(s, a, b, `README: ${b}`);
    for (const [n, name, was, now] of SECTIONS) {
      s = swap(s, `| ${n} | [${name}](#${n}) | ${was} |`, `| ${n} | [${name}](#${n}) | ${now} |`, `README: ${n} has ${now} in the Categories table`);
      s = swap(s, `### ${n} · ${name} · ${was} techniques`, `### ${n} · ${name} · ${now} techniques`, `README: ${n} heading says ${now}`);
      s = swap(s, `<details><summary>Browse all ${was} techniques in ${name}</summary>`, `<details><summary>Browse all ${now} techniques in ${name}</summary>`, `README: ${n} summary says ${now}`);
    }
    return s;
  });
  edit('.github/ISSUE_TEMPLATE/config.yml', s => swap(s, `See all ${WAS} techniques`, `See all ${NOW} techniques`, `config.yml: ${NOW}`));
  edit('404.html', s => swap(s, `>Browse all ${WAS} animations<`, `>Browse all ${NOW} animations<`, `404: ${NOW}`));
}

// The test entries: the four pages played with the pointer can be played from the keyboard; Audio Visualizer's phone default
function tests() {
  edit('tests/pages.test.js', s => {
    s = s.replace(/^(  '04-micro-interactions': \[[^\]\n]*?)(\])/m, (m, a, b) => a.includes('before-after-slider') ? (said.push('already: KEYBOARD_PAGES 04'), m) : (said.push('KEYBOARD_PAGES 04'), `${a}, 'before-after-slider', 'magnifier-lens', 'card-deck-swipe'${b}`));
    s = s.replace(/^(  '06-3d-advanced': \[[^\]\n]*?)(\])/m, (m, a, b) => a.includes('water-ripple') ? (said.push('already: KEYBOARD_PAGES 06'), m) : (said.push('KEYBOARD_PAGES 06'), `${a}, 'water-ripple'${b}`));
    return s.includes(`'audio-visualizer': ['bars-seg', 'Some']`) ? (said.push('already: PHONE_DEFAULTS'), s)
      : swap(s, `const PHONE_DEFAULTS = { `, `const PHONE_DEFAULTS = { 'audio-visualizer': ['bars-seg', 'Some'], `, 'PHONE_DEFAULTS');
  });
}

// The finder's rows (what moved, when, how), each after its section's old last page, in CATS order, and its case 9
const FIND = [['shatter-effect', [['ink-spread-reveal', 'card page', 'load scroll click', 'reveal grow']]],
  ['cube-transition', [['pixelate-transition', 'page card', 'newpage click', 'pieces glitch']]],
  ['dynamic-island', [['before-after-slider', 'card', 'drag', 'reveal slide'], ['magnifier-lens', 'card', 'hover drag', 'follow grow'], ['card-deck-swipe', 'card', 'drag click', 'slide turn']]],
  ['infinite-zoom', [['water-ripple', 'background card', 'drag click hover', 'wave'], ['audio-visualizer', 'shape background', 'loop', 'bounce grow']]],
  ['game-of-life', [['ken-burns', 'card background', 'loop load', 'grow slide fade'], ['fire-effect', 'background', 'loop', 'glitch color drift'], ['lightning', 'background shape', 'loop click', 'glitch color']]]];
const row = ([slug, what, when, how]) => `  '${slug}':['${what}','${when}','${how}']`;
function finder() {
  edit('index.html', s => {
    const at = s.indexOf('\nconst FIND={');
    if (at < 0) { said.push('FIND is not on this branch: its ten rows go in the ledger (listed below)'); return s; }
    const end = s.indexOf('\n};', at);
    let block = s.slice(at, end);
    for (const [last, rows] of FIND) {
      const line = block.split('\n').find(l => l.startsWith(`  '${last}':[`));
      if (!line) throw new Error(`FIND row of ${last} not found`);
      const missing = rows.filter(r => !block.includes(`\n  '${r[0]}':[`));
      if (!missing.length) { said.push(`already: FIND rows after ${last}`); continue; }
      if (missing.length < rows.length) throw new Error(`FIND after ${last} has some of its new rows: add ${missing.map(r => r[0]).join(', ')} by hand, in CATS order`);
      const lastRow = !line.endsWith(',');
      block = block.replace(line, (lastRow ? line + ',' : line) + '\n' + rows.map(row).join(',\n') + (lastRow ? '' : ','));
      said.push(`FIND rows after ${last}`);
    }
    return s.slice(0, at) + block + s.slice(end);
  });
  if (existsSync(join(root, 'tests/finder.test.js'))) edit('tests/finder.test.js', s => swap(s, `[9, 'page', 'click', '', ['Circle Reveal', 'Overlay Wipe', 'Portal / Tunnel Zoom']],`,
    `[9, 'page', 'click', '', ['Circle Reveal', 'Overlay Wipe', 'Portal / Tunnel Zoom', 'Ink Spread Reveal']],`, 'finder case 9 takes Ink Spread Reveal'));
}

// For the finder's check on a scratch copy only (Task 0): the ten cards in CATS, each after the card before it in its section,
// and, where a page is not there yet, a stand-in that says its kind (the finder's tests read each page's kind)
function cards() {
  for (const L of Object.values(LANES)) {
    const dir = join(root, 'animations', L.cat, L.slug);
    if (existsSync(join(dir, 'index.html'))) continue;
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), `<!DOCTYPE html>\n<html lang="en"><body class="hb" data-hb-kind="${L.kind}"></body></html>\n`);
    said.push(`stand-in page ${L.slug} (${L.kind})`);
  }
  edit('index.html', s => {
    const after = {};
    for (const L of Object.values(LANES)) {
      if (s.includes(`\n      ['${L.slug}',`)) { said.push(`already: card ${L.slug}`); after[L.cat] = L.slug; continue; }
      const line = s.split('\n').find(l => l.startsWith(`      ['${after[L.cat] || L.last}',`));
      if (!line) throw new Error(`CATS line of ${after[L.cat] || L.last}`);
      s = s.replace(line + '\n', `${line}\n      ['${L.slug}','${L.title}','${L.lede}'],\n`);
      after[L.cat] = L.slug;
      said.push(`card ${L.slug}`);
    }
    return s;
  });
}

// A See also line on the closest existing pages (nine page READMEs, one line each, as the coordination file's map says), and
// between the new pages where they are close, at the end of each See also
function seeAlso() {
  const SEE = [['02-entrance-and-exit/clip-path-reveal', '- [Ink Spread Reveal](../ink-spread-reveal/) — blots of ink spread and merge to uncover a picture'],
    ['03-page-transitions/dissolve', '- [Pixelate Transition](../pixelate-transition/) — the page breaks into big pixels, then sharpens into the next'],
    ['04-micro-interactions/spotlight-hover', '- [Magnifier Lens](../magnifier-lens/) — a lens follows the pointer and shows the picture up close'],
    ['04-micro-interactions/swipe-to-dismiss', '- [Card Deck Swipe](../card-deck-swipe/) — the top card of a pile goes left or right and the next one rises'],
    ['07-ambient-background/ambient-ripple', '- [Water Ripple](../../06-3d-advanced/water-ripple/) — ripples from a finger spread and bend the picture below'],
    ['07-ambient-background/abstract-geometric-motion', '- [Audio Visualizer](../../06-3d-advanced/audio-visualizer/) — bars that move to the music, from bass to treble'],
    ['06-3d-advanced/infinite-zoom', '- [Ken Burns Effect](../../07-ambient-background/ken-burns/) — photos slowly zoom and pan, then fade into the next'],
    ['07-ambient-background/fireworks', '- [Fire Effect](../fire-effect/) — flames flicker and rise as heat climbs and cools'],
    ['07-ambient-background/snow-rain', '- [Lightning](../lightning/) — jagged bolts strike from the clouds and light up the sky'],
    ['04-micro-interactions/before-after-slider', '- [Magnifier Lens](../magnifier-lens/) — a lens follows the pointer and shows the picture up close'],
    ['04-micro-interactions/magnifier-lens', '- [Before/After Slider](../before-after-slider/) — a line dragged across two pictures uncovers one over the other'],
    ['07-ambient-background/fire-effect', '- [Lightning](../lightning/) — jagged bolts strike from the clouds and light up the sky'],
    ['07-ambient-background/lightning', '- [Fire Effect](../fire-effect/) — flames flicker and rise as heat climbs and cools'],
    ['07-ambient-background/fire-effect', '- [Water Ripple](../../06-3d-advanced/water-ripple/) — a grid of water heights that steps at a fixed rate, as the heat does here'],
    ['06-3d-advanced/water-ripple', '- [Fire Effect](../../07-ambient-background/fire-effect/) — a grid of heat values that steps at a fixed rate, as the water does here']];
  for (const [page, line] of SEE) edit(`animations/${page}/README.md`, s => {
    if (s.includes(line)) { said.push(`already: See also in ${page}`); return s; }
    const lines = s.split('\n'), h = lines.findIndex(l => l === '## See also');
    if (h < 0) throw new Error(`no See also in ${page}`);
    let k = h + 1;
    while (k < lines.length && !lines[k].startsWith('## ')) k++;
    while (k > h + 1 && !lines[k - 1].trim()) k--;
    lines.splice(k, 0, line);
    said.push(`See also in ${page}`);
    return lines.join('\n');
  });
}

// The CHANGELOG's line, first under Unreleased
function changelog() {
  const LOG = '- Ten new animations, 176 in all, each with See inside and Compare from the start: Ink Spread Reveal, Pixelate Transition,\n  Before/After Slider, Magnifier Lens, Card Deck Swipe, Water Ripple, Audio Visualizer, Ken Burns Effect, Fire Effect and Lightning.';
  edit('CHANGELOG.md', s => s.includes(LOG) ? (said.push('already: CHANGELOG'), s) : swap(s, '## Unreleased\n\n', `## Unreleased\n\n${LOG}\n`, 'CHANGELOG'));
}

// The ten pages link the shared files with the version the other pages use
function version() {
  const ref = readFileSync(join(root, 'animations/01-scroll-based/parallax-scrolling/index.html'), 'utf8').match(/demo-page\.css\?v=(\d+)/)[1];
  for (const p of PAGES) edit(`animations/${p}/index.html`, s => {
    const t = s.replace(/(demo-page\.(?:css|js)\?v=)\d+/g, `$1${ref}`);
    said.push(t === s ? `already: ${p} at ?v=${ref}` : `${p} now at ?v=${ref}`);
    return t;
  });
}

for (const step of FINDER_CHECK ? [cards, finder] : [links, counts, tests, finder, seeAlso, changelog, version]) step();
for (const line of said) console.log(line);
if (said.some(l => l.startsWith('FIND is not'))) for (const [, rows] of FIND) for (const r of rows) console.log(row(r) + ',');
```

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations; for f in lanes frametimes resolve integrate; do node --check $TEN/$f.mjs && echo "$f ok"; done`
Expected: `lanes ok`, `frametimes ok`, `resolve ok`, `integrate ok`.

- [ ] **Step 5: Try every lane's shared edits on its own scratch export, and the tests on one (outside the repository)**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
S=$(mktemp -d)/scratch-lanes
for n in 1 2 3 4 5 6 7 8 9 10; do rm -rf $S; mkdir -p $S; git -C $REPO archive feat/ten-animations | tar -x -C $S; node $TEN/lanes.mjs $n $S || echo "lane $n FAILED"; done
rm -rf $S; mkdir -p $S; git -C $REPO archive feat/ten-animations | tar -x -C $S; node $TEN/lanes.mjs 3 $S
cd $S || exit 1; node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)" | head -10
cd /tmp && rm -rf $S
```

Expected: ten lines `lane <n> shared edits applied to …` and no `FAILED`; then, for lane 3, exactly seven failing tests: `make-famous: on the real home page every card builds, but the eight whose previews need a script or animate in SVG` (Famous effects': the card has no preview until the lane's Step 4), `the answers keep the rules every page of a kind shares: transitions answer newpage, loops loop, scroll pages scroll` (the finder's: its rules read each page's kind, and the page is not there yet), `04-micro-interactions/dynamic-island uses the guided-steps page correctly` (its new Next link opens a page that is not there yet), `the Full catalog in the root README lists every card once, in home order, linked to its live page`, `the counts written in the issue template, the 404 page and the sitemap match the cards`, `the skill and llms.txt are what tools/make-skill.mjs writes from the pages and the home page now`, and `llms.txt lists every card once, in the order of CATS, with its live address and its description, and links the skill files`; `ℹ fail 7` (Task 0's run on `feat/ten-animations` at `ece2689`, the finder and Famous effects there: the branch alone 1705 pass, 0 fail; with lane 3's edits 1698 pass, 7 fail). A lane that gives no Next link has the other six. A `FAILED` lane names the anchor that no longer matches: the coordinator fixes it in `$TEN/lanes.mjs` (no one else edits the tool) and runs this step again.

- [ ] **Step 6: Check the ten finder rows (a fresh agent; nothing committed)**

The rows, by the finder spec's section 3 rules, from the ten-animations spec: Ink Spread Reveal `card page` · `load scroll click` · `reveal grow`; Pixelate Transition `page card` · `newpage click` · `pieces glitch`; Before/After Slider `card` · `drag` · `reveal slide`; Magnifier Lens `card` · `hover drag` · `follow grow`; Card Deck Swipe `card` · `drag click` · `slide turn`; Water Ripple `background card` · `drag click hover` · `wave`; Audio Visualizer `shape background` · `loop` · `bounce grow`; Ken Burns Effect `card background` · `loop load` · `grow slide fade`; Fire Effect `background` · `loop` · `glitch color drift`; Lightning `background shape` · `loop click` · `glitch color`. Dispatch a fresh agent (strongest model) with the finder spec (`docs/superpowers/specs/2026-10-13-animation-finder-design.md`, section 3) and these rows; it reads each page's section of the ten-animations spec, checks every answer against section 3's rules, then runs:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
F=$(git -C $REPO show feat/ten-animations:index.html | grep -q '^const FIND={' && echo feat/ten-animations || echo feat/animation-finder)
S=$(mktemp -d)/scratch-finder; mkdir -p $S
git -C $REPO archive $F | tar -x -C $S
node $TEN/integrate.mjs $S --finder-check
cd $S || exit 1; node --test tests/finder.test.js 2>&1 | grep -E "^ℹ (pass|fail)|^✖|case 9 \("
cd /tmp && rm -rf $S
```

Expected: ten `stand-in page …` lines (the finder's tests read each page's kind, and the pages are not there yet), ten `card …` lines, five `FIND rows after …` lines and `finder case 9 takes Ink Spread Reveal`; then the case 9 diagnostic and `ℹ fail 0` (this plan's run on `feat/animation-finder` at `80f18fc`: 37 pass, 0 fail; case 9's best right answer Overlay Wipe at 8). The agent writes its verdict to `$TEN/reports/finder-rows.md` (first line `RESULT: rows as planned` or `RESULT: changes <count>`, then each corrected row with the rule that corrects it); the coordinator puts a corrected row into `$TEN/lanes.mjs` (the lane's `find`) and `$TEN/integrate.mjs` (`FIND`) before Step 7, and writes the ledger line.

- [ ] **Step 7: Ten worktrees, one branch each**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
for n in 1 2 3 4 5 6 7 8 9 10; do git -C $REPO worktree add -b ten/L$n $REPO/.claude/worktrees/ten-L$n feat/ten-animations; done
git -C $REPO worktree list | grep -c 'ten-L'
```

Expected: ten `Preparing worktree (new branch 'ten/L<n>')` messages, then `10`.

- [ ] **Step 8: Briefs, servers and dispatch**

For each lane write `$TEN/briefs/L<n>.md`: "Carry out Task <n> of `docs/superpowers/plans/2026-10-14-ten-new-animations.md` (the main checkout's copy) in `$REPO/.claude/worktrees/ten-L<n>`, served on port `<8960+n>` by the coordinator. First read CLAUDE.md, the plan's Global Constraints, your page's section of `docs/superpowers/specs/2026-10-13-ten-new-animations-design.md`, `$RUN/lessons.md`, `$RUN/briefs/RULINGS.md`, `$RUN/brief-rulings.md`, `$RUN/briefs/OPEN-QUESTIONS.md` and, once it holds the owner's verdict, `$RUN/rulings-159.md`. Write only in your worktree, `$TEN/checks/L<n>/` and `$TEN/reports/L<n>/` (a shared-file need goes in your report; the coordinator passes it on); start no agents; never open the browser pane; never use `git stash` or `git config`. The shared-file version is `?v=<N from the ledger>`. Write your report as the task's last step says and reply in at most three lines." Before dispatching a lane's builder, the coordinator starts its server as a background command, `cd $REPO/.claude/worktrees/ten-L<n> && python -m http.server <8960+n> --bind 127.0.0.1`, and keeps it until the lane is approved (and again for a later fix round). Dispatch builders (strongest model) by the rollout's seat count, `seats = 20 − running − 1`, reviews and fix rounds of any lane before a new builder, new lanes taking turns with the rollout's new pages; while the pool has been full for 20 minutes with runs waiting, start no new builder that round. Ledger line per dispatch: `… L<n>  builder dispatched`.

---

## The lanes

Each lane task below is complete in itself: its builder needs no other task. The pages' code is the code that passed the checks; keep it as it is unless a step's check or the review asks for a change.

---

### Task 1: L1 · 02.15 Ink Spread Reveal (`ten/L1`, port 8961)

Plays once · step 1 "Watch it" · player bar: Replay, Loop and Slow motion (`data-hb-slowmo="css"`: the shared script slows every animation in the stage). See inside: the picture faint under the paper, each blot a numbered window growing to its dashed outline, the ink edge a ring just ahead. Compare: "Clean circles" (a copy whose drops grow round and neat) beside "Ink blots". Spec: "1 · Ink Spread Reveal (02.15)" in `docs/superpowers/specs/2026-10-13-ten-new-animations-design.md`.

**Files:**
- Create: `animations/02-entrance-and-exit/ink-spread-reveal/index.html` (360 lines), `animations/02-entrance-and-exit/ink-spread-reveal/README.md`
- Modify (by `$TEN/lanes.mjs 1`): `index.html` (the card after Shatter Effect's, the `PV` key, the `PLACES` row, the `FIND` row (the finder is on the branch), every count 166 → 167), `README.md` (counts, 02's count 14 → 15, the catalog line), `animations/02-entrance-and-exit/README.md` (its line), `.github/ISSUE_TEMPLATE/config.yml`, `404.html`, `animations/02-entrance-and-exit/shatter-effect/index.html` (its first Next link, to Ink Spread Reveal)
- Modify (Step 4, by hand): `index.html`: the preview's CSS at the end of the 02 bespoke block, `case 'inkspread':` in `pvMarkup()`
- Regenerate: `sitemap.xml`, `llms.txt`, `skills/animation-handbook/` (their tools)
- Test: `tests/*.test.js`; the page check of the new page, of Shatter Effect and of the home page; the review kit's short screens, a gallery for the defaults and for each other choice in Try it, clips of the defaults and of the timing settings' choices; frame times
- Write (run folder): `$TEN/checks/L1/` (logs, screenshots, kit output), `$TEN/reports/L1/build.md`, `fix-<k>.md`; the reviewer `review-<k>.md`

**Interfaces:**
- Consumes: Task 0's worktree `.claude/worktrees/ten-L1` on `ten/L1`, its server on port 8961 (started and stopped by the coordinator), `$TEN/lanes.mjs`, `$TEN/frametimes.mjs`, the shared-file version N in the ledger; Phase 0's shared files, its mode press (the shared script presses Replay after See inside or Compare) and its page check; the rollout's review kit and wait tool.
- Produces: branch `ten/L1`: the card `['ink-spread-reveal','Ink Spread Reveal','Ink drops spread and merge until the picture shows. Best for art and intros.']` (02.15), `PV` key `'ink-spread-reveal':'inkspread'`, `PLACES` `['imgcard','intro']`, `FIND` `'ink-spread-reveal':['card page','load scroll click','reveal grow']`; Previous: Shatter Effect (final), and Shatter Effect's Next link to Ink Spread Reveal; no Next link yet. The reports in `$TEN/reports/L1/`, which the rollout's final review (part 9) reads too.

- [ ] **Step 1: The lane's shared edits (the failing tests)**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L1 || exit 1
node $TEN/lanes.mjs 1 .
git status --short
node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)" | head -10
```

Expected: `lane 1 shared edits applied to .`; then ` M .github/ISSUE_TEMPLATE/config.yml`, ` M 404.html`, ` M README.md`, ` M animations/02-entrance-and-exit/README.md`, ` M animations/02-entrance-and-exit/shatter-effect/index.html`, ` M index.html`; then these 7 failing tests and `ℹ fail 7`: `✖ make-famous: on the real home page every card builds, but the eight whose previews need a script or animate in SVG`, `✖ the answers keep the rules every page of a kind shares: transitions answer newpage, loops loop, scroll pages scroll`, `✖ 02-entrance-and-exit/shatter-effect uses the guided-steps page correctly`, `✖ the Full catalog in the root README lists every card once, in home order, linked to its live page`, `✖ the counts written in the issue template, the 404 page and the sitemap match the cards`, `✖ the skill and llms.txt are what tools/make-skill.mjs writes from the pages and the home page now`, `✖ llms.txt lists every card once, in the order of CATS, with its live address and its description, and links the skill files`. (Famous effects' test builds every card's preview, which Step 4 adds; the finder's reads each page's kind, and Shatter Effect's new Next link opens a page that is not there yet; this plan's run of every lane on a copy of `feat/ten-animations` at `ece2689`, the finder and Famous effects there, gave exactly these.) If `lanes.mjs` stops with `not found (…)`, stop and tell the coordinator, who alone edits `$TEN/lanes.mjs`; before running it again, put the worktree back with `git checkout -- .` (this step makes no other changes; the tool refuses a second run on a changed tree).

- [ ] **Step 2: Write the page: `animations/02-entrance-and-exit/ink-spread-reveal/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ink Spread Reveal — Animation Handbook</title>
  <meta name="description" content="Ink drops spread and merge until the picture shows. Best for art and intros.">
  <link rel="canonical" href="https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/ink-spread-reveal/">
  <link rel="icon" type="image/png" sizes="96x96" href="../../../favicon.png">
  <link rel="icon" type="image/svg+xml" href="../../../favicon.svg">
  <link rel="apple-touch-icon" href="../../../apple-touch-icon.png">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Animation Handbook">
  <meta property="og:title" content="Ink Spread Reveal — Animation Handbook">
  <meta property="og:description" content="Ink drops spread and merge until the picture shows. Best for art and intros.">
  <meta property="og:url" content="https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/ink-spread-reveal/">
  <meta property="og:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Ink Spread Reveal — Animation Handbook">
  <meta name="twitter:description" content="Ink drops spread and merge until the picture shows. Best for art and intros.">
  <meta name="twitter:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <script type="application/ld+json">{"@context": "https://schema.org", "@type": "TechArticle", "headline": "Ink Spread Reveal", "name": "Ink Spread Reveal", "description": "Ink drops spread and merge until the picture shows. Best for art and intros.", "url": "https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/ink-spread-reveal/", "inLanguage": "en", "articleSection": "Entrance & Exit", "isPartOf": {"@type": "WebSite", "name": "Animation Handbook", "url": "https://matinmonshizadeh.github.io/animation-handbook/"}, "author": {"@type": "Person", "name": "matinmonshizadeh"}, "keywords": "web animation, CSS animation, Entrance & Exit, Ink Spread Reveal"}</script>
  <style>
    :root{--ui-accent:#5fd88a;--paper:#efe6d2;--ink:#1c1a26}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    .stage{position:relative;overflow:hidden;background:var(--paper)}
    /* One scene, or two side by side in Compare; each draws its own picture, paper and blots at its own size */
    .scenes{position:absolute;inset:0;display:grid;grid-template-columns:minmax(0,1fr)}
    .scene{position:relative;min-width:0;overflow:hidden}
    .scene>svg{position:absolute;inset:0;width:100%;height:100%;display:block}
    .paper{fill:var(--paper)}
    .edge path{fill:var(--ink)}
    /* A blot grows by scaling its own shape, from where its drop lands; it starts at nothing, so the box starts as paper */
    .grow{transform:scale(0)}
    .twin,.faint,.see,.side,.cap{display:none}
    /* See inside: the picture faint under the paper, each blot outlined and numbered, its final size dashed, the ink edge as a ring */
    .stage[data-hb-mode="inside"] .faint{display:inline;opacity:.3}
    .stage[data-hb-mode="inside"] .see{display:inline}
    .stage[data-hb-mode="inside"] .edge path{fill:rgba(28,26,38,.78)}
    .stage[data-hb-mode="inside"] .cap{display:block}
    .see path{fill:none;vector-effect:non-scaling-stroke}
    .see .line path{stroke:#fff;stroke-width:2.5}
    .see .dash{stroke:var(--ink);stroke-width:2;stroke-dasharray:8 6}
    .see .drop{fill:#fff;stroke:var(--ink);stroke-width:2}
    .cap,.side{position:absolute;z-index:3;padding:3px 8px;border-radius:6px;background:rgba(20,18,28,.9);color:#f4f4f2;
      font:600 13px/1.2 var(--hb-font);white-space:nowrap;pointer-events:none}
    .cap.num{padding:3px 8px;border-radius:999px}
    /* Compare: on the left a copy that grows clean circles, on the right the page as set; each half named at its top */
    .stage[data-hb-mode="compare"] .scenes{grid-template-columns:repeat(2,minmax(0,1fr));gap:2px;background:#2a2a30}
    .stage[data-hb-mode="compare"] .twin,.stage[data-hb-mode="compare"] .side{display:block}
    .side{top:10px;left:10px}
    @media(max-width:600px){.cap.c-dash{display:none!important}}
  </style>
  <link rel="stylesheet" href="../../../assets/css/demo-page.css?v=10">
  <script src="../../../assets/js/demo-page.js?v=10" defer></script>
</head>
<body class="hb" data-hb-kind="once" data-hb-autoplay>
<nav class="hb-bar" aria-label="Animation Handbook">
  <a class="hb-home" href="../../../"><svg class="hb-mark" viewBox="0 0 32 32" aria-hidden="true"><g class="g"><circle cx="11.16" cy="20.84" r="6.1"/><circle cx="15.12" cy="16.88" r="6.1"/><circle cx="18.51" cy="13.49" r="6.1"/></g><circle class="b" cx="21.2" cy="10.8" r="6.6"/></svg><span>Animation Handbook</span></a>
  <span class="hb-pager"><a href="../shatter-effect/" rel="prev" aria-label="Previous: Shatter Effect"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg><span><span class="hb-dir">Previous: </span>Shatter Effect</span></a></span>
  <a class="hb-star" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener" aria-label="Star on GitHub"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg><span>Star on GitHub</span></a>
</nav>
<main class="hb-page">
  <header class="hb-head">
    <p class="hb-cat">02.15 · Entrance &amp; Exit</p>
    <h1>Ink Spread Reveal</h1>
    <p class="hb-lede">Ink drops spread and merge until the picture shows. Best for art and intros.</p>
  </header>

  <section class="hb-step hb-watch" aria-labelledby="hb-watch-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">1</span>
      <div><h2 id="hb-watch-title">Watch it</h2><p>It plays by itself. Turn on slow motion to watch each drop soak in.</p></div>
    </div>
    <div class="seg hb-modes" role="group" aria-label="What the box shows" data-hb-modes>
      <button type="button" data-hb-mode="normal" class="on" aria-pressed="true">Normal</button>
      <button type="button" data-hb-mode="inside" aria-pressed="false">See inside</button>
      <button type="button" data-hb-mode="compare" aria-pressed="false">Compare</button>
    </div>
    <div class="stage" id="stage" role="img" aria-label="A drawing of a mountain by the sea, uncovered by drops of ink that spread and merge">
      <div class="scenes" id="scenes"><div class="scene" id="scene"><p class="side" data-hb-caption>Ink blots</p></div></div>
      <p class="cap num" id="cap-1" data-hb-caption>1 · lands first</p>
      <p class="cap num" id="cap-2" data-hb-caption>2</p>
      <p class="cap num" id="cap-3" data-hb-caption>3</p>
      <p class="cap c-dash" id="cap-dash" data-hb-caption>Dashed: where it stops</p>
      <p class="cap" id="cap-faint" data-hb-caption>Faint: still hidden</p>
    </div>
    <div class="hb-player">
      <button class="hb-play" type="button" id="btn-play" data-hb-replay><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>Replay</button>
      <label class="hb-toggle"><input class="hb-switch" type="checkbox" role="switch" id="loop-tog" data-hb-loop autocomplete="off"><span>Loop</span></label>
      <label class="hb-toggle"><input class="hb-switch" type="checkbox" role="switch" id="slow-tog" data-hb-slowmo="css" autocomplete="off"><span>Slow motion</span></label>
    </div>
    <div class="hb-mode-notes" aria-live="polite">
      <p data-hb-for="inside" hidden>Inside, the picture waits faintly under the paper. Each numbered blot is a window in the paper that grows to its dashed outline, with the dark ink edge as a ring just ahead.</p>
      <p data-hb-for="compare" hidden>On the left, Clean circles: the drops grow round and neat, which looks mechanical. On the right, Ink blots: ragged blots spread and merge, which looks like ink.</p>
    </div>
  </section>

  <section class="hb-step hb-try" aria-labelledby="hb-try-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">2</span>
      <div><h2 id="hb-try-title">Try it</h2><p>Change a setting and the animation plays again.</p></div>
    </div>
    <div class="hb-settings">
      <div class="hb-setting">
        <p class="hb-setting-name" id="drops-lbl">Where the ink lands</p>
        <div class="seg" id="drops-seg" role="group" aria-labelledby="drops-lbl">
          <button type="button" data-drops="one" aria-pressed="false">One drop</button>
          <button type="button" data-drops="several" class="on" aria-pressed="true">Several drops</button>
          <button type="button" data-drops="corner" aria-pressed="false">From a corner</button>
        </div>
        <p class="hb-hint">Where the first drops fall.</p>
      </div>
      <div class="hb-setting">
        <p class="hb-setting-name" id="speed-lbl">Speed</p>
        <div class="seg" id="speed-seg" role="group" aria-labelledby="speed-lbl">
          <button type="button" data-speed="slow" aria-pressed="false">Slow</button>
          <button type="button" data-speed="normal" class="on" aria-pressed="true">Normal</button>
          <button type="button" data-speed="fast" aria-pressed="false">Fast</button>
        </div>
        <p class="hb-hint">How long the ink takes to cover it.</p>
      </div>
      <div class="hb-setting">
        <p class="hb-setting-name" id="edge-lbl">Edge</p>
        <div class="seg" id="edge-seg" role="group" aria-labelledby="edge-lbl">
          <button type="button" data-edge="smooth" aria-pressed="false">Smooth</button>
          <button type="button" data-edge="ragged" class="on" aria-pressed="true">Ragged</button>
          <button type="button" data-edge="splashy" aria-pressed="false">Splashy</button>
        </div>
        <p class="hb-hint">Splashy throws small drops around each blot.</p>
      </div>
    </div>
    <details class="hb-options">
      <summary><span class="hb-more-label">More options</span><span class="hb-less">Fewer options</span><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary>
      <div class="hb-settings">
        <div class="hb-setting">
          <label class="hb-switch-row"><span>Dark ink edge</span><input class="hb-switch" type="checkbox" role="switch" id="rim-tog" checked autocomplete="off"></label>
          <p class="hb-hint">A dark rim runs just ahead of the picture.</p>
        </div>
      </div>
    </details>
  </section>

  <section class="hb-step hb-prompt-step" aria-labelledby="hb-prompt-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">3</span>
      <div><h2 id="hb-prompt-title">Copy the prompt</h2><p>Paste it into an AI assistant such as ChatGPT, Claude or Cursor to build this in your own project.</p></div>
    </div>
    <div class="hb-card">
      <p class="hb-prompt">Add an ink spread reveal to [the picture or section you want to uncover]. Start with it hidden under a plain paper-colored layer, then let drops of ink land and spread outward as blots that merge until the whole picture shows. Each blot grows quickly at first and slows as it soaks in, like ink on damp paper. Give the blots uneven outlines, as rough as the settings choose, and grow each one by scaling its shape, not redrawing it; when the settings include it, run a dark ink edge just ahead of the picture. If the visitor has reduced motion turned on, fade the picture in instead. Match the settings listed below.</p>
      <div class="hb-chips-box" hidden>
        <p class="hb-chips-title">Your settings</p>
        <ul class="hb-chips"></ul>
      </div>
      <div class="hb-copy-row">
        <button class="hb-copy" type="button"><svg class="hb-ic hb-i-copy" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><svg class="hb-ic hb-i-done" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span class="hb-copy-label" aria-live="polite">Copy prompt</span></button>
        <p class="hb-hint">Replace the words in brackets with your own element. Your settings are added at the end.</p>
      </div>
    </div>
    <div class="hb-star-row"><p>Free and open source. If this helped, a star on GitHub helps other people find it.</p><a class="hb-star-btn" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>Star on GitHub</a></div>
  </section>

  <section class="hb-about" aria-labelledby="hb-what-title">
    <div class="hb-what">
      <h2 id="hb-what-title">What it is</h2>
      <div class="hb-what-text"><p>The full explanation is in <a href="README.md">README.md</a>.</p></div>
    </div>
    <div class="hb-fit">
      <h2>Good for</h2>
      <ul class="hb-tags hb-good"><li>Art and portfolio sites</li><li>Page intros</li><li>Featured pictures</li></ul>
      <h3>Avoid on</h3>
      <ul class="hb-tags hb-avoid"><li>Forms</li><li>Rows of small pictures</li></ul>
    </div>
  </section>

  <section class="hb-related" aria-labelledby="hb-related-title" hidden>
    <h2 id="hb-related-title">Similar animations</h2>
    <div class="hb-rel-list"></div>
  </section>
</main>
<footer class="hb-foot"><span>Animation Handbook</span><a href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener">Source on GitHub</a><a href="#top">Back to top ↑</a></footer>
<script>
  const stage=document.getElementById('stage'),scenesEl=document.getElementById('scenes');
  const loopTog=document.getElementById('loop-tog'),rimTog=document.getElementById('rim-tog');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)'),phone=matchMedia('(max-width:600px),(max-height:500px)');
  // Where each drop lands, as shares of the scene's width and height, in the order they land
  const DROPS={one:[[.5,.5]],several:[[.24,.42],[.77,.34],[.52,.7]],corner:[[.08,.12],[.34,.4],[.68,.72]]};
  // How long one blot grows and the time between two drops (ms)
  const SPEEDS={slow:[2600,520],normal:[1800,360],fast:[1100,220]};
  // How far an outline wanders from a circle (a share of the radius) and how many splash drops each blot throws
  const EDGES={smooth:[0,0],ragged:[.11,0],splashy:[.11,9]};
  const EASE='cubic-bezier(.15,.7,.25,1)'; // fast at first, then slower and slower, like ink soaking in
  // See inside and Compare rest on a posed moment, each blot grown this share of its full size (the first drop the most), so
  // the parts show and paper is still left; reduced motion holds every view there too
  const POSE=[.62,.44,.27];
  const LABELS={normal:'A drawing of a mountain by the sea, uncovered by drops of ink that spread and merge',
    inside:'The reveal taken apart: the picture faint under the paper, and each numbered blot growing to its dashed outline',
    compare:'The reveal twice: clean circles on the left, ragged ink blots on the right'};
  let drops='several',speed='normal',edge='ragged',mode='normal',view='paper',anims=[],timers=[];
  const later=(fn,ms)=>timers.push(setTimeout(fn,ms));
  const stopTimers=()=>{timers.forEach(clearTimeout);timers=[]};
  // The same picture for every scene: a mountain by the sea at dawn, drawn in a 400 by 250 box that fills the scene (the edges
  // that do not fit are cut off). id keeps each copy's gradients apart.
  const art=(id,W,H)=>`<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" width="${W}" height="${H}">
    <defs><linearGradient id="sky-${id}" x2="0" y2="1"><stop offset="0" stop-color="#2f5d9e"/><stop offset=".6" stop-color="#f0a77a"/><stop offset="1" stop-color="#ffd9a0"/></linearGradient>
    <linearGradient id="sea-${id}" x2="0" y2="1"><stop offset="0" stop-color="#2b86c0"/><stop offset="1" stop-color="#123f66"/></linearGradient></defs>
    <rect width="400" height="160" fill="url(#sky-${id})"/><circle cx="292" cy="122" r="40" fill="#fff3d2" opacity=".35"/><circle cx="292" cy="122" r="22" fill="#fff1c9"/>
    <path fill="#6273a6" d="M0 152L58 96 104 122 168 50 232 120 272 98 334 142 400 108V160H0Z"/><path fill="#f4f1ea" d="M150 70L168 50 190 72 180 68 171 77 160 69Z"/>
    <path fill="#2f4a3a" d="M0 160V118Q44 100 86 126T140 160Z"/><rect y="158" width="400" height="92" fill="url(#sea-${id})"/>
    <g fill="#ffe3a6" opacity=".85"><rect x="268" y="166" width="48" height="3" rx="1.5"/><rect x="276" y="176" width="32" height="3" rx="1.5"/><rect x="284" y="186" width="18" height="2.5" rx="1.2"/></g>
    <path fill="none" stroke="#9fd3f2" stroke-width="1.6" opacity=".7" d="M30 182q8-4 16 0t16 0M150 196q8-4 16 0t16 0M60 222q8-4 16 0t16 0M330 214q8-4 16 0t16 0"/>
    <path fill="#f6f1e6" d="M118 186V158L138 186Z"/><path fill="#7a3b2a" d="M108 188H146L141 195H113Z"/>
    <path fill="none" stroke="#3a3346" stroke-width="1.6" stroke-linecap="round" d="M206 70q5-4 9 0q4-4 9 0M228 86q4-3 7 0q3-3 7 0"/>
    <path fill="#e8c88f" d="M0 250V216Q90 200 172 228T260 250Z"/></svg>`;
  // A seeded random sequence, so both halves of Compare and every redraw get the same blots
  function rng(s){return()=>{s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
  // One blot of radius 1: a circle whose radius wanders with a few slow waves and a few small fast ones (the feathery edge), and
  // for Splashy a few drops thrown around it. min is the smallest radius the outline reaches.
  function unitBlot(rand,wob,dots){
    const waves=[2,3,5,9,14,23].map((n,i)=>[n,(rand()*2-1)/(i<3?1:2.6),rand()*6.283]);
    const sum=waves.reduce((s,w)=>s+Math.abs(w[1]),0)||1;
    waves.forEach(w=>{w[1]*=wob*1.8/sum});
    const pts=[];let min=1;
    for(let i=0;i<96;i++){const a=i/96*6.283;let k=1;for(const [n,amp,ph] of waves)k+=amp*Math.sin(n*a+ph);min=Math.min(min,k);pts.push([Math.cos(a)*k,Math.sin(a)*k])}
    const splash=[...Array(dots)].map(()=>{const a=rand()*6.283,d=1.08+rand()*.3;return [Math.cos(a)*d,Math.sin(a)*d,.022+rand()*.04]});
    return {pts,splash,min};
  }
  // The blot's outline at radius R (and k times larger plus add pixels, for the ink edge), as one path
  function pathOf(b,R,k=1,add=0){
    const r=R*k+add,f=v=>(v*r).toFixed(1);
    let d='M'+b.pts.map(p=>f(p[0])+' '+f(p[1])).join('L')+'Z';
    for(const [x,y,s] of b.splash){const q=(s*r).toFixed(1);d+=`M${f(x)} ${f(y)}m-${q} 0a${q} ${q} 0 1 0 ${(2*s*r).toFixed(1)} 0a${q} ${q} 0 1 0 -${(2*s*r).toFixed(1)} 0Z`}
    return d;
  }
  // Each scene: the page's own (main) and, for Compare, a copy (twin) that grows clean circles with no ink edge. The copy has no
  // ids of its own outside its drawing, is out of the keyboard's way and hidden from screen readers.
  const main={el:document.getElementById('scene'),twin:false};
  const twinEl=main.el.cloneNode(true);twinEl.removeAttribute('id');twinEl.classList.add('twin');twinEl.inert=true;twinEl.setAttribute('aria-hidden','true');
  twinEl.querySelector('.side').textContent='Clean circles';main.el.before(twinEl);
  const twin={el:twinEl,twin:true};
  const shown=()=>mode==='compare'?[twin,main]:[main];
  // Draws a scene for its size: the paper, the ink edge, the picture seen through the blots, and See inside's outlines. Every blot
  // gets the radius that, with the others, covers the whole scene at full size: each spot of the scene belongs to its nearest
  // drop, and that drop's blot reaches the farthest of its spots even where its outline dips in.
  function build(sc){
    const W=sc.el.clientWidth||1,H=sc.el.clientHeight||1,id=sc.twin?'twin':'main',rand=rng(7);
    const [wob,dots0]=sc.twin?[0,0]:EDGES[edge],dots=phone.matches?Math.ceil(dots0/2):dots0;
    const c=DROPS[drops].map(([x,y])=>[x*W,y*H]),far=c.map(()=>1);
    for(let i=0;i<=12;i++)for(let j=0;j<=8;j++){const x=i/12*W,y=j/8*H,d=c.map(p=>Math.hypot(p[0]-x,p[1]-y)),n=d.indexOf(Math.min(...d));far[n]=Math.max(far[n],d[n])}
    sc.blots=c.map((p,i)=>{const b=unitBlot(rand,wob,dots);return {x:p[0],y:p[1],R:far[i]*1.06/b.min,b}});
    sc.W=W;sc.H=H;
    const g=(cls,i,d)=>`<g transform="translate(${sc.blots[i].x.toFixed(1)} ${sc.blots[i].y.toFixed(1)})"><g class="grow" data-i="${i}"><path class="${cls}" d="${d}"/></g></g>`;
    const each=fn=>sc.blots.map(fn).join('');
    const rim=!sc.twin&&rimTog.checked;
    sc.el.querySelector('svg')?.remove();
    sc.el.insertAdjacentHTML('afterbegin',`<svg viewBox="0 0 ${W} ${H}" aria-hidden="true"><defs><mask id="ink-${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}">
      ${each((b,i)=>g('',i,pathOf(b.b,b.R)).replace('<path class=""','<path fill="#fff"'))}</mask></defs>
      <rect class="paper" width="${W}" height="${H}"/><g class="faint">${art('f'+id,W,H)}</g>
      <g class="edge"${rim?'':' display="none"'}>${each((b,i)=>g('',i,pathOf(b.b,b.R,1.04,3)))}</g>
      <g class="reveal" mask="url(#ink-${id})">${art(id,W,H)}</g>
      <g class="see">${each(b=>`<path class="dash" d="${pathOf(b.b,b.R)}" transform="translate(${b.x.toFixed(1)} ${b.y.toFixed(1)})"/>`)}
      <g class="line">${each((b,i)=>g('',i,pathOf(b.b,b.R)))}</g>${each(b=>`<circle class="drop" cx="${b.x.toFixed(1)}" cy="${b.y.toFixed(1)}" r="4"/>`)}</g></svg>`);
    sc.grows=[...sc.el.querySelectorAll('.grow')];
    sc.fades=[...sc.el.querySelectorAll('.reveal,.edge')];
  }
  // See inside's labels, placed from the blots: a number beside each drop, the dashed line's label on a stretch of the first dashed
  // outline that is inside the box, and Faint where the paper still hides the most at the resting moment. None goes outside the box.
  function placeLabels(){
    const sc=main,W=sc.W,H=sc.H,put=(el,x,y)=>{el.style.left=Math.max(6,Math.min(W-el.offsetWidth-6,x))+'px';el.style.top=Math.max(6,Math.min(H-el.offsetHeight-6,y))+'px'};
    [1,2,3].forEach(n=>{const el=document.getElementById('cap-'+n),b=sc.blots[n-1];el.style.display=b?'':'none';if(b)put(el,b.x+10,b.y-34)});
    // the dashed label sits on a stretch of a dashed outline inside the box; with one drop the outline lies outside it, and
    // the label goes too
    const dash=document.getElementById('cap-dash');dash.hidden=false;
    const p=sc.blots.flatMap(b=>b.b.pts.map(([x,y])=>[b.x+x*b.R,b.y+y*b.R])).find(([x,y])=>x>12&&x<W-dash.offsetWidth-12&&y>40&&y<H-40);
    dash.hidden=!p;if(p)put(dash,p[0]+8,p[1]+6);
    const s=POSE,spots=[];
    for(let i=1;i<10;i++)for(let j=1;j<7;j++)spots.push([i/10*W,j/7*H]);
    const open=([x,y])=>Math.min(...sc.blots.map((b,i)=>Math.hypot(b.x-x,b.y-y)/Math.max(1,b.R*s[i])));
    const best=spots.reduce((a,q)=>open(q)>open(a)?q:a);
    const faint=document.getElementById('cap-faint');put(faint,best[0]-faint.offsetWidth/2,best[1]-12);
  }
  // The share of a blot's growing time at which it has reached size y (0 to 1), by the same ease as the animation: the ease's
  // own t for that height found by halving, then its time there
  const bez=(t,a,b)=>3*a*t*(1-t)*(1-t)+3*b*t*t*(1-t)+t*t*t;
  function timeFor(y){let lo=0,hi=1;for(let k=0;k<24;k++){const m=(lo+hi)/2;bez(m,.7,1)<y?lo=m:hi=m}return bez((lo+hi)/2,.15,.25)}
  const total=()=>{const [grow,gap]=SPEEDS[speed];return grow+gap*(DROPS[drops].length-1)};
  // The blots of every scene on show, each starting when its drop lands. at: the time to start from, or 'pose' for each blot at
  // its posed size; still: hold there
  function blots(at,still){
    anims.forEach(a=>a.cancel());anims=[];
    const [grow,gap]=SPEEDS[speed];
    for(const sc of shown())sc.grows.forEach(el=>{
      const i=+el.dataset.i,a=el.animate([{transform:'scale(0)'},{transform:'scale(1)'}],{duration:grow,delay:i*gap,easing:EASE,fill:'both'});
      a.currentTime=at==='pose'?i*gap+grow*timeFor(POSE[i]):Math.min(at,total());
      if(still)a.pause();
      anims.push(a);
    });
  }
  function layout(){shown().forEach(build);if(mode==='inside')placeLabels()}
  // One play from plain paper; under reduced motion the whole picture fades in instead. When it ends, Loop holds the picture,
  // fades it back to paper and plays again; See inside and Compare go back to their resting moment.
  function play(){
    stopTimers();layout();view='play';
    if(reduce.matches){blots(total(),true);fade(0,1,600,end);return}
    blots(0,false);
    Promise.all(anims.map(a=>a.finished)).then(end,()=>{});
  }
  function fade(from,to,ms,then){
    const f=shown().flatMap(sc=>sc.fades.map(el=>el.animate([{opacity:from},{opacity:to}],{duration:ms,fill:'forwards'})));
    anims.push(...f);
    Promise.all(f.map(a=>a.finished)).then(then,()=>{});
  }
  function end(){
    view='full';
    if(loopTog.checked&&!reduce.matches)later(()=>{if(!loopTog.checked)return;view='fade';fade(1,0,600,play)},1200);
    else if(mode!=='normal')later(rest,800);
  }
  // At rest: Normal shows the whole picture (or paper, before the first play), and with Loop on goes on looping from there;
  // See inside and Compare their resting moment
  function rest(){
    stopTimers();layout();
    if(mode==='normal'){blots(view==='paper'?0:total(),true);if(loopTog.checked&&!reduce.matches&&view!=='paper')end();return}
    view='pose';blots('pose',true);
  }
  document.addEventListener('hb:mode',e=>{
    mode=e.detail.mode;stage.setAttribute('aria-label',LABELS[mode]);notes();
    // A play under way goes on from where it is, drawn for the new size of its scene
    if(view==='play'&&anims[0]&&!reduce.matches){const t=anims[0].currentTime;layout();blots(t,false);Promise.all(anims.map(a=>a.finished)).then(end,()=>{})}
    else rest();
  });
  // The notes follow the settings: with Smooth edges both halves of Compare grow round blots (the same ones with the ink edge
  // off), and with the ink edge off See inside has no ring to name; the markup's words hold for the defaults
  const said={inside:document.querySelector('[data-hb-for="inside"]').textContent,compare:document.querySelector('[data-hb-for="compare"]').textContent};
  function notes(){
    const rim=rimTog.checked,still=reduce.matches;
    document.querySelector('[data-hb-for="compare"]').textContent=edge==='smooth'
      ?(rim?'Edge is set to Smooth, so both halves grow round blots and only Ink blots has the dark ink edge. Pick Ragged or Splashy in Try it to see uneven edges.'
        :'Edge is set to Smooth and the ink edge is off, so Clean circles and Ink blots match. Pick Ragged or Splashy in Try it to see the difference.')
      :still?'Shown still, part of the way: on the left, Clean circles have grown round and neat; on the right, Ink blots have spread with ragged edges.'
      :said.compare;
    document.querySelector('[data-hb-for="inside"]').textContent=still?'Shown still, part of the way: the picture waits faintly under the paper, and each numbered blot will grow to its dashed outline.'
      :rim?said.inside:'Inside, the picture waits faintly under the paper. Each numbered blot is a window in the paper that grows to its dashed outline.';
  }
  // Loop on plays at once; Loop off during the fade back to paper shows the whole picture again
  loopTog.addEventListener('change',()=>{if(loopTog.checked)play();else if(view==='fade'){view='full';rest()}});
  new ResizeObserver(()=>{if(view!=='play')rest()}).observe(stage);
  document.getElementById('btn-play').addEventListener('click',play);
  function choices(id,pick){
    const buttons=document.querySelectorAll('#'+id+' button');
    buttons.forEach(b=>b.addEventListener('click',()=>{
      buttons.forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',String(x===b))});
      pick(b.dataset);notes();
    }));
  }
  choices('drops-seg',d=>{drops=d.drops});choices('speed-seg',d=>{speed=d.speed});choices('edge-seg',d=>{edge=d.edge});
  rimTog.addEventListener('change',notes);
  notes();layout();
</script>
</body>
</html>
```

Then give it the shared-file version the branch uses (the ledger's N; nothing changes when N is 10):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L1 || exit 1
N=$(grep -o 'shared files ?v=[0-9]*' $TEN/ledger.md | head -1 | grep -o '[0-9]*$')
sed -i "s/demo-page\.css?v=10/demo-page.css?v=$N/; s/demo-page\.js?v=10/demo-page.js?v=$N/" animations/02-entrance-and-exit/ink-spread-reveal/index.html
grep -c "demo-page\.css?v=$N\|demo-page\.js?v=$N" animations/02-entrance-and-exit/ink-spread-reveal/index.html
```

Expected: `2`.

- [ ] **Step 3: Write the README: `animations/02-entrance-and-exit/ink-spread-reveal/README.md`**

````markdown
# Ink Spread Reveal

[Live demo](https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/ink-spread-reveal/)

## What it is
An ink spread reveal uncovers a picture the way ink spreads on damp paper. The picture starts hidden under a plain paper-colored layer, drops land one after another, and each spreads into a blot with an uneven edge; the blots grow, merge and finally show the whole picture. Each blot races outward at first and slows as it soaks in, which is what makes it read as ink rather than as a shape growing.

## When to use it
- The opening picture of an art, illustration or portfolio site
- A featured artwork or photo that deserves a slower entrance
- Intros for stories, posters and event pages with a hand-made look
- Section openers on pages about painting, calligraphy or print

## How it works
The picture sits under an SVG mask. The mask holds one white blot per drop: white shows the picture and everything else stays paper. Each blot is made once, from a circle whose radius wanders with a few slow waves and a few small fast ones, so its edge looks uneven and feathery; Splashy adds small drops thrown around it. A seeded random sequence makes the same blots on every redraw.

```js
// One blot of radius 1: a circle whose radius wanders with six waves, the slow ones larger. wob is how far it may wander.
function unitBlot(rand, wob, dots) {
  const waves = [2, 3, 5, 9, 14, 23].map((n, i) => [n, (rand() * 2 - 1) / (i < 3 ? 1 : 2.6), rand() * 6.283]);
  const sum = waves.reduce((s, w) => s + Math.abs(w[1]), 0) || 1;
  waves.forEach(w => { w[1] *= wob * 1.8 / sum; });
  const pts = []; let min = 1;
  for (let i = 0; i < 96; i++) {
    const a = i / 96 * 6.283; let k = 1;
    for (const [n, amp, ph] of waves) k += amp * Math.sin(n * a + ph);
    min = Math.min(min, k); pts.push([Math.cos(a) * k, Math.sin(a) * k]);
  }
  const splash = [...Array(dots)].map(() => { const a = rand() * 6.283, d = 1.08 + rand() * .3; return [Math.cos(a) * d, Math.sin(a) * d, .022 + rand() * .04]; });
  return { pts, splash, min };
}
```

Each blot's full size is worked out so the blots cover the whole picture together: every spot of the picture belongs to its nearest drop, and that drop's blot is made large enough to reach the farthest of its spots, even where its outline dips in (the radius is divided by the outline's smallest reach). The blot then grows by scaling that same shape from where its drop lands, with an ease that starts fast and slows down, each drop a moment after the one before:

```js
grows.forEach(el => el.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)' }],
  { duration: 1800, delay: +el.dataset.i * 360, easing: 'cubic-bezier(.15,.7,.25,1)', fill: 'both' }));
```

```html
<svg viewBox="0 0 900 440">
  <defs><mask id="ink"><g transform="translate(216 185)"><g class="grow" data-i="0"><path fill="#fff" d="…"/></g></g></mask></defs>
  <rect class="paper" width="900" height="440"/>
  <g class="edge"><!-- the same blots a little larger, dark --></g>
  <g mask="url(#ink)"><!-- the picture --></g>
</svg>
```

A dark copy of each blot, 4% larger, sits under the picture and shows as a rim just ahead of it. When the last blot has grown, Loop holds the picture, fades it back to paper and plays again. Under reduced motion the whole picture fades in instead.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Where the ink lands | Several drops | One drop lands in the middle; several drops are three that land in turn across the picture; from a corner, three drops land one after another from the top left toward the bottom right |
| Speed | Normal | How long it takes to cover the picture: slow is about 3.6 seconds (each blot grows for 2.6 seconds, the drops half a second apart), normal 2.5 seconds (1.8 seconds, a third of a second apart) and fast 1.5 seconds (1.1 seconds, a fifth of a second apart) |
| Edge | Ragged | Smooth grows round circles; ragged lets each outline wander by about a tenth of its radius; splashy adds nine small drops around each blot (five on phones) |
| Dark ink edge | on | A dark copy of each blot, a little larger, shows as a rim just ahead of the picture; off, the picture shows with no rim |

## Production notes
- **A mask is repainted.** Animating the shapes inside an SVG mask repaints the masked picture on every frame. That is fine for one picture of this size; for a full-screen hero on slow phones, draw the blots on a canvas and use it as a `mask-image`, or reveal a canvas copy of the picture directly.
- **Scale, never redraw.** Build each blot's outline once and grow it with `transform: scale()`. Rewriting the path every frame makes the browser parse and lay it out again.
- **Cover the corners.** Blots that look big enough in the middle often leave the corners as paper. Size each blot from the spots it has to reach, or let the last drop be the largest.
- **Reduced motion.** Fade the picture in instead of growing blots.
- **GSAP** grows the blots with `gsap.fromTo(".grow", { scale: 0 }, { scale: 1, duration: 1.8, ease: "power3.out", stagger: 0.36, transformOrigin: "0 0" })`; set the origin so each grows from its drop. **Framer Motion** animates each blot `<motion.path>` inside a `<mask>` from `scale: 0` to `scale: 1` with `transition={{ delay: i * 0.36, ease: [0.15, 0.7, 0.25, 1] }}`.
- **Real ink.** A scanned ink blot or a short ink video used as a luminance mask looks richest; keep it small and fall back to the drawn blots.

## See also
- [Clip-Path Reveal](../clip-path-reveal/) — a clean shape grows to uncover a picture
- [Circle Reveal](../../03-page-transitions/circle-reveal/) — one circle grows from a click to show the next page
- [Curtain Reveal](../curtain-reveal/) — a colored panel covers it, then slides away
- [Fade In / Fade Out](../fade-in-out/) — the plain fade this becomes under reduced motion
````

- [ ] **Step 4: The home page preview**

In the worktree's `index.html`: (a) insert these lines, and one empty line after them, right before the line `/* ── bespoke: 03 Page Transitions ── */` (the end of the 02 bespoke block):

```css
.pv-inkspread{background:#efe6d2;overflow:hidden}
.pv-inkspread i{position:absolute;width:58%;aspect-ratio:1;border-radius:47% 53% 41% 59%/55% 44% 56% 45%;background:#1c1a26;transform:scale(0);animation:inkspread-blot 5s cubic-bezier(.15,.7,.25,1) infinite}
.pv-inkspread .b1{left:-4%;top:6%}.pv-inkspread .b2{left:46%;top:-14%;border-radius:58% 42% 52% 48%/46% 58% 42% 54%;animation-delay:.35s}.pv-inkspread .b3{left:22%;top:38%;border-radius:44% 56% 60% 40%/50% 46% 54% 50%;animation-delay:.7s}
.pv-inkspread .pic{position:absolute;inset:0;opacity:0;background:radial-gradient(circle at 72% 40%,#fff1c9 0 6%,#0000 6.5%),linear-gradient(160deg,#0000 52%,#6273a6 52.5% 63%,#0000 63.5%),linear-gradient(#2f5d9e,#f0a77a 55%,#2b86c0 56%,#123f66);animation:inkspread-pic 5s ease-out infinite}
@keyframes inkspread-blot{0%{transform:scale(0);opacity:1}45%,80%{transform:scale(1);opacity:1}92%,100%{transform:scale(1);opacity:0}}
@keyframes inkspread-pic{0%,28%{opacity:0}62%,84%{opacity:1}96%,100%{opacity:0}}
```

(b) insert this line right before the line that starts with `case 'sig3':` (after the end of the `case 'shatter':` block):

```js
    case 'inkspread': return '<i class="b1 anim"></i><i class="b2 anim"></i><i class="b3 anim"></i><span class="pic anim"></span>';
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L1 || exit 1
grep -c "pv-inkspread" index.html; grep -c "case 'inkspread':" index.html
```

Expected: a number above 1 (the preview's CSS rules), then `1` (its case).

- [ ] **Step 5: Write the generated files, then the tests pass**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L1 || exit 1
node tools/update-sitemap.mjs && node tools/make-skill.mjs
node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)"
```

Expected: `ℹ fail 0` (this plan's run of every lane on a copy of `feat/ten-animations` at `ece2689`, the finder and Famous effects there, gave it: 1717 pass). If only `tests/finder.test.js` fails (its case 9 waits for Task 11 when the finder has changed since), note the failing lines in your report for Task 11 (lanes never change `tests/`) and go on; any other failure names what to fix in this lane's files.

- [ ] **Step 6: The page check and the short screens (each a background command, waited on)**

The coordinator's server for this lane answers on port 8961: `curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8961/` prints `200` (if not, ask the coordinator). The review kit finds pages under its own folder's root, so it runs from a copy in the worktree (`.superpowers/` is ignored by git):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit
cd $REPO/.claude/worktrees/ten-L1 || exit 1
mkdir -p .superpowers/sdd/kit/review-kit $TEN/checks/L1 && cp $KIT/record.mjs $KIT/kit-lib.mjs .superpowers/sdd/kit/review-kit/ && git status --short | grep -c superpowers
```

Expected: `0` (git does not see the copy). Then start these two, each as its own background command (the round number `1`, then `2`, `3` after fixes):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L1 || exit 1
node $RUN/slot.mjs run ten-L1 -- node tools/check-pages.mjs --base http://127.0.0.1:8961 --out $TEN/checks/L1/1 animations/02-entrance-and-exit/ink-spread-reveal animations/02-entrance-and-exit/shatter-effect home > $TEN/checks/L1/1.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L1/1.log
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L1 || exit 1
node $RUN/slot.mjs run ten-L1 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8961 --short --out $TEN/checks/L1/short-1 animations/02-entrance-and-exit/ink-spread-reveal > $TEN/checks/L1/short-1.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L1/short-1.log
```

Wait on each with `node $RUN/wait-log.mjs $TEN/checks/L1/1.log` and `… short-1.log` (again while it says `still running`), then: `grep -c '^ok' $TEN/checks/L1/1.log; grep '^FAIL' $TEN/checks/L1/1.log; tail -2 $TEN/checks/L1/short-1.log`.

Expected: `18` (six `ok` lines each for `ink-spread-reveal`, `shatter-effect`, the home page), no `FAIL` line, and `27 short-screen pictures checked, 0 with labels cut or overlapping, 0 skipped, 0 failed` with `EXIT=0` (this plan's runs gave exactly these). A `FAIL` line or a cut or overlapping label names the problem (the real branch may differ from the copy this plan was checked on; the ledger's first line says how): fix it in this lane's files, keeping the page's behavior, and run both again as round 2, 3; every round after a change ends with all lines `ok`.

- [ ] **Step 7: Every choice in Try it, in both views (acceptance 7), and the motion in clips**

Two background commands. The first runs the kit's gallery (pictures only: Normal, See inside and Compare at 1280 and 375) once with the defaults (`press-0`) and once for each choice that is not a default and each switch in Try it (never Loop, Slow motion, Pause or Play: playback is not a setting), each into its own folder. The second records the clips (Normal, See inside and Compare at 1280, about seven seconds each, frames kept) with the defaults (`clip-0`) and for each choice of the settings that change only timing or show only while the demo moves (G1, G11): the stills never show a run's middle.

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L1 || exit 1
i=0; for sel in "" "#drops-seg [data-drops='one']" "#drops-seg [data-drops='corner']" "#speed-seg [data-speed='slow']" "#speed-seg [data-speed='fast']" "#edge-seg [data-edge='smooth']" "#edge-seg [data-edge='splashy']" "#rim-tog"; do echo "== press-$i ${sel:-defaults}"; node $RUN/slot.mjs run ten-L1 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8961 --gallery ${sel:+--press "$sel"} --out $TEN/checks/L1/press-$i animations/02-entrance-and-exit/ink-spread-reveal || echo "run $i failed"; i=$((i+1)); done > $TEN/checks/L1/press.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L1/press.log
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L1 || exit 1
i=0; for sel in "" "#speed-seg [data-speed='slow']" "#speed-seg [data-speed='fast']"; do echo "== clip-$i ${sel:-defaults}"; node $RUN/slot.mjs run ten-L1 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8961 --only clips --keep-frames ${sel:+--press "$sel"} --out $TEN/checks/L1/clip-$i animations/02-entrance-and-exit/ink-spread-reveal || echo "run $i failed"; i=$((i+1)); done > $TEN/checks/L1/clips.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L1/clips.log
```

Wait on each log with `node $RUN/wait-log.mjs`. Expected: 8 `== press-…` lines, each run ending `done  6 pictures, 0 clips and 0 comparisons made, 0 skipped, 0 failed`, and 3 `== clip-…` lines, each ending `done  0 pictures, 3 clips and 0 comparisons made, 0 skipped, 0 failed`; no `failed` line, no `was not found`, `EXIT=0` (the kit's lines as this plan's runs printed them). Read each gallery's See inside and Compare pictures at 1280 beside `press-0`'s: each choice visibly changes Normal and both views. Read three frames from the middle of each See inside and Compare clip (the log's `frames kept in <folder>` lines name the folders; for a timing choice, the same frames beside `clip-0`'s): the views move as the spec says, nothing jumps or covers the stage in mid-run (this plan's clips found See inside's small copy filling Pixelate Transition's stage while the blocks were small, a fault no still showed). A choice that changes nothing in a view is a fix (the owner's rule: every setting and control visibly changes the stage and both views). Then remove the frame folders: `grep -o 'frames kept in .*' $TEN/checks/L1/clips.log | sed 's/^frames kept in //' | while read -r f; do rm -rf "$f"; done`.

- [ ] **Step 8: Look at the screenshots and check by hand**

Open `$TEN/checks/L1/<round>/02-ink-spread-reveal-{desktop,phone,phone-reduced}-{inside,compare}.png`, the Normal ones and the short screens' pictures: both views read as the spec says, no label covers another or the part it names, nothing overflows at 320. Then, in the served page (a headless run through the pool, or by reading the code where a run cannot show it):

- Replay plays from plain paper to the whole picture and stops; Loop (switched on by the shared script after arrival) fades back to paper and plays again, and goes on looping when Normal is pressed or the window resized during its hold or its fade; Slow motion makes the blots grow three times slower.
- Every setting changes the play: Where the ink lands (One drop, Several drops, From a corner), Speed, Edge (Smooth, Ragged, Splashy) and the ink edge switch. The notes stay true after every press (lesson 16): with Edge on Smooth the Compare note says both halves grow round blots and only Ink blots has the ink edge (with the ink edge off too, that the halves match), each with how to see uneven edges; with the ink edge off, the See inside note leaves the ring out.
- See inside and Compare play once after their press, then rest on the posed moment (blots at 62%, 44% and 27% of their final size): paper and picture both show, and the two views differ from Normal and from each other.
- Under reduced motion the picture fades in with no blots, and each view is its posed still; at 375px the dashed outline's label is hidden so the box holds four labels at most.

Decisions already made in this page (keep them; a reviewer weighs them): The blots stay an SVG mask animated with the Web Animations API (the spec allowed a canvas if the mask missed 60 fps): the mask holds a 16.7 ms median in every mode at both sizes. Both views rest on a posed moment (blot sizes 62%, 44%, 27%) so their still pictures show the mechanism; reduced motion holds every view there.

- [ ] **Step 9: Frame times (required: a canvas or mask page)**

One background command, waited on with `wait-log.mjs`:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L1 || exit 1
(node $RUN/slot.mjs run ten-L1 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8961 --modes normal,inside,compare animations/02-entrance-and-exit/ink-spread-reveal; node $RUN/slot.mjs run ten-L1 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8961 --phone --modes normal,inside,compare animations/02-entrance-and-exit/ink-spread-reveal; node $RUN/slot.mjs run ten-L1 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8961 animations/02-entrance-and-exit/clip-path-reveal; node $RUN/slot.mjs run ten-L1 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8961 --phone animations/02-entrance-and-exit/clip-path-reveal) > $TEN/checks/L1/frames.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L1/frames.log
```

Expected: a median of 16.7 ms in every mode at both sizes, and no larger share of frames slower than 20 ms than Clip-Path Reveal measured the same way, within a few points (the machine's other work moves these numbers; run again when one looks off). This plan's runs: desktop 0 / 0 / 0%, phone 0 / 0 / 1%; Clip-Path Reveal 0% at both sizes. A page that misses lightens its per-frame work (a smaller grid, fewer dots, less drawn per frame) until it meets this, and says what it changed.

- [ ] **Step 10: Commit, and the build report**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L1 || exit 1
[ "$(git rev-parse --abbrev-ref HEAD)" = ten/L1 ] || exit 1
git add -A && git status --short
git commit -m "feat: 02.15 Ink Spread Reveal, with See inside and Compare from the start (lane 1)"
git log --oneline -1
```

Expected before the commit: `A  animations/02-entrance-and-exit/ink-spread-reveal/README.md`, `A  animations/02-entrance-and-exit/ink-spread-reveal/index.html`, `M  .github/ISSUE_TEMPLATE/config.yml`, `M  404.html`, `M  README.md`, `M  animations/02-entrance-and-exit/README.md`, `M  animations/02-entrance-and-exit/shatter-effect/index.html`, `M  index.html`, `M  llms.txt`, `M  sitemap.xml` and the changed files under `skills/animation-handbook/`; nothing else (the kit's copy is ignored; logs and pictures are in `$TEN`). Then write `$TEN/reports/L1/build.md`: first line `RESULT: built <commit>`, then the line count, the page check's `ok` count and its round, the short screens' last line, the galleries and clips looked at (one line per choice: what changes in each view; one line per clip: what moves), the tests' pass and fail line, the frame times, the hand checks' results, every place the page departs from the spec or this task and why, and any shared-file need (the coordinator appends it to `$RUN/shared-wishes.md`; there should be none). Reply to the coordinator in at most three lines.

- [ ] **Step 11: Review, at most three fix rounds**

The coordinator dispatches a reviewer (strongest model, never the builder) with: the spec's section, this task, the builder's report, `git -C $REPO diff feat/ten-animations...ten/L1`, the newest check round and its screenshots, the short screens, the galleries, the clips and the frame times. The reviewer reads CLAUDE.md, the Global Constraints, `$RUN/lessons.md`, `$RUN/briefs/RULINGS.md`, `$RUN/brief-rulings.md`, `$RUN/briefs/OPEN-QUESTIONS.md` and, once it holds the owner's verdict, `$RUN/rulings-159.md`, and checks the diff against them, the rollout's acceptance list (section 1 of the rollout spec), the spec's section and the per-frame work, looking hard at the posed rest of both views after their run; the Compare note that the script rewrites; Loop after arrival; the mask's cost at phone size. It writes `$TEN/reports/L1/review-<k>.md`: first line `RESULT: approved` or `RESULT: changes <count>`, then numbered findings (Critical, Important, Minor), and replies in at most three lines. Each fix round: the builder fixes, runs Steps 5 and 6 again (and the galleries, clips or frame times a fix touches), commits `fix: Ink Spread Reveal: <what>` after the branch check, writes `$TEN/reports/L1/fix-<k>.md` (`RESULT: built <commit>`), and the reviewer re-reviews only the fix. After three rounds the coordinator steps in. When approved, the coordinator stops the lane's server and adds the ledger line `<date time>  L1  approved at <commit>; check rounds <k>; frames <numbers>; departures: <none or a list>; reports reports/L1/`.

---

### Task 2: L2 · 03.17 Pixelate Transition (`ten/L2`, port 8962)

Do it · step 1 "Click it" · player bar: Show me, Reset and Slow motion (the page slows itself). See inside: the blocks with their grid at the chosen size, the small copy they come from in an inset, and a strip of block size over a change with the swap marked. Compare: "Cuts at once" beside "Pixelates", one click driving both. Spec: "2 · Pixelate Transition (03.17)" in `docs/superpowers/specs/2026-10-13-ten-new-animations-design.md`.

**Files:**
- Create: `animations/03-page-transitions/pixelate-transition/index.html` (306 lines), `animations/03-page-transitions/pixelate-transition/README.md`
- Modify (by `$TEN/lanes.mjs 2`): `index.html` (the card after Cube Transition's, the `PV` key, the `PLACES` row, the `FIND` row (the finder is on the branch), every count 166 → 167), `README.md` (counts, 03's count 16 → 17, the catalog line), `animations/03-page-transitions/README.md` (its line), `.github/ISSUE_TEMPLATE/config.yml`, `404.html`, `animations/03-page-transitions/cube-transition/index.html` (its first Next link, to Pixelate Transition)
- Modify (Step 4, by hand): `index.html`: the preview's CSS at the end of the 03 bespoke block, `case 'pixelate':` in `pvMarkup()`, a `STILL` point
- Regenerate: `sitemap.xml`, `llms.txt`, `skills/animation-handbook/` (their tools)
- Test: `tests/*.test.js`; the page check of the new page, of Cube Transition and of the home page; the review kit's short screens, a gallery for the defaults and for each other choice in Try it, clips of the defaults and of the timing settings' choices; frame times
- Write (run folder): `$TEN/checks/L2/` (logs, screenshots, kit output), `$TEN/reports/L2/build.md`, `fix-<k>.md`; the reviewer `review-<k>.md`

**Interfaces:**
- Consumes: Task 0's worktree `.claude/worktrees/ten-L2` on `ten/L2`, its server on port 8962 (started and stopped by the coordinator), `$TEN/lanes.mjs`, `$TEN/frametimes.mjs`, the shared-file version N in the ledger; Phase 0's shared files, its mode press (the shared script presses Show me after See inside or Compare) and its page check; the rollout's review kit and wait tool.
- Produces: branch `ten/L2`: the card `['pixelate-transition','Pixelate Transition','The page breaks into big pixels, then sharpens into the next. Best for galleries.']` (03.17), `PV` key `'pixelate-transition':'pixelate'`, `PLACES` `['page','imgcard']`, `FIND` `'pixelate-transition':['page card','newpage click','pieces glitch']`; Previous: Cube Transition (final), and Cube Transition's Next link to Pixelate Transition; no Next link yet. The reports in `$TEN/reports/L2/`, which the rollout's final review (part 9) reads too.

- [ ] **Step 1: The lane's shared edits (the failing tests)**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L2 || exit 1
node $TEN/lanes.mjs 2 .
git status --short
node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)" | head -10
```

Expected: `lane 2 shared edits applied to .`; then ` M .github/ISSUE_TEMPLATE/config.yml`, ` M 404.html`, ` M README.md`, ` M animations/03-page-transitions/README.md`, ` M animations/03-page-transitions/cube-transition/index.html`, ` M index.html`; then these 7 failing tests and `ℹ fail 7`: `✖ make-famous: on the real home page every card builds, but the eight whose previews need a script or animate in SVG`, `✖ the answers keep the rules every page of a kind shares: transitions answer newpage, loops loop, scroll pages scroll`, `✖ 03-page-transitions/cube-transition uses the guided-steps page correctly`, `✖ the Full catalog in the root README lists every card once, in home order, linked to its live page`, `✖ the counts written in the issue template, the 404 page and the sitemap match the cards`, `✖ the skill and llms.txt are what tools/make-skill.mjs writes from the pages and the home page now`, `✖ llms.txt lists every card once, in the order of CATS, with its live address and its description, and links the skill files`. (Famous effects' test builds every card's preview, which Step 4 adds; the finder's reads each page's kind, and Cube Transition's new Next link opens a page that is not there yet; this plan's run of every lane on a copy of `feat/ten-animations` at `ece2689`, the finder and Famous effects there, gave exactly these.) If `lanes.mjs` stops with `not found (…)`, stop and tell the coordinator, who alone edits `$TEN/lanes.mjs`; before running it again, put the worktree back with `git checkout -- .` (this step makes no other changes; the tool refuses a second run on a changed tree).

- [ ] **Step 2: Write the page: `animations/03-page-transitions/pixelate-transition/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pixelate Transition — Animation Handbook</title>
  <meta name="description" content="The page breaks into big pixels, then sharpens into the next. Best for galleries.">
  <link rel="canonical" href="https://matinmonshizadeh.github.io/animation-handbook/animations/03-page-transitions/pixelate-transition/">
  <link rel="icon" type="image/png" sizes="96x96" href="../../../favicon.png">
  <link rel="icon" type="image/svg+xml" href="../../../favicon.svg">
  <link rel="apple-touch-icon" href="../../../apple-touch-icon.png">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Animation Handbook">
  <meta property="og:title" content="Pixelate Transition — Animation Handbook">
  <meta property="og:description" content="The page breaks into big pixels, then sharpens into the next. Best for galleries.">
  <meta property="og:url" content="https://matinmonshizadeh.github.io/animation-handbook/animations/03-page-transitions/pixelate-transition/">
  <meta property="og:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Pixelate Transition — Animation Handbook">
  <meta name="twitter:description" content="The page breaks into big pixels, then sharpens into the next. Best for galleries.">
  <meta name="twitter:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <script type="application/ld+json">{"@context": "https://schema.org", "@type": "TechArticle", "headline": "Pixelate Transition", "name": "Pixelate Transition", "description": "The page breaks into big pixels, then sharpens into the next. Best for galleries.", "url": "https://matinmonshizadeh.github.io/animation-handbook/animations/03-page-transitions/pixelate-transition/", "inLanguage": "en", "articleSection": "Page Transitions", "isPartOf": {"@type": "WebSite", "name": "Animation Handbook", "url": "https://matinmonshizadeh.github.io/animation-handbook/"}, "author": {"@type": "Person", "name": "matinmonshizadeh"}, "keywords": "web animation, CSS animation, Page Transitions, Pixelate Transition"}</script>
  <style>
    :root{--bg:#0b0b0d;--ui-bg:#111114;--ui-border:rgba(255,255,255,.09);--ui-accent:#b98cff;--ui-text:#f4f4f2;--ui-muted:#8a8a92}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    .stage{display:flex;flex-direction:column;overflow:hidden;background:var(--bg);color:var(--ui-text)}
    .mini-nav{display:flex;gap:6px;padding:10px 12px;background:var(--ui-bg);border-bottom:1px solid var(--ui-border);flex-shrink:0}
    .nav-btn{background:none;border:1px solid var(--ui-border);color:var(--ui-muted);font:inherit;font-size:13px;padding:0 12px;border-radius:4px;cursor:pointer;min-height:44px}
    .nav-btn.active{border-color:var(--ui-accent);color:var(--ui-accent)}
    @media(hover:hover){.nav-btn:hover{border-color:var(--ui-accent)}}
    .page-area{flex:1;position:relative;overflow:hidden;min-height:0}
    #cvs{position:absolute;inset:0;width:100%;height:100%;display:block}
    /* See inside and Compare: plain words over the page */
    .px-lbl{display:none;position:absolute;z-index:2;padding:3px 8px;border-radius:6px;background:rgba(11,11,13,.9);color:#f4f4f2;font:600 13px/1.25 var(--hb-font);white-space:nowrap;pointer-events:none}
    .stage[data-hb-mode="inside"] .in,.stage[data-hb-mode="compare"] .half{display:block}
    .in.copy{white-space:normal;text-align:right;max-width:calc(100% - 150px)}
    .half{bottom:10px}.half.first{left:10px}.half.second{left:calc(50% + 10px)}
  </style>
  <link rel="stylesheet" href="../../../assets/css/demo-page.css?v=10">
  <script src="../../../assets/js/demo-page.js?v=10" defer></script>
</head>
<body class="hb" data-hb-kind="do" data-hb-autoplay>
<nav class="hb-bar" aria-label="Animation Handbook">
  <a class="hb-home" href="../../../"><svg class="hb-mark" viewBox="0 0 32 32" aria-hidden="true"><g class="g"><circle cx="11.16" cy="20.84" r="6.1"/><circle cx="15.12" cy="16.88" r="6.1"/><circle cx="18.51" cy="13.49" r="6.1"/></g><circle class="b" cx="21.2" cy="10.8" r="6.6"/></svg><span>Animation Handbook</span></a>
  <span class="hb-pager"><a href="../cube-transition/" rel="prev" aria-label="Previous: Cube Transition"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg><span><span class="hb-dir">Previous: </span>Cube Transition</span></a></span>
  <a class="hb-star" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener" aria-label="Star on GitHub"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg><span>Star on GitHub</span></a>
</nav>
<main class="hb-page">
  <header class="hb-head">
    <p class="hb-cat">03.17 · Page Transitions</p>
    <h1>Pixelate Transition</h1>
    <p class="hb-lede">The page breaks into big pixels, then sharpens into the next. Best for galleries.</p>
  </header>

  <section class="hb-step hb-watch" aria-labelledby="hb-watch-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">1</span>
      <div><h2 id="hb-watch-title">Click it</h2><p>Click Work or About at the top of the box, or press Show me.</p></div>
    </div>
    <div class="seg hb-modes" role="group" aria-label="What the box shows" data-hb-modes>
      <button type="button" data-hb-mode="normal" class="on" aria-pressed="true">Normal</button>
      <button type="button" data-hb-mode="inside" aria-pressed="false">See inside</button>
      <button type="button" data-hb-mode="compare" aria-pressed="false">Compare</button>
    </div>
    <div class="stage">
      <nav class="mini-nav" id="nav" aria-label="Demo pages"></nav>
      <div class="page-area" id="page-area">
        <canvas id="cvs" role="img" aria-label="A small gallery site whose page breaks into big pixels and sharpens into the next page"></canvas>
        <p class="px-lbl in copy" id="l-copy" aria-hidden="true" data-hb-caption>Small copy · one pixel per block</p>
        <p class="px-lbl in up" id="l-up" aria-hidden="true" data-hb-caption>Scaled up, smoothing off</p>
        <p class="px-lbl in swap" id="l-swap" aria-hidden="true" data-hb-caption>Swap here</p>
        <p class="px-lbl half first" aria-hidden="true" data-hb-caption>Cuts at once</p>
        <p class="px-lbl half second" aria-hidden="true" data-hb-caption>Pixelates</p>
      </div>
    </div>
    <div class="hb-player">
      <button class="hb-play" type="button" id="btn-demo" data-hb-demo><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"/></svg>Show me</button>
      <button class="hb-play" type="button" id="btn-reset" data-hb-reset><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>Reset</button>
      <label class="hb-toggle"><input class="hb-switch" type="checkbox" role="switch" id="slow-tog" data-hb-slowmo autocomplete="off"><span>Slow motion</span></label>
    </div>
    <div class="hb-mode-notes" aria-live="polite">
      <p data-hb-for="inside" hidden>Inside, each block is one pixel of a small copy of the page, scaled up with smoothing off. The strip shows the blocks grow, swap the page at their largest, then shrink.</p>
      <p data-hb-for="compare" hidden>Cuts at once swaps the page in a blink. Pixelates breaks it into blocks, swaps while it cannot be read, then sharpens, so the cut is hidden.</p>
    </div>
  </section>

  <section class="hb-step hb-try" aria-labelledby="hb-try-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">2</span>
      <div><h2 id="hb-try-title">Try it</h2><p>Change a setting, then click a page or press Show me.</p></div>
    </div>
    <div class="hb-settings">
      <div class="hb-setting">
        <p class="hb-setting-name" id="block-lbl">Block size</p>
        <div class="seg" id="block-seg" role="group" aria-labelledby="block-lbl">
          <button type="button" data-b="8" aria-pressed="false">Small</button>
          <button type="button" data-b="16" class="on" aria-pressed="true">Medium</button>
          <button type="button" data-b="28" aria-pressed="false">Large</button>
        </div>
        <p class="hb-hint">How big the squares get mid-change.</p>
      </div>
      <div class="hb-setting">
        <p class="hb-setting-name" id="speed-lbl">Speed</p>
        <div class="seg" id="speed-seg" role="group" aria-labelledby="speed-lbl">
          <button type="button" data-ms="1200" aria-pressed="false">Slow</button>
          <button type="button" data-ms="800" class="on" aria-pressed="true">Normal</button>
          <button type="button" data-ms="500" aria-pressed="false">Fast</button>
        </div>
        <p class="hb-hint">How long the change takes.</p>
      </div>
      <div class="hb-setting">
        <p class="hb-setting-name" id="steps-lbl">How the blocks change</p>
        <div class="seg" id="steps-seg" role="group" aria-labelledby="steps-lbl">
          <button type="button" data-steps="0" class="on" aria-pressed="true">Smoothly</button>
          <button type="button" data-steps="1" aria-pressed="false">In steps</button>
        </div>
        <p class="hb-hint">In steps looks like an old game console.</p>
      </div>
    </div>
  </section>

  <section class="hb-step hb-prompt-step" aria-labelledby="hb-prompt-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">3</span>
      <div><h2 id="hb-prompt-title">Copy the prompt</h2><p>Paste it into an AI assistant such as ChatGPT, Claude or Cursor to build this in your own project.</p></div>
    </div>
    <div class="hb-card">
      <p class="hb-prompt">Add a pixelate transition to [the pictures or views you switch between]. When the visitor moves to the next one, break the current picture into square blocks that grow larger, swap to the new picture while the blocks are at their largest, then shrink the blocks until the new picture is sharp again. Make each block one flat color by drawing the picture very small on a canvas and scaling it back up with smoothing turned off. Keep the page names and buttons outside the pixelated area so they stay readable, and draw only while a change runs. If the visitor has reduced motion turned on, use a short, plain fade instead. Match the settings listed below.</p>
      <div class="hb-chips-box" hidden>
        <p class="hb-chips-title">Your settings</p>
        <ul class="hb-chips"></ul>
      </div>
      <div class="hb-copy-row">
        <button class="hb-copy" type="button"><svg class="hb-ic hb-i-copy" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><svg class="hb-ic hb-i-done" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span class="hb-copy-label" aria-live="polite">Copy prompt</span></button>
        <p class="hb-hint">Replace the words in brackets with your own element. Your settings are added at the end.</p>
      </div>
    </div>
    <div class="hb-star-row"><p>Free and open source. If this helped, a star on GitHub helps other people find it.</p><a class="hb-star-btn" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>Star on GitHub</a></div>
  </section>

  <section class="hb-about" aria-labelledby="hb-what-title">
    <div class="hb-what">
      <h2 id="hb-what-title">What it is</h2>
      <div class="hb-what-text"><p>The full explanation is in <a href="README.md">README.md</a>.</p></div>
    </div>
    <div class="hb-fit">
      <h2>Good for</h2>
      <ul class="hb-tags hb-good"><li>Photo galleries</li><li>Game and retro sites</li><li>Slideshows</li></ul>
      <h3>Avoid on</h3>
      <ul class="hb-tags hb-avoid"><li>Everyday navigation</li><li>Text-heavy pages</li></ul>
    </div>
  </section>

  <section class="hb-related" aria-labelledby="hb-related-title" hidden>
    <h2 id="hb-related-title">Similar animations</h2>
    <div class="hb-rel-list"></div>
  </section>
</main>
<footer class="hb-foot"><span>Animation Handbook</span><a href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener">Source on GitHub</a><a href="#top">Back to top ↑</a></footer>
<script>
  const nav=document.getElementById('nav'),area=document.getElementById('page-area'),cvs=document.getElementById('cvs'),ctx=cvs.getContext('2d');
  const slowTog=document.getElementById('slow-tog'),reduceMQ=matchMedia('(prefers-reduced-motion: reduce)');
  const LABELS={normal:'A small gallery site whose page breaks into big pixels and sharpens into the next page',
    inside:'The page as big blocks with their grid, the small copy they come from, and a strip of block size over a change',
    compare:'The same page change twice: a plain cut on the left, the pixelating change on the right'};
  // Three pages of a made-up photography site, each a drawn picture with a title (in the site's font once it has loaded)
  const PAGES=[
    {name:'Home',draw:(g,w,h)=>{const sky=g.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#28204a');sky.addColorStop(.6,'#c4567a');sky.addColorStop(1,'#f6a85c');g.fillStyle=sky;g.fillRect(0,0,w,h);
      g.fillStyle='#ffe2a0';g.beginPath();g.arc(w*.7,h*.62,h*.16,0,6.283);g.fill();
      g.fillStyle='#3b2c5a';g.beginPath();g.moveTo(0,h);g.lineTo(0,h*.72);g.lineTo(w*.22,h*.5);g.lineTo(w*.42,h*.7);g.lineTo(w*.62,h*.46);g.lineTo(w*.86,h*.68);g.lineTo(w,h*.6);g.lineTo(w,h);g.fill();
      g.fillStyle='#1d1733';g.fillRect(0,h*.86,w,h*.14);return['Northlight','Photography by the sea']}},
    {name:'Work',draw:(g,w,h)=>{g.fillStyle='#14161c';g.fillRect(0,0,w,h);
      const cols=[['#ff7a59','#ffd36e'],['#4fd1c5','#2b6cb0'],['#b794f4','#ed64a6'],['#68d391','#2f855a'],['#f6ad55','#c05621'],['#63b3ed','#5a67d8']];
      cols.forEach((c,i)=>{const x=w*(.08+(i%3)*.3),y=h*(.36+(i/3|0)*.31),tw=w*.26,th=h*.26,gr=g.createLinearGradient(x,y,x+tw,y+th);gr.addColorStop(0,c[0]);gr.addColorStop(1,c[1]);g.fillStyle=gr;g.fillRect(x,y,tw,th)});
      return['Selected work','Six stories from the coast']}},
    {name:'About',draw:(g,w,h)=>{const bg=g.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#2a2016');bg.addColorStop(1,'#6b4a2b');g.fillStyle=bg;g.fillRect(0,0,w,h);
      const cx=w*.72,cy=h*.6,s=h*.2;g.fillStyle='#1b1410';g.fillRect(cx-s*1.3,cy-s*.8,s*2.6,s*1.7);g.fillStyle='#d9c6a5';g.fillRect(cx-s*.5,cy-s*1.05,s,s*.3);
      g.fillStyle='#0f0b08';g.beginPath();g.arc(cx,cy+s*.05,s*.62,0,6.283);g.fill();g.fillStyle='#4a7ab8';g.beginPath();g.arc(cx,cy+s*.05,s*.36,0,6.283);g.fill();
      g.fillStyle='#bfe0ff';g.beginPath();g.arc(cx-s*.12,cy-s*.08,s*.1,0,6.283);g.fill();return['About the studio','Two people, one old camera']}}
  ];
  let blockMax=16,changeMs=800,stepped=false,mode='normal',current=0,dpr=1,W=0,H=0,raf=0,lastT=null,change=null,runTimers=[],font='sans-serif';
  const pics={}; // each page drawn once for a size (the whole area, or a Compare half): pics[page+':'+w] is a canvas
  const small=document.createElement('canvas'),sctx=small.getContext('2d');
  function pic(i,w,h){
    const key=i+':'+w+'x'+h;if(pics[key])return pics[key];
    const c=document.createElement('canvas'),g=c.getContext('2d');c.width=w;c.height=h;
    const [title,sub]=PAGES[i].draw(g,w,h),fs=Math.max(18,Math.min(w*.09,h*.17));
    g.fillStyle='#fff';g.font=`800 ${fs}px ${font}`;g.fillText(title,w*.07,h*.08+fs);
    g.globalAlpha=.75;g.font=`500 ${fs*.42}px ${font}`;g.fillText(sub,w*.07,h*.08+fs*1.62);g.globalAlpha=1;
    return pics[key]=c;
  }
  // The block size at a share p of a change: it grows to the largest at the middle, where the page swaps, then shrinks back; In
  // steps holds it at a few sizes in turn, as old game consoles did
  function blockAt(p){
    const k=p<.5?p*2:(1-p)*2;let b=1+(blockMax-1)*k*k*(3-2*k);
    if(stepped)b=Math.max(1,Math.round(b/blockMax*4)/4*blockMax);
    return b;
  }
  // A page in a rectangle of the canvas (device pixels), as blocks of size b: drawn small, one pixel per block, then scaled back up
  // with smoothing off, so each block is one flat color
  function blocks(img,x,y,w,h,b){
    if(b<1.01*dpr){ctx.drawImage(img,x,y,w,h);return}
    const bw=Math.max(1,Math.ceil(w/b)),bh=Math.max(1,Math.ceil(h/b));
    sctx.imageSmoothingEnabled=true;sctx.drawImage(img,0,0,bw,bh);
    ctx.imageSmoothingEnabled=false;ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.drawImage(small,0,0,bw,bh,x,y,bw*b,bh*b);ctx.restore();
  }
  function draw(){
    const w=cvs.width,h=cvs.height,p=change?change.p:null,b=(p===null?1:blockAt(p))*dpr,show=p!==null&&p>=.5?change.to:current;
    ctx.clearRect(0,0,w,h);
    const fade=!!change&&change.fade!==undefined; // a change under reduced motion: no block grows or shrinks, in any mode
    if(mode==='compare'){
      const half=Math.floor(w/2),ph=h,rest=p===null,rw=w-half-2*dpr;
      // the cut swaps at the very moment the blocks are biggest; at rest the right holds that moment beside the page it cut to;
      // under reduced motion the right fades from one page to the next at that block size
      ctx.drawImage(pic(show,half,ph),0,0,half,ph);
      if(fade){blocks(pic(change.from,rw,ph),half+2*dpr,0,rw,ph,blockMax*dpr);ctx.globalAlpha=change.fade;blocks(pic(change.to,rw,ph),half+2*dpr,0,rw,ph,blockMax*dpr);ctx.globalAlpha=1}
      else blocks(pic(show,rw,ph),half+2*dpr,0,rw,ph,rest?blockMax*dpr:b);
      ctx.fillStyle='#000';ctx.fillRect(half,0,2*dpr,h);
    }else if(mode==='inside')drawInside(show,fade?null:p);
    else if(change&&change.fade!==undefined){ctx.drawImage(pic(change.from,w,h),0,0);ctx.globalAlpha=change.fade;ctx.drawImage(pic(change.to,w,h),0,0);ctx.globalAlpha=1}
    else blocks(pic(show,w,h),0,0,w,h,b);
  }
  // See inside: the page as blocks (the chosen size at rest) with their grid, the small copy in an inset (its size at rest, kept
  // through a change) with an arrow to the box, and a strip of block size over a change, its top marked where the page swaps
  function drawInside(show,p){
    const w=cvs.width,h=cvs.height,b=(p===null?blockMax:Math.max(1,blockAt(p)))*dpr,img=pic(show,w,h);
    blocks(img,0,0,w,h,b);
    if(b>=6*dpr){ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=1;ctx.beginPath();for(let x=b;x<w;x+=b){ctx.moveTo(x,0);ctx.lineTo(x,h)}for(let y=b;y<h;y+=b){ctx.moveTo(0,y);ctx.lineTo(w,y)}ctx.stroke()}
    const bw=Math.ceil(w/b),bh=Math.ceil(h/b),rw=Math.ceil(w/(blockMax*dpr)),rh=Math.ceil(h/(blockMax*dpr)),cell=Math.max(2,Math.floor(Math.min(110*dpr/rw,70*dpr/rh))),iw=rw*cell,ih=rh*cell,ix=w-iw-10*dpr,iy=36*dpr;
    ctx.fillStyle='rgba(11,11,13,.9)';ctx.fillRect(ix-4*dpr,iy-4*dpr,iw+8*dpr,ih+8*dpr);
    sctx.imageSmoothingEnabled=true;sctx.drawImage(img,0,0,bw,bh);ctx.imageSmoothingEnabled=false;ctx.drawImage(small,0,0,bw,bh,ix,iy,iw,ih);
    const ax=ix-6*dpr,ay=iy+ih+6*dpr,tx=w*.42,ty=h*.6;
    ctx.strokeStyle='#ffce5a';ctx.lineWidth=2.5*dpr;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(tx,ty);
    const a=Math.atan2(ty-ay,tx-ax);ctx.moveTo(tx-10*dpr*Math.cos(a-.5),ty-10*dpr*Math.sin(a-.5));ctx.lineTo(tx,ty);ctx.lineTo(tx-10*dpr*Math.cos(a+.5),ty-10*dpr*Math.sin(a+.5));ctx.stroke();
    const sx=10*dpr,sw=Math.min(w*.4,180*dpr),sh=34*dpr,sy=h-sh-10*dpr;
    ctx.fillStyle='rgba(11,11,13,.9)';ctx.fillRect(sx-6*dpr,sy-6*dpr,sw+12*dpr,sh+12*dpr);
    ctx.strokeStyle='#b98cff';ctx.lineWidth=2*dpr;ctx.beginPath();
    for(let i=0;i<=60;i++){const q=i/60,y=sy+sh-(blockAt(q)-1)/(blockMax-1)*sh;i?ctx.lineTo(sx+q*sw,y):ctx.moveTo(sx+q*sw,y)}ctx.stroke();
    ctx.setLineDash([4*dpr,4*dpr]);ctx.strokeStyle='rgba(255,255,255,.6)';ctx.beginPath();ctx.moveTo(sx+sw/2,sy);ctx.lineTo(sx+sw/2,sy+sh);ctx.stroke();ctx.setLineDash([]);
    const q=p===null?.5:p;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(sx+q*sw,sy+sh-(blockAt(q)-1)/(blockMax-1)*sh,5*dpr,0,6.283);ctx.fill();
    // the small copy's name to its left, Scaled up under it beside where the arrow starts, Swap here over the strip's top; the
    // labels are all measured before any moves, so the page lays out once a frame
    const L=['l-copy','l-up','l-swap'].map(id=>{const el=document.getElementById(id);return{el,w:el.offsetWidth,h:el.offsetHeight}});
    const at=[[ix/dpr-12-L[0].w,iy/dpr],[(ix+iw)/dpr-L[1].w,(iy+ih)/dpr+12],[(sx+sw/2)/dpr-L[2].w/2,sy/dpr-30]];
    L.forEach((l,i)=>{l.el.style.left=Math.max(6,Math.min(W-l.w-6,at[i][0]))+'px';l.el.style.top=Math.max(6,Math.min(H-l.h-6,at[i][1]))+'px'});
  }
  // A change runs by the time that passed (three times as long in slow motion) and draws only while it runs
  function loop(ts){
    raf=change?requestAnimationFrame(loop):0;if(!change)return;
    if(lastT===null){lastT=ts;draw();return}
    const dt=Math.min(ts-lastT,50);lastT=ts;
    const dur=(reduceMQ.matches?250:changeMs)*(slowTog.checked?3:1);
    if(change.fade!==undefined)change.fade=Math.min(1,change.fade+dt/dur);
    change.p=Math.min(1,change.p+dt/dur);
    if(change.p>=1){current=change.to;const then=change.then;change=null;draw();if(then)then();return}
    draw();
  }
  function navigate(to,then){
    if(change||to===current)return;
    change={from:current,to,p:0,then};if(reduceMQ.matches)change.fade=0;
    updateNav(to);lastT=null;cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);
  }
  const navBtns=PAGES.map((p,i)=>{const b=document.createElement('button');b.type='button';b.className='nav-btn';b.textContent=p.name;b.addEventListener('click',()=>navigate(i));nav.appendChild(b);return b});
  function updateNav(n){navBtns.forEach((b,i)=>{b.classList.toggle('active',i===n);b.setAttribute('aria-current',i===n?'page':'false')})}
  // Show me: the next page, a hold of 1.2 s, and back to where it started; every pause waits on a timer
  function later(fn,ms){const id=setTimeout(()=>{runTimers=runTimers.filter(t=>t!==id);fn()},ms);runTimers.push(id)}
  function stopRun(){runTimers.forEach(clearTimeout);runTimers=[];if(change)change.then=null}
  document.getElementById('btn-demo').addEventListener('click',()=>{
    stopRun();if(change)return;const start=current;
    navigate((start+1)%PAGES.length,()=>later(()=>navigate(start),1200));
  });
  document.getElementById('btn-reset').addEventListener('click',()=>{stopRun();change=null;cancelAnimationFrame(raf);raf=0;current=0;updateNav(0);draw()});
  document.addEventListener('hb:input',()=>{if(runTimers.length||(change&&change.then))stopRun()});
  // A run never moves the focus, so focus arriving in the stage while one runs (a Tab to the page names) is the visitor's
  document.querySelector('.stage').addEventListener('focusin',e=>{if(e.isTrusted&&(runTimers.length||(change&&change.then)))stopRun()});
  // The mode switch draws the mode at once
  document.addEventListener('hb:mode',e=>{mode=e.detail.mode;cvs.setAttribute('aria-label',LABELS[mode]);if(W)draw()});
  function resize(){
    const w=area.clientWidth,h=area.clientHeight;if(!w||!h||(w===W&&h===H))return;W=w;H=h;
    dpr=Math.min(devicePixelRatio||1,2);cvs.width=Math.round(W*dpr);cvs.height=Math.round(H*dpr);small.width=cvs.width;small.height=cvs.height;
    for(const k in pics)delete pics[k];
    draw();
  }
  function choices(id,pick){
    const buttons=document.querySelectorAll('#'+id+' button');
    buttons.forEach(b=>b.addEventListener('click',()=>{
      buttons.forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',String(x===b))});
      pick(b.dataset);if(W)draw();
    }));
  }
  choices('block-seg',d=>{blockMax=+d.b});
  choices('speed-seg',d=>{changeMs=+d.ms});
  choices('steps-seg',d=>{stepped=d.steps==='1'});
  // Under reduced motion a change is a short plain fade, and both views are still pictures
  if(reduceMQ.matches){
    document.querySelector('[data-hb-for="inside"]').textContent='Shown still: each block is one pixel of a small copy of the page, scaled up with smoothing off; the strip shows the blocks grow, swap the page at their largest and shrink.';
    document.querySelector('[data-hb-for="compare"]').textContent='Shown still: Cuts at once has swapped to the new page at once, while Pixelates is caught at its largest blocks, the moment the page swaps.';
  }
  updateNav(0);
  new ResizeObserver(resize).observe(area);
  resize();
  // The titles use the site's font: once it has loaded, the pages are drawn again
  document.fonts.ready.then(()=>{font=getComputedStyle(document.body).fontFamily;for(const k in pics)delete pics[k];if(W)draw()});
</script>
</body>
</html>
```

Then give it the shared-file version the branch uses (the ledger's N; nothing changes when N is 10):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L2 || exit 1
N=$(grep -o 'shared files ?v=[0-9]*' $TEN/ledger.md | head -1 | grep -o '[0-9]*$')
sed -i "s/demo-page\.css?v=10/demo-page.css?v=$N/; s/demo-page\.js?v=10/demo-page.js?v=$N/" animations/03-page-transitions/pixelate-transition/index.html
grep -c "demo-page\.css?v=$N\|demo-page\.js?v=$N" animations/03-page-transitions/pixelate-transition/index.html
```

Expected: `2`.

- [ ] **Step 3: Write the README: `animations/03-page-transitions/pixelate-transition/README.md`**

````markdown
# Pixelate Transition

[Live demo](https://matinmonshizadeh.github.io/animation-handbook/animations/03-page-transitions/pixelate-transition/)

## What it is
A pixelate transition hides the change from one page or picture to the next behind big square blocks. The current page breaks into blocks of flat color that grow larger, the page swaps while it cannot be read, and the blocks shrink until the new page is sharp. It looks like a picture losing and regaining focus in an old video game.

## When to use it
- Photo galleries and portfolios, between one picture and the next
- Game, music and retro-themed sites
- Slideshows and story pages where each step is a full picture
- A playful change between the sections of a landing page

## How it works
The pages are pictures drawn once onto hidden canvases. During a change, each frame draws the current page very small on a second canvas, one pixel per block, with smoothing on, so each pixel becomes the average color of its block; then it draws that small copy back up to the full size with smoothing off, so every pixel turns into one flat square:

```js
const bw = Math.ceil(w / b), bh = Math.ceil(h / b);          // b: the block size this frame
small.imageSmoothingEnabled = true;  small.drawImage(page, 0, 0, bw, bh);
ctx.imageSmoothingEnabled = false;   ctx.drawImage(smallCanvas, 0, 0, bw, bh, 0, 0, bw * b, bh * b);
```

The block size follows the change: it grows from one pixel to the largest size at the middle and shrinks back, and the page swaps exactly at the middle, when the blocks are largest. In steps holds the block size at a few sizes in turn instead of growing smoothly:

```js
const k = p < .5 ? p * 2 : (1 - p) * 2;                       // p: 0 to 1 over the change
let b = 1 + (blockMax - 1) * k * k * (3 - 2 * k);
if (stepped) b = Math.max(1, Math.round(b / blockMax * 4) / 4 * blockMax);
```

A change runs by the time that has passed, three times as long in slow motion, and nothing is drawn between changes. The page names are real buttons above the canvas, so they never pixelate and stay easy to read and to reach with the keyboard. The page titles are drawn in the site's font once it has loaded. Under reduced motion a change is a short, plain fade.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Block size | Medium | How big the squares are at the middle of a change: small is 8 pixels, medium 16 and large 28 |
| Speed | Normal | How long a change takes: slow is 1.2 seconds, normal 0.8 seconds and fast 0.5 seconds |
| How the blocks change | Smoothly | Smoothly grows and shrinks the blocks evenly; in steps holds them at a quarter, a half, three quarters and the full size in turn |

## Production notes
- **Two small drawings a frame.** Draw the page small and back up with `drawImage`; never read and average pixels in a loop. Keep the hidden page canvases at most twice the screen's pixels.
- **Pictures, not live pages.** A canvas cannot pixelate HTML. For real pages, take a picture of each view first (html2canvas or a server-side screenshot), or pixelate only the hero picture and fade the rest. With the View Transitions API, the old and new views can be shown as pictures that a shader or canvas pixelates.
- **WebGL.** A fragment shader that rounds each pixel's coordinates to its block (`floor(uv * blocks) / blocks`) pixelates a full-screen view in one pass; PixiJS has a ready-made pixelate filter.
- **Keep text readable.** Leave navigation and buttons out of the pixelated area, and keep the change short: it hides the page for a moment by design.
- **Reduced motion.** Use a short, plain crossfade instead.

## See also
- [Dissolve Transition](../dissolve/) — the page breaks into tiles that give way in an order
- [Blur Transition](../blur-transition/) — the page goes out of focus and comes back as the next one
- [ASCII / Halftone](../../06-3d-advanced/ascii-halftone/) — a picture drawn small and shown as characters or dots
````

- [ ] **Step 4: The home page preview**

In the worktree's `index.html`: (a) insert these lines, and one empty line after them, right before the line `/* ── bespoke: 04 Micro-Interactions ── */` (the end of the 03 bespoke block):

```css
.pv-pixelate{background:#14161c;overflow:hidden}
.pv-pixelate>*{position:absolute;inset:0;width:100%;height:100%;opacity:0;animation:pixelate-a 6s steps(1,end) infinite}
.pv-pixelate .pa{background:radial-gradient(circle at 70% 62%,#ffe2a0 0 13%,#0000 13.5%),linear-gradient(162deg,#0000 58%,#3b2c5a 58.5% 86%,#1d1733 86.5%),linear-gradient(#28204a,#c4567a 60%,#f6a85c)}
.pv-pixelate .ma{animation-name:pixelate-ma}.pv-pixelate .mb{animation-name:pixelate-mb}
.pv-pixelate .pb{background:linear-gradient(135deg,#ff7a59,#ffd36e) 8% 34%/24% 26% no-repeat,linear-gradient(135deg,#4fd1c5,#2b6cb0) 38% 34%/24% 26% no-repeat,linear-gradient(135deg,#b794f4,#ed64a6) 68% 34%/24% 26% no-repeat,linear-gradient(135deg,#68d391,#2f855a) 8% 66%/24% 26% no-repeat,linear-gradient(135deg,#f6ad55,#c05621) 38% 66%/24% 26% no-repeat,linear-gradient(135deg,#63b3ed,#5a67d8) 68% 66%/24% 26% no-repeat,#14161c;animation-name:pixelate-b}
@keyframes pixelate-a{0%{opacity:1}30%{opacity:0}92%{opacity:1}}
@keyframes pixelate-ma{0%{opacity:0}30%{opacity:1}38%{opacity:0}86%{opacity:1}92%{opacity:0}}
@keyframes pixelate-mb{0%{opacity:0}38%{opacity:1}46%{opacity:0}80%{opacity:1}86%{opacity:0}}
@keyframes pixelate-b{0%{opacity:0}46%{opacity:1}80%{opacity:0}}
```

(b) insert this line right after the line that starts with `case 'cubepage':`:

```js
    case 'pixelate': return '<span class="pa anim"></span><svg class="ma anim" viewBox="0 0 8 5" preserveAspectRatio="none"><rect x="0" y="0" width="1.02" height="1.02" fill="#2b2250"/><rect x="1" y="0" width="1.02" height="1.02" fill="#2b2250"/><rect x="2" y="0" width="1.02" height="1.02" fill="#2b2250"/><rect x="3" y="0" width="1.02" height="1.02" fill="#2b2250"/><rect x="4" y="0" width="1.02" height="1.02" fill="#2b2250"/><rect x="5" y="0" width="1.02" height="1.02" fill="#2b2250"/><rect x="6" y="0" width="1.02" height="1.02" fill="#2b2250"/><rect x="7" y="0" width="1.02" height="1.02" fill="#2b2250"/><rect x="0" y="1" width="1.02" height="1.02" fill="#3a2758"/><rect x="1" y="1" width="1.02" height="1.02" fill="#3a2758"/><rect x="2" y="1" width="1.02" height="1.02" fill="#4a2b60"/><rect x="3" y="1" width="1.02" height="1.02" fill="#4a2b60"/><rect x="4" y="1" width="1.02" height="1.02" fill="#4a2b60"/><rect x="5" y="1" width="1.02" height="1.02" fill="#4a2b60"/><rect x="6" y="1" width="1.02" height="1.02" fill="#3a2758"/><rect x="7" y="1" width="1.02" height="1.02" fill="#3a2758"/><rect x="0" y="2" width="1.02" height="1.02" fill="#9a4a74"/><rect x="1" y="2" width="1.02" height="1.02" fill="#b04f78"/><rect x="2" y="2" width="1.02" height="1.02" fill="#c4567a"/><rect x="3" y="2" width="1.02" height="1.02" fill="#c4567a"/><rect x="4" y="2" width="1.02" height="1.02" fill="#d87a6e"/><rect x="5" y="2" width="1.02" height="1.02" fill="#ffd994"/><rect x="6" y="2" width="1.02" height="1.02" fill="#d87a6e"/><rect x="7" y="2" width="1.02" height="1.02" fill="#c4567a"/><rect x="0" y="3" width="1.02" height="1.02" fill="#3b2c5a"/><rect x="1" y="3" width="1.02" height="1.02" fill="#e08a64"/><rect x="2" y="3" width="1.02" height="1.02" fill="#3b2c5a"/><rect x="3" y="3" width="1.02" height="1.02" fill="#3b2c5a"/><rect x="4" y="3" width="1.02" height="1.02" fill="#e8966a"/><rect x="5" y="3" width="1.02" height="1.02" fill="#f3b07a"/><rect x="6" y="3" width="1.02" height="1.02" fill="#3b2c5a"/><rect x="7" y="3" width="1.02" height="1.02" fill="#3b2c5a"/><rect x="0" y="4" width="1.02" height="1.02" fill="#231a3c"/><rect x="1" y="4" width="1.02" height="1.02" fill="#231a3c"/><rect x="2" y="4" width="1.02" height="1.02" fill="#231a3c"/><rect x="3" y="4" width="1.02" height="1.02" fill="#231a3c"/><rect x="4" y="4" width="1.02" height="1.02" fill="#231a3c"/><rect x="5" y="4" width="1.02" height="1.02" fill="#231a3c"/><rect x="6" y="4" width="1.02" height="1.02" fill="#231a3c"/><rect x="7" y="4" width="1.02" height="1.02" fill="#231a3c"/></svg><svg class="mb anim" viewBox="0 0 8 5" preserveAspectRatio="none"><rect x="0" y="0" width="1.02" height="1.02" fill="#14161c"/><rect x="1" y="0" width="1.02" height="1.02" fill="#14161c"/><rect x="2" y="0" width="1.02" height="1.02" fill="#14161c"/><rect x="3" y="0" width="1.02" height="1.02" fill="#14161c"/><rect x="4" y="0" width="1.02" height="1.02" fill="#14161c"/><rect x="5" y="0" width="1.02" height="1.02" fill="#14161c"/><rect x="6" y="0" width="1.02" height="1.02" fill="#14161c"/><rect x="7" y="0" width="1.02" height="1.02" fill="#14161c"/><rect x="0" y="1" width="1.02" height="1.02" fill="#14161c"/><rect x="1" y="1" width="1.02" height="1.02" fill="#ff8a5c"/><rect x="2" y="1" width="1.02" height="1.02" fill="#ffb764"/><rect x="3" y="1" width="1.02" height="1.02" fill="#14161c"/><rect x="4" y="1" width="1.02" height="1.02" fill="#3fa9c0"/><rect x="5" y="1" width="1.02" height="1.02" fill="#14161c"/><rect x="6" y="1" width="1.02" height="1.02" fill="#c08ae8"/><rect x="7" y="1" width="1.02" height="1.02" fill="#d66fb0"/><rect x="0" y="2" width="1.02" height="1.02" fill="#14161c"/><rect x="1" y="2" width="1.02" height="1.02" fill="#ffa060"/><rect x="2" y="2" width="1.02" height="1.02" fill="#ffc868"/><rect x="3" y="2" width="1.02" height="1.02" fill="#14161c"/><rect x="4" y="2" width="1.02" height="1.02" fill="#2f86b8"/><rect x="5" y="2" width="1.02" height="1.02" fill="#14161c"/><rect x="6" y="2" width="1.02" height="1.02" fill="#c98ad8"/><rect x="7" y="2" width="1.02" height="1.02" fill="#e07ab4"/><rect x="0" y="3" width="1.02" height="1.02" fill="#14161c"/><rect x="1" y="3" width="1.02" height="1.02" fill="#5cc286"/><rect x="2" y="3" width="1.02" height="1.02" fill="#3c9b62"/><rect x="3" y="3" width="1.02" height="1.02" fill="#14161c"/><rect x="4" y="3" width="1.02" height="1.02" fill="#f39a4c"/><rect x="5" y="3" width="1.02" height="1.02" fill="#14161c"/><rect x="6" y="3" width="1.02" height="1.02" fill="#5fa8e8"/><rect x="7" y="3" width="1.02" height="1.02" fill="#6a76d8"/><rect x="0" y="4" width="1.02" height="1.02" fill="#14161c"/><rect x="1" y="4" width="1.02" height="1.02" fill="#4caf74"/><rect x="2" y="4" width="1.02" height="1.02" fill="#2f855a"/><rect x="3" y="4" width="1.02" height="1.02" fill="#14161c"/><rect x="4" y="4" width="1.02" height="1.02" fill="#d27a38"/><rect x="5" y="4" width="1.02" height="1.02" fill="#14161c"/><rect x="6" y="4" width="1.02" height="1.02" fill="#5b9ae0"/><rect x="7" y="4" width="1.02" height="1.02" fill="#5a67d8"/></svg><span class="pb anim"></span>';
```

(c) in `const STILL={`, the map's last line ends with `izoom:.02` (the line before `};`): make it end with `izoom:.02,pixelate:.34` (the middle of its loop is not a clear frame; reduced motion holds the preview there).

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L2 || exit 1
grep -c "pv-pixelate" index.html; grep -c "case 'pixelate':" index.html
```

Expected: a number above 1 (the preview's CSS rules), then `1` (its case).

- [ ] **Step 5: Write the generated files, then the tests pass**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L2 || exit 1
node tools/update-sitemap.mjs && node tools/make-skill.mjs
node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)"
```

Expected: `ℹ fail 0` (this plan's run of every lane on a copy of `feat/ten-animations` at `ece2689`, the finder and Famous effects there, gave it: 1717 pass). If only `tests/finder.test.js` fails (its case 9 waits for Task 11 when the finder has changed since), note the failing lines in your report for Task 11 (lanes never change `tests/`) and go on; any other failure names what to fix in this lane's files.

- [ ] **Step 6: The page check and the short screens (each a background command, waited on)**

The coordinator's server for this lane answers on port 8962: `curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8962/` prints `200` (if not, ask the coordinator). The review kit finds pages under its own folder's root, so it runs from a copy in the worktree (`.superpowers/` is ignored by git):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit
cd $REPO/.claude/worktrees/ten-L2 || exit 1
mkdir -p .superpowers/sdd/kit/review-kit $TEN/checks/L2 && cp $KIT/record.mjs $KIT/kit-lib.mjs .superpowers/sdd/kit/review-kit/ && git status --short | grep -c superpowers
```

Expected: `0` (git does not see the copy). Then start these two, each as its own background command (the round number `1`, then `2`, `3` after fixes):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L2 || exit 1
node $RUN/slot.mjs run ten-L2 -- node tools/check-pages.mjs --base http://127.0.0.1:8962 --out $TEN/checks/L2/1 animations/03-page-transitions/pixelate-transition animations/03-page-transitions/cube-transition home > $TEN/checks/L2/1.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L2/1.log
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L2 || exit 1
node $RUN/slot.mjs run ten-L2 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8962 --short --out $TEN/checks/L2/short-1 animations/03-page-transitions/pixelate-transition > $TEN/checks/L2/short-1.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L2/short-1.log
```

Wait on each with `node $RUN/wait-log.mjs $TEN/checks/L2/1.log` and `… short-1.log` (again while it says `still running`), then: `grep -c '^ok' $TEN/checks/L2/1.log; grep '^FAIL' $TEN/checks/L2/1.log; tail -2 $TEN/checks/L2/short-1.log`.

Expected: `18` (six `ok` lines each for `pixelate-transition`, `cube-transition`, the home page), no `FAIL` line, and `27 short-screen pictures checked, 0 with labels cut or overlapping, 0 skipped, 0 failed` with `EXIT=0` (this plan's runs gave exactly these). A `FAIL` line or a cut or overlapping label names the problem (the real branch may differ from the copy this plan was checked on; the ledger's first line says how): fix it in this lane's files, keeping the page's behavior, and run both again as round 2, 3; every round after a change ends with all lines `ok`.

- [ ] **Step 7: Every choice in Try it, in both views (acceptance 7), and the motion in clips**

Two background commands. The first runs the kit's gallery (pictures only: Normal, See inside and Compare at 1280 and 375) once with the defaults (`press-0`) and once for each choice that is not a default and each switch in Try it (never Loop, Slow motion, Pause or Play: playback is not a setting), each into its own folder. The second records the clips (Normal, See inside and Compare at 1280, about seven seconds each, frames kept) with the defaults (`clip-0`) and for each choice of the settings that change only timing or show only while the demo moves (G1, G11): the stills never show a run's middle.

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L2 || exit 1
i=0; for sel in "" "#block-seg [data-b='8']" "#block-seg [data-b='28']" "#speed-seg [data-ms='1200']" "#speed-seg [data-ms='500']" "#steps-seg [data-steps='1']"; do echo "== press-$i ${sel:-defaults}"; node $RUN/slot.mjs run ten-L2 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8962 --gallery ${sel:+--press "$sel"} --out $TEN/checks/L2/press-$i animations/03-page-transitions/pixelate-transition || echo "run $i failed"; i=$((i+1)); done > $TEN/checks/L2/press.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L2/press.log
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L2 || exit 1
i=0; for sel in "" "#speed-seg [data-ms='1200']" "#speed-seg [data-ms='500']" "#steps-seg [data-steps='1']"; do echo "== clip-$i ${sel:-defaults}"; node $RUN/slot.mjs run ten-L2 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8962 --only clips --keep-frames ${sel:+--press "$sel"} --out $TEN/checks/L2/clip-$i animations/03-page-transitions/pixelate-transition || echo "run $i failed"; i=$((i+1)); done > $TEN/checks/L2/clips.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L2/clips.log
```

Wait on each log with `node $RUN/wait-log.mjs`. Expected: 6 `== press-…` lines, each run ending `done  6 pictures, 0 clips and 0 comparisons made, 0 skipped, 0 failed`, and 4 `== clip-…` lines, each ending `done  0 pictures, 3 clips and 0 comparisons made, 0 skipped, 0 failed`; no `failed` line, no `was not found`, `EXIT=0` (the kit's lines as this plan's runs printed them). Read each gallery's See inside and Compare pictures at 1280 beside `press-0`'s: each choice visibly changes Normal and both views. Read three frames from the middle of each See inside and Compare clip (the log's `frames kept in <folder>` lines name the folders; for a timing choice, the same frames beside `clip-0`'s): the views move as the spec says, nothing jumps or covers the stage in mid-run (this plan's clips found See inside's small copy filling Pixelate Transition's stage while the blocks were small, a fault no still showed). A choice that changes nothing in a view is a fix (the owner's rule: every setting and control visibly changes the stage and both views). Then remove the frame folders: `grep -o 'frames kept in .*' $TEN/checks/L2/clips.log | sed 's/^frames kept in //' | while read -r f; do rm -rf "$f"; done`.

- [ ] **Step 8: Look at the screenshots and check by hand**

Open `$TEN/checks/L2/<round>/03-pixelate-transition-{desktop,phone,phone-reduced}-{inside,compare}.png`, the Normal ones and the short screens' pictures: both views read as the spec says, no label covers another or the part it names, nothing overflows at 320. Then, in the served page (a headless run through the pool, or by reading the code where a run cannot show it):

- Work and About at the top of the box are real buttons, at least 44px tall on phones; a click pixelates to that page; Show me goes to the next page and back in about 2.8 s and ends on the page it started from (a Tab into the buttons stops it); Reset returns to Home; at rest the page is sharp on a 2x screen too (drawn straight, not through blocks).
- Block size (Small, Medium, Large), Speed (Slow, Normal, Fast) and How the blocks change (Smoothly, In steps) each change the next change and both views (See inside's inset and strip, Compare's right half).
- Compare rests with the right half at its largest blocks beside the left half's plain cut; See inside rests at the chosen block size with its grid, and its small copy keeps its rest size all through a change (the clips show it).
- Under reduced motion a change is a 250 ms plain fade in every mode: Compare's left half cuts at the fade's middle while its right half crossfades at the largest blocks, and See inside shows the new page at that block size with the strip's dot held at the swap; nothing grows or shrinks, and nothing is drawn between changes.

Decisions already made in this page (keep them; a reviewer weighs them): Compare's halves sit side by side at every width and its note names them by their labels (no left or right). See inside draws its grid only where blocks are at least 6 device pixels (fewer lines a frame), and measures its labels before it moves them (one layout a frame). See inside's inset keeps the size it has at rest while the blocks change, and the small copy of each moment is drawn into it: drawn at its own size, it filled the box while the blocks were small (this plan's clips found it; no still shows a change's middle).

- [ ] **Step 9: Frame times (required: a canvas or mask page)**

One background command, waited on with `wait-log.mjs`:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L2 || exit 1
(node $RUN/slot.mjs run ten-L2 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8962 --modes normal,inside,compare animations/03-page-transitions/pixelate-transition; node $RUN/slot.mjs run ten-L2 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8962 --phone --modes normal,inside,compare animations/03-page-transitions/pixelate-transition; node $RUN/slot.mjs run ten-L2 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8962 animations/03-page-transitions/dissolve; node $RUN/slot.mjs run ten-L2 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8962 --phone animations/03-page-transitions/dissolve) > $TEN/checks/L2/frames.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L2/frames.log
```

Expected: a median of 16.7 ms in every mode at both sizes, and no larger share of frames slower than 20 ms than Dissolve Transition measured the same way, within a few points (the machine's other work moves these numbers; run again when one looks off). This plan's runs: desktop 0 / 1 / 0%, phone 0 / 1 / 0% (earlier runs, the machine busy: See inside 1 to 14% on a desktop); Dissolve Transition 4 to 26% on a desktop and 1% on a phone. A page that misses lightens its per-frame work (a smaller grid, fewer dots, less drawn per frame) until it meets this, and says what it changed.

- [ ] **Step 10: Commit, and the build report**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L2 || exit 1
[ "$(git rev-parse --abbrev-ref HEAD)" = ten/L2 ] || exit 1
git add -A && git status --short
git commit -m "feat: 03.17 Pixelate Transition, with See inside and Compare from the start (lane 2)"
git log --oneline -1
```

Expected before the commit: `A  animations/03-page-transitions/pixelate-transition/README.md`, `A  animations/03-page-transitions/pixelate-transition/index.html`, `M  .github/ISSUE_TEMPLATE/config.yml`, `M  404.html`, `M  README.md`, `M  animations/03-page-transitions/README.md`, `M  animations/03-page-transitions/cube-transition/index.html`, `M  index.html`, `M  llms.txt`, `M  sitemap.xml` and the changed files under `skills/animation-handbook/`; nothing else (the kit's copy is ignored; logs and pictures are in `$TEN`). Then write `$TEN/reports/L2/build.md`: first line `RESULT: built <commit>`, then the line count, the page check's `ok` count and its round, the short screens' last line, the galleries and clips looked at (one line per choice: what changes in each view; one line per clip: what moves), the tests' pass and fail line, the frame times, the hand checks' results, every place the page departs from the spec or this task and why, and any shared-file need (the coordinator appends it to `$RUN/shared-wishes.md`; there should be none). Reply to the coordinator in at most three lines.

- [ ] **Step 11: Review, at most three fix rounds**

The coordinator dispatches a reviewer (strongest model, never the builder) with: the spec's section, this task, the builder's report, `git -C $REPO diff feat/ten-animations...ten/L2`, the newest check round and its screenshots, the short screens, the galleries, the clips and the frame times. The reviewer reads CLAUDE.md, the Global Constraints, `$RUN/lessons.md`, `$RUN/briefs/RULINGS.md`, `$RUN/brief-rulings.md`, `$RUN/briefs/OPEN-QUESTIONS.md` and, once it holds the owner's verdict, `$RUN/rulings-159.md`, and checks the diff against them, the rollout's acceptance list (section 1 of the rollout spec), the spec's section and the per-frame work, looking hard at the nav buttons' size on phones; nothing drawn between changes; the inset (its size through a change) and the strip labels at 375 and 320. It writes `$TEN/reports/L2/review-<k>.md`: first line `RESULT: approved` or `RESULT: changes <count>`, then numbered findings (Critical, Important, Minor), and replies in at most three lines. Each fix round: the builder fixes, runs Steps 5 and 6 again (and the galleries, clips or frame times a fix touches), commits `fix: Pixelate Transition: <what>` after the branch check, writes `$TEN/reports/L2/fix-<k>.md` (`RESULT: built <commit>`), and the reviewer re-reviews only the fix. After three rounds the coordinator steps in. When approved, the coordinator stops the lane's server and adds the ledger line `<date time>  L2  approved at <commit>; check rounds <k>; frames <numbers>; departures: <none or a list>; reports reports/L2/`.

---

### Task 3: L3 · 04.42 Before/After Slider (`ten/L3`, port 8963)

Do it · step 1 "Drag it" · player bar: Show me, Reset and Slow motion (the page slows itself). See inside: Before at the back, After in front with its hidden part faint and its window dashed, the line on the window's edge. Compare: "Resizes it" (a copy whose top picture is squeezed) beside "Uncovers it", one line driving both. Spec: "3 · Before/After Slider (04.42)" in `docs/superpowers/specs/2026-10-13-ten-new-animations-design.md`.

**Files:**
- Create: `animations/04-micro-interactions/before-after-slider/index.html` (344 lines), `animations/04-micro-interactions/before-after-slider/README.md`
- Modify (by `$TEN/lanes.mjs 3`): `index.html` (the card after Dynamic Island's, the `PV` key, the `PLACES` row, the `FIND` row (the finder is on the branch), every count 166 → 167), `README.md` (counts, 04's count 41 → 42, the catalog line), `animations/04-micro-interactions/README.md` (its line), `.github/ISSUE_TEMPLATE/config.yml`, `404.html`, `animations/04-micro-interactions/dynamic-island/index.html` (its first Next link, to Before/After Slider)
- Modify (Step 4, by hand): `index.html`: the preview's CSS at the end of the 04 bespoke block, `case 'beforeafter':` in `pvMarkup()`
- Regenerate: `sitemap.xml`, `llms.txt`, `skills/animation-handbook/` (their tools)
- Test: `tests/*.test.js` (with a proof edit, put back); the page check of the new page, of Dynamic Island and of the home page; the review kit's short screens, a gallery for the defaults and for each other choice in Try it, clips of the defaults
- Write (run folder): `$TEN/checks/L3/` (logs, screenshots, kit output), `$TEN/reports/L3/build.md`, `fix-<k>.md`; the reviewer `review-<k>.md`

**Interfaces:**
- Consumes: Task 0's worktree `.claude/worktrees/ten-L3` on `ten/L3`, its server on port 8963 (started and stopped by the coordinator), `$TEN/lanes.mjs`, the shared-file version N in the ledger; Phase 0's shared files, its mode press (the shared script presses Show me after See inside or Compare) and its page check; the rollout's review kit and wait tool.
- Produces: branch `ten/L3`: the card `['before-after-slider','Before/After Slider','Drag a line across two pictures to compare them. Best for photo edits.']` (04.42), `PV` key `'before-after-slider':'beforeafter'`, `PLACES` `['imgcard']`, `FIND` `'before-after-slider':['card','drag','reveal slide']`; Previous: Dynamic Island (final), and Dynamic Island's Next link to Before/After Slider; no Next link yet. For Task 11: `'before-after-slider'` in the `'04-micro-interactions'` list of `KEYBOARD_PAGES`. The reports in `$TEN/reports/L3/`, which the rollout's final review (part 9) reads too.

- [ ] **Step 1: The lane's shared edits (the failing tests)**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L3 || exit 1
node $TEN/lanes.mjs 3 .
git status --short
node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)" | head -10
```

Expected: `lane 3 shared edits applied to .`; then ` M .github/ISSUE_TEMPLATE/config.yml`, ` M 404.html`, ` M README.md`, ` M animations/04-micro-interactions/README.md`, ` M animations/04-micro-interactions/dynamic-island/index.html`, ` M index.html`; then these 7 failing tests and `ℹ fail 7`: `✖ make-famous: on the real home page every card builds, but the eight whose previews need a script or animate in SVG`, `✖ the answers keep the rules every page of a kind shares: transitions answer newpage, loops loop, scroll pages scroll`, `✖ 04-micro-interactions/dynamic-island uses the guided-steps page correctly`, `✖ the Full catalog in the root README lists every card once, in home order, linked to its live page`, `✖ the counts written in the issue template, the 404 page and the sitemap match the cards`, `✖ the skill and llms.txt are what tools/make-skill.mjs writes from the pages and the home page now`, `✖ llms.txt lists every card once, in the order of CATS, with its live address and its description, and links the skill files`. (Famous effects' test builds every card's preview, which Step 4 adds; the finder's reads each page's kind, and Dynamic Island's new Next link opens a page that is not there yet; this plan's run of every lane on a copy of `feat/ten-animations` at `ece2689`, the finder and Famous effects there, gave exactly these.) If `lanes.mjs` stops with `not found (…)`, stop and tell the coordinator, who alone edits `$TEN/lanes.mjs`; before running it again, put the worktree back with `git checkout -- .` (this step makes no other changes; the tool refuses a second run on a changed tree).

- [ ] **Step 2: Write the page: `animations/04-micro-interactions/before-after-slider/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Before/After Slider — Animation Handbook</title>
  <meta name="description" content="Drag a line across two pictures to compare them. Best for photo edits.">
  <link rel="canonical" href="https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/before-after-slider/">
  <link rel="icon" type="image/png" sizes="96x96" href="../../../favicon.png">
  <link rel="icon" type="image/svg+xml" href="../../../favicon.svg">
  <link rel="apple-touch-icon" href="../../../apple-touch-icon.png">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Animation Handbook">
  <meta property="og:title" content="Before/After Slider — Animation Handbook">
  <meta property="og:description" content="Drag a line across two pictures to compare them. Best for photo edits.">
  <meta property="og:url" content="https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/before-after-slider/">
  <meta property="og:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Before/After Slider — Animation Handbook">
  <meta name="twitter:description" content="Drag a line across two pictures to compare them. Best for photo edits.">
  <meta name="twitter:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <script type="application/ld+json">{"@context": "https://schema.org", "@type": "TechArticle", "headline": "Before/After Slider", "name": "Before/After Slider", "description": "Drag a line across two pictures to compare them. Best for photo edits.", "url": "https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/before-after-slider/", "inLanguage": "en", "articleSection": "Micro-Interactions", "isPartOf": {"@type": "WebSite", "name": "Animation Handbook", "url": "https://matinmonshizadeh.github.io/animation-handbook/"}, "author": {"@type": "Person", "name": "matinmonshizadeh"}, "keywords": "web animation, CSS animation, Micro-Interactions, Before/After Slider"}</script>
  <style>
    :root{--ui-accent:#ff9d5c}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    /* --v: how much of After shows, 0 to 1 (the line's place from the left, or from the bottom in Top and bottom) */
    .stage{--v:.5;position:relative;display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);background:#0b0b0d;-webkit-user-select:none;user-select:none}
    .defs{position:absolute;width:0;height:0;overflow:hidden}
    .ba{position:relative;min-width:0;overflow:hidden;touch-action:pan-y;cursor:ew-resize}
    .vert .ba{cursor:pointer}
    .layer,.win,.pic,.rail{position:absolute;inset:0}
    .pic svg{display:block;width:100%;height:100%}
    /* Before lies whole underneath, gray and flat. After sits in a window that slides with the line, and its picture slides back
       by the same amount, so it never moves: two transforms, nothing redrawn */
    .before{filter:grayscale(1) contrast(.72) brightness(1.08)}
    .win{overflow:hidden;transform:translateX(calc((var(--v) - 1) * 100%));will-change:transform}
    .win .pic{transform:translateX(calc((1 - var(--v)) * 100%));will-change:transform}
    .vert .win{transform:translateY(calc((1 - var(--v)) * 100%))}
    .vert .win .pic{transform:translateY(calc((var(--v) - 1) * 100%))}
    .rail{pointer-events:none;transform:translateX(calc(var(--v) * 100%));will-change:transform}
    .vert .rail{transform:translateY(calc((1 - var(--v)) * 100%))}
    .line{position:absolute;left:-1px;top:0;bottom:0;width:2px;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.25)}
    .vert .line{left:0;right:0;top:-1px;bottom:auto;width:auto;height:2px}
    /* The handle: a slider the keyboard can move too, at least 48px to touch whatever its look */
    .handle{position:absolute;left:0;top:50%;width:48px;height:48px;margin:-24px 0 0 -24px;display:grid;place-items:center;border-radius:24px;pointer-events:auto;cursor:grab;touch-action:none}
    .vert .handle{left:50%;top:0}
    .h-bar .handle{height:68px;margin-top:-34px}
    .vert.h-bar .handle{width:68px;height:48px;margin:-24px 0 0 -34px}
    .grip{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:#fff;color:#16161a;box-shadow:0 2px 10px rgba(0,0,0,.4)}
    .grip svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
    .vert .grip svg{transform:rotate(90deg)}
    .h-bar .grip{width:12px;height:60px;border-radius:6px}
    .vert.h-bar .grip{width:60px;height:12px}
    .h-bar .grip svg,.h-line .grip{opacity:0}
    .tag{position:absolute;top:10px;padding:4px 10px;border-radius:999px;background:rgba(11,11,13,.78);color:#f4f4f2;font:600 13px/1.2 var(--hb-font);transition:opacity .25s}
    .tag-a{left:10px}.tag-b{right:10px}
    .vert .tag-b{right:auto;left:10px}.vert .tag-a{top:auto;bottom:10px}
    .tag.gone,.no-tags .tag{opacity:0}
    /* See inside and Compare: plain words over the stage; in See inside the two pictures pulled apart, Before at the back and
       After in front, its hidden part faint and its window dashed */
    .ghost,.twin,.cap{display:none}
    .cap{position:absolute;z-index:3;padding:3px 8px;border-radius:6px;background:rgba(11,11,13,.9);color:#f4f4f2;font:600 13px/1.25 var(--hb-font);white-space:nowrap;pointer-events:none}
    .stage[data-hb-mode="inside"] .cap.in,.stage[data-hb-mode="compare"] .cap.half{display:block}
    .stage[data-hb-mode="inside"] .ghost{display:block;opacity:.3}
    .stage[data-hb-mode="inside"] .layer{outline:2px solid rgba(255,255,255,.4)}
    .stage[data-hb-mode="inside"] .back{transform:translate(-9%,-9%) scale(.62)}
    .stage[data-hb-mode="inside"] .front{overflow:hidden;transform:translate(9%,9%) scale(.62);box-shadow:0 18px 40px rgba(0,0,0,.65)}
    .stage[data-hb-mode="inside"] .win::after{content:"";position:absolute;inset:0;border:4px dashed var(--ui-accent)}
    .stage[data-hb-mode="inside"] .tag{font-size:20px}
    .stage[data-hb-mode="inside"] .tag-b{display:none}
    .stage[data-hb-mode="inside"] .handle{transform:scale(1.62)}
    /* Compare: a copy whose After picture is resized with the line beside the real one, which uncovers it; one line drives both.
       Their names sit in a strip under them, clear of the Before and After labels */
    .stage[data-hb-mode="compare"]{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:minmax(0,1fr) 36px;column-gap:4px}
    .stage[data-hb-mode="compare"] .twin{display:block}
    .twin .win{transform:none}
    .twin .after{transform:scaleX(var(--v));transform-origin:0 50%}
    .vert .twin .after{transform:scaleY(var(--v));transform-origin:50% 100%}
    .cap.half{bottom:6px}.cap.first{left:8px}.cap.second{left:calc(50% + 10px)}
    @media(prefers-reduced-motion:reduce){.tag{transition:none}}
  </style>
  <link rel="stylesheet" href="../../../assets/css/demo-page.css?v=10">
  <script src="../../../assets/js/demo-page.js?v=10" defer></script>
</head>
<body class="hb" data-hb-kind="do" data-hb-autoplay>
<nav class="hb-bar" aria-label="Animation Handbook">
  <a class="hb-home" href="../../../"><svg class="hb-mark" viewBox="0 0 32 32" aria-hidden="true"><g class="g"><circle cx="11.16" cy="20.84" r="6.1"/><circle cx="15.12" cy="16.88" r="6.1"/><circle cx="18.51" cy="13.49" r="6.1"/></g><circle class="b" cx="21.2" cy="10.8" r="6.6"/></svg><span>Animation Handbook</span></a>
  <span class="hb-pager"><a href="../dynamic-island/" rel="prev" aria-label="Previous: Dynamic Island"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg><span><span class="hb-dir">Previous: </span>Dynamic Island</span></a></span>
  <a class="hb-star" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener" aria-label="Star on GitHub"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg><span>Star on GitHub</span></a>
</nav>
<main class="hb-page">
  <header class="hb-head">
    <p class="hb-cat">04.42 · Micro-Interactions</p>
    <h1>Before/After Slider</h1>
    <p class="hb-lede">Drag a line across two pictures to compare them. Best for photo edits.</p>
  </header>

  <section class="hb-step hb-watch" aria-labelledby="hb-watch-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">1</span>
      <div><h2 id="hb-watch-title">Drag it</h2><p>Drag the line, or press Show me.</p></div>
    </div>
    <div class="seg hb-modes" role="group" aria-label="What the box shows" data-hb-modes>
      <button type="button" data-hb-mode="normal" class="on" aria-pressed="true">Normal</button>
      <button type="button" data-hb-mode="inside" aria-pressed="false">See inside</button>
      <button type="button" data-hb-mode="compare" aria-pressed="false">Compare</button>
    </div>
    <div class="stage">
      <svg class="defs" aria-hidden="true"><defs>
        <linearGradient id="ba-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b3f8f"/><stop offset=".6" stop-color="#f08a6c"/><stop offset="1" stop-color="#ffd18a"/></linearGradient>
        <linearGradient id="ba-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a9d9b"/><stop offset="1" stop-color="#0f3b57"/></linearGradient>
        <!-- A made-up harbor at dusk: a sun, hills, a lighthouse, houses on the shore, a pier and two boats -->
        <symbol id="ba-harbor" viewBox="0 0 800 500">
          <rect width="800" height="330" fill="url(#ba-sky)"/>
          <circle cx="400" cy="200" r="60" fill="#ffe7a8"/>
          <path d="M0 296 120 236 214 280 330 222 470 288 560 256 680 300 800 262V332H0Z" fill="#5b4a8c"/>
          <rect y="326" width="800" height="174" fill="url(#ba-sea)"/>
          <path d="M346 348h108M364 366h72M378 384h44M390 402h20" stroke="#ffe7a8" stroke-width="6" stroke-linecap="round" opacity=".85"/>
          <path d="M0 326H268L238 356H0Z" fill="#3a2d29"/>
          <path d="M20 326V282L52 256 84 282V326ZM96 326V292L126 268 156 292V326ZM168 326V286L196 262 224 286V326Z" fill="#e85d4a"/>
          <path d="M96 292 126 268 156 292ZM20 282 52 256 84 282Z" fill="#2c3e78"/>
          <path d="M40 296h12v12H40ZM116 300h12v12h-12ZM186 296h12v12h-12Z" fill="#ffd36e"/>
          <path d="M236 352H330V362H236Z" fill="#7a5235"/><path d="M250 362h6v26h-6ZM288 362h6v26h-6ZM320 362h6v26h-6Z" fill="#5a3a24"/>
          <path d="M580 330C596 300 664 296 700 330Z" fill="#2e2a3a"/><path d="M624 314V214H658V314Z" fill="#f4f1ea"/>
          <path d="M624 240H658V256H624ZM624 278H658V294H624Z" fill="#e0453a"/><path d="M618 214H664L641 190Z" fill="#e0453a"/><rect x="629" y="198" width="24" height="16" fill="#ffe7a8"/>
          <path d="M470 388H570L552 408H488Z" fill="#d6453d"/><path d="M518 386V316L566 384Z" fill="#fbf7ee"/>
          <path d="M150 404H222L210 418H162Z" fill="#f2b33d"/><path d="M184 402V356L218 400Z" fill="#fbf7ee"/>
          <path d="M250 128q12-10 24 0q12-10 24 0M318 104q9-8 18 0q9-8 18 0" fill="none" stroke="#2a2342" stroke-width="4" stroke-linecap="round"/>
        </symbol>
      </defs></svg>
      <div class="ba" id="ba">
        <div class="layer back">
          <div class="pic before" id="before-pic" role="img" aria-label="A harbor at dusk, half the gray original and half the edited picture in full color, split by a line you can drag"><svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice"><use href="#ba-harbor" width="800" height="500"/></svg></div>
          <span class="tag tag-b" aria-hidden="true">Before</span>
        </div>
        <div class="layer front">
          <div class="pic ghost" aria-hidden="true"><svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice"><use href="#ba-harbor" width="800" height="500"/></svg></div>
          <div class="win"><div class="pic after" aria-hidden="true"><svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice"><use href="#ba-harbor" width="800" height="500"/></svg></div></div>
          <span class="tag tag-a" aria-hidden="true">After</span>
          <div class="rail"><span class="line"></span><div class="handle" id="handle" role="slider" tabindex="0" aria-label="Before and after" aria-orientation="horizontal" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-valuetext="50% After"><span class="grip"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 7-5 5 5 5M15 7l5 5-5 5"/></svg></span></div></div>
        </div>
      </div>
      <p class="cap in" id="c-before" aria-hidden="true" data-hb-caption>Before · whole, underneath</p>
      <p class="cap in" id="c-after" aria-hidden="true" data-hb-caption>After · shows only in the window</p>
      <p class="cap in" id="c-win" aria-hidden="true" data-hb-caption>Window · slides with the line</p>
      <p class="cap half first" aria-hidden="true" data-hb-caption>Resizes it</p>
      <p class="cap half second" aria-hidden="true" data-hb-caption>Uncovers it</p>
    </div>
    <div class="hb-player">
      <button class="hb-play" type="button" id="btn-demo" data-hb-demo><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"/></svg>Show me</button>
      <button class="hb-play" type="button" id="btn-reset" data-hb-reset><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>Reset</button>
      <label class="hb-toggle"><input class="hb-switch" type="checkbox" role="switch" id="slow-tog" data-hb-slowmo autocomplete="off"><span>Slow motion</span></label>
    </div>
    <div class="hb-mode-notes" aria-live="polite">
      <p data-hb-for="inside" hidden>Inside, Before lies whole underneath and After sits in front, showing only inside its dashed window. The window slides with the line, while the picture in it stays put.</p>
      <p data-hb-for="compare" hidden>On the left the top picture is resized with the line, so it squeezes. On the right it is only uncovered, so both pictures stay put.</p>
    </div>
  </section>

  <section class="hb-step hb-try" aria-labelledby="hb-try-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">2</span>
      <div><h2 id="hb-try-title">Try it</h2><p>Change a setting, then drag the line or press Show me.</p></div>
    </div>
    <div class="hb-settings">
      <div class="hb-setting">
        <p class="hb-setting-name" id="split-lbl">Split</p>
        <div class="seg" id="split-seg" role="group" aria-labelledby="split-lbl">
          <button type="button" data-split="lr" class="on" aria-pressed="true">Left and right</button>
          <button type="button" data-split="tb" aria-pressed="false">Top and bottom</button>
        </div>
        <p class="hb-hint">Which way the line runs.</p>
      </div>
      <div class="hb-setting">
        <p class="hb-setting-name" id="handle-lbl">Handle</p>
        <div class="seg" id="handle-seg" role="group" aria-labelledby="handle-lbl">
          <button type="button" data-h="knob" class="on" aria-pressed="true">Knob</button>
          <button type="button" data-h="bar" aria-pressed="false">Bar</button>
          <button type="button" data-h="line" aria-pressed="false">Line only</button>
        </div>
        <p class="hb-hint">A knob tells people they can drag.</p>
      </div>
      <div class="hb-setting">
        <label class="hb-switch-row"><span>Shows labels</span><input class="hb-switch" type="checkbox" role="switch" id="tags-tog" checked autocomplete="off"></label>
        <p class="hb-hint">Before and After fade as the line covers them.</p>
      </div>
    </div>
  </section>

  <section class="hb-step hb-prompt-step" aria-labelledby="hb-prompt-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">3</span>
      <div><h2 id="hb-prompt-title">Copy the prompt</h2><p>Paste it into an AI assistant such as ChatGPT, Claude or Cursor to build this in your own project.</p></div>
    </div>
    <div class="hb-card">
      <p class="hb-prompt">Add a before-and-after slider to [the two pictures you want to compare]. Stack the pictures exactly on top of each other and show the top one only up to a dividing line with a handle, so each side of the line shows one picture. Dragging on the pictures moves the line, and a tap jumps it there. Uncover the top picture with a clip or a sliding window, never by resizing it, so neither picture moves or squeezes. Use pointer events for mouse and touch, keep page scrolling free on phones, and let the arrow keys move the handle. If the visitor has reduced motion turned on, move the line without gliding. Match the settings listed below.</p>
      <div class="hb-chips-box" hidden>
        <p class="hb-chips-title">Your settings</p>
        <ul class="hb-chips"></ul>
      </div>
      <div class="hb-copy-row">
        <button class="hb-copy" type="button"><svg class="hb-ic hb-i-copy" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><svg class="hb-ic hb-i-done" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span class="hb-copy-label" aria-live="polite">Copy prompt</span></button>
        <p class="hb-hint">Replace the words in brackets with your own element. Your settings are added at the end.</p>
      </div>
    </div>
    <div class="hb-star-row"><p>Free and open source. If this helped, a star on GitHub helps other people find it.</p><a class="hb-star-btn" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>Star on GitHub</a></div>
  </section>

  <section class="hb-about" aria-labelledby="hb-what-title">
    <div class="hb-what">
      <h2 id="hb-what-title">What it is</h2>
      <div class="hb-what-text"><p>The full explanation is in <a href="README.md">README.md</a>.</p></div>
    </div>
    <div class="hb-fit">
      <h2>Good for</h2>
      <ul class="hb-tags hb-good"><li>Photo edits</li><li>Redesigns</li><li>Renovations</li><li>Product upgrades</li></ul>
      <h3>Avoid on</h3>
      <ul class="hb-tags hb-avoid"><li>Small thumbnails</li><li>Unrelated pictures</li></ul>
    </div>
  </section>

  <section class="hb-related" aria-labelledby="hb-related-title" hidden>
    <h2 id="hb-related-title">Similar animations</h2>
    <div class="hb-rel-list"></div>
  </section>
</main>
<footer class="hb-foot"><span>Animation Handbook</span><a href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener">Source on GitHub</a><a href="#top">Back to top ↑</a></footer>
<script>
  const stage=document.querySelector('.stage'),ba=document.getElementById('ba'),back=ba.querySelector('.back'),front=ba.querySelector('.front');
  const handle=document.getElementById('handle'),pic=document.getElementById('before-pic'),slowTog=document.getElementById('slow-tog');
  const reduceMQ=matchMedia('(prefers-reduced-motion: reduce)'),caps=['c-before','c-after','c-win'].map(id=>document.getElementById(id));
  const LABELS={normal:pic.getAttribute('aria-label'),
    inside:'The two pictures pulled apart: the gray original whole at the back, the edited one in front, showing only in its window',
    compare:'The same split twice: the edited picture squeezed into the space beside the line, then only uncovered by it'};
  // v: how much of After shows (0 to 1); aim: where the line is going (a glide's end, or v)
  // runTo: where a Show me run ends (where it started, or the middle once Normal takes the views' pose away)
  let v=.5,aim=.5,runTo=.5,mode='normal',posed=false,twin=null,glideRaf=0,demo=false,runTimers=[],drag=null;
  const isVert=()=>stage.classList.contains('vert');

  function setV(x){
    v=Math.min(1,Math.max(0,x));stage.style.setProperty('--v',v);
    const pct=Math.round(v*100);handle.setAttribute('aria-valuenow',pct);handle.setAttribute('aria-valuetext',pct+'% After');
    fadeTags();if(mode==='inside')placeCaps();
  }
  // Before and After fade while the line covers them, on the real pictures and, in Compare, on the copy
  function fadeTags(){
    const vert=isVert();
    stage.querySelectorAll('.ba').forEach(f=>{
      const a=f.querySelector('.tag-a'),b=f.querySelector('.tag-b'),size=vert?f.clientHeight:f.clientWidth,at=vert?(1-v)*size:v*size;
      if(!size)return;
      a.classList.toggle('gone',vert?at>a.offsetTop-8:at<a.offsetLeft+a.offsetWidth+8);
      b.classList.toggle('gone',vert?at<b.offsetTop+b.offsetHeight+8:at>b.offsetLeft-8);
    });
  }
  // The line glides to a place by the time that passes (three times as long in slow motion); under reduced motion it jumps
  function glide(to,ms,then){
    cancelAnimationFrame(glideRaf);glideRaf=0;aim=Math.min(1,Math.max(0,to));
    if(reduceMQ.matches){setV(aim);if(then)then();return}
    const from=v,dur=ms*(slowTog.checked?3:1);let t0=null;
    const step=ts=>{
      if(t0===null)t0=ts;
      const k=reduceMQ.matches?1:Math.min(1,(ts-t0)/dur);
      setV(from+(aim-from)*k*k*(3-2*k));
      if(k<1)glideRaf=requestAnimationFrame(step);else{glideRaf=0;if(then)then()}
    };
    glideRaf=requestAnimationFrame(step);
  }
  // Show me: to 80%, to 20% and back to where it started; every pause waits on a timer, and slow motion triples the moves only
  function later(fn,move,hold){const id=setTimeout(()=>{runTimers=runTimers.filter(t=>t!==id);fn()},move*(slowTog.checked?3:1)+hold);runTimers.push(id)}
  function stopRun(){runTimers.forEach(clearTimeout);runTimers=[];if(demo){cancelAnimationFrame(glideRaf);glideRaf=0;aim=v}demo=false}
  // The visitor takes over: a run stops, and the views' pose no longer needs undoing
  function take(){stopRun();posed=false}
  document.getElementById('btn-demo').addEventListener('click',()=>{
    stopRun();cancelAnimationFrame(glideRaf);glideRaf=0;demo=true;runTo=v;
    glide(.8,700);
    later(()=>glide(.2,900),700,250);
    later(()=>glide(runTo,700,()=>{demo=false}),1600,500);
  });
  document.getElementById('btn-reset').addEventListener('click',()=>{take();cancelAnimationFrame(glideRaf);glideRaf=0;aim=.5;setV(.5)});
  document.addEventListener('hb:input',()=>{if(demo)stopRun()});
  stage.addEventListener('focusin',e=>{if(e.isTrusted&&demo)stopRun()});

  // A drag moves the line with the pointer (in Top and bottom, from the handle only, so the page still scrolls); a tap glides it there
  const vAt=e=>{const r=front.getBoundingClientRect();return isVert()?1-(e.clientY-r.top)/r.height:(e.clientX-r.left)/r.width};
  ba.addEventListener('pointerdown',e=>{
    if(e.pointerType==='mouse'&&e.button!==0)return;
    drag={id:e.pointerId,x:e.clientX,y:e.clientY,far:false,grab:!isVert()||!!e.target.closest('.handle')};
    if(drag.grab)ba.setPointerCapture(e.pointerId);
  });
  ba.addEventListener('pointermove',e=>{
    if(!drag||e.pointerId!==drag.id)return;
    if(!drag.far&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<5)return;
    drag.far=true;if(!drag.grab)return;
    take();cancelAnimationFrame(glideRaf);glideRaf=0;setV(vAt(e));aim=v;
  });
  ba.addEventListener('pointerup',e=>{if(!drag||e.pointerId!==drag.id)return;const d=drag;drag=null;if(!d.far){take();glide(vAt(e),300)}});
  ba.addEventListener('pointercancel',()=>{drag=null});
  // The keyboard: the arrows move the line a twentieth, Page Up and Page Down a quarter, Home and End to the ends
  handle.addEventListener('keydown',e=>{
    const step={ArrowRight:.05,ArrowUp:.05,ArrowLeft:-.05,ArrowDown:-.05,PageUp:.25,PageDown:-.25}[e.key];
    const to=e.key==='Home'?0:e.key==='End'?1:step===undefined?null:aim+step;
    if(to===null)return;
    e.preventDefault();take();glide(to,160);
  });

  // See inside's three labels: Before above the back picture, After under the front one, Window over the line; all are measured
  // before any moves, so the page lays out once
  function placeCaps(){
    const s=stage.getBoundingClientRect(),b=back.getBoundingClientRect(),f=front.getBoundingClientRect(),vert=isVert();
    const size=caps.map(c=>[c.offsetWidth,c.offsetHeight]),lx=f.left-s.left+v*f.width,ly=f.top-s.top+(1-v)*f.height;
    const at=[[b.left-s.left,b.top-s.top-size[0][1]-6],[f.right-s.left-size[1][0],f.bottom-s.top+6],
      vert?[f.right-s.left-size[2][0]-8,ly-size[2][1]-8]:[lx-size[2][0]/2,f.top-s.top-size[2][1]-6]];
    caps.forEach((c,i)=>{c.style.left=Math.max(6,Math.min(s.width-size[i][0]-6,at[i][0]))+'px';c.style.top=Math.max(6,Math.min(s.height-size[i][1]-6,at[i][1]))+'px'});
  }
  // Compare's first half: a copy of the pictures, made once, with no ids, names or focus, whose After picture is resized
  function makeTwin(){
    twin=ba.cloneNode(true);twin.classList.add('twin');twin.inert=true;twin.setAttribute('aria-hidden','true');
    twin.querySelectorAll('[id],[role],[tabindex],[aria-label]').forEach(n=>['id','role','tabindex','aria-label'].forEach(a=>n.removeAttribute(a)));
    twin.removeAttribute('id');stage.insertBefore(twin,ba);
  }
  // The mode switch draws the mode at once. The views hold the line at 70% when it rests in the middle; Normal gets it back.
  document.addEventListener('hb:mode',e=>{
    mode=e.detail.mode;pic.setAttribute('aria-label',LABELS[mode]);
    if(mode==='compare'&&!twin)makeTwin();
    if(mode!=='normal'&&!demo&&!glideRaf&&v===.5){posed=true;aim=.7;setV(.7)}
    else if(mode==='normal'&&posed){posed=false;aim=runTo=.5;setV(.5)}
    else setV(v);
  });
  new ResizeObserver(()=>setV(v)).observe(stage);

  function choices(id,pick){
    const buttons=document.querySelectorAll('#'+id+' button');
    buttons.forEach(b=>b.addEventListener('click',()=>{
      buttons.forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',String(x===b))});
      pick(b.dataset);setV(v);
    }));
  }
  choices('split-seg',d=>{stage.classList.toggle('vert',d.split==='tb');handle.setAttribute('aria-orientation',d.split==='tb'?'vertical':'horizontal')});
  choices('handle-seg',d=>{stage.classList.toggle('h-bar',d.h==='bar');stage.classList.toggle('h-line',d.h==='line')});
  document.getElementById('tags-tog').addEventListener('change',e=>stage.classList.toggle('no-tags',!e.target.checked));
  setV(.5);
</script>
</body>
</html>
```

Then give it the shared-file version the branch uses (the ledger's N; nothing changes when N is 10):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L3 || exit 1
N=$(grep -o 'shared files ?v=[0-9]*' $TEN/ledger.md | head -1 | grep -o '[0-9]*$')
sed -i "s/demo-page\.css?v=10/demo-page.css?v=$N/; s/demo-page\.js?v=10/demo-page.js?v=$N/" animations/04-micro-interactions/before-after-slider/index.html
grep -c "demo-page\.css?v=$N\|demo-page\.js?v=$N" animations/04-micro-interactions/before-after-slider/index.html
```

Expected: `2`.

- [ ] **Step 3: Write the README: `animations/04-micro-interactions/before-after-slider/README.md`**

````markdown
# Before/After Slider

[Live demo](https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/before-after-slider/)

## What it is
A before/after slider stacks two pictures of the same scene, such as a photo before and after an edit, and shows the top one only up to a dividing line. Dragging the line uncovers more of one picture and less of the other, so the eye can compare the same spot in both. Neither picture moves: only the line does.

## When to use it
- Photo edits and retouching, the original beside the result
- Website and app redesigns, the old screen against the new one
- Renovations, restorations and cleanups
- Product upgrades, such as a new screen or a better camera
- Maps and aerial views of one place at two dates

## How it works
Both pictures fill the same box. Before lies whole underneath. After sits in a window as big as the box, and one number from 0 to 1 says how much of it shows. The window slides with the line and the picture inside it slides back by the same amount, so it stays exactly over Before; all three moves are transforms, so a drag redraws nothing:

```css
.win      { overflow: hidden; transform: translateX(calc((var(--v) - 1) * 100%)); }
.win .pic { transform: translateX(calc((1 - var(--v)) * 100%)); }
.rail     { transform: translateX(calc(var(--v) * 100%)); }  /* the line and its handle */
```

Pointer events turn the pointer's place into that number, with pointer capture so a drag keeps working outside the box:

```js
const r = front.getBoundingClientRect();
stage.style.setProperty('--v', Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
```

A press that does not move glides the line to it, eased by the time that passes. The handle is a slider whose value is read as "60% After": the arrow keys move it a twentieth, Page Up and Page Down a quarter, Home and End to the ends. With Left and right the pictures keep `touch-action: pan-y`, so an up-and-down swipe still scrolls the page; with Top and bottom only the handle starts a drag, for the same reason. The Before and After labels fade when the line comes over them. Under reduced motion the line jumps instead of gliding.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Split | Left and right | Which way the line runs: left and right shows After to the left of an upright line, dragged anywhere on the pictures; top and bottom shows After below a level line, dragged by its handle only |
| Handle | Knob | What there is to grab: knob is a round button with two arrows, bar a narrow bar along the line, line only the bare line (still grabbed across a strip about as wide as a fingertip) |
| Shows labels | on | Before and After name each side from a corner, and each fades out when the line comes within a few pixels of it |

## Production notes
- **Uncover, never resize.** Shrinking the top picture's width squeezes it, and changing width forces layout on every move. A sliding window with the picture slid back, or `clip-path: inset(0 calc((1 - var(--v)) * 100%) 0 0)` on the top picture, keeps both pictures still; clip-path is shorter to write but repaints the top picture on each move.
- **Same size, same framing.** Both pictures need exactly the same size and crop (`object-fit: cover` on both); a few pixels of offset reads as a wobble when the line moves.
- **Phones.** `touch-action: pan-y` on the pictures leaves up-and-down scrolling to the browser; a `pointercancel` means the browser took the gesture over, so stop the drag there.
- **Accessibility.** Give the handle `role="slider"`, `aria-valuenow` and an `aria-valuetext` such as "60% After", handle the arrow, Page Up, Page Down, Home and End keys, and give the pictures their own alternative text.
- **Libraries.** The img-comparison-slider web component, juxtapose.js and TwentyTwenty (jQuery) package the same idea; in an app, GSAP's Draggable or Framer Motion's `drag` can move the line.
- **Reduced motion.** Let the line jump to a tap or a key press instead of gliding.

## See also
- [Swipe to Dismiss](../swipe-to-dismiss/) — a drag that follows the finger and springs back
- [Liquid Glass](../../06-3d-advanced/liquid-glass/) — a glass panel dragged over a picture, arrow keys too
- [Clip-Path Reveal](../../02-entrance-and-exit/clip-path-reveal/) — a shape uncovers a picture once, by itself
````

- [ ] **Step 4: The home page preview**

In the worktree's `index.html`: (a) insert these lines, and one empty line after them, right before the line `/* ── bespoke: 05 Text & Typography ── */` (the end of the 04 bespoke block):

```css
.pv-beforeafter{background:#0b0b0d;overflow:hidden;container-type:size}
.pv-beforeafter .sc{position:absolute;inset:0;background:radial-gradient(circle at 72% 44%,#ffe7a8 0 8%,#0000 8.5%),linear-gradient(172deg,#0000 54%,#5b4a8c 54.5% 64%,#0000 64.5%),linear-gradient(#2b3f8f,#f08a6c 50%,#ffd18a 64%,#2a9d9b 64.5%,#0f3b57)}
.pv-beforeafter .gray{filter:grayscale(1) contrast(.72) brightness(1.08)}
.pv-beforeafter .win{position:absolute;inset:0;overflow:hidden;animation:beforeafter-win 5s ease-in-out infinite}
.pv-beforeafter .win .sc{animation:beforeafter-pic 5s ease-in-out infinite}
.pv-beforeafter .ln{position:absolute;inset:0;animation:beforeafter-ln 5s ease-in-out infinite}
.pv-beforeafter .ln::before{content:"";position:absolute;left:-1px;top:0;bottom:0;width:2px;background:#fff}
.pv-beforeafter .ln b{position:absolute;left:-6cqw;top:calc(50% - 6cqw);width:12cqw;height:12cqw;border-radius:50%;background:#fff;box-shadow:0 1px 6px rgba(0,0,0,.4)}
.pv-beforeafter .ln b::before,.pv-beforeafter .ln b::after{content:"";position:absolute;top:calc(50% - 2cqw);left:2cqw;border:2cqw solid #0000;border-right-color:#16161a;border-left-width:0}
.pv-beforeafter .ln b::after{left:auto;right:2cqw;border-width:2cqw 0 2cqw 2cqw;border-color:#0000 #0000 #0000 #16161a}
@keyframes beforeafter-win{0%,8%,100%{transform:translateX(-50%)}30%,42%{transform:translateX(-18%)}66%,78%{transform:translateX(-82%)}}
@keyframes beforeafter-pic{0%,8%,100%{transform:translateX(50%)}30%,42%{transform:translateX(18%)}66%,78%{transform:translateX(82%)}}
@keyframes beforeafter-ln{0%,8%,100%{transform:translateX(50%)}30%,42%{transform:translateX(82%)}66%,78%{transform:translateX(18%)}}
```

(b) insert this line right after the line that starts with `case 'dynisland':`:

```js
    case 'beforeafter': return '<span class="sc gray"></span><span class="win anim"><span class="sc anim"></span></span><span class="ln anim"><b></b></span>';
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L3 || exit 1
grep -c "pv-beforeafter" index.html; grep -c "case 'beforeafter':" index.html
```

Expected: a number above 1 (the preview's CSS rules), then `1` (its case).

- [ ] **Step 5: Write the generated files, then the tests pass**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L3 || exit 1
node tools/update-sitemap.mjs && node tools/make-skill.mjs
node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)"
```

Expected: `ℹ fail 0` (this plan's run of every lane on a copy of `feat/ten-animations` at `ece2689`, the finder and Famous effects there, gave it: 1717 pass). If only `tests/finder.test.js` fails (its case 9 waits for Task 11 when the finder has changed since), note the failing lines in your report for Task 11 (lanes never change `tests/`) and go on; any other failure names what to fix in this lane's files.

- [ ] **Step 6: Prove the keyboard test for Task 11, then put the test file back**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L3 || exit 1
sed -i "s/'magnetic-button', 'click-ripple'\]/'magnetic-button', 'click-ripple', 'before-after-slider']/" tests/pages.test.js
grep -c "'before-after-slider'" tests/pages.test.js
node --test tests/pages.test.js 2>&1 | grep -E "keyboard|^ℹ (pass|fail)"
git checkout -- tests/pages.test.js && git status --short tests/
```

Expected: `1` (the entry is in), then `✔ the do-it pages played with the pointer can be played from the keyboard` and `ℹ fail 0`, then nothing (the file is back as it was). If the grep prints `0`, the list's last entry changed since this plan: add `'before-after-slider'` in the `'04-micro-interactions'` list of `KEYBOARD_PAGES` by hand, run, and put the file back the same way.

- [ ] **Step 7: The page check and the short screens (each a background command, waited on)**

The coordinator's server for this lane answers on port 8963: `curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8963/` prints `200` (if not, ask the coordinator). The review kit finds pages under its own folder's root, so it runs from a copy in the worktree (`.superpowers/` is ignored by git):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit
cd $REPO/.claude/worktrees/ten-L3 || exit 1
mkdir -p .superpowers/sdd/kit/review-kit $TEN/checks/L3 && cp $KIT/record.mjs $KIT/kit-lib.mjs .superpowers/sdd/kit/review-kit/ && git status --short | grep -c superpowers
```

Expected: `0` (git does not see the copy). Then start these two, each as its own background command (the round number `1`, then `2`, `3` after fixes):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L3 || exit 1
node $RUN/slot.mjs run ten-L3 -- node tools/check-pages.mjs --base http://127.0.0.1:8963 --out $TEN/checks/L3/1 animations/04-micro-interactions/before-after-slider animations/04-micro-interactions/dynamic-island home > $TEN/checks/L3/1.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L3/1.log
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L3 || exit 1
node $RUN/slot.mjs run ten-L3 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8963 --short --out $TEN/checks/L3/short-1 animations/04-micro-interactions/before-after-slider > $TEN/checks/L3/short-1.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L3/short-1.log
```

Wait on each with `node $RUN/wait-log.mjs $TEN/checks/L3/1.log` and `… short-1.log` (again while it says `still running`), then: `grep -c '^ok' $TEN/checks/L3/1.log; grep '^FAIL' $TEN/checks/L3/1.log; tail -2 $TEN/checks/L3/short-1.log`.

Expected: `18` (six `ok` lines each for `before-after-slider`, `dynamic-island`, the home page), no `FAIL` line, and `27 short-screen pictures checked, 0 with labels cut or overlapping, 0 skipped, 0 failed` with `EXIT=0` (this plan's runs gave exactly these). A `FAIL` line or a cut or overlapping label names the problem (the real branch may differ from the copy this plan was checked on; the ledger's first line says how): fix it in this lane's files, keeping the page's behavior, and run both again as round 2, 3; every round after a change ends with all lines `ok`.

- [ ] **Step 8: Every choice in Try it, in both views (acceptance 7), and the motion in clips**

Two background commands. The first runs the kit's gallery (pictures only: Normal, See inside and Compare at 1280 and 375) once with the defaults (`press-0`) and once for each choice that is not a default and each switch in Try it (never Loop, Slow motion, Pause or Play: playback is not a setting), each into its own folder. The second records the clips (Normal, See inside and Compare at 1280, about seven seconds each, frames kept) with the defaults (`clip-0`): the stills never show a run's middle.

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L3 || exit 1
i=0; for sel in "" "#split-seg [data-split='tb']" "#handle-seg [data-h='bar']" "#handle-seg [data-h='line']" "#tags-tog"; do echo "== press-$i ${sel:-defaults}"; node $RUN/slot.mjs run ten-L3 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8963 --gallery ${sel:+--press "$sel"} --out $TEN/checks/L3/press-$i animations/04-micro-interactions/before-after-slider || echo "run $i failed"; i=$((i+1)); done > $TEN/checks/L3/press.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L3/press.log
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L3 || exit 1
i=0; for sel in ""; do echo "== clip-$i ${sel:-defaults}"; node $RUN/slot.mjs run ten-L3 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8963 --only clips --keep-frames ${sel:+--press "$sel"} --out $TEN/checks/L3/clip-$i animations/04-micro-interactions/before-after-slider || echo "run $i failed"; i=$((i+1)); done > $TEN/checks/L3/clips.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L3/clips.log
```

Wait on each log with `node $RUN/wait-log.mjs`. Expected: 5 `== press-…` lines, each run ending `done  6 pictures, 0 clips and 0 comparisons made, 0 skipped, 0 failed`, and 1 `== clip-…` line, each ending `done  0 pictures, 3 clips and 0 comparisons made, 0 skipped, 0 failed`; no `failed` line, no `was not found`, `EXIT=0` (the kit's lines as this plan's runs printed them). Read each gallery's See inside and Compare pictures at 1280 beside `press-0`'s: each choice visibly changes Normal and both views. Read three frames from the middle of each See inside and Compare clip (the log's `frames kept in <folder>` lines name the folders): the views move as the spec says, nothing jumps or covers the stage in mid-run (this plan's clips found See inside's small copy filling Pixelate Transition's stage while the blocks were small, a fault no still showed). A choice that changes nothing in a view is a fix (the owner's rule: every setting and control visibly changes the stage and both views). Then remove the frame folders: `grep -o 'frames kept in .*' $TEN/checks/L3/clips.log | sed 's/^frames kept in //' | while read -r f; do rm -rf "$f"; done`.

- [ ] **Step 9: Look at the screenshots and check by hand**

Open `$TEN/checks/L3/<round>/04-before-after-slider-{desktop,phone,phone-reduced}-{inside,compare}.png`, the Normal ones and the short screens' pictures: both views read as the spec says, no label covers another or the part it names, nothing overflows at 320. Then, in the served page (a headless run through the pool, or by reading the code where a run cannot show it):

- Dragging anywhere on the pictures moves the line (Left and right), a tap glides it there, and a vertical swipe on a phone still scrolls the page; with Top and bottom only the handle drags.
- The handle is a slider read as "50% After": the arrows move it a twentieth, Page Up and Page Down a quarter, Home and End to the ends; Right and Up raise the share of After.
- Show me glides to 80%, to 20% and back to where it started (about 2.8 s); Normal pressed during a view's run ends with the line in the middle, never at the views' 70% (G4); Reset centers the line; Split, Handle (Knob, Bar, Line only) and Shows labels change Normal and both views.
- The handle is at least 44px to touch in every mode (48px; scaled back up in See inside); under reduced motion the line jumps instead of gliding and Show me steps with pauses.

Decisions already made in this page (keep them; a reviewer weighs them): After is anchored on the left with Left and right and at the bottom with Top and bottom, so the slider's value ("60% After") rises with Right and Up and the line moves the way the key points. Both views pose the line at 70% when it rests in the middle (the spec's stills at 70%), and Normal gets the middle back. Compare's halves sit side by side at every width (the note says left and right) with their names in a 36px strip under the pictures, so they never cover the Before and After labels; the box keeps its size. See inside hides the Before label (its caption names that layer); the drawn harbor puts the sun in the middle so the squeeze shows at every size.

- [ ] **Step 10: Frame times (optional: a page moved by transforms)**

One background command, waited on with `wait-log.mjs`:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L3 || exit 1
(node $RUN/slot.mjs run ten-L3 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8963 --modes normal,inside,compare animations/04-micro-interactions/before-after-slider; node $RUN/slot.mjs run ten-L3 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8963 --phone --modes normal,inside,compare animations/04-micro-interactions/before-after-slider; node $RUN/slot.mjs run ten-L3 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8963 animations/04-micro-interactions/swipe-to-dismiss; node $RUN/slot.mjs run ten-L3 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8963 --phone animations/04-micro-interactions/swipe-to-dismiss) > $TEN/checks/L3/frames.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L3/frames.log
```

Expected: a median of 16.7 ms in every mode at both sizes, and no larger share of frames slower than 20 ms than Swipe to Dismiss measured the same way, within a few points (the machine's other work moves these numbers; run again when one looks off). This plan's runs: desktop 0 to 9% in each mode (0% in two runs of three), phone 1 to 4%; Swipe to Dismiss 0% and 1%. Report the numbers; nothing to change unless a mode is clearly worse than the closest page.

- [ ] **Step 11: Commit, and the build report**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L3 || exit 1
[ "$(git rev-parse --abbrev-ref HEAD)" = ten/L3 ] || exit 1
git add -A && git status --short
git commit -m "feat: 04.42 Before/After Slider, with See inside and Compare from the start (lane 3)"
git log --oneline -1
```

Expected before the commit: `A  animations/04-micro-interactions/before-after-slider/README.md`, `A  animations/04-micro-interactions/before-after-slider/index.html`, `M  .github/ISSUE_TEMPLATE/config.yml`, `M  404.html`, `M  README.md`, `M  animations/04-micro-interactions/README.md`, `M  animations/04-micro-interactions/dynamic-island/index.html`, `M  index.html`, `M  llms.txt`, `M  sitemap.xml` and the changed files under `skills/animation-handbook/`; nothing else (the kit's copy is ignored; logs and pictures are in `$TEN`). Then write `$TEN/reports/L3/build.md`: first line `RESULT: built <commit>`, then the line count, the page check's `ok` count and its round, the short screens' last line, the galleries and clips looked at (one line per choice: what changes in each view; one line per clip: what moves), the tests' pass and fail line, the frame times, the hand checks' results, every place the page departs from the spec or this task and why, and any shared-file need (the coordinator appends it to `$RUN/shared-wishes.md`; there should be none). Reply to the coordinator in at most three lines.

- [ ] **Step 12: Review, at most three fix rounds**

The coordinator dispatches a reviewer (strongest model, never the builder) with: the spec's section, this task, the builder's report, `git -C $REPO diff feat/ten-animations...ten/L3`, the newest check round and its screenshots, the short screens, the galleries, the clips and the frame times. The reviewer reads CLAUDE.md, the Global Constraints, `$RUN/lessons.md`, `$RUN/briefs/RULINGS.md`, `$RUN/brief-rulings.md`, `$RUN/briefs/OPEN-QUESTIONS.md` and, once it holds the owner's verdict, `$RUN/rulings-159.md`, and checks the diff against them, the rollout's acceptance list (section 1 of the rollout spec), the spec's section and the per-frame work, looking hard at the keyboard and its value text; touch-action pan-y on the pictures and none on the handle; the copy in Compare (no ids, no names, inert). It writes `$TEN/reports/L3/review-<k>.md`: first line `RESULT: approved` or `RESULT: changes <count>`, then numbered findings (Critical, Important, Minor), and replies in at most three lines. Each fix round: the builder fixes, runs Steps 5 and 7 again (and the galleries, clips or frame times a fix touches), commits `fix: Before/After Slider: <what>` after the branch check, writes `$TEN/reports/L3/fix-<k>.md` (`RESULT: built <commit>`), and the reviewer re-reviews only the fix. After three rounds the coordinator steps in. When approved, the coordinator stops the lane's server and adds the ledger line `<date time>  L3  approved at <commit>; check rounds <k>; frames <numbers>; departures: <none or a list>; reports reports/L3/`.

---

### Task 4: L4 · 04.43 Magnifier Lens (`ten/L4`, port 8964)

Do it · step 1 "Hover it" · player bar: Show me and Slow motion (the page slows itself; no Reset). See inside: zoomed out so the bigger copy fits, drawn whole but faint and dashed, the lens a window onto it, a cross on the pointer's spot. Compare: "Stretched copy" (a lens enlarging a small picture, which blurs) beside "Bigger copy". Spec: "4 · Magnifier Lens (04.43)" in `docs/superpowers/specs/2026-10-13-ten-new-animations-design.md`.

**Files:**
- Create: `animations/04-micro-interactions/magnifier-lens/index.html` (367 lines), `animations/04-micro-interactions/magnifier-lens/README.md`
- Modify (by `$TEN/lanes.mjs 4`): `index.html` (the card after Dynamic Island's, the `PV` key, the `PLACES` row, the `FIND` row (the finder is on the branch), every count 166 → 167), `README.md` (counts, 04's count 41 → 42, the catalog line), `animations/04-micro-interactions/README.md` (its line), `.github/ISSUE_TEMPLATE/config.yml`, `404.html`
- Modify (Step 4, by hand): `index.html`: the preview's CSS at the end of the 04 bespoke block, `case 'magnifier':` in `pvMarkup()`
- Regenerate: `sitemap.xml`, `llms.txt`, `skills/animation-handbook/` (their tools)
- Test: `tests/*.test.js` (with a proof edit, put back); the page check of the new page and of the home page; the review kit's short screens, a gallery for the defaults and for each other choice in Try it, clips of the defaults
- Write (run folder): `$TEN/checks/L4/` (logs, screenshots, kit output), `$TEN/reports/L4/build.md`, `fix-<k>.md`; the reviewer `review-<k>.md`

**Interfaces:**
- Consumes: Task 0's worktree `.claude/worktrees/ten-L4` on `ten/L4`, its server on port 8964 (started and stopped by the coordinator), `$TEN/lanes.mjs`, the shared-file version N in the ledger; Phase 0's shared files, its mode press (the shared script presses Show me after See inside or Compare) and its page check; the rollout's review kit and wait tool.
- Produces: branch `ten/L4`: the card `['magnifier-lens','Magnifier Lens','A lens follows your pointer and shows the picture up close. Best for product photos.']` (04.43), `PV` key `'magnifier-lens':'magnifier'`, `PLACES` `['imgcard']`, `FIND` `'magnifier-lens':['card','hover drag','follow grow']`; Previous: Dynamic Island (for now: Task 11 points it at the page before it in the section); no Next link yet. For Task 11: `'magnifier-lens'` in the `'04-micro-interactions'` list of `KEYBOARD_PAGES`. The reports in `$TEN/reports/L4/`, which the rollout's final review (part 9) reads too.

- [ ] **Step 1: The lane's shared edits (the failing tests)**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L4 || exit 1
node $TEN/lanes.mjs 4 .
git status --short
node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)" | head -10
```

Expected: `lane 4 shared edits applied to .`; then ` M .github/ISSUE_TEMPLATE/config.yml`, ` M 404.html`, ` M README.md`, ` M animations/04-micro-interactions/README.md`, ` M index.html`; then these 6 failing tests and `ℹ fail 6`: `✖ make-famous: on the real home page every card builds, but the eight whose previews need a script or animate in SVG`, `✖ the answers keep the rules every page of a kind shares: transitions answer newpage, loops loop, scroll pages scroll`, `✖ the Full catalog in the root README lists every card once, in home order, linked to its live page`, `✖ the counts written in the issue template, the 404 page and the sitemap match the cards`, `✖ the skill and llms.txt are what tools/make-skill.mjs writes from the pages and the home page now`, `✖ llms.txt lists every card once, in the order of CATS, with its live address and its description, and links the skill files`. (Famous effects' test builds every card's preview, which Step 4 adds; the finder's reads each page's kind, from a page that is not there yet; this plan's run of every lane on a copy of `feat/ten-animations` at `ece2689`, the finder and Famous effects there, gave exactly these.) If `lanes.mjs` stops with `not found (…)`, stop and tell the coordinator, who alone edits `$TEN/lanes.mjs`; before running it again, put the worktree back with `git checkout -- .` (this step makes no other changes; the tool refuses a second run on a changed tree).

- [ ] **Step 2: Write the page: `animations/04-micro-interactions/magnifier-lens/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Magnifier Lens — Animation Handbook</title>
  <meta name="description" content="A lens follows your pointer and shows the picture up close. Best for product photos.">
  <link rel="canonical" href="https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/magnifier-lens/">
  <link rel="icon" type="image/png" sizes="96x96" href="../../../favicon.png">
  <link rel="icon" type="image/svg+xml" href="../../../favicon.svg">
  <link rel="apple-touch-icon" href="../../../apple-touch-icon.png">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Animation Handbook">
  <meta property="og:title" content="Magnifier Lens — Animation Handbook">
  <meta property="og:description" content="A lens follows your pointer and shows the picture up close. Best for product photos.">
  <meta property="og:url" content="https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/magnifier-lens/">
  <meta property="og:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Magnifier Lens — Animation Handbook">
  <meta name="twitter:description" content="A lens follows your pointer and shows the picture up close. Best for product photos.">
  <meta name="twitter:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <script type="application/ld+json">{"@context": "https://schema.org", "@type": "TechArticle", "headline": "Magnifier Lens", "name": "Magnifier Lens", "description": "A lens follows your pointer and shows the picture up close. Best for product photos.", "url": "https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/magnifier-lens/", "inLanguage": "en", "articleSection": "Micro-Interactions", "isPartOf": {"@type": "WebSite", "name": "Animation Handbook", "url": "https://matinmonshizadeh.github.io/animation-handbook/"}, "author": {"@type": "Person", "name": "matinmonshizadeh"}, "keywords": "web animation, CSS animation, Micro-Interactions, Magnifier Lens"}</script>
  <style>
    :root{--ui-accent:#ff9d5c}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    /* --r: the lens's radius; --s: how far See inside zooms out; --grow: how long the lens takes to grow in or shrink away */
    .stage{--r:75px;--s:.3;--grow:.22s;position:relative;display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);background:#0b0d13;touch-action:none;-webkit-user-select:none;user-select:none}
    .stage svg{font-family:var(--hb-font)}
    .defs{position:absolute;width:0;height:0;overflow:hidden}
    .mag{position:relative;min-width:0;overflow:hidden;cursor:crosshair}
    .world{position:absolute;inset:0}
    .pic,.whole{position:absolute;left:0;top:0;display:block;width:100%;height:100%}
    /* The lens: a window moved to the pointer by a transform, holding a copy as many times bigger as the zoom (drawn at that size,
       so it stays sharp) that moves the other way, so the spot under the pointer sits in its middle */
    .lens{position:absolute;left:0;top:0;width:calc(var(--r) * 2);height:calc(var(--r) * 2);pointer-events:none;will-change:transform}
    .glass{position:relative;width:100%;height:100%;border-radius:50%;overflow:hidden;background:#0b0d13;box-shadow:0 10px 28px rgba(0,0,0,.55);transform:scale(0);transition:transform var(--grow) cubic-bezier(.2,.8,.2,1)}
    .glass::after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 0 2px rgba(255,255,255,.85),inset 0 0 16px rgba(0,0,0,.35)}
    .square .glass{border-radius:14px}
    .lens-on .glass{transform:scale(1)}
    .zoom{position:absolute;left:0;top:0;display:block;will-change:transform}
    /* See inside and Compare: plain words over the stage */
    .whole,.cross,.twin,.cap{display:none}
    .cap{position:absolute;z-index:3;padding:3px 8px;border-radius:6px;background:rgba(11,11,13,.9);color:#f4f4f2;font:600 13px/1.25 var(--hb-font);white-space:nowrap;pointer-events:none}
    .stage[data-hb-mode="inside"] .cap.in,.stage[data-hb-mode="compare"] .cap.half{display:block}
    /* See inside: zoomed out so the bigger copy fits, drawn whole but faint and outlined, with a cross on the pointer's spot */
    .stage[data-hb-mode="inside"] .mag{overflow:visible}
    .stage[data-hb-mode="inside"] .world{transform:scale(var(--s))}
    .stage[data-hb-mode="inside"] .whole{display:block;opacity:.32;outline:calc(2px / var(--s)) dashed rgba(255,255,255,.7)}
    .stage[data-hb-mode="inside"] .pic{outline:calc(2px / var(--s)) solid rgba(255,255,255,.75)}
    .stage[data-hb-mode="inside"] .cross{display:block}
    .cross{position:absolute;left:0;top:0;width:20px;height:20px;margin:-10px 0 0 -10px;pointer-events:none}
    .cross::before,.cross::after{content:"";position:absolute;left:8px;top:0;width:4px;height:20px;border-radius:2px;background:var(--ui-accent);box-shadow:0 0 0 1.5px #0b0d13}
    .cross::after{transform:rotate(90deg)}
    /* Compare: a copy whose lens stretches a small picture of the watch beside the real one; one pointer moves both */
    .stage[data-hb-mode="compare"]{grid-template-columns:repeat(2,minmax(0,1fr));column-gap:4px}
    .stage[data-hb-mode="compare"] .twin{display:block}
    .cap.half{top:8px}.cap.first{left:8px}.cap.second{left:calc(50% + 10px)}
    @media(prefers-reduced-motion:reduce){.glass{transition:none}}
  </style>
  <link rel="stylesheet" href="../../../assets/css/demo-page.css?v=10">
  <script src="../../../assets/js/demo-page.js?v=10" defer></script>
</head>
<body class="hb" data-hb-kind="do" data-hb-autoplay>
<nav class="hb-bar" aria-label="Animation Handbook">
  <a class="hb-home" href="../../../"><svg class="hb-mark" viewBox="0 0 32 32" aria-hidden="true"><g class="g"><circle cx="11.16" cy="20.84" r="6.1"/><circle cx="15.12" cy="16.88" r="6.1"/><circle cx="18.51" cy="13.49" r="6.1"/></g><circle class="b" cx="21.2" cy="10.8" r="6.6"/></svg><span>Animation Handbook</span></a>
  <span class="hb-pager"><a href="../dynamic-island/" rel="prev" aria-label="Previous: Dynamic Island"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg><span><span class="hb-dir">Previous: </span>Dynamic Island</span></a></span>
  <a class="hb-star" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener" aria-label="Star on GitHub"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg><span>Star on GitHub</span></a>
</nav>
<main class="hb-page">
  <header class="hb-head">
    <p class="hb-cat">04.43 · Micro-Interactions</p>
    <h1>Magnifier Lens</h1>
    <p class="hb-lede">A lens follows your pointer and shows the picture up close. Best for product photos.</p>
  </header>

  <section class="hb-step hb-watch" aria-labelledby="hb-watch-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">1</span>
      <div><h2 id="hb-watch-title">Hover it</h2><p>Point at the watch or touch it, or press Show me.</p></div>
    </div>
    <div class="seg hb-modes" role="group" aria-label="What the box shows" data-hb-modes>
      <button type="button" data-hb-mode="normal" class="on" aria-pressed="true">Normal</button>
      <button type="button" data-hb-mode="inside" aria-pressed="false">See inside</button>
      <button type="button" data-hb-mode="compare" aria-pressed="false">Compare</button>
    </div>
    <div class="stage">
      <svg class="defs" aria-hidden="true"><defs>
        <radialGradient id="mg-bg" cx=".5" cy=".45" r=".7"><stop offset="0" stop-color="#2a3145"/><stop offset="1" stop-color="#0b0d13"/></radialGradient>
        <linearGradient id="mg-case" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef0f4"/><stop offset=".5" stop-color="#9aa0ad"/><stop offset="1" stop-color="#d9dce3"/></linearGradient>
        <radialGradient id="mg-dial" cx=".45" cy=".4" r=".75"><stop offset="0" stop-color="#2b3f78"/><stop offset="1" stop-color="#121a36"/></radialGradient>
        <!-- A made-up watch: its maker's name, a date window, a small seconds dial and two lines of fine print that need the lens -->
        <symbol id="mg-watch" viewBox="0 0 1000 500">
          <rect width="1000" height="500" fill="url(#mg-bg)"/>
          <g transform="translate(100 0)">
          <path d="M332 0H468L460 112H340ZM340 388H460L468 500H332Z" fill="#6b3f26"/>
          <path d="M346 0 351 106M454 0 449 106M351 394 346 500M449 394 454 500" fill="none" stroke="#d9a877" stroke-width="2" stroke-dasharray="6 5"/>
          <rect x="560" y="234" width="24" height="32" rx="5" fill="#a7acb8"/>
          <circle cx="400" cy="250" r="168" fill="url(#mg-case)"/>
          <circle cx="400" cy="250" r="152" fill="url(#mg-dial)"/>
          <circle cx="400" cy="250" r="142" fill="none" stroke="#cfd8ee" stroke-width="7" stroke-dasharray="1.2 13.67" stroke-dashoffset=".6"/>
          <circle cx="400" cy="250" r="132" fill="none" stroke="#f4efe2" stroke-width="16" stroke-dasharray="4 65.12" stroke-dashoffset="2"/>
          <text x="400" y="188" text-anchor="middle" font-size="24" font-weight="800" letter-spacing="5" fill="#f4efe2">NORDVEL</text>
          <text x="400" y="205" text-anchor="middle" font-size="7.5" font-weight="600" letter-spacing="2.5" fill="#d8c79c">AUTOMATIC · CHRONOMETER</text>
          <rect x="494" y="237" width="36" height="26" rx="3" fill="#f7f3ea"/>
          <text x="512" y="256" text-anchor="middle" font-size="17" font-weight="700" fill="#1b2340">14</text>
          <circle cx="400" cy="300" r="30" fill="#16203f" stroke="#d8c79c" stroke-width="1.5"/>
          <circle cx="400" cy="300" r="25" fill="none" stroke="#cfd8ee" stroke-width="4" stroke-dasharray="1 9.47"/>
          <text x="400" y="288" text-anchor="middle" font-size="5.5" fill="#d8c79c">60</text>
          <text x="416" y="302" text-anchor="middle" font-size="5.5" fill="#d8c79c">20</text>
          <text x="384" y="302" text-anchor="middle" font-size="5.5" fill="#d8c79c">40</text>
          <path d="M400 300 409 285" stroke="#e2553f" stroke-width="1.5" stroke-linecap="round"/>
          <text x="400" y="348" text-anchor="middle" font-size="5" font-weight="600" letter-spacing="1" fill="#d8c79c">25 JEWELS · WATER RESIST 100 M</text>
          <text x="400" y="357" text-anchor="middle" font-size="5" font-weight="600" letter-spacing="1" fill="#d8c79c">No. 0417 · MADE BY HAND</text>
          <path d="M400 250 331 210" stroke="#f4efe2" stroke-width="9" stroke-linecap="round"/>
          <path d="M400 250 504 190" stroke="#f4efe2" stroke-width="6" stroke-linecap="round"/>
          <path d="M400 250 513 315" stroke="#e2553f" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="400" cy="250" r="8" fill="#d8c79c"/>
          </g>
        </symbol>
      </defs></svg>
      <div class="mag" id="mag" tabindex="0" role="img" aria-label="A watch with fine print on its face: point at it, touch it or use the arrow keys to see it up close in a lens">
        <div class="world">
          <svg class="whole" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><use href="#mg-watch" width="1000" height="500"/></svg>
          <svg class="pic" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><use href="#mg-watch" width="1000" height="500"/></svg>
          <div class="lens"><div class="glass"><svg class="zoom" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><use href="#mg-watch" width="1000" height="500"/></svg></div></div>
          <span class="cross"></span>
        </div>
      </div>
      <p class="cap in" id="c-copy" aria-hidden="true" data-hb-caption>Bigger copy · slides the other way</p>
      <p class="cap in" id="c-lens" aria-hidden="true" data-hb-caption>Lens · a window onto the copy</p>
      <p class="cap in" id="c-ptr" aria-hidden="true" data-hb-caption>Pointer</p>
      <p class="cap half first" aria-hidden="true" data-hb-caption>Stretched copy</p>
      <p class="cap half second" aria-hidden="true" data-hb-caption>Bigger copy</p>
    </div>
    <div class="hb-player">
      <button class="hb-play" type="button" id="btn-demo" data-hb-demo><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"/></svg>Show me</button>
      <label class="hb-toggle"><input class="hb-switch" type="checkbox" role="switch" id="slow-tog" data-hb-slowmo autocomplete="off"><span>Slow motion</span></label>
    </div>
    <div class="hb-mode-notes" aria-live="polite">
      <p data-hb-for="inside" hidden>Inside, the box is zoomed out: the picture sits in the middle of a faint, bigger copy. The lens is a window onto that copy, which slides the other way as the lens moves.</p>
      <p data-hb-for="compare" hidden>On the left the lens stretches the small picture, so the detail blurs. On the right it shows a bigger copy, so the detail stays sharp.</p>
    </div>
  </section>

  <section class="hb-step hb-try" aria-labelledby="hb-try-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">2</span>
      <div><h2 id="hb-try-title">Try it</h2><p>Change a setting, then point at the watch or press Show me.</p></div>
    </div>
    <div class="hb-settings">
      <div class="hb-setting">
        <p class="hb-setting-name" id="zoom-lbl">Zoom</p>
        <div class="seg" id="zoom-seg" role="group" aria-labelledby="zoom-lbl">
          <button type="button" data-z="2" aria-pressed="false">2 times</button>
          <button type="button" data-z="3" class="on" aria-pressed="true">3 times</button>
          <button type="button" data-z="4" aria-pressed="false">4 times</button>
        </div>
        <p class="hb-hint">How much bigger things look in the lens.</p>
      </div>
      <div class="hb-setting">
        <p class="hb-setting-name" id="size-lbl">Lens size</p>
        <div class="seg" id="size-seg" role="group" aria-labelledby="size-lbl">
          <button type="button" data-r="55" aria-pressed="false">Small</button>
          <button type="button" data-r="75" class="on" aria-pressed="true">Medium</button>
          <button type="button" data-r="100" aria-pressed="false">Large</button>
        </div>
        <p class="hb-hint">A bigger lens shows more around the spot.</p>
      </div>
      <div class="hb-setting">
        <p class="hb-setting-name" id="shape-lbl">Lens shape</p>
        <div class="seg" id="shape-seg" role="group" aria-labelledby="shape-lbl">
          <button type="button" data-shape="round" class="on" aria-pressed="true">Round</button>
          <button type="button" data-shape="square" aria-pressed="false">Square</button>
        </div>
        <p class="hb-hint">Square suits maps and plans.</p>
      </div>
    </div>
  </section>

  <section class="hb-step hb-prompt-step" aria-labelledby="hb-prompt-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">3</span>
      <div><h2 id="hb-prompt-title">Copy the prompt</h2><p>Paste it into an AI assistant such as ChatGPT, Claude or Cursor to build this in your own project.</p></div>
    </div>
    <div class="hb-card">
      <p class="hb-prompt">Add a magnifier lens to [the product photo or detailed picture people want to inspect]. While the pointer is over the picture, show a lens there holding an enlarged copy, placed so the spot under the pointer sits in the middle of the lens. Fill the lens from a larger, sharper version of the picture, never the same small one stretched, and move the lens and the copy with transforms only. On touch screens, show it while a finger is down, just above the finger; from the keyboard, show it on focus and move it with the arrow keys. If the visitor has reduced motion turned on, let it appear without growing. Match the settings listed below.</p>
      <div class="hb-chips-box" hidden>
        <p class="hb-chips-title">Your settings</p>
        <ul class="hb-chips"></ul>
      </div>
      <div class="hb-copy-row">
        <button class="hb-copy" type="button"><svg class="hb-ic hb-i-copy" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><svg class="hb-ic hb-i-done" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span class="hb-copy-label" aria-live="polite">Copy prompt</span></button>
        <p class="hb-hint">Replace the words in brackets with your own element. Your settings are added at the end.</p>
      </div>
    </div>
    <div class="hb-star-row"><p>Free and open source. If this helped, a star on GitHub helps other people find it.</p><a class="hb-star-btn" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>Star on GitHub</a></div>
  </section>

  <section class="hb-about" aria-labelledby="hb-what-title">
    <div class="hb-what">
      <h2 id="hb-what-title">What it is</h2>
      <div class="hb-what-text"><p>The full explanation is in <a href="README.md">README.md</a>.</p></div>
    </div>
    <div class="hb-fit">
      <h2>Good for</h2>
      <ul class="hb-tags hb-good"><li>Product photos</li><li>Maps</li><li>Artwork</li><li>Detailed plans</li></ul>
      <h3>Avoid on</h3>
      <ul class="hb-tags hb-avoid"><li>Small or plain pictures</li></ul>
    </div>
  </section>

  <section class="hb-related" aria-labelledby="hb-related-title" hidden>
    <h2 id="hb-related-title">Similar animations</h2>
    <div class="hb-rel-list"></div>
  </section>
</main>
<footer class="hb-foot"><span>Animation Handbook</span><a href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener">Source on GitHub</a><a href="#top">Back to top ↑</a></footer>
<script>
  const stage=document.querySelector('.stage'),mag=document.getElementById('mag'),defs=stage.querySelector('.defs'),slowTog=document.getElementById('slow-tog');
  const reduceMQ=matchMedia('(prefers-reduced-motion: reduce)'),phoneMQ=matchMedia('(max-width:600px),(max-height:500px)');
  const caps=['c-copy','c-lens','c-ptr'].map(id=>document.getElementById(id));
  const LABELS={normal:mag.getAttribute('aria-label'),
    inside:'Zoomed out: the watch small in the middle of a faint, bigger copy, and the lens showing part of that copy',
    compare:'The watch twice: a lens that stretches a small picture of it, and a lens that shows a bigger, sharp copy'};
  // The details Show me visits, in the drawing's own units (1000 by 500): the maker's name, the date and the fine print
  const SPOTS=[[500,192],[612,250],[500,352]];
  const parts=el=>({el,world:el.querySelector('.world'),lens:el.querySelector('.lens'),zoom:el.querySelector('.zoom'),whole:el.querySelector('.whole'),cross:el.querySelector('.cross'),w:0,h:0});
  const real=parts(mag);
  // fx,fy: the spot magnified, as shares of the picture's width and height; lifted: the lens sits above the spot (for a finger)
  let Z=3,size=75,R=75,mode='normal',twin=null,fx=.5,fy=.5,lifted=false,mouseIn=false,keyed=false,touchId=null,runTimers=[],runFrame=0;
  const frames=()=>twin&&mode==='compare'?[twin,real]:[real];

  // Sizes: the lens, how far See inside zooms out, and each copy as many times bigger than its picture as the zoom
  function measure(){
    R=size*(phoneMQ.matches?.8:1);
    stage.style.setProperty('--r',R+'px');stage.style.setProperty('--s',.92/Z);stage.style.setProperty('--grow',slowTog.checked?'.66s':'.22s');
    for(const f of frames()){
      f.w=f.el.clientWidth;f.h=f.el.clientHeight;
      for(const c of [f.zoom,f.whole])if(c){c.style.width=f.w*Z+'px';c.style.height=f.h*Z+'px'}
    }
    if(twin&&mode==='compare')paintSmall();
    place();
  }
  // The lens over the spot, or just above it for a finger (below it near the top); the copy inside moves the other way by the
  // zoom, so the spot sits in the lens's middle. In See inside the whole copy and a cross on the spot are drawn too.
  function place(){
    for(const f of frames()){
      if(!f.w)continue;
      const x=fx*f.w,y=fy*f.h,up=y-R-28,ly=!lifted?y:up>=R*.6?up:y+R+28;
      f.lens.style.transform=`translate(${x-R}px,${ly-R}px)`;
      f.zoom.style.transform=`translate(${R-x*Z}px,${R-y*Z}px)`;
      if(f.whole){f.whole.style.transform=`translate(${x-x*Z}px,${ly-y*Z}px)`;f.cross.style.transform=`translate(${x}px,${y}px) scale(${Z/.92})`}
    }
    if(mode==='inside')placeCaps();
  }
  const show=on=>stage.classList.toggle('lens-on',on);
  // A point of the drawing as shares of the picture (the drawing is cut to fill it, as a cover image is)
  function spot([px,py]){const w=real.w,h=real.h,k=Math.max(w/1000,h/500);return[((w-1000*k)/2+px*k)/w,((h-500*k)/2+py*k)/h]}
  // At rest: no lens in Normal; See inside holds it in the middle, Compare on the fine print
  const pose=()=>mode==='inside'?[.5,.5]:spot(SPOTS[2]);
  function rest(){lifted=false;if(mode==='normal')show(false);else{[fx,fy]=pose();place();show(true)}}
  const running=()=>runTimers.length>0||runFrame!==0;
  const idle=()=>!mouseIn&&touchId===null&&!keyed&&!running();

  // The pointer's spot on the picture under it (in Compare either half; one pointer moves both lenses)
  function aimAt(e){
    const fs=frames(),f=fs.length>1&&e.clientX<real.el.getBoundingClientRect().left?fs[0]:real,r=f.world.getBoundingClientRect();
    fx=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width));fy=Math.min(1,Math.max(0,(e.clientY-r.top)/r.height));place();
  }
  // A mouse or a pen in the air shows the lens where it points; a finger while it is down, above it (touch-action none keeps the
  // drag on the picture). A run under way stops first.
  stage.addEventListener('pointermove',e=>{
    if(e.pointerType==='touch'){if(e.pointerId===touchId)aimAt(e);return}
    if(e.isTrusted&&running())stopRun();
    mouseIn=true;keyed=false;lifted=false;aimAt(e);show(true);
  });
  stage.addEventListener('pointerleave',e=>{if(e.pointerType==='touch')return;mouseIn=false;if(e.isTrusted&&running())stopRun();if(idle())rest()});
  stage.addEventListener('pointerdown',e=>{
    if(e.pointerType!=='touch'||touchId!==null)return;
    touchId=e.pointerId;try{stage.setPointerCapture(touchId)}catch(_){}
    keyed=false;lifted=true;aimAt(e);show(true);
  });
  ['pointerup','pointercancel'].forEach(t=>stage.addEventListener(t,e=>{if(e.pointerId===touchId){touchId=null;rest()}}));
  // The keyboard: focus shows the lens in the middle, the arrows move it (Shift for bigger steps), Escape puts it away
  mag.addEventListener('focus',()=>{if(!mag.matches(':focus-visible'))return;if(running())stopRun();keyed=true;lifted=false;fx=fy=.5;place();show(true)});
  mag.addEventListener('blur',()=>{if(keyed){keyed=false;if(idle())rest()}});
  mag.addEventListener('keydown',e=>{
    if(e.key==='Escape'){if(keyed){keyed=false;rest()}return}
    const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];
    if(!d||e.altKey||e.ctrlKey||e.metaKey)return;
    e.preventDefault();if(running())stopRun();
    if(!keyed){keyed=true;lifted=false;show(true)}
    const st=e.shiftKey?.15:.04;fx=Math.min(1,Math.max(0,fx+d[0]*st));fy=Math.min(1,Math.max(0,fy+d[1]*st));place();
  });

  // The lens glides to a spot by the time that passes (three times as long in slow motion); under reduced motion it jumps
  function glide(to,ms){
    cancelAnimationFrame(runFrame);runFrame=0;
    if(reduceMQ.matches){[fx,fy]=to;place();return}
    const from=[fx,fy],dur=ms*(slowTog.checked?3:1);let t0=null;
    const step=ts=>{
      if(t0===null)t0=ts;
      const k=reduceMQ.matches?1:Math.min(1,(ts-t0)/dur),e=k*k*(3-2*k);
      fx=from[0]+(to[0]-from[0])*e;fy=from[1]+(to[1]-from[1])*e;place();
      runFrame=k<1?requestAnimationFrame(step):0;
    };
    runFrame=requestAnimationFrame(step);
  }
  // Show me: the lens over the maker's name, the date and the fine print, then away (in See inside and Compare back to its
  // place). Every pause waits on a timer; slow motion triples the moves, never the pauses.
  function later(fn,move,hold){const id=setTimeout(()=>{runTimers=runTimers.filter(t=>t!==id);fn()},move*(slowTog.checked?3:1)+hold);runTimers.push(id)}
  function stopRun(){runTimers.forEach(clearTimeout);runTimers=[];cancelAnimationFrame(runFrame);runFrame=0}
  document.getElementById('btn-demo').addEventListener('click',()=>{
    stopRun();keyed=false;lifted=false;
    const pts=SPOTS.map(spot),view=mode!=='normal',first=view?600:220;
    if(view)glide(pts[0],600);else{[fx,fy]=pts[0];place();show(true)}
    later(()=>glide(pts[1],600),first,350);
    later(()=>glide(pts[2],600),first+600,700);
    later(()=>{if(mode!=='normal')glide(pose(),600);else show(false)},first+1200,1050);
  });
  document.addEventListener('hb:input',()=>{if(running()){stopRun();if(idle())rest()}});
  stage.addEventListener('focusin',e=>{if(e.isTrusted&&running())stopRun()});

  // See inside's three labels: the copy's at its corner, the lens's above it and the pointer's below it; all are measured
  // before any moves, so the page lays out once
  function placeCaps(){
    const s=stage.getBoundingClientRect(),g=real.lens.firstElementChild.getBoundingClientRect(),c=real.whole.getBoundingClientRect();
    const size=caps.map(el=>[el.offsetWidth,el.offsetHeight]),mid=(g.left+g.right)/2-s.left;
    const at=[[c.left-s.left+8,c.top-s.top+8],[mid-size[1][0]/2,g.top-s.top-size[1][1]-8],[mid-size[2][0]/2,g.bottom-s.top+8]];
    caps.forEach((el,i)=>{el.style.left=Math.max(6,Math.min(s.width-size[i][0]-6,at[i][0]))+'px';el.style.top=Math.max(6,Math.min(s.height-size[i][1]-6,at[i][1]))+'px'});
  }
  // Compare's first half: a copy of the watch, made once, with no ids, name or focus, whose lens holds the small picture stretched
  function makeTwin(){
    const el=mag.cloneNode(true);el.removeAttribute('id');el.classList.add('twin');el.inert=true;el.setAttribute('aria-hidden','true');
    ['tabindex','role','aria-label'].forEach(a=>el.removeAttribute(a));
    const c=document.createElement('canvas');c.className='zoom';el.querySelector('.zoom').replaceWith(c);
    stage.insertBefore(el,mag);twin=parts(el);
  }
  // The small picture: the drawing at one pixel per pixel of its half, as a photo shown at its own size would be
  function paintSmall(){
    const w=twin.w,h=twin.h,c=twin.zoom,img=new Image();if(!w||!h)return;
    img.onload=()=>{c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h)};
    img.src='data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" font-family="sans-serif">${defs.innerHTML}<use href="#mg-watch" width="1000" height="500"/></svg>`);
  }
  // The mode switch draws the mode at once: the copies' sizes for its layout, then its picture at rest
  document.addEventListener('hb:mode',e=>{
    mode=e.detail.mode;mag.setAttribute('aria-label',LABELS[mode]);
    if(mode==='compare'&&!twin)makeTwin();
    measure();if(idle())rest();
  });
  new ResizeObserver(measure).observe(stage);

  function choices(id,pick){
    const buttons=document.querySelectorAll('#'+id+' button');
    buttons.forEach(b=>b.addEventListener('click',()=>{
      buttons.forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',String(x===b))});
      pick(b.dataset);measure();
    }));
  }
  choices('zoom-seg',d=>{Z=+d.z});
  choices('size-seg',d=>{size=+d.r});
  choices('shape-seg',d=>{stage.classList.toggle('square',d.shape==='square')});
  slowTog.addEventListener('change',measure);
  measure();
</script>
</body>
</html>
```

Then give it the shared-file version the branch uses (the ledger's N; nothing changes when N is 10):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L4 || exit 1
N=$(grep -o 'shared files ?v=[0-9]*' $TEN/ledger.md | head -1 | grep -o '[0-9]*$')
sed -i "s/demo-page\.css?v=10/demo-page.css?v=$N/; s/demo-page\.js?v=10/demo-page.js?v=$N/" animations/04-micro-interactions/magnifier-lens/index.html
grep -c "demo-page\.css?v=$N\|demo-page\.js?v=$N" animations/04-micro-interactions/magnifier-lens/index.html
```

Expected: `2`.

- [ ] **Step 3: Write the README: `animations/04-micro-interactions/magnifier-lens/README.md`**

````markdown
# Magnifier Lens

[Live demo](https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/magnifier-lens/)

## What it is
A magnifier lens shows part of a picture up close: a round or square window follows the pointer and holds an enlarged copy of the picture, placed so the spot under the pointer sits in the lens's middle. It lets people read fine print and check small details without leaving the page or opening a bigger picture.

## When to use it
- Product photos: stitching, textures, engravings, labels
- Maps and floor plans with small names and numbers
- Artwork and photography, to look at brushwork or grain
- Technical drawings, diagrams and detailed plans

## How it works
The lens is a small box with rounded corners and hidden overflow, moved to the pointer by a transform. Inside it sits a second copy of the picture, as many times bigger as the zoom. The copy moves the other way, so the point under the pointer lands in the lens's middle:

```js
lens.style.transform = `translate(${x - R}px, ${y - R}px)`;        // x, y: the pointer on the picture; R: the lens's radius
copy.style.transform = `translate(${R - x * Z}px, ${R - y * Z}px)`; // Z: the zoom
```

The copy is drawn at its full bigger size, not scaled up with a transform: a layer that is scaled up after it is drawn shows a stretched, blurry picture. Here the drawing is vector, so the bigger copy stays sharp; with photos, the lens loads a larger version of the image. The lens grows in when the pointer arrives and shrinks away when it leaves, a short transition on the lens's scale. A finger shows the lens while it is down, just above the finger so the finger does not cover it, with `touch-action: none` so the drag moves the lens instead of the page. From the keyboard the picture takes focus, which shows the lens in the middle; the arrow keys move it (Shift for bigger steps) and Escape puts it away. Under reduced motion the lens appears and goes without growing, and Show me jumps between the details.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Zoom | 3 times | How many times bigger the copy in the lens is than the picture: 2 times, 3 times or 4 times |
| Lens size | Medium | How wide the lens is: small is 110 pixels across, medium 150 and large 200, a fifth less on phones |
| Lens shape | Round | Round is a circle; square is a square with slightly rounded corners, which suits maps and plans |

## Production notes
- **Use a bigger image.** Stretching the same small image only enlarges its pixels and the detail blurs; load a version two to four times larger (with `srcset`, or lazily when the pointer first arrives) and use it as the lens's copy or as its background.
- **Size it, then move it.** Give the copy its final size in layout and move it only with transforms; scaling it up with a transform after the browser has drawn it as a layer blurs it.
- **Background-image variant.** A lens can also be a single element whose background is the large image, moved with `background-position`; that repaints the lens on every move, which is fine for small lenses.
- **Touch and keyboard.** Show the lens above the finger, flip it below near the top edge, and give keyboard users focus, arrow keys and Escape.
- **Libraries.** Drift, Zoomist and many shop themes package the same idea; in a React app, react-medium-image-zoom or a small custom hook does it.
- **Reduced motion.** Let the lens appear and go at once instead of growing.

## See also
- [Spotlight Hover Glow](../spotlight-hover/) — a light follows the pointer across cards
- [Cursor Follower](../cursor-follower/) — a shape trails the pointer, from the keyboard too
- [Liquid Glass](../../06-3d-advanced/liquid-glass/) — a panel bends the picture behind it at its rim
- [Image Distortion on Hover](../../06-3d-advanced/image-distortion-hover/) — the picture warps near the pointer
````

- [ ] **Step 4: The home page preview**

In the worktree's `index.html`: (a) insert these lines, and one empty line after them, right before the line `/* ── bespoke: 05 Text & Typography ── */` (the end of the 04 bespoke block):

```css
.pv-magnifier{background:#e9e4d6;overflow:hidden;container-type:size}
.pv-magnifier .mp{position:absolute;left:0;top:0;width:100cqw;height:100cqh;background:radial-gradient(circle at 72% 28%,#9fcf8a 0 11%,#0000 11.5%),radial-gradient(circle at 24% 74%,#f2c879 0 7%,#0000 7.5%),linear-gradient(115deg,#0000 44%,#8cc3e8 44.5% 53%,#0000 53.5%),repeating-linear-gradient(0deg,#0000 0 14%,#fff 14% 15.5%),repeating-linear-gradient(90deg,#0000 0 11%,#fff 11% 12.5%),#e9e4d6}
.pv-magnifier .ln{position:absolute;left:0;top:0;width:34cqw;height:34cqw;margin:-17cqw 0 0 -17cqw;border-radius:50%;overflow:hidden;box-shadow:0 0 0 2px #fff,0 6px 16px rgba(0,0,0,.35);animation:magnifier-ln 6s ease-in-out infinite}
.pv-magnifier .ln .mp{transform-origin:0 0;animation:magnifier-mp 6s ease-in-out infinite}
@keyframes magnifier-ln{0%,100%{transform:translate(28cqw,34cqh)}33%{transform:translate(70cqw,40cqh)}66%{transform:translate(48cqw,70cqh)}}
@keyframes magnifier-mp{0%,100%{transform:translate(calc(17cqw - 56cqw),calc(17cqw - 68cqh)) scale(2)}33%{transform:translate(calc(17cqw - 140cqw),calc(17cqw - 80cqh)) scale(2)}66%{transform:translate(calc(17cqw - 96cqw),calc(17cqw - 140cqh)) scale(2)}}
```

(b) insert this line right after the line that starts with `case 'dynisland':`:

```js
    case 'magnifier': return '<span class="mp"></span><span class="ln anim"><span class="mp anim"></span></span>';
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L4 || exit 1
grep -c "pv-magnifier" index.html; grep -c "case 'magnifier':" index.html
```

Expected: a number above 1 (the preview's CSS rules), then `1` (its case).

- [ ] **Step 5: Write the generated files, then the tests pass**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L4 || exit 1
node tools/update-sitemap.mjs && node tools/make-skill.mjs
node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)"
```

Expected: `ℹ fail 0` (this plan's run of every lane on a copy of `feat/ten-animations` at `ece2689`, the finder and Famous effects there, gave it: 1717 pass). If only `tests/finder.test.js` fails (its case 9 waits for Task 11 when the finder has changed since), note the failing lines in your report for Task 11 (lanes never change `tests/`) and go on; any other failure names what to fix in this lane's files.

- [ ] **Step 6: Prove the keyboard test for Task 11, then put the test file back**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L4 || exit 1
sed -i "s/'magnetic-button', 'click-ripple'\]/'magnetic-button', 'click-ripple', 'magnifier-lens']/" tests/pages.test.js
grep -c "'magnifier-lens'" tests/pages.test.js
node --test tests/pages.test.js 2>&1 | grep -E "keyboard|^ℹ (pass|fail)"
git checkout -- tests/pages.test.js && git status --short tests/
```

Expected: `1` (the entry is in), then `✔ the do-it pages played with the pointer can be played from the keyboard` and `ℹ fail 0`, then nothing (the file is back as it was). If the grep prints `0`, the list's last entry changed since this plan: add `'magnifier-lens'` in the `'04-micro-interactions'` list of `KEYBOARD_PAGES` by hand, run, and put the file back the same way.

- [ ] **Step 7: The page check and the short screens (each a background command, waited on)**

The coordinator's server for this lane answers on port 8964: `curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8964/` prints `200` (if not, ask the coordinator). The review kit finds pages under its own folder's root, so it runs from a copy in the worktree (`.superpowers/` is ignored by git):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit
cd $REPO/.claude/worktrees/ten-L4 || exit 1
mkdir -p .superpowers/sdd/kit/review-kit $TEN/checks/L4 && cp $KIT/record.mjs $KIT/kit-lib.mjs .superpowers/sdd/kit/review-kit/ && git status --short | grep -c superpowers
```

Expected: `0` (git does not see the copy). Then start these two, each as its own background command (the round number `1`, then `2`, `3` after fixes):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L4 || exit 1
node $RUN/slot.mjs run ten-L4 -- node tools/check-pages.mjs --base http://127.0.0.1:8964 --out $TEN/checks/L4/1 animations/04-micro-interactions/magnifier-lens home > $TEN/checks/L4/1.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L4/1.log
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L4 || exit 1
node $RUN/slot.mjs run ten-L4 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8964 --short --out $TEN/checks/L4/short-1 animations/04-micro-interactions/magnifier-lens > $TEN/checks/L4/short-1.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L4/short-1.log
```

Wait on each with `node $RUN/wait-log.mjs $TEN/checks/L4/1.log` and `… short-1.log` (again while it says `still running`), then: `grep -c '^ok' $TEN/checks/L4/1.log; grep '^FAIL' $TEN/checks/L4/1.log; tail -2 $TEN/checks/L4/short-1.log`.

Expected: `12` (six `ok` lines each for `magnifier-lens`, the home page), no `FAIL` line, and `27 short-screen pictures checked, 0 with labels cut or overlapping, 0 skipped, 0 failed` with `EXIT=0` (this plan's runs gave exactly these). A `FAIL` line or a cut or overlapping label names the problem (the real branch may differ from the copy this plan was checked on; the ledger's first line says how): fix it in this lane's files, keeping the page's behavior, and run both again as round 2, 3; every round after a change ends with all lines `ok`.

- [ ] **Step 8: Every choice in Try it, in both views (acceptance 7), and the motion in clips**

Two background commands. The first runs the kit's gallery (pictures only: Normal, See inside and Compare at 1280 and 375) once with the defaults (`press-0`) and once for each choice that is not a default and each switch in Try it (never Loop, Slow motion, Pause or Play: playback is not a setting), each into its own folder. The second records the clips (Normal, See inside and Compare at 1280, about seven seconds each, frames kept) with the defaults (`clip-0`): the stills never show a run's middle.

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L4 || exit 1
i=0; for sel in "" "#zoom-seg [data-z='2']" "#zoom-seg [data-z='4']" "#size-seg [data-r='55']" "#size-seg [data-r='100']" "#shape-seg [data-shape='square']"; do echo "== press-$i ${sel:-defaults}"; node $RUN/slot.mjs run ten-L4 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8964 --gallery ${sel:+--press "$sel"} --out $TEN/checks/L4/press-$i animations/04-micro-interactions/magnifier-lens || echo "run $i failed"; i=$((i+1)); done > $TEN/checks/L4/press.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L4/press.log
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L4 || exit 1
i=0; for sel in ""; do echo "== clip-$i ${sel:-defaults}"; node $RUN/slot.mjs run ten-L4 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8964 --only clips --keep-frames ${sel:+--press "$sel"} --out $TEN/checks/L4/clip-$i animations/04-micro-interactions/magnifier-lens || echo "run $i failed"; i=$((i+1)); done > $TEN/checks/L4/clips.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L4/clips.log
```

Wait on each log with `node $RUN/wait-log.mjs`. Expected: 6 `== press-…` lines, each run ending `done  6 pictures, 0 clips and 0 comparisons made, 0 skipped, 0 failed`, and 1 `== clip-…` line, each ending `done  0 pictures, 3 clips and 0 comparisons made, 0 skipped, 0 failed`; no `failed` line, no `was not found`, `EXIT=0` (the kit's lines as this plan's runs printed them). Read each gallery's See inside and Compare pictures at 1280 beside `press-0`'s: each choice visibly changes Normal and both views. Read three frames from the middle of each See inside and Compare clip (the log's `frames kept in <folder>` lines name the folders): the views move as the spec says, nothing jumps or covers the stage in mid-run (this plan's clips found See inside's small copy filling Pixelate Transition's stage while the blocks were small, a fault no still showed). A choice that changes nothing in a view is a fix (the owner's rule: every setting and control visibly changes the stage and both views). Then remove the frame folders: `grep -o 'frames kept in .*' $TEN/checks/L4/clips.log | sed 's/^frames kept in //' | while read -r f; do rm -rf "$f"; done`.

- [ ] **Step 9: Look at the screenshots and check by hand**

Open `$TEN/checks/L4/<round>/04-magnifier-lens-{desktop,phone,phone-reduced}-{inside,compare}.png`, the Normal ones and the short screens' pictures: both views read as the spec says, no label covers another or the part it names, nothing overflows at 320. Then, in the served page (a headless run through the pool, or by reading the code where a run cannot show it):

- The lens grows in where the pointer arrives, follows it, and shrinks away when it leaves; a finger shows it while down, just above the finger (below it near the top); the fine print on the dial cannot be read without the lens.
- Tab to the watch shows the lens in the middle; the arrows move it, Shift for bigger steps; Escape puts it away (in a view, back to its place).
- Show me glides over the maker's name, the date and the fine print, then the lens shrinks away (about 2.7 s; 3.5 s in the views, where it returns to its place: See inside the middle, Compare the fine print); Normal pressed during a view's run puts the lens away at the end, never left posed (G4).
- Zoom (2, 3, 4 times), Lens size (Small, Medium, Large) and Lens shape (Round, Square) change the lens in Normal and both views; under reduced motion the lens appears without growing and Show me jumps between details.

Decisions already made in this page (keep them; a reviewer weighs them): The drawing is 1000 by 500 units with the watch in the middle, so wide boxes show the whole watch; the fine print is 5 units tall, too small to read without the lens. Compare's "Stretched copy" is real: the drawing is made once into a small picture, one pixel per pixel of its half, and the lens shows it stretched by the zoom (its letters fall back to a plain sans-serif, unseen under the blur). See inside zooms out by 0.92 divided by the zoom, and the pointer is held to the small picture there.

- [ ] **Step 10: Frame times (optional: a page moved by transforms)**

One background command, waited on with `wait-log.mjs`:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L4 || exit 1
(node $RUN/slot.mjs run ten-L4 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8964 --modes normal,inside,compare animations/04-micro-interactions/magnifier-lens; node $RUN/slot.mjs run ten-L4 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8964 --phone --modes normal,inside,compare animations/04-micro-interactions/magnifier-lens; node $RUN/slot.mjs run ten-L4 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8964 animations/04-micro-interactions/spotlight-hover; node $RUN/slot.mjs run ten-L4 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8964 --phone animations/04-micro-interactions/spotlight-hover) > $TEN/checks/L4/frames.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L4/frames.log
```

Expected: a median of 16.7 ms in every mode at both sizes, and no larger share of frames slower than 20 ms than Spotlight Hover Glow measured the same way, within a few points (the machine's other work moves these numbers; run again when one looks off). This plan's runs: desktop 0 / 6 / 1%, phone 0 / 1 / 0%; Spotlight Hover Glow 7% and 1%. Report the numbers; nothing to change unless a mode is clearly worse than the closest page.

- [ ] **Step 11: Commit, and the build report**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L4 || exit 1
[ "$(git rev-parse --abbrev-ref HEAD)" = ten/L4 ] || exit 1
git add -A && git status --short
git commit -m "feat: 04.43 Magnifier Lens, with See inside and Compare from the start (lane 4)"
git log --oneline -1
```

Expected before the commit: `A  animations/04-micro-interactions/magnifier-lens/README.md`, `A  animations/04-micro-interactions/magnifier-lens/index.html`, `M  .github/ISSUE_TEMPLATE/config.yml`, `M  404.html`, `M  README.md`, `M  animations/04-micro-interactions/README.md`, `M  index.html`, `M  llms.txt`, `M  sitemap.xml` and the changed files under `skills/animation-handbook/`; nothing else (the kit's copy is ignored; logs and pictures are in `$TEN`). Then write `$TEN/reports/L4/build.md`: first line `RESULT: built <commit>`, then the line count, the page check's `ok` count and its round, the short screens' last line, the galleries and clips looked at (one line per choice: what changes in each view; one line per clip: what moves), the tests' pass and fail line, the frame times, the hand checks' results, every place the page departs from the spec or this task and why, and any shared-file need (the coordinator appends it to `$RUN/shared-wishes.md`; there should be none). Reply to the coordinator in at most three lines.

- [ ] **Step 12: Review, at most three fix rounds**

The coordinator dispatches a reviewer (strongest model, never the builder) with: the spec's section, this task, the builder's report, `git -C $REPO diff feat/ten-animations...ten/L4`, the newest check round and its screenshots, the short screens, the galleries, the clips and the frame times. The reviewer reads CLAUDE.md, the Global Constraints, `$RUN/lessons.md`, `$RUN/briefs/RULINGS.md`, `$RUN/brief-rulings.md`, `$RUN/briefs/OPEN-QUESTIONS.md` and, once it holds the owner's verdict, `$RUN/rulings-159.md`, and checks the diff against them, the rollout's acceptance list (section 1 of the rollout spec), the spec's section and the per-frame work, looking hard at the copy is sized at its full bigger size, never scaled up (sharp); the stretched copy is made only on entering Compare and on resize; hover, touch and keys. It writes `$TEN/reports/L4/review-<k>.md`: first line `RESULT: approved` or `RESULT: changes <count>`, then numbered findings (Critical, Important, Minor), and replies in at most three lines. Each fix round: the builder fixes, runs Steps 5 and 7 again (and the galleries, clips or frame times a fix touches), commits `fix: Magnifier Lens: <what>` after the branch check, writes `$TEN/reports/L4/fix-<k>.md` (`RESULT: built <commit>`), and the reviewer re-reviews only the fix. After three rounds the coordinator steps in. When approved, the coordinator stops the lane's server and adds the ledger line `<date time>  L4  approved at <commit>; check rounds <k>; frames <numbers>; departures: <none or a list>; reports reports/L4/`.

---

### Task 5: L5 · 04.44 Card Deck Swipe (`ten/L5`, port 8965)

Do it · step 1 "Drag it" · player bar: Show me, Reset and Slow motion (the page slows itself). See inside: the pile spread apart and numbered, dashed lines at the swipe distance that light as the card's middle passes them, the pivot below the card with a short arc. Compare: "Vanishes" (a copy whose card slides flat and is gone at once) beside "Flies off". Spec: "5 · Card Deck Swipe (04.44)" in `docs/superpowers/specs/2026-10-13-ten-new-animations-design.md`.

**Files:**
- Create: `animations/04-micro-interactions/card-deck-swipe/index.html` (404 lines), `animations/04-micro-interactions/card-deck-swipe/README.md`
- Modify (by `$TEN/lanes.mjs 5`): `index.html` (the card after Dynamic Island's, the `PV` key, the `PLACES` row, the `FIND` row (the finder is on the branch), every count 166 → 167), `README.md` (counts, 04's count 41 → 42, the catalog line), `animations/04-micro-interactions/README.md` (its line), `.github/ISSUE_TEMPLATE/config.yml`, `404.html`
- Modify (Step 4, by hand): `index.html`: the preview's CSS at the end of the 04 bespoke block, `case 'deckswipe':` in `pvMarkup()`, a `STILL` point
- Regenerate: `sitemap.xml`, `llms.txt`, `skills/animation-handbook/` (their tools)
- Test: `tests/*.test.js` (with a proof edit, put back); the page check of the new page and of the home page; the review kit's short screens, a gallery for the defaults and for each other choice in Try it, clips of the defaults
- Write (run folder): `$TEN/checks/L5/` (logs, screenshots, kit output), `$TEN/reports/L5/build.md`, `fix-<k>.md`; the reviewer `review-<k>.md`

**Interfaces:**
- Consumes: Task 0's worktree `.claude/worktrees/ten-L5` on `ten/L5`, its server on port 8965 (started and stopped by the coordinator), `$TEN/lanes.mjs`, the shared-file version N in the ledger; Phase 0's shared files, its mode press (the shared script presses Show me after See inside or Compare) and its page check; the rollout's review kit and wait tool.
- Produces: branch `ten/L5`: the card `['card-deck-swipe','Card Deck Swipe','Swipe the top card left or right; the next one rises. Best for quick choices.']` (04.44), `PV` key `'card-deck-swipe':'deckswipe'`, `PLACES` `['imgcard']`, `FIND` `'card-deck-swipe':['card','drag click','slide turn']`; Previous: Dynamic Island (for now: Task 11 points it at the page before it in the section); no Next link yet. For Task 11: `'card-deck-swipe'` in the `'04-micro-interactions'` list of `KEYBOARD_PAGES`. The reports in `$TEN/reports/L5/`, which the rollout's final review (part 9) reads too.

- [ ] **Step 1: The lane's shared edits (the failing tests)**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L5 || exit 1
node $TEN/lanes.mjs 5 .
git status --short
node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)" | head -10
```

Expected: `lane 5 shared edits applied to .`; then ` M .github/ISSUE_TEMPLATE/config.yml`, ` M 404.html`, ` M README.md`, ` M animations/04-micro-interactions/README.md`, ` M index.html`; then these 6 failing tests and `ℹ fail 6`: `✖ make-famous: on the real home page every card builds, but the eight whose previews need a script or animate in SVG`, `✖ the answers keep the rules every page of a kind shares: transitions answer newpage, loops loop, scroll pages scroll`, `✖ the Full catalog in the root README lists every card once, in home order, linked to its live page`, `✖ the counts written in the issue template, the 404 page and the sitemap match the cards`, `✖ the skill and llms.txt are what tools/make-skill.mjs writes from the pages and the home page now`, `✖ llms.txt lists every card once, in the order of CATS, with its live address and its description, and links the skill files`. (Famous effects' test builds every card's preview, which Step 4 adds; the finder's reads each page's kind, from a page that is not there yet; this plan's run of every lane on a copy of `feat/ten-animations` at `ece2689`, the finder and Famous effects there, gave exactly these.) If `lanes.mjs` stops with `not found (…)`, stop and tell the coordinator, who alone edits `$TEN/lanes.mjs`; before running it again, put the worktree back with `git checkout -- .` (this step makes no other changes; the tool refuses a second run on a changed tree).

- [ ] **Step 2: Write the page: `animations/04-micro-interactions/card-deck-swipe/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Card Deck Swipe — Animation Handbook</title>
  <meta name="description" content="Swipe the top card left or right; the next one rises. Best for quick choices.">
  <link rel="canonical" href="https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/card-deck-swipe/">
  <link rel="icon" type="image/png" sizes="96x96" href="../../../favicon.png">
  <link rel="icon" type="image/svg+xml" href="../../../favicon.svg">
  <link rel="apple-touch-icon" href="../../../apple-touch-icon.png">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Animation Handbook">
  <meta property="og:title" content="Card Deck Swipe — Animation Handbook">
  <meta property="og:description" content="Swipe the top card left or right; the next one rises. Best for quick choices.">
  <meta property="og:url" content="https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/card-deck-swipe/">
  <meta property="og:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Card Deck Swipe — Animation Handbook">
  <meta name="twitter:description" content="Swipe the top card left or right; the next one rises. Best for quick choices.">
  <meta name="twitter:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <script type="application/ld+json">{"@context": "https://schema.org", "@type": "TechArticle", "headline": "Card Deck Swipe", "name": "Card Deck Swipe", "description": "Swipe the top card left or right; the next one rises. Best for quick choices.", "url": "https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/card-deck-swipe/", "inLanguage": "en", "articleSection": "Micro-Interactions", "isPartOf": {"@type": "WebSite", "name": "Animation Handbook", "url": "https://matinmonshizadeh.github.io/animation-handbook/"}, "author": {"@type": "Person", "name": "matinmonshizadeh"}, "keywords": "web animation, CSS animation, Micro-Interactions, Card Deck Swipe"}</script>
  <style>
    :root{--ui-accent:#ff9d5c;--like:#34c77b;--nope:#ff5a5f;--undo:#f5c84c}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    /* --sp: 3 in slow motion. The box is taller on phones, in every mode alike, so the pile and its buttons both fit */
    .stage{--sp:1;--hb-stage-h-phone:400px;position:relative;display:flex;flex-direction:column;background:#0b0b0d;-webkit-user-select:none;user-select:none}
    .decks{flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}
    .deck{position:relative;min-width:0;container-type:size}
    .pile{position:absolute;inset:0}
    /* A card: about 60% of the box's width at most, turning around a point below its bottom edge (transform-origin) */
    .card{--tb:translateY(calc(var(--i) * 12px)) scale(calc(1 - var(--i) * .05));position:absolute;left:50%;top:50%;width:min(70cqh,60cqw);aspect-ratio:4/5;translate:-50% -50%;
      display:flex;flex-direction:column;overflow:hidden;border-radius:14px;background:#17171c;box-shadow:0 10px 26px rgba(0,0,0,.45);container-type:inline-size;
      transform-origin:50% 130%;transform:var(--spread,translate(0)) var(--tb);touch-action:pan-y;cursor:grab;
      transition:transform calc(.3s * var(--sp)) cubic-bezier(.2,.8,.2,1),opacity calc(.3s * var(--sp))}
    .fan .card{--tb:rotate(calc(var(--i) * var(--f) * 5deg)) scale(calc(1 - var(--i) * .03))}
    .hide .card{--tb:scale(calc(1 - min(var(--i),1) * .05))}
    .hide .card:not(.top),.card.deep{opacity:0}
    .card.drag{transition:none}
    .card.spring{transition:transform calc(.4s * var(--sp)) cubic-bezier(.3,1.35,.5,1),opacity calc(.3s * var(--sp))}
    .card.out{pointer-events:none;transition:transform calc(.42s * var(--sp)) cubic-bezier(.4,0,1,1),opacity calc(.42s * var(--sp)) ease-in}
    .photo{flex:1;min-height:0;background:radial-gradient(circle at 50% 44%,#f1c7a3 0 15%,#0000 15.5%),radial-gradient(circle at 50% 37%,var(--hair) 0 19%,#0000 19.5%),radial-gradient(ellipse 34% 24% at 50% 100%,var(--shirt) 0 99%,#0000 100%),linear-gradient(160deg,var(--bg1),var(--bg2))}
    .who{padding:8cqw 9cqw 1cqw;color:#f4f4f2;font:700 clamp(12px,8.5cqw,19px)/1.2 var(--hb-font)}
    .line{padding:0 9cqw;color:#b4b4bb;font:500 clamp(10px,6cqw,13px)/1.4 var(--hb-font);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .line:last-of-type{padding-bottom:7cqw}
    .stamp{position:absolute;top:8%;padding:1px 8px;border:3px solid;border-radius:8px;font:800 clamp(13px,11cqw,24px)/1.15 var(--hb-font);letter-spacing:.06em;opacity:0;pointer-events:none}
    .like{left:8%;color:var(--like);transform:rotate(-14deg)}.nope{right:8%;color:var(--nope);transform:rotate(14deg)}
    .spring .stamp{transition:opacity calc(.3s * var(--sp))}
    /* Nope, Undo and Like: round buttons under the pile, 48px to touch */
    .acts{display:flex;justify-content:center;gap:18px;padding:8px 0 12px}
    .act{display:grid;place-items:center;width:48px;height:48px;border-radius:50%;border:1px solid rgba(255,255,255,.14);background:#17171c;cursor:pointer}
    .act svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
    .nope-b{color:var(--nope)}.undo-b{color:var(--undo)}.like-b{color:var(--like)}
    @media(hover:hover){.act:hover{border-color:currentColor}}
    /* See inside and Compare: plain words over the stage; in See inside the pile spread apart and numbered, the swipe distance
       dashed on both sides (lit once the card's middle passes it) and the point the card turns around */
    .guide,.pivot,.twin,.cap{display:none}
    .cap{position:absolute;z-index:3;padding:3px 8px;border-radius:6px;background:rgba(11,11,13,.9);color:#f4f4f2;font:600 13px/1.25 var(--hb-font);white-space:nowrap;pointer-events:none}
    .stage[data-hb-mode="inside"] .cap.in,.stage[data-hb-mode="compare"] .cap.half{display:block}
    .stage[data-hb-mode="inside"] .deck{transform:scale(.7);transform-origin:50% 8%}
    .stage[data-hb-mode="inside"] .card{--spread:translate(calc(var(--i) * -40px),calc(var(--i) * -14px))}
    .stage[data-hb-mode="inside"].hide .card:not(.top):not(.deep){opacity:.45}
    .stage[data-hb-mode="inside"] .card::after{content:attr(data-n);position:absolute;left:8px;bottom:8px;width:32px;height:32px;border-radius:50%;background:var(--ui-accent);color:#16161a;font:800 18px/32px var(--hb-font);text-align:center}
    .stage[data-hb-mode="inside"] .guide,.stage[data-hb-mode="inside"] .pivot{display:block}
    .guide{position:absolute;left:50%;top:0;z-index:2;border-left:3px dashed rgba(255,255,255,.6);pointer-events:none}
    .guide.lit{border-left-color:var(--ui-accent)}
    .pivot{position:absolute;left:0;top:0;z-index:2;width:60px;height:60px;margin:-30px 0 0 -30px;overflow:visible;pointer-events:none}
    .pivot path{fill:none;stroke:var(--ui-accent);stroke-width:3;stroke-linecap:round}.pivot circle{fill:var(--ui-accent);stroke:#0b0b0d;stroke-width:2}
    /* Compare: a copy of the pile whose cards slide flat and vanish beside the real one; one drag moves both; a card flying off
       is cut off at its own half's edge (lesson 14) */
    .stage[data-hb-mode="compare"] .decks{grid-template-columns:repeat(2,minmax(0,1fr));column-gap:4px}.stage[data-hb-mode="compare"] .deck{overflow:hidden}
    .stage[data-hb-mode="compare"] .twin{display:block}
    .twin .card,.twin .card.spring{transition:none}
    .cap.half{top:8px}.cap.first{left:8px}.cap.second{left:calc(50% + 10px)}
    @media(prefers-reduced-motion:reduce){.card,.card.spring,.card.out{transition:opacity .2s}.spring .stamp{transition:none}}
  </style>
  <link rel="stylesheet" href="../../../assets/css/demo-page.css?v=10">
  <script src="../../../assets/js/demo-page.js?v=10" defer></script>
</head>
<body class="hb" data-hb-kind="do" data-hb-autoplay>
<nav class="hb-bar" aria-label="Animation Handbook">
  <a class="hb-home" href="../../../"><svg class="hb-mark" viewBox="0 0 32 32" aria-hidden="true"><g class="g"><circle cx="11.16" cy="20.84" r="6.1"/><circle cx="15.12" cy="16.88" r="6.1"/><circle cx="18.51" cy="13.49" r="6.1"/></g><circle class="b" cx="21.2" cy="10.8" r="6.6"/></svg><span>Animation Handbook</span></a>
  <span class="hb-pager"><a href="../dynamic-island/" rel="prev" aria-label="Previous: Dynamic Island"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg><span><span class="hb-dir">Previous: </span>Dynamic Island</span></a></span>
  <a class="hb-star" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener" aria-label="Star on GitHub"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg><span>Star on GitHub</span></a>
</nav>
<main class="hb-page">
  <header class="hb-head">
    <p class="hb-cat">04.44 · Micro-Interactions</p>
    <h1>Card Deck Swipe</h1>
    <p class="hb-lede">Swipe the top card left or right; the next one rises. Best for quick choices.</p>
  </header>

  <section class="hb-step hb-watch" aria-labelledby="hb-watch-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">1</span>
      <div><h2 id="hb-watch-title">Drag it</h2><p>Drag the top card sideways and let go, or press Show me.</p></div>
    </div>
    <div class="seg hb-modes" role="group" aria-label="What the box shows" data-hb-modes>
      <button type="button" data-hb-mode="normal" class="on" aria-pressed="true">Normal</button>
      <button type="button" data-hb-mode="inside" aria-pressed="false">See inside</button>
      <button type="button" data-hb-mode="compare" aria-pressed="false">Compare</button>
    </div>
    <div class="stage">
      <div class="decks">
        <div class="deck" id="deck">
          <div class="pile" id="pile" role="group" aria-label="Profile cards"></div>
          <span class="guide gl" aria-hidden="true"></span><span class="guide gr" aria-hidden="true"></span>
          <svg class="pivot" viewBox="-30 -30 60 60" aria-hidden="true"><path d="M-17-13A21 21 0 0 1 17-13M11-19 17-13 10-8M-11-19-17-13-10-8"/><circle r="6"/></svg>
        </div>
      </div>
      <div class="acts">
        <button class="act nope-b" type="button" id="btn-nope" aria-label="Nope"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
        <button class="act undo-b" type="button" id="btn-undo" aria-label="Undo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg></button>
        <button class="act like-b" type="button" id="btn-like" aria-label="Like"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg></button>
      </div>
      <p class="cap in" id="c-go" aria-hidden="true" data-hb-caption>Let go past here: it flies</p>
      <p class="cap in" id="c-held" aria-hidden="true" data-hb-caption>Held here, so it turns</p>
      <p class="cap in" id="c-next" aria-hidden="true" data-hb-caption>Next · waits a little smaller</p>
      <p class="cap half first" aria-hidden="true" data-hb-caption>Vanishes</p>
      <p class="cap half second" aria-hidden="true" data-hb-caption>Flies off</p>
    </div>
    <div class="hb-player">
      <button class="hb-play" type="button" id="btn-demo" data-hb-demo><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"/></svg>Show me</button>
      <button class="hb-play" type="button" id="btn-reset" data-hb-reset><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>Reset</button>
      <label class="hb-toggle"><input class="hb-switch" type="checkbox" role="switch" id="slow-tog" data-hb-slowmo autocomplete="off"><span>Slow motion</span></label>
    </div>
    <div class="hb-mode-notes" aria-live="polite">
      <p data-hb-for="inside" hidden>Inside, the pile is spread apart and numbered: each waiting card is smaller. The top card turns around a point below it, and a dashed line lights once it is far enough to fly.</p>
      <p data-hb-for="compare" hidden>On the left the card vanishes when you let go, so it is hard to tell where it went. On the right it flies off the side you chose as the next one rises.</p>
    </div>
  </section>

  <section class="hb-step hb-try" aria-labelledby="hb-try-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">2</span>
      <div><h2 id="hb-try-title">Try it</h2><p>Change a setting, then drag a card or press Show me.</p></div>
    </div>
    <div class="hb-settings">
      <div class="hb-setting">
        <p class="hb-setting-name" id="dist-lbl">How far to swipe</p>
        <div class="seg" id="dist-seg" role="group" aria-labelledby="dist-lbl">
          <button type="button" data-t="0.25" aria-pressed="false">Short</button>
          <button type="button" data-t="0.4" class="on" aria-pressed="true">Medium</button>
          <button type="button" data-t="0.6" aria-pressed="false">Long</button>
        </div>
        <p class="hb-hint">How far to drag before letting go sends it.</p>
      </div>
      <div class="hb-setting">
        <p class="hb-setting-name" id="turn-lbl">How much it turns</p>
        <div class="seg" id="turn-seg" role="group" aria-labelledby="turn-lbl">
          <button type="button" data-turn="0" aria-pressed="false">None</button>
          <button type="button" data-turn="14" class="on" aria-pressed="true">A little</button>
          <button type="button" data-turn="30" aria-pressed="false">A lot</button>
        </div>
        <p class="hb-hint">As if held at the bottom edge.</p>
      </div>
      <div class="hb-setting">
        <label class="hb-switch-row"><span>Shows stamps</span><input class="hb-switch" type="checkbox" role="switch" id="stamp-tog" checked autocomplete="off"></label>
        <p class="hb-hint">Like and Nope fade in as you drag.</p>
      </div>
    </div>
    <details class="hb-options">
      <summary><span class="hb-more-label">More options</span><span class="hb-less">Fewer options</span><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary>
      <div class="hb-settings">
        <div class="hb-setting">
          <p class="hb-setting-name" id="behind-lbl">Cards behind</p>
          <div class="seg" id="behind-seg" role="group" aria-labelledby="behind-lbl">
            <button type="button" data-behind="peek" class="on" aria-pressed="true">Peeking</button>
            <button type="button" data-behind="fan" aria-pressed="false">Fanned</button>
            <button type="button" data-behind="hide" aria-pressed="false">Hidden</button>
          </div>
          <p class="hb-hint">How the waiting cards show.</p>
        </div>
      </div>
    </details>
  </section>

  <section class="hb-step hb-prompt-step" aria-labelledby="hb-prompt-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">3</span>
      <div><h2 id="hb-prompt-title">Copy the prompt</h2><p>Paste it into an AI assistant such as ChatGPT, Claude or Cursor to build this in your own project.</p></div>
    </div>
    <div class="hb-card">
      <p class="hb-prompt">Add a swipeable card deck to [your stack of cards, such as profiles or products]. Pile the cards with the waiting ones behind the top one, showing as the settings choose. While dragged, the top card follows the finger and turns as the settings choose, as if held at its bottom edge, and Like or Nope stamps fade in when the settings include them. On release, send it off that side if it went far enough or was flicked; otherwise spring it back, and grow the next card into place. Use transforms and pointer events, and add Nope, Like and Undo buttons for keyboards. If the visitor has reduced motion turned on, fade cards out instead of throwing them. Match the settings listed below.</p>
      <div class="hb-chips-box" hidden>
        <p class="hb-chips-title">Your settings</p>
        <ul class="hb-chips"></ul>
      </div>
      <div class="hb-copy-row">
        <button class="hb-copy" type="button"><svg class="hb-ic hb-i-copy" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><svg class="hb-ic hb-i-done" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span class="hb-copy-label" aria-live="polite">Copy prompt</span></button>
        <p class="hb-hint">Replace the words in brackets with your own element. Your settings are added at the end.</p>
      </div>
    </div>
    <div class="hb-star-row"><p>Free and open source. If this helped, a star on GitHub helps other people find it.</p><a class="hb-star-btn" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>Star on GitHub</a></div>
  </section>

  <section class="hb-about" aria-labelledby="hb-what-title">
    <div class="hb-what">
      <h2 id="hb-what-title">What it is</h2>
      <div class="hb-what-text"><p>The full explanation is in <a href="README.md">README.md</a>.</p></div>
    </div>
    <div class="hb-fit">
      <h2>Good for</h2>
      <ul class="hb-tags hb-good"><li>Matching apps</li><li>Product pickers</li><li>Flashcards</li><li>Quick polls</li></ul>
      <h3>Avoid on</h3>
      <ul class="hb-tags hb-avoid"><li>Lists people compare</li><li>Choices that need care</li></ul>
    </div>
  </section>

  <section class="hb-related" aria-labelledby="hb-related-title" hidden>
    <h2 id="hb-related-title">Similar animations</h2>
    <div class="hb-rel-list"></div>
  </section>
</main>
<footer class="hb-foot"><span>Animation Handbook</span><a href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener">Source on GitHub</a><a href="#top">Back to top ↑</a></footer>
<script>
  const stage=document.querySelector('.stage'),deck=document.getElementById('deck'),slowTog=document.getElementById('slow-tog');
  const reduceMQ=matchMedia('(prefers-reduced-motion: reduce)'),gl=deck.querySelector('.gl'),gr=deck.querySelector('.gr'),pivot=deck.querySelector('.pivot');
  const caps=['c-go','c-held','c-next'].map(id=>document.getElementById(id));
  // Five made-up people: name, two lines, and the picture's colors (background, shirt, hair)
  const PEOPLE=[['Mira, 27','Climbs on weekends','Bakes bread at dawn','#ff9a76','#7c4dff','#2f3b8f','#3b2416'],
    ['Theo, 31','Plays the cello','Has two old cats','#5ec7c0','#1f5f8b','#e8b04a','#1b1b1f'],
    ['Lena, 25','Draws maps for fun','Runs by the river','#f6c85f','#d1495b','#3a7d44','#8a4b2a'],
    ['Kofi, 29','Cooks for twelve','Fixes old bikes','#8fb8ff','#3d348b','#f26b38','#16120f'],
    ['Ines, 33','Grows tomatoes','Loves night trains','#b8e1a3','#2d6a4f','#9b5de5','#5a2d1c']];
  const real={pile:document.getElementById('pile'),twin:false};
  // thr: how far the card's middle must go to fly, as a share of its width; turn: degrees of turn for a card width of drag
  let thr=.4,turn=14,stamps=true,mode='normal',twin=null,cardW=0,cardH=0,dx=0,gone=[],drag=null,runTimers=[],runFrame=0,runDragging=false;
  const decks=()=>twin?[real,twin]:[real];
  const live=d=>[...d.pile.children].filter(c=>!c.classList.contains('out'));
  const topOf=d=>{const l=live(d);return l[l.length-1]||null};
  const clamp01=x=>Math.min(1,Math.max(0,x));

  function cardEl(p,copy){
    const [who,l1,l2,bg1,bg2,shirt,hair]=PEOPLE[p],c=document.createElement('div');
    c.className='card';c.dataset.p=p;c.style.setProperty('--f',p%2?1:-1);
    c.innerHTML=`<div class="photo" style="--bg1:${bg1};--bg2:${bg2};--shirt:${shirt};--hair:${hair}"></div><p class="who">${who}</p><p class="line">${l1}</p><p class="line">${l2}</p>`+
      (copy?'':'<span class="stamp like" aria-hidden="true">LIKE</span><span class="stamp nope" aria-hidden="true">NOPE</span>');
    return c;
  }
  // Depth of every card (0 on top); only the top card of the real pile takes focus, and it says what the keys do
  function restack(d){
    const l=live(d);
    l.forEach((c,k)=>{
      const i=l.length-1-k;c.style.setProperty('--i',i);c.dataset.n=i+1;c.classList.toggle('top',!i);c.classList.toggle('deep',i>=(mode==='inside'?4:3));
      if(i)c.style.transform='';
      if(d.twin)return;
      if(i)c.querySelectorAll('.stamp').forEach(m=>{m.style.opacity=''});
      c.tabIndex=i?-1:0;
      if(i)c.removeAttribute('aria-label');else c.setAttribute('aria-label',PEOPLE[c.dataset.p].slice(0,3).join(', ')+'. Left arrow for Nope, right arrow for Like');
    });
  }
  function build(){gone=[];dx=0;for(const d of decks()){d.pile.textContent='';[4,3,2,1,0].forEach(p=>d.pile.appendChild(cardEl(p,d.twin)));restack(d)}}
  // The top card where a drag puts it: moved, turned around its pivot below, its stamp as strong as the drag is far; the copy in
  // Compare only slides, flat. See inside lights the line the card's middle has passed and moves the pivot with the card.
  function follow(x,y=0){
    dx=x;const c=topOf(real),s=thr*cardW,t=twin&&topOf(twin);
    if(c){
      c.style.transform=x||y?`translate(${x}px,${y}px) rotate(${cardW?x/cardW*turn:0}deg)`:'';
      c.querySelector('.like').style.opacity=stamps?clamp01(x/s):0;c.querySelector('.nope').style.opacity=stamps?clamp01(-x/s):0;
    }
    if(t)t.style.transform=x?`translateX(${x}px)`:'';
    gr.classList.toggle('lit',x>s);gl.classList.toggle('lit',-x>s);
    pivot.style.transform=`translate(${deck.clientWidth/2+x}px,${deck.clientHeight/2+cardH*.8+y}px)`;
    if(mode==='inside')placeCaps();
  }
  // At rest the top card sits in the middle; See inside holds it half way to the line, Compare a third of a card to the right
  // (short of the line, so a plain click never sends it)
  const restX=()=>mode==='inside'?thr*cardW/2:mode==='compare'?Math.min(cardW/3,thr*cardW*.8):0;
  function settle(spring){
    for(const d of decks()){const c=topOf(d);if(c){c.classList.remove('drag');c.classList.toggle('spring',spring)}}
    follow(restX());
  }
  // The top card leaves to one side (under reduced motion it fades where it is); the copy's card vanishes at once; the next card
  // grows into place, and an empty pile fills again
  function send(dir){
    const c=topOf(real);if(!c)return;
    const had=document.activeElement===c,t=twin&&topOf(twin);
    gone.push({p:+c.dataset.p,dir});if(t)t.remove();
    c.classList.remove('drag','spring','top');c.classList.add('out');c.style.opacity='0';
    if(!reduceMQ.matches)c.style.transform=`translate(${dir*cardW*2.2}px,${-cardW*.12}px) rotate(${dir*Math.max(turn,8)*1.6}deg)`;
    c.addEventListener('transitionend',()=>{c.remove();if(!live(real).length&&!real.pile.children.length){build();settle(false)}},{once:true});
    for(const d of decks())restack(d);
    settle(!reduceMQ.matches);
    const n=topOf(real);if(had)(n||document.getElementById('btn-undo')).focus({preventScroll:true});
  }
  // Undo: the last card comes back from the side it left on (under reduced motion it fades in)
  function undo(){
    const g=gone.pop();if(!g)return;
    const c=cardEl(g.p,false);c.classList.add('drag');c.style.opacity='0';
    if(!reduceMQ.matches)c.style.transform=`translate(${g.dir*cardW*2.2}px,${-cardW*.12}px) rotate(${g.dir*Math.max(turn,8)*1.6}deg)`;
    real.pile.appendChild(c);if(twin)twin.pile.appendChild(cardEl(g.p,true));
    for(const d of decks())restack(d);
    void c.offsetWidth;c.style.opacity='';settle(!reduceMQ.matches);
  }

  // The visitor's drag: the top card follows the pointer (touch-action pan-y keeps the page scrolling up and down); letting go
  // past the line or with a flick sends it, otherwise it springs back
  const scale=()=>deck.getBoundingClientRect().width/deck.offsetWidth||1;
  real.pile.addEventListener('pointerdown',e=>{
    const c=e.target.closest('.card');if(!c||c!==topOf(real)||(e.pointerType==='mouse'&&e.button!==0))return;
    stopRun();const k=scale();
    drag={id:e.pointerId,x0:e.clientX-dx*k,y0:e.clientY,k,lastX:e.clientX,lastT:performance.now(),vel:0};
    for(const d of decks()){const t=topOf(d);if(t){t.classList.add('drag');t.classList.remove('spring')}}
    c.setPointerCapture(e.pointerId);
  });
  real.pile.addEventListener('pointermove',e=>{
    if(!drag||e.pointerId!==drag.id)return;
    const now=performance.now();if(now>drag.lastT){drag.vel=(e.clientX-drag.lastX)/(now-drag.lastT);drag.lastX=e.clientX;drag.lastT=now}
    follow((e.clientX-drag.x0)/drag.k,(e.clientY-drag.y0)/drag.k*.25);
  });
  function release(e,cancelled){
    if(!drag||e.pointerId!==drag.id)return;
    const d=drag;drag=null;if(performance.now()-d.lastT>100)d.vel=0;
    const past=Math.abs(dx)>thr*cardW,flick=Math.abs(d.vel)>.5&&Math.abs(dx)>20&&Math.sign(d.vel)===Math.sign(dx);
    if(!cancelled&&(past||flick))send(dx>0?1:-1);else settle(!reduceMQ.matches);
  }
  real.pile.addEventListener('pointerup',e=>release(e,false));
  real.pile.addEventListener('pointercancel',e=>release(e,true));
  // The keyboard and the buttons: Left and Right on the focused top card, or Nope, Like and Undo
  real.pile.addEventListener('keydown',e=>{
    if(e.target!==topOf(real)||(e.key!=='ArrowLeft'&&e.key!=='ArrowRight'))return;
    e.preventDefault();stopRun();send(e.key==='ArrowRight'?1:-1);
  });
  document.getElementById('btn-nope').addEventListener('click',()=>{stopRun();send(-1)});
  document.getElementById('btn-like').addEventListener('click',()=>{stopRun();send(1)});
  document.getElementById('btn-undo').addEventListener('click',()=>{stopRun();undo()});

  // Show me: a drag that springs back, a throw to the left, then Undo. Its drags move the card the way a finger would, by the
  // time that passes; every pause waits on a timer, and slow motion triples the moves, never the pauses.
  function later(fn,move,hold){const id=setTimeout(()=>{runTimers=runTimers.filter(t=>t!==id);fn()},move*(slowTog.checked?3:1)+hold);runTimers.push(id)}
  const running=()=>runTimers.length>0||runFrame!==0;
  function runDrag(to,ms,then){
    for(const d of decks()){const t=topOf(d);if(t){t.classList.add('drag');t.classList.remove('spring')}}
    const from=dx,dur=ms*(slowTog.checked?3:1);let t0=null;runDragging=true;
    const step=ts=>{
      if(t0===null)t0=ts;
      const k=reduceMQ.matches?1:Math.min(1,(ts-t0)/dur);follow(from+(to-from)*k*k*(3-2*k));
      if(k<1){runFrame=requestAnimationFrame(step);return}
      runFrame=0;runDragging=false;then();
    };
    runFrame=requestAnimationFrame(step);
  }
  function stopRun(){
    runTimers.forEach(clearTimeout);runTimers=[];cancelAnimationFrame(runFrame);runFrame=0;
    if(runDragging){runDragging=false;settle(!reduceMQ.matches)}
  }
  document.getElementById('btn-demo').addEventListener('click',()=>{
    stopRun();if(!topOf(real))return;
    const s=thr*cardW;
    runDrag(restX()+s*.55,700,()=>settle(!reduceMQ.matches));
    // the spring-back (400 ms) and the fly-off (420 ms) count as moves, so slow motion slows them as it slows the drags
    later(()=>runDrag(-(s+cardW*.2),600,()=>send(-1)),700+400,200);
    later(undo,1300+400+420,580);
  });
  document.getElementById('btn-reset').addEventListener('click',()=>{stopRun();build();settle(false)});
  document.addEventListener('hb:input',()=>{if(running())stopRun()});
  stage.addEventListener('focusin',e=>{if(e.isTrusted&&running())stopRun()});

  // See inside's labels: the line's under its end, the pivot's to its left (never higher than under the line's), the next
  // card's above it; all are measured before any moves
  function placeCaps(){
    const s=stage.getBoundingClientRect(),g=gr.getBoundingClientRect(),p=pivot.getBoundingClientRect(),n=live(real),nx=n[n.length-2];
    const size=caps.map(el=>[el.offsetWidth,el.offsetHeight]),b=nx?nx.getBoundingClientRect():null;
    const at=[[(g.left+g.right)/2-s.left-size[0][0]/2,g.bottom-s.top+4],[p.left-s.left-size[1][0]-4,Math.max((p.top+p.bottom)/2-size[1][1]/2,g.bottom+size[0][1]+8)-s.top],
      b?[b.left-s.left,b.top-s.top-size[2][1]-6]:[6,6]];
    caps.forEach((el,i)=>{el.style.left=Math.max(6,Math.min(s.width-size[i][0]-6,at[i][0]))+'px';el.style.top=Math.max(6,Math.min(s.height-size[i][1]-6,at[i][1]))+'px'});
  }
  // Compare's first half: a copy of the pile, made once, inert and unnamed; it then follows every change of the real one
  function makeTwin(){
    const el=document.createElement('div');el.className='deck twin';el.inert=true;el.setAttribute('aria-hidden','true');
    el.innerHTML='<div class="pile"></div>';deck.before(el);twin={pile:el.firstChild,twin:true};
    live(real).forEach(c=>twin.pile.appendChild(cardEl(+c.dataset.p,true)));restack(twin);
  }
  // Card sizes, and the dashed lines at the swipe distance, as tall as a card and a little more
  function measure(){
    const c=real.pile.querySelector('.card');cardW=c?c.offsetWidth:0;cardH=c?c.offsetHeight:0;
    for(const [g,k] of [[gl,-1],[gr,1]]){g.style.top=deck.clientHeight/2-cardH*.6+'px';g.style.height=cardH*1.16+'px';g.style.transform=`translateX(${k*thr*cardW}px)`}
  }
  // The mode switch draws the mode at once: the card at the mode's rest, with no spring
  document.addEventListener('hb:mode',e=>{
    mode=e.detail.mode;
    if(mode==='compare'&&!twin)makeTwin();
    for(const d of decks())restack(d);
    measure();if(!drag&&!running())settle(false);else follow(dx);
  });
  new ResizeObserver(()=>{measure();follow(drag||running()?dx:restX())}).observe(deck);

  function choices(id,pick){
    const buttons=document.querySelectorAll('#'+id+' button');
    buttons.forEach(b=>b.addEventListener('click',()=>{
      buttons.forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',String(x===b))});
      pick(b.dataset);measure();if(!drag&&!running())settle(false);
    }));
  }
  choices('dist-seg',d=>{thr=+d.t});
  choices('turn-seg',d=>{turn=+d.turn});
  choices('behind-seg',d=>{stage.classList.remove('fan','hide');if(d.behind!=='peek')stage.classList.add(d.behind)});
  document.getElementById('stamp-tog').addEventListener('change',e=>{stamps=e.target.checked;follow(dx)});
  slowTog.addEventListener('change',()=>stage.style.setProperty('--sp',slowTog.checked?3:1));
  build();measure();
</script>
</body>
</html>
```

Then give it the shared-file version the branch uses (the ledger's N; nothing changes when N is 10):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L5 || exit 1
N=$(grep -o 'shared files ?v=[0-9]*' $TEN/ledger.md | head -1 | grep -o '[0-9]*$')
sed -i "s/demo-page\.css?v=10/demo-page.css?v=$N/; s/demo-page\.js?v=10/demo-page.js?v=$N/" animations/04-micro-interactions/card-deck-swipe/index.html
grep -c "demo-page\.css?v=$N\|demo-page\.js?v=$N" animations/04-micro-interactions/card-deck-swipe/index.html
```

Expected: `2`.

- [ ] **Step 3: Write the README: `animations/04-micro-interactions/card-deck-swipe/README.md`**

````markdown
# Card Deck Swipe

[Live demo](https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/card-deck-swipe/)

## What it is
A card deck swipe shows a pile of cards, such as profiles or products, one at a time. The top card follows a drag, turns a little as if held at its bottom edge, and flies off to the left or the right when let go far enough, while the next card grows into its place. The two sides are two answers, such as no and yes, so people decide quickly, one card at a time.

## When to use it
- Matching and dating apps
- Product pickers and "this or that" shopping
- Flashcards: known, or not yet
- Quick polls and preference quizzes

## How it works
The cards are stacked in one box. Each card knows its depth (0 on top), and the waiting cards are moved down and made a little smaller from that number, so the pile peeks out behind the top card:

```css
.card { transform-origin: 50% 130%;  /* a point below the bottom edge */
        transform: translateY(calc(var(--i) * 12px)) scale(calc(1 - var(--i) * .05)); }
```

While it is dragged, the top card's transform follows the pointer and turns in proportion to the distance. Because it turns around a point below its bottom edge, its top swings further than its bottom, as a card held at the bottom would. The stamps grow stronger with the distance:

```js
card.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx / cardWidth * turn}deg)`;
like.style.opacity = Math.min(1, Math.max(0, dx / (threshold * cardWidth)));
```

On release, a card whose middle went past the swipe distance, or that was flicked away from the middle faster than half a pixel per millisecond, gets a transition and is moved off that side; otherwise it springs back with an overshooting curve. The next card's depth becomes 0, so its own transition grows it into place, and the card that left is removed once its transition ends. Undo puts the last card back on top where it left and lets the transition bring it in. Nope, Like and Undo are real buttons, and the Left and Right keys work on the focused top card. Under reduced motion, cards fade instead of flying.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| How far to swipe | Medium | How far the card's middle must go before letting go sends it: short is a quarter of the card's width, medium 40% and long 60%; a quick flick sends it from anywhere |
| How much it turns | A little | How far the card turns for each card width of drag, around a point below its bottom edge: none does not turn, a little turns 14 degrees and a lot 30 degrees |
| Shows stamps | on | Like in green and Nope in red fade in on the card as it is dragged, fully shown at the swipe distance |
| Cards behind | Peeking | How the waiting cards show: peeking sets each one a little lower and 5% smaller, fanned turns them 5 degrees left or right in turn around the same low point, hidden shows only the top card until the next one grows in |

## Production notes
- **Transforms only.** Move, turn and grow the cards with transform and fade them with opacity; never change their left, top or size.
- **Pointer events.** One set of pointerdown, pointermove and pointerup handlers, with pointer capture, serves mouse, pen and touch; `touch-action: pan-y` keeps vertical scrolling on phones, and a `pointercancel` springs the card back.
- **Keep a few cards in the page.** Render the top three to five cards, add more as cards leave, and remove a card once its fly-off ends.
- **Buttons and keys.** Swiping alone shuts out keyboards and some assistive tools: add Nope, Like and Undo buttons and arrow keys, and announce each choice.
- **Libraries.** react-tinder-card and Swiper's cards effect package the idea; in an app, Framer Motion's `drag` with a velocity check in `onDragEnd`, or GSAP's Draggable, builds it.
- **Reduced motion.** Fade the card out instead of throwing it, and let the next one appear without growing.

## See also
- [Swipe to Dismiss](../swipe-to-dismiss/) — one list row slides off with a drag or a flick
- [3D Carousel](../../06-3d-advanced/carousel-3d/) — cards on a ring that turn with a drag and glide on
````

- [ ] **Step 4: The home page preview**

In the worktree's `index.html`: (a) insert these lines, and one empty line after them, right before the line `/* ── bespoke: 05 Text & Typography ── */` (the end of the 04 bespoke block):

```css
.pv-deckswipe{background:#0b0b0d;overflow:hidden;container-type:size}
.pv-deckswipe i{position:absolute;left:36%;top:11%;width:28%;height:76%;border-radius:2.6cqw;background:linear-gradient(#0000 62%,#17171c 62%),linear-gradient(160deg,var(--a),var(--b));box-shadow:0 1.5cqw 4cqw rgba(0,0,0,.5);transform-origin:50% 130%}
.pv-deckswipe i::after{content:"";position:absolute;left:12%;right:34%;bottom:11%;height:3cqh;border-radius:1cqw;background:#5a5a63;box-shadow:0 -5cqh 0 #f4f4f2}
.pv-deckswipe .c3{--a:#5ec7c0;--b:#1f5f8b;transform:translateY(5cqh) scale(.9)}
.pv-deckswipe .c2{--a:#f6c85f;--b:#d1495b;animation:deckswipe-next 4s ease-in-out infinite}
.pv-deckswipe .c1{--a:#ff9a76;--b:#7c4dff;animation:deckswipe-top 4s ease-in-out infinite}
.pv-deckswipe .c1 b{position:absolute;left:10%;top:9%;padding:0 1.4cqw;border:.5cqw solid #34c77b;border-radius:1.2cqw;color:#34c77b;font:800 4cqw/1.3 var(--disp);transform:rotate(-14deg);opacity:0;animation:deckswipe-like 4s ease-in-out infinite}
@keyframes deckswipe-top{0%,10%{transform:none;opacity:1}40%{transform:translateX(14cqw) rotate(6deg);opacity:1}62%{transform:translateX(80cqw) rotate(20deg);opacity:1}63%,88%{transform:none;opacity:0}100%{transform:none;opacity:1}}
@keyframes deckswipe-next{0%,42%{transform:translateY(2.5cqh) scale(.95)}60%,88%{transform:none}100%{transform:translateY(2.5cqh) scale(.95)}}
@keyframes deckswipe-like{0%,12%{opacity:0}40%,62%{opacity:1}63%,100%{opacity:0}}
```

(b) insert this line right after the line that starts with `case 'dynisland':`:

```js
    case 'deckswipe': return '<i class="c3"></i><i class="c2 anim"></i><i class="c1 anim"><b class="anim">LIKE</b></i>';
```

(c) in `const STILL={`, the map's last line ends with `izoom:.02` (the line before `};`): make it end with `izoom:.02,deckswipe:.4` (the middle of its loop is not a clear frame; reduced motion holds the preview there).

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L5 || exit 1
grep -c "pv-deckswipe" index.html; grep -c "case 'deckswipe':" index.html
```

Expected: a number above 1 (the preview's CSS rules), then `1` (its case).

- [ ] **Step 5: Write the generated files, then the tests pass**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L5 || exit 1
node tools/update-sitemap.mjs && node tools/make-skill.mjs
node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)"
```

Expected: `ℹ fail 0` (this plan's run of every lane on a copy of `feat/ten-animations` at `ece2689`, the finder and Famous effects there, gave it: 1717 pass). If only `tests/finder.test.js` fails (its case 9 waits for Task 11 when the finder has changed since), note the failing lines in your report for Task 11 (lanes never change `tests/`) and go on; any other failure names what to fix in this lane's files.

- [ ] **Step 6: Prove the keyboard test for Task 11, then put the test file back**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L5 || exit 1
sed -i "s/'magnetic-button', 'click-ripple'\]/'magnetic-button', 'click-ripple', 'card-deck-swipe']/" tests/pages.test.js
grep -c "'card-deck-swipe'" tests/pages.test.js
node --test tests/pages.test.js 2>&1 | grep -E "keyboard|^ℹ (pass|fail)"
git checkout -- tests/pages.test.js && git status --short tests/
```

Expected: `1` (the entry is in), then `✔ the do-it pages played with the pointer can be played from the keyboard` and `ℹ fail 0`, then nothing (the file is back as it was). If the grep prints `0`, the list's last entry changed since this plan: add `'card-deck-swipe'` in the `'04-micro-interactions'` list of `KEYBOARD_PAGES` by hand, run, and put the file back the same way.

- [ ] **Step 7: The page check and the short screens (each a background command, waited on)**

The coordinator's server for this lane answers on port 8965: `curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8965/` prints `200` (if not, ask the coordinator). The review kit finds pages under its own folder's root, so it runs from a copy in the worktree (`.superpowers/` is ignored by git):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit
cd $REPO/.claude/worktrees/ten-L5 || exit 1
mkdir -p .superpowers/sdd/kit/review-kit $TEN/checks/L5 && cp $KIT/record.mjs $KIT/kit-lib.mjs .superpowers/sdd/kit/review-kit/ && git status --short | grep -c superpowers
```

Expected: `0` (git does not see the copy). Then start these two, each as its own background command (the round number `1`, then `2`, `3` after fixes):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L5 || exit 1
node $RUN/slot.mjs run ten-L5 -- node tools/check-pages.mjs --base http://127.0.0.1:8965 --out $TEN/checks/L5/1 animations/04-micro-interactions/card-deck-swipe home > $TEN/checks/L5/1.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L5/1.log
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L5 || exit 1
node $RUN/slot.mjs run ten-L5 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8965 --short --out $TEN/checks/L5/short-1 animations/04-micro-interactions/card-deck-swipe > $TEN/checks/L5/short-1.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L5/short-1.log
```

Wait on each with `node $RUN/wait-log.mjs $TEN/checks/L5/1.log` and `… short-1.log` (again while it says `still running`), then: `grep -c '^ok' $TEN/checks/L5/1.log; grep '^FAIL' $TEN/checks/L5/1.log; tail -2 $TEN/checks/L5/short-1.log`.

Expected: `12` (six `ok` lines each for `card-deck-swipe`, the home page), no `FAIL` line, and `27 short-screen pictures checked, 0 with labels cut or overlapping, 0 skipped, 0 failed` with `EXIT=0` (this plan's runs gave exactly these). A `FAIL` line or a cut or overlapping label names the problem (the real branch may differ from the copy this plan was checked on; the ledger's first line says how): fix it in this lane's files, keeping the page's behavior, and run both again as round 2, 3; every round after a change ends with all lines `ok`.

- [ ] **Step 8: Every choice in Try it, in both views (acceptance 7), and the motion in clips**

Two background commands. The first runs the kit's gallery (pictures only: Normal, See inside and Compare at 1280 and 375) once with the defaults (`press-0`) and once for each choice that is not a default and each switch in Try it (never Loop, Slow motion, Pause or Play: playback is not a setting), each into its own folder. The second records the clips (Normal, See inside and Compare at 1280, about seven seconds each, frames kept) with the defaults (`clip-0`): the stills never show a run's middle.

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L5 || exit 1
i=0; for sel in "" "#dist-seg [data-t='0.25']" "#dist-seg [data-t='0.6']" "#turn-seg [data-turn='0']" "#turn-seg [data-turn='30']" "#behind-seg [data-behind='fan']" "#behind-seg [data-behind='hide']" "#stamp-tog"; do echo "== press-$i ${sel:-defaults}"; node $RUN/slot.mjs run ten-L5 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8965 --gallery ${sel:+--press "$sel"} --out $TEN/checks/L5/press-$i animations/04-micro-interactions/card-deck-swipe || echo "run $i failed"; i=$((i+1)); done > $TEN/checks/L5/press.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L5/press.log
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L5 || exit 1
i=0; for sel in ""; do echo "== clip-$i ${sel:-defaults}"; node $RUN/slot.mjs run ten-L5 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8965 --only clips --keep-frames ${sel:+--press "$sel"} --out $TEN/checks/L5/clip-$i animations/04-micro-interactions/card-deck-swipe || echo "run $i failed"; i=$((i+1)); done > $TEN/checks/L5/clips.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L5/clips.log
```

Wait on each log with `node $RUN/wait-log.mjs`. Expected: 8 `== press-…` lines, each run ending `done  6 pictures, 0 clips and 0 comparisons made, 0 skipped, 0 failed`, and 1 `== clip-…` line, each ending `done  0 pictures, 3 clips and 0 comparisons made, 0 skipped, 0 failed`; no `failed` line, no `was not found`, `EXIT=0` (the kit's lines as this plan's runs printed them). Read each gallery's See inside and Compare pictures at 1280 beside `press-0`'s: each choice visibly changes Normal and both views. Read three frames from the middle of each See inside and Compare clip (the log's `frames kept in <folder>` lines name the folders): the views move as the spec says, nothing jumps or covers the stage in mid-run (this plan's clips found See inside's small copy filling Pixelate Transition's stage while the blocks were small, a fault no still showed). A choice that changes nothing in a view is a fix (the owner's rule: every setting and control visibly changes the stage and both views). Then remove the frame folders: `grep -o 'frames kept in .*' $TEN/checks/L5/clips.log | sed 's/^frames kept in //' | while read -r f; do rm -rf "$f"; done`.

- [ ] **Step 9: Look at the screenshots and check by hand**

Open `$TEN/checks/L5/<round>/04-card-deck-swipe-{desktop,phone,phone-reduced}-{inside,compare}.png`, the Normal ones and the short screens' pictures: both views read as the spec says, no label covers another or the part it names, nothing overflows at 320. Then, in the served page (a headless run through the pool, or by reading the code where a run cannot show it):

- The top card follows a drag, turns around a point below its bottom edge and shows Like or Nope as it goes; let go past the line or with a flick it flies off that side and the next card grows into place; short of it, it springs back; a vertical swipe still scrolls the page.
- Nope, Undo and Like are 48px round buttons under the pile; Left and Right work on the focused top card, and focus moves to the next top card; an empty pile fills again.
- Show me drags and springs back, throws to the left, then Undo brings the card back (about 3.1 s) and the pile is as it started; in Slow motion each part waits for the one before (the spring-back ends before the throw, Undo waits for the card to fly off); Reset rebuilds the pile.
- How far to swipe, How much it turns, Shows stamps and Cards behind (Peeking, Fanned, Hidden) change Normal and both views; under reduced motion cards fade instead of flying and a short drag jumps back.
- In Compare a card flying off is cut off at its own half's edge and never crosses into the other half (lesson 14; this plan's clips found it crossing before each half clipped its pile).

Decisions already made in this page (keep them; a reviewer weighs them): The box is 400px tall on phones in every mode (`--hb-stage-h-phone`), so the pile and its buttons fit; a card is at most 60% of the box's width. The swipe distance is how far the card's middle must go, as a share of its width (a quarter, 40%, 60%); the turn is 0, 14 or 30 degrees per card width of drag, around a point 30% of the card's height below it. Both views pose the top card: half way to the line in See inside, a third of a card to the right in Compare (always short of the line, so a click never sends it). The helper that finds the top card is `topOf` (a global `top` would clash with `window.top`).

- [ ] **Step 10: Frame times (optional: a page moved by transforms)**

One background command, waited on with `wait-log.mjs`:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L5 || exit 1
(node $RUN/slot.mjs run ten-L5 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8965 --modes normal,inside,compare animations/04-micro-interactions/card-deck-swipe; node $RUN/slot.mjs run ten-L5 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8965 --phone --modes normal,inside,compare animations/04-micro-interactions/card-deck-swipe; node $RUN/slot.mjs run ten-L5 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8965 animations/04-micro-interactions/swipe-to-dismiss; node $RUN/slot.mjs run ten-L5 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8965 --phone animations/04-micro-interactions/swipe-to-dismiss) > $TEN/checks/L5/frames.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L5/frames.log
```

Expected: a median of 16.7 ms in every mode at both sizes, and no larger share of frames slower than 20 ms than Swipe to Dismiss measured the same way, within a few points (the machine's other work moves these numbers; run again when one looks off). This plan's runs: 0% in every mode at both sizes; Swipe to Dismiss 0% at both sizes. Report the numbers; nothing to change unless a mode is clearly worse than the closest page.

- [ ] **Step 11: Commit, and the build report**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L5 || exit 1
[ "$(git rev-parse --abbrev-ref HEAD)" = ten/L5 ] || exit 1
git add -A && git status --short
git commit -m "feat: 04.44 Card Deck Swipe, with See inside and Compare from the start (lane 5)"
git log --oneline -1
```

Expected before the commit: `A  animations/04-micro-interactions/card-deck-swipe/README.md`, `A  animations/04-micro-interactions/card-deck-swipe/index.html`, `M  .github/ISSUE_TEMPLATE/config.yml`, `M  404.html`, `M  README.md`, `M  animations/04-micro-interactions/README.md`, `M  index.html`, `M  llms.txt`, `M  sitemap.xml` and the changed files under `skills/animation-handbook/`; nothing else (the kit's copy is ignored; logs and pictures are in `$TEN`). Then write `$TEN/reports/L5/build.md`: first line `RESULT: built <commit>`, then the line count, the page check's `ok` count and its round, the short screens' last line, the galleries and clips looked at (one line per choice: what changes in each view; one line per clip: what moves), the tests' pass and fail line, the frame times, the hand checks' results, every place the page departs from the spec or this task and why, and any shared-file need (the coordinator appends it to `$RUN/shared-wishes.md`; there should be none). Reply to the coordinator in at most three lines.

- [ ] **Step 12: Review, at most three fix rounds**

The coordinator dispatches a reviewer (strongest model, never the builder) with: the spec's section, this task, the builder's report, `git -C $REPO diff feat/ten-animations...ten/L5`, the newest check round and its screenshots, the short screens, the galleries, the clips and the frame times. The reviewer reads CLAUDE.md, the Global Constraints, `$RUN/lessons.md`, `$RUN/briefs/RULINGS.md`, `$RUN/brief-rulings.md`, `$RUN/briefs/OPEN-QUESTIONS.md` and, once it holds the owner's verdict, `$RUN/rulings-159.md`, and checks the diff against them, the rollout's acceptance list (section 1 of the rollout spec), the spec's section and the per-frame work, looking hard at the pile kept in step in Compare (the copy's card vanishes at once); focus after a keyboard throw; the pivot and labels at 320. It writes `$TEN/reports/L5/review-<k>.md`: first line `RESULT: approved` or `RESULT: changes <count>`, then numbered findings (Critical, Important, Minor), and replies in at most three lines. Each fix round: the builder fixes, runs Steps 5 and 7 again (and the galleries, clips or frame times a fix touches), commits `fix: Card Deck Swipe: <what>` after the branch check, writes `$TEN/reports/L5/fix-<k>.md` (`RESULT: built <commit>`), and the reviewer re-reviews only the fix. After three rounds the coordinator steps in. When approved, the coordinator stops the lane's server and adds the ledger line `<date time>  L5  approved at <commit>; check rounds <k>; frames <numbers>; departures: <none or a list>; reports reports/L5/`.

---

### Task 6: L6 · 06.27 Water Ripple (`ten/L6`, port 8966)

Do it · step 1 "Drag it" · player bar: Show me, Reset and Slow motion (the page slows itself). See inside: the water's height as a gray map beside the bent picture, with the rule in words. Compare: "Rings on top" (light rings over a flat picture) beside "Bends the picture"; both halves take drags and taps. Spec: "6 · Water Ripple (06.27)" in `docs/superpowers/specs/2026-10-13-ten-new-animations-design.md`.

**Files:**
- Create: `animations/06-3d-advanced/water-ripple/index.html` (386 lines), `animations/06-3d-advanced/water-ripple/README.md`
- Modify (by `$TEN/lanes.mjs 6`): `index.html` (the card after Infinite Zoom's, the `PV` key, the `PLACES` row, the `FIND` row (the finder is on the branch), every count 166 → 167), `README.md` (counts, 06's count 26 → 27, the catalog line), `animations/06-3d-advanced/README.md` (its line), `.github/ISSUE_TEMPLATE/config.yml`, `404.html`, `animations/06-3d-advanced/infinite-zoom/index.html` (its first Next link, to Water Ripple)
- Modify (Step 4, by hand): `index.html`: the preview's CSS at the end of the 06 bespoke block, `case 'waterripple':` in `pvMarkup()`
- Regenerate: `sitemap.xml`, `llms.txt`, `skills/animation-handbook/` (their tools)
- Test: `tests/*.test.js` (with a proof edit, put back); the page check of the new page, of Infinite Zoom and of the home page; the review kit's short screens, a gallery for the defaults and for each other choice in Try it, clips of the defaults and of the timing settings' choices; frame times
- Write (run folder): `$TEN/checks/L6/` (logs, screenshots, kit output), `$TEN/reports/L6/build.md`, `fix-<k>.md`; the reviewer `review-<k>.md`

**Interfaces:**
- Consumes: Task 0's worktree `.claude/worktrees/ten-L6` on `ten/L6`, its server on port 8966 (started and stopped by the coordinator), `$TEN/lanes.mjs`, `$TEN/frametimes.mjs`, the shared-file version N in the ledger; Phase 0's shared files, its mode press (the shared script presses Show me after See inside or Compare) and its page check; the rollout's review kit and wait tool.
- Produces: branch `ten/L6`: the card `['water-ripple','Water Ripple','Ripples spread from your finger and bend the picture below. Best for hero images.']` (06.27), `PV` key `'water-ripple':'waterripple'`, `PLACES` `['bg','imgcard']`, `FIND` `'water-ripple':['background card','drag click hover','wave']`; Previous: Infinite Zoom (final), and Infinite Zoom's Next link to Water Ripple; no Next link yet. For Task 11: `'water-ripple'` in the `'06-3d-advanced'` list of `KEYBOARD_PAGES`. The reports in `$TEN/reports/L6/`, which the rollout's final review (part 9) reads too.

- [ ] **Step 1: The lane's shared edits (the failing tests)**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L6 || exit 1
node $TEN/lanes.mjs 6 .
git status --short
node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)" | head -10
```

Expected: `lane 6 shared edits applied to .`; then ` M .github/ISSUE_TEMPLATE/config.yml`, ` M 404.html`, ` M README.md`, ` M animations/06-3d-advanced/README.md`, ` M animations/06-3d-advanced/infinite-zoom/index.html`, ` M index.html`; then these 7 failing tests and `ℹ fail 7`: `✖ make-famous: on the real home page every card builds, but the eight whose previews need a script or animate in SVG`, `✖ the answers keep the rules every page of a kind shares: transitions answer newpage, loops loop, scroll pages scroll`, `✖ 06-3d-advanced/infinite-zoom uses the guided-steps page correctly`, `✖ the Full catalog in the root README lists every card once, in home order, linked to its live page`, `✖ the counts written in the issue template, the 404 page and the sitemap match the cards`, `✖ the skill and llms.txt are what tools/make-skill.mjs writes from the pages and the home page now`, `✖ llms.txt lists every card once, in the order of CATS, with its live address and its description, and links the skill files`. (Famous effects' test builds every card's preview, which Step 4 adds; the finder's reads each page's kind, and Infinite Zoom's new Next link opens a page that is not there yet; this plan's run of every lane on a copy of `feat/ten-animations` at `ece2689`, the finder and Famous effects there, gave exactly these.) If `lanes.mjs` stops with `not found (…)`, stop and tell the coordinator, who alone edits `$TEN/lanes.mjs`; before running it again, put the worktree back with `git checkout -- .` (this step makes no other changes; the tool refuses a second run on a changed tree).

- [ ] **Step 2: Write the page: `animations/06-3d-advanced/water-ripple/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Water Ripple — Animation Handbook</title>
  <meta name="description" content="Ripples spread from your finger and bend the picture below. Best for hero images.">
  <link rel="canonical" href="https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/water-ripple/">
  <link rel="icon" type="image/png" sizes="96x96" href="../../../favicon.png">
  <link rel="icon" type="image/svg+xml" href="../../../favicon.svg">
  <link rel="apple-touch-icon" href="../../../apple-touch-icon.png">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Animation Handbook">
  <meta property="og:title" content="Water Ripple — Animation Handbook">
  <meta property="og:description" content="Ripples spread from your finger and bend the picture below. Best for hero images.">
  <meta property="og:url" content="https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/water-ripple/">
  <meta property="og:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Water Ripple — Animation Handbook">
  <meta name="twitter:description" content="Ripples spread from your finger and bend the picture below. Best for hero images.">
  <meta name="twitter:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <script type="application/ld+json">{"@context": "https://schema.org", "@type": "TechArticle", "headline": "Water Ripple", "name": "Water Ripple", "description": "Ripples spread from your finger and bend the picture below. Best for hero images.", "url": "https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/water-ripple/", "inLanguage": "en", "articleSection": "3D & Advanced", "isPartOf": {"@type": "WebSite", "name": "Animation Handbook", "url": "https://matinmonshizadeh.github.io/animation-handbook/"}, "author": {"@type": "Person", "name": "matinmonshizadeh"}, "keywords": "web animation, CSS animation, 3D & Advanced, Water Ripple"}</script>
  <style>
    :root{--ui-accent:#3fd6c4}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    .stage{position:relative;overflow:hidden;background:#0b3b44}
    /* The water is drawn at the grid's size on small canvases that the browser stretches over the box (or a half of it) */
    .view{position:absolute;display:block;pointer-events:none}
    .view.half,.view.flat,#over,.wr-lbl,.divide{display:none}
    #cvs{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;cursor:crosshair;background:transparent}
    #cvs:focus-visible{outline:2px solid var(--ui-accent);outline-offset:-3px}
    /* The keyboard's spot: a small ring the arrow keys move, shown while the box has keyboard focus */
    .spot{position:absolute;left:0;top:0;width:26px;height:26px;margin:-13px 0 0 -13px;border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 2px rgba(0,0,0,.45);opacity:0;pointer-events:none}
    #cvs:focus-visible~.spot{opacity:1}
    /* Under reduced motion a touch shows still rings that fade */
    .still-rings{position:absolute;width:120px;height:120px;margin:-60px 0 0 -60px;pointer-events:none;transition:opacity .9s linear}
    .stage[data-hb-mode="inside"] .view.whole,.stage[data-hb-mode="compare"] .view.whole{display:none}
    .stage[data-hb-mode="inside"] .view.flat,.stage[data-hb-mode="inside"] #over,.stage[data-hb-mode="compare"] .view.half,.stage[data-hb-mode="compare"] .divide{display:block}
    #over{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
    .divide{position:absolute;left:calc(50% - 1px);top:0;width:2px;height:100%;background:#08262c}
    .wr-lbl{position:absolute;padding:3px 8px;border-radius:6px;background:rgba(6,20,24,.9);color:#f4f4f2;font:600 13px/1.25 var(--hb-font);pointer-events:none;max-width:46%}
    .stage[data-hb-mode="inside"] .in,.stage[data-hb-mode="compare"] .half-name{display:block}
    .in.crest{left:10px;top:10px}.in.patch{right:10px;bottom:104px;text-align:right}.in.read{left:10px;bottom:10px}
    .half-name{top:10px}.half-name.first{left:10px}.half-name.second{left:calc(50% + 10px)}
  </style>
  <link rel="stylesheet" href="../../../assets/css/demo-page.css?v=10">
  <script src="../../../assets/js/demo-page.js?v=10" defer></script>
</head>
<body class="hb" data-hb-kind="do" data-hb-autoplay>
<nav class="hb-bar" aria-label="Animation Handbook">
  <a class="hb-home" href="../../../"><svg class="hb-mark" viewBox="0 0 32 32" aria-hidden="true"><g class="g"><circle cx="11.16" cy="20.84" r="6.1"/><circle cx="15.12" cy="16.88" r="6.1"/><circle cx="18.51" cy="13.49" r="6.1"/></g><circle class="b" cx="21.2" cy="10.8" r="6.6"/></svg><span>Animation Handbook</span></a>
  <span class="hb-pager"><a href="../infinite-zoom/" rel="prev" aria-label="Previous: Infinite Zoom"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg><span><span class="hb-dir">Previous: </span>Infinite Zoom</span></a></span>
  <a class="hb-star" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener" aria-label="Star on GitHub"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg><span>Star on GitHub</span></a>
</nav>
<main class="hb-page">
  <header class="hb-head">
    <p class="hb-cat">06.27 · 3D &amp; Advanced</p>
    <h1>Water Ripple</h1>
    <p class="hb-lede">Ripples spread from your finger and bend the picture below. Best for hero images.</p>
  </header>

  <section class="hb-step hb-watch" aria-labelledby="hb-watch-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">1</span>
      <div><h2 id="hb-watch-title">Drag it</h2><p>Drag across the pond, tap it to drop a pebble, or press Show me.</p></div>
    </div>
    <div class="seg hb-modes" role="group" aria-label="What the box shows" data-hb-modes>
      <button type="button" data-hb-mode="normal" class="on" aria-pressed="true">Normal</button>
      <button type="button" data-hb-mode="inside" aria-pressed="false">See inside</button>
      <button type="button" data-hb-mode="compare" aria-pressed="false">Compare</button>
    </div>
    <div class="stage">
      <canvas id="over" aria-hidden="true"></canvas><i class="divide" aria-hidden="true"></i>
      <canvas id="cvs" role="img" tabindex="0" aria-label="A pond with pebbles, a koi and lily pads under clear water. Drag or tap to make ripples; with the keyboard, the arrow keys move a ring and Enter drops a pebble."></canvas>
      <i class="spot" aria-hidden="true"></i>
      <p class="wr-lbl in crest" aria-hidden="true" data-hb-caption>Light is a crest, dark a trough</p>
      <p class="wr-lbl in patch" aria-hidden="true" data-hb-caption>Each point: its neighbors, minus its last height</p>
      <p class="wr-lbl in read" aria-hidden="true" data-hb-caption>The picture is read from a shifted spot</p>
      <p class="wr-lbl half-name first" aria-hidden="true" data-hb-caption>Rings on top</p>
      <p class="wr-lbl half-name second" aria-hidden="true" data-hb-caption>Bends the picture</p>
    </div>
    <div class="hb-player">
      <button class="hb-play" type="button" id="btn-demo" data-hb-demo><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"/></svg>Show me</button>
      <button class="hb-play" type="button" id="btn-reset" data-hb-reset><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>Reset</button>
      <label class="hb-toggle"><input class="hb-switch" type="checkbox" role="switch" id="slow-tog" data-hb-slowmo autocomplete="off"><span>Slow motion</span></label>
    </div>
    <div class="hb-mode-notes" aria-live="polite">
      <p data-hb-for="inside" hidden>Inside, the gray map is the water's height. Each step, every point becomes its four neighbors' heights minus its own last height, and the picture is read from a spot shifted by the slope.</p>
      <p data-hb-for="compare" hidden>Rings on top draws light rings over a picture that stays flat; Bends the picture shifts the picture itself under the waves, so it looks like water. Drag or tap either half.</p>
    </div>
  </section>

  <section class="hb-step hb-try" aria-labelledby="hb-try-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">2</span>
      <div><h2 id="hb-try-title">Try it</h2><p>Change a setting, then drag the water or press Show me.</p></div>
    </div>
    <div class="hb-settings">
      <div class="hb-setting">
        <p class="hb-setting-name" id="size-lbl">Ripple size</p>
        <div class="seg" id="size-seg" role="group" aria-labelledby="size-lbl">
          <button type="button" data-r="2" aria-pressed="false">Small</button>
          <button type="button" data-r="3.5" class="on" aria-pressed="true">Medium</button>
          <button type="button" data-r="5.5" aria-pressed="false">Large</button>
        </div>
        <p class="hb-hint">How wide each push or drop is.</p>
      </div>
      <div class="hb-setting">
        <p class="hb-setting-name" id="last-lbl">How long ripples last</p>
        <div class="seg" id="last-seg" role="group" aria-labelledby="last-lbl">
          <button type="button" data-damp=".05" aria-pressed="false">Short</button>
          <button type="button" data-damp=".022" class="on" aria-pressed="true">Medium</button>
          <button type="button" data-damp=".009" aria-pressed="false">Long</button>
        </div>
        <p class="hb-hint">Long lets them bounce off the edges and cross.</p>
      </div>
      <div class="hb-setting">
        <p class="hb-setting-name" id="bend-lbl">Bend</p>
        <div class="seg" id="bend-seg" role="group" aria-labelledby="bend-lbl">
          <button type="button" data-bend="5" aria-pressed="false">Subtle</button>
          <button type="button" data-bend="12" class="on" aria-pressed="true">Medium</button>
          <button type="button" data-bend="22" aria-pressed="false">Strong</button>
        </div>
        <p class="hb-hint">How much the picture under the water bends.</p>
      </div>
    </div>
    <details class="hb-options">
      <summary><span class="hb-more-label">More options</span><span class="hb-less">Fewer options</span><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary>
      <div class="hb-settings">
        <div class="hb-setting">
          <label class="hb-switch-row"><span>Light on the waves</span><input class="hb-switch" type="checkbox" role="switch" id="light-tog" checked autocomplete="off"></label>
          <p class="hb-hint">Bright glints on the slopes.</p>
        </div>
      </div>
    </details>
  </section>

  <section class="hb-step hb-prompt-step" aria-labelledby="hb-prompt-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">3</span>
      <div><h2 id="hb-prompt-title">Copy the prompt</h2><p>Paste it into an AI assistant such as ChatGPT, Claude or Cursor to build this in your own project.</p></div>
    </div>
    <div class="hb-card">
      <p class="hb-prompt">Add a water ripple effect to [the picture you want to look as if it lies under water]. Keep two grids of water heights, now and one step earlier. On each step, set every point to half the total of its four neighbors minus its earlier height, then damp it slightly, so ripples spread, cross, bounce off the edges and fade. A drag leaves a trail of small pushes; a tap drops a pebble. Draw the picture shifted at each point by the slope of the water, so it bends under the waves. Use a coarse grid and fixed steps, and stop once the water is calm. If the visitor has reduced motion turned on, show still rings that fade. Match the settings listed below.</p>
      <div class="hb-chips-box" hidden>
        <p class="hb-chips-title">Your settings</p>
        <ul class="hb-chips"></ul>
      </div>
      <div class="hb-copy-row">
        <button class="hb-copy" type="button"><svg class="hb-ic hb-i-copy" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><svg class="hb-ic hb-i-done" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span class="hb-copy-label" aria-live="polite">Copy prompt</span></button>
        <p class="hb-hint">Replace the words in brackets with your own element. Your settings are added at the end.</p>
      </div>
    </div>
    <div class="hb-star-row"><p>Free and open source. If this helped, a star on GitHub helps other people find it.</p><a class="hb-star-btn" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>Star on GitHub</a></div>
  </section>

  <section class="hb-about" aria-labelledby="hb-what-title">
    <div class="hb-what">
      <h2 id="hb-what-title">What it is</h2>
      <div class="hb-what-text"><p>The full explanation is in <a href="README.md">README.md</a>.</p></div>
    </div>
    <div class="hb-fit">
      <h2>Good for</h2>
      <ul class="hb-tags hb-good"><li>Hero pictures</li><li>Pool, spa and travel sites</li><li>Playful backgrounds</li></ul>
      <h3>Avoid on</h3>
      <ul class="hb-tags hb-avoid"><li>Pictures with text</li><li>Busy pages</li></ul>
    </div>
  </section>

  <section class="hb-related" aria-labelledby="hb-related-title" hidden>
    <h2 id="hb-related-title">Similar animations</h2>
    <div class="hb-rel-list"></div>
  </section>
</main>
<footer class="hb-foot"><span>Animation Handbook</span><a href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener">Source on GitHub</a><a href="#top">Back to top ↑</a></footer>
<script>
  const cvs=document.getElementById('cvs'),stage=cvs.parentElement,over=document.getElementById('over'),octx=over.getContext('2d');
  const spot=stage.querySelector('.spot'),slowTog=document.getElementById('slow-tog'),lightTog=document.getElementById('light-tog');
  const reduceMQ=matchMedia('(prefers-reduced-motion: reduce)'),phone=matchMedia('(max-width:600px),(max-height:500px)');
  // CALM: below this height no point of the picture moves by a pixel or changes its light, so the water counts as calm
  const FRAME=1000/60,CALM=.04;
  const LABELS={normal:'A pond with pebbles, a koi and lily pads under clear water. Drag or tap to make ripples; with the keyboard, the arrow keys move a ring and Enter drops a pebble.',
    inside:'The water\'s height as a gray map over a faint pond, a magnified patch of nine points and arrows to the spots the picture is read from. Drag or tap to make ripples.',
    compare:'The same ripples twice: light rings over a flat picture on the left, the picture bending under the water on the right. Drag or tap either half.'};
  let radius=3.5,damp=.022,bend=12,mode='normal',W=0,H=0,raf=0,lastT=null,behind=0,calmSteps=0,running=false;
  let main=null,pair=null,frozen=null,runTimers=[],path=null,down=null,key={x:.5,y:.5};
  // A water surface for a rectangle of the box (in shares of it): two grids of heights, now and one step earlier, about one point
  // per four pixels and at most 200 across (128 on phones, half that for Compare's water), and the views that draw it
  function Water(rect,cols){
    const gw=Math.max(24,cols),gh=Math.max(16,Math.round(gw*rect.h*H/(rect.w*W)));
    return{rect,gw,gh,cur:new Float32Array(gw*gh),prev:new Float32Array(gw*gh),sx:new Float32Array(gw*gh),sy:new Float32Array(gw*gh)};
  }
  // One step: every point becomes half the total of its four neighbors minus its own earlier height, then loses a little
  // (How long ripples last); the edges stay flat, so waves bounce off them. Returns the largest height left.
  function step(w){
    const {gw,gh,cur,prev}=w;let most=0;
    for(let y=1;y<gh-1;y++)for(let x=1,i=y*gw+1;x<gw-1;x++,i++){
      const v=((cur[i-1]+cur[i+1]+cur[i-gw]+cur[i+gw])/2-prev[i])*(1-damp);
      prev[i]=v;const a=v<0?-v:v;if(a>most)most=a;
    }
    w.cur=prev;w.prev=cur;return most;
  }
  // A push of the water at (x, y) in the box's pixels: a round dip, deeper in the middle; a pebble is a bigger, deeper one
  function push(w,x,y,k){
    const gx=(x/W-w.rect.x)/w.rect.w*w.gw,gy=(y/H-w.rect.y)/w.rect.h*w.gh,r=radius*(w.gw/(phone.matches?128:200))*(k>1?1.5:1);
    for(let j=Math.max(1,Math.floor(gy-r));j<=Math.min(w.gh-2,Math.ceil(gy+r));j++)for(let i=Math.max(1,Math.floor(gx-r));i<=Math.min(w.gw-2,Math.ceil(gx+r));i++){
      const d=Math.hypot(i-gx,j-gy)/r;if(d<1)w.cur[j*w.gw+i]-=k*.5*(1+Math.cos(d*Math.PI))}
  }
  // The pond, drawn with canvas commands at a view's size: deep water, a pebble floor, a koi and lily pads with a flower
  function pond(g,w,h){
    const s=Math.min(w/320,h/200),rnd=(n=>()=>{n=(n*16807)%2147483647;return n/2147483647})(42);
    const water=g.createLinearGradient(0,0,0,h);water.addColorStop(0,'#1d6f7a');water.addColorStop(1,'#0b3b44');g.fillStyle=water;g.fillRect(0,0,w,h);
    for(let i=0;i<140;i++){const x=rnd()*w,y=rnd()*h,r=(3+rnd()*8)*s,t=rnd();g.fillStyle=`rgb(${110+t*60|0},${118+t*44|0},${104+t*30|0})`;
      g.beginPath();g.ellipse(x,y,r,r*.7,rnd()*3,0,6.283);g.fill()}
    g.fillStyle='rgba(20,90,100,.35)';g.fillRect(0,0,w,h);
    const kx=w*.55,ky=h*.55;g.save();g.translate(kx,ky);g.rotate(-.35);g.scale(s,s);
    g.fillStyle='#f5f0e6';g.beginPath();g.ellipse(0,0,34,12,0,0,6.283);g.fill();
    g.fillStyle='#ff7a2f';g.beginPath();g.ellipse(-6,-2,16,9,0,0,6.283);g.fill();g.beginPath();g.ellipse(18,1,8,6,0,0,6.283);g.fill();
    g.fillStyle='#f5f0e6';g.beginPath();g.moveTo(-30,0);g.lineTo(-52,-12);g.lineTo(-48,0);g.lineTo(-52,12);g.closePath();g.fill();g.restore();
    for(const [px,py,pr] of [[.18,.3,22],[.8,.22,26],[.86,.72,18],[.28,.78,20]]){const x=px*w,y=py*h,r=pr*s;
      g.fillStyle='#3f8f3a';g.beginPath();g.moveTo(x,y);g.arc(x,y,r,.3,6.1);g.closePath();g.fill();g.strokeStyle='#2b6b2a';g.lineWidth=1.2*s;g.stroke()}
    g.fillStyle='#ff9ec0';for(let i=0;i<6;i++){g.beginPath();g.ellipse(w*.8+Math.cos(i)*5*s,h*.22+Math.sin(i)*5*s,6*s,3*s,i,0,6.283);g.fill()}
    g.fillStyle='#ffe38a';g.beginPath();g.arc(w*.8,h*.22,3*s,0,6.283);g.fill();
  }
  // A view: a small canvas for one water, twice the grid's size each way (R), stretched over its rectangle; it keeps the pond's
  // pixels and three lighter copies of them for the light on the waves
  const R=2;
  function View(w,cls){
    const c=document.createElement('canvas'),g=c.getContext('2d'),rw=w.gw*R,rh=w.gh*R;c.width=rw;c.height=rh;c.className='view '+cls;c.setAttribute('aria-hidden','true');
    Object.assign(c.style,{left:w.rect.x*100+'%',top:w.rect.y*100+'%',width:w.rect.w*100+'%',height:w.rect.h*100+'%'});
    stage.prepend(c);pond(g,rw,rh);
    const img=g.getImageData(0,0,rw,rh),base=new Uint32Array(img.data.buffer.slice(0)),lit=[base];
    for(const k of [.12,.24,.4]){const d=new Uint8ClampedArray(img.data),a=new Uint32Array(d.buffer);for(let i=0;i<d.length;i+=4){d[i]+=(255-d[i])*k;d[i+1]+=(255-d[i+1])*k;d[i+2]+=(255-d[i+2])*k}lit.push(a)}
    return{c,g,img,px:new Uint32Array(img.data.buffer),lit};
  }
  // Draws a water in a view: each point shows the pond read from a spot shifted by the slope there (bend), lit where the slope
  // faces the light; rings: the pond stays where it is and only the light shows (Compare's first half)
  function paint(w,v,rings){
    const {gw,gh,cur,sx,sy}=w,{px,lit}=v,rw=gw*R,rh=gh*R,b=bend*R*gw/(phone.matches?128:200),light=lightTog.checked||rings;
    for(let y=0,i=0;y<gh;y++)for(let x=0;x<gw;x++,i++){sx[i]=x>0&&x<gw-1?cur[i+1]-cur[i-1]:0;sy[i]=y>0&&y<gh-1?cur[i+gw]-cur[i-gw]:0}
    for(let Y=0,o=0;Y<rh;Y++)for(let X=0;X<rw;X++,o++){
      const i=(Y/R|0)*gw+(X/R|0),dx=sx[i],dy=sy[i];
      let qx=X,qy=Y;if(!rings&&(dx||dy)){qx=Math.min(rw-1,Math.max(0,X+Math.round(dx*b)));qy=Math.min(rh-1,Math.max(0,Y+Math.round(dy*b)))}
      const l=light?Math.min(3,Math.max(0,Math.round(rings?(Math.abs(dx)+Math.abs(dy))*7:-(dx+dy)*6))):0;
      px[o]=lit[l][qy*rw+qx];
    }
    v.g.putImageData(v.img,0,0);
  }
  // See inside: the heights in grays over a faint pond (light a crest, dark a trough), a magnified patch of nine points around the
  // steepest spot, and on a coarse grid small arrows from each point to the spot its picture is read from
  function paintInside(w,v){
    const {gw,gh,cur}=w,{px,lit}=v,u=new Uint8ClampedArray(px.buffer),rw=gw*R,rh=gh*R;
    for(let Y=0,o=0;Y<rh;Y++){const row=(Y/R|0)*gw;for(let X=0;X<rw;X++,o++){
      const g=Math.max(0,Math.min(255,128+cur[row+(X/R|0)]*230))*.7,q=o*4,s=lit[0][o];
      u[q]=(s&255)*.3+g;u[q+1]=(s>>8&255)*.3+g;u[q+2]=(s>>16&255)*.3+g;u[q+3]=255}}
    v.g.putImageData(v.img,0,0);
    octx.clearRect(0,0,W,H);
    const step=phone.matches?34:28,cx=W/gw,cy=H/gh,b=bend*gw/(phone.matches?128:200);
    octx.strokeStyle='#ffce5a';octx.fillStyle='#ffce5a';octx.lineWidth=1.6;octx.beginPath();
    for(let y=step/2;y<H-90;y+=step)for(let x=step/2;x<W;x+=step){
      const i=Math.min(gh-2,Math.max(1,y/cy|0))*gw+Math.min(gw-2,Math.max(1,x/cx|0)),dx=(cur[i+1]-cur[i-1])*b*cx*2,dy=(cur[i+gw]-cur[i-gw])*b*cy*2;
      if(Math.hypot(dx,dy)<1.5){octx.moveTo(x+1,y);octx.arc(x,y,1,0,6.283);continue}
      octx.moveTo(x,y);octx.lineTo(x+dx,y+dy)}
    octx.stroke();
    let best=gw+1,top=0;for(let i=gw+1;i<gw*(gh-1)-1;i++){const s=Math.abs(cur[i+1]-cur[i-1])+Math.abs(cur[i+gw]-cur[i-gw]);if(s>top){top=s;best=i}}
    const bx=best%gw,by=best/gw|0,size=phone.matches?18:22,ox=W-10-size*3,oy=H-10-size*3;
    for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const g=Math.max(0,Math.min(255,128+cur[best+j*gw+i]*230))|0;octx.fillStyle=`rgb(${g},${g},${g})`;octx.fillRect(ox+(i+1)*size+1,oy+(j+1)*size+1,size-2,size-2)}
    octx.strokeStyle='#ffce5a';octx.lineWidth=2;octx.strokeRect(ox+size+1,oy+size+1,size-2,size-2);
    octx.setLineDash([4,4]);octx.beginPath();octx.moveTo(ox,oy+size*1.5);octx.lineTo(bx*cx,by*cy);octx.stroke();octx.setLineDash([]);
  }
  function draw(){
    if(!main)return;
    const at=w=>calmNow(w)&&frozen?frozen[w===main?0:1]:w;
    if(mode==='inside')paintInside(at(main),main.views[1]);
    else if(mode==='compare'){const w=at(pair);paint(w,pair.views[0],true);paint(w,pair.views[1],false)}
    else paint(main,main.views[0],false);
  }
  const calmNow=w=>!running&&w.still;
  // The loop takes fixed steps of a 60th of a second (a third as many in slow motion, at most three a frame) and stops once the
  // water is calm for a third of a second: then the plain picture (or See inside's and Compare's frozen ripple) is drawn
  function loop(ts){
    if(reduceMQ.matches){calm();return} // reduced motion turned on while the water moves: it goes flat at once
    raf=requestAnimationFrame(loop);
    if(lastT===null){lastT=ts;return}
    const dt=Math.min(ts-lastT,50)*(slowTog.checked?1/3:1);lastT=ts;behind+=dt;
    const w=mode==='compare'?pair:main;
    if(path)trace(dt);
    let n=0,most=1;while(behind>=FRAME-1&&n<3){most=step(w);behind-=FRAME;n++}
    if(n){calmSteps=most<CALM?calmSteps+n:0;w.still=false}
    if(calmSteps>20&&!path){w.cur.fill(0);w.prev.fill(0);w.still=true;running=false;cancelAnimationFrame(raf);raf=0}
    if(n||path)draw();
  }
  function wake(){if(reduceMQ.matches)return;running=true;calmSteps=0;(mode==='compare'?pair:main).still=false;if(!raf){lastT=null;behind=0;raf=requestAnimationFrame(loop)}}
  function calm(){for(const w of [main,pair]){w.cur.fill(0);w.prev.fill(0);w.still=true}running=false;cancelAnimationFrame(raf);raf=0;draw()}
  // A touch on the water: in Compare a touch on either half reaches the one water both halves draw
  let ringAt=-1e9;
  function touchAt(x,y,k){
    if(reduceMQ.matches){const now=performance.now();if(k>.9||now-ringAt>300){ringAt=now;stillRings(x,y)}return}
    const w=mode==='compare'?pair:main;if(mode==='compare'&&x>W/2)x-=W/2;
    push(w,x,y,k);wake();
  }
  // Under reduced motion: still rings at the spot, which fade within a second (a few per touch at most)
  function stillRings(x,y){
    const r=document.createElementNS('http://www.w3.org/2000/svg','svg');r.setAttribute('viewBox','-60 -60 120 120');r.setAttribute('class','still-rings');r.setAttribute('aria-hidden','true');
    r.innerHTML=[18,34,50].map((c,i)=>`<circle r="${c}" fill="none" stroke="rgba(255,255,255,${.8-i*.2})" stroke-width="2"/>`).join('');
    r.style.left=x+'px';r.style.top=y+'px';stage.insertBefore(r,spot);
    setTimeout(()=>{r.style.opacity='0';setTimeout(()=>r.remove(),950)},60);
  }
  // Pointer Events for mouse, pen and touch: a drag leaves a trail of small pushes, a short tap drops a pebble; a mouse that only
  // points leaves a faint wake
  const local=e=>{const r=cvs.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
  cvs.addEventListener('pointerdown',e=>{if(e.button)return;const p=local(e);down={...p,t:e.timeStamp,moved:0};cvs.setPointerCapture(e.pointerId)});
  cvs.addEventListener('pointermove',e=>{const p=local(e);
    if(down){down.moved+=Math.hypot(p.x-down.x,p.y-down.y);down.x=p.x;down.y=p.y;touchAt(p.x,p.y,.35)}
    else if(e.pointerType==='mouse'&&!reduceMQ.matches)touchAt(p.x,p.y,.12)});
  cvs.addEventListener('pointerup',e=>{if(down&&down.moved<8&&e.timeStamp-down.t<400)touchAt(down.x,down.y,1);down=null});
  cvs.addEventListener('pointercancel',()=>{down=null});
  // The keyboard: the arrow keys move the ring, leaving a wake (Shift for bigger moves); Enter or Space drops a pebble there
  cvs.addEventListener('keydown',e=>{
    const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];
    if(d){e.preventDefault();const k=e.shiftKey?.12:.04;key.x=Math.min(.97,Math.max(.03,key.x+d[0]*k));key.y=Math.min(.95,Math.max(.05,key.y+d[1]*k));placeSpot();touchAt(key.x*W,key.y*H,.35)}
    else if(e.key==='Enter'||e.key===' '){e.preventDefault();touchAt(key.x*W,key.y*H,1)}
  });
  const placeSpot=()=>{spot.style.transform=`translate(${key.x*W}px,${key.y*H}px)`};
  // Show me: a finger draws an S across the pond, then two taps (3 s in all); the water then calms by itself. The S moves by the
  // time that passed; the taps wait with timers, as every pause of a run does.
  function later(fn,ms){const id=setTimeout(()=>{runTimers=runTimers.filter(t=>t!==id);fn()},ms*(slowTog.checked?3:1));runTimers.push(id)}
  function stopRun(){runTimers.forEach(clearTimeout);runTimers=[];path=null}
  function trace(dt){
    path.t+=dt/1800;const t=Math.min(1,path.t),x=W*(.2+.6*t),y=H*(.5+.28*Math.sin(t*Math.PI*2));
    touchAt(x,y,.35*dt/FRAME);if(t>=1)path=null;
  }
  document.getElementById('btn-demo').addEventListener('click',()=>{
    stopRun();
    if(reduceMQ.matches){touchAt(W*.32,H*.45,1);later(()=>touchAt(W*.68,H*.58,1),800);return}
    path={t:0};wake();
    later(()=>touchAt(W*.3,H*.32,1),2000);later(()=>touchAt(W*.72,H*.68,1),2500);
  });
  document.getElementById('btn-reset').addEventListener('click',()=>{stopRun();calm()});
  document.addEventListener('hb:input',()=>{if(runTimers.length||path)stopRun()});
  stage.addEventListener('focusin',e=>{if(e.isTrusted&&(runTimers.length||path))stopRun()});
  // The mode switch draws the mode at once; See inside and Compare show a frozen ripple while the water is calm
  // Normal and See inside show one water, Compare another: each keeps moving where it was left, so the water a mode shows wakes
  // if it was still moving when the loop stopped for the other
  document.addEventListener('hb:mode',e=>{
    mode=e.detail.mode;cvs.setAttribute('aria-label',LABELS[mode]);if(mode!=='inside')octx.clearRect(0,0,W,H);draw();
    const w=mode==='compare'?pair:main;if(!w.still&&!reduceMQ.matches)wake();
  });
  // A frozen ripple for See inside and Compare at rest: two pebbles from a fixed start, a fixed number of steps on
  function freeze(){
    frozen=[main,pair].map(w=>{const f={...w,cur:new Float32Array(w.cur.length),prev:new Float32Array(w.cur.length)};
      push(f,W*(w===main?.36:.18),H*.45,1.4);push(f,W*(w===main?.66:.34),H*.6,1.1);for(let i=0;i<26;i++)step(f);return f});
  }
  function build(){
    stage.querySelectorAll('.view').forEach(c=>c.remove());
    const cols=Math.min(phone.matches?128:200,Math.round(W/4)),half=Math.round(cols/2);
    main=Water({x:0,y:0,w:1,h:1},cols);main.views=[View(main,'whole'),View(main,'flat')];main.still=true;
    pair=Water({x:0,y:0,w:.5,h:1},half);pair.views=[View(pair,'half'),View({...pair,rect:{x:.5,y:0,w:.5,h:1}},'half')];pair.still=true;
    freeze();
  }
  function resize(){
    const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h||(w===W&&h===H))return;W=w;H=h;
    const dpr=Math.min(devicePixelRatio||1,1.5);over.width=W*dpr;over.height=H*dpr;octx.setTransform(dpr,0,0,dpr,0,0);
    stopRun();running=false;cancelAnimationFrame(raf);raf=0;build();placeSpot();draw();
  }
  function choices(id,pick){
    const buttons=document.querySelectorAll('#'+id+' button');
    buttons.forEach(b=>b.addEventListener('click',()=>{
      buttons.forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',String(x===b))});
      pick(b.dataset);if(main){freeze();draw()}
    }));
  }
  choices('size-seg',d=>{radius=+d.r});
  choices('last-seg',d=>{damp=+d.damp});
  choices('bend-seg',d=>{bend=+d.bend});
  lightTog.addEventListener('change',draw);
  // Under reduced motion the water never moves: the notes say what the still views show
  if(reduceMQ.matches){
    document.querySelector('[data-hb-for="inside"]').textContent='Shown still: the gray map is the water\'s height, each point set from its four neighbors minus its own last height, and the arrows show where the picture is read from.';
    document.querySelector('[data-hb-for="compare"]').textContent='Shown still: Rings on top draws light rings over a flat picture, while Bends the picture shifts the picture itself under the waves, so it looks like water.';
  }
  new ResizeObserver(resize).observe(stage);
  resize();
</script>
</body>
</html>
```

Then give it the shared-file version the branch uses (the ledger's N; nothing changes when N is 10):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L6 || exit 1
N=$(grep -o 'shared files ?v=[0-9]*' $TEN/ledger.md | head -1 | grep -o '[0-9]*$')
sed -i "s/demo-page\.css?v=10/demo-page.css?v=$N/; s/demo-page\.js?v=10/demo-page.js?v=$N/" animations/06-3d-advanced/water-ripple/index.html
grep -c "demo-page\.css?v=$N\|demo-page\.js?v=$N" animations/06-3d-advanced/water-ripple/index.html
```

Expected: `2`.

- [ ] **Step 3: Write the README: `animations/06-3d-advanced/water-ripple/README.md`**

````markdown
# Water Ripple

[Live demo](https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/water-ripple/)

## What it is
A water ripple effect makes a picture look as if it lies under clear water: a drag leaves a wake, a tap drops a pebble, and the ripples spread, cross, bounce off the edges and fade, bending the picture beneath them as they pass. It is a real little wave simulation, not rings drawn by formula, which is why two ripples cross and add up the way water does.

## When to use it
- Hero pictures on pool, spa, travel and seaside sites
- Playful backgrounds that invite people to touch them
- Landing pages for games or kids' products
- Photography sites, as a calm hover effect on one featured picture

## How it works
The water is two grids of heights, about one point per four pixels of the box (at most 200 across, 128 on phones): the heights now and one step earlier. At 60 fixed steps a second, every point becomes half the total of its four neighbors minus its own earlier height, then loses a little, so ripples spread outward, cross and fade; the edges stay flat, so waves bounce off them. The new heights are written over the earlier grid, and the two swap:

```js
for (let y = 1; y < gh - 1; y++) for (let x = 1, i = y * gw + 1; x < gw - 1; x++, i++)
  prev[i] = ((cur[i - 1] + cur[i + 1] + cur[i - gw] + cur[i + gw]) / 2 - prev[i]) * (1 - damp);
[cur, prev] = [prev, cur];
```

A touch pushes a small round dip into the grid (a pebble a bigger, deeper one). To draw the water, each point shows the picture read from a spot shifted by the slope there, so the picture bends under every wave; slopes that face the light get a lighter copy of the picture, which makes the glints:

```js
const dx = cur[i + 1] - cur[i - 1], dy = cur[i + gw] - cur[i - gw];
const sx = clamp(x + Math.round(dx * bend)), sy = clamp(y + Math.round(dy * bend));
pixels[i] = lighter[light(dx, dy)][sy * gw + sx];
```

The pond is drawn once with canvas commands at the grid's size, so its pixels can be read, and three lighter copies of it are made for the glints. The result is written into a small canvas of one pixel per point that the browser stretches over the box. The steps come from an accumulator (at most three a frame, a third as many in slow motion), so the waves move at the same speed on every screen; once the water has stayed calm for a third of a second the loop stops and the plain picture is drawn, so the box is exactly at rest. Under reduced motion nothing moves: a tap or a drag shows still rings that fade within a second.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Ripple size | Medium | How wide each push is, in grid points: small is 2, medium 3.5 and large 5.5 (a pebble half as wide again) |
| How long ripples last | Medium | How much height the water loses each step: short is 5%, which fades a pebble's rings within a second; medium 2.2%, about three seconds; long 0.9%, long enough for rings to bounce off the edges and cross |
| Bend | Medium | How far the picture under a slope is shifted: subtle is 5 grid points for a full slope, medium 12 and strong 22 |
| Light on the waves | on | Slopes that face the light show a lighter picture, in three steps of brightness; off, only the bending shows |

## Production notes
- **A coarse grid is enough.** The ripples are smooth, so a grid of one point per three to four pixels, drawn on a small canvas stretched over the box, looks as good as one point per pixel at a tenth of the cost. Use typed arrays and swap the two grids instead of copying them.
- **Fixed steps, then stop.** The wave rule needs equal steps: take them from an accumulator at a fixed rate, and stop the loop when the largest height is tiny, so a calm picture costs nothing.
- **Read the pixels once.** Draw the picture into the small canvas once and keep its pixels (`getImageData`); a picture from another site needs CORS headers, or the canvas cannot be read.
- **WebGL for full screen.** For a full-screen hero on a large display, the same two-grid rule runs in a fragment shader on ping-pong textures (as in the jQuery Ripples plugin or a Three.js render target), and the bending is a second shader that offsets the texture lookup.
- **Touch and keyboard.** Use Pointer Events with `touch-action: none` on the water so a drag does not scroll the page, and let the keyboard move a ring and drop a pebble.
- **Reduced motion.** Do not run the waves; a still ring that fades shows where the touch landed.

## See also
- [Cloth / Soft-Body Simulation](../cloth-simulation/) — fixed steps and a drag move a cloth
- [Image Distortion on Hover](../image-distortion-hover/) — rings worked out by formula warp a picture near the pointer
- [Ambient Ripple Effect](../../07-ambient-background/ambient-ripple/) — rings spread on their own, with no water
````

- [ ] **Step 4: The home page preview**

In the worktree's `index.html`: (a) insert these lines, and one empty line after them, right before the line `/* ── bespoke: 07 Ambient & Background ── */` (the end of the 06 bespoke block):

```css
.pv-waterripple{background:radial-gradient(4% 6% at 14% 22%,#9a9585 60%,#0000 64%),radial-gradient(5% 7.5% at 30% 70%,#9a9585 60%,#0000 64%),radial-gradient(3.5% 5.25% at 52% 30%,#9a9585 60%,#0000 64%),radial-gradient(5% 7.5% at 70% 64%,#9a9585 60%,#0000 64%),radial-gradient(4% 6% at 86% 26%,#9a9585 60%,#0000 64%),radial-gradient(3.5% 5.25% at 62% 86%,#9a9585 60%,#0000 64%),radial-gradient(4.5% 6.75% at 20% 88%,#9a9585 60%,#0000 64%),radial-gradient(3% 4.5% at 44% 56%,#9a9585 60%,#0000 64%),radial-gradient(4% 6% at 92% 80%,#9a9585 60%,#0000 64%),linear-gradient(#1d6f7a,#0b3b44);overflow:hidden}
.pv-waterripple i{position:absolute;width:60%;aspect-ratio:1;border-radius:50%;border:1.5px solid rgba(240,255,255,.8);opacity:0;transform:translate(-50%,-50%) scale(.05);
  animation:waterripple-ring 3s ease-out infinite}
.pv-waterripple .a{left:36%;top:46%}.pv-waterripple .b{left:64%;top:58%;animation-delay:-1.5s}.pv-waterripple .r2{animation-delay:-.6s}.pv-waterripple .b.r2{animation-delay:-2.1s}
@keyframes waterripple-ring{0%{opacity:.9;transform:translate(-50%,-50%) scale(.05)}100%{opacity:0;transform:translate(-50%,-50%) scale(1)}}
```

(b) insert this line right after the line that starts with `case 'izoom':`:

```js
    case 'waterripple': return '<i class="a anim"></i><i class="a r2 anim"></i><i class="b anim"></i><i class="b r2 anim"></i>';
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L6 || exit 1
grep -c "pv-waterripple" index.html; grep -c "case 'waterripple':" index.html
```

Expected: a number above 1 (the preview's CSS rules), then `1` (its case).

- [ ] **Step 5: Write the generated files, then the tests pass**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L6 || exit 1
node tools/update-sitemap.mjs && node tools/make-skill.mjs
node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)"
```

Expected: `ℹ fail 0` (this plan's run of every lane on a copy of `feat/ten-animations` at `ece2689`, the finder and Famous effects there, gave it: 1717 pass). If only `tests/finder.test.js` fails (its case 9 waits for Task 11 when the finder has changed since), note the failing lines in your report for Task 11 (lanes never change `tests/`) and go on; any other failure names what to fix in this lane's files.

- [ ] **Step 6: Prove the keyboard test for Task 11, then put the test file back**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L6 || exit 1
sed -i "s/'image-distortion-hover', 'parallax-3d-tilt'\]/'image-distortion-hover', 'parallax-3d-tilt', 'water-ripple']/" tests/pages.test.js
grep -c "'water-ripple'" tests/pages.test.js
node --test tests/pages.test.js 2>&1 | grep -E "keyboard|^ℹ (pass|fail)"
git checkout -- tests/pages.test.js && git status --short tests/
```

Expected: `1` (the entry is in), then `✔ the do-it pages played with the pointer can be played from the keyboard` and `ℹ fail 0`, then nothing (the file is back as it was). If the grep prints `0`, the list's last entry changed since this plan: add `'water-ripple'` in the `'06-3d-advanced'` list of `KEYBOARD_PAGES` by hand, run, and put the file back the same way.

- [ ] **Step 7: The page check and the short screens (each a background command, waited on)**

The coordinator's server for this lane answers on port 8966: `curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8966/` prints `200` (if not, ask the coordinator). The review kit finds pages under its own folder's root, so it runs from a copy in the worktree (`.superpowers/` is ignored by git):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit
cd $REPO/.claude/worktrees/ten-L6 || exit 1
mkdir -p .superpowers/sdd/kit/review-kit $TEN/checks/L6 && cp $KIT/record.mjs $KIT/kit-lib.mjs .superpowers/sdd/kit/review-kit/ && git status --short | grep -c superpowers
```

Expected: `0` (git does not see the copy). Then start these two, each as its own background command (the round number `1`, then `2`, `3` after fixes):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L6 || exit 1
node $RUN/slot.mjs run ten-L6 -- node tools/check-pages.mjs --base http://127.0.0.1:8966 --out $TEN/checks/L6/1 animations/06-3d-advanced/water-ripple animations/06-3d-advanced/infinite-zoom home > $TEN/checks/L6/1.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L6/1.log
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L6 || exit 1
node $RUN/slot.mjs run ten-L6 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8966 --short --out $TEN/checks/L6/short-1 animations/06-3d-advanced/water-ripple > $TEN/checks/L6/short-1.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L6/short-1.log
```

Wait on each with `node $RUN/wait-log.mjs $TEN/checks/L6/1.log` and `… short-1.log` (again while it says `still running`), then: `grep -c '^ok' $TEN/checks/L6/1.log; grep '^FAIL' $TEN/checks/L6/1.log; tail -2 $TEN/checks/L6/short-1.log`.

Expected: `18` (six `ok` lines each for `water-ripple`, `infinite-zoom`, the home page), no `FAIL` line, and `27 short-screen pictures checked, 0 with labels cut or overlapping, 0 skipped, 0 failed` with `EXIT=0` (this plan's runs gave exactly these). A `FAIL` line or a cut or overlapping label names the problem (the real branch may differ from the copy this plan was checked on; the ledger's first line says how): fix it in this lane's files, keeping the page's behavior, and run both again as round 2, 3; every round after a change ends with all lines `ok`.

- [ ] **Step 8: Every choice in Try it, in both views (acceptance 7), and the motion in clips**

Two background commands. The first runs the kit's gallery (pictures only: Normal, See inside and Compare at 1280 and 375) once with the defaults (`press-0`) and once for each choice that is not a default and each switch in Try it (never Loop, Slow motion, Pause or Play: playback is not a setting), each into its own folder. The second records the clips (Normal, See inside and Compare at 1280, about seven seconds each, frames kept) with the defaults (`clip-0`) and for each choice of the settings that change only timing or show only while the demo moves (G1, G11): the stills never show a run's middle.

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L6 || exit 1
i=0; for sel in "" "#size-seg [data-r='2']" "#size-seg [data-r='5.5']" "#last-seg [data-damp='.05']" "#last-seg [data-damp='.009']" "#bend-seg [data-bend='5']" "#bend-seg [data-bend='22']" "#light-tog"; do echo "== press-$i ${sel:-defaults}"; node $RUN/slot.mjs run ten-L6 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8966 --gallery ${sel:+--press "$sel"} --out $TEN/checks/L6/press-$i animations/06-3d-advanced/water-ripple || echo "run $i failed"; i=$((i+1)); done > $TEN/checks/L6/press.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L6/press.log
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L6 || exit 1
i=0; for sel in "" "#last-seg [data-damp='.05']" "#last-seg [data-damp='.009']"; do echo "== clip-$i ${sel:-defaults}"; node $RUN/slot.mjs run ten-L6 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8966 --only clips --keep-frames ${sel:+--press "$sel"} --out $TEN/checks/L6/clip-$i animations/06-3d-advanced/water-ripple || echo "run $i failed"; i=$((i+1)); done > $TEN/checks/L6/clips.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L6/clips.log
```

Wait on each log with `node $RUN/wait-log.mjs`. Expected: 8 `== press-…` lines, each run ending `done  6 pictures, 0 clips and 0 comparisons made, 0 skipped, 0 failed`, and 3 `== clip-…` lines, each ending `done  0 pictures, 3 clips and 0 comparisons made, 0 skipped, 0 failed`; no `failed` line, no `was not found`, `EXIT=0` (the kit's lines as this plan's runs printed them). Read each gallery's See inside and Compare pictures at 1280 beside `press-0`'s: each choice visibly changes Normal and both views. Read three frames from the middle of each See inside and Compare clip (the log's `frames kept in <folder>` lines name the folders; for a timing choice, the same frames beside `clip-0`'s): the views move as the spec says, nothing jumps or covers the stage in mid-run (this plan's clips found See inside's small copy filling Pixelate Transition's stage while the blocks were small, a fault no still showed). A choice that changes nothing in a view is a fix (the owner's rule: every setting and control visibly changes the stage and both views). Then remove the frame folders: `grep -o 'frames kept in .*' $TEN/checks/L6/clips.log | sed 's/^frames kept in //' | while read -r f; do rm -rf "$f"; done`.

- [ ] **Step 9: Look at the screenshots and check by hand**

Open `$TEN/checks/L6/<round>/06-water-ripple-{desktop,phone,phone-reduced}-{inside,compare}.png`, the Normal ones and the short screens' pictures: both views read as the spec says, no label covers another or the part it names, nothing overflows at 320. Then, in the served page (a headless run through the pool, or by reading the code where a run cannot show it):

- A drag leaves a wake, a tap drops a pebble, a hovering mouse leaves a faint wake; ripples cross, bounce off the edges and fade; the box takes focus, the arrow keys move a ring and Enter or Space drops a pebble there.
- Show me draws an S and taps (about 3 s); with the default settings the water is calm again and the plain picture redrawn within about 5 s of the run's end.
- Ripple size, How long ripples last, Bend and Light on the waves change the water in Normal and both views; Reset makes the water flat at once; back in Normal after Compare (and the other way) the water goes on and calms, never frozen mid-wave (RULINGS 7).
- The step numbers, chips and pressed buttons use 06's accent, `#3fd6c4` (every 06 page's), not the home page's green dot.
- Under reduced motion nothing moves: a tap or a drag shows still rings that fade within a second; turning reduced motion on while ripples run flattens the water at once.

Decisions already made in this page (keep them; a reviewer weighs them): The grid follows the box's shape: one point per four pixels, at most 200 across (128 on phones), instead of a fixed size; the views are drawn at twice the grid. The water counts as calm below 0.04 of a ripple's height; then the loop stops and the plain picture is drawn, so the box is exactly at rest. A hovering mouse leaves a faint wake (not in the spec): it shows the water is there before a press.

- [ ] **Step 10: Frame times (required: a canvas or mask page)**

One background command, waited on with `wait-log.mjs`:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L6 || exit 1
(node $RUN/slot.mjs run ten-L6 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8966 --modes normal,inside,compare animations/06-3d-advanced/water-ripple; node $RUN/slot.mjs run ten-L6 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8966 --phone --modes normal,inside,compare animations/06-3d-advanced/water-ripple; node $RUN/slot.mjs run ten-L6 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8966 animations/06-3d-advanced/cloth-simulation; node $RUN/slot.mjs run ten-L6 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8966 --phone animations/06-3d-advanced/cloth-simulation) > $TEN/checks/L6/frames.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L6/frames.log
```

Expected: a median of 16.7 ms in every mode at both sizes (See inside on a desktop may reach a 33 ms median when the machine is busy, as Cloth / Soft-Body Simulation does in Normal), and no larger share of frames slower than 20 ms than Cloth / Soft-Body Simulation measured the same way, within a few points (the machine's other work moves these numbers; run again when one looks off). This plan's runs: desktop 9 to 12 / 20 to 57 / 0 to 2%, phone 0 / 0 / 0%; Cloth / Soft-Body Simulation 83 to 87% on a desktop (median 33.4 ms) and 37% on a phone. A page that misses lightens its per-frame work (a smaller grid, fewer dots, less drawn per frame) until it meets this, and says what it changed.

- [ ] **Step 11: Commit, and the build report**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L6 || exit 1
[ "$(git rev-parse --abbrev-ref HEAD)" = ten/L6 ] || exit 1
git add -A && git status --short
git commit -m "feat: 06.27 Water Ripple, with See inside and Compare from the start (lane 6)"
git log --oneline -1
```

Expected before the commit: `A  animations/06-3d-advanced/water-ripple/README.md`, `A  animations/06-3d-advanced/water-ripple/index.html`, `M  .github/ISSUE_TEMPLATE/config.yml`, `M  404.html`, `M  README.md`, `M  animations/06-3d-advanced/README.md`, `M  animations/06-3d-advanced/infinite-zoom/index.html`, `M  index.html`, `M  llms.txt`, `M  sitemap.xml` and the changed files under `skills/animation-handbook/`; nothing else (the kit's copy is ignored; logs and pictures are in `$TEN`). Then write `$TEN/reports/L6/build.md`: first line `RESULT: built <commit>`, then the line count, the page check's `ok` count and its round, the short screens' last line, the galleries and clips looked at (one line per choice: what changes in each view; one line per clip: what moves), the tests' pass and fail line, the frame times, the hand checks' results, every place the page departs from the spec or this task and why, and any shared-file need (the coordinator appends it to `$RUN/shared-wishes.md`; there should be none). Reply to the coordinator in at most three lines.

- [ ] **Step 12: Review, at most three fix rounds**

The coordinator dispatches a reviewer (strongest model, never the builder) with: the spec's section, this task, the builder's report, `git -C $REPO diff feat/ten-animations...ten/L6`, the newest check round and its screenshots, the short screens, the galleries, the clips and the frame times. The reviewer reads CLAUDE.md, the Global Constraints, `$RUN/lessons.md`, `$RUN/briefs/RULINGS.md`, `$RUN/brief-rulings.md`, `$RUN/briefs/OPEN-QUESTIONS.md` and, once it holds the owner's verdict, `$RUN/rulings-159.md`, and checks the diff against them, the rollout's acceptance list (section 1 of the rollout spec), the spec's section and the per-frame work, looking hard at fixed steps from an accumulator (at most three a frame, a third in slow motion); the loop stopping when calm; the keyboard ring. It writes `$TEN/reports/L6/review-<k>.md`: first line `RESULT: approved` or `RESULT: changes <count>`, then numbered findings (Critical, Important, Minor), and replies in at most three lines. Each fix round: the builder fixes, runs Steps 5 and 7 again (and the galleries, clips or frame times a fix touches), commits `fix: Water Ripple: <what>` after the branch check, writes `$TEN/reports/L6/fix-<k>.md` (`RESULT: built <commit>`), and the reviewer re-reviews only the fix. After three rounds the coordinator steps in. When approved, the coordinator stops the lane's server and adds the ledger line `<date time>  L6  approved at <commit>; check rounds <k>; frames <numbers>; departures: <none or a list>; reports reports/L6/`.

---

### Task 7: L7 · 06.28 Audio Visualizer (`ten/L7`, port 8967)

Loop · step 1 "Watch it" · player bar: Pause and Slow motion (the page pauses and slows itself); Hear it is a real button in the box. See inside: each bar split by the parts of the tune filling it, with a beat strip on top and a legend. Compare: "Equal slices" (the bass crowded into a few bars) beside "Wider for treble". Spec: "7 · Audio Visualizer (06.28)" in `docs/superpowers/specs/2026-10-13-ten-new-animations-design.md`.

**Files:**
- Create: `animations/06-3d-advanced/audio-visualizer/index.html` (416 lines), `animations/06-3d-advanced/audio-visualizer/README.md`
- Modify (by `$TEN/lanes.mjs 7`): `index.html` (the card after Infinite Zoom's, the `PV` key, the `PLACES` row, the `FIND` row (the finder is on the branch), every count 166 → 167), `README.md` (counts, 06's count 26 → 27, the catalog line), `animations/06-3d-advanced/README.md` (its line and a Browser requirements row), `.github/ISSUE_TEMPLATE/config.yml`, `404.html`
- Modify (Step 4, by hand): `index.html`: the preview's CSS at the end of the 06 bespoke block, `case 'audioviz':` in `pvMarkup()`
- Regenerate: `sitemap.xml`, `llms.txt`, `skills/animation-handbook/` (their tools)
- Test: `tests/*.test.js` (with a proof edit, put back); the page check of the new page and of the home page; the review kit's short screens, a gallery for the defaults and for each other choice in Try it, clips of the defaults and of the timing settings' choices; frame times
- Write (run folder): `$TEN/checks/L7/` (logs, screenshots, kit output), `$TEN/reports/L7/build.md`, `fix-<k>.md`; the reviewer `review-<k>.md`

**Interfaces:**
- Consumes: Task 0's worktree `.claude/worktrees/ten-L7` on `ten/L7`, its server on port 8967 (started and stopped by the coordinator), `$TEN/lanes.mjs`, `$TEN/frametimes.mjs`, the shared-file version N in the ledger; Phase 0's shared files, its mode press (the shared script presses nothing on a loop after See inside or Compare) and its page check; the rollout's review kit and wait tool.
- Produces: branch `ten/L7`: the card `['audio-visualizer','Audio Visualizer','Bars dance to the music, from bass to treble. Best for music players.']` (06.28), `PV` key `'audio-visualizer':'audioviz'`, `PLACES` `['imgcard','bg']`, `FIND` `'audio-visualizer':['shape background','loop','bounce grow']`; Previous: Infinite Zoom (for now: Task 11 points it at the page before it in the section); no Next link yet. For Task 11: `'audio-visualizer': ['bars-seg', 'Some']` in `PHONE_DEFAULTS`. The reports in `$TEN/reports/L7/`, which the rollout's final review (part 9) reads too.

- [ ] **Step 1: The lane's shared edits (the failing tests)**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L7 || exit 1
node $TEN/lanes.mjs 7 .
git status --short
node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)" | head -10
```

Expected: `lane 7 shared edits applied to .`; then ` M .github/ISSUE_TEMPLATE/config.yml`, ` M 404.html`, ` M README.md`, ` M animations/06-3d-advanced/README.md`, ` M index.html`; then these 6 failing tests and `ℹ fail 6`: `✖ make-famous: on the real home page every card builds, but the eight whose previews need a script or animate in SVG`, `✖ the answers keep the rules every page of a kind shares: transitions answer newpage, loops loop, scroll pages scroll`, `✖ the Full catalog in the root README lists every card once, in home order, linked to its live page`, `✖ the counts written in the issue template, the 404 page and the sitemap match the cards`, `✖ the skill and llms.txt are what tools/make-skill.mjs writes from the pages and the home page now`, `✖ llms.txt lists every card once, in the order of CATS, with its live address and its description, and links the skill files`. (Famous effects' test builds every card's preview, which Step 4 adds; the finder's reads each page's kind, from a page that is not there yet; this plan's run of every lane on a copy of `feat/ten-animations` at `ece2689`, the finder and Famous effects there, gave exactly these.) If `lanes.mjs` stops with `not found (…)`, stop and tell the coordinator, who alone edits `$TEN/lanes.mjs`; before running it again, put the worktree back with `git checkout -- .` (this step makes no other changes; the tool refuses a second run on a changed tree).

- [ ] **Step 2: Write the page: `animations/06-3d-advanced/audio-visualizer/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Audio Visualizer — Animation Handbook</title>
  <meta name="description" content="Bars dance to the music, from bass to treble. Best for music players.">
  <link rel="canonical" href="https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/audio-visualizer/">
  <link rel="icon" type="image/png" sizes="96x96" href="../../../favicon.png">
  <link rel="icon" type="image/svg+xml" href="../../../favicon.svg">
  <link rel="apple-touch-icon" href="../../../apple-touch-icon.png">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Animation Handbook">
  <meta property="og:title" content="Audio Visualizer — Animation Handbook">
  <meta property="og:description" content="Bars dance to the music, from bass to treble. Best for music players.">
  <meta property="og:url" content="https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/audio-visualizer/">
  <meta property="og:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Audio Visualizer — Animation Handbook">
  <meta name="twitter:description" content="Bars dance to the music, from bass to treble. Best for music players.">
  <meta name="twitter:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <script type="application/ld+json">{"@context": "https://schema.org", "@type": "TechArticle", "headline": "Audio Visualizer", "name": "Audio Visualizer", "description": "Bars dance to the music, from bass to treble. Best for music players.", "url": "https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/audio-visualizer/", "inLanguage": "en", "articleSection": "3D & Advanced", "isPartOf": {"@type": "WebSite", "name": "Animation Handbook", "url": "https://matinmonshizadeh.github.io/animation-handbook/"}, "author": {"@type": "Person", "name": "matinmonshizadeh"}, "keywords": "web animation, CSS animation, 3D & Advanced, Audio Visualizer"}</script>
  <style>
    :root{--ui-accent:#3fd6c4}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    .stage{position:relative;overflow:hidden;background:radial-gradient(80% 70% at 50% 100%,#1a1430,#08080c 70%)}
    #cvs{position:absolute;inset:0;width:100%;height:100%;display:block}
    /* Hear it: a small player row in the box, at least 44px */
    .hear{position:absolute;right:10px;top:10px;z-index:2;display:inline-flex;align-items:center;gap:8px;min-height:44px;min-width:44px;padding:0 14px;
      border:1px solid rgba(255,255,255,.28);border-radius:999px;background:rgba(8,8,12,.82);color:#f4f4f2;font:600 14px/1 var(--hb-font);cursor:pointer}
    .hear svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
    .hear[aria-pressed="true"]{border-color:var(--ui-accent);color:var(--ui-accent)}
    @media(hover:hover){.hear:hover{border-color:rgba(255,255,255,.6)}}
    /* See inside and Compare: plain words over the picture */
    .av-lbl{display:none;position:absolute;padding:3px 8px;border-radius:6px;background:rgba(8,8,12,.9);color:#f4f4f2;font:600 13px/1.25 var(--hb-font);white-space:nowrap;pointer-events:none}
    .stage[data-hb-mode="inside"] .in:not(.scale),.stage[data-hb-mode="compare"] .row{display:block}
    .key{left:10px;top:10px;max-width:calc(100% - 140px);white-space:normal}
    .key i{display:inline-block;width:9px;height:9px;margin:0 4px 0 2px;border-radius:50%;vertical-align:0}
    .beat{left:10px;top:var(--beat-y,50px)}
    .scale{left:10px;right:10px;bottom:8px}
    .stage[data-hb-mode="inside"].st-bars .scale{display:flex;justify-content:space-between}
    .row{left:10px}.row.first{top:10px}.row.second{top:calc(50% + 8px)}
  </style>
  <link rel="stylesheet" href="../../../assets/css/demo-page.css?v=10">
  <script src="../../../assets/js/demo-page.js?v=10" defer></script>
</head>
<body class="hb" data-hb-kind="loop">
<nav class="hb-bar" aria-label="Animation Handbook">
  <a class="hb-home" href="../../../"><svg class="hb-mark" viewBox="0 0 32 32" aria-hidden="true"><g class="g"><circle cx="11.16" cy="20.84" r="6.1"/><circle cx="15.12" cy="16.88" r="6.1"/><circle cx="18.51" cy="13.49" r="6.1"/></g><circle class="b" cx="21.2" cy="10.8" r="6.6"/></svg><span>Animation Handbook</span></a>
  <span class="hb-pager"><a href="../infinite-zoom/" rel="prev" aria-label="Previous: Infinite Zoom"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg><span><span class="hb-dir">Previous: </span>Infinite Zoom</span></a></span>
  <a class="hb-star" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener" aria-label="Star on GitHub"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg><span>Star on GitHub</span></a>
</nav>
<main class="hb-page">
  <header class="hb-head">
    <p class="hb-cat">06.28 · 3D &amp; Advanced</p>
    <h1>Audio Visualizer</h1>
    <p class="hb-lede">Bars dance to the music, from bass to treble. Best for music players.</p>
  </header>

  <section class="hb-step hb-watch" aria-labelledby="hb-watch-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">1</span>
      <div><h2 id="hb-watch-title">Watch it</h2><p>It moves to a built-in beat, in silence. Press Hear it to play the beat out loud.</p></div>
    </div>
    <div class="seg hb-modes" role="group" aria-label="What the box shows" data-hb-modes>
      <button type="button" data-hb-mode="normal" class="on" aria-pressed="true">Normal</button>
      <button type="button" data-hb-mode="inside" aria-pressed="false">See inside</button>
      <button type="button" data-hb-mode="compare" aria-pressed="false">Compare</button>
    </div>
    <div class="stage st-bars">
      <canvas id="cvs" role="img" aria-label="Bars from bass on the left to treble on the right, jumping to a beat and sinking back"></canvas>
      <button class="hear" type="button" id="hear" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg><span>Hear it</span></button>
      <p class="av-lbl in key" aria-hidden="true" data-hb-caption><i style="background:#ff5d5d"></i>Kick <i style="background:#ffa94d"></i>Snare <i style="background:#b07cff"></i>Bass <i style="background:#5cd18a"></i>Melody <i style="background:#4fc3f7"></i>Hi-hats</p>
      <p class="av-lbl in beat" aria-hidden="true" data-hb-caption>The beat</p>
      <p class="av-lbl in scale" aria-hidden="true" data-hb-caption><span>Bass</span><span>Middle</span><span>Treble</span></p>
      <p class="av-lbl row first" aria-hidden="true" data-hb-caption>Equal slices</p>
      <p class="av-lbl row second" aria-hidden="true" data-hb-caption>Wider for treble</p>
    </div>
    <div class="hb-player">
      <button class="hb-play" type="button" id="btn-pause" data-hb-pause data-state="playing"><svg class="hb-ic hb-i-pause" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg><svg class="hb-ic hb-i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3l14 9-14 9z"/></svg><span class="hb-pause-label">Pause</span></button>
      <label class="hb-toggle"><input class="hb-switch" type="checkbox" role="switch" id="slow-tog" data-hb-slowmo autocomplete="off"><span>Slow motion</span></label>
    </div>
    <div class="hb-mode-notes" aria-live="polite">
      <p data-hb-for="inside" hidden>Inside, each bar is split by the parts of the tune filling it, kick and bass on the left, hi-hats on the right. The top strip marks the beat: each kick lifts the low bars.</p>
      <p data-hb-for="compare" hidden>Equal slices gives every bar the same share of pitches, so the bass crowds into a few bars. Wider for treble widens the slices as pitches rise, as we hear, so the whole row dances.</p>
    </div>
  </section>

  <section class="hb-step hb-try" aria-labelledby="hb-try-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">2</span>
      <div><h2 id="hb-try-title">Try it</h2><p>Change a setting and see the difference as it moves.</p></div>
    </div>
    <div class="hb-settings">
      <div class="hb-setting">
        <p class="hb-setting-name" id="style-lbl">Style</p>
        <div class="seg" id="style-seg" role="group" aria-labelledby="style-lbl">
          <button type="button" data-style="bars" class="on" aria-pressed="true">Bars</button>
          <button type="button" data-style="wave" aria-pressed="false">Wave</button>
          <button type="button" data-style="circle" aria-pressed="false">Circle</button>
        </div>
        <p class="hb-hint">Wave draws the sound's shape instead of its pitches.</p>
      </div>
      <div class="hb-setting">
        <p class="hb-setting-name" id="bars-lbl">Number of bars</p>
        <div class="seg" id="bars-seg" role="group" aria-labelledby="bars-lbl">
          <button type="button" data-n="16" aria-pressed="false">Few</button>
          <button type="button" data-n="32" data-hb-phone aria-pressed="false">Some</button>
          <button type="button" data-n="64" class="on" aria-pressed="true">Many</button>
        </div>
        <p class="hb-hint">Fewer read better when small.</p>
      </div>
      <div class="hb-setting">
        <p class="hb-setting-name" id="fall-lbl">How bars fall</p>
        <div class="seg" id="fall-seg" role="group" aria-labelledby="fall-lbl">
          <button type="button" data-fall="2.6" aria-pressed="false">Quickly</button>
          <button type="button" data-fall="1.2" class="on" aria-pressed="true">Gently</button>
          <button type="button" data-fall="0.45" aria-pressed="false">Slowly</button>
        </div>
        <p class="hb-hint">Slowly sinks like an old stereo.</p>
      </div>
    </div>
    <details class="hb-options">
      <summary><span class="hb-more-label">More options</span><span class="hb-less">Fewer options</span><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary>
      <div class="hb-settings">
        <div class="hb-setting">
          <label class="hb-switch-row"><span>Peak marks</span><input class="hb-switch" type="checkbox" role="switch" id="peak-tog" checked autocomplete="off"></label>
          <p class="hb-hint">A small mark holds each bar's highest point for a moment.</p>
        </div>
        <div class="hb-setting">
          <p class="hb-setting-name" id="colors-lbl">Colors</p>
          <div class="seg" id="colors-seg" role="group" aria-labelledby="colors-lbl">
            <button type="button" data-pal="sunset" class="on" aria-pressed="true">Sunset</button>
            <button type="button" data-pal="ocean" aria-pressed="false">Ocean</button>
            <button type="button" data-pal="neon" aria-pressed="false">Neon</button>
          </div>
          <p class="hb-hint">The colors from the bottom of each bar to its top.</p>
        </div>
      </div>
    </details>
  </section>

  <section class="hb-step hb-prompt-step" aria-labelledby="hb-prompt-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">3</span>
      <div><h2 id="hb-prompt-title">Copy the prompt</h2><p>Paste it into an AI assistant such as ChatGPT, Claude or Cursor to build this in your own project.</p></div>
    </div>
    <div class="hb-card">
      <p class="hb-prompt">Add an audio visualizer to [your music player, podcast card or hero section]. Connect the playing audio to an analyzer that reports, many times a second, how loud each band of pitches is, and draw the bands on a canvas from bass to treble, in the style the settings choose, each sized by its loudness. Give higher bands wider slices of pitch, as hearing does, so the whole row moves. Let bands jump up at once and sink back as the settings choose. Start sound only when the visitor presses play, never use the microphone without asking, and draw fewer bars on phones. If the visitor has reduced motion turned on, keep the bars still until they press play. Match the settings listed below.</p>
      <div class="hb-chips-box" hidden>
        <p class="hb-chips-title">Your settings</p>
        <ul class="hb-chips"></ul>
      </div>
      <div class="hb-copy-row">
        <button class="hb-copy" type="button"><svg class="hb-ic hb-i-copy" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><svg class="hb-ic hb-i-done" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span class="hb-copy-label" aria-live="polite">Copy prompt</span></button>
        <p class="hb-hint">Replace the words in brackets with your own element. Your settings are added at the end.</p>
      </div>
    </div>
    <div class="hb-star-row"><p>Free and open source. If this helped, a star on GitHub helps other people find it.</p><a class="hb-star-btn" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>Star on GitHub</a></div>
  </section>

  <section class="hb-about" aria-labelledby="hb-what-title">
    <div class="hb-what">
      <h2 id="hb-what-title">What it is</h2>
      <div class="hb-what-text"><p>The full explanation is in <a href="README.md">README.md</a>.</p></div>
    </div>
    <div class="hb-fit">
      <h2>Good for</h2>
      <ul class="hb-tags hb-good"><li>Music players</li><li>Podcast pages</li><li>Radio and DJ sites</li><li>Voice notes</li></ul>
      <h3>Avoid on</h3>
      <ul class="hb-tags hb-avoid"><li>Pages without sound</li><li>Reading pages</li></ul>
    </div>
  </section>

  <section class="hb-related" aria-labelledby="hb-related-title" hidden>
    <h2 id="hb-related-title">Similar animations</h2>
    <div class="hb-rel-list"></div>
  </section>
</main>
<footer class="hb-foot"><span>Animation Handbook</span><a href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener">Source on GitHub</a><a href="#top">Back to top ↑</a></footer>
<script>
  const cvs=document.getElementById('cvs'),ctx=cvs.getContext('2d'),stage=cvs.parentElement,hear=document.getElementById('hear');
  const slowTog=document.getElementById('slow-tog'),peakTog=document.getElementById('peak-tog'),pauseBtn=document.getElementById('btn-pause');
  const reduceMQ=matchMedia('(prefers-reduced-motion: reduce)'),phone=matchMedia('(max-width:600px),(max-height:500px)');
  // The tune: four bars at 100 beats a minute (a beat is 0.6 s, the loop 9.6 s), written as the beats each part plays on.
  // Bass and melody notes are [beat, length in beats, frequency in Hz].
  const BEAT=.6,LOOP=16*BEAT;
  const KICK=[0,1.5,2,4,5.5,6,8,9.5,10,12,13.5,14,15],SNARE=[1,3,5,7,9,11,13,15],HATS=[...Array(32)].map((_,i)=>i/2);
  const BASS=[[0,1.5,55],[1.5,.5,55],[2,1,55],[3,1,110],[4,1.5,43.65],[5.5,.5,43.65],[6,1,43.65],[7,1,87.3],[8,1.5,65.4],[9.5,.5,65.4],[10,1,65.4],[11,1,130.8],[12,1.5,49],[13.5,.5,49],[14,1,49],[15,1,98]];
  const MELODY=[[0,1,440],[1,1,523.3],[2,2,659.3],[4,1,587.3],[5,1,523.3],[6,2,440],[8,1,392],[9,1,440],[10,2,523.3],[12,1,493.9],[13,1,392],[14,2,329.6]];
  const PARTS=['kick','snare','bass','melody','hats'],PART_COLORS=['#ff5d5d','#ffa94d','#b07cff','#5cd18a','#4fc3f7'];
  const PALETTES={sunset:['#ff5f6d','#ffc371'],ocean:['#0083b0','#00e5ff'],neon:['#ff00a0','#00f0ff']};
  const LABELS={normal:'Bars from bass on the left to treble on the right, jumping to a beat and sinking back',
    inside:'The bars split by the parts of the tune that fill them, with a scale from bass to treble and the beat on top',
    compare:'Two rows of bars for the same tune: equal slices of pitch above, slices that widen for treble below'};
  let style='bars',count=64,fall=1.2,pal='sunset',mode='normal',paused=false;
  let W=0,H=0,raf=0,lastT=null,clock=.03,song=.03,rows=null,audio=null,insideTop=40;
  // On phones the bars start at the choice marked data-hb-phone (Some), pressed here before the shared script reads the settings
  if(phone.matches){const b=document.querySelector('#bars-seg [data-hb-phone]');count=+b.dataset.n;
    document.querySelectorAll('#bars-seg button').forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',String(x===b))})}
  const bars=()=>count;
  // How loud each part is at a time of the loop (s, in seconds): a hit dies away after it is struck, a note while it sounds
  const since=(beats,s)=>{let best=1e9;for(const b of beats){const d=s-b*BEAT;if(d>=0&&d<best)best=d;const w=s+LOOP-b*BEAT;if(w>=0&&w<best)best=w}return best};
  const note=(notes,s)=>{for(const [b,l,f] of notes){const d=s-b*BEAT;if(d>=0&&d<l*BEAT)return{f,amp:Math.exp(-d/(l*BEAT*1.2))}}return{f:0,amp:0}};
  function parts(s){
    return{kick:Math.exp(-since(KICK,s)/.12),snare:.8*Math.exp(-since(SNARE,s)/.15),hats:.55*Math.exp(-since(HATS,s)/.05),bass:note(BASS,s),melody:note(MELODY,s)};
  }
  // How strongly a part fills a band of pitches (lo to hi Hz), as an analyzer would measure it: the part's loudness averaged over
  // the band, its energy sitting around its own pitches, spread over a range (a drum) or over a note and its overtones
  // (pitches in octaves: lf is a sampled pitch of the band, c a part's own pitch, w how far its energy spreads)
  const near=(lf,c,w)=>{const d=(lf-c)/w;return Math.exp(-d*d)};
  const L62=Math.log2(62),L200=Math.log2(200),L1800=Math.log2(1800),L9000=Math.log2(9000);
  function fill(row,i,p,out){
    const lb=p.bass.amp?Math.log2(p.bass.f):0,lm=p.melody.amp?Math.log2(p.melody.f):0;
    const tone=(n,k,l,lf)=>n.amp?k*n.amp*(near(lf,l,.3)+.5*near(lf,l+1,.3)+.25*near(lf,l+1.585,.3)):0;
    out.fill(0);
    for(let j=0;j<6;j++){const lf=row.lf[i*6+j];
      out[0]+=p.kick*near(lf,L62,.9);out[1]+=p.snare*(.6*near(lf,L200,.6)+near(lf,L1800,1.6));out[2]+=tone(p.bass,1,lb,lf);out[3]+=tone(p.melody,.8,lm,lf);out[4]+=p.hats*near(lf,L9000,.9)}
    for(let k=0;k<5;k++)out[k]/=6;
    return out;
  }
  // A row of bands: Wider for treble splits 40 Hz to 16 kHz evenly by octave (each band wider in pitches than the last), Equal
  // slices into equal widths of 0 to 16 kHz. Each keeps its bars' heights and peak marks.
  function makeRow(even,n){
    const edges=[...Array(n+1)].map((_,i)=>even?16000*i/n:40*Math.pow(400,i/n)),lf=new Float32Array(n*6);
    // six pitches spread across each band, kept in octaves, at which the parts are measured
    for(let i=0;i<n;i++)for(let j=0;j<6;j++)lf[i*6+j]=Math.log2(Math.max(20,edges[i]+(edges[i+1]-edges[i])*(j+.5)/6));
    return{edges,lf,level:new Float32Array(n),peak:new Float32Array(n),hold:new Float32Array(n),split:[...Array(n)].map(()=>[0,0,0,0,0])};
  }
  // Normal and See inside draw the log row; Compare draws its own pair, each row half as many bars on phones. All three follow
  // the tune every frame, so a mode opens on the current beat.
  function build(){const n=bars(),c=phone.matches?n/2:n;rows={log:makeRow(false,n),lin:makeRow(true,c),cmp:makeRow(false,c)};
    for(const row of Object.values(rows))settle(row,aim(row,song,null),1e6)}
  // The heights a frame aims for: from the tune itself, or from the real sound once Hear it plays it
  function aim(row,s,freq){
    const p=parts(s),n=row.level.length,bin=freq?audio.ctx.sampleRate/2/freq.length:1,out=new Float32Array(n);
    for(let i=0;i<n;i++){
      const lo=row.edges[i],hi=row.edges[i+1],f=fill(row,i,p,row.split[i]),sum=f[0]+f[1]+f[2]+f[3]+f[4];
      for(let k=0;k<5;k++)f[k]=sum?f[k]/sum:0;
      if(freq){let a=0,c=0;for(let k=Math.floor(lo/bin);k<=Math.max(Math.floor(lo/bin),Math.floor(hi/bin));k++){a+=freq[k]||0;c++}out[i]=Math.min(1,a/c/210)}
      else out[i]=1-Math.exp(-1.6*sum);
    }
    return out;
  }
  // Bars jump up at once and sink back by How bars fall (heights a second, a third of it in slow motion); a peak mark holds for
  // 0.4 s, then falls slowly
  function settle(row,target,dt){
    const k=dt/1000,{level,peak,hold}=row;
    for(let i=0;i<level.length;i++){
      level[i]=target[i]>level[i]?target[i]:Math.max(target[i],level[i]-fall*k);
      if(level[i]>=peak[i]){peak[i]=level[i];hold[i]=.4}else if((hold[i]-=k)<0)peak[i]=Math.max(level[i],peak[i]-.35*k);
    }
  }
  // The sound's shape: the parts of the tune added together, a short stretch of time around now
  function wave(s,part){
    const p=parts(s),out=new Float32Array(160);
    for(let j=0;j<160;j++){const u=j/160*.03,ph=(s+u)*6.283;
      const v=[p.kick*Math.sin(ph*60),p.snare*.5*Math.sin(ph*3100+j*j),p.bass.amp*.8*Math.sin(ph*p.bass.f),p.melody.amp*.5*Math.sin(ph*p.melody.f),p.hats*.3*Math.sin(ph*9000+j*7)];
      out[j]=part===undefined?v.reduce((a,b)=>a+b,0)*.6:v[part]*.6}
    return out;
  }
  function grad(x0,y0,x1,y1){const g=ctx.createLinearGradient(x0,y0,x1,y1),[a,b]=PALETTES[pal];g.addColorStop(0,a);g.addColorStop(1,b);return g}
  // One row of bars in a rectangle; split: draw each bar in the colors of the parts filling it (See inside)
  // The palette's colors from the bottom of a bar to its top, drawn once into a strip one pixel wide; each bar copies the part of
  // the strip it reaches, which costs far less than filling bars with a gradient every frame
  let strip=null;
  function stripFor(h){
    if(strip&&strip.h===Math.round(h)&&strip.pal===pal)return strip.c;
    const c=document.createElement('canvas'),g=c.getContext('2d'),[a,b]=PALETTES[pal],gr=g.createLinearGradient(0,h,0,0);
    c.width=1;c.height=Math.max(1,Math.round(h));gr.addColorStop(0,a);gr.addColorStop(1,b);g.fillStyle=gr;g.fillRect(0,0,1,h);
    strip={c,h:Math.round(h),pal};return c;
  }
  // See inside fills the bars part by part, every bar of one color in one path, filled once
  function drawBars(row,x,y,w,h,split){
    const n=row.level.length,bw=w/n,gap=Math.min(3,bw*.25);
    if(!split){const c=stripFor(h);for(let i=0;i<n;i++){const bh=Math.max(2,row.level[i]*h);ctx.drawImage(c,0,c.height-bh,1,bh,x+i*bw+gap/2,y+h-bh,bw-gap,bh)}}
    else for(let k=0;k<5;k++){
      ctx.beginPath();
      for(let i=0;i<n;i++){const bh=Math.max(2,row.level[i]*h),sh=row.split[i][k];let under=0;for(let q=0;q<k;q++)under+=row.split[i][q];
        if(sh)ctx.rect(x+i*bw+gap/2,y+h-(under+sh)*bh,bw-gap,sh*bh)}
      ctx.fillStyle=PART_COLORS[k];ctx.fill();
    }
    if(peakTog.checked){ctx.beginPath();for(let i=0;i<n;i++)ctx.rect(x+i*bw+gap/2,y+h-row.peak[i]*h-3,bw-gap,2);ctx.fillStyle='#f4f4f2';ctx.fill()}
  }
  function drawCircle(row,cx,cy,r0,len,split){
    const n=row.level.length,bass=(row.level[0]+row.level[1]+row.level[2])/3,r=r0*(1+.18*bass),[ca,cb]=PALETTES[pal],g=ctx.createRadialGradient(cx,cy,r,cx,cy,r+len);
    g.addColorStop(0,ca);g.addColorStop(1,cb);
    ctx.lineWidth=Math.max(2,Math.min(8,6.283*r/n*.55));ctx.lineCap='round';
    for(let i=0;i<n;i++){const a=-Math.PI/2+i/n*6.283,c=Math.cos(a),s=Math.sin(a),l=Math.max(2,row.level[i]*len);
      if(split){let d=r;row.split[i].forEach((sh,k)=>{if(!sh)return;ctx.strokeStyle=PART_COLORS[k];ctx.beginPath();ctx.moveTo(cx+c*d,cy+s*d);d+=sh*l;ctx.lineTo(cx+c*d,cy+s*d);ctx.stroke()});continue}
      ctx.strokeStyle=g;ctx.beginPath();ctx.moveTo(cx+c*r,cy+s*r);ctx.lineTo(cx+c*(r+l),cy+s*(r+l));ctx.stroke()}
    ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,r-4,0,6.283);ctx.stroke();
  }
  function drawWave(pts,x,y,w,h,color,width){
    ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineJoin='round';ctx.beginPath();
    pts.forEach((v,j)=>{const px=x+j/(pts.length-1)*w,py=y+h/2-v*h*.42;j?ctx.lineTo(px,py):ctx.moveTo(px,py)});ctx.stroke();
  }
  function drawRow(row,x,y,w,h,split,s,live){
    if(style==='bars')drawBars(row,x,y,w,h,split);
    else if(style==='circle')drawCircle(row,x+w/2,y+h/2,Math.min(w,h)*.18,Math.min(w,h)*.3,split);
    else{if(split)PART_COLORS.forEach((c,k)=>drawWave(wave(s,k),x,y,w,h,c,1.5));drawWave(live||wave(s),x,y,w,h,split?'#fff':grad(x,0,x+w,0),split?2.5:3)}
  }
  // See inside's beat strip: the loop in half beats, the kicks in the kick's color and the snares in the snare's, and a mark that
  // moves with the tune
  function drawBeat(y){
    const x=10,w=W-20,cw=w/32;
    for(let b=0;b<32;b++){ctx.fillStyle=KICK.includes(b/2)?PART_COLORS[0]:SNARE.includes(b/2)?PART_COLORS[1]:'rgba(255,255,255,.14)';ctx.fillRect(x+b*cw+1,y,cw-2,10)}
    ctx.fillStyle='#fff';ctx.fillRect(x+song/LOOP*w-1.5,y-4,3,18);
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    const live=audio&&audio.ctx.state==='running'&&style==='wave'?toWave(audio.an):null;
    if(mode==='compare'){drawRow(rows.lin,8,34,W-16,H/2-44,false,song,live);drawRow(rows.cmp,8,H/2+26,W-16,H/2-36,false,song,live);
      ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(0,H/2-1,W,2)}
    else if(mode==='inside'){drawBeat(insideTop+30);drawRow(rows.log,10,insideTop+56,W-20,H-insideTop-96,true,song,live)}
    else drawRow(rows.log,10,58,W-20,H-68,false,song,live);
  }
  const toWave=an=>{const d=new Uint8Array(an.fftSize);an.getByteTimeDomainData(d);const out=new Float32Array(160);for(let j=0;j<160;j++)out[j]=(d[j*4]-128)/128*1.6;return out};
  // One frame: the tune moves on by the time that passed (a third of it in slow motion), the heights follow it (or the real
  // sound), and the sound is scheduled a little ahead
  function frame(dt){
    const rate=slowTog.checked?1/3:1;clock+=dt/1000*rate;song=clock%LOOP;
    // the real sound only once the browser plays it: a context it holds back (no sound device, or no permission) leaves the bars
    // on the tune's own heights
    let freq=null;if(audio&&audio.ctx.state==='running'){freq=new Uint8Array(audio.an.frequencyBinCount);audio.an.getByteFrequencyData(freq);schedule()}
    for(const row of Object.values(rows))settle(row,aim(row,song,freq),dt*rate);
    draw();
  }
  function loop(ts){
    raf=requestAnimationFrame(loop);
    if(lastT===null){lastT=ts;return}
    const dt=Math.min(ts-lastT,50);lastT=ts;frame(dt);
  }
  function start(){if(raf||paused)return;lastT=null;raf=requestAnimationFrame(loop)}
  // Hear it: the same tune played by the browser (oscillators and a burst of generated noise), made only on this press; the bars
  // then follow a real analyzer. Pause and a hidden tab suspend the sound; slow motion plays it at a third of the tempo.
  function startAudio(){
    const ac=new (window.AudioContext||window.webkitAudioContext)(),an=ac.createAnalyser(),out=ac.createGain();
    an.fftSize=2048;an.smoothingTimeConstant=.5;out.gain.value=.45;out.connect(an);an.connect(ac.destination);
    const noise=ac.createBuffer(1,ac.sampleRate,ac.sampleRate),d=noise.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
    audio={ctx:ac,an,out,noise,upTo:clock};
    ac.resume();
  }
  function play(kind,at,f,len){
    const {ctx:ac,out,noise}=audio,g=ac.createGain();g.connect(out);
    const env=(peak,dur)=>{g.gain.setValueAtTime(peak,at);g.gain.exponentialRampToValueAtTime(.001,at+dur)};
    if(kind==='kick'){const o=ac.createOscillator();o.frequency.setValueAtTime(150,at);o.frequency.exponentialRampToValueAtTime(45,at+.12);env(1,.35);o.connect(g);o.start(at);o.stop(at+.4)}
    else if(kind==='snare'||kind==='hats'){const s=ac.createBufferSource(),fl=ac.createBiquadFilter();s.buffer=noise;fl.type=kind==='hats'?'highpass':'bandpass';
      fl.frequency.value=kind==='hats'?7000:1800;env(kind==='hats'?.25:.6,kind==='hats'?.05:.18);s.connect(fl);fl.connect(g);s.start(at);s.stop(at+.3)}
    else{const o=ac.createOscillator();o.type=kind==='bass'?'sawtooth':'triangle';o.frequency.value=f;env(kind==='bass'?.3:.2,len);o.connect(g);o.start(at);o.stop(at+len+.05)}
  }
  // Every note whose time falls in the next tenth of a second of the tune is handed to the browser, at the time it should sound;
  // clock is the tune's time counted on, past the end of the loop
  function schedule(){
    const rate=slowTog.checked?1/3:1,{ctx:ac}=audio,from=audio.upTo,to=clock+.1;
    if(to<=from)return;
    const each=(b,fn)=>{const s0=b*BEAT;for(let o=s0+Math.floor((from-s0)/LOOP)*LOOP;o<to;o+=LOOP)if(o>=from)fn(Math.max(ac.currentTime,ac.currentTime+(o-clock)/rate))};
    for(const [list,kind] of [[KICK,'kick'],[SNARE,'snare'],[HATS,'hats']])for(const b of list)each(b,at=>play(kind,at,0,0));
    for(const [list,kind] of [[BASS,'bass'],[MELODY,'melody']])for(const [b,l,f] of list)each(b,at=>play(kind,at,f,l*BEAT/rate*.9));
    audio.upTo=to;
  }
  hear.addEventListener('click',()=>{
    if(audio){audio.ctx.close();audio=null;hear.setAttribute('aria-pressed','false');if(paused)draw();return}
    if(paused)pauseBtn.click(); // the sound follows the loop, so Hear it pressed while paused plays both
    startAudio();hear.setAttribute('aria-pressed','true');
  });
  // Registered at the top level: under reduced motion the shared script pauses the loop at once, on a kick
  document.addEventListener('hb:pause',e=>{
    paused=e.detail.paused;notes();
    if(audio)paused?audio.ctx.suspend():audio.ctx.resume();
    if(paused){cancelAnimationFrame(raf);raf=0;if(rows)draw()}else start();
  });
  document.addEventListener('visibilitychange',()=>{lastT=null;if(audio)document.hidden?audio.ctx.suspend():paused||audio.ctx.resume()});
  // The mode switch draws the mode at once, playing or paused
  document.addEventListener('hb:mode',e=>{mode=e.detail.mode;cvs.setAttribute('aria-label',LABELS[mode]);notes();place();if(rows)draw()});
  // See inside's beat strip sits under the key, which wraps onto more lines in a narrow box
  function place(){insideTop=stage.querySelector('.key').offsetHeight+20;stage.style.setProperty('--beat-y',insideTop+2+'px')}
  // The notes follow the settings and the loop: with Wave both rows of Compare match and See inside shows the parts of the wave;
  // Circle runs from the bass at the top round to the hi-hats; "Shown still" only while the loop is paused under reduced motion
  const said={inside:document.querySelector('[data-hb-for="inside"]').textContent};
  function notes(){
    const still=reduceMQ.matches&&paused,ins=document.querySelector('[data-hb-for="inside"]'),cmp=document.querySelector('[data-hb-for="compare"]');
    const where=style==='circle'?'kick and bass at the top, round to the hi-hats':'kick and bass on the left, hi-hats on the right';
    ins.textContent=style==='wave'?'Inside, each colored line is one part of the tune, and the white line is all of them added together: the shape a speaker moves to.'
      :still?`Shown still: each bar is split by the parts of the tune filling it, ${where}. The top strip marks the beat.`
      :style==='circle'?`Inside, each bar is split by the parts of the tune filling it, ${where}. The top strip marks the beat: each kick lifts the low bars.`:said.inside;
    cmp.textContent=style==='wave'?'Style is set to Wave, which draws the sound\'s shape, not its pitches, so Equal slices and Wider for treble match. Pick Bars or Circle in Try it to see the difference.'
      :(still?'Shown still: Equal slices crowds the bass into a few bars, while Wider for treble spreads the tune across the whole row.'
      :'Equal slices gives every bar the same share of pitches, so the bass crowds into a few bars. Wider for treble widens the slices as pitches rise, as we hear, so the whole row dances.');
  }
  function resize(){
    const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h||(w===W&&h===H))return;W=w;H=h;
    const dpr=Math.min(devicePixelRatio||1,1.5);cvs.width=W*dpr;cvs.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    if(!rows)build();
    place();draw();
  }
  // A setting shows at once, playing or paused
  function choices(id,pick){
    const buttons=document.querySelectorAll('#'+id+' button');
    buttons.forEach(b=>b.addEventListener('click',()=>{
      buttons.forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',String(x===b))});
      pick(b.dataset);notes();if(rows)draw();
    }));
  }
  choices('style-seg',d=>{style=d.style;stage.classList.toggle('st-bars',style==='bars')});
  choices('bars-seg',d=>{count=+d.n;build()});
  choices('fall-seg',d=>{fall=+d.fall});
  choices('colors-seg',d=>{pal=d.pal});
  peakTog.addEventListener('change',()=>{if(rows)draw()});
  notes();
  new ResizeObserver(resize).observe(stage);
  resize();
  start();
</script>
</body>
</html>
```

Then give it the shared-file version the branch uses (the ledger's N; nothing changes when N is 10):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L7 || exit 1
N=$(grep -o 'shared files ?v=[0-9]*' $TEN/ledger.md | head -1 | grep -o '[0-9]*$')
sed -i "s/demo-page\.css?v=10/demo-page.css?v=$N/; s/demo-page\.js?v=10/demo-page.js?v=$N/" animations/06-3d-advanced/audio-visualizer/index.html
grep -c "demo-page\.css?v=$N\|demo-page\.js?v=$N" animations/06-3d-advanced/audio-visualizer/index.html
```

Expected: `2`.

- [ ] **Step 3: Write the README: `animations/06-3d-advanced/audio-visualizer/README.md`**

````markdown
# Audio Visualizer

[Live demo](https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/audio-visualizer/)

## What it is
An audio visualizer turns sound into moving shapes: a row of bars from bass on the left to treble on the right, each as tall as its band of pitches is loud right now. The bars jump up when a sound starts and sink back as it fades, so a kick drum makes the low bars leap and the hi-hats flicker at the top. The same loudness can be drawn as bars, as a ring of bars around a circle, or as the wave the sound itself makes.

## When to use it
- Music players, from a site's own player to a band's page
- Podcast and audiobook cards, to show that something is playing
- Radio, DJ and event sites, as a lively header
- Voice notes and recorders, as a sign that sound is coming in

## How it works
In a real player the page connects the playing audio to the Web Audio API's `AnalyserNode`, which reports many times a second how loud each slice of pitches is (`getByteFrequencyData`) or the shape of the sound (`getByteTimeDomainData`):

```js
const ctx = new AudioContext(), source = ctx.createMediaElementSource(audioElement), analyser = ctx.createAnalyser();
analyser.fftSize = 2048;
source.connect(analyser); analyser.connect(ctx.destination);
const freq = new Uint8Array(analyser.frequencyBinCount);
analyser.getByteFrequencyData(freq);   // 0 to 255 for each slice of about 23 Hz
```

The analyzer's slices are all the same width in hertz, but hearing works in octaves: 40 to 80 Hz is as wide a step for the ear as 4,000 to 8,000 Hz. So the bars group the slices by octave, from 40 Hz to 16 kHz, each band wider than the one before, and each bar shows the average of its slices. With equal slices instead (the demo's Compare), the bass and the tune crowd into the first few bars and the rest only flicker.

```js
const edges = [...Array(n + 1)].map((_, i) => 40 * Math.pow(400, i / n));   // 40 Hz × 400 = 16 kHz
```

Each frame a bar jumps straight to a louder value and otherwise sinks by How bars fall, measured in bar heights a second, so it falls at the same speed on every screen; a peak mark holds the highest point for 0.4 seconds, then sinks slowly. The palette's two colors are drawn once into a strip one pixel wide, and each bar copies the part of the strip it reaches with `drawImage`, which costs far less than filling every bar with a gradient each frame.

The demo plays no file and uses no microphone. Its tune is written in the page as notes (kick, snare, hi-hats, bass and a short melody, four bars at 100 beats a minute), and every frame the page works out how loud each band would be from the notes playing at that moment, so the bars move in silence, offline and on a muted phone. Hear it plays the same notes through the browser's own oscillators and a burst of generated noise, scheduled a tenth of a second ahead on the audio clock; only then do the bars read a real analyzer. The sound is made on that press and never before (browsers block sound that starts by itself); Pause and a hidden tab suspend it, and Slow motion plays the tune at a third of the tempo.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Style | Bars | Bars stand in a row from bass to treble; wave draws the sound's shape over a few hundredths of a second instead of its pitches; circle sets the bars around a ring that swells with the bass |
| Number of bars | Many | Few is 16 bars, some 32 and many 64; phones start at some, and each row of Compare holds half as many bars on phones |
| How bars fall | Gently | How fast a bar sinks after it jumps: quickly is 2.6 bar heights a second, gently 1.2 and slowly 0.45, like an old stereo |
| Peak marks | on | A thin mark holds each bar's highest point for 0.4 seconds, then sinks slowly; off, only the bars show |
| Colors | Sunset | The colors from the bottom of each bar to its top: sunset runs from coral to gold, ocean from deep blue to cyan, neon from pink to cyan |

## Production notes
- **Ask before sound.** Create the `AudioContext` inside the visitor's own press of play: browsers keep a context made earlier suspended and warn in the console. Never open the microphone without a clear reason and the visitor's yes.
- **Group by octave.** Average the analyzer's slices into bands that widen with pitch, or most bars show only hiss. `smoothingTimeConstant` (0 to 1) smooths the analyzer's own values; the jump-and-fall of the bars is better done in your own code, by time.
- **Light drawing.** One canvas and a few dozen copied rectangles a frame are cheap; a gradient filled over every bar each frame is not. Draw fewer bars on phones and stop the loop when the player is paused or out of view.
- **Cross-origin audio.** An `<audio>` element playing a file from another site needs `crossorigin="anonymous"` and the right CORS headers, or the analyzer reads only zeros.
- **Reduced motion.** Keep the bars still until the visitor presses play, and let them turn the movement off while the music plays.
- **Libraries.** Wavesurfer.js draws waveforms and plays files; Tone.js schedules notes and synths on the Web Audio clock; audioMotion-analyzer is a ready-made bar analyzer with octave bands and peaks.

## See also
- [Starfield / Space Particles](../../07-ambient-background/starfield/) — a loop drawn by JavaScript every frame
- [Abstract Geometric Motion](../../07-ambient-background/abstract-geometric-motion/) — a pattern for music players that ignores the sound
````

- [ ] **Step 4: The home page preview**

In the worktree's `index.html`: (a) insert these lines, and one empty line after them, right before the line `/* ── bespoke: 07 Ambient & Background ── */` (the end of the 06 bespoke block):

```css
.pv-audioviz{background:radial-gradient(80% 70% at 50% 100%,#1a1430,#08080c 70%);display:flex;align-items:flex-end;justify-content:center;gap:2.2%;padding:0 9% 12%;overflow:hidden}
.pv-audioviz i{flex:1;height:68%;border-radius:2px 2px 0 0;background:linear-gradient(0deg,#ff5f6d,#ffc371);transform-origin:50% 100%;transform:scaleY(.15);
  animation:audioviz-bar .6s cubic-bezier(.2,.6,.4,1) infinite}
@keyframes audioviz-bar{0%{transform:scaleY(var(--hi,.9))}100%{transform:scaleY(.12)}}
```

(b) insert this line right after the line that starts with `case 'izoom':`:

```js
    case 'audioviz': return [[.95,.6,0],[.9,.6,0],[.82,.6,0],[.7,.6,0],[.55,.45,-.1],[.62,.9,-.3],[.5,.3,-.05],[.58,1.2,-.4],[.45,.45,-.2],[.4,.3,-.15],[.5,.6,-.3],[.35,.3,0]].map(([h,d,o])=>'<i class="anim" style="--hi:'+h+';animation-duration:'+d+'s;animation-delay:'+o+'s"></i>').join('');
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L7 || exit 1
grep -c "pv-audioviz" index.html; grep -c "case 'audioviz':" index.html
```

Expected: a number above 1 (the preview's CSS rules), then `1` (its case).

- [ ] **Step 5: Write the generated files, then the tests pass**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L7 || exit 1
node tools/update-sitemap.mjs && node tools/make-skill.mjs
node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)"
```

Expected: `ℹ fail 0` (this plan's run of every lane on a copy of `feat/ten-animations` at `ece2689`, the finder and Famous effects there, gave it: 1717 pass). If only `tests/finder.test.js` fails (its case 9 waits for Task 11 when the finder has changed since), note the failing lines in your report for Task 11 (lanes never change `tests/`) and go on; any other failure names what to fix in this lane's files.

- [ ] **Step 6: Prove the phone default test for Task 11, then put the test file back**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L7 || exit 1
sed -i "s/const PHONE_DEFAULTS = { /const PHONE_DEFAULTS = { 'audio-visualizer': ['bars-seg', 'Some'], /" tests/pages.test.js
grep -c "'audio-visualizer'" tests/pages.test.js
node --test tests/pages.test.js 2>&1 | grep -E "data-hb-phone|^ℹ (pass|fail)"
git checkout -- tests/pages.test.js && git status --short tests/
```

Expected: `1` (the entry is in), then `✔ a setting that starts lower on phones marks that choice data-hb-phone, and the page script starts there from the mark` and `ℹ fail 0`, then nothing (the file is back as it was). If the grep prints `0`, the list's last entry changed since this plan: add `'audio-visualizer': ['bars-seg', 'Some']` in `PHONE_DEFAULTS` by hand, run, and put the file back the same way.

- [ ] **Step 7: The page check and the short screens (each a background command, waited on)**

The coordinator's server for this lane answers on port 8967: `curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8967/` prints `200` (if not, ask the coordinator). The review kit finds pages under its own folder's root, so it runs from a copy in the worktree (`.superpowers/` is ignored by git):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit
cd $REPO/.claude/worktrees/ten-L7 || exit 1
mkdir -p .superpowers/sdd/kit/review-kit $TEN/checks/L7 && cp $KIT/record.mjs $KIT/kit-lib.mjs .superpowers/sdd/kit/review-kit/ && git status --short | grep -c superpowers
```

Expected: `0` (git does not see the copy). Then start these two, each as its own background command (the round number `1`, then `2`, `3` after fixes):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L7 || exit 1
node $RUN/slot.mjs run ten-L7 -- node tools/check-pages.mjs --base http://127.0.0.1:8967 --out $TEN/checks/L7/1 animations/06-3d-advanced/audio-visualizer home > $TEN/checks/L7/1.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L7/1.log
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L7 || exit 1
node $RUN/slot.mjs run ten-L7 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8967 --short --out $TEN/checks/L7/short-1 animations/06-3d-advanced/audio-visualizer > $TEN/checks/L7/short-1.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L7/short-1.log
```

Wait on each with `node $RUN/wait-log.mjs $TEN/checks/L7/1.log` and `… short-1.log` (again while it says `still running`), then: `grep -c '^ok' $TEN/checks/L7/1.log; grep '^FAIL' $TEN/checks/L7/1.log; tail -2 $TEN/checks/L7/short-1.log`.

Expected: `12` (six `ok` lines each for `audio-visualizer`, the home page), no `FAIL` line, and `27 short-screen pictures checked, 0 with labels cut or overlapping, 0 skipped, 0 failed` with `EXIT=0` (this plan's runs gave exactly these). A `FAIL` line or a cut or overlapping label names the problem (the real branch may differ from the copy this plan was checked on; the ledger's first line says how): fix it in this lane's files, keeping the page's behavior, and run both again as round 2, 3; every round after a change ends with all lines `ok`.

- [ ] **Step 8: Every choice in Try it, in both views (acceptance 7), and the motion in clips**

Two background commands. The first runs the kit's gallery (pictures only: Normal, See inside and Compare at 1280 and 375) once with the defaults (`press-0`) and once for each choice that is not a default and each switch in Try it (never Loop, Slow motion, Pause or Play: playback is not a setting), each into its own folder. The second records the clips (Normal, See inside and Compare at 1280, about seven seconds each, frames kept) with the defaults (`clip-0`) and for each choice of the settings that change only timing or show only while the demo moves (G1, G11): the stills never show a run's middle.

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L7 || exit 1
i=0; for sel in "" "#style-seg [data-style='wave']" "#style-seg [data-style='circle']" "#bars-seg [data-n='16']" "#bars-seg [data-n='32']" "#bars-seg [data-n='64']" "#fall-seg [data-fall='2.6']" "#fall-seg [data-fall='0.45']" "#colors-seg [data-pal='ocean']" "#colors-seg [data-pal='neon']" "#peak-tog"; do echo "== press-$i ${sel:-defaults}"; node $RUN/slot.mjs run ten-L7 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8967 --gallery ${sel:+--press "$sel"} --out $TEN/checks/L7/press-$i animations/06-3d-advanced/audio-visualizer || echo "run $i failed"; i=$((i+1)); done > $TEN/checks/L7/press.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L7/press.log
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L7 || exit 1
i=0; for sel in "" "#fall-seg [data-fall='2.6']" "#fall-seg [data-fall='0.45']"; do echo "== clip-$i ${sel:-defaults}"; node $RUN/slot.mjs run ten-L7 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8967 --only clips --keep-frames ${sel:+--press "$sel"} --out $TEN/checks/L7/clip-$i animations/06-3d-advanced/audio-visualizer || echo "run $i failed"; i=$((i+1)); done > $TEN/checks/L7/clips.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L7/clips.log
```

Wait on each log with `node $RUN/wait-log.mjs`. Expected: 11 `== press-…` lines, each run ending `done  6 pictures, 0 clips and 0 comparisons made, 0 skipped, 0 failed`, and 3 `== clip-…` lines, each ending `done  0 pictures, 3 clips and 0 comparisons made, 0 skipped, 0 failed`; no `failed` line, no `was not found`, `EXIT=0` (the kit's lines as this plan's runs printed them). Read each gallery's See inside and Compare pictures at 1280 beside `press-0`'s: each choice visibly changes Normal and both views. Read three frames from the middle of each See inside and Compare clip (the log's `frames kept in <folder>` lines name the folders; for a timing choice, the same frames beside `clip-0`'s): the views move as the spec says, nothing jumps or covers the stage in mid-run (this plan's clips found See inside's small copy filling Pixelate Transition's stage while the blocks were small, a fault no still showed). A choice that changes nothing in a view is a fix (the owner's rule: every setting and control visibly changes the stage and both views). Then remove the frame folders: `grep -o 'frames kept in .*' $TEN/checks/L7/clips.log | sed 's/^frames kept in //' | while read -r f; do rm -rf "$f"; done`.

- [ ] **Step 9: Look at the screenshots and check by hand**

Open `$TEN/checks/L7/<round>/06-audio-visualizer-{desktop,phone,phone-reduced}-{inside,compare}.png`, the Normal ones and the short screens' pictures: both views read as the spec says, no label covers another or the part it names, nothing overflows at 320. Then, in the served page (a headless run through the pool, or by reading the code where a run cannot show it):

- The page is silent until Hear it is pressed: no sound and no console warning before; the browser makes no AudioContext until the press. Hear it then plays the beat and the bars follow the analyser; it is a toggle that keeps its name, pressed while the sound plays.
- Pause stops the bars and the sound at once; Play brings both back; a hidden tab suspends the sound; Slow motion plays the tune at a third of the tempo; Hear it pressed while paused presses Play first.
- Number of bars starts at Many on larger screens and Some on phones (the choice marked `data-hb-phone`), and every choice draws its own number at every size (each row of Compare holds half of it on phones); every setting changes Normal and both views.
- See inside's Bass · Middle · Treble scale shows only with Bars; with Circle the inside note says kick and bass at the top, round to the hi-hats; the step numbers, chips, pressed buttons and Hear it use 06's accent, `#3fd6c4`.
- Under reduced motion the loop starts paused and every view is a still from the paused state; the notes say "Shown still" only while it is paused, and after Play they describe what moves (lesson 16).

Decisions already made in this page (keep them; a reviewer weighs them): Hear it pressed while paused presses Play first: the sound follows Pause. The legend has five parts (Snare added beside Kick, Bass, Melody and Hi-hats). The bars are copied from a one-pixel gradient strip and See inside draws one path per color, so the frames stay near 16.7 ms.

- [ ] **Step 10: Frame times (required: a canvas or mask page)**

One background command, waited on with `wait-log.mjs`:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L7 || exit 1
(node $RUN/slot.mjs run ten-L7 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8967 --modes normal,inside,compare animations/06-3d-advanced/audio-visualizer; node $RUN/slot.mjs run ten-L7 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8967 --phone --modes normal,inside,compare animations/06-3d-advanced/audio-visualizer; node $RUN/slot.mjs run ten-L7 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8967 animations/07-ambient-background/starfield; node $RUN/slot.mjs run ten-L7 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8967 --phone animations/07-ambient-background/starfield) > $TEN/checks/L7/frames.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L7/frames.log
```

Expected: a median of 16.7 ms in every mode at both sizes, and no larger share of frames slower than 20 ms than Starfield / Space Particles measured the same way, within a few points (the machine's other work moves these numbers; run again when one looks off). This plan's runs: desktop 1 to 4 / 0 to 4 / 3 to 10%, phone 0 / 0 / 0%; Starfield / Space Particles 1% on a desktop and 16% on a phone. A page that misses lightens its per-frame work (a smaller grid, fewer dots, less drawn per frame) until it meets this, and says what it changed.

- [ ] **Step 11: Commit, and the build report**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L7 || exit 1
[ "$(git rev-parse --abbrev-ref HEAD)" = ten/L7 ] || exit 1
git add -A && git status --short
git commit -m "feat: 06.28 Audio Visualizer, with See inside and Compare from the start (lane 7)"
git log --oneline -1
```

Expected before the commit: `A  animations/06-3d-advanced/audio-visualizer/README.md`, `A  animations/06-3d-advanced/audio-visualizer/index.html`, `M  .github/ISSUE_TEMPLATE/config.yml`, `M  404.html`, `M  README.md`, `M  animations/06-3d-advanced/README.md`, `M  index.html`, `M  llms.txt`, `M  sitemap.xml` and the changed files under `skills/animation-handbook/`; nothing else (the kit's copy is ignored; logs and pictures are in `$TEN`). Then write `$TEN/reports/L7/build.md`: first line `RESULT: built <commit>`, then the line count, the page check's `ok` count and its round, the short screens' last line, the galleries and clips looked at (one line per choice: what changes in each view; one line per clip: what moves), the tests' pass and fail line, the frame times, the hand checks' results, every place the page departs from the spec or this task and why, and any shared-file need (the coordinator appends it to `$RUN/shared-wishes.md`; there should be none). Reply to the coordinator in at most three lines.

- [ ] **Step 12: Review, at most three fix rounds**

The coordinator dispatches a reviewer (strongest model, never the builder) with: the spec's section, this task, the builder's report, `git -C $REPO diff feat/ten-animations...ten/L7`, the newest check round and its screenshots, the short screens, the galleries, the clips and the frame times. The reviewer reads CLAUDE.md, the Global Constraints, `$RUN/lessons.md`, `$RUN/briefs/RULINGS.md`, `$RUN/brief-rulings.md`, `$RUN/briefs/OPEN-QUESTIONS.md` and, once it holds the owner's verdict, `$RUN/rulings-159.md`, and checks the diff against them, the rollout's acceptance list (section 1 of the rollout spec), the spec's section and the per-frame work, looking hard at nothing of Web Audio before the press; Pause and the hidden tab suspend the sound; the phone default read from `#bars-seg [data-hb-phone]`. It writes `$TEN/reports/L7/review-<k>.md`: first line `RESULT: approved` or `RESULT: changes <count>`, then numbered findings (Critical, Important, Minor), and replies in at most three lines. Each fix round: the builder fixes, runs Steps 5 and 7 again (and the galleries, clips or frame times a fix touches), commits `fix: Audio Visualizer: <what>` after the branch check, writes `$TEN/reports/L7/fix-<k>.md` (`RESULT: built <commit>`), and the reviewer re-reviews only the fix. After three rounds the coordinator steps in. When approved, the coordinator stops the lane's server and adds the ledger line `<date time>  L7  approved at <commit>; check rounds <k>; frames <numbers>; departures: <none or a list>; reports reports/L7/`.

---

### Task 8: L8 · 07.24 Ken Burns Effect (`ten/L8`, port 8968)

Loop · step 1 "Watch it" · player bar: Pause (`data-hb-pause="css"`) and Slow motion (`data-hb-slowmo="css"`). See inside: the whole photo still, with the visible frame gliding from its dashed start frame to its dashed end frame. Compare: "Still photos" (a plain fading slideshow) beside "Zoom and pan". Spec: "8 · Ken Burns Effect (07.24)" in `docs/superpowers/specs/2026-10-13-ten-new-animations-design.md`.

**Files:**
- Create: `animations/07-ambient-background/ken-burns/index.html` (323 lines), `animations/07-ambient-background/ken-burns/README.md`
- Modify (by `$TEN/lanes.mjs 8`): `index.html` (the card after Game of Life's, the `PV` key, the `PLACES` row, the `FIND` row (the finder is on the branch), every count 166 → 167), `README.md` (counts, 07's count 23 → 24, the catalog line), `animations/07-ambient-background/README.md` (its line and its Implementation summary row), `.github/ISSUE_TEMPLATE/config.yml`, `404.html`, `animations/07-ambient-background/game-of-life/index.html` (its first Next link, to Ken Burns Effect)
- Modify (Step 4, by hand): `index.html`: the preview's CSS at the end of the 07 bespoke block, `case 'kenburns':` in `pvMarkup()`
- Regenerate: `sitemap.xml`, `llms.txt`, `skills/animation-handbook/` (their tools)
- Test: `tests/*.test.js`; the page check of the new page, of Game of Life and of the home page; the review kit's short screens, a gallery for the defaults and for each other choice in Try it, clips of the defaults and of the timing settings' choices
- Write (run folder): `$TEN/checks/L8/` (logs, screenshots, kit output), `$TEN/reports/L8/build.md`, `fix-<k>.md`; the reviewer `review-<k>.md`

**Interfaces:**
- Consumes: Task 0's worktree `.claude/worktrees/ten-L8` on `ten/L8`, its server on port 8968 (started and stopped by the coordinator), `$TEN/lanes.mjs`, the shared-file version N in the ledger; Phase 0's shared files, its mode press (the shared script presses nothing on a loop after See inside or Compare) and its page check; the rollout's review kit and wait tool.
- Produces: branch `ten/L8`: the card `['ken-burns','Ken Burns Effect','Photos slowly zoom and pan, then fade into the next. Best for hero slideshows.']` (07.24), `PV` key `'ken-burns':'kenburns'`, `PLACES` `['imgcard','bg','intro']`, `FIND` `'ken-burns':['card background','loop load','grow slide fade']`; Previous: Game of Life (final), and Game of Life's Next link to Ken Burns Effect; no Next link yet. The reports in `$TEN/reports/L8/`, which the rollout's final review (part 9) reads too.

- [ ] **Step 1: The lane's shared edits (the failing tests)**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L8 || exit 1
node $TEN/lanes.mjs 8 .
git status --short
node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)" | head -10
```

Expected: `lane 8 shared edits applied to .`; then ` M .github/ISSUE_TEMPLATE/config.yml`, ` M 404.html`, ` M README.md`, ` M animations/07-ambient-background/README.md`, ` M animations/07-ambient-background/game-of-life/index.html`, ` M index.html`; then these 7 failing tests and `ℹ fail 7`: `✖ make-famous: on the real home page every card builds, but the eight whose previews need a script or animate in SVG`, `✖ the answers keep the rules every page of a kind shares: transitions answer newpage, loops loop, scroll pages scroll`, `✖ 07-ambient-background/game-of-life uses the guided-steps page correctly`, `✖ the Full catalog in the root README lists every card once, in home order, linked to its live page`, `✖ the counts written in the issue template, the 404 page and the sitemap match the cards`, `✖ the skill and llms.txt are what tools/make-skill.mjs writes from the pages and the home page now`, `✖ llms.txt lists every card once, in the order of CATS, with its live address and its description, and links the skill files`. (Famous effects' test builds every card's preview, which Step 4 adds; the finder's reads each page's kind, and Game of Life's new Next link opens a page that is not there yet; this plan's run of every lane on a copy of `feat/ten-animations` at `ece2689`, the finder and Famous effects there, gave exactly these.) If `lanes.mjs` stops with `not found (…)`, stop and tell the coordinator, who alone edits `$TEN/lanes.mjs`; before running it again, put the worktree back with `git checkout -- .` (this step makes no other changes; the tool refuses a second run on a changed tree).

- [ ] **Step 2: Write the page: `animations/07-ambient-background/ken-burns/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ken Burns Effect — Animation Handbook</title>
  <meta name="description" content="Photos slowly zoom and pan, then fade into the next. Best for hero slideshows.">
  <link rel="canonical" href="https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/ken-burns/">
  <link rel="icon" type="image/png" sizes="96x96" href="../../../favicon.png">
  <link rel="icon" type="image/svg+xml" href="../../../favicon.svg">
  <link rel="apple-touch-icon" href="../../../apple-touch-icon.png">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Animation Handbook">
  <meta property="og:title" content="Ken Burns Effect — Animation Handbook">
  <meta property="og:description" content="Photos slowly zoom and pan, then fade into the next. Best for hero slideshows.">
  <meta property="og:url" content="https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/ken-burns/">
  <meta property="og:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Ken Burns Effect — Animation Handbook">
  <meta name="twitter:description" content="Photos slowly zoom and pan, then fade into the next. Best for hero slideshows.">
  <meta name="twitter:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <script type="application/ld+json">{"@context": "https://schema.org", "@type": "TechArticle", "headline": "Ken Burns Effect", "name": "Ken Burns Effect", "description": "Photos slowly zoom and pan, then fade into the next. Best for hero slideshows.", "url": "https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/ken-burns/", "inLanguage": "en", "articleSection": "Ambient & Background", "isPartOf": {"@type": "WebSite", "name": "Animation Handbook", "url": "https://matinmonshizadeh.github.io/animation-handbook/"}, "author": {"@type": "Person", "name": "matinmonshizadeh"}, "keywords": "web animation, CSS animation, Ambient & Background, Ken Burns Effect"}</script>
  <style>
    :root{--ui-accent:#ffce5a}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    /* --T: the time on each photo; --Z: the strongest zoom, the size each photo is drawn at so it is only ever scaled down */
    .stage{position:relative;overflow:hidden;background:#07080b;--T:7s;--Z:1.5}
    /* A reel of three slides. Each slide runs one timeline of three photos' length: it fades in over the one before (on top,
       z-index 2) for a seventh of its time, shows, lets the next fade in over it (z-index 1) and is hidden until its turn.
       Its photo moves from --from to --to over the whole time it shows, so the motion never stops. */
    .reel{position:absolute;inset:0;overflow:hidden;isolation:isolate}
    .slide{position:absolute;inset:0;opacity:0;animation:kb-fade calc(var(--T)*3) linear infinite;animation-delay:var(--d)}
    .s1{--d:calc(var(--T)*-.15)}.s2{--d:calc(var(--T)*.85)}.s3{--d:calc(var(--T)*1.85)}
    .photo{position:absolute;left:0;top:0;width:calc(100%*var(--Z));height:calc(100%*var(--Z));transform-origin:0 0;
      animation:kb-move calc(var(--T)*3) linear infinite;animation-delay:var(--d)}
    .photo svg,.fit svg{display:block;width:100%;height:100%}
    @keyframes kb-fade{0%{opacity:0;z-index:2}4.76%{opacity:1}33.33%{z-index:2}33.34%{z-index:1}38.1%{opacity:1}38.11%,100%{opacity:0;z-index:1}}
    @keyframes kb-move{0%{transform:var(--from)}38.1%,100%{transform:var(--to)}}
    .cap{display:none;position:absolute;left:14px;bottom:12px;padding:6px 12px;border-radius:8px;background:rgba(7,8,11,.62);
      color:#fff;font:600 clamp(13px,1.6vw,16px)/1.3 var(--hb-font)}
    .stage.caps .cap{display:block}
    /* See inside and Compare. Labels are plain words on a dark backing. */
    .fit,.in-part,.half{display:none}
    .kb-lbl{position:absolute;z-index:3;padding:3px 8px;border-radius:6px;background:rgba(7,8,11,.9);color:#f4f4f2;
      font:600 13px/1.25 var(--hb-font);white-space:nowrap;pointer-events:none}
    /* See inside: the whole photo held still and dimmed, and over it the frame the visitor sees, gliding from the dashed start
       frame to the dashed end frame along the arrow. The frame's timeline is the photo's turned inside out, from the same
       numbers (--ffrom, --fto). The moving parts stay rendered in every mode (hidden, not removed), so they keep time. */
    .stage[data-hb-mode="inside"] .photo{visibility:hidden}
    .stage[data-hb-mode="inside"] .fit{display:block;position:absolute;inset:0}
    .in-part{display:block;visibility:hidden;position:absolute;left:0;top:0;width:100%;height:100%;transform-origin:0 0;pointer-events:none}
    .stage[data-hb-mode="inside"] .in-part{visibility:visible}
    .frame{outline:3px solid #fff;box-shadow:0 0 0 3000px rgba(5,6,9,.6);animation:kb-frame calc(var(--T)*3) linear infinite;animation-delay:var(--d)}
    .fs,.fe{outline:2px dashed rgba(255,255,255,.9);outline-offset:-1px}
    .fs{transform:var(--ffrom)}.fe{transform:var(--fto)}
    .fl{animation:kb-fl calc(var(--T)*3) linear infinite;animation-delay:var(--d)}
    .fl .tags{position:absolute;inset:0}
    .fl .kb-lbl{left:0;top:14px;transform:translateX(-50%)}
    .tags{animation:kb-tags calc(var(--T)*3) linear infinite;animation-delay:var(--d)}
    .le{transform:translateX(-100%)}
    .arrow{overflow:visible}
    .arrow path{fill:none;stroke:var(--ui-accent);stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
    @keyframes kb-frame{0%{transform:var(--ffrom)}38.1%,100%{transform:var(--fto)}}
    @keyframes kb-fl{0%{transform:var(--lfrom)}38.1%,100%{transform:var(--lto)}}
    /* A slide's labels show only while it is the photo on top, never while the next fades in over it */
    @keyframes kb-tags{0%,4.76%{opacity:0}4.77%,38.1%{opacity:1}38.11%,100%{opacity:0}}
    /* Compare: on the left a copy whose photos never move, only fade; on the right the reel itself. The copy stays rendered,
       unseen, in the other modes, so its fades keep time with the reel's. */
    .copy{visibility:hidden}
    .copy .photo{animation:none;transform:var(--from)}
    .stage[data-hb-mode="compare"] .copy{visibility:visible;right:50%;border-right:2px solid #07080b}
    .stage[data-hb-mode="compare"] .reel:not(.copy){left:50%}
    .stage[data-hb-mode="compare"] .half{display:block}
    .half{top:10px}.half.first{left:10px}.half.second{left:calc(50% + 10px)}
    @media(max-width:360px){
      .stage[data-hb-mode="compare"] .copy{right:0;bottom:50%;border-right:0;border-bottom:2px solid #07080b}
      .stage[data-hb-mode="compare"] .reel:not(.copy){left:0;top:50%}
      .half.second{left:10px;top:calc(50% + 10px)}
    }
    /* Under reduced motion each photo holds the end of its move and the photos only fade; the frame waits at the end too. The
       loop starts paused with the first photo shown a second and a half before the next fades in, so Play soon shows a fade. */
    @media(prefers-reduced-motion:reduce){
      .s1{--d:calc(var(--T)*-1 + 1.5s)}.s2{--d:1.5s}.s3{--d:calc(var(--T) + 1.5s)}
      .photo{animation:none;transform:var(--to)}
      .frame{animation:none;transform:var(--fto)}
      .fl{animation:none;transform:var(--lto)}
    }
  </style>
  <link rel="stylesheet" href="../../../assets/css/demo-page.css?v=10">
  <script src="../../../assets/js/demo-page.js?v=10" defer></script>
</head>
<body class="hb" data-hb-kind="loop">
<nav class="hb-bar" aria-label="Animation Handbook">
  <a class="hb-home" href="../../../"><svg class="hb-mark" viewBox="0 0 32 32" aria-hidden="true"><g class="g"><circle cx="11.16" cy="20.84" r="6.1"/><circle cx="15.12" cy="16.88" r="6.1"/><circle cx="18.51" cy="13.49" r="6.1"/></g><circle class="b" cx="21.2" cy="10.8" r="6.6"/></svg><span>Animation Handbook</span></a>
  <span class="hb-pager"><a href="../game-of-life/" rel="prev" aria-label="Previous: Game of Life"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg><span><span class="hb-dir">Previous: </span>Game of Life</span></a></span>
  <a class="hb-star" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener" aria-label="Star on GitHub"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg><span>Star on GitHub</span></a>
</nav>
<main class="hb-page">
  <header class="hb-head">
    <p class="hb-cat">07.24 · Ambient &amp; Background</p>
    <h1>Ken Burns Effect</h1>
    <p class="hb-lede">Photos slowly zoom and pan, then fade into the next. Best for hero slideshows.</p>
  </header>

  <section class="hb-step hb-watch" aria-labelledby="hb-watch-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">1</span>
      <div><h2 id="hb-watch-title">Watch it</h2><p>It moves by itself. Pause it, or turn on slow motion to follow each drift.</p></div>
    </div>
    <div class="seg hb-modes" role="group" aria-label="What the box shows" data-hb-modes>
      <button type="button" data-hb-mode="normal" class="on" aria-pressed="true">Normal</button>
      <button type="button" data-hb-mode="inside" aria-pressed="false">See inside</button>
      <button type="button" data-hb-mode="compare" aria-pressed="false">Compare</button>
    </div>
    <div class="stage" id="stage" role="img" aria-label="Three drawn photos, each slowly zooming and drifting, then fading into the next"></div>
    <div class="hb-player">
      <button class="hb-play" type="button" id="btn-pause" data-hb-pause="css" data-state="playing"><svg class="hb-ic hb-i-pause" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg><svg class="hb-ic hb-i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3l14 9-14 9z"/></svg><span class="hb-pause-label">Pause</span></button>
      <label class="hb-toggle"><input class="hb-switch" type="checkbox" role="switch" id="slow-tog" data-hb-slowmo="css" autocomplete="off"><span>Slow motion</span></label>
    </div>
    <div class="hb-mode-notes" aria-live="polite">
      <p data-hb-for="inside" hidden>Inside, the whole photo stays still and the bright frame is what the visitor sees: it glides from the dashed start frame to the dashed end frame, then the next photo fades in.</p>
      <p data-hb-for="compare" hidden>Still photos only fade from one to the next, like a plain slideshow. Zoom and pan drifts and zooms each photo as it fades, so still pictures feel alive.</p>
    </div>
  </section>

  <section class="hb-step hb-try" aria-labelledby="hb-try-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">2</span>
      <div><h2 id="hb-try-title">Try it</h2><p>Change a setting and see the difference as it moves.</p></div>
    </div>
    <div class="hb-settings">
      <div class="hb-setting">
        <p class="hb-setting-name" id="zoom-lbl">Which way it zooms</p>
        <div class="seg" id="zoom-seg" role="group" aria-labelledby="zoom-lbl">
          <button type="button" data-zoom="in" aria-pressed="false">In</button>
          <button type="button" data-zoom="out" aria-pressed="false">Out</button>
          <button type="button" data-zoom="both" class="on" aria-pressed="true">Both</button>
        </div>
        <p class="hb-hint">Both changes direction from photo to photo.</p>
      </div>
      <div class="hb-setting">
        <p class="hb-setting-name" id="move-lbl">How much it moves</p>
        <div class="seg" id="move-seg" role="group" aria-labelledby="move-lbl">
          <button type="button" data-move="subtle" aria-pressed="false">Subtle</button>
          <button type="button" data-move="medium" class="on" aria-pressed="true">Medium</button>
          <button type="button" data-move="strong" aria-pressed="false">Strong</button>
        </div>
        <p class="hb-hint">Subtle feels calm; strong feels like film.</p>
      </div>
      <div class="hb-setting">
        <p class="hb-setting-name" id="time-lbl">Time on each photo</p>
        <div class="seg" id="time-seg" role="group" aria-labelledby="time-lbl">
          <button type="button" data-time="5" aria-pressed="false">Short</button>
          <button type="button" data-time="7" class="on" aria-pressed="true">Medium</button>
          <button type="button" data-time="10" aria-pressed="false">Long</button>
        </div>
        <p class="hb-hint">Longer is calmer.</p>
      </div>
    </div>
    <details class="hb-options">
      <summary><span class="hb-more-label">More options</span><span class="hb-less">Fewer options</span><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary>
      <div class="hb-settings">
        <div class="hb-setting">
          <label class="hb-switch-row"><span>Shows a caption</span><input class="hb-switch" type="checkbox" role="switch" id="cap-tog" autocomplete="off"></label>
          <p class="hb-hint">The caption stays still while the photo moves.</p>
        </div>
      </div>
    </details>
  </section>

  <section class="hb-step hb-prompt-step" aria-labelledby="hb-prompt-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">3</span>
      <div><h2 id="hb-prompt-title">Copy the prompt</h2><p>Paste it into an AI assistant such as ChatGPT, Claude or Cursor to build this in your own project.</p></div>
    </div>
    <div class="hb-card">
      <p class="hb-prompt">Add a Ken Burns effect to [your hero photo or slideshow]. Slowly zoom and pan each photo, the way a documentary camera moves over a still print, and crossfade to the next photo before its move ends, so the motion never stops. Give each photo its own start and end framing that drifts toward a point of interest, at an even, unhurried pace. Keep the photo larger than its frame at every moment so no edge ever shows, move it with transforms only, and keep any text on top still and readable. If the visitor has reduced motion turned on, show each photo still and change photos with a slow fade. Match the settings listed below.</p>
      <div class="hb-chips-box" hidden>
        <p class="hb-chips-title">Your settings</p>
        <ul class="hb-chips"></ul>
      </div>
      <div class="hb-copy-row">
        <button class="hb-copy" type="button"><svg class="hb-ic hb-i-copy" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><svg class="hb-ic hb-i-done" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span class="hb-copy-label" aria-live="polite">Copy prompt</span></button>
        <p class="hb-hint">Replace the words in brackets with your own element. Your settings are added at the end.</p>
      </div>
    </div>
    <div class="hb-star-row"><p>Free and open source. If this helped, a star on GitHub helps other people find it.</p><a class="hb-star-btn" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>Star on GitHub</a></div>
  </section>

  <section class="hb-about" aria-labelledby="hb-what-title">
    <div class="hb-what">
      <h2 id="hb-what-title">What it is</h2>
      <div class="hb-what-text"><p>The full explanation is in <a href="README.md">README.md</a>.</p></div>
    </div>
    <div class="hb-fit">
      <h2>Good for</h2>
      <ul class="hb-tags hb-good"><li>Hero photos</li><li>Slideshows</li><li>Travel and property sites</li><li>Story pages</li></ul>
      <h3>Avoid on</h3>
      <ul class="hb-tags hb-avoid"><li>Product photos people inspect</li><li>Pictures of text</li></ul>
    </div>
  </section>

  <section class="hb-related" aria-labelledby="hb-related-title" hidden>
    <h2 id="hb-related-title">Similar animations</h2>
    <div class="hb-rel-list"></div>
  </section>
</main>
<footer class="hb-foot"><span>Animation Handbook</span><a href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener">Source on GitHub</a><a href="#top">Back to top ↑</a></footer>
<script>
  const stage=document.getElementById('stage');
  const ZMAX=1.5; // the strongest zoom: each photo is drawn this much larger than the box and only ever scaled down from there
  // Three drawn photos (1600 by 1000, cropped to fill the box), each with where its move starts and its point of interest, as
  // shares of the photo's width and height. id keeps the gradients of each copy apart.
  const PHOTOS=[
    {name:'Ashfall Ridge at dawn',start:[.38,.62],poi:[.69,.48],svg:id=>`<defs><linearGradient id="a${id}" x2="0" y2="1"><stop offset="0" stop-color="#1b2a4a"/><stop offset=".45" stop-color="#8a5a86"/><stop offset=".62" stop-color="#f29a62"/><stop offset=".7" stop-color="#ffd38a"/></linearGradient><linearGradient id="b${id}" x2="0" y2="1"><stop offset="0" stop-color="#f3a46c"/><stop offset="1" stop-color="#2b2b44"/></linearGradient></defs>
      <rect width="1600" height="760" fill="url(#a${id})"/><circle cx="1100" cy="505" r="190" fill="#ffe6a8" opacity=".25"/><circle cx="1100" cy="505" r="74" fill="#fff4cf"/>
      <path fill="#8f7397" d="M0 640L180 520 330 590 520 450 700 560 860 470 1010 560 1200 430 1380 540 1600 470V760H0Z"/>
      <path fill="#4c4466" d="M0 700L240 600 420 660 640 560 820 650 1040 590 1260 660 1440 600 1600 640V780H0Z"/>
      <rect y="760" width="1600" height="240" fill="url(#b${id})"/><g fill="#ffe2a6" opacity=".75"><rect x="1010" y="790" width="180" height="6" rx="3"/><rect x="1040" y="820" width="120" height="5" rx="2.5"/><rect x="1068" y="848" width="64" height="4" rx="2"/></g>
      <path fill="#23233a" d="M0 780H1600V830Q1200 800 900 840T0 820Z"/><path fill="#1b1b2e" d="M120 790l26-90 26 90zM190 790l20-66 20 66zM1380 790l24-80 24 80zM1440 790l18-58 18 58z"/>`},
    {name:'Lantern Cove at dusk',start:[.34,.58],poi:[.76,.44],svg:id=>`<defs><linearGradient id="a${id}" x2="0" y2="1"><stop offset="0" stop-color="#271b48"/><stop offset=".5" stop-color="#b5527a"/><stop offset=".72" stop-color="#f7a55b"/></linearGradient><linearGradient id="b${id}" x2="0" y2="1"><stop offset="0" stop-color="#3b4b7a"/><stop offset="1" stop-color="#101a33"/></linearGradient></defs>
      <rect width="1600" height="720" fill="url(#a${id})"/><rect y="700" width="1600" height="300" fill="url(#b${id})"/>
      <path fill="#2a2440" d="M1060 760Q1140 640 1280 650T1500 760Z"/><path fill="#f1ece4" d="M1196 660L1214 420H1262L1280 660Z"/><path fill="#c8463f" d="M1206 590H1272L1268 540H1210ZM1213 490H1264L1262 455H1215Z"/>
      <rect x="1206" y="392" width="64" height="30" fill="#2a2440"/><circle cx="1238" cy="400" r="18" fill="#ffe7a0"/><circle cx="1238" cy="400" r="70" fill="#ffd27a" opacity=".22"/>
      <path fill="#1d1830" d="M0 600H90V560L130 530 170 560V600H230V540H330V610H420V580L470 550 520 580V700H0Z"/>
      <g fill="#ffd27a"><rect x="40" y="620" width="14" height="18"/><rect x="150" y="575" width="12" height="16"/><rect x="270" y="560" width="14" height="18"/><rect x="460" y="600" width="12" height="16"/></g>
      <path fill="#1d1830" d="M560 760H700L680 785H580ZM620 760V690L660 752Z"/><path fill="#ffd9a0" opacity=".55" d="M1180 720h120v6h-120zM1200 750h80v5h-80zM1218 780h44v4h-44z"/>`},
    {name:'Quellmarrow Road under the stars',start:[.56,.66],poi:[.5,.4],svg:id=>{let st='';for(let i=0;i<70;i++){const x=(i*397)%1600,y=(i*173)%560,r=(i%5?1.6:2.8);st+=`<circle cx="${x}" cy="${y}" r="${r}"/>`}
      return `<defs><linearGradient id="a${id}" x2="0" y2="1"><stop offset="0" stop-color="#050914"/><stop offset=".6" stop-color="#16285a"/><stop offset="1" stop-color="#4a3468"/></linearGradient></defs>
      <rect width="1600" height="640" fill="url(#a${id})"/><g fill="#f6f2ff" opacity=".85">${st}</g><circle cx="1220" cy="190" r="48" fill="#fff6d8"/><circle cx="1244" cy="176" r="44" fill="#0a1124"/>
      <path fill="#3a2a4a" d="M0 640L120 560H300L340 600H560L600 580H760L800 640Z"/><path fill="#30223e" d="M980 640L1040 540H1240L1290 600H1420L1470 560H1600V640Z"/>
      <rect y="630" width="1600" height="370" fill="#241a2c"/><path fill="#14101a" d="M520 1000L792 632H808L1080 1000Z"/>
      <path fill="#ffd27a" d="M798 650h4l3 30h-10zM795 720h10l5 60h-20zM790 840h20l8 100h-36z"/>`}}
  ];
  // How far each photo zooms (its zoom at the start and the end of a zoom in) and how far it drifts toward its point of interest
  const MOVES={subtle:{z:[1.04,1.16],k:.45},medium:{z:[1.06,1.3],k:.75},strong:{z:[1.08,1.5],k:1}};
  let zoom='both',move='medium';
  const LABELS={normal:'Three drawn photos, each slowly zooming and drifting, then fading into the next',
    inside:'The whole photo held still, with a bright frame gliding from where the view starts to where it ends',
    compare:'Two slideshows of the same photos: still photos that only fade, and photos that zoom and drift'};
  // Both reels are made in one go, so their timelines start together: the reel, with the frame, dashed frames, arrow and labels of
  // See inside in each slide, and Compare's copy, whose photos never move (no ids of its own, out of reach of the keyboard).
  const slideOf=(k,id,inside)=>`<div class="slide s${k+1}"><div class="photo"><svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">${PHOTOS[k].svg(id)}</svg></div>`+
    `<p class="cap">${PHOTOS[k].name}</p>`+(inside?`<div class="fit"><svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">${PHOTOS[k].svg('f'+id)}</svg></div>`+
    `<i class="in-part fs"></i><i class="in-part fe"></i><svg class="in-part arrow"><path/></svg><i class="in-part frame"></i>`+
    `<div class="in-part tags"><span class="kb-lbl ls" data-hb-caption>Start</span><span class="kb-lbl le" data-hb-caption>End</span></div>`+
    `<div class="in-part fl"><div class="tags"><span class="kb-lbl" data-hb-caption>Frame · what the visitor sees</span></div></div>`:'')+`</div>`;
  stage.innerHTML=`<div class="reel copy" inert aria-hidden="true">${PHOTOS.map((_,k)=>slideOf(k,'c'+k,false)).join('')}</div>`+
    `<div class="reel">${PHOTOS.map((_,k)=>slideOf(k,k,true)).join('')}</div>`+
    `<p class="kb-lbl half first" data-hb-caption>Still photos</p><p class="kb-lbl half second" data-hb-caption>Zoom and pan</p>`;
  const slides=[...stage.querySelectorAll('.reel:not(.copy) .slide')],copies=[...stage.querySelectorAll('.copy .slide')];
  // A framing: the zoom z and the point (x, y) of the photo at the middle of the box, kept far enough from the photo's edges that
  // the photo covers the box. The photo's transform shows that framing; the frame's is the same framing turned inside out: the
  // part of the whole photo that the box shows. Both are straight lines between two framings, so every moment between two that
  // cover the box covers it too.
  const fit=(z,[x,y])=>{const h=.5/z;return{z,x:Math.min(1-h,Math.max(h,x)),y:Math.min(1-h,Math.max(h,y))}};
  const pct=v=>(v*100).toFixed(3)+'%';
  const photoT=f=>`translate(${pct((.5-f.x*f.z)/ZMAX)},${pct((.5-f.y*f.z)/ZMAX)}) scale(${(f.z/ZMAX).toFixed(4)})`;
  const frameT=f=>`translate(${pct(f.x-.5/f.z)},${pct(f.y-.5/f.z)}) scale(${(1/f.z).toFixed(4)})`;
  const centerT=f=>`translate(${pct(f.x)},${pct(f.y)})`;
  // Each photo zooms in (or out, or every other one with Both) and drifts from its start toward its point of interest; zooming out
  // starts close on that point and pulls back
  function framings(k){
    const m=MOVES[move],p=PHOTOS[k],into=zoom==='in'||(zoom==='both'&&k!==1);
    const near=[p.start[0]+(p.poi[0]-p.start[0])*m.k,p.start[1]+(p.poi[1]-p.start[1])*m.k];
    return into?[fit(m.z[0],p.start),fit(m.z[1],near)]:[fit(m.z[1],near),fit(m.z[0],p.start)];
  }
  function apply(){
    slides.forEach((el,k)=>{
      const [a,b]=framings(k);
      for(const s of [el,copies[k]]){s.style.setProperty('--from',photoT(a));s.style.setProperty('--to',photoT(b))}
      el.style.setProperty('--ffrom',frameT(a));el.style.setProperty('--fto',frameT(b));
      el.style.setProperty('--lfrom',centerT(a));el.style.setProperty('--lto',centerT(b));
      // Start sits inside the start frame's top left corner and End inside the end frame's top right one; the moving frame's own
      // label rides just below its middle, so none of them meets another or the caption (the box's lower left corner)
      const ls=el.querySelector('.ls'),le=el.querySelector('.le');
      ls.style.left=`calc(${pct(a.x-.5/a.z)} + 8px)`;ls.style.top=`calc(${pct(a.y-.5/a.z)} + 8px)`;
      le.style.left=`calc(${pct(b.x+.5/b.z)} - 8px)`;le.style.top=`calc(${pct(b.y-.5/b.z)} + 8px)`;
      el.ab=[a,b];
    });
    drawArrows();
  }
  // The arrow from the middle of the start frame to the middle of the end frame, drawn in the box's own pixels
  function drawArrows(){
    const W=stage.clientWidth,H=stage.clientHeight;
    slides.forEach(el=>{
      const [a,b]=el.ab,svg=el.querySelector('.arrow'),x1=a.x*W,y1=a.y*H,x2=b.x*W,y2=b.y*H,ang=Math.atan2(y2-y1,x2-x1),h=10;
      svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
      svg.firstChild.setAttribute('d',Math.hypot(x2-x1,y2-y1)<4?'':`M${x1} ${y1}L${x2} ${y2}M${x2-h*Math.cos(ang-.5)} ${y2-h*Math.sin(ang-.5)}L${x2} ${y2}L${x2-h*Math.cos(ang+.5)} ${y2-h*Math.sin(ang+.5)}`);
    });
  }
  // The mode switch: the styles show the mode at once and every timeline keeps running (or stays paused); the picture is renamed
  document.addEventListener('hb:mode',e=>{stage.setAttribute('aria-label',LABELS[e.detail.mode])});
  // The notes say what the box shows: the markup's words, or under reduced motion a still while the loop is paused and, while it
  // plays, photos that only fade. Registered at the top level: the shared script sends hb:pause at once under reduced motion.
  const said={inside:document.querySelector('[data-hb-for="inside"]').textContent,compare:document.querySelector('[data-hb-for="compare"]').textContent};
  const REDUCED={still:{inside:'Shown still, at the end of the move: the bright frame is the part the visitor sees, and the dashed frames show where the view starts and ends.',
      compare:'Shown still: Still photos keeps the first view of the photo, while Zoom and pan has drifted and zoomed to the end of its move.'},
    playing:{inside:'Inside, the bright frame is the part the visitor sees, held at the end of its move, with dashed frames where it starts and ends. Under reduced motion the photos only fade.',
      compare:'Still photos keeps the first view of each photo, while Zoom and pan shows the end of each move. Under reduced motion both only fade from one photo to the next.'}};
  let paused=false;
  function notes(){
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    for(const k of ['inside','compare'])document.querySelector(`[data-hb-for="${k}"]`).textContent=reduced?REDUCED[paused?'still':'playing'][k]:said[k];
  }
  document.addEventListener('hb:pause',e=>{paused=e.detail.paused;notes()});
  notes();
  function choices(id,pick){
    const buttons=document.querySelectorAll('#'+id+' button');
    buttons.forEach(b=>b.addEventListener('click',()=>{
      buttons.forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',String(x===b))});
      pick(b.dataset);
    }));
  }
  choices('zoom-seg',d=>{zoom=d.zoom;apply()});
  choices('move-seg',d=>{move=d.move;apply()});
  choices('time-seg',d=>{stage.style.setProperty('--T',d.time+'s')});
  document.getElementById('cap-tog').addEventListener('change',e=>stage.classList.toggle('caps',e.target.checked));
  new ResizeObserver(drawArrows).observe(stage);
  apply();
</script>
</body>
</html>
```

Then give it the shared-file version the branch uses (the ledger's N; nothing changes when N is 10):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L8 || exit 1
N=$(grep -o 'shared files ?v=[0-9]*' $TEN/ledger.md | head -1 | grep -o '[0-9]*$')
sed -i "s/demo-page\.css?v=10/demo-page.css?v=$N/; s/demo-page\.js?v=10/demo-page.js?v=$N/" animations/07-ambient-background/ken-burns/index.html
grep -c "demo-page\.css?v=$N\|demo-page\.js?v=$N" animations/07-ambient-background/ken-burns/index.html
```

Expected: `2`.

- [ ] **Step 3: Write the README: `animations/07-ambient-background/ken-burns/README.md`**

````markdown
# Ken Burns Effect

[Live demo](https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/ken-burns/)

## What it is
The Ken Burns effect brings still photos to life by slowly zooming and panning across them, the way a documentary camera moves over a printed photograph. Each photo drifts toward something worth looking at, and the next one fades in before the move ends, so the picture never stops moving. It is named after the filmmaker who made the technique famous in his documentaries.

## When to use it
- Hero slideshows on travel, hotel and property sites
- Story and about pages that walk through a few photos
- Event and wedding pages with a handful of strong pictures
- Slow backgrounds behind a heading, where a still photo would feel flat

## How it works
Each photo is drawn larger than its frame (here one and a half times, the strongest zoom any setting uses) and is only ever scaled down from there, so it stays sharp. One CSS keyframe timeline per photo moves it from a start framing to an end framing with transforms only; the two framings are custom properties that the script works out from the settings:

```css
.slide { animation: kb-fade calc(var(--T) * 3) linear infinite; animation-delay: var(--d); }
.photo { width: calc(100% * var(--Z)); height: calc(100% * var(--Z)); transform-origin: 0 0;
  animation: kb-move calc(var(--T) * 3) linear infinite; animation-delay: var(--d); }
@keyframes kb-move { 0% { transform: var(--from); } 38.1%, 100% { transform: var(--to); } }
@keyframes kb-fade { 0% { opacity: 0; z-index: 2; } 4.76% { opacity: 1; } 33.33% { z-index: 2; } 33.34% { z-index: 1; }
  38.1% { opacity: 1; } 38.11%, 100% { opacity: 0; z-index: 1; } }
```

Three slides share one cycle three photos long, each starting a photo's time after the one before. A slide fades in on top of the previous one for a seventh of its time, shows, then stays underneath while the next one fades in over it, and is hidden until its turn comes again; its photo keeps moving the whole time it can be seen. A framing is a zoom and the point of the photo that sits in the middle of the frame. That point is kept far enough from the photo's edges that the photo always covers the frame, and because the transform moves in a straight line between two framings that both cover it, every moment in between covers it too:

```js
const fit = (z, [x, y]) => { const h = .5 / z; return { z, x: Math.min(1 - h, Math.max(h, x)), y: Math.min(1 - h, Math.max(h, y)) }; };
const photoT = f => `translate(${(.5 - f.x * f.z) / ZMAX * 100}%, ${(.5 - f.y * f.z) / ZMAX * 100}%) scale(${f.z / ZMAX})`;
```

Zooming in starts near the photo's middle and ends closer on its point of interest; zooming out does the reverse. Pause and Slow motion simply hold or slow every CSS animation in the box. Under reduced motion each photo holds the end of its move and the photos only fade from one to the next.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Which way it zooms | Both | In zooms every photo in, toward its point of interest; out starts close and pulls back; both zooms the first and third photos in and the second out |
| How much it moves | Medium | Subtle zooms from 1.04 to 1.16 times and drifts less than half of the way toward the point of interest; medium zooms from 1.06 to 1.3 times and drifts three quarters of the way; strong zooms from 1.08 to 1.5 times and drifts all the way |
| Time on each photo | Medium | Short is 5 seconds, medium 7 seconds and long 10 seconds; each fade takes a seventh of that, about a second at medium |
| Shows a caption | off | On, each photo's name sits in the lower left corner and stays still while the photo moves |

## Production notes
- **Draw big, scale down.** A browser draws a layer once and then scales it; scaling it up past the size it was drawn at makes it soft. Give the photo the size it reaches at the strongest zoom and scale it down from there, or use a picture with enough pixels for the closest framing.
- **Never let an edge show.** Keep the zoom above one and the framing's center at least half a frame away from the photo's edges, at both ends of the move.
- **Keep text still.** Put headings and captions in a layer of their own above the moving photo, never inside it, so they stay sharp and easy to read.
- **One timeline, many photos.** Driving every photo from the same cycle with its own delay keeps the fades and moves in step with no script running each frame; changing the time only changes one custom property.
- **Reduced motion.** Hold each photo still and change photos with a slow fade.
- **Library equivalents.** GSAP: `gsap.fromTo(photo, { scale: 1.06, xPercent: 0 }, { scale: 1.3, xPercent: -8, duration: 8, ease: "none" })` in a timeline that crossfades the slides. Framer Motion: animate `scale`, `x` and `y` on the photo with `transition={{ duration: 8, ease: "linear" }}` and wrap the slides in `AnimatePresence`.

## See also
- [Aurora / Northern Lights](../aurora/) — a calm loop made of CSS keyframes
- [Infinite Zoom](../../06-3d-advanced/infinite-zoom/) — an endless dive into pictures inside pictures
- [Zoom Into Image](../../01-scroll-based/zoom-into-image/) — a picture that opens up as you scroll
````

- [ ] **Step 4: The home page preview**

In the worktree's `index.html`: (a) insert these lines, and one empty line after them, right before the line `/* ── bespoke: added demos ── */` (the end of the 07 bespoke block):

```css
.pv-kenburns{background:#07080b;overflow:hidden}
.pv-kenburns i{position:absolute;inset:-12%;opacity:0;animation:kenburns-pv 10s linear infinite}
.pv-kenburns .p1{background:radial-gradient(circle at 68% 48%,#fff4cf 0 4%,#ffe6a855 7%,#0000 15%),linear-gradient(172deg,#0000 58%,#4c4466 58.5% 70%,#0000 70.5%),linear-gradient(#1b2a4a,#8a5a86 40%,#f29a62 58%,#ffd38a 64%,#2b2b44 65%);--a:translate(4%,3%) scale(1);--b:translate(-5%,-2%) scale(1.16)}
.pv-kenburns .p2{background:radial-gradient(circle at 74% 40%,#ffe7a0 0 2.5%,#ffd27a44 5%,#0000 11%),linear-gradient(90deg,#0000 71%,#f1ece4 71.5% 75%,#0000 75.5%),linear-gradient(#271b48,#b5527a 45%,#f7a55b 64%,#3b4b7a 65%,#101a33);animation-delay:-5s;--a:translate(-4%,-2%) scale(1.16);--b:translate(3%,2%) scale(1)}
@keyframes kenburns-pv{0%{opacity:0;transform:var(--a)}8%,50%{opacity:1}58%,100%{opacity:0;transform:var(--b)}}
```

(b) insert this line right before the line that starts with `case 'aurora':` (after the end of the `case 'life':` block):

```js
    case 'kenburns': return '<i class="p1 anim"></i><i class="p2 anim"></i>';
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L8 || exit 1
grep -c "pv-kenburns" index.html; grep -c "case 'kenburns':" index.html
```

Expected: a number above 1 (the preview's CSS rules), then `1` (its case).

- [ ] **Step 5: Write the generated files, then the tests pass**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L8 || exit 1
node tools/update-sitemap.mjs && node tools/make-skill.mjs
node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)"
```

Expected: `ℹ fail 0` (this plan's run of every lane on a copy of `feat/ten-animations` at `ece2689`, the finder and Famous effects there, gave it: 1717 pass). If only `tests/finder.test.js` fails (its case 9 waits for Task 11 when the finder has changed since), note the failing lines in your report for Task 11 (lanes never change `tests/`) and go on; any other failure names what to fix in this lane's files.

- [ ] **Step 6: The page check and the short screens (each a background command, waited on)**

The coordinator's server for this lane answers on port 8968: `curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8968/` prints `200` (if not, ask the coordinator). The review kit finds pages under its own folder's root, so it runs from a copy in the worktree (`.superpowers/` is ignored by git):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit
cd $REPO/.claude/worktrees/ten-L8 || exit 1
mkdir -p .superpowers/sdd/kit/review-kit $TEN/checks/L8 && cp $KIT/record.mjs $KIT/kit-lib.mjs .superpowers/sdd/kit/review-kit/ && git status --short | grep -c superpowers
```

Expected: `0` (git does not see the copy). Then start these two, each as its own background command (the round number `1`, then `2`, `3` after fixes):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L8 || exit 1
node $RUN/slot.mjs run ten-L8 -- node tools/check-pages.mjs --base http://127.0.0.1:8968 --out $TEN/checks/L8/1 animations/07-ambient-background/ken-burns animations/07-ambient-background/game-of-life home > $TEN/checks/L8/1.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L8/1.log
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L8 || exit 1
node $RUN/slot.mjs run ten-L8 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8968 --short --out $TEN/checks/L8/short-1 animations/07-ambient-background/ken-burns > $TEN/checks/L8/short-1.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L8/short-1.log
```

Wait on each with `node $RUN/wait-log.mjs $TEN/checks/L8/1.log` and `… short-1.log` (again while it says `still running`), then: `grep -c '^ok' $TEN/checks/L8/1.log; grep '^FAIL' $TEN/checks/L8/1.log; tail -2 $TEN/checks/L8/short-1.log`.

Expected: `18` (six `ok` lines each for `ken-burns`, `game-of-life`, the home page), no `FAIL` line, and `27 short-screen pictures checked, 0 with labels cut or overlapping, 0 skipped, 0 failed` with `EXIT=0` (this plan's runs gave exactly these). A `FAIL` line or a cut or overlapping label names the problem (the real branch may differ from the copy this plan was checked on; the ledger's first line says how): fix it in this lane's files, keeping the page's behavior, and run both again as round 2, 3; every round after a change ends with all lines `ok`.

- [ ] **Step 7: Every choice in Try it, in both views (acceptance 7), and the motion in clips**

Two background commands. The first runs the kit's gallery (pictures only: Normal, See inside and Compare at 1280 and 375) once with the defaults (`press-0`) and once for each choice that is not a default and each switch in Try it (never Loop, Slow motion, Pause or Play: playback is not a setting), each into its own folder. The second records the clips (Normal, See inside and Compare at 1280, about seven seconds each, frames kept) with the defaults (`clip-0`) and for each choice of the settings that change only timing or show only while the demo moves (G1, G11): the stills never show a run's middle.

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L8 || exit 1
i=0; for sel in "" "#zoom-seg [data-zoom='in']" "#zoom-seg [data-zoom='out']" "#move-seg [data-move='subtle']" "#move-seg [data-move='strong']" "#time-seg [data-time='5']" "#time-seg [data-time='10']" "#cap-tog"; do echo "== press-$i ${sel:-defaults}"; node $RUN/slot.mjs run ten-L8 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8968 --gallery ${sel:+--press "$sel"} --out $TEN/checks/L8/press-$i animations/07-ambient-background/ken-burns || echo "run $i failed"; i=$((i+1)); done > $TEN/checks/L8/press.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L8/press.log
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L8 || exit 1
i=0; for sel in "" "#time-seg [data-time='5']" "#time-seg [data-time='10']"; do echo "== clip-$i ${sel:-defaults}"; node $RUN/slot.mjs run ten-L8 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8968 --only clips --keep-frames ${sel:+--press "$sel"} --out $TEN/checks/L8/clip-$i animations/07-ambient-background/ken-burns || echo "run $i failed"; i=$((i+1)); done > $TEN/checks/L8/clips.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L8/clips.log
```

Wait on each log with `node $RUN/wait-log.mjs`. Expected: 8 `== press-…` lines, each run ending `done  6 pictures, 0 clips and 0 comparisons made, 0 skipped, 0 failed`, and 3 `== clip-…` lines, each ending `done  0 pictures, 3 clips and 0 comparisons made, 0 skipped, 0 failed`; no `failed` line, no `was not found`, `EXIT=0` (the kit's lines as this plan's runs printed them). Read each gallery's See inside and Compare pictures at 1280 beside `press-0`'s: each choice visibly changes Normal and both views. Read three frames from the middle of each See inside and Compare clip (the log's `frames kept in <folder>` lines name the folders; for a timing choice, the same frames beside `clip-0`'s): the views move as the spec says, nothing jumps or covers the stage in mid-run (this plan's clips found See inside's small copy filling Pixelate Transition's stage while the blocks were small, a fault no still showed). A choice that changes nothing in a view is a fix (the owner's rule: every setting and control visibly changes the stage and both views). Then remove the frame folders: `grep -o 'frames kept in .*' $TEN/checks/L8/clips.log | sed 's/^frames kept in //' | while read -r f; do rm -rf "$f"; done`.

- [ ] **Step 8: Look at the screenshots and check by hand**

Open `$TEN/checks/L8/<round>/07-ken-burns-{desktop,phone,phone-reduced}-{inside,compare}.png`, the Normal ones and the short screens' pictures: both views read as the spec says, no label covers another or the part it names, nothing overflows at 320. Then, in the served page (a headless run through the pool, or by reading the code where a run cannot show it):

- Each photo drifts and zooms slowly, then the next fades in; no edge of a photo shows at any moment of any setting (the photos are drawn at their largest size and only scaled down).
- Pause holds every photo, frame and fade where it is; Play goes on; Slow motion slows everything three times; going back to Normal while paused gives the first picture back.
- Every setting changes Normal and both views; under reduced motion the loop starts paused and Play fades within 1.5 s; Compare's still shows the start framing beside the end framing; after Play the notes say the photos only fade (lesson 16).
- The labels: Start at the start frame's top left, End at the end frame's top right, the moving label under the frame's middle; none overlaps at 320.

Decisions already made in this page (keep them; a reviewer weighs them): Under reduced motion the delays are shifted so a press of Play starts a fade within 1.5 s; Compare's still pairs the start framing with the end framing (no dashed start there). The notes never say left or right: the halves stack on phones.

- [ ] **Step 9: Frame times (optional: a page moved by transforms)**

One background command, waited on with `wait-log.mjs`:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L8 || exit 1
(node $RUN/slot.mjs run ten-L8 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8968 --modes normal,inside,compare animations/07-ambient-background/ken-burns; node $RUN/slot.mjs run ten-L8 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8968 --phone --modes normal,inside,compare animations/07-ambient-background/ken-burns; node $RUN/slot.mjs run ten-L8 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8968 animations/07-ambient-background/aurora; node $RUN/slot.mjs run ten-L8 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8968 --phone animations/07-ambient-background/aurora) > $TEN/checks/L8/frames.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L8/frames.log
```

Expected: a median of 16.7 ms in every mode at both sizes, and no larger share of frames slower than 20 ms than Aurora / Northern Lights measured the same way, within a few points (the machine's other work moves these numbers; run again when one looks off). This plan's runs: desktop 0 / 0 / 0%, phone 0 / 0 / 1%; Aurora / Northern Lights 0% at both sizes. Report the numbers; nothing to change unless a mode is clearly worse than the closest page.

- [ ] **Step 10: Commit, and the build report**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L8 || exit 1
[ "$(git rev-parse --abbrev-ref HEAD)" = ten/L8 ] || exit 1
git add -A && git status --short
git commit -m "feat: 07.24 Ken Burns Effect, with See inside and Compare from the start (lane 8)"
git log --oneline -1
```

Expected before the commit: `A  animations/07-ambient-background/ken-burns/README.md`, `A  animations/07-ambient-background/ken-burns/index.html`, `M  .github/ISSUE_TEMPLATE/config.yml`, `M  404.html`, `M  README.md`, `M  animations/07-ambient-background/README.md`, `M  animations/07-ambient-background/game-of-life/index.html`, `M  index.html`, `M  llms.txt`, `M  sitemap.xml` and the changed files under `skills/animation-handbook/`; nothing else (the kit's copy is ignored; logs and pictures are in `$TEN`). Then write `$TEN/reports/L8/build.md`: first line `RESULT: built <commit>`, then the line count, the page check's `ok` count and its round, the short screens' last line, the galleries and clips looked at (one line per choice: what changes in each view; one line per clip: what moves), the tests' pass and fail line, the frame times, the hand checks' results, every place the page departs from the spec or this task and why, and any shared-file need (the coordinator appends it to `$RUN/shared-wishes.md`; there should be none). Reply to the coordinator in at most three lines.

- [ ] **Step 11: Review, at most three fix rounds**

The coordinator dispatches a reviewer (strongest model, never the builder) with: the spec's section, this task, the builder's report, `git -C $REPO diff feat/ten-animations...ten/L8`, the newest check round and its screenshots, the short screens, the galleries, the clips and the frame times. The reviewer reads CLAUDE.md, the Global Constraints, `$RUN/lessons.md`, `$RUN/briefs/RULINGS.md`, `$RUN/brief-rulings.md`, `$RUN/briefs/OPEN-QUESTIONS.md` and, once it holds the owner's verdict, `$RUN/rulings-159.md`, and checks the diff against them, the rollout's acceptance list (section 1 of the rollout spec), the spec's section and the per-frame work, looking hard at never display:none on a moving element (its animation would restart); no edge showing; the paused picture after a mode change. It writes `$TEN/reports/L8/review-<k>.md`: first line `RESULT: approved` or `RESULT: changes <count>`, then numbered findings (Critical, Important, Minor), and replies in at most three lines. Each fix round: the builder fixes, runs Steps 5 and 6 again (and the galleries, clips or frame times a fix touches), commits `fix: Ken Burns Effect: <what>` after the branch check, writes `$TEN/reports/L8/fix-<k>.md` (`RESULT: built <commit>`), and the reviewer re-reviews only the fix. After three rounds the coordinator steps in. When approved, the coordinator stops the lane's server and adds the ledger line `<date time>  L8  approved at <commit>; check rounds <k>; frames <numbers>; departures: <none or a list>; reports reports/L8/`.

---

### Task 9: L9 · 07.25 Fire Effect (`ten/L9`, port 8969)

Loop · step 1 "Watch it" · player bar: Pause and Slow motion (the page pauses and slows itself). See inside: the heat grid as squares, white the hottest, with the always-hot bottom row. Compare: "Flickers in place" (random heat every step) beside "Heat rises". Spec: "9 · Fire Effect (07.25)" in `docs/superpowers/specs/2026-10-13-ten-new-animations-design.md`.

**Files:**
- Create: `animations/07-ambient-background/fire-effect/index.html` (345 lines), `animations/07-ambient-background/fire-effect/README.md`
- Modify (by `$TEN/lanes.mjs 9`): `index.html` (the card after Game of Life's, the `PV` key, the `PLACES` row, the `FIND` row (the finder is on the branch), every count 166 → 167), `README.md` (counts, 07's count 23 → 24, the catalog line), `animations/07-ambient-background/README.md` (its line and its Implementation summary row), `.github/ISSUE_TEMPLATE/config.yml`, `404.html`
- Modify (Step 4, by hand): `index.html`: the preview's CSS at the end of the 07 bespoke block, `case 'fire':` in `pvMarkup()`
- Regenerate: `sitemap.xml`, `llms.txt`, `skills/animation-handbook/` (their tools)
- Test: `tests/*.test.js`; the page check of the new page and of the home page; the review kit's short screens, a gallery for the defaults and for each other choice in Try it, clips of the defaults; frame times
- Write (run folder): `$TEN/checks/L9/` (logs, screenshots, kit output), `$TEN/reports/L9/build.md`, `fix-<k>.md`; the reviewer `review-<k>.md`

**Interfaces:**
- Consumes: Task 0's worktree `.claude/worktrees/ten-L9` on `ten/L9`, its server on port 8969 (started and stopped by the coordinator), `$TEN/lanes.mjs`, `$TEN/frametimes.mjs`, the shared-file version N in the ledger; Phase 0's shared files, its mode press (the shared script presses nothing on a loop after See inside or Compare) and its page check; the rollout's review kit and wait tool.
- Produces: branch `ten/L9`: the card `['fire-effect','Fire Effect','Flames flicker and rise as heat climbs and cools. Best for game and event pages.']` (07.25), `PV` key `'fire-effect':'fire'`, `PLACES` `['bg','intro']`, `FIND` `'fire-effect':['background','loop','glitch color drift']`; Previous: Game of Life (for now: Task 11 points it at the page before it in the section); no Next link yet. The reports in `$TEN/reports/L9/`, which the rollout's final review (part 9) reads too.

- [ ] **Step 1: The lane's shared edits (the failing tests)**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L9 || exit 1
node $TEN/lanes.mjs 9 .
git status --short
node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)" | head -10
```

Expected: `lane 9 shared edits applied to .`; then ` M .github/ISSUE_TEMPLATE/config.yml`, ` M 404.html`, ` M README.md`, ` M animations/07-ambient-background/README.md`, ` M index.html`; then these 6 failing tests and `ℹ fail 6`: `✖ make-famous: on the real home page every card builds, but the eight whose previews need a script or animate in SVG`, `✖ the answers keep the rules every page of a kind shares: transitions answer newpage, loops loop, scroll pages scroll`, `✖ the Full catalog in the root README lists every card once, in home order, linked to its live page`, `✖ the counts written in the issue template, the 404 page and the sitemap match the cards`, `✖ the skill and llms.txt are what tools/make-skill.mjs writes from the pages and the home page now`, `✖ llms.txt lists every card once, in the order of CATS, with its live address and its description, and links the skill files`. (Famous effects' test builds every card's preview, which Step 4 adds; the finder's reads each page's kind, from a page that is not there yet; this plan's run of every lane on a copy of `feat/ten-animations` at `ece2689`, the finder and Famous effects there, gave exactly these.) If `lanes.mjs` stops with `not found (…)`, stop and tell the coordinator, who alone edits `$TEN/lanes.mjs`; before running it again, put the worktree back with `git checkout -- .` (this step makes no other changes; the tool refuses a second run on a changed tree).

- [ ] **Step 2: Write the page: `animations/07-ambient-background/fire-effect/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fire Effect — Animation Handbook</title>
  <meta name="description" content="Flames flicker and rise as heat climbs and cools. Best for game and event pages.">
  <link rel="canonical" href="https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/fire-effect/">
  <link rel="icon" type="image/png" sizes="96x96" href="../../../favicon.png">
  <link rel="icon" type="image/svg+xml" href="../../../favicon.svg">
  <link rel="apple-touch-icon" href="../../../apple-touch-icon.png">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Animation Handbook">
  <meta property="og:title" content="Fire Effect — Animation Handbook">
  <meta property="og:description" content="Flames flicker and rise as heat climbs and cools. Best for game and event pages.">
  <meta property="og:url" content="https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/fire-effect/">
  <meta property="og:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Fire Effect — Animation Handbook">
  <meta name="twitter:description" content="Flames flicker and rise as heat climbs and cools. Best for game and event pages.">
  <meta name="twitter:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <script type="application/ld+json">{"@context": "https://schema.org", "@type": "TechArticle", "headline": "Fire Effect", "name": "Fire Effect", "description": "Flames flicker and rise as heat climbs and cools. Best for game and event pages.", "url": "https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/fire-effect/", "inLanguage": "en", "articleSection": "Ambient & Background", "isPartOf": {"@type": "WebSite", "name": "Animation Handbook", "url": "https://matinmonshizadeh.github.io/animation-handbook/"}, "author": {"@type": "Person", "name": "matinmonshizadeh"}, "keywords": "web animation, CSS animation, Ambient & Background, Fire Effect"}</script>
  <style>
    :root{--ui-accent:#ffce5a}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    .stage{position:relative;overflow:hidden;background:#070608}
    /* Each fire is a small canvas of one pixel per heat cell, stretched over its part of the box by the browser (smoothly, so the
       flames look soft); See inside draws on a canvas of the box's own size */
    .fire,#cvs{position:absolute;display:block;width:100%;height:100%;left:0;top:0}
    .fire.half,#cvs,.divide{display:none}
    .stage[data-hb-mode="inside"] .fire,.stage[data-hb-mode="compare"] .fire.whole{display:none}
    .stage[data-hb-mode="inside"] #cvs,.stage[data-hb-mode="compare"] .fire.half{display:block}
    .divide{position:absolute;left:calc(50% - 1px);top:0;width:2px;height:100%;background:#000}
    .stage[data-hb-mode="compare"] .divide{display:block}
    /* See inside and Compare: plain words over the picture */
    .fx-lbl{display:none;position:absolute;padding:3px 8px;border-radius:6px;background:rgba(7,6,8,.88);color:#f4f4f2;
      font:600 13px/1.25 var(--hb-font);white-space:nowrap;pointer-events:none}
    .stage[data-hb-mode="inside"] .in,.stage[data-hb-mode="compare"] .half{display:block}
    .in.what{left:10px;top:10px;white-space:normal;max-width:min(60%,330px)}
    .half{top:10px}.half.first{left:10px}.half.second{left:calc(50% + 10px)}
    @media(max-width:360px){.half.second{left:10px;top:calc(50% + 10px)}.divide{left:0;top:calc(50% - 1px);width:100%;height:2px}}
  </style>
  <link rel="stylesheet" href="../../../assets/css/demo-page.css?v=10">
  <script src="../../../assets/js/demo-page.js?v=10" defer></script>
</head>
<body class="hb" data-hb-kind="loop">
<nav class="hb-bar" aria-label="Animation Handbook">
  <a class="hb-home" href="../../../"><svg class="hb-mark" viewBox="0 0 32 32" aria-hidden="true"><g class="g"><circle cx="11.16" cy="20.84" r="6.1"/><circle cx="15.12" cy="16.88" r="6.1"/><circle cx="18.51" cy="13.49" r="6.1"/></g><circle class="b" cx="21.2" cy="10.8" r="6.6"/></svg><span>Animation Handbook</span></a>
  <span class="hb-pager"><a href="../game-of-life/" rel="prev" aria-label="Previous: Game of Life"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg><span><span class="hb-dir">Previous: </span>Game of Life</span></a></span>
  <a class="hb-star" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener" aria-label="Star on GitHub"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg><span>Star on GitHub</span></a>
</nav>
<main class="hb-page">
  <header class="hb-head">
    <p class="hb-cat">07.25 · Ambient &amp; Background</p>
    <h1>Fire Effect</h1>
    <p class="hb-lede">Flames flicker and rise as heat climbs and cools. Best for game and event pages.</p>
  </header>

  <section class="hb-step hb-watch" aria-labelledby="hb-watch-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">1</span>
      <div><h2 id="hb-watch-title">Watch it</h2><p>It moves by itself. Pause it, or turn on slow motion to watch the heat rise.</p></div>
    </div>
    <div class="seg hb-modes" role="group" aria-label="What the box shows" data-hb-modes>
      <button type="button" data-hb-mode="normal" class="on" aria-pressed="true">Normal</button>
      <button type="button" data-hb-mode="inside" aria-pressed="false">See inside</button>
      <button type="button" data-hb-mode="compare" aria-pressed="false">Compare</button>
    </div>
    <div class="stage" role="img" aria-label="Flames flickering along the bottom of a dark box, with sparks drifting up">
      <canvas id="cvs" aria-hidden="true"></canvas><i class="divide" aria-hidden="true"></i>
      <p class="fx-lbl in what" aria-hidden="true" data-hb-caption>Each square holds one heat value: white is hottest</p>
      <p class="fx-lbl in" id="l-base" aria-hidden="true" data-hb-caption>Always full heat</p>
      <p class="fx-lbl in" id="l-up" aria-hidden="true" data-hb-caption>Heat moves up a row each step</p>
      <p class="fx-lbl in" id="l-cool" aria-hidden="true" data-hb-caption>It cools as it rises</p>
      <p class="fx-lbl half first" aria-hidden="true" data-hb-caption>Flickers in place</p>
      <p class="fx-lbl half second" aria-hidden="true" data-hb-caption>Heat rises</p>
    </div>
    <div class="hb-player">
      <button class="hb-play" type="button" id="btn-pause" data-hb-pause data-state="playing"><svg class="hb-ic hb-i-pause" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg><svg class="hb-ic hb-i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3l14 9-14 9z"/></svg><span class="hb-pause-label">Pause</span></button>
      <label class="hb-toggle"><input class="hb-switch" type="checkbox" role="switch" id="slow-tog" data-hb-slowmo autocomplete="off"><span>Slow motion</span></label>
    </div>
    <div class="hb-mode-notes" aria-live="polite">
      <p data-hb-for="inside" hidden>Inside, each square is one heat value, white the hottest: the hidden bottom row is always hot, heat moves up a row each step with a little sideways wobble, and it cools as it rises.</p>
      <p data-hb-for="compare" hidden>Flickers in place gives each spot new random heat every step, so it looks like static. Heat rises lifts heat from below and cools it on the way up, so it forms flames.</p>
    </div>
  </section>

  <section class="hb-step hb-try" aria-labelledby="hb-try-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">2</span>
      <div><h2 id="hb-try-title">Try it</h2><p>Change a setting and see the difference as it moves.</p></div>
    </div>
    <div class="hb-settings">
      <div class="hb-setting">
        <p class="hb-setting-name" id="height-lbl">Flame height</p>
        <div class="seg" id="height-seg" role="group" aria-labelledby="height-lbl">
          <button type="button" data-h="low" aria-pressed="false">Low</button>
          <button type="button" data-h="medium" class="on" aria-pressed="true">Medium</button>
          <button type="button" data-h="tall" aria-pressed="false">Tall</button>
        </div>
        <p class="hb-hint">Tall flames cool more slowly as they rise.</p>
      </div>
      <div class="hb-setting">
        <p class="hb-setting-name" id="shape-lbl">Fire shape</p>
        <div class="seg" id="shape-seg" role="group" aria-labelledby="shape-lbl">
          <button type="button" data-shape="edge" class="on" aria-pressed="true">Along the edge</button>
          <button type="button" data-shape="camp" aria-pressed="false">Campfire</button>
        </div>
        <p class="hb-hint">Campfire heats only the middle, so the flames meet in a point.</p>
      </div>
      <div class="hb-setting">
        <p class="hb-setting-name" id="color-lbl">Colors</p>
        <div class="swatches" id="color-sw" role="group" aria-labelledby="color-lbl">
          <button type="button" class="on" aria-pressed="true" aria-label="Orange" data-col="orange" style="background:#f5781a"></button>
          <button type="button" aria-pressed="false" aria-label="Blue" data-col="blue" style="background:#2a8cf0"></button>
          <button type="button" aria-pressed="false" aria-label="Green" data-col="green" style="background:#50c828"></button>
        </div>
        <p class="hb-hint">The color of the heat.</p>
      </div>
    </div>
    <details class="hb-options">
      <summary><span class="hb-more-label">More options</span><span class="hb-less">Fewer options</span><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary>
      <div class="hb-settings">
        <div class="hb-setting">
          <p class="hb-setting-name" id="wind-lbl">Wind</p>
          <div class="seg" id="wind-seg" role="group" aria-labelledby="wind-lbl">
            <button type="button" data-w="0" class="on" aria-pressed="true">None</button>
            <button type="button" data-w="-1" aria-pressed="false">Left</button>
            <button type="button" data-w="1" aria-pressed="false">Right</button>
          </div>
          <p class="hb-hint">Leans the flames to one side.</p>
        </div>
        <div class="hb-setting">
          <label class="hb-switch-row"><span>Sparks</span><input class="hb-switch" type="checkbox" role="switch" id="spark-tog" checked autocomplete="off"></label>
          <p class="hb-hint">Small sparks drift up from the flames.</p>
        </div>
      </div>
    </details>
  </section>

  <section class="hb-step hb-prompt-step" aria-labelledby="hb-prompt-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">3</span>
      <div><h2 id="hb-prompt-title">Copy the prompt</h2><p>Paste it into an AI assistant such as ChatGPT, Claude or Cursor to build this in your own project.</p></div>
    </div>
    <div class="hb-card">
      <p class="hb-prompt">Add a fire effect to [the dark section or edge you want to set alight]. Keep a small grid of heat values whose bottom row always holds full heat. Many times a second, give each cell the heat of a cell just below it, nudged sideways and cooled a little at random, so heat rises, flickers and dies out. Color each cell by its heat with the palette the settings choose, dark when cool and brightest when hot, and draw the grid on a small canvas stretched over the area so the flames look soft. Step the grid at a fixed rate on every screen, coarser on phones. If the visitor has reduced motion turned on, show still flames. Match the settings listed below.</p>
      <div class="hb-chips-box" hidden>
        <p class="hb-chips-title">Your settings</p>
        <ul class="hb-chips"></ul>
      </div>
      <div class="hb-copy-row">
        <button class="hb-copy" type="button"><svg class="hb-ic hb-i-copy" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><svg class="hb-ic hb-i-done" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span class="hb-copy-label" aria-live="polite">Copy prompt</span></button>
        <p class="hb-hint">Replace the words in brackets with your own element. Your settings are added at the end.</p>
      </div>
    </div>
    <div class="hb-star-row"><p>Free and open source. If this helped, a star on GitHub helps other people find it.</p><a class="hb-star-btn" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>Star on GitHub</a></div>
  </section>

  <section class="hb-about" aria-labelledby="hb-what-title">
    <div class="hb-what">
      <h2 id="hb-what-title">What it is</h2>
      <div class="hb-what-text"><p>The full explanation is in <a href="README.md">README.md</a>.</p></div>
    </div>
    <div class="hb-fit">
      <h2>Good for</h2>
      <ul class="hb-tags hb-good"><li>Game sites</li><li>Sale and event banners</li><li>Night and festival themes</li></ul>
      <h3>Avoid on</h3>
      <ul class="hb-tags hb-avoid"><li>Reading pages</li><li>Light themes</li></ul>
    </div>
  </section>

  <section class="hb-related" aria-labelledby="hb-related-title" hidden>
    <h2 id="hb-related-title">Similar animations</h2>
    <div class="hb-rel-list"></div>
  </section>
</main>
<footer class="hb-foot"><span>Animation Handbook</span><a href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener">Source on GitHub</a><a href="#top">Back to top ↑</a></footer>
<script>
  const cvs=document.getElementById('cvs'),ctx=cvs.getContext('2d'),stage=cvs.parentElement,divide=stage.querySelector('.divide');
  const slowTog=document.getElementById('slow-tog'),sparkTog=document.getElementById('spark-tog');
  const reduceMQ=matchMedia('(prefers-reduced-motion: reduce)'),phone=matchMedia('(max-width:600px),(max-height:500px)');
  const narrow=matchMedia('(max-width:360px)'); // where the Compare halves stack, as the labels do
  const FRAME=1000/60,SEED=11,WARM=200; // one step is a 60th of a second; a new fire is run 200 steps from a fixed seed, so it starts full
  const HEIGHT={low:.32,medium:.52,tall:.78}; // the share of the box the flames reach
  const PALETTES={orange:[[7,6,8],[96,10,6],[196,44,10],[245,120,26],[255,204,80],[255,250,226]],
    blue:[[7,6,8],[8,14,70],[24,60,180],[42,140,240],[150,222,255],[238,250,255]],
    green:[[7,6,8],[6,44,14],[24,124,34],[80,200,40],[196,250,120],[246,255,224]]};
  const LABELS={normal:'Flames flickering along the bottom of a dark box, with sparks drifting up',
    inside:'The fire as a grid of gray squares, one heat value each, with the always-hot bottom row, rising arrows and a bar that cools upward',
    compare:'Two fires side by side: random flicker that stays in place, and heat that rises into flames'};
  let height='medium',shape='edge',color='orange',wind=0,mode='normal',paused=false;
  let W=0,H=0,raf=0,lastT=null,acc=0,lut=null,main=null,pair=null;
  // A seeded random sequence (32 random bits a call), so a new fire is the same fire every time; rand() gives 0 to 1
  function rng(s){let x=s|0||1;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return x>>>0}}
  // The palette as 256 colors, from cool (dark) to hot (near white), as the pixels of an ImageData want them
  function makeLut(){
    const stops=PALETTES[color],out=new Uint32Array(256);
    for(let i=0;i<256;i++){const p=i/255*(stops.length-1),k=Math.min(stops.length-2,Math.floor(p)),f=p-k,a=stops[k],b=stops[k+1];
      out[i]=255<<24|Math.round(a[2]+(b[2]-a[2])*f)<<16|Math.round(a[1]+(b[1]-a[1])*f)<<8|Math.round(a[0]+(b[0]-a[0])*f)}
    return out;
  }
  // One fire in a rectangle of the box (in shares of its size): cols × rows heat values, the last row hidden below the box, drawn
  // on a small canvas of one pixel per cell that the browser stretches over the rectangle. flicker: the common mistake, new random
  // heat in place every step.
  function Fire(rect,cols,flicker,seed,half){
    const cell=rect.w*W/cols,rows=Math.max(8,Math.round(rect.h*H/cell))+1,small=document.createElement('canvas'),bits=rng(seed);
    small.width=cols;small.height=rows-1;small.className='fire '+(half?'half':'whole');small.setAttribute('aria-hidden','true');
    Object.assign(small.style,{left:rect.x*100+'%',top:rect.y*100+'%',width:rect.w*100+'%',height:rect.h*100+'%'});
    divide.before(small);
    return {cols,rows,flicker,half,h:new Float32Array(cols*rows),bits,rand:()=>bits()/4294967296,sparks:[],sctx:small.getContext('2d'),img:new ImageData(cols,rows-1)};
  }
  const base=(f,x)=>shape==='edge'?1:Math.max(0,1-Math.abs(x+.5-f.cols/2)/(f.cols*.16));
  // One step: the hidden bottom row gets full heat (only its middle for a campfire); every other cell takes the heat of the cell
  // below it, written one cell to the side at random (and more often toward the wind), and half the time a little cooler, so heat
  // moves up a row each step, runs out at the chosen height and leaves hotter streaks where it happened to cool less
  function step(f){
    const {cols:c,rows:r,h,rand,bits}=f;
    if(f.flicker){for(let y=0;y<r-1;y++){const k=Math.pow(y/(r-2),2.2);for(let x=0;x<c;x++)h[y*c+x]=rand()*k*base(f,x)}return}
    for(let x=0;x<c;x++)h[(r-1)*c+x]=base(f,x);
    const cool=2/((r-1)*HEIGHT[height]);
    // one draw of random bits a cell: two for the sideways step (left, stay, stay, right), one for cooling, one for the wind
    for(let y=1;y<r;y++)for(let x=0,i=y*c;x<c;x++,i++){
      const n=bits(),q=n&3;let nx=x+(q===3?0:q-1)+(wind&&n&16?wind:0);
      nx=nx<0?0:nx>=c?c-1:nx;
      const v=h[i]-(n&8?cool:0);
      h[i-c-x+nx]=v>0?v:0;
    }
  }
  // Sparks rise from the hot cells and fade, moved by the time that passed (s seconds); fewer on phones and in each Compare half
  function sparks(f,s){
    const {rand}=f,rate=(phone.matches?10:24)*(f.half?.5:1);
    if(sparkTog.checked&&rand()<rate*s){let x=rand()*f.cols;if(base(f,Math.floor(x))<.5)x=f.cols/2+(rand()-.5)*f.cols*.2;
      f.sparks.push({x:x/f.cols,y:1-HEIGHT[height]*(.25+rand()*.45),vy:.18+rand()*.22,ph:rand()*6.28,life:1.2+rand()*1.2,age:0})}
    for(const p of f.sparks){p.age+=s;p.y-=p.vy*s;p.x+=Math.sin(p.ph+p.age*3)*.02*s+wind*.03*s}
    f.sparks=f.sparks.filter(p=>p.age<p.life&&p.y>0);
  }
  // A new fire for every rectangle of the current mode, run WARM steps from its seed, so it is full from the first frame
  function build(){
    stage.querySelectorAll('.fire').forEach(c=>c.remove());
    const stack=narrow.matches,max=phone.matches?96:160;
    // about one cell per five pixels, at most 160 across (96 on phones); a Compare half covers half the box, so half the cells
    const make=(rect,flicker,seed,half)=>{const f=Fire(rect,Math.max(16,Math.min(max,Math.round(rect.w*W/5))),flicker,seed,half);
      for(let i=0;i<WARM;i++){step(f);sparks(f,FRAME/1000)}return f};
    main=make({x:0,y:0,w:1,h:1},false,SEED,false);
    const halves=stack?[{x:0,y:0,w:1,h:.5},{x:0,y:.5,w:1,h:.5}]:[{x:0,y:0,w:.5,h:1},{x:.5,y:0,w:.5,h:1}];
    pair=halves.map((rect,i)=>make(rect,i===0,SEED+i,true));
  }
  // A fire's picture: its heat as colors, then its sparks as soft dots (a cell wide, at their own place between cells)
  function paint(f){
    const {cols:c,rows:r,h,img,sctx}=f,px=new Uint32Array(img.data.buffer);
    // each pixel blends a cell with its two side neighbors, which softens the grain across and keeps the streaks that rise
    for(let y=0;y<r-1;y++)for(let x=0,i=y*c;x<c;x++,i++)px[i]=lut[Math.min(255,(h[i-(x>0)]+2*h[i]+h[i+(x<c-1)])*63.75|0)];
    sctx.putImageData(img,0,0);
    sctx.fillStyle=`rgb(${PALETTES[color][5].join()})`;
    for(const p of f.sparks){sctx.globalAlpha=1-p.age/p.life;sctx.fillRect(p.x*c-.5,p.y*(r-1)-.5,1,1)}
    sctx.globalAlpha=1;
  }
  // See inside: the same fire as big squares in grays (one heat value each, white the hottest), its hidden bottom row shown and
  // white, rising arrows with a sideways wobble (toward the wind), and at the side a bar in the fire's colors that cools upward
  // The squares are one pixel each on a small canvas, drawn up with smoothing off, and the gaps between them one path on top
  const grid=document.createElement('canvas'),gctx=grid.getContext('2d');let gimg=null;
  function paintInside(){
    const f=main,{cols:c,rows:r,h}=f,B=phone.matches?6:5,bc=Math.ceil(c/B),s=W/bc,br=Math.ceil(H/s);
    if(!gimg||gimg.width!==bc||gimg.height!==br){grid.width=bc;grid.height=br;gimg=gctx.createImageData(bc,br)}
    const px=new Uint32Array(gimg.data.buffer);
    for(let j=0;j<br;j++)for(let i=0;i<bc;i++){const y=r-1-j*B,g=Math.round(18+(y<0?0:h[y*c+Math.min(c-1,i*B+(B>>1))])*237);px[(br-1-j)*bc+i]=0xff000000|g<<16|g<<8|g}
    gctx.putImageData(gimg,0,0);ctx.imageSmoothingEnabled=false;ctx.drawImage(grid,0,H-br*s,W,br*s);
    ctx.strokeStyle='#111014';ctx.lineWidth=2;ctx.beginPath();
    for(let i=0;i<=bc;i++){ctx.moveTo(i*s,0);ctx.lineTo(i*s,H)}
    for(let j=0;j<=br;j++){ctx.moveTo(0,H-j*s);ctx.lineTo(W,H-j*s)}
    ctx.stroke();
    for(const p of f.sparks){ctx.fillStyle='#fff';ctx.fillRect(p.x*W-1.5,p.y*H-1.5,3,3)}
    ctx.lineCap='round';ctx.lineJoin='round';
    for(const k of [.22,.5,.78]){const x=k*W,y=H-1.5*s,d=wind*s*.5;
      for(const [w,col] of [[6,'#111014'],[2.5,'#ffce5a']]){ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();
        ctx.moveTo(x,y);ctx.lineTo(x-s*.5+d,y-s);ctx.lineTo(x+s*.5+d,y-2*s);ctx.lineTo(x+d,y-3*s);
        ctx.moveTo(x+d-6,y-3*s+7);ctx.lineTo(x+d,y-3*s);ctx.lineTo(x+d+6,y-3*s+7);ctx.stroke()}}
    const top=H*(1-HEIGHT[height]),bar=ctx.createLinearGradient(0,H-s,0,top),st=PALETTES[color];
    st.forEach((col,i)=>bar.addColorStop(1-i/(st.length-1),`rgb(${col.join()})`));
    ctx.fillStyle='#111014';ctx.fillRect(W-30,top-2,18,H-s-top+4);ctx.fillStyle=bar;ctx.fillRect(W-28,top,14,H-s-top);
    place(document.getElementById('l-base'),12,H-s-34);
    // on a short, wide box the squares are big and the arrows reach the top: the label goes under the one at the top left
    const what=stage.querySelector('.in.what');
    place(document.getElementById('l-up'),.5*W-110,Math.max(H-4.5*s-30,what.offsetTop+what.offsetHeight+6));
    const cool=document.getElementById('l-cool');place(cool,W-40-cool.offsetWidth,top+(H-s-top)*.35);
  }
  const place=(el,x,y)=>{el.style.left=Math.max(6,Math.min(W-el.offsetWidth-6,x))+'px';el.style.top=Math.max(6,Math.min(H-el.offsetHeight-6,y))+'px'};
  function draw(){
    if(mode==='inside')paintInside();
    else (mode==='compare'?pair:[main]).forEach(paint);
  }
  // The loop takes fixed steps of a 60th of a second from the time that passed (a third of it in slow motion), at most two a
  // frame, and draws every frame, as the sparks move by the time itself. Compare steps its own two fires, so Normal's waits as it was.
  function loop(ts){
    raf=requestAnimationFrame(loop);
    if(lastT===null){lastT=ts;return}
    const dt=Math.min(ts-lastT,50)*(slowTog.checked?1/3:1);lastT=ts;acc+=dt;
    const fires=mode==='compare'?pair:[main];let n=0;
    while(acc>=FRAME-1&&n<2){fires.forEach(step);acc-=FRAME;n++}
    if(acc>FRAME)acc=0;
    fires.forEach(f=>sparks(f,dt/1000));
    draw();
  }
  function start(){if(raf||paused)return;lastT=null;acc=0;raf=requestAnimationFrame(loop)}
  // Registered at the top level: under reduced motion the shared script pauses the loop at once, and the full fire stays still
  document.addEventListener('hb:pause',e=>{paused=e.detail.paused;notes();if(paused){cancelAnimationFrame(raf);raf=0}else start()});
  document.addEventListener('visibilitychange',()=>{lastT=null;acc=0});
  // The mode switch draws the mode at once, playing or paused; each mode keeps its own fire, so Normal comes back as it was
  document.addEventListener('hb:mode',e=>{mode=e.detail.mode;stage.setAttribute('aria-label',LABELS[mode]);if(W)draw()});
  // A real change of the box's size builds new fires for it (a phone's address bar sliding leaves it as it was); the box is watched
  // itself, so its size once the page's styles have loaded counts too
  function resize(){
    const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h||(w===W&&h===H))return;W=w;H=h;
    const dpr=Math.min(devicePixelRatio||1,2);cvs.width=W*dpr;cvs.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    build();draw();
  }
  // A setting changes the fire as it plays; while paused it builds the fire again with the new setting, so the change shows
  function changed(rebuild){if(paused&&rebuild)build();if(W)draw()}
  function choices(id,pick,rebuild){
    const buttons=document.querySelectorAll('#'+id+' button');
    buttons.forEach(b=>b.addEventListener('click',()=>{
      buttons.forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',String(x===b))});
      pick(b.dataset);changed(rebuild);
    }));
  }
  choices('height-seg',d=>{height=d.h},true);
  choices('shape-seg',d=>{shape=d.shape},true);
  choices('color-sw',d=>{color=d.col;lut=makeLut()},false);
  choices('wind-seg',d=>{wind=+d.w},true);
  sparkTog.addEventListener('change',()=>changed(true));
  // Under reduced motion the loop starts paused on a full fire, and the notes say so while it is paused; playing, the fire burns
  // as it does without reduced motion, and the markup's words hold
  const said={inside:document.querySelector('[data-hb-for="inside"]').textContent,compare:document.querySelector('[data-hb-for="compare"]').textContent};
  const STILL={inside:'Shown still: each square is one heat value, white the hottest; the hidden bottom row is always hot, heat moves up a row each step, and it cools as it rises. Press Play to watch.',
    compare:'Shown still: Flickers in place gives each spot new random heat every step, like static; Heat rises lifts heat from below and cools it, so it forms flames. Press Play to watch.'};
  function notes(){const still=reduceMQ.matches&&paused;for(const k of ['inside','compare'])document.querySelector(`[data-hb-for="${k}"]`).textContent=still?STILL[k]:said[k]}
  notes();
  lut=makeLut();
  resize();
  new ResizeObserver(resize).observe(stage);
  start();
</script>
</body>
</html>
```

Then give it the shared-file version the branch uses (the ledger's N; nothing changes when N is 10):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L9 || exit 1
N=$(grep -o 'shared files ?v=[0-9]*' $TEN/ledger.md | head -1 | grep -o '[0-9]*$')
sed -i "s/demo-page\.css?v=10/demo-page.css?v=$N/; s/demo-page\.js?v=10/demo-page.js?v=$N/" animations/07-ambient-background/fire-effect/index.html
grep -c "demo-page\.css?v=$N\|demo-page\.js?v=$N" animations/07-ambient-background/fire-effect/index.html
```

Expected: `2`.

- [ ] **Step 3: Write the README: `animations/07-ambient-background/fire-effect/README.md`**

````markdown
# Fire Effect

[Live demo](https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/fire-effect/)

## What it is
A fire effect fills the bottom of a dark area with flames that flicker, rise and die out, with sparks drifting up. It is made from a small grid of heat values: the bottom row is always as hot as it gets, heat climbs one row at a time with a little sideways wobble, and it cools on the way up, so the hot base turns into tongues of flame. It is the classic fire of early computer games, drawn soft.

## When to use it
- Game sites and launch pages for games
- Sale, countdown and event banners that want urgency
- Night, festival and campfire themes
- Short intros where a burst of energy fits the brand

## How it works
The fire is a grid of numbers between 0 (cold) and 1 (hottest), about one cell per five pixels of the box. The bottom row sits just below the box and is set to full heat every step (only its middle, for a campfire). Every other cell takes the heat of the cell below it, written straight up half the time and one cell to the left or the right the rest (more often toward the wind) and, half the time, a little cooler. So heat moves up a row each step, runs out about where the flame height says, and leaves hotter streaks where it happened to cool less:

```js
for (let x = 0; x < cols; x++) heat[(rows - 1) * cols + x] = base(x);   // the hidden row: always full heat
const cool = 2 / ((rows - 1) * HEIGHT[height]);                          // the average loss per row
for (let y = 1; y < rows; y++) for (let x = 0; x < cols; x++) {
  const r = rand(), dx = (r < .25 ? -1 : r < .75 ? 0 : 1) + (wind && rand() < .5 ? wind : 0);   // left, stay, stay, right
  const nx = Math.min(cols - 1, Math.max(0, x + dx));
  heat[(y - 1) * cols + nx] = Math.max(0, heat[y * cols + x] - (rand() < .5 ? 0 : cool));
}
```

Each heat value, blended with its two side neighbors to soften the grain, picks one of 256 colors from the palette, dark when cool and near white when hot. The colors are written into a small canvas with one pixel per cell, and that canvas is the picture: its CSS size is the box's, so the browser stretches it smoothly, which is what makes the flames soft instead of blocky, and costs the script nothing:

```js
for (let y = 0; y < rows - 1; y++) for (let x = 0, i = y * cols; x < cols; x++, i++)
  pixels[i] = palette[Math.min(255, (heat[i - (x > 0)] + 2 * heat[i] + heat[i + (x < cols - 1)]) * 63.75 | 0)];
small.getContext('2d').putImageData(image, 0, 0);   // small: a canvas element sized 100% of the box in CSS
```

The grid takes fixed steps of a 60th of a second from the time that has passed (at most two a frame), so the fire burns at the same speed on a 60 Hz and a 120 Hz screen; slow motion counts a third of the time. Sparks are drawn into the same small canvas as soft dots that rise from the hot cells, sway and fade, moved by the time itself. A new fire is run 200 steps from a fixed seed before it is first drawn, so it starts full; under reduced motion it waits paused on that full fire.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Flame height | Medium | Where the heat runs out, as a share of the box's height: low is about a third, medium about half and tall about four fifths; taller flames lose less heat per row |
| Fire shape | Along the edge | Along the edge heats the whole bottom row, so flames burn across the box; campfire heats only its middle third, fading to the sides, so the flames lean in and meet in a point |
| Colors | Orange | The palette from cool to hot: orange runs from dark red to yellow and white, blue from deep navy to pale blue, green from dark green to pale yellow |
| Wind | None | Left or right moves half of the heat one extra cell to that side each step, so the flames lean that way |
| Sparks | on | About 24 sparks a second rise from the flames and fade within one to two and a half seconds (10 a second on phones) |

## Production notes
- **Keep the grid small.** A grid of about 160 cells across is plenty when it is stretched with smoothing; a cell per pixel costs twenty-five times as much for flames that look the same. The demo uses at most 96 across on phones and half the cells in each half of Compare.
- **Fixed steps.** A grid that moves one row per frame burns twice as fast on a 120 Hz screen. Step it at a fixed rate from an accumulator, and cap the steps per frame so a slow device slows down instead of falling behind.
- **One small canvas, stretched by the browser.** Write the colors with `putImageData` into a canvas of one pixel per cell and give the canvas the box's CSS size: the browser scales it on its own, far cheaper than drawing a rectangle per cell or scaling it up with `drawImage` every frame.
- **Pause out of view.** A fire on a page section that has scrolled away still costs every frame: stop the loop with an `IntersectionObserver` and when the tab is hidden.
- **Reduced motion.** Show still flames; let the visitor start them with a play control.
- **Libraries and shaders.** The same fire is a few lines of a WebGL fragment shader with a noise function (for example in Three.js or PixiJS), which suits a full-screen fire; for a small banner, a canvas grid like this one is lighter. Lottie or a short looping video are the usual choices when the fire must look painted.

## See also
- [Game of Life](../game-of-life/) — a grid of cells that steps by simple rules
- [Cloth / Soft-Body Simulation](../../06-3d-advanced/cloth-simulation/) — fixed steps at the same rate on every screen
- [Volumetric Smoke / 3D Noise](../../06-3d-advanced/volumetric-smoke/) — smoke that drifts and curls
- [Fireworks](../fireworks/) — sparks that rise, burst and fade
````

- [ ] **Step 4: The home page preview**

In the worktree's `index.html`: (a) insert these lines, and one empty line after them, right before the line `/* ── bespoke: added demos ── */` (the end of the 07 bespoke block):

```css
.pv-fire{background:radial-gradient(70% 40% at 50% 100%,#5a1a0866,#0000),#070608;overflow:hidden;container-type:size}
.pv-fire i{position:absolute;bottom:-6%;width:30%;height:66%;border-radius:50% 50% 42% 42%/72% 72% 28% 28%;transform-origin:50% 100%;
  background:radial-gradient(60% 52% at 50% 92%,#fffbe0 0 14%,#ffd250 30%,#f5781a 52%,#c42c0a 70%,#0000 74%);mix-blend-mode:screen;animation:fire-tongue 1.6s ease-in-out infinite alternate}
.pv-fire .t1{left:6%;height:52%}.pv-fire .t2{left:26%;animation-delay:-.5s}.pv-fire .t3{left:46%;height:72%;animation-delay:-1s}.pv-fire .t4{left:66%;height:56%;animation-delay:-1.3s}
.pv-fire b{position:absolute;bottom:24%;width:1.4%;aspect-ratio:1;border-radius:50%;background:#ffd250;opacity:0;animation:fire-spark 2.4s linear infinite}
.pv-fire .k1{left:22%}.pv-fire .k2{left:47%;animation-delay:-.8s}.pv-fire .k3{left:71%;animation-delay:-1.6s}
@keyframes fire-tongue{0%{transform:scaleY(.86) skewX(-4deg)}100%{transform:scaleY(1.08) skewX(5deg)}}
@keyframes fire-spark{0%{opacity:0;transform:translate(0,0)}15%{opacity:1}100%{opacity:0;transform:translate(1.5cqw,-58cqh)}}
```

(b) insert this line right before the line that starts with `case 'aurora':` (after the end of the `case 'life':` block):

```js
    case 'fire': return [1,2,3,4].map(k=>'<i class="t'+k+' anim"></i>').join('')+[1,2,3].map(k=>'<b class="k'+k+' anim"></b>').join('');
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L9 || exit 1
grep -c "pv-fire" index.html; grep -c "case 'fire':" index.html
```

Expected: a number above 1 (the preview's CSS rules), then `1` (its case).

- [ ] **Step 5: Write the generated files, then the tests pass**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L9 || exit 1
node tools/update-sitemap.mjs && node tools/make-skill.mjs
node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)"
```

Expected: `ℹ fail 0` (this plan's run of every lane on a copy of `feat/ten-animations` at `ece2689`, the finder and Famous effects there, gave it: 1717 pass). If only `tests/finder.test.js` fails (its case 9 waits for Task 11 when the finder has changed since), note the failing lines in your report for Task 11 (lanes never change `tests/`) and go on; any other failure names what to fix in this lane's files.

- [ ] **Step 6: The page check and the short screens (each a background command, waited on)**

The coordinator's server for this lane answers on port 8969: `curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8969/` prints `200` (if not, ask the coordinator). The review kit finds pages under its own folder's root, so it runs from a copy in the worktree (`.superpowers/` is ignored by git):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit
cd $REPO/.claude/worktrees/ten-L9 || exit 1
mkdir -p .superpowers/sdd/kit/review-kit $TEN/checks/L9 && cp $KIT/record.mjs $KIT/kit-lib.mjs .superpowers/sdd/kit/review-kit/ && git status --short | grep -c superpowers
```

Expected: `0` (git does not see the copy). Then start these two, each as its own background command (the round number `1`, then `2`, `3` after fixes):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L9 || exit 1
node $RUN/slot.mjs run ten-L9 -- node tools/check-pages.mjs --base http://127.0.0.1:8969 --out $TEN/checks/L9/1 animations/07-ambient-background/fire-effect home > $TEN/checks/L9/1.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L9/1.log
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L9 || exit 1
node $RUN/slot.mjs run ten-L9 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8969 --short --out $TEN/checks/L9/short-1 animations/07-ambient-background/fire-effect > $TEN/checks/L9/short-1.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L9/short-1.log
```

Wait on each with `node $RUN/wait-log.mjs $TEN/checks/L9/1.log` and `… short-1.log` (again while it says `still running`), then: `grep -c '^ok' $TEN/checks/L9/1.log; grep '^FAIL' $TEN/checks/L9/1.log; tail -2 $TEN/checks/L9/short-1.log`.

Expected: `12` (six `ok` lines each for `fire-effect`, the home page), no `FAIL` line, and `27 short-screen pictures checked, 0 with labels cut or overlapping, 0 skipped, 0 failed` with `EXIT=0` (this plan's runs gave exactly these). A `FAIL` line or a cut or overlapping label names the problem (the real branch may differ from the copy this plan was checked on; the ledger's first line says how): fix it in this lane's files, keeping the page's behavior, and run both again as round 2, 3; every round after a change ends with all lines `ok`.

- [ ] **Step 7: Every choice in Try it, in both views (acceptance 7), and the motion in clips**

Two background commands. The first runs the kit's gallery (pictures only: Normal, See inside and Compare at 1280 and 375) once with the defaults (`press-0`) and once for each choice that is not a default and each switch in Try it (never Loop, Slow motion, Pause or Play: playback is not a setting), each into its own folder. The second records the clips (Normal, See inside and Compare at 1280, about seven seconds each, frames kept) with the defaults (`clip-0`): the stills never show a run's middle.

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L9 || exit 1
i=0; for sel in "" "#height-seg [data-h='low']" "#height-seg [data-h='tall']" "#shape-seg [data-shape='camp']" "#color-sw [data-col='blue']" "#color-sw [data-col='green']" "#wind-seg [data-w='-1']" "#wind-seg [data-w='1']" "#spark-tog"; do echo "== press-$i ${sel:-defaults}"; node $RUN/slot.mjs run ten-L9 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8969 --gallery ${sel:+--press "$sel"} --out $TEN/checks/L9/press-$i animations/07-ambient-background/fire-effect || echo "run $i failed"; i=$((i+1)); done > $TEN/checks/L9/press.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L9/press.log
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L9 || exit 1
i=0; for sel in ""; do echo "== clip-$i ${sel:-defaults}"; node $RUN/slot.mjs run ten-L9 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8969 --only clips --keep-frames ${sel:+--press "$sel"} --out $TEN/checks/L9/clip-$i animations/07-ambient-background/fire-effect || echo "run $i failed"; i=$((i+1)); done > $TEN/checks/L9/clips.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L9/clips.log
```

Wait on each log with `node $RUN/wait-log.mjs`. Expected: 9 `== press-…` lines, each run ending `done  6 pictures, 0 clips and 0 comparisons made, 0 skipped, 0 failed`, and 1 `== clip-…` line, each ending `done  0 pictures, 3 clips and 0 comparisons made, 0 skipped, 0 failed`; no `failed` line, no `was not found`, `EXIT=0` (the kit's lines as this plan's runs printed them). Read each gallery's See inside and Compare pictures at 1280 beside `press-0`'s: each choice visibly changes Normal and both views. Read three frames from the middle of each See inside and Compare clip (the log's `frames kept in <folder>` lines name the folders): the views move as the spec says, nothing jumps or covers the stage in mid-run (this plan's clips found See inside's small copy filling Pixelate Transition's stage while the blocks were small, a fault no still showed). A choice that changes nothing in a view is a fix (the owner's rule: every setting and control visibly changes the stage and both views). Then remove the frame folders: `grep -o 'frames kept in .*' $TEN/checks/L9/clips.log | sed 's/^frames kept in //' | while read -r f; do rm -rf "$f"; done`.

- [ ] **Step 8: Look at the screenshots and check by hand**

Open `$TEN/checks/L9/<round>/07-fire-effect-{desktop,phone,phone-reduced}-{inside,compare}.png`, the Normal ones and the short screens' pictures: both views read as the spec says, no label covers another or the part it names, nothing overflows at 320. Then, in the served page (a headless run through the pool, or by reading the code where a run cannot show it):

- Flames flicker and rise, with sparks; Pause freezes them at once and Play goes on; Slow motion slows the steps three times; a hidden tab stops the loop.
- Under reduced motion the loop starts paused on a full fire made from a fixed seed run a fixed number of steps, and every mode's still is that frame; going back to Normal while paused gives the same picture; after Play the notes describe the moving fire (lesson 16).
- Every setting changes Normal and both views, Sparks both halves of Compare (one difference between them: lesson 17); the halves sit side by side above 360px and stack below; See inside's labels sit clear of each other on the short screens.

Decisions already made in this page (keep them; a reviewer weighs them): Each fire is its own small canvas, one pixel per cell, stretched by CSS: a scaled drawImage every frame cost too much. The stage size is read with a ResizeObserver (a window resize misses the first size), and the halves stack below 360px. The notes never say left or right: the halves stack on narrow phones. See inside's squares are one pixel each on a small canvas drawn up with smoothing off, and the gaps between them one path on top: drawn as some 900 separate squares, its frames were 16 to 31% slow on a desktop while the machine was busy.

- [ ] **Step 9: Frame times (required: a canvas or mask page)**

One background command, waited on with `wait-log.mjs`:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L9 || exit 1
(node $RUN/slot.mjs run ten-L9 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8969 --modes normal,inside,compare animations/07-ambient-background/fire-effect; node $RUN/slot.mjs run ten-L9 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8969 --phone --modes normal,inside,compare animations/07-ambient-background/fire-effect; node $RUN/slot.mjs run ten-L9 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8969 animations/07-ambient-background/fireworks; node $RUN/slot.mjs run ten-L9 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8969 --phone animations/07-ambient-background/fireworks) > $TEN/checks/L9/frames.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L9/frames.log
```

Expected: a median of 16.7 ms in every mode at both sizes, and no larger share of frames slower than 20 ms than Fireworks measured the same way, within a few points (the machine's other work moves these numbers; run again when one looks off). This plan's runs: desktop 0 / 3 / 0% (2% in Normal and Compare with the machine busy), phone 0 / 0 / 0%, after See inside's squares were drawn as one small picture (before: 16 to 31% in See inside on a desktop); Fireworks 0% on a desktop and 0 to 1% on a phone. A page that misses lightens its per-frame work (a smaller grid, fewer dots, less drawn per frame) until it meets this, and says what it changed.

- [ ] **Step 10: Commit, and the build report**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L9 || exit 1
[ "$(git rev-parse --abbrev-ref HEAD)" = ten/L9 ] || exit 1
git add -A && git status --short
git commit -m "feat: 07.25 Fire Effect, with See inside and Compare from the start (lane 9)"
git log --oneline -1
```

Expected before the commit: `A  animations/07-ambient-background/fire-effect/README.md`, `A  animations/07-ambient-background/fire-effect/index.html`, `M  .github/ISSUE_TEMPLATE/config.yml`, `M  404.html`, `M  README.md`, `M  animations/07-ambient-background/README.md`, `M  index.html`, `M  llms.txt`, `M  sitemap.xml` and the changed files under `skills/animation-handbook/`; nothing else (the kit's copy is ignored; logs and pictures are in `$TEN`). Then write `$TEN/reports/L9/build.md`: first line `RESULT: built <commit>`, then the line count, the page check's `ok` count and its round, the short screens' last line, the galleries and clips looked at (one line per choice: what changes in each view; one line per clip: what moves), the tests' pass and fail line, the frame times, the hand checks' results, every place the page departs from the spec or this task and why, and any shared-file need (the coordinator appends it to `$RUN/shared-wishes.md`; there should be none). Reply to the coordinator in at most three lines.

- [ ] **Step 11: Review, at most three fix rounds**

The coordinator dispatches a reviewer (strongest model, never the builder) with: the spec's section, this task, the builder's report, `git -C $REPO diff feat/ten-animations...ten/L9`, the newest check round and its screenshots, the short screens, the galleries, the clips and the frame times. The reviewer reads CLAUDE.md, the Global Constraints, `$RUN/lessons.md`, `$RUN/briefs/RULINGS.md`, `$RUN/brief-rulings.md`, `$RUN/briefs/OPEN-QUESTIONS.md` and, once it holds the owner's verdict, `$RUN/rulings-159.md`, and checks the diff against them, the rollout's acceptance list (section 1 of the rollout spec), the spec's section and the per-frame work, looking hard at fixed steps from an accumulator; the reduced-motion still from a fixed seed; the per-frame work at phone size and See inside's on a desktop. It writes `$TEN/reports/L9/review-<k>.md`: first line `RESULT: approved` or `RESULT: changes <count>`, then numbered findings (Critical, Important, Minor), and replies in at most three lines. Each fix round: the builder fixes, runs Steps 5 and 6 again (and the galleries, clips or frame times a fix touches), commits `fix: Fire Effect: <what>` after the branch check, writes `$TEN/reports/L9/fix-<k>.md` (`RESULT: built <commit>`), and the reviewer re-reviews only the fix. After three rounds the coordinator steps in. When approved, the coordinator stops the lane's server and adds the ledger line `<date time>  L9  approved at <commit>; check rounds <k>; frames <numbers>; departures: <none or a list>; reports reports/L9/`.

---

### Task 10: L10 · 07.26 Lightning (`ten/L10`, port 8970)

Loop · step 1 "Watch it" · player bar: Pause and Slow motion (the page pauses and slows itself). See inside: a bolt drawn round by round (a line, split again and again with each middle pushed aside by less, then forks and glow), with numbers. Compare: "Even zigzag" beside "Random splits". Spec: "10 · Lightning (07.26)" in `docs/superpowers/specs/2026-10-13-ten-new-animations-design.md`.

**Files:**
- Create: `animations/07-ambient-background/lightning/index.html` (376 lines), `animations/07-ambient-background/lightning/README.md`
- Modify (by `$TEN/lanes.mjs 10`): `index.html` (the card after Game of Life's, the `PV` key, the `PLACES` row, the `FIND` row (the finder is on the branch), every count 166 → 167), `README.md` (counts, 07's count 23 → 24, the catalog line), `animations/07-ambient-background/README.md` (its line and its Implementation summary row), `.github/ISSUE_TEMPLATE/config.yml`, `404.html`
- Modify (Step 4, by hand): `index.html`: the preview's CSS at the end of the 07 bespoke block, `case 'lightning':` in `pvMarkup()`, a `STILL` point
- Regenerate: `sitemap.xml`, `llms.txt`, `skills/animation-handbook/` (their tools)
- Test: `tests/*.test.js`; the page check of the new page and of the home page; the review kit's short screens, a gallery for the defaults and for each other choice in Try it, clips of the defaults and of the timing settings' choices; frame times
- Write (run folder): `$TEN/checks/L10/` (logs, screenshots, kit output), `$TEN/reports/L10/build.md`, `fix-<k>.md`; the reviewer `review-<k>.md`

**Interfaces:**
- Consumes: Task 0's worktree `.claude/worktrees/ten-L10` on `ten/L10`, its server on port 8970 (started and stopped by the coordinator), `$TEN/lanes.mjs`, `$TEN/frametimes.mjs`, the shared-file version N in the ledger; Phase 0's shared files, its mode press (the shared script presses nothing on a loop after See inside or Compare) and its page check; the rollout's review kit and wait tool.
- Produces: branch `ten/L10`: the card `['lightning','Lightning','Jagged bolts strike from the clouds and light up the sky. Best for dramatic intros.']` (07.26), `PV` key `'lightning':'lightning'`, `PLACES` `['bg','intro']`, `FIND` `'lightning':['background shape','loop click','glitch color']`; Previous: Game of Life (for now: Task 11 points it at the page before it in the section); no Next link yet. The reports in `$TEN/reports/L10/`, which the rollout's final review (part 9) reads too.

- [ ] **Step 1: The lane's shared edits (the failing tests)**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L10 || exit 1
node $TEN/lanes.mjs 10 .
git status --short
node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)" | head -10
```

Expected: `lane 10 shared edits applied to .`; then ` M .github/ISSUE_TEMPLATE/config.yml`, ` M 404.html`, ` M README.md`, ` M animations/07-ambient-background/README.md`, ` M index.html`; then these 6 failing tests and `ℹ fail 6`: `✖ make-famous: on the real home page every card builds, but the eight whose previews need a script or animate in SVG`, `✖ the answers keep the rules every page of a kind shares: transitions answer newpage, loops loop, scroll pages scroll`, `✖ the Full catalog in the root README lists every card once, in home order, linked to its live page`, `✖ the counts written in the issue template, the 404 page and the sitemap match the cards`, `✖ the skill and llms.txt are what tools/make-skill.mjs writes from the pages and the home page now`, `✖ llms.txt lists every card once, in the order of CATS, with its live address and its description, and links the skill files`. (Famous effects' test builds every card's preview, which Step 4 adds; the finder's reads each page's kind, from a page that is not there yet; this plan's run of every lane on a copy of `feat/ten-animations` at `ece2689`, the finder and Famous effects there, gave exactly these.) If `lanes.mjs` stops with `not found (…)`, stop and tell the coordinator, who alone edits `$TEN/lanes.mjs`; before running it again, put the worktree back with `git checkout -- .` (this step makes no other changes; the tool refuses a second run on a changed tree).

- [ ] **Step 2: Write the page: `animations/07-ambient-background/lightning/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lightning — Animation Handbook</title>
  <meta name="description" content="Jagged bolts strike from the clouds and light up the sky. Best for dramatic intros.">
  <link rel="canonical" href="https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/lightning/">
  <link rel="icon" type="image/png" sizes="96x96" href="../../../favicon.png">
  <link rel="icon" type="image/svg+xml" href="../../../favicon.svg">
  <link rel="apple-touch-icon" href="../../../apple-touch-icon.png">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Animation Handbook">
  <meta property="og:title" content="Lightning — Animation Handbook">
  <meta property="og:description" content="Jagged bolts strike from the clouds and light up the sky. Best for dramatic intros.">
  <meta property="og:url" content="https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/lightning/">
  <meta property="og:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Lightning — Animation Handbook">
  <meta name="twitter:description" content="Jagged bolts strike from the clouds and light up the sky. Best for dramatic intros.">
  <meta name="twitter:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
  <script type="application/ld+json">{"@context": "https://schema.org", "@type": "TechArticle", "headline": "Lightning", "name": "Lightning", "description": "Jagged bolts strike from the clouds and light up the sky. Best for dramatic intros.", "url": "https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/lightning/", "inLanguage": "en", "articleSection": "Ambient & Background", "isPartOf": {"@type": "WebSite", "name": "Animation Handbook", "url": "https://matinmonshizadeh.github.io/animation-handbook/"}, "author": {"@type": "Person", "name": "matinmonshizadeh"}, "keywords": "web animation, CSS animation, Ambient & Background, Lightning"}</script>
  <style>
    :root{--ui-accent:#ffce5a}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    .stage{position:relative;overflow:hidden;background:linear-gradient(#0b1020,#1a2236 55%,#262c40)}
    /* The storm in layers: clouds (moved by the script), the rain on one canvas, the bolts on another, the hills in front, and
       the light of the sky as a white layer whose opacity the script sets (never above 30%) */
    .clouds{position:absolute;left:0;top:-4%;width:200%;height:44%;background-size:50% 100%;background-repeat:repeat-x;pointer-events:none}
    .c1{background-image:radial-gradient(30% 46% at 18% 30%,#3a4258,#0000 70%),radial-gradient(26% 38% at 52% 20%,#323a50,#0000 70%),radial-gradient(34% 44% at 84% 34%,#3a4258,#0000 70%)}
    .c2{top:4%;opacity:.8;background-image:radial-gradient(24% 34% at 30% 46%,#2a3146,#0000 70%),radial-gradient(30% 40% at 72% 40%,#2e354b,#0000 70%)}
    #cvs,.rain{position:absolute;inset:0;width:100%;height:100%;display:block}
    .rain{pointer-events:none}
    #cvs:focus-visible{outline:2px solid var(--ui-accent);outline-offset:-3px}
    .hills{position:absolute;left:0;bottom:0;width:100%;height:30%;display:block;pointer-events:none}
    .flash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none}
    /* See inside and Compare: plain words over the picture */
    .lt-lbl{display:none;position:absolute;max-width:46%;padding:3px 8px;border-radius:6px;background:rgba(8,10,18,.9);color:#f4f4f2;
      font:600 13px/1.25 var(--hb-font);pointer-events:none}
    .stage[data-hb-mode="inside"] .in,.stage[data-hb-mode="compare"] .half{display:block}
    .half{top:10px}.half.first{left:10px}.half.second{left:calc(50% + 10px)}
  </style>
  <link rel="stylesheet" href="../../../assets/css/demo-page.css?v=10">
  <script src="../../../assets/js/demo-page.js?v=10" defer></script>
</head>
<body class="hb" data-hb-kind="loop">
<nav class="hb-bar" aria-label="Animation Handbook">
  <a class="hb-home" href="../../../"><svg class="hb-mark" viewBox="0 0 32 32" aria-hidden="true"><g class="g"><circle cx="11.16" cy="20.84" r="6.1"/><circle cx="15.12" cy="16.88" r="6.1"/><circle cx="18.51" cy="13.49" r="6.1"/></g><circle class="b" cx="21.2" cy="10.8" r="6.6"/></svg><span>Animation Handbook</span></a>
  <span class="hb-pager"><a href="../game-of-life/" rel="prev" aria-label="Previous: Game of Life"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg><span><span class="hb-dir">Previous: </span>Game of Life</span></a></span>
  <a class="hb-star" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener" aria-label="Star on GitHub"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg><span>Star on GitHub</span></a>
</nav>
<main class="hb-page">
  <header class="hb-head">
    <p class="hb-cat">07.26 · Ambient &amp; Background</p>
    <h1>Lightning</h1>
    <p class="hb-lede">Jagged bolts strike from the clouds and light up the sky. Best for dramatic intros.</p>
  </header>

  <section class="hb-step hb-watch" aria-labelledby="hb-watch-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">1</span>
      <div><h2 id="hb-watch-title">Watch it</h2><p>It moves by itself. Click or tap the sky to make a bolt strike there.</p></div>
    </div>
    <div class="seg hb-modes" role="group" aria-label="What the box shows" data-hb-modes>
      <button type="button" data-hb-mode="normal" class="on" aria-pressed="true">Normal</button>
      <button type="button" data-hb-mode="inside" aria-pressed="false">See inside</button>
      <button type="button" data-hb-mode="compare" aria-pressed="false">Compare</button>
    </div>
    <div class="stage">
      <i class="clouds c1" aria-hidden="true"></i><i class="clouds c2" aria-hidden="true"></i>
      <canvas class="rain" aria-hidden="true"></canvas>
      <canvas id="cvs" role="img" tabindex="0" aria-label="A storm over dark hills where a bolt strikes every few seconds. Click, or press Enter or Space, to make one strike."></canvas>
      <svg class="hills" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true"><path fill="#141a2a" d="M0 120Q140 40 300 110T620 90T1000 110V300H0Z"/><path fill="#0b0f1a" d="M0 190Q200 130 380 180T760 160T1000 170V300H0Z"/></svg>
      <i class="flash" aria-hidden="true"></i>
      <p class="lt-lbl in" id="l-straight" aria-hidden="true" data-hb-caption>Starts straight</p>
      <p class="lt-lbl in" id="l-split" aria-hidden="true" data-hb-caption>Each split pushes the middle aside, less each time</p>
      <p class="lt-lbl in" id="l-fork" aria-hidden="true" data-hb-caption>Forks branch off</p>
      <p class="lt-lbl in" id="l-glow" aria-hidden="true" data-hb-caption>Glow · a wide, faint copy</p>
      <p class="lt-lbl half first" aria-hidden="true" data-hb-caption>Even zigzag</p>
      <p class="lt-lbl half second" aria-hidden="true" data-hb-caption>Random splits</p>
    </div>
    <div class="hb-player">
      <button class="hb-play" type="button" id="btn-pause" data-hb-pause data-state="playing"><svg class="hb-ic hb-i-pause" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg><svg class="hb-ic hb-i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3l14 9-14 9z"/></svg><span class="hb-pause-label">Pause</span></button>
      <label class="hb-toggle"><input class="hb-switch" type="checkbox" role="switch" id="slow-tog" data-hb-slowmo autocomplete="off"><span>Slow motion</span></label>
    </div>
    <div class="hb-mode-notes" aria-live="polite">
      <p data-hb-for="inside" hidden>Inside, each bolt is drawn round by round: a straight line, split again and again with each middle pushed aside by less, then forks and a soft glow.</p>
      <p data-hb-for="compare" hidden>On the left, Even zigzag bends in equal steps, so it looks drawn. On the right, Random splits pushes each split aside by less, so it has big bends and fine jitter.</p>
    </div>
  </section>

  <section class="hb-step hb-try" aria-labelledby="hb-try-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">2</span>
      <div><h2 id="hb-try-title">Try it</h2><p>Change a setting and see the difference as it moves.</p></div>
    </div>
    <div class="hb-settings">
      <div class="hb-setting">
        <p class="hb-setting-name" id="often-lbl">How often</p>
        <div class="seg" id="often-seg" role="group" aria-labelledby="often-lbl">
          <button type="button" data-often="rarely" aria-pressed="false">Rarely</button>
          <button type="button" data-often="sometimes" class="on" aria-pressed="true">Sometimes</button>
          <button type="button" data-often="often" aria-pressed="false">Often</button>
        </div>
        <p class="hb-hint">Rarely keeps it calm behind text.</p>
      </div>
      <div class="hb-setting">
        <p class="hb-setting-name" id="forks-lbl">Branches</p>
        <div class="seg" id="forks-seg" role="group" aria-labelledby="forks-lbl">
          <button type="button" data-forks="2" aria-pressed="false">Few</button>
          <button type="button" data-forks="4" class="on" aria-pressed="true">Some</button>
          <button type="button" data-forks="7" aria-pressed="false">Many</button>
        </div>
        <p class="hb-hint">How many thinner forks split off.</p>
      </div>
      <div class="hb-setting">
        <p class="hb-setting-name" id="color-lbl">Bolt color</p>
        <div class="swatches" id="color-sw" role="group" aria-labelledby="color-lbl">
          <button type="button" class="on" aria-pressed="true" aria-label="White" data-rgb="235,240,255" style="background:#ebf0ff"></button>
          <button type="button" aria-pressed="false" aria-label="Blue" data-rgb="140,196,255" style="background:#8cc4ff"></button>
          <button type="button" aria-pressed="false" aria-label="Violet" data-rgb="200,164,255" style="background:#c8a4ff"></button>
        </div>
        <p class="hb-hint">The bolt and its glow.</p>
      </div>
    </div>
    <details class="hb-options">
      <summary><span class="hb-more-label">More options</span><span class="hb-less">Fewer options</span><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary>
      <div class="hb-settings">
        <div class="hb-setting">
          <label class="hb-switch-row"><span>Lights up the sky</span><input class="hb-switch" type="checkbox" role="switch" id="sky-tog" checked autocomplete="off"></label>
          <p class="hb-hint">The sky glows softly with each strike.</p>
        </div>
        <div class="hb-setting">
          <label class="hb-switch-row"><span>Rain</span><input class="hb-switch" type="checkbox" role="switch" id="rain-tog" checked autocomplete="off"></label>
          <p class="hb-hint">Light rain falls through the storm.</p>
        </div>
      </div>
    </details>
  </section>

  <section class="hb-step hb-prompt-step" aria-labelledby="hb-prompt-title">
    <div class="hb-step-head">
      <span class="hb-num" aria-hidden="true">3</span>
      <div><h2 id="hb-prompt-title">Copy the prompt</h2><p>Paste it into an AI assistant such as ChatGPT, Claude or Cursor to build this in your own project.</p></div>
    </div>
    <div class="hb-card">
      <p class="hb-prompt">Add lightning to [the dark section or storm scene you want it in]. Every so often, draw a jagged bolt from the clouds to the ground on a canvas: start from a straight line, split it again and again, pushing each new midpoint sideways at random by less each time, and let thinner forks branch off. Draw a wide, faint stroke under a thin bright one for the glow; the bolt flickers once and fades within half a second. When the settings include it, light the sky softly, never more than twice a second. A click or tap strikes where the visitor points. If the visitor has reduced motion turned on, show a still bolt with no flash. Match the settings listed below.</p>
      <div class="hb-chips-box" hidden>
        <p class="hb-chips-title">Your settings</p>
        <ul class="hb-chips"></ul>
      </div>
      <div class="hb-copy-row">
        <button class="hb-copy" type="button"><svg class="hb-ic hb-i-copy" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><svg class="hb-ic hb-i-done" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span class="hb-copy-label" aria-live="polite">Copy prompt</span></button>
        <p class="hb-hint">Replace the words in brackets with your own element. Your settings are added at the end.</p>
      </div>
    </div>
    <div class="hb-star-row"><p>Free and open source. If this helped, a star on GitHub helps other people find it.</p><a class="hb-star-btn" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>Star on GitHub</a></div>
  </section>

  <section class="hb-about" aria-labelledby="hb-what-title">
    <div class="hb-what">
      <h2 id="hb-what-title">What it is</h2>
      <div class="hb-what-text"><p>The full explanation is in <a href="README.md">README.md</a>.</p></div>
    </div>
    <div class="hb-fit">
      <h2>Good for</h2>
      <ul class="hb-tags hb-good"><li>Game sites</li><li>Storm and weather themes</li><li>Dramatic intros</li></ul>
      <h3>Avoid on</h3>
      <ul class="hb-tags hb-avoid"><li>Reading pages</li><li>Calm or health sites</li></ul>
    </div>
  </section>

  <section class="hb-related" aria-labelledby="hb-related-title" hidden>
    <h2 id="hb-related-title">Similar animations</h2>
    <div class="hb-rel-list"></div>
  </section>
</main>
<footer class="hb-foot"><span>Animation Handbook</span><a href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener">Source on GitHub</a><a href="#top">Back to top ↑</a></footer>
<script>
  const cvs=document.getElementById('cvs'),ctx=cvs.getContext('2d'),stage=cvs.parentElement,rain=stage.querySelector('.rain'),rctx=rain.getContext('2d');
  const clouds=[...stage.querySelectorAll('.clouds')],flash=stage.querySelector('.flash');
  const slowTog=document.getElementById('slow-tog'),skyTog=document.getElementById('sky-tog'),rainTog=document.getElementById('rain-tog');
  const reduceMQ=matchMedia('(prefers-reduced-motion: reduce)'),phone=matchMedia('(max-width:600px),(max-height:500px)');
  const FRAME=1000/60,GAP=1500; // safety: strikes start at least 1.5 s apart, whatever is pressed, so at most two flashes in any second
  const EVERY={rarely:[5000,8000],sometimes:[2600,4400],often:[1600,2400]}; // the wait between strikes, in ms, picked at random
  const LABELS={normal:'A storm over dark hills where a bolt strikes every few seconds. Click, or press Enter or Space, to make one strike.',
    inside:'The bolt drawn round by round: a straight line split again and again, its forks numbered and its glow. Click, or press Enter or Space, to strike.',
    compare:'Two bolts strike together: an even zigzag on the left and random splits on the right. Click, or press Enter or Space, to strike.'};
  let often='sometimes',forks=4,rgb=[235,240,255],mode='normal',paused=false;
  let W=0,H=0,raf=0,lastT=null,t=0,lastStrike=-1e9,nextAt=900,pending=null,strike=null,drops=[],shownKey='';
  let seed=5;const rand=()=>{seed=seed+0x6D2B79F5|0;let x=Math.imul(seed^seed>>>15,1|seed);x=x+Math.imul(x^x>>>7,61|x)^x;return((x^x>>>14)>>>0)/4294967296};
  // A bolt from (x0, y0) to (x1, y1), split rounds times: each segment's midpoint is pushed sideways at random by up to off,
  // and off halves every round. Every round is kept, so See inside can draw them one after another.
  function split(x0,y0,x1,y1,rounds,off){
    let pts=[[x0,y0],[x1,y1]];const steps=[pts];
    for(let k=0;k<rounds;k++,off/=2){
      const next=[pts[0]];
      for(let i=1;i<pts.length;i++){const [ax,ay]=pts[i-1],[bx,by]=pts[i],l=Math.hypot(bx-ax,by-ay)||1,o=(rand()*2-1)*off;
        next.push([(ax+bx)/2-(by-ay)/l*o,(ay+by)/2+(bx-ax)/l*o],pts[i])}
      steps.push(pts=next);
    }
    return steps;
  }
  // The common mistake: the same line bent in equal steps, from side to side, like an icon
  function zigzag(x0,y0,x1,y1){
    const n=8,l=Math.hypot(x1-x0,y1-y0),a=l*.06,pts=[];
    for(let i=0;i<=n;i++){const s=i%2?a:-a,k=i/n,e=i===0||i===n?0:s;pts.push([x0+(x1-x0)*k-(y1-y0)/l*e,y0+(y1-y0)*k+(x1-x0)/l*e])}
    return [pts];
  }
  // A whole strike in a rectangle (x, w): the main bolt from the clouds to (tx, ty), and its forks from points along it (fp: where
  // along the bolt each fork starts, its side and its length as a share of the bolt's); even: the mistake, zigzags in equal steps
  function makeBolt(x,w,tx,ty,even,fp){
    const sx=Math.min(x+w-8,Math.max(x+8,tx+(rand()-.5)*w*.25)),sy=H*.1,len=Math.hypot(tx-sx,ty-sy);
    const main=even?zigzag(sx,sy,tx,ty):split(sx,sy,tx,ty,7,len*.22),line=main[main.length-1],fk=[];
    for(const [at,side,k] of fp){const p=line[Math.floor(at*(line.length-1))],fl=len*k,ex=p[0]+side*fl*.6,ey=p[1]+fl*.8;
      fk.push(even?zigzag(p[0],p[1],ex,ey):split(p[0],p[1],ex,ey,5,fl*.2))}
    return {main,forks:fk};
  }
  // The bolts of a strike that lands at (tx, ty): one for Normal and See inside, and for Compare one in each half, at the same place
  // in its half, with forks in the same places. A resize or a new number of branches draws them again for the same spot, keeping
  // the strike's time.
  function bolts(tx,ty){
    const half=W/2,u=tx/W,fp=[...Array(forks)].map(()=>[.18+.55*rand(),rand()<.5?-1:1,.22+.2*rand()]);
    return {tx,ty,bolt:makeBolt(0,W,tx,ty,false,fp),left:makeBolt(0,half,u*half,ty,true,fp),right:makeBolt(half,half,half+u*half,ty,false,fp)};
  }
  // A strike where the visitor pointed, or on the ground under a random spot
  function strikeNow(at){
    strike={at:t,still:false,full:false,...bolts(at?at.x:W*(.25+.5*rand()),at?at.y:H*(.74+.06*rand()))};
    lastStrike=t;nextAt=t+EVERY[often][0]+rand()*(EVERY[often][1]-EVERY[often][0]);
    placeLabels();
  }
  function redrawBolts(){if(strike){Object.assign(strike,bolts(strike.tx,strike.ty));placeLabels()}draw()}
  // How bright a strike is, age ms after it began: a flicker (bright, dim, bright) that fades within half a second; under reduced
  // motion a soft fade in and out with no flicker
  function bright(age){
    if(reduceMQ.matches)return age<250?age/250:age<600?1:age<1100?1-(age-600)/500:0;
    return age<60?1:age<120?.35:age<180?.9:age<500?.9*(1-(age-180)/320):0;
  }
  const col=a=>`rgba(${rgb.join()},${a})`;
  let numFont='700 12px sans-serif'; // the site font for the forks' numbers, read once the page's styles are in (resize)
  function stroke(pts,w,style,dash){ctx.lineWidth=w;ctx.strokeStyle=style;ctx.setLineDash(dash||[]);ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke()}
  // A bolt as it looks: a wide, faint stroke for the glow under a thin bright one (no shadow blur); forks thinner, all of them in
  // one path, so a frame of a flash strokes four paths a bolt
  function strokeAll(lines,w,style){ctx.lineWidth=w;ctx.strokeStyle=style;ctx.setLineDash([]);ctx.beginPath();for(const pts of lines)pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke()}
  function drawBolt(b,a){
    if(a<=0)return;
    const main=[b.main[b.main.length-1]],forks=b.forks.map(f=>f[f.length-1]);
    strokeAll(main,11,col(.18*a));strokeAll(forks,6.5,col(.18*a));strokeAll(main,2.2,`rgba(255,255,255,${a})`);strokeAll(forks,1.3,`rgba(255,255,255,${a})`);
  }
  // See inside: the bolt round by round (the straight line dashed, each later round lighter, the pushed points dotted), then the
  // forks numbered, then the glow. A strike builds it a round every 110 ms; between strikes the last drawing stays, faint.
  function drawRounds(b,age){
    const shown=age===null?99:age/110,f=age===null||age>1800?.7:1,main=b.main;
    main.forEach((pts,k)=>{if(k>shown)return;
      if(k===0)stroke(pts,1.5,`rgba(220,226,240,${.8*f})`,[6,6]);
      else stroke(pts,k===7?2.2:1.2,k===7?`rgba(255,255,255,${f})`:`rgba(${rgb.join()},${(.15+.08*k)*f})`);
      if(k>0&&k<5){ctx.fillStyle=`rgba(255,206,90,${.9*f})`;pts.forEach((p,i)=>{if(i%2){ctx.beginPath();ctx.arc(p[0],p[1],k<3?3:2,0,6.283);ctx.fill()}})}});
    if(shown>8)b.forks.forEach((fk,i)=>{const pts=fk[fk.length-1],q=pts[Math.floor(pts.length*.55)];stroke(pts,1.2,col(.8*f));
      // the fork's number sits a little way along the fork, clear of the main bolt
      ctx.fillStyle=`rgba(8,10,18,${.9*f})`;ctx.beginPath();ctx.arc(q[0],q[1],9,0,6.283);ctx.fill();
      ctx.fillStyle=`rgba(255,255,255,${f})`;ctx.font=numFont;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(i+1,q[0],q[1]+.5)});
    if(shown>9)stroke(main[7],11,col(.18*f));
  }
  // The rain has its own canvas, drawn every frame; the bolts' canvas is drawn only when it changes
  function drawRain(){
    rctx.clearRect(0,0,W,H);
    if(!rainTog.checked)return;
    rctx.strokeStyle=mode==='inside'?'rgba(170,190,230,.15)':'rgba(170,190,230,.35)';rctx.lineWidth=1;rctx.beginPath();
    for(const d of drops){rctx.moveTo(d.x,d.y);rctx.lineTo(d.x-2,d.y+d.l)}rctx.stroke();
  }
  function drawBolts(){
    ctx.clearRect(0,0,W,H);
    // a still bolt (paused, under reduced motion or after a click while paused) shows at full strength with no light in the sky
    const age=strike?t-strike.at:1e9,a=strike?(strike.still?1:bright(age)):0;
    ctx.lineCap=ctx.lineJoin='round';
    if(mode==='inside'&&strike)drawRounds(strike.bolt,age<2000&&!strike.still&&!strike.full?age:null);
    else if(mode==='compare'&&strike){
      // each half's bolt stays inside its own half, even where its bends or forks reach toward the other
      [strike.left,strike.right].forEach((b,i)=>{ctx.save();ctx.beginPath();ctx.rect(i?W/2+1:0,0,W/2-1,H);ctx.clip();drawBolt(b,a);if(a<=0)drawBolt(b,.3);ctx.restore()});
      ctx.fillStyle='#05070d';ctx.fillRect(W/2-1,0,2,H)}
    else if(strike)drawBolt(strike.bolt,a);
    flash.style.opacity=mode!=='inside'&&skyTog.checked&&!reduceMQ.matches&&strike&&!strike.still?(.3*a).toFixed(3):0;
  }
  function draw(){drawRain();drawBolts();shownKey=boltKey()}
  // What the bolts' canvas shows, as a key that changes every frame while a strike flashes and once a round (every 110 ms)
  // while See inside builds it; the loop draws the canvas again only when the key changes
  function boltKey(){
    if(!strike||strike.still)return mode+'still';
    const age=t-strike.at;
    if(mode==='inside')return strike.full||age>=2000?'built':'round'+Math.floor(age/110);
    return age<(reduceMQ.matches?1100:600)?'flash'+t:'after';
  }
  // See inside's labels beside the parts they name, on the side of the bolt and its forks where the box has more room
  function placeLabels(){
    if(!strike)return;
    const pts=[...strike.bolt.main[7],...strike.bolt.forks.flatMap(fk=>fk[fk.length-1])],xs=pts.map(p=>p[0]);
    const lo=Math.min(...xs),hi=Math.max(...xs),right=W-hi>lo,f=strike.bolt.forks[0];
    // each label at its height, or just under the one above when that one wraps onto more lines
    let below=0;
    const put=(id,y)=>{const el=document.getElementById(id),w=el.offsetWidth,top=Math.max(8,below+6,Math.min(H-el.offsetHeight-8,y));
      el.style.left=Math.max(8,Math.min(W-w-8,right?hi+20:lo-20-w))+'px';el.style.top=top+'px';below=top+el.offsetHeight};
    put('l-straight',H*.08);put('l-split',H*.3);put('l-fork',f?Math.min(H*.58,Math.max(H*.5,f[0][0][1]-10)):H*.52);put('l-glow',H*.72);
  }
  // The rain falls by the time that passed; fewer drops on phones
  function makeRain(){drops=Array.from({length:phone.matches?70:160},()=>({x:rand()*(W+40),y:rand()*H,l:8+rand()*10,v:.5+rand()*.3}))}
  // The loop moves the rain and the clouds and keeps the strikes by the time that passed (a third of it in slow motion). A strike
  // the visitor asked for waits until the gap since the last one is over.
  function loop(ts){
    raf=requestAnimationFrame(loop);
    if(lastT===null){lastT=ts;return}
    const dt=Math.min(ts-lastT,50)*(slowTog.checked?1/3:1);lastT=ts;t+=dt;
    if(t-lastStrike>=GAP&&(pending||t>=nextAt)){strikeNow(pending);pending=null}
    for(const d of drops){d.y+=d.v*dt;d.x-=d.v*dt*.12;if(d.y>H){d.y=-d.l;d.x=rand()*(W+40)}}
    clouds.forEach((c,i)=>{c.style.transform=`translateX(${-((t*(i?.006:.01))%W).toFixed(1)}px)`});
    drawRain();
    const key=boltKey();
    if(key!==shownKey){drawBolts();shownKey=key}
  }
  function start(){if(raf||paused)return;lastT=null;raf=requestAnimationFrame(loop)}
  // Registered at the top level: under reduced motion the shared script pauses the loop at once, on a still bolt
  // A still bolt starts fading when the loop plays again
  document.addEventListener('hb:pause',e=>{
    paused=e.detail.paused;notes();
    if(paused){cancelAnimationFrame(raf);raf=0;draw();return}
    if(strike&&strike.still){strike.still=false;strike.at=t-(reduceMQ.matches?600:180)}
    start();
  });
  document.addEventListener('visibilitychange',()=>{lastT=null});
  // The mode switch draws the mode at once; See inside opened while paused shows the last bolt's whole drawing
  document.addEventListener('hb:mode',e=>{mode=e.detail.mode;if(paused&&strike)strike.full=true;cvs.setAttribute('aria-label',LABELS[mode]);placeLabels();draw()});
  // A click, a tap, or Enter or Space on the box asks for a strike there (the middle, from the keyboard). While paused it draws a
  // new still bolt there at once, with no flash.
  function ask(at){
    if(!paused){pending=at;return}
    strikeNow(at);strike.still=true;lastStrike=-1e9;draw();
  }
  cvs.addEventListener('click',e=>{const r=cvs.getBoundingClientRect();ask({x:e.clientX-r.left,y:Math.max(H*.3,e.clientY-r.top)})});
  cvs.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();ask({x:W/2,y:H*.62})}});
  function resize(){
    const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h||(w===W&&h===H))return;
    const sx=W?w/W:1,sy=H?h/H:1;W=w;H=h;
    // thin lines stay sharp enough at one and a half pixels per CSS pixel, which spares a phone almost half the work
    const dpr=Math.min(devicePixelRatio||1,1.5);
    for(const [c,g] of [[cvs,ctx],[rain,rctx]]){c.width=W*dpr;c.height=H*dpr;g.setTransform(dpr,0,0,dpr,0,0)}
    numFont='700 12px '+getComputedStyle(stage).getPropertyValue('--hb-font');
    makeRain();
    if(strike){strike.tx*=sx;strike.ty*=sy}
    redrawBolts();
  }
  function choices(id,pick){
    const buttons=document.querySelectorAll('#'+id+' button');
    buttons.forEach(b=>b.addEventListener('click',()=>{
      buttons.forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',String(x===b))});
      pick(b.dataset);
    }));
  }
  // Branches and colors show at once, on the bolt on screen; How often counts from the next strike
  choices('often-seg',d=>{often=d.often;nextAt=Math.min(nextAt,lastStrike+EVERY[often][1])});
  choices('forks-seg',d=>{forks=+d.forks;redrawBolts()});
  choices('color-sw',d=>{rgb=d.rgb.split(',').map(Number);draw()});
  skyTog.addEventListener('change',draw);
  rainTog.addEventListener('change',draw);
  new ResizeObserver(resize).observe(stage);
  resize();
  // Under reduced motion the loop starts paused on a still bolt, and the notes say so while it is paused; playing, the markup's
  // words hold
  const said={inside:document.querySelector('[data-hb-for="inside"]').textContent,compare:document.querySelector('[data-hb-for="compare"]').textContent};
  const STILL={inside:'Shown still: the bolt is a straight line split again and again, each middle pushed aside by less, with its forks numbered and a soft glow.',
    compare:'Shown still: on the left, Even zigzag bends in equal steps, so it looks drawn; on the right, Random splits has big bends and fine jitter.'};
  function notes(){const still=reduceMQ.matches&&paused;for(const k of ['inside','compare'])document.querySelector(`[data-hb-for="${k}"]`).textContent=still?STILL[k]:said[k]}
  if(reduceMQ.matches){strikeNow({x:W*.62,y:H*.78});strike.still=true;lastStrike=-1e9;draw()}
  notes();
  start();
</script>
</body>
</html>
```

Then give it the shared-file version the branch uses (the ledger's N; nothing changes when N is 10):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L10 || exit 1
N=$(grep -o 'shared files ?v=[0-9]*' $TEN/ledger.md | head -1 | grep -o '[0-9]*$')
sed -i "s/demo-page\.css?v=10/demo-page.css?v=$N/; s/demo-page\.js?v=10/demo-page.js?v=$N/" animations/07-ambient-background/lightning/index.html
grep -c "demo-page\.css?v=$N\|demo-page\.js?v=$N" animations/07-ambient-background/lightning/index.html
```

Expected: `2`.

- [ ] **Step 3: Write the README: `animations/07-ambient-background/lightning/README.md`**

````markdown
# Lightning

[Live demo](https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/lightning/)

## What it is
Lightning draws jagged bolts that strike from the clouds to the ground every few seconds, flicker once and fade, while the sky lights up softly behind them. Each bolt is new: it starts as a straight line that is split again and again, every split pushing its middle aside by a little less, which gives the big bends and the fine jitter of real lightning. A click or tap makes a bolt strike where the visitor points.

## When to use it
- Game sites and trailers that want a dramatic opening
- Storm, weather and night themes
- Event and launch intros with a burst of energy
- Halloween and fantasy pages

## How it works
A bolt is built once per strike, by midpoint displacement. It starts as one segment from a point in the clouds to the spot it strikes. Each round splits every segment in two and pushes the new midpoint sideways, at random, by up to a set distance; that distance halves every round. Seven rounds turn the straight line into 129 points: the first rounds make the large bends, the later ones the fine jitter. Every round is kept, so the demo's See inside can draw them one after another:

```js
function split(x0, y0, x1, y1, rounds, off) {
  let pts = [[x0, y0], [x1, y1]]; const steps = [pts];
  for (let k = 0; k < rounds; k++, off /= 2) {
    const next = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i], l = Math.hypot(bx - ax, by - ay) || 1, o = (rand() * 2 - 1) * off;
      next.push([(ax + bx) / 2 - (by - ay) / l * o, (ay + by) / 2 + (bx - ax) / l * o], pts[i]);
    }
    steps.push(pts = next);
  }
  return steps;
}
```

The first push is about a fifth of the bolt's length. Forks start at points along the finished bolt and are split five times on their own, shorter and thinner. Each bolt is drawn twice on the canvas, with no shadow blur: a wide, faint stroke in the bolt's color for the glow, then a thin white one on top. Its brightness follows the time since the strike: full, dim, full again within a fifth of a second, then a fade to nothing by half a second. The sky's light is a white layer over the scene whose opacity is that brightness times 0.3, so it is never more than 30% white. Rain is a set of short lines moved by the time that passed; the clouds are two soft layers slid sideways with transforms.

**Safety.** A strike starts at least 1.5 seconds after the one before, whatever is pressed: a click that comes sooner waits its turn. One strike flashes twice (bright, dim, bright), so the scene never flashes more than twice in any second, well within the limit of three that keeps flashing content safe for people with photosensitive epilepsy.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| How often | Sometimes | The wait between strikes, picked at random: rarely is 5 to 8 seconds, sometimes 2.6 to 4.4 seconds and often 1.6 to 2.4 seconds; never less than 1.5 seconds |
| Branches | Some | How many thinner forks split off the bolt: few is 2, some 4 and many 7 |
| Bolt color | White | The color of the glow around the white core: white, blue or violet |
| Lights up the sky | on | The sky turns at most 30% white with each strike and follows its flicker; off, only the bolt flashes |
| Rain | on | 160 thin raindrops fall at a slant (70 on phones); off, the sky is clear of rain |

## Production notes
- **Flash safely.** Keep strikes at least a second and a half apart, cap the sky's light (here 30% white) and never flash a large area at full white. Under reduced motion, show a still bolt and fade bolts in and out with no flicker and no sky light.
- **No shadow blur.** Canvas `shadowBlur` on a long path is slow on phones; a wide, faint stroke under the bright one gives the glow for the cost of one more line.
- **Build once per strike.** The bolt's points are worked out when it strikes, not every frame; each frame only draws the saved lines.
- **Layers that need no redraw.** The clouds and hills are elements of their own, moved with transforms or not at all; only the rain and the bolt are drawn on the canvas each frame.
- **Libraries.** Three.js and PixiJS draw the same polylines as lines or meshes with additive blending; GSAP can drive the flicker and the sky's opacity with a short timeline.

## See also
- [Fireworks](../fireworks/) — bright strokes with a soft glow on a canvas
- [Snow / Rain](../snow-rain/) — rain and snow falling over a scene
- [Flash / Light Leak Transition](../../03-page-transitions/flash-transition/) — a flash kept within safe limits
````

- [ ] **Step 4: The home page preview**

In the worktree's `index.html`: (a) insert these lines, and one empty line after them, right before the line `/* ── bespoke: added demos ── */` (the end of the 07 bespoke block):

```css
.pv-lightning{background:linear-gradient(#0b1020,#1a2236 60%,#262c40);overflow:hidden}
.pv-lightning .hl{position:absolute;left:0;right:0;bottom:0;height:30%;background:radial-gradient(70% 90% at 25% 100%,#141a2a 60%,#0000 61%),radial-gradient(80% 100% at 85% 100%,#0b0f1a 60%,#0000 61%)}
.pv-lightning .bt{position:absolute;inset:0;width:100%;height:100%;opacity:0;animation:lightning-bolt 3s linear infinite}
.pv-lightning .bt path{fill:none;stroke-linecap:round;stroke-linejoin:round}
.pv-lightning .g{stroke:rgba(200,215,255,.28);stroke-width:5}.pv-lightning .c{stroke:#fff;stroke-width:1.4}.pv-lightning .f{stroke-width:.9}
.pv-lightning .fl{position:absolute;inset:0;background:#fff;opacity:0;animation:lightning-sky 3s linear infinite}
@keyframes lightning-bolt{0%{opacity:0}1.5%{opacity:1}3%{opacity:.35}4.5%{opacity:.9}14%,100%{opacity:0}}
@keyframes lightning-sky{0%{opacity:0}1.5%{opacity:.22}3%{opacity:.08}4.5%{opacity:.2}14%,100%{opacity:0}}
```

(b) insert this line right before the line that starts with `case 'aurora':` (after the end of the `case 'life':` block):

```js
    case 'lightning': return '<span class="hl"></span><svg class="bt anim" viewBox="0 0 160 100"><path class="g" d="M96 6L88 22 94 30 80 46 86 52 74 70 78 76 70 88"/><path class="g" d="M86 52L98 62 96 72"/><path class="c" d="M96 6L88 22 94 30 80 46 86 52 74 70 78 76 70 88"/><path class="c f" d="M86 52L98 62 96 72"/></svg><span class="fl anim"></span>';
```

(c) in `const STILL={`, the map's last line ends with `izoom:.02` (the line before `};`): make it end with `izoom:.02,lightning:.016` (the middle of its loop is not a clear frame; reduced motion holds the preview there).

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L10 || exit 1
grep -c "pv-lightning" index.html; grep -c "case 'lightning':" index.html
```

Expected: a number above 1 (the preview's CSS rules), then `1` (its case).

- [ ] **Step 5: Write the generated files, then the tests pass**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L10 || exit 1
node tools/update-sitemap.mjs && node tools/make-skill.mjs
node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)"
```

Expected: `ℹ fail 0` (this plan's run of every lane on a copy of `feat/ten-animations` at `ece2689`, the finder and Famous effects there, gave it: 1717 pass). If only `tests/finder.test.js` fails (its case 9 waits for Task 11 when the finder has changed since), note the failing lines in your report for Task 11 (lanes never change `tests/`) and go on; any other failure names what to fix in this lane's files.

- [ ] **Step 6: The page check and the short screens (each a background command, waited on)**

The coordinator's server for this lane answers on port 8970: `curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8970/` prints `200` (if not, ask the coordinator). The review kit finds pages under its own folder's root, so it runs from a copy in the worktree (`.superpowers/` is ignored by git):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit
cd $REPO/.claude/worktrees/ten-L10 || exit 1
mkdir -p .superpowers/sdd/kit/review-kit $TEN/checks/L10 && cp $KIT/record.mjs $KIT/kit-lib.mjs .superpowers/sdd/kit/review-kit/ && git status --short | grep -c superpowers
```

Expected: `0` (git does not see the copy). Then start these two, each as its own background command (the round number `1`, then `2`, `3` after fixes):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L10 || exit 1
node $RUN/slot.mjs run ten-L10 -- node tools/check-pages.mjs --base http://127.0.0.1:8970 --out $TEN/checks/L10/1 animations/07-ambient-background/lightning home > $TEN/checks/L10/1.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L10/1.log
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L10 || exit 1
node $RUN/slot.mjs run ten-L10 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8970 --short --out $TEN/checks/L10/short-1 animations/07-ambient-background/lightning > $TEN/checks/L10/short-1.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L10/short-1.log
```

Wait on each with `node $RUN/wait-log.mjs $TEN/checks/L10/1.log` and `… short-1.log` (again while it says `still running`), then: `grep -c '^ok' $TEN/checks/L10/1.log; grep '^FAIL' $TEN/checks/L10/1.log; tail -2 $TEN/checks/L10/short-1.log`.

Expected: `12` (six `ok` lines each for `lightning`, the home page), no `FAIL` line, and `27 short-screen pictures checked, 0 with labels cut or overlapping, 0 skipped, 0 failed` with `EXIT=0` (this plan's runs gave exactly these). A `FAIL` line or a cut or overlapping label names the problem (the real branch may differ from the copy this plan was checked on; the ledger's first line says how): fix it in this lane's files, keeping the page's behavior, and run both again as round 2, 3; every round after a change ends with all lines `ok`.

- [ ] **Step 7: Every choice in Try it, in both views (acceptance 7), and the motion in clips**

Two background commands. The first runs the kit's gallery (pictures only: Normal, See inside and Compare at 1280 and 375) once with the defaults (`press-0`) and once for each choice that is not a default and each switch in Try it (never Loop, Slow motion, Pause or Play: playback is not a setting), each into its own folder. The second records the clips (Normal, See inside and Compare at 1280, about seven seconds each, frames kept) with the defaults (`clip-0`) and for each choice of the settings that change only timing or show only while the demo moves (G1, G11): the stills never show a run's middle.

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L10 || exit 1
i=0; for sel in "" "#often-seg [data-often='rarely']" "#often-seg [data-often='often']" "#forks-seg [data-forks='2']" "#forks-seg [data-forks='7']" "#color-sw [data-rgb='140,196,255']" "#color-sw [data-rgb='200,164,255']" "#sky-tog" "#rain-tog"; do echo "== press-$i ${sel:-defaults}"; node $RUN/slot.mjs run ten-L10 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8970 --gallery ${sel:+--press "$sel"} --out $TEN/checks/L10/press-$i animations/07-ambient-background/lightning || echo "run $i failed"; i=$((i+1)); done > $TEN/checks/L10/press.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L10/press.log
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L10 || exit 1
i=0; for sel in "" "#often-seg [data-often='rarely']" "#often-seg [data-often='often']" "#sky-tog"; do echo "== clip-$i ${sel:-defaults}"; node $RUN/slot.mjs run ten-L10 -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8970 --only clips --keep-frames ${sel:+--press "$sel"} --out $TEN/checks/L10/clip-$i animations/07-ambient-background/lightning || echo "run $i failed"; i=$((i+1)); done > $TEN/checks/L10/clips.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L10/clips.log
```

Wait on each log with `node $RUN/wait-log.mjs`. Expected: 9 `== press-…` lines, each run ending `done  6 pictures, 0 clips and 0 comparisons made, 0 skipped, 0 failed`, and 4 `== clip-…` lines, each ending `done  0 pictures, 3 clips and 0 comparisons made, 0 skipped, 0 failed`; no `failed` line, no `was not found`, `EXIT=0` (the kit's lines as this plan's runs printed them). Read each gallery's See inside and Compare pictures at 1280 beside `press-0`'s: each choice visibly changes Normal and both views. Read three frames from the middle of each See inside and Compare clip (the log's `frames kept in <folder>` lines name the folders; for a timing choice, the same frames beside `clip-0`'s): the views move as the spec says, nothing jumps or covers the stage in mid-run (this plan's clips found See inside's small copy filling Pixelate Transition's stage while the blocks were small, a fault no still showed). A choice that changes nothing in a view is a fix (the owner's rule: every setting and control visibly changes the stage and both views). Then remove the frame folders: `grep -o 'frames kept in .*' $TEN/checks/L10/clips.log | sed 's/^frames kept in //' | while read -r f; do rm -rf "$f"; done`.

- [ ] **Step 8: Look at the screenshots and check by hand**

Open `$TEN/checks/L10/<round>/07-lightning-{desktop,phone,phone-reduced}-{inside,compare}.png`, the Normal ones and the short screens' pictures: both views read as the spec says, no label covers another or the part it names, nothing overflows at 320. Then, in the served page (a headless run through the pool, or by reading the code where a run cannot show it):

- Bolts strike from the clouds and light the sky; a click or tap strikes there (a click, so a swipe that scrolls the page strikes nothing), and Enter or Space on the focused box strikes from its middle.
- In Compare each half's bolt stays inside its half (both drawn clipped), and Branches reaches both halves: the even zigzag gets as many forks, short even zigzags from the same points (lesson 17).
- Strikes start at least 1.5 s apart whatever is pressed, so never more than two flashes in any second: count the flash peaks at How often Often under clicks every 90 ms for 10 s (this plan's count: strikes 1.517 s apart, at most two peaks in any second); the sky light is at most 30% white.
- Pause stops the strike timers and freezes rain, clouds and any bolt where they are; a click while paused draws a still bolt with no flash.
- Under reduced motion the loop starts paused with a still bolt and no flash; See inside opened while paused draws a whole bolt; after Play the notes describe what moves (lesson 16).

Decisions already made in this page (keep them; a reviewer weighs them): Compare's halves sit side by side at every width, so its note says left and right. Still bolts (paused clicks, reduced motion) never flash; the canvases are drawn at no more than 1.5 device pixels per CSS pixel. The rain has its own canvas, drawn every frame; the bolts' canvas is drawn again only when what it shows changes (every frame while a strike flashes, once a round while See inside builds it), which took a phone's slow frames in the views from about a third to 2%. A bolt is four paths (the glow and the core of the main line, then of all the forks together): with Compare's halves clipped and the zigzag given its forks, stroking each fork alone made 8 to 12% of a phone's frames in Compare slow.

- [ ] **Step 9: Frame times (required: a canvas or mask page)**

One background command, waited on with `wait-log.mjs`:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L10 || exit 1
(node $RUN/slot.mjs run ten-L10 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8970 --modes normal,inside,compare animations/07-ambient-background/lightning; node $RUN/slot.mjs run ten-L10 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8970 --phone --modes normal,inside,compare animations/07-ambient-background/lightning; node $RUN/slot.mjs run ten-L10 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8970 animations/07-ambient-background/fireworks; node $RUN/slot.mjs run ten-L10 -- node $TEN/frametimes.mjs --base http://127.0.0.1:8970 --phone animations/07-ambient-background/fireworks) > $TEN/checks/L10/frames.log 2>&1; echo "EXIT=$?" >> $TEN/checks/L10/frames.log
```

Expected: a median of 16.7 ms in every mode at both sizes, and no larger share of frames slower than 20 ms than Fireworks measured the same way, within a few points (the machine's other work moves these numbers; run again when one looks off). This plan's runs: desktop 1 / 0 / 0%, phone 0 / 0 / 2% (up to 5% in Compare with the machine busy), after the bolts' canvas was made to redraw only when it changes (before: 30 to 37% in See inside and Compare on a phone) and a bolt's forks were stroked together (before: 8 to 12% in Compare on a phone); Fireworks 0% and 0 to 1%. A page that misses lightens its per-frame work (a smaller grid, fewer dots, less drawn per frame) until it meets this, and says what it changed.

- [ ] **Step 10: Commit, and the build report**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-L10 || exit 1
[ "$(git rev-parse --abbrev-ref HEAD)" = ten/L10 ] || exit 1
git add -A && git status --short
git commit -m "feat: 07.26 Lightning, with See inside and Compare from the start (lane 10)"
git log --oneline -1
```

Expected before the commit: `A  animations/07-ambient-background/lightning/README.md`, `A  animations/07-ambient-background/lightning/index.html`, `M  .github/ISSUE_TEMPLATE/config.yml`, `M  404.html`, `M  README.md`, `M  animations/07-ambient-background/README.md`, `M  index.html`, `M  llms.txt`, `M  sitemap.xml` and the changed files under `skills/animation-handbook/`; nothing else (the kit's copy is ignored; logs and pictures are in `$TEN`). Then write `$TEN/reports/L10/build.md`: first line `RESULT: built <commit>`, then the line count, the page check's `ok` count and its round, the short screens' last line, the galleries and clips looked at (one line per choice: what changes in each view; one line per clip: what moves), the tests' pass and fail line, the frame times, the hand checks' results, every place the page departs from the spec or this task and why, and any shared-file need (the coordinator appends it to `$RUN/shared-wishes.md`; there should be none). Reply to the coordinator in at most three lines.

- [ ] **Step 11: Review, at most three fix rounds**

The coordinator dispatches a reviewer (strongest model, never the builder) with: the spec's section, this task, the builder's report, `git -C $REPO diff feat/ten-animations...ten/L10`, the newest check round and its screenshots, the short screens, the galleries, the clips and the frame times. The reviewer reads CLAUDE.md, the Global Constraints, `$RUN/lessons.md`, `$RUN/briefs/RULINGS.md`, `$RUN/brief-rulings.md`, `$RUN/briefs/OPEN-QUESTIONS.md` and, once it holds the owner's verdict, `$RUN/rulings-159.md`, and checks the diff against them, the rollout's acceptance list (section 1 of the rollout spec), the spec's section and the per-frame work, looking hard at the flash limit by count, not by reading; Pause stopping timers; the bolt kept inside the box and each Compare bolt inside its half; the paths a flash strokes each frame. It writes `$TEN/reports/L10/review-<k>.md`: first line `RESULT: approved` or `RESULT: changes <count>`, then numbered findings (Critical, Important, Minor), and replies in at most three lines. Each fix round: the builder fixes, runs Steps 5 and 6 again (and the galleries, clips or frame times a fix touches), commits `fix: Lightning: <what>` after the branch check, writes `$TEN/reports/L10/fix-<k>.md` (`RESULT: built <commit>`), and the reviewer re-reviews only the fix. After three rounds the coordinator steps in. When approved, the coordinator stops the lane's server and adds the ledger line `<date time>  L10  approved at <commit>; check rounds <k>; frames <numbers>; departures: <none or a list>; reports reports/L10/`.

---

### Task 11: Integration: late rulings, the rollout's progress, the ten lanes in order, links, counts 176, test entries, finder rows, See also, every check (coordinator)

The coordinator runs this task itself (coordination rule 6: it alone settles overlaps). A conflict `resolve.mjs` does not settle, any conflict outside `index.html`, `README.md` and `animations/*/README.md`, and every fix made here by hand get a fresh agent's review (strongest model) before their commit. Every block sets its own variables and checks its `cd` and, before a commit, the branch: a failed `cd` would otherwise run the rest in the main checkout, on the rollout's branch.

**Files:**
- Merge into `feat/ten-animations` (worktree `.claude/worktrees/ten-int`, served on port 8971): `feat/see-inside-compare`, then `ten/L1` … `ten/L10`
- Modify (by `$TEN/integrate.mjs`): the pager lines of `magnifier-lens`, `card-deck-swipe`, `audio-visualizer`, `fire-effect`, `lightning` (Previous) and `before-after-slider`, `magnifier-lens`, `water-ripple`, `ken-burns`, `fire-effect` (Next); every count in `index.html`, `README.md`, `.github/ISSUE_TEMPLATE/config.yml`, `404.html`; `tests/pages.test.js` (`KEYBOARD_PAGES`, `PHONE_DEFAULTS`); `index.html` `FIND` and `tests/finder.test.js` case 9 (the finder is on the branch); See also: one line each in the READMEs of `clip-path-reveal`, `dissolve`, `spotlight-hover`, `swipe-to-dismiss`, `ambient-ripple`, `abstract-geometric-motion`, `infinite-zoom`, `fireworks` and `snow-rain` (the coordination file's "nine page READMEs, one See also line each"), and six between new pages (Before/After Slider and Magnifier Lens, Fire Effect and Lightning, Fire Effect and Water Ripple, each both ways); `CHANGELOG.md`; the ten pages' `?v=N`
- Regenerate: `sitemap.xml`, `llms.txt`, `skills/animation-handbook/`, `og-image.png` (coordinator), `famous/index.html` blocks (once `famous/` exists)
- Test: the tests; the page check of the ten new pages, the five old last pages, the eight other pages whose See also changed, `home` and `famous` (once it exists)
- Write: `$TEN/checks/int/`, `$TEN/reports/rulings-check.md` (when Step 1 needs it), ledger lines

**Interfaces:**
- Consumes: the ten approved lanes (`ten/L<n>`, each with its ledger line `L<n>  approved at <commit>` and its reports in `$TEN/reports/L<n>/`); `$TEN/resolve.mjs <file>...` (exit 0 when every overlap is settled, 1 when one is left for a person; it settles only conflicts written with their base, `-c merge.conflictStyle=diff3`); `$TEN/integrate.mjs <root>`; the build reports' notes for this task (a finder test a lane saw fail); the rollout's ledger line for the owner's first-batch verdict.
- Produces: `feat/ten-animations` with 176 pages, linked, counted, committed and checked, ready for Task 12; ledger lines.

- [ ] **Step 1: The ten approvals, and the owner's first-batch rules**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
grep -o '  L[0-9]*  approved at' $TEN/ledger.md | sort -u | wc -l
for n in 1 2 3 4 5 6 7 8 9 10; do a=$(grep "  L$n  approved at" $TEN/ledger.md | tail -1 | sed 's/.*approved at \([0-9a-f]*\).*/\1/'); [ -n "$a" ] && [ "$(git -C $REPO rev-parse "$a^{commit}")" = "$(git -C $REPO rev-parse ten/L$n)" ] && echo "L$n tip approved" || echo "L$n: its tip is not the approved commit"; done
grep "^First batch approved by the owner on .*rulings-159\.md:" $RUN/ledger.md; grep "  coord  rulings check:" $TEN/ledger.md | tail -1
```

Expected: `10`; ten `L<n> tip approved` lines (a lane whose tip is not its approved commit goes back to its review first); then the rollout's verdict line (on 2026-10-15: `First batch approved by the owner on 2026-10-15; shared files at v=10; rulings-159.md: 0 rules`) and the last rulings check, if any. When the verdict line is there and `$TEN/ledger.md` has no `rulings check:` line yet, check all ten pages (no ledger time is needed): if the verdict says `rulings-159.md: 0 rules`, as it did, there is nothing to apply, and the coordinator writes `<date time>  coord  rulings check: none (0 rules)`; otherwise dispatch a fresh reviewer (strongest model) with `$RUN/rulings-159.md`, the rules it added to `$RUN/lessons.md` (`Owner (first batch) R<k>`), the ten pages (`git -C $REPO show ten/L<n>:<page folder>/index.html`) and their newest pictures in `$TEN/checks/L<n>/`. It writes `$TEN/reports/rulings-check.md`: first line `RESULT: none` or `RESULT: changes <count>`, then for each page what a rule changes. Each change goes through its lane's fix loop (the lane task's last step: the builder fixes and checks, the reviewer re-reviews, a new approval line); then the ledger line `<date time>  coord  rulings check: <none | L<n>, … fixed>` and this step again. While the verdict waits, go on: Task 12 Step 7 makes this check when it lands. A rule the owner gives later (a new `Owner …` line in `$RUN/lessons.md`) goes the same way.

- [ ] **Step 2: The integration worktree, and the rollout's progress merged in first**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
git -C $REPO worktree add $REPO/.claude/worktrees/ten-int feat/ten-animations
cd $REPO/.claude/worktrees/ten-int || exit 1
[ "$(git rev-parse --abbrev-ref HEAD)" = feat/ten-animations ] || exit 1
git -c merge.conflictStyle=diff3 merge --no-ff --no-commit feat/see-inside-compare
git status --short | grep -E '^(UU|AA|DU|UD) ' || echo "no conflicts"
```

Expected: `Automatic merge went well; stopped before committing as requested` (or `Already up to date.` when the rollout has not moved since Task 0), then `no conflicts` (nothing on `feat/ten-animations` changed since Task 0 cut it, unless Task 0 Step 3a took a project in). A conflict: settle it by coordination rule 6 (each project keeps its own lines), with a fresh agent's review of any resolution beyond keeping both sides. Then write the generated files and commit the merge, only if one was made:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-int || exit 1
[ "$(git rev-parse --abbrev-ref HEAD)" = feat/ten-animations ] || exit 1
node tools/update-sitemap.mjs && node tools/make-skill.mjs && ([ -f tools/make-famous.mjs ] && node tools/make-famous.mjs || true)
if git rev-parse -q --verify MERGE_HEAD >/dev/null; then git add -A && git commit -m "Merge feat/see-inside-compare into feat/ten-animations before the lanes; generated files written again"; elif [ -n "$(git status --porcelain)" ]; then git add -A && git commit -m "Write the generated files again before the lanes"; else echo "nothing new on feat/see-inside-compare"; fi
git status --short | wc -l
node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)"
```

Expected: the merge commit; or, when the rollout had nothing new but the tools still wrote something (its page commits move the sitemap's dates), `Write the generated files again before the lanes`, a commit of its own (never an amend of the rollout's commit); or `nothing new on feat/see-inside-compare`. Then `0` and `ℹ fail 0` (this plan's runs: on its scratch base, `Already up to date.`, `no conflicts`, the generated files' commit for the sitemap's 167 dates, `0`; on a copy of `feat/ten-animations` at `ece2689`, `Already up to date.`, `no conflicts`, `famous/index.html: 23 cards, 22 previews` (make-famous's line), `nothing new on feat/see-inside-compare`, `0`).

- [ ] **Step 3: Merge the ten lanes in table order, settling the expected overlaps**

The lanes of one section added lines at the same places (cards, `PLACES` and `FIND` rows, previews, catalog and table lines) and changed the same lines (the `PV` keys, the `STILL` points, 07's last `PLACES` row, 07's Implementation summary, the Categories table's neighboring rows); `resolve.mjs` keeps both sides, the earlier lane's first, and puts both additions into a line both changed. It runs only on `index.html`, `README.md` and the category READMEs; generated files take our side and are written again; any other conflict stops the loop for the coordinator. Run, stopping at the first lane that does not end with `merged L<n>`:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-int || exit 1
[ "$(git rev-parse --abbrev-ref HEAD)" = feat/ten-animations ] || exit 1
GEN='^(sitemap\.xml|llms\.txt|skills/|og-image\.png|famous/)'; OWN='^(index\.html|README\.md|animations/[^/]+/README\.md)$'
for n in 1 2 3 4 5 6 7 8 9 10; do
  if ! git -c merge.conflictStyle=diff3 merge --no-ff --no-stat ten/L$n -m "Merge ten/L$n into feat/ten-animations"; then
    git rev-parse -q --verify MERGE_HEAD >/dev/null || { echo "STOP at L$n: the merge did not start"; break; }
    files=$(git diff --name-only --diff-filter=U)
    gen=$(echo "$files" | grep -E "$GEN" || true); own=$(echo "$files" | grep -E "$OWN" || true)
    other=$(echo "$files" | grep -vE "$GEN" | grep -vE "$OWN" || true)
    [ -n "$other" ] && { echo "STOP at L$n: for the coordinator by hand: $other"; break; }
    [ -n "$gen" ] && git checkout --ours -- $gen
    if [ -n "$own" ] && ! node $TEN/resolve.mjs $own; then echo "STOP at L$n: an overlap is left for a person"; break; fi
    if [ -n "$own" ] && git grep -nE '^(<{7}|\|{7}|>{7})( |$)' -- $own; then echo "STOP at L$n: conflict markers remain"; break; fi
    git add -A && git commit --no-edit > /dev/null
  fi
  git merge-base --is-ancestor ten/L$n HEAD || { echo "STOP at L$n: not merged"; break; }
  node tools/update-sitemap.mjs > /dev/null && node tools/make-skill.mjs > /dev/null && ([ -f tools/make-famous.mjs ] && node tools/make-famous.mjs > /dev/null || true) || { echo "STOP at L$n: a tool failed"; break; }
  [ "$(git rev-parse -q --verify HEAD^2)" = "$(git rev-parse ten/L$n)" ] && [ -n "$(git status --porcelain)" ] && git add -A && git commit --amend --no-edit > /dev/null
  echo "merged L$n"
done
git status --short | wc -l
```

Expected (this plan's run on a copy of `feat/ten-animations` at `ece2689`, the finder and Famous effects there): each merge prints its `CONFLICT` lines (the generated files every time: they take our side and are written again), then `resolve.mjs`'s lines and `merged L<n>`: L1 none; L2 and L3 `README.md: 1 resolved` (the Categories table's neighboring rows); L4 `README.md: 2 resolved`, `animations/04-micro-interactions/README.md: 1 resolved`, `index.html: 6 resolved` (cards, `PLACES` and `FIND` rows, previews, `PV` keys); L5 the same with `index.html: 7 resolved` (the `STILL` line too); L6 `index.html: 1 resolved` (the `PV` lines side by side); L7 `README.md: 1 resolved`, `animations/06-3d-advanced/README.md: 1 resolved`, `index.html: 6 resolved`; L8 `README.md: 1 resolved`; L9 `README.md: 2 resolved`, `animations/07-ambient-background/README.md: 1 resolved`, `index.html: 6 resolved`; L10 `README.md: 2 resolved`, `animations/07-ambient-background/README.md: 2 resolved`, `index.html: 7 resolved`; ten `merged` lines, then `0` (on its scratch base without the finder, `index.html` counted one less in L4, L5, L7, L9 and L10). If the loop stopped, the coordinator settles the named file by hand under the same rule (both sides, the earlier lane first; a line both changed keeps both additions), a fresh agent reviews the resolution, then `git add` it, `git commit --no-edit` after the branch check, and the loop runs again (the merged lanes print `Already up to date.`; the stopped lane's generated files are written and folded into its merge).

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-int || exit 1
grep -c "^      \['\(ink-spread-reveal\|pixelate-transition\|before-after-slider\|magnifier-lens\|card-deck-swipe\|water-ripple\|audio-visualizer\|ken-burns\|fire-effect\|lightning\)'," index.html
grep -o "izoom:[^}]*" index.html
grep -n "light rays, game of life" animations/07-ambient-background/README.md | grep -o "game of life.*"
node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)"
```

Expected: `10`; `izoom:.02,pixelate:.34,deckswipe:.4,lightning:.016`; `game of life, fire, lightning |`; and only the three count tests fail, the counts still saying 167: `the counts written on the home page match its cards`, `the counts written in the root README match the cards`, `the counts written in the issue template, the 404 page and the sitemap match the cards` (this plan's run on `ece2689`: 1822 pass, 3 fail). Where the rollout moved the shared files past the lanes' number since Task 0, `every guided-steps page and the home page link the same version of the shared files` fails too, until Step 4.

- [ ] **Step 4: The integration's edits, committed**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-int || exit 1
[ "$(git rev-parse --abbrev-ref HEAD)" = feat/ten-animations ] || exit 1
node $TEN/integrate.mjs .
node tools/update-sitemap.mjs && node tools/make-skill.mjs && ([ -f tools/make-famous.mjs ] && node tools/make-famous.mjs || true)
node --test "tests/*.test.js" 2>&1 | grep -E "^✖|^ℹ (pass|fail)"
```

Expected: ten link lines (`Magnifier Lens: Previous is Before/After Slider`, `Before/After Slider: Next is Magnifier Lens`, … `Fire Effect: Next is Lightning`), the count lines (`home: 176 Web Animation Techniques` … `404: 176`, with 04 at 44, 06 at 28 and 07 at 26), `KEYBOARD_PAGES 04`, `KEYBOARD_PAGES 06`, `PHONE_DEFAULTS`; `already: FIND rows after …` five times (each lane added its own row) and `finder case 9 takes Ink Spread Reveal`; fifteen `See also in …` lines (the nine existing pages, then six between new pages), `CHANGELOG`, ten lines on the shared files' version (`already: <page> at ?v=10`, or `<page> now at ?v=<N>` where the rollout moved on); then the tools' lines, make-famous's `famous/index.html: 23 cards, 22 previews` among them. Then `ℹ fail 0` (this plan's run on `ece2689`: 1825 pass, 0 fail; on `fce3a2b`, before Famous effects, 1763; on its scratch base without the finder, 1700). Run a second time, it prints only `already: …` lines (this plan's run did). Then commit, so the checks and any later lane merge start from a clean tree:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-int || exit 1
[ "$(git rev-parse --abbrev-ref HEAD)" = feat/ten-animations ] || exit 1
git add -A && git commit -m "Integrate the ten new animations: the split sections linked, every count 176, the test entries, the finder rows, See also lines and the CHANGELOG"
git status --short | wc -l
```

Expected: one commit; `0`.

- [ ] **Step 5: The social image (coordinator)**

Start the worktree's server as a background command, `cd $REPO/.claude/worktrees/ten-int && python -m http.server 8971 --bind 127.0.0.1` (with the variables first), and check it: `curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8971/` prints `200`. Then, as a background command:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-int || exit 1; mkdir -p $TEN/checks/int; node $RUN/slot.mjs run ten-int -- node tools/make-social-image.mjs --base http://127.0.0.1:8971 > $TEN/checks/int/social.log 2>&1; echo "EXIT=$?" >> $TEN/checks/int/social.log
```

Wait with `node $RUN/wait-log.mjs $TEN/checks/int/social.log`. Expected: the tool reports `og-image.png` written and `EXIT=0`; `git -C $REPO/.claude/worktrees/ten-int status --short` prints ` M og-image.png`. Open `og-image.png`: the pill says 176. Commit it after the branch check: `git add og-image.png && git commit -m "Draw the social image again: 176 animations"`.

- [ ] **Step 6: Every check (each part a background command, waited on)**

Start these four, each as its own background command (two at a time while the rollout's pages are being built), and wait on each log with `node $RUN/wait-log.mjs` (again while it says `still running`):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-int || exit 1; node $RUN/slot.mjs run ten-int-a -- node tools/check-pages.mjs --base http://127.0.0.1:8971 --out $TEN/checks/int/a animations/02-entrance-and-exit/ink-spread-reveal animations/03-page-transitions/pixelate-transition animations/04-micro-interactions/before-after-slider animations/04-micro-interactions/magnifier-lens animations/04-micro-interactions/card-deck-swipe > $TEN/checks/int/a.log 2>&1; echo "EXIT=$?" >> $TEN/checks/int/a.log
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-int || exit 1; node $RUN/slot.mjs run ten-int-b -- node tools/check-pages.mjs --base http://127.0.0.1:8971 --out $TEN/checks/int/b animations/06-3d-advanced/water-ripple animations/06-3d-advanced/audio-visualizer animations/07-ambient-background/ken-burns animations/07-ambient-background/fire-effect animations/07-ambient-background/lightning > $TEN/checks/int/b.log 2>&1; echo "EXIT=$?" >> $TEN/checks/int/b.log
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-int || exit 1; node $RUN/slot.mjs run ten-int-c -- node tools/check-pages.mjs --base http://127.0.0.1:8971 --out $TEN/checks/int/c home animations/02-entrance-and-exit/shatter-effect animations/03-page-transitions/cube-transition animations/04-micro-interactions/dynamic-island animations/06-3d-advanced/infinite-zoom animations/07-ambient-background/game-of-life $( [ -d famous ] && echo famous ) > $TEN/checks/int/c.log 2>&1; echo "EXIT=$?" >> $TEN/checks/int/c.log
```

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-int || exit 1; node $RUN/slot.mjs run ten-int-d -- node tools/check-pages.mjs --base http://127.0.0.1:8971 --out $TEN/checks/int/d animations/02-entrance-and-exit/clip-path-reveal animations/03-page-transitions/dissolve animations/04-micro-interactions/spotlight-hover animations/04-micro-interactions/swipe-to-dismiss animations/07-ambient-background/ambient-ripple animations/07-ambient-background/abstract-geometric-motion animations/07-ambient-background/fireworks animations/07-ambient-background/snow-rain > $TEN/checks/int/d.log 2>&1; echo "EXIT=$?" >> $TEN/checks/int/d.log
```

Then `cat $TEN/checks/int/?.log | grep -c '^ok'; cat $TEN/checks/int/?.log | grep '^FAIL'`. Expected: `144` (the ten new pages, the five old last pages, the eight other pages whose See also changed and `home`, six setups each; 150 with `famous`), no `FAIL` line and `EXIT=0` in each log (this plan's run gave all 144). A `FAIL` on a new page goes back to its lane's fix loop; once the fix is approved, Step 3's loop merges the lane again (the others print `Already up to date.`), Step 4 runs again (its edits print `already: …`) and its commit becomes `fix: integration after L<n>'s fix`, and the failed part is checked again. A `FAIL` the merge caused is fixed here (a fresh agent reviews the fix), committed after the branch check, and named in the ledger.

- [ ] **Step 7: Ledger, hand over**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-int || exit 1
git status --short | wc -l; git log --oneline -3
```

Expected: `0`, then the social image's commit, the integration's commit and the last lane's merge. Ledger: `<date time>  int  integrated at <commit>; tests <pass>/0; checks 144 ok; FIND added; version ?v=<N>` (the finder is on the branch: `integrate.mjs` keeps the lanes' rows and sets finder case 9). Stop the server (Step 5's background command). The worktree stays for Task 12's integration fixes. Task 12 starts.

---

### Task 12: Final review in three parts, fixes, the whole-site check, the owner's look, the hand-over, late rulings and fixes after joining (coordinator)

**Files:**
- Read: a detached checkout of `feat/ten-animations` (`.claude/worktrees/ten-rev`, port 8972), moved to the branch's new tip after each fix wave
- Modify: only what a review finds, on the lane branch that owns it (a page) or on `feat/ten-animations` in `ten-int` (port 8971; integration's edits), each fix reviewed, merged and checked
- Write: `$TEN/final/part-<1|2|3>.md` and `$TEN/final/part-<k>/` (the reviewers' runs), `$TEN/checks/site/`, `$TEN/kit/`, ledger lines
- Test: the tests, the page check of every page a fix touched, the whole site in parts (or the rollout's own check after its merge), the review kit's pictures and clips of the ten pages

**Interfaces:**
- Consumes: Task 11's commits on `feat/ten-animations` and its worktree `ten-int`; the rollout's review kit (`$KIT/record.mjs` and `kit-lib.mjs`, as the rollout's Task 5 left them), copied into `ten-rev` because the kit reads pages under its own root; the rollout plan's Task 12 Step 1 (it merges this branch) and Task 13 (its part 9 reviews the ten pages and sends findings back here).
- Produces: `feat/ten-animations` reviewed, fixed and checked; the owner's verdict; the hand-over ledger line the rollout's Task 12 Step 1 reads; fixes after joining.

- [ ] **Step 1: Freeze a checkout, copy the kit into it, serve it**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit
git -C $REPO worktree add --detach $REPO/.claude/worktrees/ten-rev feat/ten-animations
cd $REPO/.claude/worktrees/ten-rev || exit 1
git log --oneline -1
mkdir -p .superpowers/sdd/kit/review-kit $TEN/final && cp $KIT/record.mjs $KIT/kit-lib.mjs .superpowers/sdd/kit/review-kit/ && git status --short | wc -l
```

Expected: Task 11's last commit (the social image), then `0` (`.superpowers/` is ignored by git). Start the server as a background command, `cd $REPO/.claude/worktrees/ten-rev && python -m http.server 8972 --bind 127.0.0.1` (with the variables first); `curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8972/` prints `200`.

- [ ] **Step 2: Three reviewers at once (strongest model; none of them built or reviewed a page)**

Each reads CLAUDE.md, this plan's Global Constraints, the ten-animations spec, the rollout spec's section 1 and acceptance list, `$RUN/lessons.md`, `$RUN/briefs/RULINGS.md`, `$RUN/brief-rulings.md`, `$RUN/briefs/OPEN-QUESTIONS.md`, `$RUN/rulings-159.md` once it holds the owner's verdict, `$TEN/ledger.md` and the lanes' reports (`$TEN/reports/L<n>/`), and works on the frozen checkout (`http://127.0.0.1:8972/`). Each may run, from `cd $REPO/.claude/worktrees/ten-rev || exit 1` and through the pool, the page check and the kit's copy (`node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8972 …`: `--short`, `--gallery --press "<selector>"`, `--only clips --keep-frames`, then the frame folders removed), each run a background command with its log in `$TEN/final/part-<k>/` ending in an `EXIT=` line and waited on with `node $RUN/wait-log.mjs`; never the browser pane. Each writes `$TEN/final/part-<k>.md`: first line `RESULT: clear` or `RESULT: findings <count>`, then numbered findings (Critical, Important, Minor), and replies in at most three lines.
- **Part 1, pages 02 to 04:** Ink Spread Reveal, Pixelate Transition, Before/After Slider, Magnifier Lens, Card Deck Swipe, and the links from Shatter Effect, Cube Transition and Dynamic Island: each page against its spec section, its task's hand checks, the twelve acceptance lines, both views at 1280, 375 and 375 with reduced motion and on the short screens, every setting in both views, the clips, the per-frame work, the README's six sections and Key parameters (each setting's demo values in plain words).
- **Part 2, pages 06 and 07:** Water Ripple, Audio Visualizer, Ken Burns Effect, Fire Effect, Lightning, and the links from Infinite Zoom and Game of Life: the same, plus Audio Visualizer's silence before Hear it (no console warning, no AudioContext), Lightning's flash count (the method in its task), Fire Effect's and Water Ripple's fixed steps.
- **Part 3, integration:** the home page (cards in order, `PLACES`, `PV`, `FIND`, the ten previews at rest and under reduced motion, every count 176), the root README (catalog in home order, counts, the Categories table), the five category READMEs (lists, 06's Browser requirements, 07's Implementation summary), `config.yml`, `404.html`, `CHANGELOG.md`, the See also lines, the test entries, the generated files (written by the tools, not by hand), `og-image.png`, and the split sections' Previous and Next links on all ten pages.

Expected: three files; the coordinator writes one ledger line per part (`<date time>  coord  final part <k>: <clear | findings n>`).

- [ ] **Step 3: One fix wave, then a scoped re-review**

Integration findings first: the coordinator fixes them in `ten-int` (with the variables, `cd $REPO/.claude/worktrees/ten-int || exit 1` and the branch check), a fresh agent reviews each fix, and they are committed (`fix: integration: <what>`) before any lane is merged again, so a merge never folds them in. Page findings: the lane's builder fixes on `ten/L<n>` in its worktree as in its task's fix rounds (Steps 5 and the check step again, the galleries, clips or frame times the fix touches, a `fix:` commit after the branch check, `$TEN/reports/L<n>/fix-<k>.md`), the lane's reviewer re-reviews the fix, and the coordinator writes its new approval line. Then, in `ten-int`: Task 11 Step 1's approval check (each tip its approved commit), Task 11 Step 3's loop (each fixed lane merges, the others print `Already up to date.`), Task 11 Step 4 (`integrate.mjs` prints `already: …` for every edit already made; the tests `ℹ fail 0`; its commit only if something changed), and Task 11 Step 5 again if a count or the home page's top changed. Then move the frozen checkout to the new tip and check from it:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-rev || exit 1
git checkout --detach feat/ten-animations && git log --oneline -1
```

Expected: `feat/ten-animations`' new tip. Then the page check of every page a fix touched (and `home` if the home page changed), as a background command from `ten-rev` against port 8972 into `$TEN/checks/rev-<k>/` with its log, waited on: six `ok` lines each; and the kit's `--short` for a page whose layout or notes changed (`27 short-screen pictures checked, 0 with labels cut or overlapping, 0 skipped, 0 failed`). The part's reviewer re-reviews only the fixes, on `ten-rev`, and adds `$TEN/final/part-<k>-re.md` (first line `RESULT: clear` or `RESULT: findings <count>`). Expected: no Critical or Important finding left; Minor findings fixed or written in the ledger as the owner's to decide.

- [ ] **Step 4: The whole-site check (here, or the rollout's after its merge)**

While the rollout's pages are still being built, leave the whole-site check to the rollout's Task 12 Step 7, which checks all 176 pages after its merge, and say so in Step 6's ledger line. Otherwise run it here, one background command per category and one for `home` and `famous`, at most two at once, each waited on with `node $RUN/wait-log.mjs` (the category's log; again while it says `still running`):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-rev || exit 1; mkdir -p $TEN/checks/site; c=01-scroll-based; node $RUN/slot.mjs run ten-site -- node tools/check-pages.mjs --base http://127.0.0.1:8972 --out $TEN/checks/site/$c animations/$c > $TEN/checks/site/$c.log 2>&1; echo "EXIT=$?" >> $TEN/checks/site/$c.log
```

The same with `c=` each of `02-entrance-and-exit`, `03-page-transitions`, `04-micro-interactions`, `05-text-typography`, `06-3d-advanced`, `07-ambient-background`, and once with `c=home` and the targets `home $( [ -d famous ] && echo famous )` in place of `animations/$c`. Then `cat $TEN/checks/site/*.log | grep -c '^ok'; cat $TEN/checks/site/*.log | grep '^FAIL'`. Expected: `1062` (176 pages and the home page, six setups each; 1068 with `famous`) and no `FAIL` line. A rollout page that fails because its views are still being built is the rollout's (a line in both ledgers); a page this project changed is fixed as in Step 3.

- [ ] **Step 5: The owner's look**

The review kit's pictures and clips of the ten pages, as a background command, waited on:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
cd $REPO/.claude/worktrees/ten-rev || exit 1; node $RUN/slot.mjs run ten-kit -- node .superpowers/sdd/kit/review-kit/record.mjs --base http://127.0.0.1:8972 --out $TEN/kit animations/02-entrance-and-exit/ink-spread-reveal animations/03-page-transitions/pixelate-transition animations/04-micro-interactions/before-after-slider animations/04-micro-interactions/magnifier-lens animations/04-micro-interactions/card-deck-swipe animations/06-3d-advanced/water-ripple animations/06-3d-advanced/audio-visualizer animations/07-ambient-background/ken-burns animations/07-ambient-background/fire-effect animations/07-ambient-background/lightning > $TEN/kit.log 2>&1; echo "EXIT=$?" >> $TEN/kit.log
```

Expected: the log's last lines `done  90 pictures, 30 clips and 0 comparisons made, 0 skipped, 0 failed` and `EXIT=0`; the gallery is `$TEN/kit/index.html`. Give the owner the gallery and the ten addresses on `http://127.0.0.1:8972/` to open in the browser pane themselves (the agents never drive the pane), and ask them to press Hear it on Audio Visualizer there. Write the owner's verdict in the ledger; what they ask for is a fix as in Step 3, then their look again at what changed. If the owner does not like Hear it, it comes out in one small change (the button, its listener and its README lines), as the spec's ruling allows.

- [ ] **Step 6: Hand over to the rollout**

The merge into `feat/see-inside-compare` is the rollout plan's Task 12 Step 1 (its `?v` step where the higher number wins, its `176` and `data-hb-modes` checks, `og-image.png` taken from this branch); this plan does not restate it. Hand over with the ledger line `<date time>  coord  ready to join: feat/ten-animations at <commit>; ten pages approved; final review clear; owner's look <verdict>; reports in reports/ and final/; whole-site check <done here | left to the rollout's Task 12 Step 7>; FIND added; took in: <none | feat/famous-effects at <commit>>`, and the same news where the rollout looks for it, one line appended to its ledger: `printf '%s\n' "Ten new animations ready to join: feat/ten-animations at <commit>; run folder .superpowers/sdd/2026-10-14-ten-new-animations/; took in: <none | feat/famous-effects at <commit>>" >> $RUN/ledger.md` (the rollout's Task 12 Step 1 and its part 9 read this project's ledger and reports from that folder; a project taken in reaches the rollout through this merge). Ask that step to draw `og-image.png` again if its merge touched the home page's top. The finder's rows come with the branch (each lane added its own, and Task 11 set finder case 9), so that merge needs nothing more for the finder.

- [ ] **Step 7: The owner's first-batch rules, if they land after Task 11 Step 1**

When the rollout's ledger has `First batch approved by the owner on …; rulings-159.md: …` and `$TEN/ledger.md` no `rulings check:` line yet (or the owner gives a rule later): the rulings check of Task 11 Step 1 on all ten pages (nothing to apply for `0 rules`; otherwise a fresh reviewer, `$TEN/reports/rulings-check.md`), each change through its lane's fix loop, then Step 3's merge, check and re-review, and the ledger line `<date time>  coord  rulings check: <none | L<n>, … fixed>`. Before the hand-over this goes into Step 6's line; after it, as Step 8.

- [ ] **Step 8: Fixes after joining**

A finding on one of the ten pages from the rollout's final review (its Task 13, part 9) or the owner's final look comes back to the page's lane: re-create its worktree if Step 9 has run (`git -C $REPO worktree add $REPO/.claude/worktrees/ten-L<n> ten/L<n>`, with the variables first); otherwise it is still there, the coordinator serves it on 8960 + n, the builder fixes as in its task's fix rounds, its reviewer re-reviews, and the coordinator writes the approval line; then Task 11 Step 1's approval check, Step 3's loop and Step 4 in `ten-int` (re-created the same way on `feat/ten-animations` if needed), the checks of Step 3 above, and the ledger line `<date time>  coord  fix after joining: L<n> at <commit>; feat/ten-animations at <commit>`. The rollout's coordinator merges `feat/ten-animations` on again by its own plan.

- [ ] **Step 9: Clean up, only after the rollout's Task 13 has merged**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; TEN=$REPO/.superpowers/sdd/2026-10-14-ten-new-animations
for n in 1 2 3 4 5 6 7 8 9 10; do git -C $REPO worktree remove $REPO/.claude/worktrees/ten-L$n; done
git -C $REPO worktree remove $REPO/.claude/worktrees/ten-rev
git -C $REPO worktree remove $REPO/.claude/worktrees/ten-int
git -C $REPO worktree list | grep -c 'ten-' || true
ls -d /c/Users/matin/AppData/Local/Temp/hb-chrome-* /c/Users/matin/AppData/Local/Temp/hb-kit-chrome-* 2>/dev/null
```

Expected: `0` worktrees left with `ten-` in their path (the kit's copies are ignored files, which do not stop `worktree remove`); the branches stay until the release. Every server of this project is stopped. The last command lists leftover Chrome profile folders (this plan's own checks left `hb-chrome-UTFiH6` and `hb-kit-chrome-NHI5vA`, which Chrome held when the runs ended): ask the owner before removing any of them, and remove them only with their OK.

---

## Self-review

**Spec coverage** (`2026-10-13-ten-new-animations-design.md`, section by section):
- Owner rulings: the mode press plays the demo once and never under reduced motion (Global Constraints; each do-it and plays-once page's Show me or Replay ends on its posed rest; the loops are never pressed); the box keeps its size on phones (each page; the page check's size check); Audio Visualizer silent by default with Hear it (Task 7, its hand checks and review focus); built without the new tabs (the top bars are copied from neighbors).
- The pages table (kinds, player bars, difficulty): Tasks 1 to 10, one each; Previous and Next: `lanes.mjs` gives the five old last pages their Next links (Tasks 1, 2, 3, 6, 8) and Task 11's `integrate.mjs` links the split sections.
- What all ten share: starting points, top bar, drawn pictures with made-up names, transforms or canvas, frame loops by elapsed time and fixed steps for Fire Effect and Water Ripple, reduced motion read in the loops, Show me two to four seconds ending at rest, 44px in the box, both views with captions and posed stills, notes that stay true after every press, each Compare half inside its half and different in one thing, plain words, READMEs with six sections: in each page's code, its hand checks, its kit runs (short screens, a gallery per choice, clips) and its review.
- Sections 1 to 10: each page's code, README, preview, Try it settings with the spec's defaults, prompt, tags and both views; the places where a page settles or departs from its section are listed in its task ("Decisions already made").
- Lists, counts and generated files: lanes at 167 with their own catalog, category README and table lines (`lanes.mjs`); the 176 counts, the per-section counts, `CHANGELOG.md`, the See also lines from the closest pages and between the new pages, the `FIND` rows and finder case 9, the test entries (`KEYBOARD_PAGES` for four pages, `PHONE_DEFAULTS` for Audio Visualizer) and the generated files including `og-image.png` (Task 11, `integrate.mjs`, Step 5); generated files never merged by hand (Task 11 Step 3's loop; the rollout's Task 12 Step 1).
- Building it: the branch, the owner's answer on the finder and Famous effects with both paths, run folder, every lane's shared edits tried, finder rows' check and worktrees (Task 0); builder and reviewer per lane with report files and at most three fix rounds (each lane's last step); late rulings before integration (Task 11 Step 1, Task 12 Step 7); integration by the coordinator as in the special-animations precedent (Task 11); the final review in three parts on a frozen checkout, one fix wave, a scoped re-review, the whole-site check (here or the rollout's), the owner's look, the hand-over and fixes after joining (Task 12); the machine rules (Global Constraints); release with the rollout on the owner's word.
- Acceptance: tests with the final gate, six `ok` lines per new and edited page, home and Famous effects (Task 11 Step 6, Task 12 Steps 3 and 4); the kit's short screens with no label cut or overlapping (each lane, Task 12 Step 3); reviewer verdicts (each lane, Task 12); frame times, Lightning's flash count and Audio Visualizer's silent start (Tasks 10 and 7, Task 12 part 2); every count 176 and the generated files (Task 11); the owner's look and nothing published before (Task 12).

**Placeholder scan:** every page, README, preview and tool is given in full; commands and expected outputs are exact. The only values a step fills in are the ones only known at run time (a date, a commit hash, a measured number, the ledger's version N), each named where it is used.

**Consistency:** the tools' names and options (`lanes.mjs <n> <root>`, `frametimes.mjs --base … [--phone] [--modes …] <page>`, `resolve.mjs <file>...`, `integrate.mjs <root> [--finder-check]`) are the same in Task 0, the lanes and Tasks 11 and 12; preview keys, slugs, titles, ledes, places and finder rows match between `lanes.mjs`, `integrate.mjs` and each lane's Interfaces; ports are 8960 + n for the lanes, 8971 for `ten-int` and 8972 for `ten-rev` (the coordination file's Ten new row); every command block sets `REPO`, `RUN` and `TEN` and checks its `cd`; every Chrome run is a pool run in the background with an `EXIT=` line, waited on with `wait-log.mjs`; the kit always runs from a copy inside the worktree it pictures; report files start with a `RESULT:` line and only the coordinator writes the ledger.

**Pre-flight reviews:** `plan-review-A.md` (the process), `plan-review-B.md` (the lanes) and the re-review `plan-rereview.md` were applied; `plan-fixes.md` in the run folder lists each finding, what changed, and the checks run again.
