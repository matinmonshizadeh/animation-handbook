# Micro-Interactions — Content Sheet, Part 2

This sheet decides, page by page, how the last fourteen Micro-Interactions pages (04.16 Tooltip Reveal to 04.29 Pull to Refresh, in home-page order) present their kind, settings, words and prompt on the guided-steps page. Part 1 (`2026-09-29-micro-content-part1.md`) covers 04.01 Hover State Animation to 04.15 Notification Badge Pulse. The conversion tasks of `2026-09-29-demo-page-rollout-parallel.md` follow each section exactly, together with "How to convert a page" in `2026-09-28-demo-page-rollout-text-typography.md`, the lessons in the rollout's Global Constraints and the do-it markup of `2026-09-29-demo-page-kinds-do-and-scroll.md`. Rotate In (`animations/02-entrance-and-exit/rotate-in/`) is the reference for everything a section does not mention.

Every page in this half is a **do-it** page: nothing moves until the visitor points, presses or drags, so none is a plays-once, loop or scroll page. Accordion and Pull to Refresh scroll inside their own box, but scrolling is not what they show, so they are do-it pages too; their stage keeps its own overflow. Every page keeps settings, so every page has a Try it step. The rollout spec's special case "click demos: Show me plays one click and returns to rest" applies to Modal Expand, Toast Notification and every Click it page here.

Every fit number in this sheet was measured in Chrome on the lane server, with each old demo put into the shared stage at the check tool's sizes (the stage is 960×380 at 1280×800, 960×327 at 1366×657, 692×440 at 768×1024, 343×300 at 375×812 and 288×300 at 320×640) and the site font.

## How to read a section

- **Kind** names the step 1 title: "Hover it", "Click it" or "Drag it". **Step 1 help line** is the page's own help line under it (the label Part 1 uses).
- **Try it help line** is the same on every do-it page: "Change a setting, then try it again or press Show me." (A do-it page replays nothing when a setting changes: the shared script's replay needs a Replay button. The new setting shows the next time the visitor tries the demo or presses Show me, except where a row says it applies to the stage at once.)
- **Show me** replaces the plays-once "Sequence": what one run does, its timeline, how it ends at rest and what `hb:input` does. Each timed step is written `later(step, movement, hold)` and counted from the moment Show me is pressed, at the default settings: the movement is the part of the wait that Slow motion stretches (a transition or animation the step waits for), and the hold is the part it never stretches. A step with no `later()` happens "at once". Each Slow motion line also gives the length of a slowed run, as in Part 1.
- **Sets in the demo** lists one value per choice, in the same order as the choices, and names the variable, class or function exactly as today's script has it.
- Switches in Try it keep their default in the markup (`checked` when the default is on), as on Rotate In. Only the player bar's Slow motion starts unchecked.
- **Speed** always reads Slow · Normal · Fast. Today's default is Normal; Slow is about 1.6 times and Fast about 0.6 times it, rounded.
- **Feel** uses the names shared with Part 1: Smooth (slows to a stop) is `ease-out`, Gentle (eases in and out) is `ease-in-out`, Even (one steady speed) is `linear`, and Springy goes a little past, then settles. A page's own old default curve keeps its exact value under the nearest name: Hamburger Menu Toggle's and Theme Toggle Morph's in-out curves are Gentle, and each Springy row keeps its page's own overshoot curve. The exact curve is in each row.
- **Category line:** the pages have none today. NN is the page's position on the home page, which its card already shows: `04.16 · Micro-Interactions` (Tooltip Reveal) to `04.29 · Micro-Interactions` (Pull to Refresh).
- **Accent:** every page keeps `--ui-accent:#ff9d5c`, which all 29 pages of the category already use.
- **Gray stage text:** `:root`'s `--ui-muted` becomes `#8a8a92` (the site's own muted gray), as on the converted Entrance & Exit pages. The old `#77777e` is 4.2:1 on the demo cards' `#111114` and 4.4:1 on the stage's `#0b0b0d`; the new gray is 5.5:1 and 5.7:1. Stage text below 11px goes up to 11px, as in Part 1; each section names the rules this changes. Other sizes stay.
- **Stage font:** every stage uses the site font. The shared stylesheet already maps `--disp` and `--mono` to it; each section still names the stage rules whose font changes (as the Text & Typography sheet did), including every literal `monospace`, which the shared stylesheet cannot map. On plain elements the `font-family` just goes. Stage buttons and inputs get `font-family:inherit` instead, as in Part 1, because a form control does not take the page's font by itself; the shared stylesheet sets no font on them.
- **Stage:** the page owns the stage's height, border and corners, so each demo's `.stage` rule loses `height`, `min-height`, `--stage-h`, `flex`, `min-width`, `border` and `border-radius`, and keeps what its content needs (display, alignment, gap, padding, background, `position`, `overflow`). A `.stage-wrap` wrapper goes. The old phone block goes, except the rules a section keeps. `hb-dots` is used on plain dark stages and left off where the stage paints its own full background; each section says which. No page here takes typed text as a setting, so none uses `hb-grow`.

## Do-it pages: Show me, Reset and `hb:input`

- **Body:** `<body class="hb" data-hb-kind="do" data-hb-autoplay>`. Step 1's title and help line come from the section; steps are numbered 1 to 3.
- **Player bar,** in this order: the Show me button exactly as in the do-it plan (`id="btn-demo"`, `data-hb-demo`); the Reset button exactly as in the do-it plan (`id="btn-reset"`, `data-hb-reset`), only where the section has one; then, only where the section has it, `<label class="hb-toggle"><input class="hb-switch" type="checkbox" role="switch" id="slow-tog" data-hb-slowmo="css" autocomplete="off"><span>Slow motion</span></label>`.
- **On arrival** the shared script presses Show me once, 400ms after load; under reduced motion it runs nothing, and Show me and Reset still work when pressed. Under reduced motion the Slow motion switch is grayed out by the shared script.
- **One run at a time,** with Part 1's helper, word for word, so the whole category runs Show me the same way. Every timer of a run goes through `later(fn, move, hold)`, which waits `move` (tripled while Slow motion is on, read when the timer is set) plus `hold`, which never stretches. Slow motion never stretches holds, Show me runs included: this is a rule for every kind of page. The listeners are registered at the top level of the page's inline script, and the page reaches the player controls by their ids, never by `data-hb-*`:

  ```js
  // Show me: one run at a time. Every timer of the run goes through later(); stopRun() cancels the whole run.
  // later(fn, move, hold) waits move*(slow?3:1) + (hold||0) ms: Slow motion triples the movement, never the hold.
  const slowTog=document.getElementById('slow-tog');      // only on pages with Slow motion
  let runTimers=[];
  function later(fn,move,hold){
    const slow=!!(slowTog&&slowTog.checked);
    const id=setTimeout(()=>{ runTimers=runTimers.filter(t=>t!==id); fn(); }, move*(slow?3:1)+(hold||0));
    runTimers.push(id);
  }
  function running(){ return runTimers.length>0; }
  function stopRun(){ runTimers.forEach(clearTimeout); runTimers=[]; /* plus what the section's "stops" line undoes */ }
  document.getElementById('btn-demo').addEventListener('click',()=>{ stopRun(); /* put the demo at rest, then play the steps with later() */ });
  document.addEventListener('hb:input',()=>{ if(running()) stopRun(); });
  ```

  In a section, `toRest()` is "put the demo at rest", the timeline gives the steps, and the "On `hb:input`" line says what `stopRun()` also undoes. A step written `later(close, Speed, 1500)` runs Speed + 1500ms after the press, or 3 × Speed + 1500ms while Slow motion is on. A run ends when its last timer has fired. Pages without Slow motion write every step as a hold, `later(step, 0, ms)`. The two drag pages (Swipe to Dismiss, Pull to Refresh) also draw a drag frame by frame: they keep its one pending frame in `runFrame`, their `running()` is also true while `runFrame` is set, and their `stopRun()` also does `cancelAnimationFrame(runFrame); runFrame=0`.
- **A run starts from rest.** When the visitor left the demo changed (a panel open, another option chosen), `toRest()` puts it back as it is on arrival without animating: the pieces' transitions are turned off inline, the resting state is set, `void el.offsetWidth` forces a reflow, and the inline transitions are cleared. Pressing Show me during a run starts it again from rest.
- **A run plays one example** of the interaction, about two to four seconds unless the section says otherwise, and ends at rest. It never moves the keyboard focus, never submits a form, never writes to the clipboard and never announces anything to screen readers that did not really happen.
- **`hb:input`** comes from the visitor's own `pointerdown`, `keydown`, `wheel` or `touchstart` inside the stage. Hovering sends none, so the two Hover it pages (Tooltip Reveal, Cursor Follower) and Star Rating, whose row previews on hover, also stop a run on a trusted `pointermove` over the stage while one is under way, as in Part 1.
- **Slow motion "css"** is on the pages whose movement is short CSS transitions and animations: the shared script plays every transition and animation on the stage at a third of its speed, including the visitor's own and ones that start later, and `later()` triples only the movement part of the run's waits; holds keep their length. The demo's own timers keep their length too (a tooltip's delays before showing and hiding), except the Copy button's revert, which counts its pulse as movement (see that section). The drag pages, Cursor Follower and Toast Notification leave Slow motion out; their sections say why.
- **Reset** is on a page only where the visitor can leave the demo changed in a way its own controls cannot undo in one step: removed messages (Swipe to Dismiss), a stack of toasts (Toast Notification) and added items (Pull to Refresh). Reset calls `stopRun()`, then puts the demo back as it is on arrival. Everywhere else a second press of the same control undoes the change (a toggle, an open panel), and Show me starts from rest anyway.
- **Reduced motion:** a pressed Show me plays the same steps, and the demo's own reduced-motion rules make each CSS change happen at once. Three runs move things themselves and still move when Show me is pressed, because the visitor asked for it: the scripted drags of Swipe to Dismiss and Pull to Refresh, and Cursor Follower's glide. Every run here changes the stage within 1.6 s, because the browser check presses Show me under reduced motion too and needs a visible change, and no stage here moves by itself.
- **Settings change during a run:** the page applies them at once as today, and each step of the run reads the current values.
- **Hover and touch:** every hover style stays inside `@media (hover: hover)`, and every hover has a tap equivalent (each section's **Touch** line). Drags use Pointer Events. No run in this half needs Part 1's pretend-hover class `is-demo`: each run calls the demo's own functions (`show()`, `open()`, `toggle()`, `render()` and so on) rather than relying on `:hover` or `:focus`.
- **"How to convert a page"** applies as written, with `04.NN · Micro-Interactions` and `--ui-accent:#ff9d5c`, except in three places. Step 4's body and player bar are the ones above. Step 5's rules for plays-once pages and loops are replaced by this section; its rules for every page still apply (player controls by id, `choices()`, nothing left of the old controls). Step 8's browser check runs the do-it checks instead: Show me moves the stage within 1.6 s, and nothing moves by itself under reduced motion.

## Owner decisions and lessons that apply here

- Stage text uses the site font; no page here is a typing effect, so none keeps a monospace font.
- Reduced motion runs nothing by itself and grays out Slow motion; Show me and Reset still work. Each demo keeps its own reduced-motion CSS, which makes a pressed Show me jump between states instead of moving.
- Do-it pages show themselves once on arrival (the shared script presses Show me).
- From the Text & Typography reviews: the pruning `later()`; the `hb:input` listener at the top level of the inline script; player controls reached by their ids (`btn-demo`, `btn-reset`, `slow-tog`); Show me restarts the pieces themselves from rest (reset them, force a reflow, then play), never through a double `requestAnimationFrame`.
- No code on the page: four stages show code or CSS names today (Copy to Clipboard's JavaScript snippet, Accordion's answers, and texts on Modal Expand and Cursor Follower); their sections replace them with plain content.
- **Transform and opacity only** (CLAUDE.md): no page here animates `width`, `height`, `top`, `left` or `box-shadow`. Cursor Follower now moves and grows with transforms, and Hamburger Menu Toggle's menu opens with transform and opacity instead of `max-height`; their sections say how. The owner allows two exceptions, because the height change is the effect itself: Accordion's opening answer and Swipe to Dismiss's closing row. Their READMEs say why, and how to keep it cheap.

---

## tooltip-reveal — Tooltip Reveal

- **Kind:** do it, step 1 "Hover it" — a tooltip appears only when the visitor points at, tabs to or taps an item.
- **Description:** A small label fades in after a short pause. Best for icon buttons.
- **Step 1 help line:** Point at an item, tab to it or tap it on a phone, or press Show me.
- **Player bar:** Show me · Slow motion (css). No Reset: a tooltip hides by itself when the pointer or focus leaves. Slow motion helps here because the fade and the slight grow last only 90 to 250ms; the waits before showing and hiding are timers and keep their length.
- **Show me:** `toRest()` removes `visible` from all four tooltips. The run is one hover of the first item, the gear button:
  - at once: the gear's own `show()` (its tooltip fades in after Delay before showing);
  - `later(hide, Speed, Delay before showing + 1600)`: the gear's own `hide()` (it fades out after Delay before hiding), and the run ends. About 2.3 s from press to rest at the defaults.

  Each item keeps its `show()` and `hide()` where the run can reach them (for example `wrap.show`, `wrap.hide`). The run also stops on a trusted `pointermove` over the stage (see the preamble). On that or on `hb:input`: `stopRun()`, then the gear's `hide()` unless the pointer or focus is on it (`wrap.matches(':hover,:focus-within')`).
- **Slow motion:** css. The fade is the run's only movement (Speed); the delay before showing and the 1600ms are holds, and the items' own delays keep their length. A slowed run takes about 2.9 s.
- **Reduced motion:** the demo's rule stays: the tooltip fades without growing.
- **Touch:** today's `touchstart` toggle stays: a tap shows or hides an item's tooltip at once.
- **Stage font:** site font. `.help-input` gets `font-family:inherit` (was `var(--mono)`).
- **Stage:** the four items stay: the gear button (tooltip below), the cut-off text (tooltip above), the Username field (tooltip to its right) and the avatar (tooltip above).
  - The "Total shown" readout goes, so `show()` no longer counts.
  - Escape hides a shown tooltip at once. A `keydown` listener on the document removes `visible` from every tooltip and clears their pending show and hide timers, so a tooltip comes back only when the pointer or focus leaves its item and returns. WCAG 1.4.13 asks that a tooltip can be dismissed without moving the pointer or the focus, and today's demo has no way to do it. With focus inside the stage, the Escape press also sends `hb:input`, which stops a Show me run.
  - Two rules of the old phone block stay, in a block of their own: the cut-off text is at least 44px tall with `line-height:24px`, and the field's side tooltip flips below the field (with its arrow). That block's media query becomes `max-width:720px` instead of 600px: the side tooltip (up to 200px wide) is cut off at the stage's right edge on screens from 601px to about 670px wide.
  - `hb-dots`: yes. Default height: the items take 270px of the 300px phone stage, and each tooltip, shown alone, stays inside it (measured).

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Delay before showing | Choice buttons | None · Short · Medium · Long | Medium | The pause stops tips flashing as the pointer passes. | `showDelay`: 0 / 150 / 300 / 600 (ms) |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How quickly the label fades and grows in. | `--tip-dur`: 250ms / 150ms / 90ms |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Delay before hiding | Choice buttons | None · Short · Long | Short | How long the tip stays after the pointer leaves. | `hideDelay`: 0 / 100 / 300 (ms) |
| Shows an arrow | Switch | on / off | off | A small point that aims the tip at its item. | every `.tip-wrap` gets / loses `has-arrow` |

- **Removed:**
  - The note.
  - The "Total shown" readout.
  - The Show Delay, Hide Delay and Duration sliders. They become Delay before showing, Delay before hiding and Speed.
  - "Show arrow" becomes Shows an arrow.
- **Good for:** Icon buttons · Cut-off text · Form hints · Chart values · **Avoid on:** Key information · Long text
- **Prompt:**

  > Add tooltips to [the icon buttons, shortened text or fields that need a short explanation]. When the pointer rests on an item, or keyboard focus reaches it, wait a moment, then fade the tooltip in beside it while it grows very slightly from the side facing the item, so it feels light rather than like a pop-up. The wait keeps tooltips from flashing while the pointer only passes by. When the pointer leaves, hide it again, after a pause if the settings include one, and let the Escape key close it at once. On touch screens, show and hide it with a tap. If the visitor has reduced motion turned on, fade it without growing. Match the settings listed below.

- **README What it is:** rewritten:

  > A tooltip is a small label that appears next to an item when you point at it or reach it with the keyboard, giving a short explanation that does not fit on the page. It fades in and grows very slightly, and it waits a moment before it shows, so tooltips do not flash while the pointer is only passing over things. When the pointer leaves, it stays for a moment before it fades, so it does not vanish the instant the pointer slips off the item.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Delay before showing | Medium | How long the pointer must rest before the tooltip shows: none, short (150ms), medium (300ms) or long (600ms); 300ms keeps tooltips from flashing as the pointer passes, and 200ms can work for very small ones |
  | Speed | Normal | How long the fade and the slight grow take: slow is 250ms, normal 150ms and fast 90ms |
  | Delay before hiding | Short | How long the tooltip stays after the pointer leaves: none, short (100ms) or long (300ms); a short pause stops it vanishing the instant the pointer slips off its item |
  | Shows an arrow | off | Adds a small point that aims the tooltip at its item |

- **README See also:** the second link's text changes from "Badge Pulse" to the page's real title.
  - [Hover State Animation](../hover-state/) — items that react when the pointer is on them
  - [Notification Badge Pulse](../badge-pulse/) — a dot that pulses to draw the eye
  - [Modal Expand](../modal-expand/) — a full window for content too big for a tooltip
- **README How it works:** in the first paragraph, "On mouse-leave it hides after a short second delay — allowing the user to move the cursor from trigger to tooltip without it disappearing:" becomes "On mouse-leave it hides after a short second delay, so it does not vanish the instant the pointer slips off the trigger:", because the demo's tooltips take no pointer. After the JS snippet, add "Escape hides a shown tooltip at once, so it can be dismissed without moving the pointer or the focus:" and this snippet:

  ```js
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    clearTimeout(showTimer);
    tip.classList.remove('visible');
  });
  ```

  The rest is unchanged.
- **README Production notes:** in the WCAG 1.4.13 bullet, "The 100ms hide delay satisfies "hoverable."" becomes "The demo covers "dismissible": Escape hides a shown tooltip at once. A hide delay helps with "hoverable" only when the tooltip takes the pointer; the demo's tooltips have `pointer-events: none`, so a tooltip that must be hoverable needs pointer events on." The `pointer-events: none` bullet becomes "**`pointer-events: none`** on the tooltip keeps it from catching the pointer, so it never blocks the item or its neighbors; the cost is that the pointer cannot rest on the tooltip itself, which the WCAG bullet covers." The rest is unchanged.
- **Category line:** `04.16 · Micro-Interactions`
- **Pager:** Previous: Notification Badge Pulse (`../badge-pulse/`) · Next: Drawer / Panel Slide (`../drawer-slide/`)

---

## drawer-slide — Drawer / Panel Slide

- **Kind:** do it, step 1 "Click it" — the drawer opens only when the visitor presses the menu button.
- **Description:** A side panel slides in over a dimmed page. Best for mobile menus.
- **Step 1 help line:** Press the menu button, then close the drawer with × or a swipe, or press Show me.
- **Player bar:** Show me · Slow motion (css). No Reset: ×, a tap on the dimmed page, a swipe or Esc close the drawer. Slow motion shows the point of the demo: the drawer slows as it arrives and speeds up as it leaves.
- **Show me:** `toRest()` closes the drawer at once, without its transition. Then:
  - at once: `open()`, as the menu button does;
  - `later(close, Opening speed, 1500)`: `close()`, and the run ends. About 2 s from press to rest at the defaults.

  On `hb:input`: `stopRun()` only. The drawer stays as it is, and the visitor closes it.
- **Slow motion:** css. The slide is the run's movement (Opening speed); the 1500ms is a hold. A slowed run takes about 3 s.
- **Reduced motion:** the demo's rule stays: the drawer and the dimming appear and disappear without sliding or fading.
- **Touch:** the swipe to close already uses Pointer Events (`pointerdown` on the drawer, `pointerup` on the document, 50px toward its edge).
- **Mouse swipe:** the drawer has `user-select:none` (with the `-webkit-` prefix). Without it, the first mouse swipe selects the words it starts on, and the next swipe begins on selected text, which the browser turns into a native text drag: no `pointerup` arrives and the drawer stays open, although the help line promises "or a swipe". With it, every mouse swipe closes the drawer, on every side.
- **Stage font:** site font. `.hamburger` gets `font-family:inherit` (was `monospace`), and so does `.close-btn`. The ☰ comes from the system's fallback font, as it does today.
- **Stage:** the small app screen stays: the header with the menu button and "Atlas App", the gray content lines, the dimming layer and the drawer.
  - The State readout goes.
  - The drawer's list keeps four items (Home, Gallery, About, Contact). "Settings", pinned to the bottom, goes, and `.drawer-body`'s padding becomes 12px (was 16px). Measured: five items need 268px and the side drawer has 221px on a phone and 248px on a short laptop, so the list scrolled; four need 212px.
  - `--drawer-w` becomes `min(280px,80%)`, so on a 320px phone a strip of dimmed page stays to tap.
  - The top and bottom drawers keep their 200px height; their list scrolls inside, as a sheet does.
  - While closed, the drawer has the `inert` attribute (`close()` sets it, `open()` removes it, and it starts closed), so Tab cannot reach its hidden close button.
  - The stage's own rule keeps `position:relative;overflow:hidden;display:flex;flex-direction:column`.
  - `hb-dots`: no, because the app screen fills the stage. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Slides in from | Choice buttons | Left · Right · Top · Bottom | Left | The edge the drawer comes in from. | `side`: `'left'` / `'right'` / `'top'` / `'bottom'` (the drawer gets no class / `right` / `top` / `bottom`; an open drawer closes first and the class changes without a transition, as today) |
| Opening speed | Choice buttons | Slow · Normal · Fast | Normal | It slows down as it arrives, like a panel landing. | `--open-dur`: 450ms / 280ms / 170ms |
| Closing speed | Choice buttons | Slow · Normal · Fast | Normal | It speeds up as it leaves, so closing feels quick. | `--close-dur`: 350ms / 220ms / 130ms |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Page dimming | Choice buttons | None · Light · Medium · Dark | Medium | How dark the page behind the drawer gets. | `--backdrop-op`: 0 / 0.25 / 0.5 / 0.7 |

- **Removed:**
  - The note.
  - The State readout.
  - The Drawer Side menu. It becomes Slides in from.
  - The Open Duration, Close Duration and Backdrop Opacity sliders. They become Opening speed, Closing speed and Page dimming.
  - The drawer's "Settings" item.
- **Good for:** Mobile menus · Filters · Settings panels · **Avoid on:** Short messages · Main content
- **Prompt:**

  > Add a slide-in drawer to [the menu or panel you want to open]. It waits just beyond one edge of the screen and slides in over the page when its button is pressed; when the settings include it, the page behind it dims. Let it slow down as it arrives, like a panel sliding to a stop, and speed up as it leaves, so closing feels quicker than opening. Close it with a close button, a tap on the page beside it, the Escape key or a swipe back toward its edge. Move only its position, and keep keyboard focus inside it while it is open. If the visitor has reduced motion turned on, show and hide it without sliding. Match the settings listed below.

- **README What it is:** rewritten:

  > A drawer is a panel that waits just beyond one edge of the screen and slides in over the page when you press its button, usually holding a menu, filters or settings. The page behind it usually dims so the drawer stands out. It slows down as it arrives, like a panel sliding to a stop, and speeds up as it leaves, which makes closing feel quicker than opening.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Slides in from | Left | The edge the drawer comes from: left or right for menus and filters, top or bottom for sheets |
  | Opening speed | Normal | How long the slide in takes: slow is 450ms, normal 280ms and fast 170ms; it slows as it arrives |
  | Closing speed | Normal | How long the slide out takes: slow is 350ms, normal 220ms and fast 130ms; it speeds up as it leaves, and a little shorter than opening feels right |
  | Page dimming | Medium | How dark the page behind gets: none, light (25% black), medium (50%) or dark (70%); darker than about 70% feels like a dialog rather than a drawer |

- **README See also:**
  - [Modal Expand](../modal-expand/) — a window that grows out of the button you pressed
  - [Accordion Open/Close](../accordion/) — sections that open in place instead of over the page
  - [Tooltip Reveal](../tooltip-reveal/) — a small label for a short explanation
- **README How it works:** in the JS snippet, `open()` also does `drawer.inert = false;` and `close()` does `drawer.inert = true;`, with the comment `// a closed drawer cannot be reached with Tab`. The rest is unchanged.
- **README Production notes:** the "Swipe-to-close on touch" bullet gets one more sentence: "With a mouse, give the drawer `user-select: none`, or the first drag selects its text and the next one becomes a native text drag." The rest is unchanged.
- **Category line:** `04.17 · Micro-Interactions`
- **Pager:** Previous: Tooltip Reveal (`../tooltip-reveal/`) · Next: Modal Expand (`../modal-expand/`)

---

## modal-expand — Modal Expand

- **Kind:** do it, step 1 "Click it" — the window opens only when the visitor presses a button, and it grows out of that button.
- **Description:** A window grows out of the button you pressed. Best for detail views.
- **Step 1 help line:** Press any of the five buttons and watch the window grow out of it, or press Show me.
- **Player bar:** Show me · Slow motion (css). No Reset: Cancel, Confirm, a tap on the dimmed page or Esc close the window.
- **Show me:** `toRest()` closes the window at once, without its transition. Each run presses one button, the next in turn each time Show me is pressed: Top right first (on arrival), then Bottom left, Center, Top left and Bottom right. It shows the point of the demo, a different starting point each time.
  - at once: `openModal(btn)` for that button (it does not move the focus);
  - `later(closeModal, Speed, 1500)`: `closeModal()`, and the run ends. About 2.1 s from press to rest at the defaults.

  On `hb:input`: `stopRun()` only. The window stays open, and the visitor closes it.
- **Slow motion:** css. The window's grow and fade and the dimming slow down; the grow is the run's movement (Speed) and the 1500ms is a hold. A slowed run takes about 3.4 s.
- **Reduced motion:** the demo's rule stays: the window appears at full size and disappears without growing or fading.
- **Stage font:** site font. `.trig-btn`, `.modal-close` and `.modal-confirm` get `font-family:inherit` (was `monospace`).
- **Stage:** the five buttons, the dimming layer, the window and the origin dot stay; the Origin readout goes.
  - The window's text becomes plain words. The title "Confirm action" stays. The body becomes "This window grew out of the button you pressed, so it feels connected to where it came from." Today's body names the CSS property.
  - The window is centred with `inset:0;margin:auto;height:fit-content` in place of `top:50%;left:50%` and the two negative margins. The old `margin-top:-80px` guessed its height: on a phone it sat 70px from the top and 42px from the bottom. `openModal()` measures with `offsetLeft` and `offsetTop`, which still give its laid-out corner.
  - The phone rule that makes Cancel and Confirm 44px tall stays.
  - The four "Open ↗" buttons get an `aria-label` naming their corner ("Open from the top left", and so on), because they share one text.
  - While closed, the window has the `inert` attribute (`closeModal()` sets it, `openModal()` removes it, and it starts closed), so Tab cannot reach its hidden buttons.
  - `hb-dots`: yes. Default height: with the plain text and 44px buttons the window is 196px tall, inside the 300px phone stage (measured).

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long the window takes to grow to full size. | `--modal-dur`: 500ms / 320ms / 200ms |
| Starting size | Choice buttons | Tiny · Small · Medium | Small | How small it is as it leaves the button. | `--start-scale`: 0.05 / 0.1 / 0.3 |
| Feel | Choice buttons | Springy · Smooth · Even | Springy | Springy goes a little past full size, then settles. | `--modal-ease`: `cubic-bezier(.34,1.3,.64,1)` / `ease-out` / `linear` |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Marks where it grows from | Switch | on / off | on | A dot shows the point the window grows out of. | the switch keeps today's `debug-tog` role: `openModal()` shows the dot (`show`) only while it is on, and turning it off hides the dot at once |

- **Removed:**
  - The note.
  - The Origin readout.
  - The Duration and Start Scale sliders. They become Speed and Starting size.
  - The Easing menu. It becomes Feel. Its "Smooth" curve (`cubic-bezier(.2,.7,.3,1)`) goes: it looked nearly the same as Ease out, which is now Smooth.
  - "Show origin point" becomes Marks where it grows from.
- **Good for:** Detail views · Confirmations · Quick forms · Action buttons · **Avoid on:** Long content · Full pages
- **Prompt:**

  > Add a modal that grows out of its button to [the button or card that opens a dialog or detail view]. When it is pressed, measure where that button sits and grow the modal from that spot to full size in the middle of the screen while the page behind it dims, so it clearly comes from what was pressed. Close it with its buttons, a tap on the dimmed page or the Escape key, and let it shrink back toward the same spot. Animate only its scale and opacity. Move keyboard focus into it, and back to the button when it closes. If the visitor has reduced motion turned on, show it at full size without growing. Match the settings listed below.

- **README What it is:** rewritten:

  > Modal expand makes a dialog grow out of the button that opened it. The page measures where that button is and grows the window from that exact spot to its full size in the middle of the screen, so it is clear where the window came from and where it goes back to when it closes.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Speed | Normal | How long the window takes to grow: slow is 500ms, normal 320ms and fast 200ms |
  | Starting size | Small | How big the window is as it leaves the button: tiny is 5%, small 10% and medium 30% of its full size; too big and the growth is hard to see |
  | Feel | Springy | Springy goes a little past full size, then settles; Smooth slows to a stop; Even keeps one steady speed |
  | Marks where it grows from | on | Shows a small dot on the point the window grows out of |

- **README See also:**
  - [Drawer / Panel Slide](../drawer-slide/) — a panel that slides in from an edge instead
  - [Tooltip Reveal](../tooltip-reveal/) — a small label for a short explanation
  - [FLIP Technique](../../03-page-transitions/flip-technique/) — the same measure-then-move idea for any layout change
- **README How it works:** both snippets change to match the demo.
  - The JS snippet becomes:

    ```js
    function openModal(btn) {
      const sr = stage.getBoundingClientRect();
      const br = btn.getBoundingClientRect();
      // The button's centre, relative to the stage
      const bx = br.left + br.width / 2 - sr.left;
      const by = br.top + br.height / 2 - sr.top;
      // The same point, relative to the modal's laid-out corner (offsetLeft/Top ignore its scale)
      modal.style.transformOrigin = `${bx - modal.offsetLeft}px ${by - modal.offsetTop}px`;
      modal.classList.add('open');
    }
    ```

  - The CSS snippet becomes:

    ```css
    .modal {
      position: absolute;
      inset: 0; margin: auto;              /* centred without a transform */
      width: clamp(240px, 55%, 320px); height: fit-content;
      transform: scale(var(--start-scale));
      opacity: 0;
      transition: transform var(--modal-dur) var(--modal-ease), opacity 200ms ease;
      pointer-events: none;
    }
    .modal.open { transform: scale(1); opacity: 1; pointer-events: auto; }
    ```

  - The sentences around them stay, except "compute the origin point relative to the modal's final centered position:", which becomes "compute the same point relative to the modal's own corner:".
- **README Production notes:** unchanged
- **Category line:** `04.18 · Micro-Interactions`
- **Pager:** Previous: Drawer / Panel Slide (`../drawer-slide/`) · Next: Accordion Open/Close (`../accordion/`)

---

## accordion — Accordion Open/Close

- **Kind:** do it, step 1 "Click it" — an answer opens only when the visitor presses its question.
- **Description:** Each question opens smoothly to show its answer. Best for FAQ pages.
- **Step 1 help line:** Press a question to open its answer and again to close it, or press Show me.
- **Player bar:** Show me · Slow motion (css). No Reset: every answer closes with its own question.
- **Show me:** `toRest()` closes every answer at once, without its transition. Then:
  - at once: `toggle(items[0])` opens the first question, as a press does;
  - `later(close, Speed, 1500)`: `toggle(items[0])` closes it, and the run ends. About 2.1 s from press to rest at the defaults.

  On `hb:input` (a press, or a wheel or touch that scrolls the box): `stopRun()` only. The answer stays open.
- **Slow motion:** css. The height or grid-row change, the arrow's turn and the text fade slow down; the opening is the run's movement (Speed) and the 1500ms is a hold. A slowed run takes about 3.3 s.
- **Reduced motion:** the demo's rule stays: answers open and close at once, without fading.
- **Stage font:** site font. `.acc-trigger` gets `font-family:inherit` (was `monospace`).
- **Stage:** the five questions stay, and the stage scrolls: its own rule keeps `overflow:auto`, because open answers can make the list taller than the stage.
  - The questions and answers are rewritten in plain words, because today's name CSS properties and quote code:
    1. "What is an accordion?" — "A stack of headings that each open to show more below them. It keeps a long page short and easy to scan."
    2. "Why animate the height?" — "When an answer grows into place, the questions below slide down smoothly instead of jumping, so you keep your place."
    3. "Can several stay open?" — "It depends on the page. Often opening one closes the others, which keeps the list short, while settings pages usually let several stay open."
    4. "When should I use one?" — "For questions, settings or long sections that people read one at a time. If everything must be seen at once, show it all instead." and a second paragraph, "Avoid putting accordions inside accordions; two levels is the most people can follow." (it keeps the second paragraph, so the text fade has two pieces to stagger).
    5. "Does it work with a keyboard?" — "Yes. Each question is a button, so Tab reaches it and Enter or Space opens it, and screen readers hear whether it is open."
  - To fit, `.acc-trigger`'s `min-height` becomes 48px (was 52px) and the stage's padding `clamp(12px,3vw,24px)` (was 24px). Measured: today the five closed questions need 334px, so the phone stage (298px inside) already scrolled before anything opened. After the change they need 290px on a phone and 314px on a short laptop (325px inside).
  - The old phone rule (`height:auto;min-height:500px`) goes.
  - The answers keep their height (or grid-row) animation: the owner allows it here, because the panel opening is the effect itself (see the preamble).
  - `hb-dots`: yes. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long an answer takes to open or close. | `--acc-dur`: 500ms / 300ms / 180ms |
| Feel | Choice buttons | Gentle · Smooth · Even | Gentle | Gentle eases in and out; Smooth slows at the end. | `--acc-ease`: `ease-in-out` / `ease-out` / `linear` |
| Several open at once | Switch | on / off | off | Off closes the open answer when you open another. | `multiOpen`: `true` / `false` |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Built with | Choice buttons | Measured height · Grid rows | Measured height | Two ways to grow to the answer's height; they look alike. | `switchMethod()`: `'js'` / `'grid'` (open answers close first, as today) |
| Arrow flips | Switch | on / off | on | The arrow turns to point up while an answer is open. | today's `chevron-tog` handler: every `.acc-chevron` gets no inline transform / `transform:none` |
| Text fades in | Switch | on / off | off | The answer's text fades in as its box opens. | `applyStagger()`: every `.acc-body` gets / loses `stagger` |

- **Removed:**
  - The note.
  - The Open items readout.
  - The Implementation menu. It becomes Built with.
  - The Duration slider. It becomes Speed.
  - The Easing menu. It becomes Feel. Ease in goes: it starts slowly and stops abruptly, which suits neither opening nor closing.
  - "Allow multiple open", "Rotate chevron" and "Stagger child reveals" become Several open at once, Arrow flips and Text fades in.
- **Good for:** FAQ pages · Settings · Menus · Long documents · **Avoid on:** Key information · Short content
- **Prompt:**

  > Add an accordion to [the questions or sections you want to fold away]. Show only the headings at first; when one is pressed, its content box grows from nothing to its full height and the headings below slide down, and pressing it again shrinks it back. Animate the box to the content's real height, never to a large fixed maximum, or the timing looks wrong. When the settings include it, turn a small arrow to show which items are open. Make each heading a real button that tells screen readers whether it is open. If the visitor has reduced motion turned on, open and close the sections without animating. Match the settings listed below.

- **README What it is:** rewritten:

  > An accordion is a stack of headings that each open to show more content below them, and close again. The hard part is the movement: the content's box has to grow from nothing to its natural height, which browsers cannot animate on their own. The demo shows two ways to do it: measure the content's height first, or let a grid row grow from nothing to its full size.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Speed | Normal | How long an answer takes to open or close: slow is 500ms, normal 300ms and fast 180ms |
  | Feel | Gentle | Gentle eases in and out, which suits opening and closing alike; Smooth slows at the end; Even keeps one steady speed |
  | Several open at once | off | Off closes the open answer when another opens, which keeps the list short; on suits settings pages |
  | Built with | Measured height | Measured height measures the answer before growing to it; Grid rows lets a grid row grow from nothing to its full size, with no measuring; both look the same |
  | Arrow flips | on | The arrow beside each question turns to point up while its answer is open |
  | Text fades in | off | The answer's text fades in and rises slightly while its box opens, each paragraph a moment after the one before |

- **README See also:**
  - [Toggle / Switch Slide](../toggle-switch/) — a simple on and off with no height change
  - [Drawer / Panel Slide](../drawer-slide/) — a panel that slides in over the page instead
  - [FLIP Technique](../../03-page-transitions/flip-technique/) — moves other elements smoothly when a layout changes
- **README How it works:** unchanged
- **README Production notes:** the "Stagger on reveal" bullet ends "see the Text fades in setting in the demo." instead of "see the toggle in the demo." A new last bullet: "**Why the demo animates height**: the answer's box growing is the effect itself, so this demo animates its height (or its grid row) directly, an exception to animating only transform and opacity; keep it cheap by opening one short panel at a time and keeping heavy content, such as videos or large images, out of the panel and away from what moves below it." The rest is unchanged.
- **Category line:** `04.19 · Micro-Interactions`
- **Pager:** Previous: Modal Expand (`../modal-expand/`) · Next: Cursor Follower (`../cursor-follower/`)

---

## cursor-follower — Cursor Follower

- **Kind:** do it, step 1 "Hover it" — the dot moves only when the visitor moves the pointer over the box or taps in it.
- **Description:** A dot trails your pointer and flips the colors under it. Best for portfolios.
- **Step 1 help line:** Move your pointer over the box or tap in it, or press Show me.
- **Player bar:** Show me. No Reset: nothing stays changed. No Slow motion: the dot follows the pointer on every animation frame, and Lag already sets how slowly it follows.
- **Show me:** an invisible pointer visits four points, and the dot glides after it (today's `loop()` keeps drawing it). The run sets `mx`/`my`, `inside` and the follower's opacity itself, and adds or removes `expanded` itself when Grows over buttons is on. `toRest()` hides the dot (`inside=false`, opacity 0, no `expanded`).
  - at once: the middle of the first area. `fx`/`fy` jump there as well, as `mouseenter` does, and the dot appears;
  - `later(step, 0, 700)`: the "Button" in the second area, and the dot grows;
  - `later(step, 0, 1400)`: the "Button" in the third area; it stays grown;
  - `later(step, 0, 2100)`: the middle of the fourth area, and it shrinks back;
  - `later(end, 0, 2800)`: the run ends. The dot disappears (opacity 0; it has no fade), unless the pointer is over the stage: the run sets `inside = stage.matches(':hover')` and the opacity to match, so a pointer resting there keeps its dot. About 2.8 s.

  The run also stops on a trusted `pointermove` over the stage (see the preamble). On that, or on `hb:input` (a tap or press): `stopRun()` and remove `expanded`; the dot then follows the visitor.
- **Slow motion:** none.
- **Reduced motion:** the demo's rule becomes `#follower .shape,#follower circle{transition:none!important}`, so the dot grows at once. The dot still follows the visitor's own pointer with its lag, as today.
- **Touch:** today the dot is hidden on touch screens (the `pointer:coarse` check), so phones showed nothing. That check goes. A `pointerdown` on the stage whose `pointerType` is not `mouse` sets `mx`/`my` to the tap point and shows the dot. The first tap places it there directly, as `mouseenter` does; later taps make it glide to each new point. The dot stays shown, and the page still scrolls with a swipe over the box (`touch-action` is unchanged).
- **Stage font:** site font. `.hover-target` drops `font-family:monospace`.
- **Stage:** the four colored areas and the dot stay.
  - The first area's "Move cursor over stage" becomes "Move your pointer here".
  - The fourth area's "Mix-blend-mode inverts here" becomes "Pass over these words". The old text named the CSS property.
  - The two "Hover target" labels become "Button".
  - The Position readout and both notes go.
  - `cursor:none` on the stage stays.
  - **The dot moves and grows with transforms only** (CLAUDE.md), where today it sets `left`, `top`, `width` and `height`.
    - `#follower` becomes a wrapper at `left:0;top:0`. The loop, the snap on `mouseenter`, the run and the tap move it with `transform:translate(Xpx,Ypx)`. `mix-blend-mode` and the `circle`, `ring`, `square`, `expanded` and `no-blend` classes stay on it.
    - Inside it, a new `.shape` element carries today's Circle and Square rules: its size `var(--follower-size)`, its fill and its corners. `no-blend` still turns its fill to today's `rgba(255,157,92,.5)`. It is centred with `transform:translate(-50%,-50%)` and has `transition:transform .2s ease,border-radius .2s ease` in place of today's `width`/`height` transitions.
    - Growing over a button scales the shape: `#follower.expanded .shape{transform:translate(-50%,-50%) scale(2.5)}`.
    - The square's corners become `1.6px` (4px ÷ 2.5) while expanded, so they still read as 4px.
    - **The Ring shape is drawn as an SVG circle stroke instead of a border.** A border cannot keep 2px: Chrome snaps border widths to whole device pixels. A `.8px` border scaled 2.5 times is 2.5px at 1×, 1.25px at 2× and 1.67px at 3× (today's ring is 2px everywhere), and it dips to about 1px in the first frames of the grow. `vector-effect:non-scaling-stroke` does not undo a CSS scale either (it drew about 5px). An SVG stroke is not snapped:
      - `.shape` holds `<svg aria-hidden="true"><circle/></svg>`, shown only for the Ring shape: `#follower .shape svg{display:none;position:absolute;inset:0;width:100%;height:100%;overflow:visible}` and `#follower.ring .shape svg{display:block}`. The ring's `.shape` has no border and no background, with Flips the colors under it on or off.
      - `#follower .shape circle{cx:50%;cy:50%;r:calc(50% - 1px);fill:none;stroke:#fff;stroke-width:2;transition:stroke-width .2s ease,r .2s ease}` and `#follower.expanded .shape circle{stroke-width:.8;r:calc(50% - .4px)}` use the same duration and easing as the scale. So the grown ring is 2px thick again, and its outer edge stays on the shape's edge: a 40px outer radius for the 32px dot, as today.
      - Mid-grow the ring can be up to about 0.45px thicker for a moment, because the thinning stroke and the growing scale multiply: (2 − 1.2e) × (1 + 1.5e) peaks at 2.45px halfway through.
      - With Flips the colors under it off, the ring keeps today's look: `#follower.no-blend.ring circle{fill:rgba(255,157,92,.5);stroke:var(--ui-accent)}`.
  - `hb-dots`: no, because the four areas fill the stage. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Lag | Choice buttons | Short · Medium · Long | Medium | A longer lag feels heavier and smoother. | `ease`: 0.35 / 0.15 / 0.06 (the share of the gap the dot closes each frame) |
| Size | Choice buttons | Small · Medium · Large | Medium | How big the dot is before it grows. | `--follower-size`: 20px / 32px / 48px |
| Flips the colors under it | Switch | on / off | on | Keeps the dot visible on light and dark areas. | the follower's `no-blend` class off / on |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Shape | Choice buttons | Circle · Ring · Square | Circle | The outline of the follower. | the follower's class: `circle` / `ring` / `square` |
| Grows over buttons | Switch | on / off | on | The dot swells while the pointer is on a button. | `expandOnHover`: `true` / `false` (off also removes `expanded`) |

- **Removed:**
  - Both notes.
  - The Position readout.
  - The Size and Easing (lag) sliders. They become Size and Lag.
  - The Shape menu. It becomes Shape.
  - "mix-blend-mode: difference" becomes Flips the colors under it.
  - "Expand on hover targets" becomes Grows over buttons.
  - The check that hid the dot on touch screens.
- **Good for:** Portfolios · Agency sites · Interactive stories · **Avoid on:** Forms and tools · Reading pages
- **Prompt:**

  > Add a cursor follower to [the page or section where it should appear]. Draw a small shape that follows the pointer with a slight delay: on every frame, move it a set share of the way toward the pointer, so it glides after it and eases in. Hide it when the pointer leaves. When the settings include them, let it flip the colors beneath it so it stays visible on light and dark areas alike, and let it grow over buttons and links. Move it with transforms only. Touch screens have no pointer, so hide it there or let it glide to where the visitor taps. If the visitor has reduced motion turned on, keep the normal cursor instead. Match the settings listed below.

- **README What it is:** rewritten:

  > A cursor follower is a small shape that trails the mouse pointer with a slight delay, so it glides after it and eases in as it catches up instead of sticking to it. When it flips the colors of whatever is under it, it stays visible on any background, light over dark areas and dark over light ones, without choosing a color for each.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Lag | Medium | How closely the dot follows: each frame it closes 35% (short), 15% (medium) or 6% (long) of the gap to the pointer; a longer lag feels heavier |
  | Size | Medium | The dot is 20px, 32px or 48px across |
  | Flips the colors under it | on | The dot inverts the colors beneath it, so it stays visible on light and dark areas; off, it is a see-through orange dot |
  | Shape | Circle | A filled circle, a ring or a small square |
  | Grows over buttons | on | The dot grows to two and a half times its size while the pointer is on a button |

- **README See also:**
  - [Hover State Animation](../hover-state/) — items that react when the pointer is on them
  - [Tooltip Reveal](../tooltip-reveal/) — a label that appears where the pointer rests
  - [Click / Tap Ripple](../click-ripple/) — a ripple from the exact point you click
- **README How it works:** the snippets follow the transform-only demo; the prose between them stays.
  - In the first snippet, the loop's two `follower.style.left`/`top` lines become one:

    ```js
    follower.style.transform = `translate(${fx}px, ${fy}px)`;   // transform only: nothing is laid out again
    ```

  - The CSS snippet becomes:

    ```css
    #follower {
      position: fixed;
      left: 0; top: 0;                 /* moved only by transform */
      mix-blend-mode: difference;
      pointer-events: none;
      will-change: transform;
      z-index: 9999;
    }
    #follower .shape {
      width: 32px; height: 32px;
      border-radius: 50%;
      background: #fff;
      transform: translate(-50%, -50%);
      transition: transform .2s ease;
    }
    #follower.expanded .shape { transform: translate(-50%, -50%) scale(2.5); }
    ```

- **README Production notes:**
  - The "Touch devices" bullet gets a last sentence: "The demo sends the dot to each tap only so the effect can be seen on a phone."
  - In the "Performance" bullet, "Updating `left`/`top` (rather than `transform`) on every frame is less optimal — in production, update `transform: translate(x, y)` instead." becomes "The demo moves it with `transform: translate(x, y)` and grows it with `scale()`, so nothing is laid out again while it moves."
  - The rest is unchanged.
- **Category line:** `04.20 · Micro-Interactions`
- **Pager:** Previous: Accordion Open/Close (`../accordion/`) · Next: Error Shake (`../error-shake/`)

---

## error-shake — Error Shake

- **Kind:** do it, step 1 "Click it" — the field shakes only when the visitor signs in with a wrong or empty password.
- **Description:** A field shakes side to side when the input is wrong. Best for sign-in forms.
- **Step 1 help line:** Sign in with a wrong or empty password (the right one is letmein), or press Show me.
- **Player bar:** Show me · Slow motion (css). No Reset: typing in the field clears the error, as today. Slow motion shows each swing getting smaller.
- **Show me:** `toRest()` empties the field and clears its state (`clearState()`). Then:
  - at once: the field gets a wrong password, "abc123" (it shows as dots);
  - `later(shake, 0, 400)`: today's `shake('Incorrect password. Try again.')`, called directly as the old "Replay shake" button did. It does not submit the form and does not focus the field (the submit handler's `focus()` and `select()` would open a phone's keyboard);
  - `later(clear, Speed, 2000)`: the field is emptied and `clearState()` runs, and the run ends. About 2.6 s from press to rest at the defaults (the border and the message take 180ms to clear).

  On `hb:input`: `stopRun()`. If the field still holds the run's "abc123", it is emptied and `clearState()` runs, so the visitor starts from a clean field.
- **Slow motion:** css. The shake (a CSS animation) and the border and message changes slow down. The shake is the run's movement (the Speed in the step that clears the field); the 400ms and 2000ms are holds. A slowed run takes about 3.7 s.
- **Reduced motion:** the demo's rule stays: no shake, but the red border and the message still show.
- **Stage font:** site font. The card's title drops `var(--disp)`; `.field input` and `.submit` get `font-family:inherit` (were `var(--mono)` and `var(--disp)`). `.field label` (10px) and `.msg` (10.5px) go up to 11px.
- **Stage:** the sign-in card stays, with its field, message and Sign in button.
  - The hint line inside the card ("Password is letmein. Try a wrong value…") goes; its words move to the help line.
  - The card's `<h2>` becomes `<p class="card-title">` with the same look (the rule `.card h2` becomes `.card-title`), so the page's headings stay Watch it, Try it and Copy the prompt.
  - `buildShake()` keeps rewriting the `@keyframes shake` rule in `document.styleSheets[0]`. That is still the page's own `<style>`, because the shared stylesheet's link comes after it.
  - The old phone rule (`height:auto;min-height:420px`) goes.
  - `hb-dots`: yes. Default height: the card, with its hint, is 268px tall and fits the 300px phone stage (measured); without the hint it is shorter.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Shake distance | Choice buttons | Small · Medium · Large | Medium | How far the field swings left and right. | `--shake-x`: 4px / 8px / 14px |
| Number of swings | Choice buttons | Few · Medium · Many | Medium | Four to six swings read as a head shake. | `buildShake(n)`: 4 / 6 / 8 |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long the whole shake lasts. | `--shake-dur`: 650ms / 400ms / 250ms |

**More options**

None: leave out the `details.hb-options` block.

- **Removed:**
  - The note.
  - "↺ Replay shake". Show me replaces it.
  - The hint line in the card.
  - The Shake intensity, Oscillations and Duration sliders. They become Shake distance, Number of swings and Speed.
- **Good for:** Sign-in forms · Codes and PINs · Form fields · **Avoid on:** Whole pages · Warnings
- **Prompt:**

  > Add an error shake to [the form field that can be rejected, such as a password]. When the value is wrong or missing, move the field quickly left and right a few times, each swing smaller than the last, and end exactly where it started, like a head shaking no. Turn its border red and show a short message saying what went wrong, because movement and color alone do not explain the problem. Move only its horizontal position so the shake stays smooth, and restart the shake on every failed try. If the visitor has reduced motion turned on, skip the shake and keep the red border and the message. Match the settings listed below.

- **README What it is:** rewritten:

  > An error shake tells someone that what they entered was not accepted. The field swings left and right a few times, each swing smaller than the last, then settles exactly where it started, like a head shaking no. A red border and a short message come with it and say what went wrong.

- **README Key parameters:** (the old Easing and Error color rows go: they are not settings, and How it works already shows both)

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Shake distance | Medium | How far the field swings: small is 4px, medium 8px and large 14px; under 4px barely shows and over about 16px feels violent |
  | Number of swings | Medium | How many times it swings: few is 4, medium 6 and many 8; four to six reads as a head shake, more feels frantic |
  | Speed | Normal | How long the whole shake lasts: slow is 650ms, normal 400ms and fast 250ms; under 250ms feels twitchy and over 600ms drags |

- **README See also:** the second link's text changes from "Focus Ring" to the page's real title.
  - [Form Field Morph](../form-field-morph/) — a label that rises out of the field as you use it
  - [Focus Ring Animation](../focus-ring/) — a ring that follows keyboard focus
  - [Button Press Scale](../button-press-scale/) — a button that shrinks as you press it
  - [Checkmark Draw](../checkmark-draw/) — the tick that says yes
- **README How it works:** after the CSS snippet, add: "The demo writes this keyframe rule from JavaScript, so the Number of swings setting can give it as many swings as it asks for, each smaller than the last." The rest is unchanged, except that the CSS snippet now shows the six-swing set (final fix wave, below).
- **README Production notes:** unchanged
- **Final fix wave (after the category review):**
  - The press the shared script makes on arrival no longer touches a visitor who is already typing. Show me's handler begins `e=>{if(!e.isTrusted&&stage.contains(document.activeElement))return;` (the guard Form Field Morph has), so a password being typed is not emptied and replaced by "abc123". A visitor's own press on Show me still runs the demo.
  - The comment above the stylesheet's `@keyframes shake` now says what is true: `buildShake()` rewrites the rule when the page loads, with swings that decay (six by default), and the copy in the stylesheet only stands in until then (its 80% and 90% swings return to full size).
  - README How it works: the CSS snippet is the six-swing decaying set that `buildShake(6)` writes, rounded: 0% and 100% at 0, then 14% −0.86, 29% 0.71, 43% −0.57, 57% 0.43, 71% −0.29 and 86% 0.14 times `--shake-x`. The old snippet swung back to full size at 80% and 90% while the text called the shake decaying.
- **Category line:** `04.21 · Micro-Interactions`
- **Pager:** Previous: Cursor Follower (`../cursor-follower/`) · Next: Swipe to Dismiss (`../swipe-to-dismiss/`)

---

## swipe-to-dismiss — Swipe to Dismiss

- **Kind:** do it, step 1 "Drag it" — a message goes only when the visitor drags it away.
- **Description:** A card dragged sideways flies off and the list closes up. Best for inboxes.
- **Step 1 help line:** Drag a message sideways and let go, or press Show me.
- **Player bar:** Show me · Reset. No Slow motion: the card follows the visitor's own hand, and the settle and fly-off are short.
- **Show me:** `toRest()` rebuilds the list (`build()`) when a message is missing. Then, on the first message (the page has no Slow motion, so each step is a hold, `later(step, 0, ms)`; each drag is drawn frame by frame through `runFrame`, and before each drag the card loses `settling` and `flung`, as today's `pointerdown` does):
  - at once: it is dragged right over 400ms to half the Distance to delete, then let go: today's `spring()` brings it back;
  - `later(drag, 0, 1100)`: it is dragged right over 600ms to the Distance to delete plus 15% of its width, then let go: today's `dismiss(row, card, 1)` flies it off and closes its row;
  - `later(rebuild, 0, 2600)`: the list is rebuilt, as Reset does, and the run ends. About 2.6 s.

  Each drag frame sets the card as today's `pointermove` does: `translateX(x)`, opacity `max(0.3, 1 − |x| / (0.9 × width))`, and the red strip (`show`) past 8px while Shows a Delete label is on. On `hb:input`: `stopRun()`. A card still being dragged by the run springs back; a card already gone stays gone, and Reset brings it back.
- **Reset:** rebuilds all four messages (today's "Reset list", `build()`), after `stopRun()`.
- **Slow motion:** none.
- **Reduced motion:** the demo's rules stay: a dismissed row is removed at once (its `reduce` branch), and the spring back has no transition.
- **Touch:** already Pointer Events with pointer capture; `touch-action:pan-y` on the cards lets the page scroll up and down.
- **Stage font:** site font. `.reveal` and `.avatar` drop `font-family:var(--disp)`. `.meta .s` goes up to 11px (was 10px).
- **Stage:** the message list stays, with four messages instead of five. Measured: five 66px rows need 362px, which overflows the 300px phone stage by 31px at the top and bottom and the 327px short-laptop stage by 17px; four need 288px.
  - "Theo Grant — Re: invoice — all sorted" goes.
  - "Kai Morgan — Deploy is green, shipping it" becomes "Kai Morgan — Booked the tickets for June", in plain words.
  - The empty-list line becomes "All cleared. Press Reset to bring them back."
  - The old phone rule (`height:auto;min-height:420px`) goes.
  - The row keeps its height animation as it closes: the owner allows it here, because the list closing up is the effect itself (see the preamble).
  - `hb-dots`: yes. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Distance to delete | Choice buttons | Short · Medium · Long | Medium | How far to drag before letting go deletes it. | `threshold`: 0.2 / 0.35 / 0.5 (share of the card's width) |
| Shows a Delete label | Switch | on / off | on | A red Delete strip shows behind the card as you drag. | `showReveal`: `true` / `false` (every `.reveal` loses / gets `hidden`) |

**More options**

None: leave out the `details.hb-options` block.

- **Removed:**
  - The note.
  - The Dismiss threshold slider. It becomes Distance to delete.
  - "Show delete background" becomes Shows a Delete label.
  - "↺ Reset list". The player bar's Reset replaces it.
  - The fifth message.
- **Good for:** Inboxes · Notifications · Chat lists · To-do lists · **Avoid on:** Permanent deletes · Mouse-only tools
- **Prompt:**

  > Add swipe to dismiss to [the list items people should be able to remove]. While an item is dragged sideways, it follows the finger exactly and fades a little; when the settings include it, a red Delete label shows behind it. On release, remove it if it went far enough or was flicked quickly: it slides off the edge and its row closes up so the list moves up smoothly. Otherwise it springs back into place. Use pointer events so mouse, touch and pen all work, and let up-and-down scrolling still pass through. Offer an undo, and a button for people who cannot drag. If the visitor has reduced motion turned on, remove the row at once without sliding. Match the settings listed below.

- **README What it is:** rewritten:

  > Swipe to dismiss removes a list item when you drag it sideways. While you drag, the card follows your finger exactly; when you let go, it either flies off the edge while its row closes up, or springs back into place. A long drag or a quick flick removes it. It is the gesture behind swipe-to-delete in mail and message apps.

- **README Key parameters:** (the old Velocity threshold, Fly-off distance and Collapse duration rows go: they are not settings; the flick moves into the first row)

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Distance to delete | Medium | How far a card must be dragged before letting go deletes it: short is 20%, medium 35% and long 50% of its width; a quick flick deletes it from a shorter drag |
  | Shows a Delete label | on | A red strip with the word Delete shows behind the card while it is dragged |

- **README See also:** the first link's text changes from "Drawer Slide" to the page's real title.
  - [Drawer / Panel Slide](../drawer-slide/) — another panel moved by a gesture
  - [Modal Expand](../modal-expand/) — a window that grows out of the button you pressed
  - [Button Press Scale](../button-press-scale/) — a button that shrinks as you press it
  - [Toggle / Switch Slide](../toggle-switch/) — a smaller control that slides and settles
- **README How it works:** unchanged
- **README Production notes:** a new bullet after "Collapse the row, not the card": "**Why the demo animates height**: the list closing up is the effect itself, so the row's height goes to zero, an exception to animating only transform and opacity; it stays cheap because only one short row changes at a time, the card itself moves with transform and opacity, and the row is removed as soon as its height reaches zero." The rest is unchanged.
- **Category line:** `04.22 · Micro-Interactions`
- **Pager:** Previous: Error Shake (`../error-shake/`) · Next: Hamburger Menu Toggle (`../hamburger-menu-toggle/`)

---

## hamburger-menu-toggle — Hamburger Menu Toggle

- **Kind:** do it, step 1 "Click it" — the icon changes only when the visitor presses it.
- **Description:** Three lines turn into an X as the menu opens. Best for mobile menus.
- **Step 1 help line:** Press the button to open the menu and again to close it, or press Show me.
- **Player bar:** Show me · Slow motion (css). No Reset: pressing the button again closes the menu.
- **Show me:** `toRest()` closes the menu at once, with the transitions of the lines, the menu, its items and `.pair` switched off, so pressing Show me while the menu is open does not leave the button raised through the run. Today's click handler becomes a `toggle()` function, which the button and the run both call. Then:
  - at once: `toggle()` opens: the lines cross, and the menu drops in;
  - `later(toggle, Speed + 210, 1200)`: `toggle()` closes (the 210ms is the last menu item's delay), and the run ends. About 2.1 s from press to rest at the defaults.

  On `hb:input`: `stopRun()` only. The menu stays as it is.
- **Slow motion:** css. The movement is Speed + 210ms (the lines, and the last menu item's delay); the 1200ms is a hold. A slowed run takes about 3.9 s.
- **Reduced motion:** the demo's rule stays, and it lists the new `.pair` as well: the icon, the menu and the pair switch at once.
- **Stage font:** site font (no rule to change).
- **Stage:** the button and the menu stay. The "State: closed" readout goes, with its rules.
  - **The menu opens with transform and opacity instead of `max-height`** (CLAUDE.md).
    - `.menu` loses `max-height`, `overflow:hidden` and their transition, and keeps its full height in the layout.
    - It gets `opacity:0;transform:translateY(-8px);visibility:hidden;transition:opacity var(--dur) var(--ease),transform var(--dur) var(--ease),visibility 0s linear var(--dur)`.
    - `.menu.show` gets `opacity:1;transform:none;visibility:visible;transition:opacity var(--dur) var(--ease),transform var(--dur) var(--ease),visibility 0s`, so the closed menu is hidden from screen readers too.
    - The items keep their staggered slide and fade.
  - **The button stays centred at rest, as today, with transforms only.**
    - The button and the menu are wrapped in a new `.pair`: a centred flex column with `width:100%` and `gap:20px`, in place of the stage's 28px gap. The stage centres the pair. Without `width:100%` the pair would shrink to the 76px button, and the menu's `width:100%;max-width:280px` would shrink with it. With it, the menu is 280px wide on computers, 277px on a 375px phone and 222px on a 320px phone.
    - At rest the pair is moved down by half of the menu and its gap, so the button sits in the middle: `.pair{transform:translateY(calc(50% - 38px));transition:transform var(--dur) var(--ease)}`. Here 50% is half the pair's own height, and 38px is half the 76px button.
    - When the menu opens, `.pair:has(> .menu.show){transform:none}` slides the pair up with the same timing as the menu's fade and slide. So the pair re-centres as it does today, where the button rises as the menu grows.
  - `.menu` gets `flex-shrink:0` (today's has none). The pair is 278px tall (76 + 20 + 182), so the open menu and the button are centred in the 300px phone stage. Today the open menu is squeezed into what is left of the stage, which cuts off its last item on phones and short laptops (measured).
  - Short laptop windows get a 260px stage from the shared stylesheet, where the open pair (278px) would be cut off 10px at the top and the bottom. `@media (min-width:601px) and (max-height:640px){.pair{gap:12px}.menu ul{gap:4px}.menu li{padding:10px 14px}}` makes it 248px, which fits the 258px inside the stage with 5px to spare at each end (the width condition keeps portrait phones, whose 300px stage already fits the 278px pair, on the normal layout) (measured in a 1366×580 window). The stage's height does not change.
  - The old phone rule (`height:auto;min-height:400px`) goes.
  - `hb-dots`: yes. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long the lines take to turn into an X. | `--dur`: 550ms / 340ms / 200ms |
| Feel | Choice buttons | Gentle · Springy · Smooth · Even | Gentle | Springy lets the X overshoot a little, then settle. | `--ease`: `cubic-bezier(.65,0,.35,1)` / `cubic-bezier(.34,1.56,.64,1)` / `ease-out` / `linear` |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Line thickness | Choice buttons | Thin · Medium · Thick | Medium | Thicker lines read better at small sizes. | `--bar-h`: 2px / 4px / 6px |

- **Removed:**
  - The note, and the help text under the controls.
  - The State readout.
  - The Duration and Bar thickness sliders. They become Speed and Line thickness.
  - The Easing menu. It becomes Feel.
- **Good for:** Mobile menus · Compact headers · Side panels · **Avoid on:** Wide desktop menus
- **Prompt:**

  > Add a menu button whose three lines turn into an X to [the menu button in your header]. When it is pressed, the top and bottom lines move to the middle and turn to cross each other while the middle line fades away, and pressing it again reverses the change. Use the same three lines for both states, moving and turning them rather than swapping icons, and move each outer line exactly to the middle so the X meets at its center. Make it a real button that tells screen readers whether the menu is open. If the visitor has reduced motion turned on, switch between the two icons without movement. Match the settings listed below.

- **README What it is:** keep
- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Speed | Normal | How long the change takes: slow is 550ms, normal 340ms and fast 200ms; below about 200ms it snaps and above 500ms it drags |
  | Feel | Gentle | Gentle eases in and out; Springy lets the X overshoot a little, then settle; Smooth slows to a stop; Even keeps one steady speed |
  | Line thickness | Medium | The lines are 2px, 4px or 6px thick; thicker lines read better at small sizes |

- **README See also:** each link gets a phrase, and the second link's text changes from "Drawer Slide" to the page's real title.
  - [Toggle / Switch Slide](../toggle-switch/) — a switch that slides between on and off
  - [Drawer / Panel Slide](../drawer-slide/) — the side panel such a button often opens
  - [Modal Expand](../modal-expand/) — a window that grows out of the button you pressed
- **README How it works:** the snippet's open-state lines take today's calculation, which follows Line thickness (today's `translateY(16px)` is right only for 4px lines). The snippet becomes:

  ```css
  .bar{transition:transform var(--dur) var(--ease),opacity calc(var(--dur)*.6) var(--ease)}
  /* Half the 36px box minus half a line, so the lines meet at any thickness */
  .burger[aria-expanded="true"] .bar.top{transform:translateY(calc(18px - var(--bar-h)/2)) rotate(45deg)}
  .burger[aria-expanded="true"] .bar.mid{opacity:0;transform:scaleX(.2)}
  .burger[aria-expanded="true"] .bar.bot{transform:translateY(calc(var(--bar-h)/2 - 18px)) rotate(-45deg)}
  ```

  The prose stays, except the last sentence of the first paragraph (final fix wave, below).
- **README Production notes:** unchanged
- **Final fix wave (after the category review):**
  - README How it works: "Because only `transform` and `opacity` change, the morph stays on the compositor" was true of the bars only; the button's border color and the menu's visibility change too. The sentence now says the bars change only `transform` and `opacity`, so the morph stays on the compositor, and that around it the button's border turns orange with a color transition and the menu opens with `opacity` and `transform` (plus `visibility`, so a closed menu is out of reach). The page is unchanged.
- **Category line:** `04.23 · Micro-Interactions`
- **Pager:** Previous: Swipe to Dismiss (`../swipe-to-dismiss/`) · Next: Theme Toggle Morph (`../theme-toggle-morph/`)

---

## theme-toggle-morph — Theme Toggle Morph

- **Kind:** do it, step 1 "Click it" — the icon changes only when the visitor presses it.
- **Description:** A sun turns into a moon as the colors switch to dark. Best for theme buttons.
- **Step 1 help line:** Press the sun to switch to dark and the moon to switch back, or press Show me.
- **Player bar:** Show me · Slow motion (css). No Reset: pressing the button again switches back to light, and Show me starts from light; today's "Reset to light" goes.
- **Show me:** `toRest()` switches to light at once, without the transitions (`setDark(false)`). Then:
  - at once: `setDark(true)`, as a press does: the sun becomes the moon, and the card flips to dark;
  - `later(back, Speed, 1000)`: `setDark(false)`, and the run ends. About 2 s from press to rest at the defaults.

  On `hb:input`: `stopRun()` only.
- **Slow motion:** css. The rays, the cut-out circle, the card flip and the button's color slow down; the change is the run's movement (Speed) and the 1000ms is a hold. A slowed run takes about 4 s.
- **Reduced motion:** the demo's rule stays: the icon and the card switch at once.
- **Stage font:** site font (no font rule to change). The card's `.face .st` ("preview card") goes up to 11px (was 9px).
- **Stage:** the button and the flip card stay. The state label ("Light theme active") goes: it is a readout, and the button's own label says what it will do. That label is the button's `aria-label`, an action ("Switch to dark theme", then "Switch to light theme"), which `setDark()` sets together with the class. The button has no `aria-pressed`: a toggle's name must not change, and with both a screen reader says "Switch to light theme, toggle button, pressed", which contradicts itself.
  - To fit, `--toggle-size` becomes `clamp(72px,12vw,104px)` (the Toggle Size slider goes; see Removed), the card's width becomes `min(220px,80%)` (was `min(260px,80%)`) and the stage's `gap` becomes `clamp(20px,4vh,40px)` (was `clamp(28px,5vh,52px)`). Measured: today the button and the card need 327px on a short laptop, which fills the 327px stage from edge to edge, and 311px on a phone, which overflows its 300px stage. After the change they take about 296px on a short laptop and 270px on a phone.
  - The card's face texts stay; the card is `aria-hidden`, as today.
  - The old phone rule (`height:auto;min-height:440px`) goes.
  - `hb-dots`: yes. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long the sun takes to become a moon. | `--morph-dur`: 800ms / 500ms / 300ms |
| Feel | Choice buttons | Gentle · Springy · Even | Gentle | Springy overshoots a little, then settles. | `--morph-ease`: `cubic-bezier(.4,0,.2,1)` / `cubic-bezier(.34,1.56,.64,1)` / `linear` |

**More options**

None: leave out the `details.hb-options` block.

- **Removed:**
  - The note.
  - The state label.
  - "↺ Reset to light".
  - The Morph Duration slider. It becomes Speed.
  - The Easing menu. It becomes Feel. "Ease in-out" goes: it looked nearly the same as the default curve, now Gentle.
  - The Toggle Size slider. The icon now follows the screen size, from 72px on phones to 104px on wide screens, and its size does not change the effect.
- **Good for:** Theme buttons · Settings · Headers · **Avoid on:** Dense forms · Icons without labels
- **Prompt:**

  > Add a theme toggle whose icon turns from a sun into a moon to [the button that switches your site between light and dark]. When it is pressed, the sun's rays shrink into its center while a circle slides across the sun and cuts it into a crescent, so the sun becomes the moon instead of being swapped for another icon. Switch the page's colors at the same moment and at the same pace. Make it a real button whose label says what pressing it will do, and remember the visitor's choice for their next visit. If the visitor has reduced motion turned on, switch the icon and the colors without movement. Match the settings listed below.

- **README What it is:** rewritten:

  > A theme toggle morph is one icon that turns from a sun into a crescent moon when you switch a site from light to dark. The sun's rays shrink into its center while a hidden circle slides across the sun and cuts it into a crescent, so the two states are clearly the same shape changing. In the demo, a small preview card flips to its dark side at the same time.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Speed | Normal | How long the change takes: slow is 800ms, normal 500ms and fast 300ms; under about 200ms the crescent forms too fast to see, and over 800ms it drags |
  | Feel | Gentle | Gentle eases in and out; Springy overshoots a little, then settles; Even keeps one steady speed |

- **README See also:** each link gets a phrase.
  - [Toggle / Switch Slide](../toggle-switch/) — a switch that slides between on and off
  - [Hamburger Menu Toggle](../hamburger-menu-toggle/) — three lines that turn into an X
  - [Checkmark Draw](../checkmark-draw/) — a tick that draws itself
- **README How it works:** one sentence changes. "Only `transform` and `opacity` animate." becomes "The rays, the disc, the cut-out circle and the card change only `transform` and `opacity`. The icon's color fades from orange to lavender through a `color` transition on the button, which the SVG picks up with `currentColor`." The rest is unchanged.
- **README Production notes:** the first sentence changes. "The control is a real `<button>` with `aria-pressed` reflecting the current mode and an `aria-label` that names the *action* ("Switch to dark theme"), updated on each toggle so screen readers announce the change." becomes "The control is a real `<button>` whose `aria-label` names the *action* ("Switch to dark theme") and changes with each press, so screen readers say what pressing it will do; leave `aria-pressed` off, because a toggle's name must not change and "Switch to light theme, pressed" contradicts itself (for `aria-pressed`, use a fixed name such as "Dark theme")." Later in the paragraph, "set the class and `aria-pressed`" becomes "set the class and the label". The rest is unchanged.
- **Category line:** `04.24 · Micro-Interactions`
- **Pager:** Previous: Hamburger Menu Toggle (`../hamburger-menu-toggle/`) · Next: Copy to Clipboard (`../copy-to-clipboard/`)

---

## copy-to-clipboard — Copy to Clipboard

- **Kind:** do it, step 1 "Click it" — the button confirms only when the visitor presses it.
- **Description:** Copy turns into a tick and Copied, then changes back. Best for codes and links.
- **Step 1 help line:** Press Copy and watch the button confirm, then change back, or press Show me.
- **Player bar:** Show me · Slow motion (css). No Reset: the button changes back by itself.
- **Show me:** plays the confirmation without copying anything. `toRest()` removes `copied` at once, without the transitions. Then the run adds `copied` to the button and starts the button's own revert timer (`timer`, Time before it changes back), exactly as a successful copy does. The run is only that step, so it ends at once (no run timer is left), and the button changes back on its own timer: about 1.8 s from start to rest at the defaults (1.3 s to 2.8 s).
  - It never writes to the clipboard: that would replace what the visitor copied, and browsers refuse a copy nobody pressed for.
  - It never writes "Copied to clipboard" into the live region.
  - A real press of Copy during the confirmation takes over the same timer, as today. `hb:input` has nothing to stop.
- **Slow motion:** css. The icon change, the label change, the color change and the pulse slow down. The button's revert timer, for a real copy and for Show me alike, counts the 520ms pulse as movement and the rest as a hold: it waits 520ms × (3 while Slow motion is on) + (Time before it changes back − 520ms). So the button never changes back before the slowed pulse has ended; without Slow motion nothing changes. A slowed run takes about 3.4 s.
- **Reduced motion:** the demo's rule stays: the icon and label swap without movement or pulse.
- **Stage font:** site font. `.copy-btn` gets `font-family:inherit` (was `var(--mono)`); `pre` goes with the snippet (see Stage).
- **Stage:** rewritten, because the page shows no code. Today the stage shows a five-line JavaScript snippet ("snippet.js").
  - It becomes an invite code: a small box with the label "Your invite code" (`--ui-muted`, 12px) and the code "MOTION-2026" (20px, weight 700), with the Copy button beside it. The box and the button sit in a centred row that wraps on narrow screens.
  - The code element keeps `id="snippet"`, so Copy copies "MOTION-2026". The button's `aria-label` becomes "Copy invite code" (today's says "Copy code snippet").
  - The "snippet.js / click copy to grab it" header goes, and so does the line "Uses navigator.clipboard.writeText with a document.execCommand fallback." (a note in code words).
  - The visually hidden live region stays.
  - The stage's own rule becomes `display:flex;align-items:center;justify-content:center;padding:24px`. It had no fixed height; now it has the default one.
  - `hb-dots`: yes.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How quickly the icon and label change. | `--dur`: 450ms / 280ms / 170ms |
| Time before it changes back | Choice buttons | Short · Medium · Long | Medium | How long Copied! stays before the button resets. | `revert`: 1000 / 1500 / 2500 (ms; the revert timer counts its first 520ms as movement, see Slow motion) |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Feel | Choice buttons | Springy · Smooth · Even | Springy | Springy gives the tick a small bounce. | `--ease`: `cubic-bezier(.34,1.4,.5,1)` / `ease-out` / `linear` |

- **Removed:**
  - Both notes.
  - The code snippet, its header and the line about the clipboard code.
  - The Revert delay and Animation duration sliders. They become Time before it changes back and Speed.
  - The Easing menu. It becomes Feel. "Ease in-out" goes: on a change this short it looked the same as Ease out, now Smooth.
- **Good for:** Share links · Invite codes · Code blocks · API keys · **Avoid on:** Slow actions · Important saves
- **Prompt:**

  > Add copy feedback to [the Copy button next to your code, link or key]. When the copy succeeds, turn the button's icon into a tick and its label into Copied!, with a brief flash of color, then change it back on its own after a moment so it is ready to use again. Stack both icons and both labels in the same place so the change never shifts the layout. Show the confirmation only once the copy has really worked, tell screen readers with a short status message, and say so if copying fails. If the visitor has reduced motion turned on, swap the icon and label without movement. Match the settings listed below.

- **README What it is:** rewritten:

  > Copy feedback is the short confirmation a Copy button gives after it copies something. The clipboard icon turns into a tick, the label changes from Copy to Copied! and a brief flash of color marks the moment. After a second or two the button changes back, ready to use again.

- **README Key parameters:** (the old Pulse row goes: it is not a setting)

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Speed | Normal | How long the icon and label take to change: slow is 450ms, normal 280ms and fast 170ms |
  | Time before it changes back | Medium | How long Copied! stays: short is 1 second, medium 1.5 and long 2.5; under a second feels rushed, and over about three seconds it lingers |
  | Feel | Springy | Springy gives the tick a small bounce; Smooth slows to a stop; Even keeps one steady speed |

- **README See also:** the phrases lose their code words.
  - [Checkmark Draw](../checkmark-draw/) — a tick that draws itself
  - [Button Press Scale](../button-press-scale/) — a button that shrinks as you press it
  - [Success Confetti](../success-confetti/) — a bigger celebration for a bigger moment
- **README How it works:** unchanged. The snippet still copies `snippet.innerText`, which is now the invite code.
- **README Production notes:** unchanged
- **Category line:** `04.25 · Micro-Interactions`
- **Pager:** Previous: Theme Toggle Morph (`../theme-toggle-morph/`) · Next: Star Rating (`../star-rating/`)

---

## star-rating — Star Rating

- **Kind:** do it, step 1 "Click it" — the stars fill and pop only as the visitor points at them and chooses one.
- **Description:** Stars fill up to your pointer and pop when you choose. Best for reviews.
- **Step 1 help line:** Point along the stars and click or tap one to choose, or press Show me.
- **Player bar:** Show me · Slow motion (css). No Reset: a click, or the arrow, Home and End keys, sets any rating.
- **Show me:** `toRest()` sets the rating back to 3 (`rating=3; commit(false)`). Then an invisible pointer sweeps along the row (n is Number of stars). The sweep's steps and the wait for the pop are movement; the 1200ms is a hold:
  - `later(step, i × 120, 0)` for i = 0 to n − 1: `render(i + 1)`, and `later(step, n × 120, 0)`: `render(n − 1)`, as the pointer comes back one star;
  - `later(choose, (n + 1) × 120, 0)`: `rating = n − 1` (or n − 0.5 while Allows half stars is on) and `commit(true)`, which pops that star;
  - `later(back, (n + 1) × 120 + 420, 1200)`: `rating = 3; commit(false)`, and the run ends. About 2.5 s from press to rest with five stars (the last fill takes 180ms).

  The run does not call `rate.focus()`. It also stops on a trusted `pointermove` over the stage, as on the Hover it pages, because the row's own hover preview would fight the sweep. On that or on `hb:input`: `stopRun()` and `render(rating)`, so the stars show the committed rating.
- **Slow motion:** css. The fill's color change and the pop slow down, and so do the sweep and the wait for the pop (movement); the 1200ms hold stays. A slowed run takes about 5.2 s from press to rest with five stars.
- **Reduced motion:** the demo's rule stays: the stars fill at once, with no pop.
- **Touch:** already Pointer Events. The row's `touch-action:none` lets a finger dragged along it preview, and a tap chooses.
- **Stage font:** site font. `.value` drops `var(--disp)` and `.value small` drops `var(--mono)`.
- **Stage:** the stars and the score under them ("3.0 / 5") stay. The score is part of the control: it gives the rating in numbers as well as color, as the README's accessibility note says.
  - The hint line ("Click a star, or focus the control…") goes; its words move to the help line.
  - The Committed readout goes.
  - `hb-dots`: yes. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Pop size | Choice buttons | Small · Medium · Large | Medium | How much the chosen star grows as it pops. | `--pop`: 1.15 / 1.35 / 1.6 |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How quickly each star fills with color. | `--fill-dur`: 300ms / 180ms / 110ms |
| Allows half stars | Switch | on / off | off | The left half of a star gives half a point. | today's half-star handler: `step` 0.5 / 1 (turning it off rounds the rating, then `commit(false)`) |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Number of stars | Choice buttons | Three · Five · Ten | Five | Five is the usual scale; ten gives finer steps. | `count`: 3 / 5 / 10, then `build()` |

- **Removed:**
  - The note.
  - The hint line on the stage.
  - The Committed readout.
  - The Star count, Pop intensity and Fill duration sliders. They become Number of stars, Pop size and Speed; the fill no longer reaches zero.
  - The panel's own half-star switch. It becomes Allows half stars.
- **Good for:** Reviews · Surveys · Feedback forms · Media ratings · **Avoid on:** Precise scores
- **Prompt:**

  > Add a star rating to [the review or feedback form]. As the pointer moves along the row, fill the stars up to the one under it so the choice shows before it is made, and bring back the chosen rating when the pointer leaves. Clicking or tapping a star chooses that rating and makes the star pop: it grows briefly, dips a little below its size and settles. On touch screens, a finger dragged along the row previews too. Make the row one control that the arrow keys can change, and show the rating as a number as well, so it never depends on color alone. If the visitor has reduced motion turned on, fill the stars without the pop. Match the settings listed below.

- **README What it is:** rewritten:

  > A star rating lets someone give a score by choosing a star. As the pointer moves along the row, the stars fill up to the one under it, so the choice shows before it is made; clicking or tapping a star chooses it and makes it pop. The arrow keys change the rating too, and a setting lets each star count in halves.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Pop size | Medium | How big the chosen star grows as it pops: 1.15, 1.35 or 1.6 times its size; above about 1.6 it looks rubbery |
  | Speed | Normal | How long each star takes to fill with color: slow is 300ms, normal 180ms and fast 110ms; it sets how smoothly the fill follows the pointer |
  | Allows half stars | off | Pointing at the left half of a star gives half a point, and the arrow keys move in halves |
  | Number of stars | Five | Three, five or ten stars; five is the usual scale |

- **README See also:** the first link's text changes from "Heart Burst" to the page's real title, and the phrases get plainer.
  - [Heart / Like Burst](../heart-burst/) — a like button that bursts into small hearts
  - [Button Press Scale](../button-press-scale/) — a button that shrinks as you press it
  - [Toggle / Switch Slide](../toggle-switch/) — another small control that animates its state
- **README How it works:** unchanged
- **README Production notes:** unchanged, except the last sentence of the Touch targets bullet (final fix wave, below)
- **Final fix wave (after the category review):**
  - The row's focus rule keeps a transparent outline: `.stage .rate:focus-visible{outline:2px solid transparent;…}` in place of `outline:none`, as on Segmented Control. Forced-colors mode removes `box-shadow`, so the row had no focus ring there; now the outline shows as a ring in the system color. Outside forced-colors mode the box-shadow ring looks exactly as before and the transparent outline is invisible.
  - The rule that wraps more than five stars into two equal rows now covers windows up to 870px wide (was 845px). With classic scrollbars, ten stars wrapped nine and one between 846px and 863px: they fit one row from 864px (846px without scrollbars), and 870px leaves room for wider scrollbars. Up to 870px ten stars now sit in two rows of five.
  - README Touch targets: the last sentence no longer says hover styling is gated behind `(hover: hover)`, because the page has had no `:hover` rule since 89c0379. It says there is no CSS `:hover` style, so nothing stays painted after a tap, that the preview comes from `pointermove`, and that a finger's drag asks `document.elementFromPoint` which star is under it.
- **Category line:** `04.26 · Micro-Interactions`
- **Pager:** Previous: Copy to Clipboard (`../copy-to-clipboard/`) · Next: Toast Notification (`../toast-notification/`)

---

## toast-notification — Toast Notification

- **Kind:** do it, step 1 "Click it" — a toast appears only when the visitor presses the button on the stage.
- **Description:** Short messages slide into a corner, then leave on their own. Best for updates.
- **Step 1 help line:** Send a toast, then tap or swipe it away early, or press Show me.
- **Player bar:** Show me · Reset. No Slow motion: each toast's countdown bar is a CSS animation that decides when it leaves, so slowing the stage would also triple its time on screen.
- **Show me:** `toRest()` removes any toasts at once (without their exit). Then the run presses the stage's button once: `spawn(DEMO)` brings in a neutral example, `DEMO = ['ok','Example','A toast like this confirms an action.']`. `spawn()` takes an optional `[type, title, text]` message and, given none, picks one of `TYPES` at random, as today. So a run is always the same, and screen readers, which hear every toast in the `role="status"` stack (on arrival too), hear an honest example rather than a pretend "Saved". The run is only that press, so it ends at once (no run timer is left). The toast then lives like any other: it comes in, its bar counts down Time on screen, and it leaves by itself.
  - From press to rest takes about 4.3 s at Medium (2.8 s at Short, 6.8 s at Long): the countdown starts as the toast arrives, and leaving takes 300ms. That is longer than most runs, because leaving on its own is the point of a toast.
  - `hb:input` has nothing to stop.
- **Reset:** dismisses every toast, as "Dismiss all" did (each leaves the way it came), after `stopRun()`.
- **Slow motion:** none.
- **Reduced motion:** the demo's rules stay: toasts appear and disappear without movement, the bar is hidden, and a timer dismisses each one.
- **Touch:** already Pointer Events: a drag past 35% of its width or a tap dismisses a toast. Holding a finger on a toast pauses its countdown (the `paused` class). Pointing at a toast pauses it too, inside `@media (hover: hover)`, as today.
- **Stage font:** site font. `.toast .ic` and `.toast .ti` drop `font-family:var(--disp)`; `.toast .x` and the new `.send` get `font-family:inherit`. `.toast .ms` goes up to 11px (was 10.5px).
- **Stage:** the corner stack stays.
  - The hint "Trigger a toast →" pointed at the old panel, so it goes, and so do the script's lines that hide and show it.
  - The old panel's "Trigger toast" button moves onto the stage as `<button class="send" id="send" type="button">Send a toast</button>`, with the old button's look (accent background, dark text, at least 44px tall), so the demo still works without the panel. Its listener is `()=>spawn()`: `addEventListener('click', spawn)` would pass the click event as the message.
  - The button sits at the edge opposite the corner, centred across: 16px from the bottom while toasts stack in a top corner, and 16px from the top while they stack in a bottom corner (the Corner handler toggles a class such as `at-top` on it).
  - `.toaster` gets `pointer-events:none` and `.toast` `pointer-events:auto`, so the stack's empty box no longer covers the button.
  - The stage's own `min-height:min(62vh,480px)` goes, because the page owns the height. Its own rule sets `--hb-stage-h-phone:420px`, and `position:relative;overflow:hidden` and its radial background stay.
  - Measured with the 11px message text on the 420px phone stage: four toasts end 281px down on a 375px phone, and 338px down on a 320px phone, where every message wraps to two lines (74px toasts). The button sits at 359–403px on every phone, so it clears both and its whole face stays pressable. At about 380px it would start at 319px, and the fourth toast would cover its top on a 320px phone. On tablets and computers the stack (300px wide, in a corner) never reaches the button, and four toasts fit every stage.
  - `hb-dots`: no, because the stage keeps its radial background.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Corner | Choice buttons | Top left · Top right · Bottom left · Bottom right | Top right | Where toasts appear and stack. | `corner`: `'tl'` / `'tr'` / `'bl'` / `'br'` (the stack's class `toaster tl` … at once, as today) |
| How it comes in | Choice buttons | Slides · Fades · Grows | Slides | How each toast arrives and leaves. | `style`: `'slide'` / `'fade'` / `'scale'` |
| Time on screen | Choice buttons | Short · Medium · Long | Medium | How long a toast stays before it leaves. | `dur`: 2.5 / 4 / 6.5 (seconds; each new toast's `--dur`) |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Most at once | Choice buttons | Two · Three · Four | Four | The oldest leaves when a new one needs room. | `limit`: 2 / 3 / 4, then `enforce()` |

- **Removed:**
  - The note.
  - The hint on the stage.
  - The Corner and Animation menus. They become Corner and How it comes in.
  - The Auto-dismiss and Stack limit sliders. They become Time on screen and Most at once. Five and six go: a stack of five (about 347px) does not fit the 327px short-laptop stage, and the newest toast would be cut off. One goes too: with room for a single toast, each new one pushes the last out, and the stacking never shows.
  - "Trigger toast" moves onto the stage as Send a toast.
  - "Dismiss all". The player bar's Reset replaces it.
- **Good for:** Save confirmations · Upload updates · Sync notices · **Avoid on:** Errors that need action · Long messages
- **Prompt:**

  > Add toast notifications to [the actions in your app that should be confirmed quietly, such as saving]. Each toast comes into a corner of the screen with a short message and a thin bar that empties as it counts down, then leaves on its own. New toasts stack; when one leaves, the others glide over to close the gap, moved with transforms rather than by changing the layout. Pause the countdown while the pointer is over a toast, and let a tap, a sideways swipe or a close button dismiss it early. Announce each message to screen readers without moving focus. If the visitor has reduced motion turned on, show and hide toasts without movement. Match the settings listed below.

- **README What it is:** rewritten:

  > A toast is a small message that comes into a corner of the screen, stays for a few seconds and then leaves on its own, while a thin bar counts down the time it has left. Toasts stack when several arrive close together, and when one leaves, the others glide over to close the gap. A tap, a swipe or its close button dismisses one early.

- **README Key parameters:** (the old Swipe threshold and Reflow duration rows go: they are not settings)

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Corner | Top right | Where toasts appear and stack; in the bottom corners the newest sits nearest the corner |
  | How it comes in | Slides | Slides in from its corner's side, fades in, or grows from slightly smaller; it leaves the same way |
  | Time on screen | Medium | How long each toast stays: short is 2.5 seconds, medium 4 and long 6.5; its bar counts down this time |
  | Most at once | Four | Two, three or four; when one more arrives, the oldest leaves |

- **README See also:** the first link's text changes from "Drawer Slide" to the page's real title, and the phrases get plainer.
  - [Drawer / Panel Slide](../drawer-slide/) — a bigger panel that slides in from an edge
  - [Modal Expand](../modal-expand/) — a window that must be closed before you go on
  - [Success Confetti](../success-confetti/) — a celebration for a finished task
- **README How it works:** unchanged
- **README Production notes:** unchanged
- **Category line:** `04.27 · Micro-Interactions`
- **Pager:** Previous: Star Rating (`../star-rating/`) · Next: Segmented Control (`../segmented-control/`)

---

## segmented-control — Segmented Control

- **Kind:** do it, step 1 "Click it" — the highlight moves only when the visitor picks an option.
- **Description:** A highlight slides to the option you pick. Best for switching views.
- **Step 1 help line:** Press an option or move with the arrow keys, or press Show me.
- **Player bar:** Show me · Slow motion (css). No Reset: pressing the first option brings the demo back.
- **Show me:** `toRest()` chooses the first option at once (`current=0; move(0,false); paint()`). Then:
  - at once: `current = n − 1; move(n − 1, true); paint()` chooses the last option, so the highlight slides the whole way (n is Number of options);
  - `later(back, Speed, 1200)`: `current = 0; move(0, true); paint()` chooses the first again, and the run ends. About 1.9 s from press to rest at the defaults.

  The run uses `move()` and `paint()`, not `select()`, which would move the keyboard focus. On `hb:input`: `stopRun()` only.
- **Slow motion:** css. The slide and the labels' color change slow down; the slide is the run's movement (Speed) and the 1200ms is a hold. A slowed run takes about 3.2 s.
- **Reduced motion:** the demo's rule stays: the highlight jumps.
- **Stage font:** site font. `.seg-opt` gets `font-family:inherit` (was `var(--mono)`).
- **Stage:** the control stays; the "Selected" readout goes.
  - The control's class `seg` becomes `seg-track`, and the rules `.seg`, `.seg.underline .seg-ind` and `.seg.underline .seg-opt[aria-checked="true"]` follow, as does the script's `classList.toggle('underline', …)`. The shared stylesheet styles `.hb-page .seg` and its buttons as Try it choice buttons (borders, gaps, 15px text), which would restyle the demo; this was seen in the browser. `.seg-opt` and `.seg-ind` keep their names.
  - The stage's own `min-height` goes. Its padding `clamp(28px,6vw,64px) 20px` stays, and a phone rule sets its side padding to 10px (the old phone rule had 12px). Measured at 320px wide: five options need 252px and now have 266px. At 20px they had 246px and were squeezed into it, their labels overlapping. At 375px they need 256px of 321px.
  - `hb-dots`: yes. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long the highlight takes to slide. | `--dur`: 550ms / 340ms / 200ms |
| Feel | Choice buttons | Springy · Smooth · Even | Springy | Springy runs a little past, then settles. | `--ease`: `cubic-bezier(.5,1.6,.4,1)` / `ease-out` / `linear` |
| Highlight | Choice buttons | Pill · Underline | Pill | A filled pill, or a thin line under the option. | the track's `underline` class: off / on (then `move(current,false)` on the next frame, as today) |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Number of options | Choice buttons | Two · Three · Four · Five | Four | Up to five short options fit on one line. | `build(n)`: 2 / 3 / 4 / 5 |

- **Removed:**
  - The note, and the help text under the controls.
  - The Selected readout.
  - The Segments slider. It becomes Number of options. Six goes: on a 320px phone six options need 272px, more than the 266px there is even with the 10px phone padding.
  - The Slide duration slider. It becomes Speed.
  - The Easing menu. It becomes Feel. "Material smooth" and "Ease in-out" go: on this short slide they looked nearly the same as Ease out, now Smooth.
  - The Indicator style menu. It becomes Highlight.
- **Good for:** View switchers · Filters · Date ranges · **Avoid on:** Many options · Long labels
- **Prompt:**

  > Add a segmented control to [the row of options people switch between, such as Day, Week and Month]. Show the options side by side with one highlight behind the chosen one. When another option is chosen, slide the highlight over to it and stretch or shrink it to that option's width, while the labels' colors cross over as it lands. Measure the chosen option and move the highlight with transforms only, measuring again when fonts load or the window resizes. Make it one group of radio buttons that the arrow keys move through. If the visitor has reduced motion turned on, move the highlight without sliding. Match the settings listed below.

- **README What it is:** rewritten:

  > A segmented control is a row of options where exactly one is chosen, marked by a highlight behind it. When you choose another option, the highlight slides over to it and stretches to its width while the labels change color, so the change reads as one thing moving. It is the switch behind view pickers such as Day, Week and Month.

- **README Key parameters:** the table is replaced (today's has other columns and code names). The paragraph under today's table ("A spring curve with slight overshoot (control-point y > 1)…") moves to the end of How it works (see there), so Key parameters holds only the table:

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Speed | Normal | How long the highlight takes to slide: slow is 550ms, normal 340ms and fast 200ms |
  | Feel | Springy | Springy runs a little past the option, then settles; Smooth slows to a stop; Even keeps one steady speed |
  | Highlight | Pill | A filled pill behind the chosen option, or a thin line under it |
  | Number of options | Four | Two to five options; more, or long labels, do not fit on one line |

- **README See also:** each link gets a phrase. The second link's text, "Tab Bar / Underline", is no page's title; it becomes the title of the page it opens.
  - [Toggle / Switch Slide](../toggle-switch/) — a switch that slides between two states
  - [Hover State Animation](../hover-state/) — items that react when the pointer is on them
  - [Accordion Open/Close](../accordion/) — sections that open and close in place
- **README How it works:** unchanged, except that it ends with the paragraph moved from Key parameters, in plain words: "A curve that runs a little past its end (Springy) gives the highlight a sense of momentum; Smooth reads as more restrained. The labels' color change uses the same duration as the slide, so the two never drift apart."
- **README Production notes:** unchanged
- **Category line:** `04.28 · Micro-Interactions`
- **Pager:** Previous: Toast Notification (`../toast-notification/`) · Next: Pull to Refresh (`../pull-to-refresh/`)

---

## pull-to-refresh — Pull to Refresh

- **Kind:** do it, step 1 "Drag it" — the list refreshes only when the visitor pulls it down from its top, or presses its refresh button.
- **Description:** Pulling a list down shows a spinner, then new items. Best for feeds.
- **Step 1 help line:** Drag the list down from the top and let go, or press Show me.
- **Player bar:** Show me · Reset. No Slow motion: the pull follows the visitor's hand, and the spinner turns for as long as the refresh takes.
- **Show me:** while a refresh is under way, Show me does nothing. Otherwise `toRest()` puts the list back to its six first items (`n` back to 0) and scrolls it to the top, as Reset does. The page has no Slow motion, so each step is a hold. Then:
  - at once, over 700ms, frame by frame through `runFrame`: `pull` eases from 0 to 1.25 × Pull distance, slowing as it goes like the rubber band. Each frame calls `setY(pull,false)` and `drawSpin()`, so the spinner fades in and turns, and the hint reads "Release to refresh" past the line;
  - `later(release, 0, 850)`: `release()` marks the refresh as the run's (`demoRefresh=true`) and calls `startRefresh()`, as a release past the line does. It spins for Refresh time, adds the new item at the top and springs back; the list is back up about 2.4 s after the press at the defaults;
  - when that refresh ends, `finishRefresh()` clears `demoRefresh` and runs `later(toRest, 0, 1500)`: the new item shows for 1.5 s, then `toRest()` puts the list back to its six first items, so the run ends at rest, as the preamble says of every run. The step is scheduled as the item arrives, not at the release, so a Refresh time changed during the refresh is counted and the item always shows its full 1.5 s. About 3.6 s after the press at the defaults (3.1 s at Short, 4.4 s at Long). The browser check needs this step: it compares the stage before and after a run, and under reduced motion nothing has run before it, so a run that leaves a seventh item could never match.

  A run's refresh is silent, as the preamble says of every run (it never announces anything that did not really happen): while `demoRefresh` is set, `startRefresh()` leaves the status line alone, and `finishRefresh()` schedules the clean-up and returns before it writes "Updated — 1 new item added.". The Refresh button, a real drag and a refresh the visitor has taken over (`stopRun()` clears `demoRefresh`, and the new item stays) announce as before.

  `running()` is also true from the release until the new item arrives (`demoRefresh`); the clean-up after it is a run timer, so `running()` stays true until that has run. `stopRun()` also clears `demoRefresh`. On `hb:input`: `stopRun()`, so no clean-up follows. During the pull the list then springs back, `pull=0; setY(0,true); drawSpin()`, and the visitor's own drag takes over. Once the refresh has started, it finishes as usual and its new item stays (no spring back is drawn while `refreshing`).
- **Reset:** puts the list back to its six first items (the new ones go, `n` returns to 0) and scrolls it to the top, after `stopRun()`. A refresh under way ends at once: `startRefresh()` keeps its timer in `refreshTimer`, which Reset clears; then the spinner stops, `refreshing` becomes false and the list is set back to 0 without a transition.
- **Slow motion:** none.
- **Reduced motion:** the demo's rules stay: the list snaps back without its tween, and new items appear without sliding in.
- **Touch:** already Pointer Events, claimed only at the top of the list, with `touchmove` blocked once the pull is claimed. The list still scrolls normally.
- **Pull curve:** today's `resist()` moved the list at 1/Resistance of the finger from the first pixel, and the line was 1.83 × Pull distance × Resistance of finger travel away: 235px at Medium/Medium, about the whole height of the feed (201px on the 260px stage, 241px on phones, 268 to 381px on the others). At the defaults a drag that stayed inside the stage refreshed only where the feed is tall: 1280×800, 1440×900, 1024×768 and 768×1024. The curve becomes `function resist(dy){const max=threshold*(1+2.4/resistance);return max*dy/(dy+max)}`: the list follows the finger 1:1 at first and stiffens as the drag grows, and Resistance only sets how fast. Pull distance is still the pull after the curve, and the line is `threshold × (1 + resistance / 2.4)` of finger travel away. For Short · Medium · Long that is 68 · 91 · 113px at Low, 88 · 117 · 147px at Medium and 108 · 144 · 180px at High (checked in Chrome: 3px less springs back, 3px more refreshes). A drag from the middle of the first card to 4px above the stage's bottom edge (about 160px of room on the 260px stages, 170px at 1024×600, 200px on phones, 227px at 1366×657, 280px at 1280×800) therefore refreshes at the defaults on every stage, with a mouse and with a finger, and a 60px drag still springs back. Every combination refreshes inside the stage except Long/High (180px) on the 260px stages (1280×590, 1366×560, 667×375, 812×375) and at 1024×600 (feed 211px): that is the "long drag" the README names. Show me sets `pull` itself, so it does not change.
- **Stage font:** site font. The new Refresh button gets `font-family:inherit`. `.indicator` and `.meta .s` go up to 11px (were 10px).
- **Stage:** the list scrolls inside its own box. The stage's own rule keeps `position:relative;overflow:hidden` and adds `display:flex;flex-direction:column`.
  - The stage becomes a small app screen. At the top is a header bar with the title "Updates" and, at its right, a Refresh button: a ↻ icon, `aria-label="Refresh"`, 44×44px, calling `startRefresh()`. It is today's "↻ Refresh now" moved from the old panel onto the stage; the README calls it the keyboard way to refresh.
  - Below the header, a `.feed` box (`position:relative;flex:1;overflow:hidden`) holds the indicator and the scroller, which move into it unchanged. The indicator therefore comes down from under the header.
  - The status line ("Refreshing…", "Updated — 1 new item added.") stays as a visually hidden `role="status"` region on the stage, so screen readers still hear it.
  - The six first items are in plain words: "Design review moved to 3pm", "Your order has shipped", "Ana replied to your comment", "Weekly report is ready", "Invoice from Northwind paid", "Team notes posted". Today's "Build #482 passed on main" and "Ana commented on your PR" use developer words.
  - The old phone rule (`height:60vh;min-height:380px`) goes.
  - `hb-dots`: no, because the app screen fills the stage. Default height: the list scrolls inside the feed on every screen size, as a feed does (six items need 396px).

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Pull distance | Choice buttons | Short · Medium · Long | Medium | How far to pull before letting go refreshes. | `threshold`: 48 / 64 / 80 (px) |
| Resistance | Choice buttons | Low · Medium · High | Medium | Higher makes the list fight back harder. | `resistance`: 1 / 2 / 3 (how fast the pull curve stiffens, see Pull curve) |
| Spinner | Choice buttons | Ring · Dots · Bars | Ring | The shape that turns while it refreshes. | the spinner's class: `s-ring` / `s-dots` / `s-bars` |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Refresh time | Choice buttons | Short · Medium · Long | Medium | How long it spins before new items arrive. | `dur`: 700 / 1200 / 2000 (ms) |

- **Removed:**
  - The note.
  - The Pull threshold, Resistance and Refresh duration sliders. They become Pull distance, Resistance and Refresh time.
  - The Spinner style menu. It becomes Spinner.
  - "↻ Refresh now" moves onto the stage as the header's Refresh button.
  - The visible status line. It stays for screen readers only.
- **Good for:** Feeds · Inboxes · Notifications · Order lists · **Avoid on:** Desktop-only pages · Lists that rarely change
- **Prompt:**

  > Add pull to refresh to [the scrolling list or feed that should reload]. When the list is already at its top and the visitor drags it down, move it with the finger but make it resist more the further it goes, and show a spinner above it that fades in and turns as it is pulled. Let go past the line and the list stays down while the spinner keeps turning and new items load, then everything slides back up with the new items on top; a shorter pull just springs back. Also offer a refresh button for people who cannot drag. If the visitor has reduced motion turned on, snap back without sliding. Match the settings listed below.

- **README What it is:** rewritten:

  > Pull to refresh reloads a list when you drag it down from its top. As you pull, the list follows your finger but resists more the further it goes, and a spinner above it fades in and turns. Let go past a set distance and the list stays down while the spinner keeps turning and new items load; then it slides back up with the new items on top.

- **README Key parameters:** (the old Resting offset row goes: it is not a setting)

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Pull distance | Medium | How far the list must be pulled before letting go refreshes: short is 48px, medium 64px and long 80px, measured after the resistance |
  | Resistance | Medium | How hard the list fights back as it is pulled: low, medium or high; with a long pull distance and high resistance, it takes a long drag |
  | Spinner | Ring | A turning ring, three blinking dots or four stretching bars |
  | Refresh time | Medium | How long the spinner turns before the new item arrives: short is 700ms, medium 1200ms and long 2000ms |

- **README See also:** the third link's text changes from "Drawer Slide" to the page's real title, and the phrases get plainer.
  - [Swipe to Dismiss](../swipe-to-dismiss/) — the sideways drag that removes an item
  - [Loading Spinner](../loading-spinner/) — spinners on their own
  - [Drawer / Panel Slide](../drawer-slide/) — a panel that slides in from an edge
- **README How it works:** brought in line with the page: the snippet's `resist()` is the pull curve above (so "follows the finger one to one at first" is true), its pointer lines follow the page's `pid` bookkeeping, "refresh duration" reads "refresh time", and the last paragraph names the Refresh button and Show me.
- **README Production notes:** in the "Accessibility alternative" bullet, "this demo wires a "Refresh now" button to the identical code path and announces state through an `aria-live` region" becomes "this demo's Refresh button, in the list's header, runs the identical code path, and a live region announces the state". The rest is unchanged.
- **Category line:** `04.29 · Micro-Interactions`
- **Pager:** Previous: Segmented Control (`../segmented-control/`) · Next: none
