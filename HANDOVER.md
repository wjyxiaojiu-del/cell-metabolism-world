# 细胞代谢世界｜最新状态交接文档（2026-08-16）

> 本文档替代 HANDOVER.md 中全部过期数字与结论，作为 2026-08-16 的权威交接快照。
> 数据来源：工作台 `.cluster/20260815-cmw-refactor/` 八轮收敛记录（`DELIVERY/代码收敛报告.html`、subagent_01~10、plan.md、各轮 fix 脚本与 ui-*.log）+ 2026-08-16 对项目文件的逐项实测。
> 项目位置：`D:/wangjunyi/Documents/cell Metabolism world/`（无 Git 仓库，改前务必备份）
> 本地预览：`npm run preview` → `http://127.0.0.1:8000`

---

## 1. 最新状态快照（2026-08-16 实测）

### 1.1 文件规模

| 文件 | 规模 | 备注 |
|---|---|---|
| `index.html` | **14,024 行 / 816,916 字节（797.8 KB）** | CSS 7,525 行 + 内联 JS 6,011 行；UTF-8 **无 BOM**、行尾**纯 LF（0 个 CRLF，实测）** |
| `scene-data.js` | 533 行 / 70,099 字节 | **55 个通路定义** + 20 个场景条目（cell-atlas + 19 子场景） |
| `data-compiled.js` | 1,288,645 字节 | 编译产物，勿手改 |
| `student-step-resolver.js` | 15,660 字节 | 学习步骤解析器 |
| `student-reaction-notes.js` | 45,945 字节 | 反应白话说明 |
| `tests/` | **15 个 Playwright spec + helpers.js** | 67 个浏览器用例 |

### 1.2 数据状态（与 STATS.md 一致，`generate-stats --check` 通过）

- 55 个 TSV 文件；368 行源数据；**300 个编译实体；340 条编译反应**
- 55 个通路组；20 个叶区室、83 种可识别写法；47 个手工坐标锚点
- 290 个学习主线步骤：**271 个可交互定位、19 个说明性不可点击、错误链接 0 个**（2026-08-16 9:04 起为生化修复后基线）
- 结构化参与物 1,455 次 / 唯一 307 个 / 跨通路 106 个；运行时图片 46 个唯一引用 10.74MB
- 审校台账：已核对 53 / 已终审 261 / 待审校 54
- `data-compiled.js` SHA-256：`AD3909A27AAF475E3D3653D762CF164B8C09BEB2A6E046B7B833A2E19A55E91C`

### 1.3 21 条核心通路清单（index.html `coreStudyModules` 权威定义）

| 专题 | 数量 | 通路 key |
|---|---|---|
| 生物氧化 | 6 | `pdh` `tca` `malate_aspartate` `glycerol_phosphate` `etc` `oxphos` |
| 糖代谢 | 5 | `glycolysis` `gluconeogenesis` `glycogenesis` `glycogenolysis` `ppp` |
| 脂代谢 | 4 | `fa_synthesis` `carnitine` `beta_oxidation` `ketone` |
| 氨基酸 | 3 | `transamination` `urea` `aa_carbon` |
| 核苷酸 | 3 | `purine` `pyrimidine` `nucleotide_degradation` |

> 更正历史口径：脂代谢核心是 `ketone`（非 `fa_elongation`）、核苷酸核心是 `nucleotide_degradation`（非 `salvage`）。扩展通路共 34 条，其中 33 条有场景热点（仅 `transport` 合并文件无热点，UI 不可达，见 §4）。

### 1.4 测试门禁（2026-08-16 15:40 最后一轮，全绿）

```text
npm run test:data   全绿（validate → selftest → layout → compile --check
                    → cross-consistency → student-steps → student-notes
                    → course-data（归档路径，引擎冒烟 18/18 API）
                    → expert-layout（55/55 通路）→ assets → review-helper → stats --check）
npm run test:ui     67/67 通过（15 个 spec，约 5.2 分钟）
npm test            通过
```

---

## 2. 八轮改动记录（2026-08-15 ~ 08-16）

> 全量证据见 `DELIVERY/代码收敛报告.html` 与工作台各轮脚本/日志。

### 第 1 轮：代码减量（08-15）——删除死代码与孤儿资产

- **内联 JS -1,068 行（7.1%）**：rev.15 结构化课程模式 V2 ≈737 行（19 个 DOM id 不存在、40 处 `window.COURSE_ENGINE` 调用但引擎从未加载）；V1 课后自测/进度 ≈178 行；孤儿函数与死数据 ≈153 行（9 个全文件唯一出现函数 + 4 死状态变量 + 12 死元素声明）。保留课程首页（buildStudentCourseHome 活代码，5 个测试正面覆盖），同步处理 2 个跨块调用点。
- **死 CSS -41 条规则**：全量扫描 557 个类，按「类 token 零出现」判定；先删 30 条纯死类规则，再精确补删 11 条「活类+死类组合」选择器（逐项核验无 `:not()`、无 JS 拼接源）。**通用短类名（bad/correct/wrong/pending/regulation 等）因动态拼接风险一律保留**。
- **根目录垃圾 -5 项**：debug.log（16KB）、probe.js（过期探针）、.openclaw-tmp-testlog*.txt、.superpowers/ state 日志与会话指针（7 个原型 html 保留）。
- **孤儿运行时文件归档 -119KB**：`course-engine.js`（20KB）+ `course-data.js`（99KB，含 5 课完整内容）从未被 index.html 加载 → 归档至 `tools/archive/course-system/`，`check-course-data.js` 路径同步指向归档。
- **验证**：index.html 15,111→13,945 行；UI 67/67 全绿（5.2m）；死符号残留扫描（41 符号）零残留；补删后快速回归 21/21。期间曾误吞 `sceneViewEntry` 函数首行，语法检查 + UI 回归双重拦截后修复。

### 第 2 轮：场景热点对齐 + CSS 去重（08-15）

- **65 个扩展通路热点默认淡化**：README 声称扩展通路「不再铺满细胞器范围」，但 101 个场景热点中 64% 是扩展通路（侧栏过滤、热点未过滤）。`renderSceneHotspots` 给非核心热点加 `entity-extended`（与专家地图先例同构）：CSS 默认 `opacity:.38` + 降饱和，hover/focus/active 恢复。**刻意不做隐藏**——5 个场景 100% 由扩展热点构成，隐藏会让场景失去全部通路入口。
- **CSS 冗余去重 -24 条 / -1.9KB**：300 组重复选择器中仅删「完全重复」或「后规则 ⊇ 前规则」的 24 条（keep-last 语义）；6 个视口（桌面/1040/960/761/760/移动）× 29 个选择器 `getComputedStyle` 快照 0 差异。
- **评估后不收敛项**：`#studentPathwaySelect` 下拉经核查**不可删**——6 个 spec 约 35 处断言把它当程序化通路切换 API（含 21-option 硬断言与归档 option 注入），且 ≤960px 视口它是移动端唯一切换器（课程卡全部隐藏）。

### 第 3 轮：「读图约定」排版修复（08-16 上午）

- 用户反馈「读图约定内容挤在一块」。实测 9 个视口定位：根源在工具栏图例行——桌面端从未设 `flex-wrap`，nowrap 下 flex-shrink 把条目逐字压碎（1280px 图例折 2 行且「跨区室」孤行；1024px 图例 4 行、计数 3 行、按钮纵向堆叠）。
- **6 处修复**：① 工具栏加 `flex-wrap: wrap` ② 标签加 `white-space: nowrap` ③ 阅读条 min-width 250→210px ④ 移动端工具栏 gap 7→10px ⑤⑥ 两处 `@media …}` 花括号写错 bug（760px 块规则泄漏到桌面端 + 1040px 空壳块），CSS 花括号恢复完全平衡。
- **实测**：1024px 工具栏 96→83px、图例 4 行碎行→1 行、计数 3 行→1 行、按钮纵向→横排；390px 152→143px。UI 67/67 全绿。

### 第 4 轮：通路图节点重叠修复（08-16 上午）

- 用户反馈「每一个专题每一个通路」都有节点重叠（糖酵解右下角「磷酸烯醇式丙酮酸」压「丙酮酸」）。
- **根因**：`fitStudentMapText` 字号公式 `max(min, maximumSize × availableWidth/longestLine)` 无上限——长名拆两行后行宽已小于可用宽度时，公式反而把字号放大到「填满节点宽」（15.5px→29.5px），10 条通路 15 个节点字号通胀，两行文字互相叠压并撞上区室标签。
- **修复**：① 公式加 `Math.min(maximumSize, …)` 上限（通胀归零）② 3 行拆行行距 ±14→±11 ③ 区室标签偏移按行数计算（1 行 26 / 2 行 33 / 3 行 36；含顺序修复——原代码在字号适配前读行数导致恒为单行）④ 删除被后续调用覆盖的死代码。
- **验证**：全 21 通路扫描——字号通胀 0、名称×区室相交 0、跨节点重叠 0。UI 67/67 全绿。

### 第 5 轮：生化内容审核与通路修复（08-16 上午）

- 用户指出「很多通路都不对」。此前几轮只做代码与排版收敛，生化内容本身未逐条审核——本轮补上。
- **审核结论**：对照教科书核对 21 条核心通路（基线 272 步、25 处 unlinked）：**3 条必须修**（糖异生缺苹果酸跨线粒体段与逆行可逆段；酮体缺乙酰乙酰辅酶 A 且 HMG-CoA 无法链接；转氨基主链错序把共产物串成先后链）+ **11 条建议修**（糖原分解末端、磷酸戊糖缺内酯、苹果酸穿梭天冬氨酸分区室、氧化磷酸化 ANT 重复、尿素补天冬氨酸、嘌呤/嘧啶补中间体与括号缩写等）。
- **修复落地**：11 条通路 steps 定义（scene-data.js）+ 4 处中文全名↔缩写实体命名缺口（`（HMG-CoA）`/`（NH₄⁺）`/`（AMP）`等括号别名风格）；同步更新 **1 处测试断言（糖酵解 7→10 步）** 与 1 处步骤名（ANT 与酶名完全一致避免解析平局错配）。
- **验证**：全 21 条主链与教科书一致；步骤解析 **290 步、错误链接 0**；STATS.md 同步。UI 67/67 全绿。
- 更正一处历史口径：脂代谢核心为 `ketone`（非 fa_elongation）、核苷酸核心为 `nucleotide_degradation`（非 salvage）。

### 第 6 轮：通路图格式样式修复（08-16 中午）

- 用户指出「通路格式样式没做好」。图像模型诊断 + 几何实测定位两类根因：① **布局**——导读卡（primer）552px 占首屏 60%，通路图画布被挤出首屏；② **画布样式**——支路线被 canvas 主题覆盖为 1.45px/48% 透明几乎隐形、主链边与图例颜色语义不一致、当前步/下一步双重高亮焦点分散。
- **修复**：primer 三步故事与基础信息收进可展开折叠条（**字号契约保持 19/16px，测试锁定**），primer 552→218px，画布进首屏 86% 可见；支路线 2.2px 不透明并加深；图例主链/支路/跨区室颜色与画布实际渲染同步；当前步发光强化而下一步弱化。
- **踩坑记录**：新样式若插在中间位置会被后续主题块覆盖——最终追加到 `</style>` 前（最后生效），见 §3.4。
- **验证**：UI 67/67 全绿。

### 第 7 轮：支路/共享中间体区可读性修复（08-16 下午）

- 用户反馈支路区「看不懂」（氧化磷酸化支路区出现 ATP×2、ADP×2、膜间隙 H⁺）。
- **根因**：支路区把反应的 from/to 参与物（含能量/氧化还原辅因子）当「共享中间体」拎出展示，且同教学名的多区室实例（ATP@细胞质/ATP@基质）重复显示。
- **修复**：① `branchCofactorKeys` 纯辅因子白名单过滤（ATP/ADP/AMP/Pi/NAD/NADH/NADP/NADPH/FAD/FADH₂/GTP/GDP/UTP/UDP/CTP/CDP/H⁺/水/CO₂/铵离子，中英文名归一匹配）——它们不是代谢中间体，不进支路区；② 同教学名去重（`seenBranchKeys`）——多区室实例只保留一个；③ 保留有教学意义的中间体（DHAP、乳酸、乙酰辅酶 A、苹果酸等）；④ 支路为空时画布自动折叠（viewBox 高度 385/275，已有逻辑）。
- **实测**：oxphos 支路区变为「复合体 I、泛醇、复合体 II、辅酶 Q、复合体 III」。UI 67/67 全绿。

### 第 8 轮：循环通路闭合线修复（08-16 下午）

- 用户反馈「循环回路看不清楚、一堆 BUG」。图像诊断定位两个渲染缺陷：① 循环闭合线（TCA 草酰乙酸→乙酰辅酶 A、尿素循环）终点正好停在节点边缘，箭头 marker 被节点矩形遮住大半；② 闭合线为 90 度直角硬折线。
- **修复**：终点留白 **arrowGap=13** 让箭头完整露出、弯折改为 **r=22 圆角贝塞尔曲线**、循环线默认 marker-end（反应为空时也有箭头）、箭头 marker 尺寸保持 **12**（测试契约锁定）。
- **过程**：曾试 marker 12→14，被测试拦截后经 `revert-marker.js` 回退到契约值 12。
- **验证**：图像复核箭头可见且方向正确、弯折圆角、风格与其他连线一致；UI 67/67 全绿（15:40 最后一轮）。

### 第 9 轮：低风险口径修正与数据补缺（08-16 审核后）

- 用户要求全项目审核并查看后续优化方向；审核确认数据/UI 双门禁全绿后，落地低风险项。
- **数据补缺**：`aa_carbon.tsv` 补 `乙酰乙酰辅酶 A@cytosol` 入口；`nucleotide_degradation.tsv` 拆出「次黄嘌呤 → 黄嘌呤 → 尿酸」，鸟嘌呤经黄嘌呤汇入；`glycerol_phosphate.tsv` 末步产物改为已存在的 `泛醇@线粒体内膜`。编译后实体 298→300、反应 337→340、源数据 366→368。
- **口径修正**：README「55 个场景导航入口」改为 54+1 口径；HANDOVER 场景数 16→20；`renderStudentPrimer` 不再写「第 N 课」；状态栏静态兜底数字更新；`check-expert-layout` 描述改为 55 条通路（含 21 条核心合同）。
- **配套修复**：`tools/expert-map-geometry.js` 的 glycerol_phosphate 膜侧合同加入 `泛醇@线粒体内膜`；`applyView` 增加 viewBox 非正宽高兜底，避免移动端偶发负高度 console error。
- **验证**：`npm run test:data` + `npm run test:ui` 全绿。

---

## 3. 关键架构决策与约束（必须遵守）

### 3.1 index.html 编码与写回方式

- **UTF-8 无 BOM + LF 行尾**（实测：0 个 CRLF，无 BOM 头）。
- 任何脚本化修改写回必须用：
  - PowerShell：`[System.IO.File]::WriteAllText($path, $text, (New-Object System.Text.UTF8Encoding($false)))`
  - Node：`fs.writeFileSync(path, text, 'utf8')`（默认无 BOM、不转换 LF）
- **禁止**用会引入 BOM 的 `Set-Content -Encoding UTF8`（PS5 会写 BOM）或把行尾转成 CRLF 的工具。BOM/CRLF 会污染全文件 diff 并可能破坏测试锚点。

### 3.2 CSS 类删除红线

- **12 个 `.student-course-*` 活类不能删**：`student-course-home`、`-home-eyebrow`、`-home-heading`、`-home-lead`、`-home-note`、`student-course-chain`、`student-course-start`、`student-course-back`、`student-course-topic`、`-topic-action`、`-topic-copy`、`-topic-index`（课程首页与专题卡渲染在用）。
- **通用短类名不能当死类删**：bad/correct/wrong/pending/regulation 等存在 JS 动态拼接风险，即使静态检索「零出现」也必须保留；删除前需核对 `classList.add` 与拼接字面量（第 1 轮方法论，勿跳过）。
- 删除组合选择器前逐项核验无 `:not()` 场景、JS 中无拼接源字面量。

### 3.3 课程系统归档状态

- `course-engine.js` / `course-data.js`（99KB，5 课完整内容）已归档至 **`tools/archive/course-system/`**——内容资产不丢，**不要为了"页面不用课程"直接删除**。
- `tools/check-course-data.js` 默认路径已指向归档（可用 `COURSE_DATA_FILE` 环境变量覆盖），引擎冒烟 18/18 API 仍挂 test:data 门禁。
- 「16 条核心通路没有旧课程记录」是非阻塞警告（归档数据检查的遗留输出），不要为消除它重新接线课程 UI。
- 课程模式 UI 已下线：**不要恢复**课程/自测/挑战/进度界面（交接判断标准 §旧 HANDOVER 依然有效）。

### 3.4 样式覆盖链的坑

- index.html 存在**多个主题块/断点块先后覆盖同一选择器**（canvas 主题覆盖 primer 等，第 6 轮踩坑）。
- 新样式必须**追加到 `</style>` 之前**（最后生效），并加注释 `/* 最后生效，防主题块覆盖 */`；插在中间会被后续主题块覆盖，改了等于没改。
- 修改样式后需跑全量 UI 回归（67 用例）验证，不要只凭肉眼。

### 3.5 测试契约（改动这些会破坏测试）

| 契约 | 值 | 原因 |
|---|---|---|
| primer 字号 | story strong **≥19px**、story p **≥16px**、facts dd **≥16px** | 教学可读性契约，测试锁定；只能结构性压缩（折叠条），不能缩字号 |
| `#studentPathwaySelect` | **21 个 option** | ≤960px 移动端唯一切换器（课程卡隐藏）+ 6 个 spec 约 35 处断言的程序化通路切换 API（含 21-option 硬断言） |
| marker `#student-arrow` | **markerWidth=12** | 第 8 轮曾改 14 被测试拦截回退；这是契约值 |
| 糖酵解主链 | **10 步** | `ui-student-canvas-reading.spec.js` `toHaveCount(10)`（第 5 轮从 7 步改 10 步时同步断言） |
| 学习步骤解析 | 290 步、错误链接 0 | check-student-steps 门禁；19 个说明性步骤按设计不可点击 |

### 3.6 场景热点扩展通路淡化

- `renderSceneHotspots` 给非核心热点加 **`entity-extended`** 类：CSS 默认 `opacity:.38` 淡化，hover/focus/active 恢复。
- **只能淡化，不能隐藏/删除**：5 个场景 100% 由扩展热点构成，隐藏会让这些场景失去全部通路入口。
- 侧栏（`renderSceneScope`）与热点（`renderSceneHotspots`）在核心过滤口径上**刻意不同**——侧栏只列 21 核心，热点淡化保留全部入口。

### 3.7 支路区辅因子白名单与同名去重

- `branchCofactorKeys`：纯能量/氧化还原辅因子白名单（中英文名归一），不进共享中间体区——它们不是代谢中间体，学生读不懂。
- 同教学名多区室实例（ATP@细胞质/ATP@基质）经 `seenBranchKeys` 去重，只保留一个。
- 支路展示上限 `slice(0, 6)`；支路为空时画布 viewBox 折叠（385/275）。
- 修改支路过滤逻辑前先看第 7 轮 `fix-branch-filter.js` 与 `scan-branch-cofactors.js`。

### 3.8 循环线 studentMapLoopPath

- **r=22**（弯折圆角半径）、**arrowGap=13**（终点留白，让箭头完整露在节点外）、循环线默认 marker-end（反应为空时也有箭头）。
- 改循环线几何时**不要动 marker 尺寸**（契约 12）；改后需跑含循环通路的 UI 用例（TCA、尿素循环）。

---

## 4. 遗留事项（未执行）

### 4.1 数据层扩展（2026-08-16 已完成）

| 原缺失项 | 处理 |
|---|---|
| `泛醇@mito-inner-membrane` | 已确认实体本就存在；`glycerol_phosphate.tsv` 末步产物改为 `泛醇@线粒体内膜`，消除解析到氧化型辅酶 Q 的错位 |
| `乙酰乙酰辅酶 A@cytosol` | 已在 `aa_carbon.tsv` 增加「氨基酸 → 乙酰乙酰辅酶 A」入口，并补充学生白话解读 |
| `黄嘌呤` | 已在 `nucleotide_degradation.tsv` 拆出「次黄嘌呤 → 黄嘌呤 → 尿酸」并让鸟嘌呤经黄嘌呤汇入 |

> 新增实体均通过改 `data/*.tsv` 后重编译 `data-compiled.js` 落地；`test:data` + `test:ui` 双门禁验证通过。

### 4.2 口径与文案同步（2026-08-16 已完成）

- **README「55 个场景导航入口」口径**：已改为「20 个场景 / 55 个通路入口，其中 54 个可导航，`transport` 为无场景热点的合并文件」。
- **导读顶部「第 N 课」文案**：`renderStudentPrimer` 已改为输出「通路导读 · 通路名」，不再暴露课程体系口径。
- **页面状态栏「20 个场景层」**：已核实与 `scene-data.js` 的 20 个场景条目一致；静态兜底数字已同步为当前节点/通路数。
- HANDOVER.md / README.md 的统计数字已按本次实测与 `STATS.md` 重写。

### 4.3 再生目录清理约定

- `.playwright-cli/`（当前约 54 项，浏览器自动化每次运行再生）、`output/`（36MB 测试产物）、`test-results/` 会持续再生。
- 建议：扩充 .gitignore（当前只覆盖 5 项）+ 定期清理约定，否则状态回归。

### 4.4 工程债

- **Git 版本控制**：已于 2026-08-16 建立 Git 基线（`git init` + 完善 `.gitignore` + 首次提交稳定版）。
- 413MB 母版资产（archive + source-*）已外移至 `D:/wangjunyi/Documents/cell Metabolism world-assets-backup/`；项目内运行时只保留 `cell-metabolism-assets/optimized/`。
- 第二阶段结构性收敛（SVG 工厂合并、贝塞尔路径生成器收敛、缩放系统 ×3、CSS 同选择器合并）已评估未执行，风险中高，需专项视觉回归；当前已开始准备截图基线与契约常量抽取。

---

## 5. 工作台位置（全量证据）

```
C:\Users\wangjunyi\.openclaw-autoclaw\workspace\.cluster\20260815-cmw-refactor\
├── DELIVERY\代码收敛报告.html      # 八轮改动全量记录（最重要素材）
├── subagent_01.md ~ subagent_10.md # 10 份分析报告（代码审查/功能审稿/CSS 审稿/实施核查/排版诊断/重叠扫描/生化审核/支路审稿等）
├── plan.md / review.md / deletion-plan.md
├── fix-*.js / revert-marker.js 等   # 各轮修复脚本（含锚点与写回方式示范）
├── ui-*.log                        # 各轮 Playwright 测试日志（最后一轮 ui-loopfix-final.log 15:40 67/67）
├── backup-project\                 # 六轮备份 + tests/ + tools/ 全量
└── diag-shots\ / overlap-shots\ / loop-shots\ / style-review\  # 各轮截图证据
```

---

## 6. 回滚方式（backup-project/ 各轮备份清单）

| 备份目录 | 时间 | 对应回滚点 |
|---|---|---|
| `backup-pre-delete\` | 08-15 22:06 | 第 1 轮删除前原始版（index.html 15,111 行）+ 全核心文件 |
| `backup-pre-dedupe\` | 08-15 23:37 | 第 2 轮 CSS 去重前 |
| `backup-pre-legend-fix\` | 08-16 08:02 | 第 3 轮排版修复前 |
| `backup-pre-overlap-fix\` | 08-16 08:43 | 第 4 轮重叠修复前 |
| `backup-pre-biochem\` | 08-16 09:04 | 第 5 轮生化修复前 |
| `backup-pre-style\` | 08-16 11:49 | 第 6 轮样式修复前 |
| `backup-project\tests\`、`backup-project\tools\` | 08-15 21:52 | 测试与工具链原始快照 |

**注意**：第 7、8 轮无独立整轮备份。两轮改动集中于 `renderStudentPathwayMap` 支路过滤与 `studentMapLoopPath` 两个函数，且已被 67/67 全绿验证；如需回滚到第 6 轮状态：用 `backup-pre-style\` 恢复后，重放工作台 `fix-branch-filter.js`、`fix-loop-path.js` + `fix-loop-round2.js` + `revert-marker.js` 即可。

回滚后必须重跑 `npm run test:data` + `npm run test:ui` 双门禁。

---

## 7. 交接判断标准（沿用，本次全部满足）

- 没有重新引入课程、自测、挑战或学习进度 ✓
- 学习模式仍能从专题进入通路，再进入反应详情 ✓
- 专家地图没有隐藏原始细胞器语境 ✓
- 单通路布局问题没有污染全局总览布局 ✓
- `npm run test:data` 与 `npm run test:ui` 全绿 ✓（67/67）
- 新增科学内容有数据来源或明确的待审校状态 ✓

**一句话结论**：21 条核心通路主链已与教科书一致、排版/样式/重叠/支路/循环线八类缺陷已清零，67 个浏览器测试全绿；剩余工作是 3 个实体的数据层扩展、README/HANDOVER 数字口径同步与再生目录清理约定。
