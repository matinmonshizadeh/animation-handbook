# Scroll-Based Animations

Techniques driven by scroll position.

## Entries

- [Parallax Depth-of-Field](parallax-depth-of-field/) — Five layered SVG mountains with
  parallax translation and blur-based depth-of-field driven by scroll progress.
- [Parallax Scrolling](parallax-scrolling/) — Four SVG layers at different scroll speeds
  create a 3D depth illusion; adjustable speed multipliers show how ratios make or break the effect.
- [Reverse-Scrolling Columns](reverse-scrolling-columns/) — center column scrolls normally
  while two flanking columns scroll in reverse, all three looping infinitely.
- [Cover Card to Fixed Header](cover-card-to-fixed-header/) — a hero cover card scrubs
  into a compact fixed header; every visual property driven by a single 0→1 progress value.
- [Fly-in Fly-out Contact List](fly-in-fly-out-contact-list/) — rows translate and fade
  as they enter and exit the scroll viewport; effect scrubbed continuously to scroll position.
- [Stacking Cards](stacking-cards/) — cards fan into a deck as they stack; per-index sticky
  offset creates the peek, CSS Scroll-Driven Animations drive the scale.
- [ScrollTrigger Animation](scroll-trigger/) — demonstrates the onEnter/onLeave/onEnterBack/
  onLeaveBack lifecycle using IntersectionObserver and vanilla scroll events.
- [Scrub Animation](scrub-animation/) — a camera lens disassembles in five stages as you scroll;
  every transform is welded to scroll position with no autoplay.
- [Pin Animation](pin-animation/) — a phone mockup and feature copy pin to the viewport via
  CSS sticky while four features swap in sequence during the scroll.
- [Snap Scrolling](snap-scrolling/) — CSS scroll-snap-type creates a paginated, magnetic feel;
  switch between mandatory, proximity, and none to feel the difference.
- [Scrollytelling](scrollytelling/) — fractional chapter progress drives continuous depth
  crossfades across six ocean-layer chapters; a porthole visual responds between discrete states.
- [Reveal on Scroll](reveal-on-scroll/) — seven reveal techniques (fade, slide, scale, blur,
  clip-path mask, stagger) fired by IntersectionObserver at a configurable trigger line.
- [Stagger Reveal](stagger-reveal/) — groups of elements reveal sequentially with cascading
  delays; forward, reverse, center-out, and random cascade directions on a grid, list, and chips.
- [Horizontal Scroll](horizontal-scroll/) — vertical scroll translates a horizontal panel
  strip; a tall pinned section provides the scroll budget, translateX does the work.
- [Sticky Section](sticky-section/) — the whole section pins to the viewport while its
  interior morphs through four states scrubbed to scroll position within the section.
- [Counter Animation](counter-animation/) — numbers count 0 → target with easing when the
  stats section enters the internal viewport; four counter formats with stagger support.
- [Progress Bar](progress-bar/) — reading progress indicator in three styles: top bar,
  circular ring, and side rail; all driven by scrollTop / (scrollHeight − clientHeight).
- [Section Wipe](section-wipe/) — the next section slides over the current one via sticky
  z-index stacking; a scale-down on the receding layer adds depth to the transition.
- [Zoom Into Image](zoom-into-image/) — clip-path expands from a framed card to full-bleed
  as you scroll; the portal effect is clip-path: inset() collapsing from center outward.
- [Scroll Image Sequence](scroll-image-sequence/) — a canvas pinned with position:sticky while
  scroll progress maps to a frame index; the Apple product-scroll technique, frames drawn procedurally.
- [Smooth (Inertia) Scroll](smooth-scroll/) — wheel and touch input eased toward a target each
  frame with a lerp, giving weighted, gliding momentum instead of the browser's instant jumps.
