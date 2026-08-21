# SVG Line Draw on Scroll

[Live demo](index.html)

## What it is

A long SVG path embedded in the scrolling content that draws itself with the stroke-dash trick as the reader scrolls down it. The route is part of the page — a tall, winding line you physically travel along — and labelled waypoints pop in as the drawn tip reaches them. This is the classic "journey map" storytelling pattern: hiking routes, company timelines, delivery tracking, process walkthroughs.

## When to use it

- Journey or route storytelling — travel logs, expedition maps, shipment tracking
- Timelines where each milestone should appear as the reader arrives at it
- Process explainers ("how your order gets to you") where a connecting line gives the steps a spatial order
- Long-form landing pages that need a visual spine tying sections together

## How it works

The whole effect is two stroke properties and one number. At init, measure the path once and set `stroke-dasharray` to its full length — the stroke is now a single dash exactly as long as the path, and `stroke-dashoffset` slides it into view:

```js
const LEN = path.getTotalLength();          // measure ONCE, at init and on resize
path.style.strokeDasharray = LEN;

// per scroll frame (coalesced with requestAnimationFrame):
const p     = clamp(stage.scrollTop / maxScroll, 0, 1);
const drawn = Math.min(LEN, LEN * p / COMPLETE_AT);   // finish before the scroll does
path.style.strokeDashoffset = LEN - drawn;            // reveal the travelled portion
```

Waypoints are placed at known fractions of the path, so their positions and trigger points are computed once from those fractions — never per scroll event:

```js
// at init: position each waypoint and store its length threshold
wp.len = LEN * wp.fraction;
const pt = path.getPointAtLength(wp.len);
wp.group.setAttribute('transform', `translate(${pt.x} ${pt.y})`);

// per frame: a cheap comparison, class toggled only when the state changes
const on = drawn >= wp.len;
if (on !== wp.on) { wp.on = on; wp.group.classList.toggle('on', on); }
```

The pop itself is CSS — `.on` transitions the waypoint from `scale(.6)` and `opacity: 0` to full size, and scrolling back past a waypoint removes the class so it un-pops. Progress is clamped, never gated: jumping straight to the bottom draws the full route, returning to the top erases it, and there is no state to get stuck in between. A faint dashed copy of the path sits underneath the drawing stroke, so the reader always sees where the route is going before the line gets there.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| `COMPLETE_AT` | 0.85 | Fraction of the scroll range at which the line finishes. Below 1, the route completes while the end is still in view instead of clipping at the viewport edge |
| Easing | linear | Curve applied to progress before mapping to length. Linear keeps the tip 1:1 with scroll; ease-out front-loads the draw |
| Waypoint fractions | 0.05 – 0.95 | Where along the path each marker sits and triggers, as a share of total length |
| Pop transition | 350 ms, overshoot bezier | The scale/fade on waypoint entry. Removed entirely under `prefers-reduced-motion` |
| Route height | ~2200 SVG units | How much scrolling the journey spans. Taller = slower, more deliberate travel |

## Production notes

- **Measure once.** `getTotalLength()` forces geometry work; calling it (or reading `scrollHeight`) inside the scroll handler causes layout thrashing. Cache the length and max scroll at init, refresh on debounced resize, and let the per-frame work be pure arithmetic plus one style write.
- **Never put a CSS transition on a property you write every frame.** `stroke-dashoffset` is set on each animation frame; adding `transition: stroke-dashoffset ...` on top makes the browser animate toward a target that moves every 16 ms — the line lags behind the scroll and smears. Transitions belong on state changes (the waypoint pop), not on scrubbed values.
- **`pathLength="1"` skips measuring entirely.** Setting the attribute `pathLength="1"` on the path lets you use `stroke-dasharray: 1` and write `stroke-dashoffset = 1 - p` directly — no `getTotalLength()` call at all. This demo measures because the waypoints need real coordinates anyway.
- **`vector-effect: non-scaling-stroke`** keeps the stroke width constant if the SVG scales responsively; without it, a 3px stroke on a narrow phone render can thin to a hairline.
- **Label legibility.** `paint-order: stroke` with a background-colored stroke on the `<text>` draws an outline underneath the glyphs, so labels stay readable where the accent line passes behind them — cheaper and crisper than a filter or a backing rect.
- **Library equivalents.** GSAP's DrawSVGPlugin with ScrollTrigger (`scrub: true`) is the production standard; Framer Motion's `useScroll` + `pathLength` motion value is the React equivalent. Both wrap exactly this dashoffset mapping.

## See also

- [Scrub Animation](../scrub-animation/) — a short *pinned* path used as a seek bar while content scrolls past it; this entry is the inverse layout — a long path living *in* the content, drawn as you travel down it.
- [SVG Path Animation](../../06-3d-advanced/svg-path-animation/) — the same dash trick driven by time instead of scroll.
- [Scrollytelling](../scrollytelling/) — the narrative framework this pattern usually lives inside.
