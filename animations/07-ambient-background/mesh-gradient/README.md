# Mesh Gradient Animation

## What it is
A mesh gradient is a field of overlapping, heavily blurred radial gradients that create the appearance of hand-painted color washes. Individual gradient circles are invisible beneath the blur — what remains is pure color bleeding organically across the canvas. Slowly drifting these circles with CSS keyframes produces an ambient effect that looks like a living Impressionist painting. This is the visual language of Stripe, Linear, and many modern SaaS brands.

## When to use it
- Marketing hero sections where the brand palette must feel premium and hand-crafted
- Dark-themed dashboards as an alternative to flat black backgrounds
- SaaS product pages that need warmth and depth without imagery
- App splash screens and loading states

## How it works
Each blob is an absolutely-positioned `<div>` with a radial gradient background and `filter: blur()`. The key is heavy blur — 80px or more — which dissolves the gradient's hard edges into pure color wash. CSS keyframes animate each blob on an independent path:

```css
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.75;
  animation: wander 40s ease-in-out infinite alternate;
}

.blob-1 {
  width: 60%; height: 60%;
  background: #1a3060;        /* deep blue */
  top: -10%; left: -10%;
  animation-delay: 0s;
}

.blob-2 {
  width: 55%; height: 55%;
  background: #2e0a50;        /* deep purple */
  top: 20%; right: -15%;
  animation-delay: -10s;
}

@keyframes wander {
  0%   { transform: translate(0, 0)          scale(1); }
  33%  { transform: translate(15%, -20%)     scale(1.1); }
  66%  { transform: translate(-10%, 15%)     scale(0.9); }
  100% { transform: translate(20%, 10%)      scale(1.05); }
}
```

**CSS blend modes** change the visual mixing of overlapping blobs:
- `normal` — blobs layer on top of each other; later in DOM = on top
- `screen` — adds RGB values, making overlaps brighter and more saturated
- `overlay` — darkens darks, brightens brights; high contrast effect

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Blur amount | 80px | The central parameter — below 40px the circles show; above 120px is pure wash |
| Blob count | 4–5 | More = richer; too many (8+) blend into uniformity |
| Cycle duration | 40s | Long enough that users never see the loop; `alternate` direction doubles effective duration |
| Opacity | 0.75 | Lower = more muted; higher = more vivid; `mix-blend-mode: screen` amplifies this |

## Production notes
- **`filter: blur()` on GPU**: heavy blur is GPU-accelerated in modern browsers but creates a compositing layer per blurred element. Four blurred blobs = four compositing layers. On low-RAM devices, this stacks up — test on mobile.
- **Overflow clipping**: blobs extend beyond the container. Always `overflow: hidden` on the parent so blobs don't bleed into the rest of the page.
- **Native CSS mesh gradients**: the CSS Working Group has a `mesh()` function specification in progress that would render true mesh gradients in CSS without the blur trick. It is not yet shipped in any browser.
- **Figma / Sketch "mesh gradient" tools**: design tools generate mesh gradients as images. For web, the blur-div approach produces a similar aesthetic with full animation capability.
- **`animation-delay` with negative values**: a negative delay (e.g., `-10s`) starts the animation mid-cycle, preventing all blobs from starting at the same position and looking synchronized.

## See also
- [Animated Gradient Background](../animated-gradient-background/) — the simpler, single-gradient animated approach
- [Aurora](../aurora/) — directional vertical bands rather than radial blobs
- [Breathing Glow](../breathing-glow/) — a single centered radial glow that pulses
