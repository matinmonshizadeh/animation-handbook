# Flocking

## What it is
Flocking makes a crowd of simple dots move like one flock of birds or a school of fish, with no leader and no plan. Each bird sees only the birds near it and follows three rules: keep a little room from the closest ones, fly the way its neighbors fly, and drift toward the middle of the group. Those three local rules are enough to make the whole flock swirl, split and join again; Craig Reynolds named the birds "boids" when he described them in 1986.

## When to use it
- A calm, living background behind a hero headline
- Nature, travel and outdoor brands: birds, fish, insects, drones
- Games, art pages and generative-design showcases
- Articles that explain swarms, crowds or emergent behavior

## How it works
Every move, each bird gathers the birds within its view radius `R` that are in front of it or beside it (a bird has a blind spot right behind it), and turns by up to three steering pulls:

```js
function step(k) {                       // k: the length of this move in 60 Hz frames, at most 1.05
  for (const b of birds) {
    let n = 0, cx = 0, cy = 0, ax = 0, ay = 0, sx = 0, sy = 0;
    const vb = Math.hypot(b.vx, b.vy);
    for (const o of birds) {
      if (o === b) continue;
      const dx = o.x - b.x, dy = o.y - b.y, d2 = dx * dx + dy * dy;
      if (d2 > R * R || dx * b.vx + dy * b.vy < -0.5 * vb * Math.sqrt(d2)) continue; // too far, or behind
      n++; cx += o.x; cy += o.y;                                // stay close: their middle
      ax += o.vx; ay += o.vy;                                   // match direction: their heading
      if (d2 < SEP * SEP) { sx -= dx / d2; sy -= dy / d2; }     // keep apart: a closer one pushes harder
    }
    acc.x = acc.y = 0;
    if (n) {
      steer(b, ax, ay, MAX_TURN, ALIGN);                 // turn toward the neighbors' heading
      steer(b, cx / n - b.x, cy / n - b.y, MAX_TURN, COHERE); // turn toward their middle
    }
    steer(b, sx, sy, MAX_TURN * 1.5, 2);                 // turn away from the closest ones, harder than the rest
    b.vx += acc.x * k; b.vy += acc.y * k;                // the turn, scaled by the time that passed
    keepSpeedBetween(b, 0.55 * MAX_SPEED, MAX_SPEED);    // birds never hover or race
    b.x += b.vx * k; b.y += b.vy * k;
  }
}
```

Each pull is Reynolds steering: the change of velocity that would point the bird at full speed in the wanted direction, capped so a bird can only turn so sharply in one move:

```js
function steer(b, dx, dy, cap, weight) {
  const d = Math.hypot(dx, dy); if (!d) return;
  let x = dx / d * MAX_SPEED - b.vx, y = dy / d * MAX_SPEED - b.vy;
  const l = Math.hypot(x, y);
  if (l > cap) { x *= cap / l; y *= cap / l; }
  acc.x += x * weight; acc.y += y * weight;
}
```

The demo adds two more pulls. Inside a margin along each edge a bird turns back, harder the deeper it is in the margin, so the flock curves away from the edges instead of piling up against them. With Flees the pointer on, a bird near the pointer or a finger steers straight away from it with four times the usual turn.

**Time, not frames.** The loop draws at most once per 16 ms and flies the birds for the time since the last drawn frame, counted in 60 Hz frames (capped at 50 ms), so they fly at the same speed on a 30, 60 or 120 Hz screen; slow motion counts a third of it. A frame more than 5% longer than one 60 Hz frame is flown as several equal moves, none longer than 1.05 of a 60 Hz frame (the 5% keeps a frame that comes a little late to one move). So a bird never turns much harder in one move than it would at 60 Hz, and a 30 Hz screen, with two moves of exactly one frame, flies exactly the 60 Hz path:

```js
function advance(k) { const n = Math.max(1, Math.ceil(k - 0.05)); for (let i = 0; i < n; i++) step(k / n); }
```

**Drawing.** Every bird is an arrowhead pointed along its velocity; all of them go into one path that is filled once per frame.

**A flock from the first picture.** A new flock starts at random places and then flies three seconds (180 moves) before it is first drawn, so the first picture, and the still one shown under reduced motion, already shows flocks.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Flock size | Medium | How many birds fly: small is 70, medium 150 and large 280; phones fly 35, 70 and 130 |
| How close they fly | Normal | The room each bird keeps around it and how hard it follows its neighbors: loose keeps 32px and follows gently, normal keeps 22px, tight keeps 15px and follows hard |
| Flees the pointer | on | Birds within 90px of the pointer or a finger steer straight away from it |
| Speed | Normal | The top speed, in pixels per 60th of a second: slow is 1.3, normal 2 and fast 3; no bird flies slower than 55% of it |
| Shows one bird's view | off | Rings one bird with the 50px radius it looks within and the dashed room it keeps, and links it to every neighbor it follows |

All distances and speeds shrink by up to a third on small stages, such as on phones.

## Production notes
- **Every bird checks every other bird**, so the work grows with the square of the flock: 280 birds is about 78,000 checks a move, still under 2 ms. For thousands of birds, put them in a grid of cells the size of the view radius and check only the nine cells around each bird, or move the flock on the graphics chip (three.js has a well-known GPU birds example).
- **Edges**: wrapping birds around to the opposite edge is simpler, but a flock then splits at the edge. Turning back inside a margin keeps every flock in view.
- **A speed floor** (55% of the top speed here) keeps birds from hovering in place, which looks wrong for birds; fish can go slower.
- **Weights decide the look**: more pull toward the middle and the heading makes tight, dense murmurations; more room and less pull make loose, drifting groups.
- **Libraries**: p5.js and Processing ship classic flocking examples; game engines and three.js do it in 3D. GSAP and Framer Motion animate fixed paths, not agents, so flocking is written by hand or taken from a simulation library.
- **Phones** fly about half as many birds, which keeps the frame time low and the small stage readable.
- **Reduced motion**: show the flock still. Because the demo flies three seconds before its first picture, the still frame shows real flocks instead of scattered birds.

## See also
- [Canvas Particle Effect](../canvas-particle-effect/) — dots that drift and react to the pointer, without following each other
- [Flow Field](../../07-ambient-background/flow-field/) — particles that ride invisible currents instead of their neighbors
- [GPGPU Particle System](../gpgpu-particle-system/) — tens of thousands of particles moved on the graphics chip
- [Game of Life](../../07-ambient-background/game-of-life/) — cells on a grid that live and die by their neighbors
