// Checks the AI skill (skills/animation-handbook/) and llms.txt, which tools/make-skill.mjs writes from the pages and the
// home page's cards, and the Claude Code plugin marketplace that installs the skill (.claude-plugin/marketplace.json).
// Run from the repo root: node --test "tests/*.test.js"
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const ANIM = path.join(ROOT, 'animations');
const SKILL = path.join(ROOT, 'skills', 'animation-handbook');
const REFS = path.join(SKILL, 'references');
const LIVE = 'https://matinmonshizadeh.github.io/animation-handbook/';
const TOOL = 'node tools/make-skill.mjs';
// A file's text with Windows line endings read as plain ones: a checkout may hold either.
const read = f => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
const decode = s => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
// The part of s from the first `from` up to the next `to` after it ('' when `from` is missing).
const between = (s, from, to) => {
  const start = s.indexOf(from);
  if (start < 0) return '';
  const end = s.indexOf(to, start + from.length);
  return s.slice(start, end < 0 ? undefined : end);
};
// Every file under dir, as paths from the repo root written with "/".
const filesUnder = dir => !fs.existsSync(dir) ? [] : fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? filesUnder(path.join(dir, e.name)) : [path.relative(ROOT, path.join(dir, e.name)).split(path.sep).join('/')]);

const categories = fs.readdirSync(ANIM, { withFileTypes: true }).filter(c => c.isDirectory()).map(c => c.name);
const pages = categories.flatMap(cat => fs.readdirSync(path.join(ANIM, cat), { withFileTypes: true }).filter(d => d.isDirectory())
  .map(d => ({ cat, slug: d.name, file: path.join(ANIM, cat, d.name, 'index.html') })))
  .filter(d => fs.existsSync(d.file) && read(d.file).includes('<main class="hb-page">'));
const liveAddress = d => `${LIVE}animations/${d.cat}/${d.slug}/`;

const HOME = read(path.join(ROOT, 'index.html'));
// Where the bracket that opens at HOME[from] ('[' or '{') is closed, stepping over strings and // comments (as in pages.test.js).
function blockEnd(from) {
  const open = HOME[from], close = open === '[' ? ']' : '}';
  let depth = 0, i = from, quote = null;
  for (; i < HOME.length; i++) {
    const ch = HOME[i];
    if (quote) { if (ch === '\\') i++; else if (ch === quote) quote = null; continue; }
    if (ch === '/' && HOME[i + 1] === '/') { while (i < HOME.length && HOME[i] !== '\n') i++; continue; }
    if (ch === "'" || ch === '"' || ch === '`') quote = ch;
    else if (ch === open) depth++;
    else if (ch === close && --depth === 0) break;
  }
  return i;
}
// The value of `const NAME=` in the home page's script: an array or object literal of plain data, read with vm.
function homeConst(name) {
  const start = HOME.indexOf(`const ${name}=`);
  assert.ok(start >= 0, `const ${name} in index.html`);
  const from = start + `const ${name}=`.length;
  return vm.runInNewContext('(' + HOME.slice(from, blockEnd(from) + 1) + ')');
}

// The labels of a page's settings: the name of each setting in Try it (the p or label with class hb-setting-name, or the
// words beside a switch), or the label its control sets with data-hb-label. A setting marked data-hb-skip only compares the
// demo with something else and is never copied, so it is left out; one marked hidden shows (and is copied) with some choices
// of another setting, so it counts.
function settingLabels(html) {
  const tryIt = between(html, '<section class="hb-step hb-try"', '<section class="hb-step hb-prompt-step"');
  return tryIt.split('<div class="hb-setting"').slice(1)
    .filter(part => !/^[^>]*\sdata-hb-skip(?=[\s=>])/.test(part))
    .flatMap(part => {
      const own = part.match(/\sdata-hb-label="([^"]+)"/);
      if (own) return [decode(own[1])];
      return [...part.matchAll(/<(p|label) class="hb-setting-name"[^>]*>([^<]*)<\/\1>|<label class="hb-switch-row"><span>([^<]*)<\/span>/g)]
        .map(m => decode((m[2] ?? m[3]).trim()));
    });
}

// The anchors GitHub gives the headings of a file, in order: each heading lowercased, every character but letters, digits,
// spaces, "-" and "_" dropped and each space made a "-", with -1, -2… added to one already used in the file.
function anchors(headings) {
  const seen = new Map();
  return headings.map(h => {
    const slug = h.toLowerCase().replace(/[^\p{L}\p{M}\p{N}_ -]/gu, '').replace(/ /g, '-');
    const n = seen.get(slug) || 0;
    seen.set(slug, n + 1);
    return n ? `${slug}-${n}` : slug;
  });
}

test('the skill and llms.txt are what tools/make-skill.mjs writes from the pages and the home page now', async () => {
  const { buildSkill } = await import(pathToFileURL(path.join(ROOT, 'tools', 'make-skill.mjs')).href);
  const built = buildSkill(ROOT);
  const want = ['skills/animation-handbook/SKILL.md', 'skills/animation-handbook/references/catalog.md',
    ...categories.map(cat => `skills/animation-handbook/references/${cat}.md`), 'llms.txt'];
  assert.deepEqual(Object.keys(built).sort(), want.sort(), 'the files the tool writes');
  const stale = want.filter(rel => !fs.existsSync(path.join(ROOT, rel)) || read(path.join(ROOT, rel)) !== built[rel]);
  assert.deepEqual(stale, [], `files missing or out of date: run ${TOOL}`);
  assert.deepEqual(filesUnder(SKILL).filter(rel => !want.includes(rel)), [], 'files in the skill folder that the tool does not write');
});

test('SKILL.md has only a name, a description and a license, and a short body that links every reference file', () => {
  const text = read(path.join(SKILL, 'SKILL.md'));
  const parts = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert.ok(parts, 'SKILL.md starts with its front matter between two --- lines');
  const fields = parts[1].split('\n').map(line => line.match(/^([a-z-]+): (.+)$/));
  assert.ok(fields.every(Boolean), 'every front matter line is "key: value"');
  const front = Object.fromEntries(fields.map(f => [f[1], f[2]]));
  assert.deepEqual(Object.keys(front), ['name', 'description', 'license']);
  assert.equal(front.name, 'animation-handbook');
  assert.equal(front.name, path.basename(SKILL), 'the name is the folder name');
  assert.match(front.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'the name is lowercase letters, digits and single hyphens');
  assert.ok(front.name.length <= 64, 'the name has at most 64 characters');
  assert.ok(front.description.length <= 1024, `the description has ${front.description.length} characters, at most 1024`);
  // ": " would start a mapping in the YAML some installers read; < and > would read as XML tags, which some refuse.
  for (const bad of [': ', '<', '>']) assert.ok(!front.description.includes(bad), `the description has no "${bad}"`);
  assert.equal(front.license, 'MIT');
  const body = parts[2].split('\n');
  assert.ok(body.length < 200, `the body has ${body.length} lines, fewer than 200`);
  const files = fs.readdirSync(REFS);
  assert.ok(files.includes('catalog.md'), 'references/catalog.md is there');
  for (const file of files) assert.ok(parts[2].includes(`](references/${file})`), `SKILL.md links references/${file}`);
});

test('every page has one entry in its category file and one line in the catalog, holding its prompt and every setting', () => {
  assert.ok(pages.length > 0, 'there are guided-steps pages');
  const catalog = read(path.join(REFS, 'catalog.md'));
  const problems = [];
  for (const d of pages) {
    const where = `${d.cat}/${d.slug}`, address = liveAddress(d), file = path.join(REFS, `${d.cat}.md`);
    if (!fs.existsSync(file)) { problems.push(`${where}: there is no references/${d.cat}.md`); continue; }
    // The entries of a category file are its "## " sections; each names its page by the live address.
    const entries = read(file).split(/\n(?=## )/).filter(entry => entry.includes(address));
    const lines = catalog.split('\n').filter(line => line.includes(address));
    if (lines.length !== 1) problems.push(`${where}: ${lines.length} lines in catalog.md hold its live address`);
    if (entries.length !== 1) { problems.push(`${where}: ${entries.length} entries in ${d.cat}.md hold its live address`); continue; }
    const html = read(d.file);
    const prompt = decode(html.match(/<p class="hb-prompt">([^<]*)<\/p>/)[1]).replace(/\s+/g, ' ').trim();
    if (!entries[0].includes(`\n${prompt}\n`)) problems.push(`${where}: its entry does not hold the page's prompt word for word`);
    for (const label of settingLabels(html)) {
      if (!entries[0].includes(`\n- ${label}: `)) problems.push(`${where}: its entry has no line for the setting "${label}"`);
    }
  }
  assert.deepEqual(problems, [], `run ${TOOL} after changing a page`);
});

test('llms.txt lists every card once, in the order of CATS, with its live address and its description', () => {
  const text = read(path.join(ROOT, 'llms.txt'));
  const cards = homeConst('CATS').flatMap(cat => cat.entries.map(([slug, , desc]) => ({ address: `${LIVE}${cat.folder}/${slug}/`, desc })));
  assert.ok(text.startsWith('# Animation Handbook\n'), 'llms.txt starts with the title');
  assert.match(text, new RegExp(`^> .*\\b${cards.length}\\b`, 'm'), 'the summary under the title gives the count');
  const lines = text.split('\n').filter(line => line.startsWith(`- [`) && line.includes(`](${LIVE}animations/`));
  assert.equal(lines.length, cards.length, 'one line per card');
  cards.forEach((card, i) => {
    assert.ok(lines[i].includes(`](${card.address}): `), `line ${i + 1} links ${card.address}: ${lines[i]}`);
    assert.ok(lines[i].endsWith(`: ${card.desc}`), `line ${i + 1} ends with the card's description: ${lines[i]}`);
  });
});

test('the plugin marketplace parses and its one plugin installs the skill folder', () => {
  const market = JSON.parse(read(path.join(ROOT, '.claude-plugin', 'marketplace.json')));
  assert.equal(market.name, 'animation-handbook');
  assert.ok(market.owner && market.owner.name, 'the marketplace names its owner');
  assert.equal(market.plugins.length, 1, 'one plugin');
  const [plugin] = market.plugins;
  assert.equal(plugin.name, 'animation-handbook');
  // Without a version, an install follows the commits on main instead of staying on one version.
  assert.equal(plugin.version, undefined, 'the plugin has no version');
  assert.equal(market.version, undefined, 'the marketplace has no version');
  assert.ok(Array.isArray(plugin.skills) && plugin.skills.length === 1, 'the plugin lists one skill folder');
  for (const dir of plugin.skills) {
    assert.ok(fs.existsSync(path.join(ROOT, plugin.source, dir, 'SKILL.md')), `${plugin.source} + ${dir} holds SKILL.md`);
  }
});

test('every reference file over 100 lines starts with a contents list that links each of its sections', () => {
  for (const file of fs.readdirSync(REFS)) {
    const text = read(path.join(REFS, file));
    if (text.split('\n').length <= 100) continue;
    // Every heading takes an anchor, the title and Contents too; the sections are the "## " headings but Contents.
    const all = [...text.matchAll(/^(#+) (.+)$/gm)].map(m => ({ level: m[1].length, heading: m[2] }));
    const slugs = anchors(all.map(h => h.heading));
    const sections = all.map((h, i) => ({ ...h, anchor: slugs[i] })).filter(h => h.level === 2 && h.heading !== 'Contents');
    const top = text.slice(0, text.search(/^## (?!Contents$)/m));
    const links = [...top.matchAll(/\[([^\]]+)\]\(#([^)]+)\)/g)];
    assert.ok(sections.length > 0, `${file} has sections`);
    assert.deepEqual(links.map(m => m[1]), sections.map(s => s.heading), `${file}: the contents before its first section name every section, in order`);
    assert.deepEqual(links.map(m => m[2]), sections.map(s => s.anchor), `${file}: each contents link opens its section`);
  }
});
