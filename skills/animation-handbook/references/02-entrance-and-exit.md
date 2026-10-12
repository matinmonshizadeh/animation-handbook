# 02 · Entrance & Exit

Element-level animations for arriving and departing — fades, slides, reveals, flips, and text staggers. 14 animations from Animation Handbook, in the home page's order. Each entry gives the live demo, how it runs, what it is good for and what to avoid it on, the prompt from its page word for word, and its settings.

## Contents

- [Fade In / Fade Out](#fade-in--fade-out)
- [Slide In](#slide-in)
- [Slide Up Reveal](#slide-up-reveal)
- [Scale In / Zoom In](#scale-in--zoom-in)
- [Clip-Path Reveal](#clip-path-reveal)
- [Curtain Reveal](#curtain-reveal)
- [Split Text Reveal](#split-text-reveal)
- [Letter-by-Letter Stagger](#letter-by-letter-stagger)
- [Word-by-Word Reveal](#word-by-word-reveal)
- [Blur In](#blur-in)
- [Flip In](#flip-in)
- [Bounce In](#bounce-in)
- [Rotate In](#rotate-in)
- [Shatter Effect](#shatter-effect)

## Fade In / Fade Out

Fades in to appear and fades out to leave. Best for pop-ups and tooltips.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/fade-in-out/
- How it runs: plays once
- Good for: Pop-ups · Tooltips · Loaded content · Image swaps
- Avoid on: Side panels · Urgent alerts

**Prompt**

Add a fade-in and fade-out to [the element you want to show and hide]. When it appears, it should go smoothly from fully transparent to fully visible, and when it leaves it should do the reverse. Nothing moves or changes size; only the opacity changes, which keeps the animation smooth because the browser doesn't need to repaint. Reserve the element's space while it is invisible so the layout doesn't jump, and make sure a hidden element can't be clicked or focused. If the visitor has reduced motion turned on, show and hide it instantly or with a very short fade. Match the settings listed below.

**Settings** (the defaults in bold):

- Speed: Slow · **Normal** · Fast
- Feel: **Smooth** · Gentle · Even

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Speed: Normal, Feel: Smooth.

## Slide In

Travels into place from one edge. Best for side panels and notifications.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/slide-in/
- How it runs: plays once
- Good for: Side panels · Notifications · Menus · List items
- Avoid on: Crowded layouts · Long text

**Prompt**

Add a slide-in entrance to [the element you want to animate]. It should start away from its final position, on the side and at the distance given in the settings, and travel into place so it feels like it came from somewhere; slowing down as it arrives makes the landing feel natural. Unless the settings turn it off, fade it in during the slide too, because a slide on its own tends to look mechanical. Give longer distances a little more time so the speed still feels natural. Move it without changing the layout, so nothing around it shifts. If the visitor has reduced motion turned on, skip the travel and simply show it. Match the settings listed below.

**Settings** (the defaults in bold):

- Comes in from: **Top** · Bottom · Left · Right
- How far it travels: Short · **Medium** · Far
- Speed: Slow · **Normal** · Fast
- Feel: **Smooth** · Springy · Gentle · Even
- Fades in: **on** · off

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Comes in from: Top, How far it travels: Medium, Speed: Normal, Feel: Smooth, Fades in: on.

## Slide Up Reveal

Text rises into view from behind an invisible edge. Best for headlines.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/slide-up-reveal/
- How it runs: plays once
- Good for: Headlines · Section titles · Taglines
- Avoid on: Long paragraphs · Buttons

**Prompt**

Add a slide-up reveal to [your headline or lines of text]. Each line should rise into view from just below an invisible edge, as if it is coming up from behind a solid surface, so viewers only see it arrive and never see it below the line. The text can slide up behind the edge or be uncovered in place from the bottom up; both look almost the same. When there are several lines, start each one a moment after the line above it so they cascade. The text must stay readable by screen readers and search engines the whole time. If the visitor has reduced motion turned on, show the text immediately without the rise. Match the settings listed below.

**Settings** (the defaults in bold):

- Speed: Slow · **Normal** · Fast
- Delay between lines: Short · **Medium** · Long
- Reveal style: **Slide** · Wipe
- Feel: **Smooth** · Springy · Even

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Speed: Normal, Delay between lines: Medium, Reveal style: Slide, Feel: Smooth.

## Scale In / Zoom In

Grows from smaller to full size. Best for pop-ups and menus.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/scale-in/
- How it runs: plays once
- Good for: Pop-ups and dialogs · Menus · Cards in a grid · Checkmarks
- Avoid on: Long text · Full-page sections

**Prompt**

Add a scale-in entrance to [the element you want to animate]. It should start smaller than its final size and grow to full size, anchored at the point given in the settings: its center, or an edge or corner so it seems to grow out of the button that opened it. A springy curve lets it overshoot slightly and settle, which makes the arrival feel physical. Unless the settings turn it off, fade it in while it grows so it never flashes at full strength while it is still tiny. Animate only its size and opacity. If the visitor has reduced motion turned on, show it at full size without the zoom. Match the settings listed below.

**Settings** (the defaults in bold):

- Starting size: **A bit smaller** · Half size · From nothing
- Grows from: **Center** · Top left · Top · Bottom
- Speed: Slow · **Normal** · Fast
- Feel: Smooth · **Springy** · Gentle · Even
- Fades in: **on** · off

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Starting size: A bit smaller, Grows from: Center, Speed: Normal, Feel: Springy, Fades in: on.

## Clip-Path Reveal

A growing shape uncovers it while it stays still. Best for images and banners.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/clip-path-reveal/
- How it runs: plays once
- Good for: Images · Banners · Full-width panels
- Avoid on: Small buttons · Form fields

**Prompt**

Add a mask reveal to [the image or block you want to reveal]. The element should stay completely still and fully drawn while a shape uncovers it, like a window opening: an edge wipe that starts from one side or from the center, or a circle or oval that opens from the middle. Nothing moves, fades or changes size; only the visible area grows until the whole element shows. A wipe that slows down as it finishes looks calmer than one that stops abruptly. The content must stay accessible even while part of it is hidden. If the visitor has reduced motion turned on, show it fully without the wipe. Match the settings listed below.

**Settings** (the defaults in bold):

- Shape: **Edge wipe** · Circle · Oval
- Starts from: **Left** · Right · Top · Bottom · Center
- Speed: Slow · **Normal** · Fast
- Feel: **Smooth** · Even

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Shape: Edge wipe, Starts from: Left, Speed: Normal, Feel: Smooth.

## Curtain Reveal

A colored panel covers it, then slides away. Best for intros and logos.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/curtain-reveal/
- How it runs: plays once
- Good for: Page intros · Logos · Section changes · Portfolio pieces
- Avoid on: Buttons and menus · Things shown often

**Prompt**

Add a curtain reveal to [the content you want to reveal]. A solid colored panel should slide across and cover the content completely, hold for the pause given in the settings, then keep going and slide off the far side, leaving the content visible. The pause is what makes the change register. When the panels come in from both sides, two panels meet in the middle, then part. Pick a panel color that contrasts strongly with the content. Move the panels rather than resizing them so the motion stays smooth. If the visitor has reduced motion turned on, show the content without the curtain. Match the settings listed below.

**Settings** (the defaults in bold):

- Comes in from: **Left** · Right · Top · Bottom · Both sides
- Speed: Slow · **Normal** · Fast
- Pause while covered: None · **Short** · Long
- Curtain color: **Dark** · Ink blue · Warm red · Off-white · Gold

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Comes in from: Left, Speed: Normal, Pause while covered: Short, Curtain color: Dark.

## Split Text Reveal

Text breaks into pieces that appear one after another. Best for headlines.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/split-text-reveal/
- How it runs: plays once
- Good for: Headlines · Taglines · Short quotes
- Avoid on: Body text · Buttons and labels

**Prompt**

Add a split-text reveal to [your headline]. Break the text into pieces (characters, words or lines) and animate each piece into view one after another with a short delay between them, so the text flows in as a cascade instead of appearing all at once. Every piece plays the same small entrance, such as fading up from slightly below. Screen readers should still read the text as one normal sentence, not as separate pieces, and the text must not reflow or jump while it animates. If the visitor has reduced motion turned on, show the text immediately. Match the settings listed below.

**Settings** (the defaults in bold):

- Split into: Letters · **Words** · Lines
- How each piece appears: **Fade up** · Fade · Grow · Flip
- Delay between pieces: Short · **Medium** · Long
- Speed: Slow · **Normal** · Fast
- Feel: **Smooth** · Springy · Even
- Your text: text field, starts as "Design beyond the obvious"

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Split into: Words, How each piece appears: Fade up, Delay between pieces: Medium, Speed: Normal, Feel: Smooth, Your text: "Design beyond the obvious".

## Letter-by-Letter Stagger

A phrase appears letter by letter or typewriter-style. Best for short headlines.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/letter-by-letter-stagger/
- How it runs: plays once
- Good for: Short headlines · Names and logos · Chat messages · Loading screens
- Avoid on: Long text · Buttons and labels

**Prompt**

Add a letter-by-letter entrance to [a short phrase or headline]. In the cascade style, every letter plays a small entrance a moment after the previous one, so the phrase assembles from left to right. In the typewriter style, the letters appear one at a time as if someone is typing, with a blinking cursor when the settings include one. Use it only on short phrases, because long text becomes tedious to wait for. Screen readers should hear the whole phrase once, not letter by letter. If the visitor has reduced motion turned on, show the full phrase immediately. Match the settings listed below.

**Settings** (the defaults in bold):

- Style: **Cascade** · Typewriter
- Delay between letters: Short · **Medium** · Long
- How each letter appears: **Fade up** · Fade · Grow · Flip
- Speed: Slow · **Normal** · Fast
- Blinking cursor: **on** · off (only with some choices of another setting)
- Your text: text field, starts as "Hello, world."

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Style: Cascade, Delay between letters: Medium, How each letter appears: Fade up, Speed: Normal, Your text: "Hello, world.".

## Word-by-Word Reveal

Words appear one after another at a reading pace. Best for quotes and intros.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/word-by-word-reveal/
- How it runs: plays once
- Good for: Quotes · Short paragraphs · Captions · Story sections
- Avoid on: Long articles · Buttons and labels

**Prompt**

Add a word-by-word reveal to [the paragraph or quote you want to reveal]. Each word should appear a moment after the one before it, so the text builds up as if it is being spoken; a delay close to the pace people read feels most natural. If pauses between sentences are on, wait a little longer at the end of each sentence before continuing. Keep the delay short enough that nobody waits for text they could already read. The full text must stay readable by screen readers and must not reflow while it appears. If the visitor has reduced motion turned on, show all the text at once. Match the settings listed below.

**Settings** (the defaults in bold):

- Delay between words: Short · **Medium** · Long
- How each word appears: **Fade up** · Fade · Grow · Blur · Flip
- Speed: Slow · **Normal** · Fast
- Feel: **Smooth** · Springy · Even
- Pauses between sentences: on · **off**
- Your text: text box, starts with the lines "We build interfaces that disappear.", "Tools that feel inevitable." and "Software made with care."

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Delay between words: Medium, How each word appears: Fade up, Speed: Normal, Feel: Smooth, Pauses between sentences: off, Your text: "We build interfaces that disappear. Too…".

## Blur In

Comes into focus from a blur, like a camera. Best for featured cards and photos.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/blur-in/
- How it runs: plays once
- Good for: Featured cards · Photos · Pop-ups · Portfolio pieces
- Avoid on: Lists and grids · Small text

**Prompt**

Add a blur-in entrance to [the element you want to animate]. It should come into view like a camera pulling focus onto the subject: sharpening from a blur makes it feel like a lens finding its subject, and fading in at the same time makes it feel like it is arriving. It can also drift up slightly as it settles. Use it on one focal element at a time, not on a list or grid, because blur is expensive for the browser to draw. Remove the blur completely once the animation ends. If the visitor has reduced motion turned on, show the element sharp and visible without the effect. Match the settings listed below.

**Settings** (the defaults in bold):

- How blurry it starts: Slight · **Medium** · Heavy
- Speed: Slow · **Normal** · Fast
- What changes: **Blur and fade** · Blur only · Fade only
- Feel: **Smooth** · Gentle · Even
- Drifts up: **on** · off

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: How blurry it starts: Medium, Speed: Normal, What changes: Blur and fade, Feel: Smooth, Drifts up: on.

## Flip In

Swings into view in 3D, like a card turning over. Best for cards and tiles.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/flip-in/
- How it runs: plays once
- Good for: Cards · Flashcards and tiles · Dashboard panels · Onboarding steps
- Avoid on: Text blocks · Full-page sections

**Prompt**

Add a 3D flip-in entrance to [the card you want to animate]. The card should start turned away from the viewer and swing toward them until it faces them flat. Give the card's container a 3D perspective so the swing has real depth; without it, the flip looks like a flat squash. The hinge can sit in the middle or along one edge, and the card can fade in while it turns. If the visitor has reduced motion turned on, show the card facing forward without the flip. Match the settings listed below.

**Settings** (the defaults in bold):

- Swing direction: **Sideways** · Up and down · Diagonal
- Hinge: **Center** · Top · Bottom · Left
- Speed: Slow · **Normal** · Fast
- How far it turns: A little · **¼ turn** · ½ turn
- 3D depth: Subtle · **Medium** · Strong
- Feel: **Smooth** · Springy · Gentle · Even
- Fades in: **on** · off

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Swing direction: Sideways, Hinge: Center, Speed: Normal, How far it turns: ¼ turn, 3D depth: Medium, Feel: Smooth, Fades in: on.

## Bounce In

Lands with a springy bounce. Best for badges and success messages.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/bounce-in/
- How it runs: plays once
- Good for: Success messages · Badges · Small pop-ups · Playful brands
- Avoid on: Formal content · Large panels

**Prompt**

Add a bounce-in entrance to [the element you want to animate]. When it appears, it should start small and a little below its final spot, grow slightly past full size, dip just under it, then settle, as if it landed with a small spring. Each bounce is smaller than the one before, like energy running out, and one bounce usually looks best. Unless the settings turn it off, fade it in at the same time. Animate only its position, size and opacity so it stays smooth. If the visitor has reduced motion turned on, show the element without the bounce. Match the settings listed below.

**Settings** (the defaults in bold):

- Bounce strength: Soft · **Medium** · Strong
- Number of bounces: **One** · Two · Three
- Speed: Slow · **Normal** · Fast
- Fades in: **on** · off

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Bounce strength: Medium, Number of bounces: One, Speed: Normal, Fades in: on.

## Rotate In

Spins into place while it grows. Best for icons, stars and badges.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/rotate-in/
- How it runs: plays once
- Good for: Icons · Badges and stars · Logos · Small decorations
- Avoid on: Text · Wide boxes and cards

**Prompt**

Add a rotate-in entrance to [the icon or badge you want to animate]. It should spin around its center as it appears. Growing from small at the same time makes it look like it is arriving rather than just turning, and a slight overshoot at the end makes the spin land instead of gliding to a stop. Use this on round or symmetric shapes like icons, stars, gears and badges; it looks wrong on text or wide rectangles. If the visitor has reduced motion turned on, show it in place without spinning. Match the settings listed below.

**Settings** (the defaults in bold):

- How much it spins: ¼ turn · **½ turn** · Full turn
- Speed: Slow · **Normal** · Fast
- Spin direction: **Clockwise** · Counter-clockwise
- Bounce at the end: **on** · off
- Grows from small: **on** · off
- Fades in: **on** · off

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: How much it spins: ½ turn, Speed: Normal, Spin direction: Clockwise, Bounce at the end: on, Grows from small: on, Fades in: on.

## Shatter Effect

Breaks into pieces that fly apart and fade. Best for galleries and bold exits.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/shatter-effect/
- How it runs: plays once
- Good for: Photo galleries · Dismissed cards · Game moments · Bold intros
- Avoid on: Things shown often · Calm, serious pages

**Prompt**

Add a shatter effect to [the card or picture you want to break]. When it plays, the card breaks into uneven pieces that burst away from the point of impact, each turning as it flies and fading out, while the next card fades in behind them. Make each piece a copy of the whole card trimmed to its own shape, so together they look exactly like the card until they move, and launch the pieces nearest the impact first. Move and turn the pieces rather than resizing them so it stays smooth, and remove them once they have faded. If the visitor has reduced motion turned on, fade the card out and the next one in, with no pieces. Match the settings listed below.

**Settings** (the defaults in bold):

- Number of pieces: Few · **Medium** · Many
- Breaks from: **Center** · Corner
- Gravity: None · **Normal** · Heavy
- Speed: Slow · **Normal** · Fast
- Shows the cracks: **on** · off
- Tumbles in 3D: **on** · off

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Number of pieces: Medium, Breaks from: Center, Gravity: Normal, Speed: Normal, Shows the cracks: on, Tumbles in 3D: on.
