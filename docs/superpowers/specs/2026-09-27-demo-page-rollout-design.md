# Demo Page Rollout — Design Spec

**Date:** 2026-09-27
**Scope:** moving the other 128 demo pages to the guided-steps page, one category at a time
**Builds on:** `2026-09-27-demo-page-guided-steps-design.md` (the approved page, live on Rotate In). This spec settles
that spec's "Open template questions for the rollout" and adds what the other kinds of demo need.
**Survey:** every page was read before writing this; the counts below come from that survey.

---

## Decisions made with the user

| Topic | Decision |
|---|---|
| Kinds of page | Four kinds (below). Only step 1 differs; Try it, Copy the prompt, About and Similar animations work exactly as on Rotate In. |
| Scroll and do-it pages on arrival | They show themselves once when the page opens (the box scrolls through once; a "Show me" run plays once), then wait for the visitor. |
| Publishing | Each category goes to the live site as soon as it is finished and checked, without asking again. |

---

## Four kinds of page

| Kind | About | Step 1 title | Default help line | Player bar | On arrival | With reduced motion |
|---|---|---|---|---|---|---|
| **Plays once** | 20 | Watch it | It plays by itself. Turn on slow motion to see each part of the movement. | Replay · Loop · Slow motion | Loop switches on (Replay once when there is no Loop) | Loop and Slow motion are shown switched off and cannot be switched on, with a note; Replay runs once so the stage is not empty |
| **Loops** | 30 | Watch it | It moves by itself. Pause it to look closely. | Pause · Slow motion | nothing (it is already moving) | starts paused; Play is one press away; Slow motion is shown switched off and cannot be switched on, with a note |
| **Scroll** | 27 | Scroll it | Scroll inside the box, or press Play and it scrolls for you. | Play · Back to top | Play once: the box scrolls to its end over about six seconds | no automatic scroll; Play still works |
| **Do it** | 50 | Hover it · Click it · Drag it · Press Tab (per page) | Written per page, e.g. "Point at a card, or tap it on a phone." | Show me · Reset (when the demo has a state to reset) | Show me once | no automatic run; Show me still works |

Each page declares its kind on the body: `<body class="hb" data-hb-kind="once|loop|scroll|do" data-hb-autoplay>`.
The step 1 title and help line are written into the page, so a demo can say exactly what to do. Slow motion appears
only where it works. A page whose demo has no settings leaves out the Try it step, and its steps are numbered 1 and 2.

---

## Player bar markers

The shared script still builds nothing inside the stage; it reads and presses controls the page marks.

| Marker | On | Meaning |
|---|---|---|
| `data-hb-replay` | Replay button | plays once: play from the start; keeps looping if Loop is on |
| `data-hb-loop` | Loop switch (checkbox) | plays once: repeat while checked |
| `data-hb-slowmo` | Slow motion switch (checkbox) | three times slower. With the value `css`, the shared script does it by setting `playbackRate` to one third on every CSS animation and transition inside the stage (including ones that start later). Without a value, the demo does it. |
| `data-hb-pause` | Pause button (`aria-pressed`; its label reads "Pause" or "Play") | loops: pause and resume. With the value `css`, the shared script pauses and resumes the stage's CSS animations. Without a value, the demo does it. |
| `data-hb-autoscroll` | Play button | scroll: the shared script scrolls the scroller from where it is to the end over about six seconds; any wheel, touch, pointer or key input on it stops the scroll |
| `data-hb-top` | Back to top button | scroll: the shared script stops any automatic scroll and jumps the scroller to the top |
| `data-hb-scroller` | the element that scrolls | scroll: only needed when that element is not the `.stage` itself |
| `data-hb-demo` | Show me button | do it: the demo plays one example of the interaction (about two to four seconds) and returns to rest; the visitor's own input stops it |
| `data-hb-reset` | Reset button | the demo returns to its starting state |
| `data-hb-skip`, `data-hb-label` | any control | as before: leave out of "Your settings"; override its label |

Every switch starts unchecked in the markup. A page has at most one of each marker, and all player markers sit
inside the player bar. Changing a setting always updates the chips. On plays-once pages it also replays the demo
(as on Rotate In); on loops the change shows while the demo keeps running; scroll and do-it pages show it the next
time the visitor scrolls or interacts, or presses Play or Show me.

---

## The stage

The page owns the stage's width, border, corners and height; the demo owns everything else.

- Height: `var(--hb-stage-h, clamp(300px, 100svh − 420px, 440px))` on computers and tablets,
  `var(--hb-stage-h-phone, 300px)` on phones, with the short-screen rule from the pilot. A demo that needs a
  different height sets `--hb-stage-h` or `--hb-stage-h-phone` (for example `auto` with its own `min-height` when
  typed text has to fit).
- Overflow, background, alignment and perspective belong to the demo. The shared default `overflow: hidden` is
  written with zero specificity (`:where(...)`), so a demo's own `.stage` rule wins. This keeps scroll demos (19 of
  the 26 scroll inside `.stage`), Accordion, Pull to Refresh, Smooth Scroll's comparison mode and Flip In's
  perspective working.
- The dotted background stays opt-in (`hb-dots`), for stages with a plain dark background.

---

## Top bar on phones

Most pages have both Previous and Next. On phones, when both links are there, only their chevrons show (44×44px
targets; each link keeps its full name as its label). With a single link, the phone shows "‹ Name" as on Rotate In.
The word "Previous:" or "Next:" is hidden on phones in every case. The Next link reads "Next: Name ›".

---

## Settings: markup for every type of control

The rules from the pilot stand (plain labels, named choices over numbers, switches for on/off, one hint each, two or
three main settings, playback is not a setting, no readouts). Each type of control is written one way:

| Control | Markup | Shown in "Your settings" as |
|---|---|---|
| Choice buttons | `.seg` with `role="group" aria-labelledby`, buttons with `aria-pressed` (and `.on`) | the pressed button's text |
| Switch | `label.hb-switch-row` with the label text and `input.hb-switch[role=switch]` | on / off |
| Slider | `label.hb-setting-name[for]`, the `input[type=range]`, and `output.hb-value[for]` showing the value in plain words or friendly units ("Slow", "0.6 s", "40%") | the `output.hb-value` text |
| Menu | `label.hb-setting-name[for]` and `select.hb-select` | the chosen option's text |
| Colour | `.swatches` of buttons with `aria-pressed` and a colour name as `aria-label` (colour pickers become named swatches) | the colour's name |
| Text | `label.hb-setting-name[for]` and `input.hb-text` or `textarea.hb-text` | the text, cut to 40 characters |

Radio groups become choice buttons. When a control has no label of its own, the reader uses the `.hb-setting-name`
in the same `.hb-setting`. If a label or value still comes out empty, the shared script logs a console warning.

---

## Reduced motion

Covered in the kinds table: plays-once pages play their reduced version once; loops start paused; scroll and do-it
pages do nothing on arrival. Loop and Slow motion are shown switched off and cannot be switched on, with a short note
in the player bar; Replay, Pause, Play and Show me still work when the visitor presses them.

---

## Per-page checklist

1. Category line, title, and a one-line description in plain words (also used for the page's meta, Open Graph and
   JSON-LD descriptions and for the page's card on the home page).
2. The page's kind, its step 1 title and help line, and its player bar.
3. Settings rewritten by the rules above, with hints; two or three main, the rest under More options.
4. A prompt, following the prompt writing guide from the first redesign spec: 60–130 words, fill-in parts in square
   brackets, what the viewer sees and the one or two rules that make it look right, a reduced-motion sentence, a
   touch equivalent for hover and drag, and nothing stated as fixed that a setting controls. It ends with "Match the
   settings listed below." only when the page has settings.
5. Good for (3–5 tags) and Avoid on (1–3 tags).
6. README: What it is in plain words; Key parameters names match the settings; How it works matches the code; each
   See also line ends with one plain phrase.
7. Old layout removed: headers and asides of the original layout, `.note`, readouts, "Copy source", the first
   redesign's `hb-view` markup and `handbook.css`/`handbook.js` links.
8. Stage text uses the site font; only effects about typing keep a typewriter font.

---

## Special cases found in the survey

- **Scroll Image Sequence** scrolls the whole window; it is rebuilt to scroll inside its stage.
- **View Transitions API** and **Shared Element Transition** animate outside any container; nothing clips them
  once the stage's overflow belongs to the demo.
- **Focus Ring** is a "Press Tab" page; Show me moves the focus through its items.
- **Modal Expand**, **Toast Notification** and the other click demos: Show me plays one click and returns to rest.
- **Rotate Word Carousel** and **Text Morphing** loop forever, so they are loops with Pause.
- **Pin Animation**, **Scroll Trigger** and **Sticky Section** have no settings, so they have no Try it step.
- **Curtain Reveal** plays on arrival like the other plays-once pages. This answers the open question from the first
  redesign.
- Pages that show several small examples at once (Hover State, Loading Spinner, Outline to Fill, Toggle Switch) keep
  them together in one stage.

---

## Checks for every category

- **Page checks** (`tests/pages.test.js`) run on every guided-steps page: the kind's player markers, labels on every
  control, exactly one pressed button per choice group, unchecked switches, prompt rules, README sections and See
  also links.
- **Browser check** (`tools/check-pages.mjs`, Node and the local Chrome, no packages): for each page at 1280×800,
  1366×657, 768×1024, 375×812, and 375×812 with reduced motion, it reports console errors, horizontal overflow,
  touch targets under 44px on phones, whether the stage and player bar are on the first screen of laptops, and the
  number of chips against the number of settings, and saves screenshots.

---

## Order

Each category has its own plan and is pushed when done. The order adds one new kind of player bar at a time:

1. **Entrance & Exit** (12, plays once): the two-link top bar, stage ownership, sliders, menus, swatches and text,
   the generalised page checks, the browser check tool, home page descriptions.
2. **Text & Typography** (14, plays once and loops): Pause.
3. **Ambient & Background** (17, loops): the CSS modes of Pause and Slow motion.
4. **3D & Advanced** (18, loops and do-it): Show me.
5. **Micro-Interactions** (29, do-it).
6. **Page Transitions** (12, do-it with clicks).
7. **Scroll-Based** (26, scroll): automatic scroll and Back to top.
8. **Wrap-up**: delete `handbook.css`, `handbook.js`, their tests and the old font files; move `sections` and
   `table` out of `handbook.js` for the tests; update CLAUDE.md and CONTRIBUTING.md; delete
   `samples/demo-page-design.html`.

---

## Out of scope

- New demos or categories, and changes to what any technique is.
- The home page layout (only the card descriptions change, to match each page).
