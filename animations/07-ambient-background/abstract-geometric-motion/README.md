# Abstract Geometric Motion

## What it is
Abstract geometric motion is a continuous, looping animation of pure geometric forms — rotating polygons, expanding rings, sliding bars, flowing lines — that exists purely to be watched. There is no narrative, no story, no user interaction required. The design intent is the same as a screensaver, a music visualizer, or an abstract painting: visually satisfying, optionally hypnotic, never demanding. Watch for 30 seconds and the mind quiets.

## When to use it
- "Now playing" and music player backgrounds where the visual should pulse with the content
- Focus and meditation app backgrounds where motion guides attention inward
- Digital art installations and kiosk displays where the screen must never show a static image
- Empty states and loading screens where the environment should feel designed, not blank

## How it works
All four presets run on a shared `requestAnimationFrame` loop with a global time counter `t`. Each preset renders to a `<canvas>` element.

**Rotating polygons** — regular polygons with increasing vertex counts, each rotating at a slightly different rate:

```js
function drawPolygons(t) {
  for (let i = 0; i < complexity; i++) {
    const sides = 3 + (i % 5);           // 3 to 7 sides
    const radius = 30 + i * 20;
    const rotation = t * (0.2 + i * 0.08) + (i % 2 === 0 ? 0 : Math.PI);

    ctx.beginPath();
    for (let j = 0; j <= sides; j++) {
      const a = j / sides * Math.PI * 2 + rotation;
      ctx.lineTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
    }
    ctx.strokeStyle = palette(i, 0.5 + 0.3 * Math.sin(t * 0.5 + i));
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }
}
```

**Concentric expanding rings** — rings spawn from center, expand outward, and fade:

```js
// Spawn a new ring periodically
if (Math.random() < 0.3) rings.push({ r: 0, color: randomColor() });

// Update and draw each ring
rings.forEach(ring => {
  ring.r += speed;
  const life = 1 - ring.r / Math.max(W, H);
  ctx.strokeStyle = `rgba(..., ${life * 0.6})`;
  ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
  ctx.stroke();
});
rings = rings.filter(r => r.r < Math.max(W, H));
```

**Color-flow lines** — sine-wave curves with animated `lineDashOffset` so colors appear to travel along the path:

```js
ctx.setLineDash([40, 60]);
ctx.lineDashOffset = -t * 30 * speed + i * 20;  // advances per frame
ctx.strokeStyle = palette(i, opacity);
ctx.beginPath();
// ... draw sine wave path ...
ctx.stroke();
ctx.setLineDash([]);
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Speed | 0.6 | Lower = meditative; higher = energetic. Keep below 1.0 for ambient. |
| Complexity | 6 | Number of shapes/lines. More = busier; fewer = minimal. |
| Palette | Cool | Color family. All presets respect the same palette variable. |

## Production notes
- **Canvas vs SVG vs CSS**: canvas is ideal for complex animated geometry that changes every frame. SVG SMIL animation works for a few elements but becomes expensive with many independently animated paths. CSS is impractical for runtime-generated geometry.
- **`t += speed * 0.01` not `Date.now()`**: relative time increments (adding to a counter) are frame-rate-independent in spirit and easier to control than absolute timestamps. For truly frame-rate-independent motion, multiply by the actual frame delta.
- **Infinite seamless looping**: none of the presets use `%` modulo or restart conditions — they simply accumulate `t` continuously. This guarantees the loop is truly seamless; there is no "restart" moment.
- **`lineDashOffset` for color flow**: animating `lineDashOffset` is a classic SVG/canvas trick for drawing paths that appear to have flowing color or motion along their length. The dash pattern stays fixed in the path's local coordinate space; the offset moves the starting point.
- **Music visualizer pairing**: replace the time-based `t` with audio frequency data from the Web Audio API's `AnalyserNode`. The shapes then pulse and change size in response to the audio spectrum.
- **Three.js equivalent**: `LineSegments`, `MeshLine`, and custom `ShaderMaterial` can recreate all four presets in a 3D context with camera movement adding the third dimension.

## See also
- [Ambient Ripple](../ambient-ripple/) — the "rings" preset abstracted as a standalone ambient effect
- [WebGL Shader Animation](../../06-3d-advanced/webgl-shader-animation/) — GPU-powered shader patterns; more complex but higher visual ceiling
- [Noise-Based Motion](../../06-3d-advanced/noise-based-motion/) — organic, non-geometric motion using Perlin/Simplex noise
