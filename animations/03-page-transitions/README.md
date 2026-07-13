# Page Transitions

Full-page transitions between routes or views — how one screen gives way to the next. Crossfades, slides, portals, morphs, and the browser-native View Transitions API.

## Entries

- [View Transitions API](view-transitions-api/) — `document.startViewTransition()` captures before/after and animates the swap automatically.
- [Shared Element Transition](shared-element-transition/) — a thumbnail morphs continuously into a detail hero as the page changes; the FLIP technique applied.
- [Morph Transition](morph-transition/) — an SVG path morphs between page-specific shapes via point-by-point interpolation.
- [Crossfade](crossfade/) — both pages visible simultaneously at ~50% opacity mid-transition; compared with sequential fade.
- [Slide Transition](slide-transition/) — directional slides with forward/back awareness, matching native iOS and Android navigation.
- [Zoom Transition](zoom-transition/) — zoom-in, zoom-out, and pull-through scale variants, each implying different spatial depth.
- [Flash / Light Leak](flash-transition/) — a colored flash peaks at full opacity, hides the page swap, then fades to reveal the new scene.
- [Blur Transition](blur-transition/) — the current page blurs and fades out, then the new page sharpens in; a defocus wipe.
- [Elastic Transition](elastic-transition/) — spring physics overshoot before settling; CSS keyframes or a live JS spring.
- [Portal / Tunnel Zoom](portal-zoom/) — `clip-path` expands from a portal element's center, zooming the viewport into the next page.
- [Dissolve](dissolve/) — random tiles fade at staggered delays; a non-uniform wipe that reads as dissolving rather than fading.
- [FLIP Technique](flip-technique/) — First-Last-Invert-Play; layout changes animated cheaply by measuring position deltas.
