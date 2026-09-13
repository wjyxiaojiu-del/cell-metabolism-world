# 核心通路反应—证据清单

由 `node tools/generate-core-evidence.js --write` 生成；`--check` 只检查清单是否与源文件同步，不代表科学验收通过。

覆盖 21 条核心通路的 171 行 TSV 记录；备注有引用 24 行；含精确匹配的审校台账引用 24 行；待补引用 147 行。

范围：逐条记录物质转化、酶、方向和默认区室的核验入口。共享反应按源文件计数；本表不宣称覆盖页面全部讲解、机制叠图、物种或组织特异性结论。

引用分三层：有可识别 ID、来源内容支持具体结论、全部科学证据闭合。本表只自动统计第一层。已有引用仍须逐结论核验；原审校状态照录，不提升状态。

本次人工核验：[糖酵解十步的来源与边界](glycolysis-evidence-2026-09-07.md)。其余引用仅列出既有记录，未在本轮重新核验来源内容。

| 通路 | 源行数 | 备注有引用 | 待补引用（含台账） |
|---|---:|---:|---:|
| 丙酮酸脱氢酶复合体 | 3 | 0 | 3 |
| 三羧酸循环 | 9 | 0 | 9 |
| 苹果酸–天冬氨酸穿梭 | 10 | 0 | 10 |
| 甘油-3-磷酸穿梭 | 6 | 0 | 6 |
| 呼吸电子传递链 | 14 | 0 | 14 |
| 氧化磷酸化 | 10 | 0 | 10 |
| 糖酵解 | 10 | 10 | 0 |
| 糖异生 | 22 | 0 | 22 |
| 糖原合成 | 4 | 0 | 4 |
| 糖原分解 | 6 | 0 | 6 |
| 磷酸戊糖途径 | 8 | 0 | 8 |
| 脂肪酸合成 | 4 | 0 | 4 |
| 肉碱穿梭 | 6 | 0 | 6 |
| 脂肪酸 β-氧化 | 4 | 0 | 4 |
| 酮体生成与利用 | 7 | 0 | 7 |
| 转氨与氧化脱氨 | 4 | 1 | 3 |
| 尿素循环 | 11 | 0 | 11 |
| 氨基酸碳骨架归宿 | 7 | 0 | 7 |
| 嘌呤核苷酸从头合成 | 9 | 6 | 3 |
| 嘧啶核苷酸从头合成 | 11 | 3 | 8 |
| 核苷酸降解 | 6 | 4 | 2 |

## 丙酮酸脱氢酶复合体

| 源行 | 待核验结论 | 原状态 / 表示类型 | 备注来源 | 台账来源 | 证据状态 |
|---|---|---|---|---|---|
| [pdh.tsv:7](../../data/reactions/pdh.tsv#L7) | 丙酮酸@细胞质 ⇌ 丙酮酸@线粒体膜间隙；VDAC 外膜通道 | 已终审 / 未单列 | — | — | 待补引用 |
| [pdh.tsv:8](../../data/reactions/pdh.tsv#L8) | 丙酮酸@线粒体膜间隙 → 丙酮酸@线粒体基质；线粒体丙酮酸载体 MPC | 已终审 / 未单列 | — | — | 待补引用 |
| [pdh.tsv:9](../../data/reactions/pdh.tsv#L9) | 丙酮酸 → 乙酰辅酶 A；丙酮酸脱氢酶复合体 | 已核对 / 未单列 | — | — | 待补引用 |

## 三羧酸循环

| 源行 | 待核验结论 | 原状态 / 表示类型 | 备注来源 | 台账来源 | 证据状态 |
|---|---|---|---|---|---|
| [tca.tsv:7](../../data/reactions/tca.tsv#L7) | 乙酰辅酶 A → 柠檬酸；柠檬酸合酶 | 已核对 / 未单列 | — | — | 待补引用 |
| [tca.tsv:8](../../data/reactions/tca.tsv#L8) | 柠檬酸 ⇌ 异柠檬酸；顺乌头酸酶 | 已核对 / 未单列 | — | — | 待补引用 |
| [tca.tsv:9](../../data/reactions/tca.tsv#L9) | 异柠檬酸 → α-酮戊二酸；异柠檬酸脱氢酶 | 已核对 / 未单列 | — | — | 待补引用 |
| [tca.tsv:10](../../data/reactions/tca.tsv#L10) | α-酮戊二酸 → 琥珀酰辅酶 A；α-酮戊二酸脱氢酶复合体 | 已核对 / 未单列 | — | — | 待补引用 |
| [tca.tsv:11](../../data/reactions/tca.tsv#L11) | 琥珀酰辅酶 A ⇌ 琥珀酸；琥珀酰-CoA 合成酶 | 已核对 / 未单列 | — | — | 待补引用 |
| [tca.tsv:12](../../data/reactions/tca.tsv#L12) | 琥珀酸 → 延胡索酸；琥珀酸脱氢酶（复合体 II） | 已核对 / 未单列 | — | — | 待补引用 |
| [tca.tsv:13](../../data/reactions/tca.tsv#L13) | 延胡索酸 ⇌ 苹果酸；延胡索酸酶 | 已核对 / 未单列 | — | — | 待补引用 |
| [tca.tsv:14](../../data/reactions/tca.tsv#L14) | 苹果酸 ⇌ 草酰乙酸；线粒体苹果酸脱氢酶 MDH2 | 已核对 / 未单列 | — | — | 待补引用 |
| [tca.tsv:15](../../data/reactions/tca.tsv#L15) | 草酰乙酸 → 柠檬酸；柠檬酸合酶 | 已核对 / 未单列 | — | — | 待补引用 |

## 苹果酸–天冬氨酸穿梭

| 源行 | 待核验结论 | 原状态 / 表示类型 | 备注来源 | 台账来源 | 证据状态 |
|---|---|---|---|---|---|
| [malate_aspartate.tsv:6](../../data/reactions/malate_aspartate.tsv#L6) | 草酰乙酸@细胞质 ⇌ 苹果酸@细胞质；胞质苹果酸脱氢酶 MDH1 | 已终审 / 未单列 | — | — | 待补引用 |
| [malate_aspartate.tsv:7](../../data/reactions/malate_aspartate.tsv#L7) | NADH@细胞质 ⇌ NAD⁺@细胞质；胞质苹果酸脱氢酶 MDH1 | 已终审 / 未单列 | — | — | 待补引用 |
| [malate_aspartate.tsv:8](../../data/reactions/malate_aspartate.tsv#L8) | 苹果酸@细胞质 ⇌ 苹果酸@线粒体基质；苹果酸-α-KG 反向转运体 | 已终审 / 未单列 | — | — | 待补引用 |
| [malate_aspartate.tsv:9](../../data/reactions/malate_aspartate.tsv#L9) | α-酮戊二酸@线粒体基质 ⇌ α-酮戊二酸@细胞质；苹果酸-α-KG 反向转运体 SLC25A11 | 已终审 / 未单列 | — | — | 待补引用 |
| [malate_aspartate.tsv:10](../../data/reactions/malate_aspartate.tsv#L10) | 苹果酸@线粒体基质 ⇌ 草酰乙酸@线粒体基质；线粒体苹果酸脱氢酶 MDH2 | 已终审 / 未单列 | — | — | 待补引用 |
| [malate_aspartate.tsv:11](../../data/reactions/malate_aspartate.tsv#L11) | NAD⁺@线粒体基质 ⇌ NADH@线粒体基质；线粒体苹果酸脱氢酶 MDH2 | 已终审 / 未单列 | — | — | 待补引用 |
| [malate_aspartate.tsv:12](../../data/reactions/malate_aspartate.tsv#L12) | 草酰乙酸@线粒体基质 ⇌ 天冬氨酸@线粒体基质；线粒体天冬氨酸转氨酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [malate_aspartate.tsv:13](../../data/reactions/malate_aspartate.tsv#L13) | 天冬氨酸@线粒体基质 ⇌ 天冬氨酸@细胞质；天冬氨酸-谷氨酸载体 | 已终审 / 未单列 | — | — | 待补引用 |
| [malate_aspartate.tsv:14](../../data/reactions/malate_aspartate.tsv#L14) | 谷氨酸@细胞质 ⇌ 谷氨酸@线粒体基质；天冬氨酸-谷氨酸载体 SLC25A12/13 | 已终审 / 未单列 | — | — | 待补引用 |
| [malate_aspartate.tsv:15](../../data/reactions/malate_aspartate.tsv#L15) | 天冬氨酸@细胞质 ⇌ 草酰乙酸@细胞质；胞质天冬氨酸转氨酶 | 已终审 / 未单列 | — | — | 待补引用 |

## 甘油-3-磷酸穿梭

| 源行 | 待核验结论 | 原状态 / 表示类型 | 备注来源 | 台账来源 | 证据状态 |
|---|---|---|---|---|---|
| [glycerol_phosphate.tsv:5](../../data/reactions/glycerol_phosphate.tsv#L5) | 磷酸二羟丙酮 ⇌ 甘油-3-磷酸；胞质甘油-3-磷酸脱氢酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [glycerol_phosphate.tsv:6](../../data/reactions/glycerol_phosphate.tsv#L6) | NADH ⇌ NAD⁺；胞质甘油-3-磷酸脱氢酶 GPD1 | 已终审 / 未单列 | — | — | 待补引用 |
| [glycerol_phosphate.tsv:7](../../data/reactions/glycerol_phosphate.tsv#L7) | 甘油-3-磷酸@细胞质 ⇌ 甘油-3-磷酸@线粒体膜间隙；VDAC 外膜通道 | 已核对 / 未单列 | — | — | 待补引用 |
| [glycerol_phosphate.tsv:8](../../data/reactions/glycerol_phosphate.tsv#L8) | 甘油-3-磷酸@线粒体膜间隙 → 磷酸二羟丙酮@线粒体膜间隙；线粒体甘油-3-磷酸脱氢酶 GPD2 | 已终审 / 未单列 | — | — | 待补引用 |
| [glycerol_phosphate.tsv:9](../../data/reactions/glycerol_phosphate.tsv#L9) | 磷酸二羟丙酮@线粒体膜间隙 ⇌ 磷酸二羟丙酮@细胞质；VDAC 外膜通道 | 已核对 / 未单列 | — | — | 待补引用 |
| [glycerol_phosphate.tsv:10](../../data/reactions/glycerol_phosphate.tsv#L10) | 辅酶 Q@线粒体内膜 → 泛醇@线粒体内膜；线粒体甘油-3-磷酸脱氢酶 GPD2 | 已终审 / 未单列 | — | — | 待补引用 |

## 呼吸电子传递链

| 源行 | 待核验结论 | 原状态 / 表示类型 | 备注来源 | 台账来源 | 证据状态 |
|---|---|---|---|---|---|
| [etc.tsv:7](../../data/reactions/etc.tsv#L7) | NADH@线粒体基质 → 复合体 I；复合体 I | 已核对 / 未单列 | — | — | 待补引用 |
| [etc.tsv:8](../../data/reactions/etc.tsv#L8) | 复合体 I → 泛醇；复合体 I | 已核对 / 未单列 | — | — | 待补引用 |
| [etc.tsv:9](../../data/reactions/etc.tsv#L9) | 琥珀酸@线粒体基质 → 复合体 II；复合体 II | 已核对 / 未单列 | — | — | 待补引用 |
| [etc.tsv:10](../../data/reactions/etc.tsv#L10) | 复合体 II → 泛醇；复合体 II | 已核对 / 未单列 | — | — | 待补引用 |
| [etc.tsv:11](../../data/reactions/etc.tsv#L11) | 辅酶 Q → 泛醇；辅酶 Q 池 | 已核对 / 未单列 | — | — | 待补引用 |
| [etc.tsv:12](../../data/reactions/etc.tsv#L12) | 泛醇 → 复合体 III；复合体 III | 已核对 / 未单列 | — | — | 待补引用 |
| [etc.tsv:13](../../data/reactions/etc.tsv#L13) | 复合体 III → 细胞色素 c@线粒体膜间隙；复合体 III（bc1） | 已核对 / 未单列 | — | — | 待补引用 |
| [etc.tsv:14](../../data/reactions/etc.tsv#L14) | 细胞色素 c@线粒体膜间隙 → 复合体 IV；复合体 IV | 已核对 / 未单列 | — | — | 待补引用 |
| [etc.tsv:15](../../data/reactions/etc.tsv#L15) | 氧@线粒体基质 → 复合体 IV；复合体 IV | 已核对 / 未单列 | — | — | 待补引用 |
| [etc.tsv:16](../../data/reactions/etc.tsv#L16) | 复合体 IV → 水@线粒体基质；复合体 IV | 已核对 / 未单列 | — | — | 待补引用 |
| [etc.tsv:17](../../data/reactions/etc.tsv#L17) | 复合体 I → 膜间隙 H⁺@线粒体膜间隙；复合体 I 质子泵 | 已核对 / 未单列 | — | — | 待补引用 |
| [etc.tsv:18](../../data/reactions/etc.tsv#L18) | 复合体 III → 膜间隙 H⁺@线粒体膜间隙；复合体 III / Q循环 | 已核对 / 未单列 | — | — | 待补引用 |
| [etc.tsv:19](../../data/reactions/etc.tsv#L19) | 复合体 IV → 膜间隙 H⁺@线粒体膜间隙；复合体 IV 质子泵 | 已核对 / 未单列 | — | — | 待补引用 |
| [etc.tsv:20](../../data/reactions/etc.tsv#L20) | 膜间隙 H⁺@线粒体膜间隙 → 质子动力势；内膜电化学梯度 | 已核对 / 未单列 | — | — | 待补引用 |

## 氧化磷酸化

| 源行 | 待核验结论 | 原状态 / 表示类型 | 备注来源 | 台账来源 | 证据状态 |
|---|---|---|---|---|---|
| [oxphos.tsv:5](../../data/reactions/oxphos.tsv#L5) | 膜间隙 H⁺@线粒体膜间隙 → ATP 合酶@线粒体内膜；F₀F₁-ATP 合酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [oxphos.tsv:6](../../data/reactions/oxphos.tsv#L6) | ATP 合酶@线粒体内膜 → ATP@线粒体基质；F₀F₁-ATP 合酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [oxphos.tsv:7](../../data/reactions/oxphos.tsv#L7) | ADP@线粒体基质 → ATP@线粒体基质；ATP 合酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [oxphos.tsv:8](../../data/reactions/oxphos.tsv#L8) | 无机磷酸@线粒体基质 → ATP@线粒体基质；ATP 合酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [oxphos.tsv:9](../../data/reactions/oxphos.tsv#L9) | ATP@线粒体基质 ⇌ ATP@线粒体膜间隙；腺嘌呤核苷酸转位酶 ANT / SLC25A4 | 已终审 / 未单列 | — | — | 待补引用 |
| [oxphos.tsv:10](../../data/reactions/oxphos.tsv#L10) | ATP@线粒体膜间隙 ⇌ ATP@细胞质；VDAC 外膜通道 | 已终审 / 未单列 | — | — | 待补引用 |
| [oxphos.tsv:11](../../data/reactions/oxphos.tsv#L11) | ADP@细胞质 ⇌ ADP@线粒体膜间隙；VDAC 外膜通道 | 已终审 / 未单列 | — | — | 待补引用 |
| [oxphos.tsv:12](../../data/reactions/oxphos.tsv#L12) | ADP@线粒体膜间隙 ⇌ ADP@线粒体基质；腺嘌呤核苷酸转位酶 ANT / SLC25A4 | 已终审 / 未单列 | — | — | 待补引用 |
| [oxphos.tsv:13](../../data/reactions/oxphos.tsv#L13) | 无机磷酸@细胞质 ⇌ 无机磷酸@线粒体膜间隙；VDAC 外膜通道 | 已核对 / 未单列 | — | — | 待补引用 |
| [oxphos.tsv:14](../../data/reactions/oxphos.tsv#L14) | 无机磷酸@线粒体膜间隙 ⇌ 无机磷酸@线粒体基质；线粒体磷酸载体 SLC25A3 | 已终审 / 未单列 | — | — | 待补引用 |

## 糖酵解

| 源行 | 待核验结论 | 原状态 / 表示类型 | 备注来源 | 台账来源 | 证据状态 |
|---|---|---|---|---|---|
| [glycolysis.tsv:7](../../data/reactions/glycolysis.tsv#L7) | 葡萄糖 → 葡萄糖-6-磷酸；己糖激酶 | 已核对 / 未单列 | [KEGG:R01786](https://www.kegg.jp/entry/R01786) | — | 已有引用；其支持范围与其他结论待核验 |
| [glycolysis.tsv:8](../../data/reactions/glycolysis.tsv#L8) | 葡萄糖-6-磷酸 ⇌ 果糖-6-磷酸；磷酸葡萄糖异构酶 | 已核对 / 未单列 | [KEGG:R00771](https://www.kegg.jp/entry/R00771) | — | 已有引用；其支持范围与其他结论待核验 |
| [glycolysis.tsv:9](../../data/reactions/glycolysis.tsv#L9) | 果糖-6-磷酸 → 果糖-1,6-二磷酸；磷酸果糖激酶-1 | 已核对 / 未单列 | [KEGG:R00756](https://www.kegg.jp/entry/R00756) | — | 已有引用；其支持范围与其他结论待核验 |
| [glycolysis.tsv:10](../../data/reactions/glycolysis.tsv#L10) | 果糖-1,6-二磷酸 ⇌ 磷酸二羟丙酮；醛缩酶 | 已核对 / 未单列 | [KEGG:R01070](https://www.kegg.jp/entry/R01070) | — | 已有引用；其支持范围与其他结论待核验 |
| [glycolysis.tsv:11](../../data/reactions/glycolysis.tsv#L11) | 磷酸二羟丙酮 ⇌ 甘油醛-3-磷酸；磷酸丙糖异构酶 | 已核对 / 未单列 | [KEGG:R01015](https://www.kegg.jp/entry/R01015) | — | 已有引用；其支持范围与其他结论待核验 |
| [glycolysis.tsv:12](../../data/reactions/glycolysis.tsv#L12) | 甘油醛-3-磷酸 ⇌ 1,3-二磷酸甘油酸；甘油醛-3-磷酸脱氢酶 | 已核对 / 未单列 | [KEGG:R01061](https://www.kegg.jp/entry/R01061) | — | 已有引用；其支持范围与其他结论待核验 |
| [glycolysis.tsv:13](../../data/reactions/glycolysis.tsv#L13) | 1,3-二磷酸甘油酸 ⇌ 3-磷酸甘油酸；磷酸甘油酸激酶 | 已核对 / 未单列 | [KEGG:R01512](https://www.kegg.jp/entry/R01512) | — | 已有引用；其支持范围与其他结论待核验 |
| [glycolysis.tsv:14](../../data/reactions/glycolysis.tsv#L14) | 3-磷酸甘油酸 ⇌ 2-磷酸甘油酸；磷酸甘油酸变位酶 | 已核对 / 未单列 | [KEGG:R01518](https://www.kegg.jp/entry/R01518) | — | 已有引用；其支持范围与其他结论待核验 |
| [glycolysis.tsv:15](../../data/reactions/glycolysis.tsv#L15) | 2-磷酸甘油酸 ⇌ 磷酸烯醇式丙酮酸；烯醇化酶 | 已核对 / 未单列 | [KEGG:R00658](https://www.kegg.jp/entry/R00658) | — | 已有引用；其支持范围与其他结论待核验 |
| [glycolysis.tsv:16](../../data/reactions/glycolysis.tsv#L16) | 磷酸烯醇式丙酮酸 → 丙酮酸；丙酮酸激酶 | 已核对 / 未单列 | [KEGG:R00200](https://www.kegg.jp/entry/R00200) | — | 已有引用；其支持范围与其他结论待核验 |

## 糖异生

| 源行 | 待核验结论 | 原状态 / 表示类型 | 备注来源 | 台账来源 | 证据状态 |
|---|---|---|---|---|---|
| [gluconeogenesis.tsv:6](../../data/reactions/gluconeogenesis.tsv#L6) | 乳酸 ⇌ 丙酮酸；乳酸脱氢酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [gluconeogenesis.tsv:7](../../data/reactions/gluconeogenesis.tsv#L7) | 丙氨酸 ⇌ 丙酮酸；丙氨酸转氨酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [gluconeogenesis.tsv:8](../../data/reactions/gluconeogenesis.tsv#L8) | 丙酮酸@细胞质 ⇌ 丙酮酸@线粒体膜间隙；VDAC 外膜通道 | 已终审 / 未单列 | — | — | 待补引用 |
| [gluconeogenesis.tsv:9](../../data/reactions/gluconeogenesis.tsv#L9) | 丙酮酸@线粒体膜间隙 → 丙酮酸@线粒体基质；线粒体丙酮酸载体 MPC | 已终审 / 未单列 | — | — | 待补引用 |
| [gluconeogenesis.tsv:10](../../data/reactions/gluconeogenesis.tsv#L10) | 丙酮酸@线粒体基质 → 草酰乙酸@线粒体基质；丙酮酸羧化酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [gluconeogenesis.tsv:11](../../data/reactions/gluconeogenesis.tsv#L11) | 草酰乙酸@线粒体基质 ⇌ 苹果酸@线粒体基质；线粒体苹果酸脱氢酶 MDH2 | 已终审 / 未单列 | — | — | 待补引用 |
| [gluconeogenesis.tsv:12](../../data/reactions/gluconeogenesis.tsv#L12) | 苹果酸@线粒体基质 ⇌ 苹果酸@细胞质；苹果酸-α-KG 反向转运体 | 已终审 / 未单列 | — | — | 待补引用 |
| [gluconeogenesis.tsv:13](../../data/reactions/gluconeogenesis.tsv#L13) | 苹果酸@细胞质 ⇌ 草酰乙酸@细胞质；胞质苹果酸脱氢酶 MDH1 | 已终审 / 未单列 | — | — | 待补引用 |
| [gluconeogenesis.tsv:14](../../data/reactions/gluconeogenesis.tsv#L14) | 草酰乙酸@细胞质 → 磷酸烯醇式丙酮酸@细胞质；磷酸烯醇式丙酮酸羧激酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [gluconeogenesis.tsv:15](../../data/reactions/gluconeogenesis.tsv#L15) | 磷酸烯醇式丙酮酸 ⇌ 2-磷酸甘油酸；烯醇化酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [gluconeogenesis.tsv:16](../../data/reactions/gluconeogenesis.tsv#L16) | 2-磷酸甘油酸 ⇌ 3-磷酸甘油酸；磷酸甘油酸变位酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [gluconeogenesis.tsv:17](../../data/reactions/gluconeogenesis.tsv#L17) | 3-磷酸甘油酸 ⇌ 1,3-二磷酸甘油酸；磷酸甘油酸激酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [gluconeogenesis.tsv:18](../../data/reactions/gluconeogenesis.tsv#L18) | 1,3-二磷酸甘油酸 ⇌ 甘油醛-3-磷酸；甘油醛-3-磷酸脱氢酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [gluconeogenesis.tsv:19](../../data/reactions/gluconeogenesis.tsv#L19) | 甘油醛-3-磷酸 ⇌ 磷酸二羟丙酮；磷酸丙糖异构酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [gluconeogenesis.tsv:20](../../data/reactions/gluconeogenesis.tsv#L20) | 甘油醛-3-磷酸 ⇌ 果糖-1,6-二磷酸；醛缩酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [gluconeogenesis.tsv:21](../../data/reactions/gluconeogenesis.tsv#L21) | 果糖-1,6-二磷酸 → 果糖-6-磷酸；果糖-1,6-二磷酸酶-1 | 已终审 / 未单列 | — | — | 待补引用 |
| [gluconeogenesis.tsv:22](../../data/reactions/gluconeogenesis.tsv#L22) | 果糖-6-磷酸 ⇌ 葡萄糖-6-磷酸；磷酸葡萄糖异构酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [gluconeogenesis.tsv:23](../../data/reactions/gluconeogenesis.tsv#L23) | 葡萄糖-6-磷酸@细胞质 ⇌ 葡萄糖-6-磷酸@内质网腔；葡萄糖-6-磷酸转位酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [gluconeogenesis.tsv:24](../../data/reactions/gluconeogenesis.tsv#L24) | 葡萄糖-6-磷酸@内质网腔 → 葡萄糖@内质网腔；葡萄糖-6-磷酸酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [gluconeogenesis.tsv:25](../../data/reactions/gluconeogenesis.tsv#L25) | 葡萄糖@内质网腔 ⇌ 葡萄糖@细胞质；葡萄糖转位酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [gluconeogenesis.tsv:26](../../data/reactions/gluconeogenesis.tsv#L26) | 甘油 → 甘油-3-磷酸；甘油激酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [gluconeogenesis.tsv:27](../../data/reactions/gluconeogenesis.tsv#L27) | 甘油-3-磷酸 ⇌ 磷酸二羟丙酮；胞质甘油-3-磷酸脱氢酶 | 已终审 / 未单列 | — | — | 待补引用 |

## 糖原合成

| 源行 | 待核验结论 | 原状态 / 表示类型 | 备注来源 | 台账来源 | 证据状态 |
|---|---|---|---|---|---|
| [glycogenesis.tsv:5](../../data/reactions/glycogenesis.tsv#L5) | 葡萄糖 → 葡萄糖-6-磷酸；己糖激酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [glycogenesis.tsv:6](../../data/reactions/glycogenesis.tsv#L6) | 葡萄糖-6-磷酸 ⇌ 葡萄糖-1-磷酸；磷酸葡萄糖变位酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [glycogenesis.tsv:7](../../data/reactions/glycogenesis.tsv#L7) | 葡萄糖-1-磷酸 → UDP-葡萄糖；UDP-葡萄糖焦磷酸化酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [glycogenesis.tsv:8](../../data/reactions/glycogenesis.tsv#L8) | UDP-葡萄糖 → 糖原；糖原合酶 | 已终审 / 未单列 | — | — | 待补引用 |

## 糖原分解

| 源行 | 待核验结论 | 原状态 / 表示类型 | 备注来源 | 台账来源 | 证据状态 |
|---|---|---|---|---|---|
| [glycogenolysis.tsv:6](../../data/reactions/glycogenolysis.tsv#L6) | 糖原 → 葡萄糖-1-磷酸；糖原磷酸化酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [glycogenolysis.tsv:7](../../data/reactions/glycogenolysis.tsv#L7) | 糖原 → 葡萄糖@细胞质；糖原去分支酶 AGL（α-1,6-葡萄糖苷酶活性） | 已终审 / 未单列 | — | — | 待补引用 |
| [glycogenolysis.tsv:8](../../data/reactions/glycogenolysis.tsv#L8) | 葡萄糖-1-磷酸 ⇌ 葡萄糖-6-磷酸；磷酸葡萄糖变位酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [glycogenolysis.tsv:9](../../data/reactions/glycogenolysis.tsv#L9) | 葡萄糖-6-磷酸@细胞质 ⇌ 葡萄糖-6-磷酸@内质网腔；葡萄糖-6-磷酸转位酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [glycogenolysis.tsv:10](../../data/reactions/glycogenolysis.tsv#L10) | 葡萄糖-6-磷酸@内质网腔 → 葡萄糖@内质网腔；葡萄糖-6-磷酸酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [glycogenolysis.tsv:11](../../data/reactions/glycogenolysis.tsv#L11) | 葡萄糖@内质网腔 ⇌ 葡萄糖@细胞质；葡萄糖转位酶 | 已终审 / 未单列 | — | — | 待补引用 |

## 磷酸戊糖途径

| 源行 | 待核验结论 | 原状态 / 表示类型 | 备注来源 | 台账来源 | 证据状态 |
|---|---|---|---|---|---|
| [ppp.tsv:6](../../data/reactions/ppp.tsv#L6) | 葡萄糖-6-磷酸 → 6-磷酸葡萄糖酸内酯；葡萄糖-6-磷酸脱氢酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [ppp.tsv:7](../../data/reactions/ppp.tsv#L7) | 6-磷酸葡萄糖酸内酯 ⇌ 6-磷酸葡萄糖酸；6-磷酸葡萄糖酸内酯酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [ppp.tsv:8](../../data/reactions/ppp.tsv#L8) | 6-磷酸葡萄糖酸 → 核酮糖-5-磷酸；6-磷酸葡萄糖酸脱氢酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [ppp.tsv:9](../../data/reactions/ppp.tsv#L9) | 核酮糖-5-磷酸 ⇌ 核糖-5-磷酸；核糖-5-磷酸异构酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [ppp.tsv:10](../../data/reactions/ppp.tsv#L10) | 核酮糖-5-磷酸 ⇌ 木酮糖-5-磷酸；核酮糖-5-磷酸-3-差向异构酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [ppp.tsv:11](../../data/reactions/ppp.tsv#L11) | 木酮糖-5-磷酸 ⇌ 甘油醛-3-磷酸；转酮醇酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [ppp.tsv:12](../../data/reactions/ppp.tsv#L12) | 景天庚酮糖-7-磷酸 ⇌ 果糖-6-磷酸；转醛醇酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [ppp.tsv:13](../../data/reactions/ppp.tsv#L13) | 赤藓糖-4-磷酸 ⇌ 果糖-6-磷酸；转酮醇酶 | 已终审 / 未单列 | — | — | 待补引用 |

## 脂肪酸合成

| 源行 | 待核验结论 | 原状态 / 表示类型 | 备注来源 | 台账来源 | 证据状态 |
|---|---|---|---|---|---|
| [fa_synthesis.tsv:5](../../data/reactions/fa_synthesis.tsv#L5) | 柠檬酸 → 乙酰辅酶 A；ATP 柠檬酸裂解酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [fa_synthesis.tsv:6](../../data/reactions/fa_synthesis.tsv#L6) | 乙酰辅酶 A → 丙二酰-CoA；乙酰-CoA 羧化酶 ACC | 已终审 / 未单列 | — | — | 待补引用 |
| [fa_synthesis.tsv:7](../../data/reactions/fa_synthesis.tsv#L7) | 丙二酰-CoA → 棕榈酸；脂肪酸合酶 FAS | 已终审 / 未单列 | — | — | 待补引用 |
| [fa_synthesis.tsv:8](../../data/reactions/fa_synthesis.tsv#L8) | NADPH → 棕榈酸；脂肪酸合酶 FAS | 已终审 / 未单列 | — | — | 待补引用 |

## 肉碱穿梭

| 源行 | 待核验结论 | 原状态 / 表示类型 | 备注来源 | 台账来源 | 证据状态 |
|---|---|---|---|---|---|
| [carnitine.tsv:6](../../data/reactions/carnitine.tsv#L6) | 脂酰-CoA@细胞质 ⇌ 脂酰肉碱@细胞质；肉碱棕榈酰转移酶 1 CPT1 | 已终审 / 未单列 | — | — | 待补引用 |
| [carnitine.tsv:7](../../data/reactions/carnitine.tsv#L7) | 肉碱@细胞质 ⇌ 脂酰肉碱@细胞质；肉碱棕榈酰转移酶 1 CPT1 | 已终审 / 未单列 | — | — | 待补引用 |
| [carnitine.tsv:8](../../data/reactions/carnitine.tsv#L8) | 脂酰肉碱@细胞质 ⇌ 脂酰肉碱@线粒体膜间隙；VDAC 外膜通道 | 已核对 / 未单列 | — | — | 待补引用 |
| [carnitine.tsv:9](../../data/reactions/carnitine.tsv#L9) | 脂酰肉碱@线粒体膜间隙 ⇌ 脂酰肉碱@线粒体基质；肉碱-脂酰肉碱转位酶 CACT | 已终审 / 未单列 | — | — | 待补引用 |
| [carnitine.tsv:10](../../data/reactions/carnitine.tsv#L10) | 肉碱@线粒体基质 ⇌ 肉碱@线粒体膜间隙；肉碱-脂酰肉碱转位酶 CACT / SLC25A20 | 已终审 / 未单列 | — | — | 待补引用 |
| [carnitine.tsv:11](../../data/reactions/carnitine.tsv#L11) | 脂酰肉碱@线粒体基质 ⇌ 脂酰-CoA@线粒体基质；肉碱棕榈酰转移酶 2 CPT2 | 已终审 / 未单列 | — | — | 待补引用 |

## 脂肪酸 β-氧化

| 源行 | 待核验结论 | 原状态 / 表示类型 | 备注来源 | 台账来源 | 证据状态 |
|---|---|---|---|---|---|
| [beta_oxidation.tsv:6](../../data/reactions/beta_oxidation.tsv#L6) | 脂酰-CoA → 烯酰-CoA；脂酰-CoA 脱氢酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [beta_oxidation.tsv:7](../../data/reactions/beta_oxidation.tsv#L7) | 烯酰-CoA ⇌ β-羟脂酰-CoA；烯酰-CoA 水合酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [beta_oxidation.tsv:8](../../data/reactions/beta_oxidation.tsv#L8) | β-羟脂酰-CoA → β-酮脂酰-CoA；β-羟脂酰-CoA 脱氢酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [beta_oxidation.tsv:9](../../data/reactions/beta_oxidation.tsv#L9) | β-酮脂酰-CoA → 乙酰辅酶 A；β-酮硫解酶 | 已终审 / 未单列 | — | — | 待补引用 |

## 酮体生成与利用

| 源行 | 待核验结论 | 原状态 / 表示类型 | 备注来源 | 台账来源 | 证据状态 |
|---|---|---|---|---|---|
| [ketone.tsv:6](../../data/reactions/ketone.tsv#L6) | 乙酰辅酶 A ⇌ 乙酰乙酰辅酶 A；硫解酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [ketone.tsv:7](../../data/reactions/ketone.tsv#L7) | 乙酰乙酰辅酶 A → HMG-CoA；HMG-CoA 合成酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [ketone.tsv:8](../../data/reactions/ketone.tsv#L8) | HMG-CoA → 乙酰乙酸；HMG-CoA 裂解酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [ketone.tsv:9](../../data/reactions/ketone.tsv#L9) | 乙酰乙酸 ⇌ β-羟丁酸；β-羟丁酸脱氢酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [ketone.tsv:10](../../data/reactions/ketone.tsv#L10) | 乙酰乙酸 → 乙酰乙酰辅酶 A；琥珀酰-CoA:3-酮酸 CoA 转移酶 SCOT | 已终审 / 未单列 | — | — | 待补引用 |
| [ketone.tsv:11](../../data/reactions/ketone.tsv#L11) | 乙酰乙酰辅酶 A → 乙酰辅酶 A；β-酮硫解酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [ketone.tsv:12](../../data/reactions/ketone.tsv#L12) | β-羟丁酸 ⇌ 乙酰乙酸；β-羟丁酸脱氢酶 | 已终审 / 未单列 | — | — | 待补引用 |

## 转氨与氧化脱氨

| 源行 | 待核验结论 | 原状态 / 表示类型 | 备注来源 | 台账来源 | 证据状态 |
|---|---|---|---|---|---|
| [transamination.tsv:6](../../data/reactions/transamination.tsv#L6) | 氨基酸 ⇌ α-酮酸；氨基转移酶 | 已终审 / 示意边 | [R-HSA-8964539](https://reactome.org/content/detail/R-HSA-8964539) | [R-HSA-8964539](https://reactome.org/content/detail/R-HSA-8964539) | 已有引用；其支持范围与其他结论待核验 |
| [transamination.tsv:7](../../data/reactions/transamination.tsv#L7) | 谷氨酸@细胞质 → 谷氨酸@线粒体基质；线粒体谷氨酸/H⁺同向载体 SLC25A18/22 | 已终审 / 未单列 | — | — | 待补引用 |
| [transamination.tsv:8](../../data/reactions/transamination.tsv#L8) | 谷氨酸@线粒体基质 ⇌ α-酮戊二酸@线粒体基质；谷氨酸脱氢酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [transamination.tsv:9](../../data/reactions/transamination.tsv#L9) | 谷氨酸@线粒体基质 ⇌ NH₄⁺@线粒体基质；谷氨酸脱氢酶 | 已终审 / 未单列 | — | — | 待补引用 |

## 尿素循环

| 源行 | 待核验结论 | 原状态 / 表示类型 | 备注来源 | 台账来源 | 证据状态 |
|---|---|---|---|---|---|
| [urea.tsv:6](../../data/reactions/urea.tsv#L6) | NH₄⁺@线粒体基质 → 氨甲酰磷酸@线粒体基质；氨甲酰磷酸合成酶 I | 已终审 / 未单列 | — | — | 待补引用 |
| [urea.tsv:7](../../data/reactions/urea.tsv#L7) | 氨甲酰磷酸@线粒体基质 → 瓜氨酸@线粒体基质；鸟氨酸氨甲酰基转移酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [urea.tsv:8](../../data/reactions/urea.tsv#L8) | 鸟氨酸@线粒体基质 → 瓜氨酸@线粒体基质；鸟氨酸氨甲酰基转移酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [urea.tsv:9](../../data/reactions/urea.tsv#L9) | 瓜氨酸@线粒体基质 ⇌ 瓜氨酸@细胞质；鸟氨酸/瓜氨酸反向转运体 ORNT1 / SLC25A15 | 已终审 / 未单列 | — | — | 待补引用 |
| [urea.tsv:10](../../data/reactions/urea.tsv#L10) | 瓜氨酸@细胞质 → 精氨代琥珀酸@细胞质；精氨代琥珀酸合成酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [urea.tsv:11](../../data/reactions/urea.tsv#L11) | 天冬氨酸@细胞质 → 精氨代琥珀酸@细胞质；精氨代琥珀酸合成酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [urea.tsv:12](../../data/reactions/urea.tsv#L12) | 精氨代琥珀酸@细胞质 → 精氨酸@细胞质；精氨代琥珀酸裂解酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [urea.tsv:13](../../data/reactions/urea.tsv#L13) | 精氨代琥珀酸@细胞质 → 延胡索酸@细胞质；精氨代琥珀酸裂解酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [urea.tsv:14](../../data/reactions/urea.tsv#L14) | 精氨酸@细胞质 → 鸟氨酸@细胞质；精氨酸酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [urea.tsv:15](../../data/reactions/urea.tsv#L15) | 精氨酸@细胞质 → 尿素@细胞质；精氨酸酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [urea.tsv:16](../../data/reactions/urea.tsv#L16) | 鸟氨酸@细胞质 ⇌ 鸟氨酸@线粒体基质；鸟氨酸/瓜氨酸反向转运体 ORNT1 / SLC25A15 | 已终审 / 未单列 | — | — | 待补引用 |

## 氨基酸碳骨架归宿

| 源行 | 待核验结论 | 原状态 / 表示类型 | 备注来源 | 台账来源 | 证据状态 |
|---|---|---|---|---|---|
| [aa_carbon.tsv:6](../../data/reactions/aa_carbon.tsv#L6) | 丙氨酸/半胱氨酸/甘氨酸/丝氨酸/苏氨酸/色氨酸@细胞质 → 丙酮酸@细胞质；多步分解路径（类别映射） | 已核对 / 未单列 | — | — | 待补引用 |
| [aa_carbon.tsv:7](../../data/reactions/aa_carbon.tsv#L7) | 异亮氨酸/亮氨酸/苏氨酸/色氨酸@线粒体基质 → 乙酰辅酶 A@线粒体基质；多步生酮分解路径（类别映射） | 已核对 / 未单列 | — | — | 待补引用 |
| [aa_carbon.tsv:8](../../data/reactions/aa_carbon.tsv#L8) | 亮氨酸/赖氨酸/苯丙氨酸/酪氨酸/色氨酸@线粒体基质 → 乙酰乙酰辅酶 A@线粒体基质；多步生酮分解路径（类别映射） | 已核对 / 未单列 | — | — | 待补引用 |
| [aa_carbon.tsv:9](../../data/reactions/aa_carbon.tsv#L9) | 谷氨酸/谷氨酰胺/精氨酸/脯氨酸/组氨酸@线粒体基质 → α-酮戊二酸@线粒体基质；谷氨酸汇聚与多步分解（类别映射） | 已核对 / 未单列 | — | — | 待补引用 |
| [aa_carbon.tsv:10](../../data/reactions/aa_carbon.tsv#L10) | 缬氨酸/异亮氨酸/蛋氨酸/苏氨酸@线粒体基质 → 琥珀酰辅酶 A@线粒体基质；丙酰-CoA/甲基丙二酰-CoA路径（类别映射） | 已核对 / 未单列 | — | — | 待补引用 |
| [aa_carbon.tsv:11](../../data/reactions/aa_carbon.tsv#L11) | 苯丙氨酸/酪氨酸@细胞质 → 延胡索酸@细胞质；酪氨酸分解路径（类别映射） | 已核对 / 未单列 | — | — | 待补引用 |
| [aa_carbon.tsv:12](../../data/reactions/aa_carbon.tsv#L12) | 天冬氨酸/天冬酰胺@细胞质 → 草酰乙酸@细胞质；天冬氨酸转氨及天冬酰胺水解（类别映射） | 已核对 / 未单列 | — | — | 待补引用 |

## 嘌呤核苷酸从头合成

| 源行 | 待核验结论 | 原状态 / 表示类型 | 备注来源 | 台账来源 | 证据状态 |
|---|---|---|---|---|---|
| [purine.tsv:5](../../data/reactions/purine.tsv#L5) | 核糖-5-磷酸 → PRPP；PRPP 合成酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [purine.tsv:6](../../data/reactions/purine.tsv#L6) | PRPP → 5-磷酸核糖胺；谷氨酰胺-PRPP 酰胺转移酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [purine.tsv:7](../../data/reactions/purine.tsv#L7) | 5-磷酸核糖胺 → GAR；GAR synthetase (GART) | 已终审 / 未单列 | [KEGG:R04144](https://www.kegg.jp/entry/R04144)、[RHEA:17456](https://www.rhea-db.org/rhea/17456) | — | 已有引用；其支持范围与其他结论待核验 |
| [purine.tsv:8](../../data/reactions/purine.tsv#L8) | GAR → AICAR；多酶复合体 | 已终审 / 示意边 | [R-HSA-73817](https://reactome.org/content/detail/R-HSA-73817) | [R-HSA-73817](https://reactome.org/content/detail/R-HSA-73817) | 已有引用；其支持范围与其他结论待核验 |
| [purine.tsv:9](../../data/reactions/purine.tsv#L9) | AICAR → IMP；AICAR 转化酶/IMP 环水解酶 (ATIC) | 已终审 / 未单列 | [KEGG:R04560](https://www.kegg.jp/entry/R04560)、[KEGG:R01127](https://www.kegg.jp/entry/R01127)、[RHEA:22195](https://www.rhea-db.org/rhea/22195)、[RHEA:18448](https://www.rhea-db.org/rhea/18448) | — | 已有引用；其支持范围与其他结论待核验 |
| [purine.tsv:10](../../data/reactions/purine.tsv#L10) | IMP → AMP；腺苷酸琥珀酸合成/裂解酶系 | 已终审 / 未单列 | [RHEA:15753](https://www.rhea-db.org/rhea/15753)、[RHEA:23922](https://www.rhea-db.org/rhea/23922) | — | 已有引用；其支持范围与其他结论待核验 |
| [purine.tsv:11](../../data/reactions/purine.tsv#L11) | IMP → GMP；IMP 脱氢酶/GMP 合成酶 | 已终审 / 未单列 | [RHEA:11708](https://www.rhea-db.org/rhea/11708)、[RHEA:11680](https://www.rhea-db.org/rhea/11680) | — | 已有引用；其支持范围与其他结论待核验 |
| [purine.tsv:12](../../data/reactions/purine.tsv#L12) | AMP ⇌ ATP；腺苷酸激酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [purine.tsv:13](../../data/reactions/purine.tsv#L13) | GMP ⇌ GTP；鸟苷酸激酶/nucleoside diphosphate kinase | 已终审 / 未单列 | [KEGG:R00332](https://www.kegg.jp/entry/R00332)、[KEGG:R00330](https://www.kegg.jp/entry/R00330)、[RHEA:20783](https://www.rhea-db.org/rhea/20783)、[RHEA:27689](https://www.rhea-db.org/rhea/27689) | — | 已有引用；其支持范围与其他结论待核验 |

## 嘧啶核苷酸从头合成

| 源行 | 待核验结论 | 原状态 / 表示类型 | 备注来源 | 台账来源 | 证据状态 |
|---|---|---|---|---|---|
| [pyrimidine.tsv:5](../../data/reactions/pyrimidine.tsv#L5) | 谷氨酰胺 → 氨甲酰磷酸；氨甲酰磷酸合成酶 II | 已终审 / 未单列 | — | — | 待补引用 |
| [pyrimidine.tsv:6](../../data/reactions/pyrimidine.tsv#L6) | 氨甲酰磷酸 → 氨甲酰天冬氨酸；天冬氨酸转氨甲酰酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [pyrimidine.tsv:7](../../data/reactions/pyrimidine.tsv#L7) | 氨甲酰天冬氨酸 → 二氢乳清酸；二氢乳清酸酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [pyrimidine.tsv:8](../../data/reactions/pyrimidine.tsv#L8) | 二氢乳清酸@细胞质 → 乳清酸@细胞质；二氢乳清酸脱氢酶 DHODH | 已终审 / 精确反应 | [R-HSA-73569](https://reactome.org/content/detail/R-HSA-73569)、[RHEA:30190](https://www.rhea-db.org/rhea/30190)、[KEGG:R01868](https://www.kegg.jp/entry/R01868) | [RHEA:30190](https://www.rhea-db.org/rhea/30190)、[KEGG:R01868](https://www.kegg.jp/entry/R01868)、[R-HSA-73569](https://reactome.org/content/detail/R-HSA-73569) | 已有引用；其支持范围与其他结论待核验 |
| [pyrimidine.tsv:9](../../data/reactions/pyrimidine.tsv#L9) | 乳清酸 → UMP；乳清酸磷酸核糖转移酶/乳清酸核苷酸脱羧酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [pyrimidine.tsv:10](../../data/reactions/pyrimidine.tsv#L10) | UMP ⇌ UTP；核苷酸激酶系 | 已终审 / 未单列 | — | — | 待补引用 |
| [pyrimidine.tsv:11](../../data/reactions/pyrimidine.tsv#L11) | UTP → CTP；CTP 合成酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [pyrimidine.tsv:12](../../data/reactions/pyrimidine.tsv#L12) | UDP → dUDP；核糖核苷酸还原酶 | 已终审 / 未单列 | [RHEA:28028](https://www.rhea-db.org/rhea/28028) | — | 已有引用；其支持范围与其他结论待核验 |
| [pyrimidine.tsv:13](../../data/reactions/pyrimidine.tsv#L13) | dUDP ⇌ dUTP；核苷二磷酸激酶 NDPK | 已终审 / 未单列 | — | — | 待补引用 |
| [pyrimidine.tsv:14](../../data/reactions/pyrimidine.tsv#L14) | dUTP → dUMP；dUTPase DUT | 已终审 / 未单列 | — | — | 待补引用 |
| [pyrimidine.tsv:15](../../data/reactions/pyrimidine.tsv#L15) | dUMP → dTMP；胸苷酸合成酶 TYMS | 已终审 / 精确反应 | [R-HSA-73605](https://reactome.org/content/detail/R-HSA-73605)、[RHEA:12105](https://www.rhea-db.org/rhea/12105) | [R-HSA-73605](https://reactome.org/content/detail/R-HSA-73605)、[RHEA:12105](https://www.rhea-db.org/rhea/12105) | 已有引用；其支持范围与其他结论待核验 |

## 核苷酸降解

| 源行 | 待核验结论 | 原状态 / 表示类型 | 备注来源 | 台账来源 | 证据状态 |
|---|---|---|---|---|---|
| [nucleotide_degradation.tsv:5](../../data/reactions/nucleotide_degradation.tsv#L5) | 核苷酸 → 核苷；核苷酸酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [nucleotide_degradation.tsv:6](../../data/reactions/nucleotide_degradation.tsv#L6) | 核苷 ⇌ 碱基；核苷磷酸化酶 | 已终审 / 未单列 | — | — | 待补引用 |
| [nucleotide_degradation.tsv:7](../../data/reactions/nucleotide_degradation.tsv#L7) | 次黄嘌呤 → 尿酸；黄嘌呤氧化酶 | 已终审 / 未单列 | [KEGG:R01769](https://www.kegg.jp/entry/R01769)、[KEGG:R02107](https://www.kegg.jp/entry/R02107)、[RHEA:68013](https://www.rhea-db.org/rhea/68013)、[RHEA:21135](https://www.rhea-db.org/rhea/21135) | — | 已有引用；其支持范围与其他结论待核验 |
| [nucleotide_degradation.tsv:8](../../data/reactions/nucleotide_degradation.tsv#L8) | 鸟嘌呤 → 尿酸；鸟嘌呤脱氨酶/黄嘌呤氧化酶 | 已终审 / 未单列 | [KEGG:R01676](https://www.kegg.jp/entry/R01676)、[KEGG:R02107](https://www.kegg.jp/entry/R02107)、[RHEA:14668](https://www.rhea-db.org/rhea/14668)、[RHEA:21135](https://www.rhea-db.org/rhea/21135) | — | 已有引用；其支持范围与其他结论待核验 |
| [nucleotide_degradation.tsv:9](../../data/reactions/nucleotide_degradation.tsv#L9) | 尿嘧啶 → β-丙氨酸；嘧啶降解酶系 | 已终审 / 未单列 | [KEGG:R00978](https://www.kegg.jp/entry/R00978)、[KEGG:R02269](https://www.kegg.jp/entry/R02269)、[KEGG:R00905](https://www.kegg.jp/entry/R00905)、[RHEA:18096](https://www.rhea-db.org/rhea/18096)、[RHEA:16124](https://www.rhea-db.org/rhea/16124)、[RHEA:11187](https://www.rhea-db.org/rhea/11187) | — | 已有引用；其支持范围与其他结论待核验 |
| [nucleotide_degradation.tsv:10](../../data/reactions/nucleotide_degradation.tsv#L10) | 胸腺嘧啶 → β-氨基异丁酸；嘧啶降解酶系 | 已终审 / 未单列 | [KEGG:R01415](https://www.kegg.jp/entry/R01415)、[KEGG:R03055](https://www.kegg.jp/entry/R03055)、[KEGG:R04666](https://www.kegg.jp/entry/R04666)、[RHEA:58287](https://www.rhea-db.org/rhea/58287) | — | 已有引用；其支持范围与其他结论待核验 |
