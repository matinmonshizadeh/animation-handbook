# Slide Transition

## What it is
A slide transition moves the old page out of one side while the new page comes in from the other, like panels on a track. When the direction follows the navigation — forward slides to the left, back slides to the right — it gives visitors a sense of where they are, as phone apps do. The demo can also always slide the same way, or slide down.

## When to use it
- Multi-step flows: onboarding, checkout, wizards where "next" and "back" have a clear direction
- Mobile-style navigation stacks where pushing and popping screens should feel spatial
- Carousels and paged content with an inherent left-to-right order
- Anywhere the direction of motion should reinforce the direction of navigation

## How it works
Direction is derived from whether the target index is greater or less than the current one; forward returns `-1` (slide left), back returns `+1` (slide right). The new page is parked off-screen on the opposite side, then both pages transition their `transform` together in the same direction:

```js
function getDir(prev,next){
  if(dirMode==='ltr')return 1; if(dirMode==='rtl')return -1; if(dirMode==='vertical')return 2;
  return next>prev ? -1 : 1;   // auto: forward = left(-1), back = right(+1)
}

function doTransition(prev,next,dur,stagger,ease){
  const oldEl=pages[prev], newEl=pages[next];
  const d=getDir(prev,next), dir=Math.abs(d)===2?'Y':'X', sign=d<0?-1:1;
  newEl.style.transition='none';
  newEl.style.transform=`translate${dir}(${sign*-100}%)`;   // park off-screen, opposite edge
  void newEl.offsetWidth;                                  // commit the parked position
  oldEl.style.transition=`transform ${dur}ms ${ease}`;
  newEl.style.transition=`transform ${dur}ms ${ease} ${stagger}ms`;
  oldEl.style.transform=`translate${dir}(${sign*100}%)`;   // both move the same way
  newEl.style.transform='translate(0,0)';
}
```

Because both pages animate `transform` in the same direction and by the same 100%, they stay locked edge-to-edge as they move — the compositor handles it entirely, which is why `will-change:transform` is set on every page. The Gap between pages setting adds an optional delay on the incoming page so it trails the outgoing one.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Direction | Forward and back | Forward and back slides left for the next page and right for the previous one; the other choices always slide the same way |
| Speed | Normal | How long each slide takes: slow is 800ms, normal 500ms and fast 300ms; 300 to 500ms matches phone apps, longer drags |
| Feel | Smooth | Smooth slows to a stop; Springy goes a little past and settles back; Even keeps one steady pace |
| Gap between pages | None | How much later the new page starts: none, small (80ms) or large (160ms); a delay leaves a gap between the pages |

## Production notes
- **Animate `transform: translate`, never `left`/`right`** — translate runs on the compositor and stays at 60fps; positional properties trigger layout on every frame.
- **Commit the parked position.** Reading `offsetWidth` after parking the new page off-screen makes the browser apply that position before the transition is switched on; without it the two writes merge and the new page jumps straight in with no slide.
- **Off-screen pages keep `pointer-events` disabled** until active, so parked panels don't intercept taps.
- **Match direction to platform expectation.** On mobile, forward-left / back-right is muscle memory; inverting it disorients users. The Forward and back setting encodes this.
- **Reduced motion** toggles the `.active` class and clears transforms with no slide.
- **Library equivalents**: the View Transitions API expresses this with slide keyframes on `::view-transition-old/new`. Framer Motion's `AnimatePresence` with `x` variants, React Router transition libraries, and GSAP's `xPercent` tweens all implement the same paired-translate.

## See also
- [View Transitions API](../view-transitions-api/) — the browser can slide pages too
- [Zoom Transition](../zoom-transition/) — pages move in depth instead
- [Crossfade Transition](../crossfade/) — pages fade instead of moving
- [Elastic Transition](../elastic-transition/) — the slide with a springy finish
