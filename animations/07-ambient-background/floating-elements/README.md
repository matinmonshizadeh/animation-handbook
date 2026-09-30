# Floating Elements

## What it is
Floating elements are small, see-through shapes, such as circles, squares or rings, that drift slowly around a background. Each shape follows its own smooth, looping path, with its own speed, distance and starting point, so no two ever move in step. That independence is what makes it look like a living background rather than a screensaver.

## When to use it
- Hero backgrounds on SaaS, fintech, and tech product landing pages
- App onboarding screens where the background adds life without competing with UI
- Empty states and loading screens where the environment should feel "inhabited"
- Dashboard hero areas where the background differentiates sections

## How it works
Each shape has a base position (`bx`, `by`) and sine-wave parameters. On every animation frame, its current position is computed from the base position plus sinusoidal offsets of a running time `t`:

```js
function animate(t) {
  elements.forEach(el => {
    const x = el.bx + Math.sin(el.freq * t + el.phase)    * el.amplitude;
    const y = el.by + Math.cos(el.freq * t * 0.7 + el.phaseY) * el.amplitude * 0.6;

    const rot = el.rotation ? el.rot : 0;   // its own small turn, added up in the loop below
    const opacity = el.pulse
      ? 0.4 + 0.3 * Math.sin(el.pulsePhase + t * 0.5)   // stays inside 0.1–0.7
      : 0.5;

    el.dom.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
    el.dom.style.opacity = opacity;
  });
}
```

The clock `t` and each shape's turn move by the time that has passed, not by a fixed amount per frame. Every 60th of a second adds `speed * 0.005` to `t`, however many frames that takes, so a 30 Hz phone and a 144 Hz monitor drift at the same speed. The first frame after a start, a pause or a return from a hidden tab adds nothing, and a long gap between frames counts for at most 50 ms:

```js
const FRAME = 1000 / 60;                  // what one 60 Hz frame adds up to
let last = null;                          // set back to null on Play and when the tab returns

function loop(now) {
  requestAnimationFrame(loop);
  const dt = last === null ? 0 : Math.min(now - last, 50);   // ms since the last frame
  last = now;
  const k = dt / FRAME;                   // 1 at 60 Hz, 2 at 30 Hz, about 0.42 at 144 Hz
  t += speed * 0.005 * k;
  if (rotates) elements.forEach(el => { el.rot += el.rotSpeed * k; });
  animate(t);
}
```

**Key construction** — no two shapes share the same parameters:

```js
function createShape(count) {
  const amp = RANGE * 0.5 + Math.random() * RANGE * 0.5; // half to all of How far they drift (30, 50 or 90px)
  const freq = 0.3 + Math.random() * 0.5;                // its own pace, 0.3 to 0.8 times as fast as t
  const phase  = Math.random() * Math.PI * 2;            // random start phase
  const phaseY = Math.random() * Math.PI * 2;            // Y axis out-of-phase
  // Y multiplier (0.6) makes motion elliptical rather than circular
}
```

**Shape generation** — shapes without image assets, styled in code:

```js
if (shape === 'ring') {
  el.style.borderRadius = '50%';
  el.style.border = '2px solid ' + color;   // outline only
  el.style.background = 'none';
} else if (shape === 'square') {
  el.style.background = color;
} else {
  el.style.borderRadius = '50%';            // circle
  el.style.background = color;
}
```

**Mouse repulsion** — optional; shapes gently push away from the cursor:

```js
if (mouse.x > 0) {
  const dx = x - mouse.x, dy = y - mouse.y;
  const d = Math.sqrt(dx*dx + dy*dy);
  if (d > 0 && d < 120) {
    x += (dx / d) * (120 - d) * 0.08;
    y += (dy / d) * (120 - d) * 0.08;
  }
}
```

The pointer's position is taken from `pointerdown` as well as `pointermove`, so on a touch screen a finger resting on the stage pushes the shapes too.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Number of shapes | Medium | Few is 5, medium 8 and many 14; 5 to 12 feels calm, more gets busy |
| Speed | Normal | How fast the shapes drift: slow is 0.3, normal 0.5 and fast 0.8 |
| How far they drift | Medium | How far each shape wanders from its place: short is up to 30px, medium 50px and long 90px |
| Shapes | Mixed | Circles, squares, rings or a mix |
| Colors | Cool | Cool blues and purples, warm oranges and reds, grays, or bright neon |
| Shapes turn | on | Each shape slowly spins at its own rate as it drifts |
| Fades in and out | on | Each shape slowly brightens and dims, adding depth |
| Shapes avoid the pointer | off | Shapes within 120px of the pointer, or of a finger, slide aside |

## Production notes
- **`requestAnimationFrame` not CSS `animation`**: individual `@keyframes` per element would require generating unique keyframe names. The JS loop is cleaner for this parameterized approach.
- **`will-change: transform`**: add to each floating element to promote it to its own compositing layer. With 12+ elements, measure whether this reduces or increases GPU memory pressure.
- **Avoid SVGs in the DOM for many shapes**: `<svg>` elements with complex paths are more expensive to composite than simple CSS-styled `<div>`s. Stick to CSS-achievable shapes.
- **Framer Motion**: `<motion.div animate={{ x: [0, amplitude, 0, -amplitude, 0], y: [0, amplitude*0.6, 0, -amplitude*0.6, 0] }} transition={{ duration: 1/freq, repeat: Infinity, ease: "easeInOut" }} />` — set unique props per element.
- **Particle.js / tsParticles**: handles this effect with configuration options, collision detection, and network links. Use in production when you need more than basic floating.

## See also
- [Canvas Particle Effect](../../06-3d-advanced/canvas-particle-effect/) — many particles that link up and react to the pointer
- [Ambient Ripple Effect](../ambient-ripple/) — rings spreading out instead of shapes drifting
- [Noise-Based Motion](../../06-3d-advanced/noise-based-motion/) — smooth, natural-looking random motion
