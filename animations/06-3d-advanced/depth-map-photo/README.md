# Depth-Map Photo

## What it is
A depth-map photo makes a flat picture look three-dimensional when you point at it. Beside the picture sits a grayscale depth map of the same size, white where things are near and black where they are far, and as the pointer moves, each part of the picture shifts by an amount set by its gray. Near parts slide further than far ones, and the eye reads the difference as depth, the way it does when you move your head.

## When to use it
- Hero images and page headers that invite the pointer to explore
- Travel, landscape and portfolio photos with a clear foreground and background
- Album art, posters and book covers
- Product shots where the product stands in front of a plain background

## How it works
Two pictures go to the graphics chip as textures: the photo and its depth map. The demo draws both itself on 2D canvases, from the same six shapes (sky 0, mountains 0.2, hills 0.45, meadow 0.65, tree 0.9 and ground 0.9 to 1): once in color, and once with each shape filled with its gray. The tree is as near as the ground it stands on, so its foot never slides against the ground. Both are painted a little larger than the stage, so the largest shift never shows an edge. Then the near shapes in the depth map grow by a few pixels: sixteen copies, shifted in a ring by 1/250 of the width (every other one by half that), keep the lighter, nearer value of each pixel. A blur of 1/500 of the width smooths the steps:

```js
const r = SW / 250;                         // SW: the width the pictures are painted at
b.drawImage(depth, 0, 0);
b.globalCompositeOperation = 'lighten';     // keep the lighter (nearer) value of each pixel
for (let i = 0; i < 16; i++) {
  const d = i % 2 ? r / 2 : r;
  b.drawImage(depth, Math.cos(i * Math.PI / 8) * d, Math.sin(i * Math.PI / 8) * d);
}
b.globalCompositeOperation = 'source-over';
b.filter = `blur(${Math.max(1, Math.round(SW / 500))}px)`;
b.drawImage(b.canvas, 0, 0);
```

A fragment shader then draws every pixel of the stage. A spot of the picture at depth `t` moves by the pointer's offset times `t − focus`, where focus is the depth that holds still: 0.4, just short of the hills at 0.45. To draw a pixel the shader works backward: it tries 24 depths from the nearest to the farthest, looks up the depth map at the spot each try would come from, and stops at the first spot that is at least as near as the try. So the nearest surface wins, as it covers what is behind it. Five halvings of the last step then find the edge exactly, so edges stay sharp instead of stepped:

```glsl
float t = 1., tp = 1., h = texture2D(uDep, uv + uOff * (1. - uFocus)).r - 1.;
for (int i = 0; i < 24; i++) { if (h >= 0.) break; tp = t; t -= 1. / 24.; h = texture2D(uDep, uv + uOff * (t - uFocus)).r - t; }
for (int i = 0; i < 5; i++) { float m = (t + tp) * .5; if (texture2D(uDep, uv + uOff * (m - uFocus)).r >= m) t = m; else tp = m; }
vec2 p = uv + uOff * (t - uFocus);
gl_FragColor = vec4(texture2D(uImg, p).rgb, 1.);   // Show the depth map mixes in the map's gray here
```

Where a near shape moves aside, it uncovers a strip the photo never had, and the search fills it by stretching the pixels at the shape's edge. Because the near shapes were grown in the depth map, those edge pixels are background, so the strip fills with background instead of a smear of the tree.

The view glides toward the pointer by elapsed time, so it moves at the same speed at any frame rate:

```js
const k = 1 - Math.pow(1 - 0.1, dt / FRAME);           // 10% of the gap every 60th of a second
sx += (ax - sx) * k;  sy += (ay - sy) * k;             // a: where the pointer aims, s: where the view is (-1 to 1)
gl.uniform2f(uOff, O * sx / SW, -VY * O * sy / SH);    // O: the depth strength times the stage's width; VY: 0.3
```

Pointer Events make a mouse, a pen and a finger aim the view alike; a mouse that leaves or a finger that lifts sends it back to the middle. Show me moves the view around a figure of eight for three seconds and back to the middle. Without WebGL, the demo draws the six shapes on a 2D canvas every frame instead, each moved by its own depth, the way 2.5D layers move. Under reduced motion the picture does not follow the pointer, and Show me shows the view from one side for 1.2 seconds, with no movement in between, then the view from the front.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Depth strength | Medium | How far the nearest part slides against the farthest when the pointer reaches the edge of the picture: subtle is 2%, medium 3.5% and strong 5% of the picture's width; up and down move about a third as far, which keeps the stretched strips small |
| Show the depth map | off | Shows the gray depth map in place of the picture, moving the same way: white is near and black is far |

## Production notes
- **Getting a depth map**: depth-estimation models (MiDaS, Depth Anything) make one from any photo, phones save one with portrait-mode photos, and an image editor can paint one by hand, one gray shape per layer. Save it as a grayscale image the same size as the photo.
- **Edges**: where a near object moves, it uncovers background the photo never had. Keep the strength low and the up-and-down share smaller than the sideways one, grow the near shapes in the depth map by a few pixels and blur it a little, and give an object one depth where it touches the ground; a hand-made map with clean outlines helps most.
- **Textures**: use linear filtering and clamp-to-edge wrapping, which lets WebGL 1 take an image of any size without mipmaps. Flip the image on upload (`UNPACK_FLIP_Y_WEBGL`), and serve images from the same origin or with CORS headers, or WebGL refuses to read them.
- **Tilt on phones**: the phone's own tilt (`deviceorientation`) can drive the shift instead of a finger; iOS asks the visitor for permission first.
- **Performance**: the shader reads the depth map about twenty times per pixel, which is cheap for a graphics chip. The demo caps the pixel density at 2 (1.5 on phones) and draws only while the view moves.
- **Context loss**: a GPU reset or a restored tab fires `webglcontextlost`; call `preventDefault()` on it, and rebuild the shader and upload the textures again on `webglcontextrestored`.
- **Libraries**: Three.js runs the same shader in a `ShaderMaterial`, or pushes a mesh out by the depth map; PixiJS has a `DisplacementFilter`; Facebook's 3D photos turn the depth map into a mesh and fill in the hidden background.

## See also
- [2.5D / Pseudo-3D](../2-5d-pseudo-3d/) — flat layers that slide by different amounts
- [Image Distortion on Hover](../image-distortion-hover/) — a shader that moves pixels around the pointer
- [Parallax 3D Tilt](../parallax-3d-tilt/) — a card leans toward the pointer
- [3D Carousel](../carousel-3d/) — cards in a ring that turns in 3D
