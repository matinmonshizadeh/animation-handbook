# Theme Toggle Morph

## What it is
A single icon that animates between a sun and a crescent moon to signal a light/dark theme switch. Instead of swapping two static glyphs, the sun's rays retract and an SVG mask slides across the disc to carve a crescent, so the two states are visibly the same shape transforming. Clicking it also flips a small preview card between a light and dark palette so the theme change reads at a glance.

## When to use it
- The header or settings control that switches an interface between light and dark mode.
- Any binary appearance toggle where the two options have natural iconography (sun/moon, on/off, day/night).
- Places where a plain checkbox would feel abrupt and a short morph makes the state change legible without a full page flash.

Reach for a plain labelled switch instead when the control sits in a dense form, or when users may not read a sun/moon as "theme" without a text label beside it.

## How it works
The icon is one inline SVG: a filled `disc`, a group of eight `line` rays, and a `mask` containing a movable `cutout` circle. In the light state the cutout sits off the disc, so the disc renders whole and the rays are visible. Toggling adds a `.dark` class that scales the rays to zero from the icon's center and slides the cutout circle over the disc — the mask subtracts that overlap, leaving a crescent. A separate flip card rotates on the same duration and easing. Only `transform` and `opacity` animate.

```css
.icon line{transform-origin:12px 12px;
  transition:transform var(--morph-dur) var(--morph-ease),opacity var(--morph-dur) var(--morph-ease)}
.icon .cutout{transform:translate(20px,-20px);      /* parked off the disc */
  transition:transform var(--morph-dur) var(--morph-ease)}
.demo.dark .icon line{transform:scale(0);opacity:0} /* rays retract */
.demo.dark .icon .cutout{transform:translate(7px,-4px)} /* slides in → crescent */
```

```html
<circle class="disc" cx="12" cy="12" r="5" mask="url(#moon-mask)"/>
```

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| `--morph-dur` | `500ms` | Length of the ray retraction, mask slide, and card flip. Under ~200ms the crescent forms too fast to read; over ~800ms it drags. |
| `--morph-ease` | `cubic-bezier(.4,0,.2,1)` | Timing curve. An overshoot curve adds a slight settle; linear feels mechanical. |
| `--toggle-size` | `104px` | Rendered icon size; the button padding scales with it. |
| cutout offset | `translate(7px,-4px)` | Final mask position. Larger offset yields a thinner crescent; smaller leaves a gibbous shape. |
| ray `transform-origin` | `12px 12px` | The point rays collapse toward. Off-center origins make them slide rather than shrink in place. |

## Production notes
The control is a real `<button>` with `aria-pressed` reflecting the current mode and an `aria-label` that names the *action* ("Switch to dark theme"), updated on each toggle so screen readers announce the change. The preview card is `aria-hidden` since it only illustrates the effect. On first load, read the user's stored preference and fall back to `prefers-color-scheme`: `const dark = localStorage.getItem('theme') === 'dark' || (localStorage.getItem('theme') === null && matchMedia('(prefers-color-scheme: dark)').matches)`, then set the class and `aria-pressed` before the button is interactive to avoid a flash. Persist the choice to `localStorage` on click so it survives reloads. Respect `prefers-reduced-motion: reduce` by dropping the transitions — the icon still snaps to the correct state, just without the morph. Icon sets like Feather ship the sun and moon as separate SVGs; the mask-based morph here is what libraries such as Framer Motion or GSAP would drive by tweening the mask offset and ray scale on the same timeline.

## See also
- [Toggle / Switch Slide](../toggle-switch/)
- [Hamburger Menu Toggle](../hamburger-menu-toggle/)
- [Checkmark Draw](../checkmark-draw/)
