# Scale In / Zoom In

## What it is

A scale-in grows an element from a little smaller than its final size up to full size, usually while it fades in. The anchor point decides where it grows from: its own center, an edge or a corner. With a springy curve the slight overshoot makes the arrival feel physical, as if the element lands in place.

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
| Starting size | A bit smaller | How small it starts: a bit smaller is 80% of full size, half size 50% and from nothing 0%; close to full size is subtle, below half reads as a big zoom |
| Grows from | Center | The point it grows from: the center, the top left corner, the top edge or the bottom edge |
| Speed | Normal | How long it takes: slow is 800ms, normal 500ms and fast 300ms; a springy curve needs room to overshoot and settle |
| Feel | Springy | Springy overshoots and settles; Smooth and Gentle arrive more calmly; Even keeps one steady pace |
| Fades in | on | Stops the element flashing at full strength while it is still tiny |

## Production notes
- **Anchor the origin to the trigger.** A popover that scales from `center` feels disconnected; setting `transform-origin` to the corner nearest its button makes it feel like it grew *out of* that button.
- **Don't start from `scale(0)` with springy easing** unless you want a hard pop — the overshoot from zero is dramatic and can feel cartoonish for UI. Starting around 0.8–0.9 keeps it refined.
- **Watch text rendering during the scale.** Scaling type up from very small can look soft mid-transition; keeping the start scale high (≥0.8) and the duration short minimizes the blur.
- **Reduced motion:** the demo disables the transform under `prefers-reduced-motion` and keeps a plain fade, so the element appears without zooming.
- **Library equivalents:** GSAP `gsap.from(el, { scale: 0.8, autoAlpha: 0, ease: 'back.out(1.7)' })` — `back.out` is the same overshoot; Framer Motion `initial={{ scale: 0.8, opacity: 0 }}` with a `type: 'spring'` transition; Motion One `animate(el, { transform: ['scale(0.8)', 'none'], opacity: [0, 1] })`.

## See also
- [Fade In / Fade Out](../fade-in-out/) — the plain fade, with no size change
- [Bounce In](../bounce-in/) — a bigger, springier landing
- [Slide In](../slide-in/) — travels into place instead of growing
- [Flip In](../flip-in/) — swings in like a card turning over
