# Particle Constellation

## What it is
A field of small nodes drifts slowly across a canvas, and any two nodes closer than a set distance are joined by a line whose opacity fades as they separate. The result is a shifting network mesh — the "connected dots" hero background seen behind countless product and crypto landing pages.

## When to use it
- Hero sections for tech, network, security, or data products
- Loading and idle states that need life without a focal point
- Backgrounds behind headline text, where subtle motion adds depth
- Anywhere a "connected system" metaphor reinforces the message

## How it works
Nodes are plain objects with a position and velocity; they drift and bounce off the edges. Every frame, a double loop tests each pair — when the squared distance falls under the link threshold, a line is drawn with opacity proportional to closeness. Using squared distance avoids a `sqrt` in the reject case:

```js
const L2 = LINK * LINK;
for (let i = 0; i < nodes.length; i++) {
  const a = nodes[i];
  for (let j = i + 1; j < nodes.length; j++) {
    const b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx*dx + dy*dy;
    if (d2 < L2) {
      const op = (1 - Math.sqrt(d2) / LINK) * 0.55;
      ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${op})`;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
  }
}
```

Optional mouse attraction nudges each node's velocity toward the pointer, so the mesh gathers where the cursor rests.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Node count | 90 | Line tests grow as count², so this dominates cost |
| Link distance | 130px | Larger = denser web; too large and everything connects to everything |
| Drift speed | 0.6 | Ambient range is 0.3–1.0; above that it reads as agitated |
| Mouse attraction | on | Pull strength is capped and damped so it stays gentle |
| Color | cyan | RGB triple reused for both nodes and lines |

## Production notes
- **The n² wall**: connection testing is O(n²). At ~150 nodes you are doing >11,000 distance checks per frame. This demo caps nodes at 60 on screens under 600px to hold 60fps on mid-range phones. For larger fields, bucket nodes into a spatial grid and only test neighboring cells.
- **Velocity damping**: multiplying velocity by 0.99 each frame keeps the mouse-attraction impulses from accumulating into runaway speeds — without it, the field slowly boils.
- **Reduced motion**: the animation loop never starts; a single static frame is drawn and re-rendered only when a control changes, honoring `prefers-reduced-motion`.
- **Retina**: for crisp lines on high-DPI screens, scale the canvas backing store by `devicePixelRatio` and the context by the same factor. Omitted here to keep fill rate low on mobile.
- **Library equivalents**: [tsParticles](https://github.com/matteobruni/tsparticles) ships this exact effect (`links` mode) with presets; [three.js](https://threejs.org) can push the same idea to tens of thousands of GPU points with `LineSegments`.

## See also
- [Starfield](../starfield/) — particles as depth rather than a network
- [Floating Elements](../floating-elements/) — drifting shapes on independent paths
- [Grid / Dot Pattern Parallax](../grid-dot-pattern-parallax/) — a static lattice that reacts to the mouse
