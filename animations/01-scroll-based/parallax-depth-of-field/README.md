# Parallax Depth-of-Field

[Live demo](index.html)

## What it is

Parallax depth-of-field combines two scroll-driven techniques: each layer of a
scene moves at a speed proportional to its perceived distance from the viewer
(parallax), and a virtual focal plane blurs every layer according to how far it
sits from the current focal depth. The result mimics a camera rack-focus pulled
through a landscape as you scroll.

## When to use it

- Cinematic hero sections where scroll is the narrative driver
- Storytelling sequences that guide attention through depth layers
- Portfolio or editorial intros that need more presence than a static image
- Anywhere you want to make a flat 2D scene feel three-dimensional

## How it works

Each layer has a fixed depth value `d ∈ [0, 1]` (0 = farthest, 1 = nearest).
The focal plane is a value `f` that advances from 0 to 1 as the user scrolls.

```js
const blur = MAX_BLUR * Math.abs(layer.depth - f);
layer.el.style.filter = `blur(${blur}px)`;
```

Simultaneously, each layer translates vertically at a speed proportional to its
depth:

```js
layer.el.style.transform = `translateY(${layer.speed * f * maxOffset}px)`;
```

Layers closer to the viewer travel farther, reinforcing the sense of depth.

Driving `f` straight from `scrollY` is what makes most parallax feel rough: a
mouse wheel arrives as a single ~100px jump, so the layers jump with it. Instead
the scroll position is stored as a *target* and the rendered value eases toward
it a fraction at a time, which turns those discrete steps into continuous motion:

```js
current += (target - current) * EASE;   // inside a requestAnimationFrame loop
```

The loop only runs while the two values differ, so an idle page costs nothing.

## Key parameters

| Parameter  | Default | Effect |
|------------|---------|--------|
| `MAX_BLUR` | 14px    | Maximum blur on a layer at full distance from focal plane |
| `depth`    | 0.0–1.0 | Fixed depth per layer; 0 = far, 1 = near |
| `speed`    | 0.0–0.70 | Fraction of `maxOffset` the layer travels over full scroll |
| `maxOffset`| 120px   | Maximum translateY distance (applied at nearest layer) |
| `EASE`     | 0.14    | Share of the remaining distance covered per frame. Lower = smoother but laggier; above ~0.3 the stepping returns |
| `BLUR_STEP`| 0.5px   | Granularity the blur radius snaps to, so the compositor can reuse a cached texture |

## Production notes

- Never read layout inside a scroll handler. `stage.offsetHeight` or
  `window.innerHeight` there forces a synchronous reflow on every event, and
  writing styles immediately after produces layout thrashing. Measure once, cache
  the result, and refresh it on `resize`.
- Scroll events fire more often than frames. Store the position in the handler
  and do all DOM writing inside one `requestAnimationFrame` callback, otherwise
  the same frame is styled several times over.
- `will-change: filter` is a trap here. It promotes the layer but does nothing
  about the real cost: a changing blur radius forces the GPU to re-rasterize the
  whole surface. Hint `will-change: transform` only, and quantize the radius so
  it holds still across most frames. Skipping writes when the value is unchanged
  matters more than any hint.
- Blurring large SVGs is GPU-friendly; blurring large raster images is not —
  test on mobile before shipping.
- Reduce motion by zeroing the parallax offset rather than disabling the whole
  effect. The layer translation is the vestibular trigger; the focal-plane blur
  is not, and keeping it leaves the interface intact instead of inert.
- For production scroll choreography, GSAP ScrollTrigger with `scrub: true`
  gives smoother performance and easing control. Framer Motion's `useScroll` +
  `useTransform` is the React equivalent.
- The focal plane concept maps directly to any animation driven by a 0–1
  progress value — it is not scroll-specific.

## See also

- [Parallax Scrolling](../parallax-scrolling/) — four SVG layers at different scroll speeds;
  the speed-ratio depth concept without the focal-plane blur.
- [Reverse-Scrolling Columns](../reverse-scrolling-columns/) — takes speed-ratio
  depth further by making columns scroll in opposite directions.
