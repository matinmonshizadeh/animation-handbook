# Cover Card to Fixed Header — Design Spec

**Date:** 2026-05-20
**Category:** 01-scroll-based
**Slug:** cover-card-to-fixed-header
**Path:** `animations/01-scroll-based/cover-card-to-fixed-header/`

---

## Overview

A large hero "cover card" that smoothly morphs into a compact fixed header as the user scrolls. Every visual property — height, font size, background opacity, blur, element visibility — is scrubbed to a single `0→1` progress value derived from scroll position. The user controls the transition range and can compare scrubbed vs. binary (snap) behavior.

---

## Files

```
animations/01-scroll-based/cover-card-to-fixed-header/
  index.html    — single self-contained demo
  README.md     — 6-section explanation per CLAUDE.md template
```

No build step. No external dependencies. Works offline.

---

## Visual Aesthetic

**Code Green** — dark forest/teal gradient with a faint code snippet watermark.

| Token | Value |
|-------|-------|
| Background gradient | `linear-gradient(150deg, #050e08, #0c2820, #060a10)` |
| Title color | `#d1f7d6` |
| Subtitle/meta color | `#3d7a52` |
| Accent | `#3fb950` |
| Code watermark | Faint `#1a4a30` monospace text (absolute, pointer-events:none) |

---

## Cover Card Content

- **Meta line:** "Article · 8 min read" — small uppercase, accent green, muted
- **Title:** "The Architecture of Scroll Motion" (2 lines)
- **Subtitle:** "How browsers render scroll-driven animations at 60fps"
- **Author block:** circular avatar (green gradient) + "Matin M. · May 2026"
- **Code watermark** (decorative): faint snippet showing `lerp` / `ease` math

---

## Page Structure

```
<body>
  <header>        — animation name + 1-sentence description
  <div.layout>    — flex row (stage + aside), stacked on mobile
    <div.stage>     — 620px tall, overflow-y:scroll, hidden scrollbar
      <div.scene>     — 2500px tall
        <div.cover>     — position:sticky; top:0; height:530px → 56px (animated)
          <div.cover-bg>    — gradient + code watermark, fades + blurs
          <div.cover-inner> — flex column with flex:1 spacer + content
            <div.spacer>      — flex:1; pushes content to bottom; shrinks with height
            <div.cover-meta>  — "Article · 8 min read"
            <h1.cover-title>  — main title, font-size animated
            <p.cover-sub>     — subtitle, fades out
            <div.cover-author>— avatar + name, fades out
          <div.header-chip>   — position:absolute; top:14px right:16px; small avatar + name; fades in
        <article.article-body>— placeholder article content (paragraphs, headings, pullquote)
    <aside>       — controls panel
```

---

## Collapse Mechanic

### Progress values

```js
const RANGE   = 320; // px, user-adjustable 150–600
let binary    = false;

function getProgress(scrollTop) {
  const p = Math.min(1, Math.max(0, scrollTop / RANGE));
  return binary ? (p > 0.5 ? 1 : 0) : easeOutCubic(p);
}

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function lerp(a, b, t)   { return a + (b - a) * t; }
function clamp(v, lo, hi){ return Math.min(Math.max(v, lo), hi); }
```

### 8 interpolated properties (all driven by `e = getProgress(scrollTop)`)

| # | Element | Property | From | To | Notes |
|---|---------|----------|------|----|-------|
| 1 | `.cover` | `height` | 530px | 56px | Drives content rise via flex spacer |
| 2 | `.cover-title` | `font-size` | 26px | 13px | Title shrinks into header |
| 3 | `.cover-sub` | `opacity` | 1 | 0 | Fades fast: `1 - clamp(e×3, 0, 1)` |
| 4 | `.cover-meta` | `opacity` | 1 | 0 | Fades fast: `1 - clamp(e×3, 0, 1)` |
| 5 | `.cover-author` | `opacity` | 1 | 0 | `1 - clamp(e×2, 0, 1)` |
| 6 | `.cover-bg` | `opacity` | 1 | 0.12 | Background de-emphasises |
| 7 | `.cover-bg` | `filter:blur` | 0px | 6px | Background blurs |
| 8 | `.header-chip` | `opacity` | 0 | 1 | `clamp((e−0.5)×2, 0, 1)` — fades in after e=0.5 |

Plus: `cover.style.boxShadow = green bottom border at `rgba(63,185,80, ${lerp(0, 0.2, e)})`.

### Why `height` (not `scaleY` or `clip-path`)

For this demo, `height` is animated directly. The `flex: 1` spacer inside the cover shrinks proportionally, making the cover content rise organically without JS transforms on individual elements. This is readable educational code.

Production note: animating `height` triggers layout; the production alternative is a fixed-height outer container with `overflow:hidden` + `clip-path` / `transform:scaleY` on the inner element, with `transform-origin: top`.

---

## Flex Spacer Pattern

The cover's content uses:
```html
<div class="cover-inner"> <!-- display:flex; flex-direction:column; height:100% -->
  <div class="cover-spacer"></div> <!-- flex:1 -->
  <div class="cover-meta">...</div>
  <h1 class="cover-title">...</h1>
  <p class="cover-sub">...</p>
  <div class="cover-author">...</div>
</div>
```

At `cover.height = 530px`: spacer absorbs ~410px, content sits near bottom.
At `cover.height = 56px`: spacer = 0, content stacks at top — title visible in header zone.
No JS needed to "move" the title; flex handles it automatically.

---

## Header Chip

```html
<div class="header-chip" id="header-chip">
  <div class="avatar-sm"></div>
  <span>Matin M.</span>
</div>
```

CSS: `position:absolute; top:14px; right:16px; opacity:0; display:flex; align-items:center; gap:6px`

Fades in at `e > 0.5`: `opacity = clamp((e - 0.5) × 2, 0, 1)`

---

## Controls Panel

Layout: right of stage on desktop (`clamp(200px, 22vw, 240px)` wide), stacks below on mobile.

| Control | ID | Type | Behavior |
|---------|-----|------|----------|
| Educational note | — | `<p>` | Static text |
| Scroll progress % | `#scroll-prog` | readout | `scrollTop / max × 100` |
| Collapse progress % | `#collapse-prog` | readout | `e × 100` |
| Collapse override | `#collapse-slider` | range 0–100 | Forces `e` directly; re-syncs on next scroll |
| Transition range | `#range-slider` | range 150–600 | Updates `RANGE`, shows `px` value |
| Binary toggle | `#binary-tog` | checkbox | Flips `binary` flag |
| Reset scroll | `#reset-btn` | button | Sets `stage.scrollTop = 0` |

---

## Responsiveness (CLAUDE.md)

| Breakpoint | Layout |
|------------|--------|
| Desktop ≥1025px | Stage left, aside right |
| Tablet 601–1024px | Same layout, controls touch targets 44px |
| Mobile ≤600px | Layout stacks (column), aside below stage |

- Typography: `clamp()` on all header and cover text
- Cover height on mobile: 480px (full) → 64px (collapsed) — larger header for touch
- All sliders/button: min-height 44px, button padding:17px
- Touch scroll works (passive listener on `.stage`)
- `prefers-reduced-motion`: skip easing, snap instantly to `e = p > 0.5 ? 1 : 0` (CSS class toggle)

---

## Performance

- `will-change: transform` on `.cover-bg` and `.cover-title`
- Single rAF dirty-flag scroll handler
- `motionMQ.matches` re-read live (not snapshot)
- Article body content: plain HTML, no animations on article text

---

## Article Body Content

Placeholder content to give scroll room:
- 2 section headings (`<h2>`)
- 4 short paragraphs (~50 words each)
- 1 pull-quote (`<blockquote>`)
- Total: ~300 words — enough to fill the scroll range

---

## README Sections

1. **What it is** — scrubbed morph from hero cover to fixed header
2. **When to use it** — article pages, product detail pages, editorial sites
3. **How it works** — single progress `p`, `easeOutCubic`, 8 interpolated properties, flex spacer pattern
4. **Key parameters** — `RANGE`, cover height 530/56, easing function, per-property timing offsets
5. **Production notes** — scrub vs binary; height→layout trap; real-world examples (Medium, Apple, Stripe); GSAP ScrollTrigger, Framer Motion; prefers-reduced-motion
6. **See also** — links to parallax-scrolling, reverse-scrolling-columns

---

## Constraints

- Single HTML file, under 300 lines
- No external dependencies, offline-capable
- Touch targets ≥44px
- Touch scroll works
- `prefers-reduced-motion` respected
