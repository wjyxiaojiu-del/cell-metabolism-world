// 学习模式的反应白话精讲层。键使用稳定指纹「通路|起点>终点」,避免编译序号变化后错挂。
// 内容来源:2026-10 从 E 盘 master 线 student-reaction-notes.js 移植 123 条,并按 map-polish
// 数据模型(载体拆行/实体改名/类别组行/oxphos 拆分)重写 48 条。由 tools/check-student-notes.js
// 校验:21 条核心通路的全部反应实例必须逐条覆盖,孤儿键报错。
window.STUDENT_REACTION_NOTES = {
  'pdh|丙酮酸@cytosol>丙酮酸@mito-ims': {
    doing: '丙酮酸经外膜 VDAC 通道进入膜间隙。',
    why: '外膜对小分子开放,真正的关卡在内膜,这一步基本不受限。',
    hook: '外膜是纱窗:丙酮酸直接穿过去。'
  },
  'pdh|丙酮酸@mito-ims>丙酮酸@mito-matrix': {
    doing: '内膜上的丙酮酸载体 MPC 把丙酮酸与一个 H⁺ 同向送入基质。',
    why: '丙酮酸要在基质里被丙酮酸脱氢酶复合体氧化;MPC 是内膜上真正的守门人。',
    hook: '内膜才是闸机:MPC 捎带一个质子一起进基质。'
  },
  'pdh|丙酮酸@mito-matrix>乙酰辅酶 A@mito-matrix': {
    doing: '丙酮酸脱氢酶（E1）用焦磷酸硫胺素（TPP）脱羧；二氢硫辛酰转乙酰酶（E2）转移乙酰基；二氢硫辛酰脱氢酶（E3）使辅酶再生。',
    why: '三种酶聚在同一复合体中连续交接中间体，既提高效率，也避免活泼中间体四处扩散。',
    hook: 'E1 剪掉 1 个碳，E2 交出乙酰辅酶 A，E3 恢复工具并生成还原型烟酰胺腺嘌呤二核苷酸（NADH）。'
  },
  'tca|乙酰辅酶 A@mito-matrix>柠檬酸@mito-matrix': {
    doing: '把二碳的乙酰辅酶 A 与四碳的草酰乙酸合成六碳柠檬酸。',
    why: '乙酰基由此进入循环，草酰乙酸则作为循环起点被暂时占用。',
    hook: '二碳加四碳，得到六碳。'
  },
  'tca|柠檬酸@mito-matrix>异柠檬酸@mito-matrix': {
    doing: '先脱水再加水，重新排列柠檬酸中的羟基位置。',
    why: '柠檬酸不便直接氧化，变成异柠檬酸后才能继续脱氢和脱羧。',
    hook: '不增不减，只为下一步氧化摆好姿势。'
  },
  'tca|异柠檬酸@mito-matrix>α-酮戊二酸@mito-matrix': {
    doing: '异柠檬酸被氧化并失去一个碳，生成 NADH 和二氧化碳。',
    why: '这是循环第一次氧化脱羧，把六碳分子变为五碳。',
    hook: '第一次脱碳，第一次收获 NADH。'
  },
  'tca|α-酮戊二酸@mito-matrix>琥珀酰辅酶 A@mito-matrix': {
    doing: '再进行一次氧化脱羧，并把剩余四碳骨架接到辅酶 A 上。',
    why: '循环完成第二次脱碳，同时生成 NADH 和高能硫酯。',
    hook: '第二次脱碳：五碳变四碳。'
  },
  'tca|琥珀酰辅酶 A@mito-matrix>琥珀酸@mito-matrix': {
    doing: '利用高能硫酯断裂的能量，直接生成 GTP。',
    why: '这是三羧酸循环唯一一次底物水平磷酸化。',
    hook: '高能辅酶 A 离开，GTP 直接到账。'
  },
  'tca|琥珀酸@mito-matrix>延胡索酸@mito-matrix': {
    doing: '氧化琥珀酸，并把电子交给辅酶 Q，生成还原型辅酶 Q。',
    why: '琥珀酸脱氢酶同时也是呼吸链复合体 II，直接连接循环与电子传递链。',
    hook: '三羧酸循环与呼吸链在复合体 II 会合。'
  },
  'tca|延胡索酸@mito-matrix>苹果酸@mito-matrix': {
    doing: '给延胡索酸加一分子水，生成苹果酸。',
    why: '加水把双键变成羟基，为最后一次脱氢再生草酰乙酸做准备。',
    hook: '先加水，后脱氢。'
  },
  'tca|苹果酸@mito-matrix>草酰乙酸@mito-matrix': {
    doing: '氧化苹果酸，生成 NADH，并重新得到草酰乙酸。',
    why: '草酰乙酸再生后可以接收下一分子乙酰辅酶 A，循环才能继续。',
    hook: '终点回到起点：草酰乙酸再生。'
  },
  'tca|草酰乙酸@mito-matrix>柠檬酸@mito-matrix': {
    doing: '草酰乙酸与乙酰辅酶 A 汇合，再次生成柠檬酸。',
    why: '这条汇聚边强调循环必须同时具有草酰乙酸和乙酰辅酶 A。',
    hook: '缺一不可：四碳骨架接住二碳乙酰基。'
  },
  'malate_aspartate|草酰乙酸@cytosol>苹果酸@cytosol': {
    doing: '胞质苹果酸脱氢酶（MDH1）让草酰乙酸接收胞质还原型烟酰胺腺嘌呤二核苷酸（NADH）的电子，生成苹果酸。',
    why: '草酰乙酸不能直接穿过线粒体内膜，变成苹果酸后才能借助载体进入线粒体基质。',
    hook: '先把电子装进苹果酸，再让苹果酸过膜。'
  },
  'malate_aspartate|NADH@cytosol>NAD⁺@cytosol': {
    doing: 'MDH1 氧化胞质 NADH 生成 NAD⁺,电子实际转移到草酰乙酸的表示边。',
    why: '把"胞质 NADH 被氧化"单独画出来,穿梭的净效果(胞质 NADH → 基质 NADH)一目了然。',
    hook: '胞质侧:NADH 交出电子,变回 NAD⁺。'
  },
  'malate_aspartate|苹果酸@cytosol>苹果酸@mito-matrix': {
    doing: '苹果酸-α-酮戊二酸反向转运体把胞质苹果酸送入基质，同时把基质 α-酮戊二酸送到胞质。',
    why: '这是跨内膜的交换运输；它保持电荷和物质交换平衡，不让苹果酸单独自由穿膜。',
    hook: '苹果酸进去，α-酮戊二酸出来，一进一出。'
  },
  'malate_aspartate|α-酮戊二酸@mito-matrix>α-酮戊二酸@cytosol': {
    doing: '苹果酸进入基质的同时,α-酮戊二酸被反向换出到胞质。',
    why: '苹果酸-α-KG 反向转运体一次换一对分子:苹果酸进、α-KG 出,电荷保持平衡。',
    hook: '交换台:一进一出,苹果酸换 α-KG。'
  },
  'malate_aspartate|苹果酸@mito-matrix>草酰乙酸@mito-matrix': {
    doing: '线粒体苹果酸脱氢酶（MDH2）把苹果酸重新氧化成草酰乙酸，并在基质中生成 NADH。',
    why: '电子至此从胞质 NADH 转移到基质 NADH，随后可以从呼吸链复合体 I 进入。',
    hook: '苹果酸卸下电子：基质 NADH 到账。'
  },
  'malate_aspartate|NAD⁺@mito-matrix>NADH@mito-matrix': {
    doing: 'MDH2 把苹果酸氧化成草酰乙酸时,NAD⁺ 被还原成 NADH 的表示边。',
    why: '胞质 NADH 的电子最终在这里以基质 NADH 的形式重新出现,交给复合体 I。',
    hook: '基质侧:NAD⁺ 收下电子,变回 NADH。'
  },
  'malate_aspartate|草酰乙酸@mito-matrix>天冬氨酸@mito-matrix': {
    doing: '线粒体天冬氨酸转氨酶把谷氨酸的氨基转给草酰乙酸，生成天冬氨酸和 α-酮戊二酸。',
    why: '草酰乙酸仍不能直接穿膜，转成天冬氨酸后才能借助另一组载体离开基质。',
    hook: '电子已经留下，碳骨架换成天冬氨酸准备返回。'
  },
  'malate_aspartate|天冬氨酸@mito-matrix>天冬氨酸@cytosol': {
    doing: '天冬氨酸-谷氨酸载体把基质天冬氨酸送到胞质，并以谷氨酸和质子的反向进入作为交换。',
    why: '这一步把不能直接输出的草酰乙酸等效地带回胞质，同时补入下一轮需要的谷氨酸。',
    hook: '天冬氨酸出去，谷氨酸进来，穿梭接近闭环。'
  },
  'malate_aspartate|谷氨酸@cytosol>谷氨酸@mito-matrix': {
    doing: '天冬氨酸输出到胞质的同时,谷氨酸(可带 H⁺)被换入基质。',
    why: '谷氨酸进基质后重新转氨生成天冬氨酸,穿梭循环得以续上。',
    hook: '交换台的另一半:天冬氨酸出去,谷氨酸进来。'
  },
  'malate_aspartate|天冬氨酸@cytosol>草酰乙酸@cytosol': {
    doing: '胞质天冬氨酸转氨酶把天冬氨酸重新转成草酰乙酸，同时再生谷氨酸。',
    why: '胞质草酰乙酸回到起点，能够再次接收 NADH 的电子，整个穿梭循环由此闭合。',
    hook: '天冬氨酸恢复为起点角色，草酰乙酸准备接下一批电子。'
  },
  'glycerol_phosphate|磷酸二羟丙酮@cytosol>甘油-3-磷酸@cytosol': {
    doing: '胞质甘油-3-磷酸脱氢酶让磷酸二羟丙酮接收 NADH 的电子，生成甘油-3-磷酸和 NAD⁺。',
    why: 'NADH 本身不能穿过内膜，甘油-3-磷酸成为把电子送到线粒体内膜外侧的临时载体。',
    hook: '磷酸二羟丙酮接电子，变成甘油-3-磷酸。'
  },
  'glycerol_phosphate|NADH@cytosol>NAD⁺@cytosol': {
    doing: 'GPD1 氧化胞质 NADH 生成 NAD⁺,电子转移到 DHAP 的表示边。',
    why: '把"胞质 NADH 被消耗"单独画出来,方便追踪电子经 FAD 送入 CoQ 池的去向。',
    hook: '胞质 NADH 把电子交给 DHAP,自己变回 NAD⁺。'
  },
  'glycerol_phosphate|甘油-3-磷酸@cytosol>甘油-3-磷酸@mito-ims': {
    doing: '甘油-3-磷酸经外膜 VDAC 通道进入膜间隙。',
    why: 'GPD2 的活性位点朝内膜的膜间隙侧,底物要先到膜间隙。',
    hook: '外膜随便过:GPD2 在内膜外侧等它。'
  },
  'glycerol_phosphate|甘油-3-磷酸@mito-ims>磷酸二羟丙酮@mito-ims': {
    doing: '内膜膜间隙侧的 GPD2 把甘油-3-磷酸氧化回磷酸二羟丙酮。',
    why: '氧化释出的电子先暂存在酶内 FAD 上,胞质侧的接力到此完成一半。',
    hook: '送完电子就变回 DHAP,准备回胞质再装一趟。'
  },
  'glycerol_phosphate|磷酸二羟丙酮@mito-ims>磷酸二羟丙酮@cytosol': {
    doing: '磷酸二羟丙酮经 VDAC 回到胞质。',
    why: 'DHAP 回胞质被 GPD1 再次还原成甘油-3-磷酸,穿梭才能循环起来。',
    hook: '空车返回:DHAP 回胞质再装电子。'
  },
  'glycerol_phosphate|辅酶 Q@mito-inner-membrane>泛醇@mito-inner-membrane': {
    doing: 'GPD2 酶内 FADH₂ 把电子交给膜内辅酶 Q,生成泛醇。',
    why: '胞质 NADH 的电子从这里汇入呼吸链的 CoQ 池,不经过复合体 I。',
    hook: '绕过一站:电子从 GPD2 直接送进 CoQ 池。'
  },
  'etc|NADH@mito-matrix>复合体 I@mito-inner-membrane': {
    doing: 'NADH 把高能电子交给呼吸链复合体 I。',
    why: 'NADH 被氧化回 NAD⁺，电子则开始沿呼吸链向氧传递。',
    hook: 'NADH 是送电子进站的载体。'
  },
  'etc|复合体 I@mito-inner-membrane>泛醇@mito-inner-membrane': {
    doing: '复合体 I 把电子交给辅酶 Q，并把质子泵到膜间隙。',
    why: '电子流的能量被转换为跨内膜的质子梯度。',
    hook: '复合体 I：传电子，也泵质子。'
  },
  'etc|琥珀酸@mito-matrix>复合体 II@mito-inner-membrane': {
    doing: '琥珀酸在复合体 II(即琥珀酸脱氢酶)内被氧化,电子暂存到酶内 FAD。',
    why: '这是 TCA 与呼吸链共享的一步:FAD 不离开酶复合体,电子随后直接交给辅酶 Q。',
    hook: '复合体 II 是 TCA 派驻呼吸链的窗口,FADH₂ 不下车。'
  },
  'etc|复合体 II@mito-inner-membrane>泛醇@mito-inner-membrane': {
    doing: '复合体 II 从琥珀酸取得电子，再把电子交给辅酶 Q。',
    why: '它让三羧酸循环产生的电子进入呼吸链，但自身不泵质子。',
    hook: '复合体 II 只送电子，不泵质子。'
  },
  'etc|辅酶 Q@mito-inner-membrane>泛醇@mito-inner-membrane': {
    doing: '辅酶 Q 接收电子和质子，变成还原型辅酶 Q。',
    why: '它能在内膜中移动，把多个入口的电子汇集后送到复合体 III。',
    hook: '辅酶 Q 是内膜里的电子摆渡车。'
  },
  'etc|泛醇@mito-inner-membrane>复合体 III@mito-inner-membrane': {
    doing: '还原型辅酶 Q 把电子交给复合体 III，并释放所携带的质子。',
    why: '复合体 III 继续建立质子梯度，并把电子转交给细胞色素 c。',
    hook: 'Q 循环：交电子，增加膜间隙侧质子。'
  },
  'etc|复合体 III@mito-inner-membrane>细胞色素 c@mito-ims': {
    doing: '复合体 III 把电子逐个交给细胞色素 c。',
    why: '细胞色素 c 是膜间隙侧的移动电子载体，负责把电子送到复合体 IV。',
    hook: '细胞色素 c 是复合体 III 与 IV 之间的快递员。'
  },
  'etc|细胞色素 c@mito-ims>复合体 IV@mito-inner-membrane': {
    doing: '还原型细胞色素 c 把电子交给复合体 IV。',
    why: '电子到达呼吸链末端，准备交给最终电子受体氧。',
    hook: '到达终点站：复合体 IV。'
  },
  'etc|氧@mito-matrix>复合体 IV@mito-inner-membrane': {
    doing: '氧气作为末端电子受体进入复合体 IV。',
    why: '呼吸链的终点:氧负责接收电子,没有它整条链都会堵住。',
    hook: '终点站收货人:氧在复合体 IV 等电子。'
  },
  'etc|复合体 IV@mito-inner-membrane>水@mito-matrix': {
    doing: '在复合体 IV 里,电子与基质侧质子、氧结合生成水。',
    why: '把高能电子的最后一站变成稳定的产物水,呼吸链完成放电。',
    hook: '电子+质子+氧 → 水,呼吸链收工。'
  },
  'etc|复合体 I@mito-inner-membrane>膜间隙 H⁺@mito-ims': {
    doing: '复合体 I 利用电子传递释放的能量，把质子泵到膜间隙。',
    why: '质子在膜间隙积累，为 ATP 合成储存势能。',
    hook: '复合体 I 是第一台质子泵。'
  },
  'etc|复合体 III@mito-inner-membrane>膜间隙 H⁺@mito-ims': {
    doing: '复合体 III 通过 Q 循环增加膜间隙侧的质子。',
    why: '它继续扩大内膜两侧的电化学差。',
    hook: '复合体 III 是第二个建梯度的站点。'
  },
  'etc|复合体 IV@mito-inner-membrane>膜间隙 H⁺@mito-ims': {
    doing: '复合体 IV 在还原氧的同时，将质子泵向膜间隙。',
    why: '它完成最后一段电子传递，并继续补充质子梯度。',
    hook: '复合体 IV：氧变水，质子继续向外泵。'
  },
  'etc|膜间隙 H⁺@mito-ims>质子动力势@mito-inner-membrane': {
    doing: '膜间隙的高质子浓度和膜电位共同形成质子动力势。',
    why: '这相当于把电子传递释放的能量暂时储存在内膜两侧。',
    hook: '质子堆在一侧，就像蓄水形成水压。'
  },
  'oxphos|膜间隙 H⁺@mito-ims>ATP 合酶@mito-inner-membrane': {
    doing: '膜间隙的质子经 ATP 合酶 F₀ 通道回流基质。',
    why: '质子顺梯度回流是 ATP 合酶旋转做功的动力来源。',
    hook: '水轮机进水口:H⁺ 往下冲,合酶转起来。'
  },
  'oxphos|ATP 合酶@mito-inner-membrane>ATP@mito-matrix': {
    doing: 'ATP 合酶利用回流质子的能量,把 ADP 与 Pi 合成 ATP 释放到基质。',
    why: '这是氧化磷酸化的产出时刻:呼吸链攒下的梯度在这里兑现成 ATP。',
    hook: '旋转发电:头颈每转一圈约出 3 个 ATP。'
  },
  'oxphos|ADP@mito-matrix>ATP@mito-matrix': {
    doing: 'ATP 合酶把基质中的 ADP 磷酸化为 ATP。',
    why: 'ADP 是待充能的底物，质子回流提供完成磷酸化所需的能量。',
    hook: 'ADP 是空电池，ATP 是充满电的电池。'
  },
  'oxphos|无机磷酸@mito-matrix>ATP@mito-matrix': {
    doing: '合成 ATP 所需的磷酸由基质侧的 Pi 提供的底物表示边。',
    why: '净反应是 ADP+Pi+质子动力势 → ATP+水;这一行突出磷酸这份原料。',
    hook: '原料之二:Pi 在基质待命。'
  },
  'oxphos|ATP@mito-matrix>ATP@mito-ims': {
    doing: '腺嘌呤核苷酸转位酶(ANT)把基质 ATP 换到膜间隙,同时换入膜间隙的 ADP。',
    why: '一对一反向交换:细胞要的是胞质 ATP,ADP 则回基质再充电。',
    hook: 'ANT 换工:出 ATP、进 ADP。'
  },
  'oxphos|ATP@mito-ims>ATP@cytosol': {
    doing: 'ATP 经外膜 VDAC 通道到达胞质。',
    why: '外膜对小分子开放,ATP 从这里供给全细胞使用。',
    hook: '出厂发货:ATP 出外膜去胞质。'
  },
  'oxphos|ADP@cytosol>ADP@mito-ims': {
    doing: '胞质用完的 ADP 经 VDAC 进入膜间隙。',
    why: 'ADP 是"空电池",要送回基质重新充电成 ATP。',
    hook: '空电池回收:ADP 进站。'
  },
  'oxphos|ADP@mito-ims>ADP@mito-matrix': {
    doing: 'ANT 在把 ATP 换出的同时,把膜间隙的 ADP 换入基质。',
    why: '与 ATP 输出配对的另一半:ATP 合酶需要基质侧持续的 ADP 供应。',
    hook: '换工另一半:ADP 进基质当原料。'
  },
  'oxphos|无机磷酸@cytosol>无机磷酸@mito-ims': {
    doing: '胞质的无机磷酸经 VDAC 进入膜间隙。',
    why: 'Pi 是合成 ATP 的另一份原料,要与 ADP 一起送进基质。',
    hook: '原料之一:Pi 也走外膜通道。'
  },
  'oxphos|无机磷酸@mito-ims>无机磷酸@mito-matrix': {
    doing: '线粒体磷酸载体把 Pi 与 H⁺ 同向送入基质。',
    why: 'Pi 入基质依赖质子同向转运,与 pH 梯度联动。',
    hook: '搭质子的便车:Pi+H⁺ 同进基质。'
  },
  'glycolysis|葡萄糖@cytosol>葡萄糖-6-磷酸@cytosol': {
    doing: '用 ATP 给葡萄糖加上磷酸，相当于先给它盖章。',
    why: '带磷酸的葡萄糖不容易离开细胞，从这里正式进入糖酵解。',
    hook: '进门先买票：花 1 个 ATP，把葡萄糖留在细胞里。'
  },
  'glycolysis|葡萄糖-6-磷酸@cytosol>果糖-6-磷酸@cytosol': {
    doing: '只调整分子结构，把葡萄糖骨架变成果糖骨架。',
    why: '这样下一步才能在另一端再加一个磷酸，为六碳糖裂成两半做准备。',
    hook: '原子没增减，只是换个姿势。'
  },
  'glycolysis|果糖-6-磷酸@cytosol>果糖-1,6-二磷酸@cytosol': {
    doing: '再消耗 1 个 ATP，给果糖-6-磷酸加第二个磷酸。',
    why: '这是糖酵解的重要调控关口，也让分子适合在下一步从中间裂开。',
    hook: '第二次买票；磷酸果糖激酶-1 是关键关卡。'
  },
  'glycolysis|果糖-1,6-二磷酸@cytosol>磷酸二羟丙酮@cytosol': {
    doing: '把一个六碳糖切成两个三碳糖：磷酸二羟丙酮和甘油醛-3-磷酸。',
    why: '从这里开始，一分子葡萄糖的后续反应会按两份三碳物计算。',
    hook: '一刀两断：六碳变成两个三碳。'
  },
  'glycolysis|磷酸二羟丙酮@cytosol>甘油醛-3-磷酸@cytosol': {
    doing: '把磷酸二羟丙酮转成甘油醛-3-磷酸。',
    why: '只有甘油醛-3-磷酸能继续沿主线反应，转化后两份三碳糖都能向下走。',
    hook: '把配角转成主角，两份一起进入收益阶段。'
  },
  'glycolysis|甘油醛-3-磷酸@cytosol>1,3-二磷酸甘油酸@cytosol': {
    doing: '氧化甘油醛-3-磷酸，同时生成 NADH，并形成高能磷酸化合物。',
    why: '糖中的能量第一次被保存到 NADH 和高能磷酸键中。',
    hook: '氧化并充电：NADH 在这里出现。'
  },
  'glycolysis|1,3-二磷酸甘油酸@cytosol>3-磷酸甘油酸@cytosol': {
    doing: '把高能磷酸直接交给 ADP，生成 ATP。',
    why: '这是糖酵解第一次底物水平磷酸化，开始收回前面投入的 ATP。',
    hook: '第一次取现：高能磷酸直接变 ATP。'
  },
  'glycolysis|3-磷酸甘油酸@cytosol>2-磷酸甘油酸@cytosol': {
    doing: '把磷酸基从 3 号碳移到 2 号碳。',
    why: '这一步不产能，作用是把结构调整到适合下一步脱水的位置。',
    hook: '先搬位置，再为能量升压。'
  },
  'glycolysis|2-磷酸甘油酸@cytosol>磷酸烯醇式丙酮酸@cytosol': {
    doing: '脱去一分子水，形成高能的磷酸烯醇式丙酮酸。',
    why: '脱水把能量集中到高能磷酸键，为下一步合成 ATP 做准备。',
    hook: '脱水增压，磷酸烯醇式丙酮酸像拉满的弹弓。'
  },
  'glycolysis|磷酸烯醇式丙酮酸@cytosol>丙酮酸@cytosol': {
    doing: '把高能磷酸交给 ADP，生成 ATP 和丙酮酸。',
    why: '这是第二次底物水平磷酸化，也是糖酵解的第三个不可逆关口。',
    hook: '弹弓释放：ATP 到账，丙酮酸形成。'
  },
  'gluconeogenesis|乳酸@cytosol>丙酮酸@cytosol': {
    doing: '乳酸脱氢酶把乳酸氧化成丙酮酸，同时把氧化型烟酰胺腺嘌呤二核苷酸（NAD⁺）还原成还原型烟酰胺腺嘌呤二核苷酸（NADH）。',
    why: '乳酸先回到丙酮酸，才能接入糖异生主线；这也是乳酸循环把外周组织产生的乳酸送回肝脏利用的入口。',
    hook: '乳酸先氧化成丙酮酸，碳骨架回到糖代谢起点。'
  },
  'gluconeogenesis|丙氨酸@cytosol>丙酮酸@cytosol': {
    doing: '丙氨酸转氨酶把丙氨酸的氨基转给 α-酮戊二酸，生成丙酮酸和谷氨酸。',
    why: '丙氨酸去掉氨基后留下可生糖的三碳骨架；氨基则被暂时转移到谷氨酸上，后续再进入含氮代谢。',
    hook: '先转走氨基，丙氨酸就变回糖异生可以使用的丙酮酸。'
  },
  'gluconeogenesis|丙酮酸@cytosol>丙酮酸@mito-ims': {
    doing: '电压依赖性阴离子通道（VDAC）让胞质丙酮酸通过线粒体外膜，进入线粒体膜间隙。',
    why: '丙酮酸羧化酶位于线粒体基质，丙酮酸必须先跨过外膜，才能到达真正的催化位置。',
    hook: '先过外膜通道，再进入线粒体内部。'
  },
  'gluconeogenesis|丙酮酸@mito-ims>丙酮酸@mito-matrix': {
    doing: '线粒体丙酮酸载体（MPC）把膜间隙中的丙酮酸连同质子带入线粒体基质。',
    why: '丙酮酸羧化酶的工作区在基质；这一步完成的是到达酶所在区室，不是碳骨架的化学转化。',
    hook: 'MPC 是入口，先把丙酮酸送到基质再开始羧化。'
  },
  'gluconeogenesis|丙酮酸@mito-matrix>草酰乙酸@mito-matrix': {
    doing: '丙酮酸羧化酶消耗三磷酸腺苷（ATP）和碳酸氢根，把三碳丙酮酸变成四碳草酰乙酸。',
    why: '这是绕过丙酮酸激酶的第一处绕行的前半步：先补上一个碳，给后续生成磷酸烯醇式丙酮酸准备骨架。',
    hook: '第一处绕行先羧化：丙酮酸 + 一个碳 + ATP，变成草酰乙酸。'
  },
  'gluconeogenesis|草酰乙酸@mito-matrix>苹果酸@mito-matrix': {
    doing: '线粒体苹果酸脱氢酶（MDH2）用还原型烟酰胺腺嘌呤二核苷酸（NADH）把草酰乙酸还原成苹果酸，同时再生氧化型烟酰胺腺嘌呤二核苷酸（NAD⁺）。',
    why: '草酰乙酸不能直接穿过线粒体内膜，先变成苹果酸，才能借助转运系统把碳骨架和还原当量带到胞质。',
    hook: '草酰乙酸先换成能出线粒体的苹果酸。'
  },
  'gluconeogenesis|苹果酸@mito-matrix>苹果酸@cytosol': {
    doing: '苹果酸-α-酮戊二酸反向转运体把线粒体基质中的苹果酸换到胞质，同时交换胞质和基质中的 α-酮戊二酸。',
    why: '这一步把糖异生所需的碳骨架送出线粒体；苹果酸携带的还原状态也为胞质后续反应提供条件。',
    hook: '用苹果酸搭便车出线粒体，换回胞质继续造糖。'
  },
  'gluconeogenesis|苹果酸@cytosol>草酰乙酸@cytosol': {
    doing: '胞质苹果酸脱氢酶（MDH1）把苹果酸氧化回草酰乙酸，并生成还原型烟酰胺腺嘌呤二核苷酸（NADH）。',
    why: '胞质重新得到草酰乙酸，才能继续绕过丙酮酸激酶；同时产生的 NADH 为后面甘油醛-3-磷酸形成提供还原力。',
    hook: '苹果酸到胞质后再变回草酰乙酸，并把还原力留下。'
  },
  'gluconeogenesis|草酰乙酸@cytosol>磷酸烯醇式丙酮酸@cytosol': {
    doing: '磷酸烯醇式丙酮酸羧激酶消耗三磷酸鸟苷（GTP），脱去二氧化碳，把草酰乙酸变成磷酸烯醇式丙酮酸。',
    why: '这是绕过丙酮酸激酶的第一处绕行的后半步；它与丙酮酸羧化酶前后衔接，共同完成这一处绕行。',
    hook: '第一处绕行分两步：先羧化，再脱羧并生成磷酸烯醇式丙酮酸。'
  },
  'gluconeogenesis|磷酸烯醇式丙酮酸@cytosol>2-磷酸甘油酸@cytosol': {
    doing: '烯醇化酶让磷酸烯醇式丙酮酸加水，生成 2-磷酸甘油酸。',
    why: '这一步沿糖酵解下游反应的反方向运行，把高能三碳中间体逐步还原为更靠近甘油醛-3-磷酸的形式。',
    hook: '糖异生不是凭空造路，而是沿糖酵解可逆段倒着走。'
  },
  'gluconeogenesis|2-磷酸甘油酸@cytosol>3-磷酸甘油酸@cytosol': {
    doing: '磷酸甘油酸变位酶把磷酸基从 2 号碳移回 3 号碳。',
    why: '位置调整为下一步补入高能磷酸做好准备；这一步本身不消耗或生成 ATP。',
    hook: '只搬磷酸位置，不改变碳数。'
  },
  'gluconeogenesis|3-磷酸甘油酸@cytosol>1,3-二磷酸甘油酸@cytosol': {
    doing: '磷酸甘油酸激酶消耗三磷酸腺苷（ATP），把 3-磷酸甘油酸重新变成 1,3-二磷酸甘油酸。',
    why: '糖异生要逆着糖酵解收益段运行，因此这里需要投入 ATP，把中间体重新推回高能状态。',
    hook: '糖酵解在这里产 ATP，糖异生要把 ATP 投回去。'
  },
  'gluconeogenesis|1,3-二磷酸甘油酸@cytosol>甘油醛-3-磷酸@cytosol': {
    doing: '甘油醛-3-磷酸脱氢酶用还原型烟酰胺腺嘌呤二核苷酸（NADH）和质子，把 1,3-二磷酸甘油酸还原成甘油醛-3-磷酸。',
    why: '这一步补回甘油醛-3-磷酸，并消耗前面经苹果酸往返带到胞质的 NADH。',
    hook: '把高能二磷酸中间体还原成甘油醛-3-磷酸，正式回到三碳糖汇合点。'
  },
  'gluconeogenesis|甘油醛-3-磷酸@cytosol>磷酸二羟丙酮@cytosol': {
    doing: '磷酸丙糖异构酶把甘油醛-3-磷酸和磷酸二羟丙酮之间相互转换。',
    why: '醛缩酶需要一个甘油醛-3-磷酸和一个磷酸二羟丙酮，才能把两份三碳骨架合成六碳骨架。',
    hook: '先把两种三碳糖配齐，下一步才能合成六碳糖。'
  },
  'gluconeogenesis|甘油醛-3-磷酸@cytosol>果糖-1,6-二磷酸@cytosol': {
    doing: '醛缩酶把甘油醛-3-磷酸和磷酸二羟丙酮缩合，生成果糖-1,6-二磷酸。',
    why: '两份三碳骨架在这里重新合并成六碳骨架；这一步是糖酵解醛缩反应的可逆方向。',
    hook: '三碳 + 三碳，重新拼成六碳。'
  },
  'gluconeogenesis|果糖-1,6-二磷酸@cytosol>果糖-6-磷酸@cytosol': {
    doing: '果糖-1,6-二磷酸酶-1 用水去掉一个磷酸，生成果糖-6-磷酸和无机磷酸。',
    why: '这是糖异生绕过磷酸果糖激酶-1的第二处绕行，也是从高能二磷酸回到单磷酸的关键放行点。',
    hook: '第二处绕行：去掉磷酸，放行果糖-6-磷酸。'
  },
  'gluconeogenesis|果糖-6-磷酸@cytosol>葡萄糖-6-磷酸@cytosol': {
    doing: '磷酸葡萄糖异构酶把果糖-6-磷酸和葡萄糖-6-磷酸相互转换，只调整六碳糖的结构。',
    why: '葡萄糖-6-磷酸是进入末端释糖步骤的形式，也可以分流到糖原合成或磷酸戊糖途径。',
    hook: '六碳糖换个排列，来到葡萄糖出口前。'
  },
  'gluconeogenesis|葡萄糖-6-磷酸@cytosol>葡萄糖-6-磷酸@er-lumen': {
    doing: '葡萄糖-6-磷酸转位酶把胞质中的葡萄糖-6-磷酸送入内质网腔。',
    why: '葡萄糖-6-磷酸酶的催化位点朝向内质网腔，底物必须先到达这个区室，才能完成最后的去磷酸化。',
    hook: '最后一关在内质网腔，底物先通过转位酶进场。'
  },
  'gluconeogenesis|葡萄糖-6-磷酸@er-lumen>葡萄糖@er-lumen': {
    doing: '葡萄糖-6-磷酸酶用水切掉葡萄糖-6-磷酸的磷酸基，生成葡萄糖和无机磷酸。',
    why: '去掉磷酸后，葡萄糖才成为可以离开细胞、参与维持血糖的游离形式；这是糖异生绕过己糖激酶的第三处绕行。',
    hook: '第三处绕行：最后去掉磷酸，得到可以输出的游离葡萄糖。'
  },
  'gluconeogenesis|葡萄糖@er-lumen>葡萄糖@cytosol': {
    doing: '葡萄糖转位酶把内质网腔中的游离葡萄糖送回胞质。',
    why: '这只是葡萄糖离开内质网的出口；之后还要通过质膜转运，才能从肝细胞释放到血液。',
    hook: '先出内质网，再出细胞，两个出口不要混成一步。'
  },
  'gluconeogenesis|甘油@cytosol>甘油-3-磷酸@cytosol': {
    doing: '甘油激酶消耗三磷酸腺苷（ATP），把甘油磷酸化成甘油-3-磷酸。',
    why: '甘油先变成带磷酸的三碳中间体，才能继续转成磷酸二羟丙酮并汇入糖异生主线。',
    hook: '甘油先加磷酸，获得进入中央代谢的通行证。'
  },
  'gluconeogenesis|甘油-3-磷酸@cytosol>磷酸二羟丙酮@cytosol': {
    doing: '胞质甘油-3-磷酸脱氢酶把甘油-3-磷酸氧化成磷酸二羟丙酮，同时生成还原型烟酰胺腺嘌呤二核苷酸（NADH）。',
    why: '磷酸二羟丙酮是糖异生三碳段的直接中间体，甘油因此可以绕过上游步骤进入主线。',
    hook: '甘油在这里接入三碳糖池，随后与另一份三碳糖合成六碳糖。'
  },
  'glycogenesis|葡萄糖@cytosol>葡萄糖-6-磷酸@cytosol': {
    doing: '己糖激酶消耗一分子三磷酸腺苷（ATP），把葡萄糖磷酸化成葡萄糖-6-磷酸。',
    why: '磷酸化把葡萄糖留在细胞内，也把它送入糖酵解、磷酸戊糖途径或糖原合成的共同入口。',
    hook: '先给葡萄糖加磷酸，之后才决定燃烧还是储存。'
  },
  'glycogenesis|葡萄糖-6-磷酸@cytosol>葡萄糖-1-磷酸@cytosol': {
    doing: '磷酸葡萄糖变位酶把磷酸基从葡萄糖的第 6 位移到第 1 位，生成葡萄糖-1-磷酸。',
    why: '第 1 位磷酸形式才能与尿苷三磷酸（UTP）反应，制成用于延长糖原的活化葡萄糖。',
    hook: '不增不减，只把磷酸搬到 1 号碳。'
  },
  'glycogenesis|葡萄糖-1-磷酸@cytosol>UDP-葡萄糖@cytosol': {
    doing: '尿苷二磷酸葡萄糖焦磷酸化酶让葡萄糖-1-磷酸与尿苷三磷酸（UTP）结合，生成尿苷二磷酸葡萄糖（UDP-葡萄糖）和焦磷酸。',
    why: 'UDP-葡萄糖是糖原合酶能直接使用的活化供体；焦磷酸随后水解，推动整体净方向朝合成侧前进。',
    hook: '先用 UTP 给葡萄糖装上“可转移把手”。'
  },
  'glycogenesis|UDP-葡萄糖@cytosol>糖原@cytosol': {
    doing: '糖原合酶把 UDP-葡萄糖中的葡萄糖单元接到糖原链的非还原端,每次延长一个残基并释放 UDP。',
    why: '合酶只负责沿 α-1,4 主线延长;起头靠糖原引蛋白的引物,分叉靠分支酶的 α-1,6 分支。',
    hook: '合酶只管接龙:加一个糖,放一个 UDP。'
  },
  'glycogenolysis|葡萄糖-6-磷酸@cytosol>葡萄糖-6-磷酸@er-lumen': {
    doing: '葡萄糖-6-磷酸转位酶把胞质中的葡萄糖-6-磷酸送入内质网腔。',
    why: '葡萄糖-6-磷酸酶的催化位点位于内质网腔侧；肝脏等释糖组织必须先完成这次跨膜运输。',
    hook: '要去掉磷酸，先把底物送进内质网腔。'
  },
  'glycogenolysis|葡萄糖-6-磷酸@er-lumen>葡萄糖@er-lumen': {
    doing: '葡萄糖-6-磷酸酶用水切掉磷酸基，生成游离葡萄糖和无机磷酸。',
    why: '去磷酸后的葡萄糖才能离开细胞参与维持血糖；骨骼肌缺少这套有效释糖能力，主要把葡萄糖-6-磷酸留给自己供能。',
    hook: '肝脏能拆掉最后一个磷酸，肌肉通常不能。'
  },
  'glycogenolysis|葡萄糖@er-lumen>葡萄糖@cytosol': {
    doing: '葡萄糖转运系统把内质网腔中生成的游离葡萄糖送回胞质。',
    why: '这只是离开内质网的出口；葡萄糖之后还需经过质膜转运才能真正进入血液。',
    hook: '先出内质网，再出细胞，两层出口不要混为一步。'
  },
  'glycogenolysis|糖原@cytosol>葡萄糖-1-磷酸@cytosol': {
    doing: '糖原磷酸化酶用无机磷酸从糖原外层链逐个磷酸解 α-1,4 键,释放葡萄糖-1-磷酸。',
    why: '磷酸解不耗 ATP,直接得到活化的 G1P;距分支点四个残基处停下,交给去分支酶。',
    hook: '不用 ATP 拆链:Pi 顶上,遇到岔路才停车。'
  },
  'glycogenolysis|糖原@cytosol>葡萄糖@cytosol': {
    doing: '去分支酶的 α-1,6-葡萄糖苷酶活性在分支点水解释放一个游离葡萄糖。',
    why: '每个分支点贡献约一个自由葡萄糖;主体产物仍是磷酸化酶的 G1P。',
    hook: '分支点的散装货:一个分支换一个葡萄糖。'
  },
  'glycogenolysis|葡萄糖-1-磷酸@cytosol>葡萄糖-6-磷酸@cytosol': {
    doing: '磷酸葡萄糖变位酶把葡萄糖-1-磷酸可逆地转成葡萄糖-6-磷酸。',
    why: '肌肉可让葡萄糖-6-磷酸直接进入糖酵解供自身使用；肝脏则可继续处理并帮助维持血糖。',
    hook: '糖原拆出的糖先到葡萄糖-6-磷酸，再按组织决定去向。'
  },
  'ppp|葡萄糖-6-磷酸@cytosol>6-磷酸葡萄糖酸内酯@cytosol': {
    doing: '葡萄糖-6-磷酸脱氢酶氧化葡萄糖-6-磷酸，并把电子交给氧化型烟酰胺腺嘌呤二核苷酸磷酸（NADP⁺），生成 NADPH。',
    why: '这是磷酸戊糖途径氧化阶段的限速入口；生成的 NADPH 主要用于抗氧化和还原合成。',
    hook: '不先求 ATP，先把电子存进 NADPH。'
  },
  'ppp|6-磷酸葡萄糖酸内酯@cytosol>6-磷酸葡萄糖酸@cytosol': {
    doing: '6-磷酸葡萄糖酸内酯酶用水打开内酯环，形成稳定的 6-磷酸葡萄糖酸。',
    why: '开环为下一次氧化脱羧准备底物，本步本身不生成新的 NADPH。',
    hook: '先开环，再脱羧。'
  },
  'ppp|6-磷酸葡萄糖酸@cytosol>核酮糖-5-磷酸@cytosol': {
    doing: '6-磷酸葡萄糖酸脱氢酶完成氧化脱羧，释放二氧化碳，并生成第二个 NADPH 和五碳的核酮糖-5-磷酸。',
    why: '氧化阶段到这里完成：一个六碳底物变成五碳糖，同时获得两份还原力。',
    hook: '六碳变五碳，释放二氧化碳，再收一份 NADPH。'
  },
  'ppp|核酮糖-5-磷酸@cytosol>核糖-5-磷酸@cytosol': {
    doing: '核糖-5-磷酸异构酶重新排列羰基位置，把核酮糖-5-磷酸变成核糖-5-磷酸。',
    why: '核糖-5-磷酸可用于合成核苷酸；细胞需要复制、转录或快速增殖时尤其重要。',
    hook: '五碳糖换结构，得到核苷酸的糖骨架。'
  },
  'ppp|核酮糖-5-磷酸@cytosol>木酮糖-5-磷酸@cytosol': {
    doing: '核酮糖-5-磷酸-3-差向异构酶改变一个碳原子的空间构型，生成木酮糖-5-磷酸。',
    why: '木酮糖-5-磷酸是后续转酮醇反应的二碳供体，使多余五碳糖能够重新接回中央糖代谢。',
    hook: '仍是五个碳，只把一个手性中心翻面。'
  },
  'ppp|木酮糖-5-磷酸@cytosol>甘油醛-3-磷酸@cytosol': {
    doing: '转酮醇酶借助焦磷酸硫胺素（TPP）把木酮糖-5-磷酸的两个碳转给核糖-5-磷酸，生成甘油醛-3-磷酸和景天庚酮糖-7-磷酸。',
    why: '画布主边只连出木酮糖-5-磷酸与甘油醛-3-磷酸，核糖-5-磷酸和景天庚酮糖-7-磷酸同属这一反应，不能漏算。',
    hook: '转酮醇酶搬两个碳：5 + 5 变成 3 + 7。'
  },
  'ppp|景天庚酮糖-7-磷酸@cytosol>果糖-6-磷酸@cytosol': {
    doing: '转醛醇酶把景天庚酮糖-7-磷酸的三个碳转给甘油醛-3-磷酸，生成果糖-6-磷酸和赤藓糖-4-磷酸。',
    why: '这一步继续重排碳骨架，并产生能够回到糖酵解或糖异生的果糖-6-磷酸。',
    hook: '转醛醇酶搬三个碳：7 + 3 变成 6 + 4。'
  },
  'ppp|赤藓糖-4-磷酸@cytosol>果糖-6-磷酸@cytosol': {
    doing: '转酮醇酶再次搬运两个碳：木酮糖-5-磷酸与赤藓糖-4-磷酸生成果糖-6-磷酸和甘油醛-3-磷酸。',
    why: '非氧化阶段由此把五碳糖整理成两种中央代谢中间体，可按细胞需要回流或反向生成核糖。',
    hook: '最后再搬两个碳：5 + 4 变成 6 + 3。'
  },
  'fa_synthesis|柠檬酸@cytosol>乙酰辅酶 A@cytosol': {
    doing: 'ATP 柠檬酸裂解酶用 CoA-SH 和 ATP 把胞质柠檬酸拆成乙酰辅酶 A、草酰乙酸和 ADP。',
    why: '柠檬酸把线粒体里的碳带到胞质；裂解后得到的乙酰辅酶 A 才能进入脂肪酸合成。',
    hook: '柠檬酸出线粒体，先拆出乙酰辅酶 A，再开始造脂肪。'
  },
  'fa_synthesis|乙酰辅酶 A@cytosol>丙二酰-CoA@cytosol': {
    doing: '乙酰辅酶 A 羧化酶（ACC）消耗 ATP 和碳酸氢根，给乙酰辅酶 A 加上一个碳，生成丙二酰-CoA。',
    why: '丙二酰-CoA 是脂肪酸合酶使用的二碳供体；ACC 这一步是脂肪酸合成的主要承诺和调控关口。',
    hook: '先给乙酰辅酶 A 加一颗碳，做成可用于延长脂肪酸的丙二酰-CoA。'
  },
  'fa_synthesis|丙二酰-CoA@cytosol>棕榈酸@cytosol': {
    doing: '脂肪酸合酶以乙酰辅酶 A 作引物，反复缩合、还原、脱水和再还原，把丙二酰-CoA提供的二碳单位拼成长链，最终形成棕榈酸。',
    why: '这条边表示多轮循环的净结果；每轮都要消耗 NADPH，丙二酰-CoA 脱羧则推动碳链延长。',
    hook: '不是一步变长，而是七轮“加两碳并还原”，最后得到 16 碳棕榈酸。'
  },
  'fa_synthesis|NADPH@cytosol>棕榈酸@cytosol': {
    doing: '这是脂肪酸合酶净反应的还原力表示边：14 个 NADPH 为多轮缩合后的还原步骤提供电子。',
    why: '它和“丙二酰-CoA → 棕榈酸”属于同一个多酶、多轮净反应，不是 NADPH 单独变成棕榈酸。',
    hook: '同一条合成反应的另一入口：脂肪酸合成要用 NADPH 供还原力。'
  },
  'carnitine|脂酰-CoA@cytosol>脂酰肉碱@cytosol': {
    doing: '外膜胞质侧的 CPT1 把长链脂酰基从 CoA 转给肉碱,生成脂酰肉碱并释放 CoA-SH。',
    why: '长链脂酰-CoA 过不了内膜;CPT1 是肉碱穿梭的闸门,也受丙二酰-CoA 抑制。',
    hook: '换车票:脂酰基从 CoA 换到肉碱上。'
  },
  'carnitine|肉碱@cytosol>脂酰肉碱@cytosol': {
    doing: '同一 CPT1 反应的肉碱底物边:肉碱接收脂酰基。',
    why: '这是同一次转酯的汇聚表示边,与脂酰-CoA 行不重复计数。',
    hook: '同一笔交易的两个视角。'
  },
  'carnitine|脂酰肉碱@cytosol>脂酰肉碱@mito-ims': {
    doing: '脂酰肉碱经外膜 VDAC 通道进入膜间隙。',
    why: 'CACT 的结合位点在内膜,脂酰肉碱要先穿过外膜。',
    hook: '过纱窗:脂酰肉碱到膜间隙候车。'
  },
  'carnitine|脂酰肉碱@mito-ims>脂酰肉碱@mito-matrix': {
    doing: '线粒体内膜上的肉碱-脂酰肉碱转位酶（CACT）以交换方式把脂酰肉碱送入基质，同时把游离肉碱送回膜间隙侧。',
    why: 'CACT 负责真正跨过内膜；它不是化学转化，而是维持肉碱循环的交换运输。',
    hook: '脂酰肉碱进来，肉碱换出去，内膜靠交换完成过关。'
  },
  'carnitine|肉碱@mito-matrix>肉碱@mito-ims': {
    doing: 'CACT 把脂酰肉碱送入基质的同时,把一个肉碱换回膜间隙侧。',
    why: '反向交换保持两侧电荷与肉碱池平衡,空肉碱回胞质接下一趟。',
    hook: '班车的回程票:空肉碱原路返回。'
  },
  'carnitine|脂酰肉碱@mito-matrix>脂酰-CoA@mito-matrix': {
    doing: '基质侧的肉碱棕榈酰转移酶 2（CPT2）把脂酰基从肉碱转回 CoA，生成可被 β-氧化使用的脂酰-CoA。',
    why: '恢复成脂酰-CoA后，脂肪酸才进入脱氢、水合、再脱氢和硫解循环；肉碱则被释放并返回穿梭。',
    hook: '到达基质后再换回 CoA，脂酰链正式接入 β-氧化。'
  },
  'beta_oxidation|脂酰-CoA@mito-matrix>烯酰-CoA@mito-matrix': {
    doing: '脂酰-CoA 脱氢酶从脂酰链的 α、β 位移走氢，形成 trans-Δ²-烯酰-CoA，并把电子交给 FAD 生成 FADH₂。',
    why: '第一次脱氢把碳链变成下一步可加水的双键，同时把一份还原力送入呼吸链。',
    hook: '先脱氢造双键：FADH₂ 在 β-氧化第一步充电。'
  },
  'beta_oxidation|烯酰-CoA@mito-matrix>β-羟脂酰-CoA@mito-matrix': {
    doing: '烯酰-CoA 水合酶把水加到双键两端，生成具有正确立体构型的 β-羟脂酰-CoA。',
    why: '羟基被放到 β 位，下一步才能把它氧化成 β-酮基；本步本身不产生 ATP 或还原当量。',
    hook: '给双键加水，把结构摆到下一次氧化所需的位置。'
  },
  'beta_oxidation|β-羟脂酰-CoA@mito-matrix>β-酮脂酰-CoA@mito-matrix': {
    doing: 'β-羟脂酰-CoA 脱氢酶把 β-羟基氧化为 β-酮基，并把 NAD⁺ 还原为 NADH。',
    why: 'β-酮基让最后的硫解切割成为可能；这一轮又保存了一份还原力。',
    hook: '第二次脱氢把羟基变成酮基，为拆下乙酰辅酶 A 做准备。'
  },
  'beta_oxidation|β-酮脂酰-CoA@mito-matrix>乙酰辅酶 A@mito-matrix': {
    doing: 'β-酮硫解酶用 CoA-SH 进行硫解，切下两个碳形成乙酰辅酶 A，同时留下缩短两个碳的脂酰-CoA。',
    why: '乙酰辅酶 A 进入三羧酸循环，缩短后的脂酰-CoA继续下一轮；因此每轮都重复四步。',
    hook: '最后一刀拆下两碳乙酰辅酶 A，剩下的脂酰链继续循环。'
  },
  'ketone|乙酰辅酶 A@mito-matrix>乙酰乙酰辅酶 A@mito-matrix': {
    doing: '硫解酶把两分子乙酰辅酶 A 缩合成乙酰乙酰辅酶 A，并释放一分子 CoA-SH。',
    why: '这是肝线粒体生成酮体的起始缩合，把过量乙酰辅酶 A 汇入酮体路线。',
    hook: '两分子乙酰辅酶 A 先合成四碳的酮体前体。'
  },
  'ketone|乙酰乙酰辅酶 A@mito-matrix>HMG-CoA@mito-matrix': {
    doing: 'HMG-CoA 合成酶把另一分子乙酰辅酶 A 加到乙酰乙酰辅酶 A 上，并用水生成 HMG-CoA。',
    why: '肝线粒体 HMG-CoA 合成酶 2（HMGCS2）控制酮体生成的关键承诺步骤。',
    hook: '再接上一颗乙酰基，四碳前体变成六碳 HMG-CoA。'
  },
  'ketone|HMG-CoA@mito-matrix>乙酰乙酸@mito-matrix': {
    doing: 'HMG-CoA 裂解酶把 HMG-CoA 拆成乙酰乙酸和乙酰辅酶 A。',
    why: '乙酰乙酸是第一个真正释放出来的酮体，可以直接输出，也可以转成 β-羟丁酸。',
    hook: 'HMG-CoA 一分为二：一份酮体，另一份乙酰辅酶 A。'
  },
  'ketone|乙酰乙酸@mito-matrix>β-羟丁酸@mito-matrix': {
    doing: 'β-羟丁酸脱氢酶利用 NADH 和质子把乙酰乙酸还原成 β-羟丁酸，并生成 NAD⁺。',
    why: '乙酰乙酸与 β-羟丁酸的比例反映线粒体 NADH/NAD⁺ 状态；β-羟丁酸是肝输出的重要还原型酮体。',
    hook: 'NADH 越多，乙酰乙酸越容易被还原成 β-羟丁酸。'
  },
  'ketone|乙酰乙酸@mito-matrix>乙酰乙酰辅酶 A@mito-matrix': {
    doing: '外周组织的 SCOT（琥珀酰-CoA:3-酮酸 CoA 转移酶）把 CoA 从琥珀酰-CoA转给乙酰乙酸，生成乙酰乙酰辅酶 A。',
    why: '这一步启动酮体利用；肝脏缺少 SCOT，所以肝生成酮体但不能把它作为自己的主要燃料。',
    hook: '外周组织先把酮体重新接上 CoA，才能拆回能量。'
  },
  'ketone|乙酰乙酰辅酶 A@mito-matrix>乙酰辅酶 A@mito-matrix': {
    doing: 'β-酮硫解酶把乙酰乙酰辅酶 A 裂解成两分子乙酰辅酶 A。',
    why: '两分子乙酰辅酶 A 进入三羧酸循环氧化，酮体携带的碳由此转成可利用的能量。',
    hook: '酮体利用的最后一步：四碳前体拆成两份乙酰辅酶 A。'
  },
  'ketone|β-羟丁酸@mito-matrix>乙酰乙酸@mito-matrix': {
    doing: '利用酮体的组织把 β-羟丁酸氧化回乙酰乙酸,同时生成 NADH。',
    why: '只有乙酰乙酸能被 SCOT 活化进 TCA;这一步顺手回收一个 NADH。',
    hook: '用酮体先氧化:β-羟丁酸 → 乙酰乙酸+NADH。'
  },
  'transamination|氨基酸@cytosol>α-酮酸@cytosol': {
    doing: '氨基转移酶借助磷酸吡哆醛（PLP）把氨基酸的氨基转给 α-酮戊二酸，生成相应的 α-酮酸和谷氨酸。',
    why: '多数氨基酸先把氮集中到谷氨酸，再分别处理氮和碳骨架；图中“氨基酸”和“α-酮酸”代表一类物质，不是某一个固定分子。',
    hook: '转氨只搬氨基：氮汇入谷氨酸，原碳骨架变成 α-酮酸。'
  },
  'transamination|谷氨酸@cytosol>谷氨酸@mito-matrix': {
    doing: '谷氨酸载体把胞质谷氨酸送入线粒体基质。',
    why: '谷氨酸氧化脱氨和尿素循环起始步骤位于线粒体基质，集中来的氮必须先到达这个区室。',
    hook: '先把装着氨基的谷氨酸送进线粒体，再释放氮。'
  },
  'transamination|谷氨酸@mito-matrix>α-酮戊二酸@mito-matrix': {
    doing: '谷氨酸脱氢酶把谷氨酸氧化脱氨，碳骨架恢复为 α-酮戊二酸，同时生成铵离子和还原型烟酰胺腺嘌呤二核苷酸（NADH）。',
    why: 'α-酮戊二酸可以回到三羧酸循环或继续接收氨基，氮则以铵离子形式交给尿素循环处理。',
    hook: '谷氨酸在这里一分为二：碳回循环，氮去造尿素。'
  },
  'transamination|谷氨酸@mito-matrix>NH₄⁺@mito-matrix': {
    doing: '这条边突出同一次谷氨酸氧化脱氨释放出的铵离子（NH₄⁺）。',
    why: '它与“谷氨酸生成 α-酮戊二酸”是同一个谷氨酸脱氢酶反应的第二种表示，不应重复计算为额外一步。',
    hook: '同一反应看两端：碳骨架回收，铵离子进入尿素循环。'
  },
  'urea|NH₄⁺@mito-matrix>氨甲酰磷酸@mito-matrix': {
    doing: '氨甲酰磷酸合成酶 I 在 N-乙酰谷氨酸激活下，消耗两分子三磷酸腺苷（ATP），把铵离子和二氧化碳合成氨甲酰磷酸。',
    why: '这是尿素循环的起始和限速步骤，第一个氮由游离铵离子提供，并先被固定在较安全的氨甲酰磷酸中。',
    hook: '在线粒体基质先花 2 个 ATP，把第一个氮装进氨甲酰磷酸。'
  },
  'urea|氨甲酰磷酸@mito-matrix>瓜氨酸@mito-matrix': {
    doing: '鸟氨酸氨甲酰基转移酶把氨甲酰磷酸的氨甲酰基转给鸟氨酸，生成瓜氨酸。',
    why: '氨甲酰磷酸携带的第一个氮由此进入循环主链；鸟氨酸是同一反应的另一底物。',
    hook: '氨甲酰磷酸交货，鸟氨酸接货，得到瓜氨酸。'
  },
  'urea|鸟氨酸@mito-matrix>瓜氨酸@mito-matrix': {
    doing: '这条边强调鸟氨酸也参与生成瓜氨酸，它与氨甲酰磷酸在同一次反应中汇合。',
    why: '它与“氨甲酰磷酸生成瓜氨酸”是同一个鸟氨酸氨甲酰基转移酶反应的第二种表示，不是额外一步。',
    hook: '两条入边，一次反应：氨甲酰磷酸 + 鸟氨酸 → 瓜氨酸。'
  },
  'urea|瓜氨酸@mito-matrix>瓜氨酸@cytosol': {
    doing: '线粒体鸟氨酸/瓜氨酸转运系统把基质中的瓜氨酸送到胞质。',
    why: '尿素循环前两步在线粒体基质，后续合成精氨酸代琥珀酸、精氨酸和尿素的步骤在胞质。',
    hook: '瓜氨酸出线粒体，尿素循环从基质段切换到胞质段。'
  },
  'urea|瓜氨酸@cytosol>精氨代琥珀酸@cytosol': {
    doing: '精氨代琥珀酸合成酶让瓜氨酸与天冬氨酸结合,并把 ATP 裂解成 AMP 和焦磷酸。',
    why: '天冬氨酸带来尿素中的第二个氮;ATP 变为 AMP 相当于消耗两个高能磷酸键,推动反应向前。',
    hook: '第二个氮来自天冬氨酸,代价是 ATP 直接降到 AMP。'
  },
  'urea|天冬氨酸@cytosol>精氨代琥珀酸@cytosol': {
    doing: '同一精氨代琥珀酸合成酶反应的天冬氨酸底物边。',
    why: '汇聚表示边:与瓜氨酸行是同一次缩合,天冬氨酸供应第二个氮。',
    hook: '同一笔交易的两个视角。'
  },
  'urea|精氨代琥珀酸@cytosol>精氨酸@cytosol': {
    doing: '精氨代琥珀酸裂解酶把精氨代琥珀酸裂成精氨酸和延胡索酸。',
    why: '精氨酸继续水解释放尿素,延胡索酸则接回 TCA 与天冬氨酸再生。',
    hook: '一分为二:精氨酸去产尿素,延胡索酸接回能量代谢。'
  },
  'urea|精氨代琥珀酸@cytosol>延胡索酸@cytosol': {
    doing: '同一裂解反应的延胡索酸产物表示边。',
    why: '延胡索酸是尿素循环与 TCA 的桥:经苹果酸、草酰乙酸可再转氨成天冬氨酸。',
    hook: '裂解的另一头:延胡索酸把氮代谢接回能量代谢。'
  },
  'urea|精氨酸@cytosol>鸟氨酸@cytosol': {
    doing: '精氨酸酶用水切开精氨酸，生成鸟氨酸和尿素。',
    why: '鸟氨酸被再生后可以返回线粒体开始下一轮，尿素则携带两个氮离开循环。',
    hook: '最后一刀同时得到循环起点鸟氨酸和排氮产物尿素。'
  },
  'urea|精氨酸@cytosol>尿素@cytosol': {
    doing: '这条边突出精氨酸酶反应释放出的尿素。',
    why: '它与“精氨酸生成鸟氨酸”是同一个反应的第二种表示；尿素中的两个氮分别来自游离铵离子和天冬氨酸。',
    hook: '同一反应看排氮端：两个氮最终一起装进尿素。'
  },
  'urea|鸟氨酸@cytosol>鸟氨酸@mito-matrix': {
    doing: '鸟氨酸转运系统把胞质鸟氨酸送回线粒体基质。',
    why: '鸟氨酸必须回到基质，才能再次接收氨甲酰磷酸；这次跨膜运输让尿素循环真正闭合。',
    hook: '鸟氨酸回到线粒体，下一轮从这里重新开始。'
  },
  'aa_carbon|丙氨酸/半胱氨酸/甘氨酸/丝氨酸/苏氨酸/色氨酸@cytosol>丙酮酸@cytosol': {
    doing: '这一组氨基酸的碳骨架经各自的多步路径最终汇入丙酮酸。',
    why: '类别映射,不是单一反应:丙酮酸可走糖异生也可氧化供能;苏氨酸和色氨酸另有别的入口。',
    hook: '生糖一组:六种氨基酸的碳都汇到丙酮酸。'
  },
  'aa_carbon|异亮氨酸/亮氨酸/苏氨酸/色氨酸@mito-matrix>乙酰辅酶 A@mito-matrix': {
    doing: '这一组氨基酸的碳骨架以乙酰辅酶 A 进入中央代谢。',
    why: '生酮入口之一;异亮氨酸、苏氨酸和色氨酸同时还有生糖去路,不表示单一反应。',
    hook: '生酮一组:碳骨架从乙酰辅酶 A 进 TCA。'
  },
  'aa_carbon|亮氨酸/赖氨酸/苯丙氨酸/酪氨酸/色氨酸@mito-matrix>乙酰乙酰辅酶 A@mito-matrix': {
    doing: '这组氨基酸分解成乙酰乙酰辅酶 A,再切成两份乙酰辅酶 A。',
    why: '亮氨酸和赖氨酸是纯生酮氨基酸,只能走这条入口;其余几种兼具生糖去路。',
    hook: '纯生酮代表:亮氨酸、赖氨酸只进这张门。'
  },
  'aa_carbon|谷氨酸/谷氨酰胺/精氨酸/脯氨酸/组氨酸@mito-matrix>α-酮戊二酸@mito-matrix': {
    doing: '这组氨基酸先汇成谷氨酸,再脱氨生成 α-酮戊二酸。',
    why: 'α-KG 是 TCA 中间体,这组氨基酸因此是生糖的;转氨同时把多余的氮送进尿素循环。',
    hook: '五种氨基酸 → 谷氨酸 → α-KG,一条汇流河。'
  },
  'aa_carbon|缬氨酸/异亮氨酸/蛋氨酸/苏氨酸@mito-matrix>琥珀酰辅酶 A@mito-matrix': {
    doing: '这组氨基酸经丙酰-CoA、甲基丙二酰-CoA 的少见路径生成琥珀酰辅酶 A。',
    why: '这是氨基酸进入 TCA 唯一的琥珀酰-CoA 入口,需要生物素和维生素 B₁₂ 衍生辅酶;异亮氨酸和苏氨酸另有生酮去路。',
    hook: 'B₁₂ 担保的路径:丙酰-CoA → 琥珀酰-CoA。'
  },
  'aa_carbon|苯丙氨酸/酪氨酸@cytosol>延胡索酸@cytosol': {
    doing: '苯丙氨酸先羟化成酪氨酸,两者分解同时产出延胡索酸和乙酰乙酸。',
    why: '既是生糖又是生酮:一份碳进 TCA(延胡索酸),一份碳走酮体方向(乙酰乙酸)。',
    hook: '一脚两船:苯丙氨酸/酪氨酸同时产糖和酮。'
  },
  'aa_carbon|天冬氨酸/天冬酰胺@cytosol>草酰乙酸@cytosol': {
    doing: '天冬酰胺先水解成天冬氨酸,再经转氨生成草酰乙酸。',
    why: 'OAA 直接补进 TCA 与糖异生;天冬氨酸同时还为尿素循环供应第二个氮。',
    hook: '两步到家:天冬酰胺 → 天冬氨酸 → OAA。'
  },
  'purine|核糖-5-磷酸@cytosol>PRPP@cytosol': {
    doing: 'PRPP 合成酶用 ATP 给核糖-5-磷酸加上焦磷酸基，生成活化的 PRPP。',
    why: 'PRPP 把核糖骨架变成可接收含氮原子的活化平台，是嘌呤从头合成的入口。',
    hook: '先把核糖装上“活化把手”，后面才能逐步搭嘌呤环。'
  },
  'purine|PRPP@cytosol>5-磷酸核糖胺@cytosol': {
    doing: '谷氨酰胺-PRPP 酰胺转移酶用谷氨酰胺提供的氮替换 PRPP 的焦磷酸基，生成 5-磷酸核糖胺和谷氨酸。',
    why: '这是嘌呤从头合成的承诺步骤；一旦进入这里，核糖骨架通常就沿嘌呤合成路线继续。',
    hook: '谷氨酰胺交出第一个氮，嘌呤环开始真正搭建。'
  },
  'purine|5-磷酸核糖胺@cytosol>GAR@cytosol': {
    doing: 'GAR 合成酶把甘氨酸接到 5-磷酸核糖胺上，并消耗 ATP，生成 GAR。',
    why: '甘氨酸不是旁观者，它会贡献嘌呤环的碳和氮；这一小步把第一个完整片段装上核糖。',
    hook: '甘氨酸带着碳和氮加入，嘌呤环开始长出第一段。'
  },
  'purine|GAR@cytosol>AICAR@cytosol': {
    doing: '这条表示边把 GAR 到 AICAR 之间的多步反应合并展示，实际包含逐步加原子、甲酰化、环化和 ATP 消耗。',
    why: '它不是某一个酶的一步反应；合并后用于突出“开链前体逐渐闭合成嘌呤环”的教学主线。',
    hook: 'GAR 到 AICAR 是一段施工过程，不要把它误记成单步跳跃。'
  },
  'purine|AICAR@cytosol>IMP@cytosol': {
    doing: 'ATIC 的两个功能完成最后的甲酰化与环化：10-甲酰-四氢叶酸提供一碳单位，AICAR 最终变成 IMP。',
    why: 'IMP 是第一个完整的嘌呤核苷酸分叉点，之后分别走向 AMP 或 GMP。',
    hook: '最后补上一碳并闭合环，嘌呤共同中间体 IMP 出现。'
  },
  'purine|IMP@cytosol>AMP@cytosol': {
    doing: '腺苷酸琥珀酸合成/裂解系统先让 IMP 接受天冬氨酸和 GTP，再释放延胡索酸，形成 AMP。',
    why: '天冬氨酸提供 AMP 分支所需的氮；GTP 提供能量，使 IMP 朝腺嘌呤核苷酸方向分化。',
    hook: 'IMP 接上天冬氨酸，放出延胡索酸，走向 AMP 分支。'
  },
  'purine|IMP@cytosol>GMP@cytosol': {
    doing: 'IMP 先被氧化，再由 GMP 合成酶用谷氨酰胺提供氮并消耗 ATP，最终生成 GMP。',
    why: '谷氨酰胺是 GMP 分支的氮源；这条分支与 AMP 分支共享 IMP，但使用不同的能量和氮输入。',
    hook: '另一条出口：先氧化 IMP，再用谷氨酰胺补上 GMP 所需的氮。'
  },
  'purine|AMP@cytosol>ATP@cytosol': {
    doing: '这条边表示腺苷酸激酶维持腺嘌呤核苷酸池：实际净反应是 AMP + ATP ⇌ 2 ADP，随后由其他激酶继续调节 ATP。',
    why: '图上的 AMP→ATP 是核苷酸池方向的教学表示，不是 AMP 单独直接变成 ATP 的单步反应。',
    hook: '这是能量池平衡边：腺苷酸激酶在 AMP、ADP 和 ATP 之间重新分配磷酸。'
  },
  'purine|GMP@cytosol>GTP@cytosol': {
    doing: '鸟苷酸激酶和核苷二磷酸激酶接力，把 GMP 经 GDP 推到 GTP；数据边合并表示这两步磷酸转移。',
    why: 'GTP 是蛋白合成、信号和多种酶反应使用的高能鸟苷酸；这里强调的是核苷酸池的活化。',
    hook: 'GMP 先到 GDP，再到 GTP；图上是一条合并的补能边。'
  },
  'pyrimidine|谷氨酰胺@cytosol>氨甲酰磷酸@cytosol': {
    doing: '胞质型氨甲酰磷酸合成酶 II 用谷氨酰胺提供氮，消耗 CO₂ 和两个 ATP，生成氨甲酰磷酸。',
    why: '这是嘧啶从头合成的胞质入口；不要和在线粒体、服务于尿素循环的 CPS I 混淆。',
    hook: '嘧啶先在胞质用谷氨酰胺和两份 ATP 做出氨甲酰磷酸。'
  },
  'pyrimidine|氨甲酰磷酸@cytosol>氨甲酰天冬氨酸@cytosol': {
    doing: '天冬氨酸转氨甲酰酶把氨甲酰基转给天冬氨酸，形成氨甲酰天冬氨酸。',
    why: '天冬氨酸提供嘧啶环的一部分骨架；这一步把氨甲酰磷酸正式接到环前体上。',
    hook: '氨甲酰磷酸把氨甲酰基交给天冬氨酸，环前体开始成形。'
  },
  'pyrimidine|氨甲酰天冬氨酸@cytosol>二氢乳清酸@cytosol': {
    doing: '二氢乳清酸酶促使氨甲酰天冬氨酸发生环化并水解，生成二氢乳清酸。',
    why: '到这里嘧啶环的闭环骨架已经建立，后面只需氧化和接上核糖磷酸。',
    hook: '开链前体折回并闭环，得到二氢乳清酸。'
  },
  'pyrimidine|二氢乳清酸@cytosol>乳清酸@cytosol': {
    doing: 'DHODH 氧化二氢乳清酸生成乳清酸，并把电子交给辅酶 Q 形成泛醇。',
    why: '哺乳动物 DHODH 锚定在线粒体内膜附近，嘧啶合成因此与呼吸链醌池发生连接。',
    hook: '嘧啶环在这里完成氧化，也把电子交给线粒体醌池。'
  },
  'pyrimidine|乳清酸@cytosol>UMP@cytosol': {
    doing: '乳清酸磷酸核糖转移酶先接上 PRPP，随后乳清酸核苷酸脱羧酶去掉羧基，合并生成 UMP。',
    why: '这条边合并了两个连续步骤；UMP 是嘧啶核苷酸合成的共同起点。',
    hook: '先接活化核糖，再脱羧，乳清酸变成第一个嘧啶核苷酸 UMP。'
  },
  'pyrimidine|UMP@cytosol>UTP@cytosol': {
    doing: 'UMP 先后经核苷酸激酶与核苷二磷酸激酶两次磷酸化成为 UTP。',
    why: 'RNA 合成、CTP 生成和糖核苷酸代谢都要用二、三磷酸形式;表示边合并了连续两步。',
    hook: '两级充电:UMP → UDP → UTP。'
  },
  'pyrimidine|UTP@cytosol>CTP@cytosol': {
    doing: 'CTP 合成酶用谷氨酰胺提供氮，并消耗 ATP，把 UTP 的尿嘧啶碱基氨化为 CTP。',
    why: '这是嘧啶合成的胞嘧啶分支；氮源来自谷氨酰胺，谷氨酸是副产物。',
    hook: 'UTP 接受谷氨酰胺提供的氮，转成 CTP。'
  },
  'pyrimidine|UDP@cytosol>dUDP@cytosol': {
    doing: '核糖核苷酸还原酶把 UDP 的核糖 2′-羟基还原掉，生成脱氧形式 dUDP，并依赖还原型硫氧还蛋白供电子。',
    why: '这一步把 RNA 型核苷酸池接到 DNA 前体池；还原后的 dUDP 还要继续加工才能成为胸苷酸。',
    hook: '先去掉核糖的 2′-羟基，UDP 才能进入脱氧核苷酸路线。'
  },
  'pyrimidine|dUDP@cytosol>dUTP@cytosol': {
    doing: '核苷二磷酸激酶用 ATP 把 dUDP 磷酸化成 dUTP。',
    why: 'dUTP 是下一步 dUTPase 的底物,为 dTMP 合成铺路。',
    hook: '脱氧系列也要充到三磷酸。'
  },
  'pyrimidine|dUTP@cytosol>dUMP@cytosol': {
    doing: 'dUTPase 水解 dUTP 生成 dUMP 并放出焦磷酸。',
    why: '一举两得:既造出 dTMP 的直接前体,又把危险的 dUTP 清出 DNA 合成池,防止尿嘧啶错掺。',
    hook: '排雷兼供料:dUTP → dUMP。'
  },
  'pyrimidine|dUMP@cytosol>dTMP@cytosol': {
    doing: '胸苷酸合成酶把 dUMP 甲基化成 dTMP,一碳单位来自 5,10-亚甲基四氢叶酸。',
    why: '这是 DNA 特有胸腺嘧啶的唯一来源;抗癌药 5-氟尿嘧啶正卡在这一步。',
    hook: '装上甲基:dUMP → dTMP,叶酸扛一碳。'
  },
  'nucleotide_degradation|核苷酸@cytosol>核苷@cytosol': {
    doing: '核苷酸酶水解核苷酸的磷酸酯键，生成核苷和无机磷酸。',
    why: '去掉磷酸后，核苷才能被核苷磷酸化酶拆成碱基和核糖-1-磷酸。',
    hook: '先卸下磷酸标签，再拆核苷的糖和碱基。'
  },
  'nucleotide_degradation|核苷@cytosol>碱基@cytosol': {
    doing: '核苷磷酸化酶用无机磷酸进行磷解，把核苷拆成碱基和核糖-1-磷酸；该反应可逆。',
    why: '它把核苷的糖部分和含氮碱基分开，碱基随后进入嘌呤或嘧啶的具体去路。',
    hook: '不是加水硬切，而是用磷酸换出碱基和核糖-1-磷酸。'
  },
  'nucleotide_degradation|次黄嘌呤@cytosol>尿酸@cytosol': {
    doing: '黄嘌呤氧化酶连续两步把次黄嘌呤先氧化成黄嘌呤、再氧化成尿酸,每步都产生过氧化氢。',
    why: '人类缺乏尿酸酶,尿酸是嘌呤分解的最终排泄物;过量会增加痛风风险。',
    hook: '两连氧化:次黄嘌呤 → 黄嘌呤 → 尿酸。'
  },
  'nucleotide_degradation|鸟嘌呤@cytosol>尿酸@cytosol': {
    doing: '鸟嘌呤先经脱氨酶变成黄嘌呤,再由黄嘌呤氧化酶氧化成尿酸。',
    why: '与腺嘌呤分支在黄嘌呤汇合,殊途同归于尿酸;表示边合并了两步净反应。',
    hook: '鸟嘌呤脱个氨,也汇进黄嘌呤这条路。'
  },
  'nucleotide_degradation|尿嘧啶@cytosol>β-丙氨酸@cytosol': {
    doing: '这条边合并了尿嘧啶还原、环水解和氨基甲酰基裂解三步，净结果是生成 β-丙氨酸、二氧化碳和氨。',
    why: 'NADPH 提供还原力；β-丙氨酸可继续进入含氮和有机酸代谢。',
    hook: '尿嘧啶不是一步变成 β-丙氨酸，而是经过三步净降解。'
  },
  'nucleotide_degradation|胸腺嘧啶@cytosol>β-氨基异丁酸@cytosol': {
    doing: '这条边合并了胸腺嘧啶还原、环水解和裂解三步，净生成 β-氨基异丁酸、二氧化碳和氨。',
    why: '它与尿嘧啶降解共享同类酶系，但甲基使末端产物变成 β-氨基异丁酸。',
    hook: '胸腺嘧啶的甲基被保留到 β-氨基异丁酸中。'
  }
};
