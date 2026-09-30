# Scroll-Based — Content Sheet, Part 1

This half of the Scroll-Based sheet decides, page by page, how the first thirteen Scroll-Based pages (home-page order, 01.01 Parallax Depth-of-Field to 01.13 Stagger Reveal) present their kind, step 1, settings, words and prompt on the guided-steps page. Part 2 (`2026-09-29-scroll-content-part2.md`) covers Horizontal Scroll to Scroll-Driven Background Color; this half follows its category rules wherever the two meet, so the 26 pages come out alike. The conversion tasks of `2026-09-29-demo-page-rollout-parallel.md` follow each section exactly, together with "How to convert a page" in `2026-09-28-demo-page-rollout-text-typography.md`, the rollout's Global Constraints, and the markup for pages without settings and scroll pages in `2026-09-29-demo-page-kinds-do-and-scroll.md`. Rotate In (`animations/02-entrance-and-exit/rotate-in/`) is the reference for everything a section does not mention; the do-it/scroll plan's scratch scroll page is the reference for a scroll page's step 1 and its scroller attributes.

Fix round 1 (2026-09-29) is applied: the owner's decisions and the category rules shared with part 2 follow, word for word as in part 2, and every section below follows them. Where a section and a shared rule seem to differ, the shared rule wins.

All thirteen are scroll pages. Parallax Depth-of-Field, ScrollTrigger Animation, Pin Animation and Scrollytelling have no settings, so they have no Try it step.

## Owner decisions (all accepted, 2026-09-29)

These decisions and the category rules below read the same in part 1 and part 2.

1. Parallax Depth-of-Field, Scrollytelling (part 1) and Horizontal Scroll (part 2) have no Try it step.
2. Snap Scrolling: Play glides through without snapping; snapping shows when the visitor scrolls, and the help line says so.
3. Both parallax pages: the drawing stretches to fill the wide box (`preserveAspectRatio="none"`) instead of cropping the front layer.
4. Cover Card: a short closing line fills the empty space at the end (steady scroll length kept).
5. Stacking Cards: the big faded number becomes an absolutely placed background watermark (`aria-hidden`), so 7 cards fit.
6. Stacking Cards: the decorative card button reads "View project →".
7. The player's "Back to top" and the footer's "Back to top ↑" both stay as they are.
8. Smooth (Inertia) Scroll is a do-it page: step 1 "Scroll it", with Show me and Reset (no Play / Back to top). Its step-1 help line ends ", or press Show me." (every do-it page does).
9. Smooth Scroll's glide mode answers keys: arrows ±40px, PageUp/PageDown/Space 90% of the box, Home/End 0/maxScroll (a `keydown` handler on the viewport in glide mode that moves the glide target).
10. Smooth Scroll's "Normal scrolling" switch stays out of the copied prompt (`data-hb-skip`).
11. Scroll Velocity Skew shows 28 rows.
12. Text Fill's paragraph is cut from 80 to 48 words.
13. Text Fill's unread words are a readable grey (about 4.8:1).
14. Background Color's text is pure white or black, flipping where both read equally (Forest flips too — say so wherever the sheet mentions only Daylight).
15. Scrollspy's menu links may be 36px tall on short laptop screens so the whole menu fits; touch screens keep 44px. Implement as: `@media (min-width:601px) and (max-height:640px) and (pointer:fine)` → 36px links (6×36 + 22 + 16 = 254px fits the 258px stage); with a coarse pointer in that range (a phone turned sideways) the links stay 44px and the rail scrolls (`max-height:calc(100% - 32px);overflow-y:auto`), keeping the active link in view by setting the rail's own `scrollTop` — never `scrollIntoView()`, which also scrolls the page.

## Category rules shared with part 2 (same wording in both halves)

1. **Phone rules:** the old mobile block goes, but each page section keeps and names the phone rules its stage still needs (part 1's wording). Part 2 must list them for Sticky Section (`#sticky-inner{grid-template-columns:1fr}#vis-col{display:none}`) and Scrollspy (its strip rules and `.sec{padding:80px 20px 36px}`).
2. **Focus ring on inner scrollers:** nothing on the page. The coordinator is adding `.hb-page .stage :focus-visible{outline-offset:-3px}` to the shared stylesheet, so everything focusable inside the stage (inner scrollers such as `[data-hb-scroller]`, `.viewport`, `.doc`, flush controls, Snap Scrolling's dots) gets the site ring drawn inset and never clipped. State this as a fact; drop any page-level scroller focus rule and the dots' `right:6px` idea. A stage that is its own scroller keeps the normal ring. A stage control with its own focus look still must beat `body.hb :focus-visible` (0,2,1).
3. **Smallest stage:** measure fits at the smallest shared stage too — 258px inside at 1280×590 (the shared stage drops to 260px on short screens) — as well as 327px (laptop) and the phone sizes. Overlays such as rails and dots must fit it.
4. **Trigger lines:** every trigger-line choice must be reachable within the box's scroll distance at every size, from the tallest box to a narrow window just over 600px (part 1: Reveal on Scroll, Stagger Reveal, ScrollTrigger Animation — check and state it).
5. **`container-type:size`:** only on a scroller whose height comes from outside (the stage, or `height:100%` of it); never together with `hb-grow`; never padding on that scroller (cqh measures its content box); any `cqh` use needs that container (without one it falls back to the viewport). No `--box-h` script fallback.
6. **Play stops on input:** the shared script stops Play on any trusted input anywhere inside the stage (pointer, wheel, touch, key). Sections state it as a fact; no page works around it (part 2's Scrollspy "blocker" line becomes a plain statement).
7. **Snapping during Play:** while Play runs, the shared script marks the scroller with `data-hb-autoscrolling`, and a shared rule turns CSS scroll snapping off on a marked scroller (`scroll-snap-type:none !important`). When the run ends, is stopped, or Back to top is pressed, the mark goes and the scroller's own snapping applies again — whatever the page set, even during the run. Pages set snapping however they like, but never with `!important`; Snap Scrolling's Snapping setting sets an attribute (e.g. `data-snap="mandatory|proximity|off"` with three CSS rules). When a wheel turn stops Play, snapping returns and the box settles on the nearest point by itself.
8. **Instant jumps:** Back to top, and Play restarting from the top, are instant jumps. Say so wherever an effect reads scroll speed or eases toward the scroll position; Velocity Skew ignores the frame after a jump (listen for clicks on `#btn-top` / `#btn-scroll`, by id) and measures speed per 1/60 s, so 120 Hz screens lean the same.
9. **Small stage text:** paragraph text in the stage is at least 14px; small labels (chips, ticks, captions, buttons) at least 11px. Part 1: `.chip-name`, `.card-sub`, `.card-btn`, `.dir` grow to 11px. Part 2: Smooth Scroll's `.card-body` and Background Color's `p` go to 14px.
10. **Text that changes every frame** (counters, depth numbers, frame counts): `role="img"` plus an `aria-label` with the real value, or `aria-hidden="true"` when it only repeats something else on the stage; never a live region (part 1: Scrollytelling's `#depth-num`, Scrub Animation's frame count and `.dir`).
11. **Small SVG labels:** counter-scale them to screen size (part 2's SVG Line Draw approach), or hide them on phones only where something visible repeats them (part 1's Scrub Animation `.mark-label`: the ticks repeat 0–100%).
12. **Decorative duplicates** (big numbers, repeated titles, picture SVGs) are `aria-hidden="true"` (part 1: Pin Animation's phone drawing, Stacking Cards' watermark).
13. **No `h1`/`h2` inside the stage:** the page outline belongs to the step titles. Use `p` (or `h3` for a real sub-heading). Part 1: Cover Card's `<h1 class="cover-title">` becomes `<p class="cover-title">` keeping `.cover-title`'s own sizing (the shared `.hb-page h1` rule restyles any stage h1 — Critical); Pin Animation's intro/outro `h2` and Cover Card's article `h2`s.
14. **Cue lines:** sentence case, centred, with side padding (`text-align:center;padding:0 24px`) — part 1's ScrollTrigger run-out cue included.
15. **Unchanged shared rules** stay identical in both halves: accent, category line, "Scroll it" and its help lines, Play · Back to top, scroller attributes, `--ui-muted:#8a8a92`, no `hb-dots`, Feel names from Entrance & Exit, the no-settings format, and the Try it help line "Change a setting, then scroll again or press Play." (do-it pages: "Change a setting, then try it again or press Show me.").

## Owner decisions and lessons that apply here

- **Stage text uses the site font.** None of these effects is about typing, so every `font-family` on stage text goes (`var(--disp)`, `var(--mono)`, `serif`, `monospace`, and the `font-family` attribute on SVG text), and so do the `@font-face` lines. The site font is loaded upright only, so italics on the stage go too, as on the Text & Typography stages.
- **Scroll pages show themselves once on arrival.** Every page uses `<body class="hb" data-hb-kind="scroll" data-hb-autoplay>`: 400ms after load the shared script presses Play, which scrolls the box from the top to its end at one steady speed, the whole box in about six seconds whatever its length.
- **Reduced motion runs nothing by itself.** The box does not scroll on arrival, while Play and Back to top still work when pressed. A page's own scroll effect may be simplified; each section says what the page's own reduced-motion code keeps. No page here has Loop, Slow motion or Pause, so the shared script greys nothing out and adds no note.
- **Long names in the top bar** (ScrollTrigger Animation, Fly-in Fly-out Contact List, Cover Card to Fixed Header, Reverse-Scrolling Columns) are cut with "…" by the shared stylesheet; the pages do nothing.
- **Lessons from the Text & Typography reviews** that apply here:
  - The page reaches the player controls by their ids (`btn-scroll`, `btn-top`), never by their `data-hb-*` attributes. Only Reveal on Scroll and Stagger Reveal listen to them. No page here needs `hb:pause` or `hb:input`.
  - Text whose layout the script measures is measured again after `document.fonts.ready` (Reverse-Scrolling Columns, as today; Cover Card to Fixed Header; ScrollTrigger Animation; Scrub Animation, whose drawing size depends on the panel's text).
  - Nothing here is typed text, and no text is split into letters. Text that changes every frame follows shared rule 10: Scrollytelling's depth and Scrub Animation's frame count.

## Rules for the whole category (as in part 2)

- **Accent and category line:** every page keeps `--ui-accent:#6ea8ff`. The category line is `01.NN · Scroll-Based`, where NN is the page's position on the home page, which its card already shows (01.01 to 01.13 in this half).
- **Step 1** is titled "Scroll it". Its default help line is "Scroll inside the box, or press Play and it scrolls for you." A section gives a page-specific line where it helps.
- **Player bar of a scroll page:** the Play button and then the Back to top button, exactly as in the do-it/scroll plan, and nothing else (no Slow motion, Replay, Loop or Pause).
- **Try it help line of a scroll page:** "Change a setting, then scroll again or press Play.", the fixed line for the kind; no page has its own. Most settings here redraw the box at once, where it is; the section says when a change waits for the next scroll.
- **The scroller** is the `.stage` itself on eleven pages. On Snap Scrolling and Reveal on Scroll an overlay (the dots, the trigger line) has to stay in place while the content scrolls: there the `.stage` does the job of today's `.stage-wrap` and holds an inner scroller marked `data-hb-scroller`, as on part 2's Progress Bar and Scrollspy Navigation. An overlay the visitor can press (Snap Scrolling's dots) sits inside that scroller, in a zero-height sticky rail (`.snap-rail{position:sticky;top:0;height:0;z-index:1}` as the scroller's first child, the overlay absolutely placed in it with its `top` in `cqh`): beside the scroller it would be a dead strip where a swipe, a wheel turn, or a key pressed after a press, scrolled the page and not the box, and CLAUDE.md requires scroll-driven demos to work with touch scroll. An overlay that only shows something (Reveal on Scroll's trigger line) sits beside the scroller or over it with `pointer-events:none`, so input goes through to the box. Any other pressable overlay follows the rail rule (part 2's Scrollspy menu). The scroller's focus ring comes from the shared stylesheet (shared rule 2); the page adds nothing. Every scroller gets:
  - `tabindex="0" role="region"` and an `aria-label` (each section gives it), so keyboard users can focus it and scroll it with the arrow keys;
  - `overflow-y:auto` (was `scroll`), keeping today's hidden scrollbar (`scrollbar-width:none` and the `::-webkit-scrollbar{display:none}` rule);
  - `position:relative`, so the `offsetTop` of anything inside it is measured from its own top (Fly-in Fly-out Contact List and Pin Animation read `offsetTop` and have it today).
  - The old stage's `flex`, `min-width`, `width`, `height`, `border` and `border-radius` go; the page owns them.
- **Stage height:** every page takes the shared stage height (300–440px on computers and tablets, 260–327px on short laptops, 300px on phones; 378px inside the border at 1280×800, 325px at 1366×657, 258px at 1280×590 and 298px on phones). No page sets `--hb-stage-h` or `--hb-stage-h-phone`, and none uses `hb-grow` (no page takes typed text). The old `--stage-h` (600–640px, and 480–560px on phones), its phone overrides and the old fixed stage heights go. Each section's fits were measured from the 258px box to the 438px box of a tablet and a 610px-wide window, and on 375px and 320px phones (shared rule 3).
- **What was sized in stage heights inside the box** is sized in the scroller's own height, as in part 2 and under shared rule 5: the scroller gets `container-type:size`, and `var(--stage-h)` (or the old stage height written in pixels) becomes `100cqh`, so `calc(var(--stage-h) * 4)` becomes `400cqh`. A pinned part stays exactly one box tall at every stage height, and the scene keeps today's proportions to its box. Measured in headless Chrome on Parallax Depth-of-Field, Stacking Cards (including its CSS scroll timeline) and ScrollTrigger Animation: the same pictures and scroll lengths as sizing with a pixel value. No scroller that has `container-type` has padding. Pages that size nothing from the stage (Fly-in Fly-out Contact List, Reveal on Scroll, Stagger Reveal) leave `container-type` off.
- **Every effect follows the scroller's `scroll` event**, an IntersectionObserver rooted on it, or a CSS scroll timeline, so it answers Play, Back to top, the wheel, touch and keys alike. No page reads the wheel itself or scroll speed. Any trusted input inside the stage stops Play (shared rule 6). While Play runs, the shared script turns snapping off (shared rule 7), so Snap Scrolling's Play glides through its sections. Back to top, and Play restarting from the top, jump at once (shared rule 8); the two pages that ease toward the scroll position (Parallax Depth-of-Field and Cover Card to Fixed Header) say so, and jump with the box when either button is clicked.
- **`:root`** keeps `--ui-accent:#6ea8ff` and the variables the stage rules still use. `--stage-h`, `--disp` and `--mono` go, and `--ui-muted` becomes `#8a8a92` wherever stage text uses it (the old `#77777e` is 4.4:1 on `#0b0b0d` and 4.2:1 on the cards' `#111114`; the new grey is 5.5:1 or more). Stage text faded with `opacity` below 4.5:1 is fixed in its section.
- **Small stage text** follows shared rule 9: paragraph text at least 14px, labels at least 11px (the old 8–10px labels were drawn in the monospace font). Each section gives the new sizes.
- **`hb-dots`** is left off on every page: the dots would stay still while the content scrolls over them.
- **Stage text shows no code.** Where a stage shows code or code names today (the cover card's code block, card texts such as "opacity 0 → 1", chips such as "IntersectionObserver"), the section gives plain replacement text.
- **Removed on every page:** the aside with its note, its readouts and its Reset, Reset scroll, Reset playhead, Replay or Return to surface button (Back to top and Play replace them), the old `header`, `.layout`, the `.ah-bar` and its Copy source script, and the old mobile block. Each section names the phone rules its stage keeps (shared rule 1); a section that names none keeps none.
- **Pages without settings** follow the do-it/scroll plan's Task 1: no Try it step, steps numbered 1 (Scroll it) and 2 (Copy the prompt), the `hb-chips` markup kept, a prompt without "Match the settings listed below.", a Copy prompt hint without "Your settings are added at the end." (the section gives it), and a README Key parameters table of the technique's own values, in plain words (no backticks: the page checks forbid code there).
- **Stage class names:** no element on a stage uses the class `seg` or `swatches` (the shared stylesheet styles them for Try it). None does today.
- **The page checks forbid the words "Read more"** anywhere on a page, so Stacking Cards' card button reads "View project →" (owner decision 6).
- **Headings, decorations and cues on the stage:** no stage keeps an `h1` or `h2` (shared rule 13); picture SVGs and decorative duplicates are `aria-hidden="true"` (shared rule 12); closing cue lines use the cue style, sentence case and centred (shared rule 14): 13px `#8a8a92`, `letter-spacing:.1em`, `text-align:center;padding:0 24px`.

## How to read a section

- **Sets in the demo** lists one value per choice, in the same order as the choices, then what the page calls so the box shows it.
- **Shown only when …** in the Control column means the setting's whole `div.hb-setting` gets the `hidden` attribute while it has no effect, so it also drops out of "Your settings".
- Switches in Try it keep their default in the markup (`checked` when the default is on), as on Rotate In.
- **Feel** uses the Entrance & Exit names where they fit: Smooth (slows to a stop), Gentle (eases in and out) and Even (one steady speed). Scrub Animation adds Slow start (starts slowly, then speeds up).
- **What scrolling shows** is what the visitor sees as the box scrolls, by hand or by Play.
- **Measured** sizes come from the site font in headless Chrome at the stage sizes above (the old page with the new sizes applied).

---

## parallax-depth-of-field — Parallax Depth-of-Field

- **Kind:** scroll. Scrolling moves five mountain layers at different speeds while the sharp focus travels from the far sky to the near ridge.
- **Description:** Layers move at their own speed as the focus shifts. Best for cinematic intros.
- **Step 1:** Scroll it · help line: default
- **Player bar:** Play · Back to top
- **Try it:** none (owner decision 1). The demo's only control, the Focal Plane slider, is not a setting: it moves the same 0–1 value that scrolling moves (a second way to scrub, like Scrub Animation's Seek slider), and the next scroll overwrites it. The page has steps 1 and 2.
- **Scroller:** the stage.
- **What scrolling shows:** a night landscape of five layers (sky, far peaks, mountains, hills, the ridge in front) held still in the box. As the box scrolls, each layer sinks by an amount that grows with its nearness, and the one sharp layer moves from the sky at the top to the ridge at the end; every other layer blurs by how far it sits from the sharp one. The layers ease toward the scroll position, so a wheel's jumps turn into a glide. Scrolling back reverses it. Back to top, and Play restarting from the top, jump the box at once, and the layers jump with it (a click on either button sets the eased value at once).
- **Scroll distance and Play:** `.scene` 400cqh with the sticky `.pinned` 100cqh: three box heights of scrolling (1,134px at 1280×800, 894px on a phone). Play racks the focus from far to near in six seconds.
- **Reduced motion:** nothing scrolls by itself. As today, the layers never move (the page's `reduced` flag keeps their offset at 0) and scrolling only moves the focus, without easing. The CSS rule `.layer{will-change:auto}` stays.
- **Stage font:** no text on the stage.
- **Stage:**
  - `.stage`: `position:relative;overflow-y:auto;scrollbar-width:none;container-type:size;background:#0b0b0d`, with `aria-label="Mountain layers that move and blur as you scroll"`.
  - `.scene{height:400cqh}`; `.pinned{position:sticky;top:0;height:100cqh;overflow:hidden}` (were `calc(var(--stage-h) * 4)` and `var(--stage-h)`).
  - The five layer SVGs get `preserveAspectRatio="none"` (was `xMidYMid slice`), as on Parallax Scrolling (owner decision 3), and `aria-hidden="true"`. The scene is drawn for a 3:2 box; in the new box, about 2.5:1 on laptops, `slice` crops it, and at the end of the focus pull the sharp front ridge shows only 30–45px at 1280×800 and a few tips at 1366×657. Stretched to fill, every layer shows at every size (measured, 258–438px boxes and phones); the hills look a little flatter on wide screens.
  - The layers' travel becomes a share of the box: `measure()` sets `MAX_OFFSET = stage.clientHeight * 0.19`, and `* 0.125` up to 600px wide (today 120px of a 620px stage and 60px of a 480px one): 72px at 1280×800, 49px in the 258px box of a 1280×590 window, 83px in a 438px box and 37px on phones. Each layer still sinks its own share of it (sky 0, far peaks 10%, mountains 25%, hills 45%, front ridge 70%). The blur stays 14px (8px up to 600px wide).
  - Script: the slider, its `input` listener and the `manual` flag go; `onScroll()` runs on every `scroll` event. `render()` keeps the blur and offset writes; its readout lines (`VALUES`, `ROWS`, the progress and focal texts) go. `measure()` keeps its resize listener, with the travel above.
  - `hb-dots`: no. Default height.
- **Removed:**
  - The note, and the Scroll Progress and Blur readouts.
  - The Focal Plane slider (see Try it).
- **Good for:** Hero scenes · Story intros · Illustrated landscapes · **Avoid on:** Large photos · Text-heavy pages
- **Prompt:**

  > Add a parallax depth-of-field effect to [your layered scene or illustration]. Split the scene into layers from far to near and hold it in place while the visitor scrolls through a taller section. As they scroll, move each layer by an amount that grows with its nearness, and move a point of sharp focus from the farthest layer to the nearest: blur each layer by how far it sits from that focus. Ease the layers toward the scroll position on every frame, so a mouse wheel's jumps turn into smooth movement. If the visitor has reduced motion turned on, keep the layers still and only shift the focus.

- **Copy prompt hint:** "Replace the words in brackets with your own scene."
- **README What it is:** rewritten:

  > Parallax depth-of-field combines two effects that follow the scroll. Each layer of a scene moves by an amount that matches how near it is, and a point of sharp focus travels from the farthest layer to the nearest, blurring every other layer by how far it sits from that focus. The result looks like a camera pulling focus through a landscape as you scroll.

- **README Key parameters:** the technique's own values (the page has no settings):

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Focus | Follows the scroll | Sharp on the sky at the top of the scroll and on the front ridge at the end; each layer blurs by its distance from it |
  | Strongest blur | 14px (8px on phones) | The blur of a layer as far from the focus as a layer can be |
  | Layer travel | 19% of the box's height (12.5% on phones) | What the layers' sinking is measured against: over the whole scroll the front ridge sinks 70% of it, the hills 45%, the mountains 25%, the far peaks 10% and the sky not at all |
  | Easing | 14% a frame | How much of the remaining distance the layers cover each frame; lower is smoother but lags more |
  | Pinned scene | Three box heights of scrolling | How much scrolling the whole focus pull takes |

- **README See also:**
  - [Parallax Scrolling](../parallax-scrolling/) — the same layered depth, without the blur
  - [Reverse-Scrolling Columns](../reverse-scrolling-columns/) — columns move against each other as you scroll
- **README How it works:** unchanged
- **README Production notes:** unchanged
- **Category line:** `01.01 · Scroll-Based`
- **Pager:** Previous: none · Next: Parallax Scrolling (`../parallax-scrolling/`)
- **Final fix wave (Scroll-Based final review, 2026-09-30).** A `click` listener on the document, for `#btn-top` and `#btn-scroll` (by id, as Velocity Skew and SVG Line Draw do), runs `onScroll(); current = target; render(current);`, so the layers stand at the box's new position in the same click instead of easing back over the whole focus pull. The shared script has already moved the box when the click reaches the document. README How it works gains a paragraph saying so.

---

## parallax-scrolling — Parallax Scrolling

- **Kind:** scroll. Scrolling moves four layers of a scene at different speeds.
- **Description:** Far layers move slower than near ones as you scroll. Best for hero scenes.
- **Step 1:** Scroll it · help line: default
- **Player bar:** Play · Back to top
- **Scroller:** the stage.
- **What scrolling shows:** a night scene of four layers (sky, ridge, trees, grass) held still in the box. As the box scrolls, each layer sinks at its own speed: at the default the grass sinks the most and the sky barely moves, so the flat picture looks deep. The grass just leaves the box at the end of the scroll. Scrolling back reverses it.
- **Scroll distance and Play:** `.scene` 300cqh with the sticky `.layers` 100cqh: two box heights of scrolling (756px at 1280×800, 596px on a phone). Play sinks the layers from start to end in six seconds.
- **Reduced motion:** nothing scrolls by itself. As today, the layers never move (the `still` check), so the scene stays still while the box scrolls. The CSS rule `.layer{will-change:auto}` stays.
- **Stage font:** no text on the stage.
- **Stage:**
  - `.stage`: `position:relative;overflow-y:auto;scrollbar-width:none;container-type:size;background:#0b0b0d`, with `aria-label="A landscape in four layers that move at different speeds"`.
  - `.scene{height:300cqh}` (1800px in a 600px stage today); `.layers{position:sticky;top:0;height:100cqh;overflow:hidden;background:#0a1628}`; `.layer{height:100%}`. The phone rule that set 400px goes.
  - The four layer SVGs get `preserveAspectRatio="none"` (was `xMidYMid slice`; owner decision 3) and `aria-hidden="true"`. The scene is drawn for a 4:3 box, and the new box is about 2.5:1 on laptops: `slice` crops the grass layer out of view there, so the layer that moves most never shows (measured). Stretched to fill, every layer shows at every size; the hills look a little flatter on wide screens.
  - The travel at 100% speed becomes a quarter of the box's height (`MAX_PARALLAX = stage.clientHeight / 4` in `update()`; 150px of a 600px stage today, 95px at 1280×800), so the grass still leaves the box exactly at the end of the scroll.
  - `update()` keeps the offsets; its readout lines (progress and the four offsets) go.
  - `hb-dots`: no. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Depth | Choice buttons | Flat · Shallow · Normal · Deep | Normal | Deep spreads the layers' speeds; Flat moves them as one. | `LAYERS[i].speed` for sky, ridge, trees and grass: Flat 1, 1, 1, 1 (today's "Disable parallax") / Shallow 0.5, 0.65, 0.8, 1 / Normal 0.1, 0.3, 0.6, 1 (today's defaults) / Deep 0, 0.25, 0.7, 1.5; then `update()` |

**More options**

None: leave out the `details.hb-options` block.

- **Removed:**
  - The note, and the Scroll Progress and Layer Offsets readouts.
  - The four Speed Multiplier sliders and "Disable parallax (all 100%)". They become Depth: four named sets of speeds, all within today's 0–150% sliders.
  - Reset to defaults. Choosing Normal does the same.
- **Good for:** Hero scenes · Landing pages · Story sections · **Avoid on:** Text-heavy pages · Forms
- **Prompt:**

  > Add a parallax scene to [your hero section or illustration]. Split the scene into layers from far to near, such as sky, hills, trees and ground, and hold it in place while the visitor scrolls through a taller section. As they scroll, move each layer by its own amount, as the settings choose; usually the farthest layer barely moves and the nearest moves most, which makes the flat picture feel deep. Base the movement on how far through the section the visitor has scrolled, so it starts and stops at the same place every time. If the visitor has reduced motion turned on, keep every layer still. Match the settings listed below.

- **README What it is:** rewritten:

  > Parallax scrolling moves the far layers of a scene less than the near ones as you scroll, so a flat picture seems to have depth. It copies what you see from a train window: nearby things rush past while distant hills barely move. Each layer gets its own speed, and how far apart those speeds are decides how deep the scene feels.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Depth | Normal | The speeds of the sky, ridge, trees and grass: normal is 10%, 30%, 60% and 100%; shallow 50%, 65%, 80% and 100%; deep 0%, 25%, 70% and 150%; flat moves all four together. At 100% a layer travels a quarter of the box's height over the whole scroll |

- **README See also:**
  - [Parallax Depth-of-Field](../parallax-depth-of-field/) — the same layers, with a moving focus that blurs them
  - [Reverse-Scrolling Columns](../reverse-scrolling-columns/) — columns move against each other as you scroll
- **README How it works:**
  - "Each layer has a speed multiplier `s ∈ [0, 1.5]`." becomes "Each layer has a speed multiplier `s` between 0 and 1.5, set by the Depth setting."
  - In the snippet, the comment `// MAX_PARALLAX = 150px` becomes `// MAX_PARALLAX = a quarter of the box's height`.
  - The rest is unchanged.
- **README Production notes:** in the Accessibility bullet, "hold every layer at zero offset and show the static scene — but keep the numeric readouts tracking the scroll, so the panel isn't reporting stale values. Apply `will-change: auto` in the reduced-motion media query to avoid unnecessary layer promotion." becomes "hold every layer at zero offset and show the static scene, and apply `will-change: auto` in the reduced-motion media query to avoid unnecessary layer promotion." The rest is unchanged.
- **Category line:** `01.02 · Scroll-Based`
- **Pager:** Previous: Parallax Depth-of-Field (`../parallax-depth-of-field/`) · Next: Reverse-Scrolling Columns (`../reverse-scrolling-columns/`)

---

## reverse-scrolling-columns — Reverse-Scrolling Columns

- **Kind:** scroll. Scrolling moves the middle column with the scroll and the side columns the other way, all three looping.
- **Description:** Side columns run the opposite way to the middle one. Best for portfolios.
- **Step 1:** Scroll it · help line: default
- **Player bar:** Play · Back to top
- **Scroller:** the stage.
- **What scrolling shows:** three columns of project cards held still in the box. As the box scrolls, the middle column's cards travel up with the scroll and the side columns' cards travel down, so they seem to flow against it. Each column holds two copies of its twelve cards and wraps around, so none ever runs out, whichever way the side columns go (see Stage). Under 600px wide the right column is hidden, as today.
- **Scroll distance and Play:** `.scene` 320cqh (2000px in a 620px stage today) with the sticky `.columns` 100cqh: 2.2 box heights of scrolling (832px at 1280×800, 656px on a phone). Play moves the columns at about 140px a second (110px on phones).
- **Reduced motion:** nothing scrolls by itself. As today, the columns stay still (`update()` returns early), so the box scrolls without moving them. The CSS rule `.col-inner{will-change:auto}` stays.
- **Stage font:** site font. `.card-label` becomes 13px (was 11px) and `.card-meta` 12px `var(--ui-muted)` (was 10px).
- **Stage:**
  - `.stage`: `position:relative;overflow-y:auto;scrollbar-width:none;container-type:size;background:#0b0b0d`, with `aria-label="Three columns of project cards"`.
  - `.scene{height:320cqh}`; `.columns{position:sticky;top:0;height:100cqh}` (with its flex, gap, padding and overflow). The phone rules that set 480px go; `.col-right{display:none}` under 600px stays.
  - `measure()` stays, with its re-measure on `document.fonts.ready` and `resize` (the loop period depends on the card height). It pre-offsets the side columns by one set (`marginTop = -singleSetH`) only while they move down (`mult < 0`); when they move up (`mult >= 0`) it sets their `marginTop` to 0. Today it always pre-offsets them, which only suits moving down: with Same way the side columns run out of cards, leaving up to 334px of empty column on a laptop (review measurement). With the change there is no gap at any speed in either direction, at any size (measured, 258–438px boxes and phones).
  - The card icons' `svg` in `makeSet()` get `aria-hidden="true"` (shared rule 12).
  - `update()` keeps the three transforms; its readout lines (progress and the three offsets) go.
  - `hb-dots`: no. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Side columns go | Choice buttons | Opposite way · Same way | Opposite way | Same way shows the plain scroll, for comparison. | the sign of `mult`: −1 / +1, times Side column speed; then `measure()` (which sets the side columns' `marginTop` for the direction) and `update()` |
| Side column speed | Choice buttons | Slower · Same · Faster | Same | Their speed compared with the middle column. | the size of `mult`: 0.5 / 1 / 1.5, with the sign from Side columns go; then `update()` |

**More options**

None: leave out the `details.hb-options` block.

- **Removed:**
  - The note, and the Scroll Progress and Column Offsets readouts.
  - The Speed Multiplier slider (−2.0× to +2.0×) and "Match direction (+1.0×)". They become Side columns go and Side column speed; Same way at Same speed is today's Match direction. Faster stops at 1.5×: the README's Production notes advise against going above it.
  - Reset. Back to top and the settings' defaults replace it.
- **Good for:** Portfolios · Agency sites · Image galleries · **Avoid on:** Reading pages · Forms
- **Prompt:**

  > Add reverse-scrolling columns to [your grid of project cards or images]. Lay the cards out in three columns and hold them in view while the visitor scrolls through a taller section. Move the middle column up with the scroll, and move the two side columns in the direction and at the speed given in the settings; running them the opposite way makes them seem to flow against the scroll. Put two copies of the cards in each column and wrap the movement by exactly one copy's height, so the columns never run out. If the visitor has reduced motion turned on, keep the columns still. Match the settings listed below.

- **README What it is:** rewritten:

  > Reverse-scrolling columns put a column that scrolls normally between two columns that move the opposite way. The counter-motion makes the layout feel deep and lively, the same cue parallax uses, made stronger. Each column holds two copies of its cards and wraps around, so the columns never run out.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Side columns go | Opposite way | Opposite way makes the side columns flow against the scroll; same way moves all three together, so the effect disappears |
  | Side column speed | Same | The side columns' speed compared with the middle one: slower is half, same is equal and faster is one and a half times; above that the motion gets uncomfortable |

- **README See also:**
  - [Parallax Scrolling](../parallax-scrolling/) — layers move at different speeds as you scroll
  - [Parallax Depth-of-Field](../parallax-depth-of-field/) — layers move and blur as the focus shifts
- **README How it works:** in the snippet, the comment `// (margin-top pre-offsets them by -singleSetH so there is content above)` becomes `// (moving down, margin-top pre-offsets them by -singleSetH so there is content above; moving up, it is 0)`. The rest is unchanged.
- **README Production notes:** unchanged
- **Category line:** `01.03 · Scroll-Based`
- **Pager:** Previous: Parallax Scrolling (`../parallax-scrolling/`) · Next: Cover Card to Fixed Header (`../cover-card-to-fixed-header/`)

---

## cover-card-to-fixed-header — Cover Card to Fixed Header

- **Kind:** scroll. Scrolling shrinks a tall article cover into a slim header.
- **Description:** A tall cover shrinks into a slim header as you scroll. Best for articles.
- **Step 1:** Scroll it · help line: default
- **Player bar:** Play · Back to top
- **Scroller:** the stage.
- **What scrolling shows:** an article page whose cover fills most of the box. As the box scrolls, the cover shrinks into a slim bar pinned at the top: the title scales down into the corner, the subtitle and date fade out first, the background dims and blurs, a thin line appears under the bar and the author's name fades into its corner. The article text then scrolls up under the bar, and a closing line fills the space after it. Scrolling back opens the cover again in reverse. Back to top, and Play restarting from the top, jump the box at once, and the cover jumps with it (a click on either button sets the eased value at once).
- **Scroll distance and Play:** the scene is as tall as the full cover plus the article (below): about 1.3 box heights of scrolling at 1280×800 (498px) and 2.4 on a phone (701px). At the default Shrink distance, Play spends about four of its six seconds shrinking the cover (under three on phones), then scrolls the article up and ends on the closing line, with the article's last line or so above it (15px of it at 1280×800, none in the 258px box).
- **Reduced motion:** nothing scrolls by itself. As today, the cover snaps between tall and slim at half the Shrink distance, with no easing (`snaps()` is true under reduced motion). The CSS rule for `will-change` stays.
- **Stage font:** site font (the stage text only inherited the old body font). The blockquote drops its italic.
- **Stage:**
  - `.stage`: `position:relative;overflow-y:auto;scrollbar-width:none;overflow-anchor:none;container-type:size;background:#0b0b0d`, with `aria-label="An article with a tall cover"`. `overflow-anchor:none` stays (without it the shrinking cover fights the scroll).
  - The cover's full height becomes 85% of the box: `.cover{height:85cqh}` in the CSS, and `measure()` sets `FULL = Math.round(stage.clientHeight * 0.85)` (530px of a 620px stage today), so the whole cover shows on arrival: 321px at 1280×800, 276px at 1366×657, 219px at 1280×590 and 253px on phones (measured: its text, with its margins and padding, needs 171px there and 192px on phones). `--cover-full` goes; `--cover-min` stays (56px, 64px under 600px). The cover then moves with transforms and keeps its full height in the layout: `measure()` also sets `cover.style.height = FULL + 'px'` and `CONTENT = FULL − spacer height` (the cover's text with its margins and padding, read from `.cover-spacer`), and `render()` writes, for `v = q(lerp(FULL, MIN, e), 1)` and `d = FULL − v`: `translateY(-d)` on `.cover` and `.article-body`, `translateY(d)` on `#header-chip`, `translateY(d) scaleY(v / FULL)` on `#cover-bg` (`transform-origin:top`) and `translateY(max(0, CONTENT − v))` on `.cover-inner`. `.cover` and `.article-body` get `will-change:transform` (`auto` under reduced motion). (final review: height is no longer animated; layouts during a scroll fell from about one per two frames to none)
  - The scene's `min-height:2500px` goes. Today it leaves about 1,700px of empty box after the article, so Play would spend most of its six seconds on nothing. `measure()` sets `scene.style.minHeight = Math.max(FULL + article.offsetHeight, stage.clientHeight + 440) + 'px'`, so the box scrolls far enough to finish the longest shrink and its scroll length does not change while the cover shrinks. At every measured size the first term wins, so once the cover is slim, `FULL − MIN` of box is left empty after the article: 265px at 1280×800, 163px at 1280×590, 189px on phones. `measure()` also runs after `document.fonts.ready` (the article's height depends on the font).
  - A closing line fills that space (owner decision 4): `<p class="end-cue">The end · scroll back up and the cover opens again</p>`, the last child of `.scene`, with `position:absolute;left:0;right:0;bottom:0;margin:0;display:flex;align-items:center;justify-content:center` and the cue style (shared rule 14: 13px `#8a8a92`, `letter-spacing:.1em`, `text-align:center;padding:0 24px`). `measure()` sets its height to `FULL − MIN` (`.scene` is already `position:relative`).
  - The cover's title becomes `<p class="cover-title" id="cover-title">` (was an `h1`, shared rule 13): the shared rule `.hb-page h1` would restyle it at 64px. `.cover-title` keeps its own look (26px, `#d1f7d6`, `line-height:1.2`, `letter-spacing:-.5px`, `margin-bottom:8px`, `transform-origin:left top`) and gets `font-weight:700`, the weight the `h1` gave it. Measured: when the cover is slim, the title's two lines scale to half size and sit 22–53px down the 56px bar (64px on phones).
  - The code shown on the cover (`.cover-code`) goes, with its line in `render()` (`coverCode.style.opacity`).
  - Text on the cover: the subtitle becomes "Why a tall cover can fold into a slim bar as you read" (was "How browsers render scroll-driven animations at 60fps"); "Article · 8 min read", the title and "Matin M. · May 2026" stay. `.cover-meta`, `.author-name` and `.chip-name` become 11px (were 10px) and `.cover-sub` 14px (was 12px). `.cover-meta`, `.cover-sub` and `.author-name` use `#5fa577` (was `#3d7a52`, 3.1:1 on the cover's green; the new green is 5.3:1); `.chip-name` keeps `#d1f7d6`. The author chip (`#header-chip`) is `aria-hidden="true"`: it only repeats the author line on the cover.
  - The article is rewritten in plain words (today's text speaks of compositors, easing curves and the removed slider), with `.article-body p` at 14px (was 12px), the headings 12px (was 11px) and the blockquote 15px (was 13px). Its three headings become `h3` (were `h2`, shared rule 13), so the `.article-body h2` rule becomes `.article-body h3`. In order:

    | Part | Text |
    |---|---|
    | Heading | One number drives it all |
    | Paragraph | As you scroll, one number moves from 0 to 1. The cover's height, the size of the title, the fading background and the small author badge all follow that number, so every moment in between looks planned. |
    | Quote | A header should get out of the way without disappearing. |
    | Heading | Everything moves together |
    | Paragraph | The title shrinks toward the top-left corner while the subtitle and the date fade out first, so the slim bar never looks crowded. |
    | Paragraph | The author's name fades into the corner of the bar in the second half of the fold, when there is room for it. |
    | Heading | Room to read |
    | Paragraph | Once the cover has folded away, only a slim bar stays at the top, with the title and the author, and the rest of the box goes to the text. |
    | Paragraph | Scroll back up and the cover opens again, step by step, in exactly the reverse order. |

  - Script: the Collapse Override slider's code goes (`colSlider`, the `manual` flag and `overrideOf()`); the `scroll` listener always sets the target from the scroll. `render()` loses its readout and slider lines. The Binary toggle's handler moves to Snaps at halfway.
  - `hb-dots`: no. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Shrink distance | Choice buttons | Short · Medium · Long | Medium | How far you scroll before the cover is fully small. | `RANGE`: 200 / 320 / 440 (px), then `target = curveOf(clamp(stage.scrollTop / RANGE, 0, 1)); schedule();` |
| Snaps at halfway | Switch | on / off | off | Jumps from tall to slim instead of shrinking smoothly. | `binaryTog.checked`, then today's handler (clears the cache `G`, sets the target from the scroll, `schedule()`) |

**More options**

None: leave out the `details.hb-options` block.

- **Removed:**
  - The note, and the Scroll and Collapse readouts.
  - The Collapse Override slider. Like the Seek slider on Scrub Animation, it moved the same progress value that scrolling moves, and scrolling or Play now does that.
  - The Transition Range slider (150–600px). It becomes Shrink distance; Long stops at 440px so the box can always finish the shrink.
  - "Binary (snap at midpoint)" becomes Snaps at halfway.
  - Reset scroll. Back to top replaces it.
  - The code on the cover.
- **Good for:** Articles · Blog posts · Product pages · **Avoid on:** Short pages · App screens
- **Prompt:**

  > Add a collapsing cover to [your article or page header]. Start with a tall cover pinned to the top that holds the title, a subtitle, the date and the author. As the visitor scrolls, shrink it into a slim header: the title scales down into the corner, the subtitle and date fade out first, and a small author badge fades in near the end. Unless the settings make it snap, tie every change to one number that runs from 0 to 1 with the scroll, so every moment in between looks planned and scrolling back reverses it. Turn off scroll anchoring on the scrolling area. If the visitor has reduced motion turned on, switch between the tall and slim cover halfway, without animating. Match the settings listed below.

- **README What it is:** rewritten:

  > A cover card to fixed header starts a page with a tall cover that holds the title, a subtitle, the date and the author, and shrinks it into a slim header as you scroll. Every change, from the cover's height and the title's size to the fading background and the small author badge, follows one number that runs from 0 to 1 with the scroll, so every moment in between looks planned.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Shrink distance | Medium | How far you scroll before the cover is fully small: short is 200px, medium 320px and long 440px |
  | Snaps at halfway | off | Switches between the tall cover and the slim header at half the distance instead of shrinking with the scroll; reduced motion always does this |

- **README See also:**
  - [Pin Animation](../pin-animation/) — one part holds still while the page scrolls past
  - [Stacking Cards](../stacking-cards/) — cards pile into a deck as you scroll
  - [Scrub Animation](../scrub-animation/) — scroll plays an animation forward and back
- **README How it works:**
  - The sentence above the second snippet, "Eight properties are then interpolated against `e`", becomes "The cover's visible height and seven other values are then worked out from `e`", and in the snippet `cover.style.height         = lerp(530, 56, e) + 'px';` becomes two lines (the cover moves with transforms, final review): `const h = lerp(FULL, 56, e), d = FULL - h;   // FULL: 85% of the box's height` and ``cover.style.transform = `translateY(${-d}px)`;   // the cover keeps its full height and slides up``.
  - In the same snippet, the comment `// also coverSub, coverCode` becomes `// also coverSub`.
  - The spacer sentence ("A `flex: 1` spacer inside the cover pushes content to the bottom …") becomes: "Nothing is resized: the cover keeps its full height in the layout and slides up by what it has shrunk, and the article slides with it; the badge and the backdrop are moved back into the visible part, and once the cover is shorter than its text the text starts at the top of the bar. Back to top and Play from the end set the eased value at once." (final review)
  - The rest is unchanged.
- **README Production notes:** the bullet "The height animation triggers layout" becomes "**Move the cover; never animate its `height`.** Writing `height` lays the page out every frame. Keep the cover at full height, slide it and the content below with `translateY()`, and squeeze the backdrop with `scaleY()` from its top edge — as the demo does." (final review). The scroll-anchoring bullet gains "This demo moves the cover with transforms, so scrolling never changes its height; the rule stays as a guard for when the box is measured again after a resize." The rest is unchanged.
- **Category line:** `01.04 · Scroll-Based`
- **Pager:** Previous: Reverse-Scrolling Columns (`../reverse-scrolling-columns/`) · Next: Fly-in Fly-out Contact List (`../fly-in-fly-out-contact-list/`)
- **Final fix wave (Scroll-Based final review, 2026-09-30).** The cover no longer animates `height`: it keeps its full height in the layout and moves with transforms (the cover-height bullet under Stage, above), so a scroll lays the page out about twice in 150 frames at 4× CPU throttling in a phone-sized box, down from 75. `overflow-anchor:none` stays as a guard: the first Stage bullet's reason now applies when `measure()` writes the cover's height after a resize. A click on Back to top or Play sets the eased value at once, so the cover does not open again after a jump (`render(current)` runs in the same click). `#header-chip` is `aria-hidden`. `index.html` grows from 299 to 308 lines.

---

## fly-in-fly-out-contact-list — Fly-in Fly-out Contact List

- **Kind:** scroll. Scrolling moves the rows through edge zones where they fly in and out.
- **Description:** Rows fade and slide as they near the top or bottom edge. Best for long lists.
- **Step 1:** Scroll it · help line: default
- **Player bar:** Play · Back to top
- **Scroller:** the stage.
- **What scrolling shows:** a list of fifteen contacts. A row rising through the bottom band of the box fades in, slides up into place and grows to full size; a row rising through the top band does the reverse and leaves; rows in the middle band stay still and whole. The deeper a row is in its band, the further along it is, so scrolling back brings rows back the same way. At the very top the first row sits in the top band, so it starts mostly faded, as today.
- **Scroll distance and Play:** the list's own height: about 1.7 box heights at 1280×800 (626px) and 2.2 on a phone (650px). Play carries the rows through the bands at about 105px a second.
- **Reduced motion:** nothing scrolls by itself. As today, rows never move or shrink; they only fade between 30% and full strength in the bands (the `reduced` branch of `applyRow()`). The CSS rule `.row{will-change:auto}` stays.
- **Stage font:** site font. `.row-name` becomes 14px (was 12px), `.row-sub` 12px (was 10px), `.badge` and `.meta-time` 11px (were 9px and 8px), `.zone-label` 11px (was 8px).
- **Stage:**
  - `.stage`: `position:relative;overflow-y:auto;scrollbar-width:none;background:#0b0b0d`, with `aria-label="A list of contacts"`.
  - The rows and the zone overlay stay; the overlay's labels keep "↑ exit zone" and "↓ entry zone", and the second label's inline style moves into a `.zone-label-end` rule (`position:absolute;bottom:2px`).
  - Each row's avatar (its initials) gets `aria-hidden="true"` in the row template, because it repeats the name (shared rule 12).
  - Phone rule kept (under 600px): `.avatar{width:32px;height:32px;font-size:11px}` (its font was 10px).
  - In the 258px box of a 1280×590 window each band is 64px and two whole rows fit between them (measured).
  - `update()` keeps the row styling; its Scroll and Visible rows readout lines go (`applyRow()` still returns whether the row is in view, unused).
  - `hb-dots`: no. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Effect | Choice buttons | All three · Move only · Fade only | All three | All three moves, fades and shrinks each row together. | `mode`: `'all'` / `'translate'` / `'fade'`, then `update()`; also shows How far rows move except with Fade only, and How much rows shrink only with All three |
| Edge zone size | Choice buttons | Small · Medium · Large | Medium | How close to the edge a row starts to fly out. | `Z`: 0.15 / 0.25 / 0.35, then `updateOverlay()` and `update()` |
| How far rows move | Choice buttons; shown only when Effect is not Fade only | Short · Medium · Far | Medium | The distance a row slides as it leaves. | `DIST`: 20 / 40 / 70 (px), then `update()` |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| How much rows shrink | Choice buttons; shown only when Effect is All three | A little · Medium · A lot | Medium | The size a row shrinks to at the edge. | `SCALE`: 0.97 / 0.94 / 0.88, then `update()` |
| Shows the zones | Switch | on / off | off | Tints the two bands where rows fly in and out. | the zone overlay's `visible` class on / off |

- **Removed:**
  - The note, and the Scroll and Visible rows readouts.
  - The Translate Distance, Scale Delta and Zone Size sliders. They become How far rows move, How much rows shrink and Edge zone size.
  - The Effect Mode radio buttons. They become Effect.
  - "Preview zones" becomes Shows the zones.
  - Reset. Back to top and the settings' defaults replace it.
- **Good for:** Contact lists · Chat lists · Activity feeds · Search results · **Avoid on:** Short lists · Tables
- **Prompt:**

  > Add a fly-in, fly-out effect to [your scrolling list, such as contacts or messages]. Treat a band at the top and a band at the bottom of the scrolling area as edge zones. As a row passes through the bottom band it arrives, and as it passes through the top band it leaves: the deeper it is in the band, the more it is faded, moved and shrunk, as the settings choose, and in the middle it shows in full. Work it out from the scroll position on every frame, so scrolling back brings rows back. If the visitor has reduced motion turned on, do not move or shrink rows; only fade them a little near the edges. Match the settings listed below.

- **README What it is:** rewritten:

  > A fly-in, fly-out list animates its rows as they pass near the edges of the scrolling area. A row coming in at the bottom fades in, slides up and grows to full size; a row leaving at the top does the reverse; rows in the middle stay still. Because it follows the scroll position rather than playing once, scrolling back brings rows back the same way.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Effect | All three | Which changes a row makes in the bands: all three (moving, fading and shrinking) together read as physical motion; moving only or fading only feels flatter |
  | Edge zone size | Medium | How tall each band is: small is 15% of the box, medium 25% and large 35% |
  | How far rows move | Medium | How far a row slides at the very edge: short is 20px, medium 40px and far 70px |
  | How much rows shrink | Medium | The size of a row at the very edge: a little is 97%, medium 94% and a lot 88% |
  | Shows the zones | off | Tints the two bands, red for leaving and green for arriving |

- **README See also:**
  - [Reveal on Scroll](../reveal-on-scroll/) — cards appear once as they cross a line
  - [Stagger Reveal](../stagger-reveal/) — items in a group appear one after another
  - [Cover Card to Fixed Header](../cover-card-to-fixed-header/) — a tall cover shrinks into a slim header
- **README How it works:** unchanged
- **README Production notes:** unchanged
- **Category line:** `01.05 · Scroll-Based`
- **Pager:** Previous: Cover Card to Fixed Header (`../cover-card-to-fixed-header/`) · Next: Stacking Cards (`../stacking-cards/`)

---

## stacking-cards — Stacking Cards

- **Kind:** scroll. Scrolling stacks the cards into a deck.
- **Description:** Cards stick at the top and pile into a deck. Best for step-by-step stories.
- **Step 1:** Scroll it · help line: default
- **Player bar:** Play · Back to top
- **Scroller:** the stage.
- **What scrolling shows:** white project cards scroll up one after another. Each sticks at the top of the box and the next slides over it, leaving a strip of every card underneath showing, and each covered card shrinks slightly from its top edge, so the pile reads as a deck. At the end the finished deck holds still for a moment. Scrolling back takes the deck apart.
- **Scroll distance and Play:** a 25cqh lead-in, the cards (each one box tall less the strips and a 12px foot), and a 30cqh run-out inside the deck: at five cards about 4 box heights at 1280×800 (1,520px) and 3.9 on a phone (1,155px). Play lays a card on the deck about every 1.3 seconds.
- **Reduced motion:** nothing scrolls by itself. As today, the cards still stack, but covered cards do not shrink (the demo's rule `animation:none!important`, and the fallback's check).
- **Stage font:** site font. `.card-num` and `.card-title` drop `serif`; `.card-btn` drops `monospace`. `.card-sub` and `.card-btn` become 11px (were 10px) and `.card-body` 14px (was 12px), under shared rule 9.
- **Stage:**
  - `.stage`: `position:relative;overflow-y:auto;scrollbar-width:none;container-type:size;background:#0b0b0d`, with `aria-label="A stack of project cards"`.
  - `.spacer{height:25cqh}`, `.run-out{height:30cqh}`, and `.card__content{height:calc(100cqh - 12px - (var(--numcards) - 1) * var(--peek))}` (were in `var(--stage-h)`, with a 24px foot; measured: the same deck and the same CSS scroll timeline). The foot under the deepest card becomes 12px, so every card is 12px taller.
  - The card text is rewritten as plain project cards (today's cards explain the code). `ALL_CARDS` keeps each card's number and `vis`, and its `ac` except for four that are darkened (see "On white" below), with this text:

    | Card | Title | Kind (sub) | Line (body) |
    |---|---|---|---|
    | 01 | Harbor House | Architecture | A timber home on the edge of the water. |
    | 02 | Night Market | Photography | Forty evenings of food stalls and lanterns. |
    | 03 | Field Notes | Journal | Small drawings from a year of walks. |
    | 04 | Slow Roast | Brand | A new look for a family coffee roaster. |
    | 05 | North Line | Maps | A clearer map for a busy train network. |
    | 06 | Open Studio | Workshop | Two days of making things by hand. |
    | 07 | Tide Tables | App | Daily tides for every beach on the coast. |

  - The card button reads "View project →" (owner decision 6; the page checks forbid "Read more").
  - The big faded number becomes a watermark (owner decision 5): it keeps its 52px size and its opacity .1 but leaves the text column's flow, `.card-num{position:absolute;top:clamp(8px,3cqh,16px);right:clamp(12px,2.5vw,24px);margin:0;line-height:1}` with `.card__text{position:relative}`, and each number gets `aria-hidden="true"` in `buildCards()` (shared rule 12).
  - `.card__text` padding follows the box's height: `padding:clamp(14px,6cqh,32px) clamp(18px,3vw,32px)` (was `clamp(18px,3vw,32px)` all round; `6cqh` is 6% of the box).
  - On the shortest cards the one-line text hides, so the title, the kind and the button fit. `measure()` works out a card's height, `stage.clientHeight - 12 - (numCards - 1) * peekPx`, and toggles the class `short` on `#cards` when it is under 170px, with `#cards.short .card-body{display:none}`. `measure()` already runs after `buildCards()`, after a change of Edge that shows and on `resize`. The line hides only with seven cards and the Large edge (in the 258px and 288px boxes of short laptop windows and on phones), and with five cards and the Large edge or seven and Medium in the 258px box.
  - On white: `.card-sub` and `.card-body` drop their opacity and use `#5f5f66` (today about 2.9:1 and 3.9:1; the new grey is 6.3:1). The button label is 11px text too, and each card's `ac` sets both its text and its border. Four of today's seven `ac` colours are under 4.5:1 on the white card: `#c07030` 3.75:1 (Harbor House, the card a visitor sees on arrival), `#5a8a38` 4.10:1, `#9a7820` 4.13:1 and `#3a8a60` 4.21:1. Those four are darkened within their own hue (about 4.6:1) and the other three stay; only the label's text and border change, the `vis` gradients do not. `ALL_CARDS` takes these `ac` values:

    | Card | `ac` (label text and border) | On white |
    |---|---|---|
    | 01 | `#aa632b` (was `#c07030`) | 4.64:1 |
    | 02 | `#37835b` (was `#3a8a60`) | 4.61:1 |
    | 03 | `#3a70a8` | 5.17:1 |
    | 04 | `#90701e` (was `#9a7820`) | 4.64:1 |
    | 05 | `#548034` (was `#5a8a38`) | 4.65:1 |
    | 06 | `#8a3a68` | 7.28:1 |
    | 07 | `#3a5aa0` | 6.67:1 |

  - Phone rules (under 600px), in place of today's `grid-template-columns:1fr;grid-template-rows:1fr 140px`, which pushes the coloured half out of the 300px box: `.card__content{grid-template-columns:1fr;grid-template-rows:1fr}`, `.card__visual{display:none}` and `.card__text{gap:6px}`.
  - Measured, all 12 combinations of Number of cards and Edge that shows fit their text at every size: 1280×800, 1366×657, 1280×640, 1280×620, 1280×590, 768×1024, 610×1000 and 375px and 320px phones. The tightest is seven cards with the Large edge in the 258px box: 2px to spare, with its line hidden. No `container-type` is used on the cards (shared rule 5).
  - The debug badge goes, with its markup in `buildCards()`.
  - Script: the automatic fallback stays (`useJsFallback = !supportsSDCA`); the switch that forced it goes. `update()` keeps the fallback's scale writes; its Scroll and Topmost card lines go.
  - `hb-dots`: no. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Edge that shows | Choice buttons | None · Small · Medium · Large | Medium | The strip of each card left showing above the next. | `peekPx` and `--peek`: 0 / 8 / 14 / 20 (px), then `measure()` and `update()` |
| How much cards shrink | Choice buttons | A little · Medium · A lot | Medium | Covered cards shrink so the deck looks deep. | `scaleStep` and `--scale-step`: 0.05 / 0.10 / 0.12, then `lastScales` reset and `update()` |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Number of cards | Choice buttons | 3 · 5 · 7 | 5 | More cards make a taller deck and a longer scroll. | `numCards`: 3 / 5 / 7, then `buildCards()` |

- **Removed:**
  - The note, and the Scroll and Topmost card readouts.
  - The Scale step, Peek offset and Card count sliders. They become How much cards shrink, Edge that shows and Number of cards.
  - Show indices, and the debug badges it showed.
  - JS fallback. It only chose how the same result is worked out; the page still falls back by itself where the browser has no scroll timelines.
  - Reset scroll. Back to top replaces it.
- **Good for:** Portfolios · Case studies · Onboarding steps · Feature tours · **Avoid on:** Long text · Many cards
- **Prompt:**

  > Add stacking cards to [your set of project or step cards]. Make each card stick to the top of the scrolling area so the next card slides up over it, and push each later card down by the offset in the settings so a strip of the cards underneath stays visible, like a deck. As a card is covered, shrink it slightly from its top edge, so buried cards look farther away. Leave some room after the last card so the finished deck stays on screen. Use scroll-driven animations where the browser supports them, with a small script as the fallback. If the visitor has reduced motion turned on, let the cards stack without shrinking. Match the settings listed below.

- **README What it is:** rewritten:

  > Stacking cards pin each card to the top of the scrolling area, so the next card slides up over it and the cards pile into a deck. A strip of every card underneath stays visible, and each covered card shrinks slightly, so the pile looks deep. The stacking itself needs no script: the browser's sticky positioning does it.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Edge that shows | Medium | The strip of each card left showing above the next: none, small (8px), medium (14px) or large (20px) |
  | How much cards shrink | Medium | How much smaller each card gets for every card on top of it: a little is 5%, medium 10% and a lot 12% |
  | Number of cards | 5 | Three, five or seven cards; more make a taller deck and a longer scroll |

- **README See also:**
  - [Pin Animation](../pin-animation/) — one part holds still while the page scrolls past
  - [Snap Scrolling](../snap-scrolling/) — the box settles on one section at a time
  - [Cover Card to Fixed Header](../cover-card-to-fixed-header/) — a tall cover shrinks into a slim header
- **README How it works:** unchanged
- **README Production notes:** in the "Size cards to include their own offset" bullet, `stage − 24px − (N−1) × peek` becomes `stage − 12px − (N−1) × peek`. The rest is unchanged.
- **Category line:** `01.06 · Scroll-Based`
- **Pager:** Previous: Fly-in Fly-out Contact List (`../fly-in-fly-out-contact-list/`) · Next: ScrollTrigger Animation (`../scroll-trigger/`)

---

## scroll-trigger — ScrollTrigger Animation

- **Kind:** scroll. Scrolling passes four zones, each starting, following or holding its animation.
- **Description:** Animations start, follow and pin at set scroll points. Best for landing pages.
- **Step 1:** Scroll it · help line: default
- **Player bar:** Play · Back to top
- **Try it:** none (the rollout spec: this demo has no settings). The page has steps 1 and 2.
- **Scroller:** the stage.
- **What scrolling shows:** four tinted zones in turn, each with a small label.
  1. "Fades in": a heading and a line of text fade in while any part of that text is in the box, and hide once it has gone above or below it. Scrolling back up, the fade starts as the text's bottom edge comes into the box, so it is seen.
  2. "Follows the scroll": a square turns half a turn, grows and changes colour as the square itself rises from 80% to 25% down the box (its centre), and turns back when you scroll back. It starts turning fully inside the box and stays inside it for the whole turn.
  3. "Pinned": a card holds still in the middle of the box while the zone scrolls past it, and its text steps through three stages.
  4. "Steps": five dots light up one by one as the row of dots rises from 80% to 25% down the box (its centre): the first lights with the row about three quarters of the way down, the last about a third of the way down, and none before the row is in view.
  Then a closing line: "That's the end · scroll back up to see each zone again".
- **Scroll distance and Play:** zones 1, 2 and 4 at 90cqh, zone 3 at 200cqh and a 100cqh run-out: 4.7 box heights of scrolling (1,776px at 1280×800, 1,400px on a phone). Play shows each zone for about a second and holds the pinned card for about 1.3 seconds, a little under half a second per stage.
- **Reduced motion:** nothing scrolls by itself. As today, zone 1's text appears and disappears without the fade (`.reveal-content{transition:none}`); the square, the card and the dots still follow the visitor's own scrolling.
- **Stage font:** site font (the stage text only inherited the old body font).
- **Stage:**
  - `.stage`: `position:relative;overflow-y:auto;scrollbar-width:none;container-type:size;background:#0b0b0d`, with `aria-label="Four scroll zones"`.
  - Sizes: `.zone{min-height:90cqh}` (550px in a 620px stage today); `.z3{min-height:200cqh}`; `.pin-card{top:calc(50cqh - 70px)}`; `.run-out{height:100cqh}`.
  - Zone labels (`.zone-tag`, 11px, was 9px): "Fades in", "Follows the scroll", "Pinned", "Steps" (were "Fade on Enter", "Scrub", "Pin + Scrub", "Snap"). Their `opacity:.8` goes: text faded below 4.5:1 is fixed in its section, and with it the four labels measure 4.22, 4.31, 4.22 and 3.47:1 (text and tinted background both fade over the zone), without it 5.74, 5.86, 5.75 and 4.68:1.
  - Zone 1: the heading reads "Fades in on arrival" and the text "This text fades in when its zone scrolls into the box, and hides again once the zone has gone." (today's text names onEnter and onLeave). `.reveal-sub` becomes 14px (was 13px). The fade is keyed to the text's own layout box (`#reveal`, by `offsetTop` and `offsetHeight`, which its 30px translate before it fades in does not change): active while any part of that box is in the box, not while any part of the zone is. Keyed to the zone, the text turned active when the zone's bottom edge came into the box, with the text still 84–138px above it, so scrolling back up showed no fade. On load, after Back to top and when Play restarts, the text is in the box at once and fades in as before.
  - Zone 2: the caption reads "The square turns, grows and changes color as you scroll." The "progress: 0%" readout under the square goes.
  - Zone 3: `PIN_STEPS` becomes:

    | Step | Title | Text |
    |---|---|---|
    | Step 1 of 3 | Held in place | The card stops here while the page keeps scrolling. |
    | Step 2 of 3 | Changing | Its text changes as you scroll through the zone. |
    | Step 3 of 3 | Let go | Scroll on and the card moves away with the page. |

    `.pin-body` becomes 14px (was 12px).
  - Zone 4: the caption reads "Scroll on to light up the dots, one at a time." The "0 / 5 lit" readout goes.
  - The two captions' inline styles move into a `.zone-cap` rule (13px, `var(--ui-muted)`, the zone 2 caption with `margin-bottom:4px`).
  - The run-out reads "That's the end · scroll back up to see each zone again" in the cue style (shared rule 14): sentence case (its `text-transform:uppercase` goes), `text-align:center;padding:0 24px`, 13px `#8a8a92` with `letter-spacing:.1em`, without the opacity .5 (today 10px capitals at about 2:1, left-aligned against the edge on phones).
  - Every zone's window is reached at every size, and happens where the visitor can see it (the binding rule: the effect is seen during Play and while scrolling by hand). The square and the row of dots each follow their own centre from 80% to 25% down the box: `clamp((scrollTop - (centre - 0.8 * box)) / (0.55 * box), 0, 1)`. A window keyed to the zone's top (80% to 20%, as the old page had it) ran about half a box too early, because a zone is 90% of the box tall and centres its content: dot 1 lit with the row 61–96px below the box, the row came into view with two or three dots already lit, and the square started turning below the box. An end line of 20% would also leave the finished square 7px above the 258px box; 25% keeps it inside (measured in boxes of 258–438px and on phones: dot 1 lights with the row centre at 74–75% down the box, dot 5 at 30–31%; the square starts turning at 161–252px of the 258px box and is done at 6–123px, inside the box for the whole turn). After zone 4 the one-box run-out lets the row rise well past 25% of the box, so all five dots light, and the pinned card's three stages fit inside zone 3's span (shared rule 4). In the 258px box of a 1280×590 window the zones are 232px, zone 2's content 154px (170px on phones, where its caption wraps) and the pinned card, 136px tall with two lines of text at every width, sits 59–195px down the box (measured; phones 79–215px of 298).
  - Script: `update()` keeps the zone states, zone 1's class, the square, the card steps and the dots. The pills, the callback log and the progress readout go, with `logEvent()`, `NAMES`, `prevState`, `primed`, `cbEvents` and `EMPTY_LOG`. `measure()` also runs after `document.fonts.ready`, measures the zone tops against the stage's inner edge (`clientTop`, the 1px border) so they match `scrollTop`, and caches the place of the text (`#reveal`), the centre of the square and the centre of the row of dots from their layout boxes (the zone top plus `offsetTop`; `offsetHeight` for the height and the centre), not from their on-screen rectangles, which the turn, the scale and the 30px translate change.
  - `hb-dots`: no. Default height.
- **Removed:**
  - The note, the Scroll progress readout, the Zone status pills and the Callback log.
  - The "progress" and "lit" readouts on the stage.
  - Reset scroll. Back to top replaces it.
- **Good for:** Landing pages · Product pages · Feature sections · **Avoid on:** Short pages · Forms
- **Prompt:**

  > Add scroll-triggered animations to [the sections of your page]. Split the page into zones and work out from the scroll position whether each zone is still ahead, on screen or already passed. Fade a zone's content in when the zone arrives and hide it again when it has gone. Tie another animation's progress to how far the visitor has scrolled through its zone, so it plays forward and back with the scroll. Pin one card in place while its text steps through a few stages, and light up a row of dots in steps. Leave some space after the last zone so it can finish. If the visitor has reduced motion turned on, show content without fading it.

- **Copy prompt hint:** "Replace the words in brackets with your own sections."
- **README What it is:** rewritten:

  > Scroll triggers start, follow or hold animations at chosen points as you scroll. Each zone of a page is either still ahead, on screen or already passed, and moving between those states starts or reverses its animation. The demo shows four common uses: fading content in as it arrives, tying an animation to the scroll, pinning a card while it changes, and lighting up steps. In production the GSAP ScrollTrigger plugin handles all of this; the demo does it by hand.

- **README Key parameters:** the technique's own values (the page has no settings):

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Zone height | 90% of the box (zone 3: twice the box) | How much scrolling each zone takes |
  | Follow window | From 80% to 25% down the box | The square in zone 2 and the row of dots in zone 4 play while their own centre rises between these two lines, so each plays in full view |
  | Pinned span | Zone 3's height less one box | How long the card holds still; its three stages share it equally |
  | Run-out | One box height | Space after the last zone, so it can finish and leave |

- **README See also:**
  - [Scrub Animation](../scrub-animation/) — scroll plays an animation forward and back
  - [Pin Animation](../pin-animation/) — one part holds still while its text changes
  - [Reveal on Scroll](../reveal-on-scroll/) — cards appear as they cross a line
- **README How it works:**
  - "A change of state is a callback. Which one depends on the direction the state moved:" becomes "A change of state is a callback. Which one depends on the direction the state moved (the demo shows them through the text in zone 1, which fades in on enter and hides on leave):".
  - In that snippet, `log(ev); prev[i] = s;` becomes `prev[i] = s;   // run the zone's enter or leave animation for ev`.
  - In the sentence before the scrub snippet, "it resolves to 0 before the zone and 1 after it — so a zone you skipped past still ends up in its finished state:" becomes "it resolves to 0 before its window and 1 after it — so a zone you skipped past still ends up in its finished state. The window belongs to the piece that animates (the square, the row of dots), not to the zone around it: here a zone is nearly a box tall and centres its content, so a window keyed to the zone's top would run half a box before the piece could be seen:". In the snippet, the two lines `// enter window: 0 as the zone top passes 80% down the viewport, 1 at 20%` and `const p = clamp((stage.scrollTop - (top[i] - 0.8 * viewport)) / (0.6 * viewport), 0, 1);` become `// follow window: 0 as the piece's centre passes 80% down the box, 1 at 25%`, `// (centre: the middle of its layout box, measured against the stage and cached like the zone tops)` and `const p = clamp((stage.scrollTop - (centre - 0.8 * viewport)) / (0.55 * viewport), 0, 1);`.
  - The rest is unchanged.
- **README Production notes:** two bullets lose the removed log and readout, and a third names the piece's window:
  - "**Prime the state before logging callbacks.** Comparing the first frame's state against a `null` starting value manufactures events that never happened: this log opened claiming zone 1 had fired `onEnterBack` and zones 2–4 `onLeaveBack`, before any scrolling." becomes "**Prime the state before firing callbacks.** Comparing the first frame's state against a `null` starting value manufactures events that never happened: zone 1 would fire `onEnterBack` and zones 2–4 `onLeaveBack` before any scrolling." Its last sentence stays.
  - In "**Leave a run-out after the last trigger.**", "— the snap dots here were stuck at 0/5 forever." becomes "— without it, the dots in zone 4 could never all light up."
  - In "**Anchor the scrub to where the section *enters*, not to where it reaches the top.**", after "here that moved each trigger roughly 0.8 of a viewport earlier." comes: "Anchor it to the piece that animates, too: a zone that is nearly a box tall and centres its content puts the piece half a box below the zone's top, so the demo uses `start: "center 80%"` / `end: "center 25%"` on the square and on the row of dots, and the animation plays where it can be seen."
  - The rest is unchanged.
- **Category line:** `01.07 · Scroll-Based`
- **Pager:** Previous: Stacking Cards (`../stacking-cards/`) · Next: Scrub Animation (`../scrub-animation/`)

---

## scrub-animation — Scrub Animation

- **Kind:** scroll. Scrolling moves a plane along a drawn route, forward and back.
- **Description:** Scroll plays it forward and back, like dragging a video. Best for product tours.
- **Step 1:** Scroll it · help line: "Scroll inside the box, down and back up, or press Play and it scrolls for you."
- **Player bar:** Play · Back to top
- **Scroller:** the stage.
- **What scrolling shows:** a dashed flight route with marks at 0, 25, 50, 75 and 100%, held still in the box above a small player panel. As the box scrolls, the plane flies along the route, turning with it, the route behind it fills in, the marks it has passed light up, and the panel's bar fills with a frame count from 000 to 120. Scrolling back flies it back; the panel's label reads Forward, Backward or Still.
- **Scroll distance and Play:** `.track` 300cqh with the sticky `.pinned` 100cqh: two box heights of scrolling (756px at 1280×800, 596px on a phone). Play flies the whole route in six seconds.
- **Reduced motion:** nothing scrolls by itself. As today, the glow round the plane is hidden (`.halo{display:none}`) and the plane still follows the visitor's own scrolling.
- **Stage font:** site font. `.frame` drops `var(--disp)`, and `.frame span` and `.mark-label` drop `var(--mono)`. `.dir` becomes 11px (was 10px).
- **Stage:**
  - `.stage`: `position:relative;overflow-y:auto;scrollbar-width:none;container-type:size;background:#0b0b0d`, with `aria-label="A plane on a flight route"`.
  - `.track{height:300cqh}`; `.pinned{position:sticky;top:0;height:100cqh}` (with its flex column, gap and padding). Measured: the route shrinks to fit above the panel at every size. The drawing is shown at 0.83 of its size at 1280×800, 0.62 at 1366×657, 0.35 in the 258px box of a 1280×590 window (87px tall, the panel still inside the box), 1.06 at 768×1024, 0.50 on a 375px phone and 0.42 on a 320px phone.
  - The player panel stays: it is the demo's picture of a video's playhead. Its label reads "Forward", "Backward" and "Still" (was "scrubbing", "rewinding" and "idle"); the frame count and the bar stay.
  - Text that changes every frame (shared rule 10): the frame count (`#frame`) gets `role="img"`, and `render()` sets its `aria-label` together with its text ("Frame 42 of 120"); the direction label (`#dir`) gets `aria-hidden="true"`, because it only repeats which way the plane is moving. Neither is a live region.
  - The route's labels (0%, 25% … 100%) keep one size on screen (shared rule 11, as part 2's SVG Line Draw does): today they are 9px in the drawing's units, so 7.5px on screen at 1280×800 and 3–6px on phones and short laptops. `.mark-label` loses its `font-size` and `stroke-width` in the CSS, and `buildMarks()` works out `k = 1 / rail.getScreenCTM().a` and gives each label `style.fontSize = 12 * k + 'px'`, `style.strokeWidth = 3 * k + 'px'` and `y = pt.y - 14 * k`, so they show at 12px, 14px above their mark, at every size. The `.flight` svg gets `overflow:visible;min-height:0`: `overflow:visible` keeps the 50% label over the top of the curve from being cut when the drawing is small, and `min-height:0` keeps the drawing shrinking, because the svg is a flex item and `overflow:visible` alone would make its smallest size its full 365px (measured: without it the drawing stays at 1.46 of its size and pushes the panel out of the box at 1280×800, 1366×657 and 1280×590; with it the scales above hold and the panel stays inside the box at every size). `.ticks` becomes 11px (was 9px).
  - Script: `easeSel.value` becomes a variable `ease` set by Feel; `render()` loses its side-panel readout lines (`progKv`, `frameKv`, `seekVal`, the slider), and `setDir()` loses `dirKv`. The Seek slider's listener goes. `measure()` (which calls `buildMarks()`) also runs after `document.fonts.ready`, because the drawing's size depends on the panel's text.
  - `hb-dots`: no. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Feel | Choice buttons | Even · Gentle · Smooth · Slow start | Even | Even follows the scroll exactly; the others reshape it. | `ease`: `'linear'` / `'inOut'` / `'out'` / `'in'` (the `EASES` curves), then clears the cache `G` and `update()` |

**More options**

None: leave out the `details.hb-options` block.

- **Removed:**
  - The note, and the Scroll, Frame and Direction readouts in the side panel.
  - The Seek slider. It moved the same playhead as scrolling (it wrote `scrollTop`), so scrolling and Play cover it.
  - The Easing menu. It becomes Feel.
  - Reset playhead. Back to top replaces it.
- **Good for:** Product tours · Explainers · Step-by-step diagrams · **Avoid on:** Short sections · Key information
- **Prompt:**

  > Add a scroll-scrubbed animation to [your illustration or product explainer]. Hold the scene in view while the visitor scrolls through a taller section, and turn how far they have scrolled into a progress value from 0 to 1. Draw the whole route up front, place the moving object at the point on it that matches the progress, facing along the path, and fill in the part already travelled. Nothing plays on a timer: scrolling back simply moves it back. Shape the progress with the easing given in the settings. If the visitor has reduced motion turned on, drop decorative effects but keep the object following the scroll. Match the settings listed below.

- **README What it is:** rewritten:

  > A scrub animation has no play button and no length in seconds: how far you have scrolled decides exactly which moment of the animation shows, like dragging the playhead of a video. Scroll down and it moves forward; scroll back and it moves back. The demo draws the whole flight route up front and fills it in as the plane flies, with a bar and a frame count underneath, so you can always see where you are.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Feel | Even | How scroll turns into progress: even follows the scroll one to one; gentle eases in and out; smooth slows toward the end; slow start begins slowly and speeds up |

- **README See also:**
  - [ScrollTrigger Animation](../scroll-trigger/) — animations start, follow and pin at set scroll points
  - [Pin Animation](../pin-animation/) — one part holds still while the page scrolls past
  - [Progress Bar](../progress-bar/) — the same scroll progress, shown as a filling bar
- **README How it works:** "Nothing here is time-based, which is why the Seek slider in the panel produces identical frames without any scrolling at all — it just writes `scrollTop` and lets the same code run. Scroll is one input to a position, not a trigger for playback." becomes "Nothing here is time-based: the Play button under the demo only scrolls the box at a steady speed, and the same code draws each frame. Scroll is one input to a position, not a trigger for playback." The rest is unchanged.
- **README Production notes:** the Accessibility bullet becomes: "**Accessibility.** The page scrolls the box once on arrival, and not at all under `prefers-reduced-motion: reduce`; after that it moves only when the visitor scrolls, so this is direct manipulation rather than imposed motion. Under reduced motion the demo drops the decorative glow and keeps the mapping, since removing it entirely would leave the control inert rather than calmer." The rest is unchanged.
- **Category line:** `01.08 · Scroll-Based`
- **Pager:** Previous: ScrollTrigger Animation (`../scroll-trigger/`) · Next: Pin Animation (`../pin-animation/`)

---

## pin-animation — Pin Animation

- **Kind:** scroll. Scrolling carries a phone and its text into view, holds them still while four features change, then lets them go.
- **Description:** One part stays put while its text changes on scroll. Best for feature lists.
- **Step 1:** Scroll it · help line: default
- **Player bar:** Play · Back to top
- **Try it:** none (the rollout spec: this demo has no settings). The page has steps 1 and 2.
- **Scroller:** the stage.
- **What scrolling shows:** an intro ("Scroll to begin"), then a phone drawing and its text rise into the box and hold still while the box keeps scrolling. Each quarter of that scrolling shows the next of four features: the phone's screen colour and number change with the text. After the fourth feature the phone and text scroll away and the closing panel rises. Scrolling back steps backwards.
- **Scroll distance and Play:** a 100cqh intro, the 300cqh pinned section with its sticky frame 100cqh tall, and a 100cqh closing panel: four box heights of scrolling (1,512px at 1280×800, 1,192px on a phone). The phone holds still for two of them, so Play spends three of its six seconds on the four features, about 0.75 seconds each.
- **Reduced motion:** nothing scrolls by itself, and nothing needs simplifying: the pin is not an animation and the features change at once. The demo's rule named the side panel's progress bar, which goes, so the rule goes too.
- **Stage font:** site font. The phone's two SVG texts lose `font-family="monospace"` and `opacity="0.5"`: with the opacity the number and the title measured 2.3–3.0:1 on the four screen colours, under the 4.5:1 rule (stage text faded with `opacity` below it is fixed in its section); without it they measure 4.9–7.7:1 and the screen still reads as lit.
- **Stage:**
  - `.stage`: `position:relative;overflow-y:auto;scrollbar-width:none;container-type:size;background:#0b0b0d`, with `aria-label="A phone that holds still while its features change"`.
  - `.intro{height:100cqh}`, `.pin-section{height:300cqh}`, `.pin-inner{position:sticky;top:0;height:100cqh}`, `.outro{height:100cqh}` (were 620px and 1860px, 480px on phones).
  - The phone drawing gets `aria-hidden="true"`: it repeats the feature's number and title (shared rule 12). On computers it becomes `.phone-wrap svg{height:min(200px,72cqh);width:auto}`, so it fits the 258px box of a 1280×590 window, where it is 186px tall (today's 200px drawing and the 32px padding need 264px). Measured: the phone 35–221px and the text 48–212px down the 258px box; at 1280×800 and above it stays 200px.
  - Phone rules (under 600px): the phone stays beside its text (today it stacks above it, and the text is cut off in the 300px box; measured): `.pin-inner{gap:14px;padding:16px}` keeps its row (today's `flex-direction:column` goes), `.phone-wrap svg{width:72px;height:131px}` in place of `transform:scale(.8)`, and `#phone-icon{display:none}`: at 72×131 the screen's title would be 7px tall and an 11px title is wider than the 60px screen, so it is hidden where the text beside the phone repeats it (shared rule 11); the screen keeps its 18px number. Measured with the 14px text: the longest feature's text takes 150px on a 375px phone and 198px on a 320px phone (51–249px down the 298px box).
  - `.feat-desc` becomes 14px (was 12px), and so do the intro's and the closing panel's text (was 13px).
  - The intro's and the closing panel's titles become `<p class="panel-title">` (were `h2`, shared rule 13). Today's `.intro p` and `.outro p` rules would also match them, so the text rules exclude the titles and the titles get rules of their own:
    - `.intro p:not(.panel-title){font-size:14px;color:var(--ui-muted);max-width:340px;line-height:1.65}` and `.outro p:not(.panel-title){font-size:14px;color:var(--ui-muted);max-width:300px;line-height:1.6}` (were `.intro p` and `.outro p` at 13px);
    - `.intro .panel-title{font-size:clamp(20px,3vw,28px);font-weight:700;margin-bottom:12px}` and `.outro .panel-title{font-size:clamp(18px,2.5vw,24px);font-weight:700;margin-bottom:10px}` (were `.intro h2` and `.outro h2`), so the titles keep the stage's white and a normal line height.
  - The intro's text reads "The phone and its text will stop in the middle of the box and hold still while four features go by." (today it says CSS handles the pinning). The closing panel keeps "Pin released", and its text reads "The phone and its text let go and scroll away with the page again." (today it speaks of the document flow).
  - The four features' texts stay.
  - Script: `update()` keeps the feature index, the texts and the phone's colours; the Scroll, Lifecycle and Feature readouts and the segment bar go.
  - `hb-dots`: no. Default height.
- **Removed:**
  - The note, the Scroll, Lifecycle and Feature readouts, and the Feature progress bar.
  - Reset scroll. Back to top replaces it.
- **Good for:** Feature lists · Product tours · Onboarding · **Avoid on:** Short screens · Long text
- **Prompt:**

  > Add a pinned section to [your product page, and the element that should stay in view]. Make the section several screens tall and pin the element and its text in the middle of the view while the visitor scrolls through it; the extra height is how long it stays. Split that distance into equal parts and show the next feature's text and picture in each part. When the section ends, let the element scroll away with the page. Use the browser's sticky positioning for the pin instead of moving it with a script. If the visitor has reduced motion turned on, change the features without animation.

- **Copy prompt hint:** "Replace the words in brackets with your own page and element."
- **README What it is:** rewritten:

  > A pin animation holds part of the page still while the rest scrolls past. In the demo, a phone and its text stop in the middle of the box while you scroll through a section three boxes tall, and its four features change as you go; at the end of the section they let go and scroll away. The browser's sticky positioning does the pinning, with no script moving anything.

- **README Key parameters:** the technique's own values (the page has no settings):

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Pinned section | Three box heights | The phone holds still for the two extra box heights; a taller section makes each feature last longer |
  | Number of features | 4 | The features share the pinned scrolling equally |
  | Pinned at | The top of the box | Where the pinned frame sticks; the phone sits in its middle |

- **README See also:**
  - [Scrub Animation](../scrub-animation/) — scroll plays an animation forward and back
  - [ScrollTrigger Animation](../scroll-trigger/) — animations start, follow and pin at set scroll points
  - [Sticky Section](../sticky-section/) — a whole section holds still while its content changes
- **README How it works:**
  - The CSS snippet becomes:

    ```css
    .stage {
      position: relative;
      overflow-y: auto;
      container-type: size;   /* 100cqh is one box height */
    }
    .pin-section {
      height: 300cqh;         /* three times the box */
    }
    .pin-inner {
      position: sticky;
      top: 0;
      height: 100cqh;         /* one box tall */
    }
    ```

  - Delete "The lifecycle is derived from the same values:" and the snippet under it; the page no longer shows a lifecycle.
  - The rest is unchanged.
- **README Production notes:** unchanged
- **Category line:** `01.09 · Scroll-Based`
- **Pager:** Previous: Scrub Animation (`../scrub-animation/`) · Next: Snap Scrolling (`../snap-scrolling/`)

---

## snap-scrolling — Snap Scrolling

- **Kind:** scroll. Scrolling moves through five sections, and the box settles on one whole section at a time.
- **Description:** The box settles on one whole section at a time. Best for slides and galleries.
- **Step 1:** Scroll it · help line: "Scroll inside the box and let go: it settles on the nearest section. Press Play and it glides through without snapping." (owner decision 2)
- **Player bar:** Play · Back to top
- **Scroller:** `<div class="scroller" id="scroller" data-hb-scroller data-snap="mandatory" tabindex="0" role="region" aria-label="Five sections that the box snaps to"><div class="snap-rail"><div class="snap-dots" id="snap-dots"></div></div></div>` inside the `.stage`; the script appends the sections after the rail. The `.stage` does the job of today's `.stage-wrap`. The dots sit inside the scroller, in a zero-height sticky rail (category rule on the scroller), so they stay in place while the sections move and a swipe, a wheel turn or a key press that starts on them scrolls the box. Beside the scroller they were a 44×220px strip (13% of the width and 74% of the height of a 375px phone's box) where scrolling moved the page (found in review). The script calls it `scroller` wherever it said `stage`.
- **What scrolling shows:** five full-box sections in different colours. Stop scrolling between two and the box glides to the nearer one, so a section always shows whole; with When close it only settles near a section, and with Off it stops anywhere. The dots at the right edge light up for the section in view, and pressing a dot glides to its section. Play glides straight through, because the shared script turns snapping off while it runs (shared rule 7); any input inside the stage stops Play (shared rule 6), snapping comes back, and the box settles on the nearest section by itself.
- **Scroll distance and Play:** five sections at 100cqh: four box heights of scrolling (1,512px at 1280×800, 1,192px on a phone). Play glides through all five in six seconds, a section about every 1.5 seconds, without snapping (owner decision 2); the snapping shows when the visitor scrolls. The page does nothing for this: while Play runs, the shared script marks the scroller with `data-hb-autoscrolling` and a shared rule turns its snapping off; when the run ends or is stopped, the page's own snapping applies again, including a Snapping choice made during the run (shared rule 7).
- **Reduced motion:** nothing scrolls by itself. As today, the box lands on a section at once instead of gliding, and the dots change without their transition: the demo's rule becomes `@media(prefers-reduced-motion:reduce){.scroller{scroll-behavior:auto!important}.dot::before{transition:none!important}}`.
- **Stage font:** site font. The quote drops its italic.
- **Stage:**
  - `.stage`: `position:relative;overflow:hidden;background:#0b0b0d`.
  - `.scroller`: `height:100%;overflow-y:auto;scrollbar-width:none;position:relative;container-type:size;scroll-behavior:smooth`, with the `::-webkit-scrollbar{display:none}` rule. The old stage's border and height go.
  - Snapping comes from an attribute (shared rule 7): the scroller starts with `data-snap="mandatory"`, and three rules read it: `.scroller[data-snap="mandatory"]{scroll-snap-type:y mandatory}`, `.scroller[data-snap="proximity"]{scroll-snap-type:y proximity}` and `.scroller[data-snap="off"]{scroll-snap-type:none}`. None uses `!important`, so the shared rule can turn snapping off during Play.
  - `.section{height:100cqh}` (was 620px, 480px on phones). The script's `620` becomes `scroller.clientHeight` (the dot and the section in view: `Math.min(Math.round(scroller.scrollTop / scroller.clientHeight), 4)`; the dot's jump: `scroller.scrollTo({ top: i * scroller.clientHeight })`, without `behavior`, so the box's own `scroll-behavior` decides: a glide, or a jump under reduced motion).
  - The dots sit at the right edge inside the box on every screen, in the rail: `.snap-rail{position:sticky;top:0;height:0;z-index:1}` (the scroller's first child, so it sticks to the top of the box while the sections scroll under it, and adds nothing to the scroll range, the section offsets or the first snap point at 0) and `.snap-dots{position:absolute;right:4px;top:50cqh;transform:translateY(-50%);display:flex;flex-direction:column}` (`50cqh` is half the scroller's height; a percentage would be of the 0px-tall rail); the phone rule that fixed them to the window goes. Each dot becomes `<button type="button" class="dot" aria-label="Section 1">` (to 5): `.dot{width:44px;height:44px;padding:0;border:0;background:none;font:inherit;display:grid;place-items:center;cursor:pointer}` (`font:inherit`: a button computes Arial otherwise, and the stage's font audit then finds only the site font), with the 8px dot drawn by `.dot::before{content:'';width:8px;height:8px;border-radius:50%;background:var(--ui-muted);transition:background .2s,transform .2s}` and `.dot.active::before{background:var(--ui-accent);transform:scale(1.4)}`. The active dot also gets `aria-current="true"`. The shared script stops Play on any press inside the stage, so a dot works during Play too. Five dots take 220px, which fits the 258px box of a 1280×590 window and the 298px phone box. The dots' focus ring comes from the shared stylesheet (shared rule 2).
  - The section texts are rewritten in plain words (today's speak of the browser engine, CSS and JavaScript):

    | Section | Title | Text |
    |---|---|---|
    | 01 | Pages, not pixels | Snap scrolling turns one long scroll into a few set stops. Each section is a place to land. |
    | 02 | Magnetic edges | Stop scrolling and the box pulls itself to the nearest section. |
    | 03 | A page at a time | Design in whole sections, not an endless strip. Each stop is a chapter. |
    | 04 | (quote) | "The feeling of deliberate motion is hard to achieve with code alone." — on scroll design (unchanged) |
    | 05 | That's the whole trick | The browser does the pulling. Nothing has to be timed or scripted. |

    Section 03's three figures read 5 "Sections", 5 "Resting points" and 0 "Stops in between" (were Snap points, Lines of CSS and JS needed), with `.stat-label` at 12px (was 10px). `.sec-sub` becomes 14px (was 13px). Measured: every section's text fits its box at every size; the tallest, section 03, needs 191px in the 258px box and 217px of 298 on a 320px phone.
  - Script: the Position, Title and Status readouts and `getStatus()` go; the `scroll` listener keeps the dots.
  - `hb-dots`: no. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Snapping | Choice buttons | Always · When close · Off | Always | Scroll by hand to see it; Play glides without snapping. | `scroller.dataset.snap`: `'mandatory'` / `'proximity'` / `'off'` (the three CSS rules above set `scroll-snap-type`) |

**More options**

None: leave out the `details.hb-options` block.

- **Removed:**
  - The note, and the Position, Title and Status readouts.
  - The "y mandatory", "y proximity" and "none" buttons. They become Snapping.
  - The Jump to section buttons. They are navigation, and the dots, scrolling and Play cover them.
- **Good for:** Slides · Galleries · Onboarding · Full-screen sections · **Avoid on:** Long articles · Uneven sections
- **Prompt:**

  > Add snap scrolling to [your page of full-height sections, slides or gallery]. Make each section exactly as tall as the scrolling area and mark its top as a snap point, so that, as the settings choose, the view settles on the nearest section instead of stopping between two. Use the browser's built-in scroll snapping rather than a script. Add small dots that show which section is in view and take the visitor to a section when pressed. Check scrolling with the arrow keys too, because strict snapping can feel stiff there. If the visitor has reduced motion turned on, let the view settle without a smooth glide. Match the settings listed below.

- **Copy prompt hint:** the template line, "Replace the words in brackets with your own element. Your settings are added at the end." (this section gave none; every other scroll page with settings uses the template line)
- **README What it is:** rewritten:

  > Snap scrolling makes a scrolling area settle on set points instead of stopping anywhere. When you stop scrolling, the browser pulls the view to the nearest section, so each section is shown whole, like turning pages. The browser does the pulling on its own; no script is needed for it.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Snapping | Always | Always settles on a section after every scroll; when close settles only when the box stops near one; off never snaps |

- **README See also:**
  - [Stacking Cards](../stacking-cards/) — cards pile into a deck as you scroll
  - [Section Wipe](../section-wipe/) — each section slides up over the one before
  - [Fly-in Fly-out Contact List](../fly-in-fly-out-contact-list/) — rows fade and slide as they near the edges
- **README How it works:**
  - The CSS snippet becomes:

    ```css
    /* On the scroll container */
    .scroller {
      overflow-y: auto;
      container-type: size;          /* 100cqh is the box's height */
      scroll-snap-type: y mandatory; /* or 'y proximity' */
    }

    /* On each section */
    .section {
      height: 100cqh;                /* one box tall */
      scroll-snap-align: start;
    }
    ```

  - "The mode toggle in the demo changes `scroll-snap-type` live." becomes "The Snapping setting switches between the three through a `data-snap` attribute that three CSS rules read. While the Play button scrolls the box, a shared rule turns snapping off on it, and the page's own snapping applies again when it stops."
  - "Pagination dots and jump-to buttons use `scrollTo` with `behavior: 'smooth'`:" becomes "The dots scroll to their section; leaving out `behavior` lets the box's own `scroll-behavior` decide, so it glides, or jumps under reduced motion:", and its snippet becomes `scroller.scrollTo({ top: sectionIndex * scroller.clientHeight });`.
  - The last snippet becomes `const sectionIndex = Math.round(scroller.scrollTop / scroller.clientHeight);`.
- **README Production notes:** unchanged
- **Category line:** `01.10 · Scroll-Based`
- **Pager:** Previous: Pin Animation (`../pin-animation/`) · Next: Scrollytelling (`../scrollytelling/`)

---

## scrollytelling — Scrollytelling

- **Kind:** scroll. Scrolling moves six ocean chapters past a porthole that changes with them.
- **Description:** A picture beside the story changes as you read down. Best for data stories.
- **Step 1:** Scroll it · help line: default
- **Player bar:** Play · Back to top
- **Try it:** none (owner decision 1). The demo has no settings today (its aside holds only a Jump to chapter list and Return to surface). The page has steps 1 and 2.
- **Scroller:** the stage (a row: the porthole column sticks while the chapters scroll).
- **What scrolling shows:** six chapters, from the surface down to the deepest trench, scroll up beside a porthole that holds still. As each chapter passes a reading line 42% down the box, the porthole's water and ring blend smoothly toward the next chapter's colours, darkening as you sink, and the depth under it counts up from 0 to 10,935 metres. Under 600px wide the porthole and the depth sit in a strip across the top and the chapters scroll under it.
- **Scroll distance and Play:** six chapters of at least 90cqh (their text makes some taller): about 4.5 box heights at 1280×800 (1,683px) and 5.4 on a 375px phone (1,600px). Play sinks through a chapter about every second.
- **Reduced motion:** nothing scrolls by itself, and nothing needs simplifying: the water's colour, the ring and the depth follow the visitor's own scrolling directly. The demo's `#ph-bg{transition:background 1.2s ease}` and its reduced-motion rule (`#ph-bg{transition:none!important}`) both go: a gradient background cannot be transitioned, so neither ever did anything.
- **Stage font:** site font. `.ch-fact` drops its italic.
- **Stage:**
  - `.stage`: `position:relative;overflow-y:auto;scrollbar-width:none;container-type:size;background:#0b0b0d;display:flex`, with `aria-label="Six chapters about the ocean's depths"`.
  - `.vis{height:100cqh}` and `.ch{min-height:90cqh}` (were `var(--stage-h)` and `calc(var(--stage-h) * 0.9)`).
  - The porthole shrinks in short boxes so the column fits: `#porthole{width:min(220px,85%,calc(100cqh - 106px))}` (was `min(220px,85%)`). Today, in the 258px box of a 1280×590 window, the porthole and the depth need 306px and overflow the column by 24px at each end; with the new width the porthole is 152px there (content 238px), 219px at 1366×657 and 220px from 1280×800 up (measured).
  - Phone rules (under 600px), today's with new sizes: `.stage{flex-direction:column}`; `.vis{position:sticky;top:0;width:100%;height:112px;flex-direction:row;gap:16px;padding:14px 16px;z-index:2;background:#0b0b0d}` (was 200px tall, two-thirds of the new 300px box, and without a background, so the text showed through it); `#porthole{width:84px;border-width:3px}` (was 140px); `.chapters{padding:12px 16px}`. Measured: the strip's content fits (14–98px of 112) and the chapters get 186px of the phone box.
  - Text sizes: `.ch-body` 14px (was 12px), `.ch-fact` 14px (was 10px), `.ch-eye` 11px (was 10px), `#depth-lbl` 11px `#8a8a92` without the opacity .4 (today about 3.5:1).
  - Text that changes every frame (shared rule 10): `#depth-num` gets `role="img"`, and `update()` sets its `aria-label` with its text ("1,000 metres deep"); `#depth-lbl` gets `aria-hidden="true"`, because its words are in that label. It is not a live region. The porthole (`#porthole`) gets `aria-hidden="true"` (shared rule 12).
  - The depth number and the chapter labels mix their chapter colour half and half with `#f4f4f2`: `depNum.style.color = lerpCol(col, '#f4f4f2', 0.5)`, and each `.ch-eye` gets `lerpCol(c.ac, '#f4f4f2', 0.5)` without its opacity .6. The three deepest colours (`#003d55`, `#001f30`, `#000e18`) are nearly invisible on the dark stage today; mixed, the darkest reads about 5:1. The porthole's ring and water keep the full colours, which is where the darkening shows.
  - The chapter texts stay.
  - Script: `update()` keeps the fraction, the depth, the water and the ring; the Scroll and Chapter readouts and the jump buttons' `on` class go, and so does the jump list's build.
  - `hb-dots`: no. Default height.
- **Removed:**
  - The note, and the Scroll and Chapter readouts.
  - The Jump to chapter buttons. They are navigation, and scrolling, Play and Back to top cover them.
  - Return to surface. Back to top replaces it.
- **Good for:** Data stories · Explainers · Long reads · **Avoid on:** Short pages · Quick reference
- **Prompt:**

  > Add a scrollytelling layout to [your story and the picture that goes with it]. Put the story in a column of chapters that scrolls, and keep the picture in view beside it. Work out which chapter has passed a reading line about 40% down the view and how far it is toward the next, as a fraction, and blend every value in the picture between the two chapters with it, such as colors and a counting number, so the picture changes smoothly as the visitor reads. On phones, pin a short strip of the picture above the text. If the visitor has reduced motion turned on, change the picture without fading.

- **Copy prompt hint:** "Replace the words in brackets with your own story and picture."
- **README What it is:** rewritten:

  > Scrollytelling ties a picture to a story told in scrolling text. As you read down, the picture beside the text changes with you, blending smoothly between chapters instead of switching at each one. In the demo you sink through six layers of the ocean while the porthole's water darkens and the depth counts up to 10,935 metres.

- **README Key parameters:** the technique's own values (the page has no settings):

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Reading line | 42% down the box | A chapter becomes current once its top passes this line; a lower line changes chapters later |
  | Chapter height | At least 90% of the box | How much scrolling each chapter takes; taller chapters make slower, finer blends |
  | Number of chapters | 6 | Each chapter adds its colours and its depth to the blend |

- **README See also:**
  - [Sticky Section](../sticky-section/) — a whole section holds still while its content changes
  - [Scrub Animation](../scrub-animation/) — scroll plays an animation forward and back
  - [Reveal on Scroll](../reveal-on-scroll/) — cards appear as they cross a line
  - [Progress Bar](../progress-bar/) — a bar fills as you read
- **README How it works:** unchanged
- **README Production notes:** the Reduced motion bullet becomes: "**Reduced motion**: nothing here moves on its own; the colours and the depth follow the reader's scrolling, so there is nothing to switch off. A CSS transition on the porthole's gradient would not help anyway: gradients cannot be transitioned, which is why the blend is worked out in JavaScript." The rest is unchanged.
- **Category line:** `01.11 · Scroll-Based`
- **Pager:** Previous: Snap Scrolling (`../snap-scrolling/`) · Next: Reveal on Scroll (`../reveal-on-scroll/`)

---

## reveal-on-scroll — Reveal on Scroll

- **Kind:** scroll. Scrolling carries cards past a line, where each is revealed.
- **Description:** Cards appear as they cross a line in the box. Best for long landing pages.
- **Step 1:** Scroll it · help line: "Scroll inside the box, or press Play. Back to top hides the cards again."
- **Player bar:** Play · Back to top
- **Scroller:** `<div class="scroller" id="scroller" data-hb-scroller tabindex="0" role="region" aria-label="Seven cards that appear as you scroll">` inside the `.stage`. The `.stage` does the job of today's `.stage-wrap`: it holds the dashed trigger line beside the scroller, so the line stays in place while the cards move. The script calls it `scroller` wherever it said `stage`.
- **What scrolling shows:** seven cards rise toward a dashed line across the box. Each stays hidden until its top passes the line, then settles into place in its own way: a fade, a rise, a slide from the left, a grow, a sharpen from a blur, a wipe from the left, and a group of four chips that arrive one by one. A card stays shown after that, unless Plays every time is on; then it hides again when it drops back below the line.
- **Scroll distance and Play:** the cards' own height, with 200px of room after the last so it can pass the highest line: about 2.1 box heights at 1280×800 (800px) and 3.1 on a 375px phone (921px). At the Normal line the first cards show whole on arrival (the observer may already have revealed the next one, partly below the box edge): two at 1280×800, at 1366×657 and on a 375px phone, three in the 438px boxes (768×1024 and 610×1000), and one in the 258px box of a 1280×590 window and on a 320px phone. Play reveals the rest about a second apart.
- **Every Trigger line is reached** (shared rule 4): at the end of the scroll the last card's top is at most 115px down the box (at 768×1024 and at 610×1000, where the box is 438px), always above even the Higher line at half the box; measured from the 258px box to the 438px box and on phones.
- **Back to top and Play from the end:** Back to top, and Play pressed with the box at its end (Play then starts from the top), hide every card and arm the reveals again, as today's Reset all cards did. The page listens for clicks on `#btn-top`, and on `#btn-scroll` when `scroller.scrollTop >= scroller.scrollHeight - scroller.clientHeight - 2`: it calls `hide()` on every card and `buildObserver()` 50ms later, after the jump to the top. This relies on the order of the listeners: the page's inline script registers its click listeners before the shared script (loaded with `defer`) registers Play's and Back to top's, so on a click the page still sees the box at its end before Play jumps it to the top. The listeners must stay in the inline script's top level.
- **Reduced motion:** nothing scrolls by itself. As today, each card appears at the line without moving (`.card, .card .stagger-child{transition:none!important}`).
- **Stage font:** site font.
- **Stage:**
  - `.stage`: `position:relative;overflow:hidden;background:#0b0b0d`.
  - `.scroller`: `height:100%;overflow-y:auto;scrollbar-width:none;position:relative`, with the `::-webkit-scrollbar{display:none}` rule. The old stage's width, border and height go, and so does `--stage-h`.
  - `#trigger-line` stays in the `.stage`, over the scroller: `updateLine()` sets its `top` to `scroller.clientTop + threshold / 100 * scroller.clientHeight`. Its label keeps "trigger", at 11px (was 9px). Today the line and its label each have `opacity:.7`, so the label reads about 2.7:1; the line drops its opacity and draws its dashes in `rgba(110,168,255,.7)` instead, and the label drops its own, so it shows in the full accent (7.9:1) while the dashes look as they do today.
  - The cards' texts are rewritten in plain words (today's bodies are CSS values such as "opacity 0 → 1"). The tag reads "Technique 01" to "Technique 07" (the code names after it go), at 11px without the opacity .7; the titles stay:

    | Card | Title | Text |
    |---|---|---|
    | 01 | Fade | Goes from see-through to solid. |
    | 02 | Slide Up | Rises a little as it fades in. |
    | 03 | Slide from Left | Slides in from the left as it fades in. |
    | 04 | Scale In | Grows from slightly smaller as it fades in. |
    | 05 | Blur In | Sharpens from a blur as it fades in. |
    | 06 | Mask Reveal | Uncovered from left to right. |
    | 07 | Stagger Group | (the four chips Alpha, Beta, Gamma and Delta, unchanged) |

    `.card-body` becomes 14px (was 11px) and `.stagger-chip` 12px (was 10px).
  - Script: `reveal()` and `hide()` keep the class change; their state-readout lines go, and so do `logEvent()`, `obsSnippet()` and the Card states list.
  - `hb-dots`: no. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Trigger line | Choice buttons | Higher · Normal · Lower | Normal | How far up the box a card must come to appear. | `threshold`: 50 / 70 / 90 (% down the box), then `updateLine()` and `buildObserver()` |
| Plays every time | Switch | on / off | off | Cards hide again below the line and replay each time. | `repeatTog.checked` (the switch keeps the id `repeat-tog`), then `buildObserver()` |

**More options**

None: leave out the `details.hb-options` block.

- **Removed:**
  - The note, and the Observer config code, the Event log and the Card states list.
  - The Trigger position slider. It becomes Trigger line.
  - "Repeat on re-enter" becomes Plays every time.
  - Reset all cards. Back to top does it now (see above).
- **Good for:** Landing pages · Feature lists · Blog sections · **Avoid on:** Key information · Forms
- **Prompt:**

  > Add reveal-on-scroll animations to [the sections or cards on your page]. Keep each element in a hidden starting state, such as faded, shifted, shrunk, blurred or clipped, until it rises past a trigger line inside the view, then let it settle into its normal state. Watch the elements with the browser's intersection observer rather than on every scroll, and count an element that is already above the line as crossed, so a fast scroll never skips one. Reveal each element once, or every time it crosses, as the settings say. If the visitor has reduced motion turned on, show each element without movement. Match the settings listed below.

- **README What it is:** rewritten:

  > A reveal on scroll keeps an element hidden, such as faded, shifted, shrunk, blurred or clipped, until it rises past a line in the view, then lets it settle into place. The browser reports when each element crosses the line, so nothing has to run on every scroll. The demo shows seven reveal styles behind one dashed line.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Trigger line | Normal | Where the dashed line sits: higher is halfway down the box, normal 70% down and lower 90% down; the higher the line, the further a card must scroll before it appears |
  | Plays every time | off | Off, each card appears once and stays; on, it hides again when it drops back below the line and replays the next time |

- **README See also:**
  - [Stagger Reveal](../stagger-reveal/) — items in a group appear one after another
  - [ScrollTrigger Animation](../scroll-trigger/) — animations start, follow and pin at set scroll points
  - [Fly-in Fly-out Contact List](../fly-in-fly-out-contact-list/) — rows fade and slide as they near the edges
  - [Scrollytelling](../scrollytelling/) — a picture beside the story changes as you read
- **README How it works:** in the snippet, `root: stage` becomes `root: scroller`. The rest is unchanged.
- **README Production notes:** unchanged
- **Category line:** `01.12 · Scroll-Based`
- **Pager:** Previous: Scrollytelling (`../scrollytelling/`) · Next: Stagger Reveal (`../stagger-reveal/`)

---

## stagger-reveal — Stagger Reveal

- **Kind:** scroll. Scrolling brings three groups into the box, and each reveals its items one after another.
- **Description:** Items in a group appear one after another as it scrolls in. Best for card grids.
- **Step 1:** Scroll it · help line: "Scroll inside the box, or press Play. Back to top hides the groups again."
- **Player bar:** Play · Back to top
- **Scroller:** the stage.
- **What scrolling shows:** three groups: a grid of twelve cards (two columns on phones), a list of six people and a cluster of eight tags. As each group comes into the box, its items fade in and rise one after another, a short delay apart, in the chosen order. A group stays shown after that. On arrival the grid is in the box and plays at once; the list and the tags play as the box scrolls, each once half of it is in the box or its bottom edge is, so their cascades happen where the visitor can see them.
- **Scroll distance and Play:** the groups' own height: about 1.3 box heights at 1280×800 (510px) and 2.7 on a phone (792px). Play reaches the list between about one and three seconds in (0.9 to 2.8 s: earlier in a tall box, later on a phone) and the tags about five seconds in (4.8 to 5.2 s), so their cascades end about when the six-second run does (only the grid plays on arrival, at every size).
- **Every group plays** (shared rule 4): a group has no line. It plays once half of it is in the box, or its bottom edge has come into the box, so the last rows of a long group are never left hidden. The observers watch the group's items (`#grid`, `#list` and `#chips`), not the section around them (whose padding and heading made the cascade run before any item was on screen), and have a threshold every 5% (`Array.from({length:21},(_,i)=>i/20)`), so a jump straight to the end is not missed: a plain `threshold:.5` leaves the visible rows hidden at the end, and `[0,.5]` misses a jump from the top to the end. The box scrolls until the last group is wholly in view, so all three play at every size, and in Play 3 to 4 of the 6 list rows and all 8 tags are seen fading in at every size. Until a group plays, the items of it already in the box stay hidden (up to three list rows for about a second in Play).
- **Back to top, Play from the end, and settings:** Back to top, Play pressed with the box at its end, and every settings change rebuild the three groups hidden and watch them again, as today's Replay all groups did (without its scroll to the top). A new helper `rebuild()` clears the timers still pending from the last reveal, rebuilds the grid, list and chips hidden, and calls `attachObservers()`; the groups in the box then replay with the current settings. The page calls it on clicks on `#btn-top`, and on `#btn-scroll` when `stage.scrollTop >= stage.scrollHeight - stage.clientHeight - 2`, at once in the same click, as a settings change does, so the difference shows where the box is. It does not wait for the jump to the top: the new observers first report on the next frame, after the shared script has jumped the box, so the groups in view play from the top and the finished groups are never drawn there (with a 50ms delay they stayed on screen for about four frames). This relies on the order of the listeners: the page's inline script registers its click listeners before the shared script (loaded with `defer`) registers Play's and Back to top's, so on a click the page still sees the box at its end before Play jumps it to the top. The listeners must stay in the inline script's top level.
- **Reduced motion:** nothing scrolls by itself. As today, the items appear in the same order and with the same delays, but without moving (`.item{transition:none!important}`).
- **Stage font:** site font.
- **Stage:**
  - `.stage`: `position:relative;overflow-y:auto;scrollbar-width:none;background:#0b0b0d`, with `aria-label="Three groups of items"`.
  - The group headings read "01 · Grid", "02 · List" and "03 · Tags" (were "01 · Card Grid (4 × 3)", "02 · List Rows" and "03 · Tag Chips"), without the opacity .7.
  - The delay badges on the grid ("0ms", "50ms" …) go: they are readouts.
  - Phone rule kept (under 600px): `.grid{grid-template-columns:repeat(2,1fr)}`.
  - The tags become plain words (today they are code names such as IntersectionObserver and rAF): Design, Travel, Music, Food, Books, Film, Sport, Science. The grid's Greek letters and the list's six people stay.
  - Text sizes: `.grid-cell` 12px (was 10px), `.list-label` 13px (was 11px), `.list-meta` 12px `#8a8a92` without its opacity .4 (today about 3.5:1), `.chip` 12px (was 10px).
  - Script: `staggerIn()` keeps each pending timer in a list that `rebuild()` clears, and loses its badge argument. The matrix code (`updateMatrix()` and the matrix build) goes.
  - `hb-dots`: no. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Delay between items | Choice buttons | Short · Medium · Long | Medium | Longer delays make the order easier to see. | `staggerMs`: 30 / 50 / 80 (ms), then `rebuild()` |
| Order | Choice buttons | First to last · Last to first · From the middle · Random | First to last | Which item appears first. | `direction`: `'forward'` / `'reverse'` / `'center'` / `'random'`, then `rebuild()` |

**More options**

None: leave out the `details.hb-options` block.

- **Removed:**
  - The note, and the Preview matrix (a readout of the order).
  - The Stagger delay slider. It becomes Delay between items.
  - The Cascade direction buttons (with their arrows). They become Order.
  - Replay all groups. Back to top, Play from the end and every settings change do it now.
- **Good for:** Card grids · Search results · Menus · Galleries · **Avoid on:** Long lists · Key information
- **Prompt:**

  > Add a stagger reveal to [your grid, list or group of items]. When the group scrolls into view, reveal its items one after another instead of all at once: each item fades in and rises a little, starting a short delay after the one before, in the order the settings choose. Make each item's own animation longer than the delay between items, so they overlap into one sweep, and keep the whole cascade under about 600ms on long lists. If the visitor has reduced motion turned on, show the items without movement. Match the settings listed below.

- **README What it is:** rewritten:

  > A stagger reveal shows a group of items one after another instead of all at once, with a short delay between them, so the group appears as a sweep. The order can run from first to last, last to first, from the middle outward, or at random. The demo plays it on a grid of cards, a list and a cluster of tags as each scrolls into view.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Delay between items | Medium | The wait before each next item: short is 30ms, medium 50ms and long 80ms; 40 to 60ms reads as a sweep, and under 30ms the items seem to arrive together |
  | Order | First to last | Which item goes first: first to last, last to first, from the middle outward, or a random order each time |

- **README See also:**
  - [Reveal on Scroll](../reveal-on-scroll/) — one element appears as it crosses a line
  - [Fly-in Fly-out Contact List](../fly-in-fly-out-contact-list/) — rows fade and slide as they near the edges
  - [Stacking Cards](../stacking-cards/) — cards pile into a deck as you scroll
  - [Snap Scrolling](../snap-scrolling/) — the box settles on one section at a time
- **README How it works:** delete the last sentence of the paragraph after the snippet, "The side panel's preview matrix renders those same ranks as numbered, brightness-coded dots so the cascade is legible before you scroll."; the page no longer has the matrix. The rest is unchanged.
- **README Production notes:** the Reduced motion bullet becomes: "**Reduced motion**: transitions are disabled under `prefers-reduced-motion`, so each item simply appears at its turn, without moving — the stagger is decorative, never load-bearing." The rest is unchanged.
- **Category line:** `01.13 · Scroll-Based`
- **Pager:** Previous: Reveal on Scroll (`../reveal-on-scroll/`) · Next: Horizontal Scroll (`../horizontal-scroll/`)
