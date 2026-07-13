# Glitch Text

## What it is
Glitch text simulates a corrupted video signal on a headline. A white base layer sits between a red-shifted copy and a cyan-shifted copy, and horizontal `clip-path` bands slice each copy so ragged strips of color tear away from the letters. The effect reads as digital malfunction — datamosh, VHS dropout, a signal losing sync.

## When to use it
- Hero headlines for cyberpunk, hacker, or music/streetwear brands
- Error and 404 states where a "broken signal" metaphor fits the tone
- Hover accents on nav or buttons for a brief burst of instability
- Loading or transition moments that want texture rather than a plain spinner

## How it works
The visible text is duplicated twice with `content: attr(data-text)` on `::before` and `::after`. Each clone is nudged sideways and tinted a single channel, then a `clip-path: inset(...)` keyframe reveals a different horizontal band on every step. The `inset()` top/bottom values jump around, so the color layers only show through in shifting strips:

```css
.glitch::before{
  color:#ff2d5e;
  left:calc(var(--offset)*-1);
  animation:slice var(--speed) infinite linear alternate-reverse;
}
@keyframes slice{
  0%{clip-path:inset(20% 0 60% 0)}
  40%{clip-path:inset(10% 0 80% 0)}
  80%{clip-path:inset(85% 0 2% 0)}
  100%{clip-path:inset(30% 0 55% 0)}
}
```

A small JS loop re-triggers the animation and nudges the element's `translateX` at irregular intervals, so the tear never settles into an obvious loop. Hover-trigger mode simply toggles `animation-play-state` via a `:hover` rule gated behind `@media (hover: hover)`.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| RGB offset | 4px | Horizontal gap between the red and cyan copies — larger = more separation |
| Speed | 2.4s | Cycle duration of the `clip-path` keyframes; shorter = more frantic |
| Intensity | 60% | Probability and amplitude of the JS jitter re-triggers |
| Trigger | continuous | `continuous` runs always; `hover-trigger` pauses until pointer enters |

## Production notes
- **Accessibility**: the glitch is one element with real text content, so it stays selectable and readable to screen readers. When you build the effect from split spans instead, add `aria-label` on the container and `aria-hidden="true"` on the fragments so assistive tech reads the word once.
- **Reduced motion**: the demo disables the slice animation and the JS jitter under `@media (prefers-reduced-motion: reduce)`, leaving a static RGB split — still on-brand, no flashing.
- **Seizure safety**: keep the jitter below a few hertz and avoid full-frame flashes. Rapid, high-contrast strobing can trigger photosensitive reactions.
- **Library equivalents**: GSAP's timeline with random `clip-path` tweens gives frame-precise control; Splitting.js can shard the text for per-character glitching. Framer Motion can drive the offsets via `useAnimationFrame`.

## See also
- [Scramble Text](../scramble-text/) — another "signal corruption" text treatment
- [Text Clip-Path Reveal](../text-clip-path-reveal/) — clip-path used to reveal rather than tear
- [Kinetic Typography](../kinetic-typography/) — broader motion-driven type patterns
