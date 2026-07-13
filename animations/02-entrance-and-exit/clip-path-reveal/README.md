# Clip-Path Reveal

## What it is
A clip-path reveal uncovers an element by animating a mask shape from small (or edge-hidden) to fully open. The element is painted in full the entire time — only the visible region grows. Because nothing moves or fades, the content stays crisp and in place while a shape wipes across it, which is what gives the effect its cinematic, editorial feel.

## When to use it
- Image and media reveals on scroll (a photo wiped open left-to-right)
- Hero sections where a directional swipe uncovers the headline block
- Circular or "iris" reveals expanding from a click point
- Transitions between full-bleed panels where a shape mask replaces a crossfade

## How it works
The surface holds a start `clip-path` that hides it and transitions to an open one when `.in` is added. Both values live in CSS variables so the shape and direction controls can swap them:

```css
.surface {
  clip-path: var(--cp-out, inset(0 100% 0 0));
  transition: clip-path var(--dur) var(--ease);
  will-change: clip-path;
}
.surface.in { clip-path: var(--cp-in, inset(0 0% 0 0)); }
```

The demo keeps a lookup of shape/direction pairs — the `inset()` values wipe from an edge, while `circle()` and `ellipse()` grow a radius outward from center:

```js
const CLIPS = {
  inset: {
    left:  { out: 'inset(0 100% 0 0)', in: 'inset(0 0% 0 0)' },
    right: { out: 'inset(0 0 0 100%)', in: 'inset(0 0 0 0%)' },
    center:{ out: 'inset(50% 50%)',    in: 'inset(0%)' },
  },
  circle:  { out: 'circle(0% at 50% 50%)',      in: 'circle(75% at 50% 50%)' },
  ellipse: { out: 'ellipse(0% 0% at 50% 50%)',  in: 'ellipse(80% 70% at 50% 50%)' },
  polygon: { out: 'polygon(0 0, 0 0, 0 100%, 0 100%)', in: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
};
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Shape | inset | `inset` (edge wipe), `circle` / `ellipse` (iris), `polygon` (angled swipe) |
| Direction | left | For `inset`, which edge the wipe travels from |
| Duration | 800ms | Reveals read best slower than a fade — the wipe needs to be seen |
| Easing | `cubic-bezier(.2,.7,.3,1)` | A smooth decel; the wipe eases to a stop rather than snapping |

## Production notes
- **Interpolate compatible shapes only.** CSS can animate `inset`→`inset`, `circle`→`circle`, or `polygon`→`polygon` (with the same vertex count), but it cannot tween *between* shape functions. Keep `out` and `in` the same function, as the demo does.
- **`clip-path` paints, it does not composite.** It is far cheaper than animating layout, but heavier than `opacity`/`transform`; on a huge full-screen element with a complex `polygon`, test on mobile and simplify the shape if frames drop.
- **Clipped content stays in the accessibility tree.** Unlike a curtain overlay, the text under a clip-path is still present and selectable throughout — good for SEO and screen readers, but it means the "hidden" content is not truly hidden from assistive tech.
- **Reduced motion:** the demo removes the clip animation under `prefers-reduced-motion` and falls back to an opacity fade, so no wipe plays.
- **Library equivalents:** GSAP `gsap.to(el, { clipPath: 'inset(0 0% 0 0)' })`; Framer Motion animate the `clipPath` string; Motion One `animate(el, { clipPath: [...] })`. GSAP's older approach used `-webkit-clip-path` for Safari — modern targets no longer need the prefix.

## See also
- [Curtain Reveal](../curtain-reveal/) — an opaque bar covers then uncovers, hiding content while masked
- [Slide Up Reveal](../slide-up-reveal/) — the same clip idea scoped to a single text line
- [Split Text Reveal](../split-text-reveal/) — per-unit reveals for type
- [Fade In / Fade Out](../fade-in-out/) — the simpler reveal this replaces when you want a shape
