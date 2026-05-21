# Drawer / Panel Slide

## What it is
A drawer is an off-canvas panel that slides in from a screen edge, typically carrying navigation, filters, or settings. It overlays the main content with a dimmed backdrop. The key animation insight is asymmetric easing: the drawer decelerates into its open position (ease-out — feels like arrival) and accelerates away when closing (ease-in — feels like dismissal).

## When to use it
- Mobile navigation menus behind a hamburger button
- Filter panels on e-commerce and search result pages
- Settings, preferences, and configuration panels
- Context panels that appear alongside selected content (VS Code-style side panels)

## How it works
The drawer starts translated fully off-screen and transitions to its natural position:

```css
:root {
  --drawer-w: 280px;
  --open-dur: 280ms;
  --close-dur: 220ms;
  --open-ease: ease-out;
  --close-ease: ease-in;
}

.drawer {
  position: fixed;
  top: 0; left: 0; bottom: 0;
  width: var(--drawer-w);
  transform: translateX(-100%);
  transition: transform var(--open-dur) var(--open-ease);
  will-change: transform;
  z-index: 200;
}

.drawer.open {
  transform: translateX(0);
}

/* Backdrop */
.backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.5);
  opacity: 0;
  transition: opacity var(--open-dur) ease;
  pointer-events: none;
  z-index: 199;
}
.backdrop.visible {
  opacity: 1;
  pointer-events: auto;
}
```

Close on Escape key, backdrop click, and swipe gesture:

```js
function open()  { drawer.classList.add('open'); backdrop.classList.add('visible'); }
function close() { drawer.classList.remove('open'); backdrop.classList.remove('visible'); }

document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
backdrop.addEventListener('click', close);

// Swipe-to-close
let dragStartX = 0;
drawer.addEventListener('pointerdown', e => { dragStartX = e.clientX; });
drawer.addEventListener('pointerup',   e => { if (e.clientX - dragStartX < -50) close(); });
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Open duration | 280ms | 200–350ms — the drawer must feel instant, not cinematic |
| Close duration | 220ms | Slightly shorter than open — dismissal feels snappier than arrival |
| Open easing | ease-out | Decelerates into position — mimics a physical panel sliding to a stop |
| Close easing | ease-in | Accelerates away — mimics a panel being pulled |
| Backdrop opacity | 0.5 | 0.3–0.6 range; above 0.7 feels like a modal, not a drawer |

## Production notes
- **Focus trap**: when the drawer is open, Tab focus must cycle within it. Use a focus trap library (e.g., `focus-trap`) or the native `<dialog>` element which traps focus automatically.
- **`aria-modal="true"` and `role="dialog"`**: required for screen readers to announce the drawer as a modal context. Add `aria-label` or `aria-labelledby` for the drawer title.
- **`will-change: transform`**: promotes the drawer to its own compositing layer, preventing paint during the slide. Remove `will-change` after the animation completes if memory is a concern on low-end devices.
- **Right/bottom drawers**: for filters, slides from right (`translateX(100%)`); for action sheets, slides from bottom (`translateY(100%)`).
- **Swipe-to-close on touch**: use `pointerdown`/`pointermove`/`pointerup` (not mouse/touch events separately). Measure the delta and close if the swipe distance exceeds ~50px in the close direction.
- **Radix UI Sheet / shadcn Drawer**: fully accessible, animated drawer components. Vaul (Emil Kowalski) adds native mobile-style drag-to-dismiss for bottom drawers.

## See also
- [Modal Expand](../modal-expand/) — for content that should appear centered, not from an edge
- [Accordion Open/Close](../accordion/) — inline expand/collapse rather than overlay
- [Tooltip Reveal](../tooltip-reveal/) — lightweight alternative for small amounts of additional information
