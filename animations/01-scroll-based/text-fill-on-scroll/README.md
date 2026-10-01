# Text Fill on Scroll

[Live demo](index.html)

## What it is

Text fill on scroll lights a paragraph up word by word as you scroll, as if it were being read at your pace. The paragraph holds still while you scroll through its section, and how far you have scrolled decides how many words are lit, so stopping holds the sentence mid-read and scrolling back un-reads it.

## When to use it

- Manifesto or mission statements that should be *read at scroll pace*, not skimmed
- Landing-page passages where each claim should land before the next appears
- Long-form intros that need a moment of focus before the content starts
- Anywhere a block of copy is the hero and deserves the reader's cadence

## How it works

The paragraph is split into one `<span>` per word at build time. Each frame maps scroll progress to a word index; a word is lit when its index is behind that point:

```js
const p      = clamp(stage.scrollTop / maxScroll, 0, 1);
const filled = Math.floor((p / COMPLETE_AT) * wordCount);
```

The important part is what *doesn't* happen: the frame handler never rewrites every span. It remembers the last filled count and touches only the words between the old and new positions:

```js
const lo = Math.min(filled, lastFilled), hi = Math.max(filled, lastFilled);
for (let i = lo; i < hi; i++) words[i].classList.toggle('on', i < filled);
lastFilled = filled;
```

On a normal scroll step that is one or two class toggles instead of fifty, and an idle frame costs nothing. A short CSS `color` transition on each word softens the flip without fighting the per-frame logic, since the class — not the color — is what changes per frame. When a jump changes more than a quarter of the words at once (Back to top, or Play starting over), the transition is switched off for that one change, so the old state does not linger.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Highlights the current word | on | The next word to fill shows in the highlight color, like a reading cursor |
| Fill finishes | Normal | How far through the scrolling the last word lights: early at 70%, normal at 90% and at the end at 100%; finishing early leaves a moment to read the whole text |
| Highlight color | Blue | The color of the word being filled |

## Production notes

- **Guard the writes.** The naive version loops all spans every scroll event and re-sets each one's class. With guarded writes only the delta is touched, which is what keeps this cheap at any paragraph length.
- **`background-clip: text` is the one-element alternative.** A gradient background with `background-clip:text` and a scroll-driven `background-position` fills text with zero spans and sub-word smoothness. The tradeoffs: no per-word hooks (no cursor highlight, no word callbacks), and gradient positioning across wrapped lines is fiddly. Choose spans when you need word-level control, clip when you need silk.
- **Keep the dim state readable.** The unread text still has to be perceivable — a dim value near-invisible against the background means the reader faces a blank panel and no cue that content exists. Keep some contrast in the unread state; the demo's default is deliberately legible.
- **Text stays real.** Splitting into spans keeps the copy selectable, findable, and visible to assistive tech — never rasterize or duplicate the text for this effect. Screen readers ignore the color sweep entirely, which is the correct behavior.
- **Granularity.** Per-letter splitting looks smoother but multiplies DOM nodes and write counts by ~6; per-word is the sweet spot for paragraphs. GSAP's SplitText and the `Intl.Segmenter` API both handle locale-correct splitting in production.
- **Cache layout reads.** `scrollHeight`/`clientHeight` are measured once and on resize — never inside the scroll handler, where they force a reflow per event.

## See also

- [Reveal on Scroll](../reveal-on-scroll/) — whole cards appear as they scroll into view; this is the continuous version for one paragraph
- [Scrub Animation](../scrub-animation/) — scroll position drives a drawing, both ways
- [Kinetic Typography](../../05-text-typography/kinetic-typography/) — words that each move in their own way, on a timer instead of the scroll
- [Highlighter Sweep](../../05-text-typography/highlighter-sweep/) — marker color sweeps behind the key words, on a timer instead of the scroll
