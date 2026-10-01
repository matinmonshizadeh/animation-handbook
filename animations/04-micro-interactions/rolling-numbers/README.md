# Rolling Numbers

## What it is
Rolling numbers show a changing number the way a car's mileage counter does: each digit sits in a small window over a column of the digits 0 to 9, and when the value changes, the column slides until the new digit is in the window. Only the digits that change move, so a small change turns one wheel and a big jump turns them all.

## When to use it
- Live counts: visitors, likes, followers, items in a cart
- Prices that change with a plan, a quantity or a currency switch
- Scores, timers and dashboard figures that update while people watch
- Any number whose change should be noticed, without a flash or a jump

## How it works
Each digit is a fixed-width window with `overflow: hidden` over a strip that lists 0 to 9 and then 0 again (drawn by a `::before` with line breaks), and the strip is moved with `translateY`. Every wheel keeps a position that only grows or shrinks; the digit it shows is that position modulo 10, so 7, 17 and -3 all show a 7, and the extra 0 at the end of the strip lets 9 roll on to 0. A change works out how many steps each wheel turns, the way Direction says, and starts the roll from wherever the wheel is drawn now:

```js
let steps=(target[i]-shown+10)%10;
if(dir==='down')steps-=10;else if(dir==='short'&&steps>5)steps-=10;
const delay=oneByOne?n++*STAGGER*slow:0;
w.from=w.pos;w.to+=steps;w.t0=now+delay;w.ms=dur*slow;
```

One `requestAnimationFrame` loop places every moving wheel by the time passed since its start, eased out, so a roll takes the same time at any frame rate; the loop stops when every wheel has arrived:

```js
const k=Math.min(1,Math.max(0,(now-w.t0)/w.ms));
w.pos=k<1?w.from+(w.to-w.from)*(1-Math.pow(1-k,3)):w.to;
draw(w);
```

Because a roll starts from the drawn position, a click that comes before the last roll has ended carries on smoothly instead of jumping. The rolling digits are hidden from screen readers; a polite live region holds the plain number ("2,049"), so it is read once per change rather than as a string of digits. Under reduced motion the strip jumps to the new digit and the wheel fades in with a short CSS animation.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Roll speed | Normal | How long a digit takes to roll to its new value: slow is 900ms, normal 550ms and fast 300ms |
| Direction | Up | Up turns every digit forward, as a mileage counter does, so 9 to 0 is one step; down turns them back, like a countdown; shortest turns each digit the nearer way round |
| Digits one after another | on | Each changing digit starts 70ms after the changing digit to its right, so a big change ripples from right to left |

## Production notes
- **Equal widths**: give every digit window the same width (or use `font-variant-numeric: tabular-nums`), so the number never shifts sideways while it rolls.
- **Growing numbers**: the demo keeps four wheels. When a number gains a digit, add a wheel at the left and fade or slide it in; render the wheels from the new number and animate only those whose digit changed.
- **Formatting**: build the wheels from the formatted string (`Intl.NumberFormat`), keeping separators, currency signs and units as still characters between the wheels.
- **Accessibility**: hide the rolling digits from assistive technology and keep the real value as text; announce it in a polite live region when the visitor caused the change, not on every automatic update.
- **Reduced motion**: with `prefers-reduced-motion: reduce`, swap the digits at once, with at most a short fade.
- **Library equivalents**: NumberFlow (a web component with React, Vue and Svelte versions, which can also pick the roll direction), Odometer.js for plain JavaScript, and Framer Motion's `useSpring` with a strip per digit to build your own; GSAP can tween each strip's position the same way.

## See also
- [Counter Animation](../../01-scroll-based/counter-animation/) — numbers that count up when they scroll into view
- [Rotate Word Carousel](../../05-text-typography/rotate-word-carousel/) — one word in a sentence that keeps swapping for the next
- [Progress Animation](../progress-animation/) — a bar, a ring and steps that fill up to show progress
