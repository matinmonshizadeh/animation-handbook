# Expanding Search

## What it is
An expanding search shows only a search icon until it is needed. Pressing the icon opens a search field out of it, over the links beside it, and puts the cursor inside; Escape, the close button or clicking away closes it again. It saves room in a busy toolbar while keeping search one press away.

## When to use it
- Toolbars and headers that are short on room
- Mobile headers, where a full search box would crowd the logo and the menu
- Documentation and help sites, where search is used now and then
- Dashboards and admin tools with many controls in one bar

## How it works
The field is laid out at its full size from the start and never changes size. A `clip-path` with rounded corners hides all of it except a 44px circle over the icon; opening animates the clip until the whole field shows, starting from the icon's side, so nothing beside it is laid out again. `visibility` follows the clip: it turns on at once when the field opens, and only after the closing clip has ended when it closes, so a closed field can be neither clicked nor reached with Tab.

```css
.sfield {
  position: absolute; inset: 0;                          /* full size, over the links */
  visibility: hidden;
  clip-path: inset(0 0 0 calc(100% - 44px) round 22px); /* just the circle over the icon at the right end */
  transition: clip-path 280ms cubic-bezier(.22, 1, .36, 1), visibility 0s linear 280ms;
}
.to-right .sfield { clip-path: inset(0 calc(100% - 44px) 0 0 round 22px); } /* the icon at the left end */
.bar.open .sfield {
  visibility: visible;
  clip-path: inset(0 round 22px);                        /* all of it */
  transition: clip-path 280ms cubic-bezier(.22, 1, .36, 1), visibility 0s;
}
```

```js
function open() { bar.classList.add('open'); icon.setAttribute('aria-expanded', 'true'); icon.inert = true; input.focus(); }
function close(focusIcon) {
  bar.classList.remove('open'); icon.setAttribute('aria-expanded', 'false'); icon.inert = false;
  if (focusIcon) icon.focus();                          // after Escape or the close button
}
icon.addEventListener('click', open);
closeButton.addEventListener('click', () => close(true));
field.addEventListener('keydown', e => { if (e.key === 'Escape') close(true); });
field.addEventListener('focusout', e => {             // leaving it: the focus went somewhere outside the field
  if (closesOnLeave && !field.contains(e.relatedTarget)) close(false);
});
```

The icon stays on top of the field. As the field opens, the icon's background turns see-through and its glass turns and fades away while the close button's cross turns in under it, so one seems to become the other; the links under the field fade out. While the field is open the icon lets presses through and is `inert`, so Tab cannot land on something hidden, and the field shows its focus with an inset ring while anything inside it has the focus. Show me opens the field and types into it without moving the real focus, so it never opens a phone's keyboard. Under reduced motion the transitions are switched off and the field opens and closes at once.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Opens toward | Left | Left puts the icon at the right end of the toolbar and grows the field leftward over the links; Right puts the icon beside the logo and grows the field rightward |
| Speed | Normal | How long the field takes to open or close: slow is 450ms, normal 280ms and fast 160ms; much slower and typing has to wait for it |
| Closes when you leave it | On | On closes the field as soon as the focus moves away, by a click elsewhere or Tab; off keeps it open until Escape or the close button |

## Production notes
- **Never animate the width**: a growing `width` makes the browser lay out the whole toolbar again on every frame, so the items beside it jitter and slower phones drop frames. A clip (or a `scaleX()` background layer with the text faded in after it) only repaints the field.
- **Phones**: iOS Safari zooms the page in on a field whose text is smaller than 16px, so the demo uses 16px on touch screens. On very narrow screens, consider opening the search as a bar over the whole header instead.
- **Keep the keyboard's place**: give the focus back to the icon after Escape or the close button, keep the closed field out of the Tab order (`visibility: hidden` after the closing clip, or `inert`), and make the covered icon `inert` while the field is open.
- **Names for screen readers**: the icon button needs a name ("Search") and `aria-expanded`, the field needs a label (visually hidden is fine), and its container `role="search"` or a `<form role="search">`.
- **Text left behind**: decide what leaving a field that holds text does. The demo closes it and keeps the text for next time; some sites keep a field with text open.
- **GSAP**: `gsap.fromTo(field, { clipPath: "inset(0% 0% 0% 90% round 22px)" }, { clipPath: "inset(0% 0% 0% 0% round 22px)", duration: 0.28, ease: "power3.out" })`; keep the same units on both ends so the values can be blended.
- **Framer Motion**: `<motion.div animate={{ clipPath: open ? "inset(0% 0% 0% 0% round 22px)" : "inset(0% 0% 0% 90% round 22px)" }} transition={{ duration: 0.28 }} />`.

## See also
- [Hamburger Menu Toggle](../hamburger-menu-toggle/) — an icon turns into an X as its menu opens
- [Form Field Morph](../form-field-morph/) — a field's label moves out of the way as you type
- [Focus Ring Animation](../focus-ring/) — a ring shows where the keyboard is
- [Drawer / Panel Slide](../drawer-slide/) — a hidden panel slides in when it is needed
