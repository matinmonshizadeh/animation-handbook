# FLIP Technique

## What it is
FLIP, short for First, Last, Invert, Play, animates layout changes that CSS cannot animate by itself, such as sorting a grid or switching from columns to a list. The browser moves every item to its new place at once; each item is then shifted back to where it was and slides from there to its new place. It looks as if the items glide into the new layout, but only their position on screen is animated.

## When to use it
- Reordering, sorting, filtering, or shuffling a list or grid
- Switching layouts (3 columns → list) where items change both position and size
- Adding or removing items and having the neighbors slide to accommodate
- Any "the layout changed and I want it to animate" case that `transition` alone can't handle

## How it works
The four steps map onto four blocks of code. **First:** record every card's bounding rect. **Last:** apply the new layout so cards snap to their final positions. **Invert:** for each card, compute the delta between its old and new position and apply a `transform` that visually returns it to the start. **Play:** transition that transform to zero so the card glides to where it really is.

```js
// FIRST — record positions before the change
const first = {};
cards.forEach(c => { first[c.id] = c.getBoundingClientRect(); });

// LAST — apply the new layout (cards jump instantly)
renderCards();
grid.offsetHeight; // force reflow

// INVERT — transform each card back to its original spot
newCards.forEach(c => {
  const f = first[c.id], last = c.getBoundingClientRect();
  const dx = f.left - last.left, dy = f.top - last.top;
  c.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
  c.style.transition = 'none';
});

// PLAY — apply the inverted positions, then animate the transform to zero
grid.offsetWidth; // force reflow
newCards.forEach(c => {
  c.style.transition = `transform ${dur}ms ${ease}`;
  c.style.transform = '';
});
```

Cards are matched across the re-render by a stable `id`, so a card that moves from one grid slot to another is tracked correctly. Reading `offsetWidth` between Invert and Play makes the browser apply the inverted (start) positions before the transition to zero begins.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Speed | Normal | How long the cards take to glide: slow is 800ms, normal 500ms and fast 300ms; 300 to 600ms reads as deliberate |
| Feel | Smooth | Smooth slows to a stop; Springy goes a little past each place and settles; Even keeps one steady pace |

## Production notes
- **Only `transform` animates.** That is the whole point — `transform` and `opacity` are compositor-friendly and skip layout and paint, so FLIP animates dozens of reflowing elements at 60fps where transitioning `width`/`top` would jank.
- **Read then write, once.** Batch all `getBoundingClientRect` reads (First) before any style writes (Last/Invert) to avoid layout thrashing. Reading and writing in an interleaved loop forces repeated synchronous layouts.
- **Size changes need scale.** This demo animates position via `translate`; when cards also change dimensions (list mode), add `scaleX`/`scaleY` from the old size to the new, or the resize will pop rather than glide.
- **`will-change: transform`** on the animated cards hints the compositor to promote them to their own layer ahead of time, smoothing the first frame — used here on `.flip-card`.
- **Library equivalents.** React's `<AnimatePresence>` and Framer Motion's `layout` prop implement FLIP automatically for layout changes. GSAP's Flip plugin is a direct, batteries-included implementation. The View Transitions API achieves similar layout-change animation natively by snapshotting before and after, without manual rect math.

## See also
- [Shared Element Transition](../shared-element-transition/) — the same method for one element across pages
- [Morph Transition](../morph-transition/) — a shape changes instead of moving
- [Elastic Transition](../elastic-transition/) — a springy finish to the movement
- [View Transitions API](../view-transitions-api/) — the browser can animate layout changes itself
