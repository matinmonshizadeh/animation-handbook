# Particle Constellation

## What it is
A particle constellation is a field of small dots drifting slowly across a background, where any two dots that come close enough are joined by a thin line that fades as they move apart. The lines keep forming and breaking, so the network seems to shift and grow: the "connected dots" background behind many tech and product sites.

## When to use it
- Hero sections for tech, network, security, or data products
- Loading and idle states that need life without a focal point
- Backgrounds behind headline text, where subtle motion adds depth
- Anywhere a "connected system" metaphor reinforces the message

## How it works
Nodes are plain objects with a position and velocity; they drift and bounce off the edges. Every frame, a double loop tests each pair — when the squared distance falls under the link threshold, a line is drawn with opacity proportional to closeness. Using squared distance avoids a `sqrt` in the reject case:

```js
const L2 = LINK * LINK;
ctx.strokeStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
for (let i = 0; i < nodes.length; i++) {
  const a = nodes[i];
  for (let j = i + 1; j < nodes.length; j++) {
    const b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx*dx + dy*dy;
    if (d2 < L2) {
      ctx.globalAlpha = (1 - Math.sqrt(d2) / LINK) * 0.55;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
  }
}
ctx.globalAlpha = 1;
```

Every line shares one stroke color and gets its fade from `globalAlpha`; building a new color string for each line costs several times more.

Optional mouse attraction nudges each node's velocity toward the pointer, so the mesh gathers where the cursor rests. Each node remembers the velocity it started with and eases back to it every frame, so a pull from the pointer fades away while the slow drift goes on. On touch screens the pointer's position also comes from `pointerdown`, so a resting finger works too.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Number of dots | Medium | Few is 50, medium 90 and many 140; phones show at most 60, because every pair of dots is checked each frame |
| Link distance | Medium | How close two dots must be to be linked: short is 90px, medium 130px and long 180px; too long and everything links to everything |
| Speed | Normal | How fast the dots drift: slow is 0.35, normal 0.6 and fast 1; faster looks agitated |
| Color | Cyan | The color of the dots and lines: cyan, violet, mint or gray |
| Dots follow the pointer | on | Dots near the pointer, or a finger, drift toward it and gather there |

## Production notes
- **The n² wall**: connection testing is O(n²). At ~150 nodes you are doing >11,000 distance checks per frame. This demo caps nodes at 60 on phone-sized screens (up to 600px wide, or up to 500px tall for a phone held sideways) to hold 60fps on mid-range phones. For larger fields, bucket nodes into a spatial grid and only test neighboring cells.
- **Velocity easing**: each frame, a node's velocity eases 1% of the way back to the velocity it started with. That keeps pulls from the pointer from building into runaway speeds, and unlike multiplying the velocity by 0.99, which slows every node to a stop within seconds, it never lets the drift die out.
- **Reduced motion**: the demo starts paused, showing one still frame, until the visitor presses Play. In production, show these visitors the still frame.
- **Retina**: for crisp lines on high-DPI screens, scale the canvas backing store by `devicePixelRatio` and the context by the same factor. Omitted here to keep fill rate low on mobile.
- **Library equivalents**: [tsParticles](https://github.com/matteobruni/tsparticles) ships this exact effect (`links` mode) with presets; [three.js](https://threejs.org) can push the same idea to tens of thousands of GPU points with `LineSegments`.

## See also
- [Starfield / Space Particles](../starfield/) — particles that show depth instead of links
- [Floating Elements](../floating-elements/) — shapes that drift on their own paths
- [Grid / Dot Pattern Parallax](../grid-dot-pattern-parallax/) — a still grid that shifts against the pointer
