# Before/After Slider

[Live demo](https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/before-after-slider/)

## What it is
A before/after slider stacks two pictures of the same scene, such as a photo before and after an edit, and shows the top one only up to a dividing line. Dragging the line uncovers more of one picture and less of the other, so the eye can compare the same spot in both. Neither picture moves: only the line does.

## When to use it
- Photo edits and retouching, the original beside the result
- Website and app redesigns, the old screen against the new one
- Renovations, restorations and cleanups
- Product upgrades, such as a new screen or a better camera
- Maps and aerial views of one place at two dates

## How it works
Both pictures fill the same box. Before lies whole underneath. After sits in a window as big as the box, and one number from 0 to 1 says how much of it shows. The window slides with the line and the picture inside it slides back by the same amount, so it stays exactly over Before; all three moves are transforms, so a drag redraws nothing:

```css
.win      { overflow: hidden; transform: translateX(calc((var(--v) - 1) * 100%)); }
.win .pic { transform: translateX(calc((1 - var(--v)) * 100%)); }
.rail     { transform: translateX(calc(var(--v) * 100%)); }  /* the line and its handle */
```

Pointer events turn the pointer's place into that number, with pointer capture so a drag keeps working outside the box:

```js
const r = front.getBoundingClientRect();
const v = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
for (const el of movers) el.style.setProperty('--v', v);  // the window, its picture and the line
```

A press that does not move glides the line to it, eased by the time that passes. The handle is a slider whose value is read as "60% After": the arrow keys move it a twentieth, Page Up and Page Down a quarter, Home and End to the ends. With Left and right the pictures keep `touch-action: pan-y`, so an up-and-down swipe still scrolls the page; with Top and bottom only the handle starts a drag, for the same reason. The Before and After labels fade when the line comes over them. Under reduced motion the line jumps instead of gliding.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Split | Left and right | Which way the line runs: left and right shows After to the left of an upright line, dragged anywhere on the pictures; top and bottom shows After below a level line, dragged by its handle only |
| Handle | Knob | What there is to grab: knob is a round button with two arrows, bar a narrow bar along the line, line only the bare line, with nothing showing where to grab (the knob's fingertip-sized grab area stays, unseen, on the middle of the line) |
| Shows labels | on | Before and After name each side from a corner, and each fades out when the line comes within a few pixels of it |

## Production notes
- **Uncover, never resize.** Shrinking the top picture's width squeezes it, and changing width forces layout on every move. A sliding window with the picture slid back, or `clip-path: inset(0 calc((1 - var(--v)) * 100%) 0 0)` on the top picture, keeps both pictures still; clip-path is shorter to write but repaints the top picture on each move.
- **Set the number where it is used.** A property that changes on every move and sits on a parent makes the browser restyle everything inside it, a picture drawn in SVG included. Set it on the parts that move instead, and register it with `@property --v { syntax: "<number>"; inherits: false; initial-value: 0.5; }` so it stays there; on this page that was the main cost of a drag on a slow processor.
- **Same size, same framing.** Both pictures need exactly the same size and crop (`object-fit: cover` on both); a few pixels of offset reads as a wobble when the line moves.
- **Phones.** `touch-action: pan-y` on the pictures leaves up-and-down scrolling to the browser. A finger that starts moving up and down is a scroll, so let go of it at once, or the line jumps to the finger before the browser takes over; a `pointercancel` means the browser took the gesture over, so stop the drag there.
- **Accessibility.** Give the handle `role="slider"`, `aria-valuenow` and an `aria-valuetext` such as "60% After", handle the arrow, Page Up, Page Down, Home and End keys, and give the pictures their own alternative text.
- **Libraries.** The img-comparison-slider web component, juxtapose.js and TwentyTwenty (jQuery) package the same idea; in an app, GSAP's Draggable or Framer Motion's `drag` can move the line.
- **Reduced motion.** Let the line jump to a tap or a key press instead of gliding.

## See also
- [Swipe to Dismiss](../swipe-to-dismiss/) — a drag that follows the finger and springs back
- [Liquid Glass](../../06-3d-advanced/liquid-glass/) — a glass panel dragged over a picture, arrow keys too
- [Clip-Path Reveal](../../02-entrance-and-exit/clip-path-reveal/) — a shape uncovers a picture once, by itself
