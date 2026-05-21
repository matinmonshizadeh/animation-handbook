# Tooltip Reveal

## What it is
A tooltip is a small floating label that appears near an element on hover (or focus), providing supplementary information that doesn't fit inline. The reveal animation — typically a fade combined with a subtle scale — makes the tooltip feel responsive rather than jarring. A delay before showing (300ms) prevents tooltips from triggering on accidental cursor pass-through.

## When to use it
- Icon buttons without visible text labels
- Truncated text that needs to show the full content on hover
- Form fields with validation rules or format requirements
- Data visualization elements (chart bars, graph nodes) that show exact values on hover

## How it works
The tooltip is positioned absolutely relative to the trigger, initially invisible. On hover it fades and scales in after a `setTimeout` delay. On mouse-leave it hides after a short second delay — allowing the user to move the cursor from trigger to tooltip without it disappearing:

```css
.tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) scale(0.95);
  background: #1e2433;
  border: 1px solid #21262d;
  padding: 7px 10px;
  border-radius: 6px;
  font-size: 11px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 150ms ease, transform 150ms ease;
  white-space: nowrap;
}

.tooltip.visible {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}
```

```js
let showTimer, hideTimer;

trigger.addEventListener('mouseenter', () => {
  clearTimeout(hideTimer);
  showTimer = setTimeout(() => tip.classList.add('visible'), 300);
});

trigger.addEventListener('mouseleave', () => {
  clearTimeout(showTimer);
  hideTimer = setTimeout(() => tip.classList.remove('visible'), 100);
});

// Keyboard support
trigger.addEventListener('focusin', () => {
  clearTimeout(hideTimer);
  showTimer = setTimeout(() => tip.classList.add('visible'), 300);
});
trigger.addEventListener('focusout', () => {
  clearTimeout(showTimer);
  hideTimer = setTimeout(() => tip.classList.remove('visible'), 100);
});
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Show delay | 300ms | Prevents flash on cursor pass-through — the most important parameter |
| Hide delay | 100ms | Keeps tooltip alive briefly so the cursor can move onto it |
| Animation duration | 150ms | Fast enough to feel instant; slow enough to be perceivable |
| Scale start | 0.95 | Subtle — scale from 0.9 or less feels like a popup, not a tooltip |

## Production notes
- **The 300ms rule**: without a show delay, every cursor movement across the page triggers tooltip flashes. 300ms is the minimum that feels responsive without being annoying. 200ms can work if the tooltip is very small.
- **Smart positioning**: the demo positions tooltips in fixed directions. Production implementations need viewport-aware positioning — flip the tooltip when it would overflow the edge. Floating UI (by Atomics Design) handles this automatically.
- **Touch devices**: tooltips have no hover trigger on touch. Long-press or a dedicated info button is the touch equivalent. The demo uses `touchstart` to toggle visibility as a fallback.
- **`pointer-events: none`** on the tooltip prevents it from intercepting mouse events when using the `hide-delay` technique of allowing cursor movement onto the tooltip.
- **WCAG 1.4.13 (Content on Hover or Focus)**: the tooltip must be dismissible without moving the cursor (e.g., Escape key), hoverable itself without disappearing, and persistent until the cursor moves away. The 100ms hide delay satisfies "hoverable."
- **Floating UI / Popper.js**: production-grade positioning library. `computePosition()` with `flip` and `shift` middleware handles all edge cases.
- **Radix UI Tooltip**: `<Tooltip.Root>`, `<Tooltip.Trigger>`, `<Tooltip.Content>` — fully accessible, WCAG 1.4.13 compliant, animation-ready.

## See also
- [Hover State Animation](../hover-state/) — hover feedback on the trigger element
- [Badge Pulse](../badge-pulse/) — persistent attention indicator vs. hover-triggered info
- [Modal Expand](../modal-expand/) — for content too large for a tooltip
