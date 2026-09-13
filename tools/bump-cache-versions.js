#!/usr/bin/env node
// 按文件实际变化自动递增 index.html 的缓存版本参数。
// 用法：node tools/bump-cache-versions.js [--check]
// 规则：对比 git HEAD 与工作区，运行时文件有变则把对应 ?v= 更新为
// YYYYMMDD-N（当日首次变更为 -1，同日再次变更递增 N）。--check 时只报告，不写入。

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INDEX = path.join(ROOT, 'index.html');
const CHECK = process.argv.includes('--check');

const TRACKED = [
  'scene-data.js',
  'data-compiled.js',
  'student-step-resolver.js',
  'scripts/app.js',
  'styles/main.css'
];

function headHash(file) {
  try {
    return execSync(`git cat-file blob HEAD:${file.split('/').join('/')}`, { cwd: ROOT });
  } catch {
    return null;
  }
}

function worktreeHash(file) {
  return fs.readFileSync(path.join(ROOT, file));
}

function parseVersion(value) {
  const m = value.match(/^(\d{8})-(\d+)$/);
  return m ? { date: m[1], n: parseInt(m[2], 10) } : { date: '0', n: 0 };
}

const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const html = fs.readFileSync(INDEX, 'utf8');
const changes = [];

let next = html;
for (const file of TRACKED) {
  const head = headHash(file);
  const work = worktreeHash(file);
  if (head && work && Buffer.compare(head, work) === 0) continue;
  const escaped = file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(src="${escaped}|href="${escaped})\\?v=(\\d{8}-\\d+)"`);
  const match = next.match(re);
  if (!match) {
    changes.push(`${file}: index.html 未找到版本参数，请人工确认`);
    continue;
  }
  const cur = parseVersion(match[2]);
  const nextVersion = cur.date === today ? `${today}-${cur.n + 1}` : `${today}-1`;
  next = next.replace(re, `${match[1]}?v=${nextVersion}"`);
  changes.push(`${file}: ${match[2]} -> ${nextVersion}`);
}

if (!changes.length) {
  console.log('运行时文件无变化，版本号无需更新');
  process.exit(0);
}

for (const c of changes) console.log(c);
if (CHECK) process.exit(2);
fs.writeFileSync(INDEX, next);
console.log('index.html 已更新');
