# Spotlight Hover Glow

## What it is
A spotlight hover glow is a soft light that follows the pointer across a grid of dark cards. Near the pointer the cards brighten a little and their edges light up in color, while the cards farther away stay dim, as if a lamp were moving over them.

## When to use it
- Feature grids on landing pages, where the light invites the visitor to look around
- Pricing tiers and product tiles on dark pages
- Dashboards and settings screens made of many dark panels
- Portfolio and project grids that should feel tactile

## How it works
Each card is a faint frame around an opaque face: the frame's padding is the edge. Every card holds two copies of one soft disc (a `radial-gradient` that fades to transparent), both clipped by `overflow: hidden`: one behind the face, which only shows through the edge, and a much fainter one inside the face, under its text. The page never repaints them; it only moves them with `transform`, every card's discs to the same spot of the grid, counted from that card's corner:

```js
function draw() {
  for (const c of cards) {                      // c.x, c.y: the card's place in the grid, measured once
    c.eg.style.transform = `translate(${lx - c.x}px, ${ly - c.y}px)`;            // the edge light
    c.fg.style.transform = `translate(${lx - c.x - bw}px, ${ly - c.y - bw}px)`;  // the face light
  }
}
```

The card places and the disc size are measured on load and again whenever the grid changes size (a `ResizeObserver`), so moving the light reads nothing from the layout. The light trails the pointer by closing a share of the gap on each frame, scaled to the time since the last frame, so the lag is the same on 60 Hz and 120 Hz screens:

```js
const a = 1 - Math.pow(1 - ease, dt / FRAME);   // FRAME = 1000 / 60, dt: ms since the last frame
lx += (tx - lx) * a;  ly += (ty - ly) * a;
```

A mouse lights the grid while it moves over it, and the light fades out (an `opacity` transition on a class) when it leaves. A finger lights it where it touches and while it drags: the grid has `touch-action: none` and takes pointer capture, so the drag moves the light instead of scrolling the page, and lifting the finger fades it out.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Glow size | Medium | How far the light reaches: small, medium and large are 0.7, 1.15 and 1.7 times the grid's shorter side across |
| Color | Purple | The color of the light and of the lit edges; white looks the most natural on gray cards |
| Light the edges | On | The card edges near the pointer glow brightly; off, only the faces brighten |
| Lag | Short | How far the light trails a moving pointer: none follows it exactly, short closes 30% of the gap per 60 Hz frame and long 10% |

## Production notes
- **Move layers, do not repaint them**: the common shortcut writes the pointer position into CSS variables used by a `radial-gradient(circle at var(--x) var(--y), …)`, which repaints every card on every pointer move. Moving finished layers with `transform` leaves the work to the compositor.
- **Measure once**: read the card positions on load and on resize, never in the pointer handler, so moving the pointer forces no layout.
- **Touch**: touch screens cannot hover, so let a drag move the light (with `touch-action: none` on the grid only, so the page still scrolls around it) or light the card that is tapped.
- **Keyboard**: when the cards are links, light the card that has keyboard focus as well, so the effect is not pointer-only.
- **Contrast**: the face light brightens the card behind its text; keep it faint enough that the text stays at 4.5:1 or more.
- **Reduced motion**: the light is tied to the pointer, so it can stay. The demo drops the trailing glide, and Show me only fades the light in and out in one place.
- **Libraries**: Framer Motion's `useMotionValue` with `useSpring` can drive the light's `x` and `y` instead of the easing loop; GSAP's `gsap.quickTo(light, 'x', { duration: .3 })` does the same.

## See also
- [Cursor Follower](../cursor-follower/) — a shape that follows the pointer itself
- [Parallax 3D Tilt](../../06-3d-advanced/parallax-3d-tilt/) — a card that tilts and catches the light
- [Hover State Animation](../hover-state/) — simpler ways for a card to react
- [Animated Gradient Border](../gradient-border/) — an edge with a band of colors that runs on its own
