#!/usr/bin/env node
// 把 data/*.tsv 编译成页面可直接使用的 data-compiled.js
// 用法: node tools/compile.js
const fs = require('fs');
const path = require('path');
const L = require('./layout.js');
const {
  buildKnownNameIndex,
  buildReactionParticipants,
  normalizeParticipantKey
} = require('./reaction-participants.js');
const { reactionIdentity } = require('./reaction-identity.js');
const { writeSplitFiles } = require('./split-compiled.js');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data');
const CHECK = process.argv.includes('--check');
const { nodes, computed, resolveComp, readTsv } = L;
const { buildExpertPathwayLayouts } = require('./expert-pathway-layout.js');
const {
  EXPERT_MITO_MEMBRANE_GUIDE,
  EXPERT_MITO_GUIDE_PATHWAYS,
  EXPERT_NITROGEN_GUIDE,
  EXPERT_NITROGEN_GUIDE_PATHWAYS,
  EXPERT_CYTOSOL_FOCUS_GUIDE,
  EXPERT_CYTOSOL_FOCUS_PATHWAYS,
  EXPERT_ER_MEMBRANE_GUIDE,
  EXPERT_ER_GUIDE_PATHWAYS,
  EXPERT_GLUCO_GUIDE,
  EXPERT_GLUCO_GUIDE_PATHWAYS
} = require('./expert-map-geometry.js');

// 区室 id -> 中文
const compZh = new Map();
for (const r of readTsv(path.join(DATA, 'compartments.tsv')).rows) {
  compZh.set(r.id, r['中文']);
}

const knownNameIndex = buildKnownNameIndex([...nodes.values()].map(node => node.name));
const entityIdsByParticipantKey = new Map();
for (const [entityId, node] of nodes) {
  const key = normalizeParticipantKey(node.name);
  if (!entityIdsByParticipantKey.has(key)) entityIdsByParticipantKey.set(key, []);
  entityIdsByParticipantKey.get(key).push(entityId);
}

function hydrateParticipants(result, defaultComp) {
  const participants = result.participants.map(participant => {
    const explicitComp = resolveComp(participant.compartmentHint);
    const candidateIds = entityIdsByParticipantKey.get(participant.key) || [];
    const entityIds = participant.entityIds?.length
      ? participant.entityIds
      : candidateIds.filter(entityId => {
          const node = nodes.get(entityId);
          return node && node.comp === (explicitComp || defaultComp);
        });
    const resolvedComp = explicitComp
      || (entityIds.length === 1 ? nodes.get(entityIds[0])?.comp : '')
      || defaultComp;
    return {
      ...participant,
      compartment: compZh.get(resolvedComp) || participant.compartmentHint || resolvedComp || '',
      entityIds: [...new Set(entityIds)]
    };
  });
  return { participants, ignoredSegments: result.ignoredSegments };
}

// 节点补充属性
const attrs = new Map();
const ndDir = path.join(DATA, 'nodes');
if (fs.existsSync(ndDir)) {
  for (const f of fs.readdirSync(ndDir).filter(x => x.endsWith('.tsv')).sort()) {
    for (const row of readTsv(path.join(ndDir, f)).rows) {
      const c = resolveComp(row['区室']);
      if (!c || !row['名称']) continue;
      attrs.set(row['名称'] + '@' + c, row);
    }
  }
}

// 节点类别推断
const CARRIER = /^复合体\s*(I|II|III|IV)$|ATP 合酶/;
function kindOf(name, a) {
  if (CARRIER.test(name)) return '酶复合体';
  if (/细胞色素|泛醇|辅酶\s*Q|NADH|FADH/.test(name)) return '电子载体';
  if (/^ATP|^ADP|^AMP|^GTP|^GDP/.test(name)) return '能量分子';
  if (/H⁺/.test(name)) return '电化学势载体';
  if (/^氧$|^O₂$/.test(name)) return '末端电子受体';
  if (a && /梯度|动力势/.test(a['备注'] || '')) return '能量状态';
  return '代谢物';
}

// ---- 读反应 ----
function splitAt(cell, def) {
  const at = cell.lastIndexOf('@');
  if (at === -1) return { name: cell, comp: def };
  return { name: cell.slice(0, at).trim(), comp: resolveComp(cell.slice(at + 1).trim()) || def };
}

const reactions = [];
const seen = new Map();          // 完整反应身份 -> reaction index
const nodePathways = new Map();  // nodeKey -> Set(通路中文名)
const nodeRoles = new Map();     // nodeKey -> {产物, 底物} 计数
const nodeOrigin = new Map();   // nodeKey -> {物种, 组织}，来自反应文件头部
let rid = 0;

const REVIEW_RANK = new Map([['待审校', 0], ['已核对', 1], ['已终审', 2]]);
function strongerReview(current, incoming) {
  return (REVIEW_RANK.get(incoming) ?? -1) > (REVIEW_RANK.get(current) ?? -1) ? incoming : current;
}

function mergeNotes(current, incoming) {
  return [...new Set(`${current || ''}；${incoming || ''}`.split('；').map(item => item.trim()).filter(Boolean))].join('；');
}

const rxDir = path.join(DATA, 'reactions');
const files = fs.existsSync(rxDir)
  ? fs.readdirSync(rxDir).filter(x => x.endsWith('.tsv')).sort() : [];

let skippedFiles = 0;   // 头部「默认区室」缺失/无法识别的文件
let skippedRows = 0;    // 底物或产物为空的行

for (const f of files) {
  const { meta: fm, rows } = readTsv(path.join(rxDir, f));
  const defComp = resolveComp(fm['默认区室']);
  if (!defComp) {
    console.error(`[compile] 跳过文件 ${f}: 头部「默认区室」缺失或无法识别 ("${fm['默认区室'] || ''}")`);
    skippedFiles++;
    continue;
  }
  const groupKey = f.replace(/\.tsv$/, '');
  const zhName = fm['通路'] || groupKey;

  for (const row of rows) {
    if (!row['底物'] || !row['产物']) {
      console.error(`[compile] 跳过 ${f} 第${row.__lineNumber}行: 底物或产物为空 (底物="${row['底物'] || ''}" 产物="${row['产物'] || ''}")`);
      skippedRows++;
      continue;
    }
    const s = splitAt(row['底物'], defComp);
    const p = splitAt(row['产物'], defComp);
    const fromKey = s.name + '@' + s.comp;
    const toKey = p.name + '@' + p.comp;
    const participantResult = hydrateParticipants(buildReactionParticipants({
      knownNameIndex,
      substrate: {
        name: s.name,
        entityId: fromKey,
        compartment: compZh.get(s.comp) || s.comp
      },
      product: {
        name: p.name,
        entityId: toKey,
        compartment: compZh.get(p.comp) || p.comp
      },
      equation: row['反应式'] || ''
    }), defComp);

    for (const [k, role] of [[fromKey, '底物'], [toKey, '产物']]) {
      if (!nodePathways.has(k)) nodePathways.set(k, new Set());
      nodePathways.get(k).add(zhName);
      // 文件头的物种/组织适用于该文件的全部节点，节点文件可以逐个覆盖
      if (fm['物种'] || fm['组织']) {
        const o = nodeOrigin.get(k) || {};
        if (fm['物种'] && !o['物种']) o['物种'] = fm['物种'];
        if (fm['组织'] && !o['组织']) o['组织'] = fm['组织'];
        nodeOrigin.set(k, o);
      }
      if (!nodeRoles.has(k)) nodeRoles.set(k, { 底物: 0, 产物: 0 });
      nodeRoles.get(k)[role]++;
    }

    const dedupe = reactionIdentity({
      from: fromKey,
      to: toKey,
      enzyme: row['酶'] || '',
      equation: row['反应式'] || '',
      reversible: row['可逆'] === '是'
    });
    if (seen.has(dedupe)) {
      const ex = reactions[seen.get(dedupe)];
      if (!ex.groups.includes(groupKey)) ex.groups.push(groupKey);
      if (!ex.pathwayNames.includes(zhName)) ex.pathwayNames.push(zhName);
      ex.review = strongerReview(ex.review, row['审校'] || '待审校');
      ex.note = mergeNotes(ex.note, row['备注'] || '');
      continue;
    }
    seen.set(dedupe, reactions.length);
    reactions.push({
      id: 'rx' + (++rid),
      from: fromKey, to: toKey,
      groups: [groupKey], pathwayNames: [zhName],
      enzyme: row['酶'] || '',
      equation: row['反应式'] || '',
      reversible: row['可逆'] === '是',
      review: row['审校'] || '待审校',
      note: row['备注'] || '',
      participants: participantResult.participants,
      ignoredSegments: participantResult.ignoredSegments
    });
  }
}

// 有跳过 = 编译产物不完整，必须显式失败，不许静默产出缺数据的 data-compiled.js
if (skippedFiles || skippedRows) {
  console.error(`[compile] 编译跳过汇总: ${skippedFiles} 个文件（默认区室缺失）、${skippedRows} 行（底物/产物为空）—— 数据不完整，编译中止`);
  process.exitCode = 1;
}

// ---- 拼节点 ----
function buildInfo(key, n, paths) {
  const outg = reactions.filter(r => r.from === key);
  const inc = reactions.filter(r => r.to === key);
  const enz = list => list.map(r => r.enzyme || '未标注酶').join('、');
  const bits = [];
  if (paths.length) bits.push('参与' + paths.join('、'));
  if (inc.length) bits.push('由' + enz(inc) + '生成');
  if (outg.length) bits.push('经' + enz(outg) + '转化');
  if (!bits.length) return '位于' + (compZh.get(n.comp) || n.comp) + '。';
  return bits.join('；') + '。';
}

const entities = [];
for (const [key, n] of nodes) {
  const pos = computed.get(key);
  if (!pos) continue;
  const a = attrs.get(key);
  const paths = [...(nodePathways.get(key) || [])];
  const roles = nodeRoles.get(key) || { 底物: 0, 产物: 0 };
  const groups = [...new Set(reactions
    .filter(r => r.from === key || r.to === key)
    .flatMap(r => r.groups))];

  const meta = {};
  if (paths.length) meta['参与通路'] = paths.join(' · ');
  meta['所在区室'] = compZh.get(n.comp) || n.comp;
  if (n.side) meta['膜侧'] = n.side;
  const origin = nodeOrigin.get(key) || {};
  const organism = (a && a['物种']) || origin['物种'];
  const tissue = (a && a['组织']) || origin['组织'];
  if (organism) meta['物种'] = organism;
  if (tissue) meta['组织'] = tissue;
  const roleBits = [];
  if (roles['产物']) roleBits.push(roles['产物'] + ' 条反应的产物');
  if (roles['底物']) roleBits.push(roles['底物'] + ' 条反应的底物');
  if (roleBits.length) meta['角色'] = roleBits.join('，');
  meta['坐标来源'] = pos.rule;
  if (a && a['备注']) meta['备注'] = a['备注'];

  entities.push({
    id: key,
    name: n.name,
    latin: a && a['别名'] ? a['别名'].split('|')[0] : '',
    kind: kindOf(n.name, a),
    group: groups.length ? groups : ['other'],
    compartment: compZh.get(n.comp) || n.comp,
    x: Math.round(pos.x),
    y: Math.round(pos.y),
    label: n.name,
    info: buildInfo(key, n, paths),
    meta
  });
}

// ---- 输出 ----
const outReactions = reactions.map(r => ({
  id: r.id, from: r.from, to: r.to,
  group: r.groups.length === 1 ? r.groups[0] : r.groups,
  enzyme: r.enzyme,
  equation: r.equation,
  reversible: r.reversible,
  review: r.review,
  participants: r.participants,
  ignoredSegments: r.ignoredSegments,
  info: (r.pathwayNames.join(' · ') || '') + (r.note ? '。' + r.note : '')
    + (['已核对', '已终审'].includes(r.review) ? '' : '（待审校）')
}));

const participantCatalogMap = new Map();
for (const reaction of reactions) {
  for (const participant of reaction.participants) {
    let entry = participantCatalogMap.get(participant.key);
    if (!entry) {
      entry = {
        key: participant.key,
        name: participant.name,
        aliases: new Set(),
        entityIds: new Set(),
        pathwayIds: new Set(),
        reactionIds: new Set(),
        occurrences: []
      };
      participantCatalogMap.set(participant.key, entry);
    }
    (participant.aliases || []).forEach(alias => entry.aliases.add(alias));
    participant.entityIds.forEach(entityId => entry.entityIds.add(entityId));
    reaction.groups.forEach(pathwayId => entry.pathwayIds.add(pathwayId));
    entry.reactionIds.add(reaction.id);
    entry.occurrences.push({
      reactionId: reaction.id,
      pathwayIds: [...reaction.groups],
      role: participant.role,
      source: participant.source,
      compartment: participant.compartment,
      entityIds: participant.entityIds
    });
  }
}
const participantCatalog = [...participantCatalogMap.values()].map(entry => ({
  ...entry,
  aliases: [...entry.aliases],
  entityIds: [...entry.entityIds],
  pathwayIds: [...entry.pathwayIds],
  reactionIds: [...entry.reactionIds]
}));

// 专家地图选中单条通路时使用独立布局，避免全局 293 个节点争抢同一套区室坐标。
const expertPathwayLayouts = buildExpertPathwayLayouts(entities, outReactions);
const expertMapGuides = {
  mitochondrialInnerMembrane: EXPERT_MITO_MEMBRANE_GUIDE,
  pathwayIds: EXPERT_MITO_GUIDE_PATHWAYS,
  nitrogenCompartment: EXPERT_NITROGEN_GUIDE,
  nitrogenPathwayIds: EXPERT_NITROGEN_GUIDE_PATHWAYS,
  cytosolFocus: EXPERT_CYTOSOL_FOCUS_GUIDE,
  cytosolFocusPathwayIds: EXPERT_CYTOSOL_FOCUS_PATHWAYS,
  endoplasmicReticulumMembrane: EXPERT_ER_MEMBRANE_GUIDE,
  erPathwayIds: EXPERT_ER_GUIDE_PATHWAYS,
  gluconeogenesisCrossCompartment: EXPERT_GLUCO_GUIDE,
  gluconeogenesisPathwayIds: EXPERT_GLUCO_GUIDE_PATHWAYS
};

// 通路元数据：筛选按钮由数据生成，新增通路文件即自动出现按钮
const TONES = ['#ecab47', '#e77a66', '#df8958', '#2f9eb5', '#826ab1',
  '#79a95f', '#7560af', '#d46f71', '#438eac', '#6fa6c2'];
const pathwayMeta = {};
let ti = 0;
for (const f of files) {
  const { meta: fm, metaFields: mf } = readTsv(path.join(rxDir, f));
  const key = f.replace(/\.tsv$/, '');
  const zh = fm['通路'] || key;
  // 头部「通路: 中文<TAB>English」的第二个字段就是英文名，
  // 旧代码两个分支都返回空串，英文名一直丢着。
  const en = (mf['通路'] || [])[1] || '';
  pathwayMeta[key] = {
    label: zh,
    english: en,
    tone: TONES[ti++ % TONES.length],
    compartment: fm['默认区室'] || '',
    source: fm['来源'] || ''
  };
}

const banner = '// 本文件由 tools/compile.js 从 data/*.tsv 生成，不要手改。\n'
  + '// 改数据请改 data/reactions/*.tsv 与 data/nodes/*.tsv，然后重跑 node tools/compile.js\n';
const body = 'window.METABOLIC_COMPILED = '
  + JSON.stringify({
    entities,
    reactions: outReactions,
    pathwayMeta,
    participantCatalog,
    expertPathwayLayouts,
    expertMapGuides
  }, null, 1) + ';\n';
const outputPath = path.join(ROOT, 'data-compiled.js');
const compiledOutput = banner + body;
if (CHECK) {
  const existingOutput = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8') : '';
  if (existingOutput !== compiledOutput) {
    console.error('data-compiled.js 与 TSV 不一致；请运行 node tools/compile.js 更新生成文件');
    process.exitCode = 1;
  }
} else {
  fs.writeFileSync(outputPath, compiledOutput, 'utf8');
  writeSplitFiles(ROOT);
}

console.log('=== 编译完成 ===');
console.log('节点 ' + entities.length + '  反应 ' + outReactions.length + '  通路 ' + Object.keys(pathwayMeta).length);
const byRule = {};
for (const e of entities) {
  const r = e.meta['坐标来源'];
  byRule[r] = (byRule[r] || 0) + 1;
}
console.log('坐标来源: ' + Object.entries(byRule).map(([k, v]) => k + ' ' + v).join('，'));
const pending = outReactions.filter(r => /待审校/.test(r.info)).length;
console.log('待审校反应: ' + pending + '/' + outReactions.length);
console.log('结构化参与物: ' + outReactions.reduce((sum, reaction) => sum + reaction.participants.length, 0)
  + ' 次，唯一参与物 ' + participantCatalog.length + ' 个，跨通路 '
  + participantCatalog.filter(entry => entry.pathwayIds.length > 1).length + ' 个');
console.log('未解析反应式片段: ' + outReactions.reduce((sum, reaction) => sum + reaction.ignoredSegments.length, 0));
console.log(CHECK ? '已只读核对 data-compiled.js' : '已写出 data-compiled.js');
