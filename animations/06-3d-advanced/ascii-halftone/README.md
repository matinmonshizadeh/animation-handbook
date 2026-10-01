# ASCII / Halftone

## What it is
An ASCII or halftone effect redraws a picture out of small marks on a grid. The picture is shrunk to one pixel per cell, and each cell's brightness picks a character (brighter cells get characters with more ink) or sets the size of a dot, as in a newspaper photo. Because the picture is read again every frame, it works on anything that moves: a canvas scene, a video or a webcam.

## When to use it
- Retro, terminal and hacker-style looks for tech brands and developer tools
- Music, game and event pages that want a printed or screen-like texture
- Hero images and portfolio headers that should feel made rather than photographed
- Loading or idle screens, where a moving picture turns into a pattern

## How it works
Every frame, the moving picture is drawn on a tiny hidden canvas, one pixel per cell, and read back. That canvas is made with `willReadFrequently`, so the browser keeps it in memory and reading it is cheap:

```js
const src = document.createElement('canvas');
const sctx = src.getContext('2d', { willReadFrequently: true });
src.width = cols; src.height = rows;                    // one pixel per cell
sctx.setTransform(dpr / cw, 0, 0, dpr / ch, 0, 0);       // draw the scene in stage pixels, shrunk to the grid
scene(sctx, gridWidth, gridHeight);
const px = sctx.getImageData(0, 0, cols, rows).data;

function level(px, i) {                                  // 0 to 1: how bright the cell is (how dark, on paper)
  const v = (0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]) / 255;
  return paper ? 1 - v : v;
}
```

**One pattern per mark.** Drawing a character in every cell with `fillText` or `drawImage` costs one call per cell, over 9,000 a frame at fine detail. Instead, each mark is drawn once on a tile the size of one cell and turned into a repeating pattern. A run of neighboring cells that share a mark becomes one rectangle, and each mark's rectangles are filled in one go, so a frame is about ten fills:

```js
const RAMP = ' .-:*+=xo#';                               // from no ink to the most ink
pats = [...RAMP].map(c => {
  const tile = document.createElement('canvas'), g = tile.getContext('2d');
  tile.width = cw; tile.height = ch;                     // one cell, in device pixels
  g.font = `600 ${ch}px "Schibsted Grotesk"`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = '#fff'; g.fillText(c, cw / 2, ch * 0.55);
  return ctx.createPattern(tile, 'repeat');              // repeats every cell, so it lines up with the grid
});

const top = pats.length - 1, runs = pats.map(() => new Path2D());
for (let j = 0; j < rows; j++) {
  let from = 0, run = 0;
  for (let k = 0; k <= cols; k++) {
    const n = k < cols ? Math.round(level(px, (j * cols + k) * 4) * top) : 0;
    if (n === run) continue;
    if (run) runs[run].rect(from * cw, j * ch, (k - from) * cw, ch);
    from = k; run = n;
  }
}
for (let n = 1; n <= top; n++) { ctx.fillStyle = pats[n]; ctx.fill(runs[n]); }
```

Dots work the same way: twelve tiles hold dots whose area grows evenly from none to one that fills the cell, which is what makes a halftone look right (the eye reads the share of ink, not the radius).

**Color in one step.** The marks are drawn in white on a clear canvas. Then `source-in` paints only where marks already are: with one color, or with the tiny picture itself stretched over the grid without smoothing, so every mark takes the color of its own cell:

```js
ctx.globalCompositeOperation = 'source-in';
if (fullColor) { ctx.imageSmoothingEnabled = false; ctx.drawImage(src, 0, 0, cols * cw, rows * ch); }
else { ctx.fillStyle = ink; ctx.fillRect(0, 0, cvs.width, cvs.height); }
ctx.globalCompositeOperation = 'source-over';
```

The characters are drawn with the site font. Its glyphs are not all the same width, so the ramp uses only characters narrower than a cell (a wide `@` or `%` would be cut off at the tile's edge), ordered by the ink each one measured. The scene's clock moves by the time since the last frame, at most 50 ms, and by a third of it in slow motion.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Drawn with | Letters | Letters gives each cell one of ten characters, from a space to a hash sign, by its brightness; dots gives it one of twelve dot sizes, from none to one that fills the cell |
| Detail | Medium | The height of a cell: fine is 8px, medium 11px and coarse 16px, and phones use 10, 14 and 20px; letter cells are 0.7 as wide as they are tall, dot cells are square |
| Colors | One color | One color paints every mark mint green, or near-black on paper; full color gives each mark the color of its spot in the picture |
| Shows the original picture | off | Draws the moving picture at 40% under the marks, so you can see what each mark stands for |
| Light paper | off | A light page with dark marks: each cell's darkness, not its brightness, picks the mark, as in a printed photo |

## Production notes
- **Count the calls, not the cells**: one `drawImage` per cell cost 36 ms a frame at fine detail in a software-rendered test; the pattern fills above draw the same frame in about 4 ms, whatever the detail.
- **Video and webcam**: draw the `<video>` into the tiny canvas each frame instead of a scene. A video from another site needs CORS headers, or reading its pixels throws a security error.
- **Glyphs and fonts**: with a monospace font every character has the same width and any ramp fits; with a proportional font, measure the characters and keep the ones narrower than a cell.
- **WebGL**: for full-screen effects at high resolution, do it in a fragment shader with a texture of characters. three.js ships an `AsciiEffect` and a `DotScreenShader`; the postprocessing library has ASCII and dot-screen effects.
- **CSS only**: a still halftone can be a dot pattern made with `radial-gradient` and masked by the image, without any script.
- **Accessibility**: the marks hide the picture's detail, so put its meaning in text (alt text or an `aria-label`), and keep the effect for decoration.
- **Reduced motion**: show one still frame; the demo starts paused with the full picture drawn.

## See also
- [Matrix Rain](../../07-ambient-background/matrix-rain/) — falling characters as a moving background
- [Image Distortion on Hover](../image-distortion-hover/) — another way to restyle a picture as it moves
- [Grain / Film Noise Overlay](../../07-ambient-background/grain-overlay/) — a fine texture laid over a picture
