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

// per drawn frame: fade, then advance every particle along its local angle
// s is how many 60 Hz frames have passed since the last drawn frame: 1 at 60 Hz, 2 at 30 Hz
const s = Math.min(now - last, 50) / (1000 / 60), w = Math.max(1, Math.round(s));
const f = fa + (Math.abs(s - w) < 0.05 ? w : s);   // a step within 5% of a whole number counts as that number
const nf = Math.round(f + 0.05);                    // whole dims due; the 0.05 keeps a half-way tie off the rounding edge
if (!nf) return;                                    // none yet: draw nothing, the time carries to the next frame
fa = f - nf; last = now;                            // the fraction left over carries too
ctx.fillStyle = `rgba(5,6,10,${TRAIL})`;
for (let i = 0; i < nf; i++) ctx.fillRect(0, 0, W, H);
const k = s * (slow ? 1 / 3 : 1);                   // slow motion shortens the step, not the dim
const a = angleAt(p.x, p.y, t);
p.x += Math.cos(a) * SPD * k; p.y += Math.sin(a) * SPD * k;
```

The step grows with the time since the last drawn frame, and so does the fade, in whole units: the canvas is dimmed once for every 60th of a second, each time by the same `TRAIL` as at 60 Hz, so a 30 Hz frame dims it twice. A step within 5% of a whole number counts as that number for the dim, so a 59.94 or 60.06 Hz screen, or a little noise in the timestamps, still gets exactly one dim per frame, and `fa` carries the fraction that is left over. Rounding leans up by 0.05, so a screen whose frames land exactly half-way between two dims, such as 120 or 240 Hz, keeps a regular draw rhythm instead of one decided by timestamp noise. When no whole dim is due yet, as on the first of two frames of a 120 Hz screen, the frame draws nothing and its time carries to the next one. That keeps drawing at about 60 frames a second whatever the screen, and every drawn frame at one dim, so the trails do not pulse. A 30 Hz phone and a 144 Hz monitor show particles at the same speed with trails of the same length in seconds. One dim of `1 - (1 - TRAIL)^s` would fade the same amount in theory, but an 8-bit canvas rounds every dim, so the faint leftovers would settle to different colors on different screens; repeating the same dim makes them settle to the same colors everywhere. The first frame after a start, a pause or a return from a hidden tab adds nothing, and a long gap counts for at most 50 ms. The still picture drawn on arrival runs 40 steps of `s = 1` with one dim each, so it looks the same on every screen.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Swirl size | Medium | How large the currents are: the direction turns over about 20px (small), 34px (medium) or 60px (large); larger looks calm, smaller turbulent |
| Trail length | Medium | How long trails linger: short fades 12% every 60th of a second, medium 6% and long 4%; below about 4% trails can leave faint marks that never fade |
| Speed | Normal | How far each particle moves in a 60th of a second: slow is 0.6px, normal 1px and fast 1.6px (36, 60 and 96px a second) |
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
