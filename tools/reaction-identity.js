'use strict';

function normalizeReactionValue(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

function reactionIdentity({ from, to, enzyme, equation, reversible }) {
  const reversibleFlag = reversible === true || reversible === '是' ? '1' : '0';
  return [
    normalizeReactionValue(from),
    normalizeReactionValue(to),
    normalizeReactionValue(enzyme),
    normalizeReactionValue(equation),
    reversibleFlag
  ].join('\u001f');
}

module.exports = { normalizeReactionValue, reactionIdentity };
