/* Markdown helpers for the page tests: a README split into its sections (by the reader the page itself uses), and its Key parameters table read as rows. */
'use strict';

const { sections } = require('../../assets/js/demo-page.js');

// The Key parameters table as its rows (each a list of cells), without the header row and the divider row.
function table(text) {
  var rows = String(text || '').split('\n')
    .filter(function (l) { return /^\s*\|/.test(l); })
    .map(function (l) {
      return l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(function (c) { return c.trim(); });
    });
  return rows.slice(1)
    .filter(function (r) { return !r.every(function (c) { return /^:?-{2,}:?$/.test(c); }); });
}

module.exports = { sections, table };
