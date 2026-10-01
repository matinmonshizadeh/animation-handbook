# Fireworks

## What it is
A fireworks effect launches rockets from the bottom of a dark scene; each one slows as it climbs and, at the top of its climb, bursts into a ball of sparks that fly out, droop under gravity and fade away. Instead of being cleared, the canvas is covered with a faint see-through layer on every frame, so each spark leaves a glowing trail of the path it has flown.

## When to use it
- Launch, event and countdown pages
- Holiday and New Year greetings
- Success screens after a sign-up, a purchase or a finished course
- Wins and level-ups in games

## How it works
The sky and the skyline are plain HTML behind and in front of a see-through canvas, which holds only the fireworks. A rocket leaves the bottom just fast enough for gravity to stop it at the height where it should burst, and it bursts the moment it stops rising:

```js
const g = .07 * U, top = H * (.2 + Math.random() * .26);      // U: the stage's height in 400ths
rockets.push({ x, y: H, vx: (Math.random() - .5) * .5 * U, vy: -Math.sqrt(2 * g * (H - top)), g });
// each step: r.vy += r.g * k; r.x += r.vx * k; r.y += r.vy * k; if (r.vy >= 0) burst(r.x, r.y, …)
```

A burst keeps its sparks in one typed array. For a round burst the speeds follow `sqrt(1 − u²)` for a random `u` between −1 and 1, which is how the sparks of a ball look from the side: thickest at the rim. A ring gives every spark nearly the top speed; a willow starts slower, droops more and lasts longer. Each step slows every spark by its drag and pulls it down:

```js
const d = Math.pow(b.drag, k);                    // k: 60ths of a second, at most one per step
P[i + 2] *= d;  P[i + 3] = P[i + 3] * d + b.g * k;  // speed across, speed down
P[i] += P[i + 2] * k;  P[i + 1] += P[i + 3] * k;
```

Every frame first covers the canvas with `destination-out` at a fixed opacity, which wears the old picture down toward see-through, so the CSS sky shows through the fading trails. It covers once for every 60th of a second that has passed, at the opacity a 60 Hz screen would use, so trails last as long in seconds on every screen, and a frame with no cover due draws nothing. Then each burst is one stroke from where every spark was when the frame began to where it is now, drawn with `lighter`, so crossing sparks glow brighter:

```js
ctx.globalCompositeOperation = 'destination-out';
ctx.fillStyle = 'rgba(0,0,0,' + WASH[TRAIL] + ')';      // none 1, short .3, long .13
for (let i = 0; i < nf; i++) ctx.fillRect(0, 0, W, H);  // nf: covers due this frame
ctx.globalCompositeOperation = 'lighter';
```

A frame longer than a 60th of a second (a 30 Hz phone, a busy moment) is moved in equal steps of at most one 60th, so drag and gravity put every spark where a 60 Hz screen would.

An 8-bit canvas cannot fade a faint pixel all the way to nothing: a pixel at 3/255 covered by 13% becomes 2.61, which rounds back to 3. Left alone, every burst would leave a dim ghost in the sky. So each burst remembers the patch it has lit. When it dies, its patch and its rocket's path wait half a second, while their last embers fade, and are then wiped with `clearRect`, 4 pixels wider on every side and on whole device pixels. The wipe leaves out every part where something may still glow: a rocket, a live burst, the path of a rocket that burst in the last half second, or another patch still waiting, each taken 4 pixels wider. Those parts are wiped later, with the patch of whatever glows there, so a wipe never cuts a visible ember.

```js
const busy = [...rockets.map(q => column(q.sx, q.x, q.y)),
  ...bursts.flatMap(b => b.age < 30 ? [b.box, column(b.sx, b.x, b.y)] : [b.box]),
  ...marks.filter(m => m.wait > 0).map(m => m.r)];
for (const m of marks) if (m.wait <= 0)
  for (const p of free([m.r[0] - 4, m.r[1] - 4, m.r[2] + 4, m.r[3] + 4], busy)) ctx.clearRect(/* p, on whole device pixels */);
```

At Rarely and Sometimes the sky between bursts ends up clean. At Often, where bursts keep overlapping, a faint haze (at most 3/255) can stay in places until the sky there is free.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| How often | Sometimes | The time between launches, on average: rarely about 2.2 seconds, sometimes 1.2 and often half a second |
| Colors | Many colors | Each burst picks one color: from eight hues, from three golds, or from blues and violets |
| Trails | Long | How much of the picture each 60th of a second's cover takes away: none 100%, short 30% and long 13% |
| Burst shape | Round | A ball of sparks, a ring of sparks that all fly at nearly the same speed, or a willow whose sparks droop like branches |

## Production notes
- **Phones**: the demo gives a burst 50 sparks on phones and short screens (`(max-width: 600px), (max-height: 500px)`) instead of 90, and never keeps more than 300 sparks in the air there (900 elsewhere).
- **One stroke per burst**: all the sparks of a burst share one color and opacity, so they go into one path; a frame with three bursts is three strokes, not hundreds.
- **Flashes**: the glow at each burst is soft and drawn once. Avoid full-screen white flashes, which can trouble people with photosensitive conditions.
- **Libraries**: fireworks-js and the tsParticles fireworks preset do the same with more shell types, and sound; the loop, drag, gravity and trail cover are the same idea.
- **Reduced motion**: show a still picture of the bursts, as the demo does (one to three, as How often asks); never fire bursts on a page someone asked to keep still.

## See also
- [Success Confetti](../../04-micro-interactions/success-confetti/) — one burst of confetti for a single big moment
- [Snow / Rain](../snow-rain/) — particles over the same kind of dark scene, falling instead of bursting
- [Flow Field](../flow-field/) — particles that leave fading trails with the same see-through cover
- [Starfield / Space Particles](../starfield/) — short trails from a cover that is the same on every screen
