# Next projects: coordination

2026-10-13. What four projects share: See inside and Compare on every page (**the rollout**,
`2026-10-13-see-inside-compare-rollout-design.md`), the Animation finder (**the finder**, `2026-10-13-animation-finder-design.md`),
Famous effects (`2026-10-13-famous-effects-design.md`) and ten new animations (`2026-10-13-ten-new-animations-design.md`),
plus the later tab pass. Each spec points here; where a spec and this file disagree, this file wins. The coordinator (the
main session) owns everything below. Sources: the cross-review of the four specs
(`.superpowers/sdd/2026-10-13-learn-pilot/spec-cross-review.md`) and the owner's answers of 2026-10-13.

## Order (owner, 2026-10-13)

1. **The rollout,** from 2026-10-14: Phase 0, the first batch and the owner's look, the other 159 pages, integration, the
   final review and the owner's final look. Live in one piece on the owner's word.
2. **The finder and Famous effects,** at the same time, beside Phase 0 and the owner's first-batch look (about a day of agent
   work each). Each goes live as soon as it is ready and the owner approves it: the finder reached from the home page (the
   button under the search, the Finder link in its top bar), Famous effects from the home page's footer and the README.
3. **The ten new animations,** right after the rollout's Phase 0 (owner, 2026-10-14), beside the first batch and the other
   159 pages, on their own branch; built without the new tabs. Their branch is merged into the rollout's at the start of the
   rollout's integration, so its final review, gallery and final look cover all 176 pages, and both go live together on the
   owner's word.
4. **The tab pass:** Finder and Famous effects tabs on all 176 pages, Famous effects in the home page's bar, Finder in the
   Famous effects page's bar, and 404's bar if decided. The coordinator writes its short spec after the ten new animations
   are integrated, from the finder spec's section 7.
5. **Paused:** the learning path and Motion basics, on `feat/learn-pilot`; they resume after these by reverting the
   rollout's clean-up commit.

If the finder or Famous effects is not live when the ten new animations are due to start, the coordinator asks the owner
whether they wait for it or take it in (it then goes live with them).

## Branches and places

| Project | Branch | Cut from | Worktrees (`.claude/worktrees/`) | Run folder (`.superpowers/sdd/`) | Ports |
|---|---|---|---|---|---|
| Rollout | `feat/see-inside-compare`; slots `sic/<NN><letter>`, categories `sic/cat-NN` | as it is | `sic-<NN><letter>` | `<start date>-see-inside-compare/` | 8800 (before-pictures), 8801–8820 (slots), 8821–8850 (re-cut slots, the probe, lanes, category checks, final review, integration) |
| Finder | `feat/animation-finder` | `main` | `af-*` | `<start date>-animation-finder/` | 8901–8909 |
| Famous effects | `feat/famous-effects` | `main` | `fx-*` | `<start date>-famous-effects/` | 8931–8939 |
| Ten new | `feat/ten-animations`; lanes `ten/L<n>` | `feat/see-inside-compare` once Phase 0 is merged (owner, 2026-10-14); merged back into it at the start of the rollout's integration | `ten-L<n>` | `<start date>-ten-animations/` | 8961–8970 |
| Tab pass | set in its spec | the branch that holds the ten new pages (`main` once they are live) | set in its spec | set in its spec | set in its spec |
| Releases | `main` | — | `release` | — | 8990 |

- `feat/see-inside-compare` holds the unapproved pilot (the switch on Parallax Scrolling, and its lesson line and `learn/`
  until Phase 0 removes them), so nothing that may go live before the rollout is cut from it.
- The main checkout stays on `feat/see-inside-compare` for the whole run: every agent reads its CLAUDE.md, and review
  servers serve it. It is never switched to another branch.
- The before-pictures server (8800) serves a detached checkout of main, so `main` stays free for the release worktree.
- `feat/learn-pilot` stays as it is.

## Machine

- One pool of eight page checks for the whole machine: `slots/slot-1…8` in the rollout's run folder, made by the coordinator
  before any project starts. A check takes a slot by creating its folder (an atomic step) and removes it when done; the ten
  new animations and the tab pass use the same pool.
- Headless Chrome only for page checks; the browser pane is the owner's. The one exception is Famous effects' live check of
  real sites, in the pane, only while the owner is not reviewing there.
- One server and one scratch folder per worktree; no `git stash` (all worktrees share it); leftover `hb-chrome-*` temp
  folders removed at the end with the owner's OK.
- On a usage-limit hit, the finder and Famous effects pause first, then the rollout runs fewer slots.

## Who changes which file

Each project changes only what is named here; the coordinator merges one project at a time.

| File | Changed by | Rule |
|---|---|---|
| Animation pages (`animations/*/*/index.html`) | rollout (each page's views, one commit per page) · ten new (ten new pages, the Next link on five last pages) · tab pass (every top bar) · the version line: whoever bumps it (below) | the finder and Famous effects never |
| `index.html` (home page) | finder (`FIND_Q`, `FIND`, `findMatches`, the view and its CSS, the Find button, the Finder link in the bar) · Famous effects (a footer link) · ten new (cards, `PLACES`, `FIND` rows, previews, counts) · tab pass (Famous effects in the bar) · the version line: whoever bumps it (below) | each only its own lines |
| `assets/css/demo-page.css`, `assets/js/demo-page.js`, `tests/demo-page.test.js` | rollout (Phase 0; the first batch if the owner asks; integration) · ten new (integration, if needed) · tab pass | only these, in this order, each with the next version number |
| `tools/check-pages.mjs` | rollout (Phase 0: the do-it path, captions and copies, the `learn` target removed) · finder (steps in `home`) · Famous effects (the `famous` target) · tab pass (the bar) | the finder and Famous effects add new functions and blocks, and touch shared lines only to list `famous` (usage line, header, target list) |
| `tests/pages.test.js` | rollout (switch tests, the final gate, lesson selectors removed) · finder (404 cases) · Famous effects (sitemap count, footer link) · ten new (`KEYBOARD_PAGES`, `PHONE_DEFAULTS`) · tab pass (the pinned bar) | each its own test blocks |
| `tests/finder.test.js` | finder (new) · ten new (Ink Spread Reveal joins case 9 at integration) | |
| `famous/`, `tools/make-famous.mjs`, `tests/famous.test.js`, `tools/update-sitemap.mjs`, `tools/make-skill.mjs`, `tests/skill.test.js` | Famous effects | |
| `tools/make-social-image.mjs` | finder (hides `.find-cta`, `#nav-find`) · tab pass (hides its home-bar link) | |
| `404.html` | finder (`whereTo`, a third way back) · ten new (the count) · tab pass (its bar, if decided) | |
| `.github/ISSUE_TEMPLATE/` | finder (`animation_not_here.yml`, a contact link in `config.yml`) · Famous effects (`famous_effect.yml`) · ten new (the count in `config.yml`) | |
| `CLAUDE.md`, `CONTRIBUTING.md`, `.github/pull_request_template.md` | finder · Famous effects · rollout · tab pass | written at each project's integration, in merge order, on top of what main holds by then |
| `README.md`, `CHANGELOG.md` | rollout (How to use, step 2) · finder (step 1) · Famous effects (a line after step 3) · ten new (counts, catalog); one Unreleased line each | each only its own lines |
| Every written count (166 → 176) | ten new only | |
| Generated files | nobody by hand | merging rule 5 |

## Version numbers (`?v=N` on the shared files)

- Today: 8 on main (live), 9 on `feat/see-inside-compare` (the pilot).
- 10: the rollout's Phase 0.
- Then the next number, each only if needed: a shared change the owner asks for at the first batch (before the other 159
  pages start); the rollout's integration (changes from the lanes' ledgers); the ten new animations' integration.
- The tab pass always takes the next number.
- A bump covers every animation page and the home page in one commit, on tracked files only (`git ls-files`), line endings
  kept. The Famous effects page links neither shared file. When main is merged into a branch, the higher number wins.

## Merging and releasing

1. **Merge, never rebase or squash.** Slots and lanes change only what their own spec allows and never take main's commits
   themselves.
2. **Before its release,** a branch takes main's latest commits: the coordinator merges main into it, resolves the overlaps
   (rule 6), writes the generated files again (rule 5) and runs the tests, `home` and `famous` (once it exists).
3. **Release,** only on the owner's word for that project: in the release worktree (on `main`) the coordinator merges the
   branch with `--no-ff`, writes the generated files again (rule 5), runs the tests, `home` and `famous` (once it exists) on
   the result, then pushes. When asking for the word, the coordinator names the next launch post.
4. **The same day,** while the rollout is not yet live, the coordinator merges main into `feat/see-inside-compare` the same
   way as rule 2.
5. **Generated files are never merged by hand:** `sitemap.xml`, `llms.txt`, `skills/animation-handbook/`, `og-image.png`
   and the two marked blocks of `famous/index.html`. After any merge, take either side, run `node tools/update-sitemap.mjs`,
   `node tools/make-skill.mjs`, `node tools/make-famous.mjs` (once `famous/` exists) and, when the home page's top changed,
   `node tools/make-social-image.mjs` (with the repo served), and commit the result in the merge.
6. **The coordinator alone resolves overlaps,** by the table above: each project keeps its own lines. Where a resolution
   needs more than keeping both sides (the `learn` target gone while `famous` stays), a fresh agent reviews it.
7. **Launch posts:** Reddit on 2026-10-17, Show HN on 2026-10-25. Nothing merges into main from 2026-10-23 to 2026-10-26
   without the owner's explicit word for that day, so the rollout can go live before Show HN if it is approved by
   2026-10-22, and otherwise after 2026-10-26.
