# SVG Path Animation

## What it is
An SVG path animation makes a line drawing appear as if drawn by hand. Each line is hidden behind a dash exactly as long as the line, and sliding that dash away uncovers the line from one end to the other. The whole drawing is in the page from the start, with a label, so screen readers can always find it.

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

// Make the browser apply the hidden state, then animate
path.getBoundingClientRect();
path.style.transition = 'stroke-dashoffset 1500ms ease-out';
path.style.strokeDashoffset = 0;         // fully revealed
```

For multiple paths in sequence, stagger the transitions with a delay per path:

```js
paths.forEach((path, i) => {
  const len = path.getTotalLength();
  path.style.strokeDasharray  = len;
  path.style.strokeDashoffset = len;
  path.style.transition = 'none';

  setTimeout(() => {
    path.getBoundingClientRect();       // apply the hidden state first
    path.style.transition = 'stroke-dashoffset 700ms ease-out';
    path.style.strokeDashoffset = 0;
  }, i * 300);
});
```

**Fill at end** — trigger a fill reveal after the stroke draw completes. The path has to start with `fill: transparent`, not `fill: none`: a fill can only fade from a color, and from `none` it would snap on.

```js
path.style.fill = 'transparent';        // not 'none'
path.addEventListener('transitionend', () => {
  path.style.transition = 'fill 400ms ease';
  path.style.fill = 'rgba(88, 166, 255, 0.15)';
});
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Drawing | Icon | What is drawn: a house with a star, a flowing signature, or a circle logo |
| Speed | Normal | How long each line takes to draw: slow is 2400ms, normal 1500ms and fast 900ms; each next line starts after 30% of that |
| Line thickness | Medium | Thin is 1px, medium 2px and thick 4px; thin looks precise, thick looks bold |
| Feel | Smooth | Smooth slows at the end, like a hand finishing a stroke; Gentle eases in and out; Even keeps one pace |
| Line color | Blue | The color of the lines, and of the fill |
| Starts from the other end | off | Draws each line from its end back to its start |
| Fills in at the end | off | Fills the shapes with a light tint of the line color once the lines are drawn |

## Production notes
- **`getTotalLength()` is required**: hardcoding `stroke-dasharray` breaks when the path changes. Always measure at runtime. For SVGs loaded asynchronously, measure after the element is added to the DOM.
- **Path direction**: the stroke draws from the path's start point (first `M` command). To control which end draws first, reverse the path data, or start from a *negative* offset (`-length` → `0`), which hides the stroke the same way but uncovers it from the far end. Animating `0` → `length` is a different effect: it erases an already-drawn path.
- **`stroke-dasharray` shorthand**: `stroke-dasharray: length length` (repeated) and `stroke-dasharray: length` are equivalent — a single value sets both dash and gap to the same length.
- **GSAP DrawSVG plugin**: handles `getTotalLength()`, offset calculation, and animation sequencing automatically. Essential for complex multi-path illustrations. `gsap.from(path, { drawSVG: 0 })`.
- **Framer Motion**: `<motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />` — `pathLength` is a 0–1 shorthand that internally manages `dasharray`/`dashoffset`.

## See also
- [Checkmark Draw](../../04-micro-interactions/checkmark-draw/) — the same technique for a success tick
- [Text Clip-Path Reveal](../../05-text-typography/text-clip-path-reveal/) — lines of text uncovered one by one
- [Outline to Fill](../../05-text-typography/outline-to-fill/) — hollow letters fill with color
