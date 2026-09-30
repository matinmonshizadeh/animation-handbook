# Scroll-Based — Content Sheet, Part 2

This half of the Scroll-Based sheet decides, page by page, how the last thirteen Scroll-Based pages (home-page order, 01.14 Horizontal Scroll to 01.26 Scroll-Driven Background Color) present their kind, step 1, settings, words and prompt on the guided-steps page. Part 1, written at the same time by another writer, covers Parallax Depth-of-Field to Stagger Reveal. The conversion tasks of `2026-09-29-demo-page-rollout-parallel.md` follow each section exactly, together with "How to convert a page" in `2026-09-28-demo-page-rollout-text-typography.md`, the rollout's Global Constraints, and the markup for pages without settings, do-it pages and scroll pages in `2026-09-29-demo-page-kinds-do-and-scroll.md`. Rotate In (`animations/02-entrance-and-exit/rotate-in/`) is the reference for everything a section does not mention; the do-it/scroll plan's scratch scroll page is the reference for a scroll page's step 1 and its scroller attributes.

Twelve of these pages are scroll pages. Smooth (Inertia) Scroll is a do-it page; its section says why. Horizontal Scroll and Sticky Section have no settings, so they have no Try it step.

The two lists below, A and B, were settled after both halves were reviewed. They read the same in both halves' preambles; sections refer to them as "owner decision N" (list A) and "rule BN" (list B).

## A. Owner decisions (all accepted, 2026-09-29)

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

## B. Category rules (the same in both halves)

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

## Earlier owner decisions and lessons that apply here

- **Stage text uses the site font.** None of these effects is about typing, so every `font-family` on stage text goes (Bricolage, PlexMono, `var(--disp)`, `var(--mono)`), and so do the `@font-face` lines. A button on a stage gets `font:inherit`, because a button does not take the page font by itself.
- **Scroll and do-it pages show themselves once on arrival.** Scroll pages use `<body class="hb" data-hb-kind="scroll" data-hb-autoplay>`: 400ms after load the shared script presses Play, which scrolls the box from the top to its end at one steady speed, the whole box in about six seconds whatever its length. Smooth (Inertia) Scroll uses `data-hb-kind="do"`, and the shared script presses Show me once.
- **Reduced motion runs nothing by itself.** The box does not scroll on arrival and Show me does not run, while Play, Back to top, Show me and Reset still work when pressed. A page's own scroll effects may be simplified; each section says what the page's own reduced-motion code keeps. None of these pages has Loop, Slow motion or Pause, so the shared script greys nothing out and adds no note.
- **Long names in the top bar** (Scroll-Driven Background Color, SVG Line Draw on Scroll, Smooth (Inertia) Scroll) are cut with "…" by the shared stylesheet; the pages do nothing.
- **Lessons from the Text & Typography reviews** that apply here:
  - The page reaches the player controls by their ids (`btn-scroll`, `btn-top`, `btn-demo`, `btn-reset`), never by their `data-hb-*` attributes.
  - Smooth (Inertia) Scroll registers its `hb:input` listener at the top level of its inline script. The listener only stops a Show me run that is under way, so it is safe to receive again and again (owner decision 8).
  - Text that changes every frame gets `role="img"` and an `aria-label` with the real text, and no live region (Counter Animation's numbers). Text that only repeats what the stage already shows is hidden from screen readers instead (Progress Bar's ring).
  - Text whose layout the script measures is measured again after `document.fonts.ready` (Scrollspy Navigation's section tops, Smooth (Inertia) Scroll's content height).

## Rules for the whole category

- **Accent and category line:** every page uses `--ui-accent:#6ea8ff`, the colour 25 of the 26 pages already have (Scroll Image Sequence, which has none, gets it). The category line is `01.NN · Scroll-Based`, where NN is the page's position on the home page, which its card already shows (01.14 to 01.26 in this half).
- **Step 1** is titled "Scroll it". Its default help line is "Scroll inside the box, or press Play and it scrolls for you." A section gives a page-specific line where it helps.
- **Player bar of a scroll page:** the Play button and then the Back to top button, exactly as in the do-it/scroll plan, and nothing else (no Slow motion, Replay, Loop or Pause).
- **Try it help line of a scroll page:** "Change a setting, then scroll again or press Play.", the fixed line for the kind; no page has its own. Most settings redraw the stage at once, where it is; the others (a count's speed, how far rows lean) show at the next scroll.
- **The scroller** is the `.stage` itself, or, on Progress Bar and Scrollspy Navigation, an inner element marked `data-hb-scroller`. On those two the indicator and the menu sit beside the scroller, and the `.stage` does the job of today's `.stage-wrap`. Every scroller gets:
  - `tabindex="0" role="region"` and an `aria-label` (each section gives it), as on the scratch scroll page, so keyboard users can focus it and scroll it with the arrow keys;
  - `overflow-y:auto` (was `scroll`), keeping today's hidden scrollbar (`scrollbar-width:none` and the `::-webkit-scrollbar{display:none}` rule);
  - `position:relative`, so the `offsetTop` of anything inside it is measured from its own top. Sticky Section and Zoom Into Image read `offsetTop` without it today, so it is measured from the top of the page and their steps and their zoom start about 100px of scrolling late (measured: 111px and 103px).
  - No focus rule of its own: the shared stylesheet draws the focus ring inset on everything focusable inside the stage (rule B2), which covers the inner scrollers of Progress Bar, Scrollspy Navigation and Smooth (Inertia) Scroll. A stage that is its own scroller keeps the normal ring.
  - The old stage's `flex`, `min-width`, `width`, `height`, `border` and `border-radius` go; the page owns them.
- **Stage height and scroll distance:** the stage takes the shared height (300–440px on computers and tablets, 260–327px on short laptops, 300px on phones; inside its border that is 258px at 1280×590, 325px at 1366×657, 378px at 1280×800, 438px at 768×1024 and 298px on phones). Every fit a section states is measured at the smallest of these, 258px, as well (rule B3). The old `--stage-h` (600px or 620px, and 460px or 480px on phones), its phone overrides and the old stage border go. What was sized in stage heights is sized in the scroller's own height instead: the scroller gets `container-type:size`, and `var(--stage-h)` becomes `100cqh` (for example `calc(var(--stage-h) * 4)` becomes `400cqh`). A pinned part therefore stays exactly one box tall at every stage height, and the scroll distance keeps its proportions. Each section gives the distance in box heights and what Play's six-second pass shows.
- **Every effect follows the scroller's `scroll` event** (or an IntersectionObserver rooted on it), so it answers Play, Back to top, the wheel, touch, keys and dragging alike. No page reads the wheel itself, except Smooth (Inertia) Scroll.
- **`:root`** keeps `--ui-accent:#6ea8ff` and the variables the stage rules still use. `--stage-h`, `--disp` and `--mono` go, and `--ui-muted` becomes `#8a8a92` wherever stage text uses it (the old `#77777e` is 4.4:1 on `#0b0b0d`).
- **Cue lines** in the empty space before or after a demo ("Scroll down ↓") are 13px `#8a8a92` (5.7:1) with `letter-spacing:.1em`, in sentence case, centred, with side padding (`text-align:center;padding:0 24px`; rule B14). Today they are 11px at opacity .25, about 2:1.
- **`hb-dots`** is left off on every page: the dots would stay still while the content scrolls over them, which reads as a parallax effect these demos do not have.
- **Removed on every page:** the aside with its note, its readouts and its Reset scroll, Reset or Replay button (Back to top and Play replace them), the old `header`, `.layout`, the `.ah-bar` and its Copy source script, and the old mobile block. Each section's Stage list names the phone rules its stage still needs, or says there are none (rule B1). No page takes typed text, so none uses `hb-grow`.
- **Stage text shows no code, and holds no `h1` or `h2`** (rule B13). Where a stage shows code or code names today, the section gives plain replacement text; stage headings become `h3` (a real sub-heading) or `p`.
- **Pages without settings** (Horizontal Scroll, Sticky Section) follow the do-it/scroll plan's Task 1: no Try it step, steps numbered 1 (Scroll it) and 2 (Copy the prompt), the `hb-chips` markup kept, a prompt without "Match the settings listed below.", a Copy prompt hint without "Your settings are added at the end.", and a README Key parameters table of the technique's own values.

## How to read a section

- **Sets in the demo** lists one value per choice, in the same order as the choices, then what the page calls so the stage shows it.
- **Shown only when …** in the Control column means the setting's whole `div.hb-setting` gets the `hidden` attribute while it has no effect, so it also drops out of "Your settings".
- Switches in Try it keep their default in the markup (`checked` when the default is on), as on Rotate In.
- **Feel** uses the Entrance & Exit names where they fit: Smooth (slows to a stop), Springy (goes a little past, then settles) and Even (one steady speed). Counter Animation adds Slow finish.
- **Swatches** keep each demo's own colours, named, with the colour's name as each button's `aria-label`: the default is the category blue `#6ea8ff`, which is not in the Text & Typography palette.
- **What scrolling shows** is what the visitor sees as the box scrolls, by hand or by Play.
- **Phone rules** in a Stage list are the rules from today's mobile block that the stage still needs under 600px wide (rule B1); "none" means today's block held only the stage height, the aside and its controls.
- **Measured** sizes come from the site font in headless Chrome, at the stage sizes above, including the smallest (258px inside at 1280×590). Where a block of text is centred in a pinned frame, the section gives the text's own height: a short stage then only eats into the padding around it.

---

## horizontal-scroll — Horizontal Scroll

- **Kind:** scroll. Scrolling down through a tall pinned section slides a strip of panels sideways.
- **Description:** Scroll down and a row of panels slides sideways. Best for portfolios.
- **Step 1:** Scroll it · help line: default
- **Player bar:** Play · Back to top
- **Try it:** none. The demo has no settings today (its aside holds only a Jump to panel list and Reset scroll), so the page has steps 1 and 2.
- **Scroller:** the stage.
- **What scrolling shows:** the cue "Scroll down ↓"; then the section reaches the top of the box and holds still while the strip of five panels slides left in step with the scroll, one box width per panel, and scrolling back slides it back. After the fifth panel the section lets go and the cue "The page moves on ↓" scrolls in.
- **Scroll distance and Play:** a 60cqh lead-in, the pinned section at `calc(100cqh * var(--panels))` (500cqh) with its sticky frame 100cqh tall, and a 60cqh lead-out: 5.2 box heights of scrolling at any stage height (1,560px on a 300px phone). The strip moves during 4 of them, so Play slides it for about 4.6 of its six seconds, about 1.2 seconds a panel.
- **Reduced motion:** nothing scrolls by itself. The strip still follows the visitor's own scrolling exactly; it has no easing to remove. The demo's reduced-motion rule goes: the track never had a transition, and the dots it named are gone.
- **Stage font:** site font. `.panel-num` and `.panel-title` use `font-weight:700` (was `bold`).
- **Stage:**
  - `.stage`: `position:relative;overflow-y:auto;scrollbar-width:none;container-type:size;background:#0b0b0d`, with `aria-label="Panels that slide sideways as you scroll"`.
  - `.spacer`: `height:60cqh` and the cue style; the texts are "Scroll down ↓" and "The page moves on ↓".
  - `#pin-section{height:calc(100cqh * var(--panels));position:relative}` and `#pin-inner{position:sticky;top:0;height:100cqh;overflow:hidden}`. `--panels:5` stays on `:root`.
  - The panels are sized to fit every stage, down to the smallest. `.panel` centres its content, so a short stage only eats into the padding. Measured, the tallest panel's content is 196px at 1366×657 (292px with its padding), 189px at 1280 wide (where the smallest stage is 258px) and 194px on a 320px phone:
    - `.panel{padding:clamp(24px,4vw,48px)}`;
    - `.panel-num{font-size:clamp(48px,6vw,80px)}`, with `aria-hidden="true"` on each number;
    - `.panel-title{font-size:clamp(22px,2.4vw,32px);line-height:1.2}`;
    - `.panel-body{font-size:clamp(14px,1.2vw,16px);line-height:1.6;color:#d6d6da}`. Today it is opacity .6, which is 3.6:1 on the green and teal panels; `#d6d6da` is at least 5.2:1 on every panel.
  - The fifth panel's title colour `#58a6ff` becomes `#a5d6ff`: the old one is 3.0:1 on the light end of its teal gradient, the new one 4.8:1.
  - Each panel's "Panel 01" tag goes (it repeats the big number), and so do the dots under the panels (`#panel-dots`, which showed which panel was in view).
  - The panel copy is rewritten in plain words (today's copy names scrollTop, Math.round and GSAP):

    | Panel | Title | Text |
    |---|---|---|
    | 1 | Scroll down, move sideways | The panels sit side by side in one long strip. As you scroll down, the strip slides left, one panel at a time. |
    | 2 | The box holds still | While the strip slides, the section around it stays pinned in place, so the page seems to pause. |
    | 3 | Your scroll does the work | There is no sideways scrolling to learn. The ordinary scroll you already use moves everything. |
    | 4 | Scroll back, it slides back | The strip follows your scroll exactly, so scrolling up brings the earlier panels back. |
    | 5 | Then the page moves on | Once the last panel is in view, the section lets go and the page scrolls on as normal. |

  - Script: `update()` keeps the translate maths (`budget`, `progress`, `maxShift`); its readout, dot and jump-button lines go. The `scroll` and `resize` listeners stay.
  - Phone rules: none. Today's mobile block also set `.panel{padding:24px}`, which the `clamp()` padding now gives on phones.
  - `hb-dots`: no. Default height.
- **Removed:**
  - The note, and the Overall scroll, Track progress and Panel readouts.
  - The Jump to panel list. It is navigation, not a setting, and scrolling, Play and Back to top cover it.
  - Reset scroll. Back to top replaces it.
  - The panel dots and the "Panel 01" tags on the stage.
- **Good for:** Portfolios · Timelines · Product features · Step-by-step tours · **Avoid on:** Long text · Forms
- **Prompt:**

  > Add a horizontal scroll section to [the panels or projects you want to show]. Place the panels side by side in one long strip inside a section that is several screens tall. As the visitor scrolls down through that section, pin its inner frame in place and slide the strip to the left in step with the scroll, so scrolling down moves the panels sideways; once the last panel is in view, release the frame and let the page scroll on. Give the strip an explicit width so it can move. Keep the visitor's own scrolling, touch included, so scrolling back up slides the panels back. If the visitor has reduced motion turned on, keep the strip tied exactly to their scrolling, with no easing or snapping added.

- **Copy prompt hint:** "Replace the words in brackets with your own panels."
- **README What it is:** rewritten:

  > Horizontal scroll turns ordinary downward scrolling into sideways movement. A row of panels sits in a long strip inside a tall section; while you scroll through that section, it holds still and the strip slides left, one panel after another, and then the page carries on. You never have to scroll sideways yourself.

- **README Key parameters:** the technique's own values (the page has no settings):

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Number of panels | 5 | Each panel is one box wide, and the strip is as wide as all of them together |
  | Pinned section height | Five box heights | The strip slides while the box scrolls through it; a taller section makes each panel pass more slowly |
  | Lead-in and lead-out | Six tenths of a box height each | The space before and after the section, so you see it arrive, hold still and let go |

- **README See also:**
  - [Sticky Section](../sticky-section/) — the section holds still while its content changes instead
  - [Scrub Animation](../scrub-animation/) — scrolling moves a plane along its path, both ways
  - [Scrollytelling](../scrollytelling/) — a picture beside the text changes as a story scrolls by
- **README How it works:**
  - The first snippet becomes:

    ```css
    .stage { container-type: size; }                /* 100cqh is one stage height */
    #pin-section { height: calc(100cqh * var(--panels)); }
    /* 5 panels × a 380px stage = 1900px tall section */
    ```

  - Delete the "Panel jump links" paragraph and its snippet; the page no longer has them.
  - The track-sizing and translation snippets stay.
- **README Production notes:**
  - In the "column flex layout" bullet, "When the side panel stacks below the stage on mobile" becomes "When a side panel stacks below the scroll container on phones".
  - The "Mobile consideration" bullet's first sentence becomes "The pin section is five stage heights tall: 1,500px on a 300px phone stage."
  - The rest is unchanged.
- **Category line:** `01.14 · Scroll-Based`
- **Pager:** Previous: Stagger Reveal (`../stagger-reveal/`) · Next: Sticky Section (`../sticky-section/`)

---

## sticky-section — Sticky Section

- **Kind:** scroll. The section holds still while the scrolling steps its content through four states.
- **Description:** A section holds still while its content changes. Best for feature tours.
- **Step 1:** Scroll it · help line: default
- **Player bar:** Play · Back to top
- **Try it:** none (the rollout spec: this demo has no settings). The page has steps 1 and 2.
- **Scroller:** the stage.
- **What scrolling shows:** the cue "Scroll down ↓"; then a two-column section (text on the left, a picture on the right) reaches the top of the box and holds still, and each quarter of the scrolling through it fades in the next of four steps, the text over 0.5 s and the picture over 0.6 s. Scrolling back steps backwards. After the fourth step the section scrolls away and the cue "The page moves on ↓" follows. Under 600px wide the picture column is hidden and the text takes the whole width, as today.
- **Scroll distance and Play:** a 100cqh lead-in, the 400cqh wrapper with its sticky frame 100cqh tall, and a 100cqh lead-out: 5 box heights of scrolling. The section holds still for 3 of them, so Play spends about 3.6 of its six seconds on the four steps, about 0.9 s each.
- **Reduced motion:** nothing scrolls by itself. The demo's rule stays: the steps switch without fading (`.state,.illus{transition:none!important}`).
- **Stage font:** site font. `.state-head` uses `font-weight:700` (was `bold`).
- **Stage:**
  - `.stage`: `position:relative;overflow-y:auto;scrollbar-width:none;container-type:size;background:#0b0b0d`, with `aria-label="A section that holds still while its content changes"`. `position:relative` also puts the steps back in the right place: today `wrap.offsetTop` is measured from the top of the page.
  - `.spacer`: `height:100cqh` and the cue style; the texts are "Scroll down ↓" and "The page moves on ↓".
  - `#sticky-wrap{height:400cqh}`; `#sticky-inner`, `#text-col` and `#vis-col` each get `height:100cqh`.
  - The text is sized to fit every stage, down to the smallest. Each step centres its text, so a short stage only eats into the padding. Measured, the tallest step's text is 183px at 1366 and 1280 wide (263px with its padding), which fits the 258px smallest stage; 164px on a 375px phone; and 187px on a 320px phone and at 601px wide, where the text column is narrowest. All of these fit:
    - `.state{padding:clamp(24px,4vw,40px)}`;
    - `.state-eye{font-size:12px;font-weight:600}`, keeping its capitals, letter spacing and inline colour, without the opacity .6;
    - `.state-head{font-size:clamp(20px,2.6vw,28px);line-height:1.2}`;
    - `.state-body{font-size:15px;line-height:1.6;color:#adadb2}` (was 12px at opacity .6).
  - The step copy is rewritten in plain words (today's copy speaks of 0–1 values, thresholds and integer indices):

    | Step | Eyebrow | Heading | Text |
    |---|---|---|---|
    | 1 | Step 01 · Hold | The section stays put. | Once it reaches the top of the box, the whole section stops moving while you keep scrolling. |
    | 2 | Step 02 · Change | Scrolling changes what is inside. | Each stretch of scrolling swaps the words and the picture for the next step, instead of moving the page. |
    | 3 | Step 03 · Fade | Each step fades into the next. | The change is a quick fade, so the section reads as one frame stepping forward. |
    | 4 | Step 04 · Release | Then the page moves on. | After the last step, the section scrolls away and the page carries on as normal. |

  - The four pictures stay, each `svg` with `aria-hidden="true"`. The fourth step's "Continue scrolling →" box (`.state-cta`) goes: it looked like a button but did nothing.
  - Script: `update()` keeps `p`, `si` and the two class toggles; its readout lines and the segment-bar loop go.
  - Phone rules, kept from today's mobile block: `@media(max-width:600px){#sticky-inner{grid-template-columns:1fr}#vis-col{display:none}}`. Without them the two columns stay side by side on a phone and the text is cut off.
  - `hb-dots`: no. Default height.
- **Removed:**
  - The note, and the Overall, Lifecycle, State and Internal readouts.
  - The State segments bar, a progress readout.
  - Reset scroll. Back to top replaces it.
  - The "Continue scrolling →" box.
- **Good for:** Feature tours · How-it-works steps · Product pages · **Avoid on:** Long text · Short pages
- **Prompt:**

  > Add a sticky section to [the steps or features you want to walk through]. Make the section several screens tall and pin its inner frame to the top of the screen while the visitor scrolls through it. Split that scroll distance into equal parts, one per step, and as each part is reached, fade the text and the picture over to the next step while the frame itself stays still. After the last step, let the section scroll away so the page carries on. Work out the step from the scroll position, so scrolling back up steps backwards. If the visitor has reduced motion turned on, switch the steps without fading.

- **Copy prompt hint:** "Replace the words in brackets with your own steps."
- **README What it is:** rewritten:

  > A sticky section holds a whole section still while you scroll, and uses that scrolling to step its content through a sequence instead of moving the page. The section sits inside a tall wrapper, and how far you have scrolled through the wrapper decides which step shows, so scrolling back steps backwards. In the demo, a text column and a picture change together through four steps, then the section scrolls away.

- **README Key parameters:** the technique's own values (the page has no settings):

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Number of steps | 4 | Each step owns an equal share of the scrolling while the section holds still |
  | Wrapper height | Four box heights | The section holds still for three of them; a taller wrapper makes each step last longer |
  | Fade between steps | 0.5 s | How long the text takes to fade to the next step; the picture takes 0.6 s |

- **README See also:**
  - [Pin Animation](../pin-animation/) — one element holds still while the rest scrolls past
  - [Scrub Animation](../scrub-animation/) — scrolling moves a plane along its path, both ways
  - [Scrollytelling](../scrollytelling/) — a picture beside the text changes as a story scrolls by
  - [Section Wipe](../section-wipe/) — each section slides up over the one before
- **README How it works:**
  - "Multiplying by the state count gives the active state index and the fraction within it:" becomes "Multiplying by the state count gives the active state index:".
  - In the snippet, `const si = Math.min(Math.floor(p * 4), 3), sf = p * 4 - si;    // state index + fraction` becomes `const si = Math.min(Math.floor(p * 4), 3);                  // state index`, and the segmented progress loop goes (from its `for (let i = 0; i < 4; i++) {` line, with its comment, to its closing brace).
  - Delete the sentence "The three lifecycle phases — `approaching`, `stuck`, `released` — come from comparing `scrollTop` against the pin's start and end."; it described the removed readout.
  - "States themselves crossfade via a CSS `opacity` transition on `.visible`; only the segment bars use the raw fraction, so the section reads as pinned frames advancing rather than a continuous scrub." becomes "States crossfade via a CSS `opacity` transition on `.visible`, so the section reads as pinned frames advancing rather than a continuous scrub."
- **README Production notes:** unchanged
- **Category line:** `01.15 · Scroll-Based`
- **Pager:** Previous: Horizontal Scroll (`../horizontal-scroll/`) · Next: Counter Animation (`../counter-animation/`)

---

## counter-animation — Counter Animation

- **Kind:** scroll. The numbers count up when the box scrolls them into view.
- **Description:** Numbers count up when they scroll into view. Best for stats.
- **Step 1:** Scroll it · help line: default
- **Player bar:** Play · Back to top
- **Scroller:** the stage.
- **What scrolling shows:** the cue "Scroll down ↓", then four tiles (active users, uptime, revenue, experience). When the top of the tiles passes the line that Starts counting sets, the four numbers may count up from zero to 12,847, 98.4%, $2.4M and 8 yrs, formatted the whole way. Each number starts once the one before it has (200 ms later with One after another on) and once half of it is inside the box, so the lower row, still below the box when the tiles pass the line, is seen counting when it scrolls in (started by the line alone, revenue and experience were already 50–100% counted, at most sizes 88–100%, when they were half in view). All four show zero together when a count starts. Scrolling back above the line and down again counts again, and the numbers keep their totals until then. Once the tiles are out of the box altogether (their top less than 8px inside it, when no number shows yet), the numbers go back to zero, so after Back to top, Play at the end or the Home key they scroll in at zero and never show the old totals first. The revenue reads $9,999 and below, then $10K to $999K, then $1.0M to $2.4M, so no string is wider than "12,847".
- **Scroll distance and Play:** a 100cqh lead-in, then `#stats`, which holds the tiles. Measured, the tiles need 292px on phones, 345px at 768×1024 and 402px on laptops; at 768×1024 the 80cqh minimum below (350px) is the taller. The empty spacer after the tiles goes, so the box ends with the tiles in view instead of an empty screen. `#stats` gets `min-height:80cqh`, so the box always scrolls at least 80cqh. Late needs 70cqh, so every Starts counting choice is reached at every size (rule B4). Measured on a prototype at 610×1000, 640×1000, 768×1024, 1280×590, 1366×657, 1280×800, 375×812 and 320×640: all three lines are reached at each. At the default (Middle), Play reaches the line 1.6 s into its pass at 1280×590, 2.0 s at 1366×657, 2.5 s on phones and 3.0 s on tablets. The upper two numbers have finished by 3.9–5.3 s; the lower two start when they come into the box, at about 4.4–5.0 s, so at the defaults the last number finishes 0.4–0.6 s after the box stops at about 6.4 s (measured 0.40–0.58 s at 1280×590, 1366×657, 1280×800, 768×1024, 375×812 and 320×640), and about 1.7 s after it with Late on a tablet (768×1024). The numbers are then at rest in view.
- **Reduced motion:** nothing scrolls by itself. As today, the numbers jump to their totals when the tiles pass the line (the `motionOk` branch stays), all four at the same moment: no cascade, and no waiting for the lower row to come into the box. The CSS rule `.tile-num{transition:none}` goes: the numbers have no transition.
- **Stage font:** site font. `.tile-num` drops `var(--disp)` and keeps weight 700.
- **Stage:**
  - `.stage`: `position:relative;overflow-y:auto;scrollbar-width:none;container-type:size;background:#0b0b0d`, with `aria-label="Numbers that count up as they scroll into view"`.
  - `.spacer`: `height:100cqh` and the cue style, with the text "Scroll down ↓" (was "scroll down to trigger ↓").
  - `#stats` keeps its grid, gap and padding and adds `min-height:80cqh;align-content:start`, so the tiles stay packed at the top of that space.
  - `.tile-label` becomes 12px `#8a8a92` (was 10px at opacity .5). Each `.tile-icon` gets `aria-hidden="true"`.
  - Each `.tile-num` gets `role="img"` and an `aria-label` with its total as shown at the end ("12,847", "98.4%", "$2.4M", "8 yrs"), because its text changes every frame.
  - `.tile` gets `container-type:inline-size`, and `.tile-num` gets `font-size:min(clamp(28px,4.5vw,44px),26cqw)` (was `clamp(28px,4.5vw,44px)`) and `white-space:nowrap`. The site font's tabular figures make every digit, comma, period and % 0.635em wide, so "12,847" is 107px at 28px and did not fit a phone tile narrower than that (its content box is 84px at 320px and 104px at 360px). The number is 27px at 360px, 21.8px at 320px and unchanged from 375px up. Measured over every value each number shows, up to 112% of its total (Springy's overshoot), at 18 sizes from 1280×590 to 320×640, two of them landscape phones: no string is wider than its tile's content box (tightest 0.8px, at 320px).
  - The revenue reads `$9,999` and below, `$10K` to `$999K` (`Math.floor(v / 1e3)`), then `$1.0M` to `$2.4M`, instead of `$999,999` below a million: that string is 5em wide and stuck out of its tile's border by 4–14px on phones up to 390px wide, for about 0.3 s (about 1.2 s with Even and Slow). The final "$2.4M" and the aria-label are unchanged. Numbers are formatted with `toLocaleString('en-US')`, so the commas always match the aria-labels.
  - Script: the counting observer is as before (it reads the last entry). Each number starts once the number before it has begun (plus 200 ms with the cascade on) and once its middle is above the box's bottom edge, checked on every frame; all four are set to zero when a count starts, and speed, feel and cascade are read then. A second observer on `#stats`, with `rootMargin:'0px 0px -8px 0px'`, stops a count in progress and puts the numbers back to zero once the tiles are out of the box. The margin must not be 0, because at scrollTop 0 the tiles touch the box's bottom edge and still count as intersecting. It must stay under the smallest Early line (a tenth of the box: about 25px at 258px): 32px was built first, and it reset the numbers while the counting observer still saw the tiles past its line, so with Early on a box under 320px tall they stayed at zero after the visitor scrolled back up and stopped between the two (found at review, fixed). Reduced motion is read when a count starts.
  - Phone rules: none. Today's mobile block repeated the two-column grid.
  - `hb-dots`: no. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Starts counting | Choice buttons | Early · Middle · Late | Middle | How far the numbers scroll into the box before counting. | `threshold`: 90 / 60 / 30, then `buildObserver()` (its bottom `rootMargin` is −10% / −40% / −70%); a number also waits until half of it is inside the box |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long the numbers take to reach their totals. | `duration`: 2900 / 1800 / 1100 (ms), used from the next count |
| Feel | Choice buttons | Smooth · Slow finish · Springy · Even | Smooth | Springy goes a little past each total, then settles. | `easing`: `'outCubic'` / `'outExpo'` / `'outBack'` / `'linear'`, used from the next count |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| One after another | Switch | on / off | on | Each number starts a moment after the one before. | `staggerTog.checked`: each number starts 200 ms after the one before / all together (each still waits until half of it is inside the box), used from the next count |

- **Known limits (accepted at the Task 9 review, 2026-09-30):**
  - Early and Middle start close together on short boxes: a number cannot start before half of it is inside the box, and the first number is about 70–96px below the tiles' top. Scroll position where the first number and the lower row start, for Early · Middle · Late (measured, Play from the top): 1280×590 121/297 · 121/297 · 182/297 (Early and Middle at the same place); 1366×657 121/297 · 132/297 · 229/297; 1280×800 121/297 · 153/297 · 266/297; 768×1024 101/258 · 177/258 · 308/332; 601×700 88/225 · 148/225 · 258/278; 375×812 86/221 · 121/221 · 209/230. At laptop sizes the lower row starts at the same place whichever choice is picked.
  - The end timing (see Scroll distance and Play): the last number settles in view, after the box has stopped.
  - An End-key jump (or a very fast wheel) at 1280×590 lets the upper two numbers finish counting just above the box: the wait looks at the bottom edge only, so a number already above the box when its turn comes counts unseen (after End they change 102 and 94 times while wholly above it, and end 46px above its top edge). At 1366×657, 1280×800, 768×1024, 375×812 and 812×375 they stay at least partly in view. Play and paced scrolling show every number.
- **Removed:**
  - The note, and the Live values readouts (they repeated the numbers).
  - Replay counters. Scrolling back above the line and down again counts again, and so do Back to top and Play.
  - The Trigger threshold and Duration sliders. They become Starts counting and Speed.
  - The Easing buttons (Linear, Cubic, Expo, Back). They become Feel.
  - Stagger counters becomes One after another.
  - The empty spacer after the numbers (`#stats` gets its minimum height instead).
- **Good for:** Stats · Annual reports · Landing pages · Dashboards · **Avoid on:** Prices · Data tables
- **Prompt:**

  > Add a count-up animation to [the numbers in your stats section]. When the numbers scroll far enough into view, count each one up from zero to its total, and format it on every step so commas, currency signs and units show the whole way through, not just at the end. Count again if the numbers leave the view and come back. When the settings include it, start each number a moment after the one before for a cascade. Screen readers should hear each final number once, never the steps in between. If the visitor has reduced motion turned on, show the final numbers straight away. Match the settings listed below.

- **README What it is:** rewritten:

  > A counter animation counts numbers up from zero to their totals when they scroll into view, so a row of statistics seems to arrive rather than just sit there. Each number keeps its commas, currency sign or unit the whole way up, and usually slows down as it reaches its total, so it settles into place.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Starts counting | Middle | The line the top of the tiles must pass before the numbers may count: early is a tenth of the way up the box, middle 40% of the way up and late 70%. Each number then waits until half of it is inside the box, so on a short box early and middle start at almost the same place |
  | Speed | Normal | How long each count takes: slow is 2.9 s, normal 1.8 s and fast 1.1 s |
  | Feel | Smooth | Smooth slows to a stop; Slow finish races to near the total, then creeps through the last digits; Springy goes a little past and settles back; Even counts at one steady pace, which feels mechanical |
  | One after another | on | Each number starts 200ms after the one before, so the four count in a cascade |

- **README See also:**
  - [Reveal on Scroll](../reveal-on-scroll/) — cards appear as they scroll into view
  - [Stagger Reveal](../stagger-reveal/) — items appear one after another as their group scrolls in
- **README How it works:** the text and snippets stay, with these changes so that it matches the code. The observer snippet reads `entries[entries.length - 1]` instead of `[e]`, and the frame snippet uses `begun` (when a number's own count started) instead of `start` and `delay`. After the paragraph that ends "not suddenly at the final value." come three paragraphs: every count starts from zero, each number starts once the one before it has and half of it is inside the box, speed, curve and cascade are read when a count starts, and reduced motion jumps straight to the totals; the revenue changes format as it grows; and a second observer, shrunk by 8px at the bottom, puts the numbers back to zero when the tiles leave the box (its margin is smaller than any counting line, so a count can start again on the way down). The "Easing functions available:" sentence and its snippet move from Key parameters to the end of How it works, because the Key parameters section may hold no code. The sentence becomes "The four Feel choices use these curves: Even is `linear`, Smooth is `outCubic`, Slow finish is `outExpo` and Springy is `outBack`:".
- **README Production notes:** unchanged
- **Category line:** `01.16 · Scroll-Based`
- **Pager:** Previous: Sticky Section (`../sticky-section/`) · Next: Progress Bar (`../progress-bar/`)

---

## progress-bar — Progress Bar

- **Kind:** scroll. The indicator fills as the article scrolls.
- **Description:** A bar fills as you read down the page. Best for long articles.
- **Step 1:** Scroll it · help line: default
- **Player bar:** Play · Back to top
- **Scroller:** `<div class="scroller" id="scroller" data-hb-scroller tabindex="0" role="region" aria-label="An article with a reading progress indicator">` inside the `.stage`. The `.stage` does the job of today's `.stage-wrap`: it holds the three indicators beside the scroller, so they stay in place while the article moves. The script calls it `scroller` wherever it said `stage`. The page adds no focus rule: the shared stylesheet draws the scroller's focus ring inset, inside the stage (rule B2).
- **What scrolling shows:** the article scrolls, and the chosen indicator (a bar along the top, a ring in the top-right corner with the percentage inside, or a rail down the right edge) fills from empty to full, reaching full exactly at the end of the article.
- **Scroll distance and Play:** the article does not depend on the stage height (measured: 846px on laptops and 1,126px on a 375px phone), so the box scrolls about 1.5 box heights on laptops and nearly 3 on phones. Play fills the indicator from 0 to 100% in six seconds.
- **Reduced motion:** nothing scrolls by itself, and nothing needs simplifying: the indicators have no transition. The demo's rule goes (it named the old scroller and transitions that do not exist).
- **Stage font:** site font. `.art-title` and `.art-h2` use `font-weight:700` (was `bold`); `.circ-text` drops `var(--mono)`.
- **Stage:**
  - `.stage`: `position:relative;overflow:hidden;background:#0b0b0d`.
  - `.scroller`: `height:100%;overflow-y:auto;scrollbar-width:none;position:relative`, with the `::-webkit-scrollbar{display:none}` rule. The old stage's border and height go.
  - `#top-bar`, `#side-rail` and `svg#circ` get `aria-hidden="true"`: they repeat what scrolling shows, and the ring's text changes every frame.
  - The ring grows from 40px to 48px (`width="48" height="48"`; the `viewBox` stays `0 0 36 36`), and `.circ-text` gets `font-size:9px;font-weight:600;fill:#f4f4f2`, about 12px on screen (today 5.6px).
  - The ring's thickness comes from CSS: `.circ-bg,.circ-fg{stroke-width:var(--bar-thick)}` in place of `stroke-width:3`, and the Thickness handler's two `setAttribute('stroke-width', …)` calls go. Today the CSS `stroke-width:3` beats those attributes, so the thickness slider never changed the ring.
  - Article text: `.art-body{font-size:15px;line-height:1.8;color:#adadb2}` (was 13px at opacity .7); `.art-byline{font-size:12px;color:#8a8a92}` (was opacity .4); `.art-pull{color:#d6d6da}` (was opacity .8); `.art-h2` keeps its size without the opacity.
  - The article is rewritten in plain words (today's paragraphs describe scrollTop, requestAnimationFrame and dash arrays). In order:

    | Part | Text |
    |---|---|
    | Title | How a reading progress bar works |
    | Byline | Animation Handbook · Reference (unchanged) |
    | Paragraph | A progress bar tells readers how far through an article they are. It fills as they scroll down, and it is full when the last line comes into view. |
    | Pull quote | “It answers one question: how much is left?” |
    | Paragraph | It compares how far the page has scrolled with how far it can scroll in total, so the bar reaches the end exactly when there is nothing left to read. |
    | Heading | Where to put it |
    | Paragraph | A bar across the top is the most noticeable choice. It sits in plain sight and tells readers this is a long piece. A thin rail down the side does the same job more quietly, which is why many magazines prefer it. |
    | Paragraph | A ring in the corner takes the least room. It fills around its edge like a clock face and can show the percentage in the middle. |
    | Heading | How thick to make it |
    | Paragraph | A hairline bar is almost invisible until you look for it; a thick one is hard to miss. News sites tend to keep it thin, while documentation often makes it bolder, because readers there want to keep track of their place. |
    | Heading | Keeping it smooth |
    | Paragraph | Whatever it looks like, the indicator should move with the scroll and never make the page stutter, especially on phones. |

  - Script: `update()` keeps the three fills and the ring's text; the Read readout line goes, and so does the reading-time line.
  - Phone rules: none. Today's mobile block held only control sizes.
  - `hb-dots`: no. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Indicator | Choice buttons | Top bar · Ring · Side rail | Top bar | The top bar is the loudest; the side rail the quietest. | `setStyle()`: `'top'` / `'circ'` / `'rail'` |
| Thickness | Choice buttons | Thin · Medium · Thick | Medium | Thin is barely there; thick is hard to miss. | `--bar-thick`: 2px / 3px / 6px (the ring's two circles follow it through their CSS `stroke-width`) |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Color | Swatches | Blue · Green · Orange · Purple | Blue | The color of the bar, the ring or the rail. | `--bar-color`: `#6ea8ff` / `#56d364` / `#ffa657` / `#d2a8ff` |

- **Removed:**
  - The note, and the Read and Reading time readouts.
  - Reset scroll. Back to top replaces it.
  - The Indicator style buttons become Indicator, and the Bar thickness slider becomes Thickness.
  - The four colour squares (not buttons, so not reachable by keyboard) become the Color swatches.
- **Good for:** Long articles · Documentation · Tutorials · Reports · **Avoid on:** Short pages
- **Prompt:**

  > Add a reading progress indicator to [your article or long page]. Work out how far the reader has scrolled as a share of the total distance they can scroll, and show it as a bar that fills along the top, a ring that fills in a corner, or a thin rail down the side, so it is full exactly when the last line is in view. Keep the indicator outside the scrolling content so it stays in place, and grow it with a transform rather than by changing its width, so scrolling stays smooth. Hide the indicator from screen readers; it only repeats what scrolling shows. It follows the reader's own scrolling, so reduced motion needs no change. Match the settings listed below.

- **README What it is:** rewritten:

  > A reading progress indicator shows how far through an article the reader is. It fills as they scroll and is full exactly when the last line comes into view. The demo shows three styles of the same idea: a bar along the top, a ring in the corner and a thin rail down the side.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Indicator | Top bar | The top bar is the most noticeable; the ring in the corner takes the least room and shows the percentage; the side rail is the quietest |
  | Thickness | Medium | Thin is 2px, medium 3px and thick 6px; thin is almost invisible until you look for it, thick is hard to miss |
  | Color | Blue | The color of the fill |

- **README See also:**
  - [Scrub Animation](../scrub-animation/) — the same scroll progress moves a plane instead of filling a bar
  - [Sticky Section](../sticky-section/) — scroll progress steps a section through its states
  - [Scrollspy Navigation](../scrollspy-nav/) — a menu shows which section you are reading
- **README How it works:**
  - In the first snippet, `stage` becomes `scroller` (four times: once in the listener line, three times in the `update()` formula).
  - "All three indicators are `position: absolute` children of `.stage-wrap` (the `position: relative` wrapper around the scroll container), not children of the scroll container itself:" becomes "All three indicators are `position: absolute` children of `.stage` (the `position: relative` box around the scroll container), not children of the scroll container itself:".
  - The HTML snippet becomes:

    ```html
    <div class="stage">                      <!-- position: relative; overflow: hidden -->
      <div id="top-bar"></div>               <!-- absolute, top:0, left:0, right:0 -->
      <div id="side-rail">...</div>          <!-- absolute, top:0, right:0, bottom:0 -->
      <svg id="circ">...</svg>               <!-- absolute, top:8px, right:8px -->
      <div class="scroller" id="scroller">   <!-- overflow-y: auto -->
        <div class="article">...</div>
      </div>
    </div>
    ```

  - "`overflow: hidden; border-radius: 8px` on `.stage-wrap` clips all three indicators to the stage boundary." becomes "`overflow: hidden` on the rounded `.stage` clips all three indicators to its corners."
- **README Production notes:**
  - In the first bullet, "The formula must use `stage.scrollTop` and `stage.scrollHeight / stage.clientHeight` from the actual scroll element." becomes "The formula must use `scroller.scrollTop` and `scroller.scrollHeight / scroller.clientHeight` from the actual scroll element."
  - Delete the bullet about apostrophes in JavaScript string literals: it is about writing JavaScript, not about progress bars.
  - The rest is unchanged.
- **Category line:** `01.17 · Scroll-Based`
- **Pager:** Previous: Counter Animation (`../counter-animation/`) · Next: Section Wipe (`../section-wipe/`)

---

## section-wipe — Section Wipe

- **Kind:** scroll. Each full-box section slides up over the one before as the box scrolls.
- **Description:** Each section slides up over the one before. Best for full-screen stories.
- **Step 1:** Scroll it · help line: default
- **Player bar:** Play · Back to top
- **Scroller:** the stage.
- **What scrolling shows:** four sections, each exactly one box tall and each stuck to the top of the box. The next section slides up and covers the one before, which shrinks a little as it is covered (Shrink) and so seems to sink behind it. The fourth section is never covered, and it stays on screen for the last stretch of scrolling.
- **Scroll distance and Play:** four 100cqh sections and an 80cqh end spacer: 3.8 box heights of scrolling. Play spends about 1.6 s on each of the three wipes, then holds the fourth section for about 1.3 s.
- **Reduced motion:** nothing scrolls by itself. As today, the sections still wipe (that is layout) but the covered one does not shrink: the `motionOk` early return in `update()` and the `.sec-content{will-change:auto}` rule stay.
- **Stage font:** site font. `.sec-num` and `.sec-title` use `font-weight:700` (was `bold`).
- **Stage:**
  - `.stage`: `position:relative;overflow-y:auto;scrollbar-width:none;container-type:size;background:#0b0b0d`, with `aria-label="Sections that slide up over each other"`.
  - `.section{position:sticky;top:0;height:100cqh;overflow:hidden}`, keeping the inline `z-index` 1 to 4.
  - `.end-spacer`: `height:80cqh`, empty. It only adds scrolling at the end: the stuck sections cover it (measured at the end of today's scroll), so its "end of stack" text never showed, and the text goes.
  - The section content is sized to fit every stage, down to the smallest. `.sec-content` centres it, so a short stage only eats into the padding. Measured, the tallest content is 211px at 1366×657 (307px with its padding), 202px at 1280 wide (where the smallest stage is 258px) and 208px on a 320px phone:
    - `.sec-content{padding:clamp(24px,4vw,48px)}`;
    - `.sec-num{font-size:clamp(56px,6.4vw,88px)}`, with `aria-hidden="true"` on each number;
    - `.sec-title{font-size:clamp(22px,2.6vw,34px)}`;
    - `.sec-body{font-size:clamp(14px,1.2vw,16px);line-height:1.7;color:#d6d6da}` (was opacity .65; `#d6d6da` is at least 5.2:1 on every section).
  - The section copy is rewritten in plain words (today's copy names z-index, top:0 and GSAP):

    | Section | Title | Text |
    |---|---|---|
    | 1 | Each section stays put | Every section sticks to the top of the box, and the next one slides up over it, like a card landing on a pile. |
    | 2 | The one below sinks back | As a section is covered it shrinks a little, so it seems to slip behind the one arriving. |
    | 3 | It follows your scroll | Stop halfway and the wipe stops halfway. Scroll back up and the section slides away again. |
    | 4 | The last one stays on top | Nothing covers the final section, so it never shrinks. |

  - Script: `update()` keeps the coverage and scale maths; its two readout lines go.
  - Phone rules: none. Today's mobile block held only the stage height and the aside.
  - `hb-dots`: no. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Shrink | Choice buttons | None · A little · A lot | A little | How far the section underneath sinks back. | `scaleFloor`: 1 / 0.96 / 0.88, then `update()` |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Shrink speed | Choice buttons; shown only when Shrink is not None | Quick · Medium · Gradual | Gradual | Quick finishes shrinking early in the wipe. | `wipeRange`: 0.3 / 0.6 / 1, then `update()` |

- **Removed:**
  - The note, and the Scroll and Top section readouts.
  - Reset scroll. Back to top replaces it.
  - The Scale floor and Wipe range sliders. They become Shrink and Shrink speed.
- **Good for:** Full-screen stories · Landing pages · Case studies · **Avoid on:** Long text · Documentation
- **Prompt:**

  > Add a section wipe to [the full-screen sections of your page]. Make each section exactly one screen tall, stick each one to the top as the visitor scrolls, and stack them so every section sits above the one before; the next section then slides up and covers the current one instead of pushing it away. While a section is being covered, shrink its content in step with the scroll so it seems to sink behind the one arriving, unless the settings turn the shrink off. Nothing ever covers the last section. If the visitor has reduced motion turned on, keep the wipe but skip the shrink. Match the settings listed below.

- **README What it is:** rewritten:

  > A section wipe replaces each full-screen section with the next by sliding the new one up over it, instead of scrolling the old one away. Every section sticks to the top of the screen and sits above the one before, so the next one covers it as you scroll. The covered section can shrink slightly, so it seems to sink behind the one arriving.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Shrink | A little | How small the covered section gets: none keeps it full size, a little is 96% and a lot 88%; smaller sinks it deeper |
  | Shrink speed | Gradual | How much of the wipe the shrink takes: gradual spreads it over the whole wipe, medium over the first 60% and quick over the first 30% |

- **README See also:**
  - [Sticky Section](../sticky-section/) — one section holds still while its content changes
  - [Stacking Cards](../stacking-cards/) — cards pile up into a deck as you scroll
  - [Cover Card to Fixed Header](../cover-card-to-fixed-header/) — a big cover shrinks into a slim header as you scroll
  - [Snap Scrolling](../snap-scrolling/) — scrolling stops on one whole section at a time
- **README How it works:** unchanged
- **README Production notes:** unchanged
- **Category line:** `01.18 · Scroll-Based`
- **Pager:** Previous: Progress Bar (`../progress-bar/`) · Next: Zoom Into Image (`../zoom-into-image/`)

---

## zoom-into-image — Zoom Into Image

- **Kind:** scroll. A small window onto a picture opens up to fill the box as the box scrolls.
- **Description:** A small window opens up to fill the box as you scroll. Best for hero images.
- **Step 1:** Scroll it · help line: default
- **Player bar:** Play · Back to top
- **Scroller:** the stage.
- **What scrolling shows:** the cue "Scroll down ↓"; then the picture (a moonlit lake between mountains: a round full moon, two ranges of dark mountains and the lake with the moon's reflection, all in view on every box from a 3.7:1 laptop box to a phone; see the recomposed drawing under Stage) reaches the top of the box and holds still while its window opens outward in step with the scroll, its rounded corners squaring off, until the picture fills the box. A faint outline stays where the window began, and fades out over the last eighth of the opening while the caption "Through the Portal" fades in, so the outline never crosses the caption text. Scrolling back closes the window again. Then the cue "The page moves on ↓" scrolls in.
- **Scroll distance and Play:** a 60cqh lead-in, the 250cqh section with its sticky frame 100cqh tall, and a 60cqh lead-out: 2.7 box heights of scrolling. The window opens during 1.5 of them, about 3.3 of Play's six seconds.
- **Reduced motion:** nothing scrolls by itself. As today, the full picture and its caption show from the start and do not change as the box scrolls (the demo's CSS rule and the `motionOk` early return stay). The starting-frame outline is hidden then (`.frame-border{opacity:0!important}` in the same rule): the caption is on from the start, and on a short box the outline would cross it.
- **Stage font:** site font. The caption title (`.cap-title`, today's `#caption h2`) uses `font-weight:700` (was `bold`).
- **Stage:**
  - `.stage`: `position:relative;overflow-y:auto;scrollbar-width:none;container-type:size;background:#0b0b0d`, with `aria-label="A picture that opens up as you scroll"`. `position:relative` also makes the window start opening as soon as the picture reaches the top: today `zoomSec.offsetTop` is measured from the top of the page.
  - `.spacer`: `height:60cqh` and the cue style; the texts are "Scroll down ↓" and "The page moves on ↓".
  - `#zoom-section{height:250cqh}` and `#zoom-sticky{height:100cqh}`.
  - The picture's `svg` gets `role="img"` and `aria-label="A lake under a full moon, between dark mountains"`.
  - The caption holds no heading (rule B13): `<h2>Through the Portal</h2><p>Scroll to exit</p>` becomes `<p class="cap-title">Through the Portal</p><p class="cap-sub">Keep scrolling</p>`. The `#caption h2` rule becomes `#caption .cap-title` and the `#caption p` rule becomes `#caption .cap-sub`, each with the same values (the small line stays 11px, a caption label).
  - `#zoom-img` keeps `clip-path:inset(30% round 16px)` and the frame keeps `inset:28%`, which match the defaults.
  - **The outline gives way to the caption (Task 11 fix round 1, 2026-09-30).** The reviewer found the outline drawn over the caption text on short boxes (its bottom edge crosses the title at 258px and 325px with Medium, and the title or the small line with Large at 258px to 438px). `#frame` now comes before `#caption` in the DOM, so the caption is drawn over it, and `update()` sets `frameBorder.style.opacity` to 1 minus the caption's opacity, so the outline is gone once the caption is fully in (the switch's own `#frame` opacity and its 0.4s fade are untouched). Moving `#frame` alone was not enough: rendered, the line still ran along the title from behind.
  - **The drawing is recomposed (Task 11 fix round 1, 2026-09-30; the owner's pick, option B).** Under `preserveAspectRatio="xMidYMid slice"` (kept) a wide box shows only the middle band of the 800×600 drawing: viewBox y 192–408 on a 958×258 box (3.7:1), y 164–436 on 958×325 and y 142–458 on 958×378. The old drawing had the moon at y 62–118 and the lake below y 420, so no laptop or desktop box ever showed the moon and at most a strip of lake, while the `aria-label` and the words above describe a lake under a full moon. The recomposition is a coordinate-only edit of the same drawing (same gradients, colours and shapes, and no stretching, so the moon stays round):
    - the sky rect ends at y 345 (was 420); the moon and its glow move to `cy` 218 (was 90), the moon to `r` 24 (was 28) and the glow to `r` 70 (was 80);
    - both mountain polygons stand on y 345 (was 420) with their heights halved: distant peaks at y 245–300 (were 220–330), near ones at y 275–315 (were 280–360);
    - the water rect starts at y 345 (`height` 255); the shimmer lines are at y 365, 385 and 410 (were 440, 460 and 485); the reflection ellipses at `cy` 372 and 395 (were 470 and 500);
    - the stars at (760,130) and (50,180) go, and five stars at (90,205), (250,226), (380,199), (470,232) and (740,236) fill the band; the other six stay.
    - The moon (y 194–242) and the mountains (y 245–345) lie wholly inside y 192–408, and so does the top of the lake (y 345–408), so the widest box (3.7:1) keeps all three. The starting window still shows mountains at every setting.
    - Measured in headless Chrome, fully open, box sizes inside the border, distances from the top edge of the box: 958×258 (1280×590): moon 57px across and round, 2px down; distant peaks 63px, near peaks 99px; lake 75px tall. 958×325 (1366×657): moon 35px down, lake 109px. 958×378 (1280×800): moon 62px down, lake 135px. 705×438 (768×1024): moon 42px across, lake 180px. 745×258 (a phone held sideways, 812×375): moon 45px across, lake 87px. 341×298 and 286×298 (phones): moon 24px across, lake 127px. The moon is a 1:1 circle at every size, both reflection ellipses are inside the box, and the caption never covers the moon. Under the starting window (Small / Medium / Large) the mountains fill 82–100% / 31–81% / 15–56% of what shows, at every size.
  - Script: `update()` keeps the inset, radius and caption maths; the readout line goes, and the clip no longer checks the removed portal switch. It also sets the outline's fade, as above.
  - Phone rules: none. Today's mobile block held only the stage height and the aside.
  - `hb-dots`: no. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Starting window | Choice buttons | Small · Medium · Large | Medium | How much of the picture shows before you scroll. | `startPct`: 40 / 30 / 20 (the inset on each side, so the window is 20% / 40% / 60% of the box wide), and the frame's inset `(startPct − 2)%`: 38% / 28% / 18%; then `update()` |
| Corners | Choice buttons | Square · Rounded · Very rounded | Rounded | The window's corners straighten as it opens. | `brStart` and `--br-start` (which rounds the frame's corners): 0 / 16 / 32; then `update()` |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Shows the starting frame | Switch | on / off | on | A faint outline marks where the window began. | `frameEl.style.opacity`: `'1'` / `'0'` (the outline inside it also fades out with the caption, as under Stage) |

- **Removed:**
  - The note, and the Section readout.
  - Reset scroll. Back to top replaces it.
  - The Start size and Border radius start sliders. They become Starting window and Corners.
  - Portal clip-path mode. Turning it off only removed the rounded corners, which Corners: Square now does.
  - Show frame becomes Shows the starting frame.
- **Good for:** Hero images · Gallery intros · Section breaks · **Avoid on:** Small images · Text-heavy pages
- **Prompt:**

  > Add a zoom-into-image effect to [your featured picture]. Pin the picture in place while the visitor scrolls through a section a couple of screens tall, and show only a small window of it at first. As they scroll, open that window outward in step with the scroll until the picture fills the whole frame, then fade in a caption. Uncover the picture by clipping it rather than scaling it up, so it stays sharp, and let scrolling back up close the window again. If the visitor has reduced motion turned on, show the full picture and the caption from the start. Match the settings listed below.

- **README What it is:** rewritten:

  > Zoom into image starts with a small window onto a picture and opens it up to fill the screen as you scroll, as if you were flying into the picture. The picture itself never grows: more of it is simply uncovered, so it stays sharp. The window's rounded corners square off as it opens, and a caption fades in at the end.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Starting window | Medium | How much of the picture shows at first: small is a window a fifth of the box wide, medium two fifths and large three fifths |
  | Corners | Rounded | How round the window's corners are at the start: square, 16px or 32px; they straighten as the window opens |
  | Shows the starting frame | on | A faint outline stays where the window began, so you can see how far it has opened; it fades out as the caption fades in |

- **README See also:** the last link's text changes from "Parallax Depth of Field" to the page's real title.
  - [Sticky Section](../sticky-section/) — the pinning this effect is built on
  - [Scrub Animation](../scrub-animation/) — scroll position drives the movement, both ways
  - [Cover Card to Fixed Header](../cover-card-to-fixed-header/) — a big cover changes shape as you scroll
  - [Parallax Depth-of-Field](../parallax-depth-of-field/) — layers move and blur for depth as you scroll
- **README How it works:** in the snippet, the three lines from `zoomImg.style.clipPath = portalTog.checked` to its `: ` alternative become one line: ``zoomImg.style.clipPath = `inset(${inset.toFixed(2)}% round ${radius.toFixed(1)}px)`;``. Fix round 1: the caption line becomes three lines that also fade the outline, `const cap = p > 0.88 ? ((p - 0.88) / 0.12).toFixed(3) : '0';`, `caption.style.opacity = cap;` and `frameBorder.style.opacity = (1 - cap).toFixed(3);` (with a short comment), and the sentence after the snippet adds ", and the faint starting-frame outline fades out over the same stretch, so it never crosses the caption". The rest is unchanged. No README line describes the drawing itself.
- **README Production notes:** unchanged, except that the Reduced motion bullet now reads "shows the caption immediately and hides the starting-frame outline" (fix round 1).
- **Category line:** `01.19 · Scroll-Based`
- **Pager:** Previous: Section Wipe (`../section-wipe/`) · Next: Scroll Image Sequence (`../scroll-image-sequence/`)

---

## scroll-image-sequence — Scroll Image Sequence

- **Kind:** scroll. Rebuilt, as the rollout spec asks, to scroll inside its stage: today the whole window scrolls through a 340vh track.
- **Description:** Scrolling plays a series of pictures like a flip-book. Best for products.
- **Step 1:** Scroll it · help line: default
- **Player bar:** Play · Back to top
- **Scroller:** the stage.
- **What scrolling shows:** a wireframe cube with a smaller shape inside it, drawn on a canvas that holds still while the box scrolls. Each scroll position shows one frame of a sequence: scrolling down turns the cube one and a half times while it opens out and closes again, and scrolling up plays it backwards. With few frames the steps between pictures are easy to see.
- **Scroll distance and Play:** the track is 340cqh with its sticky frame 100cqh tall: 2.4 box heights of scrolling, the same proportion as today's 340vh track in a 100vh window. Play plays the whole sequence (120 frames at the default) in six seconds. Back to top, and Play restarting from the top, are instant jumps (rule B8): with Glides between frames on, the picture then eases from the frame it showed back to the first one, as it does after any fast scroll; with it off, the picture jumps too.
- **Reduced motion:** nothing scrolls by itself. As today, the picture jumps straight to the frame for each position, with no easing (`smoothing` is false under reduced motion).
- **Stage font:** no text stays on the stage.
- **Stage (rebuilt):**
  - Markup: `<div class="stage" id="stage" tabindex="0" role="region" aria-label="A picture sequence that plays as you scroll"><div class="track" id="track"><div class="pin"><canvas id="c" role="img" aria-label="A wireframe cube with a smaller shape inside, turning and opening out as you scroll"></canvas></div></div></div>`.
  - `.stage`: `position:relative;overflow-y:auto;scrollbar-width:none;container-type:size;background:#04060c`, with the `::-webkit-scrollbar{display:none}` rule.
  - `.track{height:340cqh}`; `.pin{position:sticky;top:0;height:100cqh}`; `canvas{display:block;width:100%;height:100%}`.
  - The frame counter and its "PROCEDURAL FRAME" label (`.hud`), the progress bar along the bottom (`.bar`) and the "Scroll to scrub ⇅" hint go, as readouts and a caption. The `.pin` padding and the settings panel inside it go.
  - `:root` becomes `--ui-accent:#6ea8ff` (the old `--accent`, `--stage`, `--text`, `--muted` and `--mono` go with the parts that used them).
  - Script:
    - `updateTarget()` measures the track in the stage: `const span=track.offsetHeight-stage.clientHeight; const p=span>0?Math.min(Math.max((stage.scrollTop-track.offsetTop)/span,0),1):0;` then `targetFrame=p*(TOTAL-1)` as today.
    - It listens to the stage's `scroll` event (`stage.addEventListener('scroll',updateTarget,{passive:true})`) instead of the window's. The window's `resize` listener stays (`resize(); updateTarget();`).
    - `resize()`, `drawFrame()` and the `loop()` are unchanged, except that `loop()` no longer writes the frame counter.
  - Phone rules: none. Today's mobile block held only the settings panel.
  - `hb-dots`: no. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Number of frames | Choice buttons | Few · Normal · Many | Normal | Fewer frames step visibly; more frames look smooth. | `TOTAL`: 24 / 120 / 240, then `updateTarget()` |
| Glides between frames | Switch | on / off | on | Off, the picture jumps straight to each frame. | `smoothEl.checked`: each frame, `shownFrame` moves 0.18 of the way to `targetFrame` / equals it |

**More options**

None: leave out the `details.hb-options` block.

- **Removed:**
  - The frame counter, the progress bar and the hint on the stage.
  - The note.
  - The Total frames slider. It becomes Number of frames.
  - "Smoothing (lerp between frames)" becomes Glides between frames.
  - The whole-window scrolling: the tall track now scrolls inside the stage.
- **Good for:** Product reveals · 3D objects · Launch pages · **Avoid on:** Slow connections · Text content
- **Prompt:**

  > Add a scroll-driven image sequence to [your product or object animation]. Export the animation as a numbered series of pictures and load them all before the section comes into view. Pin a canvas in place while the visitor scrolls through a section a few screens tall, turn their scroll position into a frame number, and draw that frame whenever it changes, so scrolling plays the sequence like a flip-book and scrolling back plays it in reverse. When the settings include it, let the picture ease toward the frame the scroll points at instead of jumping. Give the canvas a text description for screen readers. If the visitor has reduced motion turned on, jump straight to each frame. Match the settings listed below.

- **README What it is:** rewritten:

  > A scroll image sequence plays a series of still pictures as you scroll, like flipping through a flip-book: each scroll position shows one picture, so scrolling down plays the animation and scrolling up plays it backwards. Product pages use it to turn a pre-rendered animation, such as a phone turning around, into something the reader controls. The demo draws its pictures as it goes, a turning wireframe cube, so it needs no image files.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Number of frames | Normal | How many pictures the sequence has: few is 24, normal 120 and many 240; more frames scrub more smoothly but are more images to load in production |
  | Glides between frames | on | The picture eases toward the frame the scroll points at instead of jumping to it |

- **README See also:**
  - [Scrub Animation](../scrub-animation/) — scroll position moves a plane along its path
  - [Pin Animation](../pin-animation/) — the pinning this effect relies on
  - [Sticky Section](../sticky-section/) — a whole section holds still while its content changes
  - [Zoom Into Image](../zoom-into-image/) — a picture opens up as you scroll
- **README How it works:**
  - The first snippet becomes:

    ```js
    function updateTarget(){
      const span = track.offsetHeight - stage.clientHeight;      // the stage is the scroll box
      const p = span > 0 ? Math.min(Math.max((stage.scrollTop - track.offsetTop) / span, 0), 1) : 0;
      targetFrame = p * (TOTAL - 1);
    }
    stage.addEventListener('scroll', updateTarget, {passive:true}); // fires for wheel AND touch
    ```

  - "(the smoothing toggle)" becomes "(the Glides between frames setting)".
  - The rest is unchanged.
- **README Production notes:** unchanged
- **Category line:** `01.20 · Scroll-Based`
- **Pager:** Previous: Zoom Into Image (`../zoom-into-image/`) · Next: Smooth (Inertia) Scroll (`../smooth-scroll/`)

---

## smooth-scroll — Smooth (Inertia) Scroll

- **Kind:** do (owner decision 8). The effect is in how the visitor's own wheel, swipe, drag or keys move the content. In the glide mode the page moves the content with a transform and the box itself never scrolls, so Play would have nothing to drive, and a steady automatic scroll would not show the glide anyway. Show me plays one flick instead. Body: `<body class="hb" data-hb-kind="do" data-hb-autoplay>`.
- **Description:** Scrolling glides to a stop instead of jumping. Best for portfolio sites.
- **Step 1:** Scroll it · help line: "Scroll or drag inside the box, or press Show me."
- **Player bar:** Show me · Reset, exactly as in the do-it/scroll plan.
- **Try it help line:** "Change a setting, then try it again or press Show me.", the fixed line for do-it pages.
- **Show me** (`id="btn-demo"`): one flick and back, about three seconds at the default glide.
  - `showMe()` clears `showTimer`, calls `measure()`, and remembers where the content is: `from` is `target` in the glide mode, or `viewport.scrollTop` with Normal scrolling on.
  - It sends the content one and a half box heights down, or up when `from` is past the middle of `maxScroll`, clamped to 0 and `maxScroll`. In the glide mode it sets `target`, so the cards speed off and slow to a stop; with Normal scrolling on it sets `viewport.scrollTop`, so they jump.
  - `showTimer=setTimeout(…,1600)` then sends the content back to `from` the same way, and sets `showTimer=0`. At Medium the whole run takes about 3 s (the cards settle about 1.5 s after the return starts); at Long about 4.3 s, the last part a settle too small to see.
- **Reset** (`id="btn-reset"`): clears `showTimer`, sets `target` and `current` to 0, puts the content at the top at once (`translate3d(0,0,0)` in the glide mode, `viewport.scrollTop=0` with Normal scrolling on) and moves the rail fill to the top (`paint(0)`).
- **Visitor input:** a listener on `document` for `hb:input`, at the top level of the script, clears `showTimer` (and sets it to 0), so the flick's return never runs; the visitor's wheel, drag, touch or key then moves the content from wherever it is. It only clears that timer, so it is safe to receive again and again (owner decision 8). Changing Normal scrolling clears `showTimer` too.
- **Keys in the glide mode** (owner decision 9): `enableSmooth()` adds a `keydown` listener on the viewport, and `disableSmooth()` removes it, like the other listeners. For the keys it handles, it moves `target` (clamped to 0 and `maxScroll`) and calls `preventDefault()`, so the page itself does not scroll. It leaves the key alone while Ctrl, Alt or Cmd is held.
  - ArrowDown and ArrowUp: 40px down or up.
  - PageDown and PageUp: 90% of `viewport.clientHeight` down or up.
  - Space: the same as PageDown, and Shift+Space as PageUp.
  - Home and End: to 0 and to `maxScroll`.

  The viewport takes focus from Tab (`tabindex="0"`) and from a click in it. With Normal scrolling on, the browser scrolls the focused viewport with the same keys by itself.
- **On arrival:** the shared script presses Show me once, 400ms after load (not under reduced motion).
- **Reduced motion:** nothing runs by itself. As today, the page starts with Normal scrolling on and the switch cannot be turned off (it is `checked` and `disabled`, and its row gets the page's own rule `label.hb-switch-row:has(input:disabled){opacity:.45;cursor:not-allowed}`). Show me and Reset still work; Show me then jumps, as normal scrolling does.
- **Stage font:** site font. `.card-title` drops `var(--disp)` and keeps 700; `.card-num` uses `font-weight:700` (was `bold`).
- **Stage:** restructured so the rail and the hint stay in place with Normal scrolling on as well (today they scroll away with the content in that mode):
  - `.stage`: `position:relative;overflow:hidden;background:#111114`. It holds `<div class="viewport" id="viewport" tabindex="0" role="region" aria-label="Cards that glide as you scroll">` with `.content` inside, and, beside the viewport, `.rail` and `.hint`. The `.stage-wrap` goes.
  - `.viewport{height:100%;overflow:hidden;touch-action:none;cursor:grab;container-type:size}`; `.viewport.native{overflow-y:auto;touch-action:auto;cursor:auto;scrollbar-width:none}` with its `::-webkit-scrollbar{display:none}` rule; `.viewport.dragging{cursor:grabbing}`. The viewport has no padding (the cards carry their own), as `container-type:size` requires (rule B5).
  - The page adds no focus rule: the shared stylesheet draws the viewport's focus ring inset, inside the stage (rule B2).
  - The script uses `viewport` wherever it used `stage`: the wheel, pointer and scroll listeners, `setPointerCapture`, the `native` and `dragging` classes, `scrollTop` and `clientHeight`.
  - `.card{min-height:72cqh}` (was `calc(var(--stage-h) * 0.72)`).
  - `.card-num` gets `aria-hidden="true"`; `.card-body{font-size:14px;color:#adadb2}` (was `clamp(12px,1.4vw,14px)` at opacity .6; rule B9); `.hint{font-size:12px;color:#8a8a92}` (was 10px at opacity .35), reading "Drag or scroll ↑↓" in the glide mode and "Normal scrolling" with Normal scrolling on.
  - `measure()` also runs after `document.fonts.ready`, because the cards' height depends on the font.
  - The card copy is rewritten in plain words (today's copy names translate3d, lerp and scrollTop):

    | Card | Title | Text |
    |---|---|---|
    | 1 | It catches your scroll | Instead of letting the browser jump, the box catches each turn of the wheel or swipe and turns it into a place to go. |
    | 2 | Where to go, where it is | It keeps two positions: where you asked to go, and where the content is now. The gap between them is the glide. |
    | 3 | A little closer each frame | Many times a second, the content moves part of the way toward where you asked to go, so it speeds off and then eases in. |
    | 4 | It slides the content | The content moves as one piece instead of being scrolled, which keeps the movement smooth. |
    | 5 | Momentum comes free | Flick and let go: the content keeps gliding after your hand stops, then settles. |
    | 6 | Mind the trade-offs | Taking over scrolling can break keyboard scrolling, links to headings and find-in-page. Use it with care, and turn it off for visitors who ask for less motion. |

  - Phone rules: none. Today's mobile block held only the stage height and the aside.
  - `hb-dots`: no. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Glide | Choice buttons | Long · Medium · Short | Medium | How long the content keeps moving after you stop. | `ease`: 0.05 / 0.09 / 0.16 (the share of the remaining distance covered each frame) |
| Normal scrolling | Switch; its `div.hb-setting` has `data-hb-skip` (owner decision 10), so it stays out of "Your settings" and the copied prompt | on / off | off | Turn it on to compare with the browser's own scroll. | `nativeChk.checked`: `enableNative()` / `enableSmooth()`; either way `showTimer` is cleared |

**More options**

None: leave out the `details.hb-options` block.

- **Removed:**
  - The note (it showed code).
  - The Target, Current, Progress and Mode readouts.
  - The Ease / lerp factor slider and its "lower = heavier glide" line. It becomes Glide.
  - "Compare: native scroll" becomes Normal scrolling.
- **Good for:** Portfolio sites · Brand pages · Scroll stories · **Avoid on:** Documentation · Forms · Dashboards
- **Prompt:**

  > Add smooth scrolling to [the scrolling area or page you want to glide]. Catch the visitor's wheel, swipe and drag and turn each one into a target position, then on every frame move the content part of the remaining distance toward that target, so it glides and slows to a stop instead of jumping. Move the content with a transform and keep a custom scrollbar in step with it. Keep keyboard scrolling, links to headings and find-in-page working. If the visitor has reduced motion turned on, use the browser's normal scrolling with no glide. Match the settings listed below.

- **README What it is:** rewritten:

  > Smooth scroll makes scrolling glide. Instead of moving the content exactly as far as each turn of the wheel or swipe, it treats each one as a place to go and moves the content a little closer on every frame, so it speeds off, then slows to a stop. The result feels weighted, with momentum, rather than like the browser's instant scroll.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Glide | Medium | How much of the remaining distance the content covers each frame: long is 5%, medium 9% and short 16%; long feels heavy and floaty, short is closer to normal scrolling |
  | Normal scrolling | off | Turns the glide off so the box scrolls the browser's own way, to compare the two |

- **README See also:**
  - [Parallax Scrolling](../parallax-scrolling/) — layers move at different speeds; pairs well with a glide
  - [Scrub Animation](../scrub-animation/) — scroll-driven movement, which a glide makes smoother
  - [Horizontal Scroll](../horizontal-scroll/) — scrolling down moves a row of panels sideways
- **README How it works:**
  - In the first snippet, `stage.addEventListener('wheel'` becomes `viewport.addEventListener('wheel'`.
  - "The demo keeps all of this inside a scoped stage element with `overflow: hidden`" becomes "The demo keeps all of this inside a scoped box with `overflow: hidden`".
  - After the paragraph on touch drag, add: "The keyboard moves the same target: in the glide mode a `keydown` handler on the box moves it 40px for an arrow key, 90% of the box for Page Up, Page Down and Space, and to the top or the bottom for Home and End."
  - The paragraph "A fixed lerp factor is frame-rate dependent … `1 - Math.pow(1 - ease, dt * 60)`." moves from Key parameters to the end of How it works, because the Key parameters section may hold no code.
- **README Production notes:** unchanged
- **Category line:** `01.21 · Scroll-Based`
- **Pager:** Previous: Scroll Image Sequence (`../scroll-image-sequence/`) · Next: Text Fill on Scroll (`../text-fill-on-scroll/`)

---

## text-fill-on-scroll — Text Fill on Scroll

- **Kind:** scroll. A pinned paragraph lights up word by word as the box scrolls.
- **Description:** Words light up one by one as you scroll. Best for key statements.
- **Step 1:** Scroll it · help line: default
- **Player bar:** Play · Back to top
- **Scroller:** the stage.
- **What scrolling shows:** a paragraph that holds still in the middle of the box; its words turn from grey to white one by one in step with the scroll, with the next word to fill in the highlight color, and scrolling back up un-lights them.
- **Scroll distance and Play:** the 350cqh track with its sticky frame 100cqh tall: 2.5 box heights of scrolling. At the default the last word lights at 90% of the scroll, so Play fills the paragraph in about 5.4 s and holds it lit for the rest.
- **Reduced motion:** nothing scrolls by itself. The demo's rule stays: each word changes color at once, without its 180ms fade (`.fill-text .w{transition:none}`).
- **Stage font:** site font. `.fill-text` drops `var(--disp)` and keeps weight 700.
- **Stage:**
  - `.stage`: `position:relative;overflow-y:auto;scrollbar-width:none;container-type:size;background:#0b0b0d`, with `aria-label="A paragraph that fills word by word as you scroll"`.
  - `.track{height:350cqh}`; `.pinned{height:100cqh}`.
  - The paragraph is shortened from 80 words to 48, and its size becomes `font-size:clamp(17px,2.4vw,24px)`: today's paragraph needs 393px on phones and 538px on laptops, more than the stage. `.pinned` centres the paragraph, so a short stage only eats into the padding. Measured with the new text, the paragraph is 216px high at 1366 and 1280 wide (304px with its padding), which fits the 258px smallest stage. It is 179px on a 375px phone and 230px on a 320px phone, both inside the 298px phone stage. The new text:

    > Scroll is not a play button. It is a position. Every word here watches how far you have read. Words behind that point light up; words ahead wait in the dark. Stop anywhere and the sentence holds still. Scroll back up and it un-reads itself, word by word.

  - The unread color `--dim` becomes `#7c7c84` (was `rgba(244,244,242,.16)`, 1.5:1, so the unread words could hardly be seen): 4.8:1 on the stage, and lit words stay 3.8 times brighter. `.w.on{color:#f4f4f2}`.
  - The words stay real text in their spans (one span per word, so screen readers read them normally; the letters rule does not apply).
  - The "scroll to read" hint goes; the help line says it.
  - Script: `render()` keeps its guarded writes; its two readout lines go.
  - Phone rules: none. Today's mobile block held only the stage height and the aside.
  - `hb-dots`: no. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Highlights the current word | Switch | on / off | on | The next word to fill shows in color, like a cursor. | `cursorTog.checked`, then `render()` |
| Fill finishes | Choice buttons | Early · Normal · At the end | Normal | Early leaves the whole text lit for a while. | `completeAt`: 0.7 / 0.9 / 1, then `render()` |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Highlight color | Swatches; shown only when Highlights the current word is on | Blue · Green · Orange | Blue | The color of the word being filled. | `--fill-accent` on the text: `#6ea8ff` / `#5fd88a` / `#ff9d5c` |

- **Removed:**
  - The note, and the Scroll and Words filled readouts.
  - The "scroll to read" hint on the stage.
  - The Fill completes at slider. It becomes Fill finishes.
  - "Highlight active word" becomes Highlights the current word, and the Highlight swatches become Highlight color.
- **Good for:** Key statements · Manifestos · Landing page intros · **Avoid on:** Body text · Long articles
- **Prompt:**

  > Add a scroll-driven text fill to [the statement or paragraph you want read]. Pin the paragraph in place while the visitor scrolls through a section a few screens tall. Split it into words, show every word in a dim but readable grey, and light the words up one by one in step with the scroll, so how far the reader has scrolled decides how much is lit and scrolling back up un-lights them. When the settings include it, show the next word to fill in a highlight color, like a reading cursor. Keep it real text for screen readers. If the visitor has reduced motion turned on, change each word's color without fading. Match the settings listed below.

- **README What it is:** rewritten:

  > Text fill on scroll lights a paragraph up word by word as you scroll, as if it were being read at your pace. The paragraph holds still while you scroll through its section, and how far you have scrolled decides how many words are lit, so stopping holds the sentence mid-read and scrolling back un-reads it.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Highlights the current word | on | The next word to fill shows in the highlight color, like a reading cursor |
  | Fill finishes | Normal | How far through the scrolling the last word lights: early at 70%, normal at 90% and at the end at 100%; finishing early leaves a moment to read the whole text |
  | Highlight color | Blue | The color of the word being filled |

- **README See also:**
  - [Reveal on Scroll](../reveal-on-scroll/) — whole cards appear as they scroll into view; this is the continuous version for one paragraph
  - [Scrub Animation](../scrub-animation/) — scroll position drives a drawing, both ways
  - [Kinetic Typography](../../05-text-typography/kinetic-typography/) — words that each move in their own way, on a timer instead of the scroll
- **README How it works:** "one or two class toggles instead of eighty" becomes "one or two class toggles instead of fifty". The rest is unchanged.
- **README Production notes:** unchanged
- **Category line:** `01.22 · Scroll-Based`
- **Pager:** Previous: Smooth (Inertia) Scroll (`../smooth-scroll/`) · Next: Scroll Velocity Skew (`../scroll-velocity-skew/`)

---

## scroll-velocity-skew — Scroll Velocity Skew

- **Kind:** scroll. Rows lean by how fast the box scrolls and straighten when it stops.
- **Description:** Rows lean when you scroll fast and straighten when you stop. Best for galleries.
- **Step 1:** Scroll it · help line: "Scroll fast inside the box and stop, or press Play and it scrolls for you."
- **Player bar:** Play · Back to top
- **Scroller:** the stage.
- **What scrolling shows:** a list of media rows (a coloured thumbnail, a title and two grey text lines). While the box scrolls, every row leans in proportion to the scroll speed; when it stops, the lean springs back to straight.
- **Scroll distance and Play:** the list grows from 14 rows to 28 (the fourteen names twice, numbered 01 to 28, colours continuing as today): about 2,550px on phones and 4,170px on laptops. Play moves at one steady speed, which for 28 rows is about 375px a second on a phone and 630px a second on a laptop, so at the defaults the rows hold a steady lean of about 2° and 3.7° while it runs, then straighten when it stops. Speed is measured per 1/60 s, so a 120Hz screen leans the same (rule B8). With today's 14 rows the lean during Play would be under 1° on phones, too little to see. A quick flick of the wheel or a swipe leans them further.
- **Reduced motion:** nothing scrolls by itself. As today, the rows stay straight however fast the box scrolls (`reduce` holds the skew at 0); the demo's `rmq` change listener stays, without the note text it used to write.
- **Stage font:** site font. `.m-title` drops `var(--disp)` and keeps 700.
- **Stage:**
  - `.stage`: `position:relative;overflow-y:auto;scrollbar-width:none;background:#111114`, with `aria-label="Rows that lean as you scroll"`.
  - The rows are built by the script as today, with `for(let i=0;i<28;i++)`, the title `String(i+1).padStart(2,'0')+' — '+NAMES[i%14]`, and the hue `(210+i*22)%360`.
  - The "scroll to shear" line on every row (`.m-tag`) goes.
  - Script: `tick()` and `applySkew()` stay; the readout lines, `measure()` and `maxScroll` go (they only fed the Position readout). Two changes follow rule B8:
    - **Speed per 1/60 s.** `tick(now)` works out `dt`, the time since the previous frame, at least 1ms and with no upper limit: `dt=lastTime?Math.max(now-lastTime,1):FRAME`, with `FRAME=1000/60`. It uses `raw=(top-lastTop)*FRAME/dt`, and the smoothing step uses the same time: `vel+=(raw-vel)*(1-Math.pow(1-SMOOTH,dt/FRAME))`. So a 120Hz screen leans and springs back as a 60Hz one does. Where the `scroll` listener starts the loop, it also sets `lastTime=0`, so the first frame of a run counts as 1/60 s. A frame's timestamp can be earlier than the moment the loop started, so a measured first `dt` would inflate the speed. A stalled frame counts for its real length, so the step it saw is divided by the time it took and the speed stays the speed the box was moving at (a cap at 50ms, the first version, read a 200ms stall as four times the speed).
    - **Instant jumps are ignored.** Back to top, and Play restarting from the top, move the box in one frame, which today leans the rows to the full limit for a moment. The shared script moves the box while it handles the click, before the click reaches the document, so a `click` listener on the document (for `#btn-top` and `#btn-scroll`, matched by id) sets `lastTop=seenTop=stage.scrollTop`: the jump adds no speed, and no flag is left behind that could swallow a later move. Built as the review of Task 13 accepted it, replacing the `jumped` flag that `tick()` would read. A `resize` listener does the same, because a resize can move the box too (1280×800 to 768×1024 while resting at the end leaned the rows to -12° for a second).
    - **A run starts from where the box was before its first move.** `seenTop` is where the last `scroll` event left the box. When the listener starts a run it sets `lastTop=seenTop` (the original set it to the position after the move), so a single instant notch of the wheel counts as speed (5.04° at Normal; 0° with the original start, in a browser with smooth scrolling off).
    - `.content` gets `overflow:clip`: a leaning row draws outside its box, which made the scrollable area up to 131px taller while the rows leaned and shorter again afterwards. Clipping at the padding box changes no picture (the clip edges are the edges of the scrolling content) and keeps the range constant.
  - Phone rules: none. Today's mobile block held only the stage size and the aside.
  - `hb-dots`: no. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Strength | Choice buttons | Subtle · Normal · Strong | Normal | How far the rows lean for the same scroll speed. | `INTENSITY`: 0.2 / 0.35 / 0.6 (degrees for each pixel scrolled per 1/60 s) |
| Lean | Choice buttons | Tilt · Slant | Tilt | Tilt tips each row; Slant leans it like italics. | `setAxis()`: `'skewY'` / `'skewX'` |
| Spring back | Choice buttons | Slow · Normal · Quick | Normal | How quickly the rows react and straighten again. | `SMOOTH`: 0.07 / 0.12 / 0.2 |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Most it leans | Choice buttons | Small · Medium · Large | Medium | A limit, so a hard flick cannot fold the rows over. | `MAX`: 6 / 12 / 20 (degrees) |

- **Removed:**
  - The note, with the reduced-motion text it showed.
  - The Velocity, Skew, Direction and Position readouts.
  - The Intensity, Max skew and Smoothing sliders. They become Strength, Most it leans and Spring back.
  - The skewY and skewX buttons. They become Lean.
  - The "scroll to shear" line on the rows.
- **Good for:** Galleries · Portfolios · Project lists · **Avoid on:** Reading content · Forms
- **Prompt:**

  > Add a velocity skew to [the rows or cards in your list or gallery]. Measure how far the list scrolls on each frame, smooth that speed so it rises and falls gradually, and lean every row by an angle in proportion to it, up to a limit. Fast scrolling leans the rows; when the scrolling stops, the speed falls to zero and they spring back straight. Lean each row on its own rather than the whole list, and stop the frame loop once everything is still. This effect can make some people feel unwell, so if the visitor has reduced motion turned on, keep the rows straight and scroll normally. Match the settings listed below.

- **README What it is:** rewritten:

  > Scroll velocity skew leans content by how fast you scroll, not by where you are. Scroll quickly and the rows tilt in the direction of travel; stop and they spring back straight. It makes scrolling feel physical, as if the content bends under its own momentum.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Strength | Normal | How far the rows lean for a given scroll speed: subtle is 0.2°, normal 0.35° and strong 0.6° for each pixel scrolled in a sixtieth of a second |
  | Lean | Tilt | Tilt tips each row like a slope, the classic look; Slant leans it sideways like italic text |
  | Spring back | Normal | How quickly the lean follows the scroll speed and fades after you stop; slow feels heavy, quick feels twitchy |
  | Most it leans | Medium | The largest angle allowed: 6°, 12° or 20°, so a fast flick cannot fold the rows over |

- **README See also:** the last link's text changes from "Marquee Ticker" to the page's real title.
  - [Smooth (Inertia) Scroll](../smooth-scroll/) — scrolling that glides to a stop, often paired with this effect
  - [Scrub Animation](../scrub-animation/) — movement tied to where you are, not how fast you go
  - [Marquee / Ticker](../../05-text-typography/marquee-ticker/) — text that scrolls sideways forever, often sped up by scrolling
- **README How it works:**
  - In the paragraph before the snippet, "the per-frame difference in `scrollTop`" becomes "the change in `scrollTop` from one frame to the next, counted per sixtieth of a second".
  - The snippet becomes:

    ```js
    function tick(now) {
      const dt = lastTime ? Math.max(now - lastTime, 1) : FRAME;   // ms since the last frame
      lastTime = now;
      const raw = (el.scrollTop - lastTop) * FRAME / dt;      // px moved per 1/60 s
      lastTop = el.scrollTop;
      vel += (raw - vel) * (1 - Math.pow(1 - SMOOTH, dt / FRAME));   // low-pass filter the spikes
      const skew = clamp(vel * INTENSITY, -MAX, MAX);
      rows.forEach(r => r.style.transform = `skewY(${skew}deg)`);
      requestAnimationFrame(tick);
    }
    ```

  - At the end of the paragraph after it, add: "Speed is measured per sixtieth of a second (`FRAME` is 1000/60 ms), so a 120Hz screen leans as much as a 60Hz one. Back to top, and Play starting again from the top, move the box in a single frame, and so can a window resize (the browser keeps the list inside its new range); when either button is clicked or the window is resized, the demo takes the box's new position as its starting point, so that jump does not count as speed. A run of scrolling starts the same way, from where the box was before its first move, so even a single notch of the wheel leans the rows."
  - The rest is unchanged.
- **README Production notes:** unchanged
- **Category line:** `01.23 · Scroll-Based`
- **Pager:** Previous: Text Fill on Scroll (`../text-fill-on-scroll/`) · Next: SVG Line Draw on Scroll (`../svg-line-draw/`)
- **Final fix wave:** `dt` has no upper limit any more: the page, the README snippet and the two places above that quote the formula (Speed per 1/60 s, and README How it works) lost the 50ms cap. With the cap a stalled frame's step was divided by 50ms instead of the time it took, so at 630px/s (Normal, a laptop) a stall of 100, 200 or 400ms added 1.2°, 3.5° and 8.2° of lean; now it adds under 0.03° (and under 0.03° at 375px/s on a phone). Ordinary scrolling is unchanged: the steady lean at 630px/s is 3.67° before and after.

---

## svg-line-draw — SVG Line Draw on Scroll

- **Kind:** scroll. A long route draws itself down the box as it scrolls.
- **Description:** A line draws itself along a route as you scroll. Best for timelines.
- **Step 1:** Scroll it · help line: default
- **Player bar:** Play · Back to top
- **Scroller:** the stage.
- **What scrolling shows:** a winding route with a faint dashed copy underneath; the solid line draws itself in step with the scroll, and five labelled stops (Depart, River crossing, Basecamp, Summit ridge, Arrive) pop in as the line reaches them. Scrolling back up erases the line and hides the stops again. The route ends at "— end of route —".
- **Scroll distance and Play:** the drawing is 3.67 times as tall as it is wide, so the content does not depend on the stage height: about 1,240px on a 375px phone and 3,450px on a laptop (3.5 to 13.4 box heights). At the defaults the line is complete at the end of the scroll, as Play ends (6 s). Early and Near the end finish at 70% and 85% of it. Fix round 1 (2026-09-30): the default was 85% ("Normal"), and with the route 3.5 to 13.4 boxes tall in the shared box the tip then left the box after about 40% of a laptop scroll (in the box for 51% of the scroll at 1280×800, 43% at 1366×657, 41% at 1280×590, 44% for a phone held sideways, 69% at 768×1024, 86% at 375×812). With the line finishing at the end the tip is in the box for the whole scroll at every size with Even (with Smooth it draws ahead early in the scroll), and every stop pops in view.
- **Reduced motion:** nothing scrolls by itself. The demo's rule stays: the stops appear without their pop (`.pop{transition:none}`); the line still draws with the scroll. With nothing drawn on arrival the first picture is the route's dashed guide, which is why the guide is drawn at .35 alpha (see Stage).
- **Stage font:** site font. `.wp-label` and `.wp-sub` drop `var(--mono)`.
- **Stage:**
  - `.stage`: `position:relative;overflow-y:auto;scrollbar-width:none;background:#0b0b0d`, with `aria-label="A route that draws itself as you scroll"`. The `svg` keeps `aria-hidden="true"`.
  - **The stops keep one size on every screen.** Today their text is sized in the drawing's own units, so it shrinks with the drawing: about 7px on phones and 20px on laptops.
    - `measure()` works out `k = 600 / map.getBoundingClientRect().width`, and each stop's `transform` becomes `translate(x y) scale(k)`. The dot, the labels, their offsets and the 5px outline under the labels are then the same size on screen at every width, while the route itself scales.
    - `.wp-label{font-size:14px;font-weight:600}` and `.wp-sub{font-size:12px}` (its fill `var(--ui-muted)`, now `#8a8a92`).
    - So that the labels fit at narrow widths, Depart's two texts move to the left of their dot (`x="-20" text-anchor="end"`) and River crossing's to the right (`x="20"`, without `text-anchor`).
    - At 320px wide, Basecamp's small line still runs 5px past the drawing's right edge. So the drawing gets `overflow:visible` (`.scene svg{display:block;width:100%;height:auto;overflow:visible}`), and that line draws into the scene's 10px padding instead of being cut off. At 375px it has 20px to spare.
  - `.scene-cap` becomes 13px `#8a8a92` (was 10px `#77777e`).
  - `.guide` stroke becomes `rgba(255,255,255,.35)` (was `.13`, 1.4:1 on the stage): about 3:1, so the route reads on arrival, above all under reduced motion, where nothing is drawn until Play or a scroll.
  - Script: `update()` keeps the dash maths; its three readout lines go. The Easing menu's value becomes the `easeMode` variable that Feel sets, and the slider's `caSl.value/100` becomes `completeAt` (default 1). Beyond the original, accepted at the review of Task 13:
    - `measure()` also works out `MAXS = scrollHeight - clientHeight - 1` (one pixel less, so the line finishes at the true end at fractional box heights), the box height and each stop's place in the scrolling content (`y`, measured from the inside of the stage's border). It runs at load, after `document.fonts.ready` and on resize, and the resize handler measures and draws at once, without a debounce.
    - A stop is on when the line has reached it and it has come into view: `drawn >= w.len && w.y - 16 < scrollTop + boxHeight` (16px is how far its label reaches above its dot). The route is many boxes tall, so the line can be drawn well ahead of the box; a stop that popped below the box's bottom edge would pop unseen. No still picture changes, because a stop below the box cannot be seen.
    - After a jump the stops change at once (`.jump .pop{transition:none}` for that one update), so no stop fades out after the line that led to it has gone. A jump is a click on Back to top or Play (a click listener on the document redraws in the same task as the click) or a move of more than half a box in one frame.
  - Phone rules: none. Today's mobile block held only the stage size and the aside.
  - `hb-dots`: no. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Feel | Choice buttons | Even · Smooth | Even | Even keeps the tip with your scroll; Smooth runs ahead. | `easeMode`: `'linear'` / `'out'` (the `EASES` key), then `update()` |
| Shows the stops | Switch | on / off | on | Labelled points pop in as the line reaches them. | the drawing's `no-wps` class off / on |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Line finishes | Choice buttons | Early · Near the end · At the end | At the end | Early leaves the whole route on show for a while. | `completeAt`: 0.7 / 0.85 / 1, then `update()` |

- **Removed:**
  - The note (it showed code), and the Scroll, Path drawn and Waypoints passed readouts.
  - The Line completes at slider. It becomes Line finishes.
  - The Easing menu. It becomes Feel.
  - "Waypoints" becomes Shows the stops.
- **Good for:** Timelines · Journey maps · Process steps · Delivery tracking · **Avoid on:** Short pages
- **Prompt:**

  > Add a scroll-drawn route to [your timeline, journey or process steps]. Draw a long winding path down the page with a faint dashed copy underneath, and reveal the solid line in step with the scroll so its tip travels down with the visitor. Measure the path's length once and reveal it by sliding a single dash that is exactly as long as the path. When the settings include them, place labelled stops along the path and pop each one in as the line reaches it; scrolling back up erases the line and hides them again. If the visitor has reduced motion turned on, show each stop without the pop. Match the settings listed below.

- **README What it is:** rewritten:

  > A scroll-drawn line is a long winding route that draws itself as you scroll down it, like a journey being traced on a map. Labelled stops along the way pop in as the line reaches them, and scrolling back up erases the line again. A faint dashed copy of the route shows where it is heading.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Feel | Even | Even keeps the tip of the line level with your scroll; Smooth draws quickly at first and slows toward the end |
  | Shows the stops | on | Five labelled stops pop in as the line reaches them and hide again when you scroll back |
  | Line finishes | At the end | How far through the scrolling the line is complete: early at 70%, near the end at 85% and at the end at 100%; finishing early shows the whole route before you reach the bottom |

- **README See also:**
  - [Scrub Animation](../scrub-animation/) — a short pinned path moves as you scroll; here a long path lives in the content
  - [SVG Path Animation](../../06-3d-advanced/svg-path-animation/) — drawings trace themselves over time instead of with the scroll
  - [Scrollytelling](../scrollytelling/) — a picture beside the text changes as a story scrolls by
- **README How it works:**
  - In the waypoint snippet, ``wp.group.setAttribute('transform', `translate(${pt.x} ${pt.y})`);`` becomes ``wp.group.setAttribute('transform', `translate(${pt.x} ${pt.y}) scale(${k})`);``.
  - After that snippet, add: "Each stop is also scaled by `k`, which is 600 divided by the drawing's width on screen, so its dot and labels keep the same size on every screen while the route itself scales." Then a paragraph on the stop rule: "A stop also waits until it has come into view, meaning its top edge is above the bottom edge of the box. The route is many boxes tall, so the line can be drawn well ahead of the box, and a stop that popped below the bottom edge would pop where nobody can see it; this way its pop plays as it scrolls in. A still picture is the same either way, because a stop that is below the box cannot be seen." The snippet gets `wp.y = svgTop + pt.y / k;` at init and `const on = drawn >= wp.len && wp.y - 16 < scrollTop + boxHeight;` per frame.
  - In the first snippet, `const p = clamp(stage.scrollTop / maxScroll, 0, 1);` becomes `const p = ease(clamp(stage.scrollTop / maxScroll, 0, 1));` (comment: Feel: p for Even, 1 - (1 - p)^3 for Smooth) and the comment on `drawn` says `COMPLETE_AT` below 1 finishes before the scroll does. After the snippet add: "`COMPLETE_AT` is 1 by default, so the line finishes as the scroll does and its tip stays inside the box while it is drawn. A smaller value finishes the line earlier: the rest of the scroll then shows the finished route, but the tip runs ahead of the box, because the route is many boxes tall."
  - In the paragraph on the pop, after "so it un-pops." add: "After a jump — Back to top, Play starting again from the top, or any move of more than half a box in one frame — the transition is switched off for that one update, so no stop fades out after the line that led to it has gone."
  - The rest is unchanged.
- **README Production notes:** unchanged
- **Category line:** `01.24 · Scroll-Based`
- **Pager:** Previous: Scroll Velocity Skew (`../scroll-velocity-skew/`) · Next: Scrollspy Navigation (`../scrollspy-nav/`)
- **Final fix wave:** wording and figures only. The route's length is one range, 3.5 to 13.4 box heights (the scrolling content divided by the box: 3.47 on a 320px phone up to 13.36 in the 258px box of 1280×590), in place of the two ranges above (3 to 10 and 5 to 13). The README's "its tip stays inside the box" holds for Even only. Measured at ten screen sizes from 320×640 to 1280×590: with Even the tip is in the box for the whole scroll at every size; with Smooth only for 8% to 29% of it (the tip is out of the box from 3% to 17% of the scroll on).

---

## scrollspy-nav — Scrollspy Navigation

- **Kind:** scroll. The menu follows the section being read; pressing a link also scrolls the box, so the page mixes scrolling and clicking.
- **Description:** A menu highlights the section you are reading. Best for long docs.
- **Step 1:** Scroll it · help line: "Scroll inside the box or pick a section in the menu, or press Play and it scrolls for you."
- **Player bar:** Play · Back to top
- **Scroller:** `<div class="doc" id="doc" data-hb-scroller tabindex="0" role="region" aria-label="Documentation sections">` inside the `.stage`. The `.stage` does the job of today's `.stage-wrap`: it holds the menu (`nav.spy-nav`) beside the scroller, so the menu stays in place. The script calls the scroller `doc` wherever it said `stage`. The page adds no focus rule: the shared stylesheet draws the focus ring of the scroller and of the menu links inset, inside the stage (rule B2).
- **Play and the menu:** the shared script stops Play on any trusted input anywhere inside the stage (rule B6), including a press on a menu link, so Play has stopped before the link scrolls the box. The link handler needs nothing more.
- **What scrolling shows:** six documentation sections scroll by. As a section's heading passes the line that Link changes at sets, its link lights and the marker slides to it; at the very bottom the last link lights. Pressing a link glides (or jumps) to its section and lights that link at once, without flickering through the links in between. Under 600px wide the menu is a strip across the top, as today.
- **Scroll distance and Play:** six sections of at least 500px and a 40cqh run-out. In the site font the sections are exactly 500px (3,000px in all) from 375px wide up. On a 320px phone the text wraps more, and each section is 564px (3,384px in all). Measured, that is about 6 box heights on a 440px tablet stage, 8.6 at 1366×657, 9.5 on a 375px phone, 10.8 on a 320px phone and 11 in the smallest stage (1280×590). Play passes about one section a second, so the marker steps down the menu about once a second.
- **Every Link changes at choice reaches every section** (rule B4). At the end of the scroll even the highest line (20% down) sits 0.4 × the box height above the bottom of the last section. That section is at least 500px tall, so the line has passed its heading in any box up to 1,250px tall. The last link is also forced on at the very bottom, as today.
- **Reduced motion:** nothing scrolls by itself. As today, a link jumps to its section instead of gliding (`reduced` in the click handler), and the marker and link colours change without their transitions (the demo's rule stays).
- **Stage font:** site font. The section headings become `h3` (rule B13; the script builds them), and `.sec h3` takes today's `.sec h2` rule without `var(--disp)`, keeping weight 800. `.spy-link` gets `font:inherit;font-size:14px;font-weight:500` in place of `font-family:var(--mono)` and 11px.
- **Stage:**
  - `.stage`: `position:relative;overflow:hidden;background:#0b0b0d`.
  - `.doc`: `height:100%;overflow-y:auto;scrollbar-width:none;position:relative;container-type:size`, with the `::-webkit-scrollbar{display:none}` rule. The old stage's border and height go.
  - `.runout{height:40cqh}`.
  - The menu keeps its place and look: top-left over the content, and a strip across the top under 600px. Measured in the site font, the rail is 145px wide and 286px tall with 44px links, so below its 16px top offset it needs a stage of 302px, which every stage at least 641px of screen tall gives. Shorter screens follow owner decision 15:
    - `@media (min-width:601px) and (max-height:640px) and (pointer:fine){.spy-link{min-height:36px}}`. The rail is then 6 × 36 + 22 = 238px, and 254px with its top offset, which fits the 258px smallest stage. The marker takes the link's height, as today (`moveInd()` reads `offsetHeight`).
    - `@media (min-width:601px) and (max-height:640px) and (pointer:coarse){.spy-nav{max-height:calc(100% - 32px);overflow-y:auto;scrollbar-width:none}}`. On a phone turned sideways the links stay 44px and the rail scrolls; `setActive(i)` keeps the active link in view (below).
  - Link and body colours: `.spy-link` stays `var(--ui-muted)` (now `#8a8a92`, 5.5:1 on the menu) and the active link `var(--ui-accent)`; `.sec p` becomes 14px `#8a8a92` (was 11px `#77777e`; 5.4:1 on the section tints).
  - `setActive(i)` also moves `aria-current="true"` to the active link, and when the menu itself scrolls it scrolls the menu, never the page, so the active link shows:
    - the phone strip: when `nav.scrollWidth > nav.clientWidth`, `nav.scrollLeft = l.offsetLeft - (nav.clientWidth - l.offsetWidth) / 2`. The six links need 629px and the strip is about 325px wide on a 375px phone, so today the active link is often out of sight;
    - the scrolling rail: when `nav.scrollHeight > nav.clientHeight`, `nav.scrollTop = l.offsetTop - (nav.clientHeight - l.offsetHeight) / 2`.

    Neither uses `scrollIntoView()`, which would also scroll the page.
  - `measure()` and `spy()` also run after `document.fonts.ready` (the section tops depend on the font); the `load` listener stays.
  - Script: the two readout lines go (`roActive`, `roPct`).
  - Phone rules, kept from today's mobile block (its layout, aside and stage-height lines go): `@media(max-width:600px){.spy-nav{flex-direction:row;top:8px;left:8px;right:8px;overflow-x:auto;padding:6px;scrollbar-width:none}.spy-ind{display:none}.spy-link{padding:0 12px;border-radius:6px}.spy-link.on{background:rgba(110,168,255,.14)}.sec{padding:80px 20px 36px}}`. Without them the 145px rail would sit over sections whose 200px left padding leaves about 58px for text.
  - `hb-dots`: no. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Link changes at | Choice buttons | Near the top · A third down · Halfway | A third down | How far up a heading must scroll before its link lights. | `activation`: 0.2 / 0.35 / 0.5, then `spy()` |
| Glides to the section | Switch | on / off | on | Off, a link jumps straight to its section. | `smoothTog.checked`, read at each click |

**More options**

None: leave out the `details.hb-options` block.

- **Removed:**
  - The note, and the Active section and Scroll readouts.
  - The Activation line slider. It becomes Link changes at.
  - "Smooth scroll on click" becomes Glides to the section.
- **Good for:** Documentation · Long articles · Settings pages · **Avoid on:** Short pages
- **Prompt:**

  > Add a scrollspy menu to [your documentation or long page and its section headings]. Keep a menu of section links in place beside the content and highlight the link for the section being read, with a marker that slides to it: a section becomes current once its heading scrolls up past a chosen line, and the last link lights up at the very bottom. Clicking or tapping a link scrolls to its section and lights that link at once, without flickering through the links in between. On phones, turn the menu into a strip across the top. If the visitor has reduced motion turned on, jump to sections instead of gliding. Match the settings listed below.

- **README What it is:** rewritten:

  > Scrollspy is the menu beside a long page that always highlights the section you are reading. As a section's heading scrolls up past a line near the top, its link lights up and a marker slides to it; clicking a link scrolls to that section. The menu and the page stay in step both ways.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Link changes at | A third down | Where a section's heading must reach before its link lights: near the top is 20% down the box, a third down 35% and halfway 50%; a higher line switches later |
  | Glides to the section | on | A link glides to its section; off, it jumps there at once, as it always does under reduced motion |

- **README See also:** each link gets a plain phrase.
  - [ScrollTrigger Animation](../scroll-trigger/) — things start, scrub and pin as parts of the page scroll past
  - [Progress Bar](../progress-bar/) — a bar shows how far you have read
  - [Snap Scrolling](../snap-scrolling/) — scrolling stops on one whole section at a time
- **README How it works:** in the snippet (the section's one code block), `stage` becomes `doc` wherever it appears. The rest is unchanged.
- **README Production notes:** the "`offsetTop` is the recurring trap" bullet is wrong about this demo (its scroller is positioned, so `offsetTop` would be measured from it). The words "here it would be body-relative and every comparison would be wrong" become "and then every comparison is wrong (this demo positions its scroller, but still measures as below, which works whatever sits in between)". The rest is unchanged.
- **Category line:** `01.25 · Scroll-Based`
- **Pager:** Previous: SVG Line Draw on Scroll (`../svg-line-draw/`) · Next: Scroll-Driven Background Color (`../scroll-background-color/`)

---

## scroll-background-color — Scroll-Driven Background Color

- **Kind:** scroll. The box's background blends from one section's color to the next as it scrolls.
- **Description:** The background color changes as you scroll through sections. Best for stories.
- **Step 1:** Scroll it · help line: default
- **Player bar:** Play · Back to top
- **Scroller:** the stage. It is also the element whose background the script rewrites, which the shared stage allows (the demo owns the stage's background).
- **What scrolling shows:** five chapters scroll by while the box's background blends through the palette, one color per chapter, in step with the scroll both ways. When the background turns light, as it does on Daylight and on Forest, all of the text turns from white to black.
- **Scroll distance and Play:** five chapters of 90cqh each: 3.5 box heights of scrolling. Play moves through one color change about every 1.5 s.
- **Reduced motion:** nothing scrolls by itself. As today, the blend stays: a change of color is not movement (the README says so). The note text the script wrote under reduced motion goes with the note.
- **Stage font:** site font. The chapter titles become `h3` (rule B13; the script builds them), and `.stage h3` takes today's `.stage h2` rule without `var(--disp)`, keeping weight 800.
- **Stage:**
  - `.stage`: `position:relative;overflow-y:auto;scrollbar-width:none;container-type:size;background:#0d1124`, with `aria-label="Sections whose background color blends as you scroll"`.
  - `section{min-height:90cqh}`.
  - **The text stays readable over every color.** Today `p` and `.num` are see-through, and with the flip at the demo's 0.55 luma they fall to about 2:1 on the Daylight and Forest palettes (`h2` to about 3:1).
    - All section text is full-strength `#fff` on dark backgrounds and `#000` on light ones: `.num`, `h3` and `p` become `#fff`, and in `.stage.light` `#000`, with no opacity (owner decision 14).
    - The flip uses relative luminance: `const lin=c=>(c/=255)<=0.03928?c/12.92:((c+0.055)/1.055)**2.4; const lum=0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(bl);` and `light=lum>0.18`, the point where white and black text contrast equally.
    - Checked over every blended color of the three palettes (10,000 steps between each pair of colors): at least 4.57:1 everywhere, the lowest on Daylight. Dusk never flips; Daylight and Forest each flip to dark text and back.
  - `.num` becomes 13px, weight 600, keeping its letter spacing. `.stage p` becomes `font-size:14px` (was `clamp(11px,1.4vw,13px)`; rule B9).
  - The chapter lines are rewritten in plain words where they named code or settings (luminance, the blend window, snapping):

    | Chapter | Title | Text |
    |---|---|---|
    | 01 | Departure | The first section owns the darkest color. Scroll down and the ground shifts under the text. (unchanged) |
    | 02 | Ascent | Halfway between two sections, the background is an even mix of both colors. |
    | 03 | Meridian | When the background turns light, the text turns dark so it stays readable. |
    | 04 | Descent | Each section has a color of its own, and the change happens as you move between them. |
    | 05 | Arrival | The last color stays as you reach the end. |

  - Script: `update()` keeps the blend maths and the guarded write; the swatch, hex, percentage and segment readout lines go.
  - Phone rules: none. Today's mobile block held only the stage size and the aside.
  - `hb-dots`: no. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Colors | Choice buttons | Dusk · Daylight · Forest | Dusk | On Daylight and Forest the text turns dark on light colors. | `PAL`: `THEMES.dusk` / `THEMES.daylight` / `THEMES.forest`, then `update()` |
| Blend | Choice buttons | Gradual · Quick · Hard cut | Gradual | Hard cut shows the change with no blending at all. | Gradual: `WIN` 1 and `SNAP` false / Quick: `WIN` 0.3 and `SNAP` false / Hard cut: `SNAP` true; then `update()` |

**More options**

None: leave out the `details.hb-options` block.

- **Removed:**
  - The note, with the reduced-motion text it showed.
  - The Scroll, Segment and Background readouts.
  - The Theme menu. It becomes Colors.
  - The Blend window slider and the Snap at boundaries checkbox. Together they become Blend: Gradual is today's default, Quick is the narrowest window, and Hard cut is Snap.
- **Good for:** Stories · Portfolios · Case studies · **Avoid on:** Text-heavy pages · Forms
- **Prompt:**

  > Add a scroll-driven background color to [the sections of your page]. Give each section a color, and as the visitor scrolls, change the page background from one section's color to the next in step with their position, blending between them unless the settings ask for a hard cut, so the color follows the scroll both ways. Blend in a perceptual color space so the colors in between stay clean. Check the text against the background at every point, and switch the text to dark when the background turns light. A change of color is not movement, so keep it when the visitor has reduced motion turned on. Match the settings listed below.

- **README What it is:** rewritten:

  > A scroll-driven background color gives each section of a page its own color and blends from one to the next as you scroll, so the whole page seems to change mood. Halfway between two sections the background is a mix of both colors. When the background turns light, the text switches to dark so it stays readable.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Colors | Dusk | The palette, one color per section: Dusk stays dark; Daylight passes through pale colors and Forest through a light green, and the text turns dark on those |
  | Blend | Gradual | Gradual changes the color the whole way between sections; Quick holds each color and changes it near the boundary; Hard cut switches at the boundary with no blend, to show why the blend matters |

- **README See also:**
  - [Scrollytelling](../scrollytelling/) — a picture beside the text changes as a story scrolls by
  - [Animated Gradient Background](../../07-ambient-background/animated-gradient-background/) — colors that shift on their own, with no scrolling
  - [Section Wipe](../section-wipe/) — each section slides up over the one before
- **README How it works:**
  - "swapping the section text from light ink to dark ink:" becomes "swapping all of the section text from white to black:".
  - The second snippet becomes:

    ```js
    const lin = c => (c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    const lum = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);   // relative luminance
    stage.classList.toggle('light', lum > 0.18);   // white and black text contrast equally at 0.18
    ```

  - The rest is unchanged.
- **README Production notes:** unchanged
- **Category line:** `01.26 · Scroll-Based`
- **Pager:** Previous: Scrollspy Navigation (`../scrollspy-nav/`) · Next: none
- **Final fix wave:** each chapter's text is one paragraph, `<p>${c[1]} ${c[2]}</p>`, with no `<br>`, so it wraps on its own (the table lists the text, not where it breaks). At 375px no chapter has a one-word line (the forced break left "background" and "text." alone); on laptops and tablets chapters 1 to 4 still take two lines and chapter 5 now takes one, and the section heights and the scroll length are unchanged. At 320-344px and 352-373px (360px, for example) a last line can still be one word.
