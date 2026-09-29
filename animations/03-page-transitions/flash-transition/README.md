# Flash / Light Leak

## What it is
A flash transition hides a page change inside a burst of light. A colored layer covers the page and rises to full strength, the page is swapped while it is covered, and the layer then fades away to reveal the new page. The eye reads it as one bright moment, so the swap itself is never seen — the same trick films use to hide a cut.

## When to use it
- Masking a cheap or instant content swap where a crossfade would look flat
- High-energy brand sites, product launches, and portfolio galleries that want punch
- Music, fashion, and event pages where a light leak matches the visual language
- Any navigation where you want the transition itself to read as a deliberate beat, not just plumbing

## How it works
A single absolutely-positioned overlay sits above the pages at a high `z-index`. The transition runs in three phases driven by two `setTimeout` calls: fade the overlay up over `flashIn`, swap the active page at peak opacity, then fade the overlay back down over `flashOut`. The content change happens while the overlay is opaque, so it is invisible.

```js
function doTransition(prev, next) {
  flashEl.style.transition = `opacity ${flashIn}ms ease-in, filter ${flashIn}ms ease`;
  flashEl.style.opacity = intensity;            // fade the flash up
  setTimeout(() => {
    // Peak — swap the page behind the opaque flash
    pages[prev].classList.remove('active');
    pages[next].classList.add('active');
    flashEl.style.transition = `opacity ${flashOut}ms ease-out, filter ${flashOut}ms ease`;
    flashEl.style.opacity = '0';               // fade the flash down to reveal
  }, flashIn);
}
```

The fade-out sets its own transition in the same step as the new opacity, so it runs over `flashOut` rather than `flashIn`. An optional `blur()` filter applied during the flash softens the edge and sells the light-leak feel.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Flash color | White | White reads as a camera flash; gold, cyan and red read as a colored light leak |
| Speed | Normal | How fast the flash rises and fades: slow is 320ms up and 510ms down, normal 200ms and 320ms, fast 120ms and 190ms; the fade is always a little longer than the rise |
| Flash strength | Full | How solid the flash gets: full hides the page change completely; strong (75%) and soft (50%) let it show through |
| Blurs the flash | off | Softens the flash's edges into a glow |

## Production notes
- **Swap only at true peak.** If intensity drops below ~0.9 the content change becomes visible as a hard cut through the overlay. Keep peak opacity high, and only lower it deliberately for a see-through effect.
- **Guard against re-entry.** An `animating` flag blocks new navigations mid-transition; without it a fast double-click can swap pages while the overlay is already fading and expose the seam.
- **Accessibility.** A full-screen white flash can be uncomfortable or trigger photosensitivity. This demo hides the overlay entirely under `prefers-reduced-motion: reduce` and swaps instantly instead — do the same in production, and avoid rapid repeated flashes.
- **Library equivalents.** The View Transitions API can reproduce this by animating a `::view-transition-group` with a flash-colored pseudo-element, though a dedicated overlay is simpler. GSAP timelines chain the fade-in, swap callback, and fade-out cleanly. Barba.js exposes `leave`/`enter` hooks that map directly onto the peak-and-reveal structure.

## See also
- [Crossfade Transition](../crossfade/) — the plain fade this dresses up
- [Dissolve Transition](../dissolve/) — tiles hide the change instead
- [Blur Transition](../blur-transition/) — a blur hides the change instead
- [Portal / Tunnel Zoom](../portal-zoom/) — the next page opens out of a clicked circle
