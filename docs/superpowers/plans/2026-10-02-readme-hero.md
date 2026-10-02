# README Hero (Wall of Animations) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put a 960×414 looping GIF of six demo stages, each tile named, at the top of `README.md`, with a still PNG for reduced motion.

**Architecture:**
- **Record:** a scratch Node script drives headless Chrome over the DevTools protocol and records each page's stage with the screencast.
- **Compose:** a scratch Python script turns the recordings into seamless 6 s tile loops and composes 86 wall frames under a Chrome-drawn overlay of name pills and corner masks.
- **Encode:** ffmpeg makes the GIF.
- **Commit:** only the two pictures, the README edit and the test edit.

**Tech Stack:**
- Node 24 (built-in WebSocket)
- Chrome 154 headless
- Python 3.11 with Pillow 9.4, numpy and imageio_ffmpeg (bundled ffmpeg 7.1)

## Global Constraints

- **GIF:** `docs/hero.gif`, 960×414 px, about 6 s loop (86 frames × 70 ms), loops forever, **5 MB at most**.
- **Still:** `docs/hero.png`, the same wall, shown when `(prefers-reduced-motion: reduce)`.
- **Tiles, in reading order:** Text Particles, Synthwave Grid, Liquid Glass, Shatter Effect, Holographic Card, Dynamic Island.
- **Tile layout:** 306×191 tiles, 10 px corners, 10 px gaps, 11 px margin, #0b0b10 background.
- **Names:** on pills in Schibsted Grotesk (`assets/fonts/schibsted-latin.woff2`).
- **Recording setup:** 768×1024 viewport, DPR 1, dark color scheme, normal motion, served by the launch config `static-site` (http://127.0.0.1:8731).
- **Scratch scripts:** they live in the session scratchpad (`$S` below) and are never committed.
- **README:** only the top picture changes. `docs/demo.gif` and `og-image.png` stay where they are.
- **Pushing:** pushing to GitHub needs the owner's OK.

`$S` = `C:/Users/matin/AppData/Local/Temp/claude/C--Users-matin-OneDrive-Desktop-Projects-animation-handbook/5ce2c57d-d347-425c-97ad-8e4b34e4e096/scratchpad/hero`

---

### Task 1: Record the six stages

**Files:**
- Create: `$S/record.mjs`. It is `$S/capture-stills.mjs` with the per-page loop replaced; the DevTools plumbing stays the same.

**Interfaces:**
- Produces: `$S/rec/<name>/NNNN.jpg`, the full 768×1024 screencast frames, and `$S/rec/<name>/frames.json`, which holds `{ kind, stage: {x,y,w,h}, times: [seconds from the first frame], clickAt }`.

- [ ] **Step 1: Write the per-page loop**

```js
  for (const slug of slugs) {
    const name = slug.split('/')[1];
    const dir = join(outDir, name);
    mkdirSync(dir, { recursive: true });
    let onLoad;
    const loaded = new Promise(ok => { onLoad = m => { if (m.method === 'Page.loadEventFired') ok(); }; listeners.add(onLoad); });
    await send('Page.navigate', { url: `${BASE}/animations/${slug}/` });
    await Promise.race([loaded, sleep(15000)]);
    listeners.delete(onLoad);
    const info = await evaluate(`(async () => { await document.fonts.ready; scrollTo(0, 0); const r = document.querySelector('.stage').getBoundingClientRect(); return { kind: document.body.dataset.hbKind, x: r.x, y: r.y, w: r.width, h: r.height }; })()`);
    const frames = [];
    let t0 = null, clickAt = null;
    const onFrame = m => {
      if (m.method !== 'Page.screencastFrame') return;
      const t = m.params.metadata.timestamp;
      if (t0 === null) t0 = t;
      frames.push({ t: t - t0, data: m.params.data });
      send('Page.screencastFrameAck', { sessionId: m.params.sessionId }).catch(() => {});
    };
    listeners.add(onFrame);
    await send('Page.startScreencast', { format: 'jpeg', quality: 92, everyNthFrame: 1 });
    const start = Date.now();
    if (info.kind === 'do') {
      await sleep(5000 - (Date.now() - start));
      await evaluate(`document.querySelector('[data-hb-demo]').click()`);
      clickAt = Date.now() / 1000 - t0;
    }
    await sleep(11000 - (Date.now() - start));
    await send('Page.stopScreencast');
    listeners.delete(onFrame);
    frames.forEach((f, i) => writeFileSync(join(dir, `${String(i).padStart(4, '0')}.jpg`), Buffer.from(f.data, 'base64')));
    writeFileSync(join(dir, 'frames.json'), JSON.stringify({ kind: info.kind, stage: info, times: frames.map(f => f.t), clickAt }));
    console.log(`${name}: ${info.kind}, ${frames.length} frames, stage ${Math.round(info.w)}x${Math.round(info.h)}, click at ${clickAt && clickAt.toFixed(2)} s`);
  }
```

- [ ] **Step 2: Run it**

Run: `cd $S && VW=768 VH=1024 node record.mjs rec 05-text-typography/text-particles 07-ambient-background/synthwave-grid 06-3d-advanced/liquid-glass 02-entrance-and-exit/shatter-effect 06-3d-advanced/holographic-card 04-micro-interactions/dynamic-island`
Expected: six lines.
- Each line has 250+ frames and stage 707x440.
- The four `do` pages report a click at about 5 s.

- [ ] **Step 3: Check each page has settled before the 4.5 s cut**

Build a strip of the stage at 4.0, 4.5, 5.0, 7.0 and 10.5 s per page, then look at it.
Expected:
- At 4.5 s every `do` page is at rest.
- At 7 s it is mid-demo.
- At 10.5 s it is at rest again.
- If a page is not at rest at 4.5 s, raise the click to 6 s and the record time to 12 s for that page, and run it again.

### Task 2: Seamless tile loops and the wall frames

**Files:**
- Create: `$S/overlay.html`, rendered to `$S/overlay.png` (960×414, transparent, with the name pills and corner masks).
- Create: `$S/wall.py`, which writes `$S/wall/000.png`–`085.png` and `$S/still.png`.

**Interfaces:**
- Consumes: `$S/rec/<name>/` from Task 1.
- Produces: `$S/wall/NNN.png`, 86 frames at 960×414, and `$S/still.png`.

- [ ] **Step 1: Write and render the overlay**

```html
<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:S;src:url(data:font/woff2;base64,FONT) format('woff2');font-weight:400 900}
html,body{margin:0;background:transparent;width:960px;height:414px;overflow:hidden}
.t{position:absolute;width:306px;height:191px;border-radius:10px;box-shadow:0 0 0 12px #0b0b10}
.t span{position:absolute;left:10px;bottom:10px;background:rgba(10,10,16,.74);color:#fff;font:600 14px/1 S,sans-serif;padding:6px 11px;border-radius:999px}
</style>
<div class="t" style="left:11px;top:11px"><span>Text Particles</span></div>
<div class="t" style="left:327px;top:11px"><span>Synthwave Grid</span></div>
<div class="t" style="left:643px;top:11px"><span>Liquid Glass</span></div>
<div class="t" style="left:11px;top:212px"><span>Shatter Effect</span></div>
<div class="t" style="left:327px;top:212px"><span>Holographic Card</span></div>
<div class="t" style="left:643px;top:212px"><span>Dynamic Island</span></div>
```

Python replaces `FONT` with the base64 of `assets/fonts/schibsted-latin.woff2`. Render it with:
`chrome --headless=new --hide-scrollbars --force-color-profile=srgb --default-background-color=00000000 --window-size=960,414 --screenshot=<S>\overlay.png file:///<S>/overlay.html`
Expected: a 960×414 RGBA PNG. The pixels are transparent inside the tiles except for the pills, and #0b0b10 outside the rounded corners.

- [ ] **Step 2: Write `wall.py`**

```python
import bisect, json, os
import numpy as np
from PIL import Image
S = os.path.dirname(os.path.abspath(__file__))
NAMES = ['text-particles', 'synthwave-grid', 'liquid-glass', 'shatter-effect', 'holographic-card', 'dynamic-island']
N, DT, K = 86, 0.07, 7                 # frames, seconds per frame, crossfade frames
TW, TH, GAP, MX, MY = 306, 191, 10, 11, 11
POS = [(MX + c * (TW + GAP), MY + r * (TH + GAP)) for r in range(2) for c in range(3)]
OFFSETS = [0, 43, 14, 57, 29, 72]      # each tile's loop is rotated, so their demos take turns

def tile_loop(name):
    meta = json.load(open(f'{S}/rec/{name}/frames.json'))
    times, st = meta['times'], meta['stage']
    box = (round(st['x']), round(st['y']), round(st['x'] + st['w']), round(st['y'] + st['h']))
    cache = {}
    def img(i):
        if i not in cache:
            cache[i] = Image.open(f'{S}/rec/{name}/{i:04d}.jpg').convert('RGB').crop(box).resize((TW, TH), Image.LANCZOS)
        return cache[i]
    at = lambda t: max(bisect.bisect_right(times, t) - 1, 0)   # the latest frame at or before t
    thumb = lambda i: np.asarray(img(i).resize((96, 60)).convert('L'), dtype=np.float32)
    if meta['kind'] == 'do':
        s, L = 4.5, N * DT
    else:                                                     # find the start and length whose ends match best
        best = None
        for s in np.arange(3.8, 4.8, 0.02):
            a = thumb(at(s))
            for L in np.arange(5.6, 6.5, 0.02):
                d = float(np.abs(a - thumb(at(s + L))).mean())
                if best is None or d < best[0]: best = (d, s, L)
        _, s, L = best
    step = L / N
    seg = [img(at(s + i * step)) for i in range(N)]
    seam = float(np.abs(np.asarray(seg[-1], np.float32) - np.asarray(seg[0], np.float32)).mean())
    if seam > 3.0:                                            # fade the last K frames into the frames just before the start
        for j in range(K):
            a = (j + 1) / (K + 1)
            seg[N - K + j] = Image.blend(seg[N - K + j], img(at(s - (K - j) * step)), a)
    print(f'{name}: start {s:.2f} s, length {L:.2f} s, seam {seam:.1f}{" (crossfaded)" if seam > 3.0 else ""}')
    return seg

tiles = [tile_loop(n) for n in NAMES]
overlay = Image.open(f'{S}/overlay.png').convert('RGBA')
def wall(frames):
    canvas = Image.new('RGB', (960, 414), (11, 11, 16))
    for k, f in enumerate(frames): canvas.paste(f, POS[k])
    return Image.alpha_composite(canvas.convert('RGBA'), overlay).convert('RGB')
os.makedirs(f'{S}/wall', exist_ok=True)
for i in range(N):
    wall([t[(i + OFFSETS[k]) % N] for k, t in enumerate(tiles)]).save(f'{S}/wall/{i:03d}.png')
STILL = json.load(open(f'{S}/still.json')) if os.path.exists(f'{S}/still.json') else [N // 2] * 6
wall([t[STILL[k]] for k, t in enumerate(tiles)]).save(f'{S}/still.png', optimize=True)
```

- [ ] **Step 3: Run it and look**

Run: `cd $S && python wall.py`
Expected: six lines with a start, a length and a seam per tile, and 86 frames in `wall/`.
- Make a contact sheet of every 6th frame and look at it.
- For each tile, compare its last and first loop frame side by side.
- If a tile jumps, adjust its start or length, or raise K.

- [ ] **Step 4: Pick the still**

For each tile, choose the clearest loop frame from the contact sheet: particles mid-flight, shards in the air, the card tilted and the island showing a call. Write them to `$S/still.json`, for example `[20, 0, 30, 15, 25, 30]`, then run `python wall.py` again.
Expected: `still.png` shows all six tiles at a good moment.

### Task 3: Encode the GIF

**Files:**
- Create: `docs/hero.gif` and `docs/hero.png`, the latter copied from `$S/still.png`.

- [ ] **Step 1: Encode**

```bash
FF=$(python -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())")
"$FF" -y -v error -framerate 100/7 -i "$S/wall/%03d.png" -vf "split[a][b];[a]palettegen=max_colors=256:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle" -loop 0 docs/hero.gif
cp "$S/still.png" docs/hero.png
ls -l docs/hero.gif docs/hero.png
```

Expected:
- `hero.gif` is 5 MB or smaller.
- If it is bigger, in this order: try `bayer_scale=5`; then `max_colors=192`; then 80 ms frames (75 frames, with `N = 75` and `DT = 0.08`).

- [ ] **Step 2: Check the GIF**

Run: `python -c "from PIL import Image; im = Image.open('docs/hero.gif'); print(im.size, im.n_frames, im.info.get('loop'), im.info.get('duration'))"`
Expected: `(960, 414) 86 0 70`.
Then look at frames 0, 20, 43 and 70 of the GIF.

### Task 4: README and test

**Files:**
- Modify: `tests/pages.test.js:458`
- Modify: `README.md:3`

- [ ] **Step 1: Change the test so it expects the new picture**

```js
  assert.equal(numberIn(readme, /<img src="docs\/hero\.gif" alt="[^"]*?(\d+) web animation techniques/), cards, "README: the picture's alt text");
```

- [ ] **Step 2: Run it to see it fail**

Run: `node --test "tests/*.test.js"`
Expected: FAIL in "the counts written in the root README match the cards" (README: the picture's alt text).

- [ ] **Step 3: Change the README's top picture**

Replace line 3:
```html
<a href="https://matinmonshizadeh.github.io/animation-handbook/"><img src="og-image.png" alt="Animation Handbook — 166 web animation techniques with live demos" width="820"></a>
```
with:
```html
<a href="https://matinmonshizadeh.github.io/animation-handbook/"><picture><source media="(prefers-reduced-motion: reduce)" srcset="docs/hero.png"><img src="docs/hero.gif" alt="Six animations from the handbook playing at once: Text Particles, Synthwave Grid, Liquid Glass, Shatter Effect, Holographic Card and Dynamic Island. Animation Handbook — 166 web animation techniques with live demos" width="820"></picture></a>
```

- [ ] **Step 4: Run the tests to see them pass**

Run: `node --test "tests/*.test.js"`
Expected: every test passes (1381 or more), with 0 failing.

- [ ] **Step 5: Commit**

```bash
git add docs/hero.gif docs/hero.png README.md tests/pages.test.js
git commit -m "docs: the README opens with a moving wall of six animations, and a still one under reduced motion"
```

### Task 5: Show the owner, then publish on their OK

- [ ] **Step 1:** Send the owner `docs/hero.gif` and ask whether to publish it.
- [ ] **Step 2:** On their OK, run `git checkout main`, `git merge --ff-only feat/readme-hero` and `git push origin main`. Then open the repo page and check that the GIF shows at the top.
