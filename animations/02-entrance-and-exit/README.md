# Entrance & Exit

Element-level entrance and exit animations — how individual pieces of UI arrive, reveal, and depart.

## Entries

- [Fade In / Fade Out](fade-in-out/) — opacity 0 → 1 enter, 1 → 0 exit; the cheapest property to animate.
- [Slide In](slide-in/) — translates from an off-screen edge into final position; combine with fade for natural arrival.
- [Slide Up Reveal](slide-up-reveal/) — text or content rises from below its clip boundary; two technique variants (translateY and clip-path).
- [Scale In / Zoom In](scale-in/) — scales from a small start value to 1.0; pairs well with springy easing.
- [Clip-Path Reveal](clip-path-reveal/) — a shape mask expands to uncover the element; cinematic, element stays fully rendered throughout.
- [Curtain Reveal](curtain-reveal/) — a colored bar slides over then off in two stages, dramatically revealing content.
- [Split Text Reveal](split-text-reveal/) — text split into chars, words, or lines; each piece animates with a staggered delay.
- [Letter-by-Letter Stagger](letter-by-letter-stagger/) — cascade (CSS transition-delay per letter) or typewriter (JS sequential reveal with blinking cursor).
- [Word-by-Word Reveal](word-by-word-reveal/) — words animate sequentially at reading speed; built for taglines and hero statements.
- [Blur In](blur-in/) — fades in while reducing blur; mimics camera focus pulling.
- [Flip In](flip-in/) — rotates from a flat plane into view using CSS 3D perspective.
- [Bounce In](bounce-in/) — overshoots final position then springs back; implemented with explicit @keyframes waypoints.
- [Rotate In](rotate-in/) — spins while entering; best on radially-symmetric shapes like icons and stars.
