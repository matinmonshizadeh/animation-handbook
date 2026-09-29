# Tooltip Reveal

## What it is
A tooltip is a small label that appears next to an item when you point at it or reach it with the keyboard, giving a short explanation that does not fit on the page. It fades in and grows very slightly, and it waits a moment before it shows, so tooltips do not flash while the pointer is only passing over things. When the pointer leaves, it stays for a moment before it fades, so it does not vanish the instant the pointer slips off the item.

## When to use it
- Icon buttons without visible text labels
- Truncated text that needs to show the full content on hover
- Form fields with validation rules or format requirements
- Data visualization elements (chart bars, graph nodes) that show exact values on hover

## How it works
The tooltip is positioned absolutely relative to the trigger, initially invisible. On hover it fades and scales in after a `setTimeout` delay. On mouse-leave it hides after a short second delay, so it does not vanish the instant the pointer slips off the trigger:

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

trigger.addEventListener('pointerenter', () => {
  clearTimeout(hideTimer);
  showTimer = setTimeout(() => tip.classList.add('visible'), 300);
});

trigger.addEventListener('pointerleave', () => {
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

Escape hides a shown tooltip at once, so it can be dismissed without moving the pointer or the focus:

```js
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  clearTimeout(showTimer);
  tip.classList.remove('visible');
});
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Delay before showing | Medium | How long the pointer must rest before the tooltip shows: none, short (150ms), medium (300ms) or long (600ms); 300ms keeps tooltips from flashing as the pointer passes, and 200ms can work for very small ones |
| Speed | Normal | How long the fade and the slight grow take: slow is 250ms, normal 150ms and fast 90ms |
| Delay before hiding | Short | How long the tooltip stays after the pointer leaves: none, short (100ms) or long (300ms); a short pause stops it vanishing the instant the pointer slips off its item |
| Shows an arrow | off | Adds a small point that aims the tooltip at its item |

## Production notes
- **The 300ms rule**: without a show delay, every cursor movement across the page triggers tooltip flashes. 300ms is the minimum that feels responsive without being annoying. 200ms can work if the tooltip is very small.
- **Smart positioning**: the demo positions tooltips in fixed directions. Production implementations need viewport-aware positioning — flip the tooltip when it would overflow the edge. Floating UI (by Atomics Design) handles this automatically.
- **Touch devices**: tooltips have no hover trigger on touch. Long-press or a dedicated info button is the touch equivalent. The demo uses `touchstart` to toggle visibility as a fallback.
- **`pointer-events: none`** on the tooltip keeps it from catching the pointer, so it never blocks the item or its neighbors; the cost is that the pointer cannot rest on the tooltip itself, which the WCAG bullet covers.
- **WCAG 1.4.13 (Content on Hover or Focus)**: the tooltip must be dismissible without moving the cursor (e.g., Escape key), hoverable itself without disappearing, and persistent until the cursor moves away. The demo covers "dismissible": Escape hides a shown tooltip at once. A hide delay helps with "hoverable" only when the tooltip takes the pointer; the demo's tooltips have `pointer-events: none`, so a tooltip that must be hoverable needs pointer events on.
- **Floating UI / Popper.js**: production-grade positioning library. `computePosition()` with `flip` and `shift` middleware handles all edge cases.
- **Radix UI Tooltip**: `<Tooltip.Root>`, `<Tooltip.Trigger>`, `<Tooltip.Content>` — fully accessible, WCAG 1.4.13 compliant, animation-ready.

## See also
- [Hover State Animation](../hover-state/) — items that react when the pointer is on them
- [Notification Badge Pulse](../badge-pulse/) — a dot that pulses to draw the eye
- [Modal Expand](../modal-expand/) — a full window for content too big for a tooltip
