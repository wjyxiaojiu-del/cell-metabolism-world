# 第二阶段结构性收敛计划（准备阶段）

> 状态：2026-08-16 P3-1、P3-2、P3-3 已完成；P3-4 待执行。
> 前置：Git 基线已建立（commit `9542973`）；大资产已外移；截图基线已生成。

## 目标

在不破坏 67 个 Playwright 用例和科学数据正确性的前提下，逐步消除：

1. 两套 SVG 工厂（`expertSvgElement` / `studentSvgElement`）
2. 三套缩放/平移系统（专家地图 `applyView`、专题图 `applyStudentTopicMapScale`、单通路图 `applyStudentMapZoom`）
3. 多个手写贝塞尔路径生成器（`studentMapEdgePath` / `studentMapBranchPath` / `studentMapLoopPath` / `studentDestinationPath` 等）
4. CSS 多主题块先后覆盖同一选择器的问题（HANDOVER §3.4）

## 已完成的准备

- [x] Git 基线：`git init` + `.gitignore` + `.gitattributes`（LF 强制）+ 首次提交
- [x] 大资产外移：`archive/` + `source-*` → `D:/wangjunyi/Documents/cell Metabolism world-assets-backup/`
- [x] 共享契约：`shared/contracts.js`
  - 已迁移工具：`generate-stats.js`、`check-student-steps.js`、`check-student-notes.js`、`check-course-data.js`、`check-cross-consistency.js`
  - 已迁移测试：`ui-cover-premium.spec.js`、`ui-student-canvas-reading.spec.js`、`ui-beginner-learning.spec.js`、`ui-expert-layout.spec.js`
- [x] 截图基线：`tools/capture-baseline.js` + `docs/baseline-manifest.json`
  - 图片输出在 `output/baseline/`（git-ignored）
  - 重新生成：先 `npm run preview`，再 `npm run baseline`
  - **注意**：当前截图 hash 受 JS 动画/时序影响，多次运行不完全一致；视觉回归应以 UI 测试 + 人工抽查为主，精确像素对比需先让 capture 脚本完全确定性化。

## 执行顺序（每步必须跑 test:data + test:ui + 视觉抽查）

### P3-1 SVG 工厂合并（低风险）✅ 已完成
- [x] 合并 `expertSvgElement` 与 `studentSvgElement` 为单一 `svgElement`。
- [x] 统一命名空间常量 `SVG_NS`。
- [x] 保持现有属性/文本行为不变；155 处调用已迁移。
- [x] 验证：`test:data` + `test:ui` 67/67 全绿。

### P3-2 贝塞尔路径生成器收敛（中风险）✅ 已完成
- [x] 抽取公共 `roundedCornerPath` / `cubicPath`，并保留 `curveBetween` / `curveThrough`。
- [x] `studentMapEdgePath`、`studentMapBranchPath`、`studentMapBranchInputPath`、`studentMapLoopPath` 统一走 `roundedCornerPath`。
- [x] `studentDestinationPath`、`studentDestinationMobilePath`、`studentDestinationBranchPath` 统一走 `cubicPath`。
- [x] 循环线契约保持：`r=22`、`arrowGap=13`、marker 尺寸 12。
- [x] 人工检查后修复：循环线 `laneX` 动态避开箭头终点，`roundedCornerPath` 过滤重复点。
- [x] 验证：`test:data` + `test:ui` 67/67 全绿。

### P3-3 缩放系统收敛（中风险）✅ 已完成（修订方案）
- 经用户确认：**不强行统一渲染机制**，专家地图保留 `viewBox`，学生图保留滚动/缩放。
- 新增 `shared/viewport-core.js` 纯函数模块：`clampZoom`、`zoomScrollOffset`、`zoomScrollState`、`fitScrollZoom`、`zoomViewBoxAtPoint`、`clampViewBox`。
- 三处缩放函数改为调用共享数学层：
  - 专家地图 `applyView` / `zoomAt` → `clampViewBox` / `zoomViewBoxAtPoint`
  - 专题图 `applyStudentTopicMapScale` / `fitStudentTopicMap` → `clampZoom` / `zoomScrollState` / `fitScrollZoom`
  - 单通路图 `applyStudentMapZoom` → `zoomScrollOffset`
- 验证：`test:data` + `test:ui` 67/67 全绿。

### 性能优化：专家地图路径裁剪 ✅ 已完成
- 专家地图聚焦单通路时，对非 `pathway-active` 的 `.route` / `.route-aura` 设置 `display:none`。
- 可见路径从总览 51 条降到聚焦 TCA 的 9 条，减少 SVG 渲染与样式计算。
- 验证：`test:data` + `test:ui` 67/67 全绿。

### P3-4 CSS 同选择器合并（高风险）
- 用 `getComputedStyle` 全视口快照 + 截图基线回归。
- 遵循 HANDOVER §3.4：新样式追加到 `</style>` 前，并加“最后生效”注释。

## 后续可选增强

- 将 `data-compiled.js` 拆为“21 核心 + 34 扩展”异步加载（高风险，需等上述收敛稳定）。
- 引入 axe 可访问性冒烟与性能预算断言。
- 将 `check-course-data.js` 从 `test:data` 中移除或改为归档检查开关。

## 回滚

- 每次重构独立 commit；失败时 `git revert` 对应 commit。
- 视觉回归以 `output/baseline/` + `docs/baseline-manifest.json` 为基准。
