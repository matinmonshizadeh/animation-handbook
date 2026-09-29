# Morphing Blob

## What it is
A morphing blob is a soft, liquid shape made from plain circles. The circles are blurred and then their edges are sharpened again, so wherever two come close they melt into one shape, like drops of mercury. As they drift, the blob stretches, splits and joins, and one drop follows the pointer.

## When to use it
- Playful hero backgrounds and landing-page focal points
- Loading and idle states that need to feel alive without being distracting
- Cursor-reactive accents where a shape follows or "grabs" the pointer
- Logo and brand moments that want an organic, non-geometric personality

## How it works
Each blob is a normal SVG `<circle>`. The whole group is passed through a "goo" filter: a Gaussian blur spreads every circle's edge, then a `feColorMatrix` drives the alpha channel through a steep contrast curve, snapping the soft blur back into a hard edge. Where two blurred circles overlap, their combined alpha crosses the threshold and they read as one connected shape.

```html
<filter id="goo">
  <feGaussianBlur in="SourceGraphic" stdDeviation="10" id="blur" result="blur"/>
  <feColorMatrix in="blur" mode="matrix"
    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="goo"/>
  <feBlend in="SourceGraphic" in2="goo"/>
</filter>
<g filter="url(#goo)" fill="url(#fill)"><!-- circles --></g>
```

The last row of the matrix (`0 0 0 20 -9`) is the trick: it multiplies alpha by 20 and subtracts 9, so mid-range (blurred) alpha collapses to 0 or 1 — a hard silhouette. A requestAnimationFrame loop runs two small functions every frame. `step(dt)` moves time on: it advances the drift phase and eases one "droplet" circle toward the pointer. `place()` then works out where every circle is (the background circles ride sine paths driven by the phase) and writes it to the circle's attributes:

```js
function step(dt){
  phase += dt * speed;                   // integrated per frame
  drop.x += (pointer.x - drop.x) * 0.09; // attraction toward the cursor
  drop.y += (pointer.y - drop.y) * 0.09; // (the pointer comes from Pointer Events → mouse, pen, touch)
}
function place(){
  for (const b of blobs){
    if (!b.droplet){                     // the droplet keeps its own position
      b.x = b.bx + Math.sin(phase*b.sx + b.px) * b.ax;
      b.y = b.by + Math.cos(phase*b.sy + b.py) * b.ay;
    }
    b.el.setAttribute('cx', b.x); b.el.setAttribute('cy', b.y); b.el.setAttribute('r', b.r);
  }
}
```

The drift phase is integrated (`phase += dt * speed`) rather than computed from
absolute time. Multiplying the elapsed time by the speed makes every blob jump to
a new point on its sine path the moment the speed changes; accumulating the phase
changes the rate and leaves the positions continuous.

Because a drifting circle's position depends only on the phase, `place()` can also
draw the blob without moving anything. The demo calls it once at load, so the first
picture is already a blob and Play carries on from exactly there, and again when the
number of blobs changes while it is paused. Pausing cancels the pending frame; Play
forgets the time of the last frame, so the first frame after it adds nothing.
Slow motion adds a third of the phase and lets the droplet close 0.03 of the gap
instead of 0.09.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Gooeyness | Medium | How much the circles are blurred before the edge is sharpened again: low is 6, medium 10 and high 16; higher melts circles from farther apart |
| Number of blobs | Medium | Few is 4, medium 6 and many 9 circles, counting the drop that follows the pointer |
| Speed | Normal | How fast the circles drift: slow is 0.6, normal 1 and fast 1.6 times |

## Production notes
- **Filter performance is the gotcha.** SVG filters rasterise the filter region every frame on the CPU/GPU compositor; a large blurred area over a big viewport can drop frames on mobile. Keep the filtered `<g>` region as small as the design allows, cap `stdDeviation`, and reduce blob count on small screens. Test on a mid-range phone, not just desktop.
- **Safari and blur units.** `stdDeviation` is in user (viewBox) units, not pixels — the visual blur scales with your `viewBox`, so pin the viewBox size and let CSS scale the SVG rather than resizing the viewBox.
- **`will-change: transform`** on the SVG element can promote it to its own layer and smooth things out, but watch memory on low-end devices.
- **Reduced motion.** Under `prefers-reduced-motion: reduce` the demo starts paused, showing the blob still, until the visitor presses Play. In production, never leave an autonomous churning shape running for users who opted out: show one settled arrangement.
- **Alternatives / library equivalents:** for a single animated outline instead of metaballs, interpolate an SVG `<path>`'s control points (the approach tools like **blobmaker** / **Haikei** export). For heavy, truly 3D goo, **three.js** MarchingCubes (metaballs) or a ray-marched SDF in a fragment shader gives real volume at GPU cost. **Framer Motion** can tween a `path`'s `d` attribute for path-based blobs.

## See also
- [Fluid / Liquid Simulation](../fluid-simulation/) — the same melting, drawn by a WebGL shader
- [Noise-Based Motion](../noise-based-motion/) — smooth noise ripples a blob's outline
- [SVG Path Animation](../svg-path-animation/) — lines that draw themselves
- [Ray Marching / SDF Scene](../ray-marching-sdf/) — shapes that melt together in 3D
