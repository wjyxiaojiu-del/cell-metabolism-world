#!/usr/bin/env node
// Build a review inventory without changing reaction TSV files.
const fs = require('fs');
const path = require('path');
const { readTsv } = require('./tsv.js');

const ROOT = path.join(__dirname, '..');
const REACTION_DIR = path.join(ROOT, 'data', 'reactions');
const LOG_FILE = path.join(ROOT, 'data', 'review-log.tsv');
const PROGRESS_FILE = path.join(ROOT, 'REVIEW_PROGRESS.md');
const WRITE = process.argv.includes('--write');
const JSON_OUTPUT = process.argv.includes('--json');
const CHECK = process.argv.includes('--check');
const TAB = '\t';
const MACHINE_CITATION = /\b(?:RHEA:\d+|KEGG:R\d{5}|R-HSA-\d+|PMID:\d{7,8}|(?:UniProt:)?[OPQ][0-9][A-Z0-9]{3}[0-9])\b/i;

const LOG_FIELDS = [
  '文件', '源行', '底物', '产物', '酶', '当前状态', '建议类别', '建议表示类型',
  '表示类型', '证据', '审校结论', '修改内容', '审校人', '日期'
];

function clean(value) {
  return String(value || '').replace(/[\t\r\n]+/g, ' ').trim();
}

function endpointParts(value, defaultCompartment) {
  const text = String(value || '').trim();
  const at = text.lastIndexOf('@');
  if (at < 0) return { name: text, compartment: defaultCompartment || '' };
  return { name: text.slice(0, at).trim(), compartment: text.slice(at + 1).trim() };
}

function sourceKey(item) {
  return [item.file, item.row['底物'], item.row['产物'], item.row['酶']].map(clean).join('\u001f');
}

function logKey(row) {
  return [row['文件'], row['底物'], row['产物'], row['酶']].map(clean).join('\u001f');
}

function fileEnzymeKey(file, enzyme) {
  return [file, enzyme].map(clean).join('\u001f');
}

function suggestedCategory(item) {
  const row = item.row;
  const text = [row['底物'], row['产物'], row['酶'], row['反应式'], row['备注']].join(' ');
  const from = endpointParts(row['底物'], item.defaultCompartment);
  const to = endpointParts(row['产物'], item.defaultCompartment);
  const cellEvent = /隔离膜|自噬体|内吞|内体成熟|酸化内体|囊泡|融合|分泌|LDL-受体复合物/.test(text);
  if (cellEvent) return '细胞事件';
  if (from.compartment !== to.compartment || /转运|跨区室|进入.*腔|回到线粒体/.test(text)) return '区室机制';
  const abstractNames = new Set([
    '氨基酸', 'α-酮酸', '溶酶体货物', '自噬溶酶体', '类固醇激素',
    '胆汁酸', '维生素D', '嘌呤', '儿茶酚胺', '糖基化蛋白', '单糖'
  ]);
  if (abstractNames.has(from.name) || abstractNames.has(to.name)
    || /通用|类别|生糖入口|生酮入口|主表示边/.test(text)) return '抽象类别';
  if (/多酶|酶系|合并|多步|连续三次|后续.*反应|主表示/.test(text)) return '多步合并';
  return '其他';
}

function suggestedRepresentation(category) {
  return ({
    '抽象类别': '示意边',
    '多步合并': '净反应',
    '细胞事件': '货物流',
    '区室机制': '机制未明转运',
    '其他': '精确反应候选'
  })[category] || '待判定';
}

function loadSources() {
  const items = [];
  const files = fs.readdirSync(REACTION_DIR).filter(file => file.endsWith('.tsv')).sort();
  for (const file of files) {
    const parsed = readTsv(path.join(REACTION_DIR, file));
    for (const row of parsed.rows) {
      items.push({ file, row, defaultCompartment: parsed.meta['默认区室'] || '' });
    }
  }
  return items;
}

function loadExistingLog() {
  const rows = fs.existsSync(LOG_FILE) ? readTsv(LOG_FILE).rows : [];
  const exact = new Map(rows.map(row => [logKey(row), row]));
  const byFileEnzyme = new Map();
  rows.forEach(row => {
    const key = fileEnzymeKey(row['文件'], row['酶']);
    if (!byFileEnzyme.has(key)) byFileEnzyme.set(key, []);
    byFileEnzyme.get(key).push(row);
  });
  return { rows, exact, byFileEnzyme };
}

function priorForSource(item, existing) {
  const exact = existing.exact.get(sourceKey(item));
  if (exact) return exact;
  const candidates = existing.byFileEnzyme.get(fileEnzymeKey(item.file, item.row['酶'])) || [];
  return candidates.length === 1 ? candidates[0] : {};
}

function buildInventory(sources) {
  const existing = loadExistingLog();
  const rows = [];
  for (const item of sources.filter(item => item.row['审校'] === '待审校')) {
    const prior = priorForSource(item, existing);
    const category = suggestedCategory(item);
    rows.push({
      '文件': item.file,
      '源行': item.row.__lineNumber,
      '底物': item.row['底物'],
      '产物': item.row['产物'],
      '酶': item.row['酶'],
      '当前状态': item.row['审校'],
      '建议类别': category,
      '建议表示类型': suggestedRepresentation(category),
      '表示类型': prior['表示类型'] || '',
      '证据': prior['证据'] || '',
      '审校结论': prior['审校结论'] || '待审校',
      '修改内容': prior['修改内容'] || '',
      '审校人': prior['审校人'] || '',
      '日期': prior['日期'] || ''
    });
  }
  return rows;
}

function writeLog(rows) {
  const lines = [LOG_FIELDS.join(TAB)];
  rows.forEach(row => lines.push(LOG_FIELDS.map(field => clean(row[field])).join(TAB)));
  fs.writeFileSync(LOG_FILE, lines.join('\n') + '\n', 'utf8');
}

// The log is also an audit trail. Rebuilding the pending inventory must not
// discard rows that were completed after the inventory was first created.
function mergeCompletedAuditRows(sources, pendingRows) {
  if (!fs.existsSync(LOG_FILE)) return pendingRows;
  const sourceByKey = new Map(sources.map(item => [sourceKey(item), item]));
  const sourceByFileEnzyme = new Map();
  sources.forEach(item => {
    const key = fileEnzymeKey(item.file, item.row['酶']);
    if (!sourceByFileEnzyme.has(key)) sourceByFileEnzyme.set(key, []);
    sourceByFileEnzyme.get(key).push(item);
  });
  const pendingKeys = new Set(pendingRows.map(logKey));
  const completedRows = readTsv(LOG_FILE).rows
    .filter(row => row['审校结论'] && row['审校结论'] !== '待审校' && !pendingKeys.has(logKey(row)))
    .map(row => {
      const fallback = sourceByFileEnzyme.get(fileEnzymeKey(row['文件'], row['酶'])) || [];
      const source = sourceByKey.get(logKey(row)) || (fallback.length === 1 ? fallback[0] : null);
      return {
        ...row,
        '源行': source ? source.row.__lineNumber : row['源行'],
        '当前状态': source ? source.row['审校'] : row['当前状态']
      };
    });
  return [...pendingRows, ...completedRows].sort((a, b) =>
    a['文件'].localeCompare(b['文件'], 'zh-CN')
      || Number(a['源行']) - Number(b['源行'])
  );
}

function compareLog(expectedRows, actualRows) {
  const problems = [];
  const expectedByKey = new Map(expectedRows.map(row => [logKey(row), row]));
  const actualByKey = new Map(actualRows.map(row => [logKey(row), row]));
  for (const row of actualRows) {
    const expected = expectedByKey.get(logKey(row));
    if (!expected) {
      problems.push(`孤儿记录: ${row['文件']}:${row['源行']} ${row['底物']} -> ${row['产物']} / ${row['酶']}`);
      continue;
    }
    for (const field of ['源行', '当前状态', '建议类别', '建议表示类型']) {
      if (clean(row[field]) !== clean(expected[field])) {
        problems.push(`${row['文件']}:${row['源行']} ${field}=${row[field]}，当前应为 ${expected[field]}`);
      }
    }
  }
  for (const row of expectedRows) {
    if (!actualByKey.has(logKey(row))) {
      problems.push(`缺少记录: ${row['文件']}:${row['源行']} ${row['底物']} -> ${row['产物']} / ${row['酶']}`);
    }
  }
  return problems;
}

function countBy(rows, field) {
  const counts = new Map();
  rows.forEach(row => counts.set(row[field], (counts.get(row[field]) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN'));
}

function writeProgress(sources, rows) {
  const states = countBy(sources.map(item => ({ state: item.row['审校'] })), 'state');
  const files = countBy(rows, '文件');
  const categories = countBy(rows, '建议类别');
  const markedReviewed = sources.filter(item => ['已核对', '已终审'].includes(item.row['审校'])).length;
  const finalRows = sources.filter(item => item.row['审校'] === '已终审');
  const finalWithCitations = finalRows.filter(item => MACHINE_CITATION.test(item.row['备注'] || '')).length;
  const allWithCitations = sources.filter(item => MACHINE_CITATION.test(item.row['备注'] || '')).length;
  const lines = [
    '# 科学审校进度', '',
    `更新时间：${new Date().toISOString().slice(0, 10)}`, '',
    '## 当前基线', '',
    `- 源数据：${sources.length} 行`,
    `- 状态标记为已核对或已终审：${markedReviewed} 行`,
    `- 待审校：${rows.length} 行`,
    `- 状态分布：${states.map(([name, count]) => `${name} ${count}`).join('；')}`,
    `- 机器可识别引用覆盖：全部 ${allWithCitations}/${sources.length}；已终审 ${finalWithCitations}/${finalRows.length}`,
    '- 注意：历史“已终审”状态不等于已满足当前证据门禁。', '',
    '## 建议分类', '',
    '建议分类由规则生成，只用于排队，不等于科学结论。', '',
    '| 类别 | 行数 |', '|---|---:|',
    ...categories.map(([name, count]) => `| ${name} | ${count} |`), '',
    '## 文件进度', '',
    '| 文件 | 待审校 | 已完成 |', '|---|---:|---:|',
    ...files.map(([name, count]) => `| ${name} | ${count} | 0 |`), '',
    '## 质量门禁', '',
    '- [x] 审校状态与表示类型分离',
    '- [x] 禁止占位或未验证引用进入终审数据',
    '- [ ] 逐行核对表示类型',
    '- [ ] 逐行补充可验证证据',
    `- [ ] 为历史已终审记录补齐机器可识别证据（${finalWithCitations}/${finalRows.length}）`,
    '- [ ] 待审校记录降至 5 行以下',
    '- [x] 端点、通路与场景入口的机器交叉验证',
    '- [ ] 区室↔通路↔物种科学语义逐项复核', '',
    '详细记录见 `data/review-log.tsv`，规则见 `docs/scientific-review-policy.md`。'
  ];
  fs.writeFileSync(PROGRESS_FILE, lines.join('\n') + '\n', 'utf8');
}

const sources = loadSources();
const inventory = buildInventory(sources);
const categories = countBy(inventory, '建议类别');
const auditRows = mergeCompletedAuditRows(sources, inventory);

if (WRITE) {
  writeLog(auditRows);
  writeProgress(sources, inventory);
}

const actualRows = fs.existsSync(LOG_FILE) ? readTsv(LOG_FILE).rows : [];
const logProblems = compareLog(auditRows, actualRows);

if (JSON_OUTPUT) {
  console.log(JSON.stringify({ total: sources.length, pending: inventory.length, categories, rows: inventory }, null, 2));
} else {
  console.log('=== 科学审校清单 ===');
  console.log(`源数据 ${sources.length} 行，待审校 ${inventory.length} 行`);
  console.log(`审计台账 ${auditRows.length} 行（已完成 ${auditRows.length - inventory.length}，待审校 ${inventory.length}）`);
  console.log('建议分类: ' + categories.map(([name, count]) => `${name} ${count}`).join('，'));
  console.log(`台账一致性: ${logProblems.length ? `${logProblems.length} 个问题` : '通过'}`);
  if (logProblems.length) logProblems.slice(0, 12).forEach(problem => console.log(`  ✗ ${problem}`));
  if (logProblems.length > 12) console.log(`  … 另有 ${logProblems.length - 12} 个问题`);
  console.log(WRITE ? '已更新 data/review-log.tsv 与 REVIEW_PROGRESS.md' : '当前为只读预览；使用 --write 更新台账和进度文件');
}

if (CHECK && logProblems.length) process.exitCode = 1;
