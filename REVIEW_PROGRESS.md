# 科学审校进度

更新时间：2026-08-19

## 当前基线

- 源数据：366 行
- 状态标记为已核对或已终审：326 行
- 待审校：40 行
- 状态分布：已终审 266；已核对 60；待审校 40
- 机器可识别引用覆盖：全部 33/366；已终审 28/266
- 注意：历史“已终审”状态不等于已满足当前证据门禁。

## 建议分类

建议分类由规则生成，只用于排队，不等于科学结论。

| 类别 | 行数 |
|---|---:|
| 区室机制 | 19 |
| 多步合并 | 9 |
| 抽象类别 | 8 |
| 细胞事件 | 4 |

## 文件进度

| 文件 | 待审校 | 已完成 |
|---|---:|---:|
| lysosomal.tsv | 5 | 0 |
| glycosylation.tsv | 4 | 0 |
| steroid_bile.tsv | 4 | 0 |
| aromatic_aa.tsv | 3 | 0 |
| autophagy.tsv | 3 | 0 |
| cholesterol.tsv | 3 | 0 |
| heme.tsv | 3 | 0 |
| bcaa.tsv | 2 | 0 |
| plasmalogen.tsv | 2 | 0 |
| uronic.tsv | 2 | 0 |
| aa_biosynthesis.tsv | 1 | 0 |
| folate.tsv | 1 | 0 |
| lipoprotein.tsv | 1 | 0 |
| nitrogen.tsv | 1 | 0 |
| purine.tsv | 1 | 0 |
| pyrimidine.tsv | 1 | 0 |
| sphingolipid.tsv | 1 | 0 |
| transamination.tsv | 1 | 0 |
| vlcfa.tsv | 1 | 0 |

## 质量门禁

- [x] 审校状态与表示类型分离
- [x] 禁止占位或未验证引用进入终审数据
- [ ] 逐行核对表示类型
- [ ] 逐行补充可验证证据
- [ ] 为历史已终审记录补齐机器可识别证据（28/266）
- [ ] 待审校记录降至 5 行以下
- [x] 端点、通路与场景入口的机器交叉验证
- [ ] 区室↔通路↔物种科学语义逐项复核

详细记录见 `data/review-log.tsv`，规则见 `docs/scientific-review-policy.md`。
