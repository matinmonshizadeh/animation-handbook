<!-- Thanks for contributing to Animation Handbook! -->

## What does this PR do?

<!-- New technique? Bug fix? Improvement to an explanation? -->

## Checklist

- [ ] One technique = one folder under `animations/<category>/<slug>/`
- [ ] Folder contains exactly `index.html` and `README.md`
- [ ] Copied from a page of the same kind, with `data-hb-kind` set on the body and the player bar unchanged
- [ ] No build step, no frameworks, no external/CDN requests — runs offline
- [ ] Under ~300 lines
- [ ] README has all six sections (What it is / When / How / Key parameters / Production notes / See also)
- [ ] Registered in the root `index.html` `CATS` array (with the page's one-line description) and in `sitemap.xml`
- [ ] Listed in the category `README.md` and the root `README.md` with the same name and description
- [ ] Linked from its neighbors (Next / Previous, each replacing the old link), and the `NN.MM` category line of later pages renumbered
- [ ] Technique count updated where it is written (root `README.md`, home page, `tests/pages.test.js`, `.github/ISSUE_TEMPLATE/config.yml`, `docs/launch-kit.md`)
- [ ] Responsive: reflows at 375px, touch targets ≥ 44px, works with touch
- [ ] Respects `prefers-reduced-motion`
- [ ] Animates only `transform` / `opacity`
- [ ] If a shared file changed, `?v=N` is bumped on every page
- [ ] `node --test "tests/*.test.js"` passes and the page check gives six `ok` lines for the page

## Screenshot / GIF

<!-- Drop a short recording of the demo if you can. -->
