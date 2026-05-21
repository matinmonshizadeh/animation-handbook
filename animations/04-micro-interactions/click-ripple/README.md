# Click / Tap Ripple

## What it is
A ripple is a circle that expands from the point of click or tap, fading as it grows. Popularized by Material Design, it gives users haptic-substitute feedback: the visual expansion communicates that the press registered, and the origin point confirms exactly where contact was made.

## When to use it
- Primary action buttons (submit, confirm, purchase)
- List items and menu entries that respond to tap
- Any surface where the user needs instant confirmation that a touch registered
- Icon buttons where the ripple prevents a "did it work?" pause

## How it works
On `pointerdown`, measure the click position relative to the button using `getBoundingClientRect()`, spawn an absolutely-positioned `<span>`, and animate it from `scale(0)` to a large scale while fading opacity to 0:

```js
function spawnRipple(btn, e) {
  const r = btn.getBoundingClientRect();
  const size = Math.max(r.width, r.height) * 2;
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;

  const el = document.createElement('span');
  el.style.cssText = `
    position: absolute;
    width: ${size}px; height: ${size}px;
    left: ${x - size/2}px; top: ${y - size/2}px;
    border-radius: 50%;
    background: rgba(255,255,255,0.4);
    transform: scale(0);
    animation: ripple 600ms ease-out forwards;
    pointer-events: none;
  `;
  btn.appendChild(el);
  el.addEventListener('animationend', () => el.remove(), { once: true });
}
```

```css
@keyframes ripple {
  to { transform: scale(2.5); opacity: 0; }
}
```

The button needs `position: relative; overflow: hidden` to contain the ripple.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Duration | 600ms | Longer than a hover animation — the user has already committed the click |
| Max scale | 2.5× | Must be large enough to reach all button corners from any click point |
| Start opacity | 0.4 | Controls visibility of the highlight without washing out button content |
| Origin | Click point | Material default; "from center" is simpler but less accurate |

## Production notes
- **`overflow: hidden`** on the button is required — without it the ripple extends beyond the button boundary.
- **`pointer-events: none`** on the ripple element prevents it from interfering with subsequent clicks fired in quick succession.
- **Touch events**: `pointerdown` works for both mouse and touch. Avoid `mousedown` — it doesn't fire on touch.
- **Cleanup**: always remove the element in `animationend`. In stress tests (rapid clicking) DOM nodes accumulate quickly without cleanup.
- **GSAP**: `gsap.fromTo(el, { scale: 0 }, { scale: 2.5, opacity: 0, duration: 0.6, ease: "power2.out", onComplete: () => el.remove() })`.
- **Material Web Components**: the `<md-ripple>` component handles all of this automatically including touch and keyboard activation.

## See also
- [Button Press Scale](../button-press-scale/) — scale-based feedback complementing the ripple
- [Hover State Animation](../hover-state/) — pre-click affordance signaling
- [Checkmark Draw](../checkmark-draw/) — post-click confirmation feedback
