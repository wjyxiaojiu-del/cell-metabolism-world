// 为专家地图生成“单通路聚焦”坐标。
// 全景图仍使用 layout.js 的全局坐标；选中通路时改用这里的局部坐标，
// 避免 293 个节点共享一套区室布局后，单条通路被挤成一团。
const path = require('path');
const { readTsv } = require('./tsv.js');
const { expertRegionFor } = require('./expert-map-geometry.js');

const DATA = path.join(__dirname, '..', 'data');
const geometryRows = readTsv(path.join(DATA, 'compartment-geometry.tsv')).rows;
const geometryByCompartment = new Map(geometryRows.map(row => [row['中文'], {
  id: row.id,
  shape: row['形状'],
  cx: +row.cx,
  cy: +row.cy,
  rx: +row.rx,
  ry: +row.ry
}]));

const groupsFor = item => Array.isArray(item.group)
  ? item.group
  : String(item.group || '').trim().split(/[\s,]+/).filter(Boolean);

function firstSeenOrder(nodeIds, reactions) {
  const seen = new Set(), ordered = [];
  const add = id => {
    if (!nodeIds.has(id) || seen.has(id)) return;
    seen.add(id); ordered.push(id);
  };
  reactions.forEach(reaction => { add(reaction.from); add(reaction.to); });
  nodeIds.forEach(add);
  return ordered;
}

function weakComponents(nodeIds, reactions) {
  const adjacency = new Map([...nodeIds].map(id => [id, new Set()]));
  reactions.forEach(reaction => {
    if (!adjacency.has(reaction.from) || !adjacency.has(reaction.to)) return;
    adjacency.get(reaction.from).add(reaction.to);
    adjacency.get(reaction.to).add(reaction.from);
  });
  const components = [];
  const visited = new Set();
  for (const start of nodeIds) {
    if (visited.has(start)) continue;
    const stack = [start], component = [];
    visited.add(start);
    while (stack.length) {
      const current = stack.pop();
      component.push(current);
      for (const next of adjacency.get(current) || []) {
        if (visited.has(next)) continue;
        visited.add(next); stack.push(next);
      }
    }
    components.push(component);
  }
  return components.sort((a, b) => b.length - a.length);
}

function stronglyConnected(nodeIds, reactions) {
  const adjacency = new Map([...nodeIds].map(id => [id, []]));
  reactions.forEach(reaction => {
    if (adjacency.has(reaction.from) && adjacency.has(reaction.to)) adjacency.get(reaction.from).push(reaction.to);
  });
  let sequence = 0;
  const index = new Map(), low = new Map(), stack = [], onStack = new Set(), components = [];
  function visit(node) {
    index.set(node, sequence); low.set(node, sequence); sequence += 1;
    stack.push(node); onStack.add(node);
    for (const next of adjacency.get(node) || []) {
      if (!index.has(next)) { visit(next); low.set(node, Math.min(low.get(node), low.get(next))); }
      else if (onStack.has(next)) low.set(node, Math.min(low.get(node), index.get(next)));
    }
    if (low.get(node) !== index.get(node)) return;
    const component = [];
    let current;
    do {
      current = stack.pop(); onStack.delete(current); component.push(current);
    } while (current !== node);
    components.push(component);
  }
  nodeIds.forEach(node => { if (!index.has(node)) visit(node); });
  return components.sort((a, b) => b.length - a.length);
}

function orderedCycle(component, reactions) {
  const members = new Set(component);
  const adjacency = new Map(component.map(id => [id, []]));
  reactions.forEach(reaction => {
    if (members.has(reaction.from) && members.has(reaction.to)) adjacency.get(reaction.from).push(reaction.to);
  });
  const order = [component[0]], used = new Set(order);
  while (order.length < component.length) {
    const next = (adjacency.get(order[order.length - 1]) || []).find(id => !used.has(id));
    if (!next) break;
    order.push(next); used.add(next);
  }
  component.forEach(id => { if (!used.has(id)) order.push(id); });
  return order;
}

function topologicalLevels(nodeIds, reactions, appearanceOrder) {
  const nodes = [...nodeIds];
  const adjacency = new Map(nodes.map(id => [id, []]));
  const indegree = new Map(nodes.map(id => [id, 0]));
  reactions.forEach(reaction => {
    if (!adjacency.has(reaction.from) || !adjacency.has(reaction.to) || reaction.from === reaction.to) return;
    if (adjacency.get(reaction.from).includes(reaction.to)) return;
    adjacency.get(reaction.from).push(reaction.to);
    indegree.set(reaction.to, indegree.get(reaction.to) + 1);
  });
  const appearance = new Map(appearanceOrder.map((id, index) => [id, index]));
  const queue = nodes.filter(id => indegree.get(id) === 0)
    .sort((a, b) => (appearance.get(a) ?? 9999) - (appearance.get(b) ?? 9999));
  const level = new Map(nodes.map(id => [id, 0]));
  let consumed = 0;
  while (queue.length) {
    const current = queue.shift(); consumed += 1;
    for (const next of adjacency.get(current)) {
      level.set(next, Math.max(level.get(next), level.get(current) + 1));
      indegree.set(next, indegree.get(next) - 1);
      if (indegree.get(next) === 0) queue.push(next);
    }
  }
  if (consumed !== nodes.length) {
    // 当前分量含短回路时，以 TSV 首次出现顺序展开，避免所有节点压在同一级。
    appearanceOrder.filter(id => nodeIds.has(id)).forEach((id, index) => level.set(id, index));
  }
  const buckets = new Map();
  nodes.forEach(id => {
    const key = level.get(id) || 0;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(id);
  });
  return [...buckets.entries()].sort((a, b) => a[0] - b[0]).map(([, ids]) =>
    ids.sort((a, b) => (appearance.get(a) ?? 9999) - (appearance.get(b) ?? 9999)));
}

function safeGeometry(compartment) {
  const source = geometryByCompartment.get(compartment);
  const fallback = source || { shape: '填充', cx: 800, cy: 600, rx: 260, ry: 190 };
  // 单通路聚焦坐标必须与当前细胞照片对齐；尤其要把开放胞质和线粒体四层
  // 分开，不能继续使用相互重叠的全局区室椭圆。
  return { ...fallback, ...expertRegionFor(compartment, fallback) };
}

function clampToEllipse(point, geometry, limit = .82) {
  const dx = point.x - geometry.cx, dy = point.y - geometry.cy;
  const nx = dx / Math.max(1, geometry.rx), ny = dy / Math.max(1, geometry.ry);
  const distance = Math.hypot(nx, ny);
  if (distance <= limit) return point;
  const scale = limit / distance;
  return { ...point, x: geometry.cx + dx * scale, y: geometry.cy + dy * scale };
}

function put(layout, id, point, geometry, labelSide) {
  const safe = clampToEllipse(point, geometry, geometry.shape === '带状' ? .86 : .82);
  layout[id] = {
    x: Math.round(safe.x),
    y: Math.round(safe.y),
    labelSide: labelSide || (safe.x < geometry.cx ? 'left' : 'right')
  };
}

function placeRing(layout, cycle, region, geometry, reactions) {
  const order = orderedCycle(cycle, reactions);
  const rx = Math.min(region.w * .39, geometry.rx * .66);
  const ry = Math.min(region.h * .38, geometry.ry * .66);
  order.forEach((id, index) => {
    const angle = -Math.PI / 2 + index / order.length * Math.PI * 2;
    put(layout, id, {
      x: region.cx + Math.cos(angle) * rx,
      y: region.cy + Math.sin(angle) * ry
    }, geometry, Math.cos(angle) < -.12 ? 'left' : Math.cos(angle) > .12 ? 'right' : (Math.sin(angle) < 0 ? 'above' : 'below'));
  });
}

function placeLayered(layout, component, region, geometry, reactions, appearanceOrder) {
  const nodeIds = new Set(component);
  const localReactions = reactions.filter(reaction => nodeIds.has(reaction.from) && nodeIds.has(reaction.to));
  const levels = topologicalLevels(nodeIds, localReactions, appearanceOrder);
  if (geometry.shape === '带状') {
    const ordered = levels.flat();
    const columns = Math.min(6, ordered.length);
    ordered.forEach((id, index) => {
      const row = Math.floor(index / columns), column = index % columns;
      const rowCount = Math.ceil(ordered.length / columns);
      const x = columns === 1 ? region.cx : region.cx - region.w * .42 + column * region.w * .84 / (columns - 1);
      const y = region.cy + (row - (rowCount - 1) / 2) * Math.min(48, region.h * .36);
      put(layout, id, { x, y }, geometry, row % 2 ? 'below' : 'above');
    });
    return;
  }
  // 短链可以横向展开；长链若强行排成一行，会变成难以阅读的“念珠串”。
  const horizontal = geometry.rx / Math.max(1, geometry.ry) > 1.85 && levels.length <= 6;
  if (horizontal) {
    levels.forEach((ids, levelIndex) => {
      const x = levels.length === 1 ? region.cx : region.cx - region.w * .42 + levelIndex * region.w * .84 / (levels.length - 1);
      ids.forEach((id, itemIndex) => {
        const y = ids.length === 1 ? region.cy : region.cy - region.h * .28 + itemIndex * region.h * .56 / (ids.length - 1);
        put(layout, id, { x, y }, geometry, (levelIndex + itemIndex) % 2 ? 'below' : 'above');
      });
    });
    return;
  }
  const levelCount = levels.length;
  const verticalStep = levelCount <= 1 ? region.h : region.h * .84 / (levelCount - 1);
  // 长主链改成蛇形多列，保证相邻节点至少约 52px，不再纵向压成一串字。
  if (levelCount > 5 && verticalStep < 50 && Math.max(...levels.map(ids => ids.length)) <= 2) {
    const levelsPerColumn = Math.min(5, Math.ceil(Math.sqrt(levelCount * 1.8)));
    const columnCount = Math.ceil(levelCount / levelsPerColumn);
    levels.forEach((ids, levelIndex) => {
      const column = Math.floor(levelIndex / levelsPerColumn);
      const within = levelIndex % levelsPerColumn;
      const countInColumn = Math.min(levelsPerColumn, levelCount - column * levelsPerColumn);
      const displayRow = column % 2 ? countInColumn - 1 - within : within;
      const x = columnCount === 1 ? region.cx : region.cx - region.w * .34 + column * region.w * .68 / (columnCount - 1);
      const y = countInColumn === 1 ? region.cy : region.cy - region.h * .40 + displayRow * region.h * .80 / (countInColumn - 1);
      ids.forEach((id, itemIndex) => put(layout, id, {
        x: x + (itemIndex - (ids.length - 1) / 2) * 58,
        y
      }, geometry, column % 2 ? 'right' : 'left'));
    });
    return;
  }
  levels.forEach((ids, levelIndex) => {
    const wrappedRows = Math.ceil(ids.length / 4);
    ids.forEach((id, itemIndex) => {
      const row = Math.floor(itemIndex / 4), slot = itemIndex % 4;
      const countInRow = Math.min(4, ids.length - row * 4);
      const baseY = levelCount === 1 ? region.cy : region.cy - region.h * .42 + levelIndex * region.h * .84 / (levelCount - 1);
      const y = baseY + (row - (wrappedRows - 1) / 2) * 56;
      const x = countInRow === 1 ? region.cx : region.cx - region.w * .30 + slot * region.w * .60 / (countInRow - 1);
      const side = countInRow === 1 ? (levelIndex % 2 ? 'left' : 'right') : (x < region.cx ? 'left' : 'right');
      put(layout, id, { x, y }, geometry, side);
    });
  });
}

function placeCompartment(layout, nodeIds, reactions, compartment) {
  const geometry = safeGeometry(compartment);
  const appearanceOrder = firstSeenOrder(nodeIds, reactions);
  const components = weakComponents(nodeIds, reactions);
  const columns = components.length <= 1 ? 1 : Math.min(2, components.length);
  const rows = Math.ceil(components.length / columns);
  const dominantWithSatellites = components.length >= 2
    && components[0].length >= 8
    && components[0].length >= components.slice(1).reduce((sum, component) => sum + component.length, 0) * 1.5;
  components.forEach((component, componentIndex) => {
    const column = componentIndex % columns, row = Math.floor(componentIndex / columns);
    const region = dominantWithSatellites
      ? (componentIndex === 0
        ? { cx: geometry.cx + geometry.rx * .12, cy: geometry.cy, w: geometry.rx * 1.20, h: geometry.ry * 1.48 }
        : (() => {
            const satellites = components.length - 1;
            const satelliteIndex = componentIndex - 1;
            return {
              cx: geometry.cx - geometry.rx * .61,
              cy: geometry.cy + (satelliteIndex - (satellites - 1) / 2) * geometry.ry * .92,
              w: geometry.rx * .46,
              h: geometry.ry * 1.12 / satellites
            };
          })())
      : {
          cx: geometry.cx + (column - (columns - 1) / 2) * geometry.rx * .86,
          cy: geometry.cy + (row - (rows - 1) / 2) * geometry.ry * .80,
          w: geometry.rx * 1.52 / columns,
          h: geometry.ry * 1.48 / rows
        };
    const members = new Set(component);
    const localReactions = reactions.filter(reaction => members.has(reaction.from) && members.has(reaction.to));
    const cycle = stronglyConnected(members, localReactions).find(group => group.length >= 3);
    if (cycle && cycle.length >= Math.max(3, component.length - 2)) {
      placeRing(layout, cycle, region, geometry, localReactions);
      const remainder = component.filter(id => !cycle.includes(id));
      remainder.forEach((id, index) => put(layout, id, {
        x: region.cx + (index - (remainder.length - 1) / 2) * 62,
        y: region.cy
      }, geometry, index % 2 ? 'left' : 'right'));
    } else {
      placeLayered(layout, component, region, geometry, localReactions, appearanceOrder);
    }
  });
}

function entityIdFor(entities, name, compartment) {
  return entities.find(entity => entity.name === name && entity.compartment === compartment)?.id;
}

function applyCuratedOverrides(pathwayId, layout, entities) {
  // 线粒体基质不是水平椭圆。以下四条通路按底图中实际可见的基质
  // 安全多边形定锚，避免节点落到左下方胞质或贴在外膜边缘。
  if (pathwayId === 'pdh') {
    const curated = [
      ['丙酮酸', '细胞质', 410, 585, 'above'],
      ['丙酮酸', '线粒体膜间隙', 530, 665, 'above'],
      ['丙酮酸', '线粒体基质', 650, 835, 'above'],
      ['乙酰辅酶 A', '线粒体基质', 820, 835, 'right']
    ];
    curated.forEach(([name, compartment, x, y, labelSide]) => {
      const id = entityIdFor(entities, name, compartment);
      if (id && layout[id]) layout[id] = { x, y, labelSide, labelLocked: true };
    });
    return;
  }
  if (pathwayId === 'tca') {
    const curated = [
      ['乙酰辅酶 A', 600, 800, 'right'],
      ['草酰乙酸', 600, 740, 'above'],
      ['柠檬酸', 700, 760, 'above'],
      ['异柠檬酸', 750, 805, 'right'],
      ['α-酮戊二酸', 700, 845, 'right'],
      ['琥珀酰辅酶 A', 600, 860, 'below'],
      ['琥珀酸', 500, 845, 'left'],
      ['延胡索酸', 450, 805, 'left'],
      ['苹果酸', 500, 760, 'above']
    ];
    curated.forEach(([name, x, y, labelSide]) => {
      const id = entityIdFor(entities, name, '线粒体基质');
      if (id && layout[id]) layout[id] = { x, y, labelSide, labelLocked: true };
    });
    return;
  }
  if (pathwayId === 'beta_oxidation') {
    const curated = [
      ['脂酰-CoA', 440, 805, 'above'],
      ['烯酰-CoA', 520, 805, 'below'],
      ['β-羟脂酰-CoA', 600, 805, 'above'],
      ['β-酮脂酰-CoA', 680, 805, 'below'],
      ['乙酰辅酶 A', 760, 805, 'above']
    ];
    curated.forEach(([name, x, y, labelSide]) => {
      const id = entityIdFor(entities, name, '线粒体基质');
      if (id && layout[id]) layout[id] = { x, y, labelSide, labelLocked: true };
    });
    return;
  }
  if (pathwayId === 'ketone') {
    const curated = [
      ['乙酰辅酶 A', 480, 780, 'left'],
      ['HMG-CoA', 500, 840, 'left'],
      ['乙酰乙酰辅酶 A', 600, 840, 'below'],
      ['乙酰乙酸', 720, 800, 'right'],
      ['β-羟丁酸', 600, 740, 'above']
    ];
    curated.forEach(([name, x, y, labelSide]) => {
      const id = entityIdFor(entities, name, '线粒体基质');
      if (id && layout[id]) layout[id] = { x, y, labelSide, labelLocked: true };
    });
    return;
  }
  if (pathwayId === 'glycolysis') {
    // 糖酵解的丙酮酸是胞质终点，放在主链右上出口；不要让它压在
    // 3-磷酸甘油酸标签旁，也不要误落到下方线粒体图像上。
    const pyruvate = entityIdFor(entities, '丙酮酸', '细胞质');
    if (pyruvate && layout[pyruvate]) layout[pyruvate] = { x: 620, y: 520, labelSide: 'right' };
    return;
  }
  if (pathwayId === 'gluconeogenesis') {
    const curated = [
      ['乳酸', '细胞质', 250, 285, 'above'],
      ['丙氨酸', '细胞质', 250, 365, 'below'],
      ['丙酮酸', '细胞质', 380, 325, 'above'],
      ['苹果酸', '细胞质', 550, 260, 'above'],
      ['草酰乙酸', '细胞质', 650, 300, 'above'],
      ['磷酸烯醇式丙酮酸', '细胞质', 760, 300, 'below'],
      ['2-磷酸甘油酸', '细胞质', 870, 300, 'above'],
      ['3-磷酸甘油酸', '细胞质', 980, 300, 'below'],
      ['1,3-二磷酸甘油酸', '细胞质', 1090, 300, 'above'],
      ['甘油醛-3-磷酸', '细胞质', 1090, 420, 'right'],
      ['磷酸二羟丙酮', '细胞质', 1090, 500, 'right'],
      ['果糖-1,6-二磷酸', '细胞质', 980, 420, 'below'],
      ['果糖-6-磷酸', '细胞质', 900, 420, 'above'],
      ['葡萄糖-6-磷酸', '细胞质', 800, 420, 'below'],
      ['葡萄糖', '细胞质', 700, 420, 'above'],
      ['甘油', '细胞质', 1090, 560, 'right'],
      ['甘油-3-磷酸', '细胞质', 980, 540, 'below'],
      ['丙酮酸', '线粒体膜间隙', 380, 615, 'above'],
      ['丙酮酸', '线粒体基质', 380, 710, 'left'],
      ['草酰乙酸', '线粒体基质', 500, 710, 'below'],
      ['苹果酸', '线粒体基质', 620, 710, 'right'],
      ['葡萄糖-6-磷酸', '内质网腔', 800, 700, 'below'],
      ['葡萄糖', '内质网腔', 700, 700, 'below']
    ];
    curated.forEach(([name, compartment, x, y, labelSide]) => {
      const id = entityIdFor(entities, name, compartment);
      if (id && layout[id]) layout[id] = { x, y, labelSide, labelLocked: true };
    });
    return;
  }
  // “氨基酸碳骨架归宿”按教材标准分为七类中央代谢入口，不应把终点
  // 在椭圆边缘压成一串。这里按胞质与基质两组展开。
  if (pathwayId === 'aa_carbon') {
    const curated = [
      ['丙氨酸/丝氨酸/甘氨酸/半胱氨酸', '细胞质', 220, 400, 'left'],
      ['丙酮酸', '细胞质', 430, 400, 'right'],
      ['苯丙氨酸/酪氨酸', '细胞质', 220, 485, 'left'],
      ['延胡索酸', '细胞质', 430, 485, 'right'],
      ['天冬氨酸/天冬酰胺', '细胞质', 220, 555, 'left'],
      ['草酰乙酸', '细胞质', 430, 555, 'right'],
      ['亮氨酸/赖氨酸等', '线粒体基质', 420, 735, 'left'],
      ['乙酰辅酶 A', '线粒体基质', 650, 720, 'right'],
      ['乙酰乙酰辅酶 A', '线粒体基质', 720, 775, 'right'],
      ['谷氨酸/谷氨酰胺/精氨酸/脯氨酸/组氨酸', '线粒体基质', 420, 810, 'left'],
      ['α-酮戊二酸', '线粒体基质', 650, 815, 'right'],
      ['缬氨酸/异亮氨酸/蛋氨酸/苏氨酸', '线粒体基质', 500, 855, 'left'],
      ['琥珀酰辅酶 A', '线粒体基质', 720, 855, 'right']
    ];
    curated.forEach(([name, compartment, x, y, labelSide]) => {
      const id = entityIdFor(entities, name, compartment);
      if (id && layout[id]) layout[id] = { x, y, labelSide, labelLocked: true };
    });
    return;
  }
  if (pathwayId === 'ppp') {
    const curated = [
      ['葡萄糖-6-磷酸', 180, 410, 'left'],
      ['6-磷酸葡萄糖酸内酯', 290, 410, 'above'],
      ['6-磷酸葡萄糖酸', 400, 410, 'above'],
      ['核酮糖-5-磷酸', 510, 410, 'above'],
      ['核糖-5-磷酸', 620, 410, 'right'],
      ['木酮糖-5-磷酸', 510, 500, 'right'],
      ['景天庚酮糖-7-磷酸', 400, 500, 'above'],
      ['赤藓糖-4-磷酸', 290, 500, 'left'],
      ['甘油醛-3-磷酸', 400, 560, 'below'],
      ['果糖-6-磷酸', 550, 560, 'below']
    ];
    curated.forEach(([name, x, y, labelSide]) => {
      const id = entityIdFor(entities, name, '细胞质');
      if (id && layout[id]) layout[id] = { x, y, labelSide };
    });
    return;
  }
  if (pathwayId === 'purine') {
    const curated = [
      ['核糖-5-磷酸', 170, 430, 'left'], ['PRPP', 260, 430, 'above'],
      ['5-磷酸核糖胺', 350, 430, 'above'], ['GAR', 440, 430, 'above'],
      ['AICAR', 530, 430, 'above'], ['IMP', 550, 480, 'right'],
      ['AMP', 430, 520, 'left'], ['ATP', 300, 560, 'below'],
      ['GMP', 650, 520, 'right'], ['GTP', 540, 560, 'below']
    ];
    curated.forEach(([name, x, y, labelSide]) => {
      const id = entityIdFor(entities, name, '细胞质');
      if (id && layout[id]) layout[id] = { x, y, labelSide };
    });
    return;
  }
  if (pathwayId === 'pyrimidine') {
    const curated = [
      ['谷氨酰胺', 310, 555, 'left'], ['氨甲酰磷酸', 420, 555, 'above'],
      ['氨甲酰天冬氨酸', 540, 555, 'above'],
      // DHODH 反应的代谢物属于胞质，但该酶锚定在线粒体内膜；
      // 两个端点放在内膜上方的胞质侧，并由酶标签明确膜锚定。
      ['二氢乳清酸', 660, 555, 'above'], ['乳清酸', 790, 555, 'right'],
      ['UMP', 900, 555, 'right'], ['UTP', 790, 610, 'below'], ['CTP', 900, 610, 'right'],
      ['UDP', 420, 610, 'below'], ['dUDP', 540, 610, 'below'], ['dTMP', 660, 610, 'below']
    ];
    curated.forEach(([name, x, y, labelSide]) => {
      const id = entityIdFor(entities, name, '细胞质');
      if (id && layout[id]) layout[id] = { x, y, labelSide };
    });
    return;
  }
  if (pathwayId === 'glycogenolysis') {
    const curated = [
      ['糖原', '细胞质', 390, 400, 'above'],
      ['葡萄糖-1-磷酸', '细胞质', 540, 400, 'above'],
      ['葡萄糖-6-磷酸', '细胞质', 690, 400, 'above'],
      ['葡萄糖', '细胞质', 920, 400, 'above'],
      ['葡萄糖-6-磷酸', '内质网腔', 690, 610, 'below'],
      ['葡萄糖', '内质网腔', 920, 610, 'below']
    ];
    curated.forEach(([name, compartment, x, y, labelSide]) => {
      const id = entityIdFor(entities, name, compartment);
      if (id && layout[id]) layout[id] = { x, y, labelSide, labelLocked: true };
    });
    return;
  }
  if (pathwayId === 'transamination') {
    const curated = [
      ['氨基酸', '细胞质', 350, 600, 'above'],
      ['α-酮酸', '细胞质', 500, 600, 'above'],
      ['谷氨酸', '细胞质', 700, 600, 'above'],
      ['谷氨酸', '线粒体基质', 700, 835, 'above'],
      ['α-酮戊二酸', '线粒体基质', 820, 835, 'above'],
      ['NH₄⁺', '线粒体基质', 930, 835, 'left']
    ];
    curated.forEach(([name, compartment, x, y, labelSide]) => {
      const id = entityIdFor(entities, name, compartment);
      if (id && layout[id]) layout[id] = { x, y, labelSide, labelLocked: true };
    });
    return;
  }
  if (pathwayId === 'urea') {
    const curated = [
      ['鸟氨酸', '细胞质', 360, 605, 'above'],
      ['尿素', '细胞质', 535, 560, 'above'],
      ['精氨酸', '细胞质', 535, 605, 'below'],
      ['延胡索酸', '细胞质', 710, 560, 'above'],
      ['精氨代琥珀酸', '细胞质', 710, 605, 'below'],
      ['天冬氨酸', '细胞质', 880, 560, 'above'],
      ['瓜氨酸', '细胞质', 880, 605, 'below'],
      ['鸟氨酸', '线粒体基质', 360, 835, 'above'],
      ['NH₄⁺', '线粒体基质', 480, 885, 'below'],
      ['氨甲酰磷酸', '线粒体基质', 600, 835, 'above'],
      ['瓜氨酸', '线粒体基质', 880, 835, 'below']
    ];
    curated.forEach(([name, compartment, x, y, labelSide]) => {
      const id = entityIdFor(entities, name, compartment);
      if (id && layout[id]) layout[id] = { x, y, labelSide, labelLocked: true };
    });
    return;
  }
  // 以下五条通路涉及线粒体内膜两侧。照片中的嵴是透视结构，不能把
  // 节点随意贴到某一条可见皱褶上；这里统一投影到“细胞质—膜间隙—
  // 内膜—基质”的局部展开剖面，页面会同时显示对应教学轨道。
  if (pathwayId === 'glycerol_phosphate') {
    const curated = [
      ['NADH', '细胞质', 310, 585, 'above'],
      ['NAD⁺', '细胞质', 410, 585, 'above'],
      ['磷酸二羟丙酮', '细胞质', 540, 585, 'above'],
      ['甘油-3-磷酸', '细胞质', 690, 585, 'above'],
      ['甘油-3-磷酸', '线粒体膜间隙', 560, 665, 'above'],
      ['磷酸二羟丙酮', '线粒体膜间隙', 730, 665, 'above'],
      ['辅酶 Q', '线粒体内膜', 560, 730, 'left'],
      ['泛醇', '线粒体内膜', 760, 730, 'right']
    ];
    curated.forEach(([name, compartment, x, y, labelSide]) => {
      const id = entityIdFor(entities, name, compartment);
      if (id && layout[id]) layout[id] = { x, y, labelSide, labelLocked: true };
    });
    return;
  }
  if (pathwayId === 'oxphos') {
    const curated = [
      ['ADP', '细胞质', 400, 585, 'above'],
      ['无机磷酸', '细胞质', 600, 585, 'above'],
      ['ATP', '细胞质', 800, 585, 'above'],
      ['膜间隙 H⁺', '线粒体膜间隙', 330, 665, 'left'],
      ['ADP', '线粒体膜间隙', 480, 665, 'above'],
      ['无机磷酸', '线粒体膜间隙', 650, 665, 'above'],
      ['ATP', '线粒体膜间隙', 830, 665, 'right'],
      ['ATP 合酶', '线粒体内膜', 650, 730, 'above'],
      ['ADP', '线粒体基质', 430, 835, 'left'],
      ['无机磷酸', '线粒体基质', 650, 875, 'below'],
      ['ATP', '线粒体基质', 830, 835, 'right']
    ];
    curated.forEach(([name, compartment, x, y, labelSide]) => {
      const id = entityIdFor(entities, name, compartment);
      if (id && layout[id]) layout[id] = { x, y, labelSide, labelLocked: true };
    });
    return;
  }
  if (pathwayId === 'carnitine') {
    const curated = [
      ['脂酰-CoA', '细胞质', 380, 600, 'above'],
      ['肉碱', '细胞质', 540, 600, 'above'],
      ['脂酰肉碱', '细胞质', 720, 600, 'above'],
      ['脂酰肉碱', '线粒体膜间隙', 520, 665, 'above'],
      ['肉碱', '线粒体膜间隙', 760, 665, 'above'],
      ['脂酰肉碱', '线粒体基质', 520, 835, 'below'],
      ['肉碱', '线粒体基质', 680, 885, 'below'],
      ['脂酰-CoA', '线粒体基质', 850, 835, 'right']
    ];
    curated.forEach(([name, compartment, x, y, labelSide]) => {
      const id = entityIdFor(entities, name, compartment);
      if (id && layout[id]) layout[id] = { x, y, labelSide, labelLocked: true };
    });
    return;
  }
  if (pathwayId === 'malate_aspartate') {
    const curated = [
      ['草酰乙酸', '细胞质', 300, 600, 'above'],
      ['NADH', '细胞质', 410, 600, 'above'],
      ['NAD⁺', '细胞质', 510, 600, 'above'],
      ['苹果酸', '细胞质', 610, 600, 'above'],
      ['α-酮戊二酸', '细胞质', 710, 600, 'above'],
      ['谷氨酸', '细胞质', 810, 600, 'above'],
      ['天冬氨酸', '细胞质', 930, 600, 'right'],
      ['苹果酸', '线粒体基质', 330, 835, 'left'],
      ['NAD⁺', '线粒体基质', 430, 885, 'below'],
      ['NADH', '线粒体基质', 530, 835, 'above'],
      ['草酰乙酸', '线粒体基质', 630, 885, 'below'],
      ['α-酮戊二酸', '线粒体基质', 730, 835, 'above'],
      ['谷氨酸', '线粒体基质', 830, 885, 'below'],
      ['天冬氨酸', '线粒体基质', 930, 835, 'right']
    ];
    curated.forEach(([name, compartment, x, y, labelSide]) => {
      const id = entityIdFor(entities, name, compartment);
      if (id && layout[id]) layout[id] = { x, y, labelSide, labelLocked: true };
    });
    return;
  }
  // 呼吸链横跨基质、内膜和膜间隙，不能分别按三个同心椭圆独立排版；
  // 按电子流、质子泵和 ATP 合成三个层次手工定锚。所有内膜实体共用
  // 一条水平膜轨道，不能再散落到照片中的不同嵴上。
  if (pathwayId !== 'etc') return;
  const curated = [
    ['膜间隙 H⁺', '线粒体膜间隙', 500, 665, 'above'],
    ['细胞色素 c', '线粒体膜间隙', 705, 665, 'above'],
    ['复合体 I', '线粒体内膜', 345, 730, 'above'],
    ['复合体 II', '线粒体内膜', 425, 730, 'below'],
    ['辅酶 Q', '线粒体内膜', 500, 730, 'above'],
    ['泛醇', '线粒体内膜', 560, 730, 'below'],
    ['复合体 III', '线粒体内膜', 630, 730, 'above'],
    ['复合体 IV', '线粒体内膜', 715, 730, 'above'],
    ['质子动力势', '线粒体内膜', 795, 730, 'below'],
    ['ATP 合酶', '线粒体内膜', 875, 730, 'above'],
    ['NADH', '线粒体基质', 330, 825, 'above'],
    ['ADP', '线粒体基质', 475, 825, 'above'],
    ['无机磷酸', '线粒体基质', 535, 885, 'below'],
    ['氧', '线粒体基质', 690, 825, 'right'],
    ['水', '线粒体基质', 690, 885, 'right'],
    ['ATP', '线粒体基质', 855, 850, 'right']
  ];
  curated.forEach(([name, compartment, x, y, labelSide]) => {
    const id = entityIdFor(entities, name, compartment);
    if (id && layout[id]) layout[id] = { x, y, labelSide, labelLocked: true };
  });
}

function estimatedLabelBox(entity, point, side) {
  const width = Math.min(180, Math.max(30, [...String(entity.name || '')]
    .reduce((sum, character) => sum + (/\p{Script=Han}/u.test(character) ? 14 : 8), 0)));
  if (side === 'left') return { x1: point.x - 12 - width, x2: point.x - 12, y1: point.y - 20, y2: point.y + 1 };
  if (side === 'above') return { x1: point.x - width / 2, x2: point.x + width / 2, y1: point.y - 38, y2: point.y - 16 };
  if (side === 'below') return { x1: point.x - width / 2, x2: point.x + width / 2, y1: point.y + 7, y2: point.y + 29 };
  return { x1: point.x + 12, x2: point.x + 12 + width, y1: point.y - 20, y2: point.y + 1 };
}

function overlapArea(a, b) {
  return Math.max(0, Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1))
    * Math.max(0, Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1));
}

function resolveLabelSides(layout, entities) {
  const entityById = new Map(entities.map(entity => [entity.id, entity]));
  const placed = [];
  Object.entries(layout)
    .sort(([, a], [, b]) => a.y - b.y || a.x - b.x)
    .forEach(([id, point]) => {
      const entity = entityById.get(id);
      if (!entity) return;
      if (point.labelLocked) {
        placed.push({ id, box: estimatedLabelBox(entity, point, point.labelSide || 'right') });
        return;
      }
      const candidates = [...new Set([point.labelSide || 'right', 'left', 'right', 'above', 'below'])];
      let best = candidates[0], bestScore = Infinity, bestBox;
      candidates.forEach(side => {
        const box = estimatedLabelBox(entity, point, side);
        const score = placed.reduce((sum, item) => sum + overlapArea(box, item.box), 0);
        if (score < bestScore) { best = side; bestScore = score; bestBox = box; }
      });
      point.labelSide = best;
      placed.push({ id, box: bestBox });
    });
}

function buildPathwayLayout(pathwayId, entities, reactions) {
  const pathwayReactions = reactions.filter(reaction => groupsFor(reaction).includes(pathwayId));
  const entityById = new Map(entities.map(entity => [entity.id, entity]));
  const nodeIds = new Set(pathwayReactions.flatMap(reaction => [reaction.from, reaction.to]).filter(id => entityById.has(id)));
  const byCompartment = new Map();
  nodeIds.forEach(id => {
    const compartment = entityById.get(id).compartment;
    if (!byCompartment.has(compartment)) byCompartment.set(compartment, new Set());
    byCompartment.get(compartment).add(id);
  });
  const layout = {};
  byCompartment.forEach((ids, compartment) => placeCompartment(layout, ids, pathwayReactions, compartment));
  applyCuratedOverrides(pathwayId, layout, entities);
  resolveLabelSides(layout, entities);
  return layout;
}

function buildExpertPathwayLayouts(entities, reactions, pathwayIds) {
  const ids = pathwayIds || [...new Set(reactions.flatMap(groupsFor))];
  return Object.fromEntries(ids.map(pathwayId => [pathwayId, buildPathwayLayout(pathwayId, entities, reactions)]));
}

module.exports = {
  buildExpertPathwayLayouts,
  buildPathwayLayout,
  geometryByCompartment,
  groupsFor
};
