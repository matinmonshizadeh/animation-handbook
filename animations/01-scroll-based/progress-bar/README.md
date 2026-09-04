# Progress Bar

[Live demo](index.html)

## What it is

A reading progress indicator that fills as the user scrolls through an article. The demo implements three visual styles — a horizontal top bar, a circular ring, and a vertical side rail — all driven by the same formula. Switching styles is a display toggle; the underlying progress value and scroll listener are shared.

## When to use it

- Long-form articles, documentation pages, and tutorials where readers benefit from knowing how far through they are
- Single-page presentations or reports with a defined start and end
- Any scrollable content area where a completion signal improves the reading experience
- Onboarding flows where progress communicates "almost done"

## How it works

The formula is constant regardless of which indicator style is active:

```js
stage.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(update); ticking = true; }
}, { passive: true });

function update() {
  const p = stage.scrollTop / (stage.scrollHeight - stage.clientHeight);
  topBar.style.transform = `scaleX(${p})`;          // top bar
  sideFill.style.height  = Math.round(p * 100) + '%'; // side rail
  circFg.style.strokeDashoffset = CIRC - (p * CIRC);  // circle (CIRC = 2πr)
  ticking = false;
}
```

**Indicator positioning.** All three indicators are `position: absolute` children of `.stage-wrap` (the `position: relative` wrapper around the scroll container), not children of the scroll container itself:

```html
<div class="stage-wrap">          <!-- position: relative; overflow: hidden -->
  <div id="top-bar"></div>        <!-- absolute, top:0, left:0, right:0 -->
  <div id="side-rail">...</div>   <!-- absolute, top:0, right:0, bottom:0 -->
  <svg id="circ">...</svg>        <!-- absolute, top:8px, right:8px -->
  <div class="stage" id="stage"> <!-- overflow-y: scroll -->
    <div class="article">...</div>
  </div>
</div>
```

`overflow: hidden; border-radius: 8px` on `.stage-wrap` clips all three indicators to the stage boundary.

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
| Indicator style | top bar | Which visual indicator is active |
| Bar color | `#6ea8ff` | Applied via `--bar-color` CSS custom property |
| Bar thickness | 3px | Applied via `--bar-thick` CSS custom property; also updates SVG `stroke-width` |

## Production notes

- **Read scroll position from the internal viewport, not `window.scrollY`.** If the article is inside a custom scroll container (as in this demo), `window.scrollY` is always 0 — the page itself never scrolls. The formula must use `stage.scrollTop` and `stage.scrollHeight / stage.clientHeight` from the actual scroll element.
- **Indicators must not be inside the scroll container.** `position: absolute` elements inside an `overflow-y: scroll` container scroll with the content — they disappear as the user reads. Place indicators in a `position: relative` wrapper that is a sibling (or parent) of the scroll container, not a child.
- **Use `transform: scaleX()` for the top bar, not `width`.** Animating `width` causes layout recalculation on every frame. `scaleX` is compositor-promoted and runs off the main thread. Set `transform-origin: left` so it grows from the leading edge.
- **The rAF dirty flag is mandatory.** Scroll events fire faster than display refresh (60–120 Hz on mobile). Without the `ticking` flag, DOM writes pile up multiple times per frame and cause visual tearing on lower-end devices.
- **JavaScript string literals containing apostrophes must use double-quote delimiters or escaped apostrophes.** A single-quoted string like `'it's working'` causes a SyntaxError — the parser sees `'it'` as the complete string, then `s working'` as an error. Use `"it's working"` or `'it\'s working'` instead.
- **Framer Motion equivalent:** `const { scrollYProgress } = useScroll({ container: ref }); scaleX: scrollYProgress` applied to a motion div. GSAP: `gsap.to(bar, { scaleX: () => scrollProgress, ease: "none", scrollTrigger: { scrub: true } })`.

## See also

- [Scrub Animation](../scrub-animation/) — the same scroll-progress formula applied to element transforms rather than a progress indicator.
- [Sticky Section](../sticky-section/) — uses internal scroll progress to drive state transitions rather than a fill indicator.
