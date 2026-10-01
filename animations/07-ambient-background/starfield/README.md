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
  update(k) { this.x -= this.depth * SPEED * 2 * k; if (this.x < 0) this.x = W; }
}
```

`n` is the number of 60 Hz frames since the last drawn frame, so a 30 Hz phone and a 144 Hz monitor show the same speed. The first frame after a start, a pause or a return from a hidden tab adds nothing, and a long gap between frames counts for at most 50 ms. The stars move by `k`, which is `n`, or a third of it in slow motion:

```js
const n = Math.min(now - last, 50) / (1000 / 60);   // 60ths of a second since the last drawn frame: 1 at 60 Hz, 2 at 30 Hz
const k = n * (slow ? 1 / 3 : 1);                    // what update(k) gets
```

The short trails come from covering the canvas with a see-through black layer instead of clearing it. The layer is always the 0.85 one of a 60 Hz frame, and it goes on once for every 60th of a second (twice on a 30 Hz frame), so the trails last as long in seconds on every screen. Slow motion does not slow them. An `n` within 5% of a whole number counts as that number for the cover, so a 59.94 or 60.06 Hz screen, or a little noise in the timestamps, still gets exactly one cover per frame, and `fa` carries the fraction that is left over. Rounding leans up by 0.05, so a screen whose frames land exactly half-way between two covers, such as 120 or 240 Hz, keeps a regular draw rhythm instead of one decided by timestamp noise. When no whole cover is due yet, as on the first of two frames of a 120 Hz screen, the frame draws nothing and its time carries to the next one. That keeps drawing at most about 60 frames a second whatever the screen (a 30 Hz screen draws 30, with two covers each), with one cover on every drawn frame:

```js
const w = Math.max(1, Math.round(n));
const f = fa + (Math.abs(n - w) < 0.05 ? w : n);   // n within 5% of a whole number counts as that number
const nf = Math.round(f + 0.05);                    // whole covers due; the 0.05 keeps a half-way tie off the rounding edge
if (!nf) return;                                    // none yet: draw nothing, the time carries on
fa = f - nf; last = now;                            // the fraction left over carries too
for (let i = 0; i < nf; i++) {
  ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, W, H);
  if (haze) drawHaze();   // the nebula haze goes on after each cover, as it does at 60 Hz
}
```

One stronger cover, `1 - 0.15 ** n`, would fade the same amount in theory, but an 8-bit canvas rounds every cover, so the faint leftovers, such as the haze, would settle to different colors on different screens. Repeating the same cover makes them settle to the same colors everywhere.

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
- **Same speed on every screen**: a fixed step per `requestAnimationFrame` frame runs twice as fast on a 120Hz display and half as fast on a 30Hz phone. The demo scales each step by the time since the last drawn frame (in 60ths of a second, capped at 50 ms), so the stars move at the same speed everywhere, and it draws only when a whole 60th of a second is due, at most about 60 times a second on any display, so a fast display does no extra work.
- **Nebula background pairing**: adding a subtle radial gradient (deep purple in one quadrant, deep blue in another) behind the stars dramatically increases realism with minimal performance cost.
- **Three.js `Points` geometry**: production starfields use Three.js `BufferGeometry` with `PointsMaterial`. Each star is a vertex; the position buffer is updated each frame. This approach scales to 100,000+ stars.
- **`prefers-reduced-motion`**: keep stars static (no animation loop) or limit to a very slow drift at 10% of normal speed.

## See also
- [Aurora / Northern Lights](../aurora/) — bands of light that pair with a night sky
- [Canvas Particle Effect](../../06-3d-advanced/canvas-particle-effect/) — particles that link up and react to the pointer
- [Floating Elements](../floating-elements/) — shapes that drift slowly on their own paths
- [Snow / Rain](../snow-rain/) — snow or rain that falls instead of streaming toward you
