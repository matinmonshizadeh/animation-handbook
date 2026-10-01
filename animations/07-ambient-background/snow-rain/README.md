# Snow / Rain

## What it is
A snow or rain effect draws falling particles on a see-through canvas laid over a dark scene. Snowflakes fall slowly and sway from side to side, while raindrops fall fast and are drawn as short streaks that lean with the wind. Every particle has a depth, so near ones are bigger, brighter and faster than far ones, which turns a flat sprinkle of dots into weather you look through.

## When to use it
- Winter, holiday and other seasonal campaigns
- Weather apps and forecast headers
- Cozy hero sections for cafés, bookshops, travel or games
- Story and game scenes that need a mood behind the text

## How it works
The town is a still SVG behind the canvas, so the canvas holds only the weather and is cleared and redrawn on every frame. The particles live in three depth layers, far, middle and near, and each layer has its own size, speed, sway or streak length and opacity:

```js
// per 60th of a second: fall speed (vy), sideways speed per unit of wind; r = radius or streak width, a = opacity
const SNOW = [{ r: 1.1, vy: .45, wind: .25, sway: 4,  a: .55, share: .4 },
              { r: 1.8, vy: .8,  wind: .45, sway: 8,  a: .8,  share: .35 },
              { r: 2.8, vy: 1.3, wind: .7,  sway: 13, a: .95, share: .25 }];
const RAIN = [{ r: .8,  vy: 9,  wind: 1.2, len: 11, a: .3,  share: .4 },
              { r: 1.1, vy: 13, wind: 1.8, len: 16, a: .45, share: .35 },
              { r: 1.6, vy: 18, wind: 2.6, len: 22, a: .62, share: .25 }];
```

Each frame moves every particle by the time that has passed, counted in 60ths of a second (`k`, at most 50 ms, a third of it in slow motion), so the weather falls at the same speed on a 30, 60 or 120 Hz screen. A particle that leaves the bottom starts again just above the top, and one the wind carries out of a side comes back at the other. New particles are spread over the whole width they wrap around in, the stage and 40 pixels on each side, so the wind never leaves an empty band drifting across:

```js
function step(k) {
  for (const { p, list } of groups) for (const q of list) {
    q.y += p.vy * q.sp * k;          // q.sp: each particle's own speed, 0.8 to 1.2
    q.x += WIND * p.wind * k;
    q.ph += .02 * q.sp * k;          // snow's sway phase
    if (q.y - top > H) Object.assign(q, spawn(-top - Math.random() * (snow ? 20 : H * .3)));
    if (q.x > W + 40) q.x -= W + 80; else if (q.x < -40) q.x += W + 80;
  }
}
```

Drawing puts every particle of a layer into one path, so a frame is three fills for snow or three strokes for rain, however many particles there are. A flake is drawn at `x + sin(phase) × sway`; a drop is a line that leans as far as the drop moves sideways while it falls its own length:

```js
const dx = WIND * p.wind / p.vy * p.len;
for (const q of list) { ctx.moveTo(q.x, q.y); ctx.lineTo(q.x - dx, q.y - p.len); }
ctx.lineWidth = p.r; ctx.stroke();
```

The number of particles follows the area they share, so a phone draws about a quarter of what a laptop draws, and phones and short screens (`(max-width: 600px), (max-height: 500px)`) draw 80% of that again.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Weather | Snow | Snow drifts down slowly and sways; rain falls more than ten times as fast, drawn as streaks |
| Amount | Medium | How many particles per 100,000 square pixels: light, medium and heavy are 28, 62 and 125 flakes, or 35, 80 and 170 drops; phones draw 80% of that |
| Wind | Gentle | None, gentle or strong: the wind carries snow sideways and tilts the rain, near particles more than far ones |
| Depth | on | Three layers in which near flakes and drops are bigger, brighter and faster than far ones; off, every particle is the size and speed of the middle layer |

## Production notes
- **One path per layer**: setting `fillStyle` and calling `fill()` for each flake costs far more than adding every flake of a layer to one path and filling it once. Group by look, not by particle.
- **Still scene, moving canvas**: the town never changes, so it is an SVG behind the canvas instead of being redrawn every frame.
- **Rain is a streak**: real drops fall several meters a second, so the eye sees lines, not dots. A streak's length and lean come from the drop's own velocity, so the angle always matches the wind.
- **CSS-only snow**: a few dozen flakes can be elements moved with `transform`, but past a hundred or so the page has too many animated layers; a canvas holds thousands.
- **Libraries**: tsParticles has ready snow and rain presets, and Three.js `Points` can do 3D weather with tens of thousands of particles; the depth rule is the same.
- **Reduced motion**: show one still frame, as the demo does, and keep the weather out from behind long text.

## See also
- [Starfield / Space Particles](../starfield/) — particles that stream toward you instead of falling
- [Matrix Rain](../matrix-rain/) — columns of characters that fall and leave trails
- [Wave Layers](../wave-layers/) — the same near-fast, far-slow depth rule with layers of water
- [Particle Constellation](../particle-constellation/) — drifting dots that link up when they come close
