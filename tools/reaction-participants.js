// Convert the reaction equation text into a conservative participant list.
// Primary TSV endpoints remain authoritative; equation terms are marked as inferred.

const ARROW_PATTERN = /(⇌|↔|→)/;
const SEGMENT_PATTERN = /[；;]/;

const STATIC_ALIAS_ENTRIES = [
  ['G6P', '葡萄糖-6-磷酸'],
  ['F6P', '果糖-6-磷酸'],
  ['F-1,6-BP', '果糖-1,6-二磷酸'],
  ['F1,6BP', '果糖-1,6-二磷酸'],
  ['DHAP', '磷酸二羟丙酮'],
  ['G3P', '甘油醛-3-磷酸'],
  ['1,3-BPG', '1,3-二磷酸甘油酸'],
  ['3-PG', '3-磷酸甘油酸'],
  ['2-PG', '2-磷酸甘油酸'],
  ['PEP', '磷酸烯醇式丙酮酸'],
  ['OAA', '草酰乙酸'],
  ['Α-KG', 'α-酮戊二酸'],
  ['ALPHA-KG', 'α-酮戊二酸'],
  ['COA-SH', '辅酶 A'],
  ['COQ', '辅酶 Q'],
  ['COQH₂', '泛醇'],
  ['COQH2', '泛醇'],
  ['CYT C', '细胞色素 c'],
  ['ASP', '天冬氨酸'],
  ['PI', '无机磷酸'],
  ['H₂O', '水'],
  ['H2O', '水'],
  ['O₂', '氧'],
  ['O2', '氧'],
  ['甘油-3-P', '甘油-3-磷酸']
];

const COMPARTMENT_SUFFIXES = [
  ['线粒体膜间隙侧', '线粒体膜间隙'],
  ['线粒体膜间隙', '线粒体膜间隙'],
  ['线粒体基质侧', '线粒体基质'],
  ['线粒体基质', '线粒体基质'],
  ['线粒体内膜', '线粒体内膜'],
  ['线粒体外膜', '线粒体外膜'],
  ['内质网腔', '内质网腔'],
  ['平滑内质网', '平滑内质网'],
  ['粗面内质网', '粗面内质网'],
  ['过氧化物酶体', '过氧化物酶体'],
  ['高尔基体', '高尔基体'],
  ['乙醛酸体', '乙醛酸体'],
  ['质体', '质体'],
  ['膜间隙侧', '线粒体膜间隙'],
  ['膜间隙', '线粒体膜间隙'],
  ['基质侧', '线粒体基质'],
  ['基质', '线粒体基质'],
  ['细胞质', '细胞质'],
  ['胞质', '细胞质'],
  ['细胞外', '胞外'],
  ['胞外', '胞外'],
  ['内体', '内体']
];

function normalizeParticipantKey(value) {
  return String(value || '')
    .trim()
    .replace(/[‐‑‒–—−]/g, '-')
    .replace(/[ₙ](?:₊₁|₋₁)?$/g, '')
    .replace(/辅酶\s*A/gi, '辅酶A')
    // Parentheses are chemically meaningful in NAD(P)H / NAD(P)+.
    .replace(/[\s_/,，、@]/g, '')
    .toUpperCase();
}

const STATIC_ALIASES = new Map(STATIC_ALIAS_ENTRIES.map(([key, value]) => [
  normalizeParticipantKey(key),
  value
]));

function buildKnownNameIndex(names = []) {
  const index = new Map();
  for (const name of names) {
    const key = normalizeParticipantKey(name);
    if (key && !index.has(key)) index.set(key, name);
  }
  return index;
}

function canonicalizeParticipantName(value, knownNameIndex = new Map()) {
  const raw = String(value || '').trim();
  const alias = STATIC_ALIASES.get(normalizeParticipantKey(raw));
  if (alias) return alias;

  const exactKnown = knownNameIndex.get(normalizeParticipantKey(raw));
  if (exactKnown) return exactKnown;

  const polymerBase = raw.replace(/[ₙ](?:₊₁|₋₁)?$/g, '');
  const knownPolymer = knownNameIndex.get(normalizeParticipantKey(polymerBase));
  if (knownPolymer) return knownPolymer;

  const coaCandidate = raw.replace(/-CoA$/i, '辅酶 A');
  const knownCoa = knownNameIndex.get(normalizeParticipantKey(coaCandidate));
  if (knownCoa) return knownCoa;

  return polymerBase || raw;
}

function extractCoefficient(value) {
  let text = String(value || '').trim();
  const fraction = text.match(/^([½⅓⅔¼¾])\s*(.+)$/);
  if (fraction) return { coefficient: fraction[1], name: fraction[2].trim() };

  const spaced = text.match(/^(\d+(?:\.\d+)?)\s+(.+)$/);
  if (spaced) return { coefficient: spaced[1], name: spaced[2].trim() };

  const compact = text.match(/^(\d+)(H⁺|H₂O|H2O|O₂|O2|e⁻)$/i);
  if (compact) return { coefficient: compact[1], name: compact[2].trim() };
  return { coefficient: '1', name: text };
}

function extractQualifier(value) {
  const text = String(value || '').trim();
  const match = text.match(/^(.*?)[(（]([^()（）]+)[)）]$/);
  if (!match) return { name: text, qualifier: '' };
  return { name: match[1].trim(), qualifier: match[2].trim() };
}

function extractCompartment(value) {
  let text = String(value || '').trim();
  const at = text.lastIndexOf('@');
  if (at > 0) {
    return { name: text.slice(0, at).trim(), compartmentHint: text.slice(at + 1).trim() };
  }
  for (const [suffix, compartmentHint] of COMPARTMENT_SUFFIXES) {
    if (text.length > suffix.length && text.endsWith(suffix)) {
      return { name: text.slice(0, -suffix.length).trim(), compartmentHint };
    }
  }
  return { name: text, compartmentHint: '' };
}

function compartmentFromLabel(value) {
  const text = String(value || '').trim();
  const match = COMPARTMENT_SUFFIXES.find(([suffix]) => suffix === text);
  return match ? match[1] : '';
}

function parseTerm(rawTerm, role, knownNameIndex) {
  // Strip a compartment suffix before reading a compact coefficient such as 2H+.
  const compartmentPart = extractCompartment(rawTerm);
  const coefficientPart = extractCoefficient(compartmentPart.name);
  const qualifierPart = extractQualifier(coefficientPart.name);
  const sourceName = qualifierPart.name.trim();
  const name = canonicalizeParticipantName(sourceName, knownNameIndex);
  if (!name) return null;
  return {
    key: normalizeParticipantKey(name),
    name,
    rawName: String(rawTerm || '').trim(),
    aliases: normalizeParticipantKey(sourceName) === normalizeParticipantKey(name) ? [] : [sourceName],
    role,
    coefficient: coefficientPart.coefficient,
    qualifier: qualifierPart.qualifier,
    compartmentHint: compartmentPart.compartmentHint,
    primary: false,
    source: 'equation'
  };
}

function parseTransportShorthand(segment, arrow, knownNameIndex) {
  const arrowIndex = segment.indexOf(arrow);
  const left = segment.slice(0, arrowIndex).trim();
  const right = segment.slice(arrowIndex + arrow.length).trim();
  const source = left.match(/^(.+?)[：:]\s*(.+)$/);
  if (!source) return null;
  const sourceCompartment = compartmentFromLabel(source[2]);
  const targetCompartment = compartmentFromLabel(right);
  if (!sourceCompartment || !targetCompartment) return null;
  return [
    parseTerm(`${source[1]}@${sourceCompartment}`, 'substrate', knownNameIndex),
    parseTerm(`${source[1]}@${targetCompartment}`, 'product', knownNameIndex)
  ].filter(Boolean);
}

function parseEquation(equation, knownNames = []) {
  const knownNameIndex = knownNames instanceof Map ? knownNames : buildKnownNameIndex(knownNames);
  const participants = [];
  const ignoredSegments = [];
  const segments = String(equation || '').split(SEGMENT_PATTERN).map(value => value.trim()).filter(Boolean);

  for (const segment of segments) {
    const arrow = segment.match(ARROW_PATTERN);
    if (!arrow) {
      ignoredSegments.push(segment);
      continue;
    }
    const transportParticipants = parseTransportShorthand(segment, arrow[0], knownNameIndex);
    if (transportParticipants) {
      participants.push(...transportParticipants);
      continue;
    }
    const arrowIndex = segment.indexOf(arrow[0]);
    const sides = [
      { role: 'substrate', text: segment.slice(0, arrowIndex) },
      { role: 'product', text: segment.slice(arrowIndex + arrow[0].length) }
    ];
    for (const side of sides) {
      const terms = side.text.split(/\s+\+\s+/).map(value => value.trim()).filter(Boolean);
      for (const term of terms) {
        const parsed = parseTerm(term, side.role, knownNameIndex);
        if (parsed) participants.push(parsed);
      }
    }
  }
  return { participants, ignoredSegments };
}

function mergeParticipant(target, incoming) {
  target.primary = target.primary || incoming.primary;
  if (target.source !== 'endpoint' && incoming.source === 'endpoint') target.source = 'endpoint';
  if ((!target.coefficient || target.coefficient === '1') && incoming.coefficient) target.coefficient = incoming.coefficient;
  if (!target.rawName && incoming.rawName) target.rawName = incoming.rawName;
  if (!target.qualifier && incoming.qualifier) target.qualifier = incoming.qualifier;
  if (!target.compartmentHint && incoming.compartmentHint) target.compartmentHint = incoming.compartmentHint;
  if (!target.compartment && incoming.compartment) target.compartment = incoming.compartment;
  target.aliases = [...new Set([...(target.aliases || []), ...(incoming.aliases || [])])];
  target.entityIds = [...new Set([...(target.entityIds || []), ...(incoming.entityIds || [])])];
}

function buildReactionParticipants(options) {
  const knownNameIndex = options.knownNameIndex || buildKnownNameIndex(options.knownNames || []);
  const primary = [
    { ...options.substrate, role: 'substrate' },
    { ...options.product, role: 'product' }
  ].map(item => ({
    key: normalizeParticipantKey(item.name),
    name: item.name,
    rawName: item.name,
    aliases: [],
    role: item.role,
    coefficient: '1',
    qualifier: '',
    compartmentHint: item.compartmentHint || '',
    compartment: item.compartment || '',
    entityIds: item.entityId ? [item.entityId] : [],
    primary: true,
    source: 'endpoint'
  }));

  const parsed = parseEquation(options.equation, knownNameIndex);
  const merged = [];
  for (const participant of [...primary, ...parsed.participants]) {
    const location = participant.compartmentHint || participant.compartment || '';
    const existing = merged.find(item => {
      if (item.role !== participant.role || item.key !== participant.key) return false;
      const itemLocation = item.compartmentHint || item.compartment || '';
      return !location || !itemLocation || location === itemLocation;
    });
    if (!existing) merged.push({ ...participant });
    else mergeParticipant(existing, participant);
  }

  return { participants: merged, ignoredSegments: parsed.ignoredSegments };
}

module.exports = {
  STATIC_ALIASES,
  normalizeParticipantKey,
  buildKnownNameIndex,
  canonicalizeParticipantName,
  parseEquation,
  buildReactionParticipants
};
