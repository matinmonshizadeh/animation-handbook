# Swipe to Dismiss

## What it is
Swipe to dismiss removes a list item when you drag it sideways. While you drag, the card follows your finger exactly; when you let go, it either flies off the edge while its row closes up, or springs back into place. A long drag or a quick flick removes it. It is the gesture behind swipe-to-delete in mail and message apps.

## When to use it
- Mail, chat, and notification lists where "delete" or "archive" is the dominant action
- Card feeds where items are transient (dismissable tips, cleared alerts)
- Any touch-first list where a per-row button would be cramped or slow
- Undo-friendly destructive actions — pair the fly-off with a "Undo" snackbar

## How it works
Each card is dragged with **Pointer Events** so one code path covers mouse, touch, and pen. `pointerdown` captures the pointer and records the start X; `pointermove` sets `translateX` to the delta and fades opacity with distance; `pointerup` decides the outcome:

```js
card.addEventListener('pointermove', e => {
  if (!dragging) return;
  dx = e.clientX - startX;
  const now = performance.now();
  if (now > lastT){ vel = (e.clientX - lastX)/(now - lastT); lastX = e.clientX; lastT = now; }
  follow(card, reveal, dx);
});

function follow(card, reveal, x){
  card.style.transform = `translateX(${x}px)`;
  card.style.opacity = String(Math.max(0.3, 1 - Math.abs(x)/(card.offsetWidth*0.9)));
  reveal.classList.toggle('show', showReveal && Math.abs(x) > 8);
}

function end(){
  const w = card.offsetWidth;
  const pastDist = Math.abs(dx) > w * threshold;   // committed by distance
  const flick    = Math.abs(vel) > 0.6 && Math.abs(dx) > 24 && Math.sign(vel) === Math.sign(dx); // or by velocity
  (pastDist || flick) ? dismiss(row, card, dx >= 0 ? 1 : -1) : spring(card, reveal);
}
```

Commit is decided by distance **or** velocity — a fast flick counts even if the finger didn't travel far, which is what makes the gesture feel responsive. On dismiss, the card gets a `flung` transition to slide fully off-screen while the wrapping `.row` animates its `height` to `0`, collapsing the gap so the list closes up. `touch-action: pan-y` on the card lets vertical page scroll pass through while the horizontal drag is claimed by JS; when the browser takes a gesture over for scrolling it sends `pointercancel`, and the card always springs back. The demo also lets a focused message be removed with the Delete key, so the drag is not the only way.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Distance to delete | Medium | How far a card must be dragged before letting go deletes it: short is 20%, medium 35% and long 50% of its width; a quick flick deletes it from a shorter drag |
| Shows a Delete label | on | A red strip with the word Delete shows behind the card while it is dragged |

## Production notes
- **Use `setPointerCapture`** so `pointermove`/`pointerup` keep firing even if the finger leaves the card's box mid-drag; without it a fast swipe can drop events.
- **`touch-action`** is essential: set `pan-y` (or `none` if you also handle vertical) on the draggable element, otherwise the browser's native scroll fights your drag and the gesture stutters on mobile.
- **Collapse the row, not the card.** Animate the height of an outer wrapper to `0`; animating the card's own height while it's mid-fling causes reflow jank. Keep transforms/opacity on the card, layout collapse on the row.
- **Why the demo animates height**: the list closing up is the effect itself, so the row's height goes to zero, an exception to animating only transform and opacity; it stays cheap because only one short row changes at a time, the card itself moves with transform and opacity, and the row is removed as soon as its height reaches zero.
- **Reduced motion**: keep the *functionality* but drop the easing flourish — on `prefers-reduced-motion: reduce`, remove the fly-off transition and collapse the row instantly so nothing slides.
- **Always offer undo** for destructive swipes; a fly-off with no recovery path punishes fat-fingers. Remove from the DOM only after the undo window closes.
- **Library equivalents**: Framer Motion's `drag="x"` with `dragConstraints`, `onDragEnd`, and an `AnimatePresence` exit handles this declaratively; `react-swipeable` exposes `onSwipedLeft`/velocity handlers if you want gesture callbacks without the transform plumbing; SortableJS covers the reorder cousin of this gesture; GSAP's `Draggable` with `throwProps`/inertia gives physics-based fling and snap-back.

## See also
- [Drawer / Panel Slide](../drawer-slide/) — another panel moved by a gesture
- [Modal Expand](../modal-expand/) — a window that grows out of the button you pressed
- [Button Press Scale](../button-press-scale/) — a button that shrinks as you press it
- [Toggle / Switch Slide](../toggle-switch/) — a smaller control that slides and settles
