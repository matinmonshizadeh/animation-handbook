# Hide-on-Scroll Header

## What it is

A hide-on-scroll header is a top bar that gets out of the way while you read. Scrolling down slides it up out of view, so the content gets the whole screen; scrolling back up brings it back, so the menu is always one small move away. Near the top of the page it always shows.

## When to use it

- Mobile sites, where a bar that stays in place takes a large share of a small screen
- News sites, blogs and long articles, where readers mostly scroll down and only now and then want the menu
- Shops and catalogs whose bar holds search and the cart, which visitors want back quickly without scrolling all the way up
- Any sticky header that covers too much of the content while people read

## How it works

The bar is placed over the page (in the demo it sits over the scrolling box; on a real page it is fixed or sticky), and the content gets top padding of the bar's height so nothing starts underneath it. The scroll listener does no work of its own: it asks for one update on the next animation frame. The update compares the scroll position with the last one it acted on. A move down hides the bar, a move up shows it, and anywhere near the top it always shows. A move of a few pixels is ignored, and the last position is only updated when a move counts, so a slow scroll still adds up.

```js
function update() {
  ticking = false;
  const y = Math.min(Math.max(scroller.scrollTop, 0), maxY); // the rubber-band bounce at either end does not count
  if (y <= nearTop) { setAway(false); lastY = y; return; }   // near the top: always shown
  const dy = y - lastY;
  if (Math.abs(dy) < JITTER) return;                         // a few pixels of jitter: ignored
  if (dy > 0) setAway(true);                                 // down: away
  else if (comeBack === 'any') setAway(false);               // up: back (with "Only near the top", only the top does it)
  lastY = y;
}
scroller.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(update); }
}, { passive: true });
```

`setAway()` only toggles a class. The stylesheet moves the bar with a transform, so the page below never reflows; the shrinking version keeps a slim strip of the bar in view and scales its contents to fit it:

```css
.topbar { position: absolute; top: 0; left: 0; right: 0; transition: transform var(--dur) var(--ease); }
.topbar.away { transform: translateY(calc(-100% - 2px)); }                 /* its full height, border included, and 2px to spare */
.shrink .topbar.away { transform: translateY(-18px); }                     /* a slim strip stays */
.shrink .topbar.away .brand { transform: translateY(9px) scale(.82); }    /* centered in the strip */

@media (prefers-reduced-motion: reduce) {
  .topbar { transition: opacity var(--dur) linear; }
  .topbar.away { transform: none; opacity: 0; }                            /* it fades instead of sliding */
}
```

Show me scrolls the box itself, one and a half boxes down and back, with each frame's position worked out from the time since the glide began, so it takes as long on a 120 Hz screen as on a 60 Hz one.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Speed | Normal | How long the slide takes: slow is 700ms, normal 300ms and fast 150ms |
| Comes back | On any scroll up | On any scroll up brings the bar back at the first move up; Only near the top keeps it away until the page is back within two bar heights of the top |
| Shrinks instead of hiding | Off | Keeps a slim strip of the bar in view, with smaller contents, instead of sliding it all away |

## Production notes

- **Sticky or fixed**: on a real page use `position: fixed` (with top padding on the page) or `position: sticky`, and set `scroll-padding-top` to the bar's height so links to headings and focused form fields are not hidden under the bar when it is showing.
- **Keep the threshold**: trackpads and touch screens report many tiny moves and small reversals. Without a few pixels of tolerance the bar flickers in and out.
- **Clamp the position**: iOS rubber-band scrolling reports negative positions at the top and positions past the end at the bottom. The bounce back from the end would otherwise read as a scroll up and pop the bar back in.
- **Keyboard users**: show the bar when focus moves into it (`:focus-within`), or a visitor tabbing to the menu ends up on links they cannot see.
- **Transform only**: never animate `top`, `margin` or `height`. Moving the bar with a transform keeps it on the compositor, and the shrinking version scales the contents instead of changing font sizes.
- **Reduced motion**: fade the bar out and in, or leave it in place, instead of sliding it.
- **Do not hide key actions**: a bar that holds the main button of the page (checkout, compose, save) should stay.
- **Libraries**: Headroom.js does exactly this, with options for the threshold and the offset from the top; in React or Vue a small scroll-direction hook does the same. Newer versions of Chromium add scroll-state container queries that can tell which way a box last scrolled, aimed at exactly this, but CSS alone cannot do it in every browser yet, so the direction check stays in JavaScript here.

## See also

- [Cover Card to Fixed Header](../cover-card-to-fixed-header/) — a tall cover shrinks into a slim header as you scroll
- [Scrollspy Navigation](../scrollspy-nav/) — a menu highlights the section you are reading
- [Progress Bar](../progress-bar/) — a bar fills as you read down the page
- [Smooth (Inertia) Scroll](../smooth-scroll/) — scrolling glides to a stop instead of jumping
