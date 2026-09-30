/* Markdown helpers for the page tests: a README split into its sections, and its Key parameters table read as rows. */
'use strict';

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Text with Markdown code and bold markers removed, safe to insert as HTML.
function plain(s) {
  return escapeHtml(String(s).replace(/`/g, '').replace(/\*\*/g, ''));
}

// Allow only relative paths, "#" anchors and http(s) URLs as link targets; anything else
// (e.g. a javascript: URL) is rejected and rendered as plain link text instead.
function isSafeHref(href) {
  return /^(?:https?:|#|\.{0,2}\/|[\w.-]+(?:\/|$))/i.test(href) &&
    !/^[a-z][a-z0-9+.-]*:/i.test(href.replace(/^https?:/i, ''));
}

// Inline Markdown from README prose. Inline code becomes plain text: the site shows no code.
function inline(md) {
  return escapeHtml(md)
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, label, href) {
      return isSafeHref(href) ? '<a href="' + href + '">' + label + '</a>' : label;
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
}

// A README split into { "What it is": "...", ... } by its "## " headings.
function sections(md) {
  var out = {}, current = null, buf = [];
  String(md).replace(/\r\n?/g, '\n').split('\n').forEach(function (line) {
    var m = /^##\s+(.+?)\s*$/.exec(line);
    if (m) {
      if (current) out[current] = buf.join('\n').trim();
      current = m[1];
      buf = [];
    } else if (current) {
      buf.push(line);
    }
  });
  if (current) out[current] = buf.join('\n').trim();
  return out;
}

// "Duration (`--dur`)" becomes "Duration": parentheticals that hold code are dropped.
function cleanName(s) {
  return plain(String(s).replace(/\s*\(`[^`]*`[^)]*\)/g, ''));
}

// The Key parameters table as [{ name, value, effect }], without its header and divider rows.
function table(text) {
  var rows = String(text || '').split('\n')
    .filter(function (l) { return /^\s*\|/.test(l); })
    .map(function (l) {
      return l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(function (c) { return c.trim(); });
    });
  return rows.slice(1)
    .filter(function (r) { return !r.every(function (c) { return /^:?-{2,}:?$/.test(c); }); })
    .map(function (r) { return { name: cleanName(r[0] || ''), value: plain(r[1] || ''), effect: inline(r[2] || '') }; });
}

module.exports = { sections, table };
