# Scrub Animation

[Live demo](index.html)

## What it is

A scrub animation has no play button and no length in seconds: how far you have scrolled decides exactly which moment of the animation shows, like dragging the playhead of a video. Scroll down and it moves forward; scroll back and it moves back. The demo draws the whole flight route up front and fills it in as the plane flies, with a bar and a frame count underneath, so you can always see where you are.

## When to use it

- Product reveals where the reader controls the pace instead of watching a clip
- Technical explainers — mechanisms, architecture diagrams — that reward stopping mid-way and inspecting
- Apple-style feature walkthroughs where each scroll increment advances a story
- Any animation that must be perfectly reversible and legible at every intermediate state

## How it works

Everything comes from one number. Progress is scroll position over scrollable distance, clamped:

```js
const p = clamp(stage.scrollTop / maxScroll, 0, 1);
const e = ease(p);                 // the curve is optional; the mapping is the point
```

Position and heading are both read from the path itself, so the drawn trail and the moving object can never disagree about where the current frame is:

```js
const d  = pathLength * e;
const pt = rail.getPointAtLength(d);
// heading from two samples either side, so the object banks into its turns
const a  = rail.getPointAtLength(d + 1.5), b = rail.getPointAtLength(d - 1.5);
const angle = Math.atan2(a.y - b.y, a.x - b.x) * 180 / Math.PI;

flyer.setAttribute('transform', `translate(${pt.x} ${pt.y}) rotate(${angle})`);
trail.style.strokeDashoffset = pathLength - d;   // elapsed portion of the route
```

The trail uses the standard line-drawing trick: `stroke-dasharray` is set to the full path length, and `stroke-dashoffset` counts down from it, revealing the stroke as progress advances.

Nothing here is time-based: the Play button under the demo only scrolls the box at a steady speed, and the same code draws each frame. Scroll is one input to a position, not a trigger for playback.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Feel | Even | How scroll turns into progress: even follows the scroll one to one; gentle eases in and out; smooth slows toward the end; slow start begins slowly and speeds up |

## Production notes

- **Scrub is a position, not a playback.** The mental model that causes bugs is treating scroll as a *play* trigger and then trying to reverse it. Compute state from progress every frame and reversal is free — there is no direction to track and no animation object to rewind.
- **Never gate the update on a state.** Skipping the calculation when the section is "inactive" leaves whatever value it stopped on. Clamping progress to `0–1` instead means the frame resolves correctly no matter how the reader arrived, including jumping straight to the end.
- **Give the reader the whole timeline.** The failure mode of an abstract scrubbed scene is that the viewer cannot tell where they are or how much is left, so the motion reads as noise. Drawing the full route up front and filling it in turns the animation into its own progress bar.
- **Keep layout reads out of the frame loop.** `getTotalLength()`, `scrollHeight` and `clientHeight` are measured once and refreshed on resize. Reading them per frame forces a synchronous reflow on every scroll event.
- **Library equivalents.** GSAP ScrollTrigger with `scrub: true` is the production standard, and `scrub: 0.5` adds a smoothing lag that makes wheel-notch scrolling feel less stepped. Framer Motion's `useScroll` + `useTransform` is the React equivalent; both are wrappers over exactly this progress-to-value mapping.
- **Accessibility.** The page scrolls the box once on arrival, and not at all under `prefers-reduced-motion: reduce`; after that it moves only when the visitor scrolls, so this is direct manipulation rather than imposed motion. Under reduced motion the demo drops the decorative glow and keeps the mapping, since removing it entirely would leave the control inert rather than calmer.

## See also

- [ScrollTrigger Animation](../scroll-trigger/) — animations start, follow and pin at set scroll points
- [Pin Animation](../pin-animation/) — one part holds still while the page scrolls past
- [Progress Bar](../progress-bar/) — the same scroll progress, shown as a filling bar
