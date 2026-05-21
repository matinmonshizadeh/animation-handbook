# Accordion Open/Close

## What it is
An accordion is a vertically stacked list of items where each item has a clickable header that reveals or collapses its body content. The animation challenge is that the body must transition between a height of zero (collapsed) and its natural height (expanded) — and CSS cannot natively animate `height: 0` to `height: auto`. The demo shows two solutions: JavaScript measurement and the CSS `grid-template-rows` trick.

## When to use it
- FAQ sections and documentation pages
- Settings panels with grouped options
- Navigation menus with nested sub-items
- Any hierarchical content where not everything should be visible at once

## How it works
**Approach 1 — JavaScript measured height:**

Measure `scrollHeight` (the full content height including overflow) before the transition, set it explicitly, then animate to it:

```js
function openItem(item) {
  const body  = item.querySelector('.acc-body');
  const inner = item.querySelector('.acc-inner');

  const targetHeight = inner.scrollHeight;
  body.style.setProperty('--target-h', targetHeight + 'px');
  body.classList.add('open');
}
```

```css
.acc-body {
  overflow: hidden;
  height: 0;
  transition: height 300ms ease-in-out;
}
.acc-body.open {
  height: var(--target-h);
}
```

After transition, set `height: auto` so the content can reflow naturally if its size changes.

**Approach 2 — CSS `grid-template-rows`:**

No JavaScript required. Wrap content in a grid container and animate the row from `0fr` to `1fr`:

```css
.acc-body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 300ms ease-in-out;
}
.acc-body.open {
  grid-template-rows: 1fr;
}

.acc-inner {
  overflow: hidden;
  min-height: 0; /* required for 0fr to work */
}
```

Toggle the `.open` class in JS — no measurement needed:

```js
trigger.addEventListener('click', () => {
  item.classList.toggle('open');
  body.classList.toggle('open');
  trigger.setAttribute('aria-expanded', item.classList.contains('open'));
});
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Duration | 300ms | 150–400ms; shorter feels snappy, longer feels deliberate |
| Easing | ease-in-out | Symmetrical for expand and collapse; ease-out for expand-only bias |
| Single/multi open | Single | Single-open accordion is more navigable; multi-open for settings |
| Chevron rotation | 180° | Standard indicator — point down when collapsed, up when open |

## Production notes
- **Never animate `max-height` to a large value**: the easing runs across the unused space first, making the timing unpredictable and the animation feel front-loaded. Always animate the actual height.
- **CSS grid approach browser support**: `grid-template-rows` animation works in Chrome 107+, Firefox 107+, Safari 16+. For older browsers, fall back to the JS measurement method.
- **Setting `height: auto` after open**: for the JS approach, listen for `transitionend` and set `height: auto` so the content can reflow (e.g., if the user resizes the window). Reset to the explicit pixel value before closing.
- **ARIA requirements**: `aria-expanded` on the trigger, `id` on the content panel, `aria-controls` linking them, and `role="region"` on the content for landmark navigation.
- **Stagger on reveal**: child elements inside the body can fade in with staggered delays once the height animation is underway — see the toggle in the demo.
- **Radix UI Accordion**: fully accessible, keyboard-navigable, animatable via `data-state="open"/"closed"` attributes. Framer Motion's `AnimatePresence` handles entry/exit for conditionally rendered content.

## See also
- [Toggle / Switch Slide](../toggle-switch/) — simpler binary show/hide without height animation
- [Drawer / Panel Slide](../drawer-slide/) — off-canvas equivalent of the accordion body
- [FLIP Technique](../../03-page-transitions/flip-technique/) — height changes that need to animate other elements simultaneously
