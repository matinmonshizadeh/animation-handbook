# 2.5D / Pseudo-3D

## What it is
2.5D fakes depth with flat layers. The picture is split into layers at different distances, and when the camera moves, near layers slide further than far ones, as the view from a train window does. The same trick gave old cartoons and video games their sense of depth.

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

stage.addEventListener('pointermove', e => {
  const r = stage.getBoundingClientRect();
  const normX = (e.clientX - r.left) / r.width  - 0.5;  // -0.5 to 0.5
  const normY = (e.clientY - r.top)  / r.height - 0.5;
  LAYERS.forEach(({ el, depth }) => {
    el.style.transform = `translate(
      ${-normX * STRENGTH * depth}px,
      ${-normY * STRENGTH * depth * 0.4}px
    )`;
  });
});
```

The demo has seven layers, from the sky (depth 0.05) to the ground (depth 1.0). The camera stays where the pointer leaves it. It also listens for `pointerdown`, so a tap moves the camera and a finger dragged sideways carries it along, the same way the mouse does.

For **Show me**, the demo drives the same layers with a three-second sweep instead of the pointer, ending in the middle:

```js
function sweep(now) {                       // start = performance.now() when Show me is pressed
  const p = Math.min(1, (now - start) / 3000);
  const normX = 0.45 * Math.sin(2 * Math.PI * p);
  const normY = 0.2 * Math.sin(Math.PI * p);
  LAYERS.forEach(({ el, depth }) => {
    el.style.transform = `translate(${-normX * STRENGTH * depth}px, ${-normY * STRENGTH * depth * 0.4}px)`;
  });
  if (p < 1) requestAnimationFrame(sweep);
}
```

The demo also blends in the camera's starting position, so a second press, or a run that a real pointer stopped, carries on from where the camera is instead of jumping. Reset puts the camera back in the middle.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Camera movement | Medium | How far the nearest layer travels as the pointer crosses the scene from one side to the other: small is 20px, medium 40px and large 70px (half that each way from the middle); the farthest layer moves 5% of that |
| Layer labels | off | Labels each layer with the share of the camera movement it follows, from 5% for the sky to 100% for the ground |

## Production notes
- **Each layer must be wider than the stage**: when the camera pans, layers must extend beyond the visible frame so empty edges don't show. Add 10–20% horizontal overflow per layer.
- **CSS `perspective` vs `translateZ`**: CSS 3D perspective gives the same result with less JavaScript — put `perspective: 800px` on the container and use `translateZ(depth)` on each layer. Mouse rotation of the entire container then creates the parallax effect with a single transform.
- **Scroll-driven variant**: replace `pointermove` with `scroll` and map scroll position to the camera offset. Combine with sticky positioning to pin the scene while the user scrolls through it.
- **Game engines**: this is the native technique in 2D game engines (Phaser, PixiJS, Godot) with "parallax scrolling" built in as a first-class feature. Each layer specifies a scroll factor (0 to 1).
- **Optimization**: layers that extend beyond the viewport trigger paint. Use `overflow: hidden` on the parent and `transform: translateZ(0)` on each layer to promote them to GPU compositing layers.

## See also
- [Parallax Depth-of-Field](../../01-scroll-based/parallax-depth-of-field/) — the same layered depth, driven by scrolling
- [Parallax 3D Tilt](../parallax-3d-tilt/) — one card leans toward the pointer
- [Scroll-Driven 3D Rotation](../scroll-driven-3d-rotation/) — scrolling moves a 3D object
