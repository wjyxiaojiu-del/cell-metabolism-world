# 交接文档：细胞代谢地图转录系统

## 最新进度（2026-08-18）

- 将 `data/reactions/membrane_transport.tsv` 原先把“脂肪酸跨膜摄取 + ACSL 活化”合并的一条边拆为两条：跨膜摄取保留多机制表述并补入 `PMID:36722264`；胞质 ACSL 活化补齐 AMP、PPi，并加入 `RHEA:15421`、`R-HSA-434382`。
- 两条记录均提升为 `已终审`，审计台账同步到 `data/review-log.tsv`；待审校从 47 条降为 46 条。
- 重新编译后当前基线为 349 行、291 个实体、324 条反应、253 条已终审、46 条待审校；`STATS.md` 已更新。
- 学习模式的呼吸链与氧化磷酸化入门图恢复为之前生成的蓝白全视图 `27-etc-electron-transport-full.webp`（源文件为下载目录中的 `生化_电子传递链全貌图.png`）；主题结构卡片和通路入门卡均覆盖，回归断言已同步。
- 丙酮酸脱氢酶已换为专属、可科学校对的蓝白矢量机制图 `39-pdh-complex-mechanism.svg`，明确显示 E1/E2/E3、TPP、硫辛酰胺、CoA、FAD、NAD⁺、总反应和磷酸化调控；学习模式的专题卡、入门卡、通路图和专家场景均已接入。
- 专家导航采用“通路图片 → 所属细胞器 → 区室线路”：桌面与触屏均可单击图片入口进入；场景把“通路机制图”和“细胞器结构图”分开，机制图完整显示且不叠加结构热点，进入时先看图和线路，点线路后再打开详情。
- 21 条核心通路现已全部登记明确的专家视觉元数据；区室线路卡片新增图片缩略图，点击线路时会同步更新场景背景、线路高亮和右侧详情，不再出现“详情已换路但图片仍停在上一条”的错位。
- 学习模式与专家场景新增通路大图查看器，支持鼠标/触屏点击、键盘 Enter 打开、Escape 关闭。
- 运行时脚本版本统一提升为 `20260818-3`，避免浏览器缓存旧资源。
- 验证结果：81 个唯一引用在线核验全部通过；`npm run test:data` 通过；Playwright 54/54 通过；21/21 条专家核心通路图片均能成功加载。

## 当前进度（截至 2026-08-08）

当前统计以 `STATS.md` 为唯一口径；历史审核文档中的数字只代表审核当日快照。

### ✅ 已完成

**1. 数据模型与工具链**
- TSV 转录格式（7列：底物、产物、酶、可逆、反应式、审校、备注）
- 20 个叶区室 + 83 种同义词映射（`data/compartments.tsv`）
- 核心工具：
  - `validate.js` — 校验器（区室、酶误入底物列、重复反应）
  - `selftest.js` — 校验器自测
  - `layout.js` — 坐标计算（环形/开链/膜带三种策略）
  - `compile.js` — TSV → `data-compiled.js`，支持 `--check` 只读核对
  - `check-cross-consistency.js` — 交叉核对端点、通路、学习入口与场景引用
  - `export-svg-reactions.js` — SVG → TSV，默认只预览，写入需 `--write`
  - `import-svg-coords.js` — SVG → `layout-overrides.tsv`，默认只预览，写入需 `--write`
  - `review-helper.js` — 生成待审校清单并保留已完成审计记录，默认只读，写台账需 `--write`
  - `check-citations.js` — 检查引用格式；`--online` 通过官方接口核验 ID
- 节点主键：`名称@区室` 自动生成，无需人工编 ID
- 手工坐标 47 个，自动布局兜底

**2. 已转录通路（54 条规范场景通路 + 1 个合并导航入口，55 个 TSV 文件，323 条编译反应）**
```
glycolysis.tsv    10 条    糖酵解
tca.tsv           9 条     三羧酸循环
etc.tsv           15 条    氧化磷酸化
pdh.tsv           1 条     丙酮酸脱氢酶
transport.tsv     15 条    跨膜转运
ppp.tsv           8 条     磷酸戊糖途径（已终审）
gluconeogenesis.tsv 22 条  糖异生（已终审）
glycogenesis.tsv  4 条     糖原合成（已终审）
glycogenolysis.tsv 5 条    糖原分解（已终审）
fructose.tsv      4 条     果糖代谢（已终审）
galactose.tsv     4 条     半乳糖代谢（已终审）
polyol.tsv        2 条     多元醇途径（已终审）
pyruvate_fates.tsv 6 条   丙酮酸去路（已终审）
transamination.tsv 4 条   转氨与氧化脱氨（部分终审）
glutamate_glutamine.tsv 6 条 谷氨酸–谷氨酰胺枢纽（已终审）
malate_aspartate.tsv 7 条 苹果酸–天冬氨酸穿梭（已终审）
glycerol_phosphate.tsv 3 条 甘油-3-磷酸穿梭（已终审）
carnitine.tsv      3 条     肉碱穿梭（已终审）
beta_oxidation.tsv 4 条     脂肪酸 β-氧化（已终审）
vlcfa.tsv          5 条     极长链脂肪酸氧化（部分终审）
ketone.tsv         7 条     酮体生成与利用（已终审）
```

本轮随后补齐的 34 个场景文件为：`starch.tsv`、`uronic.tsv`、`glyoxylate.tsv`、`oxphos.tsv`、`atp_transport.tsv`、`lipoprotein.tsv`、`fa_synthesis.tsv`、`fa_elongation.tsv`、`tag.tsv`、`phospholipid.tsv`、`sphingolipid.tsv`、`cholesterol.tsv`、`steroid_bile.tsv`、`plasmalogen.tsv`、`urea.tsv`、`bcaa.tsv`、`aromatic_aa.tsv`、`serine_glycine.tsv`、`methionine_cysteine.tsv`、`aa_carbon.tsv`、`aa_biosynthesis.tsv`、`nitrogen.tsv`、`sulfur.tsv`、`purine.tsv`、`pyrimidine.tsv`、`salvage.tsv`、`nucleotide_degradation.tsv`、`folate.tsv`、`heme.tsv`、`glutathione.tsv`、`glycosylation.tsv`、`lysosomal.tsv`、`autophagy.tsv`、`membrane_transport.tsv`。`transport.tsv` 保留为原有跨膜合并文件。

**3. 文档**
- `README.md` — 快速开始、目录结构、工作流程
- `docs/transcription.md` — 282 行转录格式说明（含 19 处容器消歧表）
- `CONTEXT.md` — 16 个术语（节点、反应、汇聚边、主链等）
- `docs/adr/0001-node-identity-is-name-at-compartment.md` — 主键设计决策

**4. 修复的缺陷**
- 英文名丢失（`readTsv` 只保留第一个制表符字段）→ 已修复，`metaFields` 保留完整字段
- 物种/组织字段死掉（只读节点文件，不读反应文件头）→ 已修复，反应文件头的物种/组织作为节点默认值
- `readTsv` 两份拷贝（validate.js 和 layout.js）→ 已统一到 `tools/tsv.js`
- `lit()` 锚点断裂（index.html 改成 let，工具还找 const）→ 已修复，三种声明都认
- 封面隐藏区仍可被 Tab 聚焦 → 封面与应用主体分离，并同步使用 `inert` / `aria-hidden`
- 同端点反应静默覆盖科学字段 → 仅完整反应身份相同时合并，6 组内容变体分别保留
- ATP 合酶端点落在错误区室 → H⁺ 明确到膜间隙，ATP 明确到线粒体基质
- 导入/导出工具默认写源数据 → 默认改为只读预览，写入必须显式 `--write`
- `transport` 缺少场景入口 → 已接入线粒体内膜场景，筛选双击和学习模式均可导航
- 可逆字段与反应式箭头漂移 → 修正 6 行并加入校验器门禁
- 页面视觉已更新：整体为 `rev.11 蓝色实验图谱`，学习模式进一步升级为 `rev.12 微光学习界面`，使用冷白留白、暖黄光束、冰蓝环境光和悬浮玻璃层；左侧通路分类色保持不变

**5. 测试**
- 核心工具链验证通过；当前 78 个唯一引用通过官方接口在线核验，无效 0、接口未完成 0
- 临时通路测试通过（质体里的淀粉合成，4 个节点自动摆放）
- 浏览器资源验证通过（当前编译数据为 291 节点、323 条反应、55 个通路；默认界面只开放 21 条核心学习通路）
- 14 个 Playwright spec、47 个浏览器测试通过；覆盖桌面、平板、手机、步骤链接、平板全屏/双指手势和专家地图坏数据防御
- 场景图已生成 WebP/SVG 运行时版本；原始 PNG 约 335MB，当前运行时图片数量与体积以 `STATS.md` 自动统计为准

---

## 🟡 审校与收尾工作

### 核心任务：全部通路已进入 TSV（已完成）

**来源**：54 条规范场景通路现已全部对应 TSV；原先的 3 条占位入口也已补入 provisional 反应。按原有效通路口径为 **51 / 51**，另有 3 条场景扩展入口；历史合并文件 `transport.tsv` 已作为第 55 个导航入口接入 `scene-data.js`。当前状态分布为 50 行「已核对」、251 行「已终审」、47 行「待审校」。其中 26 条已终审记录带机器可识别引用；历史状态标签不等于已满足当前证据门禁。

**本轮审校结果**：原 58 行队列已逐行复核，累计 11 行有足够数据库依据并提升为已终审，47 行因抽象类别、多步合并、区室冲突或转运机制未定而保留待审校。第三轮已修复 BVRA 与 DHODH 两处区室冲突；本轮又关闭 IDL 颗粒重塑与 UDP-葡萄糖醛酸水解两条，剩余建议分类为区室机制 20、抽象类别 14、多步合并 9、细胞事件 4。完整台账见 `data/review-log.tsv`。

**后续审校顺序**（见 `docs/transcription.md` § 建议的转录顺序）：
1. 先复核熟悉的糖代谢与磷酸戊糖途径
2. 再复核跨区室通路的 `@区室` 和转运边
3. 最后复核植物特异通路的 `物种=植物` 与区室

**容器消歧**：19 处区室写成了容器（`线粒体` / `内质网` / `内膜`），我按酶定位填了猜测，标记 `待审校`，转录时顺手核对。完整表格在 `docs/transcription.md` § 19 处容器消歧。

**环形通路注意**：乙醛酸循环、苹果酸–天冬氨酸穿梭、酮体、尿素循环、蛋氨酸循环均已录入，但仍需审校汇聚边（双底物反应写两行）。`tools/layout.js` 的总图拓扑不能替代逐通路审校。

### 次要任务

**1. 更新 PRD**
`docs/superpowers/specs/2026-08-04-cell-metabolism-world-map-prd.md` 里有 6 处过时说法：

```
75:  SceneNode / SceneEdge       → 实际用 entities / reactions
78:  PortalLink                  → 已被 名称@区室 主键自动实现，不需要单独字段
86:  首版采用人工策划坐标         → 实际是手工优先 + 自动兜底
133: 首版只加载三条通路           → 54 条场景通路均已进入 TSV，51 条有效通路完成
170: 使用 PortalLink 关联        → 同上，已自动实现
```

可以在 PRD 末尾加一节「实际实现与 PRD 的差异」，保留 PRD 原文，记录实际选择和理由。

**2. 统一场景元数据（长期）**
目前两套数据各自承担不同运行时职责：
- `scene-data.js`：55 个通路入口、场景层级、图片和导航热点
- `data/reactions/*.tsv`：55 个 TSV 文件、323 条编译反应，有酶名、可逆性和反应式

长期可以把场景元数据纳入结构化生成流程，但在 `index.html` 不再加载 `scene-data.js`、学习模式和场景跳转完成迁移测试之前，**不得删除该文件**。

**3. 搜索（已实现）**
`index.html` 的 `searchAndFocus` 已支持通路中英文名、节点名、参与物、酶名和反应式，不再列为待开发任务。

**4. 坐标微调**
专家地图现在有两层坐标：全景总览继续使用 `layout.js` 与 47 个手工覆盖；选中核心通路后使用 `expert-pathway-layout.js` 生成的通路专属坐标，照片对齐的区室轨道和胞质细胞器排除区集中在 `expert-map-geometry.js`。修改后必须运行 `node tools/check-expert-layout.js`，确保 21 条核心通路满足端点区室合同、没有压到错误细胞器且节点不过密。呼吸链、糖酵解、糖异生、磷酸戊糖途径、嘌呤和嘧啶等策划锚点在布局文件内维护，不应再通过全局 `layout-overrides.tsv` 修补单通路显示。

---

## 📁 关键文件索引

### 数据文件
```
data/compartments.tsv           # 20 叶区室 + 83 同义词
data/compartment-geometry.tsv   # 区室椭圆边界（cx, cy, rx, ry）
data/layout-overrides.tsv       # 47 个手工坐标
data/reactions/*.tsv            # 54 个场景通路文件 + transport 合并文件
data/nodes/*.tsv                # 节点补充属性（膜侧、别名、物种等）
data-compiled.js                # 编译输出（由 compile.js 生成）
```

### 工具文件
```
tools/validate.js               # 转录校验器
tools/selftest.js               # 校验器自测
tools/layout.js                 # 坐标计算
tools/expert-map-geometry.js    # 专家图照片区室轨道与排除区
tools/expert-pathway-layout.js  # 专家地图单通路专属坐标
tools/compile.js                # TSV → data-compiled.js
tools/check-cross-consistency.js # 运行时数据与全图引用交叉核对
tools/check-expert-layout.js    # 21 条核心通路几何门禁
tools/export-svg-reactions.js   # SVG → TSV
tools/import-svg-coords.js      # SVG → layout-overrides.tsv
tools/review-helper.js          # 待审校台账与进度生成
tools/check-citations.js        # 引用格式和官方接口核验
tools/tsv.js                    # TSV 解析器（所有工具共用）
```

### 文档文件
```
README.md                       # 快速开始、目录结构、工作流程
CONTEXT.md                      # 16 个术语表
docs/transcription.md           # 282 行转录格式说明
docs/scientific-review-policy.md # 审校状态、表示类型与证据门禁
REVIEW_PROGRESS.md              # 自动生成的当前审校进度
docs/adr/0001-*.md              # 架构决策记录
docs/superpowers/specs/*.md     # PRD
```

### 页面文件
```
index.html                      # 主页面（学习模式、专家地图和场景导航）
scene-data.js                   # 55 个通路入口与场景导航元数据（运行时依赖）
student-step-resolver.js        # 学习步骤到实体/酶/过程的共享解析器
STATS.md                        # 工具自动生成的当前项目基线
package.json                    # 统一预览与测试入口
```

---

## 🛠️ 工作流程速查

### 转录新通路
1. 在 `data/reactions/` 下新建 TSV 文件，参照 `glycolysis.tsv`
2. 跑校验：`node tools/validate.js`
3. 检查拓扑：`node tools/layout.js`（环形通路显示「开链」说明汇聚边漏了）
4. 编译：`node tools/compile.js`
5. 刷新浏览器看效果

### 调试坐标
1. 先判断问题属于“重点总览”还是“选中单通路”。
2. 总览坐标才编辑 `data/layout-overrides.tsv`；单通路布局修改 `tools/expert-pathway-layout.js`。
3. 重新编译：`node tools/compile.js`
4. 运行：`node tools/check-expert-layout.js`
5. 刷新浏览器并切换相应通路复核。

### 只读全流程验证
```bash
node tools/validate.js && \
node tools/selftest.js && \
node tools/layout.js && \
node tools/compile.js --check && \
node tools/check-cross-consistency.js && \
node tools/check-expert-layout.js && \
node tools/review-helper.js && \
node tools/check-citations.js && \
node tools/export-svg-reactions.js && \
node tools/import-svg-coords.js
```
十项只读检查都应该退出 0，且不会改写 TSV 或 `layout-overrides.tsv`。联网时另运行 `node tools/check-citations.js --online`。需要更新生成文件时单独运行 `node tools/compile.js`；导出反应或导入坐标必须显式加 `--write`，覆盖反应文件还要加 `--force`。

### 生产缓存与发布

- 生产站点：`https://cell.xiaojiu.pw`；Nginx 配置源文件为 `deploy/nginx-cell.xiaojiu.pw.conf`。
- `index.html` 使用 `no-cache`；JS、图片和字体使用 30 天 immutable 缓存，文本资源启用 gzip。
- `scene-data.js`、`data-compiled.js`、`student-step-resolver.js` 共用同一个 `?v=` 版本。任一运行时脚本内容改变时，必须同时提升三处版本号后再发布。
- 发布采用 `/var/www/cell.xiaojiu.pw/releases/<UTC时间>/` 与 `current` 软链接原子切换；切换前校验哈希、目录权限和 `nginx -t`，切换失败立即指回上一 release。
- 从 Windows 使用 `scp -r` 后必须复核目录权限：目录为 755、文件为 644，否则 Nginx 会对图片返回 403。

---

## ⚠️ 注意事项

### 1. 区室必须是叶区室
不能填容器（`线粒体` / `内质网` / `内膜`），要具体到：
- 线粒体 → `线粒体基质` / `线粒体内膜` / `线粒体膜间隙` / `线粒体外膜`
- 内质网 → `粗面内质网` / `平滑内质网` / `内质网腔`

### 2. 酶是边标签，不是节点
在流动路径上的是节点（复合体 I–IV、ATP 合酶、细胞色素 c、辅酶 Q），只加速转化的是酶（己糖激酶、VDAC、MPC、ANT）。

### 3. 辅因子写在反应式里
ATP、NADH、Pi 写在反应式列，不当节点（否则会长出几十条边穿过整张图）。例外：当辅因子本身是主角时（ANT 搬运 ATP、ATP 合酶生成 ATP），它是节点。

### 4. 环形通路要补汇聚边
双底物反应写两行（主链一行，入口一行），否则拓扑断开。哪个底物走主链？被这个环自己再生出来的那个（TCA 的草酰乙酸、尿素循环的鸟氨酸）。

### 5. 跨区室反应两端都标
```
丙酮酸@细胞质	丙酮酸@线粒体膜间隙	VDAC 外膜通道
```

### 6. TSV 分隔符是制表符
不是逗号。现有 304 个名字里没有一个含制表符，所以 TSV 是安全的。Excel 可以直接打开，但**存回时要选「文本制表符分隔」**，别存成 xlsx 或 csv。

---

## 🔧 故障排查

### 校验报错
- **区室不存在**：检查是否用了容器（`线粒体`），改成叶区室（`线粒体基质`）
- **酶误入底物列**：检查底物/产物列是否填了「…酶」结尾的词，移到酶列
- **可逆列写错**：只能写 `是` 或 `否`

### 拓扑显示「开链」而非「环形」
汇聚边漏了。双底物反应写两行，见 `docs/transcription.md` § 环形通路：汇聚边。

### 编译后节点坐标重叠
先运行 `node tools/check-expert-layout.js`。若只在选中通路后重叠，修改 `tools/expert-pathway-layout.js`；只有重点总览的全局坐标重叠才编辑 `data/layout-overrides.tsv`。

### 浏览器里看不到新通路
1. 确认 `data-compiled.js` 已更新（看文件修改时间）
2. 硬刷新浏览器（Ctrl+Shift+R / Cmd+Shift+R）
3. 打开开发者工具看 Console 有无报错

---

## 📊 数据统计

- **区室**：20 个叶区室，83 种同义词
- **已转录**：54 条规范场景通路 + 1 个合并导航入口，55 个 TSV 文件，323 条编译反应，293 个节点
- **待转录**：0 条场景通路
- **审校状态**：50 行已核对、251 行已终审、47 行待审校；已终审中 26 行带机器可识别引用，仍有 225 行缺引用。详见 `REVIEW_PROGRESS.md`
- **手工坐标**：47 个（全部来自旧 SVG 层）
- **完成度**：51 / 51 有效通路 = **100%**；规范场景入口 54 / 54，另有 `transport` 合并入口

---

## 🎯 下一步（按优先级）

1. **逐反应科学审校**（当前核心任务）
   - 按 `data/review-log.tsv` 的具体阻塞原因拆分并修正仍保留的 47 条「待审校」反应
   - 为历史「已终审」记录补齐可验证引用，不能只依据状态标签验收
   - 优先处理 19 处容器区室消歧
   - 每复核一条就重新运行校验、布局、编译并在网页查看

2. **核对容器消歧**
   - 19 处我填的猜测标记 `待审校`
   - 转录到对应通路时核对，错了直接改

3. **更新 PRD**（可选）
   - 在 PRD 末尾加「实际实现与 PRD 的差异」一节
   - 保留原 PRD，记录实际选择和理由

4. **统一场景元数据**（长期）
   - 将场景层级、图片和热点纳入结构化生成流程
   - 只有 `index.html` 不再依赖并完成场景回归后，才能考虑移除 `scene-data.js`

5. **坐标微调**
   - 重新计算全部自动坐标
   - 手工调整冲突节点

---

## 🤝 对接信息

**主开发与实施**：Codex  
**外部模型角色**：Qoder / GLM 仅做只读审核并提交问题清单，不直接接手或修改项目  
**交接日期**：2026-08-08  
**代码库位置**：`D:/wangjunyi/Documents/cell Metabolism world/`  

所有通路已完成转录，工具链和浏览器交互已验证。原 58 条待审校记录已完成逐行复核，其中累计 11 条提升、47 条保留并写明原因。下一阶段重点是拆解这 47 条的科学边界、补齐 225 条历史已终审记录的证据、核对容器区室并持续做页面回归，不再是新增通路转录。

有问题可参考：
- `README.md`（快速开始）
- `docs/transcription.md`（转录格式详解）
- `docs/scientific-review-policy.md`（科学审校门禁）
- `REVIEW_PROGRESS.md`（当前进度）
- `STATS.md`（当前工程与数据基线）
- `CONTEXT.md`（术语表）
- 这份交接文档
