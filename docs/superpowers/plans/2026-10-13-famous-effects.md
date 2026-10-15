# Famous Effects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Famous effects page (`famous/`) that describes twelve effects people admire on well-known websites in our own words, shows the handbook animations that make something similar with their moving previews, and gives one prompt to build each; reached from the home page's footer and the README, live once the owner approves it.

**Architecture:** One static page, `famous/index.html`, in the home page's look: its entries are plain HTML (`section.fx`, each with the site link, a title, what you see, one to three cards and a prompt), and its own short script runs the previews, the jump links, Copy prompt (with the copy-keys fallback) and the five-line clamp on phones. The previews are the home page's: `tools/make-famous.mjs` copies their CSS and markup from `index.html` into two marked blocks of the page, and `tests/famous.test.js` fails when the blocks drift. The page check gains a `famous` target, the sitemap and `llms.txt` tools list the page, and the home page links it from its footer.

**Tech Stack:** Plain HTML, CSS and vanilla JavaScript (no build, no dependencies); Node 22+ (`node --test`, `node:vm`, an ES-module tool); the repo's Chrome-driven page check (`tools/check-pages.mjs`); the browser pane for the live check of the real sites.

**Spec:** `docs/superpowers/specs/2026-10-13-famous-effects-design.md` and `docs/superpowers/specs/2026-10-13-next-projects-coordination.md` (it wins where they differ). Read both first.

## Global Constraints

- Branch `feat/famous-effects`, cut from `main` (never from `feat/see-inside-compare`); the coordinator merges each reviewed lane into it with `git merge --no-ff` inside `.claude/worktrees/fx-int`. Nothing is pushed before Task 11.
- Lanes: one git worktree each, `.claude/worktrees/fx-<lane>`, on a branch `fx/<lane>` cut from the current `feat/famous-effects`. The main checkout stays on `feat/see-inside-compare` and is never switched.
- The spec, the coordination file and this plan live on `feat/see-inside-compare`: read them in the main checkout, `C:/Users/matin/OneDrive/Desktop/Projects/animation-handbook/docs/superpowers/…`; a worktree cut from `main` does not hold them.
- Run folder (not in the repository): `C:/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.superpowers/sdd/2026-10-14-famous-effects/` (the start date; use the real one if the run starts later): the live-check record, briefs, reports, the ledger and screenshot folders.
- Ports, one server per worktree (`python -m http.server <port> --bind 127.0.0.1` from the worktree root, as a background command, stopped when the task ends): Task 3 → 8931, Task 4 → 8932, Task 5 → 8933, Tasks 7 and 8 → 8934, Task 9 → 8935, Task 10 → 8936; Task 11 uses 8990 in the release worktree.
- Page checks only through the shared pool of eight (the rollout's run folder; the coordinator names another date in the brief if it differs), one command that takes a free slot, runs the check and frees the slot:

```bash
POOL=C:/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.superpowers/sdd/2026-10-14-see-inside-compare/slots; for n in 1 2 3 4 5 6 7 8; do if mkdir "$POOL/slot-$n" 2>/dev/null; then node tools/check-pages.mjs --base http://127.0.0.1:<port> --out <out folder> <target>; rc=$?; rmdir "$POOL/slot-$n"; exit $rc; fi; done; echo "all eight slots are busy: run it again in a minute"; exit 3
```

- Files this project may change (the coordination file's map): new `famous/index.html`, `tools/make-famous.mjs`, `tests/famous.test.js`, `.github/ISSUE_TEMPLATE/famous_effect.yml`; `tools/update-sitemap.mjs`, `tools/make-skill.mjs`, `tests/skill.test.js`; `tests/pages.test.js` (the sitemap count and one new footer test only); `tools/check-pages.mjs` (new functions and blocks; shared lines only to list `famous`: header, usage, the main loop's target dispatch); `index.html` (the footer link, its one CSS rule and its one line for links opened from disk); at integration `README.md` (one line after step 3), `CHANGELOG.md` (one Unreleased line), `CLAUDE.md`, `CONTRIBUTING.md`, `.github/pull_request_template.md`; generated `sitemap.xml` and `llms.txt` by their tools. Never: animation pages, anything in `assets/`, `404.html`, `.github/ISSUE_TEMPLATE/config.yml`, `og-image.png`, `tools/make-social-image.mjs`; `skills/` changes only when `node tools/make-skill.mjs` writes it again after a merge of `main`.
- Generated files (`sitemap.xml`, `llms.txt`, `skills/animation-handbook/`, the two marked blocks of `famous/index.html`) are written by `node tools/update-sitemap.mjs`, `node tools/make-skill.mjs` and `node tools/make-famous.mjs`, never by hand; after any merge take either side and run the tools again.
- Legal rules, binding on every entry: the title, what you see and the prompt in our own words (no sentence, feature name or slogan from a site); the site named in plain text, in the page's own font and colors (no logo, icon, brand color or typeface), and linked to its public page; shown only with the handbook's own demos and previews; nothing from a site in the repository or in posts (no code, screenshots, videos, pictures, icons or logos); the not-connected line above the first entry, on the first screen; nothing that implies approval ("official", "approved", "partner", "as used by"; no company name in the page's title, description or social card); "Seen on <site> in <year>" with the day checked in `datetime`.
- Prompt rules: 60 to 130 words; starts "Add "; at least one [part to fill in], each inside `<mark>`; no code, backtick, `<code>` or `<pre>`; never "Match the settings listed below."; says what happens under reduced motion; names touch, a tap or a finger when the entry starts on hover or press; names no site of the page by name or address; asks for the reader's own colors and content, never a copy of the site.
- Nothing from elsewhere: no `<img>`, `<video>`, `<iframe>`, `<picture>`, `<object>`, `<embed>`, `@import` or `url(http`; every `src` and every stylesheet or icon `href` is a repository file; the page links neither `demo-page.css` nor `demo-page.js`; the only request that leaves the site is the GitHub star count the home page already makes.
- Words: plain words for someone new to animation, American spelling (color, gray, center), no hype, no code on the page.
- Accessibility: landmarks (the top bar's `nav`, `main`, the jump `nav`, the footer) and a skip link to the first entry; headings `h1`, `h2` per entry, `h3` for its two parts, `h4` for card names; site links end "(opens in a new tab)"; previews `aria-hidden`; each Copy prompt names its entry and its label change is announced; text at least 4.5:1 in both themes; every link and button reachable by keyboard with a visible focus ring; hover effects only under `@media(hover:hover)`; on phones every link, chip, card and button at least 44×44px; under reduced motion every preview holds a still frame, jumps do not glide and the message does not slide.
- Live check: only in the browser pane, only while the owner is not reviewing there, logged out. Never sign in, fill in or send a form (a site search too), accept terms or cookies, or download; decline non-essential cookies where a banner asks; screenshots are looked at, never saved.
- Do not use `git stash` (every worktree shares it); compare versions with `git show <rev>:<path> > <scratch file>`.
- Tests: `node --test "tests/*.test.js"` from the worktree root (Node 22 or later). Page check: the pool command above with the target `famous` or `home`; a passing target prints six `ok` lines.
- Commit messages in the repo's style, `feat: …`, `fix: …`, `test: …`, `docs: …`, `chore: …`, in plain words.
- On a usage-limit hit this project pauses first, before the rollout.
- Release only on the owner's word for this project; nothing merges into `main` from 2026-10-23 to 2026-10-26 without the owner's explicit word for that day.

## Phases

- **Setup (coordinator, before Phase A):**

```bash
cd C:/Users/matin/OneDrive/Desktop/Projects/animation-handbook
git worktree add .claude/worktrees/fx-int -b feat/famous-effects main
mkdir -p .superpowers/sdd/2026-10-14-famous-effects
git worktree add .claude/worktrees/fx-tool -b fx/tool feat/famous-effects
git worktree add .claude/worktrees/fx-check -b fx/check feat/famous-effects
git worktree add .claude/worktrees/fx-footer -b fx/footer feat/famous-effects
```

  Later lanes are cut the same way when their phase starts: `fx/frame` (fx-frame), `fx/sitemap` (fx-sitemap), `fx/entries` (fx-entries).
- **Phase A (in parallel, from the start):** Task 1 (live check, browser pane), Task 2 (`tools/make-famous.mjs`), Task 3 (page check target), Task 4 (home footer link). Each lane is merged into `feat/famous-effects` as soon as its review is clean.
- **Phase B (after Tasks 2 and 3 are merged):** Task 5 (the page frame and the issue template). It holds no entry, so it does not wait for the live check (spec §9 step 1: no entry is written before the check).
- **Phase C (after Task 5 is merged):** Task 6 (sitemap and `llms.txt`) in parallel with Task 7 (entries 1 to 6). Task 7 also waits for Task 1's record, read and approved by the coordinator.
- **Phase D (after Task 7 is reviewed):** Task 8 (entries 7 to 12, the count and the pill), in the same lane.
- **Phase E (after Tasks 4, 6 and 8 are merged):** Task 9 (integration, docs, generated files, final review).
- **Phase F:** Task 10 (the owner's review, entries 7 and 8 on the owner's accounts). **Phase G:** Task 11 (release, on the owner's word).

## Reserve entries (used by Tasks 7, 8 and 10)

The spec names three reserves but gives them no text; these drafts follow the same rules (the tests in Tasks 7 and 8 pass on them). A reserve is used only when the live check found it (Task 1's record says `passed`), in order R1, R2, R3, in the place of the entry it replaces, with its chip in that entry's place in the jump row; if the record gives a corrected sentence for it, that sentence replaces the matching one in its What you see. Its `datetime` is the day the record checked it.

**R1 · Rockstar Games: The logo that opens into a window** (chip and section):

```html
    <a href="#rockstar-window">Rockstar Games · logo</a>
```

```html
  <section class="fx" id="rockstar-window" aria-labelledby="rockstar-window-t" data-fx-site="Rockstar Games" data-fx-start="scroll">
    <p class="fx-seen">Seen on <a href="https://www.rockstargames.com/VI" target="_blank" rel="noopener">rockstargames.com/VI<span class="sr"> (opens in a new tab)</span></a> in <time datetime="2026-10-14">2026</time></p>
    <h2 id="rockstar-window-t" tabindex="-1">The logo that opens into a window</h2>
    <p class="fx-what">As you scroll, the large logo in the middle of the screen grows, and the scene behind it shows through its letters like a window. It keeps growing until the window fills the screen and the scene takes over, then the page scrolls on to the next part.</p>
    <h3 class="fx-sub">Made with these animations</h3>
    <div class="fx-cards">
      <article class="card c1" data-slug="zoom-into-image"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">The growing window</span></div><div class="meta"><h4 class="title"><a href="../animations/01-scroll-based/zoom-into-image/">Zoom Into Image</a></h4><p class="desc">A small window opens up to fill the box as you scroll. Best for hero images.</p></div></article>
      <article class="card c1" data-slug="pin-animation"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">It stays put</span></div><div class="meta"><h4 class="title"><a href="../animations/01-scroll-based/pin-animation/">Pin Animation</a></h4><p class="desc">One part stays put while its text changes on scroll. Best for feature lists.</p></div></article>
    </div>
    <h3 class="fx-sub">A prompt to build something similar</h3>
    <div class="fx-pbox"><p class="fx-prompt">Add a scroll-driven window reveal to <mark>[the logo or large title at the top of your page, with a picture or video behind it]</mark>. Pin the section while the visitor scrolls through a few screens of it. At first the scene shows only through the letters of the logo; as they scroll, let the logo grow from its center until the scene fills the whole screen, then let the page scroll on. Grow the logo with a transform, never by changing its size, so it stays smooth. Touch scrolling drives it the same way, and screen readers get the logo as text. If the visitor has reduced motion turned on, show the full scene at once with the logo above it.</p></div>
    <button type="button" class="copy" aria-label="Copy prompt for The logo that opens into a window"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg><span class="copy-l" aria-live="polite">Copy prompt</span></button>
  </section>
```

**R2 · Linear (or Cursor): The card edges that glow near the pointer.** Written for linear.app; if the record found it on cursor.com instead, use the four Cursor lines below in place of the matching ones.

```html
    <a href="#linear-glow">Linear · glow</a>
```

```html
  <section class="fx" id="linear-glow" aria-labelledby="linear-glow-t" data-fx-site="Linear" data-fx-start="hover">
    <p class="fx-seen">Seen on <a href="https://linear.app/" target="_blank" rel="noopener">linear.app<span class="sr"> (opens in a new tab)</span></a> in <time datetime="2026-10-14">2026</time></p>
    <h2 id="linear-glow-t" tabindex="-1">The card edges that glow near the pointer</h2>
    <p class="fx-what">Move the pointer over the grid of feature cards and a soft light follows it, brightening the edges of the cards nearest to it and fading out on the ones farther away, as if a small lamp were passing behind the grid.</p>
    <h3 class="fx-sub">Made with these animations</h3>
    <div class="fx-cards">
      <article class="card c4" data-slug="spotlight-hover"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">The glow</span></div><div class="meta"><h4 class="title"><a href="../animations/04-micro-interactions/spotlight-hover/">Spotlight Hover Glow</a></h4><p class="desc">A soft glow follows the pointer and lights card edges. Best for feature grids.</p></div></article>
    </div>
    <h3 class="fx-sub">A prompt to build something similar</h3>
    <div class="fx-pbox"><p class="fx-prompt">Add a pointer glow to <mark>[the grid of cards on your page]</mark>. As the pointer moves over the grid, a soft round light follows it and brightens the borders of the cards it passes near, strongest at the closest edge and fading with distance, while the cards' contents stay as they are. Draw the light as a gradient that moves with the pointer, not as a blur, and move it at most once per frame. Give the card that has keyboard focus the same lit border. On touch screens, where nothing points, keep the borders plain. If the visitor has reduced motion turned on, light only the border of the card under the pointer, without the moving glow.</p></div>
    <button type="button" class="copy" aria-label="Copy prompt for The card edges that glow near the pointer"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg><span class="copy-l" aria-live="polite">Copy prompt</span></button>
  </section>
```

The Cursor lines (chip, section opening, Seen on, heading):

```html
    <a href="#cursor-glow">Cursor · glow</a>
  <section class="fx" id="cursor-glow" aria-labelledby="cursor-glow-t" data-fx-site="Cursor" data-fx-start="hover">
    <p class="fx-seen">Seen on <a href="https://cursor.com/" target="_blank" rel="noopener">cursor.com<span class="sr"> (opens in a new tab)</span></a> in <time datetime="2026-10-14">2026</time></p>
    <h2 id="cursor-glow-t" tabindex="-1">The card edges that glow near the pointer</h2>
```

**R3 · Apple: The color that sweeps across the headline** (used only after R1 and R2). If the record found the headline on another address of apple.com, write that address in the link and its text (without `https://` and `www.`).

```html
    <a href="#apple-sweep">Apple · sweep</a>
```

```html
  <section class="fx" id="apple-sweep" aria-labelledby="apple-sweep-t" data-fx-site="Apple" data-fx-start="scroll">
    <p class="fx-seen">Seen on <a href="https://www.apple.com/iphone-18-pro/" target="_blank" rel="noopener">apple.com/iphone-18-pro<span class="sr"> (opens in a new tab)</span></a> in <time datetime="2026-10-14">2026</time></p>
    <h2 id="apple-sweep-t" tabindex="-1">The color that sweeps across the headline</h2>
    <p class="fx-what">As the product's headline comes into view, a band of bright color sweeps across its letters once, from one end to the other, and the words settle into their plain color, as if a light had passed over them.</p>
    <h3 class="fx-sub">Made with these animations</h3>
    <div class="fx-cards">
      <article class="card c5" data-slug="text-gradient-animation"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">The color sweep</span></div><div class="meta"><h4 class="title"><a href="../animations/05-text-typography/text-gradient-animation/">Text Gradient Animation</a></h4><p class="desc">Colors flow through the letters while the text stays still. Best for headlines.</p></div></article>
    </div>
    <h3 class="fx-sub">A prompt to build something similar</h3>
    <div class="fx-pbox"><p class="fx-prompt">Add a one-time color sweep to <mark>[the main headline of your section]</mark>. When the headline first comes into view, let a band of bright color travel across its letters once, from the start of the line to its end, and leave the text in its normal color. Paint the band as a gradient inside the letters and move only the gradient, so the words never shift or blur. Keep the sweep short, about a second, and never repeat it while the visitor reads. Keep the text readable before, during and after the sweep. Touch scrolling brings it into view the same way. If the visitor has reduced motion turned on, show the headline in its normal color with no sweep.</p></div>
    <button type="button" class="copy" aria-label="Copy prompt for The color that sweeps across the headline"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg><span class="copy-l" aria-live="polite">Copy prompt</span></button>
  </section>
```

---

### Task 1: Live check of the real sites (browser pane, before any entry is written)

**Files:**
- Create (run folder, not the repository): `.superpowers/sdd/2026-10-14-famous-effects/live-check.md`

**Interfaces:**
- Produces: one section per site checked (entries 1–6 and 9–12, reserves R1–R3), each with `- Checked:` (the day), `- Verdict:` (`confirmed`, `differs`, `not found` or `blocked`; for a reserve `passed` or `failed` follows in Decisions), `- What shows:` (our own words), `- Names and slogans:` (what the site calls the effect or writes beside it, to keep out of our text) and `- Change:` (a corrected sentence of What you see, or `none`); then `## Decisions`. Tasks 7 and 8 write the entries from it, Task 9's legal review reads its names and slogans, Task 10 uses the reserves that passed.

- [ ] **Step 1: Ask for the pane.** The coordinator asks the owner in one line: "May I use the browser pane for about 90 minutes now, to watch the effects on the real sites? You can't review there meanwhile." Start only on a yes; otherwise ask again later. Entries 7 (ChatGPT) and 8 (X) are not checked here: the owner checks them on their own accounts at the review (Task 10).

- [ ] **Step 2: Start the record**

```markdown
# Live check of the Famous effects (2026-10-14)

Logged out, in the browser pane, at 1280px wide unless a step says otherwise. No screenshot was saved; nothing from the
sites is copied here but the names and slogans to keep out of our text. Entries 7 and 8: the owner, at the review.
```

- [ ] **Step 3: Rules for every site.** Open each address with `mcp__Claude_Browser__navigate` (the first call opens the pane). Look with `mcp__Claude_Browser__computer` (`screenshot`, `scroll`, `hover`, `wait`) or `mcp__Claude_Browser__browser_batch` for quick sequences. A cookie banner: choose "Reject", "Decline" or "Necessary only"; if there is none, close it with its close button or leave it; never accept. A sign-in wall, an age check or any form: stop, verdict `blocked`. Never type into a site, never sign in, never download. Write each site's section right after watching it:

```markdown
## <n> · <id> — <address>
- Checked: 2026-10-14
- Verdict: confirmed | differs | not found | blocked
- What shows: <one to three sentences in our own words>
- Names and slogans: <what the site calls the effect or writes beside it, or none>
- Change: <a corrected sentence of What you see in our own words, or none>
```

- [ ] **Step 4: 1 · stripe-ribbon — https://stripe.com/.** Wait 5 s at the top; take two screenshots 2 s apart. Confirmed when a thick ribbon of colored light twists slowly in depth behind the headline, partly blurred, under grain. A flat gradient or a still picture only: `differs` (say which).

- [ ] **Step 5: 2 · apple-scroll — https://www.apple.com/apple-vision-pro/.** Scroll down three wheel ticks at a time through the first screens, screenshot after each, then scroll back up. Confirmed when the headset stays in the middle while its parts rise out layer by layer, it tips up to show its lenses, scrolling back puts it together, and the phrase beside it turns from gray to white.

- [ ] **Step 6: 3 · landonorris-reveal — https://landonorris.com/.** Wait for the page to finish its opening; `hover` at six points across the large portrait, a screenshot after each. Confirmed when a soft, liquid-looking blob under the pointer shows a second picture (his racing helmet).

- [ ] **Step 7: 4 · linear-intro — https://linear.app/.** In one `browser_batch`: navigate, screenshot, wait 0.5 s, screenshot, wait 0.5 s, screenshot, wait 1 s, screenshot. Confirmed when the headline's words appear in turn, each rising out of a blur, then the line under it, the buttons and a picture of the app tilted slightly back come into focus the same way.

- [ ] **Step 8: 5 · apple-menu — https://www.apple.com/.** At 1280px: `hover` a top item (Store) and screenshot twice, 0.2 s apart: a panel grows down, its links appear in turn and the page behind blurs. Then `mcp__Claude_Browser__resize_window` with `preset: "mobile"`, reload, press the two-line menu button and screenshot twice: it folds into an X while the menu fills the screen and its links drop in one after another. Reset with `preset: "desktop"`.

- [ ] **Step 9: 6 · wikipedia-previews — https://en.wikipedia.org/wiki/Animation.** `hover` a link in the article text for 1 s, screenshot, move the pointer away, screenshot. Confirmed when a small card with the linked article's first lines and picture fades in under the link, rising slightly, and fades out after.

- [ ] **Step 10: 9 · spotify-cards — https://open.spotify.com/.** `hover` an album or playlist card on Home, screenshot. Confirmed when the card lightens and a round green play button fades in, rising into the cover's bottom corner.

- [ ] **Step 11: 10 · youtube-loading — https://www.youtube.com/.** The pane cannot slow the network, so watch the page while it loads content of its own. Navigate, then run this with `mcp__Claude_Browser__javascript_tool` at once, to record the gray placeholder shapes and whether they move:

```js
window.__shapes = [];
new MutationObserver(() => {
  for (const el of document.querySelectorAll('[class*="skeleton" i], [class*="ghost" i], [class*="placeholder" i], [class*="shimmer" i]')) {
    if (el.__seen) continue;
    el.__seen = true;
    window.__shapes.push({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 80),
      moving: el.getAnimations({ subtree: true }).map(a => a.animationName || a.transitionProperty || 'script').join(' ') });
  }
}).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
'observing';
```

Then press the YouTube logo and, separately, a video thumbnail (both load new content inside the page), screenshot at once and after 0.3 s each time, and read `JSON.stringify(window.__shapes.slice(0, 20))`. Confirmed when gray boxes and bars in the shapes of thumbnails, round channel pictures and titles show before the videos; write in What shows whether they stay still, pulse or have a light sweeping over them. If no placeholder is ever seen, `not found`.

- [ ] **Step 12: 11 · pudding-chart — https://pudding.cool/2025/11/democracy/.** Scroll through the story three ticks at a time, screenshot after each, then scroll back. Confirmed when a chart of dots stays on screen while short paragraphs scroll past, each changing which dots light up, and scrolling back undoes each step.

- [ ] **Step 13: 12 · medium-top-bar — https://medium.com/tag/web-design.** Open a free article from the list (no star beside it). Scroll down ten ticks, screenshot; scroll up one tick, screenshot. Confirmed when the top bar slides up out of the way as you scroll down and comes back on a small scroll up.

- [ ] **Step 14: R1 · rockstar-window — https://www.rockstargames.com/VI.** Scroll three ticks at a time through the first screens, screenshot after each. Passed when the large logo works as a window that grows as you scroll until the scene behind it fills the screen. An age check: `blocked`.

- [ ] **Step 15: R2 · glow — https://linear.app/ then https://cursor.com/.** On each, find a grid of feature cards on the home page and `hover` across it at four points, screenshot after each. Passed on the first site where a soft light follows the pointer and lights the edges of the nearby cards; write which site in the heading line.

- [ ] **Step 16: R3 · apple-sweep — https://www.apple.com/iphone-18-pro/.** If that address does not open, take the current iPhone Pro page from apple.com's iPhone menu and write its address. Scroll to the first large headline, screenshot three times 0.3 s apart. Passed when a band of color sweeps across the headline once.

- [ ] **Step 17: Decisions, then give the pane back.** Close the tabs you opened (`mcp__Claude_Browser__tabs_close`). Add:

```markdown
## Decisions
- Written as in the plan: <entry numbers>
- Rewritten (the Change sentence replaces the matching sentence of What you see): <entry numbers, or none>
- Swapped (failed entry → reserve that passed, in its place): <for example "10 → R1", or none>
- Reserves that passed, in order: R1 <passed|failed>, R2 <passed on linear.app|passed on cursor.com|failed>, R3 <passed|failed>
- Day of the check: 2026-10-14
```

An entry whose verdict is `not found` or `blocked` is swapped for the next reserve that passed; an entry that `differs` only in a detail one sentence states is rewritten with its Change sentence; one that differs in the effect itself is swapped.

- [ ] **Step 18: Check the record is complete**

Run: `grep -c "^- Verdict: " C:/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.superpowers/sdd/2026-10-14-famous-effects/live-check.md`
Expected: `13` (ten entries and three reserves), and the file ends with `## Decisions`. The coordinator reads the record and approves the decisions; if any entry is rewritten or swapped, they tell the owner in one short line. Nothing is committed (the run folder is not in the repository).

---

### Task 2: `tools/make-famous.mjs`, the tool that copies the previews

**Files:**
- Create: `tools/make-famous.mjs`
- Create: `tests/famous.test.js` (the tool's section; Tasks 5, 7 and 8 add the page's sections)

**Interfaces:**
- Produces (exports of `tools/make-famous.mjs`): `CSS_START`, `CSS_END`, `JS_START`, `JS_END` (the marker lines); `homeConst(home, name)` (a `const NAME=` literal of the home page's script, read with `vm`); `previewBlocks(home, slugs) → { css, data }`; `replaceBetween(text, start, end, inner) → text`; `cardSlugs(page) → string[]`; `buildFamousFrom(home, page) → page text`; `buildFamous(root) → { 'famous/index.html': text }` (LF line endings, writes nothing). Run as a command it rewrites the two blocks of `famous/index.html`, keeping its line endings.
- The marker lines, each alone on its line at column 0: in the page's `<style>`, `/* ── previews: written by tools/make-famous.mjs from the home page; run it again, never edit by hand ── */` … `/* ── end of previews ── */`; in its `<script>`, `// ── previews: written by tools/make-famous.mjs from the home page; run it again, never edit by hand ──` … `// ── end of previews ──`.
- The data block is `const PREVIEWS={` + one line per card slug in page order (each once) `"<slug>":{"pv":"<key>","still":<0..1>,"markup":"<html with <\/ escaped>"}` + `};`. Drift is detected by `tests/famous.test.js` comparing `buildFamous(ROOT)['famous/index.html']` with the file (Task 5).

- [ ] **Step 1: Write the failing tests.** Create `tests/famous.test.js`:

```js
// Checks the Famous effects page (famous/index.html) and the tool that writes its previews (tools/make-famous.mjs), from
// docs/superpowers/specs/2026-10-13-famous-effects-design.md: first the tool on a small stand-in home page, then the page.
// Run from the repo root: node --test "tests/*.test.js"
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const ROOT = path.resolve(__dirname, '..');
const TOOL = 'node tools/make-famous.mjs';
const tool = () => import(pathToFileURL(path.join(ROOT, 'tools', 'make-famous.mjs')).href);

// ---------- The tool, on a stand-in home page ----------
// What the tool reads, in small: the accent classes and the base preview rules; a comment that holds a brace and a rule; a
// @property; a preview with a data URI that holds url(…); a rule shared with a preview the page does not show; a preview whose
// key only starts like a shown one; keyframes used and unused; a phone rule beside another page's rule; the reduced-motion
// rule; and CATS, PV, pvMarkup(), engines and STILL.
const FIXTURE_HOME = `<style>
:root{--c1:#6ea8ff}
.c1{--accent:var(--c1)}.c2{--accent:var(--c2)}.c3{--accent:var(--c3)}.c4{--accent:var(--c4)}.c5{--accent:var(--c5)}.c6{--accent:var(--c6)}.c7{--accent:var(--c7)}
.pv{position:absolute;inset:0}
/* a comment with a brace { and a rule .pv-aaa{color:red} inside */
.pv *{will-change:transform}
.card:not(.playing) .pv .anim,.card:not(.playing) .pv .anim::before,.card:not(.playing) .pv .anim::after{animation-play-state:paused!important}
@property --p{syntax:'<percentage>';inherits:false;initial-value:0%}
.pv-aaa{background:url("data:image/svg+xml,%3Csvg filter='url(%23m)'%3E")}
.pv-aaa .x{animation:spin-a 2s linear infinite;--p:10%}
.pv-aaab{background:#111}
.pv-bbb,.pv-zzz{color:red}
@keyframes spin-a{to{transform:rotate(360deg)}}
@keyframes unused{to{opacity:0}}
@media(max-width:600px){.pv-aaa .x{width:5px}.other{color:blue}}
@media(prefers-reduced-motion:reduce){
  .pv .anim,.pv .anim::before,.pv .anim::after{animation-play-state:paused!important}
}
</style>
<script>
const CATS=[{name:'One',cat:'c1-cat',n:'01',folder:'animations/01-one',entries:[['first','First','Line one.'],['second','Second','Line two.'],['third','Third','Line three.'],['fourth','Fourth','Line four.']]}];
const PV={'first':'aaa','second':'bbb','third':'ccc'};
function pvMarkup(k){
  switch(k){
    case 'aaa': return '<span class="x anim"></span>';
    case 'bbb': return '<b class="anim">B</b>';
    case 'ccc': return '';
    default: return '';
  }
}
const engines={ccc:pv=>make(pv,1,true)};
const STILL={bbb:.7};
</script>`;

test('make-famous: the CSS block holds the base rules and, for each preview shown, its rules, its keyframes and the @property it uses', async () => {
  const { previewBlocks } = await tool();
  const lines = previewBlocks(FIXTURE_HOME, ['first', 'second']).css.split('\n');
  for (const line of ['.c1{--accent:var(--c1)}', '.c7{--accent:var(--c7)}', '.pv{position:absolute;inset:0}', '.pv *{will-change:transform}',
    '.card:not(.playing) .pv .anim,.card:not(.playing) .pv .anim::before,.card:not(.playing) .pv .anim::after{animation-play-state:paused!important}',
    '@media(prefers-reduced-motion:reduce){.pv .anim,.pv .anim::before,.pv .anim::after{animation-play-state:paused!important}}',
    "@property --p{syntax:'<percentage>';inherits:false;initial-value:0%}",
    `.pv-aaa{background:url("data:image/svg+xml,%3Csvg filter='url(%23m)'%3E")}`, '.pv-aaa .x{animation:spin-a 2s linear infinite;--p:10%}',
    '@keyframes spin-a{to{transform:rotate(360deg)}}', '@media(max-width:600px){.pv-aaa .x{width:5px}}', '.pv-bbb{color:red}']) {
    assert.ok(lines.includes(line), `the CSS block has the line ${line}`);
  }
  const css = lines.join('\n');
  for (const absent of ['.pv-aaab', '.pv-zzz', 'unused', '.other', '.pv-aaa{color:red}']) assert.ok(!css.includes(absent), `no ${absent}`);
});

test('make-famous: the PREVIEWS block gives each card once, in page order, with its preview key, still point and markup', async () => {
  const { previewBlocks } = await tool();
  assert.equal(previewBlocks(FIXTURE_HOME, ['first', 'second', 'first']).data, ['const PREVIEWS={',
    '"first":{"pv":"aaa","still":0.5,"markup":"<span class=\\"x anim\\"><\\/span>"},',
    '"second":{"pv":"bbb","still":0.7,"markup":"<b class=\\"anim\\">B<\\/b>"}',
    '};'].join('\n'));
  assert.equal(previewBlocks(FIXTURE_HOME, []).data, 'const PREVIEWS={\n};', 'no cards, an empty object');
});

test('make-famous: a card that is not on the home page, or whose preview needs a script or has no markup, stops the tool', async () => {
  const { previewBlocks } = await tool();
  assert.throws(() => previewBlocks(FIXTURE_HOME, ['third']), /needs a script engine/);
  assert.throws(() => previewBlocks(FIXTURE_HOME, ['fourth']), /has no markup/);
  assert.throws(() => previewBlocks(FIXTURE_HOME, ['nowhere']), /not a card on the home page/);
});

test('make-famous: the blocks go between their marker lines, a second run changes nothing, and a missing or doubled marker stops it', async () => {
  const { buildFamousFrom, replaceBetween, CSS_START, CSS_END, JS_START, JS_END } = await tool();
  const page = ['<style>', 'body{margin:0}', CSS_START, 'old css', CSS_END, '</style>', '<article class="card c1" data-slug="second">',
    '<script>', JS_START, 'const PREVIEWS={};', JS_END, 'go();', '</script>'].join('\n');
  const once = buildFamousFrom(FIXTURE_HOME, page);
  assert.equal(buildFamousFrom(FIXTURE_HOME, once), once, 'a second run changes nothing');
  assert.ok(once.includes(`${CSS_START}\n/* the base`), 'the CSS starts right after its first marker');
  assert.ok(once.includes(`.pv-bbb{color:red}\n${CSS_END}`), 'and ends right before its last');
  assert.ok(once.includes(`${JS_START}\nconst PREVIEWS={\n"second":`) && once.includes(`};\n${JS_END}\ngo();`), 'the data between its markers');
  assert.ok(!once.includes('old css'), 'what was between the markers is gone');
  assert.throws(() => replaceBetween('no markers here', CSS_START, CSS_END, 'x'), /must each be there once/);
  assert.throws(() => replaceBetween(CSS_START + CSS_END + CSS_START, CSS_START, CSS_END, 'x'), /must each be there once/);
});
```

- [ ] **Step 2: Run them and see them fail**

Run: `node --test tests/famous.test.js`
Expected: four FAILs with `ERR_MODULE_NOT_FOUND` (`tools/make-famous.mjs` does not exist).

- [ ] **Step 3: Write `tools/make-famous.mjs`**

```js
#!/usr/bin/env node
// Writes the previews of the Famous effects page (famous/index.html) from the home page: a development tool, not part of the
// site (docs/superpowers/specs/2026-10-13-famous-effects-design.md, section 4).
// Run it from the repo root after changing the page's cards, or a preview they show on the home page: its key in PV, its case
// in pvMarkup(), its rules or keyframes, or its STILL point. tests/famous.test.js fails until then.
// Usage: node tools/make-famous.mjs
//   It reads the cards of famous/index.html (data-slug on <article class="card cN">, in page order) and, from index.html,
//   CATS, PV, STILL, pvMarkup() and engines (the previews a script draws, which this page has no room for) from its script,
//   and from its style the base preview rules (BASE below), every rule that names a preview the page shows (.pv-<key>, inside
//   @media too, keeping only the parts of a shared selector that name it), the @keyframes those rules and the preview's
//   markup name, and the @property rules they use. It rewrites the text between the two marker lines of each block in
//   famous/index.html: the CSS (CSS_START … CSS_END) and the PREVIEWS object (JS_START … JS_END), which gives each card its
//   preview key, markup and still point. It keeps the page's line endings, writes only when the text changed and prints what
//   it wrote; running it twice changes nothing. buildFamous(root), exported for the test, returns
//   { 'famous/index.html': text } with LF line endings and writes nothing.
// Exit code 1 when a card is not on the home page, its preview needs a script, has no markup or animates in SVG, a base rule
// or a preview's rules cannot be found, or a marker line is missing or written twice.
import { existsSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

export const CSS_START = '/* ── previews: written by tools/make-famous.mjs from the home page; run it again, never edit by hand ── */';
export const CSS_END = '/* ── end of previews ── */';
export const JS_START = '// ── previews: written by tools/make-famous.mjs from the home page; run it again, never edit by hand ──';
export const JS_END = '// ── end of previews ──';
// The home page's rules every preview needs: each category's accent color, the preview box, and its animations paused unless
// its card plays; and, under reduced motion, paused always.
const BASE = ['.c1', '.c2', '.c3', '.c4', '.c5', '.c6', '.c7', '.pv', '.pv *',
  '.card:not(.playing) .pv .anim,.card:not(.playing) .pv .anim::before,.card:not(.playing) .pv .anim::after'];
const BASE_REDUCED = '.pv .anim,.pv .anim::before,.pv .anim::after';
const REDUCED = '@media(prefers-reduced-motion:reduce)';

// Where the bracket that opens at text[from] ('[' or '{') is closed, stepping over strings and // comments (as the tests
// read the home page).
function blockEnd(text, from) {
  const open = text[from], close = open === '[' ? ']' : '}';
  let depth = 0, i = from, quote = null;
  for (; i < text.length; i++) {
    const ch = text[i];
    if (quote) { if (ch === '\\') i++; else if (ch === quote) quote = null; continue; }
    if (ch === '/' && text[i + 1] === '/') { while (i < text.length && text[i] !== '\n') i++; continue; }
    if (ch === "'" || ch === '"' || ch === '`') quote = ch;
    else if (ch === open) depth++;
    else if (ch === close && --depth === 0) break;
  }
  return i;
}
// The value of `const NAME=` in the home page's script: an array or object literal of plain data, read with vm.
export function homeConst(home, name) {
  const start = home.indexOf(`const ${name}=`);
  if (start < 0) throw new Error(`index.html has no const ${name}=`);
  const from = start + `const ${name}=`.length;
  return vm.runInNewContext('(' + home.slice(from, blockEnd(home, from) + 1) + ')');
}
// A function of the home page's script, `function NAME(…){…}`, read with vm (pvMarkup uses no page state).
function homeFunction(home, name) {
  const start = home.indexOf(`function ${name}(`);
  if (start < 0) throw new Error(`index.html has no function ${name}(`);
  return vm.runInNewContext('(' + home.slice(start, blockEnd(home, home.indexOf('{', start)) + 1) + ')');
}
// The previews the home page draws with a script (its engines object): their keys, before each ":" at the top level.
function engineKeys(home) {
  const start = home.indexOf('const engines={');
  if (start < 0) throw new Error('index.html has no const engines={');
  const from = start + 'const engines='.length, keys = [];
  let depth = 0, part = '';
  for (const ch of home.slice(from + 1, blockEnd(home, from)) + ',') {
    if ('({['.includes(ch)) depth++;
    else if (')}]'.includes(ch)) depth--;
    if (ch === ',' && depth === 0) { keys.push(part.split(':')[0].trim()); part = ''; } else part += ch;
  }
  return keys.filter(Boolean);
}
// The style without its comments; a comment mark inside a string (a data URI) does not count.
function stripComments(css) {
  let out = '', quote = null;
  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    if (quote) { out += ch; if (ch === '\\') out += css[++i] ?? ''; else if (ch === quote) quote = null; continue; }
    if (ch === '"' || ch === "'") { quote = ch; out += ch; continue; }
    if (ch === '/' && css[i + 1] === '*') { const end = css.indexOf('*/', i + 2); i = end < 0 ? css.length : end + 1; continue; }
    out += ch;
  }
  return out;
}
// Where the next of the characters in stops is, outside strings (css.length when there is none).
function next(css, from, stops) {
  let quote = null;
  for (let i = from; i < css.length; i++) {
    const ch = css[i];
    if (quote) { if (ch === '\\') i++; else if (ch === quote) quote = null; continue; }
    if (ch === '"' || ch === "'") quote = ch;
    else if (stops.includes(ch)) return i;
  }
  return css.length;
}
const squeeze = s => s.replace(/\s*\n\s*/g, ' ').trim();
// A style (comments already gone) as its top-level items: { kind: 'rule', selector, body } or { kind: 'at', name, head, inner,
// items }, where items are the rules inside an @media or @supports block.
function parseCss(css) {
  const items = [];
  for (let i = 0; i < css.length;) {
    const open = next(css, i, '{;}');
    if (open >= css.length) break;
    const head = css.slice(i, open).trim().replace(/\s+/g, ' ');
    if (css[open] !== '{') { i = open + 1; continue; }
    let depth = 1, j = open + 1;
    while (depth) {
      j = next(css, j, '{}');
      if (j >= css.length) throw new Error(`index.html: the style is not closed after "${head}"`);
      depth += css[j] === '{' ? 1 : -1;
      j++;
    }
    const inner = css.slice(open + 1, j - 1);
    if (head.startsWith('@')) {
      const name = head.slice(1).match(/^[\w-]+/)[0];
      items.push({ kind: 'at', name, head, inner: squeeze(inner), items: name === 'media' || name === 'supports' ? parseCss(inner) : [] });
    } else items.push({ kind: 'rule', selector: head, body: squeeze(inner) });
    i = j;
  }
  return items;
}
// The parts of a selector list, split at its top-level commas.
function parts(selector) {
  const out = [];
  let depth = 0, part = '';
  for (const ch of selector + ',') {
    if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth--;
    if (ch === ',' && depth === 0) { out.push(part.trim()); part = ''; } else part += ch;
  }
  return out;
}
// The parts of a selector list that name the preview key (".pv-mesh", not ".pv-meshy"), joined again; '' when none does.
const picked = (selector, key) => parts(selector).filter(p => new RegExp(`\\.pv-${key}(?![\\w-])`).test(p)).join(',');

// The two blocks for the cards with these slugs (in page order): { css, data }.
export function previewBlocks(home, slugs) {
  const CATS = homeConst(home, 'CATS'), PV = homeConst(home, 'PV'), STILL = homeConst(home, 'STILL');
  const pvMarkup = homeFunction(home, 'pvMarkup'), engines = engineKeys(home);
  const previews = [];
  for (const slug of new Set(slugs)) {
    const cat = CATS.find(c => c.entries.some(e => e[0] === slug));
    if (!cat) throw new Error(`famous/index.html: ${slug} is not a card on the home page`);
    const pv = PV[slug] || 'sig' + parseInt(cat.n, 10);
    if (engines.includes(pv)) throw new Error(`famous/index.html: ${slug} shows the preview ${pv}, which needs a script engine this page does not have`);
    const markup = pvMarkup(pv);
    if (!markup) throw new Error(`famous/index.html: ${slug} shows the preview ${pv}, which has no markup`);
    if (/<animate\b/.test(markup)) throw new Error(`famous/index.html: ${slug} shows the preview ${pv}, which animates in SVG (the home page takes that out under reduced motion; this page does not)`);
    previews.push({ slug, pv, still: STILL[pv] ?? 0.5, markup, name: cat.entries.find(e => e[0] === slug)[1] });
  }
  const items = parseCss(stripComments([...home.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n')));
  const one = (list, selector, where) => {
    const found = list.filter(it => it.kind === 'rule' && it.selector === selector);
    if (found.length !== 1) throw new Error(`index.html: ${found.length} rules for ${selector}${where}, not 1`);
    return `${selector}{${found[0].body}}`;
  };
  const named = name => items.filter(it => it.kind === 'at' && it.name === name).map(it => ({ id: it.head.split(' ')[1], text: `${it.head}{${it.inner}}` }));
  const keyframes = named('keyframes'), properties = named('property');
  const reduced = items.filter(it => it.kind === 'at' && it.head.replace(/\s+/g, '') === REDUCED).flatMap(it => it.items);
  // Each preview: a comment naming it, its rules (inside @media too, only the parts of the selector that name it), and the
  // keyframes that its rules or its markup name.
  const drawn = [...new Set(previews.map(p => p.pv))].map(key => {
    const own = [];
    for (const it of items) {
      if (it.kind === 'rule') { const sel = picked(it.selector, key); if (sel) own.push(`${sel}{${it.body}}`); }
      else if (it.name === 'media' || it.name === 'supports') {
        const inner = it.items.filter(r => r.kind === 'rule' && picked(r.selector, key)).map(r => `${picked(r.selector, key)}{${r.body}}`);
        if (inner.length) own.push(`${it.head}{${inner.join('')}}`);
      }
    }
    if (!own.length) throw new Error(`index.html: no rule draws the preview ${key}`);
    const words = new Set((own.join(' ') + ' ' + previews.find(p => p.pv === key).markup).split(/[\s,:;(){}"'=]+/));
    const who = previews.filter(p => p.pv === key).map(p => p.name).join(', ');
    return [`/* ${key}: ${who} */`, ...own, ...keyframes.filter(k => words.has(k.id)).map(k => k.text)];
  });
  const all = drawn.flat().join('\n') + previews.map(p => p.markup).join('\n');
  const css = ["/* the base: each category's accent color, the preview box, and its animations paused unless its card plays */",
    ...BASE.map(selector => one(items, selector, '')),
    `${REDUCED}{${one(reduced, BASE_REDUCED, ' under reduced motion')}}`,
    ...properties.filter(p => new RegExp(`${p.id}(?![\\w-])`).test(all)).map(p => p.text),
    ...drawn.flat()].join('\n');
  const data = ['const PREVIEWS={',
    ...previews.map((p, i) => JSON.stringify(p.slug) + ':' + JSON.stringify({ pv: p.pv, still: p.still, markup: p.markup }).replace(/<\//g, '<\\/') + (i < previews.length - 1 ? ',' : '')),
    '};'].join('\n');
  return { css, data };
}

// The text with what lies between the start and end marker lines replaced by inner (each marker there once, in that order).
export function replaceBetween(text, start, end, inner) {
  const a = text.indexOf(start), b = a < 0 ? -1 : text.indexOf(end, a + start.length);
  if (a < 0 || b < 0 || text.indexOf(start, a + start.length) >= 0) throw new Error(`famous/index.html: the lines "${start}" and "${end}" must each be there once, in that order`);
  return text.slice(0, a + start.length) + '\n' + inner + '\n' + text.slice(b);
}
// The slugs of the page's cards, in page order.
export const cardSlugs = page => [...page.matchAll(/<article class="card c[1-7]" data-slug="([a-z0-9-]+)">/g)].map(m => m[1]);
// The page with both blocks written from the home page.
export function buildFamousFrom(home, page) {
  const { css, data } = previewBlocks(home, cardSlugs(page));
  return replaceBetween(replaceBetween(page, CSS_START, CSS_END, css), JS_START, JS_END, data);
}
export function buildFamous(root) {
  const file = join(root, 'famous', 'index.html');
  if (!existsSync(file)) throw new Error('famous/index.html is missing');
  const home = readFileSync(join(root, 'index.html'), 'utf8').replace(/\r\n/g, '\n');
  return { 'famous/index.html': buildFamousFrom(home, readFileSync(file, 'utf8').replace(/\r\n/g, '\n')) };
}

// Run as a command, not imported by the test. The command's path is compared with its real path, so a run through a junction
// or a link counts too.
const self = (() => { try { return realpathSync(process.argv[1]); } catch { return ''; } })();
if (self.toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  const ROOT = fileURLToPath(new URL('..', import.meta.url));
  try {
    const file = join(ROOT, 'famous', 'index.html');
    const text = buildFamous(ROOT)['famous/index.html'];
    const old = readFileSync(file, 'utf8');
    const out = old.includes('\r\n') ? text.replace(/\n/g, '\r\n') : text;
    if (out !== old) writeFileSync(file, out);
    const previews = (text.match(/^"[a-z0-9-]+":\{"pv":/gm) || []).length;
    console.log(`famous/index.html: ${cardSlugs(text).length} cards, ${previews} previews${out === old ? '' : ' (written)'}`);
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  }
}
```

- [ ] **Step 4: Run the tests and see them pass**

Run: `node --test tests/famous.test.js`
Expected: 4 tests pass.
Run: `node --test "tests/*.test.js"`
Expected: every test passes (the other test files are untouched).

- [ ] **Step 5: Commit**

```bash
git add tools/make-famous.mjs tests/famous.test.js
git commit -m "feat: tools/make-famous.mjs copies the home page's previews (their rules, keyframes and markup) into two marked blocks of the Famous effects page, with tests on a stand-in home page"
```

---

### Task 3: Page check — the `famous` target

**Files:**
- Modify: `tools/check-pages.mjs` (header comment lines 4-9; usage message line 66; after `homeCheck`, line 138; STARS comment line 152; after `homeMotionProblems`, line 908; STARS registration line 957; main loop lines 961, 978, 980, 1000 and after 1011)

**Interfaces:**
- Consumes (markup of Tasks 5, 7 and 8): `section.fx` entries with `h2`; `.fx-jump a[href="#id"]`; `.fx .card[data-slug]` with `.stage` and `.pv`; `.fx .copy` with `.copy-l`; `.fx-prompt`; `#toast .toast-t`; `h1`, `.fx-lede`, `.fx-legal`; the page script's labels `Copied`, `Press Ctrl+C to copy` and the name `Copied the prompt for <title>`.
- Produces: `node tools/check-pages.mjs [--base URL] famous` checks `famous/` at the six setups; new functions `famousCheck`, `scrollSettled`, `famousJumpProblems`, `famousStageShot`, `famousPreviewProblems`, `famousCopyProblems`, `changedShare`, `famousMotionProblems`; screenshots `famous-<setup>.png` and `famous-desktop-full.png`.

- [ ] **Step 1: See the target missing.** Serve this worktree on port 8931 (background) and run the pool command with the target `famous` and `--out C:/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.superpowers/sdd/2026-10-14-famous-effects/check-t3-before`.
Expected: six FAIL lines with `not a guided-steps page` and `What it is is missing` (the target is unknown, so the run treats `famous/` as a demo page, and there is no page yet).

- [ ] **Step 2: Header and usage.** The edits below anchor on the lines as they read on main (line numbers on main in brackets; they shift as you insert). Replace the usage line `// Usage: node tools/check-pages.mjs [--base http://127.0.0.1:8731] [--out <folder>] <page or category folder, or home>...` (line 4) with:

```js
// Usage: node tools/check-pages.mjs [--base http://127.0.0.1:8731] [--out <folder>] <page or category folder, home or famous>...
```

After the line `//   tile, the slim bar and long words; the reduced-motion run checks that nothing moves.` (line 9) add:

```js
//   node tools/check-pages.mjs famous   checks the Famous effects page (famous/) at the same six setups: overflow, small
//   targets on phones (every link, chip, card and button), and the title, the lede and the not-connected line on the first
//   screen. The desktop run also presses each jump link, watches each entry's previews move and presses each Copy prompt,
//   once more with the clipboard refused; the reduced-motion run checks that nothing moves, that every preview holds a still
//   frame that shows something and that a jump does not glide. Like home, it stores a star count first.
```

Replace the line `  console.error('Usage: node tools/check-pages.mjs [--base URL] [--out DIR] <page or category folder, or home>...');` (line 66) with:

```js
  console.error('Usage: node tools/check-pages.mjs [--base URL] [--out DIR] <page or category folder, home or famous>...');
```

and the first line of the STARS comment, `// Runs at the start of every document when the run checks the home page: stores a GitHub star count in the home page's own` (line 152), with:

```js
// Runs at the start of every document when the run checks the home page or the Famous effects page: stores a GitHub star count in the home page's own
```

- [ ] **Step 3: The in-page check.** After the line `})()\`;` that closes `homeCheck` (line 138, right before the comment `// Runs at the start of every document, before the page's own scripts: records each press of a Show me button…`) add:

```js

// Runs inside the Famous effects page (famous/). Returns its problems: overflow, small targets on phones (every link, chip,
// card and button, the site links and the link inside a sentence too), and the title, the lede and the not-connected line on
// the first screen (the setups marked firstScreen: 1280×800 and 375×812). A page with no entries is a problem of its own, so
// the desktop steps never pass on an empty page.
const famousCheck = firstScreen => `(() => {
  const r = el => el.getBoundingClientRect();
  const phone = innerWidth <= 600;
  const problems = [];
  if (!document.querySelector('section.fx')) problems.push('no entries (section.fx): not the Famous effects page, or not built yet');
  if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1) problems.push('horizontal overflow');
  if (phone) {
    const small = [...document.querySelectorAll('.top a, .top button, .fx-jump a, .fx-seen a, .fx-what a, .fx .card, .fx .copy, .fx-toggle, .fx-suggest, .foot a')]
      .filter(el => el.getClientRects().length)
      .filter(el => { const b = r(el); return b.width < 44 || b.height < 44; })
      .map(el => el.tagName.toLowerCase() + (el.getAttribute('class') ? '.' + el.getAttribute('class').split(' ')[0] : '') + ' ' + Math.round(r(el).width) + 'x' + Math.round(r(el).height));
    if (small.length) problems.push('small targets: ' + small.join(', '));
  }
  for (const [what, el] of [['title', document.querySelector('h1')], ['lede', document.querySelector('.fx-lede')], ['not-connected line', document.querySelector('.fx-legal')]]) {
    if (!el) problems.push('no ' + what);
    else if (${firstScreen} && r(el).bottom > innerHeight) problems.push('the ' + what + ' is below the first screen');
  }
  return { problems };
})()`;
```

- [ ] **Step 4: The famous steps.** After the closing `}` of `homeMotionProblems` (line 908), right before the comment `// The end of the run, done once: after the last page, after Ctrl+C and after an error outside the main flow.`, add:

```js

// Famous effects: waits until the page holds still (scrollY the same over three checks 100 ms apart, for up to 3 s).
const scrollSettled = () => evaluate(`new Promise(done => { let last = scrollY, same = 0, left = 30;
  const tick = () => { same = scrollY === last ? same + 1 : 0; last = scrollY; if (same >= 3 || !--left) done(); else setTimeout(tick, 100); };
  setTimeout(tick, 100); })`);

// Famous effects, desktop run: each link of the jump row, pressed as the keyboard presses it (focus, then activate) from the
// top of the page, brings its entry's heading fully into the window, gives that heading keyboard focus and names the entry in
// the address.
async function famousJumpProblems() {
  const hrefs = await evaluate(`[...document.querySelectorAll('.fx-jump a')].map(a => a.getAttribute('href'))`);
  if (!hrefs.length) return ['no links in the jump row'];
  const problems = [];
  for (const href of hrefs) {
    await evaluate(`(() => { scrollTo(0, 0); const a = document.querySelector('.fx-jump a[href="${href}"]'); a.focus(); a.click(); })()`);
    await scrollSettled();
    const got = await evaluate(`(() => { const s = document.querySelector('${href}'), h = s && s.querySelector('h2');
      if (!h) return null;
      const b = h.getBoundingClientRect();
      return { top: Math.round(b.top), shown: b.top >= 0 && b.bottom <= innerHeight, focus: document.activeElement === h, hash: location.hash }; })()`);
    if (!got) problems.push(`jump to ${href}: no entry with that id, or no heading in it`);
    else if (!got.shown || !got.focus || got.hash !== href) problems.push(`jump to ${href}: ${JSON.stringify(got)}`);
  }
  return problems;
}

// Famous effects: a PNG (base64) of the stage of a card (an expression that finds the card in the page), where the page is
// scrolled now.
async function famousStageShot(card) {
  const box = await evaluate(`(() => { const b = ${card}.querySelector('.stage').getBoundingClientRect();
    return { x: b.left + scrollX, y: b.top + scrollY, width: b.width, height: b.height }; })()`);
  return (await send('Page.captureScreenshot', { format: 'png', clip: { ...box, scale: 1 } })).data;
}

// Famous effects, desktop run: with an entry's cards in the middle of the window, each card's preview moves (its picture
// changes within 3 s); once the last entry is in view, the first entry's previews have stopped, since a preview plays only
// while it is on screen.
async function famousPreviewProblems() {
  const ids = await evaluate(`[...document.querySelectorAll('section.fx')].map(s => s.id)`);
  if (!ids.length) return ['no entries to play'];
  const problems = [];
  for (const id of ids) {
    const cards = await evaluate(`(async () => { const s = document.getElementById('${id}'), row = s.querySelector('.fx-cards');
      if (!row) return 0;
      row.scrollIntoView({ block: 'center' });
      await new Promise(r => setTimeout(r, 400));
      return s.querySelectorAll('.card').length; })()`);
    if (!cards) { problems.push(`${id}: no cards`); continue; }
    for (let i = 0; i < cards; i++) {
      const card = `document.querySelectorAll('#${id} .card')[${i}]`;
      const first = await famousStageShot(card);
      let moved = false;
      for (const end = Date.now() + 3000; !moved && Date.now() < end;) { await sleep(200); moved = (await famousStageShot(card)) !== first; }
      if (!moved) problems.push(`${id}: the preview of ${await evaluate(`${card}.dataset.slug`)} does not move while on screen`);
    }
  }
  const still = await evaluate(`document.querySelector('section.fx').querySelectorAll('.card.playing').length`);
  if (ids.length > 1 && still) problems.push(`the first entry's previews keep playing while it is off screen (${still} cards)`);
  return problems;
}

// Famous effects, desktop run: each entry's Copy prompt, pressed for real at its center (scrolled into view, the pointer moved
// onto it, then a mouse press and release), puts exactly that entry's prompt on the clipboard (stubbed: a headless run cannot
// grant it), reads "Copied", says so in its name and shows the message. Then the browser refuses the clipboard: the first
// entry's press selects its prompt and the button asks for Ctrl+C.
async function famousCopyProblems() {
  const ids = await evaluate(`[...document.querySelectorAll('section.fx')].map(s => s.id)`);
  if (!ids.length) return ['no entries to copy'];
  const problems = [];
  const press = async id => {
    const spot = await evaluate(`(() => { const btn = document.querySelector('#${id} .copy'); if (!btn) return null;
      btn.scrollIntoView({ block: 'center' });
      const b = btn.getBoundingClientRect(), x = b.left + b.width / 2, y = b.top + b.height / 2, hit = document.elementFromPoint(x, y);
      return { x, y, covered: btn.contains(hit) ? '' : hit ? hit.tagName.toLowerCase() + (hit.getAttribute('class') ? '.' + hit.getAttribute('class').split(' ')[0] : '') : 'nothing' }; })()`);
    if (!spot) return 'no Copy prompt button';
    if (spot.covered) return `Copy prompt is covered by ${spot.covered} at its center`;
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: spot.x, y: spot.y, button: 'none' });
    for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: spot.x, y: spot.y, button: 'left', clickCount: 1 });
    return '';
  };
  const prompt = id => `document.querySelector('#${id} .fx-prompt').textContent.replace(/\\s+/g, ' ').trim()`;
  await evaluate(`(() => { navigator.clipboard.writeText = async text => { window.__clipboardGot = text; }; })()`);
  for (const id of ids) {
    await evaluate(`window.__clipboardGot = null`);
    const trouble = await press(id);
    if (trouble) { problems.push(`${id}: ${trouble}`); continue; }
    const got = await evaluate(`(async () => {
      for (let i = 0; i < 60 && window.__clipboardGot === null; i++) await new Promise(r => setTimeout(r, 50));
      await new Promise(r => setTimeout(r, 50));
      const btn = document.querySelector('#${id} .copy'), title = document.querySelector('#${id} h2').textContent;
      return { same: window.__clipboardGot === ${prompt(id)}, label: btn.textContent.trim(), named: (btn.getAttribute('aria-label') || '') === 'Copied the prompt for ' + title,
        toast: document.getElementById('toast').classList.contains('show') && document.querySelector('#toast .toast-t').textContent === 'Prompt copied. Paste it into your AI assistant.' };
    })()`);
    if (!got.same || got.label !== 'Copied' || !got.named || !got.toast) problems.push(`${id}: Copy prompt ${JSON.stringify(got)}`);
  }
  await evaluate(`(() => { navigator.clipboard.writeText = async () => { throw new DOMException('denied', 'NotAllowedError'); }; getSelection().removeAllRanges(); })()`);
  const trouble = await press(ids[0]);
  if (trouble) problems.push(`${ids[0]}, clipboard refused: ${trouble}`);
  else {
    const refused = await evaluate(`(async () => { const btn = document.querySelector('#${ids[0]} .copy');
      for (let i = 0; i < 60 && !btn.textContent.includes('Ctrl+C'); i++) await new Promise(r => setTimeout(r, 50));
      return { label: btn.textContent.trim(), selected: getSelection().toString().replace(/\\s+/g, ' ').trim() === ${prompt(ids[0])} }; })()`);
    if (refused.label !== 'Press Ctrl+C to copy' || !refused.selected) problems.push(`${ids[0]}, clipboard refused: ${JSON.stringify(refused)} (expected "Press Ctrl+C to copy" and the prompt selected)`);
  }
  return problems;
}

// Famous effects: the pixels that differ by more than 48 (red, green and blue summed) between two captures of the same size
// (base64 PNG), as their share of the picture and the shares of its width and of its height that the box around them takes.
// homeMotionProblems does the same inline for the home page; this copy serves the Famous effects page, so that one stays as it is.
const changedShare = (a, b) => evaluate(`new Promise(done => {
  const load = src => new Promise(resolve => { const img = new Image(); img.onload = () => resolve(img); img.src = 'data:image/png;base64,' + src; });
  Promise.all([load(${JSON.stringify(a)}), load(${JSON.stringify(b)})]).then(([x, y]) => {
    const read = img => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0); return g.getImageData(0, 0, c.width, c.height).data; };
    const p = read(x), q = read(y), w = x.width, h = x.height;
    let changed = 0, left = w, right = -1, top = h, bottom = -1;
    for (let i = 0; i < p.length; i += 4) {
      if (Math.abs(p[i] - q[i]) + Math.abs(p[i + 1] - q[i + 1]) + Math.abs(p[i + 2] - q[i + 2]) <= 48) continue;
      const px = (i / 4) % w, py = Math.floor(i / 4 / w);
      changed++; left = Math.min(left, px); right = Math.max(right, px); top = Math.min(top, py); bottom = Math.max(bottom, py);
    }
    done({ share: changed / (w * h), wide: changed ? (right - left + 1) / w : 0, tall: changed ? (bottom - top + 1) / h : 0 });
  });
})`);

// Famous effects, reduced-motion phone run: nothing runs (every animation in the page is paused), neither at once nor once
// every card has been on screen; every preview holds a still frame that shows something (the home check's pixel test: the
// stage captured with the preview and again with the preview's contents hidden must differ in at least 0.3% of its pixels,
// inside a box of at least 1% of it); and a jump does not glide: two frames after the press, the entry's heading is in the
// window.
async function famousMotionProblems() {
  const problems = [];
  const running = when => evaluate(`document.getAnimations().filter(a => a.playState === 'running').map(a => {
    const t = a.effect && a.effect.target, card = t && t.closest && t.closest('.card');
    return (a.animationName || a.transitionProperty || 'an animation') + ' on ' + (card ? card.dataset.slug : t ? t.tagName.toLowerCase() : 'the page');
  })`).then(found => { if (found.length) problems.push(`reduced motion: ${found.length} animations run ${when} (${[...new Set(found)].slice(0, 8).join(', ')})`); });
  await running('at once');
  const frames = n => `new Promise(done => { let left = ${n}; const tick = () => (--left ? requestAnimationFrame(tick) : done()); requestAnimationFrame(tick); })`;
  const cards = await evaluate(`document.querySelectorAll('section.fx .card').length`);
  if (!cards) return [...problems, 'reduced motion: no cards'];
  const empty = [];
  for (let i = 0; i < cards; i++) {
    const card = `document.querySelectorAll('section.fx .card')[${i}]`;
    await evaluate(`(async () => { ${card}.querySelector('.stage').scrollIntoView({ block: 'center' }); await ${frames(2)}; })()`);
    const drawn = await famousStageShot(card);
    await evaluate(`(async () => { for (const el of ${card}.querySelector('.pv').children) el.style.visibility = 'hidden'; await ${frames(2)}; })()`);
    const bare = await famousStageShot(card);
    await evaluate(`{ for (const el of ${card}.querySelector('.pv').children) el.style.visibility = ''; }`);
    const seen = await changedShare(drawn, bare);
    if (seen.share < .003 || seen.wide * seen.tall < .01) {
      empty.push(`${await evaluate(`${card}.dataset.slug`)} (${(seen.share * 100).toFixed(2)}% of the stage, in a box of ${Math.round(seen.wide * 100)}% × ${Math.round(seen.tall * 100)}%)`);
    }
  }
  if (empty.length) problems.push(`reduced motion: ${empty.length} previews show nothing: ${empty.join(', ')}`);
  await running('once every card has been on screen');
  const jump = await evaluate(`(async () => { scrollTo(0, 0); const links = document.querySelectorAll('.fx-jump a'), a = links[links.length - 1];
    if (!a) return null;
    a.focus(); a.click(); await ${frames(2)};
    const h = document.querySelector(a.getAttribute('href') + ' h2'), b = h.getBoundingClientRect();
    return { href: a.getAttribute('href'), shown: b.top >= 0 && b.bottom <= innerHeight, top: Math.round(b.top) }; })()`);
  if (!jump) problems.push('reduced motion: no links in the jump row');
  else if (!jump.shown) problems.push(`reduced motion: the jump to ${jump.href} glides (two frames after the press its heading is at ${jump.top}px)`);
  return problems;
}
```

- [ ] **Step 5: List `famous` in the main loop.** The line `  if (pages.includes('home')) await send('Page.addScriptToEvaluateOnNewDocument', { source: STARS });` (line 957) becomes:

```js
  if (pages.includes('home') || pages.includes('famous/')) await send('Page.addScriptToEvaluateOnNewDocument', { source: STARS });
```

After the line `    const home = page === 'home';` (line 961) add:

```js
    const famous = page === 'famous/';
```

The line `        const result = await evaluate(home ? homeCheck(!!setup.firstScreen) : CHECK);` (line 978) becomes:

```js
        const result = await evaluate(home ? homeCheck(!!setup.firstScreen) : famous ? famousCheck(!!setup.firstScreen) : CHECK);
```

The two lines `        if (!home) {` in the main loop (lines 980 and 1000) each become:

```js
        if (!home && !famous) {
```

After the closing `        }` of the block that starts `        if (home) {` (line 1011, right before `      } catch (err) {`) add:

```js
        if (famous) {
          if (setup.moves) {
            problems.push(...await famousJumpProblems());
            problems.push(...await famousPreviewProblems());
            problems.push(...await famousCopyProblems());
          }
          if (setup.name === 'phone-reduced') problems.push(...await famousMotionProblems());
        }
```

- [ ] **Step 6: Check the syntax and that nothing else changed**

Run: `node --check tools/check-pages.mjs` — expected: no output.
Run the pool command with the target `home` on port 8931 — expected: six `ok` lines (the home checks are untouched).
Run it with the target `famous` and `--out C:/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.superpowers/sdd/2026-10-14-famous-effects/check-t3-after` — expected: six FAIL lines, each listing `no entries (section.fx): not the Famous effects page, or not built yet`, `no lede` and `no not-connected line` (there is no page in this worktree, so the server's error page stands in, and a console line about its 404 may follow); the desktop line also lists `no links in the jump row; no entries to play; no entries to copy`, the phone-reduced line `reduced motion: no cards`. This shows the target is wired; Tasks 5 and 7 run it on the real page. Stop the server.

- [ ] **Step 7: Commit**

```bash
git add tools/check-pages.mjs
git commit -m "feat: the page check's famous target checks the Famous effects page at six setups: first screen, touch targets, each jump link, each entry's previews and Copy prompt, and still previews under reduced motion"
```

---

### Task 4: The home page's footer links the Famous effects page

**Files:**
- Modify: `index.html` (CSS after line 257; footer nav line 1536; script after line 2312)
- Test: `tests/pages.test.js` (a new test at the end, after line 857)

**Interfaces:**
- Produces: `<a class="lnk" href="famous/">Famous effects</a>` first in `footer.wrap.foot nav.nav`; opened from disk it names `famous/index.html`; the footer's links wrap on the narrowest phones.

- [ ] **Step 1: Write the failing test** at the end of `tests/pages.test.js`:

```js

// The Famous effects page (famous/) is reached from the home page's footer until the tab pass adds it to the top bar
// (docs/superpowers/specs/2026-10-13-famous-effects-design.md); opened from disk, the link names famous/index.html, as the
// cards name their pages' index.html. With three links the footer's row wraps on the narrowest phones.
test('the home page footer links the Famous effects page', () => {
  const footer = between(HOME, '<footer class="wrap foot">', '</footer>');
  assert.equal(count(footer, '<a class="lnk" href="famous/">Famous effects</a>'), 1, 'one Famous effects link in the footer');
  assert.ok(HOME.includes(`if(FROM_DISK)document.querySelectorAll('a[href="famous/"]').forEach(a=>a.setAttribute('href','famous/index.html'));`),
    'opened from disk, the link opens famous/index.html');
  assert.ok(cssRules(between(HOME, '<style>', '</style>')).some(rule => rule.selector === '.foot .nav' && /(^|;)\s*flex-wrap:\s*wrap/.test(rule.body)),
    'the footer links wrap on the narrowest phones');
});
```

- [ ] **Step 2: Run it and see it fail**

Run: `node --test tests/pages.test.js`
Expected: the new test FAILS with "one Famous effects link in the footer" (0 !== 1); every other test passes.

- [ ] **Step 3: Edit `index.html`.** After line 257 (`.foot-t{font-size:15px;color:var(--muted)}`) add:

```css
.foot .nav{flex-wrap:wrap} /* three links: on the narrowest phones the last one moves to a second line */
```

Replace the footer's links, line 1536 (`  <nav class="nav" aria-label="Footer"><a class="lnk" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener">GitHub</a><a class="lnk" href="#top">Back to top</a></nav>`), with:

```html
  <nav class="nav" aria-label="Footer"><a class="lnk" href="famous/">Famous effects</a><a class="lnk" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener">GitHub</a><a class="lnk" href="#top">Back to top</a></nav>
```

After line 2312 (`if(FROM_DISK)document.querySelectorAll('a.brand').forEach(a=>a.setAttribute('href','index.html'));`) add:

```js
if(FROM_DISK)document.querySelectorAll('a[href="famous/"]').forEach(a=>a.setAttribute('href','famous/index.html'));
```

- [ ] **Step 4: Run all tests**

Run: `node --test "tests/*.test.js"`
Expected: every test passes.

- [ ] **Step 5: Home page check.** Serve this worktree on port 8932 and run the pool command with the target `home` and `--out C:/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.superpowers/sdd/2026-10-14-famous-effects/check-t4`.
Expected: six `ok` lines (the footer's three links are 44px tall on phones and wrap at 320px without overflow). Look at the bottom of `home-desktop-full.png`: Famous effects, GitHub and Back to top in one row. (The phone screenshots show only the first screen; at 375px and 320px the check itself measures the footer's links and the page's width.) Stop the server.

- [ ] **Step 6: Commit**

```bash
git add index.html tests/pages.test.js
git commit -m "feat: the home page's footer links the Famous effects page (from disk, its index.html), and its links wrap on the narrowest phones"
```

---

### Task 5: The page frame and the issue template

**Files:**
- Create: `famous/index.html` (the frame: head, top bar, head, an empty jump row, Seen one we should add?, footer, message, script; no entries)
- Create: `.github/ISSUE_TEMPLATE/famous_effect.yml`
- Modify: `tests/famous.test.js` (append the frame section)

**Interfaces:**
- Consumes: Task 2's `tools/make-famous.mjs` (`buildFamous`, `CSS_START`, `CSS_END`); Task 3's `famous` target.
- Produces: the page's structure that Tasks 7 and 8 fill: `<nav class="fx-jump" aria-label="Effects on this page">` followed on the next line by `  </nav>` (chips go between); `  <section class="fx-more" aria-labelledby="fx-more-t">` (entries go before it, each followed by a blank line); the skip link `<a class="skip" href="#stripe-ribbon">Skip to the first effect</a>`; the pill `<p class="pill">12 effects from well-known websites</p>`; the page script, which fills each `.fx .card[data-slug]` from `PREVIEWS`, runs jumps for `a[href^="#"]` to a `section.fx`, adds the clamp toggle after each `.fx-prompt` and wires each `.fx .copy`.

- [ ] **Step 1: Write the failing tests.** Append to `tests/famous.test.js`:

```js

// ---------- The page: its frame ----------
const FILE = path.join(ROOT, 'famous', 'index.html');
// A file's text with Windows line endings read as plain ones: a checkout may hold either.
const read = f => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
const PAGE = read(FILE);
const HOME = read(path.join(ROOT, 'index.html'));
const LIVE = 'https://matinmonshizadeh.github.io/animation-handbook/';
const REPO = 'https://github.com/matinmonshizadeh/animation-handbook';
const TEMPLATE = `${REPO}/issues/new?template=famous_effect.yml`;
const TITLE = 'Famous effects — Animation Handbook';
const LEDE = 'Effects people admire on well-known websites, the handbook animations that make something similar, and a prompt to build your own.';
const LEGAL = "The Animation Handbook is not connected to any of these sites or their owners, and none of them has reviewed or approved this page. Each effect is described in our own words and shown only with the handbook's own demos.";
// The sites the page may name (the twelve entries and the reserves): none belongs in its title or description.
const SITE_NAMES = ['Stripe', 'Apple', 'Lando Norris', 'Linear', 'Wikipedia', 'ChatGPT', 'OpenAI', 'x.com', 'Spotify', 'YouTube', 'Pudding', 'Medium', 'Rockstar', 'Cursor'];
const count = (s, sub) => s.split(sub).length - 1;
// The part of s from the first `from` up to the next `to` after it ('' when `from` is missing).
const between = (s, from, to) => {
  const start = s.indexOf(from);
  if (start < 0) return '';
  const end = s.indexOf(to, start + from.length);
  return s.slice(start, end < 0 ? undefined : end);
};
const decode = s => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
// The words a piece of markup shows: tags dropped, entities decoded, white space squeezed (as the page's Copy prompt reads it).
const textOf = html => decode(html.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();
const meta = attr => { const m = PAGE.match(new RegExp(`<meta ${attr} content="([^"]*)">`)); return m && decode(m[1]); };
// What a visitor reads: the page without its scripts and styles.
const MARKUP = PAGE.replace(/<script\b[\s\S]*?<\/script>/g, '').replace(/<style\b[\s\S]*?<\/style>/g, '');
const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Whether a link or source of famous/index.html names a file of the repository (a folder stands for its index.html).
const isRepoFile = ref => {
  const bare = ref.replace(/[?#].*$/, '');
  if (/^[a-z][a-z0-9+.-]*:/i.test(bare) || bare.startsWith('/')) return false;
  const file = path.resolve(ROOT, 'famous', bare || '.');
  return fs.existsSync(bare === '' || bare.endsWith('/') ? path.join(file, 'index.html') : file);
};

test('famous/index.html: one title and one description for search and social sites, with no company name in them', () => {
  assert.equal(count(PAGE, '<title>'), 1, 'one title');
  assert.ok(PAGE.includes(`<title>${TITLE}</title>`), 'the title');
  for (const attr of ['property="og:title"', 'name="twitter:title"']) assert.equal(meta(attr), TITLE, attr);
  for (const attr of ['name="description"', 'property="og:description"', 'name="twitter:description"']) assert.equal(meta(attr), LEDE, attr);
  assert.ok(PAGE.includes('<h1 class="h1">Famous effects</h1>'), 'the heading');
  assert.ok(PAGE.includes(`<p class="fx-lede">${LEDE}</p>`), 'the lede under it');
  assert.match(PAGE, /<p class="pill">\d+ effects from well-known websites<\/p>/, 'the pill');
  for (const name of SITE_NAMES) assert.ok(!new RegExp(`\\b${escapeRe(name)}\\b`, 'i').test(`${TITLE} ${LEDE}`), `no "${name}" in the title or description`);
});

test('famous/index.html: canonical and og:url are its live address, and it shares the site\'s picture', () => {
  assert.ok(PAGE.includes(`<link rel="canonical" href="${LIVE}famous/">`), 'canonical');
  assert.equal(meta('property="og:url"'), `${LIVE}famous/`);
  for (const attr of ['property="og:image"', 'name="twitter:image"']) assert.equal(meta(attr), `${LIVE}og-image.png`, attr);
});

test('the top bar is the home page\'s, with Famous effects marked as this page', () => {
  const bar = between(PAGE, '<header class="wrap top" id="top">', '</header>');
  for (const part of ['<a class="brand" href="../">', '<a class="lnk" href="../?view=all">Browse all</a>', '<a class="lnk" href="./" aria-current="page">Famous effects</a>',
    '<button type="button" class="icon-btn theme-btn" id="theme-toggle" aria-label="Switch between light and dark">',
    `<a class="gh" id="gh-stars" href="${REPO}" target="_blank" rel="noopener">`]) assert.ok(bar.includes(part), part);
  assert.equal(count(MARKUP, 'aria-current='), 1, 'one current page');
});

test('the light and dark colors and the theme switch are the home page\'s', () => {
  const block = (html, selector) => {
    const css = between(html, '<style>', '</style>'), at = css.indexOf(`${selector}{`);
    assert.ok(at >= 0, selector);
    return css.slice(at, css.indexOf('}', at) + 1).replace(/\s+/g, '');
  };
  for (const selector of [':root', ':root[data-theme="dark"]']) assert.equal(block(PAGE, selector), block(HOME, selector), selector);
  assert.ok(PAGE.includes(HOME.match(/function setTheme\(t\)\{[^\n]*\}/)[0]), 'the same setTheme as the home page');
});

test('the not-connected line is on the page once, word for word, above the jump row and every entry', () => {
  assert.equal(count(PAGE, LEGAL), 1, 'once');
  assert.ok(PAGE.includes(`<p class="fx-legal">${LEGAL}</p>`), 'in its own paragraph');
  const at = PAGE.indexOf(LEGAL);
  assert.ok(at < PAGE.indexOf('<nav class="fx-jump"'), 'above the jump row');
  assert.ok(PAGE.indexOf('<section class="fx"') < 0 || at < PAGE.indexOf('<section class="fx"'), 'above the first entry');
});

test('the page loads nothing from elsewhere, uses only the site\'s font in its own style and shows no code', async () => {
  const { CSS_START, CSS_END } = await tool();
  for (const bad of ['<img', '<video', '<iframe', '<picture', '<object', '<embed', '@import', 'url(http']) assert.ok(!PAGE.includes(bad), bad);
  assert.ok(!/demo-page\.(css|js)/.test(PAGE), 'it links neither shared file');
  for (const [, src] of PAGE.matchAll(/\ssrc="([^"]*)"/g)) assert.ok(isRepoFile(src), `src ${src}`);
  for (const [tag] of PAGE.matchAll(/<link\b[^>]*>/g)) {
    if (!/\srel="(stylesheet|icon|apple-touch-icon)"/.test(tag)) continue;
    const href = tag.match(/\shref="([^"]*)"/)[1];
    assert.ok(isRepoFile(href), `link ${href}`);
  }
  const css = between(PAGE, '<style>', '</style>').replace(/url\(\s*(["'])data:[\s\S]*?\1\s*\)/g, '');
  for (const [, ref] of css.matchAll(/url\(\s*['"]?([^'")\s]+)/g)) assert.ok(isRepoFile(ref), `url(${ref})`);
  const own = css.slice(0, css.indexOf(CSS_START)) + css.slice(css.indexOf(CSS_END));
  for (const [, family] of own.matchAll(/font-family:([^;}]+)/g)) assert.match(family.trim(), /^(var\(--disp\)|var\(--text\)|'Schibsted Grotesk')$/, `font-family:${family}`);
  assert.ok(!/`|<code|<pre/.test(MARKUP), 'no backtick, <code> or <pre> outside <script> and <style>');
});

test('the only links that leave the site are the entries\' sites, the GitHub repository and its issue template, each in a new tab', () => {
  const sites = new Set([...PAGE.matchAll(/<p class="fx-seen">Seen on <a href="([^"]+)"/g)].map(m => m[1]));
  for (const [tag, href] of PAGE.matchAll(/<a\b[^>]*\shref="(https?:[^"]*)"[^>]*>/g)) {
    assert.ok(href === REPO || href === TEMPLATE || sites.has(href), `a link that leaves the site: ${href}`);
    assert.match(tag, /\starget="_blank" rel="noopener"/, `${href} opens in a new tab`);
  }
});

test('every link inside the site opens a file of the repository, and from disk a folder link opens its index.html', () => {
  for (const [, href] of PAGE.matchAll(/<a\b[^>]*\shref="([^"]*)"/g)) {
    if (/^https?:/.test(href) || href.startsWith('#')) continue;
    assert.ok(isRepoFile(href), href);
  }
  assert.ok(PAGE.includes("if(location.protocol==='file:')document.querySelectorAll('a[href]').forEach(a=>{"), 'opened from disk, folder links name index.html');
});

test('the footer is the home page\'s, without the count', () => {
  const foot = between(PAGE, '<footer class="wrap foot">', '</footer>');
  assert.ok(foot.includes('<p class="foot-t">Web animations with live demos and copyable prompts.</p>'), 'its line, with no number');
  assert.ok(foot.includes(`<a class="lnk" href="${REPO}" target="_blank" rel="noopener">GitHub</a><a class="lnk" href="#top">Back to top</a>`), 'its links');
  assert.ok(!/\d/.test(textOf(foot)), 'no number in the footer');
});

test('the page script copies, falls back to the copy keys, shortens prompts on phones and shows the message, in the words of the animation pages and the home page', () => {
  const script = [...PAGE.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n');
  const shared = read(path.join(ROOT, 'assets', 'js', 'demo-page.js'));
  for (const words of ['Show the full prompt', 'Show less', 'Press ⌘C to copy', 'Press Ctrl+C to copy']) {
    assert.ok(script.includes(`'${words}'`), `the page says "${words}"`);
    assert.ok(shared.includes(`'${words}'`), `as the animation pages do: "${words}"`);
  }
  assert.ok(script.includes("toast('Prompt copied. Paste it into your AI assistant.')") && HOME.includes("toast('Prompt copied. Paste it into your AI assistant.')"), 'the home page\'s message');
  for (const words of ["'Copy prompt'", "'Copied'"]) assert.ok(script.includes(words), words);
  assert.ok(PAGE.includes('<div class="toast" id="toast" role="status" aria-live="polite">'), 'the message box');
});

test('Seen one we should add? opens the Famous effect issue template, which asks for the site and what you see in your own words, with no screenshots or code', () => {
  assert.ok(PAGE.includes(`<a class="fx-suggest" href="${TEMPLATE}" target="_blank" rel="noopener">Suggest it on GitHub<span class="sr"> (opens in a new tab)</span></a>`), 'the Suggest link');
  assert.ok(PAGE.includes('<p class="fx-note">Each entry was checked by hand on the date shown; a site may have changed since.</p>'), 'the note on dates');
  const yml = read(path.join(ROOT, '.github', 'ISSUE_TEMPLATE', 'famous_effect.yml'));
  assert.match(yml, /^name: Famous effect$/m, 'its name');
  const field = id => yml.split('\n  - type: ').find(part => part.includes(`\n    id: ${id}\n`)) || '';
  for (const id of ['address', 'what']) assert.match(field(id), /\n {4}validations:\n {6}required: true/, `${id} is required`);
  assert.match(yml, /no screenshots, videos or code from the site/i, 'no screenshots or code from the site');
});

test('the two preview blocks are what tools/make-famous.mjs writes from the home page now', async () => {
  const { buildFamous } = await tool();
  assert.ok(buildFamous(ROOT)['famous/index.html'] === PAGE, `famous/index.html is out of date: run ${TOOL}`);
});
```

- [ ] **Step 2: Run them and see them fail**

Run: `node --test tests/famous.test.js`
Expected: the file FAILS with `ENOENT` for `famous\index.html` (the page does not exist yet).

- [ ] **Step 3: Create `famous/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Famous effects — Animation Handbook</title>
<meta name="description" content="Effects people admire on well-known websites, the handbook animations that make something similar, and a prompt to build your own.">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#f8f7f4">
<link rel="canonical" href="https://matinmonshizadeh.github.io/animation-handbook/famous/">
<link rel="icon" type="image/png" sizes="96x96" href="../favicon.png">
<link rel="icon" type="image/svg+xml" href="../favicon.svg">
<link rel="apple-touch-icon" href="../apple-touch-icon.png">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="Animation Handbook">
<meta property="og:title" content="Famous effects — Animation Handbook">
<meta property="og:description" content="Effects people admire on well-known websites, the handbook animations that make something similar, and a prompt to build your own.">
<meta property="og:url" content="https://matinmonshizadeh.github.io/animation-handbook/famous/">
<meta property="og:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Famous effects — Animation Handbook">
<meta name="twitter:description" content="Effects people admire on well-known websites, the handbook animations that make something similar, and a prompt to build your own.">
<meta name="twitter:image" content="https://matinmonshizadeh.github.io/animation-handbook/og-image.png">
<script>
// The theme is the visitor's own pick (ah-theme), else the system's, as on the home page.
function setTheme(t){document.documentElement.dataset.theme=t;document.querySelector('meta[name="theme-color"]').content=t==='dark'?'#0e0e11':'#f8f7f4';}
(function(){var t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';try{t=localStorage.getItem('ah-theme')||t;}catch(e){}setTheme(t);})();</script>
<style>
@font-face{font-family:'Schibsted Grotesk';src:url('../assets/fonts/schibsted-latin-ext.woff2') format('woff2');font-weight:400 900;font-display:swap;unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:'Schibsted Grotesk';src:url('../assets/fonts/schibsted-latin.woff2') format('woff2');font-weight:400 900;font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}

/* the home page's colors and type, copied as they are (tests/famous.test.js compares them) */
:root{
  --bg:#f8f7f4;--surface:#ffffff;--ink:#16161b;--ink-2:#45454f;--muted:#676771;
  --line:#e5e3dc;--line-2:#efede8;--brand:#2f5bea;--ok:#157a43;
  --shadow:0 1px 2px rgba(22,22,27,.04),0 8px 24px rgba(22,22,27,.06);
  --shadow-2:0 2px 4px rgba(22,22,27,.05),0 18px 40px rgba(22,22,27,.11);
  --c1:#6ea8ff;--c2:#5fd88a;--c3:#b98cff;--c4:#ff9d5c;--c5:#ff6f8b;--c6:#3fd6c4;--c7:#ffce5a;
  --disp:'Schibsted Grotesk',system-ui,-apple-system,'Segoe UI',sans-serif;--text:var(--disp);
  --ease:cubic-bezier(.22,1,.36,1);--gut:clamp(16px,4vw,40px);
  color-scheme:light;
}
:root[data-theme="dark"]{
  --bg:#0e0e11;--surface:#17171c;--ink:#f4f4f2;--ink-2:#c6c6cc;--muted:#9c9ca5;
  --line:rgba(255,255,255,.13);--line-2:rgba(255,255,255,.07);--brand:#86a8ff;
  --shadow:0 1px 2px rgba(0,0,0,.3),0 8px 24px rgba(0,0,0,.25);
  --shadow-2:0 2px 4px rgba(0,0,0,.35),0 18px 40px rgba(0,0,0,.45);
  color-scheme:dark;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
[hidden]{display:none!important}
html,body{background:var(--bg);color:var(--ink)}
body{font-family:var(--text);font-size:16px;line-height:1.5;-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:inherit}
button{font:inherit;color:inherit}
:focus-visible{outline:3px solid var(--brand);outline-offset:3px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.skip{position:absolute;left:16px;top:-80px;z-index:100;padding:10px 16px;border-radius:10px;background:var(--ink);color:var(--bg);font-weight:700;text-decoration:none}
.skip:focus{top:12px}
.i{width:18px;height:18px;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.wrap{width:min(1280px,calc(100% - 2 * var(--gut)));margin-inline:auto}

/* the top bar and the footer: the home page's */
.top{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:76px}
.brand{display:inline-flex;align-items:center;gap:12px;min-height:44px;text-decoration:none;font-size:17px;font-weight:800;letter-spacing:-.015em;white-space:nowrap}
.mark{width:30px;height:30px;flex:none}
.mark .ring{fill:var(--bg);stroke:currentColor;stroke-width:1.8}
.mark .ball{fill:currentColor}
.nav{display:flex;align-items:center;gap:6px}
.lnk{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 14px;border-radius:999px;text-decoration:none;font-size:15px;font-weight:600;color:var(--ink-2);white-space:nowrap}
.lnk[aria-current="page"]{color:var(--ink);background:var(--line-2)}
.icon-btn{display:inline-grid;place-items:center;width:44px;height:44px;border-radius:999px;border:0;background:none;color:var(--ink-2);cursor:pointer}
.theme-btn .sun,:root[data-theme="dark"] .theme-btn .moon{display:none}
:root[data-theme="dark"] .theme-btn .sun{display:block}
.gh{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 16px;border-radius:999px;border:1px solid var(--line);background:var(--surface);text-decoration:none;font-size:15px;font-weight:600;white-space:nowrap}
.gh-c{color:var(--muted);font-variant-numeric:tabular-nums}
.foot{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px 24px;padding:36px 0 44px}
.foot-t{font-size:15px;color:var(--muted)}

/* one centered column: the head, the jump row, the entries and the suggestion */
.fx-page{width:min(1040px,calc(100% - 2 * var(--gut)));margin-inline:auto}
.fx-head{display:flex;flex-direction:column;align-items:center;text-align:center;padding-top:clamp(16px,4vw,48px)}
.pill{display:inline-flex;align-items:center;padding:8px 16px;border-radius:999px;background:var(--surface);border:1px solid var(--line);font-size:14px;font-weight:600;color:var(--ink-2)}
.h1{margin-top:22px;font-size:clamp(34px,5.2vw,64px);font-weight:800;line-height:1.04;letter-spacing:-.035em}
.fx-lede{margin-top:18px;max-width:640px;font-size:clamp(16px,1.4vw,19px);line-height:1.55;color:var(--ink-2)}
.fx-legal{margin-top:14px;max-width:640px;font-size:14px;line-height:1.55;color:var(--muted)}
.fx-jump{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-top:clamp(24px,3vw,36px)}
.fx-jump a{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--ink-2);font-size:14px;font-weight:600;text-decoration:none;white-space:nowrap}

/* an entry: seen on, the title, what you see, the cards, the prompt and Copy prompt */
.fx{margin-top:clamp(36px,5vw,56px);padding-top:clamp(36px,5vw,56px);border-top:1px solid var(--line);scroll-margin-top:16px}
.fx-seen{display:flex;flex-wrap:wrap;align-items:center;column-gap:.35em;font-size:15px;color:var(--muted)}
.fx-seen a{display:inline-flex;align-items:center;min-width:44px;min-height:44px;color:var(--ink);font-weight:700;text-decoration:underline;text-decoration-color:var(--line);text-underline-offset:5px}
.fx h2{font-size:clamp(26px,3.2vw,36px);font-weight:800;line-height:1.1;letter-spacing:-.025em}
.fx-what{margin-top:14px;max-width:68ch;font-size:17px;line-height:1.65;color:var(--ink-2)}
.fx-what a{color:var(--ink);text-underline-offset:4px}
.fx-sub{margin:32px 0 14px;font-size:18px;font-weight:700;letter-spacing:-.01em}
.fx-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
.fx-pbox{max-width:760px;padding:20px 22px;border-radius:20px;background:var(--surface);box-shadow:var(--shadow)}
.fx-prompt{font-size:17px;line-height:1.65;color:var(--ink)}
.fx-prompt mark{padding:1px 5px;border-radius:4px;background:color-mix(in srgb,var(--brand) 16%,transparent);color:var(--ink)}
.fx-toggle{display:none;align-items:center;min-height:44px;margin-top:4px;padding:0;border:0;background:none;color:var(--brand);font-size:15px;font-weight:700;cursor:pointer}
.copy{display:inline-flex;align-items:center;gap:10px;min-height:48px;margin-top:16px;padding:0 24px;border-radius:999px;border:0;background:var(--ink);color:var(--bg);font-size:16px;font-weight:700;cursor:pointer;transition:background .2s,color .2s}
.copy.done{background:var(--ok);color:#fff}

/* the cards: the home page's, with what each animation makes here on its preview and no Copy prompt */
.card{position:relative;display:flex;flex-direction:column;padding:10px;border-radius:20px;background:var(--surface);box-shadow:var(--shadow);transition:transform .35s var(--ease)}
.card:has(.title a:focus-visible){outline:3px solid var(--brand);outline-offset:3px}
.stage{position:relative;aspect-ratio:16/10;border-radius:12px;overflow:hidden;background:#08080a}
.tag{position:absolute;z-index:1;left:10px;top:10px;max-width:calc(100% - 20px);padding:5px 11px;border-radius:999px;background:rgba(255,255,255,.94);color:#16161b;font-size:12px;font-weight:700;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.meta{display:flex;flex-direction:column;flex:1;padding:14px 8px 6px}
.title{font-size:18px;font-weight:700;letter-spacing:-.01em;line-height:1.25}
.title a{text-decoration:none;outline:none}
.title a::after{content:"";position:absolute;inset:0;z-index:2;border-radius:20px}
.desc{flex:1;margin-top:6px;font-size:15px;line-height:1.5;color:var(--ink-2)}

/* Seen one we should add? */
.fx-more{display:flex;flex-direction:column;align-items:center;margin-top:clamp(36px,5vw,56px);padding-top:clamp(36px,5vw,56px);border-top:1px solid var(--line);text-align:center}
.fx-more h2{font-size:clamp(24px,2.6vw,30px);font-weight:800;line-height:1.15;letter-spacing:-.02em}
.fx-more p{margin-top:10px;max-width:560px;font-size:16px;line-height:1.55;color:var(--ink-2)}
.fx-suggest{display:inline-flex;align-items:center;justify-content:center;min-height:48px;margin-top:18px;padding:0 24px;border-radius:999px;border:1.5px solid var(--ink);font-size:16px;font-weight:700;text-decoration:none;transition:background .2s,color .2s}
.fx-more .fx-note{margin-top:18px;font-size:14px;color:var(--muted)}

/* the message after a copy: the home page's */
.toast{position:fixed;z-index:60;left:50%;bottom:24px;display:flex;align-items:center;gap:10px;min-height:52px;width:max-content;max-width:calc(100% - 32px);padding:0 18px;border-radius:16px;background:var(--ink);color:var(--bg);font-size:15px;font-weight:600;box-shadow:0 12px 32px rgba(22,22,27,.28);opacity:0;transform:translate(-50%,16px);pointer-events:none;transition:opacity .25s,transform .25s var(--ease)}
.toast.show{opacity:1;transform:translate(-50%,0)}
.toast .ok{display:inline-grid;place-items:center;width:28px;height:28px;flex:none;border-radius:50%;background:#1f9d57;color:#fff}
.toast .ok .i{width:16px;height:16px}

@media(hover:hover){
  .lnk:hover,.icon-btn:hover{color:var(--ink);background:var(--line-2)}
  .gh:hover,.fx-jump a:hover{border-color:var(--ink);color:var(--ink)}
  .fx-seen a:hover{text-decoration-color:currentColor}
  .card:hover{transform:translateY(-4px);box-shadow:var(--shadow-2)}
  .card:hover .pv{transform:scale(1.04)}
  .copy:hover{background:var(--brand);color:var(--bg)}
  .copy.done:hover{background:var(--ok);color:#fff}
  .fx-suggest:hover{background:var(--ink);color:var(--bg)}
}
/* two cards across below 761px; from 760px down the GitHub button is a round star, as on the home page */
@media(max-width:760px){
  .fx-cards{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
  .gh{position:relative;width:44px;padding:0;justify-content:center;gap:0}
  .gh-t{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
  .gh-c{display:none}
}
/* phones */
@media(max-width:600px){
  .top{min-height:60px}
  .top .nav .lnk{display:none}
  .brand{gap:10px;font-size:15px}
  .mark{width:28px;height:28px}
  .pill{padding:7px 13px;font-size:13px}
  .fx-jump{flex-wrap:nowrap;justify-content:flex-start;width:calc(100% + 2 * var(--gut));margin-inline:calc(-1 * var(--gut));padding-inline:var(--gut);overflow-x:auto;scrollbar-width:none}
  .fx-jump a{flex:none}
  .fx-what{font-size:16px;line-height:1.6}
  .fx-what a{padding-block:14px} /* a link inside a sentence: its touch area grows to 44px without moving the lines */
  .fx-pbox{padding:16px 18px}
  .fx-prompt{font-size:16px;line-height:1.6}
  .fx-prompt.is-clamped{display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden}
  .fx-toggle{display:inline-flex}
  .copy{width:100%;justify-content:center}
  .card{padding:6px;border-radius:16px}
  .title a::after{border-radius:16px}
  .stage{border-radius:10px}
  .tag{left:6px;top:6px;max-width:calc(100% - 12px);padding:3px 8px;font-size:11px;white-space:normal} /* two cards across: a long label takes a second line instead of being cut */
  .meta{padding:10px 6px 4px}
  .title{font-size:15px}
  .desc{flex:none;margin-top:4px;font-size:13px;line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .fx-suggest{width:100%}
  .foot{flex-direction:column;align-items:flex-start}
}
@media(max-width:360px){.tag{left:5px;top:5px;max-width:calc(100% - 10px);padding:3px 6px;font-size:10px}}
@media(max-width:359px){.gh{display:none}}
/* reduced motion: the cards do not lift and the message fades in place (the previews hold still: see the block below) */
@media(prefers-reduced-motion:reduce){
  .card,.card:hover,.card:hover .pv{transform:none;transition:none}
  .toast{transform:translate(-50%,0);transition:opacity .25s}
}

/* ── previews: written by tools/make-famous.mjs from the home page; run it again, never edit by hand ── */
/* ── end of previews ── */
</style>
</head>
<body>
<a class="skip" href="#stripe-ribbon">Skip to the first effect</a>
<header class="wrap top" id="top">
  <a class="brand" href="../"><svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><circle class="ring" cx="11.16" cy="20.84" r="6.1"/><circle class="ring" cx="15.12" cy="16.88" r="6.1"/><circle class="ring" cx="18.51" cy="13.49" r="6.1"/><circle class="ball" cx="21.2" cy="10.8" r="6.6"/></svg><span>Animation Handbook</span></a>
  <nav class="nav" aria-label="Site">
    <a class="lnk" href="../?view=all">Browse all</a>
    <a class="lnk" href="./" aria-current="page">Famous effects</a>
    <button type="button" class="icon-btn theme-btn" id="theme-toggle" aria-label="Switch between light and dark">
      <svg class="i moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      <svg class="i sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
    </button>
    <a class="gh" id="gh-stars" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg><span class="gh-t">GitHub</span> <span class="gh-c" id="gh-star-count"></span></a>
  </nav>
</header>

<main class="fx-page">
  <div class="fx-head">
    <p class="pill">12 effects from well-known websites</p>
    <h1 class="h1">Famous effects</h1>
    <p class="fx-lede">Effects people admire on well-known websites, the handbook animations that make something similar, and a prompt to build your own.</p>
    <p class="fx-legal">The Animation Handbook is not connected to any of these sites or their owners, and none of them has reviewed or approved this page. Each effect is described in our own words and shown only with the handbook's own demos.</p>
  </div>
  <nav class="fx-jump" aria-label="Effects on this page">
  </nav>

  <section class="fx-more" aria-labelledby="fx-more-t">
    <h2 id="fx-more-t">Seen one we should add?</h2>
    <p>Seen an effect on a well-known site that you want explained?</p>
    <a class="fx-suggest" href="https://github.com/matinmonshizadeh/animation-handbook/issues/new?template=famous_effect.yml" target="_blank" rel="noopener">Suggest it on GitHub<span class="sr"> (opens in a new tab)</span></a>
    <p class="fx-note">Each entry was checked by hand on the date shown; a site may have changed since.</p>
  </section>
</main>

<footer class="wrap foot">
  <a class="brand" href="../"><svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><circle class="ring" cx="11.16" cy="20.84" r="6.1"/><circle class="ring" cx="15.12" cy="16.88" r="6.1"/><circle class="ring" cx="18.51" cy="13.49" r="6.1"/><circle class="ball" cx="21.2" cy="10.8" r="6.6"/></svg><span>Animation Handbook</span></a>
  <p class="foot-t">Web animations with live demos and copyable prompts.</p>
  <nav class="nav" aria-label="Footer"><a class="lnk" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener">GitHub</a><a class="lnk" href="#top">Back to top</a></nav>
</footer>
<div class="toast" id="toast" role="status" aria-live="polite"><span class="ok" aria-hidden="true"><svg class="i" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span class="toast-t"></span></div>

<script>
// The GitHub star count, as on the home page: kept for five minutes, so the page asks GitHub at most once in that time.
(function loadStars(){
  const KEY='gh-star-count',TTL=5*60*1000;
  function show(n){const el=document.getElementById('gh-star-count');if(el)el.textContent='★ '+Number(n).toLocaleString();}
  try{const c=localStorage.getItem(KEY);if(c){const{count,ts}=JSON.parse(c);if(Date.now()-ts<TTL){show(count);return;}}}catch(e){}
  fetch('https://api.github.com/repos/matinmonshizadeh/animation-handbook')
    .then(r=>r.ok?r.json():Promise.reject()).then(d=>{show(d.stargazers_count);
      try{localStorage.setItem(KEY,JSON.stringify({count:d.stargazers_count,ts:Date.now()}));}catch(e){}}).catch(()=>{});
})();

(function(){const btn=document.getElementById('theme-toggle');if(!btn)return;
  btn.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';
    setTheme(next);try{localStorage.setItem('ah-theme',next);}catch(e){}});})();

const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;

// Opened from disk, a link to a folder shows the browser's list of its files, so there every link to a folder names its
// index.html (the logo, Browse all, this page's own link and the cards), as on the home page.
if(location.protocol==='file:')document.querySelectorAll('a[href]').forEach(a=>{
  const href=a.getAttribute('href'),cut=href.search(/[?#]/),path=cut<0?href:href.slice(0,cut);
  if(/\/$/.test(path)&&!/^(?:\/|[a-z][a-z0-9+.-]*:)/i.test(path))a.setAttribute('href',path+'index.html'+href.slice(path.length));
});

// ── previews: written by tools/make-famous.mjs from the home page; run it again, never edit by hand ──
const PREVIEWS={};
// ── end of previews ──

// Each card shows its animation's preview from the home page. It plays while the card is on screen (on phones, while the card
// is in the middle of the screen) and while the card holds keyboard focus; under reduced motion it holds one still, clear frame
// (the point the home page holds it at).
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(en=>en.target.classList.toggle('playing',en.isIntersecting)),
  matchMedia('(hover:hover)').matches?{threshold:.2}:{rootMargin:'-34% 0px -34% 0px'}):null;
function hold(card,still){
  const anims=card.querySelector('.pv').getAnimations({subtree:true});
  if(!anims.length)return;
  const at=still*anims[0].effect.getTiming().duration;
  for(const a of anims)a.currentTime=at;
}
document.querySelectorAll('.fx .card[data-slug]').forEach(card=>{
  const p=PREVIEWS[card.dataset.slug],pv=card.querySelector('.pv');
  if(!p||!pv)return;
  pv.classList.add('pv-'+p.pv);
  pv.innerHTML=p.markup;
  if(reduce){hold(card,p.still);return;}
  card.addEventListener('focusin',()=>card.classList.add('playing'));
  if(io)io.observe(card);else card.classList.add('playing');
});

// A link to an entry (the jump row, the skip link) brings the entry into view and gives its heading keyboard focus; under
// reduced motion it jumps instead of gliding. A click with Ctrl, Cmd, Shift or Alt, or another button, is left to the browser.
document.addEventListener('click',e=>{
  const a=e.target.closest('a[href^="#"]');
  if(!a||e.button||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
  const entry=document.getElementById(a.getAttribute('href').slice(1));
  if(!entry||!entry.matches('section.fx'))return;
  e.preventDefault();
  entry.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
  entry.querySelector('h2').focus({preventScroll:true});
  try{history.pushState(null,'','#'+entry.id);}catch(err){}
});

// The prompts: on phones each shows five lines and "Show the full prompt", as on the animation pages.
document.querySelectorAll('.fx-prompt').forEach(p=>{
  p.id=p.closest('section.fx').id+'-prompt';
  p.classList.add('is-clamped');
  const more=document.createElement('button');
  more.type='button';more.className='fx-toggle';
  more.setAttribute('aria-controls',p.id);more.setAttribute('aria-expanded','false');
  more.textContent='Show the full prompt';
  more.addEventListener('click',()=>{const open=!p.classList.toggle('is-clamped');more.setAttribute('aria-expanded',String(open));more.textContent=open?'Show less':'Show the full prompt';});
  p.after(more);
});

// Copy prompt copies the prompt as shown, brackets included. It reads "Copied" for about two seconds and the home page's
// message shows; where the browser refuses the clipboard, the prompt is selected and the button asks for the copy keys.
// Only the icon and the label's words change: the label is a live region, so a screen reader announces the change, and the
// button's name always starts with what it shows and names its entry.
const ICON_COPY='<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
const ICON_DONE='<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const KEYS=/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent)?'Press ⌘C to copy':'Press Ctrl+C to copy';
const toastEl=document.getElementById('toast'),toastText=toastEl.querySelector('.toast-t');let toastTimer=0,toastClear=0;
function toast(message){
  clearTimeout(toastTimer);clearTimeout(toastClear);
  toastText.textContent=message;
  toastEl.classList.add('show');
  toastTimer=setTimeout(()=>{toastEl.classList.remove('show');toastClear=setTimeout(()=>{toastText.textContent='';},300);},2400);
}
function copyState(btn,kind){
  const title=btn.closest('section.fx').querySelector('h2').textContent;
  clearTimeout(btn._timer);
  btn.classList.toggle('done',kind==='done');
  btn.querySelector('.i').outerHTML=kind==='done'?ICON_DONE:ICON_COPY;
  const label=kind==='done'?'Copied':kind==='keys'?KEYS:'Copy prompt';
  btn.querySelector('.copy-l').textContent=label;
  btn.setAttribute('aria-label',kind==='done'?'Copied the prompt for '+title:kind==='keys'?KEYS+': the prompt for '+title+' is selected':'Copy prompt for '+title);
  if(kind)btn._timer=setTimeout(()=>copyState(btn,''),kind==='done'?2000:4000);
}
document.querySelectorAll('.fx .copy').forEach(btn=>btn.addEventListener('click',()=>{
  const prompt=btn.closest('section.fx').querySelector('.fx-prompt');
  const text=prompt.textContent.replace(/\s+/g,' ').trim();
  const clip=navigator.clipboard;
  (clip&&clip.writeText?clip.writeText(text):Promise.reject(new Error('no clipboard'))).then(()=>{
    copyState(btn,'done');
    toast('Prompt copied. Paste it into your AI assistant.');
  },()=>{
    const range=document.createRange();
    range.selectNodeContents(prompt);
    const sel=getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    copyState(btn,'keys');
  });
}));
</script>
</body>
</html>
```

- [ ] **Step 4: Create `.github/ISSUE_TEMPLATE/famous_effect.yml`**

```yaml
name: Famous effect
description: Suggest an effect from a well-known website for the Famous effects page.
title: "[famous effect] "
labels: ["enhancement"]
body:
  - type: markdown
    attributes:
      value: Describe the effect in your own words, please, with no screenshots, videos or code from the site. The page shows each effect only with the handbook's own demos.
  - type: input
    id: address
    attributes:
      label: The site's address
      description: The public page where the effect shows without signing in.
      placeholder: https://example.com/
    validations:
      required: true
  - type: input
    id: where
    attributes:
      label: Where on the page
      description: For example the menu at the top, or the cards on the home page.
  - type: textarea
    id: what
    attributes:
      label: What you see
      description: In your own words, what moves and what starts it (the page opening, scrolling, pointing at something or pressing it).
    validations:
      required: true
  - type: checkboxes
    id: checks
    attributes:
      label: Before you send it
      options:
        - label: I described the effect in my own words.
          required: true
        - label: I attached no screenshots, videos or code from the site.
          required: true
```

- [ ] **Step 5: Write the preview blocks and run the tests**

Run: `node tools/make-famous.mjs`
Expected: `famous/index.html: 0 cards, 0 previews (written)` (the CSS block gets the base rules; the data block becomes `const PREVIEWS={` and `};` on two lines).
Run: `node --test "tests/*.test.js"`
Expected: every test passes, including the eleven frame tests and the drift test.

- [ ] **Step 6: Page check of the frame.** Serve this worktree on port 8933 and run the pool command with the target `famous` and `--out C:/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.superpowers/sdd/2026-10-14-famous-effects/check-t5`.
Expected: six FAIL lines whose only problems are the missing entries: every line has `no entries (section.fx): not the Famous effects page, or not built yet`; the desktop line adds `no links in the jump row; no entries to play; no entries to copy`; the phone-reduced line adds `reduced motion: no cards`. No overflow, small targets, first-screen or console problem on any line. Look at `famous-desktop.png`, `famous-phone.png` and `famous-phone-small.png` (Read tool): the top bar, the pill, the heading, the lede and the not-connected line read clearly and centered; at 320px nothing is cut off; in `famous-phone.png` the theme button and the round star sit at the right of the top bar. Stop the server.

- [ ] **Step 7: Commit**

```bash
git add famous/index.html .github/ISSUE_TEMPLATE/famous_effect.yml tests/famous.test.js
git commit -m "feat: the Famous effects page's frame in the home page's look (top bar, the not-connected line, jump row, Seen one we should add?, footer) with its script for previews, jumps, Copy prompt and the phone clamp, and a Famous effect issue template"
```

---

### Task 6: The sitemap and `llms.txt` list the Famous effects page

**Files:**
- Modify: `tools/update-sitemap.mjs` (header lines 5-13; after line 53; after line 85; lines 90-91; line 96)
- Modify: `tools/make-skill.mjs` (header lines 7-23; after line 350; the `llms.txt` array, lines 410-412)
- Modify: `tests/pages.test.js` (lines 645-647, in "the counts written in the issue template, the 404 page and the sitemap match the cards")
- Modify: `tests/skill.test.js` (a new test after line 194)
- Generated: `sitemap.xml`, `llms.txt` (by the tools)

**Interfaces:**
- Consumes: `famous/index.html` with `<meta name="description" content="…">` (Task 5).
- Produces: `sitemap.xml` lists the home page, then `…/famous/` (dated by its folder, `monthly`, `0.8`), then every animation; `llms.txt` has, after the last category and before `## Skill files`, the section `## Famous effects` with the line `- [Famous effects](https://matinmonshizadeh.github.io/animation-handbook/famous/): <the page's description>`.

- [ ] **Step 1: Write the failing tests.** In `tests/pages.test.js` replace lines 645-647:

```js
  // The sitemap lists one URL more than the total: the home page.
  const urls = count(read(path.join(ROOT, 'sitemap.xml')), '<url>');
  assert.equal(urls, cards + 1, 'sitemap.xml lists the home page and every animation');
```

with:

```js
  // The sitemap lists two URLs more than the total: the home page and the Famous effects page, first and in that order.
  const sitemap = read(path.join(ROOT, 'sitemap.xml'));
  assert.equal(count(sitemap, '<url>'), cards + 2, 'sitemap.xml lists the home page, the Famous effects page and every animation');
  const LIVE = 'https://matinmonshizadeh.github.io/animation-handbook/';
  assert.deepEqual([...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].slice(0, 2).map(m => m[1]), [LIVE, `${LIVE}famous/`], 'the home page, then Famous effects');
```

In `tests/skill.test.js`, after the test "llms.txt lists every card once, in the order of CATS, with its live address and its description, and links the skill files" (it ends on line 194), add:

```js

test('llms.txt links the Famous effects page with the page\'s own description, after the categories and before the skill files', () => {
  const text = read(path.join(ROOT, 'llms.txt'));
  const lede = decode(read(path.join(ROOT, 'famous', 'index.html')).match(/<meta name="description" content="([^"]+)">/)[1]);
  const line = `- [Famous effects](${LIVE}famous/): ${lede}`;
  assert.equal(text.split('\n').filter(l => l === line).length, 1, `llms.txt has the line ${line}`);
  assert.ok(text.includes(`## Famous effects\n\n${line}\n`), 'under its own heading');
  assert.ok(text.indexOf(line) > text.lastIndexOf(`](${LIVE}animations/`), 'after the last card');
  assert.ok(text.indexOf(line) < text.indexOf('## Skill files'), 'before the skill files');
});
```

- [ ] **Step 2: Run them and see them fail**

Run: `node --test tests/pages.test.js tests/skill.test.js`
Expected: the sitemap test FAILS (`167 !== 168`) and the new `llms.txt` test FAILS (no such line); every other test passes.

- [ ] **Step 3: `tools/update-sitemap.mjs`.** The edits anchor on the lines as they read on main (line numbers on main in brackets). Replace the six header lines from `//   The home page comes first, then every page in the order of the CATS array…` to `//   priority stay as they are: weekly and 1.0 for the home page, monthly and 0.7 for every page.` (lines 5-10) with:

```js
//   The home page comes first, then the Famous effects page (famous/), then every page in the order of the CATS array in
//   index.html (the home page's order), at the home page's canonical address. A page's lastmod is the date of the last
//   commit that touched its folder (git log -1 --format=%cs -- <folder>), or today's date when the folder has changes that
//   are not committed yet (a new page too); the Famous effects page is dated the same way, by famous/. The home page's
//   lastmod is the latest of index.html and the files it loads (the page script and the two fonts): a change to a page
//   alone does not change the home page. changefreq and priority: weekly and 1.0 for the home page, monthly and 0.8 for
//   the Famous effects page, monthly and 0.7 for every page.
```

The line `// Needs git on the PATH. Exit code 1 when a card has no page folder or git cannot be read.` (line 13) becomes:

```js
// Needs git on the PATH. Exit code 1 when a card has no page folder, famous/ has no index.html, or git cannot be read.
```

After the line that starts `if (missing.length) { console.error(` (line 53) add:

```js
// The Famous effects page (docs/superpowers/specs/2026-10-13-famous-effects-design.md) comes right after the home page.
const FAMOUS = 'famous/';
if (!existsSync(join(ROOT, FAMOUS, 'index.html'))) { console.error('famous/ has no index.html'); process.exit(1); }
```

After the line `  'assets/fonts/schibsted-latin-ext.woff2'])).sort().pop();` that ends the `homeDate` statement (line 85) add:

```js
const famousDate = (await datesOf([FAMOUS]))[0];
```

The two lines that start `const lines = ['<?xml version="1.0" encoding="UTF-8"?>',` (lines 90-91) become:

```js
const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  line(BASE, homeDate, 'weekly', '1.0'), line(BASE + FAMOUS, famousDate, 'monthly', '0.8'),
  ...pages.map((folder, i) => line(BASE + folder, pageDates[i], 'monthly', '0.7')), '</urlset>'];
```

The line that starts `const newDates = [[BASE, homeDate],` (line 96) becomes:

```js
const newDates = [[BASE, homeDate], [BASE + FAMOUS, famousDate], ...pages.map((folder, i) => [BASE + folder, pageDates[i]])];
```

- [ ] **Step 4: `tools/make-skill.mjs`.** In the header, after the line `//   demo's own values.` (line 16) add:

```js
//   It also reads the Famous effects page's description (the meta description of famous/index.html): llms.txt lists that
//   page after the categories.
```

and replace the two lines `// Exit code 1 when a card has no page, a page lacks a part the skill needs, a setting has no row in its README's Key` and `// parameters, or the skill folder holds a file this tool does not write.` (lines 22-23) with:

```js
// Exit code 1 when a card has no page, a page lacks a part the skill needs, a setting has no row in its README's Key
// parameters, famous/index.html is missing or has no description, or the skill folder holds a file this tool does not write.
```

After line 350 (`const total = CATS.reduce((n, cat) => n + cat.entries.length, 0);`) add:

```js
  // The Famous effects page, which llms.txt lists after the categories with its own description.
  const famousFile = join(root, 'famous', 'index.html');
  if (!existsSync(famousFile)) throw new Error('famous/index.html is missing: llms.txt lists the Famous effects page');
  const famousLede = (readFileSync(famousFile, 'utf8').match(/<meta name="description" content="([^"]+)">/) || [])[1];
  if (!famousLede) throw new Error('famous/index.html has no description (<meta name="description" content="…">)');
```

In the `llms.txt` array, between the categories (the line ending `…: ${desc}`), '']),`) and the comment `// The skill's own files, which the site serves as they are…`, add:

```js
    // The Famous effects page: effects seen on well-known websites, each with the animations that make something similar.
    '## Famous effects', '',
    `- [Famous effects](${base}famous/): ${decode(famousLede, 'famous/index.html')}`, '',
```

- [ ] **Step 5: Write the generated files and run the tests**

Run: `node tools/update-sitemap.mjs`
Expected: it prints `168 URLs` and at least one lastmod date new or changed (the new `famous/` line; the home page's date moves too when Task 4's footer change is in this branch). `sitemap.xml` now starts with the home page, then `https://matinmonshizadeh.github.io/animation-handbook/famous/` with `monthly` and `0.8`.
Run: `node tools/make-skill.mjs`
Expected: `llms.txt: … (written)`; every `skills/animation-handbook/…` line ends without `(written)`.
Run: `node --test "tests/*.test.js"`
Expected: every test passes. `git status --short` shows only the four tool and test files, `sitemap.xml` and `llms.txt`.

- [ ] **Step 6: Commit**

```bash
git add tools/update-sitemap.mjs tools/make-skill.mjs tests/pages.test.js tests/skill.test.js sitemap.xml llms.txt
git commit -m "feat: the sitemap lists the Famous effects page right after the home page, and llms.txt links it with its description"
```

---

### Task 7: Entries 1 to 6

**Files:**
- Modify: `famous/index.html` (the jump row and the entries before `<section class="fx-more"`; the two preview blocks by the tool)
- Modify: `tests/famous.test.js` (append the entries section)
- May fix: `tools/check-pages.mjs`, the famous functions only (`famousCheck`, `scrollSettled`, `famousJumpProblems`, `famousStageShot`, `famousPreviewProblems`, `famousCopyProblems`, `changedShare`, `famousMotionProblems`), if this first real run shows a bug in them; say so in the report.

**Interfaces:**
- Consumes: Task 1's record (`## Decisions`, each entry's `Checked:` day and `Change:`); Task 5's frame; Task 2's tool; Task 3's target; the Reserve entries above.
- Produces: six `section.fx` entries and their chips; the test section `ENTRIES`, `CARD`, `STARTS`, `words`, `siteWords`, `names` that Task 8 extends.

- [ ] **Step 1: Read the record.** In `.superpowers/sdd/2026-10-14-famous-effects/live-check.md`, for each of entries 1-6: "Written as in the plan" → its markup in Step 4 as it is; "Rewritten" → its markup with the record's Change sentence in place of the sentence it corrects (What you see stays 25 to 70 words); "Swapped" → the reserve's chip and section from Reserve entries, in this entry's place. Every `datetime` is that entry's `Checked:` day. If entry 1 is swapped, the skip link's `href` becomes the reserve's id.

- [ ] **Step 2: Write the failing tests.** Append to `tests/famous.test.js`:

```js

// ---------- The page: entries, cards and prompts ----------
const STARTS = ['loop', 'load', 'scroll', 'hover', 'press'];
const words = s => s.split(/\s+/).filter(Boolean).length;
// Each entry as { id, site, start, body }, in page order.
const ENTRIES = [...PAGE.matchAll(/<section class="fx" id="([a-z0-9-]+)" aria-labelledby="\1-t" data-fx-site="([^"]+)" data-fx-start="([a-z]+)">([\s\S]*?)<\/section>/g)]
  .map(m => ({ id: m[1], site: decode(m[2]), start: m[3], body: m[4] }));
// A card exactly as the template writes it: its accent, slug, label, link, name and line.
const CARD = /<article class="card (c[1-7])" data-slug="([a-z0-9-]+)"><div class="stage"><div class="pv" aria-hidden="true"><\/div><span class="tag">([^<]+)<\/span><\/div><div class="meta"><h4 class="title"><a href="([^"]+)">([^<]+)<\/a><\/h4><p class="desc">([^<]+)<\/p><\/div><\/article>/g;
// The words that would name an entry's site in a prompt: its name (without a leading "The"), its address and the name in that
// address. A single letter, as X, is too short to count ("an X" is a shape); its address still counts.
const siteWords = e => {
  const href = e.body.match(/<p class="fx-seen">Seen on <a href="([^"]+)"/)[1], host = new URL(href).hostname.replace(/^www\./, '');
  return [e.site.replace(/^The /, ''), host, host.split('.').slice(-2)[0]].filter(w => w.length > 1);
};
// Whether text holds word as a word of its own (not inside a longer one), ignoring case.
const names = (text, word) => new RegExp('(^|[^a-z0-9])' + escapeRe(word.toLowerCase()) + '([^a-z0-9]|$)', 'i').test(text);

test('every entry is written as the template says, so the tests below see it', () => {
  assert.ok(ENTRIES.length > 0, 'the page has entries');
  assert.equal(ENTRIES.length, count(PAGE, '<section class="fx"'), 'each <section class="fx"> has its id, aria-labelledby, data-fx-site and data-fx-start in that order');
  assert.equal(new Set(ENTRIES.map(e => e.id)).size, ENTRIES.length, 'every id is unique');
  assert.ok(PAGE.indexOf('<nav class="fx-jump"') < PAGE.indexOf('<section class="fx"'), 'the entries come after the jump row');
});

for (const e of ENTRIES) {
  test(`${e.id}: seen on its site in the year it was checked, a heading, what you see in 25 to 70 words and what starts it`, () => {
    const seen = e.body.match(/<p class="fx-seen">Seen on <a href="(https:\/\/[^"]+)" target="_blank" rel="noopener">([^<]+)<span class="sr"> \(opens in a new tab\)<\/span><\/a> in <time datetime="((\d{4})-\d{2}-\d{2})">(\d{4})<\/time><\/p>/);
    assert.ok(seen, 'Seen on: the site\'s address as a link that opens a new tab, then the year in a <time>');
    const [, href, label, day, year, shown] = seen;
    assert.equal(label, href.replace(/^https:\/\//, '').replace(/^www\./, '').replace(/\/$/, ''), 'the link shows the address without https:// or www.');
    assert.equal(shown, year, 'the year shown is the year of the day checked');
    assert.ok(!Number.isNaN(Date.parse(day)) && Date.parse(day) <= Date.now(), `${day} is a day that has come`);
    assert.equal(count(e.body, '<p class="fx-seen">'), 1, 'one Seen on line');
    assert.equal(count(e.body, '<h2 '), 1, 'one heading');
    assert.ok(e.body.includes(`<h2 id="${e.id}-t" tabindex="-1">`), 'the heading the entry is named by, which a jump focuses');
    const what = e.body.match(/<p class="fx-what">([\s\S]*?)<\/p>/);
    assert.ok(what, 'what you see');
    const n = words(textOf(what[1]));
    assert.ok(n >= 25 && n <= 70, `what you see has ${n} words, not 25 to 70`);
    assert.ok(STARTS.includes(e.start), `data-fx-start "${e.start}" is one of ${STARTS.join(', ')}`);
    assert.ok(e.site.trim(), 'data-fx-site names the site');
    assert.ok(e.body.includes('<h3 class="fx-sub">Made with these animations</h3>') && e.body.includes('<h3 class="fx-sub">A prompt to build something similar</h3>'), 'its two parts');
  });

  test(`${e.id}: one to three cards, each an animation of the home page with its name, line and page, and a short label`, async () => {
    const { homeConst } = await tool();
    const CATS = homeConst(HOME, 'CATS');
    const cards = [...e.body.matchAll(CARD)];
    assert.equal(cards.length, count(e.body, '<article'), 'every card is written as the template says');
    assert.ok(cards.length >= 1 && cards.length <= 3, `${cards.length} cards, not 1 to 3`);
    for (const [, accent, slug, label, href, name, desc] of cards) {
      const cat = CATS.find(c => c.entries.some(x => x[0] === slug));
      assert.ok(cat, `${slug} is a card on the home page`);
      const [, cardName, line] = cat.entries.find(x => x[0] === slug);
      assert.equal(accent, cat.cat.replace('-cat', ''), `${slug}: its category's accent`);
      assert.equal(href, `../${cat.folder}/${slug}/`, `${slug}: its page's link`);
      assert.ok(fs.existsSync(path.join(ROOT, cat.folder, slug, 'index.html')), `${slug}: its page exists`);
      assert.equal(decode(name), cardName, `${slug}: the home page's name`);
      assert.equal(decode(desc), line, `${slug}: the home page's line`);
      const n = words(decode(label));
      assert.ok(n >= 1 && n <= 3, `${slug}: the label "${label}" has ${n} words, not 1 to 3`);
    }
  });

  test(`${e.id}: its prompt follows the rules for prompts and names no site of the page, and Copy prompt names the entry`, () => {
    const box = e.body.match(/<div class="fx-pbox"><p class="fx-prompt">([\s\S]*?)<\/p><\/div>/);
    assert.ok(box, 'the prompt in its box');
    const prompt = textOf(box[1]), n = words(prompt);
    assert.ok(n >= 60 && n <= 130, `${n} words, not 60 to 130`);
    assert.ok(prompt.startsWith('Add '), 'starts with "Add "');
    const parts = prompt.match(/\[[^\]]+\]/g) || [];
    assert.ok(parts.length >= 1, 'at least one [part to fill in]');
    assert.equal(count(box[1], '<mark>['), parts.length, 'each [part] is marked');
    assert.ok(!/`|<code|<pre/.test(box[1]), 'no code');
    assert.ok(!prompt.includes('Match the settings listed below.'), 'the page has no settings to match');
    assert.match(prompt, /reduced motion/i, 'says what happens under reduced motion');
    if (e.start === 'hover' || e.start === 'press') assert.match(prompt, /\b(touch|tap|finger)/i, 'names touch, a tap or a finger');
    for (const other of ENTRIES) for (const w of siteWords(other)) assert.ok(!names(prompt, w), `names "${w}"`);
    const title = e.body.match(/<h2 [^>]*>([^<]+)<\/h2>/)[1];
    assert.ok(e.body.includes(`<button type="button" class="copy" aria-label="Copy prompt for ${title}">`), 'Copy prompt names its entry');
  });
}

test('the jump row links each entry once, in page order, each chip starting with its site, and the skip link leads to the first entry', () => {
  const nav = between(PAGE, '<nav class="fx-jump" aria-label="Effects on this page">', '</nav>');
  const links = [...nav.matchAll(/<a href="#([a-z0-9-]+)">([^<]+)<\/a>/g)];
  assert.deepEqual(links.map(m => m[1]), ENTRIES.map(e => e.id), 'one chip per entry, in order');
  for (const [, id, label] of links) assert.ok(decode(label).startsWith(`${ENTRIES.find(e => e.id === id).site} · `), `${id}: "${label}" starts with its site`);
  assert.ok(PAGE.includes(`<a class="skip" href="#${ENTRIES[0].id}">Skip to the first effect</a>`), 'the skip link');
});

test('two different animations on the page never share a preview', async () => {
  const { homeConst } = await tool();
  const CATS = homeConst(HOME, 'CATS'), PV = homeConst(HOME, 'PV');
  const byPreview = new Map();
  for (const slug of new Set([...PAGE.matchAll(CARD)].map(m => m[2]))) {
    const cat = CATS.find(c => c.entries.some(x => x[0] === slug));
    const key = PV[slug] || 'sig' + parseInt(cat.n, 10);
    byPreview.set(key, [...(byPreview.get(key) || []), slug]);
  }
  assert.deepEqual([...byPreview].filter(([, slugs]) => slugs.length > 1).map(([key, slugs]) => `${key}: ${slugs.join(', ')}`), []);
});

test('no company name in the page\'s title, description or social card, and no word that implies approval', () => {
  const head = [TITLE, LEDE, meta('property="og:title"'), meta('property="og:description"'), meta('name="twitter:title"'), meta('name="twitter:description"')].join(' ');
  for (const w of ENTRIES.flatMap(siteWords)) assert.ok(!names(head, w), `"${w}" in the title, description or social card`);
  const shown = textOf(MARKUP.replace(`<p class="fx-legal">${LEGAL}</p>`, ''));
  assert.ok(!/\b(official|officially|approved|endorsed|sponsored|partner|partners|as used by)\b/i.test(shown), 'no word that implies approval');
});
```

- [ ] **Step 3: Run them and see them fail**

Run: `node --test tests/famous.test.js`
Expected: two FAILs: "every entry is written as the template says, so the tests below see it" ("the page has entries") and the jump-row test (there is no first entry for the skip link); every other test passes.

- [ ] **Step 4: Insert the chips.** In `famous/index.html`, between `  <nav class="fx-jump" aria-label="Effects on this page">` and `  </nav>`, add:

```html
    <a href="#stripe-ribbon">Stripe · ribbon</a>
    <a href="#apple-scroll">Apple · headset</a>
    <a href="#landonorris-reveal">Lando Norris · reveal</a>
    <a href="#linear-intro">Linear · headline</a>
    <a href="#apple-menu">Apple · menu</a>
    <a href="#wikipedia-previews">Wikipedia · previews</a>
```

- [ ] **Step 5: Insert entries 1 to 6** before the line `  <section class="fx-more" aria-labelledby="fx-more-t">`, each followed by a blank line (write each `datetime` from the record):

```html
  <section class="fx" id="stripe-ribbon" aria-labelledby="stripe-ribbon-t" data-fx-site="Stripe" data-fx-start="loop">
    <p class="fx-seen">Seen on <a href="https://stripe.com/" target="_blank" rel="noopener">stripe.com<span class="sr"> (opens in a new tab)</span></a> in <time datetime="2026-10-14">2026</time></p>
    <h2 id="stripe-ribbon-t" tabindex="-1">The twisting ribbon of light</h2>
    <p class="fx-what">Behind the headline, a thick ribbon of glowing color slowly twists in depth, sharp in places and blurred in others, as if filmed by a camera, under a fine grain. From 2020 to 2025 the same place held a flat band of blended colors that flowed like slow paint, the look <a href="../animations/07-ambient-background/mesh-gradient/">Mesh Gradient Animation</a> makes.</p>
    <h3 class="fx-sub">Made with these animations</h3>
    <div class="fx-cards">
      <article class="card c7" data-slug="aurora"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">The soft light</span></div><div class="meta"><h4 class="title"><a href="../animations/07-ambient-background/aurora/">Aurora / Northern Lights</a></h4><p class="desc">Blurred bands of light sway like the northern lights. Best for dark backgrounds.</p></div></article>
      <article class="card c7" data-slug="grain-overlay"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">The grain</span></div><div class="meta"><h4 class="title"><a href="../animations/07-ambient-background/grain-overlay/">Grain / Film Noise Overlay</a></h4><p class="desc">Fine grain flickers over the page, like old film. Best for editorial sites.</p></div></article>
      <article class="card c6" data-slug="webgl-shader-animation"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">On the chip</span></div><div class="meta"><h4 class="title"><a href="../animations/06-3d-advanced/webgl-shader-animation/">WebGL Shader Animation</a></h4><p class="desc">Moving color patterns computed for every pixel. Best for bold backgrounds.</p></div></article>
    </div>
    <h3 class="fx-sub">A prompt to build something similar</h3>
    <div class="fx-pbox"><p class="fx-prompt">Add a slowly twisting ribbon of colored light behind <mark>[the heading at the top of your page]</mark>. Draw one thick, soft band in three or four of your own colors that drifts and turns in depth, so parts of it come into sharp focus while others blur, like a camera with a shallow focus, and lay a fine grain over it so the colors feel printed rather than flat. Keep the movement slow and the heading readable on every color it passes. Draw it on the graphics chip, show a still picture of it until it is ready, and pause it when it is off screen. On phones, draw a lighter version. If the visitor has reduced motion turned on, show the still picture.</p></div>
    <button type="button" class="copy" aria-label="Copy prompt for The twisting ribbon of light"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg><span class="copy-l" aria-live="polite">Copy prompt</span></button>
  </section>

  <section class="fx" id="apple-scroll" aria-labelledby="apple-scroll-t" data-fx-site="Apple" data-fx-start="scroll">
    <p class="fx-seen">Seen on <a href="https://www.apple.com/apple-vision-pro/" target="_blank" rel="noopener">apple.com/apple-vision-pro<span class="sr"> (opens in a new tab)</span></a> in <time datetime="2026-10-14">2026</time></p>
    <h2 id="apple-scroll-t" tabindex="-1">The headset that comes apart as you scroll</h2>
    <p class="fx-what">The headset stays in the middle of the screen while you scroll: its parts rise out of it layer by layer, then it tips up to show its lenses, and scrolling back puts it together. Beside it, the phrase about the part on screen turns from gray to white.</p>
    <h3 class="fx-sub">Made with these animations</h3>
    <div class="fx-cards">
      <article class="card c1" data-slug="scroll-image-sequence"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">Scroll plays it</span></div><div class="meta"><h4 class="title"><a href="../animations/01-scroll-based/scroll-image-sequence/">Scroll Image Sequence</a></h4><p class="desc">Scrolling plays a series of pictures like a flip-book. Best for products.</p></div></article>
      <article class="card c1" data-slug="pin-animation"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">It stays put</span></div><div class="meta"><h4 class="title"><a href="../animations/01-scroll-based/pin-animation/">Pin Animation</a></h4><p class="desc">One part stays put while its text changes on scroll. Best for feature lists.</p></div></article>
      <article class="card c1" data-slug="text-fill-on-scroll"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">Words light up</span></div><div class="meta"><h4 class="title"><a href="../animations/01-scroll-based/text-fill-on-scroll/">Text Fill on Scroll</a></h4><p class="desc">Words light up one by one as you scroll. Best for key statements.</p></div></article>
    </div>
    <h3 class="fx-sub">A prompt to build something similar</h3>
    <div class="fx-pbox"><p class="fx-prompt">Add a scroll-driven product reveal to <mark>[your product section]</mark>. Pin the product in the middle of the screen while the visitor scrolls through a section a few screens tall, and let the scroll play a short video or a series of pictures of it, so it turns or comes apart as they scroll down and goes back together as they scroll up. Beside it, keep a short paragraph in dim gray and light up the phrase about the part on screen. Show a still picture until the video or pictures are ready, and give the product a text description for screen readers. Touch scrolling drives it the same way. If the visitor has reduced motion turned on, show a few still pictures with their text instead.</p></div>
    <button type="button" class="copy" aria-label="Copy prompt for The headset that comes apart as you scroll"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg><span class="copy-l" aria-live="polite">Copy prompt</span></button>
  </section>

  <section class="fx" id="landonorris-reveal" aria-labelledby="landonorris-reveal-t" data-fx-site="Lando Norris" data-fx-start="hover">
    <p class="fx-seen">Seen on <a href="https://landonorris.com/" target="_blank" rel="noopener">landonorris.com<span class="sr"> (opens in a new tab)</span></a> in <time datetime="2026-10-14">2026</time></p>
    <h2 id="landonorris-reveal-t" tabindex="-1">The liquid reveal under the pointer</h2>
    <p class="fx-what">A large portrait fills the screen. Wherever the pointer goes, a soft, liquid-looking blob shows a second picture through it, his racing helmet, as if the portrait were being wiped away.</p>
    <h3 class="fx-sub">Made with these animations</h3>
    <div class="fx-cards">
      <article class="card c4" data-slug="cursor-follower"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">Follows the pointer</span></div><div class="meta"><h4 class="title"><a href="../animations/04-micro-interactions/cursor-follower/">Cursor Follower</a></h4><p class="desc">A dot trails your pointer and flips the colors under it. Best for portfolios.</p></div></article>
      <article class="card c6" data-slug="morphing-blob"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">The liquid shape</span></div><div class="meta"><h4 class="title"><a href="../animations/06-3d-advanced/morphing-blob/">Morphing Blob</a></h4><p class="desc">Blobs melt together, and one drop chases your pointer. Best for hero sections.</p></div></article>
      <article class="card c2" data-slug="clip-path-reveal"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">The hidden picture</span></div><div class="meta"><h4 class="title"><a href="../animations/02-entrance-and-exit/clip-path-reveal/">Clip-Path Reveal</a></h4><p class="desc">A growing shape uncovers it while it stays still. Best for images and banners.</p></div></article>
    </div>
    <h3 class="fx-sub">A prompt to build something similar</h3>
    <div class="fx-pbox"><p class="fx-prompt">Add a liquid reveal to <mark>[the picture at the top of your page, with a second picture hidden under it]</mark>. Stack the two pictures exactly. Wherever the pointer goes, a soft, round blob follows a little behind it, wobbling and stretching with its speed, and the hidden picture shows through the blob, as if the top picture were being wiped away. Let the blob shrink away when the pointer stops or leaves. Draw the mask on the graphics chip or with a clip, never by resizing the pictures, so it stays smooth. On touch screens, let a finger dragged across the picture do the same. If the visitor has reduced motion turned on, show a plain circle at the pointer, without the wobble or the lag.</p></div>
    <button type="button" class="copy" aria-label="Copy prompt for The liquid reveal under the pointer"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg><span class="copy-l" aria-live="polite">Copy prompt</span></button>
  </section>

  <section class="fx" id="linear-intro" aria-labelledby="linear-intro-t" data-fx-site="Linear" data-fx-start="load">
    <p class="fx-seen">Seen on <a href="https://linear.app/" target="_blank" rel="noopener">linear.app<span class="sr"> (opens in a new tab)</span></a> in <time datetime="2026-10-14">2026</time></p>
    <h2 id="linear-intro-t" tabindex="-1">The headline that comes into focus</h2>
    <p class="fx-what">As the page opens, the headline's words appear one after another, each rising a little out of a blur; the line under it and the buttons follow, then a large picture of the app, tilted slightly back, comes into focus the same way.</p>
    <h3 class="fx-sub">Made with these animations</h3>
    <div class="fx-cards">
      <article class="card c2" data-slug="split-text-reveal"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">Words in turn</span></div><div class="meta"><h4 class="title"><a href="../animations/02-entrance-and-exit/split-text-reveal/">Split Text Reveal</a></h4><p class="desc">Text breaks into pieces that appear one after another. Best for headlines.</p></div></article>
      <article class="card c2" data-slug="blur-in"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">Blur to sharp</span></div><div class="meta"><h4 class="title"><a href="../animations/02-entrance-and-exit/blur-in/">Blur In</a></h4><p class="desc">Comes into focus from a blur, like a camera. Best for featured cards and photos.</p></div></article>
      <article class="card c1" data-slug="stagger-reveal"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">Part after part</span></div><div class="meta"><h4 class="title"><a href="../animations/01-scroll-based/stagger-reveal/">Stagger Reveal</a></h4><p class="desc">Items in a group appear one after another as it scrolls in. Best for card grids.</p></div></article>
    </div>
    <h3 class="fx-sub">A prompt to build something similar</h3>
    <div class="fx-pbox"><p class="fx-prompt">Add a focus-in opening to <mark>[the headline, the line under it and the main picture at the top of your page]</mark>. As the page opens, show the headline's words one after another, each fading in while it rises a little and sharpens out of a soft blur; then let the line under it, the buttons and the main picture follow the same way, in order. Keep each step short, so the whole opening is over in about a second and nobody waits to read. Animate only fading, blur and small moves, and use less blur on phones, where it costs more. If the visitor has reduced motion turned on, show everything at once.</p></div>
    <button type="button" class="copy" aria-label="Copy prompt for The headline that comes into focus"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg><span class="copy-l" aria-live="polite">Copy prompt</span></button>
  </section>

  <section class="fx" id="apple-menu" aria-labelledby="apple-menu-t" data-fx-site="Apple" data-fx-start="press">
    <p class="fx-seen">Seen on <a href="https://www.apple.com/" target="_blank" rel="noopener">apple.com<span class="sr"> (opens in a new tab)</span></a> in <time datetime="2026-10-14">2026</time></p>
    <h2 id="apple-menu-t" tabindex="-1">The menu that drops in, link by link</h2>
    <p class="fx-what">On a phone, the two-line menu button folds into an X while the menu fills the screen and its links drop into place one after another. On a computer, pointing at a top item opens a panel that grows down from the bar, its links appearing in turn, while the page behind blurs.</p>
    <h3 class="fx-sub">Made with these animations</h3>
    <div class="fx-cards">
      <article class="card c4" data-slug="hamburger-menu-toggle"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">The button</span></div><div class="meta"><h4 class="title"><a href="../animations/04-micro-interactions/hamburger-menu-toggle/">Hamburger Menu Toggle</a></h4><p class="desc">Three lines turn into an X as the menu opens. Best for mobile menus.</p></div></article>
      <article class="card c1" data-slug="stagger-reveal"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">Links in turn</span></div><div class="meta"><h4 class="title"><a href="../animations/01-scroll-based/stagger-reveal/">Stagger Reveal</a></h4><p class="desc">Items in a group appear one after another as it scrolls in. Best for card grids.</p></div></article>
      <article class="card c6" data-slug="glassmorphism-animated"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">The blurred page</span></div><div class="meta"><h4 class="title"><a href="../animations/06-3d-advanced/glassmorphism-animated/">Glassmorphism Animated</a></h4><p class="desc">Frosted glass cards blur the colors behind them. Best for cards and panels.</p></div></article>
    </div>
    <h3 class="fx-sub">A prompt to build something similar</h3>
    <div class="fx-pbox"><p class="fx-prompt">Add a menu that opens in steps to <mark>[the main menu in your site's header]</mark>. On phones, a tap on the menu button folds its lines into an X while the menu opens to fill the screen, and its links drop a few pixels into place one after another. On computers, pointing at a top item, or reaching it with the keyboard, opens a panel below it the same way while the page behind blurs. Keep the wait between links tiny, so the whole menu is there in about half a second, and close it faster than it opens. Make every opener a real button that tells screen readers whether its menu is open. If the visitor has reduced motion turned on, show and hide the menus at once.</p></div>
    <button type="button" class="copy" aria-label="Copy prompt for The menu that drops in, link by link"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg><span class="copy-l" aria-live="polite">Copy prompt</span></button>
  </section>

  <section class="fx" id="wikipedia-previews" aria-labelledby="wikipedia-previews-t" data-fx-site="Wikipedia" data-fx-start="hover">
    <p class="fx-seen">Seen on <a href="https://www.wikipedia.org/" target="_blank" rel="noopener">wikipedia.org<span class="sr"> (opens in a new tab)</span></a> in <time datetime="2026-10-14">2026</time></p>
    <h2 id="wikipedia-previews-t" tabindex="-1">Link previews</h2>
    <p class="fx-what">Rest the pointer on a link and, after a short pause, a small card with the linked article's first lines and picture fades in under the link, rising slightly into place; move away and it fades out.</p>
    <h3 class="fx-sub">Made with these animations</h3>
    <div class="fx-cards">
      <article class="card c4" data-slug="tooltip-reveal"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">The pause</span></div><div class="meta"><h4 class="title"><a href="../animations/04-micro-interactions/tooltip-reveal/">Tooltip Reveal</a></h4><p class="desc">A small label fades in after a short pause. Best for icon buttons.</p></div></article>
      <article class="card c2" data-slug="fade-in-out"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">The fade</span></div><div class="meta"><h4 class="title"><a href="../animations/02-entrance-and-exit/fade-in-out/">Fade In / Fade Out</a></h4><p class="desc">Fades in to appear and fades out to leave. Best for pop-ups and tooltips.</p></div></article>
    </div>
    <h3 class="fx-sub">A prompt to build something similar</h3>
    <div class="fx-pbox"><p class="fx-prompt">Add link previews to <mark>[the links in your articles that point to other pages]</mark>. When the pointer rests on a link for a moment, a small card with the linked page's title, first sentences and picture fades in just below the link while rising a little into place; when the pointer leaves, it fades away. The wait keeps cards from flashing while the pointer only passes by, and a card that would fall off the screen opens above the link instead. Show the same card when keyboard focus reaches the link. On touch screens, where there is no hover, let a tap open the link as usual. If the visitor has reduced motion turned on, show and hide the card without movement.</p></div>
    <button type="button" class="copy" aria-label="Copy prompt for Link previews"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg><span class="copy-l" aria-live="polite">Copy prompt</span></button>
  </section>
```

- [ ] **Step 6: Write the previews and run the tests**

Run: `node tools/make-famous.mjs`
Expected: `famous/index.html: 17 cards, 16 previews (written)` with the plan's entries (Stagger Reveal shows twice; a swap changes both numbers by the reserve's cards).
Run: `node --test "tests/*.test.js"`
Expected: every test passes.

- [ ] **Step 7: Page check.** Serve this worktree on port 8934 and run the pool command with the target `famous` and `--out C:/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.superpowers/sdd/2026-10-14-famous-effects/check-t7`.
Expected: six `ok` lines. If a famous step in `tools/check-pages.mjs` fails for a reason in the check itself (not the page), fix it there and say so in the report. Look at `famous-desktop-full.png`, `famous-phone.png`, `famous-phone-reduced.png` and `famous-phone-small.png` (Read tool): every preview shows its animation (still under reduced motion, never an empty dark box), every label reads in full (a long one may take two lines on phones), the prompts sit in their boxes, Copy prompt is full width on phones, nothing is cut off at 320px. Stop the server.

- [ ] **Step 8: Commit**

```bash
git add famous/index.html tests/famous.test.js
git commit -m "feat: Famous effects entries 1 to 6 (Stripe, Apple's headset, Lando Norris, Linear, Apple's menu, Wikipedia), each with its cards and prompt, and tests for entries, cards and prompts"
```

(Add `tools/check-pages.mjs` to the `git add` only if Step 7 needed a fix in it.)

---

### Task 8: Entries 7 to 12, the count and the pill

**Files:**
- Modify: `famous/index.html` (chips 7-12 after chip 6; entries 7-12 after entry 6; the preview blocks by the tool; the pill if the count is not 12)
- Modify: `tests/famous.test.js` (append the count test)
- May fix: `tools/check-pages.mjs`, the famous functions only, as in Task 7.

**Interfaces:**
- Consumes: Task 7's entries and tests; Task 1's record for 9 to 12; the Reserve entries.
- Produces: the page with 10 to 12 entries and a pill that counts them. Entries 7 (ChatGPT) and 8 (X) are written as below and confirmed by the owner in Task 10, or swapped there.

- [ ] **Step 1: Write the failing test.** Append to `tests/famous.test.js`:

```js

test('the page holds 10 to 12 entries, and its pill counts them', () => {
  assert.ok(ENTRIES.length >= 10 && ENTRIES.length <= 12, `${ENTRIES.length} entries, not 10 to 12`);
  assert.ok(PAGE.includes(`<p class="pill">${ENTRIES.length} effects from well-known websites</p>`), 'the pill gives the number of entries');
});
```

- [ ] **Step 2: Run it and see it fail**

Run: `node --test tests/famous.test.js`
Expected: the new test FAILS ("6 entries, not 10 to 12"); every other test passes.

- [ ] **Step 3: Read the record** for entries 9 to 12 as in Task 7 Step 1 (entries 7 and 8 are written as below, with the `datetime` of today). If no reserve is left for an entry that failed, leave that entry out (its chip too) and write the pill with the number of entries that remain.

- [ ] **Step 4: Insert the chips** after `    <a href="#wikipedia-previews">Wikipedia · previews</a>`:

```html
    <a href="#chatgpt-reply">ChatGPT · reply</a>
    <a href="#x-heart">X · heart</a>
    <a href="#spotify-cards">Spotify · cards</a>
    <a href="#youtube-loading">YouTube · loading</a>
    <a href="#pudding-chart">The Pudding · chart</a>
    <a href="#medium-top-bar">Medium · top bar</a>
```

- [ ] **Step 5: Insert entries 7 to 12** before the line `  <section class="fx-more" aria-labelledby="fx-more-t">`, each followed by a blank line:

```html
  <section class="fx" id="chatgpt-reply" aria-labelledby="chatgpt-reply-t" data-fx-site="ChatGPT" data-fx-start="load">
    <p class="fx-seen">Seen on <a href="https://chatgpt.com/" target="_blank" rel="noopener">chatgpt.com<span class="sr"> (opens in a new tab)</span></a> in <time datetime="2026-10-14">2026</time></p>
    <h2 id="chatgpt-reply-t" tabindex="-1">The answer that writes itself</h2>
    <p class="fx-what">After you send a question, a small dot pulses until the reply starts; a model that works longer shows the word “Thinking” with a band of light sweeping across its letters. Then the answer arrives a few words at a time, as if typed live.</p>
    <h3 class="fx-sub">Made with these animations</h3>
    <div class="fx-cards">
      <article class="card c7" data-slug="breathing-glow"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">The waiting dot</span></div><div class="meta"><h4 class="title"><a href="../animations/07-ambient-background/breathing-glow/">Breathing / Pulsing Glow</a></h4><p class="desc">A soft glow slowly grows and shrinks, like calm breathing. Best for idle states.</p></div></article>
      <article class="card c5" data-slug="text-gradient-animation"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">The shimmer</span></div><div class="meta"><h4 class="title"><a href="../animations/05-text-typography/text-gradient-animation/">Text Gradient Animation</a></h4><p class="desc">Colors flow through the letters while the text stays still. Best for headlines.</p></div></article>
      <article class="card c2" data-slug="word-by-word-reveal"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">Words arriving</span></div><div class="meta"><h4 class="title"><a href="../animations/02-entrance-and-exit/word-by-word-reveal/">Word-by-Word Reveal</a></h4><p class="desc">Words appear one after another at a reading pace. Best for quotes and intros.</p></div></article>
    </div>
    <h3 class="fx-sub">A prompt to build something similar</h3>
    <div class="fx-pbox"><p class="fx-prompt">Add a live reply to <mark>[the answer area of your chat or assistant]</mark>. While the reply is being prepared, show a small dot that slowly pulses; when the work takes longer, show a short status word such as Thinking, with a soft band of light sweeping across its letters. When the answer starts, let it appear a few words at a time, each new group fading in at the end of the text, as if it were being written now. Keep finished lines where they are, and follow the newest words only while the reader has not scrolled away. Let screen readers hear the finished answer once. If the visitor has reduced motion turned on, keep the dot and the word still and show the words without fading.</p></div>
    <button type="button" class="copy" aria-label="Copy prompt for The answer that writes itself"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg><span class="copy-l" aria-live="polite">Copy prompt</span></button>
  </section>

  <section class="fx" id="x-heart" aria-labelledby="x-heart-t" data-fx-site="X" data-fx-start="press">
    <p class="fx-seen">Seen on <a href="https://x.com/" target="_blank" rel="noopener">x.com<span class="sr"> (opens in a new tab)</span></a> in <time datetime="2026-10-14">2026</time></p>
    <h2 id="x-heart-t" tabindex="-1">The heart that bursts</h2>
    <p class="fx-what">Press the heart and it shrinks for an instant, pops back a little too big and settles in pink-red, while a circle of color swells into a thin ring and small colored dots burst out and fade, all within about a second.</p>
    <h3 class="fx-sub">Made with these animations</h3>
    <div class="fx-cards">
      <article class="card c4" data-slug="heart-burst"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">Pop and dots</span></div><div class="meta"><h4 class="title"><a href="../animations/04-micro-interactions/heart-burst/">Heart / Like Burst</a></h4><p class="desc">The heart pops and fills as small hearts burst out. Best for like buttons.</p></div></article>
      <article class="card c4" data-slug="click-ripple"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">The ring</span></div><div class="meta"><h4 class="title"><a href="../animations/04-micro-interactions/click-ripple/">Click / Tap Ripple</a></h4><p class="desc">A ripple spreads out from the spot you press. Best for buttons and list items.</p></div></article>
    </div>
    <h3 class="fx-sub">A prompt to build something similar</h3>
    <div class="fx-pbox"><p class="fx-prompt">Add a like button with a burst to <mark>[the heart button on your posts]</mark>. When it is pressed, the heart shrinks for an instant, then pops back a little too big and settles as it fills with color, while a circle of color swells into a thin ring and small dots burst out from its center and fade. Unliking takes the color away with no burst. Keep it all under a second and draw it over the button, so nothing around it moves. A tap on a touch screen and Enter or Space on the keyboard work the same, and screen readers hear whether the post is liked. If the visitor has reduced motion turned on, only change the color.</p></div>
    <button type="button" class="copy" aria-label="Copy prompt for The heart that bursts"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg><span class="copy-l" aria-live="polite">Copy prompt</span></button>
  </section>

  <section class="fx" id="spotify-cards" aria-labelledby="spotify-cards-t" data-fx-site="Spotify" data-fx-start="hover">
    <p class="fx-seen">Seen on <a href="https://open.spotify.com/" target="_blank" rel="noopener">open.spotify.com<span class="sr"> (opens in a new tab)</span></a> in <time datetime="2026-10-14">2026</time></p>
    <h2 id="spotify-cards-t" tabindex="-1">The play button that rises</h2>
    <p class="fx-what">Point at an album or playlist card and the card lightens a shade while a round green play button fades in, rising a few pixels into the cover's bottom corner.</p>
    <h3 class="fx-sub">Made with these animations</h3>
    <div class="fx-cards">
      <article class="card c4" data-slug="hover-state"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">The card lightens</span></div><div class="meta"><h4 class="title"><a href="../animations/04-micro-interactions/hover-state/">Hover State Animation</a></h4><p class="desc">Six ways a card can react when you point at it. Best for buttons and cards.</p></div></article>
      <article class="card c2" data-slug="slide-in"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">The button rises</span></div><div class="meta"><h4 class="title"><a href="../animations/02-entrance-and-exit/slide-in/">Slide In</a></h4><p class="desc">Travels into place from one edge. Best for side panels and notifications.</p></div></article>
    </div>
    <h3 class="fx-sub">A prompt to build something similar</h3>
    <div class="fx-pbox"><p class="fx-prompt">Add a hover effect to <mark>[the album or playlist cards in your grid]</mark>. When the pointer rests on a card, its background lightens a little and a round play button rises a few pixels into place at the bottom corner of the picture while it fades in; when the pointer leaves, both go back. Use only fading and transforms, and keep it quick, so moving across the grid feels light. Show the play button when a card gets keyboard focus too, and on touch screens, where there is no hover, show it all the time. Give the button a name that says what it plays. If the visitor has reduced motion turned on, show and hide the button without movement.</p></div>
    <button type="button" class="copy" aria-label="Copy prompt for The play button that rises"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg><span class="copy-l" aria-live="polite">Copy prompt</span></button>
  </section>

  <section class="fx" id="youtube-loading" aria-labelledby="youtube-loading-t" data-fx-site="YouTube" data-fx-start="load">
    <p class="fx-seen">Seen on <a href="https://www.youtube.com/" target="_blank" rel="noopener">youtube.com<span class="sr"> (opens in a new tab)</span></a> in <time datetime="2026-10-14">2026</time></p>
    <h2 id="youtube-loading-t" tabindex="-1">Gray shapes while it loads</h2>
    <p class="fx-what">Before the videos appear, gray boxes and bars in the shapes of thumbnails, round channel pictures and titles fill the page; then the real content takes their places.</p>
    <h3 class="fx-sub">Made with these animations</h3>
    <div class="fx-cards">
      <article class="card c4" data-slug="skeleton-loader"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">Gray shapes</span></div><div class="meta"><h4 class="title"><a href="../animations/04-micro-interactions/skeleton-loader/">Skeleton Loader</a></h4><p class="desc">Gray shapes hold the place of content while it loads. Best for feeds and cards.</p></div></article>
      <article class="card c2" data-slug="fade-in-out"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">Content arrives</span></div><div class="meta"><h4 class="title"><a href="../animations/02-entrance-and-exit/fade-in-out/">Fade In / Fade Out</a></h4><p class="desc">Fades in to appear and fades out to leave. Best for pop-ups and tooltips.</p></div></article>
    </div>
    <h3 class="fx-sub">A prompt to build something similar</h3>
    <div class="fx-pbox"><p class="fx-prompt">Add a loading state to <mark>[the grid or feed whose content loads]</mark>. While the content loads, show gray shapes in the sizes of what is coming, such as a picture box, a round avatar and two lines of text, and let them pulse gently between lighter and darker. When the content arrives, put it exactly where the shapes were and fade it in, so nothing on the page jumps. Show only as many shapes as fit the screen, fewer on phones, and stop the pulse as soon as the content is in. Tell screen readers that the content is loading. If the visitor has reduced motion turned on, keep the shapes still.</p></div>
    <button type="button" class="copy" aria-label="Copy prompt for Gray shapes while it loads"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg><span class="copy-l" aria-live="polite">Copy prompt</span></button>
  </section>

  <section class="fx" id="pudding-chart" aria-labelledby="pudding-chart-t" data-fx-site="The Pudding" data-fx-start="scroll">
    <p class="fx-seen">Seen on <a href="https://pudding.cool/2025/11/democracy/" target="_blank" rel="noopener">pudding.cool/2025/11/democracy<span class="sr"> (opens in a new tab)</span></a> in <time datetime="2026-10-14">2026</time></p>
    <h2 id="pudding-chart-t" tabindex="-1">The chart that changes as you read</h2>
    <p class="fx-what">A chart of dots stays on screen while short paragraphs scroll past. Each new paragraph changes it, lighting up the dots it talks about; scrolling back undoes each step.</p>
    <h3 class="fx-sub">Made with these animations</h3>
    <div class="fx-cards">
      <article class="card c1" data-slug="scrollytelling"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">The steps</span></div><div class="meta"><h4 class="title"><a href="../animations/01-scroll-based/scrollytelling/">Scrollytelling</a></h4><p class="desc">A picture beside the story changes as you read down. Best for data stories.</p></div></article>
      <article class="card c1" data-slug="sticky-section"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">The chart stays</span></div><div class="meta"><h4 class="title"><a href="../animations/01-scroll-based/sticky-section/">Sticky Section</a></h4><p class="desc">A section holds still while its content changes. Best for feature tours.</p></div></article>
    </div>
    <h3 class="fx-sub">A prompt to build something similar</h3>
    <div class="fx-pbox"><p class="fx-prompt">Add a scrollytelling layout to <mark>[your story or data article]</mark>. Keep a chart or picture fixed on the screen while short blocks of text scroll past it, and change the chart each time a new block reaches the middle of the screen: light up the dots or bars the text talks about and fade the rest, so the words and the chart tell the story together. Change it smoothly, and let scrolling back undo each step. On phones, keep the chart at the top and let the text scroll over it on cards. Keep every step readable without the chart for screen readers. If the visitor has reduced motion turned on, switch between the steps without animating.</p></div>
    <button type="button" class="copy" aria-label="Copy prompt for The chart that changes as you read"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg><span class="copy-l" aria-live="polite">Copy prompt</span></button>
  </section>

  <section class="fx" id="medium-top-bar" aria-labelledby="medium-top-bar-t" data-fx-site="Medium" data-fx-start="scroll">
    <p class="fx-seen">Seen on <a href="https://medium.com/" target="_blank" rel="noopener">medium.com<span class="sr"> (opens in a new tab)</span></a> in <time datetime="2026-10-14">2026</time></p>
    <h2 id="medium-top-bar-t" tabindex="-1">The top bar that hides while you read</h2>
    <p class="fx-what">Scroll down into an article and the top bar slides up out of the way; scroll up even a little and it slides back into view.</p>
    <h3 class="fx-sub">Made with these animations</h3>
    <div class="fx-cards">
      <article class="card c1" data-slug="hide-on-scroll-header"><div class="stage"><div class="pv" aria-hidden="true"></div><span class="tag">The whole effect</span></div><div class="meta"><h4 class="title"><a href="../animations/01-scroll-based/hide-on-scroll-header/">Hide-on-Scroll Header</a></h4><p class="desc">Scrolling down hides the top bar; scrolling up shows it. Best for mobile pages.</p></div></article>
    </div>
    <h3 class="fx-sub">A prompt to build something similar</h3>
    <div class="fx-pbox"><p class="fx-prompt">Add a hide-on-scroll top bar to <mark>[the header of your article pages]</mark>. When the reader scrolls down into the text, slide the bar up out of view, so the words get the whole screen; the moment they scroll up, even a little, slide it back. Always show it near the top of the page. Tell the direction by comparing each scroll position with the last one, ignore tiny moves so the bar never flickers, and move it only with a transform. Touch scrolling works the same way, and keyboard focus moving into the bar brings it back. If the visitor has reduced motion turned on, fade the bar out and in instead of sliding it.</p></div>
    <button type="button" class="copy" aria-label="Copy prompt for The top bar that hides while you read"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg><span class="copy-l" aria-live="polite">Copy prompt</span></button>
  </section>
```

- [ ] **Step 6: Write the previews and run the tests**

Run: `node tools/make-famous.mjs`
Expected: `famous/index.html: 29 cards, 27 previews (written)` with the plan's entries (Stagger Reveal and Fade In / Fade Out each show twice).
Run: `node --test "tests/*.test.js"`
Expected: every test passes, including "the page holds 10 to 12 entries, and its pill counts them".

- [ ] **Step 7: Page check.** Serve on port 8934 and run the pool command with the target `famous` and `--out C:/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.superpowers/sdd/2026-10-14-famous-effects/check-t8`.
Expected: six `ok` lines. Look at `famous-desktop-full.png` and `famous-phone.png`: twelve entries divided by thin lines, the jump row wraps on the desktop and scrolls sideways on the phone. Stop the server.

- [ ] **Step 8: Commit**

```bash
git add famous/index.html tests/famous.test.js
git commit -m "feat: Famous effects entries 7 to 12 (ChatGPT, X, Spotify, YouTube, The Pudding, Medium), and a test that the pill counts the 10 to 12 entries"
```

---

### Task 9: Integration, docs, generated files and the final review

**Files:**
- Merge: every lane branch into `feat/famous-effects` (in `.claude/worktrees/fx-int`), then `main` if it has moved
- Modify: `CLAUDE.md` (lines 236-238; before line 240; lines 248-250; after line 263, all on main), `CONTRIBUTING.md` (after line 307; the end), `.github/pull_request_template.md` (after line 11), `README.md` (after line 33), `CHANGELOG.md` (the end of Unreleased, after line 13)
- Generated: `sitemap.xml`, `llms.txt`, the two blocks of `famous/index.html`

**Interfaces:**
- Consumes: Tasks 2 to 8.
- Produces: `feat/famous-effects` ready for the owner: tests pass, `famous` and `home` give six `ok` lines each, the docs say how the page is kept, and two reviews (legal and words; code and tests) are clean.

- [ ] **Step 1: Merge.** In `.claude/worktrees/fx-int`, check that every lane is in: `git log --oneline main..feat/famous-effects` lists the merges of `fx/tool`, `fx/check`, `fx/footer`, `fx/frame`, `fx/sitemap` and `fx/entries`. Merge any that is missing with `git merge --no-ff fx/<lane>`. If `git log --oneline feat/famous-effects..main` lists commits (another project went live), take them in with the generated files written inside the merge (coordination rule 5):

```bash
git merge --no-ff --no-commit main
node tools/update-sitemap.mjs
node tools/make-skill.mjs
node tools/make-famous.mjs
git add sitemap.xml llms.txt skills famous/index.html
git commit -m "Merge main into feat/famous-effects, with the generated files written again"
```

Resolve each overlap before the tools run, by the coordination file's map, keeping both sides' own lines (a resolution that needs more than that is reviewed by a fresh agent); for a generated file take either side, since the tools write it again.

- [ ] **Step 2: `CLAUDE.md`.** Replace the paragraph on lines 236-238 ("Changing anything the skill or `llms.txt` repeats …") with:

```markdown
Changing anything the skill or `llms.txt` repeats (a page's title, one-line description, kind, prompt, settings or
Good for and Avoid on tags, a README's Key parameters, a card's name, places or order in `CATS`, or the Famous effects
page's description) also means running `node tools/make-skill.mjs` again: the skill test (`tests/skill.test.js`) fails
until then. Changing a preview that the Famous effects page shows (its key in `PV`, its `case` in `pvMarkup()`, its
rules or keyframes, its `STILL` point) or that page's cards means running `node tools/make-famous.mjs` again: the famous
test (`tests/famous.test.js`) fails until then.
```

Before `## When asked to refactor` add:

```markdown
## Famous effects page
`famous/index.html` shows effects people admire on well-known websites: what you see, in plain words; the handbook
animations that make something similar, as cards with their moving previews; and one prompt to build it
(`docs/superpowers/specs/2026-10-13-famous-effects-design.md`). It is one page in the home page's look and colors (a test
compares them); it links neither shared file, and its own script copies, shows the message, falls back to the copy keys and
shortens prompts on phones in the animation pages' words. Its two marked blocks, the previews' CSS and the `PREVIEWS`
object, are written by `node tools/make-famous.mjs` from the home page, never by hand.

**An entry** is a `section.fx` with an id (`site-what`, as `stripe-ribbon`), `data-fx-site` (the site's name) and
`data-fx-start` (`loop`, `load`, `scroll`, `hover` or `press`), then, in order: "Seen on" and the site's address as a link
(`https://`, in a new tab, its text the address without `https://` or `www.`, its name ending "(opens in a new tab)") and
the year in a `<time>` whose `datetime` is the day it was checked; the plain title as an `h2` with `tabindex="-1"`; what
you see, 25 to 70 words; "Made with these animations" and one to three cards (the card's `CATS` name and line, its page's
link and `data-slug`, and on its preview a label of one to three words saying what that animation makes here; two different
animations on the page never share a preview); "A prompt to build something similar" and Copy prompt, which names its
entry. Copy a neighbor entry's markup, add its chip to the jump row and count it in the pill.

**Its prompt** follows "The copyable prompt" above, but the page has no settings, so it never ends "Match the settings
listed below.": 60 to 130 words, starting "Add a … to [what the reader fills in]" with each bracketed part in a `<mark>`; it
asks for the reader's own colors and content, never a copy of the site, says what happens under reduced motion and, when
the effect starts on hover or press, what touch does. It never names a site of the page, by name or by address.

**The legal checklist** binds every entry (rules to follow, not legal advice):
- The title, what you see and the prompt are in our own words: no sentence, feature name or slogan from the site.
- The site is named in plain text, in the page's own font and colors (no logo, icon, brand color or typeface), and linked
  to its public page.
- Shown only with the handbook's own demos and previews; nothing from the site in the repository or in posts about the
  page: no code, screenshots, videos, pictures, icons or logos.
- The line saying the handbook is not connected to these sites stays on the page, above the first entry, on the first
  screen.
- Nothing implies approval or partnership: no "official", "approved", "partner", "as used by"; no company name in the
  page's title, description or social card; the prompt names no company.
- "Seen on <site> in <year>", with the day checked in `datetime`.
- A site owner who asks for an entry to be changed or removed gets it done promptly (the Suggest link is the contact).

**Adding or checking an entry again.** Watch the effect on the live site, logged out, and write what you see in your own
words; add the entry, its chip and its count in the pill; run `node tools/make-famous.mjs`, `node tools/update-sitemap.mjs`,
the tests and the page check's `famous` target. Every entry is checked again on its site before each release of the page
and at least once a year: an effect that changed is described again from what shows now, one that has gone stays true as
a past sighting or is replaced, and its `datetime` takes the day of the check.
```

In the **Tests:** bullet (lines 248-250) change "checks every page and its README, the shared stylesheet and the home page." to "checks every page and its README, the shared stylesheet, the home page and the Famous effects page.". After the **Home page:** bullet (ending on line 263, "Run it after changing any page's settings or prompt.") add:

```markdown
- **Famous effects:** `node tools/check-pages.mjs --base http://127.0.0.1:<port> famous` checks `famous/` at the same six
  setups (six `ok` lines): the first screen, overflow and touch targets; its desktop run presses each jump link, watches
  each entry's previews and presses each Copy prompt (once more with the clipboard refused); its reduced-motion run checks
  that nothing moves and that every preview holds a still frame that shows something. Run it after changing that page,
  its cards or a preview it shows.
```

If another project has already reworded one of these lines on `main`, make the same change to the line as it now reads.

- [ ] **Step 3: `CONTRIBUTING.md`.** After the paragraph ending "changing any page's settings or prompt." (line 307) add:

```markdown

The Famous effects page has one too: `node tools/check-pages.mjs --base http://127.0.0.1:<port> famous`. It checks the
layout at the six setups, presses each jump link and each Copy prompt and watches the previews; its reduced-motion run
checks that nothing moves. Its previews come from the home page: after changing a preview it shows, run
`node tools/make-famous.mjs`.
```

At the end of the file add:

```markdown

## Suggesting a famous effect

The [Famous effects](https://matinmonshizadeh.github.io/animation-handbook/famous/) page shows effects people admire on
well-known websites, each with the handbook animations that make something similar and a prompt to build your own. Seen
one we should add? Open an issue with the *Famous effect* template: the site's address, where on the page it shows and
what you see, in your own words. Please attach no screenshots, videos or code from the site: the page describes each
effect in its own words and shows it only with the handbook's own demos (the rules are in `CLAUDE.md`, under Famous
effects page).
```

- [ ] **Step 4: `.github/pull_request_template.md`.** After line 11 (the home page check line) add:

```markdown
- [ ] If the change touches the Famous effects page (`famous/`), its cards or a preview it shows, `node tools/make-famous.mjs` has run and its check gives six `ok` lines too (`node tools/check-pages.mjs --base http://127.0.0.1:<port> famous`)
```

- [ ] **Step 5: `README.md` and `CHANGELOG.md`.** In `README.md`, after line 33 (step 3, "**Copy the prompt.** …") add a blank line and:

```markdown
**Seen it on a famous site?** [Famous effects](https://matinmonshizadeh.github.io/animation-handbook/famous/) shows effects people admire on well-known websites, the handbook animations that make something similar, and a prompt to build your own.
```

In `CHANGELOG.md`, at the end of the `## Unreleased` list (after the bullet ending "…loops pause out of view).") add, writing the number of entries in words (twelve unless Task 1 or Task 10 left one out):

```markdown
- A Famous effects page: twelve effects people admire on well-known websites, each described in plain words with the
  handbook animations that make something similar and a prompt to build your own. It is linked from the home page's footer.
```

- [ ] **Step 6: Generated files and tests**

Run: `node tools/make-famous.mjs` — expected: no `(written)` (or written once after a merge of `main`).
Run: `node tools/update-sitemap.mjs` — expected: `168 URLs` (or the new total + 2 if more cards came from `main`).
Run: `node tools/make-skill.mjs` — expected: `llms.txt` and the skill files unchanged unless `main` brought changes.
Run: `node --test "tests/*.test.js"` — expected: every test passes.

- [ ] **Step 7: Page checks.** Serve `.claude/worktrees/fx-int` on port 8935 and run the pool command twice, with the targets `famous` and `home`, both with `--out C:/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.superpowers/sdd/2026-10-14-famous-effects/check-t9`.
Expected: six `ok` lines for each.

- [ ] **Step 8: Final review (two fresh reviewers in parallel).** Each writes a report into the run folder and touches nothing.
  - **Reviewer A, legal and words** (`final-review-legal.md`): for every entry, the seven items of the legal checklist (Global Constraints), checked against `famous/index.html` and the live-check record's "Names and slogans" (none of them in our text); plain words, American spelling, no hype; the not-connected line on the first screen in `famous-desktop.png` and `famous-phone.png` (from Step 7's `--out` folder); the prompts ask for the reader's own colors and content; `git diff --stat main...feat/famous-effects` holds no picture, video or font file and nothing copied from a site. One line per entry: pass, or what to change.
  - **Reviewer B, code and tests** (`final-review-code.md`): `git diff main...feat/famous-effects`: the tool against spec §4; the page script (previews, still frames, jumps, Copy prompt and its fallback, the clamp, links from disk); the accessibility list in Global Constraints; the check's famous functions; that every changed file is on the coordination file's map and that shared lines of `tools/check-pages.mjs`, `index.html` and `tests/pages.test.js` were touched only as listed; that the tests would fail on a real fault (for example a prompt of 59 words, a chip out of order, a stale preview block).
  Fix what they find, re-run Steps 6 and 7, and have the reviewer confirm each fix.

- [ ] **Step 9: Commit**

```bash
git add CLAUDE.md CONTRIBUTING.md .github/pull_request_template.md README.md CHANGELOG.md sitemap.xml llms.txt famous/index.html
git commit -m "docs: how the Famous effects page is kept (entry template, prompt rules, legal checklist, make-famous, the famous check), its README line and CHANGELOG entry, and the generated files written again"
```

---

### Task 10: The owner's review

**Files:**
- Modify (only on the owner's answers): `famous/index.html` (entries 7 and 8: their `datetime`, or a swap; any change the owner asks for), `CHANGELOG.md` (the number in words, if it changed)

**Interfaces:**
- Consumes: Task 9's branch; the Reserve entries; Task 1's record (the reserves that passed and are still unused).
- Produces: the owner's approval of the real page at phone and desktop sizes, entries 7 and 8 confirmed or swapped, and the owner's word on going live (Task 11).

- [ ] **Step 1: Show the page.** Serve `.claude/worktrees/fx-int` on port 8936 (background) and open it in the browser pane with `mcp__Claude_Browser__preview_start` and the url `http://127.0.0.1:8936/famous/`. Run the pool command with the target `famous` and `--out C:/Users/matin/OneDrive/Desktop/Projects/animation-handbook/.superpowers/sdd/2026-10-14-famous-effects/owner-shots`; send the owner `famous-desktop-full.png`, `famous-phone.png` and `famous-tablet.png`.

- [ ] **Step 2: Ask, in very short words** (one message):

```markdown
Famous effects is ready to look at (open in the pane; screenshots attached).
1. ChatGPT, on your account: send any question. Does a small dot pulse, then the answer appear a few words at a time? (yes/no)
2. X, signed in: press a heart. Does it shrink, pop back and burst with a ring and dots? (yes/no)
3. Two card labels were shortened to fit the page's three-word rule ("On the chip", "Blur to sharp"), and the Medium text ends "slides back into view". OK?
4. Anything to change? If not: may it go live, linked from the home page's footer and the README? The next launch post is Reddit on 2026-10-17.
```

Before 2026-10-18 the message names Reddit on 2026-10-17 as above; from 2026-10-18 it reads "The next launch post is Show HN on 2026-10-25."; from 2026-10-23 to 2026-10-26 it adds "Today is inside the launch window: going live today needs your explicit word for today."

- [ ] **Step 3: Apply the answers.** A yes for entry 7 or 8: its `datetime` becomes the day of the owner's answer (and the year shown stays that day's year). A no: replace that entry with the next reserve that passed and is unused (R1, R2, R3), its chip in the same place, by the Reserve entries section; with none left, remove the entry and its chip, change the pill's number and the CHANGELOG line's number. Any other change the owner asks for: make it within the Global Constraints. Then run `node tools/make-famous.mjs`, `node tools/update-sitemap.mjs`, `node --test "tests/*.test.js"` (every test passes) and the `famous` check (six `ok` lines), show the owner again, and commit:

```bash
git add famous/index.html CHANGELOG.md sitemap.xml
git commit -m "fix: Famous effects as the owner approved it: entries 7 and 8 confirmed on the owner's accounts (or replaced), and the owner's changes"
```

- [ ] **Step 4: Stop the server.** The page waits for the owner's explicit word to go live (Task 11).

---

### Task 11: Release on the owner's word

**Files:**
- Merge `feat/famous-effects` into `main` (release worktree `.claude/worktrees/release`, port 8990), then `main` into `feat/see-inside-compare`

**Interfaces:**
- Consumes: the owner's explicit word for this project (Task 10 Step 2, item 4), given outside 2026-10-23 to 2026-10-26 or with the owner's explicit word for that day.
- Produces: the page live at `https://matinmonshizadeh.github.io/animation-handbook/famous/`, linked from the home page's footer and the README.

- [ ] **Step 1: Take main's latest commits into the branch (coordination rule 2).** Skip when `git log --oneline feat/famous-effects..main` is empty. Otherwise, in `.claude/worktrees/fx-int`:

```bash
git merge --no-ff --no-commit main
node tools/update-sitemap.mjs
node tools/make-skill.mjs
node tools/make-famous.mjs
git add sitemap.xml llms.txt skills famous/index.html
git commit -m "Merge main into feat/famous-effects before its release, with the generated files written again"
```

Resolve overlaps before the tools run, by the map, keeping both sides' lines. Then `node --test "tests/*.test.js"` passes and the `home` and `famous` checks give six `ok` lines each (port 8935).

- [ ] **Step 2: Merge into main (rule 3).** In `.claude/worktrees/release` (on `main`):

```bash
git merge --no-ff --no-commit feat/famous-effects
node tools/update-sitemap.mjs
node tools/make-skill.mjs
node tools/make-famous.mjs
git add sitemap.xml llms.txt skills famous/index.html
git commit -m "Merge feat/famous-effects: the Famous effects page, reached from the home page's footer and the README"
node --test "tests/*.test.js"
```

Expected: every test passes. Serve the release worktree on port 8990 and run the `home` and `famous` checks: six `ok` lines each.

- [ ] **Step 3: Push, on the owner's word only**

```bash
git push origin main
```

Then check the live page after GitHub Pages has built (a minute or two): `curl -s -o /dev/null -w "%{http_code}" https://matinmonshizadeh.github.io/animation-handbook/famous/` prints `200`, and the live home page's footer shows the Famous effects link.

- [ ] **Step 4: The same day, merge main into the rollout's branch (rule 4).** In the main checkout (on `feat/see-inside-compare`):

```bash
git merge --no-ff --no-commit main
node tools/update-sitemap.mjs
node tools/make-skill.mjs
node tools/make-famous.mjs
git add sitemap.xml llms.txt skills famous/index.html
git commit -m "Merge main (Famous effects) into feat/see-inside-compare, with the generated files written again"
```

Resolve overlaps before the tools run, by the map: in `tools/check-pages.mjs` the rollout's Phase 0 lines and the `famous` target both stay and the `learn` target stays gone. A resolution that needs more than keeping both sides is reviewed by a fresh agent. Then the tests pass and `home` and `famous` give six `ok` lines each.

- [ ] **Step 5: Clean up.** Stop every server this project started; remove its worktrees (`git worktree remove .claude/worktrees/fx-<lane>` for each, then `fx-int`) and its merged lane branches (`git branch -d fx/<lane>`); with the owner's OK, delete any `hb-chrome-*` folders left in the temp folder.

---

## Self-review

**Spec coverage.**
- §1 The twelve entries: texts, cards and prompts in Tasks 7 and 8; live check first (Task 1); 7 and 8 at the owner's review (Task 10); "Seen on … in 2026" with the day in `datetime` (Tasks 7, 8, 10).
- §2 Reserves in order (Reserve entries; Tasks 1, 7, 8, 10). §3 Gaps: none is part of this work (nothing to build).
- §4 The page: own page, previews written in by `tools/make-famous.mjs` (Task 2) and kept equal by a test (Task 5); home colors compared (Task 5); no shared file, own copy, toast, Ctrl+C/⌘C and clamp in the pages' words (Task 5); layout (top bar, head, pill, lede, not-connected line, jump row, entries, Suggest, footer without the count: Task 5); entry markup, `data-fx-start`, `data-fx-site`, cards without Copy prompt, three across from 761px (Tasks 5, 7); accessibility, phones and reduced motion (Task 5 CSS and script, checked by Task 3's target).
- §5 Legal checklist: tests for what they can see (Tasks 5, 7), Reviewer A for the rest (Task 9), the rules in `CLAUDE.md` (Task 9).
- §6 Tests: frame, entries, cards, prompts, previews, nothing from elsewhere (Tasks 5, 7, 8); changed tests: sitemap + 2 and `llms.txt` (Task 6), footer link (Task 4).
- §7 Page check: the `famous` target with every listed step (Task 3), run for real in Tasks 5, 7, 8, 9; `home` still six `ok` (Tasks 4, 9).
- §8 Docs and tools: `CLAUDE.md`, `CONTRIBUTING.md`, `README.md`, `CHANGELOG.md` (Task 9), the issue template (Task 5), sitemap and `llms.txt` tools (Task 6); the PR template line comes from the coordination file's map (Task 9).
- §9 and the coordination file: branch from `main`, worktrees `fx-*`, run folder, ports 8931-8939, the slot pool, the pane only while the owner is free, no `git stash`, generated files never merged by hand, merge rules 2-4, the launch window and the release on the owner's word (Global Constraints, Phases, Tasks 9 and 11).

**Placeholder scan.** Every step that writes code or markup shows it in full; the only values filled in at run time are the ones the process produces (the live-check day in `datetime`, the record's corrected sentence, the next launch post's date), each with the rule that sets it.

**Names.** `CSS_START`, `CSS_END`, `JS_START`, `JS_END`, `homeConst`, `previewBlocks`, `replaceBetween`, `cardSlugs`, `buildFamousFrom`, `buildFamous` (Task 2) are the names Tasks 5, 7 and 8 import; `section.fx`, `.fx-seen`, `.fx-what`, `.fx-cards`, `.card[data-slug]`, `.fx-pbox`, `.fx-prompt`, `.fx-toggle`, `.copy`/`.copy-l`, `.fx-jump`, `.fx-lede`, `.fx-legal`, `.fx-suggest`, `#toast .toast-t` are the same in the page (Task 5), the tests (Tasks 5, 7, 8) and the check (Task 3); the labels "Copied", "Copied the prompt for <title>" and "Press Ctrl+C to copy" match between the page script and the check.

**Where this plan differs from the spec's own words, and why (each is shown to the owner in Task 10 where it changes what they see):**
1. Two card labels have four words against the spec's "one to three words" (§4, §6): "Drawn on the chip" → "On the chip", "Out of the blur" → "Blur to sharp".
2. Entry 12's What you see has 24 words against §6's 25 to 70: it ends "slides back into view".
3. Copy prompt's name is "Copy prompt for <title>" (the spec's sketch reads "Copy the prompt for"): the visible label starts the name, as on the home page (WCAG 2.5.3).
4. The prompt sits in a `div.fx-pbox` (the sketch has the `p` alone): the box carries the padding, so the five-line clamp cuts cleanly on phones.
5. The head is a `div.fx-head`, not a section, so it adds no landmark beyond those §4 lists.
6. The frame (Task 5) starts before the live check: it holds no entry, and §9 step 1 only keeps entries waiting.
7. The reserves have no text in the spec: Reserve entries drafts them by the same rules; the owner sees any that is used.
8. "A footer link" on the home page also needs one CSS rule (three links overflow at 320px) and one line for links opened from disk.
9. The sitemap gives `famous/` monthly and 0.8 (the spec sets no values).
