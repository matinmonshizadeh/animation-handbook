# See Inside and Compare: the Other 159 Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the 159 animation pages that the first batch left out their See inside and Compare views, page by page (each built in its own page code by one builder and approved by a reviewer who did not build it), then integrate (taking in the ten new animations, built beside this plan on `feat/ten-animations`), review the whole in nine parts and put all 176 pages in front of the owner, ready to publish together on the owner's word.

**Architecture:** The page code is not in this plan: each page's requirements are its brief (`briefs/<NN>-<slug>.md`, written by twelve brief lanes), its model is the closest first-batch page, and this plan defines the process exactly. Twenty slots (worktree, branch, port) each build an ordered list of pages, hard and heavy pages first, one writer at a time; every page goes builder → own checks → one commit → fresh reviewer → at most three fix rounds. The coordinator (the main session) plays the seven lane leads: a small tracker in the run folder (`pages.mjs`) keeps every page's state, decides what starts next within the 20 agents the app allows, fills the prompt templates of Tasks 7 and 8, and says up to which commit a slot's approved pages can be merged into their category branch. Chrome runs go through the machine-wide pool of eight. A finished category gets its whole page check and lands on `feat/see-inside-compare`, where its part of the final review starts at once; integration (which first merges in `feat/ten-animations`), the eighth and ninth review parts and the owner's final look follow.

**Tech Stack:** Plain HTML, CSS and vanilla JavaScript in the pages (no build, no packages); Node 22+ (`node --test`, built-in `fetch` and `WebSocket`) for the tests, the page check, the review kit and the run-folder tools; headless Chrome over the DevTools protocol (`tools/check-pages.mjs`, `record.mjs`); Python's `http.server` for local serving; git worktrees.

**Spec and inputs:** `docs/superpowers/specs/2026-10-13-see-inside-compare-rollout-design.md` (all of it) and `docs/superpowers/specs/2026-10-13-next-projects-coordination.md` (where the two differ, the coordination file wins). The previous plan, `docs/superpowers/plans/2026-10-13-see-inside-compare-phase0-first-batch.md`, builds Phase 0 (the shared fixes, the page check's mode path, the review kit `record.mjs`, the slot pool `slot.mjs`, version 10) and the first batch (Tasks 7 to 13: Parallax Scrolling, Fade In / Fade Out, Overlay Wipe, Magnetic Button, Marquee / Ticker, Fluid / Liquid Simulation, Flow Field), and ends with the owner's look (its Task 14). This plan starts where that one ends. The page surveys: `.superpowers/sdd/2026-10-13-learn-pilot/rollout-survey-01-03.md`, `-04.md`, `-05-07.md`. The briefs' format: `.superpowers/sdd/2026-10-13-see-inside-compare/briefs/HOW-TO-WRITE.md`. The coordinator's rulings given while the briefs were written: `briefs/RULINGS.md` (seven general rulings), `briefs/OPEN-QUESTIONS.md` (rulings across lanes) and the `RULED:` cells of the twelve `briefs/summary-<lane>.md` (the lanes `01a`, `01b`, `02`, `03`, `04a`, `04b`, `04c`, `05`, `06a`, `06b`, `07a`, `07b`; a page's row starts `| <NN>-<slug> |`).

**State when this plan was fixed (2026-10-15):** Phase 0 Tasks 0, 1, 2 and 4 and its review kit are done (the branch at b5db0fa; the kit's rounds 3 and 4, Normal compared region by region at three sizes and the `--short` run, are done and tested, and their review is part of Task 5), its page check (Task 3) is in review and its bump (Task 6) still to come; the first batch is being built from b5db0fa (owner: speed); all 159 briefs are written, the twelve brief lanes are done and every open question is ruled (`briefs/OPEN-QUESTIONS.md`); the Animation finder and Famous effects are near their last tasks; the owner has said the ten new animations start right after Phase 0, so they run beside the first batch and this plan, on `feat/ten-animations`, and share its seats and Chrome pool (where their pages land: "What waits for the owner's verdict").

## Global Constraints

- **Checkout and branch:** the main checkout `C:/Users/matin/OneDrive/Desktop/Projects/animation-handbook` stays on `feat/see-inside-compare` for the whole run; it is never switched. Nothing is pushed and nothing is merged into `main` before Task 15, and then only on the owner's word.
- **Merges:** `git merge --no-ff` only; never rebase, squash, cherry-pick or amend. One undo is allowed: `git reset --hard ORIG_HEAD` in a category worktree, right after its own merge failed the tests (Task 10, Step 2). Only the coordinator merges: a slot's approved pages into `sic/cat-NN` (in `.claude/worktrees/sic-cat-NN`), a finished category into `feat/see-inside-compare` (in the main checkout), lanes into `feat/see-inside-compare`, `feat/ten-animations` into `feat/see-inside-compare` (Task 12, Step 1), and, for a page fix after Task 12 has merged anything, `feat/see-inside-compare` into that page's slot first.
- **Places (worktrees under `.claude/worktrees/`, ports on 127.0.0.1):**

  | What | Worktree | Branch | Port |
  |---|---|---|---|
  | The 20 slots (table in "The slots") | `sic-<NN><x>` | `sic/<NN><x>` | 8801–8820 |
  | Re-cut slots (Task 9, Step 7) | `sic-<NN><next letter>` | `sic/<NN><next letter>` | 8821–8827, in order |
  | The probe (Task 4) | `sic-probe` | detached | 8828 |
  | The owner's shared changes (Task 1) | `sic-00f` | `sic/00f` | 8829 |
  | The kit hold's fixture site (Task 5) | — (the folder `$RUN/scratch/kit-hold/site`) | — | 8840 |
  | Category merges and checks | `sic-cat-01` … `sic-cat-07` | `sic/cat-01` … `sic/cat-07` | 8831–8837 |
  | A check fix in mid-run (Task 9, Step 8) | `sic-00h` | `sic/00h` | 8838 |
  | Integration's shared changes (Task 12) | `sic-00i` | `sic/00i` | 8839 |
  | Final review's frozen checkouts | `fr-01` … `fr-08` | detached | 8841–8848 |
  | Integration (Task 12) | `sic-int` | `sic/int` | 8850 |
  | Normal's before-pictures (exists) | `sic-before` | detached at `main` | 8800 |
  | The owner's preview of the main checkout | — | `feat/see-inside-compare` | 8731 |
  | Releases (Task 15) | `release` | `main` | 8990 |

  Never 8901–8909 (finder), 8931–8939 (Famous effects), 8961–8970 (ten new animations).
- **Run folder:** `.superpowers/sdd/2026-10-13-see-inside-compare/` (git-ignored, in the main checkout): `ledger.md` (one line per event), `pages.json` and `pages.mjs` (the tracker), `slots.json`, `prompts/`, `reports/<NN>-<slug>/`, `briefs/`, `checks/`, `kit/`, `final/`, `lessons.md`, `brief-rulings.md`, `rulings-159.md`, `shared-wishes.md`, `agents.md`, the slot pool `slots/` and `slot.mjs`, and the small tools `wait-log.mjs`, `check-slots.mjs`, `extract-prompts.mjs`, `probe.mjs`.
- **Shell variables:** every Bash call that uses them starts with `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; FX=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/fixtures` (each Bash call starts in a fresh shell). Git Bash hands a `/c/…` argument to `node` as a Windows path, but not a path written inside a `node -e` script: such a script runs from `$RUN` with paths relative to it.
- **Agents:** the app runs at most 20 agents at once, for every project together. Page work gets the seats left after the other projects' running agents and one spare (Task 9, Step 1); reviews start before fixes, fixes before new pages. Every builder, reviewer, fixer, brief checker and final reviewer runs on the strongest model (`model: "opus"`); the purely mechanical jobs (Task 2's files, Task 4's probe runs) may run on `sonnet`. A page has one builder, who also does its fix rounds, and one reviewer, who never built it; at most three fix rounds, then the coordinator decides (Task 9, Step 5). Agents start no agents of their own and never open the browser pane.
- **Machine:** at most eight Chrome runs at once for every project, each through `node $RUN/slot.mjs run <who> -- <command>`. An agent runs one Chrome job at a time, started as a background command with its output in a log that ends with a line `EXIT=<code>`, and waits for it with `node $RUN/wait-log.mjs <log>` (it waits up to nine minutes per call; call again while it says "still running"). `<who>` names: `b-<NN.MM>` builder, `r-<NN.MM>` reviewer, `f-<NN.MM>` fixer, `cat-<NN>-<k>` category check part, `probe-<NN>-<k>`, `fr-<NN>`, `site-<NN>-<k>`, `kit-<what>`. Headless Chrome only. One server per worktree, started and stopped by the coordinator (`python -m http.server <port> --bind 127.0.0.1` from the worktree root, as a background command). No `git stash` (every worktree shares it): to compare versions, `git show <rev>:<path> > <scratch file>`. Leftover temp folders (`hb-chrome-*`, `hb-kit-*`, and the tests' `sic-run-*`, `sic-repo-*` and `sic-pool-*`) are removed at the end with the owner's OK.
- **Version and frozen files:** the shared files stay at the number Task 1 leaves (10, or 11 if the owner asked for a shared change). From Task 6 to Task 12, `assets/css/demo-page.css`, `assets/js/demo-page.js`, `tests/demo-page.test.js`, `tests/pages.test.js` and `tools/check-pages.mjs` are frozen; the one way to change the check in mid-run is lane `sic/00h` (Task 9, Step 8). A page that needs a shared change gets one line in `$RUN/shared-wishes.md`; Task 12 applies them all, with the next version number on every animation page and the home page (tracked files only, line endings kept).
- **Pages:** a page's build and fix commits touch only `animations/<category>/<slug>/index.html`, and its `README.md` only where a ruling for the page says so (Zoom Transition's reduced-motion sentence, made true to the code: `briefs/summary-03.md`; the one exception to spec section 6's "No change: the 166 page READMEs"; the builder then runs `node tools/make-skill.mjs` and commits what it writes only if it changed): no other README, home page, `CATS`, prompt, setting, chip or tag changes, and `node tools/make-skill.mjs` writes identical files. A page's requirements are its brief; the coordinator's rulings: `$RUN/briefs/RULINGS.md`, `$RUN/briefs/OPEN-QUESTIONS.md`, the page's row in the brief lane's summary that lists it (`$RUN/briefs/summary-<lane>.md`, after `RULED:`) and `$RUN/brief-rulings.md`; and `$RUN/rulings-159.md` (the owner's rulings from the first batch). Every builder, reviewer and checker reads them beside the brief. Where they differ, a ruling wins over the brief and over these Global Constraints for its page, and the owner's (`rulings-159.md`) over the coordinator's; where the builder finds a clearer picture than the brief's, it builds it and says why.
- **Names:** never `hb-view` anywhere in a page. The switch and the notes box are exactly as on Parallax Scrolling. Every page CSS selector part that contains `data-hb-mode` starts its stage part with `.stage[data-hb-mode="inside"]` or `.stage[data-hb-mode="compare"]`; no rule on `[data-hb-mode="normal"]`. No element's class is exactly `lbl` (a label class always has a second name).
- **The page's `hb:mode` listener (spec section 1):** `document.addEventListener('hb:mode', …)` at the top level of the page's inline script; hears every press, never one at boot; draws the current state at once; safe to run twice; never scrolls, moves focus, presses a control, stops Play or changes Pause. The shared script, not the page, plays the demo once after See inside or Compare (ruling 1).
- **Copies:** made once (at load or on first entry); ids removed or renamed (gradients, masks, filters, `for`); `inert`; `aria-hidden="true"`; not rendered outside Compare. A canvas page splits one canvas; a WebGL page draws one context in two viewports, never a second context; a second world (spec section 2) takes the same fixed steps as the first from one accumulator.
- **Captions:** every label and half name carries `data-hb-caption`; at least 12px as drawn; 4.5:1 against its own backing; inside the stage; covering neither the part it names nor another caption; at most six (four on phones); amounts as a beginner says them, never ms, px, deg or CSS names.
- **Notes:** exactly two, `p[data-hb-for="inside"]` then `p[data-hb-for="compare"]`, direct children of `div.hb-mode-notes`; one or two plain sentences, at most 35 words, on what the visitor sees; the Compare note names the halves by their labels; a note says left and right only on a page whose halves never stack; when the stage looks like Normal until the visitor acts, the note ends with what to do; a note the script rewrites (a setting, reduced motion) uses the markup's own words for the default state.
- **Motion:** only transform and opacity animate (a copy may animate exactly what its page's own Normal animates, nothing in layout: `briefs/OPEN-QUESTIONS.md`, lane 05); a frame loop moves by elapsed time (`FRAME = 1000 / 60`, `dt = lastT === null ? 0 : Math.min(ts - lastT, 50)`, each step × `dt / FRAME`, × 1/3 in Slow motion); a Replay or Show me run holds its pauses with `setTimeout`, never inside a frame loop or a `setInterval`; on phones each Compare half gets half the budget (particles, dots, tiles); a blur is never doubled.
- **Reduced motion:** every mode is a still picture that still teaches; no mode adds movement; the shared script presses nothing.
- **Phones:** the box keeps its size in every mode, Compare included (ruling 4); halves side by side while each keeps about 160px of scene, else stacked; anything a mode adds that can be pressed is at least 44×44px (checked by hand: the page check skips the stage); hover and drag keep their touch equivalents.
- **Words and size:** no code on the page; American spelling; no hype; about 300 lines for the demo plus about 150 for its two views (a page already past 300 adds about 150 at most).
- **Checks:** the tests are `node --test "tests/*.test.js"` from the worktree root: all pass. The page check is `node tools/check-pages.mjs --base http://127.0.0.1:<port> --out <folder> <page folders>`: six `ok` lines per page. The kit (`record.mjs`) gives the motion (clips), the settings (`--press`), Normal before and after (`--before http://127.0.0.1:8800`: the stage and Try it, each pictured on the screen and clipped to its own box, at 1280, 375 and 320; Phase 0's kit round 3) and the short stages (`--short`: the page check's two place rules for labels and half names (inside the stage, none overlapping) at 667×375, 812×375, 844×390, 932×430, 1024×600, 1280×600, 1366×630 and 1440×620, and 812×375 with reduced motion, in every mode; one line per size and mode, a last line `27 short-screen pictures checked, <n> with labels cut or overlapping, <s> skipped, <f> failed`, exit 1 on a problem; added by Phase 0's kit round 4 and reviewed in Task 5, which then appends `Kit short: done: record.mjs --short, reviewed` to `$RUN/ledger.md`: the line Task 6 waits for, beside Task 5's `Kit hold: done`).
- **Acceptance for each page (spec section 1), confirmed line by line by a reviewer who is never the builder:** (1) clear from the picture alone in the mode screenshots at 1280 and 375, start outlines where a movement is shrunk; (2) every mode still under reduced motion and still teaching; (3) Normal at rest pixel-identical to before (a few antialiased corner pixels aside; random pages by eye), Try it, chips and prompt unchanged; (4) a mode change never scrolls the page or the box, moves focus, stops Play or changes Pause, shows the current state at once, then plays once on plays-once and do-it pages (not under reduced motion); (5) notes as above; (6) captions as above; (7) every setting visibly changes See inside and Compare; (8) phones as above; (9) the keyboard works in every mode as in Normal, copies inert and hidden from screen readers, a named picture names each mode, a control's name contains its visible words; (10) light enough, as above; (11) tests pass and six `ok` lines; (12) words and size as above.
- **Commits:** a build is one commit, `feat: <Title> shows <the See inside picture> (See inside) and <the first half> beside <the second half> (Compare)`; a fix round adds commits `fix: <Title>: <what changed>`; merge commits say what they bring. `{{…}}` in a prompt template is a value the tracker fills in (Task 2).
- **Reports:** every agent writes its report file, whose first line is its RESULT line (Tasks 7 and 8), and replies with at most three lines. The coordinator reads RESULT lines through the tracker, not whole reports.

## What waits for the owner's verdict on the first batch, and what starts now

**Starts now, beside the first batch and the owner's look (no page code):**
- Task 0: this plan committed and the coordination file brought up to date, before Task 2, Step 8 extracts the prompts.
- Task 2: the tracker, the slot table, the prompt templates and the run files.
- Task 3: the 159 briefs (all written, their open questions ruled) checked, each lane's by a fresh agent.
- Task 4: the rest-and-run probe of every page, once Phase 0 is merged (the previous plan's Task 6) and the first batch's last check before the owner's look has ended (so it never slows those checks), which finds before any build the pages whose stage never rests, whose runs never end, or whose runs scroll or move focus. Task 6 may start before it ends (Task 6, Step 1).
- Task 5: the review kit holds endless animations at rest as the page check does, and kit rounds 3 and 4 are reviewed, once Phase 0's page check is merged and the kit's round 4 is done.

**Waits for the verdict:**
- Task 1, which applies it: fix rounds on first-batch pages, a shared change with `?v=11` if the owner asks for one, the owner's rules written for every builder and into the briefs they change, and the owner's answer on each Compare that shows a mistake beyond the spec's list (the list goes to the owner with the first-batch look: Task 1, Step 1).
- Every page build, and therefore Tasks 6 to 15: every slot starts from the branch with the verdict's changes in it.

**Why the pages wait:** the seven first-batch pages are the models every builder copies, and the owner's answer can change a rule every page follows; building first would mean building twice. The spec says it too (section 3: "then the rest starts").

**The ten new animations** are built beside this plan by their own plan, on `feat/ten-animations` (ports 8961–8970, the same seats and Chrome pool). Their pages land on `feat/see-inside-compare` only at the start of integration, when Task 12, Step 1 merges `feat/ten-animations` in; before that they land on no `sic/` slot or category branch and not on `feat/see-inside-compare`, unless the owner says otherwise. So the tracker, the slot table and every count up to Task 11 stay at 166 pages; from Task 12 on, the whole-site check, the final review (its part 9 is theirs: Task 13), the gallery and the owner's final look cover all 176 pages, and both projects go live together on the owner's word (Task 15). Task 0 writes this change of order into the coordination file.

## Phases

| Step | Tasks | Starts when | Runs beside |
|---|---|---|---|
| 0 | 0, then 2, 3, 4 and 5 | now (Task 0 before Task 2, Step 8); Task 4 once Phase 0 is merged and the first batch's last check has ended; Task 5 once Phase 0's page check is merged and the kit's round 4 is done | the first batch, the owner's look, the finder, Famous effects, the ten new animations |
| 1 | 1 | the owner's verdict | Task 4, if it has not ended |
| 2 | 6 | Tasks 1, 2, 3 and 5 done, with the kit's `--short` (Phase 0's kit round 4, reviewed in Task 5) (Task 4 may still run: Task 6, Step 1) | Task 4, if it has not ended |
| 3 | 7, 8, 9, 10: the 159 pages in 20 slots | Task 6 | each other |
| 4 | 11: final review parts 1 to 7 | each category as it lands | step 3 |
| 5 | 12: integration, starting with `feat/ten-animations` merged in | every category landed, parts 1 to 7 clear, the ten new animations reviewed by their own plan | — |
| 6 | 13: final review parts 8 (shared files, tools, docs) and 9 (the ten new pages) | Task 12's lane committed and checked | — |
| 7 | 14: the owner's final look | Task 13 merged | — |
| 8 | 15: release, clean-up | the owner's word | — |

## The slots

Each slot builds its pages in this order. Letters: X a second world (spec section 2), H hard, M medium, E easy (from the surveys and the briefs' summaries); the tracker weighs them 4, 3, 2, 1 to start the slot with the most work left first. Hard and heavy pages come first; every second-world page is first in its slot except 2D Physics, second in 06a after Cloth. Twins share a slot, one after the other, the second built after the first is committed so its builder can make a different picture: Stacking Cards → Section Wipe (01a), Pin Animation → Sticky Section (01b), Split Text Reveal → Letter-by-Letter Stagger → Word-by-Word Reveal (02a), Portal / Tunnel Zoom → Circle Reveal (03b). Curtain Reveal (02b) and Flash / Light Leak Transition (03b) each draw their own cover-swap-uncover picture, not a copy of Overlay Wipe's.

| Slot | Port | Pages, in build order | Weight |
|---|---|---|---|
| 01a | 8801 | 01.20 scroll-image-sequence H · 01.06 stacking-cards M · 01.18 section-wipe M · 01.04 cover-card-to-fixed-header M · 01.23 scroll-velocity-skew M · 01.14 horizontal-scroll M · 01.17 progress-bar M · 01.26 scroll-background-color M · 01.22 text-fill-on-scroll E | 18 |
| 01b | 8802 | 01.21 smooth-scroll H · 01.09 pin-animation M · 01.15 sticky-section M · 01.07 scroll-trigger M · 01.12 reveal-on-scroll M · 01.11 scrollytelling M · 01.16 counter-animation M · 01.25 scrollspy-nav M · 01.03 reverse-scrolling-columns M | 19 |
| 01c | 8803 | 01.10 snap-scrolling H · 01.01 parallax-depth-of-field M · 01.27 hide-on-scroll-header M · 01.13 stagger-reveal M · 01.08 scrub-animation M · 01.24 svg-line-draw M · 01.05 fly-in-fly-out-contact-list M · 01.19 zoom-into-image M | 17 |
| 02a | 8804 | 02.14 shatter-effect H · 02.07 split-text-reveal M · 02.08 letter-by-letter-stagger M · 02.09 word-by-word-reveal M · 02.11 flip-in E · 02.13 rotate-in E | 11 |
| 02b | 8805 | 02.06 curtain-reveal M · 02.12 bounce-in M · 02.05 clip-path-reveal M · 02.10 blur-in E · 02.02 slide-in E · 02.04 scale-in E · 02.03 slide-up-reveal E | 10 |
| 03a | 8806 | 03.09 elastic-transition X · 03.01 view-transitions-api H · 03.11 dissolve M · 03.02 shared-element-transition M · 03.04 crossfade M · 03.06 zoom-transition M · 03.08 blur-transition M | 17 |
| 03b | 8807 | 03.15 page-curl H · 03.10 portal-zoom M · 03.13 circle-reveal M · 03.12 flip-technique M · 03.07 flash-transition M · 03.03 morph-transition M · 03.16 cube-transition M · 03.05 slide-transition M | 17 |
| 04a | 8808 | 04.40 gooey-menu H · 04.33 drag-to-reorder H · 04.22 swipe-to-dismiss H · 04.17 drawer-slide M · 04.18 modal-expand M · 04.19 accordion M · 04.28 segmented-control M · 04.06 toggle-switch E · 04.24 theme-toggle-morph E | 19 |
| 04b | 8809 | 04.07 heart-burst H · 04.08 success-confetti H · 04.39 image-trail H · 04.13 checkmark-draw M · 04.12 progress-animation M · 04.09 skeleton-loader M · 04.34 rolling-numbers M · 04.11 loading-spinner E · 04.15 badge-pulse E | 19 |
| 04c | 8810 | 04.27 toast-notification H · 04.29 pull-to-refresh H · 04.41 dynamic-island M · 04.36 hold-to-confirm M · 04.21 error-shake M · 04.14 form-field-morph M · 04.37 expanding-search M · 04.23 hamburger-menu-toggle M · 04.25 copy-to-clipboard E · 04.03 focus-ring E | 20 |
| 04d | 8811 | 04.20 cursor-follower H · 04.31 spotlight-hover M · 04.16 tooltip-reveal M · 04.26 star-rating M · 04.38 button-loading-states M · 04.32 add-to-cart-fly M · 04.04 button-press-scale M · 04.01 hover-state E · 04.02 click-ripple E · 04.10 shimmer-effect E · 04.30 gradient-border E · 04.35 typing-indicator E | 20 |
| 05a | 8812 | 05.19 text-particles H · 05.16 split-flap-board M · 05.02 typewriter-effect M · 05.03 scramble-text M · 05.12 glitch-text M · 05.17 neon-flicker M · 05.09 outline-to-fill M · 05.14 wavy-text M · 05.15 highlighter-sweep M | 19 |
| 05b | 8813 | 05.01 kinetic-typography M · 05.10 enter-exit-typography M · 05.18 handwriting-draw M · 05.13 text-on-path M · 05.08 text-gradient-animation M · 05.11 rotate-word-carousel M · 05.07 text-morphing M · 05.04 variable-font-morph M · 05.05 text-clip-path-reveal M | 18 |
| 06a | 8814 | 06.15 cloth-simulation X · 06.23 physics-2d X · 06.04 canvas-particle-effect H · 06.26 infinite-zoom H · 06.11 2-5d-pseudo-3d M · 06.02 scroll-driven-3d-rotation M | 18 |
| 06b | 8815 | 06.13 gpgpu-particle-system X · 06.01 3d-model-orbit H · 06.07 webgl-shader-animation H · 06.12 ray-marching-sdf H · 06.06 glassmorphism-animated M · 06.10 chromatic-aberration M | 17 |
| 06c | 8816 | 06.21 flocking X · 06.16 volumetric-smoke H · 06.14 image-distortion-hover H · 06.20 depth-map-photo H · 06.17 morphing-blob M · 06.09 svg-path-animation M | 17 |
| 06d | 8817 | 06.24 liquid-glass X · 06.08 noise-based-motion H · 06.22 ascii-halftone H · 06.25 holographic-card M · 06.18 flip-card-3d M · 06.19 carousel-3d M · 06.03 parallax-3d-tilt M | 18 |
| 07a | 8818 | 07.12 abstract-geometric-motion X · 07.07 starfield H · 07.19 snow-rain H · 07.15 synthwave-grid H · 07.11 grid-dot-pattern-parallax M · 07.18 wave-layers M · 07.10 floating-elements M | 19 |
| 07b | 8819 | 07.20 fireworks X · 07.09 ambient-ripple H · 07.13 particle-constellation H · 07.23 game-of-life H · 07.08 breathing-glow M · 07.06 light-leak M · 07.05 scanline M | 19 |
| 07c | 8820 | 07.16 matrix-rain H · 07.17 plasma H · 07.21 topographic-lines H · 07.22 light-rays H · 07.01 animated-gradient-background M · 07.02 mesh-gradient M · 07.03 aurora M · 07.04 grain-overlay M | 20 |

159 pages: 26 in 01, 13 in 02, 15 in 03, 40 in 04, 18 in 05, 25 in 06, 22 in 07. The two 02 slots carry about half the others' work: they finish first and are re-cut for the category with the most pages left (Task 9, Step 7). The order inside a slot may change before a page starts (a brief's summary rates it harder than the survey did): the coordinator edits `slots.json` before Task 6, or uses `pages.mjs move` afterwards, never splitting twins.

## Agents and Chrome: how the work queues

**Agents.** The coordinator is the only one who starts agents. Before each dispatch it counts the agents running for every project (it started them all) and gives page work the rest, less one spare kept for its own short jobs: `seats = 20 − running − 1` (with a higher cap set by the owner, that cap). `node pages.mjs dispatch <seats>` then picks, in this order: (1) reviews and re-reviews of committed pages, oldest first; (2) fix rounds, oldest first, each only when its slot has no writer; (3) new pages, the next one of each slot that has no writer and no page waiting for a fix, the slot with the most work left first. A slot has one writer at a time (a build or a fix round), so the tests and the files a writer sees are its own; its next page may be built while the last one is reviewed. With 20 seats and about one review for every three builds, about 14 to 15 builders and 5 reviewers run at once; all 20 slots are busy only when the cap allows about 26 agents.

**Chrome.** Every page check and kit run takes one of the pool's eight slots (`slot.mjs run`), for every project at once. An agent holds at most one: it starts the run in the background, with its log, and waits with `wait-log.mjs`, so a full pool only makes it wait (up to an hour, the pool's own limit; then it starts the run again). The coordinator's category checks run at most two parts at once while page work goes on, and up to seven once it is over (Task 12). Builders use Chrome about a quarter of their time and reviewers about a third, so they alone keep about six of the eight busy on average; the category-check parts, the final review's galleries, the probe (four parts at once while it runs) and the other projects' runs (the ten new animations' page checks and their slowed-CPU frame-time runs among them) come on top. So the pool, not the seats, sets the pace: an agent waiting for a slot holds its seat. When the pool has been full for 20 minutes with runs waiting, the coordinator starts no new build that round, and reviews and fix rounds keep their turn (Task 9, Step 1).

## Who touches which file

| File | Task |
|---|---|
| Each of the 159 `animations/*/*/index.html` | its builder (Task 7) and fix rounds (Task 8), in its slot, its own file only (and its `README.md` where a ruling says so: Zoom Transition's) |
| The seven first-batch pages | Task 1 (fix rounds asked by the owner, by the previous plan's Task 14, Step 6) |
| The version line of every animation page and of `index.html` | Task 1 (`?v=11`, only for a shared change the owner asks for), Task 12 (the higher number of the two branches after `feat/ten-animations` is merged in; the next number, only for shared wishes) |
| `assets/css/demo-page.css`, `assets/js/demo-page.js`, `tests/demo-page.test.js` | Task 1 (lane `sic/00f`), Task 12 (lane `sic/00i`) |
| `tools/check-pages.mjs` | Task 1 (lane `sic/00f`, only for a shared change the owner asks for), Task 9, Step 8 (lane `sic/00h`), Task 12 (lane `sic/00i`) |
| `tests/pages.test.js` | Task 1 (lane `sic/00f`, a test of the owner's shared change), Task 12 (the final gate and the learning path's guard, lane `sic/int`; shared wishes, lane `sic/00i`) |
| `CLAUDE.md`, `CONTRIBUTING.md`, `.github/pull_request_template.md`, `README.md`, `CHANGELOG.md`, `sitemap.xml` | Task 12 (lane `sic/int`) |
| This plan (committed) and `docs/superpowers/specs/2026-10-13-next-projects-coordination.md` (its Order and Branches rows) | Task 0 |
| What `feat/ten-animations` brings (the ten new pages, the Next link on five last pages, the home page's cards, the counts, its tests and generated files) | the ten new animations' own plan; merged here by Task 12, Step 1 |
| Outside the repository: the run folder's files | Tasks 2, 3, 4, 5, 9 to 14 |
| Outside the repository: `$KIT/record.mjs`, `$KIT/README.md` | Task 5 |

## Time

Running time, as far as it can be known before the briefs are all written (the owner's looks come on top):

| Step | Time |
|---|---|
| Tasks 2 to 5 | about 3 hours, while the first batch is built and the owner looks: they delay nothing |
| Task 1 | minutes if the owner approves as is; about 2 hours with page changes; about 4 with a shared change (its version bump and whole-site check) |
| Task 6 | about 20 minutes |
| The 159 pages, all 20 slots busy (Tasks 7 to 10) | about 19 hours: a medium page takes about 1.5 hours to build and 0.5 to review and fix, a hard one about 2.5, a second world about 4; the busiest slot holds about 18 hours of building, and re-cut slots shorten the tail; 16 hours at best, about 30 with usage-limit stops, outages or extra rounds; the Chrome pool, shared with the other projects, sets this pace more than the seats do ("Agents and Chrome") |
| The last category's final review part and its fixes (Task 11) | about 2 hours after it lands (the other six run during the pages) |
| Integration, the whole-site check, parts 8 and 9 (Tasks 12, 13) | about 5 hours |

From the owner's verdict to the owner's final look: **about 26 hours with all 20 slots busy**. Under today's cap of 20 agents for every project, the reviews take seats the slots would use: about 24 hours for the pages, about 31 in all; if the ten new animations run at the same time they share the seats too: add about 4 hours.

---
### Task 0: The plan committed, and the coordination file brought up to date (coordinator)

**Files:**
- Modify: `docs/superpowers/specs/2026-10-13-next-projects-coordination.md` (under "Order", item 3; under "Branches and places", the Rollout row's ports and the Ten new row's "Cut from").
- Commit (main checkout, `feat/see-inside-compare`): this plan, untracked until now, and that change.

**Interfaces:**
- Consumes: this plan with its pre-flight review's fixes (`$RUN/plan159-review.md`, `$RUN/plan159-fixes.md`).
- Produces: the plan tracked, so Task 2, Step 8 extracts the prompt templates from committed text and the empty status that Task 6, Step 1 and Task 10, Step 5 expect holds; the coordination file (which wins where it and this plan differ) saying what this plan does: the ten new animations run beside it and are merged in at its integration, and its places use ports 8821–8850 beside 8800–8820.

- [ ] **Step 1: The coordination file**

In `docs/superpowers/specs/2026-10-13-next-projects-coordination.md`, under "## Order", replace

```text
3. **The ten new animations,** once the rollout is integrated; built without the new tabs. Live after the rollout, or with
   it if the owner says so.
```
with
```text
3. **The ten new animations,** right after the rollout's Phase 0 (owner, 2026-10-14), beside the first batch and the other
   159 pages, on their own branch; built without the new tabs. Their branch is merged into the rollout's at the start of the
   rollout's integration, so its final review, gallery and final look cover all 176 pages, and both go live together on the
   owner's word.
```
In the table under "## Branches and places", in the Rollout row replace `8800 (before-pictures), 8801–8820` with `8800 (before-pictures), 8801–8820 (slots), 8821–8850 (re-cut slots, the probe, lanes, category checks, final review, integration)`, and in the Ten new row replace `` `feat/see-inside-compare` once integrated, main merged in; `main` if the rollout is live by then `` with `` `feat/see-inside-compare` once Phase 0 is merged (owner, 2026-10-14); merged back into it at the start of the rollout's integration ``.

Run: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook && git diff --stat -- docs/superpowers/specs/2026-10-13-next-projects-coordination.md`
Expected: `1 file changed, 6 insertions(+), 4 deletions(-)`.

- [ ] **Step 2: Two commits, before Task 2, Step 8**

```bash
cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook
git status --short -- docs
git add docs/superpowers/plans/2026-10-14-see-inside-compare-other-pages.md
git commit -m "docs: the plan for See inside and Compare on the other 159 pages" -- docs/superpowers/plans/2026-10-14-see-inside-compare-other-pages.md
git commit -m "docs: the coordination file: the ten new animations run beside the rollout and join it at its integration; the rollout's ports up to 8850" -- docs/superpowers/specs/2026-10-13-next-projects-coordination.md
git status --short -- docs
git log --oneline -2
```
Expected: the first status lists `?? docs/superpowers/plans/2026-10-14-see-inside-compare-other-pages.md` and ` M docs/superpowers/specs/2026-10-13-next-projects-coordination.md` (another project's untracked plan, if one is there, stays out of these commits); the second lists neither file; the two commits on top, as 5cf70b3 was for the previous plan. Task 2, Step 9's ledger section names their hashes.

---
### Task 1: The owner's verdict on the first batch, applied (coordinator)

**Files:**
- Modify (only if the owner asks): the first-batch pages, by the previous plan's Task 14, Step 6.
- Modify (lane `sic/00f`, only for a shared change the owner asks for): the shared file the change needs and its test; then the version line of every tracked `animations/*/*/index.html` and of `index.html` (`?v=10` → `?v=11`).
- Create (outside the repository): `$RUN/rulings-159.md` (replacing Task 2's placeholder file), `$RUN/briefs/owner-amendments.md`. Modify: `$RUN/lessons.md`, `$RUN/ledger.md`, the briefs an owner's rule changes.

**Interfaces:**
- Consumes: the previous plan's Task 14 (the seven pages on `feat/see-inside-compare`, the kit's first-batch run, the owner's answer written in `$RUN/ledger.md` by its Step 6, with the answer on each listed Compare); Task 2's `lessons.md`; Task 3's checked briefs (for Step 5).
- Produces: `$RUN/rulings-159.md`, which every builder and reviewer reads with the brief; the ledger's gate line `First batch approved by the owner on <date>; shared files at v=<N>; rulings-159.md: <K> rules`, which Task 6 waits for.

- [ ] **Step 1: Read the verdict**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; grep -n -i "owner" $RUN/ledger.md | tail -20`
Expected: the owner's answer to "Roll these out to the other 159 pages as they are, or change something first?" (the previous plan's Task 14, Step 6). If the answer is not written there yet, nothing in this task starts.

The first-batch look message (the previous plan's Task 14, Step 5) also carried, added by the coordinator, the list of Compare halves that show a mistake beyond the spec's list (`briefs/RULINGS.md`, item 2: each such page is listed for the owner's first-batch look), one line per page with its two half names: 01.11 scrollytelling, 02.13 rotate-in, 03.03 morph-transition, 04.10 shimmer-effect, 04.18 modal-expand, 04.34 rolling-numbers, 05.01 kinetic-typography, 05.08 text-gradient-animation, 05.11 rotate-word-carousel, 06.10 chromatic-aberration, 06.12 ray-marching-sdf, 06.18 flip-card-3d, 06.26 infinite-zoom, 07.06 light-leak, 07.12 abstract-geometric-motion, 07.13 particle-constellation, 07.21 topographic-lines and 07.22 light-rays (from `briefs/OPEN-QUESTIONS.md` and the summaries' "listed for the owner's look" cells; each brief names its pair and, where it has one, its fallback). Expected too: the owner's answer on each listed page, keep it or not, written with the verdict. If that answer is not there, ask the owner for it (the same list) before Step 2.

- [ ] **Step 2: Sort the answer and write `rulings-159.md`**

Sort every item of the answer into one of three lists: **P**, a change to one first-batch page; **S**, a change to a shared file (`assets/css/demo-page.css`, `assets/js/demo-page.js`, `tools/check-pages.mjs`); **R**, a rule every page follows (for example "labels a little bigger", "Compare always stacked on phones", "notes shorter"). An R item that also changes first-batch pages is both R and P. Each listed Compare the owner did not keep is an R item of its own, `NN.MM slug: Compare uses <the brief's fallback pair, or else the plain pair: the scene without the effect beside the page as set> (acceptance line 1)`, applied to that brief in Step 5. Write `$RUN/rulings-159.md`:

```markdown
# The owner's rulings from the first batch (<date>), for every page

Builders and reviewers read this file with the page's brief. Each rule says what to do and which acceptance line it changes.

R1. <the rule, in a builder's words> (acceptance line <n>)
R2. …

First-batch pages changed for these rules: <the list, or "none">.
```

If the owner approved the batch as it is and kept every listed Compare, the file says only: `None: the owner approved the first batch as it is on <date>.` and Steps 3 to 6 are skipped (with only listed Compares declined, Steps 3, 4 and 6 are skipped and Step 5 runs).

- [ ] **Step 3: P items, by the previous plan's Task 14, Step 6**

Each page change goes back to its first-batch lane as a fix round, exactly as the previous plan's Task 14, Step 6 says (the slot takes `feat/see-inside-compare` first, the same builder fixes, a new reviewer pass, `git switch sic/cat-NN && git merge --no-ff sic/NNa`, the category check, the coordinator's merge into `feat/see-inside-compare`). A ledger line per page. When both P and S items apply, Step 4 merges first; Step 3's slots then take `feat/see-inside-compare`, so each page fix is checked with the new shared files and `?v=11`.

- [ ] **Step 4: S items: lane `sic/00f`, its test first, then `?v=11`**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; git -C $REPO worktree add -b sic/00f $REPO/.claude/worktrees/sic-00f feat/see-inside-compare`
Start, as a background command: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-00f && python -m http.server 8829 --bind 127.0.0.1`

An agent (opus) makes each change test first: a test that pins it in `tests/demo-page.test.js` (the shared script), `tests/pages.test.js` (the stylesheet: the existing stylesheet tests read the rules with `cssRules`) or a fixture page of `$FX/sic-gen.mjs` (the page check); it runs the test file and sees the new test fail for the reason the change fixes; then the change; then `cd $REPO/.claude/worktrees/sic-00f && node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"` gives `ℹ fail 0`. Then the seven first-batch pages, through the pool, as a background command:
`REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $REPO/.claude/worktrees/sic-00f && node $RUN/slot.mjs run kit-00f -- node tools/check-pages.mjs --base http://127.0.0.1:8829 --out $RUN/checks/sic-00f animations/01-scroll-based/parallax-scrolling animations/02-entrance-and-exit/fade-in-out animations/03-page-transitions/overlay-wipe animations/04-micro-interactions/magnetic-button animations/05-text-typography/marquee-ticker animations/06-3d-advanced/fluid-simulation animations/07-ambient-background/flow-field > $RUN/checks/sic-00f.log 2>&1; echo "EXIT=$?" >> $RUN/checks/sic-00f.log`
then `cd $RUN && node wait-log.mjs checks/sic-00f.log` until it ends. Expected: `grep -c '^ok' $RUN/checks/sic-00f.log` prints `42`, no `FAIL`. Commit: `git add <the changed files> && git commit -m "feat: <the owner's change, in plain words>"`.

The bump, in the same lane (tracked files only, line endings kept):

```bash
cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-00f
git ls-files -- 'animations/*/*/index.html' index.html | xargs sed -b -i 's/demo-page\.css?v=10"/demo-page.css?v=11"/; s/demo-page\.js?v=10"/demo-page.js?v=11"/'
git grep -l 'v=10"' -- 'animations/*/*/index.html' index.html | wc -l
git grep -l 'demo-page\.css?v=11"' -- '*.html' | wc -l
git grep -l 'demo-page\.js?v=11"' -- '*.html' | wc -l
git ls-files --eol -- 'animations/*/*/index.html' index.html | grep -vc 'w/crlf'
```
Expected: `0`; the number of animation pages (`git ls-files -- 'animations/*/*/index.html' | wc -l`, 166 today); that number plus one (the home page links only the script); `0`. Then the tests (`ℹ fail 0`) and the whole site in parts, as Task 12, Step 7 runs it, but from this lane (`cd $REPO/.claude/worktrees/sic-00f`), with `--base http://127.0.0.1:8829`, `--out $RUN/checks/v11` and logs `$RUN/checks/v11-<NN>-<k>.log` and `v11-home.log`: every page six `ok`, no `FAIL`, and `home` six `ok`. Commit: `git add -u -- animations index.html && git commit -m "chore: the shared files are at version 11 on every animation page and the home page"`.

A fresh reviewer (opus) gets the owner's words, `git -C $REPO/.claude/worktrees/sic-00f diff feat/see-inside-compare...sic/00f` and the logs; confirms the test pins the change and failed before it, the bump commit changes only version strings (`git -C $REPO/.claude/worktrees/sic-00f diff HEAD~1 HEAD -U0 | grep '^[-+][^-+]' | grep -v 'demo-page\.\(css\|js\)?v=' | wc -l` prints `0`), and the whole-site logs. Then:

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook
cd $REPO && git merge --no-ff sic/00f -m "Merge the owner's first-batch change: <what>, and the shared files at version 11"
node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"
git worktree remove .claude/worktrees/sic-00f && git branch -d sic/00f
```
Expected: `ℹ fail 0`. Stop the 8829 server. A ledger line.

- [ ] **Step 5: R items: lessons and the briefs**

Append each R item to `$RUN/lessons.md` as `Owner (first batch) R<k>: <the rule>`. Dispatch one fresh agent (opus) with this prompt: "Read `$RUN/rulings-159.md` and the 159 briefs in `$RUN/briefs/` (the files named `NN-slug.md`). Where a rule changes what a brief asks for, add under the part it changes one line `Owner's ruling R<k>: <what changes for this page>`; change nothing else. List every brief you changed, with the rule, in `$RUN/briefs/owner-amendments.md`. Change no repository file. Reply in three lines." The coordinator reads three of the changed briefs and the list.

- [ ] **Step 6: The owner looks again, where pages changed**

For the first-batch pages changed in Steps 3 and 4: the previous plan's Task 14, Steps 3 to 5, for those pages only, until the owner approves.

- [ ] **Step 7: The gate line**

Append to `$RUN/ledger.md`: `First batch approved by the owner on <date>; shared files at v=<10 or 11>; rulings-159.md: <K> rules`. Task 6 may start.

---

### Task 2: The tracker, the slot table, the prompt templates and the run files

**Files (all outside the repository, in `$RUN`):**
- Create: `pages.test.mjs`, `pages.mjs`, `slots.json`, `check-slots.mjs`, `wait-log.mjs`, `extract-prompts.mjs`, `prompts/build.md`, `prompts/review.md`, `prompts/rereview.md`, `prompts/fix.md` (written by `extract-prompts.mjs` from Tasks 7 and 8), `lessons.md`, `brief-rulings.md`, `rulings-159.md` (a placeholder until Task 1), `shared-wishes.md`, folders `reports/` and `final/`.
- Modify: `ledger.md` (a section for this plan), `agents.md` (a section for this plan's agents).

**Interfaces:**
- Consumes: `slot.mjs` and the pool `slots/` (previous plan, Task 0); the repository's pages (read only).
- Produces: `node pages.mjs init | show [slot|NN] | dispatch <seats> | started <num> <id> | done <num> | set <num> key=value… | addslot <slot> <port> | move <num> <slot> | mergeable <slot> | merged <num>… | reopen <num> <file> | parts <NN> [size] | running | servers | rulings` (run from `$RUN`); `node wait-log.mjs <log> [seconds]` (exit 0 when the log has its `EXIT=` line, 3 while still running); `node check-slots.mjs <slots.json> <repository> [<briefs folder>]` (exit 0 and `no problem`); `node extract-prompts.mjs <plan> <run folder>`; the four prompt templates with the `{{NUM}}`, `{{SLUG}}`, `{{NN}}`, `{{CAT}}`, `{{SLOT}}`, `{{PORT}}`, `{{TITLE}}`, `{{REPO}}`, `{{RUN}}`, `{{WT}}`, `{{PAGE}}`, `{{FILE}}`, `{{BRIEF}}`, `{{CHECKS}}`, `{{KIT}}`, `{{REPORTS}}`, `{{N}}`, `{{COMMITS}}`, `{{FROM}}`, `{{TO}}`, `{{BUILDER}}`, `{{REVIEWER}}` the tracker fills. Report file names: `reports/<NN>-<slug>/build.md`, `review-<n>.md`, `fix-<n>.md`, each beside its `…-prompt.md`.

This task is mechanical: an agent on `sonnet` may do it; a fresh agent reviews it (Step 11).

- [ ] **Step 1: Write the failing tests of the tracker**

Create `$RUN/pages.test.mjs`:

```js
// Tests of pages.mjs: node --test pages.test.mjs (from the run folder). They use a run folder and a small git repository of
// their own in the temp folder, never the real ones.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const RUNDIR = mkdtempSync(join(tmpdir(), 'sic-run-')), REPODIR = mkdtempSync(join(tmpdir(), 'sic-repo-'));
process.env.SIC_RUN = RUNDIR;
process.env.SIC_REPO = REPODIR;
const T = await import('./pages.mjs');
const g = (...args) => execFileSync('git', ['-C', REPODIR, ...args], { encoding: 'utf8' }).trim();
const PAGE = slug => join(REPODIR, 'animations', '01-scroll-based', slug, 'index.html');
function writePage(slug, body) {
  mkdirSync(join(REPODIR, 'animations', '01-scroll-based', slug), { recursive: true });
  writeFileSync(PAGE(slug), `<h1>${slug.toUpperCase()}</h1>\n${body}\n`);
}
const report = (slug, file, text) => {
  mkdirSync(join(RUNDIR, 'reports', `01-${slug}`), { recursive: true });
  writeFileSync(join(RUNDIR, 'reports', `01-${slug}`, file), text);
};

// Two slots of category 01: 01a has a hard page and a medium one, 01b a medium page and an easy one.
writeFileSync(join(RUNDIR, 'slots.json'), JSON.stringify({
  ports: { '01a': 8801, '01b': 8802 },
  slots: { '01a': ['01.20 aaa H', '01.06 bbb M'], '01b': ['01.10 ccc M', '01.22 ddd E'] }
}));
mkdirSync(join(RUNDIR, 'prompts'));
for (const step of ['build', 'review', 'rereview', 'fix']) writeFileSync(join(RUNDIR, 'prompts', `${step}.md`), `${step} {{NUM}} {{TITLE}} {{WT}} {{PORT}} {{N}} {{FROM}} {{TO}}\n`);
for (const slug of ['aaa', 'bbb', 'ccc', 'ddd']) writePage(slug, 'v0');
g('init', '-q', '-b', 'main');
g('config', 'user.email', 't@t');
g('config', 'user.name', 't');
g('config', 'core.autocrlf', 'false');
g('add', '.');
g('commit', '-q', '-m', 'pages');
g('branch', 'sic/cat-01');
g('branch', 'sic/01a');
const commitOn = (branch, slug, body, files = [slug]) => {
  g('checkout', '-q', branch);
  for (const f of files) writePage(f, body);
  g('add', '.');
  g('commit', '-q', '-m', `${slug} ${body}`);
  const h = g('rev-parse', 'HEAD');
  g('checkout', '-q', 'main');
  return h;
};
const steps = lines => lines.map(l => l.split(' ').slice(0, 2).join(' '));

test('init makes one queued page per line and keeps the state of pages already there', () => {
  let pages = T.init();
  assert.equal(pages.length, 4);
  assert.deepEqual(pages.map(p => [p.num, p.slot, p.order, p.units, p.state]),
    [['01.20', '01a', 1, 3, 'queued'], ['01.06', '01a', 2, 2, 'queued'], ['01.10', '01b', 1, 2, 'queued'], ['01.22', '01b', 2, 1, 'queued']]);
  pages[0].state = 'built';
  T.save(pages);
  pages = T.init();
  assert.equal(pages[0].state, 'built');
  pages[0].state = 'queued';
  T.save(pages);
});

test('dispatch starts the next page of each slot, the slot with the most work left first, and one writer per slot', () => {
  const pages = T.load();
  assert.deepEqual(steps(T.dispatch(pages, 1)), ['build 01.20']);
  assert.deepEqual(steps(T.dispatch(pages, 5)), ['build 01.10'], 'slot 01a has its writer');
  assert.deepEqual(T.plan(pages, 5), [], 'both slots have a writer');
  const prompt = readFileSync(join(RUNDIR, 'reports', '01-aaa', 'build-prompt.md'), 'utf8');
  assert.match(prompt, /^build 01\.20 AAA [A-Za-z]:\/\S*\/\.claude\/worktrees\/sic-01a 8801 1 none none$/m);
  T.started(pages, '01.20', 'agent-b1');
  T.save(pages);
});

test('done moves a page on from its report, reviews come before builds, and a fix comes before the slot\'s next page', () => {
  const pages = T.load();
  report('aaa', 'build.md', 'RESULT: built abc1234\nSHRINKS: yes\nMISTAKE: no\n');
  assert.equal(T.done(pages, '01.20').state, 'built');
  assert.deepEqual(pages[0].commits, ['abc1234']);
  assert.equal(pages[0].shrinks, true);
  assert.equal(pages[0].mistake, false);
  assert.deepEqual(steps(T.dispatch(pages, 1)), ['review 01.20'], 'the review first');
  T.started(pages, '01.20', 'agent-r1');
  assert.deepEqual(steps(T.dispatch(pages, 1)), ['build 01.06'], 'slot 01a is free again');
  report('aaa', 'review-1.md', 'RESULT: changes 2\n');
  assert.equal(T.done(pages, '01.20').state, 'changes');
  assert.deepEqual(T.plan(pages, 5), [], 'the fix waits for the writer of 01a (01.06 is building)');
  report('bbb', 'build.md', 'RESULT: built def5678\nSHRINKS: no\nMISTAKE: yes\n');
  T.done(pages, '01.06');
  const next = T.plan(pages, 5).map(a => `${a.step} ${a.p.num} ${a.how}`);
  assert.deepEqual(next, ['review 01.06 new', 'fix 01.20 resume agent-b1'], 'the review, then the fix by the same builder; no new page in 01a');
  T.save(pages);
});

test('a fix round, its re-review by the same reviewer, and three rounds at most', () => {
  const pages = T.load(), p = pages[0];
  T.dispatch(pages, 2);
  assert.equal(p.state, 'fixing');
  assert.equal(p.rounds, 1);
  assert.match(readFileSync(join(RUNDIR, 'reports', '01-aaa', 'fix-1-prompt.md'), 'utf8'), /^fix 01\.20 AAA .* 1 abc1234\^ abc1234$/m);
  report('aaa', 'fix-1.md', 'RESULT: fixed 1111111 2222222\n');
  assert.equal(T.done(pages, '01.20').state, 'fixed');
  assert.deepEqual(p.commits, ['abc1234', '1111111', '2222222']);
  assert.equal(T.plan(pages, 9).find(a => a.p === p).how, 'resume agent-r1');
  for (const round of [2, 3]) {
    T.dispatch(pages, 9);
    report('aaa', `review-${round}.md`, 'RESULT: changes 1\n');
    assert.equal(T.done(pages, '01.20').state, 'changes');
    T.dispatch(pages, 9);
    report('aaa', `fix-${round}.md`, `RESULT: fixed ${round}${round}${round}${round}${round}${round}${round}\n`);
    T.done(pages, '01.20');
  }
  T.dispatch(pages, 9);
  report('aaa', 'review-4.md', 'RESULT: changes 1\n');
  assert.equal(T.done(pages, '01.20').state, 'blocked');
  assert.match(p.note, /after 3 fix rounds/);
  T.set(pages, '01.20', ['state=changes', 'builder=none', 'limit=6', 'note=second builder']);
  assert.equal(T.plan(pages, 9).find(a => a.p === p).how, 'new', 'a second builder');
  T.set(pages, '01.20', ['state=approved', 'note=']);
  T.save(pages);
});

test('a bad report line is refused, and stuck blocks the page', () => {
  const pages = T.load(), p = pages.find(q => q.num === '01.10');
  report('ccc', 'build.md', 'Built it.\n');
  assert.throws(() => T.done(pages, '01.10'), /not a RESULT line/);
  report('ccc', 'build.md', 'RESULT: stuck the brief asks for a second WebGL context\n');
  assert.equal(T.done(pages, '01.10').state, 'blocked');
  assert.match(p.note, /second WebGL context/);
});

test('a re-review whose reviewer is gone goes to a fresh reviewer with the whole review\'s prompt', () => {
  const pages = T.load(), p = pages.find(q => q.num === '01.10');
  T.set(pages, '01.10', ['state=fixed', 'reviewer=none']);
  const [line] = T.dispatch(pages, 1);
  assert.match(line, /^rereview 01\.10 ccc slot 01b new prompt /);
  assert.match(readFileSync(join(RUNDIR, 'reports', '01-ccc', `review-${p.reviews}-prompt.md`), 'utf8'), /^review 01\.10 /);
  T.set(pages, '01.10', ['state=blocked']);
  T.save(pages);
});

test('a fix round that changes nothing ends "RESULT: fixed none": the page goes to its re-review with no commit added', () => {
  const pages = T.load(), p = pages.find(q => q.num === '01.10');
  T.set(pages, '01.10', ['state=fixing', 'builder=agent-b9', 'rounds=1']);
  const before = [...p.commits];
  report('ccc', 'fix-1.md', 'RESULT: fixed none\n1. The label stays where it is: the item was a question, answered in the report.\n');
  assert.equal(T.done(pages, '01.10').state, 'fixed');
  assert.deepEqual(p.commits, before);
  T.set(pages, '01.10', ['state=fixing']);
  report('ccc', 'fix-1.md', 'RESULT: fixed\n');
  assert.throws(() => T.done(pages, '01.10'), /should start "RESULT: fixed <commit>"/);
  T.set(pages, '01.10', ['state=blocked', 'builder=none', 'rounds=0']);
  T.save(pages);
});

test('fill refuses a name it does not know', () => {
  assert.throws(() => T.fill('{{NOPE}}', { NUM: '1' }), /does not know/);
  assert.equal(T.fill('{{NUM}}-{{NUM}}', { NUM: '7' }), '7-7');
});

test('mergeable stops at the first page not approved and never cuts a page in two', () => {
  const pages = T.load();
  const a = pages.find(p => p.num === '01.20'), b = pages.find(p => p.num === '01.06');
  const c1 = commitOn('sic/01a', 'aaa', 'build');
  const c2 = commitOn('sic/01a', 'bbb', 'build');
  const c3 = commitOn('sic/01a', 'aaa', 'fix');
  a.commits = [c1, c3]; b.commits = [c2];
  a.state = 'approved'; b.state = 'reviewing';
  assert.deepEqual(T.mergeable(pages, '01a'), { commit: null, pages: [], problem: '' }, 'aaa\'s fix lies beyond bbb, which is not approved');
  b.state = 'approved';
  assert.deepEqual(T.mergeable(pages, '01a'), { commit: c3, pages: ['01.20', '01.06'], problem: '' });
  commitOn('sic/01a', 'two', 'pages', ['aaa', 'bbb']);
  assert.match(T.mergeable(pages, '01a').problem, /not one page of this slot/);
});

test('mergeable follows the slot\'s own line: a merge of another branch into the slot passes as one commit', () => {
  const pages = T.load();
  const a = pages.find(p => p.num === '01.20');
  g('checkout', '-q', 'sic/01a');
  g('reset', '-q', '--hard', 'sic/cat-01');
  g('checkout', '-q', 'main');
  const c1 = commitOn('sic/01a', 'aaa', 'build again');
  const other = commitOn('main', 'ccc', 'another slot');
  g('checkout', '-q', 'sic/01a');
  g('merge', '-q', '--no-ff', 'main', '-m', 'Merge main into the slot');
  g('checkout', '-q', 'main');
  const c2 = commitOn('sic/01a', 'aaa', 'final fix');
  a.commits = [c1, c2];
  a.state = 'merged';
  const m = T.mergeable(pages, '01a');
  assert.equal(m.problem, '');
  assert.equal(m.commit, c2);
  assert.deepEqual(m.pages, ['01.20']);
  assert.ok(other);
});

test('mergeable passes a page commit that also touches the page\'s README and the skill files (where a ruling says so), never another file', () => {
  const pages = T.load();
  const a = pages.find(p => p.num === '01.20');
  g('checkout', '-q', 'sic/01a');
  g('reset', '-q', '--hard', 'sic/cat-01');
  writePage('aaa', 'with its README');
  writeFileSync(join(REPODIR, 'animations', '01-scroll-based', 'aaa', 'README.md'), 'Reduced motion switches at once.\n');
  writeFileSync(join(REPODIR, 'llms.txt'), 'aaa\n');
  g('add', '.');
  g('commit', '-q', '-m', 'aaa with its README');
  const c1 = g('rev-parse', 'HEAD');
  g('checkout', '-q', 'main');
  a.commits = [c1];
  a.state = 'approved';
  assert.deepEqual(T.mergeable(pages, '01a'), { commit: c1, pages: ['01.20'], problem: '' });
  g('checkout', '-q', 'sic/01a');
  writePage('aaa', 'and a stray file');
  writeFileSync(join(REPODIR, 'stray.txt'), 'x\n');
  g('add', '.');
  g('commit', '-q', '-m', 'aaa and a stray file');
  g('checkout', '-q', 'main');
  assert.match(T.mergeable(pages, '01a').problem, /touches .*stray\.txt, not one page of this slot/);
});

test('reopen sends an approved or merged page back for a fix round with the given findings as its next review', () => {
  const pages = T.load(), p = pages.find(q => q.num === '01.06');
  p.state = 'merged';
  const before = p.reviews;
  const file = join(RUNDIR, 'finding.md');
  writeFileSync(file, 'Found a problem.\n');
  assert.throws(() => T.reopen(pages, '01.06', file), /must start/);
  writeFileSync(file, 'RESULT: changes 1\n1. [Important] The Compare label covers the card.\n');
  T.reopen(pages, '01.06', file);
  assert.equal(p.state, 'changes');
  assert.equal(p.reviews, before + 1);
  assert.match(readFileSync(join(RUNDIR, 'reports', '01-bbb', `review-${p.reviews}.md`), 'utf8'), /covers the card/);
  assert.throws(() => T.reopen(pages, '01.06', file), /only an approved or merged page/);
});

test('parts lists the category\'s page folders a few to a line', () => {
  assert.deepEqual(T.parts('01', 3), ['animations/01-scroll-based/aaa animations/01-scroll-based/bbb animations/01-scroll-based/ccc',
    'animations/01-scroll-based/ddd']);
});

test('rulings adds the pages that shrink a movement or show a mistake to the first batch\'s', () => {
  writeFileSync(join(RUNDIR, 'first-batch-rulings.json'), JSON.stringify({ shrinks: ['animations/01-scroll-based/parallax-scrolling/'], mistakes: [] }));
  const pages = T.load();
  pages.find(p => p.num === '01.20').shrinks = true;
  pages.find(p => p.num === '01.06').mistake = true;
  assert.deepEqual(T.rulings(pages), { shrinks: ['animations/01-scroll-based/parallax-scrolling/', 'animations/01-scroll-based/aaa/'],
    mistakes: ['animations/01-scroll-based/bbb/'] });
});

test('move takes a queued page to the end of another slot of its category; addslot adds a re-cut slot', () => {
  T.addslot('01c', 8821);
  assert.throws(() => T.addslot('01d', 8821), /taken/);
  const pages = T.load();
  const d = pages.find(p => p.num === '01.22');
  T.move(pages, '01.22', '01c');
  assert.deepEqual([d.slot, d.order], ['01c', 1]);
  assert.throws(() => T.move(pages, '01.20', '01c'), /only a page not yet started/);
});
```

- [ ] **Step 2: Run them and see them fail**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $RUN && node --test pages.test.mjs`
Expected: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…pages.mjs'`, then `✖ pages.test.mjs` and `ℹ fail 1`.

- [ ] **Step 3: Write the tracker**

Create `$RUN/pages.mjs`:

```js
#!/usr/bin/env node
// The page tracker of the See inside and Compare rollout's other 159 pages (Task 2 of
// docs/superpowers/plans/2026-10-14-see-inside-compare-other-pages.md). Not part of the repository. Only the coordinator runs
// it, so pages.json has one writer. It keeps every page's state, says what to start next within the seats there are, fills
// the prompt templates of prompts/ into one prompt file per step, reads the first lines of the agents' reports, and says up
// to which commit a slot's approved pages can be merged into their category branch.
//   node pages.mjs init                       pages.json from slots.json (a page already there keeps its state)
//   node pages.mjs show [<slot>|<NN>]         the pages, slot by slot: state, rounds, reviews, agents, note
//   node pages.mjs dispatch <seats>           starts up to <seats> steps; one line each: step, page, slot, "new" or
//                                             "resume <agent id>", and the prompt file to hand the agent
//   node pages.mjs started <num> <agent id>   the agent that took the page's current step
//   node pages.mjs done <num>                 reads the report of the page's current step and moves the page on
//   node pages.mjs set <num> <key>=<value>…   a field by hand (state, note, builder, reviewer, rounds, limit: the most fix
//                                             rounds before the page is blocked, 3 unless set; "none" empties one)
//   node pages.mjs addslot <slot> <port>      a re-cut slot (its category is the slot's first two digits)
//   node pages.mjs move <num> <slot>          a queued page to the end of another slot of its category
//   node pages.mjs mergeable <slot>           the last commit of the slot up to which every page is approved, and its pages
//   node pages.mjs merged <num>…              those pages are in their category branch
//   node pages.mjs reopen <num> <file>        an approved or merged page goes back for a fix round: <file> (it starts
//                                             "RESULT: changes <count>", from a category check, a final review or the
//                                             whole-site check) becomes its next review report
//   node pages.mjs parts <NN> [<size>]        the category's page folders, <size> to a line (default 8), for the page check
//   node pages.mjs running                    the agents at work, by step (they hold seats)
//   node pages.mjs servers                    the slots whose server does not answer
//   node pages.mjs rulings                    {"shrinks": [...], "mistakes": [...]} for the review kit's --rulings
// SIC_RUN sets the run folder (default: this file's folder), SIC_REPO the repository (default: three folders up).
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
export const RUN = resolve(process.env.SIC_RUN || HERE);
export const REPO = resolve(process.env.SIC_REPO || join(RUN, '..', '..', '..'));
const CATS = { '01': '01-scroll-based', '02': '02-entrance-and-exit', '03': '03-page-transitions', '04': '04-micro-interactions',
  '05': '05-text-typography', '06': '06-3d-advanced', '07': '07-ambient-background' };
const UNITS = { E: 1, M: 2, H: 3, X: 4 };
export const STATES = ['queued', 'building', 'built', 'reviewing', 'changes', 'fixing', 'fixed', 'rereviewing', 'approved',
  'merged', 'blocked'];
// The step each working state stands for, and the template and report it uses
const STEP = { building: 'build', reviewing: 'review', rereviewing: 'rereview', fixing: 'fix' };

// A path with forward slashes (C:\a\b becomes C:/a/b): Git Bash, node and the Read tool all take it, so the prompts use it
export const slash = p => p.replace(/\\/g, '/');
const json = file => JSON.parse(readFileSync(join(RUN, file), 'utf8'));
const now = () => new Date().toISOString();
export function load() { return existsSync(join(RUN, 'pages.json')) ? json('pages.json') : []; }
export function save(pages) {
  const tmp = join(RUN, 'pages.json.tmp');
  writeFileSync(tmp, JSON.stringify(pages, null, 1) + '\n');
  renameSync(tmp, join(RUN, 'pages.json'));
}
const find = (pages, num) => {
  const p = pages.find(q => q.num === num);
  if (!p) throw new Error(`no page ${num}`);
  return p;
};
const folder = p => `${p.nn}-${p.slug}`;
const git = (...args) => execFileSync('git', ['-C', REPO, ...args], { encoding: 'utf8' }).trim();

// pages.json from slots.json: { "ports": { "<slot>": port }, "slots": { "<slot>": ["NN.MM slug E|M|H|X", ...] } }
export function init() {
  const { slots } = json('slots.json'), pages = load();
  for (const [slot, list] of Object.entries(slots)) {
    list.forEach((line, i) => {
      const [num, slug, size] = line.trim().split(/\s+/);
      if (!/^\d\d\.\d\d$/.test(num) || !slug || !UNITS[size]) throw new Error(`slots.json, ${slot}: "${line}"`);
      if (pages.some(p => p.num === num)) return;
      const nn = num.slice(0, 2);
      pages.push({ num, slug, nn, cat: CATS[nn], slot, order: i + 1, units: UNITS[size], state: 'queued', since: now(),
        builder: null, reviewer: null, rounds: 0, reviews: 0, commits: [], shrinks: null, mistake: null, note: '' });
    });
  }
  save(pages);
  return pages;
}

// What can start now, most urgent first, at most `seats` steps: (1) reviews and re-reviews, oldest first; (2) fix rounds,
// oldest first, one writer per slot; (3) new pages, the next one of each slot that has no writer and no page waiting for a
// fix, the slot with the most work left first. A slot's worktree has one writer at a time: a build or a fix round.
export function plan(pages, seats) {
  const out = [], writer = new Set(pages.filter(p => p.state === 'building' || p.state === 'fixing').map(p => p.slot));
  const byAge = list => [...list].sort((a, b) => a.since.localeCompare(b.since) || a.num.localeCompare(b.num));
  for (const p of byAge(pages.filter(p => p.state === 'built' || p.state === 'fixed'))) {
    out.push({ step: p.state === 'built' ? 'review' : 'rereview', p, how: p.state === 'fixed' && p.reviewer ? `resume ${p.reviewer}` : 'new' });
  }
  const waiting = new Set();
  for (const p of byAge(pages.filter(p => p.state === 'changes'))) {
    waiting.add(p.slot);
    if (writer.has(p.slot)) continue;
    writer.add(p.slot);
    out.push({ step: 'fix', p, how: p.builder ? `resume ${p.builder}` : 'new' });
  }
  const slots = [...new Set(pages.map(p => p.slot))].filter(s => !writer.has(s) && !waiting.has(s)).map(s => {
    const queued = pages.filter(p => p.slot === s && p.state === 'queued').sort((a, b) => a.order - b.order);
    return { s, next: queued[0], left: queued.reduce((n, p) => n + p.units, 0) };
  }).filter(x => x.next).sort((a, b) => b.left - a.left || a.s.localeCompare(b.s));
  for (const x of slots) out.push({ step: 'build', p: x.next, how: 'new' });
  return out.slice(0, Math.max(0, seats));
}

// The values a prompt template names as {{KEY}}
export function values(p, n) {
  const ports = json('slots.json').ports;
  const file = `animations/${p.cat}/${p.slug}/index.html`;
  const page = existsSync(join(REPO, file)) ? readFileSync(join(REPO, file), 'utf8') : '';
  const h1 = (page.match(/<h1[^>]*>([^<]+)<\/h1>/) || [])[1] || p.slug;
  return {
    NUM: p.num, SLUG: p.slug, NN: p.nn, CAT: p.cat, SLOT: p.slot, PORT: String(ports[p.slot]), TITLE: h1.trim(),
    REPO: slash(REPO), RUN: slash(RUN), WT: slash(join(REPO, '.claude', 'worktrees', `sic-${p.slot}`)),
    PAGE: `animations/${p.cat}/${p.slug}`, FILE: file, BRIEF: slash(join(RUN, 'briefs', `${folder(p)}.md`)),
    CHECKS: slash(join(RUN, 'checks', folder(p))), KIT: slash(join(RUN, 'kit', folder(p))), REPORTS: slash(join(RUN, 'reports', folder(p))),
    N: String(n), COMMITS: p.commits.join(' ') || 'none', FROM: p.commits.length ? `${p.commits[0]}^` : 'none',
    TO: p.commits[p.commits.length - 1] || 'none', BUILDER: p.builder || 'none', REVIEWER: p.reviewer || 'none'
  };
}
export function fill(template, vals) {
  return template.replace(/\{\{([A-Z]+)\}\}/g, (m, key) => {
    if (!(key in vals)) throw new Error(`the template names {{${key}}}, which the tracker does not know`);
    return vals[key];
  });
}
// The report file of a page's step, and the file its prompt is written to
const reportOf = (p, step) => join(RUN, 'reports', folder(p),
  step === 'build' ? 'build.md' : step === 'fix' ? `fix-${p.rounds}.md` : `review-${p.reviews}.md`);
const promptOf = (p, step) => reportOf(p, step).replace(/\.md$/, '-prompt.md');

export function dispatch(pages, seats) {
  const lines = [];
  for (const { step, p, how } of plan(pages, seats)) {
    if (step === 'review' || step === 'rereview') p.reviews += 1;
    if (step === 'fix') p.rounds += 1;
    p.state = { build: 'building', review: 'reviewing', rereview: 'rereviewing', fix: 'fixing' }[step];
    p.since = now();
    const n = step === 'fix' ? p.rounds : step === 'build' ? 1 : p.reviews;
    // A re-review by a reviewer who did not write the last review is a whole review
    const template = step === 'rereview' && how === 'new' ? 'review' : step;
    const text = fill(readFileSync(join(RUN, 'prompts', `${template}.md`), 'utf8'), values(p, n));
    mkdirSync(join(RUN, 'reports', folder(p)), { recursive: true });
    writeFileSync(promptOf(p, step), text);
    lines.push(`${step} ${p.num} ${p.slug} slot ${p.slot} ${how} prompt ${slash(promptOf(p, step))}`);
  }
  return lines;
}

export function started(pages, num, id) {
  const p = find(pages, num);
  if (p.state === 'building' || p.state === 'fixing') p.builder = id;
  else if (p.state === 'reviewing' || p.state === 'rereviewing') p.reviewer = id;
  else throw new Error(`${num} is ${p.state}: no step is running`);
}

// The report's first line says how the step ended: "RESULT: built <commit>", "RESULT: fixed <commit> [<commit>…]" (or
// "RESULT: fixed none": a fix round that answered every item without a change), "RESULT: approved", "RESULT: changes
// <count>" or "RESULT: stuck <why>". A build report also says "SHRINKS: yes|no" and "MISTAKE: yes|no". A review that still
// asks for changes after the last fix round (three, or the page's own limit) blocks the page for the coordinator.
export function done(pages, num) {
  const p = find(pages, num), step = STEP[p.state];
  if (!step) throw new Error(`${num} is ${p.state}: no step is running`);
  const file = reportOf(p, step);
  if (!existsSync(file)) throw new Error(`no report yet: ${slash(file)}`);
  const text = readFileSync(file, 'utf8'), first = text.split(/\r?\n/)[0].trim();
  const m = first.match(/^RESULT:\s*(built|fixed|approved|changes|stuck)\b\s*(.*)$/);
  if (!m) throw new Error(`the first line of ${slash(file)} is not a RESULT line: "${first}"`);
  const [, result, rest] = m;
  p.since = now();
  if (result === 'stuck') { p.state = 'blocked'; p.note = `${step} stuck: ${rest}`; return p; }
  if (step === 'build' || step === 'fix') {
    const want = step === 'build' ? 'built' : 'fixed';
    const hashes = rest.split(/\s+/).filter(h => /^[0-9a-f]{7,40}$/.test(h));
    // A fix round may answer every item without a change, "RESULT: fixed none": no commit is added, the reviewer decides
    const none = step === 'fix' && rest.trim() === 'none';
    if (result !== want || (!hashes.length && !none)) throw new Error(`${slash(file)} should start "RESULT: ${want} <commit>"${step === 'fix' ? ' (or "RESULT: fixed none")' : ''}`);
    p.commits.push(...hashes);
    p.state = want;
    if (step === 'build') {
      const flag = name => { const f = text.match(new RegExp(`^${name}:\\s*(yes|no)`, 'mi')); return f ? f[1].toLowerCase() === 'yes' : null; };
      p.shrinks = flag('SHRINKS');
      p.mistake = flag('MISTAKE');
    }
    return p;
  }
  if (result === 'approved') { p.state = 'approved'; return p; }
  if (result !== 'changes') throw new Error(`${slash(file)} should start "RESULT: approved" or "RESULT: changes <count>"`);
  const limit = p.limit || 3;
  if (p.rounds >= limit) { p.state = 'blocked'; p.note = `changes asked after ${limit} fix rounds: the coordinator decides`; }
  else p.state = 'changes';
  return p;
}

export function set(pages, num, pairs) {
  const p = find(pages, num);
  for (const pair of pairs) {
    const at = pair.indexOf('=');
    const key = pair.slice(0, at), value = pair.slice(at + 1);
    if (!['state', 'note', 'builder', 'reviewer', 'rounds', 'limit'].includes(key)) throw new Error(`cannot set ${key}`);
    if (key === 'state' && !STATES.includes(value)) throw new Error(`no state ${value}`);
    if ((key === 'rounds' || key === 'limit') && !/^\d$/.test(value)) throw new Error(`${key} is a number of fix rounds, not ${value}`);
    p[key] = key === 'rounds' || key === 'limit' ? Number(value) : value === 'none' ? null : value;
  }
  p.since = now();
}

export function reopen(pages, num, file) {
  const p = find(pages, num);
  if (p.state !== 'approved' && p.state !== 'merged') throw new Error(`${num} is ${p.state}: only an approved or merged page is reopened`);
  const text = readFileSync(file, 'utf8');
  if (!/^RESULT:\s*changes\b/.test(text)) throw new Error(`${slash(file)} must start "RESULT: changes <count>"`);
  p.reviews += 1;
  mkdirSync(join(RUN, 'reports', folder(p)), { recursive: true });
  writeFileSync(join(RUN, 'reports', folder(p), `review-${p.reviews}.md`), text);
  p.state = 'changes';
  p.since = now();
  p.note = `reopened by ${basename(file)}`;
}

export function addslot(slot, port) {
  if (!/^\d\d[a-z]$/.test(slot) || !CATS[slot.slice(0, 2)]) throw new Error(`not a slot name: ${slot}`);
  const all = json('slots.json');
  if (all.slots[slot]) throw new Error(`${slot} is there already`);
  if (Object.values(all.ports).includes(Number(port))) throw new Error(`port ${port} is taken`);
  all.slots[slot] = [];
  all.ports[slot] = Number(port);
  writeFileSync(join(RUN, 'slots.json'), JSON.stringify(all, null, 1) + '\n');
}
export function move(pages, num, slot) {
  const p = find(pages, num), ports = json('slots.json').ports;
  if (p.state !== 'queued') throw new Error(`${num} is ${p.state}: only a page not yet started moves`);
  if (slot.slice(0, 2) !== p.nn || !ports[slot]) throw new Error(`${slot} is not a slot of category ${p.nn}`);
  p.order = Math.max(0, ...pages.filter(q => q.slot === slot).map(q => q.order)) + 1;
  p.slot = slot;
  p.since = now();
}

// Up to which commit slot <slot> can be merged into sic/cat-NN: its commits not yet in the category branch, oldest first,
// as far as each one touches only the page of an approved (or merged) page of this slot (its index.html and, where a ruling
// says so, its README.md and the skill files make-skill then writes, llms.txt and skills/; a merge commit, such as
// feat/see-inside-compare merged into the slot for the final review's fixes, passes), and no page is cut in two: a page
// whose later commit lies beyond the end ends the merge before its first commit.
export function mergeable(pages, slot) {
  const br = `sic/${slot}`, cat = `sic/cat-${slot.slice(0, 2)}`;
  // The slot's own line only (first parents): a merge of feat/see-inside-compare into the slot is one commit here, not the
  // other slots' commits it brings
  const list = git('rev-list', '--reverse', '--first-parent', `${cat}..${br}`).split('\n').filter(Boolean);
  const items = list.map(c => {
    const merge = git('rev-list', '--parents', '-n', '1', c).split(' ').length > 2;
    const files = merge ? [] : git('diff-tree', '--no-commit-id', '--name-only', '-r', c).split('\n').filter(Boolean);
    const own = files.map(f => f.match(/^animations\/(\d\d)-[^/]+\/([^/]+)\/(?:index\.html|README\.md)$/));
    const others = files.filter((f, i) => !own[i] && f !== 'llms.txt' && !f.startsWith('skills/'));
    const one = new Set(own.filter(Boolean).map(x => `${x[1]}/${x[2]}`)).size === 1 && !others.length;
    const m = one ? own.find(Boolean) : null;
    const p = m ? pages.find(q => q.nn === m[1] && q.slug === m[2]) : null;
    return { c, merge, files, p };
  });
  let end = 0, problem = '';
  for (const it of items) {
    if (it.merge) { end++; continue; }
    if (!it.p || it.p.slot !== slot) { problem = `commit ${it.c.slice(0, 9)} touches ${it.files.join(', ') || 'nothing'}, not one page of this slot`; break; }
    if (it.p.state !== 'approved' && it.p.state !== 'merged') break;
    end++;
  }
  for (let again = true; again;) {
    again = false;
    for (let i = 0; i < end; i++) {
      const p = items[i].p;
      if (p && items.some((it, k) => k >= end && it.p === p)) { end = items.findIndex(it => it.p === p); again = true; break; }
    }
  }
  const inside = items.slice(0, end), pagesIn = [...new Set(inside.map(it => it.p).filter(Boolean))];
  return { commit: end ? inside[end - 1].c : null, pages: pagesIn.map(p => p.num), problem };
}

export function parts(nn, size = 8) {
  const cat = CATS[nn];
  if (!cat) throw new Error(`no category ${nn}`);
  const dirs = readdirSync(join(REPO, 'animations', cat), { withFileTypes: true })
    .filter(d => d.isDirectory() && existsSync(join(REPO, 'animations', cat, d.name, 'index.html')))
    .map(d => `animations/${cat}/${d.name}`).sort();
  const out = [];
  for (let i = 0; i < dirs.length; i += size) out.push(dirs.slice(i, i + size).join(' '));
  return out;
}

export function rulings(pages) {
  const base = existsSync(join(RUN, 'first-batch-rulings.json')) ? json('first-batch-rulings.json') : { shrinks: [], mistakes: [] };
  const path = p => `animations/${p.cat}/${p.slug}/`;
  const add = (list, more) => [...new Set([...list, ...more])];
  return { shrinks: add(base.shrinks || [], pages.filter(p => p.shrinks).map(path)), mistakes: add(base.mistakes || [], pages.filter(p => p.mistake).map(path)) };
}

function show(pages, which) {
  const rows = pages.filter(p => !which || p.slot === which || p.nn === which)
    .sort((a, b) => a.slot.localeCompare(b.slot) || a.order - b.order);
  for (const p of rows) {
    console.log([p.slot, String(p.order).padStart(2), p.num, p.slug.padEnd(30), p.state.padEnd(11), `r${p.rounds}`, `v${p.reviews}`,
      `b:${p.builder || '-'}`, `v:${p.reviewer || '-'}`, p.note].join('  ').trimEnd());
  }
  const count = {};
  for (const p of rows) count[p.state] = (count[p.state] || 0) + 1;
  console.log(Object.entries(count).map(([s, n]) => `${s} ${n}`).join(' · '));
}

async function main(argv) {
  const [cmd, ...rest] = argv;
  if (cmd === 'init') { console.log(`${init().length} pages`); return 0; }
  const pages = load();
  if (cmd === 'show') { show(pages, rest[0]); return 0; }
  if (cmd === 'dispatch' && rest[0]) { const lines = dispatch(pages, Number(rest[0])); save(pages); console.log(lines.join('\n') || 'nothing to start'); return 0; }
  if (cmd === 'started' && rest[1]) { started(pages, rest[0], rest[1]); save(pages); return 0; }
  if (cmd === 'done' && rest[0]) { const p = done(pages, rest[0]); save(pages); console.log(`${p.num} ${p.slug}: ${p.state}${p.note ? ' (' + p.note + ')' : ''}`); return 0; }
  if (cmd === 'set' && rest[1]) { set(pages, rest[0], rest.slice(1)); save(pages); return 0; }
  if (cmd === 'addslot' && rest[1]) { addslot(rest[0], rest[1]); return 0; }
  if (cmd === 'move' && rest[1]) { move(pages, rest[0], rest[1]); save(pages); return 0; }
  if (cmd === 'mergeable' && rest[0]) {
    const m = mergeable(pages, rest[0]);
    console.log(m.commit ? `${m.commit} ${m.pages.join(' ')}` : 'nothing to merge');
    if (m.problem) console.log(`PROBLEM: ${m.problem}`);
    return 0;
  }
  if (cmd === 'reopen' && rest[1]) { reopen(pages, rest[0], rest[1]); save(pages); return 0; }
  if (cmd === 'merged' && rest[0]) {
    for (const num of rest) { const p = find(pages, num); if (p.state !== 'approved' && p.state !== 'merged') throw new Error(`${num} is ${p.state}`); p.state = 'merged'; p.since = now(); }
    save(pages);
    return 0;
  }
  if (cmd === 'parts' && rest[0]) { console.log(parts(rest[0], rest[1] ? Number(rest[1]) : 8).join('\n')); return 0; }
  if (cmd === 'running') {
    const n = {};
    for (const p of pages) if (STEP[p.state]) n[STEP[p.state]] = (n[STEP[p.state]] || 0) + 1;
    console.log(`${Object.values(n).reduce((a, b) => a + b, 0)} agents: ${Object.entries(n).map(([s, k]) => `${s} ${k}`).join(', ') || 'none'}`);
    return 0;
  }
  if (cmd === 'servers') {
    const { ports } = json('slots.json');
    const live = new Set(pages.filter(p => p.state !== 'merged').map(p => p.slot));
    for (const [slot, port] of Object.entries(ports)) {
      if (!live.has(slot)) continue;
      const ok = await fetch(`http://127.0.0.1:${port}/`).then(r => r.ok, () => false);
      if (!ok) console.log(`${slot} ${port} down`);
    }
    return 0;
  }
  if (cmd === 'rulings') { console.log(JSON.stringify(rulings(pages), null, 1)); return 0; }
  console.error('usage: node pages.mjs init | show [slot|NN] | dispatch <seats> | started <num> <id> | done <num> | set <num> k=v… |'
    + ' addslot <slot> <port> | move <num> <slot> | mergeable <slot> | merged <num>… | reopen <num> <file> | parts <NN> [size] |'
    + ' running | servers | rulings');
  return 2;
}
if (resolve(process.argv[1] || '').toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  main(process.argv.slice(2)).then(code => { process.exitCode = code; }, err => { console.error(err.message); process.exitCode = 1; }); // exitCode, not exit(): process.exit() right after a fetch aborts on Windows (libuv assertion)
}
```

- [ ] **Step 4: Run the tests and see them pass**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $RUN && node --test --test-reporter=spec pages.test.mjs 2>&1 | grep -E "^(✔|✖)|^ℹ (pass|fail)"`
Expected: fifteen `✔` lines, `ℹ pass 15`, `ℹ fail 0`.

- [ ] **Step 5: The slot table**

Create `$RUN/slots.json` (the table of "The slots", word for word):

```json
{
 "ports": { "01a": 8801, "01b": 8802, "01c": 8803, "02a": 8804, "02b": 8805, "03a": 8806, "03b": 8807, "04a": 8808, "04b": 8809,
  "04c": 8810, "04d": 8811, "05a": 8812, "05b": 8813, "06a": 8814, "06b": 8815, "06c": 8816, "06d": 8817, "07a": 8818, "07b": 8819,
  "07c": 8820 },
 "slots": {
  "01a": ["01.20 scroll-image-sequence H", "01.06 stacking-cards M", "01.18 section-wipe M", "01.04 cover-card-to-fixed-header M",
   "01.23 scroll-velocity-skew M", "01.14 horizontal-scroll M", "01.17 progress-bar M", "01.26 scroll-background-color M",
   "01.22 text-fill-on-scroll E"],
  "01b": ["01.21 smooth-scroll H", "01.09 pin-animation M", "01.15 sticky-section M", "01.07 scroll-trigger M", "01.12 reveal-on-scroll M",
   "01.11 scrollytelling M", "01.16 counter-animation M", "01.25 scrollspy-nav M", "01.03 reverse-scrolling-columns M"],
  "01c": ["01.10 snap-scrolling H", "01.01 parallax-depth-of-field M", "01.27 hide-on-scroll-header M", "01.13 stagger-reveal M",
   "01.08 scrub-animation M", "01.24 svg-line-draw M", "01.05 fly-in-fly-out-contact-list M", "01.19 zoom-into-image M"],
  "02a": ["02.14 shatter-effect H", "02.07 split-text-reveal M", "02.08 letter-by-letter-stagger M", "02.09 word-by-word-reveal M",
   "02.11 flip-in E", "02.13 rotate-in E"],
  "02b": ["02.06 curtain-reveal M", "02.12 bounce-in M", "02.05 clip-path-reveal M", "02.10 blur-in E", "02.02 slide-in E",
   "02.04 scale-in E", "02.03 slide-up-reveal E"],
  "03a": ["03.09 elastic-transition X", "03.01 view-transitions-api H", "03.11 dissolve M", "03.02 shared-element-transition M",
   "03.04 crossfade M", "03.06 zoom-transition M", "03.08 blur-transition M"],
  "03b": ["03.15 page-curl H", "03.10 portal-zoom M", "03.13 circle-reveal M", "03.12 flip-technique M", "03.07 flash-transition M",
   "03.03 morph-transition M", "03.16 cube-transition M", "03.05 slide-transition M"],
  "04a": ["04.40 gooey-menu H", "04.33 drag-to-reorder H", "04.22 swipe-to-dismiss H", "04.17 drawer-slide M", "04.18 modal-expand M",
   "04.19 accordion M", "04.28 segmented-control M", "04.06 toggle-switch E", "04.24 theme-toggle-morph E"],
  "04b": ["04.07 heart-burst H", "04.08 success-confetti H", "04.39 image-trail H", "04.13 checkmark-draw M", "04.12 progress-animation M",
   "04.09 skeleton-loader M", "04.34 rolling-numbers M", "04.11 loading-spinner E", "04.15 badge-pulse E"],
  "04c": ["04.27 toast-notification H", "04.29 pull-to-refresh H", "04.41 dynamic-island M", "04.36 hold-to-confirm M", "04.21 error-shake M",
   "04.14 form-field-morph M", "04.37 expanding-search M", "04.23 hamburger-menu-toggle M", "04.25 copy-to-clipboard E",
   "04.03 focus-ring E"],
  "04d": ["04.20 cursor-follower H", "04.31 spotlight-hover M", "04.16 tooltip-reveal M", "04.26 star-rating M",
   "04.38 button-loading-states M", "04.32 add-to-cart-fly M", "04.04 button-press-scale M", "04.01 hover-state E", "04.02 click-ripple E",
   "04.10 shimmer-effect E", "04.30 gradient-border E", "04.35 typing-indicator E"],
  "05a": ["05.19 text-particles H", "05.16 split-flap-board M", "05.02 typewriter-effect M", "05.03 scramble-text M", "05.12 glitch-text M",
   "05.17 neon-flicker M", "05.09 outline-to-fill M", "05.14 wavy-text M", "05.15 highlighter-sweep M"],
  "05b": ["05.01 kinetic-typography M", "05.10 enter-exit-typography M", "05.18 handwriting-draw M", "05.13 text-on-path M",
   "05.08 text-gradient-animation M", "05.11 rotate-word-carousel M", "05.07 text-morphing M", "05.04 variable-font-morph M",
   "05.05 text-clip-path-reveal M"],
  "06a": ["06.15 cloth-simulation X", "06.23 physics-2d X", "06.04 canvas-particle-effect H", "06.26 infinite-zoom H",
   "06.11 2-5d-pseudo-3d M", "06.02 scroll-driven-3d-rotation M"],
  "06b": ["06.13 gpgpu-particle-system X", "06.01 3d-model-orbit H", "06.07 webgl-shader-animation H", "06.12 ray-marching-sdf H",
   "06.06 glassmorphism-animated M", "06.10 chromatic-aberration M"],
  "06c": ["06.21 flocking X", "06.16 volumetric-smoke H", "06.14 image-distortion-hover H", "06.20 depth-map-photo H",
   "06.17 morphing-blob M", "06.09 svg-path-animation M"],
  "06d": ["06.24 liquid-glass X", "06.08 noise-based-motion H", "06.22 ascii-halftone H", "06.25 holographic-card M", "06.18 flip-card-3d M",
   "06.19 carousel-3d M", "06.03 parallax-3d-tilt M"],
  "07a": ["07.12 abstract-geometric-motion X", "07.07 starfield H", "07.19 snow-rain H", "07.15 synthwave-grid H",
   "07.11 grid-dot-pattern-parallax M", "07.18 wave-layers M", "07.10 floating-elements M"],
  "07b": ["07.20 fireworks X", "07.09 ambient-ripple H", "07.13 particle-constellation H", "07.23 game-of-life H", "07.08 breathing-glow M",
   "07.06 light-leak M", "07.05 scanline M"],
  "07c": ["07.16 matrix-rain H", "07.17 plasma H", "07.21 topographic-lines H", "07.22 light-rays H", "07.01 animated-gradient-background M",
   "07.02 mesh-gradient M", "07.03 aurora M", "07.04 grain-overlay M"]
 }
}
```

- [ ] **Step 6: The slot table's check, and the briefs' (used again in Task 3)**

Create `$RUN/check-slots.mjs`:

```js
#!/usr/bin/env node
// Checks slots.json against the repository (Task 2 of docs/superpowers/plans/2026-10-14-see-inside-compare-other-pages.md):
// every animation page but the first batch's seven is in one slot of its own category, under the number and slug the page
// itself shows; the twins sit in one slot, one after the other; ports 8801-8820 are used once each; and, given the briefs
// folder, every page has a brief whose first line is "# NN.MM <Title>: brief" and which has every part.
//   node check-slots.mjs <slots.json> <repository> [<briefs folder>]
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const [slotsFile, repo, briefs] = process.argv.slice(2);
if (!slotsFile || !repo) { console.error('usage: node check-slots.mjs <slots.json> <repository> [<briefs folder>]'); process.exit(2); }
const { ports, slots } = JSON.parse(readFileSync(slotsFile, 'utf8'));
const FIRST = ['01.02', '02.01', '03.14', '04.05', '05.06', '06.05', '07.14'];
const TWINS = [['01.06', '01.18'], ['01.09', '01.15'], ['02.07', '02.08', '02.09'], ['03.10', '03.13']];
// The parts every brief has (briefs/HOW-TO-WRITE.md), found by these words in any case
const PARTS = ['see inside', 'compare', 'note', 'setting', 'hard case', 'pitfall', 'closest first-batch page', 'how to check'];
const problems = [], seen = new Map(), units = {}, pages = new Map();
for (const cat of readdirSync(join(repo, 'animations')).filter(d => /^\d\d-/.test(d))) {
  for (const slug of readdirSync(join(repo, 'animations', cat))) {
    const f = join(repo, 'animations', cat, slug, 'index.html');
    if (!existsSync(f)) continue;
    const num = (readFileSync(f, 'utf8').match(/class="hb-cat"[^>]*>\s*(\d\d\.\d\d)/) || [])[1];
    pages.set(num, slug);
  }
}
for (const [slot, list] of Object.entries(slots)) {
  if (!ports[slot]) problems.push(`${slot} has no port`);
  units[slot] = 0;
  list.forEach((line, i) => {
    const [num, slug, size] = line.split(' ');
    units[slot] += { E: 1, M: 2, H: 3, X: 4 }[size] || NaN;
    if (num.slice(0, 2) !== slot.slice(0, 2)) problems.push(`${num} is in ${slot}, a slot of another category`);
    if (pages.get(num) !== slug) problems.push(`${num} is ${pages.get(num)} on the site, not ${slug}`);
    if (seen.has(num)) problems.push(`${num} is listed twice`);
    seen.set(num, [slot, i]);
    if (briefs) {
      const file = join(briefs, `${num.slice(0, 2)}-${slug}.md`);
      if (!existsSync(file)) { problems.push(`${num} ${slug} has no brief`); return; }
      const text = readFileSync(file, 'utf8'), low = text.toLowerCase();
      if (!new RegExp(`^# ${num.replace('.', '\\.')} .+: brief`).test(text)) problems.push(`${num} ${slug}: the brief's first line is not "# ${num} <Title>: brief"`);
      const missing = PARTS.filter(w => !low.includes(w));
      if (missing.length) problems.push(`${num} ${slug}: the brief has no ${missing.join(', ')}`);
    }
  });
}
for (const [num, slug] of pages) if (!FIRST.includes(num) && !seen.has(num)) problems.push(`${num} ${slug} is in no slot`);
for (const num of FIRST) if (seen.has(num)) problems.push(`${num} is a first-batch page`);
for (const group of TWINS) {
  const at = group.map(n => seen.get(n));
  if (at.some(a => !a) || new Set(at.map(a => a[0])).size !== 1) problems.push(`twins ${group.join(', ')} are not in one slot`);
  else if (at.some((a, k) => k && a[1] !== at[k - 1][1] + 1)) problems.push(`twins ${group.join(', ')} are not one after the other`);
}
const used = Object.values(ports).filter(p => p <= 8820);
if (new Set(used).size !== 20 || Math.min(...used) !== 8801 || Math.max(...used) !== 8820) problems.push('ports 8801-8820 are not used once each');
console.log(`${seen.size} pages in ${Object.keys(slots).length} slots; units ${Object.entries(units).map(([s, u]) => `${s} ${u}`).join(', ')}`);
console.log(problems.length ? problems.join('\n') : 'no problem');
process.exit(problems.length ? 1 : 0);
```

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $RUN && node check-slots.mjs slots.json $REPO`
Expected: `159 pages in 20 slots; units 01a 18, 01b 19, 01c 17, 02a 11, 02b 10, 03a 17, 03b 17, 04a 19, 04b 19, 04c 20, 04d 20, 05a 19, 05b 18, 06a 18, 06b 17, 06c 17, 06d 18, 07a 19, 07b 19, 07c 20` and `no problem`. See it fail once: change `"01.18 section-wipe M"` to `"01.18 section-wipe-x M"` in a scratch copy (`cp slots.json scratch/slots-bad.json`, edit it, `node check-slots.mjs scratch/slots-bad.json $REPO`): `01.18 is section-wipe on the site, not section-wipe-x`, exit 1; delete the copy.

- [ ] **Step 7: The log waiter**

Create `$RUN/wait-log.mjs`:

```js
#!/usr/bin/env node
// Waits for a background command's log to end with a line "EXIT=<code>" (Task 2 of
// docs/superpowers/plans/2026-10-14-see-inside-compare-other-pages.md). Not part of the repository. A page check or a kit run
// waits in the slot pool for as long as the pool is full, which can be longer than one foreground command may last, so agents
// start it in the background with its output in a log and wait for the log here.
//   node wait-log.mjs <log> [<seconds>]   waits up to <seconds> (default 540) for the EXIT line, then prints the log's last
//                                         40 lines and "ended with code N" (exit 0), or "still running" (exit 3: call it again)
import { existsSync, readFileSync } from 'node:fs';

const [log, secs = '540'] = process.argv.slice(2);
if (!log) { console.error('usage: node wait-log.mjs <log> [<seconds>]'); process.exit(2); }
const end = Date.now() + Number(secs) * 1000;
const tail = text => text.split(/\r?\n/).slice(-41).join('\n').trimEnd();
(function look() {
  const text = existsSync(log) ? readFileSync(log, 'utf8') : '';
  const m = text.match(/^EXIT=(\d+)\s*$/m);
  if (m) { console.log(tail(text)); console.log(`ended with code ${m[1]}`); process.exit(0); }
  if (Date.now() >= end) { console.log(tail(text)); console.log('still running: run wait-log.mjs again'); process.exit(3); }
  setTimeout(look, 2000);
})();
```

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $RUN && mkdir -p scratch/wait && printf 'ok   01-a desktop\nEXIT=0\n' > scratch/wait/1.log && node wait-log.mjs scratch/wait/1.log 5; echo "code=$?"; printf 'ok   01-a desktop\n' > scratch/wait/2.log && node wait-log.mjs scratch/wait/2.log 1; echo "code=$?"`
Expected: `ended with code 0` and `code=0`; then `still running: run wait-log.mjs again` and `code=3`. Delete `scratch/wait`.

- [ ] **Step 8: The prompt templates, out of this plan**

Create `$RUN/extract-prompts.mjs`:

```js
#!/usr/bin/env node
// Writes the prompt templates out of the plan (Task 2 of docs/superpowers/plans/2026-10-14-see-inside-compare-other-pages.md),
// so the files are the plan's text word for word. Not part of the repository. Each template in the plan is a ````markdown block
// right under a line "File `$RUN/prompts/<name>.md`:". Run it again whenever the plan's templates change.
//   node extract-prompts.mjs <plan> <run folder>
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [plan, run] = process.argv.slice(2);
if (!plan || !run) { console.error('usage: node extract-prompts.mjs <plan> <run folder>'); process.exit(2); }
const text = readFileSync(plan, 'utf8').replace(/\r\n/g, '\n');
const re = /^File `\$RUN\/(prompts\/[a-z-]+\.md)`:\n\n?````markdown\n([\s\S]*?)\n````$/gm;
mkdirSync(join(run, 'prompts'), { recursive: true });
const names = [];
for (let m; (m = re.exec(text));) {
  writeFileSync(join(run, m[1]), m[2] + '\n');
  names.push(m[1]);
}
console.log(`${names.length} prompts: ${names.join(', ')}`);
process.exit(names.length ? 0 : 1);
```

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $RUN && node extract-prompts.mjs ../../../docs/superpowers/plans/2026-10-14-see-inside-compare-other-pages.md . && grep -c "{{" prompts/build.md prompts/review.md prompts/rereview.md prompts/fix.md`
Expected: `4 prompts: prompts/build.md, prompts/review.md, prompts/rereview.md, prompts/fix.md`, and a count above 0 for each file (the tracker fills them).

- [ ] **Step 9: The run files**

Create `$RUN/lessons.md`:

```markdown
# Lessons for builders and reviewers

Read this before you start and again before you commit. The coordinator adds a line when a review finds a mistake that
could be on other pages (with the page it came from), and each of the owner's rules from the first batch (Task 1).

1. A Replay or Show me run holds its pauses with setTimeout, never inside a frame loop or a setInterval: the page check sees
   only setTimeout timers and animations, so a pause inside a frame loop passes for rest and the pictures come out mid-run.
2. A timer of 6 s or less that runs while the page is idle keeps the run wait from ending; your brief's "Probe:" line says if
   your page has one, and brief-rulings.md says what to do.
3. The page check holds every endless CSS animation in the stage (a blinking caret, a loader) while it judges rest and takes
   the mode screenshots, so it cannot see a mode that adds endless movement: never add one; reviewers look for it in the
   reduced-motion stills and the clips.
4. A scroll page with snapping: no mode changes the size or place of the scrolling content, or the browser re-snaps the box.
5. At most four labels on phones and six elsewhere, each 12px or more as drawn, inside the box, clear of each other.
6. A label drawn on a layer shrunk with scale comes out soft: draw it at its size, or drop will-change in that mode.
7. A flat diagonal fan reads better than a 3D tilt at 375px.
8. Keep every part inside the box at every setting and every scroll position.
9. In Chrome a frame loop that reads matchMedia(...).matches every frame never gets the query's change event: read the query
   inside the loop.
10. git stash is shared by every worktree: never use it; compare versions with git show <rev>:<path> > <scratch file>.
11. The kit keeps frame folders with --keep-frames: read the frames you need, then delete the folders the log names.
12. Every mode fits a 260px-tall stage from 601 to 1440px wide (phones held sideways such as 812×375, short laptop windows
    such as 1280×600), which the page check's six setups never show: the kit's `--short` run measures the captions and half
    names there, and its last line says `0 with labels cut or overlapping` (Fade In / Fade Out, Overlay Wipe).
13. Leaving a mode in the middle of a run never pops the picture to the run's end: snap only what the mode posed (Fade In /
    Fade Out).
14. When the halves stack on phones, everything a half draws (ghost pointers, spots, outlines, arrows) stays inside that
    half and clear of its name, during the run a mode press plays too (Magnetic Button).
15. A copy or a label never wraps where its twin does not: measure at 320, 360 and 375, and give it `white-space:nowrap`
    or a max-content width (Magnetic Button).
16. Words that describe a state stay true after every press: under reduced motion a note that says "Shown still" changes
    after Play and back after Pause (Marquee / Ticker).
17. The two halves of a Compare differ in one thing only (the same strip, timing, text and size), so the picture shows that
    one difference (Marquee / Ticker).
18. A canvas page keeps all of Normal's changing state, its time included, while a mode shows, and puts it back exactly
    (RULINGS 7; Flow Field).
19. Random spread in a frame loop moves by elapsed time too: fixed steps of a 60th from an accumulator, so it spreads the
    same at 60, 90, 120 and 144 Hz (Flow Field).
20. A caption points at something a still picture shows; a move of a few pixels needs none (Magnetic Button).
21. Forty-nine pages are already past 300 lines: add about 150 at most.

From reviews and from the owner:
```

Create `$RUN/brief-rulings.md`:

```markdown
# The coordinator's rulings on the briefs

Builders and reviewers read the general rulings and the line for their page. The owner's own rules from the first batch are
in rulings-159.md. The rulings given while the briefs were written stand as they are, and every builder, reviewer and
checker reads them too: briefs/RULINGS.md, briefs/OPEN-QUESTIONS.md and the RULED: cells of briefs/summary-<lane>.md. This
file holds what is ruled from now on.

General:
G1. Acceptance 7 for a setting that changes only timing (speed, delay, how long something lasts or waits) or a shared rule
    (briefs/OPEN-QUESTIONS.md, lane 04b), and for the settings the rulings name (Cover Card to Fixed Header's two settings,
    Scrub Animation's Even and Gentle pair, Accordion's Several open at once, Badge Pulse's Stops after three): it is seen in
    motion, in a kit clips run with that setting pressed (--only clips --press …) or live, and the build report names the
    run; a still needs no extra bar or label for it.
G2. A brief may replace the survey's idea with a clearer one, and a builder may replace the brief's, saying why in the
    report. The reviewer judges the picture against the acceptance lines, not against the survey or the brief's wording.
G3. A "Shows the …" switch on the page is never flipped by a mode; a view may reuse its drawing. A "without" that is already
    a setting stays a setting, and Compare still shows both at once.
G4. Compare rests on a posed moment wherever the difference needs movement; the pose lifts while a run plays and comes back
    when nothing is pending; Normal at rest is never posed.
G5. A page that the probe (Task 4) found never resting, or never ending its run, gets its answer in its own line below.

Per page (NN.MM slug: ruling):
```

Create `$RUN/rulings-159.md` with the one line `Waiting for the owner's verdict on the first batch (Task 1 replaces this file).`, `$RUN/shared-wishes.md` with the line `# Shared changes wished by page builders, for integration (Task 12): one line each, page, file, what and why`, and the folders `$RUN/reports` and `$RUN/final`.

Append to `$RUN/ledger.md`:

```markdown

## The other 159 pages: docs/superpowers/plans/2026-10-14-see-inside-compare-other-pages.md

Tracker: cd $RUN && node pages.mjs show | running | dispatch <seats>. Slots 8801-8820, categories sic-cat-NN 8831-8837.
Task 0: the plan committed at <hash>; the coordination file's Order and ports at <hash>.
Departure from the spec (section 7, "Who"): the coordinator plays the seven lane leads, with the tracker (agents start no agents).
Departure from the spec and the coordination file: this plan's places use ports 8821-8850 beside 8800-8820 (free: no other project or listener uses them); Task 0 wrote them into the coordination file's ports.
Departure from the spec (section 6, "No change: the 166 page READMEs"): Zoom Transition's page commit also makes its README's reduced-motion sentence true to the code (briefs/summary-03.md), the one page README this rollout changes.
Task 2: tracker (15 tests), slots.json (159 pages, 20 slots), check-slots, wait-log, extract-prompts (4 prompts), run files.
```

Append to `$RUN/agents.md` the line `## The other 159 pages (page agents are in pages.json: builder and reviewer per page)`.

- [ ] **Step 10: A dry run in a scratch copy**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; rm -rf $RUN/scratch/dry && mkdir -p $RUN/scratch/dry && cp -r $RUN/pages.mjs $RUN/slots.json $RUN/prompts $RUN/scratch/dry/ && cd $RUN/scratch/dry && SIC_REPO=../../../../.. node pages.mjs init && SIC_REPO=../../../../.. node pages.mjs dispatch 3 && grep -c "{{" reports/*/build-prompt.md; grep -h "^# Build" reports/*/build-prompt.md`
Expected: `159 pages`; three lines `build 04.27 toast-notification slot 04c new prompt …`, `build 04.20 cursor-follower slot 04d new prompt …`, `build 07.16 matrix-rain slot 07c new prompt …` (the three slots with the most weight); each prompt file `:0` (nothing left unfilled); three title lines naming the pages with their real titles (`Toast Notification`, `Cursor Follower`, `Matrix Rain`). Delete `$RUN/scratch/dry`. Nothing here touches the real `pages.json` (`ls $RUN/pages.json` fails: Task 6 makes it).

- [ ] **Step 11: Review (a fresh agent)**

A fresh reviewer (opus) gets this task and "Agents and Chrome: how the work queues", reads the five tools, reruns Step 4's tests and Step 6's check, and confirms: a slot never gets two writers; a fix comes before the slot's next page; reviews come first; `mergeable` never passes an unapproved page's commit, never cuts a page in two, and passes a README or skill file only in a commit of its own page; `done` refuses a report without its RESULT line and takes `RESULT: fixed none` from a fix round; the prompt files are the plan's blocks word for word (`cd $RUN && cp -r prompts scratch/prompts-copy && node extract-prompts.mjs ../../../docs/superpowers/plans/2026-10-14-see-inside-compare-other-pages.md . && diff -r scratch/prompts-copy prompts && echo same` prints `same`; then `rm -rf scratch/prompts-copy`). Findings fixed before Task 6; a ledger line.

---

### Task 3: The 159 briefs, complete, checked, and their questions ruled

**Files (outside the repository):**
- Modify: `$RUN/briefs/<NN>-<slug>.md` (completed by the twelve brief lanes; gaps filled by the checkers), `$RUN/brief-rulings.md` (the per-page rulings).
- Create: `$RUN/briefs/check-<lane>.md` (one per brief lane: `01a`, `01b`, `02`, `03`, `04a`, `04b`, `04c`, `05`, `06a`, `06b`, `07a`, `07b`), `$RUN/briefs/check-twins.md`.

**Interfaces:**
- Consumes: the twelve brief lanes (done: every brief written, every summary saved) and their `briefs/summary-<lane>.md`, with `briefs/RULINGS.md` and `briefs/OPEN-QUESTIONS.md`; Task 2's `check-slots.mjs` and `brief-rulings.md`.
- Produces: 159 briefs that pass `check-slots.mjs` with the briefs folder; the rulings already given left as they are, every question still open ruled in `brief-rulings.md`, and a line there for each page `briefs/RULINGS.md` item 6 names; a ledger line `Briefs: 159 complete and checked; <K> per-page rulings`.

- [ ] **Step 1: Every brief is there, with every part**

The twelve lanes have reported. Run the check once: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $RUN && node check-slots.mjs slots.json $REPO briefs`
Expected: `no problem`; go on. (A `has no brief` or `the brief has no …` line: the lanes are done, so a fresh agent (opus) with `briefs/HOW-TO-WRITE.md` and the page completes that brief; then the check again.)

- [ ] **Step 2: The open questions: copy nothing, re-rule nothing**

The answers given while the briefs were written stand as they are: `briefs/RULINGS.md`, `briefs/OPEN-QUESTIONS.md` and every `RULED:` cell of the summaries. Every builder, reviewer and checker reads them beside the brief (Global Constraints, Pages), so they are not copied here. Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $RUN/briefs && cat summary-*.md | grep '^| [0-9]' | awk -F'|' '{q=$7; gsub(/^ +| +$/, "", q); if (q != "-" && q != "") print $2 "|" q}' | grep -v 'RULED'`
Expected: the cells not marked `RULED:`: the twins' "one slot" (the slot table settles them), the pages "listed for the owner's look" and the four of lane 07b that `briefs/OPEN-QUESTIONS.md` lists for that look (both go to the owner with the first batch; Task 1 applies the answer), and Gradient Border's note on the weak-views table (nothing to rule). Only a question still open after that, or one a checker raises in Step 3, is ruled now, under "Per page" in `$RUN/brief-rulings.md` as `NN.MM slug: <the ruling, in plain words>` (a question already covered by G1 to G4 gets `see G<k>`). The coordinator decides; where a question is really the owner's design choice, it takes the brief's best option and adds the page to a list at the end of the file, `For the owner's final look: <page>: <the choice made>`, so the owner judges it on the built page (owner's rule: decide, then let the owner judge the result). That list holds only choices made after the first-batch look message went out.

Then one line for each page `briefs/RULINGS.md` item 6 names (six of their briefs never mention it): `NN.MM slug: RULINGS 6 applies: <what the flag set in the hb:mode listener guards here>`, for 04.13 checkmark-draw, 04.38 button-loading-states, 04.41 dynamic-island, 04.37 expanding-search, 04.36 hold-to-confirm, 04.39 image-trail, 06.23 physics-2d, 04.21 error-shake, 04.03 focus-ring and 04.14 form-field-morph.

- [ ] **Step 3: Each brief lane checked by a fresh agent**

Dispatch one fresh agent (opus) per brief lane, as seats allow (twelve in all), with this prompt, `<lane>` filled in:

```text
You check the page briefs of brief lane <lane> of the Animation Handbook's See inside and Compare rollout: the pages listed
in .superpowers/sdd/2026-10-13-see-inside-compare/briefs/summary-<lane>.md (the main checkout is
C:/Users/matin/OneDrive/Desktop/Projects/animation-handbook, branch feat/see-inside-compare; never switch it). Change no
repository file and start no agents. Read first: CLAUDE.md; docs/superpowers/specs/2026-10-13-see-inside-compare-rollout-design.md
sections 1 and 2 (the acceptance list, the hard cases, the weak-views table, the twins); the run folder's brief-rulings.md;
briefs/HOW-TO-WRITE.md; the coordinator's rulings briefs/RULINGS.md and briefs/OPEN-QUESTIONS.md, and the RULED: cells of
briefs/summary-<lane>.md (a ruling stands: never undo one, and where a brief says "see the open question" or waits for the
coordinator's answer, the answer is in these files). For each brief: read it, the page's index.html (its stage, settings and
script) and its row in .superpowers/sdd/2026-10-13-learn-pilot/rollout-survey-*.md, and check:
 1. the kind and today's movement are the page's;
 2. See inside shows the hidden working from the page's own numbers, with at most six labels (four on phones) in a
    beginner's amounts, and a faint start outline for every moving part where a movement is scaled down (ruling 2);
 3. Compare: two halves at the same size and time, each named in one to three words; the first half is the scene without
    the effect or, for a row marked * in the spec's weak-views table, the mistake or made-up scene that row gives, or a
    mistake ruled for this page (briefs/RULINGS.md item 2 with briefs/OPEN-QUESTIONS.md, the page's RULED: cell or its line
    in brief-rulings.md); how every input reaches both halves (the spec's do-it rules: hover, press, drag, forms); a posed
    rest where the difference needs movement;
 4. reduced motion: a still for each view that still teaches; a posed still where reduced motion erases the difference;
 5. phones: halves side by side while each keeps about 160px of scene, else stacked; the box keeps its size;
 6. the two notes: one or two sentences each, at most 35 words, the halves named by their labels, ending with what to
    do when the stage looks like Normal until the visitor acts;
 7. every setting changes both views (a setting that changes only timing or a shared rule, or one a ruling names, in
    motion: G1);
 8. each hard case the page has, with the spec's rule: one canvas split; one WebGL context in two viewports with the no-WebGL
    and lost-context messages covering every mode; a second world on one accumulator with fixed-seed stills; random pieces
    drawn from the plan the current play uses, stills from a fixed plan; a "Shows the …" switch reused, never flipped; your
    text followed by the copy; snapping (no mode changes the scrolling content); flash safety (an outline, never a flash);
    runs that hold their pauses with setTimeout; an endless animation or an idle timer named;
 9. the pitfalls and "how to check it" are this page's own, the closest first-batch page is named, and no shared building
    block is asked for.
Fill a gap in place in the brief's own words and format (design text only, no code). Write
.superpowers/sdd/2026-10-13-see-inside-compare/briefs/check-<lane>.md: for each page "OK", or the changes you made, and the
questions you could not settle for the coordinator. Reply with three lines: pages checked, pages changed, questions.
```

Also one fresh agent (opus) for the twins and the cover-swap-uncover pictures, with this prompt: "Read `briefs/RULINGS.md` and `briefs/OPEN-QUESTIONS.md` (rulings that stand), then the briefs of Stacking Cards and Section Wipe (`01-stacking-cards.md`, `01-section-wipe.md`), Pin Animation and Sticky Section, Split Text Reveal, Letter-by-Letter Stagger and Word-by-Word Reveal, Portal / Tunnel Zoom and Circle Reveal, and Curtain Reveal and Flash / Light Leak Transition beside Overlay Wipe's first-batch brief (`03.14-overlay-wipe.md`), with spec section 2's twins paragraph. Each group must draw different pictures (each page stresses its own part: the spec says which); change the briefs where two would look alike, and write `briefs/check-twins.md`: the groups, what each page's picture stresses, what you changed. Change no repository file; start no agents; reply in three lines."

Each checker's questions are ruled in `brief-rulings.md` as in Step 2.

- [ ] **Step 4: Check again, and the ledger**

Run Step 1's command again: `no problem`. Append to `$RUN/ledger.md`: `Briefs: 159 complete and checked (check-*.md); <K> per-page rulings; <L> pages for the owner's final look`.

---
### Task 4: The rest-and-run probe of every page

**Files:**
- Create (outside the repository): `$RUN/probe.test.mjs`, `$RUN/probe.mjs`, `$RUN/probe-summary.md`, logs `$RUN/checks/probe-<NN>-<k>.log`.
- Create and remove: worktree `.claude/worktrees/sic-probe` (detached; its pages get a switch that is never committed).
- Modify (outside the repository): the briefs of the pages the probe flags (a `Probe:` paragraph), `$RUN/brief-rulings.md` (per-page lines).

**Interfaces:**
- Consumes: Phase 0 merged into `feat/see-inside-compare` (the previous plan's Task 6: the shared script plays a plays-once or do-it page once after a mode press; the page check's mode path with `waitForRun`, `restShot` and the hold of endless CSS animations); the first batch's last Chrome run before the owner's look ended (the previous plan's Task 14, Step 3); Task 2's `pages.mjs parts`, `wait-log.mjs`.
- Produces: `$RUN/probe-summary.md` (each page whose stage never comes to rest, whose run never ends, or whose run scrolls or moves focus, with the setups and the check's own words); a line in `brief-rulings.md` and a `Probe:` paragraph in the brief of each flagged page; ledger line `Probe: <n> pages flagged: …`.

Why: with a switch and a view that draws nothing, a page goes through the check's real mode path, so the hazards the previous plan named that the check does not absorb (movement a script keeps up at rest, idle timers, runs held inside a frame loop or longer than 30 s, a Show me that scrolls or moves focus) show up for every page at once, before 159 builders meet them one by one. Endless CSS animations no longer show: the check holds them while it judges rest.

- [ ] **Step 1: Phase 0 is in, and the first batch's checks are over**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; grep -c "Phase 0 done at" $RUN/ledger.md; grep -c "comparisons made" $RUN/kit/first-batch.log`
Expected: `1` and `1` (the second: the kit's run for the owner's look, the previous plan's Task 14, Step 3, has ended, so the probe's runs never slow the first batch's checks). Otherwise this task waits; it then runs during the owner's look, at most four parts at once (Step 5).

- [ ] **Step 2: Write the failing tests of the probe**

Create `$RUN/probe.test.mjs`:

```js
// Tests of probe.mjs: node --test probe.test.mjs (from the run folder)
import test from 'node:test';
import assert from 'node:assert/strict';
import { addSwitch, problems } from './probe.mjs';

const PAGE = '<body class="hb">\n  <section class="hb-step hb-watch" aria-labelledby="t">\n    <div class="hb-step-head"><h2 id="t">Watch it</h2></div>\n'
  + '    <div class="stage hb-dots"><div class="card"></div></div>\n    <div class="hb-player"><button data-hb-replay>Replay</button></div>\n  </section>\n'
  + '<script>const x = 1;</script>\n</body>\n</html>\n';
// The switch and the notes box as the tests pin them (tests/pages.test.js), with the space between tags taken out
const MODES = '<div class="seg hb-modes" role="group" aria-label="What the box shows" data-hb-modes><button type="button" data-hb-mode="normal" class="on" aria-pressed="true">Normal</button><button type="button" data-hb-mode="inside" aria-pressed="false">See inside</button><button type="button" data-hb-mode="compare" aria-pressed="false">Compare</button></div>';
const NOTES_BOX = /<div class="hb-mode-notes" aria-live="polite"><p data-hb-for="inside" hidden>[^<]*<\/p><p data-hb-for="compare" hidden>[^<]*<\/p><\/div>/;

test('addSwitch puts the switch before the stage, the notes after the player bar and an empty listener before </body>', () => {
  const html = addSwitch(PAGE), flat = html.replace(/>\s+</g, '><');
  const watch = flat.slice(flat.indexOf('<section class="hb-step hb-watch"'), flat.indexOf('</section>'));
  assert.ok(watch.indexOf(MODES) > watch.indexOf('hb-step-head') && watch.indexOf(MODES) < watch.indexOf('<div class="stage'));
  assert.ok(NOTES_BOX.test(watch) && watch.search(NOTES_BOX) > watch.indexOf('<div class="hb-player">'));
  assert.match(html, /<script>document\.addEventListener\('hb:mode', function \(\) \{\}\);<\/script>\n<\/body>/);
  assert.equal(addSwitch(html), html, 'a page with the switch is left as it is');
  assert.throws(() => addSwitch('<body></body>'), /no Watch step/);
});

test('problems keeps each page\'s real problems and drops what an empty view always gets', () => {
  const log = ['ok   02-slide-in desktop',
    'FAIL 05-typewriter-effect desktop — See inside does not change the stage; the stage does not come to rest before the modes are tried',
    'FAIL 05-typewriter-effect phone-reduced — See inside does not change the stage; See inside and Compare show the same picture',
    'FAIL 06-flocking desktop — the picture\'s name is the same in Normal and See inside: "Flock"',
    'FAIL 04-toast-notification desktop — Compare: keyboard focus moved to button#send'].join('\n');
  assert.deepEqual([...problems(log)], [
    ['05-typewriter-effect', ['desktop: the stage does not come to rest before the modes are tried']],
    ['04-toast-notification', ['desktop: Compare: keyboard focus moved to button#send']]]);
});
```

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $RUN && node --test probe.test.mjs`
Expected: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…probe.mjs'` and `ℹ fail 1`.

- [ ] **Step 3: Write the probe**

Create `$RUN/probe.mjs`:

```js
#!/usr/bin/env node
// The rest-and-run probe (Task 4 of docs/superpowers/plans/2026-10-14-see-inside-compare-other-pages.md). Not part of the
// repository. In a scratch worktree it gives pages the mode switch and the notes box exactly as the template has them, and a
// listener that draws nothing, so the page check runs its mode path on each page as it is today: the shared script plays a
// plays-once or do-it page once after See inside or Compare, and the check waits for that run and for the stage to rest. The
// check's lines then show, before any view is built, which pages never come to rest, whose runs never end, or whose run
// scrolls or moves focus.
//   node probe.mjs add <worktree> <page folder>...   adds the switch, the notes and the empty listener (a page that has the
//                                                    switch already is left as it is)
//   node probe.mjs read <log>...                     prints each page's problems from page-check logs, without the ones an
//                                                    empty view always has (it changes nothing and has no labels)
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const MODES = '<div class="seg hb-modes" role="group" aria-label="What the box shows" data-hb-modes>\n'
  + '      <button type="button" data-hb-mode="normal" class="on" aria-pressed="true">Normal</button>\n'
  + '      <button type="button" data-hb-mode="inside" aria-pressed="false">See inside</button>\n'
  + '      <button type="button" data-hb-mode="compare" aria-pressed="false">Compare</button>\n'
  + '    </div>\n    ';
const NOTES = '  <div class="hb-mode-notes" aria-live="polite">\n'
  + '      <p data-hb-for="inside" hidden>The probe draws nothing here.</p>\n'
  + '      <p data-hb-for="compare" hidden>The probe draws nothing here.</p>\n'
  + '    </div>\n  ';
const LISTEN = '<script>document.addEventListener(\'hb:mode\', function () {});</script>\n';
// What an empty view always gets: it changes nothing, so the pictures match, and a page that names its picture names it
// the same in every mode
const NOISE = /does not change the stage|show the same picture|Normal does not bring the first picture back|the picture's name is the same/;

// The page with the switch before its stage, the notes box at the end of its Watch step and the listener before </body>
export function addSwitch(html) {
  if (html.includes('data-hb-modes')) return html;
  const watch = html.indexOf('<section class="hb-step hb-watch"');
  const stage = watch < 0 ? -1 : html.indexOf('<div class="stage', watch);
  const end = stage < 0 ? -1 : html.indexOf('</section>', stage);
  const body = html.lastIndexOf('</body>');
  if (end < 0 || body < end) throw new Error('no Watch step with a stage');
  return html.slice(0, stage) + MODES + html.slice(stage, end) + NOTES + html.slice(end, body) + LISTEN + html.slice(body);
}

// The problems of each page in page-check output lines ("ok   NN-slug setup" or "FAIL NN-slug setup — a; b"), noise left out
export function problems(text) {
  const out = new Map();
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^FAIL (\S+) (\S+) — (.*)$/);
    if (!m) continue;
    const kept = m[3].split('; ').filter(p => !NOISE.test(p));
    if (!kept.length) continue;
    if (!out.has(m[1])) out.set(m[1], []);
    out.get(m[1]).push(`${m[2]}: ${kept.join('; ')}`);
  }
  return out;
}

if (resolve(process.argv[1] || '').toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  const [cmd, ...rest] = process.argv.slice(2);
  if (cmd === 'add' && rest.length > 1) {
    const [wt, ...pages] = rest;
    for (const p of pages) {
      const file = join(wt, p.replace(/\/?(index\.html)?$/, ''), 'index.html');
      writeFileSync(file, addSwitch(readFileSync(file, 'utf8')));
    }
    console.log(`${pages.length} pages ready`);
  } else if (cmd === 'read' && rest.length) {
    const all = problems(rest.map(f => readFileSync(f, 'utf8')).join('\n'));
    for (const [page, lines] of [...all].sort()) console.log(`${page}\n  ${lines.join('\n  ')}`);
    console.log(`${all.size} pages with a problem`);
  } else {
    console.error('usage: node probe.mjs add <worktree> <page folder>... | read <log>...');
    process.exit(2);
  }
}
```

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $RUN && node --test probe.test.mjs 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ pass 2`, `ℹ fail 0`.

- [ ] **Step 4: The probe's worktree, every page given the empty switch**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare
git -C $REPO worktree add --detach $REPO/.claude/worktrees/sic-probe feat/see-inside-compare
cd $RUN && node probe.mjs add $REPO/.claude/worktrees/sic-probe $(for n in 01 02 03 04 05 06 07; do node pages.mjs parts $n 100; done)
git -C $REPO/.claude/worktrees/sic-probe status --short | wc -l
```
Expected: `166 pages ready` and `159` (the first batch is on the branch by Step 1: its seven pages keep their switch and are checked with their real views). Start, as a background command: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-probe && python -m http.server 8828 --bind 127.0.0.1`.

- [ ] **Step 5: The check on every page, in parts, through the pool**

For each category `NN` and each line `k` (1, 2, …) of `cd $RUN && node pages.mjs parts NN 8` (24 parts in all: 01 has 4, 02 2, 03 2, 04 6, 05 3, 06 4, 07 3), start a background command, at most four at a time (the pool serves the other projects too):
`REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $REPO/.claude/worktrees/sic-probe && node $RUN/slot.mjs run probe-NN-k -- node tools/check-pages.mjs --base http://127.0.0.1:8828 --out $RUN/checks/probe <that line's folders> > $RUN/checks/probe-NN-k.log 2>&1; echo "EXIT=$?" >> $RUN/checks/probe-NN-k.log`
and wait for each with `cd $RUN && node wait-log.mjs checks/probe-NN-k.log`. A part takes about 15 to 25 minutes; all of them about two hours.
Expected when all have ended: `cd $RUN && grep -h "^EXIT=" checks/probe-*.log | wc -l` prints `24`, and `cat checks/probe-*.log | grep -cE "^(ok|FAIL) "` prints `996` (166 pages, six setups each).

- [ ] **Step 6: Read the problems**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $RUN && node probe.mjs read checks/probe-*.log > probe-summary.md; tail -1 probe-summary.md; grep -cE "^0[0-9]-(parallax-scrolling|fade-in-out|overlay-wipe|magnetic-button|marquee-ticker|fluid-simulation|flow-field)$" probe-summary.md`
Expected: `<n> pages with a problem` (a few, or none: the check holds endless CSS animations, so what is left is movement a script keeps up at rest, idle timers, runs over 30 s, runs that scroll or move focus, and a control whose name lacks its visible words), and `0` (the first batch's pages, checked with their real views, have no problem).

- [ ] **Step 7: Sort each flagged page, and tell its builder**

This step writes into the briefs only once Task 3, Step 4's ledger line is in (`grep -c "^Briefs: 159 complete" $RUN/ledger.md` prints `1`), so no brief checker is editing them. If Task 6 has started meanwhile, the lines go in before the next dispatch (Task 9, Step 2); a flagged page already started meets the same problem in its own page check. For each page in `probe-summary.md`, read the problem and the page's code, and sort it:
- (a) **Endless movement the hold cannot see** (a script-driven blink or loop): a line for the page in `brief-rulings.md`, `NN.MM slug: <the part> moves for ever at rest by its script: drive it by a CSS animation, or stop it at rest, Normal's look unchanged`, and a `Probe:` paragraph in its brief with the check's words.
- (b) **An idle timer:** nothing moves, but the run wait never ends (a `setTimeout` of 6 s or less renewed while the page is idle). Add a line to `brief-rulings.md`: `NN.MM slug: the idle loop (<where>) moves into a frame loop or a setInterval, with Normal's look and timing unchanged; the reviewer confirms Normal before and after and that the run wait now ends.` and the same as a `Probe:` paragraph in the brief.
- (c) **A run that scrolls, moves focus or changes the box's size:** the page's own Show me or Replay does it; append `Probe: <the check's words>. Fix it in the build: a mode press must never do this (acceptance 4).`
- (d) **Anything else:** the coordinator reads the probe's screenshots in `$RUN/checks/probe/` and writes a ruling line for the page.

- [ ] **Step 8: Remove the probe's worktree, and the ledger**

Stop the 8828 server. Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; git -C $REPO worktree remove --force $REPO/.claude/worktrees/sic-probe && git -C $REPO worktree list | grep -c sic-probe`
Expected: `0` (the switches it held were scratch and are gone). Append to `$RUN/ledger.md`: `Probe: <n> pages flagged: endless by script <list>; idle timers <list>; runs that move <list>; other <list>`.

---

### Task 5: The review kit holds endless animations at rest as the page check does, and kit rounds 3 and 4 reviewed (before the verdict)

The page-check marker this task used to add (`data-hb-endless`) is not needed: Phase 0's page check (the previous plan's Task 3) holds every endless CSS animation in the stage while it judges rest and takes the mode screenshots, waits out runs of up to 30 s, and skips hidden text when it reads a control's name; and a marker could not help the one case left, a blink driven by a script, which is no CSS animation (Task 4, Step 7 (a) rules such a page). What is left is the review kit (`$KIT/record.mjs`, as its rounds 3 and 4 left it: report `.superpowers/sdd/2026-10-13-see-inside-compare-phase0-first-batch/task-5-report.md`, parts "Fix round 3" and "Round 4"). Round 4 brought the page check's `holdEndless`, `releaseEndless` and `restShot` (as `restHeld`), but only `--short` uses them: `rest()` (which `ready()` uses for the stills, the clips and Normal before and after, and `pageStill` after a mode press), the region pictures of `beforeAfter` and `capture` hold nothing. So on a page whose stage runs an endless animation at rest (Typewriter Effect, Letter-by-Letter Stagger, Checkmark Draw, Button Loading States, Dynamic Island, Progress Animation, Pull to Refresh, Skeleton Loader) every still notes that the stage did not come to rest, and the two Normal pictures can catch the caret at different moments, so Normal before and after can read as changed and send the builder (Task 7, step 7) after a change that is not there. This task makes those three hold with round 4's own code, never declaring anything a second time; it works on a copy of the kit, since every agent's kit run loads `$KIT/record.mjs`, and puts the copy in place in one move after the review. Its fresh reviewer also reviews kit rounds 3 and 4 (the coordinator folded their review into this task).

**Files (outside the repository):**
- Modify: `$KIT/record.mjs` (on a copy, put in place after the review: the body of `rest()` becomes `return restHeld(page);`; each side's region loop in `beforeAfter`, and `capture`, hold with round 4's `holdEndless` and `releaseEndless`), `$KIT/README.md` (one sentence).
- Create and remove: `$RUN/scratch/kit-hold/` (a fixture site built by `$FX/sic-gen.mjs`, with the copy of the kit four folders down, so the copy reads the fixture pages as the real kit reads the handbook's; served on 8840) and `$RUN/kit-hold-real/` (the copy again, four folders below the repository, to read a real page).

**Interfaces:**
- Consumes: Phase 0's page check merged into `feat/see-inside-compare` (its `holdEndless` and `releaseEndless`, which round 4 copied from 193f2ba); the kit as round 4 left it (`record.mjs` 1135 lines, `kit-lib.mjs` 146, `record.test.mjs` 108 with 11 tests, `README.md` 240, md5s in the report's "Files after round 4"; no agent at work on it); `$FX/sic-gen.mjs` and its pages `animations/93-phase0/ok-caret` (a caret that blinks for ever beside a run), `ok-captions` and `bad-caption-outside`; the pool; `wait-log.mjs` (Task 2, Step 7); the before-pictures server (8800).
- Produces: a kit whose `rest()`, `beforeAfter` region pictures and `capture` hold every running stage animation that never ends at its first frame and let it go after (the clips hold nothing: they show the movement); kit rounds 3 and 4 reviewed; the ledger lines `Kit short: done: …` and `Kit hold: done: …`, which Task 6 counts.

- [ ] **Step 1: Phase 0's page check is in, and the kit is as round 4 left it**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; grep -c "^const holdEndless" $REPO/tools/check-pages.mjs; cd $KIT && grep -c "^const holdEndless\|^const releaseEndless\|^async function restHeld" record.mjs; node --check record.mjs; node --test record.test.mjs 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `1`; `3`; nothing from `node --check`; `ℹ pass 11` and `ℹ fail 0`. If the first is `0`, this task waits for the previous plan's Task 3 to be merged; while an agent of the kit's round 4 (or a fix round of it) is still at work on `record.mjs`, it waits too, so the two never edit the kit at once.

- [ ] **Step 2: The fixture site, and the kit as it is failing on it (the failing test)**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; FX=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/fixtures; S=$RUN/scratch/kit-hold
mkdir -p $S/site/k/i/t/kit && node $FX/sic-gen.mjs $S/site $REPO
cp $KIT/record.mjs $S/record-before.mjs && cp $KIT/record.mjs $KIT/kit-lib.mjs $S/site/k/i/t/kit/
```
Expected: `90-ok: 10 pages`, `91-old: 8 pages`, `92-wave-a: 9 pages`, `93-phase0: 26 pages` (more if Phase 0's review adds fixtures) and `check script from …`. The kit's copy sits four folders below the site, so it reads each page's kind and title from the site, as the real kit reads them from the repository. Start, as a background command: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.superpowers/sdd/2026-10-13-see-inside-compare/scratch/kit-hold/site && python -m http.server 8840 --bind 127.0.0.1`.
Run, as a background command: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; S=$RUN/scratch/kit-hold; node $RUN/slot.mjs run kit-hold -- node $S/site/k/i/t/kit/record.mjs --base http://127.0.0.1:8840 --before http://127.0.0.1:8840 --only before --out $S/out-0 animations/93-phase0/ok-caret > $S/run-0.log 2>&1; echo "EXIT=$?" >> $S/run-0.log`, and wait with `cd $RUN && node wait-log.mjs scratch/kit-hold/run-0.log`.
Expected (with `S=$RUN/scratch/kit-hold`): `grep -c "did not come to rest" $S/run-0.log` prints `6` (three comparisons, both sides each: a caret that blinks every half second never lets the stage look the same for 750 ms); three lines `ok    93-ok-caret-before-1280`, `ok    93-ok-caret-before-375` and `ok    93-ok-caret-before-320`, each `the stage: <n> of … pixels differ (<v> visibly); Try it: not on this page` (the caret may be caught at different moments, so `<v>` may be above 0); the line `0 pictures, 0 clips and 3 comparisons made, 0 skipped, 0 failed`.

- [ ] **Step 3: The hold, on the copy**

Edit only the copy, `$RUN/scratch/kit-hold/site/k/i/t/kit/record.mjs`, never `$KIT/record.mjs` (every agent's kit run loads it while this task runs). Round 4 has already declared `holdEndless`, `releaseEndless` and `restHeld` there: use them, declare nothing again.

(a) Replace
```js
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
```
with
```js
// Waits until the stage has looked the same for 750 ms (four captures 250 ms apart), for up to 10 s, with every animation in it
// that never ends held at its first frame, as the page check judges rest (restHeld, below); says whether it did
async function rest(page) {
  return restHeld(page);
}
```

(b) In `beforeAfter`, replace
```js
    for (const region of REGIONS) {
      const shot = await regionShot(page, region.selector);
      pics[side][region.key] = shot && shot.data;
      if (shot) writeFileSync(join(OUT, item.files[side === 'before' ? `${region.key}Before` : `${region.key}After`]), Buffer.from(shot.data, 'base64'));
    }
```
with
```js
    // the regions pictured with the animations that never end held, so both sites show the same moment of a blinking caret
    try {
      await holdEndless(page);
      for (const region of REGIONS) {
        const shot = await regionShot(page, region.selector);
        pics[side][region.key] = shot && shot.data;
        if (shot) writeFileSync(join(OUT, item.files[side === 'before' ? `${region.key}Before` : `${region.key}After`]), Buffer.from(shot.data, 'base64'));
      }
    } finally {
      await releaseEndless(page);
    }
```

(c) Replace
```js
async function capture(page, file) {
  const shot = await page.send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(file, Buffer.from(shot.data, 'base64'));
}
```
with
```js
// A picture of the screen, with the animations that never end held (holdEndless)
async function capture(page, file) {
  try {
    await holdEndless(page);
    const shot = await page.send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(file, Buffer.from(shot.data, 'base64'));
  } finally {
    await releaseEndless(page);
  }
}
```

Where the merged `tools/check-pages.mjs` words `holdEndless` or `releaseEndless` differently from round 4's two declarations (its review may have changed them), change those two declarations in the copy to the merged words, with `evaluate(` written `page.evaluate(`. Then: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; node --check $RUN/scratch/kit-hold/site/k/i/t/kit/record.mjs; grep -c "^const holdEndless" $RUN/scratch/kit-hold/site/k/i/t/kit/record.mjs; cd $KIT && node --test record.test.mjs 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: nothing from `node --check` (the parse test: the kit's tests read only `kit-lib.mjs`, which this task does not change); `1` (declared once); `ℹ pass 11` and `ℹ fail 0`.

- [ ] **Step 4: The copy with the hold: the fixture three times, Typewriter Effect, and two short runs**

The copy in the site is now the changed kit. Three runs, one after another, each as a background command, with `k` = 1, 2 and 3:
`REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; S=$RUN/scratch/kit-hold; node $RUN/slot.mjs run kit-hold -- node $S/site/k/i/t/kit/record.mjs --base http://127.0.0.1:8840 --before http://127.0.0.1:8840 --only before --out $S/out-k animations/93-phase0/ok-caret > $S/run-k.log 2>&1; echo "EXIT=$?" >> $S/run-k.log`
each waited with `cd $RUN && node wait-log.mjs scratch/kit-hold/run-k.log`.
Expected, for each: `grep -c "the stage: 0 of [0-9]* pixels differ (0 visibly); Try it: not on this page" $S/run-k.log` prints `3`, `grep -c "did not come to rest" $S/run-k.log` prints `0`, and the log has the line `0 pictures, 0 clips and 3 comparisons made, 0 skipped, 0 failed` and `EXIT=0`.
Then a real caret page, main's on both sides, through a copy four folders below the repository (so it reads the real pages), as a background command (if 8800 does not answer, start it as Task 6, Step 4 says):
`REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; S=$RUN/scratch/kit-hold; mkdir -p $RUN/kit-hold-real && cp $S/site/k/i/t/kit/record.mjs $KIT/kit-lib.mjs $RUN/kit-hold-real/ && node $RUN/slot.mjs run kit-hold -- node $RUN/kit-hold-real/record.mjs --base http://127.0.0.1:8800 --before http://127.0.0.1:8800 --only before --out $S/out-real animations/05-text-typography/typewriter-effect > $S/real.log 2>&1; echo "EXIT=$?" >> $S/real.log`
Expected: `grep -c "the stage: 0 of [0-9]* pixels differ (0 visibly); Try it: 0 of [0-9]* pixels differ (0 visibly)" $S/real.log` prints `3`, `grep -c "did not come to rest" $S/real.log` prints `0` (its caret blinks for ever and is held), and `0 pictures, 0 clips and 3 comparisons made, 0 skipped, 0 failed`. Then `rm -rf /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.superpowers/sdd/2026-10-13-see-inside-compare/kit-hold-real`.
Then round 4's `--short` on two fixture pages with the copy, for the review, each as a background command, with `<page>` and `<log>` taken in turn from `ok-captions` and `short-ok`, `bad-caption-outside` and `short-bad`:
`REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; S=$RUN/scratch/kit-hold; node $RUN/slot.mjs run kit-hold -- node $S/site/k/i/t/kit/record.mjs --base http://127.0.0.1:8840 --short --out $S/out-<log> animations/93-phase0/<page> > $S/<log>.log 2>&1; echo "EXIT=$?" >> $S/<log>.log`
Expected: `short-ok.log` has `27 short-screen pictures checked, 0 with labels cut or overlapping, 0 skipped, 0 failed` and `EXIT=0`; `short-bad.log` has nine `FAIL` lines, one per screen in See inside (`… the label "Outside label" is not inside the stage`), `27 short-screen pictures checked, 9 with labels cut or overlapping, 0 skipped, 0 failed` and `EXIT=1`.

- [ ] **Step 5: Review (a fresh agent): the hold, and kit rounds 3 and 4**

A fresh reviewer (opus) gets this task and reviews two things, then writes a verdict with numbered items:
- The hold: `diff $RUN/scratch/kit-hold/record-before.mjs $RUN/scratch/kit-hold/site/k/i/t/kit/record.mjs` and the logs `run-0.log` to `run-3.log` and `real.log` in `$RUN/scratch/kit-hold/`. It confirms: the hold is the page check's (round 4's `holdEndless` and `releaseEndless`, declared once, against the merged `tools/check-pages.mjs`: only running stage animations whose iterations are Infinity, each let go in a `finally`); `rest()`, `beforeAfter`'s region pictures and `capture` hold, and the clips do not; `run-0.log` fails as Step 2 says and the others pass as Step 4 says; `node --check` on the copy and the kit's tests (`cd $KIT && node --test record.test.mjs`) pass.
- Kit rounds 3, 4 and 5 (5 added 1366×630), as the kit has them (the coordinator folded their review into this task): the report's parts "Fix round 3" and "Round 4" and the README's parts of the same names; their code in the copy (`regionShot`, `stageShot`, `PHONE_SMALL`, `REGIONS`, `beforeAfter` and `comparePictures`, the `--short` arguments, `shortCheck`, `CAPTIONS`, `holdEndless`, `releaseEndless`, `restHeld`, and the log and done lines) and in `$KIT/kit-lib.mjs` (`regionPlan`, `captionProblems`, `SHORT_SETUPS`, with their tests in `record.test.mjs`); their outputs in `$RUN/scratch/kit-fix3/` and `$RUN/scratch/kit-fix4/`; and the logs `short-ok.log` and `short-bad.log`. It confirms: each region is pictured on the screen (scrolled 8px under the pinned bar unless it is wholly on the screen) and clipped to its own box; Normal before and after runs at 1280, 375 and 320; the branch's switch row is taken out (style only) only when the stage's place on the page differs, and a note says so; a stage of another size fails, a Try it of another size or on one site only is said and not counted; `--short` takes one page, refuses `--gallery`, `--only` and `--before` (exit 2), rests and measures captions as the page check does (its `restShot` and `captionProblems`, word for word), exits 1 on a problem; and the log lines the plan expects (Task 7, steps 7 and 8, Task 8, Task 14) are the ones the kit prints.
Findings are fixed on the copy (Steps 3 and 4 again for the hold; for rounds 3 and 4, by the coordinator's choice of agent, on the same copy) and re-checked by the same reviewer.

- [ ] **Step 6: The copy in place, the README, and the gates**

After the reviewer approves:
```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit
cp $RUN/scratch/kit-hold/site/k/i/t/kit/record.mjs $KIT/record.new.mjs && node --check $KIT/record.new.mjs && mv $KIT/record.new.mjs $KIT/record.mjs
node --check $KIT/record.mjs && cmp $KIT/record.mjs $RUN/scratch/kit-hold/site/k/i/t/kit/record.mjs && echo "in place"
cd $KIT && node --test record.test.mjs 2>&1 | grep -E "^ℹ (pass|fail)"
```
Expected: `in place` (the kit swapped in one move, so no run ever loads half a file); `ℹ pass 11` and `ℹ fail 0`. Then in `$KIT/README.md`, after the bullet that starts `- with \`--before\`, a comparison of Normal at rest` in "The rollout's kit", add this paragraph:

```text
While it waits for the stage to rest and while it takes a picture, the kit holds every animation in the stage that never ends
(a blinking caret, a loader) at its first frame, as the page check does, so Normal before and after compares one moment; the
clips show it moving.
```

Stop the 8840 server, `rm -rf /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.superpowers/sdd/2026-10-13-see-inside-compare/scratch/kit-hold`, and append to `$RUN/ledger.md` the two gate lines:
`Kit short: done: record.mjs --short, reviewed (kit round 4, with round 3's comparison at 1280, 375 and 320), Task 5`
`Kit hold: done: record.mjs holds the stage's endless animations while it judges rest and takes pictures (ok-caret 0 visibly three times; Typewriter Effect 0 visibly)`

---

### Task 6: Twenty slots and seven category worktrees

**Files:**
- Create: worktrees `.claude/worktrees/sic-01a` … `sic-07c` (20) on branches `sic/01a` … `sic/07c`, and `sic-cat-01` … `sic-cat-07` on `sic/cat-01` … `sic/cat-07`, all from the head of `feat/see-inside-compare`.
- Remove: the first batch's slot worktrees `sic-<NN>a` and the branches `sic/<NN>a`, `sic/cat-<NN>` (fully merged).
- Create (outside the repository): `$RUN/pages.json` (`pages.mjs init`).

**Interfaces:**
- Consumes: Task 1's gate line; Task 2's tracker and `slots.json`; Task 3's ledger line; Task 5's ledger lines: `Kit hold: done` and the kit's `--short` (Phase 0's kit round 4, reviewed in Task 5: `Kit short: done`); Task 4's ledger line once the probe has ended (until then, its Step 7 lines go in before the next dispatch: Task 9, Step 2).
- Produces: the 20 slots served on 8801–8820 from the same commit, the category worktrees, `pages.json` with 159 queued pages; the ledger line `Slots ready at <hash>`.

- [ ] **Step 1: Everything before is done**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; grep -c "^First batch approved by the owner on .*rulings-159\.md:" $RUN/ledger.md; grep -c "^Briefs: 159 complete" $RUN/ledger.md; grep -c "^Kit hold: done" $RUN/ledger.md; grep -c "^Kit short: done" $RUN/ledger.md; grep -c "^Probe: " $RUN/ledger.md; git -C $REPO status --short; git -C $REPO branch --show-current`
Expected: `1`, `1`, `1` and `1` (each gate counted apart: the previous plan's Task 14 also writes a line that begins "First batch approved by the owner", without `rulings-159.md:`; without `Kit short: done` every build's step 7 would meet a kit that does not know `--short`); for the probe, `1` once it has ended, or `0` while it still runs (this task may start then; Task 4, Step 7's lines go in before the next dispatch); an empty status (if another project's plan lies untracked there, the coordinator commits it first, as Task 0 commits this one); `feat/see-inside-compare`.

- [ ] **Step 2: The first batch's slots and category branches go (they are merged)**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook
cd $REPO
for n in 01 02 03 04 05 06 07; do
  ok=yes
  for b in sic/${n}a sic/cat-$n; do
    git rev-parse --verify -q $b > /dev/null || continue
    git merge-base --is-ancestor $b feat/see-inside-compare || ok=no
  done
  [ $ok = yes ] && echo "$n merged" || echo "$n NOT MERGED"
done
```
Expected: seven lines `NN merged` (a branch that was never made is skipped). A `NOT MERGED` line: stop (the first batch is not fully on the branch). Then stop the first-batch servers that still run (ports 8801, 8804, 8815, 8808, 8812, 8814 and 8818: lane 03 took 8815 and left 8806 for Phase 0's bump), and:
```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook
cd $REPO
for n in 01 02 03 04 05 06 07; do
  git worktree remove .claude/worktrees/sic-${n}a
  for b in sic/${n}a sic/cat-$n; do git rev-parse --verify -q $b > /dev/null && git branch -d $b; done
done
git worktree list | grep -c "sic-0[1-7]a"
git branch --list 'sic/0[1-7]a' 'sic/cat-0[1-7]' | wc -l
```
Expected: the branches deleted (only those that exist), then `0` and `0`.

- [ ] **Step 3: The slots and the category worktrees**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook
cd $REPO
for s in 01a 01b 01c 02a 02b 03a 03b 04a 04b 04c 04d 05a 05b 06a 06b 06c 06d 07a 07b 07c; do git worktree add -q -b sic/$s .claude/worktrees/sic-$s feat/see-inside-compare; done
for n in 01 02 03 04 05 06 07; do git worktree add -q -b sic/cat-$n .claude/worktrees/sic-cat-$n feat/see-inside-compare; done
git worktree list | grep -cE "\[sic/(0[1-7][a-d]|cat-0[1-7])\]"
git rev-parse feat/see-inside-compare
```
Expected: `27`, and the hash every slot starts from.

- [ ] **Step 4: The servers**

Start 20 background commands, one per slot, each `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-<slot> && python -m http.server <port> --bind 127.0.0.1` with the slot's port from "The slots" (01a 8801 … 07c 8820). Check: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $RUN && node pages.mjs servers; curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8800/`
Expected: `pages.mjs servers` prints nothing until `pages.json` exists (it lists only slots with pages); run it again after Step 5. The before-pictures server answers `200` (if not, restart it: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-before && python -m http.server 8800 --bind 127.0.0.1`, as a background command).

- [ ] **Step 5: The tracker's pages**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $RUN && node check-slots.mjs slots.json $REPO briefs && node pages.mjs init && node pages.mjs servers && node pages.mjs show | tail -1`
Expected: `no problem`; `159 pages`; no `down` line; `queued 159`.

- [ ] **Step 6: The ledger**

Append to `$RUN/ledger.md`: `Slots ready at <hash>: 20 slots (8801-8820), 7 category worktrees, 159 pages queued. Page work starts (Task 9).`

---
### Task 7: Build one page (the builder; 159 times)

**Files:**
- Modify (in the page's slot worktree): `animations/<category>/<slug>/index.html` (and its `README.md` where a ruling says so, with what `node tools/make-skill.mjs` then writes, if anything), one commit.
- Create (outside the repository): `$RUN/reports/<NN>-<slug>/build.md` and `build-log.md`; check rounds `$RUN/checks/<NN>-<slug>/<R>/` with `<R>.log`; kit runs `$RUN/kit/<NN>-<slug>/` and `$RUN/kit/<NN>-<slug>-<setting>/` with their logs.

**Interfaces:**
- Consumes: the page's brief, `briefs/RULINGS.md`, `briefs/OPEN-QUESTIONS.md`, the page's row in its lane's summary, `brief-rulings.md`, `rulings-159.md`, `lessons.md` (Tasks 1 to 4); the kit with its hold (Task 5) and its `--short` run (Phase 0's kit round 4, reviewed in Task 5); its slot and server (Task 6); the prompt file the tracker writes, `$RUN/reports/<NN>-<slug>/build-prompt.md` (from the template below, Task 2 Step 8); the first-batch page the brief names; the page check, the kit, the pool, `wait-log.mjs`.
- Produces: a commit `feat: <Title> shows … (See inside) and … beside … (Compare)` on `sic/<slot>` touching only the page; `build.md` whose first line is `RESULT: built <full hash>` (or `RESULT: stuck <why>`), with `SHRINKS:` and `MISTAKE:` lines that `pages.mjs done` reads.

The coordinator starts the builder (Task 9, Step 2) with one sentence; the prompt file is the builder's whole task.

- [ ] **Step 1: The builder's template**

File `$RUN/prompts/build.md`:

````markdown
# Build: {{NUM}} {{TITLE}} (See inside and Compare)

You build See inside and Compare for one page of the Animation Handbook, in that page's own CSS and script: {{NUM}}
{{TITLE}}, `{{FILE}}`. A fresh reviewer checks your work afterwards, and you may be asked to fix it, at most three times.
Work alone: start no agents, and never open the browser pane.

**Where.** The slot worktree `{{WT}}` (branch `sic/{{SLOT}}`), served at `http://127.0.0.1:{{PORT}}/`. You are its only
writer now. Change no file but `{{FILE}}` (and `{{PAGE}}/README.md`, with what `node tools/make-skill.mjs` then writes, only
where a ruling for this page says so); never switch the branch, push, merge, rebase, amend or stash; never start or stop
a server. Start every Bash call with:
`REPO={{REPO}}; RUN={{RUN}}; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; WT={{WT}}`

**Read first, in full.**
1. `$REPO/CLAUDE.md`.
2. `$REPO/docs/superpowers/specs/2026-10-13-see-inside-compare-rollout-design.md`, sections 1 and 2.
3. `$REPO/docs/superpowers/plans/2026-10-14-see-inside-compare-other-pages.md`, the section "Global Constraints" (its
   twelve acceptance lines are the reviewer's list).
4. The brief `{{BRIEF}}`: this page's requirements. Where you find a clearer picture, build it and say why in your report.
   Where the brief says "see the open question" or waits for "the coordinator's answer (summary)", the answer is already
   given: in this page's row of its lane's summary (after `RULED:`), in `$RUN/briefs/OPEN-QUESTIONS.md`, in
   `$RUN/briefs/RULINGS.md` or in this page's line of `$RUN/brief-rulings.md`; nothing waits.
5. The coordinator's rulings: `$RUN/briefs/RULINGS.md` (seven general rulings for the briefs), `$RUN/briefs/OPEN-QUESTIONS.md`
   (the rulings across lanes), the brief lane's summary that lists this page, whole (this command names it:
   `grep -l '^| {{NN}}-{{SLUG}} |' $RUN/briefs/summary-*.md`; the last cell of this page's row is its question and, after
   `RULED:`, the answer), and `$RUN/brief-rulings.md` (the general rulings and any line for {{NUM}}); `$RUN/rulings-159.md`
   (the owner's rules from the first batch); and `$RUN/lessons.md`. Where they and the brief or the Global Constraints
   differ, a ruling wins, and the owner's over the coordinator's. Read `lessons.md` again before you commit: it grows while
   you work.
6. The page `$WT/{{FILE}}` and its README's How it works, `$WT/{{PAGE}}/README.md`.
7. The first-batch page the brief names as closest, in full, from `$WT`, and its brief (`$RUN/briefs/<NN.MM>-<slug>.md`).
   If the brief names a twin that is already built (its page in `$WT` has `data-hb-modes`), read it too: your picture must
   differ from it.

**Keep a log.** Write a line per step to `{{REPORTS}}/build-log.md` as you go, so another agent could take over.

**Steps.**
1. The slot. `cd $WT && git status --short && git branch --show-current` must print only `sic/{{SLOT}}` (an empty status).
   If the status shows `{{FILE}}` changed and `{{REPORTS}}/build-log.md` exists, you take over from a builder that stopped:
   read its log, keep what fits the brief, and go on from the step it reached. Any other change: write
   `RESULT: stuck the worktree has changes I did not make` as the first line of `{{REPORTS}}/build.md` and stop.
   `curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:{{PORT}}/{{PAGE}}/` prints `200` (if not: stuck, the server is
   down). Note `wc -l < $WT/{{FILE}}` for the report.
2. The failing test. In the Watch step, between the `</div>` that closes `div.hb-step-head` and the `<div class="stage…`,
   add the switch exactly as it is here (the indentation may follow the page):

       <div class="seg hb-modes" role="group" aria-label="What the box shows" data-hb-modes>
         <button type="button" data-hb-mode="normal" class="on" aria-pressed="true">Normal</button>
         <button type="button" data-hb-mode="inside" aria-pressed="false">See inside</button>
         <button type="button" data-hb-mode="compare" aria-pressed="false">Compare</button>
       </div>

   and after the `</div>` that closes `div.hb-player`, the notes box with the brief's two notes:

       <div class="hb-mode-notes" aria-live="polite">
         <p data-hb-for="inside" hidden>(the brief's See inside note)</p>
         <p data-hb-for="compare" hidden>(the brief's Compare note)</p>
       </div>

   Run `cd $WT && node --test --test-reporter=spec tests/pages.test.js 2>&1 | grep -E "^✖ |AssertionError"`. Expected:
   only `✖ {{SLUG}}: the page's script listens for hb:mode, and its styles mark modes on the stage only` (named again under
   `✖ failing tests:`) with `AssertionError [ERR_ASSERTION]: the page script listens for hb:mode on document`.
3. Build both views in the page's own `<style>` and `<script>`, by the brief and the Global Constraints: the `hb:mode`
   listener at the top level of the script; mode rules that start `.stage[data-hb-mode="inside"]` or
   `.stage[data-hb-mode="compare"]`; copies made once, without ids, `inert` and `aria-hidden="true"`; `data-hb-caption` on
   every label and half name; drawn from the page's own numbers, so every setting changes both views; Normal untouched.
4. Tests: `cd $WT && node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)|^✔ {{SLUG}}: "`.
   Expected: among the page's lines `✔ {{SLUG}}: the mode switch is as in the template…`, `✔ {{SLUG}}: exactly two
   notes…` and `✔ {{SLUG}}: the page's script listens for hb:mode…`, and `ℹ fail 0`.
5. A page-check round R (1, then 2, 3, …). Start it as a background command (the Bash tool's run_in_background):
   `mkdir -p {{CHECKS}} && cd $WT && node $RUN/slot.mjs run b-{{NUM}} -- node tools/check-pages.mjs --base http://127.0.0.1:{{PORT}} --out {{CHECKS}}/R {{PAGE}} > {{CHECKS}}/R.log 2>&1; echo "EXIT=$?" >> {{CHECKS}}/R.log`
   then wait for it with a foreground call (timeout 600000 ms), again for as long as it says "still running":
   `node $RUN/wait-log.mjs {{CHECKS}}/R.log`
   Expected: `grep -c '^ok' {{CHECKS}}/R.log` prints `6`, and `ended with code 0`. A `FAIL` line names the problem: fix it.
6. Look, and tune. Read with the Read tool, in `{{CHECKS}}/R/`: `{{NN}}-{{SLUG}}-desktop-inside.png`,
   `{{NN}}-{{SLUG}}-desktop-compare.png`, then the same name with `phone`, `phone-reduced` and `phone-small` in place of
   `desktop`, and Normal's `{{NN}}-{{SLUG}}-desktop.png`. Change sizes, places and words until, at 1280 and at 375, each
   view reads from the picture alone before the note is read; every mode is a still picture that still teaches under
   reduced motion; the labels are apart, inside the box and 12px or more; the box keeps its size on phones and nothing
   overflows. After each change, step 4 and a new round of step 5; six `ok` each time.
7. Motion, and Normal before and after: the full kit run, in the background as in step 5:
   `mkdir -p {{KIT}} && cd $WT && node $RUN/slot.mjs run b-{{NUM}} -- node $KIT/record.mjs --base http://127.0.0.1:{{PORT}} --before http://127.0.0.1:8800 --out {{KIT}} --clean --keep-frames {{PAGE}} > {{KIT}}.log 2>&1; echo "EXIT=$?" >> {{KIT}}.log`
   then `node $RUN/wait-log.mjs {{KIT}}.log`. Expected: the line `9 pictures, 3 clips and 3 comparisons made, 0 skipped,
   0 failed`, and three lines `ok    {{NN}}-{{SLUG}}-before-1280  the stage: 0 of … pixels differ (0 visibly); Try it: 0 of
   … pixels differ (0 visibly)`, the same for `-before-375` and `-before-320` (`Try it: not on this page` on a page without
   settings; ` (the switch's row taken out)` at the end is expected on phones; a few pixels at the box's rounded corners,
   0 visibly, are fine; a page drawn from random numbers is judged by eye from the pictures in `{{KIT}}/before/`). More
   than that: Normal changed; find why and fix it first. Read three frames from the middle of the See inside clip's and of the Compare clip's kept frame
   folders (the log names them): the views move as the brief says. Then delete those frame folders. Then the short
   stages (lesson 12), in the background as in step 5:
   `cd $WT && node $RUN/slot.mjs run b-{{NUM}} -- node $KIT/record.mjs --base http://127.0.0.1:{{PORT}} --short --out {{KIT}}-short {{PAGE}} > {{KIT}}-short.log 2>&1; echo "EXIT=$?" >> {{KIT}}-short.log`
   then `node $RUN/wait-log.mjs {{KIT}}-short.log`. Expected: the line `27 short-screen pictures checked, 0 with labels cut
   or overlapping, 0 skipped, 0 failed` and `EXIT=0` (nine screens, three modes); anything cut or overlapping (a `FAIL`
   line names it): fix it (step 6's rounds again) and run it again.
8. Every setting (acceptance 7). For each choice of each setting other than its default, and each switch in Try it (never
   Loop, Slow motion, Pause or Play: playback is not a setting), a kit run with `--gallery --press "<selector>"` into
   `{{KIT}}-<short name>` (six stills: Normal, See inside and Compare at 1280 and 375), in the background as in step 5, its
   selector taken from the page's markup (for example `#speed-seg [data-ms='1000']`, or `#scale-tog`, Rotate In's "Grows
   from small" switch). Read its See inside and Compare stills at 1280: each differs from the default's. A setting that
   changes only timing or a shared rule, or one a ruling names (G1), is seen in motion instead: `--only clips --keep-frames
   --press "<selector>"`, and frames from its clips (then delete the frame folders). Your text: read the code path from the
   field to both views, and name it in the report.
9. Size: `wc -l < $WT/{{FILE}}`: about 300 lines for the demo plus about 150 for the two views; a page already past 300
   adds about 150 at most. Over that: say why in the report.
10. Read `$RUN/lessons.md` again and apply anything new. Commit, only this page:
    `cd $WT && git add {{FILE}} && git commit -m "feat: {{TITLE}} shows <the See inside picture, in plain words> (See inside) and <the first half> beside <the second half> (Compare)"`
    then `git show --name-only --format=%H HEAD`: the full hash, a blank line, and `{{FILE}}` alone. Where a ruling for this
    page also changes its README: edit `{{PAGE}}/README.md` as the ruling says, run `cd $WT && node tools/make-skill.mjs &&
    git status --short`, and `git add` the README and whatever `make-skill` changed (if anything) with `{{FILE}}` before
    that commit; `git show` then lists those files too, and nothing else.
11. The report, `{{REPORTS}}/build.md`, with these lines in this order (the first one exactly):

        RESULT: built <the full commit hash>
        SHRINKS: yes|no   (See inside scales a movement down, with faint start outlines: ruling 2)
        MISTAKE: yes|no   (Compare's first half shows a common mistake or a made-up scene: ruling 3)
        Lines: <before> → <after>
        Check: {{CHECKS}}/<last round>: six ok
        Kit: {{KIT}}: <the three before lines>
        Settings: <each setting and choice: its kit folder, and what changes in See inside and in Compare>
        Changed from the brief: <what and why, or "nothing">
        For the reviewer: <what to look at closely: the hard cases, anything you are unsure of>
        Shared change wanted: <"none", or what and why; also add it as one line to $RUN/shared-wishes.md>

    If you cannot finish (the brief asks for something the rules forbid, or a shared file is in the way), the first line
    is `RESULT: stuck <why, in one line>` instead, and the rest says how far you got.
12. Reply with three lines at most: the RESULT line, the last check round, the report's path.
````

- [ ] **Step 2: What the coordinator checks when a builder ends**

Before `pages.mjs done` (the page still holds its slot's writer place, so nothing else writes there), run:
`REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; head -3 $RUN/reports/<NN>-<slug>/build.md; git -C $REPO/.claude/worktrees/sic-<slot> show --name-only --format=%h HEAD; git -C $REPO/.claude/worktrees/sic-<slot> status --short`
Expected: `RESULT: built <hash>`, `SHRINKS: …`, `MISTAKE: …`; the hash, a blank line and the page's `index.html` alone (with its `README.md` and the files `make-skill` changed, only where a ruling for the page says so); an empty status. Then `cd $RUN && node pages.mjs done <NN.MM>` prints `<NN.MM> <slug>: built`.
If the commit lists another file: SendMessage to the builder: "Your commit `<hash>` touches `<file>`. Run `git reset --soft HEAD~1`, then `git restore --staged <file> && git checkout -- <file>` (for a file the commit created: `git restore --staged <file> && rm <file>`), commit the page alone again with the same message, put the new hash in build.md's first line, and reply." (the one time a builder undoes a commit: it is still the slot's only writer). If `RESULT: stuck`: `pages.mjs done` blocks the page; Task 9, Step 5.

---

### Task 8: Review one page, and the fix loop (the reviewer and the builder; 159 times)

**Files:**
- Modify (in the page's slot worktree, fix rounds only): `animations/<category>/<slug>/index.html` (and its `README.md` where a ruling says so), more commits.
- Create (outside the repository): `$RUN/reports/<NN>-<slug>/review-<n>.md`, `fix-<n>.md`, `fix-<n>-log.md`; check rounds `review-<n>`, `fix<n>-<k>`; kit runs.

**Interfaces:**
- Consumes: Task 7's commit and report; the prompt files the tracker writes from the three templates below (`review-<n>-prompt.md`, `fix-<n>-prompt.md`); `pages.mjs done` reads each report's first line.
- Produces: a verdict per review (`RESULT: approved` or `RESULT: changes <count>`, the twelve lines with evidence, numbered items, optional `Lesson:` and `Question for the coordinator:` lines); fix commits `fix: <Title>: …`; `fix-<n>.md` with `RESULT: fixed <hashes>`.

How the loop runs (the tracker does the counting): `built` → a fresh reviewer, review 1 → `approved` (Task 10 merges it) or `changes` → the page's own builder, resumed, fix round 1, when its slot has no other writer → `fixed` → the same reviewer, resumed, review 2 → … At most three fix rounds: a review that still asks for changes after round 3 blocks the page (Task 9, Step 5). A re-review whose reviewer cannot be resumed goes to a fresh reviewer with the whole review's template; a fix whose builder cannot be resumed goes to a fresh builder with the fix template, which tells it to read everything first.

- [ ] **Step 1: The reviewer's template**

File `$RUN/prompts/review.md`:

````markdown
# Review {{N}}: {{NUM}} {{TITLE}} (See inside and Compare)

You review one page of the Animation Handbook's See inside and Compare rollout: {{NUM}} {{TITLE}}, `{{FILE}}`. Another
agent built it; you did not. You change nothing in the repository, start no agents and never open the browser pane: you
check, then write a verdict.

**Where.** The slot worktree `{{WT}}` (branch `sic/{{SLOT}}`), served at `http://127.0.0.1:{{PORT}}/`. Its writer may be
building another page there now: read this page from git, touch nothing. Start every Bash call with:
`REPO={{REPO}}; RUN={{RUN}}; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; WT={{WT}}`

**Read.** `$REPO/CLAUDE.md`; the spec `$REPO/docs/superpowers/specs/2026-10-13-see-inside-compare-rollout-design.md`,
sections 1 and 2; the "Global Constraints" of `$REPO/docs/superpowers/plans/2026-10-14-see-inside-compare-other-pages.md`
(the twelve acceptance lines are your list); the brief `{{BRIEF}}`; the coordinator's rulings, which win over the brief and
the Global Constraints for this page: `$RUN/briefs/RULINGS.md`, `$RUN/briefs/OPEN-QUESTIONS.md`, the brief lane's summary
that lists this page (`grep -l '^| {{NN}}-{{SLUG}} |' $RUN/briefs/summary-*.md` names it; after `RULED:` in its row, the
answer) and `$RUN/brief-rulings.md`; the owner's, which win over those, `$RUN/rulings-159.md`; and `$RUN/lessons.md`; every
report in `{{REPORTS}}` (`build.md`, `build-log.md`, earlier reviews and fixes, if any); the page's change
`git -C $WT diff {{FROM}} {{TO}} -- {{FILE}}` and the whole page `git -C $WT show {{TO}}:{{FILE}}`.

**Steps.**
1. The server answers: `curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:{{PORT}}/{{PAGE}}/` prints `200` (if not,
   write `RESULT: stuck the server is down` as the first line of `{{REPORTS}}/review-{{N}}.md` and stop). Only this page
   changed, and the worktree holds it as committed: `git -C $WT show --name-only --format=%h {{COMMITS}}` lists `{{FILE}}`
   under each commit and nothing else (where a ruling for this page says so, also `{{PAGE}}/README.md` and the skill files
   `make-skill` wrote for it); `git -C $WT diff --quiet {{TO}} -- {{FILE}} && echo same` prints `same`. If not, write
   `RESULT: changes 1` with the item "the commits touch more than the page" (or "the worktree's page differs from the last
   commit") and stop.
2. Your own page check (the builder's rounds are not proof), started in the background:
   `mkdir -p {{CHECKS}} && cd $WT && node $RUN/slot.mjs run r-{{NUM}} -- node tools/check-pages.mjs --base http://127.0.0.1:{{PORT}} --out {{CHECKS}}/review-{{N}} {{PAGE}} > {{CHECKS}}/review-{{N}}.log 2>&1; echo "EXIT=$?" >> {{CHECKS}}/review-{{N}}.log`
   then `node $RUN/wait-log.mjs {{CHECKS}}/review-{{N}}.log` (timeout 600000 ms), again while it says "still running". Six
   `ok` lines: acceptance 11, with the tests the coordinator runs when it merges the page.
3. The pictures. In `{{CHECKS}}/review-{{N}}/`: `{{NN}}-{{SLUG}}-desktop-inside.png` and `-desktop-compare.png`, the same
   with `phone`, `phone-reduced` and `phone-small`, and Normal's `{{NN}}-{{SLUG}}-desktop.png` and `-phone.png`. In
   `{{KIT}}`: the nine stills, the before pictures and `{{KIT}}.log`. Three frames from the middle of each mode clip: run
   `cd $WT && node $RUN/slot.mjs run r-{{NUM}} -- node $KIT/record.mjs --base http://127.0.0.1:{{PORT}} --only clips --keep-frames --out {{KIT}}-review-{{N}} {{PAGE}} > {{KIT}}-review-{{N}}.log 2>&1; echo "EXIT=$?" >> {{KIT}}-review-{{N}}.log`
   in the background, wait for it the same way, read the frames, then delete the frame folders its log names. The short
   stages (lesson 12), in the background:
   `cd $WT && node $RUN/slot.mjs run r-{{NUM}} -- node $KIT/record.mjs --base http://127.0.0.1:{{PORT}} --short --out {{KIT}}-review-{{N}}-short {{PAGE}} > {{KIT}}-review-{{N}}-short.log 2>&1; echo "EXIT=$?" >> {{KIT}}-review-{{N}}-short.log`
   then `node $RUN/wait-log.mjs {{KIT}}-review-{{N}}-short.log`: the line `27 short-screen pictures checked, 0 with labels
   cut or overlapping, 0 skipped, 0 failed` and `EXIT=0`; read the stills (its `short/` folder) of any `FAIL` line.
   Acceptance 1, 2, 3, 6 and 8 from these.
4. The settings (acceptance 7): the builder's `{{KIT}}-*` folders and report; make a run yourself (as in step 3, with
   `--only stills --press "<selector>"` into `{{KIT}}-review-{{N}}-<short name>`) for any setting not shown convincingly.
5. The code, for what no picture shows: the `hb:mode` listener's rules (spec section 1 and the Global Constraints); the
   copies; the frame loops (elapsed time, a third in Slow motion, stopped when not needed, nothing made anew every frame);
   runs that hold their pauses with setTimeout; the keyboard, touch and screen readers in every mode; half the budget per
   half on phones; no doubled blur; one WebGL context; and each hard case of spec section 2 that this page has (the brief
   names them), and, for a twin (spec section 2), that its picture differs from its twin's. Acceptance 4, 5, 9, 10 and 12.
6. The verdict, `{{REPORTS}}/review-{{N}}.md`, its first line exactly `RESULT: approved` or `RESULT: changes <count>`; then
   the twelve acceptance lines, each ✓ or ✗ with its evidence (a file and what it shows, or a code line); then the hard
   cases; then, for changes, the numbered items, each `[Critical|Important|Minor] what, where, why, and what would fix it`.
   Every item must be fixed before you approve, except one you mark "(optional)". A design question you cannot settle is
   an item that starts `Question for the coordinator:`. If the same mistake could be on other pages, end with one line
   `Lesson: <one sentence>`.
7. Reply with three lines at most: the RESULT line, the items by severity, the report's path.
````

- [ ] **Step 2: The re-reviewer's template (the same reviewer, resumed)**

File `$RUN/prompts/rereview.md`:

````markdown
# Review {{N}} after a fix round: {{NUM}} {{TITLE}}

The builder of {{NUM}} {{TITLE}} (`{{FILE}}`) has answered the last review with a fix round. The last review is the newest
`review-*.md` in `{{REPORTS}}` before this one: yours, or findings that a category check, the final review or the
whole-site check wrote for this page. You change nothing in the repository, start no agents and never open the browser
pane. Start every Bash call with:
`REPO={{REPO}}; RUN={{RUN}}; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; WT={{WT}}`

1. The server answers: `curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:{{PORT}}/{{PAGE}}/` prints `200` (if not,
   write `RESULT: stuck the server is down` as the first line of `{{REPORTS}}/review-{{N}}.md` and stop). The fix: the
   newest `{{REPORTS}}/fix-*.md`; the page's commits, oldest first, are now {{COMMITS}}; only `{{FILE}}` changed in them
   (and, where a ruling for this page says so, `{{PAGE}}/README.md` and the skill files `make-skill` wrote for it:
   `git -C $WT show --name-only --format=%h {{COMMITS}}`), and the worktree holds the last one
   (`git -C $WT diff --quiet {{TO}} -- {{FILE}} && echo same` prints `same`).
2. Your own page check of the page now, started in the background:
   `mkdir -p {{CHECKS}} && cd $WT && node $RUN/slot.mjs run r-{{NUM}} -- node tools/check-pages.mjs --base http://127.0.0.1:{{PORT}} --out {{CHECKS}}/review-{{N}} {{PAGE}} > {{CHECKS}}/review-{{N}}.log 2>&1; echo "EXIT=$?" >> {{CHECKS}}/review-{{N}}.log`
   then `node $RUN/wait-log.mjs {{CHECKS}}/review-{{N}}.log` until it ends: six `ok`. Read the pictures each item is
   about (in `{{CHECKS}}/review-{{N}}/`), and the fix's own kit runs (`{{KIT}}`, `{{KIT}}-*`).
3. The verdict, `{{REPORTS}}/review-{{N}}.md`, in the same form as before: its first line exactly `RESULT: approved` or
   `RESULT: changes <count>`; then each item of the last review ✓ or ✗ with its evidence; then anything the fix broke, as
   new items; a `Lesson:` line if one applies.
4. Reply with three lines at most.
````

- [ ] **Step 3: The fix round's template (the page's builder, resumed)**

File `$RUN/prompts/fix.md`:

````markdown
# Fix round {{N}}: {{NUM}} {{TITLE}}

A review asked for changes to {{NUM}} {{TITLE}} (`{{FILE}}`): the newest `review-*.md` in `{{REPORTS}}`, whose first line
is `RESULT: changes …`. If you built this page, you know it. If you did not (you take over from a builder that stopped),
first read the brief `{{BRIEF}}`; the coordinator's rulings, `$RUN/briefs/RULINGS.md`, `$RUN/briefs/OPEN-QUESTIONS.md`, the
brief lane's summary that lists this page (`grep -l '^| {{NN}}-{{SLUG}} |' $RUN/briefs/summary-*.md` names it) and
`$RUN/brief-rulings.md`; the owner's, `$RUN/rulings-159.md`; then `{{REPORTS}}/build.md`, `build-log.md`, every review and
fix report there, and the page's change so far, `git -C $WT diff {{FROM}} {{TO}} -- {{FILE}}`. The rules are the build's:
the slot worktree `{{WT}}` (branch `sic/{{SLOT}}`, served at `http://127.0.0.1:{{PORT}}/`), no file but `{{FILE}}` (and
`{{PAGE}}/README.md`, with what `node tools/make-skill.mjs` then writes, only where a ruling for this page says so), no
agents, no browser pane, no push, merge, rebase, amend or stash; the plan's Global Constraints; `$RUN/lessons.md`, read
again now. Start every Bash call with:
`REPO={{REPO}}; RUN={{RUN}}; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; WT={{WT}}`
Keep a log: a line per step in `{{REPORTS}}/fix-{{N}}-log.md`.

1. `curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:{{PORT}}/{{PAGE}}/` prints `200` (if not, write
   `RESULT: stuck the server is down` as the first line of `{{REPORTS}}/fix-{{N}}.md` and stop).
   `cd $WT && git status --short` prints nothing. If it shows `{{FILE}}` changed and `{{REPORTS}}/fix-{{N}}-log.md` exists,
   you take over this round from a builder that stopped: read the log and go on. Anything else: write
   `RESULT: stuck the worktree has changes I did not make` as the first line of `{{REPORTS}}/fix-{{N}}.md` and stop.
2. Each item: fix it, or answer why not (the reviewer decides). An item that starts `Question for the coordinator:` is
   answered in `$RUN/brief-rulings.md` (a line for {{NUM}}); if no answer is there yet, say so in your report and fix the
   rest.
3. Tests: `cd $WT && node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"` gives `ℹ fail 0`.
4. Page-check rounds `fix{{N}}-1`, `fix{{N}}-2`, …, each started in the background:
   `mkdir -p {{CHECKS}} && cd $WT && node $RUN/slot.mjs run f-{{NUM}} -- node tools/check-pages.mjs --base http://127.0.0.1:{{PORT}} --out {{CHECKS}}/fix{{N}}-1 {{PAGE}} > {{CHECKS}}/fix{{N}}-1.log 2>&1; echo "EXIT=$?" >> {{CHECKS}}/fix{{N}}-1.log`
   then `node $RUN/wait-log.mjs {{CHECKS}}/fix{{N}}-1.log` until it ends: six `ok`. Read the pictures each item is about.
5. If the views changed, the full kit again, in the background:
   `cd $WT && node $RUN/slot.mjs run f-{{NUM}} -- node $KIT/record.mjs --base http://127.0.0.1:{{PORT}} --before http://127.0.0.1:8800 --out {{KIT}} --clean --keep-frames {{PAGE}} > {{KIT}}.log 2>&1; echo "EXIT=$?" >> {{KIT}}.log`
   then wait: Normal still `0 of … pixels differ (0 visibly)` for the stage and Try it at 1280, 375 and 320 (or the same
   picture by eye on a random page); read the frames you need, then delete the kept frame folders. Settings an item names:
   their `--press` runs again, into `{{KIT}}-<short name>`. The short stages again, in the background:
   `cd $WT && node $RUN/slot.mjs run f-{{NUM}} -- node $KIT/record.mjs --base http://127.0.0.1:{{PORT}} --short --out {{KIT}}-short {{PAGE}} > {{KIT}}-short.log 2>&1; echo "EXIT=$?" >> {{KIT}}-short.log`
   then `node $RUN/wait-log.mjs {{KIT}}-short.log`: the line `27 short-screen pictures checked, 0 with labels cut or
   overlapping, 0 skipped, 0 failed` and `EXIT=0`.
6. Commit, only this page, one commit or more: `cd $WT && git add {{FILE}} && git commit -m "fix: {{TITLE}}: <what changed>"`;
   `git show --name-only --format=%H HEAD` shows the hash and `{{FILE}}` alone (where a ruling for this page changes its
   README, as the build's step 10 says: the README and what `make-skill` changed may be in it too).
7. The report, `{{REPORTS}}/fix-{{N}}.md`, its first line exactly `RESULT: fixed <hash> [<hash>…]` (every commit of this
   round, full hashes, oldest first), or `RESULT: fixed none` when you changed nothing because you answered every item why
   not (the reviewer decides); then each item: what changed, or why not; the check round; the kit runs. If you cannot
   finish: `RESULT: stuck <why>`.
8. Reply with three lines at most.
````

- [ ] **Step 4: What the coordinator does with a verdict**

When a reviewer ends: `cd $RUN && node pages.mjs done <NN.MM>` prints `approved`, `changes` or `blocked`. Then read only the verdict's last lines: `grep -E "^(Lesson:|([0-9]+\. )?(\[[A-Za-z]+\] )?Question for the coordinator:|[0-9]+\. \[(Critical|Important)\])" $RUN/reports/<NN>-<slug>/review-<n>.md` (review items are numbered, so a question may start `3. Question for the coordinator:` or `3. [Minor] Question for the coordinator:`).
- A `Lesson:` line not yet in `lessons.md`: append it as `<NN.MM slug>: <the lesson>`.
- A `Question for the coordinator:` item: answer it in `brief-rulings.md` (`NN.MM slug: …`) before the fix round starts (the fix template sends the builder there).
- `approved`: Task 10, Step 1 for the page's slot.
- For the first two reviews of each category, read the whole verdict: an item that is not this page's alone becomes a lesson at once.

When a fixer ends: the same checks as Task 7, Step 2 (`head -1 …/fix-<n>.md`, the new commits list only the page, an empty status; no new commit for `RESULT: fixed none`), then `pages.mjs done <NN.MM>` prints `fixed`.

---

### Task 9: The coordinator's loop: seats, Chrome, the order of work, lessons, stops

**Files (outside the repository):** `$RUN/pages.json` (only through `pages.mjs`), `$RUN/ledger.md`, `$RUN/lessons.md`, `$RUN/brief-rulings.md`, `$RUN/slots.json` (re-cut slots).

**Interfaces:**
- Consumes: Task 6 (slots, servers, `pages.json`); the prompt files (Tasks 7 and 8); the pool (`slot.mjs`).
- Produces: every page through build, review and fix rounds to `approved`, with its agents recorded in `pages.json`; a ledger line for every start, end, merge and stop. The loop ends when `node pages.mjs show | tail -1` prints `merged 159` (plus re-cut slots' pages, which are among the 159).

- [ ] **Step 1: Count the seats**

Before every dispatch: `seats = 20 − (agents running now, every project) − 1`. The coordinator knows every agent it started; `cd $RUN && node pages.mjs running` counts this plan's. If the owner raises the app's cap (`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`), use that number for 20. The other projects (the finder, Famous effects, the ten new animations) are dispatched by the same coordinator by the same order: reviews and fix rounds of any project first; then new pages, taking turns between the projects that have pages waiting, one each.
The pool sets the pace ("Agents and Chrome"): `cd $RUN && node slot.mjs list`. When it shows all eight slots taken at this look and at one 20 minutes before, with runs waiting (agents' check or kit logs that have no line yet), start no new build this round: give `dispatch` only as many seats as there are pages waiting for a review or a fix round (`node pages.mjs show | grep -cE '  (built|fixed|changes) +r[0-9]'`), so reviews and fix rounds keep their turn. If `dispatch` still prints a `build` line (a fix whose slot is busy left its seat), put that page back at once: `cd $RUN && node pages.mjs set <NN.MM> state=queued`.

- [ ] **Step 2: Dispatch**

First the servers: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $RUN && node pages.mjs servers`. It names every slot with a page not yet merged whose server does not answer (a slot of a landed category comes back as soon as one of its pages is reopened); for each `<slot> <port> down` line, start that slot's server (a background command, as in Task 6, Step 4) before handing out any prompt. And while the probe (Task 4) has not ended, its Step 7 lines, once they exist, go in before this dispatch.
Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $RUN && node pages.mjs dispatch <seats>`
Expected: up to `<seats>` lines `<step> <NN.MM> <slug> slot <slot> <new | resume <agent id>> prompt <file>`, or `nothing to start`.
For each line, in one message (calls side by side):
- `new`: the Agent tool with `description` `<Build|Review|Re-review|Fix> <NN.MM> <slug>`, `model` `opus`, and `prompt` `You work on the Animation Handbook's See inside and Compare rollout. Read the file <file> and do exactly what it says. Reply with at most three lines.`
- `resume <id>`: SendMessage to `<id>` with the same prompt text (SendMessage is a deferred tool: load it once with ToolSearch, `select:SendMessage`).
Then, for each new agent: `cd $RUN && node pages.mjs started <NN.MM> <agent id>` (several in one Bash call, joined with `&&`). A ledger line per start: `<time> start <step> <NN.MM> <slug> <agent id>`. A call the app refuses (its cap of agents was reached; it happened on 2026-10-14) leaves its page in a working state with no agent: `cd $RUN && node pages.mjs set <NN.MM> state=<the state before>` (`queued` for a build, `built` for a review, `fixed` for a re-review, `changes` with `rounds=<n − 1>` for a fix), and it is dispatched again when a seat frees.

- [ ] **Step 3: When an agent ends**

The agent's reply names its page. Do Task 7, Step 2 (a builder; a fixer the same way, as Task 8, Step 4 says) or Task 8, Step 4 (a reviewer): each runs `cd $RUN && node pages.mjs done <NN.MM>` at its point; a ledger line `<time> <NN.MM> <slug> <state>`. If `pages.mjs done` says `no report yet`, SendMessage to the agent: "Write your report file as your prompt says, with its RESULT line first, then reply." Then Step 1 and Step 2 again; for an `approved` page, Task 10, Step 1.

- [ ] **Step 4: Every hour**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $RUN && node slot.mjs sweep; node slot.mjs list; node pages.mjs servers; curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8800/; node pages.mjs show | tail -1; df -h /c | tail -1`
- A pool slot shown with `?` and older than two hours (`ls -ld $RUN/slots/slot-N`): tell its project (the finder's, Famous effects' or the ten new animations' ledger); never remove it.
- A `<slot> <port> down` line: start that slot's server again (a background command, as in Task 6, Step 4).
- 8800 not `200`: start the before-pictures server again (Task 6, Step 4).
- Less than 30 GB free: Task 10, Step 3 for every merged page; less than 10 GB: tell the owner.
- A ledger line with the states line (`queued … · building … · approved … · merged …`).

- [ ] **Step 5: A blocked page**

`cd $RUN && node pages.mjs show | grep blocked` names it and why. Read its reports, then:
- **A technical knot** (three rounds without agreement, a rule the brief broke, a hard case solved wrongly): write a ruling line for the page in `brief-rulings.md`, then give it a second builder, once, with three more rounds: `cd $RUN && node pages.mjs set <NN.MM> state=changes builder=none limit=6 note=second-builder`. The next dispatch starts a fresh builder on the fix template (it reads every report first). If the second builder's rounds end blocked too, the coordinator either approves with only Minor items left (listed in `$RUN/final/minors.md` for the owner) or asks the owner.
- **A design question:** the coordinator decides (the owner's standing rule: decide, then let the owner judge the built page), writes the ruling line for the page in `brief-rulings.md`, adds the page to its list `For the owner's final look: <page>: <the choice made>`, and sends the page on: `set <NN.MM> state=changes` for its next fix round (a build that stopped on the question: `set <NN.MM> state=queued builder=none`, and the next builder takes over from `build-log.md`). Only when no option meets the spec, ask the owner mid-run in plain words: one question with the coordinator's suggested answer and the page's 1280 See inside and Compare screenshots from its last check round. A blocked page holds its slot's later pages back (`mergeable` stops before its commits), so the slot's landing, its category's and its final review part wait for the answer.
- **Stuck because the worktree had changes:** look (`git -C <worktree> status`, the logs), find whose they are, restore the file (`git -C <worktree> checkout -- <file>`) or hand the logged work over, then `set <NN.MM> state=queued` (a build) or `state=changes` (a fix).
- **Stuck because the server was down:** start the slot's server again (Task 6, Step 4), then `set <NN.MM> state=built reviewer=none` (a review), `state=fixed` (a re-review) or `state=changes rounds=<rounds − 1>` (a fix), and dispatch.
- **A shared file in the way:** a wish (`shared-wishes.md`) waits for integration, but a page cannot pass the check without it only if the check is wrong: Step 8.

- [ ] **Step 6: Stops: outages, pauses, usage limits**

- An agent ends on an API error or never answers: SendMessage to it, "Go on from where you stopped." If it cannot be resumed (a pause or an outage stopped it), by its page's state: `building` → `pages.mjs set <NN.MM> state=queued builder=none` (the next builder takes over from `build-log.md`); `fixing` → `set <NN.MM> state=changes builder=none rounds=<rounds − 1>` (a fresh builder takes the round over from its log); `reviewing` → `set <NN.MM> state=built reviewer=none`; `rereviewing` → `set <NN.MM> state=fixed reviewer=none` (a fresh reviewer gets the whole review). Then dispatch.
- The owner pauses the run: dispatch nothing more; stop the agents if the owner says so; write in the ledger the states line and every page in a working state. On "continue": start 8800 and the slot servers again, `pages.mjs show`, recover the stopped steps as above, dispatch.
- A usage limit: dispatch no new builds; let reviews finish; tell the owner; the finder and Famous effects pause first (coordination file); then go on with fewer seats.

- [ ] **Step 7: Re-cut a slot that has run out of pages**

When a slot has no queued page left and all its pages are merged, and a slot of any category still has three or more queued pages: open a new slot for that category, from its category branch (so the new slot's history holds nothing but its own pages), with the next free port from 8821, and move to it about half of the busiest slot's queued pages from the end of its list (never one twin without the other):

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare
cd $RUN && node pages.mjs addslot <NN><next letter> <port>
git -C $REPO worktree add -b sic/<NN><next letter> $REPO/.claude/worktrees/sic-<NN><next letter> sic/cat-<NN>
node pages.mjs move <NN.MM> <NN><next letter>
node pages.mjs show <NN>
```
(`move` once per page, in the order they had.) Start the new slot's server on its port (background). The emptied slot keeps its worktree and its server until its category lands (Task 10, Step 5): later fixes of its pages are made and checked there. A ledger line.

- [ ] **Step 8: A fix of the page check in mid-run (only if a check rule is wrong)**

If a builder or reviewer shows that the page check fails a right page, or passes a wrong one in a way the acceptance needs, and the coordinator confirms it on a fixture: lane `sic/00h` (`git -C $REPO worktree add -b sic/00h $REPO/.claude/worktrees/sic-00h feat/see-inside-compare`, server 8838), a fixture page in `$FX/sic-gen.mjs` that shows the fault (category `95-midrun`), the fix in `tools/check-pages.mjs`, the fixture categories 90 to 93 with the results of the merged Phase 0 Task 3, the seven first-batch pages six `ok` each, a fresh reviewer, then the merge into `feat/see-inside-compare`. Then into every slot and category worktree, each when it has no writer: `git -C $REPO/.claude/worktrees/<worktree> merge --no-ff feat/see-inside-compare -m "Merge the page check's fix into <worktree>"` (the tracker's `mergeable` passes such a merge commit); a slot with a writer gets it before its next dispatch. A ledger line per worktree.

- [ ] **Step 9: When `main` moves during the run**

When the finder, Famous effects or anything else goes live on `main`, the coordinator, the same day (coordination file, rule 4): merges `main` into `feat/see-inside-compare` exactly as Task 12, Step 2 does (generated files written again in the merge; the tests; `home`, and `famous` once it exists); refreshes the before-pictures checkout, `git -C $REPO/.claude/worktrees/sic-before checkout --detach main` (no project but this one changes an animation page, so Normal's before-pictures stay right); and leaves the slots and category branches as they are (they never take `main`). A ledger line.

---

### Task 10: Approved pages into their category; a finished category into the branch

**Files:** merges in `.claude/worktrees/sic-cat-NN` (branch `sic/cat-NN`) and, for a finished category, in the main checkout (`feat/see-inside-compare`); outside the repository, finding files `$RUN/reports/<NN>-<slug>/merge-finding.md` and `category-finding.md`.

**Interfaces:**
- Consumes: `pages.mjs mergeable`, `merged`, `reopen`, `parts`; the category worktrees (Task 6).
- Produces: every approved page merged into its category branch with the tests passing and the skill unchanged; each finished category checked whole (six `ok` per page) and landed on `feat/see-inside-compare` (ledger line `Category NN landed at <hash>`), which starts its final review part (Task 11).

- [ ] **Step 1: Merge a slot's approved pages**

Whenever a page becomes `approved`:
```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare
cd $RUN && node pages.mjs mergeable <slot>
```
Expected: `<hash> <NN.MM> …` (the commit to merge up to, and the pages it brings) or `nothing to merge` (a page before it is not approved yet); never a `PROBLEM:` line (if there is one, a commit touches more than its page: `git -C $REPO log --stat sic/cat-NN..sic/<slot>` finds it; send its page back with Step 2's finding file). Then:
```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare
cd $REPO/.claude/worktrees/sic-cat-NN && git status --short
git merge --no-ff <hash> -m "Merge slot <slot>: <Title>, <Title> (See inside and Compare)"
node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"
node tools/make-skill.mjs && git status --short
cd $RUN && node pages.mjs merged <NN.MM> <NN.MM>
```
Expected: an empty status; `ℹ fail 0`; an empty status again (no prompt or setting changed). A ledger line `merged <NN.MM> … into sic/cat-NN`.

- [ ] **Step 2: If the tests fail, or the skill changes**

Undo this merge only: `cd $REPO/.claude/worktrees/sic-cat-NN && git reset --hard ORIG_HEAD`. Find the page from the failing test's name (or the changed skill file). Write `$RUN/reports/<NN>-<slug>/merge-finding.md`:
```markdown
RESULT: changes 1
1. [Critical] After merging into sic/cat-NN: <the failing test's line, or the skill file that changed, and why>
```
then `cd $RUN && node pages.mjs reopen <NN.MM> reports/<NN>-<slug>/merge-finding.md`. The fix loop runs (Tasks 8 and 9); Step 1 again when it is approved.

- [ ] **Step 3: Space (only when the disk is short, Task 9, Step 4)**

For a merged page: keep its last builder round, its review rounds and its main kit folder; remove the rest:
```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare
cd $RUN/checks/<NN>-<slug> && ls -d [0-9]*/ 2>/dev/null | tr -d / | sort -n | head -n -1 | xargs -r rm -rf
ls -d $RUN/kit/<NN>-<slug>-* 2>/dev/null | grep -v -- '-review-' | xargs -r rm -rf
```

- [ ] **Step 4: A finished category: the whole category checked**

When `cd $RUN && node pages.mjs show NN | tail -1` prints only `merged <count>` (every page of the category, re-cut slots' too): the servers of the category's slots stay up until the category lands (Step 5), since a FAIL here reopens a page; start, as a background command, `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-cat-NN && python -m http.server 883<n> --bind 127.0.0.1` (01 → 8831, 02 → 8832, … 07 → 8837), and for each line `k` of `cd $RUN && node pages.mjs parts NN 8` start, as a background command, at most two parts at once while page work goes on:
`REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $REPO/.claude/worktrees/sic-cat-NN && node $RUN/slot.mjs run cat-NN-k -- node tools/check-pages.mjs --base http://127.0.0.1:883<n> --out $RUN/checks/cat-NN <that line's folders> > $RUN/checks/cat-NN-k.log 2>&1; echo "EXIT=$?" >> $RUN/checks/cat-NN-k.log`
When all have ended: `cat $RUN/checks/cat-NN-*.log | grep -c '^ok'` prints six times the category's pages, first-batch page included: six times `cd $RUN && node pages.mjs parts NN 8 | wc -w` (today 01: 162, 02: 84, 03: 96, 04: 246, 05: 114, 06: 156, 07: 138), and `grep -h '^FAIL' $RUN/checks/cat-NN-*.log` prints nothing.
A `FAIL` line: write `$RUN/reports/<NN>-<slug>/category-finding.md` (`RESULT: changes 1`, then `1. [Critical] The category check: <the FAIL line>; screenshots in $RUN/checks/cat-NN/`), `node pages.mjs reopen <NN.MM> reports/<NN>-<slug>/category-finding.md`; when the page is approved again, Step 1, then the part that holds it again. (A FAIL on the first-batch page: the coordinator reads it; it is fixed by a fresh builder in a lane of its own, reviewed, and merged into `sic/cat-NN`.)

- [ ] **Step 5: Land the category**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook
cd $REPO && git status --short && git branch --show-current
git merge --no-ff sic/cat-NN -m "Merge category NN of See inside and Compare: <count> pages"
node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"
node tools/make-skill.mjs && git status --short
git rev-parse HEAD
```
Expected: an empty status and `feat/see-inside-compare`; the merge with no conflict (a category changes only its own pages); `ℹ fail 0`; an empty status; the landing hash. Stop the category's server and its slots' servers (a later fix of one of its pages starts its slot's server again: Task 9, Step 2). Ledger: `Category NN landed at <hash>`. Task 11 starts for it.

- [ ] **Step 6: A fix to a page of a landed category**

The fix commit lands on the page's slot (Task 8), Step 1 merges it into `sic/cat-NN`, the category-check part that holds the page runs again (Step 4's command for that line, with the category's server started again), and Step 5 lands it again with the message `Merge category NN's fixes: <Title>, …`. After Task 12 has merged anything into `feat/see-inside-compare`, first merge `feat/see-inside-compare` into the page's slot (no writer there at that moment): `git -C $REPO/.claude/worktrees/sic-<slot> merge --no-ff feat/see-inside-compare -m "Merge feat/see-inside-compare into slot <slot> for a late fix"`, and into `sic/cat-NN` the same way, so the fix is checked with the final shared files.

---
### Task 11: Final review, parts 1 to 7, as each category lands, and their fixes

**Files:**
- Create and remove: worktree `.claude/worktrees/fr-NN` (detached at the category's landing commit), served on `884<n>` (01 → 8841 … 07 → 8847).
- Create (outside the repository): `$RUN/kit/gallery-NN/` (the kit's gallery of the category), `$RUN/final/part-NN-<k>.md`, `$RUN/final/consistency-NN.md`, `$RUN/final/<NN>-<slug>.md` (findings of a page), `$RUN/final/minors.md`.

**Interfaces:**
- Consumes: Task 10, Step 5 (`Category NN landed at <hash>`); the category check's screenshots `$RUN/checks/cat-NN/`; each page's brief and reports; `pages.mjs reopen`, `set`.
- Produces: per category, every page looked at again with fresh eyes, the category made consistent, every Critical and Important item fixed (through the fix loop and Task 10, Step 6), Minor items fixed with them or listed in `final/minors.md` for the owner; ledger line `Final review part NN: <pages> pages; <c> Critical and <i> Important fixed; <m> minors listed`.

- [ ] **Step 1: The frozen checkout and the category's gallery**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook
git -C $REPO worktree add --detach $REPO/.claude/worktrees/fr-NN <landing hash>
```
Start, as a background command: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/fr-NN && python -m http.server 884<n> --bind 127.0.0.1`. Then, as a background command:
`REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; cd $RUN && node slot.mjs run fr-NN -- node $KIT/record.mjs --base http://127.0.0.1:884<n> --gallery --out $RUN/kit/gallery-NN animations/<category folder> > $RUN/kit/gallery-NN.log 2>&1; echo "EXIT=$?" >> $RUN/kit/gallery-NN.log`
and `cd $RUN && node wait-log.mjs kit/gallery-NN.log` until it ends. Expected: `$RUN/kit/gallery-NN/gallery-NN.html` with Normal, See inside and Compare at 1280 and 375 for every page of the category, `0 failed`.

- [ ] **Step 2: The parts**

Split the category's pages (sorted by number, as many as `cd $RUN && node pages.mjs parts NN 8 | wc -w` counts) into groups of at most ten, as even as they come, so one reviewer can look at every picture. Dispatch one fresh final reviewer (opus) per group, as seats allow, with this prompt, its `<…>` filled in by the coordinator:

```text
You do one part of the final review of the Animation Handbook's See inside and Compare rollout: category <NN>
(<category folder>), pages <the list "NN.MM slug, …">. Their code is frozen in the detached checkout
C:/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/fr-<NN> (at <landing hash>), served at
http://127.0.0.1:884<n>/. Change no file in the repository, start no agents, never open the browser pane. RUN below is the
run folder .superpowers/sdd/2026-10-13-see-inside-compare/ of the main checkout.
Read first: CLAUDE.md; docs/superpowers/specs/2026-10-13-see-inside-compare-rollout-design.md, sections 1 and 2;
docs/superpowers/plans/2026-10-14-see-inside-compare-other-pages.md, "Global Constraints" (the twelve acceptance lines);
the coordinator's rulings RUN/briefs/RULINGS.md, RUN/briefs/OPEN-QUESTIONS.md and RUN/brief-rulings.md, and the owner's
RUN/rulings-159.md (a ruling wins over the brief and the Global Constraints for its page, the owner's over the
coordinator's). For each of your pages: its brief (RUN/briefs/<NN>-<slug>.md) and its row in the brief lane's summary that
lists it (RUN/briefs/summary-*.md: the row starts "| <NN>-<slug> |"; after RULED:, the answer); its build report
and newest review (RUN/reports/<NN>-<slug>/); its eight mode screenshots from the category check
(RUN/checks/cat-<NN>/<NN>-<slug>-<desktop|phone|phone-reduced|phone-small>-<inside|compare>.png) and Normal's
(<NN>-<slug>-desktop.png); its gallery stills (RUN/kit/gallery-<NN>/, named in gallery-<NN>.html); and its code in the
checkout. Check each page against the twelve lines with fresh eyes: the pictures first (lines 1, 2, 5, 6, 8: does each
view read from the picture alone at 1280 and at 375, before the note is read? is every mode still, and still teaching,
under reduced motion?), then the code (lines 4, 9, 10: the hb:mode listener's rules, the copies, frame loops by elapsed
time, half the budget per half on phones, one WebGL context, the page's hard cases from spec section 2). Twins of your
category must draw different pictures (spec section 2).
For a page with a Critical or Important item, write RUN/final/<NN>-<slug>.md: first line exactly "RESULT: changes <count>",
then numbered items "[Critical|Important|Minor] what, where, why, and what would fix it" (its Minor items too). For a page
with only Minor items, add each to RUN/final/minors.md as "<NN.MM slug>: <item>". Then write RUN/final/part-<NN>-<k>.md:
each page you checked, "fine" or the count of its items. Reply with three lines: pages checked, pages with Critical or
Important items, minors listed.
```

- [ ] **Step 3: The consistency pass (after the category's parts have ended)**

One fresh agent (opus) per category, with this prompt:

```text
You do the consistency pass of the final review for category <NN> (<category folder>) of the Animation Handbook's See
inside and Compare rollout: the whole category as a visitor going from page to page sees it. Change no file in the
repository, start no agents, never open the browser pane. RUN is the run folder
.superpowers/sdd/2026-10-13-see-inside-compare/ of the main checkout. Read CLAUDE.md and the spec
docs/superpowers/specs/2026-10-13-see-inside-compare-rollout-design.md, sections 1 and 2, and the coordinator's rulings
RUN/briefs/RULINGS.md, RUN/briefs/OPEN-QUESTIONS.md and RUN/brief-rulings.md (a difference a ruling made on purpose is
not a fault). Look at the category's gallery
(RUN/kit/gallery-<NN>/gallery-<NN>.html and its stills: See inside and Compare at 1280 for every page, then at 375) and read
every page's two notes in the frozen checkout .claude/worktrees/fr-<NN>. Find what differs from page to page with no reason:
the labels' look (size, backing, color), the half names' place and wording, the notes' tone and length, the phone layouts
(side by side or stacked), how the posed stills look; and twins that look alike. Where a page differs from the category's
way and it hurts reading, add an Important item to RUN/final/<NN>-<slug>.md (if the file exists, add your items and raise
the count in its first line, "RESULT: changes <count>"; if not, create it with that first line); otherwise add the item to
RUN/final/minors.md as "<NN.MM slug>: <item>". Write RUN/final/consistency-<NN>.md: what the category does alike, and what
differs. Reply with three lines.
```

- [ ] **Step 4: The findings go back to their builders**

For each `$RUN/final/<NN>-<slug>.md` of the category (its first line `RESULT: changes <count>`), the reviewer who wrote it being the agent to re-check the fix:
```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare
cd $RUN && node pages.mjs reopen <NN.MM> final/<NN>-<slug>.md && node pages.mjs set <NN.MM> reviewer=<that final reviewer's agent id>
```
Task 9 then dispatches the fix (the page's builder, resumed, or a fresh one reading every report) and the re-review (the final reviewer, resumed); an approved fix lands by Task 10, Step 6. A page whose consistency items came from the consistency pass alone gets the consistency agent as its re-reviewer.

- [ ] **Step 5: The part's end**

When every finding of the category is approved and landed: `ls $RUN/final/0<n>-*.md` lists only pages whose state is `merged` again (`node pages.mjs show NN | tail -1` prints `merged <count>`). Remove the frozen checkout (`git -C $REPO worktree remove $REPO/.claude/worktrees/fr-NN`), stop its server. Ledger: `Final review part NN: <pages> pages; <c> Critical and <i> Important fixed; <m> minors listed`.

---

### Task 12: Integration

**Files:**
- Merge `feat/ten-animations` into `feat/see-inside-compare` (in the main checkout), the version made one number and the generated files written again in the merge.
- Merge `main` into `feat/see-inside-compare` (in the main checkout), generated files written again in the merge.
- Lane `sic/00i` (only if `$RUN/shared-wishes.md` holds wishes): the files the wishes change, their tests, and the version line of every tracked animation page and of `index.html`.
- Lane `sic/int` (`.claude/worktrees/sic-int`, port 8850): `tests/pages.test.js` (the final gate and the learning path's guard), `CLAUDE.md`, `CONTRIBUTING.md`, `.github/pull_request_template.md`, `README.md`, `CHANGELOG.md`, `sitemap.xml`.

**Interfaces:**
- Consumes: the seven landed categories (Task 10) with their final review parts done (Task 11); `feat/ten-animations`, its pages built and reviewed by the ten new animations' own plan; `$RUN/shared-wishes.md`; the coordination file's merging rules.
- Produces: `feat/see-inside-compare` with all 176 pages (ledger line `Ten new animations merged at <hash>: 176 pages`); `sic/int` with the final gate flipped (`const SWITCHED = steps;`), the learning path's guard widened, the docs of spec section 6, the sitemap written again, the skill unchanged by this lane, the tests passing and the whole site six `ok` per page; ledger line `Integration lane ready at <hash>`. Task 13 reviews it and merges it.

- [ ] **Step 1: Everything has landed, and `feat/ten-animations` comes in**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; grep -c "^Category 0[1-7] landed at" $RUN/ledger.md; grep -c "^Final review part 0[1-7]:" $RUN/ledger.md; cd $RUN && node pages.mjs show | tail -1; git -C $REPO status --short`
Expected: `7` (or more, with fix landings: one line per landing), `7`, `merged 159`, an empty status.

The ten new animations join now (the coordinator's ruling: the final review, the gallery and the owner's final look then cover all 176 pages, and both go live together). Their own plan's ledger must say that their pages are approved and their reviews done; if not, ask the owner whether integration waits for them or goes on without them (without them, this task's counts stay at 166 and they land later by their own plan). Then:
```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook
cd $REPO && git log --oneline -1 feat/ten-animations && git merge --no-ff --no-commit feat/ten-animations
```
Resolve any overlap by the coordination file's map: each project keeps its own lines (the five pages whose top bar gains a Next link, 02.14 Shatter Effect, 03.16 Cube Transition, 04.41 Dynamic Island, 06.26 Infinite Zoom and 07.23 Game of Life, keep both the link and this rollout's views; `tests/pages.test.js` keeps both projects' blocks); a resolution that needs more than keeping both sides is reviewed by a fresh agent. The version: `git grep -h -o 'demo-page\.\(css\|js\)?v=[0-9]*' -- 'animations/*/*/index.html' index.html | sort | uniq -c` shows one number for each file; if the two branches had different numbers, the higher wins: every tracked animation page and the home page are set to it with Task 1, Step 4's `sed -b` line (its `10` and `11` replaced by the lower and the higher number) and checked as that step checks them. Then write the generated files again and commit them in the merge:
```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook
cd $REPO && node tools/update-sitemap.mjs && node tools/make-skill.mjs
[ -d famous ] && node tools/make-famous.mjs
git add -A -- sitemap.xml llms.txt skills $([ -d famous ] && echo famous) && git status --short | head
git commit -m "Merge feat/ten-animations: the ten new animations, with See inside and Compare, join before integration; generated files written again"
node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"
git ls-files -- 'animations/*/*/index.html' | wc -l
git grep -L 'data-hb-modes' -- 'animations/*/*/index.html' | wc -l
```
Expected: `ℹ fail 0`; `176`; `0` (the ten new pages have their two views from the start). `og-image.png` is the one `feat/ten-animations` drew for 176 (this rollout never changes the home page's top). Then `home` (and `famous` if the check knows it) through the pool against 8731, as Step 2 runs it, but into `$RUN/checks/ten-home.log` with `--out $RUN/checks/ten`: six `ok` each. Ledger: `Ten new animations merged at <hash>: 176 pages`. Their final review part (part 9) runs in Task 13.

- [ ] **Step 2: `main` into the branch (coordination file, rule 2)**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook
cd $REPO && git log --oneline -1 main && git merge --no-ff --no-commit main
```
If git says `Already up to date.`, go to Step 3. Otherwise resolve any overlap by the coordination file's map (each project keeps its own lines; a resolution that needs more than keeping both sides is reviewed by a fresh agent), then write the generated files again and commit them in the merge:
```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook
cd $REPO && node tools/update-sitemap.mjs && node tools/make-skill.mjs
[ -d famous ] && node tools/make-famous.mjs
git add -A -- sitemap.xml llms.txt skills $([ -d famous ] && echo famous) && git status --short
git commit -m "Merge main into feat/see-inside-compare before integration; generated files written again"
node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"
```
If the merge changed the top of `index.html` (the home page's first screen), also `node tools/make-social-image.mjs --base http://127.0.0.1:8731` (the main checkout served on 8731; start it as a background command, `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook && python -m http.server 8731 --bind 127.0.0.1`, if it does not answer) before the commit, and `og-image.png` in the `git add`. Expected: `ℹ fail 0`. Then the `home` check, and `famous` if `tools/check-pages.mjs` knows it, through the pool against 8731: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $REPO && node $RUN/slot.mjs run site-home -- node tools/check-pages.mjs --base http://127.0.0.1:8731 --out $RUN/checks/site home famous > $RUN/checks/site-home.log 2>&1; echo "EXIT=$?" >> $RUN/checks/site-home.log` (drop `famous` if the check does not list it), waited with `wait-log.mjs`: six `ok` each.

- [ ] **Step 3: The shared wishes, and the next version (only if there are wishes)**

Run: `grep -vc "^#" $RUN/shared-wishes.md`. `0`: go to Step 4. Otherwise the coordinator decides each wish (applied only if it helps every page and the spec allows it; else answered "no, because …" on its line), and for the kept ones: lane `sic/00i` (`git -C $REPO worktree add -b sic/00i $REPO/.claude/worktrees/sic-00i feat/see-inside-compare`, server 8839); an agent (opus) makes each test first (a test in `tests/demo-page.test.js` or `tests/pages.test.js`, or a fixture page for the check), sees it fail, makes the change, runs the tests; in the same lane, since it runs anyway, the comment in `assets/js/demo-page.js` that starts `// Do-it pages: the visitor's own press, key, wheel, touch or click inside the stage` also names a press of See inside or Compare as the visitor acting (Phase 0's Task 2 review; without wishes this comment waits, a change to that file taking a version bump); then the bump from the branch's number N to N+1 (N is `git grep -h -o 'demo-page\.js?v=[0-9]*' -- index.html` on the branch; if main brought a higher one, from that), exactly as Task 1, Step 4 does it with `10` and `11` replaced by N and N+1, its counts and line-ending check included; the whole site (Step 7, with `--base http://127.0.0.1:8839`); a fresh reviewer; the merge `git merge --no-ff sic/00i -m "Merge integration's shared changes: <what>, and the shared files at version <N+1>"`; tests; the lane removed. Ledger line.

- [ ] **Step 4: The integration lane and the final gate**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook
git -C $REPO worktree add -b sic/int $REPO/.claude/worktrees/sic-int feat/see-inside-compare
cd $REPO/.claude/worktrees/sic-int && git grep -L 'data-hb-modes' -- 'animations/*/*/index.html'
```
Expected: no output (every animation page has the switch). Start its server, as a background command: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-int && python -m http.server 8850 --bind 127.0.0.1`.

In `tests/pages.test.js` replace these four lines
```js
// The pages the switch tests cover. FINAL GATE: while the rollout runs these are the pages that have the switch; at integration
// this line becomes `const SWITCHED = steps;`, so an animation page without the switch fails
// (docs/superpowers/specs/2026-10-13-see-inside-compare-rollout-design.md, section 4, item 5).
const SWITCHED = steps.filter(d => pageOf(d).includes('data-hb-modes'));
```
with
```js
// The pages the switch tests cover: every animation page, so a page without the switch fails (the final gate of
// docs/superpowers/specs/2026-10-13-see-inside-compare-rollout-design.md, section 4, item 5).
const SWITCHED = steps;
```
Run: `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-int && node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"` → `ℹ fail 0`. See the gate bite once: `sed -i 's/ data-hb-modes>/>/' animations/02-entrance-and-exit/slide-in/index.html && node --test tests/pages.test.js 2>&1 | grep -c "✖ slide-in"` prints a number above `0`; then `git checkout -- animations/02-entrance-and-exit/slide-in/index.html`.

Then, in the same file, the learning path's guard (Phase 0's Task 1 review, deferred to integration), each change seen failing on a scratch page. In the test `'while the learning path waits, no tracked page links into learn/ and the shared stylesheet has none of its rules'`, replace
```js
  const linking = pages.filter(f => /href="(?:(?:\.\.\/)+|\/animation-handbook\/)?learn\//.test(read(path.join(ROOT, f))));
```
with
```js
  // Double or single quotes; learn/, ./learn/, ../learn/ or the site's own address, with or without its host
  const linking = pages.filter(f => /href=["'](?:\.\/|(?:\.\.\/)+|(?:https?:\/\/[^/"']+)?\/animation-handbook\/)?learn\//.test(read(path.join(ROOT, f))));
```
and after the line `  assert.ok(!fs.existsSync(path.join(ROOT, 'learn')), 'the learn/ folder is gone');` add
```js
  assert.ok(!/\blearn\b/.test(read(path.join(ROOT, 'tools', 'check-pages.mjs'))), 'the page check names no learn target');
```
Run:
```bash
cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-int
printf '%s\n' "<a href='learn/'>x</a>" > guard-a.html
printf '%s\n' '<a href="./learn/">x</a>' > guard-b.html
printf '%s\n' '<a href="https://matinmonshizadeh.github.io/animation-handbook/learn/">x</a>' > guard-c.html
git add -N guard-a.html guard-b.html guard-c.html
node --test --test-reporter=spec tests/pages.test.js 2>&1 | grep -oE "'guard-[abc]\.html'" | sort -u | wc -l
git rm -q --cached guard-a.html guard-b.html guard-c.html && rm guard-a.html guard-b.html guard-c.html
printf '// learn\n' >> tools/check-pages.mjs
node --test --test-reporter=spec tests/pages.test.js 2>&1 | grep -oE "AssertionError \[ERR_ASSERTION\]: the page check names no learn target" | sort -u
git checkout -- tools/check-pages.mjs
node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"; git status --short
```
Expected: `3` (three links the old pattern missed: single quotes, `./learn/` and the site's full address); `AssertionError [ERR_ASSERTION]: the page check names no learn target`; then `ℹ fail 0` and ` M tests/pages.test.js` alone.

- [ ] **Step 5: The docs (spec section 6), on top of what `main` brought**

Each edit is found by its current words (shown in a `text` block) and replaced or followed by new words. If `main` has changed a sentence, keep `main`'s words and add this rollout's beside them.

**`CLAUDE.md`**

(a) In "Hard rules", replace

```text
- **Keep demos under ~300 lines total.** If it's longer, the explanation has failed.
```
with
```text
- **Keep demos to about 300 lines, plus about 150 for See inside and Compare.** If it's longer, the explanation has failed.
```

(b) In "The page", replace item 3,

```text
3. **1 · Watch it** (`section.hb-watch`): help line, stage (`div.stage`), player bar (`div.hb-player`); the
   step title and help line are written per page.
```
with the four lines below, then an `html` block holding the switch and the notes box exactly as `animations/01-scroll-based/parallax-scrolling/index.html` has them on the branch (copied from that file, its two notes included):
```text
3. **1 · Watch it** (`section.hb-watch`): help line, the mode switch (`div.seg.hb-modes`: Normal, See inside, Compare),
   stage (`div.stage`), player bar (`div.hb-player`) and the two mode notes (`div.hb-mode-notes`); the step title, help line
   and notes are written per page. The switch and the notes box are exactly these (the tests pin them; each page writes its
   own two notes):
```

(c) After the part that starts `#### Reduced motion` and before `#### Try it`, add:

```markdown
#### See inside and Compare
Every animation page has two more views of its stage, chosen with the switch above it. **See inside** shows what Normal
hides (the layers, pieces, hidden shape, route, timing, trigger line, speed curve, pulls or hidden field) on the real demo,
which keeps working in that mode (scroll, Play, Replay, Pause, Show me, hover, press, drag). Each part is labeled in words
and, where it helps, a short bar or arrow, drawn from the page's own numbers so every setting changes it; where it scales a
movement down to keep every part in view, a faint outline marks where each moving part started. **Compare** shows the scene
twice, at the same size and time and driven by the same input: first (left, or top when stacked) the scene without the
effect, or a common mistake or a small made-up scene where that teaches more, then the page as the visitor set it. Each half
is named at its top in one to three words. Every setting reaches both halves except the one thing the first lacks; where a
setting makes them match, the note says so and points to Try it. Where the difference needs movement, the halves rest on a
posed moment, never on two identical pictures. The mode is not a setting: it never reaches Your settings, the prompt, the
home page's Copy prompt or the skill.

- **After a press** of See inside or Compare the shared script presses Replay (plays-once pages) or Show me (do-it pages)
  once, so the view is seen working; never under reduced motion, on scroll pages or loops, or after Normal.
- **The page's `hb:mode` listener** sits at the top level of its script; hears every press (the pressed mode too, never one
  at boot) after the buttons, notes and stage mark have changed; keeps Normal the default look (no rule on
  `[data-hb-mode="normal"]`; every mode rule starts `.stage[data-hb-mode="inside"]` or `.stage[data-hb-mode="compare"]`,
  because the buttons carry `data-hb-mode` too); draws the current state at once (scroll position, frame, open or closed,
  paused or playing); is safe to run twice; and never scrolls, moves focus, presses a control, stops Play or changes Pause.
- **Copies** are made once (at load or on first entry), with ids removed or renamed (gradients, masks, filters, `for`),
  `inert`, `aria-hidden="true"`, and are not rendered outside Compare. A canvas page splits one canvas; a WebGL page draws one
  context in two viewports, never a second context; a second simulation takes the same fixed steps as the first.
- **Labels and half names** carry `data-hb-caption`: at least 12px as drawn, 4.5:1 against their own backing, inside the
  stage, covering neither the part they name nor each other, at most six (four on phones), with amounts as a beginner says
  them ("half a second", "moves most"), never ms, px, deg or CSS names.
- **Notes:** one or two plain sentences each (at most 35 words) on what the visitor sees; the Compare note names the
  halves by their labels; when the stage looks like Normal until the visitor acts, the note ends with what to do ("Scroll the
  box or press Play to watch."). A note the script rewrites (for a setting or for reduced motion) uses the markup's own words
  for the default state.
- **Reduced motion:** every mode is a still picture that still teaches (See inside: the parts apart, a bar or arrow as long
  as each move; Compare: a posed still). No mode adds movement.
- **Phones:** the box keeps its size in every mode; Compare's halves sit side by side while each keeps about 160px of scene,
  else stacked; anything a mode adds that can be pressed is at least 44×44px (check it by hand: the page check skips the
  stage); hover and drag keep their touch equivalents. Only transform and opacity animate; on phones each half gets half the
  budget (particles, dots, tiles) and a blur is never doubled.
- **Runs:** a Replay or Show me run holds its pauses with `setTimeout`, never inside a frame loop or a `setInterval`: the
  page check sees only `setTimeout` timers and animations, and waits up to 30 s for a run.
- **Endless movement:** the page check holds every endless CSS animation in the stage (a blinking caret, a loader) while it
  judges rest and takes the mode screenshots, so it cannot see a mode that adds endless movement: never add one.
- **Done** means a reviewer who did not build the page has confirmed spec section 1's twelve acceptance lines: among them,
  each view reads from the page check's screenshots at 1280px and 375px before the note is read, and Normal at rest matches
  the page before the change pixel for pixel, with Try it, the chips and the prompt unchanged.

The hard cases (canvas and WebGL, second simulations, do-it pages, reduced motion that erases the difference, random pieces,
"Shows the …" switches, your text, snapping, flash safety, twins) and the weak views are in
`docs/superpowers/specs/2026-10-13-see-inside-compare-rollout-design.md`, section 2. Start from the page with the closest
kind of picture: Parallax Scrolling (layers), Fade In / Fade Out (a graph over time), Overlay Wipe (steps on a time line),
Magnetic Button (a hover pull), Marquee / Ticker (a common mistake), Fluid / Liquid Simulation (WebGL) or Flow Field (canvas).
```

(d) In "When asked to add a new animation", replace

```text
3. Create `index.html` by copying the closest page of the same kind and following the template above.
```
with
```text
3. Create `index.html` by copying the closest page of the same kind and following the template above, See inside and
   Compare included (see "See inside and Compare": start from the page with the closest kind of picture).
```

(e) In "Tests and the page check", the **Page check** bullet ends with

```text
It skips controls inside `.stage` when it measures touch targets, so check buttons and
  handles a demo draws there by hand.
```
(its line break may differ); after it add, in the same bullet:
```text
  On a page with the mode switch it also tries Normal, See inside and Compare at every setup (the mark, the note, the
  box's size, the labels, ids and names, rest, Play through a mode change) and saves `<name>-<setup>-inside.png` and
  `<name>-<setup>-compare.png` beside each setup's own screenshot.
```

(f) In the testing checklist, after the line `- [ ] Does it respect prefers-reduced-motion?`, add the line

```text
- [ ] Do See inside and Compare each read from the picture alone at 375px and 1280px, still under reduced motion?
```

(g) In "Page kinds and their controls", the `data-hb-demo` bullet ends with

```text
  Show me), so a do-it page never moves focus into its stage while it loads: its own `focus()` counts as the
  visitor's.
```
(its line break may differ); after it add, in the same bullet (Phase 0's Task 2 review, deferred to integration):
```text
  A press of See inside or Compare counts as the visitor acting; a page that must tell it from the arrival press sets a
  flag in its `hb:mode` listener and clears it in a microtask.
```

**`CONTRIBUTING.md`**

(a) In "Ground rules", replace

```text
- **Keep demos under ~300 lines.** If it's longer, the explanation has failed.
```
with
```text
- **Keep demos to about 300 lines, plus about 150 for See inside and Compare.** If it's longer, the explanation has failed.
```

(b) In "Adding a new technique", step 2 ends with

```text
   `rotate-in` (plays once), `aurora` (loop in CSS), `starfield` (loop in JavaScript),
   `checkmark-draw` (do it), `snap-scrolling` (scroll).
```
after it add, in the same step:
```text
   Give it See inside and Compare too (see [See inside and Compare](#see-inside-and-compare)), starting from the page
   with the closest kind of picture.
```

(c) In "The demo page", replace

```text
1. **Watch it** — the stage, with the player bar right below it.
```
with
```text
1. **Watch it** — the stage, with the mode switch above it (Normal, See inside, Compare), the player bar right below it
   and, under that, the note of the mode on show.
```

(d) At the end of the "Reduced motion" paragraph (it ends `script show the end state or a fade instead of movement.`) add the sentence `See inside and Compare are still pictures then, and pressing them plays nothing.` Then, after that paragraph and before `## Responsiveness (mandatory)`, add:

```text
### See inside and Compare

Every page has a switch above its stage: **Normal**, **See inside** and **Compare**. See inside shows what the animation
hides (layers, pieces, a hidden shape, a route, timing, a trigger line, a speed curve, pulls or a hidden field) on the real
demo, labeled in plain words; Compare shows the scene twice, at the same size and time, first without the effect (or with a
common mistake) and then as the visitor set it, each half named in one to three words. Both views live in the page's own CSS
and script and are drawn from the page's own numbers, so every setting changes them; Normal stays exactly as it was, and the
mode never reaches the settings, the prompt or the skill. Under reduced motion both are still pictures; on phones the box
keeps its size. Copy the pattern from the page with the closest kind of picture: Parallax Scrolling, Fade In / Fade Out,
Overlay Wipe, Magnetic Button, Marquee / Ticker, Fluid / Liquid Simulation or Flow Field. The rules (the `hb:mode` listener,
copies, labels with `data-hb-caption`, notes) are in CLAUDE.md's "See inside and Compare" part.
```

(e) In "Self-check before opening a PR", after the line ``- [ ] Respects `prefers-reduced-motion`.`` add the line

```text
- [ ] See inside and Compare each read from the picture alone at 375px and 1280px, and are still under reduced motion.
```

(f) In "Tests and the page check", the paragraph that starts `It opens each page at six screen setups` ends with `so check buttons and handles a demo draws there by hand.`; after it add, in the same paragraph:

```text
On a page with the mode switch it also tries Normal, See inside and Compare at every setup and saves a screenshot of the
Watch step in each (`<name>-<setup>-inside.png` and `<name>-<setup>-compare.png`).
```

**`.github/pull_request_template.md`**, in "A new technique": in the line that starts `- [ ] Copied from a page of the same kind`, replace `under ~300 lines` with `about 300 lines plus about 150 for See inside and Compare`; after that line add the line

```text
- [ ] See inside and Compare: both notes, each mode clear from its screenshot at 375px and 1280px, still under reduced motion
```

**`README.md`**, "How to use it", step 2: after `so you see exactly what you will get.` add the sentence `See inside pulls the animation apart to show how it works, and Compare shows it beside a version without the effect or with a common mistake.`

**`CHANGELOG.md`**, under `## Unreleased`, a new first bullet:

```text
- See inside and Compare on every animation page: See inside pulls the animation apart to show how it works, and Compare
  shows it beside a version without the effect or with a common mistake.
```

- [ ] **Step 6: The generated files, the tests and the commit**

```bash
cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-int
node tools/make-skill.mjs && git status --short -- skills llms.txt
node tools/update-sitemap.mjs && git diff --stat -- sitemap.xml | tail -1
node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"
git add tests/pages.test.js CLAUDE.md CONTRIBUTING.md .github/pull_request_template.md README.md CHANGELOG.md sitemap.xml
git status --short
git commit -m "feat: See inside and Compare on every animation page: the final gate, the docs and the sitemap"
```
Expected: no output for the skill (modes are not settings, the prompts did not change); the sitemap changed (every page's date moved to its last commit); `ℹ fail 0`; seven staged files and nothing else.

- [ ] **Step 7: The whole site, in parts**

For each category `NN` and each line `k` of `cd $RUN && node pages.mjs parts NN 8` (26 parts for the 176 pages: 01 has 4, 02 2, 03 3, 04 6, 05 3, 06 4, 07 4; 24 for 166 if the ten new pages stayed out), a background command, up to seven at once (the page work is over; one pool place stays for the other projects):
`REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $REPO/.claude/worktrees/sic-int && node $RUN/slot.mjs run site-NN-k -- node tools/check-pages.mjs --base http://127.0.0.1:8850 --out $RUN/checks/int <that line's folders> > $RUN/checks/int-NN-k.log 2>&1; echo "EXIT=$?" >> $RUN/checks/int-NN-k.log`
and one for `home` (and `famous` if the check lists it) the same way into `int-home.log`; each waited with `wait-log.mjs`. (Phase 0's whole-site check left `site-01.log` … `site-07.log` and `site-home.log` in `$RUN/checks/`: the `int-` names keep the two apart.)
Expected: `cat $RUN/checks/int-0*.log | grep -c '^ok'` prints six times the animation pages (`git -C $REPO/.claude/worktrees/sic-int ls-files 'animations/*/*/index.html' | wc -l`: 1056 for 176 pages), `int-home.log` six `ok` per target, and `grep -h '^FAIL' $RUN/checks/int-*.log` prints nothing. A `FAIL` on a page: its finding file and `reopen` (as Task 10, Step 4), and the fix lands by Task 10, Step 6 (on one of the ten new pages: their own plan's fix loop, then `feat/ten-animations` merged into `feat/see-inside-compare` again as in Step 1); then, in the lane, the late fixes and the sitemap written again (a conflict on a generated file: take either side, then write it again with its tool):
```bash
cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/sic-int
git merge --no-ff feat/see-inside-compare -m "Merge the late fixes into the integration lane"
node tools/update-sitemap.mjs && (git diff --quiet -- sitemap.xml || git commit -q -m "chore: the sitemap written again after the late fixes" -- sitemap.xml)
```
and that part again.

- [ ] **Step 8: The ledger**

Append: `Integration lane ready at <sic/int head>: gate flipped, docs, sitemap; whole site <count> ok, 0 FAIL; home ok`. Task 13 reviews it.

---

### Task 13: Final review, parts 8 and 9, and the integration merged

**Files:** worktree `.claude/worktrees/fr-08` (detached at the head of `sic/int`, port 8848); `$RUN/final/part-08.md`, `$RUN/final/part-09.md`, `$RUN/kit/gallery-ten/`; fixes as new commits on `sic/int`; the merge of `sic/int` into `feat/see-inside-compare`.

**Interfaces:**
- Consumes: Task 12's lane (`sic/int`) and logs (`$RUN/checks/int-*.log` and the screenshots in `$RUN/checks/int/`); the ten new animations' own plan (its run folder `.superpowers/sdd/<its start date>-ten-animations/`, with each new page's brief and reports, and its fix loop).
- Produces: the shared files, tools, tests, docs and generated files reviewed with no Critical or Important item left (part 8); the ten new pages reviewed against the twelve acceptance lines and beside their categories (part 9); `sic/int` merged; ledger line `Integration merged at <hash>`.

- [ ] **Step 1: The frozen checkout**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook
git -C $REPO worktree add --detach $REPO/.claude/worktrees/fr-08 sic/int
```
Start its server on 8848 as a background command.

- [ ] **Step 2: The part-8 reviewer, and part 9 for the ten new pages**

One fresh agent (opus) with this prompt:

```text
You do part 8 of the final review of the Animation Handbook's See inside and Compare rollout: everything but the pages
themselves. The integration is frozen in the detached checkout C:/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/fr-08
(served at http://127.0.0.1:8848/). Change no file in the repository, start no agents, never open the browser pane. RUN is
the run folder .superpowers/sdd/2026-10-13-see-inside-compare/ of the main checkout. Read: CLAUDE.md as the checkout has it;
docs/superpowers/specs/2026-10-13-see-inside-compare-rollout-design.md (all of it, section 6 above all) and
docs/superpowers/specs/2026-10-13-next-projects-coordination.md. Check, with `git -C <checkout> diff main...HEAD` limited to
each path:
 1. assets/css/demo-page.css and assets/js/demo-page.js: every change since main is one the spec or the owner asked for,
    with its test; tests/demo-page.test.js and tests/pages.test.js pin them; the final gate reads `const SWITCHED = steps;`.
 2. tools/check-pages.mjs: the mode path, the do-it path, the caption, id and name checks, the hold of endless CSS
    animations and the 30 s run wait, as their comments say, and nothing else changed for pages without the switch.
 3. The version: `git -C <checkout> grep -h -o 'demo-page\.\(css\|js\)?v=[0-9]*' -- '*.html' | sort | uniq -c`: one number
    for the stylesheet on every animation page, the same number for the script there and on the home page.
 4. The docs: every item of spec section 6 is there, in plain words, matching what the pages do: CLAUDE.md (the Watch step,
    the See inside and Compare part, the line limit, step 3 of a new animation, the page check's modes, the checklist line),
    CONTRIBUTING.md (its six places), the PR template (two lines), the README's step 2 sentence, one CHANGELOG line.
 5. Generated files: sitemap.xml written again (dates moved); llms.txt and skills/ as main has them, apart from what came
    in through a merge (`git diff main...HEAD --stat -- llms.txt skills` shows only main's own changes and the ten new
    animations' entries, from the merge of feat/ten-animations).
 6. Nothing else outside animations/ changed: `git diff --stat main...HEAD -- . ':!animations'` lists only the files above,
    the sitemap and what main's merges and the merge of feat/ten-animations brought (that project's own files: the home
    page's cards and counts, the READMEs, 404.html, the issue template, og-image.png, its test entries); no file of
    .superpowers/ or .claude/ is tracked.
 7. The whole-site logs RUN/checks/int-*.log: six ok per page (176 pages with the ten new ones), home ok, no FAIL.
 8. The merge of feat/ten-animations: every count says 176 where that project writes one, and the five pages that gained
    a Next link (02.14 Shatter Effect, 03.16 Cube Transition, 04.41 Dynamic Island, 06.26 Infinite Zoom, 07.23 Game of
    Life) kept both projects' lines.
Write RUN/final/part-08.md: first line "RESULT: approved" or "RESULT: changes <count>", then the numbered items
"[Critical|Important|Minor] what, where, why, and what would fix it". Reply with three lines.
```

Part 9, the ten new pages, beside it. First their gallery from the frozen checkout, as a background command:
`REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; cd $RUN && node slot.mjs run fr-09 -- node $KIT/record.mjs --base http://127.0.0.1:8848 --gallery --out $RUN/kit/gallery-ten animations/02-entrance-and-exit/ink-spread-reveal animations/03-page-transitions/pixelate-transition animations/04-micro-interactions/before-after-slider animations/04-micro-interactions/magnifier-lens animations/04-micro-interactions/card-deck-swipe animations/06-3d-advanced/water-ripple animations/06-3d-advanced/audio-visualizer animations/07-ambient-background/ken-burns animations/07-ambient-background/fire-effect animations/07-ambient-background/lightning > $RUN/kit/gallery-ten.log 2>&1; echo "EXIT=$?" >> $RUN/kit/gallery-ten.log`
waited with `cd $RUN && node wait-log.mjs kit/gallery-ten.log`. Expected: `60 pictures, 0 clips and 0 comparisons made, 0 skipped, 0 failed` (Normal, See inside and Compare at 1280 and 375 for each page; one gallery file per category in `$RUN/kit/gallery-ten/`). Then one fresh final reviewer (opus) with Task 11, Step 2's prompt, filled in for these pages: its first sentence names "the ten new animations, merged from feat/ten-animations: 02.15 ink-spread-reveal, 03.17 pixelate-transition, 04.42 before-after-slider, 04.43 magnifier-lens, 04.44 card-deck-swipe, 06.27 water-ripple, 06.28 audio-visualizer, 07.24 ken-burns, 07.25 fire-effect, 07.26 lightning"; the checkout is `fr-08` at the head of `sic/int`, served at http://127.0.0.1:8848/; each page's brief, build report and newest review come from the ten new animations' run folder (`.superpowers/sdd/<its start date>-ten-animations/`, where its ledger names them) in place of RUN/briefs and RUN/reports; its eight mode screenshots and Normal's from the whole-site check (`RUN/checks/int/<NN>-<slug>-…png`) in place of the category check's; its stills in `RUN/kit/gallery-ten/`; one more check, that each page reads like the other pages of its category (`RUN/kit/gallery-<NN>/` and `RUN/final/consistency-<NN>.md`); and its files `RUN/final/ten-<NN>-<slug>.md` (a page with a Critical or Important item), `RUN/final/minors.md` and `RUN/final/part-09.md`.

- [ ] **Step 3: Fixes**

For `RESULT: changes` in part 8: an agent (opus) fixes each item in `sic-int` (new commits; a shared file's fix test first; a page's fix goes through Task 10, Step 6 and is merged into `sic/int` as in Task 12, Step 7, the sitemap written again there), reruns the tests and the whole-site parts the fix can touch; the part-8 reviewer (resumed) re-checks on a new frozen checkout at the new head (`git -C $REPO worktree remove $REPO/.claude/worktrees/fr-08` and Step 1 again). For each `RUN/final/ten-<NN>-<slug>.md` of part 9: the ten new animations' own fix loop (the page's builder fixes it on its lane, its reviewer re-checks), `feat/ten-animations` takes the approved fix, the coordinator merges `feat/ten-animations` into `feat/see-inside-compare` as Task 12, Step 1 does and `feat/see-inside-compare` into `sic/int` as Task 12, Step 7 does (the sitemap written again there), and the part-9 reviewer (resumed) re-checks on a new frozen checkout. At most three rounds each; then the coordinator decides, as for a page.

- [ ] **Step 4: Merge**

When part 8's last verdict is `RESULT: approved` and every finding of part 9 (`$RUN/final/ten-*.md`) is fixed and merged into `sic/int` (Step 3):
```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook
cd $REPO && git status --short && git merge --no-ff sic/int -m "Merge integration: See inside and Compare on every animation page (the final gate, the docs, the sitemap)"
node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"
node tools/make-skill.mjs && git status --short
git -C $REPO worktree remove $REPO/.claude/worktrees/fr-08
```
Expected: an empty status before; `ℹ fail 0`; an empty status after. Stop the 8848 and 8850 servers. Ledger: `Integration merged at <hash>`.

---

### Task 14: The owner's final look

**Files (outside the repository):** `$RUN/rulings-all.json`, `$RUN/kit/final-gallery/<NN>/`, `$RUN/kit/final-clips/`.

**Interfaces:**
- Consumes: Task 13's merge; `pages.mjs rulings`; the kit; the owner's preview.
- Produces: the owner's verdict in `$RUN/ledger.md`: publish, or the changes (each sent back through the page loop or a lane, then shown again).

- [ ] **Step 1: The owner's preview**

Start the preview of the main checkout (Claude Browser `preview_start` with the name `static-site`: `python -m http.server 8731` from `.claude/launch.json`; it opens the browser pane, where the owner looks). Check: `curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8731/animations/04-micro-interactions/drag-to-reorder/` prints `200`.

- [ ] **Step 2: The gallery of every page**

Seven background commands, one per category (the pool takes them as it can; each category folder holds its pages, the ten new ones included: 176 in all):
`REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; cd $RUN && node slot.mjs run kit-gallery-NN -- node $KIT/record.mjs --base http://127.0.0.1:8731 --gallery --out $RUN/kit/final-gallery/NN animations/<category folder> > $RUN/kit/final-gallery-NN.log 2>&1; echo "EXIT=$?" >> $RUN/kit/final-gallery-NN.log`
Expected when all have ended: seven files `$RUN/kit/final-gallery/NN/gallery-NN.html`, each log `0 failed`.

- [ ] **Step 3: Clips of two pages per category**

Run: `REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; cd $RUN && node pages.mjs rulings > rulings-all.json && head -3 rulings-all.json`
Then, as a background command (about half an hour):
`REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook; RUN=$REPO/.superpowers/sdd/2026-10-13-see-inside-compare; KIT=$REPO/.superpowers/sdd/2026-10-13-learn-pilot/review-kit; cd $RUN && node slot.mjs run kit-final -- node $KIT/record.mjs --base http://127.0.0.1:8731 --before http://127.0.0.1:8800 --rulings $RUN/rulings-all.json --out $RUN/kit/final-clips --clean --keep-frames animations/01-scroll-based/snap-scrolling animations/01-scroll-based/scroll-image-sequence animations/02-entrance-and-exit/shatter-effect animations/02-entrance-and-exit/split-text-reveal animations/03-page-transitions/view-transitions-api animations/03-page-transitions/page-curl animations/04-micro-interactions/drag-to-reorder animations/04-micro-interactions/gooey-menu animations/05-text-typography/text-particles animations/05-text-typography/typewriter-effect animations/06-3d-advanced/cloth-simulation animations/06-3d-advanced/gpgpu-particle-system animations/07-ambient-background/fireworks animations/07-ambient-background/abstract-geometric-motion > $RUN/kit/final-clips.log 2>&1; echo "EXIT=$?" >> $RUN/kit/final-clips.log`
Expected: `126 pictures, 42 clips and 42 comparisons made, 0 skipped, 0 failed` (Normal before and after at 1280, 375 and 320 for each of the fourteen pages, each line giving the stage and Try it). (The coordinator may swap a page for one the final review found more on; two per category either way.)

- [ ] **Step 4: The coordinator looks first**

Read, with the Read tool, the 1280 See inside and Compare stills of every page in the seven galleries, and one frame from the middle of each clip (the kept frame folders; delete them after). Anything that does not read from the picture alone goes back as a fix round (a finding file and `reopen`) before the owner sees it.

- [ ] **Step 5: Show the owner**

Navigate the browser pane to a few pages (one per category, starting with `/animations/04-micro-interactions/drag-to-reorder/`). Send the owner, in very short plain words: that every page, all 176 with the ten new animations, now has See inside and Compare; the path of the seven gallery files and of `$RUN/kit/final-clips/index.html` (they open from disk); that the pages are open in the browser pane; the list in `$RUN/final/minors.md` and the "For the owner's final look" lines of `brief-rulings.md`, each in one line; the next launch post's date (coordination file, rule 7); and one question: "Publish See inside and Compare on all pages, with the ten new animations, now, or change something first?" Nothing is pushed.

- [ ] **Step 6: The owner's answer**

Write it in the ledger. A change to pages goes back through the page loop (a finding file per page, `reopen`, Tasks 8 to 10; for one of the ten new pages, their own plan's fix loop and `feat/ten-animations` merged in again as in Task 12, Step 1), a shared change through a lane like `sic/00i` with its version number; then Steps 2 to 5 for the changed pages, until the owner says publish. Ledger: `Owner approved See inside and Compare and the ten new animations for release on <date>`.

---

### Task 15: Release on the owner's word, and the clean-up

**Files:** `main` (in the release worktree), pushed; every rollout worktree, branch, server and temp folder removed.

**Interfaces:**
- Consumes: Task 14's approval; the coordination file's merging and releasing rules.
- Produces: the rollout and the ten new animations live together on GitHub Pages; the machine clean; the ledger's last line.

- [ ] **Step 1: The day**

From 2026-10-23 to 2026-10-26 nothing merges into `main` without the owner's explicit word for that day (coordination file, rule 7). The owner's word for this release is in the ledger with its date.

- [ ] **Step 2: `main` into the branch once more**

If `main` moved since Task 12, Step 2 (`git -C $REPO log --oneline feat/see-inside-compare..main | wc -l` is above `0`): repeat Task 12, Step 2, then the tests, `home` and `famous`.

- [ ] **Step 3: Merge into `main` in the release worktree, check, push**

```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook
git -C $REPO worktree list | grep -c "/release "
```
If `0`: `git -C $REPO worktree add $REPO/.claude/worktrees/release main`. Then:
```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook
cd $REPO/.claude/worktrees/release && git status --short && git branch --show-current
git merge --no-ff --no-commit feat/see-inside-compare
node tools/update-sitemap.mjs && node tools/make-skill.mjs
[ -d famous ] && node tools/make-famous.mjs
git add -A -- sitemap.xml llms.txt skills $([ -d famous ] && echo famous) && git status --short | head
git commit -m "Merge See inside and Compare on every animation page, and the ten new animations"
node --test --test-reporter=spec "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"
```
Expected: `main`; `ℹ fail 0`. Start, as a background command, `cd /c/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.claude/worktrees/release && python -m http.server 8990 --bind 127.0.0.1`, then `home` (and `famous`) through the pool against 8990: six `ok` each. Then `git -C $REPO/.claude/worktrees/release push origin main`.

- [ ] **Step 4: Live**

A few minutes after the push: `curl -s https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/drag-to-reorder/ | grep -c data-hb-modes` prints `1`, and the same for a new page, `…/animations/07-ambient-background/lightning/` (try again for up to ten minutes while GitHub Pages builds). Tell the owner it is live, in one line. Ledger: `Live at <main hash> on <date>`.

- [ ] **Step 5: Clean-up**

Stop every server of this plan (8800, 8801–8850, 8990, 8731 if the owner is done). Then:
```bash
REPO=/c/Users/matin/OneDrive/Desktop/Projects/animation-handbook
cd $REPO
for w in $(git worktree list --porcelain | sed -n 's/^worktree //p' | grep -E '/\.claude/worktrees/(sic-|fr-)'); do git worktree remove "$w"; done
for b in $(git branch --format='%(refname:short)' | grep '^sic/'); do git branch -d "$b"; done
git worktree list | grep -cE '/(sic-|fr-)'
```
Expected: `0` (every `sic/` branch is merged, so `-d` takes each; one that is not: stop and look). The run folder stays (it is the record). Ask the owner before removing the temp folders: list them with their sizes (`du -sh "$TEMP"/hb-chrome-* "$TEMP"/hb-kit-* "$TEMP"/sic-run-* "$TEMP"/sic-repo-* "$TEMP"/sic-pool-* 2>/dev/null | tail -20`: the page check's and the kit's Chrome folders, and those of the tracker's and the pool's tests), and remove them on the owner's OK. Last ledger line: `Done: See inside and Compare live on every page, with the ten new animations; worktrees and branches removed`. The next project follows the coordination file's order: the tab pass (the ten new animations went live with this release).

---

## Self-review

**Spec coverage (the 159 pages, integration, the final review, the owner's look, release):**

| Spec requirement | Task |
|---|---|
| §3 the owner approves the first batch or asks for changes; changes applied (a shared one with one more bump) before the rest starts | Task 1 (with the previous plan's Task 14, Step 6) |
| §3 "while the owner looks, the leads write the other 159 briefs (no code)" | Task 3 (checking them; the rulings given while they were written stand); Tasks 0, 2, 4, 5 also run then |
| §2 the brief from the survey row; the builder treats it as a suggestion; tuning from the mode screenshots; Normal before and after | Task 3; Task 7's template (steps 3, 6, 7) and G2 |
| §1 the switch, notes, listener rules, copies, captions, reduced motion, phones; the twelve acceptance lines | Global Constraints; Task 7's template; Task 8's review template (the twelve lines with evidence) |
| §2 hard cases: canvas and WebGL, second worlds, do-it pages, reduced motion that erases Compare, random pieces, "Shows the …" switches, "Without" settings, your text, Snap Scrolling, flash safety, twins | Global Constraints (copies, motion); Task 3's checklist (item 8) and twins check; the slot table (second worlds first, twins together); Task 8's review step 5 |
| §2 weak views (rows marked \*) | Task 3's checklist (item 3) |
| §7 one builder, then one fresh reviewer (never the builder), both on the strongest model; at most three fix rounds, then escalation (a design question: the coordinator decides and the owner judges the built page, asked mid-run only when no option meets the spec) | Global Constraints (Agents); Tasks 7, 8; the tracker's three-round limit; Task 9, Step 5 |
| §7 slots: 20 (01 three, 02 two, 03 two, 04 four, 05 two, 06 four, 07 three), worktrees `sic-<NN><x>`, ports from 8801, one commit per page touching only its `index.html` (and its README where a ruling says so: Zoom Transition's, the one exception, in the ledger), twins share a slot, hard and heavy first | "The slots"; Task 6; Task 7's template (steps 10, 11); `check-slots.mjs` |
| §7 the lead merges a slot when its pages so far are approved, into `sic/cat-NN`, with the tests and the category's page check; the coordinator merges categories | Task 10 (`mergeable` never cuts a page; tests and the skill at every merge; the whole category checked once it is complete) |
| §7 machine: eight checks at once for every project, `slots/slot-1…8`, headless only, one server and scratch folder per slot, no `git stash`, temp folders removed with the owner's OK, the main checkout never switched; on a usage limit the finder and Famous effects pause first | Global Constraints (Machine); "Agents and Chrome"; Task 9, Steps 4 and 6; Task 15, Step 5 |
| §7 integration: merge, the final gate, the tests, `home`, `famous`, the whole site, `make-skill` unchanged, `update-sitemap`, the docs | Task 12 (which first merges in `feat/ten-animations`: the coordinator's ruling) |
| §7 the final review in eight parts on frozen detached checkouts, each started as its category lands; builders fix their own findings | Task 11 (parts 1 to 7, split into groups of at most ten pages plus a consistency pass), Task 13 (part 8; part 9 for the ten new pages) |
| §7 the owner's final look: the gallery of every page (176 with the ten new animations), clips of two pages per category, the site served locally | Task 14 |
| §7 published on the owner's word, all at once (with the ten new animations), by the coordination file's release rule | Task 15 |
| §6 docs: CLAUDE.md (Watch step, the new part, line limit, step 3, the page check, the checklist), CONTRIBUTING.md, the PR template, README step 2, CHANGELOG; sitemap; skill unchanged | Task 12, Steps 5 and 6; Task 13 checks them |
| §4 item 7: after the first batch, a lane needing a shared change writes it in its ledger; the coordinator applies them at integration with one more bump | Global Constraints (Version); `shared-wishes.md`; Task 12, Step 3 |
| The previous plan's "After this plan": the verdict applied first; slots and `sic/cat-NN` take the branch's head; the briefs with the hard cases; the slot lists; the known risks (endless CSS animations, idle timers, runs held in frame loops, snapping, four labels on phones, pages past 300 lines); integration | Task 1; Task 6 (fresh slots from the head); Task 3; "The slots"; the page check's hold (Phase 0), Task 5 (the kit's hold), Task 4 and `lessons.md`; Task 12 |
| Coordination: branches, ports, the file map, versions, merges with `--no-ff`, main merged in before a release, generated files never merged by hand, the launch-post window | Global Constraints (Places, Merges); "Who touches which file"; Task 0 (the coordination file's Order, branches and ports); Task 12, Steps 1 and 2; Task 15 |

**Placeholder scan:** every code step shows its code (the tracker, its tests, the slot table, the checkers, the probe, the kit's hold, the learning path's guard); the prompt templates are complete, and their `{{…}}` names are the tracker's values (Task 2, Step 10 fills them and finds none left); the `<…>` marks in commands and prompts are the coordinator's inputs of the moment (a page number, a hash, a port from the tables), each named where it comes from.

**Names used across tasks:** `pages.mjs` (`init`, `show`, `dispatch`, `started`, `done`, `set`, `addslot`, `move`, `mergeable`, `merged`, `reopen`, `parts`, `running`, `servers`, `rulings`), its states (`queued`, `building`, `built`, `reviewing`, `changes`, `fixing`, `fixed`, `rereviewing`, `approved`, `merged`, `blocked`) and report files (`build.md`, `review-<n>.md`, `fix-<n>.md`, `…-prompt.md`); `wait-log.mjs`, `check-slots.mjs`, `extract-prompts.mjs`, `probe.mjs` (`add`, `read`); `slot.mjs run` (previous plan); `record.mjs` with `--base`, `--before`, `--out`, `--clean`, `--keep-frames`, `--only`, `--press`, `--gallery`, `--rulings` (previous plan) and `--short` (Phase 0's kit round 4); `SWITCHED` (the final gate); `G1`–`G5` (brief-rulings.md); `R<k>` (rulings-159.md). The run folder `$RUN`, the kit `$KIT` and the fixtures `$FX` are the same paths in every task.
