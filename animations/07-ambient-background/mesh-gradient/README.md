# Mesh Gradient Animation

## What it is
A mesh gradient is a background of a few large circles of color, blurred so their edges soften and the colors run into one another; with heavy blur they melt into soft washes. Each circle drifts and grows or shrinks slowly on its own path, so the colors keep blending in new ways, like paint that never quite dries. It is the look of Stripe, Linear and many modern software sites.

## When to use it
- Marketing hero sections where the brand palette must feel premium and hand-crafted
- Dark-themed dashboards as an alternative to flat black backgrounds
- SaaS product pages that need warmth and depth without imagery
- App splash screens and loading states

## How it works
Each blob is an absolutely-positioned round `<div>` filled with one color and softened with `filter: blur()`. The key is heavy blur — 80px or more — which dissolves the circle's hard edge into a wash of color. CSS keyframes animate each blob on an independent path:

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

Heavy blur is the costly part on phones, so the demo halves it on small screens:

```css
@media (max-width: 600px) {
  .blob { filter: blur(calc(var(--blob-blur) * .5)); }
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Blur | Medium | How much the blobs are blurred: light is 50px, medium 80px and heavy 130px; below about 80px the circles show, above it they become a wash. Phones use half |
| Speed | Normal | How long each blob takes to drift one way: slow is 64s, normal 40s and fast 24s |
| Colors | Cool | The blob colors: cool, warm, sunset, synthwave or earth tones |
| Number of blobs | 4 | Three, four or five blobs; more make a richer mix |
| Blend | Plain | How overlapping blobs mix: plain stacks them (normal blending), lighter brightens the overlap (screen), deeper darkens it and deepens the colors (overlay) |

## Production notes
- **`filter: blur()` on GPU**: heavy blur is GPU-accelerated in modern browsers but creates a compositing layer per blurred element. Four blurred blobs = four compositing layers. On low-RAM devices, this stacks up — test on mobile.
- **Overflow clipping**: blobs extend beyond the container. Always `overflow: hidden` on the parent so blobs don't bleed into the rest of the page.
- **Native CSS mesh gradients**: the CSS Working Group has a `mesh()` function specification in progress that would render true mesh gradients in CSS without the blur trick. It is not yet shipped in any browser.
- **Figma / Sketch "mesh gradient" tools**: design tools generate mesh gradients as images. For web, the blur-div approach produces a similar aesthetic with full animation capability.
- **`animation-delay` with negative values**: a negative delay (e.g., `-10s`) starts the animation mid-cycle, preventing all blobs from starting at the same position and looking synchronized.

## See also
- [Animated Gradient Background](../animated-gradient-background/) — one gradient that slowly shifts
- [Aurora / Northern Lights](../aurora/) — tall bands of color instead of round blobs
- [Breathing / Pulsing Glow](../breathing-glow/) — a single glow that grows and shrinks
