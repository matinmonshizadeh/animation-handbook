# Clip-Path Reveal

## What it is

A clip-path reveal uncovers an element by growing a mask shape until the whole element shows. The element is fully drawn the entire time; only the visible part grows. Because nothing moves or fades, the content stays crisp and in place while a shape wipes across it, which gives the effect its cinematic, editorial feel.

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
};
```

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Shape | Edge wipe | Edge wipe uncovers it from one side or from the center; Circle and Oval open from the middle like an iris |
| Starts from | Left | For the edge wipe, where the reveal begins: left, right, top, bottom or center |
| Speed | Normal | How long the reveal takes: slow is 1300ms, normal 800ms and fast 500ms; a reveal reads best a little slower than a fade |
| Feel | Smooth | Smooth slows to a stop instead of snapping; Even keeps one steady pace |

## Production notes
- **Interpolate compatible shapes only.** CSS can animate `inset`→`inset`, `circle`→`circle`, or `polygon`→`polygon` (with the same vertex count), but it cannot tween *between* shape functions. Keep `out` and `in` the same function, as the demo does.
- **`clip-path` paints, it does not composite.** It is far cheaper than animating layout, but heavier than `opacity`/`transform`; on a huge full-screen element with a complex `polygon`, test on mobile and simplify the shape if frames drop.
- **Clipped content stays in the accessibility tree.** Unlike a curtain overlay, the text under a clip-path is still present and selectable throughout — good for SEO and screen readers, but it means the "hidden" content is not truly hidden from assistive tech.
- **Reduced motion:** the demo removes the clip animation under `prefers-reduced-motion` and falls back to an opacity fade, so no wipe plays.
- **Library equivalents:** GSAP `gsap.to(el, { clipPath: 'inset(0 0% 0 0)' })`; Framer Motion animate the `clipPath` string; Motion One `animate(el, { clipPath: [...] })`. GSAP's older approach used `-webkit-clip-path` for Safari — modern targets no longer need the prefix.

## See also
- [Curtain Reveal](../curtain-reveal/) — a colored panel covers it, then slides away
- [Slide Up Reveal](../slide-up-reveal/) — text rises from behind an invisible edge
- [Split Text Reveal](../split-text-reveal/) — text appears piece by piece
- [Fade In / Fade Out](../fade-in-out/) — a plain fade instead of a shape
