# Flash / Light Leak

## What it is
A flash transition covers the screen with a colored overlay that peaks at full opacity, swaps the page content while it is hidden, then fades the overlay away to reveal the new scene. The eye reads the overexposure as a single continuous moment, so the underlying content swap is never seen. Cinema uses the same trick to hide edits inside a burst of light.

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
    document.getElementById('p' + prev).classList.remove('active');
    document.getElementById('p' + next).classList.add('active');
    requestAnimationFrame(() => {
      flashEl.style.transition = `opacity ${flashOut}ms ease-out, filter ${flashOut}ms ease`;
      flashEl.style.opacity = '0';               // fade the flash down to reveal
    });
  }, flashIn);
}
```

The swap is deferred to a `requestAnimationFrame` after the class change so the browser commits the new transition before starting the fade-out. An optional `blur()` filter applied during the flash softens the edge and sells the light-leak feel.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Flash-in duration | 200ms | Ramp to peak. Faster feels like a camera strobe; slower feels like a wash |
| Flash-out duration | 320ms | Reveal ramp. Usually longer than the in, so the new page eases into view |
| Intensity (peak opacity) | 1.00 | Below 1.0 lets the swap show through faintly — keep at 1.0 to fully hide it |
| Flash color | white | White reads as overexposure; tinted (gold, cyan) reads as a stylized light leak |
| Blur during flash | off | Adds a soft bloom to the peak, disguising the hard overlay edge |

## Production notes
- **Swap only at true peak.** If intensity drops below ~0.9 the content change becomes visible as a hard cut through the overlay. Keep peak opacity high, and only lower it deliberately for a see-through effect.
- **Guard against re-entry.** An `animating` flag blocks new navigations mid-transition; without it a fast double-click can swap pages while the overlay is already fading and expose the seam.
- **Accessibility.** A full-screen white flash can be uncomfortable or trigger photosensitivity. This demo hides the overlay entirely under `prefers-reduced-motion: reduce` and swaps instantly instead — do the same in production, and avoid rapid repeated flashes.
- **Library equivalents.** The View Transitions API can reproduce this by animating a `::view-transition-group` with a flash-colored pseudo-element, though a dedicated overlay is simpler. GSAP timelines chain the fade-in, swap callback, and fade-out cleanly. Barba.js exposes `leave`/`enter` hooks that map directly onto the peak-and-reveal structure.

## See also
- [Crossfade](../crossfade/) — the plain opacity blend this technique dresses up
- [Dissolve](../dissolve/) — another overlay-masked swap, tiled instead of solid
- [Blur Transition](../blur-transition/) — defocus rather than overexposure to hide the change
- [Portal / Tunnel Zoom](../portal-zoom/) — a clip-path reveal that also masks the swap
