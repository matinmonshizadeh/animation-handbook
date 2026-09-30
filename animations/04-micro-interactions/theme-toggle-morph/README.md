# Theme Toggle Morph

## What it is
A theme toggle morph is one icon that turns from a sun into a crescent moon when you switch a site from light to dark. The sun's rays shrink into its center while a hidden circle slides across the sun and cuts it into a crescent, so the two states are clearly the same shape changing. In the demo, a small preview card flips to its dark side at the same time.

## When to use it
- The header or settings control that switches an interface between light and dark mode.
- Any binary appearance toggle where the two options have natural iconography (sun/moon, on/off, day/night).
- Places where a plain checkbox would feel abrupt and a short morph makes the state change legible without a full page flash.

Reach for a plain labeled switch instead when the control sits in a dense form, or when users may not read a sun/moon as "theme" without a text label beside it.

## How it works
The icon is one inline SVG: a filled `disc`, a group of eight `line` rays, and a `mask` containing a movable `cutout` circle. In the light state the cutout sits off the disc, so the disc renders whole and the rays are visible. Toggling adds a `.dark` class that scales the rays to zero from the icon's center and slides the cutout circle over the disc — the mask subtracts that overlap, leaving a crescent. A separate flip card rotates on the same duration and easing. The rays, the disc, the cut-out circle and the card change only `transform` and `opacity`. The icon's color fades from orange to lavender through a `color` transition on the button, which the SVG picks up with `currentColor`.

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
| Speed | Normal | How long the change takes: slow is 800ms, normal 500ms and fast 300ms; under about 200ms the crescent forms too fast to see, and over 800ms it drags |
| Feel | Gentle | Gentle eases in and out; Springy overshoots a little, then settles; Even keeps one steady speed |

## Production notes
The control is a real `<button>` whose `aria-label` names the *action* ("Switch to dark theme") and changes with each press, so screen readers say what pressing it will do; leave `aria-pressed` off, because a toggle's name must not change and "Switch to light theme, pressed" contradicts itself (for `aria-pressed`, use a fixed name such as "Dark theme"). The preview card is `aria-hidden` since it only illustrates the effect. On first load, read the user's stored preference and fall back to `prefers-color-scheme`: `const dark = localStorage.getItem('theme') === 'dark' || (localStorage.getItem('theme') === null && matchMedia('(prefers-color-scheme: dark)').matches)`, then set the class and the label before the button is interactive to avoid a flash. Persist the choice to `localStorage` on click so it survives reloads. Respect `prefers-reduced-motion: reduce` by dropping the transitions — the icon still snaps to the correct state, just without the morph. Icon sets like Feather ship the sun and moon as separate SVGs; the mask-based morph here is what libraries such as Framer Motion or GSAP would drive by tweening the mask offset and ray scale on the same timeline.

## See also
- [Toggle / Switch Slide](../toggle-switch/) — a switch that slides between on and off
- [Hamburger Menu Toggle](../hamburger-menu-toggle/) — three lines that turn into an X
- [Checkmark Draw](../checkmark-draw/) — a tick that draws itself
