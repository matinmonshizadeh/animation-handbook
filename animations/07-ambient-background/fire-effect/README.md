# Fire Effect

[Live demo](https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/fire-effect/)

## What it is
A fire effect fills the bottom of a dark area with flames that flicker, rise and die out, with sparks drifting up. It is made from a small grid of heat values: the bottom row is always as hot as it gets, heat climbs one row at a time with a little sideways wobble, and it cools on the way up, so the hot base turns into tongues of flame. It is the classic fire of early computer games, drawn soft.

## When to use it
- Game sites and launch pages for games
- Sale, countdown and event banners that want urgency
- Night, festival and campfire themes
- Short intros where a burst of energy fits the brand

## How it works
The fire is a grid of numbers between 0 (cold) and 1 (hottest), about one cell per five pixels of the box. The bottom row sits just below the box and is set to full heat every step (only its middle, for a campfire). Every other cell takes the heat of the cell below it, written straight up half the time and one cell to the left or the right the rest (more often toward the wind) and, half the time, a little cooler. So heat moves up a row each step, runs out about where the flame height says, and leaves hotter streaks where it happened to cool less:

```js
for (let x = 0; x < cols; x++) heat[(rows - 1) * cols + x] = base(x);   // the hidden row: always full heat
const cool = 2 / ((rows - 1) * HEIGHT[height]);                          // the average loss per row
for (let y = 1; y < rows; y++) for (let x = 0; x < cols; x++) {
  const r = rand(), dx = (r < .25 ? -1 : r < .75 ? 0 : 1) + (wind && rand() < .5 ? wind : 0);   // left, stay, stay, right
  const nx = Math.min(cols - 1, Math.max(0, x + dx));
  heat[(y - 1) * cols + nx] = Math.max(0, heat[y * cols + x] - (rand() < .5 ? 0 : cool));
}
```

Each heat value, blended with its two side neighbors to soften the grain, picks one of 256 colors from the palette, dark when cool and near white when hot. The colors are written into a small canvas with one pixel per cell, and that canvas is the picture: its CSS size is the box's, so the browser stretches it smoothly, which is what makes the flames soft instead of blocky, and costs the script nothing:

```js
for (let y = 0; y < rows - 1; y++) for (let x = 0, i = y * cols; x < cols; x++, i++)
  pixels[i] = palette[Math.min(255, (heat[i - (x > 0)] + 2 * heat[i] + heat[i + (x < cols - 1)]) * 63.75 | 0)];
small.getContext('2d').putImageData(image, 0, 0);   // small: a canvas element sized 100% of the box in CSS
```

The grid takes fixed steps of a 60th of a second from the time that has passed (at most two a frame), so the fire burns at the same speed on a 60 Hz and a 120 Hz screen; slow motion counts a third of the time. Sparks are drawn into the same small canvas as soft dots that rise from the hot cells, sway and fade, moved by the time itself. A new fire is run 200 steps from a fixed seed before it is first drawn, so it starts full; under reduced motion it waits paused on that full fire.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Flame height | Medium | Where the heat runs out, as a share of the box's height: low is about a third, medium about half and tall about four fifths; taller flames lose less heat per row |
| Fire shape | Along the edge | Along the edge heats the whole bottom row, so flames burn across the box; campfire heats only its middle third, fading to the sides, so the flames lean in and meet in a point |
| Colors | Orange | The palette from cool to hot: orange runs from dark red to yellow and white, blue from deep navy to pale blue, green from dark green to pale yellow |
| Wind | None | Left or right moves half of the heat one extra cell to that side each step, so the flames lean that way |
| Sparks | on | About 24 sparks a second rise from the flames and fade within one to two and a half seconds (10 a second on phones) |

## Production notes
- **Keep the grid small.** A grid of about 160 cells across is plenty when it is stretched with smoothing; a cell per pixel costs twenty-five times as much for flames that look the same. The demo uses at most 96 across on phones and half the cells in each half of Compare.
- **Fixed steps.** A grid that moves one row per frame burns twice as fast on a 120 Hz screen. Step it at a fixed rate from an accumulator, and cap the steps per frame so a slow device slows down instead of falling behind.
- **One small canvas, stretched by the browser.** Write the colors with `putImageData` into a canvas of one pixel per cell and give the canvas the box's CSS size: the browser scales it on its own, far cheaper than drawing a rectangle per cell or scaling it up with `drawImage` every frame.
- **Pause out of view.** A fire on a page section that has scrolled away still costs every frame: stop the loop with an `IntersectionObserver` and when the tab is hidden.
- **Reduced motion.** Show still flames; let the visitor start them with a play control.
- **Libraries and shaders.** The same fire is a few lines of a WebGL fragment shader with a noise function (for example in Three.js or PixiJS), which suits a full-screen fire; for a small banner, a canvas grid like this one is lighter. Lottie or a short looping video are the usual choices when the fire must look painted.

## See also
- [Game of Life](../game-of-life/) — a grid of cells that steps by simple rules
- [Cloth / Soft-Body Simulation](../../06-3d-advanced/cloth-simulation/) — fixed steps at the same rate on every screen
- [Volumetric Smoke / 3D Noise](../../06-3d-advanced/volumetric-smoke/) — smoke that drifts and curls
- [Fireworks](../fireworks/) — sparks that rise, burst and fade
