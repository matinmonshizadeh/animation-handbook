# Guided-Steps Rollout: Wrap-up — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the guided-steps rollout now that all seven categories are live: retire the old page system, bring the docs in line with the new pages, apply the shared-file fixes the category reviews collected, and make every per-frame loop run at the same speed on every screen.

**Architecture:** Independent tasks run side by side, each in its own worktree from `main` and its own branch, each with a builder, a separate reviewer and fix rounds; each lands on `main` and is pushed when checked (standing permission). Tasks that touch the same files (`assets/`, `tests/`) run one after the other in one worktree. A last whole-site check and review closes the plan.

**Tech Stack:** Plain HTML, CSS and vanilla JavaScript (no build step); Node's built-in test runner; `tools/check-pages.mjs` (Node and the local Chrome); git worktrees.

**Specs and references:** `docs/superpowers/specs/2026-09-27-demo-page-rollout-design.md` (step 8, Wrap-up), `docs/superpowers/specs/2026-09-27-demo-page-guided-steps-design.md`, the coordinator notes `.superpowers/sdd/2026-09-29-demo-page-rollout-parallel/coordinator-notes.md` (git-ignored), the frame-rate survey `.superpowers/sdd/2026-09-29-demo-page-rollout-parallel/wrapup/frame-rate-survey.md` (git-ignored), and the category final reviews saved under `.superpowers/sdd/2026-09-29-demo-page-rollout-parallel/lanes/<category>/`.

## Global Constraints

- CLAUDE.md governs: plain HTML/CSS/vanilla JS, no dependencies, transform and opacity for motion, 60 fps on a mid-range phone (phone fallbacks at `(max-width:600px),(max-height:500px)`), text at least 4.5:1, 44px touch targets, `prefers-reduced-motion` respected, pages near ~300 lines.
- Owner rulings stay: reduced motion greys out Loop and Slow motion with a short note, loops start paused, Replay/Play/Show me still work; stage text uses the site font; Pause stops at once; the visitor must see the effect; after a jump a scroll page shows the right state at once.
- A behaviour change must leave every page looking and behaving exactly as today at 60 Hz on a laptop and a phone, unless the task says what changes.
- Shared files are linked with `?v=N`; any change to `assets/css/demo-page.css` or `assets/js/demo-page.js` bumps N on every page that links them (today `?v=4`), in the same task.
- Every task ends green: `node --test "tests/*.test.js"` and `node tools/check-pages.mjs --base http://127.0.0.1:<port> <folders the task touched>` (6 `ok` lines per page).
- One commit per page or per concern; never amend, never reset. Checks run in the agent's own headless Chrome over the DevTools protocol, never in the shared in-app Browser pane.

---

### Task 1: Frame-rate independence (in flight)

Per-page fixes from the frame-rate survey (sections 3, 6, 7, 10): steps scale with `dt / FRAME` (`FRAME = 1000/60`, `dt` clamped to 50 ms), smoothing uses `1 - Math.pow(1 - k, dt / FRAME)`, loops start and re-arm with a null sentinel or one 60 Hz frame, gates stay as draw caps, trail fades scale with `dt`, stills keep a step of 1, README and prompt words follow the code. Branches: `feat/fr-ambient` (6 pages), `feat/fr-3d` (7), `feat/fr-micro` (3, live), `feat/fr-scroll` (4), and `feat/fr-transitions` for Elastic Transition's live spring (fixed 1/120 s sub-steps from an accumulator; re-measure the Bounciness table so the overshoot at 60 Hz stays today's). The home page's three card previews (starfield, particles, flow in `index.html`) get the same treatment in Task 5.

### Task 2: Docs — one-liners, CLAUDE.md, CONTRIBUTING.md

**Files:** `README.md`, `animations/*/README.md` (the one-line list only, plus any general paragraph that is wrong about the pages), `CLAUDE.md`, `CONTRIBUTING.md`.

- [ ] Every page's one-liner in the root README and in its category README matches that page's current description (the page's `<meta name="description">`, which the home card and lede share), in the same order as the home page.
- [ ] CLAUDE.md and CONTRIBUTING.md describe the current page: the guided-steps layout (Watch it, Try it, Copy the prompt, What it is, Good for / Avoid on, Similar animations), the shared files `assets/css/demo-page.css` and `assets/js/demo-page.js` with the `?v=N` rule, the four page kinds (`data-hb-kind="once|loop|do|scroll"`) and their controls, the copyable prompt (plain words, no code, at most 130 words), the site font, the tests (`node --test "tests/*.test.js"`) and the page check (`node tools/check-pages.mjs`). Every mention of `handbook.css`, `handbook.js`, the old side panel or the migration tool goes. The existing hard rules (one folder per animation, README sections, taxonomy, responsiveness, writing style) stay.

### Task 3: Retire the old page system

**Files:** delete `assets/css/handbook.css`, `assets/js/handbook.js`, `tests/handbook.test.js`, `tools/migrate-demo.js`, `tests/migrate.test.js`, `tests/fixtures/legacy-demo.html`, `assets/fonts/brico-*.woff2`, `assets/fonts/plex-*.woff2`, `samples/demo-page-design.html`; create `tests/helpers/markdown.js`; modify `tests/pages.test.js`, the comment in `assets/js/demo-page.js` that names `handbook.js`.

- [ ] Move `sections(md)` and `table(text)` (and the helpers they call, such as `escapeHtml`) from `assets/js/handbook.js` into `tests/helpers/markdown.js` unchanged in behaviour; `tests/pages.test.js` requires them from there.
- [ ] Delete the files above after confirming nothing else references them (`samples/home-redesign.html` keeps `samples/fonts/`).
- [ ] Tests green; the site check on one page per category still green.

### Task 4: Shared-file fixes (after Task 3, same worktree)

**Files:** `assets/js/demo-page.js`, `assets/css/demo-page.css`, every page's `?v=` links, `tests/`, and page files only where a fix needs them (FLIP Technique).

- [ ] **Scroll range before the arrival Play:** Play reads the scroller's range again on every frame (or waits for `document.fonts.ready` before the arrival run), so a late web font cannot stop Play short of the end (Cover Card, Scrollytelling, Progress Bar at 320px on a slow link stopped at 91%).
- [ ] **Arrival guard:** the arrival press of Show me is skipped when the visitor has already acted in the stage (a trusted `hb:input`, or a trusted `focusin` inside the stage) before it fires. The per-page guards (Checkmark Draw, Focus Ring, Error Shake) may stay.
- [ ] **Reduced motion on scroll pages:** a short note in the player bar says the effects follow the scroll without animating, in the style of the existing reduced-motion note.
- [ ] **Short laptop windows:** `.hb-page .stage.hb-grow` follows the same 260px short-window minimum as other stages; FLIP Technique's cards get short-window sizes (its inline heights move into classes) so its player bar is on the first screen at 1280×590 and 1024×600.
- [ ] Bump `?v=4` to `?v=5` on every page; tests updated.
- [ ] Check every category (all 129 pages: 774 `ok` lines).

### Task 5: Home page card previews

**Files:** `index.html` (the card preview scripts only).

- [ ] The starfield, particles and flow previews step with `dt / FRAME` (clamped, null sentinel), matching today's look at 60 Hz.

### Task 6: Check tool hardening

**Files:** `tools/check-pages.mjs` and its tests if any.

- [ ] The reduced-motion "Show me visibly moves the stage" check captures straight after the click (or checks page state), so it no longer misses under heavy CPU load.
- [ ] The temporary Chrome profile is removed with retries (Windows file locks), and any profile the run leaves is named in its output.

### Task 7: Sheet sync, final check and review

- [ ] One docs pass syncs the content sheets under `docs/superpowers/plans/` with the wording the Task 1 branches changed (each builder's report lists the lines).
- [ ] Whole-site check (774 `ok` lines), tests, a final whole-site review (Opus) of everything the wrap-up changed, one fix wave, one scoped re-review, publish.
- [ ] Clean up: leftover worktrees and branches, stray local servers, stale headless Chrome processes and `%TEMP%\hb-chrome-*` profiles.
