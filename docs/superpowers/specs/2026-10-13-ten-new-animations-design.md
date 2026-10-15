# Ten new animations with See inside and Compare (2026-10-13)

The owner approved ten new techniques on 2026-10-13: the ten ideas left over from the brainstorm that gave the eight special
animations (`2026-10-01-special-animations-design.md`). Each page has Normal · See inside · Compare from the start. The work
starts once the See inside and Compare rollout (`2026-10-13-see-inside-compare-rollout-design.md`) is integrated, so the
switch, the notes, the `hb:mode` listener, `data-hb-caption`, the mode checks and the first-batch reference pages exist by
then, and the Animation finder and Famous effects are on the base branch (branches, the file map and releases:
`2026-10-13-next-projects-coordination.md`, which wins where the two disagree). The handbook grows from 166 to 176; each
page goes at the end of its section, so no page is renumbered. **CLAUDE.md governs every page** as it reads after the
rollout (about 300 lines for the demo plus about 150 for its two views), and **the rollout spec governs both views** (its
section 1 and acceptance list); this document adds what is specific to these ten. Its demos and settings are decisions; a
builder may change one within those rules when the page reads better, and says why in its report. Nothing goes live
without the owner's go-ahead.

## Owner rulings (2026-10-13)

- **The rollout's rulings hold here:** a press of See inside or Compare plays the demo once by itself (Show me on the five
  do-it pages, Replay on Ink Spread Reveal), never under reduced motion, and the four loops stay as they are; where See
  inside shrinks a movement, a faint outline marks where each moving part started; Compare may show a common mistake or a
  small made-up scene where that teaches more (the Compares marked \*); on phones the box keeps its size in every mode.
- **Audio Visualizer's sound:** silent by default, the bars moving to a built-in beat; a Hear it button plays that beat,
  made by the browser, with no file and no microphone (decided: the spec's suggestion A, taken as the coordinator's
  default). The owner judges it by pressing Hear it at the look; the button comes out in one small change if it does not
  please. No question is left open.
- **Order:** these pages come after the rollout and before the tab pass, so they are built without the Finder and Famous
  effects tabs, which that pass adds to all 176 pages.

## The pages

| No. | Slug | Title (h1) | Kind · step 1 | Player bar | Difficulty |
|---|---|---|---|---|---|
| 02.15 | `ink-spread-reveal` | Ink Spread Reveal | once · Watch it | Replay, Loop, Slow motion (`css`) | medium |
| 03.17 | `pixelate-transition` | Pixelate Transition | do · Click it | Show me, Reset, Slow motion | medium |
| 04.42 | `before-after-slider` | Before/After Slider | do · Drag it | Show me, Reset, Slow motion | medium |
| 04.43 | `magnifier-lens` | Magnifier Lens | do · Hover it | Show me, Slow motion | medium |
| 04.44 | `card-deck-swipe` | Card Deck Swipe | do · Drag it | Show me, Reset, Slow motion | hard |
| 06.27 | `water-ripple` | Water Ripple | do · Drag it | Show me, Reset, Slow motion | hard |
| 06.28 | `audio-visualizer` | Audio Visualizer | loop · Watch it | Pause, Slow motion | hard |
| 07.24 | `ken-burns` | Ken Burns Effect | loop · Watch it | Pause (`css`), Slow motion (`css`) | easy |
| 07.25 | `fire-effect` | Fire Effect | loop · Watch it | Pause, Slow motion | medium |
| 07.26 | `lightning` | Lightning | loop · Watch it | Pause, Slow motion | medium |

**Previous / Next.** Each section's chain runs in the table's order. The first new page's Previous is its section's current
last page, which gains its first Next link: Shatter Effect (02.14), Cube Transition (03.16), Dynamic Island (04.41), Infinite
Zoom (06.26), Game of Life (07.23). The last new page of each section has no Next.

## What all ten share

- **Starting points:** the closest page of the same kind (CLAUDE.md), the closest pages in technique (named last in each
  section) and, for both views, the rollout's first-batch page: Fade In / Fade Out (02), Overlay Wipe (03), Magnetic Button
  (04), Flow Field for every split canvas (one canvas, each half clipped).
- **Top bar:** copy a neighbor's as it is; the tab pass adds Finder and Famous effects to all 176 pages afterwards.
- **Pictures:** drawn in the page (inline SVG or canvas commands); no image, sound or font file is added. No page gets a
  "Shows the …" switch: See inside does that job. Made-up names only, no real brand, place or person.
- **Motion and phones:** transform and opacity, or a canvas; frame loops by elapsed time; Fire Effect and Water Ripple take
  fixed steps from an accumulator (Cloth Simulation's loop). Reduced motion is read inside every frame loop (Chrome sends no
  `change` event to a loop that reads `matchMedia(…).matches` each frame). Show me runs two to four seconds and ends at rest.
  Buttons and handles drawn in the box are 44px, checked by hand; the box keeps its size in every mode (rulings above).
- **Both views:** as the rollout's section 1 says, captions marked `data-hb-caption`; posed stills under reduced motion and
  wherever Compare's halves would rest alike. Compares marked \* show a common mistake or a made-up scene (rulings above);
  a mode press plays the demo once as the rulings say.
- **Words and README:** no code on the page, plain words, American spelling; no lesson line or link (the learning path is
  paused). In Try it below, each default is in bold. README: the six sections and `[Live demo](…)`; Key parameters one row
  per Try it setting, each choice's demo value in plain words; See also two to four pages (the closest pages, each other).

## 1 · Ink Spread Reveal (02.15)

- **Card:** "Ink drops spread and merge until the picture shows. Best for art and intros." Places `imgcard`, `intro`; finder
  `card page` · `load scroll click` · `reveal grow`. **Good for** Art and portfolio sites · Page intros · Featured
  pictures. **Avoid on** Forms · Rows of small pictures.
- **Demo:** a drawn picture (a mountain by the sea) under paper. Three drops land in turn and spread as blots with uneven,
  feathery edges and splash dots, merging until the picture shows; each grows fast, then slows, like ink soaking in. The
  blots are paths in an SVG mask, made once from a circle whose radius wobbles with seeded noise and grown by CSS scale
  animations; a dark copy, slightly larger, runs ahead as the ink edge. Loop holds the picture, fades it back to paper, plays.
- **Try it:** Where the ink lands: One drop · **Several drops** · From a corner, "Where the first drops fall." Speed: Slow ·
  **Normal** · Fast, "How long the ink takes to cover it." Edge: Smooth · **Ragged** · Splashy, "Splashy throws small drops
  around each blot." More options: Dark ink edge (switch, on), "A dark rim runs just ahead of the picture."
- **Prompt (113 words):** "Add an ink spread reveal to [the picture or section you want to uncover]. Start with it hidden
  under a plain paper-colored layer, then let drops of ink land and spread outward as blots that merge until the whole
  picture shows. Each blot grows quickly at first and slows as it soaks in, like ink on damp paper. Give the blots uneven
  outlines, as rough as the settings choose, and grow each one by scaling its shape, not redrawing it; when the settings
  include it, run a dark ink edge just ahead of the picture. If the visitor has reduced motion turned on, fade the picture
  in instead. Match the settings listed below."
- **See inside:** the mask made visible: the hidden picture faint underneath, each blot outlined and numbered in the order it
  lands, its final size dashed, the ink edge as its own ring. Captions "1 · lands first", "Dashed: where it stops", "Faint:
  still hidden" (Clip-Path Reveal shows one window; here numbered blots and their targets lead).
- **Compare:** "Clean circles" / "Ink blots": the same drops at the same times, round and edgeless on the left; with Edge
  Smooth and no ink edge they match, and the note says so. Note: "On the left the drops grow as clean circles, which looks
  neat and mechanical. On the right ragged blots spread and merge, which looks like ink."
- **Still, phones, speed:** reduced motion fades the picture in; stills hold halfway. Fewer splash dots on phones. If frame
  times measured with Chrome's CPU slowed four times miss 60 fps, the blots move from the SVG mask to a canvas.
- **Preview:** dark blots scale up on paper and merge as a colored picture fades in. **Closest:** Clip-Path Reveal (clean
  shapes), Circle Reveal (one circle from a click); here several organic blots merge.

## 2 · Pixelate Transition (03.17)

- **Card:** "The page breaks into big pixels, then sharpens into the next. Best for galleries." Places `page`, `imgcard`;
  finder `page card` · `newpage click` · `pieces glitch`. **Good for** Photo galleries · Game and retro sites · Slideshows.
  **Avoid on** Everyday navigation · Text-heavy pages.
- **Demo:** a small gallery site: page names at the top (Home · Work · About, buttons outside the canvas), each page a drawn
  picture with a title on a canvas. A click breaks the page into growing square blocks of flat color, swaps it while they
  are biggest, then shrinks them until the new page is sharp (about 0.8 s): each frame draws the page tiny, one pixel per
  block, and back up with smoothing off. Pages are drawn once to hidden canvases (titles once the site font has loaded);
  nothing is drawn between changes. Show me goes to the next page and back; Reset returns to Home.
- **Try it:** Block size: Small · **Medium** · Large, "How big the squares get mid-change." Speed: Slow · **Normal** · Fast,
  "How long the change takes." How the blocks change: **Smoothly** · In steps, "In steps looks like an old game console."
- **Prompt (117 words):** "Add a pixelate transition to [the pictures or views you switch between]. When the visitor moves to
  the next one, break the current picture into square blocks that grow larger, swap to the new picture while the blocks are
  at their largest, then shrink the blocks until the new picture is sharp again. Make each block one flat color by drawing
  the picture very small on a canvas and scaling it back up with smoothing turned off. Keep the page names and buttons
  outside the pixelated area so they stay readable, and draw only while a change runs. If the visitor has reduced motion
  turned on, use a short, plain fade instead. Match the settings listed below."
- **See inside:** an inset shows the tiny picture the blocks come from, each pixel a square ("Small copy · one pixel per
  block"), an arrow to the box ("Scaled up, smoothing off"), the block grid over the box, and a strip of block size over the
  change with a moving dot, its top marked "Swap here". At rest they show the medium size.
- **Compare:** "Cuts at once" / "Pixelates": one click drives both; the left swaps when the right's blocks are biggest, and at
  rest the right holds that moment beside the page the left cut to. Note: "On the left the page swaps in a blink. On the
  right it breaks into blocks, swaps while it cannot be read, then sharpens, so the cut is hidden."
- **Still, phones, speed:** reduced motion is a short plain fade; stills as at rest. Two small drawings a frame, only during a
  change; canvas pixels capped at twice the screen's.
- **Preview:** a picture becomes a mosaic of squares, then another, which sharpens into a second picture (opacity steps).
  **Closest:** Dissolve Transition (tiles in an order), Blur Transition (focus out and in), ASCII / Halftone (drawn small).

## 3 · Before/After Slider (04.42)

- **Card:** "Drag a line across two pictures to compare them. Best for photo edits." Places `imgcard`; finder `card` · `drag`
  · `reveal slide`. **Good for** Photo edits · Redesigns · Renovations · Product upgrades. **Avoid on** Small thumbnails ·
  Unrelated pictures.
- **Demo:** one drawn harbor scene twice, stacked: Before gray and flat, After in full color, divided by a line with a
  handle. Dragging anywhere on the pictures moves it; a tap glides it there. The After picture sits in a window that slides
  with the line while the picture inside slides back by the same amount, so it never moves (two transforms, no repaint).
  The handle is a slider (`role="slider"`, read as "60% After"): arrows move it a twentieth, Page Up and Page Down a quarter,
  Home and End to the ends. Show me glides it to 80%, 20% and back (3 s); Reset centers it.
- **Try it:** Split: **Left and right** · Top and bottom, "Which way the line runs." Handle: **Knob** · Bar · Line only, "A
  knob tells people they can drag." Shows labels (switch, on), "Before and After fade as the line covers them."
- **Prompt (117 words):** "Add a before-and-after slider to [the two pictures you want to compare]. Stack the pictures
  exactly on top of each other and show the top one only up to a dividing line with a handle, so each side of the line shows
  one picture. Dragging on the pictures moves the line, and a tap jumps it there. Uncover the top picture with a clip or a
  sliding window, never by resizing it, so neither picture moves or squeezes. Use pointer events for mouse and touch, keep
  page scrolling free on phones, and let the arrow keys move the handle. If the visitor has reduced motion turned on, move
  the line without gliding. Match the settings listed below."
- **See inside:** the two pictures pulled apart in depth, Before at the back, After in front with its hidden part faint and
  its window dashed, the line on the window's edge. Captions "Before · whole, underneath", "After · shows only in the
  window", "Window · slides with the line". Dragging, keys and Show me keep working.
- **Compare\*:** "Resizes it" / "Uncovers it": the left squeezes the After picture into the space beside the line, a common
  mistake; one line drives both. Note: "On the left the top picture is resized with the line, so it squeezes. On the right
  it is only uncovered, so both pictures stay put."
- **Still, phones, speed:** reduced motion: the line jumps to taps and keys, Show me steps it with pauses; stills at 70%.
  Left and right keeps page scrolling free (`touch-action: pan-y`); Top and bottom drags by the handle only.
- **Preview:** a gray-and-color landscape, the line and knob sweeping left and right. **Closest:** Swipe to Dismiss (drag,
  Show me), Liquid Glass (drag, arrow keys), Clip-Path Reveal (uncovers once, by itself); here the visitor holds the divider.

## 4 · Magnifier Lens (04.43)

- **Card:** "A lens follows your pointer and shows the picture up close. Best for product photos." Places `imgcard`; finder
  `card` · `hover drag` · `follow grow`. **Good for** Product photos · Maps · Artwork · Detailed plans. **Avoid on** Small or
  plain pictures.
- **Demo:** a detailed drawing (a watch face with fine print) fills the box; a round lens with a thin rim and a soft shadow
  follows the pointer, showing the spot under it enlarged. Inside the lens a second, bigger copy of the drawing (vector, so
  sharp; a larger image in production) moves the other way, so the pointer's spot sits in the lens's middle; both moves are
  transforms. The lens grows in on arrival and shrinks away on leaving. Show me glides it over three details (3 s).
- **Try it:** Zoom: 2 times · **3 times** · 4 times, "How much bigger things look in the lens." Lens size: Small · **Medium**
  · Large, "A bigger lens shows more around the spot." Lens shape: **Round** · Square, "Square suits maps and plans."
- **Prompt (117 words):** "Add a magnifier lens to [the product photo or detailed picture people want to inspect]. While the
  pointer is over the picture, show a lens there holding an enlarged copy, placed so the spot under the pointer sits in the
  middle of the lens. Fill the lens from a larger, sharper version of the picture, never the same small one stretched, and
  move the lens and the copy with transforms only. On touch screens, show it while a finger is down, just above the finger;
  from the keyboard, show it on focus and move it with the arrow keys. If the visitor has reduced motion turned on, let it
  appear without growing. Match the settings listed below."
- **See inside:** zoomed out so every part fits: the picture, the bigger copy drawn whole but faint and outlined, sliding the
  other way as the lens moves, the lens as a round window onto it, a cross on the pointer's spot. Captions "Bigger copy ·
  slides the other way", "Lens · a window onto the copy", "Pointer". At rest the lens waits in the middle.
- **Compare\*:** "Stretched copy" / "Bigger copy": the left lens enlarges a small bitmap of the drawing, so it blurs; one
  pointer moves both, and at rest both wait on one detail. Note: "On the left the lens stretches the small picture, so the
  detail blurs. On the right it shows a bigger copy, so the detail stays sharp."
- **Still, phones, speed:** reduced motion: no grow or glide, Show me jumps between details. Focus shows the lens in the
  middle, the arrows move it (Shift for bigger steps), Escape hides it; on touch it shows above the finger (`touch-action:
  none`). Set the copy's scale before its layer is promoted, or it is drawn small and blurs.
- **Preview:** a tiny map; a round lens glides along a path with a bigger copy inside. **Closest:** Spotlight Hover Glow and
  Cursor Follower (pointer, keyboard), Liquid Glass (bends at its rim), Image Distortion on Hover (warps near the pointer).

## 5 · Card Deck Swipe (04.44)

- **Card:** "Swipe the top card left or right; the next one rises. Best for quick choices." Places `imgcard`; finder `card` ·
  `drag click` · `slide turn`. **Good for** Matching apps · Product pickers · Flashcards · Quick polls. **Avoid on** Lists
  people compare · Choices that need care.
- **Demo:** a pile of five drawn profile cards (a picture, a made-up name, two lines). The top card follows a drag and turns
  around a point below its bottom edge; a green Like or red Nope stamp fades in with the distance. Past the swipe distance,
  or with a flick, it flies off that side and the card behind grows from 95% into place; short of it, it springs back. Round
  Nope, Like and Undo buttons under the pile do the same from the keyboard (Left and Right too, with the top card focused);
  an empty pile refills. Show me: a drag that springs back, a throw left, then Undo (about 3.5 s); Reset rebuilds the pile.
- **Try it:** How far to swipe: Short · **Medium** · Long, "How far to drag before letting go sends it." How much it turns:
  None · **A little** · A lot, "As if held at the bottom edge." Shows stamps (switch, on), "Like and Nope fade in as you
  drag." More options: Cards behind: **Peeking** · Fanned · Hidden, "How the waiting cards show."
- **Prompt (124 words):** "Add a swipeable card deck to [your stack of cards, such as profiles or products]. Pile the cards
  with the waiting ones behind the top one, showing as the settings choose. While dragged, the top card follows the finger
  and turns as the settings choose, as if held at its bottom edge, and Like or Nope stamps fade in when the settings include
  them. On release, send it off that side if it went far enough or was flicked; otherwise spring it back, and grow the next
  card into place. Use transforms and pointer events, and add Nope, Like and Undo buttons for keyboards. If the visitor has
  reduced motion turned on, fade cards out instead of throwing them. Match the settings listed below."
- **See inside:** dashed lines at the swipe distance ("Let go past here: it flies"), the pivot under the card with a short arc
  ("Held here, so it turns") and the waiting cards spread apart and numbered ("Next · waits a little smaller"); a line lights
  as the card crosses it. Swipe to Dismiss's lines and red strip lead there; here the pivot and the pile lead.
- **Compare:** "Vanishes" / "Flies off": the left card slides flat, with no turn or stamp, and is gone at once on release; the
  left pile mirrors a drag on the right one; at rest both wait a third of the way right. Note: "On the left the card vanishes
  when you let go, so it is hard to tell where it went. On the right it flies off the side you chose as the next one rises."
- **Still, phones, speed:** reduced motion: the drag still follows the finger; on release the card fades out, the next
  appears without growing, a short drag jumps back. The card is about 60% of the box's width; if the buttons need it, the
  box is taller on phones in every mode alike (`--hb-stage-h-phone`); `touch-action: pan-y` keeps page scrolling.
- **Preview:** three stacked cards; the top one swings right with a Like stamp and flies off as the next grows. **Closest:**
  Swipe to Dismiss (one list row slides off, drag and flick), 3D Carousel (momentum); here a pile, two answers, a turn.

## 6 · Water Ripple (06.27)

- **Card:** "Ripples spread from your finger and bend the picture below. Best for hero images." Places `bg`, `imgcard`; finder
  `background card` · `drag click hover` · `wave`. **Good for** Hero pictures · Pool, spa and travel sites · Playful
  backgrounds. **Avoid on** Pictures with text · Busy pages.
- **Demo:** a pond (pebbles, a koi, lily pads) drawn with canvas commands, so its pixels can be read; a drag leaves a wake, a
  tap drops a pebble. Two grids of water heights (200×125 on computers, 128×80 on phones) take 60 fixed steps a second: each
  point becomes half the total of its four neighbors minus its earlier height, then is damped. Each pixel is read from a spot
  shifted by the slope, with light on slopes facing up, drawn at grid size and stretched over the box. Calm water stops the
  loop and redraws the plain picture, so the box is exactly at rest. Show me draws an S and taps (3 s); Reset calms it.
- **Try it:** Ripple size: Small · **Medium** · Large, "How wide each push or drop is." How long ripples last: Short ·
  **Medium** · Long, "Long lets them bounce off the edges and cross." Bend: Subtle · **Medium** · Strong, "How much the
  picture under the water bends." More options: Light on the waves (switch, on), "Bright glints on the slopes."
- **Prompt (125 words):** "Add a water ripple effect to [the picture you want to look as if it lies under water]. Keep two
  grids of water heights, now and one step earlier. On each step, set every point to half the total of its four neighbors
  minus its earlier height, then damp it slightly, so ripples spread, cross, bounce off the edges and fade. A drag leaves a
  trail of small pushes; a tap drops a pebble. Draw the picture shifted at each point by the slope of the water, so it bends
  under the waves. Use a coarse grid and fixed steps, and stop once the water is calm. If the visitor has reduced motion
  turned on, show still rings that fade. Match the settings listed below."
- **See inside:** the hidden height map in grays over a faint picture ("Light is a crest, dark a trough"), a magnified three
  by three patch ("Each point: its neighbors, minus its last height") and small arrows on a coarse grid ("The picture is
  read from a shifted spot"). When the water is calm a frozen ripple stands in, so the parts show at rest.
- **Compare\*:** "Rings on top" / "Bends the picture": one simulation, two halves; the left draws light rings over a picture
  that never moves; touch either half; at rest both show the frozen ripple. Note: "On the left rings are drawn over the
  picture, which stays flat. On the right the picture itself bends under the waves, so it looks like water."
- **Still, phones, speed:** reduced motion: a tap or drag shows still rings that fade within a second, Show me at two spots.
  The box takes focus: the arrows move a small ring that leaves a wake, Enter or Space drops a pebble there;
  `touch-action: none`, as Cloth Simulation. Typed arrays, the smaller grid and a pixel cap on phones.
- **Preview:** two sets of thin rings spread and cross over a pebble floor. **Closest:** Cloth Simulation (fixed steps, drag),
  Image Distortion on Hover (rings by formula), Ambient Ripple Effect (rings on their own); here real, crossing waves.

## 7 · Audio Visualizer (06.28)

- **Card:** "Bars dance to the music, from bass to treble. Best for music players." Places `imgcard`, `bg`; finder `shape
  background` · `loop` · `bounce grow`. **Good for** Music players · Podcast pages · Radio and DJ sites · Voice notes.
  **Avoid on** Pages without sound · Reading pages.
- **Sound, decided (ruling of 2026-10-13):** no microphone and no file. The bars always move to a built-in tune (four bars
  of kick, snare, hi-hats, bass and a short melody at 100 beats a minute) written as notes in the page; from the notes the
  page works out, every frame, how loud each band of pitches would be, so the bars move in silence, offline, on a muted
  phone and in the page check. A **Hear it** button in the box (a small player row, 44px) plays the same tune live, made by
  the browser's Web Audio from oscillators and generated noise, and only then do the bars read the real analyzer. Why: the
  effect must show the moment the page opens, everywhere; a microphone asks permission and records the visitor; a sound
  file breaks "no external files"; browsers block sound before a press, and sudden sound is rude; yet hearing the kick as
  the low bars jump is the lesson. The audio is made on the press only (earlier, Chrome warns in the console and the page
  check fails); Pause and a hidden tab suspend it; Slow motion plays it at a third of the tempo.
- **Demo:** bars from bass (left) to treble (right), each band wider in pitch than the last, jump up at once and sink back by
  How bars fall, under peak marks. Wave draws the sound's shape; Circle sets the bars around a ring that swells with the bass.
- **Try it:** Style: **Bars** · Wave · Circle, "Wave draws the sound's shape instead of its pitches." Number of bars (group
  `bars-seg`): Few · Some · **Many** (16, 32, 64; Some marked `data-hb-phone`), "Fewer read better when small." How bars
  fall: Quickly · **Gently** · Slowly, "Slowly sinks like an old stereo." More options: Peak marks (switch, on); Colors:
  **Sunset** · Ocean · Neon.
- **Prompt (124 words):** "Add an audio visualizer to [your music player, podcast card or hero section]. Connect the playing
  audio to an analyzer that reports, many times a second, how loud each band of pitches is, and draw the bands on a canvas
  from bass to treble, in the style the settings choose, each sized by its loudness. Give higher bands wider slices of
  pitch, as hearing does, so the whole row moves. Let bands jump up at once and sink back as the settings choose. Start
  sound only when the visitor presses play, never use the microphone without asking, and draw fewer bars on phones. If the
  visitor has reduced motion turned on, keep the bars still until they press play. Match the settings listed below."
- **See inside:** each bar split into colored pieces by the part of the tune filling it (kick, bass, melody, hi-hats, with a
  legend), a scale under the bars ("Bass · Middle · Treble") and the beat above with a moving mark, so the kick lands as the
  low bars jump. With sound on, heights come from the analyzer and colors still from the notes.
- **Compare\*:** "Equal slices" / "Wider for treble": one signal, two rows; with Wave they match and the note points to Try
  it. Note: "On the left each bar covers an equal slice of pitches, so the bass crowds into a few bars. On the right bars
  widen as pitches rise, as we hear, so the whole row dances."
- **Still, phones, speed:** reduced motion starts paused on a kick (low bars high), the sound off until pressed. At most 32
  bars on phones (16 a row in Compare). The tune is short strings of notes; over the line limit, the melody goes first.
- **Preview:** twelve bars rise and fall on staggered rhythms, the left ones beating together. **Closest:** Starfield (loop in
  JavaScript), Abstract Geometric Motion (a pattern for music players that ignores sound); here loudness by pitch.

## 8 · Ken Burns Effect (07.24)

- **Card:** "Photos slowly zoom and pan, then fade into the next. Best for hero slideshows." Places `imgcard`, `bg`, `intro`;
  finder `card background` · `loop load` · `grow slide fade`. **Good for** Hero photos · Slideshows · Travel and property
  sites · Story pages. **Avoid on** Product photos people inspect · Pictures of text.
- **Demo:** three drawn photos (mountains at dawn, a harbor at dusk, a desert road under stars), each larger than the box.
  Each slowly zooms and drifts toward a point of interest, and the next fades in over about a second before the move ends,
  so the motion never stops. One CSS keyframe timeline per photo, its start and end framing set by variables, so Pause and
  Slow motion are the CSS kind; every photo stays larger than the box at every moment, so no edge shows.
- **Try it:** Which way it zooms: In · Out · **Both**, "Both changes direction from photo to photo." How much it moves:
  Subtle · **Medium** · Strong, "Subtle feels calm; strong feels like film." Time on each photo: Short · **Medium** · Long,
  "Longer is calmer." More options: Shows a caption (switch, off), "The caption stays still while the photo moves."
- **Prompt (116 words):** "Add a Ken Burns effect to [your hero photo or slideshow]. Slowly zoom and pan each photo, the way a
  documentary camera moves over a still print, and crossfade to the next photo before its move ends, so the motion never
  stops. Give each photo its own start and end framing that drifts toward a point of interest, at an even, unhurried pace.
  Keep the photo larger than its frame at every moment so no edge ever shows, move it with transforms only, and keep any
  text on top still and readable. If the visitor has reduced motion turned on, show each photo still and change photos with
  a slow fade. Match the settings listed below."
- **See inside:** the whole photo fitted in the box, dimmed outside a bright frame (the part the visitor sees) that glides
  from a dashed start frame to a dashed end frame along an arrow. Captions "Frame · what the visitor sees", "Start", "End".
  The frame's keyframes are the photo's turned inside out, from the same variables, so Pause and Slow motion reach it.
- **Compare:** "Still photos" / "Zoom and pan": the same timing and fades; the left photos never move. Note: "On the left the
  photos only fade, like a plain slideshow. On the right each one drifts and zooms, so still pictures feel alive."
- **Still, phones, speed:** reduced motion starts paused; Play changes photos with a slow fade, no zoom or pan; Compare's
  still shows the right photo at its end with its start dashed. Three layers moved by transform and opacity; each photo
  drawn at the size it reaches at the strongest zoom, so it stays sharp.
- **Preview:** a sunrise picture slowly scales and drifts, then fades into a second one. **Closest:** Aurora (loop in CSS),
  Infinite Zoom (an endless dive), Zoom Into Image (opens with the scroll); here one photo at a time drifts, with fades.

## 9 · Fire Effect (07.25)

- **Card:** "Flames flicker and rise as heat climbs and cools. Best for game and event pages." Places `bg`, `intro`; finder
  `background` · `loop` · `glitch color drift`. **Good for** Game sites · Sale and event banners · Night and festival themes.
  **Avoid on** Reading pages · Light themes.
- **Demo:** flames along the bottom of a dark box, sparks drifting up. A grid of heat values whose bottom row, hidden below
  the box, always holds full heat; at 60 fixed steps a second each cell takes the heat of a cell below it, shifted one cell
  sideways at random and cooled by a small random amount. Heat is colored by a palette, written into a small canvas (about
  one cell per five pixels, at most 160 across on computers and 96 on phones) and stretched over the box with smoothing, so
  the flames look soft. Sparks rise and fade by elapsed time.
- **Try it:** Flame height: Low · **Medium** · Tall, "Tall flames cool more slowly as they rise." Fire shape: **Along the
  edge** · Campfire, "Campfire heats only the middle, so the flames meet in a point." Colors: swatches **Orange** · Blue ·
  Green, "The color of the heat." More options: Wind: **None** · Left · Right; Sparks (switch, on).
- **Prompt (124 words):** "Add a fire effect to [the dark section or edge you want to set alight]. Keep a small grid of heat
  values whose bottom row always holds full heat. Many times a second, give each cell the heat of a cell just below it,
  nudged sideways and cooled a little at random, so heat rises, flickers and dies out. Color each cell by its heat with the
  palette the settings choose, dark when cool and brightest when hot, and draw the grid on a small canvas stretched over the
  area so the flames look soft. Step the grid at a fixed rate on every screen, coarser on phones. If the visitor has reduced
  motion turned on, show still flames. Match the settings listed below."
- **See inside:** the same fire as big squares in grays with a thin grid ("Each square holds one heat value: white is
  hottest"), the bottom row marked "Always full heat", rising arrows with a sideways wobble ("Heat moves up a row each step")
  and a fading bar at the side ("It cools as it rises"). It keeps running.
- **Compare\*:** "Flickers in place" / "Heat rises": one canvas, two halves; on the left each cell gets new random heat every
  step, more near the bottom, and nothing rises. Note: "On the left each spot just flickers where it is, so it looks like
  static. On the right heat rises from below and cools on the way up, so it forms flames."
- **Still, phones, speed:** reduced motion starts paused on a full fire (a fixed seed run a fixed number of steps), every
  mode's still that frame. The smaller grid and fewer sparks on phones; each Compare half gets half the grid.
- **Preview:** four flame tongues (rounded gradient shapes) stretch and sway as sparks rise. **Closest:** Game of Life (a
  stepping grid), Cloth Simulation (fixed steps), Volumetric Smoke and Fireworks (smoke and sparks, not flames).

## 10 · Lightning (07.26)

- **Card:** "Jagged bolts strike from the clouds and light up the sky. Best for dramatic intros." Places `bg`, `intro`; finder
  `background shape` · `loop click` · `glitch color`. **Good for** Game sites · Storm and weather themes · Dramatic intros.
  **Avoid on** Reading pages · Calm or health sites.
- **Demo:** a storm over dark hills: drifting clouds, light rain and, every few seconds, a bolt from the clouds to the ground,
  built once per strike: a straight line split seven times over, each new midpoint pushed sideways by a random amount that
  halves every round, plus thinner forks, drawn as a wide, faint stroke under a thin bright one (no shadow blur). It flickers
  once (bright, dim, bright) and fades within half a second while the sky lights softly (an overlay at most 30% white). A
  click or tap strikes there; Enter or Space on the focused box strikes from its middle. **Safety:** strikes start at least
  1.5 s apart whatever is pressed (a click waits), so there are never more than two flashes in any second.
- **Try it:** How often: Rarely · **Sometimes** · Often, "Rarely keeps it calm behind text." Branches: Few · **Some** · Many,
  "How many thinner forks split off." Bolt color: swatches **White** · Blue · Violet, "The bolt and its glow." More options:
  Lights up the sky (switch, on); Rain (switch, on).
- **Prompt (123 words):** "Add lightning to [the dark section or storm scene you want it in]. Every so often, draw a jagged
  bolt from the clouds to the ground on a canvas: start from a straight line, split it again and again, pushing each new
  midpoint sideways at random by less each time, and let thinner forks branch off. Draw a wide, faint stroke under a thin
  bright one for the glow; the bolt flickers once and fades within half a second. When the settings include it, light the
  sky softly, never more than twice a second. A click or tap strikes where the visitor points. If the visitor has reduced
  motion turned on, show a still bolt with no flash. Match the settings listed below."
- **See inside:** each bolt drawn round by round: the straight line dashed, each later round in a lighter stroke, every pushed
  midpoint dotted, the forks numbered, then the glow. Captions "Starts straight", "Each split pushes the middle aside, less
  each time", "Forks branch off", "Glow · a wide, faint copy". The last drawing stays faint between strikes.
- **Compare\*:** "Even zigzag" / "Random splits": both strike together; the left bolt zigzags in equal steps, like an icon,
  and each half keeps its last bolt faint between strikes. Note: "On the left the bolt zigzags evenly, so it looks drawn. On
  the right each split pushes it aside by less, so it has big bends and fine jitter."
- **Still, phones, speed:** reduced motion starts paused on a still bolt; Play and clicks fade bolts in and out with no flicker
  or sky flash. Fewer raindrops on phones. The reviewer counts flashes at Often and under fast clicks: two a second at most.
- **Preview:** a dark sky where a drawn bolt flickers (two opacity steps) every 3 s with a soft glow; a `STILL` point holds it
  on the bolt. **Closest:** Fireworks (canvas glow), Snow / Rain (rain), Flash / Light Leak Transition (its flash limit).

## Lists, counts and generated files

- **Home page:** each `CATS` entry at the end of its section; its `PLACES` row and its `FIND` row (the finder is on the base
  branch; the answers as above, by the finder spec's section 3 rules), each in `CATS` order; each page's own preview (a `PV`
  key, CSS at the end of its section's bespoke block, a `case` in `pvMarkup()`, a `STILL` point where the loop's middle is
  not a clear frame), light and inside its 16:10 box.
- **Every count, 166 → 176:** the home page (title, meta, Open Graph, Twitter and JSON-LD, hero pill, Browse all, footer,
  no-JavaScript note); the root `README.md` (picture alt text, intro, badge, "All 176", the Categories table, headings and
  summaries: 02 15, 03 17, 04 44, 06 28, 07 26); `.github/ISSUE_TEMPLATE/config.yml`; `404.html`; `og-image.png` redrawn
  with `node tools/make-social-image.mjs`. The skill and `llms.txt` count themselves. Outside the repository: the owner's
  launch posts, if one still to go out says 166.
- **Lists:** the root README catalog, in home order; the READMEs of 02, 03, 04, 06 and 07 (07's Implementation summary: Ken
  Burns under CSS keyframes, Fire Effect and Lightning under Canvas 2D; 06's Browser requirements: Audio Visualizer, "Web
  Audio, only after Hear it"); each new page gets a See also line from one or two of its closest pages; `CHANGELOG.md`.
- **Generated files,** never merged by hand (the coordination file): after each merge and again after the last fix,
  `node tools/update-sitemap.mjs`, `node tools/make-skill.mjs`, `node tools/make-famous.mjs` and, with the repo served,
  `node tools/make-social-image.mjs`.
- **Tests:** the coordinator adds `before-after-slider`, `magnifier-lens` and `card-deck-swipe` to `KEYBOARD_PAGES` under
  `04-micro-interactions` and `water-ripple` under `06-3d-advanced`, and `'audio-visualizer': ['bars-seg', 'Some']` to
  `PHONE_DEFAULTS` (`tests/pages.test.js`); integration adds Ink Spread Reveal to the finder test set's case 9
  (`tests/finder.test.js`). No shared file changes; one needed goes in the ledger, applied at integration with the next
  version number.

## Building it

**Lanes.** Branch `feat/ten-animations`, cut as the coordination file says: from `feat/see-inside-compare` once the rollout
is integrated (main, with the finder and Famous effects, merged in), or from `main` if the rollout is live by then. Run
folder `.superpowers/sdd/<start date>-ten-animations/` (briefs, ledger); page checks from the shared pool. Ten lanes, one
page each, in table order (L1 Ink Spread Reveal … L10 Lightning), each in `.claude/worktrees/ten-L<n>` on `ten/L<n>`,
ports 8961 to 8970. Before the briefs, a fresh agent checks the ten finder rows by the finder spec's section 3 rules and
runs its test set with them added (a scratch copy, nothing committed). The coordinator writes each brief from the page's
section here (about 20 lines), then per page:
1. **Builder** (strongest model): page, README, list entries; the tests; the page check with its mode checks (six `ok`); both
   views tuned from the See inside and Compare screenshots at 1280, 375 and 375 with reduced motion; frame times with the CPU
   slowed four times on the six canvas or mask pages; hand checks (44px in the box, keys, Lightning's flashes, no sound or
   console warning on Audio Visualizer before Hear it).
2. **Reviewer** (strongest model, never the builder): brief, diff, screenshots and check output against CLAUDE.md, the
   rollout's acceptance list and this section, plus the per-frame work; a verdict. Three fix rounds at most, then the
   coordinator steps in.

**What lanes change, and integration,** work as in `2026-10-01-special-animations-design.md` (what a lane changes and never
changes, split sections, integration), with each lane's counts at 167 and the first lane of a section (L1, L2, L3, L6, L8)
giving the old last page its Next link; a lane runs `update-sitemap` and `make-skill` so its own tests pass, never
`make-social-image` (`og-image.png` stays the coordinator's). Integration also keeps `FIND` in order, takes either side of
every generated file and writes it again, sets every count to 176, adds the test entries and See also lines, and runs the
tests, `home`, `famous` and the page check on the ten new and five edited pages.
**Final review** in three parts on frozen detached checkouts as pages land (02 to 04; 06 and 07; integration, home, counts,
docs); builders fix their own findings; a scoped re-review; the whole-site check in parts. The coordination file's machine
rules hold (the shared pool of eight checks, headless Chrome, no `git stash`, temp folders cleared with the owner's OK).
**Owner's look:** the rollout's review kit on the ten pages, the pages in the browser pane and Hear it tried there.
Published on the owner's word, all at once, by the coordination file's release rule, never before the rollout.

## Time, honestly

Briefs about 1 hour; ten lanes with reviews and fixes 5 to 8 hours (Card Deck Swipe, Water Ripple and Audio Visualizer set
the pace); integration 2 to 3; final review and fixes 3 to 4; whole-site check about 1.5. That is 13 to 17 hours of running:
**about 2 days** from the go-ahead to a branch ready to publish, 1.5 at best, 3 if the hard pages need extra rounds or the
usage limit stops the agents (it did on 2026-09-30). The owner's look comes on top, and the rollout's own 4 days come first.

## Acceptance

- Tests pass with the final gate; six `ok` lines for each new and edited page, the home page and Famous effects; the whole
  site has no FAIL; a reviewer's verdict on every page; no Critical or Important item left from the final review.
- Frame times, Lightning's flash count and Audio Visualizer's silent start checked; every count says 176; sitemap, skill,
  `llms.txt`, Famous effects' previews and the social image regenerated; the owner has looked at the ten pages, and nothing
  was published before.
