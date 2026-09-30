# Focus Ring Animation

## What it is
A focus ring is the outline that shows which item the keyboard is on. Animating it, so the ring closes in around each item as you press Tab, makes every move easier to follow. It shows when the keyboard is used (and when you click into a text field, since you type there next), so people who click buttons and links with a mouse do not see rings appear.

## When to use it
- Every interactive element on every page — focus rings are mandatory for WCAG 2.4.7 compliance
- Forms where keyboard navigation between fields must be clearly tracked
- Navigation menus and modal dialogs where Tab order needs visual confirmation
- Any site with keyboard-reliant users (power users, accessibility needs, screen reader users)

## How it works
Remove the browser's default outline entirely, then rebuild it using `:focus-visible` with an animation:

```css
:root {
  --ring-color: #ff9d5c;
  --ring-w: 2px;
  --ring-offset: 3px;
  --ring-dur: 140ms;
}

/* Remove default — only for elements we control */
.focusable { outline: none; }

/* Rebuild with animation — keyboard only */
.focusable:focus-visible {
  outline: var(--ring-w) solid var(--ring-color);
  outline-offset: var(--ring-offset);
  animation: ring-in var(--ring-dur) ease-out both;
}

@keyframes ring-in {
  from {
    outline-offset: calc(var(--ring-offset) + 8px);
    opacity: 0.3;
  }
  to {
    outline-offset: var(--ring-offset);
    opacity: 1;
  }
}
```

The animation interpolates `outline-offset` from a larger value inward — the ring appears to contract onto the element, drawing the eye. A glow variant adds `box-shadow` for a softer look:

```css
.focusable:focus-visible {
  outline: 2px solid var(--ring-color);
  outline-offset: 3px;
  box-shadow: 0 0 0 5px rgba(255,157,92,.18);
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Ring style | Solid | Solid is a plain outline; Dashed draws it in dashes; Glow adds a soft halo; Wide fills the gap between the item and the ring, making one thick band |
| Speed | Normal | How long the ring takes to close in: slow is 220ms, normal 140ms and fast 80ms; fast enough not to feel delayed, slow enough to see |
| Ring thickness | Medium | Thin is 1px, medium 2px and thick 4px; 2px or more is easy to see |
| Ring gap | Small | The space between the ring and the item: none, 3px or 6px; 2 to 4px looks natural |

## Production notes
- **Never use `:focus` alone** — it fires on mouse clicks in all browsers, creating unwanted rings that designers suppress by setting `outline: none` globally, breaking keyboard access entirely. `:focus-visible` solves both problems.
- **Do not globally `outline: none`** — this removes keyboard navigation visibility for all users and is a WCAG failure. Only remove it on elements where you're rebuilding the ring yourself.
- **Browser support**: `:focus-visible` is supported in all modern browsers (Chrome 86+, Firefox 85+, Safari 15.4+). For older browsers, use the `focus-visible` polyfill from WICG.
- **Framer Motion**: focus ring animations are best kept in CSS — JS animation of outline-offset is less performant. Framer Motion's `whileFocus` works for `box-shadow` glow variants.
- **Design tokens**: expose ring color as a design token. Systems like Radix UI and shadcn/ui wire focus ring color to the theme's primary accent automatically.

## See also
- [Form Field Morph](../form-field-morph/) — the label moves up when a field is focused
- [Hover State Animation](../hover-state/) — items react when the pointer is over them
- [Button Press Scale](../button-press-scale/) — the button shrinks while it is pressed
