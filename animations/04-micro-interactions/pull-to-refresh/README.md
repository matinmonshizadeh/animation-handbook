# Pull to Refresh

## What it is
Pull to refresh is the touch gesture where dragging a scroll list downward past its top edge reveals a spinner that fills and rotates in proportion to the drag distance. Release past a set threshold and the view enters a "refreshing" state, holds the spinner while new data loads, then snaps the content back and updates the list. It is the standard reload gesture in mail, feed, and message apps.

## When to use it
- Feeds, inboxes, and timelines where "get the latest" is a frequent, expected action
- Touch-first screens where a visible reload button would clutter the header
- Lists whose content changes server-side between visits (notifications, orders, chat)
- Anywhere the content is already scrollable from the top, so the gesture has room to start

## How it works
The list lives in a scroller and is moved with a single `translateY`. On `pointerdown` the start Y is recorded; on `pointermove` the gesture is only *claimed* once the finger has moved down and the scroller is already at the top (`scrollTop <= 0`), which keeps normal scrolling intact everywhere else. The raw drag distance is passed through a rubber-band function so the list tracks the finger closely at first and fights back harder the further it is pulled:

```js
function resist(dy){                 // near 1:1 at first, asymptotic as it grows
  const max = threshold * 2.2;
  return max * dy / (dy + max * resistance);
}

scroller.addEventListener('pointermove', e => {
  const dy = e.clientY - startY;
  if (!pulling){
    if (dy > 4 && scroller.scrollTop <= 0){ pulling = true; scroller.setPointerCapture(e.pointerId); }
    else return;                     // let native scroll run
  }
  pull = resist(dy);
  setY(pull);                        // translateY on list + indicator
  drawSpin();                        // opacity + rotate scale with pull/threshold
});
```

On `pointerup`, if `pull >= threshold` the view enters the refreshing state: the list is tweened to a resting offset that keeps the spinner visible, the spinner switches from drag-driven rotation to a continuous CSS animation, and after the refresh duration a new item is prepended and everything snaps back. A short pull tweens straight back to zero. Only `transform` and `opacity` move — never `top` or `height` — so the whole gesture stays on the compositor.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Pull threshold | 64px | Resisted distance the list must pass before a release triggers a refresh |
| Resistance | 2.0× | Damping of the rubber band; higher makes the list harder to pull far |
| Spinner style | Ring | Visual form of the indicator (ring, dots, or bars) |
| Refresh duration | 1200ms | How long the "refreshing" state holds before the content updates and snaps back |
| Resting offset | 64px | Fixed distance the list is held down while refreshing so the spinner stays in view |

## Production notes
- **Only claim the gesture at the top.** Check `scrollTop === 0` (or `<= 0`) before hijacking the drag, otherwise mid-list downward scrolls get swallowed and the list feels stuck.
- **`touch-action` and passive listeners.** Set `touch-action: pan-y` on the scroller so vertical scrolling still works; if you `preventDefault` inside the pull, the move listener cannot be `{ passive: true }`. At the boundary there is nothing to scroll, so the transform reads cleanly without fighting native scroll.
- **`overscroll-behavior: contain`** stops the browser's own overscroll glow/bounce and prevents the pull from chaining to the page or a parent scroller.
- **Native browser PTR conflicts.** Mobile browsers ship a built-in pull-to-refresh on the document. Keep your gesture inside a nested scroll container (not the page root), and use `overscroll-behavior-y: contain` on `html`/`body` in production so the browser's reload does not fire on top of yours.
- **Accessibility alternative.** A drag gesture is not reachable by keyboard or assistive tech, so always expose the same action as a real control — this demo wires a "Refresh now" button to the identical code path and announces state through an `aria-live` region. Respect `prefers-reduced-motion` by snapping without the elastic tween.
- **Library equivalents**: Framer Motion can drive the same pull with a `useMotionValue` + `useTransform` on drag and an `onDragEnd` threshold check; PullToRefresh.js wraps the pattern for plain sites; iOS `UIRefreshControl` and Android `SwipeRefreshLayout` are the native platform equivalents.

## See also
- [Swipe to Dismiss](../swipe-to-dismiss/) — the horizontal sibling: pointer drag with a distance/velocity threshold
- [Loading Spinner](../loading-spinner/) — the indicator this gesture reveals, on its own
- [Drawer Slide](../drawer-slide/) — another gesture-driven translate that settles at a resting offset
