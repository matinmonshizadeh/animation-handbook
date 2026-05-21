# Shimmer Effect

## What it is
A shimmer effect is a diagonal or horizontal gradient highlight that sweeps repeatedly across skeleton placeholder blocks. Where a skeleton pulse fades opacity up and down uniformly, a shimmer moves directionally — giving the impression that data is streaming in from one side. It is a more sophisticated loading state that reads as active progress rather than passive waiting.

## When to use it
- Card and list skeleton loaders where the content streams from a server
- Premium or branded loading experiences where skeleton pulse alone feels too plain
- Any skeleton component where the motion direction matches the data source (left-to-right for left-aligned content)

## How it works
A `::after` pseudo-element containing a translucent gradient is positioned absolutely over the skeleton block and translated from `-100%` to `+200%`:

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

The `background-size: 200% 100%` and position animation gives more control over the highlight width than `translateX` alone.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Duration | 1500ms | 1–2s per sweep is the perceptible range; under 800ms feels frantic |
| Brightness | 0.25 | Highlight opacity — 0.1 is subtle, 0.5 is bright-branded |
| Angle | 90° (horizontal) | Diagonal (`-45deg`) can look more dynamic; keep consistent across components |
| Color | White | Gold or blue for branded variants; stay translucent to work on any skeleton bg |

## Production notes
- **Single direction only**: multiple shimmer components sweeping in different directions simultaneously create visual chaos. All skeletons on a page should shimmer in the same direction.
- **`overflow: hidden` required**: the shimmer pseudo-element extends beyond the card. Without overflow clipping, it bleeds into adjacent elements.
- **Combining with pulse**: the demo supports pulse + shimmer together. In practice, pick one — both simultaneously are redundant and visually loud.
- **Performance**: shimmer uses `background-position` animation rather than `transform`. While `transform` is typically preferred, background-position on a GPU-composited layer is acceptably performant. Alternatively, `translateX` with `will-change: transform` on the pseudo-element is the most performant approach.
- **CSS-only**: no JavaScript required. The animation is infinite and stops automatically when the element is removed from DOM.
- **React**: `react-loading-skeleton` includes shimmer. For custom components, the CSS pattern above is framework-agnostic.

## See also
- [Skeleton Loader](../skeleton-loader/) — the underlying placeholder structure shimmer enhances
- [Loading Spinner](../loading-spinner/) — alternative for unknown-duration loads
- [Progress Animation](../progress-animation/) — when duration or percentage is known
