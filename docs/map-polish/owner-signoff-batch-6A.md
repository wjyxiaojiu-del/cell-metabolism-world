# 第 6 周 6A：能量核心负责人签核清单

更新时间：2026-09-03

本清单把第 6 周第一批负责人操作集中到一个入口。它不记录代理结论，也不替代 `owner-signoff.md`；正式状态只能由项目负责人本人填写。

## 本批目标

完成 6 条能量核心通路的学习图与专家图，共 12 张地图：

`pdh` → `tca` → `malate_aspartate` → `glycerol_phosphate` → `etc` → `oxphos`

本批达到 12/42 只是第 6 周检查点，第 7 周仍须等到全部 42/42 才能解锁。

## 开始操作

1. 在项目根目录运行 `npm run preview`，打开 `http://127.0.0.1:8000/`。
2. 对每条通路分别进入学习图和专家图。
3. 在 390、768、1440 三档宽度实际完成：进入地图、阅读主线、打开详情、返回、切换相邻出口。
4. 对照下面的签核前审查和 canonical final 截图，但以负责人本人的实际操作结果为准。
5. 在 [owner-signoff.md](owner-signoff.md) 对应行填写“通过”或“退回”；“通过”必须填写日期，“退回”必须填写具体视口、地图侧和问题。
6. 每完成一条通路运行 `npm run audit:owner-signoff`，确认累计数正确。

## 逐通路入口

### 1. PDH

- [签核前审查](signoff-reviews/pdh-pre-signoff.md)
- 学习图证据：[390](evidence/learning/pdh/2026-08-31-final-390.png) · [768](evidence/learning/pdh/2026-08-31-final-768.png) · [1440](evidence/learning/pdh/2026-08-31-final-1440.png)
- 专家图证据：[390](evidence/expert/pdh/2026-08-30-final-390.png) · [768](evidence/expert/pdh/2026-08-30-final-768.png) · [1440](evidence/expert/pdh/2026-08-30-final-1440.png)
- [x] 学习图通过和日期已由负责人填写
- [x] 专家图通过和日期已由负责人填写

### 2. TCA

- [签核前审查](signoff-reviews/tca-pre-signoff.md)
- 学习图证据：[390](evidence/learning/tca/2026-08-31-final-390.png) · [768](evidence/learning/tca/2026-08-31-final-768.png) · [1440](evidence/learning/tca/2026-08-31-final-1440.png)
- 专家图证据：[390](evidence/expert/tca/2026-08-31-final-390.png) · [768](evidence/expert/tca/2026-08-31-final-768.png) · [1440](evidence/expert/tca/2026-08-31-final-1440.png)
- [x] 学习图通过和日期已由负责人填写
- [x] 专家图通过和日期已由负责人填写

### 3. 苹果酸-天冬氨酸穿梭

- [签核前审查](signoff-reviews/malate-aspartate-pre-signoff.md)
- 学习图证据：[390](evidence/learning/malate_aspartate/2026-08-31-final-390.png) · [768](evidence/learning/malate_aspartate/2026-08-31-final-768.png) · [1440](evidence/learning/malate_aspartate/2026-08-31-final-1440.png)
- 专家图证据：[390](evidence/expert/malate_aspartate/2026-08-31-final-390.png) · [768](evidence/expert/malate_aspartate/2026-08-31-final-768.png) · [1440](evidence/expert/malate_aspartate/2026-08-31-final-1440.png)
- [x] 学习图通过和日期已由负责人填写
- [x] 专家图通过和日期已由负责人填写

### 4. 甘油磷酸穿梭

- [签核前审查](signoff-reviews/glycerol-phosphate-pre-signoff.md)
- 学习图证据：[390](evidence/learning/glycerol_phosphate/2026-08-31-final-390.png) · [768](evidence/learning/glycerol_phosphate/2026-08-31-final-768.png) · [1440](evidence/learning/glycerol_phosphate/2026-08-31-final-1440.png)
- 专家图证据：[390](evidence/expert/glycerol_phosphate/2026-08-31-final-390.png) · [768](evidence/expert/glycerol_phosphate/2026-08-31-final-768.png) · [1440](evidence/expert/glycerol_phosphate/2026-08-31-final-1440.png)
- [x] 学习图通过和日期已由负责人填写
- [x] 专家图通过和日期已由负责人填写

### 5. 电子传递链

- [签核前审查](signoff-reviews/etc-pre-signoff.md)
- 学习图证据：[390](evidence/learning/etc/2026-08-31-final-390.png) · [768](evidence/learning/etc/2026-08-31-final-768.png) · [1440](evidence/learning/etc/2026-08-31-final-1440.png)
- 专家图证据：[390](evidence/expert/etc/2026-08-31-final-390.png) · [768](evidence/expert/etc/2026-08-31-final-768.png) · [1440](evidence/expert/etc/2026-08-31-final-1440.png)
- [x] 学习图通过和日期已由负责人填写
- [x] 专家图通过和日期已由负责人填写

### 6. 氧化磷酸化

- [签核前审查](signoff-reviews/oxphos-pre-signoff.md)
- 学习图证据：[390](evidence/learning/oxphos/2026-08-31-final-390.png) · [768](evidence/learning/oxphos/2026-08-31-final-768.png) · [1440](evidence/learning/oxphos/2026-08-31-final-1440.png)
- 专家图证据：[390](evidence/expert/oxphos/2026-08-30-final-390.png) · [768](evidence/expert/oxphos/2026-08-30-final-768.png) · [1440](evidence/expert/oxphos/2026-08-30-final-1440.png)
- [x] 学习图通过和日期已由负责人填写
- [x] 专家图通过和日期已由负责人填写

## 本批结束检查

- [x] `npm run audit:owner-signoff` 报告正式完成 12/42。
- [x] 本批不存在未记录原因的“退回”。
- [ ] 若有修复，只有对应通路对发生变更，且六张 canonical final 证据已重拍并完成针对性回归。
- [x] 第 7–10 周仍保持锁定。
