# Counter Animation

[Live demo](index.html)

## What it is

Numeric counters that animate from zero to a target value when a stats section enters the viewport. Each counter runs a requestAnimationFrame loop driven by elapsed time, applying an easing function and formatting the value every frame. Four counters run simultaneously with optional per-counter stagger delays.

## When to use it

- Stats and metrics sections where raw numbers need visual emphasis on first impression
- Annual reports, dashboards, and SaaS landing pages showing key figures
- Any context where "the number settling into place" communicates arrival rather than a static display
- Loading sequences where counters fill in as data resolves

## How it works

An IntersectionObserver watches the stats container and fires when it crosses a configurable threshold inside the internal scroll viewport:

```js
const margin = -(100 - threshold); // e.g. threshold 60 → margin -40
observer = new IntersectionObserver(([e]) => {
  if (e.isIntersecting && !running) animateCounters();
}, { root: stage, rootMargin: `0px 0px ${margin}% 0px`, threshold: 0 });
observer.observe(document.getElementById('stats'));
```

`root: stage` is essential — the stage scrolls internally. Without it, the observer defaults to the document viewport and never fires because the stats element is always "visible" at the page level.

The rAF loop interpolates from 0 to target using elapsed time and an easing function:

```js
function frame(now) {
  const t = Math.min((now - start - delay) / duration, 1);
  const v = target * easeFn(t);
  el.textContent = format(v);          // formatted every frame
  if (t < 1) requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
```

Formatting happens on every frame — not just at the end. This ensures commas, currency symbols, and units appear throughout the animation, not suddenly at the final value.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Trigger threshold | 60% | How far the section must enter the viewport before firing |
| Duration | 1800ms | Total count-up time per counter |
| Easing | easeOutCubic | Controls the deceleration curve |
| Stagger | 200ms | Delay added per counter index when stagger is enabled |

Easing functions available:

```js
const EASE = {
  linear:   t => t,
  outCubic: t => 1 - (1 - t) ** 3,
  outExpo:  t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  outBack:  t => { const c = 1.70158; return 1 + (c+1)*Math.pow(t-1,3) + c*Math.pow(t-1,2) }
};
```

## Production notes

- **`root` must point to the internal scroll container, not the document.** If the stats section lives inside a custom scroll container, `root: null` (the default) observes against the page viewport — the section appears "in view" immediately and the observer never fires on actual scroll. Always pass `root: stage` (or whichever element has `overflow-y: scroll`).
- **`rootMargin` percentages are relative to the root's bounding box.** With `root: stage`, `-40%` means 40% of the stage height, not the window. This keeps the threshold position consistent regardless of the window size.
- **Format every frame, not just at the end.** Formatting only on completion causes a jarring jump from raw decimal to formatted string. A counter running 0 → 12,847 should show commas from the first frame it crosses 1,000.
- **`easeOutBack` overshoots.** The value briefly exceeds the target before settling. For counters this means the display may show a number higher than the target for a frame or two. Use `outCubic` or `outExpo` when the target value must never be exceeded visually.
- **GSAP equivalent:** `gsap.to(obj, { val: target, duration: 1.8, ease: "power3.out", onUpdate: () => el.textContent = format(obj.val) })`. CountUp.js is a dedicated library for this pattern with locale-aware formatting built in.

## See also

- [Reveal on Scroll](../reveal-on-scroll/) — IntersectionObserver used for entrance animations rather than counter triggers.
- [Stagger Reveal](../stagger-reveal/) — coordinating multiple elements with cascading delays on the same IO trigger.
