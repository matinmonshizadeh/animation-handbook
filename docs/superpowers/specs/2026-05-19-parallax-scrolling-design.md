# Parallax Scrolling — Design Spec

**Date:** 2026-05-19
**Category:** 01-scroll-based
**Slug:** parallax-scrolling
**Path:** `animations/01-scroll-based/parallax-scrolling/`

---

## Overview

A scrollable stage containing a mountain-valley scene with 4 SVG layers that translate at different speeds as the user scrolls, creating a depth illusion. A side control panel lets the user adjust per-layer speed multipliers live, observe what breaks the illusion, and toggle parallax off entirely for comparison.

---

## Files

```
animations/01-scroll-based/parallax-scrolling/
  index.html    — single self-contained demo
  README.md     — 6-section explanation per CLAUDE.md template
```

No build step. No external dependencies. Works offline.

---

## Visual Theme

**Mountain Valley** — same midnight palette as the depth-of-field entry.

| Layer | Scene element | Color |
|-------|--------------|-------|
| 1 (far) | Sky + stars | `#060a10` gradient, white star dots |
| 2 | Distant ridgeline | `#0d2b3e` |
| 3 | Pine treeline | `#0a1f2e` / `#0d2818` |
| 4 (near) | Foreground grass | `#050e08` / near-black |

---

## Stage Layout

- A `div.stage` — `height: 600px`, `overflow-y: scroll`, hidden scrollbars (`scrollbar-width: none` + `::-webkit-scrollbar { display: none }`)
- Inside: `div.scene` — `height: 1500px` (2.5× stage height, gives ample scroll distance), `position: relative`
- 4 SVG layers inside `.scene`, each `position: sticky; top: 0; height: 600px` (fills the stage viewport)
- Layers stack via `z-index` (sky lowest, foreground highest)

---

## Parallax Mechanic

Single `scroll` event listener on `.stage`. Uses `requestAnimationFrame` with a dirty flag to decouple scroll events from paint:

```js
let ticking = false;

stage.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateLayers);
    ticking = true;
  }
}, { passive: true });

function updateLayers() {
  const scrollTop = stage.scrollTop;
  LAYERS.forEach(layer => {
    const offset = scrollTop * layer.speed;
    layer.el.style.transform = `translate3d(0, ${offset}px, 0)`;
  });
  ticking = false;
}
```

**Per-layer transform:**
`offsetY = scrollTop × speed`
where `speed` is a 0–1.5 multiplier (default: 0.10 / 0.30 / 0.60 / 1.00).

`translate3d` is used (not `translateY`) to force GPU compositor layer promotion.

---

## Layers

| Index | Name | Default speed | z-index |
|-------|------|--------------|---------|
| 1 | Sky + stars | 0.10 (10%) | 1 |
| 2 | Distant ridgeline | 0.30 (30%) | 2 |
| 3 | Pine treeline | 0.60 (60%) | 3 |
| 4 | Foreground grass | 1.00 (100%) | 4 |

---

## Controls Panel

Fixed to the right of the stage on desktop; stacks below the stage on mobile (≤600px).

Contains (top to bottom):
1. **Educational note** — "Real cameras render depth geometrically — layers slow down roughly as 1/distance. Try ratios like 100% / 60% / 30% / 10% for the most believable depth."
2. **Scroll progress** — live `%` readout (0–100)
3. **Layer offset table** — 4 rows, each showing layer name + current `px` offset, updated every rAF tick
4. **Speed sliders** — one per layer, `<input type="range" min="0" max="150" step="1">`, value displayed as `%`
5. **"Disable parallax" toggle** — `<input type="checkbox">`. When checked, all speeds temporarily set to 1.0 so all layers scroll at the same rate; unchecked restores individual speeds
6. **"Reset to defaults" button** — restores speeds to 0.10 / 0.30 / 0.60 / 1.00

---

## CSS Variables

```css
--bg: #060a10;
--ui-bg: #0d1117;
--ui-border: #21262d;
--ui-accent: #58a6ff;
--ui-text: #c9d1d9;
--ui-muted: #8b949e;
```

---

## Responsiveness (per CLAUDE.md)

- **Desktop (≥1025px):** Stage left, controls panel right, side-by-side
- **Tablet (601–1024px):** Same layout, slider touch targets ≥44px
- **Mobile (≤600px):** Controls stack below stage; sliders full-width
- Typography: `clamp()` on headings and header
- `prefers-reduced-motion`: skip `updateLayers` (layers stay static)

---

## Page Structure

```
<body>
  <header>           — animation name + 1-sentence description
  <div.layout>       — CSS Grid or Flexbox, stage + controls
    <div.stage>        — 600px tall, overflow-y: scroll, hidden scrollbars
      <div.scene>        — 1500px tall
        <svg.layer> × 4    — each sticky top:0, 600px tall
    <aside.controls>   — educational note, readout, sliders, toggle, reset
```

---

## README Sections

1. **What it is** — parallax scroll: layers at different speeds create depth illusion
2. **When to use it** — hero sections, landing pages, storytelling scrolls
3. **How it works** — `scrollTop × speed` → `translate3d`, rAF throttle
4. **Key parameters** — speed ratios per layer, scene height, rAF dirty flag
5. **Production notes** — GPU via `translate3d`/`will-change`; rAF throttling; GSAP ScrollTrigger, Locomotive Scroll, Lenis; `prefers-reduced-motion`
6. **See also** — link to parallax-depth-of-field

---

## Constraints

- Single HTML file, under 300 lines
- No external dependencies, offline-capable
- All interactive controls ≥44×44px touch target on mobile
- Touch scroll works (passive listener on `.stage`)
