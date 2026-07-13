# Dissolve

## What it is
A dissolve is a non-uniform fade: the screen is divided into a grid of tiles, and each tile fades at a slightly different time according to a delay pattern. Because regions disappear out of sync, the change reads as the old scene dissolving into grain rather than the whole image fading at once. The delay pattern — random, diagonal, or radial — determines the texture of the wipe.

## When to use it
- Transitions that want more texture than a plain crossfade but less drama than a slide or zoom
- Photo and video contexts where a film-style dissolve matches the medium
- Retro or glitch aesthetics, where a coarse tile grid evokes pixel-era screen wipes
- Directional reveals (diagonal, radial) that hint at where the eye should travel next

## How it works
A grid overlay of `n × n` empty tiles is built over the outgoing page. Each tile gets a per-tile `transition-delay` from a pattern function, then all tiles are faded to opaque at once — the staggered delays produce the dissolve. The page swap happens partway through, hidden under the tiles, and the overlay is cleared (or optionally faded back out for a symmetric dissolve-in).

```js
function getDelays(n, style) {
  const total = n * n;
  if (style === 'random') {                       // shuffle tile order
    const order = Array.from({length: total}, (_, i) => i).sort(() => Math.random() - 0.5);
    return order.map((_, i) => order.indexOf(i) / total);
  }
  if (style === 'diagonal') {                      // (row + col) sweep
    return Array.from({length: total}, (_, i) => {
      const r = Math.floor(i / n), c = i % n;
      return (r + c) / (2 * (n - 1));
    });
  }
  // radial: distance from the grid center
  return Array.from({length: total}, (_, i) => {
    const r = Math.floor(i / n) - n / 2, c = i % n - n / 2;
    return Math.sqrt(r * r + c * c) / Math.sqrt(2) * n / 2 / (n * 0.8);
  });
}
```

Each tile's inline style bakes the normalized delay into a real transition: `transition: opacity <fadeDur>ms ease <delay>ms`. The delays are computed in pure JS and applied per element, so the browser handles all the actual animation — no per-frame loop.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Dissolve style | random | `random` = grain, `diagonal` = sweep, `radial` = wipe from center out |
| Granularity | 8×8 | Tile count. Coarse reads as blocks; fine (16×16) approaches a smooth fade |
| Duration | 800ms | Total wipe time; the swap fires at ~60% through, under the tiles |
| Dissolve in + out | off | Fades tiles back out over the new page for a symmetric transition |
| Show tile mask | off | Outlines each tile in red to expose the grid structure |

## Production notes
- **Random needs a stable order.** Shuffling the tile order once and mapping each tile to its rank keeps the pattern coherent; re-randomizing per frame would flicker. This demo shuffles a single order array and reuses it.
- **Tile count is a cost knob.** A 16×16 grid is 256 animated elements — still cheap because each only transitions `opacity`, but pushing much finer starts to cost layout and memory. Beyond ~24×24 a canvas or a noise-texture mask is a better tool.
- **Swap timing.** The page underneath is swapped while enough tiles are opaque to hide it (here at ~60% of the duration). Swap too early and the incoming page shows through gaps; too late and the reveal feels delayed.
- **Library equivalents.** The View Transitions API can dissolve with a masked `::view-transition-old` but does not offer per-tile stagger out of the box — a generated mask image is the native route. GSAP's `stagger` with a `grid` and `from: 'random'` reproduces this directly. Shader-based dissolves sample a noise texture against a rising threshold, which is the same idea at pixel granularity.

## See also
- [Crossfade](../crossfade/) — the uniform fade this breaks into staggered tiles
- [Flash / Light Leak](../flash-transition/) — another overlay that hides the swap
- [Blur Transition](../blur-transition/) — a softer non-tiled way to mask the change
- [Slide Transition](../slide-transition/) — a directional wipe without the tile texture
