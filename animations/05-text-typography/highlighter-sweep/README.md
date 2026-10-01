# Highlighter Sweep

## What it is
A highlighter sweep marks the key words of a sentence the way a pen would. A band of marker color grows behind each key phrase from left to right, one phrase after another in reading order, so the eye is led from one idea to the next. The words themselves never move; only the color behind them is drawn.

## When to use it
- Pull quotes and testimonials, to mark the line a reader should remember
- Landing page headlines where one phrase carries the promise
- Summaries, study notes and onboarding tips, where two or three ideas matter most
- Key points that are marked as their section scrolls into view

## How it works
Each key phrase is a `<mark>`. The script wraps each of its words, together with the space after it, in a span whose `::before` is the band: placed behind the word (`z-index: -1` inside a card that is its own stacking context, so the band never drops behind the card), scaled to nothing from its left edge, and grown to full width when the paragraph gets the class `on`. Because every word has its own band, a phrase that wraps onto a second line is marked line by line, and because the trailing space is inside the span, the bands of one line join up.

```css
.paper { position: relative; isolation: isolate; }
.w { position: relative; }
.w::before {
  content: ''; position: absolute; z-index: -1;
  left: -.08em; right: -.08em; top: var(--top); bottom: -.06em;
  background: var(--marker);
  transform: scaleX(0); transform-origin: left center;
  transition: transform var(--t) var(--e) var(--d);
}
.para.on .w::before { transform: scaleX(1); }

@media (prefers-reduced-motion: reduce) {
  .w::before { transform: none; opacity: 0; transition: opacity .4s linear var(--d); }
  .para.on .w::before { opacity: 1; }
}
```

The script gives every word its delay (`--d`), duration (`--t`) and timing curve (`--e`). A phrase gets one smooth curve, smoothstep, so the pen speeds up and slows down once per phrase rather than once per word. A word that covers the part p0 to p1 of its phrase's width runs between the times where the curve reaches p0 and p1, and its own timing curve is exactly that piece of smoothstep, written as a cubic Bézier, so the pen's speed carries on smoothly from one word to the next:

```js
const S = t => t * t * (3 - 2 * t), dS = t => 6 * t * (1 - t);   // the phrase's curve and its slope
const t0 = inv(p0), t1 = inv(p1), k = (t1 - t0) / (p1 - p0);     // inv: where S reaches p0 and p1
w.style.setProperty('--d', start + t0 * D + 'ms');
w.style.setProperty('--t', (t1 - t0) * D + 'ms');
w.style.setProperty('--e', `cubic-bezier(.333, ${dS(t0) * k / 3}, .667, ${1 - dS(t1) * k / 3})`);
```

Replay first drops every band back to nothing with transitions switched off for a moment, forces a style recalculation, and then adds `on` again, so each play sweeps from bare paper. Only `transform` and `opacity` change, so the text never reflows.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Marker color | Yellow | The color of the bands: yellow, pink, green, blue or orange, all light enough for the dark words to stay easy to read |
| Speed | Normal | How long the marker takes to cross one phrase: slow is 1300ms, normal 700ms and fast 400ms, with a 250ms pause between phrases |
| How much it covers | Whole words | Whole words covers the letters from just under their tops; Lower half covers only the bottom of the letters, like a thick underline |

## Production notes
- **The background-size version**: a single `<mark>` with `background: linear-gradient(var(--marker), var(--marker)) no-repeat; background-size: 0% 100%`, `box-decoration-break: clone` and a transition on `background-size` handles line wraps with no splitting at all. It is the shortest code, but `background-size` is repainted on every frame; the transform version here stays on the compositor.
- **Play it once, when it is seen**: start the sweep with an IntersectionObserver as the paragraph scrolls into view, and do not run it again on every scroll.
- **Contrast**: check the text against every marker color (WCAG asks for 4.5:1). On a dark theme use darker, more saturated markers with light text, or a translucent marker with `mix-blend-mode`.
- **Meaning**: `<mark>` tells assistive technology that the words are highlighted, and some screen readers say so. Do not rely on the color alone to carry meaning that the words do not.
- **Splitting**: keep the space inside each word's span so the bands join; split with `Intl.Segmenter` for languages that do not separate words with spaces.
- **Libraries**: GSAP's SplitText with a staggered `scaleX` tween, or Framer Motion variants with `staggerChildren`, build the same thing; Rough Notation draws hand-drawn highlights with SVG.

## See also
- [Text Clip-Path Reveal](../text-clip-path-reveal/) — each line of a headline is uncovered in turn
- [Outline to Fill](../outline-to-fill/) — hollow letters fill with color, as a wipe or a fade
- [Text Fill on Scroll](../../01-scroll-based/text-fill-on-scroll/) — words light up one by one as you scroll
- [Word-by-Word Reveal](../../02-entrance-and-exit/word-by-word-reveal/) — words appear one after another at a reading pace
