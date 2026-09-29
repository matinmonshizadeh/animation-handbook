# Zoom Into Image

## What it is
Zoom into image starts with a small window onto a picture and opens it up to fill the screen as you scroll, as if you were flying into the picture. The picture itself never grows: more of it is simply uncovered, so it stays sharp. The window's rounded corners square off as it opens, and a caption fades in at the end.

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

zoomImg.style.clipPath = `inset(${inset.toFixed(2)}% round ${radius.toFixed(1)}px)`;

caption.style.opacity = p > 0.88 ? ((p - 0.88) / 0.12).toFixed(3) : '0';
```

Clipping rather than scaling is the crucial choice: `clip-path` reveals more of the *existing* image at full resolution, so nothing blurs or pixelates the way a `transform: scale()` zoom would. The caption fades in only over the final 12% of the scroll, once the image is essentially full-bleed.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Starting window | Medium | How much of the picture shows at first: small is a window a fifth of the box wide, medium two fifths and large three fifths |
| Corners | Rounded | How round the window's corners are at the start: square, 16px or 32px; they straighten as the window opens |
| Shows the starting frame | on | A faint outline stays where the window began, so you can see how far it has opened |

## Production notes
- **Clip, don't scale**: `clip-path: inset()` reveals real pixels, keeping the image sharp at every step. A `scale()` zoom enlarges a fixed render and softens. Use clipping when the whole image is present and you're uncovering it.
- **`will-change: clip-path`**: set on the image so the browser prepares for the animating clip. Animating `clip-path` is compositor-friendly on modern engines but still benefits from the hint.
- **Sticky provides the pin**: the image holds still via `position: sticky` while the tall section scrolls; the clip is the only thing changing, which keeps the effect cheap.
- **`round` keyword**: `inset(x% round Ypx)` combines the crop and rounded corners in one property, so both animate together off a single progress value.
- **Reduced motion**: under `prefers-reduced-motion` the CSS forces `clip-path: inset(0%)` and shows the caption immediately — the reader gets the final full image with no fly-in.
- **Library equivalents**: GSAP ScrollTrigger with `scrub` tweening `clipPath` is the direct equivalent and adds easing; Framer Motion animates the `clipPath` style off a `useTransform` of scroll progress in React.

## See also
- [Sticky Section](../sticky-section/) — the pinning this effect is built on
- [Scrub Animation](../scrub-animation/) — scroll position drives the movement, both ways
- [Cover Card to Fixed Header](../cover-card-to-fixed-header/) — a big cover changes shape as you scroll
- [Parallax Depth-of-Field](../parallax-depth-of-field/) — layers move and blur for depth as you scroll
