# Blur Transition

## What it is
A blur transition defocuses the current page until it fades out, then brings the incoming page in from blurred to sharp. The effect mimics a camera pulling focus between two subjects, so the change of scene reads as a shift of attention rather than a hard cut. Blur and opacity animate together for a soft, cinematic wipe.

## When to use it
- Transitions between visually rich pages where a hard cut feels abrupt
- Photography, film, and editorial sites where a rack-focus metaphor fits the content
- Modal or detail views that should feel like the background recedes out of focus
- User-initiated navigation only — never on autoplaying carousels, where the cost adds up

## How it works
The outgoing page transitions its `filter` (and optionally `opacity`) up to a maximum blur, then the incoming page is pre-blurred, made active, and transitioned back to `blur(0px)`. Because filter transitions do not compose across an element swap, the incoming page's blur is set with `transition: none`, forced to commit over two animation frames, and only then animated to sharp.

```js
function doTransition(prev, next) {
  const o = document.getElementById('p' + prev), n = document.getElementById('p' + next);
  o.style.transition = `filter ${dur}ms ${ease}, opacity ${dur}ms ${ease}`;
  o.style.filter = `blur(${maxBlur}px)`;
  if (withFade) o.style.opacity = '0';

  const swapAfter = overlap ? Math.round(dur * 0.5) : dur;
  setTimeout(() => {
    o.classList.remove('active');
    n.style.transition = 'none';
    n.style.filter = `blur(${maxBlur}px)`; n.style.opacity = '0'; n.classList.add('active');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      n.style.transition = `filter ${dur}ms ${ease}, opacity ${dur}ms ${ease}`;
      n.style.filter = 'blur(0px)'; n.style.opacity = '1';   // sharpen in
    }));
  }, swapAfter);
}
```

An "overlap" option starts the incoming sharpen at 50% of the outgoing blur instead of waiting for it to finish, cutting the total time roughly in half while the two stages cross.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Max blur | 20px | Peak defocus. Above ~30px is heavy on the GPU and can look muddy |
| Stage duration | 400ms | Time per stage (blur-out, sharpen-in). Doubles unless stages overlap |
| Easing | ease-in-out | `ease-in-out` feels like a controlled focus pull; `ease-out` snaps sharp faster |
| Blur + fade | on | Combining with opacity hides the swap; blur-only keeps both pages visible mid-transition |
| Overlap stages | off | Runs the two halves concurrently for a faster, softer cross |

## Production notes
- **GPU cost.** Large-radius `filter: blur()` over a full-viewport element is one of the more expensive things you can animate. Keep the blurred region as small as practical, cap the radius on mobile, and avoid running it during scroll.
- **The double `requestAnimationFrame`.** Setting the pre-blur with `transition: none` and then flipping to the animated transition requires two frames — one to commit the start state, one to start the tween. A single frame occasionally drops the animation and the page pops in sharp.
- **Fringing.** Blurring an element with a hard rectangular edge can reveal a faint halo where the blur samples past the bounds. A subtle `overflow: hidden` container or a slight scale keeps the edge clean.
- **Library equivalents.** The View Transitions API can animate `filter` on `::view-transition-old`/`-new` for the same effect with far less bookkeeping. Framer Motion animates `filter: 'blur(20px)'` to `'blur(0px)'` via `animate`; GSAP does the same through its CSS plugin. Barba.js `leave`/`enter` hooks host the blur-out and sharpen-in halves.

## See also
- [Crossfade](../crossfade/) — the opacity blend blur is layered on top of
- [Flash / Light Leak](../flash-transition/) — hides the swap with brightness instead of defocus
- [Dissolve](../dissolve/) — a tiled, non-uniform wipe for a different texture
- [Zoom Transition](../zoom-transition/) — scale rather than focus to shift attention
