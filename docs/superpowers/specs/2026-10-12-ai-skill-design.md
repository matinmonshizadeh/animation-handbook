# AI skill: design

2026-10-12. Step 3 of the launch plan. People add the handbook to their AI coding assistant with one command; when they
ask for an animation, the assistant finds the right technique among the 166 and builds it from that page's prompt and
settings. The owner chose: all 166 prompts inside the skill, made by a script from the pages; a Claude Code plugin too;
the install lines at the top of the README; an `llms.txt`; the website pages do not change.

## New files

| File | What it is |
|---|---|
| `skills/animation-handbook/SKILL.md` | The skill: when to use it, how to pick and build an animation, the rules, where to look |
| `skills/animation-handbook/references/catalog.md` | All 166 in one list, to choose from |
| `skills/animation-handbook/references/<category>.md` | One per category folder (`01-scroll-based.md` … `07-ambient-background.md`): each animation's full entry |
| `llms.txt` | At the repo root, so the site serves it at `…/animation-handbook/llms.txt`: every page with its one line |
| `.claude-plugin/marketplace.json` | Makes the repo a Claude Code plugin marketplace with one plugin, the skill |
| `tools/make-skill.mjs` | Writes the skill's three kinds of files and `llms.txt` from the pages and the home page's `CATS` and `PLACES` |
| `tests/skill.test.js` | Checks the skill and `llms.txt` are up to date and well formed |

Why `skills/` at the root: the skills CLI (`npx skills add owner/repo`, vercel-labs/skills) looks there; a `SKILL.md`
at the repo root would install the whole website; `.claude/` and `.agents/` are git-ignored here.

## `tools/make-skill.mjs`

- Plain Node 22+, no packages (like the other tools). Run from the repo root: `node tools/make-skill.mjs`. It reads
  `index.html` (the `CATS` array: categories in order, each card's slug, name and one-line description; `PLACES`: each
  card's places) and every page `animations/<category>/<slug>/index.html`, and writes the files above except
  `marketplace.json` (hand-written, static). It writes LF line endings and prints what it wrote.
- It exports its pure part, `buildSkill(root)` returning `{ '<path relative to root>': '<file text>' }`, so the test can
  compare a fresh build with the files on disk. Running it twice changes nothing.
- From each page it takes: the `<h1>`; the one-line description (`p.hb-lede`); the kind (`data-hb-kind`: once, loop,
  do, scroll); the prompt (`p.hb-prompt`, entities decoded, whitespace squeezed, exactly the words on the page); the
  Good for and Avoid on tags; and the Try it settings.
- **Settings** follow the page script's own rules (`assets/js/demo-page.js`, `readSettings`, `labelFor`, `valueFor`):
  the controls in the Try it step in page order (`input[type=range]`, `input[type=checkbox]`, `input[type=text]`,
  `textarea`, `select`, `.seg`, `.swatches`), controls under More options included, a control that is `hidden` or has
  `data-hb-skip` (itself or an ancestor inside Try it) left out; the label by the same order (`data-hb-label`,
  `aria-labelledby`, a wrapping `label`, `label[for]`, the setting's `.hb-setting-name`); for a choice group every choice
  (its text, or its `aria-label` for color swatches), the pressed one as the default and a `data-hb-phone` choice as the
  phone default; for a switch on and off with its default; for a text field its starting text. HTML is read with
  focused regular expressions over this uniform markup (the tests already pin how each control is written).

## `SKILL.md`

- Front matter with only `name: animation-handbook`, `description` and `license: MIT`. The description is under 1024
  characters, in the third person, says what the skill does and when to use it, and contains no `: ` (it breaks the
  YAML some installers read) and no `<` or `>`. A good start: "Builds web animations from Animation Handbook, a set of
  166 tested techniques with plain-words build prompts and settings (scroll effects, entrances and exits, page
  transitions, micro-interactions for buttons and forms, text effects, 3D and WebGL, ambient backgrounds). Use when the
  user asks to add, pick or improve an animation, transition, hover or click effect, loading state, scroll effect or
  background motion in a web page or app, in any framework or plain HTML, CSS and JavaScript."
- The body, under 200 lines, in plain words:
  1. What it is, with the live site's address.
  2. How to use it: find the technique (`references/catalog.md`, by what the user describes and where it goes); read
     its entry in the category file; choose settings from the user's words, else keep the defaults (ask only when the
     choice changes the result a lot); build it in the user's own stack from the prompt, with the user's element in
     place of the [bracketed] parts; then check the rules below.
  3. The rules every animation follows, from the handbook's own: animate transform and opacity only; a JavaScript frame
     loop moves by elapsed time; reduced motion shows the end state or a fade; a hover or drag has a touch equivalent;
     a pointer or hover effect also works from the keyboard and a press effect starts on Enter or Space; controls are at
     least 44×44 px on phones; text stays at least 4.5:1 against its background; heavy effects get a lighter phone
     version; no new library unless the project already uses one (the prompts work with plain code).
  4. Where to look: the seven category files, each with its count and what it holds.

## `references/catalog.md`

A contents line, then all 166 in the home page's order, grouped by category: each line has the name, the one-line
description, its places (Buttons, Text, Images & cards, Backgrounds, Menus & forms, Loading & messages, Page intros,
Scrolling, Page changes) and the category file it is in. After that, a short "By place" index: each place with the
names in it.

## `references/<category>.md`

A contents list at the top (every file is over 100 lines), then one entry per page in the home page's order:

- `## <name>`, the one-line description, the live demo address
  (`https://matinmonshizadeh.github.io/animation-handbook/animations/<category>/<slug>/`), how it starts in plain words
  (plays once · moves by itself · reacts to the visitor · follows the scroll), Good for and Avoid on;
- **Prompt**: the page's prompt, exactly;
- **Settings**: one line per setting, `Label: choice · **default** · choice`, the phone default named where there is
  one, switches as on/off, text fields with their starting text; then one line saying that, when settings are chosen,
  the prompt ends as on the site: `Settings from the demo: <label>: <value>, <label>: <value>.` A page without Try it
  says it has no settings.

## `llms.txt`

The llmstxt.org shape: `# Animation Handbook`, a one-line `>` summary with the count, a short paragraph (what each page
gives, and the skill's install command), then one `## <category>` section per category in `CATS` order with a line per
card `- [<name>](<live address>): <one-line description>`, and an `## Optional` section linking the source on GitHub.

## `.claude-plugin/marketplace.json`

One marketplace named `animation-handbook` (owner Matin Monshizadeh) with one plugin `animation-handbook` whose skill is
`./skills/animation-handbook`. Use the layout the current Claude Code docs give for a marketplace whose plugin lives in
the same repo (check https://code.claude.com/docs/en/plugins/marketplace-reference on the day; the known working pattern
is `"source": "./"`, `"strict": false`, `"skills": ["./skills/animation-handbook"]`). No `version`, so installs follow
`main`. Install: `/plugin marketplace add matinmonshizadeh/animation-handbook`, then
`/plugin install animation-handbook@animation-handbook`.

## README, CLAUDE.md, CONTRIBUTING.md

- `README.md`: in the centered block at the top, under "Open the live handbook →", the install command
  `npx skills add matinmonshizadeh/animation-handbook` in a code block; after "How to use it", a short section "Use it
  from your AI assistant": the skills command (Claude Code, Cursor, Codex, GitHub Copilot, Gemini CLI and other agents
  that read Agent Skills), the two Claude Code plugin commands, and one sentence on what happens (ask in plain words; the
  assistant picks the technique and builds it with its prompt and settings).
- `CLAUDE.md` and `CONTRIBUTING.md`: where they list the steps for a new animation, the sitemap step also runs
  `node tools/make-skill.mjs`; and a line that changing any page's prompt, settings, description or tags means running
  it again (the skill test fails until then).
- `CHANGELOG.md` is left alone in this branch (another branch adds its "Unreleased" heading; the line is added when the
  branches are merged).

## `tests/skill.test.js`

1. A fresh `buildSkill(ROOT)` equals every generated file on disk (line endings ignored), and the skill folder holds no
   other file.
2. `SKILL.md`: only the three front matter keys; `name` is `animation-handbook`, the folder's name, lowercase and
   hyphens, at most 64 characters; the description is at most 1024 characters with no `: `, `<` or `>`; the body is
   under 200 lines and links each reference file.
3. Every guided-steps page has exactly one entry in its category file and one line in `catalog.md`, by its live
   address; each entry holds the page's prompt word for word and every setting label of its Try it step.
4. `llms.txt` has one line per card, in `CATS` order, each with the live address and the card's description.
5. `marketplace.json` parses, and its plugin's skills path holds `SKILL.md`.
6. Every reference file over 100 lines starts with a contents list.

## Checks beyond the tests

- A one-off browser check: for every page at 1280×800, the page's own Copy prompt text (`DemoPage.pageCopyText`)
  equals the skill entry's prompt followed by its default settings line. The result goes in the report.
- `node --test "tests/*.test.js"` passes.

## Not in this change

- No change to any page or to the home page. No skills.sh badge yet (it appears after the first installs). No
  `llms-full.txt`. Testing the install with `npx skills add` downloads the CLI, so it waits for the owner's OK.
