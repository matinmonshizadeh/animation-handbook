# Split-Flap Board

## What it is
A split-flap board shows each letter on a tile that is cut across the middle, like the departure boards of old airports and train stations. To change a letter, the tile flips through the alphabet: the top half of the old letter falls forward over the hinge and the bottom half of the next letter lands under it, again and again, until the tile shows its new letter. Tiles whose letters come later in the alphabet keep flipping longer, so the word settles tile by tile.

## When to use it
- Hero titles and intros with a travel, transport or retro theme
- Gate, status and arrival boards, or a "now showing" line that changes now and then
- Short words that change: a destination, a status, a score (with digits added to the run of letters)
- Moments that should feel mechanical and a little playful

## How it works
Each tile is four layers of the same size and color. Two still halves fill the tile; two flaps sit over them and turn on the hinge in the middle. Every half is a box of half the tile's height with its overflow hidden, holding a letter box as tall as the whole tile, pinned to the top or the bottom, so a top half shows the top of its letter and a bottom half the bottom of it:

```css
.tile { position: relative; width: var(--tw); height: calc(var(--tw) * 1.4); perspective: calc(var(--tw) * 5); line-height: 1; }
.half, .flap { position: absolute; left: 0; right: 0; height: 50%; overflow: hidden; background-color: var(--tile); }
.up { top: 0; }  .down { bottom: 0; }
.half b, .flap b { position: absolute; left: 0; right: 0; height: 200%; display: flex; align-items: center; justify-content: center; }
.up b { top: 0; }  .down b { bottom: 0; }
.flap.up { transform-origin: 50% 100%; }    /* turns on its bottom edge: the hinge */
.flap.down { transform-origin: 50% 0; }     /* turns on its top edge: the hinge */
```

During a flip from one letter to the next, the still top half already shows the next letter and the still bottom half still shows the old one. The top flap, showing the old letter's top, falls from upright to edge-on, speeding up; then the bottom flap, showing the next letter's bottom, swings from edge-on down into place, slowing down. A dark layer on each flap gets stronger the further it turns, as if it turned away from the light. The letters are written only when a tile starts a new flip; between those moments only the two `rotateX()` transforms change.

One frame loop runs every tile. A clock moves on by the time since the last frame (at most 50ms, and a third as fast in Slow motion), and from it each tile works out which flip it is on and how far through it, so the board flips at the same pace on a 60 Hz and a 120 Hz screen:

```js
const local = clock - i * STAGGER;                 // each tile starts a moment after the one on its left
const k = Math.floor(local / flipMs);              // the flip it is on
if (k >= flips) { rest(t, t.seq[flips]); return; } // done: its own letter
const p = local / flipMs - k;                      // how far through that flip, 0 to 1
if (p < .5) { const q = p * 2; turn(t.f1, t.s1, -90 * q * q); }          // the old letter's top falls
else { const q = (p - .5) * 2; turn(t.f2, t.s2, 90 * (1 - q) * (1 - q)); } // the next letter's bottom lands
```

Each tile's run of letters is the drum from a blank to its letter (" ABC…" up to it), so a tile showing A flips once and a tile showing Z flips 26 times. Under reduced motion nothing turns: the letters fade in, tile after tile.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Word | BOARDING | The word on the board: up to 10 letters from A to Z, and a space leaves a blank tile |
| Flip speed | Normal | How long one flip takes: slow is 150ms, normal 85ms and fast 45ms; each tile starts 40ms after the one on its left |
| Tile color | Black | The color of the tiles: black, blue, red or green with light letters, or cream with dark letters |

## Production notes
- **The drum**: real boards only flip forward, so going from Z back to A passes every letter. Add digits and symbols to the run of letters for times, gates and scores; the order decides how long each change takes. For a change from one word to another, start each tile from the letter it shows now instead of from a blank.
- **Transforms only**: the flaps turn with `rotateX()` and the shade is an opacity, so nothing is laid out again while the board flips. The letters are written once per flip, never every frame.
- **Exact halves**: the two halves of a letter must meet at the hinge. Use `line-height: 1`, a letter box exactly twice the height of a half, and check the font's capitals: some sit a little high or low and need a small nudge.
- **Accessibility**: the row is one image named with the final word, and the tiles are hidden from screen readers, so the word is read once rather than every letter it passes through.
- **Sound**: a soft clatter makes the board feel real, but play it only after the visitor has interacted, and give them a way to mute it.
- **Libraries**: GSAP can sequence the `rotationX` tweens per tile; there are also small split-flap web components. A CSS-only version works too: give each tile a column of letters and move it with `steps()`, as the card on the handbook's home page does, so each tile stops on its own letter. The catch is that the keyframes and the number of steps have to be generated for every word.

## See also
- [Scramble / Glitch Text](../scramble-text/) — random symbols lock into the real text, left to right
- [Text Morphing](../text-morphing/) — one word changes into the next, letter by letter
- [Flip In](../../02-entrance-and-exit/flip-in/) — swings into view in 3D, like a card turning over
- [3D Flip Card](../../06-3d-advanced/flip-card-3d/) — a card turns over in 3D to show its back
- [Rolling Numbers](../../04-micro-interactions/rolling-numbers/) — digits roll to their new values, like a mileage counter
