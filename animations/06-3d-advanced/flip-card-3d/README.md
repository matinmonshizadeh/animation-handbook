# 3D Flip Card

## What it is
A 3D flip card has a front and a back and turns over in 3D to show the other side. Both faces sit in the same place, the back one turned away, and whichever face points away from the viewer is hidden. Perspective on the card's container gives the turn real depth, so it feels like turning over a physical card.

## When to use it
- Profile, team, or contact cards where the back holds secondary details
- Product cards that reveal specs or pricing on the reverse
- Flashcards and quiz UIs where question and answer live on two sides
- Gallery tiles where hover reveals a caption or call to action
- Any place a straight crossfade would feel flat and you want a tactile, physical turn

## How it works
Three properties do the work. `perspective` goes on the **container**, `preserve-3d` on the rotating **inner** element, and `backface-visibility: hidden` on **each face**. The back face is pre-rotated 180 degrees so it reads correctly once the card turns:

```css
.stage { perspective: 1200px; }            /* camera depth, on the parent */

.card {
  transform-style: preserve-3d;            /* faces share one 3D scene */
  transition: transform 650ms cubic-bezier(.6,.02,.2,1);
}
.card.flipped { transform: rotateY(180deg); }

.face {
  position: absolute; inset: 0;
  backface-visibility: hidden;             /* hide the side facing away */
}
.back { transform: rotateY(180deg); }      /* pre-flip so it faces out */
```

Toggling is a single class, so the same markup works for click, keyboard, and hover triggers:

```js
card.addEventListener('click', () => card.classList.toggle('flipped'));
card.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.classList.toggle('flipped'); }
});
```

The idle tilt is separate from the flip. A wrapper between the perspective container and the card rotates a few degrees toward the pointer, tracked with Pointer Events so it works for mouse and pen alike:

```js
stage.addEventListener('pointermove', e => {
  const r = stage.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width  - 0.5;
  const y = (e.clientY - r.top)  / r.height - 0.5;
  tilt.style.transform = `rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;
});
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Flip direction | Sideways | Sideways turns the card like a page; up and over turns it like a flap |
| Speed | Normal | How long one turn takes: slow is 1000ms, normal 650ms and fast 400ms; 600 to 900ms feels physical |
| 3D depth | Medium | How close the viewer seems: subtle is 2000px, medium 1200px and strong 600px; closer exaggerates the turn |
| Flips on hover | off | Pointing at the card turns it over and leaving turns it back; a tap still turns it on touch screens |
| Tilt toward the pointer | Gentle | While idle, the card leans toward a hovering pointer, up to 5° (gentle) or 9° (strong) at the stage's edges; off keeps it flat |

## Production notes
- **Backface-visibility support**: both faces must be absolutely positioned and stacked, and the inner element must have `preserve-3d`. If `preserve-3d` is missing (or a property like `overflow` or `filter` flattens the context), both faces render and the back bleeds through.
- **Safari flicker**: WebKit can flash the hidden face mid-rotation. Add `-webkit-backface-visibility: hidden` and nudge each face with `transform: translateZ(0)` (or `translateZ(1px)`) to force a stable compositing layer. Avoid `overflow`/`filter` on the `preserve-3d` element, as they can collapse the 3D context.
- **Accessibility**: the flip must be keyboard-triggerable — make the card focusable (`tabindex="0"`, `role="button"`) and flip on Enter/Space, with a visible focus ring. Because `backface-visibility: hidden` only hides visuals, the back face's text stays in the accessibility tree and is reachable; expose state with `aria-pressed`. Do not hide the reverse content behind hover alone.
- **Reduced motion**: under `prefers-reduced-motion: reduce`, drop the rotation and the tilt entirely and swap faces with a quick opacity fade instead (the demo's takes 120ms), so the information is still available without vestibular-triggering movement.
- **Libraries**: Framer Motion animates this with `rotateY` on a motion component and `AnimatePresence` for the face swap; GSAP handles it with `rotationY` plus `transformPerspective`/`transformStyle`. The vanilla CSS version above needs no dependency for the common case.

## See also
- [Parallax 3D Tilt](../parallax-3d-tilt/) — a card leans toward the pointer without turning over
- [Flip In](../../02-entrance-and-exit/flip-in/) — a card swings into view on a 3D hinge
- [Scroll-Driven 3D Rotation](../scroll-driven-3d-rotation/) — scrolling turns a 3D cube
