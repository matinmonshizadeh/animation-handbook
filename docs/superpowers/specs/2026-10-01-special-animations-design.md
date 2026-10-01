# 8 special animations (2026-10-01)

The owner asked for more eye-catching techniques and picked these eight from a brainstorm (2026-10-01); sections and
play styles below are approved. The handbook grows from 158 to 166. Each new page goes at the end of its section, so no
existing page is renumbered. When all eight are built, reviewed and checked, they go live without asking again (owner
ruling 2026-10-01).

**CLAUDE.md governs every page** (template, page kinds, Try it, prompt, README, colors, responsiveness, touch, reduced
motion, 60fps, frame-rate independence, 300-line limit, no external files — pictures are drawn in the page). These are
"special" effects: the demo must look impressive and finished, the way a visitor would want it on their own site, while
staying light enough for a mid-range phone (CLAUDE.md's phone fallback) and clear about how it works.

## The pages

Kinds: **once** (plays once), **loop** (moves by itself), **do** (the visitor acts). Places: `btn` Buttons, `text`
Text, `imgcard` Images & cards, `bg` Backgrounds, `menu` Menus & forms, `load` Loading & messages, `intro` Page intros,
`scroll` Scrolling, `page` Page changes; the first one labels the card. Demo ideas and settings are a starting point
(1–3 shown, plain labels, named choices preferred).

| Lane | No. | Slug | Title (h1) | Kind | Places | Demo, settings, notes |
|---|---|---|---|---|---|---|
| S1 | 02.14 | `shatter-effect` | Shatter Effect | once | imgcard, page | A card cracks into shards that tumble and fade, then the next card fades in (shards are pieces of the same card, clipped polygons moved with transform). Settings: number of pieces; where it breaks from (center / corner); gravity. Reduced motion: the card fades out. |
| S2 | 05.19 | `text-particles` | Text Particles | do · Hover it | text, intro | A word is drawn as many small dots; the pointer pushes them away and they spring back into the letters (canvas, dots sampled from the text). Touch: drag a finger. Show me sweeps through the word. Settings: dot size; how far they scatter; colors. Reduced motion: the word holds still, dots do not move. |
| S3 | 04.39 | `image-trail` | Image Trail | do · Hover it | imgcard, intro | Moving the pointer over a hero leaves a trail of pictures that pop up and fade (pictures drawn in the page: gradient cards or simple shapes, no image files). Touch: drag. Settings: how often a picture appears; how long they stay; size. Reduced motion: one picture appears where you point, no trail motion. |
| S4 | 04.40 | `gooey-menu` | Gooey Menu | do · Click it | menu, btn | Pressing one round button lets smaller buttons ooze out of it like liquid and pop into a row or arc (SVG goo filter on moving circles); pressing again pulls them back. Keyboard: Enter/Space, the items are real buttons. Settings: layout (row / arc / column); how gooey; speed. Reduced motion: items appear without the stretch. |
| S5 | 04.41 | `dynamic-island` | Dynamic Island | do · Click it | load, menu | A small black pill at the top of a phone grows into a full notification (a call, a timer, music) and shrinks back (scale and clip, never animate width). Settings: which notification; speed; bounce. Reduced motion: it changes with a fade. |
| S6 | 06.24 | `liquid-glass` | Liquid Glass | do · Drag it | imgcard, menu | A glass panel over a colorful scene bends and magnifies what is behind it at its rounded edges, with a soft highlight, and can be dragged around (SVG displacement filter with backdrop-filter where supported, a frosted fallback elsewhere). Pointer Events, keyboard arrows. Settings: how much it bends; frost; tint. Reduced motion: no motion of its own. |
| S7 | 06.25 | `holographic-card` | Holographic Card | do · Hover it | imgcard | A trading card tilts toward the pointer and a rainbow foil and glare slide across it (3D transform plus layered gradients moved with transform/opacity). Touch: drag. Settings: foil pattern; how far it tilts; glare. Reduced motion: no tilt, a still foil. |
| S8 | 06.26 | `infinite-zoom` | Infinite Zoom | loop | intro, bg | The view keeps zooming into a picture, and inside it a smaller picture waits, endlessly (a few nested scenes drawn in the page, scaled with transform so each one takes over seamlessly). Settings: speed; scenes; direction (in / out). Reduced motion: a still frame. |

**Previous / Next.** Each new page's Previous is its section's current last page: Rotate In (`rotate-in`, 02.13), Button
Loading States (`button-loading-states`, 04.38), Handwriting Draw (`handwriting-draw`, 05.18), 2D Physics (`physics-2d`,
06.23). In 04 and 06 the chain then runs in the table's order. The last new page of each section has no Next.

## Building in lanes

Eight lanes work at the same time, each in its own worktree `.superpowers/worktrees/sp-S<n>` on branch `feat/sp-S<n>`
from main, with its own port `898<n>` (S1 8981 … S8 8988). Each lane builds its one page to CLAUDE.md's "When asked to add
a new animation" steps, starting from the closest page of the same kind.

**What a lane changes** (so that its own tests pass):
1. Its new folder: `index.html` and `README.md` only.
2. The home page `index.html`: its `CATS` entry at the end of the section's `entries`; its `PLACES` entry right after
   the section's last entry; its own preview (key in `PV` right after the section's last slug; CSS at the end of the
   section's `/* ── bespoke: … ── */` block; a `case` in `pvMarkup()` right after the `case 'sigN':` line of its section;
   a `STILL` point if mid-cycle is not a clear frame) — light (CSS with transform and opacity, no new canvas engine),
   clear under reduced motion, inside its 16:10 stage.
3. Every written count the tests compare with the cards, set to 159 (158 plus its page): the home page texts and meta,
   the root `README.md` (alt text, intro, badge, "All N", the section's count in the Categories table and its heading),
   `.github/ISSUE_TEMPLATE/config.yml` and `docs/launch-kit.md` (its sitemap line: the total plus one). The tests name
   each sentence that disagrees.
4. `sitemap.xml`: one `<url>` right after the section's last URL, `lastmod` 2026-10-01; the root `README.md` list and
   `animations/<section>/README.md` table: one line after the section's last line (and any other table there that
   names pages).
5. Previous / Next: a lane whose page comes first in its section — S1 (02), S2 (05), S3 (04), S6 (06) — gives the
   section's current last page a Next link to its page. **Split sections** (04: S3 → S4 → S5; 06: S6 → S7 → S8): a later
   lane cannot see the earlier lanes' pages, so its page's Previous points to the section's current last page for now,
   it has no Next, and it does not edit the old last page. Integration links them.
6. See also links point only to existing pages (the 158), written as CLAUDE.md says.

**What a lane never changes:** `assets/` (the shared files), `tests/`, `tools/`, `CLAUDE.md`, `CONTRIBUTING.md`,
`og-image.png`, `docs/` other than the launch kit's counts, any page outside its own except the one Next link of item 5.

**Checks per lane:** `node --test "tests/*.test.js"` passes; the page check (`node tools/check-pages.mjs --base
http://127.0.0.1:<port> animations/<section>/<slug>`) gives six `ok` lines for the new page and for any existing page it
edited; the home check (`home`) gives six `ok` lines; screenshots of the page and its home card at 1280 and 375, normal and
reduced motion, looked at.

## Integration

One agent merges the eight lanes in lane order on `int/special-animations` from main and: keeps both sides in table
order where lanes of a section added lines at the same spot; links the split sections; sets every written count to 166
(the per-section counts: 02: 14, 04: 41, 05: 19, 06: 26); redraws `og-image.png` with `node tools/make-social-image.mjs`;
runs the tests, the home check and the page check on the 8 new pages and every edited page. Then a final whole-branch
review, one fix wave and a scoped re-review, the whole-site check (167 pages × 6 setups), merge to main and push.
