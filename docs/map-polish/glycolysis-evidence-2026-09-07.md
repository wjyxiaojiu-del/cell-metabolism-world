# 糖酵解反应引用补录

核验日期：2026-09-07。已打开 KEGG 官方 REST 条目，逐项核对 DEFINITION、EQUATION 和 ENZYME。
本次只补反应与酶身份的来源，不改变反应方向、区室、调节结论或原有「已核对」状态，不代替负责人签核。

| 源行 | 反应 | 官方来源 | 支持范围与边界 |
|---:|---|---|---|
| 7 | 葡萄糖 → G6P | [KEGG:R01786](https://www.kegg.jp/entry/R01786) | ATP 供磷酸，EC 2.7.1.1；条目明确 α-D 异头体，地图省略异头体 |
| 8 | G6P ⇌ F6P | [KEGG:R00771](https://www.kegg.jp/entry/R00771) | 己糖磷酸异构，EC 5.3.1.9 |
| 9 | F6P → F-1,6-BP | [KEGG:R00756](https://www.kegg.jp/entry/R00756) | ATP 供磷酸，EC 2.7.1.11；不据此证明限速或体内不可逆 |
| 10 | F-1,6-BP ⇌ DHAP + G3P | [KEGG:R01070](https://www.kegg.jp/entry/R01070) | 醛缩酶裂解，EC 4.1.2.13；条目明确 β-D 异头体，地图省略异头体 |
| 11 | DHAP ⇌ G3P | [KEGG:R01015](https://www.kegg.jp/entry/R01015) | 丙糖磷酸异构，EC 5.3.1.1；数据库将 G3P 写在左侧 |
| 12 | G3P ⇌ 1,3-BPG | [KEGG:R01061](https://www.kegg.jp/entry/R01061) | NAD⁺、Pi 参与并生成 NADH、H⁺，EC 1.2.1.12 |
| 13 | 1,3-BPG ⇌ 3-PG | [KEGG:R01512](https://www.kegg.jp/entry/R01512) | 与 ADP/ATP 偶联，EC 2.7.2.3；数据库反向书写 |
| 14 | 3-PG ⇌ 2-PG | [KEGG:R01518](https://www.kegg.jp/entry/R01518) | 磷酸基团变位，EC 5.4.2.11/12；数据库反向书写 |
| 15 | 2-PG ⇌ PEP | [KEGG:R00658](https://www.kegg.jp/entry/R00658) | 烯醇化酶脱水，EC 4.2.1.11 |
| 16 | PEP → 丙酮酸 | [KEGG:R00200](https://www.kegg.jp/entry/R00200) | 与 ADP/ATP 偶联，EC 2.7.1.40；数据库反向书写，不据此证明体内可逆 |

KEGG 的可逆符号和书写方向不是特定生理条件下净通量方向的直接证据。区室、组织、不可逆关卡和调控结论仍需逐项核验。
十行源数据均保留原状态，本记录不把「有引用」等同于「证据闭合」。
