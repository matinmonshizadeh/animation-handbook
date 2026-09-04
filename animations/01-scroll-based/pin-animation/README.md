# Pin Animation

[Live demo](index.html)

## What it is

An element that freezes in place while the page continues to scroll beneath it. The pinned element appears to hover at a fixed position in the viewport while the user scrolls through a defined section. In this demo, a phone mockup and its paired feature copy pin to the center of the viewport as the user scrolls through a section three times the viewport height. Four features swap in sequence as scroll progresses through the pinned zone, then the pin releases and scroll continues normally. CSS `position: sticky` handles the entire pin — no JavaScript pinning.

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
  overflow-y: scroll;
  height: 620px;
}
.pin-section {
  height: 1860px; /* 3× the viewport height */
}
.pin-inner {
  position: sticky;
  top: 0;
  height: 620px; /* matches the viewport/stage height */
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

The lifecycle is derived from the same values:

```js
const lifecycle =
  scrollTop < pinStart               ? 'before pin'
  : scrollTop < pinStart + pinHeight - viewH ? 'pinned · in section'
  : 'after release';
```

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Pin section height | `3× viewport height` | Total scroll distance through the pin |
| Feature count | 4 | Features are evenly spaced across the pin section |
| `sticky top` | `0` | The viewport offset where pinning engages |

## Production notes

- **The "extra height" is the scroll budget.** A pinned element at `top: 0` stays visible for exactly `(parent height − viewport height)` pixels of scroll. Set the parent height to `viewport_height + scroll_budget`.
- **GSAP `pin: true`** in ScrollTrigger replicates this behavior and adds smoother feature transitions and timeline scrubbing. Locomotive Scroll and Lenis both support pinned sections natively with their inertia-based scroll.
- **Performance.** The pinned content is not animating — it is just sticky. Feature swaps are text/class changes. No GPU compositing is required beyond what `position: sticky` establishes.
- **Accessibility.** Pin sections that scroll silently while content changes can confuse screen reader users. Ensure feature changes are announced via `aria-live` or that the logical reading order is preserved in the DOM.

## See also

- [Scrub Animation](../scrub-animation/) — uses the same scroll-progress model but continuously transforms a single element rather than swapping discrete features.
- [ScrollTrigger Animation](../scroll-trigger/) — the conceptual framework that defines pin, scrub, and snap as scroll trigger behaviors.
