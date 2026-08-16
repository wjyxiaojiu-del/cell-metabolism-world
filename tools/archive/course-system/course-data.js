// 自学课程系统 · 课程数据（糖酵解样板课 + 5 专题映射）
// 内容源：.cluster/lesson-system-design-20260815/subagent_02_glycolysis.md（全量转录）
// 结构定义：.cluster/lesson-system-design-20260815/subagent_03_model.md §2 schema
// 接口约定：.cluster/lesson-impl-20260815/plan.md
// 字符规范：→ ⇌ ⁺ ⁻ ₂ ⁸ 等规范 Unicode；UTF-8 无 BOM
// 版本：2026-08-15-3（与 index.html 脚本标签 ?v= 同步 bump）
//
// 结构化课程写法：PDH/TCA 先用同一契约收敛；后续课程只补数据，不再新增学习模型。
function makeStructuredStep({ entityId, reactionId, notesRef, what, why, how, so, plain, detail, hook }) {
  const content = {
    fourQuestions: { what, why, how, so },
    layers: { plain, detail, hook }
  };
  if (entityId) content.entityId = entityId;
  if (reactionId) content.reactionId = reactionId;
  if (notesRef) content.notesRef = notesRef;
  return content;
}

function makeStructuredChallenge(id, hiddenItems, blanks, recallChecklist, fillLine) {
  return {
    id,
    mode: 'blank',
    hiddenItems,
    hideModes: [{ level: 1, name: '隐藏主干节点', description: '补全本课主线节点，并在回顾中说出能量账本。' }],
    fillLine,
    blanks,
    recallChecklist,
    passCriteria: { blanksMin: 1, recallAll: true }
  };
}

const PDH_LESSON = {
  id: 'pdh', pathwayId: 'pdh', topicId: 'biooxidation', order: 1,
  scene: 'mitochondria-matrix', compartment: '线粒体基质',
  source: { tsv: 'data/reactions/pdh.tsv', rxIds: ['rx91', 'rx92', 'rx219'] },
  meta: {
    title: '丙酮酸怎样变成乙酰辅酶 A？', name: '丙酮酸脱氢酶复合体',
    goal: '看懂丙酮酸进入线粒体并被不可逆氧化的入口反应',
    question: 'PDH 把糖酵解的三碳丙酮酸接到 TCA 的二碳乙酰辅酶 A。',
    problem: '把丙酮酸送入基质，同时释放 CO₂ 并把电子装入 NADH。',
    purpose: '这是糖酵解与 TCA 的单向接口。', input: '丙酮酸、CoA-SH、NAD⁺',
    output: '乙酰辅酶 A、CO₂、NADH', location: '线粒体基质', minutes: 8, difficulty: 1,
    prerequisites: [
      { id: 'pdh-pre1', name: '糖酵解出口', note: '丙酮酸是糖酵解的三碳出口', why: 'PDH 接住丙酮酸' },
      { id: 'pdh-pre2', name: '区室与跨膜', note: 'VDAC 过外膜，MPC 过内膜', why: '先分清入口顺序' },
      { id: 'pdh-pre3', name: '氧化还原', note: 'NAD⁺ 接收电子变成 NADH', why: 'PDH 的电子收益记在 NADH 上' }
    ],
    keywords: ['丙酮酸脱氢酶复合体', 'VDAC', 'MPC', '不可逆', '乙酰辅酶 A', 'NADH']
  },
  segments: [
    {
      id: 'pdh-s1', title: '段 1：丙酮酸先过两道门',
      goal: '按空间顺序追踪丙酮酸：细胞质 → 膜间隙 → 基质。',
      steps: ['细胞质丙酮酸', '电压依赖性阴离子通道（VDAC）', '线粒体丙酮酸载体（MPC）', '线粒体基质丙酮酸'],
      stepContent: {
        '细胞质丙酮酸': makeStructuredStep({ entityId: '丙酮酸@cytosol', notesRef: 'pdh|丙酮酸@cytosol>丙酮酸@mito-ims', what: '糖酵解在细胞质产生的三碳丙酮酸。', why: '它是进入有氧氧化的入口底物。', how: '先通过 VDAC，再由 MPC 送过内膜。', so: '丙酮酸本身还没有被 PDH 氧化。', plain: '糖酵解把三碳丙酮酸交给线粒体。', detail: '定位：细胞质；下一站是膜间隙。', hook: '先认清从哪里来。' }),
        '电压依赖性阴离子通道（VDAC）': makeStructuredStep({ reactionId: 'rx91', notesRef: 'pdh|丙酮酸@cytosol>丙酮酸@mito-ims', what: 'VDAC 是线粒体外膜通道。', why: '外膜需要通道让底物进入。', how: '丙酮酸沿 VDAC 到达膜间隙。', so: 'VDAC 发生在 PDH 催化之前。', plain: '先过外膜通道。', detail: 'VDAC 对应 rx91。', hook: '外膜是门，VDAC 是门洞。' }),
        '线粒体丙酮酸载体（MPC）': makeStructuredStep({ reactionId: 'rx92', notesRef: 'pdh|丙酮酸@mito-ims>丙酮酸@mito-matrix', what: 'MPC 把膜间隙中的丙酮酸送入基质。', why: 'PDH 反应发生在线粒体基质。', how: 'MPC 介导丙酮酸跨过内膜。', so: 'MPC 是载体，不是 PDH 酶。', plain: '再过内膜载体。', detail: 'MPC 对应 rx92。', hook: '外膜通道 + 内膜载体，顺序不能倒。' }),
        '线粒体基质丙酮酸': makeStructuredStep({ entityId: '丙酮酸@mito-matrix', notesRef: 'pdh|丙酮酸@mito-matrix>乙酰辅酶 A@mito-matrix', what: '进入基质后的丙酮酸遇到 PDH 复合体。', why: '基质提供 PDH 反应所需空间。', how: '下一步发生氧化脱羧。', so: '这是 PDH 的底物端。', plain: '丙酮酸到位，PDH 接手。', detail: '区室：线粒体基质；下一反应 rx219。', hook: '跨膜完成，才进入拆碳取电子。' })
      },
      mapFocus: { dimOthers: true, highlightMode: 'segment' }, reactionIds: ['rx91', 'rx92'],
      transitionToNext: '丙酮酸已经进入基质，下一段看 PDH 如何释放 CO₂ 并生成乙酰辅酶 A。'
    },
    {
      id: 'pdh-s2', title: '段 2：氧化脱羧，接入 TCA',
      goal: '读懂 PDH 总账：三碳丙酮酸 → 二碳乙酰辅酶 A + CO₂，并把电子交给 NAD⁺。',
      steps: ['线粒体基质丙酮酸', '乙酰辅酶 A'],
      stepContent: {
        '线粒体基质丙酮酸': makeStructuredStep({ entityId: '丙酮酸@mito-matrix', reactionId: 'rx219', notesRef: 'pdh|丙酮酸@mito-matrix>乙酰辅酶 A@mito-matrix', what: 'PDH 催化丙酮酸氧化脱羧：丙酮酸 + CoA-SH + NAD⁺ → 乙酰辅酶 A + CO₂ + NADH + H⁺。', why: '去掉一个碳，留下二碳乙酰基进入 TCA。', how: '反应不可逆；每分子丙酮酸生成一分子 NADH。', so: 'PDH 是代谢方向的单向闸门。', plain: '丢一个碳，抓一对电子，留下乙酰基。', detail: 'rx219；不可逆；产乙酰辅酶 A、CO₂、NADH。', hook: '三碳变二碳，电子变成 NADH。' }),
        '乙酰辅酶 A': makeStructuredStep({ entityId: '乙酰辅酶 A@mito-matrix', reactionId: 'rx219', notesRef: 'pdh|丙酮酸@mito-matrix>乙酰辅酶 A@mito-matrix', what: '乙酰辅酶 A 携带二碳乙酰基进入 TCA。', why: '它把糖、脂肪和部分氨基酸碳流汇到共同入口。', how: '下一步与草酰乙酸缩合生成柠檬酸。', so: '它不是 ATP，而是碳流与能量流的载体。', plain: '乙酰辅酶 A 是 TCA 的入场券。', detail: '产物端实体：乙酰辅酶 A@mito-matrix；连接下一课 tca。', hook: 'PDH 把糖酵解出口接成 TCA 入口。' })
      },
      mapFocus: { dimOthers: true, highlightMode: 'segment' }, reactionIds: ['rx219'],
      transitionToNext: 'PDH 完成后，乙酰辅酶 A 进入 TCA。'
    }
  ],
  quiz: [
    { id: 'pdh-q1', kind: 'order', stem: '把丙酮酸进入线粒体的顺序排好。', options: ['细胞质丙酮酸', 'VDAC 过外膜', 'MPC 过内膜', '线粒体基质丙酮酸'], correct: [0, 1, 2, 3], explanation: '先过外膜 VDAC，再过内膜 MPC，PDH 反应在基质发生。', retarget: 'pdh-s1', weight: 1 },
    { id: 'pdh-q2', kind: 'single', stem: 'PDH 每氧化一分子丙酮酸，哪组产物正确？', options: ['乙酰辅酶 A、CO₂、NADH', '乳酸、ATP、NAD⁺', '葡萄糖、CO₂、FADH₂', '乙酰辅酶 A、O₂、GTP'], correct: 0, explanation: 'PDH 是氧化脱羧：生成乙酰辅酶 A、CO₂ 和 NADH。', retarget: 'pdh-s2', weight: 1 },
    { id: 'pdh-q3', kind: 'truefalse', stem: 'PDH 反应是可逆的。', options: ['正确', '错误'], correct: 1, explanation: 'PDH 是不可逆闸门。', retarget: 'pdh-s2', weight: 1 },
    { id: 'pdh-q4', kind: 'fill', stem: 'PDH 生成的二碳产物是？', accept: ['乙酰辅酶 A', '乙酰-CoA', 'acetyl-CoA'], explanation: '乙酰辅酶 A 携带二碳乙酰基进入 TCA。', retarget: 'pdh-s2', weight: 1 }
  ],
  challenge: makeStructuredChallenge('pdh-challenge', ['细胞质丙酮酸', '电压依赖性阴离子通道（VDAC）', '线粒体丙酮酸载体（MPC）', '线粒体基质丙酮酸', '乙酰辅酶 A'], [
    { id: 'pdh-blank-1', pos: 1, stepKey: '电压依赖性阴离子通道（VDAC）', prompt: '① 丙酮酸过线粒体外膜的什么结构？', accept: ['VDAC', '电压依赖性阴离子通道（VDAC）'], hints: ['外膜通道', 'VDAC'] },
    { id: 'pdh-blank-2', pos: 2, stepKey: '线粒体丙酮酸载体（MPC）', prompt: '② 丙酮酸过线粒体内膜依靠什么？', accept: ['MPC', '线粒体丙酮酸载体（MPC）'], hints: ['内膜载体', 'MPC'] },
    { id: 'pdh-blank-3', pos: 3, stepKey: '乙酰辅酶 A', prompt: '③ PDH 把丙酮酸变成什么二碳产物？', accept: ['乙酰辅酶 A', '乙酰-CoA', 'acetyl-CoA'], hints: ['TCA 入口', '乙酰-CoA'] }
  ], ['说出 VDAC 在外膜、MPC 在内膜。', '说出 PDH 释放 CO₂ 并生成 NADH。', '说出乙酰辅酶 A 连接 TCA。'], '细胞质丙酮酸 → [①] → [②] → 线粒体基质丙酮酸 → [③]'),
  review: { keyPoints: ['丙酮酸先过 VDAC，再经 MPC 进入基质。', 'PDH 不可逆地把三碳丙酮酸变成二碳乙酰辅酶 A。', '每分子丙酮酸释放 1 CO₂、生成 1 NADH。'], recall: ['按区室顺序复述丙酮酸入口。', '写出 PDH 总反应的三类产物。', '解释 PDH 为什么是糖酵解与 TCA 的单向接口。'], acceptanceNote: '能按区室和能量账本复述 PDH，即可进入 TCA。' },
  wrongAnswerMap: { rules: '同一段连续答错 2 题 → 回到对应段；连续 2 次错同一题 → 重看前置知识。', items: [
    { quizIds: ['pdh-q1'], knowledge: 'VDAC/MPC 顺序混淆', action: '重走段 1 的区室路径', jump: 'pdh-s1', jumpHint: '段 1 · VDAC → MPC' },
    { quizIds: ['pdh-q2', 'pdh-q3'], knowledge: 'PDH 总账或不可逆性不清', action: '重看段 2 PDH 反应卡', jump: 'pdh-s2', jumpHint: '段 2 · rx219' },
    { quizIds: ['pdh-q4'], knowledge: '乙酰辅酶 A 作为 TCA 入口的角色不清', action: '重看乙酰辅酶 A 节点并预览 TCA', jump: 'pdh-s2', jumpHint: '段 2 · 乙酰辅酶 A' }
  ] }
};

const TCA_LESSON = {
  id: 'tca', pathwayId: 'tca', topicId: 'biooxidation', order: 2,
  scene: 'mitochondria-matrix', compartment: '线粒体基质',
  source: { tsv: 'data/reactions/tca.tsv', rxIds: ['rx303', 'rx304', 'rx305', 'rx306', 'rx307', 'rx308', 'rx309', 'rx310'] },
  meta: {
    title: '乙酰辅酶 A 怎样绕一圈赚回能量？', name: '三羧酸循环',
    goal: '沿着八步反应追踪乙酰基的氧化、还原当量产生与草酰乙酸再生',
    question: 'TCA 用一个四碳受体接住二碳乙酰基，再通过两次脱羧把电子装进 NADH/FADH₂。',
    problem: '把乙酰辅酶 A 的碳流变成 CO₂、NADH、FADH₂、GTP，并再生草酰乙酸。',
    purpose: '这是糖、脂肪和部分氨基酸碳骨架汇入氧化供能的共同循环。', input: '乙酰辅酶 A、草酰乙酸、NAD⁺、FAD、GDP + Pi',
    output: '2 CO₂、3 NADH、1 FADH₂、1 GTP、草酰乙酸', location: '线粒体基质', minutes: 15, difficulty: 2,
    prerequisites: [
      { id: 'tca-pre1', name: 'PDH 入口', note: 'PDH 先把丙酮酸变成乙酰辅酶 A', why: 'TCA 的二碳底物来自 PDH' },
      { id: 'tca-pre2', name: '氧化还原', note: 'NAD⁺/FAD 接收电子形成 NADH/FADH₂', why: '能量收益主要记在还原当量上' },
      { id: 'tca-pre3', name: '碳数追踪', note: '乙酰基 2C 与 OAA 4C 先合成 6C', why: '两次脱羧后回到 4C 骨架' }
    ],
    keywords: ['柠檬酸', '异柠檬酸', 'α-酮戊二酸', '琥珀酰辅酶 A', '琥珀酸', '延胡索酸', '苹果酸', '草酰乙酸', 'NADH', 'FADH₂', 'GTP']
  },
  segments: [
    {
      id: 'tca-s1', title: '段 1：二碳乙酰基接上四碳受体',
      goal: '从乙酰辅酶 A 与草酰乙酸缩合开始，建立 6C → 6C 的循环入口。',
      steps: ['乙酰辅酶 A', '柠檬酸', '异柠檬酸'],
      stepContent: {
        '乙酰辅酶 A': makeStructuredStep({ reactionId: 'rx303', notesRef: 'tca|乙酰辅酶 A@mito-matrix>柠檬酸@mito-matrix', what: '乙酰辅酶 A 携带二碳乙酰基进入 TCA。', why: '二碳乙酰基需要与四碳草酰乙酸合并，才能进入循环。', how: '柠檬酸合酶催化缩合，生成六碳柠檬酸。', so: '乙酰辅酶 A 的碳从这里开始进入循环。', plain: '二碳乙酰基接到四碳 OAA 上。', detail: 'rx303；反应消耗乙酰辅酶 A 与草酰乙酸，生成柠檬酸。', hook: '先合并，不急着放 CO₂。' }),
        '柠檬酸': makeStructuredStep({ reactionId: 'rx304', notesRef: 'tca|柠檬酸@mito-matrix>异柠檬酸@mito-matrix', what: '柠檬酸是 TCA 的六碳中间体。', why: '需要重排羟基位置，为后续氧化脱羧做准备。', how: '顺乌头酸酶把柠檬酸可逆重排为异柠檬酸。', so: '这一步不产生还原当量，也不释放 CO₂。', plain: '六碳骨架先换个摆法。', detail: 'rx304；柠檬酸 ⇌ 异柠檬酸。', hook: '重排是准备，不是收益。' }),
        '异柠檬酸': makeStructuredStep({ reactionId: 'rx305', notesRef: 'tca|异柠檬酸@mito-matrix>α-酮戊二酸@mito-matrix', what: '异柠檬酸脱氢生成 α-酮戊二酸。', why: '这是第一处氧化脱羧，开始取出乙酰基的碳并捕获电子。', how: 'NAD⁺ 接收电子形成 NADH，同时释放 1 个 CO₂。', so: 'TCA 的第一笔 NADH 与第一笔 CO₂ 在这里出现。', plain: '第一次脱羧：出 CO₂，赚 NADH。', detail: 'rx305；异柠檬酸 → α-酮戊二酸 + CO₂ + NADH。', hook: '第一笔收益：1 CO₂ + 1 NADH。' })
      },
      mapFocus: { dimOthers: true, highlightMode: 'segment' }, reactionIds: ['rx303', 'rx304', 'rx305'],
      transitionToNext: '六碳骨架已完成第一次脱羧，下一段继续氧化成琥珀酰辅酶 A。'
    },
    {
      id: 'tca-s2', title: '段 2：第二次脱羧，装入第二笔 NADH',
      goal: '理解 α-酮戊二酸继续氧化脱羧，形成四碳循环中间体。',
      steps: ['异柠檬酸', 'α-酮戊二酸', '琥珀酰辅酶 A'],
      stepContent: {
        '异柠檬酸': makeStructuredStep({ reactionId: 'rx305', notesRef: 'tca|异柠檬酸@mito-matrix>α-酮戊二酸@mito-matrix', what: '异柠檬酸完成第一次脱羧后成为 α-酮戊二酸。', why: '六碳骨架已经丢掉一个碳，但还要再丢一个碳才回到四碳循环段。', how: '沿 rx305 追踪 CO₂ 与 NADH 的第一笔收益。', so: '这里是从六碳到五碳的转折。', plain: '第一次脱羧把 6C 变 5C。', detail: 'rx305；产生 1 CO₂ 和 1 NADH。', hook: '六碳先变五碳。' }),
        'α-酮戊二酸': makeStructuredStep({ reactionId: 'rx306', notesRef: 'tca|α-酮戊二酸@mito-matrix>琥珀酰辅酶 A@mito-matrix', what: 'α-酮戊二酸脱氢并脱羧，生成琥珀酰辅酶 A。', why: '第二次脱羧完成乙酰基碳的氧化出口。', how: 'NAD⁺ 接收电子形成 NADH，同时再释放 1 个 CO₂。', so: 'TCA 的两次脱羧都发生在五碳/四碳转换前段。', plain: '第二次脱羧：再出 CO₂，再赚 NADH。', detail: 'rx306；α-酮戊二酸 → 琥珀酰辅酶 A + CO₂ + NADH。', hook: '第二笔收益：再加 1 CO₂ + 1 NADH。' }),
        '琥珀酰辅酶 A': makeStructuredStep({ reactionId: 'rx307', notesRef: 'tca|琥珀酰辅酶 A@mito-matrix>琥珀酸@mito-matrix', what: '琥珀酰辅酶 A 通过底物水平磷酸化生成琥珀酸。', why: '这是 TCA 唯一直接形成高能磷酸键的步骤。', how: 'GDP + Pi 形成 GTP（可与 ATP 互换），CoA 释放。', so: 'TCA 的 GTP 不是呼吸链间接产物，而是直接产物。', plain: '这一站直接赚 1 GTP。', detail: 'rx307；琥珀酰辅酶 A → 琥珀酸 + GTP。', hook: '唯一的底物水平磷酸化。' })
      },
      mapFocus: { dimOthers: true, highlightMode: 'segment' }, reactionIds: ['rx305', 'rx306', 'rx307'],
      transitionToNext: '两次脱羧和直接 GTP 已记账，下一段进入琥珀酸脱氢与复合体 II 入口。'
    },
    {
      id: 'tca-s3', title: '段 3：琥珀酸把电子交给 FAD',
      goal: '看懂琥珀酸 → 延胡索酸 → 苹果酸的氧化还原接力。',
      steps: ['琥珀酰辅酶 A', '琥珀酸', '延胡索酸'],
      stepContent: {
        '琥珀酰辅酶 A': makeStructuredStep({ reactionId: 'rx307', notesRef: 'tca|琥珀酰辅酶 A@mito-matrix>琥珀酸@mito-matrix', what: '琥珀酰辅酶 A 已释放 CoA，留下四碳琥珀酸。', why: '四碳骨架继续被氧化，准备把电子交给 FAD。', how: '沿 rx307 先完成 GTP 生成，再进入琥珀酸脱氢。', so: '碳数保持 4C，能量形态从硫酯转为 GTP。', plain: '先把高能硫酯换成 GTP。', detail: 'rx307；琥珀酸是下一反应的底物。', hook: '碳数不变，能量先兑现。' }),
        '琥珀酸': makeStructuredStep({ reactionId: 'rx308', notesRef: 'tca|琥珀酸@mito-matrix>延胡索酸@mito-matrix', what: '琥珀酸脱氢生成延胡索酸。', why: '这是 TCA 与呼吸链复合体 II 的直接连接点。', how: 'FAD 接收电子形成 FADH₂，电子随后进入辅酶 Q 池。', so: '这笔还原当量绕过复合体 I，泵氢效率低于 NADH。', plain: '琥珀酸脱氢，赚 1 FADH₂。', detail: 'rx308；琥珀酸脱氢酶同时属于复合体 II。', hook: 'TCA 的反应与呼吸链在这里相接。' }),
        '延胡索酸': makeStructuredStep({ reactionId: 'rx309', notesRef: 'tca|延胡索酸@mito-matrix>苹果酸@mito-matrix', what: '延胡索酸水合生成苹果酸。', why: '补入水分，为最后一次氧化和 OAA 再生做准备。', how: '延胡索酸酶催化可逆水合，不产生 ATP 或还原当量。', so: '这一步是结构调整，不是能量收益点。', plain: '加一分子水，变成苹果酸。', detail: 'rx309；延胡索酸 ⇌ 苹果酸。', hook: '先补水，再收尾。' })
      },
      mapFocus: { dimOthers: true, highlightMode: 'segment' }, reactionIds: ['rx307', 'rx308', 'rx309'],
      transitionToNext: 'FADH₂ 已交给呼吸链，下一段把苹果酸氧化成 OAA，完成循环。'
    },
    {
      id: 'tca-s4', title: '段 4：苹果酸氧化，草酰乙酸再生',
      goal: '完成最后一步并回收四碳草酰乙酸，理解循环为何能继续。',
      steps: ['延胡索酸', '苹果酸', '草酰乙酸'],
      stepContent: {
        '延胡索酸': makeStructuredStep({ reactionId: 'rx309', notesRef: 'tca|延胡索酸@mito-matrix>苹果酸@mito-matrix', what: '延胡索酸经水合成为苹果酸。', why: '苹果酸是最后氧化步骤的底物。', how: '沿 rx309 完成四碳中间体的构型转换。', so: '碳数仍为 4C。', plain: '延胡索酸补水变苹果酸。', detail: 'rx309；不直接产生 ATP/NADH。', hook: '收尾前的准备步。' }),
        '苹果酸': makeStructuredStep({ reactionId: 'rx310', notesRef: 'tca|苹果酸@mito-matrix>草酰乙酸@mito-matrix', what: '苹果酸脱氢生成草酰乙酸。', why: '再生 OAA，才能接住下一分子乙酰辅酶 A。', how: 'NAD⁺ 接收电子形成第三分子 NADH，同时生成 OAA。', so: '循环的最后一笔 NADH 与入口受体在同一步完成。', plain: '苹果酸氧化，OAA 回来了。', detail: 'rx310；苹果酸 → 草酰乙酸 + NADH。', hook: '第三笔 NADH，换回循环受体。' }),
        '草酰乙酸': makeStructuredStep({ reactionId: 'rx303', notesRef: 'tca|草酰乙酸@mito-matrix>柠檬酸@mito-matrix', what: '草酰乙酸是四碳循环受体。', why: '它与下一分子乙酰辅酶 A 缩合，重新生成柠檬酸。', how: '沿 rx303 进入下一轮，不被净消耗。', so: 'OAA 是循环催化性受体，不是每轮的净产物。', plain: 'OAA 回到入口，循环继续。', detail: 'rx303；每轮消耗乙酰辅酶 A，但再生 OAA。', hook: '受体再生，才叫循环。' })
      },
      mapFocus: { dimOthers: true, highlightMode: 'segment' }, reactionIds: ['rx309', 'rx310', 'rx303'],
      transitionToNext: '一轮 TCA 完成：2 CO₂、3 NADH、1 FADH₂、1 GTP，OAA 再生。'
    }
  ],
  quiz: [
    { id: 'tca-q1', kind: 'order', stem: '把 TCA 主干按顺序排好。', options: ['乙酰辅酶 A', '柠檬酸', '异柠檬酸', 'α-酮戊二酸', '琥珀酰辅酶 A', '琥珀酸', '延胡索酸', '苹果酸', '草酰乙酸'], correct: [0, 1, 2, 3, 4, 5, 6, 7, 8], explanation: '乙酰辅酶 A 与 OAA 缩合后，依次经过八步反应并再生 OAA。', retarget: 'tca-s1', weight: 1 },
    { id: 'tca-q2', kind: 'single', stem: '每分子乙酰辅酶 A 的 TCA 产物账本是哪一组？', options: ['2 CO₂、3 NADH、1 FADH₂、1 GTP', '1 CO₂、1 NADH、2 ATP', '2 O₂、3 ATP、1 FADH₂', '4 CO₂、2 NADH、2 GTP'], correct: 0, explanation: '一轮 TCA 释放 2 CO₂，生成 3 NADH、1 FADH₂ 和 1 GTP。', retarget: 'tca-s4', weight: 1 },
    { id: 'tca-q3', kind: 'single', stem: 'TCA 的两次脱羧发生在哪两步？', options: ['rx305 与 rx306', 'rx303 与 rx304', 'rx307 与 rx308', 'rx309 与 rx310'], correct: 0, explanation: '异柠檬酸脱氢和 α-酮戊二酸脱氢分别释放 CO₂。', retarget: 'tca-s2', weight: 1 },
    { id: 'tca-q4', kind: 'truefalse', stem: '草酰乙酸在每轮 TCA 中被净消耗。', options: ['正确', '错误'], correct: 1, explanation: '草酰乙酸与乙酰辅酶 A 缩合后在末步再生，是催化性受体。', retarget: 'tca-s4', weight: 1 },
    { id: 'tca-q5', kind: 'fill', stem: '琥珀酸脱氢这一步生成的还原当量是？', accept: ['FADH₂', 'FADH2'], explanation: 'rx308 由 FAD 接收电子形成 FADH₂，并连接复合体 II。', retarget: 'tca-s3', weight: 1 }
  ],
  challenge: makeStructuredChallenge('tca-challenge', ['柠檬酸', '异柠檬酸', 'α-酮戊二酸', '琥珀酰辅酶 A', '琥珀酸', '延胡索酸', '苹果酸', '草酰乙酸'], [
    { id: 'tca-blank-1', pos: 1, stepKey: '柠檬酸', prompt: '① 乙酰辅酶 A + 草酰乙酸 → ？', accept: ['柠檬酸', 'citrate'], hints: ['六碳入口', '柠檬酸'] },
    { id: 'tca-blank-2', pos: 2, stepKey: '异柠檬酸', prompt: '② 柠檬酸重排为？', accept: ['异柠檬酸', 'isocitrate'], hints: ['柠檬酸异构体', '异柠檬酸'] },
    { id: 'tca-blank-3', pos: 3, stepKey: 'α-酮戊二酸', prompt: '③ 第一次脱羧后的五碳产物是？', accept: ['α-酮戊二酸', 'α-酮戊二酸（α-KG）', 'alpha-ketoglutarate'], hints: ['五碳 α-酮酸', 'α-KG'] },
    { id: 'tca-blank-4', pos: 4, stepKey: '琥珀酰辅酶 A', prompt: '④ 第二次脱羧后形成的高能硫酯是？', accept: ['琥珀酰辅酶 A', 'succinyl-CoA'], hints: ['四碳 + CoA', '琥珀酰-CoA'] },
    { id: 'tca-blank-5', pos: 5, stepKey: '琥珀酸', prompt: '⑤ 直接生成 GTP 后的四碳产物是？', accept: ['琥珀酸', 'succinate'], hints: ['琥珀酰辅酶 A 脱 CoA', '琥珀酸'] },
    { id: 'tca-blank-6', pos: 6, stepKey: '延胡索酸', prompt: '⑥ 琥珀酸脱氢后的产物是？', accept: ['延胡索酸', 'fumarate'], hints: ['FADH₂ 这一步之后', '延胡索酸'] },
    { id: 'tca-blank-7', pos: 7, stepKey: '苹果酸', prompt: '⑦ 延胡索酸水合后的产物是？', accept: ['苹果酸', 'malate'], hints: ['最后氧化前', '苹果酸'] },
    { id: 'tca-blank-8', pos: 8, stepKey: '草酰乙酸', prompt: '⑧ 苹果酸脱氢再生的四碳受体是？', accept: ['草酰乙酸', 'OAA', 'oxaloacetate'], hints: ['下一轮接乙酰辅酶 A', 'OAA'] }
  ], ['说出两次脱羧分别产生 1 CO₂ + 1 NADH。', '说出 rx307 直接生成 1 GTP。', '说出 rx308 生成 FADH₂ 并连接复合体 II。', '说出 OAA 再生且每轮不被净消耗。'], '乙酰辅酶 A → [①] → [②] → [③] → [④] → [⑤] → [⑥] → [⑦] → [⑧] → 回到 [①]'),
  review: { keyPoints: ['每分子乙酰辅酶 A：2 CO₂、3 NADH、1 FADH₂、1 GTP。', '两次脱羧是 rx305 与 rx306；唯一直接 GTP 是 rx307。', 'rx308 的琥珀酸脱氢连接复合体 II；rx310 再生草酰乙酸。', 'OAA 是催化性受体，循环结束后被再生而非净消耗。'], recall: ['按 8 个中间体复述 TCA 主线。', '写出一轮 TCA 的四类能量/碳产物。', '指出两次脱羧、直接 GTP、FADH₂ 和 OAA 再生的位置。'], acceptanceNote: '能从乙酰辅酶 A 走完整圈并说清能量账本，即可进入电子传递链。' },
  wrongAnswerMap: { rules: '同一段连续答错 2 题 → 回到对应段；连续 2 次错同一题 → 重看对应前置知识。', items: [
    { quizIds: ['tca-q1'], knowledge: '主干顺序混淆', action: '重走四段地图并逐步点亮中间体', jump: 'tca-s1', jumpHint: '段 1 · 乙酰辅酶 A→异柠檬酸' },
    { quizIds: ['tca-q2', 'tca-q3'], knowledge: 'TCA 能量账本或脱羧位置不清', action: '重看段 2 与回顾账本', jump: 'tca-s2', jumpHint: '段 2 · rx305/rx306/rx307' },
    { quizIds: ['tca-q4'], knowledge: 'OAA 再生与循环概念不清', action: '重看段 4 的 OAA 节点', jump: 'tca-s4', jumpHint: '段 4 · rx310 → rx303' },
    { quizIds: ['tca-q5'], knowledge: 'FADH₂ 与复合体 II 连接不清', action: '重看琥珀酸脱氢卡片', jump: 'tca-s3', jumpHint: '段 3 · rx308' }
  ] }
};

const MALATE_ASPARTATE_LESSON = {
  id: 'malate_aspartate', pathwayId: 'malate_aspartate', topicId: 'biooxidation', order: 3,
  scene: 'mitochondria-matrix', compartment: '细胞质 ↔ 线粒体基质',
  source: { tsv: 'data/reactions/malate_aspartate.tsv', rxIds: ['rx181', 'rx182', 'rx183', 'rx184', 'rx185', 'rx186', 'rx187'] },
  meta: {
    title: '胞质 NADH 的电子怎样进入线粒体？', name: '苹果酸–天冬氨酸穿梭',
    goal: '沿苹果酸入、天冬氨酸出的闭环，追踪胞质还原当量如何变成基质 NADH',
    question: 'NADH 本身不能穿过线粒体内膜，细胞用可跨膜的碳骨架接力电子。',
    problem: '把糖酵解产生的胞质 NADH 重新氧化成 NAD⁺，同时在基质侧生成 NADH。',
    purpose: '维持胞质氧化还原平衡，并把电子送入呼吸链复合体 I。',
    input: '胞质 NADH、草酰乙酸、谷氨酸', output: '基质 NADH、胞质 NAD⁺（碳骨架循环再生）',
    location: '细胞质 ↔ 线粒体内膜 ↔ 线粒体基质', minutes: 12, difficulty: 2,
    prerequisites: [
      { id: 'mas-pre1', name: '内膜选择性', note: 'NADH 不能直接穿过线粒体内膜', why: '穿梭转移的是电子，不是 NADH 分子' },
      { id: 'mas-pre2', name: 'MDH 反应', note: '草酰乙酸与苹果酸可逆互变', why: '两侧 MDH 完成电子装载与卸载' },
      { id: 'mas-pre3', name: '转氨反应', note: '草酰乙酸与天冬氨酸可逆互变', why: 'OAA 不能直接过膜，需要天冬氨酸回程' }
    ],
    keywords: ['MDH1', 'MDH2', '苹果酸', '天冬氨酸', '草酰乙酸', 'NADH', '反向转运体']
  },
  segments: [
    {
      id: 'malate_aspartate-s1', title: '段 1：胞质装载电子，苹果酸进入基质',
      goal: '看懂胞质 NADH 先还原 OAA，再由苹果酸携带还原当量过内膜。',
      steps: ['细胞质草酰乙酸', '细胞质苹果酸', '线粒体基质苹果酸'],
      stepContent: {
        '细胞质草酰乙酸': makeStructuredStep({ reactionId: 'rx181', what: '胞质 MDH1 用 NADH 把草酰乙酸还原成苹果酸。', why: 'NADH 不能直接过内膜，苹果酸可以通过载体进入基质。', how: 'OAA + NADH + H⁺ ⇌ 苹果酸 + NAD⁺。', so: '胞质 NAD⁺ 被再生，可继续支持糖酵解。', plain: '先把电子装到苹果酸上。', detail: 'rx181/rx182；胞质 MDH1 消耗 NADH。', hook: 'NADH 留在原地，电子换乘苹果酸。' }),
        '细胞质苹果酸': makeStructuredStep({ reactionId: 'rx183', what: '苹果酸携带还原当量到达线粒体内膜。', why: '它是这条穿梭的入程载体。', how: '苹果酸–α-KG 反向转运体让苹果酸入基质、α-KG 出基质。', so: '跨膜步骤与 α-KG 交换耦联。', plain: '苹果酸与 α-KG 交换过膜。', detail: 'rx183；反向转运维持物质平衡。', hook: '有进必有出，内膜载体不是敞开的门。' }),
        '线粒体基质苹果酸': makeStructuredStep({ reactionId: 'rx184', what: '进入基质的苹果酸被 MDH2 氧化回草酰乙酸。', why: '卸下电子并在基质侧生成 NADH。', how: '苹果酸 + NAD⁺ ⇌ OAA + NADH + H⁺。', so: '电子可从基质 NADH 进入复合体 I。', plain: '苹果酸在基质卸货，生成 NADH。', detail: 'rx184；基质 MDH2 与胞质 MDH1 方向相反。', hook: '同一对底物，两侧完成装载与卸载。' })
      },
      mapFocus: { dimOthers: true, highlightMode: 'segment' }, reactionIds: ['rx181', 'rx182', 'rx183', 'rx184'],
      transitionToNext: '电子已在基质侧变成 NADH；接下来要把不能过膜的 OAA 变成天冬氨酸送回胞质。'
    },
    {
      id: 'malate_aspartate-s2', title: '段 2：天冬氨酸回程，闭合碳骨架循环',
      goal: '追踪 OAA 经转氨变成天冬氨酸、出基质后再生胞质 OAA。',
      steps: ['线粒体基质苹果酸', '线粒体基质草酰乙酸', '天冬氨酸', '细胞质草酰乙酸'],
      stepContent: {
        '线粒体基质苹果酸': makeStructuredStep({ reactionId: 'rx184', what: 'MDH2 把苹果酸氧化成基质 OAA，并生成 NADH。', why: 'OAA 不能直接穿过内膜，必须继续换一种可运输形式。', how: '下一步由线粒体天冬氨酸转氨酶接手。', so: '电子收益与碳骨架回程从这里分开。', plain: '电子留下，OAA 准备换乘。', detail: 'rx184 后接 rx185。', hook: '基质 NADH 去呼吸链，OAA 去转氨。' }),
        '线粒体基质草酰乙酸': makeStructuredStep({ reactionId: 'rx185', what: '基质 OAA 接受谷氨酸的氨基，变成天冬氨酸。', why: '天冬氨酸能通过专用载体离开基质。', how: 'OAA + 谷氨酸 ⇌ 天冬氨酸 + α-KG。', so: '转氨把不可运输的 OAA 转成可运输的回程形式。', plain: 'OAA 换成天冬氨酸回程。', detail: 'rx185；同时生成 α-KG。', hook: '转氨在这里承担运输接口。' }),
        '天冬氨酸': makeStructuredStep({ reactionId: 'rx186', what: '天冬氨酸–谷氨酸载体把天冬氨酸输出到胞质。', why: '把四碳骨架送回胞质，才能闭合穿梭。', how: '天冬氨酸输出与谷氨酸、H⁺ 输入耦联。', so: '载体交换同时补回基质转氨所需谷氨酸。', plain: '天冬氨酸出，谷氨酸进。', detail: 'rx186；跨内膜交换。', hook: '回程也有配对交换。' }),
        '细胞质草酰乙酸': makeStructuredStep({ reactionId: 'rx187', what: '胞质天冬氨酸转氨酶把天冬氨酸变回 OAA。', why: '再生起点，穿梭才能反复运行。', how: '天冬氨酸 + α-KG ⇌ OAA + 谷氨酸。', so: '碳骨架和氨基载体循环再生，净效果只转移还原当量。', plain: '胞质 OAA 回来了，循环闭合。', detail: 'rx187；下一轮重新进入 rx181。', hook: '骨架不净消耗，净转移的是电子。' })
      },
      mapFocus: { dimOthers: true, highlightMode: 'segment' }, reactionIds: ['rx184', 'rx185', 'rx186', 'rx187'],
      transitionToNext: '净效果：胞质 NADH 的还原当量变成基质 NADH，进入复合体 I。'
    }
  ],
  quiz: [
    { id: 'mas-q1', kind: 'truefalse', stem: '苹果酸–天冬氨酸穿梭会把胞质 NADH 分子本身运入基质。', options: ['正确', '错误'], correct: 1, explanation: 'NADH 不过膜；穿梭转移的是还原当量。', retarget: 'malate_aspartate-s1', weight: 1 },
    { id: 'mas-q2', kind: 'order', stem: '把主循环顺序排好。', options: ['胞质 OAA 还原为苹果酸', '苹果酸进入基质', '基质苹果酸氧化为 OAA', 'OAA 转氨为天冬氨酸', '天冬氨酸回到胞质并再生 OAA'], correct: [0, 1, 2, 3, 4], explanation: '苹果酸负责入程，天冬氨酸负责回程。', retarget: 'malate_aspartate-s1', weight: 1 },
    { id: 'mas-q3', kind: 'single', stem: '这条穿梭在基质侧直接生成什么？', options: ['NADH', 'FADH₂', 'ATP', '乳酸'], correct: 0, explanation: 'MDH2 氧化苹果酸并生成基质 NADH。', retarget: 'malate_aspartate-s1', weight: 1 },
    { id: 'mas-q4', kind: 'fill', stem: '不能直接过内膜的 OAA 通过转氨变成什么回到胞质？', accept: ['天冬氨酸', 'aspartate', 'Asp'], explanation: '天冬氨酸是 OAA 碳骨架的可运输回程形式。', retarget: 'malate_aspartate-s2', weight: 1 }
  ],
  challenge: makeStructuredChallenge('malate-aspartate-challenge', ['细胞质苹果酸', '线粒体基质苹果酸', '天冬氨酸', '细胞质草酰乙酸'], [
    { id: 'mas-blank-1', pos: 1, stepKey: '细胞质苹果酸', prompt: '① 胞质 OAA 接收 NADH 电子后变成？', accept: ['苹果酸', '细胞质苹果酸', 'malate'], hints: ['可通过载体入基质', '苹果酸'] },
    { id: 'mas-blank-2', pos: 2, stepKey: '线粒体基质苹果酸', prompt: '② 哪个分子进入基质后由 MDH2 氧化？', accept: ['苹果酸', '线粒体基质苹果酸', 'malate'], hints: ['入程载体', '苹果酸'] },
    { id: 'mas-blank-3', pos: 3, stepKey: '天冬氨酸', prompt: '③ 基质 OAA 转氨后以什么形式回胞质？', accept: ['天冬氨酸', 'aspartate', 'Asp'], hints: ['回程形式', '天冬氨酸'] },
    { id: 'mas-blank-4', pos: 4, stepKey: '细胞质草酰乙酸', prompt: '④ 胞质侧最终再生什么起点？', accept: ['草酰乙酸', '细胞质草酰乙酸', 'OAA'], hints: ['四碳受体', 'OAA'] }
  ], ['说明 NADH 分子本身不过内膜。', '说出苹果酸入程、天冬氨酸回程。', '说出基质 MDH2 生成 NADH，并接入复合体 I。'], '胞质 OAA → [①] → [②] → 基质 OAA → [③] → [④]'),
  review: { keyPoints: ['穿梭转移还原当量，不运输 NADH 分子。', '胞质 MDH1 消耗 NADH，基质 MDH2 生成 NADH。', '苹果酸入程，天冬氨酸回程；转运和转氨闭合碳骨架循环。'], recall: ['按区室复述苹果酸入、天冬氨酸出的完整闭环。', '解释为什么 OAA 和 NADH 都不能直接完成跨膜。', '说明这条穿梭为何把电子接到复合体 I。'], acceptanceNote: '能区分“电子转移”和“分子运输”，并走完整个闭环即可。' },
  wrongAnswerMap: { rules: '答错后回到电子装载段或碳骨架回程段。', items: [
    { quizIds: ['mas-q1', 'mas-q3'], knowledge: '还原当量转移与基质 NADH 生成不清', action: '重看 MDH1/MDH2 的相反方向', jump: 'malate_aspartate-s1', jumpHint: '段 1 · 电子装载与卸载' },
    { quizIds: ['mas-q2', 'mas-q4'], knowledge: '苹果酸入程、天冬氨酸回程顺序不清', action: '重走转运与转氨闭环', jump: 'malate_aspartate-s2', jumpHint: '段 2 · 天冬氨酸回程' }
  ] }
};

const GLYCEROL_PHOSPHATE_LESSON = {
  id: 'glycerol_phosphate', pathwayId: 'glycerol_phosphate', topicId: 'biooxidation', order: 4,
  scene: 'mitochondria-inner-membrane', compartment: '细胞质 / 线粒体内膜外侧',
  source: { tsv: 'data/reactions/glycerol_phosphate.tsv', rxIds: ['rx120', 'rx121', 'rx122'] },
  meta: {
    title: '胞质 NADH 怎样快速把电子交给辅酶 Q？', name: '甘油-3-磷酸穿梭',
    goal: '追踪 NADH → 甘油-3-磷酸 → FAD → CoQ 的电子接力',
    question: '这条穿梭用 DHAP/G3P 循环快速再生胞质 NAD⁺，电子从复合体 III 前的 CoQ 池进入呼吸链。',
    problem: '让胞质 NADH 快速再氧化，同时绕过复合体 I 把电子送入呼吸链。',
    purpose: '在骨骼肌和脑等组织快速维持糖酵解与电子传递。',
    input: '胞质 NADH、DHAP、氧化型 CoQ', output: '胞质 NAD⁺、CoQH₂（DHAP 再生）',
    location: '细胞质 / 线粒体内膜朝膜间隙一侧', minutes: 8, difficulty: 2,
    prerequisites: [
      { id: 'gps-pre1', name: '糖酵解中间体', note: 'DHAP 与 G3P 可互变', why: '它们构成可循环的电子载体对' },
      { id: 'gps-pre2', name: '黄素辅基', note: 'GPD2 使用酶结合 FAD 接收电子', why: '电子不在基质形成 NADH' },
      { id: 'gps-pre3', name: '辅酶 Q 池', note: 'CoQH₂ 把电子交给复合体 III', why: '该穿梭绕过复合体 I' }
    ],
    keywords: ['DHAP', '甘油-3-磷酸', 'GPD1', 'GPD2', 'FADH₂', 'CoQH₂', '复合体 I']
  },
  segments: [
    {
      id: 'glycerol_phosphate-s1', title: '段 1：胞质 NADH 把电子装到甘油-3-磷酸',
      goal: '理解 GPD1 用 NADH 还原 DHAP，并立即再生胞质 NAD⁺。',
      steps: ['细胞质还原型烟酰胺腺嘌呤二核苷酸（NADH）', '磷酸二羟丙酮', '甘油-3-磷酸'],
      stepContent: {
        '细胞质还原型烟酰胺腺嘌呤二核苷酸（NADH）': makeStructuredStep({ reactionId: 'rx121', what: '胞质 NADH 把电子交给 DHAP。', why: '再生 NAD⁺，让糖酵解的 GAPDH 步骤继续。', how: '胞质 GPD1 催化 DHAP + NADH + H⁺ ⇌ G3P + NAD⁺。', so: '胞质 NADH 被氧化，但没有进入线粒体基质。', plain: 'NADH 把电子装到 G3P。', detail: 'rx120/rx121；胞质甘油-3-磷酸脱氢酶。', hook: '先救回胞质 NAD⁺。' }),
        '磷酸二羟丙酮': makeStructuredStep({ reactionId: 'rx120', what: 'DHAP 是糖酵解中间体，也是这条穿梭的电子受体。', why: '它能被还原成甘油-3-磷酸并循环使用。', how: '接受 NADH 的电子和质子形成 G3P。', so: '穿梭借用了糖酵解碳骨架，但不净消耗 DHAP。', plain: 'DHAP 是可重复使用的电子接力棒。', detail: 'rx120；DHAP 与 G3P 可逆互变。', hook: '碳骨架循环，电子单向前进。' }),
        '甘油-3-磷酸': makeStructuredStep({ reactionId: 'rx122', what: '甘油-3-磷酸把电子带到线粒体内膜外侧的 GPD2。', why: 'GPD2 能把电子继续交给 FAD 和 CoQ。', how: 'G3P 被重新氧化为 DHAP。', so: 'DHAP 返回胞质循环，电子进入膜上的下一棒。', plain: 'G3P 到内膜卸下电子。', detail: 'rx122；GPD2 位于线粒体内膜。', hook: 'G3P 不是终点，它会再变回 DHAP。' })
      },
      mapFocus: { dimOthers: true, highlightMode: 'segment' }, reactionIds: ['rx120', 'rx121', 'rx122'],
      transitionToNext: '胞质 NAD⁺ 已再生；下一段看 GPD2 如何把电子经 FAD 送入 CoQ 池。'
    },
    {
      id: 'glycerol_phosphate-s2', title: '段 2：FAD 接力，电子进入辅酶 Q 池',
      goal: '看懂 GPD2 的酶结合 FAD 与 CoQ 接力，并解释为何绕过复合体 I。',
      steps: ['甘油-3-磷酸', '酶结合的还原型黄素腺嘌呤二核苷酸（FADH₂）', '还原型辅酶 Q（泛醇）'],
      stepContent: {
        '甘油-3-磷酸': makeStructuredStep({ reactionId: 'rx122', what: 'GPD2 氧化 G3P，同时把酶结合 FAD 还原为 FADH₂。', why: 'FAD 是从 G3P 到 CoQ 的近距离电子中介。', how: 'G3P → DHAP；FAD → FADH₂。', so: 'DHAP 被再生并回到胞质侧继续循环。', plain: 'GPD2 收走 G3P 的电子。', detail: 'rx122；反应位于线粒体内膜外侧。', hook: '第二棒是酶内 FAD。' }),
        '酶结合的还原型黄素腺嘌呤二核苷酸（FADH₂）': makeStructuredStep({ reactionId: 'rx122', what: 'GPD2 上的 FADH₂ 把电子交给氧化型 CoQ。', why: 'CoQ 是呼吸链膜内可移动电子载体。', how: 'FADH₂ 被再氧化为 FAD，CoQ 被还原为 CoQH₂。', so: 'FAD 辅基原位再生，不作为游离 FADH₂ 离开酶。', plain: '酶内 FAD 只负责中转。', detail: 'rx122；FAD/FADH₂ 循环发生在 GPD2 内。', hook: 'FAD 不离岗，电子继续走。' }),
        '还原型辅酶 Q（泛醇）': makeStructuredStep({ reactionId: 'rx122', what: 'CoQ 接收电子后成为 CoQH₂。', why: 'CoQH₂ 可把电子直接送往复合体 III。', how: '电子从 CoQ 池进入呼吸链下游。', so: '这条路线绕过复合体 I，通常每对电子的 ATP 收益低于基质 NADH。', plain: '电子从 CoQ 池接入复合体 III。', detail: 'rx122；常用估算约 1.5 ATP/胞质 NADH。', hook: '速度快，但少经过一个泵氢位点。' })
      },
      mapFocus: { dimOthers: true, highlightMode: 'segment' }, reactionIds: ['rx122'],
      transitionToNext: '净效果：胞质 NADH 被氧化，电子以 CoQH₂ 形式从复合体 III 前进入呼吸链。'
    }
  ],
  quiz: [
    { id: 'gps-q1', kind: 'single', stem: '胞质 GPD1 直接用 NADH 还原哪个底物？', options: ['DHAP', '草酰乙酸', '丙酮酸', '氧气'], correct: 0, explanation: 'DHAP 接收电子变成甘油-3-磷酸。', retarget: 'glycerol_phosphate-s1', weight: 1 },
    { id: 'gps-q2', kind: 'truefalse', stem: '这条穿梭在线粒体基质内生成 NADH。', options: ['正确', '错误'], correct: 1, explanation: '电子经 GPD2 的 FAD 直接进入 CoQ 池，不生成基质 NADH。', retarget: 'glycerol_phosphate-s2', weight: 1 },
    { id: 'gps-q3', kind: 'order', stem: '把电子传递顺序排好。', options: ['胞质 NADH', 'DHAP / 甘油-3-磷酸', 'GPD2 的 FAD', 'CoQ', '复合体 III'], correct: [0, 1, 2, 3, 4], explanation: '电子经 G3P 和酶结合 FAD 接到 CoQ 池。', retarget: 'glycerol_phosphate-s2', weight: 1 },
    { id: 'gps-q4', kind: 'fill', stem: '甘油-3-磷酸穿梭绕过呼吸链的哪个复合体？', accept: ['复合体 I', '复合体I', 'Complex I', 'complex I'], explanation: '电子从 CoQ 池进入，绕过复合体 I。', retarget: 'glycerol_phosphate-s2', weight: 1 }
  ],
  challenge: makeStructuredChallenge('glycerol-phosphate-challenge', ['磷酸二羟丙酮', '甘油-3-磷酸', '酶结合的还原型黄素腺嘌呤二核苷酸（FADH₂）', '还原型辅酶 Q（泛醇）'], [
    { id: 'gps-blank-1', pos: 1, stepKey: '磷酸二羟丙酮', prompt: '① 胞质 NADH 先把什么还原？', accept: ['磷酸二羟丙酮', 'DHAP'], hints: ['糖酵解三碳中间体', 'DHAP'] },
    { id: 'gps-blank-2', pos: 2, stepKey: '甘油-3-磷酸', prompt: '② DHAP 接受电子后变成？', accept: ['甘油-3-磷酸', 'G3P'], hints: ['穿梭名称中的分子', 'G3P'] },
    { id: 'gps-blank-3', pos: 3, stepKey: '酶结合的还原型黄素腺嘌呤二核苷酸（FADH₂）', prompt: '③ GPD2 内先接收电子的辅基是？', accept: ['FAD', 'FADH₂', 'FADH2'], hints: ['黄素辅基', 'FAD'] },
    { id: 'gps-blank-4', pos: 4, stepKey: '还原型辅酶 Q（泛醇）', prompt: '④ 最终形成并进入呼吸链的还原型载体是？', accept: ['CoQH₂', 'CoQH2', '还原型辅酶 Q', '泛醇'], hints: ['辅酶 Q 的还原型', 'CoQH₂'] }
  ], ['说出 DHAP/G3P 循环再生胞质 NAD⁺。', '说出 GPD2 的 FAD 是酶结合中介。', '说出电子进入 CoQ 池并绕过复合体 I。'], '胞质 NADH → [①] → [②] → [③] → [④] → 复合体 III'),
  review: { keyPoints: ['GPD1 用胞质 NADH 把 DHAP 还原为 G3P，并再生 NAD⁺。', 'GPD2 把 G3P 电子经酶结合 FAD 交给 CoQ。', '电子从 CoQ 池进入复合体 III，因此绕过复合体 I。'], recall: ['按 NADH → G3P → FAD → CoQ 复述电子路线。', '解释 DHAP/G3P 为什么不被净消耗。', '比较它与苹果酸–天冬氨酸穿梭的呼吸链入口。'], acceptanceNote: '能说清电子接力和复合体 I 绕行，即可进入电子传递链。' },
  wrongAnswerMap: { rules: '答错后回到胞质装载段或内膜电子接力段。', items: [
    { quizIds: ['gps-q1'], knowledge: 'DHAP/G3P 与胞质 NAD⁺ 再生不清', action: '重看 GPD1 反应', jump: 'glycerol_phosphate-s1', jumpHint: '段 1 · NADH → G3P' },
    { quizIds: ['gps-q2', 'gps-q3', 'gps-q4'], knowledge: 'FAD/CoQ 接力与复合体 I 绕行不清', action: '重看 GPD2 与 CoQ 卡片', jump: 'glycerol_phosphate-s2', jumpHint: '段 2 · FAD → CoQ' }
  ] }
};

window.COURSE_DATA = {
  version: '2026-08-15-3',
  topics: {
    biooxidation: {
      id: 'biooxidation',
      name: '生物氧化',
      label: '生物氧化',
      english: 'Bioenergetics',
      order: 1,
      lessons: ['pdh', 'tca', 'malate_aspartate', 'glycerol_phosphate', 'etc', 'oxphos'],
      lessonIds: ['pdh', 'tca', 'malate_aspartate', 'glycerol_phosphate', 'etc', 'oxphos']
    },
    carbohydrate: {
      id: 'carbohydrate',
      name: '糖代谢',
      label: '糖代谢',
      english: 'Carbohydrate metabolism',
      order: 2,
      lessons: ['glycolysis', 'gluconeogenesis', 'glycogenesis', 'glycogenolysis', 'ppp'],
      lessonIds: ['glycolysis', 'gluconeogenesis', 'glycogenesis', 'glycogenolysis', 'ppp']
    },
    lipid: {
      id: 'lipid',
      name: '脂代谢',
      label: '脂代谢',
      english: 'Lipid metabolism',
      order: 3,
      lessons: ['fa_synthesis', 'carnitine', 'beta_oxidation', 'ketone'],
      lessonIds: ['fa_synthesis', 'carnitine', 'beta_oxidation', 'ketone']
    },
    amino: {
      id: 'amino',
      name: '氨基酸和含氮代谢',
      label: '氨基酸和含氮代谢',
      english: 'Amino acid & nitrogen metabolism',
      order: 4,
      lessons: ['transamination', 'urea', 'aa_carbon'],
      lessonIds: ['transamination', 'urea', 'aa_carbon']
    },
    nucleotide: {
      id: 'nucleotide',
      name: '核苷酸代谢',
      label: '核苷酸代谢',
      english: 'Nucleotide metabolism',
      order: 5,
      lessons: ['purine', 'pyrimidine', 'nucleotide_degradation'],
      lessonIds: ['purine', 'pyrimidine', 'nucleotide_degradation']
    }
  },
  lessons: {
    pdh: PDH_LESSON,
    tca: TCA_LESSON,
    malate_aspartate: MALATE_ASPARTATE_LESSON,
    glycerol_phosphate: GLYCEROL_PHOSPHATE_LESSON,
    glycolysis: {
      id: 'glycolysis',
      pathwayId: 'glycolysis',
      topicId: 'carbohydrate',
      order: 1,
      scene: 'cytosol',
      compartment: '细胞质',
      source: {
        tsv: 'data/reactions/glycolysis.tsv',
        rxIds: ['rx123', 'rx133', 'rx134', 'rx135', 'rx136', 'rx137', 'rx138', 'rx139', 'rx140', 'rx141', 'rx142']
      },
      meta: {
        title: '一分子葡萄糖能先得到什么？',
        name: '糖酵解',
        goal: '看懂葡萄糖到丙酮酸的主干',
        question: '糖酵解把 6 个碳的葡萄糖分成两份 3 个碳的丙酮酸，并直接得到少量 ATP。',
        problem: '快速取得 ATP，并把碳流送到乳酸、乙酰辅酶 A 或其他代谢方向。',
        purpose: '不依赖线粒体也能供能，是所有细胞都重要的中央入口。',
        input: '葡萄糖、ADP、Pi、NAD⁺',
        output: '丙酮酸、净 ATP、NADH',
        location: '细胞质',
        prerequisites: [
          {
            id: 'pre1',
            name: 'ATP 与 ADP',
            note: 'ATP 是细胞的能量货币，水解/转移磷酸基后变成 ADP',
            why: '糖酵解 10 步里有 4 步的反应式出现 ATP/ADP；读不懂"ATP → ADP"就读不懂能量账本',
            screen: '进入课程前 1 题筛选：给出 葡萄糖 + ATP → G6P + ADP，问"ATP 变成了什么？"答对 ADP 角色即可放行；答错则回跳前置知识 1。'
          },
          {
            id: 'pre2',
            name: '酶的概念',
            note: '酶是催化剂，一种酶催化一种底物转变',
            why: '10 步各有专属酶名（己糖激酶、醛缩酶……），课程全程用"底物 + 酶 → 产物"的语言'
          },
          {
            id: 'pre3',
            name: '细胞质区室',
            note: '细胞质是细胞膜以内、细胞核以外的部分',
            why: '糖酵解全程在细胞质——这是它与线粒体内 TCA/氧化磷酸化最根本的空间区别，也是"为什么 NADH 要跨膜送进去"的伏笔'
          },
          {
            id: 'pre4',
            name: '磷酸基团',
            note: '磷酸化 = 把一个磷酸基团接到分子上',
            why: '反应 1、3 是磷酸化，反应 7、10 是磷酸基转移产 ATP；"磷酸化把分子困在细胞里"这个直觉后面要用'
          },
          {
            id: 'pre5',
            name: '氧化还原初步',
            note: 'NAD⁺ 是氧化型、NADH 是还原型，NAD⁺ + 2e⁻ + H⁺ → NADH',
            why: '反应 6 是糖酵解唯一的氧化还原步；只需会读"NAD⁺ 被还原成 NADH"的方向，不需要懂机制'
          }
        ],
        keywords: ['底物水平磷酸化', '承诺步骤', '丙酮酸', '己糖激酶', '磷酸果糖激酶-1', '丙酮酸激酶'],
        minutes: 12,
        difficulty: 1
      },
      segments: [
        {
          id: 'glycolysis-s1',
          title: '段 1：葡萄糖活化（投入期）｜反应 1–3',
          goal: '葡萄糖被两次磷酸化变成果糖-1,6-二磷酸，投入 2 个 ATP，把分子"困"在细胞里并激活到可以被切开。',
          steps: ['葡萄糖', '葡萄糖-6-磷酸', '果糖-6-磷酸', '果糖-1,6-二磷酸'],
          stepContent: {
            '葡萄糖': {
              fourQuestions: {
                what: '一个葡萄糖分子，怎样在细胞质中转化成丙酮酸，并获得少量 ATP？',
                why: '你吃下的每一口淀粉，都要先变成葡萄糖，再走完这条 10 步的路——糖酵解。它是地球上几乎所有细胞都在用的最古老的能量通路之一。',
                how: '糖酵解的入口是 1 分子葡萄糖（6C），出口是 2 分子丙酮酸（3C），全程发生在细胞质。',
                so: '为什么剧烈运动时肌肉会发酸、发胀？——答案藏在糖酵解出口的丙酮酸身上。'
              },
              layers: {
                plain: '糖酵解的入口是 1 分子葡萄糖（6C），出口是 2 分子丙酮酸（3C），全程发生在细胞质。',
                detail: '入口：1 分子葡萄糖（6C），来自血液，经 GLUT 转运体进细胞（主线以游离葡萄糖为起点）。出口：2 分子丙酮酸（3C）。区室：全程细胞质（cytosol）——不进线粒体、不需要氧气。',
                hook: '如果把糖酵解比作一条流水线，哪三个工位是"只进不退"的单行道？'
              }
            },
            '葡萄糖-6-磷酸': {
              notesRef: 'glycolysis|葡萄糖@cytosol>葡萄糖-6-磷酸@cytosol',
              fourQuestions: {
                what: '葡萄糖刚进细胞，己糖激酶就把 ATP 末端的磷酸基"贴"到葡萄糖的第 6 号碳上，生成葡萄糖-6-磷酸（G6P）。葡萄糖 + ATP → G6P + ADP',
                why: '两件事。第一，困住它——磷酸化的葡萄糖带负电，过不了细胞膜上的葡萄糖转运体，进得来出不去；第二，激活它——磷酸基团让分子不稳定、能量升高，为后面第 4 步的劈裂做准备。',
                how: '消耗 1 ATP（第一笔投入）。碳数不变：6C → 6C。',
                so: '不可逆（可逆=否），是糖酵解三个不可逆步骤之一。受产物抑制：G6P 积累时会回头抑制己糖激酶（进阶：肝脏用的是同工酶葡萄糖激酶，不受 G6P 抑制、Km 高）。'
              },
              layers: {
                plain: '用 ATP 给葡萄糖加上磷酸，相当于先给它盖章。',
                detail: '必学：葡萄糖 + ATP → G6P + ADP；不可逆；耗 1 ATP。理解：磷酸化 = 困在细胞内 + 活化；产物抑制。',
                hook: '进门先买票：花 1 个 ATP，把葡萄糖留在细胞里。'
              },
              reactions: [
                {
                  stepNo: 1,
                  rxId: 'rx123',
                  enzyme: '己糖激酶',
                  equation: '葡萄糖 + ATP → G6P + ADP',
                  reversible: false,
                  isRegulatory: true,
                  isRateLimiting: false,
                  notesRef: 'glycolysis|葡萄糖@cytosol>葡萄糖-6-磷酸@cytosol',
                  fourQuestions: {
                    what: '葡萄糖刚进细胞，己糖激酶就把 ATP 末端的磷酸基"贴"到葡萄糖的第 6 号碳上，生成葡萄糖-6-磷酸（G6P）。葡萄糖 + ATP → G6P + ADP',
                    why: '两件事。第一，困住它——磷酸化的葡萄糖带负电，过不了细胞膜上的葡萄糖转运体，进得来出不去；第二，激活它——磷酸基团让分子不稳定、能量升高，为后面第 4 步的劈裂做准备。',
                    how: '消耗 1 ATP（第一笔投入）。碳数不变：6C → 6C。',
                    so: '不可逆（可逆=否），是糖酵解三个不可逆步骤之一。受产物抑制：G6P 积累时会回头抑制己糖激酶（进阶：肝脏用的是同工酶葡萄糖激酶，不受 G6P 抑制、Km 高）。'
                  },
                  tiers: {
                    must: '葡萄糖 + ATP → G6P + ADP；不可逆；耗 1 ATP',
                    understand: '磷酸化 = 困在细胞内 + 活化；产物抑制',
                    advanced: '肝脏同工酶葡萄糖激酶（高 Km、不受 G6P 抑制）；糖尿病药理联系'
                  }
                }
              ]
            },
            '果糖-6-磷酸': {
              notesRef: 'glycolysis|葡萄糖-6-磷酸@cytosol>果糖-6-磷酸@cytosol',
              fourQuestions: {
                what: 'G6P 内部原子重新排列，醛糖变酮糖，生成果糖-6-磷酸（F6P）。G6P ⇌ F6P',
                why: '把第 1 号碳腾出来——F6P 的 C1 是自由的，下一步 PFK-1 才能在那里加第二个磷酸。这是"为下一次磷酸化摆好姿势"。',
                how: '无 ATP 进出，无碳数变化（6C → 6C）。',
                so: '可逆（可逆=是），接近平衡，不受别构调控。'
              },
              layers: {
                plain: '只调整分子结构，把葡萄糖骨架变成果糖骨架。',
                detail: '必学：G6P ⇌ F6P；可逆。理解：腾出 C1 为第二次磷酸化做准备。',
                hook: '原子没增减，只是换个姿势。'
              },
              reactions: [
                {
                  stepNo: 2,
                  rxId: 'rx133',
                  enzyme: '磷酸葡萄糖异构酶',
                  equation: 'G6P ⇌ F6P',
                  reversible: true,
                  isRegulatory: false,
                  isRateLimiting: false,
                  notesRef: 'glycolysis|葡萄糖-6-磷酸@cytosol>果糖-6-磷酸@cytosol',
                  fourQuestions: {
                    what: 'G6P 内部原子重新排列，醛糖变酮糖，生成果糖-6-磷酸（F6P）。G6P ⇌ F6P',
                    why: '把第 1 号碳腾出来——F6P 的 C1 是自由的，下一步 PFK-1 才能在那里加第二个磷酸。这是"为下一次磷酸化摆好姿势"。',
                    how: '无 ATP 进出，无碳数变化（6C → 6C）。',
                    so: '可逆（可逆=是），接近平衡，不受别构调控。'
                  },
                  tiers: {
                    must: 'G6P ⇌ F6P；可逆',
                    understand: '腾出 C1 为第二次磷酸化做准备',
                    advanced: '酶缺陷 → 溶血性贫血（罕见病）'
                  }
                }
              ]
            },
            '果糖-1,6-二磷酸': {
              notesRef: 'glycolysis|果糖-6-磷酸@cytosol>果糖-1,6-二磷酸@cytosol',
              fourQuestions: {
                what: '磷酸果糖激酶-1 把第二个磷酸加到果糖-6-磷酸上，生成果糖-1,6-二磷酸（F-1,6-BP）。F6P + ATP → F-1,6-BP + ADP',
                why: '这相当于让葡萄糖正式承诺进入糖酵解，因此是整条通路最重要的调控点。前面的磷酸化只是"把分子困住"（G6P 还能走糖原、磷酸戊糖途径等其他路），而 F-1,6-BP 只能被醛缩酶劈开——一旦跨过这一步，就回不了头了。所以细胞在这里设闸门：能量充足（ATP 多）就放慢，能量短缺（AMP 多）就放行。',
                how: '消耗 1 ATP（第二笔投入，至此投入共 2 ATP）。碳数不变（6C → 6C）。',
                so: '不可逆（可逆=否），数据标注限速步。别构调控：ATP、柠檬酸抑制；AMP、ADP 激活（理解层）；果糖-2,6-二磷酸（F-2,6-BP）是最强激活剂（进阶层，注意与 F-1,6-BP 区分）。'
              },
              layers: {
                plain: '再消耗 1 个 ATP，给果糖-6-磷酸加第二个磷酸。',
                detail: '必学：F6P + ATP → F-1,6-BP + ADP；不可逆；限速步；最重要调控点。理解："正式承诺进入糖酵解"；能量状态调节（ATP 抑制、AMP 激活）。',
                hook: '第二次买票；磷酸果糖激酶-1 是关键关卡。'
              },
              reactions: [
                {
                  stepNo: 3,
                  rxId: 'rx134',
                  enzyme: '磷酸果糖激酶-1',
                  equation: 'F6P + ATP → F-1,6-BP + ADP',
                  reversible: false,
                  isRegulatory: true,
                  isRateLimiting: true,
                  notesRef: 'glycolysis|果糖-6-磷酸@cytosol>果糖-1,6-二磷酸@cytosol',
                  fourQuestions: {
                    what: '磷酸果糖激酶-1 把第二个磷酸加到果糖-6-磷酸上，生成果糖-1,6-二磷酸（F-1,6-BP）。F6P + ATP → F-1,6-BP + ADP',
                    why: '这相当于让葡萄糖正式承诺进入糖酵解，因此是整条通路最重要的调控点。前面的磷酸化只是"把分子困住"（G6P 还能走糖原、磷酸戊糖途径等其他路），而 F-1,6-BP 只能被醛缩酶劈开——一旦跨过这一步，就回不了头了。所以细胞在这里设闸门：能量充足（ATP 多）就放慢，能量短缺（AMP 多）就放行。',
                    how: '消耗 1 ATP（第二笔投入，至此投入共 2 ATP）。碳数不变（6C → 6C）。',
                    so: '不可逆（可逆=否），数据标注限速步。别构调控：ATP、柠檬酸抑制；AMP、ADP 激活（理解层）；果糖-2,6-二磷酸（F-2,6-BP）是最强激活剂（进阶层，注意与 F-1,6-BP 区分）。'
                  },
                  tiers: {
                    must: 'F6P + ATP → F-1,6-BP + ADP；不可逆；限速步；最重要调控点',
                    understand: '"正式承诺进入糖酵解"；能量状态调节（ATP 抑制、AMP 激活）',
                    advanced: '果糖-2,6-二磷酸（F-2,6-BP）最强激活剂及其激素调节；与 F-1,6-BP 的命名区分'
                  }
                }
              ]
            }
          },
          mapFocus: { dimOthers: true, highlightMode: 'segment' },
          reactions: [1, 2, 3],
          reactionIds: ['rx123', 'rx133', 'rx134'],
          transitionToNext: '现在这个六碳分子已经背上了两个磷酸基团，能量充足、结构松动——下一步就是把它拦腰劈成两半。'
        },
        {
          id: 'glycolysis-s2',
          title: '段 2：六碳分裂为两个三碳分子｜反应 4–5',
          goal: '一个六碳 F-1,6-BP 裂解并统一为两个三碳的甘油醛-3-磷酸，下游所有收益自动翻倍。',
          steps: ['果糖-1,6-二磷酸', '磷酸二羟丙酮', '甘油醛-3-磷酸'],
          stepContent: {
            '果糖-1,6-二磷酸': {
              fourQuestions: {
                what: '现在这个六碳分子已经背上了两个磷酸基团，能量充足、结构松动——下一步就是把它拦腰劈成两半。',
                why: '一个六碳 F-1,6-BP 裂解并统一为两个三碳的甘油醛-3-磷酸，下游所有收益自动翻倍。',
                how: '把"一个六碳"变成"两个三碳"，从这一步起所有下游产出自动×2——这是糖酵解"少量 ATP"的秘密：一份投入，双份回报。',
                so: '从此账本上所有数字都要×2——每个三碳分子走完后半程，就是双份收获。第一个收获点来了：氧化。'
              },
              layers: {
                plain: '把一个六碳糖切成两个三碳糖：磷酸二羟丙酮和甘油醛-3-磷酸。',
                detail: '醛缩酶把六碳的 F-1,6-BP 从中间劈开，得到两个三碳分子——磷酸二羟丙酮（DHAP）和甘油醛-3-磷酸（G3P）。F-1,6-BP ⇌ DHAP + G3P',
                hook: '一刀两断：六碳变成两个三碳。'
              }
            },
            '甘油醛-3-磷酸': {
              notesRef: 'glycolysis|果糖-1,6-二磷酸@cytosol>甘油醛-3-磷酸@cytosol',
              fourQuestions: {
                what: '反应 4 · 醛缩酶（可逆 · 分叉反应）：醛缩酶把六碳的 F-1,6-BP 从中间劈开，得到两个三碳分子——磷酸二羟丙酮（DHAP）和甘油醛-3-磷酸（G3P）。F-1,6-BP ⇌ DHAP + G3P（数据中此反应占两条边 rx135/rx136，主链产物选 DHAP，因为下一步 TPI 把它转成 G3P）\n反应 5 · 磷酸丙糖异构酶（可逆）：磷酸丙糖异构酶把 DHAP 转成它的异构体 G3P。DHAP ⇌ G3P',
                why: '反应 4 · 醛缩酶：把"一个六碳"变成"两个三碳"，从这一步起所有下游产出自动×2——这是糖酵解"少量 ATP"的秘密：一份投入，双份回报。\n反应 5 · 磷酸丙糖异构酶：因为下一站（反应 6 的脱氢酶）只认 G3P。DHAP 不转过去就会卡在半路，两个三碳必须"统一队形"才能一起往下走。',
                how: '反应 4 · 醛缩酶：无 ATP。碳数变化：1×6C → 1×3C + 1×3C。\n反应 5 · 磷酸丙糖异构酶：无 ATP。碳数不变（2×3C）。',
                so: '反应 4 · 醛缩酶：可逆（可逆=是）。虽然反应本身在标准条件下不太有利，但下游持续消耗 G3P，把平衡强力拉向前（理解层）。\n反应 5 · 磷酸丙糖异构酶：可逆（可逆=是）。进阶：这是催化效率接近极限的"近乎完美酶"，一次催化约 10⁸ 次/秒级。'
              },
              layers: {
                plain: '把一个六碳糖切成两个三碳糖：磷酸二羟丙酮和甘油醛-3-磷酸。把磷酸二羟丙酮转成甘油醛-3-磷酸。',
                detail: '必学（反应 4）：F-1,6-BP → DHAP + G3P；可逆；六碳裂为两三碳。理解（反应 4）：从这步起产出×2；下游消耗拉动平衡。必学（反应 5）：DHAP → G3P；可逆。理解（反应 5）：下游只认 G3P，必须统一队形。',
                hook: '一刀两断：六碳变成两个三碳。把配角转成主角，两份一起进入收益阶段。'
              },
              reactions: [
                {
                  stepNo: 4,
                  rxId: 'rx135',
                  enzyme: '醛缩酶',
                  equation: 'F-1,6-BP ⇌ DHAP + G3P',
                  reversible: true,
                  isRegulatory: false,
                  isRateLimiting: false,
                  notesRef: 'glycolysis|果糖-1,6-二磷酸@cytosol>甘油醛-3-磷酸@cytosol',
                  fourQuestions: {
                    what: '醛缩酶把六碳的 F-1,6-BP 从中间劈开，得到两个三碳分子——磷酸二羟丙酮（DHAP）和甘油醛-3-磷酸（G3P）。F-1,6-BP ⇌ DHAP + G3P（数据中此反应占两条边 rx135/rx136，主链产物选 DHAP，因为下一步 TPI 把它转成 G3P）',
                    why: '把"一个六碳"变成"两个三碳"，从这一步起所有下游产出自动×2——这是糖酵解"少量 ATP"的秘密：一份投入，双份回报。',
                    how: '无 ATP。碳数变化：1×6C → 1×3C + 1×3C。',
                    so: '可逆（可逆=是）。虽然反应本身在标准条件下不太有利，但下游持续消耗 G3P，把平衡强力拉向前（理解层）。'
                  },
                  tiers: {
                    must: 'F-1,6-BP → DHAP + G3P；可逆；六碳裂为两三碳',
                    understand: '从这步起产出×2；下游消耗拉动平衡',
                    advanced: '醛缩酶 B 缺陷 → 果糖不耐受（与果糖代谢通路共享酶）'
                  }
                },
                {
                  stepNo: 5,
                  rxId: 'rx137',
                  enzyme: '磷酸丙糖异构酶',
                  equation: 'DHAP ⇌ G3P',
                  reversible: true,
                  isRegulatory: false,
                  isRateLimiting: false,
                  notesRef: 'glycolysis|磷酸二羟丙酮@cytosol>甘油醛-3-磷酸@cytosol',
                  fourQuestions: {
                    what: '磷酸丙糖异构酶把 DHAP 转成它的异构体 G3P。DHAP ⇌ G3P',
                    why: '因为下一站（反应 6 的脱氢酶）只认 G3P。DHAP 不转过去就会卡在半路，两个三碳必须"统一队形"才能一起往下走。',
                    how: '无 ATP。碳数不变（2×3C）。',
                    so: '可逆（可逆=是）。进阶：这是催化效率接近极限的"近乎完美酶"，一次催化约 10⁸ 次/秒级。'
                  },
                  tiers: {
                    must: 'DHAP → G3P；可逆',
                    understand: '下游只认 G3P，必须统一队形',
                    advanced: '"近乎完美酶"（催化近扩散极限）'
                  }
                }
              ]
            }
          },
          mapFocus: { dimOthers: true, highlightMode: 'segment' },
          reactions: [4, 5],
          reactionIds: ['rx135', 'rx136', 'rx137'],
          transitionToNext: '从此账本上所有数字都要×2——每个三碳分子走完后半程，就是双份收获。第一个收获点来了：氧化。'
        },
        {
          id: 'glycolysis-s3',
          title: '段 3：氧化产生 NADH｜反应 6',
          goal: '甘油醛-3-磷酸被氧化，能量分两路装走——NAD⁺ 还原成 NADH，同时生成一个高能磷酸键（1,3-BPG）。',
          steps: ['甘油醛-3-磷酸', '1,3-二磷酸甘油酸'],
          stepContent: {
            '甘油醛-3-磷酸': {
              notesRef: 'glycolysis|甘油醛-3-磷酸@cytosol>1,3-二磷酸甘油酸@cytosol',
              fourQuestions: {
                what: 'G3P 被氧化（脱氢），同时把一个无机磷酸 Pi 接上去，生成 1,3-二磷酸甘油酸；被脱下的电子和氢交给 NAD⁺，NAD⁺ 变成 NADH。G3P + Pi + NAD⁺ ⇌ 1,3-BPG + NADH + H⁺',
                why: '这是糖酵解第一次真正"赚到"能量——而且一箭双雕：氧化释放的能量一部分装进 NADH（电子存折），一部分装进 1,3-BPG 的高能磷酸键（支票），下一步兑现成 ATP。这也是全通路唯一需要 NAD⁺ 的地方，所以 NAD⁺ 的供应直接决定糖酵解能不能转下去（引出 Q8 与乳酸发酵/穿梭连接）。',
                how: '消耗 G3P + Pi + NAD⁺；产生 1,3-BPG + NADH + H⁺。无 ATP。碳数不变（3C）。',
                so: '数据标可逆=是。热力学上可逆，但体内被下游 1,3-BPG 的快速消耗强拉着向前（理解层）。进阶：砷酸盐中毒、碘乙酰胺抑制都发生在这步（巯基抑制剂）。'
              },
              layers: {
                plain: '氧化甘油醛-3-磷酸，同时生成 NADH，并形成高能磷酸化合物。',
                detail: '必学：G3P + Pi + NAD⁺ → 1,3-BPG + NADH + H⁺；唯一 NAD⁺ 依赖步。理解：能量双通道（NADH + 高能磷酸键）；可逆但被下游拉动。',
                hook: '氧化并充电：NADH 在这里出现。'
              },
              reactions: [
                {
                  stepNo: 6,
                  rxId: 'rx138',
                  enzyme: '甘油醛-3-磷酸脱氢酶',
                  equation: 'G3P + Pi + NAD⁺ ⇌ 1,3-BPG + NADH + H⁺',
                  reversible: true,
                  isRegulatory: false,
                  isRateLimiting: false,
                  notesRef: 'glycolysis|甘油醛-3-磷酸@cytosol>1,3-二磷酸甘油酸@cytosol',
                  fourQuestions: {
                    what: 'G3P 被氧化（脱氢），同时把一个无机磷酸 Pi 接上去，生成 1,3-二磷酸甘油酸；被脱下的电子和氢交给 NAD⁺，NAD⁺ 变成 NADH。G3P + Pi + NAD⁺ ⇌ 1,3-BPG + NADH + H⁺',
                    why: '这是糖酵解第一次真正"赚到"能量——而且一箭双雕：氧化释放的能量一部分装进 NADH（电子存折），一部分装进 1,3-BPG 的高能磷酸键（支票），下一步兑现成 ATP。这也是全通路唯一需要 NAD⁺ 的地方，所以 NAD⁺ 的供应直接决定糖酵解能不能转下去（引出 Q8 与乳酸发酵/穿梭连接）。',
                    how: '消耗 G3P + Pi + NAD⁺；产生 1,3-BPG + NADH + H⁺。无 ATP。碳数不变（3C）。',
                    so: '数据标可逆=是。热力学上可逆，但体内被下游 1,3-BPG 的快速消耗强拉着向前（理解层）。进阶：砷酸盐中毒、碘乙酰胺抑制都发生在这步（巯基抑制剂）。'
                  },
                  tiers: {
                    must: 'G3P + Pi + NAD⁺ → 1,3-BPG + NADH + H⁺；唯一 NAD⁺ 依赖步',
                    understand: '能量双通道（NADH + 高能磷酸键）；可逆但被下游拉动',
                    advanced: '砷酸盐中毒、碘乙酰胺抑制机制；巯基修饰'
                  }
                }
              ]
            }
          },
          mapFocus: { dimOthers: true, highlightMode: 'segment' },
          reactions: [6],
          reactionIds: ['rx138'],
          transitionToNext: 'NADH 是"存起来的电子"，高能磷酸键则是"存起来的支票"——现在轮到把它兑现成 ATP 了。'
        },
        {
          id: 'glycolysis-s4',
          title: '段 4：底物水平磷酸化（第一次产 ATP，及两次准备步）｜反应 7–9',
          goal: '第一个高能磷酸键兑现为 ATP；随后磷酸基被搬到 C2 并脱水，重新攒出第二个高能磷酸键（PEP）。',
          steps: ['1,3-二磷酸甘油酸', '3-磷酸甘油酸', '2-磷酸甘油酸', '磷酸烯醇式丙酮酸'],
          stepContent: {
            '磷酸烯醇式丙酮酸': {
              notesRef: 'glycolysis|2-磷酸甘油酸@cytosol>磷酸烯醇式丙酮酸@cytosol',
              fourQuestions: {
                what: '反应 7 · 磷酸甘油酸激酶（可逆 · 底物水平磷酸化 #1）：1,3-BPG 把那个高能磷酸键交给 ADP，生成 ATP；自己变成 3-磷酸甘油酸。1,3-BPG + ADP ⇌ 3-PG + ATP\n反应 8 · 磷酸甘油酸变位酶（可逆）：3-PG 分子上的磷酸基从第 3 号碳挪到第 2 号碳，生成 2-磷酸甘油酸。3-PG ⇌ 2-PG\n反应 9 · 烯醇化酶（可逆）：2-PG 脱去一分子水，生成磷酸烯醇式丙酮酸（PEP）。2-PG ⇌ PEP + H₂O',
                why: '反应 7 · 磷酸甘油酸激酶：兑现反应 6 存的"支票"——这是糖酵解第一次产出 ATP，方式叫底物水平磷酸化（高能磷酸化合物直接把磷酸转给 ADP，不靠 ATP 合酶、不靠氧气）。\n反应 8 · 磷酸甘油酸变位酶：为下一步脱水做准备——烯醇化酶要从 C2/C3 脱水，磷酸必须在 C2 上，最后才能生成磷酸烯醇式丙酮酸（PEP）。\n反应 9 · 烯醇化酶：脱水把能量"浓缩"进磷酸键——PEP 的磷酸基转移势能是整条通路最高的，这是为第二次底物水平磷酸化蓄力。',
                how: '反应 7 · 磷酸甘油酸激酶：产生 1 ATP（每个三碳 1 个；两个三碳共 2 ATP）。碳数不变（3C）。\n反应 8 · 磷酸甘油酸变位酶：无 ATP。碳数不变（3C）。\n反应 9 · 烯醇化酶：产生 H₂O（每个三碳 1 分子；全程 2 分子）。无 ATP。碳数不变（3C）。',
                so: '反应 7 · 磷酸甘油酸激酶：可逆（可逆=是），体内净方向由底物/产物浓度决定。数据备注明确标注"底物水平磷酸化"。\n反应 8 · 磷酸甘油酸变位酶：可逆（可逆=是），无别构调控。\n反应 9 · 烯醇化酶：可逆（可逆=是）。进阶：氟离子抑制烯醇化酶（采血抗凝管加氟化钠的原因）。'
              },
              layers: {
                plain: '把高能磷酸直接交给 ADP，生成 ATP。把磷酸基从 3 号碳移到 2 号碳。脱去一分子水，形成高能的磷酸烯醇式丙酮酸。',
                detail: '必学（反应 7）：1,3-BPG + ADP → 3-PG + ATP；底物水平磷酸化 #1。理解（反应 7）："底物水平磷酸化"概念：不靠氧、不靠 ATP 合酶。必学（反应 8）：3-PG ⇌ 2-PG；可逆。理解（反应 8）：磷酸挪到 C2 为脱水做准备。必学（反应 9）：2-PG → PEP + H₂O；可逆。理解（反应 9）：脱水浓缩能量，PEP 是最高能磷酸载体。',
                hook: '第一次取现：高能磷酸直接变 ATP。先搬位置，再为能量升压。脱水增压，磷酸烯醇式丙酮酸像拉满的弹弓。'
              },
              reactions: [
                {
                  stepNo: 7,
                  rxId: 'rx139',
                  enzyme: '磷酸甘油酸激酶',
                  equation: '1,3-BPG + ADP ⇌ 3-PG + ATP',
                  reversible: true,
                  isRegulatory: false,
                  isRateLimiting: false,
                  notesRef: 'glycolysis|1,3-二磷酸甘油酸@cytosol>3-磷酸甘油酸@cytosol',
                  fourQuestions: {
                    what: '1,3-BPG 把那个高能磷酸键交给 ADP，生成 ATP；自己变成 3-磷酸甘油酸。1,3-BPG + ADP ⇌ 3-PG + ATP',
                    why: '兑现反应 6 存的"支票"——这是糖酵解第一次产出 ATP，方式叫底物水平磷酸化（高能磷酸化合物直接把磷酸转给 ADP，不靠 ATP 合酶、不靠氧气）。',
                    how: '产生 1 ATP（每个三碳 1 个；两个三碳共 2 ATP）。碳数不变（3C）。',
                    so: '可逆（可逆=是），体内净方向由底物/产物浓度决定。数据备注明确标注"底物水平磷酸化"。'
                  },
                  tiers: {
                    must: '1,3-BPG + ADP → 3-PG + ATP；底物水平磷酸化 #1',
                    understand: '"底物水平磷酸化"概念：不靠氧、不靠 ATP 合酶',
                    advanced: '1,3-BPG 高能磷酸键的结构来源（酰基磷酸）'
                  }
                },
                {
                  stepNo: 8,
                  rxId: 'rx140',
                  enzyme: '磷酸甘油酸变位酶',
                  equation: '3-PG ⇌ 2-PG',
                  reversible: true,
                  isRegulatory: false,
                  isRateLimiting: false,
                  notesRef: 'glycolysis|3-磷酸甘油酸@cytosol>2-磷酸甘油酸@cytosol',
                  fourQuestions: {
                    what: '3-PG 分子上的磷酸基从第 3 号碳挪到第 2 号碳，生成 2-磷酸甘油酸。3-PG ⇌ 2-PG',
                    why: '为下一步脱水做准备——烯醇化酶要从 C2/C3 脱水，磷酸必须在 C2 上，最后才能生成磷酸烯醇式丙酮酸（PEP）。',
                    how: '无 ATP。碳数不变（3C）。',
                    so: '可逆（可逆=是），无别构调控。'
                  },
                  tiers: {
                    must: '3-PG ⇌ 2-PG；可逆',
                    understand: '磷酸挪到 C2 为脱水做准备',
                    advanced: '2,3-BPG 变构体与血红蛋白氧亲和力（进阶彩蛋）'
                  }
                },
                {
                  stepNo: 9,
                  rxId: 'rx141',
                  enzyme: '烯醇化酶',
                  equation: '2-PG ⇌ PEP + H₂O',
                  reversible: true,
                  isRegulatory: false,
                  isRateLimiting: false,
                  notesRef: 'glycolysis|2-磷酸甘油酸@cytosol>磷酸烯醇式丙酮酸@cytosol',
                  fourQuestions: {
                    what: '2-PG 脱去一分子水，生成磷酸烯醇式丙酮酸（PEP）。2-PG ⇌ PEP + H₂O',
                    why: '脱水把能量"浓缩"进磷酸键——PEP 的磷酸基转移势能是整条通路最高的，这是为第二次底物水平磷酸化蓄力。',
                    how: '产生 H₂O（每个三碳 1 分子；全程 2 分子）。无 ATP。碳数不变（3C）。',
                    so: '可逆（可逆=是）。进阶：氟离子抑制烯醇化酶（采血抗凝管加氟化钠的原因）。'
                  },
                  tiers: {
                    must: '2-PG → PEP + H₂O；可逆',
                    understand: '脱水浓缩能量，PEP 是最高能磷酸载体',
                    advanced: '氟离子抑制（采血抗凝原理）'
                  }
                }
              ]
            }
          },
          mapFocus: { dimOthers: true, highlightMode: 'segment' },
          reactions: [7, 8, 9],
          reactionIds: ['rx139', 'rx140', 'rx141'],
          transitionToNext: 'PEP 是整条通路里"最想甩掉磷酸"的分子——最后一步就让它把这笔能量交出去。'
        },
        {
          id: 'glycolysis-s5',
          title: '段 5：生成丙酮酸（第二次底物水平磷酸化，收尾）｜反应 10',
          goal: 'PEP 把最后一个高能磷酸交给 ADP 生成 ATP，同时释放丙酮酸——糖酵解到达出口。',
          steps: ['磷酸烯醇式丙酮酸', '丙酮酸'],
          stepContent: {
            '磷酸烯醇式丙酮酸': {
              notesRef: 'glycolysis|磷酸烯醇式丙酮酸@cytosol>丙酮酸@cytosol',
              fourQuestions: {
                what: 'PEP 把最后一个高能磷酸交给 ADP 生成 ATP，自己变成丙酮酸。PEP + ADP → 丙酮酸 + ATP',
                why: '这是第二次底物水平磷酸化，也是通路的出口——丙酮酸是糖酵解的"成品"，接下来可以进线粒体（有氧）、变乳酸（缺氧）或走糖异生。这等于让葡萄糖的旅程正式收官，因此也是重要调控点：细胞在此检查"下游是否需要"——产物丙酮酸和 ATP 多了就放慢，上游中间体 F-1,6-BP 多了（说明前半程很顺）就加速。',
                how: '产生 1 ATP（每个三碳 1 个；两个三碳共 2 ATP）+ 2 丙酮酸。碳数不变（3C）。',
                so: '不可逆（可逆=否），数据标注限速步。别构调控：F-1,6-BP 前馈激活，ATP、丙氨酸反馈抑制（理解层）；进阶：肝 L 型同工酶受胰高血糖素→cAMP→磷酸化共价修饰抑制。'
              },
              layers: {
                plain: '把高能磷酸交给 ADP，生成 ATP 和丙酮酸。',
                detail: '必学：PEP + ADP → 丙酮酸 + ATP；不可逆；限速步。理解：F-1,6-BP 前馈激活、ATP/丙氨酸反馈抑制。',
                hook: '弹弓释放：ATP 到账，丙酮酸形成。'
              },
              reactions: [
                {
                  stepNo: 10,
                  rxId: 'rx142',
                  enzyme: '丙酮酸激酶',
                  equation: 'PEP + ADP → 丙酮酸 + ATP',
                  reversible: false,
                  isRegulatory: true,
                  isRateLimiting: true,
                  notesRef: 'glycolysis|磷酸烯醇式丙酮酸@cytosol>丙酮酸@cytosol',
                  fourQuestions: {
                    what: 'PEP 把最后一个高能磷酸交给 ADP 生成 ATP，自己变成丙酮酸。PEP + ADP → 丙酮酸 + ATP',
                    why: '这是第二次底物水平磷酸化，也是通路的出口——丙酮酸是糖酵解的"成品"，接下来可以进线粒体（有氧）、变乳酸（缺氧）或走糖异生。这等于让葡萄糖的旅程正式收官，因此也是重要调控点：细胞在此检查"下游是否需要"——产物丙酮酸和 ATP 多了就放慢，上游中间体 F-1,6-BP 多了（说明前半程很顺）就加速。',
                    how: '产生 1 ATP（每个三碳 1 个；两个三碳共 2 ATP）+ 2 丙酮酸。碳数不变（3C）。',
                    so: '不可逆（可逆=否），数据标注限速步。别构调控：F-1,6-BP 前馈激活，ATP、丙氨酸反馈抑制（理解层）；进阶：肝 L 型同工酶受胰高血糖素→cAMP→磷酸化共价修饰抑制。'
                  },
                  tiers: {
                    must: 'PEP + ADP → 丙酮酸 + ATP；不可逆；限速步',
                    understand: 'F-1,6-BP 前馈激活、ATP/丙氨酸反馈抑制',
                    advanced: 'L/M 同工酶；胰高血糖素→cAMP→磷酸化共价抑制；丙酮酸激酶缺乏症'
                  }
                }
              ]
            },
            '丙酮酸': {
              notesRef: 'glycolysis|磷酸烯醇式丙酮酸@cytosol>丙酮酸@cytosol',
              fourQuestions: {
                what: '出口是 2 分子丙酮酸（3C）。',
                why: '一个 6 碳葡萄糖经醛缩酶裂解为两个 3 碳分子，全程不释放 CO₂，6 个碳最终全部进入 2 分子丙酮酸。',
                how: '净产物：2 ATP（投入 2、产出 4）、2 NADH、2 丙酮酸、2 H₂O（反应 9 产生）、2 H⁺（反应 6 产生）。',
                so: '丙酮酸的下一站（乳酸/乙酰-CoA/糖异生）是另一门课——但 NAD⁺ 的问题必须先解决。'
              },
              layers: {
                plain: '弹弓释放：ATP 到账，丙酮酸形成。',
                detail: '出口：2 分子丙酮酸（3C）。净产物：2 ATP（投入 2、产出 4）、2 NADH、2 丙酮酸、2 H₂O（反应 9 产生）、2 H⁺（反应 6 产生）。',
                hook: '两个三碳各交出 1 个 ATP，通路到此结束。'
              }
            }
          },
          mapFocus: { dimOthers: true, highlightMode: 'segment' },
          reactions: [10],
          reactionIds: ['rx142'],
          transitionToNext: '两个三碳各交出 1 个 ATP，通路到此结束。丙酮酸的下一站（乳酸/乙酰-CoA/糖异生）是另一门课——但 NAD⁺ 的问题必须先解决。'
        }
      ],
      quiz: [
        {
          id: 'glycolysis-q1',
          kind: 'single',
          stem: '葡萄糖进入细胞后，己糖激酶把它变成了什么？',
          options: ['果糖-6-磷酸', '葡萄糖-6-磷酸', '果糖-1,6-二磷酸', '葡萄糖-1-磷酸'],
          correct: 1,
          accept: [],
          explanation: '反应 1 是葡萄糖 + ATP → G6P + ADP；F6P 是反应 2 的产物，F-1,6-BP 是反应 3 的产物。',
          retarget: 'glycolysis-s1',
          retargetHint: '段 1 地图 · 葡萄糖→葡萄糖-6-磷酸 边（反应 1 详情卡）',
          weight: 1
        },
        {
          id: 'glycolysis-q2',
          kind: 'single',
          stem: '反应 1（己糖激酶）和反应 3（磷酸果糖激酶-1）合计消耗几个 ATP？',
          options: ['0', '1', '2', '4'],
          correct: 2,
          accept: [],
          explanation: '两次磷酸化各耗 1 ATP，这就是耗能阶段"投资"的 2 ATP；产出要等段 4、段 5 才来。',
          retarget: 'glycolysis-s1',
          retargetHint: '段 1 地图（能量账本弹层：投入 2 ATP）',
          weight: 1
        },
        {
          id: 'glycolysis-q3',
          kind: 'multiple',
          stem: '醛缩酶把果糖-1,6-二磷酸劈开后，得到哪两个分子？',
          options: ['两个甘油醛-3-磷酸', '磷酸二羟丙酮 + 甘油醛-3-磷酸', '两个磷酸二羟丙酮', '1,3-二磷酸甘油酸 + 甘油醛-3-磷酸'],
          correct: [1],
          accept: [],
          explanation: '醛缩酶一步产生 DHAP + G3P 两个三碳；反应 5 再把 DHAP 全转成 G3P。说明：两者经磷酸丙糖异构酶互变后统一为 G3P，A 是"最终统一后"的说法，不算错到离谱，但本题考醛缩酶直接产物。',
          retarget: 'glycolysis-s2',
          retargetHint: '段 2 地图 · 果糖-1,6-二磷酸 节点（反应 4 详情卡）',
          weight: 1
        },
        {
          id: 'glycolysis-q4',
          kind: 'single',
          stem: '磷酸二羟丙酮（DHAP）必须被磷酸丙糖异构酶转成甘油醛-3-磷酸（G3P），因为……',
          options: ['DHAP 有毒', '下一步的脱氢酶只认 G3P', 'DHAP 会消耗 ATP', 'DHAP 不能穿过细胞膜'],
          correct: 1,
          accept: [],
          explanation: '反应 6 的甘油醛-3-磷酸脱氢酶只以 G3P 为底物；不转化，半个分子就卡死在通路里。',
          retarget: 'glycolysis-s2',
          retargetHint: '段 2 地图 · 磷酸二羟丙酮→甘油醛-3-磷酸 边（反应 5 详情卡）',
          weight: 1
        },
        {
          id: 'glycolysis-q5',
          kind: 'multiple',
          stem: '甘油醛-3-磷酸脱氢酶这一步（反应 6），消耗了什么、产生了什么？',
          options: ['消耗 NAD⁺', '产生 NADH', '消耗 ATP', '产生 1,3-二磷酸甘油酸'],
          correct: [0, 1, 3],
          accept: [],
          explanation: 'G3P + Pi + NAD⁺ → 1,3-BPG + NADH + H⁺；这一步不碰 ATP，能量装进 NADH 和高能磷酸键。',
          retarget: 'glycolysis-s3',
          retargetHint: '段 3 地图 · 甘油醛-3-磷酸→1,3-二磷酸甘油酸 边（反应 6 详情卡）',
          weight: 1
        },
        {
          id: 'glycolysis-q6',
          kind: 'single',
          stem: '1,3-二磷酸甘油酸 → 3-磷酸甘油酸（磷酸甘油酸激酶）这一步，是生成还是消耗 ATP？',
          options: ['生成 1 ATP', '消耗 1 ATP', '不涉及 ATP', '生成 2 ATP'],
          correct: 0,
          accept: [],
          explanation: '这是第一次底物水平磷酸化，高能磷酸直接转给 ADP 产 ATP；注意每个葡萄糖有两个三碳，全程这里共产出 2 ATP。',
          retarget: 'glycolysis-s4',
          retargetHint: '段 4 地图 · 1,3-二磷酸甘油酸→3-磷酸甘油酸 边（反应 7 详情卡）',
          weight: 1
        },
        {
          id: 'glycolysis-q7',
          kind: 'order',
          stem: '把糖酵解三个不可逆步骤按发生顺序拖成正确排列。',
          options: ['己糖激酶步', '磷酸果糖激酶-1 步', '丙酮酸激酶步'],
          correct: [0, 1, 2],
          accept: [],
          explanation: '第 1、3、10 步是三个"只进不退"的单行道；中间第 2、4–9 步都可逆。',
          retarget: 'glycolysis-s1',
          retargetHint: '答错卡片对应的具体反应详情卡（段 1 反应 1 / 段 1 反应 3 / 段 5 反应 10）',
          weight: 1
        },
        {
          id: 'glycolysis-q8',
          kind: 'single',
          stem: '如果细胞缺氧，反应 6 消耗的 NAD⁺ 靠什么补充回来？',
          options: ['丙酮酸被还原成乳酸，同时 NADH → NAD⁺', 'NADH 直接分解成 NAD⁺', '消耗更多 ATP 合成 NAD⁺', '糖酵解停止时 NAD⁺ 自动再生'],
          correct: 0,
          accept: [],
          explanation: '缺氧时线粒体用不了 NADH，细胞质乳酸脱氢酶让丙酮酸"代收"电子变乳酸，NAD⁺ 被还回来，糖酵解才能继续——这就是剧烈运动时乳酸堆积的原因（有氧时则经穿梭把还原当量送进线粒体）。',
          retarget: 'glycolysis-s3',
          retargetHint: '段 3 地图 · 反应 6 详情卡；并链接"丙酮酸去路"通路地图（乳酸节点）',
          weight: 1
        }
      ],
      challenge: {
        id: 'glycolysis-challenge',
        mode: 'blank',
        hiddenItems: ['葡萄糖-6-磷酸', '果糖-6-磷酸', '果糖-1,6-二磷酸', '甘油醛-3-磷酸', '磷酸烯醇式丙酮酸', '丙酮酸'],
        hideModes: [
          { level: 1, name: '隐藏酶名', description: '给出代谢物链（葡萄糖 → ？ → 果糖-6-磷酸 → …），填空处填酶名（10 个酶）。' },
          { level: 2, name: '隐藏代谢物名', description: '给出酶与方向（己糖激酶 → ？），填中间代谢物（主线 7 节点 + DHAP、1,3-BPG、3-PG、2-PG 共 11 个代谢物位点）。' },
          { level: 3, name: '全隐藏 + 能量标记', description: '空线路图，同时要标出每步"耗 ATP / 产 ATP / 产 NADH / 可逆 / 不可逆"。' }
        ],
        fillLine: '葡萄糖 → [①] → [②] → [③] → [④a + ④b] → [⑤] → [⑥] → [⑦] → [⑧] → [⑨] → [⑩]',
        blanks: [
          { id: 'glycolysis-blank-1', pos: 1, stepKey: '葡萄糖-6-磷酸', prompt: '① 葡萄糖 → ？（酶：己糖激酶）', accept: ['葡萄糖-6-磷酸', 'G6P'], hints: ['第一个磷酸化产物', 'G6P'], energyTag: '耗 1 ATP' },
          { id: 'glycolysis-blank-2', pos: 2, stepKey: '果糖-6-磷酸', prompt: '② 葡萄糖-6-磷酸 → ？（酶：磷酸葡萄糖异构酶）', accept: ['果糖-6-磷酸', 'F6P'], hints: ['醛糖变酮糖', 'F6P'] },
          { id: 'glycolysis-blank-3', pos: 3, stepKey: '果糖-1,6-二磷酸', prompt: '③ 果糖-6-磷酸 → ？（酶：磷酸果糖激酶-1）', accept: ['果糖-1,6-二磷酸', 'F-1,6-BP'], hints: ['第二个磷酸加在 C1', 'F-1,6-BP'], energyTag: '耗 1 ATP' },
          { id: 'glycolysis-blank-4a', pos: '4a', stepKey: '磷酸二羟丙酮', prompt: '④a 果糖-1,6-二磷酸 → ？ + 甘油醛-3-磷酸（酶：醛缩酶）', accept: ['磷酸二羟丙酮', 'DHAP'], hints: ['六碳劈两半', 'DHAP'] },
          { id: 'glycolysis-blank-4b', pos: '4b', stepKey: '甘油醛-3-磷酸', prompt: '④b 果糖-1,6-二磷酸 → 磷酸二羟丙酮 + ？（酶：醛缩酶）', accept: ['甘油醛-3-磷酸', 'G3P'], hints: ['六碳劈两半', 'G3P'] },
          { id: 'glycolysis-blank-5', pos: 5, stepKey: '甘油醛-3-磷酸', prompt: '⑤ 磷酸二羟丙酮 → ？（酶：磷酸丙糖异构酶）', accept: ['甘油醛-3-磷酸', 'G3P'], hints: ['统一队形', 'G3P'] },
          { id: 'glycolysis-blank-6', pos: 6, stepKey: '1,3-二磷酸甘油酸', prompt: '⑥ 甘油醛-3-磷酸 → ？（酶：甘油醛-3-磷酸脱氢酶）', accept: ['1,3-二磷酸甘油酸', '1,3-BPG'], hints: ['氧化 + 磷酸化', '1,3-BPG'], energyTag: '产 1 NADH' },
          { id: 'glycolysis-blank-7', pos: 7, stepKey: '3-磷酸甘油酸', prompt: '⑦ 1,3-二磷酸甘油酸 → ？（酶：磷酸甘油酸激酶）', accept: ['3-磷酸甘油酸', '3-PG'], hints: ['第一次产 ATP 之后', '3-PG'], energyTag: '产 1 ATP' },
          { id: 'glycolysis-blank-8', pos: 8, stepKey: '2-磷酸甘油酸', prompt: '⑧ 3-磷酸甘油酸 → ？（酶：磷酸甘油酸变位酶）', accept: ['2-磷酸甘油酸', '2-PG'], hints: ['磷酸挪到 C2', '2-PG'] },
          { id: 'glycolysis-blank-9', pos: 9, stepKey: '磷酸烯醇式丙酮酸', prompt: '⑨ 2-磷酸甘油酸 → ？（酶：烯醇化酶）', accept: ['磷酸烯醇式丙酮酸', 'PEP'], hints: ['脱水产物', 'PEP'] },
          { id: 'glycolysis-blank-10', pos: 10, stepKey: '丙酮酸', prompt: '⑩ 磷酸烯醇式丙酮酸 → ？（酶：丙酮酸激酶）', accept: ['丙酮酸', 'pyruvate'], hints: ['出口', 'pyruvate'], energyTag: '产 1 ATP（×2 提示：别忘了两个三碳）' }
        ],
        recallChecklist: [
          '入口与出口：葡萄糖 → 2 丙酮酸',
          '区室：细胞质',
          '净产物：2 ATP + 2 NADH（投入 2、产出 4）',
          '三个不可逆步骤：己糖激酶、磷酸果糖激酶-1、丙酮酸激酶（1、3、10）',
          'NAD⁺ 的作用：反应 6 被还原成 NADH；缺氧时经乳酸发酵（丙酮酸→乳酸）再生'
        ],
        passCriteria: {
          blanksMin: 1,
          energyTagsMin: 1,
          recallAll: true,
          transferQuestion: '如果反应 3 被抑制，通路会在哪里堵住？',
          transferAccept: ['F6P 之后、F-1,6-BP 之前，上游 G6P 堆积并反馈抑制己糖激酶'],
          criteria: [
            '标准 A（复述）：不看图能按上述 5 点完整复述，允许 1 次自我纠正。',
            '标准 B（补全）：难度 2 补全线路 11 个填空点全对，且能量标记 5 处全对（①、③ 耗 ATP；⑥ 产 NADH；⑦、⑩ 产 ATP）。',
            '标准 C（迁移）：能回答"如果反应 3 被抑制，通路会在哪里堵住？"（答：F6P 之后、F-1,6-BP 之前，上游 G6P 堆积并反馈抑制己糖激酶）。'
          ]
        },
        retry: true
      },
      review: {
        keyPoints: [
          '入口：1 分子葡萄糖（6C），来自血液，经 GLUT 转运体进细胞（主线以游离葡萄糖为起点）。',
          '出口：2 分子丙酮酸（3C）。',
          '区室：全程细胞质（cytosol）——不进线粒体、不需要氧气。',
          '净产物：2 ATP（投入 2、产出 4）、2 NADH、2 丙酮酸、2 H₂O（反应 9 产生）、2 H⁺（反应 6 产生）。',
          '反应数：10 个反应（数据层 11 条边，醛缩酶分叉）。',
          '碳守恒：6C 进、6C 出（2×3C），全程无 CO₂ 释放。',
          '碳数变化 · 入口：葡萄糖（6C）。',
          '碳数变化 · 活化后：葡萄糖-6-磷酸 → 果糖-6-磷酸 → 果糖-1,6-二磷酸（6C），磷酸化不改碳数。',
          '碳数变化 · 分裂：果糖-1,6-二磷酸 → 磷酸二羟丙酮 + 甘油醛-3-磷酸（6C = 3C + 3C），一个变两个。',
          '碳数变化 · 统一：2 × 甘油醛-3-磷酸（3C + 3C），DHAP 全转 G3P。',
          '碳数变化 · 后半程：2 ×（1,3-BPG → 3-PG → 2-PG → PEP）（3C + 3C），每行都是"×2 记账"。',
          '碳数变化 · 出口：2 × 丙酮酸（3C + 3C），6 个碳全在，一个没丢。',
          '能量账本 · 投入：反应 1 己糖激酶（-1 ATP）、反应 3 磷酸果糖激酶-1（-1 ATP），共 -2 ATP。',
          '能量账本 · 产出：反应 7 磷酸甘油酸激酶（+1 ATP × 2 三碳）、反应 10 丙酮酸激酶（+1 ATP × 2 三碳），共 +4 ATP。',
          '能量账本 · 净得：+2 ATP / 葡萄糖。',
          '能量账本 · 还原当量：反应 6 甘油醛-3-磷酸脱氢酶（+1 NADH × 2 三碳），共 +2 NADH。',
          '账本口诀：投资 2、回报 4、净赚 2；NADH 两笔存在反应 6。',
          '进阶注：若从糖原的葡萄糖残基起步可省反应 1 的 ATP，净得 3 ATP——不在本课主线。',
          '跨步必学：入口葡萄糖、出口丙酮酸、区室细胞质、净产物 2 ATP + 2 NADH、三个不可逆步（1/3/10）、NAD⁺ 在反应 6 的作用。',
          '理解层全局：碳数守恒无 CO₂、耗能/产能两阶段划分、与磷酸戊糖途径共享 G6P/F6P/G3P 节点、与糖异生共享可逆步（绕过三个不可逆步）。',
          '三个不可逆步骤：己糖激酶（反应 1）、磷酸果糖激酶-1（反应 3）、丙酮酸激酶（反应 10）。'
        ],
        recall: [
          '说出入口与出口：糖酵解的入口是 1 分子葡萄糖（6C），出口是 2 分子丙酮酸（3C），全程发生在细胞质。',
          '区分两阶段：耗能阶段（反应 1–5）投入 2 ATP，产能阶段（反应 6–10）产出 4 ATP；算清净得 2 ATP + 2 NADH（每分子葡萄糖）。',
          '找到三个不可逆步骤：己糖激酶（反应 1）、磷酸果糖激酶-1（反应 3）、丙酮酸激酶（反应 10），并说出每一步消耗或生成什么。',
          '解释为什么需要 NAD⁺：反应 6 把 NAD⁺ 还原成 NADH；NAD⁺ 是"有限库存"，缺氧时必须通过乳酸发酵（或穿梭送进线粒体）把它变回来，糖酵解才能继续。',
          '追踪碳的去向：一个 6 碳葡萄糖经醛缩酶裂解为两个 3 碳分子，全程不释放 CO₂，6 个碳最终全部进入 2 分子丙酮酸。'
        ],
        acceptanceNote: '验收方式建议：完成"完整通路回顾页"的自检 5 连问，或挑战模式的复述检查清单。',
        interactionHint: '回顾页交互建议：做成"拖动碳原子"演示——6 个碳点从葡萄糖出发，到醛缩酶处自动分成 3+3 两路，让学生直观看到"碳数守恒、无 CO₂"。'
      },
      wrongAnswerMap: {
        rules: '答错 2 题以上同一段 → 该段强制重走；答错题全部回跳对应详情卡，不看讲解直接重测；连续 2 次答错同一题 → 降级到前置知识对应条目（Q5 连续错 → 前置知识 5）。',
        items: [
          { quizIds: ['glycolysis-q1'], knowledge: '反应 1 的底物/产物没记住', action: '重看反应 1 详情卡 + 段 1 主线走一遍', jump: 'glycolysis-s1', jumpHint: '段 1 · 葡萄糖→葡萄糖-6-磷酸' },
          { quizIds: ['glycolysis-q2'], knowledge: '能量账本"投入端"不清', action: '重看能量账本投入行 + 反应 1、3 详情', jump: 'glycolysis-s1', jumpHint: '段 1 · 能量账本弹层' },
          { quizIds: ['glycolysis-q3'], knowledge: '分叉反应产物记忆不全', action: '重看反应 4 详情（DHAP + G3P 双产物）', jump: 'glycolysis-s2', jumpHint: '段 2 · 果糖-1,6-二磷酸 节点' },
          { quizIds: ['glycolysis-q4'], knowledge: '不理解"下游只认 G3P"', action: '重看反应 5 + 反应 6 底物', jump: 'glycolysis-s2', jumpHint: '段 2 · 磷酸二羟丙酮→甘油醛-3-磷酸' },
          { quizIds: ['glycolysis-q5'], knowledge: '反应 6 消耗/产出混淆（含 NAD⁺/NADH 方向）', action: '重看反应 6 详情 + 前置知识 5（氧化还原初步）', jump: 'glycolysis-s3', jumpHint: '段 3 · 甘油醛-3-磷酸→1,3-二磷酸甘油酸' },
          { quizIds: ['glycolysis-q6'], knowledge: '底物水平磷酸化概念未建立', action: '重看反应 7 详情 + "底物水平磷酸化"词条', jump: 'glycolysis-s4', jumpHint: '段 4 · 1,3-二磷酸甘油酸→3-磷酸甘油酸' },
          { quizIds: ['glycolysis-q7'], knowledge: '不可逆步位置与顺序混乱', action: '重看三个调控点详情（反应 1、3、10）+ 回顾页"单行道"高亮', jump: 'glycolysis-s1', jumpHint: '段 1 反应 1 / 段 1 反应 3 / 段 5 反应 10' },
          { quizIds: ['glycolysis-q8'], knowledge: '氧化还原闭环（NAD⁺ 有限库存）未理解', action: '重看反应 6 + 连接"丙酮酸去路"通路（乳酸节点）', jump: 'glycolysis-s3', jumpHint: '段 3 · 反应 6 → 丙酮酸去路地图' }
        ]
      }
    }
  }
};
