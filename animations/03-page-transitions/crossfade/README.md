# Crossfade Transition

## What it is
A crossfade transitions between two pages by fading the outgoing one out and the incoming one in *at the same time*, so both are partially visible around the midpoint. This overlap distinguishes a true crossfade from a sequential fade, which fades the old page fully out before the new one begins and leaves a brief blank frame. The demo runs both modes side by side and reports the live opacity of each page so the difference is measurable, not just felt.

## When to use it
- Neutral, non-directional navigation where no spatial relationship between pages is implied
- Content swaps within a persistent shell (tabs, filters, image galleries)
- The safe default transition — it works when you can't justify a slide or zoom
- Situations needing the calmest possible motion, since nothing moves, only opacity changes

## How it works
In simultaneous mode both pages get the same-duration opacity transition and flip at once; in sequential mode each gets half the duration, staged one after the other. A `requestAnimationFrame` loop samples both computed opacities live so you can watch them cross:

```js
if(mode==='true'){
  // Simultaneous: both fade together over the full duration
  oldEl.style.transition=`opacity ${dur}ms ${easeSel.value}`;
  newEl.style.transition=`opacity ${dur}ms ${easeSel.value}`;
  oldEl.style.opacity='0'; newEl.style.opacity='1';
}else{
  // Sequential: fade old out over half, then new in over half
  const half=Math.round(dur/2);
  oldEl.style.opacity='0';
  setTimeout(()=>{
    newEl.style.opacity='0'; newEl.classList.add('active');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{ newEl.style.opacity='1'; }));
  }, half+50);
}
```

Both pages are absolutely positioned in the same stacking context (`inset:0`), so they overlap perfectly and only their opacity changes. In simultaneous mode the outgoing page reaches ~0.5 exactly as the incoming page does, giving the momentary blend; in sequential mode the stage passes through a fully blank frame at the handoff.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Mode | Simultaneous | Simultaneous overlaps both pages; sequential inserts a blank midpoint |
| Duration | 500ms | Full crossfade length; sequential splits this into two halves |
| Easing | ease-in-out | Opacity curve; linear reads most evenly for a pure fade |
| Overlap opacity | ~0.5 | Where the two pages meet in simultaneous mode — the defining trait |

## Production notes
- **Stack both pages absolutely** so they occupy the same box. If they reflow the document, opacity alone won't give a clean blend.
- **Simultaneous double-fade can look washed out** on light backgrounds, because two 50%-opacity layers over a bright backdrop sum brighter than either page. Sequential avoids this at the cost of a blank beat.
- **A `+50ms` guard** after each `setTimeout` in the demo ensures the transition has finished before styles are reset; without slack the cleanup can clip the tail of the fade.
- **Reduced motion** swaps the `.active` class with no opacity transition at all.
- **Library equivalents**: this is the default `::view-transition-old/new(root)` behavior of the View Transitions API. Framer Motion's `AnimatePresence` with `initial/animate/exit` opacity, GSAP timelines, and React Transition Group all express the same overlap.

## See also
- [View Transitions API](../view-transitions-api/) — crossfade is its built-in default
- [Dissolve](../dissolve/) — a textured variant of the same fade principle
- [Slide Transition](../slide-transition/) — a directional alternative when pages have a spatial order
- [Blur Transition](../blur-transition/) — pairs a blur with the opacity change
