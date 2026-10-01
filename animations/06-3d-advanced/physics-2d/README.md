# 2D Physics

## What it is
2D physics moves objects the way real ones fall, bounce and settle, in small steps of simulated time. Each step adds gravity to every ball's speed, finds the balls that touch each other or a wall, and pushes them apart just enough to stop them sinking in, keeping part of their speed as a bounce. Sixty steps a second of those few rules are enough for balls to bounce, roll to a stop and pile up, and to be picked up and thrown.

## When to use it
- Playful hero sections and intros that react to every click or tap
- Empty states, 404 pages and waiting screens that give visitors something to play with
- Games, toys and product pages where people throw, stack or knock things over
- Teaching pages about gravity, bounce and friction

## How it works
**Fixed steps.** A physics step must always be the same length, or bounces and piles behave differently on every screen. The loop keeps the time not yet stepped in `behind` and runs as many 1/60 s steps as it holds, as Cloth Simulation does; slow motion adds only a third of the time:

```js
const FRAME = 1000 / 60;                       // one step, in ms
function loop(ts) {
  raf = requestAnimationFrame(loop);
  if (lastT === null) { lastT = ts; return; }  // the first frame after a start only takes the time
  const dt = ts - lastT; if (dt < 16) return;  // draw at most once per 16 ms
  lastT = ts;
  const ms = Math.min(dt, 50) * (slow ? 1 / 3 : 1);
  if (awake) {
    behind += ms;
    for (let n = 0; behind >= FRAME - 1 && n < 3; n++) { step(); behind -= FRAME; }
  }
  fade(ms); draw();
  if (!awake && nothingFades()) { cancelAnimationFrame(raf); raf = null; }   // still: stop drawing
}
```

**Contacts.** Each step adds gravity, then lists every touching pair and every ball touching a wall. A contact records its direction `n` and, if the two close faster than 1 px a step, the speed they should part with: the bounciness times the closing speed. Slower contacts get no bounce, so resting balls stay still instead of trembling:

```js
const touch = (a, b, nx, ny) => {               // n points from a to b; a wall is a body that never moves
  const vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;   // negative: they are closing
  contacts.push({ a, b, nx, ny, t: vn < -1 ? -E * vn : 0, j: 0, jt: 0 });
};
```

**Pushes shared through a pile.** Eight passes over all contacts each add the push that brings a pair to its parting speed, keeping a running total that may never turn into a pull. A ball deep in a pile is pushed by several neighbors at once, and the passes let the pushes settle between them. Friction works the same way along the contact, limited to half the push, which is what lets the balls stack instead of sliding apart:

```js
for (let pass = 0; pass < 8; pass++) for (const c of contacts) {
  const { a, b, nx, ny } = c, ia = a.im, ib = b.im, s = ia + ib;      // im: 1 / mass (0 for a wall or a held ball)
  const j = Math.max(0, c.j + (c.t - ((b.vx - a.vx) * nx + (b.vy - a.vy) * ny)) / s), dj = j - c.j; c.j = j;
  const f = 0.5 * c.j, jt = clamp(c.jt - ((b.vx - a.vx) * -ny + (b.vy - a.vy) * nx) / s, -f, f), dt = jt - c.jt; c.jt = jt;
  const px = dj * nx - dt * ny, py = dj * ny + dt * nx;                  // the push plus the friction
  a.vx -= px * ia; a.vy -= py * ia; b.vx += px * ib; b.vy += py * ib;
}
```

Then every ball moves by its speed (never more than about one radius a step, so a fast ball cannot pass through another), three passes ease apart the overlaps that are left, and every ball is kept inside the box. A ball's mass grows with its area, so a big ball shoves a small one aside.

**Sleeping.** When no ball has moved faster than about 0.14 px a step for 45 steps (three quarters of a second), every speed is set to zero and the loop stops drawing. A new ball, a throw, a removed ball or a new gravity wakes it again.

**Throwing.** Pressing picks up the nearest ball in reach, which is its radius plus 8px and never less than a 44px circle, so a small ball is still easy to catch with a finger. A held ball follows the pointer, nothing pushes it, and it pushes the others. Pointer moves give the pointer's speed in pixels per 1/60 s, smoothed over the last few moves; letting go throws the ball with that speed if the pointer was still moving in the last 80 ms.

**Reduced motion.** Nothing falls on screen. The steps of a drop or throw run at once, out of sight, until everything is still, and the new ball fades in where it came to rest:

```js
function settle() { awake = true; calm = 0; for (let i = 0; i < 900 && awake; i++) step(); awake = false; }
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Gravity | Earth | How hard the balls are pulled down. Earth adds the box's height divided by 1,000 to a ball's downward speed every 60th of a second, so a ball falls the whole box in about three quarters of a second; the Moon is a fifth of that and Heavy twice as much |
| Bounciness | Medium | The share of its closing speed a ball keeps after a hit: low is 0.2, medium 0.5 and high 0.8; a hit slower than 1 pixel per 60th of a second does not bounce |
| Ball sizes | All the same | One radius for every ball (5.5% of the box's shorter side, between 12 and 22 pixels), or a mix from 0.6 to 1.4 times it, heavier by area |
| Shows the speed | off | An arrow on each moving ball, 6 pixels long for every pixel it moves in a 60th of a second, at most three radii |

## Production notes
- **Libraries**: Matter.js handles circles, boxes, polygons, joints and sleeping in 2D; Planck.js is a port of Box2D, the engine behind many games; Rapier (Rust compiled to WebAssembly) does 2D and 3D at higher body counts. Reach for one as soon as you need boxes, polygons or hinges. GSAP and Framer Motion animate toward set values, and their spring and bounce eases fake one landing, not a pile.
- **Circles only**: this demo has no turning bodies; the spot on each ball turns with its sideways speed, which reads as rolling. Boxes and polygons need angular speed, contact points and a polygon collision test.
- **Fixed steps**: scaling a step by the frame time makes bounces higher on slow screens and piles jitter. Step by a fixed 1/60 s from an accumulator and cap the steps per frame (3 here), so a slow device slows the physics instead of falling behind.
- **Tunneling**: a ball that moves more than its own size in one step can jump through another. The demo caps the speed at about one radius a step; engines use continuous collision tests or smaller steps.
- **Sleeping** stops the work once everything is still, which saves battery on phones; wake the bodies on any input.
- **Every pair is checked**: fine for the 40 balls the demo keeps (24 on phones, screens up to 600px wide or 500px tall); for hundreds, sort the bodies into a grid first.
- **Touch**: the canvas turns off the browser's touch scrolling (`touch-action: none`), so a drag moves a ball instead of the page; the page still scrolls from outside the box.

## See also
- [Cloth / Soft-Body Simulation](../cloth-simulation/) — physics in fixed steps, with points joined by links
- [Bounce In](../../02-entrance-and-exit/bounce-in/) — one springy landing, made with keyframes instead of physics
- [Flocking](../flocking/) — another simulation where a few simple rules make lifelike motion
