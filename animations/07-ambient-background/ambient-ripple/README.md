# Ambient Ripple Effect

## What it is
An ambient ripple sends rings out from a few spots, over and over, like drops falling on a still pond or the ping of a sonar screen. Each ring grows from nothing and fades as it spreads, and the next one starts before it is gone, so the rings overlap into a gentle, steady pulse. It runs on its own rather than answering a click, and hints that something is alive there.

## When to use it
- Behind hero sections where "something is alive here" reinforces the product's value proposition
- Status indicators for "connected" or "active" states that need visual presence without being alarming
- Meditation and focus apps where gentle radial pulses guide attention
- Map or location-based UIs where the pulsing ring indicates a point of interest

## How it works
Each ripple source has a timer that spawns new `Ring` objects at a configurable interval. Rings are updated and drawn each frame using a 2D canvas:

```js
class Ring {
  constructor(x, y, now) {
    this.x = x;
    this.y = y;
    this.r = 0;
    this.born = now;   // the page's own clock, which stops while paused
    this.duration = RING_LIFE_MS;
  }

  update(now) {
    const progress = (now - this.born) / this.duration; // 0 → 1
    this.r = MAX_RADIUS * progress;
    this.opacity = (1 - progress) * 0.6;   // fade out as it expands
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(88, 166, 255, ${this.opacity})`;
    ctx.lineWidth = THICKNESS * (1 - this.r / MAX_RADIUS * 0.3);
    ctx.stroke();
  }

  isDead(now) { return now - this.born > this.duration; }
}
```

`now` is the page's own clock: each frame adds the time since the last one (a third of it in slow motion), and it stops while the animation is paused, so rings freeze in place and carry on without jumping.

Sources emit rings at irregular intervals to avoid a mechanical clock-like feel:

```js
function scheduleEmit(source) {
  const baseInterval = EMIT_INTERVAL_MS;
  const jitter = IRREGULAR ? (Math.random() - 0.5) * baseInterval * 0.8 : 0;
  source.nextEmit = clock + baseInterval + jitter;
}
```

**Source drift** — sources slowly wander across the stage for additional organic feel:

```js
function updateSource(source) {
  source.x += source.vx;
  source.y += source.vy;
  // Bounce at boundaries
  if (source.x < W * 0.05 || source.x > W * 0.95) source.vx *= -1;
  if (source.y < H * 0.1  || source.y > H * 0.9)  source.vy *= -1;
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Speed | Normal | How long each ring takes to spread and fade: slow is 4s, normal 2.5s and fast 1.5s |
| Time between ripples | Medium | How often each spot sends out a ring: short is every 1.8s, medium 3s and long 5s |
| Ripple size | Medium | How far each ring spreads: small is 100px, medium 160px and large 250px; big rings look calmer with a slow speed |
| Number of sources | 3 | One spot feels focused; three spread across the stage; five feel like rain on water |
| Ring thickness | Medium | The width of each ring: thin is 1px, medium 1.5px and thick 3px |
| Ring color | Blue | The color of the rings |
| Uneven timing | on | Each gap is up to 40% longer or shorter, at random, so the rings never tick like a clock |
| Sources drift | off | The spots slowly wander around the stage |

## Production notes
- **This is not the click ripple**: the click ripple ([Click / Tap Ripple](../../04-micro-interactions/click-ripple/)) responds to user input and confirms an action. The ambient ripple is passive and decorative — it fires automatically and continuously without any user interaction.
- **Ring density calibration**: at 3 sources with a 3s interval and 2.5s ring duration, there are always ~3 rings on screen from each source simultaneously. This "continuous" effect is the sweet spot — single rings look like a clock; too many look frantic.
- **Canvas vs SVG vs CSS**: canvas is best here because the ring count is variable and positions are dynamic. SVG animation for 15+ simultaneous animated elements creates expensive SMIL calculations. CSS `@keyframes` cannot easily spawn elements dynamically.
- **IntersectionObserver pause**: these loops run continuously — always pause them when the element is off-screen to avoid draining battery on long pages.
- **Accessibility**: the animation is purely decorative. Pause on `prefers-reduced-motion` and remove the canvas entirely if needed — no content is lost.

## See also
- [Click / Tap Ripple](../../04-micro-interactions/click-ripple/) — a ripple that answers a click instead
- [Breathing / Pulsing Glow](../breathing-glow/) — one glow that grows and shrinks instead of rings
- [Abstract Geometric Motion](../abstract-geometric-motion/) — its Rings pattern spreads rings from the center
