# Audio Visualizer

[Live demo](https://matinmonshizadeh.github.io/animation-handbook/animations/06-3d-advanced/audio-visualizer/)

## What it is
An audio visualizer turns sound into moving shapes: a row of bars from bass on the left to treble on the right, each as tall as its band of pitches is loud right now. The bars jump up when a sound starts and sink back as it fades, so a kick drum makes the low bars leap and the hi-hats flicker at the top. The same loudness can be drawn as bars, as a ring of bars around a circle, or as the wave the sound itself makes.

## When to use it
- Music players, from a site's own player to a band's page
- Podcast and audiobook cards, to show that something is playing
- Radio, DJ and event sites, as a lively header
- Voice notes and recorders, as a sign that sound is coming in

## How it works
In a real player the page connects the playing audio to the Web Audio API's `AnalyserNode`, which reports many times a second how loud each slice of pitches is (`getByteFrequencyData`) or the shape of the sound (`getByteTimeDomainData`):

```js
const ctx = new AudioContext(), source = ctx.createMediaElementSource(audioElement), analyser = ctx.createAnalyser();
analyser.fftSize = 2048;
source.connect(analyser); analyser.connect(ctx.destination);
const freq = new Uint8Array(analyser.frequencyBinCount);
analyser.getByteFrequencyData(freq);   // 0 to 255 for each slice of about 22 Hz
```

The analyzer's slices are all the same width in hertz, but hearing works in octaves: 40 to 80 Hz is as wide a step for the ear as 4,000 to 8,000 Hz. So the bars group the slices by octave, from 40 Hz to 16 kHz, each band wider than the one before, and each bar shows the average of its slices. With equal slices instead (the demo's Compare), the bass and the tune crowd into the first few bars and the rest only flicker.

```js
const edges = [...Array(n + 1)].map((_, i) => 40 * Math.pow(400, i / n));   // 40 Hz × 400 = 16 kHz
```

Each frame a bar jumps straight to a louder value and otherwise sinks by How bars fall, measured in bar heights a second, so it falls at the same speed on every screen; a peak mark holds the highest point for 0.4 seconds, then sinks slowly. The palette's two colors are drawn once into a strip one pixel wide, and each bar copies the part of the strip it reaches with `drawImage`, which costs far less than filling every bar with a gradient each frame.

The demo plays no file and uses no microphone. Its tune is written in the page as notes (kick, snare, hi-hats, bass and a short melody, four bars at 100 beats a minute), and every frame the page works out how loud each band would be from the notes playing at that moment, so the bars move in silence, offline and on a muted phone. Hear it plays the same notes through the browser's own oscillators and a burst of generated noise, scheduled a tenth of a second ahead on the audio clock; only then do the bars read a real analyzer. The sound is made on that press and never before (browsers block sound that starts by itself); Pause and a hidden tab suspend it, and Slow motion plays the tune at a third of the tempo.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Style | Bars | Bars stand in a row from bass to treble; wave draws the sound's shape over a few hundredths of a second instead of its pitches; circle sets the bars around a ring that swells with the bass |
| Number of bars | Many | With Bars or Circle: few is 16 bars, some 32 and many 64; phones start at some, and each row of Compare holds half as many bars on phones; Wave has no bars and hides this setting |
| How bars fall | Gently | With Bars or Circle, how fast a bar sinks after it jumps: quickly is 2.6 bar heights a second, gently 1.2 and slowly 0.45, like an old stereo; Wave hides this setting |
| Peak marks | on | With Bars or Circle, a thin mark (a dot in the ring) holds each bar's highest point for 0.4 seconds, then sinks slowly; off, only the bars show; Wave hides this setting |
| Colors | Sunset | The colors from the bottom of each bar to its top, or from left to right along the wave: sunset runs from coral to gold, ocean from deep blue to cyan, neon from pink to cyan; See inside lays the colors of the tune's parts over them |

## Production notes
- **Ask before sound.** Create the `AudioContext` inside the visitor's own press of play: browsers keep a context made earlier suspended and warn in the console. Never open the microphone without a clear reason and the visitor's yes.
- **Group by octave.** Average the analyzer's slices into bands that widen with pitch, or most bars show only hiss. `smoothingTimeConstant` (0 to 1) smooths the analyzer's own values; the jump-and-fall of the bars is better done in your own code, by time.
- **Light drawing.** One canvas and a few dozen copied rectangles a frame are cheap; a gradient filled over every bar each frame is not. Draw fewer bars on phones and stop the loop when the player is paused or out of view.
- **Cross-origin audio.** An `<audio>` element playing a file from another site needs `crossorigin="anonymous"` and the right CORS headers, or the analyzer reads only zeros.
- **Reduced motion.** Keep the bars still until the visitor presses play, and let them turn the movement off while the music plays.
- **Libraries.** Wavesurfer.js draws waveforms and plays files; Tone.js schedules notes and synths on the Web Audio clock; audioMotion-analyzer is a ready-made bar analyzer with octave bands and peaks.

## See also
- [Starfield / Space Particles](../../07-ambient-background/starfield/) — a loop drawn by JavaScript every frame
- [Abstract Geometric Motion](../../07-ambient-background/abstract-geometric-motion/) — a pattern for music players that ignores the sound
