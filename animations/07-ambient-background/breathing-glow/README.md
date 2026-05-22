# Breathing / Pulsing Glow

## What it is
A breathing glow is a radial gradient that slowly expands and contracts on a 4–6 second cycle, mimicking the rhythm of relaxed breathing. The expansion increases the gradient's scale; the contraction returns it. Optional opacity variation (1.0 → 0.7 → 1.0) reinforces the breathing sensation. The effect is used behind "resting" states — a paused music player, an idle AI assistant, a meditation timer — to communicate "alive but at rest."

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
  --glow-min: 0.7;
  --glow-max: 1.4;
  --glow-color: #58a6ff;
}

.glow {
  width: 280px; height: 280px;
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
  width: 420px; height: 420px;
  opacity: 0.3;
  filter: blur(60px);
  animation: breathe calc(var(--glow-dur) * 1.3) ease-in-out infinite reverse;
}
```

The `reverse` direction and 1.3× duration ensures the outer glow is never in phase with the inner glow, making the combined effect feel more organic.

**Paired element breathing** — the center element also scales slightly with its own animation:

```css
.center-icon {
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
| Cycle duration | 5s | 2s = anxious; 4–6s = relaxed breath; 8s+ = barely perceptible |
| Min scale | 0.7 | Too low = the glow nearly disappears at minimum |
| Max scale | 1.4 | Too high = the expansion looks alarming rather than calm |
| Glow size | 280px | Base radius of the gradient — larger fills more of the background |

## Production notes
- **Why 4–6 seconds?** This range matches the respiratory rate of a relaxed adult (10–15 breaths per minute). Apple's Siri orb uses approximately this range. The match is not accidental — the timing creates a subconscious biofeedback of calm.
- **`filter: blur()` vs `border-radius: 50%`**: the combination creates a round soft glow without needing an image. `filter: blur()` is GPU-accelerated and smooth at all scale values.
- **Easing**: `ease-in-out` gives a slow start, gentle acceleration to the midpoint, and slow deceleration at the peak — matching how breathing actually feels (the inhale begins and ends slowly).
- **`will-change: transform`**: adding this to the glow element hints the browser to allocate a compositing layer. Useful when multiple glows are stacked; unnecessary for a single glow.
- **Framer Motion**: `<motion.div animate={{ scale: [0.7, 1.4, 0.7] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />` — identical result with React.

## See also
- [Ambient Ripple](../ambient-ripple/) — pulsing outward rings rather than scaling inward glow
- [Mesh Gradient](../mesh-gradient/) — drifting color wash for a larger-scale ambient background
- [Floating Elements](../floating-elements/) — shapes that drift with subtle opacity pulse
