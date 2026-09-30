# Checkmark Draw

## What it is
A check mark that draws itself, as if by hand, to confirm that something worked. The circle and the tick are there from the start but hidden, and they are revealed along their length, so the line seems to be drawn. The same trick can draw a red X when something fails.

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
  stroke-dasharray: 189; /* 2π × 30, rounded up */
  stroke-dashoffset: 189;
  transition: stroke-dashoffset 500ms ease-out;
}
.check-mark {
  fill: none; stroke: #56d364; stroke-width: 4; stroke-linecap: round; stroke-linejoin: round;
  stroke-dasharray: 52;
  stroke-dashoffset: 52;
  transition: stroke-dashoffset 500ms ease-out;
}

.drawn .check-circle { stroke-dashoffset: 0; }
.drawn .check-mark   { stroke-dashoffset: 0; transition-delay: 200ms; } /* delay after circle */
```

The circle draws first (0ms delay), the checkmark follows with a `200ms` delay — creating the sequenced "circle then tick" effect. The delay sits on the `.drawn` rule, so it applies only while drawing in; when the class is removed, both lines draw back out together. The demo sets the delay to 0.4 times the draw time, so it follows the Speed setting.

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
| Result | Success | Success draws a circle and a tick and turns the button green; Error draws a red X, shakes it and turns the button red |
| Speed | Normal | How long each line takes to draw: slow is 800ms, normal 500ms and fast 300ms; 200 to 800ms is easy to follow |
| Line thickness | Medium | Thin is 2, medium 4 and thick 7 units wide; thick reads as confident, thin as precise |
| Feel | Smooth | Smooth slows at the end like a pen lifting off; Gentle eases in and out; Even draws at one steady pace |
| Tick color | Green | The color of the circle and the tick; the X stays red |

## Production notes
- **Path length must match `stroke-dasharray`**: if the length is wrong, the path draws partially or overshoots. For computed paths, always use `getTotalLength()` rather than hardcoding.
- **`stroke-dasharray` on `<polyline>`**: polylines report `getTotalLength()` correctly in all major browsers. Use it for checkmarks; `<path d="M 24,41 L 35,52 L 56,30">` is equivalent.
- **Error state pairing**: the same technique draws an X for failure. Two crossing `<line>` elements with staggered delays produce a cross-draw effect (the demo's Result setting shows it).
- **Shake on error**: after drawing the X, `animation: shake 400ms ease` on the container reinforces the rejection.
- **GSAP**: `gsap.to(path, { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" })`. The DrawSVG plugin is more convenient for complex paths.
- **Framer Motion**: `<motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />` — `pathLength` is a 0–1 shorthand for the dashoffset technique.

## See also
- [Progress Animation](../progress-animation/) — shows how much is done before the success
- [Loading Spinner](../loading-spinner/) — the waiting sign before the tick
- [Button Press Scale](../button-press-scale/) — the button shrinks while it is pressed
