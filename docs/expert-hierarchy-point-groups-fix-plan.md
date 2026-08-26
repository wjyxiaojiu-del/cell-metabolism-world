# 专家地图层次与点位组修正方案

> 版本 2026-08-26 · grill-with-docs 会议结论沉淀 · 目标：让知识点更清楚，不做教学包装

## 1. 问题陈述

当前专家地图两套层次混用：生物学容纳树（`scene-data.js parent` 链）与教学四层（`data-scene-level 3/4`）通过 `pathway.scene` 硬关联，导致：
- 第1层 `cell-atlas` 同时出现 8 个结构热点与 2 个通路捷径热点（`gluconeogenesis`, `glycogenolysis`），用户无法区分“在哪里”与“学什么”；
- `mitochondria-inner-membrane` 7 个通路热点纵向扎堆，`carnitine / etc / oxphos` 挤压，CACT 等载体标签易压线；
- 场景热点组与通路节点组未分离：全景时节点与热点共同渲染，信息过载。

## 2. 目标与非目标

**目标**：专家地图以生物学容纳为唯一层次，点位按区室分簇、簇内按通路分 lane，跨膜必有转运标注，达到科学正确 > 视觉可读。

**非目标**：不动学生模式、不改 `data/reactions/*.tsv` 科学数据、不重做底图插画；33 条扩展通路仅归类、不细调节点坐标。

## 3. 术语（以 `CONTEXT.md` 为准）

- **场景**：生物学容纳的取景框树，`cell-atlas → organelle → subcompartment`。
- **场景热点组**：同一场景内负责空间导航的热点集合，`{x,y,target|pathway}`，按区室/膜侧分散，悬停展开长标签。
- **通路节点组**：聚焦态下同一通路的节点+反应边集合，先分区室大簇再分 lane，跨区室必带载体。

## 4. 设计决策

| 决策 | 内容 | 依据 |
|---|---|---|
| D1 层次真相 | 生物学容纳为唯一导航真相，教学层不进入专家地图 | ADR 0002 |
| D2 点位分组 | A+B 双分组：区室大簇 + 通路 lane；跨膜在膜带上断开 | `expertRegionFor` + `expert-map-geometry` |
| D3 第1层纯结构 | `cell-atlas` 移除 2 个通路热点，仅留 8 结构热点 | Q6/Q9 |
| D4 热点分散 | 同场景热点欧氏距离 ≥7.5（0-100 归一），内膜 7 热点分两排 | Q12 门禁B |
| D5 节点聚焦 | 列距 ≥18、纵距 ≥12、标签避让 9、`cx∈[4,96]`、转运必标注 | Q8/Q11 |
| D6 编码 | 色按 `pathwayMeta.tone` + 文字短名，悬停展开全名 | Q10 |

实现边界：`pathway.scene` 继续作为学生模式和原始数据归属；专家模式使用可选的
`expertEntryScene` / `expertMechanismScene`。前者是通路进入专家地图时的最小容纳场景，后者是
聚焦态实际渲染节点组的场景。未声明时回退到 `pathway.scene`。这样不会把专家导航规则反向写入学生模式。

## 5. 现状门禁（已通过）

```
node tools/check-expert-layout.js  → 21/21 PASS（节点几何、区室正确、间距）
node tools/check-cross-consistency.js → 场景20 / 通路55 / 实体306 / 反应343 一致
```

新增门禁（待实现）：

- **G1**：`cell-atlas.hotspots.filter(h=>h.pathway).length === 0`
- **G2**：源数据中同一场景所有热点两两距离 ≥7.5；`mitochondria-inner-membrane` 中 pathway 热点 `y<55` 与 `y≥65` 各 ≥3 个
- **G3**：同一物质跨不同区室的反应必须有非空酶/载体字段

## 6. 改动清单

### 6.1 `scene-data.js`

- `cell-atlas.hotspots` 删除 `{pathway:'gluconeogenesis',x:41,y:43}` 与 `{pathway:'glycogenolysis',x:43,y:54}`，仅保留 8 个 `target` 结构热点 + `plant-extension`；根场景运行时也不生成通路 lane。
- `mitochondria-inner-membrane.hotspots` 7 个通路热点重排为两排：
  - 上排 `y 38-45`：`pyrimidine(89,27)` 保持，`etc(38,43)` `oxphos(73,45)` 居中
  - 下排 `y 70-77`：`malate_aspartate(22,70)` `glycerol_phosphate(38,74)` `carnitine(56,77)` `atp_transport(77,72)`
  - 保证两排垂直间距 ≥18，水平最小间距 ≥12。
- 扩展通路中错挂的通路热点归位到最小容纳场景（例：`pyrimidine` 主场景保持内膜，但胞质侧分支点归 `cytosol`）。

### 6.2 `tools/expert-pathway-layout.js`

- 保持 `firstSeenOrder / weakComponents / orderedCycle` 不变，收紧 `topologicalLevels` 列距 18、纵距 12、避让 9 的常量显式化。
- 强化跨膜转运校验：若反应为 `转运反应`（两端同物质异区室）则必须带酶标签，否则布局抛出 warning 并计入门禁。

### 6.3 `tools/check-expert-layout.js`

- 新增 G1/G2 校验，失败时打印热点对距离与场景名，退出码 1。
- 保留 21 条核心通路的 `cx 4-96` 与最小间距校验。

### 6.4 `index.html`

- 热点渲染：`subcompartment` 已有小圆点+悬停标签样式（`data-label`）复用到 `mitochondria-inner-membrane`，不再平铺长标签。
- 聚焦态节点组仅在 `pathway-focus` 时可见，非聚焦态 `entity.secondary` 保持 `visibility:hidden`（现行 `ui-expert-navigation` 已测）。

### 6.5 测试

- 新增 `tests/ui-expert-hierarchy.spec.js`：G1/G2 断言 + 内膜两排分布快照。
- 存量 72 条回归全量通过，截图比对 `output/playwright/ui-feature-expert-nav-desktop.png` 与 `mito-inner-membrane` 区域。

## 7. 实施切片（Tickets）

| Ticket | 标题 | 验收 |
|---|---|---|
| T1 | `scene-data.js` 第1层纯结构化 | `cell-atlas` 无 `pathway` 热点；`npm run test:data` 仍 21/21 PASS |
| T2 | 内膜热点两排重排 | G2 通过；Playwright `mito-inner-membrane` 热点距离 ≥7.5 |
| T3 | 节点组跨膜转运显式化 | `carnitine` 三点 `CPT1/CACT/CPT2` 横向递增且带标签；`oxphos` 锚点 `cx≤96` |
| T4 | 门禁与回归锁 | `check-expert-layout` 新增 G1/G2；`ui-expert-hierarchy` 通过；全量 72+1 通过 |

依赖：T1 → T2 → T3 → T4 串行；T2 与扩展通路归位可并行。

## 8. 验证步骤

```bash
node tools/validate.js
node tools/compile.js --check
node tools/check-expert-layout.js   # 含新增 G1/G2
npm run test:data
npx playwright test tests/ui-expert-hierarchy.spec.js
npx playwright test                 # 72+1 全量
node tools/generate-stats.js --check
```

## 9. 风险与回滚

- 风险：移除第1层通路捷径后，老用户寻路多一步。缓解：`pathbar` 通路索引仍在，专家地图首页保留“按细胞器进入”提示。
- 回滚：`scene-data.js` 的热点数组为纯数据，回滚只需还原提交；节点布局无数据迁移。

## 10. 附录：会议问答

Q1-Q5 已按推荐接受（教学四层不做、点位=热点组+节点组、科学正确>可读、两反例、仅动专家 21 条核心）。
Q6-Q9 按推荐接受（层次=生物学容纳、第1层纯结构、双分组、3条门禁+转运显式、两反例修正）。
Q10-Q12 按推荐接受（色+文字双编码、列距18/纵距12/cx4-96、新增 G1/G2 门禁）。

关联：`CONTEXT.md`、`docs/adr/0002-expert-hierarchy-is-biological-containment.md`、`scene-data.js:62-356`。
