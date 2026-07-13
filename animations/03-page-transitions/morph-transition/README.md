# Morph Transition

## What it is
A morph transition interpolates one SVG shape into another by moving each point of the path toward its counterpart in the target shape. Instead of fading or swapping graphics, the outline flows continuously — a circle unfolds into a hexagon, a hexagon sharpens into a star. The demo ties the morph to page navigation: a logo mark reshapes as the user moves between Home, Gallery, and About.

## When to use it
- Logo or brand marks that reshape to signal section changes
- Icon state changes (play↔pause, menu↔close, checkmark reveal)
- Data-shape transitions where the geometry itself carries meaning
- Decorative continuity between pages that share a persistent element

## How it works
Morphing requires the source and target paths to have the **same number of points in the same order**. The demo normalizes every shape to 12 vertices, then on each animation frame linearly interpolates each `[x,y]` pair by an eased progress value and rebuilds the path string:

```js
function lerp(a,b,t){ return a+(b-a)*t }

function startMorph(from,to,done){
  const start=performance.now();
  function tick(now){
    const t=Math.min((now-start)/dur,1), et=easeFn(t);
    const pts=from.map(([ax,ay],i)=>[ lerp(ax,to[i][0],et), lerp(ay,to[i][1],et) ]);
    morphPath.setAttribute('d', pts2path(pts));
    if(t<1) morphRaf=requestAnimationFrame(tick); else done?.();
  }
  morphRaf=requestAnimationFrame(tick);
}
```

The shapes are generated to guarantee matching vertex counts: the circle samples 12 points around its radius, the hexagon interleaves its 6 corners with 6 edge midpoints, and the star alternates 6 outer and 6 inner points. Because index `i` of the source maps to index `i` of the target, each point has a well-defined destination and the outline never tears. A "show control points" toggle overlays the 12 vertices so the correspondence is visible.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Morph duration | 700ms | Length of the point interpolation; slower reads as more deliberate |
| Easing | ease-in-out | `easeFn` selects linear, ease-out (`1-(1-t)³`), ease-in-out, or a springy overshoot |
| Vertex count | 12 | Every shape is normalized to this; source and target must match exactly |
| Point order | clockwise from top | Mismatched ordering makes the shape twist or collapse mid-morph |

## Production notes
- **Point count and order are everything.** If two paths differ in vertex count, you must resample one to match before interpolating — mismatches produce garbage. Tools like flubber solve this by inserting and pairing points automatically.
- **Naive `lerp` cuts corners** on paths with curves. This demo uses straight `L` segments between points; morphing Bézier control points requires interpolating the control handles too.
- **`requestAnimationFrame` + `performance.now()`** drive the timing manually here rather than CSS, because CSS can't interpolate the `d` attribute's point list across arbitrary shapes.
- **Reduced motion** skips the morph and snaps the page swap, leaving the mark in its target shape.
- **Library equivalents**: GSAP's MorphSVG plugin and the standalone flubber library handle point resampling and pairing for arbitrary paths. Framer Motion animates simple SVG `path` values; Lottie bakes shape morphs exported from After Effects.

## See also
- [Shared Element Transition](../shared-element-transition/) — continuity via position rather than shape
- [Flip Technique](../flip-technique/) — another measure-and-interpolate approach
- [Crossfade](../crossfade/) — the page-content transition paired with this morph
- [Elastic Transition](../elastic-transition/) — spring-based motion related to the springy easing option
