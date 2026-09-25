/* Animation Handbook — shared behaviour for the demo pages.
 * These helpers turn a demo's README.md into the "Read more" section and build
 * the settings line for the copied prompt. They are exported for tests/handbook.test.js. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Handbook = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Text with Markdown code and bold markers removed, safe to insert as HTML.
  function plain(s) {
    return escapeHtml(String(s).replace(/`/g, '').replace(/\*\*/g, ''));
  }

  // Inline Markdown from README prose. Inline code becomes plain text: the site shows no code.
  function inline(md) {
    return escapeHtml(md)
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
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

  function paragraphs(text) {
    return String(text || '').split(/\n\s*\n/)
      .map(function (p) { return p.trim(); })
      .filter(Boolean)
      .map(function (p) { return '<p>' + inline(p.replace(/\s*\n\s*/g, ' ')) + '</p>'; })
      .join('');
  }

  function bullets(text) {
    return String(text || '').split('\n')
      .filter(function (l) { return /^\s*[-*]\s+/.test(l); })
      .map(function (l) { return inline(l.replace(/^\s*[-*]\s+/, '')); });
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

  // "- [Name](../slug/) — description" lines as [{ name, href, desc }].
  function seeAlso(text) {
    return String(text || '').split('\n').map(function (l) {
      var m = /^\s*[-*]\s+\[([^\]]+)\]\(([^)\s]+)\)\s*(?:[—–-]\s*(.*))?$/.exec(l);
      return m ? { name: plain(m[1]), href: m[2], desc: m[3] ? inline(m[3]) : '' } : null;
    }).filter(Boolean);
  }

  function settingsLine(items) {
    return (items || [])
      .filter(function (i) { return i && i.label && i.value; })
      .map(function (i) { return i.label + ' ' + i.value; })
      .join(', ');
  }

  return {
    escapeHtml: escapeHtml, plain: plain, inline: inline, sections: sections, paragraphs: paragraphs,
    bullets: bullets, cleanName: cleanName, table: table, seeAlso: seeAlso, settingsLine: settingsLine
  };
});
