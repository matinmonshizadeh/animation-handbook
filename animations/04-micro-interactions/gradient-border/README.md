# Animated Gradient Border

## What it is
An animated gradient border is a colored edge around a card or button, with a band of colors that keeps running around it. Behind the element sits a large layer painted with colors that sweep around its center; an inner box covers everything but the edge, and the layer turns, so the colors seem to travel along the border.

## When to use it
- The featured plan on a pricing page, or the one card people should notice first
- A main call-to-action button, such as Upgrade or Get started
- Launches, new features and limited offers
- Marking the selected card in a small set, sparingly

## How it works
Each bordered element holds a ring, a glow and an inner box. The ring is a box the size of the element that clips what is inside it to the element's rounded shape; in it sits a centered square, twice as wide as the element, painted with a `conic-gradient`. The inner box is inset by the border width and painted with the card's own background, so only the edge of the square shows. The square turns with a CSS animation on `transform`:

```css
.gb      { position: relative; isolation: isolate; border-radius: 18px; }
.gb-ring { position: absolute; inset: 0; border-radius: inherit; overflow: hidden;
           background: rgba(255,255,255,.12); }          /* the faint line where the band is not */
.gb i    { position: absolute; left: 50%; top: 50%; width: 200%; aspect-ratio: 1;
           background: conic-gradient(var(--band));
           transform: translate(-50%, -50%);
           animation: gb-turn var(--dur) linear infinite; }
.gb-in   { position: relative; margin: var(--bw); border-radius: calc(18px - var(--bw));
           background: #121216; }                         /* covers all but the edge */
@keyframes gb-turn { to { transform: translate(-50%, -50%) rotate(1turn); } }

/* A long band fades in behind its bright front; All around loops back to the first color */
.stage         { --band: transparent 0 40%, var(--c1) 58%, var(--c2) 72%, var(--c3) 85%, var(--c4) 96%, transparent; }
.stage.b-full  { --band: var(--c1), var(--c2), var(--c3), var(--c4), var(--c1); }
```

The square is twice as wide as the element so that it still covers the element's corners at every angle (true while the element is less than about 1.7 times taller than it is wide). The glow is a second copy of the ring placed behind the element (`z-index: -1` inside the element's own stacking context) with `filter: blur(16px)`. Switching the glow off sets `visibility: hidden` rather than `display: none`, so its turn keeps step with the ring's. The button's turn starts at another point of the circle (`animation-delay: calc(var(--dur) * -.4)`), so the two bands do not move in lockstep.

A new speed rescales the time each turn has already played before the new duration is set, so the bands keep their place instead of jumping:

```js
stage.getAnimations({ subtree: true }).forEach(a => { a.currentTime = a.currentTime * next / secs; });
document.documentElement.style.setProperty('--dur', next + 's');
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Colors | Rainbow | The four colors of the band: Rainbow, Sunset (yellow to purple) or Ocean (teal to indigo) |
| Speed | Normal | How long one trip around the edge takes: slow is 7s, normal 4s and fast 2s; much faster and it looks busy |
| Soft glow | On | A blurred copy of the band behind the element, so its colors spill softly onto the page |
| Band length | Long | How much of the edge the colors cover at once: a short band, a long one, or colors all around |
| Border width | Medium | How thick the colored edge is: thin is 1px, medium 2px and thick 4px |

## Production notes
- **Turn a layer, never the gradient**: animating the gradient's own angle (an `@property --angle` used in `conic-gradient(from var(--angle), …)`) repaints the element on every frame. Turning a finished layer with `transform` leaves the work to the compositor.
- **Size the layer for the shape**: a square twice the element's width covers it at every angle only while the element is less than about 1.7 times taller than wide; for taller elements, size the square from the element's diagonal.
- **One or two per view**: a moving border pulls the eye. Keep it for the single featured card or main button, not every card in a grid.
- **Blur on phones**: the glow's blur is the costly part, so the demo blurs less on small screens, where it looks just as soft.
- **Reduced motion**: under `prefers-reduced-motion: reduce` the demo starts paused, so the border shows its colors standing still. In production, leave the animation out and keep the still gradient.
- **Libraries**: GSAP turns the layer with `gsap.to(layer, { rotation: 360, repeat: -1, ease: 'none', duration: 4 })`; Framer Motion does the same with `animate={{ rotate: 360 }}` and `transition={{ repeat: Infinity, ease: 'linear', duration: 4 }}`. Tailwind snippets often animate an `@property` angle instead, which works but repaints every frame.

## See also
- [Shimmer Effect](../shimmer-effect/) — a band of light that sweeps across instead of around
- [Notification Badge Pulse](../badge-pulse/) — another small loop that draws the eye
- [Text Gradient Animation](../../05-text-typography/text-gradient-animation/) — colors that flow through letters
- [Animated Gradient Background](../../07-ambient-background/animated-gradient-background/) — a whole background that slowly shifts color
- [Spotlight Hover Glow](../spotlight-hover/) — card edges that light up near the pointer
