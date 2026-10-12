# 06 · 3D & Advanced

WebGL, shaders, particles, 3D transforms, simulations, and other heavier effects. 26 animations from Animation Handbook, in the home page's order. Each entry gives the live demo, how it runs, what it is good for and what to avoid it on, the prompt from its page word for word, and its settings.

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

## 3D Model Orbit

A lit 3D shape spins, or turns to face your pointer. Best for product views.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/3d-model-orbit/
- How it runs: moves by itself
- Good for: Product showcases · Hero sections · Logos · 3D previews
- Avoid on: Long reading pages · Low-power devices

**Prompt**

Add a spinning 3D object to [the product or shape you want to show]. Draw it with WebGL: store the shape as triangles and light every point with a soft base light, a direct light and a shiny highlight, so it reads as solid. Turn it around its own axis so every side comes into view, or let it turn to face the pointer, which a tap or a sideways drag should also do on touch screens. Change its size by moving the camera closer or further, not by changing the lens. If the visitor has reduced motion turned on, show the object still. Match the settings listed below.

**Settings** (the defaults in bold):

- Shape: **Cube** · Sphere · Ring · Pyramid
- Movement: **Spins** · Follows the pointer
- Speed: Slow · **Normal** · Fast
- Tumbles as it spins: **on** · off
- Distance: Close · **Medium** · Far
- Color: Pink · White · **Blue** · Purple · Green · Orange
- Edges only: on · **off**

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Shape: Cube, Movement: Spins, Speed: Normal, Tumbles as it spins: on, Distance: Medium, Color: Blue, Edges only: off.

## Scroll-Driven 3D Rotation

Scrolling turns a 3D cube from pose to pose. Best for product tours.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/scroll-driven-3d-rotation/
- How it runs: follows the scroll
- Good for: Product tours · Device launches · Landing pages · Storytelling sections
- Avoid on: Short pages · Forms and dashboards

**Prompt**

Add a scroll-driven 3D rotation to [the product or object you want to show]. Pin the object in view while the visitor scrolls through a tall section, and turn the scroll position, from the top of the section to its end, into a series of poses: turned to one side, tilted forward, larger, then turned round to show its back. Blend smoothly between neighboring poses so scrolling back plays it in reverse, and when the settings include it, let the object glide to catch up instead of jumping with the scroll. If the visitor has reduced motion turned on, follow the scroll exactly, with no gliding. Match the settings listed below.

**Settings** (the defaults in bold):

- Turn amount: Less · **Normal** · More
- Smooth follow: **on** · off

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Turn amount: Normal, Smooth follow: on.

## Parallax 3D Tilt

A card tilts toward your pointer, and a light slides over it. Best for cards.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/parallax-3d-tilt/
- How it runs: reacts to the visitor
- Good for: Feature cards · Pricing cards · Portfolio tiles · Game cards
- Avoid on: Text-heavy cards · Dense grids

**Prompt**

Add a 3D tilt to [the card you want to bring to life]. As the pointer moves over the card, rotate the card slightly around its horizontal and vertical axes according to where the pointer is, and give its container a 3D perspective so the tilt has depth. When the settings include it, move a soft light across the card with the pointer, as if it catches the light. On touch screens, dragging a finger across the card should tilt it the same way. When the pointer leaves, let the card settle back flat. If the visitor has reduced motion turned on, keep the card flat. Match the settings listed below.

**Settings** (the defaults in bold):

- Tilt amount: Small · **Medium** · Large
- 3D depth: Subtle · **Medium** · Strong
- Shine: **on** · off
- Return speed: Slow · **Normal** · Fast
- Tilts away from the pointer: on · **off**
- Grows a little: **on** · off

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Tilt amount: Medium, 3D depth: Medium, Shine: on, Return speed: Normal, Tilts away from the pointer: off, Grows a little: on.

## Canvas Particle Effect

Dots drift, link up when close, and dodge your pointer. Best for tech sites.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/canvas-particle-effect/
- How it runs: moves by itself
- Good for: Hero sections · Tech sites · Loading screens · Dark backgrounds
- Avoid on: Long reading pages · Busy layouts

**Prompt**

Add a particle background to [the section you want it behind]. Draw small dots on a canvas, give each its own direction, and bounce them off the edges. When the settings include lines, join any two dots that come close with a thin line that fades as they move apart, so a network keeps forming and breaking. Dots near the pointer, or a finger on touch screens, can be pushed away or pulled in. Checking every pair of dots gets slow quickly, so draw far fewer dots on phones and tablets, and stroke the lines in a few batches rather than one at a time. If the visitor has reduced motion turned on, show the dots still. Match the settings listed below.

**Settings** (the defaults in bold):

- Pointer effect: **Push** · Pull · None
- Number of particles: Few · **Medium** · Many
- Link distance: None · Short · **Medium** · Long
- Speed: Slow · **Normal** · Fast
- Color: Pink · White · **Blue** · Purple · Green · Orange
- Trails: on · **off**

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Pointer effect: Push, Number of particles: Medium, Link distance: Medium, Speed: Normal, Color: Blue, Trails: off.

## Fluid / Liquid Simulation

Blobs drift and melt into each other like liquid. Best for hero backgrounds.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/fluid-simulation/
- How it runs: moves by itself
- Good for: Hero backgrounds · Wellness brands · Creative studios · Splash screens
- Avoid on: Behind text · Small elements

**Prompt**

Add liquid blobs to [the section you want them in]. In a WebGL fragment shader, work out for every pixel its distance to each of a few moving circles, and blend those distances with a smooth minimum so circles that come close melt into one shape with soft necks between them, like drops of mercury. Move the circles on looping paths so they keep merging and separating; one can follow the pointer or a finger. Every pixel is checked against every circle, so draw fewer pixels on phones. If the visitor has reduced motion turned on, show the blobs still. Match the settings listed below.

**Settings** (the defaults in bold):

- Melting: A little · **Medium** · A lot
- Number of blobs: Few · **Medium** · Many
- Speed: Slow · **Normal** · Fast
- Blob size: Small · **Medium** · Large
- Color: Pink · White · **Blue** · Purple · Green · Orange
- Glow: **on** · off
- One blob follows the pointer: **on** · off

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Melting: Medium, Number of blobs: Medium, Speed: Normal, Blob size: Medium, Color: Blue, Glow: on, One blob follows the pointer: on.

## Glassmorphism Animated

Frosted glass cards blur the colors behind them. Best for cards and panels.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/glassmorphism-animated/
- How it runs: moves by itself
- Good for: Cards and panels · Dashboards · Modals · Navigation bars
- Avoid on: Plain backgrounds · Large surfaces

**Prompt**

Add frosted glass to [the cards or panels you want to style]. Give each card a see-through tinted background, blur whatever sits behind it, and add a thin light edge. Put colorful shapes that drift slowly behind the cards, with a faint pattern of dots over them, because glass over plain color looks gray and shows no frost. Put a see-through dark layer inside each card under its text so the words stay readable. A card can also breathe, its blur growing and fading, or slowly change its tint. Blurring costs a lot, so keep the glass to small cards and blur the shapes less on phones. If the visitor has reduced motion turned on, keep everything still. Match the settings listed below.

**Settings** (the defaults in bold):

- Frost: Off · Light · **Medium** · Heavy
- Tint strength: Faint · **Medium** · Strong
- Speed: Slow · **Normal** · Fast
- Tint color: Pink · White · **Blue** · Purple · Green · Orange
- Breathing frost: **on** · off
- Shifting tint: **on** · off

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Frost: Medium, Tint strength: Medium, Speed: Normal, Tint color: Blue, Breathing frost: on, Shifting tint: on.

## WebGL Shader Animation

Moving color patterns computed for every pixel. Best for bold backgrounds.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/webgl-shader-animation/
- How it runs: moves by itself
- Good for: Hero backgrounds · Music and events · Loading screens · Art pages
- Avoid on: Behind text · Low-power devices

**Prompt**

Add a moving shader pattern to [the background or section you want it in]. Cover the area with one WebGL surface and write a fragment shader that works out the color of every pixel from its position and the time, so the whole pattern moves as the time runs on: flowing plasma, rippling waves, cells or a kaleidoscope. When the settings include it, let the pointer, or a finger on touch screens, bend the pattern near it. Draw fewer pixels on phones, and show a clear message where WebGL is not available. If the visitor has reduced motion turned on, show one still frame. Match the settings listed below.

**Settings** (the defaults in bold):

- Pattern: **Plasma** · Waves · Cells · Kaleidoscope
- Speed: Slow · **Normal** · Fast
- Reacts to the pointer: on · **off**

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Pattern: Plasma, Speed: Normal, Reacts to the pointer: off.

## Noise-Based Motion

Smooth noise makes dots sway and a blob ripple. Best for calm backgrounds.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/noise-based-motion/
- How it runs: moves by itself
- Good for: Backgrounds · Generative art · Idle and loading states
- Avoid on: Behind text · Fast-paced screens

**Prompt**

Add noise-based motion to [the background or shape you want to bring to life]. Use smooth noise, a random value that changes gradually from place to place, instead of plain random numbers, which jump. For a field of dots, turn the noise at each dot into a direction and nudge the dot that way, then move through the noise over time so the whole field sways like grass in the wind. For a blob, push each point of its outline in or out by the noise so the edge ripples. Space the dots by distance, not by count, so phones draw fewer. If the visitor has reduced motion turned on, keep everything still. Match the settings listed below.

**Settings** (the defaults in bold):

- Shape: **Field of dots** · Blob
- Pattern size: Large · **Medium** · Small
- Speed: Slow · **Normal** · Fast
- Wobble: Small · **Medium** · Large
- Space between dots: Wide · **Medium** · Tight
- Color: Pink · White · **Blue** · Purple · Green · Orange

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Shape: Field of dots, Pattern size: Medium, Speed: Normal, Wobble: Medium, Space between dots: Medium, Color: Blue.

## SVG Path Animation

A line drawing draws itself, stroke by stroke. Best for icons and logos.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/svg-path-animation/
- How it runs: plays once
- Good for: Icons · Logos · Signatures · Illustrations
- Avoid on: Photos · Body text

**Prompt**

Add a self-drawing line to [your icon, logo or signature, drawn as SVG lines]. Measure the length of each line, hide it behind a dash exactly as long as the line, then slide the dash away so the line appears from one end to the other, as if drawn by hand. Draw several lines one after another, each starting a little after the one before. When the settings include it, fill the shapes once the lines are done. The finished drawing should be there for screen readers from the start. If the visitor has reduced motion turned on, show the drawing complete. Match the settings listed below.

**Settings** (the defaults in bold):

- Drawing: **Icon** · Signature · Logo
- Speed: Slow · **Normal** · Fast
- Line thickness: Thin · **Medium** · Thick
- Feel: **Smooth** · Gentle · Even
- Line color: Pink · White · **Blue** · Purple · Green · Orange
- Starts from the other end: on · **off**
- Fills in at the end: on · **off**

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Drawing: Icon, Speed: Normal, Line thickness: Medium, Feel: Smooth, Line color: Blue, Starts from the other end: off, Fills in at the end: off.

## Chromatic Aberration

A word splits into red, green and blue fringes. Best for bold titles.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/chromatic-aberration/
- How it runs: moves by itself
- Good for: Bold titles · Music and games · Error pages
- Avoid on: Body text · Light backgrounds

**Prompt**

Add a chromatic aberration effect to [your headline or short word]. Stack three copies of the text in pure red, green and blue, blend them so that where they overlap they add up to white, and shift the red and blue copies in opposite directions so colored fringes appear at the letters' edges, like a cheap camera lens. The split can breathe in and out, or jump now and then like a glitch. It only works on a dark background. Screen readers should read the text once, not three times. If the visitor has reduced motion turned on, keep the copies still. Match the settings listed below.

**Settings** (the defaults in bold):

- Movement: **Pulse** · Glitch · None
- Color split: Small · **Medium** · Large
- Direction: Sideways · **Slanted** · Up and down
- Soft color edges: on · **off**
- Your text: text field, starts as "PRISM"

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Movement: Pulse, Color split: Medium, Direction: Slanted, Soft color edges: off, Your text: "PRISM".

## 2.5D / Pseudo-3D

Flat layers slide by different amounts, faking depth. Best for hero scenes.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/2-5d-pseudo-3d/
- How it runs: reacts to the visitor
- Good for: Hero scenes · Illustrations · Game sites · Landing pages
- Avoid on: Photos · Content-heavy pages

**Prompt**

Add a 2.5D parallax scene to [the illustration or hero you want to give depth]. Split the picture into flat layers, from a far sky to the near ground, and when the pointer moves, shift every layer the opposite way by an amount that grows with how near it is: the sky barely moves and the ground moves the most, so the flat picture seems deep. Make each layer a little wider than the frame so no edge shows. On touch screens, dragging a finger should move the scene the same way. If the visitor has reduced motion turned on, keep the layers still. Match the settings listed below.

**Settings** (the defaults in bold):

- Camera movement: Small · **Medium** · Large
- Layer labels: on · **off**

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Camera movement: Medium, Layer labels: off.

## Ray Marching / SDF Scene

A 3D scene drawn only from formulas, circled by a camera. Best for art pages.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/ray-marching-sdf/
- How it runs: moves by itself
- Good for: Art pages · Hero visuals · Tech demos
- Avoid on: Behind text · Low-power devices

**Prompt**

Add a ray-marched 3D scene to [the section you want it in]. Draw the whole scene in a fragment shader, with no 3D models: describe each shape as a formula that gives the distance to its surface, then for every pixel step a ray forward by that distance until it touches a surface, and light that point. Formulas let shapes melt together, be carved out of each other or repeat without end, while a camera circles them. Every pixel does a lot of work, so draw fewer pixels and take fewer steps on phones. If the visitor has reduced motion turned on, show one still frame. Match the settings listed below.

**Settings** (the defaults in bold):

- Scene: **Blend** · Cut-out · Endless
- Camera speed: Slow · **Normal** · Fast
- Soft shadows: on · **off**
- Corner shading: **on** · off
- Detail: Low · **Medium** · High
- Step count view: on · **off**

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Scene: Blend, Camera speed: Normal, Soft shadows: off, Corner shading: on, Detail: Medium, Step count view: off.

## GPGPU Particle System

Tens of thousands of particles flow on the graphics chip. Best for hero effects.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/gpgpu-particle-system/
- How it runs: moves by itself
- Good for: Hero effects · Data art · Launch pages
- Avoid on: Behind text · Low-power devices

**Prompt**

Add a GPU particle system to [the section you want it in]. Keep every particle's position and speed in a floating-point texture, one pixel per particle, and move them all at once in a shader that reads one texture and writes the other, swapping them after each pass, one pass per 60th of a second so it runs at the same speed on every screen. Then draw each particle as a tiny point, following a flowing field, a swirl, a pull to the middle or an orbit. That keeps tens of thousands of particles smooth. Start with far fewer on phones, and show a clear message where WebGL 2 is missing. If the visitor has reduced motion turned on, show one still frame. Match the settings listed below.

**Settings** (the defaults in bold):

- Movement: **Flow** · Swirl · Attract · Orbit
- Number of particles: 16,000 · **65,000** · 100,000 (phones start with 16,000)
- Speed: Slow · **Normal** · Fast
- Color: **One color** · By speed · Shifting
- Trails: on · **off**

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Movement: Flow, Number of particles: 65,000, Speed: Normal, Color: One color, Trails: off.

## Image Distortion on Hover

The picture ripples and bends around your pointer. Best for portfolio images.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/image-distortion-hover/
- How it runs: reacts to the visitor
- Good for: Portfolio images · Gallery tiles · Hero images · Product photos
- Avoid on: Small thumbnails · Images with text

**Prompt**

Add a hover distortion to [the image you want to react]. Draw the image with a WebGL shader and, in a circle around the pointer, read each pixel from a slightly shifted spot, so the picture seems to ripple, bulge, swirl like liquid or break into squares there while the image itself never changes. The bending fades out smoothly after the pointer leaves. On touch screens, dragging a finger across the image should do the same. If the visitor has reduced motion turned on, keep the image still. Match the settings listed below.

**Settings** (the defaults in bold):

- Effect: **Ripple** · Push · Liquid · Pixels
- Strength: Gentle · **Medium** · Strong
- Size: Small · **Medium** · Large
- Fade-out speed: Slow · **Normal** · Fast
- Moving ripples: **on** · off

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Effect: Ripple, Strength: Medium, Size: Medium, Fade-out speed: Normal, Moving ripples: on.

## Cloth / Soft-Body Simulation

A cloth sways in the wind, and you can drag it around. Best for playful pages.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/cloth-simulation/
- How it runs: moves by itself
- Good for: Flags and banners · Playful pages · Fashion and textiles
- Avoid on: Behind text · Serious content

**Prompt**

Add a cloth simulation to [the flag, banner or fabric you want to show]. Model the cloth as a grid of points joined to their neighbors by links of fixed length. In fixed 1/60 s steps, as many as the time since the last frame needs, move every point by its own momentum plus gravity and wind, then pull linked points back toward their proper distance a few times over, so the cloth moves at the same speed on every screen. Pin some points so the cloth hangs, and let the visitor grab and drag the nearest point with the pointer or a finger. Use a coarser grid on phones. If the visitor has reduced motion turned on, show the cloth hanging still. Match the settings listed below.

**Settings** (the defaults in bold):

- Hangs from: **Two corners** · Top edge · One corner · Nothing
- Wind: Light · **Medium** · Strong
- Stiffness: Stretchy · **Medium** · Stiff
- Gravity: Light · **Normal** · Heavy
- Detail: Low · **Medium** · High (phones start with Low)
- Shows the points: on · **off**

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Hangs from: Two corners, Wind: Medium, Stiffness: Medium, Gravity: Normal, Detail: Medium, Shows the points: off.

## Volumetric Smoke / 3D Noise

Soft smoke curls upward, drawn as a real 3D cloud. Best for moody backgrounds.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/volumetric-smoke/
- How it runs: moves by itself
- Good for: Moody backgrounds · Title cards · Games · Sci-fi themes
- Avoid on: Behind text · Low-power devices

**Prompt**

Add volumetric smoke to [the section you want it in]. In a fragment shader, send a ray through a 3D cloud of smooth noise for every pixel and add up how much smoke it passes through, shading each step by how much smoke lies between it and the light, so the plume looks soft, deep and lit from one side. Move the noise upward over time so the smoke rises and curls, and let it drift sideways when the settings include wind. It is costly, so draw fewer pixels and take fewer steps on phones. If the visitor has reduced motion turned on, show the smoke still. Match the settings listed below.

**Settings** (the defaults in bold):

- Thickness: Thin · **Medium** · Thick
- Speed: Slow · **Normal** · Fast
- Detail: Low · **Medium** · High
- Smoke color: **Gray blue** · White · Purple · Orange
- Wind: **on** · off
- Fine grain: **on** · off

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Thickness: Medium, Speed: Normal, Detail: Medium, Smoke color: Gray blue, Wind: on, Fine grain: on.

## Morphing Blob

Blobs melt together, and one drop chases your pointer. Best for hero sections.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/morphing-blob/
- How it runs: moves by itself
- Good for: Hero sections · Playful brands · Loading states · Cursor effects
- Avoid on: Serious content · Busy layouts

**Prompt**

Add a gooey blob to [the section you want it in]. Draw several plain circles that drift on looping paths, and run them through a filter that blurs them and then sharpens the blurred edge again, so circles that come close melt into one liquid shape and pull apart again. One drop follows the pointer, or a finger on touch screens, and merges with the rest when it comes near. Keep the blurred area small on phones. If the visitor has reduced motion turned on, show the blob still. Match the settings listed below.

**Settings** (the defaults in bold):

- Gooeyness: Low · **Medium** · High
- Number of blobs: Few · **Medium** · Many
- Speed: Slow · **Normal** · Fast

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Gooeyness: Medium, Number of blobs: Medium, Speed: Normal.

## 3D Flip Card

A card turns over in 3D to show its back. Best for profile and product cards.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/flip-card-3d/
- How it runs: reacts to the visitor
- Good for: Profile cards · Product cards · Flashcards · Quiz answers
- Avoid on: Long text · Key information

**Prompt**

Add a 3D flip to [the card you want to turn over]. Place the front and back faces in the same spot, turn the back face around so it faces away, and hide whichever face points away from the viewer. Clicking, tapping or pressing Enter turns the card over in 3D to show its back, and again to show its front. Give the card's container a 3D perspective so the turn has depth. When the settings include it, pointing at the card can flip it too, and the card can lean toward a hovering pointer. If the visitor has reduced motion turned on, swap the faces with a quick fade instead of turning. Match the settings listed below.

**Settings** (the defaults in bold):

- Flip direction: **Sideways** · Up and over
- Speed: Slow · **Normal** · Fast
- 3D depth: Subtle · **Medium** · Strong
- Flips on hover: on · **off**
- Tilt toward the pointer: Off · **Gentle** · Strong

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Flip direction: Sideways, Speed: Normal, 3D depth: Medium, Flips on hover: off, Tilt toward the pointer: Gentle.

## 3D Carousel

Cards stand in a ring that spins in 3D as you drag it. Best for image galleries.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/carousel-3d/
- How it runs: reacts to the visitor
- Good for: Image galleries · Product picks · Portfolios · Album covers
- Avoid on: Long lists · Text-heavy cards

**Prompt**

Add a 3D carousel to [the cards or pictures you want to show]. Stand the cards in a ring: turn each one by an equal share of a full circle, push it out from the middle by the same distance, and give the container a 3D perspective. Dragging sideways turns the whole ring with the pointer or finger; on release it keeps a little speed, then settles with the nearest card facing front. Previous and next buttons and the arrow keys turn it one card at a time. Change only the ring's rotation so it stays smooth. When the settings include it, the ring turns slowly by itself. If the visitor has reduced motion turned on, jump from card to card without turning. Match the settings listed below.

**Settings** (the defaults in bold):

- Number of cards: 6 · **8** · 12
- Seen from above: **on** · off
- Spins by itself: on · **off**

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Number of cards: 8, Seen from above: on, Spins by itself: off.

## Depth-Map Photo

A flat photo turns 3D as you point: near parts shift more. Best for hero images.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/depth-map-photo/
- How it runs: reacts to the visitor
- Good for: Hero images · Portfolio photos · Travel stories · Album art
- Avoid on: Photos with text · Small thumbnails

**Prompt**

Add a depth effect to [the photo you want to bring to life]. Make a grayscale depth map the same size as the photo, white for near parts and black for far ones, and blur it slightly. Draw the photo with a WebGL shader that reads each pixel from a spot shifted by the pointer's position times that pixel's depth, so near parts move more than far ones and the flat photo looks three-dimensional. Zoom in a little so the edges never show, and let the view glide toward the pointer and back to the middle when it leaves. On touch screens, dragging a finger should do the same. If the visitor has reduced motion turned on, keep the photo still. Match the settings listed below.

**Settings** (the defaults in bold):

- Depth strength: Subtle · **Medium** · Strong
- Shows the depth map: on · **off**

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Depth strength: Medium, Shows the depth map: off.

## Flocking

Birds swirl and turn together as one flock. Best for calm backgrounds.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/flocking/
- How it runs: moves by itself
- Good for: Hero sections · Nature and travel sites · Art and game pages · Dark backgrounds
- Avoid on: Long reading pages · Busy layouts

**Prompt**

Add a flock of birds to [the section you want it behind]. Draw each bird as a small arrowhead on a canvas, pointing the way it flies. Each bird sees only the birds near it and follows three rules: keep a little room from the closest ones, turn the way its neighbors fly, and drift toward their middle, so the flock swirls and turns as one. Turn birds back before they reach the edges, and move them by the time since the last frame so the speed is the same on every screen. Use fewer birds on phones. When the settings include it, birds swerve away from the pointer or a finger. If the visitor has reduced motion turned on, show the flock still. Match the settings listed below.

**Settings** (the defaults in bold):

- Flock size: Small · **Medium** · Large
- How close they fly: Loose · **Normal** · Tight
- Flees the pointer: **on** · off
- Speed: Slow · **Normal** · Fast
- Shows one bird's view: on · **off**

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Flock size: Medium, How close they fly: Normal, Flees the pointer: on, Speed: Normal, Shows one bird's view: off.

## ASCII / Halftone

A moving picture is redrawn with letters or dots. Best for retro and tech looks.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/ascii-halftone/
- How it runs: moves by itself
- Good for: Retro and tech sites · Music and game pages · Hero images · Portfolio headers
- Avoid on: Photos people must see clearly · Long reading pages

**Prompt**

Add an ASCII and halftone effect to [the picture or video you want to restyle]. Each frame, draw the picture onto a small hidden canvas with one pixel for every cell of a grid, and read back each pixel's brightness. On the visible canvas, draw a character in every cell, choosing characters with more ink for brighter cells, or draw a dot whose size grows with the brightness, like a printed photo. Color the marks with the picture's own colors or with one color. Copy the characters from a ready-made sheet instead of drawing each character separately every frame, so it stays smooth, and use bigger cells on phones. If the visitor has reduced motion turned on, show one still frame. Match the settings listed below.

**Settings** (the defaults in bold):

- Drawn with: **Letters** · Dots
- Cell size: Small · **Medium** · Large
- Colors: **One color** · Full color
- Shows the original picture: on · **off**
- Light paper: on · **off**

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Drawn with: Letters, Cell size: Medium, Colors: One color, Shows the original picture: off, Light paper: off.

## 2D Physics

Balls drop where you click, bounce and pile up. Best for playful intros.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/physics-2d/
- How it runs: reacts to the visitor
- Good for: Playful intros · Empty states · Games and toys · Kids' and learning sites
- Avoid on: Forms and checkout · Serious content

**Prompt**

Add a box of bouncing balls to [the hero or empty area you want to liven up]. A click or tap drops a ball there; it falls, bounces off the walls and each other, and comes to rest in a pile. Dragging a ball with the pointer or a finger picks it up, and letting go throws it at the speed of the drag. Run the physics in fixed steps, as many as the time since the last frame needs, so it behaves the same on every screen, and stop drawing once everything is still. Fade out the oldest ball when there are too many. If the visitor has reduced motion turned on, show each new ball already resting where it would land. Match the settings listed below.

**Settings** (the defaults in bold):

- Gravity: Moon · **Earth** · Heavy
- Bounciness: Low · **Medium** · High
- Ball sizes: **All the same** · Mixed
- Shows the speed: on · **off**

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Gravity: Earth, Bounciness: Medium, Ball sizes: All the same, Shows the speed: off.

## Liquid Glass

Drag a glass panel and the picture behind it bends at the edges. Best for cards.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/liquid-glass/
- How it runs: reacts to the visitor
- Good for: Floating menus · Cards over photos · Tab bars · Media controls
- Avoid on: Long text · Plain backgrounds

**Prompt**

Add a liquid glass panel to [the card or menu you want to float over a picture]. The panel shows what is behind it bent and magnified near its rounded edges, like thick curved glass, with a soft highlight along the rim. Bend it with an SVG displacement filter applied to what is behind the panel, which Chromium browsers support; other browsers get blurred, tinted glass with the same highlight. Dragging with the pointer or a finger moves it, and so do the arrow keys; it stretches a little as it moves and wobbles back when it stops. Use transforms only, so it stays smooth. If the visitor has reduced motion turned on, let it jump instead of gliding, with no stretch or wobble. Match the settings listed below.

**Settings** (the defaults in bold):

- How much it bends: Subtle · **Medium** · Strong
- Frost: **Clear** · Light · Frosted
- Tint: Pink · **White** · Blue · Purple · Green · Orange
- Shape: **Card** · Pill · Circle
- Shows the bend map: on · **off**

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: How much it bends: Medium, Frost: Clear, Tint: White, Shape: Card, Shows the bend map: off.

## Holographic Card

A card tilts as you point, and its rainbow foil shimmers. Best for collectibles.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/holographic-card/
- How it runs: reacts to the visitor
- Good for: Trading cards · Membership cards · Rewards and badges · Product launches
- Avoid on: Text-heavy cards · Dense grids

**Prompt**

Add a holographic foil to [the card you want to make shine]. Build the card from stacked layers: its picture, a rainbow sheet blended over it to light up the colors beneath, a spot of glare when the settings include one, and on top the text on solid panels so it stays readable. As the pointer moves over the card, tilt the card toward it in 3D, slide the foil with the tilt and keep any glare under the pointer. Ease each change, and move layers only by position and transparency so it stays smooth. On touch screens, dragging a finger does the same. If the visitor has reduced motion turned on, keep the card flat and the foil still, and only brighten it. Match the settings listed below.

**Settings** (the defaults in bold):

- Foil pattern: **Smooth** · Glitter · Lines
- How far it tilts: Gentle · **Medium** · Strong
- Glare: Off · **Soft** · Bright
- Shows the layers: on · **off**

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Foil pattern: Smooth, How far it tilts: Medium, Glare: Soft, Shows the layers: off.

## Infinite Zoom

The view keeps zooming into pictures inside pictures. Best for page intros.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/infinite-zoom/
- How it runs: moves by itself
- Good for: Page intros · Portfolios and galleries · Story and game sites · Music and art pages
- Avoid on: Long reading pages · Forms and checkout

**Prompt**

Add an infinite zoom to [the section you want it in]. Give each picture, such as [a painting, a screen or a photo], a frame in its middle, the same shape as the view, that holds a smaller copy of the next picture, so the pictures nest inside each other. Move the view steadily into or out of the middle, growing or shrinking every picture by the same factor each second so the speed feels even. Each time a picture exactly fills the view, draw it as the outermost one, so the loop never jumps. Draw only the pictures big enough to see, and keep them sharp at full size. If the visitor has reduced motion turned on, show one still frame. Match the settings listed below.

**Settings** (the defaults in bold):

- Speed: Slow · **Normal** · Fast
- Number of scenes: 1 · 3 · **5**
- Direction: **In** · Out
- Shows the scene edges: on · **off**

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Speed: Normal, Number of scenes: 5, Direction: In, Shows the scene edges: off.
