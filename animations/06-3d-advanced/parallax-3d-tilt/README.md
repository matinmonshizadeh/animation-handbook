# Parallax 3D Tilt

## What it is
Parallax 3D tilt rotates a card in three dimensions as the mouse moves across it, creating a convincing sense of depth without any WebGL. The `perspective` CSS property on the parent simulates a camera distance; `rotateX` and `rotateY` on the card map to mouse Y and X position respectively. A highlight gradient that follows the cursor completes the illusion of a physical light source.

## When to use it
- Feature cards, pricing cards, and hero cards where depth signals "premium"
- Portfolio thumbnails where hover signals selectability
- Any interactive card where the standard flat-hover feels too passive
- NFT and gaming UIs where the tactile metaphor matches the product

## How it works
`perspective` must be set on the **parent**, not the card. The card's `rotateX`/`rotateY` are computed from cursor position relative to the card's center, normalized to ±maxAngle:

Bind **pointer** events, not mouse events — the same handler then covers mouse, pen and touch:

```js
card.addEventListener('pointermove', e => {
  const r = card.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width  - 0.5;  // -0.5 to 0.5
  const y = (e.clientY - r.top)  / r.height - 0.5;

  const MAX = 15; // degrees
  const rx = (-y * MAX).toFixed(2);  // mouse up = card tilts toward viewer
  const ry = ( x * MAX).toFixed(2);  // mouse right = card tilts right

  card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
});

card.addEventListener('pointerleave', () => {
  card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
});
```

**Shine highlight** — a radial gradient repositioned to the cursor:

```js
shine.style.background = `radial-gradient(
  circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%,
  rgba(255,255,255,0.18) 0%,
  transparent 65%
)`;
```

**Reset transition** — only apply `transition` on leave, not while tracking:

```js
card.addEventListener('pointermove',  () => card.classList.add('active'));
card.addEventListener('pointerleave', () => card.classList.remove('active'));
```

```css
.card { transition: transform 400ms ease, box-shadow 400ms ease; }
.card.active { transition: none; }  /* instant tracking while the pointer moves */
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Max tilt angle | 15° | 5° = subtle; 15° = pronounced; >25° = disorienting |
| Perspective | 1000px | 400px = extreme fish-eye; 1500px = nearly flat |
| Reset duration | 400ms | How fast the card returns to flat when mouse leaves |
| Scale on hover | 1.03 | Subtle lift; pairing with shadow depth increase adds more realism |

## Production notes
- **Touch devices**: use Pointer Events (`pointerdown`/`pointermove`/`pointerleave`) plus `touch-action: none` and the effect works on touch for free — a drag tilts the card, a tap sets it once. Do not gate the effect on `@media (hover: hover)`: hybrid touchscreen laptops match it, and a phone with a paired mouse can match it too, so branching on the media query kills the interaction on real devices. If you need to branch, branch on the live `event.pointerType`.
- **`will-change: transform`**: add only during hover (`mouseenter`/`mouseleave`) to avoid permanent GPU layer allocation. Permanent `will-change` on many cards multiplies GPU memory use.
- **VanillaTilt.js**: a zero-dependency library that handles this pattern with configurable tilt, glare, scale, and perspective. 2KB gzipped — use in production rather than hand-rolling.
- **`overflow: hidden` flattens 3D**: any ancestor with `overflow` other than `visible` (or a `filter`, or `opacity < 1`) forces `transform-style` to its flat used value, so `translateZ` on a child silently does nothing. A card that clips its own contents therefore cannot also be a `preserve-3d` container — give it its own `perspective` so its inner depth layers still project, or move the clip to a wrapper outside the 3D chain.
- **Performance**: `rotateX`/`rotateY` on a GPU-composited element runs at 60fps with no paint. Avoid animating `box-shadow` simultaneously — shadows trigger paint; the demo does it for the depth cue on a single card, but it is not something to repeat across a grid.
- **Reduced motion**: under `prefers-reduced-motion: reduce` the demo pins the card flat and hides the shine, leaving the numeric readout so the mechanic is still legible.

## See also
- [3D Model Orbit](../3d-model-orbit/) — full WebGL 3D rather than CSS 3D
- [Hover State Animation](../../04-micro-interactions/hover-state/) — 2D hover feedback without the 3D dimension
- [2.5D / Pseudo-3D](../2-5d-pseudo-3d/) — multiple layers at different depths for a parallax scene
