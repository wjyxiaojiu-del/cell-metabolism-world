window.METABOLIC_ATLAS_DATA = (() => {
  const reviewed = 'PDF 主干已人工核对';
  const pending = 'PDF 主干已录入 · 逐反应待二次审校';
  const pathways = {
    glycolysis: { name: '糖酵解', english: 'Glycolysis', scene: 'cytosol', compartment: '细胞质', group: '糖代谢', review: reviewed, source: 'PDF 左上糖代谢区', summary: '葡萄糖经十步反应生成丙酮酸，并形成三磷酸腺苷（ATP）与还原型烟酰胺腺嘌呤二核苷酸（NADH）。', steps: ['葡萄糖', '葡萄糖-6-磷酸', '果糖-6-磷酸', '果糖-1,6-二磷酸', '甘油醛-3-磷酸', '1,3-二磷酸甘油酸', '3-磷酸甘油酸', '2-磷酸甘油酸', '磷酸烯醇式丙酮酸', '丙酮酸'] },
    gluconeogenesis: { name: '糖异生', english: 'Gluconeogenesis', scene: 'cytosol', compartment: '线粒体基质 / 细胞质 / 内质网', group: '糖代谢', review: pending, source: 'PDF 左中糖异生区', summary: '由乳酸、甘油和生糖氨基酸重新生成葡萄糖；三个关键绕行步分别跨越线粒体、细胞质和内质网。', steps: ['丙酮酸', '线粒体基质草酰乙酸', '线粒体基质苹果酸', '细胞质苹果酸', '细胞质草酰乙酸', '磷酸烯醇式丙酮酸', '2-磷酸甘油酸', '3-磷酸甘油酸', '1,3-二磷酸甘油酸', '甘油醛-3-磷酸', '果糖-1,6-二磷酸', '果糖-6-磷酸', '葡萄糖-6-磷酸', '葡萄糖'] },
    glycogenesis: { name: '糖原合成', english: 'Glycogenesis', scene: 'cytosol', compartment: '细胞质', group: '糖储存', review: pending, source: 'PDF 左上糖原区与 Reactome 交叉核对', summary: '葡萄糖先被活化，再由糖原素建立引物、糖原合酶延长主链、分支酶建立分支。', steps: ['葡萄糖', '葡萄糖-6-磷酸', '葡萄糖-1-磷酸', 'UDP-葡萄糖', '糖原素引物', '线性糖原', '糖原'] },
    glycogenolysis: { name: '糖原分解', english: 'Glycogenolysis', scene: 'cytosol', compartment: '细胞质', group: '糖储存', review: pending, source: 'PDF 左上糖原区', summary: '糖原磷酸化酶拆直链，遇到分支点后由去分支酶接手，再继续产生葡萄糖-1-磷酸。', steps: ['糖原', '极限糊精', '去分支糖原', '葡萄糖-1-磷酸', '葡萄糖-6-磷酸', '葡萄糖'] },
    starch: { name: '淀粉合成与降解', english: 'Starch metabolism', scene: 'plant-extension', compartment: '植物细胞质体', group: '植物扩展', review: pending, source: 'PDF 左上淀粉区', summary: '植物以 ADP-葡萄糖合成淀粉，并经水解或磷酸解动员。', steps: ['G1P', 'ADP-葡萄糖', '直链淀粉 / 支链淀粉', '麦芽糖 / G1P'] },
    ppp: { name: '磷酸戊糖途径', english: 'Pentose phosphate pathway', scene: 'cytosol', compartment: '细胞质', group: '糖代谢', review: pending, source: 'PDF 左中磷酸戊糖区', summary: '产生还原型烟酰胺腺嘌呤二核苷酸磷酸（NADPH）与核糖-5-磷酸，并与糖酵解中间体互通。', steps: ['葡萄糖-6-磷酸', '6-磷酸葡萄糖酸内酯', '6-磷酸葡萄糖酸', '核酮糖-5-磷酸', '核糖-5-磷酸 / 木酮糖-5-磷酸', '景天庚酮糖-7-磷酸', '赤藓糖-4-磷酸', '果糖-6-磷酸 / 甘油醛-3-磷酸'] },
    fructose: { name: '果糖代谢', english: 'Fructose metabolism', scene: 'cytosol', compartment: '细胞质', group: '糖代谢', review: pending, source: 'PDF 左上单糖区', summary: '果糖在肝脏主要经 F1P 进入 DHAP 与甘油醛，也可经 F6P 并入糖酵解。', steps: ['果糖', 'F1P / F6P', 'DHAP', 'G3P'] },
    galactose: { name: '半乳糖代谢', english: 'Galactose metabolism', scene: 'cytosol', compartment: '细胞质', group: '糖代谢', review: pending, source: 'PDF 左上单糖区', summary: 'Leloir 通路将半乳糖转入 UDP-糖与 G1P 池。', steps: ['半乳糖', 'Gal-1-P', 'UDP-Gal', 'UDP-Glc', 'G1P'] },
    uronic: { name: '糖醛酸途径', english: 'Uronic acid pathway', scene: 'cytosol', compartment: '细胞质 / 内质网', group: '糖代谢', review: pending, source: 'PDF 左中糖醛酸区', summary: '由 UDP-葡萄糖形成葡萄糖醛酸，用于结合解毒和糖胺聚糖前体。', steps: ['UDP-葡萄糖', 'UDP-葡萄糖醛酸', '结合反应 / 戊糖'] },
    polyol: { name: '多元醇途径', english: 'Polyol pathway', scene: 'cytosol', compartment: '细胞质', group: '糖代谢', review: pending, source: 'PDF 糖代谢分支', summary: '葡萄糖经山梨醇转为果糖，改变 NADPH 与 NADH 状态。', steps: ['葡萄糖', '山梨醇', '果糖'] },
    pyruvate_fates: { name: '丙酮酸去路', english: 'Pyruvate fates', scene: 'cytosol', compartment: '细胞质 / 线粒体', group: '中央代谢', review: reviewed, source: 'PDF 糖酵解出口区', summary: '丙酮酸可进入乳酸、丙氨酸、乙酰-CoA 或糖异生方向。', steps: ['丙酮酸', '乳酸', '丙氨酸', '乙酰-CoA', 'OAA'] },
    pdh: { name: '丙酮酸脱氢酶复合体', english: 'Pyruvate dehydrogenase', scene: 'mitochondria-matrix', compartment: '线粒体基质', group: '中央代谢', review: reviewed, source: 'PDF PDH 区与用户补充', summary: '丙酮酸通过电压依赖性阴离子通道（VDAC）和线粒体丙酮酸载体（MPC）进入基质，再被丙酮酸脱氢酶复合体转成乙酰辅酶 A。', steps: ['细胞质丙酮酸', '电压依赖性阴离子通道（VDAC）', '线粒体丙酮酸载体（MPC）', '线粒体基质丙酮酸', '乙酰辅酶 A'] },
    tca: { name: '三羧酸循环', english: 'TCA cycle', scene: 'mitochondria-matrix', compartment: '线粒体基质', group: '中央代谢', review: reviewed, source: 'PDF 中部 TCA 区', summary: '乙酰辅酶 A 的二碳乙酰基被逐步氧化，能量装入还原型烟酰胺腺嘌呤二核苷酸（NADH）和还原型黄素腺嘌呤二核苷酸（FADH₂）。', steps: ['乙酰辅酶 A', '柠檬酸', '异柠檬酸', 'α-酮戊二酸', '琥珀酰辅酶 A', '琥珀酸', '延胡索酸', '苹果酸', '草酰乙酸'] },
    glyoxylate: { name: '乙醛酸循环', english: 'Glyoxylate cycle', scene: 'plant-extension', compartment: '植物乙醛酸体 / 过氧化物酶体', group: '植物扩展', review: pending, source: 'PDF 中央乙醛酸循环区', summary: '绕过 TCA 两次脱羧，使乙酰-CoA 的碳可净转为四碳化合物。', steps: ['异柠檬酸', '乙醛酸 + 琥珀酸', '苹果酸', 'OAA'] },
    malate_aspartate: { name: '苹果酸–天冬氨酸穿梭', english: 'Malate–aspartate shuttle', scene: 'mitochondria-inner-membrane', compartment: '细胞质 ↔ 线粒体基质', group: '跨膜穿梭', review: reviewed, source: 'PDF 电子传递区与 Reactome 交叉核对', summary: '苹果酸脱氢酶、天冬氨酸氨基转移酶与两类内膜载体协作，把细胞质还原当量送入线粒体基质。', steps: ['细胞质草酰乙酸', '细胞质苹果酸', '线粒体基质苹果酸', '线粒体基质草酰乙酸', '线粒体基质天冬氨酸', '细胞质天冬氨酸', '细胞质草酰乙酸'] },
    glycerol_phosphate: { name: '甘油-3-磷酸穿梭', english: 'Glycerol-3-phosphate shuttle', scene: 'mitochondria-inner-membrane', compartment: '细胞质 ↔ 线粒体内膜', group: '跨膜穿梭', review: reviewed, source: 'PDF 电子传递区与用户补充', summary: '细胞质甘油-3-磷酸脱氢酶和线粒体甘油-3-磷酸脱氢酶接力，将细胞质还原当量送入辅酶 Q 池。', steps: ['细胞质还原型烟酰胺腺嘌呤二核苷酸（NADH）', '磷酸二羟丙酮', '甘油-3-磷酸', '酶结合的还原型黄素腺嘌呤二核苷酸（FADH₂）', '还原型辅酶 Q（泛醇）'] },
    etc: { name: '呼吸电子传递链', english: 'Electron transport chain', scene: 'mitochondria-inner-membrane', compartment: '线粒体内膜', group: '能量代谢', review: reviewed, source: 'PDF 电子传递区与用户补充', summary: '电子从还原型烟酰胺腺嘌呤二核苷酸（NADH）或琥珀酸出发，经辅酶 Q、复合体 III 和细胞色素 c，最后交给氧。', steps: ['还原型烟酰胺腺嘌呤二核苷酸（NADH）将电子交给复合体 I', '琥珀酸将电子交给复合体 II', '辅酶 Q', '呼吸链复合体 III', '细胞色素 c', '呼吸链复合体 IV', '氧还原为水'] },
    oxphos: { name: '氧化磷酸化', english: 'Oxidative phosphorylation', scene: 'mitochondria-inner-membrane', compartment: '线粒体内膜', group: '能量代谢', review: reviewed, source: 'PDF 氧化磷酸化区', summary: '质子动力势驱动三磷酸腺苷合酶（ATP 合酶），腺嘌呤核苷酸转位酶（ANT）再交换基质与细胞质中的 ATP/ADP。', steps: ['质子动力势驱动三磷酸腺苷合酶（ATP 合酶）', '质子通过三磷酸腺苷合酶（ATP 合酶）回流', '基质中的二磷酸腺苷与无机磷酸合成三磷酸腺苷', '腺嘌呤核苷酸转位酶（ANT）'] },
    atp_transport: { name: 'ATP/ADP 与磷酸转运', english: 'Adenine nucleotide and phosphate transport', scene: 'mitochondria-inner-membrane', compartment: '线粒体内膜', group: '跨膜转运', review: reviewed, source: 'PDF 氧化磷酸化区与用户补充', summary: 'ANT 交换 ATP/ADP，磷酸载体协同 H⁺输入 Pi。', steps: ['ADP胞质', 'ANT', 'ADP基质', 'ATP基质', 'ATP胞质', 'Pi/H⁺同向转运'] },
    transport: { name: '跨膜穿梭与核苷酸转运', english: 'Shuttles and nucleotide transport', scene: 'mitochondria-inner-membrane', compartment: '细胞质 ↔ 线粒体膜间隙 ↔ 线粒体基质', group: '跨膜转运', review: reviewed, source: 'PDF 电子传递区与用户补充', summary: '汇总丙酮酸转运、还原当量穿梭以及 ATP、ADP 和无机磷酸跨线粒体膜交换。', steps: ['胞质底物', '外膜通道', '内膜载体', '线粒体基质', '核苷酸与磷酸交换'] },
    lipoprotein: { name: '脂蛋白代谢', english: 'Lipoprotein metabolism', scene: 'plasma-membrane', compartment: '血浆 / 细胞膜 / 内体', group: '脂质代谢', review: pending, source: 'PDF 上中脂蛋白区', summary: '乳糜微粒、VLDL、IDL、LDL 与 HDL 运输外源及内源脂质。', steps: ['乳糜微粒', '残粒', 'VLDL', 'IDL', 'LDL', 'HDL / 逆向胆固醇转运'] },
    fa_synthesis: { name: '脂肪酸合成', english: 'Fatty acid synthesis', scene: 'smooth-er-lipid', compartment: '细胞质 / 内质网', group: '脂质代谢', review: pending, source: 'PDF 中上脂肪酸合成区', summary: '柠檬酸输出后提供细胞质乙酰辅酶 A，乙酰辅酶 A 羧化酶（ACC）生成丙二酰辅酶 A，脂肪酸合酶（FAS）再逐轮延长碳链。', steps: ['细胞质柠檬酸', '乙酰辅酶 A', '丙二酰辅酶 A', '脂肪酸合酶（FAS）', '棕榈酸'] },
    fa_elongation: { name: '脂肪酸延长与去饱和', english: 'Fatty acid elongation and desaturation', scene: 'smooth-er-lipid', compartment: '平滑内质网', group: '脂质代谢', review: pending, source: 'PDF 脂肪酸代谢区', summary: '内质网延长碳链并由去饱和酶引入双键。', steps: ['棕榈酰-CoA', '延长酶', '硬脂酰-CoA', '去饱和酶', '不饱和脂肪酸'] },
    beta_oxidation: { name: '脂肪酸 β-氧化', english: 'Fatty acid beta-oxidation', scene: 'mitochondria-matrix', compartment: '线粒体基质', group: '脂质代谢', review: pending, source: 'PDF 下中脂肪酸降解区', summary: '脂酰-CoA 反复脱氢、水合、再脱氢与硫解，形成乙酰-CoA。', steps: ['脂酰-CoA', '烯酰-CoA', 'β-羟脂酰-CoA', 'β-酮脂酰-CoA', '乙酰-CoA'] },
    vlcfa: { name: '极长链脂肪酸氧化', english: 'Very-long-chain fatty acid oxidation', scene: 'peroxisome', compartment: '过氧化物酶体', group: '脂质代谢', review: pending, source: 'PDF 脂肪酸降解区与区室校对', summary: '过氧化物酶体优先缩短极长链和部分支链脂肪酸，并产生过氧化氢（H₂O₂）。', steps: ['极长链脂酰辅酶 A（VLCFA-CoA）', '酰基辅酶 A 氧化酶', '过氧化氢（H₂O₂）', '缩短脂酰辅酶 A', '线粒体继续氧化'] },
    carnitine: { name: '肉碱穿梭', english: 'Carnitine shuttle', scene: 'mitochondria-inner-membrane', compartment: '线粒体外膜 / 内膜', group: '跨膜转运', review: pending, source: 'PDF 脂肪酸转移系统区', summary: '肉碱棕榈酰转移酶 I（CPT-I）、肉碱-脂酰肉碱转位酶（CACT）和肉碱棕榈酰转移酶 II（CPT-II）接力，将长链脂酰基送入线粒体基质。', steps: ['细胞质长链脂酰辅酶 A', '肉碱棕榈酰转移酶 I（CPT-I）', '脂酰肉碱', '肉碱-脂酰肉碱转位酶（CACT）', '肉碱棕榈酰转移酶 II（CPT-II）', '线粒体基质脂酰辅酶 A'] },
    ketone: { name: '酮体生成与利用', english: 'Ketone body metabolism', scene: 'mitochondria-matrix', compartment: '肝线粒体基质 / 外周组织', group: '脂质代谢', review: pending, source: 'PDF 左下酮体区', summary: '肝线粒体由乙酰辅酶 A 生成乙酰乙酸与 β-羟丁酸；外周组织再将酮体转回乙酰辅酶 A，肝脏本身不利用它产生的酮体。', steps: ['肝线粒体乙酰辅酶 A', '乙酰乙酰辅酶 A', '3-羟基-3-甲基戊二酰辅酶 A（HMG-CoA）', '乙酰乙酸', 'β-羟丁酸', '外周组织乙酰辅酶 A'] },
    tag: { name: '甘油三酯合成与脂解', english: 'Triacylglycerol metabolism', scene: 'smooth-er-lipid', compartment: '细胞质 / 平滑内质网 / 脂滴', group: '脂质代谢', review: pending, source: 'PDF 脂质合成区', summary: '甘油-3-P 与脂酰-CoA 合成 TAG，脂解时释放脂肪酸与甘油。', steps: ['甘油-3-P', '溶血磷脂酸', '磷脂酸', 'DAG', 'TAG', '脂肪酸 + 甘油'] },
    phospholipid: { name: '甘油磷脂代谢', english: 'Glycerophospholipid metabolism', scene: 'smooth-er-lipid', compartment: '内质网 / 高尔基体 / 细胞膜', group: '脂质代谢', review: pending, source: 'PDF 磷脂代谢区', summary: '由磷脂酸与 DAG 合成 PC、PE、PS、PI、心磷脂等膜脂。', steps: ['磷脂酸 / DAG', 'CDP-胆碱 / CDP-DAG', 'PC / PE / PS / PI', '心磷脂'] },
    sphingolipid: { name: '鞘脂代谢', english: 'Sphingolipid metabolism', scene: 'golgi', compartment: '内质网 / 高尔基体 / 溶酶体', group: '脂质代谢', review: pending, source: 'PDF 脂质代谢分支', summary: '神经酰胺在内质网形成，并在高尔基体转为鞘磷脂与糖鞘脂。', steps: ['丝氨酸 + 棕榈酰-CoA', '神经酰胺', '鞘磷脂 / 糖鞘脂', '溶酶体降解'] },
    cholesterol: { name: '胆固醇合成与转运', english: 'Cholesterol metabolism', scene: 'smooth-er-lipid', compartment: '细胞质 / 平滑内质网 / 细胞膜', group: '脂质代谢', review: pending, source: 'PDF 上中胆固醇区', summary: '乙酰-CoA 经 HMG-CoA 还原酶形成甲羟戊酸并最终生成胆固醇。', steps: ['乙酰-CoA', 'HMG-CoA', '甲羟戊酸', '异戊二烯单位', '鲨烯', '胆固醇'] },
    steroid_bile: { name: '类固醇与胆汁酸合成', english: 'Steroid and bile acid synthesis', scene: 'smooth-er-lipid', compartment: '线粒体 / 平滑内质网', group: '脂质代谢', review: pending, source: 'PDF 胆固醇去路', summary: '胆固醇作为类固醇激素、胆汁酸和维生素 D 的前体。', steps: ['胆固醇', '孕烯醇酮', '类固醇激素', '胆汁酸 / 维生素D'] },
    transamination: { name: '转氨与氧化脱氨', english: 'Transamination and oxidative deamination', scene: 'cytosol', compartment: '细胞质 / 线粒体基质', group: '氨基酸代谢', review: pending, source: 'PDF 右上 AA 降解区', summary: '大多数氨基酸先把氨基转给 α-酮戊二酸形成谷氨酸，谷氨酸再通过氧化脱氨释放铵离子。', steps: ['氨基酸', '对应的 α-酮酸 / 谷氨酸', '谷氨酸（线粒体基质）', '铵离子（NH₄⁺）', '尿素循环'] },
    glutamate_glutamine: { name: '谷氨酸–谷氨酰胺枢纽', english: 'Glutamate–glutamine hub', scene: 'cytosol', compartment: '细胞质 / 线粒体', group: '氮代谢', review: pending, source: 'PDF AA 合成与降解连接区', summary: '谷氨酸和谷氨酰胺承担氨基收集、运输与生物合成供氮。', steps: ['α-KG', '谷氨酸', '谷氨酰胺', '酰胺氮供体 / NH₄⁺'] },
    urea: { name: '尿素循环', english: 'Urea cycle', scene: 'mitochondria-matrix', compartment: '线粒体基质 / 细胞质', group: '氮代谢', review: pending, source: 'PDF 中右尿素循环区', summary: '将铵离子和天冬氨酸提供的两个氮转为尿素，反应跨越线粒体基质和细胞质。', steps: ['铵离子（NH₄⁺）+ 二氧化碳', '氨甲酰磷酸', '瓜氨酸', '天冬氨酸', '精氨酸代琥珀酸', '精氨酸', '尿素 + 鸟氨酸'] },
    bcaa: { name: '支链氨基酸降解', english: 'Branched-chain amino acid degradation', scene: 'mitochondria-matrix', compartment: '线粒体基质', group: '氨基酸代谢', review: pending, source: 'PDF 下中 BCAA 区', summary: '亮氨酸、异亮氨酸和缬氨酸经转氨与 BCKDH 后进入不同碳骨架。', steps: ['BCAA', '支链α-酮酸', 'BCKDH', '乙酰-CoA / 琥珀酰-CoA'] },
    aromatic_aa: { name: '芳香族氨基酸代谢', english: 'Aromatic amino acid metabolism', scene: 'mitochondria-matrix', compartment: '细胞质 / 线粒体', group: '氨基酸代谢', review: pending, source: 'PDF AA 降解区', summary: '苯丙氨酸与酪氨酸形成延胡索酸、乙酰乙酸及多种信号分子。', steps: ['苯丙氨酸', '酪氨酸', '多巴 / 儿茶酚胺', '延胡索酸 + 乙酰乙酸'] },
    serine_glycine: { name: '丝氨酸–甘氨酸与一碳代谢', english: 'Serine–glycine one-carbon metabolism', scene: 'nucleus-er', compartment: '细胞质 / 线粒体 / 细胞核', group: '一碳代谢', review: pending, source: 'PDF 右中一碳单位区', summary: '丝氨酸与甘氨酸向叶酸循环提供一碳单位，支持核苷酸和甲基化反应。', steps: ['3-PG', '丝氨酸', '甘氨酸', '5,10-亚甲基-THF', '嘌呤 / dTMP / SAM'] },
    methionine_cysteine: { name: '蛋氨酸循环与转硫途径', english: 'Methionine cycle and transsulfuration', scene: 'cytosol', compartment: '细胞质', group: '含硫氨基酸', review: pending, source: 'PDF AA 合成区', summary: '蛋氨酸形成 SAM 供甲基，并经同型半胱氨酸进入再甲基化或半胱氨酸合成。', steps: ['蛋氨酸', 'SAM', 'SAH', '同型半胱氨酸', '蛋氨酸 / 半胱氨酸'] },
    aa_carbon: { name: '氨基酸碳骨架归宿', english: 'Amino acid carbon skeletons', scene: 'mitochondria-matrix', compartment: '细胞质 / 线粒体', group: '氨基酸代谢', review: pending, source: 'PDF 右上 AA 降解总览', summary: '氨基酸去掉氨基后，碳骨架可汇入丙酮酸、乙酰辅酶 A、乙酰乙酰辅酶 A、α-酮戊二酸、琥珀酰辅酶 A、延胡索酸或草酰乙酸。', steps: ['氨基酸碳骨架', '七类中央代谢入口', '生糖氨基酸 / 生酮氨基酸'] },
    aa_biosynthesis: { name: '非必需氨基酸合成', english: 'Nonessential amino acid biosynthesis', scene: 'cytosol', compartment: '细胞质 / 线粒体', group: '氨基酸代谢', review: pending, source: 'PDF 右中 AA 合成区', summary: '由糖酵解与 TCA 中间体经转氨、酰胺化等反应生成非必需氨基酸。', steps: ['3-PG / 丙酮酸 / OAA / α-KG', '氨基受体', '非必需氨基酸'] },
    nitrogen: { name: '氮同化', english: 'Nitrogen assimilation', scene: 'plant-extension', compartment: '植物细胞质 / 质体', group: '植物扩展', review: pending, source: 'PDF 右中 AA 合成区', summary: '硝酸盐还原为铵，再经 GS/GOGAT 纳入谷氨酰胺与谷氨酸。', steps: ['NO₃⁻', 'NO₂⁻', 'NH₄⁺', '谷氨酰胺', '谷氨酸'] },
    sulfur: { name: '硫同化', english: 'Sulfur assimilation', scene: 'plant-extension', compartment: '植物质体 / 细胞质', group: '植物扩展', review: pending, source: 'PDF 右中 AA 合成区', summary: '硫酸盐经活化与还原形成硫化物，最终进入半胱氨酸。', steps: ['SO₄²⁻', 'APS / PAPS', 'SO₃²⁻', 'S²⁻', '半胱氨酸'] },
    purine: { name: '嘌呤核苷酸从头合成', english: 'De novo purine synthesis', scene: 'nucleus-er', compartment: '细胞质 / 细胞核', group: '核苷酸代谢', review: pending, source: 'PDF 右下嘌呤区', summary: '在5-磷酸核糖-1-焦磷酸（PRPP）上逐步构建嘌呤环，先生成次黄苷一磷酸（IMP），再分支生成腺苷一磷酸和鸟苷一磷酸。', steps: ['核糖-5-磷酸', '5-磷酸核糖-1-焦磷酸（PRPP）', '5-磷酸核糖胺', 'GAR', 'AICAR', '次黄苷一磷酸（IMP）', '腺苷一磷酸（AMP）/ 鸟苷一磷酸（GMP）', '三磷酸腺苷（ATP）/ 三磷酸鸟苷（GTP）'] },
    pyrimidine: { name: '嘧啶核苷酸从头合成', english: 'De novo pyrimidine synthesis', scene: 'nucleus-er', compartment: '细胞质 / 线粒体内膜 / 细胞核', group: '核苷酸代谢', review: pending, source: 'PDF 右下嘧啶区', summary: '先形成嘧啶环，再与5-磷酸核糖-1-焦磷酸（PRPP）结合生成尿苷一磷酸（UMP），然后扩展为胞苷和胸苷核苷酸。', steps: ['氨甲酰磷酸', '氨甲酰天冬氨酸', '二氢乳清酸', '乳清酸', '尿苷一磷酸（UMP）', '尿苷三磷酸（UTP）/ 胞苷三磷酸（CTP）', 'dUDP', '脱氧胸苷一磷酸（dTMP）'] },
    salvage: { name: '核苷酸补救合成', english: 'Nucleotide salvage', scene: 'nucleus-er', compartment: '细胞质 / 细胞核', group: '核苷酸代谢', review: pending, source: 'PDF 核苷酸代谢区', summary: '回收游离碱基与核苷，减少从头合成的能量成本。', steps: ['碱基 / 核苷', 'PRPP / 激酶', 'NMP', 'NDP / NTP'] },
    nucleotide_degradation: { name: '核苷酸降解', english: 'Nucleotide degradation', scene: 'endosome-lysosome', compartment: '细胞质 / 溶酶体', group: '核苷酸代谢', review: pending, source: 'PDF 右下核苷酸降解区', summary: '嘌呤降解至尿酸，嘧啶降解为可进入中央代谢的小分子。', steps: ['核酸 / 核苷酸', '核苷 / 碱基', '尿酸 / β-丙氨酸 / β-氨基异丁酸'] },
    folate: { name: '叶酸一碳库', english: 'Folate one-carbon pool', scene: 'nucleus-er', compartment: '细胞质 / 线粒体 / 细胞核', group: '一碳代谢', review: pending, source: 'PDF 一碳单位区', summary: 'THF 不同氧化态携带一碳单位，连接嘌呤、胸苷酸和蛋氨酸代谢。', steps: ['THF', '5,10-亚甲基-THF', '10-甲酰-THF', '5-甲基-THF'] },
    heme: { name: '血红素合成与胆色素代谢', english: 'Heme synthesis and degradation', scene: 'mitochondria-matrix', compartment: '线粒体 / 细胞质 / 内质网', group: '辅基代谢', review: pending, source: 'PDF 中右卟啉区', summary: '血红素合成在线粒体和细胞质间往返，降解后形成胆绿素、胆红素及结合产物。', steps: ['甘氨酸 + 琥珀酰-CoA', 'ALA', '卟啉原', '血红素', '胆红素', '结合胆红素'] },
    glutathione: { name: '谷胱甘肽与活性氧代谢', english: 'Glutathione and ROS metabolism', scene: 'peroxisome', compartment: '细胞质 / 线粒体 / 过氧化物酶体', group: '氧化还原', review: pending, source: 'PDF 辅因子与抗氧化连接', summary: 'GSH、NADPH、过氧化氢酶和谷胱甘肽过氧化物酶共同维持氧化还原稳态。', steps: ['NADPH', 'GSSG → GSH', 'H₂O₂ / 脂质过氧化物', 'H₂O'] },
    glycosylation: { name: 'UDP-糖与糖基化', english: 'UDP-sugars and glycosylation', scene: 'golgi', compartment: '细胞质 / 内质网 / 高尔基体', group: '糖复合物', review: pending, source: 'PDF UDP-糖连接与区室校对', summary: '核苷酸糖作为供体参与蛋白、脂质和细胞外基质糖基化。', steps: ['G1P / 糖单磷酸', 'UDP-糖', '内质网初始糖基化', '高尔基体修饰'] },
    lysosomal: { name: '溶酶体大分子降解', english: 'Lysosomal degradation', scene: 'endosome-lysosome', compartment: '内体 / 溶酶体', group: '降解系统', review: pending, source: 'PDF 代谢连接与细胞器区室补充', summary: '酸性水解酶分解蛋白、脂质、多糖与核酸，并把单体送回代谢池。', steps: ['内吞 / 自噬货物', '酸化内体', '溶酶体水解', '氨基酸 / 糖 / 脂肪酸 / 核苷'] },
    autophagy: { name: '自噬与物质回收', english: 'Autophagy and recycling', scene: 'endosome-lysosome', compartment: '细胞质 / 溶酶体', group: '降解系统', review: pending, source: '细胞器区室扩展', summary: '自噬体包裹细胞质成分并与溶酶体融合，为饥饿和更新提供底物。', steps: ['隔离膜', '自噬体', '自噬溶酶体', '代谢底物回收'] },
    membrane_transport: { name: '质膜营养物转运', english: 'Plasma membrane nutrient transport', scene: 'plasma-membrane', compartment: '细胞膜', group: '跨膜转运', review: pending, source: 'PDF 跨区室连接与细胞膜场景', summary: '葡萄糖、氨基酸、脂肪酸、乳酸、磷酸和离子经特异载体进入或离开细胞。', steps: ['胞外底物', '转运体 / 通道', '胞质代谢池'] },
    plasmalogen: { name: '醚磷脂与质醚磷脂合成', english: 'Ether phospholipid synthesis', scene: 'peroxisome', compartment: '过氧化物酶体 / 内质网', group: '脂质代谢', review: pending, source: '过氧化物酶体区室补充', summary: '早期醚键形成发生于过氧化物酶体，后续在内质网完成质醚磷脂合成。', steps: ['DHAP', '脂酰-DHAP', '烷基-DHAP', '内质网延伸', '质醚磷脂'] }
  };

  const scenes = {
    'cell-atlas': {
      title: '细胞结构与代谢入口', subtitle: '第 1 层 · 完整细胞', description: '从完整细胞进入各细胞器。这里只保留无内嵌代谢路线的结构底图，所有可解释的关系均由网页交互层生成。', tone: '#2f94aa', parent: null,
      views: [
        ['结构全景', 'cell-metabolism-assets/optimized/28-cell-overview-rev2.webp'],
        ['细胞器近景', 'cell-metabolism-assets/optimized/01-home-cell.webp'],
        ['横向剖面', 'cell-metabolism-assets/optimized/15-cell-overview-clean-wide.webp'],
        ['极简结构', 'cell-metabolism-assets/optimized/22-cell-overview-minimal.webp']
      ],
      hotspots: [
        { label: '细胞质代谢', x: 29, y: 36, target: 'cytosol', tone: '#e5a33b' }, { label: '线粒体', x: 31, y: 70, target: 'mitochondria', tone: '#df7d4e' },
        { label: '细胞核与内质网', x: 66, y: 29, target: 'nucleus-er', tone: '#7560af' }, { label: '高尔基体', x: 73, y: 66, target: 'golgi', tone: '#d46f71' },
        { label: '内体与溶酶体', x: 83, y: 52, target: 'endosome-lysosome', tone: '#8b6bb1' }, { label: '平滑内质网与脂滴', x: 83, y: 35, target: 'smooth-er-lipid', tone: '#6fa6c2' },
        { label: '过氧化物酶体', x: 88, y: 64, target: 'peroxisome', tone: '#79a95f' }, { label: '质膜运输', x: 52, y: 88, target: 'plasma-membrane', tone: '#438eac' },
        { label: '植物特异扩展', x: 12, y: 18, target: 'plant-extension', tone: '#6e9f55' }
      ]
    },
    cytosol: {
      title: '细胞质代谢网络', subtitle: '第 2 层 · Cytosol', description: '糖代谢、氨基酸枢纽与核苷酸前体在细胞质中交汇，并通过门户连接线粒体、内质网和细胞核。', tone: '#d99a34', parent: 'cell-atlas',
      views: [['细胞质', 'cell-metabolism-assets/optimized/02-cytoplasm-overview.webp'], ['线粒体接口', 'cell-metabolism-assets/optimized/04-cytoplasm-mito-interface.webp']],
      hotspots: [
        { pathway: 'glycolysis', x: 25, y: 38 }, { pathway: 'gluconeogenesis', x: 39, y: 48 }, { pathway: 'glycogenesis', x: 17, y: 27 }, { pathway: 'glycogenolysis', x: 17, y: 42 },
        { pathway: 'ppp', x: 33, y: 24 }, { pathway: 'fructose', x: 48, y: 28 }, { pathway: 'galactose', x: 58, y: 31 }, { pathway: 'uronic', x: 67, y: 39 },
        { pathway: 'polyol', x: 75, y: 28 }, { pathway: 'pyruvate_fates', x: 48, y: 62 }, { pathway: 'transamination', x: 62, y: 64 }, { pathway: 'glutamate_glutamine', x: 75, y: 57 },
        { pathway: 'aa_biosynthesis', x: 81, y: 71 }, { pathway: 'methionine_cysteine', x: 67, y: 78 }, { label: '进入线粒体', x: 34, y: 76, target: 'mitochondria', tone: '#df7d4e' },
        { label: '核苷酸与一碳代谢', x: 85, y: 43, target: 'nucleus-er', tone: '#7560af' }
      ]
    },
    mitochondria: {
      title: '线粒体总览', subtitle: '第 2 层 · Mitochondrion', description: '继续进入基质或内膜。切换视角可查看橙色教材图、独立线粒体以及两种半透明结构图。', tone: '#db7448', parent: 'cell-atlas',
      views: [['独立结构', 'cell-metabolism-assets/optimized/18-mitochondrion-isolated.webp'], ['橙色总览', 'cell-metabolism-assets/optimized/03-mitochondrion-overview-orange.webp'], ['蓝色结构', 'cell-metabolism-assets/optimized/23-mitochondrion-blueprint.webp'], ['白色结构', 'cell-metabolism-assets/optimized/24-mitochondrion-blueprint-white.webp']],
      hotspots: [
        { label: '线粒体基质', x: 48, y: 55, target: 'mitochondria-matrix', tone: '#d67c47' }, { label: '线粒体内膜', x: 52, y: 26, target: 'mitochondria-inner-membrane', tone: '#309cb3' },
        { pathway: 'pdh', x: 24, y: 46 }, { pathway: 'carnitine', x: 24, y: 72 }, { pathway: 'malate_aspartate', x: 72, y: 68 }, { pathway: 'glycerol_phosphate', x: 80, y: 42 },
        { label: '返回细胞质接口', x: 13, y: 27, target: 'cytosol', tone: '#d99a34' }
      ]
    },
    'mitochondria-matrix': {
      title: '线粒体基质代谢', subtitle: '第 3 层 · Matrix', description: '基质承担丙酮酸氧化、TCA、脂肪酸氧化、酮体和多类氨基酸分解；图中节点按 PDF 主干重新组织。', tone: '#d36f43', parent: 'mitochondria',
      views: [['详细基质', 'cell-metabolism-assets/optimized/25-mitochondrial-matrix-detailed.webp'], ['空白基质', 'cell-metabolism-assets/optimized/05-mitochondrial-matrix-clean.webp']],
      hotspots: [
        { pathway: 'pdh', x: 21, y: 36 }, { pathway: 'tca', x: 46, y: 55 }, { pathway: 'beta_oxidation', x: 72, y: 29 }, { pathway: 'ketone', x: 83, y: 47 },
        { pathway: 'bcaa', x: 62, y: 73 }, { pathway: 'aa_carbon', x: 79, y: 73 }, { pathway: 'urea', x: 86, y: 61 }, { pathway: 'heme', x: 17, y: 72 },
        { pathway: 'aromatic_aa', x: 45, y: 79 }, { label: '进入内膜', x: 53, y: 21, target: 'mitochondria-inner-membrane', tone: '#309cb3' }
      ]
    },
    'mitochondria-inner-membrane': {
      title: '线粒体内膜与能量转换', subtitle: '第 3 层 · Inner membrane', description: '电子传递、质子泵、ATP 合成、核苷酸交换和还原当量穿梭在此汇合。', tone: '#2e97ad', parent: 'mitochondria',
      views: [['复合体细节', 'cell-metabolism-assets/optimized/26-etc-complexes-detailed.webp'], ['膜蛋白', 'cell-metabolism-assets/optimized/19-inner-membrane-proteins.webp'], ['空白内膜', 'cell-metabolism-assets/optimized/06-mitochondrial-inner-membrane-empty.webp']],
      hotspots: [
        { pathway: 'etc', x: 38, y: 43 }, { pathway: 'oxphos', x: 73, y: 45 }, { pathway: 'malate_aspartate', x: 22, y: 70 }, { pathway: 'glycerol_phosphate', x: 38, y: 74 },
        { pathway: 'atp_transport', x: 77, y: 72 }, { pathway: 'carnitine', x: 56, y: 77 }, { pathway: 'pyrimidine', x: 89, y: 27 }, { label: '返回基质', x: 50, y: 22, target: 'mitochondria-matrix', tone: '#d36f43' }
      ]
    },
    'nucleus-er': {
      title: '细胞核与内质网', subtitle: '第 2 层 · Nucleus / ER', description: '核苷酸、一碳单位、DNA/RNA 前体与内质网脂质合成、糖基化在此形成跨区室网络。', tone: '#7764ae', parent: 'cell-atlas',
      views: [
        {
          label: '整体关系', src: 'cell-metabolism-assets/optimized/07-nucleus-er.webp', hotspots: [
            { label: '核内剖面', x: 36, y: 39, target: 'nucleus-interior', tone: '#7560af' },
            { label: '核膜—粗面内质网', x: 43, y: 72, target: 'nuclear-envelope-rough-er', tone: '#7560af' },
            { label: '粗面—平滑内质网', x: 76, y: 68, target: 'er-lumen-membrane', tone: '#629ab7' }
          ]
        },
        {
          label: '独立结构', src: 'cell-metabolism-assets/optimized/20-nucleus-er-isolated.webp', hotspots: [
            { label: '核内剖面', x: 39, y: 43, target: 'nucleus-interior', tone: '#7560af' },
            { label: '核膜—粗面内质网', x: 34, y: 72, target: 'nuclear-envelope-rough-er', tone: '#7560af' },
            { label: '粗面—平滑内质网', x: 73, y: 62, target: 'er-lumen-membrane', tone: '#629ab7' }
          ]
        },
        {
          label: '核内剖面', src: 'cell-metabolism-assets/optimized/29-nucleus-interior-clean.webp', hotspots: [
            { label: '进入核内场景', x: 40, y: 47, target: 'nucleus-interior', tone: '#7560af' }
          ]
        },
        {
          label: '核膜—粗面内质网', src: 'cell-metabolism-assets/optimized/30-nuclear-envelope-rough-er-interface.webp', hotspots: [
            { label: '进入核膜—粗面内质网场景', x: 58, y: 62, target: 'nuclear-envelope-rough-er', tone: '#7560af' }
          ]
        },
        {
          label: '粗面—平滑内质网', src: 'cell-metabolism-assets/optimized/31-er-lumen-and-membrane-clean.webp', hotspots: [
            { label: '进入内质网腔场景', x: 71, y: 54, target: 'er-lumen-membrane', tone: '#629ab7' },
            { label: '核膜接口', x: 17, y: 43, target: 'nuclear-envelope-rough-er', tone: '#7560af' }
          ]
        }
      ],
      hotspots: [
        { pathway: 'purine', x: 36, y: 34 }, { pathway: 'pyrimidine', x: 54, y: 36 }, { pathway: 'salvage', x: 45, y: 51 }, { pathway: 'folate', x: 31, y: 64 },
        { pathway: 'serine_glycine', x: 56, y: 67 }, { pathway: 'glycosylation', x: 76, y: 43 }, { label: '平滑内质网与脂滴', x: 82, y: 68, target: 'smooth-er-lipid', tone: '#6fa6c2' },
        { label: '高尔基体加工', x: 88, y: 29, target: 'golgi', tone: '#d46f71' }
      ]
    },
    'smooth-er-lipid': {
      title: '平滑内质网与脂滴', subtitle: '第 2 层 · Smooth ER', description: '脂肪酸、甘油三酯、磷脂、胆固醇和类固醇代谢在内质网与脂滴之间流动。', tone: '#629ab7', parent: 'cell-atlas',
      views: [
        {
          label: '脂滴与内质网', src: 'cell-metabolism-assets/optimized/10-smooth-er-lipid-droplet.webp', hotspots: [
            { label: '进入内质网腔场景', x: 39, y: 43, target: 'er-lumen-membrane', tone: '#629ab7' }
          ]
        },
        {
          label: '粗面—平滑内质网', src: 'cell-metabolism-assets/optimized/31-er-lumen-and-membrane-clean.webp', hotspots: [
            { label: '进入内质网腔场景', x: 74, y: 55, target: 'er-lumen-membrane', tone: '#629ab7' }
          ]
        }
      ],
      hotspots: [
        { pathway: 'fa_synthesis', x: 24, y: 42 }, { pathway: 'fa_elongation', x: 37, y: 29 }, { pathway: 'tag', x: 69, y: 47 }, { pathway: 'phospholipid', x: 48, y: 63 },
        { pathway: 'cholesterol', x: 61, y: 28 }, { pathway: 'steroid_bile', x: 82, y: 31 }, { pathway: 'sphingolipid', x: 79, y: 68 }, { label: '高尔基体', x: 91, y: 51, target: 'golgi', tone: '#d46f71' }
      ]
    },
    golgi: {
      title: '高尔基体加工与分选', subtitle: '第 2 层 · Golgi apparatus', description: '核苷酸糖、糖基化、鞘脂成熟与溶酶体酶分选在高尔基体中完成。', tone: '#d06d70', parent: 'cell-atlas',
      views: [
        {
          label: '局部场景', src: 'cell-metabolism-assets/optimized/21-golgi-context.webp', hotspots: [
            { label: '顺面—中间—反面', x: 54, y: 40, target: 'golgi-cis-trans', tone: '#d46f71' }
          ]
        },
        {
          label: '高尔基体', src: 'cell-metabolism-assets/optimized/08-golgi.webp', hotspots: [
            { label: '顺面—中间—反面', x: 55, y: 49, target: 'golgi-cis-trans', tone: '#d46f71' }
          ]
        },
        {
          label: '顺面—中间—反面', src: 'cell-metabolism-assets/optimized/32-golgi-cis-medial-trans-clean.webp', hotspots: [
            { label: '进入高尔基体分层场景', x: 56, y: 50, target: 'golgi-cis-trans', tone: '#d46f71' }
          ]
        }
      ],
      hotspots: [
        { pathway: 'glycosylation', x: 47, y: 39 }, { pathway: 'sphingolipid', x: 63, y: 57 }, { pathway: 'phospholipid', x: 30, y: 66 }, { label: '送往溶酶体', x: 82, y: 42, target: 'endosome-lysosome', tone: '#8b6bb1' },
        { label: '返回内质网', x: 18, y: 31, target: 'nucleus-er', tone: '#7764ae' }
      ]
    },
    'endosome-lysosome': {
      title: '内体、溶酶体与物质回收', subtitle: '第 2 层 · Endosome / Lysosome', description: '外源脂蛋白、受体和细胞自身大分子经内吞与自噬进入酸性降解系统。', tone: '#8268a9', parent: 'cell-atlas',
      views: [
        {
          label: '内吞与溶酶体', src: 'cell-metabolism-assets/optimized/09-endosome-lysosome-scene.webp', hotspots: [
            { label: '内体成熟', x: 54, y: 61, target: 'endosome-maturation', tone: '#8b6bb1' },
            { label: '自噬融合', x: 83, y: 50, target: 'autophagosome-lysosome', tone: '#8b6bb1' }
          ]
        },
        {
          label: '内体成熟', src: 'cell-metabolism-assets/optimized/33-endosome-lysosome-maturation-clean.webp', hotspots: [
            { label: '进入内体成熟场景', x: 54, y: 52, target: 'endosome-maturation', tone: '#8b6bb1' }
          ]
        },
        {
          label: '自噬融合', src: 'cell-metabolism-assets/optimized/34-autophagosome-lysosome-fusion-clean.webp', hotspots: [
            { label: '进入自噬融合场景', x: 59, y: 51, target: 'autophagosome-lysosome', tone: '#8b6bb1' }
          ]
        }
      ],
      hotspots: [
        { pathway: 'lysosomal', x: 54, y: 52 }, { pathway: 'autophagy', x: 73, y: 34 }, { pathway: 'lipoprotein', x: 24, y: 44 }, { pathway: 'nucleotide_degradation', x: 72, y: 69 },
        { pathway: 'sphingolipid', x: 34, y: 70 }, { label: '质膜内吞入口', x: 13, y: 26, target: 'plasma-membrane', tone: '#438eac' }
      ]
    },
    peroxisome: {
      title: '过氧化物酶体', subtitle: '第 2 层 · Peroxisome', description: '极长链脂肪酸、过氧化氢与醚磷脂的区室；植物中还与乙醛酸循环密切相关。', tone: '#78a45e', parent: 'cell-atlas',
      views: [
        {
          label: '过氧化物酶体', src: 'cell-metabolism-assets/optimized/12-peroxisome-clean.webp', hotspots: [
            { label: '内部剖面', x: 50, y: 50, target: 'peroxisome-interior', tone: '#79a95f' }
          ]
        },
        {
          label: '内部剖面', src: 'cell-metabolism-assets/optimized/35-peroxisome-interior-clean.webp', hotspots: [
            { label: '进入过氧化物酶体内部场景', x: 42, y: 50, target: 'peroxisome-interior', tone: '#79a95f' }
          ]
        }
      ],
      hotspots: [
        { pathway: 'vlcfa', x: 33, y: 41 }, { pathway: 'glutathione', x: 66, y: 38 }, { pathway: 'plasmalogen', x: 48, y: 68 }, { pathway: 'glyoxylate', x: 76, y: 65 },
        { label: '植物特异扩展', x: 85, y: 24, target: 'plant-extension', tone: '#6e9f55' }, { label: '转交线粒体', x: 18, y: 70, target: 'mitochondria', tone: '#db7448' }
      ]
    },
    'plasma-membrane': {
      title: '质膜运输与外源底物入口', subtitle: '第 2 层 · Plasma membrane', description: '营养物、离子、脂蛋白与代谢废物通过通道、载体和受体进入细胞内部网络。', tone: '#438eac', parent: 'cell-atlas',
      views: [
        {
          label: '营养物转运', src: 'cell-metabolism-assets/optimized/11-plasma-membrane-transport.webp', hotspots: [
            { label: '质膜横截面', x: 52, y: 49, target: 'plasma-membrane-transport', tone: '#438eac' }
          ]
        },
        {
          label: '质膜横截面', src: 'cell-metabolism-assets/optimized/36-plasma-membrane-transport-clean.webp', hotspots: [
            { label: '进入跨膜运输场景', x: 51, y: 51, target: 'plasma-membrane-transport', tone: '#438eac' }
          ]
        }
      ],
      hotspots: [
        { pathway: 'membrane_transport', x: 51, y: 45 }, { pathway: 'lipoprotein', x: 23, y: 37 }, { pathway: 'glycolysis', x: 67, y: 67 }, { pathway: 'transamination', x: 82, y: 35 },
        { pathway: 'pyruvate_fates', x: 37, y: 72 }, { label: '进入细胞质', x: 86, y: 70, target: 'cytosol', tone: '#d99a34' }, { label: '内吞系统', x: 14, y: 69, target: 'endosome-lysosome', tone: '#8268a9' }
      ]
    },
    'nucleus-interior': {
      title: '细胞核内部剖面', subtitle: '第 3 层 · Nucleus interior', description: '聚焦核孔、核仁、常染色质与异染色质，为核苷酸、一碳代谢和 DNA/RNA 合成提供空间锚点。', tone: '#7560af', parent: 'nucleus-er',
      views: [{ label: '核内剖面', src: 'cell-metabolism-assets/optimized/29-nucleus-interior-clean.webp' }],
      hotspots: [
        { pathway: 'purine', x: 31, y: 38 }, { pathway: 'pyrimidine', x: 47, y: 39 }, { pathway: 'salvage', x: 59, y: 51 },
        { pathway: 'folate', x: 34, y: 66 }, { pathway: 'serine_glycine', x: 59, y: 70 },
        { label: '核膜—粗面内质网', x: 88, y: 53, target: 'nuclear-envelope-rough-er', tone: '#7560af' },
        { label: '返回细胞核与内质网', x: 88, y: 17, target: 'nucleus-er', tone: '#7764ae' }
      ]
    },
    'nuclear-envelope-rough-er': {
      title: '核膜与粗面内质网连续界面', subtitle: '第 3 层 · Nuclear envelope / rough ER', description: '观察核外膜、核孔、核周隙与粗面内质网腔的连续关系，定位蛋白质合成、折叠和跨膜运输入口。', tone: '#7560af', parent: 'nucleus-er',
      views: [{ label: '核膜—粗面内质网', src: 'cell-metabolism-assets/optimized/30-nuclear-envelope-rough-er-interface.webp' }],
      hotspots: [
        { pathway: 'glycosylation', x: 66, y: 48 }, { pathway: 'serine_glycine', x: 61, y: 70 }, { pathway: 'purine', x: 15, y: 29 },
        { label: '细胞核内部', x: 10, y: 50, target: 'nucleus-interior', tone: '#7560af' },
        { label: '粗面—平滑内质网', x: 84, y: 61, target: 'er-lumen-membrane', tone: '#629ab7' },
        { label: '返回细胞核与内质网', x: 88, y: 16, target: 'nucleus-er', tone: '#7764ae' }
      ]
    },
    'er-lumen-membrane': {
      title: '粗面与平滑内质网内部近景', subtitle: '第 3 层 · ER lumen / membrane', description: '左侧粗面内质网承接蛋白质合成与折叠，右侧平滑内质网承接脂质、胆固醇和药物代谢。', tone: '#629ab7', parent: 'nucleus-er',
      views: [{ label: '粗面—平滑内质网', src: 'cell-metabolism-assets/optimized/31-er-lumen-and-membrane-clean.webp' }],
      hotspots: [
        { pathway: 'glycosylation', x: 22, y: 42 }, { pathway: 'fa_synthesis', x: 75, y: 57 }, { pathway: 'fa_elongation', x: 82, y: 36 },
        { pathway: 'phospholipid', x: 60, y: 70 }, { pathway: 'cholesterol', x: 80, y: 70 },
        { label: '核膜接口', x: 10, y: 46, target: 'nuclear-envelope-rough-er', tone: '#7560af' },
        { label: '返回细胞核与内质网', x: 89, y: 15, target: 'nucleus-er', tone: '#7764ae' }
      ]
    },
    'golgi-cis-trans': {
      title: '高尔基体顺面—中间—反面', subtitle: '第 3 层 · Golgi cis / medial / trans', description: '按输入、修饰和分选方向观察高尔基体扁囊及运输囊泡，连接糖基化和鞘脂成熟。', tone: '#d46f71', parent: 'golgi',
      views: [{ label: '顺面—中间—反面', src: 'cell-metabolism-assets/optimized/32-golgi-cis-medial-trans-clean.webp' }],
      hotspots: [
        { pathway: 'glycosylation', x: 48, y: 43 }, { pathway: 'sphingolipid', x: 60, y: 57 }, { pathway: 'phospholipid', x: 39, y: 69 },
        { label: '送往内体与溶酶体', x: 89, y: 56, target: 'endosome-lysosome', tone: '#8b6bb1' },
        { label: '返回高尔基体', x: 12, y: 18, target: 'golgi', tone: '#d06d70' }
      ]
    },
    'endosome-maturation': {
      title: '内体成熟与溶酶体融合剖面', subtitle: '第 3 层 · Endosome maturation', description: '从早期内体到晚期多泡体，再到溶酶体的空间连续关系，承接内吞和大分子降解通路。', tone: '#8b6bb1', parent: 'endosome-lysosome',
      views: [{ label: '内体成熟', src: 'cell-metabolism-assets/optimized/33-endosome-lysosome-maturation-clean.webp' }],
      hotspots: [
        { pathway: 'lipoprotein', x: 18, y: 52 }, { pathway: 'nucleotide_degradation', x: 53, y: 53 }, { pathway: 'lysosomal', x: 82, y: 52 }, { pathway: 'sphingolipid', x: 53, y: 72 },
        { label: '自噬融合', x: 87, y: 76, target: 'autophagosome-lysosome', tone: '#8b6bb1' },
        { label: '返回内体与溶酶体', x: 12, y: 17, target: 'endosome-lysosome', tone: '#8268a9' }
      ]
    },
    'autophagosome-lysosome': {
      title: '自噬体与溶酶体融合', subtitle: '第 3 层 · Autophagosome / lysosome', description: '聚焦双层膜自噬体与单层膜溶酶体的接触和初始融合，连接自噬、降解与物质回收。', tone: '#8b6bb1', parent: 'endosome-lysosome',
      views: [{ label: '自噬融合', src: 'cell-metabolism-assets/optimized/34-autophagosome-lysosome-fusion-clean.webp' }],
      hotspots: [
        { pathway: 'autophagy', x: 59, y: 50 }, { pathway: 'lysosomal', x: 76, y: 49 }, { pathway: 'nucleotide_degradation', x: 50, y: 70 },
        { label: '内体成熟', x: 89, y: 78, target: 'endosome-maturation', tone: '#8b6bb1' },
        { label: '返回内体与溶酶体', x: 12, y: 17, target: 'endosome-lysosome', tone: '#8268a9' }
      ]
    },
    'peroxisome-interior': {
      title: '过氧化物酶体内部剖面', subtitle: '第 3 层 · Peroxisome interior', description: '定位极长链脂肪酸氧化、过氧化氢处理和醚磷脂早期合成的过氧化物酶体基质。', tone: '#79a95f', parent: 'peroxisome',
      views: [{ label: '内部剖面', src: 'cell-metabolism-assets/optimized/35-peroxisome-interior-clean.webp' }],
      hotspots: [
        { pathway: 'vlcfa', x: 31, y: 38 }, { pathway: 'glutathione', x: 54, y: 38 }, { pathway: 'plasmalogen', x: 38, y: 65 }, { pathway: 'glyoxylate', x: 63, y: 69 },
        { label: '返回过氧化物酶体', x: 89, y: 17, target: 'peroxisome', tone: '#78a45e' }
      ]
    },
    'plasma-membrane-transport': {
      title: '质膜横截面与跨膜运输锚点', subtitle: '第 3 层 · Plasma membrane transport', description: '区分胞外液、磷脂双分子层和胞质，定位通道、载体、受体以及营养物进出方向。', tone: '#438eac', parent: 'plasma-membrane',
      views: [{ label: '质膜横截面', src: 'cell-metabolism-assets/optimized/36-plasma-membrane-transport-clean.webp' }],
      hotspots: [
        { pathway: 'membrane_transport', x: 52, y: 49 }, { pathway: 'lipoprotein', x: 23, y: 42 }, { pathway: 'glycolysis', x: 68, y: 76 },
        { pathway: 'transamination', x: 84, y: 76 }, { pathway: 'pyruvate_fates', x: 38, y: 76 },
        { label: '进入细胞质', x: 90, y: 82, target: 'cytosol', tone: '#d99a34' },
        { label: '进入内吞系统', x: 11, y: 82, target: 'endosome-lysosome', tone: '#8268a9' },
        { label: '返回质膜运输', x: 89, y: 16, target: 'plasma-membrane', tone: '#438eac' }
      ]
    },
    'plant-extension': {
      title: '植物细胞代谢扩展', subtitle: '扩展层 · Plant-cell metabolism', description: '以植物细胞的质体、细胞质、线粒体与乙醛酸体为真实空间边界，定位淀粉代谢、氮同化、硫同化和乙醛酸循环。', tone: '#6e9f55', parent: 'cell-atlas',
      views: [
        { label: '植物细胞总览', src: 'cell-metabolism-assets/optimized/37-plant-cell-overview.svg' },
        { label: '质体—乙醛酸体接口', src: 'cell-metabolism-assets/optimized/38-plant-organelle-interface.svg' }
      ],
      hotspots: [
        { pathway: 'starch', x: 76, y: 24 }, { pathway: 'glyoxylate', x: 17, y: 77 }, { pathway: 'nitrogen', x: 74, y: 38 }, { pathway: 'sulfur', x: 74, y: 52 }, { pathway: 'aa_biosynthesis', x: 50, y: 73 }
      ],
      exchanges: [
        { label: '亚硝酸盐 · 细胞质 → 质体（机制待审校）', pathway: 'nitrogen', tone: '#4c8b67' },
        { label: '琥珀酸 / 苹果酸 · 乙醛酸体 → 其他区室', pathway: 'glyoxylate', tone: '#b47a36' }
      ]
    }
  };

  // Scientific illustration overlays are kept separate from navigation hotspots.
  // Every scene view resolves to one profile, so a new image cannot silently ship
  // without structural labels and a short teaching explanation.
  const annotationProfiles = {
    cell: [
      { label: '细胞质基质', detail: '多数糖代谢、氨基酸转化和核苷酸前体反应发生在这一水相环境中。', kind: 'boundary', x: 31, y: 22, side: 'right' },
      { label: '细胞核', detail: '核膜围成的遗传信息区室；核苷酸供应与一碳代谢会影响 DNA、RNA 合成。', kind: 'structure', x: 49, y: 38, side: 'left' },
      { label: '线粒体', detail: '通过基质反应和内膜呼吸链把碳流中的还原当量转为 ATP。', kind: 'process', x: 68, y: 58, side: 'right' },
      { label: '内质网', detail: '粗面区承接蛋白质合成，平滑区参与脂质、胆固醇与药物代谢。', kind: 'structure', x: 24, y: 64, side: 'right' },
      { label: '高尔基体', detail: '对糖蛋白和膜脂进一步修饰，并按目的地完成分选和囊泡输出。', kind: 'process', x: 76, y: 29, side: 'left' },
      { label: '质膜边界', detail: '以通道、载体和受体控制营养物、离子与信号在胞外和胞内之间交换。', kind: 'boundary', x: 50, y: 84, side: 'left' },
      { label: '细胞骨架纤维', detail: '图中少量细长纤维表示微管或微丝等结构支架，不表示代谢反应，也不表示小分子运输方向。', kind: 'structure', x: 18, y: 51, side: 'right' }
    ],
    cytosol: [
      { label: '水相代谢空间', detail: '可溶性酶、底物和辅酶在此扩散并形成相互连接的代谢网络。', kind: 'boundary', x: 28, y: 22, side: 'right' },
      { label: '葡萄糖碳流', detail: '葡萄糖可进入糖酵解、磷酸戊糖途径或糖原储存，节点之间共享中间体。', kind: 'process', x: 38, y: 47, side: 'left' },
      { label: 'NADPH 供给', detail: '磷酸戊糖途径产生的 NADPH 主要支持还原合成和抗氧化，而非直接进入呼吸链。', kind: 'process', x: 64, y: 29, side: 'right' },
      { label: '胞质核糖体', detail: '游离核糖体合成主要留在胞质、细胞核和线粒体等位置使用的蛋白质。', kind: 'structure', x: 76, y: 55, side: 'left' },
      { label: '细胞器交换口', detail: '丙酮酸、脂酰基和还原当量需借助专一转运或穿梭系统跨越细胞器膜。', kind: 'transport', x: 53, y: 76, side: 'right' }
    ],
    cytosolInterface: [
      { label: '细胞质侧', detail: '糖酵解产生的丙酮酸与 NADH 位于膜外侧，不能自由穿过线粒体内膜。', kind: 'boundary', x: 18, y: 24, side: 'right' },
      { label: '外膜通道', detail: 'VDAC 使小分子通过线粒体外膜，进入膜间隙一侧。', kind: 'transport', x: 37, y: 42, side: 'left' },
      { label: '膜间隙', detail: '位于外膜和内膜之间；呼吸链泵出的 H⁺在这里形成电化学梯度。', kind: 'boundary', x: 52, y: 29, side: 'right' },
      { label: '内膜载体', detail: 'MPC、ANT 等载体选择性运输丙酮酸或腺嘌呤核苷酸。', kind: 'transport', x: 66, y: 51, side: 'left' },
      { label: '基质侧', detail: '丙酮酸进入基质后可经 PDH 形成乙酰-CoA，并接入三羧酸循环。', kind: 'process', x: 81, y: 72, side: 'left' }
    ],
    mitochondrion: [
      { label: '线粒体外膜', detail: '包围整个细胞器；VDAC 对多种小分子开放，但并不等同于内膜的选择性转运。', kind: 'boundary', x: 20, y: 23, side: 'right' },
      { label: '膜间隙', detail: '呼吸链把 H⁺泵入这里，建立驱动 ATP 合成的质子动力势。', kind: 'boundary', x: 34, y: 43, side: 'left' },
      { label: '内膜与嵴', detail: '高度折叠的内膜承载呼吸链复合体、ATP 合酶和多类专一载体。', kind: 'structure', x: 54, y: 29, side: 'right' },
      { label: '线粒体基质', detail: 'PDH、三羧酸循环、脂肪酸 β-氧化及部分氨基酸反应的主要区室。', kind: 'boundary', x: 64, y: 59, side: 'left' },
      { label: '基质 DNA 与核糖体', detail: '线粒体保留少量自身基因与翻译装置，但绝大多数蛋白由细胞核编码后导入。', kind: 'structure', x: 78, y: 38, side: 'left' },
      { label: 'ATP 输出', detail: '基质生成的 ATP 经 ANT 与胞质 ADP 交换，再通过外膜通道到达胞质。', kind: 'transport', x: 47, y: 77, side: 'right' }
    ],
    matrix: [
      { label: '基质水相', detail: '这一空间包含 PDH、三羧酸循环和脂肪酸 β-氧化的大多数可溶性酶。', kind: 'boundary', x: 24, y: 22, side: 'right' },
      { label: '乙酰-CoA 汇入口', detail: '糖、脂肪酸和部分氨基酸的碳骨架可在此汇入乙酰-CoA。', kind: 'process', x: 38, y: 45, side: 'left' },
      { label: '三羧酸循环', detail: '乙酰基被氧化为 CO₂，并把能量暂存于 NADH、FADH₂ 和 GTP。', kind: 'process', x: 58, y: 57, side: 'right' },
      { label: '内膜边界', detail: '基质侧产生的还原当量在内膜呼吸链被再氧化，内膜本身对 H⁺高度不通透。', kind: 'boundary', x: 78, y: 24, side: 'left' },
      { label: '还原当量输出', detail: 'NADH 和酶结合的 FADH₂将高能电子送入呼吸链，而不是直接穿过膜。', kind: 'transport', x: 72, y: 76, side: 'left' }
    ],
    innerMembrane: [
      { label: '膜间隙侧', detail: '复合体 I、III、IV 将 H⁺泵向这一侧，使这里相对更正、更酸。', kind: 'boundary', x: 18, y: 20, side: 'right' },
      { label: '复合体 I / II', detail: '分别接收 NADH 或琥珀酸来源的电子，并把电子交给膜内可移动的 CoQ。', kind: 'process', x: 31, y: 45, side: 'left' },
      { label: 'CoQ 与复合体 III', detail: 'CoQ 在膜内扩散；复合体 III 经 Q 循环把电子传给细胞色素 c。', kind: 'process', x: 51, y: 32, side: 'right' },
      { label: '复合体 IV', detail: '把电子最终交给 O₂并生成 H₂O，同时继续向膜间隙泵出 H⁺。', kind: 'process', x: 68, y: 47, side: 'left' },
      { label: 'ATP 合酶', detail: 'H⁺顺电化学梯度回流至基质，驱动 ADP 与 Pi 合成 ATP。', kind: 'process', x: 81, y: 28, side: 'left' },
      { label: '线粒体基质侧', detail: 'ATP 在这一侧形成；ANT 与磷酸载体负责底物和产物交换。', kind: 'boundary', x: 56, y: 76, side: 'right' }
    ],
    nucleusEr: [
      { label: '核质', detail: 'DNA 复制、转录与 RNA 加工发生在核内，依赖持续的核苷酸供应。', kind: 'boundary', x: 25, y: 26, side: 'right' },
      { label: '核仁', detail: '核糖体 RNA 的转录和核糖体亚基装配集中在核仁。', kind: 'structure', x: 43, y: 46, side: 'left' },
      { label: '双层核膜', detail: '内外两层膜包围核周隙；外核膜与粗面内质网膜连续。', kind: 'boundary', x: 55, y: 25, side: 'right' },
      { label: '核孔复合体', detail: '选择性运输 RNA、蛋白质和核糖体亚基，而不是让大分子自由扩散。', kind: 'transport', x: 65, y: 52, side: 'left' },
      { label: '粗面内质网', detail: '附着核糖体合成分泌蛋白、膜蛋白及内膜系统驻留蛋白。', kind: 'structure', x: 78, y: 31, side: 'left' },
      { label: '内质网腔', detail: '蛋白折叠、二硫键形成和 N-连接糖基化早期步骤发生于此。', kind: 'process', x: 72, y: 73, side: 'left' }
    ],
    nucleus: [
      { label: '核质', detail: '核内可溶环境，容纳复制、转录、RNA 加工和核苷酸相关反应。', kind: 'boundary', x: 22, y: 24, side: 'right' },
      { label: '常染色质', detail: '相对疏松、通常更容易被转录机器访问的染色质区域。', kind: 'structure', x: 40, y: 42, side: 'left' },
      { label: '异染色质', detail: '较致密、通常转录活性较低，常分布于核周或特定核内区域。', kind: 'structure', x: 65, y: 27, side: 'right' },
      { label: '核仁', detail: 'rRNA 合成与核糖体亚基装配中心，对核苷酸和能量需求较高。', kind: 'process', x: 57, y: 61, side: 'left' },
      { label: '核孔', detail: '建立核质与细胞质之间受调控的双向大分子运输。', kind: 'transport', x: 80, y: 73, side: 'left' }
    ],
    nuclearEnvelope: [
      { label: '内核膜', detail: '朝向核质并连接核纤层，参与维持细胞核形态和染色质组织。', kind: 'boundary', x: 20, y: 23, side: 'right' },
      { label: '核周隙', detail: '位于内、外核膜之间，并与内质网腔保持连续。', kind: 'boundary', x: 36, y: 43, side: 'left' },
      { label: '外核膜', detail: '与粗面内质网连续，朝向细胞质的一侧可附着核糖体。', kind: 'boundary', x: 53, y: 27, side: 'right' },
      { label: '核孔复合体', detail: '跨越双层核膜，借助核转运受体选择性运输大分子。', kind: 'transport', x: 66, y: 54, side: 'left' },
      { label: '粗面内质网', detail: '核糖体在膜胞质侧翻译，肽链同步进入内质网腔或插入膜。', kind: 'process', x: 82, y: 71, side: 'left' }
    ],
    er: [
      { label: '粗面内质网', detail: '膜表面的核糖体合成分泌途径和膜系统所需蛋白。', kind: 'structure', x: 19, y: 24, side: 'right' },
      { label: '附着核糖体', detail: '翻译中的肽链经转位通道进入内质网腔或侧向插入膜。', kind: 'process', x: 34, y: 47, side: 'left' },
      { label: '内质网腔', detail: '蛋白折叠、质量控制和早期糖基化发生在封闭腔内。', kind: 'boundary', x: 50, y: 28, side: 'right' },
      { label: '平滑内质网', detail: '缺少密集核糖体，富集脂质、胆固醇与异生物代谢酶。', kind: 'structure', x: 67, y: 48, side: 'left' },
      { label: '膜脂合成面', detail: '多种膜脂先在内质网膜胞质侧合成，再经翻转或囊泡运输分配。', kind: 'process', x: 81, y: 27, side: 'left' },
      { label: '运输囊泡出口', detail: '新合成的蛋白和脂质从 ER 出口位点装入 COPII 囊泡前往高尔基体。', kind: 'transport', x: 67, y: 75, side: 'left' }
    ],
    lipidEr: [
      { label: '平滑内质网', detail: '脂肪酸延长、去饱和及胆固醇和磷脂合成的重要膜性平台。', kind: 'structure', x: 20, y: 23, side: 'right' },
      { label: '内质网膜双层', detail: '新生中性脂质积聚在膜双层两叶之间，逐步形成脂滴核心。', kind: 'boundary', x: 38, y: 47, side: 'left' },
      { label: '脂滴单分子层', detail: '脂滴表面只有一层磷脂，并结合调控脂解和脂质储存的蛋白。', kind: 'structure', x: 57, y: 28, side: 'right' },
      { label: '中性脂质核心', detail: '主要储存甘油三酯和胆固醇酯，避免疏水脂质暴露于细胞质。', kind: 'structure', x: 72, y: 53, side: 'left' },
      { label: '脂滴出芽界面', detail: '脂滴从内质网膜向细胞质侧生长，并持续与内质网进行脂质和蛋白交换。', kind: 'process', x: 82, y: 76, side: 'left' }
    ],
    golgi: [
      { label: '顺面高尔基', detail: '接收来自内质网的 COPII 囊泡，是高尔基体的输入端。', kind: 'transport', x: 18, y: 23, side: 'right' },
      { label: '中间扁囊', detail: '糖链逐步修饰，酶和货物随扁囊成熟或囊泡运输发生空间变化。', kind: 'process', x: 38, y: 47, side: 'left' },
      { label: '反面高尔基网络', detail: '按质膜、分泌囊泡、内体或溶酶体等目的地分选货物。', kind: 'process', x: 60, y: 31, side: 'right' },
      { label: '逆向回收囊泡', detail: 'COPI 相关运输可回收驻留酶，并把部分货物送回内质网。', kind: 'transport', x: 73, y: 53, side: 'left' },
      { label: '分泌与内体出口', detail: '不同包被和分选信号将货物导向质膜、分泌途径或内体系统。', kind: 'transport', x: 82, y: 76, side: 'left' }
    ],
    endolysosome: [
      { label: '内吞小泡', detail: '质膜包裹受体和胞外货物后形成囊泡，进入内体系统。', kind: 'transport', x: 18, y: 24, side: 'right' },
      { label: '早期内体', detail: '首先分拣货物：受体可回收至质膜，待降解货物继续向晚期内体移动。', kind: 'process', x: 35, y: 47, side: 'left' },
      { label: '晚期内体 / 多泡体', detail: '腔内逐渐酸化，并通过腔内小泡隔离膜蛋白，准备与溶酶体融合。', kind: 'structure', x: 55, y: 29, side: 'right' },
      { label: '溶酶体', detail: '酸性水解酶分解蛋白质、脂质、糖类和核酸，并释放可再利用的小分子。', kind: 'process', x: 75, y: 52, side: 'left' },
      { label: '回收支路', detail: '部分受体和膜成分不被降解，而是经回收内体返回质膜。', kind: 'transport', x: 65, y: 77, side: 'right' }
    ],
    endosome: [
      { label: '早期内体', detail: '接收内吞货物并完成第一轮分选，腔内 pH 已开始下降。', kind: 'process', x: 18, y: 25, side: 'right' },
      { label: '回收内体', detail: '把受体和膜脂送回细胞表面，维持质膜组成和受体敏感性。', kind: 'transport', x: 35, y: 52, side: 'left' },
      { label: '腔内小泡', detail: 'ESCRT 相关过程使待降解膜蛋白进入腔内小泡，形成多泡体。', kind: 'structure', x: 55, y: 30, side: 'right' },
      { label: '晚期内体', detail: '进一步酸化并获得溶酶体相关蛋白，逐步具备降解能力。', kind: 'process', x: 71, y: 55, side: 'left' },
      { label: '溶酶体融合', detail: '晚期内体与溶酶体融合后，货物暴露于酸性水解酶。', kind: 'transport', x: 82, y: 76, side: 'left' }
    ],
    autophagy: [
      { label: '隔离膜', detail: '杯状膜结构逐步包围待清除的细胞质成分或受损细胞器。', kind: 'structure', x: 18, y: 24, side: 'right' },
      { label: '双层膜自噬体', detail: '隔离膜闭合形成双层膜囊泡，把胞质货物与其余细胞隔开。', kind: 'structure', x: 37, y: 50, side: 'left' },
      { label: '融合接触位点', detail: '系链和 SNARE 蛋白促使自噬体外膜与溶酶体膜融合。', kind: 'transport', x: 55, y: 30, side: 'right' },
      { label: '溶酶体', detail: '提供酸性环境和水解酶，接收自噬体包裹的货物。', kind: 'process', x: 73, y: 52, side: 'left' },
      { label: '自噬溶酶体', detail: '融合后的降解区室把大分子转为氨基酸、脂肪酸和单糖等回收物。', kind: 'process', x: 63, y: 78, side: 'right' }
    ],
    peroxisome: [
      { label: '单层界膜', detail: '过氧化物酶体只有一层膜，膜蛋白控制脂酰基和代谢物交换。', kind: 'boundary', x: 19, y: 24, side: 'right' },
      { label: '基质氧化酶', detail: '极长链脂酰-CoA 氧化酶直接把电子交给 O₂，因此产生 H₂O₂。', kind: 'process', x: 38, y: 49, side: 'left' },
      { label: '过氧化氢', detail: 'H₂O₂ 是氧化反应副产物，浓度过高会损伤蛋白、脂质和核酸。', kind: 'process', x: 56, y: 28, side: 'right' },
      { label: '过氧化氢酶', detail: 'Catalase 将 H₂O₂ 分解为 H₂O 和 O₂，限制局部氧化压力。', kind: 'process', x: 72, y: 53, side: 'left' },
      { label: '缩短脂酰基输出', detail: '极长链脂肪酸被缩短后可转交线粒体继续氧化；产物运输需要专门机制。', kind: 'transport', x: 64, y: 77, side: 'right' }
    ],
    plasma: [
      { label: '胞外侧', detail: '营养物、脂蛋白、离子和信号分子首先位于细胞外液。', kind: 'boundary', x: 20, y: 19, side: 'right' },
      { label: '磷脂双分子层', detail: '疏水核心阻挡离子和多数极性分子自由扩散，建立选择性边界。', kind: 'structure', x: 39, y: 43, side: 'left' },
      { label: '跨膜通道 / 载体', detail: '通道提供孔道，载体通过构象变化运输葡萄糖、氨基酸和离子等底物。', kind: 'transport', x: 57, y: 31, side: 'right' },
      { label: '受体介导内吞', detail: '受体识别配体后聚集入内吞小窝，把大颗粒或复合物送往内体。', kind: 'transport', x: 74, y: 49, side: 'left' },
      { label: '胞质侧', detail: '进入细胞的底物在这一侧被捕获、磷酸化或转交给下游代谢通路。', kind: 'boundary', x: 63, y: 77, side: 'right' }
    ],
    plasmaCross: [
      { label: '胞外液', detail: '膜的外侧环境；溶质浓度和膜电位共同影响跨膜运输方向。', kind: 'boundary', x: 18, y: 17, side: 'right' },
      { label: '亲水头部', detail: '磷脂极性头部朝向水相，分别接触胞外液和细胞质。', kind: 'structure', x: 35, y: 41, side: 'left' },
      { label: '疏水脂肪酸尾部', detail: '两层疏水尾部相向排列，构成离子和极性分子的主要扩散屏障。', kind: 'structure', x: 51, y: 50, side: 'right' },
      { label: '跨膜转运蛋白', detail: '选择性识别底物；被动运输顺电化学梯度，主动运输需要能量耦联。', kind: 'transport', x: 67, y: 43, side: 'left' },
      { label: '受体 / 内吞入口', detail: '受体可触发信号，也可与配体一起内化，进入内体—溶酶体系统。', kind: 'transport', x: 79, y: 62, side: 'left' },
      { label: '细胞质', detail: '膜内侧水相；葡萄糖等底物进入后可迅速接入糖酵解或储存通路。', kind: 'boundary', x: 55, y: 79, side: 'right' }
    ],
    plantCell: [
      { label: '中央液泡', detail: '成熟植物细胞的大型液泡由液泡膜包围，承担渗透调节、离子与代谢物储存；这里不放置质体反应。', kind: 'boundary', x: 55, y: 49, side: 'right' },
      { label: '叶绿体 / 质体', detail: '淀粉合成以及亚硝酸盐、硫酸盐的后续还原主要定位于质体；不同组织可具有不同类型质体。', kind: 'structure', x: 78, y: 20, side: 'left' },
      { label: '细胞质', detail: '硝酸还原酶位于细胞质侧，生成的亚硝酸盐需要转运进入质体后继续还原。', kind: 'process', x: 43, y: 81, side: 'right' },
      { label: '乙醛酸体', detail: '萌发种子等组织中的特化过氧化物酶体，可把脂肪酸氧化与乙醛酸循环衔接。', kind: 'structure', x: 16, y: 78, side: 'right' },
      { label: '线粒体', detail: '接收有机酸和还原当量，承担三羧酸循环与氧化磷酸化，并与质体和乙醛酸体交换碳骨架。', kind: 'process', x: 84, y: 49, side: 'left' },
      { label: '细胞壁与质膜', detail: '细胞壁提供机械支撑，内侧质膜才是选择性运输边界；二者不能视为同一膜结构。', kind: 'boundary', x: 92, y: 70, side: 'left' }
    ],
    plantInterface: [
      { label: '质体基质', detail: '淀粉合成、亚硝酸盐还原、GS/GOGAT 和硫同化反应按当前数据定位于质体内部。', kind: 'process', x: 9, y: 48, side: 'right' },
      { label: '淀粉颗粒', detail: 'ADP-葡萄糖为淀粉延长提供葡萄糖基；淀粉动员可产生麦芽糖或葡萄糖-1-磷酸。', kind: 'structure', x: 28, y: 55, side: 'left' },
      { label: '质体包膜运输', detail: '亚硝酸盐和多种碳骨架必须跨越质体包膜；具体转运体与驱动力需按物种和组织继续审校。', kind: 'transport', x: 40, y: 31, side: 'right' },
      { label: '乙醛酸体循环', detail: '异柠檬酸裂解酶和苹果酸合酶绕过两次脱羧，使乙酰-CoA 的碳可净转为四碳有机酸。', kind: 'process', x: 55, y: 51, side: 'left' },
      { label: '线粒体接口', detail: '琥珀酸、苹果酸等产物可转交线粒体和细胞质；图中连线表示区室交换，不代表自由扩散。', kind: 'transport', x: 87, y: 51, side: 'left' },
      { label: '植物细胞质', detail: '质体、乙醛酸体与线粒体位于同一胞质环境，但各自膜边界仍决定酶和底物的可达性。', kind: 'boundary', x: 54, y: 82, side: 'right' }
    ]
  };

  const sceneAnnotationProfileMap = {
    'cell-atlas': Array(4).fill('cell'),
    cytosol: ['cytosol', 'cytosolInterface'],
    mitochondria: Array(4).fill('mitochondrion'),
    'mitochondria-matrix': Array(2).fill('matrix'),
    'mitochondria-inner-membrane': Array(3).fill('innerMembrane'),
    'nucleus-er': ['nucleusEr', 'nucleusEr', 'nucleus', 'nuclearEnvelope', 'er'],
    'smooth-er-lipid': ['lipidEr', 'er'],
    golgi: Array(3).fill('golgi'),
    'endosome-lysosome': ['endolysosome', 'endosome', 'autophagy'],
    peroxisome: Array(2).fill('peroxisome'),
    'plasma-membrane': ['plasma', 'plasmaCross'],
    'nucleus-interior': ['nucleus'],
    'nuclear-envelope-rough-er': ['nuclearEnvelope'],
    'er-lumen-membrane': ['er'],
    'golgi-cis-trans': ['golgi'],
    'endosome-maturation': ['endosome'],
    'autophagosome-lysosome': ['autophagy'],
    'peroxisome-interior': ['peroxisome'],
    'plasma-membrane-transport': ['plasmaCross'],
    'plant-extension': ['plantCell', 'plantInterface']
  };

  return { pathways, scenes, annotationProfiles, sceneAnnotationProfileMap, source: '生物化学代谢总图新版-亮亮.pdf', version: 'rev.13' };
})();
