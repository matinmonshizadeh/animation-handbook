# Zoom Into Image

## What it is
A zoom-into-image effect expands a framed image outward to full-bleed as you scroll, reading as a camera flying into the picture — the "portal" effect. It's driven not by scaling the image but by animating a `clip-path: inset()` from a large inset down to zero, so a small windowed crop grows to fill the stage. This demo pins a nighttime landscape in a sticky frame and opens the clip as you scroll through a fixed budget, revealing a caption near the end.

## When to use it
- Hero-to-content transitions where a preview card should open into an immersive image
- Editorial or gallery intros that "enter" a featured photograph
- Section breaks that use a single image as a portal between two parts of a page
- Any moment where you want the sense of moving *into* an image rather than past it

## How it works
The image sits in a `position: sticky` container inside a tall section, giving a scroll budget. Progress across that budget is a 0–1 value; the inset percentage and corner radius are both `lerp`ed from their start values down to zero, so the crop expands and its rounded frame squares off simultaneously:

```js
const pinStart = zoomSec.offsetTop, budget = zoomSec.offsetHeight - stageH;
const p = clamp((st - pinStart) / budget, 0, 1);
const inset  = lerp(startPct, 0, p);      // 30% → 0%  (crop opens)
const radius = lerp(brStart, 0, p);       // 16px → 0  (corners square off)

zoomImg.style.clipPath = portalTog.checked
  ? `inset(${inset.toFixed(2)}% round ${radius.toFixed(1)}px)`
  : `inset(${inset.toFixed(2)}%)`;

caption.style.opacity = p > 0.88 ? ((p - 0.88) / 0.12).toFixed(3) : '0';
```

Clipping rather than scaling is the crucial choice: `clip-path` reveals more of the *existing* image at full resolution, so nothing blurs or pixelates the way a `transform: scale()` zoom would. The caption fades in only over the final 12% of the scroll, once the image is essentially full-bleed.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Start size (inset) | 30% | Inset on each side at the start; 30% shows a 40%-wide crop |
| Border radius start | 16px | Corner rounding of the initial frame; lerps to 0 as it opens |
| Progress `p` | derived | 0 at pin start, 1 when the scroll budget is exhausted |
| Section height | 2.5 × stage | Scroll distance the zoom occupies; taller = slower open |
| Caption fade window | last 12% (p > 0.88) | When the caption overlay begins appearing |

## Production notes
- **Clip, don't scale**: `clip-path: inset()` reveals real pixels, keeping the image sharp at every step. A `scale()` zoom enlarges a fixed render and softens. Use clipping when the whole image is present and you're uncovering it.
- **`will-change: clip-path`**: set on the image so the browser prepares for the animating clip. Animating `clip-path` is compositor-friendly on modern engines but still benefits from the hint.
- **Sticky provides the pin**: the image holds still via `position: sticky` while the tall section scrolls; the clip is the only thing changing, which keeps the effect cheap.
- **`round` keyword**: `inset(x% round Ypx)` combines the crop and rounded corners in one property, so both animate together off a single progress value.
- **Reduced motion**: under `prefers-reduced-motion` the CSS forces `clip-path: inset(0%)` and shows the caption immediately — the reader gets the final full image with no fly-in.
- **Library equivalents**: GSAP ScrollTrigger with `scrub` tweening `clipPath` is the direct equivalent and adds easing; Framer Motion animates the `clipPath` style off a `useTransform` of scroll progress in React.

## See also
- [Sticky Section](../sticky-section/) — the pinning mechanic this builds on
- [Scrub Animation](../scrub-animation/) — binding a property continuously to scroll
- [Cover Card to Fixed Header](../cover-card-to-fixed-header/) — a card transforming as it's scrolled
- [Parallax Depth of Field](../parallax-depth-of-field/) — another depth-through-scroll illusion
