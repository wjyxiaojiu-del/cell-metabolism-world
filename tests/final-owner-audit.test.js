#!/usr/bin/env node
const assert = require('assert/strict');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');
const command = path.join(root, 'tools', 'run-final-owner-audit.js');
const result = spawnSync(process.execPath, [command, '--root', root], {
  encoding: 'utf8'
});
const output = `${result.stdout || ''}${result.stderr || ''}`;

assert.equal(result.status, 1, output);
assert.match(output, /最终总审计未执行/);
assert.match(output, /负责人确认/);
console.log('final owner audit precondition checks passed');
