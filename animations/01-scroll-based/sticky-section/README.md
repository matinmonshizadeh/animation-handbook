# Sticky Section

## What it is
A sticky section pins an entire section to the viewport for an extended scroll distance while its interior morphs through a sequence of states. The pin is created with `position: sticky` inside a tall wrapper; scroll position within that wrapper becomes a 0–1 timeline that the contents are scrubbed against. This demo holds a two-column section in place and cycles it through four labelled states, with a segmented progress readout.

## When to use it
- Multi-step explanations where one frame should stay put while its content advances
- Feature tours that swap illustration and copy without the viewport moving
- Product pages that "hold" a hero while walking through its states
- Any sequence where pinning the frame keeps the reader oriented better than scrolling new sections in

## How it works
The wrapper is four stage-heights tall; the inner section is `position: sticky; top: 0`, so it stays fixed while the wrapper scrolls past. Progress is `(scrollTop − pinStart) / (pinHeight − stageHeight)`, clamped to 0–1. Multiplying by the state count gives the active state index and the fraction within it:

```js
const pinStart = wrap.offsetTop, pinH = wrap.offsetHeight;
const p = clamp((st - pinStart) / (pinH - stageH), 0, 1);      // 0..1 while pinned
const si = Math.min(Math.floor(p * 4), 3), sf = p * 4 - si;    // state index + fraction

states.forEach((s, i) => s.classList.toggle('visible', i === si));
illus.forEach((il, i) => il.classList.toggle('visible', i === si));
for (let i = 0; i < 4; i++) {                                    // segmented progress
  const bar = document.getElementById('sg' + i);
  bar.style.width = i < si ? '100%' : i === si ? Math.round(sf * 100) + '%' : '0%';
}
```

The three lifecycle phases — `approaching`, `stuck`, `released` — come from comparing `scrollTop` against the pin's start and end. States themselves crossfade via a CSS `opacity` transition on `.visible`; only the segment bars use the raw fraction, so the section reads as pinned frames advancing rather than a continuous scrub.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Wrapper height | 4 × stage height | Total scroll budget; more height = slower state changes |
| State count | 4 | `p × count` maps progress to states; each owns `1 / count` of the range |
| Progress `p` | derived | 0 at pin start, 1 when the pin releases |
| State transition | 0.5s opacity | Crossfade between states; illustration column uses 0.6s |

## Production notes
- **Pins the section, not one element**: this is the key distinction from pin-animation. Here the whole section sticks and its *contents* change; a pin-animation pins one element while siblings scroll past it.
- **Height defines the budget**: the amount of scroll the pin lasts is set entirely by the wrapper's height. Want a longer sequence? Make the wrapper taller — no JS change needed.
- **Sticky beats JS pinning**: `position: sticky` is handled by the browser's compositor and won't jitter the way `position: fixed` toggling in a scroll handler can. Reserve JS for reading progress, not for holding the element.
- **State boundaries are thresholds, not events**: because the state index comes from `floor(p × count)`, crossing a boundary is just the fraction rolling over — no discrete event to miss if a scroll frame is dropped.
- **Reduced motion**: state and illustration transitions are disabled under `prefers-reduced-motion`; the content still switches, it just cuts instead of fades.
- **Library equivalents**: GSAP ScrollTrigger with `pin: true` and a `scrub` timeline is the production-grade version and adds easing across states; Framer Motion pairs a sticky wrapper with `useScroll({ offset })` to derive the same progress value.

## See also
- [Pin Animation](../pin-animation/) — pinning a single element while siblings pass
- [Scrub Animation](../scrub-animation/) — tying a timeline continuously to scroll
- [Scrollytelling](../scrollytelling/) — a sticky visual driven by scrolling narrative
- [Section Wipe](../section-wipe/) — stacked sticky sections that cover one another
