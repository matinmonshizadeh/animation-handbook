# SVG Line Draw on Scroll

[Live demo](index.html)

## What it is

A scroll-drawn line is a long winding route that draws itself as you scroll down it, like a journey being traced on a map. Labeled stops along the way pop in as the line reaches them, and scrolling back up erases the line again. A faint dashed copy of the route shows where it is heading.

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
const p     = ease(clamp(stage.scrollTop / maxScroll, 0, 1));   // Feel: p for Even, 1 - (1 - p)^3 for Smooth
const drawn = Math.min(LEN, LEN * p / COMPLETE_AT);          // COMPLETE_AT below 1 finishes before the scroll does
path.style.strokeDashoffset = LEN - drawn;                   // reveal the traveled portion
```

`COMPLETE_AT` is 1 by default, so the line finishes as the scroll does and its tip stays inside the box while it is drawn with Even (Smooth draws ahead early in the scroll). A smaller value finishes the line earlier: the rest of the scroll then shows the finished route, but the tip runs ahead of the box, because the route is many boxes tall.

Waypoints are placed at known fractions of the path, so their positions and trigger points are computed once from those fractions — never per scroll event:

```js
// at init: position each waypoint and store its length threshold and where its dot sits in the scrolling content
wp.len = LEN * wp.fraction;
const pt = path.getPointAtLength(wp.len);
wp.group.setAttribute('transform', `translate(${pt.x} ${pt.y}) scale(${k})`);
wp.y = svgTop + pt.y / k;

// per frame: two cheap comparisons, class toggled only when the state changes
const on = drawn >= wp.len && wp.y - 16 < scrollTop + boxHeight;
if (on !== wp.on) { wp.on = on; wp.group.classList.toggle('on', on); }
```

Each stop is also scaled by `k`, which is 600 divided by the drawing's width on screen, so its dot and labels keep the same size on every screen while the route itself scales.

A stop also waits until it has come into view, meaning its top edge is above the bottom edge of the box. The route is many boxes tall, so the line can be drawn well ahead of the box, and a stop that popped below the bottom edge would pop where nobody can see it; this way its pop plays as it scrolls in. A still picture is the same either way, because a stop that is below the box cannot be seen.

The pop itself is CSS — `.on` transitions the waypoint from `scale(.6)` and `opacity: 0` to full size, and scrolling back past a waypoint removes the class so it un-pops. After a jump — Back to top, Play starting again from the top, or any move of more than half a box in one frame — the transition is switched off for that one update, so no stop fades out after the line that led to it has gone. Progress is clamped, never gated: jumping straight to the bottom draws the full route, returning to the top erases it, and there is no state to get stuck in between. A faint dashed copy of the path sits underneath the drawing stroke, so the reader always sees where the route is going before the line gets there.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Feel | Even | Even keeps the tip of the line level with your scroll; Smooth draws quickly at first and slows toward the end |
| Shows the stops | on | Five labeled stops pop in as the line reaches them and hide again when you scroll back |
| Line finishes | At the end | How far through the scrolling the line is complete: early at 70%, near the end at 85% and at the end at 100%; finishing early shows the whole route before you reach the bottom |

## Production notes

- **Measure once.** `getTotalLength()` forces geometry work; calling it (or reading `scrollHeight`) inside the scroll handler causes layout thrashing. Cache the length and max scroll at init, refresh on debounced resize, and let the per-frame work be pure arithmetic plus one style write.
- **Never put a CSS transition on a property you write every frame.** `stroke-dashoffset` is set on each animation frame; adding `transition: stroke-dashoffset ...` on top makes the browser animate toward a target that moves every 16 ms — the line lags behind the scroll and smears. Transitions belong on state changes (the waypoint pop), not on scrubbed values.
- **`pathLength="1"` skips measuring entirely.** Setting the attribute `pathLength="1"` on the path lets you use `stroke-dasharray: 1` and write `stroke-dashoffset = 1 - p` directly — no `getTotalLength()` call at all. This demo measures because the waypoints need real coordinates anyway.
- **`vector-effect: non-scaling-stroke`** keeps the stroke width constant if the SVG scales responsively; without it, a 3px stroke on a narrow phone render can thin to a hairline.
- **Label legibility.** `paint-order: stroke` with a background-colored stroke on the `<text>` draws an outline underneath the glyphs, so labels stay readable where the accent line passes behind them — cheaper and crisper than a filter or a backing rect.
- **Library equivalents.** GSAP's DrawSVGPlugin with ScrollTrigger (`scrub: true`) is the production standard; Framer Motion's `useScroll` + `pathLength` motion value is the React equivalent. Both wrap exactly this dashoffset mapping.

## See also

- [Scrub Animation](../scrub-animation/) — a short pinned path moves as you scroll; here a long path lives in the content
- [SVG Path Animation](../../06-3d-advanced/svg-path-animation/) — drawings trace themselves over time instead of with the scroll
- [Scrollytelling](../scrollytelling/) — a picture beside the text changes as a story scrolls by
