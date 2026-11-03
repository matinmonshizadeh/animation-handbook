# Color pop card previews — design

The owner's choice of 2026-11-03: of three pilot designs for the home page's card previews (A Midnight, B Paper screens,
C Color pop), **C · Color pop** goes to every card, drawn again by several builders at once.

## Goal

Every card preview in one bright, playful, consistent style; every animation with its own preview (no two cards share one);
every preview readable on a phone card (about 155 × 97 px) and on a desktop card (about 280 × 175 px). The Famous effects page
shows the same previews (written by `tools/make-famous.mjs` from the home page).

## The stage

Set once on `.pv` (the preview box), so a preview never draws its own background unless it is a night scene:

- the group's gradient (`--g1` → `--g2`, 150°), a soft white light in the top left and a faint white circle at the bottom right;
- the group colors live on the card's class: `.c1` blue (Scroll-Based), `.c2` green (Entrance & Exit), `.c3` purple (Page
  Transitions), `.c4` orange (Micro-Interactions), `.c5` pink (Text & Typography), `.c6` teal (3D & Advanced), `.c7` yellow
  (Ambient & Background);
- **night scenes** (stars, fireworks, lightning, fire, neon, rain at night, matrix, synthwave, space) use the dusk sky instead:
  `background:var(--cp-dusk)` on `.pv-<key>`, deep plum fading into the group color.

`.pv` is a size container: every length in a preview is in `cqw`/`cqh` (1% of the stage's width/height), `em` or `%`, never
px (except a 1px hairline), so a preview scales from phone to desktop.

## The kit (custom properties on `.pv`)

| Token | Use |
|---|---|
| `#fff` | objects: buttons, cards, panels, menus, big words |
| `--cp-ink` (#1c1a24) | details on white, ink words, silhouettes in front of a scene |
| `--cp-lip` | the solid lip under a white object (`box-shadow:0 1.3cqh 0 var(--cp-lip)`) |
| `--cp-lift` | lip plus a soft colored shadow: `box-shadow:var(--cp-lift)` on a white object |
| `--cp-sh` | the color of soft shadows |
| `--cp-word` | the lip under a big white word: `text-shadow:var(--cp-word)` |
| `--cp-tip` | the fingertip's white ring and shadow: `box-shadow:var(--cp-tip)` |
| `--cp-dusk` | the night-scene sky |
| `--cp-ease`, `--cp-inout`, `--cp-spring` | ease out (reveals), ease in-out (moves), bounce (arrivals and pops) |

Only these colors, the two group colors and white tints (`rgba(255,255,255,.2–.7)`). An effect that is about particular
colors (a red and cyan split, neon, a rainbow foil, fire) may use them, flat and bright.

## The pieces (the same everywhere)

- **White object**: rounded (at least 3.5cqh), `box-shadow:var(--cp-lift)`. A button is a pill about 46cqw × 19cqh with a
  900-weight ink label of 7.6cqh.
- **Press**: the lip is its own element under the face (`transform:translateY(2.2cqh)`); pressing moves the face down 2cqh onto
  it, then it springs back.
- **Fingertip** (every press, tap, hover and drag): 7.2cqh ink dot with the white ring:
  `width:7.2cqh;height:7.2cqh;margin:-3.6cqh 0 0 -3.6cqh;border-radius:50%;background:var(--cp-ink);box-shadow:var(--cp-tip)`.
  It comes in from the lower right, acts (a press scales it to .8 and moves it down with the face), and leaves.
- **Big words**: Schibsted Grotesk (`var(--disp)`) 900, 15–17cqh, letter-spacing −.045em, white with `text-shadow:var(--cp-word)`,
  or ink with none. A typing effect may use the monospace stack; no other fonts.
- **Text lines**: rounded bars 2.4–3cqh tall: ink for a heading, white or `--cp-lip` for body text.
- **Picture**: a rounded box with the group gradient, a white sun and an ink hill.
- **Page** (page transitions): a white panel with an ink header bar and three text lines; the next page is ink with white lines
  (or the gradient). Both fill most of the stage.
- **Scroll cue** (every Scroll-Based preview and any preview driven by scrolling): a rail at the right edge
  (`right:3cqw;top:20cqh;bottom:20cqh;width:1.8cqh;border-radius:1cqh;background:rgba(28,26,36,.2)`) with a white thumb
  (`height:20cqh;background:#fff;box-shadow:0 .5cqh 0 var(--cp-lip)`) that moves with the scroll.

## Composition

- Keep the top left (0–42cqw × 0–24cqh) clear: the place label sits there.
- The subject centers near (50cqw, 53cqh) and is at least 30cqh tall; a scene fills the stage.
- Show the effect itself at a glance, close to its demo page (the same kind of movement, the same idea), in this style.

## Motion

- Only transform and opacity move. Filters, backgrounds, clip-paths, shadows and sizes stay still.
- A loop of 3–6 s: arrive or act, hold long enough to read, reset. Arrivals and pops bounce (`--cp-spring`), moves ease
  in-out (`--cp-inout`), reveals ease out (`--cp-ease`).
- Every element that animates has the class `anim` (and so do elements whose `::before`/`::after` animate): the page pauses
  `.anim` while a card is off screen and under reduced motion.
- Keyframes are named `k-<key>-<what>`.
- **Reduced motion**: `hold()` sets every animation of a preview to one moment, `STILL[key]` × the duration of its first
  animation (0.5 when unset). Choose a moment where the effect reads clearly: not empty, not halfway between two states.

## Code rules

- Each preview: its rules (every selector starts with `.pv-<key>`) in its region of the style; its markup as one `case` of
  `pvMarkup()` in its region, a single expression with no helper outside `pvMarkup` (`tools/make-famous.mjs` runs `pvMarkup`
  on its own); its `STILL` point, if any, in its region of `STILL`.
- No `<animate>` (SMIL) but in Text on a Path, no new canvas engine. The four canvas previews (starfield, particles, gpgpu,
  flow) stay canvases, redrawn in this style on a transparent canvas; Counter and Scramble keep their scripts.
- `PV` gives each animation its own key (scroll-image-sequence `imgseq`, skeleton-loader `skeleton`, morphing-blob
  `morphblob`, animated-gradient-background `gradbg`, particle-constellation `constell` were added for that).

## The approved previews

The eight pilot previews the owner chose from are in the page as the reference: `ripple`, `spinner`, `hamb`, `typewriter`,
`flip3d`, `aurora`, `plx`, `slideup`.

## Rollout

Twelve builders, one per region (`r01a` … `r07b`), each in its own worktree, check their previews with contact sheets
(normal, phone and reduced motion) and a region lint. Then: merge, `node tools/make-famous.mjs`, the famous test's list of
previews that need a script (`particle-constellation` now draws in CSS), the tests, the page check's `home` and `famous`
targets, and a visual review of every card.
