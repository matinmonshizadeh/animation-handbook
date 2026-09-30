# Snap Scrolling

[Live demo](index.html)

## What it is

Snap scrolling makes a scrolling area settle on set points instead of stopping anywhere. When you stop scrolling, the browser pulls the view to the nearest section, so each section is shown whole, like turning pages. The browser does the pulling on its own; no script is needed for it.

## When to use it

- Landing pages where each section is a complete unit of information and partial views are awkward
- Mobile-first presentations where swipe-based pagination matches native app conventions
- Slideshows, product galleries, and feature walkthroughs with a defined number of discrete steps
- Any layout where mid-section scroll positions feel accidental rather than intentional

## How it works

Three CSS properties implement the entire mechanism:

```css
/* On the scroll container */
.scroller {
  overflow-y: auto;
  container-type: size;          /* 100cqh is the box's height */
  scroll-snap-type: y mandatory; /* or 'y proximity' */
}

/* On each section */
.section {
  height: 100cqh;                /* one box tall */
  scroll-snap-align: start;
}
```

`mandatory` forces a snap on every scroll-end. `proximity` snaps only when the user is close to a snap point. `none` disables snapping. The Snapping setting switches between the three through a `data-snap` attribute that three CSS rules read. While the Play button scrolls the box, a shared rule turns snapping off on it, and the page's own snapping applies again when it stops.

The dots scroll to their section; leaving out `behavior` lets the box's own `scroll-behavior` decide, so it glides, or jumps under reduced motion:

```js
scroller.scrollTo({ top: sectionIndex * scroller.clientHeight });
```

Current section is derived from scroll position:

```js
const sectionIndex = Math.round(scroller.scrollTop / scroller.clientHeight);
```

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Snapping | Always | Always settles on a section after every scroll; when close settles only when the box stops near one; off never snaps |

## Production notes

- **CSS is the entire mechanism.** Snap scrolling requires no JavaScript for the snapping itself. JS is only needed for auxiliary UI — pagination indicators, jump buttons, or syncing external state to the current section.
- **`mandatory` vs. `proximity`.** Use `mandatory` when every section is viewport-height and partial views are never desirable. Use `proximity` when sections have varying heights or when you want snap behavior only on deliberate gestures. `mandatory` with small scroll steps (keyboard arrows) can feel locked and jarring.
- **Mobile Safari.** iOS Safari has historically had issues with `scroll-snap-type` inside overflow containers. Test on real devices. Workarounds include using `overflow: auto` instead of `scroll`.
- **No library needed.** Unlike most other entries in this handbook, snap scrolling requires nothing beyond the browser. The feature is native and well-supported across all modern browsers.
- **Accessibility.** Snap scrolling can frustrate keyboard users who expect continuous scroll. Ensure the `Tab` key navigates between sections, section headings are focusable, and skip-nav links exist.

## See also

- [Stacking Cards](../stacking-cards/) — cards pile into a deck as you scroll
- [Section Wipe](../section-wipe/) — each section slides up over the one before
- [Fly-in Fly-out Contact List](../fly-in-fly-out-contact-list/) — rows fade and slide as they near the edges
