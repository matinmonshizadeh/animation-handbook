# 05 — Text & Typography

Animations specifically for type — where the letterforms themselves are the content and the motion serves the words.

## Animations

| Demo | Description |
|------|-------------|
| [Kinetic Typography](kinetic-typography/) | Words arrive and leave one by one, each moving its own way. Best for intros. |
| [Typewriter Effect](typewriter-effect/) | Text types itself out behind a blinking cursor. Best for short taglines. |
| [Scramble / Glitch Text](scramble-text/) | Random symbols lock into the real text, left to right. Best for tech headlines. |
| [Variable Font Morph](variable-font-morph/) | A word smoothly turns bold, then light, and leans over. Best for headlines. |
| [Text Clip-Path Reveal](text-clip-path-reveal/) | Each line of a headline is uncovered in turn. Best for big headlines. |
| [Marquee / Ticker](marquee-ticker/) | Text scrolls sideways in an endless loop, with no seam. Best for news tickers. |
| [Text Morphing](text-morphing/) | One word changes into the next, letter by letter. Best for short labels. |
| [Text Gradient Animation](text-gradient-animation/) | Colors flow through the letters while the text stays still. Best for headlines. |
| [Outline to Fill](outline-to-fill/) | Hollow letters fill with color, as a wipe or a fade. Best for big headlines. |
| [Enter/Exit Typography](enter-exit-typography/) | Each phrase comes in, stays long enough to read, then leaves. Best for slogans. |
| [Rotate Word Carousel](rotate-word-carousel/) | One word in a sentence keeps swapping for the next. Best for hero headlines. |
| [Glitch Text](glitch-text/) | Text tears into red and cyan strips like a broken signal. Best for bold titles. |
| [Text on a Path](text-on-path/) | Text travels along a wave, an arc or a circle. Best for badges and seals. |
| [Wavy Text](wavy-text/) | A wave rolls through the word, letter by letter. Best for playful titles. |
| [Neon Flicker](neon-flicker/) | Glowing letters sputter now and then, like a worn neon sign. Best for night themes. |

## Key principles

**Motion serves the words.** Every typographic animation should reinforce the meaning of the copy — a fragile word dissolves, a bold word snaps in, a soft word drifts. Generic transforms applied uniformly undermine the technique.

**Hold duration is critical.** The hold phase is where reading happens; enter and exit are punctuation. A 3-word phrase needs at least 600–800ms of hold. The most common mistake is making phrases too brief to read.

**Preserve typographic quality.** Clip-path reveals and whole-word techniques leave kerning and spacing untouched. Character-splitting (scramble, morph, stagger) can disrupt spacing — test at the intended font size.

**Reduced motion.** All demos show full text without motion when `prefers-reduced-motion: reduce` is set. Never hide or remove text as a reduced-motion fallback — only remove the animation.

## See also
- [02 — Entrance & Exit](../02-entrance-and-exit/) — element-level enter/exit including text-specific techniques like letter-by-letter stagger and word-by-word reveal
- [04 — Micro-Interactions](../04-micro-interactions/) — includes typewriter-adjacent patterns like the floating label
