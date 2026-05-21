# Focus Ring Animation

## What it is
A focus ring is the visible outline that appears around a focused element during keyboard navigation. Animating it — rather than simply toggling it on — makes the transition feel intentional rather than abrupt. The critical implementation detail is using `:focus-visible` instead of `:focus`, so the ring only appears for keyboard users, never for mouse clicks.

## When to use it
- Every interactive element on every page — focus rings are mandatory for WCAG 2.4.7 compliance
- Forms where keyboard navigation between fields must be clearly tracked
- Navigation menus and modal dialogs where Tab order needs visual confirmation
- Any site with keyboard-reliant users (power users, accessibility needs, screen reader users)

## How it works
Remove the browser's default outline entirely, then rebuild it using `:focus-visible` with an animation:

```css
:root {
  --ring-color: #58a6ff;
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
  box-shadow: 0 0 0 5px rgba(88,166,255,.18);
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Duration | 140ms | Fast enough to not feel delayed; slow enough to be visible |
| Ring width | 2px | WCAG 2.4.11 requires 2px minimum |
| Ring offset | 3px | Gap between element edge and ring — 2–4px feels natural |
| Ring color | accent | Must have 3:1 contrast ratio against adjacent colors (WCAG) |

## Production notes
- **Never use `:focus` alone** — it fires on mouse clicks in all browsers, creating unwanted rings that designers suppress by setting `outline: none` globally, breaking keyboard access entirely. `:focus-visible` solves both problems.
- **Do not globally `outline: none`** — this removes keyboard navigation visibility for all users and is a WCAG failure. Only remove it on elements where you're rebuilding the ring yourself.
- **Browser support**: `:focus-visible` is supported in all modern browsers (Chrome 86+, Firefox 85+, Safari 15.4+). For older browsers, use the `focus-visible` polyfill from WICG.
- **Framer Motion**: focus ring animations are best kept in CSS — JS animation of outline-offset is less performant. Framer Motion's `whileFocus` works for `box-shadow` glow variants.
- **Design tokens**: expose ring color as a design token. Systems like Radix UI and shadcn/ui wire focus ring color to the theme's primary accent automatically.

## See also
- [Button Press Scale](../button-press-scale/) — complementary click feedback
- [Form Field Morph](../form-field-morph/) — focus-triggered label animation
- [Hover State Animation](../hover-state/) — pre-click visual affordance
