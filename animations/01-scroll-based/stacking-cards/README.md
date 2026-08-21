# Stacking Cards

[Live demo](index.html)

## What it is

A set of cards that stack on top of each other as the user scrolls. Each card uses `position: sticky` to pin itself to the top of the scroll container, so later cards layer over earlier ones and build a literal physical stack. A CSS scroll-driven timeline shrinks each buried card as it is covered, and a per-index `padding-top` leaves the previous card's top edge peeking above the next — the tab that makes the pile read as a deck rather than a single card.

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
| `--scale-step` | 0.10 | Scale lost per level of depth; higher = a more pronounced deck |
| `--peek` | 14px | Per-index `padding-top`; the height of each card's visible tab |
| Card count | 5 | Cards in the deck (3–7); also the `N` that divides the timeline |
| `--stage-h` | 620px / 480px mobile | Scroll container height; card content is this minus 80px |

## Production notes

- **CSS does the work; JS adds polish.** The stacking is correct with zero JavaScript — cards appear in the right order purely from `position: sticky` and `z-index`. The scroll-driven timeline supplies the depth cue (scale), and the JavaScript path exists only for browsers without `animation-timeline`.
- **`transform: scale()` is compositor-only.** It triggers neither layout nor paint, which is why the depth cue stays cheap even with every card animating at once.
- **Never read `offsetTop` from a sticky element.** This is the trap in this pattern. `position: sticky` changes an element's *used* position, so `offsetTop` reports where the card is currently stuck, not where it sits in flow — the value moves as you scroll, and a measurement taken mid-scroll comes back with offsets that run backwards. Accumulate `offsetHeight` instead (sticky does not affect it), and take the container's origin from a non-sticky ancestor.
- **Watch the coordinate space.** `offsetTop` is measured from the nearest positioned ancestor — usually `body` — while `scrollTop` is measured from the scroll container's content origin. Mixing them silently offsets everything by the page chrome above the container. If a parent and child share an `offsetParent`, adding their `offsetTop`s double-counts.
- **Keep the fallback honest.** A JS fallback that merely "looks about right" is worse than none, because nobody re-checks it. Diff its output against the native timeline at several scroll positions — here the two agree to within rounding at every point.
- **GSAP ScrollTrigger** with `pin: true` on each card and a `scrub` timeline can drive the same scale cue with more per-card easing control. Framer Motion's `useScroll` + `useTransform` achieves the same in React with viewport-relative progress per element.
- **Accessibility.** The scale change is subtle and unlikely to trigger vestibular discomfort. Under `prefers-reduced-motion: reduce`, disable the depth cue entirely — the stacking still reads clearly from z-order alone. Gate *both* paths: killing the CSS animation does nothing about a JavaScript fallback that keeps writing inline transforms, and any inline transform already set must be cleared or it will sit frozen on top of the CSS timeline.

## See also

- [Cover Card to Fixed Header](../cover-card-to-fixed-header/) — a related full-screen card pattern where scroll collapses rather than stacks.
- [Parallax Scrolling](../parallax-scrolling/) — another layered-depth scroll technique using speed differentials rather than stacking.
