# 肉碱穿梭双地图打磨规格

状态：双图内部复审完成，等待项目负责人确认  
所属项目总目标：第 5 周终点——42/42 学习地图与专家地图全部通过

## 唯一主问题

现有学习图把 6 条记录压成一条通用链，隐藏了 VDAC、CACT 的交换关系和两侧 CoA 池；专家图虽有 CPT1/CACT/CPT2，但没有把外膜、膜间隙、内膜和基质按连续穿膜事件分区。双图必须让学习者理解：真正需要肉碱穿梭的是长链脂酰基，跨内膜的是脂酰肉碱，不是脂酰-CoA或 CoA 本身。

## 科学边界

1. 长链脂肪酸先在穿梭上游活化为长链脂酰-CoA；活化消耗 ATP→AMP+PPi，但不属于本数据集的 6 条穿梭反应。
2. CPT1 位于线粒体外膜，催化位点朝胞质侧；它把长链脂酰基从 CoA 转给肉碱，形成脂酰肉碱并把 CoA-SH 留在胞质池。
3. 项目数据以 VDAC 标记脂酰肉碱通过外膜进入膜间隙；核心内膜屏障由 CACT/SLC25A20 跨越。
4. CACT 位于线粒体内膜，通常以反向交换方式把脂酰肉碱送入基质，同时把游离肉碱送向膜间隙/胞质侧。
5. CPT2 位于内膜基质侧，把脂酰基从肉碱转回基质 CoA-SH，生成基质脂酰-CoA和游离肉碱；脂酰-CoA随后进入 β-氧化。
6. 胞质 CoA 池和基质 CoA 池彼此分开；穿梭搬运的是脂酰基，游离肉碱循环再用，穿梭本身不再额外消耗 ATP。
7. malonyl-CoA 抑制 CPT1，协调脂肪酸合成与长链脂肪酸氧化。
8. 中短链脂肪酸的线粒体氧化对该穿梭依赖较低；本图限定为长链脂酰基输入。

参考依据：[Reactome：SLC25A20 交换脂酰肉碱与肉碱](https://reactome.org/content/detail/R-HSA-200424)、[NCBI GeneReviews：CACT deficiency](https://www.ncbi.nlm.nih.gov/books/NBK582032/)、[NCBI/PMC：long-chain fatty acid oxidation and carnitine shuttle](https://pmc.ncbi.nlm.nih.gov/articles/PMC6208583/)、[NCBI/PMC：SLC25A20 transport mechanism](https://pmc.ncbi.nlm.nih.gov/articles/PMC8066319/)。

## 学习地图目标

- 专用布局 `carnitine-double-membrane-antiport`，分 cytosol-gate、outer-membrane、inner-membrane-exchange、matrix-handoff、net 五区。
- 保留 6 条原始反应列表；至少 14 个教学节点、4 个核心穿膜事件。
- 明确 CPT1/VDAC/CACT/CPT2 的膜侧位置和先后次序。
- 把 CACT 的“脂酰肉碱入、游离肉碱出”画成两条反向配对路线，而不是两个无关箭头。
- 明确胞质 CoA 与基质 CoA 不互换、脂酰基才是净搬运对象，并提供 β‑氧化下一通路入口。

## 专家地图目标

- 五个纵向机制区；至少 14 个命名节点与 4 个步骤编号。
- 显示 CPT1 外膜胞质侧、VDAC 外膜通道、CACT/SLC25A20 内膜反向交换、CPT2 内膜基质侧。
- 显示 malonyl-CoA 对 CPT1 的抑制、两侧 CoA 池、游离肉碱回收和 β‑氧化交接。
- 390/768 关键标签高度 ≥10 px，无标签碰撞、裁切和页面横向溢出。

## 通过条件

- 双图总分 ≥90、科学准确性 ≥24/25、P0/P1=0。
- 390/768/1440 三档人工截图复审通过。
- 针对性、相关回归、数据门禁和全量 UI 全部通过。

## 实施与复审结果

- 学习地图采用 `carnitine-double-membrane-antiport` 五区布局，保留 6 条原始反应，形成 19 个机制节点、4 个核心事件和可点击的 β‑氧化下一通路入口。
- 专家地图按胞质侧 CPT1、外膜 VDAC、内膜 CACT、基质侧 CPT2、净账/能量边界纵向排布；20 个命名节点、4 个步骤编号与 6 条反应列表可逐项核对。
- 双图明确“长链脂酰-CoA不跨内膜”、CACT 的脂酰肉碱入/游离肉碱出反向交换、两侧 CoA 池分离以及游离肉碱循环再用。
- malonyl-CoA 对 CPT1 的抑制、上游 ACSL 的 ATP→AMP+PPi 成本和“穿梭本身不额外耗 ATP”保持边界分离。
- 学习地图内部评分 95/100（科学 25、教学 20、视觉 18、交互 19、跨设备 13）；专家地图 95/100（科学 25、教学 20、视觉 18、交互 19、跨设备 13）。
- P0/P1 为 0；390/768/1440 最终证据已保存。390/768 专家关键标签高度 ≥10 px、零碰撞、零裁切、零页面横向溢出。
- 专项 2/2、导航回归、数据门禁和全量 UI 105/105 全部通过。
