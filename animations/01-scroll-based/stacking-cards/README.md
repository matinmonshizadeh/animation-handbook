# Stacking Cards

[Live demo](index.html)

## What it is

Stacking cards pin each card to the top of the scrolling area, so the next card slides up over it and the cards pile into a deck. A strip of every card underneath stays visible, and each covered card shrinks slightly, so the pile looks deep. The stacking itself needs no script: the browser's sticky positioning does it.

## When to use it

- Portfolio or case-study pages where each project deserves its own full-screen moment
- Onboarding sequences where each step replaces rather than follows the previous
- Storytelling layouts where one message must fully resolve before the next appears
- Any context where scroll should feel like turning pages rather than moving a camera

## How it works

The stacking itself needs no JavaScript at all. Sticky goes on the `.card` wrapper — not on the inner content — and a per-index `padding-top` pushes each card's content lower, so the card above it stays visible as a peek tab.

```css
.card {
  position: sticky;
  top: 0;
  padding-top: calc(var(--index0) * var(--peek)); /* the peek tab */
  z-index: var(--index);                          /* later cards on top */
}
```

The depth cue comes from a CSS scroll-driven animation. `#cards` declares a view timeline, and each card animates over its own slice of that timeline: card *i* of *N* scales during `[i/N, (i+1)/N]` of the exit phase, so the cards compress one after another rather than all at once.

```css
#cards { view-timeline-name: --cards-timeline; }

.card__content {
  animation: card-scale linear both;
  animation-timeline: --cards-timeline;
  animation-range: exit-crossing calc(var(--index0) / var(--numcards) * 100%)
                   exit-crossing calc(var(--index)  / var(--numcards) * 100%);
  transform-origin: 50% 0%;   /* collapse downward, keeping the peek tab flush */
}
@keyframes card-scale {
  to { transform: scale(calc(1 + var(--scale-step) - var(--scale-step) * var(--reverse-index))); }
}
```

Reverse-index is what makes the depth read correctly: the topmost card (reverse-index 1) lands at scale 1.0, and each card buried under it compresses one step further.

For browsers without `animation-timeline`, a `requestAnimationFrame` handler reproduces the same curve. Progress runs from 0 when the deck's top edge reaches the container top to 1 when its bottom edge does, and each card takes the same `[i/N, (i+1)/N]` slice:

```js
const p = clamp((stage.scrollTop - cardsTop) / cardsH, 0, 1);
const t = clamp(p * N - i, 0, 1);
content.style.transform = `scale(${lerp(1, 1 + step - step * (N - i), t)})`;
```

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Edge that shows | Medium | The strip of each card left showing above the next: none, small (8px), medium (14px) or large (20px) |
| How much cards shrink | Medium | How much smaller each card gets for every card on top of it: a little is 5%, medium 10% and a lot 12% |
| Number of cards | 5 | Three, five or seven cards; more make a taller deck and a longer scroll |

## Production notes

- **CSS does the work; JS adds polish.** The stacking is correct with zero JavaScript — cards appear in the right order purely from `position: sticky` and `z-index`. The scroll-driven timeline supplies the depth cue (scale), and the JavaScript path exists only for browsers without `animation-timeline`.
- **`transform: scale()` is compositor-only.** It triggers neither layout nor paint, which is why the depth cue stays cheap even with every card animating at once.
- **The run-out has to be inside the sticky parent.** A sticky element unsticks as soon as its own bottom reaches the bottom of its containing block. The last card's bottom is flush with the end of the deck, so it is pinned for precisely zero pixels — reach the end and the finished stack slides straight off the top, leaving an empty stage. Putting the trailing space *after* the container does not help, and neither does `padding-bottom` on the container: the sticky constraint is the containing block's **content** box, which excludes padding. It must be a real child element after the cards. Its height is exactly how far you can keep scrolling with the completed deck held on screen.
- **Size cards to include their own offset.** Each card is content plus its `padding-top` peek, and the deepest card carries the tallest stack of it. Sizing content to a flat `stage − 80px` means the last card overflows the container once `(N−1) × peek` exceeds that slack — at 7 cards it clipped. Subtracting the peek run instead (`stage − 12px − (N−1) × peek`) keeps every card within the stage at any count or peek value.
- **Never read `offsetTop` from a sticky element.** This is the trap in this pattern. `position: sticky` changes an element's *used* position, so `offsetTop` reports where the card is currently stuck, not where it sits in flow — the value moves as you scroll, and a measurement taken mid-scroll comes back with offsets that run backwards. Accumulate `offsetHeight` instead (sticky does not affect it), and take the container's origin from a non-sticky ancestor.
- **Watch the coordinate space.** `offsetTop` is measured from the nearest positioned ancestor — usually `body` — while `scrollTop` is measured from the scroll container's content origin. Mixing them silently offsets everything by the page chrome above the container. If a parent and child share an `offsetParent`, adding their `offsetTop`s double-counts.
- **Keep the fallback honest.** A JS fallback that merely "looks about right" is worse than none, because nobody re-checks it. Diff its output against the native timeline at several scroll positions — here the two agree to within rounding at every point.
- **GSAP ScrollTrigger** with `pin: true` on each card and a `scrub` timeline can drive the same scale cue with more per-card easing control. Framer Motion's `useScroll` + `useTransform` achieves the same in React with viewport-relative progress per element.
- **Accessibility.** The scale change is subtle and unlikely to trigger vestibular discomfort. Under `prefers-reduced-motion: reduce`, disable the depth cue entirely — the stacking still reads clearly from z-order alone. Gate *both* paths: killing the CSS animation does nothing about a JavaScript fallback that keeps writing inline transforms, and any inline transform already set must be cleared or it will sit frozen on top of the CSS timeline.

## See also

- [Pin Animation](../pin-animation/) — one part holds still while the page scrolls past
- [Snap Scrolling](../snap-scrolling/) — the box settles on one section at a time
- [Cover Card to Fixed Header](../cover-card-to-fixed-header/) — a tall cover shrinks into a slim header
