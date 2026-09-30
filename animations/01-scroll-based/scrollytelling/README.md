# Scrollytelling

## What it is
Scrollytelling ties a picture to a story told in scrolling text. As you read down, the picture beside the text changes with you, blending smoothly between chapters instead of switching at each one. In the demo you sink through six layers of the ocean while the porthole's water darkens and the depth counts up to 10,935 metres.

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
| Reading line | 42% down the box | A chapter becomes current once its top passes this line; a higher line changes chapters later, a lower one sooner |
| Chapter height | At least 90% of the box | How much scrolling each chapter takes; taller chapters make slower, finer blends |
| Number of chapters | 6 | Each chapter adds its colours and its depth to the blend |

## Production notes
- **Fractional, not stepped**: the value that makes scrollytelling feel smooth is the decimal progress between chapters. If you only switch on integer chapter changes, you get a slideshow — interpolate everything you can.
- **Sticky visual, scrolling text**: the pattern is a `position: sticky` visual beside taller text columns. This is cheaper and more robust than JS-pinning; let CSS hold the visual in place.
- **Throttle reads**: `getBoundingClientRect` in a scroll handler forces layout. The rAF gate here keeps that to once per frame; on heavier visuals, cache rects and only recompute on resize.
- **Color interpolation**: blending hex colors requires parsing to RGB channels and lerping each — CSS won't tween `background` mid-value on its own, which is why this is done in JS.
- **Reduced motion**: nothing here moves on its own; the colours and the depth follow the reader's scrolling, so there is nothing to switch off. A CSS transition on the porthole's gradient would not help anyway: gradients cannot be transitioned, which is why the blend is worked out in JavaScript.
- **Library equivalents**: Scrollama is the standard vanilla library for the "sticky graphic + scrolling steps" layout; GSAP ScrollTrigger with `scrub` handles the interpolation; Framer Motion's `useScroll` + `useTransform` map scroll progress to any animated value in React.

## See also
- [Sticky Section](../sticky-section/) — a whole section holds still while its content changes
- [Scrub Animation](../scrub-animation/) — scroll plays an animation forward and back
- [Reveal on Scroll](../reveal-on-scroll/) — cards appear as they cross a line
- [Progress Bar](../progress-bar/) — a bar fills as you read
