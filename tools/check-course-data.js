#!/usr/bin/env node
/**
 * tools/check-course-data.js — 课程数据校验器
 * ---------------------------------------------------------------------------
 * 职责：校验 course-data.js（window.COURSE_DATA）的结构与引用完整性，
 *       挂入 package.json "test:data" 链（建议追加在 check-student-notes.js 之后）。
 *
 * 检查项：
 *   1. COURSE_DATA 结构：version/topics/lessons 存在；topics 恰 5 个
 *   2. 每个 lesson.id = pathwayId 且存在于 scene-data.js pathways；
 *      topicId 存在于 topics；topics.lessons 与 coreStudyModules 5×21 映射一致
 *      （映射硬编码于下方 CORE_STUDY_MODULES，来源：index.html coreStudyModules，
 *      约 L8365-8374；设计文档 subagent_03_model.md §2.6 同表。
 *      另做 index.html 软比对：能从 index.html 解析出 coreStudyModules 时，
 *      与硬编码表不一致会告警——防双源漂移）
 *   3. segments[].steps 每个文本经 STUDENT_STEP_RESOLVER.resolveStep 解析
 *      （vm 加载 resolver + scene-data + data-compiled；说明性步骤
 *      entity/reaction 双 null 时要求 stepContent 标记 explanatory:true，
 *      否则 warning；resolver 抛错/返回非对象 → error）
 *   4. 显式 entityId/reactionId 存在于 data-compiled.js（可选字段，有才查；
 *      entityId 允许 id 精确匹配或 name/label/latin 匹配；
 *      reactionId 允许 id 精确匹配或 enzyme 匹配）
 *   5. quiz 结构：kind 枚举合法、correct 下标越界检查、retarget 指向本课存在的
 *      segment id、options 长度≥2（single/truefalse/multiple/order）、
 *      accept 非空（fill）
 *   6. challenge 结构：blanks[].stepKey 存在于本课 segments steps、
 *      recallChecklist 非空（存在时）、passCriteria 合法
 *   7. 输出 PASS/FAIL 摘要，FAIL 时 process.exitCode = 1
 *   8. vm 加载方式与 tools/check-student-steps.js 一致
 *      （node 环境加载 scene-data.js / data-compiled.js / student-step-resolver.js /
 *       course-data.js）
 *
 * 附加（第 9 项）：course-engine.js 冒烟——vm 加载引擎并断言 API 存在与
 * 安全默认值（COURSE_DATA 缺失/空时引擎不抛错）。两文件同批交付，故并入门禁。
 *
 * 运行：node tools/check-course-data.js
 * course-data.js 不存在时给出明确错误提示（校验器本身可用，等数据文件）。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const resolver = require('../student-step-resolver.js');

const ROOT = path.join(__dirname, '..');
// 默认校验项目根 course-data.js；可用环境变量 COURSE_DATA_FILE 指向其他副本（CI/预检用）
const COURSE_DATA_FILE = process.env.COURSE_DATA_FILE
  ? path.resolve(process.env.COURSE_DATA_FILE)
  : path.join(ROOT, 'tools', 'archive', 'course-system', 'course-data.js');
const COURSE_ENGINE_FILE = path.join(ROOT, 'tools', 'archive', 'course-system', 'course-engine.js');
const INDEX_HTML_FILE = path.join(ROOT, 'index.html');

// coreStudyModules 5×21 映射（权威源：index.html coreStudyModules，约 L8365-8374；
// 设计文档 subagent_03_model.md §2.6 同表）。21 通路 = 现有 21 条核心课程路线。
const CORE_STUDY_MODULES = {
  biooxidation: ['pdh', 'tca', 'malate_aspartate', 'glycerol_phosphate', 'etc', 'oxphos'],
  carbohydrate: ['glycolysis', 'gluconeogenesis', 'glycogenesis', 'glycogenolysis', 'ppp'],
  lipid: ['fa_synthesis', 'carnitine', 'beta_oxidation', 'ketone'],
  amino: ['transamination', 'urea', 'aa_carbon'],
  nucleotide: ['purine', 'pyrimidine', 'nucleotide_degradation']
};

const QUIZ_KINDS = new Set(['single', 'truefalse', 'fill', 'multiple', 'order', 'match']);
const CHALLENGE_MODES = new Set(['blank', 'hide', 'recall']);

// 与 tools/check-student-steps.js / tools/generate-stats.js 同款 routeGroups
const ROUTE_GROUPS = {
  glycolysis: 'glycolysis', pdh: 'pdh', tca: 'tca', etc: 'etc', oxphos: 'etc',
  malate_aspartate: 'transport', glycerol_phosphate: 'transport', atp_transport: 'transport'
};

const errors = [];
const warnings = [];

function error(message) {
  errors.push(message);
  console.log(`  ✗ ${message}`);
}

function warning(message) {
  warnings.push(message);
  console.log(`  ⚠ ${message}`);
}

function info(message) {
  console.log(`  · ${message}`);
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

// 软比对：从 index.html 提取 coreStudyModules，与硬编码表不一致时告警
function coreStudyModulesFromIndexHtml() {
  if (!fs.existsSync(INDEX_HTML_FILE)) return null;
  const html = fs.readFileSync(INDEX_HTML_FILE, 'utf8');
  const block = html.match(/coreStudyModules\s*=\s*\{([\s\S]*?)\n\s*\};/);
  if (!block) return null;
  const modules = {};
  const entryRe = /([a-z_]+)\s*:\s*\[([^\]]*)\]/g;
  let entry;
  while ((entry = entryRe.exec(block[1])) !== null) {
    const ids = entry[2].match(/'([^']+)'/g) || [];
    modules[entry[1]] = ids.map(item => item.slice(1, -1));
  }
  return Object.keys(modules).length ? modules : null;
}

function checkTopicMapping(course) {
  const topicIds = Object.keys(course.topics || {});
  if (topicIds.length !== 5) {
    error(`topics 数量为 ${topicIds.length}，必须恰为 5 个（biooxidation/carbohydrate/lipid/amino/nucleotide）`);
  }
  const expectedIds = Object.keys(CORE_STUDY_MODULES);
  expectedIds.forEach(topicId => {
    const topic = course.topics[topicId];
    if (!topic) {
      error(`topics 缺少专题 '${topicId}'`);
      return;
    }
    if (topic.id !== undefined && topic.id !== topicId) {
      warning(`topics['${topicId}'].id 为 '${topic.id}'，与键不一致`);
    }
    const expected = CORE_STUDY_MODULES[topicId];
    const actual = asArray(topic.lessons);
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      error(`topics['${topicId}'].lessons 与 coreStudyModules 不一致\n` +
        `    期望 [${expected.join(', ')}]\n` +
        `    实际 [${actual.join(', ')}]`);
    }
    if (typeof topic.label !== 'string' || !topic.label) {
      warning(`topics['${topicId}'] 缺少 label`);
    }
  });
  topicIds.forEach(topicId => {
    if (!expectedIds.includes(topicId)) {
      error(`topics 出现映射表之外的专题键 '${topicId}'`);
    }
  });
}

function checkStepResolves(resolverOptions, lesson, step, content) {
  const pathway = resolverOptions.pathways[lesson.pathwayId];
  if (typeof step !== 'string' || !step.trim()) {
    error(`${lesson.id} / segments steps 含空步骤文本`);
    return;
  }
  let target;
  try {
    target = resolver.resolveStep({
      ...resolverOptions,
      pathwayId: lesson.pathwayId,
      pathway,
      routeGroup: ROUTE_GROUPS[lesson.pathwayId] || null,
      step,
      index: pathway ? pathway.steps.indexOf(step) : -1,
      stepCount: pathway && pathway.steps.length ? pathway.steps.length : 1
    });
  } catch (err) {
    error(`${lesson.id} / '${step}' resolver 抛错：${err.message}`);
    return;
  }
  if (!target || typeof target !== 'object') {
    error(`${lesson.id} / '${step}' 完全无法解析（resolveStep 返回非对象）`);
    return;
  }
  if (!target.entity && !target.reaction) {
    // 说明性步骤：允许不定位实体/反应，但 stepContent 必须显式标记
    if (!content || content.explanatory !== true) {
      warning(`${lesson.id} / '${step}' 为说明性步骤（entity/reaction 双 null），` +
        'stepContent 未标记 explanatory:true（如确为纯说明，请补标记）');
    }
  }
}

function checkStepContentAnchors(compiled, entityById, lesson, key, content) {
  if (!content || typeof content !== 'object') return;
  if (content.entityId) {
    const found = entityById[content.entityId] ||
      compiled.entities.some(e => e.name === content.entityId || e.label === content.entityId || e.latin === content.entityId);
    if (!found) {
      error(`${lesson.id} / '${key}' stepContent.entityId '${content.entityId}' 不存在于 data-compiled.js entities`);
    }
  }
  if (content.reactionId) {
    const found = compiled.reactions.some(r => r.id === content.reactionId || r.enzyme === content.reactionId);
    if (!found) {
      error(`${lesson.id} / '${key}' stepContent.reactionId '${content.reactionId}' 不存在于 data-compiled.js reactions`);
    }
  }
  if (content.fourQuestions) {
    ['what', 'why', 'how', 'so'].forEach(field => {
      if (typeof content.fourQuestions[field] !== 'string') {
        warning(`${lesson.id} / '${key}' fourQuestions 缺少 '${field}' 字段`);
      }
    });
  }
  if (content.layers) {
    ['plain', 'detail', 'hook'].forEach(field => {
      if (typeof content.layers[field] !== 'string') {
        warning(`${lesson.id} / '${key}' layers 缺少 '${field}' 字段`);
      }
    });
  }
}

function checkQuiz(lesson, quiz) {
  const label = `${lesson.id} / quiz '${quiz && quiz.id ? quiz.id : '(无 id)'}'`;
  if (!quiz || typeof quiz !== 'object') {
    error(`${lesson.id} / quiz 数组含空项`);
    return;
  }
  if (typeof quiz.id !== 'string' || !quiz.id) {
    error(`${label}：缺少 id`);
  }
  if (typeof quiz.stem !== 'string' || !quiz.stem.trim()) {
    error(`${label}：stem 为空`);
  }
  const kind = quiz.kind;
  if (!QUIZ_KINDS.has(kind)) {
    error(`${label}：kind '${kind}' 非法（枚举：${Array.from(QUIZ_KINDS).join('|')}）`);
    return;
  }
  const options = asArray(quiz.options);
  if (kind === 'fill') {
    if (!asArray(quiz.accept).length) {
      error(`${label}：fill 题 accept 数组为空`);
    }
  } else if (kind === 'match') {
    // match 后续版本实现，结构暂不校验
  } else if (kind === 'single' || kind === 'truefalse' || kind === 'multiple' || kind === 'order') {
    if (options.length < 2) {
      error(`${label}：${kind} 题 options 长度 ${options.length} < 2`);
    }
    if (kind === 'single' || kind === 'truefalse') {
      if (typeof quiz.correct === 'boolean') {
        // truefalse 允许布尔 correct
      } else if (!Number.isInteger(quiz.correct) || quiz.correct < 0 || quiz.correct >= options.length) {
        error(`${label}：correct 下标越界或缺失（需 0..${options.length - 1} 的整数，实际 ${quiz.correct}）`);
      }
    } else if (kind === 'multiple') {
      if (!Array.isArray(quiz.correct) || !quiz.correct.length ||
        quiz.correct.some(c => !Number.isInteger(c) || c < 0 || c >= options.length)) {
        error(`${label}：multiple 题 correct 需为非空合法下标数组（0..${options.length - 1}）`);
      }
    } else if (kind === 'order') {
      if (quiz.correct !== undefined && !Array.isArray(quiz.correct)) {
        error(`${label}：order 题 correct 需为下标数组或省略（省略=按 options 顺序）`);
      }
      if (Array.isArray(quiz.correct)) {
        const valid = quiz.correct.length === options.length &&
          quiz.correct.every(c => Number.isInteger(c) && c >= 0 && c < options.length) &&
          new Set(quiz.correct).size === options.length;
        if (!valid) {
          error(`${label}：order 题 correct 必须是 0..${options.length - 1} 的全排列`);
        }
      }
    }
  }
  if (quiz.retarget !== undefined && quiz.retarget !== null) {
    if (typeof quiz.retarget !== 'string' ||
      !asArray(lesson.segments).some(seg => seg && seg.id === quiz.retarget)) {
      error(`${label}：retarget '${quiz.retarget}' 不是本课有效 segment id`);
    }
  }
  if (quiz.explanation === undefined || quiz.explanation === '') {
    warning(`${label}：缺少 explanation（答题反馈将为空）`);
  }
  if (quiz.weight !== undefined && (typeof quiz.weight !== 'number' || quiz.weight <= 0)) {
    warning(`${label}：weight 需为正数`);
  }
}

function checkChallenge(lesson, challenge) {
  const label = `${lesson.id} / challenge`;
  if (!challenge || typeof challenge !== 'object') {
    error(`${label}：结构非法`);
    return;
  }
  if (challenge.mode !== undefined && !CHALLENGE_MODES.has(challenge.mode)) {
    error(`${label}：mode '${challenge.mode}' 非法（枚举：blank|hide|recall）`);
  }
  const blanks = asArray(challenge.blanks);
  const checklist = asArray(challenge.recallChecklist);
  if (challenge.blanks !== undefined && !blanks.length) {
    error(`${label}：blanks 数组为空`);
  }
  if (challenge.recallChecklist !== undefined && !checklist.length) {
    error(`${label}：recallChecklist 数组为空`);
  }
  if (!blanks.length && !checklist.length) {
    error(`${label}：blanks 与 recallChecklist 至少一个非空`);
  }
  const allStepKeys = new Set();
  asArray(lesson.segments).forEach(seg => asArray(seg.steps).forEach(step => allStepKeys.add(step)));
  blanks.forEach((blank, index) => {
    const itemLabel = `${label} / blanks[${index}]`;
    if (!blank || typeof blank !== 'object') {
      error(`${itemLabel}：项缺失`);
      return;
    }
    if (!allStepKeys.has(blank.stepKey)) {
      error(`${itemLabel}：stepKey '${blank.stepKey}' 不存在于本课 segments steps`);
    }
    if (typeof blank.prompt !== 'string' || !blank.prompt.trim()) {
      error(`${itemLabel}：prompt 为空`);
    }
    if (!asArray(blank.accept).length) {
      error(`${itemLabel}：accept 数组为空`);
    }
  });
  checklist.forEach((item, index) => {
    if (typeof item !== 'string' || !item.trim()) {
      error(`${label} / recallChecklist[${index}]：项为空`);
    }
  });
  const criteria = challenge.passCriteria;
  if (!criteria || typeof criteria !== 'object') {
    error(`${label}：passCriteria 缺失`);
    return;
  }
  if (criteria.blanksMin !== undefined &&
    (typeof criteria.blanksMin !== 'number' || criteria.blanksMin <= 0 || criteria.blanksMin > 1)) {
    error(`${label}：blanksMin 需在 (0,1] 区间，实际 ${criteria.blanksMin}`);
  }
  if (criteria.recallAll !== undefined && typeof criteria.recallAll !== 'boolean') {
    error(`${label}：recallAll 需为 boolean，实际 ${criteria.recallAll}`);
  }
  const hasCriterion =
    (typeof criteria.blanksMin === 'number' && criteria.blanksMin > 0 && criteria.blanksMin <= 1) ||
    typeof criteria.recallAll === 'boolean';
  if (!hasCriterion) {
    error(`${label}：passCriteria 需含合法 blanksMin(0..1) 或 recallAll(boolean)`);
  }
}

function main() {
  console.log('=== 课程数据检查 (tools/check-course-data.js) ===');

  if (!fs.existsSync(COURSE_DATA_FILE)) {
    console.log('');
    console.log(`✗ 未找到 course-data.js：${COURSE_DATA_FILE}`);
    console.log('  校验器本身已就绪；请先由课程数据构建员生成 course-data.js（window.COURSE_DATA）。');
    console.log('  参考：.cluster/lesson-impl-20260815/plan.md 接口约定。');
    process.exitCode = 1;
    return;
  }

  const context = { window: {} };
  try {
    vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'scene-data.js'), 'utf8'), context);
    vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'data-compiled.js'), 'utf8'), context);
    vm.runInNewContext(fs.readFileSync(COURSE_DATA_FILE, 'utf8'), context);
  } catch (err) {
    error(`vm 加载 scene-data.js / data-compiled.js / course-data.js 失败：${err.message}`);
    console.log(`\nFAIL：${errors.length} 个错误`);
    process.exitCode = 1;
    return;
  }

  const atlas = context.window.METABOLIC_ATLAS_DATA;
  const compiled = context.window.METABOLIC_COMPILED;
  const course = context.window.COURSE_DATA;
  const entityById = Object.fromEntries((compiled.entities || []).map(entity => [entity.id, entity]));
  const resolverOptions = {
    pathways: atlas.pathways,
    entities: compiled.entities,
    reactions: compiled.reactions,
    entityById,
    routeGroups: ROUTE_GROUPS
  };

  /* ---- 1. 顶层结构 ---- */
  if (!course || typeof course !== 'object') {
    error('COURSE_DATA 缺失或非对象');
    console.log('\nFAIL：顶层结构非法');
    process.exitCode = 1;
    return;
  }
  if (typeof course.version !== 'string' || !course.version) {
    error('COURSE_DATA.version 缺失（需字符串版本号，如 2026-08-15-1）');
  }
  if (!course.topics || typeof course.topics !== 'object') {
    error('COURSE_DATA.topics 缺失');
  }
  if (!course.lessons || typeof course.lessons !== 'object') {
    error('COURSE_DATA.lessons 缺失');
  }

  /* ---- 2. topics 结构 + coreStudyModules 映射 ---- */
  let topicCount = 0;
  if (course.topics && typeof course.topics === 'object') {
    checkTopicMapping(course);
    topicCount = Object.keys(course.topics).length;
  }
  const indexModules = coreStudyModulesFromIndexHtml();
  if (indexModules) {
    const mismatches = [];
    Object.keys(CORE_STUDY_MODULES).forEach(topicId => {
      if (indexModules[topicId] &&
        JSON.stringify(indexModules[topicId]) !== JSON.stringify(CORE_STUDY_MODULES[topicId])) {
        mismatches.push(`${topicId}: index.html=[${indexModules[topicId].join(',')}] 硬编码=[${CORE_STUDY_MODULES[topicId].join(',')}]`);
      }
    });
    if (mismatches.length) {
      warning(`index.html coreStudyModules 与校验器硬编码表不一致（需同步）：${mismatches.join('；')}`);
    }
  }

  /* ---- 2+3+4+5+6. 逐课检查 ---- */
  let lessonCount = 0;
  let segmentCount = 0;
  let stepCount = 0;
  let quizCount = 0;
  let challengeCount = 0;
  const seenSegmentIds = new Set();
  const lessonKeys = Object.keys(course.lessons || {});
  const mappedLessonIds = Object.values(CORE_STUDY_MODULES).flat();

  if (!lessonKeys.length) {
    warning('lessons 为空（P0 空 schema 阶段允许；P1 起至少含 glycolysis）');
  }

  lessonKeys.forEach(key => {
    const lesson = course.lessons[key];
    if (!lesson || typeof lesson !== 'object') {
      error(`lessons['${key}'] 缺失或非对象`);
      return;
    }
    lessonCount++;
    if (lesson.id !== key || lesson.pathwayId !== key) {
      error(`lesson.id ('${lesson.id}') / pathwayId ('${lesson.pathwayId}') 必须等于键 '${key}'`);
    }
    if (!atlas.pathways[key]) {
      error(`lesson '${key}' 的 pathwayId 不存在于 scene-data.js pathways`);
      return;
    }
    if (!mappedLessonIds.includes(key)) {
      error(`lesson '${key}' 不在 coreStudyModules 5×21 映射内`);
    }
    const mappingTopic = Object.keys(CORE_STUDY_MODULES).find(tid => CORE_STUDY_MODULES[tid].includes(key));
    if (lesson.topicId !== mappingTopic) {
      error(`lesson '${key}' 的 topicId '${lesson.topicId}' 与 coreStudyModules 映射 '${mappingTopic}' 不一致`);
    }
    if (!course.topics || !course.topics[lesson.topicId]) {
      error(`lesson '${key}' 的 topicId '${lesson.topicId}' 不存在于 COURSE_DATA.topics`);
    }

    /* segments */
    const segments = asArray(lesson.segments);
    if (!segments.length) {
      error(`lesson '${key}' segments 为空`);
    }
    const segmentIdSet = new Set();
    segments.forEach((segment, segIndex) => {
      segmentCount++;
      const segLabel = `lesson '${key}' / segments[${segIndex}]`;
      if (!segment || typeof segment !== 'object') {
        error(`${segLabel}：项缺失`);
        return;
      }
      if (typeof segment.id !== 'string' || !segment.id) {
        error(`${segLabel}：缺少 id`);
      } else {
        if (segmentIdSet.has(segment.id)) {
          error(`${segLabel}：segment id '${segment.id}' 在本课内重复`);
        }
        segmentIdSet.add(segment.id);
        if (seenSegmentIds.has(segment.id)) {
          error(`segment id '${segment.id}' 全局重复（约定全局唯一：lessonId-sN）`);
        }
        seenSegmentIds.add(segment.id);
        if (!new RegExp(`^${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-s\\d+$`).test(segment.id)) {
          warning(`${segLabel}：id '${segment.id}' 不符合约定格式 '${key}-sN'`);
        }
      }
      if (typeof segment.title !== 'string' || !segment.title.trim()) {
        warning(`${segLabel}：缺少 title`);
      }
      const steps = asArray(segment.steps);
      if (!steps.length) {
        error(`${segLabel}：steps 为空`);
      }
      const stepContent = segment.stepContent && typeof segment.stepContent === 'object' ? segment.stepContent : {};
      Object.keys(stepContent).forEach(contentKey => {
        if (!steps.includes(contentKey)) {
          error(`${segLabel}：stepContent 键 '${contentKey}' 不在本段 steps 中`);
        }
      });
      steps.forEach(step => {
        stepCount++;
        checkStepResolves(resolverOptions, lesson, step, stepContent[step]);
      });
      Object.keys(stepContent).forEach(contentKey => {
        checkStepContentAnchors(compiled, entityById, lesson, contentKey, stepContent[contentKey]);
      });
    });

    /* quiz */
    const quiz = asArray(lesson.quiz);
    if (!quiz.length) {
      warning(`lesson '${key}' quiz 为空（首版样板课应有题目）`);
    }
    const quizIdSet = new Set();
    quiz.forEach((item, index) => {
      quizCount++;
      const qLabel = `${key} / quiz[${index}]`;
      if (item && item.id) {
        if (quizIdSet.has(item.id)) error(`${qLabel}：quiz id '${item.id}' 重复`);
        quizIdSet.add(item.id);
      }
      checkQuiz(lesson, item);
    });

    /* challenge */
    if (lesson.challenge !== undefined && lesson.challenge !== null) {
      challengeCount++;
      checkChallenge(lesson, lesson.challenge);
    } else {
      warning(`lesson '${key}' challenge 为 null（P1 样板课应含三档挑战）`);
    }

    /* review */
    if (lesson.review && typeof lesson.review === 'object') {
      ['keyPoints', 'recall'].forEach(field => {
        if (!asArray(lesson.review[field]).length) {
          warning(`lesson '${key}' review.${field} 为空`);
        }
      });
    } else {
      warning(`lesson '${key}' review 缺失`);
    }
  });

  /* 渐进式覆盖提示：映射内未写课的 pathway */
  const missingLessons = mappedLessonIds.filter(id => !course.lessons || !course.lessons[id]);
  if (missingLessons.length) {
    warning(`coreStudyModules 映射内 ${missingLessons.length} 课尚未写入 course-data.js（渐进式：${missingLessons.join('、')}）`);
  }

  /* ---- 7. 引擎冒烟（附加） ---- */
  if (fs.existsSync(COURSE_ENGINE_FILE)) {
    try {
      const engineContext = { window: {}, COURSE_DATA: course };
      vm.runInNewContext(fs.readFileSync(COURSE_ENGINE_FILE, 'utf8'), engineContext);
      // UMD root=globalThis（vm 沙箱全局）；浏览器场景才是 window.COURSE_ENGINE
      const engine = engineContext.COURSE_ENGINE || engineContext.window.COURSE_ENGINE;
      const requiredApi = ['getLesson', 'getTopic', 'setLesson', 'currentLesson', 'setSegment',
        'currentSegment', 'segmentSteps', 'visibleStepKeys', 'quizAnswer', 'fillAnswer',
        'orderAnswer', 'challengeBlanks', 'challengeSubmit', 'recallCheck',
        'loadProgress', 'saveProgress', 'bridgeFromV1', 'topicStats'];
      const missingApi = requiredApi.filter(name => typeof engine[name] !== 'function');
      if (missingApi.length) {
        error(`course-engine.js 冒烟：缺少 API ${missingApi.join('、')}`);
      } else {
        const smoke = engine.topicStats('carbohydrate') || { total: 0 };
        if (typeof smoke.total !== 'number') {
          error('course-engine.js 冒烟：topicStats 返回结构非法');
        } else {
          info(`course-engine.js 冒烟通过：API ${requiredApi.length}/${requiredApi.length}，topicStats 可用`);
        }
      }
    } catch (err) {
      error(`course-engine.js 冒烟：vm 加载/执行抛错：${err.message}`);
    }
  } else {
    warning('course-engine.js 未找到，跳过引擎冒烟');
  }

  /* ---- 汇总 ---- */
  console.log('');
  console.log(`课程 ${lessonCount} 课 / 段 ${segmentCount} / 步 ${stepCount} / 题 ${quizCount} / 挑战 ${challengeCount} / topics ${topicCount}`);
  if (errors.length) {
    console.log(`FAIL：${errors.length} 个错误（见上方 ✗ 行）`);
    process.exitCode = 1;
  } else {
    console.log('PASS：结构 / 引用 / 步骤解析 / quiz / challenge / 引擎冒烟 全部通过');
  }
  if (warnings.length) {
    console.log(`警告 ${warnings.length} 条（不阻塞，见上方 ⚠ 行）`);
  }
}

main();
