# Light Leak

## What it is
A light leak is a warm, glowing gradient that periodically sweeps across the screen from a corner, simulating the accidental light exposure that occurred in film cameras when the body seal was imperfect and stray light reached the film. In physical photography, light leaks happen at random intervals with varying intensity. Digitally recreating that randomness — irregular timing, varying peak opacity — is what makes the effect believable rather than mechanical.

## When to use it
- Editorial and photography portfolio sites where an analog aesthetic is intentional
- Lifestyle brand pages where "film photography warmth" is part of the brand identity
- Music video pages and creative agency sites
- Any context where the sensation of "vintage film" enhances the brand narrative

## How it works
The leak is an absolutely-positioned overlay with a radial gradient pointing from a corner. CSS `transition` animates the `opacity` from 0 to the peak value, then back to 0. **JavaScript randomizes the timing** — this is the critical detail that separates convincing from mechanical:

```js
const leak = document.querySelector('.leak');

function flash() {
  const duration = 800 + Math.random() * 1200;     // 800ms to 2000ms sweep
  const intensity = 0.3 + Math.random() * 0.4;     // 0.3 to 0.7 opacity

  leak.style.transition = `opacity ${duration}ms ease-in-out`;
  leak.style.opacity = intensity;

  // Fade back out after peak, at same speed
  setTimeout(() => {
    leak.style.opacity = 0;
    scheduleNext();               // schedule the next leak irregularly
  }, duration);
}

function scheduleNext() {
  const delay = 2000 + Math.random() * 10000;  // 2s to 12s between leaks
  setTimeout(flash, delay);
}

scheduleNext();
```

**Gradient for a top-left corner leak**:

```css
.leak {
  position: absolute; inset: 0;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(
    ellipse at -10% -10%,
    rgba(255, 165, 50, 0.9)  0%,
    rgba(255, 165, 50, 0.5) 20%,
    rgba(255, 165, 50, 0.1) 50%,
    transparent              70%
  );
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Min delay | 2s | The minimum gap between leaks — too short and it feels like strobe |
| Max delay | 12s | The maximum gap — above 20s users may forget the effect exists |
| Sweep duration | 1–2s | The speed of one fade-in/out cycle |
| Peak intensity | 0.3–0.7 | Varies per leak to feel organic; consistent intensity = mechanical |

## Production notes
- **Irregularity is the entire effect**: a light leak that fires every 8 seconds at 0.5 opacity reads as a CSS animation loop, not a film defect. Randomizing both the delay and intensity per occurrence is what creates the analog feel.
- **Color matters**: gold/amber is the classic light leak color. Cyan suggests a blue-light leak (cooler film stocks). Rose and magenta also exist. Pure white reads as a lens flare, not a leak.
- **Multiple leaks simultaneously**: real cameras sometimes have multiple leak sources. Adding two or three leak elements with independent random timers increases verisimilitude.
- **Pausing**: if the page is backgrounded (`document.visibilitychange`), cancel the pending `setTimeout`. Leaks firing when the tab isn't visible are wasted — and they can cause a jarring flash when the user returns.
- **Framer Motion**: `<motion.div animate={{ opacity: [0, 0.5, 0] }} transition={{ times: [0, 0.5, 1], duration: 1.5 }}` on each flash. Trigger it imperatively with `controls.start()` from JavaScript.

## See also
- [Grain Overlay](../grain-overlay/) — film grain texture as the companion analog effect
- [Scanline](../scanline/) — CRT-era retro overlay (different era, similar "analog" motivation)
- [Glassmorphism Animated](../../06-3d-advanced/glassmorphism-animated/) — light-over-glass effect for digital UI
