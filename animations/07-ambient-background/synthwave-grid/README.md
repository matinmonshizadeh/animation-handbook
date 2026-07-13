# Synthwave Grid

## What it is
A neon wireframe floor stretches to a horizon and scrolls continuously toward the viewer, set against a purple gradient sky with a banded, glowing sun. It is the retro-futurist / outrun aesthetic — the "1984 idea of the future" — rebuilt as a seamless ambient loop on a single canvas.

## When to use it
- Music, gaming, and event landing pages with a retro or vaporwave theme
- Hero backgrounds that want a strong sense of depth and forward motion
- 80s-styled product launches, playlists, or promo screens
- Loops behind large display type, where the grid recedes below the text

## How it works
The floor is drawn in perspective: vertical lines fan out from a vanishing point on the horizon, and horizontal lines are spaced by a power curve so they bunch up near the horizon and spread near the viewer. Scrolling is just an offset taken modulo the line count, which makes the loop seamless — a line that reaches the bottom is the same as a new one appearing at the horizon:

```js
const hz = horizon(), cx = W / 2;
for (let i = 0; i < DENS; i++) {
  let p = ((i + offset) % DENS) / DENS;      // 0 at horizon -> 1 at viewer
  const y = hz + Math.pow(p, 2.2) * (H - hz); // perspective compression
  ctx.globalAlpha = Math.min(1, p * 1.6);     // fade in near the horizon
  ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
}
```

The glow is a canvas `shadowBlur` set to the grid colour; the sun is a clipped semicircle filled with a vertical gradient and striped with background-coloured gaps.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Scroll speed | 1.0 | How fast the floor rushes toward the viewer |
| Line density | 16 | Horizontal line count; also sets the loop period |
| Grid glow color | #ff2fb0 | Stroke and `shadowBlur` colour of the whole grid |
| Perspective power | 2.2 | Exponent on the spacing curve (in code) — higher = flatter horizon |

## Production notes
- **`shadowBlur` is expensive**: canvas shadow-based glow is one of the heavier 2D operations. It is fine for this line count, but if you raise density substantially, drop the shadow and fake the glow with a second, thicker, low-alpha pass of each line.
- **The modulo seam**: fading lines in as `p` approaches 0 hides the pop where a new line spawns at the horizon. Without the alpha ramp you would see it flicker into existence.
- **Reduced motion**: on `prefers-reduced-motion` the scroll offset never advances — a single static grid, sky, and sun are drawn, preserving the look without motion.
- **CSS alternative**: this can also be built with a `transform: perspective()` plane and an animated `background-position` on a repeating linear-gradient, which offloads to the compositor. The canvas version wins on control over per-line fade and glow.
- **Library equivalents**: for a true 3D floor with camera moves and bloom, use [three.js](https://threejs.org) — a `PlaneGeometry` with a wireframe material and an `UnrealBloomPass` gives the authentic glow. [tsParticles](https://github.com/matteobruni/tsparticles) is not suited to structured grids.

## See also
- [Starfield](../starfield/) — the other classic "flying through space" depth loop
- [Scanline](../scanline/) — pair with this for full CRT / retro-monitor treatment
- [Grid / Dot Pattern Parallax](../grid-dot-pattern-parallax/) — a flat grid that reacts to the mouse
- [Animated Gradient Background](../animated-gradient-background/) — the sky gradient on its own
