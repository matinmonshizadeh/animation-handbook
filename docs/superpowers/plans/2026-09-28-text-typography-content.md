# Text & Typography — Content Sheet

This sheet decides, page by page, how the fourteen Text & Typography pages present their kind, settings, words and prompt on the guided-steps page. Tasks 4–10 of `2026-09-28-demo-page-rollout-text-typography.md` follow each section exactly, together with that plan's "How to convert a page". Rotate In (`animations/02-entrance-and-exit/rotate-in/`) is the reference for everything a section does not mention; Split Text Reveal and Letter-by-Letter Stagger are the reference for text pieces and typed text.

How to read a section:

- **Sets in the demo** lists one value per choice, in the same order as the choices. A Speed row sets both the script's variable (used by the timers) and the CSS variable it names.
- **Shown only when …** in the Control column means the setting's whole `div.hb-setting` gets the `hidden` attribute while it has no effect, so it also drops out of "Your settings".
- Switches in Try it keep their default in the markup (`checked` when the default is on), as on Rotate In. Only the player bar's Loop and Slow motion start unchecked.
- **Plays once:** loop timings follow today's code. "Holds X" is the wait after the play's own movement ends; "waits Y" is the wait after the exit.
- **Watch it help line: default** means the kind's line from the plan's Global Constraints. For plays-once pages that is "It plays by itself. Turn on slow motion to see each part of the movement." Every loop here has Slow motion, so for loops it is "It moves by itself. Pause it to look closely, or turn on slow motion to see each part of the movement."
- **Loops:** "Pause (css)" means `data-hb-pause="css"` and "Pause (page)" means `data-hb-pause` without a value. The same goes for Slow motion and `data-hb-slowmo`. On page loops, Slow motion stretches the movement and the timers that wait for it, but not the holds between movements, as on the plays-once pages. A change on the switch takes effect from the next step at the latest.
- **Feel** uses the Entrance & Exit names: Smooth (slows to a stop) is `ease-out`, Gentle (eases in and out) is `ease-in-out` and Even (one steady speed) is `linear`.
- **Swatches** all use one palette, in this order, with the colour's name as each button's `aria-label`: Pink `#ff6f8b` · White `#f4f4f2` · Blue `#58a6ff` · Purple `#d2a8ff` · Green `#56d364` · Orange `#ffa657`.
- **Stage text** drops Georgia, Arial Narrow and italics, so it uses the site font. Phrases and sentences get `font-weight:700`, as on the Entrance & Exit text stages. Single display words get `800`, unless the section says otherwise. Small grey stage text uses `#8a8a92`, which is 5.9:1 on the stages' `#04060c`. The old `#77777e` is 4.6:1 there, but only 4.0:1 over the `hb-dots` dots.
- **`hb-dots`** is left off where the stage has its own radial gradient, because `hb-dots` replaces the stage's background image.
- **Category line:** the pages have none today. NN is the page's position on the home page, which its card already shows (05.01 Kinetic Typography to 05.14 Wavy Text). This is how the Entrance & Exit pages are numbered.

---

## enter-exit-typography — Enter/Exit Typography

- **Kind:** once. One play shows the five phrases in turn and ends with the last one on screen; Loop repeats it.
- **Description:** Each phrase comes in, stays long enough to read, then leaves. Best for slogans.
- **Watch it help line:** default
- **Player bar:** Replay · Loop · Slow motion
- **Sequence:** Every play starts from the first phrase. Each phrase is first reset hidden: its text is set, its phase classes are removed, `state-hidden` is added and `void phraseEl.offsetWidth` forces a reflow. Then the phrase gets its enter class. The first timer waits Entrance speed + 50ms, then the phrase holds for Time on each phrase. Then it gets its exit class, and the next phrase starts 120ms after the exit (which waits Exit speed + 50ms). The fifth phrase ("Then meaning.") stays on screen after its hold. While Loop is on, the fifth phrase exits too, the stage waits 120ms and the play starts again. Switching Loop off lets the current play finish on the fifth phrase.
- **Slow motion:** multiplies `--enter-dur` and `--exit-dur` by 3, and the timers that wait for them become Entrance speed × 3 + 50ms and Exit speed × 3 + 50ms. Time on each phrase and the 120ms gaps stay.
- **Reduced motion:** the demo's rule stays (`.phrase-el` gets no animation, so the phrases swap without movement). As on the Entrance & Exit pages, Replay plays the sequence once.
- **Stage font:** site font. `.phrase-text` drops Georgia and the italic and gets `font-weight:700`.
- **Stage:** only the phrase stays (`#phrase-el` with `#phrase-text`). The progress dots (`.prog-dots`, which show which phrase is on screen) go, and so do the Phrase and Phase readouts. `hb-dots`: yes. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Entrance speed | Choice buttons | Slow · Normal · Fast | Normal | How quickly each phrase arrives. | `enter` / `--enter-dur`: 800ms / 500ms / 300ms |
| Time on each phrase | Choice buttons | Short · Medium · Long | Medium | How long each phrase holds still to be read. | `hold`: 1200 / 2000 / 3200 (ms) |
| Exit speed | Choice buttons | Slow · Normal · Fast | Normal | Exits usually run a little faster than entrances. | `exit` / `--exit-dur`: 650ms / 400ms / 250ms |

**More options**

None: leave out the `details.hb-options` block.

- **Removed:**
  - The panel's Replay button and Loop checkbox. The player bar replaces them, and the shared script turns Loop on at arrival.
  - The note.
  - The Phrase and Phase readouts, and the progress dots on the stage.
  - The Enter Duration, Hold Duration and Exit Duration sliders. They become Entrance speed, Time on each phrase and Exit speed.
  - The unused `--hold-dur` variable.
- **Good for:** Intros · Brand statements · Hero messages · Screens and signage · **Avoid on:** Long sentences · Key information
- **Prompt:**

  > Add an enter-and-exit text sequence to [the short phrases you want to show]. Show one phrase at a time in the same place: each phrase comes in, holds still long enough to be read, then leaves before the next one arrives. Give each phrase its own way in and out, such as sliding, growing, blurring or wiping, and let each exit lead into the next entrance so the sequence feels connected. Leave the last phrase on screen when the sequence ends. Screen readers should hear each phrase as it appears. If the visitor has reduced motion turned on, swap the phrases without movement. Match the settings listed below.

- **README What it is:** keep
- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Entrance speed | Normal | How long each phrase takes to arrive: slow is 800ms, normal 500ms and fast 300ms; fast feels energetic, slow feels deliberate |
  | Time on each phrase | Medium | How long each phrase holds still: short is 1200ms, medium 2000ms and long 3200ms; it must be longer than it takes to read the phrase |
  | Exit speed | Normal | How long each phrase takes to leave: slow is 650ms, normal 400ms and fast 250ms; exits are usually shorter than entrances |

- **README See also:**
  - [Kinetic Typography](../kinetic-typography/) — words that each move in their own way
  - [Rotate Word Carousel](../rotate-word-carousel/) — one word in a sentence keeps changing
  - [Text Morphing](../text-morphing/) — one word changes into the next, letter by letter
- **README How it works:** keep the two snippets at the top. Delete the sentence "The sequences loop by resetting `idx` to 0 after the last phrase:" and the snippet under it. Put this paragraph in their place: "One play shows the phrases in order and leaves the last one on screen. While Loop is on, the last phrase exits too and the play starts again from the first."
- **README Production notes:** unchanged
- **Category line:** `05.10 · Text &amp; Typography`
- **Pager:** Previous: Outline to Fill (`../outline-to-fill/`) · Next: Rotate Word Carousel (`../rotate-word-carousel/`)

---

## kinetic-typography — Kinetic Typography

- **Kind:** once. One play runs the six phrases and ends with the last one on screen; Loop repeats it.
- **Description:** Words arrive and leave one by one, each moving its own way. Best for intros.
- **Watch it help line:** default
- **Player bar:** Replay · Loop · Slow motion
- **Sequence:** Every play starts from the first phrase, and each phrase's spans are rebuilt hidden before its enter class goes on. Each phrase:
  - enters with its own animation (the `enter` class in `PHRASES`); its sub-line starts 200ms after the word;
  - holds for its own `hold` (900 to 2200ms);
  - exits with its `exit` class, and the next phrase enters 120ms later.

  The step timer waits 500ms + hold, and the exit timer waits 520ms. The sixth phrase ("MEANING.") stays on screen after its hold. While Loop is on, the sixth phrase exits too, the stage waits 800ms and the play starts again. Switching Loop off lets the current play finish on the sixth phrase. Speed divides all of these times, as today's `ms()` does.
- **Slow motion:**
  - `--spd` is set to `speed / 3`, so every entrance and exit animation lasts three times as long.
  - The timers that wait for them are multiplied by 3: the 500ms part of each step timer and the 520ms exit timer.
  - The sub-line's 200ms delay is multiplied by 3 as well.
  - The holds, the 120ms gaps and the 800ms wait stay (they are still divided by Speed).
- **Reduced motion:** the demo's rule stays (`.kw` gets no animation, so the phrases swap without movement). Replay plays the sequence once.
- **Stage font:** site font. `.kw` drops Georgia and gets `font-weight:800`. `.kw.sub` drops `font-family:monospace` but keeps its capitals and letter spacing, and its grey becomes `#8a8a92`.
- **Stage:** only the phrase stays (`#phrase`). The counter ("1 / 6"), the progress bar (`.beat-bar`) and the Phrase and State readouts go. `hb-dots`: yes. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons | Slow · Normal · Fast | Normal | Changes the pace of the whole sequence. | `speed` / `--spd`: 0.6 / 1 / 1.7 |

**More options**

None: leave out the `details.hb-options` block.

- **Removed:**
  - Play / Restart. The player bar's Replay replaces it.
  - Loop sequence. It becomes the player bar's Loop.
  - Show progress bar, and the bar itself. It shows progress; it is not part of the effect.
  - The counter on the stage, and the Phrase and State readouts.
  - The note.
  - The Playback Speed slider. It becomes Speed.
- **Good for:** Intros · Splash screens · Story sections · Presentations · **Avoid on:** Forms and menus · Long text
- **Prompt:**

  > Add a kinetic typography sequence to [the short phrases you want to show]. Show one phrase at a time and give each an entrance and an exit that fit its meaning: a heavy word can drop in large, a soft word can simply fade, a quick word can slide. Hold each phrase long enough to be read, and use size and color so the key words stand out. Leave the final phrase on screen when the sequence ends. Screen readers should hear each phrase as plain text. If the visitor has reduced motion turned on, show the phrases without movement. Match the settings listed below.

- **README What it is:** keep
- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Speed | Normal | The pace of the whole sequence: slow plays it at 0.6× speed, normal at 1× and fast at 1.7×; entrances, holds and exits all scale together |

- **README See also:**
  - [Enter/Exit Typography](../enter-exit-typography/) — each phrase comes in, holds and leaves
  - [Rotate Word Carousel](../rotate-word-carousel/) — one word in a sentence keeps changing
  - [Text Clip-Path Reveal](../text-clip-path-reveal/) — lines of text are uncovered one by one
- **README How it works:** replace the `run` snippet with this version, which keeps the last phrase on screen unless Loop is on (`loop` stands for the Loop switch):

  ```js
  function run(idx = 0) {
    showPhrase(idx);
    const last = idx === PHRASES.length - 1;
    if (last && !loop) return;               // the final phrase stays on screen
    setTimeout(() => {
      exitPhrase(idx, () => run((idx + 1) % PHRASES.length));
    }, ENTER_DUR + PHRASES[idx].hold);
  }
  ```

  The sentence "Playback speed is controlled via a CSS custom property used in every `calc()`:" becomes "The Speed setting is a CSS custom property used in every `calc()`; the timers divide by the same value:".
- **README Production notes:** unchanged
- **Category line:** `05.01 · Text &amp; Typography`
- **Pager:** Previous: none · Next: Typewriter Effect (`../typewriter-effect/`)

---

## outline-to-fill — Outline to Fill

- **Kind:** once. Both words fill and stay filled; Loop repeats it.
- **Description:** Hollow letters fill with color, as a wipe or a fade. Best for big headlines.
- **Watch it help line:** default
- **Player bar:** Replay · Loop · Slow motion
- **Sequence:** Every play starts with `reset()`: both words go back to hollow with their transitions off, and `void fillLayer.offsetWidth` forces a reflow. Then `filled` goes on the fill layer and on the fade wrapper, so both words fill at the same time over Speed. While Loop is on, one cycle is: fills, holds 1400ms, snaps back to hollow at once (`reset()`, with no reverse transition), waits 300ms, then plays again. Switching Loop off lets the words finish filled.
- **Slow motion:** multiplies `--fill-dur` and the `dur` part of the loop timer by 3. The 1400ms hold and the 300ms wait stay.
- **Reduced motion:** the demo's rule stays: the wipe shows filled at once and the fade swaps with no transition. Replay plays once.
- **Stage font:** site font. `.otf-text` drops Georgia and the italic and gets `font-weight:800`, so the letters are thick enough to show the fill.
- **Stage:** both words stay, one above the other, each with its label.
  - The labels read "Wipe" (was "Clip-path Fill") and "Fade" (was "Stroke → Fill Fade").
  - The labels' inline style moves into `.var-label`, and their grey becomes `#8a8a92`.
  - To fit the shared stage (327px tall on a 1366×657 laptop, 300px on phones), `.otf-text` becomes `font-size:clamp(44px,8vw,84px)`. The stage's `gap` and `padding` become 24px, and `fitText()` subtracts 48 instead of 64.
  - `hb-dots`: yes. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Fill direction | Choice buttons | Bottom up · Top down · Left to right · Right to left · From the middle | Bottom up | Where the wipe starts; the fade fills all at once. | `dir`: `'up'` / `'down'` / `'right'` / `'left'` / `'center'`, then `applyDir()` (the fill layer gets no class / `dir-down` / `dir-right` / `dir-left` / `dir-center`) |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long the letters take to fill. | `dur` / `--fill-dur`: 1500ms / 900ms / 550ms |
| Outline thickness | Choice buttons | Thin · Medium · Thick | Medium | Thin looks precise; thick looks bold and graphic. | `--stroke-w`: 1px / 2px / 4px |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Feel | Choice buttons | Smooth · Gentle · Even | Gentle | Gentle eases in and out; Even keeps one pace. | `--fill-ease`: `ease-out` / `ease-in-out` / `linear` |
| Outline color | Swatches | Pink · White · Blue · Purple · Green · Orange | Pink | The color of the letters' edges. | `--stroke-color`: `#ff6f8b` / `#f4f4f2` / `#58a6ff` / `#d2a8ff` / `#56d364` / `#ffa657` |
| Fill color | Swatches | Pink · White · Blue · Purple · Green · Orange | Pink | The color that pours into the letters. | `--fill-color`: `#ff6f8b` / `#f4f4f2` / `#58a6ff` / `#d2a8ff` / `#56d364` / `#ffa657` |
| Your text | Text (`input.hb-text`, keeps `maxlength="10"`) | any text up to 10 characters | OUTLINE | Short words work best, up to 10 letters. | `txtIn.value`, upper-cased, then `applyText()` on input (an empty field falls back to "OUTLINE") |

- **Removed:**
  - Replay and Auto-loop. The player bar replaces them.
  - The note.
  - The Fill Duration and Stroke Width sliders. They become Speed and Outline thickness.
  - The Direction and Easing menus. They become Fill direction and Feel.
  - The Stroke and Fill colour pickers. They become the Outline color and Fill color swatches.
  - The developer wording of the two labels.
- **Good for:** Big headlines · Logos · Posters · Section titles · **Avoid on:** Small text · Body text
- **Prompt:**

  > Add an outline-to-fill effect to [your headline or logo word]. The text should start hollow, with only the outline of each letter showing, then fill with color. The fill can wipe in from one side, like paint, or fade in everywhere at once, like ink soaking through. Draw the outline and the filled text as two layers in exactly the same place so the letters never shift. Use large, heavy letters so there is enough inside each one to fill. The text must stay readable by screen readers. If the visitor has reduced motion turned on, show the filled text straight away. Match the settings listed below.

- **README What it is:** rewritten:

  > Outline to fill starts text as hollow letters, with only the outline of each letter showing, then fills them with color, so the text looks as if it is being inked in. There are two ways to do it, and the demo shows both: a wipe that fills the letters from one side, like paint, and a fade that fills them everywhere at once, like ink soaking in.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Fill direction | Bottom up | Where the wipe starts: the bottom, the top, the left, the right or the middle; bottom up reads like filling a container, left to right like writing. The fade has no direction |
  | Speed | Normal | How long the fill takes: slow is 1500ms, normal 900ms and fast 550ms |
  | Outline thickness | Medium | How wide the outline is: thin is 1px, medium 2px and thick 4px; thin looks precise, thick looks bold |
  | Feel | Gentle | Gentle eases in and out; Smooth slows to a stop; Even keeps one steady pace |
  | Outline color | Pink | The color of the letters' outline |
  | Fill color | Pink | The color that fills the letters |
  | Your text | OUTLINE | The word that fills, up to 10 letters, shown in capitals |

- **README See also:**
  - [Text Gradient Animation](../text-gradient-animation/) — colors flow through the letters instead
  - [Text Clip-Path Reveal](../text-clip-path-reveal/) — whole lines are uncovered the same way
  - [Clip-Path Reveal](../../02-entrance-and-exit/clip-path-reveal/) — a shape uncovers any element
- **README How it works:** unchanged
- **README Production notes:** unchanged
- **Category line:** `05.09 · Text &amp; Typography`
- **Pager:** Previous: Text Gradient Animation (`../text-gradient-animation/`) · Next: Enter/Exit Typography (`../enter-exit-typography/`)

---

## scramble-text — Scramble / Glitch Text

- **Kind:** once. The letters decode and stay decoded; Loop repeats it.
- **Description:** Random symbols lock into the real text, left to right. Best for tech headlines.
- **Watch it help line:** default
- **Player bar:** Replay · Loop · Slow motion
- **Sequence:** Every play rebuilds the letters scrambled (today's `scramble()`, which first clears the previous play's timers and interval).
  - Letter i locks at (i + 1) × Delay between letters. Here i counts letters only; spaces no longer take a step.
  - Until a letter locks, it changes to a new random character every Flicker speed.
  - The flicker stops when the last letter locks.

  While Loop is on, the text holds 1200ms after the last letter locks, then the next play starts (every letter scrambles again at once). Switching Loop off lets the text finish decoded.
- **Slow motion:** multiplies Delay between letters and Flicker speed by 3, so the lock timers and the timer that stops the flicker stretch with them. The 1200ms hold stays.
- **Reduced motion:** as today, the play shows the final text at once, with no flicker (the demo's rule and its `reduce` branch stay).
- **Stage font:** site font. `.scramble-text` drops Georgia and gets `font-weight:700`.
- **Stage:** only the text stays.
  - The "Decoding…" caption goes, and so do the Locked, Remaining and Cycle readouts (`.status-bar`).
  - The letters of each word sit in one `span.unit-word` that cannot break, with one plain space between words. This replaces the `.sp` spacer spans and `word-break:break-all`.
  - The flicker colour `#4a7a4a` becomes `#5f9a5f`: the old one is 4.0:1 on the stage, the new one 6.0:1.
  - `hb-dots`: yes. `hb-grow`, because typed text can wrap to several lines.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Random characters | Choice buttons | Alphabet · Symbols · Numbers · Japanese · Mixed | Symbols | What the letters flicker through before they lock. | `charset`: `'alpha'` / `'symbols'` / `'numeric'` / `'matrix'` / `'all'` (the flicker reads `CHARSETS[charset]` on every change, as today) |
| Delay between letters | Choice buttons | Short · Medium · Long | Medium | The wait before each next letter locks into place. | `settleMs`: 40 / 70 / 120 (ms) |
| Flicker speed | Choice buttons | Slow · Normal · Fast | Normal | Fast looks chaotic; slow lets you see each symbol. | `cycleMs`: 65 / 40 / 25 (ms) |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Your text | Text (`input.hb-text`) | any text | DECODE THE MESSAGE | Short phrases work best. Letters show in capitals. | `txtIn.value`, upper-cased (an empty field falls back to "DECODE THE MESSAGE") |

- **Removed:**
  - Replay and Auto-loop. The player bar replaces them.
  - The note.
  - The "Decoding…" caption and the three readouts.
  - The Cycle Speed and Settle Delay per Char sliders. They become Flicker speed and Delay between letters.
  - The Character Set menu. It becomes Random characters.
  - The Enter-key replay on the text field. Typing now replays by itself.
- **Good for:** Tech headlines · Loading screens · Game titles · **Avoid on:** Long text · Calm brands
- **Prompt:**

  > Add a scramble effect to [your headline or short phrase]. Each letter should start as a random character and keep flickering through random characters until it locks into the real letter. Lock the letters in reading order, from left to right, so the text becomes readable bit by bit, as if it is being decoded. Capital letters scramble most cleanly. Screen readers should hear the final text once, never the random characters. If the visitor has reduced motion turned on, show the final text immediately. Match the settings listed below.

- **README What it is:** keep
- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Random characters | Symbols | What the letters flicker through: symbols feel like hacking, Japanese katakana like a film, the alphabet and numbers like a code being broken |
  | Delay between letters | Medium | The wait between one letter locking and the next: short is 40ms, medium 70ms and long 120ms; it sets how fast the decoding travels |
  | Flicker speed | Normal | How often the random characters change: slow every 65ms, normal every 40ms and fast every 25ms; faster looks more chaotic |
  | Your text | DECODE THE MESSAGE | The text that is decoded, shown in capitals |

- **README See also:**
  - [Typewriter Effect](../typewriter-effect/) — text typed one character at a time
  - [Kinetic Typography](../kinetic-typography/) — words that each move in their own way
  - [Text Morphing](../text-morphing/) — one word changes into the next, letter by letter
- **README How it works:** the span-building part of the snippet (from `// Build one span per character` to the end of that `map`) becomes the word-keeping version:

  ```js
    // One span per letter; each word's letters sit in one span.unit-word, which keeps the word on one line
    const spans = [];
    targetText.split(' ').filter(Boolean).forEach((word, wi, words) => {
      const w = document.createElement('span');
      w.className = 'unit-word';
      [...word].forEach(c => {
        const s = document.createElement('span');
        s.dataset.char = c;                                  // the letter it locks to
        s.textContent = chars[Math.floor(Math.random() * chars.length)];
        w.appendChild(s);
        spans.push(s);
      });
      el.appendChild(w);
      if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  ```

  Follow-on edits in the same snippet:
  - Move the `locked` array below this block and size it by `spans.length`.
  - In the settle step, set `s.textContent = s.dataset.char` and count to `spans.length`.
  - Drop the `if (!s) return;` line and the `s &&` check, because every entry is now a letter.
- **README Production notes:** unchanged
- **Category line:** `05.03 · Text &amp; Typography`
- **Pager:** Previous: Typewriter Effect (`../typewriter-effect/`) · Next: Variable Font Morph (`../variable-font-morph/`)

---

## text-clip-path-reveal — Text Clip-Path Reveal

- **Kind:** once. The lines are uncovered and stay shown; Loop repeats it.
- **Description:** Each line of a headline is uncovered in turn. Best for display headlines.
- **Watch it help line:** default
- **Player bar:** Replay · Loop · Slow motion
- **Sequence:** Every play rebuilds the lines hidden (`buildLines()`, then `void headline.offsetWidth`). Line i gets `revealed` 50 + i × Delay between lines ms after the play starts, and uncovers over Speed. While Loop is on, the lines hold 1200ms after the last line finishes, then the next play starts: the lines vanish at once and are uncovered again. Today's loop timer is 50 + delay × (lines − 1) + Speed + 1200ms. Switching Loop off lets the lines finish shown.
- **Slow motion:** multiplies `--line-dur`, the line delays and the matching parts of the loop timer by 3. The 50ms start and the 1200ms hold stay.
- **Reduced motion:** the demo's rule stays (all lines show at once). Replay plays once.
- **Stage font:** site font. `.line-text` drops Georgia and the italic and gets `font-weight:700`.
- **Stage:** only the lines stay. `hb-dots`: yes. `hb-grow`, because typed lines add height; the stage's own `min-height:var(--stage-h)` goes.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Starts from | Choice buttons | Left · Right · Top | Left | The side each line's wipe begins on. | `dir`: `'ltr'` / `'rtl'` / `'ttb'` (the lines get no class / `dir-rtl` / `dir-ttb`) |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long each line takes to uncover. | `dur` / `--line-dur`: 1100ms / 700ms / 400ms |
| Delay between lines | Choice buttons | Short · Medium · Long | Medium | Longer delays make the cascade easier to see. | `stag`: 100 / 180 / 300 (ms) |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Feel | Choice buttons | Smooth · Gentle · Even | Smooth | Smooth slows at the end; Even keeps one pace. | `--ease`: `ease-out` / `ease-in-out` / `linear` |
| Your lines | Text box (`textarea.hb-text`) | any text, one line per row | Good design / Is honest / Always. (three rows) | Put each line on a row of its own. | `linesIn.value`, then `buildLines()` on input (blank rows are skipped) |

- **Removed:**
  - Replay and Auto-loop. The player bar replaces them.
  - The note.
  - The Line Duration and Stagger Between Lines sliders. They become Speed and Delay between lines.
  - The Direction and Easing menus. They become Starts from and Feel.
  - The `cubic-bezier` "Smooth" easing. It was nearly the same as Ease out, which is now Smooth.
  - The Lines box becomes Your lines.
- **Good for:** Headlines · Taglines · Portfolios · **Avoid on:** Body text · Buttons and labels
- **Prompt:**

  > Add a line-by-line reveal to [your multi-line headline]. Lay out every line in its final place from the start, then uncover each line with a wipe that grows from one side until the whole line shows, starting each line a moment after the one above so the headline cascades in. Nothing moves or changes size; only the visible part of each line grows, so the letter spacing stays exactly as designed. A wipe that slows down as it finishes looks calmer than one that stops abruptly. The text must stay readable by screen readers the whole time. If the visitor has reduced motion turned on, show all the lines at once. Match the settings listed below.

- **README What it is:** keep
- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Starts from | Left | The side each line's wipe begins on: left follows the reading order, right suits right-to-left scripts, top works for display headings |
  | Speed | Normal | How long each line takes to uncover: slow is 1100ms, normal 700ms and fast 400ms |
  | Delay between lines | Medium | The wait before each next line starts: short is 100ms, medium 180ms and long 300ms; 100 to 200ms reads as a natural cascade |
  | Feel | Smooth | Smooth slows to a stop, which feels physical; Gentle eases in and out; Even feels mechanical |
  | Your lines | Good design / Is honest / Always. | The headline, one line per row |

- **README See also:**
  - [Clip-Path Reveal](../../02-entrance-and-exit/clip-path-reveal/) — a shape uncovers any element
  - [Curtain Reveal](../../02-entrance-and-exit/curtain-reveal/) — a colored panel covers it, then slides away
  - [Enter/Exit Typography](../enter-exit-typography/) — each phrase comes in, holds and leaves
- **README How it works:** unchanged
- **README Production notes:** unchanged
- **Category line:** `05.05 · Text &amp; Typography`
- **Pager:** Previous: Variable Font Morph (`../variable-font-morph/`) · Next: Marquee / Ticker (`../marquee-ticker/`)

---

## typewriter-effect — Typewriter Effect

- **Kind:** once. The text is typed and stays; Loop repeats it.
- **Description:** Text types itself out behind a blinking cursor. Best for short taglines.
- **Watch it help line:** default
- **Player bar:** Replay · Loop · Slow motion
- **Sequence:** Every play clears the text and types it from the start (today's `start()`), one character per Speed. When Types like a person is on, each keystroke is up to 20ms earlier or later. With Deletes and retypes on, the play then:
  - waits 500ms;
  - deletes back to the start of the last word (or to 60% of the text, if that is later), at about 30ms a character;
  - types that ending again with " — always." added.

  While Loop is on, the text holds 1200ms after typing ends, then the next play starts. Switching Loop off lets the text finish typed.
- **Slow motion:** multiplies every per-character delay by 3 (typing, deleting and retyping), after the person-like variation is added. The 500ms pause before deleting and the 1200ms hold stay, and the cursor keeps blinking once a second.
- **Reduced motion:** as today, the play shows the full text at once with a steady cursor (the demo's rule and its `reduceMotion` branch stay).
- **Stage font:** typewriter font, because the effect imitates typing. `.type-text` uses `ui-monospace,'SFMono-Regular',Menlo,Consolas,'Liberation Mono',monospace` in place of Georgia.
- **Stage:** only the typed text and its cursor stay. The "Typing…" caption and the Speed and Chars readouts (`.stats`) go. `hb-dots`: yes. `hb-grow`, because typed text can wrap.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons | Slow · Normal · Fast | Normal | The time between keystrokes. | `spd`: 80 / 50 / 30 (ms per character) |
| Cursor shape | Choice buttons | Line · Block · Underscore | Line | Block looks like a terminal, line like a text editor. | the cursor's class: `pipe` / `block` / `underscore` (applied to the cursor on screen at once, as today) |
| Deletes and retypes | Switch | on / off | off | Backs up over the last word and types a new ending. | `retypeTog.checked`: the play calls `deleteAndRetype(text)` / `type(text)` |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Types like a person | Switch | on / off | on | Small random pauses make it feel less mechanical. | `jitterTog.checked`: `jitter()` adds up to ±20ms to each delay / returns the delay as it is |
| Cursor color | Swatches | Pink · White · Blue · Purple · Green · Orange | Pink | Pick a color that stands out from the text. | `--cursor-color`: `#ff6f8b` / `#f4f4f2` / `#58a6ff` / `#d2a8ff` / `#56d364` / `#ffa657` |
| Your text | Text (`input.hb-text`) | any text | Typography is the art and craft of arranging type. Good type communicates before it decorates. | Short lines work best; long text is slow to wait for. | `txtIn.value` (an empty field falls back to the default text) |

- **Removed:**
  - Replay and Auto-loop. The player bar replaces them.
  - The note.
  - The "Typing…" caption and the Speed and Chars readouts.
  - The Typing Speed slider. It becomes Speed.
  - The Cursor Style menu. It becomes Cursor shape.
  - The colour picker. It becomes the Cursor color swatches.
  - "(±20ms)" in the variance label.
  - The text box becomes a one-line Your text, because its line breaks showed as spaces anyway.
- **Good for:** Taglines · Chat messages · Terminal screens · Short intros · **Avoid on:** Long text · Buttons and labels
- **Prompt:**

  > Add a typewriter effect to [your tagline or short text]. The text should appear one character at a time, as if someone is typing it, with a blinking cursor always just after the last character. Unless the settings turn it off, vary the time between keystrokes slightly so it feels typed by a person rather than a machine. When the settings include it, back up over the last word and type a new ending. Keep it to short text, because long text is slow to wait for. Screen readers should hear the full text once, not each character. If the visitor has reduced motion turned on, show the full text immediately. Match the settings listed below.

- **README What it is:** keep
- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Speed | Normal | The time between keystrokes: slow is 80ms, normal 50ms and fast 30ms; about 80 to 120ms feels like a natural pace |
  | Cursor shape | Line | A block reads as a terminal, a line as a text editor, an underscore as an old computer screen |
  | Deletes and retypes | off | Types the text, backs up over the last word at about 30ms a character, then types it again with a new ending |
  | Types like a person | on | Moves each keystroke up to 20ms earlier or later so the rhythm is uneven, like real typing |
  | Cursor color | Pink | The cursor's color; pick one that stands out from the text |
  | Your text | Two sample sentences | The text that is typed; short lines work best |

- **README See also:**
  - [Scramble / Glitch Text](../scramble-text/) — random symbols lock into the real text
  - [Rotate Word Carousel](../rotate-word-carousel/) — one word in a sentence keeps changing
  - [Enter/Exit Typography](../enter-exit-typography/) — each phrase comes in, holds and leaves
- **README How it works:** unchanged
- **README Production notes:** unchanged
- **Category line:** `05.02 · Text &amp; Typography`
- **Pager:** Previous: Kinetic Typography (`../kinetic-typography/`) · Next: Scramble / Glitch Text (`../scramble-text/`)

---

## glitch-text — Glitch Text

- **Kind:** loop. The glitch has no end; it runs until paused.
- **Description:** Text tears into red and cyan strips like a broken signal. Best for bold titles.
- **Watch it help line:** default
- **Player bar:** Pause (css) · Slow motion (css)
- **Sequence:** The two colored copies (`::before` and `::after`) loop their strip animations forever (`@keyframes slice` and `slice2`, over Speed). The page's `reslice()` runs on its own timer: 120ms plus a random extra of up to about 60 + 320 × Glitch strength ms, as today. It nudges the word sideways and, with a chance equal to Glitch strength, restarts the copies at a random point (through `--phase` and the `reset` class). The page listens for `hb:pause`:
  - `paused` true: `clearTimeout(jitterTimer)` and `glitch.style.transform=''`;
  - `paused` false: `reslice()`.
- **Slow motion:** css. While it is on, the page also does two things:
  - it triples `reslice()`'s wait;
  - right after it restarts the copies, it sets their new animations to a third of their speed itself (`glitch.getAnimations({subtree:true})`). This way no restarted copy runs at full speed for a frame before the shared script catches it.
- **Reduced motion:** the demo's reduced-motion CSS rule goes, because it stopped the strips and Play must be able to move them. `reslice()` keeps its early return under reduced motion, so after Play the strips slide but the word does not shake or restart.
- **Stage font:** site font. `.glitch` drops `var(--disp)` (Arial Narrow) and keeps weight 800.
- **Stage:** only the word stays; `fit()` and `--n` stay too. `hb-dots`: no, because the stage keeps its radial gradient, which `hb-dots` would replace. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Color split | Choice buttons | Small · Medium · Large | Medium | How far the red and cyan copies sit from the word. | `--offset`: 2px / 4px / 8px |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How fast the torn strips jump around. | `dur` / `--speed`: 3.8s / 2.4s / 1.4s |
| Glitch strength | Choice buttons | Mild · Medium · Strong | Medium | Stronger shakes more and tears more often. | `intensity`: 0.3 / 0.6 / 0.9 |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Glitches only on hover | Switch | on / off | off | Holds still until you point at it or tap it. | the stage's `hover-only` class on / off, and `active` removed either way. `hover-only` is today's `paused` class, renamed so it is not mistaken for Pause; its three CSS rules, the `live` check in `reslice()` and the `pointerdown` handler follow the new name. |
| Your text | Text (`input.hb-text`, keeps `maxlength="12"`) | any text up to 12 characters | GLITCH | Short words work best, up to 12 letters. | `txtIn.value.trim()` sets the word's text, `data-text` and `--n`, then `fit()` (an empty field falls back to "GLITCH") |

- **Removed:**
  - The note.
  - The RGB offset, Speed and Intensity sliders. They become Color split, Speed and Glitch strength.
  - "Hover-trigger only" becomes Glitches only on hover.
- **Good for:** Bold titles · Music and games · Error pages · **Avoid on:** Long text · Calm brands
- **Prompt:**

  > Add a glitch effect to [your headline or short word]. Place two copies of the text behind it, one tinted red and one tinted cyan, shifted to either side, and show only thin horizontal strips of each copy, changing which strips show so the colors seem to tear away from the letters like a broken video signal. Every so often, nudge the whole word sideways for a moment and reshuffle the strips so the pattern never repeats. Keep it below a few flickers per second and avoid full-screen flashes. If it only glitches on hover, a tap should start and stop it on touch screens. If the visitor has reduced motion turned on, keep the word still. Match the settings listed below.

- **README What it is:** rewritten:

  > Glitch text makes a headline look like a broken video signal. A red copy and a cyan copy of the word sit just to either side of it, and only thin horizontal strips of each copy show, changing all the time, so strips of color seem to tear away from the letters. It reads as a digital fault: a signal losing sync, or a tape dropping out.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Color split | Medium | How far the red and cyan copies sit from the word: small is 2px, medium 4px and large 8px |
  | Speed | Normal | How long the strips take to run through their pattern: slow is 3.8s, normal 2.4s and fast 1.4s; shorter looks more frantic |
  | Glitch strength | Medium | How hard the word shakes and how often the strips reshuffle: mild, medium or strong |
  | Glitches only on hover | off | Holds the word still until you point at it; on touch screens a tap starts and stops it |
  | Your text | GLITCH | The word that glitches, up to 12 letters, shown in capitals |

- **README See also:** the first link's text changes from "Scramble Text" to the page's real title.
  - [Scramble / Glitch Text](../scramble-text/) — random symbols lock into the real text
  - [Text Clip-Path Reveal](../text-clip-path-reveal/) — lines of text are uncovered one by one
  - [Kinetic Typography](../kinetic-typography/) — words that each move in their own way
- **README How it works:** "Hover-trigger mode simply toggles `animation-play-state` via a `:hover` rule gated behind `@media (hover: hover)`." becomes "The Glitches only on hover setting toggles `animation-play-state` through a `:hover` rule gated behind `@media (hover: hover)`, and a tap toggles it on touch screens." Everything else is unchanged.
- **README Production notes:** the Reduced motion bullet becomes: "**Reduced motion**: the demo starts paused. Once played, it only slides the colored strips; the sideways shake and the random restarts stay off. In production, show these visitors the still word." The rest is unchanged.
- **Category line:** `05.12 · Text &amp; Typography`
- **Pager:** Previous: Rotate Word Carousel (`../rotate-word-carousel/`) · Next: Text on a Path (`../text-on-path/`)

---

## marquee-ticker — Marquee / Ticker

- **Kind:** loop. The rows scroll forever.
- **Description:** Text scrolls sideways in an endless loop, with no seam. Best for news tickers.
- **Watch it help line:** It moves by itself. Point at a row, or tap it, to stop just that row.
- **Player bar:** Pause (css) · Slow motion (css)
- **Sequence:** The three rows scroll forever (`@keyframes marqL`; the middle row uses `marqR` and runs the other way). Each row's duration is one copy's width ÷ Speed, so all rows move at the same pace. Pointing at a row stops it (inside `@media (hover: hover)`, as today), and on touch screens a tap stops or restarts it. There are no page timers; the resize rebuild is not part of the loop.
- **Slow motion:** css
- **Reduced motion:** the rule `.marq-track{animation-play-state:paused!important}` goes, because it would stop Play from starting the rows. Nothing else changes.
- **Stage font:** site font. `.marq-item` drops Georgia and the italic and gets `font-weight:700`.
- **Stage:** only the three rows stay (the script builds them). The "PAUSED" hint on each row goes, with its rules. `hb-dots`: yes. Default height: three rows at the Large size (3 × 96px) fit the 300px phone stage.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How fast the text travels. | `spd`: 50 / 80 / 130 (px per second), then `refreshSpeeds()` |
| Text size | Choice buttons | Small · Medium · Large | Medium | Large type is the usual choice for brand strips. | `--marq-size`: 32px / 48px / 64px, then `rebuild()` |
| Space between items | Choice buttons | Tight · Medium · Wide | Medium | The space around the text and the separator. | `--marq-gap`: 24px / 48px / 80px, then `rebuild()` |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Separator | Choice buttons | "Dot ·" · "Star ★" · "Dash —" · "Sparkle ✦" | Sparkle ✦ | The mark between repeats of the text. | `sep`: `'·'` / `'★'` / `'—'` / `'✦'`, then `rebuild()` |
| Your text | Text (`input.hb-text`) | any text | Animation Handbook | Type your own words to see them scroll. | `txtIn.value`, then `rebuild()` on input (an empty field falls back to "Animation Handbook") |

- **Removed:**
  - The Apply button. The rows now rebuild as you type.
  - The note.
  - The "PAUSED" hints, which were a readout.
  - The Speed, Font Size and Gap Between Items sliders. They become Speed, Text size and Space between items.
  - The Separator menu. It becomes choice buttons.
- **Good for:** News tickers · Brand strips · Client lists · **Avoid on:** Important messages · Long sentences
- **Prompt:**

  > Add a marquee to [the text or items you want to scroll]. The text should scroll sideways in an endless loop with no visible jump: place two identical copies side by side, each at least as wide as the space it scrolls through, and move them by exactly one copy's width before starting over. Put a small mark between the repeats. Rows can run in opposite directions for a decorative band. Pointing at a row should stop it so people can read it, and a tap should do the same on touch screens. Screen readers should not announce the moving text again and again. If the visitor has reduced motion turned on, keep the text still. Match the settings listed below.

- **README What it is:** keep
- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Speed | Normal | How fast the text travels: slow is 50px, normal 80px and fast 130px per second; news tickers run slower, brand strips faster |
  | Text size | Medium | Small is 32px, medium 48px and large 64px; large type is the usual choice for brand strips |
  | Space between items | Medium | The space around each repeat of the text and its separator: tight is 24px, medium 48px and wide 80px |
  | Separator | Sparkle ✦ | The mark between repeats: a dot, a star, a dash or a sparkle |
  | Your text | Animation Handbook | The text that scrolls |

- **README See also:**
  - [Rotate Word Carousel](../rotate-word-carousel/) — one word in a sentence keeps changing
  - [Kinetic Typography](../kinetic-typography/) — words that each move in their own way
  - [Text on a Path](../text-on-path/) — text scrolls along a curve instead
- **README How it works:** unchanged
- **README Production notes:** unchanged
- **Category line:** `05.06 · Text &amp; Typography`
- **Pager:** Previous: Text Clip-Path Reveal (`../text-clip-path-reveal/`) · Next: Text Morphing (`../text-morphing/`)

---

## rotate-word-carousel — Rotate Word Carousel

- **Kind:** loop. The words take turns forever.
- **Description:** One word in a sentence keeps swapping for the next. Best for hero headlines.
- **Watch it help line:** default
- **Player bar:** Pause (page) · Slow motion (page)
- **Sequence:** The page starts its loop at load (today's `start()`). Every Time on each word, `transitionTo()` does three things: it slides the word out (Speed), swaps it for the next word at the entry side with the transition off, then slides that word in (Speed). The list repeats forever. The page listens for `hb:pause`:
  - `paused` true: clear the hold timer (`timer`). A slide already under way finishes, and its `done()` schedules nothing while the loop is paused.
  - `paused` false: schedule the next slide after one hold (`timer=setTimeout(cycle,hold)`).
- **Slow motion:** while the switch is on, multiplies `--rot-dur` by 3, from the next slide. The two timers inside `transitionTo()` that wait for it become Speed × 3 + 30ms and Speed × 3 + 50ms. Time on each word and the 20ms step stay.
- **Reduced motion:** the demo's rule stays: the words swap without sliding, one per Time on each word.
- **Stage font:** site font. `.headline` drops Georgia and gets `font-weight:700`, and `.rot-word` drops the italic.
- **Stage:** only the sentence and its rotating word stay. The word list under it (`.word-dots`, which shows where the loop is) goes. `hb-dots`: yes. `hb-grow`, because a typed sentence can wrap.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Slide direction | Choice buttons | Up · Down · Left · Right | Up | Which way the words slide. | `dir`: `'up'` / `'down'` / `'left'` / `'right'` (read at each slide, as today) |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How fast one word slides out and the next in. | `dur` / `--rot-dur`: 650ms / 400ms / 250ms |
| Time on each word | Choice buttons | Short · Medium · Long | Medium | How long each word stays still to be read. | `hold`: 1200 / 2000 / 3200 (ms) |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Different color per word | Switch | on / off | on | A new color draws the eye to each change. | `colorTog.checked`: `setColor()` adds `wc0`–`wc4` / uses `--word-color` (pink), applied to the word on screen at once |
| Your sentence | Text (`input.hb-text`) | any text | We craft for | The words that stay still before the changing one. | `sentenceIn.value` sets `#static-text` at once |
| Your words, one per line | Text box (`textarea.hb-text`) | any words, one per row | Designers / Developers / Humans / Teams / Startups (five rows) | Words of similar length keep the sentence steady. | `wordsIn.value`, then `start()` on input (blank rows are skipped; while paused, `start()` shows the first word and schedules nothing) |

- **Removed:**
  - Restart. Pause replaces it.
  - The note.
  - The word list under the sentence.
  - The Hold Duration and Transition Duration sliders. They become Time on each word and Speed.
  - The Direction menu. It becomes Slide direction.
  - The Static text and Rotating words boxes become Your sentence and Your words, one per line.
- **Good for:** Hero headlines · Taglines · Service lists · **Avoid on:** Body text · Long word lists
- **Prompt:**

  > Add a rotating word to [your headline, with the word that should change]. Keep the rest of the sentence still and swap only that one word: the current word slides out of sight and the next one slides in from the opposite side, clipped by an invisible box so it seems to come from behind the text. Hold each word long enough to read, then move on, repeating the list forever. Words of similar length keep the sentence from jumping. Screen readers should hear each new word once. If the visitor has reduced motion turned on, swap the words without sliding. Match the settings listed below.

- **README What it is:** keep
- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Slide direction | Up | Up and down move the word like a slot machine; left and right slide it sideways |
  | Speed | Normal | How long each slide takes: slow is 650ms, normal 400ms and fast 250ms |
  | Time on each word | Medium | How long each word stays: short is 1200ms, medium 2000ms and long 3200ms; 1.5 to 3 seconds is the readable range |
  | Different color per word | on | A new color for each word draws attention to the change; one color is calmer |
  | Your sentence | We craft for | The part of the headline that stays still |
  | Your words, one per line | Designers, Developers, Humans, Teams, Startups | The words that take turns |

- **README See also:**
  - [Text Morphing](../text-morphing/) — one word changes into the next, letter by letter
  - [Enter/Exit Typography](../enter-exit-typography/) — whole phrases come in, hold and leave
  - [Typewriter Effect](../typewriter-effect/) — text typed one character at a time
- **README How it works:** unchanged
- **README Production notes:** unchanged
- **Category line:** `05.11 · Text &amp; Typography`
- **Pager:** Previous: Enter/Exit Typography (`../enter-exit-typography/`) · Next: Glitch Text (`../glitch-text/`)

---

## text-morphing — Text Morphing

- **Kind:** loop. The words take turns forever.
- **Description:** One word changes into the next, letter by letter. Best for short labels.
- **Watch it help line:** default
- **Player bar:** Pause (page) · Slow motion (page)
- **Sequence:** The page starts its loop at load (today's `start()`). The word holds for Time on each word. Then `morphTo()` slides its letters out (Speed, each letter Delay between letters after the one before), builds the next word's letters on the far side and slides them in. 100ms later the next hold starts. The list repeats forever. The page listens for `hb:pause`:
  - `paused` true: a morph under way finishes and then schedules nothing; otherwise the page clears the hold timer (`morphTimer`). Keep a flag for "a morph is under way", because `morphTimer` holds every step.
  - `paused` false: `cycle()`, so the next morph comes after one hold.
- **Slow motion:** while the switch is on, multiplies `--morph-dur` and the letter delays by 3, from the next morph. The two timers in `morphTo()` that wait for them become 3 × (Speed + delay × (letters − 1)) + 60ms and 3 × (Speed + delay × (letters − 1)) + 50ms. Time on each word and the 100ms gap stay.
- **Reduced motion:** the demo's rule stays: the words swap without sliding.
- **Stage font:** site font. `.morph-char` drops Georgia and gets `font-weight:700`.
- **Stage:** only the word stays. The "Morphing" caption, the dots (`.cycle-dots`) and the Current word readout go. `hb-dots`: yes. Default height. The word is one line that never wraps, so neither `hb-grow` nor the `.unit-word` pattern applies. `.morph-char` gets `white-space:pre`, so a space typed inside a word keeps its width.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Slide direction | Choice buttons | Up · Down · Left · Right | Up | Which way the old letters leave and the new ones arrive. | `dir`: `'up'` / `'down'` / `'left'` / `'right'` (read at each morph, as today) |
| Delay between letters | Choice buttons | None · Short · Long | None | A small delay sends the change across the word as a wave. | `stag`: 0 / 30 / 60 (ms) |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long each letter takes to slide. | `dur` / `--morph-dur`: 650ms / 400ms / 250ms |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Time on each word | Choice buttons | Short · Medium · Long | Medium | How long each word stays still to be read. | `hold`: 900 / 1500 / 2400 (ms) |
| Your words, one per line | Text box (`textarea.hb-text`) | any words, one per row | OCEAN / RIVER / STORM / LIGHT / SOUND (five rows) | Words of the same length morph most cleanly. | `wordsIn.value`, upper-cased, then `start()` on input (blank rows are skipped; while paused, `start()` shows the first word and schedules nothing) |

- **Removed:**
  - Restart. Pause replaces it.
  - The note.
  - The "Morphing" caption and the dots on the stage.
  - The Current word readout.
  - The Morph Duration, Pause Between Words and Stagger Per Char sliders. They become Speed, Time on each word and Delay between letters.
  - The Direction menu. It becomes Slide direction.
  - The Words box becomes Your words, one per line.
- **Good for:** Short labels · Status words · Hero headlines · **Avoid on:** Long words · Sentences
- **Prompt:**

  > Add a letter-by-letter morph to [the word that should change, and the words it cycles through]. Split each word into letters. To change words, slide the current letters out of sight in one direction while the next word's letters slide in from the opposite side; a small delay between letters, when the settings include one, sends the change across the word like a wave. Hold each word long enough to read, then morph to the next and repeat the list. Words of similar length look cleanest, and extra letters can simply fade in or out. Screen readers should hear each new word once, not its letters. If the visitor has reduced motion turned on, swap the words without movement. Match the settings listed below.

- **README What it is:** keep
- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Slide direction | Up | Up and down look like a slot machine; left and right slide sideways |
  | Delay between letters | None | The gap between one letter moving and the next: none, short (30ms) or long (60ms); none moves every letter together, a delay makes a wave |
  | Speed | Normal | How long each letter takes to slide: slow is 650ms, normal 400ms and fast 250ms |
  | Time on each word | Medium | How long each word stays: short is 900ms, medium 1500ms and long 2400ms; it must be long enough to read |
  | Your words, one per line | OCEAN, RIVER, STORM, LIGHT, SOUND | The words that take turns, shown in capitals |

- **README See also:**
  - [Rotate Word Carousel](../rotate-word-carousel/) — the whole word slides, with no letters split
  - [Scramble / Glitch Text](../scramble-text/) — random symbols lock into the real text
  - [Typewriter Effect](../typewriter-effect/) — text typed one character at a time
- **README How it works:** unchanged
- **README Production notes:** unchanged
- **Category line:** `05.07 · Text &amp; Typography`
- **Pager:** Previous: Marquee / Ticker (`../marquee-ticker/`) · Next: Text Gradient Animation (`../text-gradient-animation/`)

---

## text-gradient-animation — Text Gradient Animation

- **Kind:** loop. The colors flow forever.
- **Description:** Colors flow through the letters while the text stays still. Best for headlines.
- **Watch it help line:** default
- **Player bar:** Pause (css) · Slow motion (css)
- **Sequence:** The gradient moves forever, over Speed. `@keyframes grad-flow` slides it for Flowing, Diagonal and Two colors, and `@keyframes grad-spin` turns it for Spinning. No page timers.
- **Slow motion:** css
- **Reduced motion:** the demo's rule goes, because it stopped the gradient and Play must be able to move it.
- **Stage font:** site font. `.grad-text` drops Georgia and the italic and gets `font-weight:800`.
- **Stage:** only the word stays. The two captions go ("Gradient" and the line of code under the word). `.grad-text` gets `font-size:clamp(64px,14vw,120px)` in place of `--grad-size`; the Font Size slider and the phone rule that set 64px go. `hb-dots`: yes. `hb-grow`, because typed text can wrap; the stage's own `min-height:var(--stage-h)` goes.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Gradient | Choice buttons | Flowing · Spinning · Diagonal · Two colors | Flowing | How the colors move through the letters. | the word's class: `grad-linear` / `grad-conic` / `grad-multi` / `grad-custom`; also shows First color and Second color only with Two colors |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | Slower feels calm; faster feels lively. | `--grad-dur`: 6.4s / 4s / 2.4s |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| First color | Swatches; shown only when Gradient is Two colors (the only gradient that uses it) | Pink · White · Blue · Purple · Green · Orange | Blue | The color the gradient starts and ends with. | `--c1`: `#ff6f8b` / `#f4f4f2` / `#58a6ff` / `#d2a8ff` / `#56d364` / `#ffa657` |
| Second color | Swatches; shown only when Gradient is Two colors | Pink · White · Blue · Purple · Green · Orange | Purple | The color in the middle of the gradient. | `--c2`: `#ff6f8b` / `#f4f4f2` / `#58a6ff` / `#d2a8ff` / `#56d364` / `#ffa657` |
| Your text | Text (`input.hb-text`) | any text | Flow | Short words show the flow best. | `txtIn.value` sets the word (an empty field falls back to "Flow") |

- **Removed:**
  - The note.
  - The two captions on the stage.
  - The Gradient Type menu. It becomes Gradient.
  - The Speed slider. It becomes Speed.
  - The Font Size slider. The word now follows the screen size, from 64px on phones to 120px on wide screens, and its size does not change the effect.
  - The Start and End colour pickers. They become the First color and Second color swatches.
- **Good for:** Headlines · Logos · Hero titles · **Avoid on:** Body text · Small text
- **Prompt:**

  > Add a flowing color gradient to [your headline or logo text]. Fill the letters with a gradient instead of a flat color: paint the gradient as the text's background, show it only inside the letter shapes, and make the text color itself see-through. Then keep moving the gradient behind the letters, or turn it like a color wheel, so color flows through the word while the letters stay still. End the gradient with the color it starts with so the loop has no seam. Give the text a solid fallback color for browsers that cannot clip a background to text. If the visitor has reduced motion turned on, keep the gradient still. Match the settings listed below.

- **README What it is:** rewritten:

  > Text gradient animation fills the letters with a gradient instead of a flat color, then moves the gradient behind them, so color seems to flow through the word while the letters stay still. The trick is to paint the gradient as the text's background, show that background only inside the letter shapes, and make the text color itself see-through.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Gradient | Flowing | Flowing slides the colors sideways, Spinning turns them like a color wheel, Diagonal slides slanted bands, Two colors flows between two colors of your choice |
  | Speed | Normal | How long one full pass takes: slow is 6.4s, normal 4s and fast 2.4s; slower feels calm, faster feels lively |
  | First color | Blue | With Two colors, the color the gradient starts and ends with |
  | Second color | Purple | With Two colors, the color in the middle |
  | Your text | Flow | The text the colors flow through |

- **README See also:**
  - [Variable Font Morph](../variable-font-morph/) — the letters themselves change weight and lean
  - [Outline to Fill](../outline-to-fill/) — hollow letters fill with color
  - [Kinetic Typography](../kinetic-typography/) — words that each move in their own way
- **README How it works:** the conic example must match the demo. Replace the sentence "For a conic gradient (rotating color wheel):" and its snippet with "For a gradient that turns like a color wheel, register an angle property so the browser can animate the conic gradient's starting angle:" and this snippet:

  ```css
  @property --ang { syntax: '<angle>'; inherits: false; initial-value: 0deg; }

  .conic-text {
    background-image: conic-gradient(from var(--ang), #58a6ff, #56d364, #d2a8ff, #ffa657, #58a6ff);
    animation: spin 4s linear infinite;
  }

  @keyframes spin { to { --ang: 360deg; } }
  ```

  The rest is unchanged.
- **README Production notes:** unchanged
- **Category line:** `05.08 · Text &amp; Typography`
- **Pager:** Previous: Text Morphing (`../text-morphing/`) · Next: Outline to Fill (`../outline-to-fill/`)

---

## text-on-path — Text on a Path

- **Kind:** loop. The text keeps travelling along the curve.
- **Description:** Text travels along a wave, an arc or a circle. Best for badges and seals.
- **Watch it help line:** default
- **Player bar:** Pause (page) · Slow motion (page)
- **Sequence:** The page starts its loop at load (`start()`). On each animation frame, `loop()` moves the text along the path by Speed (`offset=(offset+speed)%unit`). The page listens for `hb:pause`:
  - `paused` true: `cancelAnimationFrame(raf)` and `raf=null`;
  - `paused` false: `start()`, which carries on from the current offset.
- **Slow motion:** while the switch is on, divides the step per frame by 3, from the next frame.
- **Reduced motion:** the page's own checks go (`reduce.matches` in `loop()` and in `start()`, and the `reduce` change listener). The text starts still, because the shared script pauses the loop on arrival, and it moves after Play. The CSS rule `.guide{transition:none}` stays.
- **Stage font:** site font. `.flow-text` drops `var(--disp)` and keeps weight 800 (the SVG text inherits the site font).
- **Stage:** only the SVG stays (path, dashed guide and text).
  - The `svg{…}` rule becomes `.stage svg{…}`, so it cannot size the page's icons.
  - `.flow-text`'s `fill:var(--ui-text)` becomes `fill:#f4f4f2`.
  - `hb-dots`: no, because the stage keeps its radial gradient. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Path shape | Choice buttons | Wave · Arc · Circle | Wave | The curve the text follows. | the path's `d`: `PATHS.wave` / `PATHS.arc` / `PATHS.circle`, then `fill()` |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How fast the text travels along the curve. | `speed`: 0.25 / 0.4 / 0.65 (% of the path per frame) |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Shows the path | Switch | on / off | on | A dashed line marks the curve under the text. | the guide's `hidden` class off / on |
| Your text | Text (`input.hb-text`, keeps `maxlength="40"`) | any text up to 40 characters | FOLLOW THE CURVE · | End with a mark such as · so the repeats read well. | `txtIn.value`, then `fill()` on input (an empty field falls back to "FOLLOW THE CURVE · ") |

- **Removed:**
  - The note.
  - The Speed slider, which could reach zero. It becomes Speed, and Pause now stops the text.
  - "Show guide path" becomes Shows the path.
  - The old `.seg` styles. The shared ones take over.
- **Good for:** Badges and seals · Playful titles · Decorations · **Avoid on:** Long text · Key information
- **Prompt:**

  > Add text that travels along a curve to [your short phrase]. Define the curve once and attach the text to it so every letter sits on the line, then keep moving the point where the text starts so the letters travel along the curve like a ticker bent into shape. Repeat the phrase, with a separator such as a dot, until it covers the whole curve, and wrap around by exactly one copy so the loop has no jump. Keep the curve gentle enough that letters do not crowd on sharp bends. If the visitor has reduced motion turned on, show the text still on the curve. Match the settings listed below.

- **README What it is:** rewritten:

  > Text on a path lets a line of type follow a curve instead of a straight line. The curve is defined once and the text is attached to it, so every letter sits on the line. Moving the point where the text starts along the curve makes the letters travel along it, like a ticker bent into a shape.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Path shape | Wave | The curve the text follows: a wave, an arc or a full circle |
  | Speed | Normal | How far the text moves each frame: slow is 0.25%, normal 0.4% and fast 0.65% of the path |
  | Shows the path | on | Draws the curve as a dashed line under the text |
  | Your text | FOLLOW THE CURVE · | The phrase that travels; end it with a separator so the repeats read on |

- **README See also:**
  - [Marquee / Ticker](../marquee-ticker/) — text scrolls along a straight line
  - [Kinetic Typography](../kinetic-typography/) — words that each move in their own way
  - [Text Morphing](../text-morphing/) — one word changes into the next, letter by letter
- **README How it works:** unchanged
- **README Production notes:** unchanged
- **Category line:** `05.13 · Text &amp; Typography`
- **Pager:** Previous: Glitch Text (`../glitch-text/`) · Next: Wavy Text (`../wavy-text/`)

---

## variable-font-morph — Variable Font Morph

- **Kind:** loop. The word keeps moving through a set of styles. Today's Auto-morph becomes the loop, and it starts at load.
- **Description:** A word smoothly turns bold, then light, and leans over. Best for headlines.
- **Watch it help line:** default
- **Player bar:** Pause (page) · Slow motion (page)
- **Sequence:** The page starts its loop at load: today's Auto-morph, now without a button. It steps to the next preset every Speed + 800ms (1400ms at Normal, as today). Each step sets `--wght` and `--slnt`, and the word's CSS transition (Speed) draws the morph.
  - `PRESETS` becomes (weight / slant): 400/0, 900/0, 700/−15, 500/0, 400/−15, 900/0, repeating.
  - This is today's list on the site font's 400–900 weights, with the Casual values removed.
  - The fourth preset moves from 400 to 500, so that with Leans as it changes off no step repeats the one before.

  The page listens for `hb:pause`:
  - `paused` true: clear the step timer; a morph under way finishes.
  - `paused` false: step at once, then carry on.
- **Slow motion:** while the switch is on, multiplies `--morph-dur` by 3, and the step wait becomes 3 × Speed + 800ms, from the next step. The 800ms rest stays.
- **Reduced motion:** the demo's rule `.vf-text{transition:none!important}` stays. After Play, the word jumps from style to style instead of morphing, one step per interval.
- **Stage font:** site font, as the plan requires. `.vf-text` drops the `Recursive` stack and uses Schibsted Grotesk, which every page already loads and which is variable in weight from 400 to 900.
  - It keeps `font-weight:var(--wght)` and the `skewX` slant.
  - `font-variation-settings` becomes `'wght' var(--wght)`. The Casual and slant axes go, because this font has neither.
  - The transition uses `var(--morph-dur)` instead of 600ms.
  - `:root` keeps `--wght:400;--slnt:0` and gets `--morph-dur:600ms`; `--CASL` goes.
- **Stage:** only the word stays. The "Variable" caption, the font note under the word (`.vf-sub`), the axis readout (`.axis-row`) and the six preset buttons go. `hb-dots`: yes. `hb-grow`, because typed text can wrap; the stage's own `min-height:var(--stage-h)` goes.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long each change of style takes. | `morph` / `--morph-dur`: 1000ms / 600ms / 350ms (the step wait is Speed + 800ms) |
| Leans as it changes | Switch | on / off | on | Adds a slant to some of the changes. | `leanTog.checked`: each step uses its preset's slant / keeps `--slnt` at 0 (applied to the word on screen at once, so it shows while paused too) |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Your text | Text (`input.hb-text`) | any text | Type | Short words show the change best. | `txtIn.value` sets the word (an empty field falls back to "Type") |

- **Removed:**
  - Auto-morph presets / Stop. The loop runs by itself, and Pause stops it.
  - The six preset buttons and the Weight, Casual and Slant sliders. The loop now moves through the presets by itself. Leans as it changes keeps the slant choice. The Casual axis goes, because no loaded font has it.
  - The caption, the font note, the axis readout, and the Font and Axes readouts.
  - The note.
- **Good for:** Headlines · Logos · Loading text · **Avoid on:** Body text · Small text
- **Prompt:**

  > Add a variable font morph to [your headline or word]. Use a variable font, which holds a whole range of weights in one file, and change the weight smoothly so the letters grow heavier and lighter as you watch, moving through a few styles in turn and resting briefly on each. When the settings include it, the word also leans over during some changes: a font with its own slant does this best, and a slight tilt works for fonts without one. Change the weight through the font itself, not by scaling, so the text stays sharp. If the visitor has reduced motion turned on, keep the word in one style. Match the settings listed below.

- **README What it is:** rewritten:

  > A variable font holds a whole range of styles, such as thin to black, in one file, and each style is just a number. Because of that, the browser can move smoothly from one style to another, so a word can grow heavier or lighter as you watch. In the demo, the word moves between the site font's regular and black weights and leans over by being tilted, since this font has no slanted style of its own.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Speed | Normal | How long each change takes: slow is 1000ms, normal 600ms and fast 350ms; the word then rests for 800ms before the next |
  | Leans as it changes | on | Some changes also tilt the word by up to 15 degrees; off, only the weight changes |
  | Your text | Type | The word that changes |

- **README See also:**
  - [Text Gradient Animation](../text-gradient-animation/) — colors flow through the letters instead
  - [Kinetic Typography](../kinetic-typography/) — words that each move in their own way
  - [Outline to Fill](../outline-to-fill/) — hollow letters fill with color
- **README How it works:** the snippets must match the new code:
  - **First CSS snippet:** drop `font-family: 'Recursive', sans-serif;`. The rule becomes `font-weight: 400; font-variation-settings: 'wght' 400; transition: font-weight 600ms cubic-bezier(.4, 0, .2, 1), font-variation-settings 600ms cubic-bezier(.4, 0, .2, 1);`, and the `:hover` rule becomes `font-weight: 800; font-variation-settings: 'wght' 800;`.
  - **JS snippet:** becomes `function apply(wght, slnt)`. It sets `--wght` (comment: 400–900 for the site font) and `--slnt` (comment: 0 to –15, drawn as a tilt), and the `--CASL` line goes.
  - **Second CSS snippet:** becomes `font-weight: var(--wght); font-variation-settings: 'wght' var(--wght); transform: skewX(calc(var(--slnt) * 1deg));`, with a comment that the site font has no slant axis.
  - **Loop snippet:** its `PRESETS` lose `CASL` (`{ wght: 400, slnt: 0 }, { wght: 900, slnt: 0 }, { wght: 700, slnt: -15 }`), the call becomes `apply(p.wght, p.slnt)`, and the 1400 gets the comment "Speed + an 800ms rest".
- **README Production notes:** replace the "Font loading" bullet with: "**Font loading**: the demo uses the site's own font, Schibsted Grotesk, which every page already loads and which is variable in weight from 400 to 900, so the weight morphs smoothly offline. It has no slant axis, so the lean is a `skewX()` tilt. A font with more axes gives you more to morph: Recursive, for example, adds Casual and slant axes. Self-host it with `@font-face` and `font-display: swap`." The rest is unchanged.
- **Category line:** `05.04 · Text &amp; Typography`
- **Pager:** Previous: Scramble / Glitch Text (`../scramble-text/`) · Next: Text Clip-Path Reveal (`../text-clip-path-reveal/`)

---

## wavy-text — Wavy Text

- **Kind:** loop. The wave rolls forever.
- **Description:** A wave rolls through the word, letter by letter. Best for playful titles.
- **Watch it help line:** default
- **Player bar:** Pause (css) · Slow motion (css)
- **Sequence:** Every letter bobs forever (`@keyframes bob`, over Speed). Each letter starts Delay between letters after the one before, so the wave travels across the word. No page timers.
- **Slow motion:** css
- **Reduced motion:** the demo's rule that removed the animation goes. The loop starts paused, and Play must be able to move it.
- **Stage font:** site font. `.wave-text` drops `var(--disp)` and keeps weight 800.
- **Stage:** only the word stays. The text never wraps (`white-space:pre`, and `fit()` shrinks long words). So the split stays one span per character, spaces included, as today, and the `.unit-word` pattern is not needed. `hb-dots`: no, because the stage keeps its radial gradient. Default height.

**Main settings**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Wave height | Choice buttons | Low · Medium · High | Medium | How far each letter rises and falls. | `--amp`: 8px / 16px / 28px |
| Speed | Choice buttons | Slow · Normal · Fast | Normal | How long one rise and fall takes. | `--dur`: 2.6s / 1.6s / 1s |
| Delay between letters | Choice buttons | Short · Medium · Long | Medium | Longer delays stretch the wave across the word. | `--stagger`: 30ms / 60ms / 120ms |

**More options**

| Setting | Control | Choices or range (value shown) | Default | Hint | Sets in the demo |
|---|---|---|---|---|---|
| Your text | Text (`input.hb-text`, keeps `maxlength="14"`) | any text up to 14 characters | Wavy | Short words work best, up to 14 letters. | `txtIn.value`, then `build()` on input (an empty field falls back to "Wavy") |

- **Removed:**
  - The note.
  - The Amplitude, Wave speed and Per-letter stagger sliders. They become Wave height, Speed and Delay between letters.
- **Good for:** Playful titles · Games and kids' sites · Loading text · **Avoid on:** Serious content · Long text
- **Prompt:**

  > Add a wavy text effect to [your word or short title]. Split the text into letters and make every letter bob up and down with the same smooth motion, but start each letter a moment after the one before it, so the high point of the wave rolls from the first letter to the last and around again. Keep the letters on one line, and move them only up and down, never changing their size or spacing. Screen readers should read the word once, not letter by letter. If the visitor has reduced motion turned on, keep the letters still. Match the settings listed below.

- **README What it is:** rewritten:

  > Wavy text sends a wave rolling across a word. Every letter bobs up and down with the same motion, but each one starts a moment after the letter before it, so the highest point travels from the first letter to the last, like a flag rippling or a row of buoys lifted by a passing swell.

- **README Key parameters:**

  | Parameter | Default | Effect |
  |-----------|---------|--------|
  | Wave height | Medium | How far each letter travels: low is 8px, medium 16px and high 28px; larger makes a taller wave |
  | Speed | Normal | How long one rise and fall takes: slow is 2.6s, normal 1.6s and fast 1s |
  | Delay between letters | Medium | The gap between neighbouring letters: short is 30ms, medium 60ms and long 120ms; longer delays stretch the wave |
  | Your text | Wavy | The word that waves, up to 14 letters |

- **README See also:**
  - [Kinetic Typography](../kinetic-typography/) — words that each move in their own way
  - [Typewriter Effect](../typewriter-effect/) — text typed one character at a time
  - [Text Morphing](../text-morphing/) — one word changes into the next, letter by letter
  - [Variable Font Morph](../variable-font-morph/) — the letters change weight and lean
- **README How it works:** the snippets stay. The last sentence, "Amplitude, duration, and stagger are all CSS variables the controls rewrite live.", becomes "Wave height, Speed and Delay between letters set these three CSS variables."
- **README Production notes:** the Reduced motion bullet becomes: "**Reduced motion**: under reduced motion the demo starts paused, so the letters stay still until the visitor presses Play. In production, keep the letters still for these visitors." The rest is unchanged.
- **Category line:** `05.14 · Text &amp; Typography`
- **Pager:** Previous: Text on a Path (`../text-on-path/`) · Next: none
