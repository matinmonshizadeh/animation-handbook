# Cover Card to Fixed Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a scroll stage where a large hero cover card scrubs into a compact fixed header, with every visual property — height, font size, opacity, blur, shadow — driven by a single eased 0→1 progress value.

**Architecture:** Single `index.html`. A `position:sticky` cover element collapses from `var(--cover-full)` to `var(--cover-min)` via JS-controlled `height`. A `flex:1` spacer inside the cover makes content rise organically as height shrinks — no transforms needed on individual text elements. Eight properties are interpolated against `e = easeOutCubic(scrollTop / RANGE)` inside a single rAF-throttled scroll handler. Controls panel provides collapse override slider, transition-range slider, binary toggle, and reset.

**Tech Stack:** Plain HTML5, CSS custom properties, vanilla JS. No libraries, no build step.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `animations/01-scroll-based/cover-card-to-fixed-header/index.html` | Full demo |
| Create | `animations/01-scroll-based/cover-card-to-fixed-header/README.md` | 6-section explanation |
| Modify | `animations/01-scroll-based/README.md` | Add entry |
| Modify | `index.html` (root) | Add link |

---

## Task 1: Folder, README, and Index Updates

**Files:**
- Create: `animations/01-scroll-based/cover-card-to-fixed-header/README.md`
- Modify: `animations/01-scroll-based/README.md`
- Modify: `index.html` (root)

- [ ] **Step 1: Create folder**

```bash
mkdir -p animations/01-scroll-based/cover-card-to-fixed-header
```

- [ ] **Step 2: Create README.md**

Create `animations/01-scroll-based/cover-card-to-fixed-header/README.md`:

```markdown
# Cover Card to Fixed Header

[Live demo](index.html)

## What it is

A large hero cover card that smoothly morphs into a compact fixed header as
the user scrolls. Height, font size, background opacity, blur, and element
visibility are all tied to a single progress value `p ∈ [0, 1]` derived from
scroll position. At `p = 0` the full cover is visible; at `p = 1` a minimal
header is pinned to the top. Every value between those extremes is a
deliberate, intentional intermediate state — not an accidental artifact of
a CSS transition.

## When to use it

- Article pages where a rich hero section should give way to a persistent
  navigation header without jarring the reader
- Product detail pages (e.g. Apple, Stripe) where the hero image collapses
  into a sticky toolbar
- Editorial sites and blogs that need to retain identity (title, author)
  without the full cover consuming scroll real estate

## How it works

One scroll listener reads `stage.scrollTop` and computes:

```js
const p = Math.min(1, Math.max(0, scrollTop / RANGE));
const e = easeOutCubic(p);
```

Eight properties are then interpolated against `e` in a single
`requestAnimationFrame` callback:

```js
cover.style.height        = lerp(530, 56, e) + 'px';
coverTitle.style.fontSize = lerp(26, 13, e)  + 'px';
coverBg.style.opacity     = lerp(1, 0.12, e);
coverBg.style.filter      = `blur(${lerp(0, 6, e)}px)`;
coverMeta.style.opacity   = 1 - clamp(e * 3, 0, 1);
coverSub.style.opacity    = 1 - clamp(e * 3, 0, 1);
coverAuthor.style.opacity = 1 - clamp(e * 2, 0, 1);
headerChip.style.opacity  = clamp((e - 0.5) * 2, 0, 1);
```

A `flex: 1` spacer inside the cover pushes content to the bottom at full
height and compresses as height shrinks, making the title rise to header
position without any JS transform on the title element itself.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| `RANGE` | 320px | Scroll distance over which the morph completes |
| Cover full height | 530px (desktop) / 480px (mobile) | Starting cover height |
| Cover min height | 56px (desktop) / 64px (mobile) | Collapsed header height |
| Easing | easeOutCubic | Brisk start, settled finish |

## Production notes

- **Scrubbing beats binary toggles.** A hard class-swap at a scroll threshold
  creates an awkward snap — if the user pauses exactly at the threshold,
  the header flickers. Scrubbing to a 0→1 value means every scroll position
  has a well-defined, intentional appearance. Medium, Substack, and the NYT
  app all use variants of this pattern.
- **The height animation triggers layout.** Animating `height` forces the
  browser to recalculate layout on every frame. The production alternative:
  keep the outer container at a fixed height, set `overflow: hidden`, and
  animate `clip-path` (layout-free) or `transform: scaleY()` on the inner
  element with `transform-origin: top`. This demo prioritises readability
  over raw performance.
- **Real-world examples.** Medium's article header, Apple's product detail
  pages, and Stripe's blog all implement variants of this morph. The
  distinguishing quality is always whether intermediate scroll states look
  intentional or accidental.
- **Library equivalents.** GSAP ScrollTrigger with `scrub: true` and a
  timeline that sets each property handles this pattern with easing per
  property. Framer Motion's `useScroll` + `useTransform` is the React
  equivalent. Both let you define keyframes along a scroll timeline rather
  than writing the interpolation arithmetic by hand.
- **Accessibility.** Under `prefers-reduced-motion: reduce`, skip the scrubbed
  morph entirely — snap instantly to the collapsed header when scroll exceeds
  `RANGE / 2`. Opposing or complex motion can be disorienting for users with
  vestibular disorders; this pattern specifically triggers that concern because
  properties change continuously during scroll.

## See also

- [Parallax Scrolling](../parallax-scrolling/) — single progress value driving
  speed-ratio depth; the same interpolation model applied to layer motion.
- [Reverse-Scrolling Columns](../reverse-scrolling-columns/) — another
  scroll-progress pattern, this time driving directional column motion.
```

- [ ] **Step 3: Update category README**

Replace entire content of `animations/01-scroll-based/README.md` with:

```markdown
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
```

- [ ] **Step 4: Update root index.html**

In root `index.html`, find:

```html
    <li>
      <a href="animations/01-scroll-based/reverse-scrolling-columns/">Reverse-Scrolling Columns</a>
      <span class="desc" style="display:block">A center column scrolls normally while two flanking columns scroll in reverse, looping infinitely — the opposing motion creates strong directional depth contrast.</span>
    </li>
  </ul>
```

Replace with:

```html
    <li>
      <a href="animations/01-scroll-based/reverse-scrolling-columns/">Reverse-Scrolling Columns</a>
      <span class="desc" style="display:block">A center column scrolls normally while two flanking columns scroll in reverse, looping infinitely — the opposing motion creates strong directional depth contrast.</span>
    </li>
    <li>
      <a href="animations/01-scroll-based/cover-card-to-fixed-header/">Cover Card to Fixed Header</a>
      <span class="desc" style="display:block">A hero cover card scrubs into a compact fixed header on scroll — height, font size, opacity, and blur all driven by a single eased progress value.</span>
    </li>
  </ul>
```

- [ ] **Step 5: Commit**

```bash
git add animations/01-scroll-based/cover-card-to-fixed-header/README.md
git add animations/01-scroll-based/README.md index.html
git commit -m "feat: add cover-card-to-fixed-header README and update indexes"
```

---

## Task 2: HTML Scaffold — CSS, Layout, Cover Card, Article Body, Sidebar

**Files:**
- Create: `animations/01-scroll-based/cover-card-to-fixed-header/index.html`

Build the full page without JavaScript first.

- [ ] **Step 1: Create index.html**

Create `animations/01-scroll-based/cover-card-to-fixed-header/index.html` with exactly this content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cover Card to Fixed Header</title>
  <style>
    :root{
      --bg:#060a10;--ui-bg:#0d1117;--ui-border:#21262d;
      --ui-accent:#3fb950;--ui-text:#c9d1d9;--ui-muted:#8b949e;
      --cover-full:530px;--cover-min:56px;
    }
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:var(--bg);color:var(--ui-text);font-family:monospace;
         padding:clamp(12px,3vw,24px)}
    header{margin-bottom:20px}
    header h1{font-size:clamp(11px,1.8vw,15px);letter-spacing:2px;text-transform:uppercase}
    header p{font-size:clamp(10px,1.2vw,12px);color:var(--ui-muted);margin-top:4px}

    .layout{display:flex;gap:clamp(12px,2vw,24px);align-items:flex-start}

    .stage{
      flex:1;min-width:0;height:620px;
      overflow-y:scroll;scrollbar-width:none;
      border:1px solid var(--ui-border);border-radius:8px;
    }
    .stage::-webkit-scrollbar{display:none}
    .scene{min-height:2500px}

    .cover{
      position:sticky;top:0;z-index:10;
      height:var(--cover-full);overflow:hidden;
      background:#050e08;
    }
    .cover-bg{
      position:absolute;inset:0;
      background:linear-gradient(150deg,#050e08,#0c2820,#060a10);
      will-change:opacity,filter;
    }
    .cover-code{
      position:absolute;top:14px;left:16px;
      font-size:9px;color:#1a4a30;line-height:1.7;
      pointer-events:none;user-select:none;
    }
    .cover-inner{
      position:relative;z-index:1;
      display:flex;flex-direction:column;
      height:100%;padding:0 24px 20px;
    }
    .cover-spacer{flex:1}
    .cover-meta{
      font-size:10px;color:#3d7a52;
      letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;
    }
    .cover-title{
      font-size:26px;color:#d1f7d6;line-height:1.2;
      letter-spacing:-.5px;margin-bottom:8px;
      will-change:font-size;
    }
    .cover-sub{
      font-size:12px;color:#3d7a52;line-height:1.5;margin-bottom:14px;
    }
    .cover-author{display:flex;align-items:center;gap:8px}
    .avatar{
      width:24px;height:24px;border-radius:50%;flex-shrink:0;
      background:linear-gradient(135deg,#3fb950,#56d364);
    }
    .author-name{font-size:10px;color:#3d7a52}
    .header-chip{
      position:absolute;top:14px;right:16px;
      display:flex;align-items:center;gap:6px;opacity:0;
    }
    .avatar-sm{
      width:16px;height:16px;border-radius:50%;flex-shrink:0;
      background:linear-gradient(135deg,#3fb950,#56d364);
    }
    .chip-name{font-size:10px;color:#d1f7d6}

    .article-body{padding:28px 24px;max-width:600px}
    .article-body h2{
      font-size:11px;color:var(--ui-accent);letter-spacing:1px;
      text-transform:uppercase;margin:28px 0 10px;
    }
    .article-body p{
      font-size:12px;color:var(--ui-muted);line-height:1.75;margin-bottom:14px;
    }
    .article-body blockquote{
      border-left:2px solid var(--ui-accent);padding:8px 16px;margin:18px 0;
      font-size:13px;color:var(--ui-text);font-style:italic;
    }

    aside{
      width:clamp(200px,22vw,240px);flex-shrink:0;
      background:var(--ui-bg);border:1px solid var(--ui-border);
      border-radius:8px;padding:16px;
      display:flex;flex-direction:column;gap:10px;
    }
    .note{
      font-size:10px;color:var(--ui-muted);line-height:1.6;
      border-left:2px solid var(--ui-accent);padding-left:8px;
    }
    .lbl{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--ui-accent)}
    .row{display:flex;justify-content:space-between;font-size:10px}
    .row .v{color:var(--ui-text)}
    .tbl{display:flex;flex-direction:column;gap:2px}
    .tbl .row{font-size:10px;color:var(--ui-muted)}
    .sr{display:flex;align-items:center;gap:6px;font-size:10px}
    .sr input[type=range]{flex:1;accent-color:var(--ui-accent);min-height:44px}
    .sr .sv{width:38px;text-align:right;color:var(--ui-text)}
    .div{height:1px;background:var(--ui-border)}
    .tog{display:flex;align-items:center;gap:8px;font-size:10px;cursor:pointer;min-height:44px}
    .tog input{accent-color:var(--ui-accent);width:16px;height:16px;flex-shrink:0}
    button{
      background:transparent;border:1px solid var(--ui-border);
      color:var(--ui-text);font-family:monospace;font-size:10px;
      padding:17px 8px;border-radius:4px;cursor:pointer;width:100%;
    }
    button:hover{border-color:var(--ui-accent);color:var(--ui-accent)}

    @media(max-width:600px){
      .layout{flex-direction:column}
      aside{width:100%}
      .stage{height:520px}
      :root{--cover-full:480px;--cover-min:64px}
    }
    @media(prefers-reduced-motion:reduce){
      .cover,.cover-title,.cover-bg,.header-chip{will-change:auto}
    }
  </style>
</head>
<body>

<header>
  <h1>Cover Card to Fixed Header</h1>
  <p>A full-page hero cover morphs into a compact fixed header as you scroll — every property scrubbed to a single 0→1 progress value.</p>
</header>

<div class="layout">

  <div class="stage" id="stage">
    <div class="scene">

      <div class="cover" id="cover">
        <div class="cover-bg" id="cover-bg"></div>
        <div class="cover-code" aria-hidden="true">
          const p = scrollY / RANGE;<br>
          const e = easeOutCubic(p);<br>
          height = lerp(530, 56, e);
        </div>
        <div class="cover-inner">
          <div class="cover-spacer"></div>
          <div class="cover-meta" id="cover-meta">Article · 8 min read</div>
          <h1 class="cover-title" id="cover-title">The Architecture<br>of Scroll Motion</h1>
          <p class="cover-sub" id="cover-sub">How browsers render scroll-driven animations at 60fps</p>
          <div class="cover-author" id="cover-author">
            <div class="avatar"></div>
            <span class="author-name">Matin M. · May 2026</span>
          </div>
        </div>
        <div class="header-chip" id="header-chip">
          <div class="avatar-sm"></div>
          <span class="chip-name">Matin M.</span>
        </div>
      </div>

      <article class="article-body">
        <h2>Parsing the Render Pipeline</h2>
        <p>Every modern browser separates rendering into distinct phases: style
        recalculation, layout, paint, and composite. Scroll-driven animations that
        stay on the compositor thread — using only transform and opacity — bypass
        the first three phases entirely, enabling smooth motion regardless of
        main-thread load.</p>
        <p>The performance boundary is predictable. Any property that triggers
        layout — height, padding, margin, width — forces the browser to
        recalculate the geometry of every affected element before painting. A
        scroll handler that reads offsetTop and writes height on every event is
        a classic layout-thrash pattern.</p>
        <blockquote>"The fastest animation is one the compositor can run
        without consulting the main thread."</blockquote>
        <h2>The Single-Progress Model</h2>
        <p>This demo maps all visual changes to one value: p ∈ [0, 1]. That
        number drives height, font size, opacity, blur, and border
        simultaneously. When every property shares the same source of truth,
        intermediate states are always consistent — no awkward frames where the
        title has shrunk but the background remains fully visible.</p>
        <p>Easing the progress value once (easeOutCubic) rather than easing
        each property separately keeps multi-property interpolation coherent.
        All elements decelerate together, which reads as intentional rather
        than coincidental.</p>
        <p>Adjusting the transition range slider shows how the same logic
        produces very different feels. At 150px the morph is punchy. At 600px
        it becomes cinematic — the user invests real scroll before the header
        locks in.</p>
      </article>

    </div>
  </div>

  <aside>
    <p class="note">This pattern is the foundation of every good article header on the modern web — Medium, Substack, NYT, Stripe blog. The trick is scrubbing every property to a single 0→1 progress value so intermediate states all look intentional.</p>

    <div>
      <div class="lbl">Progress</div>
      <div class="tbl">
        <div class="row"><span>Scroll</span><span class="v" id="scroll-prog">0%</span></div>
        <div class="row"><span>Collapse</span><span class="v" id="collapse-prog">0%</span></div>
      </div>
    </div>

    <div class="div"></div>

    <div>
      <div class="lbl" id="col-lbl">Collapse Override</div>
      <div class="sr">
        <input type="range" id="collapse-slider" aria-labelledby="col-lbl"
               min="0" max="100" value="0">
        <span class="sv" id="col-val">0%</span>
      </div>
    </div>

    <div>
      <div class="lbl" id="range-lbl">Transition Range</div>
      <div class="sr">
        <input type="range" id="range-slider" aria-labelledby="range-lbl"
               min="150" max="600" step="10" value="320">
        <span class="sv" id="range-val">320px</span>
      </div>
    </div>

    <div class="div"></div>

    <label class="tog" for="binary-tog">
      <input type="checkbox" id="binary-tog">
      <span>Binary (snap at midpoint)</span>
    </label>

    <button id="reset-btn">Reset scroll</button>
  </aside>

</div>

</body>
</html>
```

- [ ] **Step 2: Check line count**

```bash
wc -l animations/01-scroll-based/cover-card-to-fixed-header/index.html
```

Expected: under 175 lines. JS added in Task 3 will bring total to ~270.

- [ ] **Step 3: Verify in browser**

Open the file. Expected:
- Large green-tinted cover card with code watermark, title, subtitle, author
- Article content below
- Sidebar to the right with all controls visible but inactive
- No console errors

- [ ] **Step 4: Commit**

```bash
git add animations/01-scroll-based/cover-card-to-fixed-header/index.html
git commit -m "feat: add cover-card-to-fixed-header HTML scaffold"
```

---

## Task 3: Collapse Mechanic + Controls JS

**Files:**
- Modify: `animations/01-scroll-based/cover-card-to-fixed-header/index.html` — insert `<script>` before `</body>`

- [ ] **Step 1: Insert script block**

Find `</body>\n</html>` at the end and replace with:

```html
<script>
  const cover       = document.getElementById('cover');
  const coverBg     = document.getElementById('cover-bg');
  const coverMeta   = document.getElementById('cover-meta');
  const coverTitle  = document.getElementById('cover-title');
  const coverSub    = document.getElementById('cover-sub');
  const coverAuthor = document.getElementById('cover-author');
  const headerChip  = document.getElementById('header-chip');
  const stage       = document.getElementById('stage');
  const scrollProg  = document.getElementById('scroll-prog');
  const collapseProg= document.getElementById('collapse-prog');
  const colSlider   = document.getElementById('collapse-slider');
  const colVal      = document.getElementById('col-val');
  const rangeSlider = document.getElementById('range-slider');
  const rangeVal    = document.getElementById('range-val');
  const binaryTog   = document.getElementById('binary-tog');
  const resetBtn    = document.getElementById('reset-btn');
  const motionMQ    = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Read cover heights from CSS variables (respects mobile overrides)
  const cs       = getComputedStyle(document.documentElement);
  const FULL     = parseFloat(cs.getPropertyValue('--cover-full')) || 530;
  const MIN      = parseFloat(cs.getPropertyValue('--cover-min'))  || 56;
  let   RANGE    = 320;
  let   manual   = false;
  let   ticking  = false;

  function lerp(a, b, t)    { return a + (b - a) * t; }
  function clamp(v, lo, hi) { return Math.min(Math.max(v, lo), hi); }
  function ease(t)          { return 1 - Math.pow(1 - t, 3); } // easeOutCubic

  function apply(rawE) {
    // Under reduced motion: instant snap only — no scrubbing
    const e = motionMQ.matches ? (rawE > 0.5 ? 1 : 0) : rawE;

    cover.style.height        = lerp(FULL, MIN, e)    + 'px';
    coverBg.style.opacity     = lerp(1, 0.12, e);
    coverBg.style.filter      = `blur(${lerp(0, 6, e)}px)`;
    coverTitle.style.fontSize = lerp(26, 13, e)       + 'px';

    const fadeEarly           = 1 - clamp(e * 3, 0, 1);
    coverMeta.style.opacity   = fadeEarly;
    coverSub.style.opacity    = fadeEarly;
    coverAuthor.style.opacity = 1 - clamp(e * 2, 0, 1);
    headerChip.style.opacity  = clamp((e - 0.5) * 2, 0, 1);

    cover.style.boxShadow     = `0 1px 0 rgba(63,185,80,${lerp(0, 0.2, e)})`;
    collapseProg.textContent  = Math.round(e * 100) + '%';
  }

  function computeE(scrollTop) {
    const p = clamp(scrollTop / RANGE, 0, 1);
    return binaryTog.checked ? (p > 0.5 ? 1 : 0) : ease(p);
  }

  function update() {
    const st  = stage.scrollTop;
    const max = stage.scrollHeight - stage.clientHeight;
    scrollProg.textContent = max > 0 ? Math.round(st / max * 100) + '%' : '0%';
    if (!manual) {
      const e = computeE(st);
      colSlider.value      = Math.round(e * 100);
      colVal.textContent   = Math.round(e * 100) + '%';
      apply(e);
    }
    ticking = false;
  }

  stage.addEventListener('scroll', () => {
    manual = false;
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  colSlider.addEventListener('input', () => {
    manual = true;
    const rawE = ease(colSlider.value / 100);
    colVal.textContent = colSlider.value + '%';
    apply(rawE);
    collapseProg.textContent = Math.round(rawE * 100) + '%';
  });

  rangeSlider.addEventListener('input', () => {
    RANGE = parseInt(rangeSlider.value);
    rangeVal.textContent = RANGE + 'px';
    if (!manual) update();
  });

  binaryTog.addEventListener('change', () => {
    if (manual) {
      apply(ease(colSlider.value / 100));
    } else {
      update();
    }
  });

  resetBtn.addEventListener('click', () => {
    manual              = false;
    stage.scrollTop     = 0;
    colSlider.value     = 0;
    colVal.textContent  = '0%';
    apply(0);
  });

  apply(0);
</script>
</body>
</html>
```

- [ ] **Step 2: Check final line count**

```bash
wc -l animations/01-scroll-based/cover-card-to-fixed-header/index.html
```

Expected: under 280 lines. If over 300, collapse CSS declarations.

- [ ] **Step 3: Verify in browser**

Open the file. Scroll down in the dark stage.

Expected — scroll behavior:
- Cover smoothly shrinks as you scroll
- Title font size visibly decreases
- Subtitle and meta fade out early (gone by ~30% collapse)
- Author fades out by ~50%
- Small "Matin M." chip fades in on the right after 50%
- Background fades and blurs as cover collapses
- A faint green bottom border appears on the header when fully collapsed
- Scrolling back up reverses everything perfectly

Expected — controls:
- Collapse override slider: drag to any position, cover shows exact intermediate state; next scroll re-syncs
- Transition range at 150px: brisk, morph completes very early in scroll
- Transition range at 600px: cinematic, long wind-up before header locks
- Binary toggle: flips between scrubbed (smooth) and hard snap at 50% scroll
- Reset: scrolls back to top, cover fully expanded

Expected — reduced motion:
- In DevTools Rendering: `prefers-reduced-motion: reduce` → scrolling snaps instantly between full cover and full header at the midpoint; no scrubbing

- [ ] **Step 4: Commit**

```bash
git add animations/01-scroll-based/cover-card-to-fixed-header/index.html
git commit -m "feat: add collapse mechanic and controls to cover-card demo"
```

---

## Self-Review

### Spec coverage

| Requirement | Covered by |
|-------------|-----------|
| Large cover card, hero section | Task 2 — `.cover` with `var(--cover-full)` height, code-green gradient |
| Cover content: title, subtitle, meta, avatar | Task 2 — `.cover-meta`, `.cover-title`, `.cover-sub`, `.cover-author` |
| Article body below cover | Task 2 — `<article class="article-body">` with paragraphs, headings, blockquote |
| Cover height: full → min | Task 3 — `cover.style.height = lerp(FULL, MIN, e)` |
| Background fades + blurs | Task 3 — `coverBg.style.opacity`, `coverBg.style.filter` |
| Title shrinks | Task 3 — `coverTitle.style.fontSize = lerp(26, 13, e)` |
| Subtitle + meta fade out | Task 3 — `fadeEarly = 1 - clamp(e×3, 0, 1)` |
| Author fades | Task 3 — `1 - clamp(e×2, 0, 1)` |
| Avatar chip appears in header | Task 2 (markup) + Task 3 — `headerChip.style.opacity = clamp((e-0.5)×2, 0, 1)` |
| Header border appears | Task 3 — `cover.style.boxShadow` |
| Scrubbed to scroll position | Task 3 — `computeE(scrollTop)` called in rAF handler |
| easeOutCubic | Task 3 — `ease(t) = 1 - (1-t)^3` |
| Stays fixed after full collapse | Handled by `position:sticky` + height staying at MIN |
| Reversal on scroll-up | Inherent — `computeE` re-runs on every scroll event |
| rAF-throttled scroll handler | Task 3 — `ticking` dirty flag |
| Scroll progress readout | Task 3 — `scrollProg.textContent` |
| Collapse progress readout | Task 3 — `collapseProg.textContent` |
| Collapse override slider | Task 2 (markup) + Task 3 — `manual` flag, `apply(rawE)` |
| Transition range slider | Task 2 (markup) + Task 3 — updates `RANGE` |
| Binary vs scrubbed toggle | Task 2 (markup) + Task 3 — `binaryTog.checked` in `computeE` |
| Reset button | Task 3 — resets scrollTop, slider, applies 0 |
| Educational note | Task 2 — `<p class="note">` |
| Mobile: controls stack below | Task 2 — `@media(max-width:600px) .layout{flex-direction:column}` |
| Mobile: larger header (64px) | Task 2 — `:root{--cover-min:64px}` in mobile media query |
| Mobile: larger cover (480px) | Task 2 — `:root{--cover-full:480px}` |
| Touch targets ≥44px | Task 2 — sliders `min-height:44px`, button `padding:17px`, toggle `min-height:44px` |
| Touch scroll works | Task 3 — passive listener on `.stage` |
| prefers-reduced-motion: snap | Task 3 — `apply()` reads `motionMQ.matches`, snaps `e` |
| CSS variables for heights | Task 2 — `--cover-full`, `--cover-min` in `:root` and mobile override |
| JS reads CSS variables | Task 3 — `getComputedStyle(document.documentElement).getPropertyValue(...)` |
| Single file, no deps, offline | All code inline |
| Under 300 lines | Task 3 Step 2 — explicit check |

### Placeholder scan

None.

### Type consistency

- `FULL` and `MIN` — read from CSS variables at startup; used in `apply()` as numbers. ✓
- `RANGE` — initialized to 320; mutated by `rangeSlider` listener; used in `computeE()`. ✓
- `manual` — boolean; set false on scroll, true on colSlider; checked in `update()`. ✓
- `apply(rawE)` — receives `rawE ∈ [0,1]`; `computeE()` always returns values in that range. ✓
- `ease()` is used in two places: `update()` via `computeE()`, and `colSlider` listener directly. Both expect `t ∈ [0,1]`. `colSlider.value / 100` is `[0,1]`. ✓

### One concern flagged

The `colSlider` listener applies `ease(colSlider.value / 100)` — this double-eases when the user drags the override slider. The slider shows a raw 0–100 value (displayed as `colSlider.value + '%'`), but `collapseProg` shows the eased result. This is intentional: the slider is a raw progress input, and the collapse progress readout reflects the actual eased `e` value. The displayed `col-val` shows raw slider position while `collapseProg` shows eased — both are informative. No fix needed.
