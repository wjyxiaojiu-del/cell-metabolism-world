#!/usr/bin/env node
// Cross-check the two runtime data sources and compiled graph references.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const context = { window: {} };
const TOPIC_OMISSION_ALLOWLIST = new Set([
  'starch', 'fructose', 'galactose', 'uronic', 'polyol', 'pyruvate_fates',
  'glyoxylate', 'atp_transport', 'transport', 'lipoprotein', 'fa_elongation',
  'vlcfa', 'tag', 'phospholipid', 'sphingolipid', 'cholesterol', 'steroid_bile',
  'glutamate_glutamine', 'bcaa', 'aromatic_aa', 'serine_glycine',
  'methionine_cysteine', 'aa_biosynthesis', 'nitrogen', 'sulfur', 'salvage',
  'folate', 'heme', 'glutathione', 'glycosylation', 'lysosomal', 'autophagy',
  'membrane_transport', 'plasmalogen'
]);

function extractObjectLiteral(source, declaration) {
  const declarationIndex = source.indexOf(declaration);
  if (declarationIndex < 0) throw new Error(`index.html 缺少 ${declaration}`);
  const start = source.indexOf('{', declarationIndex + declaration.length);
  if (start < 0) throw new Error(`${declaration} 后没有对象字面量`);
  let depth = 0;
  let quote = '';
  let escaped = false;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === '\'' || char === '"' || char === '`') {
      quote = char;
      continue;
    }
    if (char === '{') depth += 1;
    else if (char === '}' && --depth === 0) return source.slice(start, index + 1);
  }
  throw new Error(`${declaration} 对象字面量没有闭合`);
}

for (const file of ['scene-data.js', 'data-compiled.js']) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) {
    console.error(`缺少运行时数据文件: ${file}`);
    process.exit(1);
  }
  vm.runInNewContext(fs.readFileSync(full, 'utf8'), context, { filename: full });
}

const atlas = context.window.METABOLIC_ATLAS_DATA;
const compiled = context.window.METABOLIC_COMPILED;
const errors = [];

if (!atlas?.pathways || !atlas?.scenes) errors.push('scene-data.js 缺少 pathways 或 scenes');
if (!compiled?.entities || !compiled?.reactions || !compiled?.pathwayMeta) {
  errors.push('data-compiled.js 缺少 entities、reactions 或 pathwayMeta');
}

if (!errors.length) {
  const atlasPathwayIds = new Set(Object.keys(atlas.pathways));
  const compiledPathwayIds = new Set(Object.keys(compiled.pathwayMeta));
  const sceneIds = new Set(Object.keys(atlas.scenes));
  const entityIds = new Set(compiled.entities.map(entity => entity.id));
  let studentTopicCatalog = null;
  try {
    const indexSource = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const literal = extractObjectLiteral(indexSource, 'const studentTopicCatalog =');
    studentTopicCatalog = vm.runInNewContext(`(${literal})`);
  } catch (error) {
    errors.push(`无法读取学生专题目录: ${error.message}`);
  }

  for (const id of compiledPathwayIds) {
    if (!atlasPathwayIds.has(id)) errors.push(`编译通路 ${id} 缺少学习场景入口`);
  }
  for (const id of atlasPathwayIds) {
    if (!compiledPathwayIds.has(id)) errors.push(`学习场景通路 ${id} 缺少编译反应数据`);
    const pathway = atlas.pathways[id];
    if (!sceneIds.has(pathway.scene)) errors.push(`学习场景通路 ${id} 引用了不存在的场景 ${pathway.scene || '(空)'}`);
    if (!Array.isArray(pathway.steps) || !pathway.steps.length) errors.push(`学习场景通路 ${id} 没有学习步骤`);
  }

  compiled.reactions.forEach((reaction, index) => {
    const label = reaction.id || `第 ${index + 1} 条反应`;
    if (!entityIds.has(reaction.from)) errors.push(`${label} 的底物端点不存在: ${reaction.from}`);
    if (!entityIds.has(reaction.to)) errors.push(`${label} 的产物端点不存在: ${reaction.to}`);
    const groups = Array.isArray(reaction.group) ? reaction.group : [reaction.group];
    for (const group of groups.filter(Boolean)) {
      if (!compiledPathwayIds.has(group)) errors.push(`${label} 引用了不存在的通路: ${group}`);
    }
  });

  compiled.entities.forEach(entity => {
    const groups = Array.isArray(entity.group) ? entity.group : [entity.group];
    for (const group of groups.filter(Boolean)) {
      if (!compiledPathwayIds.has(group)) errors.push(`实体 ${entity.id} 引用了不存在的通路: ${group}`);
    }
  });

  if (studentTopicCatalog) {
    const topicPathwayIds = new Set();
    for (const [topicId, topic] of Object.entries(studentTopicCatalog)) {
      if (!Array.isArray(topic.pathways) || !topic.pathways.length) {
        errors.push(`学生专题 ${topicId} 没有通路列表`);
        continue;
      }
      const topicIds = new Set(topic.pathways);
      for (const pathwayId of topic.pathways) {
        topicPathwayIds.add(pathwayId);
        if (!atlasPathwayIds.has(pathwayId)) errors.push(`学生专题 ${topicId} 引用了不存在的通路: ${pathwayId}`);
      }
      for (const [from, to] of topic.links || []) {
        if (!topicIds.has(from) || !topicIds.has(to)) {
          errors.push(`学生专题 ${topicId} 的连线不在本专题通路列表中: ${from} → ${to}`);
        }
      }
    }
    for (const pathwayId of atlasPathwayIds) {
      if (!topicPathwayIds.has(pathwayId) && !TOPIC_OMISSION_ALLOWLIST.has(pathwayId)) {
        errors.push(`新增通路 ${pathwayId} 未登记到学生专题，也未列入有意省略清单`);
      }
    }
    for (const pathwayId of TOPIC_OMISSION_ALLOWLIST) {
      if (!atlasPathwayIds.has(pathwayId)) errors.push(`学生专题省略清单含已不存在的通路: ${pathwayId}`);
      if (topicPathwayIds.has(pathwayId)) errors.push(`通路 ${pathwayId} 已进入学生专题，应从省略清单移除`);
    }
    console.log(`学生专题 ${Object.keys(studentTopicCatalog).length}；已登记通路 ${topicPathwayIds.size}；有意省略 ${TOPIC_OMISSION_ALLOWLIST.size}`);
  }

  console.log('=== 全图交叉一致性 ===');
  console.log(`场景 ${sceneIds.size}；学习入口 ${atlasPathwayIds.size}；编译通路 ${compiledPathwayIds.size}`);
  console.log(`实体 ${entityIds.size}；反应 ${compiled.reactions.length}`);
}

if (errors.length) {
  errors.forEach(error => console.error(`✗ ${error}`));
  console.error(`交叉一致性失败：${errors.length} 项`);
  process.exitCode = 1;
} else {
  console.log('跨文件引用、端点、通路与场景入口一致');
}
