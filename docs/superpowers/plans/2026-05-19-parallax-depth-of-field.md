# Parallax Depth-of-Field Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a self-contained scroll-driven demo of 5 stacked SVG mountain layers with parallax translation and blur-based depth-of-field, plus a fixed right sidebar with a focal-plane slider and live blur readout.

**Architecture:** Single `index.html` file — all CSS in `<style>`, all JS in `<script>`. A 500vh scroll stage drives scroll progress; a `position:sticky` container holds SVG layers that translate and blur based on that progress. A `position:fixed` sidebar provides manual focal-plane control.

**Tech Stack:** Plain HTML5, CSS custom properties, vanilla JS (no libraries, no build step).

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `animations/01-scroll-based/parallax-depth-of-field/index.html` | Full demo: markup, styles, JS |
| Create | `animations/01-scroll-based/parallax-depth-of-field/README.md` | 6-section explanation |
| Create | `animations/01-scroll-based/README.md` | Category index listing |
| Modify | `index.html` (root) | Add link to new animation |

---

## Task 1: Folder, README, and Category Index

**Files:**
- Create: `animations/01-scroll-based/parallax-depth-of-field/README.md`
- Create: `animations/01-scroll-based/README.md`

- [ ] **Step 1: Create the animation folder**

```bash
mkdir -p animations/01-scroll-based/parallax-depth-of-field
```

- [ ] **Step 2: Write the animation README.md**

Create `animations/01-scroll-based/parallax-depth-of-field/README.md`:

```markdown
# Parallax Depth-of-Field

[Live demo](index.html)

## What it is

Parallax depth-of-field combines two scroll-driven techniques: each layer of a
scene moves at a speed proportional to its perceived distance from the viewer
(parallax), and a virtual focal plane blurs every layer according to how far it
sits from the current focal depth. The result mimics a camera rack-focus pulled
through a landscape as you scroll.

## When to use it

- Cinematic hero sections where scroll is the narrative driver
- Storytelling sequences that guide attention through depth layers
- Portfolio or editorial intros that need more presence than a static image
- Anywhere you want to make a flat 2D scene feel three-dimensional

## How it works

Each layer has a fixed depth value `d ∈ [0, 1]` (0 = farthest, 1 = nearest).
The focal plane is a value `f` that advances from 0 to 1 as the user scrolls.

```js
const blur = MAX_BLUR * Math.abs(layer.depth - f);
layer.el.style.filter = `blur(${blur}px)`;
```

Simultaneously, each layer translates vertically at a speed proportional to its
depth:

```js
layer.el.style.transform = `translateY(${layer.speed * f * maxOffset}px)`;
```

Layers closer to the viewer travel farther, reinforcing the sense of depth.

## Key parameters

| Parameter  | Default | Effect |
|------------|---------|--------|
| `MAX_BLUR` | 14px    | Maximum blur on a layer at full distance from focal plane |
| `depth`    | 0.0–1.0 | Fixed depth per layer; 0 = far, 1 = near |
| `speed`    | 0.0–0.70 | Fraction of `maxOffset` the layer travels over full scroll |
| `maxOffset`| 120px   | Maximum translateY distance (applied at nearest layer) |

## Production notes

- `filter: blur()` triggers compositing. Add `will-change: filter` to each
  layer element to promote it to its own compositor layer and avoid per-frame
  paints.
- Blurring large SVGs is GPU-friendly; blurring large raster images is not —
  test on mobile before shipping.
- For production scroll choreography, GSAP ScrollTrigger with `scrub: true`
  gives smoother performance and easing control. Framer Motion's `useScroll` +
  `useTransform` is the React equivalent.
- The focal plane concept maps directly to any animation driven by a 0–1
  progress value — it is not scroll-specific.

## See also

- *(more scroll-based entries coming)*
```

- [ ] **Step 3: Write the category README**

Create `animations/01-scroll-based/README.md`:

```markdown
# Scroll-Based Animations

Techniques driven by scroll position.

## Entries

- [Parallax Depth-of-Field](parallax-depth-of-field/) — Five layered SVG mountains with
  parallax translation and blur-based depth-of-field driven by scroll progress.
```

- [ ] **Step 4: Commit**

```bash
git add animations/
git commit -m "feat: add parallax-depth-of-field README and category index"
```

---

## Task 2: HTML Scaffold — Layout, CSS, and Static SVG Layers

**Files:**
- Create: `animations/01-scroll-based/parallax-depth-of-field/index.html`

Build the full static page first (no JS), so you can verify the visual design before adding any behavior.

- [ ] **Step 1: Create index.html with full markup, CSS, and SVG layers**

Create `animations/01-scroll-based/parallax-depth-of-field/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Parallax Depth-of-Field</title>
  <style>
    :root {
      --bg: #060a10;
      --ui-bg: #0d1117;
      --ui-border: #21262d;
      --ui-accent: #58a6ff;
      --ui-text: #c9d1d9;
      --ui-muted: #8b949e;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg); color: var(--ui-text); font-family: monospace; }

    header {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      padding: 16px 24px;
      background: linear-gradient(to bottom, rgba(6,10,16,.9), transparent);
      pointer-events: none;
    }
    header h1 { font-size: 13px; letter-spacing: 2px; text-transform: uppercase; }
    header p  { font-size: 11px; color: var(--ui-muted); margin-top: 4px; }

    .scroll-stage    { height: 500vh; position: relative; }
    .sticky-viewport { position: sticky; top: 0; height: 100vh; overflow: hidden; }

    .layer {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      will-change: transform, filter;
    }

    /* ── Sidebar ── */
    .sidebar {
      position: fixed; right: 0; top: 50%; transform: translateY(-50%);
      width: 112px; z-index: 200;
      background: var(--ui-bg); border: 1px solid var(--ui-border);
      border-right: none; border-radius: 8px 0 0 8px;
      padding: 16px 12px;
      display: flex; flex-direction: column; gap: 10px;
    }
    .s-label {
      font-size: 9px; text-transform: uppercase;
      letter-spacing: 1px; color: var(--ui-accent);
    }
    .slider-wrap {
      display: flex; flex-direction: column; align-items: center; gap: 4px;
    }
    .tick { font-size: 8px; color: var(--ui-muted); }
    input[type=range].focal-slider {
      writing-mode: vertical-lr; direction: rtl;
      -webkit-appearance: slider-vertical; appearance: slider-vertical;
      width: 28px; height: 96px; cursor: pointer;
      accent-color: var(--ui-accent);
    }
    .divider { height: 1px; background: var(--ui-border); }
    .readout { display: flex; flex-direction: column; gap: 3px; }
    .readout-row {
      display: flex; justify-content: space-between;
      font-size: 9px; color: var(--ui-muted);
    }
    .readout-row.focused { color: var(--ui-accent); }
    .readout-row .val { color: var(--ui-text); }

    @media (max-width: 600px) {
      .sidebar {
        right: auto; top: auto; bottom: 0; left: 0; width: 100%;
        transform: none; border-radius: 8px 8px 0 0;
        border: 1px solid var(--ui-border); border-bottom: none;
        flex-direction: row; align-items: center;
        padding: 10px 16px; gap: 10px;
      }
      .slider-wrap { flex-direction: row; }
      input[type=range].focal-slider {
        writing-mode: horizontal-tb; direction: ltr;
        -webkit-appearance: auto; appearance: auto;
        width: 110px; height: auto;
      }
      .tick { display: none; }
      .readout { flex-direction: row; gap: 8px; }
    }
  </style>
</head>
<body>

<header>
  <h1>Parallax Depth-of-Field</h1>
  <p>Five mountain layers translate at different speeds; a focal plane blurs each by its depth distance.</p>
</header>

<div class="scroll-stage">
  <div class="sticky-viewport">

    <!-- L5: Sky + stars (depth 0.0, static) -->
    <svg class="layer" id="l5" viewBox="0 0 1200 800"
         preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0a1628"/>
          <stop offset="100%" stop-color="#060a10"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#sky)"/>
      <circle cx="80"   cy="55"  r="1.2" fill="#fff" opacity=".5"/>
      <circle cx="210"  cy="28"  r="1"   fill="#fff" opacity=".4"/>
      <circle cx="345"  cy="88"  r=".9"  fill="#fff" opacity=".6"/>
      <circle cx="480"  cy="18"  r="1.3" fill="#fff" opacity=".3"/>
      <circle cx="600"  cy="52"  r="1"   fill="#fff" opacity=".5"/>
      <circle cx="720"  cy="33"  r="1.1" fill="#fff" opacity=".4"/>
      <circle cx="865"  cy="14"  r=".8"  fill="#fff" opacity=".6"/>
      <circle cx="950"  cy="68"  r="1.2" fill="#fff" opacity=".3"/>
      <circle cx="1055" cy="40"  r="1"   fill="#fff" opacity=".5"/>
      <circle cx="1150" cy="24"  r=".9"  fill="#fff" opacity=".4"/>
      <circle cx="155"  cy="118" r=".8"  fill="#fff" opacity=".3"/>
      <circle cx="395"  cy="138" r="1"   fill="#fff" opacity=".4"/>
      <circle cx="672"  cy="108" r=".9"  fill="#fff" opacity=".5"/>
      <circle cx="902"  cy="128" r="1.1" fill="#fff" opacity=".3"/>
    </svg>

    <!-- L4: Distant peaks (depth 0.2) -->
    <svg class="layer" id="l4" viewBox="0 0 1200 800"
         preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <polygon fill="#0d2b3e"
        points="0,500 80,340 180,400 300,280 420,360 540,260
                660,320 780,290 900,330 1020,270 1140,310 1200,290 1200,800 0,800"/>
    </svg>

    <!-- L3: Mid mountains (depth 0.4) -->
    <svg class="layer" id="l3" viewBox="0 0 1200 800"
         preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <polygon fill="#0f2236"
        points="0,530 100,390 220,440 360,320 480,400 600,310
                720,370 840,345 960,382 1080,332 1200,360 1200,800 0,800"/>
    </svg>

    <!-- L2: Near hills (depth 0.7) -->
    <svg class="layer" id="l2" viewBox="0 0 1200 800"
         preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <polygon fill="#0c1828"
        points="0,570 120,445 260,480 400,392 540,455 680,382
                820,432 960,408 1100,442 1200,422 1200,800 0,800"/>
    </svg>

    <!-- L1: Foreground (depth 1.0) -->
    <svg class="layer" id="l1" viewBox="0 0 1200 800"
         preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <polygon fill="#060810"
        points="0,612 160,502 320,542 480,472 640,522 800,482
                960,522 1120,492 1200,508 1200,800 0,800"/>
    </svg>

  </div>
</div>

<aside class="sidebar">
  <div class="s-label">Focal Plane</div>
  <div class="slider-wrap">
    <span class="tick">far</span>
    <input type="range" class="focal-slider" id="focalSlider" min="0" max="100" value="0">
    <span class="tick">near</span>
  </div>
  <div class="divider"></div>
  <div class="s-label">Blur</div>
  <div class="readout" id="readout">
    <div class="readout-row" id="row-l5"><span>L5</span><span class="val">0px</span></div>
    <div class="readout-row" id="row-l4"><span>L4</span><span class="val">0px</span></div>
    <div class="readout-row" id="row-l3"><span>L3</span><span class="val">0px</span></div>
    <div class="readout-row" id="row-l2"><span>L2</span><span class="val">0px</span></div>
    <div class="readout-row" id="row-l1"><span>L1</span><span class="val">0px</span></div>
  </div>
</aside>

</body>
</html>
```

- [ ] **Step 2: Open in browser and verify static layout**

Open `animations/01-scroll-based/parallax-depth-of-field/index.html` directly in a browser (double-click or `file://` URL).

Expected:
- Dark background with a star field visible
- 5 mountain ridgeline silhouettes stacked, progressively darker/closer
- Fixed right sidebar with slider and 5 blur rows all reading `0px`
- Header text at top-left
- No errors in browser console

- [ ] **Step 3: Commit the static scaffold**

```bash
git add animations/01-scroll-based/parallax-depth-of-field/index.html
git commit -m "feat: add parallax-depth-of-field static scaffold"
```

---

## Task 3: Parallax Scroll + Focal Plane JS

**Files:**
- Modify: `animations/01-scroll-based/parallax-depth-of-field/index.html` — add `<script>` before `</body>`

- [ ] **Step 1: Add the script block**

Insert this immediately before `</body>` in `index.html` (replace the closing `</body>` tag):

```html
<script>
  const LAYERS = [
    { el: document.getElementById('l5'), depth: 0.0, speed: 0.00 },
    { el: document.getElementById('l4'), depth: 0.2, speed: 0.10 },
    { el: document.getElementById('l3'), depth: 0.4, speed: 0.25 },
    { el: document.getElementById('l2'), depth: 0.7, speed: 0.45 },
    { el: document.getElementById('l1'), depth: 1.0, speed: 0.70 },
  ];
  const ROWS = [
    document.getElementById('row-l5'),
    document.getElementById('row-l4'),
    document.getElementById('row-l3'),
    document.getElementById('row-l2'),
    document.getElementById('row-l1'),
  ];
  const slider  = document.getElementById('focalSlider');
  const MAX_BLUR   = 14;
  const MAX_OFFSET = 120;
  let manualOverride = false;

  function applyFrame(f) {
    let closestIdx = 0, closestDist = Infinity;
    LAYERS.forEach((layer, i) => {
      const dist = Math.abs(layer.depth - f);
      if (dist < closestDist) { closestDist = dist; closestIdx = i; }
      const blur   = Math.round(MAX_BLUR * dist * 10) / 10;
      const offset = layer.speed * f * MAX_OFFSET;
      layer.el.style.filter    = `blur(${blur}px)`;
      layer.el.style.transform = `translateY(${offset}px)`;
      ROWS[i].querySelector('.val').textContent = `${blur}px`;
    });
    ROWS.forEach((r, i) => r.classList.toggle('focused', i === closestIdx));
  }

  function onScroll() {
    if (manualOverride) return;
    const stage = document.querySelector('.scroll-stage');
    const max   = stage.offsetHeight - window.innerHeight;
    const f     = Math.min(1, Math.max(0, window.scrollY / max));
    slider.value = f * 100;
    applyFrame(f);
  }

  slider.addEventListener('input', () => {
    manualOverride = true;
    applyFrame(slider.value / 100);
  });

  window.addEventListener('scroll', () => {
    manualOverride = false;
    onScroll();
  }, { passive: true });

  applyFrame(0);
</script>
</body>
</html>
```

- [ ] **Step 2: Verify parallax + blur in browser**

Reload `index.html` in the browser.

Expected — scroll behavior:
- Scrolling down moves near layers (L1, L2) much faster than far layers (L4, L5)
- As you scroll, blur transitions: L5 starts sharp at scroll top, each successive layer comes into focus then blurs as you continue down
- Blur readout values update live on every scroll tick
- The focused layer row highlights in accent blue

Expected — slider behavior:
- Dragging the slider changes the focal plane independently of scroll position
- Blur readout updates immediately
- Scrolling after touching the slider takes control back from the slider

- [ ] **Step 3: Check line count**

```bash
wc -l animations/01-scroll-based/parallax-depth-of-field/index.html
```

Expected: under 200 lines. If over 300, the file violates the project constraint — review SVG verbosity and collapse whitespace.

- [ ] **Step 4: Commit**

```bash
git add animations/01-scroll-based/parallax-depth-of-field/index.html
git commit -m "feat: add parallax scroll and focal-plane blur to depth-of-field demo"
```

---

## Task 4: Update Root Index Page

**Files:**
- Modify: `index.html` (root)

The root `index.html` is currently nearly empty. Replace it with a proper handbook index page that links to the animation.

- [ ] **Step 1: Replace root index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Animation Handbook</title>
  <style>
    :root { --bg: #060a10; --text: #c9d1d9; --muted: #8b949e; --accent: #58a6ff; --border: #21262d; }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg); color: var(--text); font-family: monospace; padding: 48px 32px; max-width: 720px; margin: 0 auto; }
    h1 { font-size: 18px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px; }
    .subtitle { font-size: 12px; color: var(--muted); margin-bottom: 48px; }
    h2 { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: var(--muted); margin: 32px 0 12px; }
    ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
    a { color: var(--accent); text-decoration: none; font-size: 13px; }
    a:hover { text-decoration: underline; }
    .desc { font-size: 11px; color: var(--muted); margin-top: 2px; }
  </style>
</head>
<body>
  <h1>Animation Handbook</h1>
  <p class="subtitle">A visual reference of web animation techniques.</p>

  <h2>01 — Scroll-Based</h2>
  <ul>
    <li>
      <a href="animations/01-scroll-based/parallax-depth-of-field/">Parallax Depth-of-Field</a>
      <p class="desc">Five mountain layers with parallax translation and blur-based depth-of-field driven by scroll.</p>
    </li>
  </ul>
</body>
</html>
```

- [ ] **Step 2: Open root index.html in browser and verify**

Open the root `index.html`. Expected:
- Dark page with "Animation Handbook" header
- One entry under "01 — Scroll-Based" linking to the animation
- Clicking the link opens the animation demo

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add root handbook index page with depth-of-field entry"
```

---

## Self-Review Checklist

### Spec coverage

| Spec requirement | Covered by |
|-----------------|------------|
| 5 stacked SVG layers, mountains/peaks aesthetic | Task 2 Step 1 — 5 SVG polygons with teal/indigo palette |
| Layers translate at different speeds on scroll | Task 3 Step 1 — `speed` array, `translateY` in `applyFrame` |
| Virtual focal plane slides far→near on scroll | Task 3 Step 1 — `f = scrollY / maxScroll`, `blur = MAX_BLUR * abs(depth - f)` |
| Slider to manually set focal plane | Task 3 Step 1 — `<input type=range>`, `manualOverride` flag |
| Live readout panel per layer blur | Task 2 Step 1 (markup) + Task 3 Step 1 (JS update) |
| Fixed right sidebar | Task 2 Step 1 — `position:fixed`, right-aligned |
| Mobile responsive, collapse under 600px | Task 2 Step 1 — `@media (max-width:600px)` block |
| Dark stage, CSS variables, header | Task 2 Step 1 |
| README with all 6 sections | Task 1 Step 2 |
| Category README updated | Task 1 Step 3 |
| Root index.html updated | Task 4 |
| Single file, no external deps, offline | All code is self-contained |
| Under 300 lines | Task 3 Step 3 — explicit line count check |

### No placeholders

Scanned — no TBD, TODO, or vague steps. All code is shown in full.

### Type consistency

- `LAYERS[i].el` used in Task 3; elements are obtained by `getElementById` matching IDs set in Task 2 (`l5`, `l4`, `l3`, `l2`, `l1`) — consistent.
- `ROWS[i].querySelector('.val')` used in Task 3; `.val` class set on `<span class="val">` in Task 2 markup — consistent.
- `slider.value / 100` maps 0–100 range input to 0–1 focal value — consistent with `applyFrame(f)` expecting 0–1.
