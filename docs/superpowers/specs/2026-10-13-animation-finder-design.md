# Animation finder: design

2026-10-13. The most frequent real need the research found: people see an animation on a website and cannot name it
("what is this animation called?": about 110 threads since 2025 in r/css, r/Frontend and r/web_design, most unanswered). The
owner approved an **Animation finder**: a few button questions (what moved, when, how), then the matching animations with
their names and moving previews, best first. It cannot always be right, so it shows several and a **Not here?** link.
Roadmap: `2026-10-13-goal-and-roadmap.md` ("Name it"). It is built beside the project that edits the 166 pages (See
inside and Compare), so it leaves those pages alone; their Finder tab comes in the tab pass after the ten new animations
(section 7). Branches, the shared-file map, generated files and releases: `2026-10-13-next-projects-coordination.md`
(where the two disagree, that file wins).

## Owner rulings

- **2026-10-13, release:** the finder goes live as soon as it is ready and the owner approves it, reached from the home
  page (the button under the search and the Finder link in its top bar); the tabs on every page come later, after the ten
  new animations (owner: yes).
- **2026-10-13, Not here?:** it opens a short GitHub issue form with the visitor's answers filled in (decided: the spec's
  suggestion A, taken as the coordinator's default); Discussions is not used (section 6).

## What the owner will see

1. On the home page, under the search box and its Popular line, a button: **Don't know the name? Find it**. In the top
   bar, a **Finder** link (computers and tablets).
2. Either one opens the finder in place of the top of the home page (heading, search, place tiles): the heading **Find
   an animation you saw**, one line under it, and three numbered questions with picture buttons: **1 · What moved?**
   (9 answers), **2 · When did it move?** (7), **3 · How did it move?** (17 small moving pictures: faded, slid, grew,
   turned, broke into pieces, followed my pointer…). Each question also has **Not sure**.
3. With every answer the cards below change: the usual cards with moving previews, names, descriptions and Copy prompt,
   in two groups, **Best matches** and **Close matches**.
4. Under the cards, **Not here? Tell us on GitHub** opens a short form with the visitor's answers already filled in.
5. The address keeps the answers: `…/animation-handbook/?view=find&what=text&when=scroll&how=draw` opens the same
   matches, so a link can answer someone who asks "what is this animation called?".
6. Later, after the ten new animations, one pass adds **Finder** (with Famous effects) to the top bar of every animation
   page.

## 1 · Where it lives: a view of the home page

Decision: the finder is a **view of the home page**, `?view=find`, like All animations (`?view=all`). It reuses the cards.

| | View of the home page (chosen) | Separate page (`finder/index.html`) |
|---|---|---|
| Reuse | Cards, previews, reduced-motion stills, Copy prompt and card accessibility work as they are. | Needs the preview library (164 KB of CSS and markup code inside `index.html`): a copy that drifts, or first a move into shared files, a refactor of the home page while two other projects edit it. |
| Page size | `index.html` grows about 20–25 KB (266 → about 290 KB); a hidden view costs nothing. | A new page of about 200 KB, or that refactor. |
| Home check | The `home` target gains finder steps: still six `ok` lines. | A new target with six setups of its own. |
| Sharing a link | `?view=find&what=…` opens the same answers and matches; the link preview is the home page's. | Its own title and link preview, better for search engines. |
| 404.html | Maps `/finder` and `/find` to the view, and gains a third way back. | Nothing to map. |
| The 166 pages | Untouched. | Untouched. |

The one thing a page does better, its own entry in search results, can come later: once the parallel projects end and the
preview library moves into shared files, a thin `finder/index.html` can open the same finder while `?view=find` links keep
working. Meanwhile the view sets the tab's title to "Find an animation you saw — Animation Handbook".

## 2 · The questions

Three questions in this order, each a group of picture buttons ending with **Not sure**, which leaves that question out.
The key (before each answer) is what the address and the tags use. What and When answers have a small still icon.

**1 · What moved?** `text` Text or numbers · `card` A picture or card · `button` A button or icon · `menu` A menu or form ·
`loader` A loading sign or message · `shape` A line or shape · `particles` Dots or particles · `background` The
background · `page` The whole page.

**2 · When did it move?** `scroll` When I scrolled · `hover` When I pointed at it · `click` When I clicked or tapped ·
`drag` When I dragged or swiped · `load` When the page opened · `newpage` When I went to another page · `loop` By itself,
again and again.

**3 · How did it move?** Under the question: "Pick the picture closest to what you saw." Each answer has a small moving
picture; the examples show the kind of card it finds.

| Key | Answer | Moving picture | For example |
|---|---|---|---|
| `fade` | Faded or blurred | a square fades and sharpens | Fade In / Fade Out, Blur In |
| `slide` | Slid | a square slides in from the side | Slide In, Hide-on-Scroll Header |
| `grow` | Grew or shrank | a square grows from small | Scale In / Zoom In, Zoom Into Image |
| `turn` | Turned or flipped | a card turns over | 3D Flip Card, Loading Spinner |
| `bounce` | Bounced or shook | a ball bounces | Bounce In, Error Shake |
| `stagger` | One after another | three bars appear in turn | Stagger Reveal, Word-by-Word Reveal |
| `pieces` | Broke into pieces | a square splits and flies apart | Shatter Effect, Success Confetti |
| `follow` | Followed my pointer | a dot trails an arrow | Cursor Follower, Magnetic Button |
| `color` | Changed color or glowed | a band of color shifts | Animated Gradient Background, Text Fill on Scroll |
| `morph` | Changed into something else | a circle becomes a square | Hamburger Menu Toggle, Text Morphing |
| `draw` | Drew or typed itself | a line draws itself | SVG Path Animation, Typewriter Effect |
| `reveal` | Got uncovered | a panel wipes off a picture | Clip-Path Reveal, Curtain Reveal |
| `layers` | Moved in layers | three bands slide at different speeds | Parallax Scrolling, 2.5D / Pseudo-3D |
| `pin` | Stayed in place while I scrolled | a box holds while lines pass it | Pin Animation, Stacking Cards |
| `drift` | Drifted or floated | dots drift | Floating Elements, Starfield / Space Particles |
| `wave` | Rippled or waved | rings spread | Ambient Ripple Effect, Wavy Text |
| `glitch` | Glitched or flickered | a bar jitters in red and blue | Glitch Text, Neon Flicker |

The answers use the words people use in naming threads, never CSS terms. A card carries every answer a visitor might give
for it, so someone who names another side of the same effect still finds it (Slide In counts as Slid and as Faded). Dots
and particles have an answer of their own: a dotted or starry background is one of the most asked looks and would drown
among the other backgrounds.

## 3 · The tags

**Data.** `const FIND` in `index.html`, right after `PLACES` and in the order of `CATS` (one source of truth, kept in step
by a test, as `PLACES` is): three strings per card, what · when · how, each a list of answer keys, **the main one first**.

```js
// What moved, when and how: the finder's answers for each card, the main one first.
const FIND={
  'parallax-scrolling':['background card','scroll','layers'],
  'slide-in':['card menu loader','load click','slide fade'],
```

The questions and answers are one list, `FIND_Q` (keys, words, picture classes); the page builds the buttons from it and
the tests read it.

**Rules.** Tag what a visitor sees and would say, not how it is built. What: 1–3 answers, the main one being what the
demo moves. When: 1–3, every trigger the effect is commonly used with on real sites, not only the demo's (a fade plays
when the page opens, on scroll and on click), the most common first. How: 1–4, the most visible movement first, then the
ones a visitor might name instead. A technique that drives many effects (Scroll-Triggered Animation, View Transitions
API, FLIP Technique, Scrub Animation) takes only the movements its own demo shows. Not sure is never a tag.

**How the 166 are tagged and checked.**
1. Seven agents at once, one per category, read each page (title, lede, the README's What it is, and the demo's stills
   from one page check per category run with `--out`, taken in the shared pool, never in the browser pane) and write the
   three lists with a one-line reason per card in a lane ledger. They never see the test set.
2. A second agent per lane checks the rules, also across categories (every page transition answers When I went to
   another page; every loop answers By itself).
3. The integrator writes `FIND` and runs the tests and the test set; a miss is fixed by changing tags, with the reason
   in the ledger, never by changing a case.
4. A fresh reviewer reads the 166 rows beside the pages ("would someone who saw this pick these?") and runs the
   held-out set.

## 4 · Matching and order

For each card and each answered question, the card's main tag earns 2 × the question's weight, another tag 1 × the
weight, and no tag is a miss. Weights: How 3, What 2, When 1 (the movement is what people describe best, the trigger
what they misremember most).

- **Best matches:** no miss. **Close matches:** exactly one miss, and only when two or more questions are answered.
- Order inside each group: points, then fewer tags in total (a card made for just this comes before one that does many
  things), then home order. Best always comes before Close.
- No answer, or Not sure everywhere: no cards, only the line asking for an answer.

Example, Text · When the page opened · One after another: Letter-by-Letter Stagger tagged `text`, `load scroll`, `stagger
fade` scores 2×2 + 2×1 + 2×3 = 12 (Best); Typewriter Effect tagged `text`, `load loop`, `draw stagger` scores 4 + 2 + 3 = 9
(Best, after it); Fade In / Fade Out, without `stagger`, is a Close match. The rule is one function,
`findMatches(answers)` → `{best, close}`, that never touches the page, so the tests run it as they run the search today.

## 5 · The finder view

**Layout, top to bottom.**
- The top bar as today, Finder marked `aria-current="page"`. The hero and the place tiles are hidden; in their place
  `section.finder`: the h1 "Find an animation you saw" and the line "Saw an animation on a website and don't know its
  name? Answer three short questions. The animations that match play below, with their names."
- Three `fieldset`s with a `legend` ("1 · What moved?", the number in a dark circle as in the pages' steps). What and
  When: a still icon beside the words, about five across on a laptop, two on a phone. How: a small dark square (about
  64px) with its moving picture above the words, about six across, three on a phone. Not sure: a plainer, smaller
  button at the end of each group. Under question 3: **See 14 matches** (hidden while nothing matches) and **Start over**.
- The results section, as for every view: h2 "Your matches", the line ("5 best matches and 9 close matches."), then the
  groups **Best matches** and **Close matches** ("They fit all but one of your answers."), each headed like a group of
  All animations (an h3 with its count, card titles a level below). The first 12 cards show; **Show all 23 matches**
  shows the rest. Then the Not here? panel (section 6), How it works and the footer. The phone bar (back arrow, search,
  place chips) does not show in the finder.

**Behavior.** Picking an answer changes the cards at once and never scrolls the page: the next question is right below.
See N matches brings the results heading into view with keyboard focus, as Search does. Start over clears the answers
and the cards (the address goes back to `?view=find`) and puts focus on the finder's heading. When nothing fits every
answer the line says "No animation fits all your answers. These come close."; when nothing comes close either, the Not
here? panel says "Nothing fits these answers yet." and suggests Not sure on one question.

**Address and history.** `?view=find`, then `&what=`, `&when=` and `&how=` for each answered question (in that order, keys
from section 2), then `&all=1` after Show all; an unknown value counts as Not sure. Entering the finder (home button,
top-bar link, a tab link) adds one history step; answers, Start over and Show all only replace the address, so Back
leaves the finder in one press, and Back from a demo page returns to the same answers. Old addresses work as before
(`?q=` still wins over any view). The finder needs JavaScript like the rest of the home page, and works from disk.

## 6 · Not here?

- A panel under the cards whenever an answer is picked: **Not here?**, "Tell us what you saw. We use it to add the
  animation or to fix the finder.", **Tell us on GitHub** (new tab, `rel="noopener"` like the other GitHub links),
  **Describe it in words** (back to the start, search box focused), and "The form is on GitHub and needs a free account."
- New issue form `.github/ISSUE_TEMPLATE/animation_not_here.yml` (named like `bug_report.yml` and `new_technique.yml`):
  name "Can't find an animation", description "You saw an animation on a website, and the finder did not show it.",
  title "[not here] ", label `finder` (created once on GitHub with `gh label create finder`, only with the owner's OK; until
  then GitHub leaves the label out and the form works the same), fields `answers` (input, "Your answers in the finder"), `site`
  (input, required, "Where did you see it? A link, and where on the page"), `what` (textarea, required, "What happened,
  in your own words") and `recording` (textarea, optional, "A screen recording or picture: drag it into this box").
- The button opens `…/animation-handbook/issues/new?template=animation_not_here.yml&title=…&answers=…`: GitHub fills an
  issue form's fields from the address by their `id`. `answers` holds the answers in words, then the finder's live
  address with them ("Text or numbers · When I scrolled · Drew or typed itself — https://…/?view=find&what=text&…"). No
  personal data. `config.yml` gains a contact link to the finder, "Find an animation by what you saw", so people who come
  to GitHub to ask try it first.
- Not taken (ruling of 2026-10-13): a Discussions question with a Q&A category, where others could answer. GitHub
  documents no way to fill a discussion form from the address, so every visitor would start from a blank page, and the
  tests could not check it.

## 7 · Ways in

- **Home, under the search:** `<a class="find-cta" href="?view=find">Don't know the name? Find it</a>`, a pill under the
  Popular line at every width (full width on phones). The home check keeps the search box and the first row of tiles on
  the first screen at 1280×800 and 375×812; by estimate about 100px are spare at both today, and the builder measures.
- **Home top bar:** `<a class="lnk" id="nav-find" href="?view=find">Finder</a>` before Browse all. Phones (≤ 600px) show
  no top-bar links today, so there the button above is the way in. Where Finder, Browse all and How it works do not all
  fit (below about 850px, measured), How it works leaves the bar; its band stays on the page. Both links switch the view
  without a reload; a click with Ctrl, Cmd, Shift or Alt is left to the browser, as for Browse all.
- **The tab on every page** (added in the tab pass after the ten new animations, not now; a draft for that pass), right
  after the home link of `nav.hb-bar`:
  `<a class="hb-tab" href="../../../?view=find" aria-label="Finder"><svg class="hb-ic" …>…</svg><span>Finder</span></a>`,
  the icon a magnifying glass with a question mark; from disk the shared script already makes it
  `../../../index.html?view=find` (the learning path's pages get the tab when it resumes). The Famous effects tab
  follows it, and the pass gives both one set of width rules like the Star link's: words on computers, a 44px icon where
  the bar is tighter, none on phones, where the home link and the two arrows fill the bar. The coordinator writes the tab
  pass's short spec after the ten new animations are integrated, from this section: both tabs and icons, width rules
  measured from 820 to 1060px (there the bar already shrinks the Star to a 44px icon; below 820px it hides it), the home
  page's bar (adds Famous effects), the Famous effects page's bar (adds Finder), 404 (decide), CLAUDE.md's top-bar line,
  the tests that pin the bar, `make-social-image.mjs` (the new home-bar link hidden like the finder's), one shared-file
  bump, the whole-site check and `update-sitemap`.
- **404.html:** `whereTo` sends `/animation-handbook/finder` and `/find` (any case, with or without a slash) to
  `/animation-handbook/?view=find`, keeping any `what`, `when` and `how`; a third way back, "Find an animation by what
  you saw".

## 8 · Accessibility, reduced motion and phones

- Native radio buttons in `fieldset`s: one Tab stop per question, arrow keys choose, and a screen reader says "Text or
  numbers, radio button, 1 of 10". The words are the name; pictures are hidden from screen readers. The radios are
  hidden from sight but focusable: an answer shows the site's 3px focus ring, a chosen one a dark ring and a tick.
- The results line is today's polite live region, written 400 ms after the last change, so arrowing through answers
  announces only the final count. Focus moves only with See N matches, Start over, Show all (to the first new card, as
  today) and when a pressed control goes away (to the finder's heading).
- Text at least 4.5:1 in both themes; every answer, button and link at least 44×44px on phones; no sideways scroll at
  320px. Reduced motion: the 17 pictures hold a clear still frame with a small arrow for the movement, the card previews
  hold still as everywhere, scrolling into view is instant, and nothing else moves.

## 9 · How we know it works

**The test set.** 28 described effects, each with the answers a visitor would pick (frozen now, before any tags exist)
and the animations that count as right. Sources: R = the research's examples; F = forum threads found on 2026-10-13;
S = a well-known site's effect; C = an everyday effect of the kind naming threads ask about.

| # | Src | What they described | Answers (what · when · how) | Right if one of |
|---|---|---|---|---|
| 1 | R | ironhill.au: as I scroll, the hero picture breaks apart and dissolves | card · scroll · pieces | Shatter Effect, Dissolve Transition |
| 2 | R | Stripe's home page until 2025: soft colors slowly move and blend behind it all | background · loop · color | Mesh Gradient Animation, Animated Gradient Background |
| 3 | C | The headline's letters appear one after another when the page loads | text · load · stagger | Letter-by-Letter Stagger, Split Text Reveal, Word-by-Word Reveal |
| 4 | F | CSS-Tricks forum: images grow from nothing to full size | card · load · grow | Scale In / Zoom In |
| 5 | F | RocketTheme forum: a box gets bigger on hover and seems to jump off the screen | card · hover · grow | Hover State Animation |
| 6 | F | freeCodeCamp forum: a section stays centered while I scroll and its contents fade | Not sure · scroll · pin | Pin Animation, Sticky Section, Scrollytelling |
| 7 | F | GSAP forum: the picture seems to come toward me as I scroll | card · scroll · grow | Zoom Into Image |
| 8 | F | Webflow forum: "a 3D effect" when scrolling (the answer: parallax) | Not sure · scroll · layers | Parallax Scrolling, Parallax Depth-of-Field |
| 9 | F | Webflow forum: on clicking a project, smoky shapes grow and fade, and it opens | page · click · Not sure | Circle Reveal, Overlay Wipe, Portal / Tunnel Zoom |
| 10 | F | Webflow forum: a colored block slides over the title and leaves it showing | text · load · reveal | Curtain Reveal, Text Clip-Path Reveal |
| 11 | C | The scrolling feels smooth and glides on after I stop | page · scroll · slide | Smooth (Inertia) Scroll |
| 12 | S | Apple's AirPods page: the product turns and opens as I scroll, like a video | card · scroll · turn | Scroll Image Sequence, Scrub Animation, Scroll-Driven 3D Rotation |
| 13 | S | Apple's product pages: a paragraph's words light up as I scroll | text · scroll · color | Text Fill on Scroll |
| 14 | C | A soft glow follows my mouse over the cards and lights their edges | card · hover · follow | Spotlight Hover Glow |
| 15 | S | GitHub's home page: a 3D globe slowly spins | shape · loop · turn | 3D Model Orbit |
| 16 | C | The menu icon's three lines turn into an X | button · click · morph | Hamburger Menu Toggle |
| 17 | C | A button moves toward my cursor when I get close, then snaps back | button · hover · follow | Magnetic Button |
| 18 | C | The card tilts in 3D toward my mouse | card · hover · turn | Parallax 3D Tilt, Holographic Card |
| 19 | C | Gray boxes with a light sweeping over them while the page loads | loader · load · color | Skeleton Loader, Shimmer Effect |
| 20 | C | Numbers count up from zero when that part comes into view | text · scroll · Not sure | Counter Animation, Rolling Numbers |
| 21 | C | Scrolling down moves the page sideways through a row of panels | page · scroll · slide | Horizontal Scroll |
| 22 | C | The header hides when I scroll down and comes back when I scroll up | menu · scroll · slide | Hide-on-Scroll Header |
| 23 | C | Pictures pop up and trail behind my cursor | card · hover · follow | Image Trail |
| 24 | C | Dots float in the background and join with lines when close | particles · loop · drift | Particle Constellation, Canvas Particle Effect |
| 25 | C | The text tears into red and blue strips, like a broken TV | text · loop · glitch | Glitch Text, Chromatic Aberration |
| 26 | C | Snow falls over the whole website | particles · loop · drift | Snow / Rain |
| 27 | C | Going to another page, a colored panel sweeps across and the new page appears | page · newpage · slide | Overlay Wipe, Slide Transition |
| 28 | C | Confetti bursts out when I finish signing up | particles · click · pieces | Success Confetti |

**Target:** a right animation among the first 6 results (best then close, counted from 1) for at least **24 of the 28**,
and among the first 12, all shown without Show all, for at least 27. The test prints every case's position. The right
lists only grow: Ink Spread Reveal joins case 9 at the ten new animations' integration.

**Held-out set.** Once the tags exist, a fresh agent gathers 10 more real cases (new threads, the Famous effects list,
which may give Stripe's 2026 ribbon), never used to change tags: at least 7 in the first 6. Falling short means the
questions or the rules need work, shown to the owner, not more tag tuning. **The owner's look,** before anything goes
live: screenshots of the finder with two or three effects the owner has seen, at phone and laptop size; the 375px still
of question 3, with a fallback ready if 17 answers feel like too much (the nine that the most cards carry, then **More
ways it moved** for the rest); one line saying the finder is a view of the home page, so it opens like a page of its own
at …/?view=find; and the yes or no on creating the `finder` label (section 6).

**Unit tests** (`tests/finder.test.js`, run with the others):
- `FIND` lists every card of `CATS` once, in home order; each has 1–3 What, 1–3 When and 1–4 How keys, all known, none
  twice; every answer in `FIND_Q` is used by at least one card.
- `FIND_Q` holds the three questions and the answers of section 2, keys and words exactly.
- `findMatches`: no answer or only Not sure gives nothing; Best has no miss; Close has one and needs two answers; a main
  tag counts double; weights How 3, What 2, When 1, so with other tags equal a card missing When ranks above one missing
  What, above one missing How; ties go to fewer tags, then home order; an unknown key counts as Not sure.
- The test set and its target, on the page's own code read with vm, as the search tests do.
- The Not here? link names `animation_not_here.yml` and only fields that exist in it; the form has its four fields.
- The home page has the Find button, the Finder link and the finder's heading in their exact words, and a picture in its
  CSS for every How answer. No `@keyframes` name appears twice in `index.html` (a repeated name silently replaces a
  preview's motion; the finder's own names start `fd-`). 404.html: the new `whereTo` cases (its address test already
  covers the new link).

**Page check** (`tools/check-pages.mjs … home`, still six `ok` lines). Desktop: `?view=find` hides the hero and tiles and
shows three questions with nothing chosen; real clicks on answers change the cards and replace the address without a
history step; one case's right card is in the first 6; See N matches brings the heading into view with focus; Start over
clears; the Not here? link's address; the home button and the top-bar link enter the finder with one history step and
focus on its heading; Back returns to the start; a loaded address shows the same answers and cards. Every setup opens
the finder for overflow and console errors, phones also for 44px targets and no phone bar. Reduced motion: nothing runs
in the finder, and every How picture shows something (the previews' pixel test).

## 10 · Files and docs

- `index.html`: `FIND_Q`, `FIND`, `findMatches`, the finder section and its CSS (pictures included), the view, the home
  button and the Finder link. `demo-page.css` and `demo-page.js` do not change: no version bump. New:
  `.github/ISSUE_TEMPLATE/animation_not_here.yml`, `tests/finder.test.js`. Changed: `config.yml`, `404.html`,
  `tests/pages.test.js` (404 cases), `tools/check-pages.mjs` (finder steps, added as new functions and blocks),
  `tools/make-social-image.mjs` (it also hides `.find-cta` and `#nav-find`, so the social picture keeps the nine tiles
  where they are; the finder's integration runs it and the picture is unchanged).
- `CLAUDE.md` step 6 and `CONTRIBUTING.md`: a new animation also gets its finder answers in `FIND`, right after `PLACES`,
  in `CATS` order, main first, by this spec's rules; `tests/finder.test.js` checks them and runs the test set. CLAUDE.md's
  home check line names the finder. `.github/pull_request_template.md`, the new-technique box: "Finder answers in `FIND`,
  main first". The ten new animations (their own spec) get their answers this way.
- `README.md`, How to use it, step 1 adds "…or, if you saw it somewhere and don't know its name, answer three questions
  in the finder."; `CHANGELOG.md` one line under Unreleased. Unchanged: the 166 pages, `sitemap.xml` (a view is not a
  page), `llms.txt` and the skill (later idea: write each card's finder answers there too, so AI assistants can name an
  effect). The docs are written at the finder's integration, each only its own lines (the coordination file's map).

## 11 · Build, time and coordination

On `feat/animation-finder`, cut from `main` (it needs nothing from the rollout), by parallel agents, each part reviewed
by another: (1) at once, the tags in seven lanes, the finder in `index.html` on draft tags, and the tests, page check
steps, issue form, 404 and docs; (2) integration: the real tags, the test set and held-out set, tag fixes, a fresh final
review, all tests and `home`; (3) the owner's review from screenshots. Run folder
`.superpowers/sdd/<start date>-animation-finder/`, worktrees `.claude/worktrees/af-*`, ports 8901 to 8909; page checks
from the shared pool. It goes live on the owner's word, as soon as it is approved, by the release rule of
`2026-10-13-next-projects-coordination.md`, which also holds the file map (what the other projects change in
`index.html`, `tools/check-pages.mjs`, `tests/pages.test.js`, `404.html` and the docs), the generated-files rule and the
launch-week window.

Time: about one day of agent work (tags and page side by side, about 4–5 hours each, then 2–3 hours of integration and
review), plus the owner's look. The finder is on the ten new animations' base branch before they start (the coordination
file), so their lanes add their own `FIND` rows by section 3's rules (the `FIND` test fails until every card has them).
