# Noise-Based Motion

## What it is
Noise-based motion uses Simplex or Perlin noise to drive organic, non-repeating movement. Unlike `Math.random()`, which jumps discontinuously, noise functions return smoothly interpolated values — nearby spatial or temporal samples are similar, making noise ideal for natural motion: wind, water surfaces, fire, breathing. This demo applies 2D Simplex noise to a grid of dots (wind field) and to the vertices of a blob shape.

## When to use it
- Organic background elements: floating dots, undulating blobs, rippling grids
- Character animations that need subtle non-mechanical life (idle breathing, hair flutter)
- Procedurally animated terrain and water in canvas or WebGL scenes
- Any motion that should feel natural rather than mechanical or random

## How it works
Simplex noise (by Stefan Gustavson, public domain) returns a value in [-1, 1] for any 2D or 3D coordinate. Sampling noise at `(x * scale, y * scale + time)` gives a smooth "wind direction" at each grid point:

```js
function drawWindField() {
  for (let x = step/2; x < W; x += step) {
    for (let y = step/2; y < H; y += step) {
      const n = simplex2(x * SCALE, y * SCALE + time);
      const angle = n * Math.PI * 2;       // map [-1,1] to full circle
      const dx = Math.cos(angle) * amplitude;
      const dy = Math.sin(angle) * amplitude;

      ctx.beginPath();
      ctx.arc(x + dx, y + dy, 1.5, 0, Math.PI * 2);
      ctx.fill();
      // Draw a short line showing direction
      ctx.moveTo(x, y);
      ctx.lineTo(x + dx, y + dy);
      ctx.stroke();
    }
  }
  time += speed * 0.01;  // advance through noise volume
}
```

**Blob** — each vertex's radius is offset by noise sampled at its angle:

```js
ctx.beginPath();
for (let i = 0; i <= vertices; i++) {
  const a = (i / vertices) * Math.PI * 2;
  const n = simplex2(Math.cos(a) * 12 * SCALE + time,
                     Math.sin(a) * 12 * SCALE);
  const r = baseRadius + n * amplitude * 2;
  const x = cx + Math.cos(a) * r;
  const y = cy + Math.sin(a) * r;
  i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
}
ctx.closePath();
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Noise scale | 0.008 | Small = large smooth patterns (zoomed in); large = fine rapid variation |
| Time speed | 0.5 | How fast the noise "advects" — low = glacial; high = turbulent |
| Amplitude | 12px | Displacement magnitude — how far points move from their rest position |
| Octaves (fbm) | 4 | More octaves = more detail at multiple scales (fractal brownian motion) |

## Production notes
- **Simplex vs Perlin**: Simplex noise (Gustavson 2005) is faster and has fewer directional artifacts than classic Perlin noise. Use Simplex for new projects.
- **3D noise for time**: sample noise at `(x, y, time)` in 3D for perfectly seamless temporal animation — the pattern never "resets." 2D noise with time as an offset (as in this demo) is simpler but can have slight discontinuities at the spatial edges.
- **`glsl-noise` / `open-simplex-noise`**: for WebGL shaders, include a GLSL noise implementation inline. For JavaScript, `open-simplex-noise` (npm) is the modern standard.
- **Flow fields**: the wind-field variant is a "flow field" — a classic technique in generative art (Daniel Shiffman's Coding Train). Particles follow the noise field like leaves on a stream.

## See also
- [Canvas Particle Effect](../canvas-particle-effect/) — velocity-based particle physics (less organic, more physical)
- [Fluid Simulation](../fluid-simulation/) — SDF metaballs for a liquid aesthetic
- [Volumetric Smoke](../volumetric-smoke/) — 3D noise applied as a volumetric density field
