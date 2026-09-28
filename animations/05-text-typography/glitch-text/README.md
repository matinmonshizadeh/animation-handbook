# Glitch Text

## What it is
Glitch text makes a headline look like a broken video signal. A red copy and a cyan copy of the word sit just to either side of it, and only thin horizontal strips of each copy show, changing all the time, so strips of color seem to tear away from the letters. It reads as a digital fault: a signal losing sync, or a tape dropping out.

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

A small JS loop re-triggers the animation and nudges the element's `translateX` at irregular intervals, so the tear never settles into an obvious loop. The Glitches only on hover setting toggles `animation-play-state` through a `:hover` rule gated behind `@media (hover: hover)`, and a tap toggles it on touch screens.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Color split | Medium | How far the red and cyan copies sit from the word: small is 2px, medium 4px and large 8px |
| Speed | Normal | How long the strips take to run through their pattern: slow is 3.8s, normal 2.4s and fast 1.4s; shorter looks more frantic |
| Glitch strength | Medium | How hard the word shakes and how often the strips reshuffle: mild, medium or strong |
| Glitches only on hover | off | Holds the word still until you point at it; on touch screens a tap starts and stops it |
| Your text | GLITCH | The word that glitches, up to 12 letters, shown in capitals |

## Production notes
- **Accessibility**: the glitch is one element with real text content, so it stays selectable and readable to screen readers. When you build the effect from split spans instead, add `aria-label` on the container and `aria-hidden="true"` on the fragments so assistive tech reads the word once.
- **Reduced motion**: the demo starts paused. Once played, it only slides the colored strips; the sideways shake and the random restarts stay off. In production, show these visitors the still word.
- **Seizure safety**: keep the jitter below a few hertz and avoid full-frame flashes. Rapid, high-contrast strobing can trigger photosensitive reactions.
- **Library equivalents**: GSAP's timeline with random `clip-path` tweens gives frame-precise control; Splitting.js can shard the text for per-character glitching. Framer Motion can drive the offsets via `useAnimationFrame`.

## See also
- [Scramble / Glitch Text](../scramble-text/) — random symbols lock into the real text
- [Text Clip-Path Reveal](../text-clip-path-reveal/) — lines of text are uncovered one by one
- [Kinetic Typography](../kinetic-typography/) — words that each move in their own way
