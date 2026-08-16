# Qoder 科学复核报告：细胞代谢地图第二轮审核
**审核日期**：2026-08-06  
**审核范围**：72 行「待审校」记录逐行科学复核  
**审核员**：QoderWork  
**审核时基线**：validate 无错误；55 个 TSV 文件、316 条端点去重反应、291 个编译节点。下方统计和 58 行逐项结论保留为审核当日记录，不代表当前队列。

> **2026-08-07 修订说明**：后续复核发现本报告曾把多条“存在的数据库 ID”错误对应到目标反应，现已在下方“修改依据汇总”更正。原 58 行队列又完成一轮逐项复核，7 行提升、51 行保留。当前编译基线为 323 条反应、290 个节点；状态分布为已核对 50、已终审 247、待审校 51。最新结论见 `docs/qoder-review-2026-08-07.md`。

---

## 摘要结论

本次科学复核完成了对 **72 行待审校记录**的逐行审查，重点检查：底物/产物/反应式一致性、酶名准确性、辅因子完整性、`名称@区室`合理性、可逆性标注及多步合并的边界。

### 修改统计

| 审校状态 | 原行数 | 修改后 | 变化 |
|---------|--------|--------|------|
| 已核对 | 50 | 50 | — |
| 已终审 | 225 | **239** | +14 |
| 待审校 | 72 | **58** | −14 |

**审核当时提升的 14 行**（以下证据已按 2026-08-07 复核结果修订）：

1. **purine.tsv**:7 — PRA→GAR，氮源改为甘氨酸；KEGG:R04144、RHEA:17456
2. **purine.tsv**:9 — AICAR→IMP，ATIC 双功能酶净反应；KEGG:R04560、KEGG:R01127、RHEA:22195、RHEA:18448
3. **purine.tsv**:10 — IMP→AMP；RHEA:15753、RHEA:23922
4. **purine.tsv**:11 — IMP→GMP；RHEA:11708、RHEA:11680
5. **purine.tsv**:13 — GMP→GTP；KEGG:R00332、KEGG:R00330、RHEA:20783、RHEA:27689
6. **nucleotide_degradation.tsv**:8 — 次黄嘌呤→尿酸；KEGG:R01769、KEGG:R02107、RHEA:68013、RHEA:21135
7. **nucleotide_degradation.tsv**:9 — 鸟嘌呤→尿酸；KEGG:R01676、KEGG:R02107、RHEA:14668、RHEA:21135
8. **nucleotide_degradation.tsv**:10 — 尿嘧啶→β-丙氨酸三步净反应；KEGG:R00978、KEGG:R02269、KEGG:R00905
9. **nucleotide_degradation.tsv**:11 — 胸腺嘧啶→β-氨基异丁酸三步净反应；KEGG:R01415、KEGG:R03055、KEGG:R04666
10. **cholesterol.tsv**:8 — 甲羟戊酸→异戊烯焦磷酸三步净反应；KEGG:R02245、KEGG:R03245、KEGG:R01121
11. **plasmalogen.tsv**:6 — AGPS 醚键形成；RHEA:36171
12. **heme.tsv**:8 — 4 PBG→尿卟啉原 III；KEGG:R00084、KEGG:R03165、RHEA:13188、RHEA:18968
13. **pyrimidine.tsv**:12 — UDP→dUDP；RHEA:28028
14. **folate.tsv**:7 — MTHFD1 两步净反应；KEGG:R01220、KEGG:R01655、RHEA:22815、RHEA:23703

---

## 保留待审校的 58 行详细分析

以下为审核当日保留的 58 行，原因按当时分类归纳。当前组成已变化：新增亚硝酸盐质体转运，3-磷酸甘油酸→丝氨酸已完成补证；请以 `data/review-log.tsv` 为准。

### 一、抽象类别表示（底物/产物为类别而非具体分子）

这些行使用通用类别（如"氨基酸"、"脂质"、"多糖"等）作为底物或产物，不是精确化学计量反应，而是示意性表示某一类代谢路径的入口/出口。由于无法用单一酶和反应式准确描述，保留待审校。

| 文件：行号 | 底物 → 产物 | 保留原因 |
|-----------|------------|---------|
| aa_carbon.tsv:6 | 氨基酸 → 丙酮酸 | 底物为类别；20 种氨基酸各有不同降解途径 |
| aa_carbon.tsv:7 | 氨基酸 → 乙酰辅酶 A | 底物为类别；生酮氨基酸特异路径不同 |
| aa_carbon.tsv:8 | 氨基酸 → α-酮戊二酸 | 底物为类别；谷氨酸家族入口 |
| aa_carbon.tsv:9 | 氨基酸 → 琥珀酰辅酶 A | 底物为类别；BCAA 特异路径 |
| aa_carbon.tsv:10 | 氨基酸 → 延胡索酸 | 底物为类别；苯丙氨酸/酪氨酸特异 |
| aa_carbon.tsv:11 | 氨基酸 → 草酰乙酸 | 底物为类别；天冬氨酸/天冬酰胺特异 |
| transamination.tsv:6 | 氨基酸 → α-酮酸 | 通用转氨模式；底物类别；需 α-KG/谷氨酸辅底物 |
| lysosomal.tsv:7 | 蛋白质 → 氨基酸 | 底物类别；蛋白酶水解无单一酶 |
| lysosomal.tsv:8 | 多糖 → 单糖 | 底物类别；糖苷酶系复杂 |
| lysosomal.tsv:9 | 脂质 → 脂肪酸 + 甘油 | 底物类别；脂质降解多酶系统 |
| lysosomal.tsv:10 | 核酸 → 核苷 | 底物类别；核酸酶系复杂 |
| autophagy.tsv:8 | 自噬货物 → 氨基酸 | 抽象表示；三类大分子回收 |
| autophagy.tsv:9 | 自噬货物 → 单糖 | 抽象表示；同上 |
| autophagy.tsv:10 | 自噬货物 → 脂肪酸 | 抽象表示；同上 |

### 二、多步合并路径（缺乏完整中间体和物种信息）

这些行将 3 步或以上的多酶路径合并为单一表示边，反应式中缺少部分中间体和辅因子。由于无法在不引入额外假设的情况下补齐完整信息，保留待审校。

| 文件：行号 | 底物 → 产物 | 保留原因 |
|-----------|------------|---------|
| aa_biosynthesis.tsv:5 | 3-磷酸甘油酸 → 丝氨酸 | 3 步合并（PHGDH/PSAT1/PSPH）；需 NAD⁺/谷氨酸/ATP |
| aa_biosynthesis.tsv:10 | 谷氨酸 → 脯氨酸 | 4 步合并（P5CS/P5CR 等）；需 ATP/NADPH |
| aromatic_aa.tsv:9 | 酪氨酸 → 延胡索酸 | 5 步合并（TAT/4-HPPD/HGO/MAAI/FAH）；缺少 CO₂/α-KG |
| aromatic_aa.tsv:10 | 酪氨酸 → 乙酰乙酸 | 同上路径的另一产物分支 |
| purine.tsv:8 | GAR → AICAR | 6 步合并（GAR→FGAR→FGAM→AIR→CAIR→SAICAR→AICAR）；需 ATP/Gln/CO₂ |
| steroid_bile.tsv:8 | 孕烯醇酮 → 类固醇激素 | 后续多步 P450 修饰合并；物种/组织未定 |
| steroid_bile.tsv:9 | 胆固醇 → 胆汁酸 | 7α-羟化后多步 CYP7A1/CYP8B1 修饰；肝细胞特异 |
| steroid_bile.tsv:10 | 胆固醇 → 维生素 D 前体 | 多步光化学 + 羟化；皮肤/肝/肾跨组织 |
| plasmalogen.tsv:9 | 烷基甘油-3-磷酸 → 质醚磷脂 | 4 步合并（酰化/去磷酸/头部连接/去饱和）；需 O₂/CDP-胆碱 |
| uronic.tsv:7 | 葡萄糖醛酸 → 木酮糖-5-磷酸 | 6 步合并（还原/脱氢/脱羧/还原/脱氢/激酶）；需 NADPH/NAD⁺/ATP |
| membrane_transport.tsv:8 | 脂肪酸@胞外 → 脂酰-CoA@细胞质 | 跨膜转运 + 胞质活化两步合并；ATP→AMP+PPi 未补 |

### 三、细胞事件/囊泡运输（非化学计量反应）

这些行表示自噬、内吞、溶酶体成熟、囊泡运输等**细胞事件**而非精确化学反应。虽然可用"主链表示边"建模，但由于涉及膜融合、货物分选等复杂机制，保留待审校以标注其抽象性质。

| 文件：行号 | 底物 → 产物 | 保留原因 |
|-----------|------------|---------|
| autophagy.tsv:6 | 隔离膜 → 自噬体 | ATG 蛋白系统介导膜延伸；非化学计量 |
| autophagy.tsv:7 | 自噬体 → 自噬溶酶体 | SNARE 融合系统；涉及膜动力学 |
| lipoprotein.tsv:8 | LDL@胞外 → LDL@内体 | 受体介导内吞；网格蛋白包被囊泡 |
| lysosomal.tsv:5 | 内吞货物 → 酸化内体货物 | V-ATP 酶泵 H⁺酸化；质子动力势驱动 |
| lysosomal.tsv:6 | 酸化内体货物 → 溶酶体货物 | 内体成熟与融合；Rab GTPase 调控 |
| glycosylation.tsv:9 | 糖基化蛋白@内质网 → @高尔基体 | COPII 囊泡运输；跨膜区室转移 |
| glycosylation.tsv:10 | 糖基化蛋白@高尔基体 → @胞外 | 分泌途径；高尔基体成熟/囊泡运输 |
| cholesterol.tsv:11 | 胆固醇@平滑内质网 → @质膜 | 膜间转运；囊泡/非囊泡机制待定 |
| steroid_bile.tsv:6 | 胆固醇@平滑内质网 → @线粒体内膜 | 类固醇生成入口；跨膜转运机制未完全阐明 |
| plasmalogen.tsv:8 | 烷基甘油-3-磷酸@过氧化物酶体 → @平滑内质网 | 醚磷脂前体转运；具体机制未明 |
| vlcfa.tsv:10 | 缩短脂酰-CoA@过氧化物酶体 → @线粒体基质 | 过氧化物酶体→线粒体转运；酰基肉碱穿梭 |

### 四、区室归属或转运机制不完全明确

以下行的化学反应本身较清晰，但底物/产物的亚细胞定位或转运蛋白身份存在不确定性。

| 文件：行号 | 底物 → 产物 | 保留原因 |
|-----------|------------|---------|
| heme.tsv:7 | ALA@线粒体基质 → 卟胆原@细胞质 | 跨区室主链表示；ALA 输出蛋白未完全鉴定 |
| heme.tsv:9 | 尿卟啉原 III@细胞质 → 原卟啉 IX@线粒体基质 | 回到线粒体；具体转运机制未明 |
| heme.tsv:11 | 血红素@线粒体基质 → 胆绿素@平滑内质网 | 血红素输出到 ER；转运蛋白未鉴定 |
| heme.tsv:12 | 胆绿素@平滑内质网 → 胆红素@平滑内质网 | 区室简化为 ER；实际可能涉及多个区室 |
| heme.tsv:13 | 胆红素@平滑内质网 → 结合胆红素@平滑内质网 | UGT1A1 在 ER 膜腔面；产物去向未完全建模 |
| pyrimidine.tsv:8 | 二氢乳清酸 → 乳清酸 | DHODH 位于线粒体内膜（面向 IMS）；当前表示在胞质，区室不符 |
| pyrimidine.tsv:13 | dUDP → dTMP | 合并去磷酸化和 TS 两步；缺少 dUTPase/TK 等辅助酶 |
| glycosylation.tsv:7 | UDP-葡萄糖@细胞质 → @内质网腔 | UDP-糖转运体身份不完全确定；SLC35 家族多个成员 |
| glycosylation.tsv:8 | UDP-葡萄糖@粗面内质网 → 糖基化蛋白@粗面内质网 | OST 复合物组成复杂；底物为"蛋白质"类别 |
| sphingolipid.tsv:9 | 神经酰胺@平滑内质网 → 鞘磷脂@高尔基体 | CERT 转运蛋白介导；SM 合成在高尔基体 |
| sphingolipid.tsv:10 | 神经酰胺@平滑内质网 → 糖鞘脂@高尔基体 | 糖基转移酶在高尔基体；跨区室转运 |
| uronic.tsv:8 | UDP-葡萄糖醛酸@细胞质 → @内质网腔 | UGT 底物供应机制；SLC35 转运体身份未完全明确 |

### 五、其他需补充物种/组织信息的行

| 文件：行号 | 底物 → 产物 | 保留原因 |
|-----------|------------|---------|
| bcaa.tsv:7 | 支链酰-CoA → 乙酰辅酶 A | BCAA 降解分支；亮氨酸/异亮氨酸/缬氨酸各有不同产物 |
| bcaa.tsv:8 | 支链酰-CoA → 琥珀酰辅酶 A | 同上；异亮氨酸/缬氨酸特异路径 |
| aromatic_aa.tsv:7 | 多巴 → 儿茶酚胺 | AADC 脱羧生成多巴胺；后续 DBH/PNMT 修饰未建模 |
| folate.tsv:10 | 10-甲酰-THF → 嘌呤 | 一碳转移酶系；供体/受体关系复杂 |
| lipoprotein.tsv:7 | IDL → LDL | 肝脂肪酶成熟过程；脂质重塑复杂 |
| lipoprotein.tsv:9 | LDL@内体 → 胆固醇@细胞质 | LAL 水解胆固醇酯；NPC1/NPC2 输出机制 |
| uronic.tsv:6 | UDP-葡萄糖醛酸 → 葡萄糖醛酸 | 焦磷酸化酶/水解酶方向；生理意义未完全明确 |

---

## 修改依据汇总

以下 14 行提升为「已终审」的数据库依据：

| TSV 文件：行号 | 修改内容 | 数据库来源 |
|--------------|---------|-----------|
| purine.tsv:7 | 酶名改为 GAR synthetase (GART)；方程补回甘氨酸 + ATP | [KEGG R04144](https://www.kegg.jp/entry/R04144); [Rhea 17456](https://www.rhea-db.org/rhea/17456) |
| purine.tsv:9 | ATIC 两步净反应；旧引用 R-HSA-74217 实为嘌呤补救，已移除 | [KEGG R04560](https://www.kegg.jp/entry/R04560) + [R01127](https://www.kegg.jp/entry/R01127); [Rhea 22195](https://www.rhea-db.org/rhea/22195) + [18448](https://www.rhea-db.org/rhea/18448) |
| purine.tsv:10 | 状态→已终审；备注补充 Rhea ID | [Rhea 15753](https://www.rhea-db.org/rhea/15753) + [Rhea 23922](https://www.rhea-db.org/rhea/23922) |
| purine.tsv:11 | 状态→已终审；备注补充 Rhea ID | [Rhea 11708](https://www.rhea-db.org/rhea/11708) (IMPDH) + [Rhea 11680](https://www.rhea-db.org/rhea/11680) (GMPS) |
| purine.tsv:13 | 酶名补充 NDPK；两步磷酸化 | [KEGG R00332](https://www.kegg.jp/entry/R00332) + [R00330](https://www.kegg.jp/entry/R00330); [Rhea 20783](https://www.rhea-db.org/rhea/20783) + [27689](https://www.rhea-db.org/rhea/27689) |
| nucleotide_degradation.tsv:8 | 次黄嘌呤经黄嘌呤生成尿酸 | [KEGG R01769](https://www.kegg.jp/entry/R01769) + [R02107](https://www.kegg.jp/entry/R02107); [Rhea 68013](https://www.rhea-db.org/rhea/68013) + [21135](https://www.rhea-db.org/rhea/21135) |
| nucleotide_degradation.tsv:9 | 鸟嘌呤经黄嘌呤生成尿酸 | [KEGG R01676](https://www.kegg.jp/entry/R01676) + [R02107](https://www.kegg.jp/entry/R02107); [Rhea 14668](https://www.rhea-db.org/rhea/14668) + [21135](https://www.rhea-db.org/rhea/21135) |
| nucleotide_degradation.tsv:10 | 三步净反应补回 NADPH/H⁺/NADP⁺ | [KEGG R00978](https://www.kegg.jp/entry/R00978) + [R02269](https://www.kegg.jp/entry/R02269) + [R00905](https://www.kegg.jp/entry/R00905) |
| nucleotide_degradation.tsv:11 | 三步净反应补回 NADPH/H⁺/NADP⁺ | [KEGG R01415](https://www.kegg.jp/entry/R01415) + [R03055](https://www.kegg.jp/entry/R03055) + [R04666](https://www.kegg.jp/entry/R04666) |
| cholesterol.tsv:8 | 三步净反应与 3 ATP 消耗 | [KEGG R02245](https://www.kegg.jp/entry/R02245) + [R03245](https://www.kegg.jp/entry/R03245) + [R01121](https://www.kegg.jp/entry/R01121) |
| plasmalogen.tsv:6 | 状态→已终审；备注补充 AGPS EC 号 | [Rhea 36171](https://www.rhea-db.org/rhea/36171); [EC 2.5.1.26](https://www.genome.jp/dbget-bin/www_bget?ec:2.5.1.26) |
| heme.tsv:8 | HMBS+UROS 两步净反应；旧 Rhea 19865 不对应，已移除 | [KEGG R00084](https://www.kegg.jp/entry/R00084) + [R03165](https://www.kegg.jp/entry/R03165); [Rhea 13188](https://www.rhea-db.org/rhea/13188) + [18968](https://www.rhea-db.org/rhea/18968) |
| pyrimidine.tsv:12 | 方程改为 UDP + thioredoxin(red) → dUDP + thioredoxin(ox) + H₂O；状态→已终审 | [Rhea 28028](https://www.rhea-db.org/rhea/28028); [EC 1.17.4.2](https://www.genome.jp/dbget-bin/www_bget?ec:1.17.4.2) |
| folate.tsv:7 | 方程补回 NADP⁺/H₂O/NADPH/H⁺；旧 Rhea 22892 不支持该 NADP 净反应，已替换 | [KEGG R01220](https://www.kegg.jp/entry/R01220) + [R01655](https://www.kegg.jp/entry/R01655); [Rhea 22815](https://www.rhea-db.org/rhea/22815) + [23703](https://www.rhea-db.org/rhea/23703) |

---

## 工具链验证结果

### 1. `node tools/validate.js`

```
=== 转录校验 ===
区室枚举: 20 个叶区室, 83 个可识别写法
反应文件: 55 个 → 316 条反应
其中被多条通路共享: 31 条
推导出节点: 291 个
节点补充属性: 12 条（其中带膜侧 11 条）
手工坐标覆盖: 47 个（其余由算法在区室范围内计算）
同一物质跨区室（自动互链）: 50 组

错误: 无
```

**结论**：validate 通过，无错误。

### 2. `node tools/layout.js`

```
=== 自动坐标 vs 你手摆的坐标 ===
对比 47 个节点   中位偏差 266px   平均 282px
最接近: 草酰乙酸(41)  琥珀酰辅酶 A(46)  NADH(83)
偏差最大: 葡萄糖-6-磷酸(521)  无机磷酸(527)  ATP(560)

说明：偏差大不代表算法错 —— 手摆坐标已作为覆盖永久保留，
这个对比只用来判断新转录的通路会被摆成什么样。
```

**结论**：layout 正常执行，坐标继承原有手工覆盖。

### 3. `node tools/compile.js`

```
=== 编译完成 ===
节点 291  反应 316  通路 55
坐标来源: 手工 47，开链 217，膜带 10，环形 17
待审校反应: 58/316
已写出 data-compiled.js
```

**结论**：compile 成功，待审校计数与 TSV 一致（58 行）。

**2026-08-07 当前更新**：修复端点级去重、ATP 合酶区室、参与物归一化和氮同化入口后，原 58 行队列又完成逐项复核，当前只读编译核对为 290 个节点、323 条反应、55 个通路，待审校 51/323。`data-compiled.js` 最新 SHA-256 见 `docs/audit-resolution-2026-08-07.md`。

---

## 是否可以称为"科学终稿"？

### 现状评估

- **结构完整性**：✅ 55 个 TSV 全部转录完成，323 条内容保留式去重反应，290 节点
- **区室枚举**：✅ 20 个叶区室，83 种同义词，无容器级区室残留
- **validate 校验**：✅ 无错误
- **跨通路一致性**：✅ 25 条共享反应已按完整反应身份正确合并
- **化学计量准确性**：⚠️ 部分行仍有合并多步或抽象类别表示，已在备注中说明
- **物种/组织标注**：⚠️ 部分植物特异通路（淀粉、氮同化等）未在本次审核范围内

### 结论

**当前状态不能宣称 100% 科学终审完成**。理由如下：

1. **51 行保留待审校**：审核当日 58 行中已有 7 行在后续复核中提升；其余行不是结构错误，而是科学边界尚未完全明确：
   - 抽象类别底物（如"氨基酸"→"丙酮酸"）无法用单一酶反应准确表示
   - 多步合并路径缺乏完整中间体/辅因子信息，不宜凭空补齐
   - 细胞事件（自噬、内吞、囊泡运输）本身不是化学计量反应
   - 部分区室归属或转运机制在文献中尚未完全阐明

2. **质量门禁有意保留**：这些待审校行反映了建模时的合理取舍——用"主链表示边"抽象化复杂路径。要关闭这些行，需要：
   - 补充具体物种、组织来源
   - 把合并步骤拆成真实中间体（增加节点和边）
   - 或者在备注中明确标注"示意性表示，非精确化学计量"

3. **建议下一步**：
   - 对保留待审校的 51 行，按 `data/review-log.tsv` 分组逐步审校
   - 对于抽象类别行，可考虑在备注中添加"示意性表示"标记，避免误导用户认为是精确反应
   - 对于多步合并行，如果 Reactome/KEGG 有完整中间体信息，可选择性拆分

### 剩余边界

在处理剩余 58 行「待审校」记录时，按以下边界执行：

1. **抽象类别行**（aa_carbon、transamination、lysosomal 等）：明确标注"示意性主链表示"，或拆分为具体氨基酸/单糖/脂质种类
2. **多步合并行**（aa_biosynthesis、aromatic_aa、purine、steroid_bile 等）：参考 Reactome/KEGG 补充中间体，或在备注中列出缺失的辅因子和中间步骤
3. **细胞事件行**（autophagy、lipoprotein、lysosomal、glycosylation）：保持抽象表示，但在图例或文档中说明这些是"细胞过程"而非"化学反应"
4. **区室归属行**（heme、pyrimidine、sphingolipid）：查阅文献确认转运蛋白身份，或标注"区室简化表示"

---

## 附录：TSV 修改日志

本次审核共修改 7 个 TSV 文件、14 行记录：

```
purine.tsv                 5 行修改 (line 7,9,10,11,13)
nucleotide_degradation.tsv 4 行修改 (line 8,9,10,11)
cholesterol.tsv            1 行修改 (line 8)
plasmalogen.tsv            1 行修改 (line 6)
heme.tsv                   1 行修改 (line 8)
pyrimidine.tsv             1 行修改 (line 12)
folate.tsv                 1 行修改 (line 7)
```

所有修改均已备份至 `C:\Users\wangjunyi\.qoderwork\workspace\mshagssl8cxyw7hz\backup-reactions\reactions\`，修改前后可用 diff 对比。

---

**报告生成时间**：2026-08-06 17:23 UTC+8  
**QoderWork 审核版本**：v1.0
