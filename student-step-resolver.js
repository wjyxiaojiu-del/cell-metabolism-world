(function attachStudentStepResolver(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.STUDENT_STEP_RESOLVER = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function createStudentStepResolver() {
  const ALIAS_ENTRIES = [
    ['G6P', '葡萄糖-6-磷酸'], ['F6P', '果糖-6-磷酸'],
    ['F-1,6-BP', '果糖-1,6-二磷酸'], ['F1,6BP', '果糖-1,6-二磷酸'],
    ['F1P', '果糖-1-磷酸'], ['DHAP', '磷酸二羟丙酮'],
    ['G3P', '甘油醛-3-磷酸'], ['G1P', '葡萄糖-1-磷酸'],
    ['1,3-BPG', '1,3-二磷酸甘油酸'], ['3-PG', '3-磷酸甘油酸'],
    ['2-PG', '2-磷酸甘油酸'], ['PEP', '磷酸烯醇式丙酮酸'],
    ['OAA', '草酰乙酸'], ['alpha-KG', 'α-酮戊二酸'], ['α-KG', 'α-酮戊二酸'],
    ['Ru5P', '核酮糖-5-磷酸'], ['R5P', '核糖-5-磷酸'], ['X5P', '木酮糖-5-磷酸'],
    ['Gal-1-P', '半乳糖-1-磷酸'], ['UDP-Gal', 'UDP-半乳糖'], ['UDP-Glc', 'UDP-葡萄糖'],
    ['甘油-3-P', '甘油-3-磷酸'], ['CoQ', '辅酶 Q'], ['CoQH2', '泛醇'], ['CoQH₂', '泛醇'],
    ['Pi', '无机磷酸'], ['H+梯度', '质子动力势'], ['H⁺梯度', '质子动力势'],
    ['NO3-', '硝酸盐'], ['NO₃⁻', '硝酸盐'], ['NO2-', '亚硝酸盐'], ['NO₂⁻', '亚硝酸盐'],
    ['SO4²-', '硫酸盐'], ['SO₄²⁻', '硫酸盐'], ['SO3²-', '亚硫酸盐'], ['SO₃²⁻', '亚硫酸盐'],
    ['S²-', '硫化物'], ['S²⁻', '硫化物'], ['H2O2', 'H₂O₂'], ['O2', '氧'], ['O₂', '氧'],
    ['ATP基质', 'ATP'], ['ATP胞质', 'ATP'], ['ADP基质', 'ADP'], ['ADP胞质', 'ADP'],
    ['丙酮酸基质', '丙酮酸'], ['丙酮酸胞质', '丙酮酸'],
    ['苹果酸基质', '苹果酸'], ['苹果酸胞质', '苹果酸'], ['脂酰-CoA基质', '脂酰-CoA']
  ];

  function nameKey(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/辅酶\s*a/gi, 'coa')
      .replace(/[‐‑‒–—−]/g, '-')
      .replace(/[\s\-_/,，、()（）@↔⇌→]/g, '');
  }

  const aliasByKey = new Map(ALIAS_ENTRIES.map(([alias, canonical]) => [nameKey(alias), canonical]));
  const aliasesByShortName = ALIAS_ENTRIES.reduce((result, [alias, canonical]) => {
    result[String(alias).toLowerCase()] = [alias, canonical];
    return result;
  }, {});

  function groupsFor(item) {
    if (Array.isArray(item?.group)) return item.group;
    return String(item?.group || '').trim().split(/[\s,]+/).filter(Boolean);
  }

  function groupMatches(item, pathwayId, routeGroup) {
    const groups = groupsFor(item);
    return groups.includes(pathwayId) || Boolean(routeGroup && groups.includes(routeGroup));
  }

  function compartmentHintsFor(step) {
    const text = String(step || '');
    const hints = [];
    if (/胞质|细胞质/.test(text)) hints.push('细胞质');
    if (/基质/.test(text)) hints.push('线粒体基质');
    if (/膜间隙/.test(text)) hints.push('线粒体膜间隙');
    if (/内质网/.test(text)) hints.push('内质网');
    if (/胞外|细胞外/.test(text)) hints.push('胞外');
    return hints;
  }

  function stepKeywords(step) {
    const raw = String(step || '').trim();
    const values = new Set([raw]);
    raw.split(/\s*(?:\/|／|\+|＋|→|⇌|↔|、|\b(?:and|or)\b)\s*/i).forEach(value => {
      if (value) values.add(value);
    });
    const stripped = raw
      .replace(/^(?:胞质|细胞质|线粒体)\s*/, '')
      .replace(/(?:线粒体基质|基质|胞质|细胞质|膜间隙|胞外)$/, '')
      .trim();
    if (stripped) values.add(stripped);
    const geneTokens = raw.match(/[A-Za-z][A-Za-z0-9]{2,}/g) || [];
    geneTokens.forEach(value => values.add(value));

    const rawKey = nameKey(raw);
    for (const [aliasKey, canonical] of aliasByKey) {
      if (aliasKey && rawKey.includes(aliasKey)) values.add(canonical);
    }
    [...values].forEach(value => {
      const canonical = aliasByKey.get(nameKey(value));
      if (canonical) values.add(canonical);
    });
    return [...values].filter(Boolean);
  }

  function pathwayReactions(options) {
    return (options.reactions || []).filter(reaction => groupMatches(reaction, options.pathwayId, options.routeGroup));
  }

  function findEntity(options) {
    const keywords = stepKeywords(options.step);
    const keywordKeys = new Set(keywords.map(nameKey).filter(Boolean));
    const hints = compartmentHintsFor(options.step);
    const reactionIds = new Set(pathwayReactions(options).flatMap(reaction => [reaction.from, reaction.to]));
    const candidates = (options.entities || []).filter(entity => {
      if (!groupMatches(entity, options.pathwayId, options.routeGroup)) return false;
      const fields = [entity.name, entity.label, entity.latin].filter(Boolean);
      const fieldKeys = fields.map(nameKey).filter(Boolean);
      return fieldKeys.some(fieldKey => [...keywordKeys].some(keywordKey =>
        keywordKey.length > 1 && (fieldKey === keywordKey || fieldKey.includes(keywordKey) || keywordKey.includes(fieldKey))
      ));
    });
    const score = entity => {
      const fieldKeys = [entity.name, entity.label, entity.latin].map(nameKey).filter(Boolean);
      const exact = fieldKeys.some(key => keywordKeys.has(key)) ? 30 : 0;
      const endpoint = reactionIds.has(entity.id) ? 8 : 0;
      const compartment = hints.some(hint => String(entity.compartment || '').includes(hint)) ? 6 : 0;
      return exact + endpoint + compartment + (entity.detail ? 0 : 1);
    };
    return candidates.sort((a, b) => score(b) - score(a))[0] || null;
  }

  function reactionKeywordScore(reaction, options, entity, keywords) {
    const entityById = options.entityById || Object.fromEntries((options.entities || []).map(item => [item.id, item]));
    const fields = {
      enzyme: nameKey(reaction.enzyme),
      equation: nameKey(reaction.equation),
      from: nameKey(entityById[reaction.from]?.name),
      to: nameKey(entityById[reaction.to]?.name)
    };
    const keys = keywords.map(nameKey).filter(key => key.length > 1);
    let score = entity && (reaction.from === entity.id || reaction.to === entity.id) ? 40 : 0;
    for (const key of keys) {
      if (fields.enzyme === key) score = Math.max(score, 38);
      else if (fields.enzyme && (fields.enzyme.includes(key) || key.includes(fields.enzyme))) score = Math.max(score, 32);
      if (fields.from === key || fields.to === key) score = Math.max(score, 28);
      if (fields.equation.includes(key)) score = Math.max(score, 20);
    }
    return score;
  }

  function findReaction(options, entity = null) {
    const records = pathwayReactions(options);
    if (!records.length) return null;
    const keywords = stepKeywords(options.step);
    const expectedIndex = options.stepCount > 1
      ? Math.round((options.index || 0) / (options.stepCount - 1) * (records.length - 1))
      : 0;
    const ranked = records.map((reaction, index) => ({
      reaction,
      score: reactionKeywordScore(reaction, options, entity, keywords),
      distance: Math.abs(index - expectedIndex)
    })).sort((a, b) => b.score - a.score || a.distance - b.distance);
    return ranked[0]?.reaction || records[expectedIndex] || records[0];
  }

  function resolveStep(options) {
    const entity = findEntity(options);
    const reaction = findReaction(options, entity);
    const enzymeKey = nameKey(reaction?.enzyme);
    const isEnzyme = !entity && stepKeywords(options.step).map(nameKey).some(key =>
      key.length > 1 && enzymeKey && (enzymeKey.includes(key) || key.includes(enzymeKey))
    );
    return {
      entity,
      reaction,
      kind: entity ? 'metabolite' : (isEnzyme ? 'enzyme' : 'process')
    };
  }

  function auditPathways(options) {
    const result = { total: 0, metabolite: 0, enzyme: 0, process: 0, missing: [] };
    for (const [pathwayId, pathway] of Object.entries(options.pathways || {})) {
      const routeGroup = options.routeGroups?.[pathwayId] || pathway.routeGroup || null;
      const steps = Array.isArray(pathway.steps) ? pathway.steps : [];
      steps.forEach((step, index) => {
        const target = resolveStep({ ...options, pathwayId, pathway, routeGroup, step, index, stepCount: steps.length });
        result.total++;
        if (!target.reaction && !target.entity) result.missing.push({ pathwayId, pathway: pathway.name, step });
        else result[target.kind]++;
      });
    }
    return result;
  }

  return { aliasesByShortName, nameKey, stepKeywords, findEntity, findReaction, resolveStep, auditPathways };
}));
