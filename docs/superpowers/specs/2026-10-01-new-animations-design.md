# 29 new animations (2026-10-01)

The owner asked to add 29 techniques the handbook does not cover yet, and approved the sections and play styles below
(2026-10-01). The handbook grows from 129 to 158. Each new page goes at the end of its section, so no existing page is
renumbered. When all 29 are built, reviewed and checked, they go live without asking again (owner ruling 2026-10-01).

**CLAUDE.md governs every page** (template, page kinds, Try it, prompt, README, colors, responsiveness, touch, reduced
motion, 60fps, frame-rate independence, 300-line limit, no external files). This document only adds what is specific to
these 29 pages and to building them in parallel lanes.

## The pages

Kinds: **once** (plays once), **loop** (moves by itself), **do** (the visitor acts; step 1 is "Hover it", "Click it",
"Drag it", "Scroll it" or "Press Tab"). Places: `btn` Buttons, `text` Text, `imgcard` Images & cards, `bg` Backgrounds,
`menu` Menus & forms, `load` Loading & messages, `intro` Page intros, `scroll` Scrolling, `page` Page changes; the first
one labels the card. The demo idea and settings are a starting point: the builder may change them within CLAUDE.md's rules
(1–3 settings shown, plain labels, named choices preferred).

| Lane | No. | Slug | Title (h1) | Kind | Places | Demo, settings, notes |
|---|---|---|---|---|---|---|
| L1 | 01.27 | `hide-on-scroll-header` | Hide-on-Scroll Header | do · Scroll it | menu, scroll | A small page scrolls inside the stage under a top bar; scrolling down slides the bar out of view, scrolling up brings it back. Show me scrolls down, then up. Settings: how fast it hides; when it comes back (any scroll up / only near the top); shrinks instead of hiding. Reduced motion: the bar fades. |
| L1 | 05.15 | `highlighter-sweep` | Highlighter Sweep | once | text | Marker color sweeps in behind key words of a sentence, one after another (scale a band from the left). Settings: marker color; speed; full band or underline band. Reduced motion: the highlights fade in. |
| L1 | 05.16 | `split-flap-board` | Split-Flap Board | once | text, intro | A row of flap tiles flips through letters to spell a word, like an airport board (top and bottom halves turn in 3D). Settings: the word (short text field, A–Z); flip speed; tile color. Reduced motion: letters change with a fade. |
| L2 | 05.17 | `neon-flicker` | Neon Flicker | loop | text, bg | A neon sign word glows and now and then flickers; one letter can buzz. Flicker with opacity of glow layers, never by animating shadows. Settings: color; how often it flickers (calm / normal / busy); a broken letter. Reduced motion: steady glow. |
| L2 | 05.18 | `handwriting-draw` | Handwriting Draw | once | text, intro | A word is drawn stroke by stroke as if by a pen (SVG strokes drawn in order; the word's paths are part of the page, no font files). Settings: the word (two or three ready-made words); pen speed; ink color. Reduced motion: the word fades in whole. |
| L3 | 03.13 | `circle-reveal` | Circle Reveal | do · Click it | page | Clicking grows the next page out of a circle at the click point (clip-path circle). Settings: speed; where it starts (where you click / center / corner). Reduced motion: crossfade. |
| L3 | 03.14 | `overlay-wipe` | Overlay Wipe | do · Click it | page | A colored panel sweeps across and covers the page, the page changes behind it, and the panel leaves the other side. Settings: direction; panel color; two stacked panels. Reduced motion: quick fade. |
| L3 | 03.15 | `page-curl` | Page Curl | do · Click it | page, imgcard | A page turns over like a book page, with shading, to show the next one. Settings: turn speed; forward or back; paper shading. Reduced motion: fade between pages. |
| L3 | 03.16 | `cube-transition` | Cube Transition | do · Click it | page, imgcard | Pages sit on the faces of a cube that turns to show the next one. Settings: turn direction; speed; depth. Reduced motion: crossfade. |
| L4 | 04.30 | `gradient-border` | Animated Gradient Border | loop | btn, imgcard | A card and a button whose border is a moving band of colors (a rotating gradient layer behind an inner box; rotate it, never animate the gradient itself). Settings: colors; speed; soft glow. Reduced motion: still gradient border. |
| L4 | 04.31 | `spotlight-hover` | Spotlight Hover Glow | do · Hover it | imgcard, btn | A soft light follows the pointer across a grid of dark cards and lights the edges near it (move a glow layer with transform). Touch: drag a finger. Settings: glow size; color; light the edges. |
| L4 | 04.32 | `add-to-cart-fly` | Add-to-Cart Fly | do · Click it | btn | Pressing Add to cart sends a copy of the product along an arc into the cart icon; the cart bumps and its count goes up. Settings: flight speed; arc or straight; cart bump. Reduced motion: the count changes with a fade, nothing flies. |
| L5 | 04.33 | `drag-to-reorder` | Drag to Reorder | do · Drag it | menu | Dragging a list item lifts it and the others slide out of the way; keyboard: Space picks up, arrows move, Space drops. Pointer Events. Settings: slide speed; lift (subtle / strong); drag by handle only. Reduced motion: items jump to their place. |
| L5 | 04.34 | `rolling-numbers` | Rolling Numbers | do · Click it | text, load | Each digit rolls up or down like a car's mileage counter when the number changes (columns of digits moved with translate). Settings: roll speed; direction (up / down / shortest); digits one after another. Reduced motion: digits change with a fade. |
| L5 | 04.35 | `typing-indicator` | Typing Indicator | loop | load | Three dots in a chat bubble bounce in turn while someone types, in a small chat. Settings: style (bounce / fade / wave); speed; bubble color. Reduced motion: still dots. |
| L6 | 04.36 | `hold-to-confirm` | Hold to Confirm | do · Click it | btn | Press and hold a "Hold to delete" button: a fill grows while held, drains if released early, and confirms with a check when full. Keyboard: hold Space or Enter. Settings: hold time; bar or ring; shake on early release. Reduced motion: the fill steps, no shake. |
| L6 | 04.37 | `expanding-search` | Expanding Search | do · Click it | menu, btn | A search icon in a toolbar opens into a search field and focus goes into it; Escape or leaving it closes it. Never animate the width: scale or clip. Settings: opens toward (left / right); speed; closes when you leave it. Reduced motion: opens at once. |
| L6 | 04.38 | `button-loading-states` | Button Loading States | do · Click it | btn, load | A Submit button turns into a spinner, then a check (or a cross), then back to its label. Never animate the width: scale or clip. Settings: result (success / error); speed; shrinks to a circle. Reduced motion: the label changes without the shape change. |
| L7 | 06.19 | `carousel-3d` | 3D Carousel | do · Drag it | imgcard | Cards stand in a ring in 3D; drag to spin it (with a little momentum), arrows step it. Settings: number of cards; tilted or flat; spins by itself. Reduced motion: steps without the spin. |
| L7 | 06.20 | `depth-map-photo` | Depth-Map Photo | do · Hover it | imgcard, intro | A picture drawn in the page (sky, hills, a tree, a foreground) plus its depth map; moving the pointer shifts near parts more than far ones, so the flat picture looks 3D (WebGL with a 2D canvas fallback). Touch: drag. Settings: depth strength; show the depth map. Reduced motion: still picture. |
| L8 | 06.21 | `flocking` | Flocking | loop | bg | Dots fly together like birds by three rules: keep apart, match direction, stay close (boids on a canvas, moved by elapsed time). Settings: flock size; loose or tight; flee the pointer. Phones: fewer birds. Reduced motion: still frame. |
| L8 | 06.22 | `ascii-halftone` | ASCII / Halftone | loop | imgcard, bg | A moving scene drawn in the page is redrawn as letters or as dots of different sizes. Settings: letters or dots; cell size; mono or color. Phones: larger cells. Reduced motion: still frame. |
| L8 | 06.23 | `physics-2d` | 2D Physics | do · Click it | intro, bg | Clicking drops shapes that fall, bounce and pile up; drag to throw one. Fixed time steps from an accumulator (CLAUDE.md). Settings: gravity (moon / earth / heavy); bounciness; balls or mixed sizes. Reduced motion: shapes appear at rest. |
| L9 | 07.18 | `wave-layers` | Wave Layers | loop | bg, intro | Three or four layered waves drift sideways at different speeds (repeated wave shapes moved with translate). Settings: speed; colors; wave height. Reduced motion: still waves. |
| L9 | 07.19 | `snow-rain` | Snow / Rain | loop | bg | Snowflakes drift and sway, or raindrops fall at a slant, over a dark scene (canvas, elapsed time). Settings: snow or rain; amount; wind. Phones: fewer drops. Reduced motion: still frame. |
| L9 | 07.20 | `fireworks` | Fireworks | loop | bg, intro | Rockets rise and burst into sparks that fall and fade (canvas; trails wash as CLAUDE.md says). Settings: how often; colors; trails. Phones: fewer sparks. Reduced motion: still frame of a burst. |
| L10 | 07.21 | `topographic-lines` | Topographic Lines | loop | bg | Map-like contour lines of a slowly changing field drift gently (canvas). Settings: line spacing; speed; color. Phones: coarser grid. Reduced motion: still lines. |
| L10 | 07.22 | `light-rays` | Light Rays | loop | bg, intro | Soft beams of light fall from a corner and slowly sweep, with optional floating dust. Settings: warm or cool; speed; dust. Reduced motion: still rays. |
| L10 | 07.23 | `game-of-life` | Game of Life | loop | bg | Conway's Game of Life: cells are born and die by simple neighbor rules; click or drag to draw cells; Reset seeds again. Settings: speed; cell size; start pattern (random / glider gun / acorn). Reduced motion: still frame. |

**Previous / Next.** The chain in each section runs in the order of the table. The first new page's Previous is the
section's current last page: Scroll-Driven Background Color (`scroll-background-color`, 01.26), FLIP Technique
(`flip-technique`, 03.12), Pull to Refresh (`pull-to-refresh`, 04.29), Wavy Text (`wavy-text`, 05.14), 3D Flip Card
(`flip-card-3d`, 06.18), Plasma Field (`plasma`, 07.17). The last new page of each section has no Next.

## Building in lanes

Ten lanes work at the same time, each in its own worktree `.superpowers/worktrees/new-L<n>` on branch `feat/new-L<n>` from
main, with its own port `88<90+n>` (L1 8891 … L10 8900). A lane builds its pages one at a time, each to CLAUDE.md's
"When asked to add a new animation" steps, starting from the closest page of the same kind (`rotate-in` once, `aurora` loop
in CSS, `starfield` loop in JavaScript, `checkmark-draw` do, and for a do page also the closest do page of its section).

**What a lane changes** (so that its own tests pass):
1. Its new folders: `index.html` and `README.md` only.
2. The home page `index.html`:
   - `CATS`: the lane's entries at the end of the section's `entries`, in table order.
   - `PLACES`: the lane's entries right after the section's last entry, in table order.
   - The card preview: its own key in `PV` (right after the section's last slug there); its CSS at the end of the section's `/* ── bespoke: 0N … ── */` block; its
     markup as a `case` in `pvMarkup()`, placed right after the `case 'sigN':` line of its section. It must be light (CSS
     with transform and opacity; no new canvas engine), hold a clear frame under reduced motion (add a `STILL` value
     if mid-cycle is not clear), and stay inside its 16:10 stage.
   - The four count texts the tests compare with the cards (hero pill, Browse all, footer, no-JavaScript note): set to
     129 plus the lane's own number of pages.
3. `sitemap.xml`: one `<url>` per page right after the section's last URL, `lastmod` 2026-10-01.
4. The root `README.md` list and `animations/<section>/README.md` table: one line per page after the section's last line,
   the card's name and one-line description.
5. Previous / Next: a lane whose pages come first in their section — L1 (01 and 05), L3 (03), L4 (04), L7 (06), L9
   (07) — gives the section's current last page a Next link to its first page there.
   - **Split sections** (04: L4 then L5 then L6; 05: L1 then L2; 06: L7 then L8; 07: L9 then L10): a later lane cannot
     see the earlier lane's pages, so its first page's Previous points to the section's current last page for now and
     its own last page has no Next. It does not edit the section's current last page. It uses its final numbers from the
     table. Integration links the lanes.
6. See also links point only to the 129 existing pages or to the lane's own new pages, written as CLAUDE.md says.

**What a lane never changes:** `assets/` (the shared files), `tests/`, `tools/`, `CLAUDE.md`, `CONTRIBUTING.md`, the
root README's count, badge and intro, `.github/`, `docs/`, any page outside its list except the one Next link of item 5.

**Checks per lane:** `node --test "tests/*.test.js"` passes; `node tools/check-pages.mjs --base http://127.0.0.1:<port>
animations/<section>/<slug>` gives six `ok` lines for each new page and for any existing page it edited; screenshots of
each new card's preview on the home page at 1280 and 375 wide, with normal and reduced motion, looked at. The home check
(`home`) still has the old totals written in it and fails on them until integration: do not run it as a gate and do not
edit the tool.

## Integration

One agent merges the ten lanes in lane order on `int/new-animations` from main and:
- resolves the places where two lanes of a section added lines at the same spot by keeping both in table order;
- links the split sections (Next and Previous between the lanes' neighbor pages; the first page of a later lane points
  back to the earlier lane's last page);
- sets every written count to 158 (home page texts and meta, root README count, badge and intro, the issue template,
  `docs/launch-kit.md`) and makes the home check read its totals and the Buttons count from the page instead of writing them;
- adds to CLAUDE.md's new-animation steps: give the card its own preview (`PV`, its CSS in the section's bespoke block and
  its `pvMarkup` case), else it shows the section's generic picture;
- runs the tests, the home check (six `ok`), and the page check on all 29 new pages and the edited existing pages.

Then a final whole-branch review, one fix wave and a scoped re-review, the whole-site check (159 pages × 6 setups), merge
to main and push.
