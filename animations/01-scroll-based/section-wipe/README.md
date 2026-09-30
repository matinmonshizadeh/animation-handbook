# Section Wipe

## What it is
A section wipe replaces each full-screen section with the next by sliding the new one up over it, instead of scrolling the old one away. Every section sticks to the top of the screen and sits above the one before, so the next one covers it as you scroll. The covered section can shrink slightly, so it seems to sink behind the one arriving.

## When to use it
- Full-screen storytelling sections that should feel layered rather than scrolled
- Landing pages where each section is a distinct "screen" that replaces the last
- Portfolio or case-study layouts with strong section-to-section breaks
- Anywhere the covering motion should read as depth, one panel sliding behind another

## How it works
The wipe itself requires no animation code: every `.section` is `position: sticky; top: 0; height: 100cqh` (one stage height, because the stage is a size container), and their `z-index` values ascend (1, 2, 3, 4). As you scroll, each section sticks at the top until the next one — being higher in the stack — covers it. The only scripted effect is the receding scale, computed from how much of the viewport the next section has already covered:

```js
sections.forEach((s, i) => {
  if (i === sections.length - 1) return;              // top section never recedes
  const nextR = sections[i + 1].getBoundingClientRect();
  const coverage = sr.height - (nextR.top - sr.top);  // px of this section covered
  const t = clamp(coverage / (sr.height * wipeRange), 0, 1);
  contents[i].style.transform = `scale(${lerp(1, scaleFloor, t).toFixed(4)})`;
});
```

Here `sr` is the stage's inner box, its top edge and its height inside the border. Because `t` is a continuous ratio of coverage, the scale is scrubbed to scroll — freeze mid-wipe and the section sits at an intermediate scale, no snap. The scale-down makes the covered section feel like it's sliding *behind* the incoming one rather than simply being hidden.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Shrink | A little | How small the covered section gets: none keeps it full size, a little is 96% and a lot 88%; smaller sinks it deeper |
| Shrink speed | Gradual | How much of the wipe the shrink takes: gradual spreads it over the whole wipe, medium over the first 60% and quick over the first 30% |

## Production notes
- **The wipe is free**: sticky positioning plus ascending `z-index` produces the entire covering motion with zero JavaScript. Reach for script only for embellishments like the scale, never for the wipe itself.
- **Scale the content, not the section**: the transform is applied to `.sec-content` inside the sticky section, not the sticky element — transforming a sticky element can break its stickiness in some engines.
- **`will-change: transform`**: set on the scaled content so the browser promotes it to its own layer; the demo drops it under reduced motion to avoid holding a needless layer.
- **Guard the top section**: the last section has the highest `z-index` and is never covered, so it's skipped in the scale loop — it should stay at scale 1.
- **Reduced motion**: when `prefers-reduced-motion` is set the scale loop is skipped entirely; sections still wipe (that's pure layout) but without the recede.
- **Library equivalents**: GSAP ScrollTrigger with `scrub: true` on a scale tween implements the same recede and adds the easing CSS alone can't provide here; Framer Motion maps `useScroll` progress to a `scale` motion value for the React version.

## See also
- [Sticky Section](../sticky-section/) — one section holds still while its content changes
- [Stacking Cards](../stacking-cards/) — cards pile up into a deck as you scroll
- [Cover Card to Fixed Header](../cover-card-to-fixed-header/) — a big cover shrinks into a slim header as you scroll
- [Snap Scrolling](../snap-scrolling/) — scrolling stops on one whole section at a time
