# Topographic Lines

## What it is
Topographic lines are the contour lines of a map, drawn over an invisible height map that slowly changes. Each line joins all the points at one height, so the lines crowd together on steep slopes and spread apart on flat ground. As the hills swell, sink and drift, the lines bend, merge and split, like a map of land that is still taking shape.

## When to use it
- Hero backgrounds for outdoor, hiking, travel and climbing brands
- Maps, geography and data products that want a quiet, on-theme texture
- Portfolio and studio sites that want a hand-drawn, cartographic feel
- Section dividers or footers where a slow pattern fills empty space

## How it works
The height of every point comes from smooth noise (Perlin gradient noise): two layers of it, broad hills plus smaller bumps, each sliding slowly in its own direction, so their sum swells and sinks instead of moving in one piece. The height is sampled on a grid, 7px squares on a computer and 8px on a phone. Each frame, marching squares turns the grid into lines: for every square and every contour level between its lowest and highest corner, the level crosses the square's sides where the height equals it, and a short segment joins the crossings. A square's side is shared with its neighbor, so both find the same crossing and the segments join into continuous lines.

```js
for (let m = Math.ceil(lowest / GAP); m * GAP < highest; m++) {
  const L = m * GAP;                                   // this contour's height
  const idx = (a > L ? 8 : 0) | (b > L ? 4 : 0) | (c > L ? 2 : 0) | (d > L ? 1 : 0);
  // two opposite corners above the level: the middle of the square decides which sides join
  const sides = SEG[idx] || ((idx === 5) === ((a + b + c + d) / 4 > L) ? [0, 3, 2, 1] : [0, 1, 3, 2]);
  const path = BOLD && m % 5 === 0 ? bold : thin;     // every fifth level is an index line
  for (let e = 0; e < sides.length; e += 2) {
    cross(sides[e], x, y, L, a, b, c, d); path.moveTo(px, py);
    cross(sides[e + 1], x, y, L, a, b, c, d); path.lineTo(px, py);
  }
}

// where level L crosses the top side: linear interpolation between the two corner heights
px = x + step * (L - a) / (b - a); py = y;
```

The field has its own clock, which grows by the time since the last frame times the speed (a third of it in slow motion), never more than 50 ms at once, so the hills move at the same pace on a 30 Hz phone and a 144 Hz monitor. Every frame clears the canvas and draws the whole picture again, which also makes a setting change show at once while the loop is paused.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Line spacing | Medium | How much the height changes between two lines: tight puts about 1.7 times as many lines on the same ground, wide about 0.6 times |
| Speed | Normal | How fast the hills swell and drift: slow is half the normal pace and fast twice it; at normal the broad hills slide about 7px a second |
| Color | Sand | Sand, mint, sky blue or white lines on a dark ground |
| Hill size | Medium | How wide one hill is: about 130px (small), 220px (medium) or 360px (large) |
| Bold every fifth line | on | Every fifth line is drawn thicker and brighter, like the index contours of a printed map |

## Production notes
- **Cost**: the work is the noise at every grid point plus one pass of marching squares, under a millisecond a frame on a laptop for a 960 × 380 stage. A coarser grid is the main saving; phones (up to 600px wide, or up to 500px tall for a phone held sideways) sample every 8px instead of 7px.
- **One stroke per style**: all thin segments go into one path and all bold ones into another, so a frame is two strokes, not thousands.
- **Smoother lines**: for a print-quality look, join the segments into polylines and draw them as curves, or render the contours in a WebGL fragment shader (the fractional part of height divided by spacing, drawn where it is near zero, with its screen-space derivative for an even line width).
- **Libraries**: [d3-contour](https://github.com/d3/d3-contour) builds contour polygons from a grid of values with the same marching squares method; [simplex-noise](https://github.com/jwagner/simplex-noise.js) supplies the height field.
- **Reduced motion**: the demo starts paused with the lines drawn still, until the visitor presses Play.
- **It is decorative**: keep the canvas `aria-hidden` and place real content above it; keep the lines faint enough that text over them stays readable.

## See also
- [Flow Field](../flow-field/) — particles follow a noise field instead of tracing its heights
- [Plasma Field](../plasma/) — a field of waves shown as smooth color instead of lines
- [Grid / Dot Pattern Parallax](../grid-dot-pattern-parallax/) — a quiet pattern that shifts gently for depth
