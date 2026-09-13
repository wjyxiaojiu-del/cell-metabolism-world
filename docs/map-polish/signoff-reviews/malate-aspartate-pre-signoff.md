# 苹果酸-天冬氨酸穿梭双地图签核前审查

审查日期：2026-08-31

结论：**建议负责人通过**。本记录不是负责人签核，不修改 `owner-signoff.md` 的 `待确认` 状态。

## 审查范围

- 学习地图：390、768、1440 canonical final 证据，以及 390 map-core 和 map-direct 补充证据。
- 专家地图：390、768、1440 canonical final 证据，以及 overlay 补充证据。
- 实际行为：学习模式进入苹果酸-天冬氨酸穿梭、查看六事件主图；专家模式进入机制覆盖层、六条反应入口与返回路径。

## 科学与双图一致性

- [x] 胞质 MDH1 用 NADH + H⁺将草酰乙酸还原为苹果酸，并再生胞质 NAD⁺。
- [x] SLC25A11 反向交换苹果酸与 α-KG，交换方向在内膜区单独标出。
- [x] 基质 MDH2 将苹果酸氧化为草酰乙酸，同时由基质 NAD⁺形成 NADH + H⁺。
- [x] GOT1 与 GOT2 分别闭合胞质和基质侧的草酰乙酸/天冬氨酸与 α-KG/谷氨酸转换。
- [x] SLC25A12/13 表达天冬氨酸输出与谷氨酸 + H⁺输入的配对交换。
- [x] 两图都明确净效果是还原当量转移、NADH 分子本身不跨膜，基质 NADH 进入复合体 I。
- [x] 两图都用六个机制事件表达穿梭，没有把 10 条多底物图边误说成 10 个独立步骤。

## 三档视觉与操作

- [x] 390：学习侧重点、三段教学叙事和横向浏览后的机制核心可读；专家侧保留胞质、内膜、基质和净效果四区，以及六条反应入口。
- [x] 768：学习导读与主图区分清楚；专家侧反应列表与机制图并列，无关键控件或标签重叠。
- [x] 1440：学习主图完整显示两侧半循环、两台交换器和净效果；专家覆盖层四区完整可核对。
- [x] 学习/专家入口、机制查看、单步反应和返回路径可操作；专项测试未发现页面错误。

## 自动化证据

```text
npx playwright test tests/ui-beginner-learning.spec.js tests/ui-expert-mobile-readability.spec.js tests/ui-expert-navigation.spec.js -g "malate aspartate learning map|malate aspartate mechanism|pathway-first expert flow"

3 passed
```

相关门槛：学习评分 95/25，专家评分 94/25，P0/P1=0；canonical final 证据 6/6。

## 负责人动作

项目负责人仍需本人打开并实际操作六个视口组合。确认无误后，才可在 `owner-signoff.md` 为 `malate_aspartate` 填写 `通过`、确认日期和备注；发现问题则填写 `退回` 及具体视口、地图侧和问题描述。
