# Floating Elements

## What it is
Floating elements are small geometric shapes — circles, squares, rings, triangles — that drift across a background on independent sine-wave paths. Each shape has a unique amplitude, frequency, and phase, so no two shapes ever move in synchrony. The effect is the canonical "SaaS landing page background particles" — tasteful, geometric, and ambient without being distracting. The critical design principle is independence: synchronized shapes look like a screensaver; independent shapes look like a living atmosphere.

## When to use it
- Hero backgrounds on SaaS, fintech, and tech product landing pages
- App onboarding screens where the background adds life without competing with UI
- Empty states and loading screens where the environment should feel "inhabited"
- Dashboard hero areas where the background differentiates sections

## How it works
Each shape has a base position (`bx`, `by`) and sine-wave parameters. Per animation frame, current position is computed from base position plus sinusoidal offsets:

```js
function animate(t) {
  elements.forEach(el => {
    const x = el.bx + Math.sin(el.freq * t + el.phase)    * el.amplitude;
    const y = el.by + Math.cos(el.freq * t * 0.7 + el.phaseY) * el.amplitude * 0.6;

    const rot = el.rotation ? el.rotSpeed * t : 0;
    const opacity = el.pulse
      ? 0.4 + 0.3 * Math.sin(el.pulsePhase + t * 0.5)   // stays inside 0.1–0.7
      : 0.5;

    el.dom.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
    el.dom.style.opacity = opacity;
  });
}
```

**Key construction** — no two shapes share the same parameters:

```js
function createShape(count) {
  const amp  = 30 + Math.random() * 50;          // 30–80px drift range
  const freq = 0.3 + Math.random() * 0.5;        // 0.3–0.8 Hz
  const phase  = Math.random() * Math.PI * 2;    // random start phase
  const phaseY = Math.random() * Math.PI * 2;    // Y axis out-of-phase
  // Y multiplier (0.6) makes motion elliptical rather than circular
}
```

**CSS shape generation** — shapes without image assets:

```css
.shape-circle { border-radius: 50%; }
.shape-square { /* default rect */ }
.shape-ring   { background: none; border: 2px solid currentColor; border-radius: 50%; }
```

**Mouse repulsion** — optional; shapes gently push away from the cursor:

```js
if (mouse.x > 0) {
  const dx = x - mouse.x, dy = y - mouse.y;
  const d = Math.sqrt(dx*dx + dy*dy);
  if (d < 120) {
    x += (dx / d) * (120 - d) * 0.08;
    y += (dy / d) * (120 - d) * 0.08;
  }
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Count | 8 | 4–12 is the ambient range; above 20 becomes visually busy |
| Drift range | 50px | How far each shape wanders from its base position |
| Drift speed | 0.5 | Higher = busier, more active; lower = barely noticeable |
| Opacity pulse | On | Shapes fade slightly during their loop — adds organic depth |

## Production notes
- **`requestAnimationFrame` not CSS `animation`**: individual `@keyframes` per element would require generating unique keyframe names. The JS loop is cleaner for this parameterized approach.
- **`will-change: transform`**: add to each floating element to promote it to its own compositing layer. With 12+ elements, measure whether this reduces or increases GPU memory pressure.
- **Avoid SVGs in the DOM for many shapes**: `<svg>` elements with complex paths are more expensive to composite than simple CSS-styled `<div>`s. Stick to CSS-achievable shapes.
- **Framer Motion**: `<motion.div animate={{ x: [0, amplitude, 0, -amplitude, 0], y: [0, amplitude*0.6, 0, -amplitude*0.6, 0] }} transition={{ duration: 1/freq, repeat: Infinity, ease: "easeInOut" }} />` — set unique props per element.
- **Particle.js / tsParticles**: handles this effect with configuration options, collision detection, and network links. Use in production when you need more than basic floating.

## See also
- [Canvas Particle Effect](../../06-3d-advanced/canvas-particle-effect/) — physics-based particles with O(n²) connections
- [Ambient Ripple](../ambient-ripple/) — radial expansion rather than freeform drift
- [Noise-Based Motion](../../06-3d-advanced/noise-based-motion/) — Perlin noise driving organic field motion
