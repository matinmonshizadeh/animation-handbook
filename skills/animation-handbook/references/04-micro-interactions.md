# 04 · Micro-Interactions

Short, user-triggered animations — hover, click, focus, loading states, and UI feedback patterns. 41 animations from Animation Handbook, in the home page's order. Each entry gives the live demo, how it runs, what it is good for and what to avoid it on, the prompt from its page word for word, and its settings.

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

## Hover State Animation

Six ways a card can react when you point at it. Best for buttons and cards.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/hover-state/
- How it runs: reacts to the visitor
- Good for: Buttons · Links · Cards · Menus
- Avoid on: Plain text · Non-clickable items

**Prompt**

Add hover feedback to [the buttons, links or cards you want to react]. When the pointer moves over an item, change it in one clear way: shift its background color, grow it slightly, lift it with a deeper shadow, draw an underline out from the left, nudge its arrow forward, or sweep a tint across it. Use one style per kind of item and keep it the same across the page. Apply hover styles only on devices that can hover, and show the same change while an item is pressed on touch screens. If the visitor has reduced motion turned on, switch the look without animating it. Match the settings listed below.

**Settings** (the defaults in bold):

- Speed: Slow · **Normal** · Fast
- Feel: **Smooth** · Springy · Gentle · Even

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Speed: Normal, Feel: Smooth.

## Click / Tap Ripple

A ripple spreads out from the spot you press. Best for buttons and list items.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/click-ripple/
- How it runs: reacts to the visitor
- Good for: Buttons · List items · Menu items · Icon buttons
- Avoid on: Links in text · Large panels

**Prompt**

Add a ripple to [the buttons or list items you want to respond to presses]. When the visitor presses one, a soft circle appears where they pressed, or in the middle when the settings say so, then grows outward and fades away. Clip it to the button's shape so it never spills outside, start it as soon as the press begins so the feedback feels instant, and remove each ripple once it has faded so quick taps do not pile up. It should work the same for mouse, touch and pen. If the visitor has reduced motion turned on, fade a flat highlight over the button instead of a growing circle. Match the settings listed below.

**Settings** (the defaults in bold):

- Starts from: **Where you press** · The middle
- Speed: Slow · **Normal** · Fast
- Ripple size: Small · **Medium** · Large
- Ripple strength: Faint · **Medium** · Strong
- Ripple color: **White** · Orange · Black

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Starts from: Where you press, Speed: Normal, Ripple size: Medium, Ripple strength: Medium, Ripple color: White.

## Focus Ring Animation

A ring closes in around the item the Tab key reaches. Best for forms and menus.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/focus-ring/
- How it runs: reacts to the visitor
- Good for: Forms · Buttons · Links · Menus
- Avoid on: Non-interactive items

**Prompt**

Add an animated focus ring to [the links, buttons and form fields on your page]. When keyboard focus moves to an item, draw an outline around it that starts a little further out and faint, then closes in to its place, so each Tab press is easy to follow. Show the ring only for keyboard focus, not after mouse clicks, and never remove the browser's focus outline without drawing this one instead. Make sure the ring stands out against every background it sits on. If the visitor has reduced motion turned on, show the ring at once without closing in. Match the settings listed below.

**Settings** (the defaults in bold):

- Ring style: **Solid** · Dashed · Glow · Wide
- Speed: Slow · **Normal** · Fast
- Ring thickness: Thin · **Medium** · Thick
- Ring gap: None · **Small** · Large

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Ring style: Solid, Speed: Normal, Ring thickness: Medium, Ring gap: Small.

## Button Press Scale

Shrinks as you press it and springs back as you let go. Best for main buttons.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/button-press-scale/
- How it runs: reacts to the visitor
- Good for: Main buttons · Icon buttons · Mobile apps
- Avoid on: Links in text · Large cards

**Prompt**

Add press feedback to [the buttons you want to feel tactile]. While a button is held down it shrinks, as if pushed in, and when it is let go it returns to full size. A press that is quicker than the release feels most like a real button. Respond to mouse, touch and pen presses and to Space and Enter on the keyboard, and let go cleanly if a press turns into a scroll, so no button stays stuck down. Change only the button's size so nothing around it moves. If the visitor has reduced motion turned on, change the size at once, without animating it. Match the settings listed below.

**Settings** (the defaults in bold):

- Press depth: Light · **Medium** · Deep
- Release speed: Slow · **Normal** · Fast
- Release feel: **Springy** · Smooth · Even
- Press speed: Slow · **Normal** · Fast

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Press depth: Medium, Release speed: Normal, Release feel: Springy, Press speed: Normal.

## Magnetic Button

Leans toward the pointer, then springs home. Best for one main button.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/magnetic-button/
- How it runs: reacts to the visitor
- Good for: Hero buttons · Portfolio sites · One key action
- Avoid on: Forms · Rows of buttons

**Prompt**

Add a magnetic effect to [the one button you want to stand out]. When the pointer comes within reach, pull the button part of the way toward it, more strongly the closer it gets, and move its label a little further so the label seems to float above the button. When the pointer leaves, let the button spring back to its place. Move it only with transforms so the layout never shifts, and use it on one or two buttons at most. On touch screens, pull the button toward the finger while it touches and send it home when it lifts. If the visitor has reduced motion turned on, move it quickly and evenly instead of letting it glide. Match the settings listed below.

**Settings** (the defaults in bold):

- Pull strength: Gentle · **Medium** · Strong
- Reach: Short · **Medium** · Long

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Pull strength: Medium, Reach: Medium.

## Toggle / Switch Slide

The knob slides across as the switch turns on or off. Best for settings.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/toggle-switch/
- How it runs: reacts to the visitor
- Good for: Settings · Preferences · Dark mode switches
- Avoid on: Forms sent later · More than two options

**Prompt**

Add an animated toggle switch to [the on/off setting you want to control]. Build it on a real checkbox so it works with the keyboard and screen readers. When it is turned on, the round knob slides across the track and the track fills with color; when it is turned off, both go back. When the settings ask for it, let the knob go slightly past the end and settle, so it feels springy. Make the whole switch and its label easy to tap. If the visitor has reduced motion turned on, move the knob without sliding. Match the settings listed below.

**Settings** (the defaults in bold):

- Speed: Slow · **Normal** · Fast
- Feel: Smooth · **Gentle** · Even
- Springy knob: **on** · off
- On color: Pink · **Blue** · Purple · Green · Orange

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Speed: Normal, Feel: Gentle, Springy knob: on, On color: Blue.

## Heart / Like Burst

The heart pops and fills as small hearts burst out. Best for like buttons.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/heart-burst/
- How it runs: reacts to the visitor
- Good for: Like buttons · Favorites · Bookmarks · Reactions
- Avoid on: Delete buttons · Neutral toggles

**Prompt**

Add a like button with a burst to [the heart or favorite button you want to reward]. When the visitor likes something, the heart quickly squashes, overshoots a little and settles as it fills with color, while a spray of tiny hearts and dots flies out from its center, arcs down and fades. Unliking simply removes the color, with no burst. Draw the burst on one layer over the button and stop drawing once the last piece has faded. Tell screen readers whether it is liked. If the visitor has reduced motion turned on, only fill the heart, with no pop or burst. Match the settings listed below.

**Settings** (the defaults in bold):

- Number of hearts: Few · **Some** · Many
- How far they fly: Short · **Medium** · Far

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Number of hearts: Some, How far they fly: Medium.

## Success Confetti

Confetti bursts from the button when a task is done. Best for big moments.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/success-confetti/
- How it runs: reacts to the visitor
- Good for: Orders placed · Sign-ups finished · Milestones
- Avoid on: Everyday clicks · Serious tasks

**Prompt**

Add a confetti burst to [the action that completes something important, such as placing an order]. When it succeeds, turn the button into a clear success state with a check mark and a short confirmation, and fire small colored rectangles from the button: they shoot upward in a fan, spin, slow down, fall and fade. Save it for real milestones, not everyday clicks. Draw the pieces on one layer and stop drawing once the last one has faded or fallen out of view. If the visitor has reduced motion turned on, show the success state without the confetti. Match the settings listed below.

**Settings** (the defaults in bold):

- Amount of confetti: Some · **Medium** · Lots
- Spread: Narrow · **Medium** · Wide
- Fall speed: Floaty · **Normal** · Heavy

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Amount of confetti: Medium, Spread: Medium, Fall speed: Normal.

## Skeleton Loader

Gray shapes hold the place of content while it loads. Best for feeds and cards.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/skeleton-loader/
- How it runs: plays once
- Good for: Feeds · Cards · Lists · Dashboards
- Avoid on: Very short waits · Unknown layouts

**Prompt**

Add a skeleton loading state to [the card, list or panel whose content loads]. While it loads, show gray blocks in the shapes and sizes of the content that is coming, such as a round avatar, lines of text and an image, and let them pulse between dimmer and brighter. When the content is ready, swap the blocks for it and fade it in. Match the shapes closely, because a skeleton that does not fit the content makes the page jump when it arrives. If the visitor has reduced motion turned on, keep the blocks still. Match the settings listed below.

**Settings** (the defaults in bold):

- Pulse speed: Slow · **Normal** · Fast
- Pulse strength: Soft · **Medium** · Strong
- Loading time: Short · **Medium** · Long

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Pulse speed: Normal, Pulse strength: Medium, Loading time: Medium.

## Shimmer Effect

A band of light sweeps over gray placeholders. Best for loading screens.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/shimmer-effect/
- How it runs: moves by itself
- Good for: Feeds · Cards · Lists · Image galleries
- Avoid on: Very short waits · Busy pages

**Prompt**

Add a shimmer to [the skeleton placeholders on your loading screen]. Lay a band of light over each placeholder and sweep it across in one direction, again and again, so the gray shapes look like content streaming in. Every placeholder on the page should shimmer in the same direction, and each one must clip the band to its own edges so it never spills out. Keep the band see-through so it works on any placeholder color. If the visitor has reduced motion turned on, keep the placeholders still. Match the settings listed below.

**Settings** (the defaults in bold):

- Speed: Slow · **Normal** · Fast
- Brightness: Soft · **Medium** · Bright
- Highlight angle: **Upright** · Slanted · Diagonal
- Highlight color: **White** · Blue · Gold

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Speed: Normal, Brightness: Medium, Highlight angle: Upright, Highlight color: White.

## Loading Spinner

Six small shapes loop to show that something is loading. Best for short waits.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/loading-spinner/
- How it runs: moves by itself
- Good for: Network waits · Buttons while sending · Short waits
- Avoid on: Known-length tasks · Very quick loads

**Prompt**

Add a loading spinner to [the place where people wait for something to load]. Use a small shape that keeps moving in a steady loop, such as a ring with one colored part turning around, dots circling or dots bouncing in turn, to show that work is going on when you cannot say how long it will take. Show it only for waits longer than about half a second, and tell screen readers that something is loading. If you know how far along the task is, use a progress bar instead. If the visitor has reduced motion turned on, fade it gently instead of spinning. Match the settings listed below.

**Settings** (the defaults in bold):

- Speed: Slow · **Normal** · Fast
- Size: Small · **Medium** · Large
- Color: Pink · White · **Blue** · Purple · Green · Orange

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Speed: Normal, Size: Medium, Color: Blue.

## Progress Animation

A bar, a ring and steps fill up to show progress. Best for uploads.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/progress-animation/
- How it runs: plays once
- Good for: Uploads · Downloads · Multi-step forms · Installs
- Avoid on: Unknown waits · Fake progress

**Prompt**

Add a progress indicator to [the upload, download or task whose progress you know]. Show how much is done with a bar that fills from left to right, a ring whose outline fills around the circle, or a row of steps that light up in turn, all driven by the same percentage and shown with the number. Fill it smoothly as progress arrives, and only show real progress: never race to near the end and stall. When the settings ask for it, slide a short piece along the bar for waits of unknown length. If the visitor has reduced motion turned on, jump straight to the current value. Match the settings listed below.

**Settings** (the defaults in bold):

- Fills to: 50% · 75% · **100%**
- Speed: Slow · **Normal** · Fast
- Feel: **Smooth** · Gentle · Even
- Sliding bar: on · **off**
- Fill color: Pink · White · **Blue** · Purple · Green · Orange

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Fills to: 100%, Speed: Normal, Feel: Smooth, Sliding bar: off, Fill color: Blue.

## Checkmark Draw

A tick draws itself in a circle once a task succeeds. Best for forms.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/checkmark-draw/
- How it runs: reacts to the visitor
- Good for: Form success · Payments · Finished steps
- Avoid on: Frequent small saves

**Prompt**

Add a success check mark that draws itself to [the form or action that just finished]. After the visitor submits, show a short loading state in the button, then draw a circle and a tick inside it as if by hand: the circle first, then the tick, starting just before the circle closes. For a failure, draw a red X the same way and give it a short shake. Let the button turn green or red to match. If the visitor has reduced motion turned on, show the finished check or X at once. Match the settings listed below.

**Settings** (the defaults in bold):

- Result: **Success** · Error
- Speed: Slow · **Normal** · Fast
- Line thickness: Thin · **Medium** · Thick
- Feel: **Smooth** · Gentle · Even
- Tick color: Pink · White · Blue · Purple · **Green** · Orange

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Result: Success, Speed: Normal, Line thickness: Medium, Feel: Smooth, Tick color: Green.

## Form Field Morph

The label moves up out of the way as you type. Best for sign-up forms.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/form-field-morph/
- How it runs: reacts to the visitor
- Good for: Sign-up forms · Sign-in forms · Checkout · Settings
- Avoid on: Long labels

**Prompt**

Add floating labels to [the form fields you want to label]. Each label sits inside its field like a placeholder; when the field is focused or has text in it, the label moves up and shrinks so it stays visible above the text, and the field's line or border takes on the focus color. When an empty field loses focus, the label moves back down. Keep a real label element for each field so screen readers announce it, and shrink the label from its left edge so it does not drift sideways. If the visitor has reduced motion turned on, move the label without animating it. Match the settings listed below.

**Settings** (the defaults in bold):

- Speed: Slow · **Normal** · Fast
- How far it rises: Low · **Medium** · High
- Size when raised: Small · **Medium** · Large
- Focus color: Pink · White · **Blue** · Purple · Green · Orange

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Speed: Normal, How far it rises: Medium, Size when raised: Medium, Focus color: Blue.

## Notification Badge Pulse

A badge on an icon pulses to catch the eye. Best for unread messages.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/badge-pulse/
- How it runs: moves by itself
- Good for: Notification bells · Inboxes · Chat icons · Online status
- Avoid on: Items already seen · Many icons at once

**Prompt**

Add a pulsing notification badge to [the icon that has something new, such as a bell or an inbox]. Place a small colored dot or number on the icon's corner and let it pulse, growing and settling back or sending a soft ring outward, so it catches the eye without demanding attention. Give the badge a thin border in the background color so it seems to float above the icon. Remove the badge once the visitor has opened what it points to, and when the settings ask for it, stop the pulse after three beats. If the visitor has reduced motion turned on, keep the badge still. Match the settings listed below.

**Settings** (the defaults in bold):

- Pulse style: **Grow** · Ring · Both
- Speed: Slow · **Normal** · Fast
- How much it grows: Slightly · **Medium** · A lot
- Stops after three pulses: on · **off**
- Badge color: **Red** · Pink · Blue · Purple · Orange

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Pulse style: Grow, Speed: Normal, How much it grows: Medium, Stops after three pulses: off, Badge color: Red.

## Tooltip Reveal

A small label fades in after a short pause. Best for icon buttons.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/tooltip-reveal/
- How it runs: reacts to the visitor
- Good for: Icon buttons · Cut-off text · Form hints · Chart values
- Avoid on: Key information · Long text

**Prompt**

Add tooltips to [the icon buttons, shortened text or fields that need a short explanation]. When the pointer rests on an item, or keyboard focus reaches it, wait a moment, then fade the tooltip in beside it while it grows very slightly from the side facing the item, so it feels light rather than like a pop-up. The wait keeps tooltips from flashing while the pointer only passes by. When the pointer leaves, hide it again, after a pause if the settings include one, and let the Escape key close it at once. On touch screens, show and hide it with a tap. If the visitor has reduced motion turned on, fade it without growing. Match the settings listed below.

**Settings** (the defaults in bold):

- Delay before showing: None · Short · **Medium** · Long
- Speed: Slow · **Normal** · Fast
- Delay before hiding: None · **Short** · Long
- Shows an arrow: on · **off**

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Delay before showing: Medium, Speed: Normal, Delay before hiding: Short, Shows an arrow: off.

## Drawer / Panel Slide

A side panel slides in over a dimmed page. Best for mobile menus.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/drawer-slide/
- How it runs: reacts to the visitor
- Good for: Mobile menus · Filters · Settings panels
- Avoid on: Short messages · Main content

**Prompt**

Add a slide-in drawer to [the menu or panel you want to open]. It waits just beyond one edge of the screen and slides in over the page when its button is pressed; when the settings include it, the page behind it dims. Let it slow down as it arrives, like a panel sliding to a stop, and speed up as it leaves, so closing feels quicker than opening. Close it with a close button, a tap on the page beside it, the Escape key or a swipe back toward its edge. Move only its position, and keep keyboard focus inside it while it is open. If the visitor has reduced motion turned on, show and hide it without sliding. Match the settings listed below.

**Settings** (the defaults in bold):

- Slides in from: **Left** · Right · Top · Bottom
- Opening speed: Slow · **Normal** · Fast
- Closing speed: Slow · **Normal** · Fast
- Page dimming: None · Light · **Medium** · Dark

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Slides in from: Left, Opening speed: Normal, Closing speed: Normal, Page dimming: Medium.

## Modal Expand

A window grows out of the button you pressed. Best for detail views.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/modal-expand/
- How it runs: reacts to the visitor
- Good for: Detail views · Confirmations · Quick forms · Action buttons
- Avoid on: Long content · Full pages

**Prompt**

Add a modal that grows out of its button to [the button or card that opens a dialog or detail view]. When it is pressed, measure where that button sits and grow the modal from that spot to full size in the middle of the screen while the page behind it dims, so it clearly comes from what was pressed. Close it with its buttons, a tap on the dimmed page or the Escape key, and let it shrink back toward the same spot. Animate only its scale and opacity. Move keyboard focus into it, and back to the button when it closes. If the visitor has reduced motion turned on, show it at full size without growing. Match the settings listed below.

**Settings** (the defaults in bold):

- Speed: Slow · **Normal** · Fast
- Starting size: Tiny · **Small** · Medium
- Feel: **Springy** · Smooth · Even
- Marks where it grows from: **on** · off

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Speed: Normal, Starting size: Small, Feel: Springy, Marks where it grows from: on.

## Accordion Open/Close

Each question opens smoothly to show its answer. Best for FAQ pages.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/accordion/
- How it runs: reacts to the visitor
- Good for: FAQ pages · Settings · Menus · Long documents
- Avoid on: Key information · Short content

**Prompt**

Add an accordion to [the questions or sections you want to fold away]. Show only the headings at first; when one is pressed, its content box grows from nothing to its full height and the headings below slide down, and pressing it again shrinks it back. Animate the box to the content's real height, never to a large fixed maximum, or the timing looks wrong. When the settings include it, turn a small arrow to show which items are open. Make each heading a real button that tells screen readers whether it is open. If the visitor has reduced motion turned on, open and close the sections without animating. Match the settings listed below.

**Settings** (the defaults in bold):

- Speed: Slow · **Normal** · Fast
- Feel: **Gentle** · Smooth · Even
- Several open at once: on · **off**
- Built with: **Measured height** · Grid rows
- Arrow flips: **on** · off
- Text fades in: on · **off**

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Speed: Normal, Feel: Gentle, Several open at once: off, Built with: Measured height, Arrow flips: on, Text fades in: off.

## Cursor Follower

A dot trails your pointer and flips the colors under it. Best for portfolios.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/cursor-follower/
- How it runs: reacts to the visitor
- Good for: Portfolios · Agency sites · Interactive stories
- Avoid on: Forms and tools · Reading pages

**Prompt**

Add a cursor follower to [the page or section where it should appear]. Draw a small shape that follows the pointer with a slight delay: each frame, close a share of the gap that is exponential in the time since the last frame, so it follows at the same pace on every screen. Hide it when the pointer leaves. When the settings include them, let it flip the colors beneath it so it stays visible on light and dark areas alike, and let it grow over buttons and links. Move it with transforms only. Touch screens have no pointer, so hide it there or let it glide to where the visitor taps. If the visitor has reduced motion turned on, keep the normal cursor instead. Match the settings listed below.

**Settings** (the defaults in bold):

- Lag: Short · **Medium** · Long
- Size: Small · **Medium** · Large
- Flips the colors under it: **on** · off
- Shape: **Circle** · Ring · Square
- Grows over buttons: **on** · off

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Lag: Medium, Size: Medium, Flips the colors under it: on, Shape: Circle, Grows over buttons: on.

## Error Shake

A field shakes side to side when the input is wrong. Best for sign-in forms.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/error-shake/
- How it runs: reacts to the visitor
- Good for: Sign-in forms · Codes and PINs · Form fields
- Avoid on: Whole pages · Warnings

**Prompt**

Add an error shake to [the form field that can be rejected, such as a password]. When the value is wrong or missing, move the field quickly left and right a few times, each swing smaller than the last, and end exactly where it started, like a head shaking no. Turn its border red and show a short message saying what went wrong, because movement and color alone do not explain the problem. Move only its horizontal position so the shake stays smooth, and restart the shake on every failed try. If the visitor has reduced motion turned on, skip the shake and keep the red border and the message. Match the settings listed below.

**Settings** (the defaults in bold):

- Shake distance: Small · **Medium** · Large
- Number of swings: Few · **Medium** · Many
- Speed: Slow · **Normal** · Fast

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Shake distance: Medium, Number of swings: Medium, Speed: Normal.

## Swipe to Dismiss

A card dragged sideways flies off and the list closes up. Best for inboxes.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/swipe-to-dismiss/
- How it runs: reacts to the visitor
- Good for: Inboxes · Notifications · Chat lists · To-do lists
- Avoid on: Permanent deletes · Mouse-only tools

**Prompt**

Add swipe to dismiss to [the list items people should be able to remove]. While an item is dragged sideways, it follows the finger exactly and fades a little; when the settings include it, a red Delete label shows behind it. On release, remove it if it went far enough or was flicked quickly: it slides off the edge and its row closes up so the list moves up smoothly. Otherwise it springs back into place. Use pointer events so mouse, touch and pen all work, and let up-and-down scrolling still pass through. Offer an undo, and a button for people who cannot drag. If the visitor has reduced motion turned on, remove the row at once without sliding. Match the settings listed below.

**Settings** (the defaults in bold):

- Distance to delete: Short · **Medium** · Long
- Shows a Delete label: **on** · off

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Distance to delete: Medium, Shows a Delete label: on.

## Hamburger Menu Toggle

Three lines turn into an X as the menu opens. Best for mobile menus.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/hamburger-menu-toggle/
- How it runs: reacts to the visitor
- Good for: Mobile menus · Compact headers · Side panels
- Avoid on: Wide desktop menus

**Prompt**

Add a menu button whose three lines turn into an X to [the menu button in your header]. When it is pressed, the top and bottom lines move to the middle and turn to cross each other while the middle line fades away, and pressing it again reverses the change. Use the same three lines for both states, moving and turning them rather than swapping icons, and move each outer line exactly to the middle so the X meets at its center. Make it a real button that tells screen readers whether the menu is open. If the visitor has reduced motion turned on, switch between the two icons without movement. Match the settings listed below.

**Settings** (the defaults in bold):

- Speed: Slow · **Normal** · Fast
- Feel: **Gentle** · Springy · Smooth · Even
- Line thickness: Thin · **Medium** · Thick

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Speed: Normal, Feel: Gentle, Line thickness: Medium.

## Theme Toggle Morph

A sun turns into a moon as the colors switch to dark. Best for theme buttons.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/theme-toggle-morph/
- How it runs: reacts to the visitor
- Good for: Theme buttons · Settings · Headers
- Avoid on: Dense forms · Icons without labels

**Prompt**

Add a theme toggle whose icon turns from a sun into a moon to [the button that switches your site between light and dark]. When it is pressed, the sun's rays shrink into its center while a circle slides across the sun and cuts it into a crescent, so the sun becomes the moon instead of being swapped for another icon. Switch the page's colors at the same moment and at the same pace. Make it a real button whose label says what pressing it will do, and remember the visitor's choice for their next visit. If the visitor has reduced motion turned on, switch the icon and the colors without movement. Match the settings listed below.

**Settings** (the defaults in bold):

- Speed: Slow · **Normal** · Fast
- Feel: **Gentle** · Springy · Even

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Speed: Normal, Feel: Gentle.

## Copy to Clipboard

Copy turns into a tick and Copied, then changes back. Best for codes and links.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/copy-to-clipboard/
- How it runs: reacts to the visitor
- Good for: Share links · Invite codes · Code blocks · API keys
- Avoid on: Slow actions · Important saves

**Prompt**

Add copy feedback to [the Copy button next to your code, link or key]. When the copy succeeds, turn the button's icon into a tick and its label into Copied!, with a brief flash of color, then change it back on its own after a moment so it is ready to use again. Stack both icons and both labels in the same place so the change never shifts the layout. Show the confirmation only once the copy has really worked, tell screen readers with a short status message, and say so if copying fails. If the visitor has reduced motion turned on, swap the icon and label without movement. Match the settings listed below.

**Settings** (the defaults in bold):

- Speed: Slow · **Normal** · Fast
- Time before it changes back: Short · **Medium** · Long
- Feel: **Springy** · Smooth · Even

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Speed: Normal, Time before it changes back: Medium, Feel: Springy.

## Star Rating

Stars fill up to your pointer and pop when you choose. Best for reviews.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/star-rating/
- How it runs: reacts to the visitor
- Good for: Reviews · Surveys · Feedback forms · Media ratings
- Avoid on: Precise scores

**Prompt**

Add a star rating to [the review or feedback form]. As the pointer moves along the row, fill the stars up to the one under it so the choice shows before it is made, and bring back the chosen rating when the pointer leaves. Clicking or tapping a star chooses that rating and makes the star pop: it grows briefly, dips a little below its size and settles. On touch screens, a finger dragged along the row previews too. Make the row one control that the arrow keys can change, and show the rating as a number as well, so it never depends on color alone. If the visitor has reduced motion turned on, fill the stars without the pop. Match the settings listed below.

**Settings** (the defaults in bold):

- Pop size: Small · **Medium** · Large
- Speed: Slow · **Normal** · Fast
- Allows half stars: on · **off**
- Number of stars: Three · **Five** · Ten

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Pop size: Medium, Speed: Normal, Allows half stars: off, Number of stars: Five.

## Toast Notification

Short messages slide into a corner, then leave on their own. Best for updates.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/toast-notification/
- How it runs: reacts to the visitor
- Good for: Save confirmations · Upload updates · Sync notices
- Avoid on: Errors that need action · Long messages

**Prompt**

Add toast notifications to [the actions in your app that should be confirmed quietly, such as saving]. Each toast comes into a corner of the screen with a short message and a thin bar that empties as it counts down, then leaves on its own. New toasts stack; when one leaves, the others glide over to close the gap, moved with transforms rather than by changing the layout. Pause the countdown while the pointer is over a toast, and let a tap, a sideways swipe or a close button dismiss it early. Announce each message to screen readers without moving focus. If the visitor has reduced motion turned on, show and hide toasts without movement. Match the settings listed below.

**Settings** (the defaults in bold):

- Corner: Top left · **Top right** · Bottom left · Bottom right
- How it comes in: **Slides** · Fades · Grows
- Time on screen: Short · **Medium** · Long
- Most at once: Two · Three · **Four**

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Corner: Top right, How it comes in: Slides, Time on screen: Medium, Most at once: Four.

## Segmented Control

A highlight slides to the option you pick. Best for switching views.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/segmented-control/
- How it runs: reacts to the visitor
- Good for: View switchers · Filters · Date ranges
- Avoid on: Many options · Long labels

**Prompt**

Add a segmented control to [the row of options people switch between, such as Day, Week and Month]. Show the options side by side with one highlight behind the chosen one. When another option is chosen, slide the highlight over to it and stretch or shrink it to that option's width, while the labels' colors cross over as it lands. Measure the chosen option and move the highlight with transforms only, measuring again when fonts load or the window resizes. Make it one group of radio buttons that the arrow keys move through. If the visitor has reduced motion turned on, move the highlight without sliding. Match the settings listed below.

**Settings** (the defaults in bold):

- Speed: Slow · **Normal** · Fast
- Feel: **Springy** · Smooth · Even
- Highlight: **Pill** · Underline
- Number of options: Two · Three · **Four** · Five

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Speed: Normal, Feel: Springy, Highlight: Pill, Number of options: Four.

## Pull to Refresh

Pulling a list down shows a spinner, then new items. Best for feeds.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/pull-to-refresh/
- How it runs: reacts to the visitor
- Good for: Feeds · Inboxes · Notifications · Order lists
- Avoid on: Desktop-only pages · Lists that rarely change

**Prompt**

Add pull to refresh to [the scrolling list or feed that should reload]. When the list is already at its top and the visitor drags it down, move it with the finger but make it resist more the further it goes, and show a spinner above it that fades in and turns as it is pulled. Let go past the line and the list stays down while the spinner keeps turning and new items load, then everything slides back up with the new items on top; a shorter pull just springs back. Also offer a refresh button for people who cannot drag. If the visitor has reduced motion turned on, snap back without sliding. Match the settings listed below.

**Settings** (the defaults in bold):

- Pull distance: Short · **Medium** · Long
- Resistance: Low · **Medium** · High
- Spinner: **Ring** · Dots · Bars
- Refresh time: Short · **Medium** · Long

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Pull distance: Medium, Resistance: Medium, Spinner: Ring, Refresh time: Medium.

## Animated Gradient Border

A band of colors runs around the edge of a card or button. Best for featured offers.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/gradient-border/
- How it runs: moves by itself
- Good for: Featured plans · Main buttons · New features · Promo cards
- Avoid on: Every card on a page · Calm reading pages

**Prompt**

Add an animated gradient border to [the card or button you want to stand out]. Give it an edge where a band of colors keeps running around it; wherever the band does not reach, the edge stays a faint line. Build it from a square layer, twice as wide as the element, filled with a gradient that sweeps around its center, clipped to the element's rounded shape and covered by an inner box everywhere but the edge. Turn that layer and never animate the gradient itself, so the browser only rotates a finished picture. For a glow, put a blurred copy of the same layer behind it. If the visitor has reduced motion turned on, keep the border still. Match the settings listed below.

**Settings** (the defaults in bold):

- Colors: **Rainbow** · Sunset · Ocean
- Speed: Slow · **Normal** · Fast
- Soft glow: **on** · off
- Band length: Short · **Long** · All around
- Border width: Thin · **Medium** · Thick

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Colors: Rainbow, Speed: Normal, Soft glow: on, Band length: Long, Border width: Medium.

## Spotlight Hover Glow

A soft glow follows the pointer and lights card edges. Best for feature grids.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/spotlight-hover/
- How it runs: reacts to the visitor
- Good for: Feature grids · Pricing cards · Dashboards · Portfolios
- Avoid on: Light themes · Text-heavy pages

**Prompt**

Add a spotlight glow to [the grid of dark cards you want to light up]. As the pointer moves over the grid, a soft round light follows it across the cards and, when the settings include it, lights up the card edges closest to the pointer while the far edges stay dim. Give each card its own light, clipped to the card, and move it to the pointer with transforms only, so nothing is repainted while it moves. Fade the light in when the pointer arrives and out when it leaves. On touch screens, let a finger dragged across the cards move the light. If the visitor has reduced motion turned on, keep the light on the pointer with no glide. Match the settings listed below.

**Settings** (the defaults in bold):

- Glow size: Small · **Medium** · Large
- Color: White · Orange · Pink · **Purple** · Blue · Green
- Lights the edges: **on** · off
- Lag: None · **Short** · Long

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Glow size: Medium, Color: Purple, Lights the edges: on, Lag: Short.

## Add-to-Cart Fly

The product flies into the cart, which bumps and counts up. Best for shops.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/add-to-cart-fly/
- How it runs: reacts to the visitor
- Good for: Online shops · Product lists · Food ordering · Wish lists
- Avoid on: Bulk order forms · Quick reorder lists

**Prompt**

Add an add-to-cart animation to [the Add to cart buttons of your product list]. When one is pressed, copy that product's picture and fly the copy into the cart icon, shrinking it on the way, then remove it. Move it with transforms only: for a curved path, slide it sideways at an even pace while an inner layer rises and then drops into the cart; for a straight path, move both together. As it lands, raise the number on the cart and, when the settings include it, give the cart a small bump. Tell screen readers that the item was added. If the visitor has reduced motion turned on, fly nothing and fade the new number in. Match the settings listed below.

**Settings** (the defaults in bold):

- Flight speed: Slow · **Normal** · Fast
- Path: **Arc** · Straight
- Cart bumps: **on** · off

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Flight speed: Normal, Path: Arc, Cart bumps: on.

## Drag to Reorder

Drag an item and the others slide aside to make room. Best for to-do lists.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/drag-to-reorder/
- How it runs: reacts to the visitor
- Good for: To-do lists · Playlists · Priority rankings · Menu editors
- Avoid on: Lists sorted by date · Very long lists

**Prompt**

Add drag to reorder to [the list whose order people can change]. Lift the picked-up item and let it follow the pointer exactly; as it passes a neighbor's middle, slide that neighbor into the gap, and on release settle it into place and save the order. Shift the items rather than changing the layout, so it stays smooth. Support the keyboard: Space picks up, the arrow keys move, Space drops and Escape cancels, each step read out to screen readers. On touch screens, start a drag at once from the grip; if the rest of an item can start one too, only after a short press, so swipes still scroll. If the visitor has reduced motion turned on, move items straight to their places. Match the settings listed below.

**Settings** (the defaults in bold):

- Slide speed: Slow · **Normal** · Fast
- How much it lifts: **Subtle** · Strong
- Drags by the handle only: on · **off**

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Slide speed: Normal, How much it lifts: Subtle, Drags by the handle only: off.

## Rolling Numbers

Each digit rolls to its new value, like a mileage counter. Best for prices.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/rolling-numbers/
- How it runs: reacts to the visitor
- Good for: Counters · Prices · Scores · Dashboards
- Avoid on: Numbers that change every second · Long decimals

**Prompt**

Add rolling numbers to [the number that changes, such as a counter, score or price]. Show each digit in a small window over a column of the digits 0 to 9, and when the value changes, slide each column so its new digit rolls into view, like the wheels of a mileage counter; digits that stay the same do not move, and separators stay still. Give every digit the same width so the number never shifts sideways, and only slide the columns, never resize anything, so it stays smooth. Let screen readers hear the plain number once. If the visitor has reduced motion turned on, swap the digits with a short fade instead of rolling. Match the settings listed below.

**Settings** (the defaults in bold):

- Roll speed: Slow · **Normal** · Fast
- Direction: Up · Down · **Shortest**
- Digits one after another: **on** · off

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Roll speed: Normal, Direction: Shortest, Digits one after another: on.

## Typing Indicator

Three dots in a chat bubble move in turn while someone types. Best for chat apps.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/typing-indicator/
- How it runs: moves by itself
- Good for: Chat apps · Support chat · AI assistants · Comment threads
- Avoid on: Long waits · Replies that are not live

**Prompt**

Add a typing indicator to [the chat or comment thread where replies arrive]. While the other person is typing, show a small bubble on their side of the conversation with three dots that move one after another in a steady loop, so it reads as someone writing right now. Show it only while they are really typing, hide it after a few quiet seconds, and when their message arrives, put the message where the bubble was. Animate only the dots, never the bubble's size, so it stays smooth, and give screen readers a short text that says who is typing. If the visitor has reduced motion turned on, keep the dots in place and only let them brighten in turn. Match the settings listed below.

**Settings** (the defaults in bold):

- How the dots move: **Bounce** · Fade · Wave
- Speed: Slow · **Normal** · Fast
- Bubble color: **Gray** · Blue · Green · Purple

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: How the dots move: Bounce, Speed: Normal, Bubble color: Gray.

## Hold to Confirm

A button fills up while you hold it and acts only once it is full. Best for delete buttons.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/hold-to-confirm/
- How it runs: reacts to the visitor
- Good for: Delete buttons · Closing an account · Sending money · Emergency alerts
- Avoid on: Everyday actions · Actions with Undo

**Prompt**

Add hold to confirm to [the button for a risky action, such as Delete]. While the visitor holds it down, a fill grows steadily, and the action runs only once it is full, when a tick shows. If they let go early, the fill drains back, nothing happens and a short hint says to keep holding; when the settings ask for it, the button also shakes. Holding Space or Enter works the same way, and on touch a long press must not open the browser's menu. Grow the fill smoothly by the time held, not per frame, and announce the result to screen readers. If the visitor has reduced motion turned on, fill in a few steps without the shake. Match the settings listed below.

**Settings** (the defaults in bold):

- How long to hold: Short · **Medium** · Long
- Fill style: **Bar** · Ring
- Shakes if let go early: **on** · off
- How fast it drains: **Quickly** · Slowly

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: How long to hold: Medium, Fill style: Bar, Shakes if let go early: on, How fast it drains: Quickly.

## Expanding Search

A search icon opens into a field, then closes when done. Best for toolbars.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/expanding-search/
- How it runs: reacts to the visitor
- Good for: Toolbars · Mobile headers · Docs sites · Dashboards
- Avoid on: Sites where search comes first

**Prompt**

Add an expanding search to [the toolbar or header where search should sit]. Show only a search icon until it is pressed; then open a search field out of the icon, over the items beside it, and put the text cursor in it. Reveal the field with a clip or a scale from the icon's side, never by animating its width, so nothing around it moves. Escape or a close button closes it and gives the focus back to the icon, and a closed field stays out of the Tab order. Make the icon a real button with a label. If the visitor has reduced motion turned on, open and close it at once. Match the settings listed below.

**Settings** (the defaults in bold):

- Opens toward: **Left** · Right
- Speed: Slow · **Normal** · Fast
- Closes when you leave it: **on** · off

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Opens toward: Left, Speed: Normal, Closes when you leave it: on.

## Button Loading States

The button becomes a spinner, then a tick or a cross. Best for Save buttons.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/button-loading-states/
- How it runs: reacts to the visitor
- Good for: Save buttons · Contact forms · Checkout · Sign-up forms
- Avoid on: Instant actions · Long uploads

**Prompt**

Add loading states to [the button that sends a form or saves something]. When it is pressed, fade its label out, show a spinner in its place and ignore further presses until it is done. When the answer comes, swap the spinner for a tick, or for a cross with a short shake if it failed, then bring the label back after a moment. When the settings ask for it, shrink the button's colored shape into a circle around the spinner with a clip, never by animating its width, so nothing around it moves. Announce each change to screen readers. If the visitor has reduced motion turned on, keep the shape and change the label's words instead. Match the settings listed below.

**Settings** (the defaults in bold):

- Result: **Success** · Error
- Speed: Slow · **Normal** · Fast
- Shrinks to a circle: **on** · off
- How long it loads: Short · **Medium** · Long

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Result: Success, Speed: Normal, Shrinks to a circle: on, How long it loads: Medium.

## Image Trail

Pictures pop up in a trail behind your pointer, then fade. Best for portfolios.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/image-trail/
- How it runs: reacts to the visitor
- Good for: Portfolio heroes · Photo galleries · Agency sites · Lookbooks
- Avoid on: Reading pages · Busy layouts

**Prompt**

Add an image trail to [the hero section the pointer moves over]. Each time the pointer has traveled a set distance, drop a picture at its tip, so a still pointer leaves none. Each new picture pops up on top of the others, gliding in from where the last one appeared, stays a while, then leaves and fades away. Reuse a small set of picture elements in turn, and move, scale and fade them with transforms and opacity only, so it stays smooth. On touch screens, let a finger dragged across the section leave the trail. If the visitor has reduced motion turned on, show one picture at a time where they point, fading in and out without moving. Match the settings listed below.

**Settings** (the defaults in bold):

- How often a picture appears: Often · **Normal** · Rarely
- How long they stay: Short · **Normal** · Long
- Picture size: Small · **Medium** · Large
- How they leave: **Shrink** · Fade · Fall
- Tilts the pictures: **on** · off

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: How often a picture appears: Normal, How long they stay: Normal, Picture size: Medium, How they leave: Shrink, Tilts the pictures: on.

## Gooey Menu

Small buttons ooze out of a round button like liquid. Best for quick actions.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/gooey-menu/
- How it runs: reacts to the visitor
- Good for: Quick actions · Share menus · Mobile apps · Playful brands
- Avoid on: Long menus · Formal sites

**Prompt**

Add a gooey menu to [the round action button on your page]. Pressing it lets smaller buttons ooze out like drops of liquid and pop into place; pressing again pulls them back in. Draw plain circles of one color on a layer under the icons and run that layer through a filter that blurs it, then sharpens the blurred edge again, so circles that touch melt together. Move them only with transforms, keep the filtered layer small and blur less on phones. Make every button a real button the keyboard can reach, tell screen readers whether the menu is open, and let Escape close it. If the visitor has reduced motion turned on, fade the buttons in place without the stretch. Match the settings listed below.

**Settings** (the defaults in bold):

- Layout: Row · **Arc** · Column
- How gooey: Low · **Medium** · High
- Speed: Slow · **Normal** · Fast
- Button color: **Orange** · Pink · Purple · Blue · Green

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Layout: Arc, How gooey: Medium, Speed: Normal, Button color: Orange.

## Dynamic Island

A black pill grows into a notification, then shrinks back. Best for live updates.

- Live demo: https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/dynamic-island/
- How it runs: reacts to the visitor
- Good for: Calls and timers · Music players · Order tracking · Live scores
- Avoid on: Long messages · Errors that need action

**Prompt**

Add a Dynamic Island style notification to [the top of your app or page]. At rest it is a small black pill; when [an event such as an incoming message] happens or the pill is pressed, it grows into a rounded card with the details, then shrinks back. Change the black shape with a clip or a scale, never by animating its width or height, so the text inside never stretches and nothing around it moves. Keep the details inside the shape, fading them in once it has room. Make the pill a real button for taps, clicks and the keyboard, and announce its message politely to screen readers. If the visitor has reduced motion turned on, crossfade the pill and the card instead. Match the settings listed below.

**Settings** (the defaults in bold):

- Notification: **Call** · Timer · Music
- Speed: Slow · **Normal** · Fast
- Bounce: None · **Soft** · Springy

Copied from the site with the defaults, the prompt ends with this line:

Settings from the demo: Notification: Call, Speed: Normal, Bounce: Soft.
