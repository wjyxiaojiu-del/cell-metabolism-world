# 肉碱穿梭双地图签核前审查

审查日期：2026-08-31

结论：**建议负责人通过**。本记录不是负责人签核，不修改 `owner-signoff.md` 的 `待确认` 状态。

## 审查范围

- 学习地图：390、768、1440 canonical final 证据，以及学习导读、主图和三档地图视口补充证据。
- 专家地图：390、768、1440 canonical final 证据，以及机制覆盖层、场景图和反应入口补充证据。
- 实际行为：学习模式进入肉碱穿梭，覆盖 CPT1、外膜通道、CACT 反向交换、CPT2 和两个 CoA 池；专家模式进入线粒体总览、六步反应列表和返回路径。

## 科学与双图一致性

- [x] 长链脂酰-CoA 不能直接跨越线粒体内膜；CPT1 在外膜胞质侧把脂酰基转移给肉碱，且受 malonyl-CoA 抑制。
- [x] 脂酰肉碱经外膜通道后，由 CACT/SLC25A20 以脂酰肉碱入基质、游离肉碱向外的方式跨内膜交换。
- [x] CPT2 在基质侧将脂酰基交还给基质 CoA 池，生成长链脂酰-CoA进入 β-氧化；胞质和基质 CoA 池保持分离。
- [x] 两图均正确区分外膜、膜间隙、内膜和基质，并注明穿梭本身不额外消耗 ATP，活化成本位于上游。

## 三档视觉与操作

- [x] 390：学习侧先显示两次转接和跨内膜交换；专家侧压缩总览仍能分辨 CPT1、VDAC、CACT、CPT2 及能量边界。
- [x] 768：学习导读、入口/出口/区室/作用摘要与主图分区清楚；专家侧六步反应列表和四层结构并列，无关键标签碰撞。
- [x] 1440：学习主图完整表达外膜入口、膜间隙、CACT 反向交换和基质交接；专家图稳定显示四层结构、两个 CoA 池和 malonyl-CoA 门控。
- [x] 学习/专家入口、结构切换、单步反应和返回路径可操作；专项测试未发现页面错误。

## 自动化证据

```text
npx playwright test tests/ui-beginner-learning.spec.js tests/ui-expert-mobile-readability.spec.js -g "carnitine shuttle learning map separates|carnitine shuttle expert mechanism separates"

2 passed
```

相关门槛：学习评分 95/25，专家评分 95/25，P0/P1=0；canonical final 证据 6/6。

## 负责人动作

项目负责人仍需本人打开并实际操作六个视口组合。确认无误后，才可在 `owner-signoff.md` 为 `carnitine` 填写 `通过`、确认日期和备注；发现问题则填写 `退回` 及具体视口、地图侧和问题描述。
