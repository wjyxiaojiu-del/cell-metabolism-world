#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const { CORE_STUDY_PATHWAY_IDS: corePathways } = require('../shared/contracts.js');
function loadWindowScript(file) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox);
  return sandbox.window;
}

const data = loadWindowScript('data-compiled.js').METABOLIC_COMPILED;
const notes = loadWindowScript('student-reaction-notes.js').STUDENT_REACTION_NOTES;
const pageSource = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const generatedFallbackEnabled = /function\s+studentGeneratedReactionNote\s*\(/.test(pageSource);
const generatedStatusVisible = /自动整理 · 待人工精讲/.test(pageSource);
const representationConventionVisible = /不应重复计算为额外一步/.test(pageSource);
const groupsFor = reaction => Array.isArray(reaction.group) ? reaction.group : [reaction.group];
const keyFor = (pathwayId, reaction) => `${pathwayId}|${reaction.from}>${reaction.to}`;
const validKeys = new Set(data.reactions.flatMap(reaction => groupsFor(reaction).map(pathwayId => keyFor(pathwayId, reaction))));
const orphanKeys = Object.keys(notes).filter(key => !validKeys.has(key));
const requiredManualCoverage = new Set([
  'glycolysis', 'gluconeogenesis', 'glycogenesis', 'glycogenolysis', 'ppp', 'pdh', 'tca', 'malate_aspartate', 'glycerol_phosphate', 'etc', 'oxphos',
  'transamination', 'urea', 'aa_carbon'
]);

let covered = 0;
let total = 0;
let requiredCoverageFailed = false;
console.log('=== 学生白话解读覆盖率 ===');
for (const pathwayId of corePathways) {
  const reactions = data.reactions.filter(reaction => groupsFor(reaction).includes(pathwayId));
  const pathwayCovered = reactions.filter(reaction => notes[keyFor(pathwayId, reaction)]).length;
  covered += pathwayCovered;
  total += reactions.length;
  const readable = generatedFallbackEnabled ? reactions.length : pathwayCovered;
  console.log(`${readable === reactions.length ? 'OK  ' : 'TODO'} ${pathwayId.padEnd(24)} 精讲 ${pathwayCovered}/${reactions.length} · 可读 ${readable}/${reactions.length}`);
  if (requiredManualCoverage.has(pathwayId) && pathwayCovered !== reactions.length) {
    requiredCoverageFailed = true;
    console.error(`ERROR 核心课程人工精讲回退：${pathwayId} ${pathwayCovered}/${reactions.length}`);
  }
}
for (const key of orphanKeys) console.error(`ERROR 孤儿解读键：${key}`);
console.log(`人工精讲 ${covered}/${total}；白话可读 ${generatedFallbackEnabled ? total : covered}/${total}；孤儿键 ${orphanKeys.length}`);
if (covered < 113) console.error(`ERROR 人工精讲覆盖回退：${covered}/113`);
if (!generatedFallbackEnabled) console.error('ERROR 缺少未精讲反应的白话兜底');
if (!generatedStatusVisible) console.error('ERROR 自动白话缺少“待人工精讲”视觉标识');
if (!representationConventionVisible) console.error('ERROR 缺少第二表示边的全局读图约定');
console.log('统计口径：155 为 21 门课程内反应数求和；跨课程共享反应会按课程分别计入。');
if (orphanKeys.length || covered < 113 || requiredCoverageFailed || !generatedFallbackEnabled || !generatedStatusVisible || !representationConventionVisible) process.exitCode = 1;
