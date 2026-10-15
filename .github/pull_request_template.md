<!-- Thanks for contributing to Animation Handbook! -->

## What does this PR do?

<!-- New technique? Bug fix? Improvement to an explanation? Name the pages it changes. -->

## Every change

- [ ] `node --test "tests/*.test.js"` passes
- [ ] The page check gives six `ok` lines for every page the change touches (`node tools/check-pages.mjs --base http://127.0.0.1:<port> <page folder>`)
- [ ] If the change touches the home page, or a page's settings or prompt, the home page check gives six `ok` lines too (`node tools/check-pages.mjs --base http://127.0.0.1:<port> home`)
- [ ] If the change touches the Famous effects page (`famous/`), its cards or a preview it shows, `node tools/make-famous.mjs` has run and its check gives six `ok` lines too (`node tools/check-pages.mjs --base http://127.0.0.1:<port> famous`)
- [ ] If a shared file changed (`assets/css/demo-page.css`, `assets/js/demo-page.js`), `?v=N` is bumped on every page and on the home page

## A new technique

- [ ] One folder under `animations/<category>/<slug>/` with `index.html` and `README.md`, and optionally `preview.gif` or `preview.png`
- [ ] Copied from a page of the same kind, with `data-hb-kind` on the body and the player bar unchanged; plain HTML, CSS and JavaScript, under ~300 lines, no external requests, works offline
- [ ] The README has all six sections (What it is, When to use it, How it works, Key parameters, Production notes, See also) and `[Live demo](https://matinmonshizadeh.github.io/animation-handbook/animations/<category>/<slug>/)` on the line under its title
- [ ] Responsive (reflows at 375px, touch targets ≥ 44px, works with touch), works from the keyboard, respects `prefers-reduced-motion` and animates only `transform` and `opacity`
- [ ] Linked in: the page before it has a Next link to it and the page after it a Previous link, each replacing the old one, and the `NN.MM` category line of every later page is renumbered
- [ ] A card in the category's `entries` in the `CATS` array of the root `index.html` (slug, name, the page's one-line description), its places in `PLACES` (in the same order as `CATS`) and its own preview: its key in `PV`, its CSS in the category's bespoke block, a `case` in `pvMarkup()` and a `STILL` point if the middle of its loop is not a clear frame
- [ ] In the category's `README.md` list and in the root `README.md` catalog, with the name linked to its live page and the same one-line description
- [ ] The technique count updated where it is written: the root `README.md` (the total and the category's count), the home page (its title and meta tags too), `.github/ISSUE_TEMPLATE/config.yml` and `404.html` (its Browse all link)
- [ ] `og-image.png` drawn again with the repo served: `node tools/make-social-image.mjs --base http://127.0.0.1:<port>`
- [ ] `sitemap.xml` written again: `node tools/update-sitemap.mjs`
- [ ] The page check gives six `ok` lines for the new page and for every page edited, and so does the home page check (`node tools/check-pages.mjs --base http://127.0.0.1:<port> home`)

## Screenshot / GIF

<!-- Drop a short recording of the demo if you can. -->
