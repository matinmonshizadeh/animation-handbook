# Morph Transition

## What it is
A morph transition turns one shape into another by moving each point of its outline toward a matching point in the new shape. Instead of swapping pictures, the outline flows: a circle unfolds into a hexagon, and a hexagon sharpens into a star. In the demo, a small logo changes shape to match each page as you move between Home, Gallery and About.

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

The shapes are generated to guarantee matching vertex counts: the circle samples 12 points around its radius, the hexagon interleaves its 6 corners with 6 edge midpoints, and the star alternates 6 outer and 6 inner points. Because index `i` of the source maps to index `i` of the target, each point has a well-defined destination and the outline never tears.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Speed | Normal | How long the change of shape takes: slow is 1100ms, normal 700ms and fast 400ms; slower reads as more deliberate |
| Feel | Gentle | Gentle eases in and out; Smooth slows to a stop; Springy stretches a little past the new shape and settles back; Even keeps one steady pace |

## Production notes
- **Point count and order are everything.** If two paths differ in vertex count, you must resample one to match before interpolating — mismatches produce garbage. Tools like flubber solve this by inserting and pairing points automatically.
- **Naive `lerp` cuts corners** on paths with curves. This demo uses straight `L` segments between points; morphing Bézier control points requires interpolating the control handles too.
- **`requestAnimationFrame` + `performance.now()`** drive the timing manually here rather than CSS, because CSS can't interpolate the `d` attribute's point list across arbitrary shapes.
- **Reduced motion** skips the morph and snaps the page swap, leaving the mark in its target shape.
- **Library equivalents**: GSAP's MorphSVG plugin and the standalone flubber library handle point resampling and pairing for arbitrary paths. Framer Motion animates simple SVG `path` values; Lottie bakes shape morphs exported from After Effects.

## See also
- [Shared Element Transition](../shared-element-transition/) — one element moves instead of changing shape
- [FLIP Technique](../flip-technique/) — elements glide to their new places
- [Crossfade Transition](../crossfade/) — the fade that carries the page content
- [Elastic Transition](../elastic-transition/) — a spring that goes past and settles
