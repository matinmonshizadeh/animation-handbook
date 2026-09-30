# Parallax 3D Tilt

## What it is
A 3D tilt makes a flat card lean toward the pointer, as if you were looking at a real card from different angles. The card's container gives the scene depth, and a soft light slides across the card with the pointer, which completes the illusion. The browser's own 3D transforms do it, with no 3D library.

## When to use it
- Feature cards, pricing cards, and hero cards where depth signals "premium"
- Portfolio thumbnails where hover signals selectability
- Any interactive card where the standard flat-hover feels too passive
- NFT and gaming UIs where the tactile metaphor matches the product

## How it works
`perspective` must be set on the **parent**, not the card. The card's `rotateX`/`rotateY` are computed from the cursor's position relative to the card's centre, normalized to ±0.5, then scaled by MAX, so the card leans MAX/2 at its edges.

Bind **pointer** events, not mouse events — the same handler then covers mouse, pen and touch:

```js
card.addEventListener('pointermove', e => {
  const r = card.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width  - 0.5;  // -0.5 to 0.5
  const y = (e.clientY - r.top)  / r.height - 0.5;

  const MAX = 15; // degrees
  const rx = (-y * MAX).toFixed(2);  // mouse up = card tilts toward viewer
  const ry = ( x * MAX).toFixed(2);  // mouse right = card tilts right

  card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04)`;
});

card.addEventListener('pointerleave', () => {
  card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
});
```

**Shine highlight** — one fixed radial gradient on a layer of its own, moved to the cursor with a transform. Rewriting a gradient on every move repaints the whole card; moving a layer that is already painted does not, and the card's `overflow: hidden` clips it:

```css
.shine {                              /* --shine-d: twice the card's diagonal, set once by the script */
  position: absolute; left: 0; top: 0;
  width: var(--shine-d); height: var(--shine-d);
  margin: calc(var(--shine-d) / -2) 0 0 calc(var(--shine-d) / -2);   /* its middle starts on the card's top left corner */
  background: radial-gradient(circle closest-side, rgba(255,255,255,0.18) 0%, transparent 65%);
}
```

```js
// W and H: the card's width and height. D: --shine-d. R: how far the light reaches, out to the farthest corner
const R = Math.hypot((0.5 + Math.abs(x)) * W, (0.5 + Math.abs(y)) * H);
shine.style.transform = `translate(${(x + 0.5) * W}px, ${(y + 0.5) * H}px) scale(${2 * R / D})`;
```

**Reset transition** — only apply `transition` on leave, not while tracking:

```js
card.addEventListener('pointermove',  () => card.classList.add('active'));
card.addEventListener('pointerleave', () => card.classList.remove('active'));
```

```css
.card { transition: transform 400ms ease; }
.card.active { transition: none; }  /* instant tracking while the pointer moves */
```

**Show me** — the demo's Show me button moves the same card with a pretend pointer instead of a real one. The pointer handler's work is a function `tilt(x, y)` that takes the two numbers from -0.5 to 0.5, and Show me calls it once a frame for three seconds, circling the middle of the card one and a half times and ending there:

```js
function step(now) {                           // t0 = the time of the first frame after Show me is pressed
  const p = Math.min(1, (now - t0) / 3000);    // progress, 0 to 1
  const r = 0.4 * Math.sin(Math.PI * p);       // distance from the middle: out to 0.4 and back
  const a = 3 * Math.PI * p;                   // angle: one and a half turns
  tilt(x0 * (1 - p) + r * Math.cos(a), y0 * (1 - p) + r * Math.sin(a));
  if (p < 1) requestAnimationFrame(step);
  else onLeave();                              // the card settles flat
}
```

`x0` and `y0` are where the card already leans when Show me is pressed, so a second press carries on from there. A press, a finger or a wheel turn over the stage, or the pointer moving over the card, cancels the frame and flattens the card, so the visitor is always in control.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Tilt amount | Medium | How far the card leans at its edges: small is 4°, medium 7.5° and large 12.5°; much more starts to feel unsteady |
| 3D depth | Medium | How close the viewer seems: subtle is 1500px, medium 1000px and strong 500px; closer makes the lean more dramatic |
| Shine | on | A soft light follows the pointer across the card, like light catching a real card |
| Return speed | Normal | How long the card takes to settle flat when the pointer leaves: slow is 650ms, normal 400ms and fast 250ms |
| Tilts away from the pointer | off | Leans the card away from the pointer instead, as if you were pressing on it |
| Grows a little | on | Scales the card up by 4% while it tilts, which reads as lifting it toward you |

## Production notes
- **Touch devices**: use Pointer Events (`pointerdown`/`pointermove`/`pointerleave`) plus `touch-action: none` and the effect works on touch for free — a drag tilts the card, a tap sets it once. Do not gate the effect on `@media (hover: hover)`: hybrid touchscreen laptops match it, and a phone with a paired mouse can match it too, so branching on the media query kills the interaction on real devices. If you need to branch, branch on the live `event.pointerType`.
- **`will-change: transform`**: on a page with many tilt cards, add it only while the pointer is over a card (`pointerenter`/`pointerleave`), to avoid permanent GPU layer allocation: a permanent `will-change` on many cards multiplies GPU memory use. The demo has one card, so it keeps it on.
- **VanillaTilt.js**: a zero-dependency library that handles this pattern with configurable tilt, glare, scale, and perspective. 2KB gzipped — use in production rather than hand-rolling.
- **`overflow: hidden` flattens 3D**: any ancestor with `overflow` other than `visible` (or a `filter`, or `opacity < 1`) forces `transform-style` to its flat used value, so `translateZ` on a child silently does nothing. A card that clips its own contents therefore cannot also be a `preserve-3d` container — give it its own `perspective` so its inner depth layers still project, or move the clip to a wrapper outside the 3D chain.
- **Performance**: `rotateX`/`rotateY` on a GPU-composited element runs at 60fps with no paint. Keep everything else that follows the pointer to `transform` and `opacity` as well: the demo moves its light as a layer (see Shine highlight) and leaves the card's shadow fixed in CSS, where it turns with the card. Rewriting a gradient or a `box-shadow` on every move repaints the whole card each frame, which shows on phones and adds up across a grid.
- **Reduced motion**: the demo does not tilt on its own, and the card snaps flat when the pointer leaves instead of easing back. In production, keep the card flat for these visitors.

## See also
- [3D Model Orbit](../3d-model-orbit/) — a real 3D object drawn with WebGL
- [Hover State Animation](../../04-micro-interactions/hover-state/) — flat hover feedback, without the 3D
- [2.5D / Pseudo-3D](../2-5d-pseudo-3d/) — layers at different depths move with the pointer
