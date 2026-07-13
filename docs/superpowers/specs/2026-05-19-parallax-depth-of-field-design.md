# Parallax Depth-of-Field — Design Spec

**Date:** 2026-05-19  
**Category:** 01-scroll-based  
**Slug:** parallax-depth-of-field  
**Path:** `animations/01-scroll-based/parallax-depth-of-field/`

---

## Overview

A scroll-driven scene of 5 stacked SVG mountain layers. Each layer translates at a different speed (parallax). A virtual focal plane advances from far to near as the user scrolls, blurring each layer by its distance from the focal depth. A fixed right sidebar lets the user manually override the focal plane with a slider and see each layer's live blur value.

---

## Files

```
animations/01-scroll-based/parallax-depth-of-field/
  index.html    — single self-contained demo
  README.md     — 6-section explanation per CLAUDE.md template
```

No build step. No external dependencies. Works offline.

---

## Page Structure

```
<body>
  <header>          — animation name + 1-sentence description
  <div.scroll-stage>  — 500vh tall, drives all animation via scroll progress
    <div.sticky-viewport>  — position:sticky, 100vh, holds the scene
      <svg.layer> × 5      — stacked SVG layers, z-index 1–5
  <aside.sidebar>   — position:fixed right, always visible
    <input[range]>  — vertical focal plane slider (far=0 → near=1)
    <div.readout>   — live blur values for L1–L5
```

---

## Visual Aesthetic

**Style:** Midnight + Stars  
**Background:** near-black (`#060a10`) with a sparse dot star field (SVG circles, randomized positions)  
**Layer palette (far → near):** teal (`#0d2b3e`) → indigo (`#121830`) → near-black (`#060810`)  
**Stage:** dark, light cards — CSS variable driven  

---

## Layers

| Index | Name | Parallax speed | Depth value `d` |
|-------|------|---------------|-----------------|
| 5 | Sky + stars | 0% (static) | 0.0 |
| 4 | Distant peaks | 10% of scroll offset | 0.2 |
| 3 | Mid mountains | 25% of scroll offset | 0.4 |
| 2 | Near hills | 45% of scroll offset | 0.7 |
| 1 | Foreground | 70% of scroll offset | 1.0 |

Max translateY offset: ±120px. Far layers barely move; near layers travel furthest.

SVG shapes: filled polygon silhouettes, mountain/peaks aesthetic. Each layer's polygon sits at a different horizon height to create natural depth stacking.

---

## Blur / Focal Plane Formula

```
f  = focal plane position, 0.0 (far) → 1.0 (near)
d  = layer depth (fixed per layer, see table above)
blur = maxBlur × |d − f|
maxBlur = 14px
```

The layer whose depth `d` equals `f` renders at 0px blur (sharp). All others blur proportionally to their distance from the focal plane.

Applied via `filter: blur(Xpx)` on each layer element, updated on every scroll/slider event.

---

## Focal Plane Driving

- **Scroll:** `f = scrollProgress` where `scrollProgress = scrollY / (scrollHeight - viewportHeight)`, clamped to [0, 1].
- **Slider override:** Moving the slider sets `f` directly and sets a flag `manualOverride = true`. On next scroll event, `manualOverride` is cleared and scroll takes over again.
- The slider thumb position updates to reflect the scroll-driven `f` when not in manual override.

---

## Sidebar (Fixed Right Panel)

- `position: fixed`, right-aligned, vertically centered in viewport
- Width: ~120px desktop, collapsed to a bottom strip on mobile (<600px)
- Contains:
  - Label: "FOCAL PLANE"
  - `<input type="range">` oriented vertically (`-webkit-appearance: slider-vertical` + CSS rotation fallback), min=0 max=100, maps to `f`
  - Labels: "far" at top, "near" at bottom
  - Divider
  - Label: "BLUR"
  - Five rows: `L5 … 0px` through `L1 … 14px`, updated live

---

## Controls Panel (per CLAUDE.md template)

The sidebar IS the controls panel. No separate overlay. On mobile it becomes a horizontal strip pinned to the bottom with a horizontal slider; the readout collapses to a single "focused: L3" line showing only the in-focus layer name.

---

## CSS Variables

```css
--bg: #060a10;
--layer-far: #0d2b3e;
--layer-mid: #121830;
--layer-near: #060810;
--ui-bg: #0d1117;
--ui-border: #21262d;
--ui-accent: #58a6ff;
--ui-text: #c9d1d9;
--ui-muted: #8b949e;
```

---

## README Sections (per CLAUDE.md)

1. **What it is** — parallax + depth-of-field blur driven by scroll position
2. **When to use it** — hero sections, storytelling scrolls, cinematic intros
3. **How it works** — scroll progress → focal plane `f` → `blur = maxBlur × |d − f|` per layer
4. **Key parameters** — `maxBlur`, per-layer `depth`, parallax speed ratios, `maxOffset`
5. **Production notes** — GSAP ScrollTrigger equivalent; performance note on `filter:blur` (use `will-change: filter` or promote layers); avoid blurring too many large elements simultaneously
6. **See also** — links to other scroll-based entries (to be filled as handbook grows)

---

## Constraints

- Total HTML under 300 lines (per CLAUDE.md hard rule)
- No external dependencies
- Must work offline
- Mobile responsive: sidebar collapses to bottom strip under 600px
