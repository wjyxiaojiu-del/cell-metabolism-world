# 脂肪酸合成双地图打磨规格

状态：双图内部复审完成，等待项目负责人确认  
所属项目总目标：第 5 周终点——42/42 学习地图与专家地图全部通过

## 唯一主问题

现有学习图只有“柠檬酸→乙酰-CoA→丙二酰-CoA→FASN→棕榈酸”一条直线，专家图也把供碳、承诺步骤、七轮延长和 ER 后续加工压在同一条细线上。双图必须让学习者看懂：线粒体乙酰-CoA不能直接穿过内膜，胞质脂肪酸合成先取得碳源，再消耗 ATP 制造丙二酰-CoA，最后由 FAS 以固定四步循环把碳链延长到 C16。

## 科学边界

1. 线粒体乙酰-CoA不能直接穿过内膜；它先与 OAA 形成柠檬酸，经柠檬酸载体 SLC25A1 输出到胞质，再由 ACLY 消耗 ATP 裂解为乙酰-CoA和 OAA。
2. ACC 催化乙酰-CoA + HCO₃⁻ + ATP → 丙二酰-CoA + ADP + Pi；该反应依赖生物素，是脂肪酸合成的承诺/主要调控步骤。
3. FAS 以 1 个乙酰基作引物、7 个丙二酰基作二碳供体，依次重复“缩合→还原→脱水→还原”7 轮；每轮净增长 2C、消耗 2 NADPH。
4. FAS 的主要从头合成产物为棕榈酸 C16:0；完整 FAS 净账为 1 乙酰-CoA + 7 丙二酰-CoA + 14 NADPH + 14 H⁺ → 棕榈酸 + 7 CO₂ + 8 CoA-SH + 14 NADP⁺ + 6 H₂O。
5. 若把 7 个丙二酰-CoA的生成也计入，总成本为 8 乙酰-CoA + 7 ATP + 14 NADPH；ACLY 的碳输出成本另行显示，不混入 FAS 净反应。
6. PPP 和苹果酸酶可为胞质脂肪酸合成提供 NADPH，但图中不声称固定比例。
7. 棕榈酸生成后才进入以 ER 为主的延长和去饱和；这些是 FAS 主反应的下游，不属于胞质 FAS 七轮净反应。
8. 丙二酰-CoA还可抑制 CPT1，帮助协调“合成开启时减少长链脂酰基进入线粒体氧化”；不把 ACC1 与 ACC2 的组织/亚细胞差异简化成同一池的绝对规则。

参考依据：[Reactome：malonyl-CoA 与 acetyl-CoA 生成 palmitate](https://reactome.org/content/detail/R-HSA-75872)、[NCBI/PMC：Lipid Metabolism](https://pmc.ncbi.nlm.nih.gov/articles/PMC8411952/)、[NCBI/PMC：citrate 与 carnitine carriers](https://pmc.ncbi.nlm.nih.gov/articles/PMC4926351/)、[NCBI/PMC：FASN 与肝脏甘油三酯代谢](https://pmc.ncbi.nlm.nih.gov/articles/PMC3288544/)。

## 学习地图目标

- 专用布局 `fa-synthesis-citrate-fas-cycle`，分 carbon-export、commitment、fas-cycle、ledger-downstream 四区。
- 保留 4 条原始反应列表；用至少 12 个教学节点表达供碳、两次 ATP 消耗、四步循环、七轮碳链增长和下游出口。
- 学生首先能回答“乙酰-CoA为什么要以柠檬酸形式出线粒体”，随后看懂 ACC 为什么是承诺步骤。
- 把“每轮 2C + 2 NADPH”和“7 轮得到 C16”做成可视化碳链尺，不把 FAS 画成黑箱。
- 分开显示 FAS 净账、全程底物成本、NADPH 来源提示和 ER 后续加工。

## 专家地图目标

- carbon-export、commitment、fas-cycle、ledger-downstream 四区；至少 12 个命名节点、7 个步骤编号。
- 显示 SLC25A1、ACLY、ACC/biotin、FAS 四步循环、ACP、14 NADPH、C16:0、ER ELOVL/SCD 与 malonyl-CoA→CPT1 抑制关系。
- FAS 七轮循环与反应列表的 4 条原始记录并存，机制教学事件不得伪装成新增底层反应。
- 390/768 关键标签高度 ≥10 px，无标签碰撞、裁切和页面横向溢出。

## 通过条件

- 双图总分 ≥90、科学准确性 ≥24/25、P0/P1=0。
- 390/768/1440 三档人工截图复审通过。
- 针对性、相关回归、数据门禁和全量 UI 全部通过。

## 实施与复审结果

- 学习地图采用 `fa-synthesis-citrate-fas-cycle` 四区布局，保留 4 条原始反应，形成 19 个教学节点与 7 个可交互教学事件。
- 专家地图重排为柠檬酸输出、ACC 承诺步骤、FAS 四步循环、净账/调控/下游四个纵向机制区；20 个命名节点、7 个步骤编号与 4 条反应列表可逐项核对。
- 双图明确“乙酰-CoA不能直接跨内膜”、SLC25A1、ACLY/ACC 各自的 ATP 成本、ACC 的 HCO₃⁻/生物素、FAS 每轮 +2C/2 NADPH 与七轮 C2→C16。
- FAS 净反应、从 8 个乙酰-CoA起算的 7 ATP + 14 NADPH 总成本、PPP/苹果酸酶供还原力、malonyl-CoA 对 CPT1 的协调作用和 ER ELOVL/SCD 下游加工均保持边界分离。
- 学习地图内部评分 95/100（科学 25、教学 20、视觉 18、交互 19、跨设备 13）；专家地图 94/100（科学 25、教学 19、视觉 18、交互 19、跨设备 13）。
- P0/P1 为 0；390/768/1440 最终证据已保存。390/768 专家关键标签高度 ≥10 px、零碰撞、零裁切、零页面横向溢出。
- 专项 2/2、相关回归、数据门禁和全量 UI 103/103 全部通过。
