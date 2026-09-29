# Animated Gradient Background

## What it is
An animated gradient background slowly shifts its colors behind the content, over a long cycle (typically 15 to 30 seconds), so the page feels alive without anything catching the eye. The gradient is painted much larger than the area it fills and slides slowly back and forth, or its colors turn around the color wheel. It is the lightest ambient effect: the browser animates it with no script at all.

## When to use it
- Hero sections that need subtle life without distracting from headline copy
- SaaS landing pages where the brand palette should feel dynamic
- Dark-mode dashboards that need warmth without photography
- Any context where a static background feels flat but video would be too heavy

## How it works
**Sliding** (a position shift) — the most common variant. The gradient is much larger than the element (`background-size: 400% 400%`) and `background-position` is animated in a slow loop:

```css
.bg {
  background: linear-gradient(135deg, #0d1a2e, #1a0d2e, #0d2e1a, #2e1a0d, #0d1a2e);
  background-size: 400% 400%;
  animation: grad-shift 20s ease infinite;
}

@keyframes grad-shift {
  0%   { background-position: 0%   50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0%   50%; }
}
```

**Color wheel** (a hue rotation) — apply a rotating filter to a static gradient:

```css
.bg {
  background: linear-gradient(135deg, #58a6ff, #d2a8ff, #56d364);
  animation: hue-spin 20s linear infinite;
}
@keyframes hue-spin { to { filter: hue-rotate(360deg); } }
```

Note: `filter` on the gradient element also affects any children — wrap content in a separate `z-index` layer or apply the filter to a pseudo-element.

**Bright bands** runs the same sliding animation on a gradient with brighter colors between dark ends (`background-size: 300% 300%`), over one and a half times the cycle.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Gradient | Sliding | Sliding moves a large, soft gradient back and forth; Color wheel turns every color around the color wheel; Bright bands slides brighter colors between dark ends, one and a half times as slowly |
| Speed | Normal | How long one cycle takes: slow is 32s, normal 20s and fast 12s; under 8s it becomes distracting |
| Colors | Cool | The colors the gradient moves through: cool blues and purples, sunset oranges, ocean blues and greens, or grays |
| Muted colors | off | Takes most of the color out (30% saturation) for a quieter background |

## Production notes
- **Pure CSS — no JavaScript needed**: the entire effect is a CSS animation, with no `requestAnimationFrame` and no canvas.
- **It repaints every frame**: `background-position` is not a property the compositor can animate by itself, so the browser repaints the gradient on every frame (no layout, though). Over a full hero this is usually fine; for the cheapest version, paint the gradient on an oversized layer and slide it with `transform: translate()`, which the compositor runs without repainting.
- **Seamless loop**: repeat the first color stop at the end of the gradient to ensure the transition back to the start is smooth. Without this, there's a visible "snap" when the animation restarts.
- **`@property` for smooth hue stop animation**: native CSS custom property interpolation (`@property` with `syntax: '<color>'`) allows animating individual color stops within a gradient — a newer approach that doesn't require the `background-size` hack.
- **Performance**: on low-end devices a large repainting gradient can cost frames; `will-change: background-position` does not stop the repaint, the `transform` version does.

## See also
- [Mesh Gradient Animation](../mesh-gradient/) — soft blobs of color drift and blend
- [Breathing / Pulsing Glow](../breathing-glow/) — one soft glow grows and shrinks
- [Aurora / Northern Lights](../aurora/) — bands of color sway like the northern lights
