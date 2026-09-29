# Ambient & Background — Content Sheet

This sheet decides, page by page, how the seventeen Ambient & Background pages present their kind, settings, words and prompt on the guided-steps page. The conversion tasks of `2026-09-29-demo-page-rollout-parallel.md` follow each section exactly, together with "How to convert a page" in `2026-09-28-demo-page-rollout-text-typography.md` and the lessons in the rollout's Global Constraints. Rotate In (`animations/02-entrance-and-exit/rotate-in/`) is the reference for everything a section does not mention. The Text & Typography loops are the reference for loops: Glitch Text, Marquee / Ticker, Text Gradient Animation and Wavy Text for "css" loops, Text on a Path for a loop driven by animation frames, and Variable Font Morph for a loop driven by a timer (the `wait()`/`freeze()`/`thaw()` helper).

Every page in this category is a loop: each one runs forever with no natural end. None is a plays-once, do-it or scroll page, and every page keeps settings, so every page has a Try it step. None of the rollout spec's special cases concerns this category.

How to read a section:

- **Sets in the demo** lists one value per choice, in the same order as the choices. A Speed row sets the script's variable and the CSS variable it names.
- **Shown only when …** in the Control column means the setting's whole `div.hb-setting` gets the `hidden` attribute while it has no effect, so it also drops out of "Your settings".
- Switches in Try it keep their default in the markup (`checked` when the default is on), as on Rotate In. Only the player bar's Slow motion starts unchecked.
- **Watch it help line: default** means the loop line from the Text & Typography plan: "It moves by itself. Pause it to look closely, or turn on slow motion to see each part of the movement." (with Slow motion), or "It moves by itself. Pause it to look closely." (without). The Try it help line is always the loop line, "Change a setting and see the difference as it moves."
- **Pause (css)** means `data-hb-pause="css"` and **Pause (page)** means `data-hb-pause` without a value. The same goes for Slow motion and `data-hb-slowmo`.
- **Speed** always reads Slow · Normal · Fast, and today's default stays Normal. For a duration (a cycle, a fade, a ring's life), Slow is about 1.6 times and Fast about 0.6 times the default; for a rate (pixels or steps per frame, steps a second), it is the other way round.
- **Number of …** turns a count into named steps. Where the demo draws fewer on phones, the hint and the README say so.
- **Colors** (plural) is a named set of colours, as choice buttons. A single colour picker becomes swatches, each with its colour's name as its `aria-label`. Swatches use the Text & Typography palette, in this order, where the demo's default colour is one of them: Pink `#ff6f8b` · White `#f4f4f2` · Blue `#58a6ff` · Purple `#d2a8ff` · Green `#56d364` · Orange `#ffa657`. Breathing / Pulsing Glow leaves out White (see its section). Light Leak, Particle Constellation and Synthwave Grid keep their own colours (listed in their sections), because those colours are part of the look.
- **Category line:** the pages have none today. NN is the page's position on the home page, which its card already shows: `07.01 · Ambient &amp; Background` (Animated Gradient Background) to `07.17 · Ambient &amp; Background` (Plasma Field).
- **Accent:** every page uses `--ui-accent:#ffce5a`, the colour twelve of the seventeen pages already have. Flow Field (`#7affc8`), Matrix Rain (`#5fd88a`), Particle Constellation (`#5ad1ff`), Plasma Field (`#ff6f8b`) and Synthwave Grid (`#ff5ca8`) change to it. None of those five uses `--ui-accent` inside its stage (their canvas colours are written in their scripts), so only the page around the demo changes colour.
- **Stage:** `hb-dots` is left off on every page, because every stage paints its own full background (a gradient, a canvas, a scene). Every page uses the default height: the old `--stage-h` values (620px, 420px or 380px on phones; `min(64vh,600px)` and `52vh` on Plasma Field) go, and so do the phone rules that made Grain / Film Noise Overlay and Scanline Effect `height:auto`. A demo's own `.stage` rule keeps only what its content needs (`position:relative`, `overflow:hidden`, its background, its flex centring where it has it, and Grid / Dot Pattern Parallax's `cursor:none`, which that page's custom cursor ring replaces); `flex:1`, `min-width`, `height`, `border` and `border-radius` go, because the page owns them. Nothing here takes typed text, so no stage uses `hb-grow`.

---

## Owner decisions and lessons that apply here

- **Stage text uses the site font.** No page here is a typing effect, so none keeps a monospace font: Scanline Effect's terminal and Matrix Rain's falling characters use the site font too (see their sections). Georgia and the italics go from every card and caption.
- **Pause stops at once, on every loop.**
  - On the "css" loops (Animated Gradient Background, Mesh Gradient Animation, Aurora / Northern Lights, Scanline Effect, Breathing / Pulsing Glow), the shared class `hb-paused` holds every `@keyframes` animation on the stage at once. These five have no page timers.
  - On the canvas and animation-frame loops, the page cancels its frame (the pattern below).
  - Light Leak is a timer chain drawn by a CSS transition: it uses the Text sheet's `wait()`/`freeze()`/`thaw()` helper, with `freeze()` limited to CSS transitions, while `data-hb-pause="css"` holds its floating light spots (see its section).
- **Reduced motion** greys out Slow motion, starts every loop paused and runs nothing by itself; Pause/Play still works. See "Reduced motion" below for what that removes from these pages.
- **Long names in the top bar** ("Grid / Dot Pattern Parallax", "Starfield / Space Particles") are cut with "…" by the shared stylesheet; the pages do nothing.
- **Lessons from the Text & Typography reviews:** the `hb:pause` listener is registered at the top level of the page's inline script; the page reaches the player controls by their ids (`btn-pause`, `slow-tog`), never by `data-hb-*`; a page never calls `pause()` or `play()` on a CSS keyframe animation.

## Canvas and animation-frame loops (Pause "page")

Eleven pages move their picture with `requestAnimationFrame`: Grain / Film Noise Overlay, Starfield / Space Particles, Ambient Ripple Effect, Floating Elements, Grid / Dot Pattern Parallax, Abstract Geometric Motion, Particle Constellation, Flow Field, Synthwave Grid, Matrix Rain and Plasma Field. Each follows Text on a Path, and its section only adds what differs:

- The loop keeps exactly one pending frame in `raf`. `start()` returns at once when `raf` is set; otherwise it forgets the time of the last frame and requests a frame.
- The page listens for `hb:pause`, registered at the top level of its inline script. Paused: `cancelAnimationFrame(raf); raf=null;` and the picture on screen stays as it is. Not paused: `start()`, which carries on from the current state. The page keeps its own `paused` flag from this event; the old panel's flag and button go.
- Every other path that used to restart the loop (`visibilitychange` on Matrix Rain and Plasma Field, the mouse leaving Grid / Dot Pattern Parallax, a resize) restarts it only while not paused.
- Where the movement follows the clock (Ambient Ripple Effect, Grid / Dot Pattern Parallax, Plasma Field), the page keeps its own clock, which adds up each frame's time (at most 50 ms, and nothing on the first frame after a start), so Play never jumps. Matrix Rain keeps today's step timer and Grain / Film Noise Overlay today's redraw interval; after a pause, each takes at most one step. Where the movement is a step per frame, it stays a step per frame, and the existing 16 ms frame gate (`if(dt<16)return`) stays.
- **The first picture:** the page draws a frame at load, before the loop starts (or the settled picture its section names), so a loop that is paused on arrival never shows an empty stage.
- **While paused,** a setting change draws the picture again so the change shows: without moving anything, or, on Flow Field and Matrix Rain, as a fresh settled picture (their trails need steps to show a change). This is the loop rule "changing a setting while paused shows the new setting without starting the loop again". The sections name the function that draws.
- **Resizes:** a page acts on a resize only when its stage's size has really changed. It compares the stage's `clientWidth` and `clientHeight` with the size it last drew for, and otherwise does nothing. Phones fire `resize` whenever the address bar slides in or out, and Matrix Rain's `ResizeObserver` reports once as soon as it starts watching; without the check, each of those would clear the canvas or start the picture again from scratch. After a real change, the page draws its picture again at once, playing or paused (the sections name the function).
- **Slow motion (page):** while the switch is on, each frame moves things a third of the usual step, or adds a third of the frame's time to the page's clock, or (Matrix Rain, Grain / Film Noise Overlay) waits three times as long between steps. It takes effect from the next frame.
- The fps badges and FPS readouts go.

## Reduced motion for full-stage effects

Today every page handles reduced motion itself, in one of two ways:

- CSS rules that stretch the loop to 60 or 300 seconds a cycle, or remove it (`animation-duration:300s!important`, `animation:none!important`, a leak held at a steady glow);
- script checks that draw one still frame and never start the loop. On Particle Constellation they also hide the Pause button, and on Matrix Rain they make Pause do nothing.

All of them go, on every page:

- the shared script now starts every loop paused under reduced motion, and a visitor who presses Play has asked to see the effect;
- the slow-down rules override Speed with `!important`, so Speed would do nothing, and at 300 seconds a cycle Play would look broken;
- the still-frame checks would stop Play from starting anything, and the browser check fails a loop that does not move after Play.

What stays is the still picture: while the loop is paused on arrival, every stage shows a full, still frame (the first frame, or the settled picture its section names). The prompts keep their reduced-motion sentence, which is about the visitor's own site.

## Heavy effects and their phone fallbacks

CLAUDE.md asks for 60 fps on a mid-range phone, and a reduced-quality fallback on phones for heavy effects (heavy blur, many particles). Each section has a **Phone fallback** line: what the demo already does, or the smallest change that keeps it smooth. "On phones" means a stage narrower than 600px, which is how the demos already decide (`W<600`), or `@media(max-width:600px)` for CSS.

The canvas numbers come from a scratch measurement: headless Chrome at 375×812 with pixel ratio 2, the CPU slowed four times (roughly a mid-range phone), the stage set to 351×300 (a phone stage), recording how long each animation-frame callback runs. They show the demo's own work per frame, against a budget of about 16 ms, not the graphics chip's. So for the blur pages (Mesh Gradient Animation, Aurora / Northern Lights) the fallback follows their READMEs' own advice, less blur on phones, rather than a number.

| Page | What was measured | Median / slowest 5% of frames |
|---|---|---|
| Grain / Film Noise Overlay | Medium grain, a new frame every frame | 7.9 / 10.8 ms |
| | Fine grain, every frame | 12.7 / 21 ms |
| | Colored grain, every frame (today's colour for every pixel) | 25 / 40 ms (35 fps) |
| | Medium grain, 24 times a second | 0.7 / 10.8 ms (the heavy frames are the redraws) |
| Starfield / Space Particles | 300 stars | 8.7 / 13 ms |
| | 600 stars | 12.2 / 18 ms (51 fps) |
| Particle Constellation | 60 dots (today's phone cap) | 9.5 / 14.9 ms |
| Flow Field | 500, 900 and 1,400 particles | 3.3, 4.9 and 6.8 ms (medians) |
| Plasma Field | Medium detail (140px picture) | 6.9 / 10.7 ms |
| | High detail (200px picture) | 13.2 / 18.7 ms |
| Ambient Ripple Effect, Floating Elements, Grid / Dot Pattern Parallax, Abstract Geometric Motion, Synthwave Grid, Matrix Rain | defaults, on today's taller phone stage | 0.4 to 2.9 ms (medians) |

## Cards and captions on the stage

Eight stages hold a small card that shows the effect behind real content: Animated Gradient Background, Mesh Gradient Animation, Aurora / Northern Lights, Starfield / Space Particles, Ambient Ripple Effect, Floating Elements and Grid / Dot Pattern Parallax keep theirs; Light Leak's card goes (see its section). On every card that stays:

- `.fg-title` drops Georgia and the italic and gets `font-weight:700`;
- `.fg-eyebrow` gets `font-weight:600` and 11px (was 9px), the size and weight of the site's small spaced capitals;
- `.fg-body` gets 13px (was 10–11px) and `color:rgba(255,255,255,.72)` (was .4–.6, under 4.5:1 on the cards).

**On phones** (`@media(max-width:600px)`) every card also gets `padding:12px 14px`, `.fg-eyebrow{margin-bottom:4px}`, `.fg-title{margin-bottom:0}` and `.fg-body{display:none}`. The eyebrow and the title still put content in front of the effect, and the card covers about a quarter of the 300px stage instead of half to two thirds, so the effect stays in view. Ambient Ripple Effect's card also moves to the bottom (see its section).

Measured on a 343×300 stage, with the site font and the card text of each section (the share of the stage's height the card covers, and where):

| Page | Before (every size's rules) | After (with the phone rules) |
|---|---|---|
| Animated Gradient Background | 57%, 30–87% down | 27%, 60–87% down |
| Mesh Gradient Animation | 64%, 23–87% down | 27%, 60–87% down |
| Aurora / Northern Lights | 54%, 34–88% down | 27%, 61–88% down |
| Starfield / Space Particles | 51%, 39–91% down (over the centre, where stars are born) | 25%, 65–91% down |
| Ambient Ripple Effect | 64%, 18–82% down (over all three ripple sources) | 21%, 75–96% down (below the sources, which sit 25–75% down) |
| Floating Elements | 69%, 16–84% down | 27%, 36–64% down |
| Grid / Dot Pattern Parallax | 69%, 16–84% down | 27%, 36–64% down |

The sections give the card text; wording that used developer terms is rewritten in plain words.

## Pointer and touch

Floating Elements (Shapes avoid the pointer) and Particle Constellation (Dots follow the pointer) take the pointer's position from `pointermove` only, so a tap does nothing. Each also takes it from `pointerdown`, so on a touch screen a finger resting on the stage works too.

Grid / Dot Pattern Parallax moves from mouse and touch events to Pointer Events, as CLAUDE.md asks of drag interactions. Its stage gets `touch-action:pan-y`, as on 2.5D / Pseudo-3D, so a sideways drag steers the grid while a vertical swipe still scrolls the page. Its hover state (the cursor ring and the light) starts only for `pointerType === 'mouse'`, so a tap never starts it (see its section).

None of these is a CSS `:hover` rule, so no `@media (hover: hover)` gate is needed. While a loop is paused, the pointer moves nothing on the stage. The one exception is Grid / Dot Pattern Parallax's cursor ring, which still follows the pointer, because that stage hides the system cursor.

---

## animated-gradient-background — Animated Gradient Background

- **Kind:** loop. The gradient shifts forever; there is no end.
- **Description:** Colors slowly drift across a soft gradient background. Best for hero sections.
- **Watch it help line:** default
- **Player bar:** Pause (css) · Slow motion (css)
- **Sequence:** `.grad-bg` runs its keyframes forever. Sliding and Bright bands use `@keyframes grad-pos` (over Speed, and over 1.5 × Speed for Bright bands), and Color wheel uses `@keyframes grad-hue` (over Speed). There are no page timers.
- **Slow motion:** css
- **Reduced motion:** the demo's rule `.grad-bg{animation-duration:300s!important}` goes (see the preamble).
- **Stage font:** site font, on the card as in the preamble.
- **Stage:** the gradient layer and the card stay.
  - Card text: eyebrow "Animated gradient"; title "Color that moves without demanding it"; body "A slow cycle keeps it calm: the color shifts, and the eye barely notices." (was "A long cycle duration makes the loop imperceptible. …").
  - `hb-dots`: no. Default height.
- **Phone fallback:** none needed. One gradient layer moves (or turns its colors), and the small card's 10px backdrop blur is the only filter.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Gradient | Choice buttons | Sliding · Color wheel · Bright bands | Sliding | Sliding is the calmest; the color wheel turns every color. | the gradient layer's class: `var-pos` / `var-hue` / `var-multi` |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | Longer cycles feel calmer. | `--dur`: 32s / 20s / 12s |
| Colors | Choice buttons | Cool · Sunset · Ocean · Gray | Cool | The set of colors the gradient moves through. | the stage's palette class: none / `pal-sunset` / `pal-ocean` / `pal-mono` |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Muted colors | Switch | on / off | off | Takes most of the color out for a quieter look. | the gradient layer's `subtle` class on / off |

- **Removed:**
  - The note.
  - The panel's Pause button. The player bar's Pause replaces it.
  - The Variant and Palette menus. They become Gradient and Colors.
  - The Cycle Duration slider. It becomes Speed.
  - "Subtle (reduced saturation)" becomes Muted colors.
- **Good for:** Hero sections · Landing pages · Dashboards · Splash screens · **Avoid on:** Long reading pages · Small elements
- **Prompt:**

  > Add an animated gradient background to [the section you want behind your content]. Paint a soft gradient much larger than the section and slowly slide it back and forth, or turn all its colors around the color wheel, so the colors keep shifting behind the content. End the gradient on the color it starts with, so the loop never shows a seam. A long, slow cycle feels calm; a fast one pulls attention away from the content. If the visitor has reduced motion turned on, show the gradient still. Match the settings listed below.

- **README What it is:** rewritten:

  > An animated gradient background slowly shifts its colors behind the content, over a long cycle (typically 15 to 30 seconds), so the page feels alive without anything catching the eye. The gradient is painted much larger than the area it fills and slides slowly back and forth, or its colors turn around the color wheel. It is the lightest ambient effect: the browser animates it with no script at all.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Gradient | Sliding | Sliding moves a large, soft gradient back and forth; Color wheel turns every color around the color wheel; Bright bands slides brighter colors between dark ends, one and a half times as slowly |
  | Speed | Normal | How long one cycle takes: slow is 32s, normal 20s and fast 12s; under 8s it becomes distracting |
  | Colors | Cool | The colors the gradient moves through: cool blues and purples, sunset oranges, ocean blues and greens, or grays |
  | Muted colors | off | Takes most of the color out (30% saturation) for a quieter background |

- **README See also:** the link texts change to the pages' real titles.
  - [Mesh Gradient Animation](../mesh-gradient/) — soft blobs of color drift and blend
  - [Breathing / Pulsing Glow](../breathing-glow/) — one soft glow grows and shrinks
  - [Aurora / Northern Lights](../aurora/) — bands of color sway like the northern lights
- **README How it works:** unchanged
- **README Production notes:** unchanged
- **Category line:** `07.01 · Ambient &amp; Background`
- **Pager:** Previous: none · Next: Mesh Gradient Animation (`../mesh-gradient/`)

---

## mesh-gradient — Mesh Gradient Animation

- **Kind:** loop. The blobs drift forever.
- **Description:** Blurred blobs of color drift and melt together. Best for landing pages.
- **Watch it help line:** default
- **Player bar:** Pause (css) · Slow motion (css)
- **Sequence:** each blob runs its own keyframes forever (`@keyframes b1` to `b5`, `alternate`), over Speed × 1, 1.1, 0.9, 1.2 and 0.8, so no two blobs line up. There are no page timers.
- **Slow motion:** css
- **Reduced motion:** the demo's rule `.blob{animation-duration:300s!important}` goes (see the preamble).
- **Stage font:** site font, on the card as in the preamble.
- **Stage:** the blobs and the card stay.
  - Card text: eyebrow "Mesh gradient"; title "Organic color without sharp edges"; body "Heavy blur melts round blobs into soft washes of color, the look Stripe made popular." (was "Heavy blur dissolves gradient boundaries into painterly washes. …").
  - `hb-dots`: no. Default height.
- **Phone fallback:** none today. Smallest change: on phones the blobs are blurred half as much, `@media(max-width:600px){.blob{filter:blur(calc(var(--blob-blur) * .5))}}`. The phone stage is less than half as wide, and the blobs are sized in percent of it, so they look just as soft, while each frame blurs a much smaller area. Heavy blur is the cost here: up to five blurred layers are redrawn every frame.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Blur | Choice buttons | Light · Medium · Heavy | Medium | Heavy blur hides the circles; light blur shows them. | `--blob-blur`: 50px / 80px / 130px |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | Longer cycles feel calmer. | `--dur`: 64s / 40s / 24s |
| Colors | Choice buttons | Cool · Warm · Sunset · Synthwave · Earth | Cool | The colors of the blobs. | `setPalette()`: `'cool'` / `'warm'` / `'sunset'` / `'synthwave'` / `'earth'` |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Number of blobs | Choice buttons | 3 · 4 · 5 | 4 | More blobs make a richer mix of color. | the first 3 / 4 / 5 blobs shown (`display` block, the rest none, as today) |
| Blend | Choice buttons | Plain · Lighter · Deeper | Plain | Lighter brightens where blobs overlap; deeper darkens it. | `--blend`: `normal` / `screen` / `overlay` |

- **Removed:**
  - The note.
  - The panel's Pause button. The player bar's Pause replaces it.
  - The Blob Count, Blur Amount and Speed (cycle) sliders. They become Number of blobs, Blur and Speed.
  - The Palette and Blend Mode menus. They become Colors and Blend, and the blend modes get plain names for what they look like (normal, screen and overlay become Plain, Lighter and Deeper).
  - The script's last line, which hid the fifth blob again (`.b5` is already hidden by its CSS).
- **Good for:** Hero sections · Landing pages · App splash screens · Dark dashboards · **Avoid on:** Small elements · Long reading pages
- **Prompt:**

  > Add a mesh gradient background to [the section you want behind your content]. Place a few large circles of color behind the content and blur them, so their edges soften and the colors run into one another. Let each circle drift and grow or shrink slowly on its own path, so the colors keep blending in new ways, and clip them to the section so they never spill out. Blur is costly on phones, so blur less on small screens. If the visitor has reduced motion turned on, keep the circles still. Match the settings listed below.

- **README What it is:** rewritten:

  > A mesh gradient is a background of large circles of color, blurred so heavily that their edges disappear and they melt into soft washes. Each circle drifts and grows or shrinks slowly on its own path, so the colors keep blending in new ways, like paint that never quite dries. It is the look of Stripe, Linear and many modern software sites.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Blur | Medium | How much the blobs are blurred: light is 50px, medium 80px and heavy 130px; below about 80px the circles show, above it they become a wash. Phones use half |
  | Speed | Normal | How long each blob takes to drift one way: slow is 64s, normal 40s and fast 24s |
  | Colors | Cool | The blob colors: cool, warm, sunset, synthwave or earth tones |
  | Number of blobs | 4 | Three, four or five blobs; more make a richer mix |
  | Blend | Plain | How overlapping blobs mix: plain stacks them (normal blending), lighter brightens the overlap (screen), deeper darkens it and deepens the colors (overlay) |

- **README See also:** the link texts change to the pages' real titles.
  - [Animated Gradient Background](../animated-gradient-background/) — one gradient that slowly shifts
  - [Aurora / Northern Lights](../aurora/) — tall bands of color instead of round blobs
  - [Breathing / Pulsing Glow](../breathing-glow/) — a single glow that grows and shrinks
- **README How it works:** keep the snippets. After the blend-mode list, add: "Heavy blur is the costly part on phones, so the demo halves it on small screens:" and this snippet:

  ```css
  @media (max-width: 600px) {
    .blob { filter: blur(calc(var(--blob-blur) * .5)); }
  }
  ```

- **README Production notes:** unchanged
- **Category line:** `07.02 · Ambient &amp; Background`
- **Pager:** Previous: Animated Gradient Background (`../animated-gradient-background/`) · Next: Aurora / Northern Lights (`../aurora/`)

---

## aurora — Aurora / Northern Lights

- **Kind:** loop. The bands sway forever.
- **Description:** Blurred bands of light sway like the northern lights. Best for dark backgrounds.
- **Watch it help line:** default
- **Player bar:** Pause (css) · Slow motion (css)
- **Sequence:** each band sways forever with its own keyframes (`@keyframes drift1` to `drift5`), over Speed × 1, 1.15, 0.85, 1.25 and 1.1. With Stars in the sky on, each star twinkles with `@keyframes twinkle` (2–6s each, at random). There are no page timers. Today's Pause only held the bands; the "css" Pause holds the stars too.
- **Slow motion:** css
- **Reduced motion:** the demo's rule `.band{animation-duration:300s!important}.star{animation:none!important}` goes (see the preamble).
- **Stage font:** site font, on the card as in the preamble.
- **Stage:** the sky, the stars layer, the bands, the horizon strip and the card stay.
  - Card text: eyebrow "Aurora" (its green `rgba(0,220,100,.7)` stays: 5.5:1); title "Charged particles. Magnetic fields. Light."; body "Green is oxygen high in the sky; red is rarer, and higher still." (was a longer line in kilometres, which ran to five lines on phones).
  - `hb-dots`: no. Default height.
- **Phone fallback:** none today. Smallest change: on phones the bands are blurred half as much, `@media(max-width:600px){.band{filter:blur(18px)}}` (35px today). The phone stage is less than half as wide, so the bands look as soft, and each frame blurs far fewer pixels. The README already advises less blur on mobile.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Number of bands | Choice buttons | 2 · 3 · 4 · 5 | 2 | More bands make a fuller sky. | `count`: 2 / 3 / 4 / 5, then `applyPalette()` (it shows the first `count` bands of the chosen colors' order, as today) |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | Longer cycles feel calmer. | `--dur`: 48s / 30s / 18s |
| Colors | Choice buttons | Green · Purple · Red | Green | Green is the most common aurora; red is rare. | `applyPalette()`: `'classic'` / `'vivid'` / `'rare'` (green and blue first / purple and pink first / red and pink first) |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Brightness | Choice buttons | Dim · Medium · Bright | Medium | How strongly the bands glow. | each band's `style.opacity`: .5 / .75 / 1 |
| Stars in the sky | Switch | on / off | off | Adds twinkling stars behind the bands. | on: `buildStars()` (once) and the stars layer shown / off: the stars layer hidden |

- **Removed:**
  - The note.
  - The panel's Pause button. The player bar's Pause replaces it.
  - The Band Count, Speed (cycle) and Brightness sliders. They become Number of bands, Speed and Brightness.
  - The Palette menu. It becomes Colors.
  - "Stars in background" becomes Stars in the sky.
- **Good for:** Hero sections · Night and space themes · Music and meditation apps · Travel sites · **Avoid on:** Light pages · Busy layouts
- **Prompt:**

  > Add an aurora background to [the dark section you want it behind]. Stack a few tall, wide bands of color that fade to transparent at the top and bottom, blur them softly, and let each one sway sideways and lean a little on its own slow cycle, so they drift apart and together like curtains of light. Make the bands wider than the section and clip them, so their ends never show. Blur less on phones to keep it smooth. If the visitor has reduced motion turned on, keep the bands still. Match the settings listed below.

- **README What it is:** rewritten:

  > An aurora background imitates the northern lights with a few tall bands of color that sway slowly across a night sky. Each band fades away at the top and bottom and is softly blurred, and each one drifts sideways and leans a little on its own cycle, so the curtains of light never move together. The browser draws it all with no script.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Number of bands | 2 | How many bands of light: two look clear, five make a richer, layered sky |
  | Speed | Normal | How long each band takes to sway through its cycle: slow is 48s, normal 30s and fast 18s |
  | Colors | Green | Which colors come first: green and blue (the most common aurora), purple and pink, or red and pink (rare); more bands add the other colors |
  | Brightness | Medium | How strongly the bands glow: dim is 50%, medium 75% and bright 100% |
  | Stars in the sky | off | Adds 120 twinkling stars behind the bands |

- **README See also:** the link texts change to the pages' real titles.
  - [Mesh Gradient Animation](../mesh-gradient/) — round blobs of color instead of tall bands
  - [Starfield / Space Particles](../starfield/) — stars stream toward you out of the dark
  - [Animated Gradient Background](../animated-gradient-background/) — one gradient that slowly shifts
- **README How it works:** keep the snippet. After it, add: "On phones the demo halves the blur, `@media (max-width: 600px) { .band { filter: blur(18px); } }`, which keeps the bands as soft on the smaller stage." The color list stays.
- **README Production notes:** in the "Star layer pairing" bullet, "See the demo's star toggle." becomes "See the demo's Stars in the sky switch." The rest is unchanged.
- **Category line:** `07.03 · Ambient &amp; Background`
- **Pager:** Previous: Mesh Gradient Animation (`../mesh-gradient/`) · Next: Grain / Film Noise Overlay (`../grain-overlay/`)

---

## grain-overlay — Grain / Film Noise Overlay

- **Kind:** loop. New grain is drawn again and again, forever.
- **Description:** Fine grain flickers over the page, like old film. Best for editorial sites.
- **Watch it help line:** default
- **Player bar:** Pause (page) · Slow motion (page)
- **Sequence:** the page's `loop()` runs on animation frames, as in the preamble.
  - When the time since the last grain frame reaches the interval, 1000 ÷ How often it changes, it draws new grain: `drawCanvasGrain()` for Random dots, or `seed++` on the `feTurbulence` for Noise filter.
  - The fps measurement and both readouts go from `loop()`.
  - At load the page draws one grain frame at once (today's `loop(performance.now())` did the same), then calls `start()`. So a loop paused on arrival shows still grain over the scene.
  - Pause and Play as in the preamble. While paused, a setting change that alters the grain's look (Grain size, Colored grain, Grain source) draws one new grain frame; Strength and Blend are CSS and show at once. After a real resize (see the preamble), `resize()` draws a grain frame at once, playing or paused; today it did so only while paused, so a playing page showed no grain until the next change came round.
- **Slow motion:** while the switch is on, the interval between grain frames is multiplied by 3 (Like film, 24 a second, becomes 8), from the next frame.
- **Reduced motion:** the page's own checks go (`reduceMQ` in `loop()`, `resize()` and the setting handlers, `renderStatic()`, and the `reduceMQ` change listener), as in the preamble.
- **Stage font:** site font.
  - `.hero-h` drops Georgia and the italic and gets `font-weight:700`.
  - `.hero-label` becomes 11px (was 10px), with `color:rgba(88,166,255,.85)` (was .5: 2.6:1).
  - `.hero-p` becomes 13px (was 12px), with `color:rgba(255,255,255,.72)` (was .5).
- **Stage:** the scene (the "Atlas Studio" hero mock-up) and both grain layers (canvas and SVG filter) stay; the fps badge goes. The mobile rule `height:auto;min-height:400px` goes: the hero mock-up fits the 300px phone stage (about 225px with its padding). `hb-dots`: no. Default height.
- **Phone fallback:** today the grain canvas is drawn at CSS pixels, not device pixels (a quarter to a ninth of the pixels on a phone). Two small changes:
  1. **Colored grain per dot.** Colored grain picks its three colors once per grain dot, like gray grain, instead of for every pixel. Today it ignores Grain size and picks three random numbers for every pixel, twelve times as many as gray grain at Medium size: 25 ms a frame, 35 fps, measured.
  2. **At most 24 changes a second on phones.** On stages narrower than 600px the grain changes at most 24 times a second (`frameInterval` at least 1000/24 ms), so Every frame looks like Like film there. Fine grain at every frame measured 12.7 ms with 21 ms peaks, too close to the budget.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Strength | Choice buttons | Faint · Light · Strong | Light | Grain works best when it is felt more than seen. | `--grain-op`: 0.04 / 0.08 / 0.16 |
| Grain size | Choice buttons; shown only when Grain source is Random dots | Fine · Medium · Coarse | Medium | Coarse grain looks like old film stock. | `SIZE`: 1 / 2 / 3 (px) |
| How often it changes | Choice buttons | Every frame · Like film · Choppy · Slow | Like film | Film grain changes 24 times a second; phones cap it there. | `frameInterval`: 1000/60 / 1000/24 / 1000/12 / 1000/4 (ms) |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Blend | Choice buttons | Film · Lighter · Softer | Film | Film deepens darks and lights; the others are gentler. | `--grain-blend`: `overlay` / `screen` / `soft-light` |
| Colored grain | Switch; shown only when Grain source is Random dots | on / off | off | Colored dots instead of gray ones. | `COLOR_NOISE` true / false |
| Grain source | Choice buttons | Random dots · Noise filter | Random dots | Dots drawn by a script, or the browser's noise filter. | `IMPL`: `'canvas'` / `'svgfilter'`, showing the matching grain layer (as today) and hiding Grain size and Colored grain for Noise filter |

- **Removed:**
  - The note.
  - The panel's Pause button. The player bar's Pause replaces it.
  - The fps badge on the stage and the Render readout.
  - The Intensity slider. It becomes Strength.
  - The Implementation, Grain Size, Update Rate and Blend Mode menus. They become Grain source, Grain size, How often it changes and Blend, and the blend modes get plain names for what they look like (overlay, screen and soft light become Film, Lighter and Softer).
  - "Color noise (RGB)" becomes Colored grain.
- **Changed default:** How often it changes starts at Like film (24 a second), not at 60. The README's Key parameters and the demo's own note already give 24 as the rate to use, and it is the film look this page is named for.
- **Good for:** Editorial sites · Portfolios · Photo and film pages · Hero sections · **Avoid on:** Small text · Forms
- **Prompt:**

  > Add a film grain overlay to [the section or page you want to texture]. Cover it with a see-through layer of random light and dark dots, and draw a new set of dots again and again so the grain flickers like old film; grain works best when it is felt more than seen. Blend the layer into the picture beneath it instead of laying gray on top, and let clicks pass through it. Redraw less often on phones, where drawing every dot is the costly part. If the visitor has reduced motion turned on, show the grain still. Match the settings listed below.

- **README What it is:** rewritten:

  > Film grain lays a see-through layer of random dots over a design and draws it again and again, so the texture flickers like the grain of photographic film. At a low strength, around 5 to 10 percent, it is barely visible, yet flat digital colors feel warmer and deeper; much stronger, and it looks like a damaged screen. The trick is subtlety: people should not notice the grain, only miss it when it is gone.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Strength | Light | How visible the grain is: faint is 4%, light 8% and strong 16%; 5–10% is felt more than seen, above 20% it looks like a damaged screen |
  | Grain size | Medium | The size of each dot: fine is 1px, medium 2px and coarse 3px; coarse looks like old film stock |
  | How often it changes | Like film | New grain every frame (60 times a second), like film (24), choppy (12) or slow (4); phones change it at most 24 times a second |
  | Blend | Film | How the grain mixes with the picture: film darkens dark areas and lightens light ones, like real grain (overlay blending); lighter only lightens (screen); softer is a gentler film (soft light) |
  | Colored grain | off | Randomly colored dots instead of gray ones |
  | Grain source | Random dots | Dots drawn by a script, or the browser's own noise filter; grain size and colored grain apply to the dots only |

- **README See also:** the first link's text changes to the page's real title.
  - [Scanline Effect](../scanline/) — dark lines over the page, like an old monitor
  - [Chromatic Aberration](../../06-3d-advanced/chromatic-aberration/) — colors split at the edges, like a cheap lens
  - [Light Leak](../light-leak/) — warm light washes in, like a film camera flaw
- **README How it works:** in the canvas snippet, pick each dot's color once per dot, so it matches the demo. The loop body becomes:

  ```js
    for (let y = 0; y < H; y += pixelSize) {
      for (let x = 0; x < W; x += pixelSize) {
        // one color per grain dot: gray, or three random channels
        const v = Math.random() * 255 | 0;
        const r = colorNoise ? Math.random() * 255 | 0 : v;
        const g = colorNoise ? Math.random() * 255 | 0 : v;
        const b = colorNoise ? Math.random() * 255 | 0 : v;
        for (let dy = 0; dy < pixelSize && y + dy < H; dy++) {
          for (let dx = 0; dx < pixelSize && x + dx < W; dx++) {
            const idx = ((y + dy) * W + (x + dx)) * 4;
            data[idx] = r; data[idx + 1] = g; data[idx + 2] = b; data[idx + 3] = 255;
          }
        }
      }
    }
  ```

  The rest is unchanged.
- **README Production notes:** add a bullet after "Reduced update rate is intentional": "**Phones**: the demo changes the grain at most 24 times a second on screens narrower than 600px, and draws the canvas at CSS pixels rather than device pixels; drawing every dot is the costly part." The rest is unchanged.
- **Category line:** `07.04 · Ambient &amp; Background`
- **Pager:** Previous: Aurora / Northern Lights (`../aurora/`) · Next: Scanline Effect (`../scanline/`)

---

## scanline — Scanline Effect

- **Kind:** loop. The beam sweeps and the cursor blinks forever.
- **Description:** Dark lines and a sweeping beam imitate an old TV screen. Best for retro sites.
- **Watch it help line:** default
- **Player bar:** Pause (css) · Slow motion (css)
- **Sequence:** while Moving beam is on, the beam sweeps down forever (`@keyframes beam-sweep`, over Beam speed), and the cursor always blinks (`@keyframes blink`, 1s, `step-end`). The scanlines themselves are a still pattern. There are no page timers.
- **Changed default:** Moving beam starts on (today it starts off). With it off, the stage is almost a still picture: only the cursor blinks, so Pause and Slow motion show next to nothing. Variable Font Morph did the same: its Auto-morph became the loop and runs from load. The `.beam` rule loses `display:none`, so the beam shows at load and the switch hides it.
- **Slow motion:** css
- **Reduced motion:** the demo's rule `.beam{animation-duration:60s!important}.term-cursor{animation:none!important}` goes (see the preamble).
- **Stage font:** site font. The terminal drops `font-family:monospace` (the owner's ruling keeps a typewriter font for typing effects only, and the effect here is the lines, not the text).
  - `.term-line` becomes `font-size:clamp(12px,1.4vw,14px)` (was `clamp(10px,1.3vw,12px)`, 10px on phones).
  - `.term-line.dim` gets `opacity:.75` (was .4, which is 1.9:1 on the terminal).
- **Stage:** the terminal mock-up, the scanlines, the beam and the dark-corners layer stay.
  - The terminal's lines read like an old screen instead of shell code (the page shows no code): "SYSTEM READY" / "Tuning the signal…" (dim) / "All channels clear" / "Picture steady" (dim) / a last line holding only the blinking cursor. They replace "$ initialize_system --mode ambient", "// scanning for motion patterns", "→ all systems nominal", "→ rendering 60fps continuous" and "_ ".
  - The mobile rule `height:auto;min-height:420px` goes: the terminal fits the 300px phone stage (about 170px).
  - `hb-dots`: no. Default height.
- **Phone fallback:** none needed. The lines are one still repeating gradient, and the beam and the cursor are single animations of `transform` and `opacity`.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Line spacing | Choice buttons | Tight · Medium · Wide | Medium | Tight lines look most like a real old screen. | `--line-gap`: 2px / 4px / 8px |
| Line darkness | Choice buttons | Light · Medium · Dark | Medium | Darker lines look more retro but are harder to read. | `--line-dark`: 0.08 / 0.15 / 0.3 |
| Moving beam | Switch | on / off | on | A band of light sweeps down the screen. | the beam's `display`: block / none |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Beam speed | Choice buttons; shown only when Moving beam is on | Slow · Normal · Fast | Normal | How long the beam takes to cross the screen. | `--beam-dur`: 6.4s / 4s / 2.4s |
| Beam brightness | Choice buttons; shown only when Moving beam is on | Faint · Medium · Bright | Medium | Keep the beam faint: it should be felt, not seen. | `--beam-bright`: 0.06 / 0.12 / 0.24 |
| Dark corners | Switch | on / off | off | Darkens the corners like an old screen's curved glass. | the dark-corners layer's `display`: block / none |
| Glowing text | Switch | on / off | off | A soft glow around the letters. | the terminal's `phosphor` class on / off |

- **Removed:**
  - The note.
  - The panel's Pause button. The player bar's Pause replaces it.
  - The Line Density menu. It becomes Line spacing.
  - The Line Darkness, Beam Speed and Beam Brightness sliders. They become Line darkness, Beam speed and Beam brightness.
  - "Moving beam sweep" becomes Moving beam; "CRT curvature vignette" becomes Dark corners; "Phosphor text glow" becomes Glowing text.
- **Good for:** Retro and gaming sites · Terminal screens · Music players · Sci-fi interfaces · **Avoid on:** Long reading · Forms
- **Prompt:**

  > Add a scanline effect to [the screen, panel or section you want to look like an old monitor]. Lay thin, dark horizontal lines over the content with a repeating stripe pattern, in a layer that clicks pass through, so it looks like the rows of an old tube screen. When the settings include them, sweep a soft band of light slowly down the screen again and again, darken the corners like curved glass, and give the text a soft glow. Make sure the text stays readable through the lines. If the visitor has reduced motion turned on, keep the beam still. Match the settings listed below.

- **README What it is:** rewritten:

  > Scanlines are the thin dark lines between the rows of light on an old tube television or computer monitor. Laying them over a design as a repeating stripe pattern gives it the look of a retro screen from the 80s or 90s. A soft band of light sweeping slowly down the screen adds movement, and darkened corners suggest the curved glass.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Line spacing | Medium | The distance between lines: tight is 2px, medium 4px and wide 8px; 4px looks like a standard old screen |
  | Line darkness | Medium | How dark the lines are: light is 8%, medium 15% and dark 30%; darker looks more retro but lowers contrast |
  | Moving beam | on | A soft band of light sweeps down the screen, again and again |
  | Beam speed | Normal | How long the beam takes to cross the screen: slow is 6.4s, normal 4s and fast 2.4s |
  | Beam brightness | Medium | How bright the beam is: faint is 6%, medium 12% and bright 24%; it should be felt more than seen |
  | Dark corners | off | A soft vignette darkens the corners, like the curved glass of an old screen |
  | Glowing text | off | A soft glow around the letters, like light spreading on an old screen |

- **README See also:** the first two link texts change to the pages' real titles.
  - [Grain / Film Noise Overlay](../grain-overlay/) — a flickering texture of fine grain
  - [Light Leak](../light-leak/) — warm light washes in, like a film camera flaw
  - [Chromatic Aberration](../../06-3d-advanced/chromatic-aberration/) — colors split at the edges, like a broken signal
- **README How it works:** "The `line-gap` CSS custom property in the demo allows the density to be adjusted: `4px` is standard CRT density; `8px` is coarser and more stylized." becomes "The demo's Line spacing setting changes this gap (`--line-gap`): `2px` is dense, `4px` is standard CRT density and `8px` is coarser and more stylized." The rest is unchanged.
- **README Production notes:** in the first bullet, "Only the panel controls use JS." becomes "Only the demo's settings use JavaScript." The rest is unchanged.
- **Category line:** `07.05 · Ambient &amp; Background`
- **Pager:** Previous: Grain / Film Noise Overlay (`../grain-overlay/`) · Next: Light Leak (`../light-leak/`)

---

## light-leak — Light Leak

- **Kind:** loop. A leak comes every few seconds, at random, forever.
- **Description:** Warm light washes in from a corner at random times. Best for photo sites.
- **Watch it help line:** Leaks come by themselves, a few seconds apart at random. Pause it to look closely, or turn on slow motion to see each leak fade in and out.
- **Player bar:** Pause (css) · Slow motion (page)
- **Sequence:** the leak is one chain of timers, and every timer goes through the helper's `wait()`, so there is only ever one pending timer:
  - `flash()` sets this leak's fade time `d` (Speed, or 3 × Speed while Slow motion is on) as `--leak-dur`, and sets `--leak-peak` to Brightness × (0.75 to 1, at random).
  - It then adds `active`, so the glow fades in over `d`, spawns three floating light spots when that switch is on, and calls `wait(() => fadeOut(d), d + 200)`.
  - `fadeOut(d)` removes `active`, so the glow fades out over `d`, and calls `wait(flash, d + gap)`, where the gap is random within Time between leaks.
  - At load the chain starts with `wait(flash, gap)`, so the first leak comes after one gap, as today.

  So one leak is: fade in, hold 200ms at its peak, fade out, then a dark gap. Today the gap was counted from the start of each leak, so a short gap could start the next leak while the last was still fading; now it starts when the glow is gone. The "Next leak in" countdown (a second `setInterval`) and its readout go.

  **The light spots** float once (`animation:bokeh-float linear both`, no longer `infinite`) and remove themselves on `animationend`, so the 8-second removal timers go. `both` also stops a spot from showing at full size and full strength during its start delay, before its float begins (a glitch today).

  **Pause (css)** holds the spots' `@keyframes`. The page's `hb:pause` listener (top level) freezes the chain with the Text sheet's helper. Here `freeze()` holds only the stage's running CSS transitions, which is the glow's fade, never the spots' keyframes:

  ```js
  // Pause freezes the leak under way: its fade stops where it is and the timer keeps the time it had left.
  // The floating light spots are CSS keyframes, which data-hb-pause="css" holds; only the fade is held here.
  let timer=0, next=null, due=0, left=0, held=[], paused=false;
  function wait(fn,ms){ clearTimeout(timer); next=fn; if(paused){ left=ms; return; } due=performance.now()+ms; timer=setTimeout(()=>{ next=null; fn(); },ms); }
  function freeze(){ paused=true; clearTimeout(timer); if(next) left=Math.max(0,due-performance.now()); held=stage.getAnimations({subtree:true}).filter(a=>a instanceof CSSTransition&&a.playState==='running'); held.forEach(a=>a.pause()); }
  function thaw(){ paused=false; held.forEach(a=>{ if(a.playState!=='paused') return; if(a.currentTime>=a.effect.getComputedTiming().endTime) a.finish(); else a.play(); }); held=[]; if(next) wait(next,left); }
  document.addEventListener('hb:pause',e=>e.detail.paused?freeze():thaw());
  ```

  `stage` is the page's `.stage`.

  **Settings while paused:** Comes from and Color repaint the glow's gradient at once (`applyColor()`, no transition). Brightness, Speed, Time between leaks and Floating light spots take effect from the next leak. Brightness no longer writes `--leak-peak` directly (today it does), because that would restart a fade held by Pause.
- **Slow motion (page):** while the switch is on, `flash()` makes the fade `d` 3 × Speed (the CSS fade and the two waits that wait for it), and new light spots float three times as long. The 200ms hold and the gap keep their length. The change takes effect from the next leak. This is "page" rather than "css" so the page stretches its own fade and waits together, and because between leaks nothing on the stage is animating for a shared slow-down to act on.
- **Reduced motion:** the demo's rule (the glow held at a steady dim level, and 60-second light spots) goes (see the preamble).
- **Stage font:** site font. `.photo-cap` becomes `color:rgba(255,255,255,.72)` (was .5).
- **Stage:** the scene (the photo mock-up with its caption, "ambient · atmospheric · analog warmth") and the glow stay; the spots are added while it runs.
  - The card goes. On the new stage (440px, 300px on phones) it covers most of the photo mock-up, and the leak needs the photo to show against. Its words repeat the page's title and lede.
  - `hb-dots`: no. Default height.
- **Phone fallback:** none needed. One full-stage gradient fades in and out, plus at most a few small blurred spots when that switch is on.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Comes from | Choice buttons | Top left · Top right · Bottom left · Bottom right · Down the middle | Top left | Where the light spills in. | the glow's class: `dir-tl` / `dir-tr` / `dir-bl` / `dir-br` / `dir-h`, then `applyColor()` |
| Time between leaks | Choice buttons | Short · Medium · Long | Medium | Gaps are random within the range, so it never feels timed. | `minGap`–`maxGap`: 0.5–1.5s / 1–3s / 3–8s (the dark gap after each leak) |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How quickly each leak fades in and out. | `dur`: 2000ms / 1200ms / 700ms (`flash()` writes it to `--leak-dur`) |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Brightness | Choice buttons | Dim · Medium · Bright | Medium | Each leak peaks a little below this, at random. | `intensity` (and `--leak-op`): 0.3 / 0.55 / 0.8 |
| Color | Swatches | Amber · Gold · Rose · Magenta · Cyan | Amber | Warm colors look like film; cyan looks cooler. | `curColor` from `#ffa532` / `#ffce5a` / `#ff6f8b` / `#ff5ca8` / `#5ad1ff` (as `rgba(r,g,b,`, as today), then `applyColor()` |
| Floating light spots | Switch | on / off | off | Soft spots of light drift up after each leak. | `bokehOn` true / false |

- **Removed:**
  - The note.
  - The panel's Pause button. The player bar's Pause replaces it.
  - The "Next leak in" readout and its countdown timer.
  - The card on the stage (see Stage).
  - The Direction menu. It becomes Comes from.
  - The Sweep Duration slider. It becomes Speed.
  - The Min / Max Delay sliders. They become Time between leaks.
  - The Intensity slider. It becomes Brightness.
  - The colour picker. It becomes the Color swatches: the README's classic leak colors (amber, gold, rose, magenta, cyan). There is no white, which the README says reads as a lens flare.
  - "Bokeh light blobs" becomes Floating light spots.
- **Good for:** Photo and film sites · Portfolios · Music pages · Lifestyle brands · **Avoid on:** Dashboards · Long reading pages
- **Prompt:**

  > Add a light leak effect to [the photo, video or section you want it over]. Place a soft glow of light, classically warm amber, spilling in from one corner or down the middle, in a see-through layer that clicks pass through, and fade it in and out every so often, like stray light reaching the film in an old camera. Make the gaps between leaks random and vary each leak's strength a little, because evenly timed leaks look fake. Keep each leak soft, so it never looks like a flash. If the visitor has reduced motion turned on, keep the glow still and faint. Match the settings listed below.

- **README What it is:** rewritten:

  > A light leak is a warm glow that washes in from the edge of the frame and fades away again, like the stray light that reached the film when an old camera was not sealed properly. Real leaks happen at random and vary in strength, so the effect waits a random gap between leaks and peaks at a slightly different brightness each time; evenly timed leaks look like a machine, not a film camera.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Comes from | Top left | The corner the glow spills in from, or a band of light down the middle |
  | Time between leaks | Medium | The random dark gap between one leak and the next: short is 0.5–1.5s, medium 1–3s and long 3–8s |
  | Speed | Normal | How long each leak takes to fade in, and again to fade out: slow is 2s, normal 1.2s and fast 0.7s |
  | Brightness | Medium | How strong the glow gets: dim is 30%, medium 55% and bright 80%; each leak peaks a little below this, at random |
  | Color | Amber | Amber is the classic leak; gold, rose and magenta are warm too, and cyan looks like a cooler film stock |
  | Floating light spots | off | Soft spots of light drift up and fade after each leak |

- **README See also:** the first two link texts change to the pages' real titles.
  - [Grain / Film Noise Overlay](../grain-overlay/) — the film grain that pairs with a leak
  - [Scanline Effect](../scanline/) — dark lines over the page, like an old monitor
  - [Glassmorphism Animated](../../06-3d-advanced/glassmorphism-animated/) — frosted glass over moving color
- **README How it works:** the JS snippet is replaced with the new chain. The CSS snippet gets the fade rule. JS:

  ```js
  const leak = document.querySelector('.leak');

  function flash() {
    leak.style.setProperty('--leak-dur', fadeMs + 'ms');   // the fade time, read by the CSS transition
    // each leak peaks a little below the chosen brightness, at random
    leak.style.setProperty('--leak-peak', (brightness * (0.75 + Math.random() * 0.25)).toFixed(3));
    leak.classList.add('active');                // fades in over --leak-dur
    setTimeout(fadeOut, fadeMs + 200);           // hold the peak for 200ms
  }

  function fadeOut() {
    leak.classList.remove('active');             // fades out over --leak-dur
    setTimeout(flash, fadeMs + randomGap());     // a random dark gap before the next leak
  }

  function randomGap() {
    return (minGap + Math.random() * (maxGap - minGap)) * 1000;   // 1–3s in the demo
  }

  setTimeout(flash, randomGap());
  ```

  In the CSS snippet, add `transition: opacity var(--leak-dur) ease-in-out;` to `.leak`, and after it the rule `.leak.active { opacity: var(--leak-peak); }`. The sentence before the JS snippet stays.
- **README Production notes:** unchanged
- **Category line:** `07.06 · Ambient &amp; Background`
- **Pager:** Previous: Scanline Effect (`../scanline/`) · Next: Starfield / Space Particles (`../starfield/`)

---

## starfield — Starfield / Space Particles

- **Kind:** loop. The stars keep coming.
- **Description:** Stars stream toward you out of the dark. Best for space themes.
- **Watch it help line:** default
- **Player bar:** Pause (page) · Slow motion (page)
- **Sequence:** the canvas loop as in the preamble. Each drawn frame (at most one per 16ms, as today) is `paint(true)`:
  - it covers the canvas with `rgba(0,0,0,.85)`, which leaves short trails;
  - it draws the haze when Nebula haze is on;
  - it moves every star (`update()`) and draws it.

  `paint(false)` does the same without moving the stars. It runs at load, after `initStars()`, so a loop paused on arrival shows the stars. It also runs after a setting change while paused, which replaces today's `redraw()` (it only worked under reduced motion), and after a real resize (see the preamble), playing or paused, following `initStars()`. The fps measurement and both readouts go.
- **Slow motion:** while the switch is on, `update()` moves each star, and advances its twinkle, by a third of the usual step (outward: `dist`; sideways: `x`; and `twinklePhase`), from the next frame.
- **Reduced motion:** the page's `REDUCED` checks go (see the preamble).
- **Stage font:** site font, on the card as in the preamble. `.fg-eyebrow` becomes `color:rgba(255,255,255,.6)` (was .4, which is 3.4:1).
- **Stage:** the canvas and the card stay; the fps badge goes.
  - Card text: eyebrow "Starfield"; title "Infinite depth from a single point"; body "Small, slow stars in the middle grow and speed up toward the edge." (was "… — perspective through motion.").
  - `hb-dots`: no. Default height.
- **Phone fallback:** none today (the canvas caps the pixel ratio at 2). Smallest change: `initStars()` builds at most 300 stars on stages narrower than 600px, so Many shows 300 there. Measured on a phone stage: 300 stars take about 9 ms a frame, and 600 take 12 ms with 18 ms peaks (51 fps).

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Direction | Choice buttons | Outward · Sideways | Outward | Outward flies through space; sideways looks out a window. | `MODE`: `'radial'` / `'drift'`, then `initStars()` |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | Keep it slow for a calm background. | `SPD`: 0.25 / 0.4 / 0.65 |
| Number of stars | Choice buttons | Few · Medium · Many | Medium | More stars feel deeper; phones show at most 300. | `COUNT`: 150 / 300 / 600, then `initStars()` |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Star color | Choice buttons | White · Warm white · Many colors | White | The color of the stars. | `COL`: `'white'` / `'warm'` / `'color'` |
| Twinkling | Switch | on / off | on | Each star gently brightens and dims. | `TWINKLE` true / false |
| Nebula haze | Switch | on / off | off | A faint purple and blue haze behind the stars. | `NEBULA` true / false |

- **Removed:**
  - The note.
  - The panel's Pause button. The player bar's Pause replaces it.
  - The fps badge and the FPS readout.
  - The Mode and Star Color menus. They become Direction and Star color.
  - The Star Count and Speed sliders. They become Number of stars and Speed.
- **Good for:** Space and science themes · Hero sections · Screensavers and kiosks · Launch pages · **Avoid on:** Light pages · Long reading pages
- **Prompt:**

  > Add a starfield background to [the dark section you want it behind]. Draw many small stars on a canvas and move them out from the center, or sideways past the viewer, so it feels like flying through space. Tie each star's size, brightness and speed to its distance from the center: small, dim and slow near the middle, bigger, brighter and faster toward the edge, which is what creates the depth. A slow speed keeps it calm. Draw fewer stars on phones. If the visitor has reduced motion turned on, show the stars still. Match the settings listed below.

- **README What it is:** rewritten:

  > A starfield fills a dark background with small stars that stream out from the center, like the view from a spaceship flying through space. Each star's size, brightness and speed depend on how far it is from the middle: near the center stars are small, dim and slow, and they grow, brighten and speed up toward the edge, which is what makes it feel deep. A sideways version drifts stars past, the nearer ones faster, like the view from a window.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Direction | Outward | Outward streams the stars from the center; sideways drifts them past, the nearer ones faster |
  | Speed | Normal | How fast the stars move: slow is 0.25, normal 0.4 and fast 0.65 pixels a frame near the center, faster toward the edge; keep it slow for a calm background |
  | Number of stars | Medium | Few is 150, medium 300 and many 600; phones show at most 300 |
  | Star color | White | White, a warm white, or a different pale color for each star |
  | Twinkling | on | Each star gently brightens and dims on its own rhythm |
  | Nebula haze | off | A faint purple and blue haze behind the stars adds depth |

- **README See also:** the first link's text changes to the page's real title.
  - [Aurora / Northern Lights](../aurora/) — bands of light that pair with a night sky
  - [Canvas Particle Effect](../../06-3d-advanced/canvas-particle-effect/) — particles that link up and react to the pointer
  - [Floating Elements](../floating-elements/) — shapes that drift slowly on their own paths
- **README How it works:** unchanged
- **README Production notes:** add a bullet after "Canvas vs DOM": "**Phones**: the demo draws at most 300 stars on screens narrower than 600px; each star is a separate fill, so the count is the main cost." The rest is unchanged.
- **Category line:** `07.07 · Ambient &amp; Background`
- **Pager:** Previous: Light Leak (`../light-leak/`) · Next: Breathing / Pulsing Glow (`../breathing-glow/`)

---

## breathing-glow — Breathing / Pulsing Glow

- **Kind:** loop. The glow breathes forever.
- **Description:** A soft glow slowly grows and shrinks, like calm breathing. Best for idle states.
- **Watch it help line:** default
- **Player bar:** Pause (css) · Slow motion (css)
- **Sequence:** the glow breathes forever (`@keyframes breathe`, over Speed). The second glow, when it is on, breathes the other way (`reverse`, over 1.3 × Speed). The centre group (`.center-el`: the ✦ icon and the "Rest state" title under it) breathes with the glow when Icon and title breathe too is on (`@keyframes el-breathe`, over Speed). There are no page timers. Icon and title breathe too sets the group's `animation` to `''` or `'none'` as today; its line that set `animationPlayState` goes, because the "css" Pause holds it.
- **Slow motion:** css
- **Reduced motion:** the demo's rule `.glow,.glow2,.center-el{animation-duration:60s!important}` goes (see the preamble).
- **Stage font:** site font.
  - `.center-title` drops Georgia and the italic and gets `font-weight:700`.
- **Stage:** the glow layers, the ✦ icon and the "Rest state" title stay. The "Breathing glow" label between them goes, with its `.center-label` rule: it sits in the middle of the glow, about 2:1 against the default blue at the breath's peak and nearly gone on a white glow, and it repeats the page's title. `hb-dots`: no. Default height.
- **Title contrast:** the white title sits in the glow too. Measured at the breath's peak on a 343×300 stage, it stays at least 5.9:1 on the default settings with every color but White (3.9:1). With the largest glow, the biggest swing and the second glow on, it is still at least 4.5:1 on every color but White, which falls to 2.7:1. So Glow color leaves out White: a white glow behind white text cannot work.
- **Phone fallback:** none needed. One or two blurred circles (at most 510px across before they grow) change only their size and opacity.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons | Slow · Normal · Fast | Normal | Four to six seconds feels like a calm breath. | `--glow-dur`: 8s / 5s / 3s |
| How much it grows | Choice buttons | A little · Medium · A lot | Medium | Big swings look alarming rather than calm. | `--glow-min` and `--glow-max`: 0.8 and 1.2 / 0.6 and 1.5 / 0.45 and 1.8 |
| Glow color | Swatches (the site palette without White) | Pink · Blue · Purple · Green · Orange | Blue | The color of the glow. | `--glow-color`: `#ff6f8b` / `#58a6ff` / `#d2a8ff` / `#56d364` / `#ffa657` |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Glow size | Choice buttons | Small · Medium · Large | Medium | How big the glow is before it grows. | `--glow-size`: 180px / 260px / 340px |
| Second glow | Switch | on / off | off | A larger, fainter glow breathes out of step. | the second glow's `display`: block / none |
| Icon and title breathe too | Switch | on / off | on | The icon and its title swell very slightly each breath. | the centre group's (`.center-el`) `animation`: `''` / `'none'` |

- **Removed:**
  - The note.
  - The panel's Pause button. The player bar's Pause replaces it.
  - The Cycle Duration slider. It becomes Speed.
  - The Min Scale and Max Scale sliders. They become How much it grows, which sets both.
  - The Glow Size slider. It becomes Glow size.
  - The colour picker. It becomes the Glow color swatches (without White; see Title contrast).
  - The "Breathing glow" label in the middle of the stage (see Stage).
  - "Double glow (two layers)" becomes Second glow; "Element breathes too" becomes Icon and title breathe too, which names what it moves.
- **Good for:** Idle states · Voice assistants · Meditation apps · Media players · **Avoid on:** Alerts · Busy screens
- **Prompt:**

  > Add a breathing glow behind [the icon or element that should look alive but at rest]. Place a soft, round, blurred glow of color behind it, and make it slowly grow and brighten, then shrink and dim, over and over, easing gently at both ends like a calm breath. Four to six seconds a breath feels relaxed; much faster feels anxious. When the settings include it, let the element itself swell very slightly with the glow. If the visitor has reduced motion turned on, keep the glow still. Match the settings listed below.

- **README What it is:** rewritten:

  > A breathing glow is a soft, round glow of color that slowly grows and brightens, then shrinks and dims, over and over, like someone breathing calmly. A cycle of four to six seconds matches a relaxed breath. It sits behind things that are alive but at rest, such as a paused music player, an idle voice assistant or a meditation timer.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Speed | Normal | How long one breath takes: slow is 8s, normal 5s and fast 3s; 4 to 6 seconds feels relaxed, 2 seconds anxious |
  | How much it grows | Medium | How far the glow shrinks and grows: a little is 80% to 120% of its size, medium 60% to 150% and a lot 45% to 180% |
  | Glow color | Blue | The color of the glow: pink, blue, purple, green or orange (white would hide the white title at the breath's peak) |
  | Glow size | Medium | The glow's size before it grows: small is 180px, medium 260px and large 340px |
  | Second glow | off | A larger, fainter glow breathes the other way over a longer cycle, so the two never line up |
  | Icon and title breathe too | on | The icon and the title under it swell by 2% with each breath, too little to notice consciously |

- **README See also:** the first two link texts change to the pages' real titles.
  - [Ambient Ripple Effect](../ambient-ripple/) — rings spread out instead of a glow swelling
  - [Mesh Gradient Animation](../mesh-gradient/) — soft color drifting across a whole background
  - [Floating Elements](../floating-elements/) — shapes that drift and slowly fade in and out
- **README How it works:** unchanged
- **README Production notes:** unchanged
- **Category line:** `07.08 · Ambient &amp; Background`
- **Pager:** Previous: Starfield / Space Particles (`../starfield/`) · Next: Ambient Ripple Effect (`../ambient-ripple/`)

---

## ambient-ripple — Ambient Ripple Effect

- **Kind:** loop. Rings keep spreading, forever.
- **Description:** Rings spread from a few spots, like drops on a still pond. Best for hero areas.
- **Watch it help line:** default
- **Player bar:** Pause (page) · Slow motion (page)
- **Sequence:** the canvas loop as in the preamble, with the page's own clock `clock` (ms). Each drawn frame (at most one per 16ms, as today) adds the time since the last frame to `clock`, at most 50ms and nothing on the first frame after a start. Then:
  - `advance()` drifts the sources when Sources drift is on (one step a frame).
  - A source whose `nextEmit` has come adds a ring born at `clock`, and its next ring is due one Time between ripples later (up to 40% earlier or later at random when Uneven timing is on).
  - Rings older than their life (Speed) go.
  - `draw()` clears the canvas and draws the source dots and every ring from `clock` (its radius and fade come from its age).

  Rings' birth times and `nextEmit` use `clock` instead of `performance.now()` and the frame time. So Pause holds every ring exactly where it is, and Play carries on without rings jumping ahead or vanishing. Today a paused ring kept ageing by the wall clock.

  **The first picture:** `initSources()` first empties `rings`, then gives each source three rings born 0.3, 0.6 and 0.9 ring lives ago (today's `paintStatic()` picture, which only reduced motion saw), and the page draws one frame at load. So the stage opens with ripples already spreading, and a loop paused on arrival shows them. Emptying `rings` first means a resize or a new Number of sources never piles new rings on the old ones.

  **While paused,** every setting change calls `draw()`, so a new color, size or thickness shows at once; a new Number of sources calls `initSources()` first. This replaces today's `document`-wide `input` and `change` listeners, which repainted `paintStatic()`. **After a real resize** (see the preamble), `resize()` calls `initSources()` and `draw()`, playing or paused.
- **Slow motion:** while the switch is on, `clock` advances by a third of each frame's time, and the sources drift a third of a step. Rings grow, fade and are sent out three times slower. From the next frame.
- **Reduced motion:** the page's `REDUCED` checks and `paintStatic()` go (see the preamble).
- **Stage font:** site font, on the card as in the preamble.
- **Stage:** the canvas and the centred card stay.
  - Card text: eyebrow "Ambient ripple"; title "Something is alive here"; body "Like drops on a still pond, or a sonar ping: it hints that something is there." (was "… ECG monitors, sonar pings — suggests presence without interaction.").
  - The card moves from the middle to the bottom, at every size: `.fg-card{top:auto;bottom:28px;transform:translateX(-50%)}`, with `bottom:12px` on phones. Today it sits over all three ripple sources, which are 35%, 50% and 65% across and 25–75% down. With the preamble's phone card rules it covers 75–96% of a 343×300 phone stage, below every source. On a 960×440 laptop stage it covers 63–94%, so the middle source is sometimes just behind its top edge; that source's rings still spread well past the card.
  - `hb-dots`: no. Default height.
- **Phone fallback:** none needed. A few thin circles a frame, on a canvas that caps the pixel ratio at 2 (0.8 ms a frame, measured on today's phone stage).

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long each ring takes to spread and fade. | `LIFE`: 4s / 2.5s / 1.5s |
| Time between ripples | Choice buttons | Short · Medium · Long | Medium | How often each spot sends out a new ring. | `INTERVAL`: 1.8s / 3s / 5s |
| Ripple size | Choice buttons | Small · Medium · Large | Medium | How far each ring spreads before it fades. | `MAX_R`: 100px / 160px / 250px |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Number of sources | Choice buttons | 1 · 3 · 5 | 3 | One spot feels focused; five feel like rain. | `SRCS`: 1 / 3 / 5, then `initSources()` |
| Ring thickness | Choice buttons | Thin · Medium · Thick | Medium | The width of each ring's line. | `THICK`: 1 / 1.5 / 3 (px) |
| Ring color | Swatches | Pink · White · Blue · Purple · Green · Orange | Blue | The color of the rings. | `COLOR`: [255,111,139] / [244,244,242] / [88,166,255] / [210,168,255] / [86,211,100] / [255,166,87] |
| Uneven timing | Switch | on / off | on | Slightly random gaps feel natural, not mechanical. | `IRR` true / false |
| Sources drift | Switch | on / off | off | The spots slowly wander around the stage. | `DRIFT` true / false |

- **Removed:**
  - The note.
  - The panel's Pause button. The player bar's Pause replaces it.
  - The Source Count, Emit Interval, Max Radius, Ring Life and Ring Thickness sliders. They become Number of sources, Time between ripples, Ripple size, Speed and Ring thickness.
  - The colour picker. It becomes the Ring color swatches.
  - "Irregular timing" becomes Uneven timing; "Sources drift slowly" becomes Sources drift.
- **Good for:** Hero sections · Live and connected states · Maps and places · Meditation apps · **Avoid on:** Buttons · Alerts
- **Prompt:**

  > Add an ambient ripple background to [the section or status you want to feel alive]. Pick a few spots and let each one send out a ring every so often that grows from nothing and gets fainter as it spreads until it disappears, so several rings overlap like drops on a still pond. It runs by itself, never on clicks. When the settings ask for uneven timing, vary the gaps slightly, because perfectly regular rings feel like a clock. If the visitor has reduced motion turned on, show a few still rings. Match the settings listed below.

- **README What it is:** rewritten:

  > An ambient ripple sends rings out from a few spots, over and over, like drops falling on a still pond or the ping of a sonar screen. Each ring grows from nothing and fades as it spreads, and the next one starts before it is gone, so the rings overlap into a gentle, steady pulse. It runs on its own rather than answering a click, and hints that something is alive there.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Speed | Normal | How long each ring takes to spread and fade: slow is 4s, normal 2.5s and fast 1.5s |
  | Time between ripples | Medium | How often each spot sends out a ring: short is every 1.8s, medium 3s and long 5s |
  | Ripple size | Medium | How far each ring spreads: small is 100px, medium 160px and large 250px; big rings look calmer with a slow speed |
  | Number of sources | 3 | One spot feels focused; three spread across the stage; five feel like rain on water |
  | Ring thickness | Medium | The width of each ring: thin is 1px, medium 1.5px and thick 3px |
  | Ring color | Blue | The color of the rings |
  | Uneven timing | on | Each gap is up to 40% longer or shorter, at random, so the rings never tick like a clock |
  | Sources drift | off | The spots slowly wander around the stage |

- **README See also:** the second link's text changes to the page's real title.
  - [Click / Tap Ripple](../../04-micro-interactions/click-ripple/) — a ripple that answers a click instead
  - [Breathing / Pulsing Glow](../breathing-glow/) — one glow that grows and shrinks instead of rings
  - [Abstract Geometric Motion](../abstract-geometric-motion/) — its Rings pattern spreads rings from the center
- **README How it works:** the snippets use the demo's clock:
  - In the `Ring` constructor, the comment on `this.born = now;` becomes `// the page's own clock, which stops while paused`, and the comment on the next line goes.
  - In `scheduleEmit`, `performance.now()` becomes `clock`.
  - After the first snippet, add: "`now` is the page's own clock: each frame adds the time since the last one (a third of it in slow motion), and it stops while the animation is paused, so rings freeze in place and carry on without jumping."
- **README Production notes:** unchanged
- **Category line:** `07.09 · Ambient &amp; Background`
- **Pager:** Previous: Breathing / Pulsing Glow (`../breathing-glow/`) · Next: Floating Elements (`../floating-elements/`)

---

## floating-elements — Floating Elements

- **Kind:** loop. The shapes drift forever.
- **Description:** Small shapes drift slowly, each on its own path. Best for hero backgrounds.
- **Watch it help line:** default
- **Player bar:** Pause (page) · Slow motion (page)
- **Sequence:** the loop as in the preamble, moving elements rather than drawing on a canvas. Each frame:
  - it adds Speed × 0.005 to `t`;
  - when Shapes turn is on, it turns each shape by its own step (`e.rot += e.rotSpd`);
  - then `place()` writes every shape's `transform` and `opacity` for the current `t`, as today's loop body does, including the push away from the pointer.

  `place()` also runs at the end of `rebuild()`. So the shapes are in place at load, playing or paused; today they sit in the stage's top-left corner until the first frame. It also runs after any setting change while paused.
- **Slow motion:** while the switch is on, each frame adds a third of the usual step to `t` and to each shape's turn, from the next frame.
- **Reduced motion:** the page's `REDUCE` checks and the rule `.el{animation:none!important;transition:none!important}` go (see the preamble).
- **Stage font:** site font, on the card as in the preamble.
- **Stage:** the shapes layer and the centred card stay.
  - Card text: eyebrow "Floating elements"; title "No two shapes move together" (was "5–12 shapes is the sweet spot", which a setting can now contradict); body "Each shape follows its own slow path, so the motion never looks mechanical." (was about amplitude, frequency and phase).
  - `hb-dots`: no. Default height.
- **Phone fallback:** none needed. At most 14 small shapes, moved with `transform` and `opacity` (2.9 ms a frame, measured on today's phone stage).
- **Touch:** the stage's `pointerdown` also sets the pointer's position (today only `pointermove` does, so a tap did nothing). With Shapes avoid the pointer on, a finger resting on the stage pushes the shapes aside. `pointerleave` and `pointercancel` still clear it.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Number of shapes | Choice buttons | Few · Medium · Many | Medium | 5 to 12 shapes feels calm; more gets busy. | `COUNT`: 5 / 8 / 14, then `rebuild()` |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How fast the shapes drift. | `SPD`: 0.3 / 0.5 / 0.8 |
| How far they drift | Choice buttons | Short · Medium · Long | Medium | How far each shape wanders from its place. | `RANGE`: 30 / 50 / 90 (px), then `rebuild()` |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Shapes | Choice buttons | Circles · Squares · Rings · Mixed | Mixed | The kind of shapes that float. | `SHAPE`: `'circles'` / `'squares'` / `'rings'` / `'mixed'`, then `rebuild()` |
| Colors | Choice buttons | Cool · Warm · Gray · Neon | Cool | The set of colors the shapes use. | `PAL`: `'cool'` / `'warm'` / `'mono'` / `'neon'`, then `rebuild()` |
| Shapes turn | Switch | on / off | on | Each shape slowly spins as it drifts. | `ROT` true / false |
| Fades in and out | Switch | on / off | on | Each shape slowly brightens and dims. | `PULSE` true / false |
| Shapes avoid the pointer | Switch | on / off | off | Shapes near your pointer or finger slide aside. | `REACT` true / false |

- **Removed:**
  - The note.
  - The panel's Pause button. The player bar's Pause replaces it.
  - The Rebuild button. The settings that change the shapes rebuild them, and a fresh arrangement is not a setting.
  - The Count, Drift Speed and Drift Range sliders. They become Number of shapes, Speed and How far they drift.
  - The Shape Mix and Palette menus. They become Shapes and Colors.
  - "Subtle rotation" becomes Shapes turn; "Opacity pulse" becomes Fades in and out; "Mouse repulsion" becomes Shapes avoid the pointer.
- **Good for:** Hero backgrounds · Landing pages · Onboarding screens · Empty states · **Avoid on:** Busy layouts · Long reading pages
- **Prompt:**

  > Add floating shapes to [the section you want a gentle moving background behind]. Scatter a handful of small, see-through circles, squares or rings, and move each one slowly around its own starting point on a smooth, looping path, giving every shape its own speed, distance and starting point so no two ever move in step. Keep them behind the content and let clicks pass through. When the settings include it, shapes slide away from the pointer, or from a finger on touch screens. If the visitor has reduced motion turned on, keep the shapes still. Match the settings listed below.

- **README What it is:** rewritten:

  > Floating elements are small, see-through shapes, such as circles, squares or rings, that drift slowly around a background. Each shape follows its own smooth, looping path, with its own speed, distance and starting point, so no two ever move in step. That independence is what makes it look like a living background rather than a screensaver.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Number of shapes | Medium | Few is 5, medium 8 and many 14; 5 to 12 feels calm, more gets busy |
  | Speed | Normal | How fast the shapes drift: slow is 0.3, normal 0.5 and fast 0.8 |
  | How far they drift | Medium | How far each shape wanders from its place: short is up to 30px, medium 50px and long 90px |
  | Shapes | Mixed | Circles, squares, rings or a mix |
  | Colors | Cool | Cool blues and purples, warm oranges and reds, grays, or bright neon |
  | Shapes turn | on | Each shape slowly spins at its own rate as it drifts |
  | Fades in and out | on | Each shape slowly brightens and dims, adding depth |
  | Shapes avoid the pointer | off | Shapes within 120px of the pointer, or of a finger, slide aside |

- **README See also:** the second link's text changes to the page's real title.
  - [Canvas Particle Effect](../../06-3d-advanced/canvas-particle-effect/) — many particles that link up and react to the pointer
  - [Ambient Ripple Effect](../ambient-ripple/) — rings spreading out instead of shapes drifting
  - [Noise-Based Motion](../../06-3d-advanced/noise-based-motion/) — smooth, natural-looking random motion
- **README How it works:** after the mouse repulsion snippet, add: "The pointer's position is taken from `pointerdown` as well as `pointermove`, so on a touch screen a finger resting on the stage pushes the shapes too." The rest is unchanged.
- **README Production notes:** unchanged
- **Category line:** `07.10 · Ambient &amp; Background`
- **Pager:** Previous: Ambient Ripple Effect (`../ambient-ripple/`) · Next: Grid / Dot Pattern Parallax (`../grid-dot-pattern-parallax/`)

---

## grid-dot-pattern-parallax — Grid / Dot Pattern Parallax

- **Kind:** loop. The grid drifts slowly by itself, forever. The pointer steers it while it is over the stage, but nothing waits for the visitor, so it is a loop rather than a do-it page (and the do-it kind is not in this lane's shared files yet).
- **Description:** A dot grid shifts gently against your pointer for depth. Best for tech sites.
- **Watch it help line:** It drifts by itself. Move your pointer over it, or drag a finger sideways across it, and the grid shifts the other way.
- **Player bar:** Pause (page), no Slow motion. The drift moves only a few pixels a second, so a third of that shows nothing new, and the rest of the effect follows the pointer, which slow motion cannot slow.
- **Sequence:** the drift is the loop, on animation frames as in the preamble, with its own clock `clock`. Each frame adds the time since the last frame, at most 50ms and nothing on the first frame after a start. The first layer is placed with today's formula, with the frame time replaced by `clock`:
  - `dx = -sin(clock × 0.0002) × Strength × W × 0.4`
  - `dy = -cos(clock × 0.00014) × Strength × H × 0.3`

  Today the frame time was used directly, so a pause would jump the grid on Play.

  **The pointer takes over,** through Pointer Events in place of today's mouse and touch events (CLAUDE.md asks drags to use Pointer Events):
  - **Mouse:** `pointerenter` with `pointerType === 'mouse'` stops the drift and shows the cursor ring (`hasMouse = true`). `pointermove` from the mouse shifts the grid, the second layer, the ring and the light, as today's `mousemove` does. `pointerleave` from the mouse hides the ring and the light and starts the drift again, from its clock.
  - **Finger or pen:** `pointerdown` stops the drift and shifts the grid toward it; `pointermove` while it is down shifts the grid (the first layer only, as today's `touchmove`); `pointerup` and `pointercancel` start the drift again. These replace today's four touch listeners.
  - **Scrolling:** the stage gets `touch-action:pan-y`, as on 2.5D / Pseudo-3D. A sideways drag stays with the page and steers the grid, while a vertical swipe still scrolls the page (the browser then sends `pointercancel`, and the drift starts again).
  - Only a mouse starts the hover state, so a tap on a phone never shows the cursor ring or the light.

  Each restart happens only while not paused, and Play restarts the drift only when no mouse is over the stage (`hasMouse`). While paused, pointer moves no longer move the grid, the second layer or the light; the cursor ring still follows the mouse, because the stage hides the system cursor.

  **The first picture:** at load the page places the grid where the drift starts (`clock` 0) before the first frame, so Play after a pause on arrival does not jump. A Strength change or a resize while paused places it again for the current `clock`.

  The unused `.auto-drift` class and its `@keyframes auto-pan` go (nothing ever adds the class).
- **Slow motion:** none (see Player bar).
- **Reduced motion:** the `reduceMotion` check in `startAuto()` and the demo's rule (`.pattern-layer{transition:none!important}` and the 300s `.auto-drift`) go (see the preamble).
- **Stage font:** site font, on the card as in the preamble.
- **Stage:** both pattern layers, the light, the cursor ring and the centred card stay.
  - Card text: eyebrow "Dot grid parallax"; title "Move your pointer or finger across it" (was "Move your mouse across the stage"); body "The grid shifts slightly against your pointer: depth you feel more than see." (was "… opposite to your cursor — a depth illusion so subtle you almost don't notice it.").
  - The stage's own rule keeps `cursor:none` (the ring replaces the system cursor over the stage) and gets `touch-action:pan-y` (see Sequence).
  - `hb-dots`: no (the stage is itself a dot grid). Default height.
- **Phone fallback:** none needed. Two tiled background layers are moved with `transform` only (0.4 ms a frame, measured on today's phone stage).

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Pattern | Choice buttons | Dots · Lines · Dots and lines | Dots | The shape of the grid. | shows `pat-dots` / `pat-lines` / `pat-cross` and hides the others (as today) |
| Strength | Choice buttons | Subtle · Medium · Strong | Medium | Under 10% of the pointer's move is felt, not seen. | `str`: 3 / 5 / 10 (% of the stage) |
| Spacing | Choice buttons | Tight · Medium · Wide | Medium | The distance between the dots or lines. | `--dot-gap`: 20px / 28px / 44px |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Pattern color | Swatches | Pink · White · Blue · Purple · Green · Orange | Blue | The color of the dots and lines. | `--dot-color`: `rgba(r,g,b,.25)` and the light's gradient `rgba(r,g,b,.06)` (as today) from `#ff6f8b` / `#f4f4f2` / `#58a6ff` / `#d2a8ff` / `#56d364` / `#ffa657` |
| Second layer | Switch | on / off | off | A sparser layer moves half as far, adding depth. | the second layer's `display`: block / none |
| Light under the pointer | Switch | on / off | on | A faint glow follows your pointer. | `spotOn` true / false (off also hides the light at once, as today) |

- **Removed:**
  - The note, and the line "No mouse? Auto-drifts on touch."
  - The Background colour picker. It does not change the effect, and the stage keeps its near-black `#04060c`.
  - The Pattern menu. It becomes choice buttons.
  - The Dot Spacing and Parallax Strength sliders. They become Spacing and Strength. Strength no longer reaches 0%, which switched the effect off.
  - The pattern colour picker. It becomes the Pattern color swatches.
  - "Two layers (depth)" becomes Second layer; "Spotlight under cursor" becomes Light under the pointer.
  - The unused auto-drift class and its keyframes.
  - The `mouseenter`, `mousemove` and `mouseleave` listeners and the four touch listeners. Pointer Events replace them (see Sequence).
- **Good for:** Tech and developer sites · Hero sections · Dashboards · Portfolios · **Avoid on:** Photo backgrounds · Long reading pages
- **Prompt:**

  > Add a dot grid parallax background to [the section you want a subtle sense of depth behind]. Tile a faint grid of dots or lines behind the content, a little larger than the section, and shift it slightly in the opposite direction to the pointer, so it seems to sit deeper than the content. Keep the shift to a few percent of the pointer's movement, so it is felt more than seen. On touch screens, let it follow a dragging finger the same way, and when nothing is over it, let it drift slowly by itself. If the visitor has reduced motion turned on, keep the grid still. Match the settings listed below.

- **README What it is:** rewritten:

  > A grid or dot pattern parallax places a faint repeating pattern of dots or lines behind the content and shifts it slightly in the opposite direction to the pointer. The shift is tiny, a few percent of the pointer's movement, so the pattern seems to sit a little deeper than the content: depth you feel more than see. When no pointer is over it, the grid drifts slowly by itself. Linear, Vercel and many developer tools use it.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Pattern | Dots | A grid of dots, of lines, or both |
  | Strength | Medium | How far the grid shifts: subtle is 3% of the pointer's movement, medium 5% and strong 10%; under 10% it is felt more than seen |
  | Spacing | Medium | The distance between dots or lines: tight is 20px, medium 28px and wide 44px |
  | Pattern color | Blue | The color of the dots and lines, shown at 25% so they stay faint |
  | Second layer | off | A sparser layer of larger dots shifts half as far, adding real depth between the two |
  | Light under the pointer | on | A faint round glow follows the pointer |

- **README See also:**
  - [Floating Elements](../floating-elements/) — shapes that drift on their own instead
  - [2.5D / Pseudo-3D](../../06-3d-advanced/2-5d-pseudo-3d/) — many layers moving at different depths
  - [Parallax 3D Tilt](../../06-3d-advanced/parallax-3d-tilt/) — a card that tilts toward the pointer
- **README How it works:** the auto-drift snippet follows the demo's clock. It becomes:

  ```js
  let clock = 0, last = null;
  function autoLoop(now) {
    clock += last === null ? 0 : Math.min(now - last, 50);   // the drift's own clock stops while paused
    last = now;
    const dx = -Math.sin(clock * 0.0002)  * STRENGTH * W * 0.4;
    const dy = -Math.cos(clock * 0.00014) * STRENGTH * H * 0.3;
    patternLayer.style.transform = `translate(${dx}px, ${dy}px)`;
    requestAnimationFrame(autoLoop);
  }
  ```

  The heading "**Auto-drift fallback** for touch devices (no mouse hover):" becomes "**Auto-drift** when no pointer is over the stage (and on touch screens between drags):". In the first snippet, `stage.addEventListener('mousemove', e => {` becomes `stage.addEventListener('pointermove', e => {`, and after it add: "Pointer events cover a mouse, a pen and a finger. The demo's stage has `touch-action: pan-y`, so a sideways drag steers the grid while a vertical swipe still scrolls the page, and only a mouse turns on the cursor ring and the light." The rest is unchanged.
- **README Production notes:** unchanged
- **Category line:** `07.11 · Ambient &amp; Background`
- **Pager:** Previous: Floating Elements (`../floating-elements/`) · Next: Abstract Geometric Motion (`../abstract-geometric-motion/`)

---

## abstract-geometric-motion — Abstract Geometric Motion

- **Kind:** loop. The pattern moves forever.
- **Description:** Shapes turn, spread and flow in a calm, endless pattern. Best for music players.
- **Watch it help line:** default
- **Player bar:** Pause (page) · Slow motion (page)
- **Sequence:** the canvas loop as in the preamble. Each drawn frame (at most one per 16ms, as today) runs `advance()`, then `draw()`:
  - `advance()` adds Speed × 0.01 to `t`. For Rings, it also grows every ring by Speed × 2, adds a ring every 0.5 of `t`, and drops rings past the edge; this is today's `updateRings()`, moved out of the drawing.
  - `draw()` paints the background and the chosen pattern for the current `t`; this is today's `render()` without `updateRings()`.

  **The first picture:** the page calls `draw()` at load (the polygons at `t` 0). Choosing Rings seeds six rings spread across the stage (today's `still()` picture, which only reduced motion saw), so the pattern shows at once, playing or paused; choosing another pattern clears the rings, as today.

  **While paused,** every setting change calls `draw()`; `repaint()` becomes `draw()`. After a real resize (see the preamble), `resize()` calls `draw()` at once, playing or paused.
- **Slow motion:** while the switch is on, `advance()` adds a third of the usual step to `t` and to each ring's growth, from the next frame.
- **Reduced motion:** the `RM` checks and `still()` go (see the preamble).
- **Stage font:** no text on the stage.
- **Stage:** only the canvas. The four pattern tabs that sat on top of the stage (`.preset-tabs`, `.ptab`) move to Try it as Pattern. `hb-dots`: no. Default height.
- **Phone fallback:** none needed. At most 20 lines or 10 shapes a frame, on a canvas that caps the pixel ratio at 2 (1.3 ms a frame, measured on today's phone stage).

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Pattern | Choice buttons | Polygons · Rings · Bars · Lines | Polygons | Four patterns, each an endless loop. | `PRESET`: 0 / 1 / 2 / 3 (Rings also seeds six rings) |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | Slow feels calm; keep it slow behind content. | `SPD`: 0.35 / 0.6 / 1.0 |
| Number of shapes | Choice buttons | Few · Medium · Many | Medium | More shapes make a busier pattern. | `CX`: 3 / 6 / 10 |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Colors | Choice buttons | Cool · Warm · Neon · Gray | Cool | The set of colors the shapes use. | `PAL`: `'cool'` / `'warm'` / `'neon'` / `'mono'` |
| Thicker lines | Switch | on / off | off | Bolder lines that stand out more. | `CONTRAST` true / false (line width 1.5 / 0.8) |

- **Removed:**
  - The note.
  - The panel's Pause button. The player bar's Pause replaces it.
  - The pattern tabs on the stage. They become Pattern.
  - The Speed and Complexity sliders. They become Speed and Number of shapes.
  - The Palette menu. It becomes Colors.
  - The Background menu. It does not change the effect, and the stage keeps its near-black `#020408`.
  - "High contrast" becomes Thicker lines, which is what it does.
- **Good for:** Music and media players · Screensavers and kiosks · Loading screens · Art pages · **Avoid on:** Forms · Long reading pages
- **Prompt:**

  > Add an abstract geometric animation to [the section or screen you want a calm moving background in]. Draw simple shapes on a canvas and keep them moving in an endless loop: polygons slowly turning around the center, rings spreading out and fading, slanted bars sliding across, or wavy lines with color flowing along them. Drive everything from one steadily growing time value, so the loop never restarts or jumps. Colors from one family keep it calm. If the visitor has reduced motion turned on, show one still frame. Match the settings listed below.

- **README What it is:** rewritten:

  > Abstract geometric motion is an endless loop of simple shapes that exists just to be watched: polygons slowly turning, rings spreading out from the center, slanted bars sliding by, or wavy lines with color flowing along them. There is no story and nothing to click. Like a screensaver or a music visualizer, it is meant to stay calm and pleasant to look at for a long time.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Pattern | Polygons | Turning polygons, rings spreading from the center, sliding bars, or wavy lines with flowing color |
  | Speed | Normal | How fast everything moves: slow is 0.35, normal 0.6 and fast 1; keep it below 1 behind content |
  | Number of shapes | Medium | How many polygons, bars or lines: few is 3, medium 6 and many 10 (the Lines pattern draws twice as many) |
  | Colors | Cool | Cool blues, warm ambers, bright neon or grays |
  | Thicker lines | off | Draws the lines 1.5px wide instead of 0.8px, so the shapes stand out more |

- **README See also:** the first link's text changes to the page's real title.
  - [Ambient Ripple Effect](../ambient-ripple/) — rings spreading from a few spots, on their own
  - [WebGL Shader Animation](../../06-3d-advanced/webgl-shader-animation/) — patterns drawn by the graphics card
  - [Noise-Based Motion](../../06-3d-advanced/noise-based-motion/) — smooth, natural-looking random motion
- **README How it works:** unchanged
- **README Production notes:** unchanged
- **Category line:** `07.12 · Ambient &amp; Background`
- **Pager:** Previous: Grid / Dot Pattern Parallax (`../grid-dot-pattern-parallax/`) · Next: Particle Constellation (`../particle-constellation/`)

---

## particle-constellation — Particle Constellation

- **Kind:** loop. The dots drift and link forever.
- **Description:** Drifting dots link up with lines whenever they come close. Best for tech sites.
- **Watch it help line:** It moves by itself, and the dots gather toward your pointer or finger. Pause it to look closely, or turn on slow motion to see each part of the movement.
- **Player bar:** Pause (page) · Slow motion (page)
- **Sequence:** the canvas loop as in the preamble. Each drawn frame (at most one per 16ms, as today) runs `step()`, then `draw()`:
  - `step()` moves every dot by its velocity × Speed.
  - With Dots follow the pointer on, a dot within about 160px of the pointer is pulled toward it (today's `d2<26000`, with a pull `f = .04 / d`).
  - The dot's velocity then eases back toward its own cruising velocity, and it bounces off the edges.
  - `draw()` draws the links and the dots, as today.

  **The drift fix (needed for a loop):** today `step()` multiplies each velocity by 0.99 every frame, so the dots stop within about fifteen seconds and the loop stands still. Measured at the default settings: the average step is 0.07px a frame after 2 seconds and 0.0000px after 16 seconds.
  - `init()` stores each dot's starting velocity as its cruising velocity (`p.cvx`, `p.cvy`).
  - `step()` eases toward it: `p.vx += (p.cvx - p.vx) * .01`, and the same for `vy`, in place of `p.vx *= .99`.
  - A bounce points both the velocity and the cruising velocity away from the wall the dot crossed. Past the left or top edge both become positive (`p.vx = Math.abs(p.vx); p.cvx = Math.abs(p.cvx)`), past the right or bottom edge both become negative, and the dot is kept inside, as today's clamp does. Today's `p.vx *= -1` only flips the sign, so a dot the pointer has pulled against a wall, already moving back inward, would be sent straight into the wall again; flipping the cruising velocity the same way would do the same.
  - A pull from the pointer still fades within a second or two, as before, and the drift never dies.

  **The first picture:** the page calls `draw()` after `init()` at load and after a real resize (see the preamble; today every `resize` event, including a phone's address bar sliding, scattered the dots again), so a loop paused on arrival shows the dots and links. **While paused,** every setting change calls `draw()`; Number of dots calls `init()` first.
- **Slow motion:** while the switch is on, the whole movement runs at a third of its speed: the position step (`p.x += p.vx * SPD / 3`, and the same for `y`), the pull toward the pointer (`f / 3`) and the easing (`.01 / 3`). So a slowed dot follows the same path, three times slower, pointer included. From the next frame.
- **Reduced motion:** the demo's rule `.fps-badge,#pause-btn{display:none}` and the `reduce` checks go (see the preamble).
- **Stage font:** no text on the stage.
- **Stage:** only the canvas; the fps badge goes. `hb-dots`: no. Default height.
- **Phone fallback:** today: at most 60 dots on stages narrower than 600px (`effCount()`), because every pair of dots is tested for a link, so the cost grows with the square of the count; and the canvas draws at CSS pixels, not device pixels. Keep both. Measured on a phone stage: 9.5 ms a frame with 15 ms peaks.
- **Touch:** the stage's `pointerdown` also sets the pointer's position (today only `pointermove` does, so a tap did nothing), so a finger resting on the stage draws the dots toward it. `pointerleave` still clears it.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Number of dots | Choice buttons | Few · Medium · Many | Medium | More dots, more links; phones show at most 60. | `COUNT`: 50 / 90 / 140, then `init()` |
| Link distance | Choice buttons | Short · Medium · Long | Medium | How close two dots must be to link up. | `LINK`: 90 / 130 / 180 (px) |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | Slow drifting stays calm. | `SPD`: 0.35 / 0.6 / 1.0 |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Color | Swatches | Cyan · Violet · Mint · Gray | Cyan | The color of the dots and lines. | `COL`: `'cyan'` / `'violet'` / `'mint'` / `'mono'` (the swatches show `#5ad1ff` / `#a882ff` / `#7affc8` / `#dcdce1`, today's `PAL` colors) |
| Dots follow the pointer | Switch | on / off | on | Dots gather where you point or touch. | `MOUSE` true / false |

- **Removed:**
  - The note, and the line "Nodes cap at 60 on small screens for 60fps."
  - The panel's Pause button. The player bar's Pause replaces it.
  - The fps badge.
  - The Node Count, Link Distance and Drift Speed sliders. They become Number of dots, Link distance and Speed.
  - The Color menu. It becomes the Color swatches.
  - "Mouse attraction" becomes Dots follow the pointer.
- **Good for:** Tech and data sites · Hero sections · Network and security products · Loading screens · **Avoid on:** Busy layouts · Long reading pages
- **Prompt:**

  > Add a particle constellation background to [the section you want it behind]. Scatter dots on a canvas, let each drift slowly in its own direction and bounce off the edges, and on every frame join any two dots that are close with a thin line that fades as they move apart, so a network keeps forming and breaking. When the settings include it, let the dots drift toward the pointer, or toward a finger on touch screens. Checking every pair of dots gets slow fast, so use fewer dots on phones. If the visitor has reduced motion turned on, show one still frame. Match the settings listed below.

- **README What it is:** rewritten:

  > A particle constellation is a field of small dots drifting slowly across a background, where any two dots that come close enough are joined by a thin line that fades as they move apart. The lines keep forming and breaking, so the network seems to shift and grow: the "connected dots" background behind many tech and product sites.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Number of dots | Medium | Few is 50, medium 90 and many 140; phones show at most 60, because every pair of dots is checked each frame |
  | Link distance | Medium | How close two dots must be to be linked: short is 90px, medium 130px and long 180px; too long and everything links to everything |
  | Speed | Normal | How fast the dots drift: slow is 0.35, normal 0.6 and fast 1; faster looks agitated |
  | Color | Cyan | The color of the dots and lines: cyan, violet, mint or gray |
  | Dots follow the pointer | on | Dots near the pointer, or a finger, drift toward it and gather there |

- **README See also:** the first link's text changes to the page's real title.
  - [Starfield / Space Particles](../starfield/) — particles that show depth instead of links
  - [Floating Elements](../floating-elements/) — shapes that drift on their own paths
  - [Grid / Dot Pattern Parallax](../grid-dot-pattern-parallax/) — a still grid that shifts against the pointer
- **README How it works:** after the sentence "Optional mouse attraction nudges each node's velocity toward the pointer, so the mesh gathers where the cursor rests.", add: "Each node remembers the velocity it started with and eases back to it every frame, so a pull from the pointer fades away while the slow drift goes on. On touch screens the pointer's position also comes from `pointerdown`, so a resting finger works too." The rest is unchanged.
- **README Production notes:**
  - The "Velocity damping" bullet becomes: "**Velocity easing**: each frame, a node's velocity eases 1% of the way back to the velocity it started with. That keeps pulls from the pointer from building into runaway speeds, and unlike multiplying the velocity by 0.99, which slows every node to a stop within seconds, it never lets the drift die out."
  - The "Reduced motion" bullet becomes: "**Reduced motion**: the demo starts paused, showing one still frame, until the visitor presses Play. In production, show these visitors the still frame."
  - The rest is unchanged.
- **Category line:** `07.13 · Ambient &amp; Background`
- **Pager:** Previous: Abstract Geometric Motion (`../abstract-geometric-motion/`) · Next: Flow Field (`../flow-field/`)

---

## flow-field — Flow Field

- **Kind:** loop. The particles flow forever.
- **Description:** Particles ride invisible currents, leaving fading trails. Best for art pages.
- **Watch it help line:** default
- **Player bar:** Pause (page) · Slow motion (page)
- **Sequence:** the canvas loop as in the preamble. Each drawn frame (at most one per 16ms, as today) runs `frame()`:
  - it dims the canvas with a see-through fill (Trail length), instead of clearing it;
  - it moves every particle one step along the angle of the field under it, and draws that step;
  - it respawns particles that leave the canvas, and adds 0.01 to the field's time `t`.

  **The first picture:** `prerender()` (40 frames at once) runs at load and after every real resize, for every visitor; today only reduced motion saw it. So the stage opens with trails already drawn, and a loop paused on arrival shows them. "Real" matters here: phones fire `resize` each time the address bar slides (about every 130ms while it moves), and restarting the field and redrawing 40 frames each time would visibly jump; `resize()` returns at once unless the stage's size changed (see the preamble).

  **While paused,** a setting change runs `prerender()`, so the change shows; Number of particles calls `init()` first. The picture moves on by those 40 steps, but the loop stays paused.
- **Slow motion:** while the switch is on, each frame moves the particles a third of a step (`SPD / 3`) and adds a third of 0.01 to `t`, from the next frame. The trail fade stays per frame, so the trails look shorter while it is on. Stretching the fade too would leave marks that never fade (the README's warning about very low trail values).
- **Reduced motion:** the `reduce` checks and the rule `.fps-badge{display:none}` go (see the preamble).
- **Stage font:** no text on the stage.
- **Stage:** only the canvas; the fps badge goes. `hb-dots`: no. Default height.
- **Phone fallback:** today: at most 500 particles on stages narrower than 600px (`effCount()`), and the canvas draws at CSS pixels. Keep both. Measured on a phone stage: 500 particles take 3.3 ms a frame, and even 1,400 took 6.8 ms. The README names fill rate on the graphics chip, which this measurement cannot see, as the real limit on phones.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Swirl size | Choice buttons | Small · Medium · Large | Medium | Large swirls look calm; small ones look stormy. | `SCALE`: 20 / 34 / 60 |
| Trail length | Choice buttons | Short · Medium · Long | Medium | How long each particle's trail lingers. | `TRAIL`: 0.12 / 0.06 / 0.04 (not lower: the README warns that very low values leave marks that never fade) |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How far each particle moves every frame. | `SPD`: 0.6 / 1.0 / 1.6 |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Number of particles | Choice buttons | Few · Medium · Many | Medium | More particles fill the currents; phones show at most 500. | `COUNT`: 400 / 900 / 1500, then `init()` |
| Color | Choice buttons | Mint · Ember · Ice · Rainbow | Mint | Rainbow changes color across the stage and over time. | `COL`: `'mint'` / `'ember'` / `'ice'` / `'spectrum'` |

- **Removed:**
  - The note, and the line "Count caps at 500 on small screens."
  - The panel's Pause button. The player bar's Pause replaces it.
  - The fps badge.
  - The Particle Count, Noise Scale, Speed and Trail Persistence sliders. They become Number of particles, Swirl size, Speed and Trail length.
  - The Color menu. It becomes choice buttons; Rainbow is not one color, so these are not swatches.
- **Good for:** Art and creative sites · Hero sections · Loading screens · Data art · **Avoid on:** Busy layouts · Long reading pages
- **Prompt:**

  > Add a flow field background to [the section you want it behind]. Fill a canvas with many particles, give every point a direction that changes smoothly from one spot to the next (smooth random noise does this), and move each particle a small step along the direction under it every frame, so neighbours curve together into currents. Instead of clearing the canvas, cover it with a see-through dark layer each frame, so every particle leaves a trail that slowly fades. Let the directions change slowly over time, and use fewer particles on phones. If the visitor has reduced motion turned on, show one still frame of trails. Match the settings listed below.

- **README What it is:** rewritten:

  > A flow field moves thousands of particles across a canvas, each one steering by the direction of an invisible current under it. The directions change smoothly from one spot to the next, so particles near each other curve together, and the whole surface shows gentle, river-like currents. The canvas is dimmed a little each frame instead of cleared, so every particle leaves a fading trail that traces the flow.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Swirl size | Medium | How large the currents are: the direction turns over about 20px (small), 34px (medium) or 60px (large); larger looks calm, smaller turbulent |
  | Trail length | Medium | How long trails linger: short fades 12% a frame, medium 6% and long 4%; below about 4% trails can leave faint marks that never fade |
  | Speed | Normal | How far each particle moves every frame: slow is 0.6px, normal 1px and fast 1.6px |
  | Number of particles | Medium | Few is 400, medium 900 and many 1,500; phones show at most 500 |
  | Color | Mint | Mint, ember or ice, or rainbow, where the color changes across the stage and over time |

- **README See also:** the second and third link texts change to the pages' real titles.
  - [Particle Constellation](../particle-constellation/) — particles that link up instead of flowing
  - [Aurora / Northern Lights](../aurora/) — flowing bands of color made with blur
  - [Mesh Gradient Animation](../mesh-gradient/) — smooth drifting color with no particles
- **README How it works:** unchanged
- **README Production notes:** the "Reduced motion" bullet becomes: "**Reduced motion**: the demo starts paused, showing about 40 frames drawn at once as a still, settled picture, until the visitor presses Play. The same 40 frames are drawn whenever the page opens, so the stage never starts empty." The rest is unchanged.
- **Category line:** `07.14 · Ambient &amp; Background`
- **Pager:** Previous: Particle Constellation (`../particle-constellation/`) · Next: Synthwave Grid (`../synthwave-grid/`)

---

## synthwave-grid — Synthwave Grid

- **Kind:** loop. The floor rolls toward you forever.
- **Description:** A glowing grid rolls toward you under a striped sun. Best for music and games.
- **Watch it help line:** default
- **Player bar:** Pause (page) · Slow motion (page)
- **Sequence:** the canvas loop as in the preamble. Each drawn frame (at most one per 16ms, as today) adds Speed × 0.02 to `offset` and redraws the sky, the sun and the grid (`frame()`). **The first picture:** `frame()` runs at load. **While paused,** a setting change calls `frame()`. After a real resize (see the preamble), `frame()` runs at once, playing or paused.
- **Slow motion:** while the switch is on, each frame adds a third of the usual step to `offset`, from the next frame.
- **Reduced motion:** the `reduce` checks and the rule `.fps-badge{display:none}` go (see the preamble).
- **Stage font:** no text on the stage.
- **Stage:** only the canvas; the fps badge goes. `hb-dots`: no. Default height.
- **Phone fallback:** none needed. The scene is redrawn at CSS pixels, with the canvas glow (`shadowBlur` 8) on every line: 39 lines at the default (23 toward the horizon and 16 across) and 59 at Many (35 and 24). The default took 1.2 ms a frame, measured on today's phone stage. The README keeps its note on dropping the glow for much denser grids.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How fast the floor rolls toward you. | `SPD`: 0.6 / 1.0 / 1.6 |
| Number of lines | Choice buttons | Few · Medium · Many | Medium | More lines make a finer grid. | `DENS`: 10 / 16 / 24 (the lines across; the lines toward the horizon follow as `2 × round(DENS × 0.7) + 1`: 15 / 23 / 35) |
| Grid color | Swatches | Pink · Cyan · Purple · Orange | Pink | The color of the glowing lines. | `GLOW`: `#ff2fb0` / `#2de2e6` / `#b967ff` / `#ff8a3d` |

**More options**

None: leave out the `details.hb-options` block.

- **Removed:**
  - The note, and the line "Sun and sky bands are static gradients; only the grid animates."
  - The panel's Pause button. The player bar's Pause replaces it.
  - The fps badge.
  - The Scroll Speed and Line Density sliders. They become Speed and Number of lines.
  - The colour picker and its hex readout. They become the Grid color swatches: today's pink, and three other neon colors of the look (the orange is the sun's own).
- **Good for:** Music and gaming sites · Retro themes · Event pages · Hero sections · **Avoid on:** Calm brands · Long reading pages
- **Prompt:**

  > Add a synthwave grid to [the section you want a retro scene in]. Draw a purple sky with a striped, glowing sun on the horizon and, below it, a glowing grid floor in perspective: lines that meet at one point on the horizon, crossed by lines that bunch up near the horizon and spread out toward the viewer. Move the cross lines steadily toward the viewer and wrap them around, fading each one in at the horizon, so the floor rolls forward forever with no visible jump. If the visitor has reduced motion turned on, show the scene still. Match the settings listed below.

- **README What it is:** rewritten:

  > A synthwave grid is a glowing neon floor that stretches to the horizon and rolls steadily toward the viewer, under a purple sky with a striped, glowing sun. It is the retro look of 1980s album covers and arcade games, the 1980s idea of the future, drawn as a loop that never visibly restarts.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Speed | Normal | How fast the floor rolls toward the viewer: slow is 0.6, normal 1 and fast 1.6 |
  | Number of lines | Medium | How many lines the floor has: few is 10 across and 15 toward the horizon, medium 16 and 23, many 24 and 35; more lines make a finer grid |
  | Grid color | Pink | The color of the glowing lines: pink, cyan, purple or orange |

- **README See also:** the first two link texts change to the pages' real titles.
  - [Starfield / Space Particles](../starfield/) — another way of flying forward through space
  - [Scanline Effect](../scanline/) — dark lines that finish the old-screen look
  - [Grid / Dot Pattern Parallax](../grid-dot-pattern-parallax/) — a flat grid that shifts against the pointer
  - [Animated Gradient Background](../animated-gradient-background/) — a gradient like the sky's, moving on its own
- **README How it works:** unchanged
- **README Production notes:** the "Reduced motion" bullet becomes: "**Reduced motion**: the demo starts paused, showing the grid, sky and sun still, until the visitor presses Play. In production, show these visitors the still scene." The rest is unchanged.
- **Category line:** `07.15 · Ambient &amp; Background`
- **Pager:** Previous: Flow Field (`../flow-field/`) · Next: Matrix Rain (`../matrix-rain/`)

---

## matrix-rain — Matrix Rain

- **Kind:** loop. The rain falls forever.
- **Description:** Columns of glowing characters rain down a dark screen. Best for tech themes.
- **Watch it help line:** default
- **Player bar:** Pause (page) · Slow motion (page)
- **Sequence:** the canvas loop as in the preamble. The rain takes one `step()` each time 1000 ÷ (Speed × 3.5) ms of real time has passed (today's accumulator; after a pause it takes at most one step). Each step:
  - it covers the canvas with see-through black (Trail length);
  - it draws a bright leading character, and a dimmer one above it, in every column;
  - it moves each column down a row, and sends it back to the top at random once it is past the bottom.

  The `visibilitychange` stop and restart stay, and restart only while not paused.

  **The first picture:** `paintStatic()` (enough steps to fill the canvas) runs at load for every visitor, after `resize()`; today only reduced motion saw it. So the stage opens full of rain, and a loop paused on arrival shows it.

  **While paused,** a change to Characters, Trail length or Glowing leaders repaints with `paintStatic()`. Speed shows once it plays.

  **Character size and real resizes** start the rain over, playing or paused: `resize()` (new columns, every drop above the top, a black canvas), then `paintStatic()` at once. Today only a paused or reduced-motion page repainted, so a playing page went black and the rain fell from the top again.

  **The first-report wipe:** the page watches its stage with a `ResizeObserver`, which reports once as soon as it starts watching. Today that report runs `refit()`, and about 150ms after load `resize()` clears the rain the visitor has just seen: full rain, then black, then rain falling from the top. `refit()` now returns at once when the stage's `clientWidth` and `clientHeight` equal the size `resize()` last used (`W`, `H`), as the preamble's resize rule says. After a real change it runs `resize()` and then `paintStatic()`, playing or paused.
- **Slow motion:** while the switch is on, the time between steps is multiplied by 3, from the next step.
- **Reduced motion:** the `reduced` checks go, including the one that made Pause do nothing (see the preamble).
- **Stage font:** site font. `step()` sets `ctx.font` to `fontSize + 'px ' + FONT`, where `FONT` is the page's font family, read once (`getComputedStyle(document.body).fontFamily`), in place of the old `--mono` variable. The characters fall; they are not typed, so the typewriter font does not apply. The Japanese characters come from the system's fallback font, as the site font has none.
- **Stage:** only the canvas; the fps badge goes, and so does the `.stage-wrap` around the stage. `hb-dots`: no. Default height.
- **Phone fallback:** today, and kept:
  - columns are at least 14px apart on stages narrower than 600px (11px elsewhere), so there are fewer of them;
  - the canvas caps the pixel ratio at 2;
  - the glow blur is only on each column's leading character.

  Measured on today's phone stage: 1 ms a frame (7 ms on the frames that step).

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons | Slow · Normal · Fast | Normal | Slow is a drizzle; fast is a downpour. | `SPD`: 5 / 8 / 13 (the rain steps Speed × 3.5 times a second) |
| Characters | Choice buttons | Japanese · Binary · Hexadecimal | Japanese | Japanese characters give the film's look. | `SET`: `'kana'` / `'bin'` / `'hex'` |
| Trail length | Choice buttons | Short · Medium · Long | Medium | How long characters linger behind each leader. | `FADE`: 0.12 / 0.07 / 0.04 |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Character size | Choice buttons | Small · Medium · Large | Medium | Larger characters make fewer, wider columns. | `fontSize`: 12 / 16 / 22 (px), then `resize()` |
| Glowing leaders | Switch | on / off | on | The leading character in each column glows. | `GLOW` true / false |

- **Removed:**
  - The note.
  - The panel's Pause button. The player bar's Pause replaces it.
  - The fps badge and the FPS readout.
  - The Speed, Font size and Trail fade sliders. They become Speed, Character size and Trail length.
  - The Characters menu. It becomes choice buttons.
  - "Leader glow" becomes Glowing leaders.
- **Good for:** Tech and hacker themes · Loading screens · Game and event pages · 404 pages · **Avoid on:** Calm brands · Long reading pages
- **Prompt:**

  > Add a matrix rain background to [the section you want it behind]. Split a dark canvas into columns and, at a steady pace, draw a bright character at the head of each column and move it down one row, sending each column back to the top at random once it passes the bottom. Instead of clearing the canvas, cover it with a see-through black layer before each step, so older characters fade into a trail behind each bright leader. Space the columns wider on phones. If the visitor has reduced motion turned on, show one still frame. Match the settings listed below.

- **README What it is:** rewritten (today's text names the canvas element in code):

  > Matrix rain, also called digital rain, is a background of columns of characters falling down a dark screen. The leading character in each column is bright and the ones behind it fade toward black, so each column looks like a glowing head with a fading tail. It became shorthand for "computers at work" after the film The Matrix (1999).

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Speed | Normal | How often the rain moves down a row: slow is about 18 times a second, normal 28 and fast about 46 |
  | Characters | Japanese | Japanese katakana (the film's look), binary 0 and 1, or hexadecimal 0 to F |
  | Trail length | Medium | How long characters linger: short fades 12% a step, medium 7% and long 4% |
  | Character size | Medium | Small is 12px, medium 16px and large 22px; larger characters make fewer columns |
  | Glowing leaders | on | A soft glow around each column's leading character |

- **README See also:** the first two link texts change to the pages' real titles.
  - [Starfield / Space Particles](../starfield/) — another canvas background of moving points
  - [Scanline Effect](../scanline/) — dark lines for the same old-terminal mood
  - [Synthwave Grid](../synthwave-grid/) — a neon grid for a retro-future backdrop
- **README How it works:** unchanged
- **README Production notes:** the "Reduced motion" bullet becomes: "**Reduced motion**: the demo starts paused, showing a screen of rain drawn at once, until the visitor presses Play. In production, show these visitors a still frame." The rest is unchanged.
- **Category line:** `07.16 · Ambient &amp; Background`
- **Pager:** Previous: Synthwave Grid (`../synthwave-grid/`) · Next: Plasma Field (`../plasma/`)

---

## plasma — Plasma Field

- **Kind:** loop. The colors flow forever.
- **Description:** Smooth waves of color flow endlessly, made from math. Best for creative sites.
- **Watch it help line:** default
- **Player bar:** Pause (page) · Slow motion (page)
- **Sequence:** the canvas loop as in the preamble. Each frame adds the time since the last frame (at most 50ms) × Speed to `clock`, and draws the field at that clock (`draw(clock)`).
  - Today's Pause only stopped the clock, while the loop kept drawing the same picture sixty times a second. Now Pause cancels the frame, and Play (`start()`) carries on from the same clock.
  - The `visibilitychange` stop and start stay, and start only while not paused.
  - **The first picture:** `resize()` always ends with `draw(clock)` (today only under reduced motion), so the field shows at load and after every real resize (see the preamble) or Detail change, playing or paused. A Detail change calls `resize()` directly; the window's `resize` event goes through the size check first.
  - **While paused,** Pattern size and Colors call `draw(clock)`.
- **Slow motion:** while the switch is on, the clock advances by a third of each frame's time, from the next frame.
- **Reduced motion:** the `reduce` checks go (see the preamble).
- **Stage font:** no text on the stage.
- **Stage:** only the canvas; the `.stage-wrap` around the stage goes. The stage's own height, `--stage-h:min(64vh,600px)` (52vh on phones), goes. `hb-dots`: no. Default height.
- **Phone fallback:** today the field is computed as a small picture (Detail sets its width) and scaled up, and the canvas caps the pixel ratio at 1.5. Smallest change: on stages narrower than 600px, `resize()` uses a picture at most 140px wide, so High looks like Medium there. In `resize()`, which measures the canvas box as `r`, that is `bw = r.width < 600 ? Math.min(quality, 140) : quality`, and `bh` then comes from `bw` instead of `quality`: `bh = Math.max(1, Math.round(bw * (r.height / r.width)))`. A 140px picture on a 343px stage is already sharper than on a laptop. Measured on a phone stage: Medium takes 6.9 ms a frame, and High 13.2 ms with 19 ms peaks.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons | Slow · Normal · Fast | Normal | Slow drifts calmly; fast churns. | `speed`: 0.6 / 1 / 1.6 |
| Pattern size | Choice buttons | Small · Medium · Large | Medium | Large shapes feel soft; small ones feel busy. | `scale`: 1.6 / 1 / 0.6 |
| Colors | Choice buttons | Neon · Sunset · Ocean · Rose | Neon | The set of colors the field flows through. | `lut = buildLUT(PALETTES.neon / .sunset / .ocean / .mono)` |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Detail | Choice buttons | Low · Medium · High | Medium | Sharper detail costs more; phones use at most Medium. | `quality`: 96 / 140 / 200, then `resize()` |

- **Removed:**
  - The note.
  - The panel's Pause button. The player bar's Pause replaces it.
  - The Speed slider, which could reach zero. It becomes Speed, and Pause now stops the field.
  - The Scale / Zoom slider. It becomes Pattern size.
  - The Palette and Quality menus. They become Colors and Detail. "Mono" is named Rose, which is the color it shows.
- **Good for:** Music and creative sites · Hero sections · Loading screens · Retro themes · **Avoid on:** Serious content · Long reading pages
- **Prompt:**

  > Add a plasma background to [the section you want it behind]. For every point, add up a few waves based on its position and on time (across, down, diagonally and outward from the center) and use the sum to pick a color from a smooth palette, so the whole field flows like liquid color. To keep it fast, draw the field into a small image and scale it up smoothly to fill the section, using a smaller image on phones. If the visitor has reduced motion turned on, show one still frame. Match the settings listed below.

- **README What it is:** rewritten:

  > Plasma is a classic effect from the demoscene, the 1990s community that made art with home computers: a field of color with no hard edges that flows and shifts like liquid. It is made from math alone. Each point's color comes from adding up a few waves, based on its position and on time, so the field keeps moving without any image or video.

- **README Key parameters:** replaces today's table, which has other columns and code names:

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Speed | Normal | How fast the field flows: slow is 0.6 times the base speed, normal 1 and fast 1.6 |
  | Pattern size | Medium | How big the color shapes are: small packs more waves into the field, large makes broad, soft blobs |
  | Colors | Neon | The palette: neon, sunset, ocean or rose |
  | Detail | Medium | How wide the small picture is before it is scaled up: low is 96 pixels, medium 140 and high 200; phones use at most 140 |

- **README See also:** each line gets a phrase (today they have none, which the page checks reject), and the second and third link texts change to the pages' real titles.
  - [Animated Gradient Background](../animated-gradient-background/) — one gradient that slowly shifts, with no script
  - [Mesh Gradient Animation](../mesh-gradient/) — soft blobs of color drift and blend
  - [Aurora / Northern Lights](../aurora/) — bands of color sway like the northern lights
- **README How it works:** unchanged
- **README Production notes:** add a bullet after the first: "On screens narrower than 600px the demo caps the buffer at 140 pixels wide; a phone's stage is small enough that it looks the same." The rest is unchanged.
- **Category line:** `07.17 · Ambient &amp; Background`
- **Pager:** Previous: Matrix Rain (`../matrix-rain/`) · Next: none
