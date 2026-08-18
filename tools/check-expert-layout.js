#!/usr/bin/env node
// 专家地图 21 条核心通路的几何门禁：专属坐标完整、节点在区室内、节点不过密。
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const {
  EXPERT_MITO_TOPOLOGY,
  EXPERT_ER_TOPOLOGY,
  EXPERT_GLUCO_TOPOLOGY,
  expertPointIssues,
  expertErTopologyIssues,
  expertErTopologyZone,
  expertGlucoTopologyIssues,
  expertGlucoTopologyZone,
  expertTopologyIssues,
  expertTopologyZone
} = require('./expert-map-geometry.js');

const ROOT = path.join(__dirname, '..');
const CORE_PATHWAYS = [
  'pdh', 'tca', 'malate_aspartate', 'glycerol_phosphate', 'etc', 'oxphos',
  'glycolysis', 'gluconeogenesis', 'glycogenesis', 'glycogenolysis', 'ppp',
  'fa_synthesis', 'carnitine', 'beta_oxidation', 'ketone',
  'transamination', 'urea', 'aa_carbon',
  'purine', 'pyrimidine', 'nucleotide_degradation'
];

// 21 条核心通路的端点区室合同。它校验的是“代谢物端点在哪”，
// 膜结合酶的位置另由反应酶字段和专家图靠膜布局表达。
const CORE_COMPARTMENT_CONTRACTS = {
  pdh: ['线粒体基质'],
  tca: ['线粒体基质'],
  malate_aspartate: ['细胞质', '线粒体基质'],
  glycerol_phosphate: ['细胞质', '线粒体内膜'],
  etc: ['线粒体基质', '线粒体内膜', '线粒体膜间隙'],
  oxphos: ['细胞质', '线粒体基质', '线粒体膜间隙'],
  glycolysis: ['细胞质'],
  gluconeogenesis: ['细胞质', '线粒体基质', '线粒体膜间隙', '内质网腔'],
  glycogenesis: ['细胞质'],
  glycogenolysis: ['细胞质', '内质网腔'],
  ppp: ['细胞质'],
  fa_synthesis: ['细胞质'],
  carnitine: ['细胞质', '线粒体基质', '线粒体膜间隙'],
  beta_oxidation: ['线粒体基质'],
  ketone: ['线粒体基质'],
  transamination: ['细胞质', '线粒体基质'],
  urea: ['细胞质', '线粒体基质'],
  aa_carbon: ['细胞质'],
  purine: ['细胞质'],
  pyrimidine: ['细胞质'],
  nucleotide_degradation: ['细胞质']
};

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'data-compiled.js'), 'utf8'), sandbox);
const data = sandbox.window.METABOLIC_COMPILED;
const entityById = new Map(data.entities.map(entity => [entity.id, entity]));
const groupsFor = item => Array.isArray(item.group) ? item.group : [item.group];

let failures = 0;
console.log('=== 专家地图逐通路几何审计 ===');
for (const pathwayId of CORE_PATHWAYS) {
  const reactions = data.reactions.filter(reaction => groupsFor(reaction).includes(pathwayId));
  const nodeIds = [...new Set(reactions.flatMap(reaction => [reaction.from, reaction.to]))];
  const layout = data.expertPathwayLayouts?.[pathwayId] || {};
  const missing = nodeIds.filter(id => !layout[id]);
  const outside = [];
  const topologyUnknown = [];
  const closePairs = [];
  const points = nodeIds.filter(id => layout[id] && entityById.has(id)).map(id => ({
    id,
    entity: entityById.get(id),
    ...layout[id]
  }));

  points.forEach(point => {
    const topologyZone = expertTopologyZone(pathwayId, point.entity);
    const erTopologyZone = expertErTopologyZone(pathwayId, point.entity);
    const glucoTopologyZone = expertGlucoTopologyZone(pathwayId, point.entity);
    if ((EXPERT_MITO_TOPOLOGY[pathwayId] && !topologyZone)
      || (EXPERT_ER_TOPOLOGY[pathwayId] && !erTopologyZone)
      || (EXPERT_GLUCO_TOPOLOGY[pathwayId] && !glucoTopologyZone)) {
      topologyUnknown.push(`${point.entity.name}@${point.entity.compartment}`);
      return;
    }
    // 膜相关通路用“哪一侧”的拓扑轨道校验；普通通路继续使用照片区室。
    // 两者不能混用，否则细胞质侧节点会被旧的水平椭圆误报。
    const issues = topologyZone
      ? expertTopologyIssues(pathwayId, point.entity, point)
      : erTopologyZone
        ? expertErTopologyIssues(pathwayId, point.entity, point)
        : glucoTopologyZone
          ? expertGlucoTopologyIssues(pathwayId, point.entity, point)
          : expertPointIssues(point.entity.compartment, point);
    if (issues.length) outside.push(`${point.entity.name}@${point.entity.compartment}(${issues.join('、')})`);
  });
  for (let left = 0; left < points.length; left += 1) {
    for (let right = left + 1; right < points.length; right += 1) {
      const distance = Math.hypot(points[left].x - points[right].x, points[left].y - points[right].y);
      if (distance < 42) closePairs.push(`${points[left].entity.name}~${points[right].entity.name}(${distance.toFixed(0)}px)`);
    }
  }

  const issues = [
    (() => {
      const expected = [...(CORE_COMPARTMENT_CONTRACTS[pathwayId] || [])].sort();
      const actual = [...new Set(points.map(point => point.entity.compartment))].sort();
      return expected.join('|') === actual.join('|') ? '' : `区室合同 期望[${expected.join('、')}] 实际[${actual.join('、')}]`;
    })(),
    missing.length ? `缺坐标 ${missing.length}` : '',
    topologyUnknown.length ? `膜侧合同缺节点 ${topologyUnknown.join('、')}` : '',
    outside.length ? `越界 ${outside.join('、')}` : '',
    closePairs.length ? `过密 ${closePairs.join('、')}` : ''
  ].filter(Boolean);
  const label = data.pathwayMeta?.[pathwayId]?.label || pathwayId;
  if (issues.length) {
    failures += 1;
    console.error(`FAIL ${pathwayId} ${label}：${issues.join('；')}`);
  } else {
    console.log(`PASS ${pathwayId.padEnd(24)} 节点 ${String(points.length).padStart(2)} · 照片区室正确 · 间距通过`);
  }
}

if (failures) {
  console.error(`\n专家地图几何门禁失败：${failures}/${CORE_PATHWAYS.length} 条通路`);
  process.exitCode = 1;
} else {
  console.log(`\n专家地图几何门禁通过：${CORE_PATHWAYS.length}/${CORE_PATHWAYS.length} 条通路`);
}
