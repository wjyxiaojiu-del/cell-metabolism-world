#!/usr/bin/env node
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { readTsv } = require('./tsv.js');
const stepResolver = require('../student-step-resolver.js');

const ROOT = path.join(__dirname, '..');
const OUTPUT = path.join(ROOT, 'STATS.md');
const WRITE = process.argv.includes('--write');
const CHECK = process.argv.includes('--check');
const compiledFile = path.join(ROOT, 'data-compiled.js');
const sceneDataFile = path.join(ROOT, 'scene-data.js');
const context = { window: {} };
const sceneDataSource = fs.readFileSync(sceneDataFile, 'utf8');
vm.runInNewContext(sceneDataSource, context);
vm.runInNewContext(fs.readFileSync(compiledFile, 'utf8'), context);
const compiled = context.window.METABOLIC_COMPILED;
const atlas = context.window.METABOLIC_ATLAS_DATA;
const routeGroups = {
  glycolysis: 'glycolysis', pdh: 'pdh', tca: 'tca', etc: 'etc', oxphos: 'etc',
  malate_aspartate: 'transport', glycerol_phosphate: 'transport', atp_transport: 'transport'
};
const stepAudit = stepResolver.auditPathways({
  pathways: atlas.pathways,
  entities: compiled.entities,
  reactions: compiled.reactions,
  entityById: Object.fromEntries(compiled.entities.map(entity => [entity.id, entity])),
  routeGroups
});

const reactionDir = path.join(ROOT, 'data', 'reactions');
const reactionFiles = fs.readdirSync(reactionDir).filter(file => file.endsWith('.tsv')).sort();
const sourceRows = reactionFiles.flatMap(file => readTsv(path.join(reactionDir, file)).rows);
const states = new Map();
sourceRows.forEach(row => states.set(row['审校'], (states.get(row['审校']) || 0) + 1));
const compartments = readTsv(path.join(ROOT, 'data', 'compartments.tsv'));
const compartmentNames = new Set();
compartments.rows.forEach(row => {
  [row.id, row['中文'], ...(row['同义词'] || '').split('|')].map(value => String(value || '').trim()).filter(Boolean)
    .forEach(value => compartmentNames.add(value));
});
const overrides = readTsv(path.join(ROOT, 'data', 'layout-overrides.tsv')).rows.length;
const participantOccurrences = compiled.reactions.reduce((count, reaction) => count + (reaction.participants?.length || 0), 0);
const crossPathwayParticipants = (compiled.participantCatalog || []).filter(item => (item.pathwayIds || []).length > 1).length;
const assetSources = [sceneDataSource, fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')].join('\n');
const assetReferences = [...new Set([...assetSources.matchAll(/cell-metabolism-assets\/(?:optimized\/)?[A-Za-z0-9._-]+\.(?:png|jpe?g|webp)/g)].map(match => match[0]))];
const assetBytes = assetReferences.reduce((sum, reference) => sum + fs.statSync(path.join(ROOT, ...reference.split('/'))).size, 0);
const specFiles = fs.readdirSync(path.join(ROOT, 'tests')).filter(file => file.endsWith('.spec.js'));
const testCases = specFiles.reduce((count, file) => count + (fs.readFileSync(path.join(ROOT, 'tests', file), 'utf8').match(/^[ \t]*test\s*\(/gm) || []).length, 0);
const checksum = crypto.createHash('sha256').update(fs.readFileSync(compiledFile)).digest('hex').toUpperCase();
const lines = [
  '# 当前项目基线', '',
  '> 本文件由 `node tools/generate-stats.js --write` 生成，请勿手工维护统计数字。', '',
  '## 数据', '',
  `- TSV 文件：${reactionFiles.length}`,
  `- 源数据：${sourceRows.length} 行`,
  `- 编译实体：${compiled.entities.length}`,
  `- 编译反应：${compiled.reactions.length}`,
  `- 通路：${Object.keys(compiled.pathwayMeta || {}).length}`,
  `- 审校状态：已核对 ${states.get('已核对') || 0}；已终审 ${states.get('已终审') || 0}；待审校 ${states.get('待审校') || 0}`,
  `- 区室：${compartments.rows.length} 个叶区室，${compartmentNames.size} 种可识别写法`,
  `- 手工坐标：${overrides}`,
  `- 结构化参与物：${participantOccurrences} 次，唯一 ${compiled.participantCatalog?.length || 0} 个，跨通路 ${crossPathwayParticipants} 个`, '',
  '## 学习与资源', '',
  `- 学习主线步骤：${stepAudit.total} 个，${stepAudit.missing.length ? `${stepAudit.missing.length} 个尚未链接` : '全部链接到实体或代表性反应'}`,
  `- 运行时图片：${assetReferences.length} 个唯一引用，共 ${(assetBytes / 1024 / 1024).toFixed(2)}MB`,
  `- 浏览器回归：${specFiles.length} 个 spec，${testCases} 个测试`, '',
  '## 构建指纹', '',
  `- \`data-compiled.js\` SHA-256：\`${checksum}\``, ''
];
const output = lines.join('\n');

if (WRITE) {
  fs.writeFileSync(OUTPUT, output, 'utf8');
  console.log('已更新 STATS.md');
} else if (CHECK) {
  const current = fs.existsSync(OUTPUT) ? fs.readFileSync(OUTPUT, 'utf8') : '';
  if (current !== output) {
    console.error('STATS.md 与当前数据不一致；运行 node tools/generate-stats.js --write');
    process.exitCode = 1;
  } else {
    console.log('STATS.md 与当前数据一致');
  }
} else {
  process.stdout.write(output);
}
