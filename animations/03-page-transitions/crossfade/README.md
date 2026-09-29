# Crossfade Transition

## What it is
A crossfade switches pages by fading the old page out while the new one fades in, so for a moment both are half visible and blend into each other. That overlap is what makes it a crossfade: fading the old page out first and the new one in afterwards leaves a short blank moment instead. The demo can do both, so you can compare them.

## When to use it
- Neutral, non-directional navigation where no spatial relationship between pages is implied
- Content swaps within a persistent shell (tabs, filters, image galleries)
- The safe default transition — it works when you can't justify a slide or zoom
- Situations needing the calmest possible motion, since nothing moves, only opacity changes

## How it works
In simultaneous mode both pages get the same-duration opacity transition and flip at once; in sequential mode each gets half the duration, staged one after the other. Both are ordinary CSS transitions on `opacity`:

```js
if(mode==='true'){
  // Simultaneous: both fade together over the full duration
  oldEl.style.transition=`opacity ${dur}ms ${ease}`;
  newEl.style.transition=`opacity ${dur}ms ${ease}`;
  oldEl.style.opacity='0'; newEl.style.opacity='1';
}else{
  // Sequential: fade old out over half, then new in over half
  const half=Math.round(dur/2);
  oldEl.style.opacity='0';
  setTimeout(()=>{
    newEl.style.opacity='0'; newEl.classList.add('active');
    void newEl.offsetWidth;                   // commit the transparent start
    newEl.style.opacity='1';
  }, half+50);
}
```

Both pages are absolutely positioned in the same stacking context (`inset:0`), so they overlap perfectly and only their opacity changes. In simultaneous mode the outgoing page reaches ~0.5 exactly as the incoming page does, giving the momentary blend; in sequential mode the stage passes through a fully blank frame at the handoff.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Fade order | Together | Together overlaps the two fades so the pages blend; One after the other fades the old page out first, leaving a blank moment |
| Speed | Normal | How long the whole change takes: slow is 800ms, normal 500ms and fast 300ms; one after the other gives each fade half of it |
| Feel | Gentle | Gentle eases in and out; Smooth slows to a stop; Even keeps one steady pace, which reads most evenly for a pure fade |

## Production notes
- **Stack both pages absolutely** so they occupy the same box. If they reflow the document, opacity alone won't give a clean blend.
- **Simultaneous double-fade can look washed out** on light backgrounds, because two 50%-opacity layers over a bright backdrop sum brighter than either page. Sequential avoids this at the cost of a blank beat.
- **A `+50ms` guard** after each `setTimeout` in the demo ensures the transition has finished before styles are reset; without slack the cleanup can clip the tail of the fade.
- **Reduced motion** swaps the `.active` class with no opacity transition at all.
- **Library equivalents**: this is the default `::view-transition-old/new(root)` behavior of the View Transitions API. Framer Motion's `AnimatePresence` with `initial/animate/exit` opacity, GSAP timelines, and React Transition Group all express the same overlap.

## See also
- [View Transitions API](../view-transitions-api/) — the browser's own fade between pages
- [Dissolve Transition](../dissolve/) — the fade broken into tiles
- [Slide Transition](../slide-transition/) — pages move sideways instead
- [Blur Transition](../blur-transition/) — a blur joins the fade
