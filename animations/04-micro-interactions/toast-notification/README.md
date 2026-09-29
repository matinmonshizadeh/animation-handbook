# Toast Notification

## What it is
A toast is a small message that comes into a corner of the screen, stays for a few seconds and then leaves on its own, while a thin bar counts down the time it has left. Toasts stack when several arrive close together, and when one leaves, the others glide over to close the gap. A tap, a swipe or its close button dismisses one early.

## When to use it
- Confirming a background action completed — "Saved", "Copied", "Uploaded"
- Reporting a non-blocking error the user can ignore or retry — "Failed to sync"
- Surfacing passive status the user did not explicitly ask for — "New version available"
- Any feedback that should not interrupt the task the way a modal or dialog would

## How it works
Each toast enters from the corner's edge with a `transform` (a `translateX` off-screen for slide, `scale(.85)` for scale, or opacity alone for fade), then settles to `transform: none` on the next frame. A `<span class="prog">` runs a CSS `scaleX(1) → scaleX(0)` animation for the auto-dismiss duration; its `animationend` triggers removal, so pausing the animation on `:hover` (or while a finger is held on the toast, or the keyboard focus is inside it) also pauses the dismissal for free.

The gap left by a departing toast is closed with **FLIP**. Before removing the node, record every surviving toast's position; after removal, apply the inverted delta as a `translateY` and let it transition back to zero — layout collapses, but only `transform` animates:

```js
const prev = new Map(toasts.map(t => [t, t.getBoundingClientRect().top]));
el.remove();
toasts.forEach(t => {
  const d = prev.get(t) - t.getBoundingClientRect().top;   // First - Last
  if (!d) return;
  t.style.transition = 'none';
  t.style.transform = `translateY(${d}px)`;                // Invert
  void t.offsetWidth;                                      // commit the inverted position
  requestAnimationFrame(() => { t.style.transition=''; t.style.transform=''; }); // Play
});
```

The region is `role="status" aria-live="polite"` so each toast's text is announced without stealing focus. Swipe uses Pointer Events with `touch-action: pan-y`, so a horizontal drag past the threshold dismisses in that direction while vertical page scroll still passes through.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Corner | Top right | Where toasts appear and stack; in the bottom corners the newest sits nearest the corner |
| How it comes in | Slides | Slides in from its corner's side, fades in, or grows from slightly smaller; it leaves the same way |
| Time on screen | Medium | How long each toast stays: short is 2.5 seconds, medium 4 and long 6.5; its bar counts down this time |
| Most at once | Four | Two, three or four; when one more arrives, the oldest leaves |

## Production notes
- **Announce, don't trap.** Wrap the region in `aria-live="polite"` and `role="status"` so screen readers hear the message; never move focus into a toast — that is dialog behavior, not notification behavior. Errors that demand action belong in an alert, not a toast.
- **Cap the stack.** An unbounded stack buries the screen and defeats the purpose. Keep a small limit (3–5) and evict the oldest, or coalesce duplicates into a single count.
- **Pause on hover and focus.** A toast that vanishes while being read is hostile. Pausing the progress animation on `:hover`/`:focus-within` pauses the timer too when dismissal is driven by `animationend`.
- **Respect reduced motion.** Under `prefers-reduced-motion: reduce`, drop the slide/scale and the sweeping bar; appear and disappear instantly and fall back to a `setTimeout` for the auto-dismiss so the behavior survives without the animation.
- **Reflow with transforms, never layout.** Animating `top`/`height` to close the gap thrashes layout; FLIP keeps the motion on the GPU-friendly `transform`.
- **Library equivalents**: [Sonner](https://sonner.emilkowal.ski/) and `react-hot-toast` provide stacking, swipe, and pause-on-hover out of the box; Radix Toast supplies the accessible primitives (live region, swipe, timers) for a custom skin.

## See also
- [Drawer / Panel Slide](../drawer-slide/) — a bigger panel that slides in from an edge
- [Modal Expand](../modal-expand/) — a window that must be closed before you go on
- [Success Confetti](../success-confetti/) — a celebration for a finished task
