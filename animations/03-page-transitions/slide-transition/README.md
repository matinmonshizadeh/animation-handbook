# Slide Transition

## What it is
A slide transition moves the outgoing page off one edge of the viewport while the incoming page slides in from the opposite edge, so the two travel together like panels on a track. When the direction is tied to navigation intent — forward slides left, back slides right — it gives users a spatial map of where they are in a flow. The demo mirrors the iOS and Android convention and also offers fixed left/right and vertical modes.

## When to use it
- Multi-step flows: onboarding, checkout, wizards where "next" and "back" have a clear direction
- Mobile-style navigation stacks where pushing and popping screens should feel spatial
- Carousels and paged content with an inherent left-to-right order
- Anywhere the direction of motion should reinforce the direction of navigation

## How it works
Direction is derived from whether the target index is greater or less than the current one; forward returns `-1` (slide left), back returns `+1` (slide right). The new page is parked off-screen on the opposite side, then both pages transition their `transform` together in the same direction:

```js
function getDir(prev,next){
  const m=dirMode.value;
  if(m==='ltr')return 1; if(m==='rtl')return -1; if(m==='vertical')return 2;
  return next>prev ? -1 : 1;   // auto: forward = left(-1), back = right(+1)
}

function doTransition(prev,next){
  const d=getDir(prev,next), dir=Math.abs(d)===2?'Y':'X', sign=d<0?-1:1;
  newEl.style.transition='none';
  newEl.style.transform=`translate${dir}(${sign*-100}%)`;   // park off-screen, opposite edge
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    oldEl.style.transition=`transform ${dur}ms ${easeSel.value}`;
    newEl.style.transition=`transform ${dur}ms ${easeSel.value} ${stagger}ms`;
    oldEl.style.transform=`translate${dir}(${sign*100}%)`;   // both move the same way
    newEl.style.transform='translate(0,0)';
  }));
}
```

Because both pages animate `transform` in the same direction and by the same 100%, they stay locked edge-to-edge as they move — the compositor handles it entirely, which is why `will-change:transform` is set on every page. A stagger control adds an optional delay on the incoming page so it trails the outgoing one slightly.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Direction mode | Auto | Auto derives direction from navigation; ltr/rtl/vertical force a fixed axis |
| Duration | 500ms | Slide length; 300–500ms matches native feel, longer drags |
| Easing | `cubic-bezier(.2,.7,.3,1)` | "Smooth" decel; springy adds a slight settle at the end |
| Stagger | 0ms | Delay on the incoming page so it trails the outgoing one |

## Production notes
- **Animate `transform: translate`, never `left`/`right`** — translate runs on the compositor and stays at 60fps; positional properties trigger layout on every frame.
- **The double `requestAnimationFrame`** is required: it lets the browser paint the off-screen start position before the transition begins, otherwise the new page jumps straight in with no slide.
- **Off-screen pages keep `pointer-events` disabled** until active, so parked panels don't intercept taps.
- **Match direction to platform expectation.** On mobile, forward-left / back-right is muscle memory; inverting it disorients users. The auto mode encodes this.
- **Reduced motion** toggles the `.active` class and clears transforms with no slide.
- **Library equivalents**: the View Transitions API expresses this with slide keyframes on `::view-transition-old/new`. Framer Motion's `AnimatePresence` with `x` variants, React Router transition libraries, and GSAP's `xPercent` tweens all implement the same paired-translate.

## See also
- [View Transitions API](../view-transitions-api/) — includes a slide style built on the same idea
- [Zoom Transition](../zoom-transition/) — depth-based motion instead of lateral
- [Crossfade](../crossfade/) — the non-directional alternative
- [Elastic Transition](../elastic-transition/) — a springy take on directional motion
