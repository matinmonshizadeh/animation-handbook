# Launch kit — Animation Handbook

Everything needed to take the repo from 0 stars to a real launch. The website
quality is already there; this is the distribution layer. Work top to bottom.

---

## 1. Repo metadata (do this first — 5 minutes)

GitHub → repo **Settings** (or the ⚙️ next to "About" on the repo home page):

**Description:**
> A visual reference of 129 web animation techniques — scroll effects, page transitions, micro-interactions, text, 3D, and ambient backgrounds. Every entry is a live, dependency-free demo.

**Website:** `https://matinmonshizadeh.github.io/animation-handbook/`

**Topics (add all):**
`web-animation` `css-animation` `animation` `frontend` `web-development`
`javascript` `motion-design` `ui-animation` `scroll-animation` `microinteractions`
`webgl` `awesome` `reference` `no-dependencies` `github-pages`

If you install the GitHub CLI (`gh`) later, this is one command:

```bash
gh repo edit matinmonshizadeh/animation-handbook \
  --description "A visual reference of 129 web animation techniques — scroll effects, page transitions, micro-interactions, text, 3D, and ambient backgrounds. Every entry is a live, dependency-free demo." \
  --homepage "https://matinmonshizadeh.github.io/animation-handbook/" \
  --add-topic web-animation,css-animation,animation,frontend,web-development,javascript,motion-design,ui-animation,scroll-animation,microinteractions,webgl,awesome,reference,no-dependencies,github-pages
```

Also enable: **Discussions** (Settings → Features) — gives people a place to ask
and share, which drives return visits.

---

## 2. Verify SEO is live (after pushing)

- `https://matinmonshizadeh.github.io/animation-handbook/sitemap.xml` → should list 130 URLs
- `https://matinmonshizadeh.github.io/animation-handbook/robots.txt` → should load
- Submit the sitemap to **Google Search Console** (add the property, then Sitemaps → submit `sitemap.xml`).
- Test the social card at https://opengraph.xyz — paste the homepage URL, confirm the og-image shows.

---

## 3. Launch posts

Space these out over ~2 weeks; don't fire them all the same day. Lead every one
with a short screen-recording GIF of scrolling through the grid — the visual is
the hook.

### Show HN (news.ycombinator.com/submit)

**Title:**
> Show HN: Animation Handbook – 129 web animation techniques, each a live demo

**URL:** `https://matinmonshizadeh.github.io/animation-handbook/`

**First comment (post immediately after submitting):**
> I kept re-googling the same animation techniques and landing on either a
> library's marketing page or a CodePen with no explanation. So I built a
> reference: 129 techniques across scroll effects, page transitions,
> micro-interactions, text, 3D, and ambient backgrounds. Each one is a single
> self-contained HTML file — no build step, no framework, no dependencies — with
> a short README on the mechanic and the production gotchas. It's meant to teach
> the *technique*, so GSAP/Framer/Three only show up in "production notes," never
> as the subject. Everything runs offline. Feedback and PRs welcome.

### Reddit — r/webdev (Showoff Saturday) and r/Frontend

**Title:**
> I built a handbook of 129 web animation techniques — every entry is a live, dependency-free demo

**Body:**
> Reference site for web animation, organized into 7 categories (scroll, entrance/exit,
> page transitions, micro-interactions, text, 3D, ambient). Each technique is one
> standalone HTML file with live controls and a short writeup of how it works and
> what to watch for in production. No frameworks, no build, works offline.
> Live: <link> · Source: <repo> · MIT. Would love feedback on what's missing.

*(r/webdev restricts self-promo to "Showoff Saturday" — respect it.)*

### dev.to / Hashnode article

**Title:** `I catalogued 129 web animation techniques so you don't have to`

**Outline:**
1. The problem — animation knowledge is scattered across libraries and CodePens.
2. The approach — one technique, one file, teach the mechanic not the tool.
3. A tour of the 7 categories with 3–4 embedded GIFs.
4. Two or three techniques explained in depth (e.g. scroll-driven animations, view transitions API).
5. It's open source — how to contribute. Link the repo, ask for a star.

*(Canonical-link the article back to your site to avoid SEO cannibalization.)*

### X / Bluesky thread

> 1/ I built Animation Handbook — 129 web animation techniques, each a live demo
> you can open and read how it works. No dependencies, no build step. 🧵 <GIF>
>
> 2/ Scroll effects, page transitions, micro-interactions, kinetic type, WebGL,
> ambient backgrounds — 7 categories, all vanilla HTML/CSS/JS. <GIF>
>
> 3/ Every entry explains the *mechanic* and the production gotchas — not a
> library pitch. GSAP/Framer/Three only appear in "production notes."
>
> 4/ It's open source (MIT) and runs offline. Star it, fork it, add your own: <repo> · Live: <link>

Tag/DM accounts that curate frontend content (e.g. weekly newsletters, "awesome"
list maintainers). Ask to be added to relevant awesome-lists (awesome-css,
awesome-web-animation) via PR.

### Product Hunt

**Tagline:** `A live, dependency-free reference of 129 web animation techniques`
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
