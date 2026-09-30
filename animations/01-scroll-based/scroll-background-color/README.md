# Scroll-Driven Background Color

## What it is

A scroll-driven background color gives each section of a page its own color and blends from one to the next as you scroll, so the whole page seems to change mood. Halfway between two sections the background is a mix of both colors. When the background turns light, the text switches to dark so it stays readable.

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

The contrast flip computes the relative luminance of the interpolated color and toggles a class when it crosses a threshold, swapping all of the section text from white to black:

```js
const lin = c => (c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const lum = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);   // relative luminance
stage.classList.toggle('light', lum > 0.18);   // white and black text contrast equally at 0.18
```

The scroll handler is rAF-coalesced and performs no layout reads; `maxScroll` is cached at init, when the fonts have loaded and whenever the window resizes. The background write is guarded — channels are rounded and the write is skipped when the resulting string is unchanged.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Colors | Dusk | The palette, one color per section: Dusk stays dark; Daylight passes through pale colors and Forest through a light green, and the text turns dark on those |
| Blend | Gradual | Gradual changes the color the whole way between sections; Quick holds each color and changes it near the boundary; Hard cut switches at the boundary with no blend, to show why the blend matters |

## Production notes

- `background-color` paints but does not trigger layout, so writing it per frame is cheap. Still guard the writes: skip when the rounded color string has not changed, and never read layout inside the scroll handler.
- Plain RGB interpolation is shown here for clarity, but it passes through the gray center of the color cube — blends between saturated hues can go muddy. In production, interpolate in a perceptual space: `oklch()` or `color-mix(in oklch, ...)` keeps midpoints vivid.
- Text contrast must be computed, not assumed. WCAG requires roughly 4.5:1 for body text through the *whole* blend, not just at the palette endpoints — a transition between two passing colors can pass through a failing midpoint. Check the worst-case intermediate colors, or pick ink pairs with generous margin.
- A CSS-only version is possible with `animation-timeline: scroll()` driving a keyframe animation over `background-color`; add `steps()` to reproduce the snap variant. Support is not yet universal, so treat it as progressive enhancement over the JS approach.
- If the site has a dark mode, the palettes need dark-mode counterparts and the luminance threshold may shift — a "light" background in dark mode is more jarring than the same color in light mode.
- Color change is not vestibular motion, so this demo deliberately keeps the blend running under `prefers-reduced-motion: reduce`. The preference targets movement — parallax, zoom, skew — not paint. Any transform-based decorations layered on top should still be disabled.

## See also

- [Scrollytelling](../scrollytelling/) — a picture beside the text changes as a story scrolls by
- [Animated Gradient Background](../../07-ambient-background/animated-gradient-background/) — colors that shift on their own, with no scrolling
- [Section Wipe](../section-wipe/) — each section slides up over the one before
