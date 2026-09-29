# Stagger Reveal

## What it is
A stagger reveal shows a group of items one after another instead of all at once, with a short delay between them, so the group appears as a sweep. The order can run from first to last, last to first, from the middle outward, or at random. The demo plays it on a grid of cards, a list and a cluster of tags as each scrolls into view.

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
    later(() => el.classList.add('in'), order[i] * staggerMs);
  });
}
```

The order array holds a *rank* per item, not a target — item `i` waits `order[i] × staggerMs`. Center-out works by using distance-from-center as the rank, so the middle items (rank 0) fire first.

`later()` is `setTimeout` that also remembers its timer. A group plays once, when 5% of it is in the box. Back to top, pressing Play with the box already at its end, and changing a setting all call `rebuild()`, which cancels the timers still waiting, builds the three groups again hidden and attaches fresh observers, so the groups in the box play again with the current settings. The last group ends with 80px of padding, more than the 20px an item sits low before it appears; without it the hidden items would stretch the scroll length and give it back as they arrive, and a script that reads the length once (as the demo's Play button does) would aim at an end that is not there.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Delay between items | Medium | The wait before each next item: short is 30ms, medium 50ms and long 80ms; 40 to 60ms reads as a sweep, and under 30ms the items seem to arrive together |
| Order | First to last | Which item goes first: first to last, last to first, from the middle outward, or a random order each time |

## Production notes
- **Delay vs. duration**: the stagger delay is the gap between items; each item's own transition duration is separate. Both matter — a 50ms stagger with a 400ms transition means the group overlaps heavily, which usually looks best.
- **Cap the total**: on long lists, `delay × count` grows without bound and the tail feels sluggish. Clamp the effective delay so the whole cascade lands in ~600ms regardless of item count.
- **Below 30ms reads as simultaneous**: if the eye can't separate the items, you've paid for stagger and gotten none of its benefit. Above ~100ms it starts to drag.
- **`setTimeout` vs. CSS `transition-delay`**: this demo uses timers so direction can change at runtime; a static cascade can instead set `transition-delay: calc(var(--i) * 50ms)` per item and avoid JS entirely.
- **Reduced motion**: transitions are disabled under `prefers-reduced-motion`, so each item simply appears at its turn, without moving — the stagger is decorative, never load-bearing.
- **Library equivalents**: GSAP's `stagger` property (including `from: "center"` and `"random"`) is the direct analog; Framer Motion uses `staggerChildren` on a parent variant; Motion One exposes a `stagger()` helper.

## See also
- [Reveal on Scroll](../reveal-on-scroll/) — one element appears as it crosses a line
- [Fly-in Fly-out Contact List](../fly-in-fly-out-contact-list/) — rows fade and slide as they near the edges
- [Stacking Cards](../stacking-cards/) — cards pile into a deck as you scroll
- [Snap Scrolling](../snap-scrolling/) — the box settles on one section at a time
