# Progress Animation

## What it is
A progress animation shows how much of a task is done by filling a shape: a bar, a ring or a row of steps. Unlike a spinner, it tells people how much is left, which makes a long wait easier. In the demo, all three are driven by the same percentage.

## When to use it
- File uploads and downloads where byte progress is available
- Multi-step forms and onboarding flows (5-step wizard, 3 of 5 complete)
- Installation and build processes
- Reading progress indicators on long-form articles
- Any operation where `loaded / total` can be computed

## How it works
**Linear bar**: keep the fill as wide as the track and slide it in from the left with `transform: translateX()`; the track's `overflow: hidden` hides the part still outside, and a transform never makes the page lay out again. Move it with a CSS transition, or with `requestAnimationFrame` for easing control:

```css
.prog-track { overflow: hidden; border-radius: 4px; }

.prog-fill {
  height: 100%;
  width: 100%;
  background: #58a6ff;
  transform: translateX(-100%);   /* empty: the whole fill sits left of the track */
  transition: transform 2000ms ease-out;
}
```

```js
// Or with rAF for custom easing:
function animateProgress(target, duration) {
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - t) ** 3; // ease-out cubic
    fill.style.transform = 'translateX(' + (target * eased - 100) + '%)';
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
| Fills to | 100% | How far one play fills: 50%, 75% or 100% |
| Speed | Normal | How long the fill takes: slow is 3.2s, normal 2s and fast 1.2s; in a real app it follows the actual progress |
| Feel | Smooth | Smooth starts fast and slows near the end, which feels natural; Gentle eases in and out; Even fills at one steady pace |
| Sliding bar | off | For waits of unknown length: a short piece slides along the bar instead of filling it |
| Fill color | Blue | The color of the bar, the ring and the steps |

## Production notes
- **Don't fake progress**: animating to 90% and stalling while waiting for a response (common pattern) is deceptive and erodes trust. Either animate to an honest checkpoint, or use indeterminate mode.
- **`transition` vs `rAF`**: CSS `transition` is simpler but can't be paused or reversed mid-flight. `rAF` gives full control — necessary for chunked uploads where progress arrives in bursts.
- **Accessibility**: wrap the progress bar in `<progress value="60" max="100">` or add `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` attributes.
- **GSAP**: `gsap.to(fill, { xPercent: -25, duration: 2, ease: "power2.out" })` slides a full-width fill to 75%. For circular rings, animate `strokeDashoffset` directly.
- **React**: the HTML `<progress>` element is accessible out of the box. Radix UI's `<Progress>` provides a headless, styled alternative.

## See also
- [Loading Spinner](../loading-spinner/) — a spinner for waits of unknown length
- [Skeleton Loader](../skeleton-loader/) — gray shapes stand in for the content
- [Checkmark Draw](../checkmark-draw/) — the success sign once it reaches the end
- [Progress Bar](../../01-scroll-based/progress-bar/) — a bar that fills as you scroll
