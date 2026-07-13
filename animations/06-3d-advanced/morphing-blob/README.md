# Morphing Blob

## What it is
A morphing blob is a soft, organic shape that continuously reshapes itself and, when interactive, reacts to the pointer. The classic web technique renders several plain circles ("metaballs") and passes them through an SVG filter that makes overlapping circles fuse into a single liquid silhouette. As the circles move, the blob appears to melt, stretch, and split like a drop of mercury.

## When to use it
- Playful hero backgrounds and landing-page focal points
- Loading and idle states that need to feel alive without being distracting
- Cursor-reactive accents where a shape follows or "grabs" the pointer
- Logo and brand moments that want an organic, non-geometric personality

## How it works
Each blob is a normal SVG `<circle>`. The whole group is passed through a "goo" filter: a Gaussian blur spreads every circle's edge, then a `feColorMatrix` drives the alpha channel through a steep contrast curve, snapping the soft blur back into a hard edge. Where two blurred circles overlap, their combined alpha crosses the threshold and they read as one connected shape.

```html
<filter id="goo">
  <feGaussianBlur in="SourceGraphic" stdDeviation="10" id="blur"/>
  <feColorMatrix in="blur" mode="matrix"
    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="goo"/>
  <feBlend in="SourceGraphic" in2="goo"/>
</filter>
<g filter="url(#goo)" fill="url(#fill)"><!-- circles --></g>
```

The last row of the matrix (`0 0 0 20 -9`) is the trick: it multiplies alpha by 20 and subtracts 9, so mid-range (blurred) alpha collapses to 0 or 1 — a hard silhouette. A requestAnimationFrame loop drifts the background circles on sine paths, while one "droplet" circle eases toward the pointer:

```js
if (b.droplet){                    // Pointer Events → works for mouse, pen, touch
  b.x += (pointer.x - b.x) * 0.09; // attraction toward the cursor
  b.y += (pointer.y - b.y) * 0.09;
} else {
  b.x = b.bx + Math.sin(time*speed*b.sx + b.px) * b.ax;
  b.y = b.by + Math.cos(time*speed*b.sy + b.py) * b.ay;
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Gooeyness (`stdDeviation`) | 10 | Blur radius — higher fuses circles from farther apart and rounds the whole blob |
| Blob count | 6 | More circles = more complex, lumpier morphing; fewer = calmer |
| Drift speed | 1.0 | Multiplies the sine time — 0 freezes drift, higher churns faster |
| Contrast row | `20 -9` | The alpha threshold; larger multiplier = crisper edge, smaller = softer/foggier |
| Droplet lerp | 0.09 | How eagerly the pointer droplet chases the cursor (higher = snappier) |

## Production notes
- **Filter performance is the gotcha.** SVG filters rasterise the filter region every frame on the CPU/GPU compositor; a large blurred area over a big viewport can drop frames on mobile. Keep the filtered `<g>` region as small as the design allows, cap `stdDeviation`, and reduce blob count on small screens. Test on a mid-range phone, not just desktop.
- **Safari and blur units.** `stdDeviation` is in user (viewBox) units, not pixels — the visual blur scales with your `viewBox`, so pin the viewBox size and let CSS scale the SVG rather than resizing the viewBox.
- **`will-change: transform`** on the SVG element can promote it to its own layer and smooth things out, but watch memory on low-end devices.
- **Reduced motion.** Under `prefers-reduced-motion: reduce` this demo paints one settled arrangement and stops the idle drift — never leave an autonomous churning shape running for users who opted out.
- **Alternatives / library equivalents:** for a single animated outline instead of metaballs, interpolate an SVG `<path>`'s control points (the approach tools like **blobmaker** / **Haikei** export). For heavy, truly 3D goo, **three.js** MarchingCubes (metaballs) or a ray-marched SDF in a fragment shader gives real volume at GPU cost. **Framer Motion** can tween a `path`'s `d` attribute for path-based blobs.

## See also
- [Fluid Simulation](../fluid-simulation/) — GPU metaballs via SDF smooth-minimum in a shader
- [Noise-Based Motion](../noise-based-motion/) — simplex noise driving a morphing blob outline
- [SVG Path Animation](../svg-path-animation/) — animating the `<path>` data itself
- [Ray Marching / SDF](../ray-marching-sdf/) — the 3D, in-shader cousin of metaball blending
