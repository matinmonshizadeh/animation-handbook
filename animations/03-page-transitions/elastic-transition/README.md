# Elastic Transition

## What it is
An elastic transition overshoots its target and settles back with a spring-like wobble instead of easing smoothly to a stop. The overshoot gives the motion a sense of weight and momentum, as if the page were pulled into place by a rubber band. It can be baked into CSS keyframes for cheapness, or simulated live in JavaScript for physical accuracy.

## When to use it
- Playful, characterful interfaces where motion is part of the personality
- Panels, cards, and pages that slide in and should feel physical rather than mechanical
- Confirmation or arrival moments where a small bounce signals "landed"
- Cases where a gesture may be interrupted — a live spring reacts to interruption, a keyframe cannot

## How it works
This demo offers two modes. The CSS mode writes a `@keyframes` rule at runtime whose intermediate percentages push past the endpoint before returning, with the overshoot amount scaled by a control. The JS mode integrates an actual spring each frame: force equals `-stiffness × displacement − damping × velocity`, and the loop runs until both position and velocity fall below a threshold.

```js
function doSpring(prev, next) {
  let pos = -100, vel = 0, target = 0;           // start off-screen right
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

The `dt` is clamped to 50ms so a dropped frame or a backgrounded tab cannot inject a huge time step that would make the spring explode. Recorded positions are plotted to a small canvas so the overshoot-and-settle curve is visible.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Mode | CSS keyframes | Keyframes are pre-baked and cheap; JS spring is physical and interruptible |
| Overshoot intensity (CSS) | 60% | How far past the endpoint the keyframes push before settling |
| Duration (CSS) | 900ms | Total keyframe length; longer lets more oscillations read |
| Stiffness (JS) | 180 | Spring constant. Higher snaps to target faster with more overshoot |
| Damping (JS) | 20 | Resistance. Low damping oscillates for longer; high damping settles flat |

## Production notes
- **Stiffness and damping interact.** Below critical damping (`damping < 2√stiffness`) the spring oscillates; at or above it, it eases in without bounce. Tune the pair together — raising stiffness usually needs more damping to stay tasteful.
- **Clamp the time step.** Integrating with the raw frame delta is the classic spring bug: one long frame and `pos` shoots to infinity. The `Math.min(dt, 0.05)` clamp is not optional.
- **CSS keyframe overshoot can clip.** If a page translates fully to its edge before the bounce completes, the overshoot slides content out of the visible bounds. Reserve a little slack or let the container overflow during the animation.
- **Library equivalents.** Framer Motion and React Spring take `stiffness`/`damping` directly and handle interruption for you — reach for them rather than hand-rolling the integrator in production. GSAP's `elastic.out` easing approximates the CSS-keyframe feel. CSS `linear()` easing can now encode a sampled spring curve without JavaScript at all.

## See also
- [Slide Transition](../slide-transition/) — the linear slide this adds spring physics to
- [Zoom Transition](../zoom-transition/) — another transform that benefits from overshoot
- [FLIP Technique](../flip-technique/) — pairs a springy easing with measured layout deltas
- [Morph Transition](../morph-transition/) — shape change that also reads as physical
