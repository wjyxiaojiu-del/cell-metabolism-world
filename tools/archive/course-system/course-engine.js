/*!
 * course-engine.js — 自学课程系统 · 课程引擎
 * ---------------------------------------------------------------------------
 * 职责：课程状态机（当前课/段）、进度读写、quiz 判定、challenge 判定、专题统计。
 * 纯逻辑，无 DOM；渲染层（index.html 内联）只做视图，状态与判定全部调本引擎。
 *
 * UMD 模式（与 student-step-resolver.js 同款）：
 *   浏览器：window.COURSE_ENGINE = api（依赖 COURSE_DATA 全局，先加载 course-data.js）
 *   node  : require('./course-engine.js')（tools/check-course-data.js / vm 单测可用）
 *
 * 依赖：COURSE_DATA（window 全局）— 渐进增强，缺失时引擎仍可加载，
 *       所有查询返回安全默认值（null / [] / { ok:false }），不抛错。
 *
 * 接口约定（与 .cluster/lesson-impl-20260815/plan.md 及
 * .cluster/lesson-system-design-20260815/subagent_03_model.md §5/§6 一致）：
 *   getLesson(id)                    -> lesson 对象（无则 null）
 *   getTopic(id) / getTopics()       -> topic 对象 / topic 数组
 *   setLesson(id)                    -> lesson 对象（同时把当前段重置为该课第 1 段）
 *   currentLesson()                  -> 当前课（无则 null）
 *   setSegment(segmentId)            -> segment 对象（仅限当前课内，无则 null）
 *   currentSegment()                 -> 当前段（无则回退第 1 段）
 *   segmentSteps(segmentId)          -> [{ key, index, content, hasContent }]
 *   visibleStepKeys(segmentId)       -> Set<string>：该段应点亮的 step 文本集合
 *                                       （含跨段共享节点：节点文本只要出现在本段 steps
 *                                       即点亮；渲染层用 .has() / for..of 遍历）
 *   segmentsForStep(lessonId, stepKey) -> [segmentId]：含该 step 的段（渲染层 data-segment 用）
 *   quizAnswer(lessonId, quizId, choice) -> { ok, correctIndex, explanation, retarget }
 *                                       兼容 plan 缩写 quizAnswer(quizId, choice)：
 *                                       首参不是课 id 时回退到当前课内查找
 *   fillAnswer(lessonId, quizId, text)  -> { ok, explanation, retarget, accepted }
 *                                       归一化比较：小写 / 去空白 / 全角→半角
 *   orderAnswer(lessonId, quizId, sequence) -> { ok, explanation, retarget }
 *   challengeBlanks(lessonId)           -> blanks 列表（无则 []）
 *   challengeSubmit(lessonId, answers)  -> { score(0..1), pass, perBlank }
 *                                       answers: { stepKey: text } 或按 blanks 顺序的数组
 *   recallCheck(lessonId, checkedItems) -> { allChecked, missing, checked, total }
 *                                       checkedItems: 下标或清单文本数组
 *   loadProgress() / saveProgress(progress) -> 读写 'cell-metabolism-world:course-progress:v1'
 *                                       schema 见 subagent_03 §4.2（v/savedAt/lessons/review）；
 *                                       读写 try/catch 静默降级（localStorage 不可用时内存兜底）
 *   bridgeFromV1(v1Completed)           -> 由旧进度 completed 数组生成 course-progress 初始对象
 *                                       （status=completed + quiz.passed=true），不自动写盘
 *   topicStats(topicId, progress?)      -> { total, completed, next, mastery, weak }
 *                                       掌握度 = 0.6×quiz 正确率 + 0.4×challenge 通过率
 *                                       （仅有单侧记录时用单侧；无记录 mastery=null）
 *   normalizeAnswer(text)               -> 归一化工具（fill/challenge 同款规则）
 *   PROGRESS_KEY / VERSION              -> 进度 key 与 schema 版本常量
 */
(function attachCourseEngine(root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.COURSE_ENGINE = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function createCourseEngine(root) {
  'use strict';

  const PROGRESS_KEY = 'cell-metabolism-world:course-progress:v1';
  const PROGRESS_VERSION = 1;
  const QUIZ_KINDS = ['single', 'truefalse', 'fill', 'multiple', 'order', 'match'];

  // localStorage 不可用（node vm / 隐私模式）时的内存兜底存储
  const memoryStore = new Map();

  /* ---------------- 数据访问（渐进增强） ---------------- */

  function data() {
    if (typeof COURSE_DATA !== 'undefined' && COURSE_DATA) return COURSE_DATA;
    if (root && root.COURSE_DATA) return root.COURSE_DATA;
    return null;
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function getLesson(id) {
    const d = data();
    if (!d || !d.lessons || typeof d.lessons !== 'object') return null;
    return d.lessons[id] || null;
  }

  function getTopic(topicId) {
    const d = data();
    if (!d || !d.topics || typeof d.topics !== 'object') return null;
    return d.topics[topicId] || null;
  }

  function getTopics() {
    const d = data();
    if (!d || !d.topics || typeof d.topics !== 'object') return [];
    return Object.keys(d.topics).map(id => d.topics[id]);
  }

  /* ---------------- 会话状态（运行时内存态，不落盘） ---------------- */

  const state = { lessonId: null, segmentId: null };

  function setLesson(id) {
    const lesson = getLesson(id);
    if (!lesson) return null;
    state.lessonId = lesson.id;
    state.segmentId = asArray(lesson.segments).length ? lesson.segments[0].id : null;
    return lesson;
  }

  function currentLesson() {
    return state.lessonId ? getLesson(state.lessonId) : null;
  }

  function findSegment(lesson, segmentId) {
    if (!lesson) return null;
    return asArray(lesson.segments).find(seg => seg && seg.id === segmentId) || null;
  }

  function setSegment(segmentId) {
    const lesson = currentLesson();
    if (!lesson) return null;
    const segment = findSegment(lesson, segmentId);
    if (!segment) return null;
    state.segmentId = segment.id;
    return segment;
  }

  function currentSegment() {
    const lesson = currentLesson();
    if (!lesson) return null;
    if (state.segmentId) {
      const segment = findSegment(lesson, state.segmentId);
      if (segment) return segment;
    }
    return asArray(lesson.segments)[0] || null;
  }

  // 按 segment id 全局定位（约定 id 全局唯一：lessonId-sN）
  function segmentById(segmentId) {
    const local = findSegment(currentLesson(), segmentId);
    if (local) return { lesson: currentLesson(), segment: local };
    const d = data();
    if (d && d.lessons) {
      const keys = Object.keys(d.lessons);
      for (let i = 0; i < keys.length; i++) {
        const lesson = d.lessons[keys[i]];
        const segment = findSegment(lesson, segmentId);
        if (segment) return { lesson, segment };
      }
    }
    return null;
  }

  function segmentSteps(segmentId) {
    const found = segmentById(segmentId);
    if (!found) return [];
    const { lesson, segment } = found;
    const stepContent = segment.stepContent && typeof segment.stepContent === 'object' ? segment.stepContent : {};
    return asArray(segment.steps).map((key, index) => ({
      key,
      index,
      content: Object.prototype.hasOwnProperty.call(stepContent, key) ? stepContent[key] : null,
      hasContent: Object.prototype.hasOwnProperty.call(stepContent, key)
    }));
  }

  function visibleStepKeys(segmentId) {
    return new Set(segmentSteps(segmentId).map(item => item.key).filter(Boolean));
  }

  function segmentsForStep(lessonId, stepKey) {
    const lesson = getLesson(lessonId);
    if (!lesson) return [];
    return asArray(lesson.segments)
      .filter(seg => asArray(seg.steps).indexOf(stepKey) >= 0)
      .map(seg => seg.id);
  }

  /* ---------------- quiz 判定 ---------------- */

  function findQuiz(lesson, quizId) {
    if (!lesson) return null;
    return asArray(lesson.quiz).find(q => q && q.id === quizId) || null;
  }

  // plan 缩写兼容：quizAnswer(quizId, choice) 时首参不是课 id，回退到当前课
  // （注意：缩写形式 choice 位于第 2 参，需一并移位）
  function resolveLessonQuiz(lessonId, quizId, choice) {
    let lesson = getLesson(lessonId);
    let id = quizId;
    let shiftedChoice = choice;
    if (!lesson && typeof lessonId === 'string' && currentLesson()) {
      const probe = findQuiz(currentLesson(), lessonId);
      if (probe) {
        lesson = currentLesson();
        id = lessonId;
        shiftedChoice = quizId;
      }
    }
    return { lesson, quiz: findQuiz(lesson, id), choice: shiftedChoice };
  }

  function normalizeAnswer(value) {
    return String(value == null ? '' : value)
      .toLowerCase()
      .replace(/[\uFF01-\uFF5E]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))
      .replace(/\u3000/g, ' ')
      .replace(/\s+/g, '');
  }

  function safeCorrectIndex(quiz) {
    const options = asArray(quiz.options);
    if (Number.isInteger(quiz.correct) && quiz.correct >= 0 && quiz.correct < options.length) {
      return quiz.correct;
    }
    return null;
  }

  function retargetFor(quiz, ok) {
    if (ok) return null;
    return quiz && typeof quiz.retarget === 'string' && quiz.retarget ? quiz.retarget : null;
  }

  function quizAnswer(lessonId, quizId, choice) {
    const resolved = resolveLessonQuiz(lessonId, quizId, choice);
    const { lesson, quiz } = resolved;
    const pickedChoice = resolved.choice;
    if (!lesson || !quiz) return { ok: false, correctIndex: null, explanation: '', retarget: null };
    const kind = quiz.kind || 'single';
    const options = asArray(quiz.options);
    const explanation = quiz.explanation || '';

    if (kind === 'fill' || kind === 'match') {
      // fill 走 fillAnswer；match 后续版本实现
      return { ok: false, correctIndex: null, explanation, retarget: retargetFor(quiz, false) };
    }

    if (kind === 'multiple') {
      const correct = Array.isArray(quiz.correct) ? quiz.correct.slice().sort((a, b) => a - b) : [];
      const picked = asArray(pickedChoice).map(Number).sort((a, b) => a - b);
      const ok = correct.length > 0 && correct.length === picked.length &&
        correct.every((value, index) => value === picked[index]);
      return { ok, correctIndex: Array.isArray(quiz.correct) ? quiz.correct : [], explanation, retarget: retargetFor(quiz, ok) };
    }

    if (kind === 'order') {
      // 排序题请走 orderAnswer（排序语义独立）
      return { ok: false, correctIndex: Array.isArray(quiz.correct) ? quiz.correct : null, explanation, retarget: retargetFor(quiz, false) };
    }

    const picked = typeof pickedChoice === 'string' && /^\d+$/.test(pickedChoice) ? Number(pickedChoice) : pickedChoice;
    if (kind === 'truefalse' && typeof quiz.correct === 'boolean') {
      const pickedBool = picked === 1 || picked === true || picked === '1' || picked === 'true';
      const ok = pickedBool === quiz.correct;
      return { ok, correctIndex: quiz.correct ? 1 : 0, explanation, retarget: retargetFor(quiz, ok) };
    }
    const correct = safeCorrectIndex(quiz);
    const ok = correct !== null && picked === correct;
    return { ok, correctIndex: correct, explanation, retarget: retargetFor(quiz, ok) };
  }

  function fillAnswer(lessonId, quizId, text) {
    const resolved = resolveLessonQuiz(lessonId, quizId, text);
    const { lesson, quiz } = resolved;
    const answerText = resolved.choice;
    if (!lesson || !quiz) return { ok: false, explanation: '', retarget: null, accepted: null };
    const accept = asArray(quiz.accept);
    const normalized = normalizeAnswer(answerText);
    const accepted = accept.find(a => normalizeAnswer(a) === normalized) || null;
    const ok = accepted !== null;
    return { ok, explanation: quiz.explanation || '', retarget: retargetFor(quiz, ok), accepted };
  }

  function orderAnswer(lessonId, quizId, sequence) {
    const resolved = resolveLessonQuiz(lessonId, quizId, sequence);
    const { lesson, quiz } = resolved;
    const pickedSequence = resolved.choice;
    if (!lesson || !quiz) return { ok: false, explanation: '', retarget: null };
    const options = asArray(quiz.options);
    const expected = Array.isArray(quiz.correct) && quiz.correct.length === options.length
      ? quiz.correct
      : options.map((_, index) => index);
    const picked = asArray(pickedSequence).map(item => {
      if (typeof item === 'number') return item;
      const index = options.indexOf(item);
      return index >= 0 ? index : item;
    });
    const ok = picked.length === expected.length && picked.every((value, index) => value === expected[index]);
    return { ok, correctIndex: expected, explanation: quiz.explanation || '', retarget: retargetFor(quiz, ok) };
  }

  /* ---------------- challenge 判定 ---------------- */

  function challengeBlanks(lessonId) {
    const lesson = getLesson(lessonId);
    if (!lesson || !lesson.challenge) return [];
    return asArray(lesson.challenge.blanks);
  }

  function challengeSubmit(lessonId, answers) {
    const lesson = getLesson(lessonId);
    if (!lesson || !lesson.challenge) return { score: 0, pass: false, perBlank: [] };
    const challenge = lesson.challenge;
    const blanks = asArray(challenge.blanks);
    if (blanks.length) {
      const passCriteria = challenge.passCriteria || {};
      const min = typeof passCriteria.blanksMin === 'number' ? passCriteria.blanksMin : 0.8;
      const perBlank = blanks.map((blank, index) => {
        const raw = Array.isArray(answers) ? answers[index] : answers ? answers[blank.stepKey] : '';
        const accepted = asArray(blank.accept).find(a => normalizeAnswer(a) === normalizeAnswer(raw)) || null;
        return { stepKey: blank.stepKey, ok: accepted !== null, accepted };
      });
      const okCount = perBlank.filter(item => item.ok).length;
      const score = blanks.length ? okCount / blanks.length : 0;
      return { score, pass: score >= min, perBlank };
    }
    if (asArray(challenge.recallChecklist).length) {
      const check = recallCheck(lessonId, answers);
      return { score: check.total ? check.checked / check.total : 0, pass: check.allChecked, perBlank: [] };
    }
    return { score: 0, pass: false, perBlank: [] };
  }

  function recallCheck(lessonId, checkedItems) {
    const lesson = getLesson(lessonId);
    const checklist = (lesson && lesson.challenge && asArray(lesson.challenge.recallChecklist).length)
      ? asArray(lesson.challenge.recallChecklist)
      : (lesson && lesson.review ? asArray(lesson.review.recall) : []);
    const items = asArray(checkedItems);
    const missing = [];
    checklist.forEach((item, index) => {
      const hit = items.some(c => c === index ||
        (typeof c === 'string' && String(item).trim() === c.trim()));
      if (!hit) missing.push({ index, item });
    });
    return {
      allChecked: missing.length === 0,
      missing,
      checked: checklist.length - missing.length,
      total: checklist.length
    };
  }

  /* ---------------- 进度读写（try/catch 静默降级） ---------------- */

  function storageGet(key) {
    try {
      if (typeof localStorage !== 'undefined' && localStorage) {
        const value = localStorage.getItem(key);
        if (value !== null) return value;
      }
    } catch (_) { /* 静默降级到内存 */ }
    return memoryStore.has(key) ? memoryStore.get(key) : null;
  }

  function storageSet(key, value) {
    try {
      if (typeof localStorage !== 'undefined' && localStorage) {
        localStorage.setItem(key, value);
        return;
      }
    } catch (_) { /* 静默降级到内存 */ }
    memoryStore.set(key, value);
  }

  function loadProgress() {
    const raw = storageGet(PROGRESS_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || parsed.v !== PROGRESS_VERSION) return null;
      return parsed;
    } catch (_) {
      return null;
    }
  }

  function saveProgress(progress) {
    if (!progress || typeof progress !== 'object') return false;
    try {
      const copy = JSON.parse(JSON.stringify(progress));
      copy.v = PROGRESS_VERSION;
      copy.savedAt = new Date().toISOString();
      storageSet(PROGRESS_KEY, JSON.stringify(copy));
      return true;
    } catch (_) {
      return false;
    }
  }

  // 旧进度（cell-metabolism-world:student-progress:v1 的 completed 数组）单向桥接
  function bridgeFromV1(v1Completed) {
    const list = Array.isArray(v1Completed)
      ? v1Completed
      : (v1Completed && Array.isArray(v1Completed.completed) ? v1Completed.completed : []);
    const d = data();
    const lessons = {};
    const now = Date.now();
    list.forEach(id => {
      const lesson = d && d.lessons ? d.lessons[id] : null;
      if (!lesson) return;
      const segments = {};
      asArray(lesson.segments).forEach(seg => { segments[seg.id] = 'done'; });
      lessons[id] = {
        status: 'completed',
        currentSegment: asArray(lesson.segments).length ? lesson.segments[0].id : null,
        segments,
        quiz: { score: 0, total: 0, passed: true, answers: {} },
        challenge: { passed: true, attempts: 0, lastAt: null },
        completedAt: now
      };
    });
    return { v: PROGRESS_VERSION, savedAt: new Date().toISOString(), lessons, review: { weak: [], recall: {} } };
  }

  /* ---------------- 专题统计（subagent_03 §6.1） ---------------- */

  function topicStats(topicId, progress) {
    const topic = getTopic(topicId);
    if (!topic) return null;
    const lessonIds = asArray(topic.lessons);
    const prog = progress || loadProgress() || { lessons: {}, review: {} };
    const records = prog.lessons && typeof prog.lessons === 'object' ? prog.lessons : {};

    const total = lessonIds.length;
    const completed = lessonIds.filter(id => (records[id] && records[id].status) === 'completed').length;
    const next = lessonIds.find(id => (records[id] && records[id].status) !== 'completed') || null;

    let okCount = 0;
    let ansCount = 0;
    let passedCount = 0;
    let recCount = 0;
    lessonIds.forEach(id => {
      const record = records[id];
      if (!record) return;
      const answers = record.quiz && record.quiz.answers ? record.quiz.answers : {};
      Object.keys(answers).forEach(key => {
        ansCount++;
        if (answers[key] && answers[key].ok === true) okCount++;
      });
      if (record.challenge && typeof record.challenge.passed === 'boolean') {
        recCount++;
        if (record.challenge.passed) passedCount++;
      }
    });

    const quizRate = ansCount > 0 ? okCount / ansCount : null;
    const challengeRate = recCount > 0 ? passedCount / recCount : null;
    let mastery = null;
    if (quizRate !== null && challengeRate !== null) mastery = 0.6 * quizRate + 0.4 * challengeRate;
    else if (quizRate !== null) mastery = quizRate;
    else if (challengeRate !== null) mastery = challengeRate;
    if (mastery !== null) mastery = Math.round(mastery * 100) / 100;

    const weak = (prog.review && Array.isArray(prog.review.weak) ? prog.review.weak : []).filter(quizId =>
      lessonIds.some(lid => {
        const lesson = getLesson(lid);
        return !!lesson && asArray(lesson.quiz).some(q => q && q.id === quizId);
      })
    );

    return { total, completed, next, mastery, weak };
  }

  /* ---------------- 导出 ---------------- */

  return {
    VERSION: PROGRESS_VERSION,
    PROGRESS_KEY,
    QUIZ_KINDS,
    getLesson,
    getTopic,
    getTopics,
    setLesson,
    currentLesson,
    setSegment,
    currentSegment,
    segmentSteps,
    visibleStepKeys,
    segmentsForStep,
    quizAnswer,
    fillAnswer,
    orderAnswer,
    challengeBlanks,
    challengeSubmit,
    recallCheck,
    loadProgress,
    saveProgress,
    bridgeFromV1,
    topicStats,
    normalizeAnswer
  };
}));
