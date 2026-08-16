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

  // 审计用（错误链接检测）：未解析步骤的关键词整词命中这些 key 时直接
  // 视为说明性。纯区室/方位词（基质、胞质、内质网…）与常见泛词（过程、
  // 途径、循环…以及 载体/交换/降解 等功能动词）不能作为“文本含可命中
  // 目录名称”的证据。
  const AUDIT_EXCLUDE_KEYS = new Set([
    '基质', '胞质', '细胞质', '膜间隙', '内膜', '外膜', '内质网', '溶酶体',
    '高尔基体', '过氧化物酶体', '胞外', '细胞外', '线粒体',
    '过程', '途径', '反应', '代谢', '底物', '产物', '循环', '通道', '载体',
    '转运', '运输', '交换', '降解', '水解', '氧化', '还原', '合成', '生成',
    '消耗', '回收', '延伸', '修饰', '单位', '继续', '进入', '输出', '输入',
    '催化', '结合', '受体', '中间', '酶'
  ]);
  // 类称目录节点（氨基酸池、核苷酸池）：出现在更长未解析词组里属于类别
  // 用法而非对节点的引用；仅子串模式排除，完全相等仍算命中。
  const AUDIT_CLASS_TERMS = new Set(['核苷酸', '氨基酸']);

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
    if (/外膜/.test(text)) hints.push('线粒体外膜');
    if (/内膜/.test(text)) hints.push('线粒体内膜');
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
    const parentheticalTerms = raw.match(/[（(]([^）)]+)[）)]/g) || [];
    parentheticalTerms.forEach(value => {
      const inner = value.slice(1, -1).trim();
      if (inner) values.add(inner);
    });
    const pathwayPrefixStripped = raw.replace(/^(?:呼吸链|线粒体|细胞质|胞质)·?/, '').trim();
    if (pathwayPrefixStripped && !/^(?:基质|胞质|细胞质|膜间隙|外膜|内膜)$/.test(pathwayPrefixStripped)) {
      values.add(pathwayPrefixStripped);
    }
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

  function allReactions(options) {
    return Array.isArray(options.reactions) ? options.reactions : [];
  }

  function findEntity(options) {
    const keywords = stepKeywords(options.step);
    const keywordKeys = new Set(keywords.map(nameKey).filter(Boolean));
    const primaryKey = nameKey(options.step);
    const hints = compartmentHintsFor(options.step);
    const reactionIds = new Set(pathwayReactions(options).flatMap(reaction => [reaction.from, reaction.to]));
    const matchesKeywords = entity => {
      const fields = [entity.name, entity.label, entity.latin].filter(Boolean);
      const fieldKeys = fields.map(nameKey).filter(Boolean);
      return fieldKeys.some(fieldKey => [...keywordKeys].some(keywordKey =>
        keywordKey.length > 1 && (fieldKey === keywordKey || fieldKey.includes(keywordKey) || keywordKey.includes(fieldKey))
      ));
    };
    const localCandidates = (options.entities || []).filter(entity => {
      if (!groupMatches(entity, options.pathwayId, options.routeGroup)) return false;
      return matchesKeywords(entity);
    });
    // 明确写出的区室优先于通路分组。丙酮酸在 PDH 前置步骤中同时
    // 有胞质实例和基质实例，不能因为 PDH 组只登记了后者就选错端点。
    const globalCompartmentCandidates = hints.length
      ? (options.entities || []).filter(entity => matchesKeywords(entity)
        && hints.some(hint => String(entity.compartment || '').includes(hint)))
      : [];
    const candidates = [...new Map([...localCandidates, ...globalCompartmentCandidates].map(item => [item.id, item])).values()];
    const score = entity => {
      const fieldKeys = [entity.name, entity.label, entity.latin].map(nameKey).filter(Boolean);
      const primaryExact = fieldKeys.some(key => key === primaryKey) ? 70 : 0;
      const exact = fieldKeys.some(key => keywordKeys.has(key)) ? 30 : 0;
      const endpoint = reactionIds.has(entity.id) ? 8 : 0;
      const compartment = hints.some(hint => String(entity.compartment || '').includes(hint)) ? 45 : 0;
      const group = groupMatches(entity, options.pathwayId, options.routeGroup) ? 8 : 0;
      return primaryExact + exact + endpoint + compartment + group + (entity.detail ? 0 : 1);
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
    const explicitCompartment = compartmentHintsFor(options.step).length > 0;
    const entityEndpoint = Boolean(entity && (reaction.from === entity.id || reaction.to === entity.id));
    // 一个代谢物同时连接生成与消耗反应时，点击该学习节点优先解释
    // “它是怎样形成的”；入口底物没有生成边时仍自然落到消耗反应。
    let score = entityEndpoint ? 40 + (reaction.to === entity?.id ? 6 : 0) : 0;
    for (const key of keys) {
      if (fields.enzyme === key) score = Math.max(score, 38);
      else if (fields.enzyme && (fields.enzyme.includes(key) || key.includes(fields.enzyme))) score = Math.max(score, 32);
      // 同名物质可能有多个区室实例；当步骤明确写出区室时，
      // 不能仅凭“丙酮酸”这三个字把胞质节点接到基质反应。
      if (!entity || !explicitCompartment) {
        if (fields.from === key || fields.to === key) score = Math.max(score, 28);
      }
      if (!entity || !explicitCompartment || entityEndpoint) {
        if (fields.equation.includes(key)) score = Math.max(score, 20);
      }
    }
    return score;
  }

  function findReaction(options, entity = null) {
    const records = options.ignoreGroup ? allReactions(options) : pathwayReactions(options);
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
    // 位置只能用于同样有语义命中的候选之间打破平局。
    // 对“交换/入口/基质”这类说明性步骤，不能因为刚好排在末尾就伪装成某个反应。
    return ranked[0]?.score > 0 ? ranked[0].reaction : null;
  }

  function resolveStep(options) {
    const keywords = stepKeywords(options.step);
    const stepText = String(options.step || '');
    const catalystLike = /(?:酶|载体|转位|通道|复合体)/.test(stepText) && !/辅酶/.test(stepText);
    const localCatalystReaction = catalystLike ? findReaction(options, null) : null;
    // 学习步骤可以跨通路引用入口转运反应。只有酶/载体名称真正命中时，
    // 才允许跨组查找；不再用组内位置插值猜测。
    const catalystReaction = localCatalystReaction || (catalystLike ? findReaction({ ...options, ignoreGroup: true }, null) : null);
    const catalystKey = nameKey(catalystReaction?.enzyme);
    const catalystMatch = catalystLike && keywords.map(nameKey).some(key =>
      key.length > 1 && catalystKey && (catalystKey === key || catalystKey.includes(key) || key.includes(catalystKey))
    );
    const entity = catalystMatch ? null : findEntity(options);
    const reaction = catalystMatch
      ? catalystReaction
      : findReaction(options, entity);
    const enzymeKey = nameKey(reaction?.enzyme);
    const isEnzyme = !entity && keywords.map(nameKey).some(key =>
      key.length > 1 && enzymeKey && (enzymeKey.includes(key) || key.includes(enzymeKey))
    );
    return {
      entity,
      reaction,
      kind: entity ? 'metabolite' : (isEnzyme ? 'enzyme' : 'process')
    };
  }

  // 错误链接检测：未解析步骤的文本是否含可命中目录的名称。
  // 目录名称来源：实体 name/label/latin（数据无 shortName 字段）、
  // 反应 enzyme。匹配保守：① 完全相等（最强信号，不受排除词影响）；
  // ② 目录名称 key 是关键词 key 的子串——要求目录名 ≥3 字，避免
  // “核苷/尿素/腺苷/胞苷”这类 2 字词干嵌入长词组时的词素误配；
  // 类称节点（AUDIT_CLASS_TERMS）不参与子串模式。
  function auditNameHits(entities, reactions, step) {
    const entityKeys = new Set();
    (entities || []).forEach(entity => {
      [entity.name, entity.label, entity.latin].filter(Boolean).forEach(value => {
        const key = nameKey(value);
        if (key && key.length >= 2) entityKeys.add(key);
      });
    });
    const enzymeKeys = new Set();
    (reactions || []).forEach(reaction => {
      const key = nameKey(reaction.enzyme);
      if (key && key.length >= 2) enzymeKeys.add(key);
    });
    const hits = [];
    stepKeywords(step).forEach(keyword => {
      const keywordKey = nameKey(keyword);
      if (!keywordKey || keywordKey.length < 2 || AUDIT_EXCLUDE_KEYS.has(keywordKey)) return;
      if (entityKeys.has(keywordKey) || enzymeKeys.has(keywordKey)) {
        hits.push({ keywordKey, mode: 'exact' });
        return;
      }
      let best = null;
      [entityKeys, enzymeKeys].forEach(keys => {
        keys.forEach(catalogKey => {
          if (catalogKey.length < 3 || AUDIT_CLASS_TERMS.has(catalogKey)) return;
          if (keywordKey.includes(catalogKey) && (!best || catalogKey.length > best.length)) best = catalogKey;
        });
      });
      if (best) hits.push({ keywordKey, mode: 'substr', catalogKey: best });
    });
    return hits;
  }

  function auditPathways(options) {
    const result = { total: 0, metabolite: 0, enzyme: 0, process: 0, missing: [], unlinked: [] };
    for (const [pathwayId, pathway] of Object.entries(options.pathways || {})) {
      const routeGroup = options.routeGroups?.[pathwayId] || pathway.routeGroup || null;
      const steps = Array.isArray(pathway.steps) ? pathway.steps : [];
      steps.forEach((step, index) => {
        const target = resolveStep({ ...options, pathwayId, pathway, routeGroup, step, index, stepCount: steps.length });
        result.total++;
        if (!target.reaction && !target.entity) {
          // 说明性步骤可以没有可定位的单一实体/反应；关键规则是不能
          // 用位置插值伪造一个链接。它们进入可见台账，不作为错误交互。
          result.unlinked.push({ pathwayId, pathway: pathway.name, step });
          result.process++;
          // 错误链接检测：文本含可命中目录的名称（实体 name/label/latin
          // 或反应酶名）却仍解析失败，说明存在命名缺口或文本与目录脱节。
          // 命中项保留在 unlinked 中（保持内部兼容），同时记入 missing 供审阅。
          const hits = auditNameHits(options.entities, options.reactions, step);
          if (hits.length) {
            result.missing.push({ pathwayId, pathway: pathway.name, step, hits });
          }
        } else {
          result[target.kind]++;
        }
      });
    }
    return result;
  }

  return { aliasesByShortName, nameKey, stepKeywords, findEntity, findReaction, resolveStep, auditPathways };
}));
