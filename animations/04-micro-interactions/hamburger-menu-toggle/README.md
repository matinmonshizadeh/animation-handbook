# Hamburger Menu Toggle

## What it is
A three-line "hamburger" icon that morphs into an ✕ when activated. The same
three bars serve both states: the top and bottom bars rotate toward the center
to form the cross, and the middle bar fades out. It signals that a hidden menu
has opened without swapping to a different icon.

## When to use it
- Compact top bars where a full navigation list will not fit, most often on mobile or narrow tablet layouts.
- Any panel, drawer, or off-canvas menu whose open/closed state you want the trigger itself to reflect.
- Cases where you want a single control to communicate "tap to open" and "tap to close" without a second button.

## How it works
The bars are three absolutely positioned spans stacked inside a fixed-height
box. Toggling `aria-expanded` on the button flips the styling: the outer bars
translate to the vertical center and rotate ±45°, and the middle bar drops its
opacity. Because only `transform` and `opacity` change, the morph stays on the
compositor.

```css
.bar{transition:transform var(--dur) var(--ease),opacity calc(var(--dur)*.6) var(--ease)}
.burger[aria-expanded="true"] .bar.top{transform:translateY(16px) rotate(45deg)}
.burger[aria-expanded="true"] .bar.mid{opacity:0;transform:scaleX(.2)}
.burger[aria-expanded="true"] .bar.bot{transform:translateY(-16px) rotate(-45deg)}
```

The `translateY` value must equal the distance from each outer bar to the box
center so the two lines meet exactly; `transform-origin:center` keeps the
rotation pivot on that meeting point.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| `--dur` | `340ms` | Length of the morph. Below ~200ms it snaps; above ~500ms it drags. |
| `--ease` | `cubic-bezier(.65,0,.35,1)` | Timing curve. A back/overshoot curve adds a small spring on the cross. |
| `--bar-w` | `44px` | Bar length; also the visual width of the icon. |
| `--bar-h` | `4px` | Bar thickness. Thicker bars read better at small sizes. |
| `translateY` | `16px` | Vertical travel that brings the outer bars together — tie it to the box height. |

## Production notes
Toggle `aria-expanded` on a real `<button>` (not a `<div>`) and update
`aria-label` between "Open menu" and "Close menu" so assistive tech announces
the current state; wire the button to the panel with `aria-controls`. Mark the
bars `aria-hidden="true"` since they are decorative. Honor
`prefers-reduced-motion` by cutting the transitions to an instant swap. If the
`translateY` offset is hardcoded, changing the icon size or bar thickness will
misalign the cross — derive it from the box height. Framer Motion expresses the
same thing with `animate` variants per bar; a CSS-only version can drive the
morph from a hidden checkbox (`:checked ~`) instead of JavaScript, at the cost
of the ARIA state.

## See also
- [Toggle / Switch Slide](../toggle-switch/)
- [Drawer Slide](../drawer-slide/)
- [Modal Expand](../modal-expand/)
