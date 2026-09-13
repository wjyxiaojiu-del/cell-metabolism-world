// 专家地图使用的“照片对齐”几何。
//
// data/compartment-geometry.tsv 服务于全局数据布局；专家地图选中单条通路时，
// 需要避开底图中真实可见的细胞核、内质网、线粒体和高尔基体，不能把
// “位于细胞质”简单理解为“细胞中央大椭圆中的任意一点”。

const EXPERT_LAYOUT_REGIONS = {
  // 左侧开放胞质：避开上方中心体、右侧核/内质网和下方线粒体。
  '细胞质': { id: 'cytosol-study-field', shape: '填充', cx: 420, cy: 470, rx: 300, ry: 150 },

  // 线粒体四层沿底图中的大线粒体自上而下分开，避免全部压在同一中心线上。
  '线粒体外膜': { id: 'mito-outer-track', shape: '带状', cx: 570, cy: 610, rx: 285, ry: 25 },
  '线粒体膜间隙': { id: 'mito-ims-track', shape: '带状', cx: 570, cy: 655, rx: 270, ry: 30 },
  '线粒体内膜': { id: 'mito-inner-track', shape: '带状', cx: 570, cy: 720, rx: 255, ry: 42 },
  '线粒体基质': { id: 'mito-matrix-field', shape: '填充', cx: 570, cy: 830, rx: 250, ry: 120 },

  // 蓝色粗面/平滑内质网的下缘膜腔，选中 G6Pase 等步骤时显示在真实 ER 区域。
  '内质网腔': { id: 'er-lumen-track', shape: '带状', cx: 1080, cy: 565, rx: 260, ry: 48 }
};

// 线粒体膜相关通路不能只用“是否落入一个大椭圆”判断正确性。
// 专家地图在选中这些通路时显示一个局部展开剖面，并让每类节点进入
// 明确的膜侧轨道。它表达的是拓扑关系，不假装对应底图中的某一条具体嵴。
const EXPERT_MITO_MEMBRANE_GUIDE = {
  id: 'mitochondrial-inner-membrane-unfolded',
  title: '线粒体内膜局部展开（示意）',
  x: 195,
  y: 500,
  width: 825,
  height: 470,
  zones: {
    cytosol: { id: 'cytosol-side', label: '细胞质侧', x1: 285, x2: 985, y1: 540, y2: 625 },
    outerMembrane: { id: 'outer-membrane-band', label: '线粒体外膜', x1: 285, x2: 985, y1: 628, y2: 638 },
    ims: { id: 'intermembrane-space-side', label: '膜间隙侧', x1: 285, x2: 985, y1: 640, y2: 695 },
    membrane: { id: 'inner-membrane-band', label: '线粒体内膜', x1: 285, x2: 985, y1: 705, y2: 760 },
    matrix: { id: 'matrix-side', label: '基质侧', x1: 285, x2: 985, y1: 785, y2: 925 }
  }
};

const EXPERT_MITO_GUIDE_PATHWAYS = [
  'pdh', 'malate_aspartate', 'glycerol_phosphate', 'etc', 'oxphos', 'carnitine',
  'transamination', 'urea', 'pyrimidine'
];

const EXPERT_ER_MEMBRANE_GUIDE = {
  id: 'endoplasmic-reticulum-membrane-unfolded',
  title: '内质网膜局部展开（示意）',
  x: 240,
  y: 300,
  width: 820,
  height: 440,
  zones: {
    cytosol: { id: 'er-cytosol-side', label: '细胞质侧', x1: 330, x2: 1010, y1: 345, y2: 470 },
    membrane: { id: 'er-membrane-band', label: '内质网膜', x1: 330, x2: 1010, y1: 500, y2: 530 },
    lumen: { id: 'er-lumen-side', label: '内质网腔', x1: 330, x2: 1010, y1: 555, y2: 680 }
  }
};

const EXPERT_ER_GUIDE_PATHWAYS = ['glycogenolysis'];

const EXPERT_GLUCO_GUIDE = {
  id: 'gluconeogenesis-cross-compartment-route',
  title: '糖异生跨区室主线（示意）',
  x: 210,
  y: 180,
  width: 1000,
  height: 650,
  zones: {
    cytosol: { id: 'gluconeogenesis-cytosol', label: '细胞质主线', x1: 235, x2: 1185, y1: 225, y2: 575 },
    ims: { id: 'gluconeogenesis-ims', label: '膜间隙', x1: 270, x2: 650, y1: 600, y2: 635 },
    membrane: { id: 'gluconeogenesis-inner-membrane', label: '线粒体内膜', x1: 270, x2: 650, y1: 642, y2: 655 },
    matrix: { id: 'gluconeogenesis-matrix', label: '线粒体基质', x1: 270, x2: 650, y1: 665, y2: 790 },
    erMembrane: { id: 'gluconeogenesis-er-membrane', label: '内质网膜', x1: 690, x2: 1130, y1: 620, y2: 640 },
    erLumen: { id: 'gluconeogenesis-er-lumen', label: '内质网腔', x1: 690, x2: 1130, y1: 655, y2: 760 }
  }
};

const EXPERT_GLUCO_GUIDE_PATHWAYS = ['gluconeogenesis'];

// 逐通路、逐节点的膜侧合同。节点名和区室同时参与匹配，避免同名 ATP、
// NADH 在细胞质与基质之间被误判。未列出的节点继续使用普通区室门禁。
const EXPERT_MITO_TOPOLOGY = {
  pdh: {
    cytosol: ['丙酮酸@细胞质'],
    ims: ['丙酮酸@线粒体膜间隙'],
    membrane: [],
    matrix: ['丙酮酸@线粒体基质', '乙酰辅酶 A@线粒体基质']
  },
  etc: {
    cytosol: [],
    ims: ['膜间隙 H⁺@线粒体膜间隙', '细胞色素 c@线粒体膜间隙'],
    membrane: [
      '复合体 I@线粒体内膜', '复合体 II@线粒体内膜', '辅酶 Q@线粒体内膜',
      '泛醇@线粒体内膜', '复合体 III@线粒体内膜', '复合体 IV@线粒体内膜',
      'ATP 合酶@线粒体内膜', '质子动力势@线粒体内膜'
    ],
    matrix: [
      'NADH@线粒体基质', '琥珀酸@线粒体基质', 'ADP@线粒体基质', '无机磷酸@线粒体基质',
      'ATP@线粒体基质', '氧@线粒体基质', '水@线粒体基质'
    ]
  },
  oxphos: {
    cytosol: ['ATP@细胞质', 'ADP@细胞质', '无机磷酸@细胞质'],
    ims: [
      '膜间隙 H⁺@线粒体膜间隙', 'ATP@线粒体膜间隙',
      'ADP@线粒体膜间隙', '无机磷酸@线粒体膜间隙'
    ],
    membrane: ['ATP 合酶@线粒体内膜'],
    matrix: ['ATP@线粒体基质', 'ADP@线粒体基质', '无机磷酸@线粒体基质']
  },
  glycerol_phosphate: {
    cytosol: [
      '磷酸二羟丙酮@细胞质', '甘油-3-磷酸@细胞质',
      'NADH@细胞质', 'NAD⁺@细胞质'
    ],
    ims: ['甘油-3-磷酸@线粒体膜间隙', '磷酸二羟丙酮@线粒体膜间隙'],
    membrane: ['辅酶 Q@线粒体内膜', '泛醇@线粒体内膜'],
    matrix: []
  },
  carnitine: {
    cytosol: ['脂酰-CoA@细胞质', '肉碱@细胞质', '脂酰肉碱@细胞质'],
    ims: ['脂酰肉碱@线粒体膜间隙', '肉碱@线粒体膜间隙'],
    membrane: [],
    matrix: ['脂酰肉碱@线粒体基质', '脂酰-CoA@线粒体基质', '肉碱@线粒体基质']
  },
  malate_aspartate: {
    cytosol: [
      '草酰乙酸@细胞质', '苹果酸@细胞质', 'NADH@细胞质', 'NAD⁺@细胞质',
      '天冬氨酸@细胞质', 'α-酮戊二酸@细胞质', '谷氨酸@细胞质'
    ],
    ims: [],
    membrane: [],
    matrix: [
      '苹果酸@线粒体基质', '草酰乙酸@线粒体基质', '天冬氨酸@线粒体基质',
      'α-酮戊二酸@线粒体基质', '谷氨酸@线粒体基质',
      'NAD⁺@线粒体基质', 'NADH@线粒体基质'
    ]
  },
  transamination: {
    cytosol: ['氨基酸@细胞质', 'α-酮酸@细胞质', '谷氨酸@细胞质'],
    ims: [],
    membrane: [],
    matrix: ['谷氨酸@线粒体基质', 'α-酮戊二酸@线粒体基质', 'NH₄⁺@线粒体基质']
  },
  urea: {
    cytosol: [
      '瓜氨酸@细胞质', '天冬氨酸@细胞质', '精氨代琥珀酸@细胞质',
      '精氨酸@细胞质', '延胡索酸@细胞质', '鸟氨酸@细胞质', '尿素@细胞质'
    ],
    ims: [],
    membrane: [],
    matrix: [
      'NH₄⁺@线粒体基质', '氨甲酰磷酸@线粒体基质',
      '鸟氨酸@线粒体基质', '瓜氨酸@线粒体基质'
    ]
  },
  pyrimidine: {
    cytosol: [
      '谷氨酰胺@细胞质', '氨甲酰磷酸@细胞质', '氨甲酰天冬氨酸@细胞质',
      '二氢乳清酸@细胞质', '乳清酸@细胞质', 'UMP@细胞质', 'UTP@细胞质',
      'CTP@细胞质', 'UDP@细胞质', 'dUDP@细胞质', 'dUTP@细胞质', 'dUMP@细胞质', 'dTMP@细胞质'
    ],
    ims: [],
    membrane: [],
    matrix: []
  }
};

const EXPERT_ER_TOPOLOGY = {
  glycogenolysis: {
    cytosol: [
      '糖原@细胞质', '葡萄糖-1-磷酸@细胞质',
      '葡萄糖-6-磷酸@细胞质', '葡萄糖@细胞质'
    ],
    membrane: [],
    lumen: ['葡萄糖-6-磷酸@内质网腔', '葡萄糖@内质网腔']
  }
};

const EXPERT_GLUCO_TOPOLOGY = {
  gluconeogenesis: {
    cytosol: [
      '乳酸@细胞质', '丙氨酸@细胞质', '丙酮酸@细胞质', '苹果酸@细胞质',
      '草酰乙酸@细胞质', '磷酸烯醇式丙酮酸@细胞质', '2-磷酸甘油酸@细胞质',
      '3-磷酸甘油酸@细胞质', '1,3-二磷酸甘油酸@细胞质',
      '甘油醛-3-磷酸@细胞质', '磷酸二羟丙酮@细胞质',
      '果糖-1,6-二磷酸@细胞质', '果糖-6-磷酸@细胞质',
      '葡萄糖-6-磷酸@细胞质', '葡萄糖@细胞质',
      '甘油@细胞质', '甘油-3-磷酸@细胞质'
    ],
    ims: ['丙酮酸@线粒体膜间隙'],
    membrane: [],
    matrix: [
      '丙酮酸@线粒体基质', '草酰乙酸@线粒体基质', '苹果酸@线粒体基质'
    ],
    erMembrane: [],
    erLumen: ['葡萄糖-6-磷酸@内质网腔', '葡萄糖@内质网腔']
  }
};

// 底图上不可被“细胞质节点”覆盖的主要细胞器轮廓。数值故意留出标签余量，
// 用于阻止今后的手工坐标再次漂到错误细胞器上。
const CYTOSOL_EXCLUSION_ZONES = [
  { id: 'nucleus', cx: 1025, cy: 330, rx: 245, ry: 205 },
  { id: 'rough-er', cx: 1010, cy: 390, rx: 355, ry: 285 },
  { id: 'smooth-er', cx: 1320, cy: 505, rx: 185, ry: 185 },
  { id: 'mitochondria-main', cx: 570, cy: 805, rx: 360, ry: 225 },
  { id: 'golgi', cx: 1210, cy: 835, rx: 235, ry: 180 },
  { id: 'mitochondria-small', cx: 245, cy: 285, rx: 62, ry: 58 },
  { id: 'centrosome', cx: 555, cy: 295, rx: 115, ry: 105 }
];

// 依据 1600×1200 细胞底图逐点描出的“主线粒体基质安全区”。
// 这是保守多边形：宁可少用边缘空间，也不允许基质代谢物落到外膜之外。
const MITO_MATRIX_SAFE_POLYGON = [
  { x: 420, y: 705 },
  { x: 550, y: 680 },
  { x: 720, y: 700 },
  { x: 790, y: 750 },
  { x: 800, y: 835 },
  { x: 720, y: 875 },
  { x: 520, y: 880 },
  { x: 420, y: 835 },
  { x: 390, y: 760 }
];

function pointInEllipse(point, ellipse, padding = 0) {
  const rx = Math.max(1, ellipse.rx + padding);
  const ry = Math.max(1, ellipse.ry + padding);
  return ((point.x - ellipse.cx) / rx) ** 2 + ((point.y - ellipse.cy) / ry) ** 2 <= 1;
}

function pointInPolygon(point, polygon) {
  let inside = false;
  for (let current = 0, previous = polygon.length - 1; current < polygon.length; previous = current++) {
    const a = polygon[current], b = polygon[previous];
    const crosses = ((a.y > point.y) !== (b.y > point.y))
      && point.x < (b.x - a.x) * (point.y - a.y) / ((b.y - a.y) || Number.EPSILON) + a.x;
    if (crosses) inside = !inside;
  }
  return inside;
}

function expertRegionFor(compartment, fallback) {
  return EXPERT_LAYOUT_REGIONS[compartment] || fallback;
}

function expertPointIssues(compartment, point) {
  const issues = [];
  const region = EXPERT_LAYOUT_REGIONS[compartment];
  if (compartment === '线粒体基质') {
    if (!pointInPolygon(point, MITO_MATRIX_SAFE_POLYGON)) issues.push('不在 mito-matrix-photo-safe-polygon 内');
  } else if (region && !pointInEllipse(point, region)) {
    issues.push(`不在 ${region.id} 内`);
  }
  if (compartment === '细胞质') {
    const obstacle = CYTOSOL_EXCLUSION_ZONES.find(zone => pointInEllipse(point, zone, 12));
    if (obstacle) issues.push(`覆盖 ${obstacle.id}`);
  }
  return issues;
}

function pointInRect(point, rect, padding = 0) {
  return point.x >= rect.x1 - padding && point.x <= rect.x2 + padding
    && point.y >= rect.y1 - padding && point.y <= rect.y2 + padding;
}

function expertTopologyZone(pathwayId, entity) {
  const contract = EXPERT_MITO_TOPOLOGY[pathwayId];
  if (!contract || !entity) return null;
  const key = `${entity.name}@${entity.compartment}`;
  return Object.keys(contract).find(zone => contract[zone].includes(key)) || null;
}

function expertTopologyIssues(pathwayId, entity, point) {
  const zoneName = expertTopologyZone(pathwayId, entity);
  if (!zoneName) return [];
  const zone = EXPERT_MITO_MEMBRANE_GUIDE.zones[zoneName];
  return pointInRect(point, zone)
    ? []
    : [`不在 ${zone.id} 内`];
}

function expertErTopologyZone(pathwayId, entity) {
  const contract = EXPERT_ER_TOPOLOGY[pathwayId];
  if (!contract || !entity) return null;
  const key = `${entity.name}@${entity.compartment}`;
  return Object.keys(contract).find(zone => contract[zone].includes(key)) || null;
}

function expertErTopologyIssues(pathwayId, entity, point) {
  const zoneName = expertErTopologyZone(pathwayId, entity);
  if (!zoneName) return [];
  const zone = EXPERT_ER_MEMBRANE_GUIDE.zones[zoneName];
  return pointInRect(point, zone) ? [] : [`不在 ${zone.id} 内`];
}

function expertGlucoTopologyZone(pathwayId, entity) {
  const contract = EXPERT_GLUCO_TOPOLOGY[pathwayId];
  if (!contract || !entity) return null;
  const key = `${entity.name}@${entity.compartment}`;
  return Object.keys(contract).find(zone => contract[zone].includes(key)) || null;
}

function expertGlucoTopologyIssues(pathwayId, entity, point) {
  const zoneName = expertGlucoTopologyZone(pathwayId, entity);
  if (!zoneName) return [];
  const zone = EXPERT_GLUCO_GUIDE.zones[zoneName];
  return pointInRect(point, zone) ? [] : [`不在 ${zone.id} 内`];
}

module.exports = {
  EXPERT_LAYOUT_REGIONS,
  CYTOSOL_EXCLUSION_ZONES,
  MITO_MATRIX_SAFE_POLYGON,
  EXPERT_MITO_MEMBRANE_GUIDE,
  EXPERT_MITO_GUIDE_PATHWAYS,
  EXPERT_MITO_TOPOLOGY,
  EXPERT_ER_MEMBRANE_GUIDE,
  EXPERT_ER_GUIDE_PATHWAYS,
  EXPERT_ER_TOPOLOGY,
  EXPERT_GLUCO_GUIDE,
  EXPERT_GLUCO_GUIDE_PATHWAYS,
  EXPERT_GLUCO_TOPOLOGY,
  expertRegionFor,
  expertPointIssues,
  expertTopologyIssues,
  expertTopologyZone,
  expertErTopologyIssues,
  expertErTopologyZone,
  expertGlucoTopologyIssues,
  expertGlucoTopologyZone,
  pointInRect,
  pointInPolygon,
  pointInEllipse
};
