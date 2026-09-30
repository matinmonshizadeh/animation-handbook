# Progress Bar

[Live demo](index.html)

## What it is

A reading progress indicator shows how far through an article the reader is. It fills as they scroll and is full exactly when the last line comes into view. The demo shows three styles of the same idea: a bar along the top, a ring in the corner and a thin rail down the side.

## When to use it

- Long-form articles, documentation pages, and tutorials where readers benefit from knowing how far through they are
- Single-page presentations or reports with a defined start and end
- Any scrollable content area where a completion signal improves the reading experience
- Onboarding flows where progress communicates "almost done"

## How it works

The formula is constant regardless of which indicator style is active:

```js
scroller.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(update); ticking = true; }
}, { passive: true });

function update() {
  const p = scroller.scrollTop / (scroller.scrollHeight - scroller.clientHeight);
  topBar.style.transform   = `scaleX(${p})`;          // top bar
  sideFill.style.transform = `scaleY(${p})`;          // side rail
  circFg.style.strokeDashoffset = CIRC - (p * CIRC);  // circle (CIRC = 2πr)
  ticking = false;
}
```

Within a pixel of the end the value is set to exactly 1, so a fractional scroll position never leaves the indicator a hair short of full.

**Indicator positioning.** All three indicators are `position: absolute` children of `.stage` (the `position: relative` box around the scroll container), not children of the scroll container itself:

```html
<div class="stage">                      <!-- position: relative; overflow: hidden -->
  <div id="top-bar"></div>               <!-- absolute, top:0, left:0, right:0 -->
  <div id="side-rail">...</div>          <!-- absolute, top:0, right:0, bottom:0 -->
  <svg id="circ">...</svg>               <!-- absolute, top:8px, right:8px -->
  <div class="scroller" id="scroller">   <!-- overflow-y: auto -->
    <div class="article">...</div>
  </div>
</div>
```

`overflow: hidden` on the rounded `.stage` clips all three indicators to its corners. The indicators also use `pointer-events: none`, so a wheel turn or a touch over them still reaches the article underneath.

**Circular indicator** uses SVG `stroke-dashoffset`:

```js
const CIRC = 2 * Math.PI * 16; // circumference = 100.53 for r=16
circFg.style.strokeDashoffset = CIRC - (p * CIRC);
// at p=0: offset = CIRC → ring fully hidden
// at p=1: offset = 0   → ring fully shown
```

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Indicator | Top bar | The top bar is the most noticeable; the ring in the corner takes the least room and shows the percentage; the side rail is the quietest |
| Thickness | Medium | Thin is 2px, medium 3px and thick 6px; thin is almost invisible until you look for it, thick is hard to miss |
| Color | Blue | The color of the fill |

## Production notes

- **Read scroll position from the internal viewport, not `window.scrollY`.** If the article is inside a custom scroll container (as in this demo), `window.scrollY` is always 0 — the page itself never scrolls. The formula must use `scroller.scrollTop` and `scroller.scrollHeight / scroller.clientHeight` from the actual scroll element.
- **Indicators must not be inside the scroll container.** `position: absolute` elements inside an `overflow-y: scroll` container scroll with the content — they disappear as the user reads. Place indicators in a `position: relative` wrapper that is a sibling (or parent) of the scroll container, not a child.
- **Use `transform: scaleX()` for the top bar, not `width`.** Animating `width` causes layout recalculation on every frame. `scaleX` is compositor-promoted and runs off the main thread. Set `transform-origin: left` so it grows from the leading edge.
- **The rAF dirty flag is mandatory.** Scroll events fire faster than display refresh (60–120 Hz on mobile). Without the `ticking` flag, DOM writes pile up multiple times per frame and cause visual tearing on lower-end devices.
- **Framer Motion equivalent:** `const { scrollYProgress } = useScroll({ container: ref }); scaleX: scrollYProgress` applied to a motion div. GSAP: `gsap.to(bar, { scaleX: () => scrollProgress, ease: "none", scrollTrigger: { scrub: true } })`.

## See also

- [Scrub Animation](../scrub-animation/) — the same scroll progress moves a plane instead of filling a bar
- [Sticky Section](../sticky-section/) — scroll progress steps a section through its states
- [Scrollspy Navigation](../scrollspy-nav/) — a menu shows which section you are reading
