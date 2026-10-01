# Page Curl

## What it is
A page curl turns a page over like a sheet of paper. Its bottom corner lifts and travels to the left, the part that has lifted lies folded over the page as the back of the sheet, and the next page shows underneath until the whole sheet has turned away. Going back runs it in reverse: the earlier page comes over from the left and lays itself down.

## When to use it
- Digital magazines, catalogs and picture books, where the page itself is the content
- Restaurant menus, brochures and photo albums that imitate a printed original
- Story or onboarding screens that are read one page at a time
- Any reader where the visitor should feel they are moving through a book rather than between screens

## How it works
The page that turns sits on top of the next one. On every frame, its bottom-right corner is placed on a path that runs to the left and rises on the way. The fold is the line halfway between where the corner started and where it is now: the part of the page before the fold stays flat, and the part past it is mirrored over the fold to make the flap. All three shapes are polygons for `clip-path`, cut from the page's rectangle with one Sutherland-Hodgman step:

```js
const w=area.clientWidth,h=area.clientHeight,c={x:w-2*w*p,y:h-.8*h*Math.sin(Math.PI*p)};
const dx=w-c.x,dy=h-c.y,len=Math.hypot(dx,dy),box=[{x:0,y:0},{x:w,y:0},{x:w,y:h},{x:0,y:h}];
const n={x:dx/len,y:dy/len},m={x:(w+c.x)/2,y:(h+c.y)/2},past=q=>(q.x-m.x)*n.x+(q.y-m.y)*n.y;
const lifted=cut(box,past);                                  // the part that has lifted off the page
sheet.style.clipPath=poly(cut(box,q=>-past(q)));             // the flat part of the turning page
flap.style.clipPath=poly(lifted.map(q=>({x:q.x-2*past(q)*n.x,y:q.y-2*past(q)*n.y})));   // mirrored over the fold
shade.style.clipPath=poly(lifted);                           // the shadow on the page underneath
```

The flap is a box the color of the back of the sheet. Its shading is a `linear-gradient` turned to the fold's angle, with its stops measured in pixels from the fold: dark where the paper bends, a light band where it faces the light. The shadow box lies between the two pages and darkens the page underneath next to the fold. The progress `p` comes from the time since the turn began, eased in and out, so the turn takes the same time at any frame rate; a turn back runs `p` from 1 down to 0 with the earlier page as the sheet.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Turn speed | Normal | How long one page takes to turn over: slow is 1500ms, normal 1000ms and fast 650ms |
| Which way it turns | Forward and back | Forward and back turns the page away for a later page and lays an earlier page back down; the other two always turn one way |
| Paper shading | Soft | How strongly the fold is shaded and how dark the shadow on the page below is; off leaves a flat paper back |

## Production notes
- **A straight fold is a good fake.** Real paper bends in a curve, which needs a mesh in WebGL or many thin strips. A straight fold with a gradient across the flap reads as a curl at a fraction of the cost.
- **`clip-path` repaints.** The three polygons change every frame, so the browser repaints the turning page; keep it to a few layers and avoid heavy filters on them. Measure the box on every frame (or on resize), never once at load.
- **Move by elapsed time.** The progress is the time since the turn began divided by its length, never a fixed step per frame, so the turn is as long on a 120 Hz screen as on a 30 Hz phone.
- **Let people drag it.** In a reader, tie `p` to a pointer drag from the corner (Pointer Events, so touch works too) and let go to finish or undo the turn.
- **Reduced motion** fades the new page in over 300ms instead; nothing turns.
- **Library equivalents.** turn.js and StPageFlip build book-style page turns from CSS transforms or a canvas; Three.js page-curl shaders bend the page in real 3D. All of them use the same corner-and-fold idea.

## See also
- [3D Flip Card](../../06-3d-advanced/flip-card-3d/) — a card turns over in 3D to show its back
- [Slide Transition](../slide-transition/) — pages move sideways instead
- [Overlay Wipe](../overlay-wipe/) — a colored panel hides the change instead
- [Crossfade Transition](../crossfade/) — the plain fade it falls back to
