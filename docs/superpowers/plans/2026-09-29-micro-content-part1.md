# Micro-Interactions — Content Sheet, Part 1

This sheet decides, page by page, how the first fifteen Micro-Interactions pages (home-page order, Hover State Animation to Notification Badge Pulse) present their kind, settings, words and prompt on the guided-steps page. Part 2 (Tooltip Reveal to Pull to Refresh) is written separately. The conversion tasks of `2026-09-29-demo-page-rollout-parallel.md` follow each section exactly, together with "How to convert a page" in `2026-09-28-demo-page-rollout-text-typography.md`, the do-it markup in `2026-09-29-demo-page-kinds-do-and-scroll.md` and the lessons in the rollout's Global Constraints. Rotate In (`animations/02-entrance-and-exit/rotate-in/`) is the reference for everything a section does not mention; Wavy Text and Text Gradient Animation are the reference for "css" loops.

Kinds in this half: ten do-it pages (Hover State Animation, Click / Tap Ripple, Focus Ring Animation, Button Press Scale, Magnetic Button, Toggle / Switch Slide, Heart / Like Burst, Success Confetti, Checkmark Draw, Form Field Morph), three loops (Shimmer Effect, Loading Spinner, Notification Badge Pulse) and two plays-once pages (Skeleton Loader, Progress Animation). Every page keeps settings, so every page has a Try it step.

How to read a section:

- **Sets in the demo** lists one value per choice, in the same order as the choices. A Speed row sets the script's variable (used by timers) and the CSS variable it names.
- Switches in Try it keep their default in the markup (`checked` when the default is on), as on Rotate In. The player bar's Loop and Slow motion switches start unchecked.
- Do-it sections replace "Watch it help line" and "Sequence" with **Step 1** (title and help line), **What the visitor does**, **Show me** and **Reset**.
- **Try it help line** comes from the kind: plays once "Change a setting and the animation plays again."; loop "Change a setting and see the difference as it moves."; do it "Change a setting, then try it again or press Show me." (on do-it pages a setting change does not replay anything; the shared script only updates the chips).
- **Watch it help line: default** means the kind's line: plays once "It plays by itself. Turn on slow motion to see each part of the movement."; loop with Slow motion "It moves by itself. Pause it to look closely, or turn on slow motion to see each part of the movement."
- **Pause (css)** means `data-hb-pause="css"`; **Slow motion (css)** means `data-hb-slowmo="css"` and **Slow motion (page)** `data-hb-slowmo` without a value.
- **Speed** always reads Slow · Normal · Fast; today's default is Normal, Slow is about 1.6 times and Fast about 0.6 times the default duration.
- **Feel** uses the names shared with Part 2: Smooth (slows to a stop) is `ease-out`, Gentle (eases in and out) is `ease-in-out`, Even (one steady speed) is `linear`, and Springy goes a little past, then settles. A page's own old default curve keeps its exact value under the nearest name (`ease` under Smooth, `cubic-bezier(.4,0,.2,1)` under Gentle), so the default look does not change, and each Springy row keeps its page's own overshoot curve. The exact curve is in each row.
- **Swatches** use the Text & Typography palette, in this order, with the colour's name as each button's `aria-label`: Pink `#ff6f8b` · White `#f4f4f2` · Blue `#58a6ff` · Purple `#d2a8ff` · Green `#56d364` · Orange `#ffa657`. A section says when it leaves a colour out or keeps the demo's own colours.
- **Category line:** the pages have none today. NN is the page's position on the home page, which its card already shows: `04.01 · Micro-Interactions` (Hover State Animation) to `04.15 · Micro-Interactions` (Notification Badge Pulse).
- **Accent:** every page keeps `--ui-accent:#ff9d5c`, the colour all the Micro-Interactions pages already use.

---

## Owner decisions and lessons that apply here

- **Stage text uses the site font.** No page here is a typing effect, so none keeps a monospace font. `var(--mono)`, `monospace` and `var(--disp)` (Bricolage) go from every stage rule.
- **Reduced motion** greys out Loop and Slow motion and runs nothing by itself; Replay, Pause/Play, Show me and Reset still work (see "Reduced motion" below for each kind).
- **Do-it pages show themselves once on arrival:** the shared script presses Show me 400ms after load (not under reduced motion).
- **Pause stops at once** on the three loops: all three are "css" loops whose only looping movement is `@keyframes` animations on the stage, and none has page timers.
- **Lessons from the Text & Typography reviews:** the `hb:input` and `hb:pause` listeners are registered at the top level of the page's inline script; the page reaches the player controls by their ids (`btn-demo`, `btn-reset`, `btn-play`, `loop-tog`, `slow-tog`, `btn-pause`), never by `data-hb-*`; timers go through the pruning `later()` and every play or run clears them all; a page never calls `pause()` or `play()` on a CSS keyframe animation; Replay restarts the animated pieces themselves.

## Do-it pages

**Body and player bar.** `<body class="hb" data-hb-kind="do" data-hb-autoplay>`. Step 1 is titled as the section says (Hover it · Click it · Press Tab) with the section's help line. The player bar holds the Show me button, then the Reset button where the section has one, then the Slow motion switch where the section has one, all exactly as in the do-it/scroll plan (Show me `id="btn-demo"`, Reset `id="btn-reset"`, Slow motion as on Rotate In with `id="slow-tog"`).

**Show me** plays one example of the interaction (the section gives each step, 2 to 4 seconds at the default settings) and returns the demo to rest. Pressing it again restarts the run from rest. The run keeps all its timers in one list, so it can always be stopped completely. Every timer of a run goes through `later(fn, move, hold)`, which waits `move*(slow?3:1) + (hold||0)` ms. `move` is the stage's movement up to that step: the transitions and animations it waits for, which follow the settings (for example Speed). `hold` is the time the stage rests up to that step. Both are counted from the moment Show me is pressed. Slow motion triples the movement and never the holds, so a slowed run takes about three times its movement plus the same holds:

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

Each section writes its timeline as these `later()` calls, with the time each step happens at the default settings with Slow motion off, and the length of a slowed run. The demo's own timers (Checkmark Draw's loading wait) are holds too; they do not go through `later()` and keep their length. The two plays-once pages use the pruning `later(fn, wait)` of the Text & Typography pages (Text Clip-Path Reveal's, where a fired timer leaves `timers`) and stretch their movement durations themselves, as their sections say. `later(fn, move, hold)` is only the do-it pages' Show me helper.

**A run starts from rest.** When the visitor left the demo changed, `toRest()` puts it back as it is on arrival without animating: the pieces' transitions are turned off inline, the resting state is set, `void el.offsetWidth` forces a reflow, and the inline transitions are cleared. This is Part 2's rule.

**Stopping a run.** The shared script sends `hb:input` when the visitor presses, types, scrolls or touches inside the stage; a run under way stops at once and leaves the visitor in control. Two kinds of visitor input send no `hb:input`, so the page listens for them itself, only while a run is under way:
- pointing: the two hover pages stop on a trusted `pointermove` over the stage;
- a Tab press that moves the focus into the stage from outside: Focus Ring and Form Field Morph stop on a trusted `focusin` inside the stage. Their runs move no focus, so every `focusin` there is the visitor's.

Each section says what "stops" also undoes.

**Pretend hover and focus.** A script cannot make `:hover`, `:active`, `:focus-visible` or `:focus-within` match, so the run puts the class `is-demo` on the item it points at or focuses. Every style the run plays is written for both: the real state (hover only inside `@media (hover: hover)`, as today) and `.is-demo`, which sits outside the hover media query so the run also plays on touch screens. The run never moves the real focus.

**Hover and tap.** Hover rules stay inside `@media (hover: hover)`, and every hover has the tap equivalent the section names.

**Reset** is on a page only where the visitor can leave the demo changed in a way its own controls cannot undo in one step (Part 2's rule). In this half that is Checkmark Draw, whose finished button stays disabled, and Notification Badge Pulse, whose cleared badges have no control to bring them back. Reset calls `stopRun()`, then puts the demo back as it is on arrival. Everywhere else a second press of the same control undoes the change, and Show me starts from rest anyway.

**Slow motion on do-it pages** is "css": while it is on, the shared script slows every CSS animation and transition on the stage to a third of its speed, including the visitor's own hovers and presses. `later()` triples the movement part of the run's timers and never the holds (read when each timer is set). Canvas steps are slowed only where the section says.

## Reduced motion

- **Do-it pages:** nothing runs on arrival (the shared script); Show me and Reset still work. The browser check presses Show me under reduced motion and needs a visible change on the stage within about 1.5 seconds, and it also needs the stage to stay still before that. So every section names what its reduced-motion version shows, and no do-it stage moves by itself under reduced motion.
- **Loops:** the shared script starts the loop paused and Play starts it. The pages' own reduced-motion rules that pause or remove the loop go, because Play must be able to move it.
- **Plays once:** as on the Entrance & Exit pages. Loop and Slow motion are greyed out, and Replay plays the reduced version once.

## Stage

- The stage keeps only the demo: counters, readouts, captions, notes, teaching overlays and on-stage buttons that only drive the demo go (each section lists them).
- The page owns the stage's size, border and corners. The old `--stage-h`, the stage's `height`, `flex`, `min-width`, `border` and `border-radius`, and the phone rules that made the stage `height:auto` go. The demo's own `.stage` rule keeps its background, its flex centring, `position:relative` and `overflow:hidden` where it has them, and the padding and gap its section gives.
- Heights were measured with the site font on the phone stage (343×300, and 288×300 at 320px wide) and the laptop stage (960×327, which is what a 1366×657 screen gets). Every stage in this half fits the default height, so no page sets `--hb-stage-h`, and none takes typed text that grows, so none uses `hb-grow`. The measured height of each stage's content is in its section.
- **Site font on controls:** stage buttons, inputs, selects and textareas get `font-family:inherit`, because form controls do not take the page font by themselves.
- **Focus looks on the stage:** the shared stylesheet draws the site's focus ring on every focused element (`body.hb :focus-visible`, specificity 0,2,1). A stage control with its own focus look beats the site ring with a stronger selector: Focus Ring's rings, Form Field Morph's fields and Toggle / Switch Slide's track. A control without one keeps the site ring.
- **Grey stage text:** `:root`'s `--ui-muted` becomes `#8a8a92`, as in Part 2 (the site's own muted grey), so every stage rule that uses it changes at once. It is 5.7:1 on the stage's `#0b0b0d` and 5.5:1 on the cards' `#111114`; the old `#77777e` is 4.4:1 and 4.2:1. Stage text below 11px goes up to 11px.
- **Movement uses transform and opacity** (CLAUDE.md):
  - Hover State's underline grows with `scaleX`, and its lift's shadow fades in by `opacity`.
  - Button Press Scale's glow crossfades between two shadows by `opacity`.
  - Progress Animation's bar slides in with `translateX` instead of growing its `width`.
  - Transitions on properties that never change are dropped (Toggle's knob shadow, Checkmark's button width).
- **`hb-dots`:** yes on every stage in this half (each has a plain dark background).

---

## hover-state — Hover State Animation

- **Kind:** do — a hover effect: the visitor points at the cards, and Show me points at them in turn.
- **Description:** Six ways a card can react when you point at it. Best for buttons and cards.
- **Step 1:** Hover it — help line: "Point at a card (press and hold it on a phone), or press Show me."
- **Player bar:** Show me · Slow motion (css). No Reset: nothing stays changed once the pointer leaves.
- **What the visitor does:** pointing at a card plays its change (inside `@media (hover: hover)`, as today); pressing a card shows the same change while it is held (`:active`, as today), which is the tap equivalent on touch screens.
- **Show me:** points at the six cards in reading order.
  - Card i (0 to 5) gets `is-demo` with `later(on, i*dur, i*320)` and loses it with `later(off, (i+1)*dur, i*320+270)`, where `dur` is Speed. Each change plays in, holds 270ms and plays back out, and the next card starts 50ms after.
  - At the defaults the cards go on at 0, 500, 1000, 1500, 2000 and 2500ms, each for 450ms. The run is at rest by about 3.1 s, or about 5.7 s with Slow motion.
  - Stops on `hb:input` and on the visitor's own `pointermove` over the stage; stopping removes `is-demo` from every card.
  - The CSS gives each card's change to `.is-demo` as well as to `:hover` and `:active`, outside the hover media query (for example `.h-scale:active,.h-scale.is-demo{transform:scale(1.03)}`).
- **Reset:** none.
- **Slow motion:** css. `later()` triples each card's movement (Speed), not its 270ms and 50ms holds.
- **Reduced motion:** the demo's rule stays: the cards change look at once, without the transition. Show me still switches each card's look on and off in turn.
- **Stage font:** site font. `.hcard-name` and `.card-link` get `font-size:15px` and `font-weight:700`.
- **Stage:** the six cards stay, two to a row on every screen (the phone rule that made one column goes). The small "Technique 1" to "Technique 6" labels go, and the names become plain: "Color change", "Grow", "Lift", "Underline" (the link text of the underline card), "Arrow nudge" (with its →) and "Sweep". `.hgrid` gets `gap:10px`; `.hcard` gets `min-height:72px` and `padding:14px 12px`; the stage gets `padding:16px`. The wrapper `div` around the grid keeps `width:100%`. `hb-dots`: yes. Measured: 270px on a phone, 284px at 320px, 270px on a laptop.
  - Two changes move to transform and opacity (see the preamble). Today the underline grows by `width` and the lift adds a `box-shadow`.
  - The underline: `.h-underline .card-link::after` gets `width:100%`, `transform:scaleX(0)` and `transform-origin:left`, and a `transform` transition. It grows with `transform:scaleX(1)` on hover, `:active` and `.is-demo`.
  - The lift: `.h-lift` gets `overflow:visible` and keeps only its `translateY(-4px)`, with a `transform` transition. Its shadow moves to `.h-lift::after` (`content:'';position:absolute;inset:0;border-radius:inherit;box-shadow:0 8px 24px rgba(0,0,0,.6);opacity:0;pointer-events:none;transition:opacity var(--dur) var(--ease)`), which fades in (`opacity:1`) on hover, `:active` and `.is-demo`.
  - The reduced-motion rule also lists `.h-lift::after`.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons | Slow · Normal · Fast | Normal | Quick feels responsive; slow can feel sticky. | `--dur`: 300ms / 180ms / 110ms |
| Feel | Choice buttons | Smooth · Springy · Gentle · Even | Smooth | Springy goes a little too far, then settles. | `--ease`: `ease` / `cubic-bezier(.34,1.56,.64,1)` / `ease-in-out` / `linear` |

**More options**

None: leave out the `details.hb-options` block.

- **Removed:**
  - The two notes.
  - The hover counters under the cards and the Total hovers readout.
  - The Duration slider and the Easing menu. They become Speed and Feel. Ease out goes: it looks nearly the same as Smooth, which keeps today's default curve (`ease`).
  - The "Technique 1" to "Technique 6" labels.
- **Good for:** Buttons · Links · Cards · Menus · **Avoid on:** Plain text · Non-clickable items
- **Prompt:**

  > Add hover feedback to [the buttons, links or cards you want to react]. When the pointer moves over an item, change it in one clear way: shift its background color, grow it slightly, lift it with a deeper shadow, draw an underline out from the left, nudge its arrow forward, or sweep a tint across it. Use one style per kind of item and keep it the same across the page. Apply hover styles only on devices that can hover, and show the same change while an item is pressed on touch screens. If the visitor has reduced motion turned on, switch the look without animating it. Match the settings listed below.

- **README What it is:** rewritten:

  > A hover state is a small change that plays when the pointer moves over something you can click, such as a button, a link or a card. It tells people the item will respond before they click it. The demo shows six common ways to do it: a color change, a slight grow, a lift with a shadow, an underline that draws out, an arrow that nudges forward and a tint that sweeps across.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Speed | Normal | How long each change takes: slow is 300ms, normal 180ms and fast 110ms; keep hover changes at 200ms or less so moving across several items never feels sticky |
  | Feel | Smooth | Smooth slows into place; Springy goes a little too far, then settles; Gentle eases in and out; Even keeps one steady pace |

- **README See also:**
  - [Button Press Scale](../button-press-scale/) — the button shrinks while it is pressed
  - [Tooltip Reveal](../tooltip-reveal/) — pointing at an item shows a short note
  - [Click / Tap Ripple](../click-ripple/) — a ripple spreads from the spot you press
- **README How it works:** the snippets must match the demo. In the first CSS snippet, `.h-color:hover { background: #1a2a3a; border-color: var(--ui-accent); }` becomes `@media (hover: hover) { .h-color:hover { background: #2a201a; border-color: var(--ui-accent); } }` followed by `.h-color:active { background: #2a201a; border-color: var(--ui-accent); }`, and the sweep's `rgba(88,166,255,.13)` becomes `rgba(255,157,92,.13)`. The rest is unchanged.
- **README Production notes:** unchanged
- **Category line:** `04.01 · Micro-Interactions`
- **Pager:** Previous: none · Next: Click / Tap Ripple (`../click-ripple/`)

---

## click-ripple — Click / Tap Ripple

- **Kind:** do — a click effect: the visitor presses a button, and Show me presses the three buttons in turn.
- **Description:** A ripple spreads out from the spot you press. Best for buttons and list items.
- **Step 1:** Click it — help line: "Click or tap anywhere on a button, or press Show me."
- **Player bar:** Show me · Slow motion (css). No Reset: every ripple fades away by itself.
- **What the visitor does:** pressing a button (`pointerdown`, so mouse, touch and pen alike, as today) spawns a ripple at the press point, or at the button's middle when Starts from is The middle.
- **Show me:** presses each button once, top to bottom, each at a different point so the start point shows: a quarter of the way across the first button, three quarters across the second, and the middle of the third, all at half height.
  - Button i (0 to 2) is pressed with `later(press, i*dur, i*100)`, where `dur` is Speed: each ripple plays, then 100ms pass before the next press.
  - Each press calls `spawnRipple(btn, {clientX, clientY})` with that point, taken from the button's `getBoundingClientRect()` at the moment of the press, so Starts from and every other setting apply.
  - At the defaults the presses come at 0, 700 and 1400ms, and the last ripple has faded by 2000ms, or about 5.6 s with Slow motion.
  - A single press lasts only 0.6 seconds, so the run presses all three buttons, one press each.
  - Stops on `hb:input`; ripples already spreading finish by themselves.
- **Reset:** none.
- **Slow motion:** css (the ripple is a `@keyframes` animation on the stage). `later()` triples each ripple's time (Speed), not the 100ms between presses.
- **Reduced motion:** the demo's rule changes. Today it shortens the ripple to 1ms, which shows nothing at all, and Show me must still visibly work. Under reduced motion the ripple no longer grows: it appears at full size and only fades out, over Speed, so the press shows as a soft flash across the button. The rule becomes `.ripple{animation-name:ripple-fade}` with `@keyframes ripple-fade{from{transform:scale(var(--ripple-scale))}to{transform:scale(var(--ripple-scale));opacity:0}}` (the ripple keeps its start opacity, and `animationend` still removes it). `.rbtn{transition:none!important}` stays.
- **Stage font:** site font. `.rbtn` gets `font-family:inherit` in place of `monospace`.
- **Stage:** the three buttons stay. Their labels become "Primary button", "Secondary button" and "Outline button" (was "Primary Action", "Secondary Action", "Ghost / Outline"). The counters (`.cnt-row`) go. The stage gets `padding:24px` and `gap:20px`. `hb-dots`: yes. Measured: 246px on phones and laptops.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Starts from | Choice buttons | Where you press · The middle | Where you press | Where you press shows exactly where it landed. | `fromCenter`: `false` / `true` |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long the ripple takes to spread and fade. | `dur`: 1000 / 600 / 350 (ms, each new ripple's `animation-duration`) |
| Ripple size | Choice buttons | Small · Medium · Large | Medium | How far the circle grows before it fades. | `scale` (each new ripple's `--ripple-scale`): 1.5 / 2.5 / 4 |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Ripple strength | Choice buttons | Faint · Medium · Strong | Medium | How visible the ripple is when it starts. | `opacity`: 0.2 / 0.4 / 0.6 |
| Ripple color | Swatches (the demo's own three colours) | White · Orange · Black | White | Pick a color that shows up on your buttons. | `color`: `255,255,255` / `255,157,92` / `0,0,0` (swatch colours `#ffffff` / `#ff9d5c` / `#000000`) |

- **Removed:**
  - The note, the click counters and the Total clicks readout.
  - The Duration, Max Scale and Start Opacity sliders. They become Speed, Ripple size and Ripple strength.
  - The Ripple Color menu. It becomes swatches: Accent becomes Orange, and Dark becomes Black.
  - The "From center (not click point)" checkbox. It becomes Starts from.
- **Good for:** Buttons · List items · Menu items · Icon buttons · **Avoid on:** Links in text · Large panels
- **Prompt:**

  > Add a ripple to [the buttons or list items you want to respond to presses]. When the visitor presses one, a soft circle appears where they pressed, or in the middle when the settings say so, then grows outward and fades away. Clip it to the button's shape so it never spills outside, start it as soon as the press begins so the feedback feels instant, and remove each ripple once it has faded so quick taps do not pile up. It should work the same for mouse, touch and pen. If the visitor has reduced motion turned on, fade a flat highlight over the button instead of a growing circle. Match the settings listed below.

- **README What it is:** rewritten:

  > A ripple is a soft circle that grows out from the spot you press and fades away. It confirms that the press registered and shows exactly where it landed, which helps most on touch screens, where nothing reacts to hovering. Material Design, Google's design system, made it popular.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Starts from | Where you press | Where you press shows exactly where the press landed; the middle is simpler but less exact |
  | Speed | Normal | How long the ripple takes to spread and fade: slow is 1000ms, normal 600ms and fast 350ms; a little longer than a hover change, because the click is already made |
  | Ripple size | Medium | How far the circle grows before it fades: small, medium or large; even small reaches every corner of the button |
  | Ripple strength | Medium | How visible the ripple is at the start: faint is 20%, medium 40% and strong 60% |
  | Ripple color | White | White suits colored buttons, orange matches the accent, black suits light buttons |

- **README See also:**
  - [Button Press Scale](../button-press-scale/) — the button shrinks while it is pressed
  - [Hover State Animation](../hover-state/) — items react before they are clicked
  - [Checkmark Draw](../checkmark-draw/) — a tick draws itself once the task is done
- **README How it works:** unchanged
- **README Production notes:** add a bullet after "Cleanup": "**Reduced motion**: skip the growing circle and fade a flat highlight over the button instead, so the press still shows. The demo does this." The rest is unchanged.
- **Category line:** `04.02 · Micro-Interactions`
- **Pager:** Previous: Hover State Animation (`../hover-state/`) · Next: Focus Ring Animation (`../focus-ring/`)

---

## focus-ring — Focus Ring Animation

- **Kind:** do — the rollout's "Press Tab" page: the visitor moves through the form with the Tab key, and Show me moves the ring through its four items.
- **Description:** A ring closes in around the item the Tab key reaches. Best for forms and menus.
- **Step 1:** Press Tab — help line: "Click the first field and press Tab to move through the form, or press Show me."
- **Player bar:** Show me · Slow motion (css). No Reset (see Removed).
- **What the visitor does:** the Tab key moves the real focus through the text field, the menu, the button and the link, and each one draws its ring on `:focus-visible`, as today. A mouse click on the menu, the button or the link shows no ring; the text field shows one on click too, because browsers treat a field you type in as keyboard focus.
- **Show me:** draws the ring on the four items in turn with `is-demo`: the text field, the menu, the button and the link.
  - Item i (0 to 3) gets `is-demo` with `later(ring, i*ringDur, i*460)`, and the item before it loses it at the same moment. The last one loses it with `later(end, 4*ringDur, 4*460)`, back to rest. `ringDur` is Speed: each ring closes in, then holds 460ms.
  - At the defaults the ring moves at 0, 600, 1200 and 1800ms and goes at 2400ms, or about 3.5 s with Slow motion.
  - At the start the run also blurs a stage item that has the real focus.
  - The run never moves the real focus (owner decision). Moving it would take a keyboard or screen-reader user's place on the page when Show me runs on arrival, scroll the page, and open the on-screen keyboard on phones. So the ring is drawn the way the other do-it pages draw a pretend hover.
  - The four ring-style rules and the reduced-motion rule each list `.focusable.is-demo` beside `.focusable:focus-visible`, so the same `ring-in` animation plays.
  - Stops on `hb:input` and on a trusted `focusin` inside the stage (a Tab press into the form sends no `hb:input`); stopping removes `is-demo` from all four items.
- **Reset:** none.
- **Slow motion:** css (the `ring-in` keyframes and the border transition). `later()` triples each ring's closing-in (Speed), not the 460ms holds.
- **Reduced motion:** the demo's rule stays, extended to the `is-demo` rings: the ring shows at once, without closing in. Show me still moves the ring from item to item.
- **Stage font:** site font. `.focusable`, `.form-btn` and `.form-link` get `font-family:inherit` in place of `monospace`.
- **Stage:** the form stays: Full name, Country, Submit Form and Forgot password?. The step strip above it (`.tab-indicator`, "1 · Text" to "4 · Link") goes, because it is a readout of where the focus is. The field labels become 11px; their grey is `--ui-muted`. `.form` gets `gap:12px` and the stage `padding:16px`. The ring-style rules (specificity 0,3,0) already beat the site's focus ring. `hb-dots`: yes. Measured: 286px on phones and laptops.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Ring style | Choice buttons | Solid · Dashed · Glow · Wide | Solid | Glow adds a soft halo; Wide fills the gap with color. | the form's class: `ring-solid` / `ring-dashed` / `ring-glow` / `ring-dual` |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How quickly the ring closes in around the item. | `--ring-dur`: 220ms / 140ms / 80ms |
| Ring thickness | Choice buttons | Thin · Medium · Thick | Medium | Thicker rings are easier to spot. | `--ring-w`: 1px / 2px / 4px |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Ring gap | Choice buttons | None · Small · Large | Small | The space between the ring and the item. | `--ring-offset`: 0px / 3px / 6px |

- **Removed:**
  - The note, the "Click in stage, then press Tab." line and the step strip on the stage.
  - The Reset focus button. Clicking it already takes the focus off the form, so it did nothing more, and the Show me run never moves the real focus.
  - The Ring Style menu. It becomes Ring style. "Dual ring" becomes Wide, because it draws one thick band: its shadow fills the gap up to the outline, leaving only a thin dark line next to the item.
  - The Ring Width, Ring Offset and Duration sliders. They become Ring thickness, Ring gap and Speed.
- **Good for:** Forms · Buttons · Links · Menus · **Avoid on:** Non-interactive items
- **Prompt:**

  > Add an animated focus ring to [the links, buttons and form fields on your page]. When keyboard focus moves to an item, draw an outline around it that starts a little further out and faint, then closes in to its place, so each Tab press is easy to follow. Show the ring only for keyboard focus, not after mouse clicks, and never remove the browser's focus outline without drawing this one instead. Make sure the ring stands out against every background it sits on. If the visitor has reduced motion turned on, show the ring at once without closing in. Match the settings listed below.

- **README What it is:** rewritten:

  > A focus ring is the outline that shows which item the keyboard is on. Animating it, so the ring closes in around each item as you press Tab, makes every move easier to follow. It shows only when the keyboard is used, so people who click with a mouse do not see rings appear.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Ring style | Solid | Solid is a plain outline; Dashed draws it in dashes; Glow adds a soft halo; Wide fills the gap between the item and the ring, making one thick band |
  | Speed | Normal | How long the ring takes to close in: slow is 220ms, normal 140ms and fast 80ms; fast enough not to feel delayed, slow enough to see |
  | Ring thickness | Medium | Thin is 1px, medium 2px and thick 4px; 2px or more is easy to see |
  | Ring gap | Small | The space between the ring and the item: none, 3px or 6px; 2 to 4px looks natural |

- **README See also:**
  - [Form Field Morph](../form-field-morph/) — the label moves up when a field is focused
  - [Hover State Animation](../hover-state/) — items react when the pointer is over them
  - [Button Press Scale](../button-press-scale/) — the button shrinks while it is pressed
- **README How it works:** the snippets must match the demo's colour. In the first snippet `--ring-color: #58a6ff;` becomes `--ring-color: #ff9d5c;`, and in the glow snippet `rgba(88,166,255,.18)` becomes `rgba(255,157,92,.18)`. The rest is unchanged.
- **README Production notes:** unchanged
- **Category line:** `04.03 · Micro-Interactions`
- **Pager:** Previous: Click / Tap Ripple (`../click-ripple/`) · Next: Button Press Scale (`../button-press-scale/`)

---

## button-press-scale — Button Press Scale

- **Kind:** do — a press effect: the visitor presses a button, and Show me presses the three buttons in turn.
- **Description:** Shrinks as you press it and springs back as you let go. Best for main buttons.
- **Step 1:** Click it — help line: "Press and hold a button, then let go, or press Show me."
- **Player bar:** Show me · Slow motion (css). No Reset: a button always returns to full size when it is let go.
- **What the visitor does:** pressing a button adds `pressed` (`pointerdown`, or Space and Enter), and letting go removes it (`pointerup`, or the key coming up), as today; `pointercancel` lets go too. Touch works the same way.
- **Show me:** presses each button once, top to bottom (Confirm, Save Draft, Cancel).
  - Button i (0 to 2) goes down (`pressed` on) with `later(down, i*(pd+rd), i*540)` and comes up with `later(up, i*(pd+rd)+pd, i*540+320)`. `pd` is Press speed and `rd` Release speed: each press shrinks, holds 320ms and springs back, and 220ms pass before the next press.
  - At the defaults the buttons go down at 0, 800 and 1600ms and come up 400ms later each. The run is at rest by about 2.2 s, or about 3.7 s with Slow motion.
  - Stops on `hb:input`; stopping removes `pressed` from every button. The shared script sends `hb:input` before the button's own `pointerdown` handler runs, so the visitor's own press still takes effect.
- **Reset:** none.
- **Slow motion:** css. `later()` triples each press and spring-back (Press speed and Release speed), not the 320ms and 220ms holds.
- **Reduced motion:** the demo's rule stays: the button changes to its pressed size and back at once, without the transition. Show me still presses each button in turn.
- **Stage font:** site font. `.pbtn` gets `font-family:inherit` in place of `monospace`.
- **Stage:** the three buttons stay (Confirm, Save Draft, Cancel). Their `aria-label`s go, so each button's name is its visible text ("Save" did not match "Save Draft"). The press counters (`.cnt-row`) go. The stage gets `padding:24px`. `hb-dots`: yes. Measured: 274px on phones and laptops.
  - The glow crossfades instead of animating `box-shadow` (see the preamble). `.pbtn` gets `position:relative`, and its `box-shadow` rules and the `box-shadow` parts of its two transitions go.
  - Each button's resting shadow moves to `::before` and its pressed shadow to `::after`, both with `content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none`. The outlined Cancel button uses `inset:-1px`, so its shadow starts at its border edge, as today.
  - The shadows keep today's values (resting / pressed):
    - Confirm: `0 4px 20px rgba(255,157,92,.35)` / `0 1px 6px rgba(255,157,92,.2)`
    - Save Draft: `0 4px 20px rgba(86,211,100,.3)` / `0 1px 6px rgba(86,211,100,.15)`
    - Cancel: `0 4px 14px rgba(0,0,0,.4)` / `0 1px 4px rgba(0,0,0,.3)`
  - At rest `::before` has `opacity:1` and `::after` `opacity:0`; `.pressed` swaps them. Their `opacity` transitions use the same timing as the size: `var(--press-dur) ease` going down (under `.pbtn.pressed`) and `var(--release-dur) var(--release-ease)` coming up. So the glow still eases, and Slow motion slows it with the size.
  - The reduced-motion rule also lists `.pbtn::before,.pbtn::after`.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Press depth | Choice buttons | Light · Medium · Deep | Medium | How much the button shrinks while held down. | `--press-scale`: 0.97 / 0.95 / 0.9 |
| Release speed | Choice buttons | Slow · Normal · Fast | Normal | How long it takes to spring back. | `--release-dur`: 300ms / 180ms / 110ms |
| Release feel | Choice buttons | Springy · Smooth · Even | Springy | Springy goes a little past full size, then settles. | `--release-ease`: `cubic-bezier(.34,1.56,.64,1)` / `ease-out` / `linear` |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Press speed | Choice buttons | Slow · Normal · Fast | Normal | A press should feel instant, so keep it short. | `--press-dur`: 130ms / 80ms / 50ms |

- **Removed:**
  - The note, the press counters and the Total presses readout.
  - The Press Scale, Press Duration and Release Duration sliders. They become Press depth, Press speed and Release speed.
  - The Release Easing menu. It becomes Release feel. Ease out becomes Smooth, and the menu's own "Smooth" curve (`cubic-bezier(.2,.7,.3,1)`) goes, because it looks nearly the same as Ease out.
- **Good for:** Main buttons · Icon buttons · Mobile apps · **Avoid on:** Links in text · Large cards
- **Prompt:**

  > Add press feedback to [the buttons you want to feel tactile]. While a button is held down it shrinks, as if pushed in, and when it is let go it returns to full size. A press that is quicker than the release feels most like a real button. Respond to mouse, touch and pen presses and to Space and Enter on the keyboard, and let go cleanly if a press turns into a scroll, so no button stays stuck down. Change only the button's size so nothing around it moves. If the visitor has reduced motion turned on, change the size at once, without animating it. Match the settings listed below.

- **README What it is:** rewritten:

  > Button press scale makes a button shrink slightly while it is pressed and spring back when it is let go. A screen has no real button travel, so this small shrink stands in for the feel of pushing a physical button, and it confirms that the press registered.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Press depth | Medium | How small the button gets while held down: light is 97%, medium 95% and deep 90% of its size; smaller than 90% looks broken |
  | Release speed | Normal | How long it takes to spring back: slow is 300ms, normal 180ms and fast 110ms; about twice the press time feels natural |
  | Release feel | Springy | Springy goes a little past full size, then settles; Smooth slows into place; Even keeps one steady pace |
  | Press speed | Normal | How long the shrink takes: slow is 130ms, normal 80ms and fast 50ms; a press should feel instant |

- **README See also:**
  - [Click / Tap Ripple](../click-ripple/) — a ripple spreads from the spot you press
  - [Hover State Animation](../hover-state/) — items react before they are clicked
  - [Checkmark Draw](../checkmark-draw/) — a tick draws itself once the task is done
- **README How it works:** unchanged
- **README Production notes:** the `prefers-reduced-motion` bullet becomes: "**`prefers-reduced-motion`**: switch the transitions off for users who request reduced motion, so the button changes size at once instead of animating; the demo does this." The rest is unchanged.
- **Category line:** `04.04 · Micro-Interactions`
- **Pager:** Previous: Focus Ring Animation (`../focus-ring/`) · Next: Magnetic Button (`../magnetic-button/`)

---

## magnetic-button — Magnetic Button

- **Kind:** do — a hover effect: the visitor moves the pointer near the button, and Show me moves a pretend pointer around it.
- **Description:** Leans toward the pointer, then springs home. Best for one main button.
- **Step 1:** Hover it — help line: "Move the pointer close to the button (touch near it on a phone), or press Show me."
- **Player bar:** Show me · Slow motion (css). No Reset: the button always springs home.
- **What the visitor does:**
  - With a mouse: moving over the stage pulls the button toward the pointer while it is within Reach, and leaving the stage or the reach sends it home (inside the `(hover: hover)` branch, as today).
  - The tap equivalent, new (today a touch screen only changes a hint): on a touch, `pointerdown` on the stage pulls the button toward the finger, `pointermove` while the finger is down follows it, and `pointerup` or `pointercancel` sends it home. These handlers act only when `e.pointerType` is not `"mouse"`. The stage keeps `touch-action:manipulation`, so a swipe still scrolls the page, which cancels the touch and sends the button home.
  - Pressing the button still shrinks it slightly (`pressed`), as today.
  - The pull is one function that takes a point on the stage (today's `pointermove` body): the mouse, the touch and Show me all call it.
- **Show me:** moves a pretend pointer around the button, calling the pull function with three points.
  - The points are fixed offsets from the button's resting centre, taken once when the run starts from its layout box: `offsetLeft + offsetWidth/2` and `offsetTop + offsetHeight/2`, with the stage as offset parent. The pull's transform never moves the layout box.
  - The offsets are up and to the left (−0.55 × Reach, −0.35 × Reach), to the right (+0.6 × Reach, +0.1 × Reach) and below (−0.1 × Reach, +0.5 × Reach).
  - The pull function itself still measures from the button's current, moved position, as it does for the real pointer.
  - Point k (0 to 2) is pulled toward with `later(pull, k*550, k*150)`, and the button is sent home with `later(reset, 1650, 450)`. 550ms is the button's glide (its transition), and each point holds 150ms.
  - At the defaults the pulls come at 0, 700 and 1400ms, and the button is sent home at 2100ms and settles by about 2650ms, or about 7 s with Slow motion.
  - Stops on `hb:input` and on the visitor's own mouse `pointermove` over the stage. In the stage's `pointermove` handler, a run under way is stopped first (`stopRun()`, which sends the button home), and the pull runs after it, so the visitor's pointer takes over at once.
- **Reset:** none.
- **Slow motion:** css (the button's and label's `.55s` transform transitions). `later()` triples each 550ms glide, not the 150ms holds.
- **Reduced motion:** the demo's rule stays: the button still follows, with a short, even move (`.12s linear`) instead of the slow glide. Show me still moves it to each point.
- **Stage font:** site font. `.mag` drops `var(--disp)` and keeps `font-weight:700`.
- **Stage:** only the button stays ("Get Started"). The dashed radius ring (`.ring`) and the hint under the button (`.hint`) go. `hb-dots`: yes. Measured: 65px of content, centred.
  - The label's class `lbl` becomes `mag-label` in the CSS (`.mag .mag-label` and the reduced-motion rule), the markup and the script's lookup, because the page checks reject `class="lbl"` (an old panel class).

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Pull strength | Choice buttons | Gentle · Medium · Strong | Medium | Stronger pulls feel playful; gentle ones feel calm. | `strength`: 0.2 / 0.35 / 0.5 |
| Reach | Choice buttons | Short · Medium · Long | Medium | How close the pointer must come before it pulls. | `radius`: 100 / 160 / 240 (px) |

**More options**

None: leave out the `details.hb-options` block.

- **Removed:**
  - The note, the Pull and Input readouts, and the hint on the stage.
  - Show radius ring and the dashed ring. The ring is a teaching overlay, not part of the effect.
  - The Magnet Strength and Activation Radius sliders. They become Pull strength and Reach; Magnet Strength could reach 0, which switched the effect off.
- **Good for:** Hero buttons · Portfolio sites · One key action · **Avoid on:** Forms · Rows of buttons
- **Prompt:**

  > Add a magnetic effect to [the one button you want to stand out]. When the pointer comes within reach, pull the button part of the way toward it, more strongly the closer it gets, and move its label a little further so the label seems to float above the button. When the pointer leaves, let the button spring back to its place. Move it only with transforms so the layout never shifts, and use it on one or two buttons at most. On touch screens, pull the button toward the finger while it touches and send it home when it lifts. If the visitor has reduced motion turned on, move it quickly and evenly instead of letting it glide. Match the settings listed below.

- **README What it is:** rewritten:

  > A magnetic button seems to be drawn to the pointer. When the pointer comes close, the button moves part of the way toward it and its label moves a little further, so the label seems to float above the button. When the pointer leaves, the button springs back; it never leaves its place in the layout.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Pull strength | Medium | How far the button moves toward the pointer: gentle is 20%, medium 35% and strong 50% of the distance; past about half it feels loose |
  | Reach | Medium | How close the pointer must come before the pull starts: short is 100px, medium 160px and long 240px; too far and the button reacts to unrelated movement |

- **README See also:**
  - [Button Press Scale](../button-press-scale/) — the small shrink it also does when pressed
  - [Hover State Animation](../hover-state/) — simpler ways to react to the pointer
  - [Cursor Follower](../cursor-follower/) — a shape that follows the pointer around
- **README How it works:** the last sentence, "On touch devices (no hover), the magnet is skipped entirely and the button only does a press-scale on tap.", becomes "On touch screens, which cannot hover, the same pull follows a finger while it touches the stage, and the button springs home when the finger lifts." The rest is unchanged; the label's 0.35 multiplier and the return easing, which leave the Key parameters table, are already described there.
- **README Production notes:** the "Gate on hover capability" bullet becomes: "**Gate on hover capability**: bind the hover magnet only where `window.matchMedia('(hover: hover)').matches`. On touch screens `pointermove` fires only while a finger is down, so pull toward the touch point while it is down and send the button home when it lifts, or fall back to a plain press-scale." The "Reduced motion" bullet becomes: "**Reduced motion**: shorten the transition to a quick, even move, so the button still follows the pointer without the slow glide." The rest is unchanged.
- **Category line:** `04.05 · Micro-Interactions`
- **Pager:** Previous: Button Press Scale (`../button-press-scale/`) · Next: Toggle / Switch Slide (`../toggle-switch/`)

---

## toggle-switch — Toggle / Switch Slide

- **Kind:** do — a click effect: the visitor flips a switch, and Show me flips each switch and back.
- **Description:** The knob slides across as the switch turns on or off. Best for settings.
- **Step 1:** Click it — help line: "Click or tap a switch to turn it on or off, or press Show me."
- **Player bar:** Show me · Slow motion (css). No Reset (owner decision): a second click flips a switch back, and Show me starts from the arrival state.
- **What the visitor does:** clicking or tapping a switch (or pressing Space on it) flips its checkbox, and the CSS `:checked` rules slide the knob and colour the track, as today.
- **Show me:** starts from rest. `toRest()` puts the switches back as they are on arrival (Notifications on, Appearance off, Auto-save on) without animating. Then the run flips each switch and flips it back.
  - Switch i (0 to 2) flips with `later(flip, i*dur, i*200)` and flips back with `later(back, (3+i)*dur, 1000+i*200)`, where `dur` is Speed. Each slide takes Speed, 200ms pass between switches, and all three rest 600ms before they flip back.
  - At the defaults they flip at 0, 400 and 800ms and back at 1600, 2000 and 2400ms. The run is at rest by about 2.6 s, or about 5 s with Slow motion.
  - The run sets each checkbox's `checked` directly (no `change` event is needed now that the status readout is gone).
  - Stops on `hb:input`; the switches stay as they are.
- **Reset:** none.
- **Slow motion:** css. `later()` triples each slide (Speed), not the 200ms and 600ms holds.
- **Reduced motion:** the demo's rule stays: the knob jumps and the track colour changes over 0.1s. Show me still flips each switch.
- **Stage font:** site font. `.tog-label` gets `font-size:15px` and `font-weight:600`.
- **Stage:** the three switches and their names stay (Notifications, Appearance, Auto-save). The grey lines under the names (`.tog-sub`) go; the third one ("Elastic release overshoot") would be wrong with Springy knob off. The On/Off status readout (`.status-row`) goes. `hb-dots`: yes. Measured: 270px on phones and laptops.
  - Keyboard focus: the checkbox is invisible (`opacity:0` and no size), so a Tab press showed nothing. The track now shows it, as the switch's own focus look (see the preamble): `.sw input:focus-visible ~ .sw-track{outline:2px solid var(--ui-accent);outline-offset:2px}`.
  - The knob's transitions keep only `transform`: `box-shadow` and `background` leave them, because neither changes.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons | Slow · Normal · Fast | Normal | Fast feels mechanical; slow can feel sluggish. | `--tog-dur`: 320ms / 200ms / 120ms |
| Feel | Choice buttons | Smooth · Gentle · Even | Gentle | Gentle gives the knob weight; Even feels robotic. | `--tog-ease`: `ease-out` / `cubic-bezier(.4,0,.2,1)` / `linear` |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Springy knob | Switch | on / off | on | The third switch's knob goes past the end, then settles. | Auto-save's switch (the `label.sw` around `#sw2`) has the `elastic` class, so its knob uses the springy `.sw.elastic .sw-thumb` transition / has no `elastic` class, so its knob uses the shared `.sw-thumb` transition (Speed and Feel). This replaces today's inline style, so `toRest()` can clear inline transitions safely. |
| On color | Swatches (White is left out: the knob is white) | Pink · Blue · Purple · Green · Orange | Blue | The track color when a switch is on. | `--on-color`: `#ff6f8b` / `#58a6ff` / `#d2a8ff` / `#56d364` / `#ffa657` (the Appearance switch keeps its own orange, as today) |

- **Removed:**
  - The note and the "Tap any toggle to flip state." line.
  - The On/Off status readout and the grey lines under the switch names.
  - The Duration slider and the Easing menu. They become Speed and Feel. Today's default curve, "Material smooth", keeps its value under Gentle, and Ease out becomes Smooth. The menu's Ease in-out goes, because Gentle already covers an in-and-out curve.
  - The colour picker. It becomes the On color swatches.
  - "Elastic on toggle 3". It becomes Springy knob.
- **Good for:** Settings · Preferences · Dark mode switches · **Avoid on:** Forms sent later · More than two options
- **Prompt:**

  > Add an animated toggle switch to [the on/off setting you want to control]. Build it on a real checkbox so it works with the keyboard and screen readers. When it is turned on, the round knob slides across the track and the track fills with color; when it is turned off, both go back. When the settings ask for it, let the knob go slightly past the end and settle, so it feels springy. Make the whole switch and its label easy to tap. If the visitor has reduced motion turned on, move the knob without sliding. Match the settings listed below.

- **README What it is:** rewritten:

  > A toggle switch is an on/off control whose round knob slides across a track, and the track fills with color when it is on. The slide shows the change instead of just flipping it, and its speed and curve decide whether the switch feels mechanical, weighty or springy.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Speed | Normal | How long the knob takes to slide: slow is 320ms, normal 200ms and fast 120ms; under 120ms feels mechanical, over 350ms sluggish |
  | Feel | Gentle | Gentle eases in and out, which gives the knob weight; Smooth starts fast and slows to a stop; Even slides at one steady speed |
  | Springy knob | on | The third switch's knob goes a little past the end, then settles |
  | On color | Blue | The track color when a switch is on; it must stand out from the white knob. The Appearance switch keeps its own orange |

- **README See also:**
  - [Button Press Scale](../button-press-scale/) — the button shrinks while it is pressed
  - [Form Field Morph](../form-field-morph/) — the label moves up when a field is focused
  - [Accordion Open/Close](../accordion/) — a panel opens and closes smoothly
- **README How it works:** unchanged
- **README Production notes:** unchanged
- **Category line:** `04.06 · Micro-Interactions`
- **Pager:** Previous: Magnetic Button (`../magnetic-button/`) · Next: Heart / Like Burst (`../heart-burst/`)

---

## heart-burst — Heart / Like Burst

- **Kind:** do — a click effect: the visitor likes the heart, and Show me likes it once and unlikes it.
- **Description:** The heart pops and fills as small hearts burst out. Best for like buttons.
- **Step 1:** Click it — help line: "Click or tap the heart to like it and again to unlike it, or press Show me."
- **Player bar:** Show me · Slow motion (css). No Reset: a second click unlikes the heart and puts the count back.
- **What the visitor does:** clicking or tapping the heart (or Space or Enter on it) toggles the like, as today. A like fills the heart, plays the pop and bursts the particles; an unlike only removes the colour. The toggle is one function, called by the click and by Show me.
- **Show me:** starts from rest: if the heart is liked, `toRest()` unlikes it without animating, and the count goes back to 128. Then:
  - `later(like, 0, 300)` likes it (fill, pop and burst);
  - `later(unlike, 750, 1250)` unlikes it, back to rest. 750ms is the burst, which fades in about 45 frames, with the 500ms pop inside it; the holds are the first 300ms and 950ms of rest before the unlike.
  - At the defaults the like comes at 300ms and the unlike at 2000ms, or about 3.5 s with Slow motion.
  - Stops on `hb:input`; the heart stays as it is.
- **Reset:** none.
- **Slow motion:** css for the pop and the fill. While the switch is on, the page also slows the burst: each frame moves every particle a third of its usual step. Position, the gravity added to `vy` and the life drain are multiplied by 1/3, and the `0.98` drag becomes `0.98 ** (1/3)`. It takes effect from the next frame. `later()` triples the burst (750ms), not the 300ms and 950ms holds.
- **Reduced motion:** as today, a like only fills the heart, with no pop and no burst (the demo's rule and its `reduce` check stay). Show me still fills and empties the heart.
- **Stage font:** site font. `.count b` drops `var(--disp)`. The "Likes" count and the empty heart's outline both use `--ui-muted`, so both take the new grey.
- **Stage:** the canvas, the heart and the "Likes 128" count stay. The count is part of a real like button, not a readout. `hb-dots`: yes. Measured: 133px of content, centred.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Number of hearts | Choice buttons | Few · Some · Many | Some | More pieces make a bigger celebration. | `pCount`: 10 / 18 / 32 |
| How far they fly | Choice buttons | Short · Medium · Far | Medium | How far the pieces travel before they fade. | `spread`: 60 / 90 / 140 |

**More options**

None: leave out the `details.hb-options` block.

- **Removed:**
  - The note, and the State and Live particles readouts.
  - The Particle Count and Burst Spread sliders. They become Number of hearts and How far they fly.
- **Good for:** Like buttons · Favorites · Bookmarks · Reactions · **Avoid on:** Delete buttons · Neutral toggles
- **Prompt:**

  > Add a like button with a burst to [the heart or favorite button you want to reward]. When the visitor likes something, the heart quickly squashes, overshoots a little and settles as it fills with color, while a spray of tiny hearts and dots flies out from its center, arcs down and fades. Unliking simply removes the color, with no burst. Draw the burst on one layer over the button and stop drawing once the last piece has faded. Tell screen readers whether it is liked. If the visitor has reduced motion turned on, only fill the heart, with no pop or burst. Match the settings listed below.

- **README What it is:** rewritten:

  > A like button that celebrates the moment you like something. The heart quickly squashes, overshoots and settles as it fills with color, while tiny hearts and dots burst out from its center and fade. Unliking just removes the color, with no celebration.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Number of hearts | Some | How many pieces burst out: few is 10, some 18 and many 32; above about 40 it gets busy and costs frames |
  | How far they fly | Medium | How far the pieces travel before they fade: short, medium or far |

- **README See also:** the second link's text changes from "Badge Pulse" to the page's real title.
  - [Button Press Scale](../button-press-scale/) — the squash and spring behind the heart's pop
  - [Notification Badge Pulse](../badge-pulse/) — a badge pulses to catch the eye
  - [Checkmark Draw](../checkmark-draw/) — success shown without a burst
  - [Click / Tap Ripple](../click-ripple/) — a calmer response from the spot you press
- **README How it works:** unchanged
- **README Production notes:** unchanged
- **Category line:** `04.07 · Micro-Interactions`
- **Pager:** Previous: Toggle / Switch Slide (`../toggle-switch/`) · Next: Success Confetti (`../success-confetti/`)

---

## success-confetti — Success Confetti

- **Kind:** do — a click effect: the visitor places the order, and Show me places it once and returns the button to its start.
- **Description:** Confetti bursts from the button when a task is done. Best for big moments.
- **Step 1:** Click it — help line: "Click or tap Place order (again for another burst), or press Show me."
- **Player bar:** Show me only.
  - No Reset, by the preamble's Reset rule: the button stays done, a further click fires another burst, and Show me starts from rest.
  - No Slow motion: the burst already lasts about two seconds and has no quick part to study, and the only CSS on the stage is the button's colour change.
- **What the visitor does:** clicking or tapping the button turns it green with a check and the label "Order placed", and fires the confetti (not under reduced motion), as today. The button stays done, and each further click fires another burst. The click is one function, called by the button and by Show me.
- **Show me:** starts from rest: if the button is done, `toRest()` puts it back to "Place order" without animating (removes `done`, restores the label). Then:
  - `later(place, 0, 300)` clicks it: green, check, "Order placed" and confetti.
  - `later(back, 2100, 700)` puts the button back to "Place order". 2100ms is the burst, whose pieces fade over about 2.1 s; the holds are the first 300ms and 400ms of rest after the burst.
  - At 300ms and 2800ms. The page has no Slow motion, so `later()` never triples.
  - Stops on `hb:input`; the button stays as it is.
- **Reset:** none.
- **Slow motion:** none.
- **Reduced motion:** as today, the button turns green and shows its check, with no confetti (the `reduce` check stays; the press shrink `.order-btn:active` stays off). Show me still turns the button green and back.
- **Stage font:** site font. `.order-btn` drops `var(--disp)`, gets `font-family:inherit` and keeps `font-weight:700`.
- **Stage:** the canvas and the button stay. The caption under the button (`.sub`, "Click to complete — click again to replay") goes; the help line says what to do. `hb-dots`: yes. Measured: 60px of content, centred.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Amount of confetti | Choice buttons | Some · Medium · Lots | Medium | More pieces look fuller but cost more on phones. | `pCount`: 60 / 120 / 200 |
| Spread | Choice buttons | Narrow · Medium · Wide | Medium | Narrow shoots up like a fountain; wide fills a dome. | `spreadDeg`: 60 / 110 / 170 |
| Fall speed | Choice buttons | Floaty · Normal · Heavy | Normal | How quickly the pieces fall back down. | `gravity`: 0.15 / 0.28 / 0.45 |

**More options**

None: leave out the `details.hb-options` block.

- **Removed:**
  - The note, the Live particles readout, and the caption under the button.
  - The Particle Count, Spread and Gravity sliders. They become Amount of confetti, Spread and Fall speed.
- **Good for:** Orders placed · Sign-ups finished · Milestones · **Avoid on:** Everyday clicks · Serious tasks
- **Prompt:**

  > Add a confetti burst to [the action that completes something important, such as placing an order]. When it succeeds, turn the button into a clear success state with a check mark and a short confirmation, and fire small colored rectangles from the button: they shoot upward in a fan, spin, slow down, fall and fade. Save it for real milestones, not everyday clicks. Draw the pieces on one layer and stop drawing once the last one has faded or fallen out of view. If the visitor has reduced motion turned on, show the success state without the confetti. Match the settings listed below.

- **README What it is:** rewritten:

  > A burst of confetti that marks a finished task, such as placing an order. The button turns into a success state, and many small rectangles shoot up from it in a fan, spin, fall and fade. It is a reward: it celebrates the moment but adds no new information.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Amount of confetti | Medium | How many pieces fly: some is 60, medium 120 and lots 200; above about 200 costs frames on slower phones for little gain |
  | Spread | Medium | How wide the fan is: narrow is 60°, medium 110° and wide 170°; narrow looks like a fountain, wide like a dome |
  | Fall speed | Normal | How strongly the pieces are pulled down: floaty, normal or heavy; heavy falls fast, floaty drifts |

- **README See also:**
  - [Checkmark Draw](../checkmark-draw/) — a quieter way to show success
  - [Button Press Scale](../button-press-scale/) — the button shrinks while it is pressed
  - [Heart / Like Burst](../heart-burst/) — a smaller burst for each like
  - [Modal Expand](../modal-expand/) — a dialog grows from the button that opened it
- **README How it works:** in the sentence after the snippet, "adjusting a slider changes the very next burst" becomes "changing a setting changes the very next burst". The rest is unchanged.
- **README Production notes:** in the Reduced motion bullet, the last sentence ("This demo swaps the sub-caption to say so.") goes. The rest is unchanged.
- **Category line:** `04.08 · Micro-Interactions`
- **Pager:** Previous: Heart / Like Burst (`../heart-burst/`) · Next: Skeleton Loader (`../skeleton-loader/`)

---

## skeleton-loader — Skeleton Loader

- **Kind:** once. One play shows the pulsing placeholders, then the real content fades in and stays; Loop repeats it.
- **Description:** Gray shapes hold the place of content while it loads. Best for feeds and cards.
- **Watch it help line:** default
- **Player bar:** Replay · Loop · Slow motion
- **Sequence:** every play is today's `startLoad()` without its progress bar.
  - It clears all timers, shows the placeholders again (`visibility` back) and hides the content at once: the content's transition is switched off, `visible` removed, `void realEl.offsetWidth` forces a reflow, then the transition is switched back on.
  - After Loading time, one `later()` timer calls `reveal()`: the placeholders hide and the content fades in over 400ms (`--fade-dur`, new, in place of the fixed `400ms`). The animation-frame tick that only moved the bar goes.
  - While Loop is on, the content holds 1600ms after its fade ends. Loop is checked at that moment, and the next play starts, with the placeholders back at once. Switching Loop off lets the content stay shown.
- **Slow motion:** page. While the switch is on, `--pulse-spd` and `--fade-dur` are multiplied by 3, from the next play (each play sets both from its settings). Loading time is a hold and keeps its length, and so does the 1600ms hold. So the content arrives at the same moment, after fewer, slower pulses, and fades in three times as slowly.
- **Reduced motion:** the demo's rule stays (`.skel{animation:none!important;opacity:.6}`): the placeholders hold still and the content still fades in. Replay plays once.
- **Stage font:** site font. `.real-meta` becomes 11px; it and `.real-text` take their grey from `--ui-muted`.
- **Stage:** the card stays, with its placeholders and its real content in the same place.
  - The progress bar and its "Loading…" / "Loaded" label (`.load-bar-wrap`) go: they show progress, and a skeleton is used when progress is unknown.
  - `.card-wrap` loses `min-height:260px` and gets `padding:16px`; `.sk-img` and `.real-img` become 72px tall; the stage gets `padding:16px`.
  - The post text becomes "New coastal landscapes, shot where the light meets the water." (it was three to four lines on a phone).
  - `hb-dots`: yes. Measured: 266px on phones and laptops.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Pulse speed | Choice buttons | Slow · Normal · Fast | Normal | One to two seconds a pulse feels calm. | `--pulse-spd`: 2.4s / 1.5s / 0.9s |
| Pulse strength | Choice buttons | Soft · Medium · Strong | Medium | How far the blocks fade between pulses. | `--pulse-min`: 0.7 / 0.5 / 0.3 |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Loading time | Choice buttons | Short · Medium · Long | Medium | How long the placeholders show before the content. | `loadDur`: 1000 / 2000 / 3500 (ms) |

- **Removed:**
  - The note and the "↺ Reload sequence" button. The player bar's Replay replaces it, and the shared script turns Loop on at arrival.
  - The progress bar and its label.
  - The Load Duration, Pulse Speed and Pulse Intensity sliders. They become Loading time, Pulse speed and Pulse strength.
- **Good for:** Feeds · Cards · Lists · Dashboards · **Avoid on:** Very short waits · Unknown layouts
- **Prompt:**

  > Add a skeleton loading state to [the card, list or panel whose content loads]. While it loads, show gray blocks in the shapes and sizes of the content that is coming, such as a round avatar, lines of text and an image, and let them pulse between dimmer and brighter. When the content is ready, swap the blocks for it and fade it in. Match the shapes closely, because a skeleton that does not fit the content makes the page jump when it arrives. If the visitor has reduced motion turned on, keep the blocks still. Match the settings listed below.

- **README What it is:** rewritten:

  > A skeleton loader shows gray placeholder shapes in the layout of the content that is on its way. The blocks pulse gently to show that loading is going on, and the real content fades in over them when it arrives. Because people see the shape of what is coming, the wait feels shorter than it does with a blank area or a spinner.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Pulse speed | Normal | How long one pulse takes: slow is 2.4s, normal 1.5s and fast 0.9s; one to two seconds feels calm, faster feels anxious |
  | Pulse strength | Medium | How far the blocks fade between pulses: soft, medium or strong; a soft pulse is enough |
  | Loading time | Medium | How long the placeholders show before the content fades in: short is 1s, medium 2s and long 3.5s |

- **README See also:**
  - [Shimmer Effect](../shimmer-effect/) — a band of light sweeps across the placeholders
  - [Loading Spinner](../loading-spinner/) — a spinner for waits of unknown length
  - [Progress Animation](../progress-animation/) — a bar that shows how much is done
- **README How it works:** unchanged
- **README Production notes:** unchanged
- **Category line:** `04.09 · Micro-Interactions`
- **Pager:** Previous: Success Confetti (`../success-confetti/`) · Next: Shimmer Effect (`../shimmer-effect/`)

---

## shimmer-effect — Shimmer Effect

- **Kind:** loop. The band of light sweeps forever.
- **Description:** A band of light sweeps over gray placeholders. Best for loading screens.
- **Watch it help line:** default
- **Player bar:** Pause (css) · Slow motion (css)
- **Sequence:** the band sweeps across the card and the row forever (`@keyframes shimmer` on each `::after`, over Speed). Each cycle of Speed carries the band across twice: the tile is twice as wide as the block and its position travels four block widths, so a band crosses every half of Speed (every 1.2s at Slow, 0.75s at Normal, 0.45s at Fast). No page timers.
- **Slow motion:** css
- **Reduced motion:** the demo's rule goes (it stopped the sweep and dimmed the band, and Play must move it). Paused on arrival, the sweep holds at its start. There, the band's bright middle lies on each placeholder's right edge, so half of the band shows, still, brightening toward that edge.
- **Stage font:** the stage has no text.
- **Stage:** the card and one list row stay (owner decision: the card keeps its image placeholder).
  - The card keeps its round avatar, its two header lines, its image block and its two text lines. The image block (`.sk-img`) becomes 56px tall with `margin:10px 0 2px`.
  - The second list row goes: it looks the same as the first, and with both rows and the image the stage would not fit the phone height.
  - The stage gets `padding:16px` and `gap:12px`, and the card `padding:14px`. The row keeps its own padding.
  - The card and the row must not shrink: `.stage>*{flex-shrink:0}`. On a stage shorter than the content (a phone held sideways, or a window under about 620px tall, gives 260 to 288px) the flex column would squeeze the card, and its `overflow:hidden` would cut off the last text line. With the rule they keep their full height (176px and 66px) and use the stage's padding instead, ending 2px inside a 260px stage.
  - The note under the settings goes.
  - `hb-dots`: yes. Measured: 286px of the 298px inside the phone stage (the image's 2px bottom margin merges into the next line's 9px top margin), and the same on laptops. Keeping the image at its full 100px would need about 330px even with one row.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons | Slow · Normal · Fast | Normal | One sweep every half second to a second feels calm. | `--shim-dur`: 2400ms / 1500ms / 900ms |
| Brightness | Choice buttons | Soft · Medium · Bright | Medium | How strong the band of light is. | `--shim-bright`: 0.12 / 0.25 / 0.45 |
| Highlight angle | Choice buttons | Upright · Slanted · Diagonal | Upright | The slant of the band as it sweeps across. | `--shim-angle`: 90deg / 115deg / 135deg |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Highlight color | Swatches (the demo's own colours) | White · Blue · Gold | White | Tinted light suits a branded loading screen. | `--shim-color`: `255,255,255` / `88,166,255` / `255,215,0` (swatch colours `#ffffff` / `#58a6ff` / `#ffd700`) |

- **Removed:**
  - The two notes.
  - The second list row.
  - The Sweep Speed, Brightness and Angle sliders. They become Speed, Brightness and Highlight angle. The angle slider ran from −45° to 135° and so passed 0°, where the band lies flat and cannot be seen moving.
  - The Highlight Color menu. It becomes swatches; Silver goes, because at this brightness it looks the same as White.
  - The page's reduced-motion rule.
- **Good for:** Feeds · Cards · Lists · Image galleries · **Avoid on:** Very short waits · Busy pages
- **Prompt:**

  > Add a shimmer to [the skeleton placeholders on your loading screen]. Lay a band of light over each placeholder and sweep it across in one direction, again and again, so the gray shapes look like content streaming in. Every placeholder on the page should shimmer in the same direction, and each one must clip the band to its own edges so it never spills out. Keep the band see-through so it works on any placeholder color. If the visitor has reduced motion turned on, keep the placeholders still. Match the settings listed below.

- **README What it is:** rewritten:

  > A shimmer is a band of light that sweeps across gray placeholder shapes again and again while content loads. Where a pulse fades every block up and down together, a shimmer travels in one direction, so the placeholders look like content streaming in.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Speed | Normal | How often the light crosses: slow every 1.2s, normal every 0.75s and fast every 0.45s; more often than about every 0.4s it feels frantic |
  | Brightness | Medium | How strong the band of light is: soft, medium or bright; soft is subtle, bright suits a branded screen |
  | Highlight angle | Upright | Upright sweeps a straight band; Slanted and Diagonal tilt it; keep one angle across the whole page |
  | Highlight color | White | White works on any placeholder; blue or gold suit branded screens |

- **README See also:**
  - [Skeleton Loader](../skeleton-loader/) — the placeholders pulse instead
  - [Loading Spinner](../loading-spinner/) — a spinner for waits of unknown length
  - [Progress Animation](../progress-animation/) — a bar that shows how much is done
- **README How it works:** the sentence before the snippet, "A `::after` pseudo-element containing a translucent gradient is positioned absolutely over the skeleton block and translated from `-100%` to `+200%`:", becomes "A `::after` pseudo-element holding a translucent gradient covers each skeleton block, and its background position slides from one side to the other:". The snippet and the rest are unchanged, except that the sentence after the snippet gets one more sentence: "The tile is twice as wide as the block and its position travels four block widths per cycle, so the band crosses twice in each `--shim-dur`: every 0.75s at the default 1.5s."
- **README Production notes:** the "Combining with pulse" bullet becomes: "**Combining with pulse**: pick one — a pulse and a shimmer together are redundant and visually loud." The rest is unchanged.
- **Category line:** `04.10 · Micro-Interactions`
- **Pager:** Previous: Skeleton Loader (`../skeleton-loader/`) · Next: Loading Spinner (`../loading-spinner/`)

---

## loading-spinner — Loading Spinner

- **Kind:** loop. The six spinners move forever.
- **Description:** Six small shapes loop to show that something is loading. Best for short waits.
- **Watch it help line:** default
- **Player bar:** Pause (css) · Slow motion (css)
- **Sequence:** the six spinners move forever, all over Speed. Ring, Orbit and Arc turn (`spin`), and the arc also stretches and shrinks (`arc-pulse`, over twice Speed). Bounce's dots rise in turn (`bounce`), Pulse's ring swells and fades (`pulse-ring`), and Square turns and shrinks (`sq-spin`). No page timers.
- **Slow motion:** css
- **Reduced motion:** the demo's rule (`animation-play-state:paused!important` on every spinner) goes, because it would stop Play from starting them.
- **Stage font:** site font. `.spin-label` becomes 11px, keeping its capitals, its letter spacing and its `--ui-muted` grey.
- **Stage:** the six cells stay, with their labels (Ring, Orbit, Arc, Bounce, Pulse, Square).
  - The grid keeps three columns on every screen: the phone rule that made two columns goes, because three rows would not fit the phone stage.
  - The columns are `repeat(3,minmax(0,1fr))`, not `repeat(3,1fr)`: with plain `1fr` a cell cannot shrink below its content, so at Large the three cells need 258px and the grid is only 254px wide on a 320px phone, which runs it 4px into the stage's padding and 2px off centre. With `minmax(0,1fr)` the cells are an equal 76.7px with 16px on each side; the 52px spinner and the longest label then overhang the cell's content box by less than a pixel per side, inside the cell's 12px padding.
  - `.grid` gets `gap:12px`, `.spin-cell` `padding:12px`, and the stage `padding:16px`.
  - `hb-dots`: yes. Measured: about 225px at Medium size and 250px at Large, on phones (320px wide included) and laptops, with no cell overflowing.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons | Slow · Normal · Fast | Normal | Fast spinning can feel anxious. | `--spd`: 1300ms / 800ms / 500ms |
| Size | Choice buttons | Small · Medium · Large | Medium | Small fits inside a button; large fills an empty area. | `--sz`: 28px / 40px / 52px |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Color | Swatches | Pink · White · Blue · Purple · Green · Orange | Blue | Pick a color that stands out from the page. | `--clr`: `#ff6f8b` / `#f4f4f2` / `#58a6ff` / `#d2a8ff` / `#56d364` / `#ffa657`, and the Pulse spinner's fill to the same colour with `26` added (15% opacity), as today |

- **Removed:**
  - The two notes. The minimum display time they mention stays in the README's Production notes.
  - The Speed and Size sliders. They become Speed and Size.
  - The colour picker. It becomes the Color swatches.
  - The page's reduced-motion rule and the two-column phone rule.
- **Good for:** Network waits · Buttons while sending · Short waits · **Avoid on:** Known-length tasks · Very quick loads
- **Prompt:**

  > Add a loading spinner to [the place where people wait for something to load]. Use a small shape that keeps moving in a steady loop, such as a ring with one colored part turning around, dots circling or dots bouncing in turn, to show that work is going on when you cannot say how long it will take. Show it only for waits longer than about half a second, and tell screen readers that something is loading. If you know how far along the task is, use a progress bar instead. If the visitor has reduced motion turned on, fade it gently instead of spinning. Match the settings listed below.

- **README What it is:** rewritten:

  > A loading spinner is a small shape that keeps moving in a loop to show that the system is busy. It says nothing about how long the wait will be, only that work is going on, so it suits waits of unknown length, such as a network request. The demo shows six common designs.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Speed | Normal | How long one turn takes: slow is 1.3s, normal 0.8s and fast 0.5s; 0.6 to 1 second reads as calm, faster as anxious |
  | Size | Medium | Small is 28px, medium 40px and large 52px; small fits inside a button, large fills an empty area |
  | Color | Blue | The spinner's color; pick one that stands out from the page |

- **README See also:**
  - [Progress Animation](../progress-animation/) — a bar that shows how much is done
  - [Skeleton Loader](../skeleton-loader/) — gray shapes stand in for the content
  - [Checkmark Draw](../checkmark-draw/) — the success sign once the wait is over
- **README How it works:** unchanged
- **README Production notes:** the `prefers-reduced-motion` bullet becomes: "**`prefers-reduced-motion`**: under reduced motion the demo starts paused, so the spinners stay still until the visitor presses Play. In production, reduce the spinner to a simple opacity pulse, or hide it and rely on an `aria-live` announcement." The rest is unchanged.
- **Category line:** `04.11 · Micro-Interactions`
- **Pager:** Previous: Shimmer Effect (`../shimmer-effect/`) · Next: Progress Animation (`../progress-animation/`)

---

## progress-animation — Progress Animation

- **Kind:** once. One play fills the bar, the ring and the steps to the chosen percentage and stops there; Loop repeats it.
- **Description:** A bar, a ring and steps fill up to show progress. Best for uploads.
- **Watch it help line:** default
- **Player bar:** Replay · Loop · Slow motion
- **Sequence:** every play is today's `startAnim()`.
  - It cancels the previous frame, clears all timers, removes `indet` from the bar and sets the three displays to 0 (`setProgress(0)`). Today only the Sliding bar change handler removed `indet`. Without this, switching Sliding bar off during a slide would leave the endless slide running, because the shared script's replay after a setting change starts a new play.
  - When Sliding bar is on, it starts the slide (`startIndet()`): the bar slides for 2 × Speed, then shows its real fill. The end of the slide goes through `later()`.
  - It fills to Fills to over Speed with Feel (today's animation-frame loop).
  - While Loop is on, the displays hold 1200ms after the last movement ends: the fill, or the slide when Sliding bar is on, since the slide ends later, at 2 × Speed. So every loop shows the bar's real fill before the next play starts again from 0. Loop is checked at that moment. Switching Loop off lets the displays finish filled.
- **Slow motion:** page. While the switch is on, `dur` for the fill, `--prog-dur` for the sliding bar and the timer that ends the slide (2 × Speed) are multiplied by 3, from the next play. The 1200ms hold and the steps' 200ms colour change stay.
- **Reduced motion:** as today, a play shows the result at once (the `reduceMotion` branch stays), and the sliding bar shows full and still (the demo's CSS rule stays). Replay plays once.
- **Stage font:** site font. The labels become 11px, keeping their `--ui-muted` grey; the number in the ring keeps 12px bold.
- **Stage:** the bar, the ring and the steps stay, each with its number.
  - "Linear Bar" becomes "Bar" and "Stepped" becomes "Steps".
  - The "▶ Start" button, the ring's caption (a line of code) and the "Start" / "Complete" labels under the steps go.
  - The stage gets `padding:24px` and `gap:24px`.
  - The numbers change every frame, so the three displays sit in one group with `role="img"` and an `aria-label` naming the target, set at the start of each play (for example "Progress filling to 100%").
  - The bar's fill moves to transform (see the preamble). `.prog-fill` becomes `width:100%` with `transform:translateX(-100%)`, which is empty. `setProgress(p)` sets `linearFill.style.transform='translateX('+(p-100)+'%)'` in place of its width.
  - The track's `overflow:hidden` and radius clip the part still outside, so the bar looks the same, round ends included. This was checked side by side at 1%, 10%, 50%, 97% and 100%. Only below about 3% does the thin sliver differ slightly: it shows the fill's rounded end instead of a tiny pill.
  - The sliding bar's `@keyframes indet` already moves by transform, and while it runs it overrides the inline transform; its 40% width is set once, not animated.
  - The sliding bar's reduced-motion rule adds `transform:none!important`, so under reduced motion it still shows full and still, as today.
  - `hb-dots`: yes. Measured: 234px on phones and laptops.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Fills to | Choice buttons | 50% · 75% · 100% | 100% | How far the progress goes in one play. | `target`: 50 / 75 / 100 |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long the fill takes. | `dur` / `--prog-dur`: 3200ms / 2000ms / 1200ms |
| Feel | Choice buttons | Smooth · Gentle · Even | Smooth | Smooth starts fast and eases into the end. | `ease`: `EASE['ease-out']` / `EASE['ease-in-out']` / `EASE.linear` |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Sliding bar | Switch | on / off | off | For waits of unknown length: the bar slides instead. | `indetTog.checked`: each play also calls `startIndet()` / does not |
| Fill color | Swatches | Pink · White · Blue · Purple · Green · Orange | Blue | The color of the bar, the ring and the steps. | `--prog-color`: `#ff6f8b` / `#f4f4f2` / `#58a6ff` / `#d2a8ff` / `#56d364` / `#ffa657` |

- **Removed:**
  - The note, the line about the circle's length, and the "▶ Start" button. Replay replaces the button, and the shared script turns Loop on at arrival.
  - The ring's caption and the labels under the steps.
  - The Duration and Target % sliders. They become Speed and Fills to.
  - The Easing menu. It becomes Feel.
  - The colour picker. It becomes Fill color.
  - "Indeterminate mode (bar)". It becomes Sliding bar.
- **Good for:** Uploads · Downloads · Multi-step forms · Installs · **Avoid on:** Unknown waits · Fake progress
- **Prompt:**

  > Add a progress indicator to [the upload, download or task whose progress you know]. Show how much is done with a bar that fills from left to right, a ring whose outline fills around the circle, or a row of steps that light up in turn, all driven by the same percentage and shown with the number. Fill it smoothly as progress arrives, and only show real progress: never race to near the end and stall. When the settings ask for it, slide a short piece along the bar for waits of unknown length. If the visitor has reduced motion turned on, jump straight to the current value. Match the settings listed below.

- **README What it is:** rewritten:

  > A progress animation shows how much of a task is done by filling a shape: a bar, a ring or a row of steps. Unlike a spinner, it tells people how much is left, which makes a long wait easier. In the demo, all three are driven by the same percentage.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Fills to | 100% | How far one play fills: 50%, 75% or 100% |
  | Speed | Normal | How long the fill takes: slow is 3.2s, normal 2s and fast 1.2s; in a real app it follows the actual progress |
  | Feel | Smooth | Smooth starts fast and slows near the end, which feels natural; Gentle eases in and out; Even fills at one steady pace |
  | Sliding bar | off | For waits of unknown length: a short piece slides along the bar instead of filling it |
  | Fill color | Blue | The color of the bar, the ring and the steps |

- **README See also:**
  - [Loading Spinner](../loading-spinner/) — a spinner for waits of unknown length
  - [Skeleton Loader](../skeleton-loader/) — gray shapes stand in for the content
  - [Checkmark Draw](../checkmark-draw/) — the success sign once it reaches the end
  - [Progress Bar](../../01-scroll-based/progress-bar/) — a bar that fills as you scroll
- **README How it works:** the linear-bar part must match the new code. The ring and sliding-bar parts are unchanged.
  - The sentence "**Linear bar**: update `width` via a CSS transition, or animate it manually with `requestAnimationFrame` for easing control:" becomes "**Linear bar**: keep the fill as wide as the track and slide it in from the left with `transform: translateX()`; the track's `overflow: hidden` hides the part still outside, and a transform never makes the page lay out again. Move it with a CSS transition, or with `requestAnimationFrame` for easing control:".
  - The CSS snippet becomes:

    ```css
    .prog-track { overflow: hidden; border-radius: 4px; }

    .prog-fill {
      height: 100%;
      width: 100%;
      background: #58a6ff;
      transform: translateX(-100%);   /* empty: the whole fill sits left of the track */
      transition: transform 2000ms ease-out;
    }
    ```

  - In the `requestAnimationFrame` snippet, `fill.style.width = (target * eased) + '%';` becomes `fill.style.transform = 'translateX(' + (target * eased - 100) + '%)';`.
- **README Production notes:** the GSAP bullet becomes: "**GSAP**: `gsap.to(fill, { xPercent: -25, duration: 2, ease: "power2.out" })` slides a full-width fill to 75%. For circular rings, animate `strokeDashoffset` directly." The rest is unchanged.
- **Category line:** `04.12 · Micro-Interactions`
- **Pager:** Previous: Loading Spinner (`../loading-spinner/`) · Next: Checkmark Draw (`../checkmark-draw/`)

---

## checkmark-draw — Checkmark Draw

- **Kind:** do — a click effect: the visitor presses Submit, and Show me submits once and returns the button to its start. Today it also replays by itself every four seconds; that goes, because a do-it page shows itself once on arrival and then waits for the visitor.
- **Description:** A tick draws itself in a circle once a task succeeds. Best for forms.
- **Step 1:** Click it — help line: "Click or tap Submit (Reset brings it back), or press Show me."
- **Player bar:** Show me · Reset · Slow motion (css).
- **What the visitor does:** clicking Submit runs today's `runSequence()`.
  - The label fades and a spinner turns in the button for 900ms.
  - Then the button shows ✓ and turns green while the circle and the tick draw. With Result set to Error, it shows ✕ (never the success tick) and turns red while the X draws and shakes. `runSequence()` sets the glyph from the run's result, `btnCheck.textContent=failed?'✕':'✓'`, just before it fades the glyph in.
  - The button then stays finished (disabled) until Reset.
- **Show me:** starts from rest: `toRest()` is `reset()` without animating. Then:
  - `later(runSequence, 0, 300)` presses Submit. The sequence's own 900ms loading wait is a hold: it stays in `runSequence()`'s own timer, which does not go through `later()` and is never tripled.
  - `later(reset, 1.4*draw, 2400)` puts the button back to Submit, where `draw` is Speed.
    - The drawing takes 1.4 × Speed: the circle over Speed, the tick starting at 0.4 × Speed. The X and its shake end sooner.
    - The holds are 300ms before the press, the 900ms loading wait and 1.2 s on the finished result.
    - After the reset, the lines draw back out over Speed.
  - At the defaults: Submit at 300ms, the tick fully drawn by about 1900ms, back to Submit at 3100ms. With Slow motion, back at about 4.5 s, before the lines draw back out.
  - Stops on `hb:input`: the run's own timers stop, and a sequence already under way still finishes and stays finished until Reset.
  - The arrival press is the shared script's, not the visitor's. When the visitor has already pressed Submit (the button is disabled, whether it is still loading or finished), the page ignores an untrusted Show me press (`e=>{if(!e.isTrusted&&btn.disabled)return; ...}`), so the arrival run neither resets nor replaces the visitor's own sequence. The visitor's own Show me press still starts a run from rest.
- **Reset:** calls `stopRun()`, then `reset()`: the finished button stays disabled otherwise, so this is the only way back to Submit besides Show me.
- **Slow motion:** css (the drawing, the spinner, the shake and the button's colour). `later()` triples the drawing (1.4 × Speed), not the holds; the sequence's 900ms loading wait keeps its length.
- **Reduced motion:** the demo's rule stays and also stops the button's spinner (`.sp{animation:none}` joins it). The spinner shows still, and the circle and tick, or the X, appear at once, with no shake. Show me still shows the spinner, then the finished result.
- **Stage font:** site font. `.submit-btn` gets `font-family:inherit` in place of `var(--mono)`.
- **Stage:** the button and the icon stay. The state label under the icon (`#state-label`) goes; it described each step. `.submit-btn`'s transition keeps only `background`, because its `width` never changes. `hb-dots`: yes. Measured: 230px on phones and laptops.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Result | Choice buttons | Success · Error | Success | Error draws a red X and gives it a shake. | `showError`, read by `runSequence()` at each run: `false` / `true` |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long the lines take to draw. | `--draw-dur`: 800ms / 500ms / 300ms |
| Line thickness | Choice buttons | Thin · Medium · Thick | Medium | Thick looks confident; thin looks precise. | `--stroke-w`: 2 / 4 / 7 |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Feel | Choice buttons | Smooth · Gentle · Even | Smooth | Smooth slows at the end, like a pen lifting. | `--draw-ease`: `ease-out` / `ease-in-out` / `linear` |
| Tick color | Swatches | Pink · White · Blue · Purple · Green · Orange | Green | The circle and tick; the X stays red. | `--stroke-color`: `#ff6f8b` / `#f4f4f2` / `#58a6ff` / `#d2a8ff` / `#56d364` / `#ffa657` |

- **Removed:**
  - The note, the state label, the "↺ Replay" button and the four-second auto-replay. Show me and Reset replace them.
  - The Draw Duration and Stroke Width sliders. They become Speed and Line thickness.
  - The Easing menu. It becomes Feel.
  - The colour picker. It becomes Tick color.
  - "Show error (X) variant". It becomes Result.
- **Good for:** Form success · Payments · Finished steps · **Avoid on:** Frequent small saves
- **Prompt:**

  > Add a success check mark that draws itself to [the form or action that just finished]. After the visitor submits, show a short loading state in the button, then draw a circle and a tick inside it as if by hand: the circle first, then the tick, starting just before the circle closes. For a failure, draw a red X the same way and give it a short shake. Let the button turn green or red to match. If the visitor has reduced motion turned on, show the finished check or X at once. Match the settings listed below.

- **README What it is:** rewritten:

  > A check mark that draws itself, as if by hand, to confirm that something worked. The circle and the tick are there from the start but hidden, and they are revealed along their length, so the line seems to be drawn. The same trick can draw a red X when something fails.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Result | Success | Success draws a circle and a tick and turns the button green; Error draws a red X, shakes it and turns the button red |
  | Speed | Normal | How long each line takes to draw: slow is 800ms, normal 500ms and fast 300ms; 200 to 800ms is easy to follow |
  | Line thickness | Medium | Thin is 2, medium 4 and thick 7 units wide; thick reads as confident, thin as precise |
  | Feel | Smooth | Smooth slows at the end like a pen lifting off; Gentle eases in and out; Even draws at one steady pace |
  | Tick color | Green | The color of the circle and the tick; the X stays red |

- **README See also:**
  - [Progress Animation](../progress-animation/) — shows how much is done before the success
  - [Loading Spinner](../loading-spinner/) — the waiting sign before the tick
  - [Button Press Scale](../button-press-scale/) — the button shrinks while it is pressed
- **README How it works:** unchanged
- **README Production notes:** in the "Error state pairing" bullet, "(see toggle in the demo)" becomes "(the demo's Result setting shows it)". The rest is unchanged.
- **Category line:** `04.13 · Micro-Interactions`
- **Pager:** Previous: Progress Animation (`../progress-animation/`) · Next: Form Field Morph (`../form-field-morph/`)

---

## form-field-morph — Form Field Morph

- **Kind:** do — a focus effect: the visitor clicks into a field and types, and Show me fills in one field and moves on to the next.
- **Description:** The label moves up out of the way as you type. Best for sign-up forms.
- **Step 1:** Click it — help line: "Click or tap a field and type, or press Show me."
- **Player bar:** Show me · Slow motion (css). No Reset, by the preamble's Reset rule: the visitor can clear a field, and Show me starts from an empty form.
- **What the visitor does:** focusing a field raises its label and, on the underlined fields, grows the line (`:focus-within`); typing keeps the label up (`filled`, set on `input` and `blur`); leaving an empty field lets it drop back; Tab moves between the fields. All as today.
- **Show me:** starts from rest: `toRest()` empties every field without animating (values emptied, `filled` removed, labels down). Then, with `f` for Speed:
  - `later(focusName, 0, 0)`: Full name gets `is-demo`, so its label rises and its line grows.
  - `later(type, f, 100+70*k)` for letter k (0 to 11) of "Ada Lovelace": the run types it one letter at a time, setting `value` and calling `syncFilled()` after each letter. Typing is a hold, not a movement.
  - `later(toCompany, f, 1300)`: Full name loses `is-demo`, and its label stays up because the field is filled. Company gets it: its border takes the focus color and its label rises.
  - `later(leaveCompany, 2*f, 2000)`: Company loses it, and its label drops back because the field is empty.
  - `later(clearName, 3*f, 2400)`: the run clears Full name, whose label drops back.
  - At the defaults these come at 0ms, 300 to 1070ms, 1500ms, 2400ms and 3000ms. The form is at rest by about 3.2 s, or about 4.8 s with Slow motion.
  - Every `:focus-within` rule also lists `.is-demo` (for example `.float-field:is(:focus-within,.is-demo) label`).
  - Stops on `hb:input` and on a trusted `focusin` inside the stage: a Tab press into the form from outside sends no `hb:input`, and the run moves no focus. Stopping removes `is-demo` from every field and clears the text the run typed, so a field the visitor clicks into starts empty.
- **Reset:** none.
- **Slow motion:** css. `later()` triples each label move (Speed), not the typing or the holds.
- **Reduced motion:** the demo's rule stays: labels and lines move at once, without the transition. Show me still types and moves the labels.
- **Stage font:** site font. The inputs and the textarea get `font-family:inherit` in place of `var(--mono)`; the labels keep their `--ui-muted` grey.
- **Stage:** Full name (underlined), Company (boxed) and Message (underlined, several lines) stay. The Email address field goes (owner decision): it is a second underlined field like Full name, and without it the form fits the phone stage. The stage gets `padding:16px`, `.form` gets `gap:16px` (was 24px), and the textarea `min-height:56px` (was 80px). `hb-dots`: yes. Measured: 282px on phones and laptops.
  - The fields keep their own focus look: the line, the label colour and the box border. The site's focus ring (`body.hb :focus-visible`, specificity 0,2,1) beats their `outline:none` (0,1,1). It would draw an orange box around each focused field, through its raised label.
  - So the page adds `.stage .float-field :is(input,textarea):focus-visible,.stage .box-field input:focus-visible{outline:none}` (0,3,1).

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons | Slow · Normal · Fast | Normal | Slow feels heavy on a long form. | `--field-dur`: 320ms / 200ms / 120ms |
| How far it rises | Choice buttons | Low · Medium · High | Medium | Far enough to clear the text you type. | `--float-dist`: 16px / 22px / 28px |
| Size when raised | Choice buttons | Small · Medium · Large | Medium | Smaller stays out of the way; larger reads easily. | `--label-scale`: 0.7 / 0.8 / 0.9 |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Focus color | Swatches | Pink · White · Blue · Purple · Green · Orange | Blue | The raised label and the active line or border. | `--focus-color`: `#ff6f8b` / `#f4f4f2` / `#58a6ff` / `#d2a8ff` / `#56d364` / `#ffa657` |

How far it rises and Size when raised move the underlined fields' labels; the boxed Company field keeps its own smaller rise, as today.

- **Removed:**
  - The two notes and the Filled fields readout.
  - The Email address field.
  - The Animation Duration, Float Distance and Label Scale sliders. They become Speed, How far it rises and Size when raised.
  - The colour picker. It becomes Focus color.
- **Good for:** Sign-up forms · Sign-in forms · Checkout · Settings · **Avoid on:** Long labels
- **Prompt:**

  > Add floating labels to [the form fields you want to label]. Each label sits inside its field like a placeholder; when the field is focused or has text in it, the label moves up and shrinks so it stays visible above the text, and the field's line or border takes on the focus color. When an empty field loses focus, the label moves back down. Keep a real label element for each field so screen readers announce it, and shrink the label from its left edge so it does not drift sideways. If the visitor has reduced motion turned on, move the label without animating it. Match the settings listed below.

- **README What it is:** rewritten:

  > Form field morph, also called a floating label, starts with each field's label inside the field, like a placeholder. When you click into the field or type in it, the label moves up and shrinks, so it stays visible above your text instead of disappearing the way a placeholder does.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Speed | Normal | How long the label takes to move: slow is 320ms, normal 200ms and fast 120ms; slower feels heavy on a form with many fields |
  | How far it rises | Medium | How far the label moves up on the underlined fields: low is 16px, medium 22px and high 28px; it must clear the typed text |
  | Size when raised | Medium | How big the raised label is on the underlined fields: small is 70%, medium 80% and large 90% of its size |
  | Focus color | Blue | The color of the raised label and the active line or border |

- **README See also:**
  - [Focus Ring Animation](../focus-ring/) — a ring shows which item the keyboard is on
  - [Toggle / Switch Slide](../toggle-switch/) — a switch slides between on and off
  - [Accordion Open/Close](../accordion/) — a panel opens and closes smoothly
- **README How it works:** unchanged
- **README Production notes:** unchanged
- **Category line:** `04.14 · Micro-Interactions`
- **Pager:** Previous: Checkmark Draw (`../checkmark-draw/`) · Next: Notification Badge Pulse (`../badge-pulse/`)

---

## badge-pulse — Notification Badge Pulse

- **Kind:** loop. The badges pulse forever. Clicking an icon still clears its badge, as today, so the player bar also has Reset to bring the badges back. This is the only loop with Reset: without it a cleared badge would stay gone until the page is reloaded.
- **Description:** A badge on an icon pulses to catch the eye. Best for unread messages.
- **Watch it help line:** "It moves by itself. Pause it, or click an icon to clear its badge; Reset brings the badges back."
- **Player bar:** Pause (css) · Reset · Slow motion (css). Reset is the do-it plan's Reset button (`id="btn-reset"`, `data-hb-reset`) and sits between Pause and Slow motion; on phones Pause and Reset share a row.
- **Sequence:** the bell's and the inbox's badges pulse forever in the chosen Pulse style (`badge-scale`, `halo-grow` or both, over Speed). The avatar's online dot always grows and shrinks (`badge-scale`). No page timers. Clicking the bell or the inbox, or pressing Enter or Space on it, clears its badge (`display:none`), as today, and the icon's `aria-label` loses the count so that screen readers no longer announce a badge that is gone: "Notifications, 3 new" becomes "Notifications" and "Inbox, new messages" becomes "Inbox" (the full labels are kept for Reset; "Profile, online" never changes).
- **Reset:** shows every cleared badge again, restores the full labels and restarts the pulses with `applyStyle()`. While paused, the restarted pulses wait at their first frame (the shared `hb-paused` class holds them) until Play.
- **Slow motion:** css
- **Reduced motion:** the demo's rule goes (it removed the pulses and hid the halos, and Play must move them).
- **Stage font:** site font. `.icon-label` becomes 11px, keeping its `--ui-muted` grey; the number in the badge becomes 11px and dark (`#0b0b0d`), not white: white on the five badge colors is 3.35 to 1.94:1 and the dark number 5.87 to 10.15:1 (text needs 4.5:1).
- **Stage:** the three icons stay. Their two-line labels become one word each: "Number", "Dot" and "Online" (were "Bell numbered", "Inbox dot" and "Avatar online"). The avatar's inline style moves into a class. `hb-dots`: yes. Measured: 90px of content (the badges stick out 8px above it), centred; it fits every stage, the 260px one included.
- **Halo layering:** the halo (`::after`) is drawn over the badge's color and under its number: `.badge{isolation:isolate}` makes the badge a stacking context and `.badge::after{z-index:-1}` puts the halo inside it, below the text. A halo painted over the number took it below 4.5:1 (2.66:1 on Red at the start of every Ring or Both pulse, 3.27 to 4.15:1 at rest); with the halo under it the number measures 5.86:1 or better in every state.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Pulse style | Choice buttons | Grow · Ring · Both | Grow | Grow stays contained; Ring spreads a soft halo. | the bell's and the inbox's class: `pulse-scale` / `pulse-halo` / `pulse-both`, then `applyStyle()`; pressing the style already chosen does nothing (it must not restart the pulses) |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | Fast feels urgent; slow is easy to miss. | `--pulse-dur`: 2.4s / 1.5s / 0.9s; every pulse is moved to the same point of its new length, so the picture stays (moving, paused or finished) |
| How much it grows | Choice buttons | Slightly · Medium · A lot | Medium | Much bigger than a third starts to feel alarming. | `--pulse-scale`: 1.15 / 1.3 / 1.5 |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Stops after three pulses | Switch | on / off | off | Pulses three times to be noticed, then rests. | every icon's `fade-mode` class on / off, then `applyStyle()`; the rule sets `animation-iteration-count:3` and `animation-fill-mode:forwards`, so the run ends on its last keyframes (badge at scale 1, halo invisible) and a finished pulse stays in `getAnimations()` for Speed |
| Badge color | Swatches (Red, the default, added; White and Green left out) | Red · Pink · Blue · Purple · Orange | Red | Red reads as new and urgent. | `--badge-color`: `#f85149` / `#ff6f8b` / `#58a6ff` / `#d2a8ff` / `#ffa657` |

White stays left out (it was left out when the number was white; the number is dark now, so White could be added if the owner wants it), and Green because the online dot is green. How much it grows also sets the online dot's pulse, whatever the Pulse style.

- **Removed:**
  - The note and the "Click an icon to dismiss its badge." line; the help line says it.
  - The Pulse Duration and Scale Amount sliders. They become Speed and How much it grows.
  - The Pulse Style menu. It becomes Pulse style.
  - The colour picker. It becomes Badge color.
  - "Fade after attention (3 pulses)". It becomes Stops after three pulses.
  - The page's reduced-motion rule.
- **Good for:** Notification bells · Inboxes · Chat icons · Online status · **Avoid on:** Items already seen · Many icons at once
- **Prompt:**

  > Add a pulsing notification badge to [the icon that has something new, such as a bell or an inbox]. Place a small colored dot or number on the icon's corner and let it pulse, growing and settling back or sending a soft ring outward, so it catches the eye without demanding attention. Give the badge a thin border in the background color so it seems to float above the icon. Remove the badge once the visitor has opened what it points to, and when the settings ask for it, stop the pulse after three beats. If the visitor has reduced motion turned on, keep the badge still. Match the settings listed below.

- **README What it is:** rewritten:

  > A notification badge is a small colored dot or number on an icon that marks something new, such as unread messages. A gentle pulse, growing a little and settling back or sending out a soft ring, catches the eye at the edge of your vision without interrupting what you are doing.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Pulse style | Grow | Grow scales the badge up and back; Ring sends a soft halo outward; Both does the two together |
  | Speed | Normal | How long one pulse takes: slow is 2.4s, normal 1.5s and fast 0.9s; fast feels urgent, slow is easy to miss |
  | How much it grows | Medium | How big the badge gets at the top of each pulse: slightly is 115%, medium 130% and a lot 150% of its size |
  | Stops after three pulses | off | The badges pulse three times and then rest; the online dot keeps going |
  | Badge color | Red | The badge's color; red reads as new and urgent |

- **README See also:**
  - [Tooltip Reveal](../tooltip-reveal/) — pointing at an icon shows a short note
  - [Loading Spinner](../loading-spinner/) — another sign that something is going on
  - [Hover State Animation](../hover-state/) — items react when the pointer is over them
- **README How it works:** the halo snippet gains `.badge{isolation:isolate}` and `z-index:-1` on `.badge::after`, with a sentence saying the ring is drawn under the number, and a sentence after it says the three-pulse run uses `animation-iteration-count:3` and `animation-fill-mode:forwards`. The rest is unchanged.
- **README Production notes:** the `prefers-reduced-motion` bullet becomes: "**`prefers-reduced-motion`**: under reduced motion the demo starts paused, so the badges stay still until the visitor presses Play. In production, turn the pulse off: the badge stays visible, just without motion." The rest is unchanged.
- **Category line:** `04.15 · Micro-Interactions`
- **Pager:** Previous: Form Field Morph (`../form-field-morph/`) · Next: Tooltip Reveal (`../tooltip-reveal/`)
