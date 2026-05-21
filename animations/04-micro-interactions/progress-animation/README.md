# Progress Animation

## What it is
A progress animation visualizes completion percentage through a filling shape — a horizontal bar, a circular ring, or a stepped sequence. It differs from a spinner in that it conveys specific information: how much is done and how much remains. This reduces user anxiety during long operations and sets accurate expectations about wait time.

## When to use it
- File uploads and downloads where byte progress is available
- Multi-step forms and onboarding flows (5-step wizard, 3 of 5 complete)
- Installation and build processes
- Reading progress indicators on long-form articles
- Any operation where `loaded / total` can be computed

## How it works
**Linear bar**: update `width` via a CSS transition, or animate it manually with `requestAnimationFrame` for easing control:

```css
.prog-fill {
  height: 100%;
  background: #58a6ff;
  width: 0%;
  transition: width 2000ms ease-out;
}
```

```js
// Or with rAF for custom easing:
function animateProgress(target, duration) {
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - t) ** 3; // ease-out cubic
    fill.style.width = (target * eased) + '%';
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
```

**Circular ring** uses `stroke-dashoffset` on an SVG circle. The circumference of a circle with `r=32` is `2π × 32 ≈ 201px`:

```css
circle {
  fill: none; stroke: #58a6ff; stroke-width: 6;
  stroke-dasharray: 201;
  stroke-dashoffset: 201; /* fully hidden */
  transition: stroke-dashoffset 2s ease-out;
}
```

```js
// p = progress 0..1
circle.style.strokeDashoffset = 201 * (1 - p);
```

**Indeterminate bar** (unknown duration): use an infinite sliding animation instead:

```css
.indet {
  animation: slide 2s ease-in-out infinite;
  width: 40%;
}
@keyframes slide {
  0%   { transform: translateX(-150%); }
  100% { transform: translateX(350%); }
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Duration | 2000ms | Match to actual estimated load time; animated progress that finishes early stalls |
| Easing | ease-out | Decelerating fill feels natural — fast start, slow near 100% |
| Circumference | 201px (r=32) | `2π × r`; scales with radius choice |
| Step count | 5 | 3–7 steps; more than 8 steps individual dots become unreadable |

## Production notes
- **Don't fake progress**: animating to 90% and stalling while waiting for a response (common pattern) is deceptive and erodes trust. Either animate to an honest checkpoint, or use indeterminate mode.
- **`transition` vs `rAF`**: CSS `transition` is simpler but can't be paused or reversed mid-flight. `rAF` gives full control — necessary for chunked uploads where progress arrives in bursts.
- **Accessibility**: wrap the progress bar in `<progress value="60" max="100">` or add `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` attributes.
- **GSAP**: `gsap.to(fill, { width: "75%", duration: 2, ease: "power2.out" })`. For circular rings, animate `strokeDashoffset` directly.
- **React**: the HTML `<progress>` element is accessible out of the box. Radix UI's `<Progress>` provides a headless, styled alternative.

## See also
- [Loading Spinner](../loading-spinner/) — for unknown-duration loads
- [Skeleton Loader](../skeleton-loader/) — content-shaped placeholder while loading
- [Checkmark Draw](../checkmark-draw/) — success state after progress reaches 100%
- [Progress Bar](../../01-scroll-based/progress-bar/) — scroll-driven reading progress variant
