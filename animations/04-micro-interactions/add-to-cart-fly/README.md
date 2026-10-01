# Add-to-Cart Fly

## What it is
An add-to-cart fly sends a small copy of a product's picture into the cart icon when the visitor presses Add to cart. The copy shrinks as it travels, the cart gives a little bump as it lands, and the number on the cart goes up, so the visitor sees where the item went.

## When to use it
- Product lists and grids in online shops, where the cart icon is far from the product
- Food and grocery ordering, where people add many items in a row
- Wish lists and save-for-later buttons
- Any add button whose only other feedback is a number changing in a corner

## How it works
On a press, the product's picture is cloned and laid over itself in a layer of the stage. The copy sits in two nested wrappers, so each direction gets its own timing, and all three parts are animated with `element.animate()` (the Web Animations API) on `transform` and `opacity` only:

```js
fly.animate([{ transform: 'none' }, { transform: `translateX(${dx}px)` }],
  { duration: dur, fill: 'forwards', easing: 'linear' });                   // sideways, at an even pace
lift.animate([
  { transform: 'none', easing: 'cubic-bezier(.333,.667,.667,1)' },          // rising, slowing down
  { offset: at, transform: `translateY(${top}px)`, easing: 'cubic-bezier(.333,0,.667,.333)' }, // falling, faster
  { transform: `translateY(${dy}px)` }
], { duration: dur, fill: 'forwards' });
copy.animate([
  { transform: 'none', easing: 'ease-out' }, { offset: .3, transform: `scale(${mid})` },
  { offset: .85, transform: `scale(${end})`, opacity: 1 }, { transform: `scale(${end * .6})`, opacity: 0 }
], { duration: dur, fill: 'forwards' });
```

The two vertical easings are the two halves of a parabola: `cubic-bezier(.333,.667,.667,1)` is exactly t(2 − t) and `cubic-bezier(.333,0,.667,.333)` exactly t², so with the sideways move at an even pace the copy follows the path of a thrown ball. The top of the arc sits a little above the cart, and the moment `at` it is reached comes from the start speed such a throw needs: `v = 2·top − 2·√(top·(top − dy))` and `at = −v / (2·(dy − v))`. The Straight path gives both wrappers the same `ease-in-out` instead, which keeps the copy on a line.

When the vertical animation's `finished` promise resolves, the copy is removed, the count goes up, and the cart and its badge play a short bump. Because the landing waits for the animation itself, Slow motion (which sets `playbackRate` to one third on every animation in the stage) slows the flight and the landing together. Reset cancels any copy still in the air, so it never lands late.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Flight speed | Normal | How long the copy takes to reach the cart: slow is 1.1s, normal 0.7s and fast 0.45s |
| Path | Arc | Arc rises and drops into the cart like a toss; Straight goes in a line, easing in and out |
| Cart bumps | On | The cart tips and grows for a moment and its badge pops as the copy lands; off, only the number changes |

## Production notes
- **Measure at the press**: read the picture's and the cart's positions with `getBoundingClientRect()` when the button is pressed, since the page may have scrolled; on a whole page, give the copy `position: fixed` so scrolling during the flight does not move it.
- **Update the cart at once**: add the item to the cart data right away and only delay the visible count, so nothing is lost if the visitor leaves mid-flight, and announce the change to screen readers through a live region.
- **Many presses**: each press gets its own copy; cancel copies still in the air (`animation.cancel()`) when the cart is emptied or the view changes.
- **Keep it short**: a flight much longer than a second makes a quick shopper wait for feedback, and on a page where people add dozens of items, a simple count change is kinder.
- **Reduced motion**: under `prefers-reduced-motion: reduce` nothing flies and the cart does not bump; the new number fades in. The button's press is not eased either: a real press switches to the pressed look at once (no transition), and Show me's press only holds that look for a moment.
- **Libraries**: GSAP's MotionPathPlugin flies an element along a curve (`motionPath: { path: [...], curviness: 1.25 }`), Framer Motion can give `x` and `y` different `ease` values for the same arc, and the CSS `offset-path` property is another way to follow a curve.

## See also
- [Heart / Like Burst](../heart-burst/) — another button that celebrates the press
- [Notification Badge Pulse](../badge-pulse/) — a badge that draws the eye to a count
- [Button Press Scale](../button-press-scale/) — the small press the Add to cart button makes
- [Shared Element Transition](../../03-page-transitions/shared-element-transition/) — a picture that moves from one place to another
