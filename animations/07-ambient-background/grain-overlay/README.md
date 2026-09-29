# Grain / Film Noise Overlay

## What it is
Film grain lays a see-through layer of random dots over a design and draws it again and again, so the texture flickers like the grain of photographic film. At a low strength, around 5 to 10 percent, it is barely visible, yet flat digital colors feel warmer and deeper; much stronger, and it looks like a damaged screen. The trick is subtlety: people should not notice the grain, only miss it when it is gone.

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
      // one color per grain dot: gray, or three random channels
      const v = Math.random() * 255 | 0;
      const r = colorNoise ? Math.random() * 255 | 0 : v;
      const g = colorNoise ? Math.random() * 255 | 0 : v;
      const b = colorNoise ? Math.random() * 255 | 0 : v;
      for (let dy = 0; dy < pixelSize && y + dy < H; dy++) {
        for (let dx = 0; dx < pixelSize && x + dx < W; dx++) {
          const idx = ((y + dy) * W + (x + dx)) * 4;
          data[idx] = r; data[idx + 1] = g; data[idx + 2] = b; data[idx + 3] = 255;
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
| Strength | Light | How visible the grain is: faint is 4%, light 8% and strong 16%; 5–10% is felt more than seen, above 20% it looks like a damaged screen |
| Grain size | Medium | The size of each dot: fine is 1px, medium 2px and coarse 3px; coarse looks like old film stock |
| How often it changes | Like film | New grain every frame (60 times a second), like film (24), choppy (12) or slow (4); phones change it at most 24 times a second |
| Blend | Film | How the grain mixes with the picture: film darkens dark areas and lightens light ones, like real grain (overlay blending); lighter only lightens (screen); softer is a gentler film (soft light) |
| Colored grain | off | Randomly colored dots instead of gray ones |
| Grain source | Random dots | Dots drawn by a script, or the browser's own noise filter; grain size and colored grain apply to the dots only |

## Production notes
- **Canvas vs SVG feTurbulence**: canvas gives more control (pixel size, color noise) but is more CPU-intensive. SVG feTurbulence is GPU-accelerated and simpler but offers less control over grain character.
- **Reduced update rate is intentional**: real film grain is 24fps, not 60fps. Generating a new canvas texture 60 times per second is wasted computation — 12–24fps matches the aesthetic and reduces CPU load.
- **Phones**: the demo changes the grain at most 24 times a second on screens narrower than 600px, and draws the canvas at CSS pixels rather than device pixels; drawing every dot is the costly part.
- **`mix-blend-mode: overlay`** is the standard for grain: it darkens dark areas slightly and brightens light areas slightly, matching how silver halide responds to exposure.
- **CSS filter on a pseudo-element**: the cleanest production approach — add `::after { content:''; position:absolute; inset:0; background:url(grain.png); animation:grain 0.5s steps(1) infinite; }` with a spritesheet of pre-generated grain frames. This offloads grain generation entirely to a static asset.
- **React libraries**: `react-noise` and various `css-grain` packages implement the SVG filter approach as zero-config drop-in components.

## See also
- [Scanline Effect](../scanline/) — dark lines over the page, like an old monitor
- [Chromatic Aberration](../../06-3d-advanced/chromatic-aberration/) — colors split at the edges, like a cheap lens
- [Light Leak](../light-leak/) — warm light washes in, like a film camera flaw
