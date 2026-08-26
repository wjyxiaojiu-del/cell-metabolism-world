# 0002 专家地图层次以生物学容纳关系为唯一真相

日期: 2026-08-26
状态: 已接受

## 背景

专家地图同时存在两套层次：
- 生物学容纳树：`cell-atlas → mitochondria → mitochondria-matrix / mitochondria-inner-membrane` 等，由 `scene-data.js:62` 的 `parent` 链定义。
- 教学四层导航：第1层总览 → 第2层通路索引 → 第3层机制图 → 第4层单步详情，由 `index.html` 的 `data-scene-level` 与 `pathbar` 驱动。

两套层次通过 `pathway.scene` 与 `hotspots[].pathway / target` 硬关联，导致同一通路在多个空间节点重复挂载，且 `cell-atlas` 在第1层同时出现结构热点与通路捷径热点，导航语义混淆。`tools/check-expert-layout.js` 仅校验节点几何，不校验热点归属。

## 决策

1. **生物学容纳为导航真相，教学层不进入专家地图**。专家地图只保留 `场景 → 场景` 的容纳导航；通路是贴在反应上的标签，通过热点进入其所属的最小容纳场景后，再以聚焦态展示通路节点组。
2. **热点组与节点组分离**：
   - 场景热点组：只负责空间导航，同一场景内热点按区室/膜侧分散，标签悬停展开。
   - 通路节点组：聚焦态才可见，先按 `expertRegionFor(compartment)` 分区室大簇，簇内按反应顺序排 lane，跨区室边必须带转运标注。
3. **第1层纯结构**：`cell-atlas` 仅保留 8 个结构热点，移除 `gluconeogenesis / glycogenolysis` 2 个通路捷径热点；通路从其所属亚区室进入。

## 后果

- `cell-atlas.hotspots` 中 `pathway` 类型数量必须为 0，需新增门禁。
- `mitochondria-inner-membrane` 的 7 个通路热点需按膜侧分两排，热点间距 ≥7.5（归一坐标）。
- 聚焦态节点列距 ≥18、纵距 ≥12、`cx∈[4,96]`，否则 `check-expert-layout.js` 失败。
- 扩展通路（33条）本次仅归类到正确容纳场景，不细调坐标；21条核心通路需全 PASS。

## 备选

- 保留教学四层并与生物树并存：被否，语义双真相导致热点重复挂载与测试脆弱。
- 按通路成组不分区室：被否，跨膜转运无法在图上找到锚点，且与区室范围约束冲突。

## 关联

- `CONTEXT.md` 新增术语：`场景 / 场景热点组 / 通路节点组`
- `scene-data.js`、`tools/expert-pathway-layout.js`、`tools/check-expert-layout.js`
- `docs/expert-hierarchy-point-groups-fix-plan.md`
