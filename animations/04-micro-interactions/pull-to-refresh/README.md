# Pull to Refresh

## What it is
Pull to refresh reloads a list when you drag it down from its top. As you pull, the list follows your finger but resists more the further it goes, and a spinner above it fades in and turns. Let go past a set distance and the list stays down while the spinner keeps turning and new items load; then it slides back up with the new items on top.

## When to use it
- Feeds, inboxes, and timelines where "get the latest" is a frequent, expected action
- Touch-first screens where a visible reload button would clutter the header
- Lists whose content changes server-side between visits (notifications, orders, chat)
- Anywhere the content is already scrollable from the top, so the gesture has room to start

## How it works
The list lives in a scroller and is moved, together with the spinner's zone above it, by a single `translateY`. On `pointerdown` the start Y is recorded for that pointer; on `pointermove` the gesture is only *claimed* once the finger has moved down and the scroller is already at the top (`scrollTop <= 0`), which keeps normal scrolling intact everywhere else. The raw drag distance is passed through a rubber-band function so the list tracks the finger closely at first and fights back harder the further it is pulled:

```js
function resist(dy){                 // near 1:1 at first, asymptotic as it grows
  const max = threshold * 2.2;
  return max * dy / (dy + max * resistance);
}

scroller.addEventListener('pointermove', e => {
  if (e.pointerId !== pid || refreshing) return;
  const dy = e.clientY - startY;
  if (!pulling){
    if (dy > 4 && scroller.scrollTop <= 0){ pulling = true; scroller.setPointerCapture(pid); }
    else return;                     // let native scroll run
  }
  pull = resist(dy);
  setY(pull);                        // translateY on list + indicator
  drawSpin();                        // opacity + rotate scale with pull/threshold
});
```

On `pointerup`, if `pull >= threshold` the view enters the refreshing state: the list is tweened to a resting offset that keeps the spinner visible, the spinner switches from drag-driven rotation to a continuous CSS animation, and after the refresh time a new item is prepended and everything springs back. A short pull, or a gesture the browser cancels, tweens straight back to zero. The Refresh button in the list's header and the Show me button start the same refresh, and Show me draws its pull frame by frame with the same `setY()` and `drawSpin()`. Only `transform` and `opacity` move — never `top` or `height` — so the whole gesture stays on the compositor.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Pull distance | Medium | How far the list must be pulled before letting go refreshes: short is 48px, medium 64px and long 80px, measured after the resistance |
| Resistance | Medium | How hard the list fights back as it is pulled: low, medium or high; with a long pull distance and high resistance, it takes a long drag |
| Spinner | Ring | A turning ring, three blinking dots or four stretching bars |
| Refresh time | Medium | How long the spinner turns before the new item arrives: short is 700ms, medium 1200ms and long 2000ms |

## Production notes
- **Only claim the gesture at the top.** Check `scrollTop === 0` (or `<= 0`) before hijacking the drag, otherwise mid-list downward scrolls get swallowed and the list feels stuck.
- **`touch-action` and passive listeners.** Set `touch-action: pan-y` on the scroller so vertical scrolling still works; if you `preventDefault` inside the pull, the move listener cannot be `{ passive: true }`. At the boundary there is nothing to scroll, so the transform reads cleanly without fighting native scroll.
- **`overscroll-behavior: contain`** stops the browser's own overscroll glow/bounce and prevents the pull from chaining to the page or a parent scroller.
- **Native browser PTR conflicts.** Mobile browsers ship a built-in pull-to-refresh on the document. Keep your gesture inside a nested scroll container (not the page root), and use `overscroll-behavior-y: contain` on `html`/`body` in production so the browser's reload does not fire on top of yours.
- **Accessibility alternative.** A drag gesture is not reachable by keyboard or assistive tech, so always expose the same action as a real control — this demo's Refresh button, in the list's header, runs the identical code path, and a live region announces the state. Respect `prefers-reduced-motion` by snapping without the elastic tween.
- **Library equivalents**: Framer Motion can drive the same pull with a `useMotionValue` + `useTransform` on drag and an `onDragEnd` threshold check; PullToRefresh.js wraps the pattern for plain sites; iOS `UIRefreshControl` and Android `SwipeRefreshLayout` are the native platform equivalents.

## See also
- [Swipe to Dismiss](../swipe-to-dismiss/) — the sideways drag that removes an item
- [Loading Spinner](../loading-spinner/) — spinners on their own
- [Drawer / Panel Slide](../drawer-slide/) — a panel that slides in from an edge
