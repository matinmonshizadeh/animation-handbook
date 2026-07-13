# Flip In

## What it is
Flip In rotates an element from an edge-on flat plane into full view, using CSS 3D transforms to make the card appear to swing toward the viewer like a hinged panel. The defining detail is that `perspective` lives on the *parent* container, not the rotating card — without it, a `rotateY` collapses into a flat horizontal squash with no sense of depth.

## When to use it
- Card entrances in dashboards, galleries, and onboarding flows
- Revealing the "front" of something that conceptually has two sides (flashcards, tiles)
- Modals or panels that should feel like they physically arrive rather than fade in
- Anywhere a small dose of dimensionality distinguishes one element from a flat layout

## How it works
The stage sets `perspective`, establishing a shared vanishing point for its children. The card starts rotated (90° by default) and transitions to 0° on `.in`. Because perspective is inherited from the parent's 3D context, the rotation renders as a true swing:

```css
.stage{perspective:var(--persp)}
.card{
  opacity:0;
  transform:rotateY(var(--rot-y)) rotateX(var(--rot-x));
  transform-origin:var(--origin);
  transition:transform var(--dur) var(--ease),opacity var(--dur) var(--ease)}
.card.in{opacity:1;transform:rotateY(0deg) rotateX(0deg)}
```

The axis controls decide which rotation carries the starting angle — Y for a horizontal hinge, X for a vertical one, or both for a corner flip:

```js
const ry=axis==='X'?'0deg':rot+'deg';
const rx=axis==='Y'?'0deg':rot+'deg';
document.documentElement.style.setProperty('--rot-y',ry);
document.documentElement.style.setProperty('--rot-x',rx);
```

`transform-origin` moves the hinge to an edge (top, bottom, left) so the card swings from that side rather than pivoting around its center.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Perspective (`--persp`, on parent) | 1000px | Viewer distance; lower = more dramatic foreshortening, higher = subtle |
| Starting rotation (`--rot-y` / `--rot-x`) | 90° | The flat-plane angle to open from; 90° starts fully edge-on |
| Flip axis | Y (horizontal) | Which axis carries the rotation — Y hinge, X hinge, or both |
| Transform origin | center | Where the hinge sits; an edge origin swings the card from that side |
| Duration (`--dur`) | 600ms | Springy easing here adds a satisfying settle at the end |

## Production notes
- **Perspective belongs on the parent**: this is the single most common mistake. Setting `perspective` on the card itself (via `transform: perspective(...)`) applies per-element and won't share a vanishing point across siblings; the container `perspective` property is what creates a coherent 3D scene.
- **Backface at steep angles**: past ~90° you see the element's back. Add `backface-visibility:hidden` if the reverse side shouldn't show, or a second face for a true two-sided flip.
- **`will-change:transform`**: promotes the card to its own layer so the 3D transform stays smooth; the demo sets it up front.
- **Reduced motion**: the demo replaces the flip with a plain 300ms opacity fade and no transform when `prefers-reduced-motion` is requested — 3D rotation is a strong vestibular trigger.
- **Framer Motion**: animate `rotateY` on a `motion.div` and set `style={{ transformPerspective: 1000 }}` or a `perspective` on the parent.
- **GSAP**: set `transformPerspective` (or `perspective` on the container) and tween `rotationY`; GSAP's 3D handling is built in.

## See also
- [Scale In](../scale-in/) — a flatter, 2D entrance for the same card slot
- [Rotate In](../rotate-in/) — 2D spin rather than a 3D hinge
- [Blur In](../blur-in/) — a non-spatial focal entrance alternative
