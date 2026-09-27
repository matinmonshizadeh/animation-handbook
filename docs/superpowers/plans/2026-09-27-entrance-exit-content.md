# Entrance & Exit — Content Sheet

This sheet decides, page by page, how the twelve Entrance & Exit pages that still use the first redesign's layout present their settings and words on the guided-steps page. Tasks 4–9 of `2026-09-27-demo-page-rollout-entrance-exit.md` follow each section exactly; Rotate In (`animations/02-entrance-and-exit/rotate-in/`) is the reference for everything a section does not mention.

How to read a section:

- **Sets in the demo** lists one value per choice, in the same order as the choices. A Speed row sets both the script's `dur` (used by the timers) and the CSS `--dur`.
- **Shown only when …** in the Control column means the setting's whole `div.hb-setting` gets the `hidden` attribute while it has no effect, so it also drops out of "Your settings".
- Switches in Try it keep their default in the markup (`checked` when the default is on), as on Rotate In. Only the player bar's Loop and Slow motion start unchecked.
- Loop timings follow today's loop code: "holds X" is the wait after the entrance's own duration, "waits Y" the wait after the exit's.
- **Feel** uses the same plain names on every page: Smooth (slows to a stop), Springy (goes a little past, then settles), Gentle (eases in and out), Even (one steady speed). The exact curve behind each name is in the row.

---

## fade-in-out — Fade In / Fade Out

- **Description:** Fades in to appear and fades out to leave. Best for pop-ups and tooltips.
- **Watch it help line:** default
- **Player bar:** Replay · Loop · Slow motion
- **Loop sequence:** plays in, holds 800ms, plays out, waits 300ms (today's loop with Hold time at its default of 0.8s)
- **Slow motion:** `--dur` and the `dur` part of both loop timers; the 800ms hold and 300ms wait stay

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons | Slow · Normal · Fast | Normal | Slow is easy to follow. Fast feels snappy. | `dur` / `--dur`: 1000ms / 600ms / 350ms |
| Feel | Choice buttons | Smooth · Gentle · Even | Smooth | How the fade speeds up and slows down. | `--ease`: `ease-out` / `ease-in-out` / `linear` |

**More options**

None: leave out the `details.hb-options` block.

- **Removed:** Play in, Play out, Reset and Auto-loop (the player bar replaces them); Hold time (it only paced the loop, which now holds a fixed 800ms); the Status and Opacity readouts; the Duration slider and Easing menu (now Speed and Feel). Feel keeps three of the five old curves: Springy goes (opacity cannot go past fully visible, so it only looked like a faster fade) and the second smooth curve goes (it looked nearly the same as Ease out, which is now Smooth).
- **Stage:** the card stays. Card text: title "Fade In", line "Nothing moves or changes size; it only goes from see-through to solid." (the current title and line use developer terms: opacity, compositor, re-painting, performant). `hb-dots`: yes. Default height.
- **Good for:** Pop-ups · Tooltips · Loaded content · Image swaps · **Avoid on:** Side panels · Urgent alerts
- **Prompt:** keep
- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Speed | Normal | How long the fade takes: slow is 1000ms, normal 600ms and fast 350ms; under 150ms a fade barely registers |
  | Feel | Smooth | Smooth starts quickly and settles gently, the natural feel for an entrance; Gentle eases in and out; Even keeps one steady pace |

- **README See also:**
  - [Slide In](../slide-in/) — travels in from one edge as it fades
  - [Scale In / Zoom In](../scale-in/) — grows from smaller to full size
  - [Blur In](../blur-in/) — sharpens from a blur as it fades in
  - [Clip-Path Reveal](../clip-path-reveal/) — a shape uncovers it, with no fade
- **README How it works:** unchanged

---

## slide-in — Slide In

- **Description:** Travels into place from one edge. Best for side panels and notifications.
- **Watch it help line:** default
- **Player bar:** Replay · Loop · Slow motion
- **Loop sequence:** plays in, holds 800ms, plays out, waits 400ms
- **Slow motion:** `--dur` and the `dur` part of both loop timers; the 800ms hold and 400ms wait stay

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Comes in from | Choice buttons | Top · Bottom · Left · Right | Top | The edge it travels in from. | `dir`: `'top'` / `'bottom'` / `'left'` / `'right'`, then `applyDir()` (sets `--tx`/`--ty` and the card's arrow ↑ ↓ ← →) |
| How far it travels | Choice buttons | Short · Medium · Far | Medium | Short feels subtle; far feels dramatic. | `dist`: 50 / 200 / 400 (px), then `applyDir()` |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | Slow is easy to follow. Fast feels snappy. | `dur` / `--dur`: 1000ms / 600ms / 350ms |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Feel | Choice buttons | Smooth · Springy · Gentle · Even | Smooth | Springy goes a little past its spot, then settles. | `--ease`: `ease-out` / `cubic-bezier(.34,1.56,.64,1)` / `ease-in-out` / `linear` |
| Fades in | Switch | on / off | on | A slide on its own can look mechanical. | `withFade` true / false, then `applyDir()` (sets `--fade` to `0` / `1`) |

- **Removed:** Play in, Play out, Reset and Auto-loop; the Status and Translate readouts; the arrow diagram under Direction (the card's own arrow stays); the Distance and Duration sliders and the Easing menu (now How far it travels, Speed and Feel); the second smooth curve (nearly the same as Ease out, which is now Smooth).
- **Stage:** the card stays, and its arrow icon still follows Comes in from. Card text unchanged. `hb-dots`: yes. Default height.
- **Good for:** Side panels · Notifications · Menus · List items · **Avoid on:** Crowded layouts · Long text
- **Prompt:** rewritten. The old one stated "a short distance away" and "slowing down as it arrives" as fixed; How far it travels and Feel now control them.

  > Add a slide-in entrance to [the element you want to animate]. It should start away from its final position, on the side and at the distance given in the settings, and travel into place so it feels like it came from somewhere; slowing down as it arrives makes the landing feel natural. Unless the settings turn it off, fade it in during the slide too, because a slide on its own tends to look mechanical. Give longer distances a little more time so the speed still feels natural. Move it without changing the layout, so nothing around it shifts. If the visitor has reduced motion turned on, skip the travel and simply show it. Match the settings listed below.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Comes in from | Top | Which edge it travels in from |
  | How far it travels | Medium | How far away it starts: short is 50px, medium 200px and far 400px; short distances suit subtle interface motion, long ones feel dramatic |
  | Speed | Normal | How long the slide takes: slow is 1000ms, normal 600ms and fast 350ms; longer distances need more time so the speed still feels believable |
  | Feel | Smooth | Smooth slows down into place; Springy adds a small overshoot; Gentle eases in and out; Even keeps one steady pace |
  | Fades in | on | A slide alone looks mechanical; the fade makes it read as an arrival |

- **README See also:**
  - [Fade In / Fade Out](../fade-in-out/) — the plain fade, with no travel
  - [Slide Up Reveal](../slide-up-reveal/) — text rises from behind an invisible edge
  - [Scale In / Zoom In](../scale-in/) — grows into place instead of moving
  - [Bounce In](../bounce-in/) — lands with a springy bounce
- **README How it works:** unchanged (the choices feed the same `applyDir()` code)

---

## slide-up-reveal — Slide Up Reveal

- **Description:** Text rises into view from behind an invisible edge. Best for headlines.
- **Watch it help line:** default
- **Player bar:** Replay · Loop · Slow motion
- **Loop sequence:** plays in, holds 1000ms, plays out (the lines drop back behind the edge), waits 400ms. As today, each timer starts with its play (the lines drop `dur` + 1000ms after the rise starts, and the next cycle starts `dur` + 400ms after the drop starts), so the line delays run inside them.
- **Slow motion:** `--dur`, `--stagger` and the `dur` part of both loop timers; the 1000ms hold and 400ms wait stay

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long each line takes to rise. | `dur` / `--dur`: 1100ms / 700ms / 400ms |
| Delay between lines | Choice buttons | Short · Medium · Long | Medium | Longer delays make the cascade easier to see. | `--stagger`: 30ms / 60ms / 120ms |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Reveal style | Choice buttons | Slide · Wipe | Slide | Slide moves the text up; Wipe uncovers it in place. | the stage's `data-method`: `translatey` / `clippath` |
| Feel | Choice buttons | Smooth · Springy · Even | Smooth | Springy goes a little past, then settles. | `--ease`: `cubic-bezier(.2,.7,.3,1)` / `cubic-bezier(.34,1.56,.64,1)` / `linear` |

- **Removed:** Play in, Play out, Reset and Auto-loop; the Status readout and the hidden Technique readout; the Multi-line (3 lines) switch, so the stage always shows all three lines (the three lines are what show the cascade, and the switch was already left out of the copied settings); the Duration and Line stagger sliders and the Easing menu (now Speed, Delay between lines and Feel); Ease out (nearly the same as Smooth). The old Technique buttons become Reveal style and now count in "Your settings", because they change how the effect is built.
- **Stage:** the three lines stay, each inside its own `overflow: hidden` wrapper (the reveal depends on it). `hb-dots`: yes. Default height.
- **Good for:** Headlines · Section titles · Taglines · **Avoid on:** Long paragraphs · Buttons
- **Prompt:** rewritten. The old one said "the text moves", which is no longer always true: Reveal style can uncover the text in place.

  > Add a slide-up reveal to [your headline or lines of text]. Each line should rise into view from just below an invisible edge, as if it is coming up from behind a solid surface, so viewers only see it arrive and never see it below the line. The text can slide up behind the edge or be uncovered in place from the bottom up; both look almost the same. When there are several lines, start each one a moment after the line above it so they cascade. The text must stay readable by screen readers and search engines the whole time. If the visitor has reduced motion turned on, show the text immediately without the rise. Match the settings listed below.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Speed | Normal | How long each line takes to rise: slow is 1100ms, normal 700ms and fast 400ms |
  | Delay between lines | Medium | The wait before each next line starts: short is 30ms, medium 60ms and long 120ms; 40 to 80ms reads as a cascade |
  | Reveal style | Slide | Two ways to build it that look almost the same: sliding the text up behind a hidden edge, or wiping it into view in place |
  | Feel | Smooth | Smooth slows to a stop; Springy adds a slight settle; Even keeps one steady pace |

- **README See also:**
  - [Split Text Reveal](../split-text-reveal/) — text appears piece by piece, not line by line
  - [Curtain Reveal](../curtain-reveal/) — a colored panel covers it, then slides away
  - [Clip-Path Reveal](../clip-path-reveal/) — a shape uncovers any element
  - [Slide In](../slide-in/) — travels in from any edge, with nothing hiding it
- **README How it works:** snippets unchanged; in the first paragraph, "and the demo toggles between them" becomes "and the Reveal style setting switches between them (Slide is Method A, Wipe is Method B)"

---

## scale-in — Scale In / Zoom In

- **Description:** Grows from smaller to full size. Best for pop-ups and menus.
- **Watch it help line:** default
- **Player bar:** Replay · Loop · Slow motion
- **Loop sequence:** plays in, holds 800ms, plays out, waits 400ms
- **Slow motion:** `--dur` and the `dur` part of both loop timers; the 800ms hold and 400ms wait stay

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Starting size | Choice buttons | A bit smaller · Half size · From nothing | A bit smaller | Starting smaller makes a bigger zoom. | `--ss`: `0.8` / `0.5` / `0` |
| Grows from | Choice buttons | Center · Top left · Top · Bottom | Center | Grow from a corner to look like it came from a button. | `--origin`: `center` / `top left` / `top center` / `bottom center` |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | Slow is easy to follow. Fast feels snappy. | `dur` / `--dur`: 800ms / 500ms / 300ms |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Feel | Choice buttons | Smooth · Springy · Gentle · Even | Springy | Springy grows a little too big, then settles. | `--ease`: `cubic-bezier(.2,.7,.3,1)` / `cubic-bezier(.34,1.56,.64,1)` / `ease-in-out` / `linear` |
| Fades in | Switch | on / off | on | Stops it flashing in at full strength while tiny. | `--fade-opacity`: `0` (on) / `1` (off) |

- **Removed:** Play in, Play out, Reset and Auto-loop; the Status and Scale readouts; the Start scale and Duration sliders and the Easing menu (now Starting size, Speed and Feel); Ease out (nearly the same as Smooth).
- **Stage:** the card stays. Card text: title unchanged; line becomes "A springy finish makes it land. Try growing it from a corner." (the current line names "easing" and "transform-origins"). `hb-dots`: yes. Default height.
- **Good for:** Pop-ups and dialogs · Menus · Cards in a grid · Checkmarks · **Avoid on:** Long text · Full-page sections
- **Prompt:** rewritten, one change: "start a little smaller than its final size" becomes "start smaller than its final size", because Starting size now sets how much smaller.

  > Add a scale-in entrance to [the element you want to animate]. It should start smaller than its final size and grow to full size, anchored at the point given in the settings: its center, or an edge or corner so it seems to grow out of the button that opened it. A springy curve lets it overshoot slightly and settle, which makes the arrival feel physical. Unless the settings turn it off, fade it in while it grows so it never flashes at full strength while it is still tiny. Animate only its size and opacity. If the visitor has reduced motion turned on, show it at full size without the zoom. Match the settings listed below.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Starting size | A bit smaller | How small it starts: a bit smaller is 80% of full size, half size 50% and from nothing 0%; close to full size is subtle, below half reads as a big zoom |
  | Grows from | Center | The point it grows from: the center, the top left corner, the top edge or the bottom edge |
  | Speed | Normal | How long it takes: slow is 800ms, normal 500ms and fast 300ms; a springy curve needs room to overshoot and settle |
  | Feel | Springy | Springy overshoots and settles; Smooth and Gentle arrive more calmly; Even keeps one steady pace |
  | Fades in | on | Stops the element flashing at full strength while it is still tiny |

- **README See also:**
  - [Fade In / Fade Out](../fade-in-out/) — the plain fade, with no size change
  - [Bounce In](../bounce-in/) — a bigger, springier landing
  - [Slide In](../slide-in/) — travels into place instead of growing
  - [Flip In](../flip-in/) — swings in like a card turning over
- **README How it works:** unchanged

---

## clip-path-reveal — Clip-Path Reveal

- **Description:** A growing shape uncovers it while it stays still. Best for images and banners.
- **Watch it help line:** default
- **Player bar:** Replay · Loop · Slow motion
- **Loop sequence:** plays in, holds 800ms, plays out, waits 400ms. Every play first snaps to the hidden clip of the current shape with the transition off (today's `resetHidden()`), so changing Shape or Starts from never tweens between two clip shapes.
- **Slow motion:** `--dur` and the `dur` part of both loop timers; the 800ms hold and 400ms wait stay

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Shape | Choice buttons | Edge wipe · Circle · Oval | Edge wipe | The shape that opens to reveal it. | `shape`: `'inset'` / `'circle'` / `'ellipse'`, then `applyClips()` (sets `--cp-out`/`--cp-in` from `CLIPS`) |
| Starts from | Choice buttons; shown only when Shape is Edge wipe (as today) | Left · Right · Top · Bottom · Center | Left | Which side the wipe begins on. | `dir`: `'left'` / `'right'` / `'top'` / `'bottom'` / `'center'` (`CLIPS.inset[dir]`), then `applyClips()` |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | A reveal reads best a little slower than a fade. | `dur` / `--dur`: 1300ms / 800ms / 500ms |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Feel | Choice buttons | Smooth · Even | Smooth | Smooth slows at the end; Even keeps one pace. | `--ease`: `cubic-bezier(.2,.7,.3,1)` / `linear` |

- **Removed:** Play in, Play out, Reset and Auto-loop; the Status readout and the hidden clip-path readout; the Show clip-path boundary switch and the dashed `.clip-outline` element (a teaching overlay, not part of the effect, and already left out of the copied settings); the Swipe shape and its `polygon` entry in `CLIPS` (its values draw a straight wipe from the left, exactly like Edge wipe from the left, not the angled cut the README describes); the Duration slider and Easing menu (now Speed and Feel); Springy (its overshoot happens outside the element, so it only looked like a wipe that stops early) and Ease out (nearly the same as Smooth).
- **Stage:** the surface stays (gradient, grid, label "Clip-Path Reveal", title "Unmasked"); the `.clip-outline` element goes. `hb-dots`: yes. Default height (the 4:3 surface is at most 300px tall).
- **Good for:** Images · Banners · Full-width panels · **Avoid on:** Small buttons · Form fields
- **Prompt:** rewritten. "Let the wipe slow down as it finishes" stated the Feel as fixed, and the old list offered an angled swipe the demo does not show.

  > Add a mask reveal to [the image or block you want to reveal]. The element should stay completely still and fully drawn while a shape uncovers it, like a window opening: an edge wipe that starts from one side or from the center, or a circle or oval that opens from the middle. Nothing moves, fades or changes size; only the visible area grows until the whole element shows. A wipe that slows down as it finishes looks calmer than one that stops abruptly. The content must stay accessible even while part of it is hidden. If the visitor has reduced motion turned on, show it fully without the wipe. Match the settings listed below.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Shape | Edge wipe | Edge wipe uncovers it from one side or from the center; Circle and Oval open from the middle like an iris |
  | Starts from | Left | For the edge wipe, where the reveal begins: left, right, top, bottom or center |
  | Speed | Normal | How long the reveal takes: slow is 1300ms, normal 800ms and fast 500ms; a reveal reads best a little slower than a fade |
  | Feel | Smooth | Smooth slows to a stop instead of snapping; Even keeps one steady pace |

- **README See also:**
  - [Curtain Reveal](../curtain-reveal/) — a colored panel covers it, then slides away
  - [Slide Up Reveal](../slide-up-reveal/) — text rises from behind an invisible edge
  - [Split Text Reveal](../split-text-reveal/) — text appears piece by piece
  - [Fade In / Fade Out](../fade-in-out/) — a plain fade instead of a shape
- **README How it works:** delete the `polygon:` line from the `CLIPS` snippet (Swipe is gone); everything else unchanged

---

## curtain-reveal — Curtain Reveal

- **Description:** A colored panel covers it, then slides away. Best for intros and logos.
- **Watch it help line:** default
- **Player bar:** Replay · Loop · Slow motion. The body gains `data-hb-autoplay`, so it plays on arrival like the other pages.
- **Loop sequence:** the panel covers the content (Speed), holds (Pause while covered), slides off the far side (Speed), waits 500ms; with Both sides, the two halves meet in the middle and part back to their own sides. Every play first snaps the panels back off-stage with the transition off (today's `clearCurtains()`).
- **Slow motion:** `--dur`, the two timers that wait for a pass, and the `pause` timer (the hold is part of the effect); the 500ms wait between cycles stays

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Comes in from | Choice buttons | Left · Right · Top · Bottom · Both sides | Left | Both sides sends two panels that meet in the middle. | `axis` / `dirMode` / `twin`: `'h'`, `'ltr'`, false / `'h'`, `'rtl'`, false / `'v'`, `'ttb'`, false / `'v'`, `'btt'`, false / `'h'`, `'ltr'`, true |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How fast the curtain slides across. | `dur` / `--dur`: 800ms / 500ms / 300ms |
| Pause while covered | Choice buttons | None · Short · Long | Short | The pause is what makes the change register. | `pause`: 0 / 300 / 800 (ms) |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Curtain color | Swatches (the color name is each button's `aria-label`) | Dark · Ink blue · Warm red · Off-white · Gold | Dark | Strong contrast with the content feels more dramatic. | `--curtain-color`: `#111827` / `#1e3a5f` / `#5c1a1a` / `#f0ede8` / `#8a6e14` |

- **Removed:** Play reveal, Reset and Auto-loop; the Status readout; the enter / pause / exit timeline on the stage (a live readout); the Two curtains (split) switch, which becomes the Both sides choice of Comes in from (the split only worked with left and right, so half of the old combinations did nothing); the Curtain speed and Pause between sliders (now Speed and Pause while covered); the swatch `div`s and their key handling (the swatches become buttons).
- **Stage:** the two panels and the content (badge "Curtain Reveal", title "Unveiled", its line) stay; the `.tl` timeline goes. `hb-dots`: yes. Default height.
- **Good for:** Page intros · Logos · Section changes · Portfolio pieces · **Avoid on:** Buttons and menus · Things shown often
- **Prompt:** rewritten. The old one said to always keep the pause, which Pause while covered now controls, and its "split mode" is now the Both sides choice.

  > Add a curtain reveal to [the content you want to reveal]. A solid colored panel should slide across and cover the content completely, hold for the pause given in the settings, then keep going and slide off the far side, leaving the content visible. The pause is what makes the change register. When the panels come in from both sides, two panels meet in the middle, then part. Pick a panel color that contrasts strongly with the content. Move the panels rather than resizing them so the motion stays smooth. If the visitor has reduced motion turned on, show the content without the curtain. Match the settings listed below.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Comes in from | Left | Which way the panel travels; Both sides sends two panels that meet in the middle, then part |
  | Speed | Normal | Time for one pass: slow is 800ms, normal 500ms and fast 300ms; the whole reveal takes about two passes plus the pause |
  | Pause while covered | Short | How long the panel covers everything: none, short (300ms) or long (800ms); the pause is what makes the change register |
  | Curtain color | Dark | The panel's color; strong contrast with the content makes the reveal more dramatic |

- **README See also:**
  - [Clip-Path Reveal](../clip-path-reveal/) — a shape uncovers it, with no panel
  - [Slide Up Reveal](../slide-up-reveal/) — text rises from behind an invisible edge
  - [Slide In](../slide-in/) — travels into place from one edge
  - [Split Text Reveal](../split-text-reveal/) — text appears piece by piece
- **README How it works:** snippets unchanged. After the JS snippet, add: "Both sides uses two half-width panels that start off opposite edges, meet in the middle and go back." If the new script cancels the pending timers at the start of each play instead of keeping the `busy` flag (Rotate In's `play()`), reword the Production notes line "Guard against re-entry" to say that each play clears the timers of the one before, so a second trigger cannot desync the stages.

---

## split-text-reveal — Split Text Reveal

- **Description:** Text breaks into pieces that appear one after another. Best for headlines.
- **Watch it help line:** default
- **Player bar:** Replay · Loop · Slow motion
- **Loop sequence:** plays in, holds 800ms, plays out, waits 400ms. As today, a play lasts pieces × Delay between pieces + Speed, and the hold and the wait are counted from its end.
- **Slow motion:** `--dur`, `--stagger` and the play length in both loop timers; the 800ms hold and 400ms wait stay

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Split into | Choice buttons | Letters · Words · Lines | Words | Letters ripple finely; lines arrive in blocks. | `mode`: `'chars'` / `'words'` / `'lines'`, then `split()` |
| How each piece appears | Choice buttons | Fade up · Fade · Grow · Flip | Fade up | The small entrance every piece plays. | `anim` and the target's `data-anim`: `fade-up` / `fade` / `scale` / `rotate` |
| Delay between pieces | Choice buttons | Short · Medium · Long | Medium | Short ripples quickly; long feels deliberate. | `stagger` / `--stagger`: 10ms / 30ms / 100ms |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long each piece takes to appear. | `dur` / `--dur`: 800ms / 500ms / 300ms |
| Feel | Choice buttons | Smooth · Springy · Even | Smooth | Springy goes a little past, then settles. | `--ease`: `cubic-bezier(.2,.7,.3,1)` / `cubic-bezier(.34,1.56,.64,1)` / `linear` |
| Your text | Text (`input.hb-text`) | any text | Design beyond the obvious | Type your own words to see them split. | `txtIn.value`, then `split()` on input (an empty field falls back to "Design beyond the obvious") |

- **Removed:** Play in, Play out, Reset and Auto-loop; the Status and Total time readouts; the Stagger delay and Duration per unit sliders and the Easing menu (now Delay between pieces, Speed and Feel); Ease out (nearly the same as Smooth). The Edit text field becomes Your text.
- **Stage:** the text stays. `hb-dots`: yes. Height: typed text has to fit, so set `--hb-stage-h: auto` and `--hb-stage-h-phone: auto` on `:root` and give the demo's `.stage` rule `min-height: clamp(300px, calc(100vh - 420px), 440px)` followed by `min-height: clamp(300px, calc(100svh - 420px), 440px)`, plus `min-height: 300px` under 600px wide. The default text keeps the usual stage size; a longer text grows the stage instead of being cut off.
- **Good for:** Headlines · Taglines · Short quotes · **Avoid on:** Body text · Buttons and labels
- **Prompt:** keep
- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Split into | Words | Letters give the finest cascade, words a readable rhythm, lines a block reveal |
  | How each piece appears | Fade up | The small entrance each piece plays: fade up, fade, grow or flip |
  | Delay between pieces | Medium | The wait between pieces: short is 10ms, medium 30ms and long 100ms; small values ripple, large values feel deliberate |
  | Speed | Normal | How long each piece takes: slow is 800ms, normal 500ms and fast 300ms |
  | Feel | Smooth | The curve each piece uses; Springy adds a small settle, Even keeps one steady pace |
  | Your text | Design beyond the obvious | The text that is split and revealed |

- **README See also:**
  - [Slide Up Reveal](../slide-up-reveal/) — whole lines rise from behind an invisible edge
  - [Letter-by-Letter Stagger](../letter-by-letter-stagger/) — one letter at a time, or typed out
  - [Word-by-Word Reveal](../word-by-word-reveal/) — one word at a time, at a reading pace
  - [Fade In / Fade Out](../fade-in-out/) — the whole text fades in at once

  Two link texts change to the pages' real titles: "Letter By Letter Stagger" and "Word By Word Reveal".
- **README How it works:** unchanged

---

## letter-by-letter-stagger — Letter-by-Letter Stagger

- **Description:** A phrase appears letter by letter, or is typed out. Best for short headlines.
- **Watch it help line:** default
- **Player bar:** Replay · Loop · Slow motion. Loop is new on this page (it had Replay and Reset only); it only repeats the page's existing steps: play, then the reset that rebuilds the letters hidden.
- **Loop sequence:** plays in, holds 1000ms, clears at once (today's reset: the letters are rebuilt hidden, with no exit animation), waits 400ms. Playing in lasts letters × Delay between letters, plus Speed in Cascade.
- **Slow motion:** `--dur`, `--stagger`, the Typewriter's per-letter timers (`i × stagger`) and its end timer, and the play length in the loop timers; the 1000ms hold and 400ms wait stay

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Style | Choice buttons | Cascade · Typewriter | Cascade | Cascade animates each letter; Typewriter types them. | `mode` and the target's `data-mode`: `cascade` / `typewriter`, then rebuild; also shows How each letter appears and Speed only in Cascade, Blinking cursor only in Typewriter |
| Delay between letters | Choice buttons | Short · Medium · Long | Medium | Longer delays feel slower and more theatrical. | `stagger` / `--stagger`: 20ms / 35ms / 80ms |
| How each letter appears | Choice buttons; shown only in Cascade (as today) | Fade up · Fade · Grow · Flip | Fade up | The small entrance every letter plays. | `anim` and the target's `data-anim`: `fade-up` / `fade` / `scale` / `rotate` |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons; shown only in Cascade (Typewriter letters appear without a transition) | Slow · Normal · Fast | Normal | How long each letter takes to settle. | `dur` / `--dur`: 650ms / 400ms / 250ms |
| Blinking cursor | Switch; shown only in Typewriter | on / off | on | A cursor leads the letters as they are typed. | `cursorTog.checked` true / false: `buildSpans()` adds the `.cursor` span or not |
| Your text | Text (`input.hb-text`, keeps `maxlength="60"`) | any text up to 60 characters | Hello, world. | Short phrases work best, up to 60 characters. | `txtIn.value`, then `buildSpans()` (an empty field falls back to "Hello, world.") |

- **Removed:** the panel's Replay and Reset buttons (the player bar's Replay replaces them); the Status and Total time readouts; the Per-letter delay and Duration per letter sliders (now Delay between letters and Speed). The Edit text field becomes Your text, and the cursor switch loses "(typewriter)" from its label because it now shows only in Typewriter.
- **Stage:** the text and the cursor stay. `hb-dots`: yes. Height: as on Split Text Reveal (`--hb-stage-h: auto`, `--hb-stage-h-phone: auto` and the stage's own `min-height`), so 60 characters always fit.
- **Good for:** Short headlines · Names and logos · Chat messages · Loading screens · **Avoid on:** Long text · Buttons and labels
- **Prompt:** rewritten. The old one said the typewriter always types behind a blinking cursor, which Blinking cursor now controls; "mode" becomes "style" to match the setting.

  > Add a letter-by-letter entrance to [a short phrase or headline]. In the cascade style, every letter plays a small entrance a moment after the previous one, so the phrase assembles from left to right. In the typewriter style, the letters appear one at a time as if someone is typing, with a blinking cursor when the settings include one. Use it only on short phrases, because long text becomes tedious to wait for. Screen readers should hear the whole phrase once, not letter by letter. If the visitor has reduced motion turned on, show the full phrase immediately. Match the settings listed below.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Style | Cascade | Cascade animates every letter in turn; Typewriter types them out |
  | Delay between letters | Medium | The gap between letters: short is 20ms, medium 35ms and long 80ms; higher is slower and more theatrical |
  | How each letter appears | Fade up | In Cascade, the entrance each letter plays: fade up, fade, grow or flip |
  | Speed | Normal | In Cascade, how long each letter takes to settle: slow is 650ms, normal 400ms and fast 250ms |
  | Blinking cursor | on | In Typewriter, a blinking cursor leads the letters |
  | Your text | Hello, world. | The phrase that is animated, up to 60 characters |

- **README See also:**
  - [Word-by-Word Reveal](../word-by-word-reveal/) — one word at a time, better for longer text
  - [Split Text Reveal](../split-text-reveal/) — text breaks into letters, words or lines
  - [Blur In](../blur-in/) — sharpens from a blur as it fades in

  One link text changes to the page's real title: "Split-Text Reveal".
- **README How it works:** unchanged

---

## word-by-word-reveal — Word-by-Word Reveal

- **Description:** Words appear one after another at a reading pace. Best for quotes and intros.
- **Watch it help line:** default
- **Player bar:** Replay · Loop · Slow motion
- **Loop sequence:** plays in, holds 1000ms, plays out, waits 400ms. As today, a play lasts the last word's delay + Speed, and the hold and the wait are counted from its end.
- **Slow motion:** `--dur`, the CSS `--stagger` and the play length in both loop timers. Keep the unmultiplied `stagger` when computing each word's `--i`, so the sentence pauses stretch too. The 1000ms hold and 400ms wait stay.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Delay between words | Choice buttons | Short · Medium · Long | Medium | Medium matches a comfortable reading pace. | `stagger` / `--stagger`: 40ms / 80ms / 150ms, then `buildWords()` |
| How each word appears | Choice buttons | Fade up · Fade · Grow · Blur · Flip | Fade up | The small entrance every word plays. | the target's `data-anim`: `fade-up` / `fade` / `scale` / `blur` / `rotate` |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long each word takes to settle. | `dur` / `--dur`: 700ms / 450ms / 270ms |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Feel | Choice buttons | Smooth · Springy · Even | Smooth | Springy adds a small bounce as each word lands. | `--ease`: `cubic-bezier(.2,.7,.3,1)` / `cubic-bezier(.34,1.56,.64,1)` / `linear` |
| Pauses between sentences | Switch | on / off | off | Waits a little longer before each new sentence. | `punctTog.checked` true / false, then `buildWords()` (adds `si × 200ms` to each word's delay) |
| Your text | Text (`textarea.hb-text`) | any text, one sentence per line | the three current sentences | Put each sentence on its own line. | `txtIn.value`, then `buildWords()` |

- **Removed:** Play in, Play out, Reset and Auto-loop; the Status and Total time readouts; the Per-word delay and Duration per word sliders and the two menus (now Delay between words, Speed, How each word appears and Feel); Ease out (nearly the same as Smooth). The Edit text box becomes Your text.
- **Stage:** the text stays. `hb-dots`: yes. Height: as on Split Text Reveal (`--hb-stage-h: auto`, `--hb-stage-h-phone: auto` and the stage's own `min-height`), so a longer passage grows the stage.
- **Good for:** Quotes · Short paragraphs · Captions · Story sections · **Avoid on:** Long articles · Buttons and labels
- **Prompt:** rewritten. "At roughly the pace people read" stated the pace as fixed; Delay between words now sets it.

  > Add a word-by-word reveal to [the paragraph or quote you want to reveal]. Each word should appear a moment after the one before it, so the text builds up as if it is being spoken; a delay close to the pace people read feels most natural. If pauses between sentences are on, wait a little longer at the end of each sentence before continuing. Keep the delay short enough that nobody waits for text they could already read. The full text must stay readable by screen readers and must not reflow while it appears. If the visitor has reduced motion turned on, show all the text at once. Match the settings listed below.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Delay between words | Medium | The reading-speed control: short is 40ms, medium 80ms and long 150ms; below about 40ms the words blur into one reveal |
  | How each word appears | Fade up | The entrance each word plays: fade up, fade, grow, blur or flip |
  | Speed | Normal | How long each word takes to settle: slow is 700ms, normal 450ms and fast 270ms |
  | Feel | Smooth | Smooth slows each word into place; Springy adds a bounce; Even feels mechanical |
  | Pauses between sentences | off | Adds an extra pause between sentences |
  | Your text | Three sample sentences | The passage that is revealed, one sentence per line |

- **README See also:**
  - [Letter-by-Letter Stagger](../letter-by-letter-stagger/) — one letter at a time, for short phrases
  - [Split Text Reveal](../split-text-reveal/) — text breaks into letters, words or lines
  - [Fade In / Out](../fade-in-out/) — the whole text fades in at once

  One link text changes to the page's real title: "Split-Text Reveal".
- **README How it works:** snippets unchanged if the new script keeps the name `punctTog` for the Pauses between sentences switch (otherwise rename it in the snippet); in the last paragraph, 'The "sentence pauses" option' becomes 'The Pauses between sentences switch'

---

## blur-in — Blur In

- **Description:** Comes into focus from a blur, like a camera. Best for featured cards and photos.
- **Watch it help line:** default
- **Player bar:** Replay · Loop · Slow motion
- **Loop sequence:** plays in, holds 900ms, plays out, waits 400ms
- **Slow motion:** `--dur` and the `dur` part of both loop timers; the 900ms hold and 400ms wait stay

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| How blurry it starts | Choice buttons | Slight · Medium · Heavy | Medium | Heavy looks more dramatic, almost like frosted glass. | `--blur-start`: 8px / 20px / 35px |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | A little slower lets the focus pull land. | `dur` / `--dur`: 1100ms / 700ms / 400ms |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| What changes | Choice buttons | Blur and fade · Blur only · Fade only | Blur and fade | Try each half on its own to see what it adds. | the card's `data-mode`: `blur-fade` / `blur-only` / `fade-only`; also shows Drifts up only with Blur and fade |
| Feel | Choice buttons | Smooth · Gentle · Even | Smooth | Smooth slows at the end, like a lens settling. | `--ease`: `ease-out` / `ease-in-out` / `linear` |
| Drifts up | Switch; shown only with Blur and fade (the other two keep the card still) | on / off | on | A small rise, as if it settles into place. | `--ty`: `-8px` (on) / `0px` (off) |

- **Removed:** Play in, Play out, Reset and Auto-loop; the Status and blur readouts; the Starting blur and Duration sliders and the Easing menu (now How blurry it starts, Speed and Feel); the second smooth curve (nearly the same as Ease out, which is now Smooth). The Mode buttons become What changes.
- **Stage:** the card stays. Card text: title "Focus Pull" unchanged; line becomes "It sharpens and fades in at the same time, like a camera finding focus." (the current line uses "opacity" and advice meant for developers). `hb-dots`: yes. Default height.
- **Good for:** Featured cards · Photos · Pop-ups · Portfolio pieces · **Avoid on:** Lists and grids · Small text
- **Prompt:** rewritten. The old one stated "start blurred and transparent, then sharpen into focus while it fades in" as fixed; What changes now decides whether it blurs, fades or both.

  > Add a blur-in entrance to [the element you want to animate]. It should come into view like a camera pulling focus onto the subject: sharpening from a blur makes it feel like a lens finding its subject, and fading in at the same time makes it feel like it is arriving. It can also drift up slightly as it settles. Use it on one focal element at a time, not on a list or grid, because blur is expensive for the browser to draw. Remove the blur completely once the animation ends. If the visitor has reduced motion turned on, show the element sharp and visible without the effect. Match the settings listed below.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | How blurry it starts | Medium | How much blur it starts with: slight is 8px, medium 20px and heavy 35px; past about 30px it looks like frosted glass |
  | Speed | Normal | How long it takes: slow is 1100ms, normal 700ms and fast 400ms; blur needs a little longer than a plain fade for the lens feel to land |
  | What changes | Blur and fade | The full effect; Blur only and Fade only show each half on its own |
  | Feel | Smooth | Smooth slows down like a lens settling; Gentle eases in and out; Even feels robotic |
  | Drifts up | on | A small rise while it sharpens, as if it is settling into place; only with Blur and fade |

- **README See also:**
  - [Fade In / Out](../fade-in-out/) — the fade on its own, with no blur
  - [Scale In](../scale-in/) — grows from smaller to full size
  - [Flip In](../flip-in/) — swings in like a card turning over
- **README How it works:** snippets unchanged; "The blur-only and fade-only modes exist to show" becomes "The Blur only and Fade only choices of What changes exist to show"

---

## flip-in — Flip In

- **Description:** Swings into view in 3D, like a card turning over. Best for cards and tiles.
- **Watch it help line:** default
- **Player bar:** Replay · Loop · Slow motion
- **Loop sequence:** plays in, holds 800ms, plays out, waits 400ms
- **Slow motion:** `--dur` and the `dur` part of both loop timers; the 800ms hold and 400ms wait stay

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Swing direction | Choice buttons | Sideways · Up and down · Diagonal | Sideways | Sideways turns like a door, up and down like a flap. | `axis`: `'Y'` / `'X'` / `'both'`, then `applyRot()` (sets `--rot-y`/`--rot-x`) |
| Hinge | Choice buttons | Center · Top · Bottom · Left | Center | An edge hinge makes it swing from that side. | `--origin`: `center` / `top center` / `bottom center` / `left center` |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | Slow is easy to follow. Fast feels snappy. | `dur` / `--dur`: 1000ms / 600ms / 350ms |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| How far it turns | Choice buttons | A little · ¼ turn · ½ turn | ¼ turn | ¼ turn starts edge-on; ½ turn starts facing away. | `rot`: 45 / 90 / 180 (degrees), then `applyRot()` |
| 3D depth | Choice buttons | Subtle · Medium · Strong | Medium | Strong looks closer and more dramatic. | `--persp` (read by the stage's own `perspective` rule): 2000px / 1000px / 400px |
| Feel | Choice buttons | Smooth · Springy · Gentle · Even | Smooth | Springy swings a little past, then settles. | `--ease`: `ease-out` / `cubic-bezier(.34,1.56,.64,1)` / `ease-in-out` / `linear` |
| Fades in | Switch | on / off | on | Softens the first moment. | on: remove the card's inline `opacity` (it starts at 0); off: `card.style.opacity = '1'` |

- **Removed:** Play in, Play out, Reset and Auto-loop; the Status and Rotation readouts; the Starting rotation, Perspective and Duration sliders and the Easing menu (now How far it turns, 3D depth, Speed and Feel); the second smooth curve (nearly the same as Ease out, which is now Smooth); the inline `stage.style.perspective` line (the stage's own rule already reads `--persp`).
- **Stage:** the card stays, and the stage keeps its own `perspective: var(--persp)` rule. Card text: title "3D Flip" unchanged; line becomes "The depth comes from the space around the card. Without it, the turn looks like a flat squash." (the current line names rotateY). `hb-dots`: yes. Default height.
- **Good for:** Cards · Flashcards and tiles · Dashboard panels · Onboarding steps · **Avoid on:** Text blocks · Full-page sections
- **Prompt:** rewritten. "Start turned edge-on, like a door seen from the side" stated the starting angle as fixed; How far it turns now sets it.

  > Add a 3D flip-in entrance to [the card you want to animate]. The card should start turned away from the viewer and swing toward them until it faces them flat. Give the card's container a 3D perspective so the swing has real depth; without it, the flip looks like a flat squash. The hinge can sit in the middle or along one edge, and the card can fade in while it turns. If the visitor has reduced motion turned on, show the card facing forward without the flip. Match the settings listed below.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Swing direction | Sideways | Which way it swings: sideways around an upright hinge like a door, up and down like a flap, or diagonally |
  | Hinge | Center | Where it turns from; an edge makes it swing from that side |
  | Speed | Normal | How long the swing takes: slow is 1000ms, normal 600ms and fast 350ms |
  | How far it turns | ¼ turn | The angle it starts from: a little (45°), a quarter turn (90°, edge-on) or half a turn (180°, facing away) |
  | 3D depth | Medium | How close the viewer seems: subtle is 2000px, medium 1000px and strong 400px; closer is more dramatic |
  | Feel | Smooth | Smooth slows the swing as it comes to face you; Springy adds a settle; Gentle eases in and out; Even keeps one steady pace |
  | Fades in | on | Fades it in while it turns |

- **README See also:**
  - [Scale In](../scale-in/) — grows into place, flat on the page
  - [Rotate In](../rotate-in/) — spins flat instead of turning in 3D
  - [Blur In](../blur-in/) — sharpens from a blur as it fades in
- **README How it works:** snippets unchanged. The sentence before the JS snippet becomes: "The Swing direction setting decides which rotation carries the starting angle: Sideways uses rotateY (an upright hinge, like a door), Up and down uses rotateX (a flat hinge, like a flap) and Diagonal uses both:". The last sentence becomes: "The Hinge setting moves transform-origin to an edge (top, bottom, left) so the card swings from that side rather than pivoting around its center."

---

## bounce-in — Bounce In

- **Description:** Lands with a springy bounce. Best for badges and success messages.
- **Watch it help line:** default
- **Player bar:** Replay · Loop · Slow motion
- **Loop sequence:** bounces in (Speed), holds 800ms, shrinks out (half of Speed), waits 400ms
- **Slow motion:** `--dur` (the exit animation is half of it) and the `dur` part of both loop timers; the 800ms hold and 400ms wait stay

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Bounce strength | Choice buttons | Soft · Medium · Strong | Medium | How far it grows past full size before settling. | the intensity passed to `buildKF()`: 30 / 60 / 100 |
| Number of bounces | Choice buttons | One · Two · Three | One | One usually looks best; more looks cartoonish. | `bounces`: 1 / 2 / 3, then `buildKF()` |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | Too fast and the bounce looks like a jitter. | `dur` / `--dur`: 1800ms / 1100ms / 650ms |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Fades in | Switch | on / off | on | Softens the first moment. | `fadeTog.checked` true / false: `buildKF()` writes `opacity: 0` / `1` at 0% |

- **Removed:** Play in, Play out, Reset and Auto-loop; the Status readout; the hidden keyframe display (it showed code); the Overshoot intensity and Duration sliders (now Bounce strength and Speed). Keep the `<style id="kf-style">` element that `buildKF()` writes into.
- **Stage:** the card stays. Card text: title "Bounce Landing" unchanged; line becomes "A real bounce goes past its size and back, a little less each time." (the current line names cubic-bezier and keyframes). `hb-dots`: yes. Default height.
- **Good for:** Success messages · Badges · Small pop-ups · Playful brands · **Avoid on:** Formal content · Large panels
- **Prompt:** keep
- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Bounce strength | Medium | How far past full size it grows: soft about 5%, medium 9% and strong 15%, with smaller dips back under |
  | Number of bounces | One | How many times it overshoots; almost always one, since more looks cartoonish |
  | Speed | Normal | How long it takes: slow is 1800ms, normal 1100ms and fast 650ms; too short and the spring reads as a jitter |
  | Fades in | on | Whether it fades in while it bounces or is visible from the start |

- **README See also:**
  - [Scale In](../scale-in/) — grows into place without the bounce
  - [Rotate In](../rotate-in/) — spins into place while it grows
  - [Slide In](../slide-in/) — travels into place from one edge
- **README How it works:** snippets unchanged; "computed from an intensity slider" becomes "computed from the Bounce strength choice (an intensity of 30, 60 or 100)", and "changing intensity or bounce count" becomes "changing Bounce strength or Number of bounces"
