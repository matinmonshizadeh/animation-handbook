# Rotate In

## What it is
Rotate In spins an element around its center as it enters, usually combined with a scale-up so it reads as *arriving* rather than merely turning in place. Because the rotation is most legible when the shape looks coherent at every angle, the technique is best suited to radially symmetric marks — icons, stars, gears, badges — and poorly suited to text or wide rectangles.

## When to use it
- Icon and badge reveals — achievement unlocks, status indicators, loading-to-done transitions
- Logos or emblems where a spin reinforces a "coming together" moment
- Small decorative elements that can absorb an energetic entrance
- Anywhere the resting shape is symmetric enough that a mid-spin frame still looks intentional

## How it works
The element starts rotated and scaled down, then transitions both back to their resting values on `.in`. A springy easing gives the spin a slight overshoot so it feels like it lands:

```css
.icon{
  opacity:0;
  transform:rotate(var(--rot-start)) scale(var(--scale-start));
  transition:transform var(--dur) var(--ease),
             opacity var(--opacity-dur,var(--dur)) var(--ease)}
.icon.in{opacity:1;transform:rotate(0deg) scale(1)}
```

The starting angle combines a base rotation with any extra full turns, and the direction flips the sign so the spin runs clockwise or counter-clockwise:

```js
const base=+rotSl.value;
const extra=extraRot*(dir==='ccw'?-360:360);
const total=base+extra;
document.documentElement.style.setProperty('--rot-start',total+'deg');
document.documentElement.style.setProperty('--scale-start',scaleTog.checked?'0':'1');
```

Extra `±360°` turns don't change the resting frame — the element always lands at `rotate(0deg)` — but they add complete revolutions to the journey, turning a subtle tilt into a full spin.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Starting rotation (`--rot-start`) | -180° | The angle the element opens from; larger = more spin |
| Extra full rotations | 0× | Adds complete `±360°` turns without altering the landing frame |
| Direction | CCW | Sign of the rotation — clockwise or counter-clockwise |
| Easing (`--ease`) | Springy `cubic-bezier(.34,1.56,.64,1)` | Overshoot makes the spin land rather than glide to a stop |
| Combine with scale | on | Scaling from 0 turns a spin-in-place into an arrival |

## Production notes
- **Symmetry matters**: rotating text or a rectangle looks like it fell over, not like it entered. The demo deliberately uses a symmetric icon so every intermediate frame reads correctly.
- **Scale sells the arrival**: rotation alone spins the element where it already is; adding `scale(0) → scale(1)` makes it feel like it travels in from nothing. The two combined are what create the "landing" quality.
- **Decouple opacity timing**: the demo lets fade run on its own duration (`--opacity-dur`) so you can, for example, fade in quickly while the spin continues — a fully-transparent spin start can otherwise look like a glitch.
- **Reduced motion**: the icon drops to a plain 300ms opacity fade with no rotation or scale when `prefers-reduced-motion` is set.
- **Framer Motion**: animate `rotate` and `scale` together in a variant, with a spring transition for the landing overshoot.
- **GSAP**: tween `rotation` and `scale` with a `back.out` ease; `back` provides the overshoot in one keyword.

## See also
- [Flip In](../flip-in/) — 3D hinge rotation rather than a flat 2D spin
- [Scale In](../scale-in/) — the scale channel this effect leans on, on its own
- [Bounce In](../bounce-in/) — another springy, personality-forward entrance
