# Success Confetti

## What it is
A confetti burst that fires when a user completes a meaningful action — placing an order, finishing onboarding, submitting a form. Clicking the button switches it to a success state and launches many small rotating rectangles from the button's position, each with an upward-and-outward velocity, gravity, and spin, that fall and fade. It is a reward animation: it marks completion, it does not convey new information.

## When to use it
- Checkout / "Place order" confirmation, sign-up completion, plan upgrades
- The final step of a multi-step flow, where the payoff justifies the flourish
- Achievement and streak moments in learning or fitness apps
- Once per event, on genuine milestones — confetti on every click trains users to ignore it

## How it works
A `<canvas>` overlay covers the stage. On click you spawn a batch of confetti pieces at the button's center, each fanned around a straight-up base direction by a configurable spread angle. Every frame applies gravity to `vy`, advances position, spins the piece, and drains its life; pieces are retired once faded or off-screen:

```js
function fire() {
  const half = (spreadDeg * Math.PI/180) / 2;
  for (let i = 0; i < pCount; i++) {
    const ang = -Math.PI/2 + (Math.random()*2 - 1) * half;   // fan around straight up
    const speed = 6 + Math.random()*7;
    particles.push({ x: ox, y: cy, vx: Math.cos(ang)*speed, vy: Math.sin(ang)*speed,
      w: 6+Math.random()*6, h: 3+Math.random()*5, rot: Math.random()*Math.PI,
      spin: (Math.random()-0.5)*0.3, color: COLORS[i % COLORS.length], life: 1 });
  }
  if (!raf) raf = requestAnimationFrame(tick);
}

function tick() {
  ctx.clearRect(0, 0, cv.width, cv.height);
  particles = particles.filter(p => p.life > 0 && p.y < stage.clientHeight + 40);
  for (const p of particles) {
    p.vy += gravity; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.spin; p.life -= 0.008;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    ctx.globalAlpha = p.life; ctx.fillStyle = p.color;
    ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
    ctx.restore();
  }
  raf = particles.length ? requestAnimationFrame(tick) : null;
}
```

Because the loop reads live `pCount`, `spreadDeg`, and `gravity` values, adjusting a slider changes the very next burst. Clicking again simply calls `fire()` again — replay is implicit.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Particle count | 120 | Density of the burst. Above ~200 costs frames on low-end phones for little visual gain |
| Spread | 110° | Fan width around vertical. Narrow = a focused fountain; 180° = a full dome |
| Gravity | 0.28 | Downward acceleration per frame. Higher = a snappy, heavy fall; lower = a slow float |
| Fade rate | 0.008/frame | Life drain — sets how long pieces linger (~2s at 60fps) |
| Angular spin | ±0.3 rad/frame | Per-piece rotation speed; the flicker of rectangles catching "light" |

## Production notes
- **Off-screen culling**: filter out pieces once `p.y` passes the stage bottom, not just when faded — otherwise fast-falling confetti keeps consuming CPU below the fold.
- **One rAF, gated**: start the loop on the first burst and stop it when the array empties. Restart on the next click. Never leave a permanent rAF running for an occasional event.
- **DPR-aware canvas**: scale the backing store by `devicePixelRatio` (cap ~2) so rectangles have clean edges on retina without quadrupling fill cost on 3x displays.
- **Rectangles are cheapest**: `fillRect` inside a `translate`/`rotate` beats drawing images or paths per particle. If you need shapes, pre-render sprites to an offscreen canvas once and `drawImage`.
- **Reduced motion**: skip confetti entirely and show a static success state — the checkmark and "Order placed" label already confirm completion. This demo swaps the sub-caption to say so.
- **canvas-confetti**: the go-to library — `confetti({ particleCount: 120, spread: 110, origin: {x, y} })` handles physics, DPR, and cleanup. Reach for hand-rolled code only when you need custom shapes or tight bundle size.
- **GSAP / Framer Motion**: both can animate a handful of DOM confetti for light celebrations, but for hundreds of pieces a single canvas is dramatically cheaper than that many animated nodes.

## See also
- [Checkmark Draw](../checkmark-draw/) — the quieter success confirmation, and the reduced-motion fallback here
- [Button Press Scale](../button-press-scale/) — the press feedback on the trigger button
- [Heart / Like Burst](../heart-burst/) — a smaller, per-tap particle celebration
- [Modal Expand](../modal-expand/) — pairs well as the success dialog confetti fires into
