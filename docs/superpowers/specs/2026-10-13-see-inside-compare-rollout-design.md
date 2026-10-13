# See inside and Compare on every page: design

2026-10-13. Roadmap step 2 (`2026-10-13-goal-and-roadmap.md`), narrowed by the owner after the pilot to ideas A (See inside)
and B (Compare). It builds on the pilot (`2026-10-13-learn-pilot-design.md`; the reference is Parallax Scrolling as built at
`eb66511`), its ledger, its three final reviews and the three page surveys in `.superpowers/sdd/2026-10-13-learn-pilot/`. The
work happens on `feat/see-inside-compare`; nothing goes live until the owner says so. How it shares the machine, the files and
the release path with the finder, Famous effects and the ten new animations: `2026-10-13-next-projects-coordination.md`
(where the two disagree, that file wins).

## Owner rulings

- **2026-10-13, pilot:** build on one page first and approve from the real pages; no code on the site; parallel agents, every
  part reviewed by another agent, no drop in quality.
- **2026-10-13, after the pilot:** See inside and Compare are approved as on Parallax Scrolling, and:
  1. All 166 animation pages get both, **page by page**: each page's two views are written in its own page code, checked and
     reviewed on their own. A plan built on shared "recipe" code was rejected. The shared switch, notes and page check stay.
  2. First one page from each of the seven categories, for the owner's approval; then all the rest.
  3. The learning path (C) and Motion basics (D) are **paused**: kept on `feat/learn-pilot`, not released now (section 5).
  4. The Animation finder, Famous effects and ten new animations are separate projects with their own specs (section 7).
- **2026-10-13, answers to this spec's four questions** (cited below as rulings 1 to 4):
  1. Pressing See inside or Compare plays the animation once by itself: plays-once pages press Replay, do-it pages press
     Show me; never under reduced motion; scroll pages and loops stay as they are (owner: yes).
  2. Where See inside scales a movement down (Parallax Scrolling's layers move about a fifth as far), a faint outline marks
     where each moving part started, so the gap shows how far it moved; the same on every page that shrinks a movement
     (owner: yes).
  3. Compare may show a common mistake, or a small made-up scene, beside the right way where that teaches more than
     "without the effect": about 35 pages, the surveys' mistake rows and the rows marked \* in section 2 (owner: yes). It
     overlaps the roadmap's later Judge it, which can build on these pages.
  4. On phones the box keeps its size in every mode, Compare included, and nothing under it moves (decided: the spec's
     suggestion, taken as the coordinator's default).
- **2026-10-13, order:** this rollout, then the ten new animations, then one pass adding the Finder and Famous effects tabs
  to every top bar. The finder and Famous effects are built beside this rollout and each goes live as soon as it is ready
  and the owner approves it (owner: yes).
- **Standing:** every setting and control visibly changes the stage; Pause freezes at once; after any jump a scroll page shows
  the state for its new position at once (CLAUDE.md). The roadmap's rule: it goes live as one finished piece.

The surveys' recipe names (PULL-APART, TIMELINE, CURVE and the rest) name a kind of picture. They are not shared code.

## 1 · What every page gets

**The switch and the notes,** exactly as on Parallax Scrolling and pinned by the tests: `div.seg.hb-modes` (Normal, See inside,
Compare) between the Watch step's heading and the stage; after the player bar, `div.hb-mode-notes` with two hidden notes,
`p[data-hb-for="inside"]` then `p[data-hb-for="compare"]`. Normal is the page as it is today. The mode is not a setting: it never
reaches Your settings, the copied prompt, the home page's Copy prompt or the skill.

**See inside** shows what Normal hides (the layers, pieces, hidden shape, route, timing, trigger line, speed curve, pulls or
hidden field) on the real demo, which keeps working in that mode: scroll, Play, Replay, Pause, Show me, hover, press, drag. Each
part is labeled with what it is and how it moves, in words and, where it helps, a short bar or arrow. It is drawn from the
page's own numbers (variables, constants, timers, measured boxes), so every setting changes it. A movement may be scaled down to
keep every part in view; then a faint outline marks where each moving part started, so the gap shows how far it moved
(ruling 2).

**Compare** shows the scene twice, at the same size and time, driven by the same input: first (left, or top when stacked) the
scene without the effect, second the page as the visitor set it. Each half is named at its top in one to three words ("Without
parallax" / "With parallax"). Every setting reaches both halves except the one thing the first lacks; when a setting makes them
match, the note says so and points to Try it (as Depth: Flat does). Where the difference needs movement, the halves never rest
on two identical pictures: they rest on a posed moment. Where it teaches more, the first half shows a common mistake or a small
made-up scene instead (ruling 3: the rows marked \* in section 2 and the surveys' mistake rows).

**After a press** of See inside or Compare (the pressed one too), the shared script presses Replay on a plays-once page or Show
me on a do-it page, once, so the view is seen working (ruling 1); never under reduced motion, never on scroll pages or loops,
and never on a press of Normal. The page's own listener presses nothing.

**The page's `hb:mode` listener:**
1. sits at the top level of the page's script (the inline script runs before the deferred shared one);
2. hears `hb:mode` on every press, the pressed mode too, never at boot, after the buttons, notes and stage mark have changed;
3. keeps Normal the default look: no rule on `[data-hb-mode="normal"]`, and every mode rule names the stage
   (`.stage[data-hb-mode="inside"]`), because the buttons carry `data-hb-mode` too;
4. draws the current state at once (scroll position, frame, open or closed, paused or playing), is safe to run twice, and never
   scrolls, moves focus, presses a control, stops Play or changes Pause;
5. uses copies made once, at load or on first entry: ids removed or renamed (gradients, masks, filters, `for`), `inert`,
   `aria-hidden="true"`, not rendered outside Compare;
6. if it rewrites a note (for a setting or for reduced motion), writes the markup's own words for the default state, so the two
   never disagree.

### Acceptance for each page

The page's reviewer (never its builder) confirms every line:

1. **Clear from the picture alone:** See inside and Compare each read clearly from the page check's mode screenshots at 1280px
   and at 375px, before the note is read; where See inside shrinks a movement, each moving part's start is outlined (ruling 2).
2. **Still under reduced motion:** every mode is a still picture that still teaches (See inside: the parts apart, a bar or arrow
   as long as each move; Compare: a posed still). No mode adds movement.
3. **Normal unchanged:** at rest, Normal matches the page before the change pixel for pixel (a few antialiased corner pixels
   aside; a page drawn from random numbers is compared by eye). Try it, the chips and the prompt are unchanged.
4. **A mode change** never scrolls the page or the box, moves focus, stops Play or changes Pause, and shows the current state at
   once; then, on a plays-once or do-it page and not under reduced motion, the demo plays once by itself (ruling 1).
5. **Notes:** one or two plain sentences (about 35 words at most) on what the visitor sees, never on how it is coded. The Compare
   note names the halves by their labels. When the stage looks like Normal until the visitor acts, the note ends with what to do
   ("Scroll the box or press Play to watch.").
6. **Labels and half names** carry `data-hb-caption`: at least 12px as drawn, 4.5:1 against their own backing, inside the stage,
   covering neither the part they name nor each other; at most six (four on phones); amounts as a beginner says them ("half a
   second", "moves most"), never ms, px, deg or CSS names.
7. **Settings:** every setting visibly changes See inside and Compare.
8. **Phones:** no overflow; the box keeps its size in every mode (ruling 4); whatever a mode adds that can be pressed is at
   least 44×44px (checked by hand: the page check skips the stage); hover and drag keep their touch equivalents in every mode.
9. **Keyboard and screen readers:** the demo works from the keyboard in every mode as in Normal (in Compare it drives both halves,
   or the second where the first is inert by design); copies are inert and hidden from screen readers; where the page names its
   picture (an `aria-label` on the stage, or on its canvas or picture), the name says what each mode shows; a control's name
   contains its visible words.
10. **Light enough:** only transform and opacity animate; frame loops move by elapsed time (CLAUDE.md); on phones each half gets
    half the budget (particles, dots, tiles), a blur is never doubled and WebGL keeps one context.
11. **Checks:** the tests pass; the page check gives six `ok` lines, mode checks included.
12. **Words and size:** no code on the page, American spelling, no hype; about 300 lines for the demo plus at most about 150 for
    its two views (49 pages are already past 300; Parallax went from 236 lines to 364).

## 2 · Building a page from its survey row

Every page has a row in one of the surveys (`rollout-survey-01-03.md`, `-04.md`, `-05-07.md`): its kind, a See inside and a
Compare idea, a difficulty and notes.

1. The lane lead writes the page's brief (about 15 lines) from the row, the page and its README's How it works: See inside's
   parts and words; Compare's halves and names; the reduced-motion still of each mode; how input reaches both halves; phones
   (side by side while each half keeps about 160px of scene, else stacked); the row's pitfalls; the closest first-batch page.
2. The builder reads the whole page and treats the row as a suggestion: a clearer picture wins, and the report says why.
3. It builds both views in the page's own CSS and script, tunes them from the page check's mode screenshots (See inside and
   Compare at 1280, 375 and 375 with reduced motion) until each reads clearly, and compares Normal before and after (section 4).

Pilot lessons: a flat diagonal fan read better than a 3D tilt at 375px; a label drawn on a layer shrunk with `scale` comes out
soft (draw it at its size, or drop `will-change` in that mode); keep every part inside the box at every setting and position.

### Hard cases

- **Canvas (33 pages) and WebGL (8).** See inside is drawn in the page's own frame step, its labels as page text over the canvas.
  Compare splits one canvas (each half clipped) when the halves differ only in drawing, and draws one WebGL context in two
  viewports with a flag; never a second WebGL context. The no-WebGL and lost-context messages cover every mode; phone pixel caps
  stay.
- **Second worlds,** only where the halves differ in state (Cloth / Soft-Body Simulation, 2D Physics, Flocking, Fireworks, GPGPU
  Particle System, Liquid Glass, Abstract Geometric Motion, Elastic Transition's live spring): both take the same fixed steps
  from one accumulator; Show me, Reset and clicks reach both; stills come from a fixed seed run a fixed number of steps.
- **Do-it pages (62).** Hover (a dozen pages): the first half is inert and shows a ghost pointer where the real one is; the arrow
  keys move a pretend pointer in both. Press: Show me presses both, and a real press on either half drives both (or the first
  half is inert by design). Drag: the visitor drags the second half; Show me drags both. Forms: the copy never takes focus,
  mirrors typed text and repeats no announcement (Focus Ring Animation: both forms take Tab, since focus is the lesson). A drawer
  or modal copy is never a dialog.
- **Reduced motion erases the difference (about 55 pages):** all 16 page transitions, 21 micro-interactions, the text-piece
  entrances, Stagger Reveal, Scroll Image Sequence, Smooth (Inertia) Scroll, Scroll Velocity Skew and others. Compare's still is
  posed by hand: the second half at its telling moment (half-way, at its peak, half open) with a faint ghost of its start, the
  first half plain. A loop paused at time zero is posed at a telling frame; halves that differ only in speed show arrows as long
  as each speed.
- **Random pieces** (Shatter Effect, Dissolve Transition, Heart / Like Burst, Success Confetti, Image Trail): See inside draws the
  plan the current play uses; stills use a fixed plan.
- **A "Shows the …" switch already on the page** (about 16 pages): See inside reuses its drawing and never flips the switch.
  **"Without" already a setting** (Canvas Particle Effect, Glassmorphism Animated, Snow / Rain, Ray Marching / SDF Scene):
  Compare still shows both at once.
- **Your text (19 pages):** the copy follows it, and every other setting.
- **Snap Scrolling:** a mode never changes the size or place of the scrolling content, or the browser re-snaps the box.
- **Safety:** no mode adds a flash; Flash / Light Leak Transition draws its flash as an outline.
- **Twins** get different pictures and share a builder slot: Stacking Cards and Section Wipe; Pin Animation and Sticky Section;
  Split Text Reveal, Letter-by-Letter Stagger and Word-by-Word Reveal; Portal / Tunnel Zoom and Circle Reveal. Curtain Reveal
  and Flash / Light Leak Transition also cover, swap and uncover: each draws its own picture, not a copy of Overlay Wipe's.

### Weak views

No page leaves a view out. The rows marked * show a common mistake or a small made-up scene in Compare (ruling 3).

| Page | Weak because | Do |
|---|---|---|
| Loading Spinner* | moving beside stopped is what Pause shows | a made-up scene: "Looks stuck" (a box with no sign of life) / "With a spinner" |
| Notification Badge Pulse* | the same | "Pulses forever" / "Stops after three", from its own option |
| Typewriter Effect* | text already there is obvious | "Even beat" / "Like a person" |
| Scramble / Glitch Text* | finished text beside a scramble is obvious | letters locking "All at once" / "One by one" |
| Scroll-Driven 3D Rotation* | a cube that does nothing is thin | "On a timer" / "With the scroll" |
| WebGL Shader Animation* | a gradient beside a shader teaches little | "Drawn once" (a frozen frame) / "Every frame" |
| Outline to Fill | the stage already shows two ways to fill | in Compare the Fade row becomes "Snaps", beside "Wipes" |
| Snap Scrolling | one scroll cannot drive two boxes; Play turns snapping off | two boxes scrolled by hand, at rest between sections / on one; note: "Scroll either box a little and let go." |
| Grain / Film Noise Overlay | the grain is felt, not seen | both halves zoomed in, labeled "Zoomed in" |
| Grid / Dot Pattern Parallax | a shift of a few percent | an arrow on each layer as long as its shift (equal on the first half) |
| GPGPU Particle System | a count difference only | "A few thousand" / "Tens of thousands"; the small side about 1,000 on phones |
| Liquid Glass | only Chromium draws the bend | elsewhere the note says both halves look the same in this browser |
| Animated Gradient Background, Text Gradient Animation | the window picture does not fit Color wheel and Spinning | a turning color wheel for those two styles |
| View Transitions API | the browser takes the real pictures | See inside is a drawn stand-in, and its note says so |
| Ray Marching / SDF Scene, Volumetric Smoke / 3D Noise, 3D Model Orbit | jargon | plain words and a legend ("steps to find a surface"); only edges and a light marker on 3D Model Orbit |
| Button Press Scale | a graph of a fifth of a second adds little | rest and pressed outlines in place of a graph |
| Abstract Geometric Motion | four patterns; Rings and Bars differ little | one overlay per pattern; arrows as long as each shape's speed |
| Ambient Ripple Effect | timing only, slow to see | the note asks for a few seconds; the still shows rings evenly and unevenly spaced |
| Progress Bar, Scrollspy Navigation, Scroll-Driven Background Color, Shimmer Effect, Animated Gradient Border, the page transitions | thin but honest | keep; See inside carries the lesson |

## 3 · The first batch

Six new pages, one per category, plus Parallax Scrolling. Together they cover every page kind (scroll, plays once, two do-it,
three loops), seven kinds of See inside picture, both kinds of Compare, the two usual hard builds (one canvas split in two, one
WebGL context in two viewports) and a page whose Compare reduced motion erases. Each becomes its category's reference. The seven
second-world pages are not in it; they go first in their slots (section 7).

| Page | Kind | See inside | Compare: first / second | Why this page |
|---|---|---|---|---|
| 01.02 Parallax Scrolling | scroll | the four layers fanned out (done), each start outlined (ruling 2) | "Without parallax" / "With parallax" | the pilot; gets the start outlines and the clean-up of section 5 |
| 02.01 Fade In / Fade Out | once | a small graph of how see-through the card is over time, a dot riding it with the card | "Appears at once" / "Fades in" | a graph a beginner must read (CURVE and TIMELINE pictures: 24 pages); Replay, Loop and Slow motion reach both cards |
| 03.14 Overlay Wipe | do · click | three bars, "Panel comes in", "Page changes behind it", "Panel leaves", with a marker in step; the panel see-through | "Switches at once" / "Panel sweeps over" | the 14 small-site transitions; Show me and Reset drive two boxes; reduced motion erases its Compare (a posed still) |
| 04.05 Magnetic Button | do · hover | a ring for how far the pull reaches, an arrow for how far the button leans, the label moving a third as far | "Stays put" (with a ghost pointer) / "Leans toward you" | the hover pages: an inert first half, a ghost pointer, arrow keys; arrows for pulls |
| 05.06 Marquee / Ticker | loop | the strip zoomed out: two identical halves end to end, the box as a window over them, the point where it jumps back | "One copy" / "Two copies" * | Your text feeds a copy (19 pages); the shared pause and slow motion reach it; a common mistake |
| 06.05 Fluid / Liquid Simulation | loop | the plain circles outlined, the zone where two start to melt shaded | "Hard circles" / "Melting" | WebGL: one context in two viewports, the pointer's blob in the second half only |
| 07.14 Flow Field | loop | small arrows on a grid for the invisible current, the particles riding them | "Random each step" / "Follows the current" * | canvas: one canvas split, half the particles and its own trails on each side |

\* A common mistake in the first half (ruling 3).

Parallax Scrolling also gets the final review's small fixes: labels drawn sharp in See inside (no `will-change` there), the
reduced-motion Compare note "on the right each layer has moved its own amount", its "half as far" comment corrected, and
`data-hb-caption` on its labels and half names.

**What the owner sees.** The review kit (section 4, item 8) run on the seven pages: for each, nine stills (Normal, See inside
and Compare at 1280×800, at 375×812 and at 375×812 with reduced motion) and three clips at 1280×800 of about seven seconds
each (at rest, then the mode pressed, which plays the demo once on a plays-once or do-it page; then Play on a scroll page, or
nothing more on a loop); Normal before and after with the count of differing pixels; one `index.html` with plain captions,
each of the four rulings named beside the clip that shows it. The pages are also opened in the browser pane. The owner
approves or asks for changes; the changes are applied to the batch (a shared one as section 4, item 7 says); then the rest
starts. While the owner looks, the leads write the other 159 briefs (no code).

## 4 · Shared fixes first (Phase 0)

Small, each reviewed, one agent at a time per shared file, all on `feat/see-inside-compare` before the first batch:

1. **Fix wave A, round 2** (`lp/fr1`, in progress): Watch-step screenshots taken with plain clips, so the window is never resized
   (final review part 3, Important 2: 73 pages listen for resize), each screenshot checked to show the stage as checked (part 1,
   Important 1b), the pointer moved off the stage first; and the stylesheet's guard that keeps the note under a player bar that
   carries the reduced-motion note, with its tighter test. Reviewed, then merged.
2. **The do-it path of the mode check** (part 1, Important 3): before the first picture, Reset where the page has it, then wait
   for rest; rest means unchanged for 750ms (one helper in place of `stillShot` and `settledShot`); after each press, wait for any
   run it started. New fixtures beside the old ones: a do-it page whose result reverts on a timer, a paused loop that redraws on
   resize, a page with scroll snapping. Every old fixture still passes or fails as before.
3. **Captions and copies in the mode check:** in each mode, every visible `[data-hb-caption]` is inside the stage, at least 12px
   as drawn and clear of the others; no id appears twice; where the stage (or its canvas or picture) has an `aria-label`, it
   changes with the mode; a control's name contains its visible words.
4. **Shared script** (`demo-page.js`): `setUpCopy` runs only with a prompt; the comment says a press on the pressed mode sends
   `hb:mode` again; a test pins that the buttons, notes and stage mark change before `hb:mode` is sent. Ruling 1: after
   `hb:mode` from See inside or Compare the script presses Replay (plays-once pages) or Show me (do-it pages) once, never under
   reduced motion, never after Normal, never on scroll pages or loops, with a test for each case; the mode check waits for that
   run to end before its picture.
5. **Tests** (`tests/pages.test.js`), on every page with the switch: exactly two notes, direct children, one or two sentences
   each; the script listens for `hb:mode`; no rule on `[data-hb-mode="normal"]` and every mode rule names `.stage`; the switch's
   phone rule outranks the `.seg` phone rule (part 1, Minor 7). One marked line turns "pages with the switch" into "every
   animation page": the final gate, flipped at integration.
6. **The C and D clean-up** (section 5).
7. **Version:** one bump to `?v=10` on every animation page and the home page, on tracked files only (`git ls-files`), keeping
   line endings. Then the shared files are frozen. A shared change the owner asks for at the first batch is applied with one
   more bump before the other 159 pages start; after that, a lane that needs a shared change writes it in its ledger, and the
   coordinator applies them all at integration with one more bump (the order of numbers: the coordination file).
8. **The review kit** (`.superpowers/sdd/2026-10-13-learn-pilot/review-kit/record.mjs`, outside the repository) takes any list
   of pages and reads each page's kind; it makes section 3's stills and clips; with `--before <address>` (a detached checkout of
   main, served read-only on port 8800, so `main` stays free for releases) it pictures Normal at rest from both and counts the
   differing pixels; with `--gallery` it makes stills of every page, one gallery file per category, for the owner's final look.

## 5 · The release branch without the learning path

One commit on `feat/see-inside-compare` in Phase 0 (`chore: the learning path and the idea lessons wait on feat/learn-pilot`),
so that resuming C and D later starts by reverting it on a branch from the main of that day. `feat/learn-pilot` stays as it is.

**Removed:**
- The whole `learn/` folder: `learn/index.html`, `learn/follows-the-scroll/index.html`, `learn/far-things-move-slower/index.html`.
- `tests/learn.test.js`.
- On Parallax Scrolling: the lesson line (`p.hb-lesson`), the lesson nav (`nav.hb-lesson-nav`) and the See inside note's link
  "The idea: far things move slower". The note keeps its sentences; its `span.say` wrapper goes and the script writes the note's
  text as it already does Compare's.
- In `assets/css/demo-page.css`, all the lesson CSS: the learning-path block (`.hb-lesson`, `.hb-lesson a`, `.hb-lesson-nav`,
  `.hb-lesson-title`, `.hb-lesson-prev`, `.hb-lesson-next`, `.hb-lesson-all`, `.hb-why`, `.hb-seen` and their parts), its two
  hover rules, the 601px block that sets the lesson line beside the category line, and its three phone rules. Nothing on the
  release uses it, every page would download it, and it comes back with C and D.
- In `tools/check-pages.mjs`: the `learn` target (usage line, header paragraph, the expansion of `learn`, `learn/` and
  `learn/index.html`), the `body.hb-learn` exceptions in the page checks, and `.hb-lesson a, .hb-lesson-nav a, .hb-path a` in the
  touch-target list.
- In `tests/pages.test.js`: the stylesheet test drops its eight lesson selectors and its 601px assertion, and its title the
  lesson words.

**Kept:** the shared script's boot on a page without a prompt (generic and harmless) and its test, renamed without "such as an
idea lesson"; the script's header comment loses "(the idea lessons)"; the underlined link in notes and the test that every link
in a note opens an existing page (a note may link another animation page).

**Added:** one guard test: no tracked page links into `learn/`, and the shared stylesheet has no `hb-lesson`, `hb-why`, `hb-seen`,
`hb-learn` or `hb-path` rule. It is deleted when the learning path resumes.

## 6 · Docs and generated files

- **CLAUDE.md:** the Watch step of the page template gains the switch and the notes (copied from Parallax Scrolling; pinned by
  the tests like the player buttons). A new part, "See inside and Compare", holds section 1 of this spec (the two views, the
  acceptance, the `hb:mode` listener, reduced motion, phones, `data-hb-caption`, copies) and points here for the hard cases and
  weak views. "Keep demos under ~300 lines" becomes "about 300 lines for the demo plus about 150 for See inside and Compare".
  Step 3 of "When asked to add a new animation" also builds both views, starting from the first-batch page with the closest kind
  of picture. The page-check part names the mode checks and the screenshots `<name>-<setup>-inside.png` and `-compare.png`. The
  testing checklist gains: "Do See inside and Compare each read from the picture alone at 375px and 1280px, still under reduced
  motion?"
- **CONTRIBUTING.md:** the same in Ground rules, Adding a new technique, The demo page, Reduced motion, Self-check, and Tests and
  the page check. **`.github/pull_request_template.md`:** a new-technique box, "See inside and Compare: both notes, each mode
  clear from its screenshot at 375px and 1280px, still under reduced motion", and the line limit as in CLAUDE.md.
- **Root `README.md`,** How to use it, step 2 gains one sentence: "See inside pulls the animation apart to show how it works, and
  Compare shows it beside a version without the effect or with a common mistake." **`CHANGELOG.md`:** one line under Unreleased.
- **When:** these docs are written at integration, on top of what main has brought in by then (the finder's and Famous
  effects' lines once they are live); each project writes only its own lines (the coordination file's map).
- **No change:** the 166 page READMEs and the seven category READMEs (a page reads only What it is and See also from them), the
  home page apart from the version, `404.html`, `og-image.png` and every count.
- **`sitemap.xml`:** `node tools/update-sitemap.mjs` once at the end, and after each merge of main into the branch (generated
  files are never merged by hand); every page changed, so each date moves to its last commit.
- **`llms.txt` and the skill:** no change. Modes are not settings and the prompts do not change, so `node tools/make-skill.mjs`
  must write identical files (the skill test and `git status` show it).
- **The pilot spec** gets one status line at its top: A and B roll out by this spec; C and D wait on `feat/learn-pilot`.

## 7 · How the work runs

**Who.** The coordinator (the main session) owns the shared files, the merges, integration and the coordination with the other
projects (`2026-10-13-next-projects-coordination.md`: branches, the file map, version numbers, releases). Seven lane leads, one per
category, write the briefs, dispatch builders and reviewers, keep a ledger in the run folder
(`.superpowers/sdd/<start date>-see-inside-compare/`) and merge their lane. Each page has one builder, then one fresh reviewer
(never the builder), both on the strongest model; at most three fix rounds by the same builder, then the lead escalates (a design
question goes to the owner).

**Slots.** Each lane runs builder slots side by side: 01 three, 02 two, 03 two, 04 four, 05 two, 06 four, 07 three (20). A slot
is a worktree `.claude/worktrees/sic-<NN><letter>` on branch `sic/<NN><letter>` with its own port from 8801. It builds its pages
one after another, each page one commit touching only that page's `index.html`, so merges never conflict. Twins share a slot;
hard and heavy pages go first, so the long ones start early. Whenever all of a slot's pages so far are approved, the lead merges
it into `sic/cat-NN` and runs the tests and the category's page check; the coordinator merges categories into
`feat/see-inside-compare`.

**Per page.** Builder: brief, build, tests, page check (six `ok`, screenshots saved with `--out` into the run folder), views
tuned from the screenshots, Normal before and after, one commit, a short report. Reviewer: the brief, the page's diff, the
screenshots, the check output and the Normal count, against the acceptance list, plus the per-frame work the check cannot
measure; a verdict.

**Machine.** At most eight page checks at once on the machine: the pool `slots/slot-1…8` in this run folder serves every project
running at the time (a check takes a slot by creating its folder, an atomic step); headless Chrome only, never the shared
browser pane; one server and one scratch folder per slot; no `git stash`; leftover `hb-chrome-*` temp folders removed at the end
with the owner's OK. The main checkout stays on `feat/see-inside-compare` for the whole run. If the usage limit bites, the
finder and Famous effects pause first, then the coordinator runs fewer slots.

**End.** Integration: merge, flip the final gate, run the tests, `home`, `famous` (once it exists) and the whole site in seven
parallel runs, `make-skill` (no change), `update-sitemap` and the docs. The final review runs in eight parts on frozen detached
checkouts, each started as its category lands: one per category (every page's screenshots, twins kept apart, the category
consistent) and one for the shared files, tools, tests and docs; builders fix their own findings. Then the owner's final look:
the gallery of all 166 pages, clips of two pages per category and the site served locally. Published on the owner's word, all
at once, by the coordination file's release rule (merged into main from the release worktree, generated files regenerated in
the merge, then pushed).

**Time, honestly** (running time; the owner's two looks come on top):

| Step | Time |
|---|---|
| Phase 0: shared fixes, clean-up, version, review kit, first-batch briefs | about 5 hours |
| First batch: six pages in parallel with their reviews, the kit run | about 7 hours |
| The owner's first-batch changes applied | about 2 hours |
| The other 159 pages in 20 slots | about 2 days |
| Integration, whole-site check, final review in eight parts, docs | about half a day |

About **4 days** from the go-ahead to a branch ready to publish: 3 at best, 6 if the usage limit stops the agents again (it did
on 2026-09-30) or the 42 hard pages need extra rounds. More slots would not finish much sooner: one machine runs every page
check. The finder and Famous effects run beside Phase 0 and the owner's first-batch look, about a day of agent work each on the
same usage limit; on a usage-limit hit they pause first. Started on 2026-10-14 with quick looks from the owner and approved by
2026-10-22, it can go live before the Show HN post of 2026-10-25; otherwise after 2026-10-26, since nothing merges into main
from 2026-10-23 to 2026-10-26 without the owner's explicit word.

**Room for the next projects** (order, branches and file map: `2026-10-13-next-projects-coordination.md`). The ten new
animations come after this rollout's integration and get See inside and Compare from the start: CLAUDE.md's new-animation
steps say so, and the final gate fails a page without the switch. The finder (a view of the home page) and Famous effects
(`famous/`) have no switch; they are built from main beside this rollout and may go live before it, and main is merged into
this branch the same day. The pass that adds their tabs to every top bar runs after the ten new animations are integrated
(owner's order: this rollout, the ten new, the tab pass); the switch sits in the Watch step, far from the top bar. The shared
files change only in this rollout, the ten new animations and the tab pass, in that order, each bump to the next number. The
learning path resumes by reverting the clean-up commit; See inside notes may then link idea lessons again.

No question is open: the four were answered on 2026-10-13 (Owner rulings).

## Acceptance

- The tests pass with the final gate (the switch on all 166 pages); six `ok` lines for every page and the home page; the
  whole-site check has no FAIL.
- Every page has a reviewer's verdict against section 1; the final review in eight parts leaves no Critical or Important item.
- `make-skill` writes identical files; `sitemap.xml` is rewritten; CLAUDE.md, CONTRIBUTING.md, the PR template and the README
  are updated.
- The owner approved the first batch and the gallery; nothing was published before.
