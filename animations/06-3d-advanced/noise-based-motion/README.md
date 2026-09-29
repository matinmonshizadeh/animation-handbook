# Noise-Based Motion

## What it is
Noise-based motion uses smooth noise, a random value that changes gradually from place to place, to move things naturally. Plain random numbers jump about; noise drifts, so neighbouring dots move alike and nothing jerks. The demo turns it into a field of dots swaying like grass in the wind, and into a blob whose edge ripples.

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

The demo sets `step` as a spacing in pixels rather than a number of columns, so a phone's smaller stage draws fewer dots at the same spacing.

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
| Shape | Field of dots | A field of dots that sway, or one blob whose outline ripples |
| Pattern size | Medium | How big the noise's patterns are: large moves big areas together, small looks busy and fine |
| Speed | Normal | How fast the noise moves along: slow is 0.3, normal 0.5 and fast 0.8 |
| Wobble | Medium | How far each dot, or the blob's edge, moves: small is 6px, medium 12px and large 20px |
| Space between dots | Medium | The distance between dots in the field: wide is 64px, medium 48px and tight 32px; smaller stages draw fewer dots |
| Color | Blue | The color of the dots or the blob |

## Production notes
- **Simplex vs Perlin**: Simplex noise (Gustavson 2005) is faster and has fewer directional artifacts than classic Perlin noise. Use Simplex for new projects.
- **3D noise for time**: sample noise at `(x, y, time)` in 3D for perfectly seamless temporal animation — the pattern never "resets." 2D noise with time as an offset (as in this demo) is simpler but can have slight discontinuities at the spatial edges.
- **`glsl-noise` / `open-simplex-noise`**: for WebGL shaders, include a GLSL noise implementation inline. For JavaScript, `open-simplex-noise` (npm) is the modern standard.
- **Flow fields**: the wind-field variant is a "flow field" — a classic technique in generative art (Daniel Shiffman's Coding Train). Particles follow the noise field like leaves on a stream.

## See also
- [Canvas Particle Effect](../canvas-particle-effect/) — dots moved by simple physics instead of noise
- [Flow Field](../../07-ambient-background/flow-field/) — particles follow a noise field and leave trails
- [Volumetric Smoke / 3D Noise](../volumetric-smoke/) — the same kind of noise, in 3D, drawn as smoke
