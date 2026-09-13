# 嘧啶代谢双地图签核前审查

审查日期：2026-09-01

结论：**建议负责人通过**。本记录不是负责人签核，不修改 `owner-signoff.md` 的 `待确认` 状态。

## 审查范围

- 学习地图：390、768、1440 canonical final 证据，以及学习导读、主图和三档地图视口补充证据。
- 专家地图：390、768、1440 canonical final 证据，以及机制覆盖层、场景图和反应入口补充证据。
- 实际行为：学习模式进入嘧啶从头合成，覆盖先组环、接 PRPP、UMP 形成以及 RNA/DNA 分支；专家模式进入线粒体内膜/胞质机制图、十一步反应列表和返回路径。

## 科学与双图一致性

- [x] 嘧啶环先在胞质由 CAD 三步以谷氨酰胺、HCO₃⁻和 2 ATP 组装，再接到 PRPP 形成 OMP，之后脱羧为 UMP。
- [x] 二氢乳清酸脱氢酶（DHODH）位于线粒体内膜外侧并将电子交给 CoQ/CoQH₂；乳清酸随后回到胞质路线。
- [x] UMP 可继续形成 UDP/UTP/CTP 和 dNTP；RNA 分支与 DNA 胸苷酸分支在图中保持连续且方向清楚。
- [x] 两图均区分胞质、线粒体内膜和内外侧，保留嘧啶原子来源、补救回收接口及“APRT/HGPRT 不属于本图主干”的边界。

## 三档视觉与操作

- [x] 390：学习侧先显示先排出嘧啶环、接上核糖和继续磷酸化/还原；专家侧压缩总览仍能识别 CAD、DHODH、UMP 和两条分支。
- [x] 768：学习导读、入口/出口/区室/作用摘要与主图分区清楚；专家侧十一步反应列表和机制图并列，关键标签可读。
- [x] 1440：学习主图完整表达 CAD→乳清酸→UMP→UDP/UTP/CTP/dNTP；专家图稳定显示 CAD 三步、DHODH/CoQ、UMPS 和 RNA/DNA 分支。
- [x] 学习/专家入口、结构切换、单步反应和返回路径可操作；专项测试未发现页面错误。

## 自动化证据

```text
npx playwright test tests/ui-beginner-learning.spec.js tests/ui-expert-mobile-readability.spec.js -g "pyrimidine learning map builds|pyrimidine expert mechanism keeps"

2 passed
```

相关门槛：学习评分 94/25，专家评分 93/25，P0/P1=0；canonical final 证据 6/6。

## 负责人动作

项目负责人仍需本人打开并实际操作六个视口组合。确认无误后，才可在 `owner-signoff.md` 为 `pyrimidine` 填写 `通过`、确认日期和备注；发现问题则填写 `退回` 及具体视口、地图侧和问题描述。
