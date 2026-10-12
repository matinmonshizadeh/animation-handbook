# AI skill fixes: design

2026-10-12. The owner tested the skill (`skills/animation-handbook/`, commit 701aed8) on five everyday requests against
a small landing page, each built once with the skill and once without, by Claude Opus 5.5. All 46 objective checks
passed both ways, but a blind reviewer preferred the build without the skill on all five (9.53 against 8.47 out of 10),
and the skill cost about 30% more tokens and 10% more time. The causes, and what this change does about each:

| Cause | Fix |
|---|---|
| A. Step 3 said "keep the default (in bold)", so the demo's defaults, chosen for a small demo box, went into real pages (a 70% trigger line left part of the first screen empty; a 50ms stagger between three large cards barely showed; one answer open at a time made FAQ rows jump) | The bold choice is where the demo starts, a starting point; the settings are chosen for the user's page, the user's own words first |
| B. Step 4 said "follow the prompt as the specification", so every feature a prompt names was built (a stack of four toasts with swipe to dismiss for one message) | Build the smallest version that does what the user asked; keep what the prompt says about looking right, smoothness, accessibility and reduced motion; name the features left out as options |
| C. The keyboard rule ("focus shows it and the arrow keys move it") made six non-interactive cards focusable and took over the arrow keys | Keyboard parity on links, buttons and controls only; never make other content focusable for a decoration, never take the arrow keys unless the element is a control that uses them. The touch rule gets the same split: a tap for a hover that reveals something needed; a decorative hover can stay still on touch screens |
| D. Settings had names but no values, and step 3 sent the model to each README for them: a web fetch in every run | Each setting line carries its README Key parameters text (what it does, with the demo's values); a page without settings lists its Key parameters; the README step goes |
| E. Most rules restated what a strong model does anyway | The rules are kept short and the ones that matter on a real page are added (below) |
| F. `references/catalog.md` (58 KB) was read whole in every run | Step 1 searches it instead; each line loses its "Entry in …" link (the folder in the live address names the category file) |

Rules added for the user's page, each one something the builds without the skill did and the builds with it missed:
nothing on the first screen waits for a scroll; hidden starting states and script-only controls come from the script,
so the page without it shows everything; a running loop pauses out of view (and a frame loop or timer while the tab is
hidden); a glow or blob of color gets its soft edge from a gradient, not a large blur filter. Where a prompt and a rule
differ, the rule wins: the prompts describe each technique as its demo shows it, in a box on a page about animation.

## `tools/make-skill.mjs`

- `readPage` also reads the page's `README.md` Key parameters table (name, default, effect per row). A setting's row is
  the one named like the setting on the page (the `.hb-setting-name` or the switch's words, as `tests/pages.test.js`
  matches them), whatever `data-hb-label` the copied prompt uses.
- An entry's settings: `- <label>: <choices with the default in bold>. <effect>`; a page without Try it lists its Key
  parameters as `- <name>: <default>. <effect>`. The "Copied from the site with the defaults…" line goes: the model
  chooses its own settings, and the line only repeated the defaults.
- A catalog line: `- [<name>](<live address>): <description> Places: <places>.`
- The SKILL.md body is the text in the generator, rewritten as above (steps, rules, where to look); the description
  stays.

## README changes

- Key parameters rows that name choices without the values the demo uses (a size, a duration, a distance, a strength)
  get those values in plain words, checked against the demo's code, in the style of the rows that have them ("small is
  4°, medium 7.5° and large 12.5°"). Switches, counts already in words and purely descriptive choices stay as they are.
- Accordion, "Several open at once": says that with it off the pressed question moves up when the answer that closes is above it
  closes, and with it on only the answer being opened moves.
- Stagger Reveal, "Delay between items": says the demo's values suit its grid of small items, and that a few large
  cards need a longer wait to come in visibly one after another.

The pages, their prompts and their defaults do not change: the defaults suit the demos, and the skill now treats them as
a starting point.

## Tests

`tests/skill.test.js`: every setting line of an entry holds its README Key parameters text; an entry of a page without
settings holds every Key parameters row. The rest stays (prompt word for word, one bold default, one catalog line per
page, SKILL.md front matter and length, contents lists).

## Checks beyond the tests

The owner's test again, in clean headless sessions (no project instructions, plugins or other skills): the five
requests plus two new ones the fixes were not written against (magnetic hero buttons, stats that count up), each built
twice with the new skill and twice without by Opus 5.5, once each by Sonnet 5.5, and a "which animations would you add"
question; a blind reviewer compares the pairs with the first test's rubric. Also whether the skill is picked up on its
own in a fresh session. Results go to the owner's test workspace, `iteration-2/`.
