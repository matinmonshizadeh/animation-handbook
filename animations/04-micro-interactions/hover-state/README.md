# Hover State Animation

## What it is
A hover state animation is any visual change that fires when the cursor enters an interactive element. It confirms interactivity before the user clicks. Six distinct techniques exist — color shift, scale, lift+shadow, underline grow, icon nudge, and background sweep — each with different affordance strength and motion character.

## When to use it
- Navigation links and buttons that need to signal clickability
- Cards in a grid where hover previews the action
- Icon buttons where hover reveals a label or changes the icon color
- Any element where the default cursor alone is insufficient to communicate interaction

## How it works
All six techniques use CSS `transition` driven by `:hover` (or `:active` as a touch fallback). A single `--dur` and `--ease` CSS variable controls every card simultaneously:

```css
:root { --dur: 180ms; --ease: ease; }

/* Color shift */
.h-color { transition: background var(--dur) var(--ease), border-color var(--dur) var(--ease); }
.h-color:hover { background: #1a2a3a; border-color: var(--ui-accent); }

/* Scale */
.h-scale { transition: transform var(--dur) var(--ease); }
@media (hover: hover) { .h-scale:hover { transform: scale(1.03); } }
.h-scale:active { transform: scale(1.03); }

/* Background sweep */
.h-sweep::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(88,166,255,.13);
  transform: translateX(-100%);
  transition: transform var(--dur) var(--ease);
}
@media (hover: hover) { .h-sweep:hover::before { transform: translateX(0); } }
```

The `@media (hover: hover)` gate prevents hover styles from sticking on touch devices, while `:active` provides a tap fallback.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| `--dur` | 180ms | Transition duration — keep ≤200ms for responsiveness |
| `--ease` | ease | Easing curve — ease-out feels snappier, springy adds delight |
| Scale amount | 1.03 | 1.01–1.05 is the useful range; beyond 1.05 feels unstable |
| Shadow elevation | 8px / 24px | `translateY(-4px)` paired with a larger shadow sells the lift |

## Production notes
- **Duration ceiling**: hover animations over 200ms make rapid cursor movement across multiple elements feel sluggish and "sticky." Keep it at or below 180ms.
- **Touch fallback**: `:hover` does not fire reliably on touch. Use `@media (hover: hover)` to gate hover-only styles, and add `:active` equivalents for tap feedback.
- **Background sweep implementation**: use `::before` with `overflow: hidden` on the parent and `translateX` rather than `width` — `width` triggers layout, `transform` does not.
- **GSAP**: `gsap.to(el, { scale: 1.03, duration: 0.18 })` on `mouseenter` / `mouseleave`. Overkill for simple hover; CSS handles this natively.
- **Framer Motion**: `<motion.div whileHover={{ scale: 1.03 }} />` — idiomatic React equivalent.

## See also
- [Button Press Scale](../button-press-scale/) — the complement: press-down feedback
- [Tooltip Reveal](../tooltip-reveal/) — hover that reveals additional information
- [Click / Tap Ripple](../click-ripple/) — confirmation on click rather than hover
