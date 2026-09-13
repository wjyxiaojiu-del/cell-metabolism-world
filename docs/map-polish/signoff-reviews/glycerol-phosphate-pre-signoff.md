# 甘油-3-磷酸穿梭双地图签核前审查

审查日期：2026-08-31

结论：**建议负责人通过**。本记录不是负责人签核，不修改 `owner-signoff.md` 的 `待确认` 状态。

## 审查范围

- 学习地图：390、768、1440 canonical final 证据，以及 390 map-core 和 map-direct 补充证据。
- 专家地图：390、768、1440 canonical final 证据，以及 overlay 补充证据。
- 实际行为：学习模式进入甘油-3-磷酸穿梭、查看四事件主图；专家模式进入机制覆盖层、四条反应入口与返回路径。

## 科学与双图一致性

- [x] 胞质 GPD1 用 NADH + H⁺将 DHAP 还原为甘油-3-磷酸，并再生胞质 NAD⁺。
- [x] 甘油-3-磷酸与 DHAP 通过外膜 VDAC 往返胞质和膜间隙侧。
- [x] 内膜 GPD2 活性位点朝膜间隙侧，并使用酶内 FAD/FADH₂接力电子。
- [x] 电子交给 CoQ 形成 CoQH₂，并从复合体 III 继续。
- [x] 两图都明确 NADH 本身不跨膜、不形成基质 NADH，并绕过复合体 I。
- [x] 两图都用四个机制事件表达穿梭，通过别名覆盖六条底层图边。

## 三档视觉与操作

- [x] 390：学习侧教学叙事和横向浏览后的 GPD2/CoQ 核心可读；专家侧保留胞质、外膜、膜间隙侧 GPD2、CoQ 池和净效果。
- [x] 768：学习导读与机制主图区分清楚；专家侧四条反应入口与机制图并列，无关键控件重叠。
- [x] 1440：学习主图完整显示 GPD1→VDAC→GPD2→CoQ；专家覆盖层五区和电子去向完整可核对。
- [x] 学习/专家入口、机制查看、单步反应和返回路径可操作；专项测试未发现页面错误。

## 自动化证据

```text
npx playwright test tests/ui-beginner-learning.spec.js tests/ui-expert-mobile-readability.spec.js tests/ui-expert-navigation.spec.js -g "glycerol phosphate learning map|glycerol phosphate mechanism|pathway-first expert flow"

3 passed
```

相关门槛：学习评分 95/25，专家评分 94/25，P0/P1=0；canonical final 证据 6/6。

## 负责人动作

项目负责人仍需本人打开并实际操作六个视口组合。确认无误后，才可在 `owner-signoff.md` 为 `glycerol_phosphate` 填写 `通过`、确认日期和备注；发现问题则填写 `退回` 及具体视口、地图侧和问题描述。
