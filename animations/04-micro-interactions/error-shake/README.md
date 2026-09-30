# Error Shake

## What it is
An error shake tells someone that what they entered was not accepted. The field swings left and right a few times, each swing smaller than the last, then settles exactly where it started, like a head shaking no. A red border and a short message come with it and say what went wrong.

## When to use it
- Login and sign-up forms on a failed or empty submit
- Inline field validation (wrong format, out-of-range value, mismatched confirmation)
- One-time password / PIN entry where a wrong code should be rejected without navigating away
- Any single-field rejection where you want feedback *at the field*, not in a separate toast

## How it works
The field is animated by toggling an `error` class that applies a `@keyframes` translateX wobble. The keyframe swings the element left and right with **decaying amplitude**, then returns to `translateX(0)`. Because only `transform` is animated, it stays on the compositor and never triggers layout:

```css
/* the default six swings, as the demo's buildShake(6) writes them (values rounded) */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  14% { transform: translateX(calc(var(--shake-x) * -0.86)); }
  29% { transform: translateX(calc(var(--shake-x) *  0.71)); }
  43% { transform: translateX(calc(var(--shake-x) * -0.57)); }
  57% { transform: translateX(calc(var(--shake-x) *  0.43)); }
  71% { transform: translateX(calc(var(--shake-x) * -0.29)); }
  86% { transform: translateX(calc(var(--shake-x) *  0.14)); }
}
.field.error input { border-color: var(--err); animation: shake var(--shake-dur) cubic-bezier(.36,.07,.19,.97) both; }
```

The demo writes this keyframe rule from JavaScript, so the Number of swings setting can give it as many swings as it asks for, each smaller than the last.

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
| Shake distance | Medium | How far the field swings: small is 4px, medium 8px and large 14px; under 4px barely shows and over about 16px feels violent |
| Number of swings | Medium | How many times it swings: few is 4, medium 6 and many 8; four to six reads as a head shake, more feels frantic |
| Speed | Normal | How long the whole shake lasts: slow is 650ms, normal 400ms and fast 250ms; under 250ms feels twitchy and over 600ms drags |

## Production notes
- **Don't rely on motion or color alone.** The shake and red border are reinforcement; the inline text message is what conveys *why* it failed. Color-blind and reduced-motion users need the words.
- **Reduced motion**: gate the shake behind `@media (prefers-reduced-motion: reduce)` and disable the animation there — the red border plus message still communicates the failure without any movement.
- **Restart trick**: the reflow (`void el.offsetWidth`) is required for repeated failures. Alternatively, listen for `animationend` and remove the class, or use the Web Animations API (`el.animate(...)`) which restarts cleanly on every call.
- **Debounce rapid submits** so a mashed submit button doesn't stack animations; the class-toggle + reflow pattern already coalesces to one run.
- **`prefers-reduced-motion` at the JS layer**: if you drive the shake with the WAAPI instead of CSS, check the media query in JS and skip `.animate()` when reduce is set.
- **Library equivalents**: Framer Motion expresses this as `animate={{ x: [0,-8,8,-5,5,0] }}` on a keyframe array; GSAP ships a dedicated `RoughEase` and you can also `gsap.fromTo(el,{x:-8},{x:0,ease:'elastic'})`. Both are the same translateX-keyframe idea with nicer restart ergonomics.

## See also
- [Form Field Morph](../form-field-morph/) — a label that rises out of the field as you use it
- [Focus Ring Animation](../focus-ring/) — a ring that follows keyboard focus
- [Button Press Scale](../button-press-scale/) — a button that shrinks as you press it
- [Checkmark Draw](../checkmark-draw/) — the tick that says yes
