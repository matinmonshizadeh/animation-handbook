# Mesh Gradient Animation

[Live demo](https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/mesh-gradient/)

## What it is
A mesh gradient is a background of a few large circles of color, blurred so their edges soften and the colors run into one another; with heavy blur they melt into soft washes. Each circle drifts and grows or shrinks slowly on its own path, so the colors keep blending in new ways, like paint that never quite dries. It is the look of Stripe, Linear and many modern software sites.

## When to use it
- Marketing hero sections where the brand palette must feel premium and hand-crafted
- Dark-themed dashboards as an alternative to flat black backgrounds
- SaaS product pages that need warmth and depth without imagery
- App splash screens and loading states

## How it works
Each blob is an absolutely-positioned round `<div>` filled with one color and softened with `filter: blur()`. The key is heavy blur — 80px or more — which dissolves the circle's hard edge into a wash of color. Each blob has keyframes of its own, a single move from where it starts to where it ends, played forward and back (`alternate`) over its own multiple of `--dur`, the Speed setting:

```css
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(var(--blob-blur));
  opacity: .75;
  mix-blend-mode: var(--blend);
}

.b1 {
  width: 60%; height: 60%;
  background: #1a3060;        /* deep blue */
  top: -10%; left: -10%;
  animation: b1 var(--dur) ease-in-out infinite alternate;
}

.b2 {
  width: 55%; height: 55%;
  background: #2e0a50;        /* deep purple */
  top: 20%; right: -15%;
  animation: b2 calc(var(--dur) * 1.1) ease-in-out infinite alternate;
}

@keyframes b1 {
  0%   { transform: translate(0, 0)      scale(1); }
  100% { transform: translate(20%, 15%)  scale(1.2); }
}
@keyframes b2 {
  0%   { transform: translate(0, 0)      scale(1); }
  100% { transform: translate(-15%, 20%) scale(0.85); }
}
```

The other blobs follow the same pattern at 0.9, 1.2 and 0.8 times `--dur` (40s at Normal). All of them start together, but because no two take the same time, they soon drift out of step and the colors keep meeting in new ways.

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
| Speed | Normal | How long a blob takes to drift one way: slow is 64s, normal 40s and fast 24s, and each blob takes 0.8 to 1.2 times that |
| Colors | Cool | The blob colors: cool, warm, sunset, synthwave or earth tones |
| Number of blobs | 4 | Three, four or five blobs; more make a richer mix |
| Blend | Plain | How overlapping blobs mix: plain stacks them (normal blending), lighter brightens the overlap (screen), deeper darkens it and deepens the colors (overlay) |

## Production notes
- **`filter: blur()` on GPU**: heavy blur is GPU-accelerated in modern browsers but creates a compositing layer per blurred element. Four blurred blobs = four compositing layers. On low-RAM devices, this stacks up — test on mobile.
- **Overflow clipping**: blobs extend beyond the container. Always `overflow: hidden` on the parent so blobs don't bleed into the rest of the page.
- **Native CSS mesh gradients**: CSS has none yet. A proposal for mesh and freeform gradients is open at the CSS Working Group (csswg-drafts issue #7648), but it is not in any specification and no browser ships it, so blurred blobs remain the way to get this look.
- **Figma / Sketch "mesh gradient" tools**: design tools generate mesh gradients as images. For web, the blur-div approach produces a similar aesthetic with full animation capability.
- **Keep the blobs out of step**: if every blob shares one duration and starts with the others, they all turn around at the same moment and the same mix comes back every cycle. The demo gives each blob its own path and its own duration instead. A negative `animation-delay` (e.g., `-10s`) starts an animation mid-cycle, so blobs that share a duration no longer turn around together, though the whole mix still repeats every cycle.
- **Libraries**: Paper Shaders has a `MeshGradient` that draws the colors in a shader instead of with blurred circles, animated by a speed setting, in plain JavaScript or as a React component.

## See also
- [Animated Gradient Background](../animated-gradient-background/) — one gradient that slowly shifts
- [Aurora / Northern Lights](../aurora/) — tall bands of color instead of round blobs
- [Breathing / Pulsing Glow](../breathing-glow/) — a single glow that grows and shrinks
