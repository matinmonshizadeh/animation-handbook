# Lightning

[Live demo](https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/lightning/)

## What it is
Lightning draws jagged bolts that strike from the clouds to the ground every few seconds, flicker once and fade, while the sky lights up softly behind them. Each bolt is new: it starts as a straight line that is split again and again, every split pushing its middle aside by a little less, which gives the big bends and the fine jitter of real lightning. A click or tap makes a bolt strike where the visitor points.

## When to use it
- Game sites and trailers that want a dramatic opening
- Storm, weather and night themes
- Event and launch intros with a burst of energy
- Halloween and fantasy pages

## How it works
A bolt is built once per strike, by midpoint displacement. It starts as one segment from a point in the clouds to the spot it strikes. Each round splits every segment in two and pushes the new midpoint sideways, at random, by up to a set distance; that distance halves every round. Seven rounds turn the straight line into 129 points: the first rounds make the large bends, the later ones the fine jitter. Every round is kept, so the demo's See inside can draw them one after another:

```js
function split(x0, y0, x1, y1, rounds, off) {
  let pts = [[x0, y0], [x1, y1]]; const steps = [pts];
  for (let k = 0; k < rounds; k++, off /= 2) {
    const next = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i], l = Math.hypot(bx - ax, by - ay) || 1, o = (rand() * 2 - 1) * off;
      next.push([(ax + bx) / 2 - (by - ay) / l * o, (ay + by) / 2 + (bx - ax) / l * o], pts[i]);
    }
    steps.push(pts = next);
  }
  return steps;
}
```

The first push is about a fifth of the bolt's length. Forks start at points along the finished bolt and are split five times on their own, shorter and thinner. Once built, the whole strike is moved sideways, or narrowed, so that it stays inside the box (in Compare, inside its half). Each bolt is drawn twice on the canvas, with no shadow blur: a wide, faint stroke in the bolt's color for the glow, then a thin one on top in that color mixed halfway to white. Its brightness follows the time since the strike: full, dim, full again within a fifth of a second, then a fade to nothing by half a second. The sky's light is a white layer over the scene whose opacity is that brightness times 0.3, so it is never more than 30% white; a still bolt, and every bolt under reduced motion, keeps a steady 10% glow instead. See inside lights the sky once, falling softly from 15%, when it draws the glow. Rain is a set of short lines moved by the time that passed; the clouds are two soft layers slid sideways with transforms.

**Safety.** A strike starts at least 1.5 seconds after the one before, whatever is pressed: a click that comes sooner waits its turn. One strike flashes twice (bright, dim, bright), so the scene never flashes more than twice in any second, well within the limit of three that keeps flashing content safe for people with photosensitive epilepsy.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| How often | Sometimes | The wait between strikes, picked at random: rarely is 5 to 8 seconds, sometimes 2.6 to 4.4 seconds and often 1.6 to 2.4 seconds; never less than 1.5 seconds |
| Branches | Some | How many thinner forks split off the bolt: few is 2, some 4 and many 7 |
| Bolt color | White | The color of the glow and of the core, which is that color mixed halfway to white: white, blue or violet |
| Lights up the sky | on | The sky turns at most 30% white with each strike and follows its flicker (in See inside one soft fall from 15% when the glow is drawn; a steady 10% glow behind a still bolt and under reduced motion); off, only the bolt flashes |
| Rain | on | 160 thin raindrops fall at a slant (70 on phones); off, the sky is clear of rain |

## Production notes
- **Flash safely.** Keep strikes at least a second and a half apart, cap the sky's light (here 30% white) and never flash a large area at full white. Under reduced motion, show a still bolt and fade bolts in and out with no flicker, the sky at a steady 10% glow, never pulsing.
- **No shadow blur.** Canvas `shadowBlur` on a long path is slow on phones; a wide, faint stroke under the bright one gives the glow for the cost of one more line.
- **Build once per strike.** The bolt's points are worked out when it strikes, not every frame; each frame only draws the saved lines.
- **Layers that need no redraw.** The clouds and hills are elements of their own, moved with transforms or not at all; only the rain is drawn every frame; the bolt's canvas is drawn again only while a strike flashes or See inside builds it.
- **Libraries.** Three.js and PixiJS draw the same polylines as lines or meshes with additive blending; GSAP can drive the flicker and the sky's opacity with a short timeline.

## See also
- [Fireworks](../fireworks/) — bright strokes with a soft glow on a canvas
- [Snow / Rain](../snow-rain/) — rain and snow falling over a scene
- [Flash / Light Leak Transition](../../03-page-transitions/flash-transition/) — a flash kept within safe limits
- [Fire Effect](../fire-effect/) — a canvas effect over a dark box, flames instead of bolts
