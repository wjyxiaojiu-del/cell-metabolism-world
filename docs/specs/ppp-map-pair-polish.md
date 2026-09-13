# 磷酸戊糖途径双地图打磨规格

状态：双图内部复审完成，等待项目负责人确认  
所属项目总目标：42/42 学习地图与专家地图全部通过

## 唯一主问题

现有学习图是把 9 个中间体折成两行的通用链，专家图只有一个氧化横线和一个五碳分叉。双图必须让学习者看懂 PPP 不是单向“造核糖”，而是按 NADPH 与核糖需求在氧化支和可逆非氧化支之间调节碳流。

## 科学边界

1. 氧化支不可逆：G6PD 产生第 1 个 NADPH；内酯酶水解内酯；6PGDH 氧化脱羧产生第 2 个 NADPH、CO₂ 和 Ru5P。
2. 每个 G6P 完成氧化支的净产物为 2 NADPH + CO₂ + Ru5P；PPP 不直接产生 ATP。
3. Ru5P 可逆生成 R5P 与 X5P。R5P进入核苷酸合成，X5P与R5P/G3P参与碳骨架重排。
4. 转酮酶依赖 TPP 并转移 2C；转醛酶转移 3C。非氧化支全部可逆。
5. 碳守恒总账为 3 个五碳糖（15C）⇌ 2 F6P（12C）+ 1 G3P（3C）。
6. 细胞可按需求采用不同模式：同时需要 NADPH/R5P；更需要 R5P 时可由糖酵解中间体反向重排；更需要 NADPH 时把多余五碳糖回流 F6P/G3P。

参考依据：[Reactome R-HSA-71336](https://reactome.org/content/detail/R-HSA-71336)、[The return of metabolism: PPP](https://pmc.ncbi.nlm.nih.gov/articles/PMC4470864/)、[NCBI Bookshelf: Hexose Monophosphate Pathway](https://www.ncbi.nlm.nih.gov/books/NBK551687/)。

## 学习地图目标

- 专用布局 `ppp-demand-carbon-balance`，分 oxidative、pentose-hub、rearrangement、demand-modes 四区。
- 8 个底层反应对应 8 个教学事件；至少 12 个机制节点。
- 氧化支明确两个 NADPH 生成位置、CO₂ 脱羧位置和 2 NADPH 净账。
- 非氧化支明确 TKT1→TAL→TKT2 的底物/产物组合以及 15C⇌15C 总账。
- R5P 核苷酸出口、F6P/G3P 糖酵解回流和三种需求模式分别可读。

## 专家地图目标

- oxidative、pentose-hub、rearrangement、demand-modes 四区；至少 12 个命名节点与 8 个步骤编号。
- 显示 G6PD、6PGL、6PGDH、RPI、RPE、TKT×2、TAL 及 TPP。
- 390/768 关键标签高度 ≥10 px，无标签碰撞、裁切和页面横向溢出。

## 通过条件

- 双图总分 ≥90、科学准确性 ≥24/25、P0/P1=0。
- 390/768/1440 三档人工截图复审通过。
- 针对性、相关回归、数据门禁和全量 UI 全部通过。

## 实施与复审结果

- 学习地图采用 `ppp-demand-carbon-balance` 四区布局，保留 8 条原始反应，形成 14 个机制节点与 8 个教学事件。
- 专家地图重排为氧化支、五碳糖枢纽、非氧化碳重排、需求模式四个纵向机制区；15 个命名节点、8 个步骤编号与 8 条反应列表可逐项核对。
- 氧化支明确两个 NADPH 生成位置、CO₂、Ru5P 与“不直接产生 ATP”；非氧化支明确 TKT1→TAL→TKT2、TPP、2C/3C 转移和 15C⇌15C。
- 三种需求模式分别呈现 R5P 优先、NADPH 与 R5P 同需、NADPH 优先，不再把 PPP 画成固定单向链。
- 学习地图内部评分 95/100（科学 25、教学 20、视觉 18、交互 19、跨设备 13）；专家地图 94/100（科学 25、教学 19、视觉 18、交互 19、跨设备 13）。
- P0/P1 为 0；390/768/1440 最终证据已保存。390/768 专家标签高度 ≥10 px、零碰撞、零裁切、零页面横向溢出。
- PPP 专项 2/2、相关回归 60/60、数据门禁、21/21 专家几何门禁和全量 UI 101/101 通过。
