# Demo Page Redesign — Design Spec

**Date:** 2026-09-25
**Scope:** all 129 demo pages, shared site assets, site-wide fonts, the home page intro line, CLAUDE.md
**Approved design sample:** `samples/demo-page-design.html` (Bounce In)

---

## Overview

The handbook exists so people can *see* each type of web animation and *understand* it. The takeaway is a
ready-to-copy AI prompt, not implementation code.

Today a demo page shows a one-line summary, a demo that sometimes opens empty, a controls panel with a
technical note, and "Copy source" / "Source ↗" buttons for the page's code. The explanations (about 81,000
words across the READMEs) only exist on GitHub.

After this redesign every demo page opens on a large, playing demo with a small column beside it: the title,
compact settings, a short preview of the prompt with a **Copy prompt** button, and **Read more**. Read more
reveals the plain-language explanation, the full prompt and related animations. No code appears anywhere on
the site.

---

## Decisions made with the user

| Topic | Decision |
|---|---|
| Where explanations come from | Loaded live from each demo's `README.md` by a shared script. No build step, no duplicated text. |
| Page layout | The demo is the biggest thing on the first screen; settings, prompt preview and Read more sit beside it. |
| Code on the site | None. "Copy source" and "Source ↗" are removed. README code sections are never rendered. |
| Prompt and settings | The copied prompt ends with the demo's current settings, generated from its controls. |
| Fonts | Schibsted Grotesk everywhere, replacing Bricolage Grotesque and IBM Plex Mono. |

One refinement is proposed here for approval: **the prompt text lives in each `index.html`**, not in the
README. The prompt is the page's main takeaway, so it should render without a network request, work when the
page is opened from disk, and be readable by crawlers that don't run JavaScript (the site's `robots.txt`
invites AI answer engines). The secondary explanation still loads live from the README.

---

## Page anatomy

### First screen — desktop (≥ 1025px)

- **Top bar** (48px, sticky): `← Animation Handbook` on the left; previous and next animation names on the
  right. No copy or source buttons.
- **Stage**: fills the viewport below the bar (`100dvh` minus the bar and page padding), about two thirds of
  the width. A **↻ Replay** button sits in its bottom-right corner when the demo supports replaying.
- **Side column** (`clamp(300px, 27vw, 370px)`, scrolls internally if needed), top to bottom:
  1. Category line, e.g. `02.02 · Entrance & Exit`, in the category's accent colour (written into each page;
     the numbers match the home page cards)
  2. Title (`<h1>`) and the one-line description
  3. **Settings** — the demo's own controls, restyled compactly
  4. **Prompt** box — three-line preview, the live settings line, **Copy prompt**
  5. **Read more about <name> ↓**

### After "Read more"

A details section opens below the first screen and the page scrolls to it (instantly under reduced motion).
The button becomes **Show less ↑**. Content, in a two-column grid on desktop and one column below 760px:

- Left: **What it is**, **When to use it**, **What the controls do**
- Right: **Full prompt** (with its own Copy prompt button), **Related animations** (cards)
- A **↑ Back to the demo** link at the top

Opening the page with `#details` in the URL opens the section directly.

### Tablet (601–1024px) and phone (≤ 600px)

- Tablet keeps the side-by-side layout with a 300px column.
- Phone stacks: stage first (56% of the small viewport height, at least 320px), then the side column, then the
  details when opened. The top bar shows `‹` and `›` only. All controls are at least 44×44px.

---

## Where each piece of content comes from

| On the page | Source |
|---|---|
| Title | The existing `<h1>` in `index.html` (moved into the side column) |
| One-line description | Rewritten in plain words during migration (the old one often names CSS properties) |
| Settings | The demo's existing controls in `index.html` (moved into the side column) |
| Prompt text | New, written into `index.html` inside `<div class="hb-prompt">` |
| Settings line | Generated live from the controls by the shared script |
| What it is | README `## What it is` |
| When to use it | README `## When to use it` |
| What the controls do | README `## Key parameters` table (Parameter, Default, Effect) |
| Related animations | README `## See also` links and their descriptions |
| Not shown on the site | README `## How it works` and `## Production notes` (they stay for GitHub readers) |

Inline code in the rendered README sections is shown as plain text, never as code.

---

## README changes

The six-section structure stays. Two sections get a plain-language pass because they now appear on the site:

- **What it is**: describe the motion in everyday words. Technical detail moves to "How it works". Example —
  Bounce In's second sentence ("a series of hand-placed `@keyframes` waypoints... one `cubic-bezier` can only
  overshoot once") becomes "A real bounce isn't one smooth curve: it's a few hand-placed steps, each going a
  little past the target and coming back."
- **Key parameters**: the Parameter column uses the same names as the controls on the page, without code
  (e.g. `Duration (--dur)` becomes `Duration`), and Effect is written in plain words.

---

## Prompts

### Location and markup

```html
<section class="hb-prompt-box" aria-labelledby="hb-prompt-title">
  <h2 class="hb-label" id="hb-prompt-title">Prompt</h2>
  <p class="hb-prompt">Add a bounce-in entrance to [the element you want to animate]. …</p>
</section>
```

There is one copy of the text per page. The shared script clamps the preview to three lines, shows the full
text in the details section, and adds the settings line, Copy prompt and Read more. Without JavaScript the full
prompt is simply visible.

### Writing guide (applies to all 129)

- Start with what to build and where: "Add a … animation to [the element you want to animate]". Use square
  brackets for anything the reader must fill in.
- Describe what the viewer sees: what moves, where it starts and ends, how it feels (snappy, springy, slow),
  and what triggers it (page load, scroll, hover, tap, drag).
- Include the one or two rules that make it look right, taken from the README (e.g. "keep it to one bounce").
- Say how to keep it smooth in plain words (e.g. "animate only position, scale and opacity").
- Say what to do when the visitor has reduced motion turned on.
- For hover or drag effects, include the touch-screen equivalent.
- Stay tool- and framework-neutral. No code, no library names unless the technique needs one.
- Don't state values that a control sets (duration, distance, number of bounces); the settings line supplies them.
  End with "Match the settings listed below."
- 60–130 words.

### Settings line

Shown live under the preview as `Your settings: …` and appended to the copied text as
`Settings from the demo: Overshoot intensity 60%, Duration 1100ms, Bounces 1× Single, Combine with fade on.`

Built from the controls in the side column:

- Slider rows (`.sr`): the row's label plus its value readout (`.sv`)
- Segmented groups (`.seg`): the group's label plus the active button's text
- Toggles (`.tog`) and checkboxes: the label plus `on` / `off`
- `<select>`: the label plus the selected option's text
- Ignored: state readouts (`.kv`), action buttons, anything marked `data-hb-skip`
- A control can override its label with `data-hb-label="overshoot"`

---

## Behaviour

- **Plays on arrival:** demos whose stage is empty until a button is pressed play once about 400ms after load.
  In Entrance & Exit that is 12 of the 13 demos (every one whose status starts as "hidden"; Curtain Reveal
  already plays itself). Outside the pilot, `enter-exit-typography` is confirmed and `counter-animation`,
  `reveal-on-scroll`, `sticky-section` and `glitch-text` are checked during their category's rollout. Under
  reduced motion they show their end state instead.
- **Replay:** the demo marks its existing play or replay control with `data-hb-replay`; the shared script then
  shows the stage's ↻ Replay button and clicks that control. Continuous and interaction-driven demos (ambient
  loops, hover, scroll) show no Replay button.
- **Settings replay the demo:** where a demo only shows a change after pressing play, changing a setting
  replays it (about 250ms after the last change), so the effect is visible immediately.
- **Copy prompt:** copies the prompt plus the settings line; the button shows "Copied ✓" for 1.5s. If the
  clipboard is unavailable, it selects the prompt text and shows the copy shortcut (Ctrl+C, or ⌘C on a Mac).
- **Opened from disk (`file://`):** the demo, settings and prompt work. The README cannot be fetched there, so
  Read more shows a link to `README.md` instead of the rendered sections.

---

## Shared assets (new)

The animation code stays inside each `index.html`. What is shared is the site chrome around it:

- `assets/css/handbook.css` — fonts, colour tokens, top bar, page grid, side column, compact styles for the
  existing control classes (`.lbl`, `.sr`, `.sv`, `.seg`, `.tog`, `.kv`, `.div`, `.btn-row`, `.act`), prompt
  box, details section, responsive rules, reduced-motion rules.
- `assets/js/handbook.js` — README fetch and a small Markdown renderer for the subset the READMEs use
  (paragraphs, bullet lists, tables, links, bold, inline code as plain text), the settings line, Copy prompt,
  Read more, Replay, auto-play hook, related cards.

Each demo page:

- adds `<link rel="stylesheet" href="../../../assets/css/handbook.css">` and
  `<script src="../../../assets/js/handbook.js" defer></script>`
- replaces its inline `ah-bar` block (styles, markup and copy script) with the new top bar markup
- moves its `<header>` into the side column and wraps the page in the new layout
- drops the panel's explanatory `.note` (the README covers it) and hides readouts that show code (6 demos show
  live code); hidden readouts stay in the page because the demo scripts write to them
- keeps its controls, state readouts and meaningful action buttons (e.g. Play out) inside **Settings**
- sets its stage to fill the new stage area (117 demos already size it through `--stage-h`)

---

## Fonts

- **Schibsted Grotesk** (SIL Open Font License), self-hosted as a variable WOFF2 (weights 400–900, Latin and
  Latin Extended) in `assets/fonts/`. Downloaded from Google Fonts after the user approves the download.
- Used for the whole home page (wordmark, headings, body, labels, chips, search) and the demo chrome. Stage
  content that currently inherits Bricolage or Plex Mono inherits Schibsted Grotesk instead.
- Unchanged: fonts a demo deliberately sets for its own content, such as Georgia, Times New Roman, Segoe UI
  Variable or Recursive. Five demos use no Bricolage or Plex Mono at all (`scroll-image-sequence`,
  `glitch-text`, `text-on-path`, `wavy-text`, `morphing-blob`); their stage fonts stay as they are.
- `brico-*.woff2` and `plex-*.woff2` are deleted from `assets/fonts/` once nothing references them.
  `samples/fonts/` is left alone.

---

## Home page

- Switch to Schibsted Grotesk.
- Update the intro line to: "See 129 web animations move, learn when to use each one, and copy a prompt to
  build it."
- Nothing else changes on the home page in this project.

---

## Rollout

1. **Foundation:** download the font, build `handbook.css` and `handbook.js`, switch the home page font.
2. **Pilot — 02 Entrance & Exit (13 demos):** convert the pages, write the 13 prompts, do the README
   plain-language pass, add auto-play. The user reviews the pilot before anything else changes.
3. **Remaining categories, one at a time:** 04 Micro-Interactions, 01 Scroll-Based, 03 Page Transitions,
   05 Text & Typography, 06 3D & Advanced, 07 Ambient & Background. Each category is verified before the next
   starts.
4. **Wrap-up:** update CLAUDE.md (page template, shared assets rule, prompt guide, fonts) and CONTRIBUTING.md,
   delete the old font files, remove `samples/demo-page-design.html`.

---

## Verification

For every converted demo, in headless Chrome at 1280×800, 768×1024 and 375×812, and again with reduced motion:

- no console errors and no horizontal overflow
- the stage is the largest element on the first screen
- every control still changes the animation, and the animation looks and behaves as before
- the settings line matches the controls, and Copy prompt copies the prompt plus that line
- Read more shows the four sections, renders no code, and every related link resolves
- touch targets are at least 44px on the phone size

A site-wide check script confirms that every demo has a prompt, every README has the sections the page needs,
and every related link points to an existing demo.

---

## Out of scope

- Home page search, filters and the "start here" path
- Quick jump from any page, favourites, recently viewed
- A Next link that continues across categories
- Prompt sentences that rewrite themselves as the sliders move

---

## Risks

- **Bigger stages:** some demos were designed for a 620px stage and may look sparse or mis-scaled when larger.
  The pilot shows how common this is; the fix is per demo (scale the content or cap the stage).
- **129 hand edits:** consistency comes from the shared CSS for the common panel classes, the verification
  script, and converting one category at a time.
- **Canvas demos without resize handling:** the larger stage is set before they initialise; any that still
  size wrongly are fixed individually.
