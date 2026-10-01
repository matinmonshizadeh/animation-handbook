# Cloth / Soft-Body Simulation

## What it is
A cloth simulation treats fabric as a grid of points joined by links of fixed length. Sixty times a second, every point keeps moving the way it was moving, plus gravity and wind, and then the links pull neighboring points back into shape. Pin a few points and the grid hangs, sways and folds like fabric, and you can grab it.

## When to use it
- Animated flags and banners on hero sections
- Product pages for apparel, textiles, or physical goods
- Interactive creative experiences where users can pull and manipulate a cloth
- Educational demonstrations of physics simulation in the browser

## How it works
**Verlet integration** — each vertex updates using its own history (`dt` is the fixed step, 1/60 s):

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

**Fixed steps** — Verlet keeps a point's velocity as the distance it moved in the last step, so every step must be the same length. Scaling one step by the time since the last frame changes the physics, and a long step throws points further than the links can pull them back. The demo therefore always steps by 1/60 s and runs as many steps per drawn frame as the time since the last frame calls for:

```js
const STEP = 1000 / 60;                  // one physics step, in milliseconds
let behind = 0;                          // time that has passed but not been stepped yet

function frame(elapsed) {                // elapsed: ms since the last drawn frame
  if (elapsed < 16) return;              // draw at most once per 16 ms; the time waits for a later frame
  behind += Math.min(elapsed, 50);       // a long gap counts for at most 50 ms
  for (let n = 0; behind >= STEP - 1 && n < 3; n++) {   // 1 ms of slack, at most 3 steps
    integrate(STEP / 1000);              // dt in seconds: 1/60
    solveConstraints(iterations);
    behind -= STEP;
  }
  draw();
}
```

A 60 Hz screen runs one step per frame and a 30 Hz screen two. The demo draws at most once per 16 ms, so a 120 Hz screen draws every second refresh with one step, and a 144 Hz screen every third refresh (about 48 pictures a second) with one or two steps. The cloth falls and swings at the same speed on every one of them. The 1 ms of slack keeps a frame that arrives a hair early from being skipped and then paid for twice, and the cap of three steps means a device that cannot keep up makes the cloth slower instead of piling up more work.

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
| Hangs from | Two corners | Pins the top two corners, the whole top edge, one corner, or nothing, in which case the cloth falls to the floor |
| Wind | Medium | How hard the wind blows; it rises and falls on its own: light is 0.2, medium 0.5 and strong 1.2 |
| Stiffness | Medium | How many times each step, sixty a second, the links are pulled back to length: stretchy is 2, medium 4 and stiff 8 |
| Gravity | Normal | How heavy the cloth is: light is 0.06, normal 0.12 and heavy 0.2 |
| Detail | Medium | How many points the cloth has: low is 16 × 12, medium 24 × 18 and high 40 × 30; phones start at low |
| Shows the points | off | Marks every point of the grid, with the pinned ones in red |

## Production notes
- **Verlet vs explicit Euler**: explicit Euler integration stores velocity explicitly and adds it to position on every step. Verlet integration is more numerically stable for constrained systems — cloth springs don't "explode" as easily at large time steps.
- **Fixed time step**: one step per drawn frame makes the cloth fall twice as fast on a 120 Hz screen and half as fast on a 30 Hz phone, and stretching a step to the length of the frame changes what Verlet computes. Step by a fixed 1/60 s from an accumulator, as above, and draw once per frame.
- **Bending constraints**: for realistic cloth, add shear constraints (diagonal neighbors) and bending constraints (one vertex apart). This demo uses structural constraints only (immediate neighbors) for simplicity.
- **GPU cloth simulation**: AAA games simulate cloth on the GPU using compute shaders (DirectX/Vulkan/Metal) or GPGPU passes (same ping-pong texture technique as the GPGPU particle demo). WebGPU enables this in browsers as of Chrome 113+.
- **Cannon.js / Rapier.js**: JavaScript physics engines that include cloth/soft-body simulation with more accuracy and more constraint types. Rapier (Rust/WASM) is the fastest modern option.
- **Self-collision**: this demo does not prevent cloth from passing through itself (self-intersection). Self-collision detection is O(n²) and requires spatial hashing or BVH acceleration structures.
- **Performance**: at 40×30 (1,271 points, 2,470 links, 4 passes = 9,880 link corrections a step) a phone-class CPU manages about 17 frames a second (one step and one drawing each), and 24×18 about 47. The demo starts at 16×12 on phones (screens 600px wide or less, or 500px tall or less), where it holds 60; its Detail setting still lets you pick more.
- **Canvas resolution**: the backing store is sized to `devicePixelRatio` (capped at 2) and the context is scaled to match, so the mesh stays crisp on phones without paying for a 3× framebuffer.

## See also
- [GPGPU Particle System](../gpgpu-particle-system/) — physics moved to the graphics chip
- [Noise-Based Motion](../noise-based-motion/) — natural movement from noise instead of physics
- [Canvas Particle Effect](../canvas-particle-effect/) — simpler physics for loose particles
- [2D Physics](../physics-2d/) — solid balls that fall, bounce and pile up
