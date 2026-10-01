# Gooey Menu

## What it is
A gooey menu is a round button that lets smaller buttons ooze out of it like drops of liquid, and pulls them back in when it is pressed again. The drops are plain circles moving apart; a filter blurs them and then sharpens the blurred edge again, so circles that come close melt into one shape and a neck of liquid stretches between them until it snaps.

## When to use it
- Floating action buttons in mobile apps that hold three or four quick actions
- Share menus (share, like, save) on posts, photos and products
- Playful brands, games and portfolios where a little personality fits
- Tools that should stay folded away until they are needed

## How it works
The stage has two layers. The lower one holds only circles of one color: a big one under the round button and, for each small button, a circle and a smaller "tail" circle. This layer, and nothing else, goes through an SVG filter:

```html
<svg width="0" height="0"><filter id="goo" color-interpolation-filters="sRGB">
  <feGaussianBlur stdDeviation="9"/>
  <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"/>
</filter></svg>
```

The blur spreads each circle's edge into a soft ramp. The color matrix keeps the color, multiplies the alpha by 20 and subtracts 9: where the blurred alpha is under about one half the pixel turns clear, and over it solid, so the soft edge snaps back to a hard one. Two circles that come close add their soft edges together past that line and read as one shape with a smooth neck; as they part, the neck thins and snaps. A bigger blur (How gooey) lets them reach farther. The demo scales the blur with the size of the menu, takes a fifth off it on phones, and for a bigger blur raises the 20 to 2.2 times the blur, still cutting at an alpha of 0.475, so the edge stays sharp.

The circles move with transitions on `transform` only:

```css
.goo { filter: url(#goo); }   /* only as big as the open menu: the filter's cost grows with its area */
.goo i { border-radius: 50%; background: #ff9d5c; }
.blob { transform: translate(0, 0) scale(.5);   /* closed: waiting inside the big circle */
        transition: transform 480ms cubic-bezier(.55, -.25, .75, .25) var(--back); }
.open .blob { transform: translate(var(--x), var(--y)) scale(1);
              transition: transform 600ms cubic-bezier(.3, 1.4, .55, 1) var(--out); }
.tail { transform: translate(0, 0) scale(.4);
        transition: transform 570ms cubic-bezier(.55, -.25, .75, .25) calc(var(--back) + 72ms); }
.open .tail { transform: translate(var(--x), var(--y)) scale(.6);
              transition: transform 810ms cubic-bezier(.25, .8, .3, 1) calc(var(--out) + 60ms); }
```

Opening, each circle pops a little past its place and settles (the curve's 1.4 goes above 1), while its tail follows later and slower, so for a moment the round button, the tail and the circle form one stretched drop. Closing, the circle first leans out a little (the curve's −0.25), then is pulled in faster and faster with its tail trailing behind. `--out` starts each circle 60ms after the one before, and `--back` runs the other way when closing, so the drops leave and return one after another. The big circle swells once each time with a short keyframe animation.

The upper layer holds the real buttons: a see-through round button whose plus turns into a cross, and three small buttons with icons, each moving with the same transform as its circle. The icons stay sharp because they are not in the filter, and the keyboard reaches them. Where each one settles comes from the stage's size: the layouts are written in units of a 64-unit round button, 50-unit small buttons and 20-unit gaps, and one unit is the stage's shorter side, less 28px, divided by 274 (the longest layout), kept between 0.88px and 1.2px so a small button is never under 44px. The round button sits where the open menu is centered, and the filtered layer covers the open menu and 22 units around it.

```js
function setOpen(on) {
  gm.classList.toggle('open', on);
  main.setAttribute('aria-expanded', String(on));
  main.setAttribute('aria-label', on ? 'Close menu' : 'Open menu');
}
main.addEventListener('click', () => setOpen(!isOpen()));
gm.addEventListener('keydown', e => {   // Escape, from any of its buttons
  if (e.key === 'Escape' && isOpen()) { setOpen(false); main.focus({ preventScroll: true }); }
});
```

Closed, the small buttons are hidden (`visibility: hidden` once the closing has ended), so Tab skips them. Pressing one does its job (here a short message says Shared, Liked or Saved, and a status region reads it out), closes the menu and gives the focus back to the round button; a press beside the menu closes it too. Show me presses the round button and then Like without moving the focus, and a press, key, wheel, touch or Tab into the stage stops it. Under reduced motion the filter and the tails are off and nothing travels: the small buttons fade in and out at their places.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Layout | Arc | Row puts the small buttons in a line beside the round one; Arc fans them out above it; Column stacks them above it |
| How gooey | Medium | How much the circles are blurred before the edge is sharpened: low is 5, medium 9 and high 13 (times the menu's scale, and a fifth less on phones); higher keeps the drops joined for longer |
| Speed | Normal | How long a small button takes to pop out: slow is 950ms, normal 600ms and fast 380ms, each starting 90, 60 or 40ms after the one before |
| Shows the plain circles | Off | Turns the filter off and draws each circle as a ring, to show what moves underneath; it is a way to look, so it is not added to the copied prompt |
| Button color | Orange | The color of the circles; the icons stay dark |

## Production notes
- **Keep the filter small**: the browser blurs every pixel of the filtered layer on every frame that something in it moves. Give the filter a layer the size of the open menu, never the whole page, and keep icons and text off it. The demo sizes the layer to the open menu (to both menus while the layout changes) and blurs a fifth less on phones (screens up to 600px wide or 500px tall). At rest nothing is filtered again.
- **Safari**: SVG filters on HTML elements work in Chrome, Firefox and Safari, but they can be slower in Safari. Test on an iPhone; on slow phones lower the blur or use fewer drops.
- **Sharp icons**: an icon inside the filtered layer would be blurred and cut into a blob. Put icons on a layer above, as here, or name the color matrix's result (`result="goo"`) and end the filter with `<feComposite in="SourceGraphic" in2="goo" operator="atop"/>`, so the original drawing is painted back over the goo.
- **One color**: `color-interpolation-filters="sRGB"` keeps the color exact (the default, linearRGB, shifts it at the edges). A gradient on separate circles breaks at every neck, so give the whole layer one fill.
- **The cut**: a filtered circle ends a little inside its real size, more so with a bigger blur. Keep anything drawn on the buttons, such as a sheen or a border, a few pixels inside the edge, or it shows as a thin ring.
- **Accessibility**: the round button is a real `<button>` with `aria-expanded`, `aria-controls` and a label that says Open menu or Close menu; every small button has a name; closed ones are out of the Tab order; Escape closes the menu and returns the focus; the result of a choice is announced.
- **GSAP**: `gsap.to(blobs, { x: i => places[i][0], y: i => places[i][1], scale: 1, duration: 0.6, stagger: 0.06, ease: "back.out(1.7)" })`, and the same on the buttons; the filter stays on its layer.
- **Framer Motion**: give each circle `<motion.i animate={open ? { x, y, scale: 1 } : { x: 0, y: 0, scale: 0.5 }} transition={{ type: "spring", stiffness: 400, damping: 18, delay: i * 0.06 }} />` inside a `<div style={{ filter: "url(#goo)" }}>`.

## See also
- [Morphing Blob](../../06-3d-advanced/morphing-blob/) — the same goo filter on circles that drift by themselves
- [Hamburger Menu Toggle](../hamburger-menu-toggle/) — three lines turn into an X as the menu opens
- [Expanding Search](../expanding-search/) — a search icon opens into a field, then closes when done
- [Modal Expand](../modal-expand/) — a window grows out of the button you pressed
- [Button Press Scale](../button-press-scale/) — the button shrinks while it is pressed
