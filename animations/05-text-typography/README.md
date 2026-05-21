# 05 — Text & Typography

Animations specifically for type — where the letterforms themselves are the content and the motion serves the words.

## Animations

| Demo | Description |
|------|-------------|
| [Kinetic Typography](kinetic-typography/) | Phrases enter, transform, and exit in a choreographed timeline |
| [Typewriter Effect](typewriter-effect/) | Characters appear one at a time with a blinking cursor and natural timing variance |
| [Scramble / Glitch Text](scramble-text/) | Characters cycle randomly before locking left-to-right — decryption aesthetic |
| [Variable Font Morph](variable-font-morph/) | CSS font-variation-settings animates weight, slant, and casual axes |
| [Text Clip-Path Reveal](text-clip-path-reveal/) | Lines reveal via expanding clip-path — preserves kerning and typographic spacing |
| [Marquee / Ticker](marquee-ticker/) | Continuous horizontal scroll with seamless loop via duplicated content |
| [Text Morphing](text-morphing/) | One word transitions into another character by character |
| [Text Gradient Animation](text-gradient-animation/) | background-clip: text with animated background-position flows color through characters |
| [Outline to Fill](outline-to-fill/) | Hollow stroke letterforms fill with color via clip-path or opacity crossfade |
| [Enter/Exit Typography](enter-exit-typography/) | Three-act phrase lifecycle: enter → hold → exit, sequenced for storytelling |
| [Rotate Word Carousel](rotate-word-carousel/) | One keyword cycles through a list while the surrounding sentence stays static |

## Key principles

**Motion serves the words.** Every typographic animation should reinforce the meaning of the copy — a fragile word dissolves, a bold word snaps in, a soft word drifts. Generic transforms applied uniformly undermine the technique.

**Hold duration is critical.** The hold phase is where reading happens; enter and exit are punctuation. A 3-word phrase needs at least 600–800ms of hold. The most common mistake is making phrases too brief to read.

**Preserve typographic quality.** Clip-path reveals and whole-word techniques leave kerning and spacing untouched. Character-splitting (scramble, morph, stagger) can disrupt spacing — test at the intended font size.

**Reduced motion.** All demos show full text without motion when `prefers-reduced-motion: reduce` is set. Never hide or remove text as a reduced-motion fallback — only remove the animation.

## See also
- [02 — Entrance & Exit](../02-entrance-and-exit/) — element-level enter/exit including text-specific techniques like letter-by-letter stagger and word-by-word reveal
- [04 — Micro-Interactions](../04-micro-interactions/) — includes typewriter-adjacent patterns like the floating label
