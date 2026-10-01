# Circle Reveal

## What it is
A circle reveal shows the next page through a circle that starts as a dot and grows until the new page fills the view. The dot sits where the visitor clicked or tapped, so the new page seems to spread out from their finger. Going back can run it the other way: the old page shrinks into the spot and uncovers the earlier one.

## When to use it
- App-style navigation, where a new view should grow out of the button that opened it
- Theme switches, where the dark or light version of the page spreads out from the toggle
- Round menu buttons and floating action buttons that open into a full panel
- Any change where the place of the click carries meaning: this card, this button, this spot on a map

## How it works
Both pages sit in the same box. The page that moves is put on top and clipped to a circle: for an opening, the new page starts as a circle of radius zero at the click and grows; for a closing (going back with Closes when you go back on), the old page stays on top and its circle shrinks to zero. The end size is the distance to the farthest corner of the box, measured when the change starts:

```js
const w=area.clientWidth,h=area.clientHeight;
const x=origin==='center'?w/2:origin==='corner'?w:pt.x,y=origin==='center'?h/2:origin==='corner'?h:pt.y;
const far=Math.ceil(Math.max(Math.hypot(x,y),Math.hypot(w-x,y),Math.hypot(x,h-y),Math.hypot(w-x,h-y)));
const closing=closeTog.checked&&next<prev,top=closing?oldEl:newEl,at=`px at ${x.toFixed(1)}px ${y.toFixed(1)}px)`;
top.style.zIndex='2';top.style.transition='none';top.style.clipPath='circle('+(closing?far:0)+at;
top.offsetHeight; // commit the starting circle before the change is switched on
top.style.transition=`clip-path ${d}ms cubic-bezier(.4,0,.2,1)`;
top.style.clipPath='circle('+(closing?0:far)+at;
```

The click spot comes from the pointer event (`clientX` and `clientY`, less the box's own corner). A click made with the keyboard has no spot (its `detail` is 0), so the circle starts from the middle of the pressed button instead. A page name sits above the page box, so a circle that starts there begins just above the top edge and spreads down from the button.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Where it starts | Where you click | Where you click follows the pointer, or the middle of the button for a keyboard press; Center and Corner (the bottom right) always start in the same place |
| Speed | Normal | How long the circle takes to cover the page: slow is 1200ms, normal 750ms and fast 450ms |
| Closes when you go back | on | Going to an earlier page shrinks the old page into the spot instead of growing the earlier one out of it |

## Production notes
- **Reach the farthest corner.** A circle as wide as the box leaves the corners uncovered until the very end. The distance from the start to the farthest corner is the smallest radius that covers everything, so the change ends exactly when the last corner is reached.
- **Force the reflow.** Reading `offsetHeight` between the starting circle and the transition makes the browser commit the dot first; without it both writes merge and the page appears at once.
- **Measure at the moment of the click.** The box can move between clicks (scrolling, a resize), so read its position in the click handler, never once at load.
- **`clip-path` is cheap but not free.** The browser repaints the clipped page while the circle grows. Keep the page that is clipped light, and avoid heavy filters or shadows on it.
- **Reduced motion** fades the new page in over 300ms instead; nothing grows.
- **Library equivalents.** The View Transitions API does this natively: start the change with `document.startViewTransition()`, then animate `clip-path` on `::view-transition-new(root)` from a circle at the click to the full radius (the usual dark-mode toggle). GSAP and Framer Motion animate `clipPath` strings directly.

## See also
- [Portal / Tunnel Zoom](../portal-zoom/) — the circle opens from one round button
- [Clip-Path Reveal](../../02-entrance-and-exit/clip-path-reveal/) — a growing shape uncovers a single element
- [Click / Tap Ripple](../../04-micro-interactions/click-ripple/) — a ring spreads from the spot you press
- [Crossfade Transition](../crossfade/) — the plain fade it falls back to
