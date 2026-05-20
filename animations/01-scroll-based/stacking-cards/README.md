# Stacking Cards

[Live demo](index.html)

## What it is

A set of cards that stack on top of each other as the user scrolls. Each card is roughly viewport-height tall and uses `position: sticky` to pin itself to the top of the scroll container. As subsequent cards scroll up, they layer over the previous ones, building a literal physical stack. Subtle depth cues — scale reduction, brightness dimming, and a small downward shift — reinforce the sense that buried cards are physically behind the topmost one.

## When to use it

- Portfolio or case-study pages where each project deserves its own full-screen moment
- Onboarding sequences where each step replaces rather than follows the previous
- Storytelling layouts where one message must fully resolve before the next appears
- Any context where scroll should feel like turning pages rather than moving a camera

## How it works

The stacking itself requires only CSS. Each card is `position: sticky; top: 0` inside a tall container. The browser keeps each card at the top of the viewport until the next one scrolls past it. Cards are layered using `z-index` so later cards render on top.

```css
.card {
  position: sticky;
  top: 0;
  height: 600px;
  z-index: var(--card-index); /* increases per card */
}
```

JavaScript computes the depth of each card — how many cards are stacked on top of it — and applies visual cues proportionally:

```js
const cardH   = 600;
const topmost = Math.min(Math.floor(scrollTop / cardH), cards.length - 1);
const depth   = Math.max(0, topmost - cardIndex);
const t       = depth / (cards.length - 1); // 0 = surface, 1 = deepest

card.style.transform = `translateY(${depth * 5}px) scale(${lerp(1, SCALE_FLOOR, t)})`;
card.style.filter    = `brightness(${lerp(1, BRIGHT_FLOOR, t)})`;
```

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Scale floor | 0.94 | Minimum scale for buried cards; lower = more pronounced depth |
| Brightness floor | 0.85 | Minimum brightness for buried cards; lower = darker depth shadow |
| Card height | 600px | Must match `height` in CSS for correct depth calculation |
| Translate per depth | 5px | Downward shift per depth level; creates a sinking sensation |

## Production notes

- **CSS does the work; JS adds polish.** The stacking is correct with zero JavaScript — cards appear in the right order purely from `position: sticky` and `z-index`. JavaScript is only needed for the depth cues (scale, brightness). Set both sliders to their max values to see the CSS-only version.
- **Animating `filter: brightness()` is GPU-composited.** It does not trigger layout or paint. Scale via `transform` is equally safe. Both are compositor-only properties.
- **Card height must be consistent.** The depth calculation uses a fixed card height. If cards have varying heights, compute `offsetTop` from the DOM rather than multiplying by a constant.
- **GSAP ScrollTrigger** with `pin: true` on each card and a `scrub` timeline can drive the same scale/brightness cues with more per-card easing control. Framer Motion's `useScroll` + `useTransform` achieves the same in React with viewport-relative progress per element.
- **Accessibility.** The scale and brightness changes are subtle and unlikely to trigger vestibular discomfort. Under `prefers-reduced-motion: reduce`, disable the depth cues entirely — the stacking still reads clearly from z-order alone.

## See also

- [Cover Card to Fixed Header](../cover-card-to-fixed-header/) — a related full-screen card pattern where scroll collapses rather than stacks.
- [Parallax Scrolling](../parallax-scrolling/) — another layered-depth scroll technique using speed differentials rather than stacking.
