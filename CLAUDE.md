# Animation Atlas — Claude Code Instructions

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

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

1. Scroll-Based — scroll-driven techniques
2. Transitions — element/page enter, exit, route change
3. Micro-Interactions — hover, click, focus, loading, UI feedback
4. Text & Typography — text-specific animations
5. 3D & Advanced — WebGL, shaders, particles, 3D transforms
6. Ambient & Background — passive looping effects

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