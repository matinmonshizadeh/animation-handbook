# ScrollTrigger Animation

[Live demo](index.html)

## What it is

ScrollTrigger is not an animation type — it is a mechanism that fires animations at precise scroll positions. It defines scroll zones and exposes a lifecycle: `onEnter` (zone enters viewport), `onLeave` (zone exits at top), `onEnterBack` (zone re-enters from top on scroll-up), `onLeaveBack` (zone exits at bottom on scroll-up). This demo implements the concept in vanilla JS from scroll position alone, showing four core behaviors: fade on enter, scrub with scroll, pin and scrub, and snap to points. In production, GSAP's ScrollTrigger plugin handles all of this.

## When to use it

- Any element that should animate exactly once as it enters the viewport
- Product reveals, feature lists, and section transitions requiring scroll-coordinated timing
- Marketing pages that must remain accessible without JavaScript by having logical resting states
- Any scenario requiring precise callbacks at scroll boundaries, not just "is it visible?"

## How it works

Everything derives from one number: where the scroll container currently sits. Each zone reduces to three states, and the four callbacks are simply the transitions between them.

```js
// zone tops measured against the stage, cached — NOT offsetTop, see production notes
const state = i => {
  const vt = stage.scrollTop;
  if (vt + viewport <= top[i]) return 'idle';   // not reached yet
  if (vt >= top[i] + height[i]) return 'past';  // scrolled beyond
  return 'active';
};
```

A change of state is a callback. Which one depends on the direction the state moved:

```js
if (s !== prev[i]) {
  const ev = s === 'active' ? (prev[i] === 'idle' ? 'onEnter' : 'onEnterBack')
                            : (s === 'past'       ? 'onLeave' : 'onLeaveBack');
  log(ev); prev[i] = s;
}
```

Scrubbing uses the same scroll position, normalised to `0–1` and clamped, then applied directly to transforms. Because it is clamped rather than gated on the active state, it resolves to 0 before the zone and 1 after it — so a zone you skipped past still ends up in its finished state:

```js
const p = clamp((stage.scrollTop - top[i]) / (height[i] - viewport * 0.5), 0, 1);
swatch.style.transform = `rotate(${p * 180}deg) scale(${lerp(1, 1.3, p)})`;
swatch.style.filter    = `hue-rotate(${p * 120}deg)`;
```

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Zone start | zone top, measured against the stage | Where the trigger fires. Must be in the scroll container's coordinate space, not `offsetTop` |
| Zone height | 550px | The span over which a zone counts as active |
| Scrub start | `top 80%` | Zone top at 80% down the viewport — just after the section appears |
| Scrub end | `top 20%` | Zone top near the viewport top; the animation finishes as the section settles |
| Run-out | one viewport | Trailing space so the final zone can exit and fire `onLeave` |

## Production notes

- **GSAP ScrollTrigger** is the production standard. It handles scroll direction, pinning, scrubbing, snapping, and lifecycle callbacks with a clean declarative API. The vanilla JS approach here is educational — it replicates the underlying mechanics without GSAP's optimizations.
- **`IntersectionObserver` vs. scroll events.** IO is the right tool for lifecycle callbacks (enter/leave); scroll-position arithmetic is right for scrubbing. This demo derives both from scroll position so the two stay in lockstep — with IO the callback and the scrub can disagree by a frame.
- **Anchor the scrub to where the section *enters*, not to where it reaches the top.** Measuring progress as `scrollTop − zoneTop` keeps it at zero until the section's top has climbed all the way to the top of the viewport — by which point the reader has watched a full screen of it sit motionless, and the animation only plays as it leaves. That reads as a broken or badly late trigger. GSAP's default `start: "top 80%"` / `end: "top 20%"` begins just after the section appears and finishes as it settles; here that moved each trigger roughly 0.8 of a viewport earlier.
- **`offsetTop` is not in the scroll container's coordinate space.** It is measured from the nearest *positioned* ancestor, which for a plain `overflow: scroll` panel is usually `body` — so it includes every pixel of page chrome above the container, while `scrollTop` starts at zero inside it. Comparing them directly put every trigger here 109px late. Measure the zone against the container's own box instead.
- **Prime the state before logging callbacks.** Comparing the first frame's state against a `null` starting value manufactures events that never happened: this log opened claiming zone 1 had fired `onEnterBack` and zones 2–4 `onLeaveBack`, before any scrolling. Record the initial state on the first pass and only emit transitions after that.
- **Evaluate every trigger each frame, not just the active ones.** Updating a zone only while it is active leaves whatever value it happened to stop on — jump past a zone and its scrub never runs at all, and scrolling back to the top left the pinned card still reading "Step 3 of 3". Clamped progress resolves to 0 before a zone and 1 after it, so both ends settle correctly on their own.
- **Leave a run-out after the last trigger.** A final zone with nothing beneath it can never scroll past the top, so it can neither finish its scrub nor fire `onLeave` — the snap dots here were stuck at 0/5 forever. One viewport of trailing space is enough.
- **Scrub and `will-change`.** For elements that update on every scroll frame, declare `will-change: transform` before the first frame to avoid promotion jank.
- **Snap-to-point** requires detecting scroll silence. A debounce timer (100–200ms) after the last scroll event is the reliable pattern; there is no native "scroll ended" event in most browser contexts.
- **Accessibility.** `onEnter` animations should respect `prefers-reduced-motion`. In reduced-motion mode, jump elements directly to their final state at page load.

## See also

- [Scrub Animation](../scrub-animation/) — a full scrub-driven product disassembly using the same scroll-as-progress model.
- [Pin Animation](../pin-animation/) — demonstrates the "pin" behavior from the same ScrollTrigger concept.
