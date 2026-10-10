# Typewriter Effect

[Live demo](https://matinmonshizadeh.github.io/animation-handbook/animations/05-text-typography/typewriter-effect/)

## What it is
The typewriter effect shows text one character at a time, as if someone is typing it, with a blinking cursor just after the last character. Small random differences in the time between keystrokes make it feel typed by a person rather than a machine, because real typing is never perfectly even.

## When to use it
- Hero headlines on developer tools, terminal-themed, or hacker-aesthetic sites
- Code samples that benefit from being "typed out" rather than appearing all at once
- Brief taglines and CTAs where the typing reveals the message progressively
- Chat interfaces, AI demos, and streaming text UI

## How it works
The core loop counts up and shows the text cut to that length. Setting `textContent` replaces everything in the element, the cursor `<span>` too, so each step appends the cursor again and it always sits after the last character. `later` is `setTimeout` that also keeps the timer's id, so Replay can cancel the keystrokes still waiting:

```js
function render(shown) {
  typeOut.textContent = shown;
  typeOut.appendChild(cursor);
}

function typeChars(text, done) {
  let i = 0;
  (function tick() {
    render(text.slice(0, i));
    if (i < text.length) { i++; later(tick, jitter(spd)); }
    else done();
  })();
}

// Types like a person: up to 20ms earlier or later; Slow motion (mul() = 3) stretches every delay
function jitter(base) {
  const varied = jitterTog.checked ? base + Math.round((Math.random() - 0.5) * 40) : base;
  return varied * mul();
}
```

The cursor blinks via a CSS animation; the Line shape is a 2px bar in the cursor color:

```css
.cursor {
  display: inline-block;
  width: 3px;
  height: 1.1em;
  vertical-align: text-bottom;
  margin-left: 2px;
  animation: blink 1s step-end infinite;
}
.cursor.pipe { width: 2px; background: var(--cursor-color); }
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0; }
}
```

For the backspace-and-retype variant, the index counts down instead, over the last word and the space before it (never more than the last 40% of the text). Then `retypeChars` types the deleted word again with " — always." after it:

```js
function deleteChars(text) {
  const words = text.trim().split(' ');
  const deleteFrom = Math.max(text.length - words[words.length - 1].length - 1, Math.floor(text.length * 0.6));
  let i = text.length;
  (function del() {
    if (i > deleteFrom) { i--; render(text.slice(0, i)); later(del, jitter(30)); }
    else retypeChars(text, deleteFrom);
  })();
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Speed | Normal | The time between keystrokes: slow is 80ms, normal 50ms and fast 30ms; about 80 to 120ms feels like a natural pace |
| Cursor shape | Line | A block reads as a terminal, a line as a text editor, an underscore as an old computer screen |
| Deletes and retypes | off | Types the text, backs up over the last word at about 30ms a character, then types it again with a new ending |
| Types like a person | on | Moves each keystroke up to 20ms earlier or later so the rhythm is uneven, like real typing |
| Cursor color | Pink | The cursor's color; pick one that stands out from the text |
| Your text | Two sample sentences | The text that is typed; short lines work best |

## Production notes
- **Long text is exhausting**: the typewriter effect works on short hero copy (under ~15 words). A full paragraph typed character-by-character forces users to wait for content they could read instantly. Reserve it for dramatic reveals, not body text.
- **Screen readers**: they should hear the full text once, not each character as it types. Do not put `aria-live` on the element being typed (it would announce every keystroke); hide the typed element with `aria-hidden="true"` and give its wrapper `role="img"` with an `aria-label` holding the full final text, as the demo does.
- **Looping and rotation**: the "type, delete, retype" loop (cycling between multiple phrases) is the most common production pattern. Each phrase is typed, held briefly, then deleted before the next starts.
- **Performance**: `setTimeout` is accurate enough; `requestAnimationFrame` is overkill for typewriter timing and introduces unnecessary complexity.
- **Typed.js**: the canonical library for this effect. Handles multiple strings, backspace, loops, smart backspace (delete only the differing suffix), and HTML tags in strings. Worth using in production rather than rolling your own.

## See also
- [Scramble / Glitch Text](../scramble-text/) — random symbols lock into the real text
- [Rotate Word Carousel](../rotate-word-carousel/) — one word in a sentence keeps changing
- [Enter/Exit Typography](../enter-exit-typography/) — each phrase comes in, holds and leaves
