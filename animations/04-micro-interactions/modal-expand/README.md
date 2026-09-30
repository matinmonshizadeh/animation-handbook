# Modal Expand

## What it is
Modal expand makes a dialog grow out of the button that opened it. The page measures where that button is and grows the window from that exact spot to its full size in the middle of the screen, so it is clear where the window came from and where it goes back to when it closes.

## When to use it
- Card actions where tapping a card opens a detail modal
- Floating action buttons (FABs) that expand into a form or panel
- Any trigger where the spatial relationship between button and modal matters for comprehension
- App-like interfaces mimicking iOS long-press → context menu expansion

## How it works
On click, measure the button's position with `getBoundingClientRect()`, then compute the same point relative to the modal's own corner:

```js
function openModal(btn) {
  const sr = stage.getBoundingClientRect();
  const br = btn.getBoundingClientRect();
  // The button's centre, relative to the stage
  const bx = br.left + br.width / 2 - sr.left;
  const by = br.top + br.height / 2 - sr.top;
  // The same point, relative to the modal's laid-out corner (offsetLeft/Top ignore its scale)
  modal.style.transformOrigin = `${bx - modal.offsetLeft}px ${by - modal.offsetTop}px`;
  modal.classList.add('open');
}
```

```css
:root {
  --modal-dur: 320ms;
  --modal-ease: cubic-bezier(.34, 1.3, .64, 1);
  --start-scale: 0.1;
}

.modal {
  position: absolute;
  inset: 0; margin: auto;              /* centred without a transform */
  width: clamp(240px, 55%, 320px); height: fit-content;
  transform: scale(var(--start-scale));
  opacity: 0;
  transition: transform var(--modal-dur) var(--modal-ease), opacity 200ms ease;
  pointer-events: none;
}
.modal.open { transform: scale(1); opacity: 1; pointer-events: auto; }
```

The springy easing (`cubic-bezier(.34, 1.3, .64, 1)`) causes a slight overshoot, giving the modal a satisfying "pop" as it settles into position.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Speed | Normal | How long the window takes to grow: slow is 500ms, normal 320ms and fast 200ms |
| Starting size | Small | How big the window is as it leaves the button: tiny is 5%, small 10% and medium 30% of its full size; too big and the growth is hard to see |
| Feel | Springy | Springy goes a little past full size, then settles; Smooth slows to a stop; Even keeps one steady speed |
| Marks where it grows from | on | Shows a small dot on the point the window grows out of |

## Production notes
- **Recalculate `transform-origin` on resize**: if the user resizes the window between opens, the cached origin is stale. Recalculate in the click handler, not at mount time.
- **Dismiss animation**: reverse the effect on close — scale back down toward the origin point. This requires keeping track of which button was last used to open the modal.
- **Focus management**: move focus into the modal on open (`modal.querySelector('button, input, [tabindex]')?.focus()`). Return focus to the trigger button on close.
- **`<dialog>` element**: the native `<dialog>` element handles focus trapping and Escape key automatically. Animate it with `::backdrop` for the overlay and `@starting-style` (Chrome 117+) for entry animation without JavaScript class toggling.
- **Framer Motion**: `<motion.div initial={{ scale: 0.1, originX: "50%", originY: "50%" }} animate={{ scale: 1 }} />`. For dynamic origins, pass computed values as motion props.
- **GSAP**: `gsap.fromTo(modal, { scale: 0.1, transformOrigin: `${ox}px ${oy}px` }, { scale: 1, duration: 0.32, ease: "back.out(1.5)" })`.

## See also
- [Drawer / Panel Slide](../drawer-slide/) — a panel that slides in from an edge instead
- [Tooltip Reveal](../tooltip-reveal/) — a small label for a short explanation
- [FLIP Technique](../../03-page-transitions/flip-technique/) — the same measure-then-move idea for any layout change
