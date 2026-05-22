# Ambient Ripple Effect

## What it is
The ambient ripple is the passive, atmospheric version of a ripple — concentric circles that expand outward from fixed source points on a periodic timer, not in response to user clicks. Each ring grows from zero radius to a maximum, fading in opacity as it expands, and is replaced by a new ring before it fully disappears. Multiple overlapping rings from multiple sources create the sense of something gently pulsing beneath the surface, like water drops on a still pond or sonar pings from a distant source.

## When to use it
- Behind hero sections where "something is alive here" reinforces the product's value proposition
- Status indicators for "connected" or "active" states that need visual presence without being alarming
- Meditation and focus apps where gentle radial pulses guide attention
- Map or location-based UIs where the pulsing ring indicates a point of interest

## How it works
Each ripple source has a timer that spawns new `Ring` objects at a configurable interval. Rings are updated and drawn each frame using a 2D canvas:

```js
class Ring {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 0;
    this.born = performance.now();
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

Sources emit rings at irregular intervals to avoid a mechanical clock-like feel:

```js
function scheduleEmit(source) {
  const baseInterval = EMIT_INTERVAL_MS;
  const jitter = IRREGULAR ? (Math.random() - 0.5) * baseInterval * 0.8 : 0;
  source.nextEmit = performance.now() + baseInterval + jitter;
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
| Source count | 3 | 1 = focused pulse; 3 = distributed field; 5 = active water surface |
| Emit interval | 3s | How often a new ring is born from each source |
| Max radius | 160px | Rings with large max radius need longer duration to avoid appearing to "rush" |
| Ring duration | 2.5s | Should be long enough for 2–3 rings to overlap, creating continuity |
| Irregular timing | On | ±40% random variance on the base interval — the most important toggle |

## Production notes
- **This is not the click ripple**: the click ripple ([Click / Tap Ripple](../../04-micro-interactions/click-ripple/)) responds to user input and confirms an action. The ambient ripple is passive and decorative — it fires automatically and continuously without any user interaction.
- **Ring density calibration**: at 3 sources with a 3s interval and 2.5s ring duration, there are always ~3 rings on screen from each source simultaneously. This "continuous" effect is the sweet spot — single rings look like a clock; too many look frantic.
- **Canvas vs SVG vs CSS**: canvas is best here because the ring count is variable and positions are dynamic. SVG animation for 15+ simultaneous animated elements creates expensive SMIL calculations. CSS `@keyframes` cannot easily spawn elements dynamically.
- **IntersectionObserver pause**: these loops run continuously — always pause them when the element is off-screen to avoid draining battery on long pages.
- **Accessibility**: the animation is purely decorative. Pause on `prefers-reduced-motion` and remove the canvas entirely if needed — no content is lost.

## See also
- [Click / Tap Ripple](../../04-micro-interactions/click-ripple/) — the user-triggered, action-confirming version of a ripple
- [Breathing Glow](../breathing-glow/) — a pulsing glow rather than expanding rings
- [Abstract Geometric Motion](../abstract-geometric-motion/) — the "concentric rings" preset in the geometric loop demo
