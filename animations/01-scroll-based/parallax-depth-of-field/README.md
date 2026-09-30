# Parallax Depth-of-Field

[Live demo](index.html)

## What it is

Parallax depth-of-field combines two effects that follow the scroll. Each layer
of a scene moves by an amount that matches how near it is, and a point of sharp
focus travels from the farthest layer to the nearest, blurring every other layer
by how far it sits from that focus. The result looks like a camera pulling focus
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

Back to top, and Play starting again from the top, move the box in one jump; a
click on either button sets the eased value to the new position at once, so the
layers do not rewind through the whole focus pull.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Focus | Follows the scroll | Sharp on the sky at the top of the scroll and on the front ridge at the end; each layer blurs by its distance from it |
| Strongest blur | 14px (8px on phones) | The blur of a layer as far from the focus as a layer can be |
| Layer travel | 19% of the box's height (12.5% on phones) | What the layers' sinking is measured against: over the whole scroll the front ridge sinks 70% of it, the hills 45%, the mountains 25%, the far peaks 10% and the sky not at all |
| Easing | 14% a frame | How much of the remaining distance the layers cover each frame; lower is smoother but lags more |
| Pinned scene | Three box heights of scrolling | How much scrolling the whole focus pull takes |

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

- [Parallax Scrolling](../parallax-scrolling/) — the same layered depth, without the blur
- [Reverse-Scrolling Columns](../reverse-scrolling-columns/) — columns move against each other as you scroll
