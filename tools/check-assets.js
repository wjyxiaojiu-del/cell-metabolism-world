#!/usr/bin/env node
// Runtime asset gate: every referenced scene image must exist and stay below the delivery budget.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const assetRoot = path.join(ROOT, 'cell-metabolism-assets');
const sources = [
  fs.readFileSync(path.join(ROOT, 'scene-data.js'), 'utf8'),
  fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')
].join('\n');
const references = [...sources.matchAll(/cell-metabolism-assets\/(?:optimized\/)?[A-Za-z0-9._-]+\.(?:png|jpe?g|webp|svg)/g)]
  .map(match => match[0]);
const unique = [...new Set(references)];
const errors = [];
const warnings = [];
const MAX_BYTES = 3 * 1024 * 1024;
let total = 0;
for (const reference of unique) {
  const file = path.join(ROOT, reference.replaceAll('/', path.sep));
  if (!fs.existsSync(file)) {
    errors.push(`缺失资源: ${reference}`);
    continue;
  }
  const size = fs.statSync(file).size;
  total += size;
  if (size > MAX_BYTES && reference.includes('/optimized/')) {
    errors.push(`优化资源超过 3MB: ${reference} (${(size / 1024 / 1024).toFixed(2)}MB)`);
  } else if (size > MAX_BYTES) {
    warnings.push(`仍引用原始大图: ${reference} (${(size / 1024 / 1024).toFixed(2)}MB)`);
  }
}

console.log('=== 场景资源检查 ===');
console.log(`唯一引用: ${unique.length} 个，引用总量: ${(total / 1024 / 1024).toFixed(2)}MB`);
console.log(`优化资源: ${unique.filter(item => item.includes('/optimized/')).length} 个`);
if (errors.length) {
  console.log(`错误 ${errors.length} 条:`);
  errors.forEach(error => console.log(`  ✗ ${error}`));
  process.exitCode = 1;
} else {
  console.log('错误: 无');
}
if (warnings.length) {
  console.log(`提醒 ${warnings.length} 条:`);
  warnings.forEach(warning => console.log(`  · ${warning}`));
}
