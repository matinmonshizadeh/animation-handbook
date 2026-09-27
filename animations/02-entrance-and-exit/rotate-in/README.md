# Rotate In

## What it is

Rotate In spins an element around its center as it enters, usually while it grows from small, so it reads as arriving rather than just turning in place. The spin is easiest to follow when the shape looks right at every angle, so it suits round or symmetric marks such as icons, stars, gears and badges, not text or wide rectangles.

## When to use it
- Icon and badge reveals — achievement unlocks, status indicators, loading-to-done transitions
- Logos or emblems where a spin reinforces a "coming together" moment
- Small decorative elements that can absorb an energetic entrance
- Anywhere the resting shape is symmetric enough that a mid-spin frame still looks intentional

## How it works
The element starts rotated and scaled down, then transitions both back to their resting values when the `.in` class is added. A springy easing gives the spin a slight overshoot so it feels like it lands:

```css
.icon{
  opacity:0;
  transform:rotate(var(--rot-start)) scale(var(--scale-start));
  transition:transform var(--dur) var(--ease),
             opacity var(--opacity-dur) var(--ease)}
.icon.in{opacity:1;transform:rotate(0deg) scale(1)}
```

Every setting only changes a custom property. The starting angle is the chosen amount of turn, signed by the direction, and switching the bounce off swaps the springy curve for a smooth one:

```js
function apply(){
  vars.setProperty('--rot-start',dir*turn+'deg');
  vars.setProperty('--dur',dur()+'ms');
  vars.setProperty('--ease',bounceTog.checked?SPRINGY:SMOOTH);
  vars.setProperty('--scale-start',scaleTog.checked?'0':'1');
  vars.setProperty('--opacity-dur',fadeTog.checked?'var(--dur)':'0s');
}
```

A negative starting angle spins clockwise into place and a positive one counter-clockwise; either way the element lands at `rotate(0deg)`. Each play first snaps the icon back to its starting pose with the transition switched off, so a replay always spins in from the beginning. Slow motion multiplies the duration by three.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| How much it spins | ½ turn | How far it turns on the way in: a quarter turn, half a turn or a full turn |
| Speed | Normal | How long the spin takes: slow is 1000ms, normal 600ms and fast 350ms |
| Spin direction | Clockwise | Which way it turns as it lands |
| Bounce at the end | on | Goes slightly past its resting angle and settles back, so the spin lands instead of gliding to a stop |
| Grows from small | on | Starts tiny and grows while it spins, which turns a spin into an arrival |
| Fades in | on | Fades in as it spins instead of appearing at once |

## Production notes
- **Symmetry matters**: rotating text or a rectangle looks like it fell over, not like it entered. The demo deliberately uses a symmetric icon so every intermediate frame reads correctly.
- **Scale sells the arrival**: rotation alone spins the element where it already is; adding `scale(0) → scale(1)` makes it feel like it travels in from nothing. The two combined are what create the "landing" quality.
- **Decouple opacity timing**: the demo gives the fade its own duration (`--opacity-dur`), so you can, for example, fade in quickly while the spin continues — a fully-transparent spin start can otherwise look like a glitch.
- **Reduced motion**: the icon drops to a plain 300ms opacity fade with no rotation or scale when `prefers-reduced-motion` is set, and the demo does not loop.
- **Framer Motion**: animate `rotate` and `scale` together in a variant, with a spring transition for the landing overshoot.
- **GSAP**: tween `rotation` and `scale` with a `back.out` ease; `back` provides the overshoot in one keyword.

## See also
- [Flip In](../flip-in/) — swings in like a card turning over
- [Scale In](../scale-in/) — grows from small, with no spin
- [Bounce In](../bounce-in/) — lands with a springy bounce
