# Stagger Reveal

## What it is
A stagger reveal animates a group of sibling elements with the same transition but offset start times, so they cascade in sequence rather than appearing at once. The delay between items — and the order they fire in — is what turns a flat group into a readable sweep. This demo reveals a card grid, a list, and a chip cluster when each scrolls into view, with switchable forward, reverse, center-out, and random ordering.

## When to use it
- Card grids, search results, or gallery tiles that should feel populated rather than dumped
- Navigation menus and dropdowns opening their items in sequence
- List rows or table content entering after a section reveal
- Any group where a uniform simultaneous appearance feels abrupt or mechanical

## How it works
Each item shares one CSS transition (`opacity` and `translateY`) and starts hidden. An `IntersectionObserver` on each section triggers `staggerIn`, which computes an order array for the chosen direction and schedules each item's `.in` class with a delay of `orderIndex × staggerMs`:

```js
function getOrder(n) {
  if (direction === 'forward') return Array.from({length: n}, (_, i) => i);
  if (direction === 'reverse') return Array.from({length: n}, (_, i) => n - 1 - i);
  if (direction === 'center') { const c = Math.floor(n / 2);
    return Array.from({length: n}, (_, i) => Math.abs(i - c)); }   // center-out
  // random: Fisher–Yates shuffle
}

function staggerIn(items) {
  const order = getOrder(items.length);
  items.forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), order[i] * staggerMs);
  });
}
```

The order array holds a *rank* per item, not a target — item `i` waits `order[i] × staggerMs`. Center-out works by using distance-from-center as the rank, so the middle items (rank 0) fire first. The side panel's preview matrix renders those same ranks as numbered, brightness-coded dots so the cascade is legible before you scroll.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Stagger delay | 50ms | Gap between consecutive items; 40–60ms is the sweet spot |
| Direction | forward | Order the ranks are assigned: forward, reverse, center-out, random |
| Item transition | 0.4s | Per-item animation duration, independent of the stagger gap |
| Observer threshold | 0.05 | Fraction of the section visible before the group fires |
| Total stagger budget | — | delay × item count; keep under ~600ms so late items don't lag |

## Production notes
- **Delay vs. duration**: the stagger delay is the gap between items; each item's own transition duration is separate. Both matter — a 50ms stagger with a 400ms transition means the group overlaps heavily, which usually looks best.
- **Cap the total**: on long lists, `delay × count` grows without bound and the tail feels sluggish. Clamp the effective delay so the whole cascade lands in ~600ms regardless of item count.
- **Below 30ms reads as simultaneous**: if the eye can't separate the items, you've paid for stagger and gotten none of its benefit. Above ~100ms it starts to drag.
- **`setTimeout` vs. CSS `transition-delay`**: this demo uses timers so direction can change at runtime; a static cascade can instead set `transition-delay: calc(var(--i) * 50ms)` per item and avoid JS entirely.
- **Reduced motion**: transitions are disabled under `prefers-reduced-motion`, so items appear immediately — the stagger is decorative, never load-bearing.
- **Library equivalents**: GSAP's `stagger` property (including `from: "center"` and `"random"`) is the direct analog; Framer Motion uses `staggerChildren` on a parent variant; Motion One exposes a `stagger()` helper.

## See also
- [Reveal on Scroll](../reveal-on-scroll/) — the single-element reveal this cascades
- [Fly In / Fly Out Contact List](../fly-in-fly-out-contact-list/) — staggered list entrance and exit
- [Stacking Cards](../stacking-cards/) — sequenced cards driven by scroll position
- [Snap Scrolling](../snap-scrolling/) — another way to pace a group through the viewport
