#!/usr/bin/env node
// 转录校验器。用法: node tools/validate.js
// 检查区室枚举、酶被误当节点、重复反应、悬空引用，并汇总节点数。
const fs = require('fs');
const path = require('path');
const { reactionIdentity } = require('./reaction-identity.js');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data');

const { readTsv } = require('./tsv.js');
const {
  buildKnownNameIndex,
  buildReactionParticipants,
  normalizeParticipantKey
} = require('./reaction-participants.js');

// ---- compartment enum ----
const comp = readTsv(path.join(DATA, 'compartments.tsv'));
const zh2id = new Map();
const id2zh = new Map();
const validIds = new Set();
for (const r of comp.rows) {
  validIds.add(r.id);
  id2zh.set(r.id, r['中文']);
  zh2id.set(r.id, r.id);
  zh2id.set(r['中文'], r.id);
  for (const s of (r['同义词'] || '').split('|')) {
    if (s.trim()) zh2id.set(s.trim(), r.id);
  }
}

function resolveComp(name) {
  return zh2id.get((name || '').trim()) || null;
}

// 酶名特征。载体复合体是例外：电子/质子穿过它们，所以它们是节点。
const ENZYME_LIKE = /酶$|酶复合体$|激酶$|变位酶$|异构酶$|脱氢酶$|合酶$|还原酶$|氧化酶$|水解酶$|转移酶$|裂解酶$|羧化酶$/;
const CARRIER_NODE = /^复合体\s*(I|II|III|IV|Ⅰ|Ⅱ|Ⅲ|Ⅳ)$|细胞色素|泛醇|辅酶\s*Q|质子动力势/;

const errors = [];
const warnings = [];
const pending = [];   // 还没被反应用到的节点：属于进度，不是问题
const shared = [];    // 同一反应被多条通路共享：正常现象，仅作汇报
const nodes = new Map();   // "name@comp" -> {name, comp, files:Set}
const seen = new Map();    // 完整反应身份 -> {file, line, idx}
const endpointSeen = new Map(); // from>>to -> [{file, line, idx, identity}]
const REVIEW_STATES = ['待审校', '已核对', '已终审'];
const PLANT_ONLY_COMPARTMENTS = new Set(['plastid', 'glyoxysome']);

function nodeKey(name, comp) { return name + '@' + comp; }

// 名称后可写 @区室 覆盖文件默认值
function splitAt(cell, defComp, file, ln) {
  const at = cell.lastIndexOf('@');
  if (at === -1) return { name: cell, comp: defComp };
  const name = cell.slice(0, at).trim();
  const raw = cell.slice(at + 1).trim();
  const comp = resolveComp(raw);
  if (!comp) errors.push(`${file}:${ln} 未知区室 "${raw}"（不在 compartments.tsv 里）`);
  return { name, comp: comp || defComp };
}

// 名字是否算节点，由 data/nodes/*.tsv 的声明决定，而不是靠正则猜。
// CARRIER_NODE 只是常见载体的兜底，避免每加一个复合体就要改代码。
function checkSide(name, col, file, ln) {
  if (!ENZYME_LIKE.test(name)) return;
  if (CARRIER_NODE.test(name)) return;
  if (declaredNames.has(name)) return;
  errors.push(`${file}:${ln} "${name}" 像酶，却出现在${col}列 → 若它确实是节点（有电子/质子穿过），`
    + `请在 data/nodes/ 里声明；否则应填到「酶」列`);
}

// ---- 节点补充文件（必须先于反应读取：声明过的名字才算合法节点）----
const SIDES = ['基质侧', '膜间隙侧', '胞质侧', '两侧', '腔侧', '胞外侧'];
const nodeDir = path.join(DATA, 'nodes');
const nodeMeta = new Map();
const declaredNames = new Set();
if (fs.existsSync(nodeDir)) {
  for (const f of fs.readdirSync(nodeDir).filter(x => x.endsWith('.tsv')).sort()) {
    const { rows } = readTsv(path.join(nodeDir, f));
    for (const row of rows) {
      const ln = row.__lineNumber;
      const name = row['名称'];
      if (!name) { errors.push(`${f} 第${ln}行 名称为空`); continue; }
      const comp = resolveComp(row['区室']);
      if (!comp) {
        errors.push(`${f} 第${ln}行 未知区室 "${row['区室'] || ''}"`);
        continue;
      }
      const side = row['膜侧'];
      if (side && !SIDES.includes(side)) {
        errors.push(`${f} 第${ln}行 膜侧只能是 ${SIDES.join('/')}，实际 "${side}"`);
      }
      const k = nodeKey(name, comp);
      if (nodeMeta.has(k)) errors.push(`${f} 第${ln}行 节点重复定义: ${name}@${row['区室']}`);
      nodeMeta.set(k, {
        name, comp, side: side || '', alias: row['别名'] || '',
        organism: row['物种'] || '', tissue: row['组织'] || '',
        note: row['备注'] || '', file: f, line: ln
      });
      declaredNames.add(name);
      if (!nodes.has(k)) nodes.set(k, { name, comp, files: new Set([f]) });
    }
  }
}

// 默认校验 data/reactions，可传目录用于自测
const reactionDir = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(DATA, 'reactions');
let files = [];
if (!fs.existsSync(reactionDir)) {
  errors.push(`反应目录不存在: ${reactionDir}`);
} else if (!fs.statSync(reactionDir).isDirectory()) {
  errors.push(`反应数据路径不是目录: ${reactionDir}`);
} else {
  files = fs.readdirSync(reactionDir).filter(f => f.endsWith('.tsv')).sort();
  if (!files.length) errors.push(`反应目录中没有 TSV 文件: ${reactionDir}`);
}

const allReactions = [];
for (const f of files) {
  const full = path.join(reactionDir, f);
  const { meta, header, rows } = readTsv(full);
  const organism = (meta['物种'] || '').trim();
  let firstPlantEndpointLine = null;
  const defRaw = meta['默认区室'];
  const defComp = resolveComp(defRaw);
  if (!defComp) {
    errors.push(`${f} 头部「默认区室」缺失或无法识别: "${defRaw || ''}"`);
    continue;
  }
  for (const need of ['底物', '产物']) {
    if (!header.includes(need)) errors.push(`${f} 缺少必需列「${need}」`);
  }
  for (const row of rows) {
    const ln = row.__lineNumber;
    const sRaw = row['底物'], pRaw = row['产物'];
    if (!sRaw || !pRaw) {
      errors.push(`${f} 第${ln}行 底物或产物为空`);
      continue;
    }
    const s = splitAt(sRaw, defComp, f, ln);
    const p = splitAt(pRaw, defComp, f, ln);
    if (!firstPlantEndpointLine && [s.comp, p.comp].some(compartment => PLANT_ONLY_COMPARTMENTS.has(compartment))) {
      firstPlantEndpointLine = ln;
    }
    checkSide(s.name, '底物', f, ln);
    checkSide(p.name, '产物', f, ln);
    if (!row['酶']) warnings.push(`${f} 第${ln}行 酶为空: ${s.name} → ${p.name}`);
    const rev = row['可逆'];
    if (rev && !['是', '否'].includes(rev)) {
      errors.push(`${f} 第${ln}行 可逆列只能填「是」或「否」，实际 "${rev}"`);
    }
    const review = row['审校'];
    if (!REVIEW_STATES.includes(review)) {
      errors.push(`${f} 第${ln}行 审校列只能填「${REVIEW_STATES.join('」「')}」，实际 "${review || ''}"`);
    }
    const equation = row['反应式'] || '';
    const hasReversibleArrow = /⇌|↔/.test(equation);
    const hasForwardArrow = /→/.test(equation);
    if (rev === '是' && hasForwardArrow && !hasReversibleArrow) {
      errors.push(`${f} 第${ln}行 标记为可逆，但反应式只使用单向箭头`);
    }
    if (rev === '否' && hasReversibleArrow) {
      errors.push(`${f} 第${ln}行 标记为不可逆，但反应式使用可逆箭头`);
    }
    const endpointKey = nodeKey(s.name, s.comp) + '>>' + nodeKey(p.name, p.comp);
    const identity = reactionIdentity({
      from: nodeKey(s.name, s.comp),
      to: nodeKey(p.name, p.comp),
      enzyme: row['酶'] || '',
      equation,
      reversible: rev === '是'
    });
    const prev = seen.get(identity);
    if (prev && prev.file === f) {
      errors.push(`${f} 第${ln}行 与第${prev.line}行 完全重复: ${s.name} → ${p.name}`);
    } else if (prev) {
      const merged = allReactions[prev.idx];
      const label = meta['通路'] || f.replace(/\.tsv$/, '');
      if (!merged.pathways.includes(label)) merged.pathways.push(label);
      shared.push(`${s.name} → ${p.name}：${merged.pathways.join(' + ')}`);
      continue;
    } else {
      const variants = endpointSeen.get(endpointKey) || [];
      if (variants.length) {
        const first = variants[0];
        warnings.push(`${f} 第${ln}行 与 ${first.file} 第${first.line}行 端点相同但反应内容不同，编译时分别保留`);
      }
      seen.set(identity, { file: f, line: ln, idx: allReactions.length });
      variants.push({ file: f, line: ln, idx: allReactions.length, identity });
      endpointSeen.set(endpointKey, variants);
    }
    for (const n of [s, p]) {
      const k = nodeKey(n.name, n.comp);
      if (!nodes.has(k)) nodes.set(k, { name: n.name, comp: n.comp, files: new Set() });
      nodes.get(k).files.add(f);
    }
    allReactions.push({
      file: f, line: ln, pathways: [meta['通路'] || f.replace(/\.tsv$/, '')],
      from: s, to: p, enzyme: row['酶'] || '', reversible: rev === '是',
      equation: row['反应式'] || '', review: row['审校'] || '', note: row['备注'] || '', organism
    });
  }
  if (firstPlantEndpointLine && organism !== '植物') {
    errors.push(`${f} 第${firstPlantEndpointLine}行 使用植物特异区室，但文件头缺少「#\t物种: 植物」`);
  }
}

// 节点补充信息指向了不存在的反应端点 → 大概率是名称或区室写错
for (const [k, m] of nodeMeta) {
  const used = allReactions.some(reaction => nodeKey(reaction.from.name, reaction.from.comp) === k
    || nodeKey(reaction.to.name, reaction.to.comp) === k);
  if (!used) pending.push(`${m.name}@${m.comp}`);
}

// ---- 手工坐标覆盖 ----
// 单独成文件，全是数字列。这样漏打制表符不会把备注挤进坐标。
const VIEW_W = 1600, VIEW_H = 1200;
const overrides = new Map();
const ovFile = path.join(DATA, 'layout-overrides.tsv');
if (fs.existsSync(ovFile)) {
  const { rows } = readTsv(ovFile);
  const base = path.basename(ovFile);
  for (const row of rows) {
    const ln = row.__lineNumber;
    const name = row['名称'];
    if (!name) { errors.push(`${base} 第${ln}行 名称为空`); continue; }
    const comp = resolveComp(row['区室']);
    if (!comp) { errors.push(`${base} 第${ln}行 未知区室 "${row['区室'] || ''}"`); continue; }
    const bad = [];
    for (const axis of ['x', 'y']) {
      const v = row[axis];
      if (!v) { bad.push(`${axis} 为空`); continue; }
      if (!/^-?\d+(\.\d+)?$/.test(v)) {
        bad.push(`${axis} 应是数字，实际 "${v}" —— 通常是漏打了制表符`);
        continue;
      }
      const n = Number(v);
      const max = axis === 'x' ? VIEW_W : VIEW_H;
      if (n < 0 || n > max) bad.push(`${axis}=${n} 超出画布 0-${max}`);
    }
    if (bad.length) { errors.push(`${base} 第${ln}行 ${bad.join('；')}`); continue; }
    const k = nodeKey(name, comp);
    if (overrides.has(k)) errors.push(`${base} 第${ln}行 坐标重复定义: ${name}@${row['区室']}`);
    overrides.set(k, { name, comp, x: Number(row['x']), y: Number(row['y']) });
    if (!nodes.has(k)) nodes.set(k, { name, comp, files: new Set([base]) });
  }
  for (const [k, o] of overrides) {
    const used = [...seen.keys()].some(key => key.includes(k));
    if (!used) pending.push(`${o.name}@${o.comp}`);
  }
}

// 同一物质跨区室 → 自动互链（PortalLink 免费得到）
const baseGroups = new Map();
for (const n of nodes.values()) {
  if (!baseGroups.has(n.name)) baseGroups.set(n.name, []);
  baseGroups.get(n.name).push(n.comp);
}
const multiComp = [...baseGroups.entries()].filter(([, cs]) => new Set(cs).size > 1);

// ---- 反应参与物数据契约 ----
const knownNameIndex = buildKnownNameIndex([...nodes.values()].map(node => node.name));
const knownEntityKeys = new Set([...nodes.values()].map(node => normalizeParticipantKey(node.name)));
const participantKeys = new Set();
const textOnlyParticipantKeys = new Set();
const participantPathways = new Map();
let participantOccurrences = 0;
let ignoredEquationSegments = 0;
for (const reaction of allReactions) {
  const result = buildReactionParticipants({
    knownNameIndex,
    substrate: {
      name: reaction.from.name,
      entityId: nodeKey(reaction.from.name, reaction.from.comp),
      compartment: id2zh.get(reaction.from.comp) || reaction.from.comp
    },
    product: {
      name: reaction.to.name,
      entityId: nodeKey(reaction.to.name, reaction.to.comp),
      compartment: id2zh.get(reaction.to.comp) || reaction.to.comp
    },
    equation: reaction.equation
  });
  const label = `${reaction.file} 第${reaction.line}行`;
  const substrates = result.participants.filter(item => item.role === 'substrate');
  const products = result.participants.filter(item => item.role === 'product');
  if (!substrates.length || !products.length) errors.push(`${label} 结构化参与物缺少底物或产物`);
  for (const [endpoint, role] of [[reaction.from, 'substrate'], [reaction.to, 'product']]) {
    const endpointKey = normalizeParticipantKey(endpoint.name);
    const found = result.participants.some(item => item.role === role && item.key === endpointKey
      && item.primary && item.source === 'endpoint');
    if (!found) errors.push(`${label} TSV 主端点 ${endpoint.name} 未保留在结构化参与物中`);
  }
  for (const participant of result.participants) {
    if (!participant.key || !participant.name) errors.push(`${label} 存在名称或 key 为空的参与物`);
    if (!['substrate', 'product'].includes(participant.role)) errors.push(`${label} 参与物角色非法: ${participant.role}`);
    if (!['endpoint', 'equation'].includes(participant.source)) errors.push(`${label} 参与物来源非法: ${participant.source}`);
    participantOccurrences++;
    participantKeys.add(participant.key);
    if (!knownEntityKeys.has(participant.key)) textOnlyParticipantKeys.add(participant.key);
    if (!participantPathways.has(participant.key)) participantPathways.set(participant.key, new Set());
    reaction.pathways.forEach(pathway => participantPathways.get(participant.key).add(pathway));
  }
  ignoredEquationSegments += result.ignoredSegments.length;
}
const crossPathwayParticipants = [...participantPathways.values()].filter(pathways => pathways.size > 1).length;

console.log('=== 转录校验 ===');
console.log(`区室枚举: ${validIds.size} 个叶区室, ${zh2id.size} 个可识别写法`);
console.log(`反应文件: ${files.length} 个 → ${allReactions.length} 条反应`);
if (shared.length) {
  console.log(`其中被多条通路共享: ${shared.length} 条`);
  for (const s of shared) console.log('   ' + s);
}
console.log(`推导出节点: ${nodes.size} 个`);
console.log(`节点补充属性: ${nodeMeta.size} 条（其中带膜侧 ${[...nodeMeta.values()].filter(m => m.side).length} 条）`);
console.log(`手工坐标覆盖: ${overrides.size} 个（其余由算法在区室范围内计算）`);
console.log(`同一物质跨区室（自动互链）: ${multiComp.length} 组`);
for (const [name, cs] of multiComp) console.log(`   ${name}: ${[...new Set(cs)].join(', ')}`);
console.log(`结构化参与物: ${participantOccurrences} 次，唯一 ${participantKeys.size} 个`);
console.log(`跨通路参与物: ${crossPathwayParticipants} 个`);
console.log(`仅反应式文本参与物: ${textOnlyParticipantKeys.size} 个（仍可用于场景查询）`);
console.log(`未解析反应式片段: ${ignoredEquationSegments} 个（保留原文，不自动推断）`);

if (errors.length) {
  console.log(`\n错误 ${errors.length} 条（必须修）:`);
  for (const e of errors) console.log('  ✗ ' + e);
} else console.log('\n错误: 无');

if (warnings.length) {
  console.log(`\n提醒 ${warnings.length} 条（可以先放着）:`);
  for (const w of warnings.slice(0, 20)) console.log('  · ' + w);
  if (warnings.length > 20) console.log(`  … 另有 ${warnings.length - 20} 条`);
}

// 进度，不是问题：这些节点已有坐标或属性，但对应通路还没转录
if (pending.length) {
  const uniq = [...new Set(pending)];
  console.log(`\n等待转录: ${uniq.length} 个节点已有坐标/属性，但还没有反应用到它们`);
  console.log('  ' + uniq.slice(0, 8).join('，') + (uniq.length > 8 ? ` …（共 ${uniq.length} 个）` : ''));
  console.log('  这是进度指示 —— 转录完对应通路后会自动消失。');
}

module.exports = { readTsv, resolveComp, zh2id, validIds, DATA, ROOT, allReactions, nodes };
process.exitCode = errors.length ? 1 : 0;
