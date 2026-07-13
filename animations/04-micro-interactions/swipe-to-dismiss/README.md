# Swipe to Dismiss

## What it is
Swipe to dismiss lets a user drag a list item horizontally and, past a distance or velocity threshold, throw it off-screen to remove it. While dragging, the card tracks the finger 1:1; on release it either flies off and its row collapses to zero height, or springs back to rest. It is the interaction behind swipe-to-delete in mail and message apps.

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
  card.style.transform = `translateX(${dx}px)`;
  card.style.opacity = String(Math.max(0.3, 1 - Math.abs(dx)/(card.offsetWidth*0.9)));
});

function end(){
  const w = card.offsetWidth;
  const pastDist = Math.abs(dx) > w * threshold;   // committed by distance
  const flick    = Math.abs(vel) > 0.6 && Math.abs(dx) > 24; // or by velocity
  (pastDist || flick) ? dismiss(row, card, dx >= 0 ? 1 : -1) : spring(card, reveal);
}
```

Commit is decided by distance **or** velocity — a fast flick counts even if the finger didn't travel far, which is what makes the gesture feel responsive. On dismiss, the card gets a `flung` transition to slide fully off-screen while the wrapping `.row` animates its `height` to `0`, collapsing the gap so the list closes up. `touch-action: pan-y` on the card lets vertical page scroll pass through while the horizontal drag is claimed by JS.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Dismiss threshold | 35% | Fraction of card width the drag must pass to commit on release |
| Velocity threshold | 0.6 px/ms | A flick above this commits even below the distance threshold |
| Fly-off distance | 125% width | How far past the edge the card slides before the row collapses |
| Collapse duration | 280ms | Row height `→ 0` timing; sets how fast the list closes the gap |
| Reveal background | on | Red "Delete" action shown behind the card while dragging |

## Production notes
- **Use `setPointerCapture`** so `pointermove`/`pointerup` keep firing even if the finger leaves the card's box mid-drag; without it a fast swipe can drop events.
- **`touch-action`** is essential: set `pan-y` (or `none` if you also handle vertical) on the draggable element, otherwise the browser's native scroll fights your drag and the gesture stutters on mobile.
- **Collapse the row, not the card.** Animate the height of an outer wrapper to `0`; animating the card's own height while it's mid-fling causes reflow jank. Keep transforms/opacity on the card, layout collapse on the row.
- **Reduced motion**: keep the *functionality* but drop the easing flourish — on `prefers-reduced-motion: reduce`, remove the fly-off transition and collapse the row instantly so nothing slides.
- **Always offer undo** for destructive swipes; a fly-off with no recovery path punishes fat-fingers. Remove from the DOM only after the undo window closes.
- **Library equivalents**: Framer Motion's `drag="x"` with `dragConstraints`, `onDragEnd`, and an `AnimatePresence` exit handles this declaratively; `react-swipeable` exposes `onSwipedLeft`/velocity handlers if you want gesture callbacks without the transform plumbing; SortableJS covers the reorder cousin of this gesture; GSAP's `Draggable` with `throwProps`/inertia gives physics-based fling and snap-back.

## See also
- [Drawer Slide](../drawer-slide/) — another off-screen translate driven by a gesture
- [Modal Expand](../modal-expand/) — enter/exit transition for the detail view a swipe might open
- [Button Press Scale](../button-press-scale/) — tactile press feedback for the row's tap target
- [Toggle / Switch Slide](../toggle-switch/) — a smaller drag-and-settle horizontal control
