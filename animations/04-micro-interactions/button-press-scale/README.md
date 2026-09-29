# Button Press Scale

## What it is
Button press scale makes a button shrink slightly while it is pressed and spring back when it is let go. A screen has no real button travel, so this small shrink stands in for the feel of pushing a physical button, and it confirms that the press registered.

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
| Press depth | Medium | How small the button gets while held down: light is 97%, medium 95% and deep 90% of its size; smaller than 90% looks broken |
| Release speed | Normal | How long it takes to spring back: slow is 300ms, normal 180ms and fast 110ms; about twice the press time feels natural |
| Release feel | Springy | Springy goes a little past full size, then settles; Smooth slows into place; Even keeps one steady pace |
| Press speed | Normal | How long the shrink takes: slow is 130ms, normal 80ms and fast 50ms; a press should feel instant |

## Production notes
- **`pointercancel` handling**: always listen for `pointercancel` in addition to `pointerup`. If the user starts a scroll gesture after pressing, `pointerup` may not fire, leaving the button stuck in its pressed state.
- **`touch-action: manipulation`** on the button element suppresses the 300ms tap delay on mobile browsers without needing a separate fast-tap library.
- **Shadow pairing**: coupling a shadow-shrink to the scale change increases realism — a button that lifts slightly on hover and drops on press mirrors physical button behavior.
- **`prefers-reduced-motion`**: switch the transitions off for users who request reduced motion, so the button changes size at once instead of animating; the demo does this.
- **GSAP**: `gsap.to(btn, { scale: 0.95, duration: 0.08, ease: "power1.in" })` on press; `gsap.to(btn, { scale: 1, duration: 0.18, ease: "back.out(1.7)" })` on release.
- **Framer Motion**: `<motion.button whileTap={{ scale: 0.95 }} />` — single prop, handles press/release automatically.

## See also
- [Click / Tap Ripple](../click-ripple/) — a ripple spreads from the spot you press
- [Hover State Animation](../hover-state/) — items react before they are clicked
- [Checkmark Draw](../checkmark-draw/) — a tick draws itself once the task is done
