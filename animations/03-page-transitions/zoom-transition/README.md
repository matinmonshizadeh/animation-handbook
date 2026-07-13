# Zoom Transition

## What it is
A zoom transition combines a scale change with an opacity cross-fade so pages appear to advance or recede through depth rather than sliding across a plane. The direction of the scale carries meaning: zooming in feels like arriving or drilling into content, zooming out like backing away, and a pull-through — where the new page rushes in oversized and settles — feels like traveling through space. The demo exposes all three variants and reports the live scale of each page.

## When to use it
- Drilling into detail from an overview, where zoom-in reinforces "going deeper"
- Dismissing or backing out of a view, where zoom-out signals departure
- Hero or splash moments where a pull-through adds a sense of momentum
- Modal and lightbox reveals that should feel like the content comes forward

## How it works
Each variant is a set of four scale values — `[oldStart, oldEnd, newStart, newEnd]`. The pages start at their "start" scales with the new one transparent, then on the next frame both transition their `transform` and `opacity` to the "end" state simultaneously:

```js
const V={
  'zoom-in': [1, 0.9, 0.75, 1],   // new page grows from 0.75 → 1 as old shrinks away
  'zoom-out':[1, 1.2,  1,   1],    // old page enlarges past the frame and fades
  'pull':    [1, 0.7,  1.3, 1],    // new rushes in from 1.3, old recedes to 0.7
}[variant];

o.style.transition='none'; n.style.transition='none';
o.style.transform=`scale(${V[0]})`;
n.style.opacity='0'; n.style.transform=`scale(${V[2]})`; n.classList.add('active');
requestAnimationFrame(()=>requestAnimationFrame(()=>{
  o.style.transition=t; n.style.transition=t;              // t = `all ${dur}ms ${ease}`
  o.style.opacity='0'; o.style.transform=`scale(${V[1]})`;
  n.style.opacity='1'; n.style.transform=`scale(${V[3]})`;
}));
```

Because the incoming and outgoing scales differ per variant, the same code path produces three distinct spatial feelings. The opacity cross-fade runs alongside the scale so neither page ever appears hard-edged over the other, and the double `requestAnimationFrame` ensures the start scale is painted before the transition kicks off.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Variant | Zoom in | Selects the four-value scale set (in / out / pull-through) |
| Duration | 550ms | Length of the combined scale + fade |
| Easing | `cubic-bezier(.2,.7,.3,1)` | "Smooth"; springy overshoots the end scale for a settle |
| New start scale | 0.75 (zoom-in) | How far the incoming page grows from — larger gaps read as deeper travel |

## Production notes
- **Animate `transform: scale`, not `width`/`height`.** Scale is composited and cheap; animating dimensions relays out the page every frame and drops frames.
- **Set `transform-origin` deliberately.** The demo scales from center; a zoom that should originate from a tapped card needs its origin set to that point, otherwise the growth feels detached from the trigger.
- **Fade alongside the scale.** Scaling without the opacity cross-fade leaves a hard edge where the two pages overlap; the paired fade hides the seam.
- **Springy easing can overshoot past scale 1** and momentarily clip content at the stage edge — keep overshoot modest or add padding.
- **Reduced motion** swaps pages by opacity only, skipping the scale.
- **Library equivalents**: the View Transitions API ships a zoom style via `::view-transition` scale keyframes. Framer Motion's `scale` variants in `AnimatePresence`, GSAP's `scale` tweens, and Next.js transitions all express the same scale-plus-fade.

## See also
- [View Transitions API](../view-transitions-api/) — includes a zoom style built the same way
- [Portal Zoom](../portal-zoom/) — zoom anchored to a specific source element
- [Slide Transition](../slide-transition/) — lateral motion instead of depth
- [Shared Element Transition](../shared-element-transition/) — scaling a single element for continuity
