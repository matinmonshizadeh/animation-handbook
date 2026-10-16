# Magnifier Lens

[Live demo](https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/magnifier-lens/)

## What it is
A magnifier lens shows part of a picture up close: a round or square window follows the pointer and holds an enlarged copy of the picture, placed so the spot under the pointer sits in the lens's middle. It lets people read fine print and check small details without leaving the page or opening a bigger picture.

## When to use it
- Product photos: stitching, textures, engravings, labels
- Maps and floor plans with small names and numbers
- Artwork and photography, to look at brushwork or grain
- Technical drawings, diagrams and detailed plans

## How it works
The lens is a small box with rounded corners and hidden overflow, moved to the pointer by a transform. Inside it sits a second copy of the picture, as many times bigger as the zoom. The copy moves the other way, so the point under the pointer lands in the lens's middle:

```js
lens.style.transform = `translate(${x - R}px, ${y - R}px)`;        // x, y: the pointer on the picture; R: the lens's radius
copy.style.transform = `translate(${R - x * Z}px, ${R - y * Z}px)`; // Z: the zoom
```

The copy is drawn at its full bigger size, not scaled up with a transform: a layer that is scaled up after it is drawn shows a stretched, blurry picture. Here the drawing is vector, so the bigger copy stays sharp; with photos, the lens loads a larger version of the image. The lens grows in when the pointer arrives and shrinks away when it leaves, a short transition on the lens's scale. A finger shows the lens while it is down, just above the finger so the finger does not cover it, with `touch-action: none` so the drag moves the lens instead of the page. From the keyboard the picture takes focus, which shows the lens in the middle; the arrow keys move it (Shift for bigger steps) and Escape puts it away. Under reduced motion the lens appears and goes without growing, and Show me jumps between the details.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Zoom | 3 times | How many times bigger the copy in the lens is than the picture: 2 times, 3 times or 4 times |
| Lens size | Medium | How wide the lens is: small is 110 pixels across, medium 150 and large 200, a fifth less on phones |
| Lens shape | Round | Round is a circle; square is a square with slightly rounded corners, which suits maps and plans |

## Production notes
- **Use a bigger image.** Stretching the same small image only enlarges its pixels and the detail blurs; load a version two to four times larger (with `srcset`, or lazily when the pointer first arrives) and use it as the lens's copy or as its background.
- **Size it, then move it.** Give the copy its final size in layout and move it only with transforms; scaling it up with a transform after the browser has drawn it as a layer blurs it.
- **Background-image variant.** A lens can also be a single element whose background is the large image, moved with `background-position`; that repaints the lens on every move, which is fine for small lenses.
- **Touch and keyboard.** Show the lens above the finger, flip it below near the top edge, and give keyboard users focus, arrow keys and Escape.
- **Libraries.** Drift, Zoomist and many shop themes package the same idea; in a React app, react-medium-image-zoom or a small custom hook does it.
- **Reduced motion.** Let the lens appear and go at once instead of growing.

## See also
- [Spotlight Hover Glow](../spotlight-hover/) — a light follows the pointer across cards
- [Cursor Follower](../cursor-follower/) — a shape trails the pointer, from the keyboard too
- [Liquid Glass](../../06-3d-advanced/liquid-glass/) — a panel bends the picture behind it at its rim
- [Before/After Slider](../before-after-slider/) — a line dragged across two pictures uncovers one over the other
