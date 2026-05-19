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

## Key parameters

| Parameter  | Default | Effect |
|------------|---------|--------|
| `MAX_BLUR` | 14px    | Maximum blur on a layer at full distance from focal plane |
| `depth`    | 0.0–1.0 | Fixed depth per layer; 0 = far, 1 = near |
| `speed`    | 0.0–0.70 | Fraction of `maxOffset` the layer travels over full scroll |
| `maxOffset`| 120px   | Maximum translateY distance (applied at nearest layer) |

## Production notes

- `filter: blur()` triggers compositing. Add `will-change: filter` to each
  layer element to promote it to its own compositor layer and avoid per-frame
  paints.
- Blurring large SVGs is GPU-friendly; blurring large raster images is not —
  test on mobile before shipping.
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
