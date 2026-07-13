# Toast Notification

## What it is
A toast is a small, transient notification card that slides into a corner of the screen, waits a few seconds, then removes itself. Toasts stack when several fire in quick succession, count down a progress bar toward their auto-dismiss, and accept an early dismiss by tap, swipe, or a close button. When one leaves, the others animate up to close the gap it left behind.

## When to use it
- Confirming a background action completed — "Saved", "Copied", "Uploaded"
- Reporting a non-blocking error the user can ignore or retry — "Failed to sync"
- Surfacing passive status the user did not explicitly ask for — "New version available"
- Any feedback that should not interrupt the task the way a modal or dialog would

## How it works
Each toast enters from the corner's edge with a `transform` (a `translateX` off-screen for slide, `scale(.85)` for scale, or opacity alone for fade), then settles to `transform: none` on the next frame. A `<span class="prog">` runs a CSS `scaleX(1) → scaleX(0)` animation for the auto-dismiss duration; its `animationend` triggers removal, so pausing the animation on `:hover` also pauses the dismissal for free.

The gap left by a departing toast is closed with **FLIP**. Before removing the node, record every surviving toast's position; after removal, apply the inverted delta as a `translateY` and let it transition back to zero — layout collapses, but only `transform` animates:

```js
const prev = new Map(toasts.map(t => [t, t.getBoundingClientRect().top]));
el.remove();
toasts.forEach(t => {
  const d = prev.get(t) - t.getBoundingClientRect().top;   // First - Last
  if (!d) return;
  t.style.transition = 'none';
  t.style.transform = `translateY(${d}px)`;                // Invert
  requestAnimationFrame(() => { t.style.transition=''; t.style.transform=''; }); // Play
});
```

The region is `role="status" aria-live="polite"` so each toast's text is announced without stealing focus. Swipe uses Pointer Events with `touch-action: pan-y`, so a horizontal drag past the threshold dismisses in that direction while vertical page scroll still passes through.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Corner | Top right | Anchor + enter direction; bottom corners use `column-reverse` so newest sits nearest the corner |
| Animation | Slide | Enter/exit transform: slide (`translateX`), fade (opacity), or scale |
| Auto-dismiss | 4.0s | Progress-bar duration; `animationend` fires the dismiss |
| Stack limit | 4 | Oldest toast is force-dismissed once the count exceeds this |
| Swipe threshold | 35% width | Horizontal drag past this (or a near-zero tap) dismisses on release |
| Reflow duration | ~250ms | FLIP `translateY` timing as the stack closes the gap |

## Production notes
- **Announce, don't trap.** Wrap the region in `aria-live="polite"` and `role="status"` so screen readers hear the message; never move focus into a toast — that is dialog behavior, not notification behavior. Errors that demand action belong in an alert, not a toast.
- **Cap the stack.** An unbounded stack buries the screen and defeats the purpose. Keep a small limit (3–5) and evict the oldest, or coalesce duplicates into a single count.
- **Pause on hover and focus.** A toast that vanishes while being read is hostile. Pausing the progress animation on `:hover`/`:focus-within` pauses the timer too when dismissal is driven by `animationend`.
- **Respect reduced motion.** Under `prefers-reduced-motion: reduce`, drop the slide/scale and the sweeping bar; appear and disappear instantly and fall back to a `setTimeout` for the auto-dismiss so the behavior survives without the animation.
- **Reflow with transforms, never layout.** Animating `top`/`height` to close the gap thrashes layout; FLIP keeps the motion on the GPU-friendly `transform`.
- **Library equivalents**: [Sonner](https://sonner.emilkowal.ski/) and `react-hot-toast` provide stacking, swipe, and pause-on-hover out of the box; Radix Toast supplies the accessible primitives (live region, swipe, timers) for a custom skin.

## See also
- [Drawer Slide](../drawer-slide/) — a larger corner-anchored panel driven by the same off-screen translate
- [Modal Expand](../modal-expand/) — the interrupting counterpart for feedback that must block
- [Success Confetti](../success-confetti/) — a celebratory companion to a "success" toast
