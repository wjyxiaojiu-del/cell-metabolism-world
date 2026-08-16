# 交接文档：专家地图修复当前状态

更新时间：2026-08-11

项目目录：`D:/wangjunyi/Documents/cell Metabolism world/`

本文件取代 2026-08-11 10:29 的专家地图问题快照。旧快照描述的路线无色、聚焦隐藏酶和重复表示边未合并，均已在当前源码中修复，不应继续作为当前缺陷引用。

## 1. 产品范围

- 专家地图只展示 21 条核心通路，另有 1 个“总览”按钮。
- 底层仍保留 55 个通路 TSV，用于完整数据、场景与审校；其余 34 条不会铺到专家导航栏。
- 学习模式仍是小白教学主入口；专家地图是进阶空间总览。
- 名称优先显示中文全称，缩写作为补充。
- GLM / Qoder 只做只读审核，Codex 负责修改与验证。

## 2. 当前数据基线

精确数字以自动生成的 `STATS.md` 为唯一口径。当前编译快照为：

- 55 个 TSV 文件，366 行源数据。
- 298 个实体，337 条编译反应，55 条底层通路。
- 专家导航显示 21 条核心通路，不显示全部 55 条。
- 12 个多参与物反应模块；新增的一组是糖酵解醛缩酶双产物表示。
- 53 条待审校反应。
- 21 条核心通路内待审校 15 条（含 2026-08-11 线路通顺修复新增 6 条简化边）；全库待审校 53 条见 STATS.md

## 3. P0 修复状态

### P0-A 路线颜色：已修复

- `.route` 有统一颜色兜底。
- `buildRoutes()` 从通路元数据写入 `--route-tone`。
- marker 按路线颜色动态生成。
- 21 条核心通路测试会检查活动路线 `stroke !== none`、marker 存在且颜色一致。

### P0-B 聚焦酶标签：已修复

- 总览仍隐藏酶标签，避免全图拥挤。
- 聚焦单通路时只显示当前通路的酶或反应模块标签。
- 测试会检查当前通路至少一个酶标签可见、非当前通路酶标签隐藏。

### P0-C 多参与物表示边：已修复

- 渲染层按稳定反应身份合成 reaction module，不删除用于拓扑表达的 TSV 行。
- 当前共有 12 个模块。
- ANT 的两条交换路线并行直连，不再经过公共模块点形成误导性交叉。
- 糖酵解醛缩酶以一个模块连接 DHAP 和 G3P 两个产物；TPI 保持独立。

### P0-D 测试盲区：已补

`tests/ui-expert-layout.spec.js` 当前覆盖：

- 1 个总览按钮和 21 条核心通路的显示范围。
- 路线颜色、方向 marker、可逆双箭头。
- 当前通路酶标签显示以及非当前酶、非当前路线隐藏。
- 多参与物模块腿数。
- 标签越界和重叠。
- 跨区室拓扑顺序。
- P1 专属结构合同。
- TCA 从柠檬酸依次回到草酰乙酸，再由草酰乙酸回到柠檬酸的闭环合同。

## 4. P1 布局修复状态

- `oxphos`：ATP 合酶和 ANT 可区分；ANT 两条交换线不再形成 X 或无解释三角形。
- `carnitine`：明确 CPT1 → CACT → CPT2 三站式穿梭。
- `urea` / `transamination`：改用只含细胞质、内膜转运和基质的含氮代谢导轨。
- `gluconeogenesis`：细胞质主脊柱、线粒体绕行和内质网终末支路分区显示。
- `glycogenolysis`：胞质主链与“仅肝 / 肾释糖”内质网支路分开。
- `nucleotide_degradation`：从泛化碱基展开为嘌呤、嘧啶分支；虚线明确标注为分类展开而非化学反应。
- `glycolysis`：醛缩酶明确一分为二，TPI 单独连接 DHAP 与 G3P。
- 糖酵解和核苷酸降解使用细胞质聚焦面板，不再伪装成照片中的精确细胞器坐标。

## 5. 统计与审计口径

- `STATS.md` 必须由 `node tools/generate-stats.js --write` 生成。
- 学习步骤分为可交互定位和说明性不可点击两类；不能再写成“269 步全部链接”。
- `data/review-log.tsv` 已记录糖酵解醛缩酶第二产物表示边，明确不重复计为额外反应。
- TSV 行状态和编译后去重反应状态是不同统计口径，报告时必须写明来源。

## 6. 验证命令

```powershell
Set-Location 'D:\wangjunyi\Documents\cell Metabolism world'
npm run test:data
npx playwright test tests/ui-expert-layout.spec.js
npm run test:ui
```

2026-08-11 当前修改完成后的新鲜结果：

- `npm run test:data`：通过。
- `npx playwright test tests/ui-expert-layout.spec.js`：5/5 通过。
- `npm run test:ui`：单次完整运行 61/61 通过，用时约 4.8 分钟（实测 287.4 秒，产物 test-results/results.json）。

此前“全量首次 59/61，两个失败项单独复跑通过”仅是历史中间状态，不能再作为当前验收结论。

## 7. 缓存与部署

- 当前生产缓存查询版本仍为 `20260810-2`。
- `index.html` 使用 no-cache，运行时脚本使用 30 天 immutable 缓存。
- 本地源码已统一提升四个运行脚本版本为 `20260811-1`；部署时直接采用该版本。
- 本轮仅修改本地源码（含版本号），未部署、未触碰生产环境。

## 8. 关键文件

- `index.html`：路线、反应模块、酶标签和聚焦导轨。
- `tools/expert-pathway-layout.js`：单通路专属坐标。
- `tools/expert-map-geometry.js`：跨区室和聚焦面板合同。
- `tools/check-expert-layout.js`：55 条底层布局数据审计。
- `tests/ui-expert-layout.spec.js`：21 条可见核心通路 UI 门禁。
- `tests/ui-expert-navigation.spec.js`：专家导航和手势测试；与布局 spec 是独立文件。
- `data/reactions/*.tsv`：反应源数据。
- `data/review-log.tsv`：科学与数据变更审计台账。
- `STATS.md`：自动生成的当前统计基线。
- `HANDOVER.md`：项目总交接入口。

## 9. 后续边界

- 下一阶段优先人工检查 21 条聚焦通路的视觉质量，不扩充导航数量。
- 继续拆解 53 条待审校反应的科学边界。
- 不删除 `scene-data.js`；学习模式和场景导航仍依赖它。
- 不以静态行号作为长期证据，使用函数名、选择器、测试名和当前运行结果定位。
