#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const resolver = require('../student-step-resolver.js');

const ROOT = path.join(__dirname, '..');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'scene-data.js'), 'utf8'), context);
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'data-compiled.js'), 'utf8'), context);

const atlas = context.window.METABOLIC_ATLAS_DATA;
const compiled = context.window.METABOLIC_COMPILED;
const routeGroups = {
  glycolysis: 'glycolysis', pdh: 'pdh', tca: 'tca', etc: 'etc', oxphos: 'etc',
  malate_aspartate: 'transport', glycerol_phosphate: 'transport', atp_transport: 'transport'
};
const resolverOptions = {
  pathways: atlas.pathways,
  entities: compiled.entities,
  reactions: compiled.reactions,
  entityById: Object.fromEntries(compiled.entities.map(entity => [entity.id, entity])),
  routeGroups
};
const result = resolver.auditPathways(resolverOptions);

const exactStepContracts = {
  folate: [
    ['THF', /二氢叶酸还原酶/],
    ['5,10-亚甲基-THF', /丝氨酸羟甲基转移酶/],
    ['10-甲酰-THF', /亚甲基-THF 脱氢酶/],
    ['5-甲基-THF', /亚甲基-THF 还原酶/]
  ]
};
const contractFailures = [];
Object.entries(exactStepContracts).forEach(([pathwayId, contracts]) => {
  const pathway = atlas.pathways[pathwayId];
  contracts.forEach(([step, enzymePattern]) => {
    const index = pathway.steps.indexOf(step);
    const target = resolver.resolveStep({
      ...resolverOptions, pathwayId, pathway, step, index, stepCount: pathway.steps.length
    });
    if (target.entity?.name !== step || !enzymePattern.test(String(target.reaction?.enzyme || ''))) {
      contractFailures.push(`${pathwayId} / ${step}`);
    }
  });
});

console.log('=== 学习步骤链接检查 ===');
console.log(`步骤 ${result.total}：代谢物 ${result.metabolite}，酶/载体 ${result.enzyme}，过程 ${result.process}`);
if (result.missing.length) {
  console.log(`无法交互 ${result.missing.length} 项（必须修）:`);
  result.missing.forEach(item => console.log(`  ✗ ${item.pathwayId} / ${item.step}`));
  process.exitCode = 1;
} else {
  console.log('无法交互: 0（没有把无证据步骤错误链接到其他反应）');
}
if (result.unlinked.length) {
  console.log(`说明性步骤 ${result.unlinked.length} 项（保留为不可点击说明，不做位置猜测）:`);
  result.unlinked.forEach(item => console.log(`  · ${item.pathwayId} / ${item.step}`));
}
if (contractFailures.length) {
  console.log(`精确步骤合同失败 ${contractFailures.length} 项:`);
  contractFailures.forEach(item => console.log(`  ✗ ${item}`));
  process.exitCode = 1;
} else {
  console.log('精确步骤合同: 叶酸 4/4');
}
