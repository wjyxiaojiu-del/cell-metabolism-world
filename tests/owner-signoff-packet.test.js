#!/usr/bin/env node
const assert = require('assert/strict');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const packet = fs.readFileSync(path.join(__dirname, '..', 'docs', 'map-polish', 'signoff-review-packet.md'), 'utf8');
const pathways = [
  'pdh', 'tca', 'malate_aspartate', 'glycerol_phosphate', 'etc', 'oxphos',
  'glycolysis', 'gluconeogenesis', 'glycogenesis', 'glycogenolysis', 'ppp',
  'fa_synthesis', 'carnitine', 'beta_oxidation', 'ketone', 'transamination',
  'urea', 'aa_carbon', 'purine', 'pyrimidine', 'nucleotide_degradation'
];

assert.match(packet, /390、768、1440/);
assert.match(packet, /进入、查看主图、打开详情、返回/);
assert.match(packet, /`待确认`/);
assert.match(packet, /`通过`/);
assert.match(packet, /`退回`/);
assert.match(packet, /npm run audit:owner-signoff/);
assert.match(packet, /仅本通路对/);
for (const pathway of pathways) assert.match(packet, new RegExp(`\\b${pathway}\\b`));

const generator = path.join(__dirname, '..', 'tools', 'generate-signoff-packet.js');
const help = spawnSync(process.execPath, [generator, '--help'], { encoding: 'utf8' });
assert.equal(help.status, 0, help.stderr);
assert.match(help.stdout, /--pathway=<id>/);
assert.match(help.stdout, /--all/);

const noArgs = spawnSync(process.execPath, [generator], { encoding: 'utf8' });
assert.notEqual(noArgs.status, 0);
assert.match(noArgs.stdout, /用法/);

const conflictingArgs = spawnSync(process.execPath, [generator, '--all', '--pathway=glycolysis'], { encoding: 'utf8' });
assert.notEqual(conflictingArgs.status, 0);
assert.match(conflictingArgs.stderr, /不能同时使用/);

console.log('owner signoff packet checks passed');
