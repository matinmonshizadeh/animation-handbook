# Plasma Field

## What it is

Plasma is the classic demoscene background effect: a smoothly shifting field of
colour with no hard edges, generated entirely from maths rather than an image or
video. Every pixel's colour comes from summing a few sine waves of its x and y
position plus a time offset, so the whole field breathes and flows in a loop.

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

| Parameter | What it controls | Notes |
|---|---|---|
| `speed` | How fast the time offset `t` advances | 0 freezes the field; ~1× is a calm drift |
| `scale` / `f` | Radians of wave per pixel | Higher = tighter, busier pattern; lower = broad soft blobs |
| `palette` | The colour lookup table | Neon / sunset / ocean / mono, each a cosine gradient |
| `quality` | Buffer width in pixels | 96 (cheap) to 200 (crisper); height follows the stage aspect |
| `dpr cap` | Backing-store resolution of the view canvas | Capped at 1.5 so upscaling stays cheap |

## Production notes

- The low-res buffer is the whole trick. A per-pixel `putImageData` over the full
  canvas at device resolution will drop frames on mobile; a ~140px buffer upscaled
  with `drawImage` keeps the work at a few thousand pixels per frame.
- Precompute what you can: the radial distance of each pixel and the per-row and
  per-column sines only need recomputing when size or zoom changes, leaving one
  sine per pixel in the inner loop.
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

- [Animated Gradient Background](../animated-gradient-background/)
- [Mesh Gradient](../mesh-gradient/)
- [Aurora](../aurora/)
