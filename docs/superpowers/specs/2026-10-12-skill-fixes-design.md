# AI skill fixes: design

2026-10-12. The owner tested the skill (`skills/animation-handbook/`, commit 701aed8) on five everyday requests against
a small landing page, each built once with the skill and once without, by Claude Opus 5.5. All 46 objective checks
passed both ways, but a blind reviewer preferred the build without the skill on all five (9.53 against 8.47 out of 10),
and the skill cost about 30% more tokens and 10% more time. The causes, and what this change does about each:

| Cause | Fix |
|---|---|
| A. Step 3 said "keep the default (in bold)", so the demo's defaults, chosen for a small demo box, went into real pages (a 70% trigger line left part of the first screen empty; a 50ms stagger between three large cards barely showed; one answer open at a time made FAQ rows jump) | The bold choice is where the demo starts, a starting point; the settings are chosen for the user's page, the user's own words first |
| B. Step 4 said "follow the prompt as the specification", so every feature a prompt names was built (a stack of four toasts with swipe to dismiss for one message) | Build the smallest version that does what the user asked; keep what the prompt says about looking right, smoothness, accessibility and reduced motion; name the features left out as options |
| C. The keyboard rule ("focus shows it and the arrow keys move it") made six non-interactive cards focusable and took over the arrow keys | Keyboard parity on links, buttons and controls only; never make other content focusable for a decoration, never take the arrow keys unless the element is a control that uses them. The touch rule gets the same split: a tap for a hover that reveals something needed; a decorative hover stays still on touch screens |
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
- Accordion, "Several open at once": says that with it off the pressed question moves up when the answer that closes
  is above it, and with it on only the answer being opened moves.
- Stagger Reveal, "Delay between items": says the demo's values suit its grid of small items, and that a few large
  cards need a longer wait to come in visibly one after another.

The pages, their prompts and their defaults do not change: the defaults suit the demos, and the skill now treats them as
a starting point.

## Tests

`tests/skill.test.js`: every setting line of an entry holds its README Key parameters text; an entry of a page without
settings holds every Key parameters row. The rest stays (prompt word for word, one bold default, one catalog line per
page, SKILL.md front matter and length, contents lists).

## Checks beyond the tests

The plan was the owner's test again in clean headless sessions. The command line was logged out, so the builds ran as
agents inside one session instead, which carry the project instructions and memory of this repository; each builder,
with the skill and without, got the same note to ignore them. The judges were agents that load no project instructions,
comparing each pair blind (A and B drawn at random) with the first test's rubric. The requests: the owner's five
(toast, tilt cards, scroll reveal, hero background, FAQ accordion) and the owner's three new ones (which animation suits
a hero headline, a button that pulls toward the mouse, a spinner on a sending button), built by Opus, Sonnet and Haiku
5.5, once each per round (Opus twice in round 2). One pair moves by about half a point from the judge alone: read
single pairs as signs, groups as results. Everything is in the owner's test workspace, `iteration-2/` to
`iteration-4/` and `blind-2/` to `blind-4/`.

## Results and revisions

| Round | Skill | Pairs | Opus | Sonnet | Haiku |
|---|---|---|---|---|---|
| Test 1 (owner) | 701aed8 | 5 | 0 wins of 5, −1.06 | | |
| 2 | this design (v3) | 32 | 8 of 16, −0.48 | 3 of 8, −0.37 | 1 of 8, −1.05 |
| 3 | v4 | 24 | 3 of 8, −0.04 | 4 of 8, +0.05 | 3 of 8, −0.34 |
| 4 | v5, the 8 pairs that still trailed | 8 | 1 of 3, −0.11 | 0 of 1, −0.34 | 1 of 4, −0.76 |

Each cell: the pairs the skill won and its mean score minus the build without it, out of 10. In round 2 the new skill
also beat the old one on all five of the owner's requests (+1.73) and tied test 1's clean builds without a skill
(+0.07), so most of the gap left was the builders' own context, the same on both sides. Over the eight pairs judged in
rounds 2, 3 and 4 the mean gap went −1.25, −0.67, −0.46. Tokens per request in round 3, skill against none (both
including about 70 thousand of session context): Opus 195k against 180k, Sonnet 255k against 273k, Haiku 214k against
200k; minutes per request 18 against 19, 24 against 32 and 11 against 9. No run fetched a README.

What each round changed, from the judges' notes and the builds:

- v4: each part the request needs gets one plain way to use it (a close button, not also taps and swipes); decorative
  motion stops under reduced motion and stays still on touch; a pointer-following effect keeps the element's normal
  focus style and adds no tab stops or arrow keys; pointer handlers store the position and one frame loop reads it;
  nothing in view after a load or a jump waits for a scroll; an answer to "which animation" gives real timings and
  values, not the demo's setting names. On Opus and Sonnet the which-animation question went from about −2.5 to −0.3,
  and so did the button that pulls toward the mouse; on Haiku −3.0 to −1.7 and −2.3 to −1.3.
- v5: what a prompt says about accessibility stays when other parts are left out (pausing a toast's timer while it is
  read); colors come from the user's page; a scroll trigger sits near the bottom of the screen; pointer effects let CSS
  transitions ease, measure the resting box and measure again on scroll.
- v6, after a review of the whole change, not tested on its own: a direct request from the user comes before the
  rules; an entry's blur amount becomes the gradient's fade width; each part keeps one way to use it per kind of input,
  plus Escape to close; script-built controls are for plain HTML pages; physics keeps equal steps. `make-skill.mjs`
  skips a divider row anywhere in a Key parameters table and the test checks that each setting line ends with its
  effect.

Opus and Sonnet now tie the builds without the skill, within the judge's noise. Haiku still trails on tilt cards and
the which-animation question, by about one and two points: it applied the pointer rule in full where a hover tilt needs
less (a hit test across the page on every move, twice the code of the build without the skill), and it recommended a
line-by-line reveal without saying how to split a headline into lines. Round 4's two question pairs kept their demo
links and so were not fully blind.
