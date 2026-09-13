# 嘧啶核苷酸从头合成双地图打磨规格

状态：实施中  
所属项目总目标：第 5 周终点——42/42 学习地图与专家地图全部通过

## 唯一主问题

现有学习图把嘧啶从头合成压成 6 个泛化主节点，并把谷氨酰胺、氨甲酰磷酸和 dTMP 作为灰色“跨通路连接”悬在下方，无法读出 CAD 三步、DHODH 膜上氧化、UMPS 两步及 UMP 后 RNA/DNA 分流。专家图已有区室轮廓，但 dUMP→dTMP 与 UDP→dUDP 两段彼此悬空，未说明 dUDP→dUTP→dUMP 的 NDPK/DUT 接力，也未形成“先造环、再接 PRPP”的六步 UMP 主线、原子账与能量/反馈账。

## 科学边界

1. 人类嘧啶从头合成先在核糖之外组装嘧啶环，再把乳清酸接到 PRPP；这与嘌呤环直接在 PRPP 上逐步搭建不同。
2. 从谷氨酰胺、HCO₃⁻、天冬氨酸和 PRPP 到 UMP 共 6 个酶活性步骤，由 3 个蛋白系统承担：胞质 CAD 前三步、线粒体内膜 DHODH 第四步、胞质 UMPS 后两步。
3. CAD 包含 CPS II、ATCase 和 DHOase：CPS II 用谷氨酰胺、HCO₃⁻与 2 ATP 生成氨甲酰磷酸；ATCase 加入天冬氨酸形成氨甲酰天冬氨酸；DHOase 环化为二氢乳清酸。
4. 人类 DHODH 是含 FMN 的线粒体内膜酶，位于内膜外侧/膜间隙侧，使胞质二氢乳清酸可接近；它以 CoQ 为电子受体生成 CoQH₂并释放乳清酸回胞质。不得画成基质反应，也不得虚构专用跨膜载体或 NAD⁺受体。
5. 胞质双功能 UMPS 先以 OPRTase 活性使乳清酸 + PRPP → OMP + PPi，再以 OMP decarboxylase 活性使 OMP → UMP + CO₂；不得把 OMP 从主线删除。
6. UMP 经 UMP-CMP kinase 与 NDPK 形成 UDP、UTP；UTP 经 CTPS1/2 使用谷氨酰胺和 ATP形成 CTP，构成 RNA 嘧啶池主线。
7. DNA 胸苷酸支路可由 UDP 经 RNR/硫氧还蛋白形成 dUDP，再经 NDPK 形成 dUTP、DUT/dUTPase 水解为 dUMP；TYMS 使用 5,10-亚甲基-THF 将 dUMP 转为 dTMP并生成 DHF，随后由激酶形成 dTTP。dCMP 脱氨是另一 dUMP 来源，应作为旁路边界说明而非混入本图主编号。
8. 嘧啶环原子来源：N3来自谷氨酰胺，C2来自 HCO₃⁻，N1/C4/C5/C6来自天冬氨酸。形成 UMP 主干中 CAD/CPS II 直接消耗 2 ATP；PRPP 本身的活化成本属于上游核糖活化账，不能重复计入 CAD 的 2 ATP。
9. UTP反馈抑制 CAD/CPS II，PRPP促进该入口；RNR与 dNTP 平衡有独立复杂调控，本图只标其池平衡边界，不用一条假反馈箭头代替完整机制。

参考依据：[Reactome：人嘧啶从头合成六步与三个蛋白系统](https://reactome.org/content/detail/R-HSA-500753)、[Reactome：DHODH 的内膜取向、胞质底物和 CoQ 电子受体](https://reactome.org/content/detail/R-HSA-73569)、[Reactome：UMPS 的 OPRTase 与 OMP decarboxylase 双活性](https://reactome.org/content/detail/R-HSA-73487)、[Reactome：TYMS 催化 dUMP + 5,10-亚甲基-THF → dTMP + DHF](https://reactome.org/content/detail/R-HSA-73605)、[PMC：CAD、DHODH、UMPS 的结构组织与 UTP/PRPP 调控](https://pmc.ncbi.nlm.nih.gov/articles/PMC8442968/)、[PMC：RNR、DUT、TYMS 与嘧啶核糖/脱氧核糖分流](https://pmc.ncbi.nlm.nih.gov/articles/PMC7096759/)。

## 学习地图目标

- 使用专用布局 `pyrimidine-ring-first-branch`，分 cad-ring、dhodh-interface、umps-ump、rna-dna-branch、atom-energy-regulation 五区。
- 至少 28 个教学节点；六个 UMP 主干步骤有连续编号，CAD 三活性、DHODH 与 UMPS 双活性均可定位。
- 一眼读出“先造环 → DHODH 接 CoQ → 再接 PRPP → UMP → RNA/DNA 双分支”。
- DNA 支路连续显示 UDP→dUDP→dUTP→dUMP→dTMP→dTTP，不保留无来源的悬空 dUMP。
- 原子来源、CAD 2 ATP、UTP/PRPP 调控与 dCMP→dUMP 旁路形成独立账本。
- 提供 PPP、电子传递链和核苷酸降解/补救合成的可点击出口。

## 专家地图目标

- 五个机制区；至少 28 个命名节点与 6 个 UMP 主干步骤编号。
- 明确 CAD/UMPS 在胞质，只有 DHODH 锚定线粒体内膜外侧，并以 CoQ→CoQH₂连接呼吸链。
- RNA 与 DNA 分支连续、可追踪；TYMS 的一碳输入与 DHF 输出、DUT 防止 dUTP 错掺入 DNA 的角色可读。
- 390/768 关键标签高度 ≥10 px，无标签碰撞、裁切和页面横向溢出。

## 通过条件

- 双图总分 ≥90、科学准确性 ≥24/25、P0/P1=0。
- 390/768/1440 三档人工截图复审通过。
- 针对性、相关回归、数据门禁和全量 UI 全部通过。
