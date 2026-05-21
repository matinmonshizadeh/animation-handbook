# Form Field Morph

## What it is
Form field morph, also called the floating label pattern, is an input animation where the placeholder label translates upward and scales down when the field receives focus. Unlike a traditional placeholder that disappears on first keystroke, the floating label persists above the input as a visible identifier throughout the entire editing session.

## When to use it
- Any form where screen space is limited and a separate `<label>` above each input would be too tall
- Sign-up, sign-in, and checkout forms
- Settings pages where many fields appear in a compact list
- Mobile forms where vertical space is at a premium

## How it works
The label is positioned absolutely inside the field container, overlapping the input at placeholder height. On focus (or when the input is filled), it transforms upward using `translateY` and `scale`:

```css
:root {
  --field-dur: 200ms;
  --float-dist: 22px;
  --label-scale: 0.8;
  --focus-color: #58a6ff;
}

.float-field { position: relative; padding-top: 20px; }

.float-field label {
  position: absolute;
  left: 0; top: 20px;
  font-size: 12px;
  color: var(--muted);
  pointer-events: none;
  transform-origin: left center;
  transition:
    transform var(--field-dur) ease,
    color var(--field-dur) ease;
}

.float-field input {
  display: block; width: 100%;
  background: transparent;
  border: none; border-bottom: 1px solid var(--border);
  outline: none;
  transition: border-color var(--field-dur) ease;
}

/* Float on focus OR when filled */
.float-field:focus-within label,
.float-field.filled label {
  transform: translateY(calc(var(--float-dist) * -1)) scale(var(--label-scale));
  color: var(--focus-color);
}
```

The `.filled` class is toggled in JavaScript by checking `input.value.length > 0` on `blur` — this keeps the label floated when the user leaves a filled field:

```js
input.addEventListener('blur', () => {
  wrapper.classList.toggle('filled', input.value.trim().length > 0);
});
```

A CSS-only alternative uses `:placeholder-shown` (the placeholder is visible only when the field is empty):

```css
input:not(:placeholder-shown) ~ label,
input:focus ~ label {
  transform: translateY(-22px) scale(0.8);
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Duration | 200ms | 120–250ms; slower feels heavy on forms with many fields |
| Float distance | 22px | Must clear the input text height with a small gap |
| Label scale | 0.8 | 0.75–0.85 — readable but visually subordinate to input text |
| Focus color | accent | Reinforces which field is active |

## Production notes
- **The filled-state retention bug**: the most common mistake is animating on `:focus-within` alone. When the user tabs to the next field, the label snaps back even though the field is filled. Always combine with a filled class or `:placeholder-shown`.
- **Placeholder text conflict**: floating labels and placeholder text serve the same purpose — don't use both. If using floating labels, leave the `placeholder` attribute blank or set it to a single space `" "` (needed for `:placeholder-shown` CSS detection).
- **Box style variant**: the demo includes a box-style (Material-style) floating label where the label floats inside the border, not above it. This works better with bordered inputs than underline-only inputs.
- **`transform-origin: left center`**: without this, the label scales from its center, shifting position horizontally.
- **Accessibility**: always use a real `<label>` element (not `aria-label` or `placeholder` alone). Screen readers announce the label text; `placeholder` text is not reliably announced.
- **React Hook Form + Floating UI**: common pairing in production. The float state is controlled via `formState.dirtyFields` or watched field values.

## See also
- [Focus Ring Animation](../focus-ring/) — complementary keyboard-focus indicator
- [Toggle / Switch Slide](../toggle-switch/) — another input state transition pattern
- [Accordion Open/Close](../accordion/) — expand/collapse with height animation
