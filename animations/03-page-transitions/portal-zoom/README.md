# Portal / Tunnel Zoom

## What it is
A portal zoom treats a small on-screen element as a window into the next page: clicking it expands a circular (or rectangular) clip-path outward from the portal's center until the incoming page fills the whole stage. The effect reads as diving through the portal rather than swapping to a new URL. The destination is already rendered behind the mask before the animation begins, so the growth reveals it rather than loading it.

## When to use it
- Gallery or case-study entries where a thumbnail should "open into" its detail view
- Spatial navigation metaphors — rooms, worlds, chapters connected by doorways
- Landing pages with a single strong call-to-action that deserves a dramatic reveal
- Any transition where the origin point of the motion carries meaning (this card, this button)

## How it works
The incoming page is clipped to a zero-radius circle positioned at the portal's center, made active, forced to reflow, and then transitioned to a circle large enough to cover the stage. The portal's center is measured against the stage rect so the reveal always originates from exactly where the user clicked.

```js
const areaRect = area.getBoundingClientRect();
let px = '50%', py = '50%';
if (portalEl) {
  const pr = portalEl.getBoundingClientRect();
  px = ((pr.left + pr.width / 2 - areaRect.left) / areaRect.width * 100).toFixed(1) + '%';
  py = ((pr.top + pr.height / 2 - areaRect.top) / areaRect.height * 100).toFixed(1) + '%';
}
nextEl.style.clipPath = `circle(0% at ${px} ${py})`;   // pinhole at the portal
nextEl.style.transition = 'none';
nextEl.classList.add('active');
nextEl.offsetHeight;                                    // force reflow to commit start
nextEl.style.transition = `clip-path ${dur}ms ${easeSel.value}`;
nextEl.style.clipPath = `circle(150% at ${px} ${py})`;  // expand to cover the stage
```

The end radius is `150%` rather than `100%` because the circle must reach the corners of the rectangle, which are farther from the center than the edges. Reading `offsetHeight` between setting the start clip and the animated transition forces the browser to commit the pinhole state so the growth animates from zero. `ease-in` accelerates outward and reads as a zoom-in; `ease-out` reads as a zoom-out.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Portal shape | circle | `circle()` tunnels; `inset()` square reveals a rectangular aperture |
| Duration | 1.2s | Long enough to read as travel; too short becomes a plain wipe |
| Easing | ease-in | `ease-in` = diving in, `ease-out` = pulling back, `ease-in-out` = smooth throughout |
| End radius | 150% | Must exceed 100% so the circle reaches the stage corners |
| Origin (px, py) | portal center | Where the clip expands from; measured live from the clicked element |

## Production notes
- **Force the reflow.** Without reading `offsetHeight` (or another layout property) between the zero-radius clip and the transition, the browser coalesces both writes and the page appears instantly at full size. The reflow read is what makes the growth animate.
- **Corner coverage.** A `circle(100%)` leaves the four corners unclipped mid-animation. Use ~150%, or compute the exact distance to the farthest corner if you need the reveal to finish precisely as it touches the last pixel.
- **`clip-path` compositing.** Animating `clip-path` is GPU-friendly but not free on low-end devices at large sizes. Keep the clipped element's paint area reasonable and avoid stacking it with heavy blur or shadow filters.
- **Library equivalents.** The View Transitions API is the natural fit — animate `clip-path` on `::view-transition-new(root)` from a pinhole at the click point for the same effect natively. GSAP animates `clipPath` strings directly; Framer Motion animates the `clipPath` style prop. This is also a common shader/WebGL reveal, but clip-path covers the DOM case without a canvas.

## See also
- [Zoom Transition](../zoom-transition/) — scales the whole page rather than clipping a window
- [Shared Element Transition](../shared-element-transition/) — an element grows into the next page's layout
- [Flash / Light Leak](../flash-transition/) — another reveal that hides the swap behind an overlay
- [Morph Transition](../morph-transition/) — reshapes an element between states instead of clipping
