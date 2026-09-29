# Blur Transition

## What it is
A blur transition takes the old page out of focus until it disappears, then brings the new page in from a blur to sharp. It looks like a camera pulling focus from one subject to another, so the change reads as a shift of attention rather than a hard cut.

## When to use it
- Transitions between visually rich pages where a hard cut feels abrupt
- Photography, film, and editorial sites where a rack-focus metaphor fits the content
- Modal or detail views that should feel like the background recedes out of focus
- User-initiated navigation only — never on autoplaying carousels, where the cost adds up

## How it works
The outgoing page transitions its `filter` (and optionally `opacity`) up to a maximum blur, then the incoming page is pre-blurred, made active, and transitioned back to `blur(0px)`. Because filter transitions do not compose across an element swap, the incoming page's blur is set with `transition: none`, forced to commit with a reflow, and only then animated to sharp.

```js
function doTransition(prev, next) {
  const o = pages[prev], n = pages[next];
  o.style.transition = `filter ${dur}ms ${ease}, opacity ${dur}ms ${ease}`;
  o.style.filter = `blur(${maxBlur}px)`;
  if (withFade) o.style.opacity = '0';

  const swapAfter = overlap ? Math.round(dur * 0.5) : dur;
  setTimeout(() => {
    o.classList.remove('active');
    n.style.transition = 'none';
    n.style.filter = `blur(${maxBlur}px)`; n.style.opacity = '0'; n.classList.add('active');
    void n.offsetWidth;                                        // commit the blurred start
    n.style.transition = `filter ${dur}ms ${ease}, opacity ${dur}ms ${ease}`;
    n.style.filter = 'blur(0px)'; n.style.opacity = '1';   // sharpen in
  }, swapAfter);
}
```

The Overlaps the two halves setting starts the incoming sharpen at 50% of the outgoing blur instead of waiting for it to finish, cutting the total time by about a quarter while the two halves cross.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| How blurry it gets | Medium | How much the pages blur at the midpoint: slight is 8px, medium 20px and heavy 35px; above about 30px it is heavy for the browser and can look muddy |
| Speed | Normal | How long each half takes, blurring out and then sharpening in: slow is 650ms, normal 400ms and fast 250ms |
| Fades as it blurs | on | Fades each page as it blurs, which hides the swap; off, the pages stay solid and only blur |
| Overlaps the two halves | off | Starts sharpening the new page halfway through the blur, so the change takes a quarter less time |
| Feel | Gentle | Gentle feels like a controlled focus pull; Smooth snaps into focus sooner; Even keeps one steady pace |

## Production notes
- **GPU cost.** Large-radius `filter: blur()` over a full-viewport element is one of the more expensive things you can animate. Keep the blurred region as small as practical, cap the radius on mobile, and avoid running it during scroll.
- **Commit the start state.** Setting the pre-blur with `transition: none` and then turning the transition on needs a forced reflow in between (reading `offsetWidth`); without it the browser merges the two writes and the page pops in sharp.
- **Fringing.** Blurring an element with a hard rectangular edge can reveal a faint halo where the blur samples past the bounds. A subtle `overflow: hidden` container or a slight scale keeps the edge clean.
- **Library equivalents.** The View Transitions API can animate `filter` on `::view-transition-old`/`-new` for the same effect with far less bookkeeping. Framer Motion animates `filter: 'blur(20px)'` to `'blur(0px)'` via `animate`; GSAP does the same through its CSS plugin. Barba.js `leave`/`enter` hooks host the blur-out and sharpen-in halves.

## See also
- [Crossfade Transition](../crossfade/) — the plain fade underneath the blur
- [Flash / Light Leak Transition](../flash-transition/) — a burst of light hides the change
- [Dissolve Transition](../dissolve/) — tiles hide the change
- [Zoom Transition](../zoom-transition/) — scale shifts attention instead of focus
