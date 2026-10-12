---
name: animation-handbook
description: Builds web animations from Animation Handbook, a set of 166 tested techniques with plain-words build prompts and settings (scroll effects, entrances and exits, page transitions, micro-interactions for buttons and forms, text effects, 3D and WebGL, ambient backgrounds). Use when the user asks to add, pick or improve an animation, transition, hover or click effect, loading state, scroll effect or background motion in a web page or web app, in any framework or plain HTML, CSS and JavaScript.
license: MIT
---

# Animation Handbook

[Animation Handbook](https://matinmonshizadeh.github.io/animation-handbook/) is a free reference of 166 web animation techniques. Each one has a page where it plays live, a few plain settings for most of them (speed, direction, color and the like) and a prompt that says in plain words how to build it. This skill holds every prompt and every setting with the demo's values, so you can pick the right technique and build it into the user's own project.

## How to use it

1. **Find the technique.** Search [references/catalog.md](references/catalog.md) for the effect the user describes and a synonym or two, rather than reading the whole file. Each line holds one technique: its name and live demo address, what it does and what it is best for, and its places, the parts of a page it suits (Buttons, Text, Images & cards, Backgrounds, Menus & forms, Loading & messages, Page intros, Scrolling, Page changes). Match both what the user describes and where it goes. Read the whole catalog, or its By place index at the end, only when the user wants ideas or a search finds nothing that fits. When two fit equally well, build one and mention the other; when none fits, say so and build what the user asked for with the rules below.
2. **Read its entry.** It is in the category file named after the folder in its address (references/04-micro-interactions.md for an address under animations/04-micro-interactions/), from the heading with the technique's name to the next heading: what it is good for and what to avoid it on, how it runs, its prompt and its settings. If the user's place is on its Avoid on list, say so and suggest a better fit.
3. **Choose the settings.** Each setting lists its choices and what they do, with the demo's values. The choice in bold is where the demo starts, set to show the effect off in a small box: a starting point, not advice for every page. Take what the user asked for first ("a panel that slides in slowly from the left" picks the slow speed and the left side), then choose the rest for their page: its size, how many things move and what the effect is for. A speed that suits a small demo can feel rushed across a full-width hero, and a delay that reads well between many small tiles can vanish between a few large cards. Ask only when a choice changes the result a lot and nothing points either way.
4. **Build the smallest version that does what the user asked**, in their own stack (plain HTML, CSS and JavaScript, React, Vue, Svelte or whatever the project uses), with their element in place of each [part in square brackets]. The prompt describes the whole technique as its demo shows it. Keep everything it says about looking right, staying smooth, accessibility and reduced motion, but build only the features the request needs: one confirmation message does not need a stack of them, and a hover effect does not need a touch-drag version when touch users miss nothing without it. "Match the settings listed below" means your choices from step 3.
5. **Check it** against the rules below. Then tell the user which technique you built, with its live demo address; the settings you chose, and why where they differ from the demo's; and the features of the prompt you left out, as options they can ask for.

When the user only asks which animation to use, suggest one or two from the catalog with their live demo addresses, and build once they choose. To improve an animation the project already has, find its closest technique the same way and change only what falls short of that prompt and the rules below.

## The rules for the user's page

Keep these even where a prompt does not say them. Each prompt describes its technique as the demo shows it, in a box on a page about animation; where a prompt and a rule differ, follow the rule, which is about real pages.

- **Keep the page whole without the animation.** Nothing on screen when the page loads waits for a scroll to appear: it shows at once or plays its entrance right away, and only what starts below the first screen waits for the scroll. Hide content for an entrance only from the script that will reveal it, and create controls that work only with a script, such as an accordion's buttons, from that script, so the page still shows everything if the script fails.
- **Give keyboard users what mouse users get on what they can reach.** On a link, button or form control, an effect that shows on hover also shows on focus, and one that starts on a press also starts on Enter or Space, from the middle of the control. Do not make other content focusable for a decorative effect, and leave the arrow keys alone unless the element is a control that uses them, such as a slider or a carousel: extra tab stops and captured keys cost keyboard users more than the effect gives them.
- **Give touch what it needs.** When a hover reveals something people need, such as a menu, a tooltip or a hidden button, a tap reveals it too, and a drag uses pointer events so that touch works. A purely decorative hover effect, such as a tilt or a glow, can stay still on touch screens.
- **Follow reduced motion.** When the device asks for reduced motion, show the end state or a short fade instead of the movement, and start loops paused.
- **Move with transform and fade with opacity.** Never animate width, height, top, left or box-shadow, which make the browser lay out or repaint the page on every frame. Where the effect is something else, such as a clip, a line that draws itself, a color change or a blur-in, the prompt says how to keep it smooth.
- **Make soft shapes from gradients.** A glow or a blob of color that only needs soft edges gets them from a gradient that fades to transparent, not from a large blur filter, which costs the browser a lot on every frame while the shape moves; a gradient is drawn once and then only moved. Keep the blur where it is the effect, as in a blur-in, frosted glass or a gooey merge.
- **Stop what nobody can see.** A loop that keeps running, such as an ambient background, a canvas or a frame loop, pauses while it is scrolled out of view; a frame loop or timer also stops while the tab is hidden.
- **Time a frame loop by the clock.** Each frame moves by the time since the last one, capped at about 50 ms, never by a fixed step, so it runs at the same speed on 30, 60 and 120 Hz screens.
- **Lighten heavy effects on phones**, up to 600 px wide or 500 px tall when held sideways: less blur, fewer particles, a simpler shader.
- **Keep touch targets at least 44×44 px on phones**, buttons and handles drawn inside the animation included, and **text at least 4.5:1 against its background.**
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

Each live demo address is also the technique's folder in the repository, https://github.com/matinmonshizadeh/animation-handbook: the page holds the demo's code, and its README (the address followed by README.md) explains how it works, with production notes. The entries hold what you need to build a technique; read a README only when the user asks how one works.
