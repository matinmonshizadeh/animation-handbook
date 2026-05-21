# SVG Path Animation

## What it is
SVG path animation uses `stroke-dasharray` and `stroke-dashoffset` to reveal an SVG stroke progressively from one end to the other, giving the impression of a path being drawn in real time. The path is always fully rendered in the DOM — only its visibility changes. This makes the technique accessible (the final shape is always present for screen readers) and easily reversible (animate offset back to hide).

## When to use it
- Illustrated icon or logo reveals that "draw in" on page load
- Signature-style handwriting effects for brand copy
- Step-completion indicators that fill in as the user progresses
- Decorative borders and frames that draw themselves around content

## How it works
Every SVG path has a total stroke length accessible via `path.getTotalLength()`. Setting `stroke-dasharray` to that length creates a dash exactly as long as the entire path. Setting `stroke-dashoffset` to the same length hides it (the gap starts at position 0, covering the whole stroke). Animating offset from full length to 0 reveals the stroke:

```js
const path = document.querySelector('.draw-path');
const length = path.getTotalLength();

// Set up hidden state
path.style.strokeDasharray  = length;
path.style.strokeDashoffset = length;    // fully hidden
path.style.transition = 'none';

// Force browser to register the hidden state, then animate
requestAnimationFrame(() => requestAnimationFrame(() => {
  path.style.transition = `stroke-dashoffset 1500ms ease-out`;
  path.style.strokeDashoffset = 0;       // fully revealed
}));
```

For multiple paths in sequence, stagger the transitions with a delay per path:

```js
paths.forEach((path, i) => {
  const len = path.getTotalLength();
  path.style.strokeDasharray  = len;
  path.style.strokeDashoffset = len;
  path.style.transitionDelay  = `${i * 300}ms`;

  requestAnimationFrame(() => requestAnimationFrame(() => {
    path.style.transition = `stroke-dashoffset 700ms ease-out ${i * 300}ms`;
    path.style.strokeDashoffset = 0;
  }));
});
```

**Fill at end** — trigger a fill reveal after the stroke draw completes:

```js
path.addEventListener('transitionend', () => {
  path.style.transition = 'fill 400ms ease';
  path.style.fill = 'rgba(88, 166, 255, 0.15)';
});
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Duration | 1500ms | Faster = snappy; slower = deliberate hand-drawing feel |
| Easing | ease-out | Matches natural drawing speed (fast start, slow finish); linear = mechanical |
| Stroke width | 2px | Thinner = precise/technical; thicker = bold/illustrative |
| Stagger delay | 300ms | Gap between sequential path starts |

## Production notes
- **`getTotalLength()` is required**: hardcoding `stroke-dasharray` breaks when the path changes. Always measure at runtime. For SVGs loaded asynchronously, measure after the element is added to the DOM.
- **Path direction**: the stroke draws from the path's start point (first `M` command). To control which end draws first, reverse the path data or animate in reverse (offset from 0 to length).
- **`stroke-dasharray` shorthand**: `stroke-dasharray: length length` (repeated) and `stroke-dasharray: length` are equivalent — a single value sets both dash and gap to the same length.
- **GSAP DrawSVG plugin**: handles `getTotalLength()`, offset calculation, and animation sequencing automatically. Essential for complex multi-path illustrations. `gsap.from(path, { drawSVG: 0 })`.
- **Framer Motion**: `<motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />` — `pathLength` is a 0–1 shorthand that internally manages `dasharray`/`dashoffset`.

## See also
- [Checkmark Draw](../../04-micro-interactions/checkmark-draw/) — the same technique applied to UI success states
- [Text Clip-Path Reveal](../../05-text-typography/text-clip-path-reveal/) — a conceptually similar progressive reveal for text
- [Outline to Fill](../../05-text-typography/outline-to-fill/) — SVG stroke → fill transition for text
