# Dynamic Island

## What it is
A Dynamic Island is a small black pill at the top of a phone screen that grows into a larger card to show something live, such as a call, a timer or the song that is playing, and shrinks back into the pill when it is done. The pill and the card are one black shape whose outline changes, so the change reads as one object stretching rather than a new window opening. The name comes from the iPhone, but the same idea suits any status area at the top of an app or page.

## When to use it
- Incoming calls and video calls in a web or mobile app
- Timers, workouts and countdowns that keep running while the visitor does something else
- Music and podcast players, with the track and its controls
- Order, delivery and ride updates that change over a few minutes
- Live scores and other short updates worth a glance

## How it works
The island is a box the size of its largest card, with a little room left around it for the bounce. Everything inside is laid out once at full size; what the visitor sees is a black layer cut out with `clip-path: inset()`, and each card's content sits inside that layer, so the same clip cuts the content too and nothing shows outside the shape while it grows or shrinks. Three custom properties describe the visible shape: half its width (`--hw`), its height (`--h`) and its corner radius (`--r`). Changing them is the whole animation: the browser eases the clip from one shape to the other, so the pill grows into a card, or one card changes straight into another, without ever animating `width` or `height`.

```html
<button class="isl" type="button" aria-label="Phone notification" aria-expanded="false" data-n="call">
  <span class="shape">                                    <!-- the black layer, clipped -->
    <span class="c c-call" aria-hidden="true">…</span>  <!-- each card's content, at full size, clipped with it -->
  </span>
</button>
```

```css
.isl   { --hw: 48px; --h: 32px; --r: 16px; position: absolute; top: 11px; left: 6px; right: 6px; height: 172px; }
.shape { position: absolute; inset: 0; background: #000;
         clip-path: inset(0 calc(50% - var(--hw)) calc(100% - var(--h)) round var(--r));
         transition: clip-path 700ms var(--ease); }
/* The content fades in once the shape has room and scales evenly, so its text never stretches */
.c { opacity: 0; transform: scale(.88); transition: opacity 175ms ease, transform 700ms var(--ease); }
.open[data-n="call"] .c-call { opacity: 1; transform: none; transition-duration: 315ms, 700ms; transition-delay: 140ms; }
```

```js
// Each shape as [half its width, its height, its corner radius]; a % is of the island's box
const SIZE = { rest: ['48px', '32px', '16px'], call: ['44%', '76px', '30px'],
               timer: ['40%', '64px', '32px'], music: ['44%', '148px', '34px'] };
// The open card's size, else the resting pill's (under reduced motion the card keeps its size while it fades out)
function shape() {
  const g = SIZE[open || reduceMq.matches ? note : 'rest'];
  ['--hw', '--h', '--r'].forEach((v, i) => isl.style.setProperty(v, g[i]));
}
function setOpen(next) {
  open = next;
  isl.classList.toggle('open', open);
  isl.setAttribute('aria-expanded', String(open));
  shape();
}

// Bounce: a damped spring (damping z: .68 for Soft, .5 for Springy) sampled into a CSS linear() curve
function spring(z) {
  const w = 4.6 / z, d = w * Math.sqrt(1 - z * z), p = [];
  for (let i = 0; i < 40; i++) {
    const t = i / 40;
    p.push((1 - Math.exp(-z * w * t) * (Math.cos(d * t) + z * w / d * Math.sin(d * t))).toFixed(3));
  }
  return 'linear(' + p.join(',') + ',1)';   // set as --ease on the island
}
```

The same transition runs whichever two shapes it goes between, so picking another notification while one is open morphs the card directly. The clip also decides where the button can be pressed, so the small pill gets a larger invisible target (124 × 48px). The button is the whole box, so its own outline would not follow the shape: the focus ring is a second clipped layer 3px larger than the shape, behind it, and the outline stays, transparent, for forced-colors mode. While a card is open the status bar fades out, and a polite live region reads out the message when the visitor opened it, not when Show me did. On larger screens the content also comes into focus from a slight blur; phones skip the blur. Under reduced motion a resting pill stays in place and the card fades in over it at its own size, so nothing grows or moves; picking another notification fades the open card out, puts the new content and size in place while it is hidden, and fades it in again.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Notification | Call | What the pill grows into: a call card, a timer in a wide capsule, or a taller music card with controls; picking another while it is open changes the shape straight into the new one |
| Speed | Normal | How long it takes to grow or shrink: slow is 1100ms, normal 700ms and fast 450ms; a spring needs a little longer than a plain ease, because it settles at the end |
| Bounce | Soft | None eases out without going past the size; Soft goes about 5% past it and Springy about 16%, and then each settles |

## Production notes
- **Never animate `width` or `height`**: every frame would lay out the card and its text again, and the words would wrap and jump while it grows. A clip, or a scale on a layer whose children are scaled back, changes only what is painted.
- **A clip is repainted**: a `clip-path` animation repaints the island on every frame. That is cheap for a shape this size; for a large panel, animate `transform: scale()` on the layer and scale its content the other way (the FLIP technique), which stays on the compositor.
- **Clip the content with the shape**: put the content inside the clipped layer, not beside it. A shrinking clip outruns a fade, so content laid over the shape shows on the page around it for a moment at the start of every close.
- **Leave room for the bounce**: a spring goes past the target size, and a clip cannot show more than its box. Make the box larger than the largest card by the overshoot, or the corners turn square for a moment at the peak.
- **`linear()` support**: the spring curve needs `linear()` (Chrome and Edge 113, Firefox 112, Safari 17.2). Check with `CSS.supports()` and fall back to a `cubic-bezier()` that overshoots about as far: `cubic-bezier(.3, 1.4, .5, 1)` goes about 5% past the end and `cubic-bezier(.3, 1.75, .45, 1)` about 16%.
- **Hit area and focus**: the clip also clips pointer hits. Give the small pill a target of at least 44 × 44px, draw the focus ring as a clipped layer of its own, and keep a transparent outline for forced-colors mode.
- **Accessibility**: make the pill a real `<button>` with `aria-expanded`, announce a new message in a polite `role="status"` region, never move the focus into the card, and let Escape close it.
- **Framer Motion**: `<motion.div layout style={{ borderRadius: 30 }} />` animates a size change with transforms and keeps the corner radius right; give the children `layout` too, so they are scaled back and their text does not stretch.
- **GSAP**: the Flip plugin records the pill's box and animates to the card's; `gsap.to(shape, { clipPath: "inset(0% 6% 14% 6% round 30px)", ease: "elastic.out(1, 0.6)" })` animates the clip itself with a bounce.
- **Native apps**: on iOS the real Dynamic Island shows Live Activities through ActivityKit; on the web it is a pattern you draw yourself.

## See also
- [Toast Notification](../toast-notification/) — short messages that come into a corner and leave on their own
- [Expanding Search](../expanding-search/) — an icon that opens into a field with a clip
- [Button Loading States](../button-loading-states/) — a button clipped into a circle while it works
- [Modal Expand](../modal-expand/) — a window that grows out of the button you pressed
- [Morph Transition](../../03-page-transitions/morph-transition/) — a logo that changes shape to match each page
