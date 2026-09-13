# PDH 双地图签核前审查

审查日期：2026-08-31

结论：**建议负责人通过**。本记录不是负责人签核，不修改 `owner-signoff.md` 的 `待确认` 状态。

## 审查范围

- 学习地图：390、768、1440 canonical final 证据，以及 390 map-core、map-direct 和教材机制图补充证据。
- 专家地图：390、768、1440 canonical final 证据，以及 overlay 补充证据。
- 实际操作：学习模式进入 PDH、机制主图、三档响应式布局；专家模式进入 PDH、机制覆盖层和通路导航。

## 科学与双图一致性

- [x] 胞质丙酮酸先经外膜 VDAC 到达膜间隙。
- [x] 丙酮酸再经内膜 MPC1/2 与 H⁺同向进入基质。
- [x] 基质 PDH 反应明确为不可逆氧化脱羧。
- [x] E1 · TPP 脱羧并释放 CO₂；E2 · 硫辛酰胺接收并转移乙酰基；CoA-SH 形成乙酰-CoA。
- [x] E3 · FAD 再氧化硫辛酰胺，并由 NAD⁺接收还原当量形成 NADH + H⁺。
- [x] 乙酰-CoA 明确进入 TCA；学习图与专家图没有混入乳酸、丙氨酸或草酰乙酸支路。

## 三档视觉与操作

- [x] 390：页面无横向溢出；学习主图使用地图内部横向浏览，canonical 首屏配合 map-core 和 map-direct 证据可核对完整机制；专家图显示运输区、PDH 复合体区和反应步骤入口。
- [x] 768：学习图导读、机制主图和专家侧栏/覆盖层保持分区，无节点或关键标签碰撞。
- [x] 1440：学习图完整表达五个空间带和 14 个教学节点；专家图同时显示运输区、复合体区、3 条步骤和返回入口。
- [x] 学习/专家入口、机制查看和返回路径可操作；专项测试未发现控制台或页面错误。

## 自动化证据

```text
npx playwright test tests/ui-beginner-learning.spec.js tests/ui-expert-mobile-readability.spec.js tests/ui-expert-navigation.spec.js -g "PDH learning map|PDH mechanism separates|PDH pathway shows"

3 passed
```

相关门槛：学习评分 94/25，专家评分 94/25，P0/P1=0；canonical final 证据 6/6。

## 负责人动作

项目负责人仍需本人打开并实际操作六个视口组合。确认无误后，才可在 `owner-signoff.md` 为 `pdh` 填写 `通过`、确认日期和备注；发现问题则填写 `退回` 及具体视口、地图侧和问题描述。
