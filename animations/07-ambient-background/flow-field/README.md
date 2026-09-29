# Flow Field

## What it is
A flow field moves thousands of particles across a canvas, each one steering by the direction of an invisible current under it. The directions change smoothly from one spot to the next, so particles near each other curve together, and the whole surface shows gentle, river-like currents. The canvas is dimmed a little each frame instead of cleared, so every particle leaves a fading trail that traces the flow.

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
| Swirl size | Medium | How large the currents are: the direction turns over about 20px (small), 34px (medium) or 60px (large); larger looks calm, smaller turbulent |
| Trail length | Medium | How long trails linger: short fades 12% a frame, medium 6% and long 4%; below about 4% trails can leave faint marks that never fade |
| Speed | Normal | How far each particle moves every frame: slow is 0.6px, normal 1px and fast 1.6px |
| Number of particles | Medium | Few is 400, medium 900 and many 1,500; phones show at most 500 |
| Color | Mint | Mint, ember or ice, or rainbow, where the color changes across the stage and over time |

## Production notes
- **Trail alpha vs. buildup**: because trails rely on incomplete clearing, a very low persistence value can leave permanent residue on some GPUs. Nudge it up (0.04+) if you see ghosting that never fully fades.
- **Mobile cap**: particle count is limited to 500 on phone-sized screens (up to 600px wide, or up to 500px tall for a phone held sideways). Each particle is a stroked line segment, so fill rate — not math — is the bottleneck on phones.
- **Deterministic noise**: the `hash` uses `sin(x*127.1 + y*311.7)*43758.5453`, a classic GLSL trick. It is not cryptographic and not true Perlin noise, but it is cheap, dependency-free, and smooth enough for a field.
- **Reduced motion**: the demo starts paused, showing about 40 frames drawn at once as a still, settled picture, until the visitor presses Play. The same 40 frames are drawn whenever the page opens, so the stage never starts empty.
- **Library equivalents**: production flow fields usually run on the GPU — [three.js](https://threejs.org) with a fragment/compute shader, or curl-noise in a particle system. [tsParticles](https://github.com/matteobruni/tsparticles) does not do true flow fields, but its path plugins approximate directed motion.

## See also
- [Particle Constellation](../particle-constellation/) — particles that link up instead of flowing
- [Aurora / Northern Lights](../aurora/) — flowing bands of color made with blur
- [Mesh Gradient Animation](../mesh-gradient/) — smooth drifting color with no particles
