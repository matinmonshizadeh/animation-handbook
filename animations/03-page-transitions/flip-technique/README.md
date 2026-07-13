# FLIP Technique

## What it is
FLIP — First, Last, Invert, Play — is a method for animating layout changes that CSS cannot transition directly, such as reordering a grid or switching column counts. Instead of animating the expensive layout properties, it lets the browser jump elements to their final positions instantly, then uses a cheap `transform` to make them *appear* to still be in their old spots, and animates that transform away. The result looks like the elements glided to their new layout, but only `transform` ever animated.

## When to use it
- Reordering, sorting, filtering, or shuffling a list or grid
- Switching layouts (3 columns → list) where items change both position and size
- Adding or removing items and having the neighbors slide to accommodate
- Any "the layout changed and I want it to animate" case that `transition` alone can't handle

## How it works
The four steps map onto four blocks of code. **First:** record every card's bounding rect. **Last:** apply the new layout so cards snap to their final positions. **Invert:** for each card, compute the delta between its old and new position and apply a `transform` that visually returns it to the start. **Play:** on the next frames, transition that transform to zero so the card glides to where it really is.

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

// PLAY — animate the transform to zero
requestAnimationFrame(() => requestAnimationFrame(() => {
  newCards.forEach(c => {
    c.style.transition = `transform ${dur}ms ${ease}`;
    c.style.transform = '';
  });
}));
```

Cards are matched across the re-render by a stable `id`, so a card that moves from one grid slot to another is tracked correctly. The double `requestAnimationFrame` guarantees the inverted (start) state is committed before the transition to zero begins.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Duration | 500ms | Glide time from inverted position to final. 300–600ms reads as deliberate |
| Easing | Smooth `cubic-bezier(.2,.7,.3,1)` | Controls the settle; a springy curve adds overshoot |
| Matching key | element `id` | How First positions are paired to Last elements; must be stable across re-render |
| Show Invert step | off | Badges each card during the invert phase to expose the hidden mechanism |

## Production notes
- **Only `transform` animates.** That is the whole point — `transform` and `opacity` are compositor-friendly and skip layout and paint, so FLIP animates dozens of reflowing elements at 60fps where transitioning `width`/`top` would jank.
- **Read then write, once.** Batch all `getBoundingClientRect` reads (First) before any style writes (Last/Invert) to avoid layout thrashing. Reading and writing in an interleaved loop forces repeated synchronous layouts.
- **Size changes need scale.** This demo animates position via `translate`; when cards also change dimensions (list mode), add `scaleX`/`scaleY` from the old size to the new, or the resize will pop rather than glide.
- **`will-change: transform`** on the animated cards hints the compositor to promote them to their own layer ahead of time, smoothing the first frame — used here on `.flip-card`.
- **Library equivalents.** React's `<AnimatePresence>` and Framer Motion's `layout` prop implement FLIP automatically for layout changes. GSAP's Flip plugin is a direct, batteries-included implementation. The View Transitions API achieves similar layout-change animation natively by snapshotting before and after, without manual rect math.

## See also
- [Shared Element Transition](../shared-element-transition/) — FLIP applied to a single element across pages
- [Morph Transition](../morph-transition/) — animating shape as well as position between states
- [Elastic Transition](../elastic-transition/) — pair FLIP's Play step with a springy easing
- [View Transitions API](../view-transitions-api/) — the browser-native successor to hand-rolled FLIP
