# Parallax Scrolling

[Live demo](index.html)

## What it is

Parallax scrolling moves background layers slower than foreground layers as the
user scrolls, creating an illusion of 3D depth on a flat screen. The effect
exploits motion parallax: nearby objects appear to move more than distant ones
as the observer moves. Each layer is assigned a speed multiplier; slower
multipliers simulate greater distance.

## When to use it

- Hero sections on landing pages where a scene sets the mood
- Storytelling scrolls and editorial features with environmental depth
- Product showcases where scene context reinforces the subject
- Portfolio "about" sections that benefit from atmospheric immersion

## How it works

Each layer has a speed multiplier `s ∈ [0, 1.5]`. On scroll, a single
`requestAnimationFrame` callback normalises `scrollTop` to a 0–1 progress
value and scales a fixed travel budget by the layer's speed:

```js
const progress = scrollTop / (scrollHeight - clientHeight); // 0 → 1
const offset   = progress * MAX_PARALLAX * speed;           // MAX_PARALLAX = 150px
layer.el.style.transform = `translate3d(0, ${offset}px, 0)`;
```

Normalising first keeps the travel identical no matter how tall the scroll
container is, and clamps the effect at both ends for free.

Layers with low speed (sky: 10%) barely move — they appear far away. Layers
with high speed (foreground: 100%) track the scroll — they appear close. The
ratio between speeds determines how convincing the illusion is.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Sky speed | 10% | Near-zero drift — 15px total |
| Ridgeline speed | 30% | Slow drift — 45px total |
| Treeline speed | 60% | Mid-distance drift — 90px total |
| Foreground speed | 100% | Full travel budget — 150px total |
| `MAX_PARALLAX` | 150px | Travel at speed 1.0 across the whole scroll range |
| Scene height | 1800px | Scroll track inside a 600px stage (400px under 600px wide) |

## Production notes

- **GPU acceleration:** `translate3d` (not `translateY`) promotes the element
  to a compositor layer. Pair with `will-change: transform` declared before the
  first frame to avoid layer promotion jank on the initial scroll.
- **rAF throttling:** scroll events fire faster than display refresh (up to
  1000Hz on some devices vs. 60–120Hz frame rate). The dirty-flag pattern
  (`ticking` boolean) ensures only one `requestAnimationFrame` is queued per
  rendered frame, preventing redundant work.
- **Library alternatives:** GSAP ScrollTrigger provides `scrub` easing and
  timeline integration. Locomotive Scroll and Lenis add momentum/inertia
  scrolling with parallax hooks. Rellax is a lightweight zero-dependency option
  for simple cases.
- **Accessibility:** respect `prefers-reduced-motion: reduce`. When the user
  has requested reduced motion, hold every layer at zero offset and show the
  static scene — but keep the numeric readouts tracking the scroll, so the
  panel isn't reporting stale values. Apply `will-change: auto` in the
  reduced-motion media query to
  avoid unnecessary layer promotion.

## See also

- [Parallax Depth-of-Field](../parallax-depth-of-field/) — the same depth
  technique with blur applied per layer based on focal-plane distance rather
  than translation speed.
- [Reverse-Scrolling Columns](../reverse-scrolling-columns/) — takes speed-ratio
  depth further by making columns scroll in opposite directions.
