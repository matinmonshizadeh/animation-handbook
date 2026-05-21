# Button Press Scale

## What it is
Button press scale is a micro-animation where a button shrinks slightly on `pointerdown` and springs back on `pointerup`. Without physical button travel, this visual shrink substitutes for the tactile sensation of pressing a real button — it confirms the press registered and creates a satisfying click-like feel.

## When to use it
- Primary action buttons (submit, confirm, pay, send)
- Any button where missing the tap would cause frustration
- Mobile-first interfaces where touch targets replace mouse clicks
- Icon buttons that need stronger press confirmation than a ripple alone

## How it works
Two separate transitions handle press and release with different timings — press is fast, release is slower and optionally springy:

```css
:root {
  --press-scale: 0.95;
  --press-dur: 80ms;
  --release-dur: 180ms;
  --release-ease: cubic-bezier(.34, 1.56, .64, 1);
}

.btn {
  transition: transform var(--release-dur) var(--release-ease);
  transform-origin: center;
}
.btn.pressed {
  transition: transform var(--press-dur) ease;
  transform: scale(var(--press-scale));
}
```

```js
const press = () => btn.classList.add('pressed');
const release = () => btn.classList.remove('pressed');

btn.addEventListener('pointerdown', press);
btn.addEventListener('pointerup', release);
btn.addEventListener('pointercancel', () => btn.classList.remove('pressed'));

// Keyboard support
btn.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') press() });
btn.addEventListener('keyup',   e => { if (e.key === ' ' || e.key === 'Enter') release() });
```

The asymmetric timing is the key insight: pressing (80ms) mirrors the physical suddenness of contact; releasing (180ms) mirrors the slower mechanical spring-back of a real button.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Press scale | 0.95 | 0.92–0.97 is the useful range; below 0.9 looks broken |
| Press duration | 80ms | Should feel instantaneous — 50–100ms is typical |
| Release duration | 180ms | 1.5–2.5× the press duration for spring-back feel |
| Release easing | `cubic-bezier(.34,1.56,.64,1)` | Overshoot creates the spring; remove overshoot for flat |

## Production notes
- **`pointercancel` handling**: always listen for `pointercancel` in addition to `pointerup`. If the user starts a scroll gesture after pressing, `pointerup` may not fire, leaving the button stuck in its pressed state.
- **`touch-action: manipulation`** on the button element suppresses the 300ms tap delay on mobile browsers without needing a separate fast-tap library.
- **Shadow pairing**: coupling a shadow-shrink to the scale change increases realism — a button that lifts slightly on hover and drops on press mirrors physical button behavior.
- **`prefers-reduced-motion`**: users who request reduced motion should see no transform. Wrap the transition in a media query or check `matchMedia` in JS.
- **GSAP**: `gsap.to(btn, { scale: 0.95, duration: 0.08, ease: "power1.in" })` on press; `gsap.to(btn, { scale: 1, duration: 0.18, ease: "back.out(1.7)" })` on release.
- **Framer Motion**: `<motion.button whileTap={{ scale: 0.95 }} />` — single prop, handles press/release automatically.

## See also
- [Click / Tap Ripple](../click-ripple/) — complementary click-point feedback
- [Hover State Animation](../hover-state/) — pre-click affordance
- [Checkmark Draw](../checkmark-draw/) — post-action success confirmation
