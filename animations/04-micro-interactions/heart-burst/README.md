# Heart / Like Burst

## What it is
A like button that celebrates the moment you like something. The heart quickly squashes, overshoots and settles as it fills with color, while tiny hearts and dots burst out from its center and fade. Unliking just removes the color, with no celebration.

## When to use it
- Like / favorite / react buttons in feeds, galleries, and comment threads
- Any single binary "positive" action worth a small dopamine reward
- Save-to-collection or bookmark buttons where you want the save to feel earned
- Not for destructive or neutral toggles — the celebration implies approval

## How it works
The heart itself is an inline SVG whose fill color transitions on a `.on` class, plus a keyframed pop for the overshoot. The burst is a particle system drawn on a `<canvas>` overlay stretched across the stage. On like, you spawn N particles at the heart's center, each with a random angle and velocity; every frame you advance them, apply gravity and a little sideways drag, and decrement life until they fade out:

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
    p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.vx *= 0.98; p.life -= 0.022;  // move, gravity, drag, fade
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
| Number of hearts | Some | How many pieces burst out: few is 10, some 18 and many 32; above about 40 it gets busy and costs frames |
| How far they fly | Medium | How far the pieces travel before they fade: short, medium or far |

## Production notes
- **Canvas over DOM particles**: 18–40 short-lived DOM `<span>`s per tap creates layout/GC churn if the user spams the button. One canvas with an array of plain objects stays flat and cheap.
- **Idle the loop**: stop `requestAnimationFrame` when `particles.length === 0` and restart it on the next spawn. A permanently running rAF wastes battery for a control that fires occasionally.
- **DPR scaling**: size the canvas backing store by `devicePixelRatio` (capped at ~2) and `ctx.setTransform(dpr,0,0,dpr,0,0)` so hearts stay crisp on retina without over-allocating on 3x phones.
- **Reduced motion**: skip the pop and the burst entirely — just toggle the fill color. The state change must still be conveyed, only the celebration is dropped.
- **Accessibility**: back the button with `aria-pressed` and toggle it with the state; the visual burst is decorative and should be `aria-hidden`.
- **canvas-confetti**: for a drop-in radial burst, `confetti({ particleCount, spread, origin })` gives you the same physics without hand-rolling the loop.
- **Framer Motion / Lottie**: Framer's `AnimatePresence` can drive DOM particles for small counts; many production apps instead ship a pre-rendered Lottie burst for pixel-consistent art across platforms.

## See also
- [Button Press Scale](../button-press-scale/) — the squash and spring behind the heart's pop
- [Notification Badge Pulse](../badge-pulse/) — a badge pulses to catch the eye
- [Checkmark Draw](../checkmark-draw/) — success shown without a burst
- [Click / Tap Ripple](../click-ripple/) — a calmer response from the spot you press
