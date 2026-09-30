# Accordion Open/Close

## What it is
An accordion is a stack of headings that each open to show more content below them, and close again. The hard part is the movement: the content's box has to grow from nothing to its natural height, which browsers cannot animate on their own. The demo shows two ways to do it: measure the content's height first, or let a grid row grow from nothing to its full size.

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

The demo keeps that pixel height and measures again when the window is resized, and once the site font has loaded, so an open answer is never clipped. Setting `height: auto` after the transition, as the production notes below describe, lets the content reflow by itself instead.

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
| Speed | Normal | How long an answer takes to open or close: slow is 500ms, normal 300ms and fast 180ms |
| Feel | Gentle | Gentle eases in and out, which suits opening and closing alike; Smooth slows at the end; Even keeps one steady speed |
| Several open at once | off | Off closes the open answer when another opens, which keeps the list short; on suits settings pages |
| Built with | Measured height | Measured height measures the answer before growing to it; Grid rows lets a grid row grow from nothing to its full size, with no measuring; both look the same |
| Arrow flips | on | The arrow beside each question turns to point up while its answer is open |
| Text fades in | off | The answer's text fades in and rises slightly while its box opens, each paragraph a moment after the one before |

## Production notes
- **Never animate `max-height` to a large value**: the easing runs across the unused space first, making the timing unpredictable and the animation feel front-loaded. Always animate the actual height.
- **CSS grid approach browser support**: `grid-template-rows` animation works in Chrome 107+, Firefox 107+, Safari 16+. For older browsers, fall back to the JS measurement method.
- **Setting `height: auto` after open**: for the JS approach, listen for `transitionend` and set `height: auto` so the content can reflow (e.g., if the user resizes the window). Reset to the explicit pixel value before closing.
- **ARIA requirements**: `aria-expanded` on the trigger, `id` on the content panel, `aria-controls` linking them, and `role="region"` on the content for landmark navigation.
- **Stagger on reveal**: child elements inside the body can fade in with staggered delays once the height animation is underway — see the Text fades in setting in the demo.
- **Radix UI Accordion**: fully accessible, keyboard-navigable, animatable via `data-state="open"/"closed"` attributes. Framer Motion's `AnimatePresence` handles entry/exit for conditionally rendered content.
- **Why the demo animates height**: the answer's box growing is the effect itself, so this demo animates its height (or its grid row) directly, an exception to animating only transform and opacity; keep it cheap by opening one short panel at a time and keeping heavy content, such as videos or large images, out of the panel and away from what moves below it.

## See also
- [Toggle / Switch Slide](../toggle-switch/) — a simple on and off with no height change
- [Drawer / Panel Slide](../drawer-slide/) — a panel that slides in over the page instead
- [FLIP Technique](../../03-page-transitions/flip-technique/) — moves other elements smoothly when a layout changes
