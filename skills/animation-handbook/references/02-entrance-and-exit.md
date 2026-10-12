# 02 · Entrance & Exit

Element-level animations for arriving and departing — fades, slides, reveals, flips, and text staggers. 14 animations from Animation Handbook, in the home page's order. Each entry gives the live demo, how it runs, what it is good for and what to avoid it on, the prompt from its page word for word, and its settings with what each does and the demo's values.

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

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. How long the fade takes: slow is 1000ms, normal 600ms and fast 350ms; under 150ms a fade barely registers.
- Feel: **Smooth** · Gentle · Even. Smooth starts quickly and settles gently, the natural feel for an entrance; Gentle eases in and out; Even keeps one steady pace.

## Slide In

Travels into place from one edge. Best for side panels and notifications.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/slide-in/
- How it runs: plays once
- Good for: Side panels · Notifications · Menus · List items
- Avoid on: Crowded layouts · Long text

**Prompt**

Add a slide-in entrance to [the element you want to animate]. It should start away from its final position, on the side and at the distance given in the settings, and travel into place so it feels like it came from somewhere; slowing down as it arrives makes the landing feel natural. Unless the settings turn it off, fade it in during the slide too, because a slide on its own tends to look mechanical. Give longer distances a little more time so the speed still feels natural. Move it without changing the layout, so nothing around it shifts. If the visitor has reduced motion turned on, skip the travel and simply show it. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Comes in from: **Top** · Bottom · Left · Right. Which edge it travels in from.
- How far it travels: Short · **Medium** · Far. How far away it starts: short is 50px, medium 200px and far 400px; short distances suit subtle interface motion, long ones feel dramatic.
- Speed: Slow · **Normal** · Fast. How long the slide takes: slow is 1000ms, normal 600ms and fast 350ms; longer distances need more time so the speed still feels believable.
- Feel: **Smooth** · Springy · Gentle · Even. Smooth slows down into place; Springy adds a small overshoot; Gentle eases in and out; Even keeps one steady pace.
- Fades in: **on** · off. A slide alone looks mechanical; the fade makes it read as an arrival.

## Slide Up Reveal

Text rises into view from behind an invisible edge. Best for headlines.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/slide-up-reveal/
- How it runs: plays once
- Good for: Headlines · Section titles · Taglines
- Avoid on: Long paragraphs · Buttons

**Prompt**

Add a slide-up reveal to [your headline or lines of text]. Each line should rise into view from just below an invisible edge, as if it is coming up from behind a solid surface, so viewers only see it arrive and never see it below the line. The text can slide up behind the edge or be uncovered in place from the bottom up; both look almost the same. When there are several lines, start each one a moment after the line above it so they cascade. The text must stay readable by screen readers and search engines the whole time. If the visitor has reduced motion turned on, show the text immediately without the rise. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. How long each line takes to rise: slow is 1100ms, normal 700ms and fast 400ms.
- Delay between lines: Short · **Medium** · Long. The wait before each next line starts: short is 30ms, medium 60ms and long 120ms; 40 to 80ms reads as a cascade.
- Reveal style: **Slide** · Wipe. Two ways to build it that look almost the same: sliding the text up behind a hidden edge, or wiping it into view in place.
- Feel: **Smooth** · Springy · Even. Smooth slows to a stop; Springy adds a slight settle; Even keeps one steady pace.

## Scale In / Zoom In

Grows from smaller to full size. Best for pop-ups and menus.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/scale-in/
- How it runs: plays once
- Good for: Pop-ups and dialogs · Menus · Cards in a grid · Checkmarks
- Avoid on: Long text · Full-page sections

**Prompt**

Add a scale-in entrance to [the element you want to animate]. It should start smaller than its final size and grow to full size, anchored at the point given in the settings: its center, or an edge or corner so it seems to grow out of the button that opened it. A springy curve lets it overshoot slightly and settle, which makes the arrival feel physical. Unless the settings turn it off, fade it in while it grows so it never flashes at full strength while it is still tiny. Animate only its size and opacity. If the visitor has reduced motion turned on, show it at full size without the zoom. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Starting size: **A bit smaller** · Half size · From nothing. How small it starts: a bit smaller is 80% of full size, half size 50% and from nothing 0%; close to full size is subtle, below half reads as a big zoom.
- Grows from: **Center** · Top left · Top · Bottom. The point it grows from: the center, the top left corner, the top edge or the bottom edge.
- Speed: Slow · **Normal** · Fast. How long it takes: slow is 800ms, normal 500ms and fast 300ms; a springy curve needs room to overshoot and settle.
- Feel: Smooth · **Springy** · Gentle · Even. Springy overshoots and settles; Smooth and Gentle arrive more calmly; Even keeps one steady pace.
- Fades in: **on** · off. Stops the element flashing at full strength while it is still tiny.

## Clip-Path Reveal

A growing shape uncovers it while it stays still. Best for images and banners.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/clip-path-reveal/
- How it runs: plays once
- Good for: Images · Banners · Full-width panels
- Avoid on: Small buttons · Form fields

**Prompt**

Add a mask reveal to [the image or block you want to reveal]. The element should stay completely still and fully drawn while a shape uncovers it, like a window opening: an edge wipe that starts from one side or from the center, or a circle or oval that opens from the middle. Nothing moves, fades or changes size; only the visible area grows until the whole element shows. A wipe that slows down as it finishes looks calmer than one that stops abruptly. The content must stay accessible even while part of it is hidden. If the visitor has reduced motion turned on, show it fully without the wipe. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Shape: **Edge wipe** · Circle · Oval. Edge wipe uncovers it from one side or from the center; Circle and Oval open from the middle like an iris.
- Starts from: **Left** · Right · Top · Bottom · Center. For the edge wipe, where the reveal begins: left, right, top, bottom or center.
- Speed: Slow · **Normal** · Fast. How long the reveal takes: slow is 1300ms, normal 800ms and fast 500ms; a reveal reads best a little slower than a fade.
- Feel: **Smooth** · Even. Smooth slows to a stop instead of snapping; Even keeps one steady pace.

## Curtain Reveal

A colored panel covers it, then slides away. Best for intros and logos.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/curtain-reveal/
- How it runs: plays once
- Good for: Page intros · Logos · Section changes · Portfolio pieces
- Avoid on: Buttons and menus · Things shown often

**Prompt**

Add a curtain reveal to [the content you want to reveal]. A solid colored panel should slide across and cover the content completely, hold for the pause given in the settings, then keep going and slide off the far side, leaving the content visible. The pause is what makes the change register. When the panels come in from both sides, two panels meet in the middle, then part. Pick a panel color that contrasts strongly with the content. Move the panels rather than resizing them so the motion stays smooth. If the visitor has reduced motion turned on, show the content without the curtain. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Comes in from: **Left** · Right · Top · Bottom · Both sides. Which way the panel travels; Both sides sends two panels that meet in the middle, then part.
- Speed: Slow · **Normal** · Fast. Time for one pass: slow is 800ms, normal 500ms and fast 300ms; the whole reveal takes about two passes plus the pause.
- Pause while covered: None · **Short** · Long. How long the panel covers everything: none, short (300ms) or long (800ms); the pause is what makes the change register.
- Curtain color: **Dark** · Ink blue · Warm red · Off-white · Gold. The panel's color; strong contrast with the content makes the reveal more dramatic.

## Split Text Reveal

Text breaks into pieces that appear one after another. Best for headlines.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/split-text-reveal/
- How it runs: plays once
- Good for: Headlines · Taglines · Short quotes
- Avoid on: Body text · Buttons and labels

**Prompt**

Add a split-text reveal to [your headline]. Break the text into pieces (characters, words or lines) and animate each piece into view one after another with a short delay between them, so the text flows in as a cascade instead of appearing all at once. Every piece plays the same small entrance, such as fading up from slightly below. Screen readers should still read the text as one normal sentence, not as separate pieces, and the text must not reflow or jump while it animates. If the visitor has reduced motion turned on, show the text immediately. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Split into: Letters · **Words** · Lines. Letters give the finest cascade, words a readable rhythm, lines a block reveal.
- How each piece appears: **Fade up** · Fade · Grow · Flip. The small entrance each piece plays: fade up, fade, grow or flip.
- Delay between pieces: Short · **Medium** · Long. The wait between pieces: short is 10ms, medium 30ms and long 100ms; small values ripple, large values feel deliberate.
- Speed: Slow · **Normal** · Fast. How long each piece takes: slow is 800ms, normal 500ms and fast 300ms.
- Feel: **Smooth** · Springy · Even. The curve each piece uses; Springy adds a small settle, Even keeps one steady pace.
- Your text: text field, starts as "Design beyond the obvious". The text that is split and revealed.

## Letter-by-Letter Stagger

A phrase appears letter by letter or typewriter-style. Best for short headlines.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/letter-by-letter-stagger/
- How it runs: plays once
- Good for: Short headlines · Names and logos · Chat messages · Loading screens
- Avoid on: Long text · Buttons and labels

**Prompt**

Add a letter-by-letter entrance to [a short phrase or headline]. In the cascade style, every letter plays a small entrance a moment after the previous one, so the phrase assembles from left to right. In the typewriter style, the letters appear one at a time as if someone is typing, with a blinking cursor when the settings include one. Use it only on short phrases, because long text becomes tedious to wait for. Screen readers should hear the whole phrase once, not letter by letter. If the visitor has reduced motion turned on, show the full phrase immediately. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Style: **Cascade** · Typewriter. Cascade animates every letter in turn; Typewriter types them out.
- Delay between letters: Short · **Medium** · Long. The gap between letters: short is 20ms, medium 35ms and long 80ms; higher is slower and more theatrical.
- How each letter appears: **Fade up** · Fade · Grow · Flip. In Cascade, the entrance each letter plays: fade up, fade, grow or flip.
- Speed: Slow · **Normal** · Fast. In Cascade, how long each letter takes to settle: slow is 650ms, normal 400ms and fast 250ms.
- Blinking cursor: **on** · off (the page shows it only for some choices of another setting, and copies it only then). In Typewriter, a blinking cursor leads the letters.
- Your text: text field, starts as "Hello, world.". The phrase that is animated, up to 60 characters.

## Word-by-Word Reveal

Words appear one after another at a reading pace. Best for quotes and intros.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/word-by-word-reveal/
- How it runs: plays once
- Good for: Quotes · Short paragraphs · Captions · Story sections
- Avoid on: Long articles · Buttons and labels

**Prompt**

Add a word-by-word reveal to [the paragraph or quote you want to reveal]. Each word should appear a moment after the one before it, so the text builds up as if it is being spoken; a delay close to the pace people read feels most natural. If pauses between sentences are on, wait a little longer at the end of each sentence before continuing. Keep the delay short enough that nobody waits for text they could already read. The full text must stay readable by screen readers and must not reflow while it appears. If the visitor has reduced motion turned on, show all the text at once. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Delay between words: Short · **Medium** · Long. The reading-speed control: short is 40ms, medium 80ms and long 150ms; below about 40ms the words blur into one reveal.
- How each word appears: **Fade up** · Fade · Grow · Blur · Flip. The entrance each word plays: fade up, fade, grow, blur or flip.
- Speed: Slow · **Normal** · Fast. How long each word takes to settle: slow is 700ms, normal 450ms and fast 270ms.
- Feel: **Smooth** · Springy · Even. Smooth slows each word into place; Springy adds a bounce; Even feels mechanical.
- Pauses between sentences: on · **off**. Adds an extra pause between sentences.
- Your text: text box, starts with the lines "We build interfaces that disappear.", "Tools that feel inevitable." and "Software made with care.". The passage that is revealed, one sentence per line.

## Blur In

Comes into focus from a blur, like a camera. Best for featured cards and photos.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/blur-in/
- How it runs: plays once
- Good for: Featured cards · Photos · Pop-ups · Portfolio pieces
- Avoid on: Lists and grids · Small text

**Prompt**

Add a blur-in entrance to [the element you want to animate]. It should come into view like a camera pulling focus onto the subject: sharpening from a blur makes it feel like a lens finding its subject, and fading in at the same time makes it feel like it is arriving. It can also drift up slightly as it settles. Use it on one focal element at a time, not on a list or grid, because blur is expensive for the browser to draw. Remove the blur completely once the animation ends. If the visitor has reduced motion turned on, show the element sharp and visible without the effect. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- How blurry it starts: Slight · **Medium** · Heavy. How much blur it starts with: slight is 8px, medium 20px and heavy 35px; past about 30px it looks like frosted glass.
- Speed: Slow · **Normal** · Fast. How long it takes: slow is 1100ms, normal 700ms and fast 400ms; blur needs a little longer than a plain fade for the lens feel to land.
- What changes: **Blur and fade** · Blur only · Fade only. The full effect; Blur only and Fade only show each half on its own.
- Feel: **Smooth** · Gentle · Even. Smooth slows down like a lens settling; Gentle eases in and out; Even feels robotic.
- Drifts up: **on** · off. A small rise while it sharpens, as if it is settling into place; only with Blur and fade.

## Flip In

Swings into view in 3D, like a card turning over. Best for cards and tiles.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/flip-in/
- How it runs: plays once
- Good for: Cards · Flashcards and tiles · Dashboard panels · Onboarding steps
- Avoid on: Text blocks · Full-page sections

**Prompt**

Add a 3D flip-in entrance to [the card you want to animate]. The card should start turned away from the viewer and swing toward them until it faces them flat. Give the card's container a 3D perspective so the swing has real depth; without it, the flip looks like a flat squash. The hinge can sit in the middle or along one edge, and the card can fade in while it turns. If the visitor has reduced motion turned on, show the card facing forward without the flip. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Swing direction: **Sideways** · Up and down · Diagonal. Which way it swings: sideways around an upright hinge like a door, up and down like a flap, or diagonally.
- Hinge: **Center** · Top · Bottom · Left. Where it turns from; an edge makes it swing from that side.
- Speed: Slow · **Normal** · Fast. How long the swing takes: slow is 1000ms, normal 600ms and fast 350ms.
- How far it turns: A little · **¼ turn** · ½ turn. The angle it starts from: a little (45°), a quarter turn (90°, edge-on) or half a turn (180°, facing away).
- 3D depth: Subtle · **Medium** · Strong. How close the viewer seems: subtle is 2000px, medium 1000px and strong 400px; closer is more dramatic.
- Feel: **Smooth** · Springy · Gentle · Even. Smooth slows the swing as it comes to face you; Springy adds a settle; Gentle eases in and out; Even keeps one steady pace.
- Fades in: **on** · off. Fades it in while it turns.

## Bounce In

Lands with a springy bounce. Best for badges and success messages.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/bounce-in/
- How it runs: plays once
- Good for: Success messages · Badges · Small pop-ups · Playful brands
- Avoid on: Formal content · Large panels

**Prompt**

Add a bounce-in entrance to [the element you want to animate]. When it appears, it should start small and a little below its final spot, grow slightly past full size, dip just under it, then settle, as if it landed with a small spring. Each bounce is smaller than the one before, like energy running out, and one bounce usually looks best. Unless the settings turn it off, fade it in at the same time. Animate only its position, size and opacity so it stays smooth. If the visitor has reduced motion turned on, show the element without the bounce. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Bounce strength: Soft · **Medium** · Strong. How far past full size it grows: soft about 5%, medium 9% and strong 15%, with smaller dips back under.
- Number of bounces: **One** · Two · Three. How many times it overshoots; almost always one, since more looks cartoonish.
- Speed: Slow · **Normal** · Fast. How long it takes: slow is 1800ms, normal 1100ms and fast 650ms; too short and the spring reads as a jitter.
- Fades in: **on** · off. Whether it fades in while it bounces or is visible from the start.

## Rotate In

Spins into place while it grows. Best for icons, stars and badges.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/rotate-in/
- How it runs: plays once
- Good for: Icons · Badges and stars · Logos · Small decorations
- Avoid on: Text · Wide boxes and cards

**Prompt**

Add a rotate-in entrance to [the icon or badge you want to animate]. It should spin around its center as it appears. Growing from small at the same time makes it look like it is arriving rather than just turning, and a slight overshoot at the end makes the spin land instead of gliding to a stop. Use this on round or symmetric shapes like icons, stars, gears and badges; it looks wrong on text or wide rectangles. If the visitor has reduced motion turned on, show it in place without spinning. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- How much it spins: ¼ turn · **½ turn** · Full turn. How far it turns on the way in: a quarter turn, half a turn or a full turn.
- Speed: Slow · **Normal** · Fast. How long the spin takes: slow is 1000ms, normal 600ms and fast 350ms.
- Spin direction: **Clockwise** · Counter-clockwise. Which way it turns as it lands.
- Bounce at the end: **on** · off. Goes slightly past its resting angle and settles back, so the spin lands instead of gliding to a stop.
- Grows from small: **on** · off. Starts tiny and grows while it spins, which turns a spin into an arrival.
- Fades in: **on** · off. Fades in as it spins instead of appearing at once.

## Shatter Effect

Breaks into pieces that fly apart and fade. Best for galleries and bold exits.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/shatter-effect/
- How it runs: plays once
- Good for: Photo galleries · Dismissed cards · Game moments · Bold intros
- Avoid on: Things shown often · Calm, serious pages

**Prompt**

Add a shatter effect to [the card or picture you want to break]. When it plays, the card breaks into uneven pieces that burst away from the point of impact, each turning as it flies and fading out, while the next card fades in behind them. Make each piece a copy of the whole card trimmed to its own shape, so together they look exactly like the card until they move, and launch the pieces nearest the impact first. Move and turn the pieces rather than resizing them so it stays smooth, and remove them once they have faded. If the visitor has reduced motion turned on, fade the card out and the next one in, with no pieces. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Number of pieces: Few · **Medium** · Many. How finely the card breaks: few is about 15 pieces in two rings, medium about 30 in three and many 60 in four (about 46 on phones).
- Breaks from: **Center** · Corner. Where the impact is: near the middle (moved a little at random each time) or near the top-left corner; the pieces there are the smallest and fly first.
- Gravity: None · **Normal** · Heavy. None lets the pieces drift straight outward; normal throws them up a little before they fall; heavy drops them out of view.
- Speed: Slow · **Normal** · Fast. How long each piece's flight takes: slow is 1700ms, normal 1100ms and fast 700ms; the cracks take about a third of that before the break.
- Shows the cracks: **on** · off. Draws the cracks across the card, ring by ring from the impact, before it breaks; off, it breaks at once.
- Tumbles in 3D: **on** · off. The pieces flip over and fly toward the viewer; off, they spin flat.
