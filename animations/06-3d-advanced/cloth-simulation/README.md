# Cloth / Soft-Body Simulation

## What it is
Cloth simulation approximates the physics of fabric — how it hangs under gravity, billows in wind, and responds to external forces. The implementation uses Verlet integration, a physics scheme where velocity is implicit (derived from current minus previous position) rather than stored explicitly. Distance constraints between neighboring vertices maintain the cloth's structure. The combination produces surprisingly realistic cloth behavior with a simple algorithm.

## When to use it
- Animated flags and banners on hero sections
- Product pages for apparel, textiles, or physical goods
- Interactive creative experiences where users can pull and manipulate a cloth
- Educational demonstrations of physics simulation in the browser

## How it works
**Verlet integration** — each vertex updates using its own history:

```js
function integrate(dt) {
  vertices.forEach((v, i) => {
    if (pinned[i]) return;

    const vx = v.x - prev[i].x;  // implicit velocity (current - previous)
    const vy = v.y - prev[i].y;

    prev[i] = { x: v.x, y: v.y }; // save current as "previous"

    v.x += vx + WIND_X * dt * dt;
    v.y += vy + GRAVITY * dt * dt;
  });
}
```

**Distance constraints** — after integration, iteratively pull connected vertices toward their rest distances:

```js
function solveConstraints(iterations) {
  for (let iter = 0; iter < iterations; iter++) {
    constraints.forEach(([a, b, restLength]) => {
      const dx = vertices[b].x - vertices[a].x;
      const dy = vertices[b].y - vertices[a].y;
      const dist = Math.sqrt(dx*dx + dy*dy) || 0.001;
      const diff = (dist - restLength) / dist * 0.5;

      if (!pinned[a]) { vertices[a].x += dx * diff; vertices[a].y += dy * diff; }
      if (!pinned[b]) { vertices[b].x -= dx * diff; vertices[b].y -= dy * diff; }
    });
  }
}
```

**Rendering** — the triangulated mesh is drawn as filled quads. Each quad is split into two triangles sharing the diagonal:

```js
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const a = vertices[idx(r,   c  )];  const b = vertices[idx(r,   c+1)];
    const d = vertices[idx(r+1, c  )];  const e = vertices[idx(r+1, c+1)];
    ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.lineTo(d.x,d.y); ctx.fill();
    ctx.beginPath(); ctx.moveTo(b.x,b.y); ctx.lineTo(e.x,e.y); ctx.lineTo(d.x,d.y); ctx.fill();
  }
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Grid resolution | 24×18 | More vertices = finer cloth folds; fewer = chunky geometry |
| Gravity | 0.12 | Higher = heavier cloth that falls more; lower = floaty |
| Wind strength | 0.5 | Drives horizontal oscillation; varies with a sine function |
| Constraint iterations | 4 | More iterations = stiffer cloth; 1 = elastic/stretchy |

## Production notes
- **Verlet vs explicit Euler**: explicit Euler integration stores velocity explicitly and adds it to position each frame. Verlet integration is more numerically stable for constrained systems — cloth springs don't "explode" as easily at large time steps.
- **Bending constraints**: for realistic cloth, add shear constraints (diagonal neighbors) and bending constraints (one vertex apart). This demo uses structural constraints only (immediate neighbors) for simplicity.
- **GPU cloth simulation**: AAA games simulate cloth on the GPU using compute shaders (DirectX/Vulkan/Metal) or GPGPU passes (same ping-pong texture technique as the GPGPU particle demo). WebGPU enables this in browsers as of Chrome 113+.
- **Cannon.js / Rapier.js**: JavaScript physics engines that include cloth/soft-body simulation with more accuracy and more constraint types. Rapier (Rust/WASM) is the fastest modern option.
- **Self-collision**: this demo does not prevent cloth from passing through itself (self-intersection). Self-collision detection is O(n²) and requires spatial hashing or BVH acceleration structures.
- **Performance**: at 40×30 resolution (1200 vertices, ~3600 constraints, 4 iterations = 14400 constraint solves per frame), expect ~45fps on mid-range mobile. The demo starts at 16×12 under 600px for that reason; the resolution select still lets you push it higher.
- **Canvas resolution**: the backing store is sized to `devicePixelRatio` (capped at 2) and the context is scaled to match, so the mesh stays crisp on phones without paying for a 3× framebuffer.

## See also
- [GPGPU Particle System](../gpgpu-particle-system/) — GPU-computed physics using the texture ping-pong technique
- [Noise-Based Motion](../noise-based-motion/) — noise as an alternative to physics for organic motion
- [Canvas Particle Effect](../canvas-particle-effect/) — simpler canvas-based physics with velocity and forces
