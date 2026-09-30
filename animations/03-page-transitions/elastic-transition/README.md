# Elastic Transition

## What it is
An elastic transition slides the new page in so that it goes a little past its place and springs back before settling, instead of easing to a stop. The overshoot gives the movement weight, as if the page were pulled into place by a rubber band. The bounce can be planned ahead as a fixed path, which is cheap, or worked out live by simulating a spring, which feels physical.

## When to use it
- Playful, characterful interfaces where motion is part of the personality
- Panels, cards, and pages that slide in and should feel physical rather than mechanical
- Confirmation or arrival moments where a small bounce signals "landed"
- Cases where a gesture may be interrupted — a live spring reacts to interruption, a keyframe cannot

## How it works
This demo offers two ways to bounce. The planned path writes a `@keyframes` rule at runtime whose intermediate percentages push past the endpoint before returning, with the overshoot amount set by Bounce size. The live spring integrates an actual spring in fixed steps of 1/120 of a second: force equals `-stiffness × displacement − damping × velocity`, each frame takes as many steps as the time that has passed needs, and the loop runs until both position and velocity fall below a threshold.

```js
const STEP = 1 / 120;                            // the spring moves in steps of 1/120 of a second
function doSpring(o, n, stiffness, damping) {    // o: the old page, n: the new page
  let pos = 100, vel = 0, target = 0;            // start off-screen right
  let before = pos, acc = 0, lastTime = null;    // acc: time the steps have yet to cover
  function tick(now) {
    if (lastTime !== null) acc += Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    let settled = false;
    for (let i = 0; acc > 0 && i < 8 && !settled; i++) {   // at most 8 steps in a frame
      const f = -stiffness * (pos - target) - damping * vel;  // Hooke's law + damping
      before = pos;
      vel += f * STEP;
      pos += vel * STEP;
      acc -= STEP;
      settled = Math.abs(pos - target) < 0.5 && Math.abs(vel) < 0.5;
    }
    if (acc > 0) acc = 0;                        // step limit reached: drop the time left
    if (settled) {
      n.style.transform = '';                    // settled — clean up
    } else {
      const shown = pos + (before - pos) * (-acc / STEP);     // the place at this frame's own time
      n.style.transform = `translateX(${shown.toFixed(2)}%)`;
      requestAnimationFrame(tick);
    }
  }
  requestAnimationFrame(tick);
}
```

A frame adds the time since the last one to `acc`, never more than 50ms, which keeps the spring from jumping ahead after a pause, a slow frame or a backgrounded tab, and then spends it in whole steps. The first frame adds nothing, because there is no earlier frame to measure from. The last step can end a little after the frame, so the page is drawn between the last two steps, at the frame's own time; a frame that fits no whole step still moves the page. On the demo page, Speed and Bounce size set both ways of bouncing: the planned path's length (1400, 900 or 550ms) and overshoot (30, 60 or 100), or the live spring's stiffness (75, 200 or 640) and damping. These values were found by running this loop, so the spring goes about as far past its place as the planned path does (about 3.6%, 7.2% and 12% of the width). Stepping the spring in whole steps calms it more than the usual spring formula expects, so the values were measured rather than worked out.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| How it bounces | Planned path | A planned path plays a bounce decided in advance, which is cheap; a live spring works out the movement in small fixed time steps, which feels physical and can react to interruptions |
| Bounce size | Medium | How far the page goes past its place before settling; with a live spring, a bigger bounce means less damping, so it swings for longer |
| Speed | Normal | How quickly it settles: on the planned path slow is 1400ms, normal 900ms and fast 550ms; with a live spring, a faster speed is a stiffer spring |

## Production notes
- **Stiffness and damping interact.** Below critical damping (`damping < 2√stiffness`) the spring oscillates; at or above it, it eases in without bounce. Tune the pair together — raising stiffness usually needs more damping to stay tasteful.
- **Clamp the time a frame adds.** One step of the raw frame delta is the classic spring bug: after one long frame `pos` shoots to infinity. Fixed steps avoid that, but the time a frame adds still needs a limit: added whole, a pause or a slow frame would make the spring jump ahead, and the bounce would be over in one frame. The 50ms clamp (`0.05` seconds in the snippet) keeps it moving on from where it was, and it also keeps a frame to a handful of steps.
- **Frame rate.** The demo moves its spring in fixed steps of 1/120 of a second, as many as the time that has passed needs, so it bounces the same at any frame rate. A spring that takes one step per frame does not: at 30 frames a second a small bounce hardly shows, and at 120 it is a little larger. Draw the page between the last two steps, or a frame that fits no whole step shows the spring standing still.
- **CSS keyframe overshoot can clip.** If a page translates fully to its edge before the bounce completes, the overshoot slides content out of the visible bounds. Reserve a little slack or let the container overflow during the animation.
- **Library equivalents.** Framer Motion and React Spring take `stiffness`/`damping` directly and handle interruption for you — reach for them rather than hand-rolling the integrator in production. GSAP's `elastic.out` easing approximates the CSS-keyframe feel. CSS `linear()` easing can now encode a sampled spring curve without JavaScript at all.

## See also
- [Slide Transition](../slide-transition/) — the plain slide this adds a spring to
- [Zoom Transition](../zoom-transition/) — pages move in depth instead
- [FLIP Technique](../flip-technique/) — elements glide to their new places
- [Morph Transition](../morph-transition/) — a shape changes between pages
