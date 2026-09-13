#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const CORE_PATHWAYS = [
  'pdh', 'tca', 'malate_aspartate', 'glycerol_phosphate', 'etc', 'oxphos',
  'glycolysis', 'gluconeogenesis', 'glycogenesis', 'glycogenolysis', 'ppp',
  'fa_synthesis', 'carnitine', 'beta_oxidation', 'ketone', 'transamination',
  'urea', 'aa_carbon', 'purine', 'pyrimidine', 'nucleotide_degradation'
];

const VIEWPORTS = [390, 768, 1440];
const MODES = ['learning', 'expert'];
const OWNER_FILE = path.join('docs', 'map-polish', 'owner-signoff.md');
const AUDIT_FILE = path.join('docs', 'map-polish', 'audit-register.md');

function parseArgs(argv) {
  const args = { root: path.join(__dirname, '..'), json: false };
  argv.forEach((arg, index) => {
    if (arg === '--json') args.json = true;
    else if (arg === '--root') args.root = argv[index + 1];
    else if (arg.startsWith('--root=')) args.root = arg.slice('--root='.length);
  });
  if (!args.root) throw new Error('--root 需要目录参数');
  return args;
}

function clean(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function splitMarkdownRow(line) {
  const text = line.trim();
  if (!text.startsWith('|')) return null;
  const cells = text.split('|');
  if (cells.length < 3) return null;
  return cells.slice(1, -1).map(cell => clean(cell).replace(/^`|`$/g, ''));
}

function isSeparatorRow(cells) {
  return cells.length > 0 && cells.every(cell => /^:?-{2,}:?$/.test(cell));
}

function readTable(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const header = splitMarkdownRow(lines[index]);
    if (!header || !header.length) continue;
    const separator = splitMarkdownRow(lines[index + 1] || '');
    if (!separator || !isSeparatorRow(separator)) continue;
    const rows = [];
    for (let rowIndex = index + 2; rowIndex < lines.length; rowIndex += 1) {
      const row = splitMarkdownRow(lines[rowIndex]);
      if (!row) break;
      if (row.length !== header.length) {
        throw new Error(`${path.basename(file)} 第 ${rowIndex + 1} 行列数 ${row.length}，应为 ${header.length}`);
      }
      rows.push(Object.fromEntries(header.map((name, cellIndex) => [name, row[cellIndex]])));
    }
    return { header, rows };
  }
  throw new Error(`未找到 Markdown 表格: ${file}`);
}

function parseScore(value, label) {
  const match = clean(value).match(/^(\d+)\s*\/\s*(\d+)$/);
  if (!match) throw new Error(`${label} 不是“总分/科学分”格式: ${value}`);
  return { total: Number(match[1]), science: Number(match[2]) };
}

function parseP0P1(value, label) {
  const text = clean(value).replace(/\s+/g, '');
  const match = text.match(/P0:(\d+)\/?P1:(\d+)/i) || text.match(/^(\d+)\/(\d+)$/);
  if (!match) throw new Error(`${label} 不是 P0/P1 格式: ${value}`);
  return { p0: Number(match[1]), p1: Number(match[2]) };
}

function statusToAudit(status) {
  return ({
    '待确认': '待负责人确认',
    '通过': '已通过',
    '退回': '退回'
  })[status] || null;
}

function addBlocker(blockers, message) {
  blockers.push(message);
}

function checkEvidence(root, pathwayId, mode, blockers) {
  const directory = path.join(root, 'docs', 'map-polish', 'evidence', mode, pathwayId);
  let files = [];
  if (fs.existsSync(directory)) {
    files = fs.readdirSync(directory).filter(file => fs.statSync(path.join(directory, file)).isFile());
  }
  let complete = true;
  for (const viewport of VIEWPORTS) {
    const matches = files.filter(file => new RegExp(`^\\d{4}-\\d{2}-\\d{2}-final-${viewport}\\.png$`).test(file));
    if (matches.length !== 1) {
      complete = false;
      const reason = matches.length === 0 ? '缺少 canonical final 证据' : `canonical final 证据重复（${matches.length} 份）`;
      addBlocker(blockers, `${pathwayId} ${mode} ${viewport}: ${reason}`);
    }
  }
  return complete ? VIEWPORTS.length : files.filter(file => /^\d{4}-\d{2}-\d{2}-final-(390|768|1440)\.png$/.test(file)).length;
}

function run(root) {
  const blockers = [];
  const owner = readTable(path.join(root, OWNER_FILE));
  const audit = readTable(path.join(root, AUDIT_FILE));
  const ownerRows = owner.rows;
  const auditRows = audit.rows;

  if (ownerRows.length !== CORE_PATHWAYS.length) {
    addBlocker(blockers, `负责人签核表应有 ${CORE_PATHWAYS.length} 行，实际 ${ownerRows.length} 行`);
  }
  if (auditRows.length !== CORE_PATHWAYS.length) {
    addBlocker(blockers, `审查台账应有 ${CORE_PATHWAYS.length} 行，实际 ${auditRows.length} 行`);
  }

  const pairCount = Math.min(ownerRows.length, auditRows.length, CORE_PATHWAYS.length);
  let pairCompleted = 0;
  let evidenceCompleted = 0;

  for (let index = 0; index < pairCount; index += 1) {
    const ownerRow = ownerRows[index];
    const auditRow = auditRows[index];
    const expectedId = CORE_PATHWAYS[index];
    const rawPathwayName = clean(ownerRow['通路']);
    const pathwayName = rawPathwayName.replace(new RegExp('^\\s*`?' + expectedId + '`?\\s*'), '');
    const auditId = clean(auditRow['通路 ID']);
    const ownerStatus = clean(ownerRow['负责人状态']);
    const expectedAuditStatus = statusToAudit(ownerStatus);

    if (ownerStatus !== '通过') {
      addBlocker(blockers, `${expectedId}: 负责人状态为 ${ownerStatus || '(空)'}，尚未正式确认`);
    }

    if (auditId !== expectedId) addBlocker(blockers, `${expectedId}: 审查台账通路 ID 为 ${auditId || '(空)'}`);
    if (clean(auditRow['通路名称']) !== pathwayName) {
      addBlocker(blockers, `${expectedId}: 负责人表与审查台账通路名称不一致`);
    }
    if (!expectedAuditStatus) {
      addBlocker(blockers, `${expectedId}: 未知负责人状态 ${ownerStatus || '(空)'}`);
    } else if (clean(auditRow['学习地图']) !== expectedAuditStatus || clean(auditRow['专家地图']) !== expectedAuditStatus) {
      addBlocker(blockers, `${expectedId}: 负责人状态与双地图审查状态不一致`);
    }

    let learningScore;
    let expertScore;
    try {
      learningScore = parseScore(ownerRow['学习评分'], `${expectedId} 学习评分`);
      expertScore = parseScore(ownerRow['专家评分'], `${expectedId} 专家评分`);
    } catch (error) {
      addBlocker(blockers, error.message);
    }
    for (const [label, score] of [['学习', learningScore], ['专家', expertScore]]) {
      if (score && (score.total < 90 || score.science < 24)) {
        addBlocker(blockers, `${expectedId} ${label}评分未达门槛: ${score.total}/${score.science}`);
      }
    }

    let ownerP0P1;
    let auditP0P1;
    try {
      ownerP0P1 = parseP0P1(ownerRow['P0/P1'], `${expectedId} 负责人 P0/P1`);
      auditP0P1 = parseP0P1(auditRow['P0/P1'], `${expectedId} 审查台账 P0/P1`);
    } catch (error) {
      addBlocker(blockers, error.message);
    }
    if (ownerP0P1 && (ownerP0P1.p0 !== 0 || ownerP0P1.p1 !== 0)) {
      addBlocker(blockers, `${expectedId}: 负责人表 P0/P1 非零`);
    }
    if (auditP0P1 && (auditP0P1.p0 !== 0 || auditP0P1.p1 !== 0)) {
      addBlocker(blockers, `${expectedId}: 审查台账 P0/P1 非零`);
    }

    const date = clean(ownerRow['确认日期']);
    const note = clean(ownerRow['备注/退回项']);
    if (ownerStatus === '通过' && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      addBlocker(blockers, `${expectedId}: 通过状态缺少有效确认日期`);
    }
    if (ownerStatus === '退回' && (!note || note === '—')) {
      addBlocker(blockers, `${expectedId}: 退回状态缺少备注/退回项`);
    }

    for (const mode of MODES) {
      evidenceCompleted += checkEvidence(root, expectedId, mode, blockers);
    }
    if (ownerStatus === '通过' && expectedAuditStatus === '已通过') pairCompleted += 1;
  }

  const formalCompleted = pairCompleted * 2;
  return {
    pairCount,
    pairCompleted,
    formalCompleted,
    formalTarget: CORE_PATHWAYS.length * 2,
    evidenceCompleted,
    evidenceTarget: CORE_PATHWAYS.length * MODES.length * VIEWPORTS.length,
    blockers
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  let report;
  try {
    report = run(path.resolve(args.root));
  } catch (error) {
    report = {
      pairCount: 0,
      pairCompleted: 0,
      formalCompleted: 0,
      formalTarget: CORE_PATHWAYS.length * 2,
      evidenceCompleted: 0,
      evidenceTarget: CORE_PATHWAYS.length * MODES.length * VIEWPORTS.length,
      blockers: [error.message]
    };
  }
  if (args.json) {
    process.stdout.write(`${JSON.stringify(report)}\n`);
  } else {
    console.log(`正式完成：${report.formalCompleted}/${report.formalTarget}`);
    console.log(`canonical final 证据：${report.evidenceCompleted}/${report.evidenceTarget}`);
    if (report.blockers.length) {
      console.log(`阻塞项：${report.blockers.length}`);
      report.blockers.forEach(blocker => console.log(`- ${blocker}`));
    } else {
      console.log('阻塞项：0');
    }
  }
  if (report.blockers.length) process.exitCode = 1;
}

main();
