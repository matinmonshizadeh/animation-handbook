# Bounce In

## What it is

Bounce In brings an element up from small and low, overshoots its final size and position, then springs back to rest, like something landing with momentum. A real bounce isn't one smooth curve: it's a few hand-placed steps, each going a little past the target and coming back.

## When to use it
- Playful confirmations — a success badge, a "message sent" checkmark, an added-to-cart chip
- Toasts, tooltips, and popovers where a little life makes the appearance feel responsive
- Game UI, kids' products, and brands whose tone welcomes personality
- Any single element small enough that an energetic entrance won't feel heavy

## How it works
The card animates via a named keyframe rather than a transition. Each stop scales past 1 and pulls back under it, translating the vertical overshoot at the same time. The overshoot amounts are computed from the Bounce strength choice (an intensity of 30, 60 or 100) so the waypoints stay proportional:

```js
const t=intensity/100;
const ov1=1+t*0.15,un1=1-t*0.07;   // overshoot, then undershoot
kf=`@keyframes bounce-in{
  0%  {opacity:${fadeIn?0:1};transform:scale(0.3) translateY(40px)}
  55% {opacity:1;transform:scale(${ov1.toFixed(3)}) translateY(-8px)}
  80% {transform:scale(${un1.toFixed(3)}) translateY(3px)}
  100%{opacity:1;transform:scale(1) translateY(0)}
}`;
```

```css
.card{opacity:0;transform:scale(0.3) translateY(40px)}
.card.in{animation:bounce-in var(--dur) ease forwards}
```

The generated CSS is injected into a live `<style>` tag, so changing Bounce strength or Number of bounces rewrites the keyframe rule on the fly. Two- and three-bounce modes simply add more overshoot/undershoot pairs at tighter percentage intervals, each smaller than the last to imitate energy dissipating.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Bounce strength | Medium | How far past full size it grows: soft about 5%, medium 9% and strong 15%, with smaller dips back under |
| Number of bounces | One | How many times it overshoots; almost always one, since more looks cartoonish |
| Speed | Normal | How long it takes: slow is 1800ms, normal 1100ms and fast 650ms; too short and the spring reads as a jitter |
| Fades in | on | Whether it fades in while it bounces or is visible from the start |

## Production notes
- **Keyframes over easing**: an overshoot spring like `cubic-bezier(.34,1.56,.64,1)` gives *one* overshoot. Genuine multi-stage bounce and squash-and-stretch require explicit waypoints — that is the whole reason this technique uses `@keyframes`.
- **One bounce is usually right**: each extra bounce cycle reads as more juvenile. Reserve doubles and triples for deliberately toy-like contexts.
- **`animation-fill-mode: forwards`**: without it the element snaps back to its `scale(0.3)` start state after the animation ends; `forwards` holds the final frame.
- **Reduced motion**: the demo disables the keyframe animation entirely and shows the element at its resting state when `prefers-reduced-motion` is set — bounce is a classic motion-sickness trigger.
- **Framer Motion**: use a `type:"spring"` transition with `stiffness`/`damping`, or `bounce` on a spring — the physics model produces overshoot without authoring keyframes.
- **GSAP**: `Bounce.out` / `Elastic.out` eases, or a `.fromTo()` with overshoot values, cover this without a manual keyframe block.

## See also
- [Scale In](../scale-in/) — grows into place without the bounce
- [Rotate In](../rotate-in/) — spins into place while it grows
- [Slide In](../slide-in/) — travels into place from one edge
