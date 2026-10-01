# Light Leak

## What it is
A light leak is a warm glow that washes in from the edge of the frame and fades away again, like the stray light that reached the film when an old camera was not sealed properly. Real leaks happen at random and vary in strength, so the effect waits a random gap between leaks and peaks at a slightly different brightness each time; evenly timed leaks look like a machine, not a film camera.

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
  leak.style.setProperty('--leak-dur', fadeMs + 'ms');   // the fade time, read by the CSS transition
  // each leak peaks a little below the chosen brightness, at random
  leak.style.setProperty('--leak-peak', (brightness * (0.75 + Math.random() * 0.25)).toFixed(3));
  leak.classList.add('active');                // fades in over --leak-dur
  setTimeout(fadeOut, fadeMs + 200);           // hold the peak for 200ms
}

function fadeOut() {
  leak.classList.remove('active');             // fades out over --leak-dur
  setTimeout(flash, fadeMs + randomGap());     // a random dark gap before the next leak
}

function randomGap() {
  return (minGap + Math.random() * (maxGap - minGap)) * 1000;   // 1–3s in the demo
}

setTimeout(flash, randomGap());
```

The demo opens on a leak at its peak rather than a dark stage: it lights the glow, finishes the fade at once (`leak.getAnimations().forEach(a => a.finish())`) and starts the chain with `setTimeout(fadeOut, randomGap())`, so the first leak holds for one gap before it fades out.

**Gradient for a top-left corner leak**:

```css
.leak {
  position: absolute; inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--leak-dur) ease-in-out;
  background: radial-gradient(
    ellipse at -10% -10%,
    rgba(255, 165, 50, 0.9)  0%,
    rgba(255, 165, 50, 0.5) 20%,
    rgba(255, 165, 50, 0.1) 50%,
    transparent              70%
  );
}

.leak.active { opacity: var(--leak-peak); }
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Comes from | Top left | The corner the glow spills in from, or a band of light down the middle |
| Time between leaks | Medium | The random dark gap between one leak and the next: short is 0.5–1.5s, medium 1–3s and long 3–8s |
| Speed | Normal | How long each leak takes to fade in, and again to fade out: slow is 2s, normal 1.2s and fast 0.7s |
| Brightness | Medium | How strong the glow gets: dim is 30%, medium 55% and bright 80%; each leak peaks a little below this, at random |
| Color | Amber | Amber is the classic leak; gold, rose and magenta are warm too, and cyan looks like a cooler film stock |
| Floating light spots | off | Soft spots of light drift up and fade after each leak |

## Production notes
- **Irregularity is the entire effect**: a light leak that fires every 8 seconds at 0.5 opacity reads as a CSS animation loop, not a film defect. Randomizing both the delay and intensity per occurrence is what creates the analog feel.
- **Color matters**: gold/amber is the classic light leak color. Cyan suggests a blue-light leak (cooler film stocks). Rose and magenta also exist. Pure white reads as a lens flare, not a leak.
- **Multiple leaks simultaneously**: real cameras sometimes have multiple leak sources. Adding two or three leak elements with independent random timers increases verisimilitude.
- **Pausing**: if the page is backgrounded (`document.visibilitychange`), cancel the pending `setTimeout`. Leaks firing when the tab isn't visible are wasted — and they can cause a jarring flash when the user returns.
- **Framer Motion**: `<motion.div animate={{ opacity: [0, 0.5, 0] }} transition={{ times: [0, 0.5, 1], duration: 1.5 }}` on each flash. Trigger it imperatively with `controls.start()` from JavaScript.

## See also
- [Grain / Film Noise Overlay](../grain-overlay/) — the film grain that pairs with a leak
- [Scanline Effect](../scanline/) — dark lines over the page, like an old monitor
- [Glassmorphism Animated](../../06-3d-advanced/glassmorphism-animated/) — frosted glass over moving color
- [Light Rays](../light-rays/) — soft beams of light that fall from above and slowly sweep
