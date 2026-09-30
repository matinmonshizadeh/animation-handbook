# Breathing / Pulsing Glow

## What it is
A breathing glow is a soft, round glow of color that slowly grows and brightens, then shrinks and dims, over and over, like someone breathing calmly. A cycle of four to six seconds matches a relaxed breath. It sits behind things that are alive but at rest, such as a paused music player, an idle voice assistant or a meditation timer.

## When to use it
- Idle or "rest" states for voice assistants, AI chat interfaces, and ambient computing products
- Behind a paused or stopped media player where the visual should confirm "it's ready"
- Meditation, focus, or breathing exercise apps where the visual guides the breath
- Logo reveals and brand moments where a single element deserves presence and calm

## How it works
A radial gradient element is animated with a CSS `@keyframes` that varies its `transform: scale()`:

```css
:root {
  --glow-dur: 5s;
  --glow-min: 0.6;
  --glow-max: 1.5;
  --glow-color: #58a6ff;
}

.glow {
  width: 260px; height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--glow-color) 0%, transparent 70%);
  filter: blur(40px);
  opacity: 0.6;
  animation: breathe var(--glow-dur) ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% {
    transform: scale(var(--glow-min));
    opacity: 0.6;
  }
  50% {
    transform: scale(var(--glow-max));
    opacity: 0.9;
  }
}
```

**Double-glow variant** — a second layer with a longer, slightly different cycle creates organic non-synchronization:

```css
.glow-outer {
  width: 390px; height: 390px;
  opacity: 0.3;
  filter: blur(60px);
  animation: breathe calc(var(--glow-dur) * 1.3) ease-in-out infinite reverse;
}
```

The `reverse` direction and 1.3× duration ensures the outer glow is never in phase with the inner glow, making the combined effect feel more organic.

**Paired element breathing** — the center element also scales slightly with its own animation:

```css
.center-el {
  animation: el-breathe var(--glow-dur) ease-in-out infinite;
}
@keyframes el-breathe {
  0%, 100% { transform: scale(1);    opacity: 0.9; }
  50%       { transform: scale(1.02); opacity: 1;   }
}
```

The 2% scale on the center element is intentionally subtle — the eye should not consciously notice the element moving.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Speed | Normal | How long one breath takes: slow is 8s, normal 5s and fast 3s; 4 to 6 seconds feels relaxed, 2 seconds anxious |
| How much it grows | Medium | How far the glow shrinks and grows: a little is 80% to 120% of its size, medium 60% to 150% and a lot 45% to 180% |
| Glow color | Blue | The color of the glow: pink, blue, purple, green or orange (white would hide the white title at the breath's peak) |
| Glow size | Medium | The glow's size before it grows: small is 180px, medium 260px and large 340px |
| Second glow | off | A larger, fainter glow behind the first breathes the other way over a longer cycle, so the two never line up |
| Icon and title breathe too | on | The icon and the title under it swell by 2% with each breath, too little to notice consciously |

## Production notes
- **Why 4–6 seconds?** This range matches the respiratory rate of a relaxed adult (10–15 breaths per minute). Apple's Siri orb uses approximately this range. The match is not accidental — the timing creates a subconscious biofeedback of calm.
- **`filter: blur()` vs `border-radius: 50%`**: the combination creates a round soft glow without needing an image. `filter: blur()` is GPU-accelerated and smooth at all scale values.
- **Easing**: `ease-in-out` gives a slow start, gentle acceleration to the midpoint, and slow deceleration at the peak — matching how breathing actually feels (the inhale begins and ends slowly).
- **`will-change: transform`**: adding this to the glow element hints the browser to allocate a compositing layer. Useful when multiple glows are stacked; unnecessary for a single glow.
- **Framer Motion**: `<motion.div animate={{ scale: [0.6, 1.5, 0.6] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />` — identical result with React.

## See also
- [Ambient Ripple Effect](../ambient-ripple/) — rings spread out instead of a glow swelling
- [Mesh Gradient Animation](../mesh-gradient/) — soft color drifting across a whole background
- [Floating Elements](../floating-elements/) — shapes that drift and slowly fade in and out
