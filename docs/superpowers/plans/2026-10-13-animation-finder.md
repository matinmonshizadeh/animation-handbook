# Animation Finder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Animation finder to the home page (three picture-button questions: what moved, when, how; the matching animations below, best first; a Not here? link to a short GitHub form), and give all 166 animations the answers a visitor would pick, checked against the spec's frozen set of 28 described effects.

**Architecture:** The finder is a view of the home page, `?view=find`, like All animations. `index.html` gains the questions (`FIND_Q`), every card's answers (`FIND`, right after `PLACES`), pure functions (`findMatches(answers)` → `{best, close}` and its helpers) that the tests run with `node:vm` as they run the search, the finder section with its CSS and 17 small moving pictures, the Find button and the Finder link; the results reuse the cards. Seven tagging lanes write the answers into ledgers in the run folder while the page is built on draft answers; integration writes the reviewed answers into `FIND` and adds the test set. Around it: a GitHub issue form, two 404 routes, new page-check steps and the docs.

**Tech Stack:** Plain HTML, CSS and vanilla JavaScript in `index.html` (no build, no dependencies); the Node 22+ test runner (`node --test`) reading the page's code with `node:vm`; the repo's Chrome-driven page check (`tools/check-pages.mjs`); a GitHub issue form (YAML); small Node helper scripts that live in the run folder, outside git.

**Spec:** `docs/superpowers/specs/2026-10-13-animation-finder-design.md` (the finder) and `docs/superpowers/specs/2026-10-13-next-projects-coordination.md` (branches, the file map, generated files, releases; it wins where the two differ). Both are committed on `feat/see-inside-compare` (03a00d0): read them in the main checkout, never in a finder worktree (cut from `main`, it has neither). Owner rulings of 2026-10-13: Not here? opens a short GitHub issue form with the visitor's answers filled in; the finder goes live as soon as it is ready and the owner approves it, reached from the home page (the Finder tab on every animation page comes later, in a separate pass).

## Global Constraints

- Branch `feat/animation-finder`, cut from `main` (d3e1786 on 2026-10-13, or `main`'s head when Task 0 runs, which must equal `origin/main`); never from `feat/see-inside-compare`.
- Lanes are branches `af/<lane>` cut from `feat/animation-finder`, each in its own worktree `.claude/worktrees/af-<lane>`; the coordinator merges them into `feat/animation-finder` with `git merge --no-ff` in `.claude/worktrees/af-int`; never rebase, squash or amend a pushed commit.
- The main checkout stays on `feat/see-inside-compare` for the whole run; never switch it and never commit finder work there.
- Run folder: `.superpowers/sdd/<date Task 0 runs>-animation-finder/` in the main checkout (`$RUN` below); ledgers, briefs, helper scripts, stills and reviews live there, outside git.
- Ports 8901 to 8909 only (table below); one server per worktree, `python -m http.server <port> --bind 127.0.0.1` from the worktree root as a background command, stopped when its lane ends.
- Every page check and every other headless Chrome run takes a slot from the shared pool of eight (`slots/slot-1…8` in the rollout's run folder) and frees it afterwards; never the browser pane (it is the owner's).
- Files the finder changes: `index.html`, `tests/finder.test.js` (new), `tests/pages.test.js` (one new 404 test block), `tools/check-pages.mjs` (new functions and one new block in the home branch of the main loop), `tools/make-social-image.mjs`, `404.html`, `.github/ISSUE_TEMPLATE/animation_not_here.yml` (new), `.github/ISSUE_TEMPLATE/config.yml`; at integration only `CLAUDE.md`, `CONTRIBUTING.md`, `.github/pull_request_template.md`, `README.md` (How to use it, step 1), `CHANGELOG.md` (one Unreleased line) and the generated `sitemap.xml` (the home page's date).
- Never changed: the 166 animation pages, `assets/css/demo-page.css`, `assets/js/demo-page.js`, `tests/demo-page.test.js`, `tools/update-sitemap.mjs`, `tools/make-skill.mjs`, `tests/skill.test.js`; no `?v=N` bump anywhere.
- Generated files (`sitemap.xml`, `llms.txt`, `skills/animation-handbook/`, `og-image.png`) are written only by their tools, never edited or merged by hand.
- No dependencies: plain HTML, CSS and vanilla JavaScript; nothing from a CDN; the home page loads only files from this repository and still works opened from disk.
- No code on the site and plain words: the finder's texts are exactly those of "The contract" below; American spelling; no hype.
- Accessibility: native radios in fieldsets with legends, each answer named by its words, pictures `aria-hidden`; the site's 3px focus ring; every finder control at least 44×44px on phones (≤600px wide); text at least 4.5:1 in both themes; no sideways scroll at 320px; keyboard focus moves only as the contract says.
- Motion: the finder animates only `transform` and `opacity`; its `@keyframes` names start `fd-`; no `@keyframes` name appears twice in `index.html`; under reduced motion nothing in the finder moves and every How picture shows a still with a small arrow.
- Do not use `git stash` (every worktree shares it); compare versions with `git show <rev>:<path> > <scratch file>`.
- Type `·`, `—`, `“` and `”` as the characters themselves in `index.html` and the tests (both compare them literally); never type a backslash-u escape through Write or Edit (it stores the raw character).
- Tests: `node --test "tests/*.test.js"` from the worktree root passes at every commit; a step that writes a new test first says which test fails until the next step.
- Home check: `node tools/check-pages.mjs --base http://127.0.0.1:<port> home` prints six `ok` lines from Task 5 on (Tasks 3 and 4 name the finder problems still expected before it).
- Test target: of the spec's 28 described effects, a right animation is among the first 6 results for at least 24 and among the first 12 for at least 27; of the held-out set, at least 7 of 10 among the first 6.
- Taggers and tag checkers never open the spec, this plan or `tests/finder.test.js` (they hold the test set); their brief is all they get.
- Commit messages: `feat:`, `fix:`, `test:`, `docs:` or `chore:` and one plain-words sentence, in the repo's style; no Co-Authored-By line.
- Nothing is pushed and nothing is created on GitHub before Task 17, and then only on the owner's word; nothing merges into `main` from 2026-10-23 to 2026-10-26 without the owner's word for that day.

## Paths, ports and slots

Shell variables do not last between commands, so begin each Git Bash command with the assignments it uses:

- `MAIN=C:/Users/matin/OneDrive/Desktop/Projects/animation-handbook`
- `WT=$MAIN/.claude/worktrees`
- `RUN=$MAIN/.superpowers/sdd/2026-10-14-animation-finder` (the date Task 0 runs: 2026-10-14 if it starts beside the rollout's Phase 0 as planned, otherwise that day's date; Task 0 writes the real path into `$RUN/env.md`)
- `SLOTS=$MAIN/.superpowers/sdd/2026-10-14-see-inside-compare/slots` (the rollout's pool; Task 0 writes the real path into `$RUN/env.md`)

| Port | Worktree | Branch | Used by |
|---|---|---|---|
| 8901 | `af-logic` | `af/logic` | Task 1 |
| 8902 | `af-pics` | `af/pics` | Task 2 |
| 8903 | `af-view` | `af/view` | Tasks 3, 4, 5 |
| 8904 | `af-check` | `af/check` | Task 7 |
| 8905 | `af-tags` | detached at the branch's start | Tasks 8, 9 (one server for the seven lanes) |
| 8906 | `af-int` | `feat/animation-finder` | Tasks 10, 11, 13, 15, 16 |
| 8907 | `af-final` | detached at the reviewed commit | Task 14 |
| 8908, 8909 | spare | | |
| 8990 | `release` | `main` | Task 17 (the coordination file's release port) |

`af-404` (Task 6) needs no server.

**Taking a slot** (before every page check and every `shoot.mjs` run):

```bash
for n in 1 2 3 4 5 6 7 8; do mkdir "$SLOTS/slot-$n" 2>/dev/null && { echo "took $SLOTS/slot-$n"; break; }; done
```

No line printed means all eight are busy: wait a few minutes (Monitor) and run it again. When the run ends, also when it fails, free the slot with `rmdir "$SLOTS/slot-<n>"`.

## The contract

Tasks 3, 4 and 5 build exactly this; Task 7 checks it; the tests pin the words.

**Address and history.** `?view=find` opens the finder; then `&what=<key>`, `&when=<key>`, `&how=<key>` for each question answered, in that order; then `&all=1` after Show all. A value that is not one of the question's keys counts as Not sure. `?q=` still wins over any view. The Find button and the Finder link add one history step; an answer, Start over and Show all only replace the address; Describe it in words adds one step (to the start page).

**Markup in `index.html`.**
- Top bar: `<a class="lnk" id="nav-find" href="?view=find">Finder</a>` right before `<a class="lnk" id="nav-all" href="?view=all">Browse all</a>`; it carries `aria-current="page"` in the finder and nowhere else.
- Hero: `<a class="find-cta" href="?view=find">Don't know the name? Find it</a>` right after the `<p class="pop">…</p>` line.
- `<section class="wrap finder" id="finder" aria-labelledby="find-title" hidden>` between the place tiles' section and `<section class="wrap results" id="results" …>`. In the finder `.home-hero` and the place tiles' section are hidden and `#finder` shows; everywhere else the reverse.
- Inside it: `<h1 class="h1 fd-h" id="find-title" tabindex="-1">Find an animation you saw</h1>`, `<p class="sub">Saw an animation on a website and don't know its name? Answer three short questions. The animations that match play below, with their names.</p>`, `<div class="fd-qs" id="find-qs"></div>` (the script builds the questions into it) and `<div class="fd-go"><button type="button" class="fd-btn" id="find-see" hidden>See 0 matches</button><button type="button" class="pillbtn" id="find-reset">Start over</button></div>`.
- The built questions: `fieldset.fd-q.fd-what` (then `.fd-when`, `.fd-how`) > `legend` (`span.fd-n` with the number, then the title) [+ `p.fd-hint` for How] > `div.fd-as` > one `label.fd-a` per answer around `input.fd-r[type=radio][name=fd-<question>][value=<key>][autocomplete=off]`, then `svg.i.fd-icon` (What, When) or `span.fd-pic.fd-<key>` holding four `<i>` (How), then `span.fd-w` with the words; last `label.fd-a.fd-unsure` with the value `unsure` and the words `Not sure`.
- Not here?, right after `<div class="more" id="more">…</div>`: `<div class="fd-not" id="find-not" hidden>` holding `<h3 class="fd-not-t">Not here?</h3>`, `<p class="fd-not-s" id="find-not-s">…</p>`, `<p class="fd-not-acts"><a class="fd-btn" id="find-gh" href="…" target="_blank" rel="noopener">Tell us on GitHub</a><button type="button" class="pillbtn" id="find-words">Describe it in words</button></p>` and `<p class="fd-fine">The form is on GitHub and needs a free account.</p>`.

**Words.**
- The tab's title in the finder: `Find an animation you saw — Animation Handbook`.
- `#results-title`: `Your matches`. `#results-sub`, written 400 ms after an answer and at once on any other change: no answer (or only Not sure) → `Answer a question above, and the animations that match show here.`; Best and Close → `5 best matches and 9 close matches.` (`1 best match`, `1 close match`); Best only → `5 best matches.`; Close only → `No animation fits all your answers. These come close.`; neither → `No animation fits these answers yet.`
- Groups: `section.group.fd-group` > `h3.ghead` with `span.gname` (`Best matches`, `Close matches`) and `span.gcount` (`N animations`, `1 animation`); Close adds `p.fd-gline` `They fit all but one of your answers.`; card titles carry `aria-level="4"`; the first 12 cards show, then `#more-label` reads `Show all N matches`.
- `#find-see`: `See N matches` (`See 1 match`), hidden while nothing matches.
- `#find-not-s`: `Tell us what you saw. We use it to add the animation or to fix the finder.`; when nothing matches: `Nothing fits these answers yet. Try Not sure on one question, or tell us what you saw.` The panel shows whenever a question has a real answer.
- `#find-gh`'s address is `findIssueURL(state)`.

**Keyboard focus.** See N matches → the results heading, brought into view. Start over → `#find-title`, page at the top. Show all → the 13th card's link. The Find button and the Finder link → `#find-title`, page at the top. Describe it in words → the search box `#q`. Back or Forward that hides the focused control → `#find-title` in the finder, `#results-title` elsewhere. An answer never moves focus and never scrolls the page.

**Phones and motion.** `#pinbar` never shows in the finder. Every `.fd-a`, button and link of the finder and of its results is at least 44×44px on phones. Under reduced motion no animation runs in the finder and each `.fd-pic` holds a still with a small arrow.

**Script names** (globals of the home page's script, read by the tests with vm and called by the page check): `FIND_Q`, `FIND`, `findQuery(answers)`, `findWords(answers)`, `findScore(slug, answers)`, `findMatches(answers)`, `findIssueURL(answers)`, `fromURL()`, `writeURL(push)`.

## Phases

- **Phase 0, coordinator:** Task 0.
- **Phase A, at once:** Task 1 (`af-logic`), Task 6 (`af-404`), Task 7 (`af-check`), and the seven tagging lanes: Task 8 in each lane, then that lane's Task 9 as soon as its Task 8 is done.
- **Phase B:** once Task 1 is merged, Task 2 (`af-pics`); once Tasks 1 and 7 are merged, the view lane `af-view` runs Task 3, then Task 4, then Task 5, each reviewed and merged before the next starts. The tagging lanes keep running beside it.
- **Phase C, integration:** once every code task is merged and every lane's Task 9 is approved: Task 10, Task 11, then Task 12 and Task 13 at once, then Task 14, Task 15, Task 16 (only if the owner asks for it at Task 15) and Task 17 (only on the owner's word).
- **Review and merge:** every builder or tagger is followed by a fresh reviewer (never the builder), at most three fix rounds by the same builder, then the coordinator decides (a design question goes to the owner). When a code task's review is clean the coordinator merges it, `git -C "$WT/af-int" merge --no-ff af/<lane> -m "Merge af/<lane>: <what it adds, in plain words>"`, runs the tests in `af-int` and logs it in `$RUN/progress.md`.
- **Agents:** the strongest model for every builder, tagger, checker and reviewer (the owner: quality first, cost no concern).
- **Time:** about one day of agent work (tags and page side by side, 4 to 5 hours each; integration and review 2 to 3 hours), plus the owner's look. On a usage-limit hit the finder pauses before the rollout does.

---

### Task 0: Branch, worktrees, run folder and the run's helper scripts (coordinator)

**Files:**
- No file in git changes.
- Create (run folder): `$RUN/env.md`, `$RUN/progress.md`, `$RUN/home-data.mjs`, `$RUN/lint-tags.mjs`, `$RUN/card-facts.mjs`, `$RUN/shoot.mjs`, `$RUN/lanes/01…07/brief.md`, `$RUN/lanes/01…07/check-brief.md`

**Interfaces:**
- Produces: branch `feat/animation-finder` checked out in `$WT/af-int`; worktrees `af-logic` (`af/logic`), `af-404` (`af/404`), `af-check` (`af/check`), `af-tags` (detached); a server on 8905 serving `af-tags`.
- Produces in `$RUN/home-data.mjs`: `readHome(file = 'index.html')` → `{ text, eol, blockEnd(from), valueOf(name), functionSource(name) }`; `KEYS` (`{ what: string[], when: string[], how: string[] }`); `MAX` (`{ what: 3, when: 3, how: 4 }`); `tagRows(markdown)` → `string[][]` (the cells of each row of a tags table, header and divider left out).
- Produces: `node $RUN/lint-tags.mjs <tags.md>` (prints problems or `ok: …`, exit 1 on problems); `node $RUN/card-facts.mjs <NN> $RUN`; `node $RUN/shoot.mjs --url … [--size WxH] [--mobile] [--theme light|dark] [--reduce] [--wait ms] [--eval js] [--shot file] [--full]`.

- [ ] **Step 1: Check that `main` is the live site and nothing is in the way**

```bash
MAIN=C:/Users/matin/OneDrive/Desktop/Projects/animation-handbook
git -C "$MAIN" fetch origin
git -C "$MAIN" rev-parse main origin/main
git -C "$MAIN" branch --list feat/animation-finder 'af/*'
git -C "$MAIN" worktree list | grep '/af-' || echo "no af worktrees"
```

Expected: the two hashes are the same; no branch is listed; `no af worktrees`. If the hashes differ, stop and bring `main` up to date in the release worktree first.

- [ ] **Step 2: Cut the branch and make the Phase A worktrees**

```bash
MAIN=C:/Users/matin/OneDrive/Desktop/Projects/animation-handbook; WT=$MAIN/.claude/worktrees
git -C "$MAIN" branch feat/animation-finder main
git -C "$MAIN" worktree add "$WT/af-int" feat/animation-finder
git -C "$MAIN" worktree add -b af/logic "$WT/af-logic" feat/animation-finder
git -C "$MAIN" worktree add -b af/404 "$WT/af-404" feat/animation-finder
git -C "$MAIN" worktree add -b af/check "$WT/af-check" feat/animation-finder
git -C "$MAIN" worktree add --detach "$WT/af-tags" feat/animation-finder
git -C "$MAIN" worktree list | grep '/af-'
```

Expected: five lines, for `af-int`, `af-logic`, `af-404`, `af-check` and `af-tags`.

- [ ] **Step 3: The run folder, the slot pool, `env.md` and the ledger**

```bash
MAIN=C:/Users/matin/OneDrive/Desktop/Projects/animation-handbook
RUN=$MAIN/.superpowers/sdd/$(date +%F)-animation-finder
mkdir -p "$RUN"/lanes/{01,02,03,04,05,06,07} "$RUN/pics" "$RUN/owner" "$RUN/final"
ls -d "$MAIN"/.superpowers/sdd/*-see-inside-compare/slots 2>/dev/null || echo "no slot pool yet"
```

If it prints `no slot pool yet`, make the pool where the coordination file puts it, in the rollout's run folder: `mkdir -p "$MAIN/.superpowers/sdd/<rollout start date, 2026-10-14 as planned>-see-inside-compare/slots"`.

Write `$RUN/env.md` with the real values:

```markdown
# Animation finder run: where things are
- Plan: docs/superpowers/plans/2026-10-13-animation-finder.md (main checkout)
- MAIN=C:/Users/matin/OneDrive/Desktop/Projects/animation-handbook (stays on feat/see-inside-compare)
- WT=$MAIN/.claude/worktrees
- RUN=<this folder's full path>
- SLOTS=<the slot pool's full path>
- feat/animation-finder cut from main <hash> on <date>, checked out in $WT/af-int
- Servers: af-logic 8901, af-pics 8902, af-view 8903, af-check 8904, af-tags 8905, af-int 8906, af-final 8907
```

Write `$RUN/progress.md`:

```markdown
# SDD ledger — plan: docs/superpowers/plans/2026-10-13-animation-finder.md

Branch feat/animation-finder from main <hash>, <date>. Lanes run in parallel in worktrees (owner: parallel agents, quality first).
```

- [ ] **Step 4: `$RUN/home-data.mjs`, shared by every helper script**

```js
// Reads the home page of the checkout a command runs in (index.html in the current folder) as the tests read it: its text, its
// line ending, the value of any `const NAME=` of plain data in its script (run with vm) and the source of any function. Also the
// finder's answer keys and the rows of a lane's tags table. Shared by the scripts of the Animation finder's run folder.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

export function readHome(file = 'index.html') {
  const text = readFileSync(file, 'utf8');
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  // Where the bracket that opens at text[from] ('[' or '{') is closed, stepping over strings and // comments.
  const blockEnd = from => {
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
  };
  const valueOf = name => {
    const at = text.indexOf(`const ${name}=`);
    if (at < 0) throw new Error(`index.html has no const ${name}=`);
    const from = at + `const ${name}=`.length;
    return vm.runInNewContext('(' + text.slice(from, blockEnd(from) + 1) + ')');
  };
  const functionSource = name => {
    const at = text.indexOf(`function ${name}(`);
    if (at < 0) throw new Error(`index.html has no function ${name}`);
    return text.slice(at, blockEnd(text.indexOf('{', at)) + 1);
  };
  return { text, eol, blockEnd, valueOf, functionSource };
}

// The finder's answer keys (spec, section 2), for checking ledgers made before FIND_Q exists on the checkout they read.
export const KEYS = {
  what: ['text', 'card', 'button', 'menu', 'loader', 'shape', 'particles', 'background', 'page'],
  when: ['scroll', 'hover', 'click', 'drag', 'load', 'newpage', 'loop'],
  how: ['fade', 'slide', 'grow', 'turn', 'bounce', 'stagger', 'pieces', 'follow', 'color', 'morph', 'draw', 'reveal', 'layers', 'pin', 'drift', 'wave', 'glitch']
};
export const MAX = { what: 3, when: 3, how: 4 };

// The cells of each row of a lane's tags table (| slug | what | when | how | reason |), the header and divider rows left out.
export const tagRows = markdown => markdown.split(/\r?\n/)
  .filter(line => /^\|\s*[a-z0-9]/.test(line) && !/^\|\s*slug\s*\|/.test(line))
  .map(line => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(cell => cell.trim()));
```

- [ ] **Step 5: `$RUN/lint-tags.mjs`, then check that it catches mistakes**

```js
#!/usr/bin/env node
// Checks one lane's finder answers ($RUN/lanes/<NN>/tags.md) by the rules a script can check: every card of the category once, in
// home order; known answer keys only; 1–3 What, 1–3 When and 1–4 How, none twice; a reason on every row; every page transition
// answers newpage, every loop page loop, every Scroll-Based or scroll page scroll. Prints every problem, or "ok". Run it from the
// root of a checkout of feat/animation-finder (it reads index.html and the pages there):
//   node <run folder>/lint-tags.mjs <run folder>/lanes/<NN>/tags.md
import { existsSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { readHome, KEYS, MAX, tagRows } from './home-data.mjs';

const file = process.argv[2];
if (!file || !existsSync(file)) { console.error('Usage: node lint-tags.mjs <run folder>/lanes/<NN>/tags.md'); process.exit(2); }
const lane = basename(dirname(file));
const cat = readHome().valueOf('CATS').find(c => c.n === lane);
if (!cat) { console.error(`index.html has no category ${lane}`); process.exit(2); }
const problems = [], seen = [];
for (const cells of tagRows(readFileSync(file, 'utf8'))) {
  if (cells.length !== 5) { problems.push(`not five cells: | ${cells.join(' | ')} |`); continue; }
  const [slug, what, when, how, reason] = cells;
  seen.push(slug);
  if (!cat.entries.some(e => e[0] === slug)) { problems.push(`${slug}: not a card of ${cat.n} ${cat.name}`); continue; }
  for (const [question, value] of [['what', what], ['when', when], ['how', how]]) {
    const keys = value.split(' ');
    if (keys.length > MAX[question]) problems.push(`${slug}: ${keys.length} ${question} answers, at most ${MAX[question]}`);
    for (const key of keys) if (!KEYS[question].includes(key)) problems.push(`${slug}: "${key}" is not a ${question} answer`);
    if (new Set(keys).size !== keys.length) problems.push(`${slug}: a ${question} answer twice`);
  }
  if (reason.split(/\s+/).length < 5) problems.push(`${slug}: the reason is missing or too short`);
  const page = join(cat.folder, slug, 'index.html');
  const kind = existsSync(page) ? (readFileSync(page, 'utf8').match(/data-hb-kind="(\w+)"/) || [])[1] : '';
  const whens = when.split(' ');
  if (cat.n === '03' && !whens.includes('newpage')) problems.push(`${slug}: every page transition answers newpage`);
  if (kind === 'loop' && !whens.includes('loop')) problems.push(`${slug}: every loop page answers loop`);
  if ((cat.n === '01' || kind === 'scroll') && !whens.includes('scroll')) problems.push(`${slug}: every Scroll-Based or scroll page answers scroll`);
}
const want = cat.entries.map(e => e[0]);
for (const slug of want) if (!seen.includes(slug)) problems.push(`${slug}: no row`);
for (const slug of new Set(seen)) if (seen.indexOf(slug) !== seen.lastIndexOf(slug)) problems.push(`${slug}: more than one row`);
if (!problems.length && seen.join() !== want.join()) problems.push('the rows are not in home order (the order card-facts.mjs prints)');
console.log(problems.length ? problems.join('\n') : `ok: ${seen.length} cards of ${cat.n} ${cat.name}`);
process.exit(problems.length ? 1 : 0);
```

Check it on a made-up ledger with two mistakes:

```bash
MAIN=C:/Users/matin/OneDrive/Desktop/Projects/animation-handbook; WT=$MAIN/.claude/worktrees; RUN=<from env.md>
mkdir -p "$RUN/selftest/01"
printf '| slug | what | when | how | reason |\n|---|---|---|---|---|\n| parallax-depth-of-field | background card | scroll | layers | Layers of a scene slide at their own speeds as you scroll. |\n| parallax-scrolling | columns | load | layers | short |\n' > "$RUN/selftest/01/tags.md"
cd "$WT/af-tags" && node "$RUN/lint-tags.mjs" "$RUN/selftest/01/tags.md"; echo "exit $?"
```

Expected: `parallax-scrolling: "columns" is not a what answer`, `parallax-scrolling: the reason is missing or too short`, `parallax-scrolling: every Scroll-Based or scroll page answers scroll`, then `… : no row` for the other 25 cards of 01, and `exit 1`. Then `rm -r "$RUN/selftest"`.

- [ ] **Step 6: `$RUN/card-facts.mjs`, then run it on 02**

```js
#!/usr/bin/env node
// Prints what a tagger reads for each card of one category, in home order: the home card (name, line, places), the page (kind,
// title, lede, prompt, Good for, Avoid on), the README (What it is, When to use it) and where its desktop still is.
// Usage, from the root of the af-tags worktree: node <run folder>/card-facts.mjs <NN> <run folder>
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readHome } from './home-data.mjs';

const [lane, RUN] = process.argv.slice(2);
const home = readHome(), PLACES = home.valueOf('PLACES');
const cat = home.valueOf('CATS').find(c => c.n === lane);
if (!cat || !RUN) { console.error('Usage: node card-facts.mjs <NN> <run folder>'); process.exit(2); }
const plain = s => String(s || '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
const section = (md, name) => (md.split(/\r?\n## /).find(s => s.startsWith(name)) || '').split(/\r?\n/).slice(1).join(' ').replace(/\s+/g, ' ').trim();
for (const [slug, name, line] of cat.entries) {
  const dir = join(cat.folder, slug), html = readFileSync(join(dir, 'index.html'), 'utf8'), md = readFileSync(join(dir, 'README.md'), 'utf8');
  const pick = re => plain((html.match(re) || [])[1]);
  const list = cls => [...((html.match(new RegExp(`<ul class="hb-tags ${cls}">([\\s\\S]*?)</ul>`)) || [])[1] || '').matchAll(/<li>([^<]*)<\/li>/g)].map(m => m[1]).join(', ');
  console.log([`## ${slug} (${name})`,
    `Card: ${line} Places: ${PLACES[slug].join(', ')}. Kind: ${(html.match(/data-hb-kind="(\w+)"/) || [])[1]}.`,
    `Title: ${pick(/<h1>([\s\S]*?)<\/h1>/)}. Lede: ${pick(/<p class="hb-lede">([\s\S]*?)<\/p>/)}`,
    `Prompt: ${pick(/<p class="hb-prompt"[^>]*>([\s\S]*?)<\/p>/)}`,
    `Good for: ${list('hb-good')}. Avoid on: ${list('hb-avoid')}.`,
    `What it is: ${section(md, 'What it is')}`,
    `When to use it: ${section(md, 'When to use it')}`,
    `Desktop still: ${join(RUN, 'lanes', lane, 'stills', `${lane}-${slug}-desktop.png`)}`, ''].join('\n'));
}
```

Run `cd "$WT/af-tags" && node "$RUN/card-facts.mjs" 02 "$RUN" | head -20`. Expected: `## fade-in-out (Fade In / Fade Out)`, then its card line, places `intro`, kind `once`, its title, lede, prompt, Good for, Avoid on, What it is, When to use it and still path; then `## slide-in (Slide In)`.

- [ ] **Step 7: `$RUN/shoot.mjs`, then a smoke test**

```js
#!/usr/bin/env node
// Opens one address in headless Chrome at one size and, as asked, prints the value of an expression run in the page and saves a
// screenshot of the window or of the whole page. A helper of the finder's run, not part of the site. It starts a Chrome, so take a
// slot from the shared pool before running it and free it after.
// Usage: node shoot.mjs --url <address> [--size 1280x800] [--mobile] [--theme light|dark] [--reduce] [--wait 800]
//          [--eval "<expression>"] [--shot <file.png>] [--full]
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2);
const opt = (name, fallback) => { const i = args.indexOf(name); return i < 0 ? fallback : args[i + 1]; };
const flag = name => args.includes(name);
const url = opt('--url', ''), [width, height] = opt('--size', '1280x800').split('x').map(Number);
const theme = opt('--theme', 'light'), wait = Number(opt('--wait', '800')), expression = opt('--eval', ''), shotFile = opt('--shot', '');
if (!url) { console.error('Usage: node shoot.mjs --url <address> [--size WxH] [--mobile] [--theme light|dark] [--reduce] [--wait ms] [--eval js] [--shot file.png] [--full]'); process.exit(2); }
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const profile = mkdtempSync(join(tmpdir(), 'hb-chrome-'));
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--disable-lcd-text', '--remote-debugging-port=0',
  `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(done => setTimeout(done, ms));
const pending = new Map(), events = [];
let ws = null, id = 0;
const send = (method, params = {}) => new Promise((done, fail) => {
  const n = ++id;
  pending.set(n, m => (m.error ? fail(new Error(`${method}: ${m.error.message}`)) : done(m.result)));
  ws.send(JSON.stringify({ id: n, method, params }));
});
try {
  let socket = null;
  for (let i = 0; i < 100 && !socket; i++) {
    const portFile = join(profile, 'DevToolsActivePort');
    if (existsSync(portFile)) {
      try {
        const port = readFileSync(portFile, 'utf8').split('\n')[0].trim();
        socket = ((await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(t => t.type === 'page') || {}).webSocketDebuggerUrl || null;
      } catch {}
    }
    if (!socket) await sleep(100);
  }
  if (!socket) throw new Error('Chrome started but did not answer');
  ws = new WebSocket(socket);
  await new Promise((done, fail) => { ws.onopen = done; ws.onerror = () => fail(new Error('could not connect to Chrome')); });
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } else events.push(m); };
  await send('Page.enable');
  // The visitor's theme and a GitHub star count stored as the home page stores them, so it never asks api.github.com.
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.setItem('ah-theme', '${theme === 'dark' ? 'dark' : 'light'}');
    localStorage.setItem('gh-star-count', JSON.stringify({ count: 1234, ts: Date.now() })); } catch (e) {}` });
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: flag('--mobile') ? 2 : 1, mobile: flag('--mobile') });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: flag('--reduce') ? 'reduce' : 'no-preference' },
    { name: 'prefers-color-scheme', value: theme === 'dark' ? 'dark' : 'light' }] });
  await send('Page.navigate', { url });
  for (let i = 0; i < 200 && !events.some(m => m.method === 'Page.loadEventFired'); i++) await sleep(100);
  await sleep(wait);
  if (expression) {
    const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    console.log(r.exceptionDetails ? `error: ${r.exceptionDetails.exception?.description || r.exceptionDetails.text}` : JSON.stringify(r.result.value));
  }
  if (shotFile) {
    let params = { format: 'png' };
    if (flag('--full')) {
      const { cssContentSize } = await send('Page.getLayoutMetrics');
      params = { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: Math.ceil(cssContentSize.height), scale: 1 } };
    }
    writeFileSync(shotFile, Buffer.from((await send('Page.captureScreenshot', params)).data, 'base64'));
    console.log(`saved ${shotFile}`);
  }
} catch (err) {
  console.error(err.message);
  process.exitCode = 1;
} finally {
  if (ws) ws.close();
  chrome.kill();
  if (process.platform === 'win32') {
    try {
      execFileSync('powershell', ['-NoProfile', '-NonInteractive', '-Command',
        `Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.CommandLine -and $env:HB_PROFILE -and $_.CommandLine.Contains($env:HB_PROFILE) } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }`],
        { stdio: 'ignore', timeout: 20000, windowsHide: true, env: { ...process.env, HB_PROFILE: profile } });
    } catch {}
  }
  for (let i = 0; i < 50; i++) { try { rmSync(profile, { recursive: true, force: true }); break; } catch { await sleep(200); } }
}
```

Smoke test: start the `af-tags` server (`cd "$WT/af-tags" && python -m http.server 8905 --bind 127.0.0.1`, background; it serves the seven tagging lanes until every Task 9 is approved), take a slot, then

```bash
node "$RUN/shoot.mjs" --url http://127.0.0.1:8905/ --size 1280x800 --eval "document.title" --shot "$RUN/smoke.png"
```

Expected: `"Animation Handbook — 166 Web Animation Techniques with Live Demos"` and `saved …/smoke.png`. Open the picture with the Read tool: the home page's top in the light theme. Free the slot; delete `smoke.png`.

- [ ] **Step 8: The seven lanes' briefs**

For each lane of the table in Task 8, write `$RUN/lanes/<NN>/brief.md` from Task 8's tagger brief and `$RUN/lanes/<NN>/check-brief.md` from Task 9's checker brief, replacing `<NN>`, `<Category>`, `<folder>`, `<count>` and `$RUN` with the lane's values and the real run folder path. Nothing else of this plan goes into the briefs.

- [ ] **Step 9: Baseline**

Run: `cd "$WT/af-int" && node --test "tests/*.test.js"`
Expected: every test passes. Log the count, the branch's base hash and the worktrees in `$RUN/progress.md`.

---

### Task 1: The questions, the draft answers and the matching

**Files:**
- Modify: `index.html` — after the end of `PLACES` (`};` on line 1993 on main), before `// The eight cards of "Good places to start", in this order.` (line 1994): the draft `FIND` block, then `FIND_Q`; after `function search(text){…}` (lines 2411–2415): the finder's functions
- Create: `tests/finder.test.js`
- Create (run folder): `$RUN/draft-find.mjs`

**Interfaces:**
- Consumes: `readHome` from `$RUN/home-data.mjs` (Task 0); the page's `ALL` (cards in home order with `slug`, `name`, `order`).
- Produces: `FIND_Q` (array of `{ key: 'what'|'when'|'how', title, weight, hint?, answers: [{ key, words, icon? , pic? }] }`), `FIND` (`{ [slug]: [what: string, when: string, how: string] }`, keys space-separated, main first), `findQuery(answers) → string`, `findWords(answers) → string`, `findScore(slug, answers) → { points, misses, size }`, `findMatches(answers) → { best: Card[], close: Card[] }`, `findIssueURL(answers) → string`; `answers` is any object with `what`, `when`, `how` (`''`, `'unsure'` or a key).
- Produces in `tests/finder.test.js`: the helpers `read`, `count`, `between`, `plain`, `blockEnd`, `homeConst`, `at`, `source`, `finder(data)`, `cards(rows)`, `slugs(list)`, and four section headers that Tasks 2, 3–5 and 11 fill.

- [ ] **Step 1: Write the failing tests** — create `tests/finder.test.js`:

```js
// Static checks for the Animation finder on the home page (index.html): its questions (FIND_Q), each card's answers (FIND), the
// matching (findMatches), the finder's markup and pictures, the Not here? link and its GitHub form, and the finder's test set.
// The page's own code is read with vm, as tests/pages.test.js reads the search. Run from the repo root: node --test "tests/*.test.js"
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(f, 'utf8');
const count = (s, sub) => s.split(sub).length - 1;
// The part of s from the first `from` up to the next `to` after it ('' when `from` is missing), as in tests/pages.test.js.
const between = (s, from, to) => {
  const start = s.indexOf(from);
  if (start < 0) return '';
  const end = s.indexOf(to, start + from.length);
  return s.slice(start, end < 0 ? undefined : end);
};
// A value made in a vm context, copied into plain arrays and objects that deepEqual accepts.
const plain = v => JSON.parse(JSON.stringify(v));
const HOME = read(path.join(ROOT, 'index.html'));

// As in tests/pages.test.js: where the bracket that opens at HOME[from] ('[' or '{') is closed, stepping over strings and //
// comments, and the value of `const NAME=` in the home page's script, read with vm.
function blockEnd(from) {
  const open = HOME[from], close = open === '[' ? ']' : '}';
  let depth = 0, i = from, quote = null;
  for (; i < HOME.length; i++) {
    const ch = HOME[i];
    if (quote) { if (ch === '\\') i++; else if (ch === quote) quote = null; continue; }
    if (ch === '/' && HOME[i + 1] === '/') { while (i < HOME.length && HOME[i] !== '\n') i++; continue; }
    if (ch === "'" || ch === '"' || ch === '`') quote = ch;
    else if (ch === open) depth++;
    else if (ch === close && --depth === 0) break;
  }
  return i;
}
function homeConst(name) {
  const start = HOME.indexOf(`const ${name}=`);
  assert.ok(start >= 0, `const ${name} in index.html`);
  const from = start + `const ${name}=`.length;
  return plain(vm.runInNewContext('(' + HOME.slice(from, blockEnd(from) + 1) + ')'));
}
const at = marker => { const i = HOME.indexOf(marker); assert.ok(i >= 0, `${marker} in index.html`); return i; };
const source = name => { const start = at(`function ${name}(`); return HOME.slice(start, blockEnd(HOME.indexOf('{', start)) + 1); };
// The finder as the page runs it: the cards in home order, built by the page's own code from PLACE_LIST up to BY_SLUG (as the
// search tests build them), with FIND_Q, FIND and the finder's functions in one context. `data` adds to the context or replaces
// CATS, PLACES or FIND with test data.
function finder(data = {}) {
  const context = vm.createContext({ CATS: homeConst('CATS'), PLACES: homeConst('PLACES'), FIND_Q: homeConst('FIND_Q'), FIND: homeConst('FIND'), ...data });
  vm.runInContext(HOME.slice(at('const PLACE_LIST=['), at('const BY_SLUG=')), context);
  for (const name of ['findQuery', 'findWords', 'findScore', 'findMatches', 'findIssueURL']) vm.runInContext(source(name), context);
  return context;
}
// The finder over test cards, one group in this order: each [slug, what, when, how], the answers written as FIND writes them.
function cards(rows) {
  const CATS = [{ name: 'Test', cat: 'c1-cat', dot: '#000000', n: '01', desc: 'Test cards.', folder: 'animations/01-test',
    entries: rows.map(([slug]) => [slug, slug, 'A test card. Best for tests.']) }];
  return finder({ CATS, PLACES: Object.fromEntries(rows.map(([slug]) => [slug, ['btn']])), FIND: Object.fromEntries(rows.map(([slug, ...answers]) => [slug, answers])) });
}
const slugs = list => Array.from(list, e => e.slug);

// ── The questions, the answers and the matching ──

const QUESTIONS = [
  ['what', 'What moved?', 2, [['text', 'Text or numbers'], ['card', 'A picture or card'], ['button', 'A button or icon'], ['menu', 'A menu or form'],
    ['loader', 'A loading sign or message'], ['shape', 'A line or shape'], ['particles', 'Dots or particles'], ['background', 'The background'],
    ['page', 'The whole page']]],
  ['when', 'When did it move?', 1, [['scroll', 'When I scrolled'], ['hover', 'When I pointed at it'], ['click', 'When I clicked or tapped'],
    ['drag', 'When I dragged or swiped'], ['load', 'When the page opened'], ['newpage', 'When I went to another page'], ['loop', 'By itself, again and again']]],
  ['how', 'How did it move?', 3, [['fade', 'Faded or blurred'], ['slide', 'Slid'], ['grow', 'Grew or shrank'], ['turn', 'Turned or flipped'],
    ['bounce', 'Bounced or shook'], ['stagger', 'One after another'], ['pieces', 'Broke into pieces'], ['follow', 'Followed my pointer'],
    ['color', 'Changed color or glowed'], ['morph', 'Changed into something else'], ['draw', 'Drew or typed itself'], ['reveal', 'Got uncovered'],
    ['layers', 'Moved in layers'], ['pin', 'Stayed in place while I scrolled'], ['drift', 'Drifted or floated'], ['wave', 'Rippled or waved'],
    ['glitch', 'Glitched or flickered']]]
];

test('FIND_Q holds the three questions in order, with the answers of the spec in their exact words', () => {
  const questions = homeConst('FIND_Q');
  assert.deepEqual(questions.map(q => [q.key, q.title, q.weight, q.answers.map(a => [a.key, a.words])]), QUESTIONS);
  assert.equal(questions[2].hint, 'Pick the picture closest to what you saw.');
  for (const q of questions.slice(0, 2)) {
    for (const a of q.answers) assert.match(a.icon || '', /^(<(path|rect|circle) [^<>]*\/>)+$/, `${a.key}: a still icon in the site's line style`);
  }
  for (const a of questions[2].answers) assert.equal(a.pic, `fd-${a.key}`, `${a.key}: the class of its moving picture`);
});

test('FIND lists every card once, in home order, with 1–3 What, 1–3 When and 1–4 How answers, all known, none twice', () => {
  const find = homeConst('FIND'), questions = homeConst('FIND_Q');
  const all = homeConst('CATS').flatMap(cat => cat.entries.map(e => e[0]));
  assert.deepEqual(Object.keys(find), all, 'FIND lists every card once, in home order');
  const problems = [];
  for (const slug of all) {
    const row = find[slug];
    if (!Array.isArray(row) || row.length !== 3) { problems.push(`${slug}: not three lists`); continue; }
    questions.forEach((q, i) => {
      const keys = String(row[i]).split(' '), most = q.key === 'how' ? 4 : 3;
      if (keys.length > most) problems.push(`${slug}: ${keys.length} ${q.key} answers, at most ${most}`);
      for (const key of keys) if (!q.answers.some(a => a.key === key)) problems.push(`${slug}: "${key}" is not a ${q.key} answer`);
      if (new Set(keys).size !== keys.length) problems.push(`${slug}: a ${q.key} answer twice`);
    });
  }
  assert.deepEqual(problems, []);
});

test('FIND sits right after PLACES', () => {
  const end = blockEnd(HOME.indexOf('{', at('const PLACES='))) + 1;
  assert.match(HOME.slice(end, at('const FIND=')), /^;\s*(\/\/[^\n]*\n\s*)*$/, 'only a comment line between PLACES and FIND');
});

test("a card's points: its main answer earns twice the question's weight, another answer once (the spec's example)", () => {
  const page = cards([['letters', 'text', 'load scroll', 'stagger fade'], ['typewriter', 'text', 'load loop', 'draw stagger'], ['fade', 'card text', 'load scroll click', 'fade']]);
  const answers = { what: 'text', when: 'load', how: 'stagger' };
  assert.deepEqual(plain(page.findScore('letters', answers)), { points: 12, misses: 0, size: 5 });
  assert.deepEqual(plain(page.findScore('typewriter', answers)), { points: 9, misses: 0, size: 5 });
  assert.deepEqual(plain(page.findScore('fade', answers)), { points: 4, misses: 1, size: 6 });
  const found = page.findMatches(answers);
  assert.deepEqual([slugs(found.best), slugs(found.close)], [['letters', 'typewriter'], ['fade']]);
});

test('no answer, or only Not sure, gives no cards, and an unknown key counts as Not sure', () => {
  const page = cards([['a', 'text', 'load', 'fade'], ['b', 'card', 'load', 'fade']]);
  for (const answers of [{}, { what: '', when: '', how: '' }, { what: 'unsure', when: 'unsure', how: 'unsure' }, { what: 'zebra' }]) {
    assert.deepEqual(plain(page.findMatches(answers)), { best: [], close: [] }, JSON.stringify(answers));
  }
  assert.deepEqual(plain(page.findMatches({ what: 'zebra', when: 'unsure', how: 'fade' })), plain(page.findMatches({ how: 'fade' })));
});

test('Best has no miss; Close has exactly one, and only when two or more questions are answered', () => {
  const page = cards([['a', 'text', 'load', 'fade'], ['b', 'card', 'load', 'fade'], ['c', 'card', 'scroll', 'slide']]);
  let found = page.findMatches({ what: 'text' });
  assert.deepEqual([slugs(found.best), slugs(found.close)], [['a'], []], 'one question answered: no Close matches');
  found = page.findMatches({ what: 'text', how: 'fade' });
  assert.deepEqual([slugs(found.best), slugs(found.close)], [['a'], ['b']], 'b misses What only, c misses both');
  found = page.findMatches({ what: 'text', when: 'load', how: 'fade' });
  assert.deepEqual([slugs(found.best), slugs(found.close)], [['a'], ['b']], 'c misses all three');
});

test('a main answer counts double', () => {
  const page = cards([['side', 'card text', 'load', 'fade'], ['main', 'text card', 'load', 'fade']]);
  assert.deepEqual(slugs(page.findMatches({ what: 'text' }).best), ['main', 'side']);
});

test('weights How 3, What 2, When 1: with the rest equal, a card missing When ranks above one missing What, above one missing How', () => {
  const page = cards([['no-how', 'text', 'load', 'slide'], ['no-what', 'card', 'load', 'fade'], ['no-when', 'text', 'scroll', 'fade']]);
  const found = page.findMatches({ what: 'text', when: 'load', how: 'fade' });
  assert.deepEqual([slugs(found.best), slugs(found.close)], [[], ['no-when', 'no-what', 'no-how']]);
});

test('ties go to fewer answers in all, then home order', () => {
  const page = cards([['many', 'text', 'load scroll', 'fade'], ['first', 'text', 'load', 'fade'], ['second', 'text', 'load', 'fade']]);
  assert.deepEqual(slugs(page.findMatches({ what: 'text', when: 'load', how: 'fade' }).best), ['first', 'second', 'many']);
});

test('the finder part of an address and the answers in words', () => {
  const page = finder();
  assert.equal(page.findQuery({ what: 'text', when: 'scroll', how: 'draw' }), '?view=find&what=text&when=scroll&how=draw');
  assert.equal(page.findQuery({ what: 'unsure', when: 'zebra', how: 'draw' }), '?view=find&how=draw');
  assert.equal(page.findQuery({}), '?view=find');
  assert.equal(page.findWords({ what: 'text', when: 'unsure', how: 'draw' }), 'Text or numbers · Not sure · Drew or typed itself');
});

test('the Not here? address opens the form animation_not_here.yml with its title and its answers field filled in', () => {
  const url = new URL(finder().findIssueURL({ what: 'text', when: 'scroll', how: 'draw' }));
  assert.equal(url.origin + url.pathname, 'https://github.com/matinmonshizadeh/animation-handbook/issues/new');
  assert.deepEqual([...url.searchParams.keys()], ['template', 'title', 'answers']);
  assert.equal(url.searchParams.get('template'), 'animation_not_here.yml');
  assert.equal(url.searchParams.get('title'), '[not here] Text or numbers · When I scrolled · Drew or typed itself');
  assert.equal(url.searchParams.get('answers'),
    'Text or numbers · When I scrolled · Drew or typed itself — https://matinmonshizadeh.github.io/animation-handbook/?view=find&what=text&when=scroll&how=draw');
});

// ── The pictures of the How answers ──
// Each How answer moves in a small picture of its own, and reduced motion holds every picture still.

// ── The finder view, its ways in and Not here? ──
// The finder's markup and address, the Find button and the Finder link, and the Not here? panel with its GitHub form.

// ── Every card's answers and the test set ──
// The reviewed answers: every answer given to some card, the rules every page of a kind shares, and the spec's 28 described effects.
```

- [ ] **Step 2: Run the new tests and see them fail**

Run: `cd "$WT/af-logic" && node --test tests/finder.test.js`
Expected: every test FAILS with an assertion that names what is missing: `const FIND_Q in index.html`, `const FIND in index.html` or `const FIND= in index.html`.

- [ ] **Step 3: Write the draft answers** — create `$RUN/draft-find.mjs`:

```js
#!/usr/bin/env node
// Writes the finder's draft answers into index.html, right after PLACES: What from each card's first place, When and How from its
// category. They only let the finder run while the seven lanes tag the cards; Task 11 replaces them with the reviewed answers.
// Run once, from the root of the af-logic worktree: node <run folder>/draft-find.mjs
import { writeFileSync } from 'node:fs';
import { readHome } from './home-data.mjs';

const home = readHome();
if (home.text.includes('const FIND={')) { console.error('index.html already has const FIND={'); process.exit(1); }
const CATS = home.valueOf('CATS'), PLACES = home.valueOf('PLACES');
const WHAT = { btn: 'button', text: 'text', imgcard: 'card', bg: 'background', menu: 'menu', load: 'loader', intro: 'card', scroll: 'card', page: 'page' };
const WHEN = { '01': 'scroll', '02': 'load', '03': 'newpage', '04': 'click', '05': 'load', '06': 'loop', '07': 'loop' };
const HOW = { '01': 'slide', '02': 'fade', '03': 'slide', '04': 'grow', '05': 'stagger', '06': 'turn', '07': 'drift' };
const lines = ["// Draft answers for the finder, from each card's first place and its category: the reviewed answers replace them.", 'const FIND={'];
CATS.forEach((cat, c) => {
  lines.push(`  // ${cat.n}`);
  cat.entries.forEach(([slug], i) => {
    const last = c === CATS.length - 1 && i === cat.entries.length - 1;
    lines.push(`  '${slug}':['${WHAT[PLACES[slug][0]]}','${WHEN[cat.n]}','${HOW[cat.n]}']${last ? '' : ','}`);
  });
});
lines.push('};');
const end = home.blockEnd(home.text.indexOf('{', home.text.indexOf('const PLACES='))) + 2; // just after the "};" that ends PLACES
writeFileSync('index.html', home.text.slice(0, end) + home.eol + lines.join(home.eol) + home.text.slice(end));
console.log(`Wrote the draft FIND: ${CATS.reduce((n, cat) => n + cat.entries.length, 0)} cards`);
```

Run: `cd "$WT/af-logic" && node "$RUN/draft-find.mjs"`
Expected: `Wrote the draft FIND: 166 cards`; `git diff --stat` shows `index.html` with 176 lines added.

- [ ] **Step 4: Add `FIND_Q`** — in `index.html`, right after the `};` that ends the draft `FIND` and before `// The eight cards of "Good places to start", in this order.`, insert:

```js
// The finder's three questions in order (spec, section 2): each answer's key (in the address and in FIND), its words (which name
// it) and its picture: a still icon in the site's 24px line style for What and When, the class of a small moving picture for How
// (drawn at the end of the stylesheet). weight is what a question counts for in findScore. Not sure, at the end of each
// question, is no answer.
const FIND_Q=[
  {key:'what',title:'What moved?',weight:2,answers:[
    {key:'text',words:'Text or numbers',icon:'<path d="M5 7V4h14v3M12 4v16M9 20h6"/>'},
    {key:'card',words:'A picture or card',icon:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="15.5" cy="9.5" r="1.5"/><path d="m3 16 5-5 4 4 3-3 6 6"/>'},
    {key:'button',words:'A button or icon',icon:'<rect x="3" y="7" width="18" height="10" rx="5"/><path d="M9 12h6"/>'},
    {key:'menu',words:'A menu or form',icon:'<path d="M4 6h16M4 12h16M4 18h10"/>'},
    {key:'loader',words:'A loading sign or message',icon:'<path d="M12 3a9 9 0 1 0 9 9"/>'},
    {key:'shape',words:'A line or shape',icon:'<circle cx="7.5" cy="7.5" r="3.5"/><path d="m13 20 4-7 4 7z"/><path d="M3 20 9 14"/>'},
    {key:'particles',words:'Dots or particles',icon:'<circle cx="6" cy="7" r="1.5" fill="currentColor"/><circle cx="17" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="5" cy="18" r="1.5" fill="currentColor"/><circle cx="18" cy="17" r="1.5" fill="currentColor"/>'},
    {key:'background',words:'The background',icon:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m3 12 8-8M3 20 19 4M11 20l10-10"/>'},
    {key:'page',words:'The whole page',icon:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M6.5 6.5h.01M9.5 6.5h.01"/>'}
  ]},
  {key:'when',title:'When did it move?',weight:1,answers:[
    {key:'scroll',words:'When I scrolled',icon:'<rect x="7" y="3" width="10" height="18" rx="5"/><path d="M12 7v4"/>'},
    {key:'hover',words:'When I pointed at it',icon:'<path d="m5 3 14 7-6 2-2 6z"/>'},
    {key:'click',words:'When I clicked or tapped',icon:'<path d="m9 9 11 4.5-4.5 1.5-1.5 4.5z"/><path d="m4 4 2 2M9 3v2M3 9h2"/>'},
    {key:'drag',words:'When I dragged or swiped',icon:'<path d="M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4"/>'},
    {key:'load',words:'When the page opened',icon:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M12 12v5M9.5 14.5h5"/>'},
    {key:'newpage',words:'When I went to another page',icon:'<rect x="3" y="5" width="10" height="14" rx="1.5"/><path d="M15 12h6M18 9l3 3-3 3"/>'},
    {key:'loop',words:'By itself, again and again',icon:'<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v5h-5"/>'}
  ]},
  {key:'how',title:'How did it move?',hint:'Pick the picture closest to what you saw.',weight:3,answers:[
    {key:'fade',words:'Faded or blurred',pic:'fd-fade'},
    {key:'slide',words:'Slid',pic:'fd-slide'},
    {key:'grow',words:'Grew or shrank',pic:'fd-grow'},
    {key:'turn',words:'Turned or flipped',pic:'fd-turn'},
    {key:'bounce',words:'Bounced or shook',pic:'fd-bounce'},
    {key:'stagger',words:'One after another',pic:'fd-stagger'},
    {key:'pieces',words:'Broke into pieces',pic:'fd-pieces'},
    {key:'follow',words:'Followed my pointer',pic:'fd-follow'},
    {key:'color',words:'Changed color or glowed',pic:'fd-color'},
    {key:'morph',words:'Changed into something else',pic:'fd-morph'},
    {key:'draw',words:'Drew or typed itself',pic:'fd-draw'},
    {key:'reveal',words:'Got uncovered',pic:'fd-reveal'},
    {key:'layers',words:'Moved in layers',pic:'fd-layers'},
    {key:'pin',words:'Stayed in place while I scrolled',pic:'fd-pin'},
    {key:'drift',words:'Drifted or floated',pic:'fd-drift'},
    {key:'wave',words:'Rippled or waved',pic:'fd-wave'},
    {key:'glitch',words:'Glitched or flickered',pic:'fd-glitch'}
  ]}
];
```

- [ ] **Step 5: Add the finder's functions** — in `index.html`, right after the closing `}` of `function search(text){…}`, insert:

```js
// ---------- The finder's matching ----------
// The finder's part of an address: ?view=find, then what, when and how for each question answered (nothing, Not sure or an
// unknown key leaves the question out).
function findQuery(answers){
  return '?view=find'+FIND_Q.map(q=>q.answers.some(a=>a.key===answers[q.key])?'&'+q.key+'='+answers[q.key]:'').join('');
}
// The answers in words, Not sure for a question left out: "Text or numbers · When I scrolled · Drew or typed itself".
function findWords(answers){
  return FIND_Q.map(q=>{const a=q.answers.find(x=>x.key===answers[q.key]);return a?a.words:'Not sure';}).join(' · ');
}
// How one card fits the answers: for each question answered, the card's main (first) answer earns twice the question's weight
// (How 3, What 2, When 1), another of its answers once, and no answer of it is a miss. size counts all the card's answers.
function findScore(slug,answers){
  const lists=(FIND[slug]||['','','']).map(s=>s.split(' ').filter(Boolean));
  let points=0,misses=0;
  FIND_Q.forEach((q,i)=>{
    if(!q.answers.some(a=>a.key===answers[q.key]))return;
    const at=lists[i].indexOf(answers[q.key]);
    if(at<0)misses++;else points+=(at?1:2)*q.weight;
  });
  return {points,misses,size:lists.reduce((n,l)=>n+l.length,0)};
}
// The finder's matches as {best, close}; it never touches the page. Best fits every answer; Close misses exactly one, and only
// when two or more questions are answered. Each is ordered by points, then fewer answers in all (a card made for just this comes
// first), then home order. Nothing answered, or only Not sure: no cards.
function findMatches(answers){
  const asked=FIND_Q.filter(q=>q.answers.some(a=>a.key===answers[q.key])).length,best=[],close=[];
  if(!asked)return {best,close};
  for(const e of ALL){
    const s=findScore(e.slug,answers);
    if(!s.misses)best.push({e,...s});else if(s.misses===1&&asked>1)close.push({e,...s});
  }
  const order=(a,b)=>b.points-a.points||a.size-b.size||a.e.order-b.e.order;
  return {best:best.sort(order).map(x=>x.e),close:close.sort(order).map(x=>x.e)};
}
// The Not here? link: GitHub's form animation_not_here.yml with its title and its answers field filled in (GitHub fills an issue
// form's field from the address by its id): the answers in words, then the finder's live address with them. Nothing personal.
function findIssueURL(answers){
  const words=findWords(answers);
  return 'https://github.com/matinmonshizadeh/animation-handbook/issues/new?template=animation_not_here.yml&title='+encodeURIComponent('[not here] '+words)+
    '&answers='+encodeURIComponent(words+' — https://matinmonshizadeh.github.io/animation-handbook/'+findQuery(answers));
}
```

- [ ] **Step 6: Run all tests**

Run: `cd "$WT/af-logic" && node --test "tests/*.test.js"`
Expected: every test passes, the new ones included.

- [ ] **Step 7: The home page still works.** Serve `af-logic` on 8901, take a slot, run `node tools/check-pages.mjs --base http://127.0.0.1:8901 home`, free the slot, stop the server.
Expected: six `ok` lines (nothing visible changed; a script error would show as a console problem).

- [ ] **Step 8: Commit**

```bash
cd "$WT/af-logic"
git add index.html tests/finder.test.js
git commit -m "feat: the finder's questions, draft answers for every card and the matching that ranks them, with tests that run the page's own code"
```

---

### Task 2: The How pictures

Runs once Task 1 is merged. The coordinator first makes the lane: `git -C "$MAIN" worktree add -b af/pics "$WT/af-pics" feat/animation-finder`.

**Files:**
- Modify: `index.html` — the end of the `<style>` block, right before `</style>` (line 1438 on main)
- Modify: `tests/finder.test.js` — under the header `// ── The pictures of the How answers ──`
- Create (run folder): `$RUN/fd-preview.mjs`

**Interfaces:**
- Consumes: `FIND_Q` How answers and their `pic` classes `fd-<key>` (Task 1); the markup Task 3 builds: `<span class="fd-pic fd-<key>" aria-hidden="true"><i></i><i></i><i></i><i></i></span>`.
- Produces: the classes `.fd-pic` and `.fd-<key>` for the 17 How answers, keyframes named `fd-<key>…`, and the reduced-motion block that starts with `.fd-pic *,.fd-pic *::before,.fd-pic *::after{animation:none!important}`.

- [ ] **Step 1: Write the failing test** — in `tests/finder.test.js`, under `// ── The pictures of the How answers ──` and its comment line, add:

```js
const STYLE = [...HOME.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');

test('every How answer has a moving picture, its keyframes are named fd- and move only transform and opacity, and no keyframes name is used twice', () => {
  const names = [...STYLE.matchAll(/@keyframes\s+([\w-]+)/g)].map(m => m[1]);
  assert.deepEqual(names.filter((name, i) => names.indexOf(name) !== i), [], 'no @keyframes name twice in index.html');
  for (const a of homeConst('FIND_Q')[2].answers) {
    assert.match(STYLE, new RegExp(`\\.${a.pic}[\\s.:{,]`), `a rule draws ${a.pic}`);
    assert.ok(names.some(name => name === a.pic || name.startsWith(a.pic + '-')), `${a.pic} moves: @keyframes ${a.pic}`);
  }
  for (const [, name, body] of STYLE.matchAll(/@keyframes\s+(fd-[\w-]+)\s*\{((?:[^{}]*\{[^{}]*\})*)\s*\}/g)) {
    for (const [, property] of body.matchAll(/([a-z-]+)\s*:/g)) {
      assert.ok(['transform', 'opacity', 'animation-timing-function'].includes(property), `${name} animates ${property}`);
    }
  }
});

test('with reduced motion the How pictures hold still', () => {
  assert.match(STYLE, /@media\(prefers-reduced-motion:reduce\)\{\s*\.fd-pic \*,\.fd-pic \*::before,\.fd-pic \*::after\{animation:none!important\}/);
});
```

- [ ] **Step 2: Run them and see them fail**

Run: `cd "$WT/af-pics" && node --test tests/finder.test.js`
Expected: the two new tests FAIL (`a rule draws fd-fade`; the reduced-motion pattern does not match); every other test passes.

- [ ] **Step 3: Draw the pictures** — in `index.html`, right before `</style>`, add:

```css

/* ── finder pictures ── */
/* "How did it move?": each answer's small dark square (64px) plays its movement on a loop, drawn by up to four <i>; its keyframes
   are named fd-<answer>. With reduced motion every picture holds its resting frame (the styles below, which show the movement at
   a glance) with a small arrow for the way it goes. Shapes use the category colors; only transform and opacity move. */
.fd-pic{position:relative;display:block;width:64px;height:64px;flex:none;border-radius:12px;background:#0b0b0f;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06);overflow:hidden}
.fd-pic i{position:absolute;display:none}
/* Faded or blurred: a square comes out of a blur, holds, and fades away */
.fd-fade i:nth-child(-n+2){display:block;left:18px;top:18px;width:28px;height:28px;border-radius:6px;background:var(--c1)}
.fd-fade i:nth-child(1){filter:blur(5px);opacity:0;animation:fd-fade-blur 3s ease-in-out infinite}
.fd-fade i:nth-child(2){animation:fd-fade 3s ease-in-out infinite}
@keyframes fd-fade{0%,25%{opacity:0}55%,85%{opacity:1}100%{opacity:0}}
@keyframes fd-fade-blur{0%{opacity:0}25%{opacity:.9}55%,100%{opacity:0}}
/* Slid: a square slides in from the left, holds, and slides out to the right */
.fd-slide i:nth-child(1){display:block;left:18px;top:18px;width:28px;height:28px;border-radius:6px;background:var(--c6);animation:fd-slide 2.8s cubic-bezier(.22,1,.36,1) infinite}
@keyframes fd-slide{0%{transform:translateX(-48px)}35%,75%{transform:none}100%{transform:translateX(48px)}}
/* Grew or shrank: a square grows from small, holds, and shrinks away */
.fd-grow i:nth-child(1){display:block;left:16px;top:16px;width:32px;height:32px;border-radius:7px;background:var(--c2);animation:fd-grow 2.8s cubic-bezier(.22,1,.36,1) infinite}
@keyframes fd-grow{0%{transform:scale(.15);opacity:0}12%{opacity:1}45%,80%{transform:none;opacity:1}100%{transform:scale(.15);opacity:0}}
/* Turned or flipped: a card turns over, purple front then light back */
.fd-turn{perspective:160px}
.fd-turn i:nth-child(-n+2){display:block;left:20px;top:14px;width:24px;height:36px;border-radius:5px;backface-visibility:hidden}
.fd-turn i:nth-child(1){background:var(--c3);transform:rotateY(-35deg);animation:fd-turn 3s cubic-bezier(.65,0,.35,1) infinite}
.fd-turn i:nth-child(2){background:#f4f4f2;transform:rotateY(-215deg);animation:fd-turn-back 3s cubic-bezier(.65,0,.35,1) infinite}
@keyframes fd-turn{0%,20%{transform:rotateY(0)}50%,70%{transform:rotateY(180deg)}100%{transform:rotateY(360deg)}}
@keyframes fd-turn-back{0%,20%{transform:rotateY(-180deg)}50%,70%{transform:rotateY(0)}100%{transform:rotateY(180deg)}}
/* Bounced or shook: a ball drops onto a floor and bounces back up */
.fd-bounce i:nth-child(1){display:block;left:26px;top:10px;width:12px;height:12px;border-radius:50%;background:var(--c4);transform:translateY(14px);animation:fd-bounce 1.2s infinite}
.fd-bounce i:nth-child(2){display:block;left:14px;right:14px;bottom:9px;height:2px;border-radius:1px;background:rgba(255,255,255,.35)}
@keyframes fd-bounce{0%,100%{transform:translateY(0);animation-timing-function:cubic-bezier(.5,0,1,.5)}50%{transform:translateY(31px);animation-timing-function:cubic-bezier(0,.5,.5,1)}}
/* One after another: three lines appear in turn */
.fd-stagger i:nth-child(-n+3){display:block;left:14px;height:7px;border-radius:3px;background:#f4f4f2;animation:fd-stagger 2.8s cubic-bezier(.22,1,.36,1) infinite both}
.fd-stagger i:nth-child(1){top:17px;width:30px}
.fd-stagger i:nth-child(2){top:28px;width:24px;opacity:.6;animation-delay:.3s}
.fd-stagger i:nth-child(3){top:39px;width:28px;opacity:.3;animation-delay:.6s}
@keyframes fd-stagger{0%{opacity:0;transform:translateY(7px)}20%,70%{opacity:1;transform:none}85%,100%{opacity:0;transform:none}}
/* Broke into pieces: a square splits into four that fly apart and fade, then it is whole again */
.fd-pieces i{display:block;width:14px;height:14px;background:var(--c5);transform:translate(calc(var(--x) * .35),calc(var(--y) * .35)) rotate(calc(var(--r) * .3));animation:fd-pieces 2.8s cubic-bezier(.22,1,.36,1) infinite}
.fd-pieces i:nth-child(1){left:18px;top:18px;--x:-16px;--y:-16px;--r:-40deg;border-radius:4px 0 0 0}
.fd-pieces i:nth-child(2){left:32px;top:18px;--x:16px;--y:-16px;--r:35deg;border-radius:0 4px 0 0}
.fd-pieces i:nth-child(3){left:18px;top:32px;--x:-16px;--y:16px;--r:30deg;border-radius:0 0 0 4px}
.fd-pieces i:nth-child(4){left:32px;top:32px;--x:16px;--y:16px;--r:-35deg;border-radius:0 0 4px 0}
@keyframes fd-pieces{0%,30%{transform:none;opacity:1}75%{transform:translate(var(--x),var(--y)) rotate(var(--r));opacity:0}76%{transform:none;opacity:0}100%{transform:none;opacity:1}}
/* Followed my pointer: a pointer moves around and a dot trails behind it */
.fd-follow i:nth-child(-n+2){display:block;left:0;top:0;animation:fd-follow 3.2s ease-in-out infinite}
.fd-follow i:nth-child(1){width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:var(--c6);opacity:.85;transform:translate(24px,38px)}
.fd-follow i:nth-child(2){width:13px;height:18px;background:#f4f4f2;clip-path:polygon(0 0,100% 64%,58% 64%,76% 100%,56% 100%,40% 68%,0 88%);transform:translate(36px,26px);animation-delay:-.4s}
@keyframes fd-follow{0%,100%{transform:translate(16px,18px)}33%{transform:translate(46px,24px)}66%{transform:translate(28px,46px)}}
/* Changed color or glowed: a band of colors runs through a rounded bar */
.fd-color i:nth-child(1){display:block;left:10px;top:20px;width:44px;height:24px;border-radius:12px;overflow:hidden;box-shadow:0 0 14px rgba(185,140,255,.45)}
.fd-color i:nth-child(1)::before{content:"";position:absolute;left:0;top:0;width:192px;height:100%;background:linear-gradient(90deg,var(--c1),var(--c3),var(--c5),var(--c7),var(--c1)) 0 0/96px 100% repeat-x;animation:fd-color 3s linear infinite}
@keyframes fd-color{to{transform:translateX(-96px)}}
/* Changed into something else: a circle turns into a square and back */
.fd-morph i:nth-child(-n+2){display:block;left:18px;top:18px;width:28px;height:28px;background:var(--c7)}
.fd-morph i:nth-child(1){border-radius:50%;animation:fd-morph 3s ease-in-out infinite}
.fd-morph i:nth-child(2){border-radius:5px;opacity:0;animation:fd-morph-square 3s ease-in-out infinite}
@keyframes fd-morph{0%,25%{opacity:1;transform:none}50%,75%{opacity:0;transform:rotate(45deg) scale(.85)}100%{opacity:1;transform:none}}
@keyframes fd-morph-square{0%,25%{opacity:0;transform:rotate(-45deg) scale(.85)}50%,75%{opacity:1;transform:none}100%{opacity:0;transform:rotate(-45deg) scale(.85)}}
/* Drew or typed itself: a line draws itself from left to right behind a pen tip */
.fd-draw i:nth-child(1){display:block;left:10px;top:30px;width:44px;height:4px;border-radius:2px;background:var(--c1);transform-origin:left;transform:scaleX(.65);animation:fd-draw 2.6s ease-in-out infinite}
.fd-draw i:nth-child(2){display:block;left:7px;top:27px;width:10px;height:10px;border-radius:50%;background:#f4f4f2;transform:translateX(29px);animation:fd-draw-pen 2.6s ease-in-out infinite}
@keyframes fd-draw{0%{transform:scaleX(0)}60%,85%{transform:none;opacity:1}100%{transform:none;opacity:0}}
@keyframes fd-draw-pen{0%{transform:translateX(0)}60%,85%{transform:translateX(44px);opacity:1}100%{transform:translateX(44px);opacity:0}}
/* Got uncovered: a colored panel slides off a little landscape, then covers it again */
.fd-reveal i:nth-child(1){display:block;inset:0;background:linear-gradient(#9fb8ff,#dfe7ff)}
.fd-reveal i:nth-child(2){display:block;right:12px;top:12px;width:10px;height:10px;border-radius:50%;background:#ffb020}
.fd-reveal i:nth-child(3){display:block;left:-12px;right:-12px;bottom:-30px;height:52px;border-radius:50%;background:#2b9a4a}
.fd-reveal i:nth-child(4){display:block;inset:0;background:var(--c5);transform:translateX(55%);animation:fd-reveal 2.8s cubic-bezier(.65,0,.35,1) infinite}
@keyframes fd-reveal{0%,20%{transform:none}55%,85%{transform:translateX(100%)}100%{transform:none}}
/* Moved in layers: three bands of dashes slide sideways, the near ones faster (each moves one dash pattern per loop) */
.fd-layers i:nth-child(-n+3){display:block;left:0;width:128px;border-radius:2px;animation:fd-layers 2.4s linear infinite}
.fd-layers i:nth-child(1){top:14px;height:6px;background:repeating-linear-gradient(90deg,rgba(110,168,255,.55) 0 8px,transparent 8px 16px);--d:-16px}
.fd-layers i:nth-child(2){top:28px;height:8px;background:repeating-linear-gradient(90deg,rgba(185,140,255,.8) 0 16px,transparent 16px 32px);--d:-32px}
.fd-layers i:nth-child(3){top:44px;height:10px;background:repeating-linear-gradient(90deg,var(--c6) 0 32px,transparent 32px 64px);--d:-64px}
@keyframes fd-layers{to{transform:translateX(var(--d))}}
/* Stayed in place while I scrolled: lines pass upward behind a box that holds still */
.fd-pin i:nth-child(1){display:block;left:10px;right:10px;top:0;height:128px;background:repeating-linear-gradient(180deg,rgba(255,255,255,.3) 0 3px,transparent 3px 14px);animation:fd-pin 1.4s linear infinite}
.fd-pin i:nth-child(2){display:block;left:18px;top:22px;width:28px;height:20px;border-radius:4px;background:var(--c7);box-shadow:0 0 0 4px #0b0b0f}
@keyframes fd-pin{to{transform:translateY(-14px)}}
/* Drifted or floated: four dots drift slowly, each on its own path */
.fd-drift i{display:block;width:8px;height:8px;border-radius:50%;background:#f4f4f2;animation:fd-drift 6s ease-in-out infinite alternate}
.fd-drift i:nth-child(1){left:12px;top:14px;--dx:10px;--dy:6px}
.fd-drift i:nth-child(2){left:40px;top:10px;width:6px;height:6px;opacity:.7;--dx:-8px;--dy:10px;animation-duration:7s}
.fd-drift i:nth-child(3){left:22px;top:40px;width:6px;height:6px;opacity:.6;--dx:8px;--dy:-8px;animation-duration:8s}
.fd-drift i:nth-child(4){left:46px;top:42px;--dx:-10px;--dy:-6px;animation-duration:6.5s}
@keyframes fd-drift{to{transform:translate(var(--dx),var(--dy))}}
/* Rippled or waved: rings spread from the middle, one after another */
.fd-wave i:nth-child(-n+3){display:block;left:12px;top:12px;width:40px;height:40px;border-radius:50%;border:2px solid var(--c6);animation:fd-wave 2.4s ease-out infinite}
.fd-wave i:nth-child(1){transform:scale(.35)}
.fd-wave i:nth-child(2){transform:scale(.7);opacity:.6;animation-delay:-.8s}
.fd-wave i:nth-child(3){transform:scale(1.05);opacity:.3;animation-delay:-1.6s}
@keyframes fd-wave{0%{transform:scale(.2);opacity:1}100%{transform:scale(1.4);opacity:0}}
/* Glitched or flickered: a bar jumps while red and blue copies of it jitter beside it */
.fd-glitch i:nth-child(-n+3){display:block;left:14px;top:26px;width:36px;height:12px;border-radius:2px}
.fd-glitch i:nth-child(1){background:#ff3b5c;opacity:.85;transform:translateX(-2px);animation:fd-glitch-red 1.6s steps(1) infinite}
.fd-glitch i:nth-child(2){background:#2fd8ff;opacity:.85;transform:translateX(2px);animation:fd-glitch-blue 1.6s steps(1) infinite}
.fd-glitch i:nth-child(3){background:#f4f4f2;animation:fd-glitch 1.6s steps(1) infinite}
@keyframes fd-glitch{0%,100%{transform:none}20%{transform:translateX(3px)}24%{transform:translateX(-2px) scaleY(.7)}28%,60%{transform:none}64%{transform:translateX(-3px)}68%{transform:none}}
@keyframes fd-glitch-red{0%,100%{transform:translateX(-2px)}20%{transform:translateX(-6px)}28%{transform:translateX(-2px)}64%{transform:translateX(4px)}68%{transform:translateX(-2px)}}
@keyframes fd-glitch-blue{0%,100%{transform:translateX(2px)}20%{transform:translateX(6px)}28%{transform:translateX(2px)}64%{transform:translateX(-4px)}68%{transform:translateX(2px)}}
@media(prefers-reduced-motion:reduce){
  .fd-pic *,.fd-pic *::before,.fd-pic *::after{animation:none!important}
  /* still frames where the resting styles above do not show the movement: the blur beside the sharp square, the circle beside
     the square, the square still growing */
  .fd-fade i:nth-child(1){opacity:.8;transform:translateX(-14px) scale(.6)}
  .fd-fade i:nth-child(2){transform:translateX(14px) scale(.6)}
  .fd-morph i:nth-child(1){transform:translateX(-14px) scale(.6)}
  .fd-morph i:nth-child(2){opacity:1;transform:translateX(14px) scale(.6)}
  .fd-grow i:nth-child(1){transform:scale(.7)}
  /* the small arrow: which way it moves (a curved one for turning, a double one for glitching) */
  .fd-pic::after{content:"";position:absolute;left:var(--ax,44px);top:var(--ay,4px);width:var(--as,16px);height:var(--as,16px);transform:rotate(var(--ar,0deg));background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f4f4f2' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 12h15M13 6l6 6-6 6'/%3E%3C/svg%3E") center/contain no-repeat}
  .fd-fade,.fd-morph{--ax:25px;--ay:25px;--as:14px}
  .fd-slide,.fd-reveal{--ax:3px;--ay:24px}
  .fd-grow,.fd-pieces,.fd-wave{--ax:44px;--ay:4px;--ar:-45deg}
  .fd-bounce,.fd-stagger{--ax:46px;--ay:24px;--ar:90deg}
  .fd-follow{--ax:4px;--ay:44px;--ar:-40deg}
  .fd-color,.fd-draw,.fd-layers,.fd-glitch{--ax:24px;--ay:46px}
  .fd-pin{--ax:46px;--ay:44px;--ar:-90deg}
  .fd-drift{--ax:24px;--ay:24px;--ar:-30deg}
  .fd-turn::after{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f4f4f2' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5'/%3E%3C/svg%3E")}
  .fd-glitch::after{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f4f4f2' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4'/%3E%3C/svg%3E")}
}
```

- [ ] **Step 4: Run all tests**

Run: `cd "$WT/af-pics" && node --test "tests/*.test.js"`
Expected: every test passes.

- [ ] **Step 5: A sheet of the pictures** — create `$RUN/fd-preview.mjs`:

```js
#!/usr/bin/env node
// Writes the finder's How pictures, drawn by index.html's own styles, into .superpowers/fd-preview-dark.html and
// .superpowers/fd-preview-light.html of the current checkout (git ignores that folder), for screenshots with shoot.mjs.
// Usage, from the worktree root: node <run folder>/fd-preview.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { readHome } from './home-data.mjs';

const home = readHome();
const how = home.valueOf('FIND_Q').find(q => q.key === 'how').answers;
const css = [...home.text.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');
const sheet = how.map(a => `<figure><span class="fd-pic ${a.pic}" aria-hidden="true"><i></i><i></i><i></i><i></i></span><figcaption>${a.words}</figcaption></figure>`).join('');
mkdirSync('.superpowers', { recursive: true });
for (const theme of ['dark', 'light']) {
  writeFileSync(`.superpowers/fd-preview-${theme}.html`, `<!DOCTYPE html><html lang="en" data-theme="${theme}"><head><meta charset="UTF-8"><base href="/">
<title>Finder pictures</title><style>${css}
.fd-sheet{display:grid;grid-template-columns:repeat(6,104px);gap:14px;padding:20px}
.fd-sheet figure{display:flex;flex-direction:column;align-items:center;gap:8px;font-size:13px;font-weight:600;line-height:1.25;text-align:center}
</style></head><body><div class="fd-sheet">${sheet}</div></body></html>`);
}
console.log(`Wrote .superpowers/fd-preview-dark.html and .superpowers/fd-preview-light.html (${how.length} pictures)`);
```

Run: `cd "$WT/af-pics" && node "$RUN/fd-preview.mjs"`. Expected: `… (17 pictures)`.

- [ ] **Step 6: Photograph them and tune.** Serve `af-pics` on 8902 (background), take a slot, then:

```bash
for t in 0 700 1400 2100; do node "$RUN/shoot.mjs" --url "http://127.0.0.1:8902/.superpowers/fd-preview-dark.html" --size 760x420 --eval "document.getAnimations().forEach(a => { a.pause(); a.currentTime = $t; })" --shot "$RUN/pics/dark-$t.png"; done
node "$RUN/shoot.mjs" --url "http://127.0.0.1:8902/.superpowers/fd-preview-light.html" --size 760x420 --eval "document.getAnimations().forEach(a => { a.pause(); a.currentTime = 1400; })" --shot "$RUN/pics/light-1400.png"
node "$RUN/shoot.mjs" --url "http://127.0.0.1:8902/.superpowers/fd-preview-dark.html" --size 760x420 --reduce --shot "$RUN/pics/reduced.png"
```

Free the slot. Open every picture with the Read tool. Each square must read as its words at 64px, the four frames must show the movement's stages, the light sheet must look like the dark one (the squares are dark in both themes), and in `reduced.png` each square must show a clear frame and an arrow that does not cover its shape. Tune only numbers (positions, sizes, colors, timings, the `--ax`/`--ay`/`--as`/`--ar` of the arrows) until they do; re-run Steps 4–6 after each change.

- [ ] **Step 7: Commit**

```bash
cd "$WT/af-pics"
git add index.html tests/finder.test.js
git commit -m "feat: the finder's seventeen How pictures, each a small dark square that plays its movement and holds a still with an arrow under reduced motion"
```

---

### Task 3: The finder view

Runs once Tasks 1 and 7 are merged. The coordinator first makes the lane: `git -C "$MAIN" worktree add -b af/view "$WT/af-view" feat/animation-finder`. Tasks 4 and 5 continue in the same worktree.

**Files:**
- Modify: `index.html` — CSS after line 336 (the `}` that closes `@media(max-width:360px){…}`), before `/* ── preview library ── */`; markup between line 1485 (`</section>` of the place tiles) and line 1487 (`<section class="wrap results" …>`); script: line 2377 (`const PAGE=8;`), 2431 (`state`), 2437–2438 (`syncBar`), 2442–2476 (`render`), 2477–2489 (`writeURL`), 2490–2497 (`fromURL`), 2500–2501 (`go`), 2522–2526 (`typed`), 2540–2543 (Show all), 2546–2552 (`popstate`), and a new block right before `const startCat=readURL();` (line 2558)
- Modify: `tests/finder.test.js` — under `// ── The finder view, its ways in and Not here? ──`

**Interfaces:**
- Consumes: `FIND_Q`, `findQuery`, `findMatches` (Task 1); `$`, `esc`, `CARD`, `cardsBox`, `place`, `titleEl`, `subEl`, `toTitle`, `toResults`, `reduce`, `PAGE` and the view functions of the home page; the `.fd-pic` classes (Task 2, drawn once merged).
- Produces: the contract's finder markup, words, address, history and focus, apart from the Find button and Finder link (Task 4) and Not here? (Task 5); `state` gains `what`, `when`, `how` (`''`, `'unsure'` or a key); `render(answered)`, `say(text, later)`, `answeredAny()`, `findLine(found)`, `showFinder(finding, found)`, `showFound(found)`, `FIND_PAGE` (12), `HOME_TITLE`, `FIND_TITLE`, and the DOM constants `finderEl`, `findTitle`, `findSee`, `heroEl`, `placesSec`.

- [ ] **Step 1: Write the failing tests** — under `// ── The finder view, its ways in and Not here? ──` and its comment line, add:

```js
test('the finder takes the place of the hero and the tiles: its section, heading, line, questions box and buttons', () => {
  const section = between(HOME, '<section class="wrap finder" id="finder"', '</section>');
  assert.ok(section.startsWith('<section class="wrap finder" id="finder" aria-labelledby="find-title" hidden>'), 'section.finder, hidden until its view opens');
  for (const part of ['<h1 class="h1 fd-h" id="find-title" tabindex="-1">Find an animation you saw</h1>',
    "<p class=\"sub\">Saw an animation on a website and don't know its name? Answer three short questions. The animations that match play below, with their names.</p>",
    '<div class="fd-qs" id="find-qs"></div>',
    '<button type="button" class="fd-btn" id="find-see" hidden>See 0 matches</button>',
    '<button type="button" class="pillbtn" id="find-reset">Start over</button>']) assert.ok(section.includes(part), part);
  const order = ['id="places"', 'id="finder"', 'id="results"'].map(at);
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'the finder comes after the place tiles and before the results');
  assert.ok(HOME.includes("FIND_TITLE='Find an animation you saw — Animation Handbook'"), "the finder's tab title");
});

test('the address keeps the finder and its answers: ?view=find, then what, when and how; an unknown value is Not sure; ?q= still wins', () => {
  const calls = [];
  const page = finder({ URLSearchParams, location: { search: '', pathname: '/animation-handbook/' },
    history: { pushState: (s, t, url) => calls.push(['push', url]), replaceState: (s, t, url) => calls.push(['replace', url]) } });
  for (const name of ['fromURL', 'writeURL']) vm.runInContext(source(name), page);
  const open = search => { page.location.search = search; return plain(page.fromURL().next); };
  const none = { q: '', place: '', view: '', all: false, what: '', when: '', how: '' };
  assert.deepEqual(open('?view=find&what=text&when=scroll&how=draw'), { ...none, view: 'find', what: 'text', when: 'scroll', how: 'draw' });
  assert.deepEqual(open('?view=find&what=zebra&how=fade&all=1'), { ...none, view: 'find', all: true, how: 'fade' });
  assert.deepEqual(open('?q=fade&view=find&what=text'), { ...none, q: 'fade' });
  assert.deepEqual(open('?view=all&what=text'), { ...none, view: 'all' });
  page.location.search = '';
  page.state = { ...none, view: 'find', what: 'text', when: 'unsure', how: 'draw' };
  page.writeURL(true);
  assert.deepEqual(calls.pop(), ['push', '?view=find&what=text&how=draw'], 'entering adds a history step, Not sure stays out');
  page.location.search = '?view=find&what=text&how=draw';
  page.state = { ...none, view: 'find', what: 'text', when: 'scroll', how: 'draw', all: true };
  page.writeURL(false);
  assert.deepEqual(calls.pop(), ['replace', '?view=find&what=text&when=scroll&how=draw&all=1'], 'answers and Show all only replace the address');
});
```

- [ ] **Step 2: Run them and see them fail**

Run: `cd "$WT/af-view" && node --test tests/finder.test.js`
Expected: the two new tests FAIL (`section.finder, hidden until its view opens`; the address test at its first comparison, because the old `fromURL` knows no `view=find` and no answers); the others pass.

- [ ] **Step 3: The markup** — between `</section>` of the place tiles (line 1485) and the blank line before `<section class="wrap results" …>`, insert:

```html

  <section class="wrap finder" id="finder" aria-labelledby="find-title" hidden>
    <h1 class="h1 fd-h" id="find-title" tabindex="-1">Find an animation you saw</h1>
    <p class="sub">Saw an animation on a website and don't know its name? Answer three short questions. The animations that match play below, with their names.</p>
    <div class="fd-qs" id="find-qs"></div>
    <div class="fd-go"><button type="button" class="fd-btn" id="find-see" hidden>See 0 matches</button><button type="button" class="pillbtn" id="find-reset">Start over</button></div>
  </section>
```

- [ ] **Step 4: The styles** — after line 336 (the `}` closing `@media(max-width:360px){…}`) and before the blank line and `/* ── preview library ── */`, insert:

```css

/* ── finder ── */
/* The finder (?view=find) takes the place of the hero and the place tiles: its heading and line, three questions of answers and,
   under them, See N matches and Start over; its matches show in the results below, as Best matches and Close matches. Each answer
   is a label around a radio hidden from sight but keeping keyboard focus: the label shows the site's focus ring, and a chosen
   answer a dark ring and a tick. What and When answers have a still icon beside their words, How answers a small moving picture
   above them (drawn at the end of this stylesheet). */
.finder{display:flex;flex-direction:column;align-items:center;padding-top:clamp(16px,4vw,56px);text-align:center}
.fd-h{margin-top:0}
.fd-qs{display:flex;flex-direction:column;gap:clamp(28px,4vw,44px);width:min(1080px,100%);margin-top:clamp(24px,4vw,44px);text-align:left}
.fd-q{min-width:0;border:0}
.fd-q legend{display:flex;align-items:center;gap:12px;padding:0;font-size:clamp(20px,2.2vw,26px);font-weight:800;letter-spacing:-.015em;line-height:1.2}
.fd-n{display:grid;place-items:center;width:36px;height:36px;flex:none;border-radius:50%;background:var(--ink);color:var(--bg);font-size:17px;font-weight:800}
.fd-hint{margin-top:6px;font-size:16px;color:var(--ink-2)}
.fd-as{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-top:16px}
.fd-how .fd-as{grid-template-columns:repeat(6,minmax(0,1fr))}
.fd-a{position:relative;display:flex;align-items:center;gap:10px;min-height:56px;padding:8px 14px;border-radius:14px;border:1px solid var(--line);background:var(--surface);font-size:15px;font-weight:600;line-height:1.25;cursor:pointer}
.fd-how .fd-a{flex-direction:column;justify-content:flex-start;gap:8px;padding:10px 8px 12px;text-align:center}
.fd-icon{width:24px;height:24px;color:var(--ink-2)}
.fd-r{position:absolute;left:0;top:0;width:1px;height:1px;margin:0;opacity:0;pointer-events:none}
.fd-a:has(.fd-r:focus-visible){outline:3px solid var(--brand);outline-offset:3px}
.fd-a:has(.fd-r:checked){border-color:var(--ink);box-shadow:0 0 0 2px var(--ink)}
.fd-a:has(.fd-r:checked)::before{content:"";position:absolute;top:-9px;right:-9px;width:22px;height:22px;border-radius:50%;background:var(--ink)}
.fd-a:has(.fd-r:checked)::after{content:"";position:absolute;top:-5px;right:-1px;width:6px;height:11px;border:solid var(--bg);border-width:0 2.5px 2.5px 0;transform:rotate(45deg)}
.fd-unsure,.fd-how .fd-unsure{justify-content:center;border-style:dashed;background:none;color:var(--ink-2);font-weight:500}
.fd-go{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:clamp(24px,4vw,40px)}
.fd-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:52px;padding:0 26px;border-radius:999px;border:0;background:var(--ink);color:var(--bg);font-size:16px;font-weight:700;text-decoration:none;cursor:pointer}
.finder .pillbtn{min-height:52px;padding:0 24px;font-size:16px}
.fd-gline{margin:-12px 0 18px;font-size:15px;color:var(--muted)}
@media(hover:hover){.fd-a:hover{border-color:var(--ink)}}
@media(max-width:1024px){.fd-as{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media(max-width:760px){.fd-as{grid-template-columns:repeat(3,minmax(0,1fr))}.fd-how .fd-as{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media(max-width:600px){
  .fd-as{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
  .fd-how .fd-as{grid-template-columns:repeat(3,minmax(0,1fr))}
  .fd-a{min-height:52px;padding:8px 10px;font-size:14px}
  .fd-how .fd-a{padding:8px 4px 10px;font-size:13px}
  .fd-go{flex-direction:column;align-self:stretch}
}
```

- [ ] **Step 5: The view's state, address and rendering** — make these replacements in the script:

`const PAGE=8;` (line 2377) becomes:

```js
const PAGE=8;
const FIND_PAGE=12; // the finder shows twelve cards before Show all
```

`const state={q:'',place:'',view:'',all:false};` (line 2431) becomes:

```js
const state={q:'',place:'',view:'',all:false,what:'',when:'',how:''};
```

Lines 2437–2438 become:

```js
// The phone bar is there while a view other than Start or the finder is open and while its own search box has focus, so emptying the box does not take the box away.
const syncBar=()=>resultsEl.classList.toggle('filtered',(isFiltered()&&state.view!=='find')||document.activeElement===q2);
```

`function render(){…}` (lines 2442–2476) becomes:

```js
// answered: the render follows an answer in the finder, so the results line waits (say).
function render(answered){
  const filtered=isFiltered(),finding=state.view==='find';
  let list=null,title,sub,tags=true,found=null;
  if(state.q){
    list=search(state.q);title='Results for “'+state.q+'”';
    sub=list.length===1?'1 animation matches.':list.length+' animations match.';
  }else if(state.place){
    list=ALL.filter(e=>e.places.includes(state.place));title=PLACE[state.place].name;sub=list.length+' animations';tags=false;
  }else if(finding){
    found=findMatches(state);title='Your matches';sub=findLine(found);
  }else if(state.view==='all'){
    title='All animations';sub=ALL.length+' animations in '+CATS.length+' groups.';
  }else{
    list=PICKS.map(s=>BY_SLUG[s]);title='Good places to start';sub='Eight favorites from different places. Pick a place above to see more.';
  }
  titleEl.textContent=title;say(sub,finding&&answered);
  showFinder(finding,found);
  syncBar();
  resultsEl.classList.toggle('no-tags',!tags);
  clearBtn.hidden=!filtered||finding;
  if(found)showFound(found);else if(list)showCards(state.all||!filtered?list:list.slice(0,PAGE));else showGroups();
  const empty=!!list&&!list.length,matched=found?found.best.length+found.close.length:0;
  emptyEl.hidden=!empty;
  if(empty)emptyTitle.textContent='Nothing matches “'+state.q+'” yet';
  if(finding){moreAction='expand';moreLabel.textContent='Show all '+matched+' matches';moreBox.hidden=state.all||matched<=FIND_PAGE;}
  else if(!filtered||empty){moreAction='all';moreLabel.textContent='Browse all '+ALL.length+' animations';moreBox.hidden=false;}
  else if(list&&!state.all&&list.length>PAGE){moreAction='expand';moreLabel.textContent='Show all '+list.length;moreBox.hidden=false;}
  else moreBox.hidden=true;
  document.querySelectorAll('[data-place]').forEach(b=>b.setAttribute('aria-pressed',String(!state.q&&b.dataset.place===state.place)));
  // The picked chip is scrolled fully into the phone bar's row, clear of the row's edge margin; only the row moves, never the page.
  const chip=pinbar.querySelector('.pchip[aria-pressed="true"]');
  if(chip&&chip.getClientRects().length){
    const row=chip.parentElement,r=row.getBoundingClientRect(),b=chip.getBoundingClientRect(),edge=parseFloat(getComputedStyle(row).paddingLeft)||0;
    if(b.left<r.left+edge)row.scrollLeft-=r.left+edge-b.left;
    else if(b.right>r.right-edge)row.scrollLeft+=b.right-(r.right-edge);
  }
  [q,q2].forEach(input=>{if(input!==document.activeElement&&input.value!==state.q)input.value=state.q;});
  qClear.hidden=!q.value;
}
```

`function writeURL(push){…}` (lines 2480–2489, keep its comment above) becomes:

```js
function writeURL(push){
  const p=[];
  if(state.q)p.push('q='+encodeURIComponent(state.q));
  else if(state.place)p.push('place='+PLACE[state.place].url);
  else if(state.view==='find')p.push(findQuery(state).slice(1));
  else if(state.view)p.push('view=all');
  if(state.all&&(state.q||state.place||state.view==='find'))p.push('all=1');
  const query=p.length?'?'+p.join('&'):'';
  const moved=String(new URLSearchParams(query))!==String(new URLSearchParams(location.search));
  try{history[push&&moved?'pushState':'replaceState'](null,'',query||location.pathname);}catch(e){}
}
```

`function fromURL(){…}` (lines 2491–2497, keep its comment above) becomes:

```js
function fromURL(){
  const p=new URLSearchParams(location.search),found=PLACE_LIST.find(x=>x.url===p.get('place')),cat=p.get('cat')||'';
  const next={q:(p.get('q')||'').trim(),place:'',view:'',all:p.get('all')==='1',what:'',when:'',how:''};
  if(!next.q&&found)next.place=found.key;
  else if(!next.q&&p.get('view')==='find'){next.view='find';FIND_Q.forEach(qu=>{if(qu.answers.some(a=>a.key===p.get(qu.key)))next[qu.key]=p.get(qu.key);});}
  else if(!next.q&&(p.get('view')==='all'||cat))next.view='all';
  return {next,cat};
}
```

`function go(next,push){…}` (line 2501) becomes:

```js
function go(next,push){Object.assign(state,{q:'',place:'',view:'',all:false,what:'',when:'',how:''},next);q.value=q2.value=state.q;render();writeURL(push);}
```

In `function typed(input){…}` (lines 2522–2526) the `Object.assign` line becomes:

```js
  Object.assign(state,{q:input.value.trim(),place:'',view:'',all:false,what:'',when:'',how:''});
```

In the Show all handler (line 2542) the `else` line becomes:

```js
  else{state.all=true;render();writeURL(false);(cardsBox.querySelectorAll('.card .title a')[state.view==='find'?FIND_PAGE:PAGE]||titleEl).focus();} // the first new card
```

The `popstate` handler (lines 2546–2552) becomes:

```js
// Back and Forward over a fragment only (the skip link, How it works, Back to top) leave the view and keyboard focus as they
// are. A view they change can take away the control that had keyboard focus (the ninth card after Show all): the heading gets
// it, the finder's heading in the finder.
addEventListener('popstate',()=>{
  const {next}=fromURL();
  if(Object.keys(next).every(k=>next[k]===state[k]))return;
  readURL();render();const a=document.activeElement;
  if(!a||a===document.body||gone(a)){if(state.view==='find')findTitle.focus({preventScroll:true});else toTitle();}
});
```

- [ ] **Step 6: The finder block** — right before `const startCat=readURL();` (line 2558), insert:

```js
// ---------- The finder (?view=find) ----------
// The three questions, built from FIND_Q: a fieldset each, its answers as radios (one Tab stop per question; the arrow keys
// choose), each in a label with its picture (hidden from screen readers) and its words, which name it. Not sure ends each one.
const finderEl=$('finder'),findTitle=$('find-title'),findSee=$('find-see'),heroEl=document.querySelector('.home-hero'),
  placesSec=$('places').closest('section');
$('find-qs').innerHTML=FIND_Q.map((qu,n)=>`<fieldset class="fd-q fd-${qu.key}"><legend><span class="fd-n" aria-hidden="true">${n+1}</span><span>${esc(qu.title)}</span></legend>`+
  (qu.hint?`<p class="fd-hint">${esc(qu.hint)}</p>`:'')+'<div class="fd-as">'+
  [...qu.answers,{key:'unsure',words:'Not sure'}].map(a=>`<label class="fd-a${a.key==='unsure'?' fd-unsure':''}"><input class="fd-r" type="radio" name="fd-${qu.key}" value="${a.key}" autocomplete="off">`+
    (a.pic?`<span class="fd-pic ${a.pic}" aria-hidden="true"><i></i><i></i><i></i><i></i></span>`:a.icon?`<svg class="i fd-icon" viewBox="0 0 24 24" aria-hidden="true">${a.icon}</svg>`:'')+
    `<span class="fd-w">${esc(a.words)}</span></label>`).join('')+'</div></fieldset>').join('');
// The results line is a polite live region. In the finder an answer writes it 400 ms after the last change, so arrowing through
// the answers announces only the final count; every other change writes it at once.
let sayTimer=0;
function say(text,later){clearTimeout(sayTimer);if(later)sayTimer=setTimeout(()=>{subEl.textContent=text;},400);else subEl.textContent=text;}
const answeredAny=()=>FIND_Q.some(qu=>qu.answers.some(a=>a.key===state[qu.key]));
// The finder's results line: how many fit, or why none do.
function findLine(found){
  const b=found.best.length,c=found.close.length,n=(k,one)=>k+' '+one+(k===1?'':'es');
  if(!answeredAny())return 'Answer a question above, and the animations that match show here.';
  if(b)return n(b,'best match')+(c?' and '+n(c,'close match'):'')+'.';
  return c?'No animation fits all your answers. These come close.':'No animation fits these answers yet.';
}
// The finder in place of the hero and the place tiles, with the tab's own title, the radios as the state says (after an address,
// Back, Forward or Start over) and See N matches (hidden while nothing matches).
const HOME_TITLE=document.title,FIND_TITLE='Find an animation you saw — Animation Handbook';
function showFinder(finding,found){
  heroEl.hidden=placesSec.hidden=finding;finderEl.hidden=!finding;
  document.title=finding?FIND_TITLE:HOME_TITLE;
  FIND_Q.forEach(qu=>finderEl.querySelectorAll('.fd-r[name="fd-'+qu.key+'"]').forEach(r=>{r.checked=r.value===state[qu.key];}));
  const matched=found?found.best.length+found.close.length:0;
  findSee.hidden=!matched;findSee.textContent='See '+matched+(matched===1?' match':' matches');
}
// The finder's matches: Best matches, then Close matches, each a group headed like those of All animations (an h3 with its count,
// the card titles a level below), the first twelve cards until Show all.
function showFound(found){
  const boxes=[],cards=[];let left=state.all?Infinity:FIND_PAGE;
  [['Best matches',found.best,''],['Close matches',found.close,'They fit all but one of your answers.']].forEach(([name,list,line])=>{
    if(!list.length||left<=0)return;
    const box=document.createElement('section');box.className='group fd-group';
    box.innerHTML=`<h3 class="ghead"><span class="gname">${name}</span><span class="gcount">${list.length===1?'1 animation':list.length+' animations'}</span></h3>`+(line?`<p class="fd-gline">${line}</p>`:'');
    const grid=document.createElement('div');grid.className='grid';
    list.slice(0,left).forEach(e=>{const c=CARD[e.slug];c.querySelector('.title').setAttribute('aria-level','4');grid.appendChild(c);cards.push(c);});
    left-=list.length;box.appendChild(grid);boxes.push(box);
  });
  cardsBox.replaceChildren(...boxes);
  place(cards);
}
// An answer changes the cards at once and only replaces the address; nothing scrolls. See N matches brings the results heading
// into view with keyboard focus, as Search does. Start over clears the answers and the cards (the address goes back to
// ?view=find) and puts keyboard focus on the finder's heading, at the top of the page.
finderEl.addEventListener('change',e=>{
  const r=e.target;if(!r.classList.contains('fd-r'))return;
  state[r.name.slice(3)]=r.value;state.all=false;
  render(true);writeURL(false);
});
findSee.addEventListener('click',()=>{toResults();toTitle();});
$('find-reset').addEventListener('click',()=>{go({view:'find'},false);scrollTo({top:0,behavior:reduce?'auto':'smooth'});findTitle.focus({preventScroll:true});});
```

- [ ] **Step 7: Run all tests**

Run: `cd "$WT/af-view" && node --test "tests/*.test.js"`
Expected: every test passes.

- [ ] **Step 8: The page check.** Merge the branch first (it holds Task 7, and Task 2 once merged): `cd "$WT/af-view" && git merge --no-ff feat/animation-finder -m "Merge feat/animation-finder into af/view"`. Serve `af-view` on 8903, take a slot, run
`node tools/check-pages.mjs --base http://127.0.0.1:8903 --out "$RUN/view-3" home`, free the slot.
Expected: six lines; every problem left on them names the Find button, the Finder link, Not here?, Describe it in words (Tasks 4 and 5) or, while Task 2 is not merged, the How pictures. Nothing about the questions, the cards, the address, See N matches, Start over, Show all, the loaded address, overflow, the phone bar or small targets. Open `home-desktop-finder-full.png` and `home-phone-finder-full.png` with the Read tool: three numbered questions, five What and When answers a row on the laptop and two on the phone, six How pictures a row on the laptop and three on the phone, the chosen answers with a dark ring and a tick, Best matches and Close matches below.

- [ ] **Step 9: Commit**

```bash
cd "$WT/af-view"
git add index.html tests/finder.test.js
git commit -m "feat: the finder view at ?view=find: three questions of picture answers in place of the hero and tiles, the matching cards as Best and Close matches, See N matches, Start over, and answers kept in the address"
```

---

### Task 4: The ways in — the Find button, the Finder link and the social picture

Runs in `af-view` after Task 3 is merged.

**Files:**
- Modify: `index.html` — the top bar (line 1445 on main, before `<a class="lnk" id="nav-all" …>`), the hero (after the `<p class="pop">…</p>` line, 1469 on main), the end of the `/* ── finder ── */` CSS block, `showFinder` and the end of the finder block (Task 3)
- Modify: `tools/make-social-image.mjs` — the comment lines 8–12 and `PICTURE_CSS` line 47
- Modify: `tests/finder.test.js` — under `// ── The finder view, its ways in and Not here? ──`, after Task 3's tests

**Interfaces:**
- Consumes: `go`, `findTitle`, `reduce`, `state`, `showFinder` (Task 3); `shoot.mjs` (Task 0).
- Produces: `a.find-cta`, `a#nav-find` and its `aria-current="page"` in the finder, `enterFind(e)`, `navFind`; the How it works link hidden below the measured width; `.find-cta` and `#nav-find` hidden in the social picture.

- [ ] **Step 1: Write the failing test** — after Task 3's tests:

```js
test('the ways into the finder: the Find button under the Popular line, Finder right before Browse all, both left out of the social picture', () => {
  assert.equal(count(HOME, `<a class="find-cta" href="?view=find">Don't know the name? Find it</a>`), 1, 'one Find button');
  assert.match(between(HOME, '<section class="wrap home-hero"', '</section>'),
    /<p class="pop"><span>Popular:<\/span>.*<\/p>\s*<a class="find-cta" href="\?view=find">Don't know the name\? Find it<\/a>\s*$/, 'the Find button ends the hero, right under the Popular line');
  assert.match(between(HOME, '<nav class="nav" aria-label="Site">', '</nav>'),
    /<a class="lnk" id="nav-find" href="\?view=find">Finder<\/a>\s*<a class="lnk" id="nav-all" href="\?view=all">Browse all<\/a>/, 'Finder right before Browse all');
  const css = [...HOME.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');
  assert.ok(css.includes('@media(max-width:849px){.top .nav .lnk[href="#how"]{display:none}}'), 'How it works leaves the bar where the three links no longer fit');
  assert.ok(read(path.join(ROOT, 'tools', 'make-social-image.mjs')).includes('.find-cta, #nav-find { display: none }'), 'the social picture leaves both out');
});
```

- [ ] **Step 2: Run it and see it fail**

Run: `cd "$WT/af-view" && node --test tests/finder.test.js`
Expected: the new test FAILS with `one Find button`; the others pass.

- [ ] **Step 3: The baseline social picture** — serve `af-view` on 8903, take a slot, run `node tools/make-social-image.mjs --base http://127.0.0.1:8903 --out "$RUN/og-before.png"`, free the slot. Expected: `Wrote …og-before.png: 1200×630 …`.

- [ ] **Step 4: The markup.** In the top bar, right before `<a class="lnk" id="nav-all" href="?view=all">Browse all</a>`, add the line:

```html
    <a class="lnk" id="nav-find" href="?view=find">Finder</a>
```

In the hero, right after the `<p class="pop"><span>Popular:</span>…</p>` line, add the line:

```html
    <a class="find-cta" href="?view=find">Don't know the name? Find it</a>
```

- [ ] **Step 5: Measure where the bar is full.** With the server still on 8903 and a slot taken, run before adding any width rule:

```bash
for w in 1024 900 880 870 860 850 840 830 820 800 780 761; do
  node "$RUN/shoot.mjs" --url "http://127.0.0.1:8903/" --size ${w}x400 --eval "(() => { const links = [...document.querySelectorAll('.top .nav > *')].filter(el => el.getClientRects().length); return { width: innerWidth, room: Math.round(links[0].getBoundingClientRect().left - document.querySelector('.top .brand span').getBoundingClientRect().right) }; })()"
done
```

Free the slot. `room` is the space between the brand's words and the first link. Take the smallest width whose `room` is at least 32 (12px of gap plus 20px for a longer star count) and call it W; the rule below uses `max-width: W−1`. If W is not 850, use your number in the CSS of Step 6 and in the test of Step 1.

- [ ] **Step 6: The styles** — at the end of the `/* ── finder ── */` block, add:

```css
/* The ways into the finder: a pill under the Popular line (as wide as the column on phones) and Finder in the top bar, marked as
   the current page in the finder. Below 850px (measured) Finder, Browse all and How it works no longer all fit beside the brand,
   so How it works leaves the bar; its band stays on the page. Phones show no top-bar links: there the pill is the way in. */
.find-cta{display:inline-flex;align-items:center;justify-content:center;min-height:44px;margin-top:10px;padding:0 20px;border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--ink);font-size:15px;font-weight:700;text-decoration:none}
.lnk[aria-current="page"]{color:var(--ink);background:var(--line-2)}
@media(hover:hover){.find-cta:hover{border-color:var(--ink)}}
@media(max-width:849px){.top .nav .lnk[href="#how"]{display:none}}
@media(max-width:600px){.find-cta{display:flex;align-self:stretch;margin-top:8px}}
```

- [ ] **Step 7: The script.** In `showFinder`, after the `document.title=…` line, add:

```js
  if(finding)navFind.setAttribute('aria-current','page');else navFind.removeAttribute('aria-current');
```

At the end of the finder block (after the Start over listener), add:

```js
// The ways in: the Find button under the search and Finder in the top bar open the finder with one history step, at the top of
// the page with keyboard focus on its heading (the Find button goes away with the hero). A click with Ctrl, Cmd, Shift or Alt,
// or with another button, is left to the browser, as for Browse all.
const navFind=$('nav-find');
function enterFind(e){
  if(e.button||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
  e.preventDefault();
  if(state.view!=='find')go({view:'find'},true);
  scrollTo({top:0,behavior:reduce?'auto':'smooth'});findTitle.focus({preventScroll:true});
}
document.querySelectorAll('.find-cta,#nav-find').forEach(a=>a.addEventListener('click',enterFind));
```

- [ ] **Step 8: The social picture keeps its look.** In `tools/make-social-image.mjs` replace lines 8–12 (from `// The page is laid out 1080 pixels wide` to `// animation is stopped at the same moment of its loop, so every run draws the same picture.`) with:

```js
// The page is laid out 1080 pixels wide and drawn at 1200/1080 of its size, so its words stay readable when a social site
// shows the picture small. For the picture only, the line under the question, the Popular suggestions, the finder's Find button
// and Finder link and the counts under the tiles are left out (so the tiles fit with room under them, as before the finder), the
// question is drawn at its full size and the GitHub button shows no star count (the request for it is blocked: a number in the
// picture would soon be out of date). Every animation is stopped at the same moment of its loop, so every run draws the same
// picture.
```

and the first line of `PICTURE_CSS` (line 47) with:

```js
.home-hero .sub, .home-hero .pop, .pl-count, .gh-c:empty, .find-cta, #nav-find { display: none }
```

Take a slot, run `node tools/make-social-image.mjs --base http://127.0.0.1:8903 --out "$RUN/og-after.png"`, free it, then `cmp "$RUN/og-before.png" "$RUN/og-after.png" && echo same`.
Expected: `same`. If not, open both with the Read tool and find what leaked into the picture.

- [ ] **Step 9: Tests and the page check**

Run: `cd "$WT/af-view" && node --test "tests/*.test.js"` — expected: every test passes.
Take a slot, run `node tools/check-pages.mjs --base http://127.0.0.1:8903 --out "$RUN/view-4" home`, free it.
Expected: six lines; the only problems left name Not here? or Describe it in words (Task 5), or the How pictures while Task 2 is not merged; no `place tiles below the first screen` and no `search box below the first screen` (the Find button must not push the first row of tiles off the first screen at 1280×800 and 375×812). If a first-screen problem shows, take the room from the gap above the tiles: add `@media(min-width:601px){.places{margin-top:32px}}` (desktop) or `@media(max-width:600px){.places-h{margin-top:18px}}` (phone) at the end of the finder block, never shrinking the tiles or the search box, and run the check again.

- [ ] **Step 10: Commit**

```bash
cd "$WT/af-view"
git add index.html tools/make-social-image.mjs tests/finder.test.js
git commit -m "feat: two ways into the finder, a Don't know the name? button under the search and a Finder link in the top bar, both left out of the social picture"
```

---

### Task 5: Not here? and the GitHub form

Runs in `af-view` after Task 4 is merged. Before Step 6 the branch must hold Task 2.

**Files:**
- Modify: `index.html` — after `<div class="more" id="more">…</div>` (line 1516 on main); the end of the `/* ── finder ── */` CSS block; `render` (one line after `showFinder(finding,found);`); the end of the finder block
- Create: `.github/ISSUE_TEMPLATE/animation_not_here.yml`
- Modify: `.github/ISSUE_TEMPLATE/config.yml` — lines 2–3 (`contact_links:` and the first item)
- Modify: `tests/finder.test.js` — after Task 4's test

**Interfaces:**
- Consumes: `findIssueURL` (Task 1); `answeredAny`, `render`, `go`, `q`, `reduce` (Task 3).
- Produces: `#find-not`, `#find-not-s`, `#find-gh`, `#find-words`; `showNotHere(finding, found)`; the form `animation_not_here.yml` with the fields `answers`, `site`, `what`, `recording`; a first contact link to the finder in the issue chooser.

- [ ] **Step 1: Write the failing tests** — after Task 4's test:

```js
// The fields of a GitHub issue form, in order: each item of its body that has an id, with its type, label and whether it is required.
const formFields = yml => yml.split(/\n  - type: /).slice(1).map(item => ({
  type: item.split(/\r?\n/)[0].trim(),
  id: (item.match(/\n    id: (\S+)/) || [])[1],
  label: ((item.match(/\n      label: (.+)/) || [])[1] || '').trim().replace(/^"(.*)"$/, '$1'),
  required: /\n      required: true/.test(item)
})).filter(field => field.id);
const FORM = path.join(ROOT, '.github', 'ISSUE_TEMPLATE', 'animation_not_here.yml');

test('Not here? sits under the cards with its words, its GitHub link in a new tab and Describe it in words', () => {
  const panel = between(HOME, '<div class="fd-not" id="find-not" hidden>', '</div>');
  assert.ok(panel, 'the Not here? panel, hidden until an answer is picked');
  for (const part of ['<h3 class="fd-not-t">Not here?</h3>',
    '<p class="fd-not-s" id="find-not-s">Tell us what you saw. We use it to add the animation or to fix the finder.</p>',
    '<a class="fd-btn" id="find-gh" href="https://github.com/matinmonshizadeh/animation-handbook/issues/new?template=animation_not_here.yml" target="_blank" rel="noopener">Tell us on GitHub</a>',
    '<button type="button" class="pillbtn" id="find-words">Describe it in words</button>',
    '<p class="fd-fine">The form is on GitHub and needs a free account.</p>']) assert.ok(panel.includes(part), part);
  assert.ok(at('id="find-not"') > at('id="more"') && at('id="find-not"') < at('id="how"'), 'under the cards, before How it works');
});

test('the GitHub form for Not here? has its name, title, label and four fields', () => {
  const form = read(FORM);
  assert.match(form, /^name: "Can't find an animation"\r?$/m);
  assert.match(form, /^description: "You saw an animation on a website, and the finder did not show it\."\r?$/m);
  assert.match(form, /^title: "\[not here\] "\r?$/m);
  assert.match(form, /^labels: \["finder"\]\r?$/m);
  assert.deepEqual(formFields(form).map(f => [f.type, f.id, f.label, f.required]), [
    ['input', 'answers', 'Your answers in the finder', false],
    ['input', 'site', 'Where did you see it? A link, and where on the page', true],
    ['textarea', 'what', 'What happened, in your own words', true],
    ['textarea', 'recording', 'A screen recording or picture: drag it into this box', false]
  ]);
});

test('the Not here? link names animation_not_here.yml and fills only fields the form has', () => {
  const fields = formFields(read(FORM)).map(f => f.id);
  const url = new URL(finder().findIssueURL({ what: 'card', when: 'scroll', how: 'pieces' }));
  assert.equal(url.searchParams.get('template'), path.basename(FORM));
  for (const name of url.searchParams.keys()) assert.ok(['template', 'title'].includes(name) || fields.includes(name), `${name} is a field of the form`);
});

test('the issue chooser offers the finder first', () => {
  const config = read(path.join(ROOT, '.github', 'ISSUE_TEMPLATE', 'config.yml'));
  assert.match(config.split(/\r?\n  - name: /)[1] || '', /^Find an animation by what you saw\r?\n    url: https:\/\/matinmonshizadeh\.github\.io\/animation-handbook\/\?view=find\r?\n/);
});
```

- [ ] **Step 2: Run them and see them fail**

Run: `cd "$WT/af-view" && node --test tests/finder.test.js`
Expected: the four new tests FAIL (no panel; `ENOENT … animation_not_here.yml`; the chooser's first link is Browse the live handbook); the others pass.

- [ ] **Step 3: The form** — create `.github/ISSUE_TEMPLATE/animation_not_here.yml`:

```yaml
name: "Can't find an animation"
description: "You saw an animation on a website, and the finder did not show it."
title: "[not here] "
labels: ["finder"]
body:
  - type: input
    id: answers
    attributes:
      label: "Your answers in the finder"
      description: "Filled in when you come from the finder's Not here? link."
  - type: input
    id: site
    attributes:
      label: "Where did you see it? A link, and where on the page"
      placeholder: "For example: https://example.com, the big picture at the top"
    validations:
      required: true
  - type: textarea
    id: what
    attributes:
      label: "What happened, in your own words"
      placeholder: "For example: as I scrolled, the picture broke into small pieces that floated away."
    validations:
      required: true
  - type: textarea
    id: recording
    attributes:
      label: "A screen recording or picture: drag it into this box"
      description: "Optional, but it helps us see exactly what you saw."
```

In `.github/ISSUE_TEMPLATE/config.yml`, right after `contact_links:`, add the finder as the first item:

```yaml
  - name: Find an animation by what you saw
    url: https://matinmonshizadeh.github.io/animation-handbook/?view=find
    about: "Saw an animation on a website and don't know its name? Answer three short questions and see the ones that match."
```

- [ ] **Step 4: The panel, its styles and its script.** Right after `<div class="more" id="more">…</div>`, add:

```html
    <div class="fd-not" id="find-not" hidden>
      <h3 class="fd-not-t">Not here?</h3>
      <p class="fd-not-s" id="find-not-s">Tell us what you saw. We use it to add the animation or to fix the finder.</p>
      <p class="fd-not-acts"><a class="fd-btn" id="find-gh" href="https://github.com/matinmonshizadeh/animation-handbook/issues/new?template=animation_not_here.yml" target="_blank" rel="noopener">Tell us on GitHub</a><button type="button" class="pillbtn" id="find-words">Describe it in words</button></p>
      <p class="fd-fine">The form is on GitHub and needs a free account.</p>
    </div>
```

At the end of the `/* ── finder ── */` CSS block, add:

```css
/* Not here?, under the finder's cards whenever an answer is picked */
.fd-not{display:flex;flex-direction:column;align-items:center;gap:12px;margin-top:40px;padding:clamp(28px,4vw,44px) 24px;border-radius:20px;background:var(--surface);box-shadow:var(--shadow);text-align:center}
.fd-not-t{font-size:22px;font-weight:800}
.fd-not-s{max-width:560px;font-size:16px;color:var(--ink-2)}
.fd-not-acts{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:4px}
.fd-fine{font-size:14px;color:var(--muted)}
@media(max-width:600px){.fd-not-acts{flex-direction:column;align-self:stretch}}
```

In `render`, right after `showFinder(finding,found);`, add the line:

```js
  showNotHere(finding,found);
```

At the end of the finder block, add:

```js
// Not here?, under the cards whenever an answer is picked: its link opens the GitHub form with the answers filled in; when nothing
// fits, its line says so and suggests Not sure on one question. Describe it in words goes back to the start, search box focused.
const findNot=$('find-not'),findNotLine=$('find-not-s'),findGh=$('find-gh');
function showNotHere(finding,found){
  const answered=finding&&answeredAny();
  findNot.hidden=!answered;
  if(!answered)return;
  findNotLine.textContent=found.best.length+found.close.length?'Tell us what you saw. We use it to add the animation or to fix the finder.':'Nothing fits these answers yet. Try Not sure on one question, or tell us what you saw.';
  findGh.href=findIssueURL(state);
}
$('find-words').addEventListener('click',()=>{go({},true);scrollTo({top:0,behavior:reduce?'auto':'smooth'});q.focus({preventScroll:true});});
```

- [ ] **Step 5: Run all tests**

Run: `cd "$WT/af-view" && node --test "tests/*.test.js"`
Expected: every test passes, the four new ones included.

- [ ] **Step 6: Six `ok` lines.** Merge the branch (it must hold Task 2 by now; if Task 2 is still in review, wait for its merge): `cd "$WT/af-view" && git merge --no-ff feat/animation-finder -m "Merge feat/animation-finder into af/view"`. Serve on 8903, take a slot, run `node tools/check-pages.mjs --base http://127.0.0.1:8903 --out "$RUN/view-5" home`, free it.
Expected: six `ok` lines. Open the six `home-*-finder-full.png` with the Read tool: the Not here? panel under the cards, its two buttons side by side on the laptop and one under the other on the phone.

- [ ] **Step 7: Commit**

```bash
cd "$WT/af-view"
git add index.html tests/finder.test.js .github/ISSUE_TEMPLATE/animation_not_here.yml .github/ISSUE_TEMPLATE/config.yml
git commit -m "feat: Not here? under the finder's cards opens a short GitHub form with the visitor's answers filled in, and the issue chooser offers the finder first"
```

---

### Task 6: The 404 page sends /finder and /find to the finder

**Files:**
- Modify: `404.html` — the comment and `whereTo` (lines 18–36), the ways back (lines 123–126)
- Modify: `tests/pages.test.js` — a new test right after the test ending on line 685 ("the 404 page sends a mistyped address where it belongs and never off the site")

**Interfaces:**
- Consumes: nothing new.
- Produces: `whereTo('/animation-handbook/finder', rest)` → `{ go: '/animation-handbook/?view=find' + kept answers }`; the third way back `<a class="way" href="/animation-handbook/?view=find">Find an animation by what you saw</a>`.

- [ ] **Step 1: Write the failing test** — after the test that ends on line 685 of `tests/pages.test.js`:

```js
test('the 404 page sends /finder and /find to the finder, keeping only its answers, and offers it as a way back', () => {
  const html = read(path.join(ROOT, '404.html'));
  const start = html.indexOf('function whereTo(');
  assert.ok(start >= 0, 'whereTo in 404.html');
  let depth = 0, end = html.indexOf('{', start);
  for (; end < html.length; end++) { if (html[end] === '{') depth++; else if (html[end] === '}' && --depth === 0) break; }
  const whereTo = vm.runInNewContext('(' + html.slice(start, end + 1) + ')');
  const cases = [
    ['/animation-handbook/finder', '', { go: '/animation-handbook/?view=find' }],
    ['/animation-handbook/find/', '', { go: '/animation-handbook/?view=find' }],
    ['/animation-handbook/Finder/', '?what=text&when=scroll&how=draw#top', { go: '/animation-handbook/?view=find&what=text&when=scroll&how=draw' }],
    ['/animation-handbook/FIND', '?q=fade&how=fade&utm_source=x', { go: '/animation-handbook/?view=find&how=fade' }],
    ['/animation-handbook/finder', '?what=%3Cb%3E', { go: '/animation-handbook/?view=find' }],
    ['/animation-handbook/finders', '', { words: 'finders' }],
    ['/animation-handbook/animations/finder/', '', { words: 'finder' }]
  ];
  for (const [where, rest, want] of cases) assert.deepEqual({ ...whereTo(where, rest) }, want, where + rest);
  assert.ok(html.includes('<a class="way" href="/animation-handbook/?view=find">Find an animation by what you saw</a>'), 'the third way back');
});
```

- [ ] **Step 2: Run it and see it fail**

Run: `cd "$WT/af-404" && node --test tests/pages.test.js`
Expected: the new test FAILS on `/animation-handbook/finder` (it gets `{ words: 'finder' }`); every other test passes.

- [ ] **Step 3: Implement.** In `404.html` replace the comment and the first three lines of `whereTo` (from `// Where a missing address leads:` to the line `if(lower!==path&&lower.indexOf('/animation-handbook/')===0)return {go:lower+(rest||'')};`) with:

```js
// Where a missing address leads: {go} to move on at once, else {words} for the search box. rest is the address's query
// and fragment. GitHub Pages tells capital letters from small ones, so an address with capitals moves to its lowercase
// path (percent escapes keep their case, so a lowercase path never moves again), and only within the handbook, so it
// never leaves the site. /animations/ and a category folder have no page of their own: they open Browse all; /finder and
// /find open the finder, a view of the home page, keeping only its answers (what, when and how). Any other address offers
// the words of its last part ("rotate-inn" gives "rotate inn"), skipping an index or readme file; a part made only of
// digits offers none.
function whereTo(path,rest){
  var lower=path.replace(/%[0-9A-Fa-f]{2}|[A-Z]+/g,function(s){return s.charAt(0)==='%'?s:s.toLowerCase();});
  if(/^\/animation-handbook\/animations(\/\d\d-[a-z0-9-]+)?(\/(index\.html?)?)?$/.test(lower))return {go:'/animation-handbook/?view=all#results'};
  if(/^\/animation-handbook\/find(er)?\/?$/.test(lower)){
    var keep=(rest||'').replace(/#.*$/,'').replace(/^\?/,'').split('&').filter(function(p){return /^(what|when|how)=[a-z]+$/.test(p);});
    return {go:'/animation-handbook/?view=find'+(keep.length?'&'+keep.join('&'):'')};
  }
  if(lower!==path&&lower.indexOf('/animation-handbook/')===0)return {go:lower+(rest||'')};
```

(the rest of `whereTo` stays as it is). In the ways back, after `<a class="way" href="/animation-handbook/?view=all#results">Browse all 166 animations</a>`, add:

```html
    <a class="way" href="/animation-handbook/?view=find">Find an animation by what you saw</a>
```

- [ ] **Step 4: Run all tests**

Run: `cd "$WT/af-404" && node --test "tests/*.test.js"`
Expected: every test passes, including "every address in it works at any depth" (the new link points at the home page).

- [ ] **Step 5: Commit**

```bash
cd "$WT/af-404"
git add 404.html tests/pages.test.js
git commit -m "feat: the 404 page sends /finder and /find to the finder with its answers, and offers it as a third way back"
```

---

### Task 7: The page check works the finder

**Files:**
- Modify: `tools/check-pages.mjs` — new functions right after `homeMotionProblems()` (ends on line 908 on main), before `// The end of the run, done once:`; a new block inside `if (home) {…}` of the main loop, after line 1010 (`if (setup.moves) problems.push(...await homeCopyProblems());`)

**Interfaces:**
- Consumes: the contract (written in parallel with Tasks 3–5, checked against them once they are merged); the page's `FIND_Q` and `findIssueURL`.
- Produces: `openHome(query, problems)`, `clickAt(selector)` → `{ covered, scrolled }`, `finderLayoutProblems(name, setup)`, `finderViewProblems()`, `pictureChange(drawn, bare)` → `{ share, wide, tall }`, `finderMotionProblems()`; screenshots `home-<setup>-finder.png` and `home-<setup>-finder-full.png` at every setup.

- [ ] **Step 1: Add the functions** — after `homeMotionProblems()`:

```js
// ── The finder (?view=find) ──
// Every home setup also opens the finder (finderLayoutProblems). The desktop run works it (finderViewProblems) and the
// reduced-motion run holds it still (finderMotionProblems). These are the finder's own steps; the home checks above are unchanged.

// Opens an address of the site as a new visit does; a load that does not finish is a problem of its own.
async function openHome(query, problems) {
  let onLoad;
  const loaded = new Promise(resolve => { onLoad = msg => { if (msg.method === 'Page.loadEventFired') resolve(); }; listeners.add(onLoad); });
  await send('Page.navigate', { url: `${BASE}/${query}` });
  try { await withTimeout(loaded, LOAD_TIMEOUT); } catch { problems.push(`finder: ${query || 'the home page'} did not load`); }
  listeners.delete(onLoad);
  await sleep(300);
}

// A real mouse click at the middle of the element the selector finds, once it is scrolled to the middle of the window. Returns
// what covers that point when it is not the element or something inside it (covered), and where the page was scrolled to just
// before the click (scrolled), so the caller can tell whether the click scrolled the page.
async function clickAt(selector) {
  const spot = await evaluate(`(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return { covered: 'nothing: the page has no such element' };
    el.scrollIntoView({ block: 'center' });
    const b = el.getBoundingClientRect(), x = b.left + b.width / 2, y = b.top + b.height / 2, hit = document.elementFromPoint(x, y);
    return { x, y, scrolled: Math.round(scrollY),
      covered: el.contains(hit) ? '' : hit ? hit.tagName.toLowerCase() + (hit.getAttribute('class') ? '.' + hit.getAttribute('class').split(' ')[0] : '') : 'nothing' };
  })()`);
  if (spot.covered) return { covered: spot.covered, scrolled: 0 };
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: spot.x, y: spot.y, button: 'none' });
  for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: spot.x, y: spot.y, button: 'left', clickCount: 1 });
  return { covered: '', scrolled: spot.scrolled };
}

// The finder at every setup. On the start page the Find button sits under the Popular line (on a phone 44px tall or more and as
// wide as the column). The finder, opened with three answers in the address: the hero and the place tiles give way to it, its
// cards and the Not here? panel show, nothing overflows sideways, Finder is in the top bar above 600px and the bar's links fit
// beside the brand, the phone bar stays away and, on phones, every answer, button and link of the finder and its results is at
// least 44×44. Screenshots of the finder (the window and the whole page) are saved beside the others.
async function finderLayoutProblems(name, setup) {
  const problems = [];
  await openHome('', problems);
  const cta = await evaluate(`(() => {
    const a = document.querySelector('.find-cta'), pop = document.querySelector('.home-hero .pop'), hero = document.querySelector('.home-hero');
    if (!a || !a.getClientRects().length) return null;
    const b = a.getBoundingClientRect();
    return { width: Math.round(b.width), height: Math.round(b.height), under: !!pop && b.top >= pop.getBoundingClientRect().bottom - 1,
      full: Math.abs(b.width - hero.getBoundingClientRect().width) <= 1 };
  })()`);
  if (!cta) problems.push('finder: no Find button on the start page');
  else {
    if (!cta.under) problems.push('finder: the Find button is not under the Popular line');
    if (setup.width <= 600 && (cta.height < 44 || !cta.full)) problems.push(`finder: on a phone the Find button is ${cta.width}x${cta.height}${cta.full ? '' : ', not as wide as the column'}`);
  }
  await openHome('?view=find&what=text&when=load&how=stagger', problems);
  await sleep(500);
  const found = await evaluate(`(() => {
    const r = el => el.getBoundingClientRect(), shown = el => !!el && !!el.getClientRects().length, out = [];
    if (shown(document.querySelector('.home-hero')) || shown(document.getElementById('places'))) out.push('the hero or the place tiles show in the finder');
    if (!shown(document.getElementById('finder'))) out.push('the finder does not show');
    if (!document.querySelectorAll('#cards .card').length) out.push('no cards for Text or numbers · When the page opened · One after another');
    if (!shown(document.getElementById('find-not'))) out.push('no Not here? panel');
    if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1) out.push('horizontal overflow');
    if (innerWidth > 600 && !shown(document.getElementById('nav-find'))) out.push('no Finder link in the top bar');
    const brand = document.querySelector('.top .brand span'), first = [...document.querySelectorAll('.top .nav > *')].find(shown);
    if (brand && first && r(brand).right > r(first).left - 8) out.push('the top bar links do not fit beside the brand');
    if (getComputedStyle(document.getElementById('pinbar')).display !== 'none') out.push('the phone bar shows');
    if (innerWidth <= 600) {
      const small = [...document.querySelectorAll('#finder .fd-a, #finder button, #find-not a, #find-not button, #cards .card .copy, #more button')]
        .filter(shown).filter(el => { const b = r(el); return b.width < 44 || b.height < 44; })
        .map(el => (el.id || el.tagName.toLowerCase() + '.' + (el.getAttribute('class') || '').split(' ')[0]) + ' ' + Math.round(r(el).width) + 'x' + Math.round(r(el).height));
      if (small.length) out.push('small targets: ' + small.slice(0, 6).join(', ') + (small.length > 6 ? ' and ' + (small.length - 6) + ' more' : ''));
    }
    return out;
  })()`);
  problems.push(...found.map(p => `finder: ${p}`));
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(join(OUT, `${name}-${setup.name}-finder.png`), Buffer.from(shot.data, 'base64'));
  const { cssContentSize } = await send('Page.getLayoutMetrics');
  const full = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: setup.width, height: Math.ceil(cssContentSize.height), scale: 1 } });
  writeFileSync(join(OUT, `${name}-${setup.name}-finder-full.png`), Buffer.from(full.data, 'base64'));
  return problems;
}

// The finder, desktop run. ?view=find opens with three questions, nothing chosen, the heading "Your matches", the line asking for
// an answer and no cards, the tab's title and the Finder link marked as the current page. Real clicks on answers change the cards,
// replace the address (no history step) and never scroll the page; with A menu or form · When I scrolled · Slid, Hide-on-Scroll
// Header is among the first six (case 22 of the finder's test set). The Not here? link is the form's address for those answers, in
// a new tab. See N matches brings the results heading into view with keyboard focus; Start over clears the answers and the cards,
// goes back to ?view=find and puts keyboard focus on the finder's heading. With more than twelve matches Show all shows the rest
// and puts keyboard focus on the thirteenth card. An address opened directly shows the same answers and cards as the clicks. The
// Find button and the Finder link each enter the finder with one history step and keyboard focus on its heading; after an answer,
// Back returns to the start in one press. Describe it in words goes back to the start with keyboard focus in the search box.
async function finderViewProblems() {
  const problems = [];
  const FIND_TITLE = 'Find an animation you saw — Animation Handbook', ASK = 'Answer a question above, and the animations that match show here.';
  const look = () => evaluate(`(() => {
    const $ = id => document.getElementById(id), shown = el => !!el && !!el.getClientRects().length;
    const links = [...document.querySelectorAll('#cards .card .title a')], a = document.activeElement;
    return { hero: shown(document.querySelector('.home-hero')), tiles: shown($('places')), finder: shown($('finder')),
      questions: document.querySelectorAll('#finder fieldset').length,
      checked: [...document.querySelectorAll('#finder .fd-r:checked')].map(r => r.name.slice(3) + '=' + r.value).join('&'),
      title: $('results-title').textContent, sub: $('results-sub').textContent, names: links.map(l => l.textContent),
      more: $('more').hidden ? '' : $('more-label').textContent, search: location.search, steps: history.length, tab: document.title,
      current: $('nav-find') ? $('nav-find').getAttribute('aria-current') : 'no Finder link',
      see: shown($('find-see')) ? $('find-see').textContent : '', notHere: shown($('find-not')),
      focus: a.id || (links.includes(a) ? 'card link ' + (links.indexOf(a) + 1) : a.tagName.toLowerCase()) };
  })()`);
  const press = selector => evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (el) { el.focus(); el.click(); } return !!el; })()`);
  const answer = (question, key) => `#finder .fd-a:has(.fd-r[name="fd-${question}"][value="${key}"])`;
  const still = () => evaluate(`new Promise(done => { let last = scrollY, same = 0;
    const tick = () => { same = scrollY === last ? same + 1 : 0; last = scrollY; if (same >= 3) done(); else setTimeout(tick, 100); };
    setTimeout(tick, 100); })`);
  // A real click on an answer: then the line has been written (400 ms) and the page must not have scrolled.
  const pick = async (question, key) => {
    const spot = await clickAt(answer(question, key));
    if (spot.covered) { problems.push(`finder: the answer ${question}=${key} is covered by ${spot.covered}`); return; }
    await sleep(700);
    const y = await evaluate('Math.round(scrollY)');
    if (Math.abs(y - spot.scrolled) > 1) problems.push(`finder: picking ${question}=${key} scrolled the page from ${spot.scrolled}px to ${y}px`);
  };

  await openHome('?view=find', problems);
  let s = await look();
  if (s.hero || s.tiles || !s.finder || s.questions !== 3 || s.checked || s.names.length || s.title !== 'Your matches' || s.sub !== ASK ||
    s.tab !== FIND_TITLE || s.current !== 'page' || s.see || s.notHere) problems.push(`finder, ?view=find: ${JSON.stringify(s)}`);
  const steps = s.steps;
  for (const [question, key] of [['what', 'menu'], ['when', 'scroll'], ['how', 'slide']]) await pick(question, key);
  s = await look();
  if (s.checked !== 'what=menu&when=scroll&how=slide' || s.search !== '?view=find&what=menu&when=scroll&how=slide' || s.steps !== steps) {
    problems.push(`finder, three answers: chosen ${s.checked}, the address ${s.search}, ${s.steps - steps} history steps added`);
  }
  if (!s.names.slice(0, 6).includes('Hide-on-Scroll Header')) problems.push(`finder: A menu or form · When I scrolled · Slid shows ${s.names.slice(0, 6).join(', ') || 'no cards'} first, not Hide-on-Scroll Header`);
  if (!/^See \d+ match(es)?$/.test(s.see) || !s.notHere) problems.push(`finder: See N matches reads "${s.see}", Not here? is ${s.notHere ? 'shown' : 'hidden'}`);
  if (!/^\d+ best match(es)?( and \d+ close match(es)?)?\.$|^No animation fits all your answers\. These come close\.$/.test(s.sub)) problems.push(`finder: the results line "${s.sub}"`);
  const link = await evaluate(`(() => { const a = document.getElementById('find-gh');
    return a ? { href: new URL(a.href).href, want: new URL(findIssueURL({ what: 'menu', when: 'scroll', how: 'slide' })).href, target: a.target, rel: a.rel } : null; })()`);
  if (!link || link.href !== link.want || !link.href.startsWith('https://github.com/matinmonshizadeh/animation-handbook/issues/new?template=animation_not_here.yml&') ||
    link.target !== '_blank' || link.rel !== 'noopener') problems.push(`finder: the Not here? link ${JSON.stringify(link)}`);
  const picked = s.names;
  await press('#find-see');
  await still();
  const seen = await evaluate(`(() => { const t = document.getElementById('results-title'), top = Math.round(t.getBoundingClientRect().top);
    return { top, shown: top >= 0 && top <= innerHeight * .6, focus: document.activeElement === t }; })()`);
  if (!seen.shown || !seen.focus) problems.push(`finder: after See N matches the results heading is at ${seen.top}px${seen.focus ? '' : ', without keyboard focus'}`);
  await press('#find-reset');
  await still();
  await sleep(500);
  s = await look();
  if (s.checked || s.names.length || s.search !== '?view=find' || s.sub !== ASK || s.focus !== 'find-title' || s.see || s.notHere || s.steps !== steps) {
    problems.push(`finder, Start over: ${JSON.stringify(s)}`);
  }
  // More than twelve matches: twelve cards, then Show all shows every one and puts keyboard focus on the thirteenth.
  await openHome('?view=find&what=background', problems);
  s = await look();
  const total = Number((s.more.match(/^Show all (\d+) matches$/) || [])[1]);
  if (!(total > 12) || s.names.length !== 12) problems.push(`finder, The background: ${s.names.length} cards and the button "${s.more}" (twelve cards, then Show all for the rest)`);
  else {
    await press('#more-btn');
    await sleep(400);
    s = await look();
    if (s.names.length !== total || s.search !== '?view=find&what=background&all=1' || s.focus !== 'card link 13' || s.more) {
      problems.push(`finder, Show all: ${s.names.length} of ${total} cards, the address ${s.search}, keyboard focus on ${s.focus}`);
    }
  }
  // An address opened directly shows the same answers and cards as the clicks did.
  await openHome('?view=find&what=menu&when=scroll&how=slide', problems);
  s = await look();
  if (s.checked !== 'what=menu&when=scroll&how=slide' || s.names.join() !== picked.join()) problems.push(`finder, the address opened directly: chosen ${s.checked}, cards ${s.names.join(', ')}; after the clicks: ${picked.join(', ')}`);
  // The ways in: one history step, keyboard focus on the finder's heading; after an answer, Back returns to the start in one press.
  for (const [what, selector] of [['Find button', '.find-cta'], ['Finder link', '#nav-find']]) {
    await openHome('', problems);
    const before = await evaluate('history.length');
    if (!(await press(selector))) { problems.push(`finder: no ${what}`); continue; }
    await still();
    s = await look();
    if (s.search !== '?view=find' || s.steps !== before + 1 || s.focus !== 'find-title' || s.hero || !s.finder) problems.push(`finder, the ${what}: ${JSON.stringify(s)}`);
    await pick('what', 'text');
    await evaluate('history.back()');
    await sleep(700);
    s = await look();
    if (s.search !== '' || !s.hero || s.finder || s.title !== 'Good places to start' || s.tab === FIND_TITLE || s.current !== null) {
      problems.push(`finder, Back after the ${what} and an answer: ${JSON.stringify(s)}`);
    }
  }
  // Describe it in words: back to the start, one history step, keyboard focus in the search box.
  await openHome('?view=find&what=text', problems);
  const before = await evaluate('history.length');
  if (!(await press('#find-words'))) problems.push('finder: no Describe it in words');
  else {
    await still();
    s = await look();
    if (s.search !== '' || !s.hero || s.focus !== 'q' || s.steps !== before + 1) problems.push(`finder, Describe it in words: ${JSON.stringify(s)}`);
  }
  return problems;
}

// How much two captures of the same box differ: the share of pixels that differ by more than 48 (red, green and blue summed), and
// the shares of the box's width and height that the rectangle around them takes, as in the home page's reduced-motion check.
async function pictureChange(drawn, bare) {
  return evaluate(`new Promise(done => {
    const load = src => new Promise(resolve => { const img = new Image(); img.onload = () => resolve(img); img.src = 'data:image/png;base64,' + src; });
    Promise.all([load(${JSON.stringify(drawn)}), load(${JSON.stringify(bare)})]).then(([x, y]) => {
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
}

// The finder under reduced motion: nothing runs in it, with or without cards (no animation in the page is running, on
// pseudo-elements too), and every How picture holds a still that shows something: captured with its parts and again with them
// hidden (its dark square stays), the pixels that change are at least 0.3% of the picture and the box around them at least 1%.
async function finderMotionProblems() {
  const problems = [];
  for (const query of ['?view=find', '?view=find&what=background']) {
    await openHome(query, problems);
    await sleep(500);
    const running = await evaluate(`document.getAnimations().filter(a => a.playState === 'running').map(a => {
      const t = a.effect && a.effect.target, cls = t && t.getAttribute && t.getAttribute('class');
      return (a.animationName || a.transitionProperty || 'an animation') + ' on ' + (t ? t.tagName.toLowerCase() + (cls ? '.' + cls.split(' ').join('.') : '') : 'the page') + ((a.effect && a.effect.pseudoElement) || '');
    })`);
    if (running.length) problems.push(`finder, reduced motion, ${query}: ${running.length} animations run (${[...new Set(running)].slice(0, 6).join(', ')})`);
  }
  const pics = await evaluate(`typeof FIND_Q === 'undefined' ? [] : FIND_Q.find(q => q.key === 'how').answers.map(a => a.pic)`);
  if (!pics.length) problems.push('finder, reduced motion: the page has no How answers');
  const frames = 'new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done)))';
  const empty = [];
  for (const pic of pics) {
    const box = await evaluate(`(async () => { const p = document.querySelector('#finder .${pic}'); if (!p || !p.getClientRects().length) return null;
      p.scrollIntoView({ block: 'center' }); await ${frames};
      const b = p.getBoundingClientRect(); return { x: b.left + scrollX, y: b.top + scrollY, width: b.width, height: b.height }; })()`);
    if (!box || !box.width || !box.height) { empty.push(`${pic} (no picture)`); continue; }
    const drawn = (await send('Page.captureScreenshot', { format: 'png', clip: { ...box, scale: 1 } })).data;
    await evaluate(`(async () => { for (const el of document.querySelector('#finder .${pic}').children) el.style.visibility = 'hidden'; await ${frames}; })()`);
    const bare = (await send('Page.captureScreenshot', { format: 'png', clip: { ...box, scale: 1 } })).data;
    await evaluate(`{ for (const el of document.querySelector('#finder .${pic}').children) el.style.visibility = ''; }`);
    const seen = await pictureChange(drawn, bare);
    if (seen.share < .003 || seen.wide * seen.tall < .01) empty.push(`${pic} (${(seen.share * 100).toFixed(2)}% of the picture)`);
  }
  if (empty.length) problems.push(`finder, reduced motion: ${empty.length} How pictures show nothing: ${empty.join(', ')}`);
  return problems;
}
```

- [ ] **Step 2: Call them** — in the main loop, inside `if (home) {…}`, right after `if (setup.moves) problems.push(...await homeCopyProblems());`, add:

```js
          // The finder (?view=find): opened at every setup; the desktop run works it and the reduced-motion run holds it still.
          problems.push(...await finderLayoutProblems(name, setup));
          if (setup.moves) problems.push(...await finderViewProblems());
          if (setup.reduce) problems.push(...await finderMotionProblems());
```

- [ ] **Step 3: Syntax and the tests**

Run: `cd "$WT/af-check" && node --check tools/check-pages.mjs && node --test "tests/*.test.js"`
Expected: no syntax error; every test passes.

- [ ] **Step 4: See the new steps fail before the finder exists.** Serve `af-check` on 8904, take a slot, run `node tools/check-pages.mjs --base http://127.0.0.1:8904 --out "$RUN/check-red" home`, free it, stop the server.
Expected: six `FAIL` lines; every problem on them starts with `finder` (no Find button, the finder does not show, no Finder link, no How answers, and so on) and none is about the home page's own steps. This is the failing test for Tasks 3–5; they turn it into six `ok` lines.

- [ ] **Step 5: Commit**

```bash
cd "$WT/af-check"
git add tools/check-pages.mjs
git commit -m "feat: the page check opens the finder at every home setup, works its answers, address, focus, Show all, Not here? and ways in on desktop, and holds it still under reduced motion"
```

---

### Task 8: Tag one category (seven lanes at once)

Each lane runs this task for its own category, all seven at once, in the shared worktree `af-tags` (no lane changes any file of the repository). The coordinator gives each tagger only its `brief.md` (never this plan, the spec or `tests/finder.test.js`: they hold the test set).

| Lane | Category | Folder | Cards |
|---|---|---|---|
| 01 | Scroll-Based | `animations/01-scroll-based` | 27 |
| 02 | Entrance & Exit | `animations/02-entrance-and-exit` | 14 |
| 03 | Page Transitions | `animations/03-page-transitions` | 16 |
| 04 | Micro-Interactions | `animations/04-micro-interactions` | 41 |
| 05 | Text & Typography | `animations/05-text-typography` | 19 |
| 06 | 3D & Advanced | `animations/06-3d-advanced` | 26 |
| 07 | Ambient & Background | `animations/07-ambient-background` | 23 |

**Files:**
- Create (run folder): `$RUN/lanes/<NN>/tags.md`, `$RUN/lanes/<NN>/stills/`
- No file in git changes.

**Interfaces:**
- Consumes: `card-facts.mjs`, `lint-tags.mjs`, the slot pool and the server on 8905 (Task 0).
- Produces: `$RUN/lanes/<NN>/tags.md`: a title line, then one table `| slug | what | when | how | reason |` with one row per card of the category in home order, keys from the brief separated by single spaces, main first, read by Task 9, Task 11 (`assemble-find.mjs`) and Task 14.

The tagger's brief (`$RUN/lanes/<NN>/brief.md`, written by Task 0 with the lane's values):

````markdown
# Finder answers for <NN> · <Category> (<count> cards)

The handbook is getting an Animation finder for people who saw an animation on a website and do not know its name. They answer
three questions with picture buttons, and the animations whose answers match come first, with their names. You give each animation
of one category the answers a visitor who saw it would pick. Your answers decide whether they find it.

Read only this brief, the pages and the files it names. Do not open `docs/superpowers/specs/2026-10-13-animation-finder-design.md`,
`docs/superpowers/plans/2026-10-13-animation-finder.md` or `tests/finder.test.js`: they hold the described effects your answers are
scored against, and seeing them would spoil the score. Change no file of the repository; you write only `$RUN/lanes/<NN>/tags.md`.

## The three questions

**1 · What moved?** `text` Text or numbers · `card` A picture or card · `button` A button or icon · `menu` A menu or form ·
`loader` A loading sign or message · `shape` A line or shape · `particles` Dots or particles · `background` The background ·
`page` The whole page.

**2 · When did it move?** `scroll` When I scrolled · `hover` When I pointed at it · `click` When I clicked or tapped ·
`drag` When I dragged or swiped · `load` When the page opened · `newpage` When I went to another page · `loop` By itself, again
and again.

**3 · How did it move?** The visitor picks the picture closest to what they saw.

| Key | Answer | Its picture | For example |
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

Each question also has Not sure, which leaves it out.

## How your answers are used

For each question the visitor answers, an animation's first (main) answer counts double, its other answers count once, and having
none of the visitor's answer is a miss. Animations that miss nothing come first, those that miss one come after. So put first the
answer most people would pick, add the ones people might pick instead, and add nothing the effect does not show.

## Rules

- Tag what a visitor sees and would say, not how it is built.
- What: 1 to 3 keys; the first is what the demo moves.
- When: 1 to 3 keys: every trigger the effect is commonly used with on real sites, not only the demo's (a fade plays when the page
  opens, on scroll and on click), the most common first.
- How: 1 to 4 keys: the most visible movement first, then the ones a visitor might name instead.
- A technique that drives many effects (Scroll-Triggered Animation, View Transitions API, FLIP Technique, Scrub Animation) takes
  only the movements its own demo shows.
- Not sure is never an answer.
- Every page transition (category 03) answers `newpage`; every loop page (kind `loop`) answers `loop`; every Scroll-Based page
  (category 01) and every scroll page (kind `scroll`) answers `scroll`. The lint checks these three.

## What to read for each card

From the root of the `af-tags` worktree, `node $RUN/card-facts.mjs <NN> $RUN` prints, for every card in home order, its home card
line and places, its page's kind, title, lede, prompt (what the viewer sees, in plain words), Good for and Avoid on, and its
README's What it is and When to use it. Look at each card's desktop still with the Read tool (the path card-facts prints); when the
still caught a quiet moment, read the stage's markup and script in the page itself.

## Format

`$RUN/lanes/<NN>/tags.md`: the title line `# Finder answers · <NN> <Category>`, a blank line, then one table with one row per card,
in the order card-facts prints:

| slug | what | when | how | reason |
|---|---|---|---|---|

The keys in a cell are separated by single spaces, main first. The reason is one line, at most about 25 words, saying what a
visitor sees and why these answers.

## Worked rows

The first two are the spec's own examples; the third follows the same rules. They show the format; judge every card yourself.

| slug | what | when | how | reason |
|---|---|---|---|---|
| parallax-scrolling | background card | scroll | layers | Far and near layers of a landscape slide at different speeds as you scroll; visitors name the layered background, sometimes the picture. |
| slide-in | card menu loader | load click | slide fade | A panel travels in from an edge, as a card, a menu or a notification, when the page opens or after a click; some remember only a fade. |
| loading-spinner | loader | load loop | turn | Small shapes spin round while something loads, again and again: a loading sign that turns. |

## Done when

`node $RUN/lint-tags.mjs $RUN/lanes/<NN>/tags.md`, run from the `af-tags` root, prints `ok`. Then report: the number of cards, the
rows you were least sure of, and why.
````

- [ ] **Step 1: The failing check**

Run: `cd "$WT/af-tags" && node "$RUN/lint-tags.mjs" "$RUN/lanes/<NN>/tags.md"`
Expected: `Usage: node lint-tags.mjs …` (exit 2): there is no ledger yet.

- [ ] **Step 2: Start the stills** (background). Take a slot, then
`cd "$WT/af-tags" && node tools/check-pages.mjs --base http://127.0.0.1:8905 --out "$RUN/lanes/<NN>/stills" <folder>`
(10 to 45 minutes; a `FAIL` line does not matter here, the run is for its pictures). Free the slot when it ends.

- [ ] **Step 3: Read the cards**

Run: `cd "$WT/af-tags" && node "$RUN/card-facts.mjs" <NN> "$RUN"`
Read every card's facts; once the stills exist, look at every `<NN>-<slug>-desktop.png`.

- [ ] **Step 4: Write the ledger** — `$RUN/lanes/<NN>/tags.md` in the brief's format, one row per card, by the brief's rules.

- [ ] **Step 5: Lint until clean**

Run: `cd "$WT/af-tags" && node "$RUN/lint-tags.mjs" "$RUN/lanes/<NN>/tags.md"`
Expected: `ok: <count> cards of <NN> <Category>`. Fix every problem it prints and run it again.

- [ ] **Step 6: Record** (the run folder is outside git, so nothing is committed): add to `$RUN/progress.md` the line `Lane <NN>: tags written, lint ok, <count> cards; least sure: <slugs>`.

---

### Task 9: Check one category's tags (seven checkers)

Runs for a lane as soon as its Task 8 is done, by a fresh agent (never the tagger), given only `$RUN/lanes/<NN>/check-brief.md`.

**Files:**
- Create (run folder): `$RUN/lanes/<NN>/check.md`
- Modify (run folder, by the tagger): `$RUN/lanes/<NN>/tags.md`

**Interfaces:**
- Consumes: the lane's `tags.md`, `stills/`, `card-facts.mjs`, `lint-tags.mjs`; the other lanes' `tags.md` that exist.
- Produces: `$RUN/lanes/<NN>/check.md` with `Verdict: approved` (Task 11 reads only approved lanes) or `Verdict: changes` and a table `| slug | now | change to | why |`.

The checker's brief (`$RUN/lanes/<NN>/check-brief.md`, written by Task 0 with the lane's values):

````markdown
# Check: finder answers for <NN> · <Category>

Another agent gave each animation of this category the answers a visitor would pick in the handbook's Animation finder
(`$RUN/lanes/<NN>/tags.md`, made by the rules of `$RUN/lanes/<NN>/brief.md`; read that brief first). You check them. Do not open
`docs/superpowers/specs/2026-10-13-animation-finder-design.md`, `docs/superpowers/plans/2026-10-13-animation-finder.md` or
`tests/finder.test.js`. Change no file of the repository and do not edit `tags.md`: you write `$RUN/lanes/<NN>/check.md`.

For each row, beside the card's facts (`node $RUN/card-facts.mjs <NN> $RUN`, from the root of the `af-tags` worktree) and its
desktop still:
1. Is the first What the thing the demo moves?
2. Does When hold every trigger the effect is commonly used with on real sites, the most common first, and nothing it is never
   used with?
3. Is the first How the most visible movement, and is every other How one a visitor might name instead? Nothing the effect does
   not show?
4. Are the answers what a visitor sees and would say, not how it is built? Does a technique page (Scroll-Triggered Animation,
   View Transitions API, FLIP Technique, Scrub Animation) take only the movements its own demo shows?
5. Across categories: read the other lanes' `tags.md` that exist. The same kind of effect should get the same answers wherever it
   sits (a fade in 02 and a crossfade in 03 both answer `fade`; every page that holds still while you scroll answers `pin`).
6. `node $RUN/lint-tags.mjs $RUN/lanes/<NN>/tags.md` prints `ok`.

Write `$RUN/lanes/<NN>/check.md`: the line `Verdict: approved` or `Verdict: changes`, then for changes one table
`| slug | now | change to | why |`, one row per row to change (the whole what · when · how before and after, and one line why).
The tagger applies the changes or answers in the same file why not; you check those rows again. After two rounds the
coordinator decides what stays open.
````

- [ ] **Step 1: The failing check:** the lane has no `check.md`; `grep -s '^Verdict: approved' "$RUN/lanes/<NN>/check.md" || echo "not approved"` prints `not approved`.
- [ ] **Step 2: Check every row** by the brief's six questions; write `check.md`.
- [ ] **Step 3: The tagger applies the changes** (the same agent as the lane's Task 8, resumed), runs the lint (`ok`), and notes each change it did not make, with why, under the table in `check.md`.
- [ ] **Step 4: Re-check the changed rows;** set `Verdict: approved` when none is left open, or, after the second round, list what is still open for the coordinator.
- [ ] **Step 5: Record:** `grep '^Verdict: approved' "$RUN/lanes/<NN>/check.md"` prints the line; add `Lane <NN>: checked, approved, <n> rows changed` to `$RUN/progress.md`. When all seven lanes are approved, stop the server on 8905.

---

### Task 10: Merge the lanes (coordinator)

**Files:**
- Modify: nothing new; the merges of `af/logic`, `af/404`, `af/check`, `af/pics` and `af/view` into `feat/animation-finder`

**Interfaces:**
- Consumes: Tasks 1–7, each reviewed and approved.
- Produces: `feat/animation-finder` with the whole finder on draft answers: every test passes, the home check gives six `ok` lines.

- [ ] **Step 1: Every code lane is merged**

```bash
for b in af/logic af/404 af/check af/pics af/view; do git -C "$WT/af-int" merge-base --is-ancestor "$b" feat/animation-finder && echo "$b merged" || echo "$b NOT merged"; done
```

Expected: five `merged` lines. Merge any that is not (`git -C "$WT/af-int" merge --no-ff <branch> -m "Merge <branch>: <what it adds>"`); a conflict is resolved by the file map (each task keeps its own lines).

- [ ] **Step 2: Only the finder's files changed**

Run: `git -C "$WT/af-int" diff --stat main...feat/animation-finder`
Expected: only `index.html`, `tests/finder.test.js`, `tests/pages.test.js`, `tools/check-pages.mjs`, `tools/make-social-image.mjs`, `404.html`, `.github/ISSUE_TEMPLATE/animation_not_here.yml` and `.github/ISSUE_TEMPLATE/config.yml`.

- [ ] **Step 3: Tests and the home check**

Run: `cd "$WT/af-int" && node --test "tests/*.test.js"` — expected: every test passes.
Serve `af-int` on 8906 (it serves Tasks 11–16 too), take a slot, run `node tools/check-pages.mjs --base http://127.0.0.1:8906 --out "$RUN/int-draft" home`, free it.
Expected: six `ok` lines.

- [ ] **Step 4: Record** in `$RUN/progress.md`: `Integration: all code lanes merged at <hash>; <n> tests pass; home six ok on draft answers`.

---

### Task 11: The reviewed answers and the test set

**Files:**
- Modify: `index.html` — the `FIND` block right after `PLACES` (the draft is replaced)
- Modify: `tests/finder.test.js` — under `// ── Every card's answers and the test set ──`
- Create (run folder): `$RUN/assemble-find.mjs`, `$RUN/tag-fixes.md`

**Interfaces:**
- Consumes: the seven approved `$RUN/lanes/<NN>/tags.md` (Task 9); `readHome`, `tagRows` (Task 0); `finder()`, `homeConst`, `read`, `HOME` in the tests (Task 1).
- Produces: the reviewed `FIND` with the comment line `// What moved, when and how: the finder's answers for each card, the main one first.`; `CASES` (the spec's 28 described effects) in `tests/finder.test.js`, which the ten new animations' integration extends (Ink Spread Reveal joins case 9).

- [ ] **Step 1: Write the failing tests** — under `// ── Every card's answers and the test set ──` and its comment line:

```js
test('FIND holds the reviewed answers, not the draft', () => {
  assert.match(HOME, /\/\/ What moved, when and how: the finder's answers for each card, the main one first\.\r?\nconst FIND=\{/);
});

test('every answer of every question is given to at least one card', () => {
  const find = Object.values(homeConst('FIND'));
  homeConst('FIND_Q').forEach((q, i) => {
    for (const a of q.answers) assert.ok(find.some(row => row[i].split(' ').includes(a.key)), `no card answers ${q.key} ${a.key}`);
  });
});

test('the answers keep the rules every page of a kind shares: transitions answer newpage, loops loop, scroll pages scroll', () => {
  const find = homeConst('FIND'), problems = [];
  for (const cat of homeConst('CATS')) {
    for (const [slug] of cat.entries) {
      const kind = (read(path.join(ROOT, cat.folder, slug, 'index.html')).match(/data-hb-kind="(\w+)"/) || [])[1];
      const when = find[slug][1].split(' ');
      if (cat.n === '03' && !when.includes('newpage')) problems.push(`${slug}: a page transition without newpage`);
      if (kind === 'loop' && !when.includes('loop')) problems.push(`${slug}: a loop page without loop`);
      if ((cat.n === '01' || kind === 'scroll') && !when.includes('scroll')) problems.push(`${slug}: a scroll page without scroll`);
    }
  }
  assert.deepEqual(problems, []);
});

// The finder spec's 28 described effects (section 9), frozen before any answers existed: the answers a visitor would pick ('' for
// Not sure) and the animations that count as right. The right lists only grow; a miss is fixed by changing FIND, never a case.
const CASES = [
  [1, 'card', 'scroll', 'pieces', ['Shatter Effect', 'Dissolve Transition']],
  [2, 'background', 'loop', 'color', ['Mesh Gradient Animation', 'Animated Gradient Background']],
  [3, 'text', 'load', 'stagger', ['Letter-by-Letter Stagger', 'Split Text Reveal', 'Word-by-Word Reveal']],
  [4, 'card', 'load', 'grow', ['Scale In / Zoom In']],
  [5, 'card', 'hover', 'grow', ['Hover State Animation']],
  [6, '', 'scroll', 'pin', ['Pin Animation', 'Sticky Section', 'Scrollytelling']],
  [7, 'card', 'scroll', 'grow', ['Zoom Into Image']],
  [8, '', 'scroll', 'layers', ['Parallax Scrolling', 'Parallax Depth-of-Field']],
  [9, 'page', 'click', '', ['Circle Reveal', 'Overlay Wipe', 'Portal / Tunnel Zoom']],
  [10, 'text', 'load', 'reveal', ['Curtain Reveal', 'Text Clip-Path Reveal']],
  [11, 'page', 'scroll', 'slide', ['Smooth (Inertia) Scroll']],
  [12, 'card', 'scroll', 'turn', ['Scroll Image Sequence', 'Scrub Animation', 'Scroll-Driven 3D Rotation']],
  [13, 'text', 'scroll', 'color', ['Text Fill on Scroll']],
  [14, 'card', 'hover', 'follow', ['Spotlight Hover Glow']],
  [15, 'shape', 'loop', 'turn', ['3D Model Orbit']],
  [16, 'button', 'click', 'morph', ['Hamburger Menu Toggle']],
  [17, 'button', 'hover', 'follow', ['Magnetic Button']],
  [18, 'card', 'hover', 'turn', ['Parallax 3D Tilt', 'Holographic Card']],
  [19, 'loader', 'load', 'color', ['Skeleton Loader', 'Shimmer Effect']],
  [20, 'text', 'scroll', '', ['Counter Animation', 'Rolling Numbers']],
  [21, 'page', 'scroll', 'slide', ['Horizontal Scroll']],
  [22, 'menu', 'scroll', 'slide', ['Hide-on-Scroll Header']],
  [23, 'card', 'hover', 'follow', ['Image Trail']],
  [24, 'particles', 'loop', 'drift', ['Particle Constellation', 'Canvas Particle Effect']],
  [25, 'text', 'loop', 'glitch', ['Glitch Text', 'Chromatic Aberration']],
  [26, 'particles', 'loop', 'drift', ['Snow / Rain']],
  [27, 'page', 'newpage', 'slide', ['Overlay Wipe', 'Slide Transition']],
  [28, 'particles', 'click', 'pieces', ['Success Confetti']]
];

test('the test set: a right animation among the first 6 for at least 24 of the 28 described effects, and among the first 12 for at least 27', t => {
  const page = finder(), names = new Set(homeConst('CATS').flatMap(cat => cat.entries.map(e => e[1])));
  let in6 = 0, in12 = 0;
  for (const [n, what, when, how, right] of CASES) {
    for (const name of right) assert.ok(names.has(name), `case ${n}: no card is named ${name}`);
    const found = page.findMatches({ what, when, how }), list = [...found.best, ...found.close].map(e => e.name);
    const position = list.findIndex(name => right.includes(name)) + 1; // 0: not found
    if (position && position <= 6) in6++;
    if (position && position <= 12) in12++;
    t.diagnostic(`case ${n} (${[what, when, how].map(a => a || 'Not sure').join(' · ')}): ${position ? `${list[position - 1]} at ${position}` : 'not found'}` +
      (!position || position > 6 ? `; first six: ${list.slice(0, 6).join(', ')}` : ''));
  }
  assert.ok(in6 >= 24, `${in6} of 28 cases have a right animation among the first 6 (at least 24)`);
  assert.ok(in12 >= 27, `${in12} of 28 cases have a right animation among the first 12 (at least 27)`);
});
```

- [ ] **Step 2: Run them and see them fail on the draft**

Run: `cd "$WT/af-int" && node --test --test-reporter=spec tests/finder.test.js`
Expected: `FIND holds the reviewed answers, not the draft`, the answer coverage test, the rules test and the test set FAIL (the draft gives every card of a category the same When and How); the diagnostics print each case's position.

- [ ] **Step 3: Lint the seven lanes from the integration worktree**

```bash
cd "$WT/af-int" && for n in 01 02 03 04 05 06 07; do grep -q '^Verdict: approved' "$RUN/lanes/$n/check.md" || echo "lane $n not approved"; node "$RUN/lint-tags.mjs" "$RUN/lanes/$n/tags.md"; done
```

Expected: seven `ok: …` lines and no `not approved`.

- [ ] **Step 4: The assembler** — create `$RUN/assemble-find.mjs`:

```js
#!/usr/bin/env node
// Writes the reviewed finder answers into index.html: every row of the seven lanes' tags.md, in home order, as the FIND block right
// after PLACES. It replaces the block that is there (the draft, or one an earlier run wrote), with its comment line. Run from the
// root of the af-int worktree: node <run folder>/assemble-find.mjs <run folder>
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { readHome, tagRows } from './home-data.mjs';

const RUN = process.argv[2];
if (!RUN) { console.error('Usage: node assemble-find.mjs <run folder>'); process.exit(2); }
const home = readHome(), CATS = home.valueOf('CATS'), rows = new Map(), problems = [];
for (const cat of CATS) {
  for (const [slug, what, when, how] of tagRows(readFileSync(join(RUN, 'lanes', cat.n, 'tags.md'), 'utf8'))) {
    if (rows.has(slug)) problems.push(`${slug}: in two rows`);
    rows.set(slug, [what, when, how]);
  }
}
const slugs = CATS.flatMap(cat => cat.entries.map(e => e[0]));
for (const slug of slugs) if (!rows.has(slug)) problems.push(`${slug}: no row in any lane`);
for (const slug of rows.keys()) if (!slugs.includes(slug)) problems.push(`${slug}: not a card of the home page`);
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
const block = ["// What moved, when and how: the finder's answers for each card, the main one first.", 'const FIND={'];
CATS.forEach((cat, c) => {
  block.push(`  // ${cat.n}`);
  cat.entries.forEach(([slug], i) => {
    const last = c === CATS.length - 1 && i === cat.entries.length - 1;
    block.push(`  '${slug}':[${rows.get(slug).map(v => `'${v}'`).join(',')}]${last ? '' : ','}`);
  });
});
block.push('};');
// The block that is there: from the comment line right above "const FIND={" to the ";" after its closing brace.
const decl = home.text.indexOf('const FIND={');
if (decl < 0) { console.error('index.html has no const FIND={'); process.exit(1); }
const from = home.text.lastIndexOf(home.eol, decl - home.eol.length - 1) + home.eol.length;
if (!home.text.slice(from, decl).startsWith('//')) { console.error('the line above const FIND={ is not its comment'); process.exit(1); }
const to = home.blockEnd(home.text.indexOf('{', decl)) + 2; // past the "};"
writeFileSync('index.html', home.text.slice(0, from) + block.join(home.eol) + home.text.slice(to));
console.log(`Wrote FIND: ${slugs.length} cards from the seven lanes`);
```

Run: `cd "$WT/af-int" && node "$RUN/assemble-find.mjs" "$RUN"` — expected: `Wrote FIND: 166 cards from the seven lanes`; `git diff --stat` shows only `index.html`.

- [ ] **Step 5: Run the tests**

Run: `cd "$WT/af-int" && node --test --test-reporter=spec "tests/*.test.js"`
Expected: every test passes, the test set with at least 24 of 28 in the first 6 and 27 in the first 12. Copy the 28 diagnostic lines into `$RUN/progress.md`.

- [ ] **Step 6: If the test set falls short, fix answers, never cases.** For each case not in the first 6, read its diagnostic line (the first six it shows) and the right animation's row. Change a row only where the change is itself true by the brief's rules: give the right animation an answer a visitor who saw it would give, or take from another card an answer its effect does not show. Never add an answer just to win a case. Write each change into `$RUN/tag-fixes.md` (`| slug | was | now | case | why |`), make it in the lane's `tags.md`, run that lane's lint, then Steps 4 and 5 again. At most three rounds; if the target is still not met, stop and tell the coordinator, who shows the owner (Task 15) the cases and the rows.

- [ ] **Step 7: The home check on the reviewed answers.** Take a slot, run `node tools/check-pages.mjs --base http://127.0.0.1:8906 --out "$RUN/int-answers" home`, free it.
Expected: six `ok` lines (the desktop run checks that Hide-on-Scroll Header comes in the first six for case 22's answers).

- [ ] **Step 8: Commit**

```bash
cd "$WT/af-int"
git add index.html tests/finder.test.js
git commit -m "feat: the finder's reviewed answers for all 166 animations, and the test set of 28 described effects with its target"
```

---

### Task 12: The held-out set

A fresh research agent, once Task 11 is committed, beside Task 13. It may use the web; it must not read `FIND`, run the finder or open `$RUN/tag-fixes.md` before its cases are frozen.

**Files:**
- Create (run folder): `$RUN/held-out.md`

**Interfaces:**
- Consumes: the spec (its section 2 for the questions, section 9 for the 28 cases it must not repeat); `docs/superpowers/specs/2026-10-13-famous-effects-design.md` in the main checkout (the Famous effects list); the home page's card names (`CATS`).
- Produces: `$RUN/held-out.md`, a table `| # | Source | What they described | What | When | How | Right if one of |` with 10 rows (`-` for Not sure; right names separated by `; `, each exactly a card's name in `CATS`), read by Task 14's `run-cases.mjs`.

- [ ] **Step 1: The failing check:** `test -f "$RUN/held-out.md" || echo "no held-out set"` prints `no held-out set`.
- [ ] **Step 2: Gather ten real cases** not among the spec's 28: new "what is this animation called?" threads (r/css, r/Frontend, r/web_design, the GSAP, Webflow and freeCodeCamp forums) and effects from the Famous effects list (which may give Stripe's 2026 ribbon). For each: the link, what the person described (one plain line), the answers a visitor would pick from that description alone, and the animations that count as right (the thread's accepted answer, or the technique the effect uses), named exactly as on the home page's cards.
- [ ] **Step 3: Write `$RUN/held-out.md`** in the format above, with a line on top: `Frozen on <date> by <agent>, before running the finder. Never used to change answers.`
- [ ] **Step 4: Record** in `$RUN/progress.md`: `Held-out set: 10 cases frozen, <sources>`. The agent does not run the cases; Task 14 does.

---

### Task 13: Main, the docs and the generated files

Runs in `af-int` once Task 11 is committed, beside Task 12. The docs are written now, on top of what `main` holds (coordination file).

**Files:**
- Merge: `main` into `feat/animation-finder` (coordination rule 2), if `main` has moved
- Modify: `CLAUDE.md` — step 6 of "When asked to add a new animation" (lines 210–219 on main) and the Home page line of "Tests and the page check" (lines 260–263)
- Modify: `CONTRIBUTING.md` — step 5 of "Adding a new technique" (lines 77–89) and the home check paragraph (lines 302–307)
- Modify: `.github/pull_request_template.md` — after line 21 (the `CATS` checkbox)
- Modify: `README.md` — How to use it, step 1 (line 31)
- Modify: `CHANGELOG.md` — under `## Unreleased` (line 5)
- Generated: `sitemap.xml` (the home page's date), `og-image.png` (must stay as it is), `llms.txt` and `skills/` (must stay as they are)

**Interfaces:**
- Consumes: the merged finder (Tasks 1–11).
- Produces: the docs' finder lines (each project writes only its own lines); generated files written by their tools.

- [ ] **Step 1: Take main's latest commits**

```bash
cd "$WT/af-int"
git merge-base --is-ancestor main feat/animation-finder && echo "main is in" || git merge --no-ff --no-commit main
```

If it merged: resolve any conflict by the coordination file's map (each project keeps its own lines; a resolution that needs more than keeping both sides goes to a fresh reviewer) and `git add` each resolved file, then write the generated files again and commit them in the merge:

```bash
node tools/update-sitemap.mjs && node tools/make-skill.mjs
# take a slot; the server on 8906 serves this worktree
node tools/make-social-image.mjs --base http://127.0.0.1:8906
# free the slot
git add -A sitemap.xml llms.txt skills og-image.png
git commit -m "Merge main into feat/animation-finder before its release"
node --test "tests/*.test.js"
```

Expected: every test passes.

- [ ] **Step 2: The failing check** — the docs do not name the finder's lines yet:

Run: `cd "$WT/af-int" && grep -c "FIND" CLAUDE.md CONTRIBUTING.md .github/pull_request_template.md; grep -c "?view=find" README.md; grep -c "Animation finder" CHANGELOG.md`
Expected: `0` for each file.

- [ ] **Step 3: `CLAUDE.md`.** In step 6, after the sentence `Without one the card shows the category's generic picture.`, add:

```markdown
   Give it its finder answers in `FIND` too, a row right after `PLACES` in `CATS` order:
   `'slug':['what','when','how']`, each a space-separated list of answer keys from `FIND_Q`, the main one first. What takes 1–3
   (the main one is what the demo moves), When 1–3 (every trigger the effect is commonly used with, the most common first) and
   How 1–4 (the most visible movement first, then the ones a visitor might name instead). Tag what a visitor sees and would say,
   not how it is built; a page transition answers `newpage`, a loop page `loop`, a Scroll-Based or scroll page `scroll`.
   `tests/finder.test.js` checks the row and runs the finder's test set.
```

In the **Home page:** line of "Tests and the page check", before `Run it after changing any page's settings or prompt.`, add:

```markdown
Every setup also opens the finder (`?view=find`): its desktop run works the answers, See N matches,
  Start over, Show all, the Not here? link and the ways in, and its reduced-motion run checks that every How picture holds a still.
```

- [ ] **Step 4: `CONTRIBUTING.md`.** In step 5, after `one the card shows the category's generic picture.`, add:

```markdown
   Give it its finder answers in `FIND` too, a row right after `PLACES` in `CATS` order:
   `'slug':['what','when','how']`, each a space-separated list of answer keys from `FIND_Q`, the
   main one first. What takes 1–3 (the main one is what the demo moves), When 1–3 (every trigger
   the effect is commonly used with, the most common first) and How 1–4 (the most visible movement
   first, then the ones a visitor might name instead). Tag what a visitor sees and would say, not
   how it is built; a page transition answers `newpage`, a loop page `loop`, a Scroll-Based or
   scroll page `scroll`. `tests/finder.test.js` checks the row and runs the finder's test set.
```

In the home check paragraph, before `Run it after changing any page's settings or prompt.`, add:

```markdown
Every setup also opens the finder (`?view=find`): its desktop run works the answers, See N
matches, Start over, Show all, the Not here? link and the ways in, and its reduced-motion run
checks that every How picture holds a still.
```

- [ ] **Step 5: `.github/pull_request_template.md`.** After the line that starts `- [ ] A card in the category's \`entries\``, add:

```markdown
- [ ] Its finder answers in `FIND`, main first: a row right after `PLACES`, in `CATS` order (`tests/finder.test.js` checks it and runs the finder's test set)
```

- [ ] **Step 6: `README.md`.** Step 1 of How to use it becomes:

```markdown
1. **Find it.** On the [home page](https://matinmonshizadeh.github.io/animation-handbook/), pick where the animation goes — Buttons, Text, Images & cards, Backgrounds, Menus & forms, Loading & messages, Page intros, Scrolling, or Page changes — or describe it in your own words, like "a button that bounces when clicked", or, if you saw it somewhere and don't know its name, answer three questions in the [finder](https://matinmonshizadeh.github.io/animation-handbook/?view=find).
```

- [ ] **Step 7: `CHANGELOG.md`.** Right under `## Unreleased` and its blank line, add:

```markdown
- The Animation finder: saw an animation on a website and don't know its name? Answer three short questions on the home page
  (what moved, when and how) and the animations that match play, with their names. Not here? opens a short GitHub form.
```

- [ ] **Step 8: Generated files and every check**

```bash
cd "$WT/af-int"
node tools/update-sitemap.mjs && node tools/make-skill.mjs && git status --short sitemap.xml llms.txt skills
```

Expected: at most `sitemap.xml` changed, and only on its first `<url>` line (the home page's `lastmod`; nothing if Step 1 already wrote it); `llms.txt` and `skills/` unchanged. Take a slot, run `node tools/make-social-image.mjs --base http://127.0.0.1:8906`, then `node tools/check-pages.mjs --base http://127.0.0.1:8906 --out "$RUN/int-docs" home`, free the slot. Expected: `git status --short og-image.png` prints nothing (the picture is unchanged), and six `ok` lines. Run `node --test "tests/*.test.js"`: every test passes.

- [ ] **Step 9: Commit**

```bash
cd "$WT/af-int"
git add CLAUDE.md CONTRIBUTING.md .github/pull_request_template.md README.md CHANGELOG.md sitemap.xml
git commit -m "docs: a new animation gets its finder answers, the home check names the finder, the README points to it and the changelog lists it under Unreleased; the sitemap dates the home page"
```

---

### Task 14: Final review (three reviewers at once)

**Files:**
- Create (run folder): `$RUN/run-cases.mjs`, `$RUN/final-review-tags.md`, `$RUN/final-review-code.md`, `$RUN/final-review-visual.md`
- Fixes, if any, go into `af-int` by the original builders (the coordinator dispatches them)

**Interfaces:**
- Consumes: `feat/animation-finder` after Tasks 11 and 13; `$RUN/held-out.md` (Task 12); `readHome` (Task 0).
- Produces: three verdicts; the held-out result (`N of 10 in the first 6`).

- [ ] **Step 1: A frozen checkout and the case runner.** `git -C "$MAIN" worktree add --detach "$WT/af-final" feat/animation-finder`; serve it on 8907. Create `$RUN/run-cases.mjs`:

```js
#!/usr/bin/env node
// Runs described effects through the finder as the page runs it and prints where the first right animation comes, and the totals.
// The cases are a table | # | Source | What they described | What | When | How | Right if one of | ("-" for Not sure; right names
// separated by "; "). Usage, from the root of a checkout of feat/animation-finder: node <run folder>/run-cases.mjs <cases.md>
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { readHome } from './home-data.mjs';

const home = readHome(), CATS = home.valueOf('CATS');
const context = vm.createContext({ CATS, PLACES: home.valueOf('PLACES'), FIND_Q: home.valueOf('FIND_Q'), FIND: home.valueOf('FIND') });
vm.runInContext(home.text.slice(home.text.indexOf('const PLACE_LIST=['), home.text.indexOf('const BY_SLUG=')), context);
for (const name of ['findScore', 'findMatches']) vm.runInContext(home.functionSource(name), context);
const names = new Set(CATS.flatMap(cat => cat.entries.map(e => e[1])));
let cases = 0, in6 = 0, in12 = 0;
for (const line of readFileSync(process.argv[2], 'utf8').split(/\r?\n/)) {
  const cells = line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
  if (cells.length !== 7 || !/^\d+$/.test(cells[0])) continue;
  const [n, , , what, when, how, rightCell] = cells, right = rightCell.split(';').map(s => s.trim()).filter(Boolean);
  for (const name of right) if (!names.has(name)) console.log(`case ${n}: no card is named "${name}"`);
  const answers = { what: what === '-' ? '' : what, when: when === '-' ? '' : when, how: how === '-' ? '' : how };
  const found = context.findMatches(answers), list = [...found.best, ...found.close].map(e => e.name);
  const position = list.findIndex(name => right.includes(name)) + 1;
  cases++; if (position && position <= 6) in6++; if (position && position <= 12) in12++;
  console.log(`case ${n} (${[what, when, how].join(' · ')}): ${position ? `${list[position - 1]} at ${position}` : 'not found'}; first six: ${list.slice(0, 6).join(', ')}`);
}
console.log(`${in6} of ${cases} in the first 6, ${in12} of ${cases} in the first 12`);
```

Check it on two of the spec's cases: write `$RUN/two-cases.md` with the rows `| 16 | spec | menu icon | button | click | morph | Hamburger Menu Toggle |` and `| 22 | spec | header hides | menu | scroll | slide | Hide-on-Scroll Header |`, run `cd "$WT/af-final" && node "$RUN/run-cases.mjs" "$RUN/two-cases.md"`. Expected: the same positions the test set's diagnostics gave for cases 16 and 22 in Task 11. Delete `two-cases.md`.

- [ ] **Step 2: Reviewer A, the answers** (a fresh agent; it may now read everything). Reads the 166 rows of `FIND` beside each card's facts (`node $RUN/card-facts.mjs <NN> $RUN` from `af-final`) and its desktop still in `$RUN/lanes/<NN>/stills/`, asking of each row "would someone who saw this pick these?"; reads `$RUN/tag-fixes.md` (each fix must be true by the rules, not only win a case); runs `cd "$WT/af-final" && node "$RUN/run-cases.mjs" "$RUN/held-out.md"`. Writes `$RUN/final-review-tags.md`: the rows to change with why, and the held-out line. At least 7 of 10 in the first 6 passes; fewer is reported to the owner at Task 15 (the questions or the rules need work), never answered by more tag changes.

- [ ] **Step 3: Reviewer B, code and tests** (a fresh agent). Reads `git diff main...feat/animation-finder`. Checks: only the files of the Global Constraints changed (`git diff --stat`); no animation page, shared file or version line touched; every word of the contract exact; `findMatches` pure, weights 3/2/1, the main answer double, Close only with two or more answers, ties to fewer answers then home order; the address and history rules; the focus rules; native radios, words as names, pictures hidden from screen readers, 44px targets, 4.5:1 text; reduced motion; `fd-` keyframes moving only transform and opacity, no name twice; the page check's additions only new functions and one block; `404.html` never sends anyone off the site; the issue form a valid GitHub form (name, description, body items with type, id, attributes, validations); each test would fail if the behavior it names broke. Writes `$RUN/final-review-code.md` with findings by severity.

- [ ] **Step 4: Reviewer C, the look** (a fresh agent). Take a slot, run `cd "$WT/af-final" && node tools/check-pages.mjs --base http://127.0.0.1:8907 --out "$RUN/final" home` (six `ok` lines expected), then dark-theme shots: `node "$RUN/shoot.mjs" --url "http://127.0.0.1:8907/?view=find&what=text&when=load&how=stagger" --theme dark --size 1366x768 --full --shot "$RUN/final/dark-laptop.png"` and the same with `--size 375x812 --mobile --shot "$RUN/final/dark-phone.png"`; free the slot. Looks at every `home-*-finder*.png` and both dark shots: words readable and not cut, the tick visible in both themes, each How picture reading as its words, the reduced-motion stills clear with their arrows, nothing overflowing at 320px, question 3 on a 375px phone. Writes `$RUN/final-review-visual.md`.

- [ ] **Step 5: Fixes.** The coordinator sends each finding to the builder of the part it concerns (answers to the lane's tagger through Task 11's fix rules), in `af-int`; then Task 11's Step 5 and Step 7 and Task 13's Step 8 again for what changed, and the reviewer re-checks its findings. Commit each fix with a `fix:` message naming what it fixes; log each in `$RUN/progress.md`.

---

### Task 15: The owner's look

**Files:**
- Create (run folder): `$RUN/owner/*.png`

**Interfaces:**
- Consumes: `feat/animation-finder` after Task 14, served from `af-int` on 8906; `shoot.mjs`.
- Produces: the owner's answers: go live (yes or no, and when), question 3 as it is or the fallback (Task 16), the `finder` label (yes or no).

- [ ] **Step 1: Pictures of three effects the owner has seen.** Take a slot, then for each address — `?view=find&what=background&when=loop&how=color` (soft colors moving behind a page, like Stripe's), `?view=find&what=text&when=scroll&how=color` (words lighting up as you scroll, like Apple's), `?view=find&what=button&when=click&how=morph` (a menu icon turning into an X) — run:

```bash
node "$RUN/shoot.mjs" --url "http://127.0.0.1:8906/<address>" --size 1366x768 --full --shot "$RUN/owner/<name>-laptop.png"
node "$RUN/shoot.mjs" --url "http://127.0.0.1:8906/<address>" --size 375x812 --mobile --full --shot "$RUN/owner/<name>-phone.png"
```

with `<name>` `stripe`, `apple`, `menu`; and question 3 on a phone:

```bash
node "$RUN/shoot.mjs" --url "http://127.0.0.1:8906/?view=find" --size 375x812 --mobile --eval "document.querySelector('.fd-how').scrollIntoView()" --shot "$RUN/owner/question-3-phone.png"
```

Free the slot. Open each with the Read tool before sending.

- [ ] **Step 2: Ask the owner**, in very short, simple words, with the pictures:

```markdown
The finder is ready to look at. It is a view of the home page, so it opens like a page of its own at …/?view=find.
Pictures: Stripe-like soft colors, Apple-like words lighting up, and a menu icon turning into an X, each on a laptop and a
phone; and question 3 on a phone.
1. Put it live now? (The next launch post is <Reddit on 2026-10-17 | Show HN on 2026-10-25>.)
2. Question 3 has 17 picture answers. Keep all 17, or show the 9 most used first and "More ways it moved" for the other 8?
3. May I create the label "finder" on GitHub? The form works without it.
```

Add one line with the held-out result if it fell short of 7 of 10. If the owner wants to click through it, open `http://127.0.0.1:8906/?view=find` in the browser pane for them.

- [ ] **Step 3: Record** the three answers, word for word, in `$RUN/progress.md`. "Show 9 first" → Task 16; a change asked for → a fix in `af-int` by the builder of that part, then Tasks 14 Step 5's checks again; "go live" → Task 17.

---

### Task 16: Question 3 shows nine answers first (only if the owner asks for it at Task 15)

**Files:**
- Modify: `index.html` — the end of the finder block (script), `showFinder`, the end of the `/* ── finder ── */` CSS block
- Modify: `tools/check-pages.mjs` — `finderViewProblems` and `finderMotionProblems` (Task 7's functions)
- Modify: `tests/finder.test.js` — under `// ── The finder view, its ways in and Not here? ──`

**Interfaces:**
- Consumes: `finderEl`, `state`, `showFinder` (Task 3); `FIND` (Task 11).
- Produces: `.fd-more` (More ways it moved), the eight least used How labels hidden until it is pressed; `showMoreHow(focus)`.

- [ ] **Step 1: Write the failing test:**

```js
test('question 3 can start with the nine movements most cards carry, and More ways it moved shows the other eight', () => {
  assert.ok(HOME.includes("moreHow.textContent='More ways it moved'"), 'the button');
  assert.ok(HOME.includes('howCount(b.key)-howCount(a.key)).slice(0,9)'), 'the nine most used shown first');
});
```

Run `node --test tests/finder.test.js` — expected: it FAILS on `the button`.

- [ ] **Step 2: Implement.** At the end of the finder block:

```js
// Question 3 at first shows the nine movements most cards carry; More ways it moved shows the other eight (the owner's ruling at
// the finder's review: 17 answers were too many at once on a phone). An answer among the eight, from the address or Back, shows
// them too, and pressing the button moves keyboard focus to the first of them, as the button goes away.
const HOW_Q=FIND_Q.find(qu=>qu.key==='how'),howCount=k=>Object.values(FIND).filter(r=>r[2].split(' ').includes(k)).length;
const FIRST_HOW=new Set([...HOW_Q.answers].sort((a,b)=>howCount(b.key)-howCount(a.key)).slice(0,9).map(a=>a.key));
const howBox=finderEl.querySelector('.fd-how .fd-as');
const howExtra=[...howBox.querySelectorAll('.fd-a')].filter(l=>{const k=l.querySelector('.fd-r').value;return k!=='unsure'&&!FIRST_HOW.has(k);});
const moreHow=document.createElement('button');
moreHow.type='button';moreHow.className='pillbtn fd-more';moreHow.textContent='More ways it moved';moreHow.setAttribute('aria-expanded','false');
howExtra.forEach(l=>{l.hidden=true;});
howBox.after(moreHow);
function showMoreHow(focus){
  if(moreHow.hidden)return;
  howExtra.forEach(l=>{l.hidden=false;});moreHow.hidden=true;moreHow.setAttribute('aria-expanded','true');
  if(focus)howExtra[0].querySelector('.fd-r').focus();
}
moreHow.addEventListener('click',()=>showMoreHow(true));
```

In `showFinder`, after the radios line, add (the first render comes after this block, so `howExtra` is ready by then):

```js
  if(howExtra.some(l=>l.querySelector('.fd-r').value===state.how))showMoreHow(false);
```

At the end of the `/* ── finder ── */` CSS block:

```css
.fd-more{margin-top:12px}
```

- [ ] **Step 3: The page check shows the eight before using them.** In `finderViewProblems`, right after the first `look()`, and in `finderMotionProblems`, right before `const pics = …`, add:

```js
  await evaluate(`(() => { const b = document.querySelector('.fd-more'); if (b && !b.hidden) b.click(); })()`);
```

- [ ] **Step 4: Tests and the home check.** Run `node --test "tests/*.test.js"` (every test passes) and, with a slot, `node tools/check-pages.mjs --base http://127.0.0.1:8906 --out "$RUN/fallback" home` (six `ok` lines). Shoot question 3 on a phone again (Task 15 Step 1's last command) for the owner.

- [ ] **Step 5: Commit**

```bash
cd "$WT/af-int"
git add index.html tools/check-pages.mjs tests/finder.test.js
git commit -m "feat: the finder's third question starts with the nine movements most animations show, and More ways it moved shows the other eight"
```

---

### Task 17: Release, on the owner's word (coordinator)

**Files:**
- Merge: `feat/animation-finder` into `main` in the release worktree; then `main` into `feat/see-inside-compare`
- Generated: `sitemap.xml`, `llms.txt`, `skills/`, `og-image.png`, written again in each merge

**Interfaces:**
- Consumes: the owner's word for this release (Task 15) and, between 2026-10-23 and 2026-10-26, the owner's word for that day.
- Produces: the finder live at `https://matinmonshizadeh.github.io/animation-handbook/?view=find`; the `finder` label if the owner said yes.

- [ ] **Step 1: Main's latest first.** If `main` moved since Task 13 (`git -C "$WT/af-int" merge-base --is-ancestor main feat/animation-finder` fails), repeat Task 13 Step 1 and Step 8 in `af-int`.

- [ ] **Step 2: Merge in the release worktree** (coordination rule 3)

```bash
MAIN=C:/Users/matin/OneDrive/Desktop/Projects/animation-handbook; WT=$MAIN/.claude/worktrees
git -C "$MAIN" worktree list | grep -q '/release ' || git -C "$MAIN" worktree add "$WT/release" main
cd "$WT/release" && git status --short && git merge --no-ff --no-commit feat/animation-finder
```

Serve `release` on 8990 (background), take a slot, then:

```bash
node tools/update-sitemap.mjs && node tools/make-skill.mjs && node tools/make-social-image.mjs --base http://127.0.0.1:8990
git add -A sitemap.xml llms.txt skills og-image.png
git commit -m "Merge feat/animation-finder: the Animation finder, three questions that name an animation someone saw"
node --test "tests/*.test.js"
node tools/check-pages.mjs --base http://127.0.0.1:8990 home
```

(and `node tools/check-pages.mjs --base http://127.0.0.1:8990 famous` once the Famous effects page exists). Free the slot.
Expected: every test passes; six `ok` lines.

- [ ] **Step 3: Push** — `git -C "$WT/release" push origin main`. Then check the live site once GitHub Pages has built: `curl -s https://matinmonshizadeh.github.io/animation-handbook/ | grep -c 'id="finder"'` prints `1`.

- [ ] **Step 4: The label, if the owner said yes**

```bash
gh label create finder --repo matinmonshizadeh/animation-handbook --description "Someone could not find an animation with the finder" --color 2f5bea
```

- [ ] **Step 5: The same day, main into the rollout's branch** (coordination rule 4): in the main checkout (on `feat/see-inside-compare`, never switched), `git merge --no-ff --no-commit main`, resolve by the file map, write the generated files again as in Step 2 (with the main checkout served by the coordinator's own review server, on a port no lane is using), commit the merge, run the tests and `home`.

- [ ] **Step 6: Clean up.** Stop every finder server; remove the worktrees `af-logic`, `af-pics`, `af-view`, `af-404`, `af-check`, `af-tags`, `af-int`, `af-final` (`git worktree remove …`) and delete the merged `af/*` branches (`git branch -d …`); keep `feat/animation-finder` until the ten new animations have taken it in. With the owner's OK, delete leftover `hb-chrome-*` folders in the temp folder. Log the release (hashes, date, the label) in `$RUN/progress.md`, and tell the coordinator that the ten new animations' lanes now add their own `FIND` rows by the rules of Task 8's brief, and that Ink Spread Reveal joins case 9 of `CASES` at their integration.

---

## Self-review against the spec

| Spec | Requirement | Task |
|---|---|---|
| Owner rulings | Not here? opens a short GitHub form with the answers filled in; live from the home page on the owner's word; tabs later | 5, 15, 17 (tabs: out of scope, Task 17 Step 6 hands over) |
| What the owner will see 1–5 | Find button, Finder link, the finder in place of the top, three questions with Not sure, cards in two groups, Not here?, answers in the address | 3, 4, 5 |
| §1 | A view of the home page `?view=find`; the tab's title; no new page | 3 |
| §2 | The three questions, keys and words exactly; Not sure; still icons for What and When, moving pictures for How | 1 (data), 2 (pictures), 3 (built from `FIND_Q`) |
| §3 | `FIND` right after `PLACES`, in `CATS` order, main first; `FIND_Q` one list read by the page and tests; tagging rules; seven lanes with stills, a checker per lane, integrator, fresh reviewer | 1 (draft, shape tests), 8, 9, 11, 14 |
| §4 | Points (main 2×, other 1×), weights How 3 · What 2 · When 1, Best and Close, order, nothing for no answer, `findMatches(answers)` pure and tested with vm | 1 |
| §5 | Layout, fieldsets with numbered legends, five and two across, six and three across, Not sure, See N matches, Start over, Your matches and its line, groups, 12 then Show all, no phone bar; behavior; address and history; old addresses; works from disk | 3, 4 (aria-current, ways in) |
| §6 | The Not here? panel and its words; the form `animation_not_here.yml` with its four fields and label; the prefilled address; the contact link | 5 |
| §7 | Find button under Popular, full width on phones, first-screen measured; Finder link before Browse all, How it works leaves the bar below the measured width; modified clicks left to the browser; 404 routes and third way back; the tab pass is later | 4, 6 |
| §8 | Radios in fieldsets, words as names, hidden pictures, focus ring and tick, 400 ms live line, focus rules, 4.5:1, 44px, no sideways scroll at 320px, reduced motion | 3, 2, 7 (checked), 14 |
| §9 | The 28 cases and the 24/28 and 27/28 targets with positions printed; held-out set of 10, at least 7, never tuned; the owner's look with the question-3 still, the fallback ready, the one line, the label question; every unit test; every page-check step | 11, 12, 14, 15, 16, 1–7 |
| §10 | Files, no shared-file bump, docs at integration, README and CHANGELOG lines, `make-social-image` hides both ways in and the picture stays the same | 4, 13, Global Constraints |
| §11 and coordination | Branch from `main`, worktrees `af-*`, run folder, ports 8901–8909, the shared slot pool, headless only, no `git stash`, merge never rebase, generated files by their tools, release rules and the launch window | Global Constraints, 0, 10, 13, 17 |

Placeholder scan: every code step holds its code; the lane-specific values (`<NN>`, `<Category>`, `<folder>`, `<count>`) come from Task 8's table, and `<date>`, `<hash>` and the owner's answers are recorded, not invented. Names checked across tasks: `FIND_Q`, `FIND`, `findQuery`, `findWords`, `findScore`, `findMatches`, `findIssueURL`, `fromURL`, `writeURL`, `render(answered)`, `say`, `answeredAny`, `findLine`, `showFinder`, `showFound`, `showNotHere`, `enterFind`, `navFind`, `FIND_PAGE`, `FIND_TITLE`, the ids `finder`, `find-title`, `find-qs`, `find-see`, `find-reset`, `find-not`, `find-not-s`, `find-gh`, `find-words`, `nav-find`, the classes `fd-*`, and the run scripts `home-data.mjs` (`readHome`, `KEYS`, `MAX`, `tagRows`), `lint-tags.mjs`, `card-facts.mjs`, `shoot.mjs`, `draft-find.mjs`, `fd-preview.mjs`, `assemble-find.mjs`, `run-cases.mjs`.
