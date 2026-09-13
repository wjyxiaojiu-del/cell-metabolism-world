const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const cli = path.join(path.dirname(require.resolve('playwright/package.json')), 'cli.js');
const options = { cwd: root, encoding: 'utf8', windowsHide: true };
const before = fs.readFileSync(path.join(root, 'STATS.md'), 'utf8');
const listing = execFileSync(process.execPath, [cli, 'test', '--list', '--reporter=list'], options);
const expected = listing.match(/Total: (\d+) tests? in (\d+) files?/);
assert.ok(expected, 'Playwright must report its registered test inventory');
const generated = execFileSync(process.execPath, ['tools/generate-stats.js'], options);
const actual = generated.match(/浏览器回归：(\d+) 个 spec，(\d+) 个测试/);
assert.ok(actual, 'Stats must include the browser test inventory');
assert.equal(Number(actual[1]), Number(expected[2]), 'Count discovered files, not directory entries');
assert.equal(Number(actual[2]), Number(expected[1]), 'Count registered cases, including loop-generated tests');
assert.equal(fs.readFileSync(path.join(root, 'STATS.md'), 'utf8'), before, 'Preview must be read-only');
console.log('Statistics match the registered Playwright inventory; preview is read-only');
