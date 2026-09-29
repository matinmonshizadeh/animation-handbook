# Canvas Particle Effect

## What it is
A canvas particle effect draws hundreds of small dots on one canvas and moves them every frame. Each dot drifts in its own direction and bounces off the edges, thin lines join dots that come close, and the pointer pushes nearby dots away or pulls them in. It is the connected-dots background seen on many tech sites.

## When to use it
- Hero section backgrounds that need movement without distracting from foreground content
- Network or data visualization metaphors (nodes representing connections)
- Ambient decoration on dark-themed dashboards
- Any context where "technology / interconnected systems" is the visual language

## How it works
Each particle stores position, velocity, radius, and opacity. Per frame, positions update by velocity; velocity is nudged by mouse force when within the interaction radius:

```js
class Particle {
  update() {
    // Mouse repel/attract
    const dx = this.x - mouse.x, dy = this.y - mouse.y;
    const d2 = dx * dx + dy * dy;
    if (d2 < 14400 && d2 > 1) {         // within 120px
      const d = Math.sqrt(d2);
      // (dx, dy) / d points away from the cursor, so subtracting FORCE
      // makes a negative value repel and a positive value attract.
      this.vx -= FORCE * (dx / d) / d * 0.8;
      this.vy -= FORCE * (dy / d) / d * 0.8;
    }
    // Speed cap
    const sp = Math.sqrt(this.vx**2 + this.vy**2);
    if (sp > MAX_SPEED) { this.vx = this.vx/sp * MAX_SPEED; this.vy = this.vy/sp * MAX_SPEED; }
    // Bounce off walls
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  }
}
```

**Connections** — O(n²) distance check per frame:

```js
// Every link goes into one of six paths by its opacity; each path is stroked once
const paths = Array.from({ length: 6 }, () => new Path2D());
for (let i = 0; i < particles.length; i++) {
  for (let j = i + 1; j < particles.length; j++) {
    const dx = particles[i].x - particles[j].x;
    const dy = particles[i].y - particles[j].y;
    const d2 = dx*dx + dy*dy;
    if (d2 < DIST * DIST) {
      const k = Math.min(5, Math.floor((1 - d2 / (DIST * DIST)) * 6));
      paths[k].moveTo(particles[i].x, particles[i].y);
      paths[k].lineTo(particles[j].x, particles[j].y);
    }
  }
}
ctx.lineWidth = 0.5;
paths.forEach((path, k) => {
  ctx.strokeStyle = `rgba(88, 166, 255, ${(k + 0.5) / 6 * 0.4})`;
  ctx.stroke(path);
});
```

Stroking each link on its own costs one draw call per line, thousands a frame; grouping the links into six opacity steps draws them all in six calls, with no visible difference.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Pointer effect | Push | What the pointer or a finger does to dots within 120px: pushes them away, pulls them in, or nothing |
| Number of particles | Medium | Few is 250, medium 500 and many 800 dots on computers; tablets draw 60, 90 and 120, and phones 30, 45 and 60, which keeps them smooth |
| Link distance | Medium | How close two dots must be to join with a line: short is 70px, medium 100px and long 150px; none draws no lines |
| Speed | Normal | How fast the dots drift: slow is 0.5, normal 0.8 and fast 1.3 (the fastest dots' pixels a frame); slow feels calm, fast looks busy |
| Color | Blue | The color of the dots and lines |
| Trails | off | Each dot leaves a fading streak, because the canvas is only partly cleared between frames |

## Production notes
- **O(n²) limit**: distance checks between all pairs scale quadratically. Above ~500 particles the loop drops frames. Fix: spatial partitioning (quadtree, uniform grid) reduces checks to O(n log n). For 1000+ particles, switch to WebGL.
- **Phones and tablets**: the demo draws 30 to 60 dots on phones (screens 600px wide or less, or 500px tall or less when held sideways) and 60 to 120 on other screens up to 1024px wide, and strokes the links in six batches instead of one call per line.
- **Canvas vs DOM**: `<canvas>` is mandatory for 50+ particles. DOM elements at that density create thousands of layout calculations per frame — the browser cannot keep up.
- **Particles.js / tsParticles**: the dominant production library. Handles everything in this demo plus themes, shape variety, responsive density, and performance at high counts.
- **`ctx.clearRect` vs `fillRect`**: using `fillRect` with a semi-transparent background instead of `clearRect` creates a motion-trail effect where older frames linger (turn on Trails in the demo).
- **Device pixel ratio**: size the backing store to `clientWidth * devicePixelRatio` (capped at 2) and scale the context, or sub-pixel dots and 0.5px connection lines blur on retina screens.
- **`prefers-reduced-motion`**: stop all particle movement. Consider keeping the static dot layout visible as a texture.

## See also
- [GPGPU Particle System](../gpgpu-particle-system/) — tens of thousands of particles moved on the graphics chip
- [Noise-Based Motion](../noise-based-motion/) — dots moved by smooth noise instead of physics
- [Particle Constellation](../../07-ambient-background/particle-constellation/) — calmer linked dots, as a background
