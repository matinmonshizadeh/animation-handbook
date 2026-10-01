# Cube Transition

## What it is
A cube transition treats two pages as neighboring sides of a cube. When the page changes, the cube makes a quarter turn: the old page swings away around the cube's middle and the new one swings in from the side to take its place. Going back turns the cube the other way, so the visitor always knows which way they went.

## When to use it
- Photo stories and product tours, where each page is a large picture and the turn adds a sense of moving through space
- Slides and onboarding steps that have a clear order
- Story formats on phones, where a sideways cube turn between stories is already familiar
- Short sequences of pages; the effect is strong, so it suits a few changes rather than every click of an app

## How it works
No real cube is built. Each of the two pages gets the same 3D transform during the turn: move back to the cube's middle (half a side behind the screen), rotate, and move forward again. The old page goes from 0 to 90 degrees, the new one from 90 degrees to 0, so the two always meet at the cube's edge. The page area gives the scene its perspective, and each page darkens through a black layer whose opacity follows the turn:

```js
const side=axis==='Y',size=side?area.clientWidth:area.clientHeight,half=(size/2).toFixed(1),d=dur*(slowTog.checked?3:1);
const end=(next>prev?1:-1)*(side?-90:90);
const face=a=>`translateZ(-${half}px) rotate${axis}(${a}deg) translateZ(${half}px)`;
const how={duration:d,easing:'cubic-bezier(.65,0,.35,1)',fill:'forwards'};
area.style.perspective=Math.round(size*depth)+'px';
oldEl.animate([{transform:face(0)},{transform:face(end)}],how);
newEl.animate([{transform:face(-end)},{transform:face(0)}],how);
dims[prev].animate([{opacity:0},{opacity:.65}],how);
dims[next].animate([{opacity:.65},{opacity:0}],how);
```

Both pages have `backface-visibility: hidden`. Near the start and end of a turn one side faces away from the viewer, and a real cube would not show it; without the rule its mirrored back could be drawn over the other page. The page area clips its content (`overflow: hidden`), which keeps it flat: the two pages are drawn in page order, not sorted by depth. Only `transform` and `opacity` change, so the browser can run the whole turn on the graphics chip.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Turn direction | Sideways | Sideways turns around a vertical line, a later page coming in from the right; up and down turns around a horizontal line, a later page coming in from below |
| Speed | Normal | How long the cube takes to turn: slow is 1100ms, normal 750ms and fast 500ms |
| Depth | Normal | How close the viewer is to the cube: shallow puts them 3.2 sides away, normal 1.6 and deep 0.9, so the near edge looms larger |

## Production notes
- **Size the cube from the page.** The cube is as deep as the side it turns across, so read the page's width (or height) when the turn starts; a fixed depth makes the two pages part or overlap at the edge on other screen sizes.
- **Hide the back sides.** Without `backface-visibility: hidden`, a side that has turned past the viewer shows its mirrored back, and with no depth sorting it can be drawn over the page in front.
- **Shade, do not blur.** A black layer whose opacity follows the turn sells the light falling off; a blur or a box shadow would repaint every frame.
- **Mind motion sickness.** A large 3D turn is a lot of movement. Reduced motion fades the new page in over 300ms instead, and the turn should stay short.
- **Library equivalents.** Swiper's cube effect, the View Transitions API with 3D keyframes on `::view-transition-old` and `::view-transition-new` (inside a group with perspective), and GSAP `rotationY` tweens with `transformPerspective` all build the same quarter turn.

## See also
- [Scroll-Driven 3D Rotation](../../06-3d-advanced/scroll-driven-3d-rotation/) — a 3D cube turned by scrolling
- [3D Flip Card](../../06-3d-advanced/flip-card-3d/) — one card turns over to show its back
- [Slide Transition](../slide-transition/) — the flat version: pages slide across
- [Page Curl](../page-curl/) — the page turns over like paper instead
