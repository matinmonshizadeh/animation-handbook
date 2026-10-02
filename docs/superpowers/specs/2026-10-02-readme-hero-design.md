# README hero: a wall of animations — design

Date: 2026-10-02. Part of the promotion plan's step 2, "make the GitHub page look better".

The owner's choices:
- The moving picture goes in now. The one-line install command waits for the AI skill (step 3), so no one copies a command that fails.
- The picture is option A from the mockups: a wall of six animations, each with its name.

## Goal
The first screen of the GitHub page shows what the handbook is: many good-looking animations, each with a name. Today it opens with a still picture of the home page.

## What changes
1. **`docs/hero.gif`**, the moving picture.
   - **What it shows:** six demo stages play at once in a 3×2 grid, each tile with its name on a dark pill in the site font (Schibsted Grotesk).
   - **Size:** 960×414 px. Each tile is 16:10 with 10 px corners, 10 px gaps and a 10 px margin on a #0b0b10 background.
   - **Motion:** a seamless loop of about 6 s at about 15 frames a second.
   - **File size:** 5 MB at most; GitHub's limit is 10 MB.
   - **The tiles,** in reading order: Text Particles (05), Synthwave Grid (07), Liquid Glass (06), Shatter Effect (02), Holographic Card (06), Dynamic Island (04).
2. **`docs/hero.png`:** one clear frame of the same wall, shown instead of the GIF when the visitor's device asks for reduced motion.
3. **The top of `README.md`:** `og-image.png` is replaced by the new picture, still linked to the live site:
   ```html
   <a href="https://matinmonshizadeh.github.io/animation-handbook/"><picture>
     <source media="(prefers-reduced-motion: reduce)" srcset="docs/hero.png">
     <img src="docs/hero.gif" alt="Six animations from the handbook playing at once: Text Particles, Synthwave Grid, Liquid Glass, Shatter Effect, Holographic Card and Dynamic Island. Animation Handbook — 166 web animation techniques with live demos" width="820">
   </picture></a>
   ```
   - Nothing else in the README changes.
   - `docs/demo.gif` stays under "How to use it".
   - `og-image.png` stays the picture that social sites and the repo's social preview show.
4. **`tests/pages.test.js`:** the check that the README picture's alt text gives the right number of techniques moves from `og-image.png` to `docs/hero.gif`, with the same count rule.

## How the GIF is made
This is a one-off, made with scratch scripts that are not committed.
- **Setup:**
  - Serve the repo with the launch config `static-site` (port 8731).
  - Headless Chrome runs at 768×1024, where the stage is 707×440, about 16:10. It uses the dark color scheme and normal motion.
- **Recording:**
  - Each page loads, waits for its fonts and plays its own arrival (Show me, Loop, or its loop).
  - The stage is recorded for about 7 s with the DevTools screencast, which gives about 45 frames a second. Frames are then picked at 15 a second.
- **The loop:**
  - Each tile lasts 6 s, and its last 0.5 s fades into its first frames, so the loop never jumps.
  - Where a demo comes back to rest (Show me ends at rest), the clip starts and ends at rest.
- **Composing:**
  - Pillow scales the tiles into the grid with Lanczos.
  - A static overlay goes on top: the name pills and the corner masks, drawn once in Chrome so the labels use the site font.
- **Encoding:** ffmpeg (the copy bundled with `imageio_ffmpeg`) makes the GIF with a generated palette (palettegen and paletteuse). Pillow saves the PNG still.

## Checks
- **Look at it:** the first frame, the middle frame and the loop seam of every tile. No jumps, readable names, no page UI or cursor in the tiles.
- **Size:** the GIF is 5 MB or smaller.
- **Tests:** `node --test "tests/*.test.js"` passes.
- **After the push** (which needs the owner's OK): the GitHub page shows the moving picture, and a browser set to reduced motion shows the still one.

## Out of scope
- The install command, which comes with the AI skill (step 3).
- Changes to `og-image.png`, to the site, or to any other part of the README.
