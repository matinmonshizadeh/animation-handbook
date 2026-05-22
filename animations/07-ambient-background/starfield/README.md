# Starfield / Space Particles

## What it is
A starfield renders many small white points on a dark canvas that drift outward from a central focal point — the "flying through space" illusion. The depth effect comes from coupling a star's apparent size and speed to its distance from center: stars close to the center are small and slow; stars near the edge are larger and fast, simulating perspective acceleration. The side-scrolling variant produces the slower "looking out a spacecraft window" effect where stars at different depths move at different speeds.

## When to use it
- Space, astronomy, or sci-fi themed applications
- Ambient screensaver-style backgrounds for kiosk displays or focus apps
- Hero sections on tech products where "infinite scale" or "beyond the horizon" is the message
- Dark-themed landing pages that need a sense of depth and motion without complexity

## How it works
Each star tracks its angular position (`angle`), distance from center (`dist`), and speed. Per frame, distance increases and the star's canvas coordinates are computed from polar coordinates:

```js
class Star {
  constructor(W, H) {
    this.angle = Math.random() * Math.PI * 2;
    this.dist  = Math.random() * Math.max(W, H) * 0.5; // random start in field
    this.speed = (Math.random() * 0.6 + 0.2) * BASE_SPEED;
    this.size  = Math.random() * 1.5 + 0.5;
  }

  update() {
    const ratio = this.dist / MAX_DIST;
    // Accelerate as the star "approaches" — perspective foreshortening
    this.dist += this.speed * (1 + ratio * 2);
    // Reset to center when off-screen
    if (this.dist > MAX_DIST) {
      this.dist = 0;
      this.angle = Math.random() * Math.PI * 2;
    }
  }

  draw(ctx, cx, cy) {
    const ratio = this.dist / MAX_DIST;
    const x = cx + Math.cos(this.angle) * this.dist;
    const y = cy + Math.sin(this.angle) * this.dist;
    const size = this.size * (1 + ratio * 2);     // grow with distance
    const opacity = 0.3 + ratio * 0.7;            // brighten with distance

    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}
```

**Side-drift variant** — stars have a fixed depth value that determines both size and speed:

```js
class DriftStar {
  constructor(W, H) {
    this.x     = Math.random() * W;
    this.y     = Math.random() * H;
    this.depth = Math.random() * 0.8 + 0.2;  // 0.2 (far) to 1.0 (near)
    this.size  = this.depth * 2;
  }
  update() { this.x -= this.depth * SPEED; if (this.x < 0) this.x = W; }
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Star count | 300 | 100 = sparse; 300 = balanced; 800 = dense (approaching FPS limit) |
| Base speed | 0.4 | Keep it slow for ambient — fast starfields feel like hyperspace, not ambiance |
| Twinkling | On | Sinusoidal opacity variation per star; adds life without changing position |
| Acceleration factor | 2× | How much faster stars travel at the edge vs center; higher = more dramatic zoom |

## Production notes
- **Canvas vs DOM**: DOM elements at star counts above 50 cause heavy layout recalculation. Canvas is the right tool for this effect.
- **`ctx.fillStyle` caching**: setting `fillStyle` per star is expensive. Group stars by opacity bucket and set fillStyle once per bucket (color batching) to reduce canvas state changes.
- **`requestAnimationFrame` throttling**: on 120Hz displays, the loop runs twice as fast. Cap time delta to avoid stars moving at different speeds across devices.
- **Nebula background pairing**: adding a subtle radial gradient (deep purple in one quadrant, deep blue in another) behind the stars dramatically increases realism with minimal performance cost.
- **Three.js `Points` geometry**: production starfields use Three.js `BufferGeometry` with `PointsMaterial`. Each star is a vertex; the position buffer is updated each frame. This approach scales to 100,000+ stars.
- **`prefers-reduced-motion`**: keep stars static (no animation loop) or limit to a very slow drift at 10% of normal speed.

## See also
- [Aurora](../aurora/) — the atmospheric companion to a starfield sky
- [Canvas Particle Effect](../../06-3d-advanced/canvas-particle-effect/) — physics-based particles with connections
- [Floating Elements](../floating-elements/) — geometric shapes drifting with sine-wave motion
