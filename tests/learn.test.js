// Static checks for the Learn pages: the learning path on learn/index.html (the single source of truth for the path), the idea
// lessons in learn/<slug>/, and the lesson line and lesson nav on every page of the path that has them.
// Run from the repo root: node --test "tests/*.test.js"
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const LEARN = path.join(ROOT, 'learn');
const ANIM = path.join(ROOT, 'animations');
const read = f => fs.readFileSync(f, 'utf8');
const count = (s, sub) => s.split(sub).length - 1;
const HUB = read(path.join(LEARN, 'index.html'));
const HOME = read(path.join(ROOT, 'index.html'));

// The steps of the path in page order: { n, kind, soon, href (null while not built), title, num, label, line, body }.
// num, label and line are what the visitor reads on the step: its number, its kind and its one line.
const spanOf = (body, cls) => (body.match(new RegExp(`<span class="${cls}">([^<]*)</span>`)) || [])[1];
const STEPS = [...HUB.matchAll(/<li data-step="(\d+)" data-kind="(idea|animation)"( data-soon)?>([\s\S]*?)<\/li>/g)].map(m => {
  const link = m[4].match(/<a href="([^"]+)"/);
  return { n: Number(m[1]), kind: m[2], soon: !!m[3], href: link ? link[1] : null, title: (m[4].match(/<b>([^<]+)<\/b>/) || [])[1],
    num: spanOf(m[4], 'n'), label: spanOf(m[4], 'k'), line: spanOf(m[4], 'line'), body: m[4] };
});
const dirOf = href => path.resolve(LEARN, href);
const h1Of = dir => ((read(path.join(dir, 'index.html')).match(/<h1>([^<]+)<\/h1>/) || [])[1] || '').replace(/&amp;/g, '&');
const LESSONS = fs.readdirSync(LEARN, { withFileTypes: true })
  .filter(d => d.isDirectory() && fs.existsSync(path.join(LEARN, d.name, 'index.html'))).map(d => path.join(LEARN, d.name));
// Every Learn page: the hub and each idea lesson.
const PAGES = [path.join(LEARN, 'index.html'), ...LESSONS.map(d => path.join(d, 'index.html'))];
const decode = s => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const FOOTER = '<footer class="hb-foot"><span>Animation Handbook</span><a href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener">Source on GitHub</a><a href="#top">Back to top ↑</a></footer>';
const STAR = '<a class="hb-star" href="https://github.com/matinmonshizadeh/animation-handbook" target="_blank" rel="noopener" aria-label="Star on GitHub">';
const version = (html, file) => (html.match(new RegExp(`demo-page\\.${file}\\?v=(\\d+)`)) || [])[1];

test('the path has 25 steps in five chapters of five, numbered in order', () => {
  assert.deepEqual(STEPS.map(s => s.n), Array.from({ length: 25 }, (_, i) => i + 1));
  const chapters = [...HUB.matchAll(/<section class="hb-chapter"[\s\S]*?<\/section>/g)].map(m => m[0]);
  assert.deepEqual(chapters.map(c => count(c, '<li data-step=')), [5, 5, 5, 5, 5]);
  // Each chapter is one ordered list. VoiceOver drops the list role when the list has no bullets, so the role is written out.
  for (const [i, c] of chapters.entries()) {
    assert.equal(count(c, '<ol class="hb-path"'), 1, `chapter ${i + 1} is an ordered list`);
    assert.equal(count(c, '<ol class="hb-path" role="list">'), 1, `chapter ${i + 1}'s list keeps its list role`);
  }
});

test('every step shows its own number, its kind (Idea, Animation, or Idea · Not built yet) and a line', () => {
  for (const s of STEPS) {
    assert.equal(s.num, String(s.n), `step ${s.n} shows its own number`);
    assert.ok(!s.soon || s.kind === 'idea', `step ${s.n}: only an idea can be not built yet`);
    const label = s.soon ? 'Idea · Not built yet' : s.kind === 'idea' ? 'Idea' : 'Animation';
    assert.equal(s.label, label, `step ${s.n} shows its kind`);
    assert.ok(s.line && s.line.trim(), `step ${s.n} has its line`);
  }
});

test('every built step links to an existing page and shows its title; a step not built yet has no link and says so', () => {
  for (const s of STEPS) {
    if (s.soon) {
      assert.equal(s.href, null, `step ${s.n} has no link`);
      assert.ok(s.body.includes('Not built yet'), `step ${s.n} says Not built yet`);
      continue;
    }
    assert.ok(s.href, `step ${s.n} has a link`);
    const dir = dirOf(s.href);
    assert.ok(fs.existsSync(path.join(dir, 'index.html')), `step ${s.n}: ${s.href} exists`);
    assert.equal(s.title, h1Of(dir), `step ${s.n} shows the page's title`);
    assert.ok(dir.startsWith((s.kind === 'idea' ? LEARN : ANIM) + path.sep), `step ${s.n}: ideas live in learn/, animations in animations/`);
  }
});

test('every idea lesson in learn/ is a built step of the path', () => {
  for (const dir of LESSONS) {
    assert.ok(STEPS.some(s => s.href && s.kind === 'idea' && dirOf(s.href) === dir), `${path.basename(dir)} is a built idea step`);
  }
});

// Every page of the path that has a lesson line or lesson nav: each idea lesson, and any animation page that carries them.
const onPath = STEPS.filter(s => s.href).map(s => ({ step: s, dir: dirOf(s.href) }))
  .filter(p => fs.existsSync(path.join(p.dir, 'index.html')) && read(path.join(p.dir, 'index.html')).includes('class="hb-lesson'));
for (const { step, dir } of onPath) {
  test(`step ${step.n} (${step.title}): its lesson line and lesson nav match the Learn page`, () => {
    const html = read(path.join(dir, 'index.html'));
    const learnHref = path.relative(dir, LEARN).split(path.sep).join('/') + '/';
    const line = step.kind === 'idea' ? `<p class="hb-cat">Lesson ${step.n} of 25 · Idea</p>`
      : `<p class="hb-lesson"><a href="${learnHref}">Learning path · Lesson ${step.n} of 25</a></p>`;
    assert.ok(html.includes(line), `lesson line: ${line}`);
    const nav = html.match(/<nav class="hb-lesson-nav" aria-label="Learning path">([\s\S]*?)<\/nav>/);
    assert.ok(nav, 'lesson nav');
    assert.ok(nav[1].includes('<h2 class="hb-lesson-title">Learning path</h2>'), 'lesson nav title');
    const prev = STEPS[step.n - 2], next = STEPS[step.n];
    for (const [cls, other, label] of [['hb-lesson-prev', prev, prev && `← Lesson ${prev.n}`], ['hb-lesson-next', next, next && `Lesson ${next.n} →`]]) {
      const a = nav[1].match(new RegExp(`<a class="${cls}" href="([^"]+)"><span>([^<]+)</span><b>([^<]+)</b></a>`));
      if (!other) { assert.equal(a, null, `no ${cls} at the end of the path`); continue; }
      assert.ok(other.href, `step ${other.n}, next to step ${step.n}, is built`);
      assert.ok(a, cls);
      assert.equal(a[2], label, `${cls} label`);
      assert.equal(a[3], other.title, `${cls} title`);
      assert.equal(path.resolve(dir, a[1]), dirOf(other.href), `${cls} opens step ${other.n}`);
    }
    assert.ok(nav[1].includes(`<a class="hb-lesson-all" href="${learnHref}">All 25 lessons</a>`), 'All 25 lessons');
    if (step.kind === 'idea') {
      for (const [rel, other, word] of [['prev', prev, 'Previous'], ['next', next, 'Next']]) {
        const a = html.match(new RegExp(`<a href="([^"]+)" rel="${rel}" aria-label="${word} lesson: ([^"]+)">`));
        if (!other) { assert.equal(a, null, `no top bar ${rel} link at the end of the path`); continue; }
        assert.ok(a, `top bar ${rel} link`);
        assert.equal(path.resolve(dir, a[1]), dirOf(other.href), `top bar ${rel} opens step ${other.n}`);
        assert.equal(a[2], other.title, `top bar ${rel} names step ${other.n}`);
      }
    }
  });
}

for (const file of PAGES) {
  const name = path.relative(ROOT, file).split(path.sep).join('/');
  test(`${name}: the shared frame (top bar with the Star link, footer, shared files at the home page's version) and no code`, () => {
    const html = read(file);
    assert.match(html, /<body class="hb hb-learn"/, 'body class hb hb-learn');
    assert.equal(count(html, '<nav class="hb-bar"'), 1);
    assert.ok(html.includes(STAR), 'the Star link in the top bar');
    assert.equal(count(html, '<main class="hb-page">'), 1);
    assert.equal(count(html, '<header class="hb-head">'), 1);
    assert.ok(html.replace(/>\s+</g, '><').includes(FOOTER), 'the shared footer');
    // The home page links only demo-page.js (it has its own styles), so its version N is the script's. Without a version on the
    // home page the comparison below could pass with nothing on either side.
    const homeVersion = version(HOME, 'js');
    assert.ok(homeVersion, 'the home page links demo-page.js with a version');
    for (const f of ['css', 'js']) assert.equal(version(html, f), homeVersion, `demo-page.${f} at the home page's version`);
    assert.ok(!/`|<code|<pre/.test(html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '')), 'no code on the page');
    assert.ok(!html.includes('hb-view'), 'no old hb-view markup');
  });
}

// What search engines, social sites and the browser tab show, as on every animation page: the tab title is the heading and the site
// name, the descriptions are the lede, and the address is the page's own folder.
for (const file of PAGES) {
  const name = path.relative(ROOT, file).split(path.sep).join('/');
  test(`${name}: the tab title, the descriptions and the address say what the page says`, () => {
    const html = read(file);
    const h1 = decode((html.match(/<h1>([^<]+)<\/h1>/) || [])[1] || '');
    const lede = decode(((html.match(/<p class="hb-lede">([\s\S]*?)<\/p>/) || [])[1] || '').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
    assert.ok(h1, 'the page has a heading');
    assert.ok(lede, 'the page has a lede');
    const meta = attr => { const m = html.match(new RegExp(`<meta ${attr} content="([^"]*)">`)); assert.ok(m, `<meta ${attr}> is there`); return decode(m[1]); };
    const title = `${h1} — Animation Handbook`;
    assert.equal(decode((html.match(/<title>([^<]*)<\/title>/) || [])[1] || ''), title, '<title> is the heading and the site name');
    for (const attr of ['property="og:title"', 'name="twitter:title"']) assert.equal(meta(attr), title, attr);
    for (const attr of ['name="description"', 'property="og:description"', 'name="twitter:description"']) assert.equal(meta(attr), lede, `${attr} is the lede`);
    const address = `https://matinmonshizadeh.github.io/animation-handbook/${path.relative(ROOT, path.dirname(file)).split(path.sep).join('/')}/`;
    const canonical = html.match(/<link rel="canonical" href="([^"]*)">/);
    assert.ok(canonical, 'the canonical link is there');
    assert.equal(canonical[1], address, 'the canonical address is the live address of the page\'s folder');
    assert.equal(meta('property="og:url"'), address, 'og:url is the live address of the page\'s folder');
  });
}

test('the Learn page names itself and has five chapters', () => {
  assert.ok(HUB.includes('<h1>Learn web animation</h1>'));
  assert.ok(HUB.includes('<p class="hb-lede">25 short lessons, from easy to advanced. You watch and try; you never write code.</p>'));
  assert.equal(count(HUB, '<section class="hb-chapter"'), 5);
});

for (const dir of LESSONS) {
  test(`learn/${path.basename(dir)}: an idea lesson with a stage, Why it works, Where you'll see it and no prompt`, () => {
    const html = read(path.join(dir, 'index.html'));
    const body = html.match(/<body class="hb hb-learn" data-hb-kind="(once|loop|scroll|do)"( data-hb-autoplay)?(?: data-hb-motion-note="[^"]*")?>/);
    assert.ok(body, 'the body declares the page kind');
    for (const part of ['<section class="hb-step hb-watch"', '<div class="hb-player">', '<section class="hb-why"', '<section class="hb-seen"', '<nav class="hb-lesson-nav"']) {
      assert.equal(count(html, part), 1, `exactly one ${part}`);
    }
    assert.ok(!html.includes('hb-prompt'), 'no prompt');
    if (body[1] === 'loop') assert.equal(count(html, 'data-hb-pause'), 1, 'a loop has Pause');
    if (body[1] === 'scroll') {
      assert.ok(body[2], 'a scroll lesson scrolls once on arrival');
      assert.equal(count(html, 'data-hb-autoscroll'), 1, 'Play');
      assert.equal(count(html, 'data-hb-top'), 1, 'Back to top');
    }
    const why = html.match(/<section class="hb-why"[\s\S]*?<\/section>/)[0].replace(/<[^>]+>/g, ' ');
    const sentences = why.replace('Why it works', '').split(/[.!?](?:\s|$)/).filter(s => s.trim()).length;
    assert.ok(sentences >= 2 && sentences <= 4, `Why it works has ${sentences} sentences`);
    const seen = [...html.match(/<section class="hb-seen"[\s\S]*?<\/section>/)[0].matchAll(/<a class="hb-rel" href="([^"]+)"><b>([^<]+)<\/b>/g)];
    assert.ok(seen.length >= 3 && seen.length <= 6, `${seen.length} pages in Where you'll see it`);
    for (const [, href, title] of seen) {
      const target = path.resolve(dir, href);
      assert.ok(target.startsWith(ANIM + path.sep) && fs.existsSync(path.join(target, 'index.html')), `${href} is an animation page`);
      assert.equal(title, h1Of(target), `${href} shows the page's title`);
    }
  });
}
