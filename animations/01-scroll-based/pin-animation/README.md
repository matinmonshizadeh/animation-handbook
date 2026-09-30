# Pin Animation

[Live demo](index.html)

## What it is

A pin animation holds part of the page still while the rest scrolls past. In the demo, a phone and its text stop in the middle of the box while you scroll through a section three boxes tall, and its four features change as you go; at the end of the section they let go and scroll away. The browser's sticky positioning does the pinning, with no script moving anything.

## When to use it

- Apple-style product feature walkthroughs where one UI element stays visible while explanatory copy advances
- Step-by-step onboarding where a persistent element stays in view through multiple scroll steps
- Any layout where a visual anchor must be stable while surrounding context changes
- Tutorial sequences where maintaining spatial continuity aids comprehension

## How it works

The pin requires only three things: a tall parent section, a sticky child, and matching heights. The scroll container is `position: relative` so the section's `offsetTop` is measured inside the scroller rather than against the page:

```css
.stage {
  position: relative;
  overflow-y: auto;
  container-type: size;   /* 100cqh is one box height */
}
.pin-section {
  height: 300cqh;         /* three times the box */
}
.pin-inner {
  position: sticky;
  top: 0;
  height: 100cqh;         /* one box tall */
}
```

JavaScript computes which feature to show based on position within the section:

```js
const pinStart  = pinSection.offsetTop;   // measured inside the scroll container
const pinHeight = pinSection.offsetHeight;
const viewH     = stage.clientHeight;
const p = clamp((scrollTop - pinStart) / (pinHeight - viewH), 0, 1);
const featureIndex = Math.min(3, Math.floor(p * 4));
```

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Pinned section | Three box heights | The phone holds still for the two extra box heights; a taller section makes each feature last longer |
| Number of features | 4 | The features share the pinned scrolling equally |
| Pinned at | The top of the box | Where the pinned frame sticks; the phone sits in its middle |

## Production notes

- **The "extra height" is the scroll budget.** A pinned element at `top: 0` stays visible for exactly `(parent height − viewport height)` pixels of scroll. Set the parent height to `viewport_height + scroll_budget`.
- **GSAP `pin: true`** in ScrollTrigger replicates this behavior and adds smoother feature transitions and timeline scrubbing. Locomotive Scroll and Lenis both support pinned sections natively with their inertia-based scroll.
- **Performance.** The pinned content is not animating — it is just sticky. Feature swaps are text/class changes. No GPU compositing is required beyond what `position: sticky` establishes.
- **Accessibility.** Pin sections that scroll silently while content changes can confuse screen reader users. Ensure feature changes are announced via `aria-live` or that the logical reading order is preserved in the DOM.

## See also

- [Scrub Animation](../scrub-animation/) — scroll plays an animation forward and back
- [ScrollTrigger Animation](../scroll-trigger/) — animations start, follow and pin at set scroll points
- [Sticky Section](../sticky-section/) — a whole section holds still while its content changes
