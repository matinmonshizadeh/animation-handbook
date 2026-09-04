# Horizontal Scroll

[Live demo](index.html)

## What it is

A horizontal panel strip driven entirely by vertical scroll. While the user scrolls through a tall pinned section, an inner horizontal track translates left proportionally, making panels slide past as if on a conveyor belt. No horizontal scroll container is involved — the user's native vertical scroll is preserved and converted into horizontal motion via translateX.

## When to use it

- Portfolio project showcases where each panel is a distinct featured work
- Feature walkthroughs where lateral movement reinforces a "moving through" narrative
- Timelines, process flows, or numbered steps that benefit from a left-to-right reading order
- Any context where you want horizontal navigation without requiring users to scroll horizontally or use arrow keys

## How it works

Two formulas do all the work — pin distance and translateX offset.

**Pin section height** determines how much vertical scroll budget exists:

```css
#pin-section { height: calc(var(--stage-h) * var(--panels)); }
/* 5 panels × 620px stage = 3100px tall section */
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

**Panel jump links** compute the scroll position that aligns a given panel:

```js
const target = pinSection.offsetTop + (i / (PANELS.length - 1)) * budget;
stage.scrollTo({ top: target, behavior: 'smooth' });
```

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| `--panels` | 5 | Number of horizontal panels; controls pin-section height and track width |
| Pin section height | `panels × stage height` | Total vertical scroll distance for the full horizontal traversal |
| Track width | `calc(panels × 100%)` | Must be set explicitly — default auto-width makes `maxShift = 0` |

## Production notes

- **The track must have an explicit width.** Without `width: calc(var(--panels) * 100%)`, the track's `offsetWidth` equals the containing block's width. Then `maxShift = track.offsetWidth - stage.clientWidth = 0` and `translateX` is always zero — the track never moves. This is the single most common failure mode for this pattern.
- **Panel flex-basis must reference track width, not stage width.** `flex: 0 0 100%` where 100% resolves to the container (the track, not the stage) works correctly only after the track has its explicit width. If the track has no explicit width, the flex-basis also collapses.
- **No `overflow: hidden` between the scroll container and the sticky inner.** `position: sticky` stops working if any ancestor between the sticky element and the scroll container has `overflow` set to anything other than `visible`. `#pin-inner` is sticky inside `#pin-section` inside `.stage` — none of the intermediate elements should have `overflow: hidden`.
- **The scroll container needs `position: relative`.** `pinSection.offsetTop` is measured against the nearest *positioned* ancestor, not the nearest scrolling one. If the scroll container is statically positioned, `offsetTop` silently resolves against `<body>` and includes the page header, so `progress` starts late and saturates at 1 before the pin releases — the last panel is never reached.
- **In a column flex layout, `flex: 1` overrides `height`.** When the side panel stacks below the stage on mobile, `flex: 1 1 0%` makes the stage's flex-basis its main size, so the fixed `height` is ignored and the stage grows to its full content height. It stops being a scroll container, `scrollTop` is permanently 0, and the whole effect dies. Reset it to `flex: none` inside the mobile media query.
- **`progress` must be computed from `stage.scrollTop`, not `window.scrollY`.** The scroll container is the internal stage element. Using `window.scrollY` always returns 0.
- **GSAP ScrollTrigger equivalent:** `ScrollTrigger.create({ trigger, start, end, scrub: true, onUpdate: self => track.style.transform = 'translateX(...)' })`. Horizontal scroll sections also appear in Locomotive Scroll and Lenis as first-class features.
- **Mobile consideration.** The pin-section on mobile is `panels × 480px = 2400px` tall for 5 panels. Test that this feels natural on touch — the ratio of vertical scroll to horizontal travel determines perceived "resistance". Faster travel (fewer panels per px) feels lighter; slower (more panels) can feel sticky.

## See also

- [Sticky Section](../sticky-section/) — a related pin pattern where the content morphs through states instead of translating.
- [Scrub Animation](../scrub-animation/) — another scrub-to-scroll pattern, applied to element transforms rather than layout translation.
