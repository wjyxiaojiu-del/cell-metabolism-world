#!/usr/bin/env node
// 按区室计算节点坐标。闭环走环形，开链沿路径，膜上按链序排 x、按膜侧分层 y。
// 手工坐标（data/layout-overrides.tsv）永久优先。
// 用法: node tools/layout.js [--json]
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data');

const { readTsv } = require('./tsv.js');

// ---- 区室同义词与几何 ----
const zh2id = new Map();
for (const r of readTsv(path.join(DATA, 'compartments.tsv')).rows) {
  zh2id.set(r.id, r.id);
  zh2id.set(r['中文'], r.id);
  for (const s of (r['同义词'] || '').split('|')) if (s.trim()) zh2id.set(s.trim(), r.id);
}
const resolveComp = n => zh2id.get((n || '').trim()) || null;

const geom = new Map();
for (const r of readTsv(path.join(DATA, 'compartment-geometry.tsv')).rows) {
  geom.set(r.id, {
    id: r.id, zh: r['中文'], shape: r['形状'],
    cx: +r.cx, cy: +r.cy, rx: +r.rx, ry: +r.ry
  });
}

// ---- 读反应，建每个区室的子图 ----
const nodeKey = (n, c) => n + '@' + c;
const nodes = new Map();   // key -> {name, comp, side}
const edges = [];          // {from, to}

function splitAt(cell, defComp) {
  const at = cell.lastIndexOf('@');
  if (at === -1) return { name: cell, comp: defComp };
  return {
    name: cell.slice(0, at).trim(),
    comp: resolveComp(cell.slice(at + 1).trim()) || defComp
  };
}

const rxDir = path.join(DATA, 'reactions');
const rxFiles = fs.existsSync(rxDir)
  ? fs.readdirSync(rxDir).filter(x => x.endsWith('.tsv')).sort() : [];
for (const f of rxFiles) {
  const { meta, rows } = readTsv(path.join(rxDir, f));
  const defComp = resolveComp(meta['默认区室']);
  if (!defComp) continue;
  for (const row of rows) {
    if (!row['底物'] || !row['产物']) continue;
    const s = splitAt(row['底物'], defComp);
    const p = splitAt(row['产物'], defComp);
    for (const n of [s, p]) {
      const k = nodeKey(n.name, n.comp);
      if (!nodes.has(k)) nodes.set(k, { name: n.name, comp: n.comp, side: '' });
    }
    edges.push({ from: nodeKey(s.name, s.comp), to: nodeKey(p.name, p.comp) });
  }
}

// 节点属性里的膜侧
const ndDir = path.join(DATA, 'nodes');
for (const f of fs.existsSync(ndDir) ? fs.readdirSync(ndDir).filter(x => x.endsWith('.tsv')).sort() : []) {
  for (const row of readTsv(path.join(ndDir, f)).rows) {
    const comp = resolveComp(row['区室']);
    if (!comp || !row['名称']) continue;
    const k = nodeKey(row['名称'], comp);
    if (!nodes.has(k)) nodes.set(k, { name: row['名称'], comp, side: '' });
    nodes.get(k).side = row['膜侧'] || '';
  }
}

// 手工坐标：永久优先
const overrides = new Map();
const ovFile = path.join(DATA, 'layout-overrides.tsv');
if (fs.existsSync(ovFile)) {
  for (const row of readTsv(ovFile).rows) {
    const comp = resolveComp(row['区室']);
    if (!comp || !row['名称'] || !row.x || !row.y) continue;
    overrides.set(nodeKey(row['名称'], comp), { x: +row.x, y: +row.y });
  }
}

// ---- 按区室分组 ----
const byComp = new Map();
for (const [k, n] of nodes) {
  if (!byComp.has(n.comp)) byComp.set(n.comp, { keys: [], edges: [] });
  byComp.get(n.comp).keys.push(k);
}
for (const e of edges) {
  const a = nodes.get(e.from), b = nodes.get(e.to);
  if (a && b && a.comp === b.comp && byComp.has(a.comp)) byComp.get(a.comp).edges.push(e);
}

// Tarjan 强连通分量：最大的 SCC（>=3）就是环
function largestCycle(keys, subEdges) {
  const adj = new Map(keys.map(k => [k, []]));
  for (const e of subEdges) if (adj.has(e.from) && adj.has(e.to)) adj.get(e.from).push(e.to);
  let idx = 0;
  const index = new Map(), low = new Map(), onStack = new Set(), stack = [], sccs = [];
  function strong(v) {
    index.set(v, idx); low.set(v, idx); idx++;
    stack.push(v); onStack.add(v);
    for (const w of adj.get(v) || []) {
      if (!index.has(w)) { strong(w); low.set(v, Math.min(low.get(v), low.get(w))); }
      else if (onStack.has(w)) low.set(v, Math.min(low.get(v), index.get(w)));
    }
    if (low.get(v) === index.get(v)) {
      const comp = [];
      let w;
      do { w = stack.pop(); onStack.delete(w); comp.push(w); } while (w !== v);
      sccs.push(comp);
    }
  }
  for (const k of keys) if (!index.has(k)) strong(k);
  const best = sccs.filter(c => c.length >= 3).sort((a, b) => b.length - a.length)[0];
  if (!best) return null;
  // 沿环走一圈，得到真实顺序
  const inRing = new Set(best);
  const order = [best[0]];
  const used = new Set([best[0]]);
  while (order.length < best.length) {
    const cur = order[order.length - 1];
    const next = (adj.get(cur) || []).find(w => inRing.has(w) && !used.has(w));
    if (!next) break;
    order.push(next); used.add(next);
  }
  return order.length === best.length ? order : best;
}

// 最长路径顺序（开链）：按入度排序做拓扑，再取最长链
function chainOrder(keys, subEdges) {
  const adj = new Map(keys.map(k => [k, []]));
  const indeg = new Map(keys.map(k => [k, 0]));
  for (const e of subEdges) {
    if (!adj.has(e.from) || !adj.has(e.to)) continue;
    adj.get(e.from).push(e.to);
    indeg.set(e.to, indeg.get(e.to) + 1);
  }
  const starts = keys.filter(k => indeg.get(k) === 0);
  const roots = starts.length ? starts : [keys[0]];
  let best = [];
  for (const r of roots) {
    const seen = new Set(), out = [];
    const walk = v => {
      if (seen.has(v)) return;
      seen.add(v); out.push(v);
      const nx = (adj.get(v) || []).filter(w => !seen.has(w));
      nx.sort((a, b) => (adj.get(b) || []).length - (adj.get(a) || []).length);
      for (const w of nx) walk(w);
    };
    walk(r);
    if (out.length > best.length) best = out;
  }
  const rest = keys.filter(k => !best.includes(k));
  return [...best, ...rest];
}

// ---- 位置计算 ----
// 环形：沿椭圆均匀分布，顺时针（与手摆的绕行方向一致）
function placeRing(order, g, out) {
  const n = order.length;
  const rx = g.rx * 0.62, ry = g.ry * 0.62;
  const start = -Math.PI / 2;   // 从顶部起
  order.forEach((k, i) => {
    const a = start - (i / n) * Math.PI * 2;   // 顺时针
    out.set(k, { x: g.cx + rx * Math.cos(a), y: g.cy + ry * Math.sin(a), rule: '环形' });
  });
}

// 开链：沿椭圆主对角线均匀铺开，左上 → 右下
function placeChain(order, g, out) {
  const n = order.length;
  const x0 = g.cx - g.rx * 0.78, y0 = g.cy - g.ry * 0.72;
  const x1 = g.cx + g.rx * 0.55, y1 = g.cy + g.ry * 0.78;
  order.forEach((k, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1);
    out.set(k, { x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t, rule: '开链' });
  });
}

// 膜：按链序排主轴，膜侧决定垂直偏移
const SIDE_OFFSET = {
  '膜间隙侧': -1, '胞外侧': -1, '腔侧': -1,
  '两侧': 0, '': 0,
  '基质侧': 1, '胞质侧': 1
};
function placeBand(order, g, out) {
  const n = order.length;
  const x0 = g.cx - g.rx * 0.72, x1 = g.cx + g.rx * 0.72;
  const band = g.ry * 0.30;
  order.forEach((k, i) => {
    // 单节点膜区室不能使用 t=0.5：对于覆盖整细胞的质膜，
    // t=0.5 会把节点放到椭圆中心，视觉上等于把膜上物质放进胞质。
    // 让它落在膜带边缘；质膜使用底部锚点，避开细胞中央的胞质主通路。
    if (n === 1) {
      const angle = g.id === 'plasma-membrane' ? Math.PI / 2 : 0;
      const edgeX = g.cx + Math.cos(angle) * g.rx * 0.88;
      const edgeY = g.cy + Math.sin(angle) * g.ry * 0.88;
      out.set(k, { x: edgeX, y: edgeY, rule: '膜带单节点边缘' });
      return;
    }
    const t = i / (n - 1);
    const side = SIDE_OFFSET[nodes.get(k).side] ?? 0;
    out.set(k, { x: x0 + (x1 - x0) * t, y: g.cy + side * band, rule: '膜带' });
  });
}

const computed = new Map();
const report = [];
const missingGeom = new Set();

for (const [comp, sub] of [...byComp.entries()].sort()) {
  const g = geom.get(comp);
  if (!g) { missingGeom.add(comp); continue; }
  const ring = largestCycle(sub.keys, sub.edges);
  let order, kind;
  if (g.shape === '带状') {
    order = chainOrder(sub.keys, sub.edges); kind = '膜带';
    placeBand(order, g, computed);
  } else if (ring && ring.length >= 3) {
    // 环上节点走环形，其余按链接在后面
    const rest = sub.keys.filter(k => !ring.includes(k));
    placeRing(ring, g, computed);
    if (rest.length) {
      const restOrder = chainOrder(rest, sub.edges.filter(e => rest.includes(e.from) && rest.includes(e.to)));
      const gg = { ...g, cx: g.cx, cy: g.cy, rx: g.rx * 0.34, ry: g.ry * 0.34 };
      placeChain(restOrder, gg, computed);
    }
    order = ring; kind = '环形+' + rest.length + '个链尾';
  } else {
    order = chainOrder(sub.keys, sub.edges); kind = '开链';
    placeChain(order, g, computed);
  }
  report.push({ comp, zh: g.zh, n: sub.keys.length, e: sub.edges.length, kind, ringLen: ring ? ring.length : 0 });
}

// 手工坐标先作为稳定的初始锚点。全局总览还要经过一次区室内安全排布：
// 手工坐标来自早期截图，不能让它们把新节点重新压成一团或越出区室。
let overridden = 0;
for (const [k, o] of overrides) {
  if (nodes.has(k)) { computed.set(k, { x: o.x, y: o.y, rule: '手工' }); overridden++; }
}

// ---- 全局总览安全排布 ----
// 这是确定性的轻量布局，不改变通路拓扑，只把同一区室的节点分散到
// 可读范围内。专家地图选中单条通路时仍使用 expert-pathway-layout.js。
function relaxCompartment(comp, sub, g) {
  const items = sub.keys.map(key => {
    const point = computed.get(key);
    return point ? { key, x: point.x, y: point.y } : null;
  }).filter(Boolean);
  if (items.length < 2) return;

  const byKey = new Map(items.map(item => [item.key, item]));
  const localEdges = sub.edges.filter(edge => byKey.has(edge.from) && byKey.has(edge.to));
  const densityTarget = Math.sqrt((Math.PI * g.rx * g.ry) / items.length) * 0.82;
  const minDistance = Math.min(50, Math.max(30, densityTarget));
  const boundRx = g.rx * 0.90;
  const boundRy = g.ry * 0.84;
  const iterations = Math.min(900, 360 + items.length * 3);

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const movement = new Map(items.map(item => [item.key, { x: 0, y: 0 }]));

    for (let i = 0; i < items.length; i += 1) {
      for (let j = i + 1; j < items.length; j += 1) {
        const a = items[i];
        const b = items[j];
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let distance = Math.hypot(dx, dy);
        if (distance < 1) {
          const seed = (i * items.length + j + 1) * 0.731;
          dx = Math.cos(seed);
          dy = Math.sin(seed);
          distance = 1;
        }
        if (distance >= minDistance) continue;
        const force = ((minDistance - distance) / distance) * 0.95;
        const aMove = movement.get(a.key);
        const bMove = movement.get(b.key);
        aMove.x += dx * force;
        aMove.y += dy * force;
        bMove.x -= dx * force;
        bMove.y -= dy * force;
      }
    }

    // 只保留很弱的边吸引，避免拓扑节点完全随机散开；可读性优先于
    // 把每一条边都拉成同一条长直线。
    for (const edge of localEdges) {
      const a = byKey.get(edge.from);
      const b = byKey.get(edge.to);
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      const distance = Math.hypot(dx, dy);
      const desired = minDistance * 1.7;
      if (distance <= desired || distance < 1) continue;
      const force = Math.min(0.8, ((distance - desired) / distance) * 0.002);
      movement.get(a.key).x += dx * force;
      movement.get(a.key).y += dy * force;
      movement.get(b.key).x -= dx * force;
      movement.get(b.key).y -= dy * force;
    }

    for (const item of items) {
      let x = item.x + movement.get(item.key).x;
      let y = item.y + movement.get(item.key).y;
      const normalizedX = (x - g.cx) / boundRx;
      const normalizedY = (y - g.cy) / boundRy;
      const normalizedDistance = Math.hypot(normalizedX, normalizedY);
      if (normalizedDistance > 1) {
        x = g.cx + (normalizedX / normalizedDistance) * 0.995 * boundRx;
        y = g.cy + (normalizedY / normalizedDistance) * 0.995 * boundRy;
      }
      item.x = x;
      item.y = y;
    }
  }

  for (const item of items) {
    computed.set(item.key, {
      x: item.x,
      y: item.y,
      rule: '区室安全布局'
    });
  }
}

for (const [comp, sub] of byComp) {
  const g = geom.get(comp);
  if (!g) continue;
  if (g.shape === '带状') {
    // 膜区室的“位置”本身就是膜带，重新按链序排列而不是把节点
    // 推到椭圆内部；这也修正了旧手工点落到膜外的问题。
    const band = new Map();
    placeBand(chainOrder(sub.keys, sub.edges), g, band);
    for (const [key, point] of band) computed.set(key, point);
  } else {
    relaxCompartment(comp, sub, g);
  }
}

// ---- 输出 ----
// 只有直接运行时才打印；被 require 时保持安静，避免污染编译输出。
if (require.main === module) {
  console.log('=== 按区室计算布局 ===');
  console.log('节点 ' + nodes.size + '  边 ' + edges.length + '  已算出坐标 ' + computed.size);
  console.log('其中手工坐标作为初始锚点 ' + overridden + ' 个，已统一经过安全排布\n');
  console.log('区室'.padEnd(14) + '节点  边   拓扑');
  for (const r of report) {
    console.log('  ' + r.zh.padEnd(12) + String(r.n).padStart(3) + String(r.e).padStart(5) + '   ' + r.kind);
  }
  if (missingGeom.size) {
    console.log('\n缺几何定义的区室: ' + [...missingGeom].join(', '));
  }

  const points = [...computed.entries()].map(([key, point]) => ({ key, point, node: nodes.get(key) }));
  const outside = points.filter(({ point, node }) => {
    const g = geom.get(node.comp);
    return g && Math.hypot((point.x - g.cx) / g.rx, (point.y - g.cy) / g.ry) > 1;
  });
  const closePairs = [];
  let nearPairs = 0;
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      if (points[i].node.comp !== points[j].node.comp) continue;
      const distance = Math.hypot(
        points[i].point.x - points[j].point.x,
        points[i].point.y - points[j].point.y
      );
      if (distance <= 52) nearPairs += 1;
      if (distance <= 26) closePairs.push(`${points[i].key} ~ ${points[j].key}`);
    }
  }
  console.log(`全局坐标质量：越界 ${outside.length}，中心距≤26px ${closePairs.length}，近距≤52px ${nearPairs}`);
  if (outside.length || closePairs.length) {
    console.error('全局坐标安全门禁失败：存在越界或节点中心重叠');
    process.exitCode = 1;
  }

  // 与手摆坐标对比：算法是否复现了你的意图
  const cmp = [];
  for (const [k, o] of overrides) {
    if (!nodes.has(k)) continue;
    const n = nodes.get(k);
    const g = geom.get(n.comp);
    if (!g) continue;
    const sub = byComp.get(n.comp);
    if (!sub) continue;
    // 重算一次「没有手工覆盖」时算法会给的位置
    const auto = new Map();
    const ring = largestCycle(sub.keys, sub.edges);
    if (g.shape === '带状') placeBand(chainOrder(sub.keys, sub.edges), g, auto);
    else if (ring && ring.length >= 3) {
      placeRing(ring, g, auto);
      const rest = sub.keys.filter(x => !ring.includes(x));
      if (rest.length) placeChain(chainOrder(rest, sub.edges.filter(e => rest.includes(e.from) && rest.includes(e.to))),
        { ...g, rx: g.rx * 0.34, ry: g.ry * 0.34 }, auto);
    } else placeChain(chainOrder(sub.keys, sub.edges), g, auto);
    const a = auto.get(k);
    if (a) cmp.push({ k, dist: Math.hypot(a.x - o.x, a.y - o.y), comp: n.comp });
  }
  if (cmp.length) {
    cmp.sort((a, b) => a.dist - b.dist);
    const med = cmp[Math.floor(cmp.length / 2)].dist;
    const mean = cmp.reduce((s, c) => s + c.dist, 0) / cmp.length;
    console.log('\n=== 安全布局 vs 初始手摆坐标 ===');
    console.log('对比 ' + cmp.length + ' 个节点   中位偏差 ' + med.toFixed(0) + 'px   平均 ' + mean.toFixed(0) + 'px');
    console.log('最接近: ' + cmp.slice(0, 3).map(c => c.k + '(' + c.dist.toFixed(0) + ')').join('  '));
    console.log('偏差最大: ' + cmp.slice(-3).map(c => c.k + '(' + c.dist.toFixed(0) + ')').join('  '));
    console.log('\n说明：初始手摆坐标用于保留已有意图；总览会再做区室内分散和边界安全处理。');
    console.log('单通路聚焦时使用 expert-pathway-layout.js 的专属坐标。');
  }

  if (process.argv.includes('--json')) {
    const out = [];
    for (const [k, p] of computed) {
      const n = nodes.get(k);
      out.push({ key: k, name: n.name, comp: n.comp, side: n.side, x: Math.round(p.x), y: Math.round(p.y), rule: p.rule });
    }
    fs.writeFileSync(path.join(DATA, 'layout-computed.json'), JSON.stringify(out, null, 1), 'utf8');
    console.log('\n已写出 data/layout-computed.json（' + out.length + ' 个节点）');
  }

}

module.exports = { nodes, edges, computed, geom, resolveComp, readTsv };
