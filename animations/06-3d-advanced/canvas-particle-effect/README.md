# Canvas Particle Effect

## What it is
A canvas particle effect renders hundreds to thousands of small moving dots on a 2D `<canvas>` element. Particles drift autonomously, optionally connect to nearby neighbors with thin lines (the classic "connected dots" pattern), and react to mouse proximity through repulsion or attraction. It is a common ambient effect on tech product and SaaS landing pages.

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
      this.vx += FORCE * (dx / d) / d * 0.8;
      this.vy += FORCE * (dy / d) / d * 0.8;
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
for (let i = 0; i < particles.length; i++) {
  for (let j = i + 1; j < particles.length; j++) {
    const dx = particles[i].x - particles[j].x;
    const dy = particles[i].y - particles[j].y;
    const d2 = dx*dx + dy*dy;
    if (d2 < DIST * DIST) {
      const opacity = (1 - d2 / (DIST * DIST)) * 0.4;
      ctx.strokeStyle = `rgba(88, 166, 255, ${opacity})`;
      ctx.beginPath();
      ctx.moveTo(particles[i].x, particles[i].y);
      ctx.lineTo(particles[j].x, particles[j].y);
      ctx.stroke();
    }
  }
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Particle count | 400 | O(n²) connections — above 500 the loop becomes the bottleneck |
| Connection distance | 100px | Larger = denser mesh; smaller = isolated dots |
| Mouse force | –0.5 | Negative = repel; positive = attract; 0 = no interaction |
| Speed | 0.8px/frame | Faster = chaotic; slower = meditative |

## Production notes
- **O(n²) limit**: distance checks between all pairs scale quadratically. Above ~500 particles the loop drops frames. Fix: spatial partitioning (quadtree, uniform grid) reduces checks to O(n log n). For 1000+ particles, switch to WebGL.
- **Canvas vs DOM**: `<canvas>` is mandatory for 50+ particles. DOM elements at that density create thousands of layout calculations per frame — the browser cannot keep up.
- **Particles.js / tsParticles**: the dominant production library. Handles everything in this demo plus themes, shape variety, responsive density, and performance at high counts.
- **`ctx.clearRect` vs `fillRect`**: using `fillRect` with a semi-transparent background instead of `clearRect` creates a motion-trail effect where older frames linger (enable "trails" toggle in the demo).
- **`prefers-reduced-motion`**: stop all particle movement. Consider keeping the static dot layout visible as a texture.

## See also
- [GPGPU Particle System](../gpgpu-particle-system/) — GPU-computed variant that handles 100k+ particles
- [Noise-Based Motion](../noise-based-motion/) — organically-moving dots driven by Perlin noise instead of physics
- [Fluid Simulation](../fluid-simulation/) — SDF metaballs for a liquid-merging particle aesthetic
