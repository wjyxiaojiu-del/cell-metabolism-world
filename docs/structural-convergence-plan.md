# 第二阶段结构性收敛计划（准备阶段）

> 状态：2026-08-16 P3-1、P3-2、P3-3、P3-4 已完成。
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

### P3-4 CSS 同选择器合并（高风险）✅ 已完成
- 新增 `tools/scan-css-duplicates.js`：扫描同媒体上下文中的重复选择器，并筛出“前规则被后规则完全覆盖”的安全合并候选。
- 从 297 组重复选择器中筛出 **9 条安全冗余**并删除（pathbar/path-filters/path-filter 移动端、student-head h1、student-inner、legend transport、primer 字号、section-label 等）。
- 合并后安全候选归零；`test:data` + `test:ui` 67/67 全绿。
- 说明：其余重复是不同主题块的顺序覆盖，不能安全合并，保留现状。

## 后续可选增强

### 已完成（2026-08-16）
- [x] `transport` 通路 UI 可达：`scene-data.js` 在线粒体内膜场景补热点。
- [x] 专家地图实体/酶聚焦裁剪：聚焦通路时非 `pathway-active` 的实体/酶 `display:none`。
- [x] axe 可访问性冒烟：`tests/ui-accessibility.spec.js`（4 用例，零违规）。
- [x] 修复 axe `color-contrast` / `region`：调整专家概览、品牌、搜索提示、站点指标等颜色，并补 landmark。
- [x] 性能预算测试：`tests/ui-performance.spec.js`（总资源 <15MB、index <1MB、data-compiled <1.5MB、图片 <12MB）。
- [x] `data-compiled.js` 异步拆载：新增 `data-compiled-core.js` / `data-compiled-ext.js`，首屏只同步加载 core，页面就绪后异步预加载 ext 并合并；`tools/split-compiled.js` 负责生成，`compile.js` 已集成。

### 仍可做
- 将 `data-compiled.js` 完全改为“首次进入扩展通路时才拉取 ext”的真懒加载（当前为预加载式）。
- 将 `check-course-data.js` 从 `test:data` 中移除或改为归档检查开关。

## 回滚

- 每次重构独立 commit；失败时 `git revert` 对应 commit。
- 视觉回归以 `output/baseline/` + `docs/baseline-manifest.json` 为基准。
