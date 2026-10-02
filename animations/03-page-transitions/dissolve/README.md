# Dissolve

## What it is
A dissolve breaks a page change into a grid of tiles. Each tile fades in over the old page at a slightly different moment, so the old page seems to break up into grain or blocks rather than fading evenly. The order of the tiles — random, a diagonal sweep or rings from the middle — gives the dissolve its texture.

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
  // radial: tile-centre distance, normalised so the corners land at 1
  return Array.from({length: total}, (_, i) => {
    const r = Math.floor(i / n) - (n - 1) / 2, c = i % n - (n - 1) / 2;
    return Math.sqrt(r * r + c * c) / (Math.SQRT2 * (n - 1) / 2);
  });
}
```

Each tile's inline style bakes the normalized delay into a real transition: `transition: opacity <fadeDur>ms ease <delay>ms`. The delays are computed in pure JS and applied per element, so the browser handles all the actual animation — no per-frame loop.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Pattern | Random | The order the tiles appear in: random looks like grain, diagonal sweeps from one corner, and from the middle spreads out in rings |
| Tile size | Medium | How big the tiles are: small is a 16 by 16 grid (10 by 10 on phones), medium 8 by 8 and large 4 by 4; small tiles come close to a smooth fade |
| Speed | Normal | How long the tiles take: slow is 1300ms, normal 800ms and fast 500ms; the page swaps at 60% of it, under the tiles |
| Dissolves both ways | off | Also fades the tiles away in the same pattern to reveal the new page, instead of removing them at once |

## Production notes
- **Random needs a stable order.** Shuffling the tile order once and mapping each tile to its rank keeps the pattern coherent; re-randomizing per frame would flicker. This demo shuffles a single order array and reuses it.
- **Tile count is a cost knob.** A 16×16 grid is 256 animated elements. The fades themselves are cheap, because each tile only transitions `opacity`, but creating and styling that many elements makes the frame that starts the dissolve slow on phones, so the demo draws Small as 10×10 there. Much finer grids also cost layout and memory; beyond ~24×24 a canvas or a noise-texture mask is a better tool.
- **Swap timing.** The page underneath is swapped while enough tiles are opaque to hide it (here at ~60% of the duration). Swap too early and the incoming page shows through gaps; too late and the reveal feels delayed.
- **Library equivalents.** The View Transitions API can dissolve with a masked `::view-transition-old` but does not offer per-tile stagger out of the box — a generated mask image is the native route. GSAP's `stagger` with a `grid` and `from: 'random'` reproduces this directly. Shader-based dissolves sample a noise texture against a rising threshold, which is the same idea at pixel granularity.

## See also
- [Crossfade Transition](../crossfade/) — an even fade with no tiles
- [Flash / Light Leak Transition](../flash-transition/) — a burst of light hides the change
- [Blur Transition](../blur-transition/) — a blur hides the change
- [Slide Transition](../slide-transition/) — pages move instead of dissolving
- [Shatter Effect](../../02-entrance-and-exit/shatter-effect/) — a card breaks into pieces that fly apart and fade
