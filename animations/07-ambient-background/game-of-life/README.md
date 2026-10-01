# Game of Life

## What it is
Conway's Game of Life is a grid of square cells, each alive or dead, that changes one generation at a time by three rules about each cell's eight neighbors: a dead cell with exactly three live neighbors is born, a live cell with two or three lives on, and every other cell dies. Nobody steers it, yet out of these rules come still shapes, shapes that blink, gliders that crawl across the grid and guns that fire gliders forever. The mathematician John Conway devised it in 1970.

## When to use it
- Backgrounds for tech, science and coding sites, where emergent behavior fits the theme
- Developer portfolios and about pages, where visitors can draw their own cells
- Loading, idle and 404 screens that should stay alive without repeating a fixed loop
- Teaching pages about simulation, cellular automata or complexity

## How it works
The world is two arrays of cells, one for this generation and one for the next. It reaches past the view by 16 cells on every side, so gliders fly off-screen and settle out of sight, and it has one more ring of cells that always stay dead, so every cell has eight neighbors to count and the loop needs no edge checks:

```js
for (let y = 1; y <= rows; y++) for (let i = y * S + 1, end = i + S - 2; i < end; i++) {
  const n = cells[i - S - 1] + cells[i - S] + cells[i - S + 1] + cells[i - 1] + cells[i + 1]
          + cells[i + S - 1] + cells[i + S] + cells[i + S + 1];             // S: cells in one row
  const v = next[i] = n === 3 || (n === 2 && cells[i]) ? 1 : 0;             // born, lives on, or dies
  if (v) hash = (hash + Math.imul(i, 0x9E3779B1)) | 0; else if (cells[i]) glow[i] = 1;  // a cell that dies starts its trail
}
[cells, next] = [next, cells];
```

Generations follow elapsed time, not frames. Each frame adds the time since the last one (at most 50 ms, a third of it in slow motion) to a running total, and a generation is taken for every 1/Speed of a second in it, so the world changes at the same pace on a 30 Hz phone and a 144 Hz monitor. Trails fade by time too: a dead cell's glow halves every 120 ms, `glow *= 0.5 ** (ms / 120)`. Each picture gathers the cells of one brightness into one path, so a frame is a handful of fills however many cells there are.

A random world usually settles into still shapes and blinkers within a few hundred to a few thousand generations. The step adds up a hash of the live cells; when a hash comes back within 15 generations, the world is repeating itself, and after 40 such generations it starts again, with the old cells fading out as the new ones begin. The glider gun never repeats that soon (it repeats every 30 generations), so it runs forever.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Speed | Normal | How many generations pass each second: slow is 4, normal 10 and fast 20 |
| Cell size | Medium | Small cells are 6px, medium 9px and large 14px; phones draw small cells 8px wide, so the world has fewer cells to work out and draw |
| Start pattern | Random | Random fills about 30% of the cells; the glider gun (Gosper's) fires a glider every 30 generations; the acorn is seven cells that grow for over 5,000 generations on an open grid |
| Color | Mint | Mint, amber, sky blue or pink cells |
| Fading trails | on | A cell that dies fades out over about half a second instead of vanishing at once |
| Grid lines | off | Faint lines show the squares the cells live in |

## Production notes
- **Drawing on it**: Pointer Events cover mouse, touch and pen, and pointer capture keeps a stroke going outside the stage. A stroke fills every cell on the straight line between two pointer positions, so a quick stroke leaves no gaps. `touch-action: none` on the canvas lets a finger draw instead of scrolling the page; keep the stage short enough that the page can still be scrolled around it.
- **Phones**: on phone-sized screens (up to 600px wide, or up to 500px tall for a phone held sideways) the cells are at least 8px wide.
- **Bigger worlds**: a grid of a million cells is still fast with typed arrays; beyond that, run the rules on the GPU (two textures, each frame's shader reads one and writes the other), or use HashLife, which skips ahead through repeating regions (Golly does this).
- **Pattern files**: patterns are shared as run-length code (RLE), as in the demo; LifeWiki and the Golly pattern collection hold thousands.
- **Reduced motion**: the demo starts paused, showing the world a few generations in, until the visitor presses Play. Drawing still works while paused.
- **It is decorative**: keep the canvas `aria-hidden`, dim the cells or use large ones behind text, and stop the loop when the section is off-screen.

## See also
- [Matrix Rain](../matrix-rain/) — another canvas grid that changes step by step
- [Particle Constellation](../particle-constellation/) — dots that link up whenever they come close
- [Flow Field](../flow-field/) — simple rules steer many particles into a living pattern
- [Flocking](../../06-3d-advanced/flocking/) — birds that follow a few simple rules about their neighbors
