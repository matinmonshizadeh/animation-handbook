# Section Wipe

## What it is
A section wipe is a transition where the next section slides up over the current one as you scroll, rather than the current one scrolling away. It is built almost entirely from layout: each section is `position: sticky` at the top with an ascending `z-index`, so a higher-numbered section naturally rises over its predecessor. This demo stacks four full-height sections and adds a single JavaScript touch — the outgoing section scales down slightly as it's covered.

## When to use it
- Full-screen storytelling sections that should feel layered rather than scrolled
- Landing pages where each section is a distinct "screen" that replaces the last
- Portfolio or case-study layouts with strong section-to-section breaks
- Anywhere the covering motion should read as depth, one panel sliding behind another

## How it works
The wipe itself requires no animation code: every `.section` is `position: sticky; top: 0; height: 100%` of the stage, and their `z-index` values ascend (1, 2, 3, 4). As you scroll, each section sticks at the top until the next one — being higher in the stack — covers it. The only scripted effect is the receding scale, computed from how much of the viewport the next section has already covered:

```js
sections.forEach((s, i) => {
  if (i === sections.length - 1) return;              // top section never recedes
  const nextR = sections[i + 1].getBoundingClientRect();
  const coverage = sr.height - (nextR.top - sr.top);  // px of this section covered
  const t = clamp(coverage / (sr.height * wipeRange), 0, 1);
  contents[i].style.transform = `scale(${lerp(1, scaleFloor, t).toFixed(4)})`;
});
```

Because `t` is a continuous ratio of coverage, the scale is scrubbed to scroll — freeze mid-wipe and the section sits at an intermediate scale, no snap. The scale-down makes the covered section feel like it's sliding *behind* the incoming one rather than simply being hidden.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| `z-index` order | ascending 1→4 | Determines stacking; higher sections wipe over lower ones |
| Scale floor | 0.96 | How far the outgoing section shrinks; lower = deeper recede |
| Wipe range | 100% | Fraction of coverage over which the scale completes; lower = finishes sooner |
| Coverage `t` | derived | 0 when the next section is off-stage, 1 when it fully covers |

## Production notes
- **The wipe is free**: sticky positioning plus ascending `z-index` produces the entire covering motion with zero JavaScript. Reach for script only for embellishments like the scale, never for the wipe itself.
- **Scale the content, not the section**: the transform is applied to `.sec-content` inside the sticky section, not the sticky element — transforming a sticky element can break its stickiness in some engines.
- **`will-change: transform`**: set on the scaled content so the browser promotes it to its own layer; the demo drops it under reduced motion to avoid holding a needless layer.
- **Guard the top section**: the last section has the highest `z-index` and is never covered, so it's skipped in the scale loop — it should stay at scale 1.
- **Reduced motion**: when `prefers-reduced-motion` is set the scale loop is skipped entirely; sections still wipe (that's pure layout) but without the recede.
- **Library equivalents**: GSAP ScrollTrigger with `scrub: true` on a scale tween implements the same recede and adds the easing CSS alone can't provide here; Framer Motion maps `useScroll` progress to a `scale` motion value for the React version.

## See also
- [Sticky Section](../sticky-section/) — pinning one section and morphing its interior
- [Stacking Cards](../stacking-cards/) — sticky stacking applied to cards rather than sections
- [Cover Card to Fixed Header](../cover-card-to-fixed-header/) — a sticky element transforming as it's passed
- [Snap Scrolling](../snap-scrolling/) — snapping between full-height sections
