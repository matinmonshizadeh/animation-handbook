# Scale In / Zoom In

## What it is
A scale-in grows an element from a small start value up to its full `scale(1)`, usually with a fade layered on top. The `transform-origin` decides which point stays anchored while the rest expands, so the element appears to pop from a corner, an edge, or its own center. With springy easing the slight overshoot makes the arrival feel physical, as if the element lands into place.

## When to use it
- Modals, dialogs, and popovers zooming up from the control that opened them
- Cards or tiles appearing in a grid, each popping into place
- Icon or badge confirmations (a checkmark scaling in after an action)
- Menus and dropdowns expanding from the button that triggered them (origin set to that corner)

## How it works
The card starts at `scale(var(--ss))` with `opacity: 0` and transitions both to their end values when `.in` is added. The start scale, origin, easing, and fade are all CSS variables the controls rewrite:

```css
.card {
  opacity: var(--fade-opacity, 0);
  transform: scale(var(--ss));
  transform-origin: var(--origin);
  transition: transform var(--dur) var(--ease),
              opacity var(--dur) var(--ease);
  will-change: transform, opacity;
}
.card.in { opacity: 1; transform: scale(1); }
```

The default easing is `cubic-bezier(.34,1.56,.64,1)` — its control point above 1 pushes the scale past 1.0 mid-transition before settling, which is the overshoot that reads as a "pop." Changing `--origin` (e.g. to `top left`) re-anchors where that pop expands from.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Start scale | 0.80 | Closer to 1 is subtle; below 0.5 reads as a big zoom |
| Duration | 500ms | Springy easing needs room to overshoot and settle — under 300ms clips the bounce |
| Easing | Springy `cubic-bezier(.34,1.56,.64,1)` | The overshoot; `ease-out` gives a calmer, flat arrival |
| Transform origin | center | The anchor point the scale grows from |
| Combine with fade | on | Prevents the element flashing at full opacity while still tiny |

## Production notes
- **Anchor the origin to the trigger.** A popover that scales from `center` feels disconnected; setting `transform-origin` to the corner nearest its button makes it feel like it grew *out of* that button.
- **Don't start from `scale(0)` with springy easing** unless you want a hard pop — the overshoot from zero is dramatic and can feel cartoonish for UI. Starting around 0.8–0.9 keeps it refined.
- **Watch text rendering during the scale.** Scaling type up from very small can look soft mid-transition; keeping the start scale high (≥0.8) and the duration short minimizes the blur.
- **Reduced motion:** the demo disables the transform under `prefers-reduced-motion` and keeps a plain fade, so the element appears without zooming.
- **Library equivalents:** GSAP `gsap.from(el, { scale: 0.8, autoAlpha: 0, ease: 'back.out(1.7)' })` — `back.out` is the same overshoot; Framer Motion `initial={{ scale: 0.8, opacity: 0 }}` with a `type: 'spring'` transition; Motion One `animate(el, { transform: ['scale(0.8)', 'none'], opacity: [0, 1] })`.

## See also
- [Fade In / Fade Out](../fade-in-out/) — the fade this layers on top of
- [Bounce In](../bounce-in/) — a more pronounced elastic entrance
- [Slide In](../slide-in/) — arrival via position instead of size
- [Flip In](../flip-in/) — arrival via 3D rotation
