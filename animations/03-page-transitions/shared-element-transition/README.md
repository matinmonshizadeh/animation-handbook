# Shared Element Transition

## What it is
A shared element transition keeps one piece of content in view while the page changes around it: a thumbnail in a grid grows and moves into the large picture at the top of its detail page, instead of the two pages simply swapping. It feels as if you travel with the content rather than jump to a new screen. The demo measures where the picture starts and where it ends, then moves a copy of it from one to the other.

## When to use it
- Thumbnail-to-detail navigation in galleries, product grids, and media libraries
- Card-to-modal expansions where the card becomes the modal header
- Any place where the same object exists in both the "before" and "after" view and you want to preserve identity
- Mobile app-style navigation where spatial continuity aids orientation

## How it works
FLIP stands for First, Last, Invert, Play. Record the thumbnail's rectangle (First), reveal the destination and read the hero's rectangle (Last), position a fixed clone at the start rect, then transition it to the end rect (Invert then Play):

```js
function openDetail(i){
  const thumbRect = thumbEls[i].getBoundingClientRect();      // FIRST
  detail.classList.add('active');
  const heroRect = detailHero.getBoundingClientRect();        // LAST
  // place clone at the thumb's position/size
  flipEl.style.cssText =
    `background:${p.bg};width:${thumbRect.width}px;height:${thumbRect.height}px;`+
    `top:${thumbRect.top}px;left:${thumbRect.left}px;transition:none;display:block`;
  void flipEl.offsetWidth;                                     // commit the start rect
  flipEl.style.transition = `all ${dur}ms ${ease}`;            // PLAY
  flipEl.style.top = heroRect.top+'px';
  flipEl.style.left = heroRect.left+'px';
  flipEl.style.width = heroRect.width+'px';
  flipEl.style.height = heroRect.height+'px';
  flipEl.style.borderRadius = '0';
}
```

The real grid fades out while the clone travels, and the detail body fades in slightly later (`dur*0.6` delay) so the hero has arrived before its text appears. Reading `offsetWidth` after placing the clone makes the browser apply the start rect before the transition is switched on — without it the clone would jump straight to the end.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Speed | Normal | How long the picture takes to travel and grow: slow is 800ms, normal 500ms and fast 300ms; 300 to 600ms feels responsive without dragging |
| Feel | Smooth | Smooth slows to a stop; Springy grows a little past the header's size, then settles |

## Production notes
- **Read then write** — batch all `getBoundingClientRect()` reads before you touch styles. Interleaving reads and writes causes layout thrashing that stutters the animation.
- **The clone is `position:fixed`**, so it moves in viewport coordinates and ignores the scroll and layout of the pages underneath it. It animates `top`, `left`, `width` and `height`, which is cheap enough for one element; to move many elements, animate `transform` instead, as the FLIP Technique demo does.
- **Fixed positioning uses viewport coordinates**, which is why the demo reads `getBoundingClientRect()` directly. If your clone lives inside a transformed or scrolled ancestor, offsets must be adjusted.
- **Reduced motion** skips the clone entirely and snaps the detail view in.
- **Library equivalents**: the View Transitions API does this natively by giving both elements the same `view-transition-name`. Framer Motion's `layoutId` and shared `<motion.*>` elements automate FLIP; Next.js and GSAP's Flip plugin offer the same measure-invert-play primitive.

## See also
- [View Transitions API](../view-transitions-api/) — the browser can do this itself
- [FLIP Technique](../flip-technique/) — the measure-then-move method on its own
- [Portal / Tunnel Zoom](../portal-zoom/) — the next page opens out of a clicked circle
- [Morph Transition](../morph-transition/) — a shape changes instead of moving
