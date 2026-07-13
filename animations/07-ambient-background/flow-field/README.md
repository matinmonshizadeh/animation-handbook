# Flow Field

## What it is
Thousands of particles crawl across the canvas, each one steering by the angle of an invisible vector field. The field comes from a small noise function, so neighbouring particles curve in unison and the whole surface reveals smooth, river-like currents. Because the frame is dimmed rather than cleared, particles leave fading trails that trace the flow.

## When to use it
- Generative, organic hero backgrounds where every load looks slightly different
- Data-art and creative-coding pieces
- Ambient loops behind dark landing pages that want texture, not a subject
- Transitions or loading screens that benefit from continuous motion

## How it works
There is no stored field — an angle is computed on demand from an inline value-noise function (a hashed lattice, smooth-interpolated). Each particle samples the angle beneath it, steps that direction, and respawns when it leaves the canvas. Trails come from painting a translucent background instead of clearing:

```js
function vnoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const tl = hash(xi,yi), tr = hash(xi+1,yi), bl = hash(xi,yi+1), br = hash(xi+1,yi+1);
  const u = smooth(xf), v = smooth(yf);
  return (tl*(1-u)+tr*u)*(1-v) + (bl*(1-u)+br*u)*v;
}
function angleAt(x, y, time) {
  return vnoise(x/SCALE, y/SCALE + time*0.15) * Math.PI * 4;
}

// per frame: fade, then advance every particle along its local angle
ctx.fillStyle = `rgba(5,6,10,${TRAIL})`; ctx.fillRect(0, 0, W, H);
const a = angleAt(p.x, p.y, t);
p.x += Math.cos(a) * SPD; p.y += Math.sin(a) * SPD;
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Particle count | 900 | Density of the trails; the main cost driver |
| Noise scale | 34 | Larger = broader, calmer currents; smaller = tight turbulence |
| Speed | 1.0 | Step length per frame; higher smears the trails |
| Trail persistence | 0.06 | Fade alpha — low = long ghostly trails, high = short crisp ones |
| Color | mint | Fixed hue, or `spectrum` for a hue that maps to x-position |

## Production notes
- **Trail alpha vs. buildup**: because trails rely on incomplete clearing, a very low persistence value can leave permanent residue on some GPUs. Nudge it up (0.04+) if you see ghosting that never fully fades.
- **Mobile cap**: particle count is limited to 500 under 600px. Each particle is a stroked line segment, so fill rate — not math — is the bottleneck on phones.
- **Deterministic noise**: the `hash` uses `sin(x*127.1 + y*311.7)*43758.5453`, a classic GLSL trick. It is not cryptographic and not true Perlin noise, but it is cheap, dependency-free, and smooth enough for a field.
- **Reduced motion**: on `prefers-reduced-motion`, the loop is skipped and ~40 frames are pre-rendered once to leave a static, settled composition.
- **Library equivalents**: production flow fields usually run on the GPU — [three.js](https://threejs.org) with a fragment/compute shader, or curl-noise in a particle system. [tsParticles](https://github.com/matteobruni/tsparticles) does not do true flow fields, but its path plugins approximate directed motion.

## See also
- [Particle Constellation](../particle-constellation/) — particles that link rather than flow
- [Aurora](../aurora/) — flowing colour bands from blur instead of particles
- [Mesh Gradient](../mesh-gradient/) — smooth drifting colour with no discrete particles
