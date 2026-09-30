# Drawer / Panel Slide

## What it is
A drawer is a panel that waits just beyond one edge of the screen and slides in over the page when you press its button, usually holding a menu, filters or settings. The page behind it usually dims so the drawer stands out. It slows down as it arrives, like a panel sliding to a stop, and speeds up as it leaves, which makes closing feel quicker than opening.

## When to use it
- Mobile navigation menus behind a hamburger button
- Filter panels on e-commerce and search result pages
- Settings, preferences, and configuration panels
- Context panels that appear alongside selected content (VS Code-style side panels)

## How it works
The drawer starts translated fully off-screen and transitions to its natural position. Its resting rule carries the closing speed and curve, and the open state carries the opening ones, so each direction has its own easing:

```css
:root {
  --drawer-w: min(280px, 80%);
  --open-dur: 280ms;
  --close-dur: 220ms;
  --open-ease: ease-out;
  --close-ease: ease-in;
  --backdrop-op: 0.5;
}

.drawer {
  position: fixed;
  top: 0; left: 0; bottom: 0;
  width: var(--drawer-w);
  transform: translateX(-100%);
  transition: transform var(--close-dur) var(--close-ease);
  will-change: transform;
  z-index: 200;
}

.drawer.open {
  transform: translateX(0);
  transition: transform var(--open-dur) var(--open-ease);
}

/* Backdrop */
.backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,var(--backdrop-op));
  opacity: 0;
  transition: opacity var(--close-dur) var(--close-ease);
  pointer-events: none;
  z-index: 199;
}
.backdrop.visible {
  opacity: 1;
  pointer-events: auto;
  transition: opacity var(--open-dur) var(--open-ease);
}
```

Close on Escape key, backdrop click, and swipe gesture:

```js
function open() {
  drawer.classList.add('open');
  backdrop.classList.add('visible');
  drawer.inert = false;
}
function close() {
  drawer.classList.remove('open');
  backdrop.classList.remove('visible');
  drawer.inert = true; // a closed drawer cannot be reached with Tab
}

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
| Slides in from | Left | The edge the drawer comes from: left or right for menus and filters, top or bottom for sheets |
| Opening speed | Normal | How long the slide in takes: slow is 450ms, normal 280ms and fast 170ms; it slows as it arrives |
| Closing speed | Normal | How long the slide out takes: slow is 350ms, normal 220ms and fast 130ms; it speeds up as it leaves, and a little shorter than opening feels right |
| Page dimming | Medium | How dark the page behind gets: none, light (25% black), medium (50%) or dark (70%); darker than about 70% feels like a dialog rather than a drawer |

## Production notes
- **Focus trap**: when the drawer is open, Tab focus must cycle within it. Use a focus trap library (e.g., `focus-trap`) or the native `<dialog>` element which traps focus automatically.
- **`aria-modal="true"` and `role="dialog"`**: required for screen readers to announce the drawer as a modal context. Add `aria-label` or `aria-labelledby` for the drawer title.
- **`will-change: transform`**: promotes the drawer to its own compositing layer, preventing paint during the slide. Remove `will-change` after the animation completes if memory is a concern on low-end devices.
- **Right/bottom drawers**: for filters, slides from right (`translateX(100%)`); for action sheets, slides from bottom (`translateY(100%)`).
- **Swipe-to-close on touch**: use `pointerdown`/`pointermove`/`pointerup` (not mouse/touch events separately). Measure the delta and close if the swipe distance exceeds ~50px in the close direction. With a mouse, give the drawer `user-select: none`, or the first drag selects its text and the next one becomes a native text drag.
- **Radix UI Sheet / shadcn Drawer**: fully accessible, animated drawer components. Vaul (Emil Kowalski) adds native mobile-style drag-to-dismiss for bottom drawers.

## See also
- [Modal Expand](../modal-expand/) — a window that grows out of the button you pressed
- [Accordion Open/Close](../accordion/) — sections that open in place instead of over the page
- [Tooltip Reveal](../tooltip-reveal/) — a small label for a short explanation
