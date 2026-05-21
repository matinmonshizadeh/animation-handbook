# Animation Atlas — Claude Code Instructions

## Project purpose
A visual reference of web animation techniques. Each animation has its own
folder with a self-contained HTML demo and a short README explaining the
mechanics. Goal: help people understand what each animation type is by
*seeing* it work and reading why it works.

## Hard rules
- **One animation = one folder** under `animations/<category>/<slug>/`.
- **Each folder contains exactly:** `index.html`, `README.md`, optionally
  `preview.gif` or `preview.png`.
- **No build step. No frameworks. No npm packages.** Plain HTML + CSS +
  vanilla JS only. The whole demo lives in one HTML file.
- **No external dependencies in demos.** No CDN GSAP, no jQuery. If a
  technique requires a library in production, mention that in the README
  but demonstrate the principle with vanilla code.
- **Keep demos under ~300 lines total.** If it's longer, the explanation
  has failed.
- **Demos must work offline.** Open the HTML in a browser, it runs.

## File template for each animation

### `index.html` structure
- Single file, all CSS in `<style>`, all JS in `<script>`.
- Include a `<header>` with the animation name and a 1-sentence description.
- Include a controls panel where the user can adjust key parameters live
  (delay, threshold, direction, etc.) when relevant.
- Use CSS variables for colors. Default to a dark stage with light cards.
- Mobile responsive by default — collapse side panels to stacked layout
  under 600px.

### `README.md` structure
Every animation README has exactly these sections:

1. **What it is** — 2-3 sentence definition
2. **When to use it** — bullets of real use cases
3. **How it works** — the mechanic, with code snippet
4. **Key parameters** — the values that matter (delay, threshold, etc.)
5. **Production notes** — gotchas, library equivalents (GSAP, Framer Motion)
6. **See also** — links to related animations in the atlas

## Taxonomy (do not invent new top-level categories without asking)

1. Scroll-Based — scroll-driven techniques (folder: 01-scroll-based)
2. Entrance & Exit — element enter, exit, reveal animations (folder: 02-entrance-and-exit)
3. Micro-Interactions — hover, click, focus, loading, UI feedback (folder: 03-micro-interactions)
4. Text & Typography — text-specific animations (folder: 04-text-typography)
5. 3D & Advanced — WebGL, shaders, particles, 3D transforms (folder: 05-3d-advanced)
6. Ambient & Background — passive looping effects (folder: 06-ambient-background)

## Distinction: technique vs tool
This atlas catalogs **techniques**, not libraries. GSAP, Framer Motion,
Lottie, Three.js are tools that *implement* techniques. They get mentioned
inside an entry's "Production notes" section, never as their own entry.

## Writing style
- Prose explanations, not bullet-soup.
- Show, then explain. The demo is the main artifact; words support it.
- Avoid hype. No "stunning", "amazing", "powerful". Describe what it does.
- Code comments only when the code isn't self-explanatory.

## When asked to add a new animation
1. Confirm the category and slug name.
2. Create the folder under `animations/<category>/<slug>/`.
3. Create `index.html` following the template above.
4. Create `README.md` with all 6 required sections.
5. Update the root `index.html` index page to link to it.
6. Update `animations/<category>/README.md` to list it.

## When asked to refactor
- Preserve every demo's behavior exactly. Visual parity matters more than
  code elegance.
- Never combine multiple animations into one file.

## Out of scope
- Backend code, databases, APIs.
- Anything requiring a server beyond a static file server.
- React/Vue/Svelte components — this is framework-agnostic by design.

## Responsiveness requirements (mandatory)

Every demo must be fully responsive across mobile, tablet, and desktop.
This is non-negotiable — a demo that breaks on phones fails the quality bar.

### Breakpoints
- **Mobile:** ≤ 600px viewport width
- **Tablet:** 601px – 1024px
- **Desktop:** ≥ 1025px

### Layout rules
- Use CSS Grid or Flexbox for all layouts. No fixed pixel widths on
  containers — always use `%`, `fr`, `minmax()`, or `clamp()`.
- Side panels (controls, info, legends) **stack below the main stage**
  on mobile, never beside it.
- The animation stage itself must scale fluidly. Use `aspect-ratio`,
  `min-height`, or viewport units (`vh`, `dvh`) rather than fixed heights.
- Typography must scale: use `clamp()` for headings
  (e.g. `font-size: clamp(18px, 4vw, 28px)`).
- Padding and gaps should shrink on mobile — use `clamp()` or media
  queries to prevent cramped layouts.

### Touch and input rules
- All interactive controls (sliders, buttons, toggles) must be at least
  **44×44px** on mobile (Apple/WCAG touch target minimum).
- Replace hover-only interactions with tap-equivalent behavior on touch
  devices. Use `@media (hover: hover)` to gate hover effects.
- Scroll-driven demos must work with touch scroll, not just mouse wheel.
- Drag interactions must use Pointer Events (`pointerdown` / `pointermove`
  / `pointerup`), not mouse events, so they work on touch.

### Performance on mobile
- Demos must run at 60fps on a mid-range mobile device. If an effect is
  too heavy (heavy blur, many particles, complex shaders), provide a
  reduced-quality fallback on mobile.
- Use `transform` and `opacity` for animations — never animate `width`,
  `height`, `top`, `left`, or `box-shadow` directly.
- Respect `@media (prefers-reduced-motion: reduce)` — disable or simplify
  animations for users who request it.

### Testing checklist (Claude Code should self-verify before declaring done)
Before finishing any animation, mentally walk through:
- [ ] Does the layout reflow cleanly at 375px width (iPhone SE)?
- [ ] Are all touch targets ≥ 44px?
- [ ] Does it work with touch scroll / drag, not just mouse?
- [ ] Does text remain readable (no overlap, no overflow) at every size?
- [ ] Is the side panel stacked below the stage on mobile?
- [ ] Does it respect prefers-reduced-motion?

If any answer is no, the demo is not complete.