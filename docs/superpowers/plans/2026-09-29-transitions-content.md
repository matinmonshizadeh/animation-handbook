# Page Transitions — Content Sheet

This sheet decides, page by page, how the twelve Page Transitions pages present their kind, settings, words and prompt on the guided-steps page. The conversion tasks of `2026-09-29-demo-page-rollout-parallel.md` follow each section exactly, together with "How to convert a page" in `2026-09-28-demo-page-rollout-text-typography.md`, the do-it markup of `2026-09-29-demo-page-kinds-do-and-scroll.md` (Task 2) and the category rules below. Rotate In (`animations/02-entrance-and-exit/rotate-in/`) is the reference for everything a section does not mention.

## Owner decisions that apply here

- **Stage text uses the site font.** No page here is about typing, so no stage uses a typewriter font.
- **Do-it pages show themselves once on arrival:** the shared script presses Show me 400ms after load. Under reduced motion nothing runs by itself, Slow motion is shown switched off and cannot be switched on (with the shared note), and Show me and Reset still work when pressed.
- **Long names in the top bar are cut with "…"** by the shared stylesheet. Several pager names here are long (Shared Element Transition, Flash / Light Leak Transition); nothing to do on the page.
- **Lessons from the Text & Typography reviews** apply to every page:
  - every timer goes through the pruning `later()` (a fired timer's id leaves `timers`);
  - no double `requestAnimationFrame` (see "Starting a transition" below);
  - the `hb:input` listener is registered at the top level of the page's inline script. It only clears `afterMove` and the way-back timer, so it is safe to run many times for one gesture (one touch sends both `touchstart` and `pointerdown`); it never calls `settle()`, and only `settle()` advances the View Transitions run counter;
  - the page reaches the player controls by their ids (`btn-demo`, `btn-reset`, `slow-tog`), never by `data-hb-*`.
- The Pause decisions ("Pause stops at once", the `wait()`/`freeze()`/`thaw()` helper, the css Pause) do not apply: no page in this category is a loop.
- The category keeps `--ui-accent:#b98cff` and the category line `03.NN · Page Transitions`, NN being the page's position on the home page (03.01 View Transitions API to 03.12 FLIP Technique).

## Rules for every page in this category

### Kind, step 1 and player bar

- **Kind:** every page is a do-it page: `<body class="hb" data-hb-kind="do" data-hb-autoplay>`. Each demo waits for the visitor to click inside it: ten of them switch between three small pages, Shared Element Transition opens a project and goes back, and FLIP Technique rearranges cards.
- **Step 1:** titled "Click it", with the help line each section gives.
- **Player bar:** Show me, Reset and Slow motion, in that order: the exact Show me and Reset buttons of the do-it plan (ids `btn-demo`, `btn-reset`), then Rotate In's Slow motion switch written without a value (`<label class="hb-toggle"><input class="hb-switch" type="checkbox" role="switch" id="slow-tog" data-hb-slowmo autocomplete="off"><span>Slow motion</span></label>`), unchecked. Every demo here has a state to return to, so every page has Reset.
- **Try it help line:** exactly "Change a setting, then try it again or press Show me." (the same line on every do-it page, in every category). On do-it pages a setting change updates the chips and shows at the next transition; nothing replays by itself.

### Show me and Reset

- **Show me is one visit and the way back.** It plays one transition to another page (or view, or layout), holds it for 1200ms, then plays the transition back to where the run started, so the demo ends at rest where it began. A single transition lasts 0.5 to 1.25s at the default settings, below the two to four seconds a Show me run should last; the way back also shows the transition a second time, and on direction-aware demos (Slide Transition) it shows the reverse direction. Each section gives its run and its length at the default settings.
- **The run, on the ten page-change demos (the ones with page names):**
  1. Show me first calls `settle()`: it clears every pending timer, cancels the page's running animation frame, skips a running view transition, and puts the demo in its resting state for `current` at once, with `animating=false`.
  2. It goes to the next page, `(current + 1) % 3`, through the same `navigate()` a click on that page's name runs. It passes a callback that runs when this transition has ended, at the point where the page's code sets `animating=false` today. Under reduced motion the page swaps with no movement, and the callback runs straight away. Keep the callback in one page-level variable (for example `afterMove`): the transition's end code runs it once and clears it, and `settle()` and `hb:input` clear it too.
  3. That callback schedules the way back with `later()` 1200ms later: `navigate()` to the page the run started from. This hold is not stretched by Slow motion.
  Shared Element Transition and FLIP Technique follow the same three steps with their own transitions (see their sections).
- **`hb:input` stops a run under way.** It fires when the visitor presses, types, scrolls or touches inside the stage. It cancels the step not yet started: the end-of-transition callback and the 1200ms timer of the way back. A transition already moving finishes normally and nothing follows, so the visitor is in control. A click on a page name during the hold therefore cancels the way back and plays the visitor's own transition. One gesture can send `hb:input` more than once (a touch sends `touchstart` and `pointerdown`), so the handler does nothing but clear `afterMove` and the way-back timer: running it twice is harmless. It never calls `settle()` and never touches the View Transitions run counter, which only `settle()` advances.
- **Reset** calls `settle()`, then shows the demo's first state at once, with no transition (for the page-change demos: the first page, Home, with its name highlighted, the other pages hidden, and their inline transition, transform, filter, clip-path and animation styles cleared). The old "← Return to Home" did the same but ignored clicks during a transition; Reset works at any moment.
- **A click on the page already shown does nothing,** as today. Clicks during a transition are still ignored (`animating`), as today.

### Starting a transition (no double requestAnimationFrame)

Eight demos put an element in its starting state with `transition:none` and start the transition inside `requestAnimationFrame(()=>requestAnimationFrame(…))`: Blur, Crossfade (one after the other), Dissolve, Elastic (planned path), FLIP, Shared Element, Slide and Zoom. Flash waits for one frame before its fade-out. Frames only come while the page is being drawn: in a hidden browser pane or a background tab they stop, so the transition never starts, the demo stays with `animating=true` and every later click is ignored until the page is drawn again, while timers such as a Show me hold keep running. This happened to the Dissolve demo in the in-app browser while this sheet was written. The conversion sets the starting state, forces a reflow (`void el.offsetWidth` on the element that moves), then sets the transition and the end state in the same task. Timers that wait for the transition start at that same moment, outside any frame callback. Frame loops that draw the animation itself stay: Morph's point loop and Elastic's live spring.

### Slow motion

`data-hb-slowmo` without a value: the page stretches its own timing. When a transition starts, the page reads `slowTog.checked`. If it is on, the transition's durations, delays and the timers that wait for them are multiplied by 3. The 50ms safety margins in those timers and the 1200ms Show me hold stay as they are. A change on the switch shows from the next transition. The shared script's `replay()` does nothing on these pages, since they have no Replay. Each section names what is multiplied.

### Stage

- The aside goes entirely: the note, the State readouts, the live value readouts and the frame loops that updated them, the History log, and "← Return to Home" / "← Return to Grid" / "Reset layout", which the player bar's Reset replaces. The injected `.ah-bar`, its `ah-inject` style and its copy script go, as in "How to convert a page".
- `.stage` keeps the demo's own `display:flex;flex-direction:column;overflow:hidden;background:var(--bg)`. It drops `flex:1`, `min-width:0`, `height:var(--stage-h)`, `border` and `border-radius`, because the shared stylesheet owns the stage's size, border and corners. `--stage-h` goes, and so does the old phone block (stacking, `--stage-h:480px`, button heights). `hb-dots`: no, on every page: the mini nav and the pages fill the stage.
- **Height:** the default height fits every page-change demo. This was measured with a scratch copy of the mini pages on the shared stage: the page area is 313px tall at 1280×800, 260px at 1366×657 and 233px on a 375px or 320px phone, and the tallest mini page, Work, ends inside it on every size (at 253px, 226px and 205px). Portal / Tunnel Zoom sets a phone height, and FLIP Technique uses `hb-grow`; see their sections.
- `:root` keeps `--bg`, `--ui-bg`, `--ui-border`, `--ui-accent:#b98cff`, `--ui-text`, `--ui-muted` and the demo variables its CSS reads. `--disp`, `--mono`, `--stage-h` and the variables nothing reads (each section names them) go. `--ui-muted` becomes `#8a8a92`: the old `#77777e` is 4.2:1 on the nav's `#111114`, and the new one is 5.5:1.
- **Site font:** remove `font-family` from `.nav-btn`, `.tb-btn` and `.nav-back`; the other rules that set it (`body`, `select`) go with the old layout. Stage text inherits Schibsted Grotesk.
- **Mini nav** (the ten page-change demos):
  - `.nav-btn` gets `font-size:13px;padding:0 12px;min-height:44px` at every size (was 10px text, and 36px tall on computers on eight of the pages). With the Morph logo, this still fits a 320px phone (measured).
  - Its hover rule stays inside `@media (hover: hover)`.
  - Where the mini nav is a `<nav>`, it gets `aria-label="Demo pages"` so screen readers do not mistake it for the site's navigation.
- **Mini pages** (Home, Work or Gallery, About):
  - Each page's `<h2 class="ph">` becomes `<p class="ph">`, so the demo's sample headings do not join the page's outline of steps. `.ph` keeps its size and `font-weight:bold`.
  - `.pe` and `.pstat span` go from `opacity:.4` to `.6`: 3.4:1 becomes 5.7:1 on the pages' backgrounds. `.pp` stays at `.6` (5.7:1), or `.55` on Flash (5.7:1).
- **Timers:** every timer goes through `later()`, and `settle()` clears them all.

### Settings

- Duration sliders become Speed (Slow · Normal · Fast): the old default is Normal, and Slow and Fast are about 1.6× and 0.6× of it.
- Easing menus become Feel, using the Entrance & Exit names: Smooth (slows to a stop), Springy (goes a little past, then settles), Gentle (eases in and out), Even (one steady speed). Portal adds Speeds up (starts slowly and speeds up) for its `ease-in`. Each row gives the exact curve. Near-duplicate curves go: the menus' `ease-out` and `cubic-bezier(.2,.7,.3,1)` look almost the same, so only one of them stays, as Smooth.
- Teaching overlays go, as on Clip-Path Reveal: Morph's control points, Dissolve's tile mask and FLIP's Invert badges. They show how the demo is built, are not part of the effect, and would end up in the copied prompt as settings.
- A setting takes effect at the next transition. Values a transition reads (Speed, Feel, style) are read when it starts, as today.

### README

- **What it is** is rewritten in plain words, with no code.
- **Key parameters** has one row per setting, with the same names as the page.
- **See also** link texts equal the target page's `<h1>`, each followed by one plain phrase. The h1s here are: View Transitions API, Shared Element Transition, Morph Transition, Crossfade Transition, Slide Transition, Zoom Transition, Flash / Light Leak Transition, Blur Transition, Elastic Transition, Portal / Tunnel Zoom, Dissolve Transition, FLIP Technique. The home cards use shorter names for three of them (Crossfade, Flash / Light Leak, Dissolve). The page titles stay as they are, and every link uses the h1.
- **How it works** changes where the code changes, mostly to replace the double `requestAnimationFrame` with the reflow.
- **When to use it** and **Production notes** are unchanged unless the section says otherwise.

---

## view-transitions-api — View Transitions API

- **Kind:** do it. The visitor clicks a page name; the browser animates the change.
- **Description:** The browser animates the change between two pages for you. Best for web apps.
- **Step 1:** Click it · help line: "Click Work or About at the top of the box, or press Show me."
- **Player bar:** Show me · Reset · Slow motion (page)
- **Show me:**
  - The run goes from Home to Work with the chosen transition style, holds 1200ms after the view transition's `finished` promise resolves, then goes back to Home: about 2.2s.
  - `settle()` calls `skipTransition()` on a view transition still running and marks the demo idle at once. The old navigation's `await t.finished` must then not run its end code; a run counter compared after the `await` handles this.
  - A view transition skipped while the browser is still taking its first picture still runs its update callback afterwards. With today's `switchPage(prev,next)` that callback could undo a Reset made in the same frame, so the update callback shows the resting state for `current` as it is when the callback runs (`startViewTransition(()=>showPage(current))`), not the pages the navigation started with.
  - `hb:input` cancels the way back. A view transition already running finishes.
  - Note for the builder: while a view transition runs (half a second at Normal), the browser's transition layer covers the page, so a press may land on the page root instead of the stage and send no `hb:input`; a press then does not cancel the way back. Check this in the browser during the conversion.
- **Reset:** yes. Home at once; a running view transition is skipped first.
- **Slow motion:** each navigation sets `--vt-dur` to Speed × 3 before it starts the view transition. The fallback crossfade for browsers without the API is stretched too: its 300ms fade becomes 900ms, and its 350ms wait becomes 950ms.
- **Reduced motion:** the demo's rule (`::view-transition-old(page-content),::view-transition-new(page-content){animation:none}`) and its `motionOk` branch (`switchPage()` at once) stay. Show me swaps to Work and back with no movement.
- **Stage font:** site font.
- **Stage:**
  - The mini nav and the page area stay. `.page-area` keeps `view-transition-name:page-content`, and every `::view-transition-*` rule and keyframe stays.
  - **Special case:** the browser draws the old and new pictures above the whole page, in the top layer. The stage's `overflow:hidden` therefore cannot clip them. The demo's own `::view-transition-group(page-content){overflow:clip}` keeps the slide and zoom inside the page area's box, and `::view-transition-old(root),::view-transition-new(root){animation:none}` keeps the rest of the page still. That group rule also gets `border-radius:0 0 11px 11px`, so the page area keeps the stage's rounded bottom corners mid-transition (the stage's 12px radius inside its 1px border).
  - **The site's top bar stays drawn above the transition** (owner decision). The page area's pictures are drawn above everything, so a stage scrolled partly under the sticky top bar would cover the bar for the length of a transition. The page's own `<style>` names the bar and keeps its pictures still: `.hb-bar{view-transition-name:hb-bar}`, `::view-transition-group(hb-bar),::view-transition-old(hb-bar),::view-transition-new(hb-bar){animation:none}` and `::view-transition-old(hb-bar){opacity:0}`. The old picture is hidden so the bar stays exactly as it looks at rest: with `animation:none` both pictures show at full strength, one over the other, and the bar's slightly see-through background would turn more solid for the length of a transition. The bar paints above the page area (z-index 50), so its group is drawn above the page area's. `page-content` and `hb-bar` are the only two names; the shared page adds none.
  - The support banner goes (it was in the aside); the fallback stays in the code, and Production notes describe it.
  - `.pstat b` stays `#58a6ff`.
  - Unused variables: none.
  - Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Transition style | Choice buttons | Fade · Slide · Zoom · Tilt | Fade | The same click, animated four different ways. | `style`: `'crossfade'` / `'slide'` / `'zoom'` / `'custom'` (replaces `styleSel.value`). Each navigation sets `data-vt` on `<html>` from it, `''` for Fade, as today. |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long the change from page to page takes. | `dur`: 800 / 500 / 300 (ms). Each navigation sets `--vt-dur` from it (× 3 in slow motion). |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Feel | Choice buttons | Smooth · Gentle · Even | Gentle | Gentle eases in and out; Even keeps one steady pace. | `--vt-ease` on `<html>`: `ease-out` / `ease-in-out` / `linear` (set at once, as the menu did) |

- **Removed:**
  - The note and the support banner.
  - The Page readout and the History log.
  - The Transition style menu. It becomes choice buttons.
  - The Duration slider. It becomes Speed.
  - The Easing menu. It becomes Feel, and its `cubic-bezier(.2,.7,.3,1)` "Smooth" goes, because it looked almost the same as Ease out, which is now Smooth.
  - "← Return to Home". Reset replaces it.
- **Good for:** Web apps · Page changes · Tabs and filters · Galleries · **Avoid on:** Frequent updates
- **Prompt:**

  > Add page transitions to [your site's pages or views] with the browser's View Transitions API. Wrap each page change in a view transition: the browser takes a picture of the page before and after the change and animates between the two pictures. Name the content area so that only it animates, and turn off the default animation of the whole page. Style how the old and new pictures move with CSS, for example a fade, a slide or a zoom. Check that the browser supports the API, and simply swap the content when it does not. If the visitor has reduced motion turned on, swap the content with no animation. Match the settings listed below.

- **README What it is:** rewritten:

  > The View Transitions API is a browser feature that animates a change of page for you. You tell the browser when the page is about to change; it takes a picture of the page before and after, then animates from one picture to the other. CSS decides how the pictures move, so the same click can fade, slide, zoom or tilt.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Transition style | Fade | Fade blends the two pictures; Slide pushes the old one out to the left as the new one comes in from the right; Zoom shrinks the old one away as the new one settles from slightly larger; Tilt turns both slightly as they fade |
  | Speed | Normal | How long the change takes: slow is 800ms, normal 500ms and fast 300ms; under about 150ms it reads as an instant swap |
  | Feel | Gentle | Gentle eases in and out; Smooth slows to a stop; Even keeps one steady pace |

- **README See also:** the first link's text becomes the page's real title.
  - [Crossfade Transition](../crossfade/) — the same fade, built by hand
  - [Slide Transition](../slide-transition/) — pages slide, with a sense of direction
  - [Zoom Transition](../zoom-transition/) — three ways to zoom between pages
  - [Shared Element Transition](../shared-element-transition/) — one picture grows into the next page
- **README How it works:** unchanged
- **README Production notes:** the support banner is gone, so the first bullet says what browsers without the API see: "the demo does exactly this so unsupported browsers still transition." becomes "the demo does exactly this, so browsers without the API still get a simple 300ms fade, whatever the Transition style and Speed." The rest is unchanged.
- **Category line:** `03.01 · Page Transitions`
- **Pager:** Previous: none · Next: Shared Element Transition (`../shared-element-transition/`)

---

## shared-element-transition — Shared Element Transition

- **Kind:** do it. The visitor opens a project and goes back.
- **Description:** A picture grows from the list into the next page's header. Best for galleries.
- **Step 1:** Click it · help line: "Click a project to open it, then Back, or press Show me."
- **Player bar:** Show me · Reset · Slow motion (page)
- **Show me:**
  - The run starts from the grid: `settle()`, and if the detail view is open it closes at once, as Reset does.
  - It opens the last project, Lumen, at the bottom right: its picture grows from the thumbnail into the header of the detail view while the grid fades and the detail text fades in. Lumen's picture travels furthest, so the movement is easy to follow.
  - 1200ms after the opening ends (the `dur+50` timer that hides the copy and shows Back), the run closes the detail view the way Back does.
  - This takes about 2.3s.
  - `hb:input` cancels the pending close. An opening already under way finishes.
- **Reset:** yes. The grid at once: the copy is hidden, the detail view closed and its inline `opacity` and `transition` cleared, the grid's inline `opacity`, `transition` and `pointer-events` cleared (so it shows and takes clicks again) and its `inert` removed, the title back to "Projects" and Back hidden.
- **Slow motion:** multiplies `dur` by 3 wherever it is used: the copy's travel, the grid's fade (0.4 × `dur`), the detail's fade and its delay (0.4 and 0.6 × `dur`), the close fade (0.3 × `dur`), and the matching parts of the `dur+50` and `0.3×dur+50` timers.
- **Reduced motion:** the demo's `motionOk` branches open and close the detail view at once, and the rule `#flip-el{transition:none!important}` stays. Show me opens Lumen and closes it again with no movement.
- **Stage font:** site font.
- **Stage:**
  - The mini nav (Back and the title) and the page area (grid, detail view and the moving copy `#flip-el`) stay.
  - **Special case:** the copy is `position:fixed` and moves in viewport coordinates, so the stage's `overflow:hidden` does not clip it. The conversion must not give the stage or any of its ancestors a `transform`, `filter`, `backdrop-filter`, `perspective`, a `will-change` naming one of these, or `contain` with `layout` or `paint`: any of them would become the copy's containing block and shift or clip it. `container-type` and `contain:size` or `style` do not make one in Chrome; leave them off too, simply because the stage needs no containment. The copy keeps its own `will-change:transform`.
  - `#flip-el`'s `z-index:100` becomes `40`: above the stage's content, below the site's sticky top bar (50), so a stage scrolled partly under the bar does not draw the copy over it (owner decision).
  - `.nav-back` becomes 13px text, `min-height:44px` at every size, in `var(--ui-muted)`. `.nav-title` becomes 13px. The unused `.nav-label` rule goes.
  - **The projects become buttons, so a keyboard can open them.** Today each thumbnail is a `div` with a click listener, which a keyboard cannot reach on a "Click it" page.
    - Each becomes `<button type="button" class="thumb">`. `.thumb` adds `border:0;font:inherit;color:inherit;text-align:left;cursor:pointer`.
    - Its two lines become `<span class="thumb-label">` and `<span class="thumb-sub">` with `display:block`, because a button may only hold inline content.
    - Hidden controls leave the Tab order. While the detail view is open, the grid gets `inert` (removed when the grid shows again). `.nav-back` adds `visibility:hidden` and `transition:opacity .2s,visibility 0s .2s`: when hidden it fades out, then leaves the Tab order, so it is not an invisible Tab stop in the grid view. `.nav-back.show` gets `visibility:visible;transition:opacity .2s`, so Back is visible, and can take focus, the moment `show` is added. A visibility transition on showing would keep Back hidden for about two frames, and `focus()` in the same step would silently fail. Under reduced motion that same step is the only chance (checked in Chrome).
    - Focus follows the view. When the visitor opens a project, by click or by key, focus moves to Back once it shows (`focus({preventScroll:true})`). Back returns focus to that project's button once the grid shows. A mouse click gets no focus ring, because the browser shows the ring only after keyboard use. Show me and Reset move no focus.
  - `.thumb-sub` goes from `opacity:.5` to `.8`: 3.0:1 becomes 5.1:1 on the thumbnails.
  - Two thumbnail title colours change so the 11px titles read on their thumbnails, and the detail view's title uses the same colours: Atlas `#79c0ff` becomes `#a5d6ff` (4.49:1 becomes 5.7:1), and Prism `#56d364` becomes `#7ee787` (4.1:1 becomes 5.1:1).
  - Unused variables: `--dur` and `--ease` go.
  - Default height: the grid and the longest detail text fit the 233px page area on a 320px phone.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long the picture takes to grow into place. | `dur`: 800 / 500 / 300 (ms) |
| Feel | Choice buttons | Smooth · Springy | Smooth | Springy grows a little past the header, then settles. | `ease`: `cubic-bezier(.2,.7,.3,1)` / `cubic-bezier(.34,1.56,.64,1)` (replaces `easeSel.value`) |

**More options**

None: leave out the `details.hb-options` block.

- **Removed:**
  - The note.
  - The View and Selected readouts.
  - The Duration slider. It becomes Speed.
  - The Easing menu. It becomes Feel, and Ease out goes, because it looked almost the same as Smooth.
  - "← Return to Grid". Reset replaces it.
- **Good for:** Galleries · Product grids · Card lists · Media libraries · **Avoid on:** Unrelated pages
- **Prompt:**

  > Add a shared element transition to [your list of items and their detail pages]. When a visitor opens an item, its picture should grow from its place in the list into the large header of the detail page, while the list fades away and the detail text fades in just after the picture lands. Measure where the picture starts and where it ends, put a copy at the start, and move the copy to the end, so it reads as one continuous element. Going back fades the detail page out and the list back in. If the visitor has reduced motion turned on, open and close the detail page without the movement. Match the settings listed below.

- **README What it is:** rewritten:

  > A shared element transition keeps one piece of content in view while the page changes around it: a thumbnail in a grid grows and moves into the large picture at the top of its detail page, instead of the two pages simply swapping. It feels as if you travel with the content rather than jump to a new screen. The demo measures where the picture starts and where it ends, then moves a copy of it from one to the other.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Speed | Normal | How long the picture takes to travel and grow: slow is 800ms, normal 500ms and fast 300ms; 300 to 600ms feels responsive without dragging |
  | Feel | Smooth | Smooth slows to a stop; Springy grows a little past the header's size, then settles |

- **README See also:** the descriptions lose their code, and "Portal Zoom" becomes the page's real title.
  - [View Transitions API](../view-transitions-api/) — the browser can do this itself
  - [FLIP Technique](../flip-technique/) — the measure-then-move method on its own
  - [Portal / Tunnel Zoom](../portal-zoom/) — the next page opens out of a clicked circle
  - [Morph Transition](../morph-transition/) — a shape changes instead of moving
- **README How it works:**
  - In the snippet, replace the `requestAnimationFrame(()=>requestAnimationFrame(()=>{ … }));` wrapper with a reflow. The lines that were inside it follow directly, with `easeSel.value` becoming `ease`:

    ```js
      void flipEl.offsetWidth;                                     // commit the start rect
      flipEl.style.transition = `all ${dur}ms ${ease}`;            // PLAY
      flipEl.style.top = heroRect.top+'px';
      flipEl.style.left = heroRect.left+'px';
      flipEl.style.width = heroRect.width+'px';
      flipEl.style.height = heroRect.height+'px';
      flipEl.style.borderRadius = '0';
    ```

  - In the first paragraph, "then on the next frame transition it to the end rect" becomes "then transition it to the end rect".
  - The sentence "The double `requestAnimationFrame` guarantees the browser paints the start rect before the transition begins — without it the clone would jump straight to the end." becomes "Reading `offsetWidth` after placing the clone makes the browser apply the start rect before the transition is switched on — without it the clone would jump straight to the end."
- **README Production notes:** the second bullet is wrong about how the copy moves: it animates `top`, `left`, `width` and `height`, not a transform. It becomes: "**The clone is `position:fixed`**, so it moves in viewport coordinates and ignores the scroll and layout of the pages underneath it. It animates `top`, `left`, `width` and `height`, which is cheap enough for one element; to move many elements, animate `transform` instead, as the FLIP Technique demo does." The rest is unchanged.
- **Category line:** `03.02 · Page Transitions`
- **Pager:** Previous: View Transitions API (`../view-transitions-api/`) · Next: Morph Transition (`../morph-transition/`)

---

## morph-transition — Morph Transition

- **Kind:** do it. The visitor clicks a page name; the logo reshapes to match the page.
- **Description:** The logo changes shape to match each page you visit. Best for brand marks.
- **Step 1:** Click it · help line: "Click Gallery or About at the top of the box, or press Show me."
- **Player bar:** Show me · Reset · Slow motion (page)
- **Show me:**
  - The run goes from Home to Gallery: the logo morphs from the circle to the hexagon while the pages fade across.
  - It holds 1200ms after the morph's `done` callback, then goes back to Home (hexagon to circle): about 2.6s.
  - `hb:input` cancels the way back.
- **Reset:** yes. Home at once, with the logo drawn as the circle in its colour (`SHAPES[0]`).
- **Slow motion:** multiplies the morph's duration (`dur`, read into `d` when a morph starts) by 3. The pages' 300ms fade is multiplied too: `.page`'s transition becomes `opacity var(--fade,300ms) ease`, and each navigation sets `--fade` to 900ms in slow motion or 300ms otherwise. `settle()` and Reset set `--fade` to `0ms` before they switch the pages, so they switch at once instead of fading over 300ms; the next navigation sets it again.
- **Reduced motion:** the demo's rule `.page{transition:none}` stays; the rule's `.pts-overlay` part goes with the overlay. `startMorph()`'s `motionOk` branch, which draws the new shape at once, also stays. Show me swaps to Gallery and back with no movement.
- **Stage font:** site font.
- **Stage:**
  - The mini nav (the logo and the page names in `#nav`) and the page area stay.
  - The logo grows from 32×32 to 44×44 (the height of the page names), so the morph is easier to see.
  - The control-point layer goes: the empty `#pts-layer` circle, `drawPts()` and `ptsGroup`.
  - The `.shape-row`, `.shape-btn`, `.pts-overlay` and `.tog` rules go with their controls.
  - `.pstat b` stays `#58a6ff`.
  - Unused variables: `--dur` and `--ease` go.
  - Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long the logo takes to change shape. | `dur`: 1100 / 700 / 400 (ms) |
| Feel | Choice buttons | Smooth · Springy · Gentle · Even | Gentle | Springy stretches a little past the new shape. | `ease`, which `easeFn()` reads in place of `easeSel.value`: `'ease-out'` / `'springy'` / `'ease-in-out'` / `'linear'` |

**More options**

None: leave out the `details.hb-options` block.

- **Removed:**
  - The note.
  - The Page and Shape readouts and the History log.
  - The "Jump to shape" buttons. A click on a page name morphs the logo into that page's shape, which shows the same morph.
  - "Show control points", a teaching overlay. Its dots are too small to read on the logo.
  - The Morph duration slider. It becomes Speed.
  - The Easing menu. It becomes Feel.
  - "← Return to Home". Reset replaces it.
- **Good for:** Logos · Brand marks · Icons that change state · **Avoid on:** Detailed pictures · Text
- **Prompt:**

  > Add a morphing logo to [your logo or icon, and the pages it belongs to]. Give each page its own shape for the logo, and when the visitor changes page, let the outline flow from the old shape into the new one while the page content fades across. Draw every shape with the same number of points in the same order, so each point has a partner to move to and the outline never tears or twists. Move the points yourself on every frame, because CSS cannot blend two different shapes. If the visitor has reduced motion turned on, switch to the new shape at once. Match the settings listed below.

- **README What it is:** rewritten:

  > A morph transition turns one shape into another by moving each point of its outline toward a matching point in the new shape. Instead of swapping pictures, the outline flows: a circle unfolds into a hexagon, and a hexagon sharpens into a star. In the demo, a small logo changes shape to match each page as you move between Home, Gallery and About.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Speed | Normal | How long the change of shape takes: slow is 1100ms, normal 700ms and fast 400ms; slower reads as more deliberate |
  | Feel | Gentle | Gentle eases in and out; Smooth slows to a stop; Springy stretches a little past the new shape and settles back; Even keeps one steady pace |

- **README See also:** "Flip Technique" and "Crossfade" become the pages' real titles.
  - [Shared Element Transition](../shared-element-transition/) — one element moves instead of changing shape
  - [FLIP Technique](../flip-technique/) — elements glide to their new places
  - [Crossfade Transition](../crossfade/) — the fade that carries the page content
  - [Elastic Transition](../elastic-transition/) — a spring that goes past and settles
- **README How it works:** delete the last sentence of the last paragraph, "A "show control points" toggle overlays the 12 vertices so the correspondence is visible." The rest is unchanged.
- **README Production notes:** unchanged
- **Category line:** `03.03 · Page Transitions`
- **Pager:** Previous: Shared Element Transition (`../shared-element-transition/`) · Next: Crossfade Transition (`../crossfade/`)
- **Final fix wave:** the pages that are not on show are `inert` (`showPage` sets it on all three pages and `navigate` on the two that swap), so a screen reader reads only the page on show and Tab cannot enter a hidden one. The name of the page on show carries `aria-current="page"` and the other two `"false"` (`updateNav`).

---

## crossfade — Crossfade Transition

- **Kind:** do it. The visitor clicks a page name; the pages fade across.
- **Description:** The old page fades out as the new one fades in. Best for calm page changes.
- **Step 1:** Click it · help line: "Click Work or About at the top of the box, or press Show me."
- **Player bar:** Show me · Reset · Slow motion (page)
- **Show me:**
  - The run goes from Home to Work, holds 1200ms after the fade ends (the `dur+50` timer, or the second `half+50` timer when the fades run one after the other), then goes back to Home.
  - This takes about 2.3s together, or 2.4s one after the other.
  - `hb:input` cancels the way back.
- **Reset:** yes. Home at once.
- **Slow motion:** multiplies `dur` by 3 (and so each half when the fades run one after the other), along with the `dur` and `half` parts of the timers.
- **Reduced motion:** the demo's rule `.page{transition:none!important}` and its `motionOk` branch stay: the pages swap at once. Show me swaps to Work and back.
- **Stage font:** site font.
- **Stage:**
  - The mini nav and the page area stay.
  - The frame loop `trackOp()` that fed the opacity readouts goes.
  - `.pstat b` stays `#58a6ff`.
  - Unused variables: `--dur` (the slider wrote it, but nothing read it) and `--ease` go.
  - Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Fade order | Choice buttons | Together · One after the other | Together | Together, both pages show at half strength midway. | `mode`: `'true'` / `'seq'` |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long the whole fade takes. | `dur`: 800 / 500 / 300 (ms) |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Feel | Choice buttons | Smooth · Gentle · Even | Gentle | Even keeps one steady pace, the plainest fade. | `ease`: `ease-out` / `ease-in-out` / `linear` (replaces `easeSel.value`) |

- **Removed:**
  - The note.
  - The Page, Outgoing and Incoming opacity readouts, and the frame loop that updated them.
  - The History log.
  - The Mode buttons. They become Fade order.
  - The Duration slider. It becomes Speed.
  - The Easing menu. It becomes Feel, and its `cubic-bezier(.2,.7,.3,1)` "Smooth" goes, because it looked almost the same as Ease out, which is now Smooth.
  - "← Return to Home". Reset replaces it.
- **Good for:** Tabs · Image galleries · Content swaps · Calm sites · **Avoid on:** Step-by-step flows
- **Prompt:**

  > Add a crossfade between [the pages or views you want to switch between]. Stack the old and the new page in exactly the same place, then fade the old one out and the new one in. When the two fades run together, both pages are half visible for a moment and blend; one after the other, a short blank moment falls between them. Nothing moves; only how see-through each page is changes. It is the calmest page change and suits content that has no order. If the visitor has reduced motion turned on, switch pages instantly. Match the settings listed below.

- **README What it is:** rewritten:

  > A crossfade switches pages by fading the old page out while the new one fades in, so for a moment both are half visible and blend into each other. That overlap is what makes it a crossfade: fading the old page out first and the new one in afterwards leaves a short blank moment instead. The demo can do both, so you can compare them.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Fade order | Together | Together overlaps the two fades so the pages blend; One after the other fades the old page out first, leaving a blank moment |
  | Speed | Normal | How long the whole change takes: slow is 800ms, normal 500ms and fast 300ms; one after the other gives each fade half of it |
  | Feel | Gentle | Gentle eases in and out; Smooth slows to a stop; Even keeps one steady pace, which reads most evenly for a pure fade |

- **README See also:** "Dissolve" becomes the page's real title.
  - [View Transitions API](../view-transitions-api/) — the browser's own fade between pages
  - [Dissolve Transition](../dissolve/) — the fade broken into tiles
  - [Slide Transition](../slide-transition/) — pages move sideways instead
  - [Blur Transition](../blur-transition/) — a blur joins the fade
- **README How it works:**
  - The sentence "A `requestAnimationFrame` loop samples both computed opacities live so you can watch them cross:" becomes "With Together, both pages get the same opacity transition and fade at once; with One after the other, each gets half the duration and the new page starts when the old one has gone. Both are ordinary CSS transitions on `opacity`:". The README names the two orders as the page does, not "simultaneous" and "sequential".
  - In the snippet, `easeSel.value` becomes `ease`, and the two comments read "Together: …" and "One after the other: …". In the One after the other part, `requestAnimationFrame(()=>requestAnimationFrame(()=>{ newEl.style.opacity='1'; }));` becomes these two lines:

    ```js
        void newEl.offsetWidth;                   // commit the transparent start
        newEl.style.opacity='1';
    ```

  - The One after the other part also sets each page's transition, as the page does; read literally, the pages would snap without these lines. ``oldEl.style.transition=`opacity ${half}ms ${ease}`;`` goes before `oldEl.style.opacity='0';`, and ``newEl.style.transition=`opacity ${half}ms ${ease}`;`` is the first line inside the timer.
  - The paragraph after the snippet uses the same two names: "With Together the outgoing page reaches ~0.5 … with One after the other the stage passes through a fully blank frame …".
  - The rest is unchanged.
- **README Production notes:** unchanged
- **Category line:** `03.04 · Page Transitions`
- **Pager:** Previous: Morph Transition (`../morph-transition/`) · Next: Slide Transition (`../slide-transition/`)
- **Final fix wave:** `rest()` sets `inert` on a page that is not on show, so a screen reader reads only the page on show and Tab cannot enter a hidden one; a page fading in becomes reachable when its fade ends, where `rest()` runs. The name of the page on show carries `aria-current="page"` and the other two `"false"` (`updateNav`). In the README's Production notes, the second bullet also uses the page's names for the two orders (it said "Simultaneous double-fade" and "Sequential"); it is the only change there.

---

## slide-transition — Slide Transition

- **Kind:** do it. The visitor clicks a page name; the pages slide.
- **Description:** Pages slide across, and going back slides the other way. Best for step flows.
- **Step 1:** Click it · help line: "Click Work or About at the top of the box, or press Show me."
- **Player bar:** Show me · Reset · Slow motion (page)
- **Show me:**
  - The run goes from Home to Work, then back to Home 1200ms after the slide ends (the `dur+stagger+50` timer).
  - With Forward and back, Work comes in from the right and Home comes back from the left, so the run shows both directions.
  - This takes about 2.3s.
  - `hb:input` cancels the way back.
- **Reset:** yes. Home at once; the other pages are parked at `translateX(100%)`, as today.
- **Slow motion:** multiplies `dur` and `stagger` by 3, along with those parts of the timer.
- **Reduced motion:** the demo's rule `.page{transition:none!important}` and its `motionOk` branch stay: the pages swap at once. Show me swaps to Work and back.
- **Stage font:** site font.
- **Stage:**
  - The mini nav and the page area stay.
  - `.pstat b` stays `var(--ui-accent)` (6.4:1 on the About page).
  - Unused variables: `--dur` and `--ease` go.
  - Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Direction | Choice buttons | Forward and back · Left to right · Right to left · Top to bottom | Forward and back | Forward and back reverses the slide when you go back. | `dirMode`: `'auto'` / `'ltr'` / `'rtl'` / `'vertical'` (read by `getDir()` in place of the menu) |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long each slide takes. | `dur`: 800 / 500 / 300 (ms) |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Feel | Choice buttons | Smooth · Springy · Even | Smooth | Springy goes a little past, then settles. | `ease`: `cubic-bezier(.2,.7,.3,1)` / `cubic-bezier(.34,1.56,.64,1)` / `linear` (replaces `easeSel.value`) |
| Gap between pages | Choice buttons | None · Small · Large | None | The new page starts a moment later, leaving a gap. | `stagger`: 0 / 80 / 160 (ms) |

- **Removed:**
  - The note.
  - The Page and Direction readouts and the History log.
  - The Direction mode menu. It becomes Direction.
  - The Duration slider. It becomes Speed.
  - The Easing menu. It becomes Feel, and Ease out goes, because it looked almost the same as Smooth.
  - The Stagger slider. It becomes Gap between pages.
  - "← Return to Home". Reset replaces it.
- **Good for:** Step-by-step flows · Checkout · Onboarding · Carousels · **Avoid on:** Unrelated pages
- **Prompt:**

  > Add slide transitions to [the pages or steps you want to move between]. When the visitor changes page, move the old page out of one side while the new page comes in from the other, like panels on a track. When the direction follows the navigation, going forward slides to the left and going back slides to the right, as phone apps do. Move the pages with transforms only, never by changing their position or size, and keep pages that are off screen from catching taps. If the visitor has reduced motion turned on, switch pages without sliding. Match the settings listed below.

- **README What it is:** rewritten:

  > A slide transition moves the old page out of one side while the new page comes in from the other, like panels on a track. When the direction follows the navigation — forward slides to the left, back slides to the right — it gives visitors a sense of where they are, as phone apps do. The demo can also always slide the same way, or slide down.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Direction | Forward and back | Forward and back slides left for the next page and right for the previous one; the other choices always slide the same way |
  | Speed | Normal | How long each slide takes: slow is 800ms, normal 500ms and fast 300ms; 300 to 500ms matches phone apps, longer drags |
  | Feel | Smooth | Smooth slows to a stop; Springy goes a little past and settles back; Even keeps one steady pace |
  | Gap between pages | None | How much later the new page starts: none, small (80ms) or large (160ms); a delay leaves a gap between the pages |

- **README See also:** "Crossfade" becomes the page's real title.
  - [View Transitions API](../view-transitions-api/) — the browser can slide pages too
  - [Zoom Transition](../zoom-transition/) — pages move in depth instead
  - [Crossfade Transition](../crossfade/) — pages fade instead of moving
  - [Elastic Transition](../elastic-transition/) — the slide with a springy finish
- **README How it works:**
  - In the snippet, `getDir()` reads `dirMode` in place of `dirMode.value`, and its first line (`const m=dirMode.value;`) goes, so its checks read `dirMode==='ltr'` and so on. `easeSel.value` becomes `ease`.
  - The snippet's `doTransition` takes the values it reads as the page's does, and defines the two pages it moves: its first line is `function doTransition(prev,next,dur,stagger,ease){`, followed by `  const oldEl=pages[prev], newEl=pages[next];`. Before, `oldEl`, `newEl`, `dur`, `stagger` and `ease` were not defined anywhere in it.
  - The `requestAnimationFrame(()=>requestAnimationFrame(()=>{ … }));` wrapper is replaced by a reflow, with the four lines it held following directly:

    ```js
      void newEl.offsetWidth;                                  // commit the parked position
      oldEl.style.transition=`transform ${dur}ms ${ease}`;
      newEl.style.transition=`transform ${dur}ms ${ease} ${stagger}ms`;
      oldEl.style.transform=`translate${dir}(${sign*100}%)`;   // both move the same way
      newEl.style.transform='translate(0,0)';
    ```

  - "A stagger control adds an optional delay on the incoming page so it trails the outgoing one slightly." becomes "The Gap between pages setting adds an optional delay on the incoming page so it trails the outgoing one."
- **README Production notes:** the bullet "**The double `requestAnimationFrame`** is required…" becomes "**Commit the parked position.** Reading `offsetWidth` after parking the new page off-screen makes the browser apply that position before the transition is switched on; without it the two writes merge and the new page jumps straight in with no slide." In the bullet "**Match direction to platform expectation.**", "The auto mode encodes this." becomes "The Forward and back setting encodes this." The rest is unchanged.
- **Category line:** `03.05 · Page Transitions`
- **Pager:** Previous: Crossfade Transition (`../crossfade/`) · Next: Zoom Transition (`../zoom-transition/`)
- **Final fix wave:** `rest()` sets `inert` on a page that is not on show (the pages parked to the right), so a screen reader reads only the page on show and Tab cannot enter a parked one. The name of the page on show carries `aria-current="page"` and the other two `"false"` (`updateNav`).

---

## zoom-transition — Zoom Transition

- **Kind:** do it. The visitor clicks a page name; the pages zoom.
- **Description:** The pages zoom as they swap, as if moving in depth. Best for opening details.
- **Step 1:** Click it · help line: "Click Work or About at the top of the box, or press Show me."
- **Player bar:** Show me · Reset · Slow motion (page)
- **Show me:**
  - The run goes from Home to Work, then back to Home 1200ms after the zoom ends (the `dur+50` timer): about 2.4s.
  - `hb:input` cancels the way back.
- **Reset:** yes. Home at once.
- **Slow motion:** multiplies `dur` by 3, along with that part of the timer.
- **Reduced motion:** the demo's rule `.page{transition:none!important}` and its `motionOk` branch stay: the pages swap at once, without scaling. Show me swaps to Work and back.
- **Stage font:** site font.
- **Stage:**
  - The mini nav and the page area stay.
  - `.pstat b` stays `var(--ui-accent)`.
  - Unused variables: `--dur` and `--ease` go.
  - Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Zoom style | Choice buttons | Zoom in · Zoom out · Pull through | Zoom in | Zoom in feels like arriving, zoom out like leaving. | `variant`: `'zoom-in'` / `'zoom-out'` / `'pull'` |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long the zoom takes. | `dur`: 900 / 550 / 330 (ms) |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Feel | Choice buttons | Smooth · Springy · Gentle | Smooth | Springy grows a little past full size, then settles. | `ease`: `cubic-bezier(.2,.7,.3,1)` / `cubic-bezier(.34,1.56,.64,1)` / `ease-in-out` (replaces `easeSel.value`) |

- **Removed:**
  - The note.
  - The Page, Old scale and New scale readouts, and the History log.
  - The Variant buttons. They become Zoom style.
  - The Duration slider. It becomes Speed.
  - The Easing menu. It becomes Feel, and Ease out goes, because it looked almost the same as Smooth.
  - "← Return to Home". Reset replaces it.
- **Good for:** Opening details · Galleries · Lightboxes · **Avoid on:** Step-by-step flows
- **Prompt:**

  > Add a zoom transition to [the pages or views you want to move between]. When the page changes, scale the old and the new page while one fades out and the other fades in, so the change seems to move through depth rather than across the screen. Zooming in, where the new page grows into place, feels like going deeper; zooming out feels like stepping back; a pull-through, where the new page rushes in from larger, feels like travelling forward. Scale with transforms only, and keep the fade so no hard edge shows. If the visitor has reduced motion turned on, swap pages without scaling. Match the settings listed below.

- **README What it is:** rewritten:

  > A zoom transition scales the pages as they fade, so the change seems to move through depth rather than across the screen. The direction carries meaning: zooming in feels like arriving or going deeper, zooming out like backing away, and a pull-through — where the new page rushes in from larger and settles — feels like travelling forward.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Zoom style | Zoom in | Zoom in grows the new page from 75% as the old one shrinks to 90%; Zoom out grows the old page past the frame as it fades; Pull through shrinks the old page to 70% while the new one settles from 130% |
  | Speed | Normal | How long the zoom and the fade take: slow is 900ms, normal 550ms and fast 330ms |
  | Feel | Smooth | Smooth slows to a stop; Springy grows a little past full size and settles; Gentle eases in and out |

- **README See also:** "Portal Zoom" becomes the page's real title.
  - [View Transitions API](../view-transitions-api/) — the browser can zoom pages too
  - [Portal / Tunnel Zoom](../portal-zoom/) — the next page opens out of a clicked circle
  - [Slide Transition](../slide-transition/) — pages move sideways instead
  - [Shared Element Transition](../shared-element-transition/) — one picture grows into the next page
- **README How it works:**
  - The first paragraph's "then on the next frame both transition" becomes "then both transition".
  - In the snippet, `requestAnimationFrame(()=>requestAnimationFrame(()=>{` and its closing `}));` go. A reflow line goes in their place, before the three lines they held:

    ```js
    void n.offsetWidth;                                       // commit the start scales
    ```

  - The last paragraph's "and the double `requestAnimationFrame` ensures the start scale is painted before the transition kicks off" becomes "and reading `offsetWidth` makes the browser apply the start scale before the transition begins".
- **README Production notes:** unchanged
- **Category line:** `03.06 · Page Transitions`
- **Pager:** Previous: Slide Transition (`../slide-transition/`) · Next: Flash / Light Leak Transition (`../flash-transition/`)

---

## flash-transition — Flash / Light Leak Transition

- **Kind:** do it. The visitor clicks a page name; a flash hides the change.
- **Description:** A burst of light hides the moment the page changes. Best for bold, lively sites.
- **Step 1:** Click it · help line: "Click Work or About at the top of the box, or press Show me."
- **Player bar:** Show me · Reset · Slow motion (page)
- **Show me:**
  - The run goes from Home to Work, then back to Home 1200ms after the flash has faded (the `flashOut` timer): about 2.2s.
  - That is two flashes about 1.7s apart, well under the limit of three flashes a second.
  - `hb:input` cancels the way back.
- **Reset:** yes. Home at once. The overlay's transition is turned off, its opacity set to 0 and `blur-on` removed.
- **Slow motion:** multiplies `flashIn` and `flashOut` by 3, along with their timers.
- **Flash rate:** never more than two flashes a second, however the visitor presses (WCAG 2.3.1, level A, allows three; the floor keeps a margin, because a flash that Show me or Reset cuts short peaks where it is cut, which can bring the peaks of two flashes closer together than their starts).
  - No rise starts less than 500ms after the previous rise began (`MIN_CYCLE`). The page keeps the time of the last rise (`lastRise`).
  - A change asked for sooner waits, with the overlay at 0 and the pages unchanged, and its rise starts when the 500ms are over. `settle()` cancels a waiting rise, and the next change measures from the same `lastRise`, so no input can start two rises too close together. This covers page names, Show me (clicked, or held with the key repeating) and Reset followed by a page name.
  - `settle()` still puts the demo at rest at once (the overlay is at 0 immediately); only a new rise waits. A waiting rise belongs to the change under way, so `hb:input` does not cancel it.
  - In normal use the wait is not noticed: nothing waits at Normal (520ms a flash) or Slow (830ms), a Show me run holds 1200ms between its flashes, and at Fast (310ms a flash) a page name clicked right after a flash waits at most 190ms. It matters when Show me or Reset is pressed over and over. The fade-out timer stays `flashOut`.
- **Reduced motion:** the demo's rule `#flash-overlay{display:none}` and its `motionOk` branch stay: the pages swap at once with no flash. Show me swaps to Work and back.
- **Stage font:** site font.
- **Stage:**
  - The mini nav, the page area and `#flash-overlay` stay.
  - The frame this demo waited for before the fade-out goes: at the peak, the page swap and the fade-out happen in the same timer callback. The fade-out's own `transition` is set in the same step as its new opacity, which is enough for the browser to use it.
  - The pages keep their own sizes (`.ph` up to 40px, `.pp` 13px at `.55`, 5.7:1).
  - The old phone rule `.stage{flex:0 0 auto}` goes with the old layout.
  - `.pstat b` stays `var(--ui-accent)`.
  - Unused variables: `--flash-in` and `--flash-out` go; `--flash-color` stays.
  - Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Flash color | Swatches (these four, each with its name as its `aria-label`) | White · Gold · Cyan · Red | White | White looks like a camera flash; colors, a light leak. | `--flash-color`: `#ffffff` / `#f5d78e` / `#7ae8f0` / `#f07a7a` |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How fast the flash rises and fades. | `flashIn`: 320 / 200 / 120 and `flashOut`: 510 / 320 / 190 (ms) |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Flash strength | Choice buttons | Full · Strong · Soft | Full | Below full, the page change shows through. | `intensity`: 1 / 0.75 / 0.5 |
| Blurs the flash | Switch | on / off | off | Softens the flash's edges into a glow. | `blurTog.checked`: the overlay gets `blur-on` during the flash / does not |

- **Removed:**
  - The note.
  - The Page and Stage readouts, the enter, peak and exit timeline, and the History log.
  - The four colour squares, which were `div`s with `role="button"`. They become the Flash color swatches, which are real buttons.
  - The Flash-in duration and Flash-out duration sliders. They become Speed, which keeps the fade 1.6 times as long as the rise.
  - The Intensity slider. It becomes Flash strength.
  - "Add blur during flash". It becomes Blurs the flash.
  - "← Return to Home". Reset replaces it.
- **Good for:** Product launches · Music and fashion · Photo stories · **Avoid on:** Frequent page changes · Calm sites
- **Prompt:**

  > Add a flash transition to [the pages or scenes you want to switch between]. Cover the content with a full-size colored layer that rises to its peak, swap the page while it is covered, then fade the layer away to reveal the new page, like a burst of light hiding a cut in a film. At full strength the change is completely hidden. Let the fade-out take a little longer than the rise. Keep flashes rare, never several in one second, to protect people who are sensitive to flashing light. If the visitor has reduced motion turned on, switch pages with no flash. Match the settings listed below.

- **README What it is:** rewritten:

  > A flash transition hides a page change inside a burst of light. A colored layer covers the page and rises to full strength, the page is swapped while it is covered, and the layer then fades away to reveal the new page. The eye reads it as one bright moment, so the swap itself is never seen — the same trick films use to hide a cut.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Flash color | White | White reads as a camera flash; gold, cyan and red read as a colored light leak |
  | Speed | Normal | How fast the flash rises and fades: slow is 320ms up and 510ms down, normal 200ms and 320ms, fast 120ms and 190ms; the fade is always a little longer than the rise |
  | Flash strength | Full | How solid the flash gets: full hides the page change completely; strong (75%) and soft (50%) let it show through |
  | Blurs the flash | off | Softens the flash's edges into a glow |

- **README See also:** "Crossfade" and "Dissolve" become the pages' real titles.
  - [Crossfade Transition](../crossfade/) — the plain fade this dresses up
  - [Dissolve Transition](../dissolve/) — tiles hide the change instead
  - [Blur Transition](../blur-transition/) — a blur hides the change instead
  - [Portal / Tunnel Zoom](../portal-zoom/) — the next page opens out of a clicked circle
- **README How it works:**
  - In the snippet, the `requestAnimationFrame(() => {` line and its closing `});` go. The two fade-out lines they held stay in the timer callback, right after the page swap.
  - The sentence "The swap is deferred to a `requestAnimationFrame` after the class change so the browser commits the new transition before starting the fade-out." becomes "The fade-out sets its own transition in the same step as the new opacity, so it runs over `flashOut` rather than `flashIn`."
  - One sentence follows it: "No flash starts less than half a second after the previous one began, whatever is pressed (page names, Show me or Reset), so the demo never flashes more than twice a second; a change asked for sooner waits for that moment with the overlay clear."
- **README Production notes:** unchanged
- **Category line:** `03.07 · Page Transitions`
- **Pager:** Previous: Zoom Transition (`../zoom-transition/`) · Next: Blur Transition (`../blur-transition/`)

---

## blur-transition — Blur Transition

- **Kind:** do it. The visitor clicks a page name; the pages blur across.
- **Description:** The old page blurs away and the new one comes into focus. Best for photo sites.
- **Step 1:** Click it · help line: "Click Work or About at the top of the box, or press Show me."
- **Player bar:** Show me · Reset · Slow motion (page)
- **Show me:**
  - The run goes from Home to Work, then back to Home 1200ms after the new page is sharp (the `dur+50` timer): about 2.9s.
  - `hb:input` cancels the way back.
- **Reset:** yes. Home at once.
- **Slow motion:** multiplies `dur` by 3: both halves, the swap point, and the timers.
- **Reduced motion:** the demo's rule `.page{transition:none!important;filter:none!important}` and its `motionOk` branch stay: the pages swap at once, sharp. Show me swaps to Work and back.
- **Stage font:** site font.
- **Stage:**
  - The mini nav and the page area stay.
  - The frame loop `trackBlur()` that fed the blur readout goes.
  - `.pstat b` stays `var(--ui-accent)`.
  - Unused variables: `--dur`, `--ease` and `--max-blur` go.
  - Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| How blurry it gets | Choice buttons | Slight · Medium · Heavy | Medium | Heavy blur is costly for the browser to draw. | `maxBlur`: 8 / 20 / 35 (px) |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long each half, blurring and sharpening, takes. | `dur`: 650 / 400 / 250 (ms) |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Fades as it blurs | Switch | on / off | on | Fading as well hides the moment the pages swap. | `fadeTog.checked`: the pages fade as they blur / only blur |
| Overlaps the two halves | Switch | on / off | off | The new page sharpens while the old one still blurs. | `overlapTog.checked`: the swap comes at half of Speed / at the end of the blur |
| Feel | Choice buttons | Smooth · Gentle · Even | Gentle | Gentle feels like a camera pulling focus. | `ease`: `ease-out` / `ease-in-out` / `linear` (replaces `easeSel.value`) |

- **Removed:**
  - The note.
  - The Page and Blur readouts, the frame loop that updated them, and the History log.
  - The Max blur slider. It becomes How blurry it gets, with the steps of Blur In.
  - The Stage duration slider. It becomes Speed.
  - The Easing menu. It becomes Feel.
  - "Overlap stages (faster)" and "Blur + fade (vs blur only)". They become the two switches.
  - "← Return to Home". Reset replaces it.
- **Good for:** Photo sites · Film and editorial · Portfolios · **Avoid on:** Self-playing slideshows · Low-end phones
- **Prompt:**

  > Add a blur transition to [the pages or views you want to switch between]. When the page changes, blur the old page until it is out of focus, bring in the new page just as blurred, then sharpen it into focus, like a camera pulling focus from one subject to another. Fading while blurring hides the moment of the swap. Blur is costly for the browser to draw, so use it only on changes the visitor starts, never on anything that repeats by itself, and remove the blur completely when it ends. If the visitor has reduced motion turned on, switch pages without blurring. Match the settings listed below.

- **README What it is:** rewritten:

  > A blur transition takes the old page out of focus until it disappears, then brings the new page in from a blur to sharp. It looks like a camera pulling focus from one subject to another, so the change reads as a shift of attention rather than a hard cut.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | How blurry it gets | Medium | How much the pages blur at the midpoint: slight is 8px, medium 20px and heavy 35px; above about 30px it is heavy for the browser and can look muddy |
  | Speed | Normal | How long each half takes, blurring out and then sharpening in: slow is 650ms, normal 400ms and fast 250ms |
  | Fades as it blurs | on | Fades each page as it blurs, which hides the swap; off, the pages stay solid and only blur |
  | Overlaps the two halves | off | Starts sharpening the new page halfway through the blur, so the change takes a quarter less time |
  | Feel | Gentle | Gentle feels like a controlled focus pull; Smooth snaps into focus sooner; Even keeps one steady pace |

- **README See also:** "Crossfade", "Flash / Light Leak" and "Dissolve" become the pages' real titles.
  - [Crossfade Transition](../crossfade/) — the plain fade underneath the blur
  - [Flash / Light Leak Transition](../flash-transition/) — a burst of light hides the change
  - [Dissolve Transition](../dissolve/) — tiles hide the change
  - [Zoom Transition](../zoom-transition/) — scale shifts attention instead of focus
- **README How it works:**
  - "forced to commit over two animation frames, and only then animated to sharp" becomes "forced to commit with a reflow, and only then animated to sharp".
  - In the snippet, the `requestAnimationFrame(() => requestAnimationFrame(() => {` line and its closing `}));` go. A reflow line goes in their place, before the two lines they held:

    ```js
        void n.offsetWidth;                                        // commit the blurred start
    ```

  - The sentence "An "overlap" option starts the incoming sharpen at 50% of the outgoing blur instead of waiting for it to finish, cutting the total time roughly in half while the two stages cross." becomes "The Overlaps the two halves setting starts the incoming sharpen at 50% of the outgoing blur instead of waiting for it to finish, cutting the total time by about a quarter while the two halves cross."
- **README Production notes:** the bullet "**The double `requestAnimationFrame`.** …" becomes "**Commit the start state.** Setting the pre-blur with `transition: none` and then turning the transition on needs a forced reflow in between (reading `offsetWidth`); without it the browser merges the two writes and the page pops in sharp." The rest is unchanged.
- **Category line:** `03.08 · Page Transitions`
- **Pager:** Previous: Flash / Light Leak Transition (`../flash-transition/`) · Next: Elastic Transition (`../elastic-transition/`)

---

## elastic-transition — Elastic Transition

- **Kind:** do it. The visitor clicks a page name; the new page springs into place.
- **Description:** The new page slides in, goes too far and springs back. Best for playful apps.
- **Step 1:** Click it · help line: "Click Work or About at the top of the box, or press Show me."
- **Player bar:** Show me · Reset · Slow motion (page)
- **Show me:**
  - The run goes from Home to Work and holds 1200ms after the transition ends (the `dur+50` timer on the planned path, or the moment the live spring settles), then goes back to Home.
  - This takes about 3.1s either way: the planned path's bounce lasts 900ms at Normal (its end timer waits 950ms), and at Normal and Medium the live spring settles in about 0.8s after its 100ms start delay.
  - `hb:input` cancels the way back.
  - The spring's frame id `rafId` and its 100ms start timer, now kept at page level and started through `later()`, let `settle()` stop a spring under way.
- **Reset:** yes. Home at once.
- **Slow motion:**
  - Planned path: the keyframe animations' `dur` and the timer that waits for them are multiplied by 3.
  - Live spring: the old page's 300ms slide-out and the 100ms start delay are multiplied by 3, and the spring's time step is divided by 3 (`dt`, after its 50ms limit), so the spring moves at a third of its speed.
- **Reduced motion:** the demo's rule `.page{transition:none!important;animation:none!important}` and its `motionOk` branch stay: the pages swap at once. Show me swaps to Work and back.
- **Stage font:** site font.
- **Stage:**
  - The mini nav and the page area stay, and so does the `<style id="kf-style">` the planned path writes its keyframes into.
  - The spring graph canvas goes.
  - `.pstat b` stays `var(--ui-accent)`.
  - Unused variables: none.
  - Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| How it bounces | Choice buttons | Planned path · Live spring | Planned path | A planned path is cheap; a live spring feels more physical. | `mode`: `'css'` / `'spring'` |
| Bounce size | Choice buttons | Small · Medium · Large | Medium | How far the page goes past its place before settling. | planned path: `overshoot` 30 / 60 / 100 (passed to `buildKF()`); live spring: `damping` from the table below |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How quickly the page springs into place. | planned path: `dur` 1400 / 900 / 550 (ms); live spring: `stiffness` 70 / 180 / 500 |

**More options**

None: leave out the `details.hb-options` block.

Live-spring damping, measured with the demo's own spring loop. The loop takes one step per frame at 60 frames a second: the first frame has no time step, and the loop stops when position and speed are both under 0.5. A loop that steps once per frame damps much more than the textbook formula predicts, so each value was found by running it. For each speed and size, the whole number shown gives the overshoot nearest the planned path's for the same size (3.6%, 7.2% and 12% of the width); the overshoot it gives is in brackets. The spring settles within 1.3s. Normal and Medium become 180 and 16 (owner decision): today's 20 goes only 1.1% past its place, which barely shows. At 120 frames a second, or in slow motion, the steps are smaller and every bounce is a little larger (up to 6.7%, 10.7% and 13.9% for Small, Medium and Large); the three sizes stay apart. At 30 frames a second the steps are larger and Small barely bounces (1.4%, 1.2% and 0% at Slow, Normal and Fast); the README's Production notes say so. Every value lies inside the old sliders' ranges (stiffness 50–500, damping 5–50).

| Bounce size | Slow (70) | Normal (180) | Fast (500) |
|---|---|---|---|
| Small | 12 (2.6%) | 18 (3.5%) | 28 (3.9%) |
| Medium | 10 (8.1%) | 16 (7.2%) | 25 (7.9%) |
| Large | 9 (12.0%) | 14 (12.3%) | 23 (11.2%) |

- **Removed:**
  - The note.
  - The Page readout and the History log.
  - The Mode buttons. They become How it bounces.
  - The Overshoot intensity and Duration sliders, and the Stiffness and Damping sliders. Bounce size and Speed now set both ways of bouncing, so no setting has to hide when the other way is chosen.
  - The spring graph, a readout.
  - "← Return to Home". Reset replaces it.
- **Good for:** Playful apps · Panels and drawers · Games · **Avoid on:** Formal sites
- **Prompt:**

  > Add an elastic transition to [the pages or panels you want to move between]. The new page should slide in from the side, go a little past its place and spring back before settling, as if pulled by a rubber band, while the old page slides away. The bounce can be planned ahead as a fixed path, which is cheap, or worked out live with a simple spring, which can react if the visitor interrupts it; with a live spring, limit each time step so one slow frame cannot throw it off. If the visitor has reduced motion turned on, switch pages without movement. Match the settings listed below.

- **README What it is:** rewritten:

  > An elastic transition slides the new page in so that it goes a little past its place and springs back before settling, instead of easing to a stop. The overshoot gives the movement weight, as if the page were pulled into place by a rubber band. The bounce can be planned ahead as a fixed path, which is cheap, or worked out live by simulating a spring, which feels physical.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | How it bounces | Planned path | A planned path plays a bounce decided in advance, which is cheap; a live spring works out the movement on every frame, which feels physical and can react to interruptions |
  | Bounce size | Medium | How far the page goes past its place before settling; with a live spring, a bigger bounce means less damping, so it swings for longer |
  | Speed | Normal | How quickly it settles: on the planned path slow is 1400ms, normal 900ms and fast 550ms; with a live spring, a faster speed is a stiffer spring |

- **README See also:**
  - [Slide Transition](../slide-transition/) — the plain slide this adds a spring to
  - [Zoom Transition](../zoom-transition/) — pages move in depth instead
  - [FLIP Technique](../flip-technique/) — elements glide to their new places
  - [Morph Transition](../morph-transition/) — a shape changes between pages
- **README How it works:**
  - The first paragraph names the two ways as on the page: "This demo offers two modes. The CSS mode writes" becomes "This demo offers two ways to bounce. The planned path writes"; "with the overshoot amount scaled by a control" becomes "with the overshoot amount set by Bounce size"; and "The JS mode integrates" becomes "The live spring integrates".
  - In the snippet, `let pos = -100, vel = 0, target = 0;           // start off-screen right` becomes `let pos = 100, vel = 0, target = 0;            // start off-screen right`, as in the demo.
  - In the last paragraph, the sentence "Recorded positions are plotted to a small canvas so the overshoot-and-settle curve is visible." is replaced by: "On the demo page, Speed and Bounce size set both ways of bouncing: the planned path's length (1400, 900 or 550ms) and overshoot (30, 60 or 100), or the live spring's stiffness (70, 180 or 500) and damping. The damping values were found by running this loop at 60 frames a second, so the spring goes about as far past its place as the planned path does (about 3.6%, 7.2% and 12% of the width). Moving the spring one step per frame calms it more than the usual spring formula expects, so the values were measured rather than worked out."
- **README Production notes:** a bullet goes in after "**Clamp the time step.**": "**Frame rate.** The demo moves its spring one step per frame, so how far it bounces depends on the frame rate: at 30 frames a second the small bounce hardly shows, and at 120 it is a little larger. A spring that steps by time instead — fixed small steps, as many as the time that has passed needs — bounces the same at any frame rate." The rest is unchanged.
- **Category line:** `03.09 · Page Transitions`
- **Pager:** Previous: Blur Transition (`../blur-transition/`) · Next: Portal / Tunnel Zoom (`../portal-zoom/`)

---

## portal-zoom — Portal / Tunnel Zoom

- **Kind:** do it. The visitor clicks a portal or a page name; the next page opens out of it.
- **Description:** The next page opens out of a circle you click. Best for big reveals.
- **Step 1:** Click it · help line: "Click the round portal or a page name, or press Show me."
- **Player bar:** Show me · Reset · Slow motion (page)
- **Show me:**
  - The run clicks the portal of the page on show: the next page opens out of it. On arrival that is Home's portal, "Enter gallery", which opens the Gallery page.
  - 1200ms after the opening ends (the `dur+50` timer), it goes back to the page it started from the way a click on that page's name does, with the circle opening from the middle of the page area.
  - This takes about 3.7s.
  - `hb:input` cancels the way back.
- **Reset:** yes. Home at once; every page's `clipPath`, `transition` and `zIndex` are cleared.
- **Slow motion:** multiplies `dur` by 3, along with that part of the timer.
- **Reduced motion:** the demo's `motionOk` branch stays: the pages swap at once. Its CSS rule `#zoom-mask{transition:none!important}` goes with the mask. Show me swaps to Gallery and back.
- **Stage font:** site font.
- **Stage:**
  - The mini nav, the page area and each page's portal stay.
  - The unused `#zoom-mask` goes, with its CSS and its `--dur` and `--ease` variables. It never shows: the reveal is the incoming page's own `clip-path`.
  - **The portal moves to the top-right corner.** In the shorter shared stage its old bottom-right spot covers the Gallery grid (the grid reaches 226px of the laptop's 260px page area, and the portal starts at 148px). Its position and size move from the inline style into the `.portal` rule, and only the page's portal colour stays inline:
    - computers and tablets: `top:24px;right:24px;width:80px;height:80px`;
    - phones (`@media (max-width:600px)`): `top:16px;right:16px;width:64px;height:64px`.
  - The portal's label moves from its inline style (9px at `opacity:.6`) into the existing, unused `.portal-label` rule, which becomes `font-size:11px;opacity:.8;text-align:center;padding:4px;line-height:1.3;pointer-events:none`: 4.1:1 on the Gallery portal becomes 5.9:1.
  - The Home page keeps its line "Click the portal to travel to the gallery."
  - `--hb-stage-h-phone:360px`: at 320px wide, the About heading reaches under a top-right portal on the 300px stage; 360px clears it.
  - `.pstat b` stays `var(--ui-accent)`.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Portal shape | Choice buttons | Circle · Square | Circle | A circle feels like a tunnel; a square like a window. | `shape`: `'circle'` / `'square'` (read at each navigation in place of `shapeSel.value`) |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | Slower reads as travel; too fast looks like a wipe. | `dur`: 1900 / 1200 / 700 (ms) |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Feel | Choice buttons | Speeds up · Smooth · Gentle · Even | Speeds up | Speeding up feels like diving in. | `ease`: `ease-in` / `ease-out` / `ease-in-out` / `linear` (replaces `easeSel.value`) |

- **Removed:**
  - The note.
  - The Page and Portal readouts and the History log.
  - The Portal shape menu. It becomes choice buttons.
  - The Duration slider. It becomes Speed.
  - The Easing menu. It becomes Feel.
  - The unused zoom mask.
  - "← Return to Home". Reset replaces it.
- **Good for:** Big reveals · Galleries · Story chapters · Calls to action · **Avoid on:** Everyday navigation
- **Prompt:**

  > Add a portal transition to [the element that should open into the next page]. When the visitor clicks it, show the next page through an opening that starts as a point at the element's center and grows until the new page fills the view, as if diving through a window. Put the new page underneath first and only grow the visible opening, measuring the element's position at the moment of the click so the opening starts exactly there. Make the opening big enough at the end to reach the corners. If the visitor has reduced motion turned on, show the new page at once. Match the settings listed below.

- **README What it is:** rewritten:

  > A portal zoom treats a small element on the page as a window into the next page. Clicking it opens a circle, or a square, from the element's center that grows until the new page fills the whole view, so it feels like diving through the portal rather than jumping to a new page. The new page is already there underneath; the growing opening only reveals it.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Portal shape | Circle | A circle feels like a tunnel; a square opens like a window |
  | Speed | Normal | How long the opening takes to fill the view: slow is 1900ms, normal 1200ms and fast 700ms; too fast and it becomes a plain wipe |
  | Feel | Speeds up | Speeds up feels like diving in; Smooth slows at the end, like pulling back; Gentle eases in and out; Even keeps one steady pace |

- **README See also:** "Flash / Light Leak" becomes the page's real title.
  - [Zoom Transition](../zoom-transition/) — the whole page scales instead
  - [Shared Element Transition](../shared-element-transition/) — a picture grows into the next page
  - [Flash / Light Leak Transition](../flash-transition/) — a burst of light hides the change
  - [Morph Transition](../morph-transition/) — a shape changes between pages
- **README How it works:** in the snippet, `easeSel.value` becomes `ease`. The rest is unchanged.
- **README Production notes:** unchanged
- **Category line:** `03.10 · Page Transitions`
- **Pager:** Previous: Elastic Transition (`../elastic-transition/`) · Next: Dissolve Transition (`../dissolve/`)

---

## dissolve — Dissolve Transition

- **Kind:** do it. The visitor clicks a page name; tiles dissolve the old page.
- **Description:** The page breaks into tiles that give way to the next. Best for photo galleries.
- **Step 1:** Click it · help line: "Click Work or About at the top of the box, or press Show me."
- **Player bar:** Show me · Reset · Slow motion (page)
- **Show me:**
  - The run goes from Home to Work, then back to Home 1200ms after the transition ends. It ends at the swap, or when the tiles have faded away if Dissolves both ways is on.
  - This takes about 2.2s, or 2.9s with Dissolves both ways.
  - `hb:input` cancels the way back.
- **Reset:** yes. Home at once, with the tile overlay emptied.
- **Slow motion:** multiplies `dur` by 3, which stretches the tiles' fades and delays, the swap point, and the clean-up timer.
- **Phones:** the 256 tiles of Small make the frame that starts a dissolve take 50 to 120ms of the page's own work at 4× CPU on a 375px phone, a freeze of about nine frames, so CLAUDE.md's reduced-quality fallback applies. On a phone (the lane's rule: a viewport up to 600px wide or up to 500px tall, a sideways phone included) Small draws a 10 by 10 grid; Medium and Large stay as they are, and computers and tablets keep 16 by 16. `doDissolve()` reads it when the dissolve starts: `const n=matchMedia('(max-width:600px),(max-height:500px)').matches?Math.min(gran,10):gran;`, and passes `n` to `buildTiles()`.
- **Reduced motion:** the demo's rule `.page{transition:opacity 300ms linear}.dtile{transition:none!important}` and its `motionOk` branch stay: the pages cross in a plain 300ms fade, with no tiles. Show me fades to Work and back.
- **Stage font:** site font.
- **Stage:**
  - The mini nav, the page area and the tile overlay stay.
  - No teaching outline on the tiles.
  - `.pstat b` stays `var(--ui-accent)`.
  - Unused variables: none.
  - Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Pattern | Choice buttons | Random · Diagonal · From the middle | Random | The order in which the tiles appear. | `pattern`: `'random'` / `'diagonal'` / `'radial'` (read by `getDelays()` in place of `styleSel.value`) |
| Tile size | Choice buttons | Small · Medium · Large | Medium | Small tiles look like grain; large ones like blocks. | `gran`: 16 / 8 / 4 (tiles on each side); on a phone Small draws 10 (see Phones), read as `n` when a dissolve starts |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long the tiles take to cover the page. | `dur`: 1300 / 800 / 500 (ms) |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Dissolves both ways | Switch | on / off | off | The tiles also fade away to reveal the new page. | `biTog.checked`: after the swap, the tiles fade out in the same pattern / vanish at once |

- **Removed:**
  - The note.
  - The Page readout and the History log.
  - The Dissolve style menu. It becomes Pattern.
  - The Granularity slider. It becomes Tile size.
  - The Duration slider. It becomes Speed.
  - "Dissolve in + out (both stages)". It becomes Dissolves both ways.
  - "Show tile mask", a teaching overlay that outlined each tile in red.
  - "← Return to Home". Reset replaces it.
- **Good for:** Photo galleries · Slideshows · Retro and game sites · **Avoid on:** Everyday navigation
- **Prompt:**

  > Add a dissolve transition to [the pages or images you want to switch between]. Lay a grid of tiles over the old page and fade each tile in at a slightly different moment, following a pattern such as random, a diagonal sweep or rings from the middle, so the old page breaks up instead of fading evenly. Swap the page while the tiles cover it, then remove the tiles, or fade them away in the same pattern to reveal the new page. Give each tile its own delay and let the browser run the fades. If the visitor has reduced motion turned on, use a short, plain fade instead. Match the settings listed below.

- **README What it is:** rewritten:

  > A dissolve breaks a page change into a grid of tiles. Each tile fades in over the old page at a slightly different moment, so the old page seems to break up into grain or blocks rather than fading evenly. The order of the tiles — random, a diagonal sweep or rings from the middle — gives the dissolve its texture.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Pattern | Random | The order the tiles appear in: random looks like grain, diagonal sweeps from one corner, and from the middle spreads out in rings |
  | Tile size | Medium | How big the tiles are: small is a 16 by 16 grid (10 by 10 on phones), medium 8 by 8 and large 4 by 4; small tiles come close to a smooth fade |
  | Speed | Normal | How long the tiles take: slow is 1300ms, normal 800ms and fast 500ms; the page swaps at 60% of it, under the tiles |
  | Dissolves both ways | off | Also fades the tiles away in the same pattern to reveal the new page, instead of removing them at once |

- **README See also:** "Crossfade" and "Flash / Light Leak" become the pages' real titles.
  - [Crossfade Transition](../crossfade/) — an even fade with no tiles
  - [Flash / Light Leak Transition](../flash-transition/) — a burst of light hides the change
  - [Blur Transition](../blur-transition/) — a blur hides the change
  - [Slide Transition](../slide-transition/) — pages move instead of dissolving
- **README How it works:** the radial part of the snippet does not match the demo, which was corrected so the corners land at 1. Replace the radial part at the end of `getDelays()` (the comment `// radial: distance from the grid center` and the `return` under it) with:

  ```js
    // radial: tile-centre distance, normalised so the corners land at 1
    return Array.from({length: total}, (_, i) => {
      const r = Math.floor(i / n) - (n - 1) / 2, c = i % n - (n - 1) / 2;
      return Math.sqrt(r * r + c * c) / (Math.SQRT2 * (n - 1) / 2);
    });
  ```

  The rest is unchanged.
- **README Production notes:** unchanged
- **Category line:** `03.11 · Page Transitions`
- **Pager:** Previous: Portal / Tunnel Zoom (`../portal-zoom/`) · Next: FLIP Technique (`../flip-technique/`)

---

## flip-technique — FLIP Technique

- **Kind:** do it. The visitor clicks a layout button; the cards glide to their new places.
- **Description:** Cards glide to their new places when the layout changes. Best for sorting lists.
- **Step 1:** Click it · help line: "Click a button above the cards, or press Show me."
- **Player bar:** Show me · Reset · Slow motion (page)
- **Show me:**
  - `settle()` here clears every card's inline `transform` and `transition`, so the cards sit in their real places, and sets `animating=false`.
  - The run then sorts the cards by size, as the Sort by size button does: every card moves from the starting order. If the cards are already in that order, it sorts them by color instead.
  - 1200ms after the glide ends (the `dur+50` timer), the cards glide back to the order they had before the run, through the same `doFlip()`.
  - The run keeps the current column layout. It takes about 2.3s. The stage, and with it the player bar, keeps one height through the run in every layout (see the grid minimum below).
  - `hb:input` cancels the way back.
- **Reset:** yes. The starting order (Atlas, Orbit, Prism, Lumen, Frame, Echo) in three columns, at once: `renderCards()` with no glide, and "3 columns" marked as the active layout.
- **Slow motion:** multiplies `dur` by 3, along with that part of the timer.
- **Reduced motion:** the demo's rule `.flip-card{transition:none!important}` and its `motionOk` branch stay: the cards jump to their new places. Show me sorts and restores them with no gliding.
- **Stage font:** site font.
- **Stage:**
  - The toolbar and the card grid stay; the Invert badges go (`.invert-badge` and each card's badge element).
  - Toolbar buttons (`.tb-btn`): 13px text, `padding:0 10px`, `min-height:44px` at every size, in `var(--ui-muted)`; the active layout stays in the accent colour.
  - Toolbar labels become plain words: "Shuffle", "Sort by color", "Sort by size", "3 columns", "2 columns", "List" (were "⟳ Shuffle", "3 cols", "2 cols"). The six fit on one line on computers and tablets and on two lines on 375px and 320px phones (measured).
  - `.card-meta` goes from `opacity:.5` to `.8`: 3.0:1 becomes 5.1:1 on the cards. `.card-num`, the large faint number, is decoration and stays.
  - **The cards get shorter** so the default layout fits the laptop's first screen: in `renderCards()`, 110px for tall cards and 86px for short ones (were 140px and 110px); list rows stay 56px.
  - `#card-grid` gets `min-height:var(--rows-h)`, with `--rows-h:230px`, the height of the three-column grid, and `--rows-h:350px` in two columns (`data-columns="2"`, which `renderCards()` sets on the grid), the height of that grid in the starting order, so a new order never changes the stage height. Sorted by size the two-column grid is only 326px: without its own minimum the player bar jumped up 24px when the first glide of a Show me run ended, and back down when the way back began. It also gets `align-content:start`. Without it the grid spreads any extra height over its rows. In a scratch grid in headless Chrome, a 440px min-height moved the second row from 120px down to 225px. Then Sort by size would space the rows apart, and the hold below would glide the cards to stretched rows and make them jump when it is released.
  - **`hb-grow` on the stage**, which replaces the old phone rule `.stage{height:auto;min-height:var(--stage-h)}`. 2 columns (350px of cards) and List (386px) are taller than any shared stage, so the stage grows while they are shown; the default three columns need 329px on a laptop. At 1366×657 that puts the player bar's bottom at about 651px, inside the 657px screen (measured with the shared stage).
  - **The grid keeps its height until a glide ends.** Otherwise a layout that gets shorter shrinks the stage at once (by 120px measured), and `.page-area{overflow:hidden}` clips the cards that start from the old lower rows:
    - 2 columns to 3: cards 5 and 6 start with 80 of their 86px and 104 of their 110px below the edge;
    - List to 3 columns: two cards start fully hidden;
    - List to 2 columns: the last card starts 74px hidden, because each card is drawn at its new size (here 110px) from its old list row.

    The hold is set in two steps:
    - In `doFlip()`, before `renderCards()`, set `grid.style.minHeight` to the grid's current height (`grid.offsetHeight + 'px'`), so the page never gets shorter mid-change.
    - After the Last measurements, raise it to the larger of two heights, if that is more than the grid now has: the lowest point any card starts its glide from (the card's old top, from First, measured from the grid's top, plus its new height), and the new layout's own minimum (`--rows-h`, read from the grid's computed style). List to 3 or 2 columns needs 440px, 54px more than the list; with the current height alone the last card would lose 38px for a few frames. The minimum matters when 2 columns is entered from a shorter layout with an order that is only 326px high: without it the stage would grow by 24px when the hold is released.

    With `align-content:start`, neither step moves a card. Clear the hold (`grid.style.minHeight=''`, back to the layout's own minimum, 230px or 350px) in the `dur+50` timer, in `settle()`, in Reset, and straight after `renderCards()` in the reduced-motion branch, where the cards jump at once. A layout that gets taller grows the stage at once, as before. A shorter one keeps the stage's height, or grows it for the glide, until the cards have landed, then the stage shrinks. No card is cut off at the bottom by the stage shrinking.
  - Unused variables: none.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long the cards take to glide into place. | `dur`: 800 / 500 / 300 (ms) |
| Feel | Choice buttons | Smooth · Springy · Even | Smooth | Springy goes a little past each place, then settles. | `ease`: `cubic-bezier(.2,.7,.3,1)` / `cubic-bezier(.34,1.56,.64,1)` / `linear` (replaces `easeSel.value`) |

**More options**

None: leave out the `details.hb-options` block.

- **Removed:**
  - The note.
  - The Layout and FLIP step readouts.
  - The Duration slider. It becomes Speed.
  - The Easing menu. It becomes Feel, and Ease out goes, because it looked almost the same as Smooth.
  - "Show Invert step", a teaching overlay that labelled the cards "INVERTED".
  - "Reset layout". Reset replaces it.
- **Good for:** Sorting and filtering · Card grids · Dashboards · Lists · **Avoid on:** Very long lists
- **Prompt:**

  > Animate layout changes in [the grid or list you want to rearrange] with the FLIP technique. Before the change, record where every item is. Apply the new order or layout so the items jump to their new places. Then shift each item back to where it was with a transform, and animate that shift away so the items glide to their real places. Only transforms animate, so it stays smooth even with many items. Match items across the change by a stable id. If the visitor has reduced motion turned on, let the items jump to their new places without gliding. Match the settings listed below.

- **README What it is:** rewritten:

  > FLIP, short for First, Last, Invert, Play, animates layout changes that CSS cannot animate by itself, such as sorting a grid or switching from columns to a list. The browser moves every item to its new place at once; each item is then shifted back to where it was and slides from there to its new place. It looks as if the items glide into the new layout, but only their position on screen is animated.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Speed | Normal | How long the cards take to glide: slow is 800ms, normal 500ms and fast 300ms; 300 to 600ms reads as deliberate |
  | Feel | Smooth | Smooth slows to a stop; Springy goes a little past each place and settles; Even keeps one steady pace |

- **README See also:**
  - [Shared Element Transition](../shared-element-transition/) — the same method for one element across pages
  - [Morph Transition](../morph-transition/) — a shape changes instead of moving
  - [Elastic Transition](../elastic-transition/) — a springy finish to the movement
  - [View Transitions API](../view-transitions-api/) — the browser can animate layout changes itself
- **README How it works:**
  - "**Play:** on the next frames, transition that transform to zero so the card glides to where it really is." becomes "**Play:** transition that transform to zero so the card glides to where it really is."
  - In the snippet, the PLAY block becomes:

    ```js
    // PLAY — apply the inverted positions, then animate the transform to zero
    grid.offsetWidth; // force reflow
    newCards.forEach(c => {
      c.style.transition = `transform ${dur}ms ${ease}`;
      c.style.transform = '';
    });
    ```

  - "The double `requestAnimationFrame` guarantees the inverted (start) state is committed before the transition to zero begins." becomes "Reading `offsetWidth` between Invert and Play makes the browser apply the inverted (start) positions before the transition to zero begins."
  - In the snippet, the INVERT block reads every card's rect before it writes anything, as the page does and as the Production notes' "Read then write, once" says: `const last = newCards.map(c => c.getBoundingClientRect());` before the loop, then `newCards.forEach((c, i) => { const f = first[c.id]; const dx = f.left - last[i].left, dy = f.top - last[i].top; …` inside it.
- **README Production notes:** unchanged
- **Category line:** `03.12 · Page Transitions`
- **Pager:** Previous: Dissolve Transition (`../dissolve/`) · Next: none
