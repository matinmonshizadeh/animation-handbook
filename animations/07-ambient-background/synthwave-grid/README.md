# Synthwave Grid

## What it is
A synthwave grid is a glowing neon floor that stretches to the horizon and rolls steadily toward the viewer, under a purple sky with a striped, glowing sun. It is the retro look of 1980s album covers and arcade games, the 1980s idea of the future, drawn as a loop that never visibly restarts.

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
| Speed | Normal | How fast the floor rolls toward the viewer: slow is 0.6, normal 1 and fast 1.6 |
| Number of lines | Medium | How many lines the floor has: few is 10 across and 15 toward the horizon, medium 16 and 23, many 24 and 35; more lines make a finer grid |
| Grid color | Pink | The color of the glowing lines: pink, cyan, purple or orange |

## Production notes
- **`shadowBlur` is expensive**: canvas shadow-based glow is one of the heavier 2D operations. It is fine for this line count, but if you raise density substantially, drop the shadow and fake the glow with a second, thicker, low-alpha pass of each line.
- **The modulo seam**: fading lines in as `p` approaches 0 hides the pop where a new line spawns at the horizon. Without the alpha ramp you would see it flicker into existence.
- **Reduced motion**: the demo starts paused, showing the grid, sky and sun still, until the visitor presses Play. In production, show these visitors the still scene.
- **CSS alternative**: this can also be built with a `transform: perspective()` plane and an animated `background-position` on a repeating linear-gradient, which offloads to the compositor. The canvas version wins on control over per-line fade and glow.
- **Library equivalents**: for a true 3D floor with camera moves and bloom, use [three.js](https://threejs.org) — a `PlaneGeometry` with a wireframe material and an `UnrealBloomPass` gives the authentic glow. [tsParticles](https://github.com/matteobruni/tsparticles) is not suited to structured grids.

## See also
- [Starfield / Space Particles](../starfield/) — another way of flying forward through space
- [Scanline Effect](../scanline/) — dark lines that finish the old-screen look
- [Grid / Dot Pattern Parallax](../grid-dot-pattern-parallax/) — a flat grid that shifts against the pointer
- [Animated Gradient Background](../animated-gradient-background/) — a gradient like the sky's, moving on its own
