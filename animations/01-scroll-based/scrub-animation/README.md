# Scrub Animation

[Live demo](index.html)

## What it is

An animation with no duration and no playback. Every scroll offset maps to exactly one frame, computed from a single `0–1` progress value derived from `scrollTop` — so scrolling backward does not "reverse" anything, it simply seeks to an earlier position. The demo makes that literal: a flight path is drawn in full up front, progress paints a trail along it, and a frame counter and seek bar report the playhead. Because the whole route is visible at once, you can always see where the current frame sits inside the animation.

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

Nothing here is time-based, which is why the Seek slider in the panel produces identical frames without any scrolling at all — it just writes `scrollTop` and lets the same code run. Scroll is one input to a position, not a trigger for playback.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Scroll budget | `3 × stage height` | How much scrolling the animation is spread across. Longer = finer control, slower to traverse |
| `FRAMES` | 120 | Purely a readout, to make "one offset = one frame" concrete |
| Easing | linear | Curve applied to progress. Linear is 1:1 with scroll; anything else redistributes the frames |
| Sample offset | 1.5px | Distance either side of the playhead used to derive heading. Larger = smoother, less responsive banking |

## Production notes

- **Scrub is a position, not a playback.** The mental model that causes bugs is treating scroll as a *play* trigger and then trying to reverse it. Compute state from progress every frame and reversal is free — there is no direction to track and no animation object to rewind.
- **Never gate the update on a state.** Skipping the calculation when the section is "inactive" leaves whatever value it stopped on. Clamping progress to `0–1` instead means the frame resolves correctly no matter how the reader arrived, including jumping straight to the end.
- **Give the reader the whole timeline.** The failure mode of an abstract scrubbed scene is that the viewer cannot tell where they are or how much is left, so the motion reads as noise. Drawing the full route up front and filling it in turns the animation into its own progress bar.
- **Keep layout reads out of the frame loop.** `getTotalLength()`, `scrollHeight` and `clientHeight` are measured once and refreshed on resize. Reading them per frame forces a synchronous reflow on every scroll event.
- **Library equivalents.** GSAP ScrollTrigger with `scrub: true` is the production standard, and `scrub: 0.5` adds a smoothing lag that makes wheel-notch scrolling feel less stepped. Framer Motion's `useScroll` + `useTransform` is the React equivalent; both are wrappers over exactly this progress-to-value mapping.
- **Accessibility.** Nothing autoplays, so this is direct manipulation rather than imposed motion. Under `prefers-reduced-motion: reduce` the demo drops the decorative glow and keeps the mapping, since removing it entirely would leave the control inert rather than calmer.

## See also

- [ScrollTrigger Animation](../scroll-trigger/) — the broader trigger lifecycle this pattern sits inside.
- [Pin Animation](../pin-animation/) — a complementary pattern where content pins and advances in discrete steps rather than scrubbing continuously.
- [Progress Bar](../progress-bar/) — the same `scrollTop / maxScroll` value, used as an indicator instead of a driver.
