# Scrollspy Navigation

## What it is

Scrollspy is the menu beside a long page that always highlights the section you are reading. As a section's heading scrolls up past a line near the top, its link lights up and a marker slides to it; clicking a link scrolls to that section. The menu and the page stay in step both ways.

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
  const sRect = doc.getBoundingClientRect();
  tops = sections.map(el => {
    const r = el.getBoundingClientRect();
    return r.top - sRect.top + doc.scrollTop; // container-relative, not offsetTop
  });
  maxScroll = doc.scrollHeight - doc.clientHeight;
}

function spy() {
  if (targetLock > -1) return;            // programmatic scroll in flight
  const line = doc.scrollTop + doc.clientHeight * activation;
  let i = 0;
  for (let k = 0; k < tops.length; k++) if (tops[k] <= line) i = k;
  if (doc.scrollTop >= maxScroll - 1) i = tops.length - 1;
  if (i !== active) setActive(i);         // guarded swap — one write per change
}
```

Clicking a link sets `targetLock` to the destination index, activates it immediately, and starts the smooth scroll: a short ease that sets `scrollTop` on every frame, or a plain jump when Glides to the section is off or the visitor has reduced motion turned on. While the lock is held, `spy()` skips its own computation so the indicator does not flicker across every intermediate section the glide passes through. The lock clears when the glide arrives, and at once when the visitor takes over with the wheel, a touch or a key, or presses Play or Back to top. Gliding from the page, rather than with `behavior: 'smooth'`, is what lets it end cleanly: in Chrome a browser-driven smooth scroll can still be running when an instant jump lands, and the box then stops a little short of the top.

The menu sits inside the scroller, in a row that is zero tall and `position: sticky; top: 0`, so it stays in place while the sections move and a wheel turn or swipe that starts on it still scrolls the box. `setActive()` also marks the current link with `aria-current`. When the menu itself scrolls (the strip across the top on phones, a tall menu on a short screen held sideways), it sets the menu's own scroll position to show that link; `scrollIntoView()` would scroll the page as well. A jump of more than one and a half box heights in one frame (Back to top, Play starting over) resets the marker at once instead of sliding it.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Link changes at | A third down | Where a section's heading must reach before its link lights: near the top is 20% down the box, a third down 35% and halfway 50%; a higher line switches later |
| Glides to the section | on | A link glides to its section; off, it jumps there at once, as it always does under reduced motion |

## Production notes

- **The nav must not scroll away with the content.** An absolutely positioned element inside a scroll container scrolls away with the content. Position the rail in a non-scrolling wrapper around the container (or `position: sticky` / `fixed` when the scroller is the page itself). This demo does it the other way: the menu is positioned inside a zero-height `position: sticky; top: 0` row that is the scroller's first child, so it stays put and a wheel turn or swipe that starts on the menu scrolls the box, where a menu beside the box would scroll the page instead.
- **`offsetTop` is the recurring trap.** `offsetTop` is relative to the nearest positioned ancestor, which in a nested-scroller layout is usually *not* the scroll container — and then every comparison is wrong (this demo positions its scroller, but still measures as below, which works whatever sits in between). Measure with `getBoundingClientRect()` relative to the container's rect plus its `scrollTop`, and re-measure on resize.
- **The last section is often too short to become active.** If it is shorter than the distance from the activation line to the bottom of the viewport, its top can never cross the line. Force the last index when `scrollTop` reaches `maxScroll` (this demo also adds a trailing run-out so the final section has room). Without this, the last nav link is unreachable by scrolling.
- **Suppress spy updates during programmatic scroll.** A smooth scroll from section 1 to section 5 passes through 2, 3, and 4; without a lock the indicator rapid-fires across every link in between. Activate the target immediately, ignore spy results until the scroll settles, then resume.
- **IntersectionObserver is not a drop-in replacement.** It tells you which sections intersect a band, but scrollspy needs *exactly one* active section at all times — sections taller than the viewport report no intersection with a thin band unless you observe carefully-tuned `rootMargin` bands, and ties between two intersecting sections still need a scroll-position tiebreak. For "one active link" semantics, the cached-tops comparison is simpler and deterministic.
- **Using native anchors instead?** If you link with `href="#section"` and let the browser jump, set `scroll-margin-top` on the targets so a fixed header does not cover the section heading, and use `scroll-behavior: smooth` on the scroller.

## See also

- [ScrollTrigger Animation](../scroll-trigger/) — things start, scrub and pin as parts of the page scroll past
- [Progress Bar](../progress-bar/) — a bar shows how far you have read
- [Snap Scrolling](../snap-scrolling/) — scrolling stops on one whole section at a time
