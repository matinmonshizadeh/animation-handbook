# Famous effects: a gallery of cards that open as a pop-up, each with our own version

Owner's choice (2026-10-22): option A of the design canvas (https://claude.ai/artifact/7HuUtb3kFGW5ox5g6z53Ad).
It changes `famous/index.html` only, plus its test, its part of the page check, the Famous section of
`CLAUDE.md` and new files under `famous/versions/`. It builds on `2026-10-13-famous-effects-design.md`; where they
differ, this file wins.

## Why

Today the page is one long list. The owner wants a gallery: one card per effect, and a press opens the whole entry
in a pop-up, with a working demo of the effect. Screen recordings of the sites are not allowed (copyright, the sites'
terms, the legal checklist), so every card and pop-up shows **our version**: a demo we build from the entry's own
prompt, in the handbook's look, with nothing taken from the site.

## Legal rules (on top of the checklist in CLAUDE.md)

- Nothing from a site: no recording, screenshot, code, picture, icon, logo, typeface or brand color. Our versions use
  the site palette (`--c1` to `--c7`), the site font and our own placeholder content ("Your headline").
- A version never copies a site's layout or product shapes closely enough to pass for it; it shows the technique.
- Every stage that shows a version is labeled **Our version**. The not-connected line stays in the hero, on the first
  screen, above the gallery. "Seen on <site>" and its date stay on every entry.

## The page

1. **Top bar and hero**: unchanged (pill, h1, lede, not-connected line).
2. **Gallery** (`ul.fx-grid`, replaces the jump row `nav.fx-jump`): one card per entry in page order, then the
   "Seen one we should add?" tile. Three columns from 961px, two from 601px, one below. A card holds:
   - a 16:10 preview of our version (light CSS loop, transform and opacity only; it plays only in view, like the
     recipe cards' previews, and holds a still frame under reduced motion), tagged **Our version** and with what
     starts it (Loops, On scroll, On hover, On load, On press);
   - the entry's title as a link to `#<id>` stretched over the card (the press opens the pop-up);
   - one line in our words (at most 90 characters) saying what you see;
   - "Seen on <host> ↗", a link to the entry's site in a new tab (above the stretched link), and "N animations".
3. **Entries**: every `section.fx` stays in the HTML in page order, so the tests, search engines and a reader without
   JavaScript still get the full list. The page script hides the list and shows one entry at a time in the pop-up.
   Each entry gains two parts: **Our version** (stage and player bar, after the heading) and **Good to know**
   (`dl`: Starts, On phones, Reduced motion; each one plain line taken from the entry's prompt).

## The pop-up

- A native `<dialog>` opened with `showModal()`: focus stays inside, Escape and Close shut it, the page behind is
  dimmed. The entry's heading gets focus on open; on close focus returns to the card that opened it.
- Header: "Seen on" line, then Previous, Next and Close (44px buttons). Body in this order: heading, start chip and
  "Made from N animations", the version stage, its player bar, What you see, Good to know, Made from these animations
  (the existing generated recipe cards), the prompt with Copy prompt, and "Watch the real one on <host> ↗".
- Address: opening pushes `#<id>` (Back closes the pop-up); Previous and Next replace it; Close goes back. Arriving at
  `famous/#<id>` opens that entry. Without JavaScript, `#<id>` scrolls to the entry in the list.
- Phones (≤600px or ≤500px tall): the pop-up fills the screen; its top bar (Previous, Next, Close) stays at the top
  while the entry scrolls, and the entry's own Copy prompt sticks to the bottom (no control is shown twice).
- Reduced motion: the pop-up appears without sliding. Light and dark themes both work; the stage is always dark.

## Our versions (`famous/versions/<id>.html`, one per entry)

- A self-contained page (its own CSS and vanilla JS, under about 300 lines), loaded in an `<iframe>` in the stage
  only while its pop-up is open (unloaded on close), titled "Our version: <entry title>", `noindex`. It loads only
  the site font from `assets/fonts/`.
- It follows its entry's prompt to the letter, including the reduced-motion and touch rules, and the CLAUDE.md demo
  rules: fluid at any size from 280px wide, 44px targets, keyboard equivalents, Pointer Events, transform and opacity,
  frame loops by elapsed time, a lighter version on phones, `overscroll-behavior: contain` on its scroller.
- Player bar, by what starts it: Loops: Pause/Play; On load: Replay; On hover and On press: Show me; On scroll: Play
  and Back to top. The bar sends `{fx: 'pause' | 'play' | 'replay' | 'show' | 'top'}` with `postMessage`; the
  version obeys only messages from its parent. On open, a version runs its arrival once (a loop runs, a load plays,
  Show me or Play is pressed once), never under reduced motion.
- What each one shows (our own content, in the site palette):
  | Entry | Our version |
  |---|---|
  | stripe-ribbon | A ribbon of fine glowing strands twisting slowly in depth behind "Your headline", near strands sharp and far ones soft, with fine grain (WebGL, Canvas 2D fallback, fewer strands on phones). |
  | apple-scroll | An abstract visor made of our own layers (glass, frame, two lenses, band) pinned in the box; scrolling lifts the layers out one by one with a caption each, then tips it up to show the lenses; scrolling up rebuilds it. |
  | landonorris-reveal | A night landscape drawn in shapes; a liquid blob follows the pointer with a soft lag and a wobbling edge and shows the same landscape by day inside it. |
  | linear-intro | A hero whose headline comes in line by line from blur to sharp, then the line under it, two buttons and an abstract app window rising with a soft glow. |
  | apple-menu | A top bar whose menu button folds into an X while a frosted panel opens and its links drop in one after another. |
  | wikipedia-previews | A paragraph of our own text whose links show a small preview card after a short pause, kept inside the box. |
  | apple-sweep | A large headline in a scroll box; as it comes into view a band of color sweeps across its letters with the scroll. |
  | spotify-cards | A row of cards with our own abstract covers; the pointed card lightens and a round play button rises into its corner. |
  | youtube-loading | A grid of video cards drawn as gray shapes with a soft shimmer, then filled with content one by one. |
  | pudding-chart | Text steps scrolling past a sticky bar chart of example data that sorts, highlights and changes with each step. |
  | medium-top-bar | An article whose top bar slides away while you scroll down and comes back as soon as you scroll up. |

The table was the plan. Each builder watched its effect on the live site first (the owner asked for motion as close
to the real effect as the law allows) and that check before release rewrote several entries (apple-scroll, linear-intro,
wikipedia-previews, apple-sweep, spotify-cards, youtube-loading, medium-top-bar): each entry's what you see and prompt
are now the reference, and its Seen on date is the day of that check. As built, the "Seen on" line stays the entry's
first line under the pop-up's bar (the bar holds Previous, Next, Close and the short not-connected note), and
`overscroll-behavior: contain` is only on a version that scrolls; a version driven by a finger drag says so with
`data-fx-touch="drag"`.

## Checks

- `tests/famous.test.js`: the jump-row tests become gallery tests (one card per entry in order, title equal to the
  heading, link to `#<id>`, line ≤ 90 characters, host and start equal to the entry's, count equal to its recipe
  cards); each entry has Our version, Good to know and its version file; each version file loads nothing from
  elsewhere but the site font, has `noindex`, a reduced-motion rule and the message handler, and shows no site name.
- `tools/check-pages.mjs`, Famous part only: open every card by keyboard (address, focus on the heading, the version
  loads with no console error, the player button changes the stage), Previous/Next, Escape returns focus to the card,
  arriving at `#<id>` opens it, Copy prompt inside the pop-up, no overflow and 44px targets in the pop-up on phones,
  and under reduced motion every preview and version holds still. Six `ok` lines.
- `tools/make-famous.mjs`, `tools/update-sitemap.mjs` and `tools/make-skill.mjs` stay as they are and are run again.

## Order of work

1. Pilot: the gallery (all 11 cards and previews), the pop-up, and our version of **apple-scroll**. The owner looks.
2. The other ten versions one at a time (a builder, then one careful review), each with its card preview.
3. Tests and the page check pass, CLAUDE.md's Famous section is updated, the owner says yes, then main.
