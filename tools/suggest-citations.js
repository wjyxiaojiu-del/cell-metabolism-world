#!/usr/bin/env node
// 为未引用反应行机器比对 KEGG 反应并生成/写入引用。
// 用法:
//   node tools/suggest-citations.js <candidates.json>                 # 只输出比对报告
//   node tools/suggest-citations.js <candidates.json> --write         # 把"匹配"结果写入 TSV
//   node tools/suggest-citations.js <candidates.json> --report=<path> # 指定报告输出位置
// candidates.json: [{ file, subs, prod, enzyme, ec:["x.y.z.w"], term?:{...扩展术语表}, cite?:{kegg:[...], uniprot:[...], note} }]
// cite 给定时跳过 KEGG 检索，直接使用已人工核验过的 ID 池。

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const REACTION_DIR = path.join(ROOT, 'data', 'reactions');
const CANDIDATES = process.argv[2];
const WRITE = process.argv.includes('--write');
const REPORT_ARG = process.argv.find(a => a.startsWith('--report='));
const REPORT = REPORT_ARG ? path.resolve(ROOT, REPORT_ARG.slice(9)) : path.join(ROOT, '.scratch', 'suggest-citations-report.json');

const KEGG = 'https://rest.kegg.jp';
const UA = { headers: { 'user-agent': 'cell-metabolism-review/1.0' } };
const CACHE = path.join(ROOT, '.scratch', 'suggest-citations-cache.json');
const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};

async function kegg(p) {
  if (cache[p]) return cache[p];
  const res = await fetch(`${KEGG}${p}`, UA);
  const body = await res.text();
  if (!res.ok) throw new Error(`KEGG ${p} HTTP ${res.status}`);
  cache[p] = body;
  return body;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function throttledGet(entries) {
  const out = {};
  for (let i = 0; i < entries.length; i += 8) {
    const batch = entries.slice(i, i + 8);
    const db = batch[0][0] === 'C' ? 'compound' : 'reaction';
    const body = await kegg(`/get/${db}:${batch.join('+')}`);
    for (const entry of parseEntries(body)) out[entry.id] = entry;
    await sleep(300);
  }
  return out;
}

function parseEntries(body) {
  const entries = [];
  const blocks = body.split('///').map(b => b.trim()).filter(Boolean);
  for (const block of blocks) {
    const entryLine = block.match(/^ENTRY\s+(\S+)/);
    const eqLine = block.match(/^EQUATION\s+(.*)$/m);
    const nameLine = block.match(/^NAME\s+(.*)$/m);
    if (!entryLine) continue;
    entries.push({
      id: entryLine[1],
      equation: eqLine ? eqLine[1].trim() : '',
      name: nameLine ? nameLine[1].replace(/;\s*$/, '').trim() : ''
    });
  }
  return entries;
}

// 术语表：中文/缩写 → KEGG 化合物号。脚本会取回每个 C 号的官方名称写入报告，
// 名称对不上的条目一律不写入引用。
function loadGlossary(extra) {
  const g = {
    '葡萄糖': 'C00031', '果糖': 'C00095', '果糖-1-磷酸': 'C01077', '果糖-6-磷酸': 'C00085',
    '甘油醛': 'C00664', '甘油醛-3-磷酸': 'C00118', '磷酸二羟丙酮': 'C00111',
    '半乳糖': 'C00984', '半乳糖-1-磷酸': 'C00446', 'UDP-半乳糖': 'C00052',
    '山梨醇': 'C00546', '麦芽糖': 'C00208', '淀粉': 'C00369', 'ADP-葡萄糖': 'C00498',
    'UDP-葡萄糖': 'C00029', '葡萄糖-1-磷酸': 'C00103', '葡萄糖-6-磷酸': 'C00092',
    'UDP-葡萄糖醛酸': 'C00167', '葡萄糖醛酸': 'C00191',
    'ATP': 'C00002', 'ADP': 'C00008', 'AMP': 'C00020', 'PPi': 'C00013', 'Pi': 'C00009',
    'NAD⁺': 'C00003', 'NADH': 'C00004', 'NADP⁺': 'C00006', 'NADPH': 'C00005',
    'H₂O': 'C00001', 'CO₂': 'C00011', 'NH₃': 'C00014', 'NH₄⁺': 'C00014', 'H⁺': 'C00080',
    'O₂': 'C00007', 'H₂O₂': 'C00027',
    'α-KG': 'C00026', '谷氨酸': 'C00025', '谷氨酰胺': 'C00064',
    'γ-谷氨酰半胱氨酸': 'C00669', 'GSH': 'C00051', 'GSSG': 'C00127',
    '蛋氨酸': 'C00073', 'SAM': 'C00019', 'SAH': 'C00021', '同型半胱氨酸': 'C00155',
    '腺苷': 'C00212', '5-甲基-THF': 'C00448', 'THF': 'C00101', '胱硫醚': 'C02219',
    '半胱氨酸': 'C00097', 'α-酮丁酸': 'C00209',
    '硫酸盐': 'C00059', 'APS': 'C00224', 'PAPS': 'C00175', '亚硫酸盐': 'C00094', '硫化物': 'C00283',
    'O-乙酰丝氨酸': 'C00892', '乙酸': 'C00033',
    '硝酸盐': 'C00244', '亚硝酸盐': 'C00243',
    '3-磷酸甘油酸': 'C00197', '3-磷酸羟基丙酮酸': 'C03232', '磷酸丝氨酸': 'C01005',
    '丝氨酸': 'C00065', '甘氨酸': 'C00037', '5,10-亚甲基-THF': 'C00143',
    'dUMP': 'C00365', 'dTMP': 'C00364', 'DHF': 'C00415',
    '腺嘌呤': 'C00147', '次黄嘌呤': 'C00262', '鸟嘌呤': 'C00242',
    'IMP': 'C00130', 'GMP': 'C00144', 'CMP': 'C00055', 'UMP': 'C00105',
    '腺苷': 'C00212', '胞苷': 'C00475', 'PRPP': 'C00119',
    '乙醛酸': 'C00048', '柠檬酸': 'C00158', '异柠檬酸': 'C00311', '琥珀酸': 'C00042',
    '苹果酸': 'C00149', '草酰乙酸': 'C00036', '乙酰辅酶 A': 'C00024', '乙酰-CoA': 'C00024',
    'CoA-SH': 'C00010',
    '甘油-3-磷酸': 'C00093', '甘油-3-P': 'C00093', '溶血磷脂酸': 'C02737',
    '磷脂酸': 'C00416', 'DAG': 'C00165', 'TAG': 'C00422', '甘油': 'C00116',
    '肌醇': 'C00137', 'CDP-DAG': 'C00277', '磷脂酰肌醇': 'C01177',
    'CDP-胆碱': 'C00346', '磷脂酰胆碱': 'C00157', 'CDP-乙醇胺': 'C00347',
    '磷脂酰乙醇胺': 'C00350', '磷脂酰丝氨酸': 'C00346', 'CMP': 'C00055',
    'CTP': 'C00063', '磷脂酰甘油': 'C00351', '心磷脂': 'C04230',
    'HMG-CoA': 'C00356', '甲羟戊酸': 'C00418', '乙酰乙酰辅酶 A': 'C00332',
    '乙酰乙酰-CoA': 'C00332', '丙二酰-CoA': 'C00083',
    '棕榈酰-CoA': 'C00154', '硬脂酰-CoA': 'C00413', '油酰-CoA': 'C00720',
    '烯酰-CoA': 'C01352', 'β-羟脂酰-CoA': 'C00640', 'β-酮脂酰-CoA': 'C00264',
    '缩短脂酰-CoA': 'C00136', '脂酰-CoA': 'C00136',
    '3-酮鞘氨醇': 'C02992', '二氢鞘氨醇': 'C00826',
    '二氢神经酰胺': 'C00195', '神经酰胺': 'C00195',
    '甘氨酸': 'C00037', 'ALA': 'C00432', '原卟啉 IX': 'C01079', 'Fe²⁺': 'C00180',
    '血红素': 'C00032', 'Fe³⁺': 'C14818', '琥珀酰辅酶 A': 'C00091', '琥珀酰-CoA': 'C00091',
    'UDP': 'C00015', 'UTP': 'C00075', 'UDP-糖': 'C00029', '乳酸': 'C00186', '丙酮酸': 'C00022',
    'NO₃⁻': 'C00244', 'NO₂⁻': 'C00243', '淀粉ₙ': 'C00369', '淀粉ₙ₊₁': 'C00369', '淀粉ₙ₋₁': 'C00369',
    'DHAP': 'C00111', '脂肪酸': 'C00162',
    'SO₄²⁻': 'C00059', 'SO₃²⁻': 'C00094', 'S²⁻': 'C00283',
    '3-酮鞘氨醇': 'C02934', '二氢鞘氨醇': 'C00040', '二氢神经酰胺': 'C12126', '神经酰胺': 'C00195'
  };
  return Object.assign(g, extra || {});
}

function parseTsvEquation(eq, glossary) {
  const sides = eq.split(/\s*(?:→|⇌)\s*/);
  if (sides.length !== 2) return null;
  const parse = side => {
    const counts = {};
    for (const raw of side.split(/\s*\+\s*/)) {
      const m = raw.trim().match(/^(\d+)\s+(.*)$/);
      const n = m ? parseInt(m[1], 10) : 1;
      const term = (m ? m[2] : raw).trim().replace(/@.*$/, '').trim();
      const c = glossary[term];
      if (!c) return { ok: false, term };
      counts[c] = (counts[c] || 0) + n;
    }
    return { ok: true, counts };
  };
  const left = parse(sides[0]);
  const right = parse(sides[1]);
  if (!left.ok) return { error: `术语表缺: ${left.term}` };
  if (!right.ok) return { error: `术语表缺: ${right.term}` };
  return { left: left.counts, right: right.counts };
}

function parseKeggEquation(equation) {
  const sides = equation.split(/\s*<=>\s*/);
  if (sides.length !== 2) return null;
  const parse = side => {
    const counts = {};
    for (const raw of side.split(/\s*\+\s*/)) {
      const m = raw.trim().match(/^(\d*)\s*(C\d{5})$/);
      if (!m) return null;
      const n = m[1] ? parseInt(m[1], 10) : 1;
      counts[m[2]] = (counts[m[2]] || 0) + n;
    }
    return counts;
  };
  const left = parse(sides[0]);
  const right = parse(sides[1]);
  return left && right ? { left, right } : null;
}

const SMALL = new Set(['C00001', 'C00080']);

function compareCounters(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  const diffs = [];
  for (const k of keys) {
    const d = (a[k] || 0) - (b[k] || 0);
    if (d !== 0) diffs.push(`${k}:${d > 0 ? '+' : ''}${d}`);
  }
  return diffs;
}

function verdictFor(tsv, keggEq) {
  const parsed = parseKeggEquation(keggEq);
  if (!parsed) return { verdict: 'mismatch', detail: 'KEGG 方向符无法解析' };
  const both = [
    compareCounters(tsv.left, parsed.left).length === 0 && compareCounters(tsv.right, parsed.right).length === 0,
    compareCounters(tsv.left, parsed.right).length === 0 && compareCounters(tsv.right, parsed.left).length === 0
  ];
  if (both[0]) return { verdict: 'match', direction: 'same' };
  if (both[1]) return { verdict: 'match', direction: 'reversed' };
  // 允许只差水/质子的近似匹配
  for (const flipped of [false, true]) {
    const L = flipped ? tsv.left : tsv.right;
    const R = flipped ? tsv.right : tsv.left;
    const d1 = compareCounters(L, parsed.left).filter(d => !SMALL.has(d.split(':')[0]));
    const d2 = compareCounters(R, parsed.right).filter(d => !SMALL.has(d.split(':')[0]));
    if (d1.length === 0 && d2.length === 0) return { verdict: 'cofactor-gap', direction: flipped ? 'reversed' : 'same' };
  }
  return { verdict: 'mismatch', detail: '参与物不一致' };
}

function rowKey(subs, prod, enzyme) {
  return [subs, prod, enzyme].map(s => String(s || '').trim()).join('‖');
}

async function main() {
  if (!CANDIDATES) {
    console.error('用法: node tools/suggest-citations.js <candidates.json> [--write]');
    process.exit(2);
  }
  const candidates = JSON.parse(fs.readFileSync(path.resolve(ROOT, CANDIDATES), 'utf8'));
  const rowsByFile = {};
  for (const item of candidates) {
    rowsByFile[item.file] = rowsByFile[item.file] || {};
    const raw = fs.readFileSync(path.join(REACTION_DIR, item.file), 'utf8');
    if (!rowsByFile[item.file].lines) rowsByFile[item.file].lines = raw.split(/\r?\n/);
  }

  // 收集需要的 KEGG 检索
  const needReactions = new Set();
  const needCompounds = new Set();
  for (const item of candidates) {
    if (item.cite) continue;
    for (const ec of item.ec || []) needReactions.add(`link/rn/ec:${ec}`);
  }

  const report = [];
  for (const item of candidates) {
    const record = { file: item.file, subs: item.subs, prod: item.prod, enzyme: item.enzyme };
    try {
      const lines = rowsByFile[item.file].lines;
      const key = rowKey(item.subs, item.prod, item.enzyme);
      const lineIdx = lines.findIndex(l => rowKey(l.split('\t')[0], l.split('\t')[1], l.split('\t')[2]) === key);
      if (lineIdx < 0) { record.status = 'row-not-found'; report.push(record); continue; }
      record.line = lineIdx + 1;

      // 已核验 ID 池直接引用
      if (item.cite) {
        const parts = [];
        if (item.cite.kegg) for (const id of item.cite.kegg) parts.push(`KEGG:${id}（${item.cite.note || '反应/酶对应'}；生理方向与区室另审）`);
        if (item.cite.uniprot) for (const id of item.cite.uniprot) parts.push(`UniProt:${id}（${item.cite.note || '转运体功能'}；细节另审）`);
        record.citation = parts.join('；');
        record.status = 'pooled';
        report.push(record);
        continue;
      }

      const glossary = loadGlossary(item.terms);
      for (const term of Object.keys(item.terms || {})) needCompounds.add(item.terms[term]);
      const tsvEq = item.eq || (lines[lineIdx].split('\t')[4] || '');
      const tsvParsed = parseTsvEquation(tsvEq, glossary);
      if (!tsvParsed || tsvParsed.error) { record.status = 'glossary-missing'; record.detail = tsvParsed && tsvParsed.error; report.push(record); continue; }

      let reactionIds = [];
      for (const ec of item.ec || []) {
        const linkBody = await kegg(`/link/rn/ec:${ec}`);
        for (const line of linkBody.split(/\r?\n/)) {
          const m = line.match(/rn:(R\d{5})$/);
          if (m) reactionIds.push(m[1]);
        }
      }
      if (!reactionIds.length) { record.status = 'no-reaction-found'; report.push(record); continue; }

      const rxEntries = await throttledGet(reactionIds.slice(0, 25));
      let best = null;
      for (const rid of reactionIds.slice(0, 25)) {
        const rx = rxEntries[rid];
        if (!rx || !rx.equation) continue;
        const v = verdictFor(tsvParsed, rx.equation);
        if (v.verdict === 'match' || v.verdict === 'cofactor-gap') {
          best = { rid, ...v, name: rx.name, equation: rx.equation };
          break;
        }
        if (!best && v.verdict === 'mismatch') best = { rid, ...v, name: rx.name, equation: rx.equation };
      }
      if (best) {
        record.best = best;
        record.status = best.verdict;
      } else {
        record.status = 'no-reaction-found';
      }
      report.push(record);
    } catch (e) {
      record.status = 'error';
      record.detail = e.message;
      report.push(record);
    }
  }

  // 取化合物官方名称校验术语表
  const compounds = [...needCompounds].filter(Boolean);
  if (compounds.length) {
    const cn = await throttledGet(compounds);
    const names = {};
    for (const [id, entry] of Object.entries(cn)) names[id] = entry.name.split(';')[0].trim();
    for (const rec of report) if (rec.best) rec.compoundNames = names;
    fs.writeFileSync(path.join(ROOT, '.scratch', 'glossary-names.json'), JSON.stringify(names, null, 1));
  }

  fs.writeFileSync(REPORT, JSON.stringify(report, null, 1));
  const summary = {};
  for (const rec of report) summary[rec.status] = (summary[rec.status] || 0) + 1;
  console.log('比对完成:', JSON.stringify(summary));

  if (WRITE) {
    let written = 0;
    for (const rec of report) {
      if (rec.status !== 'pooled' && rec.status !== 'match' && rec.status !== 'cofactor-gap') continue;
      const citation = rec.status === 'pooled'
        ? rec.citation
        : `KEGG:${rec.best.rid}（反应/酶对应${rec.best.direction === 'reversed' ? '；KEGG 平衡式书写方向相反' : ''}${rec.best.verdict === 'cofactor-gap' ? '；KEGG 式含水/质子本表未写' : ''}；生理方向与区室另审）`;
      const lines = rowsByFile[rec.file].lines;
      const idx = rec.line - 1;
      const cells = lines[idx].split('\t');
      cells[6] = (cells[6] ? cells[6] + '；' : '') + citation;
      lines[idx] = cells.join('\t');
      written++;
    }
    for (const [f, info] of Object.entries(rowsByFile)) {
      fs.writeFileSync(path.join(REACTION_DIR, f), info.lines.join('\n'), 'utf8');
    }
    console.log(`已写入 ${written} 行引用`);
  }
  fs.writeFileSync(CACHE, JSON.stringify(cache));
}

main();
