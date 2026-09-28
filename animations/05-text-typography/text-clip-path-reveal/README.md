# Text Clip-Path Reveal

## What it is
A text clip-path reveal uncovers a headline one line at a time, as if a hidden window opens across each line. Every letter sits in its final place from the start; only the visible part of each line grows. Because the text itself never moves, its spacing stays exactly as designed, which is hard to keep when each letter is animated on its own.

## When to use it
- Multi-line display headlines that should read as a single composed unit
- Taglines where the typographer's exact spacing must be preserved
- Photography or design portfolios where the type quality is part of the brand
- Any heading where character-by-character stagger would disrupt the reading of the whole phrase

## How it works
Each line is wrapped in a container with `overflow: hidden`. The text element starts with a `clip-path` that hides it entirely, then transitions to fully visible:

```css
:root {
  --line-dur: 700ms;
  --ease: ease-out;
}

.line-text {
  display: block;
  clip-path: inset(0 100% 0 0);   /* hidden: 100% clipped from right */
  transition: clip-path var(--line-dur) var(--ease);
}

.line-text.revealed {
  clip-path: inset(0 0% 0 0);     /* visible: nothing clipped */
}
```

Lines are staggered by adding a CSS `transition-delay` based on line index, or by applying the class with a `setTimeout` offset in JavaScript:

```js
lines.forEach((span, i) => {
  setTimeout(() => span.classList.add('revealed'), stagger * i);
});
```

**Direction variants** use different initial clip-path values:
```css
/* Left-to-right (default) */
.ltr { clip-path: inset(0 100% 0 0); }

/* Right-to-left */
.rtl { clip-path: inset(0 0 0 100%); }

/* Top-to-bottom */
.ttb { clip-path: inset(0 0 100% 0); }
```

All resolve to `inset(0 0% 0 0)` when revealed — a single `.revealed` class handles all directions.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Starts from | Left | The side each line's wipe begins on: left follows the reading order, right suits right-to-left scripts, top works for display headings |
| Speed | Normal | How long each line takes to uncover: slow is 1100ms, normal 700ms and fast 400ms |
| Delay between lines | Medium | The wait before each next line starts: short is 100ms, medium 180ms and long 300ms; 100 to 200ms reads as a natural cascade |
| Feel | Smooth | Smooth slows to a stop, which feels physical; Gentle eases in and out; Even feels mechanical |
| Your lines | Good design / Is honest / Always. | The headline, one line per row |

## Production notes
- **No layout shift**: unlike character stagger, clip-path reveal has zero impact on layout — the text is always in its final position, just hidden. This means no reflows and no risk of line-break changes mid-animation.
- **`overflow: hidden` not required**: unlike `translate`-based reveals that need overflow clipping, `clip-path` is self-contained. No parent overflow manipulation needed.
- **SVG clip-path for complex shapes**: CSS `inset()` and `circle()` cover most cases. For shaped reveals (diagonal wipes, irregular masks), use an SVG `<clipPath>` element. The principle is identical; only the mask shape changes.
- **GSAP**: `gsap.from(lines, { clipPath: 'inset(0 100% 0 0)', duration: 0.7, stagger: 0.18, ease: 'power2.out' })`. Clean one-liner, no class toggling.
- **Intersection Observer pairing**: in production, trigger the reveal when the headline scrolls into view using `IntersectionObserver`. The demo triggers on load/replay; combine with the [Reveal on Scroll](../../01-scroll-based/reveal-on-scroll/) pattern for scroll-triggered variants.

## See also
- [Clip-Path Reveal](../../02-entrance-and-exit/clip-path-reveal/) — a shape uncovers any element
- [Curtain Reveal](../../02-entrance-and-exit/curtain-reveal/) — a colored panel covers it, then slides away
- [Enter/Exit Typography](../enter-exit-typography/) — each phrase comes in, holds and leaves
