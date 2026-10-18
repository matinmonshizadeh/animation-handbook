# 07 · Ambient & Background

Passive, looping effects that hold visual interest without demanding attention — gradients, particles, grain, and glows. 25 animations from Animation Handbook, in the home page's order. Each entry gives the live demo, how it runs, what it is good for and what to avoid it on, the prompt from its page word for word, and its settings with what each does and the demo's values.

## Contents

- [Animated Gradient Background](#animated-gradient-background)
- [Mesh Gradient Animation](#mesh-gradient-animation)
- [Aurora / Northern Lights](#aurora--northern-lights)
- [Grain / Film Noise Overlay](#grain--film-noise-overlay)
- [Scanline Effect](#scanline-effect)
- [Light Leak](#light-leak)
- [Starfield / Space Particles](#starfield--space-particles)
- [Breathing / Pulsing Glow](#breathing--pulsing-glow)
- [Ambient Ripple Effect](#ambient-ripple-effect)
- [Floating Elements](#floating-elements)
- [Grid / Dot Pattern Parallax](#grid--dot-pattern-parallax)
- [Abstract Geometric Motion](#abstract-geometric-motion)
- [Particle Constellation](#particle-constellation)
- [Flow Field](#flow-field)
- [Synthwave Grid](#synthwave-grid)
- [Matrix Rain](#matrix-rain)
- [Plasma Field](#plasma-field)
- [Wave Layers](#wave-layers)
- [Snow / Rain](#snow--rain)
- [Fireworks](#fireworks)
- [Topographic Lines](#topographic-lines)
- [Light Rays](#light-rays)
- [Game of Life](#game-of-life)
- [Ken Burns Effect](#ken-burns-effect)
- [Fire Effect](#fire-effect)

## Animated Gradient Background

Colors slowly drift across a soft gradient background. Best for hero sections.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/animated-gradient-background/
- How it runs: moves by itself
- Good for: Hero sections · Landing pages · Dashboards · Splash screens
- Avoid on: Long reading pages · Small elements

**Prompt**

Add an animated gradient background to [the section you want behind your content]. Paint a soft gradient much larger than the section and slowly slide it back and forth, or turn all its colors around the color wheel, so the colors keep shifting behind the content. End the gradient on the color it starts with, so the loop never shows a seam. A long, slow cycle feels calm; a fast one pulls attention away from the content. If the visitor has reduced motion turned on, show the gradient still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Gradient: **Sliding** · Color wheel · Bright bands. Sliding moves a large, soft gradient (four times the box's width and height) back and forth; Color wheel turns every color around the color wheel; Bright bands slides brighter colors between dark ends (three times the box's width and height), one and a half times as slowly.
- Speed: Slow · **Normal** · Fast. How long one cycle takes: slow is 32s, normal 20s and fast 12s; under 8s it becomes distracting.
- Colors: **Cool** · Sunset · Ocean · Gray. The colors the gradient moves through: cool blues and purples, sunset oranges, ocean blues and greens, or grays.
- Muted colors: on · **off**. Takes most of the color out (30% saturation) for a quieter background.

## Mesh Gradient Animation

Blurred blobs of color drift and melt together. Best for landing pages.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/mesh-gradient/
- How it runs: moves by itself
- Good for: Hero sections · Landing pages · App splash screens · Dark dashboards
- Avoid on: Small elements · Long reading pages

**Prompt**

Add a mesh gradient background to [the section you want behind your content]. Place a few large circles of color behind the content and blur them, so their edges soften and the colors run into one another. Let each circle drift and grow or shrink slowly on its own path, so the colors keep blending in new ways, and clip them to the section so they never spill out. Blur is costly on phones, so blur less on small screens. If the visitor has reduced motion turned on, keep the circles still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Blur: Light · **Medium** · Heavy. How much the blobs are blurred: light is 50px, medium 80px and heavy 130px; below about 80px the circles show, above it they become a wash. Screens up to 600px wide use half.
- Speed: Slow · **Normal** · Fast. How long a blob takes to drift one way: slow is 64s, normal 40s and fast 24s, and each blob takes 0.8 to 1.2 times that.
- Colors: **Cool** · Warm · Sunset · Synthwave · Earth. The blob colors: cool, warm, sunset, synthwave or earth tones.
- Number of blobs: 3 · **4** · 5. Three, four or five blobs; more make a richer mix.
- Blend: **Plain** · Lighter · Deeper. How overlapping blobs mix: plain stacks them (normal blending), lighter brightens the overlap (screen), deeper darkens it and deepens the colors (overlay).

## Aurora / Northern Lights

Blurred bands of light sway like the northern lights. Best for dark backgrounds.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/aurora/
- How it runs: moves by itself
- Good for: Hero sections · Night and space themes · Music and meditation apps · Travel sites
- Avoid on: Light pages · Busy layouts

**Prompt**

Add an aurora background to [the dark section you want it behind]. Stack a few tall, wide bands of color that fade to transparent at the top and bottom, blur them softly, and let each one sway sideways and lean a little on its own slow cycle, so they drift apart and together like curtains of light. Make the bands wider than the section and clip them, so their ends never show. Blur less on phones to keep it smooth. If the visitor has reduced motion turned on, keep the bands still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Number of bands: **2** · 3 · 4 · 5. How many bands of light: two look clear, five make a richer, layered sky.
- Speed: Slow · **Normal** · Fast. How long the bands take to sway through their cycle: slow is 48s, normal 30s and fast 18s for the green band; blue takes 1.15 times as long, purple 0.85, pink 1.25 and red 1.1, so the bands drift in and out of step.
- Colors: **Green** · Purple · Red. Which colors come first: green and blue (the most common aurora), purple and pink, or red and pink (rare); more bands add the other colors.
- Brightness: Dim · **Medium** · Bright. How strongly the bands glow: dim is 50%, medium 75% and bright 100%.
- Stars in the sky: on · **off**. Adds 120 twinkling stars behind the bands.

## Grain / Film Noise Overlay

Fine grain flickers over the page, like old film. Best for editorial sites.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/grain-overlay/
- How it runs: moves by itself
- Good for: Editorial sites · Portfolios · Photo and film pages · Hero sections
- Avoid on: Small text · Forms

**Prompt**

Add a film grain overlay to [the section or page you want to texture]. Cover it with a see-through layer of random light and dark dots, and draw a new set of dots again and again so the grain flickers like old film; grain works best when it is felt more than seen. Blend the layer into the picture beneath it instead of laying gray on top, and let clicks pass through it. Redraw less often on phones, where drawing every dot is the costly part. If the visitor has reduced motion turned on, show the grain still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Strength: Faint · **Light** · Strong. How visible the grain is: faint is 4%, light 8% and strong 16%; 5–10% is felt more than seen, above 20% it looks like a damaged screen.
- Grain size: Fine · **Medium** · Coarse. The size of each dot: fine is 1px, medium 2px and coarse 3px; coarse looks like old film stock.
- How often it changes: Every frame · **Like film** · Choppy · Slow. New grain every frame (60 times a second), like film (24), choppy (12) or slow (4); phones change it at most 24 times a second.
- Blend: **Film** · Lighter · Softer. How the grain mixes with the picture: film darkens dark areas and lightens light ones, like real grain (overlay blending); lighter only lightens (screen); softer is a gentler film (soft light).
- Colored grain: on · **off**. Randomly colored dots instead of gray ones.
- Grain source: **Random dots** · Noise filter. Dots drawn by a script, or the browser's own noise filter; grain size and colored grain apply to the dots only.

## Scanline Effect

Dark lines and a sweeping beam imitate an old TV screen. Best for retro sites.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/scanline/
- How it runs: moves by itself
- Good for: Retro and gaming sites · Terminal screens · Music players · Sci-fi interfaces
- Avoid on: Long reading · Forms

**Prompt**

Add a scanline effect to [the screen, panel or section you want to look like an old monitor]. Lay thin, dark horizontal lines over the content with a repeating stripe pattern, in a layer that clicks pass through, so it looks like the rows of an old tube screen. When the settings include them, sweep a soft band of light slowly down the screen again and again, darken the corners like curved glass, and give the text a soft glow. Make sure the text stays readable through the lines. If the visitor has reduced motion turned on, keep the beam still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Line spacing: Tight · **Medium** · Wide. The distance between lines: tight is 2px, medium 4px and wide 8px, each line 1px thick; 4px looks like a standard old screen.
- Line darkness: Light · **Medium** · Dark. How dark the lines are: light is 8% black, medium 15% and dark 30%; darker looks more retro but lowers contrast.
- Moving beam: **on** · off. A soft band of light sweeps down the screen, again and again.
- Beam speed: Slow · **Normal** · Fast. How long the beam takes to cross the screen: slow is 6.4s, normal 4s and fast 2.4s.
- Beam brightness: Faint · **Medium** · Bright. How bright the beam is: faint is 6% white, medium 12% and bright 24% along the middle of the 120px band, fading to nothing at its top and bottom; it should be felt more than seen.
- Dark corners: on · **off**. A soft vignette darkens the corners, like the curved glass of an old screen.
- Glowing text: on · **off**. A soft glow around the letters, like light spreading on an old screen.

## Light Leak

Warm light washes in from a corner at random times. Best for photo sites.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/light-leak/
- How it runs: moves by itself
- Good for: Photo and film sites · Portfolios · Music pages · Lifestyle brands
- Avoid on: Dashboards · Long reading pages

**Prompt**

Add a light leak effect to [the photo, video or section you want it over]. Place a soft glow of light, classically warm amber, spilling in from one corner or down the middle, in a see-through layer that clicks pass through, and fade it in and out every so often, like stray light reaching the film in an old camera. Make the gaps between leaks random and vary each leak's strength a little, because evenly timed leaks look fake. Keep each leak soft, so it never looks like a flash. If the visitor has reduced motion turned on, keep the glow still and faint. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Comes from: **Top left** · Top right · Bottom left · Bottom right · Down the middle. The corner the glow spills in from, or a band of light down the middle.
- Time between leaks: Short · **Medium** · Long. The random dark gap between one leak and the next: short is 0.5–1.5s, medium 1–3s and long 3–8s.
- Speed: Slow · **Normal** · Fast. How long each leak takes to fade in, and again to fade out: slow is 2s, normal 1.2s and fast 0.7s.
- Brightness: Dim · **Medium** · Bright. How strong the glow gets: dim is 30%, medium 55% and bright 80%; each leak peaks at a random 75% to 100% of this.
- Color: **Amber** · Gold · Rose · Magenta · Cyan. Amber is the classic leak; gold, rose and magenta are warm too, and cyan looks like a cooler film stock.
- Floating light spots: on · **off**. Three soft spots of light drift up from the bottom and fade with each leak.

## Starfield / Space Particles

Stars stream toward you out of the dark. Best for space themes.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/starfield/
- How it runs: moves by itself
- Good for: Space and science themes · Hero sections · Screensavers and kiosks · Launch pages
- Avoid on: Light pages · Long reading pages

**Prompt**

Add a starfield background to [the dark section you want it behind]. Draw many small stars on a canvas and move them out from the center, or sideways past the viewer, so it feels like flying through space. Tie each star's size, brightness and speed to its distance from the center: small, dim and slow near the middle, bigger, brighter and faster toward the edge, which is what creates the depth. A slow speed keeps it calm. Draw fewer stars on phones. If the visitor has reduced motion turned on, show the stars still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Direction: **Outward** · Sideways. Outward streams the stars from the center; sideways drifts them past, the nearer ones faster.
- Speed: Slow · **Normal** · Fast. How fast the stars move: outward, a star near the edge covers 16, 25 and 41 pixels a second at slow, normal and fast, and a little under a third of that near the center; sideways, the nearest stars cover 30, 48 and 78 pixels a second and the farthest a fifth of that; keep it slow for a calm background.
- Number of stars: Few · **Medium** · Many. Few is 150, medium 300 and many 600; phones show at most 300.
- Star color: **White** · Warm white · Many colors. White, a warm white, or a different pale tint for each star, from pink to yellow.
- Twinkling: **on** · off. Each star gently brightens and dims on its own rhythm.
- Nebula haze: on · **off**. A faint purple and blue haze behind the stars adds depth.

## Breathing / Pulsing Glow

A soft glow slowly grows and shrinks, like calm breathing. Best for idle states.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/breathing-glow/
- How it runs: moves by itself
- Good for: Idle states · Voice assistants · Meditation apps · Media players
- Avoid on: Alerts · Busy screens

**Prompt**

Add a breathing glow behind [the icon or element that should look alive but at rest]. Place a soft, round, blurred glow of color behind it, and make it slowly grow and brighten, then shrink and dim, over and over, easing gently at both ends like a calm breath. Four to six seconds a breath feels relaxed; much faster feels anxious. When the settings include it, let the element itself swell very slightly with the glow. If the visitor has reduced motion turned on, keep the glow still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. How long one breath takes: slow is 8s, normal 5s and fast 3s; 4 to 6 seconds feels relaxed, 2 seconds anxious.
- How much it grows: A little · **Medium** · A lot. How far the glow shrinks and grows: a little is 80% to 120% of its size, medium 60% to 150% and a lot 45% to 180%.
- Glow color: Pink · **Blue** · Purple · Green · Orange. The color of the glow: pink, blue, purple, green or orange (white would hide the white title at the breath's peak).
- Glow size: Small · **Medium** · Large. The glow's size before it grows: small is 180px, medium 260px and large 340px.
- Second glow: on · **off**. A larger, softer glow behind the first, 1.5 times its size and about as bright: it brightens and dims through the same range as the first, over a cycle 1.3 times as long, so the two drift in and out of step.
- Icon and title breathe too: **on** · off. The icon and the title under it swell by 2% with each breath, too little to notice consciously.

## Ambient Ripple Effect

Rings spread from a few spots, like drops on a still pond. Best for hero areas.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/ambient-ripple/
- How it runs: moves by itself
- Good for: Hero sections · Live and connected states · Maps and places · Meditation apps
- Avoid on: Buttons · Alerts

**Prompt**

Add an ambient ripple background to [the section or status you want to feel alive]. Pick a few spots and let each one send out a ring every so often that grows from nothing and gets fainter as it spreads until it disappears, so several rings overlap like drops on a still pond. It runs by itself, never on clicks. When the settings ask for uneven timing, vary the gaps slightly, because perfectly regular rings feel like a clock. If the visitor has reduced motion turned on, show a few still rings. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. How long each ring takes to spread and fade: slow is 4s, normal 2.5s and fast 1.5s.
- Time between ripples: Short · **Medium** · Long. How often each spot sends out a ring: short is every 1.8s, medium 3s and long 5s.
- Ripple size: Small · **Medium** · Large. How far each ring spreads: small is 100px, medium 160px and large 250px; big rings look calmer with a slow speed.
- Number of sources: 1 · **3** · 5. One spot feels focused; three spread across the stage; five feel like rain on water.
- Ring thickness: Thin · **Medium** · Thick. The width of each ring: thin is 1px, medium 1.5px and thick 3px.
- Ring color: Pink · White · **Blue** · Purple · Green · Orange. The color of the rings.
- Uneven timing: **on** · off. Each gap is up to 40% longer or shorter, at random, so the rings never tick like a clock.
- Sources drift: on · **off**. The spots slowly wander around the stage.

## Floating Elements

Small shapes drift slowly, each on its own path. Best for hero backgrounds.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/floating-elements/
- How it runs: moves by itself
- Good for: Hero backgrounds · Landing pages · Onboarding screens · Empty states
- Avoid on: Busy layouts · Long reading pages

**Prompt**

Add floating shapes to [the section you want a gentle moving background behind]. Scatter a handful of small, see-through circles, squares or rings, and move each one slowly around its own starting point on a smooth, looping path, giving every shape its own speed, distance and starting point so no two ever move in step. Keep them behind the content and let clicks pass through. When the settings include it, shapes slide away from the pointer, or from a finger on touch screens. If the visitor has reduced motion turned on, keep the shapes still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Number of shapes: Few · **Medium** · Many. Few is 5, medium 8 and many 14; 5 to 12 feels calm, more gets busy.
- Speed: Slow · **Normal** · Fast. How fast the shapes drift: each one sways from side to side and back in 87 to 233 seconds at slow, 52 to 140 at normal and 33 to 87 at fast, and takes 1.4 times as long up and down.
- How far they drift: Short · **Medium** · Long. How far each shape wanders from its place: short is up to 30px, medium 50px and long 90px.
- Shapes: Circles · Squares · Rings · **Mixed**. Circles, squares, rings or a mix.
- Colors: **Cool** · Warm · Gray · Neon. Cool blues and purples, warm oranges and reds, grays, or bright neon.
- Shapes turn: **on** · off. Each shape slowly spins at its own rate as it drifts.
- Fades in and out: **on** · off. Each shape slowly brightens and dims, adding depth.
- Shapes avoid the pointer: on · **off**. Shapes within 120px of the pointer, or of a finger, slide aside.

## Grid / Dot Pattern Parallax

A dot grid shifts gently against your pointer for depth. Best for tech sites.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/grid-dot-pattern-parallax/
- How it runs: moves by itself
- Good for: Tech and developer sites · Hero sections · Dashboards · Portfolios
- Avoid on: Photo backgrounds · Long reading pages

**Prompt**

Add a dot grid parallax background to [the section you want a subtle sense of depth behind]. Tile a faint grid of dots or lines behind the content, a little larger than the section, and shift it slightly in the opposite direction to the pointer, so it seems to sit deeper than the content. Keep the shift to a few percent of the pointer's movement, so it is felt more than seen. On touch screens, let it follow a dragging finger the same way, and when nothing is over it, let it drift slowly by itself. If the visitor has reduced motion turned on, keep the grid still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Pattern: **Dots** · Lines · Dots and lines. A grid of dots, of lines, or both.
- Strength: Subtle · **Medium** · Strong. How far the grid shifts: subtle is 3% of the pointer's movement, medium 5% and strong 10%, and its drift with no pointer scales the same way (up to 2% of the stage's width and 1.5% of its height at medium); under 10% it is felt more than seen.
- Spacing: Tight · **Medium** · Wide. The distance between dots or lines: tight is 20px, medium 28px and wide 44px.
- Pattern color: Pink · White · **Blue** · Purple · Green · Orange. The color of the dots and lines, shown at 25% so they stay faint.
- Second layer: on · **off**. A sparser layer of larger dots shifts half as far, adding real depth between the two.
- Light under the pointer: **on** · off. A faint round glow follows the pointer.

## Abstract Geometric Motion

Shapes turn, spread and flow in a calm, endless pattern. Best for music players.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/abstract-geometric-motion/
- How it runs: moves by itself
- Good for: Music and media players · Screensavers and kiosks · Loading screens · Art pages
- Avoid on: Forms · Long reading pages

**Prompt**

Add an abstract geometric animation to [the section or screen you want a calm moving background in]. Draw simple shapes on a canvas and keep them moving in an endless loop: polygons slowly turning around the center, rings spreading out and fading, slanted bars sliding across, or wavy lines with color flowing along them. Drive everything from one steadily growing time value, so the loop never restarts or jumps. Colors from one family keep it calm. If the visitor has reduced motion turned on, show one still frame. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Pattern: **Polygons** · Rings · Bars · Lines. Turning polygons, rings spreading from the center, sliding bars, or wavy lines with flowing color.
- Speed: Slow · **Normal** · Fast. How fast everything moves: the innermost polygon turns once in about 150 seconds at slow, 87 at normal and 52 at fast (the outer ones faster), the rings spread 42, 72 or 120px a second and the bars slide 3, 9 or 24px a second; avoid fast behind content.
- Number of shapes: Few · **Medium** · Many. How many polygons, bars or lines: few is 3, medium 6 and many 10 (the Lines pattern draws twice as many); on Rings it sets how many colors the rings use.
- Colors: **Cool** · Warm · Neon · Gray. Cool blues, warm ambers, bright neon or grays.
- Thicker lines: on · **off**. Draws the lines 1.5px wide instead of 0.8px, so the shapes stand out more.

## Particle Constellation

Drifting dots link up with lines whenever they come close. Best for tech sites.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/particle-constellation/
- How it runs: moves by itself
- Good for: Tech and data sites · Hero sections · Network and security products · Loading screens
- Avoid on: Busy layouts · Long reading pages

**Prompt**

Add a particle constellation background to [the section you want it behind]. Scatter dots on a canvas, let each drift slowly in its own direction and bounce off the edges, and on every frame join any two dots that are close with a thin line that fades as they move apart, so a network keeps forming and breaking. When the settings include it, let the dots drift toward the pointer, or toward a finger on touch screens. Checking every pair of dots gets slow fast, so use fewer dots on phones. If the visitor has reduced motion turned on, show one still frame. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Number of dots: Few · **Medium** · Many. Few is 50, medium 90 and many 140; phones show at most 60, because every pair of dots is checked each frame.
- Link distance: Short · **Medium** · Long. How close two dots must be to be linked: short is 90px, medium 130px and long 180px; too long and everything links to everything.
- Speed: Slow · **Normal** · Fast. How fast the dots drift: slow is about 8px a second, normal 14px and fast 23px on average, each dot at its own random speed and direction; faster looks agitated.
- Color: **Cyan** · Violet · Mint · Gray. The color of the dots and lines: cyan, violet, mint or gray.
- Dots follow the pointer: **on** · off. Dots near the pointer, or a finger, drift toward it and gather there.

## Flow Field

Particles ride invisible currents, leaving fading trails. Best for art pages.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/flow-field/
- How it runs: moves by itself
- Good for: Art and creative sites · Hero sections · Loading screens · Data art
- Avoid on: Busy layouts · Long reading pages

**Prompt**

Add a flow field background to [the section you want it behind]. Fill a canvas with many particles and give every point a direction that changes smoothly from spot to spot (smooth random noise does this). Each frame, move each particle a small step along the direction under it, scaled by the time since the last frame so it runs at the same speed on every screen. Instead of clearing the canvas, cover it with a see-through dark layer once for every 60th of a second that passes, so each particle leaves a fading trail. Let the directions change slowly over time, and use fewer particles on phones. If the visitor has reduced motion turned on, show one still frame of trails. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Swirl size: Small · **Medium** · Large. How large the currents are: the direction turns over about 20px (small), 34px (medium) or 60px (large); larger looks calm, smaller turbulent.
- Trail length: Short · **Medium** · Long. How long trails linger: short fades 12% every 60th of a second, medium 6% and long 4%; below about 4% trails can leave faint marks that never fade.
- Speed: Slow · **Normal** · Fast. How far each particle moves in a 60th of a second: slow is 0.6px, normal 1px and fast 1.6px (36, 60 and 96px a second).
- Number of particles: Few · **Medium** · Many. Few is 400, medium 900 and many 1,500; phones show at most 500.
- Color: **Mint** · Ember · Ice · Rainbow. Mint, ember or ice, or rainbow, where the color changes across the stage and over time.

## Synthwave Grid

A glowing grid rolls toward you under a striped sun. Best for music and games.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/synthwave-grid/
- How it runs: moves by itself
- Good for: Music and gaming sites · Retro themes · Event pages · Hero sections
- Avoid on: Calm brands · Long reading pages

**Prompt**

Add a synthwave grid to [the section you want a retro scene in]. Draw a purple sky with a striped, glowing sun on the horizon and, below it, a glowing grid floor in perspective: lines that meet at one point on the horizon, crossed by lines that bunch up near the horizon and spread out toward the viewer. Move the cross lines steadily toward the viewer and wrap them around, fading each one in at the horizon, so the floor rolls forward forever with no visible jump. If the visitor has reduced motion turned on, show the scene still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. How fast the floor rolls toward the viewer: slow is 0.6 times normal and fast 1.6 times; at normal a new line leaves the horizon 1.2 times a second, and with medium lines each takes about 13 seconds to reach the bottom edge.
- Number of lines: Few · **Medium** · Many. How many lines the floor has: few is 10 across and 15 toward the horizon, medium 16 and 23, many 24 and 35; more lines make a finer grid.
- Grid color: **Pink** · Cyan · Purple · Orange. The color of the glowing lines: pink, cyan, purple or orange.

## Matrix Rain

Columns of glowing characters rain down a dark screen. Best for tech themes.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/matrix-rain/
- How it runs: moves by itself
- Good for: Tech and hacker themes · Loading screens · Game and event pages · 404 pages
- Avoid on: Calm brands · Long reading pages

**Prompt**

Add a matrix rain background to [the section you want it behind]. Split a dark canvas into columns and, at a steady pace, draw a bright character at the head of each column and move it down one row, sending each column back to the top at random once it passes the bottom. Instead of clearing the canvas, cover it with a see-through black layer before each step, so older characters fade into a trail behind each bright leader. Space the columns wider on phones. If the visitor has reduced motion turned on, show one still frame. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. How often the rain moves down a row: slow is about 18 times a second, normal 28 and fast about 46.
- Characters: **Japanese** · Binary · Hexadecimal. Japanese katakana with the digits 0 to 9 (the film's look), binary 0 and 1, or hexadecimal 0 to F.
- Trail length: Short · **Medium** · Long. How long characters linger: short fades 12% a step, medium 7% and long 4%.
- Character size: Small · **Medium** · Large. Small is 12px, medium 16px and large 22px; the columns are spaced one character size apart, at least 14px on phones, so larger characters make fewer columns.
- Glowing leaders: **on** · off. A soft glow around each column's leading character.

## Plasma Field

Smooth waves of color flow endlessly, made from math. Best for creative sites.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/plasma/
- How it runs: moves by itself
- Good for: Music and creative sites · Hero sections · Loading screens · Retro themes
- Avoid on: Serious content · Long reading pages

**Prompt**

Add a plasma background to [the section you want it behind]. For every point, add up a few waves based on its position and on time (across, down, diagonally and outward from the center) and use the sum to pick a color from a smooth palette, so the whole field flows like liquid color. To keep it fast, draw the field into a small image and scale it up smoothly to fill the section, using a smaller image on phones. If the visitor has reduced motion turned on, show one still frame. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. How fast the field flows: slow is 0.6 times the base speed, normal 1 and fast 1.6; at normal each of the four waves rises and falls at any one spot every 5 to 9 seconds.
- Pattern size: Small · **Medium** · Large. How big the color shapes are: small packs more waves into the field, large makes broad, soft blobs; at medium detail one full wave spans about 31% of the width at small, 50% at medium and 83% at large.
- Colors: **Neon** · Sunset · Ocean · Rose. The palette: neon, sunset, ocean or rose.
- Detail: Low · **Medium** · High. How wide the small picture is before it is scaled up: low is 96 pixels, medium 140 and high 200; phones use at most 140.

## Wave Layers

Layers of waves drift sideways, each at its own speed. Best for hero sections.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/wave-layers/
- How it runs: moves by itself
- Good for: Hero sections · Page footers · Section dividers · Travel and beach sites
- Avoid on: Dense dashboards · Long reading pages

**Prompt**

Add layered waves to [the bottom of the section you want them in]. Stack a few strips of water, each one twice as wide as the section with the same wave shape repeated along its top edge: far strips sit higher, paler and with smaller waves, near strips lower, darker and with bigger ones. Slide every strip sideways by half its width, over and over, so the repeated shape hides the restart, and give near strips a quicker pace than far ones so the water feels deep. Move the strips only by shifting them, which keeps it smooth on phones. If the visitor has reduced motion turned on, keep the waves still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. The base cycle: slow is 40 seconds, normal 24 and fast 14; the layers take 1.7, 1.35, 1.1 and 0.9 times that, far to near, to slide one stage width.
- Colors: **Ocean** · Sunset · Night. Ocean blues, Sunset pinks and purples under an orange glow, or Night indigo; far layers are the palest, near ones the darkest.
- Wave height: Low · **Medium** · High. How tall the nearest waves are: low is 6%, medium 11% and high 17% of the stage's height; the farther layers get a half to four fifths of that.
- Number of layers: 2 · 3 · **4**. Two, three or four layers; with fewer, the far layers go first and the near waves always stay.

## Snow / Rain

Snow drifts down, or rain falls in streaks, over a dark town. Best for seasonal pages.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/snow-rain/
- How it runs: moves by itself
- Good for: Winter and holiday pages · Weather apps · Cozy hero sections · Story and game scenes
- Avoid on: Light pages · Long reading pages

**Prompt**

Add falling snow or rain to [the dark section you want it over]. Lay a see-through canvas over the section and draw small particles on it, moving each one down on every frame by the time that has passed, and start it again at the top once it leaves the bottom. Snowflakes fall slowly and sway from side to side; raindrops fall fast and are drawn as short streaks that lean with the wind. When depth is on, make near particles bigger, brighter and faster than far ones. Draw fewer particles on phones. If the visitor has reduced motion turned on, show one still frame. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Weather: **Snow** · Rain. Snow drifts down slowly, about 30 to 80px a second from far to near, and sways 4 to 13px to each side; rain falls more than ten times as fast, about 540 to 1,080px a second, drawn as streaks 11 to 22px long.
- Amount: Light · **Medium** · Heavy. How many particles per 100,000 square pixels: light, medium and heavy are 28, 62 and 125 flakes, or 35, 80 and 170 drops; phones draw 80% of that.
- Wind: None · **Gentle** · Strong. None, gentle or strong: the wind carries snow sideways and tilts the rain, near particles more than far ones; gentle slants the snow's path about 30° from straight down and the rain about 8°, strong about 55° and 20°.
- Depth: **on** · off. Three layers in which near flakes and drops are bigger, brighter and faster than far ones; off, every particle is the size and speed of the middle layer.

## Fireworks

Rockets rise and burst into glowing sparks that fall and fade. Best for celebrations.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/fireworks/
- How it runs: moves by itself
- Good for: Launch and event pages · Holiday greetings · Success screens · Game wins
- Avoid on: Calm brands · Long reading pages

**Prompt**

Add fireworks to [the dark section you want them over]. On a see-through canvas laid over the section, launch a rocket from the bottom every so often; it slows as it climbs and, at the top of its climb, bursts into many sparks that fly out in all directions. Slow the sparks a little on every frame, pull them gently down and fade them out, so each burst blooms, droops and dies away. For trails, cover the canvas with a faint see-through layer instead of clearing it, the same number of times per second on every screen. Use fewer sparks on phones. If the visitor has reduced motion turned on, show a still picture of the bursts. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- How often: Rarely · **Sometimes** · Often. The time between launches, on average: rarely about 2.2 seconds, sometimes 1.2 and often half a second, each gap a random half to one and a half times that.
- Colors: **Many colors** · Gold · Blue. Each burst picks one color: from eight hues, from three golds, or from blues and violets.
- Trails: None · Short · **Long**. How much of the picture each 60th of a second's cover takes away: none 100%, short 30% and long 13%.
- Burst shape: **Round** · Ring · Willow. A ball of sparks, a ring of sparks that all fly at nearly the same speed, or a willow whose sparks droop like branches.

## Topographic Lines

Lines like those on a hiking map slowly bend and drift. Best for outdoor brands.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/topographic-lines/
- How it runs: moves by itself
- Good for: Outdoor and travel brands · Hero sections · Maps and data products · Portfolio backgrounds
- Avoid on: Busy layouts · Long reading pages

**Prompt**

Add a topographic lines background to [the section you want it behind]. Build a smooth, hilly height map from layered noise and draw its contour lines on a canvas: sample the height on a grid, and in each grid square join the points where the height crosses each level, so every line follows one height, as on a hiking map. Make every fifth line bolder when the settings include it. Shift the noise slowly by elapsed time so the hills swell, shrink and drift, and redraw each frame. Sample a coarser grid on phones. If the visitor has reduced motion turned on, show the lines still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Line spacing: Tight · **Medium** · Wide. How much the height changes between two lines: tight puts about 1.7 times as many lines on the same ground, wide about 0.6 times; with medium hills the lines are on average about 8px apart at tight, 14px at medium and 22px at wide.
- Speed: Slow · **Normal** · Fast. How fast the hills swell and drift: slow is half the normal pace and fast twice it; at normal the broad hills slide about 7px a second with medium hills, 4px with small and 12px with large.
- Color: **Sand** · Mint · Sky blue · White. Sand, mint, sky blue or white lines on a dark ground.
- Hill size: Small · **Medium** · Large. How wide one hill is: about 130px (small), 220px (medium) or 360px (large).
- Bold every fifth line: **on** · off. Every fifth line is drawn thicker and brighter, like the index contours of a printed map.

## Light Rays

Soft beams of light fall from above and slowly sweep across. Best for hero intros.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/light-rays/
- How it runs: moves by itself
- Good for: Hero sections · Page intros · Nature and wellness sites · Product launches
- Avoid on: Light pages · Busy layouts

**Prompt**

Add soft light rays to [the dark section you want them in]. From one point just above the top edge, draw a fan of long, narrow beams on a canvas, made soft by gradients rather than blur filters: clear at the edges, brightest near the source and fading out farther away. Let each beam sway and brighten and dim on its own slow cycle, paced by elapsed time, so the light seems to sweep across the scene, and add overlapping beams together. When the settings include dust, float tiny specks that glint only where a beam crosses them, with fewer specks on phones. Keep the content above the light. If the visitor has reduced motion turned on, show the rays still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Light color: **Warm** · Cool. Warm late sunshine over a brown-black room, or cool moonlight over a blue-black one.
- Speed: Slow · **Normal** · Fast. How fast the beams sway and the dust drifts: slow is half the normal pace and fast twice it; at normal a beam sways back and forth every 12 to 22 seconds and a speck of dust rises 2 to 7px a second.
- Floating dust: **on** · off. Specks of dust drift slowly upward and glint where a beam crosses them; phones show 40, other screens 80.
- Number of rays: Few · **Some** · Many. Few is 5 beams, some 8 and many 12; more beams overlap into a fuller, brighter light.
- Light comes from: **Top left** · Top · Top right. Where the beams start: just above the top left corner, the middle of the top edge or the top right corner.

## Game of Life

Cells live and die by their neighbors, and patterns grow. Best for tech sites.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/game-of-life/
- How it runs: moves by itself
- Good for: Tech and science sites · Developer portfolios · Loading and idle screens · 404 pages
- Avoid on: Calm brands · Long reading pages

**Prompt**

Add a Game of Life background to [the section you want it behind]. Split a canvas into a grid of square cells, each alive or dead, and at a steady pace work out the next generation from each cell's eight neighbors: a dead cell with exactly three live neighbors is born, a live cell with two or three stays alive, and every other cell dies. Time the generations by elapsed time, not by frames, and when the settings include trails, let dying cells fade out. Let the visitor click, drag or touch to draw cells, and start again when the world settles. Keep the cells from getting too small on phones. If the visitor has reduced motion turned on, show one still frame. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. How many generations pass each second: slow is 4, normal 10 and fast 20.
- Cell size: Small · **Medium** · Large. Small cells are 6px, medium 9px and large 14px; phones draw small cells 8px wide, so the world has fewer cells to work out and draw.
- Start pattern: **Random** · Glider gun · Acorn. Random fills about 30% of the cells; the glider gun (Gosper's) fires a glider every 30 generations; the acorn is seven cells that grow for over 5,000 generations on an open grid.
- Color: **Mint** · Amber · Sky blue · Pink. Mint, amber, sky blue or pink cells.
- Fading trails: **on** · off. A cell that dies fades out over about half a second instead of vanishing at once.
- Grid lines: on · **off**. Faint lines show the squares the cells live in.

## Ken Burns Effect

Photos slowly zoom and pan, then fade into the next. Best for hero slideshows.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/ken-burns/
- How it runs: moves by itself
- Good for: Hero photos · Slideshows · Travel and property sites · Story pages
- Avoid on: Product photos people inspect · Pictures of text

**Prompt**

Add a Ken Burns effect to [your hero photo or slideshow]. Slowly zoom and pan each photo, the way a documentary camera moves over a still print, and crossfade to the next photo before its move ends, so the motion never stops. Give each photo its own start and end framing that drifts toward a point of interest, at an even, unhurried pace. Keep the photo larger than its frame at every moment so no edge ever shows, move it with transforms only, and keep any text on top still and readable. If the visitor has reduced motion turned on, show each photo still and change photos with a slow fade. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Which way it zooms: In · Out · **Both**. In zooms every photo in, toward its point of interest; out starts close and pulls back; both zooms the first and third photos in and the second out.
- How much it moves: Subtle · **Medium** · Strong. Subtle zooms from 1.04 to 1.16 times and drifts less than half of the way toward the point of interest; medium zooms from 1.06 to 1.3 times and drifts three quarters of the way; strong zooms from 1.08 to 1.5 times and drifts all the way.
- Time on each photo: Short · **Medium** · Long. Short is 5 seconds, medium 7 seconds and long 10 seconds; each fade takes a seventh of that, about a second at medium.
- Shows a caption: on · **off**. On, each photo's name sits in the lower left corner and stays still while the photo moves.

## Fire Effect

Flames flicker and rise as heat climbs and cools. Best for game and event pages.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/fire-effect/
- How it runs: moves by itself
- Good for: Game sites · Sale and event banners · Night and festival themes
- Avoid on: Reading pages · Light themes

**Prompt**

Add a fire effect to [the dark section or edge you want to set alight]. Keep a small grid of heat values whose bottom row always holds full heat. Many times a second, give each cell the heat of a cell just below it, nudged sideways and cooled a little at random, so heat rises, flickers and dies out. Color each cell by its heat with the palette the settings choose, dark when cool and brightest when hot, and draw the grid on a small canvas stretched over the area so the flames look soft. Step the grid at a fixed rate on every screen, coarser on phones. If the visitor has reduced motion turned on, show still flames. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Flame height: Low · **Medium** · Tall. Where the heat runs out, as a share of the box's height: low is about a third, medium about half and tall about four fifths; taller flames lose less heat per row.
- Fire shape: **Along the edge** · Campfire. Along the edge heats the whole bottom row, so flames burn across the box; campfire heats only its middle third, fading to the sides, so the flames lean in and meet in a point.
- Colors: **Orange** · Blue · Green. The palette from cool to hot: orange runs from dark red to yellow and white, blue from deep navy to pale blue, green from dark green to pale yellow.
- Wind: **None** · Left · Right. Left or right moves half of the heat one extra cell to that side each step, so the flames lean that way.
- Sparks: **on** · off. About 24 sparks a second rise from the flames and fade within one to two and a half seconds (10 a second on phones).
