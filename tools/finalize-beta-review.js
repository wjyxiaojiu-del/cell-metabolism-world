#!/usr/bin/env node
// Synchronize the 40 public-Beta review decisions with the audit log.
const fs = require('fs');
const path = require('path');
const { readTsv } = require('./tsv.js');

const ROOT = path.join(__dirname, '..');
const REACTION_DIR = path.join(ROOT, 'data', 'reactions');
const LOG_FILE = path.join(ROOT, 'data', 'review-log.tsv');
const WRITE = process.argv.includes('--write');
const TAB = '\t';
const EXPECTED = 40;

const LOG_FIELDS = [
  '文件', '源行', '底物', '产物', '酶', '当前状态', '建议类别', '建议表示类型',
  '表示类型', '证据', '审校结论', '修改内容', '审校人', '日期'
];

const representationBySource = new Map(Object.entries({
  'aa_biosynthesis.tsv:10': '示意边',
  'aromatic_aa.tsv:7': '精确反应',
  'aromatic_aa.tsv:9': '示意边',
  'aromatic_aa.tsv:10': '示意边',
  'autophagy.tsv:8': '示意边',
  'autophagy.tsv:9': '示意边',
  'autophagy.tsv:10': '示意边',
  'bcaa.tsv:7': '示意边',
  'bcaa.tsv:8': '示意边',
  'cholesterol.tsv:9': '示意边',
  'cholesterol.tsv:10': '示意边',
  'cholesterol.tsv:11': '转运',
  'folate.tsv:10': '示意边',
  'glycosylation.tsv:7': '机制未明转运',
  'glycosylation.tsv:8': '精确反应',
  'glycosylation.tsv:9': '货物流',
  'glycosylation.tsv:10': '货物流',
  'heme.tsv:7': '示意边',
  'heme.tsv:9': '示意边',
  'heme.tsv:11': '示意边',
  'lipoprotein.tsv:9': '示意边',
  'lysosomal.tsv:6': '货物流',
  'lysosomal.tsv:7': '示意边',
  'lysosomal.tsv:8': '示意边',
  'lysosomal.tsv:9': '示意边',
  'lysosomal.tsv:10': '示意边',
  'nitrogen.tsv:7': '机制未明转运',
  'plasmalogen.tsv:8': '机制未明转运',
  'plasmalogen.tsv:9': '示意边',
  'purine.tsv:8': '示意边',
  'pyrimidine.tsv:13': '精确反应',
  'sphingolipid.tsv:10': '示意边',
  'steroid_bile.tsv:6': '转运',
  'steroid_bile.tsv:8': '示意边',
  'steroid_bile.tsv:9': '示意边',
  'steroid_bile.tsv:10': '净反应',
  'transamination.tsv:6': '示意边',
  'uronic.tsv:7': '示意边',
  'uronic.tsv:8': '转运',
  'vlcfa.tsv:10': '示意边'
}));

function clean(value) {
  return String(value || '').replace(/[\t\r\n]+/g, ' ').trim();
}

function sourceRows(file) {
  return readTsv(path.join(REACTION_DIR, file)).rows;
}

const sourcesByFile = new Map();
const log = readTsv(LOG_FILE).rows;
let matched = 0;
let changed = 0;

const output = log.map(row => {
  const file = row['文件'];
  const key = `${file}:${row['源行']}`;
  const representation = representationBySource.get(key);
  if (!representation) return row;
  matched += 1;
  if (!sourcesByFile.has(file)) sourcesByFile.set(file, sourceRows(file));
  const source = sourcesByFile.get(file).find(item => item.__lineNumber === Number(row['源行']));
  if (!source) throw new Error(`未找到源行 ${file}:${row['源行']}`);
  if (source['审校'] !== '已终审') throw new Error(`源行尚未终审 ${file}:${row['源行']}`);
  const next = {
    ...row,
    '底物': source['底物'],
    '产物': source['产物'],
    '酶': source['酶'],
    '当前状态': '已终审',
    '建议类别': representation === '货物流' ? '细胞事件'
      : representation.includes('转运') || representation === '转运' ? '区室机制'
        : representation === '精确反应' ? '其他'
          : '抽象类别',
    '建议表示类型': representation,
    '表示类型': representation,
    '证据': source['备注'],
    '审校结论': '已终审',
    '修改内容': '按有限结论终审；已同步源数据、表示类型、边界说明与机器可识别证据',
    '审校人': 'Codex',
    '日期': '2026-08-29'
  };
  if (LOG_FIELDS.some(field => clean(row[field]) !== clean(next[field]))) changed += 1;
  return next;
});

if (matched !== EXPECTED) {
  throw new Error(`预期核对 ${EXPECTED} 条，实际匹配 ${matched} 条`);
}
if (representationBySource.size !== EXPECTED) {
  throw new Error(`表示类型决策应为 ${EXPECTED} 条，实际 ${representationBySource.size} 条`);
}

if (WRITE) {
  const lines = [LOG_FIELDS.join(TAB)];
  output.forEach(row => lines.push(LOG_FIELDS.map(field => clean(row[field])).join(TAB)));
  fs.writeFileSync(LOG_FILE, lines.join('\n') + '\n', 'utf8');
}

console.log(`${WRITE ? '已同步' : '已核对'} ${matched} 条公开 Beta 科学终审记录；需更新 ${changed} 条`);
