#!/usr/bin/env node
// 校验器自测。确认它真的会报错，而不是永远说「无错误」。
// 用法: node tools/selftest.js
const { execFileSync } = require('child_process');
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  buildReactionParticipants,
  normalizeParticipantKey,
  parseEquation
} = require('./reaction-participants.js');
const { reactionIdentity } = require('./reaction-identity.js');
const { readTsv } = require('./tsv.js');

const ROOT = path.join(__dirname, '..');
const VALIDATOR = path.join(__dirname, 'validate.js');

function participant(role, name, compartmentHint = '') {
  return item => item.role === role && item.name === name
    && (!compartmentHint || item.compartmentHint === compartmentHint);
}

function runParticipantTests() {
  const completeReaction = reactionIdentity({ from: 'ADP@基质', to: 'ATP@基质', enzyme: 'ATP 合酶', equation: 'ADP + Pi + H⁺ → ATP', reversible: false });
  const simplifiedReaction = reactionIdentity({ from: 'ADP@基质', to: 'ATP@基质', enzyme: 'ATP 合酶', equation: 'ADP + Pi → ATP', reversible: false });
  assert.notStrictEqual(completeReaction, simplifiedReaction);
  assert.strictEqual(completeReaction, reactionIdentity({ from: 'ADP@基质', to: 'ATP@基质', enzyme: 'ATP 合酶', equation: 'ADP + Pi + H⁺ → ATP', reversible: false }));
  assert.strictEqual(
    reactionIdentity({ from: 'G6P', to: 'F6P', enzyme: '测试酶', equation: 'G6P ⇌ F6P', reversible: true }),
    reactionIdentity({ from: '葡萄糖-6-磷酸', to: '果糖-6-磷酸', enzyme: '测试酶', equation: '葡萄糖-6-磷酸 ⇌ 果糖-6-磷酸', reversible: true })
  );
  assert.notStrictEqual(
    reactionIdentity({ from: 'G3P', to: 'ATP', enzyme: '测试酶', equation: 'G3P → ATP', reversible: false }),
    reactionIdentity({ from: '甘油-3-P', to: 'ATP', enzyme: '测试酶', equation: '甘油-3-P → ATP', reversible: false })
  );

  const glycolysis = parseEquation('葡萄糖 + ATP → G6P + ADP');
  assert(glycolysis.participants.some(participant('product', '葡萄糖-6-磷酸')));
  assert(glycolysis.participants.some(participant('substrate', 'ATP')));

  const normalizedAliases = parseEquation('F-1,6-BP + Cyt c → 1,3-BPG');
  assert(normalizedAliases.participants.some(participant('substrate', '果糖-1,6-二磷酸')));
  assert(normalizedAliases.participants.some(participant('substrate', '细胞色素 c')));
  assert(normalizedAliases.participants.some(participant('product', '1,3-二磷酸甘油酸')));

  const aspartate = parseEquation('Asp基质 ⇌ Asp胞质');
  assert(aspartate.participants.some(participant('substrate', '天冬氨酸', '线粒体基质')));
  assert(aspartate.participants.some(participant('product', '天冬氨酸', '细胞质')));
  assert(aspartate.participants.some(item => item.name === '天冬氨酸' && item.rawName === 'Asp基质'));

  const mergedAspartate = buildReactionParticipants({
    substrate: { name: '天冬氨酸', entityId: '天冬氨酸@线粒体基质', compartmentHint: '线粒体基质' },
    product: { name: '天冬氨酸', entityId: '天冬氨酸@细胞质', compartmentHint: '细胞质' },
    equation: 'Asp基质 ⇌ Asp胞质'
  });
  assert(mergedAspartate.participants.every(item => item.aliases.includes('Asp')));

  assert.notStrictEqual(normalizeParticipantKey('NAD(P)H'), normalizeParticipantKey('NADPH'));
  assert.notStrictEqual(normalizeParticipantKey('NAD(P)⁺'), normalizeParticipantKey('NADP⁺'));

  const exchange = parseEquation('ATP基质 + ADP胞质 ⇌ ATP胞质 + ADP基质');
  assert(exchange.participants.some(participant('substrate', 'ATP', '线粒体基质')));
  assert(exchange.participants.some(participant('product', 'ATP', '细胞质')));

  const relay = buildReactionParticipants({
    substrate: { name: '甘油-3-磷酸', entityId: '甘油-3-磷酸@细胞质' },
    product: { name: '泛醇', entityId: '泛醇@线粒体内膜' },
    equation: '甘油-3-磷酸 + FAD(酶内) → DHAP + FADH₂(酶内)；FADH₂(酶内) + CoQ → FAD(酶内) + CoQH₂'
  });
  assert.strictEqual(relay.participants.filter(participant('substrate', 'FAD')).length, 1);
  assert(relay.participants.some(item => item.name === 'FAD' && item.qualifier === '酶内'));

  const oxygen = parseEquation('½O₂ + 2e⁻ + 2H⁺基质 → H₂O');
  assert(oxygen.participants.some(item => item.name === '氧' && item.coefficient === '½'));
  assert(oxygen.participants.some(item => item.name === 'H⁺' && item.coefficient === '2'
    && item.compartmentHint === '线粒体基质'));

  const folate = parseEquation('5,10-亚甲基-THF + NADP⁺ → 5,10-次甲基-THF + NADPH');
  assert(folate.participants.some(item => item.name === '5,10-亚甲基-THF' && item.coefficient === '1'));

  const protonTransport = parseEquation('4H⁺：基质 → 膜间隙');
  assert(protonTransport.participants.some(participant('substrate', 'H⁺', '线粒体基质')));
  assert(protonTransport.participants.some(participant('product', 'H⁺', '线粒体膜间隙')));

  const annotation = parseEquation('4H⁺：净转移至膜间隙侧');
  assert.strictEqual(annotation.participants.length, 0);
  assert.deepStrictEqual(annotation.ignoredSegments, ['4H⁺：净转移至膜间隙侧']);

  const fixtureRows = readTsv(path.join(__dirname, 'fixtures', 'broken.tsv')).rows;
  assert.strictEqual(fixtureRows[0].__lineNumber, 5);
  assert.strictEqual(fixtureRows[2].__lineNumber, 7);
}

try {
  runParticipantTests();
  console.log('PASS  反应参与物解析边界');
} catch (error) {
  console.log('FAIL  反应参与物解析边界');
  console.log('        ' + error.message);
  process.exitCode = 1;
}

function run(dir) {
  try {
    const out = execFileSync(process.execPath, [VALIDATOR, dir], {
      cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']
    });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status, out: (e.stdout || '') + (e.stderr || '') };
  }
}

const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'cell-metabolism-selftest-'));
const emptyReactionDir = path.join(temporaryRoot, 'empty-reactions');
const missingReactionDir = path.join(temporaryRoot, 'missing-reactions');
const plantSpeciesMismatchDir = path.join(temporaryRoot, 'plant-species-mismatch');
const duplicateReactionDir = path.join(temporaryRoot, 'duplicate-reaction');
const reversibleConflictDir = path.join(temporaryRoot, 'reversible-conflict');
const terminologyErrorDir = path.join(temporaryRoot, 'terminology-error');
const columnMismatchDir = path.join(temporaryRoot, 'column-mismatch');
const bomDir = path.join(temporaryRoot, 'bom-file');
const crossFileReverseDir = path.join(temporaryRoot, 'cross-file-reverse');
const sameFileAliasedReverseDir = path.join(temporaryRoot, 'same-file-aliased-reverse');
fs.mkdirSync(emptyReactionDir);
fs.mkdirSync(plantSpeciesMismatchDir);
fs.mkdirSync(duplicateReactionDir);
fs.mkdirSync(reversibleConflictDir);
fs.mkdirSync(terminologyErrorDir);
fs.mkdirSync(columnMismatchDir);
fs.mkdirSync(bomDir);
fs.mkdirSync(crossFileReverseDir);
fs.mkdirSync(sameFileAliasedReverseDir);
fs.writeFileSync(path.join(plantSpeciesMismatchDir, 'plant.tsv'), [
  '#\t通路: 植物区室自测\tPlant compartment self-test',
  '#\t默认区室: 植物质体',
  '底物\t产物\t酶\t可逆\t反应式\t审校\t备注',
  '测试底物\t测试产物\t测试酶\t否\t测试底物 → 测试产物\t待审校\t验证植物物种门禁',
  ''
].join('\n'), 'utf8');
fs.writeFileSync(path.join(duplicateReactionDir, 'duplicate.tsv'), [
  '#\t通路: 重复反应自测\tDuplicate reaction self-test',
  '#\t默认区室: 细胞质',
  '底物\t产物\t酶\t可逆\t反应式\t审校\t备注',
  '测试底物\t测试产物\t测试酶\t是\t测试底物 ⇌ 测试产物\t待审校\t第一条',
  '测试产物\t测试底物\t测试酶\t是\t测试产物 ⇌ 测试底物\t待审校\t反向重复',
  ''
].join('\n'), 'utf8');
fs.writeFileSync(path.join(reversibleConflictDir, 'conflict.tsv'), [
  '#\t通路: 可逆性冲突自测\tReversible conflict self-test',
  '#\t默认区室: 细胞质',
  '底物\t产物\t酶\t可逆\t反应式\t审校\t备注',
  '测试底物\t测试产物\t测试酶\t是\t测试底物 ⇌ 测试产物\t待审校\t可逆版本',
  '测试底物\t测试产物\t测试酶\t否\t测试底物 → 测试产物\t待审校\t单向版本',
  ''
].join('\n'), 'utf8');
fs.writeFileSync(path.join(terminologyErrorDir, 'terminology.tsv'), [
  '#\t通路: 术语门禁自测\tTerminology guard self-test',
  '#\t默认区室: 细胞质',
  '底物\t产物\t酶\t可逆\t反应式\t审校\t备注',
  '瓜氨酸\t精氨代琥珀酸\t测试酶\t否\t瓜氨酸 → 精氨代琥珀酸\t待审校\t旧术语应被拒绝',
  ''
].join('\n'), 'utf8');
// 缺列行：表头 7 列，数据行只有 6 个单元格（漏打制表符），应被列数门禁拒绝
fs.writeFileSync(path.join(columnMismatchDir, 'mismatch.tsv'), [
  '#\t通路: 缺列自测\tMissing column self-test',
  '#\t默认区室: 细胞质',
  '底物\t产物\t酶\t可逆\t反应式\t审校\t备注',
  '测试底物\t测试产物\t测试酶\t否\t测试底物 → 测试产物\t待审校',
  ''
].join('\n'), 'utf8');
// BOM 文件：文件开头带 UTF-8 BOM，元数据行和表头仍应被正常识别
fs.writeFileSync(path.join(bomDir, 'bom.tsv'), '\uFEFF' + [
  '#\t通路: BOM 自测\tBOM self-test',
  '#\t默认区室: 细胞质',
  '底物\t产物\t酶\t可逆\t反应式\t审校\t备注',
  '测试底物\t测试产物\t测试酶\t否\t测试底物 → 测试产物\t待审校\tBOM 不应影响解析',
  ''
].join('\n'), 'utf8');
// 跨文件反向可逆对：同一酶（措辞不同，靠别名归一）、同端点、方向相反、不同文件 → 应输出 info 而非 error
fs.writeFileSync(path.join(crossFileReverseDir, 'forward.tsv'), [
  '#\t通路: 跨文件反向自测-正向\tCross-file reverse self-test forward',
  '#\t默认区室: 细胞质',
  '底物\t产物\t酶\t可逆\t反应式\t审校\t备注',
  '测试底物\t测试产物\t硫解酶\t是\t测试底物 ⇌ 测试产物\t待审校\t正向',
  ''
].join('\n'), 'utf8');
fs.writeFileSync(path.join(crossFileReverseDir, 'reverse.tsv'), [
  '#\t通路: 跨文件反向自测-反向\tCross-file reverse self-test reverse',
  '#\t默认区室: 细胞质',
  '底物\t产物\t酶\t可逆\t反应式\t审校\t备注',
  '测试产物\t测试底物\tβ-酮硫解酶\t是\t测试产物 ⇌ 测试底物\t待审校\t反向（别名措辞）',
  ''
].join('\n'), 'utf8');
// 同文件反向但酶措辞不同（别名归一后同族）：酮体文件的真实写法，不应被判正反重复
fs.writeFileSync(path.join(sameFileAliasedReverseDir, 'aliased.tsv'), [
  '#\t通路: 同文件别名反向自测\tSame-file aliased reverse self-test',
  '#\t默认区室: 细胞质',
  '底物\t产物\t酶\t可逆\t反应式\t审校\t备注',
  '测试底物\t测试产物\t硫解酶\t是\t测试底物 ⇌ 测试产物\t待审校\t正向',
  '测试产物\t测试底物\tβ-酮硫解酶\t是\t测试产物 ⇌ 测试底物\t待审校\t反向，同文件但酶措辞不同',
  ''
].join('\n'), 'utf8');

const cases = [
  {
    name: '真实数据应当通过',
    dir: path.join(ROOT, 'data', 'reactions'),
    wantCode: 0,
    mustContain: ['错误: 无'],
    mustNotContain: ['✗']
  },
  {
    name: '写坏的数据应当被拒绝',
    dir: path.join(__dirname, 'fixtures'),
    wantCode: 1,
    mustContain: [
      'broken.tsv:5 "己糖激酶" 像酶，却出现在底物列',
      '未知区室',
      '底物或产物为空',
      '可逆列只能填',
      '审校列只能填'
    ],
    mustNotContain: [
      '"复合体 I" 像酶'   // 载体复合体是节点，不能报错
    ]
  },
  {
    name: '不存在的反应目录应当被拒绝',
    dir: missingReactionDir,
    wantCode: 1,
    mustContain: ['反应目录不存在'],
    mustNotContain: ['错误: 无']
  },
  {
    name: '空反应目录应当被拒绝',
    dir: emptyReactionDir,
    wantCode: 1,
    mustContain: ['反应目录中没有 TSV 文件'],
    mustNotContain: ['错误: 无']
  },
  {
    name: '植物特异区室缺少物种声明应当被拒绝',
    dir: plantSpeciesMismatchDir,
    wantCode: 1,
    mustContain: ['使用植物特异区室', '物种: 植物'],
    mustNotContain: ['错误: 无']
  },
  {
    name: '同一可逆反应的正反重复应当被拒绝',
    dir: duplicateReactionDir,
    wantCode: 1,
    mustContain: ['同一可逆反应的正反重复录入'],
    mustNotContain: ['错误: 无']
  },
  {
    name: '同一酶的可逆性冲突应当被拒绝',
    dir: reversibleConflictDir,
    wantCode: 1,
    mustContain: ['同一酶、同一对端点的可逆性冲突'],
    mustNotContain: ['错误: 无']
  },
  {
    name: '禁用科学术语应当被拒绝',
    dir: terminologyErrorDir,
    wantCode: 1,
    mustContain: ['使用了错误术语「精氨代琥珀酸」'],
    mustNotContain: ['错误: 无']
  },
  {
    name: '缺列的行应当被拒绝',
    dir: columnMismatchDir,
    wantCode: 1,
    mustContain: ['列数 6 与表头 7 列不符'],
    mustNotContain: ['错误: 无']
  },
  {
    name: '带 BOM 的 TSV 应当正常解析',
    dir: bomDir,
    wantCode: 0,
    mustContain: ['错误: 无'],
    mustNotContain: ['列数', '默认区室」缺失']
  },
  {
    name: '跨文件反向可逆对（含酶别名归一）应输出说明而非报错',
    dir: crossFileReverseDir,
    wantCode: 0,
    mustContain: ['跨文件反向可逆对'],
    mustNotContain: ['正反重复录入', '可逆性冲突']
  },
  {
    name: '同文件同族反向但酶措辞不同不应判为正反重复',
    dir: sameFileAliasedReverseDir,
    wantCode: 0,
    mustContain: ['错误: 无'],
    mustNotContain: ['正反重复录入']
  }
];

let failed = process.exitCode ? 1 : 0;
for (const c of cases) {
  const { code, out } = run(c.dir);
  const problems = [];
  if (code !== c.wantCode) problems.push(`退出码 ${code}，期望 ${c.wantCode}`);
  for (const s of c.mustContain) {
    if (!out.includes(s)) problems.push(`缺少预期输出: ${s}`);
  }
  for (const s of c.mustNotContain) {
    if (out.includes(s)) problems.push(`出现了不该有的输出: ${s}`);
  }
  if (problems.length) {
    failed++;
    console.log(`FAIL  ${c.name}`);
    for (const p of problems) console.log('        ' + p);
  } else {
    console.log(`PASS  ${c.name}`);
  }
}

fs.rmSync(temporaryRoot, { recursive: true, force: true });

console.log(failed ? `\n${failed} 个用例失败` : '\n校验器行为正确：好数据放行，坏数据拦下');
process.exitCode = failed ? 1 : 0;
