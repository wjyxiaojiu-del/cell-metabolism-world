#!/usr/bin/env node
const assert = require('assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const COMMAND = path.join(ROOT, 'tools', 'check-owner-signoff.js');

const PATHWAYS = [
  ['pdh', '丙酮酸脱氢酶复合体'],
  ['tca', '三羧酸循环'],
  ['malate_aspartate', '苹果酸-天冬氨酸穿梭'],
  ['glycerol_phosphate', '甘油磷酸穿梭'],
  ['etc', '电子传递链'],
  ['oxphos', '氧化磷酸化'],
  ['glycolysis', '糖酵解'],
  ['gluconeogenesis', '糖异生'],
  ['glycogenesis', '糖原合成'],
  ['glycogenolysis', '糖原分解'],
  ['ppp', '磷酸戊糖途径'],
  ['fa_synthesis', '脂肪酸合成'],
  ['carnitine', '肉碱穿梭'],
  ['beta_oxidation', '脂肪酸 beta-氧化'],
  ['ketone', '酮体代谢'],
  ['transamination', '转氨与氧化脱氨'],
  ['urea', '尿素循环'],
  ['aa_carbon', '氨基酸碳骨架去向'],
  ['purine', '嘌呤代谢'],
  ['pyrimidine', '嘧啶代谢'],
  ['nucleotide_degradation', '核苷酸降解']
];

function ownerRow(index, [id, name], status = '通过', date = '2026-08-31', note = '负责人确认') {
  const cells = [
    String(index + 1).padStart(2, '0'), `\`${id}\` ${name}`, status, status,
    '通过', '通过', '通过', '94/25', '94/25', '0/0', status, date, note
  ];
  return `| ${cells.join(' | ')} |`;
}

function auditRow(index, [id, name], status = '已通过') {
  return `| ${String(index + 1).padStart(2, '0')} | 生物化学 | \`${id}\` | ${name} | ${status} | 94/25 | ${status} | 94/25 | P0:0 / P1:0 | ${status} |`;
}

function writeFixture({ ownerStatuses, ownerDates, evidence = true, ownerNotes } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cell-metabolism-owner-signoff-'));
  const ownerLines = [
    '# 负责人逐图签核表', '',
    '| # | 通路 | 学习图 | 专家图 | 390 | 768 | 1440 | 学习评分 | 专家评分 | P0/P1 | 负责人状态 | 确认日期 | 备注/退回项 |',
    '|---:|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...PATHWAYS.map((pathway, index) => ownerRow(
      index,
      pathway,
      ownerStatuses?.[index] || '通过',
      ownerDates?.[index] || '2026-08-31',
      ownerNotes?.[index] || '负责人确认'
    ))
  ];
  const auditLines = [
    '# 21 条核心通路双地图审查台账', '',
    '| 序号 | 专题 | 通路 ID | 通路名称 | 学习地图 | 学习评分 | 专家地图 | 专家评分 | P0/P1 | 当前动作 |',
    '|---:|---|---|---|---|---|---|---|---|---|',
    ...PATHWAYS.map((pathway, index) => auditRow(index, pathway, ownerStatuses?.[index] === '待确认' ? '待负责人确认' : '已通过'))
  ];
  fs.mkdirSync(path.join(root, 'docs', 'map-polish'), { recursive: true });
  fs.writeFileSync(path.join(root, 'docs', 'map-polish', 'owner-signoff.md'), ownerLines.join('\n') + '\n');
  fs.writeFileSync(path.join(root, 'docs', 'map-polish', 'audit-register.md'), auditLines.join('\n') + '\n');
  if (evidence) {
    for (const [id] of PATHWAYS) {
      for (const mode of ['learning', 'expert']) {
        const dir = path.join(root, 'docs', 'map-polish', 'evidence', mode, id);
        fs.mkdirSync(dir, { recursive: true });
        for (const viewport of [390, 768, 1440]) {
          fs.writeFileSync(path.join(dir, `2026-08-31-final-${viewport}.png`), Buffer.from([0x89, 0x50, 0x4e, 0x47]));
        }
      }
    }
  }
  return root;
}

function run(root) {
  const result = spawnSync(process.execPath, [COMMAND, '--root', root, '--json'], {
    encoding: 'utf8'
  });
  return { ...result, output: `${result.stdout || ''}${result.stderr || ''}` };
}

function cleanup(root) {
  fs.rmSync(root, { recursive: true, force: true });
}

function testAllConfirmedPasses() {
  const root = writeFixture();
  try {
    const result = run(root);
    assert.equal(result.status, 0, result.output);
    const report = JSON.parse(result.stdout);
    assert.equal(report.formalCompleted, 42);
    assert.equal(report.evidenceCompleted, 126);
    assert.deepEqual(report.blockers, []);
  } finally {
    cleanup(root);
  }
}

function testPendingSignoffFails() {
  const statuses = PATHWAYS.map(() => '通过');
  statuses[0] = '待确认';
  const root = writeFixture({ ownerStatuses: statuses, ownerDates: ['—'] });
  try {
    const result = run(root);
    assert.equal(result.status, 1, result.output);
    const report = JSON.parse(result.stdout);
    assert.equal(report.formalCompleted, 40);
    assert.ok(report.blockers.some(blocker => blocker.includes('pdh')));
  } finally {
    cleanup(root);
  }
}

function testMissingEvidenceFails() {
  const root = writeFixture({ evidence: false });
  try {
    const result = run(root);
    assert.equal(result.status, 1, result.output);
    const report = JSON.parse(result.stdout);
    assert.ok(report.blockers.some(blocker => blocker.includes('缺少 canonical final 证据')));
  } finally {
    cleanup(root);
  }
}

function testMissingDateFails() {
  const root = writeFixture({ ownerDates: ['—'] });
  try {
    const result = run(root);
    assert.equal(result.status, 1, result.output);
    const report = JSON.parse(result.stdout);
    assert.ok(report.blockers.some(blocker => blocker.includes('缺少有效确认日期')));
  } finally {
    cleanup(root);
  }
}

function testScoreThresholdFails() {
  const root = writeFixture();
  try {
    const file = path.join(root, 'docs', 'map-polish', 'owner-signoff.md');
    const content = fs.readFileSync(file, 'utf8').replace('| 94/25 | 94/25 |', '| 89/23 | 94/25 |');
    fs.writeFileSync(file, content);
    const result = run(root);
    assert.equal(result.status, 1, result.output);
    const report = JSON.parse(result.stdout);
    assert.ok(report.blockers.some(blocker => blocker.includes('评分未达门槛')));
  } finally {
    cleanup(root);
  }
}

function testP0P1Fails() {
  const root = writeFixture();
  try {
    const file = path.join(root, 'docs', 'map-polish', 'owner-signoff.md');
    const content = fs.readFileSync(file, 'utf8').replace('| 0/0 | 通过 |', '| 1/0 | 通过 |');
    fs.writeFileSync(file, content);
    const result = run(root);
    assert.equal(result.status, 1, result.output);
    const report = JSON.parse(result.stdout);
    assert.ok(report.blockers.some(blocker => blocker.includes('P0/P1 非零')));
  } finally {
    cleanup(root);
  }
}

function testMismatchedAuditStatusFails() {
  const root = writeFixture();
  try {
    const file = path.join(root, 'docs', 'map-polish', 'audit-register.md');
    const content = fs.readFileSync(file, 'utf8').replace('| 已通过 | 94/25 | 已通过 |', '| 待负责人确认 | 94/25 | 已通过 |');
    fs.writeFileSync(file, content);
    const result = run(root);
    assert.equal(result.status, 1, result.output);
    const report = JSON.parse(result.stdout);
    assert.ok(report.blockers.some(blocker => blocker.includes('状态不一致')));
  } finally {
    cleanup(root);
  }
}

function testDuplicateEvidenceFails() {
  const root = writeFixture();
  try {
    const directory = path.join(root, 'docs', 'map-polish', 'evidence', 'learning', PATHWAYS[0][0]);
    fs.copyFileSync(
      path.join(directory, '2026-08-31-final-390.png'),
      path.join(directory, '2026-08-30-final-390.png')
    );
    const result = run(root);
    assert.equal(result.status, 1, result.output);
    const report = JSON.parse(result.stdout);
    assert.ok(report.blockers.some(blocker => blocker.includes('证据重复')));
  } finally {
    cleanup(root);
  }
}

testAllConfirmedPasses();
testPendingSignoffFails();
testMissingEvidenceFails();
testMissingDateFails();
testScoreThresholdFails();
testP0P1Fails();
testMismatchedAuditStatusFails();
testDuplicateEvidenceFails();
console.log('owner signoff audit CLI tests passed');
