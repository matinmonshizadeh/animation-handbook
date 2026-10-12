# 01 · Scroll-Based

Animations driven by scroll position — parallax, sticky, scrub, snap, and storytelling. 27 animations from Animation Handbook, in the home page's order. Each entry gives the live demo, how it runs, what it is good for and what to avoid it on, the prompt from its page word for word, and its settings with what each does and the demo's values.

## Contents

- [Parallax Depth-of-Field](#parallax-depth-of-field)
- [Parallax Scrolling](#parallax-scrolling)
- [Reverse-Scrolling Columns](#reverse-scrolling-columns)
- [Cover Card to Fixed Header](#cover-card-to-fixed-header)
- [Fly-in Fly-out Contact List](#fly-in-fly-out-contact-list)
- [Stacking Cards](#stacking-cards)
- [Scroll-Triggered Animation](#scroll-triggered-animation)
- [Scrub Animation](#scrub-animation)
- [Pin Animation](#pin-animation)
- [Snap Scrolling](#snap-scrolling)
- [Scrollytelling](#scrollytelling)
- [Reveal on Scroll](#reveal-on-scroll)
- [Stagger Reveal](#stagger-reveal)
- [Horizontal Scroll](#horizontal-scroll)
- [Sticky Section](#sticky-section)
- [Counter Animation](#counter-animation)
- [Progress Bar](#progress-bar)
- [Section Wipe](#section-wipe)
- [Zoom Into Image](#zoom-into-image)
- [Scroll Image Sequence](#scroll-image-sequence)
- [Smooth (Inertia) Scroll](#smooth-inertia-scroll)
- [Text Fill on Scroll](#text-fill-on-scroll)
- [Scroll Velocity Skew](#scroll-velocity-skew)
- [SVG Line Draw on Scroll](#svg-line-draw-on-scroll)
- [Scrollspy Navigation](#scrollspy-navigation)
- [Scroll-Driven Background Color](#scroll-driven-background-color)
- [Hide-on-Scroll Header](#hide-on-scroll-header)

## Parallax Depth-of-Field

Layers move at their own speed as the focus shifts. Best for cinematic intros.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/parallax-depth-of-field/
- How it runs: follows the scroll
- Good for: Hero scenes · Story intros · Illustrated landscapes
- Avoid on: Large photos · Text-heavy pages

**Prompt**

Add a parallax depth-of-field effect to [your layered scene or illustration]. Split the scene into layers from far to near and hold it in place while the visitor scrolls through a taller section. As they scroll, move each layer by an amount that grows with its nearness, and move a point of sharp focus from the farthest layer to the nearest: blur each layer by how far it sits from that focus. Ease the layers toward the scroll position on every frame by a share of the distance left, exponential in the time since the last frame, so a wheel's jumps turn into smooth movement at the same pace on every screen. If the visitor has reduced motion turned on, keep the layers still and only shift the focus.

**Settings**: none, so the prompt is complete as it is. The demo's own values:

- Focus: Follows the scroll. Sharp on the sky at the top of the scroll and on the front ridge at the end; each layer blurs by its distance from it.
- Strongest blur: 14px (8px on phones). The blur of a layer as far from the focus as a layer can be.
- Layer travel: 19% of the box's height (12.5% on phones). What the layers' sinking is measured against: over the whole scroll the front ridge sinks 70% of it, the hills 45%, the mountains 25%, the far peaks 10% and the sky not at all.
- Easing: 14% per sixtieth of a second. How much of the remaining distance the layers cover in a sixtieth of a second; a longer frame covers more, so the layers settle in the same time on every screen; lower is smoother but lags more.
- Pinned scene: Three box heights of scrolling. How much scrolling the whole focus pull takes.

## Parallax Scrolling

Far layers move slower than near ones as you scroll. Best for hero scenes.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/parallax-scrolling/
- How it runs: follows the scroll
- Good for: Hero scenes · Landing pages · Story sections
- Avoid on: Text-heavy pages · Forms

**Prompt**

Add a parallax scene to [your hero section or illustration]. Split the scene into layers from far to near, such as sky, hills, trees and ground, and hold it in place while the visitor scrolls through a taller section. As they scroll, move each layer by its own amount, as the settings choose; usually the farthest layer barely moves and the nearest moves most, which makes the flat picture feel deep. Base the movement on how far through the section the visitor has scrolled, so it starts and stops at the same place every time. If the visitor has reduced motion turned on, keep every layer still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Depth: Flat · Shallow · **Normal** · Deep. The speeds of the sky, ridge, trees and grass: normal is 10%, 30%, 60% and 100%; shallow 50%, 65%, 80% and 100%; deep 0%, 25%, 70% and 150%; flat moves all four together. At 100% a layer travels a quarter of the box's height over the whole scroll.

## Reverse-Scrolling Columns

Side columns run the opposite way to the middle one. Best for portfolios.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/reverse-scrolling-columns/
- How it runs: follows the scroll
- Good for: Portfolios · Agency sites · Image galleries
- Avoid on: Reading pages · Forms

**Prompt**

Add reverse-scrolling columns to [your grid of project cards or images]. Lay the cards out in three columns and hold them in view while the visitor scrolls through a taller section. Move the middle column up with the scroll, and move the two side columns in the direction and at the speed given in the settings; running them the opposite way makes them seem to flow against the scroll. Put two copies of the cards in each column and wrap the movement by exactly one copy's height, so the columns never run out. If the visitor has reduced motion turned on, keep the columns still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Side columns go: **Opposite way** · Same way. Opposite way makes the side columns flow against the scroll; same way moves all three together, so the effect disappears.
- Side column speed: Slower · **Same** · Faster. The side columns' speed compared with the middle one: slower is half, same is equal and faster is one and a half times; above that the motion gets uncomfortable.

## Cover Card to Fixed Header

A tall cover shrinks into a slim header as you scroll. Best for articles.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/cover-card-to-fixed-header/
- How it runs: follows the scroll
- Good for: Articles · Blog posts · Product pages
- Avoid on: Short pages · App screens

**Prompt**

Add a collapsing cover to [your article or page header]. Start with a tall cover pinned to the top that holds the title, a subtitle, the date and the author. As the visitor scrolls, shrink it into a slim header: the title scales down into the corner, the subtitle and date fade out first, and a small author badge fades in near the end. Unless the settings make it snap, tie every change to one number that runs from 0 to 1 with the scroll, so every moment in between looks planned and scrolling back reverses it. Turn off scroll anchoring on the scrolling area. If the visitor has reduced motion turned on, switch between the tall and slim cover halfway, without animating. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Shrink distance: Short · **Medium** · Long. How far you scroll before the cover is fully small: short is 200px, medium 320px and long 440px.
- Snaps at halfway: on · **off**. Switches between the tall cover and the slim header at half the distance instead of shrinking with the scroll; reduced motion always does this.

## Fly-in Fly-out Contact List

Rows fade and slide as they near the top or bottom edge. Best for long lists.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/fly-in-fly-out-contact-list/
- How it runs: follows the scroll
- Good for: Contact lists · Chat lists · Activity feeds · Search results
- Avoid on: Short lists · Tables

**Prompt**

Add a fly-in, fly-out effect to [your scrolling list, such as contacts or messages]. Treat a band at the top and a band at the bottom of the scrolling area as edge zones. As a row passes through the bottom band it arrives, and as it passes through the top band it leaves: the deeper it is in the band, the more it is faded, moved and shrunk, as the settings choose, and in the middle it shows in full. Work it out from the scroll position on every frame, so scrolling back brings rows back. If the visitor has reduced motion turned on, do not move or shrink rows; only fade them a little near the edges. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Effect: **All three** · Move only · Fade only. Which changes a row makes in the bands: all three (moving, fading and shrinking) together read as physical motion; moving only or fading only feels flatter.
- Edge zone size: Small · **Medium** · Large. How tall each band is: small is 15% of the box, medium 25% and large 35%.
- How far rows move: Short · **Medium** · Far. How far a row slides at the very edge: short is 20px, medium 40px and far 70px.
- How much rows shrink: A little · **Medium** · A lot. The size of a row at the very edge: a little is 97%, medium 94% and a lot 88%.
- Shows the zones: on · **off**. Tints the two bands, red for leaving and green for arriving.

## Stacking Cards

Cards stick at the top and pile into a deck. Best for step-by-step stories.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/stacking-cards/
- How it runs: follows the scroll
- Good for: Portfolios · Case studies · Onboarding steps · Feature tours
- Avoid on: Long text · Many cards

**Prompt**

Add stacking cards to [your set of project or step cards]. Make each card stick to the top of the scrolling area so the next card slides up over it, and push each later card down by the offset in the settings so a strip of the cards underneath stays visible, like a deck. As a card is covered, shrink it slightly from its top edge, so buried cards look farther away. Leave some room after the last card so the finished deck stays on screen. Use scroll-driven animations where the browser supports them, with a small script as the fallback. If the visitor has reduced motion turned on, let the cards stack without shrinking. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Edge that shows: None · Small · **Medium** · Large. The strip of each card left showing above the next: none, small (8px), medium (14px) or large (20px).
- How much cards shrink: A little · **Medium** · A lot. How much smaller each card gets for every card on top of it: a little is 5%, medium 10% and a lot 12%.
- Number of cards: 3 · **5** · 7. Three, five or seven cards; more make a taller deck and a longer scroll.

## Scroll-Triggered Animation

Animations start, follow and pin at set scroll points. Best for landing pages.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/scroll-trigger/
- How it runs: follows the scroll
- Good for: Landing pages · Product pages · Feature sections
- Avoid on: Short pages · Forms

**Prompt**

Add scroll-triggered animations to [the sections of your page]. Split the page into zones and work out from the scroll position whether each zone is still ahead, on screen or already passed. Fade a zone's content in when the zone arrives and hide it again when it has gone. Tie another animation's progress to how far the visitor has scrolled through its zone, so it plays forward and back with the scroll. Pin one card in place while its text steps through a few stages, and light up a row of dots in steps. Leave some space after the last zone so it can finish. If the visitor has reduced motion turned on, show content without fading it.

**Settings**: none, so the prompt is complete as it is. The demo's own values:

- Zone height: 90% of the box (zone 3: twice the box). How much scrolling each zone takes.
- Follow window: From 80% to 25% down the box. The square in zone 2 and the row of dots in zone 4 play while their own center rises between these two lines, so each plays in full view.
- Pinned span: Zone 3's height less one box. How long the card holds still; its three stages share it equally.
- Run-out: One box height. Space after the last zone, so it can finish and leave.

## Scrub Animation

Scroll plays it forward and back, like dragging a video. Best for product tours.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/scrub-animation/
- How it runs: follows the scroll
- Good for: Product tours · Explainers · Step-by-step diagrams
- Avoid on: Short sections · Key information

**Prompt**

Add a scroll-scrubbed animation to [your illustration or product explainer]. Hold the scene in view while the visitor scrolls through a taller section, and turn how far they have scrolled into a progress value from 0 to 1. Draw the whole route up front, place the moving object at the point on it that matches the progress, facing along the path, and fill in the part already traveled. Nothing plays on a timer: scrolling back simply moves it back. Shape the progress with the easing given in the settings. If the visitor has reduced motion turned on, drop decorative effects but keep the object following the scroll. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Feel: **Even** · Gentle · Smooth · Slow start. How scroll turns into progress: even follows the scroll one to one; gentle eases in and out; smooth slows toward the end; slow start begins slowly and speeds up.

## Pin Animation

One part stays put while its text changes on scroll. Best for feature lists.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/pin-animation/
- How it runs: follows the scroll
- Good for: Feature lists · Product tours · Onboarding
- Avoid on: Short screens · Long text

**Prompt**

Add a pinned section to [your product page, and the element that should stay in view]. Make the section several screens tall and pin the element and its text in the middle of the view while the visitor scrolls through it; the extra height is how long it stays. Split that distance into equal parts and show the next feature's text and picture in each part. When the section ends, let the element scroll away with the page. Use the browser's sticky positioning for the pin instead of moving it with a script. If the visitor has reduced motion turned on, change the features without animation.

**Settings**: none, so the prompt is complete as it is. The demo's own values:

- Pinned section: Three box heights. The phone holds still for the two extra box heights; a taller section makes each feature last longer.
- Number of features: 4. The features share the pinned scrolling equally.
- Pinned at: The top of the box. Where the pinned frame sticks; the phone sits in its middle.

## Snap Scrolling

The box settles on one whole section at a time. Best for slides and galleries.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/snap-scrolling/
- How it runs: follows the scroll
- Good for: Slides · Galleries · Onboarding · Full-screen sections
- Avoid on: Long articles · Uneven sections

**Prompt**

Add snap scrolling to [your page of full-height sections, slides or gallery]. Make each section exactly as tall as the scrolling area and mark its top as a snap point, so that, as the settings choose, the view settles on the nearest section instead of stopping between two. Use the browser's built-in scroll snapping rather than a script. Add small dots that show which section is in view and take the visitor to a section when pressed. Check scrolling with the arrow keys too, because strict snapping can feel stiff there. If the visitor has reduced motion turned on, let the view settle without a smooth glide. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Snapping: **Always** · When close · Off. Always settles on a section after every scroll; when close settles only when the box stops near one; off never snaps.

## Scrollytelling

A picture beside the story changes as you read down. Best for data stories.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/scrollytelling/
- How it runs: follows the scroll
- Good for: Data stories · Explainers · Long reads
- Avoid on: Short pages · Quick reference

**Prompt**

Add a scrollytelling layout to [your story and the picture that goes with it]. Put the story in a column of chapters that scrolls, and keep the picture in view beside it. Work out which chapter has passed a reading line about 40% down the view and how far it is toward the next, as a fraction, and blend every value in the picture between the two chapters with it, such as colors and a counting number, so the picture changes smoothly as the visitor reads. On phones, pin a short strip of the picture above the text. If the visitor has reduced motion turned on, change the picture without fading.

**Settings**: none, so the prompt is complete as it is. The demo's own values:

- Reading line: 42% down the box. A chapter becomes current once its top passes this line; a higher line changes chapters later, a lower one sooner.
- Chapter height: At least 90% of the box. How much scrolling each chapter takes; taller chapters make slower, finer blends.
- Number of chapters: 6. Each chapter adds its colors and its depth to the blend.

## Reveal on Scroll

Cards appear as they cross a line in the box. Best for long landing pages.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/reveal-on-scroll/
- How it runs: follows the scroll
- Good for: Landing pages · Feature lists · Blog sections
- Avoid on: Key information · Forms

**Prompt**

Add reveal-on-scroll animations to [the sections or cards on your page]. Keep each element in a hidden starting state, such as faded, shifted, shrunk, blurred or clipped, until it rises past a trigger line inside the view, then let it settle into its normal state. Watch the elements with the browser's intersection observer rather than on every scroll, and count an element that is already above the line as crossed, so a fast scroll never skips one. Reveal each element once, or every time it crosses, as the settings say. If the visitor has reduced motion turned on, show each element without movement. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Trigger line: Higher · **Normal** · Lower. Where the dashed line sits: higher is halfway down the box, normal 70% down and lower 90% down; the higher the line, the further a card must scroll before it appears.
- Plays every time: on · **off**. Off, each card appears once and stays; on, it hides again when it drops back below the line and replays the next time.

## Stagger Reveal

Items in a group appear one after another as it scrolls in. Best for card grids.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/stagger-reveal/
- How it runs: follows the scroll
- Good for: Card grids · Search results · Menus · Galleries
- Avoid on: Long lists · Key information

**Prompt**

Add a stagger reveal to [your grid, list or group of items]. When the group scrolls into view, reveal its items one after another instead of all at once: each item fades in and rises a little, starting a short delay after the one before, in the order the settings choose. Make each item's own animation longer than the delay between items, so they overlap into one sweep, and keep the whole cascade under about 600ms on long lists. If the visitor has reduced motion turned on, show the items without movement. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Delay between items: Short · **Medium** · Long. The wait before each next item: short is 30ms, medium 50ms and long 80ms; 40 to 60ms reads as a sweep, and under 30ms the items seem to arrive together. These values suit the demo's grid of 12 small items; a few large cards need a longer wait, about 100 to 150ms, to come in visibly one after another.
- Order: **First to last** · Last to first · From the middle · Random. Which item goes first: first to last, last to first, from the middle outward, or a random order each time.

## Horizontal Scroll

Scroll down and a row of panels slides sideways. Best for portfolios.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/horizontal-scroll/
- How it runs: follows the scroll
- Good for: Portfolios · Timelines · Product features · Step-by-step tours
- Avoid on: Long text · Forms

**Prompt**

Add a horizontal scroll section to [the panels or projects you want to show]. Place the panels side by side in one long strip inside a section that is several screens tall. As the visitor scrolls down through that section, pin its inner frame in place and slide the strip to the left in step with the scroll, so scrolling down moves the panels sideways; once the last panel is in view, release the frame and let the page scroll on. Give the strip an explicit width so it can move. Keep the visitor's own scrolling, touch included, so scrolling back up slides the panels back. If the visitor has reduced motion turned on, keep the strip tied exactly to their scrolling, with no easing or snapping added.

**Settings**: none, so the prompt is complete as it is. The demo's own values:

- Number of panels: 5. Each panel is one box wide, and the strip is as wide as all of them together.
- Pinned section height: Five box heights. The strip slides while the box scrolls through it; a taller section makes each panel pass more slowly.
- Lead-in and lead-out: Six tenths of a box height each. The space before and after the section, so you see it arrive, hold still and let go.

## Sticky Section

A section holds still while its content changes. Best for feature tours.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/sticky-section/
- How it runs: follows the scroll
- Good for: Feature tours · How-it-works steps · Product pages
- Avoid on: Long text · Short pages

**Prompt**

Add a sticky section to [the steps or features you want to walk through]. Make the section several screens tall and pin its inner frame to the top of the screen while the visitor scrolls through it. Split that scroll distance into equal parts, one per step, and as each part is reached, fade the text and the picture over to the next step while the frame itself stays still. After the last step, let the section scroll away so the page carries on. Work out the step from the scroll position, so scrolling back up steps backwards. If the visitor has reduced motion turned on, switch the steps without fading.

**Settings**: none, so the prompt is complete as it is. The demo's own values:

- Number of steps: 4. Each step owns an equal share of the scrolling while the section holds still.
- Wrapper height: Four box heights. The section holds still for three of them; a taller wrapper makes each step last longer.
- Fade between steps: 0.5 s. How long the text takes to fade to the next step; the picture takes 0.6 s.

## Counter Animation

Numbers count up when they scroll into view. Best for stats.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/counter-animation/
- How it runs: follows the scroll
- Good for: Stats · Annual reports · Landing pages · Dashboards
- Avoid on: Prices · Data tables

**Prompt**

Add a count-up animation to [the numbers in your stats section]. When the numbers scroll far enough into view, count each one up from zero to its total, and format it on every step so commas, currency signs and units show the whole way through, not just at the end. Count again if the numbers leave the view and come back. When the settings include it, start each number a moment after the one before for a cascade. Screen readers should hear each final number once, never the steps in between. If the visitor has reduced motion turned on, show the final numbers straight away. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Starts counting: Early · **Middle** · Late. The line the top of the tiles must pass before the numbers may count: early is a tenth of the way up the box, middle 40% of the way up and late 70%. Each number then waits until half of it is inside the box, so on a short box early and middle start at almost the same place.
- Speed: Slow · **Normal** · Fast. How long each count takes: slow is 2.9 s, normal 1.8 s and fast 1.1 s.
- Feel: **Smooth** · Slow finish · Springy · Even. Smooth slows to a stop; Slow finish races to near the total, then creeps through the last digits; Springy goes a little past and settles back; Even counts at one steady pace, which feels mechanical.
- One after another: **on** · off. Each number starts 200ms after the one before, so the four count in a cascade.

## Progress Bar

A bar fills as you read down the page. Best for long articles.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/progress-bar/
- How it runs: follows the scroll
- Good for: Long articles · Documentation · Tutorials · Reports
- Avoid on: Short pages

**Prompt**

Add a reading progress indicator to [your article or long page]. Work out how far the reader has scrolled as a share of the total distance they can scroll, and show it as a bar that fills along the top, a ring that fills in a corner, or a thin rail down the side, so it is full exactly when the last line is in view. Keep the indicator outside the scrolling content so it stays in place, and grow it with a transform rather than by changing its width, so scrolling stays smooth. Hide the indicator from screen readers; it only repeats what scrolling shows. It follows the reader's own scrolling, so reduced motion needs no change. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Indicator: **Top bar** · Ring · Side rail. The top bar is the most noticeable; the ring in the corner takes the least room and shows the percentage; the side rail is the quietest.
- Thickness: Thin · **Medium** · Thick. Thin is 2px, medium 3px and thick 6px; thin is almost invisible until you look for it, thick is hard to miss.
- Color: **Blue** · Green · Orange · Purple. The color of the fill.

## Section Wipe

Each section slides up over the one before. Best for full-screen stories.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/section-wipe/
- How it runs: follows the scroll
- Good for: Full-screen stories · Landing pages · Case studies
- Avoid on: Long text · Documentation

**Prompt**

Add a section wipe to [the full-screen sections of your page]. Make each section exactly one screen tall, stick each one to the top as the visitor scrolls, and stack them so every section sits above the one before; the next section then slides up and covers the current one instead of pushing it away. While a section is being covered, shrink its content in step with the scroll so it seems to sink behind the one arriving, unless the settings turn the shrink off. Nothing ever covers the last section. If the visitor has reduced motion turned on, keep the wipe but skip the shrink. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Shrink: None · **A little** · A lot. How small the covered section gets: none keeps it full size, a little is 96% and a lot 88%; smaller sinks it deeper.
- Shrink speed: Quick · Medium · **Gradual**. How much of the wipe the shrink takes: gradual spreads it over the whole wipe, medium over the first 60% and quick over the first 30%.

## Zoom Into Image

A small window opens up to fill the box as you scroll. Best for hero images.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/zoom-into-image/
- How it runs: follows the scroll
- Good for: Hero images · Gallery intros · Section breaks
- Avoid on: Small images · Text-heavy pages

**Prompt**

Add a zoom-into-image effect to [your featured picture]. Pin the picture in place while the visitor scrolls through a section a couple of screens tall, and show only a small window of it at first. As they scroll, open that window outward in step with the scroll until the picture fills the whole frame, then fade in a caption. Uncover the picture by clipping it rather than scaling it up, so it stays sharp, and let scrolling back up close the window again. If the visitor has reduced motion turned on, show the full picture and the caption from the start. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Starting window: Small · **Medium** · Large. How much of the picture shows at first: small is a window a fifth of the box wide, medium two fifths and large three fifths.
- Corners: Square · **Rounded** · Very rounded. How round the window's corners are at the start: square, 16px or 32px; they straighten as the window opens.
- Shows the starting frame: **on** · off. A faint outline stays where the window began, so you can see how far it has opened; it fades out as the caption fades in.

## Scroll Image Sequence

Scrolling plays a series of pictures like a flip-book. Best for products.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/scroll-image-sequence/
- How it runs: follows the scroll
- Good for: Product reveals · 3D objects · Launch pages
- Avoid on: Slow connections · Text content

**Prompt**

Add a scroll-driven image sequence to [your product or object animation]. Export the animation as a numbered series of pictures and load them all before the section comes into view. Pin a canvas in place while the visitor scrolls through a section a few screens tall, turn their scroll position into a frame number, and draw that frame whenever it changes, so scrolling plays the sequence like a flip-book and scrolling back plays it in reverse. When the settings include it, let the picture ease toward the frame the scroll points at instead of jumping. Give the canvas a text description for screen readers. If the visitor has reduced motion turned on, jump straight to each frame. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Number of frames: Few · **Normal** · Many. How many pictures the sequence has: few is 24, normal 120 and many 240; more frames scrub more smoothly but are more images to load in production.
- Glides between frames: **on** · off. The picture eases toward the frame the scroll points at instead of jumping to it.

## Smooth (Inertia) Scroll

Scrolling glides to a stop instead of jumping. Best for portfolio sites.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/smooth-scroll/
- How it runs: reacts to the visitor
- Good for: Portfolio sites · Brand pages · Scroll stories
- Avoid on: Documentation · Forms · Dashboards

**Prompt**

Add smooth scrolling to [the scrolling area or page you want to glide]. Catch the visitor's wheel, swipe and drag and turn each one into a target position, then on every frame move the content part of the remaining distance toward that target, so it glides and slows to a stop instead of jumping. Make that part exponential in the time since the last frame (one minus a fixed fraction to the power of that time), so the pace is the same on every screen. Move the content with a transform and keep a custom scrollbar in step with it. Keep keyboard scrolling, links to headings and find-in-page working. If the visitor has reduced motion turned on, use the browser's normal scrolling with no glide. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Glide: Long · **Medium** · Short. How much of the remaining distance the content covers in a sixtieth of a second: long is 5%, medium 9% and short 16%, so 95% of a scroll has landed after about 1 s, 0.5 s and 0.3 s; a longer frame covers more, so the glide takes as long on every screen; long feels heavy and floaty, short is closer to normal scrolling.

## Text Fill on Scroll

Words light up one by one as you scroll. Best for key statements.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/text-fill-on-scroll/
- How it runs: follows the scroll
- Good for: Key statements · Manifestos · Landing page intros
- Avoid on: Body text · Long articles

**Prompt**

Add a scroll-driven text fill to [the statement or paragraph you want read]. Pin the paragraph in place while the visitor scrolls through a section a few screens tall. Split it into words, show every word in a dim but readable gray, and light the words up one by one in step with the scroll, so how far the reader has scrolled decides how much is lit and scrolling back up un-lights them. When the settings include it, show the next word to fill in a highlight color, like a reading cursor. Keep it real text for screen readers. If the visitor has reduced motion turned on, change each word's color without fading. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Highlights the current word: **on** · off. The next word to fill shows in the highlight color, like a reading cursor.
- Fill finishes: Early · **Normal** · At the end. How far through the scrolling the last word lights: early at 70%, normal at 90% and at the end at 100%; finishing early leaves a moment to read the whole text.
- Highlight color: **Blue** · Green · Orange. The color of the word being filled.

## Scroll Velocity Skew

Rows lean when you scroll fast and straighten when you stop. Best for galleries.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/scroll-velocity-skew/
- How it runs: follows the scroll
- Good for: Galleries · Portfolios · Project lists
- Avoid on: Reading content · Forms

**Prompt**

Add a velocity skew to [the rows or cards in your list or gallery]. Measure how far the list scrolls on each frame, smooth that speed so it rises and falls gradually, and lean every row by an angle in proportion to it, up to a limit. Fast scrolling leans the rows; when the scrolling stops, the speed falls to zero and they spring back straight. Lean each row on its own rather than the whole list, and stop the frame loop once everything is still. This effect can make some people feel unwell, so if the visitor has reduced motion turned on, keep the rows straight and scroll normally. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Strength: Subtle · **Normal** · Strong. How far the rows lean for a given scroll speed: subtle is 0.2°, normal 0.35° and strong 0.6° for each pixel scrolled in a sixtieth of a second.
- Lean: **Tilt** · Slant. Tilt tips each row like a slope, the classic look; Slant leans it sideways like italic text.
- Spring back: Slow · **Normal** · Quick. How quickly the lean follows the scroll speed and fades after you stop: in each sixtieth of a second the lean closes 7% of the gap to the lean the scroll speed calls for when slow, 12% at normal and 20% when quick, so 95% of it is gone about 0.7 s, 0.4 s and 0.2 s after you stop; slow feels heavy, quick feels twitchy.
- Most it leans: Small · **Medium** · Large. The largest angle allowed: 6°, 12° or 20°, so a fast flick cannot fold the rows over.

## SVG Line Draw on Scroll

A line draws itself along a route as you scroll. Best for timelines.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/svg-line-draw/
- How it runs: follows the scroll
- Good for: Timelines · Journey maps · Process steps · Delivery tracking
- Avoid on: Short pages

**Prompt**

Add a scroll-drawn route to [your timeline, journey or process steps]. Draw a long winding path down the page with a faint dashed copy underneath, and reveal the solid line in step with the scroll so its tip travels down with the visitor. Measure the path's length once and reveal it by sliding a single dash that is exactly as long as the path. When the settings include them, place labeled stops along the path and pop each one in as the line reaches it; scrolling back up erases the line and hides them again. If the visitor has reduced motion turned on, show each stop without the pop. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Feel: **Even** · Smooth. Even keeps the tip of the line level with your scroll; Smooth draws quickly at first and slows toward the end.
- Shows the stops: **on** · off. Five labeled stops pop in as the line reaches them and hide again when you scroll back.
- Line finishes: Early · Near the end · **At the end**. How far through the scrolling the line is complete: early at 70%, near the end at 85% and at the end at 100%; finishing early shows the whole route before you reach the bottom.

## Scrollspy Navigation

A menu highlights the section you are reading. Best for long docs.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/scrollspy-nav/
- How it runs: follows the scroll
- Good for: Documentation · Long articles · Settings pages
- Avoid on: Short pages

**Prompt**

Add a scrollspy menu to [your documentation or long page and its section headings]. Keep a menu of section links in place beside the content and highlight the link for the section being read, with a marker that slides to it: a section becomes current once its heading scrolls up past a chosen line, and the last link lights up at the very bottom. Clicking or tapping a link scrolls to its section and lights that link at once, without flickering through the links in between. On phones, turn the menu into a strip across the top. If the visitor has reduced motion turned on, jump to sections instead of gliding. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Link changes at: Near the top · **A third down** · Halfway. Where a section's heading must reach before its link lights: near the top is 20% down the box, a third down 35% and halfway 50%; a higher line switches later.
- Glides to the section: **on** · off. A link glides to its section; off, it jumps there at once, as it always does under reduced motion.

## Scroll-Driven Background Color

The background color changes as you scroll through sections. Best for stories.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/scroll-background-color/
- How it runs: follows the scroll
- Good for: Stories · Portfolios · Case studies
- Avoid on: Text-heavy pages · Forms

**Prompt**

Add a scroll-driven background color to [the sections of your page]. Give each section a color, and as the visitor scrolls, change the page background from one section's color to the next in step with their position, blending between them unless the settings ask for a hard cut, so the color follows the scroll both ways. Blend in a perceptual color space so the colors in between stay clean. Check the text against the background at every point, and switch the text to dark when the background turns light. A change of color is not movement, so keep it when the visitor has reduced motion turned on. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Colors: **Dusk** · Daylight · Forest. The palette, one color per section: Dusk stays dark; Daylight passes through pale colors and Forest through a light green, and the text turns dark on those.
- Blend: **Gradual** · Quick · Hard cut. Gradual changes the color the whole way between sections; Quick holds each color and changes it near the boundary, over the middle 30% of the scroll from one section to the next; Hard cut switches at the boundary with no blend, to show why the blend matters.

## Hide-on-Scroll Header

Scrolling down hides the top bar; scrolling up shows it. Best for mobile pages.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/01-scroll-based/hide-on-scroll-header/
- How it runs: reacts to the visitor
- Good for: Mobile pages · News and blogs · Long articles · Online shops
- Avoid on: Short pages · Bars with key buttons

**Prompt**

Add a hide-on-scroll header to [the top bar of your site]. When the visitor scrolls down, slide the bar up out of view, or shrink it to a slim strip if the settings ask for that; when they scroll back up, bring it back as the settings say. Tell the direction by comparing each scroll position with the last one, ignore moves of a few pixels so the bar never flickers, and always show it near the top of the page. Let the bar float over the content, move it only with a transform and read the scroll once per frame. Touch scrolling counts too. If the visitor has reduced motion turned on, fade the bar out and in instead. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. How long the slide takes: slow is 700ms, normal 300ms and fast 150ms.
- Comes back: **On any scroll up** · Only near the top. On any scroll up brings the bar back at the first move up; Only near the top keeps it away until the page is back within two bar heights of the top.
- Shrinks instead of hiding: on · **off**. Keeps a slim strip of the bar in view, with smaller contents, instead of sliding it all away.
