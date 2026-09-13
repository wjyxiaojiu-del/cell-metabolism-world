#!/usr/bin/env node
const path = require('path');
const { spawnSync } = require('child_process');

function parseArgs(argv) {
  const args = { root: path.join(__dirname, '..') };
  argv.forEach((arg, index) => {
    if (arg === '--root') args.root = argv[index + 1];
    else if (arg.startsWith('--root=')) args.root = arg.slice('--root='.length);
  });
  if (!args.root) throw new Error('--root 需要目录参数');
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = path.resolve(args.root);
  const checker = path.join(__dirname, 'check-owner-signoff.js');
  const ownerCheck = spawnSync(process.execPath, [checker, '--root', root, '--json'], {
    encoding: 'utf8'
  });
  let report;
  try {
    report = JSON.parse(ownerCheck.stdout || '{}');
  } catch (error) {
    console.error(`负责人签核审计输出无法解析: ${error.message}`);
    process.exitCode = 1;
    return;
  }
  if (ownerCheck.status !== 0 || report.formalCompleted !== report.formalTarget || report.blockers?.length) {
    console.error(`最终总审计未执行：负责人确认 ${report.formalCompleted || 0}/${report.formalTarget || 42}`);
    (report.blockers || []).forEach(blocker => console.error(`- ${blocker}`));
    process.exitCode = 1;
    return;
  }

  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const tests = spawnSync(npm, ['test'], { cwd: root, stdio: 'inherit' });
  if (tests.status !== 0) {
    console.error(`最终总审计失败：npm test 退出码 ${tests.status ?? 1}`);
    process.exitCode = tests.status || 1;
    return;
  }
  console.log(`最终总审计通过：负责人确认 ${report.formalCompleted}/${report.formalTarget}，证据 ${report.evidenceCompleted}/${report.evidenceTarget}，npm test 通过`);
}

main();
