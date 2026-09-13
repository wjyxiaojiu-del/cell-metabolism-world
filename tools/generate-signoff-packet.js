#!/usr/bin/env node
// 为负责人签核生成单通路对的一页式核对清单。
// 用法：node tools/generate-signoff-packet.js --pathway=<id> | --all [--out=<dir>]
// 只读工具：汇总 owner-signoff.md 行、三档证据文件、该通路 TSV 的引用覆盖，
// 输出 markdown 到 docs/map-polish/signoff-packets/（或 --out 指定目录）。

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SIGNOFF = path.join(ROOT, 'docs', 'map-polish', 'owner-signoff.md');
const EVIDENCE = path.join(ROOT, 'docs', 'map-polish', 'evidence');
const REACTIONS = path.join(ROOT, 'data', 'reactions');
const OUT_DEFAULT = path.join(ROOT, 'docs', 'map-polish', 'signoff-packets');

const arg = (prefix, fallback) => {
  const hit = process.argv.find(a => a.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : fallback;
};

const pathwayArg = arg('--pathway=', null);
const all = process.argv.includes('--all');
const outDir = path.resolve(ROOT, arg('--out=', OUT_DEFAULT));
const TOKEN = /\b(?:RHEA:\d+|KEGG:R\d{5}|R-HSA-\d+|PMID:\d{7,8}|(?:UniProt:)?[OPQ][0-9][A-Z0-9]{3}[0-9])\b/;

function loadSignoffRows() {
  const lines = fs.readFileSync(SIGNOFF, 'utf8').split(/\r?\n/);
  const rows = [];
  for (const line of lines) {
    if (!line.startsWith('| ') || line.includes('|---')) continue;
    const cells = line.split('|').slice(1, -1).map(c => c.trim());
    if (cells.length < 12 || !/^\d+$/.test(cells[0])) continue;
    rows.push({
      no: cells[0],
      id: cells[1].replace(/`/g, '').split(/\s+/)[0],
      title: cells[1].replace(/`/g, '').replace(/^\S+\s*/, ''),
      learningStatus: cells[2],
      expertStatus: cells[3],
      viewports: [cells[4], cells[5], cells[6]],
      learningScore: cells[7],
      expertScore: cells[8],
      p0p1: cells[9],
      ownerStatus: cells[10],
      confirmDate: cells[11],
      remark: cells[12] || ''
    });
  }
  return rows;
}

function evidenceFiles(mode, id) {
  const dir = path.join(EVIDENCE, mode, id);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.startsWith('2026') && f.endsWith('.png') && f.includes('final'))
    .sort()
    .map(f => {
      const full = path.join(dir, f);
      return { file: f, kb: Math.round(fs.statSync(full).size / 1024), rel: path.relative(ROOT, full) };
    });
}

function reactionSummary(id) {
  const file = path.join(REACTIONS, `${id}.tsv`);
  if (!fs.existsSync(file)) return { total: 0, cited: 0, caveats: [] };
  const rows = fs.readFileSync(file, 'utf8').split(/\r?\n/)
    .filter(l => l && !l.startsWith('#') && !l.startsWith('底物'));
  const caveats = [];
  let cited = 0;
  for (const row of rows) {
    const cells = row.split('\t');
    const note = cells[6] || '';
    if (TOKEN.test(row)) cited += 1;
    else if (cells[5] === '已终审') caveats.push(`${cells[0]} → ${cells[1]}：无数据库级引用（${note || '政策性留空'}）`);
  }
  return { total: rows.length, cited, caveats };
}

function packet(row) {
  const learning = evidenceFiles('learning', row.id);
  const expert = evidenceFiles('expert', row.id);
  const sci = reactionSummary(row.id);
  const lines = [];
  lines.push(`# 签核清单：${row.id} ${row.title}`);
  lines.push('');
  lines.push(`台账状态：负责人 ${row.ownerStatus}（学习 ${row.learningStatus} / 专家 ${row.expertStatus}）· 确认日期 ${row.confirmDate}`);
  lines.push(`评分：学习 ${row.learningScore} · 专家 ${row.expertScore} · P0/P1 ${row.p0p1}`);
  if (row.remark && row.remark !== '—') lines.push(`台账备注：${row.remark}`);
  lines.push('');
  lines.push('## 证据核对（3 档 × 2 模式）');
  lines.push('');
  lines.push('| 档位 | 学习图 | 专家图 |');
  lines.push('|---|---|---|');
  for (const vp of [390, 768, 1440]) {
    const l = learning.find(f => f.file.includes(`-${vp}`));
    const e = expert.find(f => f.file.includes(`-${vp}`));
    lines.push(`| ${vp} | ${l ? `[${l.file}](${l.rel}) ${l.kb}KB` : '**缺失**'} | ${e ? `[${e.file}](${e.rel}) ${e.kb}KB` : '**缺失**'} |`);
  }
  lines.push('');
  lines.push(`其余过程截图：学习 ${learning.length - 3} 张 · 专家 ${expert.length - 3} 张（同目录）。`);
  lines.push('');
  lines.push('## 科学快照');
  lines.push('');
  lines.push(`- 源数据 ${sci.total} 行，机器可识别引用 ${sci.cited} 行。`);
  for (const caveat of sci.caveats.slice(0, 8)) lines.push(`- 留空：${caveat}`);
  if (sci.caveats.length > 8) lines.push(`- …另有 ${sci.caveats.length - 8} 行留空，见 data/reactions/${row.id}.tsv 备注。`);
  lines.push('');
  lines.push('## 签核标准（来自 owner-signoff.md）');
  lines.push('');
  lines.push('- 390、768、1440 三档均实际打开并操作。');
  lines.push('- 学习图能看懂主线、输入、输出、区室、关键步骤和相邻出口。');
  lines.push('- 专家图能确认区室、膜侧、方向、转运、反应机制和边界。');
  lines.push('- 两张图没有事实、方向、区室或边界矛盾。');
  lines.push('- 总分 ≥90/100，科学准确性 ≥24/25，P0/P1 = 0。');
  lines.push('');
  lines.push('## 结论（人工填写）');
  lines.push('');
  lines.push('- [ ] 通过 → 在 owner-signoff.md 本行填写确认日期');
  lines.push('- [ ] 退回 → 在 owner-signoff.md 本行备注退回项，只处理本通路对');
  lines.push('');
  return lines.join('\n');
}

function main() {
  const rows = loadSignoffRows();
  if (!rows.length) {
    console.error('owner-signoff.md 未解析到行');
    process.exit(1);
  }
  const targets = all ? rows.filter(r => r.ownerStatus === '待确认') : rows.filter(r => r.id === pathwayArg);
  if (!targets.length) {
    console.error(`未找到目标通路：${pathwayArg || '(--all 无待确认行)'}`);
    process.exit(1);
  }
  fs.mkdirSync(outDir, { recursive: true });
  for (const row of targets) {
    const file = path.join(outDir, `${row.id}-signoff-packet.md`);
    fs.writeFileSync(file, packet(row));
    console.log('已生成', path.relative(ROOT, file));
  }
  if (all) {
    const index = ['# 待确认签核包索引', '',
      `生成时间：${new Date().toISOString().slice(0, 10)} · 待确认 ${targets.length} 对`, '',
      '| # | 通路 | 状态 | 清单 |', '|---:|---|---|---|',
      ...targets.map(r => `| ${r.no} | ${r.id} ${r.title} | ${r.ownerStatus} | [${r.id}-signoff-packet.md](${path.basename(outDir)}/${r.id}-signoff-packet.md) |`)
    ].join('\n');
    fs.writeFileSync(path.join(outDir, 'index.md'), index);
    console.log('已生成', path.relative(ROOT, path.join(outDir, 'index.md')));
  }
}

main();
