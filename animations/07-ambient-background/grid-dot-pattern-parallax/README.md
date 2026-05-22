# Grid / Dot Pattern Parallax

## What it is
A grid or dot pattern parallax translates a subtle background pattern slightly in the opposite direction of the mouse cursor, creating a faint sense of depth between the pattern layer and the foreground content. The displacement is deliberately small — 3–8% of the cursor's position — so the effect is felt more than seen. This is the subtlest ambient effect in this category and one of the most professionally used: Linear's marketing site, Vercel's dashboard, and many developer-tool landing pages use this pattern.

## When to use it
- Technical and developer-tool landing pages where grid patterns signal "structured and precise"
- Any hero section where a plain dark background is too flat but motion would be too distracting
- Dashboard templates where the grid pattern subtly echoes the product's data-grid aesthetic
- Portfolio hero sections where the pattern provides texture without competing with content

## How it works
The pattern is created using CSS `background-image` with a radial or linear gradient that tiles. The pattern layer is slightly larger than the container (10% overflow on each side) to provide drift headroom. Mouse position is tracked and mapped to a translation offset:

```js
stage.addEventListener('mousemove', e => {
  const rect = stage.getBoundingClientRect();
  const normX = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 to 0.5
  const normY = (e.clientY - rect.top)  / rect.height - 0.5;

  const STRENGTH = 0.05; // 5% of stage width/height
  const dx = -normX * STRENGTH * rect.width;
  const dy = -normY * STRENGTH * rect.height;

  patternLayer.style.transform = `translate(${dx}px, ${dy}px)`;
});
```

**CSS dot grid** using radial gradient:

```css
.dot-grid {
  background-image: radial-gradient(
    circle,
    rgba(88, 166, 255, 0.25) 1.5px,   /* dot size */
    transparent 0
  );
  background-size: 28px 28px;  /* dot spacing */
}
```

**CSS line grid** using crossed linear gradients:

```css
.line-grid {
  background-image:
    linear-gradient(rgba(88, 166, 255, 0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(88, 166, 255, 0.15) 1px, transparent 1px);
  background-size: 28px 28px;
}
```

**Auto-drift fallback** for touch devices (no mouse hover):

```js
function autoLoop(t) {
  const dx = -Math.sin(t * 0.0002) * STRENGTH * W * 0.4;
  const dy = -Math.cos(t * 0.00014) * STRENGTH * H * 0.3;
  patternLayer.style.transform = `translate(${dx}px, ${dy}px)`;
  requestAnimationFrame(autoLoop);
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Parallax strength | 5% | Under 3% = unnoticeable; 5% = felt but not seen; above 10% = visually obvious |
| Dot spacing | 28px | 16px = dense technical; 28px = balanced; 48px = sparse, airy |
| Pattern opacity | 25% | Higher = more prominent pattern; lower = nearly invisible texture |
| Two-layer | Off | Second sparse layer at half the speed adds genuine depth between layers |

## Production notes
- **`background-size` controls spacing, not dot size**: the dot size is the gradient stop value (e.g., `1.5px`). The `background-size` is the tile repeat interval.
- **Touch devices have no mouse**: implement the `auto-drift` variant (slow sinusoidal drift) as a touch fallback. Detect via `(pointer: coarse)` media query.
- **`will-change: transform`** on the pattern layer: useful when the layer is large and translation is frequent (every `mousemove` event). Add/remove dynamically on `mouseenter`/`mouseleave`.
- **`transform: translate()` not `background-position`**: `translate` uses the compositor thread; `background-position` triggers paint. Always use `transform` for the parallax offset.
- **SVG pattern alternative**: `<svg><pattern>` can define more complex repeating patterns (hexagons, triangles, etc.) as background images via `background-image: url("data:image/svg+xml,...")`. This keeps the pattern as pure CSS/SVG with no canvas overhead.

## See also
- [Floating Elements](../floating-elements/) — moving shapes rather than a static pattern with parallax
- [2.5D / Pseudo-3D](../../06-3d-advanced/2-5d-pseudo-3d/) — multiple layers at genuinely different depths
- [Parallax 3D Tilt](../../06-3d-advanced/parallax-3d-tilt/) — mouse-driven 3D rotation on cards
