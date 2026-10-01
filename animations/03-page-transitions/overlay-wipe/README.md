# Overlay Wipe

## What it is
An overlay wipe hides a page change behind a solid colored panel. The panel sweeps in from one side until it covers the whole page, the page is swapped while nobody can see it, and the panel sweeps on out of the opposite side to uncover the new page. A second, lighter panel can run just ahead of it on the way in and just behind it on the way out, so the edge shows two bands of color.

## When to use it
- Portfolio and agency sites that want every page change to feel designed and on brand
- Sites whose pages load a moment late: the covered moment hides the wait
- Chapter breaks in a story or a product tour, where the name of the next part can ride on the panel
- Any change where the old and new page have nothing in common to animate between

## How it works
Each panel is an absolutely placed box over the page area. One Web Animations call per panel holds its whole run as keyframes on `transform`: it waits, slides in, covers the page, slides out and stays out of view. The page is swapped by a timer in the middle of the covered moment, and the panels are taken away once the run has ended:

```js
function sweep(el,start,ms,stay,total){
  const at=t=>t/total;
  el.animate([
    {transform:FROM[dir],offset:0},{transform:FROM[dir],offset:at(start),easing:EASE},
    {transform:'none',offset:at(start+ms)},{transform:'none',offset:at(start+ms+stay),easing:EASE},
    {transform:TO[dir],offset:at(start+2*ms+stay)},{transform:TO[dir],offset:1}
  ],{duration:total,fill:'both'});
}
// in navigate():
const ms=sweepMs*(slowTog.checked?3:1),stay=ms/3,two=twoTog.checked,lead=two?ms*.35:0,total=2*ms+stay+2*lead;
if(two)sweep(back,0,ms,stay+2*lead,total);   // the lighter panel goes in first and comes out last
sweep(front,lead,ms,stay,total);
later(()=>{rest(oldEl,false);rest(newEl,true)},lead+ms+stay/2);   // the swap, while the page is covered
later(()=>{clearWipe();finish()},total+30);
```

`FROM` and `TO` hold the two off-page places for each direction (for Left to right, `translateX(-100%)` and `translateX(100%)`), so the panel always leaves on the side opposite the one it came from. The easing `cubic-bezier(.7,0,.3,1)` starts and stops each sweep softly and crosses the middle fast. Only `transform` changes, so the browser can move the panels without laying out or repainting the page.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Direction | Left to right | The side the panel comes in from; it always leaves on the opposite side |
| Panel color | Violet | The color of the panel; the second panel is a lighter shade of it |
| Two stacked panels | off | A lighter panel runs just ahead of the main one on the way in and just behind it on the way out |
| Speed | Normal | How long each sweep takes: slow is 700ms, normal 450ms and fast 300ms; the page stays covered for a third of that |

## Production notes
- **Slide, never resize.** Growing the panel's width or height makes the browser lay out the page on every frame; a `transform` moves an already painted layer.
- **Swap only while covered.** Changing the page before the panel fully covers it shows a cut through the gap. Time the swap from the middle of the covered moment, not from the start of the sweep.
- **Real page loads.** On a multi-page site, play the first half (in) before leaving the page and the second half (out) on the new page; the View Transitions API can do both halves with `::view-transition-old` and `::view-transition-new` and a pseudo-element for the panel. Barba.js `leave` and `enter` hooks map onto the same two halves.
- **Keep it short.** A wipe on every click of an app used all day gets tiring; under a second for the whole change is a good ceiling.
- **Reduced motion** skips the panels and fades the new page in over 250ms.
- **Library equivalents.** GSAP timelines (`xPercent` tweens with a callback for the swap), Framer Motion's `AnimatePresence` with an overlay `motion.div`, and Swup or Barba.js page-transition hooks all build this pattern.

## See also
- [Curtain Reveal](../../02-entrance-and-exit/curtain-reveal/) — a panel that uncovers a single element
- [Section Wipe](../../01-scroll-based/section-wipe/) — sections slide over each other as you scroll
- [Flash / Light Leak Transition](../flash-transition/) — a burst of light hides the change instead
- [Slide Transition](../slide-transition/) — the pages themselves slide instead
