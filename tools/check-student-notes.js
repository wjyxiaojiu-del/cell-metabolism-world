#!/usr/bin/env node
// 白话精讲覆盖门禁：21 条核心通路的每个反应实例都必须有 doing/why/hook 三段白话，
// 孤儿键（指向不存在反应的精讲）一律报错，防止数据改动后错挂或漏挂。
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'data-compiled.js'), 'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'scripts', 'reaction-notes.js'), 'utf8'), context);
const data = context.window.METABOLIC_COMPILED;
const notes = context.window.STUDENT_REACTION_NOTES || {};

// 核心清单以 scripts/app.js 的 coreStudyModules 为唯一事实来源，此处解析而非复制。
const appSource = fs.readFileSync(path.join(ROOT, 'scripts', 'app.js'), 'utf8');
const moduleMatch = appSource.match(/const coreStudyModules = \{([\s\S]*?)\};/);
if (!moduleMatch) {
  console.error('ERROR 无法从 scripts/app.js 解析 coreStudyModules');
  process.exit(1);
}
const corePathways = [...moduleMatch[1].matchAll(/\[([^\]]*)\]/g)]
  .flatMap(match => [...match[1].matchAll(/'([a-z_]+)'/g)].map(entry => entry[1]));
if (!corePathways.length) {
  console.error('ERROR coreStudyModules 解析结果为空');
  process.exit(1);
}

const groupsFor = reaction => Array.isArray(reaction.group) ? reaction.group : [reaction.group];
const keyFor = (pathwayId, reaction) => `${pathwayId}|${reaction.from}>${reaction.to}`;
const validKeys = new Set(data.reactions.flatMap(reaction => groupsFor(reaction).map(pathwayId => keyFor(pathwayId, reaction))));

let covered = 0;
let total = 0;
const missing = [];
const incomplete = [];
for (const pathwayId of corePathways) {
  for (const reaction of data.reactions) {
    if (!groupsFor(reaction).includes(pathwayId)) continue;
    total += 1;
    const key = keyFor(pathwayId, reaction);
    const note = notes[key];
    if (!note) { missing.push(key); continue; }
    if (!note.doing || !note.why || !note.hook) { incomplete.push(key); continue; }
    covered += 1;
  }
}
const orphanKeys = Object.keys(notes).filter(key => !validKeys.has(key));

console.log(`反应白话精讲 ${covered}/${total}；孤儿键 ${orphanKeys.length}`);
for (const key of missing) console.error(`ERROR 缺少白话精讲：${key}`);
for (const key of incomplete) console.error(`ERROR 白话精讲不完整（需 doing/why/hook 三段）：${key}`);
for (const key of orphanKeys) console.error(`ERROR 孤儿精讲键：${key}`);
if (covered < total) console.error(`ERROR 白话精讲覆盖回退：${covered}/${total}`);
if (missing.length || incomplete.length || orphanKeys.length || covered < total) process.exitCode = 1;
else console.log(`统计口径：${total} 为 21 条核心通路内反应实例数；跨通路共享反应按通路分别计入。`);
