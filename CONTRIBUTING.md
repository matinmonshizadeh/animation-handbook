# Contributing to Animation Handbook

Thanks for wanting to add to the handbook. The goal is a browsable, *teach-by-showing*
reference where every entry is a live demo. Contributions that add a new technique,
fix a bug, or improve an explanation are all welcome.

## Ground rules

- **One technique = one folder** under `animations/<category>/<slug>/`.
- **Each folder contains exactly** `index.html` and `README.md` (optionally a `preview.gif`/`preview.png`).
- **No build step, no frameworks, no dependencies.** Plain HTML + CSS + vanilla JS, all in one file.
- **No CDN / external requests.** If a technique needs a library in production (GSAP, Three.js),
  mention it in the README's *Production notes* — but demonstrate the principle with vanilla code.
- **Keep demos under ~300 lines.** If it's longer, the explanation has failed.
- **Must work offline.** Open the HTML in a browser and it runs.
- **This catalogs techniques, not tools.** GSAP, Framer Motion, and Lottie are tools that
  *implement* techniques. They belong in *Production notes*, never as their own entry.

## Categories (do not add new top-level categories without opening an issue first)

| Folder | Category |
|--------|----------|
| `01-scroll-based` | Scroll-driven techniques |
| `02-entrance-and-exit` | Element enter / exit / reveal |
| `03-page-transitions` | Full-page / route transitions |
| `04-micro-interactions` | Hover, click, focus, loading, UI feedback |
| `05-text-typography` | Text-specific animation |
| `06-3d-advanced` | WebGL, shaders, particles, 3D transforms |
| `07-ambient-background` | Passive looping effects |

## Adding a new technique

1. **Open an issue** using the *New technique* template so we can agree on the category and slug.
2. Create `animations/<category>/<slug>/index.html` — a self-contained demo with:
   - a `<header>` with the technique name (`<h1>`) and a one-sentence description (`<p>`);
   - a controls panel to adjust key parameters live, when relevant;
   - CSS variables for colors, dark stage / light cards by default.
3. Create `README.md` with **exactly** these six sections:
   1. **What it is** — 2–3 sentence definition
   2. **When to use it** — bullets of real use cases
   3. **How it works** — the mechanic, with a code snippet
   4. **Key parameters** — the values that matter
   5. **Production notes** — gotchas, library equivalents
   6. **See also** — links to related entries
4. Register the entry in the root `index.html` `CATS` array (slug, name, one-line description).
5. Add it to the category's `README.md` list.

## Responsiveness (mandatory)

Every demo must work on mobile, tablet, and desktop.

- Layouts use Grid/Flexbox with `%`, `fr`, `minmax()`, or `clamp()` — no fixed pixel widths.
- Side panels stack **below** the stage under 600px.
- Touch targets are at least **44×44px**; gate hover effects behind `@media (hover: hover)`.
- Drag interactions use Pointer Events, not mouse events.
- Animate `transform` and `opacity` only — never `width`, `height`, `top`, `left`, or `box-shadow`.
- Respect `@media (prefers-reduced-motion: reduce)`.

### Self-check before opening a PR

- [ ] Layout reflows cleanly at 375px width.
- [ ] All touch targets ≥ 44px.
- [ ] Works with touch scroll / drag, not just mouse.
- [ ] Text stays readable at every size.
- [ ] Side panel stacked below the stage on mobile.
- [ ] Respects `prefers-reduced-motion`.
- [ ] Runs offline with no external requests.

## Writing style

Prose, not bullet-soup. Show, then explain. Avoid hype ("stunning", "powerful") — describe
what it does. Comment code only where it isn't self-explanatory.

## Fixing a bug

Open an issue (or a PR directly for small fixes). Preserve every demo's behavior — visual
parity matters more than code elegance. Never combine multiple animations into one file.
