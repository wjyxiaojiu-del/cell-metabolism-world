#!/usr/bin/env node
// 把 index.html 里已人工核对的 49 条反应导出成 data/reactions/*.tsv
// 默认只预览；显式加 --write 才写文件，覆盖现有文件还需同时加 --force。
// 用法: node tools/export-svg-reactions.js [--write] [--force]
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const WRITE = process.argv.includes('--write');
const FORCE = process.argv.includes('--force');
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

// 区室同义词表
const comp = fs.readFileSync(path.join(ROOT, 'data', 'compartments.tsv'), 'utf8');
const zh2id = new Map(), id2zh = new Map();
let head = null;
for (const line of comp.split(/\r?\n/)) {
  if (!line.trim() || line.startsWith('#')) continue;
  const c = line.split('\t');
  if (!head) { head = c; continue; }
  const id = c[0], zh = (c[1] || '').trim(), syn = c[3];
  zh2id.set(id, id); zh2id.set(zh, id); id2zh.set(id, zh);
  for (const s of (syn || '').split('|')) if (s.trim()) zh2id.set(s.trim(), id);
}

function toLeaf(raw) {
  const direct = zh2id.get((raw || '').trim());
  if (direct) return direct;
  let s = String(raw || '').split('/')[0].trim();
  s = s.replace(/两侧$/, '').replace(/侧$/, '').trim();
  return zh2id.get(s) || null;
}

const entities = lit('entities', '[', ']');
const reactions = lit('reactions', '[', ']');
const byId = {};
for (const e of entities) byId[e.id] = e;
const cleanName = e => e.name.replace(/（.*?）/g, '').trim();

// SVG 的 group -> 文件名与通路标签
const LABEL = {
  glycolysis: ['glycolysis', '糖酵解', 'Glycolysis', 'PDF 左上糖代谢区'],
  pdh: ['pdh', '丙酮酸脱氢酶复合体', 'Pyruvate dehydrogenase', 'PDF PDH 区与用户补充'],
  tca: ['tca', '三羧酸循环', 'TCA cycle', 'PDF 中部 TCA 区'],
  etc: ['etc', '呼吸电子传递链与氧化磷酸化', 'Electron transport and oxidative phosphorylation', 'PDF 电子传递区与氧化磷酸化区'],
  transport: ['transport', '跨膜穿梭与核苷酸转运', 'Shuttles and nucleotide transport', 'PDF 电子传递区与用户补充']
};

// 已知数据错误：r21 的酶写成了细胞色素 c，但它是这条反应的受体（to 端）
const ENZYME_FIX = {
  r21: { enzyme: '复合体 III（bc1）', note: '原数据酶名误写为细胞色素 c，它是本反应的受体' },
  // r15 与 mas2b 是同一条反应（苹果酸→OAA），酶名一个带 MDH2 一个不带。统一到较明确的写法。
  r15: { enzyme: '线粒体苹果酸脱氢酶 MDH2' }
};

// 汇聚边：SVG 层只记了一个底物，导致环断开。这些边补上另一个底物到产物的连接。
// 缺了它们，TCA 这类闭环在拓扑上是开链，布局算法判不出环形。
const EXTRA_EDGES = {
  tca: [{
    from: '草酰乙酸', to: '柠檬酸', enzyme: '柠檬酸合酶', reversible: false,
    equation: '草酰乙酸 + 乙酰-CoA + H₂O → 柠檬酸 + CoA-SH',
    note: '汇聚：另一底物乙酰辅酶 A；此边使 TCA 闭环'
  }]
};

// 生成器自己会写的备注片段。除此之外的都是人写的，覆盖时必须保留。
// 必须声明在调用 writeGroup 的循环之前，否则 const 的 TDZ 会报错。
const GENERATED_NOTES = new Set(['分叉：反应式含多个产物']);
for (const list of Object.values(EXTRA_EDGES)) for (const e of list) GENERATED_NOTES.add(e.note);
for (const f of Object.values(ENZYME_FIX)) if (f.note) GENERATED_NOTES.add(f.note);

const groups = new Map();
for (const r of reactions) {
  for (const g of (Array.isArray(r.group) ? r.group : [r.group])) {
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(r);
  }
}

const outDir = path.join(ROOT, 'data', 'reactions');
if (WRITE) fs.mkdirSync(outDir, { recursive: true });

const report = [];
for (const [g, list] of groups) {
  const meta = LABEL[g];
  if (!meta) { report.push({ g, status: '跳过：无通路映射', n: list.length }); continue; }
  const [file, zhName, enName, source] = meta;

  // 默认区室取该组反应端点里出现最多的那个
  const tally = new Map();
  for (const r of list) {
    for (const side of [r.from, r.to]) {
      const c = toLeaf(byId[side]?.compartment);
      if (c) tally.set(c, (tally.get(c) || 0) + 1);
    }
  }
  const defComp = [...tally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  if (!defComp) { report.push({ g, status: '跳过：无法确定默认区室', n: list.length }); continue; }

  const target = path.join(outDir, file + '.tsv');
  if (fs.existsSync(target) && !FORCE) {
    report.push({ g, status: '已存在，跳过（--force 可覆盖）', n: list.length, file: file + '.tsv' });
    continue;
  }
  writeGroup(target, { group: g, file, zhName, enName, source, defComp, list });
  report.push({ g, status: WRITE ? '已写入' : '预览：可写入', n: list.length, file: file + '.tsv', defComp: id2zh.get(defComp) });
}

// 读取已存在文件里的人工备注，键为「底物→产物」
function existingNotes(target) {
  const keep = new Map();
  if (!fs.existsSync(target)) return keep;
  const raw = fs.readFileSync(target, 'utf8');
  let hdr = null;
  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim() || line.startsWith('#')) continue;
    const c = line.split('\t');
    if (!hdr) { hdr = c.map(x => x.trim()); continue; }
    const row = {};
    hdr.forEach((h, i) => { row[h] = (c[i] || '').trim(); });
    const note = row['备注'] || '';
    if (!note) continue;
    const human = note.split('；').map(s => s.trim())
      .filter(s => s && !GENERATED_NOTES.has(s));
    if (human.length) keep.set(row['底物'] + '>>' + row['产物'], human);
  }
  return keep;
}

function writeGroup(target, { group, zhName, enName, source, defComp, list }) {
  const preserved = existingNotes(target);
  const out = [];
  out.push(`#\t通路: ${zhName}\t${enName}`);
  out.push(`#\t默认区室: ${id2zh.get(defComp)}`);
  out.push(`#\t来源: ${source}`);
  out.push('#\t本文件由 tools/export-svg-reactions.js 从已人工核对的 SVG 层生成。');
  out.push('#\t跨区室时在名称后加 @区室 覆盖默认值。反应式留空表示无辅因子参与。');
  out.push(['底物', '产物', '酶', '可逆', '反应式', '审校', '备注'].join('\t'));

  for (const r of list) {
    const a = byId[r.from], b = byId[r.to];
    if (!a || !b) continue;
    const ca = toLeaf(a.compartment), cb = toLeaf(b.compartment);
    // 端点区室与文件默认值不同时，显式标注 @区室
    const sub = ca && ca !== defComp ? `${cleanName(a)}@${id2zh.get(ca)}` : cleanName(a);
    const pro = cb && cb !== defComp ? `${cleanName(b)}@${id2zh.get(cb)}` : cleanName(b);
    const fix = ENZYME_FIX[r.id];
    const notes = [];
    if (fix && fix.note) notes.push(fix.note);
    if (/\+/.test(r.equation || '') && /⇌|→/.test(r.equation || '')) {
      const right = (r.equation || '').split(/⇌|→/)[1] || '';
      const prods = right.split('+').map(s => s.trim()).filter(Boolean);
      if (prods.length > 1) notes.push('分叉：反应式含多个产物');
    }
    // 人工备注优先排在前面，生成的补在后面
    const human = preserved.get(sub + '>>' + pro) || [];
    const allNotes = [...human, ...notes.filter(n => !human.includes(n))];
    out.push([
      sub, pro,
      fix ? fix.enzyme : (r.enzyme || ''),
      r.reversible ? '是' : '否',
      r.equation || '',
      '已核对',
      allNotes.join('；')
    ].join('\t'));
  }
  // 汇聚边：SVG 层每条反应只记一个底物，闭环因此断开。这里补上另一个底物到产物的边。
  for (const ex of (EXTRA_EDGES[group] || [])) {
    const human = preserved.get(ex.from + '>>' + ex.to) || [];
    const notes = human.includes(ex.note) ? human : [...human, ex.note];
    out.push([
      ex.from, ex.to, ex.enzyme,
      ex.reversible ? '是' : '否',
      ex.equation || '',
      '已核对',
      notes.join('；')
    ].join(String.fromCharCode(9)));
  }
  if (WRITE) fs.writeFileSync(target, out.join('\n') + '\n', 'utf8');
}

console.log('=== 导出已核对反应 ===');
for (const r of report) {
  const bits = [r.file || r.g, `${r.n} 条`, r.status];
  if (r.defComp) bits.push(`默认区室=${r.defComp}`);
  console.log('  ' + bits.join('  '));
}
const written = report.filter(r => r.status === '已写入');
console.log(`\n写入 ${written.length} 个文件，共 ${written.reduce((a, r) => a + r.n, 0)} 条反应`);
if (!WRITE) console.log('当前为只读预览；确认后使用 --write，覆盖现有文件还需 --force');
if (Object.keys(ENZYME_FIX).length) {
  console.log('\n顺带修正的已知错误:');
  for (const [id, f] of Object.entries(ENZYME_FIX)) {
    console.log(`  ${id}: ${f.note ? f.note + ' → ' : ''}酶名改为「${f.enzyme}」`);
  }
}

module.exports = { lit, toLeaf, id2zh, entities, reactions, byId, cleanName, ROOT, WRITE, FORCE };
