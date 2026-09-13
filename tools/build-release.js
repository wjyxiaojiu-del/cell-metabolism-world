#!/usr/bin/env node
// 构建发布目录：复制浏览器运行所需文件，JavaScript 全部最小化。
// 用法：node tools/build-release.js [dest]   （默认 dist/candidate）
// 开发工作流不受影响：仓库里的 scripts/app.js 等保持可读源码，只在发布产物里最小化。

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');
const { minify } = require('terser');

const ROOT = path.join(__dirname, '..');
const DEST = path.resolve(ROOT, process.argv[2] || 'dist/candidate');

const RUNTIME_FILES = [
  'index.html',
  'scene-data.js',
  'data-compiled.js',
  'student-step-resolver.js'
];
const RUNTIME_DIRS = [
  'styles',
  'scripts',
  path.join('cell-metabolism-assets', 'optimized'),
  path.join('cell-metabolism-assets', 'pathway-icons', 'optimized'),
  path.join('cell-metabolism-assets', 'pathway-learning', 'optimized')
];

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

async function minifyFile(file) {
  const code = fs.readFileSync(file, 'utf8');
  const result = await minify(code, { compress: true, mangle: true });
  if (result.code === undefined) throw new Error(`terser 未返回代码: ${file}`);
  fs.writeFileSync(file, result.code);
  return { before: code.length, after: result.code.length };
}

async function main() {
  if (fs.existsSync(DEST)) fs.rmSync(DEST, { recursive: true, force: true });
  fs.mkdirSync(DEST, { recursive: true });

  for (const file of RUNTIME_FILES) fs.copyFileSync(path.join(ROOT, file), path.join(DEST, file));
  for (const dir of RUNTIME_DIRS) copyDir(path.join(ROOT, dir), path.join(DEST, dir));

  // index.html 引用最小化产物
  const indexPath = path.join(DEST, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  html = html.replace('scripts/app.js?v=', 'scripts/app.min.js?v=');
  fs.writeFileSync(indexPath, html);
  fs.renameSync(path.join(DEST, 'scripts', 'app.js'), path.join(DEST, 'scripts', 'app.min.js'));

  const savings = [];
  const toMinify = ['scripts/app.min.js', 'scene-data.js', 'data-compiled.js', 'student-step-resolver.js'];
  for (const rel of toMinify) {
    const before = fs.readFileSync(path.join(DEST, rel), 'utf8');
    const result = await minify(before, { compress: true, mangle: false });
    if (result.code === undefined) throw new Error(`terser 未返回代码: ${rel}`);
    fs.writeFileSync(path.join(DEST, rel), result.code);
    savings.push(`${rel}: ${(before.length / 1024).toFixed(0)}KB -> ${(result.code.length / 1024).toFixed(0)}KB`);
  }

  const manifest = [];
  const walk = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else {
        const sha = crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex');
        manifest.push(`${sha}  ${path.relative(DEST, full).split(path.sep).join('/')}`);
      }
    }
  };
  walk(DEST);
  fs.writeFileSync(path.join(DEST, 'MANIFEST.txt'), manifest.join('\n') + '\n');

  console.log('发布目录:', path.relative(ROOT, DEST));
  console.log('文件数:', manifest.length);
  for (const line of savings) console.log('  最小化', line);
  console.log('MANIFEST.txt 已写入（SHA-256）');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
