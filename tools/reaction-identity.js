'use strict';

const METABOLITE_ALIASES = new Map([
  ['F-1,6-BP', '果糖-1,6-二磷酸'],
  ['1,3-BPG', '1,3-二磷酸甘油酸'],
  ['甘油-3-P', '甘油-3-磷酸'],
  ['G6P', '葡萄糖-6-磷酸'],
  ['F6P', '果糖-6-磷酸'],
  ['DHAP', '磷酸二羟丙酮'],
  ['G3P', '甘油醛-3-磷酸'],
  ['3-PG', '3-磷酸甘油酸'],
  ['2-PG', '2-磷酸甘油酸'],
  ['PEP', '磷酸烯醇式丙酮酸'],
  ['OAA', '草酰乙酸']
]);

function normalizeReactionValue(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

function normalizeReactionEndpoint(value) {
  const normalized = normalizeReactionValue(value);
  const at = normalized.lastIndexOf('@');
  const name = at === -1 ? normalized : normalized.slice(0, at);
  const compartment = at === -1 ? '' : normalized.slice(at);
  return (METABOLITE_ALIASES.get(name) || name) + compartment;
}

function normalizeReactionEquation(value) {
  let normalized = normalizeReactionValue(value);
  for (const [alias, fullName] of METABOLITE_ALIASES) {
    normalized = normalized.replaceAll(alias, fullName);
  }
  return normalized;
}

function normalizeReactionEquationForComparison(value) {
  const normalized = normalizeReactionEquation(value);
  const parts = normalized.split(/⇌|↔/);
  if (parts.length !== 2) return normalized;
  const sides = parts.map(side => side.trim()).sort();
  return sides.join(' ⇌ ');
}

function reactionIdentity({ from, to, enzyme, equation, reversible }) {
  const reversibleFlag = reversible === true || reversible === '是' ? '1' : '0';
  return [
    normalizeReactionEndpoint(from),
    normalizeReactionEndpoint(to),
    normalizeReactionValue(enzyme),
    normalizeReactionEquation(equation),
    reversibleFlag
  ].join('\u001f');
}

module.exports = {
  normalizeReactionValue,
  normalizeReactionEndpoint,
  normalizeReactionEquation,
  normalizeReactionEquationForComparison,
  reactionIdentity
};
