# Guided-Steps Rollout: The Last Five Categories, in Parallel — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the last 102 demo pages — Ambient & Background (17), 3D & Advanced (18), Micro-Interactions (29), Page Transitions (12) and Scroll-Based (26) — to the guided-steps page, running the five categories side by side while keeping every quality step, and publish each category as soon as it is finished and checked.

**Architecture:** One lane per category, each in its own git worktree and branch with its own static server, so lanes never touch each other's files. Each lane runs the same pipeline as Text & Typography: a content sheet, then pairs of pages (a builder, a separate reviewer, fixes, a re-review), then a browser check of the whole category, a final category review and one fix wave, then merge to `main` and publish. The shared files (`assets/`, `tests/`, `tools/`) are frozen in the lanes: only the coordinator changes them, on `main`, and merges `main` into the lanes. Ambient & Background needs only the loop kind and starts first; the other four lanes start when the do-it and scroll kinds (`2026-09-29-demo-page-kinds-do-and-scroll.md`) are merged.

**Tech Stack:** Plain HTML, CSS and vanilla JavaScript (no build step); Node's built-in test runner; `tools/check-pages.mjs` (Node and the local Chrome); git worktrees.

**Specs and references:** `docs/superpowers/specs/2026-09-27-demo-page-rollout-design.md` (four kinds, markers, special cases, category order), `docs/superpowers/specs/2026-09-27-demo-page-guided-steps-design.md`, the Text & Typography plan and content sheet (`2026-09-28-demo-page-rollout-text-typography.md`, `2026-09-28-text-typography-content.md` — the model for sheets and conversions, with its preamble's owner decisions), the do-it/scroll plan above, and the page survey (session scratchpad `rollout/inventory-A.md`: Scroll-Based and Page Transitions; `inventory-B.md`: Micro-Interactions; `inventory-C.md`: 3D & Advanced and Ambient & Background).

## Global Constraints

- Everything in the Text & Typography plan's Global Constraints still applies (plain HTML/CSS/JS; one version of the shared files everywhere; settings and prompt rules; touch targets; hover only inside `@media (hover: hover)` with a tap equivalent; plain words; no code on the page; each category keeps its own `--ui-accent` and category line `0N.NN · Category`).
- Owner decisions that bind every page: stage text uses the site font (only typing effects may use a typewriter font); reduced motion greys out Loop and Slow motion, starts loops paused and runs nothing by itself, while Replay, Pause/Play, Show me, Reset, Play and Back to top still work; scroll and do-it pages show themselves once on arrival; Pause stops at once on every loop (the Text sheet preamble's `wait()`/`freeze()`/`thaw()` helper for page loops, whose `thaw()` finishes rather than plays a transition caught at its end; the "css" Pause for `@keyframes` loops); long names in the top bar are cut with "…".
- The Try it help line comes from the page kind, the same on every page: plays once "Change a setting and the animation plays again."; loop "Change a setting and see the difference as it moves."; do it "Change a setting, then try it again or press Show me."; scroll "Change a setting, then scroll again or press Play."
- Lessons from the Text & Typography reviews, now rules for every conversion:
  - Replay restarts the animated pieces themselves (rebuild or reset them hidden, force a reflow, then show them); never a double requestAnimationFrame.
  - A plays-once page checks Loop at the moment the last step would leave the screen (after its hold), not earlier.
  - Use the pruning `later()` (a fired timer's id leaves `timers`); every play clears all timers.
  - Typed text: `trim()` decides blankness, blank falls back to the default, non-blank text stays as typed; added with `textContent`/`createTextNode` only.
  - Text measured for fitting is measured again after `document.fonts.ready`.
  - Text split into letters or changed every frame or keystroke gets `role="img"` and an `aria-label` with the real text; no live region on it.
  - Page loops never call `pause()`/`play()` on CSS keyframe animations (that detaches them from `animation-play-state`, which the css Pause relies on); they freeze transitions and timers with the helper.
  - The `hb:pause` / `hb:input` listeners are registered at the top level of the page's inline script; the page reaches player controls by their ids, never by `data-hb-*`.
  - `hb:input` can arrive several times for one gesture (a tap sends two; a trackpad sends a stream of wheel events; a held key repeats): the page's handler only stops a Show me run and must be safe to call repeatedly — never a toggle or a counter.
  - No stage element uses the class names `seg` or `swatches`: the shared stylesheet styles `.hb-page .seg` and `.swatches` for the Try it controls and would restyle a demo's own element.
  - Slow motion multiplies movements and the timers that wait for them, never holds (pauses), on every kind of page, Show me runs included.
  - A "Press Tab" page (Focus Ring) also stops its Show me run when the visitor tabs into the stage (a trusted `focusin` the run did not cause); the run's own `focus()` calls fire trusted `focusin` too, so the page ignores focus moves it made itself (for example with a flag set around its own `focus()` call).
- Lanes never edit `assets/`, `tests/`, `tools/`, another category's folder, or another category's cards in the root `index.html`. A lane that needs a shared change stops and reports it; the coordinator makes it on `main` and merges `main` into every lane.
- Tests: `node --test "tests/*.test.js"` from the lane's worktree root. Browser check: `node tools/check-pages.mjs --base http://127.0.0.1:<lane port> <folder>`.
- Scratch files go in the lane worktree's `.superpowers/scratch/`. Never delete with a wildcard or a command substitution in the path; never write a raw non-breaking space.
- Commit messages: a lower-case prefix and a plain sentence, one page per conversion commit.

## Lanes

| Lane | Category | Pages | Worktree | Branch | Port | Starts after |
|---|---|---|---|---|---|---|
| ambient | 07-ambient-background | 17 | `.superpowers/worktrees/ambient` | `feat/rollout-ambient` | 8741 | Text & Typography merged |
| 3d | 06-3d-advanced | 18 | `.superpowers/worktrees/3d` | `feat/rollout-3d` | 8742 | do-it/scroll kinds merged |
| micro | 04-micro-interactions | 29 | `.superpowers/worktrees/micro` | `feat/rollout-micro` | 8743 | do-it/scroll kinds merged |
| transitions | 03-page-transitions | 12 | `.superpowers/worktrees/transitions` | `feat/rollout-transitions` | 8744 | do-it/scroll kinds merged |
| scroll | 01-scroll-based | 26 | `.superpowers/worktrees/scroll` | `feat/rollout-scroll` | 8745 | do-it/scroll kinds merged |

The coordinator creates each worktree from `main` (`git worktree add .superpowers/worktrees/<lane> -b feat/rollout-<lane> main`), adds a launch configuration `lane-<lane>` serving that folder on its port (`python -m http.server <port> --bind 127.0.0.1 --directory <worktree>`), and starts it with the preview tool. Every helper in a lane works only inside that lane's worktree. Each lane keeps its own ledger at `<worktree>/.superpowers/sdd/rollout-<lane>/progress.md`.

---

### Task 1 (every lane): Content sheet

**Files:** Create `docs/superpowers/plans/2026-09-29-<lane>-content.md` in the lane's worktree.

Follow Task 3 of the Text & Typography plan (the format, the rules and the checks), with these additions:
- **Kinds:** plays once, loop, do it or scroll, as the rollout spec defines them. Do-it pages name their step 1 title (Hover it · Click it · Drag it · Press Tab) and write its help line, and describe the Show me run (what it does, 2–4 s, how it returns to rest, what stops it on `hb:input`) and whether there is a Reset. Scroll pages name the scroller (the stage, or the element marked `data-hb-scroller`) and what scrolling shows; they have no Slow motion.
- **Pages without settings** leave out Try it (the do-it/scroll plan's Task 1).
- **Special cases** from the rollout spec apply (Scroll Image Sequence rebuilt to scroll inside its stage; View Transitions API and Shared Element Transition not clipped; Focus Ring as a Press Tab page; click demos play one click and return to rest; pages showing several small examples keep them together in one stage).
- For categories over 20 pages the sheet is written in two halves by two writers at the same time (pages split in home-page order), each half reviewed on its own.
- The sheet is reviewed (Opus) and fixed before any conversion starts; decisions the owner should make are collected and asked in one question per lane.

### Tasks 2…N (every lane): Convert two pages per task

Follow "How to convert a page" in the Text & Typography plan with the lessons in Global Constraints, the do-it/scroll plan's markup for the new kinds, and the lane's content sheet. One builder per task (Sonnet), then a separate reviewer (Opus) that checks the pair against the sheet and in a real browser, fix rounds with a scoped re-review (Sonnet) until clean. One page per commit. The lane runs one builder at a time; its reviewer of the previous pair may run alongside the next builder, but fixes wait for the running builder to finish.

### Last tasks (every lane): Check, review, publish

- [ ] **Browser check:** `node tools/check-pages.mjs --base http://127.0.0.1:<port> animations/<category>` — every line `ok`; the coordinator reads laptop and phone contact sheets and sends them to the owner; spot checks of each kind in the in-app browser (settings → chips, copied prompt, the kind's controls).
- [ ] **Final category review** (Opus) with the lane's deferred minor findings; one fix wave; one scoped re-review.
- [ ] **Publish:** in the lane worktree, `git rebase main` (only the lane's own category folder, its README and its home-page cards change, so conflicts can only be in the root `index.html` card list — keep both sides); if `main` now links a newer shared-file version (`?v=N`), change the lane's pages to it (the page checks require one version everywhere); run the tests and the category's browser check again, then in the main working copy `git merge --ff-only feat/rollout-<lane>` and `git push origin main` (standing permission: push each category when it is finished and checked). Remove the worktree (`git worktree remove .superpowers/worktrees/<lane>`) and delete the branch.
