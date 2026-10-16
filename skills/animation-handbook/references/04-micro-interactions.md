# 04 · Micro-Interactions

Short, user-triggered animations — hover, click, focus, loading states, and UI feedback patterns. 43 animations from Animation Handbook, in the home page's order. Each entry gives the live demo, how it runs, what it is good for and what to avoid it on, the prompt from its page word for word, and its settings with what each does and the demo's values.

## Contents

- [Hover State Animation](#hover-state-animation)
- [Click / Tap Ripple](#click--tap-ripple)
- [Focus Ring Animation](#focus-ring-animation)
- [Button Press Scale](#button-press-scale)
- [Magnetic Button](#magnetic-button)
- [Toggle / Switch Slide](#toggle--switch-slide)
- [Heart / Like Burst](#heart--like-burst)
- [Success Confetti](#success-confetti)
- [Skeleton Loader](#skeleton-loader)
- [Shimmer Effect](#shimmer-effect)
- [Loading Spinner](#loading-spinner)
- [Progress Animation](#progress-animation)
- [Checkmark Draw](#checkmark-draw)
- [Form Field Morph](#form-field-morph)
- [Notification Badge Pulse](#notification-badge-pulse)
- [Tooltip Reveal](#tooltip-reveal)
- [Drawer / Panel Slide](#drawer--panel-slide)
- [Modal Expand](#modal-expand)
- [Accordion Open/Close](#accordion-openclose)
- [Cursor Follower](#cursor-follower)
- [Error Shake](#error-shake)
- [Swipe to Dismiss](#swipe-to-dismiss)
- [Hamburger Menu Toggle](#hamburger-menu-toggle)
- [Theme Toggle Morph](#theme-toggle-morph)
- [Copy to Clipboard](#copy-to-clipboard)
- [Star Rating](#star-rating)
- [Toast Notification](#toast-notification)
- [Segmented Control](#segmented-control)
- [Pull to Refresh](#pull-to-refresh)
- [Animated Gradient Border](#animated-gradient-border)
- [Spotlight Hover Glow](#spotlight-hover-glow)
- [Add-to-Cart Fly](#add-to-cart-fly)
- [Drag to Reorder](#drag-to-reorder)
- [Rolling Numbers](#rolling-numbers)
- [Typing Indicator](#typing-indicator)
- [Hold to Confirm](#hold-to-confirm)
- [Expanding Search](#expanding-search)
- [Button Loading States](#button-loading-states)
- [Image Trail](#image-trail)
- [Gooey Menu](#gooey-menu)
- [Dynamic Island](#dynamic-island)
- [Before/After Slider](#beforeafter-slider)
- [Magnifier Lens](#magnifier-lens)

## Hover State Animation

Six ways a card can react when you point at it. Best for buttons and cards.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/hover-state/
- How it runs: reacts to the visitor
- Good for: Buttons · Links · Cards · Menus
- Avoid on: Plain text · Non-clickable items

**Prompt**

Add hover feedback to [the buttons, links or cards you want to react]. When the pointer moves over an item, change it in one clear way: shift its background color, grow it slightly, lift it with a deeper shadow, draw an underline out from the left, nudge its arrow forward, or sweep a tint across it. Use one style per kind of item and keep it the same across the page. Apply hover styles only on devices that can hover, and show the same change while an item is pressed on touch screens. If the visitor has reduced motion turned on, switch the look without animating it. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. How long each change takes: slow is 300ms, normal 180ms and fast 110ms; keep hover changes at 200ms or less so moving across several items never feels sticky.
- Feel: **Smooth** · Springy · Gentle · Even. Smooth slows into place; Springy goes a little too far, then settles; Gentle eases in and out; Even keeps one steady pace.

## Click / Tap Ripple

A ripple spreads out from the spot you press. Best for buttons and list items.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/click-ripple/
- How it runs: reacts to the visitor
- Good for: Buttons · List items · Menu items · Icon buttons
- Avoid on: Links in text · Large panels

**Prompt**

Add a ripple to [the buttons or list items you want to respond to presses]. When the visitor presses one, a soft circle appears where they pressed, or in the middle when the settings say so, then grows outward and fades away. Clip it to the button's shape so it never spills outside, start it as soon as the press begins so the feedback feels instant, and remove each ripple once it has faded so quick taps do not pile up. It should work the same for mouse, touch and pen. If the visitor has reduced motion turned on, fade a flat highlight over the button instead of a growing circle. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Starts from: **Where you press** · The middle. Where you press shows exactly where the press landed; the middle is simpler but less exact.
- Speed: Slow · **Normal** · Fast. How long the ripple takes to spread and fade: slow is 1000ms, normal 600ms and fast 350ms; a little longer than a hover change, because the click is already made.
- Ripple size: Small · **Medium** · Large. How far the circle grows before it fades: small, medium and large end 3, 5 and 8 times the button's longer side across; even small reaches every corner of the button.
- Ripple strength: Faint · **Medium** · Strong. How visible the ripple is at the start: faint is 20%, medium 40% and strong 60%.
- Ripple color: **White** · Orange · Black. White suits colored buttons, orange matches the accent, black suits light buttons.

## Focus Ring Animation

A ring closes in around the item the Tab key reaches. Best for forms and menus.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/focus-ring/
- How it runs: reacts to the visitor
- Good for: Forms · Buttons · Links · Menus
- Avoid on: Non-interactive items

**Prompt**

Add an animated focus ring to [the links, buttons and form fields on your page]. When keyboard focus moves to an item, draw an outline around it that starts a little further out and faint, then closes in to its place, so each Tab press is easy to follow. Show the ring only for keyboard focus, not after mouse clicks, and never remove the browser's focus outline without drawing this one instead. Make sure the ring stands out against every background it sits on. If the visitor has reduced motion turned on, show the ring at once without closing in. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Ring style: **Solid** · Dashed · Glow · Wide. Solid is a plain outline; Dashed draws it in dashes; Glow adds a soft halo, a band of the ring's color at 18% opacity reaching 5px out from the item; Wide fills the gap between the item and the ring, making one thick band.
- Speed: Slow · **Normal** · Fast. How long the ring takes to close in from 8px further out: slow is 220ms, normal 140ms and fast 80ms; fast enough not to feel delayed, slow enough to see.
- Ring thickness: Thin · **Medium** · Thick. Thin is 1px, medium 2px and thick 4px; 2px or more is easy to see.
- Ring gap: None · **Small** · Large. The space between the ring and the item: none, 3px or 6px; 2 to 4px looks natural.

## Button Press Scale

Shrinks as you press it and springs back as you let go. Best for main buttons.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/button-press-scale/
- How it runs: reacts to the visitor
- Good for: Main buttons · Icon buttons · Mobile apps
- Avoid on: Links in text · Large cards

**Prompt**

Add press feedback to [the buttons you want to feel tactile]. While a button is held down it shrinks, as if pushed in, and when it is let go it returns to full size. A press that is quicker than the release feels most like a real button. Respond to mouse, touch and pen presses and to Space and Enter on the keyboard, and let go cleanly if a press turns into a scroll, so no button stays stuck down. Change only the button's size so nothing around it moves. If the visitor has reduced motion turned on, change the size at once, without animating it. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Press depth: Light · **Medium** · Deep. How small the button gets while held down: light is 97%, medium 95% and deep 90% of its size; smaller than 90% looks broken.
- Release speed: Slow · **Normal** · Fast. How long it takes to spring back: slow is 300ms, normal 180ms and fast 110ms; about twice the press time feels natural.
- Release feel: **Springy** · Smooth · Even. Springy goes a little past full size, then settles; Smooth slows into place; Even keeps one steady pace.
- Press speed: Slow · **Normal** · Fast. How long the shrink takes: slow is 130ms, normal 80ms and fast 50ms; a press should feel instant.

## Magnetic Button

Leans toward the pointer, then springs home. Best for one main button.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/magnetic-button/
- How it runs: reacts to the visitor
- Good for: Hero buttons · Portfolio sites · One key action
- Avoid on: Forms · Rows of buttons

**Prompt**

Add a magnetic effect to [the one button you want to stand out]. When the pointer comes within reach, pull the button part of the way toward it, more strongly the closer it gets, and move its label a little further so the label seems to float above the button. When the pointer leaves, let the button spring back to its place. Move it only with transforms so the layout never shifts, and use it on one or two buttons at most. On touch screens, pull the button toward the finger while it touches and send it home when it lifts. If the visitor has reduced motion turned on, move it quickly and evenly instead of letting it glide. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Pull strength: Gentle · **Medium** · Strong. How far the button moves toward the pointer: gentle is 20%, medium 35% and strong 50% of the distance when the pointer is close, a smaller share the farther it is, down to none at the edge of Reach; past about half it feels loose.
- Reach: Short · **Medium** · Long. How close the pointer must come before the pull starts: short is 100px, medium 160px and long 240px; too far and the button reacts to unrelated movement.

## Toggle / Switch Slide

The knob slides across as the switch turns on or off. Best for settings.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/toggle-switch/
- How it runs: reacts to the visitor
- Good for: Settings · Preferences · Dark mode switches
- Avoid on: Forms sent later · More than two options

**Prompt**

Add an animated toggle switch to [the on/off setting you want to control]. Build it on a real checkbox so it works with the keyboard and screen readers. When it is turned on, the round knob slides across the track and the track fills with color; when it is turned off, both go back. When the settings ask for it, let the knob go slightly past the end and settle, so it feels springy. Make the whole switch and its label easy to tap. If the visitor has reduced motion turned on, move the knob without sliding. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. How long the knob takes to slide: slow is 320ms, normal 200ms and fast 120ms; under 120ms feels mechanical, over 350ms sluggish.
- Feel: Smooth · **Gentle** · Even. Gentle eases in and out, which gives the knob weight; Smooth starts fast and slows to a stop; Even slides at one steady speed.
- Springy knob: **on** · off. The third switch's knob goes a little past the end, then settles.
- On color: Pink · **Blue** · Purple · Green · Orange. The track color when a switch is on; it must stand out from the white knob. The Appearance switch keeps its own orange.

## Heart / Like Burst

The heart pops and fills as small hearts burst out. Best for like buttons.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/heart-burst/
- How it runs: reacts to the visitor
- Good for: Like buttons · Favorites · Bookmarks · Reactions
- Avoid on: Delete buttons · Neutral toggles

**Prompt**

Add a like button with a burst to [the heart or favorite button you want to reward]. When the visitor likes something, the heart quickly squashes, overshoots a little and settles as it fills with color, while a spray of tiny hearts and dots flies out from its center, arcs down and fades. Unliking simply removes the color, with no burst. Draw the burst on one layer over the button and stop drawing once the last piece has faded. Tell screen readers whether it is liked. If the visitor has reduced motion turned on, only fill the heart, with no pop or burst. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Number of hearts: Few · **Some** · Many. How many pieces burst out: few is 10, some 18 and many 32; above about 40 it gets busy and costs frames.
- How far they fly: Short · **Medium** · Far. How far the pieces travel before they fade: short, medium and far launch them at up to 300, 450 or 700px a second (at least half that), and they slow, fall and fade out over about three quarters of a second, the fastest ending about 150, 225 or 350px to the side of the heart.

## Success Confetti

Confetti bursts from the button when a task is done. Best for big moments.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/success-confetti/
- How it runs: reacts to the visitor
- Good for: Orders placed · Sign-ups finished · Milestones
- Avoid on: Everyday clicks · Serious tasks

**Prompt**

Add a confetti burst to [the action that completes something important, such as placing an order]. When it succeeds, turn the button into a clear success state with a check mark and a short confirmation, and fire small colored rectangles from the button: they shoot upward in a fan, spin, slow down, fall and fade. Save it for real milestones, not everyday clicks. Draw the pieces on one layer and stop drawing once the last one has faded or fallen out of view. If the visitor has reduced motion turned on, show the success state without the confetti. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Amount of confetti: Some · **Medium** · Lots. How many pieces fly: some is 60, medium 120 and lots 200; above about 200 costs frames on slower phones for little gain.
- Spread: Narrow · **Medium** · Wide. How wide the fan is: narrow is 60°, medium 110° and wide 170°; narrow looks like a fountain, wide like a dome.
- Fall speed: Floaty · **Normal** · Heavy. How strongly the pieces are pulled down: floaty, normal and heavy speed their fall by about 540, 1,000 and 1,600px a second every second, against launch speeds of 360 to 780px a second, so the fastest pieces climb about 560, 300 or 180px before they fall; heavy falls fast, floaty drifts.

## Skeleton Loader

Gray shapes hold the place of content while it loads. Best for feeds and cards.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/skeleton-loader/
- How it runs: plays once
- Good for: Feeds · Cards · Lists · Dashboards
- Avoid on: Very short waits · Unknown layouts

**Prompt**

Add a skeleton loading state to [the card, list or panel whose content loads]. While it loads, show gray blocks in the shapes and sizes of the content that is coming, such as a round avatar, lines of text and an image, and let them pulse between dimmer and brighter. When the content is ready, swap the blocks for it and fade it in. Match the shapes closely, because a skeleton that does not fit the content makes the page jump when it arrives. If the visitor has reduced motion turned on, keep the blocks still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Pulse speed: Slow · **Normal** · Fast. How long one pulse takes: slow is 2.4s, normal 1.5s and fast 0.9s; one to two seconds feels calm, faster feels anxious.
- Pulse strength: Soft · **Medium** · Strong. How far the blocks fade between pulses: soft, medium and strong fade them to 70%, 50% and 30% opacity and back to full; a soft pulse is enough.
- Loading time: Short · **Medium** · Long. How long the placeholders show before the content fades in: short is 1s, medium 2s and long 3.5s.

## Shimmer Effect

A band of light sweeps over gray placeholders. Best for loading screens.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/shimmer-effect/
- How it runs: moves by itself
- Good for: Feeds · Cards · Lists · Image galleries
- Avoid on: Very short waits · Busy pages

**Prompt**

Add a shimmer to [the skeleton placeholders on your loading screen]. Lay a band of light over each placeholder and sweep it across in one direction, again and again, so the gray shapes look like content streaming in. Every placeholder on the page should shimmer in the same direction, and each one must clip the band to its own edges so it never spills out. Keep the band see-through so it works on any placeholder color. If the visitor has reduced motion turned on, keep the placeholders still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. How often the light crosses: slow every 1.2s, normal every 0.75s and fast every 0.45s; more often than about every 0.4s it feels frantic.
- Brightness: Soft · **Medium** · Bright. How strong the band of light is: soft, medium and bright are 12%, 25% and 45% opacity at its center; soft is subtle, bright suits a branded screen.
- Highlight angle: **Upright** · Slanted · Diagonal. Upright sweeps a straight band; Slanted tilts it 25° and Diagonal 45°; keep one angle across the whole page.
- Highlight color: **White** · Blue · Gold. White works on any placeholder; blue or gold suit branded screens.

## Loading Spinner

Six small shapes loop to show that something is loading. Best for short waits.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/loading-spinner/
- How it runs: moves by itself
- Good for: Network waits · Buttons while sending · Short waits
- Avoid on: Known-length tasks · Very quick loads

**Prompt**

Add a loading spinner to [the place where people wait for something to load]. Use a small shape that keeps moving in a steady loop, such as a ring with one colored part turning around, dots circling or dots bouncing in turn, to show that work is going on when you cannot say how long it will take. Show it only for waits longer than about half a second, and tell screen readers that something is loading. If you know how far along the task is, use a progress bar instead. If the visitor has reduced motion turned on, fade it gently instead of spinning. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. How long one turn takes: slow is 1.3s, normal 0.8s and fast 0.5s; 0.6 to 1 second reads as calm, faster as anxious.
- Size: Small · **Medium** · Large. Small is 28px, medium 40px and large 52px; small fits inside a button, large fills an empty area.
- Color: Pink · White · **Blue** · Purple · Green · Orange. The spinner's color; pick one that stands out from the page.

## Progress Animation

A bar, a ring and steps fill up to show progress. Best for uploads.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/progress-animation/
- How it runs: plays once
- Good for: Uploads · Downloads · Multi-step forms · Installs
- Avoid on: Unknown waits · Fake progress

**Prompt**

Add a progress indicator to [the upload, download or task whose progress you know]. Show how much is done with a bar that fills from left to right, a ring whose outline fills around the circle, or a row of steps that light up in turn, all driven by the same percentage and shown with the number. Fill it smoothly as progress arrives, and only show real progress: never race to near the end and stall. When the settings ask for it, slide a short piece along the bar for waits of unknown length. If the visitor has reduced motion turned on, jump straight to the current value. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Fills to: 50% · 75% · **100%**. How far one play fills: 50%, 75% or 100%.
- Speed: Slow · **Normal** · Fast. How long the fill takes: slow is 3.2s, normal 2s and fast 1.2s; in a real app it follows the actual progress.
- Feel: **Smooth** · Gentle · Even. Smooth starts fast and slows near the end, which feels natural; Gentle eases in and out; Even fills at one steady pace.
- Sliding bar: on · **off**. For waits of unknown length: a short piece slides along the bar instead of filling it.
- Fill color: Pink · White · **Blue** · Purple · Green · Orange. The color of the bar, the ring and the steps.

## Checkmark Draw

A tick draws itself in a circle once a task succeeds. Best for forms.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/checkmark-draw/
- How it runs: reacts to the visitor
- Good for: Form success · Payments · Finished steps
- Avoid on: Frequent small saves

**Prompt**

Add a success check mark that draws itself to [the form or action that just finished]. After the visitor submits, show a short loading state in the button, then draw a circle and a tick inside it as if by hand: the circle first, then the tick, starting just before the circle closes. For a failure, draw a red X the same way and give it a short shake. Let the button turn green or red to match. If the visitor has reduced motion turned on, show the finished check or X at once. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Result: **Success** · Error. Success draws a circle and a tick and turns the button green; Error draws a red X, shakes it (6, 6, 4 and 4px to alternate sides over 0.4 seconds) and turns the button red.
- Speed: Slow · **Normal** · Fast. How long each line takes to draw: slow is 800ms, normal 500ms and fast 300ms, the tick starting 40% of that time after the circle (the X's second line 30% after its first); 200 to 800ms is easy to follow.
- Line thickness: Thin · **Medium** · Thick. Thin is 2px, medium 4px and thick 7px wide, on an icon 80px across whose circle is 60px wide; thick reads as confident, thin as precise.
- Feel: **Smooth** · Gentle · Even. Smooth slows at the end like a pen lifting off; Gentle eases in and out; Even draws at one steady pace.
- Tick color: Pink · White · Blue · Purple · **Green** · Orange. The color of the circle and the tick; the X stays red.

## Form Field Morph

The label moves up out of the way as you type. Best for sign-up forms.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/form-field-morph/
- How it runs: reacts to the visitor
- Good for: Sign-up forms · Sign-in forms · Checkout · Settings
- Avoid on: Long labels

**Prompt**

Add floating labels to [the form fields you want to label]. Each label sits inside its field like a placeholder; when the field is focused or has text in it, the label moves up and shrinks so it stays visible above the text, and the field's line or border takes on the focus color. When an empty field loses focus, the label moves back down. Keep a real label element for each field so screen readers announce it, and shrink the label from its left edge so it does not drift sideways. If the visitor has reduced motion turned on, move the label without animating it. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. How long the label takes to move: slow is 320ms, normal 200ms and fast 120ms; slower feels heavy on a form with many fields.
- How far it rises: Low · **Medium** · High. How far the label moves up on the underlined fields: low is 16px, medium 22px and high 28px; it must clear the typed text.
- Size when raised: Small · **Medium** · Large. How big the raised label is on the underlined fields: small is 70%, medium 80% and large 90% of its size.
- Focus color: Pink · White · **Blue** · Purple · Green · Orange. The color of the raised label and the active line or border.

## Notification Badge Pulse

A badge on an icon pulses to catch the eye. Best for unread messages.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/badge-pulse/
- How it runs: moves by itself
- Good for: Notification bells · Inboxes · Chat icons · Online status
- Avoid on: Items already seen · Many icons at once

**Prompt**

Add a pulsing notification badge to [the icon that has something new, such as a bell or an inbox]. Place a small colored dot or number on the icon's corner and let it pulse, growing and settling back or sending a soft ring outward, so it catches the eye without demanding attention. Give the badge a thin border in the background color so it seems to float above the icon. Remove the badge once the visitor has opened what it points to, and when the settings ask for it, stop the pulse after three beats. If the visitor has reduced motion turned on, keep the badge still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Pulse style: **Grow** · Ring · Both. Grow scales the badge up and back; Ring sends a soft halo outward from just around the badge, growing to 2.2 times that size as it fades from half opacity to nothing; Both does the two together.
- Speed: Slow · **Normal** · Fast. How long one pulse takes: slow is 2.4s, normal 1.5s and fast 0.9s; fast feels urgent, slow is easy to miss.
- How much it grows: Slightly · **Medium** · A lot. How big the badge gets at the top of each pulse: slightly is 115%, medium 130% and a lot 150% of its size.
- Stops after three pulses: on · **off**. The badges pulse three times and then rest; the online dot keeps going.
- Badge color: **Red** · Pink · Blue · Purple · Orange. The badge's color; red reads as new and urgent.

## Tooltip Reveal

A small label fades in after a short pause. Best for icon buttons.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/tooltip-reveal/
- How it runs: reacts to the visitor
- Good for: Icon buttons · Cut-off text · Form hints · Chart values
- Avoid on: Key information · Long text

**Prompt**

Add tooltips to [the icon buttons, shortened text or fields that need a short explanation]. When the pointer rests on an item, or keyboard focus reaches it, wait a moment, then fade the tooltip in beside it while it grows very slightly from the side facing the item, so it feels light rather than like a pop-up. The wait keeps tooltips from flashing while the pointer only passes by. When the pointer leaves, hide it again, after a pause if the settings include one, and let the Escape key close it at once. On touch screens, show and hide it with a tap. If the visitor has reduced motion turned on, fade it without growing. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Delay before showing: None · Short · **Medium** · Long. How long the pointer must rest before the tooltip shows: none, short (150ms), medium (300ms) or long (600ms); 300ms keeps tooltips from flashing as the pointer passes, and 200ms can work for very small ones.
- Speed: Slow · **Normal** · Fast. How long the fade and the slight grow (from 95% of its size) take: slow is 250ms, normal 150ms and fast 90ms.
- Delay before hiding: None · **Short** · Long. How long the tooltip stays after the pointer leaves: none, short (100ms) or long (300ms); a short pause stops it vanishing the instant the pointer slips off its item.
- Shows an arrow: on · **off**. Adds a small point that aims the tooltip at its item.

## Drawer / Panel Slide

A side panel slides in over a dimmed page. Best for mobile menus.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/drawer-slide/
- How it runs: reacts to the visitor
- Good for: Mobile menus · Filters · Settings panels
- Avoid on: Short messages · Main content

**Prompt**

Add a slide-in drawer to [the menu or panel you want to open]. It waits just beyond one edge of the screen and slides in over the page when its button is pressed; when the settings include it, the page behind it dims. Let it slow down as it arrives, like a panel sliding to a stop, and speed up as it leaves, so closing feels quicker than opening. Close it with a close button, a tap on the page beside it, the Escape key or a swipe back toward its edge. Move only its position, and keep keyboard focus inside it while it is open. If the visitor has reduced motion turned on, show and hide it without sliding. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Slides in from: **Left** · Right · Top · Bottom. The edge the drawer comes from: left or right for menus and filters, top or bottom for sheets.
- Opening speed: Slow · **Normal** · Fast. How long the slide in takes: slow is 450ms, normal 280ms and fast 170ms; it slows as it arrives.
- Closing speed: Slow · **Normal** · Fast. How long the slide out takes: slow is 350ms, normal 220ms and fast 130ms; it speeds up as it leaves, and a little shorter than opening feels right.
- Page dimming: None · Light · **Medium** · Dark. How dark the page behind gets: none, light (25% black), medium (50%) or dark (70%); darker than about 70% feels like a dialog rather than a drawer.

## Modal Expand

A window grows out of the button you pressed. Best for detail views.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/modal-expand/
- How it runs: reacts to the visitor
- Good for: Detail views · Confirmations · Quick forms · Action buttons
- Avoid on: Long content · Full pages

**Prompt**

Add a modal that grows out of its button to [the button or card that opens a dialog or detail view]. When it is pressed, measure where that button sits and grow the modal from that spot to full size in the middle of the screen while the page behind it dims, so it clearly comes from what was pressed. Close it with its buttons, a tap on the dimmed page or the Escape key, and let it shrink back toward the same spot. Animate only its scale and opacity. Move keyboard focus into it, and back to the button when it closes. If the visitor has reduced motion turned on, show it at full size without growing. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. How long the window takes to grow: slow is 500ms, normal 320ms and fast 200ms.
- Starting size: Tiny · **Small** · Medium. How big the window is as it leaves the button: tiny is 5%, small 10% and medium 30% of its full size; too big and the growth is hard to see.
- Feel: **Springy** · Smooth · Even. Springy goes a little past full size, then settles; Smooth slows to a stop; Even keeps one steady speed.
- Marks where it grows from: **on** · off. Shows a small dot on the point the window grows out of.

## Accordion Open/Close

Each question opens smoothly to show its answer. Best for FAQ pages.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/accordion/
- How it runs: reacts to the visitor
- Good for: FAQ pages · Settings · Menus · Long documents
- Avoid on: Key information · Short content

**Prompt**

Add an accordion to [the questions or sections you want to fold away]. Show only the headings at first; when one is pressed, its content box grows from nothing to its full height and the headings below slide down, and pressing it again shrinks it back. Animate the box to the content's real height, never to a large fixed maximum, or the timing looks wrong. When the settings include it, turn a small arrow to show which items are open. Make each heading a real button that tells screen readers whether it is open. If the visitor has reduced motion turned on, open and close the sections without animating. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. How long an answer takes to open or close: slow is 500ms, normal 300ms and fast 180ms.
- Feel: **Gentle** · Smooth · Even. Gentle eases in and out, which suits opening and closing alike; Smooth slows at the end; Even keeps one steady speed.
- Several open at once: on · **off**. Off closes the open answer when another opens, which keeps the list short but moves the pressed question up when the answer that closes is above it; on keeps each answer open until its question is pressed again, so nothing jumps up: the pressed question stays where it is and the questions below it only slide down to make room.
- Built with: **Measured height** · Grid rows. Measured height measures the answer before growing to it; Grid rows lets a grid row grow from nothing to its full size, with no measuring; both look the same.
- Arrow flips: **on** · off. The arrow beside each question turns to point up while its answer is open.
- Text fades in: on · **off**. The answer's text fades in and rises slightly while its box opens, each paragraph a moment after the one before.

## Cursor Follower

A dot trails your pointer and flips the colors under it. Best for portfolios.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/cursor-follower/
- How it runs: reacts to the visitor
- Good for: Portfolios · Agency sites · Interactive stories
- Avoid on: Forms and tools · Reading pages

**Prompt**

Add a cursor follower to [the page or section where it should appear]. Draw a small shape that follows the pointer with a slight delay: each frame, close a share of the gap that is exponential in the time since the last frame, so it follows at the same pace on every screen. Hide it when the pointer leaves. When the settings include them, let it flip the colors beneath it so it stays visible on light and dark areas alike, and let it grow over buttons and links. Move it with transforms only. Touch screens have no pointer, so hide it there or let it glide to where the visitor taps. If the visitor has reduced motion turned on, keep the normal cursor instead. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Lag: Short · **Medium** · Long. How closely the dot follows: on a 60 Hz screen each frame closes 35% (short), 15% (medium) or 6% (long) of the gap to the pointer, and other screens close the share that fits their frame time, so the dot gets 95% of the way in about 0.1, 0.3 or 0.8 seconds everywhere; a longer lag feels heavier.
- Size: Small · **Medium** · Large. The dot is 20px, 32px or 48px across.
- Flips the colors under it: **on** · off. The dot inverts the colors beneath it, so it stays visible on light and dark areas; off, it is a see-through orange dot.
- Shape: **Circle** · Ring · Square. A filled circle, a ring or a small square.
- Grows over buttons: **on** · off. The dot grows to two and a half times its size while the pointer is on a button.

## Error Shake

A field shakes side to side when the input is wrong. Best for sign-in forms.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/error-shake/
- How it runs: reacts to the visitor
- Good for: Sign-in forms · Codes and PINs · Form fields
- Avoid on: Whole pages · Warnings

**Prompt**

Add an error shake to [the form field that can be rejected, such as a password]. When the value is wrong or missing, move the field quickly left and right a few times, each swing smaller than the last, and end exactly where it started, like a head shaking no. Turn its border red and show a short message saying what went wrong, because movement and color alone do not explain the problem. Move only its horizontal position so the shake stays smooth, and restart the shake on every failed try. If the visitor has reduced motion turned on, skip the shake and keep the red border and the message. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Shake distance: Small · **Medium** · Large. How far the field swings: small is 4px, medium 8px and large 14px, the first swing most of that way and each one after it shorter, down to nothing; under 4px barely shows and over about 16px feels violent.
- Number of swings: Few · **Medium** · Many. How many times it swings: few is 4, medium 6 and many 8; four to six reads as a head shake, more feels frantic.
- Speed: Slow · **Normal** · Fast. How long the whole shake lasts: slow is 650ms, normal 400ms and fast 250ms; under 250ms feels twitchy and over 600ms drags.

## Swipe to Dismiss

A card dragged sideways flies off and the list closes up. Best for inboxes.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/swipe-to-dismiss/
- How it runs: reacts to the visitor
- Good for: Inboxes · Notifications · Chat lists · To-do lists
- Avoid on: Permanent deletes · Mouse-only tools

**Prompt**

Add swipe to dismiss to [the list items people should be able to remove]. While an item is dragged sideways, it follows the finger exactly and fades a little; when the settings include it, a red Delete label shows behind it. On release, remove it if it went far enough or was flicked quickly: it slides off the edge and its row closes up so the list moves up smoothly. Otherwise it springs back into place. Use pointer events so mouse, touch and pen all work, and let up-and-down scrolling still pass through. Offer an undo, and a button for people who cannot drag. If the visitor has reduced motion turned on, remove the row at once without sliding. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Distance to delete: Short · **Medium** · Long. How far a card must be dragged before letting go deletes it: short is 20%, medium 35% and long 50% of its width; a quick flick (faster than 600px a second, after at least 24px) deletes it from a shorter drag.
- Shows a Delete label: **on** · off. A red strip with the word Delete shows behind the card while it is dragged.

## Hamburger Menu Toggle

Three lines turn into an X as the menu opens. Best for mobile menus.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/hamburger-menu-toggle/
- How it runs: reacts to the visitor
- Good for: Mobile menus · Compact headers · Side panels
- Avoid on: Wide desktop menus

**Prompt**

Add a menu button whose three lines turn into an X to [the menu button in your header]. When it is pressed, the top and bottom lines move to the middle and turn to cross each other while the middle line fades away, and pressing it again reverses the change. Use the same three lines for both states, moving and turning them rather than swapping icons, and move each outer line exactly to the middle so the X meets at its center. Make it a real button that tells screen readers whether the menu is open. If the visitor has reduced motion turned on, switch between the two icons without movement. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. How long the change takes: slow is 550ms, normal 340ms and fast 200ms; below about 200ms it snaps and above 500ms it drags.
- Feel: **Gentle** · Springy · Smooth · Even. Gentle eases in and out; Springy lets the X overshoot a little, then settle; Smooth slows to a stop; Even keeps one steady speed.
- Line thickness: Thin · **Medium** · Thick. The lines are 2px, 4px or 6px thick; thicker lines read better at small sizes.

## Theme Toggle Morph

A sun turns into a moon as the colors switch to dark. Best for theme buttons.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/theme-toggle-morph/
- How it runs: reacts to the visitor
- Good for: Theme buttons · Settings · Headers
- Avoid on: Dense forms · Icons without labels

**Prompt**

Add a theme toggle whose icon turns from a sun into a moon to [the button that switches your site between light and dark]. When it is pressed, the sun's rays shrink into its center while a circle slides across the sun and cuts it into a crescent, so the sun becomes the moon instead of being swapped for another icon. Switch the page's colors at the same moment and at the same pace. Make it a real button whose label says what pressing it will do, and remember the visitor's choice for their next visit. If the visitor has reduced motion turned on, switch the icon and the colors without movement. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. How long the change takes: slow is 800ms, normal 500ms and fast 300ms; under about 200ms the crescent forms too fast to see, and over 800ms it drags.
- Feel: **Gentle** · Springy · Even. Gentle eases in and out; Springy overshoots a little, then settles; Even keeps one steady speed.

## Copy to Clipboard

Copy turns into a tick and Copied, then changes back. Best for codes and links.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/copy-to-clipboard/
- How it runs: reacts to the visitor
- Good for: Share links · Invite codes · Code blocks · API keys
- Avoid on: Slow actions · Important saves

**Prompt**

Add copy feedback to [the Copy button next to your code, link or key]. When the copy succeeds, turn the button's icon into a tick and its label into Copied!, with a brief flash of color, then change it back on its own after a moment so it is ready to use again. Stack both icons and both labels in the same place so the change never shifts the layout. Show the confirmation only once the copy has really worked, tell screen readers with a short status message, and say so if copying fails. If the visitor has reduced motion turned on, swap the icon and label without movement. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. How long the icon and label take to change: slow is 450ms, normal 280ms and fast 170ms.
- Time before it changes back: Short · **Medium** · Long. How long Copied! stays: short is 1 second, medium 1.5 and long 2.5; under a second feels rushed, and over about three seconds it lingers.
- Feel: **Springy** · Smooth · Even. Springy gives the tick a small bounce; Smooth slows to a stop; Even keeps one steady speed.

## Star Rating

Stars fill up to your pointer and pop when you choose. Best for reviews.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/star-rating/
- How it runs: reacts to the visitor
- Good for: Reviews · Surveys · Feedback forms · Media ratings
- Avoid on: Precise scores

**Prompt**

Add a star rating to [the review or feedback form]. As the pointer moves along the row, fill the stars up to the one under it so the choice shows before it is made, and bring back the chosen rating when the pointer leaves. Clicking or tapping a star chooses that rating and makes the star pop: it grows briefly, dips a little below its size and settles. On touch screens, a finger dragged along the row previews too. Make the row one control that the arrow keys can change, and show the rating as a number as well, so it never depends on color alone. If the visitor has reduced motion turned on, fill the stars without the pop. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Pop size: Small · **Medium** · Large. How big the chosen star grows as it pops: 1.15, 1.35 or 1.6 times its size; above about 1.6 it looks rubbery.
- Speed: Slow · **Normal** · Fast. How long each star takes to fill with color: slow is 300ms, normal 180ms and fast 110ms; it sets how smoothly the fill follows the pointer.
- Allows half stars: on · **off**. Pointing at the left half of a star gives half a point, and the arrow keys move in halves.
- Number of stars: Three · **Five** · Ten. Three, five or ten stars; five is the usual scale.

## Toast Notification

Short messages slide into a corner, then leave on their own. Best for updates.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/toast-notification/
- How it runs: reacts to the visitor
- Good for: Save confirmations · Upload updates · Sync notices
- Avoid on: Errors that need action · Long messages

**Prompt**

Add toast notifications to [the actions in your app that should be confirmed quietly, such as saving]. Each toast comes into a corner of the screen with a short message and a thin bar that empties as it counts down, then leaves on its own. New toasts stack; when one leaves, the others glide over to close the gap, moved with transforms rather than by changing the layout. Pause the countdown while the pointer is over a toast, and let a tap, a sideways swipe or a close button dismiss it early. Announce each message to screen readers without moving focus. If the visitor has reduced motion turned on, show and hide toasts without movement. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Corner: Top left · **Top right** · Bottom left · Bottom right. Where toasts appear and stack; in the bottom corners the newest sits nearest the corner.
- How it comes in: **Slides** · Fades · Grows. Slides in from its corner's side, starting just over its own width away, fades in, or grows from 85% of its size, each fading in over 0.34 seconds; it leaves the same way in 0.3 seconds.
- Time on screen: Short · **Medium** · Long. How long each toast stays: short is 2.5 seconds, medium 4 and long 6.5; its bar counts down this time.
- Most at once: Two · Three · **Four**. Two, three or four; when one more arrives, the oldest leaves.

## Segmented Control

A highlight slides to the option you pick. Best for switching views.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/segmented-control/
- How it runs: reacts to the visitor
- Good for: View switchers · Filters · Date ranges
- Avoid on: Many options · Long labels

**Prompt**

Add a segmented control to [the row of options people switch between, such as Day, Week and Month]. Show the options side by side with one highlight behind the chosen one. When another option is chosen, slide the highlight over to it and stretch or shrink it to that option's width, while the labels' colors cross over as it lands. Measure the chosen option and move the highlight with transforms only, measuring again when fonts load or the window resizes. Make it one group of radio buttons that the arrow keys move through. If the visitor has reduced motion turned on, move the highlight without sliding. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Speed: Slow · **Normal** · Fast. How long the highlight takes to slide: slow is 550ms, normal 340ms and fast 200ms.
- Feel: **Springy** · Smooth · Even. Springy runs a little past the option, then settles; Smooth slows to a stop; Even keeps one steady speed.
- Highlight: **Pill** · Underline. A filled pill behind the chosen option, or a thin 2px line under it.
- Number of options: Two · Three · **Four** · Five. Two to five options; more, or long labels, do not fit on one line.

## Pull to Refresh

Pulling a list down shows a spinner, then new items. Best for feeds.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/pull-to-refresh/
- How it runs: reacts to the visitor
- Good for: Feeds · Inboxes · Notifications · Order lists
- Avoid on: Desktop-only pages · Lists that rarely change

**Prompt**

Add pull to refresh to [the scrolling list or feed that should reload]. When the list is already at its top and the visitor drags it down, move it with the finger but make it resist more the further it goes, and show a spinner above it that fades in and turns as it is pulled. Let go past the line and the list stays down while the spinner keeps turning and new items load, then everything slides back up with the new items on top; a shorter pull just springs back. Also offer a refresh button for people who cannot drag. If the visitor has reduced motion turned on, snap back without sliding. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Pull distance: Short · **Medium** · Long. How far the list must be pulled before letting go refreshes: short is 48px, medium 64px and long 80px, measured after the resistance.
- Resistance: Low · **Medium** · High. How hard the list fights back as it is pulled: it follows the finger at first and stiffens, so reaching the pull distance takes a drag of about 1.4 times it (low), 1.8 times (medium) or 2.25 times (high), and the list never goes past 3.4, 2.2 or 1.8 times it; with a long pull distance and high resistance, it takes a long drag.
- Spinner: **Ring** · Dots · Bars. A turning ring, three blinking dots or four stretching bars.
- Refresh time: Short · **Medium** · Long. How long the spinner turns before the new item arrives: short is 700ms, medium 1200ms and long 2000ms.

## Animated Gradient Border

A band of colors runs around the edge of a card or button. Best for featured offers.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/gradient-border/
- How it runs: moves by itself
- Good for: Featured plans · Main buttons · New features · Promo cards
- Avoid on: Every card on a page · Calm reading pages

**Prompt**

Add an animated gradient border to [the card or button you want to stand out]. Give it an edge where a band of colors keeps running around it; wherever the band does not reach, the edge stays a faint line. Build it from a square layer, twice as wide as the element, filled with a gradient that sweeps around its center, clipped to the element's rounded shape and covered by an inner box everywhere but the edge. Turn that layer and never animate the gradient itself, so the browser only rotates a finished picture. For a glow, put a blurred copy of the same layer behind it. If the visitor has reduced motion turned on, keep the border still. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Colors: **Rainbow** · Sunset · Ocean. The four colors of the band: Rainbow, Sunset (yellow to purple) or Ocean (teal to indigo).
- Speed: Slow · **Normal** · Fast. How long one trip around the edge takes: slow is 7s, normal 4s and fast 2s; much faster and it looks busy.
- Soft glow: **on** · off. A blurred copy of the band behind the element, so its colors spill softly onto the page.
- Band length: Short · **Long** · All around. How much of the edge the colors cover at once: a short band about a third of the way around, a long one about three fifths, each fading in from a faint tail to a bright front, or colors all around.
- Border width: Thin · **Medium** · Thick. How thick the colored edge is: thin is 1px, medium 2px and thick 4px.

## Spotlight Hover Glow

A soft glow follows the pointer and lights card edges. Best for feature grids.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/spotlight-hover/
- How it runs: reacts to the visitor
- Good for: Feature grids · Pricing cards · Dashboards · Portfolios
- Avoid on: Light themes · Text-heavy pages

**Prompt**

Add a spotlight glow to [the grid of dark cards you want to light up]. As the pointer moves over the grid, a soft round light follows it across the cards and, when the settings include it, lights up the card edges closest to the pointer while the far edges stay dim. Give each card its own light, clipped to the card, and move it to the pointer with transforms only, so nothing is repainted while it moves. Fade the light in when the pointer arrives and out when it leaves. On touch screens, let a finger dragged across the cards move the light. If the visitor has reduced motion turned on, keep the light on the pointer with no glide. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Glow size: Small · **Medium** · Large. How far the light reaches: small, medium and large are 0.7, 1.15 and 1.7 times the grid's shorter side across.
- Color: White · Orange · Pink · **Purple** · Blue · Green. The color of the light and of the lit edges; white looks the most natural on gray cards.
- Lights the edges: **on** · off. The card edges near the pointer glow brightly; off, only the faces brighten.
- Lag: None · **Short** · Long. How far the light trails a moving pointer: none follows it exactly, short closes 30% of the gap per 60 Hz frame and long 10% (other screens close the share that fits their frame time), so the light gets 95% of the way in about 0.15 or 0.5 seconds.

## Add-to-Cart Fly

The product flies into the cart, which bumps and counts up. Best for shops.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/add-to-cart-fly/
- How it runs: reacts to the visitor
- Good for: Online shops · Product lists · Food ordering · Wish lists
- Avoid on: Bulk order forms · Quick reorder lists

**Prompt**

Add an add-to-cart animation to [the Add to cart buttons of your product list]. When one is pressed, copy that product's picture and fly the copy into the cart icon, shrinking it on the way, then remove it. Move it with transforms only: for a curved path, slide it sideways at an even pace while an inner layer rises and then drops into the cart; for a straight path, move both together. As it lands, raise the number on the cart and, when the settings include it, give the cart a small bump. Tell screen readers that the item was added. If the visitor has reduced motion turned on, fly nothing and fade the new number in. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Flight speed: Slow · **Normal** · Fast. How long the copy takes to reach the cart: slow is 1.1s, normal 0.7s and fast 0.45s.
- Path: **Arc** · Straight. Arc moves sideways at an even pace while it rises and drops into the cart like a toss, peaking a twentieth of the sideways distance (10 to 28px) above the cart; Straight goes in a line, easing in and out.
- Cart bumps: **on** · off. The cart tips and grows for a moment and its badge pops as the copy lands; off, only the number changes.

## Drag to Reorder

Drag an item and the others slide aside to make room. Best for to-do lists.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/drag-to-reorder/
- How it runs: reacts to the visitor
- Good for: To-do lists · Playlists · Priority rankings · Menu editors
- Avoid on: Lists sorted by date · Very long lists

**Prompt**

Add drag to reorder to [the list whose order people can change]. Lift the picked-up item and let it follow the pointer exactly; as it passes a neighbor's middle, slide that neighbor into the gap, and on release settle it into place and save the order. Shift the items rather than changing the layout, so it stays smooth. Support the keyboard: Space picks up, the arrow keys move, Space drops and Escape cancels, each step read out to screen readers. On touch screens, start a drag at once from the grip; if the rest of an item can start one too, only after a short press, so swipes still scroll. If the visitor has reduced motion turned on, move items straight to their places. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Slide speed: Slow · **Normal** · Fast. How fast the passed items slide aside and the dropped one settles: slow is 420ms, normal 220ms and fast 120ms.
- How much it lifts: **Subtle** · Strong. Subtle grows the held item by 2% with a soft shadow 8px below it; strong grows it by 6%, tilts it 1.5° and deepens the shadow to 18px below it.
- Drags by the handle only: on · **off**. Only the grip starts a drag; when off, the whole row does, after a short press on touch screens.

## Rolling Numbers

Each digit rolls to its new value, like a mileage counter. Best for prices.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/rolling-numbers/
- How it runs: reacts to the visitor
- Good for: Counters · Prices · Scores · Dashboards
- Avoid on: Numbers that change every second · Long decimals

**Prompt**

Add rolling numbers to [the number that changes, such as a counter, score or price]. Show each digit in a small window over a column of the digits 0 to 9, and when the value changes, slide each column so its new digit rolls into view, like the wheels of a mileage counter; digits that stay the same do not move, and separators stay still. Give every digit the same width so the number never shifts sideways, and only slide the columns, never resize anything, so it stays smooth. Let screen readers hear the plain number once. If the visitor has reduced motion turned on, swap the digits with a short fade instead of rolling. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Roll speed: Slow · **Normal** · Fast. How long a digit takes to roll to its new value: slow is 900ms, normal 550ms and fast 300ms.
- Direction: Up · Down · **Shortest**. Shortest turns each digit the nearer way round; up turns every digit forward, as a mileage counter does, so 9 to 0 is one step; down turns them back, like a countdown.
- Digits one after another: **on** · off. Each changing digit starts 70ms after the changing digit to its right, so a big change ripples from right to left.

## Typing Indicator

Three dots in a chat bubble move in turn while someone types. Best for chat apps.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/typing-indicator/
- How it runs: moves by itself
- Good for: Chat apps · Support chat · AI assistants · Comment threads
- Avoid on: Long waits · Replies that are not live

**Prompt**

Add a typing indicator to [the chat or comment thread where replies arrive]. While the other person is typing, show a small bubble on their side of the conversation with three dots that move one after another in a steady loop, so it reads as someone writing right now. Show it only while they are really typing, hide it after a few quiet seconds, and when their message arrives, put the message where the bubble was. Animate only the dots, never the bubble's size, so it stays smooth, and give screen readers a short text that says who is typing. If the visitor has reduced motion turned on, keep the dots in place and only let them brighten in turn. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- How the dots move: **Bounce** · Fade · Wave. Bounce hops each dot 7px up and rests between rounds; fade brightens each dot and grows it from 70% to full size; wave raises and lowers the dots between 2.5px below and 5px above their place, without a rest.
- Speed: Slow · **Normal** · Fast. How long one round of the three dots takes: slow is 1.8 seconds, normal 1.2 seconds and fast 0.8 seconds, each dot starting 15% of a round after the one before.
- Bubble color: **Gray** · Blue · Green · Purple. The color of the other person's bubbles: gray, blue, green or purple; the dots turn light gray or white to stay clear on it.

## Hold to Confirm

A button fills up while you hold it and acts only once it is full. Best for delete buttons.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/hold-to-confirm/
- How it runs: reacts to the visitor
- Good for: Delete buttons · Closing an account · Sending money · Emergency alerts
- Avoid on: Everyday actions · Actions with Undo

**Prompt**

Add hold to confirm to [the button for a risky action, such as Delete]. While the visitor holds it down, a fill grows steadily, and the action runs only once it is full, when a tick shows. If they let go early, the fill drains back, nothing happens and a short hint says to keep holding; when the settings ask for it, the button also shakes. Holding Space or Enter works the same way, and on touch a long press must not open the browser's menu. Grow the fill smoothly by the time held, not per frame, and announce the result to screen readers. If the visitor has reduced motion turned on, fill in a few steps without the shake. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- How long to hold: Short · **Medium** · Long. How long the button must be held before it acts: short is 0.8 seconds, medium 1.5 and long 2.5; under about half a second it no longer guards against a stray tap, over three seconds it feels stuck.
- Fill style: **Bar** · Ring. Bar fills the whole button from left to right; Ring fills a ring around a round button, clockwise from the top.
- Shakes if let go early: **on** · off. A short side-to-side shake when the button is let go before it is full; the hint to keep holding shows either way.
- How fast it drains: **Quickly** · Slowly. How long a full fill takes to run back out when it is let go: quickly is 0.4 seconds, slowly 1.5.

## Expanding Search

A search icon opens into a field, then closes when done. Best for toolbars.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/expanding-search/
- How it runs: reacts to the visitor
- Good for: Toolbars · Mobile headers · Docs sites · Dashboards
- Avoid on: Sites where search comes first

**Prompt**

Add an expanding search to [the toolbar or header where search should sit]. Show only a search icon until it is pressed; then open a search field out of the icon, over the items beside it, and put the text cursor in it. Reveal the field with a clip or a scale from the icon's side, never by animating its width, so nothing around it moves. Escape or a close button closes it and gives the focus back to the icon, and a closed field stays out of the Tab order. Make the icon a real button with a label. If the visitor has reduced motion turned on, open and close it at once. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Opens toward: **Left** · Right. Left puts the icon at the right end of the toolbar and grows the field leftward over the links; Right puts the icon beside the logo and grows the field rightward.
- Speed: Slow · **Normal** · Fast. How long the field takes to open or close: slow is 450ms, normal 280ms and fast 160ms; much slower and typing has to wait for it.
- Closes when you leave it: **on** · off. On closes the field as soon as the focus moves away, by a click elsewhere or Tab; off keeps it open until Escape or the close button.

## Button Loading States

The button becomes a spinner, then a tick or a cross. Best for Save buttons.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/button-loading-states/
- How it runs: reacts to the visitor
- Good for: Save buttons · Contact forms · Checkout · Sign-up forms
- Avoid on: Instant actions · Long uploads

**Prompt**

Add loading states to [the button that sends a form or saves something]. When it is pressed, fade its label out, show a spinner in its place and ignore further presses until it is done. When the answer comes, swap the spinner for a tick, or for a cross with a short shake if it failed, then bring the label back after a moment. When the settings ask for it, shrink the button's colored shape into a circle around the spinner with a clip, never by animating its width, so nothing around it moves. Announce each change to screen readers. If the visitor has reduced motion turned on, keep the shape and change the label's words instead. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Result: **Success** · Error. Success shows a tick on green; Error shows a cross on red and gives the button a small shake, swinging 7, 6, 4 and 2px to alternate sides over 0.4 seconds.
- Speed: Slow · **Normal** · Fast. How long the shape, the color and the icon take to change: slow is 500ms, normal 300ms and fast 180ms.
- Shrinks to a circle: **on** · off. On clips the button's color into a circle around the spinner; off keeps its full shape and changes only what is inside.
- How long it loads: Short · **Medium** · Long. How long the spinner turns once the button has changed shape, before the answer comes: short is 0.7 seconds, medium 1.2 and long 2.2; in a real form this is the server's time.

## Image Trail

Pictures pop up in a trail behind your pointer, then fade. Best for portfolios.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/image-trail/
- How it runs: reacts to the visitor
- Good for: Portfolio heroes · Photo galleries · Agency sites · Lookbooks
- Avoid on: Reading pages · Busy layouts

**Prompt**

Add an image trail to [the hero section the pointer moves over]. Each time the pointer has traveled a set distance, drop a picture at its tip, so a still pointer leaves none. Each new picture pops up on top of the others, gliding in from where the last one appeared, stays a while, then leaves and fades away. Reuse a small set of picture elements in turn, and move, scale and fade them with transforms and opacity only, so it stays smooth. On touch screens, let a finger dragged across the section leave the trail. If the visitor has reduced motion turned on, show one picture at a time where they point, fading in and out without moving. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- How often a picture appears: Often · **Normal** · Rarely. How far the pointer goes between two pictures: often, normal and rarely are 0.12, 0.2 and 0.32 times the hero's shorter side, so the spacing looks the same on a phone and a laptop.
- How long they stay: Short · **Normal** · Long. How long a picture shows before it starts to leave: 0.4, 0.8 or 1.6 seconds from when it appears, then half a second to leave; longer stays make a longer trail.
- Picture size: Small · **Medium** · Large. Each picture is 0.26, 0.34 or 0.44 times the hero's shorter side across, in a 4:5 frame.
- How they leave: **Shrink** · Fade · Fall. Shrink scales the picture down to a quarter as it fades; Fade only fades it; Fall drops it by 30% of the hero's height as it fades, turning it a little further.
- Tilts the pictures: **on** · off. Each picture leans up to 8 degrees to one side, at random, and turns into place as it pops; off, they all stand straight.

## Gooey Menu

Small buttons ooze out of a round button like liquid. Best for quick actions.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/gooey-menu/
- How it runs: reacts to the visitor
- Good for: Quick actions · Share menus · Mobile apps · Playful brands
- Avoid on: Long menus · Formal sites

**Prompt**

Add a gooey menu to [the round action button on your page]. Pressing it lets smaller buttons ooze out like drops of liquid and pop into place; pressing again pulls them back in. Draw plain circles of one color on a layer under the icons and run that layer through a filter that blurs it, then sharpens the blurred edge again, so circles that touch melt together. Move them only with transforms, keep the filtered layer small and blur less on phones. Make every button a real button the keyboard can reach, tell screen readers whether the menu is open, and let Escape close it. If the visitor has reduced motion turned on, fade the buttons in place without the stretch. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Layout: Row · **Arc** · Column. Row puts the small buttons in a line beside the round one and Column stacks them above it, with 20px gaps; Arc fans them out above it, 84px from its center and 60° apart; the round button is 64px across and the small ones 50px. All of these are at the base scale: the whole menu is scaled 0.88 to 1.2 times with the stage, so the round button is about 56px across at the smallest and 77px at the largest.
- How gooey: Low · **Medium** · High. How much the circles are blurred before the edge is sharpened: low is a 5px blur, medium 9px and high 13px for a round button 64px across (scaled with the menu, and a fifth less on phones); higher keeps the drops joined for longer.
- Speed: Slow · **Normal** · Fast. How long a small button takes to pop out: slow is 950ms, normal 600ms and fast 380ms, each starting 90, 60 or 40ms after the one before.
- Button color: **Orange** · Pink · Purple · Blue · Green. The color of the circles; the icons stay dark.

## Dynamic Island

A black pill grows into a notification, then shrinks back. Best for live updates.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/dynamic-island/
- How it runs: reacts to the visitor
- Good for: Calls and timers · Music players · Order tracking · Live scores
- Avoid on: Long messages · Errors that need action

**Prompt**

Add a Dynamic Island style notification to [the top of your app or page]. At rest it is a small black pill; when [an event such as an incoming message] happens or the pill is pressed, it grows into a rounded card with the details, then shrinks back. Change the black shape with a clip or a scale, never by animating its width or height, so the text inside never stretches and nothing around it moves. Keep the details inside the shape, fading them in once it has room. Make the pill a real button for taps, clicks and the keyboard, and announce its message politely to screen readers. If the visitor has reduced motion turned on, crossfade the pill and the card instead. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Notification: **Call** · Timer · Music. What the 96 by 32px pill grows into: a call card 76px tall, a timer in a wide capsule 64px tall, or a music card with controls 148px tall; the call and music cards are about 85% as wide as the screen and the timer about 77%; picking another while it is open changes the shape straight into the new one.
- Speed: Slow · **Normal** · Fast. How long it takes to grow or shrink: slow is 1100ms, normal 700ms and fast 450ms; a spring needs a little longer than a plain ease, because it settles at the end.
- Bounce: None · **Soft** · Springy. None eases out without going past the size; Soft goes past it by about 5% of the change in size and Springy by about 16%, and each settles by the end of its time.

## Before/After Slider

Drag a line across two pictures to compare them. Best for photo edits.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/before-after-slider/
- How it runs: reacts to the visitor
- Good for: Photo edits · Redesigns · Renovations · Product upgrades
- Avoid on: Small thumbnails · Unrelated pictures

**Prompt**

Add a before-and-after slider to [the two pictures you want to compare]. Stack the pictures exactly on top of each other and show the top one only up to a dividing line with a handle, so each side of the line shows one picture. Dragging on the pictures moves the line, and a tap jumps it there. Uncover the top picture with a clip or a sliding window, never by resizing it, so neither picture moves or squeezes. Use pointer events for mouse and touch, keep page scrolling free on phones, and let the arrow keys move the handle. If the visitor has reduced motion turned on, move the line without gliding. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Split: **Left and right** · Top and bottom. Which way the line runs: left and right shows After to the left of an upright line, dragged anywhere on the pictures; top and bottom shows After below a level line, dragged by its handle only.
- Handle: **Knob** · Bar · Line only. What there is to grab: knob is a round button with two arrows, bar a narrow bar along the line, line only the bare line, with nothing showing where to grab (the knob's fingertip-sized grab area stays, unseen, on the middle of the line).
- Shows labels: **on** · off. Before and After name each side from a corner, and each fades out when the line comes within a few pixels of it.

## Magnifier Lens

A lens follows your pointer and shows the picture up close. Best for product photos.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/magnifier-lens/
- How it runs: reacts to the visitor
- Good for: Product photos · Maps · Artwork · Detailed plans
- Avoid on: Small or plain pictures

**Prompt**

Add a magnifier lens to [the product photo or detailed picture people want to inspect]. While the pointer is over the picture, show a lens there holding an enlarged copy, placed so the spot under the pointer sits in the middle of the lens. Fill the lens from a larger, sharper version of the picture, never the same small one stretched, and move the lens and the copy with transforms only. On touch screens, show it while a finger is down, just above the finger; from the keyboard, show it on focus and move it with the arrow keys. If the visitor has reduced motion turned on, let it appear without growing. Match the settings listed below.

**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):

- Zoom: 2 times · **3 times** · 4 times. How many times bigger the copy in the lens is than the picture: 2 times, 3 times or 4 times.
- Lens size: Small · **Medium** · Large. How wide the lens is: small is 110 pixels across, medium 150 and large 200, a fifth less on phones.
- Lens shape: **Round** · Square. Round is a circle; square is a square with slightly rounded corners, which suits maps and plans.
