# Snap Scrolling

[Live demo](index.html)

## What it is

Snap scrolling makes the viewport magnetize to predefined scroll positions after the user releases a scroll gesture. Instead of stopping at an arbitrary mid-section position, the browser eases to the nearest snap point. The effect creates a deliberate, paginated feel — sections become destinations rather than arbitrary points in a continuous stream. This demo uses the native CSS `scroll-snap-type` and `scroll-snap-align` properties. No JavaScript drives the magnetism; the browser handles it entirely.

## When to use it

- Landing pages where each section is a complete unit of information and partial views are awkward
- Mobile-first presentations where swipe-based pagination matches native app conventions
- Slideshows, product galleries, and feature walkthroughs with a defined number of discrete steps
- Any layout where mid-section scroll positions feel accidental rather than intentional

## How it works

Three CSS properties implement the entire mechanism:

```css
/* On the scroll container */
.stage {
  overflow-y: scroll;
  scroll-snap-type: y mandatory; /* or 'y proximity' */
}

/* On each section */
.section {
  height: 620px;            /* matches the container height */
  scroll-snap-align: start;
}
```

`mandatory` forces a snap on every scroll-end. `proximity` snaps only when the user is close to a snap point. `none` disables snapping. The mode toggle in the demo changes `scroll-snap-type` live.

Pagination dots and jump-to buttons use `scrollTo` with `behavior: 'smooth'`:

```js
stage.scrollTo({ top: sectionIndex * sectionHeight, behavior: 'smooth' });
```

Current section is derived from scroll position:

```js
const sectionIndex = Math.round(stage.scrollTop / sectionHeight);
```

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| `scroll-snap-type` | `y mandatory` | `mandatory` = always snaps; `proximity` = snaps when close; `none` = off |
| `scroll-snap-align` | `start` | Where the snap point lands: `start`, `center`, or `end` |
| `scroll-behavior` | `smooth` | Affects programmatic `scrollTo` calls, not the snap itself |
| Section height | `620px` | Must match stage height for full-page snapping |

## Production notes

- **CSS is the entire mechanism.** Snap scrolling requires no JavaScript for the snapping itself. JS is only needed for auxiliary UI — pagination indicators, jump buttons, or syncing external state to the current section.
- **`mandatory` vs. `proximity`.** Use `mandatory` when every section is viewport-height and partial views are never desirable. Use `proximity` when sections have varying heights or when you want snap behavior only on deliberate gestures. `mandatory` with small scroll steps (keyboard arrows) can feel locked and jarring.
- **Mobile Safari.** iOS Safari has historically had issues with `scroll-snap-type` inside overflow containers. Test on real devices. Workarounds include using `overflow: auto` instead of `scroll`.
- **No library needed.** Unlike most other entries in this handbook, snap scrolling requires nothing beyond the browser. The feature is native and well-supported across all modern browsers.
- **Accessibility.** Snap scrolling can frustrate keyboard users who expect continuous scroll. Ensure the `Tab` key navigates between sections, section headings are focusable, and skip-nav links exist.

## See also

- [Stacking Cards](../stacking-cards/) — another paginated-feel scroll pattern, implemented with sticky stacking rather than snap.
- [Fly-in Fly-out Contact List](../fly-in-fly-out-contact-list/) — continuous scroll with per-element transitions rather than section-level snapping.
