# Modal Expand

## What it is
Modal expand is a transition where a modal dialog scales into view from the position of the button that triggered it. By setting `transform-origin` to the trigger button's location, the modal appears to "grow from" that point — maintaining spatial continuity between trigger and result. This gives users a clear mental model of where the modal came from and, by extension, where it will return to when dismissed.

## When to use it
- Card actions where tapping a card opens a detail modal
- Floating action buttons (FABs) that expand into a form or panel
- Any trigger where the spatial relationship between button and modal matters for comprehension
- App-like interfaces mimicking iOS long-press → context menu expansion

## How it works
On click, measure the button's position with `getBoundingClientRect()`, then compute the origin point relative to the modal's final centered position:

```js
function openModal(triggerBtn) {
  const stageRect = stage.getBoundingClientRect();
  const btnRect   = triggerBtn.getBoundingClientRect();
  const modalRect = modal.getBoundingClientRect();

  // Button center relative to stage
  const bx = btnRect.left + btnRect.width/2  - stageRect.left;
  const by = btnRect.top  + btnRect.height/2 - stageRect.top;

  // Modal center in stage
  const mx = stageRect.width / 2;
  const my = stageRect.height / 2;

  // Origin point relative to modal's top-left corner
  const ox = bx - mx + modalRect.width/2;
  const oy = by - my + modalRect.height/2;

  modal.style.transformOrigin = `${ox}px ${oy}px`;
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
  top: 50%; left: 50%;
  transform: translate(-50%, -50%) scale(var(--start-scale));
  opacity: 0;
  transition: transform var(--modal-dur) var(--modal-ease),
              opacity 200ms ease;
  pointer-events: none;
}
.modal.open {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
  pointer-events: auto;
}
```

The springy easing (`cubic-bezier(.34, 1.3, .64, 1)`) causes a slight overshoot, giving the modal a satisfying "pop" as it settles into position.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Duration | 320ms | 200–400ms — longer than hover, shorter than a page transition |
| Start scale | 0.1 | 0.05–0.3; too large and the grow effect is invisible; too small and it flickers |
| Easing | Springy | Overshoot makes the arrival feel physical; ease-out is more conservative |
| Backdrop fade | 200ms | Independent from modal — the backdrop can fade in faster |

## Production notes
- **Recalculate `transform-origin` on resize**: if the user resizes the window between opens, the cached origin is stale. Recalculate in the click handler, not at mount time.
- **Dismiss animation**: reverse the effect on close — scale back down toward the origin point. This requires keeping track of which button was last used to open the modal.
- **Focus management**: move focus into the modal on open (`modal.querySelector('button, input, [tabindex]')?.focus()`). Return focus to the trigger button on close.
- **`<dialog>` element**: the native `<dialog>` element handles focus trapping and Escape key automatically. Animate it with `::backdrop` for the overlay and `@starting-style` (Chrome 117+) for entry animation without JavaScript class toggling.
- **Framer Motion**: `<motion.div initial={{ scale: 0.1, originX: "50%", originY: "50%" }} animate={{ scale: 1 }} />`. For dynamic origins, pass computed values as motion props.
- **GSAP**: `gsap.fromTo(modal, { scale: 0.1, transformOrigin: `${ox}px ${oy}px` }, { scale: 1, duration: 0.32, ease: "back.out(1.5)" })`.

## See also
- [Drawer / Panel Slide](../drawer-slide/) — for content that slides from an edge rather than expanding from a point
- [Tooltip Reveal](../tooltip-reveal/) — for small supplementary content that doesn't need a full modal
- [FLIP Technique](../../03-page-transitions/flip-technique/) — the positional measurement technique underlying this animation
