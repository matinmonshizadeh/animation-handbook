# Pixelate Transition

[Live demo](https://matinmonshizadeh.github.io/animation-handbook/animations/03-page-transitions/pixelate-transition/)

## What it is
A pixelate transition hides the change from one page or picture to the next behind big square blocks. The current page breaks into blocks of flat color that grow larger, the page swaps while it cannot be read, and the blocks shrink until the new page is sharp. It looks like a picture losing and regaining focus in an old video game.

## When to use it
- Photo galleries and portfolios, between one picture and the next
- Game, music and retro-themed sites
- Slideshows and story pages where each step is a full picture
- A playful change between the sections of a landing page

## How it works
The pages are pictures drawn once onto hidden canvases. During a change, each frame draws the current page very small on a second canvas, one pixel per block, with smoothing on, so each pixel takes its color from the middle of its block; then it draws that small copy back up to the full size with smoothing off, so every pixel turns into one flat square:

```js
const bw = Math.ceil(w / b), bh = Math.ceil(h / b);          // b: the block size this frame
sctx.imageSmoothingEnabled = true;  sctx.drawImage(page, 0, 0, bw, bh);        // sctx draws on the small canvas
ctx.imageSmoothingEnabled = false;   ctx.drawImage(small, 0, 0, bw, bh, 0, 0, bw * b, bh * b);
```

The block size follows the change: it grows from one pixel to the largest size at the middle and shrinks back, and the page swaps exactly at the middle, when the blocks are largest. In steps holds the block size at a few sizes in turn instead of growing smoothly:

```js
const k = p < .5 ? p * 2 : (1 - p) * 2;                       // p: 0 to 1 over the change
let b = 1 + (blockMax - 1) * k * k * (3 - 2 * k);
if (stepped) b = Math.max(1, Math.round(b / blockMax * 4) / 4 * blockMax);
```

A change runs by the time that has passed, three times as long in slow motion, and nothing is drawn between changes. The page names are real buttons above the canvas, so they never pixelate and stay easy to read and to reach with the keyboard. The page titles are drawn in the site's font once it has loaded. Under reduced motion a change is a short, plain fade.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Block size | Medium | How big the squares are at the middle of a change: small is 8 pixels, medium 16 and large 28 |
| Speed | Normal | How long a change takes: slow is 1.2 seconds, normal 0.8 seconds and fast 0.5 seconds |
| How the blocks change | Smoothly | Smoothly grows and shrinks the blocks evenly; in steps holds them at a quarter, a half, three quarters and the full size in turn |

## Production notes
- **Two small drawings a frame.** Draw the page small and back up with `drawImage`; never read and average pixels in a loop. Keep the hidden page canvases at most twice the screen's pixels.
- **Pictures, not live pages.** A canvas cannot pixelate HTML. For real pages, take a picture of each view first (html2canvas or a server-side screenshot), or pixelate only the hero picture and fade the rest. With the View Transitions API, the old and new views can be shown as pictures that a shader or canvas pixelates.
- **WebGL.** A fragment shader that rounds each pixel's coordinates to its block (`floor(uv * blocks) / blocks`) pixelates a full-screen view in one pass; PixiJS has a ready-made pixelate filter.
- **Keep text readable.** Leave navigation and buttons out of the pixelated area, and keep the change short: it hides the page for a moment by design.
- **Sampled, not averaged.** The small copy takes a spot near each block's middle rather than averaging the whole block, which is close enough for flat squares. For a true average, set the small canvas's smoothing quality to medium or high, which costs more per frame.
- **Reduced motion.** Use a short, plain crossfade instead.

## See also
- [Dissolve Transition](../dissolve/) — the page breaks into tiles that give way in an order
- [Blur Transition](../blur-transition/) — the page goes out of focus and comes back as the next one
- [ASCII / Halftone](../../06-3d-advanced/ascii-halftone/) — a picture drawn small and shown as characters or dots
