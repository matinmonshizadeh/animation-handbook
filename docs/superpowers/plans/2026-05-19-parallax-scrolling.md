# Parallax Scrolling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a self-contained demo showing 4 SVG mountain-valley layers scrolling at different speeds inside a bounded stage, with a live control panel for per-layer speed adjustment.

**Architecture:** Single `index.html` — CSS/JS all inline. A `600px` stage div with `overflow-y: scroll` and hidden scrollbars contains a `1800px` scene; a sticky wrapper keeps the 4 absolutely-positioned SVG layers in the viewport while a passive scroll listener queues one `requestAnimationFrame` per scroll group to apply `translate3d` offsets. Controls panel sits beside the stage (stacks below on mobile).

**Tech Stack:** Plain HTML5, CSS custom properties, vanilla JS. No libraries, no build step.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `animations/01-scroll-based/parallax-scrolling/index.html` | Full demo |
| Create | `animations/01-scroll-based/parallax-scrolling/README.md` | 6-section explanation |
| Modify | `animations/01-scroll-based/README.md` | Add entry to category index |
| Modify | `index.html` (root) | Add link to new animation |

---

## Task 1: Folder, README, and Category Index Update

**Files:**
- Create: `animations/01-scroll-based/parallax-scrolling/README.md`
- Modify: `animations/01-scroll-based/README.md`

- [ ] **Step 1: Create folder**

```bash
mkdir -p animations/01-scroll-based/parallax-scrolling
```

- [ ] **Step 2: Create README.md**

Create `animations/01-scroll-based/parallax-scrolling/README.md`:

```markdown
# Parallax Scrolling

[Live demo](index.html)

## What it is

Parallax scrolling moves background layers slower than foreground layers as the
user scrolls, creating an illusion of 3D depth on a flat screen. The effect
exploits motion parallax: nearby objects appear to move more than distant ones
as the observer moves. Each layer is assigned a speed multiplier; slower
multipliers simulate greater distance.

## When to use it

- Hero sections on landing pages where a scene sets the mood
- Storytelling scrolls and editorial features with environmental depth
- Product showcases where scene context reinforces the subject
- Portfolio "about" sections that benefit from atmospheric immersion

## How it works

Each layer has a speed multiplier `s ∈ [0, 1.5]`. On scroll, a single
`requestAnimationFrame` callback reads `scrollTop` and applies:

```js
const offset = scrollTop * speed;
layer.el.style.transform = `translate3d(0, ${offset}px, 0)`;
```

Layers with low speed (sky: 10%) barely move — they appear far away. Layers
with high speed (foreground: 100%) track the scroll — they appear close. The
ratio between speeds determines how convincing the illusion is.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Sky speed | 10% | Near-zero drift — appears stationary |
| Ridgeline speed | 30% | Slow drift |
| Treeline speed | 60% | Mid-distance drift |
| Foreground speed | 100% | Full scroll travel |
| Scene height | 1800px | Total scroll distance (max scroll = 1200px) |

## Production notes

- **GPU acceleration:** `translate3d` (not `translateY`) promotes the element
  to a compositor layer. Pair with `will-change: transform` declared before the
  first frame to avoid layer promotion jank on the initial scroll.
- **rAF throttling:** scroll events fire faster than display refresh (up to
  1000Hz on some devices vs. 60–120Hz frame rate). The dirty-flag pattern
  (`ticking` boolean) ensures only one `requestAnimationFrame` is queued per
  rendered frame, preventing redundant work.
- **Library alternatives:** GSAP ScrollTrigger provides `scrub` easing and
  timeline integration. Locomotive Scroll and Lenis add momentum/inertia
  scrolling with parallax hooks. Rellax is a lightweight zero-dependency option
  for simple cases.
- **Accessibility:** respect `prefers-reduced-motion: reduce`. When the user
  has requested reduced motion, skip all `transform` updates and show the
  static scene. Apply `will-change: auto` in the reduced-motion media query to
  avoid unnecessary layer promotion.

## See also

- [Parallax Depth-of-Field](../parallax-depth-of-field/) — the same depth
  technique with blur applied per layer based on focal-plane distance rather
  than translation speed.
```

- [ ] **Step 3: Update category README**

Open `animations/01-scroll-based/README.md` and replace its content with:

```markdown
# Scroll-Based Animations

Techniques driven by scroll position.

## Entries

- [Parallax Depth-of-Field](parallax-depth-of-field/) — Five layered SVG mountains with
  parallax translation and blur-based depth-of-field driven by scroll progress.
- [Parallax Scrolling](parallax-scrolling/) — Four SVG layers at different scroll speeds
  create a 3D depth illusion; adjustable speed multipliers show how ratios make or break the effect.
```

- [ ] **Step 4: Commit**

```bash
git add animations/01-scroll-based/
git commit -m "feat: add parallax-scrolling README and update category index"
```

---

## Task 2: HTML Scaffold — Layout, CSS, and Static SVG Layers

**Files:**
- Create: `animations/01-scroll-based/parallax-scrolling/index.html`

Build the full page without JavaScript first. Verify the scene looks correct before wiring the scroll mechanic.

- [ ] **Step 1: Create index.html**

Create `animations/01-scroll-based/parallax-scrolling/index.html` with this exact content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Parallax Scrolling</title>
  <style>
    :root {
      --bg:#060a10; --ui-bg:#0d1117; --ui-border:#21262d;
      --ui-accent:#58a6ff; --ui-text:#c9d1d9; --ui-muted:#8b949e;
    }
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:var(--bg);color:var(--ui-text);font-family:monospace;
         padding:clamp(12px,3vw,24px)}

    header{margin-bottom:20px}
    header h1{font-size:clamp(11px,1.8vw,15px);letter-spacing:2px;text-transform:uppercase}
    header p{font-size:clamp(10px,1.2vw,12px);color:var(--ui-muted);margin-top:4px}

    .layout{display:flex;gap:clamp(12px,2vw,24px);align-items:flex-start}

    .stage{
      flex:1;min-width:0;height:600px;
      overflow-y:scroll;scrollbar-width:none;
      border:1px solid var(--ui-border);border-radius:8px;
    }
    .stage::-webkit-scrollbar{display:none}
    .scene{height:1800px}
    .layers{position:sticky;top:0;height:600px;overflow:hidden}
    .layer{
      position:absolute;top:0;left:0;width:100%;height:600px;
      will-change:transform;
    }
    .layer svg{width:100%;height:100%}

    aside{
      width:clamp(180px,20vw,220px);flex-shrink:0;
      background:var(--ui-bg);border:1px solid var(--ui-border);
      border-radius:8px;padding:16px;
      display:flex;flex-direction:column;gap:10px;
    }
    .note{
      font-size:10px;color:var(--ui-muted);line-height:1.6;
      border-left:2px solid var(--ui-accent);padding-left:8px;
    }
    .lbl{font-size:9px;text-transform:uppercase;letter-spacing:1px;color:var(--ui-accent)}
    .row{display:flex;justify-content:space-between;font-size:10px}
    .row .v{color:var(--ui-text)}
    .tbl{display:flex;flex-direction:column;gap:2px}
    .tbl .row{font-size:9px;color:var(--ui-muted)}
    .sliders{display:flex;flex-direction:column;gap:5px}
    .sr{display:flex;align-items:center;gap:5px;font-size:9px}
    .sr label{width:42px;color:var(--ui-muted);flex-shrink:0}
    .sr input[type=range]{flex:1;accent-color:var(--ui-accent);min-height:20px}
    .sr .sv{width:32px;text-align:right;color:var(--ui-text)}
    .div{height:1px;background:var(--ui-border)}
    .tog{display:flex;align-items:center;gap:8px;font-size:10px;cursor:pointer}
    .tog input{accent-color:var(--ui-accent);width:16px;height:16px;flex-shrink:0}
    button{
      background:transparent;border:1px solid var(--ui-border);
      color:var(--ui-text);font-family:monospace;font-size:10px;
      padding:8px;border-radius:4px;cursor:pointer;width:100%;
    }
    button:hover{border-color:var(--ui-accent);color:var(--ui-accent)}

    @media(max-width:600px){
      .layout{flex-direction:column}
      aside{width:100%}
      .stage{height:400px}
      .layers{height:400px}
      .layer{height:400px}
    }
    @media(min-width:601px) and (max-width:1024px){
      .sr input[type=range]{min-height:28px}
    }
    @media(prefers-reduced-motion:reduce){.layer{will-change:auto}}
  </style>
</head>
<body>

<header>
  <h1>Parallax Scrolling</h1>
  <p>Elements move at different speeds — background slower, foreground faster — creating a 3D depth illusion.</p>
</header>

<div class="layout">

  <div class="stage" id="stage">
    <div class="scene">
      <div class="layers">

        <!-- L1: Sky + stars (speed 10%) -->
        <div class="layer" id="l1">
          <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0a1628"/>
                <stop offset="100%" stop-color="#060a10"/>
              </linearGradient>
            </defs>
            <rect width="800" height="600" fill="url(#sky)"/>
            <circle cx="80"  cy="55"  r="1.2" fill="#fff" opacity=".5"/>
            <circle cx="200" cy="28"  r="1"   fill="#fff" opacity=".4"/>
            <circle cx="330" cy="78"  r=".9"  fill="#fff" opacity=".6"/>
            <circle cx="470" cy="18"  r="1.3" fill="#fff" opacity=".3"/>
            <circle cx="580" cy="52"  r="1"   fill="#fff" opacity=".5"/>
            <circle cx="680" cy="33"  r="1.1" fill="#fff" opacity=".4"/>
            <circle cx="755" cy="14"  r=".8"  fill="#fff" opacity=".6"/>
            <circle cx="140" cy="108" r=".9"  fill="#fff" opacity=".3"/>
            <circle cx="420" cy="96"  r="1"   fill="#fff" opacity=".4"/>
            <circle cx="640" cy="116" r=".8"  fill="#fff" opacity=".3"/>
          </svg>
        </div>

        <!-- L2: Distant ridgeline (speed 30%) -->
        <div class="layer" id="l2">
          <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <polygon fill="#0d2b3e"
              points="0,380 60,258 130,298 220,208 310,268 400,193
                      490,243 580,213 660,253 740,223 800,236 800,600 0,600"/>
          </svg>
        </div>

        <!-- L3: Pine treeline (speed 60%) -->
        <div class="layer" id="l3">
          <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <polygon fill="#0a1f2e"
              points="0,442 35,362 65,380 95,320 135,344 175,297 215,324
                      265,287 305,310 360,274 400,297 450,262 490,284
                      540,270 580,294 635,280 675,304 720,287 760,310
                      800,294 800,600 0,600"/>
          </svg>
        </div>

        <!-- L4: Foreground grass (speed 100%) -->
        <div class="layer" id="l4">
          <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <polygon fill="#050e08"
              points="0,497 80,452 160,472 240,450 320,467 400,454
                      480,470 560,457 640,472 720,458 800,464 800,600 0,600"/>
            <ellipse cx="100" cy="507" rx="60" ry="15" fill="#040c07"/>
            <ellipse cx="280" cy="514" rx="70" ry="18" fill="#030b06"/>
            <ellipse cx="500" cy="508" rx="65" ry="16" fill="#040c07"/>
            <ellipse cx="700" cy="502" rx="55" ry="14" fill="#040c07"/>
          </svg>
        </div>

      </div>
    </div>
  </div>

  <aside>
    <p class="note">Real cameras render depth geometrically — layers slow down roughly as 1/distance. Try ratios like 100% / 60% / 30% / 10% for the most believable depth.</p>

    <div>
      <div class="lbl">Scroll Progress</div>
      <div class="row"><span>Progress</span><span class="v" id="progress">0%</span></div>
    </div>

    <div>
      <div class="lbl">Layer Offsets</div>
      <div class="tbl">
        <div class="row"><span>Sky</span><span class="v" id="off1">0px</span></div>
        <div class="row"><span>Ridgeline</span><span class="v" id="off2">0px</span></div>
        <div class="row"><span>Treeline</span><span class="v" id="off3">0px</span></div>
        <div class="row"><span>Grass</span><span class="v" id="off4">0px</span></div>
      </div>
    </div>

    <div class="div"></div>

    <div>
      <div class="lbl">Speed Multipliers</div>
      <div class="sliders">
        <div class="sr"><label>Sky</label>
          <input type="range" id="s1" min="0" max="150" value="10">
          <span class="sv" id="sv1">10%</span></div>
        <div class="sr"><label>Ridge</label>
          <input type="range" id="s2" min="0" max="150" value="30">
          <span class="sv" id="sv2">30%</span></div>
        <div class="sr"><label>Trees</label>
          <input type="range" id="s3" min="0" max="150" value="60">
          <span class="sv" id="sv3">60%</span></div>
        <div class="sr"><label>Grass</label>
          <input type="range" id="s4" min="0" max="150" value="100">
          <span class="sv" id="sv4">100%</span></div>
      </div>
    </div>

    <div class="div"></div>

    <label class="tog">
      <input type="checkbox" id="tog">
      <span>Disable parallax (all 100%)</span>
    </label>

    <button id="resetBtn">Reset to defaults</button>
  </aside>

</div>

</body>
</html>
```

- [ ] **Step 2: Check line count**

```bash
wc -l animations/01-scroll-based/parallax-scrolling/index.html
```

Expected: under 200. If over 300, the file violates the project constraint.

- [ ] **Step 3: Open in browser and verify static layout**

Open `animations/01-scroll-based/parallax-scrolling/index.html` directly.

Expected:
- Dark stage (600px tall) with all 4 mountain layers visible, stacked correctly
- Sky gradient + stars at back, near-black grass at front
- Right sidebar with note, readout placeholders, 4 sliders, toggle, reset button
- No console errors

- [ ] **Step 4: Commit**

```bash
git add animations/01-scroll-based/parallax-scrolling/index.html
git commit -m "feat: add parallax-scrolling static scaffold"
```

---

## Task 3: Scroll Mechanic + Controls JS

**Files:**
- Modify: `animations/01-scroll-based/parallax-scrolling/index.html` — insert `<script>` before `</body>`

- [ ] **Step 1: Insert script block**

Find the `</body>` closing tag and replace `</body>\n</html>` with:

```html
<script>
  const DEFAULTS = [0.10, 0.30, 0.60, 1.00];
  const LAYERS   = DEFAULTS.map((s, i) => ({
    el: document.getElementById('l' + (i + 1)),
    speed: s,
  }));
  const stage    = document.getElementById('stage');
  const progEl   = document.getElementById('progress');
  const OFFS     = [1,2,3,4].map(i => document.getElementById('off' + i));
  const SLIDERS  = [1,2,3,4].map(i => document.getElementById('s' + i));
  const SVALS    = [1,2,3,4].map(i => document.getElementById('sv' + i));
  const tog      = document.getElementById('tog');
  const resetBtn = document.getElementById('resetBtn');
  const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ticking    = false;

  function update() {
    const st  = stage.scrollTop;
    const max = stage.scrollHeight - stage.clientHeight;
    progEl.textContent = max > 0 ? Math.round(st / max * 100) + '%' : '0%';
    LAYERS.forEach((L, i) => {
      const off = Math.round(st * L.speed);
      L.el.style.transform    = `translate3d(0,${off}px,0)`;
      OFFS[i].textContent     = off + 'px';
    });
    ticking = false;
  }

  stage.addEventListener('scroll', () => {
    if (noMotion) return;
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  SLIDERS.forEach((sl, i) => {
    sl.addEventListener('input', () => {
      if (!tog.checked) LAYERS[i].speed = sl.value / 100;
      SVALS[i].textContent = sl.value + '%';
      update();
    });
  });

  tog.addEventListener('change', () => {
    LAYERS.forEach((L, i) => {
      L.speed = tog.checked ? 1.0 : SLIDERS[i].value / 100;
    });
    update();
  });

  resetBtn.addEventListener('click', () => {
    tog.checked = false;
    DEFAULTS.forEach((d, i) => {
      LAYERS[i].speed        = d;
      SLIDERS[i].value       = d * 100;
      SVALS[i].textContent   = Math.round(d * 100) + '%';
    });
    update();
  });

  update();
</script>
</body>
</html>
```

- [ ] **Step 2: Check final line count**

```bash
wc -l animations/01-scroll-based/parallax-scrolling/index.html
```

Expected: under 280 lines. If over 300, collapse CSS whitespace or inline SVG attributes.

- [ ] **Step 3: Verify in browser**

Reload `index.html`.

Expected — scroll behavior:
- Scrolling inside the dark stage box moves layers at visibly different speeds
- Sky barely moves; grass moves 10× faster
- Progress % increments from 0% to 100% as you scroll through the 1800px scene
- Offset readout updates live (sky single-digit px, grass triple-digit px)

Expected — controls:
- Sky slider at 0%: sky is frozen (no translateY change on scroll)
- Sky slider at 150%: sky moves faster than everything else (broken illusion)
- "Disable parallax" checked: all layers move at the same speed (flat/2D appearance)
- "Disable parallax" unchecked: speeds restored from slider positions
- "Reset to defaults": sliders snap to 10/30/60/100, toggle unchecked

Expected — reduced motion:
- In Chrome DevTools: Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce` → scrolling does nothing (static scene)

- [ ] **Step 4: Commit**

```bash
git add animations/01-scroll-based/parallax-scrolling/index.html
git commit -m "feat: add scroll mechanic and controls to parallax-scrolling demo"
```

---

## Task 4: Update Root Index Page

**Files:**
- Modify: `index.html` (root)

- [ ] **Step 1: Add the new entry to the list**

In root `index.html`, find:

```html
    <li>
      <a href="animations/01-scroll-based/parallax-depth-of-field/">Parallax Depth-of-Field</a>
      <span class="desc" style="display:block">Five mountain layers with parallax translation and blur-based depth-of-field driven by scroll.</span>
    </li>
  </ul>
```

Replace with:

```html
    <li>
      <a href="animations/01-scroll-based/parallax-depth-of-field/">Parallax Depth-of-Field</a>
      <span class="desc" style="display:block">Five mountain layers with parallax translation and blur-based depth-of-field driven by scroll.</span>
    </li>
    <li>
      <a href="animations/01-scroll-based/parallax-scrolling/">Parallax Scrolling</a>
      <span class="desc" style="display:block">Four SVG layers at different scroll speeds create a 3D depth illusion; adjustable speed sliders show how ratios make or break the effect.</span>
    </li>
  </ul>
```

- [ ] **Step 2: Verify root index in browser**

Open root `index.html`. Expected:
- Two entries under "01 — Scroll-Based"
- Both links open the correct demo

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add parallax-scrolling to root atlas index"
```

---

## Self-Review

### Spec coverage

| Requirement | Covered by |
|-------------|-----------|
| 4 depth layers (sky, ridgeline, treeline, grass) | Task 2 — 4 SVG layers with IDs l1–l4 |
| Speeds: ~10% / ~30% / ~60% / ~100% | Task 3 — `DEFAULTS = [0.10, 0.30, 0.60, 1.00]` |
| Inline SVG, mountain valley theme | Task 2 — polygon silhouettes, midnight palette |
| Scene ≥ 2× viewport height scroll distance | Task 2 — `scene` is 1800px, stage 600px → 1200px scroll range |
| `translate3d` for GPU acceleration | Task 3 — `translate3d(0, ${off}px, 0)` |
| Single scroll listener + rAF | Task 3 — `ticking` dirty flag + `requestAnimationFrame(update)` |
| Scroll progress readout | Task 3 — `progEl.textContent = Math.round(st/max*100)+'%'` |
| Per-layer live offset table | Task 3 — `OFFS[i].textContent = off + 'px'` |
| 4 speed sliders (0–150%) | Task 2 markup + Task 3 listeners |
| Reset to defaults button | Task 3 — `resetBtn` listener restores `DEFAULTS` |
| Disable parallax toggle | Task 3 — `tog` listener sets all speeds to 1.0 or restores |
| Educational note above controls | Task 2 — `.note` paragraph |
| Unrealistic ratios break illusion | Inherent — sliders go 0–150%, reversing ratios creates backward parallax |
| Mobile: panel stacks below stage ≤600px | Task 2 — `@media(max-width:600px)` flex-direction:column |
| Touch controls usable | Task 2 — `min-height:20px` on sliders, `16×16px` checkbox |
| README all 6 sections | Task 1 |
| Category README updated | Task 1 |
| Root index updated | Task 4 |
| Single file, no deps, offline | All code inline |
| Under 300 lines | Task 3 Step 2 — explicit check |
| `prefers-reduced-motion` | Task 2 CSS + Task 3 `noMotion` guard |

### Placeholder scan

None found.

### Type consistency

- `LAYERS[i].speed` set in `DEFAULTS.map()` (Task 3), read in `update()` (Task 3), mutated in slider/toggle/reset listeners (Task 3) — consistent.
- `SLIDERS[i].value` is a string from `<input>`; divided by 100 for speed — consistent across all listeners.
- `OFFS[i].textContent` updated in `update()` — consistent with IDs `off1`–`off4` defined in Task 2 markup.
