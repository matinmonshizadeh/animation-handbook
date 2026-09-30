# Click / Tap Ripple

## What it is
A ripple is a soft circle that grows out from the spot you press and fades away. It confirms that the press registered and shows exactly where it landed, which helps most on touch screens, where nothing reacts to hovering. Material Design, Google's design system, made it popular.

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
| Starts from | Where you press | Where you press shows exactly where the press landed; the middle is simpler but less exact |
| Speed | Normal | How long the ripple takes to spread and fade: slow is 1000ms, normal 600ms and fast 350ms; a little longer than a hover change, because the click is already made |
| Ripple size | Medium | How far the circle grows before it fades: small, medium or large; even small reaches every corner of the button |
| Ripple strength | Medium | How visible the ripple is at the start: faint is 20%, medium 40% and strong 60% |
| Ripple color | White | White suits colored buttons, orange matches the accent, black suits light buttons |

## Production notes
- **`overflow: hidden`** on the button is required — without it the ripple extends beyond the button boundary.
- **`pointer-events: none`** on the ripple element prevents it from interfering with subsequent clicks fired in quick succession.
- **Touch events**: `pointerdown` works for both mouse and touch. Avoid `mousedown` — it doesn't fire on touch.
- **Cleanup**: always remove the element in `animationend`. In stress tests (rapid clicking) DOM nodes accumulate quickly without cleanup.
- **Reduced motion**: skip the growing circle and fade a flat highlight over the button instead, so the press still shows. The demo does this.
- **GSAP**: `gsap.fromTo(el, { scale: 0 }, { scale: 2.5, opacity: 0, duration: 0.6, ease: "power2.out", onComplete: () => el.remove() })`.
- **Material Web Components**: the `<md-ripple>` component handles all of this automatically including touch and keyboard activation.

## See also
- [Button Press Scale](../button-press-scale/) — the button shrinks while it is pressed
- [Hover State Animation](../hover-state/) — items react before they are clicked
- [Checkmark Draw](../checkmark-draw/) — a tick draws itself once the task is done
