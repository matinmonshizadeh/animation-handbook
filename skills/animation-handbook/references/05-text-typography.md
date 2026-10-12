# 05 · Text & Typography

Animations specifically for type — kinetic motion, character-level effects, gradient flows, and word transformations. 19 animations from Animation Handbook, in the home page's order. Each entry gives the live demo, how it runs, what it is good for and what to avoid it on, the prompt from its page word for word, and its settings with what each does and the demo's values.

## Contents

- [Kinetic Typography](#kinetic-typography)
- [Typewriter Effect](#typewriter-effect)
- [Scramble / Glitch Text](#scramble--glitch-text)
- [Variable Font Morph](#variable-font-morph)
- [Text Clip-Path Reveal](#text-clip-path-reveal)
- [Marquee / Ticker](#marquee--ticker)
- [Text Morphing](#text-morphing)
- [Text Gradient Animation](#text-gradient-animation)
- [Outline to Fill](#outline-to-fill)
- [Enter/Exit Typography](#enterexit-typography)
- [Rotate Word Carousel](#rotate-word-carousel)
- [Glitch Text](#glitch-text)
- [Text on a Path](#text-on-a-path)
- [Wavy Text](#wavy-text)
- [Highlighter Sweep](#highlighter-sweep)
- [Split-Flap Board](#split-flap-board)
- [Neon Flicker](#neon-flicker)
- [Handwriting Draw](#handwriting-draw)
- [Text Particles](#text-particles)

## Kinetic Typography

Words arrive and leave one by one, each moving its own way. Best for intros.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/05-text-typography/kinetic-typography/
- How it runs: plays once
- Good for: Intros · Splash screens · Story sections · Presentations
- Avoid on: Forms and menus · Long text

**Prompt**

Add a kinetic typography sequence to [the short phrases you want to show]. Show one phrase at a time and give each an entrance and an exit that fit its meaning: a heavy word can drop in large, a soft word can simply fade, a quick word can slide. Hold each phrase long enough to be read, and use size and color so the key words stand out. Leave the final phrase on screen when the sequence ends. Screen readers should hear each phrase as plain text. If the visitor has reduced motion turned on, show the phrases without movement. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. The pace of the whole sequence: slow plays it at 0.6× speed, normal at 1× and fast at 1.7×; entrances, holds and exits all scale together, and at normal entrances take 400 to 700ms, holds 0.9 to 2.2 seconds and exits 300 to 500ms.

## Typewriter Effect

Text types itself out behind a blinking cursor. Best for short taglines.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/05-text-typography/typewriter-effect/
- How it runs: plays once
- Good for: Taglines · Chat messages · Terminal screens · Short intros
- Avoid on: Long text · Buttons and labels

**Prompt**

Add a typewriter effect to [your tagline or short text]. The text should appear one character at a time, as if someone is typing it, with a blinking cursor always just after the last character. Unless the settings turn it off, vary the time between keystrokes slightly so it feels typed by a person rather than a machine. When the settings include it, back up over the last word and type a new ending. Keep it to short text, because long text is slow to wait for. Screen readers should hear the full text once, not each character. If the visitor has reduced motion turned on, show the full text immediately. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. The time between keystrokes: slow is 80ms, normal 50ms and fast 30ms; about 80 to 120ms feels like a natural pace.
- Cursor shape: **Line** · Block · Underscore. A block reads as a terminal, a line as a text editor, an underscore as an old computer screen.
- Deletes and retypes: on · **off**. Types the text, backs up over the last word at about 30ms a character, then types it again with a new ending.
- Types like a person: **on** · off. Moves each keystroke up to 20ms earlier or later so the rhythm is uneven, like real typing.
- Cursor color: **Pink** · White · Blue · Purple · Green · Orange. The cursor's color; pick one that stands out from the text.
- Your text: text field, starts as "Typography is the art and craft of arranging type. Good type communicates before it decorates.". The text that is typed; short lines work best.

## Scramble / Glitch Text

Random symbols lock into the real text, left to right. Best for tech headlines.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/05-text-typography/scramble-text/
- How it runs: plays once
- Good for: Tech headlines · Loading screens · Game titles
- Avoid on: Long text · Calm brands

**Prompt**

Add a scramble effect to [your headline or short phrase]. Each letter should start as a random character and keep flickering through random characters until it locks into the real letter. Lock the letters in reading order, from left to right, so the text becomes readable bit by bit, as if it is being decoded. Capital letters scramble most cleanly. Screen readers should hear the final text once, never the random characters. If the visitor has reduced motion turned on, show the final text immediately. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Random characters: Alphabet · **Symbols** · Numbers · Japanese · Mixed. What the letters flicker through: symbols look like hacking, Japanese characters look like the falling code in science-fiction films, and the alphabet or numbers look like a password being cracked; mixed draws from letters, numbers and symbols together.
- Delay between letters: Short · **Medium** · Long. The wait between one letter locking and the next: short is 40ms, medium 70ms and long 120ms; it sets how fast the decoding travels.
- Flicker speed: Slow · **Normal** · Fast. How often the random characters change: slow every 65ms, normal every 40ms and fast every 25ms; faster looks more chaotic.
- Your text: text field, starts as "DECODE THE MESSAGE". The text that is decoded, shown in capitals.

## Variable Font Morph

A word smoothly turns bold, then light, and leans over. Best for headlines.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/05-text-typography/variable-font-morph/
- How it runs: moves by itself
- Good for: Headlines · Logos · Loading text
- Avoid on: Body text · Small text

**Prompt**

Add a variable font morph to [your headline or word]. Use a variable font, which holds a whole range of weights in one file, and change the weight smoothly so the letters grow heavier and lighter as you watch, moving through a few styles in turn and resting briefly on each. When the settings include it, the word also leans over during some changes: a font with its own slant does this best, and a slight tilt works for fonts without one. Change the weight through the font itself, not by scaling, so the text stays sharp. If the visitor has reduced motion turned on, keep the word in one style. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. How long each change takes: slow is 1000ms, normal 600ms and fast 350ms; the word then rests for 800ms before the next.
- Leans as it changes: **on** · off. Some changes also tilt the word by up to 15 degrees; off, only the weight changes.
- Your text: text field, starts as "Type". The word that changes.

## Text Clip-Path Reveal

Each line of a headline is uncovered in turn. Best for big headlines.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/05-text-typography/text-clip-path-reveal/
- How it runs: plays once
- Good for: Headlines · Taglines · Portfolios
- Avoid on: Body text · Buttons and labels

**Prompt**

Add a line-by-line reveal to [your multi-line headline]. Lay out every line in its final place from the start, then uncover each line with a wipe that grows from one side until the whole line shows, starting each line a moment after the one above so the headline cascades in. Nothing moves or changes size; only the visible part of each line grows, so the letter spacing stays exactly as designed. A wipe that slows down as it finishes looks calmer than one that stops abruptly. The text must stay readable by screen readers the whole time. If the visitor has reduced motion turned on, show all the lines at once. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Starts from: **Left** · Right · Top. The side each line's wipe begins on: left follows the reading order, right suits right-to-left scripts, top works for display headings.
- Speed: Slow · **Normal** · Fast. How long each line takes to uncover: slow is 1100ms, normal 700ms and fast 400ms.
- Delay between lines: Short · **Medium** · Long. The wait before each next line starts: short is 100ms, medium 180ms and long 300ms; 100 to 200ms reads as a natural cascade.
- Feel: **Smooth** · Gentle · Even. Smooth slows to a stop, which feels physical; Gentle eases in and out; Even keeps one steady pace, which feels mechanical.
- Your lines: text box, starts with the lines "Good design", "Is honest" and "Always.". The headline, one line per row.

## Marquee / Ticker

Text scrolls sideways in an endless loop, with no seam. Best for news tickers.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/05-text-typography/marquee-ticker/
- How it runs: moves by itself
- Good for: News tickers · Brand strips · Client lists
- Avoid on: Important messages · Long sentences

**Prompt**

Add a marquee to [the text or items you want to scroll]. The text should scroll sideways in an endless loop with no visible jump: place two identical copies side by side, each at least as wide as the space it scrolls through, and move them by exactly one copy's width before starting over. Put a small mark between the repeats. Rows can run in opposite directions for a decorative band. Pointing at a row should stop it so people can read it, and a tap should do the same on touch screens. Screen readers should not announce the moving text again and again. If the visitor has reduced motion turned on, keep the text still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. How fast the text travels: slow is 50px, normal 80px and fast 130px per second; news tickers run slower, brand strips faster.
- Text size: Small · **Medium** · Large. Small is 32px, medium 48px and large 64px; large type is the usual choice for brand strips.
- Space between items: Tight · **Medium** · Wide. The space around each repeat of the text and its separator: tight is 24px, medium 48px and wide 80px.
- Separator: "Dot ·" · Star ★ · Dash — · **Sparkle ✦**. The mark between repeats: a dot, a star, a dash or a sparkle.
- Your text: text field, starts as "Animation Handbook". The text that scrolls.

## Text Morphing

One word changes into the next, letter by letter. Best for short labels.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/05-text-typography/text-morphing/
- How it runs: moves by itself
- Good for: Short labels · Status words · Hero headlines
- Avoid on: Long words · Sentences

**Prompt**

Add a letter-by-letter morph to [the word that should change, and the words it cycles through]. Split each word into letters. To change words, slide the current letters out of sight in one direction, then slide the next word's letters in from the opposite side; a small delay between letters, when the settings include one, sends the change across the word like a wave. Hold each word long enough to read, then morph to the next and repeat the list. Words of similar length look cleanest. Screen readers should hear each new word once, not its letters. If the visitor has reduced motion turned on, swap the words without movement. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Slide direction: **Up** · Down · Left · Right. Up and down look like a slot machine, each letter sliding its own height; left and right slide sideways, 80% of a letter's width; the letters fade out and in as they slide.
- Delay between letters: **None** · Short · Long. The gap between one letter moving and the next: none, short (30ms) or long (60ms); none moves every letter together, a delay makes a wave.
- Speed: Slow · **Normal** · Fast. How long each letter takes to slide: slow is 650ms, normal 400ms and fast 250ms.
- Time on each word: Short · **Medium** · Long. How long each word stays: short is 900ms, medium 1500ms and long 2400ms; it must be long enough to read.
- Your words, one per line: text box, starts with the lines "OCEAN", "RIVER", "STORM", "LIGHT" and "SOUND". The words that take turns, shown in capitals.

## Text Gradient Animation

Colors flow through the letters while the text stays still. Best for headlines.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/05-text-typography/text-gradient-animation/
- How it runs: moves by itself
- Good for: Headlines · Logos · Hero titles
- Avoid on: Body text · Small text

**Prompt**

Add a flowing color gradient to [your headline or logo text]. Fill the letters with a gradient instead of a flat color: paint the gradient as the text's background, show it only inside the letter shapes, and make the text color itself see-through. Then keep moving the gradient behind the letters, or turn it like a color wheel, so color flows through the word while the letters stay still. End the gradient with the color it starts with so the loop has no seam. Give the text a solid fallback color for browsers that cannot clip a background to text. If the visitor has reduced motion turned on, keep the gradient still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Gradient: **Flowing** · Spinning · Diagonal · Two colors. Flowing slides the colors sideways, Spinning turns them like a color wheel, Diagonal slides slanted bands, Two colors flows between two colors of your choice.
- Speed: Slow · **Normal** · Fast. How long one loop takes: slow is 6.4s, normal 4s and fast 2.4s; in each loop the gradient, three times as wide as the text, slides left by twice its own width, and a spinning one turns once; slower feels calm, faster feels lively.
- First color: Pink · White · **Blue** · Purple · Green · Orange (the page shows it only for some choices of another setting). With Two colors, the color the gradient starts and ends with.
- Second color: Pink · White · Blue · **Purple** · Green · Orange (the page shows it only for some choices of another setting). With Two colors, the color in the middle.
- Your text: text field, starts as "Flow". The text the colors flow through.

## Outline to Fill

Hollow letters fill with color, as a wipe or a fade. Best for big headlines.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/05-text-typography/outline-to-fill/
- How it runs: plays once
- Good for: Big headlines · Logos · Posters · Section titles
- Avoid on: Small text · Body text

**Prompt**

Add an outline-to-fill effect to [your headline or logo word]. The text should start hollow, with only the outline of each letter showing, then fill with color. The fill can wipe in from one side, like paint, or fade in everywhere at once, like ink soaking through. Draw the outline and the filled text as two layers in exactly the same place so the letters never shift. Use large, heavy letters so there is enough inside each one to fill. The text must stay readable by screen readers. If the visitor has reduced motion turned on, show the filled text straight away. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Fill direction: **Bottom up** · Top down · Left to right · Right to left · From the middle. Where the wipe starts: the bottom, the top, the left, the right or the middle; bottom up reads like filling a container, left to right like writing. The fade has no direction.
- Speed: Slow · **Normal** · Fast. How long the fill takes: slow is 1500ms, normal 900ms and fast 550ms.
- Outline thickness: Thin · **Medium** · Thick. How wide the outline is: thin is 1px, medium 2px and thick 4px; thin looks precise, thick looks bold.
- Feel: Smooth · **Gentle** · Even. Gentle eases in and out; Smooth slows to a stop; Even keeps one steady pace.
- Outline color: **Pink** · White · Blue · Purple · Green · Orange. The color of the letters' outline.
- Fill color: **Pink** · White · Blue · Purple · Green · Orange. The color that fills the letters.
- Your text: text field, starts as "OUTLINE". The word that fills, up to 10 letters, shown in capitals.

## Enter/Exit Typography

Each phrase comes in, stays long enough to read, then leaves. Best for slogans.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/05-text-typography/enter-exit-typography/
- How it runs: plays once
- Good for: Intros · Brand statements · Hero messages · Screens and signage
- Avoid on: Long sentences · Key information

**Prompt**

Add an enter-and-exit text sequence to [the short phrases you want to show]. Show one phrase at a time in the same place: each phrase comes in, holds still long enough to be read, then leaves before the next one arrives. Give each phrase its own way in and out, such as sliding, growing, blurring or wiping, and let each exit lead into the next entrance so the sequence feels connected. Leave the last phrase on screen when the sequence ends. Screen readers should hear each phrase as it appears. If the visitor has reduced motion turned on, swap the phrases without movement. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Entrance speed: Slow · **Normal** · Fast. How long each phrase takes to arrive: slow is 800ms, normal 500ms and fast 300ms; fast feels energetic, slow feels deliberate.
- Time on each phrase: Short · **Medium** · Long. How long each phrase holds still: short is 1200ms, medium 2000ms and long 3200ms; it must be longer than it takes to read the phrase.
- Exit speed: Slow · **Normal** · Fast. How long each phrase takes to leave: slow is 650ms, normal 400ms and fast 250ms; exits are usually shorter than entrances.

## Rotate Word Carousel

One word in a sentence keeps swapping for the next. Best for hero headlines.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/05-text-typography/rotate-word-carousel/
- How it runs: moves by itself
- Good for: Hero headlines · Taglines · Service lists
- Avoid on: Body text · Long word lists

**Prompt**

Add a rotating word to [your headline, with the word that should change]. Keep the rest of the sentence still and swap only that one word: the current word slides out of sight and the next one slides in from the opposite side, clipped by an invisible box so it seems to come from behind the text. Hold each word long enough to read, then move on, repeating the list forever. Words of similar length keep the sentence from jumping. Screen readers should hear each new word once. If the visitor has reduced motion turned on, swap the words without sliding. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Slide direction: **Up** · Down · Left · Right. Up and down move the word like a slot machine; left and right slide it sideways; each slide moves the word 110% of its own height or width while it fades out or in.
- Speed: Slow · **Normal** · Fast. How long each slide takes, once for the word going out and again for the next one coming in: slow is 650ms, normal 400ms and fast 250ms.
- Time on each word: Short · **Medium** · Long. How long each word stays: short is 1200ms, medium 2000ms and long 3200ms; 1.5 to 3 seconds is the readable range.
- Different color per word: **on** · off. A new color for each word draws attention to the change; one color is calmer.
- Your sentence: text field, starts as "We craft for". The part of the headline that stays still.
- Your words, one per line: text box, starts with the lines "Designers", "Developers", "Humans", "Teams" and "Startups". The words that take turns.

## Glitch Text

Text tears into red and cyan strips like a broken signal. Best for bold titles.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/05-text-typography/glitch-text/
- How it runs: moves by itself
- Good for: Bold titles · Music and games · Error pages
- Avoid on: Long text · Calm brands

**Prompt**

Add a glitch effect to [your headline or short word]. Place two copies of the text behind it, one tinted red and one tinted cyan, shifted to either side, and show only thin horizontal strips of each copy, changing which strips show so the colors seem to tear away from the letters like a broken video signal. Every so often, nudge the whole word sideways for a moment and reshuffle the strips so the pattern never repeats. Keep it below a few flickers per second and avoid full-screen flashes. If it only glitches on hover, a tap should start and stop it on touch screens. If the visitor has reduced motion turned on, keep the word still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Color split: Small · **Medium** · Large. How far the red and cyan copies sit from the word: small is 2px, medium 4px and large 8px, and each copy casts a shadow in its own color as far again beyond it.
- Speed: Slow · **Normal** · Fast. How long the strips take to run through their pattern: slow is 3.8s, normal 2.4s and fast 1.4s; shorter looks more frantic.
- Glitch strength: Mild · **Medium** · Strong. How hard the word shakes and how often the strips reshuffle: about every quarter second the word jumps up to 1.8px to either side at mild, 3.6px at medium and 5.4px at strong, and the strips jump to a random point in their pattern about 1.5, 2.5 or 3 times a second.
- Glitches only on hover: on · **off**. Holds the word still until you point at it; on touch screens a tap starts and stops it.
- Your text: text field, starts as "GLITCH". The word that glitches, up to 12 letters, shown in capitals.

## Text on a Path

Text travels along a wave, an arc or a circle. Best for badges and seals.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/05-text-typography/text-on-path/
- How it runs: moves by itself
- Good for: Badges and seals · Playful titles · Decorations
- Avoid on: Long text · Key information

**Prompt**

Add text that travels along a curve to [your short phrase]. Define the curve once and attach the text to it so every letter sits on the line, then keep moving the point where the text starts so the letters travel along the curve like a ticker bent into shape. Repeat the phrase, with a separator such as a dot, until it covers the whole curve, and wrap around by exactly one copy so the loop has no jump. Keep the curve gentle enough that letters do not crowd on sharp bends. If the visitor has reduced motion turned on, show the text still on the curve. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Path shape: **Wave** · Arc · Circle. The curve the text follows: a wave, an arc or a full circle.
- Speed: Slow · **Normal** · Fast. How far the text moves every sixtieth of a second: slow is 0.25%, normal 0.4% and fast 0.65% of the path (15%, 24% and 39% a second).
- Shows the path: **on** · off. Draws the curve as a dashed line under the text.
- Your text: text field, starts as "FOLLOW THE CURVE ·". The phrase that travels; end it with a separator so the repeats read on.

## Wavy Text

A wave rolls through the word, letter by letter. Best for playful titles.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/05-text-typography/wavy-text/
- How it runs: moves by itself
- Good for: Playful titles · Games and kids' sites · Loading text
- Avoid on: Serious content · Long text

**Prompt**

Add a wavy text effect to [your word or short title]. Split the text into letters and make every letter bob up and down with the same smooth motion, but start each letter a moment after the one before it, so the high point of the wave rolls from the first letter to the last and around again. Keep the letters on one line, and move them only up and down, never changing their size or spacing. Screen readers should read the word once, not letter by letter. If the visitor has reduced motion turned on, keep the letters still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Wave height: Low · **Medium** · High. How high each letter rises above its resting place: low is 8px, medium 16px and high 28px, and it sinks 0.6 times as far below it; larger makes a taller wave.
- Speed: Slow · **Normal** · Fast. How long one rise and fall takes: slow is 2.6s, normal 1.6s and fast 1s.
- Delay between letters: Short · **Medium** · Long. The gap between neighboring letters: short is 30ms, medium 60ms and long 120ms; longer delays stretch the wave.
- Your text: text field, starts as "Wavy". The word that waves, up to 14 letters.

## Highlighter Sweep

A marker sweeps in behind the key words, one after another. Best for key points.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/05-text-typography/highlighter-sweep/
- How it runs: plays once
- Good for: Key points · Quotes · Headlines · Study notes
- Avoid on: Long paragraphs · Too many words

**Prompt**

Add a highlighter sweep to [the key words in your paragraph or quote]. Behind each key phrase, a band of marker color grows from left to right, as if drawn with a highlighter pen, and the phrases are marked one after another in reading order. Draw the band behind the text, never over it, and grow it by scaling it from its left edge, so the words never move or reflow. When a phrase wraps onto a second line, sweep each line in turn, as one continuous stroke. Keep the words dark enough to read on the marker color. If the visitor has reduced motion turned on, fade the highlights in instead of sweeping them. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Marker color: **Yellow** · Pink · Green · Blue · Orange. The color of the bands: yellow, pink, green, blue or orange, all light enough for the dark words to stay easy to read.
- Speed: Slow · **Normal** · Fast. How long the marker takes to cross one phrase: slow is 1300ms, normal 700ms and fast 400ms, with a 250ms pause between phrases.
- How much it covers: **Whole words** · Lower half. Whole words covers the letters from just under their tops, with the band starting 12% of the font size below the top of the text; Lower half starts it 62% down, so it covers only the bottom of the letters, like a thick underline.

## Split-Flap Board

Tiles flip through the letters to spell a word, like an airport board. Best for hero titles.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/05-text-typography/split-flap-board/
- How it runs: plays once
- Good for: Hero titles · Travel sites · Event intros · Retro designs
- Avoid on: Long text · Calm pages

**Prompt**

Add a split-flap board to [your headline or short word]. Show each letter on its own tile, split across the middle like an old airport departures board. To change a tile, flip it through the alphabet one letter at a time until it reaches its letter: the top half of the old letter falls forward over the hinge, turning in 3D and darkening as it turns, and the bottom half of the next letter swings down into place. Start the tiles a moment apart from left to right, so they settle one by one. Turn the halves with transforms only, and let screen readers hear the final word once. If the visitor has reduced motion turned on, fade the letters in instead. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Word: text field, starts as "BOARDING". The word on the board: up to 10 letters from A to Z, and a space leaves a blank tile.
- Flip speed: Slow · **Normal** · Fast. How long one flip takes: slow is 150ms, normal 85ms and fast 45ms; each tile starts 40ms after the one on its left.
- Tile color: **Black** · Blue · Red · Green · Cream. The color of the tiles: black, blue, red or green with light letters, or cream with dark letters.

## Neon Flicker

Glowing letters sputter now and then, like a worn neon sign. Best for night themes.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/05-text-typography/neon-flicker/
- How it runs: moves by itself
- Good for: Signs and logos · Night and bar themes · Music and events · Retro sites
- Avoid on: Long text · Calm, serious pages

**Prompt**

Add a neon sign effect to [your sign word or short title]. Draw the letters as bright tubes with a soft colored glow, a faint wash of the same color on the wall behind, and a dim, unlit copy of the letters underneath. Now and then, make the light stutter: drop it to almost nothing and back a few times, at uneven moments so it never looks like a loop. When the settings include it, let one letter buzz and go dark on its own. Flicker the lit layers by changing their opacity alone, in sharp steps; draw the glow once and never animate it. Keep it below three flashes a second. If the visitor has reduced motion turned on, keep the glow steady. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Color: **Pink** · Blue · Green · Amber · Purple. The color of the tubes, their glow and the wash on the wall.
- How often it flickers: Calm · **Normal** · Busy. Calm: two short bursts in a 9 second cycle. Normal: four bursts in 7 seconds. Busy: six bursts in 6 seconds, one of them a longer drop out of about 0.4 seconds.
- Broken letter: **on** · off. One letter a little past the middle of the word buzzes and drops out on its own cycle.
- Glow size: Small · **Medium** · Large. How far the light spreads: small, medium or large sets of glow layers, whose widest blur is 0.12 times the font size at small, 0.42 at medium and 1.1 at large.
- Frame around the word: **on** · off. Adds a rounded tube border that glows and flickers with the letters.
- Your text: text field, starts as "OPEN". The word on the sign, up to 10 letters, with spaces at its ends dropped; it shrinks to fit the stage, and an emptied field goes back to OPEN.

## Handwriting Draw

A word writes itself stroke by stroke, as if by a pen. Best for greetings and signatures.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/05-text-typography/handwriting-draw/
- How it runs: plays once
- Good for: Greetings and thank-you notes · Signatures · Page intros · Invitations
- Avoid on: Long text · Small text

**Prompt**

Add a handwriting animation to [your word or signature, drawn as single SVG lines]. Write it with pen lines instead of filled letters, split into strokes in the order a person writes them: the joined letters first, then the dots on the i's and the crosses on the t's. Hide each stroke behind a dash as long as itself and slide the dash away, one stroke after another, at one steady pen speed, so longer strokes take longer, with a short pause where the pen lifts. When the settings include it, let a small pen ride on the tip of the line. Screen readers should get the word as text. If the visitor has reduced motion turned on, fade the finished word in instead. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Word: **hello** · thanks · hi there. Which word is written: hello is one stroke, thanks is two (the word, then the cross on the t) and hi there is four (hi, the dot, there, the cross).
- Pen speed: Slow · **Normal** · Fast. How far the pen travels in a second: slow is 200 units, normal 400 and fast 800, where a small letter is 28 units tall; a word takes about 1 to 5 seconds.
- Ink color: **Blue** · Black · Red · Green. The color of the ink, and of the pen.
- Pen size: Fine · **Medium** · Bold. How wide the line is: fine is 1.1 units, medium 1.8 and bold 2.8, where a small letter is 28 units tall.
- Shows the pen: **on** · off. A small pen rides on the tip of the line and lifts between strokes.

## Text Particles

A word of dots scatters from your pointer and springs back. Best for intros.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/05-text-typography/text-particles/
- How it runs: reacts to the visitor
- Good for: Hero titles · Page intros · Portfolios · Launch pages
- Avoid on: Long text · Small text

**Prompt**

Add a text particle effect to [the word or short title you want to animate]. Sample the word's pixels from a hidden canvas on an even grid, placing a dot wherever a letter covers it. Push the dots near the pointer away, so they glow as they fly, and tie each to its home with a spring, so it flies back with a slight wobble once the pointer moves on. Run one frame loop that moves by elapsed time, stop it once every dot is home, and draw fewer dots on phones. On touch screens, a dragged finger pushes the dots the same way. With reduced motion turned on, keep the dots still and only light up those near the pointer. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Dot size: Small · **Medium** · Large. How far apart the dots sit: small is 3 px, medium 4.2 and large 6 for a 180 px font, scaled with the word between 0.75 and 1.25 times; each dot is about three quarters of that step wide, so neighbors never touch. The dots are counted at the small size: past 2,000 on a phone or 6,000 on a larger screen, every size is spread out by the same factor, so the three stay apart.
- How far they scatter: Short · **Medium** · Far. The pointer's reach: short is 0.28 of the font size, medium 0.42 and far 0.65, counting the font as at least 120 px; a still pointer opens a gap whose radius is about 0.7 of the reach.
- Colors: **Sunset** · Cool · Rainbow · White. The colors across the word, in 32 steps: Sunset runs from pink to gold, Cool from teal to purple, Rainbow through seven colors and White from white to pale gray; the glow behind the word matches.
- How fast they come back: Slow · **Normal** · Fast. The spring and the share of its speed a dot keeps each step: slow is 0.022 and 0.87, normal 0.045 and 0.82, fast 0.09 and 0.76. A dot pushed 100 px away is home in about 1.4, 1 or 0.8 seconds, after swinging about a sixth of the way past it.
- Your text: text field, starts as "HELLO". The word, up to 10 letters, drawn as large as fits 86% of the stage's width and 42% of its height; an emptied field goes back to HELLO.
