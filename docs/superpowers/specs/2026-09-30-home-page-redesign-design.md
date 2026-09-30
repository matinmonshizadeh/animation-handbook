# Home Page Redesign — "Friendly guide"

**Status:** approved direction (A), spec for review · **Date:** 2026-09-30
**Design canvas:** https://claude.ai/artifact/KHpLZm8wNVyB8TqUpPPMDC (row "A · Friendly guide": desktop, phone, phone after tapping Buttons)

## Why

The owner wants the home page to be easier to use, with four goals: show animations sooner, find the right one faster,
look more exciting, and work better on phones. Visitors should find animations **by where they will go** (buttons,
text, backgrounds…), not by the seven technical categories. A first design (dark, category shelves, eleven filter
chips) was turned down as not friendly. Of two new directions the owner chose **A · Friendly guide**: a light page that
asks one plain question, answers it with nine picture tiles, and shows big cards with a visible **Copy prompt** button.

## The page, top to bottom (desktop)

1. **Top bar** — the logo and "Animation Handbook" on the left (links to the top); on the right "Browse all" (opens
   the All animations view, below), "How it works" (jumps to that section), the theme button, and a "GitHub" button
   that keeps today's star count.
2. **Hero**, centered, with six slow floating shapes at the sides (desktop only; decoration):
   - a small pill: "129 free animations · no coding needed", with a softly pulsing green dot;
   - the heading **"What do you want to animate?"**;
   - one line under it: "Pick a place, or describe it in your own words. Every animation plays live, and each one
     comes with a ready-made prompt for your AI assistant.";
   - a large search box (label for screen readers: "Describe the animation you want"; placeholder: "For example: a
     button that bounces when clicked") with a **Search** button inside it;
   - "Popular:" followed by five suggestions that fill in the search: fade in, typing text, loading spinner,
     parallax, confetti.
3. **Place tiles** — nine large buttons in one row, each a small moving picture on a soft color, its name and its
   count ("15 animations"). The places are in the table below. Pressing a tile shows that place's animations just
   below; pressing it again (or Clear) goes back to the start. The pressed tile gets a dark ring.
4. **Results** — a heading, a line under it, and a grid of cards (four across). What they show depends on the view
   (see Views).
5. **How it works** — a white band with three numbered steps:
   1. **Watch it** — "Every animation plays right on its page, so you see exactly what you will get."
   2. **Change it to fit** — "Try a few simple settings, like speed or direction, and watch the preview update."
   3. **Copy the prompt** — "Paste it into your AI assistant. It describes the animation in plain words, with your
      settings."
   and a last line: "Free and open source (MIT). No sign-up."
6. **Footer** — the logo, "129 web animations with live demos and copyable prompts.", GitHub and Back to top.

## Places

| Key | Tile name | In the address | Tile color | Tile picture |
|---|---|---|---|---|
| `btn` | Buttons | `buttons` | blue `#2f5bea` | a "Like" button pressed by a pointer, with a ring |
| `text` | Text | `text` | pink `#d6336c` | the word "Wow", letters bobbing in a wave |
| `imgcard` | Images & cards | `images-and-cards` | purple `#7048e8` | a small photo card (sun, hills) tilting |
| `bg` | Backgrounds | `backgrounds` | amber `#e8890c` | three soft color blobs drifting |
| `menu` | Menus & forms | `menus-and-forms` | teal `#0c8f7f` | a menu icon turning into an X |
| `load` | Loading & messages | `loading-and-messages` | orange `#e8590c` | a spinner above a filling bar |
| `intro` | Page intros | `page-intros` | green `#2b9a4a` | a mini page whose lines rise in one by one |
| `scroll` | Scrolling | `scrolling` | slate `#3b5b8c` | a phone outline with content scrolling |
| `page` | Page changes | `page-changes` | violet `#9c36b5` | two mini pages sliding past each other |

The tile background is its color mixed 12% into the card color. Every animation belongs to one or more places;
Appendix A lists them (54 of the 129 are in two or three places). The counts on the tiles are worked out from that
list, never typed in.

## Views

- **Start** (nothing picked, search empty): heading "Good places to start", line "Eight favorites from different
  places. Pick a place above to see more.", these eight cards in this order: Click / Tap Ripple, Typewriter Effect,
  3D Flip Card, Aurora / Northern Lights, Hamburger Menu Toggle, Loading Spinner, Parallax Scrolling, Slide Up Reveal.
  Each card shows its place as a small label on the preview. Under the grid: **Browse all 129 animations**.
- **A place**: heading = the tile name, line "15 animations" (its count), a **Clear** button on the right. The first
  eight cards, in home order (the order of today's `CATS`), then **Show all 15** when there are more than eight.
- **Search**: typing clears the picked tile and shows results as you type. Heading "Results for “fade in”", line
  "12 animations match." (or "1 animation matches."), cards with their place labels, first eight then Show all.
- **All animations** (from Browse all, in the top bar or under Start): heading "All animations", line "129 animations
  in 7 groups.", then the seven categories in today's order, each with a small heading (its number, name and
  count: "01 Scroll-Based 26 animations") and all its cards, each with its place label. This keeps the `NN.MM` line on every demo page
  meaningful: it is still the animation's place in this list.
- **Nothing found**: a white panel: "Nothing matches “zebra” yet", "Try a simpler word, or pick one of these:", the
  five popular suggestions, and **Browse all 129 animations**.

After a tile, a phone-bar chip or a Popular suggestion is pressed, the results scroll into view at every width, not
only on phones (owner ruling, 2026-10-01).

The view lives in the address, so a view can be shared and **Back** from a demo page returns to it:
`?place=buttons`, `?q=fade%20in`, `?view=all`, with `&all=1` once Show all is pressed. Pressing a tile, Browse all,
Clear or a suggestion adds a history step when it changes the address; typing only replaces the address. Old links
keep working: `?q=` as today, and `?cat=micro-interactions` (the category's name in the form today's chips write it)
opens All animations at that category's heading.

## Search

Search looks at each animation's name, its one-line description, the names of its places and its category name. The
query is split into words; common small words are dropped (a, an, and, the, that, this, to, for, with, when, on, in,
of, my, it, i, want, make, some); each word is matched by its start, so "bounces", "bounce" and "bouncing" all match
"bounce" (a typed word drops the first of the endings "ies", "ing", "ed", "es" and "s" that leaves at least three
letters with a vowel, but not the last "s" of "ss"; after "ing" or "ed", a doubled last letter other than l, s, f or z
loses one letter while three remain: "snapping" finds "snap", "ring" stays whole). An animation matches when at least
one word matches; results are ordered by how well they match (a word in the name counts 3, in a place name 2, in the
description 1), ties in home order. "a button that bounces when clicked" therefore puts Click / Tap Ripple, Bounce In
and the other button animations at the top.
The "/" key focuses the search and Escape clears it, as today.

## Cards

A white card (radius 20px, a soft shadow) with, inside it: the preview (today's live preview for that animation, on
its dark stage, radius 12px, 16:10), then the name, the page's one-line description (the same text as today, from
`CATS`), and a row with **Copy prompt** on the left and "Try it →" on the right. The whole card is one link to the
demo page (same tab); the Copy prompt button sits above that link. On a pointer device the card lifts slightly on
hover and its preview grows 4%.

**Copy prompt** copies exactly what the page's own Copy prompt gives before any setting is changed: the page's
prompt, then a blank line and "Settings from the demo: " with its default settings ("Pull strength: Medium, Reach:
Medium") and a full stop, the line left out when the page has no settings. The home page reads the page's HTML when
the button is pressed (and starts reading it early when the pointer rests on the card or the card gets focus), and
builds the text with the same shared code the pages use. The button shows "Copied" with a tick for about two
seconds, and a short message appears at the bottom of the window: "Prompt copied. Paste it into your AI assistant."
If the page cannot be read (opened from disk, offline) or the browser refuses the clipboard, the button says "Open to
copy" and pressing it opens the demo page at its Copy the prompt step.

## Phones and tablets

- **Phone (≤ 600px):** hero heading 34px over two lines; the search box full width; the popular suggestions in one
  row that scrolls sideways; "Or pick a place" above the tiles in a 3 × 3 grid; cards two across, each with its
  description cut to two lines and a full-width Copy prompt button; How it works as three rows. After a tile or a
  search, a slim bar sticks to the top: a back button (to the start), the search box, and the place names as a row
  of chips that scrolls sideways, the picked one dark (canvas: "A · Phone after tapping Buttons").
- **Tablet (601–1024px):** tiles in a 5 + 4 grid, cards three across.
- **Desktop (≥ 1025px):** as described above; content 1280px wide at most, centered.

## Look

- Font: Schibsted Grotesk, as today (headings 800, body 400–700).
- Light theme: ground `#f8f7f4`, cards `#ffffff`, text `#16161b`, secondary text `#45454f`, quiet text `#676771`,
  lines `#e5e3dc`, links and focus `#2f5bea`, "Copied" green `#157a43`.
- Dark theme: ground `#0e0e11`, cards `#17171c`, text `#f4f4f2`, secondary `#c6c6cc`, quiet `#9c9ca5`, lines
  `rgba(255,255,255,.13)`, links and focus `#86a8ff`.
- The page follows the visitor's system setting on the first visit and remembers the theme button, as today
  (`ah-theme`). The previews keep their dark stages in both themes.
- Radii: tiles 22px, cards 20px, previews 12px, buttons and the search box fully round.

## Motion, reduced motion and speed

- Previews play only while on screen, as today. The tile pictures and floating shapes use transforms and opacity
  only.
- With reduced motion: the tile pictures, previews and the pill's dot hold still on a clear frame, the floating
  shapes are hidden, and cards do not lift. Every preview holds still on a clear, recognizable frame of its animation,
  never an empty stage; the preview code may change for that, but only under reduced motion (owner ruling, 2026-10-01).
- The All animations view renders all 129 cards but only the visible previews run.

## Accessibility

Tiles are real buttons with `aria-pressed`; the results line is announced politely when it changes; the search has
a label; every control is at least 44 × 44px; text is at least 4.5:1 against its background in both themes; focus
shows a 3px ring; the card link's name is the animation's name, and Copy prompt's label says which animation it
copies ("Copy prompt for Magnetic Button").

## What stays and what goes

- **Stays:** the `CATS` data and its order, every preview, the theme button, the GitHub star count, the "/" and
  Escape keys, `?q=`, the meta tags, Open Graph, structured data and `sitemap.xml`, the no-JavaScript note.
- **Goes:** the giant "Animation Handbook" title, the stats row, the category chips, the category sections on the
  first view (they move into All animations), and the small "live" dot on cards.

## Data and files

- `index.html` stays one self-contained file. `CATS` keeps its shape (`['slug','Name','Description']`), so the test
  that matches each card to its page is unchanged.
- A new `PLACES` object maps each slug to its place keys (`'click-ripple':['btn']`), like today's `PV` map; a `PICKS`
  list holds the eight Start slugs.
- For Copy prompt the home page links the shared `assets/js/demo-page.js?v=N` (it does nothing on the home page but
  lend its helpers). The code that turns a page into its copied text becomes one shared helper used by both the
  demo pages and the home page, so the two cannot drift; that change bumps `?v=N` on every page and on the home page.
- CLAUDE.md and CONTRIBUTING.md: adding an animation also means giving it one or more places in `PLACES`.

## Tests and checks

- The home test asserts the new heading and intro line instead of the old intro line.
- New tests: every `CATS` slug has at least one place and only known place keys; every place has at least one
  animation; the eight Start slugs exist; the home page links `demo-page.js` with the same `?v=N` as the pages; the
  counts written in the page ("129 free animations", "Browse all 129 animations", "129 animations in 7 groups.")
  match the number of cards in `CATS`. They are written in the HTML so they show without JavaScript.
- The page check gets a home mode (six screen setups, as for the pages): no console errors or warnings, no sideways
  overflow, 44px touch targets on phones, the search box and the first row of tiles on the first screen at 1280×800
  and 375×812, a tile press that changes the results heading, and, for every page, the home page's copied text
  equal to the page's own copied text before any change.

## Out of scope

The demo pages keep their dark look (a light theme for them could follow later); no new categories; no accounts,
favorites or server.

## Appendix A — animations in each place

**Buttons (15):** Hover State Animation, Click / Tap Ripple, Button Press Scale, Magnetic Button, Toggle / Switch
Slide, Heart / Like Burst, Success Confetti, Notification Badge Pulse, Tooltip Reveal, Modal Expand, Hamburger Menu
Toggle, Theme Toggle Morph, Copy to Clipboard, Star Rating, Segmented Control

**Text (21):** Counter Animation, Text Fill on Scroll, Slide Up Reveal, Split Text Reveal, Letter-by-Letter Stagger,
Word-by-Word Reveal, Kinetic Typography, Typewriter Effect, Scramble / Glitch Text, Variable Font Morph, Text
Clip-Path Reveal, Marquee / Ticker, Text Morphing, Text Gradient Animation, Outline to Fill, Enter/Exit Typography,
Rotate Word Carousel, Glitch Text, Text on a Path, Wavy Text, Chromatic Aberration

**Images & cards (33):** Parallax Depth-of-Field, Parallax Scrolling, Reverse-Scrolling Columns, Stacking Cards, Snap
Scrolling, Reveal on Scroll, Stagger Reveal, Horizontal Scroll, Zoom Into Image, Scroll Image Sequence, Scroll
Velocity Skew, Clip-Path Reveal, Blur In, Flip In, Shared Element Transition, Blur Transition, Dissolve, FLIP
Technique, Hover State Animation, Skeleton Loader, Modal Expand, Swipe to Dismiss, 3D Model Orbit, Scroll-Driven 3D
Rotation, Parallax 3D Tilt, Glassmorphism Animated, SVG Path Animation, 2.5D / Pseudo-3D, Image Distortion on Hover,
Cloth Simulation, 3D Flip Card, Grain / Film Noise Overlay, Light Leak

**Backgrounds (28):** Scroll-Driven Background Color, Cursor Follower, Canvas Particle Effect, Fluid Simulation,
Glassmorphism Animated, WebGL Shader Animation, Noise-Based Motion, Ray Marching / SDF, GPGPU Particle System,
Volumetric Smoke, Morphing Blob, Animated Gradient Background, Mesh Gradient Animation, Aurora / Northern Lights,
Grain / Film Noise Overlay, Scanline Effect, Light Leak, Starfield / Space Particles, Breathing / Pulsing Glow,
Ambient Ripple Effect, Floating Elements, Grid / Dot Pattern Parallax, Abstract Geometric Motion, Particle
Constellation, Flow Field, Synthwave Grid, Matrix Rain, Plasma Field

**Menus & forms (14):** Cover Card to Fixed Header, Scrollspy Navigation, Slide In, Scale In / Zoom In, Focus Ring
Animation, Toggle / Switch Slide, Checkmark Draw, Form Field Morph, Drawer / Panel Slide, Accordion Open/Close, Error
Shake, Hamburger Menu Toggle, Star Rating, Segmented Control

**Loading & messages (16):** Progress Bar, Slide In, Bounce In, Heart / Like Burst, Success Confetti, Skeleton Loader,
Shimmer Effect, Loading Spinner, Progress Animation, Checkmark Draw, Notification Badge Pulse, Error Shake, Copy to
Clipboard, Toast Notification, Pull to Refresh, Breathing / Pulsing Glow

**Page intros (18):** Fade In / Fade Out, Slide In, Slide Up Reveal, Scale In / Zoom In, Clip-Path Reveal, Curtain
Reveal, Split Text Reveal, Letter-by-Letter Stagger, Word-by-Word Reveal, Blur In, Flip In, Bounce In, Rotate In,
Kinetic Typography, Typewriter Effect, Text Clip-Path Reveal, Enter/Exit Typography, SVG Path Animation

**Scrolling (27):** Parallax Depth-of-Field, Parallax Scrolling, Reverse-Scrolling Columns, Cover Card to Fixed
Header, Fly-in Fly-out Contact List, Stacking Cards, ScrollTrigger Animation, Scrub Animation, Pin Animation, Snap
Scrolling, Scrollytelling, Reveal on Scroll, Stagger Reveal, Horizontal Scroll, Sticky Section, Counter Animation,
Progress Bar, Section Wipe, Zoom Into Image, Scroll Image Sequence, Smooth (Inertia) Scroll, Text Fill on Scroll,
Scroll Velocity Skew, SVG Line Draw on Scroll, Scrollspy Navigation, Scroll-Driven Background Color, Scroll-Driven 3D
Rotation

**Page changes (12):** View Transitions API, Shared Element Transition, Morph Transition, Crossfade, Slide Transition,
Zoom Transition, Flash / Light Leak, Blur Transition, Elastic Transition, Portal / Tunnel Zoom, Dissolve, FLIP
Technique
