# 03 · Page Transitions

Full-page transitions between routes or views — crossfades, slides, portals, morphs, and the View Transitions API. 17 animations from Animation Handbook, in the home page's order. Each entry gives the live demo, how it runs, what it is good for and what to avoid it on, the prompt from its page word for word, and its settings with what each does and the demo's values.

## Contents

- [View Transitions API](#view-transitions-api)
- [Shared Element Transition](#shared-element-transition)
- [Morph Transition](#morph-transition)
- [Crossfade Transition](#crossfade-transition)
- [Slide Transition](#slide-transition)
- [Zoom Transition](#zoom-transition)
- [Flash / Light Leak Transition](#flash--light-leak-transition)
- [Blur Transition](#blur-transition)
- [Elastic Transition](#elastic-transition)
- [Portal / Tunnel Zoom](#portal--tunnel-zoom)
- [Dissolve Transition](#dissolve-transition)
- [FLIP Technique](#flip-technique)
- [Circle Reveal](#circle-reveal)
- [Overlay Wipe](#overlay-wipe)
- [Page Curl](#page-curl)
- [Cube Transition](#cube-transition)
- [Pixelate Transition](#pixelate-transition)

## View Transitions API

The browser animates the change between two pages for you. Best for web apps.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/03-page-transitions/view-transitions-api/
- How it runs: reacts to the visitor
- Good for: Web apps · Page changes · Tabs and filters · Galleries
- Avoid on: Frequent updates

**Prompt**

Add page transitions to [your site's pages or views] with the browser's View Transitions API. Wrap each page change in a view transition: the browser takes a picture of the page before and after the change and animates between the two pictures. Name the content area so that only it animates, and turn off the default animation of the whole page. Style how the old and new pictures move with CSS, for example a fade, a slide or a zoom. Check that the browser supports the API, and simply swap the content when it does not. If the visitor has reduced motion turned on, swap the content with no animation. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Transition style: **Fade** · Slide · Zoom · Tilt. Fade blends the two pictures; Slide pushes the old one out to the left as the new one comes in from the right, each moving a full width; Zoom shrinks the old one away to 80% as it fades while the new one fades in and settles from slightly larger, 115%; Tilt turns both slightly as they fade: the old one shrinks to 90% and turns 2° counterclockwise, and the new one starts at 90%, turned 2° clockwise.
- Speed: Slow · **Normal** · Fast. How long the change takes: slow is 800ms, normal 500ms and fast 300ms; under about 150ms it reads as an instant swap.
- Feel: Smooth · **Gentle** · Even. Gentle eases in and out; Smooth slows to a stop; Even keeps one steady pace.

## Shared Element Transition

A picture grows from the list into the next page's header. Best for galleries.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/03-page-transitions/shared-element-transition/
- How it runs: reacts to the visitor
- Good for: Galleries · Product grids · Card lists · Media libraries
- Avoid on: Unrelated pages

**Prompt**

Add a shared element transition to [your list of items and their detail pages]. When a visitor opens an item, its picture should grow from its place in the list into the large header of the detail page, while the list fades away and the detail text fades in just after the picture lands. Measure where the picture starts and where it ends, then move a copy from one to the other with a transform only, never by changing its position or size, so it reads as one continuous element. Going back fades the detail page out and the list back in. If the visitor has reduced motion turned on, open and close the detail page without the movement. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. How long the picture takes to travel and grow: slow is 800ms, normal 500ms and fast 300ms; 300 to 600ms feels responsive without dragging.
- Feel: **Smooth** · Springy. Smooth slows to a stop; Springy grows a little past the header's size, then settles.

## Morph Transition

The logo changes shape to match each page you visit. Best for brand marks.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/03-page-transitions/morph-transition/
- How it runs: reacts to the visitor
- Good for: Logos · Brand marks · Icons that change state
- Avoid on: Detailed pictures · Text

**Prompt**

Add a morphing logo to [your logo or icon, and the pages it belongs to]. Give each page its own shape for the logo, and when the visitor changes page, let the outline flow from the old shape into the new one while the page content fades across. Draw every shape with the same number of points in the same order, so each point has a partner to move to and the outline never tears or twists. Move the points yourself on every frame, because CSS cannot blend two different shapes. If the visitor has reduced motion turned on, switch to the new shape at once. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. How long the change of shape takes: slow is 1100ms, normal 700ms and fast 400ms; slower reads as more deliberate.
- Feel: Smooth · Springy · **Gentle** · Even. Gentle eases in and out; Smooth slows to a stop; Springy stretches a little past the new shape and settles back; Even keeps one steady pace.

## Crossfade Transition

The old page fades out as the new one fades in. Best for calm page changes.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/03-page-transitions/crossfade/
- How it runs: reacts to the visitor
- Good for: Tabs · Image galleries · Content swaps · Calm sites
- Avoid on: Step-by-step flows

**Prompt**

Add a crossfade between [the pages or views you want to switch between]. Stack the old and the new page in exactly the same place, then fade the old one out and the new one in. When the two fades run together, both pages are half visible for a moment and blend; one after the other, a short blank moment falls between them. Nothing moves; only how see-through each page is changes. It is the calmest page change and suits content that has no order. If the visitor has reduced motion turned on, switch pages instantly. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Fade order: **Together** · One after the other. Together overlaps the two fades so the pages blend; One after the other fades the old page out first, leaving a blank moment.
- Speed: Slow · **Normal** · Fast. How long the whole change takes: slow is 800ms, normal 500ms and fast 300ms; one after the other gives each fade half of it.
- Feel: Smooth · **Gentle** · Even. Gentle eases in and out; Smooth slows to a stop; Even keeps one steady pace, which reads most evenly for a pure fade.

## Slide Transition

Pages slide across, and going back slides the other way. Best for step flows.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/03-page-transitions/slide-transition/
- How it runs: reacts to the visitor
- Good for: Step-by-step flows · Checkout · Onboarding · Carousels
- Avoid on: Unrelated pages

**Prompt**

Add slide transitions to [the pages or steps you want to move between]. When the visitor changes page, move the old page out of one side while the new page comes in from the other, like panels on a track. When the direction follows the navigation, going forward slides to the left and going back slides to the right, as phone apps do. Move the pages with transforms only, never by changing their position or size, and keep pages that are off screen from catching taps. If the visitor has reduced motion turned on, switch pages without sliding. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Direction: **Forward and back** · Left to right · Right to left · Top to bottom. Forward and back slides left for the next page and right for the previous one; the other choices always slide the same way.
- Speed: Slow · **Normal** · Fast. How long each slide takes: slow is 800ms, normal 500ms and fast 300ms; 300 to 500ms matches phone apps, longer drags.
- Feel: **Smooth** · Springy · Even. Smooth slows to a stop; Springy goes a little past and settles back; Even keeps one steady pace.
- Gap between pages: **None** · Small · Large. How much later the new page starts: none, small (80ms) or large (160ms); a delay leaves a gap between the pages.

## Zoom Transition

The pages zoom as they swap, as if moving in depth. Best for opening details.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/03-page-transitions/zoom-transition/
- How it runs: reacts to the visitor
- Good for: Opening details · Galleries · Lightboxes
- Avoid on: Step-by-step flows

**Prompt**

Add a zoom transition to [the pages or views you want to move between]. When the page changes, scale the old and the new page while one fades out and the other fades in, so the change seems to move through depth rather than across the screen. Zooming in, where the new page grows into place, feels like going deeper; zooming out feels like stepping back; a pull-through, where the new page rushes in from larger, feels like traveling forward. Scale with transforms only, and keep the fade so no hard edge shows. If the visitor has reduced motion turned on, swap pages without scaling. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Zoom style: **Zoom in** · Zoom out · Pull through. Zoom in grows the new page from 75% as the old one shrinks to 90%; Zoom out grows the old page past the frame, to 120%, as it fades, while the new one fades in at full size; Pull through shrinks the old page to 70% while the new one settles from 130%.
- Speed: Slow · **Normal** · Fast. How long the zoom and the fade take: slow is 900ms, normal 550ms and fast 330ms.
- Feel: **Smooth** · Springy · Gentle. Smooth slows to a stop; Springy grows a little past full size and settles; Gentle eases in and out.

## Flash / Light Leak Transition

A burst of light hides the moment the page changes. Best for bold, lively sites.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/03-page-transitions/flash-transition/
- How it runs: reacts to the visitor
- Good for: Product launches · Music and fashion · Photo stories
- Avoid on: Frequent page changes · Calm sites

**Prompt**

Add a flash transition to [the pages or scenes you want to switch between]. Cover the content with a full-size colored layer that rises to its peak, swap the page while it is covered, then fade the layer away to reveal the new page, like a burst of light hiding a cut in a film. At full strength the change is completely hidden. Let the fade-out take a little longer than the rise. Keep flashes rare, never several in one second, to protect people who are sensitive to flashing light. If the visitor has reduced motion turned on, switch pages with no flash. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Flash color: **White** · Gold · Cyan · Red. White reads as a camera flash; gold, cyan and red read as a colored light leak.
- Speed: Slow · **Normal** · Fast. How fast the flash rises and fades: slow is 320ms up and 510ms down, normal 200ms and 320ms, fast 120ms and 190ms; the fade is always a little longer than the rise.
- Flash strength: **Full** · Strong · Soft. How solid the flash gets: full hides the page change completely; strong (75%) and soft (50%) let it show through.
- Blurs the flash: on · **off**. Softens the flash's edges into a glow.

## Blur Transition

The old page blurs away and the new one comes into focus. Best for photo sites.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/03-page-transitions/blur-transition/
- How it runs: reacts to the visitor
- Good for: Photo sites · Film and editorial · Portfolios
- Avoid on: Self-playing slideshows · Low-end phones

**Prompt**

Add a blur transition to [the pages or views you want to switch between]. When the page changes, blur the old page until it is out of focus, bring in the new page just as blurred, then sharpen it into focus, like a camera pulling focus from one subject to another. Fading while blurring hides the moment of the swap. Blur is costly for the browser to draw, so use it only on changes the visitor starts, never on anything that repeats by itself, and remove the blur completely when it ends. If the visitor has reduced motion turned on, switch pages without blurring. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- How blurry it gets: Slight · **Medium** · Heavy. How much the pages blur at the midpoint: slight is 8px, medium 20px and heavy 35px; above about 30px it is heavy for the browser and can look muddy.
- Speed: Slow · **Normal** · Fast. How long each half takes, blurring out and then sharpening in: slow is 650ms, normal 400ms and fast 250ms.
- Fades as it blurs: **on** · off. Fades each page as it blurs, which hides the swap; off, the pages stay solid and only blur.
- Overlaps the two halves: on · **off**. Starts sharpening the new page halfway through the blur, so the change takes a quarter less time.
- Feel: Smooth · **Gentle** · Even. Gentle feels like a controlled focus pull; Smooth snaps into focus sooner; Even keeps one steady pace.

## Elastic Transition

The new page slides in, goes too far and springs back. Best for playful apps.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/03-page-transitions/elastic-transition/
- How it runs: reacts to the visitor
- Good for: Playful apps · Panels and drawers · Games
- Avoid on: Formal sites

**Prompt**

Add an elastic transition to [the pages or panels you want to move between]. The new page should slide in from the side, go a little past its place and spring back before settling, as if pulled by a rubber band, while the old page slides away. The bounce can be planned ahead as a fixed path, which is cheap, or worked out live with a simple spring, which can react if the visitor interrupts it; with a live spring, advance it in small fixed time steps so it moves the same on every screen, and limit the time one frame adds so a slow frame cannot throw it off. If the visitor has reduced motion turned on, switch pages without movement. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- How it bounces: **Planned path** · Live spring. A planned path plays a bounce decided in advance, which is cheap; a live spring works out the movement in small fixed time steps, which feels physical and can react to interruptions.
- Bounce size: Small · **Medium** · Large. How far the page goes past its place before settling: small is 3.6% of the page's width, medium 7.2% and large 12% on the planned path, and about as far with a live spring, where a bigger bounce means less damping, so it swings for longer.
- Speed: Slow · **Normal** · Fast. How quickly it settles: on the planned path slow is 1400ms, normal 900ms and fast 550ms; with a live spring, a faster speed is a stiffer spring, which settles in about 1 to 1.3 s when slow, 0.6 to 0.8 s at normal and 0.3 to 0.45 s when fast.

## Portal / Tunnel Zoom

The next page opens out of a circle you click. Best for big reveals.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/03-page-transitions/portal-zoom/
- How it runs: reacts to the visitor
- Good for: Big reveals · Galleries · Story chapters · Calls to action
- Avoid on: Everyday navigation

**Prompt**

Add a portal transition to [the element that should open into the next page]. When the visitor clicks it, show the next page through an opening that starts as a point at the element's center and grows until the new page fills the view, as if diving through a window. Put the new page underneath first and only grow the visible opening, measuring the element's position at the moment of the click so the opening starts exactly there. Make the opening big enough at the end to reach the corners. If the visitor has reduced motion turned on, show the new page at once. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Portal shape: **Circle** · Square. A circle feels like a tunnel; a square opens like a window.
- Speed: Slow · **Normal** · Fast. How long the opening takes to fill the view: slow is 1900ms, normal 1200ms and fast 700ms; too fast and it becomes a plain wipe.
- Feel: **Speeds up** · Smooth · Gentle · Even. Speeds up feels like diving in; Smooth slows at the end, like pulling back; Gentle eases in and out; Even keeps one steady pace.

## Dissolve Transition

The page breaks into tiles that give way to the next. Best for photo galleries.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/03-page-transitions/dissolve/
- How it runs: reacts to the visitor
- Good for: Photo galleries · Slideshows · Retro and game sites
- Avoid on: Everyday navigation

**Prompt**

Add a dissolve transition to [the pages or images you want to switch between]. Lay a grid of tiles over the old page and fade each tile in at a slightly different moment, following a pattern such as random, a diagonal sweep or rings from the middle, so the old page breaks up instead of fading evenly. Swap the page while the tiles cover it, then remove the tiles, or fade them away in the same pattern to reveal the new page. Give each tile its own delay and let the browser run the fades. If the visitor has reduced motion turned on, use a short, plain fade instead. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Pattern: **Random** · Diagonal · From the middle. The order the tiles appear in: random looks like grain, diagonal sweeps from one corner, and from the middle spreads out in rings.
- Tile size: Small · **Medium** · Large. How big the tiles are: small is a 16 by 16 grid (10 by 10 on phones), medium 8 by 8 and large 4 by 4; small tiles come close to a smooth fade.
- Speed: Slow · **Normal** · Fast. How long the tiles take: slow is 1300ms, normal 800ms and fast 500ms; the page swaps at 60% of it, under the tiles.
- Dissolves both ways: on · **off**. Also fades the tiles away in the same pattern to reveal the new page, instead of removing them at once.

## FLIP Technique

Cards glide to their new places when the layout changes. Best for sorting lists.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/03-page-transitions/flip-technique/
- How it runs: reacts to the visitor
- Good for: Sorting and filtering · Card grids · Dashboards · Lists
- Avoid on: Very long lists

**Prompt**

Animate layout changes in [the grid or list you want to rearrange] with the FLIP technique. Before the change, record where every item is. Apply the new order or layout so the items jump to their new places. Then shift each item back to where it was with a transform, and animate that shift away so the items glide to their real places. Only transforms animate, so it stays smooth even with many items. Match items across the change by a stable id. If the visitor has reduced motion turned on, let the items jump to their new places without gliding. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. How long the cards take to glide: slow is 800ms, normal 500ms and fast 300ms; 300 to 600ms reads as deliberate.
- Feel: **Smooth** · Springy · Even. Smooth slows to a stop; Springy goes a little past each place and settles; Even keeps one steady pace.

## Circle Reveal

Pages grow from any spot you click and shrink back into it. Best for app navigation.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/03-page-transitions/circle-reveal/
- How it runs: reacts to the visitor
- Good for: App navigation · Theme switches · Menu buttons · Calls to action
- Avoid on: Quick tab changes

**Prompt**

Add a circle reveal to [the links or buttons that change the page]. When the visitor clicks or taps, put the new page on top of the old one and show it only inside a circle that starts as a dot and grows until it covers everything. Make its final size reach the farthest corner from where it starts, so no corner is left uncovered. When it starts from the click, measure the spot at that moment; a press of the keyboard has no spot, so use the middle of the pressed button. Grow only the visible circle; neither page moves. If the visitor has reduced motion turned on, crossfade the pages instead. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Where it starts: **Where you click** · Center · Corner. Where you click follows the pointer, or the middle of the button for a keyboard press; Center and Corner (the bottom right) always start in the same place.
- Speed: Slow · **Normal** · Fast. How long the circle takes to cover the page: slow is 1200ms, normal 750ms and fast 450ms.
- Closes when you go back: **on** · off. Going to an earlier page shrinks the old page into the spot instead of growing the earlier one out of it.

## Overlay Wipe

A colored panel sweeps over the page as it changes. Best for portfolio sites.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/03-page-transitions/overlay-wipe/
- How it runs: reacts to the visitor
- Good for: Portfolio sites · Agency sites · Brand-colored sites · Chapter breaks
- Avoid on: Apps used all day

**Prompt**

Add an overlay wipe to [the pages you want to switch between]. When the visitor changes page, sweep a solid colored panel across until it covers the whole page, swap the page while it is covered, then sweep the panel on out of the opposite side to reveal the new page. Move the panel only by sliding it, never by resizing it, and keep the covered moment short so the change still feels quick. Ease each sweep so the panel starts and stops softly. A second, lighter panel can lead the way in and trail the first on the way out. If the visitor has reduced motion turned on, use a quick fade instead. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Direction: **Left to right** · Right to left · Bottom to top · Top to bottom. The side the panel comes in from; it always leaves on the opposite side.
- Panel color: **Violet** · Coral · Teal · Gold. The color of the panel; the second panel is a lighter shade of it.
- Two stacked panels: on · **off**. A lighter panel runs just ahead of the main one on the way in and just behind it on the way out.
- Speed: Slow · **Normal** · Fast. How long each sweep takes: slow is 550ms, normal 400ms and fast 270ms; the page stays covered for a quarter of that.

## Page Curl

The page peels back from its corner like paper. Best for digital magazines.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/03-page-transitions/page-curl/
- How it runs: reacts to the visitor
- Good for: Digital magazines · Picture books · Menus and brochures · Photo albums
- Avoid on: Everyday navigation

**Prompt**

Add a page curl to [the pages you want to turn, such as a magazine]. A forward turn lifts the bottom corner of the current page and turns it over to the left like paper, so the page underneath shows. A turn back runs the same movement in reverse and lays a page down over the current one. Draw the folded part as the back of the sheet, lying over the page along a straight fold that moves with the corner. Paper shading darkens the fold and casts a shadow on the page below. Work out the fold from the corner on every frame, timing the turn by elapsed time. If the visitor has reduced motion turned on, fade between the pages instead. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Turn speed: Slow · **Normal** · Fast. How long one page takes to turn over: slow is 1500ms, normal 1000ms and fast 650ms.
- Which way it turns: **Forward and back** · Always forward · Always back. Forward and back turns the page away for a later page and lays an earlier page back down; the other two always turn one way.
- Paper shading: Off · **Soft** · Strong. How strongly the fold is shaded and how dark the shadow on the page below is: soft darkens the shadow to 42% black at mid-turn and the turned-over paper to 30% black along the fold, strong to 70% and 50%; off leaves a flat paper back.

## Cube Transition

The pages sit on a cube that turns to show the next. Best for photo stories.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/03-page-transitions/cube-transition/
- How it runs: reacts to the visitor
- Good for: Photo stories · Product tours · Slides · Onboarding
- Avoid on: Text-heavy pages · Everyday navigation

**Prompt**

Add a cube transition to [the pages or slides you want to switch between]. Treat the current page and the next one as two sides of a cube: when the visitor changes page, turn the cube a quarter turn around its middle, which sits half a page behind the screen, so the old page swings away and the new one swings into place. Going back turns the cube the other way. Give the scene perspective, hide any side that faces away from the viewer and darken each side a little as it turns away. Animate only the turn itself so it stays smooth. If the visitor has reduced motion turned on, crossfade the pages instead. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Turn direction: **Sideways** · Up and down. Sideways turns around a vertical line, a later page coming in from the right; up and down turns around a horizontal line, a later page coming in from below.
- Speed: Slow · **Normal** · Fast. How long the cube takes to turn: slow is 1100ms, normal 750ms and fast 500ms.
- Depth: Shallow · **Normal** · Deep. How close the viewer is to the cube: shallow puts them 3.2 sides away, normal 1.6 and deep 0.9, so the near edge looms larger.

## Pixelate Transition

The page breaks into big pixels, then sharpens into the next. Best for galleries.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/03-page-transitions/pixelate-transition/
- How it runs: reacts to the visitor
- Good for: Photo galleries · Game and retro sites · Slideshows
- Avoid on: Everyday navigation · Text-heavy pages

**Prompt**

Add a pixelate transition to [the pictures or views you switch between]. When the visitor moves to the next one, break the current picture into square blocks that grow larger, swap to the new picture while the blocks are at their largest, then shrink the blocks until the new picture is sharp again. Make each block one flat color by drawing the picture very small on a canvas and scaling it back up with smoothing turned off. Keep the page names and buttons outside the pixelated area so they stay readable, and draw only while a change runs. If the visitor has reduced motion turned on, use a short, plain fade instead. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Block size: Small · **Medium** · Large. How big the squares are at the middle of a change: small is 8 pixels, medium 16 and large 28.
- Speed: Slow · **Normal** · Fast. How long a change takes: slow is 1.2 seconds, normal 0.8 seconds and fast 0.5 seconds.
- How the blocks change: **Smoothly** · In steps. Smoothly grows and shrinks the blocks evenly; in steps holds them at a quarter, a half, three quarters and the full size in turn.
