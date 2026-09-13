# 甘油-3-磷酸穿梭双地图打磨规格

状态：实现与内部复审完成，等待项目负责人逐图确认  
所属项目总目标：42/42 学习地图与专家地图全部通过  
当前批次里程碑：第 1 批生物氧化 12/42

## 科学边界

本图只解释甘油-3-磷酸穿梭如何把胞质 NADH 的还原当量直接交给线粒体内膜 CoQ 池。NADH 分子不跨线粒体内膜，也不在基质侧重新形成 NADH；净效果表达为：

```text
胞质 NADH + H⁺ + CoQ
→ 胞质 NAD⁺ + CoQH₂
```

闭环按四个可核对的机制事件组织：

1. 胞质 GPD1/GPD1L：DHAP + NADH + H⁺ ⇌ 甘油-3-磷酸 + NAD⁺。
2. 外膜 VDAC：甘油-3-磷酸由胞质侧到达膜间隙侧。
3. 内膜 GPD2：在膜间隙侧氧化甘油-3-磷酸为 DHAP；酶内 FAD 先接受电子，再把电子交给 CoQ 形成 CoQH₂。
4. 外膜 VDAC：DHAP 返回胞质，重新进入 GPD1 反应。

底层 TSV 为表达辅酶边、两次外膜通过和 GPD2 的两段电子接力而保存 6 条图边；学习与专家反应列表必须合并为上述 4 个机制事件，并通过别名保留对全部 6 条数据边的覆盖审计。

本图必须明确与苹果酸-天冬氨酸穿梭的边界：电子从 CoQ 池进入复合体 III，绕过复合体 I；因此每对电子建立的质子梯度通常少于生成基质 NADH 的路线。本轮不扩展组织表达、疾病和调控差异。

参考依据：[Reactome R-HSA-611105](https://reactome.org/content/detail/R-HSA-611105)、[Reactome R-HSA-75889](https://reactome.org/content/detail/R-HSA-75889)、[Reactome R-HSA-188467](https://reactome.org/content/detail/R-HSA-188467)、[Reactome R-HSA-188469](https://reactome.org/content/detail/R-HSA-188469)、[UniProt GPD1 P21695](https://www.uniprot.org/uniprotkb/P21695/entry)、[UniProt GPD2 P43304](https://www.uniprot.org/uniprotkb/P43304/entry)。

## 现状问题

### 学习地图

1. 通用布局把 6 条底层图边当成 6 个连续步骤，不能看出它们实际只对应 4 个机制事件。
2. 胞质、外膜/膜间隙和内膜 CoQ 池没有稳定空间边界；GPD1、VDAC、GPD2 与酶内 FAD 的角色容易混淆。
3. “不生成基质 NADH”“绕过复合体 I”“进入复合体 III”只存在于零散文字，未形成主图结论。

### 专家地图

1. 当前覆盖层只有一条横向链，细胞质、线粒体外膜、膜间隙和内膜的层次与底图结构未对齐。
2. GPD2 的 FAD/FADH₂被画成游离中间体的风险较高，没有强调其为酶内辅基。
3. 没有把 4 个事件、净反应和呼吸链入口组织成可逐项核对的机制结构。

## 学习地图目标

采用“四区空间 + 四事件闭环 + 电子入口对比卡”的专用布局：

```text
胞质：DHAP --GPD1 / NADH→NAD⁺--> 甘油-3-P
  ↑                                  │
  └──── VDAC：DHAP 返回 ─────────────┤ VDAC：甘油-3-P 到膜间隙侧
                                     ↓
膜间隙侧：甘油-3-P --GPD2 / 酶内 FAD--> DHAP
                                      └→ CoQ → CoQH₂ → 复合体 III

净效果：胞质 NADH 的电子进入 CoQ 池；不生成基质 NADH；绕过复合体 I
```

必须让初学者一眼回答：

- 胞质 GPD1 消耗哪个辅酶、再生哪个辅酶？
- 哪两个代谢物经外膜 VDAC 往返？
- GPD2 位于哪里，活性位点朝向哪一侧？
- FAD/FADH₂为什么应表达为 GPD2 的酶内接力，而不是游离产物？
- 电子进入呼吸链的哪个池，为什么绕过复合体 I？

## 专家地图目标

- 使用线粒体内膜最小容纳场景，覆盖层分为 `cytosol`、`outer-membrane`、`intermembrane`、`inner-membrane`、`net` 五个稳定阅读区。
- 机制层和左侧反应列表均只显示四个事件，并用别名覆盖 6 条底层反应 ID。
- GPD1/GPD1L、VDAC、GPD2、酶内 FAD/FADH₂、CoQ/CoQH₂均有独立可读锚点。
- 总结区明确“还原当量进入 CoQ；绕过复合体 I；不生成基质 NADH；下一站复合体 III”。
- 390/768 px 关键标签高度不低于 10 px，无碰撞、无裁切、无页面横向溢出。

## 跨设备要求

- 390 px：学习图内部允许有提示的横向浏览，但首屏必须看到胞质 GPD1、VDAC、GPD2 和 CoQ 池的完整接力；专家图先读净效果，再读四事件。
- 768 px：四区、两个外膜往返方向与 GPD2→CoQH₂同屏可扫读，标签不碰撞。
- 1440 px：四事件闭环、净反应和复合体 III 下一站构成完整阅读路径，不保留无意义空区。

## 自动验收

- 学习主图具有 `data-map-layout="glycerol-phosphate-cycle"`。
- 学习图存在 `data-gp-zone="cytosol|outer-membrane|intermembrane|inner-membrane|net"` 五区。
- 存在 GPD1、VDAC-G3P、GPD2、VDAC-DHAP 四个机制锚点。
- 存在胞质与膜间隙侧的 DHAP、甘油-3-磷酸，以及 NADH/NAD⁺、酶内 FAD/FADH₂、CoQ/CoQH₂语义锚点。
- 学习与专家反应列表均显示 4 行，但全局反应覆盖仍包含本通路 6 条底层边。
- 专家图包含 `data-gp-zone="cytosol|outer-membrane|intermembrane|inner-membrane|net"` 五区和四个编号步骤。
- 两图均包含“NADH 不跨膜”“不生成基质 NADH”“绕过复合体 I”“CoQH₂ → 复合体 III”。
- 390/768/1440 三档页面横向溢出为 0；390/768 关键标签无碰撞。
