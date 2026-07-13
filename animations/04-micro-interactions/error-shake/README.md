# Error Shake

## What it is
An error shake is a validation-feedback pattern: when a user submits an invalid value, the offending field wobbles horizontally a few times and settles back to center, usually alongside a red border and an inline message. The motion is short, decaying, and purely on the X axis — a visual analogue of a human shaking their head "no."

## When to use it
- Login and sign-up forms on a failed or empty submit
- Inline field validation (wrong format, out-of-range value, mismatched confirmation)
- One-time password / PIN entry where a wrong code should be rejected without navigating away
- Any single-field rejection where you want feedback *at the field*, not in a separate toast

## How it works
The field is animated by toggling an `error` class that applies a `@keyframes` translateX wobble. The keyframe swings the element left and right with **decaying amplitude**, then returns to `translateX(0)`. Because only `transform` is animated, it stays on the compositor and never triggers layout:

```css
@keyframes shake {
  10%,90% { transform: translateX(calc(var(--shake-x) * -1)); }
  20%,80% { transform: translateX(calc(var(--shake-x) *  1)); }
  30%,50%,70% { transform: translateX(calc(var(--shake-x) * -0.6)); }
  40%,60% { transform: translateX(calc(var(--shake-x) *  0.6)); }
  100% { transform: translateX(0); }
}
.field.error input { border-color: var(--err); animation: shake var(--shake-dur) cubic-bezier(.36,.07,.19,.97) both; }
```

The one JS gotcha: re-adding the class on an element that already has it won't replay the animation. Force a reflow between removing and re-adding so the browser restarts it:

```js
function shake(text){
  field.classList.remove('error','ok');
  void field.offsetWidth;        // reflow -> animation restarts
  msg.textContent = text;
  field.classList.add('error');
}
```

A decaying shake reads as "no" universally because it *returns to origin*. Motion that ends where it began signals rejection — nothing was committed. Contrast a slide or a checkmark, which move to a new state and signal progress. The decay (large swings shrinking to small) mimics the physics of a real headshake and a damped spring, so it feels natural rather than like a glitch.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Shake intensity | 8px | Peak X displacement. Under 4px is barely legible; over ~16px feels violent |
| Oscillations | 6 | Number of left-right swings. 4–6 reads as a headshake; more feels frantic |
| Duration | 400ms | Total wobble time. Under 250ms feels twitchy; over 600ms drags |
| Easing | `cubic-bezier(.36,.07,.19,.97)` | Snappy in/out so swings feel sharp, not floaty |
| Error color | `#f4515b` | Border + message color; pair with text, never rely on color alone |

## Production notes
- **Don't rely on motion or color alone.** The shake and red border are reinforcement; the inline text message is what conveys *why* it failed. Color-blind and reduced-motion users need the words.
- **Reduced motion**: gate the shake behind `@media (prefers-reduced-motion: reduce)` and disable the animation there — the red border plus message still communicates the failure without any movement.
- **Restart trick**: the reflow (`void el.offsetWidth`) is required for repeated failures. Alternatively, listen for `animationend` and remove the class, or use the Web Animations API (`el.animate(...)`) which restarts cleanly on every call.
- **Debounce rapid submits** so a mashed submit button doesn't stack animations; the class-toggle + reflow pattern already coalesces to one run.
- **`prefers-reduced-motion` at the JS layer**: if you drive the shake with the WAAPI instead of CSS, check the media query in JS and skip `.animate()` when reduce is set.
- **Library equivalents**: Framer Motion expresses this as `animate={{ x: [0,-8,8,-5,5,0] }}` on a keyframe array; GSAP ships a dedicated `RoughEase` and you can also `gsap.fromTo(el,{x:-8},{x:0,ease:'elastic'})`. Both are the same translateX-keyframe idea with nicer restart ergonomics.

## See also
- [Form Field Morph](../form-field-morph/) — the valid-state transition counterpart to a rejection
- [Focus Ring](../focus-ring/) — the other key input-affordance micro-interaction
- [Button Press Scale](../button-press-scale/) — press feedback on the submit button that triggers validation
- [Checkmark Draw](../checkmark-draw/) — the "yes" success motion that a shake is the opposite of
