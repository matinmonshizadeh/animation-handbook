# Demo Page: Guided Steps — Design Spec

**Date:** 2026-09-27
**Scope:** a new demo page template, built first on one page (Rotate In) for approval, then rolled out to all 129 demos
**Approved mockup:** option A ("Guided steps") on the canvas *Animation page: two options*
(https://claude.ai/artifact/7tgqozQGWKAmYDZyrPMhEj)
**Replaces:** the side-column layout in `2026-09-25-demo-page-redesign-design.md`. What carries over from that spec
is listed under "Kept from the first redesign".

---

## Why

After the first redesign went live, the user found the demo pages hard to use. On the Rotate In page:

- the animated icon was small in a very large, mostly empty stage;
- the settings used developer terms ("Starting rotation -180°", "Easing", "↺ CCW") with no explanation;
- there were too many settings at once, in a column that needed its own scrollbar;
- the prompt was squeezed into a small box with a long green settings line;
- the explanation was hidden behind "Read more";
- nothing told a visitor what to do first.

The new page answers one question at each step: what does it look like, what can I change, and what do I take away.

---

## The page, top to bottom

One centred column, at most 960px wide, in the same order on every screen size:

1. **Top bar** (sticky): the site mark and "Animation Handbook" (links home) on the left; previous and next
   animation on the right ("‹ Previous: Bounce In").
2. **Header:** the category line (`02.13 · Entrance & Exit`, in the category colour), the title, and a one-line
   description in plain words.
3. **Step 1 · Watch it.** A one-line help text ("It plays by itself. Turn on slow motion to see each part of the
   movement."), the stage, and a player bar below it: **Replay**, **Loop** (a switch) and **Slow motion** (a switch).
4. **Step 2 · Try it.** A one-line help text ("Change a setting and the animation plays again."), the two or three
   main settings, and a **More options** disclosure with the rest. Every setting has a plain label, large choice
   buttons or a switch, and a one-line hint under it.
5. **Step 3 · Copy the prompt.** A one-line help text ("Paste it into an AI assistant such as ChatGPT, Claude or
   Cursor to build this in your own project."), then a card with the whole prompt (the part in square brackets is
   highlighted), the current settings as chips under "Your settings", a large **Copy prompt** button, and the hint
   "Replace the words in brackets with your own element. Your settings are added at the end."
6. **About:** **What it is** (from the README) beside **Good for** and **Avoid on** (short tags).
7. **Similar animations:** cards built from the README's See also list.
8. **Footer:** "Animation Handbook" and a "Back to top" link.

Each step starts with a numbered badge in the category colour. The step titles and help lines are written into
each page, so a demo that works differently (hover, scroll, drag) can say so ("Hover over the card").

### Sizes

| | Desktop (≥ 1025px) | Tablet (601–1024px) | Phone (≤ 600px) |
|---|---|---|---|
| Column | 960px max, centred | full width, 24–40px side padding | full width, 16px side padding |
| Stage height | `clamp(300px, 100svh − 420px, 440px)`, so the stage and player bar fit on a laptop's first screen | same | 300px |
| Settings in Try it and More options | two per row | two per row from 760px, one per row below | one per row, choices fill the width |
| Prompt | whole text | whole text | first five lines, then "Show the full prompt" |

Headings scale with `clamp()`. Every button, switch and link is at least 44×44px on phones. On short laptop screens
(601px wide or more and at most 760px tall) the header tightens and the stage can shrink to 260px, so the stage and
player bar still fit on the first screen.

---

## Behaviour

- **Plays by itself.** When the page opens, Loop is on and the demo starts looping about 400ms after load. With
  reduced motion turned on, Loop starts off and the demo shows its resting state.
- **Replay** plays the animation from the start. If Loop is on, it keeps looping from there.
- **Slow motion** makes every movement three times slower: the demo stretches its own durations and the timers that
  wait for them, while the pauses between loops keep their length. It takes effect from the next play, so the page
  replays straight away.
- **Changing a setting** replays the animation about 250ms after the last change, whether or not Loop is on, and
  updates the "Your settings" chips. Each chip reads `<label>: <value>` ("Speed: Normal", "Fades in: on").
- **More options** is a native `<details>` disclosure; its label reads "More options" when closed and "Fewer options"
  when open. Settings inside it still count in "Your settings" and in the copied prompt while it is closed.
- **Copy prompt** copies the prompt, a blank line and `Settings from the demo: <label>: <value>, …`. The button says
  "Copied" for 1.5 seconds. If the browser blocks the clipboard, the page copies the same text through an off-screen
  text box; only if that fails too is the prompt selected, with the button showing the copy shortcut (Ctrl+C, or ⌘C
  on a Mac).
- **Opened from disk (`file://`):** the demo, settings and prompt work; What it is shows a link to `README.md`
  instead, and Similar animations stays hidden.

---

## Settings: how every demo's controls are written

These rules apply to the pilot and to every page in the rollout.

- **Plain labels** that say what changes ("How much it spins", "Speed", "Spin direction"), never code, CSS names or
  unit-first names ("Duration (ms)", "Easing").
- **Named choices over numbers.** A setting with a few meaningful values becomes buttons ("¼ turn · ½ turn · Full
  turn", "Slow · Normal · Fast"). A slider stays only when sliding through values is the point of the demo, and its
  value is shown in plain words.
- **On/off settings are switches** whose label reads as a statement ("Grows from small").
- **One hint line** under each setting says what it changes or how it feels ("A bigger spin feels more playful.").
- **Two or three main settings** are visible; the rest go under More options.
- **Playback is not a setting.** Play in, Play out, Reset and Auto-loop buttons are removed from the settings; the
  player bar replaces them.
- **No readouts.** Status lines and live value readouts ("Status: visible", "Rotation: -180°") are removed.

---

## How the shared script and a demo work together

The demo's own JavaScript still drives the animation. The shared script builds nothing inside the stage; it reads
and presses controls the page marks:

| Marker | On | Meaning |
|---|---|---|
| `data-hb-replay` | the Replay button in the player bar | plays from the start; keeps looping if Loop is on |
| `data-hb-loop` | the Loop switch (a checkbox) | the demo repeats while it is checked |
| `data-hb-slowmo` | the Slow motion switch (a checkbox) | the demo runs three times slower while it is checked |
| `data-hb-skip` | any control | left out of "Your settings" and the copied prompt |
| `data-hb-label` | any control | overrides the label used in "Your settings" |
| `data-hb-autoplay` | `<body>` | start playing on arrival (turn Loop on, or press Replay if there is no Loop switch) |

The player bar is written into each page (not generated), so it never shifts the layout and works as ordinary
buttons and checkboxes. Both switches start unchecked in the markup; `data-hb-autoplay` is what turns Loop on after
load, so there is one owner for autoplay. A demo that cannot loop leaves out the Loop switch; a demo that cannot run
slower leaves out Slow motion.

"Your settings" is read from every control inside the Try it step: button groups (`.seg`, the active button's text),
switches and checkboxes (`on` / `off`), sliders (the shown value) and selects (the selected option). A control is
left out when it or an ancestor is `[hidden]`, has `display: none`, or is marked `data-hb-skip`. Controls inside a
closed More options still count.

---

## Content per page

| On the page | Source |
|---|---|
| Category line, title, one-line description | `index.html` |
| Step titles and help lines | `index.html` (default wording above, adjusted per demo when needed) |
| Settings, their labels and hints | `index.html` |
| Prompt | `index.html`, as in the first redesign |
| Good for (3–5 tags), Avoid on (1–3 tags) | `index.html` (new) |
| What it is | README `## What it is`, loaded live |
| Similar animations | README `## See also`, loaded live; each description is one plain phrase |
| Not shown on the site | README `## When to use it`, `## How it works`, `## Key parameters`, `## Production notes` |

The README keeps all six sections for GitHub readers. Its Key parameters table uses the same setting names as the
page, and How it works matches the demo's current code.

---

## Shared assets

- **New:** `assets/css/demo-page.css` and `assets/js/demo-page.js`, linked by pages that use this template.
- The first redesign's `assets/css/handbook.css` and `assets/js/handbook.js` stay unchanged while the other twelve
  Entrance & Exit pages still use them, and are deleted once the last page has moved over. Until then the pure
  helpers that both scripts need (Markdown subset, README sections, See also, HTML escaping) exist in both files.
- `demo-page.js` keeps the UMD shape of `handbook.js`: pure helpers exported for Node tests, auto-boot in the
  browser.

---

## Kept from the first redesign

Schibsted Grotesk everywhere; the prompt written into each `index.html` and its writing guide (60–130 words, fill-in
parts in square brackets, ends with "Match the settings listed below."); README sections loaded live; no code
anywhere on the site; the category colours; the reduced-motion rules.

---

## The pilot: Rotate In

**Try it, main settings**

| Setting | Choices | Default | Hint |
|---|---|---|---|
| How much it spins | ¼ turn · ½ turn · Full turn | ½ turn | A bigger spin feels more playful. |
| Speed | Slow (1000ms) · Normal (600ms) · Fast (350ms) | Normal | Slow is easy to follow. Fast feels snappy. |

**More options**

| Setting | Choices | Default | Hint |
|---|---|---|---|
| Spin direction | Clockwise · Counter-clockwise | Clockwise | Which way it turns as it lands. |
| Bounce at the end | switch | on | Goes slightly too far, then settles. |
| Grows from small | switch | on | Makes the spin look like an arrival. |
| Fades in | switch | on | Softens the first moment. |

- **Loop:** spin in, pause, spin out, pause, repeat. Slow motion stretches the spins, not the pauses.
- **Stage:** the demo's icon becomes a symmetric amber star badge, as in the approved mockup, and grows from 120px to
  150px; the "Landed" caption and the Status and Rotation readouts are removed.
- **Player bar on phones:** Replay takes the first row and the two switches share the second, because the three do
  not fit on one line at phone widths.
- **Good for:** Icons · Badges and stars · Logos · Small decorations. **Avoid on:** Text · Wide boxes and cards.
- **Description:** "Spins into place while it grows. Best for icons, stars and badges." The page's meta, Open Graph
  and JSON-LD descriptions use the same sentence.
- **Prompt:** reworded so the switchable parts are not stated as fixed: "Add a rotate-in entrance to [the icon or
  badge you want to animate]. It should spin around its center as it appears. Growing from small at the same time
  makes it look like it is arriving rather than just turning, and a slight overshoot at the end makes the spin land
  instead of gliding to a stop. Use this on round or symmetric shapes like icons, stars, gears and badges; it looks
  wrong on text or wide rectangles. If the visitor has reduced motion turned on, show it in place without spinning.
  Match the settings listed below."
- **README:** Key parameters lists the six settings above; How it works matches the new demo code; See also reads
  "Flip In — swings in like a card turning over", "Scale In — grows from small, with no spin", "Bounce In — lands
  with a springy bounce".

The other twelve Entrance & Exit pages stay on the first redesign until the user approves the pilot.

---

## Verification

- **Unit tests** for the pure helpers in `demo-page.js` (Node's built-in runner, `node --test "tests/*.test.js"`).
- **Page checks** for every page that links `demo-page.js`: shared files linked, one of each part of the template,
  prompt rules, every README Key parameters name appears in the Try it step, See also and pager links resolve, no
  first-redesign markup left.
- **In a browser** at 1280×800, 768×1024 and 375×812, and again with reduced motion: no console errors and no
  horizontal scroll; the stage and player bar are on the first screen on desktop; every setting replays the
  animation and updates the chips; Replay, Loop and Slow motion work; Copy prompt copies the prompt and settings;
  What it is and Similar animations render; touch targets are at least 44px on the phone size.

---

## Open template questions for the rollout

The final review of the pilot found these. Rotate In does not need them, but the other pages do, so they are settled
in this spec and in `demo-page.css` / `demo-page.js` before the rollout plan is written.

- **Top bar on phones with both links.** Most pages have Previous and Next; at 375px the names wrap to several lines.
  On phones, show only the chevrons (the links keep their full names as labels).
- **Who owns the stage.** The page owns its width, height, border and corners. Overflow, background and alignment
  belong to the demo: 19 of the 26 scroll-based demos scroll inside `.stage`. Move those into a low-specificity rule
  and add a height variable for demos that need a different height.
- **Player bar variants.** Ambient loops use Pause rather than Replay, some scroll demos have "Reset scroll", and
  hover, click and drag demos are started by the visitor. Define a Pause/Play marker and its autoplay rule, decide
  whether Slow motion applies to continuous loops, allow pages without a player bar, and relax the "one Replay"
  page check.
- **Every control type in Try it.** Markup and styles for sliders (with a shown value such as
  `<output class="hb-value">`), selects, swatches, colour inputs and radio groups; a label fallback to the nearest
  `.hb-setting-name`; a page check that every control has a label and every choice group has exactly one pressed
  button; a console warning when a label or value comes out empty.
- **Reduced motion.** One rule for what Loop and Slow motion do when the visitor asks for reduced motion.
- **README checks.** Run the See also and "ready for the site" checks on every guided-steps page, not only Entrance &
  Exit.
- **Home page.** Its cards still show each demo's old description; update them to the new one-line descriptions.
- **Wrap-up.** `tests/pages.test.js` imports `sections` and `table` from `handbook.js`; move them before deleting it.

## Rollout (after the user approves the pilot)

1. The other twelve Entrance & Exit pages, then the remaining six categories one at a time, following the settings
   rules above. Every demo's controls are rewritten in plain words, which is most of the work.
2. Wrap-up: delete `handbook.css`, `handbook.js` and their tests; update CLAUDE.md, CONTRIBUTING.md and the page
   checks; delete `samples/demo-page-design.html`.

The rollout gets its own plan once the pilot is approved.

---

## Out of scope

- The home page.
- New demos or new categories.
- Changing what any animation technique is; only its settings and the page around it change.
