# Scrollytelling

## What it is
Scrollytelling binds a narrative to the scroll position, so that advancing through text chapters continuously drives a synchronized visual. Rather than snapping between discrete states, it computes a fractional progress value and interpolates every visual property from it — the reader experiences one continuous journey, not a slideshow. This demo descends through six ocean depth zones, crossfading a porthole's water color and counting metres as you scroll.

## When to use it
- Data-driven stories where a chart, map, or diagram should evolve as the reader progresses
- Explainer content that pairs a sticky visual with scrolling prose ("scrollytelling" journalism)
- Product walkthroughs where a single hero element morphs across feature descriptions
- Any narrative where the transition *between* points carries as much meaning as the points themselves

## How it works
A sticky visual column stays pinned while text chapters scroll past it. On each frame the code finds which chapter has crossed the reading line (42% down the stage), then derives a fractional index — the integer part is the current chapter, the decimal is progress toward the next. Every visual value is a `lerp` across that fraction:

```js
frac = clamp(frac, 0, N - 0.001);
const ci = Math.floor(frac), cf = frac - ci;      // chapter index + fraction
const c = CHS[ci], cn = CHS[Math.min(ci + 1, N - 1)];
const col = lerpCol(c.ac, cn.ac, cf);             // accent color blend
depNum.textContent = Math.round(lerp(c.depth, cn.depth, cf)).toLocaleString();
phBg.style.background = `radial-gradient(circle at 50% 40%, ${lerpCol(c.bg, cn.bg, cf)}, #000 80%)`;
porthole.style.borderColor = col;
```

Reads are throttled with a `requestAnimationFrame` gate (`ticking`) so the scroll handler never does layout work more than once per frame. Because the depth number and colors are interpolated rather than switched, the descent reads as continuous — 0 to 10,935 metres flows without jumps.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Reading line | 0.42 × stage height | Where a chapter is considered "active"; lower = triggers later |
| Chapter min-height | 0.9 × stage height | Scroll distance per chapter; taller = slower, more granular transitions |
| Fraction `cf` | derived | Drives every crossfade; 0 at chapter start, approaches 1 at the next boundary |
| rAF gate | on | Coalesces scroll events to one update per frame |

## Production notes
- **Fractional, not stepped**: the value that makes scrollytelling feel smooth is the decimal progress between chapters. If you only switch on integer chapter changes, you get a slideshow — interpolate everything you can.
- **Sticky visual, scrolling text**: the pattern is a `position: sticky` visual beside taller text columns. This is cheaper and more robust than JS-pinning; let CSS hold the visual in place.
- **Throttle reads**: `getBoundingClientRect` in a scroll handler forces layout. The rAF gate here keeps that to once per frame; on heavier visuals, cache rects and only recompute on resize.
- **Color interpolation**: blending hex colors requires parsing to RGB channels and lerping each — CSS won't tween `background` mid-value on its own, which is why this is done in JS.
- **Reduced motion**: the demo drops the porthole's `transition` under `prefers-reduced-motion`; content and depth still update, just without the eased color fade.
- **Library equivalents**: Scrollama is the standard vanilla library for the "sticky graphic + scrolling steps" layout; GSAP ScrollTrigger with `scrub` handles the interpolation; Framer Motion's `useScroll` + `useTransform` map scroll progress to any animated value in React.

## See also
- [Sticky Section](../sticky-section/) — pinning a section and scrubbing through internal states
- [Scrub Animation](../scrub-animation/) — tying an animation's timeline directly to scroll
- [Reveal on Scroll](../reveal-on-scroll/) — discrete triggers instead of continuous progress
- [Progress Bar](../progress-bar/) — surfacing scroll progress as a readout
