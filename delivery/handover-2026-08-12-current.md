# 细胞代谢世界｜当前交接文档

更新时间：2026-08-12（本轮回归后）  
项目目录：`D:\wangjunyi\Documents\cell Metabolism world`  
当前状态：核心功能稳定，进入“视觉收敛 + 教学素材接入 + 科学审校”阶段；尚未部署生产。

## 一、项目目标

这是一个面向生物化学学习的交互式细胞代谢地图。产品主线不是把 55 条通路全部同时铺开，而是：

- 专家地图：21 条核心通路 + 1 个总览入口，用于探索通路、区室、反应和酶。
- 学习模式：从主线反应、关键节点、解释、图示和小测进入学习。
- 场景图：用清晰的 2K 教学示意图替代教材中难以辨认的复杂箭头。

## 二、当前已完成

### 数据与工程

- 当前编译数据：55 个通路、298 个实体、337 条反应。
- 专家导航固定为 21 条核心通路 + `all` 总览，不要把 55 条全部加入导航。
- 坐标、反应端点、区室、学生步骤和资源引用均有自动检查。
- 运行时素材已有 WebP 优化版本；源 PNG 与运行时版本分离保存。

### 本轮继续处理（专家地图视觉收敛）

- 总览对非主干分支增加 `route-overview-branch` 标记：总览阶段透明化并关闭交互，聚焦具体通路后恢复完整路线，减少默认“网络球”式交叉。
- 手机端通路聚焦的最小标签字号由 6.2px 提高到 7.4px，优先保证当前通路可读性。
- 总览路线保留 DOM 可见性语义，兼容缺失端点/恶意标签韧性探针；不改变数据和通路拓扑。
- 已刷新 `STATS.md`，当前数据门禁不再因统计快照过期而失败。

### 专家地图

以下交互与布局回归本次实测通过：

```text
npx playwright test tests/ui-expert-layout.spec.js \
  tests/ui-expert-navigation.spec.js \
  tests/ui-expert-resilience.spec.js --reporter=line

结果：12 passed（约 1.4 分钟）
```

已验证的内容包括：

- 21 条核心通路均能聚焦，并显示对应路线、箭头和酶标签。
- 多底物/多参与物反应能汇聚到同一个反应模块。
- 聚焦标签不越界、不互相重叠。
- ETC、跨区室通路、TCA、肉碱穿梭、尿素循环等拓扑关系保持正确。
- 手机、iPad 横屏、双指缩放、全屏和双击进入场景均可用。
- 缺失端点和恶意标签不会导致页面报错或 HTML 注入。

## 三、浏览器实测后的真实问题

自动化测试通过不等于视觉已经足够易懂。本次截图检查发现：

1. **专家地图总览仍然偏密。**
   在 iPad 横屏的“重点总览”中，线路数量多、交叉明显，像网络图而不是学习入口。总览应继续保持“定位关系”的作用，不应承担全部细节。

2. **手机聚焦后的文字仍偏小。**
   通路按钮可以滚动，但地图节点和酶标签在 390px 宽度下不适合阅读。需要采用“聚焦后自动放大/居中 + 只显示当前通路标签”的策略。

3. **高密度通路仍需视觉分层。**
   优先处理：`nucleotide_degradation`、`purine`、`pyrimidine`、`gluconeogenesis`、`aa_carbon`。重点不是继续加线，而是降低同时可见的信息量，区分主链、支链、跨区室边和说明性边。

## 四、2K 教学素材现状

以下新图已经生成，源文件位于 `cell-metabolism-assets/source-*`，但尚未全部接入课程页：

- TCA：`source-tca/tca-cycle-overview-annotated.png`
- ETC：`source-user-2k/etc-*.png`（已有部分运行时接入）
- PDH：`source-pdh/pdh-complex-bridge.png`
- 糖异生对照：`source-gluconeogenesis/gluconeogenesis-vs-glycolysis.png`
- 磷酸戊糖途径：`source-ppp/pentose-phosphate-pathway.png`
- β-氧化：`source-beta-oxidation/fatty-acid-beta-oxidation.png`
- 脂肪酸合成：`source-fatty-acid-synthesis/fatty-acid-synthesis.png`
- 尿素循环：`source-urea-cycle/urea-cycle-tca-link.png`
- 氨基酸氮代谢：`source-amino-nitrogen/amino-acid-transamination-nitrogen-fate.png`
- 核苷酸代谢：`source-nucleotide/nucleotide-metabolism-overview.png`
- 糖原：`source-glycogen/glycogen-synthesis-breakdown-regulation.png`
- 酮体：`source-ketone-bodies/ketone-body-production-utilization.png`

### 素材接入注意

当前 `tools/optimize-assets.py` 只扫描 `cell-metabolism-assets` 根目录的图片，不会递归处理 `source-*` 子目录。因此新图需要：

1. 生成对应 WebP 运行时文件；
2. 复制/整理到 `cell-metabolism-assets/optimized/`；
3. 在学习步骤或场景数据中加入引用；
4. 加上中文 `alt` 文本；
5. 用桌面、手机截图检查图片文字可读性。

不要直接覆盖源 PNG，也不要把未审核的 AI 图片当作科学结构图使用。

## 五、科学审校状态

本次数据检查结果：

- 已核对：53
- 已终审：260
- 待审校：53
- 学生解释可读性检查：170/170 通过
- 已人工细化学生解释：122/170
- 数据门禁：`npm run test:data` 通过
- 专家地图 UI 回归：12/12 通过
- 完整 UI 回归：`npm run test:ui` 63/63 通过（约 4.5 分钟）

人工细化尚未完成的重点通路：

```text
fa_synthesis 0/5
carnitine 0/3
beta_oxidation 0/4
ketone 0/6
purine 0/9
pyrimidine 0/10
nucleotide_degradation 0/11
```

这些数字不代表页面不能用，而是代表内容仍需逐行复核，特别是区室、反应合并、抽象类别和跨通路共享节点。

## 六、下一步推荐顺序

### P0：先做专家地图的“可读性收敛”

- 总览只保留核心枢纽和关系提示，默认隐藏次级节点与延伸线路。
- 聚焦通路时，主链使用最粗、最醒目的路线；支链使用较细线；跨区室路线使用虚线或专用色；说明性路线默认隐藏。
- 给 5 条高密度通路做专用布局和专用标签层，不再依赖全局自动布局。
- 手机聚焦后自动缩放到当前通路，提供“回到总览”按钮。

### P1：接入 2K 教学图片

- 先接入 TCA、糖酵解、ETC、β-氧化、尿素循环五组。
- 每一课只放 1 张主图，必要时再放 1 张局部图，避免图册化。
- 图片采用懒加载、WebP、`srcset` 或按屏幕尺寸选择版本。
- 点击图片打开可缩放的教学图层，并保留简短图注和“这张图要看什么”。

### P1：补齐学习解释

- 优先完成 `purine`、`pyrimidine`、`nucleotide_degradation`，因为它们也是专家地图最难读的区域。
- 每个步骤固定写清：底物 → 直接变化 → 产物 → 能量/辅因子 → 结论边界。

### P2：统计与发布准备

- 运行 `node tools/generate-stats.js --write` 更新过期的 `STATS.md`。
- 重新运行 `npm run test:data` 和完整 `npm run test:ui`。
- 生产发布前确认部署版本、缓存版本和回滚路径；当前源码尚未部署。

## 七、重要命令

```powershell
cd 'D:\wangjunyi\Documents\cell Metabolism world'
npm run test:data
npm run test:ui
node tools/check-expert-layout.js
node tools/check-assets.js
node tools/generate-stats.js --check
```

本地预览：

```powershell
npm run preview
```

浏览器地址：`http://127.0.0.1:8000/index.html`

## 八、不要误改的边界

- 不要把 55 条通路全部铺进专家导航。
- 不要为了“看起来完整”恢复教材式的密集箭头。
- 不要把自动布局通过当成视觉验收通过。
- 不要覆盖源 PNG，不要删除历史素材。
- 不要在没有重新跑完整测试的情况下部署。
- 本文档中的统计以本次检查为准；`STATS.md` 当前仍有旧统计，需要单独刷新。

## 九、交接结论

项目已经从“功能搭建”进入“教学表达打磨”阶段。底层数据、专家地图交互和回归测试已经稳定；下一次工作的核心不是继续扩大通路数量，而是把高密度地图分层、把已经生成的 2K 图接入学习流程，并完成剩余科学解释审校。
