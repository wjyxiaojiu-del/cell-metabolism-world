# 嘌呤核苷酸从头合成双地图打磨规格

状态：内部实现与复审完成，等待项目负责人确认  
所属项目总目标：第 5 周终点——42/42 学习地图与专家地图全部通过

## 唯一主问题

现有学习图把 12 个主线步骤错误折成两行泛化节点，视觉上甚至让 AMP 出现在 IMP 前面，缺少 SAICAR、AICAR、FAICAR 与 IMP 的连续关系。专家图虽显示 PRPP、IMP、AMP、GMP，却把 PRPP→IMP 的十步压成 GAR、AICAR两个中间点，没有呈现六个酶模块、原子来源、AMP/GMP 分支的交叉供能与反馈调控。

## 科学边界

1. 人类嘌呤从头合成在细胞质进行；嘌呤环不是先独立合成，而是直接在 PRPP 的核糖骨架上逐步搭建。
2. 核糖-5-磷酸先由 PRPP 合成酶使用 ATP→AMP 活化为 PRPP；PRPP + 谷氨酰胺经 PPAT 生成 5-磷酸核糖胺，是从头嘌呤合成的第一承诺步骤。
3. PRPP→IMP 由 6 个酶完成 10 步：PPAT；GART 的 GAR synthetase、GAR transformylase、AIR synthetase 三种活性；PFAS；PAICS 的 AIR carboxylase、SAICAR synthetase 两种活性；ADSL；ATIC 的 AICAR transformylase、IMP cyclohydrolase 两种活性。
4. 十步中间体顺序必须为 5-PRA→GAR→FGAR→FGAM→AIR→CAIR→SAICAR→AICAR→FAICAR→IMP；不得跳过 IMP 后直接把 AMP/GMP并入线性主干。
5. 嘌呤环原子来源：N3、N9来自谷氨酰胺；C4、C5、N7来自甘氨酸；C2、C8来自 10-甲酰-THF；C6来自 CO₂/HCO₃⁻；N1来自天冬氨酸。
6. 从核糖-5-磷酸到 IMP 的教学能量账为 5 个 ATP 分子参与；其中 PRPP 合成酶将 ATP裂解为 AMP，其他四个成环步骤使用 ATP→ADP。不得把这一账写成 IMP→AMP/GMP 分支的共同额外消耗。
7. IMP→AMP 经 ADSS 和 ADSL：消耗天冬氨酸与 GTP，形成腺苷代琥珀酸后释放延胡索酸；IMP→GMP 经 IMPDH 与 GMPS：先以 NAD⁺氧化为 XMP，再使用谷氨酰胺与 ATP→AMP+PPi生成 GMP。
8. 交叉供能有助于平衡两池：AMP 分支使用 GTP，GMP 分支使用 ATP；AMP反馈抑制 ADSS，GMP反馈抑制 IMPDH，IMP/AMP/GMP等嘌呤核苷酸反馈 PPAT/上游入口。
9. APRT 与 HGPRT 的补救合成也使用 PRPP，但不属于十步从头主干；地图应作为旁路接口标注，不能混入步骤编号。

参考依据：[Reactome：人嘌呤核苷酸从头合成反应与原子来源](https://reactome.org/content/detail/R-HSA-73817)、[PMC：人类六酶十步 PRPP→IMP 与原料来源](https://pmc.ncbi.nlm.nih.gov/articles/PMC7869020/)、[PMC：AMP/GMP 分支交叉供能与反馈调控](https://pmc.ncbi.nlm.nih.gov/articles/PMC8247561/)、[PMC：十步酶名、原子来源与上游反馈](https://pmc.ncbi.nlm.nih.gov/articles/PMC4344498/)、[PMC：每个 IMP 的五个 ATP 与两份谷氨酰胺/甲酰基账](https://pmc.ncbi.nlm.nih.gov/articles/PMC5272809/)。

## 学习地图目标

- 使用专用布局 `purine-imp-two-branch`，分 prpp-entry、imp-assembly、amp-gmp-branch、atom-energy-regulation 四区。
- 保留 9 条原始记录；至少 24 个教学节点、10 个 PRPP→IMP 步骤编号。
- 一眼读出“R5P→PRPP→十步成 IMP→AMP/GMP 双分支”的主线，AMP绝不能出现在 IMP之前。
- 十个中间体、六个酶模块、五类原子来源与五 ATP账均可定位。
- AMP/GMP 分支分别显示 ADSS/ADSL 与 IMPDH/GMPS、不同能量/供氮输入及反馈。
- 提供 PPP 与核苷酸降解/补救合成的可点击出口。

## 专家地图目标

- 四个机制区；至少 25 个命名节点与 10 个步骤编号。
- 十步主干不可用 GAR→AICAR 一条压缩边替代；多功能酶的各活性要落在对应步骤。
- 原子、能量、交叉供能、反馈与补救合成边界使用不同语义编码。
- 390/768 关键标签高度 ≥10 px，无标签碰撞、裁切和页面横向溢出。

## 通过条件

- 双图总分 ≥90、科学准确性 ≥24/25、P0/P1=0。
- 390/768/1440 三档人工截图复审通过。
- 针对性、相关回归、数据门禁和全量 UI 全部通过。

## 实施与验收结果

- 学习地图：专用四区布局，10 个 PRPP→IMP 编号步骤、六个酶模块、AMP/GMP 双分支、五类原子来源及能量/反馈账本均可定位；PPP 与核苷酸降解出口可用。
- 专家地图：四个机制区、25 个命名节点、10 个步骤编号；十步主干、交叉供能、分支反馈和补救合成边界均已分层呈现。
- 缩写可访问性：GAR、AICAR 等十个中间体均补充中文全名标题和无障碍名称，不以英文缩写替代学习语义。
- 三档证据：学习地图与专家地图的 390/768/1440 最终截图均已保存并完成人工复审；专家 AMP/GMP 双列分支无越界，关键标签无碰撞或裁切。
- 内部评分：学习地图 95/100（科学 25/25）；专家地图 94/100（科学 25/25）；P0/P1=0。
- 自动门禁：新增专项 2/2、失败项定向回归及 AA 亚像素稳定性复现通过、数据/科学门禁通过、全量 UI 117/117 通过。
