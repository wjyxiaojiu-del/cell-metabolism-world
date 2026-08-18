#!/usr/bin/env node
// 把 index.html 里 49 个手摆坐标导入 data/layout-overrides.tsv
// 默认只预览；显式加 --write 才写入 data/layout-overrides.tsv。
// 用法: node tools/import-svg-coords.js [--write]
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const WRITE = process.argv.includes('--write');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

function lit(name, open, close) {
  // index.html 里这些数组是 let（要能被编译数据覆盖），所以两种声明都要认。
  // 找不到锚点时必须抛错，否则 indexOf 返回 -1 会让下面 eval 掉整个 HTML。
  let s = -1;
  for (const kw of ['const', 'let', 'var']) {
    const k = kw + ' ' + name + ' = ' + open;
    const at = html.indexOf(k);
    if (at !== -1) { s = at + k.length - 1; break; }
  }
  if (s === -1) throw new Error('在 index.html 里找不到 ' + name + ' 的声明');
  let d = 0, i = s;
  for (;; i++) {
    const c = html[i];
    if (c === open) d++;
    else if (c === close) { d--; if (!d) break; }
  }
  return eval('(' + html.slice(s, i + 1) + ')');
}

const comp = fs.readFileSync(path.join(ROOT, 'data', 'compartments.tsv'), 'utf8');
const zh2id = new Map();
let header = null;
for (const line of comp.split(/\r?\n/)) {
  if (!line.trim() || line.startsWith('#')) continue;
  const c = line.split('\t');
  if (!header) { header = c; continue; }
  const id = c[0], zh = c[1], syn = c[3];
  zh2id.set(id, id);
  zh2id.set((zh || '').trim(), id);
  for (const s of (syn || '').split('|')) if (s.trim()) zh2id.set(s.trim(), id);
}

const SIDE_RE = /(基质侧|膜间隙侧|胞质侧|腔侧|胞外侧|两侧)/;

function toLeaf(raw) {
  const direct = zh2id.get((raw || '').trim());
  if (direct) return { comp: direct, side: '' };
  const m = String(raw || '').match(SIDE_RE);
  const side = m ? m[1] : '';
  let s = String(raw || '').split('/')[0].trim();
  s = s.replace(/两侧$/, '').replace(/侧$/, '').trim();
  return { comp: zh2id.get(s) || null, side };
}

const entities = lit('entities', '[', ']');
const reactions = lit('reactions', '[', ']');

// 连接数：同一物质同一区室出现多个实例时，保留连得最多的那个坐标
const degree = {};
for (const r of reactions) {
  degree[r.from] = (degree[r.from] || 0) + 1;
  degree[r.to] = (degree[r.to] || 0) + 1;
}

const failed = [];
const groups = new Map();
entities.forEach((e, order) => {
  const r = toLeaf(e.compartment);
  if (!r.comp) { failed.push(e.id + ' (' + e.compartment + ')'); return; }
  const name = e.name.replace(/（.*?）/g, '').trim();
  const key = name + '@' + r.comp;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push({
    name, comp: r.comp, x: e.x, y: e.y, side: r.side,
    id: e.id, deg: degree[e.id] || 0, order
  });
});

// 同键多实例 → 按连接数降序、原顺序升序，第一个胜出
const rows = [];
const merged = [];
const orphans = [];
for (const [key, list] of groups) {
  list.sort((a, b) => b.deg - a.deg || a.order - b.order);
  const win = list[0];
  rows.push(win);
  if (win.deg === 0) orphans.push(win);
  for (const lose of list.slice(1)) {
    merged.push({ key, win, lose, dist: Math.round(Math.hypot(win.x - lose.x, win.y - lose.y)) });
  }
}
rows.sort((a, b) => a.order - b.order);

const id2zh = new Map();
for (const [k, v] of zh2id) if (!id2zh.has(v)) id2zh.set(v, k);
const zhOf = id => {
  for (const line of comp.split(/\r?\n/)) {
    const c = line.split('\t');
    if (c[0] === id) return c[1];
  }
  return id;
};

const out = [];
out.push('#\t手工坐标覆盖。填了就永久覆盖自动布局，没列出的节点由算法在区室范围内计算。');
out.push('#\t本文件由 tools/import-svg-coords.js 从 index.html 现有坐标生成，可直接手改。');
out.push('#\tx/y 基于 1600x1200 的 viewBox。');
if (merged.length) {
  out.push('#');
  out.push('#\t以下实例因「同物质同区室即同节点」而合并，保留连接数多的坐标。');
  out.push('#\t若确需分开摆放，说明主键需要加实例列，届时再改。');
  for (const m of merged) {
    out.push(`#\t${m.key}: 保留 ${m.win.id}(${m.win.x},${m.win.y}) 连接${m.win.deg}条`
      + ` / 舍弃 ${m.lose.id}(${m.lose.x},${m.lose.y}) 连接${m.lose.deg}条，相距${m.dist}px`);
  }
}
out.push(['名称', '区室', 'x', 'y', '备注'].join('\t'));
for (const r of rows) {
  out.push([r.name, zhOf(r.comp), r.x, r.y, r.side ? '膜侧:' + r.side : ''].join('\t'));
}
const outputPath = path.join(ROOT, 'data', 'layout-overrides.tsv');
if (WRITE) fs.writeFileSync(outputPath, out.join('\n') + '\n', 'utf8');

console.log((WRITE ? '已导入 ' : '预览：可导入 ') + rows.length + ' 个坐标（源实体 ' + entities.length + ' 个）');
if (!WRITE) console.log('未写入文件；确认后使用 --write');
if (failed.length) {
  console.log('无法映射到叶区室的 ' + failed.length + ' 个:');
  for (const f of failed) console.log('   ' + f);
}
console.log('带膜侧信息的: ' + rows.filter(r => r.side).length);
if (merged.length) {
  console.log('\n合并的重复实例 ' + merged.length + ' 组（同物质同区室）:');
  for (const m of merged) {
    console.log('   ' + m.key + '  保留 ' + m.win.id + '(连' + m.win.deg + ')'
      + '  舍弃 ' + m.lose.id + '(连' + m.lose.deg + ')  相距 ' + m.dist + 'px');
  }
}
if (orphans.length) {
  console.log('\n零连接的孤立节点 ' + orphans.length + ' 个（有坐标但没有任何反应用到）:');
  for (const o of orphans) console.log('   ' + o.id + '  ' + o.name + '@' + o.comp);
}
