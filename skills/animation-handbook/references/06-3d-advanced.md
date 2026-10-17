# 06 · 3D & Advanced

WebGL, shaders, particles, 3D transforms, simulations, and other heavier effects. 28 animations from Animation Handbook, in the home page's order. Each entry gives the live demo, how it runs, what it is good for and what to avoid it on, the prompt from its page word for word, and its settings with what each does and the demo's values.

## Contents

- [3D Model Orbit](#3d-model-orbit)
- [Scroll-Driven 3D Rotation](#scroll-driven-3d-rotation)
- [Parallax 3D Tilt](#parallax-3d-tilt)
- [Canvas Particle Effect](#canvas-particle-effect)
- [Fluid / Liquid Simulation](#fluid--liquid-simulation)
- [Glassmorphism Animated](#glassmorphism-animated)
- [WebGL Shader Animation](#webgl-shader-animation)
- [Noise-Based Motion](#noise-based-motion)
- [SVG Path Animation](#svg-path-animation)
- [Chromatic Aberration](#chromatic-aberration)
- [2.5D / Pseudo-3D](#25d--pseudo-3d)
- [Ray Marching / SDF Scene](#ray-marching--sdf-scene)
- [GPGPU Particle System](#gpgpu-particle-system)
- [Image Distortion on Hover](#image-distortion-on-hover)
- [Cloth / Soft-Body Simulation](#cloth--soft-body-simulation)
- [Volumetric Smoke / 3D Noise](#volumetric-smoke--3d-noise)
- [Morphing Blob](#morphing-blob)
- [3D Flip Card](#3d-flip-card)
- [3D Carousel](#3d-carousel)
- [Depth-Map Photo](#depth-map-photo)
- [Flocking](#flocking)
- [ASCII / Halftone](#ascii--halftone)
- [2D Physics](#2d-physics)
- [Liquid Glass](#liquid-glass)
- [Holographic Card](#holographic-card)
- [Infinite Zoom](#infinite-zoom)
- [Water Ripple](#water-ripple)
- [Audio Visualizer](#audio-visualizer)

## 3D Model Orbit

A lit 3D shape spins, or turns to face your pointer. Best for product views.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/3d-model-orbit/
- How it runs: moves by itself
- Good for: Product showcases · Hero sections · Logos · 3D previews
- Avoid on: Long reading pages · Low-power devices

**Prompt**

Add a spinning 3D object to [the product or shape you want to show]. Draw it with WebGL: store the shape as triangles and light every point with a soft base light, a direct light and a shiny highlight, so it reads as solid. Turn it around its own axis so every side comes into view, or let it turn to face the pointer, which a tap or a sideways drag should also do on touch screens. Change its size by moving the camera closer or further, not by changing the lens. If the visitor has reduced motion turned on, show the object still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Shape: **Cube** · Sphere · Ring · Pyramid. The object that is drawn: a cube, a sphere, a ring or a pyramid of four triangles.
- Movement: **Spins** · Follows the pointer. Spins turns it by itself; Follows the pointer turns it to face your pointer or finger, up to 86° to either side and 69° up or down with the pointer at the stage's edges.
- Speed: Slow · **Normal** · Fast. How fast it spins: slow is about 17°, normal 27° and fast 45° a second, on any screen; while it tumbles, the forward roll swings between still and a quarter of that over about 21 seconds.
- Tumbles as it spins: **on** · off. Also rolls it forward, at a speed that rises and falls, so the top and bottom come into view.
- Distance: Close · **Medium** · Far. How far away the camera is, from the shape's center: close is about 2.3 times the shape's width, medium 2.7 times and far 3.8 times, so close looks bigger; the lens stays the same, a 45° view from top to bottom.
- Color: Pink · White · **Blue** · Purple · Green · Orange. The object's color; the lighting adds the shading and the highlight.
- Edges only: on · **off**. Draws the edges of the triangles the shape is made of, instead of its lit surface.

## Scroll-Driven 3D Rotation

Scrolling turns a 3D cube from pose to pose. Best for product tours.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/scroll-driven-3d-rotation/
- How it runs: follows the scroll
- Good for: Product tours · Device launches · Landing pages · Storytelling sections
- Avoid on: Short pages · Forms and dashboards

**Prompt**

Add a scroll-driven 3D rotation to [the product or object you want to show]. Pin the object in view while the visitor scrolls through a tall section, and turn the scroll position, from the top of the section to its end, into a series of poses: turned to one side, tilted forward, larger, then turned round to show its back. Blend smoothly between neighboring poses so scrolling back plays it in reverse, and when the settings include it, let the object glide to catch up instead of jumping with the scroll. If the visitor has reduced motion turned on, follow the scroll exactly, with no gliding. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Turn amount: Less · **Normal** · More. How far every pose turns the cube: less is 0.6, normal 1 and more 1.6 times the planned angles (a 90° turn to the side, a 30° forward tilt, and 180° the other way at the end); at normal the last pose shows the cube's back.
- Smooth follow: **on** · off. The cube closes a tenth of the gap to its pose for every sixtieth of a second (95% of it in about half a second), so it glides after the scroll and catches up in the same time on every screen; off, it follows the scroll exactly.

## Parallax 3D Tilt

A card tilts toward your pointer, and a light slides over it. Best for cards.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/parallax-3d-tilt/
- How it runs: reacts to the visitor
- Good for: Feature cards · Pricing cards · Portfolio tiles · Game cards
- Avoid on: Text-heavy cards · Dense grids

**Prompt**

Add a 3D tilt to [the card you want to bring to life]. As the pointer moves over the card, rotate the card slightly around its horizontal and vertical axes according to where the pointer is, and give its container a 3D perspective so the tilt has depth. When the settings include it, move a soft light across the card with the pointer, as if it catches the light. On touch screens, dragging a finger across the card should tilt it the same way. When the pointer leaves, let the card settle back flat. If the visitor has reduced motion turned on, keep the card flat. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Tilt amount: Small · **Medium** · Large. How far the card leans at its edges: small is 4°, medium 7.5° and large 12.5°; much more starts to feel unsteady.
- 3D depth: Subtle · **Medium** · Strong. How close the viewer seems: subtle is 1500px, medium 1000px and strong 500px; closer makes the lean more dramatic.
- Shine: **on** · off. A soft light follows the pointer across the card, like light catching a real card.
- Return speed: Slow · **Normal** · Fast. How long the card takes to settle flat when the pointer leaves: slow is 650ms, normal 400ms and fast 250ms.
- Tilts away from the pointer: on · **off**. Leans the card away from the pointer instead, as if you were pressing on it.
- Grows a little: **on** · off. Scales the card up by 4% while it tilts, which reads as lifting it toward you.

## Canvas Particle Effect

Dots drift, link up when close, and dodge your pointer. Best for tech sites.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/canvas-particle-effect/
- How it runs: moves by itself
- Good for: Hero sections · Tech sites · Loading screens · Dark backgrounds
- Avoid on: Long reading pages · Busy layouts

**Prompt**

Add a particle background to [the section you want it behind]. Draw small dots on a canvas, give each its own direction, and bounce them off the edges. When the settings include lines, join any two dots that come close with a thin line that fades as they move apart, so a network keeps forming and breaking. Dots near the pointer, or a finger on touch screens, can be pushed away or pulled in. Checking every pair of dots gets slow quickly, so draw far fewer dots on phones and tablets, and stroke the lines in a few batches rather than one at a time. If the visitor has reduced motion turned on, show the dots still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Pointer effect: **Push** · Pull · None. What the pointer or a finger does to dots within 120px: pushes them away, pulls them in, or nothing, more strongly the closer they are (a dot 40px away speeds up by about 36px a second every second), up to twice the fastest drift speed; a dot keeps the speed it gains.
- Number of particles: Few · **Medium** · Many. Few is 250, medium 500 and many 800 dots on computers; tablets draw 60, 90 and 120, and phones 30, 45 and 60, which keeps them smooth.
- Link distance: None · Short · **Medium** · Long. How close two dots must be to join with a line: short is 70px, medium 100px and long 150px; none draws no lines.
- Speed: Slow · **Normal** · Fast. How fast the dots drift: slow is 30px, normal 48px and fast 78px a second for the fastest dots, and the slowest go a fifth of that, on any screen; slow feels calm, fast looks busy.
- Color: Pink · White · **Blue** · Purple · Green · Orange. The color of the dots and lines.
- Trails: on · **off**. Each dot leaves a fading streak, because the canvas is only partly cleared between frames.

## Fluid / Liquid Simulation

Blobs drift and melt into each other like liquid. Best for hero backgrounds.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/fluid-simulation/
- How it runs: moves by itself
- Good for: Hero backgrounds · Wellness brands · Creative studios · Splash screens
- Avoid on: Behind text · Small elements

**Prompt**

Add liquid blobs to [the section you want them in]. In a WebGL fragment shader, work out for every pixel its distance to each of a few moving circles, and blend those distances with a smooth minimum so circles that come close melt into one shape with soft necks between them, like drops of mercury. Move the circles on looping paths so they keep merging and separating; one can follow the pointer or a finger. Every pixel is checked against every circle, so draw fewer pixels on phones. If the visitor has reduced motion turned on, show the blobs still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Melting: A little · **Medium** · A lot. How far apart two blobs start to melt together: a little is 0.03, medium 0.08 and a lot 0.15 of the stage height; a lot gives thick, soft necks.
- Number of blobs: Few · **Medium** · Many. Few is 3, medium 5 and many 8 blobs; each one adds work for every pixel.
- Speed: Slow · **Normal** · Fast. How fast the blobs move on their paths: at slow each blob swings from side to side and back every 3 to 10 seconds, at normal every 2 to 6 seconds and at fast every 1.2 to 3.7 seconds, each at its own pace.
- Blob size: Small · **Medium** · Large. Each blob's radius: small is 9%, medium 14% and large 20% of the stage height.
- Color: Pink · White · **Blue** · Purple · Green · Orange. The color of the liquid.
- Glow: **on** · off. Adds a soft halo that fades out around the liquid.
- One blob follows the pointer: **on** · off. One blob leaves its path and sits under the pointer or a finger.

## Glassmorphism Animated

Frosted glass cards blur the colors behind them. Best for cards and panels.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/glassmorphism-animated/
- How it runs: moves by itself
- Good for: Cards and panels · Dashboards · Modals · Navigation bars
- Avoid on: Plain backgrounds · Large surfaces

**Prompt**

Add frosted glass to [the cards or panels you want to style]. Give each card a see-through tinted background, blur whatever sits behind it, and add a thin light edge. Put colorful shapes that drift slowly behind the cards, with a faint pattern of dots over them, because glass over plain color looks gray and shows no frost. Put a see-through dark layer inside each card under its text so the words stay readable. A card can also breathe, its blur growing and fading, or slowly change its tint. Blurring costs a lot, so keep the glass to small cards and blur the shapes less on phones. If the visitor has reduced motion turned on, keep everything still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Frost: Off · Light · **Medium** · Heavy. How strongly the glass blurs what is behind it: light is 6px, medium 12px and heavy 20px; off shows the cards with no blur, to compare.
- Tint strength: Faint · **Medium** · Strong. How much color the glass adds: faint fills it with the tint color at 6% strength, medium at 12% and strong at 25%.
- Speed: Slow · **Normal** · Fast. How long the colors behind take to drift through one path: slow is 13s, normal 8s and fast 5s.
- Tint color: Pink · White · **Blue** · Purple · Green · Orange. The color of the glass.
- Breathing frost: **on** · off. The middle card's blur grows from 8px to 20px and back every 4 seconds.
- Shifting tint: **on** · off. The right card's tint moves through blue, green, purple and orange every 8 seconds.

## WebGL Shader Animation

Moving color patterns computed for every pixel. Best for bold backgrounds.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/webgl-shader-animation/
- How it runs: moves by itself
- Good for: Hero backgrounds · Music and events · Loading screens · Art pages
- Avoid on: Behind text · Low-power devices

**Prompt**

Add a moving shader pattern to [the background or section you want it in]. Cover the area with one WebGL surface and write a fragment shader that works out the color of every pixel from its position and the time, so the whole pattern moves as the time runs on: flowing plasma, rippling waves, cells or a kaleidoscope. When the settings include it, let the pointer, or a finger on touch screens, bend the pattern near it. Draw fewer pixels on phones, and show a clear message where WebGL is not available. If the visitor has reduced motion turned on, show one still frame. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Pattern: **Plasma** · Waves · Cells · Kaleidoscope. Plasma adds up sine waves into flowing color; Waves bends striped color; Cells splits the plane into cells around moving points; Kaleidoscope mirrors one slice around the middle.
- Speed: Slow · **Normal** · Fast. How fast time runs in the pattern: slow is 0.6, normal 1 and fast 1.6 times real time, so the plasma's colors drift once around the rainbow in about 33 seconds at slow, 20 at normal and 12.5 at fast.
- Reacts to the pointer: on · **off**. Each pattern bends around the pointer or a finger in its own way; in Kaleidoscope the pointer sets the number of slices.

## Noise-Based Motion

Smooth noise makes dots sway and a blob ripple. Best for calm backgrounds.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/noise-based-motion/
- How it runs: moves by itself
- Good for: Backgrounds · Generative art · Idle and loading states
- Avoid on: Behind text · Fast-paced screens

**Prompt**

Add noise-based motion to [the background or shape you want to bring to life]. Use smooth noise, a random value that changes gradually from place to place, instead of plain random numbers, which jump. For a field of dots, turn the noise at each dot into a direction and nudge the dot that way, then move through the noise over time so the whole field sways like grass in the wind. For a blob, push each point of its outline in or out by the noise so the edge ripples. Space the dots by distance, not by count, so phones draw fewer. If the visitor has reduced motion turned on, keep everything still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Shape: **Field of dots** · Blob. A field of dots that sway, or one blob whose outline ripples.
- Pattern size: Large · **Medium** · Small. How big the noise's patterns are: one swirl of the noise is about 250px across at large, 125px at medium and 60px at small, and the blob's edge has about two, three or five ripples; large moves big areas together, small looks busy and fine.
- Speed: Slow · **Normal** · Fast. How fast the noise moves along: the pattern drifts one swirl's width in about 5.6 seconds at slow, 3.3 at normal and 2.1 at fast, which with medium patterns is about 22px, 38px and 60px a second.
- Wobble: Small · **Medium** · Large. How far each dot, or the blob's edge, moves: small is 6px, medium 12px and large 20px from each dot's place, and the blob's edge moves in and out by up to twice that.
- Space between dots: Wide · **Medium** · Tight. The distance between dots in the field: wide is 64px, medium 48px and tight 32px; smaller stages draw fewer dots.
- Color: Pink · White · **Blue** · Purple · Green · Orange. The color of the dots or the blob.

## SVG Path Animation

A line drawing draws itself, stroke by stroke. Best for icons and logos.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/svg-path-animation/
- How it runs: plays once
- Good for: Icons · Logos · Signatures · Illustrations
- Avoid on: Photos · Body text

**Prompt**

Add a self-drawing line to [your icon, logo or signature, drawn as SVG lines]. Measure the length of each line, hide it behind a dash exactly as long as the line, then slide the dash away so the line appears from one end to the other, as if drawn by hand. Draw several lines one after another, each starting a little after the one before. When the settings include it, fill the shapes once the lines are done. The finished drawing should be there for screen readers from the start. If the visitor has reduced motion turned on, show the drawing complete. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Drawing: **Icon** · Signature · Logo. What is drawn: a house with a star, a flowing signature, or a circle logo.
- Speed: Slow · **Normal** · Fast. How long each line takes to draw: slow is 2400ms, normal 1500ms and fast 900ms; each next line starts after 30% of that.
- Line thickness: Thin · **Medium** · Thick. Thin is 1px, medium 2px and thick 4px with the drawing at its full 400px width, thinner when it shrinks to fit a smaller box; thin looks precise, thick looks bold.
- Feel: **Smooth** · Gentle · Even. Smooth slows at the end, like a hand finishing a stroke; Gentle eases in and out; Even keeps one pace.
- Line color: Pink · White · **Blue** · Purple · Green · Orange. The color of the lines, and of the fill.
- Starts from the other end: on · **off**. Draws each line from its end back to its start.
- Fills in at the end: on · **off**. Fills the shapes with a light tint of the line color once the lines are drawn.

## Chromatic Aberration

A word splits into red, green and blue fringes. Best for bold titles.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/chromatic-aberration/
- How it runs: moves by itself
- Good for: Bold titles · Music and games · Error pages
- Avoid on: Body text · Light backgrounds

**Prompt**

Add a chromatic aberration effect to [your headline or short word]. Stack three copies of the text in pure red, green and blue, blend them so that where they overlap they add up to white, and shift the red and blue copies in opposite directions so colored fringes appear at the letters' edges, like a cheap camera lens. The split can breathe in and out, or jump now and then like a glitch. It only works on a dark background. Screen readers should read the text once, not three times. If the visitor has reduced motion turned on, keep the copies still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Movement: **Pulse** · Glitch · None. Pulse widens the split to 1.8 times and back every 2 seconds; Glitch makes the red and blue copies jump twice near the end of every 4 seconds, for 80ms each, always the same way whatever the Direction: red goes right by 3 times the split and up by the split, then left by 2 times the split and down by the split, and blue goes the opposite way; None keeps it still.
- Color split: Small · **Medium** · Large. How far the red and blue copies sit from the word: small is 2px, medium 4px and large 8px; above about 6px the word gets hard to read.
- Direction: Sideways · **Slanted** · Up and down. Sideways splits the colors left and right; Slanted splits them at 30°; Up and down splits them vertically.
- Soft color edges: on · **off**. Blurs the red and blue copies by 2px, which looks more like a lens than a digital shift.
- Your text: text field, starts as "PRISM". The word that splits.

## 2.5D / Pseudo-3D

Flat layers slide by different amounts, faking depth. Best for hero scenes.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/2-5d-pseudo-3d/
- How it runs: reacts to the visitor
- Good for: Hero scenes · Illustrations · Game sites · Landing pages
- Avoid on: Photos · Content-heavy pages

**Prompt**

Add a 2.5D parallax scene to [the illustration or hero you want to give depth]. Split the picture into flat layers, from a far sky to the near ground, and when the pointer moves, shift every layer the opposite way by an amount that grows with how near it is: the sky barely moves and the ground moves the most, so the flat picture seems deep. Make each layer a little wider than the frame so no edge shows. On touch screens, dragging a finger should move the scene the same way. If the visitor has reduced motion turned on, keep the layers still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Camera movement: Small · **Medium** · Large. How far the nearest layer travels as the pointer crosses the scene from one side to the other: small is 20px, medium 40px and large 70px (half that each way from the middle), and 40% as far from top to bottom; the farthest layer moves 5% of that.
- Layer labels: on · **off**. Labels each layer with the share of the camera movement it follows, from 5% for the sky to 100% for the ground.

## Ray Marching / SDF Scene

A 3D scene drawn only from formulas, circled by a camera. Best for art pages.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/ray-marching-sdf/
- How it runs: moves by itself
- Good for: Art pages · Hero visuals · Tech demos
- Avoid on: Behind text · Low-power devices

**Prompt**

Add a ray-marched 3D scene to [the section you want it in]. Draw the whole scene in a fragment shader, with no 3D models: describe each shape as a formula that gives the distance to its surface, then for every pixel step a ray forward by that distance until it touches a surface, and light that point. Formulas let shapes melt together, be carved out of each other or repeat without end, while a camera circles them. Every pixel does a lot of work, so draw fewer pixels and take fewer steps on phones. If the visitor has reduced motion turned on, show one still frame. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Scene: **Blend** · Cut-out · Endless. Blend melts a sphere, a box and a ring together; Cut-out carves a box out of a sphere, with a small ball inside; Endless repeats a carved box across the floor without end.
- Camera speed: Slow · **Normal** · Fast. How fast the camera circles the shapes: once in about 18 seconds at slow, 10 at normal and 6 at fast.
- Soft shadows: on · **off**. Casts a second ray toward the light from every surface point, for soft shadows; the most costly option.
- Corner shading: **on** · off. Darkens creases and corners where surfaces meet, by testing a few points just above each surface.
- Detail: Low · **Medium** · High. The most steps a ray may take: low is 24, medium 48 and high 96; phones take two thirds as many.
- Step count view: on · **off**. Colors each pixel by how many steps its ray took: edges and near misses take the most.

## GPGPU Particle System

Tens of thousands of particles flow on the graphics chip. Best for hero effects.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/gpgpu-particle-system/
- How it runs: moves by itself
- Good for: Hero effects · Data art · Launch pages
- Avoid on: Behind text · Low-power devices

**Prompt**

Add a GPU particle system to [the section you want it in]. Keep every particle's position and speed in a floating-point texture, one pixel per particle, and move them all at once in a shader that reads one texture and writes the other, swapping them after each pass, one pass per 60th of a second so it runs at the same speed on every screen. Then draw each particle as a tiny point, following a flowing field, a swirl, a pull to the middle or an orbit. That keeps tens of thousands of particles smooth. Start with far fewer on phones, and show a clear message where WebGL 2 is missing. If the visitor has reduced motion turned on, show one still frame. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Movement: **Flow** · Swirl · Attract · Orbit. Flow follows a shifting field of currents; Swirl circles the middle; Attract pulls everything toward the middle; Orbit sweeps the particles round in rings.
- Number of particles: 16,000 · **65,000** · 100,000 (phones start with 16,000). 16,000, 65,000 or 100,000 particles, one pixel each of a texture 128, 256 or 320 pixels square; phones start with 16,000.
- Speed: Slow · **Normal** · Fast. How hard the rule pushes for every sixtieth of a second: slow pushes 0.35 times as hard as fast and normal 0.6 times; under Flow a typical particle then crosses about 11%, 16% or 22% of the stage a second.
- Color: **One color** · By speed · Shifting. One blue, a color from each particle's speed, or colors that slowly shift.
- Trails: on · **off**. Fades the last picture instead of clearing it, so each particle leaves a streak.

## Image Distortion on Hover

The picture ripples and bends around your pointer. Best for portfolio images.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/image-distortion-hover/
- How it runs: reacts to the visitor
- Good for: Portfolio images · Gallery tiles · Hero images · Product photos
- Avoid on: Small thumbnails · Images with text

**Prompt**

Add a hover distortion to [the image you want to react]. Draw the image with a WebGL shader and, in a circle around the pointer, read each pixel from a slightly shifted spot, so the picture seems to ripple, bulge, swirl like liquid or break into squares there while the image itself never changes. The bending fades out smoothly after the pointer leaves. On touch screens, dragging a finger across the image should do the same. If the visitor has reduced motion turned on, keep the image still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Effect: **Ripple** · Push · Liquid · Pixels. Ripple sends rings out from the pointer; Push bulges the picture outward; Liquid swirls it; Pixels breaks it into squares.
- Strength: Gentle · **Medium** · Strong. How far the picture bends: Ripple shifts it by up to 2% of its width and height at gentle, 4% at medium and 7% at strong; Push shifts it 1.6 times as far and Liquid 0.6 times, and Pixels makes blocks up to 1%, 1.7% or 2.9% of the picture's width and height. Stronger looks more dramatic but harder to read.
- Size: Small · **Medium** · Large. How wide an area bends: a circle around the pointer whose radius is 15% of the picture's height at small, 25% at medium and 40% at large; the bending fades from full at the pointer to none at its edge.
- Fade-out speed: Slow · **Normal** · Fast. How fast the bending fades after the pointer leaves: each second it loses about three fifths of its strength at slow, about four fifths at normal and nine tenths at fast.
- Moving ripples: **on** · off. With Ripple, the rings keep moving outward while the pointer rests; off, they stand still.

## Cloth / Soft-Body Simulation

A cloth sways in the wind, and you can drag it around. Best for playful pages.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/cloth-simulation/
- How it runs: moves by itself
- Good for: Flags and banners · Playful pages · Fashion and textiles
- Avoid on: Behind text · Serious content

**Prompt**

Add a cloth simulation to [the flag, banner or fabric you want to show]. Model the cloth as a grid of points joined to their neighbors by links of fixed length. In fixed 1/60 s steps, as many as the time since the last frame needs, move every point by its own momentum plus gravity and wind, then pull linked points back toward their proper distance a few times over, so the cloth moves at the same speed on every screen. Pin some points so the cloth hangs, and let the visitor grab and drag the nearest point with the pointer or a finger. Use a coarser grid on phones. If the visitor has reduced motion turned on, show the cloth hanging still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Hangs from: **Two corners** · Top edge · One corner · Nothing. Pins the top two corners, the whole top edge, one corner, or nothing, in which case the cloth falls to the floor.
- Wind: Light · **Medium** · Strong. How hard the wind blows; it rises and falls on its own over a 12.6-second cycle: at its peak it speeds points up sideways by about 30px a second every second at light, 75px at medium and 180px at strong, and part of the time it blows back at up to about half that.
- Stiffness: Stretchy · **Medium** · Stiff. How many times each step, sixty a second, the links are pulled back to length: stretchy is 2, medium 4 and stiff 8.
- Gravity: Light · **Normal** · Heavy. How heavy the cloth is: gravity speeds a falling point up by about 17px a second every second at light, 35px at normal and 58px at heavy.
- Detail: Low · **Medium** · High (phones start with Low). How many cells the cloth's grid has, with a point at every corner: low is 16 × 12, medium 24 × 18 and high 40 × 30; the cloth is cut 80% as wide as the stage and 65% as tall, so the cells take their shape from the stage: about square on a phone, but two to three times as wide as tall on a laptop; phones start at low.
- Shows the points: on · **off**. Marks every point of the grid, with the pinned ones in red.

## Volumetric Smoke / 3D Noise

Soft smoke curls upward, drawn as a real 3D cloud. Best for moody backgrounds.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/volumetric-smoke/
- How it runs: moves by itself
- Good for: Moody backgrounds · Title cards · Games · Sci-fi themes
- Avoid on: Behind text · Low-power devices

**Prompt**

Add volumetric smoke to [the section you want it in]. In a fragment shader, send a ray through a 3D cloud of smooth noise for every pixel and add up how much smoke it passes through, shading each step by how much smoke lies between it and the light, so the plume looks soft, deep and lit from one side. Move the noise upward over time so the smoke rises and curls, and let it drift sideways when the settings include wind. It is costly, so draw fewer pixels and take fewer steps on phones. If the visitor has reduced motion turned on, show the smoke still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Thickness: Thin · **Medium** · Thick. How dense the smoke is: thin is 0.6 times as dense as medium and thick 1.7 times, so the thickest wisps hide about a third of what is behind at thin, half at medium and 70% at thick; thin looks wispy.
- Speed: Slow · **Normal** · Fast. How fast the smoke rises: its pattern moves about 3% of the box's height a second at slow, 5% at normal and 9% at fast.
- Detail: Low · **Medium** · High. How many steps each ray takes: low is 16, medium 32 and high 64 (48 on phones); fewer steps leave visible stripes.
- Smoke color: **Gray blue** · White · Purple · Orange. The color of the lit smoke; the shadowed parts are darker shades of it.
- Wind: **on** · off. The smoke drifts slowly to one side, about 2% of the box's height a second, while the plume stays in place.
- Fine grain: **on** · off. Starts each ray at a slightly random point, which turns the stripes that few steps leave into fine grain.

## Morphing Blob

Blobs melt together, and one drop chases your pointer. Best for hero sections.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/morphing-blob/
- How it runs: moves by itself
- Good for: Hero sections · Playful brands · Loading states · Cursor effects
- Avoid on: Serious content · Busy layouts

**Prompt**

Add a gooey blob to [the section you want it in]. Draw several plain circles that drift on looping paths, and run them through a filter that blurs them and then sharpens the blurred edge again, so circles that come close melt into one liquid shape and pull apart again. One drop follows the pointer, or a finger on touch screens, and merges with the rest when it comes near. Keep the blurred area small on phones. If the visitor has reduced motion turned on, show the blob still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Gooeyness: Low · **Medium** · High. How much the circles are blurred before the edge is sharpened again: low is 6, medium 10 and high 16, measured in a drawing 360 units across whose circles are 26 to 52 units in radius; higher melts circles from farther apart.
- Number of blobs: Few · **Medium** · Many. Few is 4, medium 6 and many 9 circles, counting the drop that follows the pointer.
- Speed: Slow · **Normal** · Fast. How fast the circles drift: slow is 0.6, normal 1 and fast 1.6 times; each circle sways side to side and up and down at the same time, each sway at its own rate (at normal, one sway takes 6 to 16 seconds), so it wanders in loops that never quite repeat rather than back and forth along one line.

## 3D Flip Card

A card turns over in 3D to show its back. Best for profile and product cards.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/flip-card-3d/
- How it runs: reacts to the visitor
- Good for: Profile cards · Product cards · Flashcards · Quiz answers
- Avoid on: Long text · Key information

**Prompt**

Add a 3D flip to [the card you want to turn over]. Place the front and back faces in the same spot, turn the back face around so it faces away, and hide whichever face points away from the viewer. Clicking, tapping or pressing Enter turns the card over in 3D to show its back, and again to show its front. Give the card's container a 3D perspective so the turn has depth. When the settings include it, pointing at the card can flip it too, and the card can lean toward a hovering pointer. If the visitor has reduced motion turned on, swap the faces with a quick fade instead of turning. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Flip direction: **Sideways** · Up and over. Sideways turns the card like a page; up and over turns it like a flap.
- Speed: Slow · **Normal** · Fast. How long one turn takes: slow is 1000ms, normal 650ms and fast 400ms; 600 to 900ms feels physical.
- 3D depth: Subtle · **Medium** · Strong. How close the viewer seems: subtle is 2000px, medium 1200px and strong 600px; closer exaggerates the turn.
- Flips on hover: on · **off**. Pointing at the card turns it over and leaving turns it back; a tap still turns it on touch screens.
- Tilt toward the pointer: Off · **Gentle** · Strong. While idle, the card leans toward a hovering pointer, up to 5° (gentle) or 9° (strong) at the stage's edges; off keeps it flat.

## 3D Carousel

Cards stand in a ring that spins in 3D as you drag it. Best for image galleries.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/carousel-3d/
- How it runs: reacts to the visitor
- Good for: Image galleries · Product picks · Portfolios · Album covers
- Avoid on: Long lists · Text-heavy cards

**Prompt**

Add a 3D carousel to [the cards or pictures you want to show]. Stand the cards in a ring: turn each one by an equal share of a full circle, push it out from the middle by the same distance, and give the container a 3D perspective. Dragging sideways turns the whole ring with the pointer or finger; on release it keeps a little speed, then settles with the nearest card facing front. Previous and next buttons and the arrow keys turn it one card at a time. Change only the ring's rotation so it stays smooth. When the settings include it, the ring turns slowly by itself. If the visitor has reduced motion turned on, jump from card to card without turning. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Number of cards: 6 · **8** · 12. How many cards stand in the ring: 6, 8 or 12, with a gap of 12% of a card between neighbors. More cards make a wider ring; where it would not fit, as with 12 cards on a phone, the cards are drawn smaller to keep it within 94% of the box's width.
- Seen from above: **on** · off. Tilts the ring back 14 degrees, so the cards behind show above the front ones; off shows the ring straight on.
- Spins by itself: on · **off**. The ring turns 12 degrees a second, waits while you drag and starts again a moment after it settles; under reduced motion it steps one card every three seconds instead.

## Depth-Map Photo

A flat photo turns 3D as you point: near parts shift more. Best for hero images.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/depth-map-photo/
- How it runs: reacts to the visitor
- Good for: Hero images · Portfolio photos · Travel stories · Album art
- Avoid on: Photos with text · Small thumbnails

**Prompt**

Add a depth effect to [the photo you want to bring to life]. Make a grayscale depth map the same size as the photo, white for near parts and black for far ones, and blur it slightly. Draw the photo with a WebGL shader that reads each pixel from a spot shifted by the pointer's position times that pixel's depth, so near parts move more than far ones and the flat photo looks three-dimensional. Zoom in a little so the edges never show, and let the view glide toward the pointer and back to the middle when it leaves. On touch screens, dragging a finger should do the same. If the visitor has reduced motion turned on, keep the photo still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Depth strength: Subtle · **Medium** · Strong. How far the nearest part slides against the farthest when the pointer reaches the edge of the picture: subtle is 2%, medium 3.5% and strong 5% of the picture's width; up and down move about a third as far, which keeps the stretched strips small.
- Shows the depth map: on · **off**. Draws the gray depth map in place of the picture, moving the same way: white is near and black is far.

## Flocking

Birds swirl and turn together as one flock. Best for calm backgrounds.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/flocking/
- How it runs: moves by itself
- Good for: Hero sections · Nature and travel sites · Art and game pages · Dark backgrounds
- Avoid on: Long reading pages · Busy layouts

**Prompt**

Add a flock of birds to [the section you want it behind]. Draw each bird as a small arrowhead on a canvas, pointing the way it flies. Each bird sees only the birds near it and follows three rules: keep a little room from the closest ones, turn the way its neighbors fly, and drift toward their middle, so the flock swirls and turns as one. Turn birds back before they reach the edges, and move them by the time since the last frame so the speed is the same on every screen. Use fewer birds on phones. When the settings include it, birds swerve away from the pointer or a finger. If the visitor has reduced motion turned on, show the flock still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Flock size: Small · **Medium** · Large. How many birds fly: small is 70, medium 150 and large 280; phones fly 35, 70 and 130.
- How close they fly: Loose · **Normal** · Tight. The room each bird keeps around it and how hard it follows its neighbors: loose keeps 32px and follows gently, normal keeps 22px, tight keeps 15px and follows hard. The pulls toward their heading and their middle weigh 0.7 and 0.3 at loose, 1 and 0.5 at normal and 1.2 and 0.9 at tight, against 2 for keeping apart; the room shrinks in proportion on a stage under 380px tall or wide, to 65% at the least.
- Flees the pointer: **on** · off. Birds within 90px of the pointer or a finger steer straight away from it.
- Speed: Slow · **Normal** · Fast. The top speed, in pixels per 60th of a second: slow is 1.3, normal 2 and fast 3 (78, 120 and 180px a second); no bird flies slower than 55% of it. It shrinks in proportion on a stage under 380px tall or wide, to 65% at the least.
- Shows one bird's view: on · **off**. Rings one bird with the 50px radius it looks within and the dashed room it keeps, and links it to every neighbor it follows.

## ASCII / Halftone

A moving picture is redrawn with letters or dots. Best for retro and tech looks.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/ascii-halftone/
- How it runs: moves by itself
- Good for: Retro and tech sites · Music and game pages · Hero images · Portfolio headers
- Avoid on: Photos people must see clearly · Long reading pages

**Prompt**

Add an ASCII and halftone effect to [the picture or video you want to restyle]. Each frame, draw the picture onto a small hidden canvas with one pixel for every cell of a grid, and read back each pixel's brightness. On the visible canvas, draw a character in every cell, choosing characters with more ink for brighter cells, or draw a dot whose size grows with the brightness, like a printed photo. Color the marks with the picture's own colors or with one color. Copy the characters from a ready-made sheet instead of drawing each character separately every frame, so it stays smooth, and use bigger cells on phones. If the visitor has reduced motion turned on, show one still frame. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Drawn with: **Letters** · Dots. Letters gives each cell one of ten characters, from a space to a hash sign, by its brightness; dots gives it one of twelve dot sizes, from none to one that fills the cell, in even steps of area.
- Cell size: Small · **Medium** · Large. The height of a cell: small is 8px, medium 11px and large 16px, and phones use 10, 14 and 20px; letter cells are 0.7 as wide as they are tall, dot cells are square.
- Colors: **One color** · Full color. One color paints every mark mint green, or near-black on paper; full color gives each mark the color of its spot in the picture.
- Shows the original picture: on · **off**. Draws the moving picture at 40% under the marks, so you can see what each mark stands for.
- Light paper: on · **off**. A light page with dark marks: each cell's darkness, not its brightness, picks the mark, as in a printed photo.

## 2D Physics

Balls drop where you click, bounce and pile up. Best for playful intros.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/physics-2d/
- How it runs: reacts to the visitor
- Good for: Playful intros · Empty states · Games and toys · Kids' and learning sites
- Avoid on: Forms and checkout · Serious content

**Prompt**

Add a box of bouncing balls to [the hero or empty area you want to liven up]. A click or tap drops a ball there; it falls, bounces off the walls and each other, and comes to rest in a pile. Dragging a ball with the pointer or a finger picks it up, and letting go throws it at the speed of the drag. Run the physics in fixed steps, as many as the time since the last frame needs, so it behaves the same on every screen, and stop drawing once everything is still. Fade out the oldest ball when there are too many. If the visitor has reduced motion turned on, show each new ball already resting where it would land. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Gravity: Moon · **Earth** · Heavy. How hard the balls are pulled down. Earth adds the box's height divided by 1,000 to a ball's downward speed every 60th of a second, so a ball falls the whole box in about three quarters of a second; the Moon pulls a fifth as hard, a fall of about 1.6 seconds, and Heavy twice as hard, about half a second.
- Bounciness: Low · **Medium** · High. The share of its closing speed a ball keeps after a hit: low is 0.2, medium 0.5 and high 0.8; a hit slower than 1 pixel per 60th of a second does not bounce.
- Ball sizes: **All the same** · Mixed. One radius for every ball (5.5% of the box's shorter side, between 12 and 22 pixels), or a mix from 0.6 to 1.4 times it, heavier by area.
- Shows the speed: on · **off**. An arrow on each moving ball, 6 pixels long for every pixel it moves in a 60th of a second, at most three radii.

## Liquid Glass

Drag a glass panel and the picture behind it bends at the edges. Best for cards.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/liquid-glass/
- How it runs: reacts to the visitor
- Good for: Floating menus · Cards over photos · Tab bars · Media controls
- Avoid on: Long text · Plain backgrounds

**Prompt**

Add a liquid glass panel to [the card or menu you want to float over a picture]. The panel shows what is behind it bent and magnified near its rounded edges, like thick curved glass, with a soft highlight along the rim. Bend it with an SVG displacement filter applied to what is behind the panel, which Chromium browsers support; other browsers get blurred, tinted glass with the same highlight. Dragging with the pointer or a finger moves it, and so do the arrow keys; it stretches a little as it moves and wobbles back when it stops. Use transforms only, so it stays smooth. If the visitor has reduced motion turned on, let it jump instead of gliding, with no stretch or wobble. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- How much it bends: Subtle · **Medium** · Strong. The rim's deepest shift, at the very edge, as a share of the rim's width (35% of the panel's height): subtle 25%, medium 42% and strong 60%, and a slight pull toward the middle, which magnifies the whole panel a little, adds 15% to it. Past half the rim folds into a thin mirrored band, as the edge of thick glass does. Other browsers show a faint white glow inside the rim instead, blurred over 12, 23 or 36px.
- Frost: **Clear** · Light · Frosted. How much the backdrop is blurred: clear none, light 1.5 and frosted 4 pixels where the glass bends; 3, 8 and 16 pixels for the frosted glass of other browsers.
- Tint: Pink · **White** · Blue · Purple · Green · Orange. The color the glass adds, mixed in at 9% for white and 20% for the other colors.
- Shape: **Card** · Pill · Circle. Card: 1.6 times as wide as tall, corners a third of its height; pill: 2.7 times as wide as tall with round ends; circle: a round lens. The card is 30% of the stage's width, from 150 to 280 pixels (the pill 1.12 times as wide and the circle 0.68 times), and no shape is taller than 55% of the stage.
- Shows the bend map: on · **off**. Lays the displacement map over the glass: red is the sideways shift, green the shift up or down, gray none.

## Holographic Card

A card tilts as you point, and its rainbow foil shimmers. Best for collectibles.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/holographic-card/
- How it runs: reacts to the visitor
- Good for: Trading cards · Membership cards · Rewards and badges · Product launches
- Avoid on: Text-heavy cards · Dense grids

**Prompt**

Add a holographic foil to [the card you want to make shine]. Build the card from stacked layers: its picture, a rainbow sheet blended over it to light up the colors beneath, a spot of glare when the settings include one, and on top the text on solid panels so it stays readable. As the pointer moves over the card, tilt the card toward it in 3D, slide the foil with the tilt and keep any glare under the pointer. Ease each change, and move layers only by position and transparency so it stays smooth. On touch screens, dragging a finger does the same. If the visitor has reduced motion turned on, keep the card flat and the foil still, and only brighten it. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Foil pattern: **Smooth** · Glitter · Lines. Smooth shows the rainbow as soft bands; Glitter lets it through scattered dots and Lines through fine diagonal lines, like the sparkle and etched foils of real cards.
- How far it tilts: Gentle · **Medium** · Strong. How far the card leans at its edges: gentle is 6°, medium 12° and strong 20°; much more and the text on the card gets hard to read mid-tilt.
- Glare: Off · **Soft** · Bright. The spot of light under the pointer: off, soft (55% strength, a little over half) or bright (full strength); a copy at a quarter of that strength lights the text panels.
- Shows the layers: on · **off**. Turns the card to one side and spreads its four layers apart, so the picture, the foil, the glare and the text panels show one above the other.

## Infinite Zoom

The view keeps zooming into pictures inside pictures. Best for page intros.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/infinite-zoom/
- How it runs: moves by itself
- Good for: Page intros · Portfolios and galleries · Story and game sites · Music and art pages
- Avoid on: Long reading pages · Forms and checkout

**Prompt**

Add an infinite zoom to [the section you want it in]. Give each picture, such as [a painting, a screen or a photo], a frame in its middle, the same shape as the view, that holds a smaller copy of the next picture, so the pictures nest inside each other. Move the view steadily into or out of the middle, growing or shrinking every picture by the same factor each second so the speed feels even. Each time a picture exactly fills the view, draw it as the outermost one, so the loop never jumps. Draw only the pictures big enough to see, and keep them sharp at full size. If the visitor has reduced motion turned on, show one still frame. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. How long each picture takes to grow from its window to the whole box, 2.5 times its size: slow is 7.5 seconds, normal 4.5 and fast 2.5.
- Number of scenes: 1 · 3 · **5**. How many different pictures take turns: one picture holds a copy of itself; three are the gallery, the drive-in and the living room; five add the desk and the photo on a table.
- Direction: **In** · Out. In dives into each picture's window; out pulls back, so each picture shrinks into the window of the one around it.
- Shows the scene edges: on · **off**. Outlines the edge of every picture with a dashed line and numbers the ones big enough to read by their place in the chain, so you can see each one grow to the edges of the box and take over.

## Water Ripple

Ripples spread from your finger and bend the picture below. Best for hero images.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/water-ripple/
- How it runs: reacts to the visitor
- Good for: Hero pictures · Pool, spa and travel sites · Playful backgrounds
- Avoid on: Pictures with text · Busy pages

**Prompt**

Add a water ripple effect to [the picture you want to look as if it lies under water]. Keep two grids of water heights, now and one step earlier. On each step, set every point to half the total of its four neighbors minus its earlier height, then damp it slightly, so ripples spread, cross, bounce off the edges and fade. A finger or mouse drag leaves a trail of small pushes without scrolling the page; a tap drops a pebble. Draw the picture shifted at each point by the slope of the water, so it bends under the waves. Use a coarse grid and fixed steps, and stop once the water is calm. Under reduced motion, show still rings that fade. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Ripple size: Small · **Medium** · Large. How wide each push is, in grid points of a full-size grid: small is 2, medium 3.5 and large 5.5 (a tap's pebble is half as wide again).
- How long ripples last: Short · **Medium** · Long. How much height the water loses each step: short is 5%, which fades a pebble's rings within a second; medium 2.2%, about three seconds; long 0.9%, long enough for rings to bounce off the edges and cross.
- Bend: Subtle · **Medium** · Strong. How far the picture under a slope is shifted: subtle is 5 grid points for a full slope, medium 12 and strong 22.
- Light on the waves: **on** · off. Slopes that face the light show a lighter picture, in three steps of brightness; off, only the bending shows.

## Audio Visualizer

Bars dance to the music, from bass to treble. Best for music players.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/audio-visualizer/
- How it runs: moves by itself
- Good for: Music players · Podcast pages · Radio and DJ sites · Voice notes
- Avoid on: Pages without sound · Reading pages

**Prompt**

Add an audio visualizer to [your music player, podcast card or hero section]. Connect the playing audio to an analyzer that reports, many times a second, how loud each band of pitches is, and draw the bands on a canvas from bass to treble, in the style the settings choose, each sized by its loudness. Give higher bands wider slices of pitch, as hearing does, so the whole row moves. Let bands jump up at once and sink back as the settings choose. Start sound only when the visitor presses play, never use the microphone without asking, and draw fewer bars on phones. If the visitor has reduced motion turned on, keep the bars still until they press play. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Style: **Bars** · Wave · Circle. Bars stand in a row from bass to treble; wave draws the sound's shape over a few hundredths of a second instead of its pitches; circle sets the bars around a ring that swells with the bass.
- Number of bars: Few · Some · **Many** (phones start with Some). Few is 16 bars, some 32 and many 64; phones start at some, and each row of Compare holds half as many bars on phones; a wave has no bars, so it ignores this.
- How bars fall: Quickly · **Gently** · Slowly. How fast a bar sinks after it jumps: quickly is 2.6 bar heights a second, gently 1.2 and slowly 0.45, like an old stereo; a wave ignores it.
- Peak marks: **on** · off. A thin mark (a dot in the ring) holds each bar's highest point for 0.4 seconds, then sinks slowly; off, only the bars show; a wave has none.
- Colors: **Sunset** · Ocean · Neon. The colors from the bottom of each bar to its top: sunset runs from coral to gold, ocean from deep blue to cyan, neon from pink to cyan; See inside lays the colors of the tune's parts over them.
