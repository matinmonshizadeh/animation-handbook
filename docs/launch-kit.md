# Launch kit — Animation Handbook

Everything needed to take the repo from 0 stars to a real launch. The website
quality is already there; this is the distribution layer. Work top to bottom.

---

## 1. Repo metadata (do this first — 5 minutes)

GitHub → repo **Settings** (or the ⚙️ next to "About" on the repo home page):

**Description:**
> 159 web animation techniques, each a live demo with plain settings and a ready-made prompt for your AI assistant. No dependencies, no build step.

**Website:** `https://matinmonshizadeh.github.io/animation-handbook/`

**Topics (add all):**
`web-animation` `css-animation` `animation` `frontend` `web-development`
`javascript` `motion-design` `ui-animation` `scroll-animation` `microinteractions`
`webgl` `ai-prompts` `reference` `no-dependencies` `github-pages`

(`awesome` is for curated lists that follow the awesome-list rules; this repo is not one, so leave it off.)

With the GitHub CLI (`gh`), this is one command:

```bash
gh repo edit matinmonshizadeh/animation-handbook \
  --description "159 web animation techniques, each a live demo with plain settings and a ready-made prompt for your AI assistant. No dependencies, no build step." \
  --homepage "https://matinmonshizadeh.github.io/animation-handbook/" \
  --add-topic web-animation,css-animation,animation,frontend,web-development,javascript,motion-design,ui-animation,scroll-animation,microinteractions,webgl,ai-prompts,reference,no-dependencies,github-pages \
  --remove-topic awesome
```

**Social preview:** Settings → General → Social preview → upload `og-image.png`, so links to the repo
(not only to the site) show the picture.

Also enable: **Discussions** (Settings → Features) — gives people a place to ask
and share, which drives return visits.

---

## 2. Verify SEO is live (after pushing)

- `https://matinmonshizadeh.github.io/animation-handbook/sitemap.xml` → should list 160 URLs
- `https://matinmonshizadeh.github.io/animation-handbook/robots.txt` → should load
- Submit the sitemap to **Google Search Console** (add the property, then Sitemaps → submit `sitemap.xml`).
- Test the social card at https://opengraph.xyz — paste the homepage URL, confirm the og-image shows.

---

## 3. Launch posts

Space these out over ~2 weeks; don't fire them all the same day. Lead every one
with `docs/demo.gif` (find an animation, watch it, copy its prompt) — the visual is
the hook, and the prompt for your AI assistant is what sets the site apart. Post the
live site's link first and the repo second. Post from your own account and answer the
comments yourself in the first hours.

### Show HN (news.ycombinator.com/submit)

**Title:**
> Show HN: Animation Handbook – 159 web animations, each with a prompt for your AI

**URL:** `https://matinmonshizadeh.github.io/animation-handbook/`

**First comment (post immediately after submitting):**
> I kept re-googling the same animation techniques and landing on either a
> library's marketing page or a CodePen with no explanation. So I built a
> reference: 159 techniques, from scroll effects and page transitions to
> micro-interactions, text, 3D, and ambient backgrounds. You find one by where it
> goes on your page (buttons, text, backgrounds, page changes…) or by describing
> it. Each one plays live, has a few plain settings, and gives you a ready-made
> prompt for an AI assistant that describes the animation in plain words, with
> your settings. If you'd rather build it by hand, each page is one self-contained
> HTML file with a README on the mechanic and the production gotchas — no build
> step, no framework, no dependencies, and it runs offline. Feedback and PRs welcome.

### Reddit — r/webdev (Showoff Saturday) and r/Frontend

**Title:**
> I built a handbook of 159 web animations — watch each one live, tweak it, and copy a prompt for your AI assistant

**Body:**
> 159 techniques in 7 categories (scroll, entrance/exit, page transitions,
> micro-interactions, text, 3D, ambient). Find one by where it goes on your page or
> by describing it, try a few plain settings, then copy a prompt that describes it in
> plain words for ChatGPT, Claude or Cursor. Each technique is also one standalone
> HTML file with a short writeup of how it works and what to watch for in
> production. No frameworks, no build, works offline.
> Live: <link> · Source: <repo> · MIT. What's missing?

*(r/webdev restricts self-promo to "Showoff Saturday" — respect it.)*

### dev.to / Hashnode article

**Title:** `159 web animations you can copy as a prompt for your AI assistant`

**Outline:**
1. The problem — animation knowledge is scattered across libraries and CodePens, and an AI
   assistant needs the right words to build the effect you have in mind.
2. The approach — one technique, one file; find it by where it goes; plain settings; a prompt
   that names exactly what you saw.
3. A tour of the 7 categories with 3–4 embedded GIFs.
4. Two or three techniques explained in depth (e.g. scroll-driven animations, view transitions API).
5. It's open source — how to contribute. Link the repo, ask for a star.

*(Canonical-link the article back to your site to avoid SEO cannibalization.)*

### X / Bluesky thread

> 1/ I built Animation Handbook — 159 web animations you can watch live, tweak, and
> copy as a prompt for your AI assistant. No dependencies, no build step. 🧵 <docs/demo.gif>
>
> 2/ Find one by where it goes — buttons, text, backgrounds, page changes — or just
> describe it: "a button that bounces when clicked". <GIF>
>
> 3/ Every page has a few plain settings and a ready-made prompt that describes the
> animation in plain words, with your settings. Paste it into ChatGPT, Claude or Cursor.
>
> 4/ Prefer code? Each technique is one vanilla HTML/CSS/JS file with a README on the
> mechanic and the gotchas. Open source (MIT): <repo> · Live: <link>

Tag/DM accounts that curate frontend content (e.g. weekly newsletters, "awesome"
list maintainers). Ask to be added to relevant awesome-lists (awesome-css,
awesome-web-animation) via PR.

### Product Hunt

**Tagline:** `159 web animations, each with a prompt for your AI assistant`
Schedule for a Tuesday–Thursday 12:01am PT. Line up 5–10 people to comment/upvote early.

---

## 4. Keep it alive

- Add 2–3 new techniques a month; each is a fresh thing to post about.
- Turn the "New technique" issues into a public roadmap (GitHub Projects).
- Respond to every issue/PR fast — early responsiveness is what converts
  drive-by visitors into contributors, and contributors bring stars.

---

## Realistic expectation

Quality is necessary but not sufficient. A strong Show HN + r/webdev + one good
article, each led with a GIF, is what moves this from 0 to hundreds of stars.
Without a deliberate launch it will stay near zero regardless of how good it is.
