# Toggle / Switch Slide

## What it is
A toggle switch is an on/off control whose round knob slides across a track, and the track fills with color when it is on. The slide shows the change instead of just flipping it, and its speed and curve decide whether the switch feels mechanical, weighty or springy.

## When to use it
- Settings and preferences panels (notifications on/off, dark mode, feature flags)
- Any binary option where the visual metaphor of a physical switch aids comprehension
- Mobile-first UIs where toggles are more tap-friendly than checkboxes
- Inline toggles within table rows or list items

## How it works
The toggle is built entirely in CSS using a hidden `<input type="checkbox">`. The track background and thumb position both transition on `:checked`:

```html
<label class="sw">
  <input type="checkbox">
  <span class="track"></span>
  <span class="thumb"></span>
</label>
```

```css
:root {
  --tog-dur: 200ms;
  --tog-ease: cubic-bezier(.4, 0, .2, 1);
  --on-color: #58a6ff;
}

.sw { position: relative; display: inline-block; width: 52px; height: 30px; }
.sw input { position: absolute; opacity: 0; width: 0; height: 0; }

.track {
  position: absolute; inset: 0; border-radius: 15px;
  background: #21262d;
  transition: background var(--tog-dur) var(--tog-ease);
}
.thumb {
  position: absolute; top: 3px; left: 3px;
  width: 24px; height: 24px; border-radius: 50%; background: #fff;
  transition: transform var(--tog-dur) var(--tog-ease);
  box-shadow: 0 1px 4px rgba(0,0,0,.4);
}

.sw input:checked ~ .track { background: var(--on-color); }
.sw input:checked ~ .thumb { transform: translateX(22px); }
.sw input:focus-visible ~ .track { outline: 2px solid #ff9d5c; outline-offset: 2px; }
```

The checkbox itself is invisible, so keyboard focus is drawn on the track beside it; without the last rule, someone tabbing to the switch would see nothing.

For an elastic feel, swap the thumb transition easing to `cubic-bezier(.34, 1.56, .64, 1)` — this causes a slight overshoot before settling.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Speed | Normal | How long the knob takes to slide: slow is 320ms, normal 200ms and fast 120ms; under 120ms feels mechanical, over 350ms sluggish |
| Feel | Gentle | Gentle eases in and out, which gives the knob weight; Smooth starts fast and slows to a stop; Even slides at one steady speed |
| Springy knob | on | The third switch's knob goes a little past the end, then settles |
| On color | Blue | The track color when a switch is on; it must stand out from the white knob. The Appearance switch keeps its own orange |

## Production notes
- **Accessibility**: the hidden `<input type="checkbox">` provides keyboard control, `aria-checked` state, and screen reader announcements for free — no JS needed for state management.
- **Label wrapping**: wrapping the entire component in `<label>` makes the full surface (track + thumb) the click/tap target — no `for`/`id` wiring required. The demo's switch names are labels too: each name is a `<label for>` pointing at its checkbox, so tapping the name flips the switch, and it is the name a screen reader announces.
- **`touch-action: manipulation`**: add this to the label to suppress the 300ms delay on mobile browsers.
- **Elastic easing pitfall**: the spring overshoot in `cubic-bezier(.34,1.56,.64,1)` can clip visually if the thumb reaches the edge of the track before the bounce completes. Add 1–2px of extra track padding to compensate.
- **Headless UI / Radix UI**: `<Switch>` components handle all ARIA and keyboard events. Style via `data-state="checked"` attribute.
- **Framer Motion**: animate the `x` value of a `<motion.div>` between 0 and the track width — simpler than CSS for controlled components.

## See also
- [Button Press Scale](../button-press-scale/) — the button shrinks while it is pressed
- [Form Field Morph](../form-field-morph/) — the label moves up when a field is focused
- [Accordion Open/Close](../accordion/) — a panel opens and closes smoothly
