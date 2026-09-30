# Starfield / Space Particles

## What it is
A starfield fills a dark background with small stars that stream out from the center, like the view from a spaceship flying through space. Each star's size, brightness and speed depend on how far it is from the middle: near the center stars are small, dim and slow, and they grow, brighten and speed up toward the edge, which is what makes it feel deep. A sideways version drifts stars past, the nearer ones faster, like the view from a window.

## When to use it
- Space, astronomy, or sci-fi themed applications
- Ambient screensaver-style backgrounds for kiosk displays or focus apps
- Hero sections on tech products where "infinite scale" or "beyond the horizon" is the message
- Dark-themed landing pages that need a sense of depth and motion without complexity

## How it works
Each star tracks its angular position (`angle`), distance from center (`dist`), and speed. On every frame, distance increases by the speed times `k` (explained below) and the star's canvas coordinates are computed from polar coordinates:

```js
class Star {
  constructor(W, H) {
    this.angle = Math.random() * Math.PI * 2;
    this.dist  = Math.random() * Math.max(W, H) * 0.5; // random start in field
    this.speed = (Math.random() * 0.6 + 0.2) * BASE_SPEED;
    this.size  = Math.random() * 1.5 + 0.5;
  }

  update(k) {
    this.dist += this.speed * k;
    const ratio = this.dist / MAX_DIST;
    // Accelerate as the star "approaches" — perspective foreshortening
    this.speed = (ratio * 0.5 + 0.2) * BASE_SPEED * 1.5; // faster toward the edge
    // Reset to center when off-screen
    if (this.dist > MAX_DIST) {
      this.dist = 0;
      this.speed = (Math.random() * 0.6 + 0.2) * BASE_SPEED;
      this.angle = Math.random() * Math.PI * 2;
    }
  }

  draw(ctx, cx, cy) {
    const ratio = this.dist / MAX_DIST;
    const x = cx + Math.cos(this.angle) * this.dist;
    const y = cy + Math.sin(this.angle) * this.dist;
    const size = this.size * (1 + ratio * 1.5);   // grow with distance
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
  update(k) { this.x -= this.depth * SPEED * k; if (this.x < 0) this.x = W; }
}
```

`k` is the number of 60 Hz frames the last frame stands for, so a 30 Hz phone and a 144 Hz monitor show the same speed. The first frame after a start, a pause or a return from a hidden tab adds nothing, and a long gap between frames counts for at most 50 ms. The stars move by `k`, or by a third of it in slow motion:

```js
const dt = last === null ? 0 : Math.min(now - last, 50);   // ms since the last frame
last = now;
const k = dt / (1000 / 60);                                 // 1 at 60 Hz, 2 at 30 Hz
```

The short trails come from covering the canvas with a see-through black layer instead of clearing it. The layer is always the 0.85 one of a 60 Hz frame, and it goes on once for every 60th of a second that has passed (twice on a 30 Hz frame), so the trails last as long in seconds on every screen. Slow motion does not slow them. A running fraction carries the rest to the next frame, and rounding rather than "at least one" keeps a 60 Hz screen at exactly one cover per frame even when its frame times are uneven:

```js
owed += k; const covers = Math.round(owed); owed -= covers;
for (let i = 0; i < covers; i++) {
  ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, W, H);
  if (haze) drawHaze();   // the nebula haze goes on after each cover, as it does at 60 Hz
}
```

One stronger cover, `1 - 0.15 ** k`, would fade the same amount in theory, but an 8-bit canvas rounds every cover, so the faint leftovers, such as the haze, would settle to different colors on different screens. Repeating the same cover makes them settle to the same colors everywhere.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Direction | Outward | Outward streams the stars from the center; sideways drifts them past, the nearer ones faster |
| Speed | Normal | How fast the stars move: slow is 0.25, normal 0.4 and fast 0.65, about the pixels a star covers in a 60th of a second out at the edge (16, 25 and 41 pixels a second), and about a third of that near the center; keep it slow for a calm background |
| Number of stars | Medium | Few is 150, medium 300 and many 600; phones show at most 300 |
| Star color | White | White, a warm white, or a different pale color for each star |
| Twinkling | on | Each star gently brightens and dims on its own rhythm |
| Nebula haze | off | A faint purple and blue haze behind the stars adds depth |

## Production notes
- **Canvas vs DOM**: DOM elements at star counts above 50 cause heavy layout recalculation. Canvas is the right tool for this effect.
- **Phones**: the demo draws at most 300 stars on phone-sized screens (up to 600px wide, or up to 500px tall for a phone held sideways); each star is a separate fill, so the count is the main cost.
- **`ctx.fillStyle` caching**: setting `fillStyle` per star is expensive. Group stars by opacity bucket and set fillStyle once per bucket (color batching) to reduce canvas state changes.
- **Same speed on every screen**: a fixed step per `requestAnimationFrame` frame runs twice as fast on a 120Hz display and half as fast on a 30Hz phone. The demo scales each step by the time since the last frame (in 60ths of a second, capped at 50 ms), so the stars move at the same speed everywhere, and it draws at most once every 16 ms so a fast display does no extra work.
- **Nebula background pairing**: adding a subtle radial gradient (deep purple in one quadrant, deep blue in another) behind the stars dramatically increases realism with minimal performance cost.
- **Three.js `Points` geometry**: production starfields use Three.js `BufferGeometry` with `PointsMaterial`. Each star is a vertex; the position buffer is updated each frame. This approach scales to 100,000+ stars.
- **`prefers-reduced-motion`**: keep stars static (no animation loop) or limit to a very slow drift at 10% of normal speed.

## See also
- [Aurora / Northern Lights](../aurora/) — bands of light that pair with a night sky
- [Canvas Particle Effect](../../06-3d-advanced/canvas-particle-effect/) — particles that link up and react to the pointer
- [Floating Elements](../floating-elements/) — shapes that drift slowly on their own paths
