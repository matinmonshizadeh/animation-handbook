# Ink Spread Reveal

[Live demo](https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/ink-spread-reveal/)

## What it is
An ink spread reveal uncovers a picture the way ink spreads on damp paper. The picture starts hidden under a plain paper-colored layer, drops land one after another, and each spreads into a blot with an uneven edge; the blots grow, merge and finally show the whole picture. Each blot races outward at first and slows as it soaks in, which is what makes it read as ink rather than as a shape growing.

## When to use it
- The opening picture of an art, illustration or portfolio site
- A featured artwork or photo that deserves a slower entrance
- Intros for stories, posters and event pages with a hand-made look
- Section openers on pages about painting, calligraphy or print

## How it works
The picture sits under an SVG mask. The mask holds one white blot per drop: white shows the picture and everything else stays paper. Each blot is made once, from a circle whose radius wanders with a few slow waves and a few small fast ones, so its edge looks uneven and feathery; Splashy adds small drops thrown around it. A seeded random sequence makes the same blots on every redraw.

```js
// One blot of radius 1: a circle whose radius wanders with six waves, the slow ones larger. wob is how far it may wander.
function unitBlot(rand, wob, dots) {
  const waves = [2, 3, 5, 9, 14, 23].map((n, i) => [n, (rand() * 2 - 1) / (i < 3 ? 1 : 2.6), rand() * 6.283]);
  const sum = waves.reduce((s, w) => s + Math.abs(w[1]), 0) || 1;
  waves.forEach(w => { w[1] *= wob * 1.8 / sum; });
  const pts = []; let min = 1;
  for (let i = 0; i < 96; i++) {
    const a = i / 96 * 6.283; let k = 1;
    for (const [n, amp, ph] of waves) k += amp * Math.sin(n * a + ph);
    min = Math.min(min, k); pts.push([Math.cos(a) * k, Math.sin(a) * k]);
  }
  const splash = [...Array(dots)].map(() => { const a = rand() * 6.283, d = 1.08 + rand() * .3; return [Math.cos(a) * d, Math.sin(a) * d, .022 + rand() * .04]; });
  return { pts, splash, min };
}
```

Each blot's full size is worked out so the blots cover the whole picture together: every spot of the picture belongs to its nearest drop, and that drop's blot is made large enough to reach the farthest of its spots, even where its outline dips in (the radius is divided by the outline's smallest reach). The blot then grows by scaling that same shape from where its drop lands, with an ease that starts fast and slows down, each drop a moment after the one before:

```js
grows.forEach(el => el.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)' }],
  { duration: 1800, delay: +el.dataset.i * 360, easing: 'cubic-bezier(.15,.7,.25,1)', fill: 'both' }));
```

```html
<svg viewBox="0 0 900 440">
  <defs><mask id="ink"><g transform="translate(216 185)"><g class="grow" data-i="0"><path fill="#fff" d="…"/></g></g></mask></defs>
  <rect class="paper" width="900" height="440"/>
  <g class="edge"><!-- the same blots a little larger, dark --></g>
  <g mask="url(#ink)"><!-- the picture --></g>
</svg>
```

A dark copy of each blot, 4% larger, sits under the picture and shows as a rim just ahead of it. When the last blot has grown, Loop holds the picture, fades it back to paper and plays again. Under reduced motion the whole picture fades in instead.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Where the ink lands | Several drops | One drop lands in the middle; several drops are three that land in turn across the picture; from a corner, three drops land one after another from the top left toward the bottom right |
| Speed | Normal | How long it takes to cover the picture: slow is about 3.6 seconds (each blot grows for 2.6 seconds, the drops half a second apart), normal 2.5 seconds (1.8 seconds, a third of a second apart) and fast 1.5 seconds (1.1 seconds, a fifth of a second apart) |
| Edge | Ragged | Smooth grows round circles; ragged lets each outline wander by about a tenth of its radius; splashy adds nine small drops around each blot (five on phones) |
| Dark ink edge | on | A dark copy of each blot, a little larger, shows as a rim just ahead of the picture; off, the picture shows with no rim |

## Production notes
- **A mask is repainted.** Animating the shapes inside an SVG mask repaints the masked picture on every frame. That is fine for one picture of this size; for a full-screen hero on slow phones, draw the blots on a canvas and use it as a `mask-image`, or reveal a canvas copy of the picture directly.
- **Scale, never redraw.** Build each blot's outline once and grow it with `transform: scale()`. Rewriting the path every frame makes the browser parse and lay it out again.
- **Cover the corners.** Blots that look big enough in the middle often leave the corners as paper. Size each blot from the spots it has to reach, or let the last drop be the largest.
- **Reduced motion.** Fade the picture in instead of growing blots.
- **GSAP** grows the blots with `gsap.fromTo(".grow", { scale: 0 }, { scale: 1, duration: 1.8, ease: "power3.out", stagger: 0.36, transformOrigin: "0 0" })`; set the origin so each grows from its drop. **Framer Motion** animates each blot `<motion.path>` inside a `<mask>` from `scale: 0` to `scale: 1` with `transition={{ delay: i * 0.36, ease: [0.15, 0.7, 0.25, 1] }}`.
- **Real ink.** A scanned ink blot or a short ink video used as a luminance mask looks richest; keep it small and fall back to the drawn blots.

## See also
- [Clip-Path Reveal](../clip-path-reveal/) — a clean shape grows to uncover a picture
- [Circle Reveal](../../03-page-transitions/circle-reveal/) — one circle grows from a click to show the next page
- [Curtain Reveal](../curtain-reveal/) — a colored panel covers it, then slides away
- [Fade In / Fade Out](../fade-in-out/) — the plain fade this becomes under reduced motion
