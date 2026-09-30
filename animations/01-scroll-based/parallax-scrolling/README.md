# Parallax Scrolling

[Live demo](index.html)

## What it is

Parallax scrolling moves the far layers of a scene less than the near ones as
you scroll, so a flat picture seems to have depth. It copies what you see from a
train window: nearby things rush past while distant hills barely move. Each
layer gets its own speed, and how far apart those speeds are decides how deep
the scene feels.

## When to use it

- Hero sections on landing pages where a scene sets the mood
- Storytelling scrolls and editorial features with environmental depth
- Product showcases where scene context reinforces the subject
- Portfolio "about" sections that benefit from atmospheric immersion

## How it works

Each layer has a speed multiplier `s` between 0 and 1.5, set by the Depth
setting. On scroll, a single `requestAnimationFrame` callback normalises
`scrollTop` to a 0–1 progress value and scales the travel, a quarter of the
box's height, by the layer's speed:

```js
const progress = scrollTop / (scrollHeight - clientHeight); // 0 → 1
const offset   = progress * MAX_PARALLAX * speed;           // MAX_PARALLAX = a quarter of the box's height
layer.el.style.transform = `translate3d(0, ${offset}px, 0)`;
```

Normalising first makes the movement the same whatever the length of the
scroll, and clamps it at both ends for free.

Layers with low speed (sky: 10%) barely move — they appear far away. Layers
with high speed (the grass: 100%) move the most — they appear close. The
ratio between speeds determines how convincing the illusion is.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Depth | Normal | The speeds of the sky, ridge, trees and grass: normal is 10%, 30%, 60% and 100%; shallow 50%, 65%, 80% and 100%; deep 0%, 25%, 70% and 150%; flat moves all four together. At 100% a layer travels a quarter of the box's height over the whole scroll |

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
  static scene, and apply `will-change: auto` in the reduced-motion media
  query to avoid unnecessary layer promotion.

## See also

- [Parallax Depth-of-Field](../parallax-depth-of-field/) — the same layers, with a moving focus that blurs them
- [Reverse-Scrolling Columns](../reverse-scrolling-columns/) — columns move against each other as you scroll
