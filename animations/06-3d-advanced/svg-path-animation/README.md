# SVG Path Animation

[Live demo](https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/svg-path-animation/)

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

For multiple paths in sequence, the demo starts each line `gap` after the one before: 30% of the drawing time `ms`, so a line begins while the one before it is still drawing. `ms` is the Speed setting (1500ms at Normal, three times longer in Slow motion), `ease` the Feel setting and `rev` the Starts from the other end switch; `later` is `setTimeout` that also keeps the timer's id, so Replay can cancel what is still waiting:

```js
const paths = buildPaths(), ms = speed(), gap = ms * 0.3, rev = revTog.checked;
paths.forEach(path => {
  const len = path.getTotalLength();
  path.style.strokeDasharray  = len;
  path.style.strokeDashoffset = rev ? -len : len;   // hidden either way
  path.style.transition = 'none';
});
paths.forEach((path, i) => later(() => {
  path.getBoundingClientRect();       // apply the hidden state first
  path.style.transition = `stroke-dashoffset ${ms}ms ${ease}`;
  path.style.strokeDashoffset = 0;
}, 20 + i * gap));
```

**Fill at end** — once the last line is drawn (`20 + (paths.length - 1) * gap + ms + 50` milliseconds in), a class fades the fill in. The path has to start with `fill: transparent`, not `fill: none`: a fill can only fade from a color, and from `none` it would snap on.

```css
.draw-path { fill: transparent; fill-opacity: .15; stroke: var(--stroke-color); }
.draw-path.fill-done { fill: var(--stroke-color); transition: fill var(--fill-dur) ease; }
```

```js
// clearing the inline transition lets the class's fill transition apply
if (fillTog.checked) paths.forEach(path => { path.style.transition = ''; path.classList.add('fill-done'); });
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Drawing | Icon | What is drawn: a house with a star, a flowing signature, or a circle logo |
| Speed | Normal | How long each line takes to draw: slow is 2400ms, normal 1500ms and fast 900ms; each next line starts after 30% of that |
| Line thickness | Medium | Thin is 1px, medium 2px and thick 4px with the drawing at its full 400px width, thinner when it shrinks to fit a smaller box; thin looks precise, thick looks bold |
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
- [Handwriting Draw](../../05-text-typography/handwriting-draw/) — the same technique writes out a word, stroke by stroke
