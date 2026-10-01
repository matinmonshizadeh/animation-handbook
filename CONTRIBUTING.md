# Contributing to Animation Handbook

Thanks for wanting to add to the handbook. The goal is a browsable, *teach-by-showing*
reference where every entry is a live demo. Contributions that add a new technique,
fix a bug, or improve an explanation are all welcome.

## Ground rules

- **One technique = one folder** under `animations/<category>/<slug>/`.
- **Each folder contains exactly** `index.html` and `README.md` (optionally a `preview.gif`/`preview.png`).
- **No build step, no frameworks, no dependencies.** Plain HTML + CSS + vanilla JS. The
  animation itself lives in the one HTML file; the page around it comes from two shared
  files (see [The demo page](#the-demo-page)).
- **No CDN / external requests.** A page loads only files from this repository: the two shared
  files, the site font, the site icons and its own `README.md`. If a technique needs a library
  in production (GSAP, Three.js), mention it in the README's *Production notes* — but
  demonstrate the principle with vanilla code.
- **Keep demos under ~300 lines.** If it's longer, the explanation has failed.
- **Must work offline.** Open the HTML in a browser and it runs (from a checkout of the
  repository, which holds the shared files the page links).
- **This catalogs techniques, not tools.** GSAP, Framer Motion, and Lottie are tools that
  *implement* techniques. They belong in *Production notes*, never as their own entry.

## Categories (do not add new top-level categories without opening an issue first)

| Folder | Category |
|--------|----------|
| `01-scroll-based` | Scroll-driven techniques |
| `02-entrance-and-exit` | Element enter / exit / reveal |
| `03-page-transitions` | Full-page / route transitions |
| `04-micro-interactions` | Hover, click, focus, loading, UI feedback |
| `05-text-typography` | Text-specific animation |
| `06-3d-advanced` | WebGL, shaders, particles, 3D transforms |
| `07-ambient-background` | Passive looping effects |

## Adding a new technique

1. **Open an issue** using the *New technique* template so we can agree on the category,
   the slug and the kind of page (see [Page kinds](#page-kinds)).
2. Create `animations/<category>/<slug>/index.html`. Copy the closest existing page of the
   same kind and change the demo, its settings and its texts, so the shared parts of the
   page stay as they are (see [The demo page](#the-demo-page)). Good pages to copy:
   `rotate-in` (plays once), `aurora` (loop in CSS), `starfield` (loop in JavaScript),
   `checkmark-draw` (do it), `snap-scrolling` (scroll).
3. Create `README.md` with **exactly** these six sections:
   1. **What it is** — 2–3 sentence definition
   2. **When to use it** — bullets of real use cases
   3. **How it works** — the mechanic, with a code snippet
   4. **Key parameters** — the values that matter
   5. **Production notes** — gotchas, library equivalents
   6. **See also** — links to related entries

   The tests require *What it is*, *When to use it*, *Key parameters* and *See also*; the
   other two are required by convention. The page loads *What it is* and *See also* from this
   file, so write *What it is* and *Key parameters* in plain words with no code. Each *See also*
   line is `- [Title](../slug/) — one plain phrase`, where Title is the linked page's `<h1>`.
   *Key parameters* has one row per setting in Try it, named exactly as on the page. Opened
   from disk (`file://`), a page shows a README link in place of *What it is* and hides
   *Similar animations*; that is expected.
4. Link it in: the page before it gets a Next link to it and the page after it a Previous link
   to it, each replacing its old one, if any (a page never has two `rel="next"` or two
   `rel="prev"` links); the new page links back to both. A new first or last page has one
   neighbor, so one link. Use the linked page's `<h1>` in the link text and in the
   `aria-label`, and copy the markup from a neighbor. Adding a page in the middle of a category
   renumbers the `NN.MM` category line of every later page.
5. Register the entry in the root `index.html` `CATS` array (slug, name, one-line description),
   give it one or more places in `PLACES`, which sits right after `PV` in the same script (the
   home page's tiles: `btn` Buttons, `text` Text, `imgcard` Images & cards, `bg` Backgrounds,
   `menu` Menus & forms, `load` Loading & messages, `intro` Page intros, `scroll` Scrolling,
   `page` Page changes; the first labels its card) and add the page to `sitemap.xml`. The
   description is the page's one-line description, word for word. The entry goes at the same
   position in `PLACES` as in `CATS` (both lists follow home page order; a test checks it).
   Give the card its own preview too: its key in `PV`, its CSS at the end of the category's
   `/* ── bespoke: … ── */` block (light: CSS with transform and opacity, no new canvas engine,
   inside its 16:10 stage), its markup as a `case` in `pvMarkup()`, and a `STILL` point when the
   middle of its loop is not a clear frame (reduced motion holds every preview there). Without
   one the card shows the category's generic picture.
6. Add it to the category's `README.md` list (and to any other table there that names pages,
   such as 07's Implementation summary) and to the list in the root `README.md`, with the same
   name and description, and update the technique count where it is written: the root
   `README.md` (the total and the category's count), the home page (its title and meta tags
   too), `.github/ISSUE_TEMPLATE/config.yml` and `docs/launch-kit.md` (its sitemap line counts
   the home page as well: the total plus one); the tests compare each with `CATS`. Leave the
   picture `og-image.png`, which shows the count too, to the maintainer, who redraws it (a new
   social image is planned). The home check needs no edit: it reads its totals from `CATS` and
   `PLACES`.
7. Run the tests and the page check (see [Tests and the page check](#tests-and-the-page-check))
   on the new page and on every page you edited. Run the home page check (`home`) too: the
   new card's Copy prompt is compared there.

## The demo page

Every demo is one column with three steps, then a short explanation:

1. **Watch it** — the stage, with the player bar right below it.
2. **Try it** — one to three plain settings, each with a hint, and the rest under
   **More options**. A demo with no settings leaves this step out.
3. **Copy the prompt** — the prompt, the "Your settings" chips and a **Copy prompt** button.

Then **What it is** (from the README), **Good for** (3–5 short tags) and **Avoid on**
(1–3 tags), and **Similar animations** (from the README's *See also*). Above it all sit a
top bar with Previous and Next links and a header: the category line, the title and a
one-line description in plain words that ends "Best for …". That one sentence is also the
page's meta, Open Graph, Twitter and JSON-LD description, its card on the home page and its
line in both READMEs. The `<head>` holds the title `Name — Animation Handbook`, the canonical
URL, the favicons, and the Open Graph, Twitter and JSON-LD tags that repeat the name and
description; copy them from a neighbor page and change them together.

### Shared files

Two files draw and run the page around the demo. Every page links them after its own
`<style>`, with the same version number `N`:

```html
<link rel="stylesheet" href="../../../assets/css/demo-page.css?v=N">
<script src="../../../assets/js/demo-page.js?v=N" defer></script>
```

`assets/css/demo-page.css` holds the layout and the site font; `assets/js/demo-page.js` fills
in the "Your settings" chips, Copy prompt, What it is and Similar animations, and runs the
arrival, Pause, Slow motion, Show me, Play and reduced motion. **When either file changes,
bump `N` on every page in the same change**, so visitors do not keep a cached older copy. A
test fails when the pages do not all use the same `N`. The home page links
`assets/js/demo-page.js` too (for its cards' Copy prompt), with the same `N`.

The page owns the stage's width, border, corners and height. The demo owns everything
drawn inside it (overflow, background, alignment, perspective).

### Page kinds

Set the kind on the body: `<body class="hb" data-hb-kind="once|loop|do|scroll">`. It decides
the player bar under the stage.

| Kind | Step 1 | Controls | On arrival | Reduced motion |
|---|---|---|---|---|
| `once`, plays once | Watch it | **Replay** (`data-hb-replay`), **Loop** (`data-hb-loop`), **Slow motion** (`data-hb-slowmo`) | Loop switches on, so it plays and repeats | Loop and Slow motion off and grayed out; Replay plays it once |
| `loop`, moves by itself | Watch it | **Pause**/Play (`data-hb-pause`), **Slow motion** where it works, sometimes **Reset** (`data-hb-reset`) | Nothing; it is already moving | Starts paused; Slow motion off and grayed out |
| `do`, the visitor acts | Hover it, Click it, Drag it, Scroll it or Press Tab | **Show me** (`data-hb-demo`), **Reset** where there is a state to reset, **Slow motion** where it works | Show me runs once, unless the visitor got there first | Show me does not run on arrival; it works when pressed |
| `scroll`, driven by scroll | Scroll it | **Play** (`data-hb-autoscroll`), **Back to top** (`data-hb-top`) | Play runs once: the box scrolls to its end in about six seconds | Play does not run on arrival; it works when pressed |

Put `data-hb-autoplay` on the body of every kind except `loop`. The tests pin the Pause, Show
me, Reset, Play and Back to top buttons character by character, so copy the player bar from a
page of the same kind. A few details:

- A do-it page's Show me run stops when the visitor uses the stage. The shared script sends
  `hb:input` on `document` for a real press, key, wheel, touch or click, and the demo listens.
  The press on arrival is skipped when the visitor has already used the stage, moved focus into
  it or pressed Show me, so a page must not call `focus()` on anything in its stage while it
  loads.
- A demo with its own timers listens to `hb:pause` (`detail.paused`) to stop and start them.
  Register the listener at the top level of the page's script, not in a `DOMContentLoaded`
  handler: under reduced motion the shared script sends the event once at boot, before that.
- `data-hb-slowmo="css"` and `data-hb-pause="css"` let the shared script slow or hold the
  stage's CSS animations; with no value the demo does it itself.
- On a scroll page the scroller is the stage, or the element marked `data-hb-scroller`. Play
  scrolls it at a steady speed and any real input in the stage stops it.
- `data-hb-motion-note` on the body of a scroll page after `data-hb-autoplay` (and only there)
  sets the note that reduced motion shows in the player bar. Use it when reduced motion
  switches an effect off instead of only stopping its animation, and write one sentence with
  no full stop ("The layers stay still while the box scrolls"); the shared script adds
  " because your device is set to reduce motion." Without it the note reads "The effects
  follow the scroll without animating".
- `data-hb-skip` leaves a control out of "Your settings"; `data-hb-label` sets its label.

Three rulings hold on every page: Pause freezes the stage at once (running transitions and
timers stop mid-way); every setting and control visibly changes the stage; and after Back to
top or any jump, a scroll page shows the state for the new position at once.

### Settings

Give each setting a plain label that says what changes ("How much it spins", not "Rotation
(deg)"), the control, and one hint line. Prefer named choices ("Slow · Normal · Fast") to
numbers, switches for on/off ("Grows from small"), and a slider only when sliding is the
point (it shows its value in plain words). Playback is not a setting; the player bar has
it. Every control has a label and `autocomplete="off"`, and each group of choice buttons
has exactly one pressed. The "Your settings" chips and the copied prompt list each setting
as `label: value`. Copy the markup from a page that uses the control you need. No page has
a slider or a menu yet; for those, follow the controls table in
`docs/superpowers/specs/2026-09-27-demo-page-rollout-design.md`.

### The copyable prompt

The prompt is written in the page, in plain words: 60 to 130 words, never more, with no code.
It starts with what to build and where ("Add a … to [the element you want to animate]"), with
[square brackets] around the parts the reader fills in. It says what the viewer sees, the one
or two rules that make it look right, how to keep it smooth, what to do under reduced motion,
and the touch equivalent of a hover or drag. It does not state a value that a setting controls,
and it ends with "Match the settings listed below." when the page has a Try it step.

### Colors

The demo's own styles use CSS variables for colors and default to a dark stage with light
cards. Set `--ui-accent` in `:root` to your category's color (copy it from another page in
the category); the shared stylesheet uses it for the step numbers, chips and pressed buttons.

### Font

The site font is Schibsted Grotesk, loaded by the shared stylesheet. Stage text uses it too,
so a demo does not set its own family. A typewriter (monospace) font is only for effects
about typing.

### Reduced motion

When the visitor asks for reduced motion, Loop and Slow motion are shown off and grayed out
with a short note in the player bar, and loops start paused. On arrival a plays-once page
plays its reduced version once, so the stage is not empty; Show me and Play wait to be
pressed. Replay, Pause, Show me and Play still work when pressed. The demo's own CSS and
script show the end state or a fade instead of movement.

## Responsiveness (mandatory)

Every demo must work on mobile, tablet, and desktop.

- Layouts use Grid/Flexbox with `%`, `fr`, `minmax()`, or `clamp()` — no fixed pixel widths.
- The page is one column at every size: the player bar sits right below the stage and the
  settings below it, with nothing beside the stage.
- Touch targets are at least **44×44px**; gate hover effects behind `@media (hover: hover)`.
- Drag interactions use Pointer Events, not mouse events.
- Animate `transform` and `opacity` only — never `width`, `height`, `top`, `left`, or `box-shadow`.
- A JavaScript frame loop moves by the time since the last frame (in 60ths of a second, at most 50 ms), never by a
  fixed step per frame, so it runs at the same speed on every screen. Copy the loop of Synthwave Grid, Starfield
  (trails that fade) or Cloth Simulation (physics in fixed steps).
- Text is at least 4.5:1 against its background.
- Respect `@media (prefers-reduced-motion: reduce)`.

### Self-check before opening a PR

- [ ] Layout reflows cleanly at 375px width.
- [ ] All touch targets ≥ 44px.
- [ ] Works with touch scroll / drag, not just mouse.
- [ ] Text stays readable at every size, at least 4.5:1 against its background.
- [ ] The player bar is right below the stage and Try it under it; nothing beside the stage on mobile.
- [ ] Respects `prefers-reduced-motion`.
- [ ] Runs offline with no external requests.
- [ ] The tests and the page check pass.

## Tests and the page check

Both need Node 22 or later (the `--test` glob pattern and the page check's global `WebSocket`).
Run the tests from the repo root:

```
node --test "tests/*.test.js"
```

They check every page (the template's parts, the player bar of its kind, labels, the prompt
rules, one description across the page, its meta tags and its home card, one `?v=N`), every
page's README, the shared stylesheet and the home page. Nothing to install.

For the page itself, serve the repo and run the page check on the page or a whole category
folder. It drives Chrome, found at the default Windows install path; set the `CHROME`
environment variable to the browser's path on other systems:

```
python -m http.server <port> --bind 127.0.0.1
node tools/check-pages.mjs --base http://127.0.0.1:<port> animations/02-entrance-and-exit/rotate-in
```

It opens each page at six screen setups (1280×800, 1366×657, 768×1024, 375×812, 375×812 with
reduced motion, 320×640) and prints one line for each, so a passing page gives **six `ok`
lines**. A problem prints `FAIL` with the reason; console errors and warnings both count (a
control with no label or value is left out and the console warns). It skips controls inside
`.stage` when it measures touch targets, so check buttons and handles a demo draws there by hand.

The home page has a check of its own:
`node tools/check-pages.mjs --base http://127.0.0.1:<port> home`. It checks the layout at the
six setups. Its desktop run also tries the tiles, the search and Show all, and compares Copy
prompt on the home page with every page's own prompt and default settings; its phone run tries
a tile and the slim bar, and its reduced-motion run checks that nothing moves. Run it after
changing any page's settings or prompt.

## Writing style

Prose, not bullet-soup. Show, then explain. Avoid hype ("stunning", "powerful") — describe
what it does. Comment code only where it isn't self-explanatory. On the pages, write for
someone new to animation: plain labels, hints, descriptions and prompts, with no code and no
CSS property names. Use American spelling (color, behavior, center, neighbor, gray).

## Fixing a bug

Open an issue (or a PR directly for small fixes). Preserve every demo's behavior — visual
parity matters more than code elegance. Never combine multiple animations into one file. If
you change a shared file, bump `?v=N` on every page.
