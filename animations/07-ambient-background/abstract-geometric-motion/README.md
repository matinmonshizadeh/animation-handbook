# Abstract Geometric Motion

## What it is
Abstract geometric motion is an endless loop of simple shapes that exists just to be watched: polygons slowly turning, rings spreading out from the center, slanted bars sliding by, or wavy lines with color flowing along them. There is no story and nothing to click. Like a screensaver or a music visualizer, it is meant to stay calm and pleasant to look at for a long time.

## When to use it
- "Now playing" and music player backgrounds where the visual should pulse with the content
- Focus and meditation app backgrounds where motion guides attention inward
- Digital art installations and kiosk displays where the screen must never show a static image
- Empty states and loading screens where the environment should feel designed, not blank

## How it works
All four presets run on a shared `requestAnimationFrame` loop with a global time counter `t`. Each 60th of a second that passes adds `speed * 0.01` to it and grows every ring by `speed * 2` pixels, however many frames that takes, so a 120 Hz screen or a slow frame does not change the speed. Each preset renders to a `<canvas>` element.

**Rotating polygons** — regular polygons with increasing vertex counts, each rotating at a slightly different rate:

```js
function drawPolygons(t) {
  for (let i = 0; i < shapeCount; i++) {
    const sides = 3 + (i % 5);           // 3 to 7 sides
    const radius = 30 + i * 20;
    const rotation = t * (0.2 + i * 0.08) + (i % 2 === 0 ? 0 : Math.PI);

    ctx.beginPath();
    for (let j = 0; j <= sides; j++) {
      const a = j / sides * Math.PI * 2 + rotation;
      ctx.lineTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
    }
    ctx.strokeStyle = palette(i, 0.5 + 0.3 * Math.sin(t * 0.5 + i));
    ctx.lineWidth = lineWidth * (1 + i * 0.1);   // 0.8, or 1.5 with Thicker lines
    ctx.stroke();
  }
}
```

**Concentric expanding rings** — rings spawn from center, expand outward, and fade:

```js
// Spawn a new ring on a fixed interval of t, so spacing stays even at any speed
if (t - lastSpawn >= 0.5) { lastSpawn = t; rings.push({ r: 0, color: randomColor() }); }

// Update and draw each ring
rings.forEach(ring => {
  ring.r += speed * 2;
  const life = 1 - ring.r / Math.max(W, H);
  ctx.strokeStyle = `rgba(..., ${life * 0.6})`;
  ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
  ctx.stroke();
});
rings = rings.filter(r => r.r < Math.max(W, H));
```

Choosing Rings starts with six rings already spread across the stage, so the pattern shows at once instead of growing from an empty stage.

**Color-flow lines** — sine-wave curves with animated `lineDashOffset` so colors appear to travel along the path:

```js
ctx.setLineDash([40, 60]);
ctx.lineDashOffset = -dashPhase + i * 20;  // dashPhase grows by 30 * speed each time t grows by 1
ctx.strokeStyle = palette(i, opacity);
ctx.beginPath();
// ... draw sine wave path ...
ctx.stroke();
ctx.setLineDash([]);
```

**The sliding bars and the flowing dashes** keep their own distance counters, `barX` and `dashPhase`, which grow by `40 * speed` and `30 * speed` each time `t` grows by 1. Adding to a counter, rather than multiplying `t` by the speed, means changing the speed never makes the bars or the dashes jump.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Pattern | Polygons | Turning polygons, rings spreading from the center, sliding bars, or wavy lines with flowing color |
| Speed | Normal | How fast everything moves: slow is 0.35, normal 0.6 and fast 1; keep it below 1 behind content |
| Number of shapes | Medium | How many polygons, bars or lines: few is 3, medium 6 and many 10 (the Lines pattern draws twice as many) |
| Colors | Cool | Cool blues, warm ambers, bright neon or grays |
| Thicker lines | off | Draws the lines 1.5px wide instead of 0.8px, so the shapes stand out more |

## Production notes
- **Canvas vs SVG vs CSS**: canvas is ideal for complex animated geometry that changes every frame. SVG SMIL animation works for a few elements but becomes expensive with many independently animated paths. CSS is impractical for runtime-generated geometry.
- **`t += speed * 0.01` not `Date.now()`**: relative time increments (adding to a counter) are frame-rate-independent in spirit and easier to control than absolute timestamps. For truly frame-rate-independent motion, multiply by the actual frame delta.
- **Infinite seamless looping**: none of the presets use `%` modulo or restart conditions — they simply accumulate `t` continuously. This guarantees the loop is truly seamless; there is no "restart" moment.
- **`lineDashOffset` for color flow**: animating `lineDashOffset` is a classic SVG/canvas trick for drawing paths that appear to have flowing color or motion along their length. The dash pattern stays fixed in the path's local coordinate space; the offset moves the starting point.
- **Music visualizer pairing**: replace the time-based `t` with audio frequency data from the Web Audio API's `AnalyserNode`. The shapes then pulse and change size in response to the audio spectrum.
- **Three.js equivalent**: `LineSegments`, `MeshLine`, and custom `ShaderMaterial` can recreate all four presets in a 3D context with camera movement adding the third dimension.

## See also
- [Ambient Ripple Effect](../ambient-ripple/) — rings spreading from a few spots, on their own
- [WebGL Shader Animation](../../06-3d-advanced/webgl-shader-animation/) — patterns drawn by the graphics card
- [Noise-Based Motion](../../06-3d-advanced/noise-based-motion/) — smooth, natural-looking random motion
