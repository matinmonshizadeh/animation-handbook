# Grain / Film Noise Overlay

## What it is
Film grain adds organic texture to clean digital design by layering an animated noise pattern over the content at low opacity. The effect mimics the silver-halide crystal randomness of analog film photography. At the right intensity (5–10% opacity), it is nearly invisible but improves perceived depth and warmth. Above 20%, it reads as a damaged screen. The key to film grain is subtlety — users should not notice it, only notice when it's removed.

## When to use it
- Hero sections and portfolio pages where a photographic, editorial aesthetic is desired
- Video player overlays where the grain bridges the gap between digital and cinematic
- Brand-identity-heavy pages where "analog warmth" is part of the positioning
- Dark-themed dashboards where pure flat surfaces feel too cold

## How it works
**Canvas approach** — generate a new random noise texture each frame (or at a reduced rate for film-like cadence):

```js
function drawGrain(canvas, ctx, pixelSize = 2, colorNoise = false) {
  const { width: W, height: H } = canvas;
  const img = ctx.createImageData(W, H);
  const data = img.data;

  for (let y = 0; y < H; y += pixelSize) {
    for (let x = 0; x < W; x += pixelSize) {
      const v = Math.random() * 255 | 0;
      for (let dy = 0; dy < pixelSize && y + dy < H; dy++) {
        for (let dx = 0; dx < pixelSize && x + dx < W; dx++) {
          const idx = ((y + dy) * W + (x + dx)) * 4;
          data[idx]     = colorNoise ? (Math.random() * 255 | 0) : v;
          data[idx + 1] = colorNoise ? (Math.random() * 255 | 0) : v;
          data[idx + 2] = colorNoise ? (Math.random() * 255 | 0) : v;
          data[idx + 3] = 255;
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0);
}

// Regenerate at 24fps (film rate)
let lastFrame = 0;
function loop(ts) {
  if (ts - lastFrame > 1000 / 24) {
    drawGrain(canvas, ctx);
    lastFrame = ts;
  }
  requestAnimationFrame(loop);
}
```

**SVG `feTurbulence` approach** — the browser generates noise natively; cycling the `seed` attribute animates it:

```html
<svg style="display:none">
  <defs>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3"
                    stitchTiles="stitch" id="turb"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>
</svg>

<div style="
  position: absolute; inset: 0;
  filter: url(#grain);
  opacity: 0.08;
  mix-blend-mode: overlay;
"></div>
```

```js
let seed = 0;
function loop() {
  document.getElementById('turb').setAttribute('seed', seed++);
  requestAnimationFrame(loop);
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Intensity (opacity) | 8% | 5–10% = invisible but impactful; 15% = noticeable; 30% = distracting |
| Grain size (pixel size) | 2px | 1px = fine digital noise; 3px = coarse film grain; 4px+ = halftone |
| Update rate | 24fps | 24fps = film; 12fps = lo-fi analog; 60fps = digital video noise |
| Blend mode | overlay | `overlay` respects light/dark values; `screen` brightens; `soft-light` is subtler |

## Production notes
- **Canvas vs SVG feTurbulence**: canvas gives more control (pixel size, color noise) but is more CPU-intensive. SVG feTurbulence is GPU-accelerated and simpler but offers less control over grain character.
- **Reduced update rate is intentional**: real film grain is 24fps, not 60fps. Generating a new canvas texture 60 times per second is wasted computation — 12–24fps matches the aesthetic and reduces CPU load.
- **`mix-blend-mode: overlay`** is the standard for grain: it darkens dark areas slightly and brightens light areas slightly, matching how silver halide responds to exposure.
- **CSS filter on a pseudo-element**: the cleanest production approach — add `::after { content:''; position:absolute; inset:0; background:url(grain.png); animation:grain 0.5s steps(1) infinite; }` with a spritesheet of pre-generated grain frames. This offloads grain generation entirely to a static asset.
- **React libraries**: `react-noise` and various `css-grain` packages implement the SVG filter approach as zero-config drop-in components.

## See also
- [Scanline](../scanline/) — another retro-analog overlay technique for CRT aesthetics
- [Chromatic Aberration](../../06-3d-advanced/chromatic-aberration/) — companion glitch effect for a degraded-media aesthetic
- [Light Leak](../light-leak/) — another film-photography-inspired ambient overlay
