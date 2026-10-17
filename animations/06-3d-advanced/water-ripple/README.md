# Water Ripple

[Live demo](https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/water-ripple/)

## What it is
A water ripple effect makes a picture look as if it lies under clear water: a drag leaves a wake, a tap drops a pebble, and the ripples spread, cross, bounce off the edges and fade, bending the picture beneath them as they pass. It is a real little wave simulation, not rings drawn by formula, which is why two ripples cross and add up the way water does.

## When to use it
- Hero pictures on pool, spa, travel and seaside sites
- Playful backgrounds that invite people to touch them
- Landing pages for games or kids' products
- Photography sites, as a calm hover effect on one featured picture

## How it works
The water is two grids of heights, about one point per four pixels of the box (at most 200 across, 128 on phones): the heights now and one step earlier. At 60 fixed steps a second, every point becomes half the total of its four neighbors minus its own earlier height, then loses a little, so ripples spread outward, cross and fade; the edges stay flat, so waves bounce off them. The new heights are written over the earlier grid, and the two swap:

```js
for (let y = 1; y < gh - 1; y++) for (let x = 1, i = y * gw + 1; x < gw - 1; x++, i++)
  prev[i] = ((cur[i - 1] + cur[i + 1] + cur[i - gw] + cur[i + gw]) / 2 - prev[i]) * (1 - damp);
[cur, prev] = [prev, cur];
```

A touch pushes a small round dip into the grid (a tap drops a pebble, a wider and deeper dip). A drag's pushes are scaled by the time since the last pointer event, so a 120 Hz screen leaves the same wake as a 60 Hz one. To draw the water, each picture pixel shows the picture read from a spot shifted by the slope of the water there, so the picture bends under every wave; slopes that face the light get a lighter copy of the picture, which makes the glints:

```js
const dx = cur[i + 1] - cur[i - 1], dy = cur[i + gw] - cur[i - gw];   // i: the grid point under this pixel
const qx = clamp(X + Math.round(dx * b)), qy = clamp(Y + Math.round(dy * b));   // b: Bend, scaled to the grid
pixels[o] = lighter[glint(dx, dy)][qy * rw + qx];   // glint: 0 to 3, how much the slope faces the light
```

The pond is drawn once with canvas commands at twice the grid's size each way (two picture pixels for each grid point), so its pixels can be read, and three lighter copies of it are made for the glints. The result is written into that small canvas, which the browser stretches over the box. The steps come from an accumulator (at most three a frame, a third as many in slow motion), so the waves move at the same speed on every screen; once the water has stayed calm for a third of a second the loop stops and the plain picture is drawn, so the box is exactly at rest. Under reduced motion nothing moves: a tap or a drag shows still rings that fade within a second.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Ripple size | Medium | How wide each push is, in grid points of a full-size grid: small is 2, medium 3.5 and large 5.5 (a tap's pebble is half as wide again) |
| How long ripples last | Medium | How much height the water loses each step: short is 5%, which fades a pebble's rings within a second; medium 2.2%, about three seconds; long 0.9%, long enough for rings to bounce off the edges and cross |
| Bend | Medium | How far the picture under a slope is shifted: subtle is 5 grid points for a full slope, medium 12 and strong 22 |
| Light on the waves | on | Slopes that face the light show a lighter picture, in three steps of brightness; off, only the bending shows |

## Production notes
- **A coarse grid is enough.** The ripples are smooth, so a grid of one point per three to four pixels, drawn on a small canvas stretched over the box, looks as good as one point per pixel at a tenth of the cost. Use typed arrays and swap the two grids instead of copying them.
- **Fixed steps, then stop.** The wave rule needs equal steps: take them from an accumulator at a fixed rate, and stop the loop when the largest height is tiny, so a calm picture costs nothing.
- **Read the pixels once.** Draw the picture into the small canvas once and keep its pixels (`getImageData`); a picture from another site needs CORS headers, or the canvas cannot be read.
- **WebGL for full screen.** For a full-screen hero on a large display, the same two-grid rule runs in a fragment shader on ping-pong textures (as in the jQuery Ripples plugin or a Three.js render target), and the bending is a second shader that offsets the texture lookup.
- **Touch and keyboard.** Use Pointer Events with `touch-action: none` on the water only, so a finger that starts on the water draws a wake and the page still scrolls around it; scale each push by the time since the last pointer event, so a fast screen does not leave a stronger wake. Let the arrow keys move a ring that leaves a wake, and Enter or Space drop a pebble there.
- **Reduced motion.** Do not run the waves; a still ring that fades shows where the touch landed.

## See also
- [Cloth / Soft-Body Simulation](../cloth-simulation/) — fixed steps and a drag move a cloth
- [Image Distortion on Hover](../image-distortion-hover/) — rings worked out by formula warp a picture near the pointer
- [Ambient Ripple Effect](../../07-ambient-background/ambient-ripple/) — rings spread on their own, with no water
