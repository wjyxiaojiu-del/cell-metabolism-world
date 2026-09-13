# Cell Metabolism World

细胞代谢世界地图：交互式代谢通路可视化系统。节点按细胞区室摆放，反应按生化方向连接，通路按组筛选。

## 快速开始

```bash
# 1. 编译数据（从 TSV 转录生成 data-compiled.js）
node tools/compile.js

# 2. 打开 index.html
# 安装测试依赖并启动唯一的本地预览入口：
npm install
npm run preview
# 访问 http://127.0.0.1:8000
```

编译后的 `data-compiled.js` 包含 310 个实体、344 条内容保留式去重反应、55 个 TSV 通路组和参与物跨通路目录。统计数据以 `STATS.md` 为准，数据变化后运行 `npm run stats` 同步。`scene-data.js` 提供 55 个场景导航入口和场景元数据，是学习模式与场景跳转的运行时依赖，当前不能删除。

## 数据来源

- **PDF 手绘图**：79 MB，~456 个标注节点，亮亮手绘
- **已转录**：54 条规范场景通路；另保留并接入 1 个历史合并入口 `transport.tsv`
- **待转录**：0 条；后续工作转为逐反应审校、坐标微调和数据统一

## 目录结构

```
data/
  compartments.tsv           # 20 个叶区室 + 83 种同义词
  compartment-geometry.tsv   # 每个区室的椭圆边界（cx, cy, rx, ry）
  layout-overrides.tsv       # 手工坐标覆盖（47 个）
  reactions/*.tsv            # 54 个场景通路文件 + transport 合并文件
  nodes/*.tsv                # 节点补充属性（膜侧、别名、物种等）

tools/
  validate.js                # 转录校验器（区室枚举、酶误入底物列、重复反应）
  selftest.js                # 校验器的自测（确认它不会永远说"无错误"）
  layout.js                  # 按区室计算坐标（环形/开链/膜带三种策略）
  expert-map-geometry.js     # 与当前细胞底图对齐的区室轨道和细胞器排除区
  expert-pathway-layout.js   # 专家地图单通路专属布局（区室内分散、标签避让）
  compile.js                 # TSV → data-compiled.js
  check-cross-consistency.js # 端点、通路、学习入口与场景引用交叉核对
  check-expert-layout.js     # 21 条核心通路节点越界与过密门禁
  reaction-participants.js   # 保守解析反应式参与物，不创建主图连边
  reaction-identity.js       # 完整反应身份，避免同端点记录互相覆盖
  suggest-citations.js       # 机器比对 KEGG/术语表，为未引用行生成证据（需网络）
  review-helper.js           # 生成待审校清单与进度台账（默认只读）
  check-citations.js         # 引用格式与官方接口在线核验
  export-svg-reactions.js    # 从 SVG 层导出已核对的反应（默认只预览）
  import-svg-coords.js       # 从 SVG 层导入手摆坐标（默认只预览）
  tsv.js                     # TSV 解析器（所有工具共用）

docs/
  transcription.md           # 转录格式说明（底物/产物/酶/可逆/反应式）
  scientific-review-policy.md # 审校状态、表示类型与证据门禁
  adr/0001-*.md              # 架构决策记录

index.html                   # 主页面（学习模式、专家地图和场景跳转）
.github/workflows/ci.yml     # CI：push 时跑数据门禁与 UI 回归
scene-data.js                # 55 个通路入口与场景导航元数据（运行时依赖）
data-compiled.js             # 编译输出（由 compile.js 生成，不要手改）
CONTEXT.md                   # 术语表（16 个关键概念）
```

## 工作流程

### 1. 转录新通路

在 `data/reactions/` 下新建 TSV 文件，参照 `glycolysis.tsv` 的格式：

```tsv
#	通路: 磷酸戊糖途径	Pentose phosphate pathway
#	默认区室: 细胞质
#	来源: PDF 左中磷酸戊糖区
底物	产物	酶	可逆	反应式	审校	备注
葡萄糖-6-磷酸	6-磷酸葡糖酸内酯	葡萄糖-6-磷酸脱氢酶	否	G6P + NADP⁺ → 6-P-葡糖酸内酯 + NADPH	待审校	限速步
```

详细规则见 `docs/transcription.md`。关键点：

- **底物/产物**必填，其余可留空
- **区室**默认整个文件一致，跨区室反应才需要标 `@区室`
- **酶**是催化者，不是节点；例外是电子/质子穿过的载体复合体
- **反应式参与物**会被编译为可查询数据，但不会自动增加主图节点和连线
- **汇聚边**：环形通路的双底物反应要写两行（主链一行，入口一行），否则拓扑断开

### 2. 校验

```bash
node tools/validate.js
```

输出三档：

- **错误**（退出码 1）：区室不存在、酶填进了底物列、可逆列写错、重复反应
- **提醒**：酶为空、跨文件同一反应酶名不一致
- **等待转录**：进度指示，某节点有坐标/属性但无反应引用

校验器自己有自测：

```bash
node tools/selftest.js
```

### 3. 布局检查

```bash
node tools/layout.js
```

显示每个区室的拓扑：环形/开链/膜带，以及链尾数量。环形通路显示「开链」说明汇聚边漏了。

### 4. 编译

```bash
node tools/compile.js
```

输出 `data-compiled.js`，包含：

- `entities`：节点数组（id, name, x, y, compartment, kind, group, meta）
- `reactions`：反应数组（id, from, to, enzyme, equation, review, participants, group）
- `pathwayMeta`：通路元数据（label, english, tone, compartment）
- `participantCatalog`：ATP、NADH、共同底物/产物等参与物的跨通路场景目录

### 5. 查看效果

刷新 `index.html`。新通路的筛选按钮自动出现，节点自动摆放在对应区室内。

学习模式默认提供 5 张专题全景图：生物氧化、糖代谢、脂代谢、氨基酸与氮、核苷酸代谢，共 21 条核心课程路线。零基础用户会先看到每条路线的“解决什么问题、输入、输出、区室、用途和三个关键词”，再进入主线画布和反应详情。植物特异、膜脂细分、自噬、溶酶体、糖基化等扩展通路仍保留在源数据和编译层，但不再铺满学生目录、专家筛选器或细胞器范围。每张专题图把同一共享中间体合并为真实交点；点击通路泳道或节点可继续进入单条核心路线。反应详情里的 ATP、NADH、Pi 等参与物可以直接点击：页面会列出该物质出现的其他代谢场景；搜索框的通路搜索也只引导到这 21 条核心路线。

## 坐标规则

- **手工覆盖优先**：`data/layout-overrides.tsv` 里的坐标永久生效
- **自动计算兜底**：未覆盖的节点由算法在区室椭圆范围内计算
  - 环形：沿椭圆 62% 半径均匀分布，顺时针
  - 开链：沿椭圆主对角线铺开（左上 → 右下）
  - 膜带：按链序排主轴，膜侧决定垂直偏移

手摆坐标可以随时调整：编辑 `layout-overrides.tsv`，重新编译即可。

## 节点主键

`名称@区室` 的复合 ID，自动生成。同一物质在同一区室里只有一个节点，无论它参与多少条通路。同一物质跨两个区室则是两个节点，PRD §6.2 要求的 PortalLink 因此不需要单独实现。

被否决的方案：人工短 ID（`glucose`、`nadh_c`）。理由见 `docs/adr/0001-node-identity-is-name-at-compartment.md`。

## 已知限制

- PDF 的 456 个节点里已有 310 个进入结构化数据（约 68%）
- `scene-data.js` 与 TSV 数据尚未统一生成；在场景元数据迁移完成且 `index.html` 不再加载它之前不能删除
- 植物特异通路（淀粉、氮同化、乙醛酸循环）需要填 `物种=植物`，见转录指南
- 容器区室（`线粒体`、`内质网`）需要消歧到叶区室，19 处已有猜测待核对

## 测试

```bash
# 数据门禁
npm run test:data

# 浏览器回归；Playwright 会自动启动 127.0.0.1:8000
npm run test:ui

# 完整验证
npm test
```

所有门禁都应该退出 0。推送前可启用本地快速门禁：`git config core.hooksPath hooks`（pre-push 跑 validate + compile --check）。CI 在每次 push/PR 时自动执行 `npm run test:data` 与完整 UI 回归。`node tools/check-expert-layout.js` 会逐条检查 21 条核心通路的专属坐标是否完整、端点区室集合是否符合核心通路合同、是否落在与当前细胞照片对齐的安全区域，以及节点间距是否安全；胞质节点覆盖核、内质网、线粒体、高尔基体或中心体会直接失败。补充的只读审校检查可运行 `node tools/review-helper.js`、`node tools/check-citations.js`、`node tools/export-svg-reactions.js` 和 `node tools/import-svg-coords.js`。联网时另运行 `node tools/check-citations.js --online`。TSV 修改后使用 `node tools/compile.js` 更新生成文件；只有执行明确的数据迁移时才使用 `export-svg-reactions.js --write` 或 `import-svg-coords.js --write`，覆盖反应文件还必须同时提供 `--force`。

当前工程和数据统计由 `STATS.md` 提供。数据或测试数量变化后运行 `npm run stats`，完整门禁会检查该文件是否同步。

## 场景图片

原始 PNG 保留在 `cell-metabolism-assets/`，页面只加载 `cell-metabolism-assets/optimized/` 中的 WebP。重新生成运行时图片：

```bash
python -m pip install -r requirements-assets.txt
npm run assets:optimize
npm run assets:check
```

压缩脚本不会覆盖原图；默认最大边 2400px、WebP 质量 84。

## 参考

- **PRD**：`docs/superpowers/specs/2026-08-04-cell-metabolism-world-map-prd.md`
- **转录格式**：`docs/transcription.md`（234 行，包含容器消歧表）
- **术语表**：`CONTEXT.md`（16 个概念：节点、反应、区室、汇聚边、主链等）
- **架构决策**：`docs/adr/`

---

**现状**：54 条规范场景通路已全部进入 TSV，历史合并通路 `transport` 也已接入场景导航；55 个文件编译为 344 条反应和 310 个实体。368 行的状态分布为 60 行已核对、308 行已终审、0 行待审校。当前 292 行带机器可识别引用（含 241 行已终审），其余为类别映射、多步净反应或机制未明行，按证据政策另选 Reactome/文献证据。逐项结论见 `data/review-log.tsv`，当前进度见 `REVIEW_PROGRESS.md`。编译结果另含 294 个唯一反应参与物，其中 106 个可跨通路查询。
