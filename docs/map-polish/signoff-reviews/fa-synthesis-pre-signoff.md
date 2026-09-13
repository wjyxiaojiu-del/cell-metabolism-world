# 脂肪酸合成双地图签核前审查

审查日期：2026-08-31

结论：**建议负责人通过**。本记录不是负责人签核，不修改 `owner-signoff.md` 的 `待确认` 状态。

## 审查范围

- 学习地图：390、768、1440 canonical final 证据，以及学习导读、主图和三档地图视口补充证据。
- 专家地图：390、768、1440 canonical final 证据，以及机制覆盖层、场景图和反应入口补充证据。
- 实际行为：学习模式进入脂肪酸合成，覆盖柠檬酸碳输出、ACC 承诺步骤、FAS 七轮延长和下游去向；专家模式进入细胞质机制图、四步反应列表和返回路径。

## 科学与双图一致性

- [x] 乙酰-CoA 不能直接穿过线粒体内膜，经柠檬酸/SLC25A1 输出到胞质后由 ACLY 再生乙酰-CoA，并消耗 1 ATP。
- [x] ACC 将乙酰-CoA 承诺为丙二酰-CoA；FAS 循环依次经历缩合、还原、脱水、还原，每轮延长 2 个碳并消耗 2 NADPH。
- [x] 7 轮延长由 C2 推到 C16:0 棕榈酸，整体账本表达 1 acetyl + 7 malonyl + 14 NADPH 及总 ATP/NADPH 成本。
- [x] 两图都将主过程定位在细胞质，并保留 malonyl-CoA 对 CPT1 的下游控制及 ER 延长/去饱和边界。

## 三档视觉与操作

- [x] 390：学习侧先显示两碳单元准备、反复缩合和两次还原/脱水；专家侧压缩总览仍能读到柠檬酸输出、ACC、FAS 和总账本。
- [x] 768：学习导读、入口/出口/区室/作用摘要与主图分区清楚；专家侧四步反应列表和机制图并列，标签、反应入口及返回路径可读。
- [x] 1440：学习主图完整表达柠檬酸→乙酰-CoA、丙二酰-CoA 承诺、FAS 七轮和 C16:0；专家图稳定显示四个机制区及 CPT1/ER 下游控制。
- [x] 学习/专家入口、机制查看、单步反应和返回路径可操作；专项测试未发现页面错误。

## 自动化证据

```text
npx playwright test tests/ui-beginner-learning.spec.js tests/ui-expert-mobile-readability.spec.js -g "fatty acid synthesis learning map separates|fatty acid synthesis expert mechanism separates"

2 passed
```

相关门槛：学习评分 95/25，专家评分 94/25，P0/P1=0；canonical final 证据 6/6。

## 负责人动作

项目负责人仍需本人打开并实际操作六个视口组合。确认无误后，才可在 `owner-signoff.md` 为 `fa_synthesis` 填写 `通过`、确认日期和备注；发现问题则填写 `退回` 及具体视口、地图侧和问题描述。
