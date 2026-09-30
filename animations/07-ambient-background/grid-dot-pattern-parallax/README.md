# Grid / Dot Pattern Parallax

## What it is
A grid or dot pattern parallax places a faint repeating pattern of dots or lines behind the content and shifts it slightly in the opposite direction to the pointer. The shift is tiny, a few percent of the pointer's movement, so the pattern seems to sit a little deeper than the content: depth you feel more than see. When no pointer is over it, the grid drifts slowly by itself. Linear, Vercel and many developer tools use it.

## When to use it
- Technical and developer-tool landing pages where grid patterns signal "structured and precise"
- Any hero section where a plain dark background is too flat but motion would be too distracting
- Dashboard templates where the grid pattern subtly echoes the product's data-grid aesthetic
- Portfolio hero sections where the pattern provides texture without competing with content

## How it works
The pattern is created using CSS `background-image` with a radial or linear gradient that tiles. The pattern layer is slightly larger than the container (10% overflow on each side) to provide drift headroom. Mouse position is tracked and mapped to a translation offset:

```js
stage.addEventListener('pointermove', e => {
  const rect = stage.getBoundingClientRect();
  const normX = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 to 0.5
  const normY = (e.clientY - rect.top)  / rect.height - 0.5;

  const STRENGTH = 0.05; // 5% of stage width/height
  const dx = -normX * STRENGTH * rect.width;
  const dy = -normY * STRENGTH * rect.height;

  patternLayer.style.transform = `translate(${dx}px, ${dy}px)`;
});
```

Pointer events cover a mouse, a pen and a finger. The demo's stage has `touch-action: pan-y`, so a sideways drag steers the grid while a vertical swipe still scrolls the page, and only a mouse turns on the cursor ring and the light.

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
    linear-gradient(rgba(88, 166, 255, 0.25) 1px, transparent 1px),
    linear-gradient(90deg, rgba(88, 166, 255, 0.25) 1px, transparent 1px);
  background-size: 28px 28px;
}
```

**Auto-drift** when no pointer is over the stage (and on touch screens between drags):

```js
let clock = 0, last = null;
function autoLoop(now) {
  clock += last === null ? 0 : Math.min(now - last, 50);   // the drift's own clock stops while paused
  last = now;
  const dx = -Math.sin(clock * 0.0002)  * STRENGTH * W * 0.4;
  const dy = -Math.cos(clock * 0.00014) * STRENGTH * H * 0.3;
  patternLayer.style.transform = `translate(${dx}px, ${dy}px)`;
  requestAnimationFrame(autoLoop);
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Pattern | Dots | A grid of dots, of lines, or both |
| Strength | Medium | How far the grid shifts: subtle is 3% of the pointer's movement, medium 5% and strong 10%; under 10% it is felt more than seen |
| Spacing | Medium | The distance between dots or lines: tight is 20px, medium 28px and wide 44px |
| Pattern color | Blue | The color of the dots and lines, shown at 25% so they stay faint |
| Second layer | off | A sparser layer of larger dots shifts half as far, adding real depth between the two |
| Light under the pointer | on | A faint round glow follows the pointer |

## Production notes
- **`background-size` controls spacing, not dot size**: the dot size is the gradient stop value (e.g., `1.5px`). The `background-size` is the tile repeat interval.
- **Touch devices have no mouse**: implement the `auto-drift` variant (slow sinusoidal drift) as a touch fallback. Detect via `(pointer: coarse)` media query.
- **`will-change: transform`** on the pattern layer: useful when the layer is large and translation is frequent (every `mousemove` event). Add/remove dynamically on `mouseenter`/`mouseleave`.
- **`transform: translate()` not `background-position`**: `translate` uses the compositor thread; `background-position` triggers paint. Always use `transform` for the parallax offset.
- **SVG pattern alternative**: `<svg><pattern>` can define more complex repeating patterns (hexagons, triangles, etc.) as background images via `background-image: url("data:image/svg+xml,...")`. This keeps the pattern as pure CSS/SVG with no canvas overhead.

## See also
- [Floating Elements](../floating-elements/) — shapes that drift on their own instead
- [2.5D / Pseudo-3D](../../06-3d-advanced/2-5d-pseudo-3d/) — many layers moving at different depths
- [Parallax 3D Tilt](../../06-3d-advanced/parallax-3d-tilt/) — a card that tilts toward the pointer
