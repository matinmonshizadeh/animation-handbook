---
name: animation-handbook
description: Builds web animations from Animation Handbook, a set of 166 tested techniques with plain-words build prompts and settings (scroll effects, entrances and exits, page transitions, micro-interactions for buttons and forms, text effects, 3D and WebGL, ambient backgrounds). Use when the user asks to add, pick or improve an animation, transition, hover or click effect, loading state, scroll effect or background motion in a web page or web app, in any framework or plain HTML, CSS and JavaScript.
license: MIT
---

# Animation Handbook

[Animation Handbook](https://matinmonshizadeh.github.io/animation-handbook/) is a free reference of 166 web animation techniques. On the site, each one has a page where it plays live, a few plain settings for most of them (speed, direction, color and the like) and a prompt that says in plain words how to build it, with no code. This skill holds all of those prompts and settings, so you can build any of the techniques in the user's own project.

## How to use it

1. **Find the technique** in [references/catalog.md](references/catalog.md): one line per animation, with what it does, what it is best for and its places, the parts of a page it suits (Buttons, Text, Images & cards, Backgrounds, Menus & forms, Loading & messages, Page intros, Scrolling, Page changes). Match both what the user describes and where it goes. When two fit equally well, build one and mention the other. If nothing fits, say so and build what the user asked for with the rules below.
2. **Read its entry** in the category file the catalog line names. The files are long, so find the heading with the technique's name and read down to the next heading: the prompt, the settings with their defaults, how it runs, what it is good for and what to avoid it on. If the user's place is on its Avoid on list, say so and suggest a better fit from the catalog.
3. **Choose the settings** from the user's words: "a panel that slides in slowly from the left" picks the slow speed and the left side. Keep the default (in bold) for anything they did not mention, and ask only when a choice changes the result a lot and nothing they said points either way. The choices are named, not numbered: the technique's README gives the demo's own values for many of them (see the end of this file); otherwise choose values that fit the name and the project.
4. **Build it** in the user's own stack, from plain HTML, CSS and JavaScript to React, Vue, Svelte or whatever the project already uses. Follow the prompt as the specification, with the user's own element in place of each [part in square brackets]. "Match the settings listed below" means the settings from step 3; the line at the end of each entry shows how the site lists them.
5. **Check it** against the rules below, then tell the user which technique you built, with its live demo address, and which settings you chose.

When the user only asks which animation to use, suggest one or two from the catalog with their live demo addresses, and build once they choose. To improve an animation the project already has, find its closest technique the same way and change only what falls short of that prompt and the rules below.

## The rules every animation follows

The handbook's demos follow these rules and the prompts take them for granted, so keep them even where a prompt does not repeat them.

- **Move with transform and fade with opacity.** Never animate width, height, top, left or box-shadow, which make the browser lay out or repaint the page on every frame. Where a prompt asks for something else, such as a blur, a clip, a line that draws itself, a color change or a font weight, follow the prompt: it says how to keep that smooth.
- **Move a JavaScript frame loop by elapsed time.** Each frame moves by the time since the last one, capped at about 50 ms, never by a fixed step per frame, so it runs at the same speed on a 30 Hz, 60 Hz or 120 Hz screen.
- **Follow reduced motion.** When the device asks for reduced motion, show the end state or a short fade instead of the movement, and start loops paused.
- **Give a hover or a drag a touch equivalent.** A hover effect also works with a tap, and a drag uses pointer events so that touch works too.
- **Make it work from the keyboard.** An effect that shows on hover also shows on keyboard focus. An effect that follows the pointer inside its own area, such as a card or a button, works from the keyboard when that area has focus: focus shows it and the arrow keys move it. A page-wide effect, such as a custom cursor or an image trail, never takes over the arrow keys, which scroll the page. An effect that starts on a press also starts on Enter or Space, from the middle of the control.
- **Keep controls at least 44×44 px on phones**, buttons and handles drawn inside the animation included.
- **Keep text at least 4.5:1 against its background.**
- **Give heavy effects a lighter phone version.** A big blur, many particles or a shader gets a lighter version on phones, which are up to 600 px wide, or up to 500 px tall when held sideways.
- **Add no library the project does not already use.** Every prompt works with plain code; use GSAP, Framer Motion, Three.js or the like only where the project has it.

## Where to look

- [references/catalog.md](references/catalog.md): all 166 in one list, grouped by category, with an index by place.
- [references/01-scroll-based.md](references/01-scroll-based.md): Scroll-Based, 27 animations. Animations driven by scroll position — parallax, sticky, scrub, snap, and storytelling.
- [references/02-entrance-and-exit.md](references/02-entrance-and-exit.md): Entrance & Exit, 14 animations. Element-level animations for arriving and departing — fades, slides, reveals, flips, and text staggers.
- [references/03-page-transitions.md](references/03-page-transitions.md): Page Transitions, 16 animations. Full-page transitions between routes or views — crossfades, slides, portals, morphs, and the View Transitions API.
- [references/04-micro-interactions.md](references/04-micro-interactions.md): Micro-Interactions, 41 animations. Short, user-triggered animations — hover, click, focus, loading states, and UI feedback patterns.
- [references/05-text-typography.md](references/05-text-typography.md): Text & Typography, 19 animations. Animations specifically for type — kinetic motion, character-level effects, gradient flows, and word transformations.
- [references/06-3d-advanced.md](references/06-3d-advanced.md): 3D & Advanced, 26 animations. WebGL, shaders, particles, 3D transforms, simulations, and other heavier effects.
- [references/07-ambient-background.md](references/07-ambient-background.md): Ambient & Background, 23 animations. Passive, looping effects that hold visual interest without demanding attention — gradients, particles, grain, and glows.

Each live demo address is also the technique's folder in the repository, https://github.com/matinmonshizadeh/animation-handbook. Add README.md to the address (https://matinmonshizadeh.github.io/animation-handbook/animations/02-entrance-and-exit/rotate-in/README.md, for example) to read its README as plain text: how it works, the values behind each setting's choices and production notes. The address itself is the demo, with all of its code in the page.
