# ScrollTrigger Animation

[Live demo](index.html)

## What it is

ScrollTrigger is not an animation type — it is a mechanism that fires animations at precise scroll positions. It defines scroll zones and exposes a lifecycle: `onEnter` (zone enters viewport), `onLeave` (zone exits at top), `onEnterBack` (zone re-enters from top on scroll-up), `onLeaveBack` (zone exits at bottom on scroll-up). This demo implements the concept in vanilla JS using `IntersectionObserver`, showing four core behaviors: fade on enter, scrub with scroll, pin and scrub, and snap to points. In production, GSAP's ScrollTrigger plugin handles all of this.

## When to use it

- Any element that should animate exactly once as it enters the viewport
- Product reveals, feature lists, and section transitions requiring scroll-coordinated timing
- Marketing pages that must remain accessible without JavaScript by having logical resting states
- Any scenario requiring precise callbacks at scroll boundaries, not just "is it visible?"

## How it works

Each scroll zone uses an `IntersectionObserver` for lifecycle callbacks:

```js
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!wasActive && e.isIntersecting) fire(zone, 'onEnter');
    if (wasActive && !e.isIntersecting)
      fire(zone, scrollDir > 0 ? 'onLeave' : 'onLeaveBack');
  });
}, { root: stage, threshold: 0 });
```

For the scrub zone, scroll position is normalized to `0–1` and applied directly to transforms:

```js
const p = clamp((scrollTop - zone.offsetTop) / zone.offsetHeight, 0, 1);
swatch.style.transform = `rotate(${p * 180}deg) scale(${lerp(1, 1.3, p)})`;
swatch.style.filter    = `hue-rotate(${p * 120}deg)`;
```

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Observer `rootMargin` | `0px` | Expand to pre-trigger animations before zone is fully visible |
| Observer `threshold` | `0` | 0 = fire on first pixel; 1 = fire only when fully in view |
| Scrub zone start | `zone.offsetTop` | Where the scrub progress begins |
| Snap debounce | 200ms | Delay after scroll-stop before snap fires |

## Production notes

- **GSAP ScrollTrigger** is the production standard. It handles scroll direction, pinning, scrubbing, snapping, and lifecycle callbacks with a clean declarative API. The vanilla JS approach here is educational — it replicates the underlying mechanics without GSAP's optimizations.
- **`IntersectionObserver` vs. scroll events.** IO is the right tool for lifecycle callbacks (enter/leave). Scroll events with `offsetTop` arithmetic are right for scrubbing. Use both together.
- **Scrub and `will-change`.** For elements that update on every scroll frame, declare `will-change: transform` before the first frame to avoid promotion jank.
- **Snap-to-point** requires detecting scroll silence. A debounce timer (100–200ms) after the last scroll event is the reliable pattern; there is no native "scroll ended" event in most browser contexts.
- **Accessibility.** `onEnter` animations should respect `prefers-reduced-motion`. In reduced-motion mode, jump elements directly to their final state at page load.

## See also

- [Scrub Animation](../scrub-animation/) — a full scrub-driven product disassembly using the same scroll-as-progress model.
- [Pin Animation](../pin-animation/) — demonstrates the "pin" behavior from the same ScrollTrigger concept.
