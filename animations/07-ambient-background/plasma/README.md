# Plasma Field

## What it is

Plasma is a classic effect from the demoscene, the 1990s community that made art
with home computers: a field of color with no hard edges that flows and shifts
like liquid. It is made from math alone. Each point's color comes from adding up
a few waves, based on its position and on time, so the field keeps moving
without any image or video.

## When to use it

- Ambient hero or section backgrounds that need motion without competing with foreground content.
- Loading and idle states where a living surface reads better than a static gradient.
- Music, creative-coding, or retro-themed sites where the demoscene lineage fits.
- Any place you want organic movement but cannot ship a video file.

## How it works

Each pixel gets a scalar value from a sum of sines — some of the position, some
of time — and that value indexes a colour palette. Computing this per pixel at
full resolution is expensive, so the field is rendered into a small offscreen
buffer (around 96–200px wide) and then scaled up onto the visible canvas with
image smoothing on. The upscale blur is free and actually helps the plasma look
softer.

```js
// low-res buffer, one pixel at a time
const v = Math.sin(x*f + t)              // horizontal wave
        + Math.sin(y*f + t*1.3)          // vertical wave
        + Math.sin((x+y)*f*0.5 + t*0.7)  // diagonal wave
        + Math.sin(dist*f + t*1.1);      // radial wave from centre
const idx = ((v + 4) * 31.875) | 0;      // v ∈ [-4,4] → palette index 0..255
data[o++] = lut[idx*3]; data[o++] = lut[idx*3+1]; data[o++] = lut[idx*3+2]; data[o++] = 255;

bctx.putImageData(img, 0, 0);            // write the tiny buffer
vctx.drawImage(buf, 0, 0, bw, bh, 0, 0, view.width, view.height); // scale up smooth
```

The palette is a 256-entry lookup table built once with an Inigo Quilez cosine
gradient, so changing palettes is just swapping the table — no per-pixel colour
maths.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Speed | Normal | How fast the field flows: slow is 0.6 times the base speed, normal 1 and fast 1.6 |
| Pattern size | Medium | How big the color shapes are: small packs more waves into the field, large makes broad, soft blobs |
| Colors | Neon | The palette: neon, sunset, ocean or rose |
| Detail | Medium | How wide the small picture is before it is scaled up: low is 96 pixels, medium 140 and high 200; phones use at most 140 |

## Production notes

- The low-res buffer is the whole trick. A per-pixel `putImageData` over the full
  canvas at device resolution will drop frames on mobile; a ~140px buffer upscaled
  with `drawImage` keeps the work at a few thousand pixels per frame.
- On phone-sized screens (up to 600px wide, or up to 500px tall for a phone held
  sideways) the demo caps the buffer at 140 pixels wide; a phone's stage is small
  enough that it looks the same.
- Precompute what you can: the radial distance of each pixel only changes with
  the size, so it is computed once; the row, column and diagonal sines change
  with time, so they are computed once per frame for each row and column rather
  than for every pixel, leaving one sine per pixel in the inner loop.
- Do colour through a palette lookup table, not live RGB maths per pixel.
- Pause the `requestAnimationFrame` loop on `visibilitychange` when the tab is
  hidden so a background tab does no work.
- Respect `prefers-reduced-motion`: render a single static frame and never start
  the loop.
- The effect is decorative — mark the canvas `aria-hidden` and keep real content
  in the DOM above it.
- For the real thing, move the sum-of-sines into a WebGL fragment shader. The GPU
  runs it per pixel at full resolution for free, and you drop the upscale entirely.

## See also

- [Animated Gradient Background](../animated-gradient-background/) — one gradient that slowly shifts, with no script
- [Mesh Gradient Animation](../mesh-gradient/) — soft blobs of color drift and blend
- [Aurora / Northern Lights](../aurora/) — bands of color sway like the northern lights
