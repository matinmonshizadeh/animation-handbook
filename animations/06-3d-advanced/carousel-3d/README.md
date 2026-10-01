# 3D Carousel

## What it is
A 3D carousel stands its cards in a ring and turns the whole ring to bring one card to the front. Each card is turned by an equal share of the circle and pushed out from the middle by the same distance, so the cards beside the front one lean away and the ones behind show their backs. Dragging spins the ring, and when you let go it coasts a little before it settles on the nearest card.

## When to use it
- Image galleries and portfolios where browsing should feel playful
- Product pickers with a handful of choices, such as colors, models or plans
- Album covers, book covers or event posters shown one at a time
- Landing page showcases with a small set of cards (about 5 to 12)

## How it works
Four nested elements carry the 3D. The box has the `perspective` (the camera); inside it one wrapper pushes the ring back by its radius and another tilts it for the view from above; the ring itself is what turns. Every one of them keeps its children in 3D with `preserve-3d`, and each card has a front and a back face that hide when they face away:

```css
.view { perspective: 900px; }
.push { transform-style: preserve-3d; transform: translateZ(calc(var(--r) * -1)); }
.tilt { transform-style: preserve-3d; transform: translateY(calc(var(--r) * -0.11)) rotateX(-14deg); }
.ring { transform-style: preserve-3d; }   /* the script sets rotateY() */
.face { backface-visibility: hidden; }    /* .back is turned 180° */
```

Card `i` is turned by `i × 360° / N` and pushed out by the radius. N cards with a small gap form a regular polygon, and the distance from its middle to the middle of a side is half a side divided by tan(180° / N). Pushing the ring back by that same radius keeps the front card at its normal size:

```js
const step = 360 / N;
const R = cardWidth * 1.12 / (2 * Math.tan(Math.PI / N));   // a gap of 12% of a card
card.style.transform = `rotateY(${i * step}deg) translateZ(var(--r))`;
ring.style.transform = `rotateY(${angle}deg)`;               // angle -i * step brings card i to the front
```

Dragging turns pixels into degrees at the ring's radius, so the front card follows the pointer: `angle = startAngle + dx × 180 / (π × R)`. Pointer Events serve mouse, touch and pen alike, and `touch-action: pan-y` lets a vertical swipe still scroll the page. On release, the speed of the last tenth of a second says how far the ring would coast; that place is rounded to the nearest card and the ring eases there, by elapsed time, so it runs at the same speed at any frame rate:

```js
const GLIDE = FRAME / -Math.log(1 - 0.09);            // the easing's time constant, about 177 ms
const throwDeg = speedPxPerMs * GLIDE * 180 / (Math.PI * R);
target = Math.round((angle + throwDeg) / step) * step;
// every frame
angle += (target - angle) * (1 - Math.pow(1 - 0.09, dt / FRAME));
```

Because the throw is the pointer's speed times the easing's time constant, the easing starts at the speed the pointer had, and the coast flows on from the drag without a jump. A press that hardly moves brings the pressed card to the front. The arrows and the arrow keys move the target one card at a time, and quick presses add up. Show me turns the ring once all the way round in three seconds, quickly at first and then coasting to a stop on the card it started from.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Number of cards | 8 | How many cards stand in the ring: 6, 8 or 12. More cards make a wider ring, so each card is drawn smaller to fit the box |
| Seen from above | on | Tilts the ring back 14 degrees, so the cards behind show above the front ones; off shows the ring straight on |
| Spins by itself | off | The ring turns 12 degrees a second, waits while you drag and starts again a moment after it settles; under reduced motion it steps one card every three seconds instead |

## Production notes
- **Accessibility**: give the ring a name and a role (`role="group"` with `aria-roledescription="carousel"`), real buttons for previous and next, and the arrow keys on the focused ring. Announce the card that settles in front through a polite live region, but not while the ring turns by itself.
- **Moving by itself**: anything that moves on its own for more than five seconds needs a way to stop it (WCAG 2.2.2). Pause the spin while the pointer is over the ring or it has keyboard focus, and offer a pause button.
- **Reduced motion**: under `prefers-reduced-motion: reduce`, jump from card to card instead of turning. The demo steps one card per drag, arrow or key press, and Show me steps to the next card and back.
- **Performance**: only the ring's `transform` changes while it moves, so the browser composites the cards without painting them again. `filter`, `overflow: hidden` or an `opacity` below 1 on an element with `preserve-3d` flattens it, and the ring collapses into a flat picture.
- **Libraries**: Swiper's coverflow and creative effects, GSAP Draggable with its InertiaPlugin for the throw, and Framer Motion's `drag` with momentum all build the same thing. Three.js gives a real 3D scene with lights and reflections when CSS 3D is not enough.

## See also
- [3D Flip Card](../flip-card-3d/) — one card turns over in 3D to show its back
- [Parallax 3D Tilt](../parallax-3d-tilt/) — a card leans toward the pointer
- [Snap Scrolling](../../01-scroll-based/snap-scrolling/) — a flat gallery that settles on one card at a time
- [Swipe to Dismiss](../../04-micro-interactions/swipe-to-dismiss/) — a card that follows a drag and flies off on a flick
