# 外部审核任务：细胞代谢地图科学复核与 UI 回归

> 角色边界：Codex 是项目主开发者并负责所有实施；外部模型只做独立只读审核，返回问题清单，不直接修改项目文件。

> 2026-08-06 的第二轮审核报告保留为历史记录，其中若干反应和引用已在 2026-08-07 纠正。本任务书与 `REVIEW_PROGRESS.md` 才是当前基线。

## 项目位置

`D:\wangjunyi\Documents\cell Metabolism world`

先阅读：

1. `docs/scientific-review-policy.md`：当前审校状态、表示类型和证据门禁
2. `REVIEW_PROGRESS.md` 与 `data/review-log.tsv`：原 58 行队列的逐行结论及当前 49 行待审校队列
3. `HANDOVER.md`：项目约定、工具链和注意事项
4. `docs/qoder-review-2026-08-06.md`：历史审核记录，不能直接复用其中已纠正的引用
5. `docs/transcription.md` 与 `data/compartments.tsv`：TSV 格式和区室枚举
6. `tools/validate.js`、`tools/review-helper.js`、`tools/check-citations.js`、`tools/compile.js`

## 当前基线

- 55 个 TSV 文件，348 行反应记录
- 323 条内容保留式去重反应，293 个编译节点
- 50 行 `已核对`、249 行 `已终审`、49 行 `待审校`
- 原 58 行待审校队列已逐行复核：累计 9 行提升，49 行保留并写明具体阻塞原因
- 全部反应 29 行带机器可识别引用；已终审记录 24/249 带引用，仍有 225 行历史已终审记录需要补证
- 剩余建议分类：区室机制 20、抽象类别 14、多步合并 9、细胞事件 4、其他 2
- 76 个唯一引用已通过官方接口在线核验，无效 0、接口未完成 0
- `validate`、`selftest`、`layout`、`compile`、`compile --check` 已通过
- `data-compiled.js` SHA-256：`E323A3B3179B774EE4C5B090264C41339E0B237056CC4396493252BCB5D8D9C5`
- UI 整体为 `rev.11 蓝色实验图谱`，学习模式为 `rev.12 微光学习界面`；已验证桌面、平板和手机视口，左侧通路分类色保持不变

## 审核目标

第三轮已完成原 58 行结论的独立复核，并修复 BVRA、DHODH 两处区室冲突。下一轮第一优先级是继续拆解 49 条待审校记录；第二优先级是为 225 条缺少机器可识别引用的历史 `已终审` 记录补证或降级。重点检查：

- 底物、产物和反应式是否一致
- 酶名是否对应真实反应
- 辅因子、电子供体/受体、水、CO₂、PPi 等是否明显遗漏
- `名称@区室` 是否符合物种和细胞区室
- 可逆性是否合理
- 多底物/多产物拆边是否能正确解释，而不是制造假反应
- 合并的多步路径是否应该拆成真实中间体

## 必须遵守

- 不要把所有 `待审校` 批量替换成 `已终审`。
- 只读审核阶段不要运行 `node tools/review-helper.js --write`；该命令现在会保留完整 58 行审计历史，但会重建 `REVIEW_PROGRESS.md`。
- `审校`列只允许 `待审校`、`已核对`、`已终审`；示意边、净反应、货物流和转运属于独立的表示类型。
- 只有有可靠依据的行才能改为 `已终审`。
- 无法确认的行保留 `待审校`，并在“备注”列写明原因。
- 抽象事件（自噬、内吞、溶酶体回收、囊泡运输）不要伪装成精确化学计量反应。
- 多步合并路径如果没有完整中间体和物种信息，保留待审校，不要凭空补齐。
- 不要改动原有 `已核对` 行，除非有明确来源证明存在错误。
- 不要擅自改动节点主键、区室枚举或手工坐标。
- 化学事实优先查 Reactome、Rhea、KEGG 等可追溯来源，并把来源写入审核报告。
- 禁止使用占位 PMID、未经打开核对的数据库 ID，或只验证“ID 存在”却不验证语义对应。

## 当前重点文件

- 抽象氨基酸碳骨架：`aa_carbon.tsv`、`aa_biosynthesis.tsv`、`bcaa.tsv`、`aromatic_aa.tsv`
- 多步合并：`cholesterol.tsv`、`folate.tsv`、`heme.tsv`、`nucleotide_degradation.tsv`、`purine.tsv`、`pyrimidine.tsv`、`steroid_bile.tsv`、`uronic.tsv`
- 细胞事件/运输：`autophagy.tsv`、`glycosylation.tsv`、`lipoprotein.tsv`、`lysosomal.tsv`、`membrane_transport.tsv`、`plasmalogen.tsv`、`sphingolipid.tsv`、`transamination.tsv`、`vlcfa.tsv`

## 建议流程

```powershell
Set-Location 'D:\wangjunyi\Documents\cell Metabolism world'
node tools/selftest.js
node tools/validate.js
node tools/review-helper.js
node tools/check-citations.js
node tools/check-citations.js --online
```

只读审核时先运行上面的命令，不要修改数据。若确认需要修正 TSV，修改后再运行：

```powershell
node tools/validate.js
node tools/layout.js
node tools/compile.js
node tools/compile.js --check
```

最后检查 `data-compiled.js` 中待审校数量是否与 TSV 审核结果一致，并在浏览器打开：

`http://127.0.0.1:8766/index.html`

## 交付物

请在新的日期文件中新增审核记录，不要覆盖 `docs/qoder-review-2026-08-06.md` 或 `docs/qoder-review-2026-08-07.md`：

| 文件:行号 | 结论 | 修改 | 依据 |
|---|---|---|---|
| `data/reactions/xxx.tsv:3` | 已终审 / 保留待审校 | 具体改动或不改原因 | URL、数据库 ID 或文献 |

报告结尾必须给出：

- `已核对`、`已终审`、`待审校` 三类行数
- 机器可识别引用覆盖率，以及在线验证通过/无效/接口未完成的数量
- 仍未解决的问题及原因
- `validate/layout/compile` 的结果
- 是否可以称为“科学终稿”；如果不能，明确剩余边界
