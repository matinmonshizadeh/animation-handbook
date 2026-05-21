# 2.5D / Pseudo-3D

## What it is
2.5D (pseudo-3D) arranges flat 2D layers at different virtual depths using CSS `perspective` and `translateZ`, then moves a virtual "camera" to create a parallax depth illusion. Layers closest to the camera move the most in response to mouse or scroll; distant layers barely move. The technique was used in classic video games (Doom, old platformers) and animated films (Disney's multiplane camera, 1937), and translates directly to CSS with no additional libraries.

## When to use it
- Hero sections with illustrated scenes that should feel dimensional
- Portfolio headers and landing page environments
- Game UI overlays where depth reinforces the game world
- Interactive maps or environments where camera movement reveals depth

## How it works
Each layer has a CSS `transform: translateX(offset)` where offset = `mouseNormalizedX * strength * depth`. Layers at depth 0 don't move; depth 1 moves the maximum amount:

```js
const LAYERS = [
  { el: document.getElementById('sky'),    depth: 0.05 },
  { el: document.getElementById('mtns'),   depth: 0.2  },
  { el: document.getElementById('hills'),  depth: 0.4  },
  { el: document.getElementById('trees'),  depth: 0.7  },
  { el: document.getElementById('ground'), depth: 1.0  },
];

stage.addEventListener('mousemove', e => {
  const normX = (e.clientX / stage.clientWidth)  - 0.5;  // -0.5 to 0.5
  const normY = (e.clientY / stage.clientHeight) - 0.5;
  LAYERS.forEach(({ el, depth }) => {
    el.style.transform = `translate(
      ${-normX * STRENGTH * depth}px,
      ${-normY * STRENGTH * depth * 0.4}px
    )`;
  });
});
```

For an **auto-pan** camera, drive the norm values with sine:

```js
function autoLoop(t) {
  const normX = Math.sin(t * 0.0003) * 0.5;
  const normY = Math.sin(t * 0.0002) * 0.3;
  LAYERS.forEach(({ el, depth }) => {
    el.style.transform = `translate(${-normX * STRENGTH * depth}px, ${-normY * STRENGTH * depth * 0.4}px)`;
  });
  requestAnimationFrame(autoLoop);
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Strength | 40px | Maximum displacement of the nearest (depth 1) layer |
| Layer count | 7 | More layers = smoother depth gradient; fewer = staircase effect |
| Depth values | 0.05–1.0 | The distribution determines how pronounced the depth gap feels |
| Y multiplier | 0.4 | Vertical parallax is usually less than horizontal for landscape scenes |

## Production notes
- **Each layer must be wider than the stage**: when the camera pans, layers must extend beyond the visible frame so empty edges don't show. Add 10–20% horizontal overflow per layer.
- **CSS `perspective` vs `translateZ`**: CSS 3D perspective gives the same result with less JavaScript — put `perspective: 800px` on the container and use `translateZ(depth)` on each layer. Mouse rotation of the entire container then creates the parallax effect with a single transform.
- **Scroll-driven variant**: replace `mousemove` with `scroll` and map scroll position to the camera offset. Combine with sticky positioning to pin the scene while the user scrolls through it.
- **Game engines**: this is the native technique in 2D game engines (Phaser, PixiJS, Godot) with "parallax scrolling" built in as a first-class feature. Each layer specifies a scroll factor (0 to 1).
- **Optimization**: layers that extend beyond the viewport trigger paint. Use `overflow: hidden` on the parent and `transform: translateZ(0)` on each layer to promote them to GPU compositing layers.

## See also
- [Parallax Depth-of-Field](../../01-scroll-based/parallax-depth-of-field/) — the same layered parallax concept for scroll-based scenes
- [Parallax 3D Tilt](../parallax-3d-tilt/) — mouse-driven 3D tilt of a single card
- [Scroll-Driven 3D Rotation](../scroll-driven-3d-rotation/) — scroll as the camera driver
