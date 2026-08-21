# Scroll-Driven Background Color

## What it is

The page background continuously blends through a palette as the user scrolls, so each section appears to own its own color while the transitions between them are smooth gradients in time rather than hard cuts. It is a portfolio-site staple: the whole canvas becomes a scroll progress indicator. Because light palette entries would make light text unreadable, the text ink flips automatically based on the computed luminance of the current background.

## When to use it

- Portfolio and agency sites where each case study or section has a brand color
- Long-form landing pages that want a sense of journey without heavy imagery
- Storytelling pages where mood shifts (dark to light, cool to warm) reinforce the narrative
- As a cheap alternative to full-bleed section imagery — a color change reads as a scene change

## How it works

Scroll progress is normalized to `0..1`, scaled into palette segments, and the two neighboring colors are interpolated. Smoothstep eases each transition so the blend accelerates and decelerates instead of moving linearly:

```js
const p   = clamp(scrollTop / maxScroll, 0, 1);
const seg = p * (palette.length - 1);
const i   = Math.min(Math.floor(seg), palette.length - 2);
let   t   = seg - i;

t = clamp((t - (1 - window) / 2) / window, 0, 1); // blend window remap
t = t * t * (3 - 2 * t);                          // smoothstep

const r = Math.round(a[0] + (b[0] - a[0]) * t);   // per-channel lerp
```

The contrast flip computes the relative luminance of the interpolated color and toggles a class when it crosses a threshold, swapping the section text from light ink to dark ink:

```js
const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
stage.classList.toggle('light', lum > 0.55);
```

The scroll handler is rAF-coalesced and performs no layout reads; `maxScroll` is cached at init and on a debounced resize. The background write is guarded — channels are rounded and the write is skipped when the resulting string is unchanged.

## Key parameters

| Parameter | What it controls |
| --- | --- |
| Palette | Array of `[r, g, b]` stops, one per section. Order defines the journey; adjacent stops should not produce muddy midpoints. |
| Blend window | Fraction of each segment (0.3–1) that actually blends. At 1 the color moves continuously; narrower values hold each color near section centers and confine the transition to a band around each boundary. |
| Snap toggle | Replaces interpolation with `t = t < .5 ? 0 : 1` — a hard cut at each boundary. Exists to show why the blend matters. |
| Luminance threshold | The cutoff (0.55 here) above which the background counts as light and the text ink flips dark. Tune per palette. |

## Production notes

- `background-color` paints but does not trigger layout, so writing it per frame is cheap. Still guard the writes: skip when the rounded color string has not changed, and never read layout inside the scroll handler.
- Plain RGB interpolation is shown here for clarity, but it passes through the gray center of the color cube — blends between saturated hues can go muddy. In production, interpolate in a perceptual space: `oklch()` or `color-mix(in oklch, ...)` keeps midpoints vivid.
- Text contrast must be computed, not assumed. WCAG requires roughly 4.5:1 for body text through the *whole* blend, not just at the palette endpoints — a transition between two passing colors can pass through a failing midpoint. Check the worst-case intermediate colors, or pick ink pairs with generous margin.
- A CSS-only version is possible with `animation-timeline: scroll()` driving a keyframe animation over `background-color`; add `steps()` to reproduce the snap variant. Support is not yet universal, so treat it as progressive enhancement over the JS approach.
- If the site has a dark mode, the palettes need dark-mode counterparts and the luminance threshold may shift — a "light" background in dark mode is more jarring than the same color in light mode.
- Color change is not vestibular motion, so this demo deliberately keeps the blend running under `prefers-reduced-motion: reduce`. The preference targets movement — parallax, zoom, skew — not paint. Any transform-based decorations layered on top should still be disabled.

## See also

- [Scrollytelling](../scrollytelling/)
- [Animated Gradient Background](../../07-ambient-background/animated-gradient-background/)
- [Section Wipe](../section-wipe/)
