#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const resolver = require('../student-step-resolver.js');

const ROOT = path.join(__dirname, '..');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'scene-data.js'), 'utf8'), context);
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'data-compiled.js'), 'utf8'), context);

const atlas = context.window.METABOLIC_ATLAS_DATA;
const compiled = context.window.METABOLIC_COMPILED;
const routeGroups = {
  glycolysis: 'glycolysis', pdh: 'pdh', tca: 'tca', etc: 'etc', oxphos: 'etc',
  malate_aspartate: 'transport', glycerol_phosphate: 'transport', atp_transport: 'transport'
};
const result = resolver.auditPathways({
  pathways: atlas.pathways,
  entities: compiled.entities,
  reactions: compiled.reactions,
  entityById: Object.fromEntries(compiled.entities.map(entity => [entity.id, entity])),
  routeGroups
});

function reactionGroups(reaction) {
  if (Array.isArray(reaction.groups)) return reaction.groups;
  return reaction.group ? [reaction.group] : [];
}

const etcOxphosLeaks = compiled.reactions.filter(reaction => {
  if (!reactionGroups(reaction).includes('etc')) return false;
  return /ATP\s*合酶/.test(reaction.enzyme || '')
    || /^ATP@/.test(reaction.from || '')
    || /^ATP@/.test(reaction.to || '');
});

console.log('=== 学习步骤链接检查 ===');
console.log(`步骤 ${result.total}：代谢物 ${result.metabolite}，酶/载体 ${result.enzyme}，过程 ${result.process}`);
if (result.missing.length) {
  console.log(`无法交互 ${result.missing.length} 项（必须修）:`);
  result.missing.forEach(item => console.log(`  ✗ ${item.pathwayId} / ${item.step}`));
  process.exitCode = 1;
} else {
  console.log('无法交互: 0（全部步骤均链接到实体或反应）');
}

if (etcOxphosLeaks.length) {
  console.log(`电子传递链边界泄漏 ${etcOxphosLeaks.length} 条（必须修）:`);
  etcOxphosLeaks.forEach(reaction => {
    console.log(`  ✗ ${reaction.id} ${reaction.from} → ${reaction.to} · ${reaction.enzyme}`);
  });
  process.exitCode = 1;
} else {
  console.log('电子传递链边界: 通过（ATP 合成仅归入氧化磷酸化）');
}
