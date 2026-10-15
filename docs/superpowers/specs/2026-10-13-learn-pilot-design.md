# Learn pilot: design

> **Status (2026-10-13):** See inside (A) and Compare (B) roll out to every page by `2026-10-13-see-inside-compare-rollout-design.md`.
> The learning path (C) and Motion basics (D) wait on `feat/learn-pilot`; the commit "chore: the learning path and the idea lessons
> wait on feat/learn-pilot" took them off `feat/see-inside-compare`, and reverting it is the first step when they resume.

2026-10-13. The owner's goal for the handbook is to help people *understand* web animation by seeing it, with no code
on the site (see `2026-10-13-goal-and-roadmap.md`). From four ideas shown as mockups, the owner picked all four:

- **A · See inside:** the animation pulled apart, so you see its hidden parts and how each one moves.
- **B · Compare:** the same scene without the effect and with it, side by side.
- **C · Learning path:** a short route through the handbook, from easy to advanced, like lessons in a course.
- **D · Motion basics:** short visual lessons on the ideas behind every animation.

Owner rulings, 2026-10-13:

- Build A–D on **one animation first, Parallax Scrolling** (`animations/01-scroll-based/parallax-scrolling/`). The
  owner approves from the real pages (the browser pane and screenshots) before anything is added to the other 165 pages.
- **Nothing goes live** during the pilot: the work stays on the branch `feat/learn-pilot` until the owner approves.
- The site still shows **no code**: everything on the new parts is pictures, motion and plain words.
- Build it with **parallel agents**, each part reviewed by another agent, with no drop in quality.
- The owner left the layout to Claude (the placement question was too abstract); the choices below follow the
  recommended option: the switch sits on the box the visitor is already watching.

## What the owner will see

1. On the Parallax Scrolling page, three buttons above the box: **Normal**, **See inside**, **Compare**. The box changes
   in place; one short sentence under the player bar says what you are seeing.
2. A small line under the page title: **Learning path · Lesson 22 of 25**, and at the end of the page the previous and
   next lessons.
3. A new **Learn** page (`learn/index.html`): 25 steps in 5 short chapters, ideas and animations taking turns.
4. Two **idea lessons** (Motion basics): *Follows the scroll* (lesson 11) and *Far things move slower* (lesson 21).

## 1 · The mode switch (shared, for every page later)

### Markup

Inside `section.hb-watch`, between `div.hb-step-head` and `div.stage`, the same on every page that has it:

```html
<div class="seg hb-modes" role="group" aria-label="What the box shows" data-hb-modes>
  <button type="button" data-hb-mode="normal" class="on" aria-pressed="true">Normal</button>
  <button type="button" data-hb-mode="inside" aria-pressed="false">See inside</button>
  <button type="button" data-hb-mode="compare" aria-pressed="false">Compare</button>
</div>
```

Right after `div.hb-player`, one note per mode other than Normal, in the page's own words:

```html
<div class="hb-mode-notes" aria-live="polite">
  <p data-hb-for="inside" hidden>…</p>
  <p data-hb-for="compare" hidden>…</p>
</div>
```

Names: the tests forbid the old markup `hb-view` anywhere in a page, so every new name uses `hb-mode`, never `hb-view`.

### Behavior (`demo-page.js`)

- Pressing a mode button presses it (`aria-pressed`, class `on`, exactly one pressed), sets `data-hb-mode` on the
  stage (`normal`, `inside` or `compare`), shows the note whose `data-hb-for` matches (none for Normal) and sends
  `hb:mode` on `document` with `detail.mode`. The page draws the mode in its listener, registered at the top level of
  its script (the inline script runs before the deferred shared script).
- The page starts in Normal. The mode is not a setting: it is outside Try it, so "Your settings" and the copied prompt
  never mention it, and `tools/make-skill.mjs` writes the same skill as before.
- Changing the mode never scrolls the page or the box, never moves focus and never stops Play. After a mode change the
  box shows the right picture for its current scroll position at once (the owner's jump ruling for scroll pages).
- Reduced motion: the switch works the same; the page draws a still version of each mode (section 2).

### Look (`demo-page.css`)

- The switch uses the existing choice-button look (`.seg`), with the pressed button in the category color. Phones:
  full width, three equal buttons at least 44px high. Wider screens: placed so the stage and the player bar stay on a
  laptop's first screen, which the page check measures at 1366×657 and 1280×800 (for example in the step heading's
  row, or with its height taken off the stage through the `--hb-stage-h` hooks). The builder measures; nothing is guessed.
- The note is 15px body text in the page's muted ink, at least 4.5:1 against the page, with any link underlined.

## 2 · Parallax Scrolling: See inside and Compare

The page keeps its four layers (sky with stars, distant ridge, pine trees, grass), its Depth setting
(Flat · Shallow · Normal · Deep), Play, Back to top and its prompt, all unchanged in Normal.

### See inside

The four layers are pulled apart so a beginner sees they are separate flat pictures stacked from far to near. Each
layer gets a thin outline and a label: its name (Sky, Hills, Trees, Grass) and how far it moves under the chosen Depth,
as a plain word or a short bar. They are spread apart in depth, far at the back: tilted in 3D and spaced, or fanned out
diagonally. The builder tries the 3D spread first and keeps whichever reads clearer at 375px and 1280px; the reviewer
judges from screenshots. As the box scrolls (by hand or with Play), every layer moves by its own amount, exactly as in
Normal, so the difference in speed is plain to see. Labels are at least 12px and 4.5:1 against what is behind them.

Note: "Inside, the picture is four flat layers. As the box scrolls, the far sky barely moves and the near grass moves
most." followed by a link: "The idea: far things move slower" (to lesson 21).

### Compare

Two copies of the scene side by side, labeled at the top: **Without parallax** (every layer moves the same, as Depth:
Flat) and **With parallax** (the chosen Depth). One scroll drives both. When Depth is Flat both sides match; the note
then says so and points to Try it.

Note: "On the left every layer moves the same, so the picture looks flat. On the right each layer moves its own amount,
so it looks deep."

### Reduced motion

The page already keeps every layer still under reduced motion ("The layers stay still while the box scrolls"). See
inside shows the layers apart and still, each with an arrow as long as the distance it would travel. Compare shows both
sides still at the middle of the scroll (the left aligned, the right offset), so the difference shows without movement.

### Screen readers

The page sets the stage's `aria-label` for each mode: Normal "A landscape in four layers that move at different
speeds" (as today); See inside "The landscape pulled apart into its four layers, each labeled with how much it moves";
Compare "Two copies of the landscape side by side, without parallax on the left and with parallax on the right".

## 3 · Learning path (C)

### The Learn page: `learn/index.html`

The same page frame as the animation pages (top bar with the home link and the Star link, `demo-page.css` and
`demo-page.js` at the shared version, the same footer). Title "Learn web animation"; lede "25 short lessons, from easy
to advanced. You watch and try; you never write code." Then the path as static HTML (it works without JavaScript and
from disk): an ordered list in five chapters, each step showing its number, its kind (Idea or Animation), its title and
one line, linked to its page. This list is the single source of truth for the path: the tests read it.

| # | Kind | Step | Page |
|--:|---|---|---|
| | | **Chapter 1 · Appear and leave** | |
| 1 | Idea | How long it takes | `learn/how-long-it-takes/` |
| 2 | Animation | Fade In / Fade Out | `02-entrance-and-exit/fade-in-out` |
| 3 | Idea | Slowing down | `learn/slowing-down/` |
| 4 | Animation | Slide In | `02-entrance-and-exit/slide-in` |
| 5 | Animation | Scale In / Zoom In | `02-entrance-and-exit/scale-in` |
| | | **Chapter 2 · Answer the visitor** | |
| 6 | Idea | Answer every action | `learn/answer-every-action/` |
| 7 | Animation | Button Press Scale | `04-micro-interactions/button-press-scale` |
| 8 | Animation | Hover State Animation | `04-micro-interactions/hover-state` |
| 9 | Animation | Toggle / Switch Slide | `04-micro-interactions/toggle-switch` |
| 10 | Animation | Loading Spinner | `04-micro-interactions/loading-spinner` |
| | | **Chapter 3 · Move with the scroll** | |
| 11 | Idea | Follows the scroll | `learn/follows-the-scroll/` (pilot) |
| 12 | Animation | Reveal on Scroll | `01-scroll-based/reveal-on-scroll` |
| 13 | Idea | One after another | `learn/one-after-another/` |
| 14 | Animation | Stagger Reveal | `01-scroll-based/stagger-reveal` |
| 15 | Animation | Progress Bar | `01-scroll-based/progress-bar` |
| | | **Chapter 4 · Change pages** | |
| 16 | Idea | Keep your place | `learn/keep-your-place/` |
| 17 | Animation | Crossfade Transition | `03-page-transitions/crossfade` |
| 18 | Animation | Slide Transition | `03-page-transitions/slide-transition` |
| 19 | Animation | Shared Element Transition | `03-page-transitions/shared-element-transition` |
| 20 | Animation | FLIP Technique | `03-page-transitions/flip-technique` |
| | | **Chapter 5 · Depth and 3D** | |
| 21 | Idea | Far things move slower | `learn/far-things-move-slower/` (pilot) |
| 22 | Animation | Parallax Scrolling | `01-scroll-based/parallax-scrolling` (pilot) |
| 23 | Animation | Parallax 3D Tilt | `06-3d-advanced/parallax-3d-tilt` |
| 24 | Animation | 3D Flip Card | `06-3d-advanced/flip-card-3d` |
| 25 | Idea | Less is more | `learn/less-is-more/` |

Animation pages live under `animations/`. In the pilot only lessons 11 and 21 exist among the ideas: the other six are
listed as text, marked "Not built yet", with no link. The owner can change the order and the steps at approval.

### On a path page

- Right after `p.hb-cat` in `header.hb-head`, sharing its row from 601px wide so the header grows no taller (the
  `p.hb-cat` line keeps its exact form, which the tests pin):
  `<p class="hb-lesson"><a href="../../../learn/">Learning path · Lesson 22 of 25</a></p>` (from an idea lesson the
  Learn page is `../`).
- At the end of `main.hb-page`, after Similar animations: `nav.hb-lesson-nav` (`aria-label="Learning path"`) with the
  previous lesson ("← Lesson 21 · Far things move slower"), the next ("Lesson 23 · Parallax 3D Tilt →") and "All lessons".
- Both cost no first-screen room the page check would notice (measured, as for the switch).
- In the pilot only Parallax Scrolling and the two idea lessons carry them. The other animation steps link to their
  pages as they are today.

## 4 · Motion basics (D): two idea lessons

An idea lesson is a short page in `learn/<slug>/index.html` with the same frame and look as an animation page, no prompt
and no README:

1. Top bar: the home link, Previous / Next lesson (in the existing pager, `rel="prev"` / `rel="next"`), the Star link.
2. Header: `p.hb-cat` "Lesson N of 25 · Idea", the `h1`, a one-sentence lede in plain words.
3. **1 · Watch it:** a stage with a small live demo of the idea and the player bar of its kind (the existing page kinds
   and their rules, reduced motion included).
4. **2 · Try it:** one control that turns the idea off and on, so the difference shows (optional when the demo already
   compares).
5. **Why it works:** two to four plain sentences.
6. **Where you'll see it:** links to three to six animation pages that use the idea, by their `h1`.
7. `nav.hb-lesson-nav`, then the shared footer.

The shared script must run on these pages without the parts they leave out (prompt, chips, README, Similar animations),
with no console errors.

### Lesson 11 · Follows the scroll (`learn/follows-the-scroll/`)

- Lede: "Some animations play on their own, like a video. Others follow your scroll: they move when you scroll and stop
  when you stop."
- Watch it: two boxes side by side, labeled. **Plays by itself:** a ball crosses its track on a timer, whatever you
  do. **Follows the scroll:** a scroll box whose ball sits wherever the scroll says; scroll back and it goes back. Kind:
  scroll (Play scrolls the right box; Back to top). Under reduced motion the left ball stays still and the right one
  jumps to its place without gliding.
- Why it works: when an animation follows the scroll, the visitor controls it (slow scroll, slow motion; scroll back,
  it plays backward; stop, it stops), which ties the movement to reading the page.
- Where you'll see it: Parallax Scrolling, Scrub Animation, Progress Bar, Text Fill on Scroll, Scroll-Driven 3D Rotation.

### Lesson 21 · Far things move slower (`learn/far-things-move-slower/`)

- Lede: "Look out of a moving train: the fence rushes by, the mountains crawl and the moon seems to stay put. Your eyes
  use that difference to judge distance."
- Watch it: a train-window scene sliding sideways in a loop (sky and moon still, far mountains slow, hills faster, fence
  fastest). Kind: loop (Pause).
- Try it: a switch "Same speed for everything": the layers move as one and the scene looks like a flat picture sliding.
- Under reduced motion the scene starts paused and each layer shows an arrow as long as its speed; the switch makes the
  arrows equal.
- Why it works: near things cross your view quickly and far things slowly; give a picture's far layers small moves and
  its near layers big moves, and a flat picture looks deep. That is the whole idea behind parallax.
- Where you'll see it: Parallax Scrolling, Parallax Depth-of-Field, 2.5D / Pseudo-3D, Depth-Map Photo, Wave Layers,
  Grid / Dot Pattern Parallax.

## 5 · Shared files, tests and the page check

- `demo-page.css` and `demo-page.js` change, so `?v=8` becomes `?v=9` on every page, the home page and the Learn pages
  in the same change (the tests compare them).
- Tests: the switch's markup exactly as above, inside the Watch step before the stage, at most one per page, Normal
  pressed; a note for each of See inside and Compare; a See inside note's lesson link opens an existing lesson. The path:
  25 steps numbered in order, every link opens an existing page, unbuilt steps marked and unlinked; each page that shows
  a lesson line or lesson nav shows the number, total and neighbors the Learn page gives. Learn pages: the same footer,
  Star link and shared version as the others, and no code.
- Page check (`tools/check-pages.mjs`): on a page with `data-hb-modes`, at every setup each mode shows its note and
  nothing overflows, with a screenshot of each mode saved; at the desktop and reduced-motion setups, with the stage at
  rest, See inside and Compare each change the stage's picture, Normal brings the first picture back, and on a scroll
  page Play keeps scrolling through a mode change. A new target `learn` checks `learn/index.html` and every lesson at
  the six setups.
- Not changed in the pilot: `sitemap.xml`, `llms.txt`, the skill, the home page (apart from the version), the READMEs,
  `404.html`, CLAUDE.md and CONTRIBUTING.md. The rollout updates them once the owner approves.

## 6 · Build

On `feat/learn-pilot`, by agents in separate worktrees, each part built by one agent and reviewed by another:

1. **Shared pieces first:** the switch, the notes, the lesson line and nav, the idea-lesson parts in `demo-page.css` and
   `demo-page.js`; the shared script on lesson pages; the switch's tests and page check support. One agent at a time
   edits the shared files, as in earlier rollouts.
2. **Then three lanes at once:** (a) Parallax Scrolling's See inside, Compare, notes, lesson line and nav; (b) the Learn
   page, the path tests and the `learn` check target; (c) the two idea lessons.
3. **Integration:** merge, bump the shared version everywhere, run the tests, the page check on the changed pages,
   `learn` and `home`, and the whole site in parts (the shared files changed); a final review.
4. **Owner review:** the branch served locally in the browser pane, with screenshots of each mode at phone and desktop
   sizes.

## Acceptance

- Tests pass; the page check gives six `ok` lines for Parallax Scrolling, `learn` (each page) and `home`, and the whole
  site passes.
- See inside and Compare are each understandable from the picture alone at 375px and 1280px (the reviewer's verdict from
  screenshots), and still under reduced motion.
- No code anywhere on the new parts; every sentence plain; American spelling.
- `tools/make-skill.mjs` produces no change. `tools/update-sitemap.mjs` is not run in the pilot: the version bump dates
  every folder today, so the rollout runs it once, with the Learn pages added.
