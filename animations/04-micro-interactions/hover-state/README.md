# Hover State Animation

## What it is
A hover state is a small change that plays when the pointer moves over something you can click, such as a button, a link or a card. It tells people the item will respond before they click it. The demo shows six common ways to do it: a color change, a slight grow, a lift with a shadow, an underline that draws out, an arrow that nudges forward and a tint that sweeps across.

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
@media (hover: hover) { .h-color:hover { background: #2a201a; border-color: var(--ui-accent); } }
.h-color:active { background: #2a201a; border-color: var(--ui-accent); }

/* Scale */
.h-scale { transition: transform var(--dur) var(--ease); }
@media (hover: hover) { .h-scale:hover { transform: scale(1.03); } }
.h-scale:active { transform: scale(1.03); }

/* Background sweep */
.h-sweep::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255,157,92,.13);
  transform: translateX(-100%);
  transition: transform var(--dur) var(--ease);
}
@media (hover: hover) { .h-sweep:hover::before { transform: translateX(0); } }
```

The `@media (hover: hover)` gate prevents hover styles from sticking on touch devices, while `:active` provides a tap fallback.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Speed | Normal | How long each change takes: slow is 300ms, normal 180ms and fast 110ms; keep hover changes at 200ms or less so moving across several items never feels sticky |
| Feel | Smooth | Smooth slows into place; Springy goes a little too far, then settles; Gentle eases in and out; Even keeps one steady pace |

## Production notes
- **Duration ceiling**: hover animations over 200ms make rapid cursor movement across multiple elements feel sluggish and "sticky." Keep it at or below 180ms.
- **Touch fallback**: `:hover` does not fire reliably on touch. Use `@media (hover: hover)` to gate hover-only styles, and add `:active` equivalents for tap feedback.
- **Background sweep implementation**: use `::before` with `overflow: hidden` on the parent and `translateX` rather than `width` — `width` triggers layout, `transform` does not.
- **GSAP**: `gsap.to(el, { scale: 1.03, duration: 0.18 })` on `mouseenter` / `mouseleave`. Overkill for simple hover; CSS handles this natively.
- **Framer Motion**: `<motion.div whileHover={{ scale: 1.03 }} />` — idiomatic React equivalent.

## See also
- [Button Press Scale](../button-press-scale/) — the button shrinks while it is pressed
- [Tooltip Reveal](../tooltip-reveal/) — pointing at an item shows a short note
- [Click / Tap Ripple](../click-ripple/) — a ripple spreads from the spot you press
