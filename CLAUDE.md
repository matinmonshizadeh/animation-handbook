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
  but demonstrate the principle with vanilla code. A page loads only files from
  this repository: the two shared files, the site font and the site icons.
- **Keep demos under ~300 lines total.** If it's longer, the explanation
  has failed.
- **Demos must work offline.** Open the HTML in a browser, it runs (from a
  checkout of the repository, which holds the shared files the page links).

## File template for each animation

### `index.html` structure
A page is one HTML file. The demo's own CSS is in a `<style>` and its JS in a
`<script>` in that file, inside the shared guided-steps page. Copy the closest
existing page of the same kind (see Page kinds) and change the demo, its settings
and its texts. The tests check the shared markup, and the player bar buttons
character by character, so do not retype them. Good starting points:
`02-entrance-and-exit/rotate-in` (plays once), `07-ambient-background/aurora`
(loops), `04-micro-interactions/checkmark-draw` (do it) and
`01-scroll-based/snap-scrolling` (scroll).

The `<head>` holds `<title>Name — Animation Handbook</title>`, the canonical
URL, the favicons, and Open Graph, Twitter and JSON-LD tags. Their description
is the page's one-line description (a test compares them).

#### Shared files
Every page links two files after its own `<style>`, with the same version
number `N` on every page:

```html
<link rel="stylesheet" href="../../../assets/css/demo-page.css?v=N">
<script src="../../../assets/js/demo-page.js?v=N" defer></script>
```

- `assets/css/demo-page.css` draws the page around the demo: the site font,
  top bar, header, steps, player bar, settings, prompt card, About, related
  cards, footer, and the phone and short-screen layouts.
- `assets/js/demo-page.js` runs it: "Your settings", Copy prompt, What it is and
  Similar animations (loaded from the README), playing on arrival, replaying
  when a setting changes, Pause, Slow motion, Show me, Play, and reduced motion.

`?v=N` keeps visitors from getting a cached older copy. **When either shared
file changes, bump N on every page in the same change.** A test fails when the
pages do not all use the same N.

#### The page, top to bottom
One centred column in the same order on every screen size:

1. **Top bar** (`nav.hb-bar`): the home link, and Previous and Next links to the
   neighbours in the same category (`rel="prev"`, `rel="next"`; the first and
   last page have one link).
2. **Header** (`header.hb-head`): the category line `NN.MM · Category` (the
   page's place on the home page), the `<h1>` title, and the one-line
   description (`p.hb-lede`), in plain words and ending "Best for …". That one
   sentence is used everywhere: the meta, Open Graph, Twitter and JSON-LD
   descriptions, the card in the `CATS` array of the root `index.html`, and the
   page's line in the root README and its category README.
3. **1 · Watch it** (`section.hb-watch`): a one-line help text, the stage
   (`div.stage`) and, right below it, the player bar (`div.hb-player`). The step
   title and help text are written per page so a demo can say what to do
   (Watch it, Scroll it, Hover it, Click it, Drag it, Press Tab).
4. **2 · Try it** (`section.hb-try`): one to three plain settings in view, the
   rest under **More options** (`details.hb-options`). See Try it below.
5. **3 · Copy the prompt** (`section.hb-prompt-step`): the prompt card holds the
   prompt (`p.hb-prompt`), the "Your settings" chips, and the **Copy prompt**
   button. See The copyable prompt below.
6. **About** (`section.hb-about`): **What it is** (from the README) beside
   **Good for** (3–5 short tags) and **Avoid on** (1–3 tags), written in the page.
7. **Similar animations** (`section.hb-related`): cards built from the README's
   See also list.
8. **Footer** (`footer.hb-foot`): "Animation Handbook" and a Back to top link.

Each of these parts appears exactly once. A demo with no settings leaves out Try
it; its steps are then numbered 1 and 2.

The page owns the stage's width, border, corners and height (`--hb-stage-h`
and `--hb-stage-h-phone` set another one); the demo owns overflow, background,
alignment and perspective. `hb-dots` adds the dotted background to a plain dark
stage, and `hb-grow` lets a stage whose text the visitor can change grow taller.

#### Page kinds and their controls
The body declares one kind: `<body class="hb" data-hb-kind="once|loop|do|scroll">`.
`data-hb-autoplay` on the body asks the shared script to run the page's arrival;
plays-once, do-it and scroll pages have it, loops do not. The Loop and Slow
motion switches start unchecked in the markup, all player markers sit inside the
player bar, and a page has at most one of each.

| Kind | Step 1 | Player bar | On arrival | Reduced motion |
|---|---|---|---|---|
| **once** (plays once) | Watch it | **Replay** `data-hb-replay`, **Loop** switch `data-hb-loop`, **Slow motion** switch `data-hb-slowmo` | Loop switches on about 400 ms after load, so the demo plays and repeats | Loop and Slow motion off and greyed out; Replay plays the reduced version once, on arrival too |
| **loop** (moves by itself) | Watch it | **Pause**/Play `data-hb-pause`, **Slow motion** `data-hb-slowmo` where it works, sometimes **Reset** `data-hb-reset` | Nothing; it is already moving | Starts paused, Play is one press away; Slow motion off and greyed out |
| **do** (the visitor acts) | Hover it, Click it, Drag it or Press Tab | **Show me** `data-hb-demo`, then **Reset** `data-hb-reset` where there is a state to reset, then **Slow motion** where it works | Show me is pressed once | Show me is never pressed on arrival; it still works when pressed; Slow motion off |
| **scroll** (driven by scroll position) | Scroll it | **Play** `data-hb-autoscroll`, **Back to top** `data-hb-top` | Play is pressed once: the box scrolls to its end in about six seconds | Play is not pressed on arrival; it still works when pressed |

What the markers do:
- `data-hb-replay` plays the demo from the start, and it keeps looping if Loop is
  on. `data-hb-loop` (a checkbox) makes the demo repeat while it is checked.
- `data-hb-slowmo` runs the demo three times slower. With the value `css` the
  shared script does it, setting every CSS animation and transition inside the
  stage to a third of its speed, including ones that start later. With no value
  the demo stretches its own durations and the timers that wait for them, not the
  pauses between loops.
- `data-hb-pause` pauses and resumes a loop; its label reads Pause or Play. With
  the value `css` the script holds the stage's CSS animations (class `hb-paused`
  on the stage). Either way it sends `hb:pause` on `document` (`detail.paused`),
  so a demo with its own timers can stop them.
- `data-hb-demo` plays one example of the interaction (two to four seconds) and
  returns the demo to rest. On a do-it page a real press, key, wheel, touch or
  click inside the stage is sent as `hb:input` on `document` (`detail.type`), so
  the page can stop a run under way and leave the visitor in control.
  `data-hb-reset` returns the demo to its starting state.
- `data-hb-autoscroll` scrolls the scroller to its end at a steady speed (the
  whole box in about six seconds), from the top when it is already at the end;
  any real input inside the stage stops it, and CSS scroll snapping is off while
  it runs. `data-hb-top` stops it and jumps to the top. `data-hb-scroller` marks
  the element that scrolls when it is not the stage itself.
- `data-hb-skip` leaves a control out of "Your settings" and the copied prompt;
  `data-hb-label` overrides its label.

Changing a setting always updates the chips. On plays-once pages it also
replays the demo about 250 ms later; on loops the change shows while the demo
keeps running; on do-it and scroll pages it shows the next time the visitor
interacts, scrolls, or presses Show me or Play.

#### Try it
One to three main settings (two or three is usual) stay in view; the rest go
under More options. Each has a plain label that says what changes ("How much it
spins", never "Rotation (deg)" or a CSS name), the control, and one hint line.
Prefer named choices ("Slow · Normal · Fast") to numbers; use a slider only
when sliding through values is the point, and show its value in plain words. An
on/off setting is a switch labelled as a statement ("Grows from small").
Playback is not a setting (the player bar has it), and Try it shows no status
lines or code values.

Write each control one way: choice buttons in `div.seg[role=group]` with
`aria-pressed` (exactly one pressed); a switch as `label.hb-switch-row` with
`input.hb-switch[role=switch]`; colours as `div.swatches` buttons with the
colour name as `aria-label`; text as `input.hb-text` or `textarea.hb-text`;
sliders with an `output.hb-value`; menus as `select.hb-select`. Every control
has a label, every field has `autocomplete="off"`, and each setting has exactly
one `p.hb-hint`. Copy the markup from a page that uses the control you need.

"Your settings" lists every control in Try it as `label: value`: the pressed
choice, on/off for a switch, the shown value of a slider, the chosen menu option,
the colour name, or typed text in quotes (cut at 40 characters). A hidden control
or one marked `data-hb-skip` is left out; controls under a closed More options
still count. A control with no label or value is left out and the console warns.

#### The copyable prompt
The prompt is written in the page (`p.hb-prompt`), in plain words: 60 to 130
words, never more, with no code and no backticks. It starts with what to build and
where ("Add a … to [the element you want to animate]"), with the parts the reader
fills in in [square brackets]. It says what the viewer sees, the one or two rules
that make it look right, how to keep it smooth, what to do under reduced motion,
and the touch equivalent of a hover or drag. It stays neutral about tools and
frameworks and never states a value that a setting controls. It **ends with "Match
the settings listed below."** when the page has a Try it step; a page without
settings does not say it.

Copy prompt copies the prompt, a blank line, and `Settings from the demo: label:
value, label: value.` If the browser blocks the clipboard the script falls back to
an off-screen text box, and last to selecting the prompt. On phones the prompt
shows five lines with "Show the full prompt".

#### Colors
The demo's own styles use CSS variables for colors and default to a dark stage
with light cards. Each page sets `--ui-accent` in `:root` to its category's color,
and the shared stylesheet uses it for the step numbers, the category line, chips,
focus rings and pressed buttons: 01 `#6ea8ff`, 02 `#5fd88a`, 03 `#b98cff`,
04 `#ff9d5c`, 05 `#ff6f8b`, 06 `#3fd6c4`, 07 `#ffce5a`.

#### Font
The site font is Schibsted Grotesk, self-hosted in `assets/fonts/` and loaded by
`demo-page.css`. Page text and stage text both use it (`var(--hb-font)`); a demo
does not set another family. A typewriter (monospace) font is only for effects
about typing, such as Typewriter Effect and the typewriter mode of Letter-by-Letter
Stagger.

#### Reduced motion
The visitor's `prefers-reduced-motion: reduce` setting is followed on the page and
in the demo:
- **Loop** and **Slow motion** are shown switched off and greyed out and cannot be
  switched on; a short note in the player bar says why.
- **Loops start paused**; Play is one press away.
- On arrival nothing is pressed for the visitor: a do-it page's Show me and a scroll
  page's Play wait, and a plays-once page plays its reduced version once so the
  stage is not empty.
- Replay, Pause/Play, Show me and Play still work when the visitor presses them.
- The demo's own CSS and script show the end state or a fade instead of movement
  (`@media (prefers-reduced-motion: reduce)`).

### `README.md` structure
Every animation README has exactly these sections:

1. **What it is** — 2-3 sentence definition
2. **When to use it** — bullets of real use cases
3. **How it works** — the mechanic, with code snippet
4. **Key parameters** — the values that matter (delay, threshold, etc.)
5. **Production notes** — gotchas, library equivalents (GSAP, Framer Motion)
6. **See also** — links to related animations in the handbook

The page loads two of them live: **What it is** (under About) and **See also**
(Similar animations). What it is and Key parameters contain no code. Each See
also line is `- [Title](../slug/) — one plain phrase`, where Title is the linked
page's `<h1>`. Key parameters has one row per setting in Try it, named exactly as
on the page (a page without Try it lists the technique's own values). How it
works matches the demo's current code. The other sections are for GitHub readers
and are not shown on the site. Opened from disk (`file://`), the page shows a link
to `README.md` in place of What it is and hides Similar animations.

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
- On the pages, write for someone new to animation: plain labels, hints,
  descriptions and prompts, with no code and no CSS property names.

## When asked to add a new animation
1. Confirm the category, the slug name and the page kind (plays once, loops, do
   it, scroll).
2. Create the folder under `animations/<category>/<slug>/`.
3. Create `index.html` by copying the closest page of the same kind and
   following the template above.
4. Create `README.md` with all 6 required sections.
5. Update the root `index.html` index page to link to it: add a card to the
   category's `entries` in the `CATS` array (slug, name, the page's one-line
   description), and add the page to `sitemap.xml`.
6. Update `animations/<category>/README.md` and the list in the root `README.md`
   to list it, with the card's name and the same one-line description, in the
   home page's order. Update the technique count where it is written (the root
   `README.md`, the home page and `tests/pages.test.js`).
7. Run the tests and the page check on the new folder (below).

## When asked to refactor
- Preserve every demo's behavior exactly. Visual parity matters more than
  code elegance.
- Never combine multiple animations into one file.
- Run the tests and the page check afterwards.

## Tests and the page check
Run both before calling any page done.

- **Tests:** `node --test "tests/*.test.js"` from the repo root (Node's built-in
  runner; nothing to install). They check, for every page, the template's parts,
  the player bar of its kind, labels and one pressed button per choice group, the
  prompt rules, `autocomplete="off"`, one description across the lede, meta, Open
  Graph, JSON-LD and home card, and one `?v=N` across all pages. They check every
  page's README (the sections, no code in What it is and Key parameters, See also
  links and titles, Key parameters equal to the settings), the shared stylesheet
  and the home page, and they unit-test the pure helpers in `demo-page.js`.
- **Page check:** serve the repo from its root
  (`python -m http.server <port> --bind 127.0.0.1`), then run
  `node tools/check-pages.mjs --base http://127.0.0.1:<port> <page or category folder>`,
  for example `animations/02-entrance-and-exit/rotate-in` or a whole category
  folder. It drives Chrome (set `CHROME` to its path if it is not in the default
  Windows folder). It opens each page at six screen setups (1280×800, 1366×657,
  768×1024, 375×812, 375×812 with reduced motion, and 320×640) and prints one line
  for each, so a passing page gives **six `ok` lines**; a problem prints `FAIL`
  with the reason and the run exits with 1. It reports console errors and warnings,
  horizontal overflow, touch targets under 44px on phones, a stage or player bar
  below a laptop's first screen, and chips that do not match the settings. It also
  works the controls of the page's kind (Replay, Pause and Play, Show me, Play and
  Back to top) and checks the reduced-motion run. It prints where it saved the
  screenshots.

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
- The page is one column at every size, with the player bar right below the
  stage and the settings below it; nothing sits beside the stage. Settings sit two
  per row from 760px wide and one per row below that; on phones the player bar
  becomes a two-column grid.
- The animation stage itself must scale fluidly. Its height comes from the
  shared stylesheet (between 300px and 440px, about the screen height minus 420px;
  260px at the least on short laptop windows; 300px on phones), so build what is
  inside it with `%`, `clamp()` or `aspect-ratio` to fill it at any of those
  heights, not at a fixed size.
- Typography must scale: use `clamp()` for headings
  (e.g. `font-size: clamp(18px, 4vw, 28px)`).
- Padding and gaps should shrink on mobile — use `clamp()` or media
  queries to prevent cramped layouts.
- Text is at least 4.5:1 against its background.

### Touch and input rules
- All interactive controls (sliders, buttons, toggles) must be at least
  **44×44px** on mobile (Apple/WCAG touch target minimum). The shared
  stylesheet does this for the page's own controls; buttons and handles a demo
  draws inside the stage need it too.
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
