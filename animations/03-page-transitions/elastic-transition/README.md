# Elastic Transition

## What it is
An elastic transition slides the new page in so that it goes a little past its place and springs back before settling, instead of easing to a stop. The overshoot gives the movement weight, as if the page were pulled into place by a rubber band. The bounce can be planned ahead as a fixed path, which is cheap, or worked out live by simulating a spring, which feels physical.

## When to use it
- Playful, characterful interfaces where motion is part of the personality
- Panels, cards, and pages that slide in and should feel physical rather than mechanical
- Confirmation or arrival moments where a small bounce signals "landed"
- Cases where a gesture may be interrupted — a live spring reacts to interruption, a keyframe cannot

## How it works
This demo offers two ways to bounce. The planned path writes a `@keyframes` rule at runtime whose intermediate percentages push past the endpoint before returning, with the overshoot amount set by Bounce size. The live spring integrates an actual spring each frame: force equals `-stiffness × displacement − damping × velocity`, and the loop runs until both position and velocity fall below a threshold.

```js
function doSpring(o, n) {
  let pos = 100, vel = 0, target = 0;            // start off-screen right
  let lastTime = null;
  function tick(now) {
    if (!lastTime) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    const f = -stiffness * (pos - target) - damping * vel;  // Hooke's law + damping
    vel += f * dt;
    pos += vel * dt;
    n.style.transform = `translateX(${pos.toFixed(2)}%)`;
    if (Math.abs(pos - target) < 0.5 && Math.abs(vel) < 0.5) {
      n.style.transform = '';                    // settled — clean up
    } else {
      requestAnimationFrame(tick);
    }
  }
  requestAnimationFrame(tick);
}
```

The `dt` is clamped to 50ms so a dropped frame or a backgrounded tab cannot inject a huge time step that would make the spring explode. On the demo page, Speed and Bounce size set both ways of bouncing: the planned path's length (1400, 900 or 550ms) and overshoot (30, 60 or 100), or the live spring's stiffness (70, 180 or 500) and damping. The damping values were found by running this loop at 60 frames a second, so the spring goes about as far past its place as the planned path does (about 3.6%, 7.2% and 12% of the width). Moving the spring one step per frame calms it more than the usual spring formula expects, so the values were measured rather than worked out.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| How it bounces | Planned path | A planned path plays a bounce decided in advance, which is cheap; a live spring works out the movement on every frame, which feels physical and can react to interruptions |
| Bounce size | Medium | How far the page goes past its place before settling; with a live spring, a bigger bounce means less damping, so it swings for longer |
| Speed | Normal | How quickly it settles: on the planned path slow is 1400ms, normal 900ms and fast 550ms; with a live spring, a faster speed is a stiffer spring |

## Production notes
- **Stiffness and damping interact.** Below critical damping (`damping < 2√stiffness`) the spring oscillates; at or above it, it eases in without bounce. Tune the pair together — raising stiffness usually needs more damping to stay tasteful.
- **Clamp the time step.** Integrating with the raw frame delta is the classic spring bug: one long frame and `pos` shoots to infinity. The `Math.min(dt, 0.05)` clamp is not optional.
- **Frame rate.** The demo moves its spring one step per frame, so how far it bounces depends on the frame rate: at 30 frames a second the small bounce hardly shows, and at 120 it is a little larger. A spring that steps by time instead — fixed small steps, as many as the time that has passed needs — bounces the same at any frame rate.
- **CSS keyframe overshoot can clip.** If a page translates fully to its edge before the bounce completes, the overshoot slides content out of the visible bounds. Reserve a little slack or let the container overflow during the animation.
- **Library equivalents.** Framer Motion and React Spring take `stiffness`/`damping` directly and handle interruption for you — reach for them rather than hand-rolling the integrator in production. GSAP's `elastic.out` easing approximates the CSS-keyframe feel. CSS `linear()` easing can now encode a sampled spring curve without JavaScript at all.

## See also
- [Slide Transition](../slide-transition/) — the plain slide this adds a spring to
- [Zoom Transition](../zoom-transition/) — pages move in depth instead
- [FLIP Technique](../flip-technique/) — elements glide to their new places
- [Morph Transition](../morph-transition/) — a shape changes between pages
