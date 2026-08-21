# Scrollspy Navigation

## What it is

Scrollspy is the docs-site pattern where a navigation rail watches the scroll position and highlights the link for the section currently in view, with an indicator that slides between links as sections change. Clicking a link smooth-scrolls to that section. The nav and the content stay in sync in both directions — scroll drives the nav, the nav drives scroll.

## When to use it

- Documentation pages with a table of contents in a side rail
- Long-form articles or legal pages with an "on this page" outline
- Single-page marketing sites with an anchored header menu
- Settings or profile pages split into labeled subsections
- Any page long enough that the reader needs to know where they are

## How it works

Each section's top is measured once and cached in the scroll container's own coordinate space, then every scroll frame compares an *activation line* — the scroll offset plus a fraction of the viewport height — against those cached tops. The active section is the last one whose top sits above the line. The DOM is only touched when the active index actually changes, and the indicator moves by a CSS transition on `transform`, so a state change costs one style write.

```js
function measure() {
  const sRect = stage.getBoundingClientRect();
  tops = sections.map(el => {
    const r = el.getBoundingClientRect();
    return r.top - sRect.top + stage.scrollTop; // container-relative, not offsetTop
  });
  maxScroll = stage.scrollHeight - stage.clientHeight;
}

function spy() {
  if (targetLock > -1) return;            // programmatic scroll in flight
  const line = stage.scrollTop + stage.clientHeight * activation;
  let i = 0;
  for (let k = 0; k < tops.length; k++) if (tops[k] <= line) i = k;
  if (stage.scrollTop >= maxScroll - 1) i = tops.length - 1;
  if (i !== active) setActive(i);         // guarded swap — one write per change
}
```

Clicking a link sets `targetLock` to the destination index, activates it immediately, and starts the smooth scroll. While the lock is held, `spy()` skips its own computation so the indicator does not flicker across every intermediate section the scroll passes through. The lock clears on `scrollend`, with a fallback timeout that fires ~150 ms after the last scroll event for browsers without that event.

## Key parameters

| Parameter | Default | Effect |
| --- | --- | --- |
| Activation line | 35% of viewport height | How far into the viewport a section's top must rise before it becomes active. Lower values activate sections earlier. |
| Indicator transition | `transform .25s ease` | How the accent bar travels between links. A transition (not per-frame writes) suffices because the position only changes on a state change. |
| Click behavior | `smooth` | Passed to `scrollTo`. Falls back to `auto` (instant jump) when the user has reduced motion enabled or toggles smooth scrolling off. |

## Production notes

- **The nav must live outside the scroller.** An absolutely positioned element inside a scroll container scrolls away with the content. Position the rail in a non-scrolling wrapper around the container (or `position: sticky` / `fixed` when the scroller is the page itself).
- **`offsetTop` is the recurring trap.** `offsetTop` is relative to the nearest positioned ancestor, which in a nested-scroller layout is usually *not* the scroll container — here it would be body-relative and every comparison would be wrong. Measure with `getBoundingClientRect()` relative to the container's rect plus its `scrollTop`, and re-measure on resize.
- **The last section is often too short to become active.** If it is shorter than the distance from the activation line to the bottom of the viewport, its top can never cross the line. Force the last index when `scrollTop` reaches `maxScroll` (this demo also adds a trailing run-out so the final section has room). Without this, the last nav link is unreachable by scrolling.
- **Suppress spy updates during programmatic scroll.** A smooth scroll from section 1 to section 5 passes through 2, 3, and 4; without a lock the indicator rapid-fires across every link in between. Activate the target immediately, ignore spy results until the scroll settles, then resume.
- **IntersectionObserver is not a drop-in replacement.** It tells you which sections intersect a band, but scrollspy needs *exactly one* active section at all times — sections taller than the viewport report no intersection with a thin band unless you observe carefully-tuned `rootMargin` bands, and ties between two intersecting sections still need a scroll-position tiebreak. For "one active link" semantics, the cached-tops comparison is simpler and deterministic.
- **Using native anchors instead?** If you link with `href="#section"` and let the browser jump, set `scroll-margin-top` on the targets so a fixed header does not cover the section heading, and use `scroll-behavior: smooth` on the scroller.

## See also

- [ScrollTrigger Animation](../scroll-trigger/)
- [Progress Bar](../progress-bar/)
- [Snap Scrolling](../snap-scrolling/)
