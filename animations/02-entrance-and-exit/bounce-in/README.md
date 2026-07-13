# Bounce In

## What it is
Bounce In brings an element up from small and low, overshoots its final size and position, then springs back to rest — the motion of something landing with momentum. Crucially, a real bounce is not a single easing curve: it is a series of hand-placed `@keyframes` waypoints, each defining an overshoot and settle, because one `cubic-bezier` can only overshoot once.

## When to use it
- Playful confirmations — a success badge, a "message sent" checkmark, an added-to-cart chip
- Toasts, tooltips, and popovers where a little life makes the appearance feel responsive
- Game UI, kids' products, and brands whose tone welcomes personality
- Any single element small enough that an energetic entrance won't feel heavy

## How it works
The card animates via a named keyframe rather than a transition. Each stop scales past 1 and pulls back under it, translating the vertical overshoot at the same time. The overshoot amounts are computed from an intensity slider so the waypoints stay proportional:

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

The generated CSS is injected into a live `<style>` tag, so changing intensity or bounce count rewrites the keyframe rule on the fly. Two- and three-bounce modes simply add more overshoot/undershoot pairs at tighter percentage intervals, each smaller than the last to imitate energy dissipating.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Overshoot intensity | 60% | Scales how far past 1.0 the waypoints reach; 0% = no bounce, 100% = exaggerated |
| Duration (`--dur`) | 1100ms | Bounces need room to breathe; too short and the springs read as a jitter |
| Bounces | 1 | Number of overshoot cycles — almost always 1; multiples look cartoonish |
| Combine with fade | on | Whether opacity starts at 0 or the element is already visible while it bounces |

## Production notes
- **Keyframes over easing**: an overshoot spring like `cubic-bezier(.34,1.56,.64,1)` gives *one* overshoot. Genuine multi-stage bounce and squash-and-stretch require explicit waypoints — that is the whole reason this technique uses `@keyframes`.
- **One bounce is usually right**: each extra bounce cycle reads as more juvenile. Reserve doubles and triples for deliberately toy-like contexts.
- **`animation-fill-mode: forwards`**: without it the element snaps back to its `scale(0.3)` start state after the animation ends; `forwards` holds the final frame.
- **Reduced motion**: the demo disables the keyframe animation entirely and shows the element at its resting state when `prefers-reduced-motion` is set — bounce is a classic motion-sickness trigger.
- **Framer Motion**: use a `type:"spring"` transition with `stiffness`/`damping`, or `bounce` on a spring — the physics model produces overshoot without authoring keyframes.
- **GSAP**: `Bounce.out` / `Elastic.out` eases, or a `.fromTo()` with overshoot values, cover this without a manual keyframe block.

## See also
- [Scale In](../scale-in/) — the same scale entrance without the overshoot
- [Rotate In](../rotate-in/) — pairs a springy ease with a spin for icons
- [Slide In](../slide-in/) — positional entrance that also benefits from spring easing
