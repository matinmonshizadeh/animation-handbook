# 3D Flip Card

## What it is
A flip card is a single element with a front and back face that rotates in three dimensions to swap which side is visible. The rotation happens in real 3D space rather than a 2D crossfade: a `perspective` on the container gives the turn depth, `transform-style: preserve-3d` keeps both faces in the same 3D scene, and `backface-visibility: hidden` hides whichever side is turned away from the viewer. An optional cursor-driven tilt while the card is idle adds a sense of physical depth before the flip.

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
| Flip axis | rotateY | `rotateY` turns left/right; `rotateX` turns top/bottom. Match the back face's pre-rotation to the axis. |
| Flip duration | 650ms | 150–300ms feels snappy; 600–900ms feels physical; over ~1200ms drags. |
| Perspective depth | 1200px | Lower (500px) exaggerates the turn into a fish-eye; higher (2500px) flattens it toward a 2D spin. |
| Idle tilt strength | 10° | Degrees of pre-flip lean toward the cursor. 0 disables it; over ~20° feels unstable. |
| Trigger | Click | Click/tap toggles; hover flips on pointer enter and restores on leave. |

## Production notes
- **Backface-visibility support**: both faces must be absolutely positioned and stacked, and the inner element must have `preserve-3d`. If `preserve-3d` is missing (or a property like `overflow` or `filter` flattens the context), both faces render and the back bleeds through.
- **Safari flicker**: WebKit can flash the hidden face mid-rotation. Add `-webkit-backface-visibility: hidden` and nudge each face with `transform: translateZ(0)` (or `translateZ(1px)`) to force a stable compositing layer. Avoid `overflow`/`filter` on the `preserve-3d` element, as they can collapse the 3D context.
- **Accessibility**: the flip must be keyboard-triggerable — make the card focusable (`tabindex="0"`, `role="button"`) and flip on Enter/Space, with a visible focus ring. Because `backface-visibility: hidden` only hides visuals, the back face's text stays in the accessibility tree and is reachable; expose state with `aria-pressed`. Do not hide the reverse content behind hover alone.
- **Reduced motion**: under `prefers-reduced-motion: reduce`, drop the rotation and the tilt entirely and swap faces with an instant opacity change instead, so the information is still available without vestibular-triggering movement.
- **Libraries**: Framer Motion animates this with `rotateY` on a motion component and `AnimatePresence` for the face swap; GSAP handles it with `rotationY` plus `transformPerspective`/`transformStyle`. The vanilla CSS version above needs no dependency for the common case.

## See also
- [Parallax 3D Tilt](../parallax-3d-tilt/)
- [Scroll-Driven 3D Rotation](../scroll-driven-3d-rotation/)
- [Glassmorphism Animated](../glassmorphism-animated/)
