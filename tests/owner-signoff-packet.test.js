#!/usr/bin/env node
const assert = require('assert/strict');
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
console.log('owner signoff packet checks passed');
