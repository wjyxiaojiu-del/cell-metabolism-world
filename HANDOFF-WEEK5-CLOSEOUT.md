# 第五周总目标收口交接文档

> 注：本文件为 2026-08-31 的历史快照，签核进度与当前执行队列以 `docs/map-polish/owner-signoff.md` 与 `docs/continuous-product-roadmap.md` 为准。

更新时间：2026-08-31
工作目录：`D:\wangjunyi\Documents\cell Metabolism world`

## 1. 唯一总目标

“第五周结束状态”是当前项目唯一总目标，不是普通周目标：

- 21 条核心通路各有一张学习地图和一张专家地图，共 42 张。
- 每张总分不低于 90/100，科学准确性不低于 24/25。
- 每张无 P0/P1 问题。
- 每张完成 390、768、1440 三档实际操作与人工视觉验收。
- 同一通路的学习图与专家图在事实、方向、区室、膜侧和边界上保持一致。
- 数据、布局、导航、移动端和全量 UI 门禁通过。
- 项目负责人逐图确认 42/42 后，才算正式完成。

在正式完成前：不发布、不招募用户、不扩功能、不扩展 21 条核心通路范围。

## 2. 当前真实状态

工程侧第五周施工目标已完成，但正式目标尚未完成：

- 内部复审：42/42 张地图完成。
- 内部评分：42/42 已登记，分数均达到总分 ≥90、科学分 ≥24。
- P0/P1：当前登记为 0。
- Final 证据：126 张，等于 42 张地图 × 390/768/1440。
- 正式负责人确认：`0/42`。不得擅自改成 42/42。

21 条核心通路 ID：

```text
pdh, tca, malate_aspartate, glycerol_phosphate, etc, oxphos,
glycolysis, gluconeogenesis, glycogenesis, glycogenolysis, ppp,
fa_synthesis, carnitine, beta_oxidation, ketone,
transamination, urea, aa_carbon,
purine, pyrimidine, nucleotide_degradation
```

## 3. 已验证证据

最近一次全量回归：

```text
npm test
```

结果：

- 数据门禁通过：344 条反应、310 个实体、294/294 学习步骤、21/21 专家几何、资源与审校台账一致。
- Playwright UI：121/121 通过。
- 学习侧专项：26/26 通过。
- 专家移动端核心地图：21/21 通过。
- `git diff --check` 无实际空白错误；输出中的 LF/CRLF 是换行提示。

Final 证据目录：

```text
docs/map-polish/evidence/learning/<pathway-id>/
docs/map-polish/evidence/expert/<pathway-id>/
```

每个目录当前恰好有一份：

```text
*-final-390.png
*-final-768.png
*-final-1440.png
```

最近一次机器审计：`final_png_audited=126 bad=0`，检查了目录数量、唯一文件、PNG 尺寸、非空和非单色。

## 4. 最近发现并修正的证据问题

总览人工抽查发现以下旧证据曾捕获到封面，而不是学习地图：

- `oxphos` 学习侧旧 2026-08-30 全页 390/768/1440。
- `pdh` 学习侧旧 2026-08-30 全页 390/768/1440。
- `tca` 学习侧旧 390/768。

处理方式：

- 用当前版本重新生成 2026-08-31 final 证据。
- `oxphos` 和 `pdh` 的 6 张错误旧全页文件移入 `.scratch/stale-evidence/learning/` 留存。
- 当前三条通路的 390/768/1440 原图均已确认包含学习导读和主图。

详细记录见 [audit-register.md](docs/map-polish/audit-register.md)。

## 5. 剩余工作：只做负责人逐图签核

不要重新开发功能，也不要把自动化通过当作签核。继续顺序：

1. 按通路对查看学习图和专家图。
2. 每条通路检查 390、768、1440：主线、标签、区室、方向、导航、详情和返回。
3. 通过则在审查台账登记负责人确认；发现问题则只处理这一通路对。
4. 修改后重新生成该通路两侧 final 证据，运行针对性测试，再回归台账。
5. 只有负责人确认的地图才增加正式完成数。
6. 42/42 确认后，再运行一次 `npm test`，然后才讨论发布或用户验证。

当前台账的 `0/42` 是有意保留的正式状态，不是数据错误。

## 6. 重要文档

- `CONTEXT.md`：术语和地图层级定义。
- `docs/continuous-product-roadmap.md`：第五周作为唯一总目标的路线图和当前执行队列。
- `docs/map-polish/README.md`：逐图打磨流程、状态定义和证据命名。
- `docs/map-polish/audit-register.md`：21 条通路双图评分、P0/P1、证据和负责人状态。
- `docs/map-polish/owner-signoff.md`：负责人逐图签核表；只有填写确认日期后才可计入正式完成数。
- `docs/specs/`：当前地图打磨规格。
- `docs/adr/0002-expert-hierarchy-is-biological-containment.md`：专家层级架构决策。
- `docs/expert-hierarchy-point-groups-fix-plan.md`：专家地图点组方案。

## 7. 关键代码与门禁

- `scripts/app.js`：学习/专家模式运行时逻辑。
- `styles/main.css`：响应式布局和地图视觉样式。
- `tools/expert-map-geometry.js`：专家图区室、排除区和几何合同。
- `tools/expert-pathway-layout.js`：21 条专家通路专属布局。
- `tools/check-expert-layout.js`：专家几何门禁。
- `tools/check-student-steps.js`：学习步骤链接门禁。
- `tools/capture-map-polish.js`：三档证据生成器。
- `tests/ui-beginner-learning.spec.js`：学习地图回归。
- `tests/ui-expert-mobile-readability.spec.js`：专家移动端回归。

数据源修改顺序：先改 `data/reactions/*.tsv` 或场景元数据，再运行编译和门禁；不要手工编辑 `data-compiled.js`。

## 8. 续接时的最小命令集

```powershell
cd 'D:\wangjunyi\Documents\cell Metabolism world'
npm run test:data
npm test
git diff --check
```

需要补拍单条通路时：

```powershell
node tools/capture-map-polish.js --pathway=<id> --phase=final --modes=learning,expert
```

不要执行以下动作：

- 不要将 `0/42` 改成 `42/42`，除非项目负责人已经逐图确认。
- 不要删除 `.scratch/stale-evidence` 中的错误旧证据，除非明确需要清理历史。
- 不要发布、招募用户、扩展产品功能或增加核心通路。
- 不要用单个专项测试替代全量目标验收。

## 9. 完成判定

只有同时满足以下条件，才允许调用目标完成：

```text
学习地图负责人确认 21/21
专家地图负责人确认 21/21
总计 42/42
每张总分 >= 90 且科学分 >= 24
P0=0，P1=0
三档人工验收全部完成
npm test 通过
```

目前不能判定完成，原因只有一个：负责人逐图确认尚未登记。
