# Shimmer Effect

## What it is
A shimmer is a band of light that sweeps across gray placeholder shapes again and again while content loads. Where a pulse fades every block up and down together, a shimmer travels in one direction, so the placeholders look like content streaming in.

## When to use it
- Card and list skeleton loaders where the content streams from a server
- Premium or branded loading experiences where skeleton pulse alone feels too plain
- Any skeleton component where the motion direction matches the data source (left-to-right for left-aligned content)

## How it works
A `::after` pseudo-element holding a translucent gradient covers each skeleton block, and its background position slides from one side to the other:

```css
:root {
  --shim-dur: 1500ms;
  --shim-bright: 0.25;
}

.skel-card {
  position: relative;
  overflow: hidden;
}

.skel-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 25%,
    rgba(255,255,255,var(--shim-bright)) 50%,
    transparent 75%
  );
  background-size: 200% 100%;
  animation: shimmer var(--shim-dur) linear infinite;
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}
```

The `background-size: 200% 100%` and position animation gives more control over the highlight width than `translateX` alone. The tile is twice as wide as the block and its position travels four block widths per cycle, so the band crosses twice in each `--shim-dur`: every 0.75s at the default 1.5s.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Speed | Normal | How often the light crosses: slow every 1.2s, normal every 0.75s and fast every 0.45s; more often than about every 0.4s it feels frantic |
| Brightness | Medium | How strong the band of light is: soft, medium or bright; soft is subtle, bright suits a branded screen |
| Highlight angle | Upright | Upright sweeps a straight band; Slanted and Diagonal tilt it; keep one angle across the whole page |
| Highlight color | White | White works on any placeholder; blue or gold suit branded screens |

## Production notes
- **Single direction only**: multiple shimmer components sweeping in different directions simultaneously create visual chaos. All skeletons on a page should shimmer in the same direction.
- **`overflow: hidden` required**: the shimmer pseudo-element extends beyond the card. Without overflow clipping, it bleeds into adjacent elements.
- **Combining with pulse**: pick one — a pulse and a shimmer together are redundant and visually loud.
- **Performance**: shimmer uses `background-position` animation rather than `transform`. While `transform` is typically preferred, background-position on a GPU-composited layer is acceptably performant. Alternatively, `translateX` with `will-change: transform` on the pseudo-element is the most performant approach.
- **CSS-only**: no JavaScript required. The animation is infinite and stops automatically when the element is removed from DOM.
- **React**: `react-loading-skeleton` includes shimmer. For custom components, the CSS pattern above is framework-agnostic.

## See also
- [Skeleton Loader](../skeleton-loader/) — the placeholders pulse instead
- [Loading Spinner](../loading-spinner/) — a spinner for waits of unknown length
- [Progress Animation](../progress-animation/) — a bar that shows how much is done
- [Animated Gradient Border](../gradient-border/) — a band of colors that runs around an edge instead of across
