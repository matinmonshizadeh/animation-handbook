# Animation Handbook — Claude Code Instructions

## Project purpose
A visual reference of web animation techniques. Each animation has its own
folder with a self-contained HTML demo and a short README explaining the
mechanics. Goal: help people understand what each animation type is by
*seeing* it work and reading why it works. Each page also gives a plain-words
prompt to paste into an AI assistant, so the site itself shows no code.

## Hard rules
- **One animation = one folder** under `animations/<category>/<slug>/`.
- **Each folder contains exactly:** `index.html`, `README.md`, optionally
  `preview.gif` or `preview.png`.
- **No build step. No frameworks. No npm packages.** Plain HTML + CSS +
  vanilla JS only. The animation itself (its markup, styles and script) lives
  in one HTML file; the page around it comes from two shared files (below).
- **No external dependencies in demos.** No CDN GSAP, no jQuery. If a
  technique requires a library in production, mention that in the README
  but demonstrate the principle with vanilla code. A page loads only files
  from this repository: the two shared files, the site font, the site icons
  and its own `README.md` (fetched for What it is and Similar animations).
- **Keep demos under ~300 lines total.** If it's longer, the explanation
  has failed.
- **Demos must work offline.** Open the HTML in a browser, it runs (from a
  checkout of the repository, which holds the shared files the page links).

## File template for each animation

### `index.html` structure
A page is one HTML file: the demo's own CSS in a `<style>` and JS in a `<script>`, inside the shared
guided-steps page. Copy the closest page of the same kind and change the demo, its settings and its
texts; the tests pin the Pause, Show me, Reset, Play and Back to top buttons character by character.
Starting points: `rotate-in` (plays once), `aurora` (loop in CSS), `starfield` (loop in JavaScript),
`checkmark-draw` (do it), `snap-scrolling` (scroll). The `<head>` has the title `Name — Animation Handbook`,
the canonical URL, the favicons, and the Open Graph, Twitter and JSON-LD tags that repeat the name and
description: copy them from a neighbor page and change them together.

**Shared files.** Every page links these after its own `<style>`, with one version `N` on every page.
**When either file changes, bump N on every page in the same change**, or visitors keep a cached copy (a
test fails if the pages differ). `demo-page.css` draws the page around the demo; `demo-page.js` runs it.

```html
<link rel="stylesheet" href="../../../assets/css/demo-page.css?v=N">
<script src="../../../assets/js/demo-page.js?v=N" defer></script>
```

**The page** (one centered column at every size; each part appears once):
1. **Top bar** (`nav.hb-bar`): the home link and Previous / Next links to the neighbors in the category
   (`rel="prev"`, `rel="next"`; the first and last page have one).
2. **Header** (`header.hb-head`): the category line `NN.MM · Category` (its place on the home page), the
   `<h1>` and the one-line description (`p.hb-lede`) in plain words, ending "Best for …". That sentence is
   also the meta, Open Graph, Twitter and JSON-LD description, its card in the `CATS` array of the root
   `index.html`, and its line in both READMEs.
3. **1 · Watch it** (`section.hb-watch`): help line, stage (`div.stage`), player bar (`div.hb-player`); the
   step title and help line are written per page.
4. **2 · Try it** (`section.hb-try`): one to three settings, the rest under **More options**
   (`details.hb-options`). No settings: leave it out and number the steps 1 and 2.
5. **3 · Copy the prompt** (`section.hb-prompt-step`): prompt (`p.hb-prompt`), "Your settings" chips, **Copy prompt**.
6. **About** (`section.hb-about`): **What it is** (from the README) beside **Good for** (3–5 tags) and
   **Avoid on** (1–3 tags); then **Similar animations** (`section.hb-related`) and the footer.

The page owns the stage's width, border, corners and height (`--hb-stage-h` and `--hb-stage-h-phone` set
another one); the demo owns overflow, background, alignment and perspective. `hb-dots` adds a dotted
background to a plain dark stage; `hb-grow` lets a stage with visitor-editable text grow taller.

#### Page kinds and their controls
The body declares one kind: `<body class="hb" data-hb-kind="once|loop|do|scroll">`. Every kind except loop also
has `data-hb-autoplay` on the body, which runs the arrival. Player markers sit in the player bar, at most one
of each, and the Loop and Slow motion switches start unchecked.

| Kind | Step 1 | Player bar | On arrival |
|---|---|---|---|
| **once** (plays once) | Watch it | **Replay** `data-hb-replay`, **Loop** switch `data-hb-loop`, **Slow motion** switch `data-hb-slowmo` | Loop switches on after about 400 ms, so the demo plays and repeats |
| **loop** (moves by itself) | Watch it | **Pause**/Play `data-hb-pause`, **Slow motion** where it works, sometimes **Reset** `data-hb-reset` | Nothing: it is already moving |
| **do** (the visitor acts) | Hover it, Click it, Drag it, Scroll it or Press Tab | **Show me** `data-hb-demo`, **Reset** where there is a state to reset, **Slow motion** where it works | Show me is pressed once |
| **scroll** (driven by scroll position) | Scroll it | **Play** `data-hb-autoscroll`, **Back to top** `data-hb-top` | Play is pressed once: the box scrolls to its end in about six seconds |

- `data-hb-replay` plays from the start (and keeps looping if Loop is on); `data-hb-loop` repeats while
  checked; `data-hb-reset` returns the demo to its start.
- `data-hb-slowmo`: three times slower. With the value `css` the script slows every CSS animation and transition
  in the stage (later ones too); with no value the demo slows itself (its durations and timers, not the pauses).
- `data-hb-pause`: with the value `css` the script holds the stage's CSS animations (class `hb-paused`); with no
  value the demo pauses itself. Either way `hb:pause` is sent on `document` (`detail.paused`). A demo with its own
  timers registers that listener at the top level of its script, not in a `DOMContentLoaded` handler: under
  reduced motion the event is sent once at boot, before `DOMContentLoaded`.
- `data-hb-demo`: plays one example (two to four seconds) and returns to rest. A real press, key, wheel, touch or
  click in the stage is sent as `hb:input` on `document` (`detail.type`), so the page can stop a run.
- `data-hb-autoscroll`: scrolls the scroller to its end at a steady speed (the whole box in about six seconds;
  it restarts from the top if already at the end, with CSS snapping off while it runs) until the visitor's own
  input in the stage stops it; `data-hb-top` stops it and jumps to the top; `data-hb-scroller` marks the
  scroller when it is not the stage.
- `data-hb-motion-note` (scroll pages only): on the body, one sentence with no full stop, for a page where
  reduced motion switches an effect off instead of only stopping its animation ("The layers stay still while
  the box scrolls"). The player bar shows it under reduced motion, followed by " because your device is set to
  reduce motion.", in place of the usual "The effects follow the scroll without animating".

A setting change replays a plays-once demo about 250 ms later; on other kinds it shows while the demo runs or
at the next Show me, Play or interaction. Three owner rulings hold on every page: Pause freezes the stage at
once (running transitions and timers stop mid-way); every setting and control visibly changes the stage; after
Back to top or any jump, a scroll page shows the state for the new position at once.

#### Reduced motion
When the device asks for reduced motion, Loop and Slow motion are switched off and grayed out (they cannot be
switched on) with a short note in the player bar, and loops start paused. Nothing is pressed for the visitor on
arrival, except that a plays-once page plays its reduced version once so the stage is not empty. Replay,
Pause/Play, Show me and Play still work when pressed. The demo itself shows the end state or a fade, not movement.

#### Try it
Show one to three settings (two or three is usual); the rest go under More options. Each has a plain label that
says what changes ("How much it spins", never "Rotation (deg)" or a CSS name), the control and one hint line;
every field has `autocomplete="off"`. Prefer named choices ("Slow · Normal · Fast") to numbers, switches for
on/off ("Grows from small") and a slider only when sliding is the point (it shows its value in plain words).
Playback is not a setting, and Try it shows no status lines or code values.

Write each control one way. Choice buttons: `div.seg[role=group]` with `aria-pressed`, exactly one pressed.
Switch: `label.hb-switch-row` around `input.hb-switch[role=switch]`. Colors: `div.swatches` buttons with the
color name as `aria-label`. Text: `label.hb-setting-name[for]` with `input.hb-text` or `textarea.hb-text`. Copy
these from a page that has one. No page has a slider (`input[type=range]` with an `output.hb-value`) or a
menu (`select.hb-select`) yet: follow the controls table in
`docs/superpowers/specs/2026-09-27-demo-page-rollout-design.md`. "Your settings" lists every control as
`label: value`, except a hidden one or one with `data-hb-skip` (controls under a closed More options count);
`data-hb-label` overrides a label.

#### The copyable prompt
Written in the page (`p.hb-prompt`) in plain words: 60 to 130 words, never more, no code, no backticks. It
starts with what to build and where ("Add a … to [the element you want to animate]"), with [square brackets]
around what the reader fills in. It says what the viewer sees, the one or two rules that make it look right,
how to keep it smooth, what to do under reduced motion and the touch equivalent of a hover or drag; it stays
neutral about tools and never states a value that a setting controls. It **ends with "Match the settings
listed below."** when the page has a Try it step, and a page without settings does not say it.

#### Colors and font
The demo's own styles use CSS variables for colors and default to a dark stage with light cards. Each page
sets `--ui-accent` in `:root` to its category's color (copy it from another page in the category); the shared
stylesheet uses it for step numbers, chips and pressed buttons. The site font is Schibsted Grotesk
(`assets/fonts/`, loaded by `demo-page.css`); stage text uses it and a demo sets no other family. A
typewriter (monospace) font is only for effects about typing.

### `README.md` structure
Every animation README has exactly these sections:

1. **What it is** — 2-3 sentence definition
2. **When to use it** — bullets of real use cases
3. **How it works** — the mechanic, with code snippet
4. **Key parameters** — the values that matter (delay, threshold, etc.)
5. **Production notes** — gotchas, library equivalents (GSAP, Framer Motion)
6. **See also** — links to related animations in the handbook

The tests require What it is, When to use it, Key parameters and See also; the other two are required by
convention. The page loads **What it is** and **See also** from the README; What it is and Key parameters
contain no code. Each See also line is `- [Title](../slug/) — one plain phrase`, Title being the linked
page's `<h1>`. Key parameters has one row per setting in Try it, named as on the page (a page without Try it
lists the technique's own values). How it works matches the demo's code. Opened from disk (`file://`), a page
shows a README link in place of What it is and hides Similar animations; that is expected.

## Taxonomy (do not invent new top-level categories without asking)

1. Scroll-Based — scroll-driven techniques (folder: 01-scroll-based)
2. Entrance & Exit — element enter, exit, reveal animations (folder: 02-entrance-and-exit)
3. Page Transitions — full-page/route transitions (folder: 03-page-transitions)
4. Micro-Interactions — hover, click, focus, loading, UI feedback (folder: 04-micro-interactions)
5. Text & Typography — text-specific animations (folder: 05-text-typography)
6. 3D & Advanced — WebGL, shaders, particles, 3D transforms (folder: 06-3d-advanced)
7. Ambient & Background — passive looping effects (folder: 07-ambient-background)

## Distinction: technique vs tool
This handbook catalogs **techniques**, not libraries. GSAP, Framer Motion,
Lottie, Three.js are tools that *implement* techniques. They get mentioned
inside an entry's "Production notes" section, never as their own entry.

## Writing style
- Prose explanations, not bullet-soup.
- Show, then explain. The demo is the main artifact; words support it.
- Avoid hype. No "stunning", "amazing", "powerful". Describe what it does.
- Code comments only when the code isn't self-explanatory.
- On the pages, write for someone new to animation: plain labels, hints, descriptions and prompts, with no code
  and no CSS property names.
- Use American spelling (color, behavior, center, neighbor, gray).

## When asked to add a new animation
1. Confirm the category, the slug and the page kind (plays once, loops, do it, scroll).
2. Create the folder under `animations/<category>/<slug>/`.
3. Create `index.html` by copying the closest page of the same kind and following the template above.
4. Create `README.md` with all 6 required sections.
5. Link it in: the page before it gets a Next link to it and the page after it a Previous link to it, each
   replacing its old one, if any (a page never has two `rel="next"` or two `rel="prev"` links); the new page
   links back to both. A new first or last page has one neighbor, so one link. The link text and `aria-label`
   use the linked page's `<h1>`; copy the markup from a neighbor. Adding a page mid-category renumbers the
   `NN.MM` category line of every later page.
6. Update the root `index.html` index page to link to it: add a card to the category's `entries` in the
   `CATS` array (slug, name, the page's one-line description), and add the page to `sitemap.xml`.
7. Update `animations/<category>/README.md` and the root `README.md` list (the card's name and one-line
   description, in home page order), and the technique count wherever it is written: the root `README.md`,
   the home page, `tests/pages.test.js`, `.github/ISSUE_TEMPLATE/config.yml` and `docs/launch-kit.md`.
8. Run the tests and the page check on the new folder and on every page you edited.

## When asked to refactor
- Preserve every demo's behavior exactly. Visual parity matters more than
  code elegance.
- Never combine multiple animations into one file.
- Run the tests and the page check afterwards.

## Tests and the page check
Run both before calling a page done. They need Node 22 or later (the `--test` glob, the page check's `WebSocket`).
- **Tests:** `node --test "tests/*.test.js"` from the repo root (nothing to install) checks every page and its
  README, the shared stylesheet and the home page.
- **Page check:** serve the repo root (`python -m http.server <port> --bind 127.0.0.1`), then run
  `node tools/check-pages.mjs --base http://127.0.0.1:<port> <page or category folder>`. It drives Chrome (set
  `CHROME` to its path if it is not in the default Windows folder) and loads each page at six setups (1280×800,
  1366×657, 768×1024, 375×812, 375×812 with reduced motion, 320×640), printing `ok` or `FAIL` for each: a passing
  page gives **six `ok` lines**, a failure exits with 1. It fails a page on console errors and warnings (a control
  with no label or value is left out and the console warns), overflow, small touch targets on phones, a stage or
  player bar below a laptop's first screen and chips that do not match the settings, and it works the controls
  of the page's kind. It skips controls inside `.stage` when it measures touch targets, so check buttons and
  handles a demo draws there by hand.

## Out of scope
- Backend code, databases, APIs.
- Anything requiring a server beyond a static file server.
- React/Vue/Svelte components — this is framework-agnostic by design.

## Responsiveness requirements (mandatory)

Every demo must be fully responsive across mobile, tablet, and desktop.
This is non-negotiable — a demo that breaks on phones fails the quality bar.

### Breakpoints
- **Mobile:** ≤ 600px viewport width
- **Tablet:** 601px – 1024px
- **Desktop:** ≥ 1025px

### Layout rules
- Use CSS Grid or Flexbox for all layouts. No fixed pixel widths on
  containers — always use `%`, `fr`, `minmax()`, or `clamp()`.
- The page is one column at every size: the player bar right below the stage, the settings
  below it, nothing beside the stage. Settings go two per row from 760px wide, one below.
- The animation stage itself must scale fluidly. The shared stylesheet sets its height
  (300–440px, about the screen height minus 420px; 260px at the least on short laptop
  windows; 300px on phones), so build what is inside it with `%`, `clamp()` or
  `aspect-ratio`, not at a fixed size.
- Typography must scale: use `clamp()` for headings
  (e.g. `font-size: clamp(18px, 4vw, 28px)`).
- Padding and gaps should shrink on mobile — use `clamp()` or media
  queries to prevent cramped layouts.
- Text is at least 4.5:1 against its background.

### Touch and input rules
- All interactive controls (sliders, buttons, toggles) must be at least
  **44×44px** on mobile (Apple/WCAG touch target minimum). The shared stylesheet
  does this for the page's own controls; buttons and handles a demo draws inside
  the stage need it too.
- Replace hover-only interactions with tap-equivalent behavior on touch
  devices. Use `@media (hover: hover)` to gate hover effects.
- Scroll-driven demos must work with touch scroll, not just mouse wheel.
- Drag interactions must use Pointer Events (`pointerdown` / `pointermove`
  / `pointerup`), not mouse events, so they work on touch.

### Performance on mobile
- Demos must run at 60fps on a mid-range mobile device. If an effect is
  too heavy (heavy blur, many particles, complex shaders), provide a
  reduced-quality fallback on mobile: a phone is
  `(max-width:600px),(max-height:500px)`, so a phone held sideways counts.
- Use `transform` and `opacity` for animations — never animate `width`,
  `height`, `top`, `left`, or `box-shadow` directly.
- A JavaScript frame loop moves by elapsed time, never by a fixed amount per frame, or it runs twice as fast on a
  120 Hz screen and half as fast on a 30 Hz phone (the page check runs at 60 Hz and cannot see it). With
  `FRAME = 1000 / 60` and `dt = lastT === null ? 0 : Math.min(ts - lastT, 50)` (a start, Play and `visibilitychange`
  set `lastT = null`; an easing that restarts on input may count its first frame as one `FRAME`), multiply each step
  by `dt / FRAME` (and by 1/3 in Slow motion) and turn an easing share `k` into `1 - Math.pow(1 - k, dt / FRAME)`.
  Physics that needs equal steps (Verlet, a spring) takes fixed steps from an accumulator. A trail washes once for
  every 60th of a second at its 60 Hz opacity, and a frame with no wash due draws nothing. Copy the loop of Synthwave
  Grid, Starfield (trails) or Cloth Simulation (fixed steps).
- Respect `@media (prefers-reduced-motion: reduce)` — disable or simplify
  animations for users who request it (see Reduced motion above).

### Testing checklist (Claude Code should self-verify before declaring done)
Before finishing any animation, mentally walk through:
- [ ] Does the layout reflow cleanly at 375px width (iPhone SE)?
- [ ] Are all touch targets ≥ 44px?
- [ ] Does it work with touch scroll / drag, not just mouse?
- [ ] Does text remain readable (no overlap, no overflow) at every size?
- [ ] Is text at least 4.5:1 against its background?
- [ ] Is the player bar right below the stage, with Try it under it and nothing beside the stage on mobile?
- [ ] Does it respect prefers-reduced-motion?
- [ ] Do the tests and the page check pass (six `ok` lines per page)?

If any answer is no, the demo is not complete.
