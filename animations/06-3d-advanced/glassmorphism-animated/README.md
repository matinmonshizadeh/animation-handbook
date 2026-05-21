# Glassmorphism Animated

## What it is
Glassmorphism is a UI style where interface elements appear as frosted glass — semi-transparent, blurred backgrounds with subtle light borders. The CSS `backdrop-filter: blur()` property applies the blur to whatever is rendered behind the element. Animating the background blobs, blur intensity, or frost tint color adds a living quality to glass panels that static glassmorphism lacks.

## When to use it
- SaaS dashboards and product landing pages where glass cards display metrics or features
- Modal dialogs that sit over a blurred version of the underlying content
- Navigation overlays and sidebars with blurred backdrop
- Any dark-themed UI where depth between layers must be communicated without heavy borders

## How it works
Three CSS properties create the glass effect:

```css
.glass-card {
  background: rgba(88, 166, 255, 0.12);   /* semi-transparent tint */
  backdrop-filter: blur(12px) saturate(1.8);
  -webkit-backdrop-filter: blur(12px) saturate(1.8);
  border: 1px solid rgba(255, 255, 255, 0.18);   /* light edge highlight */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.2); /* top edge catch-light */
}
```

**Animated blur** cycles the `backdrop-filter` value via `@keyframes`:

```css
@keyframes blur-breath {
  0%, 100% { backdrop-filter: blur(8px) saturate(1.8); }
  50%       { backdrop-filter: blur(20px) saturate(2); }
}
```

**Animated background blobs** — pure CSS keyframe motion that gives the glass something interesting to blur:

```css
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  animation: blob-move 8s ease-in-out infinite alternate;
}

@keyframes blob-move {
  0%   { transform: translate(0, 0)      scale(1); }
  33%  { transform: translate(40px,-30px) scale(1.1); }
  100% { transform: translate(30px, 10px) scale(1.05); }
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Blur intensity | 12px | 4–8px = subtle; 16–24px = heavy frost; above 30px degrades text legibility |
| Glass opacity | 0.12 | 0.05 = nearly invisible tint; 0.25 = heavily tinted |
| Blob speed | 8s | Faster blob motion = more active glass content; slower = calm |
| Border opacity | 0.18 | The subtle edge is what sells "glass" — reducing to 0 makes it look plastic |

## Production notes
- **`backdrop-filter` is GPU-expensive**: the browser must capture a snapshot of everything behind the element and blur it every frame. On large glass surfaces or low-end hardware this causes frame drops. Keep glass cards small; avoid full-screen glass overlays.
- **`-webkit-` prefix still required**: Safari needs `-webkit-backdrop-filter` even in 2024. Include both the prefixed and unprefixed property.
- **The backdrop must have content**: `backdrop-filter` blurs what is behind the element. If the background is a solid color, the blur does nothing — the glass looks like dirty plastic. Colorful, high-contrast content behind the glass is required for the effect to be visible.
- **Dark mode**: glassmorphism requires a dark-enough background to read as glass rather than a white haze. The effect works better on dark themes.
- **Disable for performance audit**: the demo includes a toggle to disable `backdrop-filter`. Use this to compare performance — if the site is noticeably faster without it, reconsider the design.

## See also
- [WebGL Shader Animation](../webgl-shader-animation/) — GPU-based alternative for animated backgrounds
- [Noise-Based Motion](../noise-based-motion/) — canvas-based animated background
- [Modal Expand](../../04-micro-interactions/modal-expand/) — glassmorphism is often applied to modal overlays
