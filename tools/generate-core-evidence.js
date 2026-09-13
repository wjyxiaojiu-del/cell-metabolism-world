#!/usr/bin/env node
// Inventory of traceable sources, not an automatic scientific signoff.
const fs = require('node:fs');
const path = require('node:path');
const { readTsv } = require('./tsv');

const root = path.resolve(__dirname, '..');
const outputFile = path.join(root, 'docs/map-polish/core-evidence-inventory.md');
const signoff = fs.readFileSync(path.join(root, 'docs/map-polish/owner-signoff.md'), 'utf8');
const ids = [...signoff.matchAll(/^\|\s*\d+\s*\|\s*`([^`]+)`/gm)].map(match => match[1]);
if (ids.length !== 21 || new Set(ids).size !== 21) throw new Error('Expected 21 unique core pathways in the signoff queue');
const log = readTsv(path.join(root, 'data/review-log.tsv')).rows;
const pattern = /\b(?:RHEA:\d+|KEGG:R\d{5}|R-HSA-\d+|PMID:\d{7,8}|(?:UniProt:)?[OPQ][0-9][A-Z0-9]{3}[0-9])\b/gi;
const escape = value => String(value || '—').replace(/\|/g, '\\|').replace(/[\r\n]+/g, ' ');
const refLink = ref => {
  const url = /^KEGG:/i.test(ref) ? `https://www.kegg.jp/entry/${ref.split(':')[1]}`
    : /^RHEA:/i.test(ref) ? `https://www.rhea-db.org/rhea/${ref.split(':')[1]}`
    : /^R-HSA-/i.test(ref) ? `https://reactome.org/content/detail/${ref}`
    : /^PMID:/i.test(ref) ? `https://pubmed.ncbi.nlm.nih.gov/${ref.split(':')[1]}/`
    : `https://www.uniprot.org/uniprotkb/${ref.replace(/^UniProt:/i, '')}/entry`;
  return `[${ref}](${url})`;
};
const pathways = ids.map(id => {
  const file = `${id}.tsv`;
  const parsed = readTsv(path.join(root, 'data/reactions', file));
  const rows = parsed.rows.map(row => {
    // Match the actual reaction identity; stale row numbers cannot attach evidence to another reaction.
    const entries = log.filter(item => item['文件'] === file && ['底物', '产物', '酶'].every(key => item[key] === row[key]));
    const notes = [...row['备注'].matchAll(pattern)].map(match => match[0]);
    const audit = entries.flatMap(item => [...item['证据'].matchAll(pattern)].map(match => match[0]));
    return { row, notes: [...new Set(notes)], audit: [...new Set(audit)], representation: row['表示类型'] || entries.map(item => item['表示类型']).filter(Boolean).join('；') || '未单列' };
  });
  return { id, file, name: parsed.meta['通路'] || id, rows };
});
const all = pathways.flatMap(item => item.rows);
const cited = all.filter(item => item.notes.length).length;
const linked = all.filter(item => item.notes.length || item.audit.length).length;
const lines = [
  '# 核心通路反应—证据清单', '',
  '由 `node tools/generate-core-evidence.js --write` 生成；`--check` 只检查清单是否与源文件同步，不代表科学验收通过。', '',
  `覆盖 21 条核心通路的 ${all.length} 行 TSV 记录；备注有引用 ${cited} 行；含精确匹配的审校台账引用 ${linked} 行；待补引用 ${all.length - linked} 行。`, '',
  '范围：逐条记录物质转化、酶、方向和默认区室的核验入口。共享反应按源文件计数；本表不宣称覆盖页面全部讲解、机制叠图、物种或组织特异性结论。', '',
  '引用分三层：有可识别 ID、来源内容支持具体结论、全部科学证据闭合。本表只自动统计第一层。已有引用仍须逐结论核验；原审校状态照录，不提升状态。', '',
  '本次人工核验：[糖酵解十步的来源与边界](glycolysis-evidence-2026-09-07.md)。其余引用仅列出既有记录，未在本轮重新核验来源内容。', '',
  '| 通路 | 源行数 | 备注有引用 | 待补引用（含台账） |', '|---|---:|---:|---:|',
  ...pathways.map(p => `| ${p.name} | ${p.rows.length} | ${p.rows.filter(r => r.notes.length).length} | ${p.rows.filter(r => !r.notes.length && !r.audit.length).length} |`), ''
];
for (const p of pathways) {
  lines.push(`## ${p.name}`, '', '| 源行 | 待核验结论 | 原状态 / 表示类型 | 备注来源 | 台账来源 | 证据状态 |', '|---|---|---|---|---|---|');
  for (const item of p.rows) {
    const r = item.row;
    lines.push(`| [${p.file}:${r.__lineNumber}](../../data/reactions/${p.file}#L${r.__lineNumber}) | ${escape(r['底物'])} ${r['可逆'] === '是' ? '⇌' : '→'} ${escape(r['产物'])}；${escape(r['酶'])} | ${escape(r['审校'])} / ${escape(item.representation)} | ${item.notes.map(refLink).join('、') || '—'} | ${item.audit.map(refLink).join('、') || '—'} | ${item.notes.length || item.audit.length ? '已有引用；其支持范围与其他结论待核验' : '待补引用'} |`);
  }
  lines.push('');
}
const output = lines.join('\n');
if (process.argv.includes('--write')) {
  fs.writeFileSync(outputFile, output, 'utf8');
  console.log(`Core evidence inventory: ${all.length} rows, ${linked} with references, ${all.length - linked} awaiting references`);
} else if (process.argv.includes('--check')) {
  if (!fs.existsSync(outputFile) || fs.readFileSync(outputFile, 'utf8') !== output) {
    console.error('Core evidence inventory is stale; run node tools/generate-core-evidence.js --write');
    process.exitCode = 1;
  } else console.log('Core evidence inventory matches its source files (not a scientific signoff)');
} else process.stdout.write(output);
