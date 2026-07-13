# Heart / Like Burst

## What it is
A like button that celebrates the moment of liking. Tapping toggles the liked state: the heart plays a pop — a quick scale overshoot — and fills with color, while a short-lived spray of small hearts and dots bursts outward from its center and fades. Un-liking simply reverts the color with no burst. The pattern was popularized by Twitter's heart and is now a standard reward micro-interaction.

## When to use it
- Like / favorite / react buttons in feeds, galleries, and comment threads
- Any single binary "positive" action worth a small dopamine reward
- Save-to-collection or bookmark buttons where you want the save to feel earned
- Not for destructive or neutral toggles — the celebration implies approval

## How it works
The heart itself is an inline SVG whose fill color transitions on a `.on` class, plus a keyframed pop for the overshoot. The burst is a particle system drawn on a `<canvas>` overlay stretched across the stage. On like, you spawn N particles at the heart's center, each with a random angle and velocity; every frame you advance them, apply gravity, and decrement life until they fade out:

```js
function spawn() {
  const b = btn.getBoundingClientRect(), s = stage.getBoundingClientRect();
  const ox = b.left + b.width/2 - s.left, oy = b.top + b.height/2 - s.top;
  for (let i = 0; i < pCount; i++) {
    const a = Math.random() * Math.PI * 2, v = spread * (0.5 + Math.random()*0.5) / 12;
    particles.push({ x: ox, y: oy, vx: Math.cos(a)*v, vy: Math.sin(a)*v - 1, life: 1, /* ... */ });
  }
  if (!raf) raf = requestAnimationFrame(tick);
}

function tick() {
  ctx.clearRect(0, 0, cv.width, cv.height);
  particles = particles.filter(p => p.life > 0);
  for (const p of particles) {
    p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.life -= 0.022;  // move, gravity, fade
    ctx.globalAlpha = p.life;
    /* draw heart or dot at p.x, p.y */
  }
  raf = particles.length ? requestAnimationFrame(tick) : null;
}
```

The `-1` bias on initial `vy` makes the burst lean upward before gravity pulls it down. The pop is retriggered by removing and re-adding the animation class (`btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop')`) so repeated likes always re-fire.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Particle count | 18 | More reads as bigger celebration; above ~40 it gets busy and costs frames |
| Burst spread | 90px | Scales initial velocity, so how far particles travel before fading |
| Pop keyframes | 0.8 → 1.25 → 0.92 → 1 | The overshoot curve. Peak >1.3 looks rubbery |
| Fade rate | 0.022/frame | Life drain per frame — sets burst lifetime (~700ms at 60fps) |

## Production notes
- **Canvas over DOM particles**: 18–40 short-lived DOM `<span>`s per tap creates layout/GC churn if the user spams the button. One canvas with an array of plain objects stays flat and cheap.
- **Idle the loop**: stop `requestAnimationFrame` when `particles.length === 0` and restart it on the next spawn. A permanently running rAF wastes battery for a control that fires occasionally.
- **DPR scaling**: size the canvas backing store by `devicePixelRatio` (capped at ~2) and `ctx.setTransform(dpr,0,0,dpr,0,0)` so hearts stay crisp on retina without over-allocating on 3x phones.
- **Reduced motion**: skip the pop and the burst entirely — just toggle the fill color. The state change must still be conveyed, only the celebration is dropped.
- **Accessibility**: back the button with `aria-pressed` and toggle it with the state; the visual burst is decorative and should be `aria-hidden`.
- **canvas-confetti**: for a drop-in radial burst, `confetti({ particleCount, spread, origin })` gives you the same physics without hand-rolling the loop.
- **Framer Motion / Lottie**: Framer's `AnimatePresence` can drive DOM particles for small counts; many production apps instead ship a pre-rendered Lottie burst for pixel-consistent art across platforms.

## See also
- [Button Press Scale](../button-press-scale/) — the scale-overshoot mechanic behind the heart pop
- [Badge Pulse](../badge-pulse/) — another attention-reward micro-interaction
- [Checkmark Draw](../checkmark-draw/) — success feedback without a particle system
- [Click / Tap Ripple](../click-ripple/) — a calmer tactile confirmation from the tap point
