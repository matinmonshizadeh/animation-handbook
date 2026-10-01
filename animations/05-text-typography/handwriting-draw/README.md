# Handwriting Draw

## What it is
Handwriting draw makes a word look as if someone is writing it while you watch. The word is made of pen lines rather than a font, and each line is uncovered from where the pen touches down to where it lifts, at a steady pen speed and in the order a person writes: the joined letters first, then the dots and crosses.

## When to use it
- Greetings, thank-you notes and invitations that should feel personal
- A signature under a letter, a quote or an "about me" section
- Page intros and hero titles with a hand-made feel
- Script-style logos and brand marks

## How it works
Each word is a list of SVG paths, one per pen stroke, in writing order: for "hi there" that is hi, the dot on the i, there, then the cross on the t. The letters are hand-drawn cubic curves on a baseline, already slanted, so no font file is involved. Every path is measured with `getTotalLength()` and hidden behind a dash exactly as long as itself:

```js
const len = path.getTotalLength();
path.style.strokeDasharray = len + ' ' + len;
path.style.strokeDashoffset = len; // hidden: the gap covers the whole line
```

A frame loop moves a clock by the time that has passed (a third as fast in slow motion), so the pen keeps its speed on any screen. Each stroke owns a slice of that clock as long as its length divided by the pen speed, with a short lift before the next stroke, so long strokes take longer, as with a real pen:

```js
function frame(ts) {
  const dt = lastT === null ? 0 : Math.min(ts - lastT, 50);
  lastT = ts;
  t += dt * (slowMotion ? 1 / 3 : 1);
  strokes.forEach(s => {
    const p = Math.min(1, Math.max(0, (t - s.start) / s.dur));
    s.el.style.strokeDashoffset = s.len * (1 - ease(p));
  });
  if (t < total) requestAnimationFrame(frame);
}
```

`ease()` starts and ends each stroke at 40% of its average speed. The pen is placed at `getPointAtLength()` of the stroke being drawn; between strokes it glides from the end of one to the start of the next, a little above the paper.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Word | hello | Which word is written: hello is one stroke, thanks is two (the word, then the cross on the t) and hi there is four (hi, the dot, there, the cross) |
| Pen speed | Normal | How far the pen travels in a second: slow is 200 units, normal 400 and fast 800, where a small letter is 28 units tall; a word takes about 1 to 5 seconds |
| Ink color | Blue | The color of the ink, and of the pen |
| Pen size | Medium | How wide the line is: fine is 1.1 units, medium 1.8 and bold 2.8 |
| Shows the pen | on | A small pen rides on the tip of the line and lifts between strokes |

## Production notes
- **Getting the paths**: a font's letters are filled outlines, so drawing their edges traces each letter twice and looks nothing like writing. Use single open strokes instead: draw them with a pen tool (Figma, Illustrator, Inkscape), trace a scanned signature with single lines, or start from a single-line font such as the Hershey fonts made for pen plotters. Keep one path per stroke, in writing order, each starting where the pen touches down.
- **Time by length**: give each stroke a time in proportion to its length, not one fixed duration, or the dot on an i takes as long as a whole word. A minimum time (120 ms here) keeps a dot visible.
- **Reduced motion**: the demo fades the finished word in. In production, show the word complete or fade it in.
- **Accessibility**: the drawing is one image to screen readers (`role="img"` with an `aria-label` of the word), so they read the word once, not a list of paths.
- **Library equivalents**: GSAP's DrawSVG plugin animates the dash (`drawSVG: "0%"` to `"100%"`) and a timeline puts the strokes in order; Framer Motion animates `pathLength` per path; Vara.js writes text with its own single-line fonts; Lottie plays handwriting exported from After Effects.

## See also
- [SVG Path Animation](../../06-3d-advanced/svg-path-animation/) — a line drawing draws itself, stroke by stroke
- [Checkmark Draw](../../04-micro-interactions/checkmark-draw/) — the same dash trick for a success tick
- [Typewriter Effect](../typewriter-effect/) — text typed one character at a time
- [Letter-by-Letter Stagger](../../02-entrance-and-exit/letter-by-letter-stagger/) — a phrase appears one letter at a time
