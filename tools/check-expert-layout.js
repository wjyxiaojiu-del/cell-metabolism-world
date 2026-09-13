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
  pdh: ['细胞质', '线粒体基质', '线粒体膜间隙'],
  tca: ['线粒体基质'],
  malate_aspartate: ['细胞质', '线粒体基质'],
  glycerol_phosphate: ['细胞质', '线粒体内膜', '线粒体膜间隙'],
  etc: ['线粒体基质', '线粒体内膜', '线粒体膜间隙'],
  oxphos: ['细胞质', '线粒体内膜', '线粒体基质', '线粒体膜间隙'],
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
  aa_carbon: ['细胞质', '线粒体基质'],
  purine: ['细胞质'],
  pyrimidine: ['细胞质'],
  nucleotide_degradation: ['细胞质']
};

// 科学锚点不是几何偏好：这些节点/酶/场景缺失时，即使坐标全部在框内，
// 也不能把专家地图判为正确。键使用“名称@中文区室”，与编译实体 id 一致。
const REQUIRED_NODE_ANCHORS = {
  pdh: ['丙酮酸@细胞质', '丙酮酸@线粒体膜间隙', '丙酮酸@线粒体基质', '乙酰辅酶 A@线粒体基质'],
  malate_aspartate: [
    'α-酮戊二酸@细胞质', 'α-酮戊二酸@线粒体基质',
    '谷氨酸@细胞质', '谷氨酸@线粒体基质', 'NADH@线粒体基质'
  ],
  glycerol_phosphate: [
    '甘油-3-磷酸@线粒体膜间隙', '磷酸二羟丙酮@线粒体膜间隙',
    '辅酶 Q@线粒体内膜', '泛醇@线粒体内膜'
  ],
  etc: [
    'NADH@线粒体基质', '琥珀酸@线粒体基质',
    '复合体 I@线粒体内膜', '复合体 II@线粒体内膜',
    '氧@线粒体基质', '水@线粒体基质'
  ],
  oxphos: [
    'ATP 合酶@线粒体内膜', 'ATP@线粒体膜间隙', 'ADP@线粒体膜间隙',
    '无机磷酸@细胞质', '无机磷酸@线粒体膜间隙', '无机磷酸@线粒体基质'
  ],
  carnitine: [
    '脂酰肉碱@细胞质', '脂酰肉碱@线粒体膜间隙', '脂酰肉碱@线粒体基质',
    '肉碱@线粒体膜间隙', '肉碱@线粒体基质'
  ],
  aa_carbon: [
    '丙氨酸/半胱氨酸/甘氨酸/丝氨酸/苏氨酸/色氨酸@细胞质',
    '异亮氨酸/亮氨酸/苏氨酸/色氨酸@线粒体基质',
    '亮氨酸/赖氨酸/苯丙氨酸/酪氨酸/色氨酸@线粒体基质',
    '乙酰乙酰辅酶 A@线粒体基质',
    '谷氨酸/谷氨酰胺/精氨酸/脯氨酸/组氨酸@线粒体基质',
    '缬氨酸/异亮氨酸/蛋氨酸/苏氨酸@线粒体基质'
  ]
};

const REQUIRED_ENZYME_ANCHORS = {
  pdh: [/VDAC/, /MPC/, /丙酮酸脱氢酶复合体/],
  glycerol_phosphate: [/GPD1/, /GPD2/, /VDAC/],
  oxphos: [/ATP 合酶/, /ANT|SLC25A4/, /SLC25A3/, /VDAC/],
  glycogenolysis: [/糖原磷酸化酶/, /去分支酶 AGL/, /葡萄糖-6-磷酸酶/],
  carnitine: [/CPT1/, /CACT|SLC25A20/, /CPT2/, /VDAC/],
  urea: [/氨甲酰磷酸合成酶 I/, /鸟氨酸氨甲酰基转移酶/, /ORNT1|SLC25A15/, /精氨代琥珀酸合成酶/, /精氨酸酶/],
  pyrimidine: [/氨甲酰磷酸合成酶 II/, /DHODH/, /胸苷酸合成酶/]
};

const REQUIRED_SCENES = {
  pdh: 'mitochondria',
  gluconeogenesis: 'cell-atlas',
  glycogenolysis: 'cell-atlas',
  fa_synthesis: 'cytosol',
  carnitine: 'mitochondria',
  transamination: 'mitochondria',
  urea: 'mitochondria',
  aa_carbon: 'mitochondria',
  purine: 'cytosol',
  pyrimidine: 'mitochondria-inner-membrane',
  nucleotide_degradation: 'cytosol'
};

const HOTSPOT_MIN_DISTANCE = 7.5;
const INNER_MEMBRANE_SCENE = 'mitochondria-inner-membrane';

function hotspotLabel(hotspot) {
  return hotspot.label || hotspot.pathway || '未命名热点';
}

function transferReaction(reaction) {
  const fromAt = String(reaction.from || '').lastIndexOf('@');
  const toAt = String(reaction.to || '').lastIndexOf('@');
  if (fromAt < 1 || toAt < 1) return false;
  const fromName = reaction.from.slice(0, fromAt);
  const toName = reaction.to.slice(0, toAt);
  const fromCompartment = reaction.from.slice(fromAt + 1);
  const toCompartment = reaction.to.slice(toAt + 1);
  return fromName === toName && fromCompartment !== toCompartment;
}

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'data-compiled.js'), 'utf8'), sandbox);
const data = sandbox.window.METABOLIC_COMPILED;
const sceneSandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'scene-data.js'), 'utf8'), sceneSandbox);
const sceneData = sceneSandbox.window.METABOLIC_ATLAS_DATA;
const entityById = new Map(data.entities.map(entity => [entity.id, entity]));
const groupsFor = item => Array.isArray(item.group) ? item.group : [item.group];

let failures = 0;
console.log('=== 专家地图逐通路几何审计 ===');

const sceneHotspotIssues = [];
for (const [sceneId, scene] of Object.entries(sceneData?.scenes || {})) {
  const hotspots = (scene.hotspots || []).filter(hotspot => Number.isFinite(hotspot.x) && Number.isFinite(hotspot.y));
  const pathwayHotspots = hotspots.filter(hotspot => hotspot.pathway);
  if (sceneId === 'cell-atlas' && pathwayHotspots.length) {
    sceneHotspotIssues.push(`G1 cell-atlas 仍有通路热点：${pathwayHotspots.map(hotspotLabel).join('、')}`);
  }
  for (let left = 0; left < hotspots.length; left += 1) {
    for (let right = left + 1; right < hotspots.length; right += 1) {
      const distance = Math.hypot(hotspots[left].x - hotspots[right].x, hotspots[left].y - hotspots[right].y);
      if (distance < HOTSPOT_MIN_DISTANCE) {
        sceneHotspotIssues.push(`G2 ${sceneId} ${hotspotLabel(hotspots[left])}~${hotspotLabel(hotspots[right])} 距离 ${distance.toFixed(2)}<${HOTSPOT_MIN_DISTANCE}`);
      }
    }
  }
  if (sceneId === INNER_MEMBRANE_SCENE) {
    const upper = pathwayHotspots.filter(hotspot => hotspot.y < 55).length;
    const lower = pathwayHotspots.filter(hotspot => hotspot.y >= 65).length;
    if (upper < 3 || lower < 3) sceneHotspotIssues.push(`G2 ${sceneId} 两排分布不足：上排 ${upper}、下排 ${lower}`);
  }
}
if (sceneHotspotIssues.length) {
  failures += sceneHotspotIssues.length;
  sceneHotspotIssues.forEach(issue => console.error(`FAIL ${issue}`));
} else {
  console.log(`PASS 场景热点组              G1/G2 通过 · 最小距离 ${HOTSPOT_MIN_DISTANCE}`);
}

const transferIssues = data.reactions
  .filter(transferReaction)
  .filter(reaction => !String(reaction.enzyme || '').trim());
if (transferIssues.length) {
  failures += transferIssues.length;
  transferIssues.forEach(reaction => console.error(`FAIL 转运反应 ${reaction.id} 缺载体/酶标注`));
} else {
  const transferCount = data.reactions.filter(transferReaction).length;
  console.log(`PASS 跨区室转运标注          ${transferCount} 条转运反应均有载体/酶`);
}

for (const pathwayId of CORE_PATHWAYS) {
  const reactions = data.reactions.filter(reaction => groupsFor(reaction).includes(pathwayId));
  const nodeIds = [...new Set(reactions.flatMap(reaction => [reaction.from, reaction.to]))];
  const nodeKeys = new Set(nodeIds.map(id => {
    const entity = entityById.get(id);
    return entity ? `${entity.name}@${entity.compartment}` : id;
  }));
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
    (() => {
      const required = REQUIRED_NODE_ANCHORS[pathwayId] || [];
      const absent = required.filter(id => !nodeKeys.has(id));
      return absent.length ? `缺科学节点 ${absent.join('、')}` : '';
    })(),
    (() => {
      const required = REQUIRED_ENZYME_ANCHORS[pathwayId] || [];
      const enzymes = reactions.map(reaction => reaction.enzyme || '');
      const absent = required.filter(pattern => !enzymes.some(enzyme => pattern.test(enzyme)));
      return absent.length ? `缺酶锚点 ${absent.map(pattern => pattern.source).join('、')}` : '';
    })(),
    (() => {
      const expected = REQUIRED_SCENES[pathwayId];
      const actual = sceneData?.pathways?.[pathwayId]?.scene;
      return expected && actual !== expected ? `场景错误 期望[${expected}] 实际[${actual || '无'}]` : '';
    })(),
    pathwayId === 'aa_carbon' && nodeKeys.has('氨基酸@细胞质') ? '仍使用错误的通用氨基酸直连节点' : '',
    pathwayId === 'nucleotide_degradation' && nodeKeys.has('核酸@细胞质') ? '仍把胞质核苷酸分解与大分子核酸水解混为一图' : '',
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
