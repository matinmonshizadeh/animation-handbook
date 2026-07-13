# Shared Element Transition

## What it is
A shared element transition keeps one piece of content visually continuous as the interface changes around it — a grid thumbnail grows and repositions into a detail-page hero rather than the two views cross-fading. It creates the feeling that the user moves *with* the content instead of jumping to a new screen. The demo implements it with the FLIP technique: measure the element's start and end rectangles, then animate a clone between them.

## When to use it
- Thumbnail-to-detail navigation in galleries, product grids, and media libraries
- Card-to-modal expansions where the card becomes the modal header
- Any place where the same object exists in both the "before" and "after" view and you want to preserve identity
- Mobile app-style navigation where spatial continuity aids orientation

## How it works
FLIP stands for First, Last, Invert, Play. Record the thumbnail's rectangle (First), reveal the destination and read the hero's rectangle (Last), position a fixed clone at the start rect, then on the next frame transition it to the end rect (Invert then Play):

```js
function openDetail(i){
  const thumbRect = thumbEls[i].getBoundingClientRect();      // FIRST
  detail.classList.add('active');
  const heroRect = detailHero.getBoundingClientRect();        // LAST
  // place clone at the thumb's position/size
  flipEl.style.cssText =
    `background:${p.bg};width:${thumbRect.width}px;height:${thumbRect.height}px;`+
    `top:${thumbRect.top}px;left:${thumbRect.left}px;transition:none;display:block`;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{        // PLAY
    flipEl.style.transition = `all ${dur}ms ${easeSel.value}`;
    flipEl.style.top = heroRect.top+'px';
    flipEl.style.left = heroRect.left+'px';
    flipEl.style.width = heroRect.width+'px';
    flipEl.style.height = heroRect.height+'px';
    flipEl.style.borderRadius = '0';
  }));
}
```

The real grid fades out while the clone travels, and the detail body fades in slightly later (`dur*0.6` delay) so the hero has arrived before its text appears. The double `requestAnimationFrame` guarantees the browser paints the start rect before the transition begins — without it the clone would jump straight to the end.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Duration | 500ms | Travel time of the morphing clone; 300–600ms feels responsive without dragging |
| Easing | `cubic-bezier(.2,.7,.3,1)` | "Smooth"; a springy `cubic-bezier(.34,1.56,.64,1)` adds overshoot on arrival |
| Grid fade | `dur*0.4` | Outgoing grid opacity fade, run concurrently with the clone |
| Body fade delay | `dur*0.6` | Detail text appears after the hero settles, staggering the reveal |

## Production notes
- **Read then write** — batch all `getBoundingClientRect()` reads before you touch styles. Interleaving reads and writes causes layout thrashing that stutters the animation.
- **The clone is `position:fixed`** with `will-change:transform`, so it animates on the compositor and ignores the scroll/layout of the pages underneath it.
- **Fixed positioning uses viewport coordinates**, which is why the demo reads `getBoundingClientRect()` directly. If your clone lives inside a transformed or scrolled ancestor, offsets must be adjusted.
- **Reduced motion** skips the clone entirely and snaps the detail view in.
- **Library equivalents**: the View Transitions API does this natively by giving both elements the same `view-transition-name`. Framer Motion's `layoutId` and shared `<motion.*>` elements automate FLIP; Next.js and GSAP's Flip plugin offer the same measure-invert-play primitive.

## See also
- [View Transitions API](../view-transitions-api/) — the browser-native way to share an element via `view-transition-name`
- [FLIP Technique](../flip-technique/) — the measure-invert-play primitive on its own
- [Portal Zoom](../portal-zoom/) — a related expand-from-source effect
- [Morph Transition](../morph-transition/) — continuity via shape interpolation rather than position
