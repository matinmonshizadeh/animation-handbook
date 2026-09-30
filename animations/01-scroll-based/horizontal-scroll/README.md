# Horizontal Scroll

[Live demo](index.html)

## What it is

Horizontal scroll turns ordinary downward scrolling into sideways movement. A row of panels sits in a long strip inside a tall section; while you scroll through that section, it holds still and the strip slides left, one panel after another, and then the page carries on. You never have to scroll sideways yourself.

## When to use it

- Portfolio project showcases where each panel is a distinct featured work
- Feature walkthroughs where lateral movement reinforces a "moving through" narrative
- Timelines, process flows, or numbered steps that benefit from a left-to-right reading order
- Any context where you want horizontal navigation without requiring users to scroll horizontally or use arrow keys

## How it works

Two formulas do all the work — pin distance and translateX offset.

**Pin section height** determines how much vertical scroll budget exists:

```css
.stage { container-type: size; }                /* 100cqh is one stage height */
#pin-section { height: calc(100cqh * var(--panels)); }
/* 5 panels × a 380px stage = 1900px tall section */
```

**Track sizing** — the track must be explicitly wider than its container, and each panel must reference the track's width, not the stage's:

```css
#h-track { display: flex; width: calc(var(--panels) * 100%); }
/* 100% here = #pin-inner = stage width; 5 × 100% = 5× stage width */

.panel  { flex: 0 0 calc(100% / var(--panels)); }
/* 100% of track ÷ 5 = exactly one stage-width per panel */
```

**Translation on scroll:**

```js
const budget   = pinSection.offsetHeight - stage.clientHeight;
const progress = clamp((stage.scrollTop - pinSection.offsetTop) / budget, 0, 1);
const maxShift = track.offsetWidth - stage.clientWidth;
track.style.transform = `translateX(${-progress * maxShift}px)`;
```

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Number of panels | 5 | Each panel is one box wide, and the strip is as wide as all of them together |
| Pinned section height | Five box heights | The strip slides while the box scrolls through it; a taller section makes each panel pass more slowly |
| Lead-in and lead-out | Six tenths of a box height each | The space before and after the section, so you see it arrive, hold still and let go |

## Production notes

- **The track must have an explicit width.** Without `width: calc(var(--panels) * 100%)`, the track's `offsetWidth` equals the containing block's width. Then `maxShift = track.offsetWidth - stage.clientWidth = 0` and `translateX` is always zero — the track never moves. This is the single most common failure mode for this pattern.
- **Panel flex-basis must reference track width, not stage width.** `flex: 0 0 100%` where 100% resolves to the container (the track, not the stage) works correctly only after the track has its explicit width. If the track has no explicit width, the flex-basis also collapses.
- **No `overflow: hidden` between the scroll container and the sticky inner.** `position: sticky` stops working if any ancestor between the sticky element and the scroll container has `overflow` set to anything other than `visible`. `#pin-inner` is sticky inside `#pin-section` inside `.stage` — none of the intermediate elements should have `overflow: hidden`.
- **The scroll container needs `position: relative`.** `pinSection.offsetTop` is measured against the nearest *positioned* ancestor, not the nearest scrolling one. If the scroll container is statically positioned, `offsetTop` silently resolves against `<body>` and includes the page header, so `progress` starts late and saturates at 1 before the pin releases — the last panel is never reached.
- **In a column flex layout, `flex: 1` overrides `height`.** When a side panel stacks below the scroll container on phones, `flex: 1 1 0%` makes the stage's flex-basis its main size, so the fixed `height` is ignored and the stage grows to its full content height. It stops being a scroll container, `scrollTop` is permanently 0, and the whole effect dies. Reset it to `flex: none` inside the mobile media query.
- **`progress` must be computed from `stage.scrollTop`, not `window.scrollY`.** The scroll container is the internal stage element. Using `window.scrollY` always returns 0.
- **GSAP ScrollTrigger equivalent:** `ScrollTrigger.create({ trigger, start, end, scrub: true, onUpdate: self => track.style.transform = 'translateX(...)' })`. Horizontal scroll sections also appear in Locomotive Scroll and Lenis as first-class features.
- **Mobile consideration.** The pin section is five stage heights tall: 1,500px on a 300px phone stage. Test that this feels natural on touch — the ratio of vertical scroll to horizontal travel determines perceived "resistance". Faster travel (fewer panels per px) feels lighter; slower (more panels) can feel sticky.

## See also

- [Sticky Section](../sticky-section/) — the section holds still while its content changes instead
- [Scrub Animation](../scrub-animation/) — scrolling moves a plane along its path, both ways
- [Scrollytelling](../scrollytelling/) — a picture beside the text changes as a story scrolls by
