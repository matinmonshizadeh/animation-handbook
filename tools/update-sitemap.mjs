#!/usr/bin/env node
// Writes sitemap.xml from the home page's cards: a development tool, not part of the site. Run it from a git checkout
// after adding or changing pages.
// Usage: node tools/update-sitemap.mjs [--out <file>]
//   The home page comes first, then every page in the order of the CATS array in index.html (the home page's order),
//   at the home page's canonical address. A page's lastmod is the date of the last commit that touched its folder
//   (git log -1 --format=%cs -- <folder>), or today's date when the folder has changes that are not committed yet (a
//   new page too). The home page's lastmod is the latest of index.html and the files it loads (the page script and
//   the two fonts): a change to a page alone does not change the home page. changefreq and
//   priority stay as they are: weekly and 1.0 for the home page, monthly and 0.7 for every page.
//   Without --out it rewrites sitemap.xml at the repo root, keeping its line endings; --out writes the same text to
//   another file instead, to compare. It prints how many URLs it wrote and how many dates changed.
// Needs git on the PATH. Exit code 1 when a card has no page folder or git cannot be read.
import { execFile, execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import vm from 'node:vm';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SITEMAP = join(ROOT, 'sitemap.xml');
const args = process.argv.slice(2);
const outAt = args.indexOf('--out');
if (outAt >= 0 && !args[outAt + 1]) { console.error('--out needs a file name'); process.exit(2); }
const OUT = outAt >= 0 ? args[outAt + 1] : SITEMAP;

const HOME = readFileSync(join(ROOT, 'index.html'), 'utf8');
// Where the bracket that opens at HOME[from] is closed, stepping over strings and // comments (as the tests read it).
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
const start = HOME.indexOf('const CATS=');
if (start < 0) { console.error('index.html has no const CATS='); process.exit(1); }
const from = start + 'const CATS='.length;
const CATS = vm.runInNewContext('(' + HOME.slice(from, blockEnd(from) + 1) + ')');
const BASE = (HOME.match(/<link rel="canonical" href="([^"]+\/)">/) || [])[1];
if (!BASE) { console.error('index.html has no canonical address ending in /'); process.exit(1); }

// A category's folder is written from the root, as in 'animations/01-scroll-based'.
const pages = CATS.flatMap(cat => cat.entries.map(([slug]) => `${cat.folder.replace(/\/$/, '')}/${slug}/`));
const missing = pages.filter(folder => !existsSync(join(ROOT, folder, 'index.html')));
if (missing.length) { console.error(`cards with no page: ${missing.join(', ')}`); process.exit(1); }

const now = new Date();
const TODAY = [now.getFullYear(), now.getMonth() + 1, now.getDate()].map(n => String(n).padStart(2, '0')).join('-');
let changed;
try {
  // Every path with changes that are not committed (staged, unstaged or new), one record per path.
  changed = execFileSync('git', ['status', '--porcelain=v1', '-z', '--untracked-files=all', '--no-renames'], { cwd: ROOT, encoding: 'utf8' })
    .split('\0').filter(Boolean).map(record => record.slice(3));
} catch (err) {
  console.error(`git status failed (${err.message.split('\n')[0]}): run this from a git checkout with git on the PATH`);
  process.exit(1);
}
const git = promisify(execFile);
// The date of a file or folder: today when it has changes that are not committed, else the date of its last commit.
async function dateOf(target) {
  const isFolder = target.endsWith('/');
  if (changed.some(p => (isFolder ? p.startsWith(target) : p === target))) return TODAY;
  const { stdout } = await git('git', ['log', '-1', '--format=%cs', '--', target], { cwd: ROOT });
  return stdout.trim() || TODAY;
}
// A few git calls at a time: one per page is quick enough, all at once is not kind to a busy machine.
async function datesOf(targets, atOnce = 8) {
  const dates = new Array(targets.length);
  let next = 0;
  await Promise.all(Array.from({ length: atOnce }, async () => {
    while (next < targets.length) { const i = next++; dates[i] = await dateOf(targets[i]); }
  }));
  return dates;
}
const pageDates = await datesOf(pages);
const homeDate = (await datesOf(['index.html', 'assets/js/demo-page.js', 'assets/fonts/schibsted-latin.woff2',
  'assets/fonts/schibsted-latin-ext.woff2'])).sort().pop();

const escape = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const line = (loc, lastmod, changefreq, priority) =>
  `  <url><loc>${escape(loc)}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  line(BASE, homeDate, 'weekly', '1.0'), ...pages.map((folder, i) => line(BASE + folder, pageDates[i], 'monthly', '0.7')), '</urlset>'];

const old = existsSync(SITEMAP) ? readFileSync(SITEMAP, 'utf8') : '';
const EOL = old.includes('\r\n') ? '\r\n' : '\n';
const oldDates = new Map([...old.matchAll(/<loc>([^<]*)<\/loc><lastmod>([^<]*)<\/lastmod>/g)].map(m => [m[1], m[2]]));
const newDates = [[BASE, homeDate], ...pages.map((folder, i) => [BASE + folder, pageDates[i]])];
const moved = newDates.filter(([loc, date]) => oldDates.get(loc) !== date).length;
writeFileSync(OUT, lines.join(EOL) + EOL);
console.log(`${OUT}: ${newDates.length} URLs, ${moved} lastmod ${moved === 1 ? 'date' : 'dates'} new or changed`);
