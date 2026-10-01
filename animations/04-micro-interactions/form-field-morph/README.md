# Form Field Morph

## What it is
Form field morph, also called a floating label, starts with each field's label inside the field, like a placeholder. When you click into the field or type in it, the label moves up and shrinks, so it stays visible above your text instead of disappearing the way a placeholder does.

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

The `.filled` class is toggled in JavaScript by checking that the input holds text other than spaces, both while typing and when the field loses focus — this keeps the label floated when the user leaves a filled field:

```js
function syncFilled() {
  wrapper.classList.toggle('filled', input.value.trim().length > 0);
}
input.addEventListener('input', syncFilled);
input.addEventListener('blur', syncFilled);
```

In the demo, Show me plays the effect by adding an `is-demo` class to a field instead of moving your focus, so the focus rules there list it next to `:focus-within`. You do not need it in your own form.

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
| Speed | Normal | How long the label takes to move: slow is 320ms, normal 200ms and fast 120ms; slower feels heavy on a form with many fields |
| How far it rises | Medium | How far the label moves up on the underlined fields: low is 16px, medium 22px and high 28px; it must clear the typed text |
| Size when raised | Medium | How big the raised label is on the underlined fields: small is 70%, medium 80% and large 90% of its size |
| Focus color | Blue | The color of the raised label and the active line or border |

## Production notes
- **The filled-state retention bug**: the most common mistake is animating on `:focus-within` alone. When the user tabs to the next field, the label snaps back even though the field is filled. Always combine with a filled class or `:placeholder-shown`.
- **Placeholder text conflict**: floating labels and placeholder text serve the same purpose — don't use both. If using floating labels, leave the `placeholder` attribute blank or set it to a single space `" "` (needed for `:placeholder-shown` CSS detection).
- **Box style variant**: the demo includes a box-style (Material-style) floating label where the label floats inside the border, not above it. This works better with bordered inputs than underline-only inputs.
- **`transform-origin: left center`**: without this, the label scales from its center, shifting position horizontally.
- **Accessibility**: always use a real `<label>` element (not `aria-label` or `placeholder` alone). Screen readers announce the label text; `placeholder` text is not reliably announced.
- **React Hook Form + Floating UI**: common pairing in production. The float state is controlled via `formState.dirtyFields` or watched field values.

## See also
- [Focus Ring Animation](../focus-ring/) — a ring shows which item the keyboard is on
- [Toggle / Switch Slide](../toggle-switch/) — a switch slides between on and off
- [Accordion Open/Close](../accordion/) — a panel opens and closes smoothly
- [Expanding Search](../expanding-search/) — a search icon opens into a field you can type in
