# Checkmark Draw

## What it is
The checkmark draw animates an SVG path progressively from one end to the other, giving the impression of something being hand-drawn. It uses the `stroke-dashoffset` technique: the path is pre-drawn but hidden behind a full-length dash gap, then the gap shrinks to zero over time, revealing the stroke. Most commonly used as a success confirmation after form submission or payment.

## When to use it
- Form submission success state (the button transforms into a checkmark)
- Payment confirmation screens
- Step completion indicators in multi-step flows
- Any binary success/failure state where a visual reward is appropriate

## How it works
Every SVG path has a `getTotalLength()` value — the pixel length of its stroke. Setting `stroke-dasharray` to that length and `stroke-dashoffset` to that same length makes the stroke invisible (the gap covers it entirely). Animating `stroke-dashoffset` to 0 draws the path in:

```html
<svg viewBox="0 0 80 80">
  <circle class="check-circle" cx="40" cy="40" r="30"/>
  <polyline class="check-mark" points="24,41 35,52 56,30"/>
</svg>
```

```css
.check-circle {
  fill: none; stroke: #56d364; stroke-width: 4;
  stroke-dasharray: 188; /* 2π × 30 */
  stroke-dashoffset: 188;
  transition: stroke-dashoffset 500ms ease-out;
}
.check-mark {
  fill: none; stroke: #56d364; stroke-width: 4; stroke-linecap: round; stroke-linejoin: round;
  stroke-dasharray: 52;
  stroke-dashoffset: 52;
  transition: stroke-dashoffset 500ms ease-out 200ms; /* delay after circle */
}

.drawn .check-circle { stroke-dashoffset: 0; }
.drawn .check-mark   { stroke-dashoffset: 0; }
```

The circle draws first (0ms delay), the checkmark follows with a `200ms` delay — creating the sequenced "circle then tick" effect.

For paths that aren't simple geometry, measure length in JavaScript:

```js
const path = document.querySelector('.my-path');
const length = path.getTotalLength();
path.style.strokeDasharray = length;
path.style.strokeDashoffset = length;
// Trigger draw:
path.style.strokeDashoffset = 0;
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Duration | 500ms | 200–800ms is the legible range; faster feels technical, slower feels dramatic |
| Easing | ease-out | Decelerating draw mimics natural handwriting — fast start, slow finish |
| Stroke width | 4px | Thicker reads as confident; thinner reads as precise |
| Delay between paths | 200ms | Sequence circle → mark; simultaneous is also valid but less theatrical |

## Production notes
- **Path length must match `stroke-dasharray`**: if the length is wrong, the path draws partially or overshoots. For computed paths, always use `getTotalLength()` rather than hardcoding.
- **`stroke-dasharray` on `<polyline>`**: polylines report `getTotalLength()` correctly in all major browsers. Use it for checkmarks; `<path d="M 24,41 L 35,52 L 56,30">` is equivalent.
- **Error state pairing**: the same technique draws an X for failure. Two crossing `<line>` elements with staggered delays produce a cross-draw effect (see toggle in the demo).
- **Shake on error**: after drawing the X, `animation: shake 400ms ease` on the container reinforces the rejection.
- **GSAP**: `gsap.to(path, { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" })`. The DrawSVG plugin is more convenient for complex paths.
- **Framer Motion**: `<motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />` — `pathLength` is a 0–1 shorthand for the dashoffset technique.

## See also
- [Progress Animation](../progress-animation/) — the predecessor state before success
- [Loading Spinner](../loading-spinner/) — the loading state that transitions to a checkmark
- [Button Press Scale](../button-press-scale/) — press feedback before the async operation starts
