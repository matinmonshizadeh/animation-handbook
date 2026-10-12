# Star button: design

2026-10-12. Part of the launch plan: before the repository is posted anywhere, every visitor gets an easy way to star it.
Today the animation pages link to GitHub only from the footer ("Source on GitHub"), and the home page hides its GitHub
button on phones. The owner picked all three placements below from mockups (`.superpowers/brainstorm/star/`, not committed).

## A · Top bar of every animation page

A pill at the right end of `nav.hb-bar`, after `span.hb-pager`, the same on every page:

```html
<a class="hb-star" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener" aria-label="Star on GitHub"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg><span>Star on GitHub</span></a>
```

- `demo-page.css`: the pager gets `margin-left:auto`, so the pager and the pill sit together at the right. The pill has a
  1px `--hb-edge` border, fully round corners, 14px side padding (none on the round star) and `--hb-soft` text; on hover
  (`@media(hover:hover)`) the border turns `--hb-edge-2` and the text `--hb-ink`. It keeps the bar's 44px link height.
- Computers (from 1061px) read "Star on GitHub". From 820px to 1060px (tablets, larger phones held sideways, small
  laptop windows) it is a round 44px star with no words, like the home page's on phones; its `aria-label` still names
  it. Below 820px (phones, small tablets in portrait, narrow windows) the top bar leaves it out, so the page names keep
  their room: B covers those screens. (Changed after the task review: the word "Star" alone still cut page names on
  tablets, and the full label cut them at 1025–1060px, so the owner chose the round star. Changed again after the final
  review: from 601px to 819px even the round star cut page names on up to 60 of the 166 pages, so the owner moved the
  cut-off from 601px to 820px.)
- The star is the same outline star as the home page's GitHub button.

## B · Under Copy prompt on every animation page

A row inside `section.hb-prompt-step`, right after `div.hb-card`, the same on every page (pages without Try it too):

```html
<div class="hb-star-row"><p>Free and open source. If this helped, a star on GitHub helps other people find it.</p><a class="hb-star-btn" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener"><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>Star on GitHub</a></div>
```

- `demo-page.css`: a wrapping flex row (gap 12px 20px); the sentence is 15px `--hb-dim` and takes the free space; the
  link is an outline pill (1px `--hb-edge` border, 44px high, 18px side padding, 600 weight, `--hb-ink`, 16px icon),
  with the same hover as A. On phones the link is full width with its text centered.
- It sits outside the card, so the card stays about the prompt and Copy prompt stays the main button.

## C · Home page on phones

`index.html` only. The existing GitHub button (`#gh-stars`) comes back on screens of 760px and less as a round 44×44
star, next to the dark-mode button, with no word and no count:

- the word "GitHub" in the button is wrapped in `<span class="gh-t">`, which is hidden from sight (still read out, the
  way the search button's label is) at 760px and less; the count (`.gh-c`) is hidden there;
- below 360px wide there is no room, so the button is hidden, as it is today;
- from 360px to 760px it fits on the top bar's one line, inside the page's side margins. The tightest width is 601px,
  where "Browse all" and "How it works" are shown too: in the mockup the round star ends 6px past the right margin there,
  so the gaps between the top bar's items shrink just enough at that width (measured, not guessed).

Computers keep today's button ("GitHub ★ 8") unchanged, so `og-image.png` does not change.

## Shared files, docs and checks

- `demo-page.css` changes, so the version goes from `v=7` to `v=8` on all 166 pages and the home page, in the same change.
- `CLAUDE.md`: the page template names the Star link in the top bar and the star row under the prompt card (copy them
  from a neighbor, like the footer).
- `tests/pages.test.js`: every page has exactly one top-bar Star link and one star row, character for character as above
  (as the footer test does), and the Star link comes after the pager.
- `tools/check-pages.mjs`: the star row's link joins the phone touch-target check (today it measures `.hb-bar a` but not
  links inside the page).
- `CHANGELOG.md`: a line under a new "Unreleased" heading.
- The links to the repository use `rel="noopener"` with no `noreferrer` (the owner's choice after the final review):
  GitHub's Referring sites can then count the site; only the site's origin is sent.
- Done when the tests pass, the page check gives six `ok` lines for every page, and the home check gives six `ok` lines.

## Not in this change

- No live star count on the animation pages: they load only files from this repository.
- The footer stays "Source on GitHub"; `404.html` and the README do not change.
