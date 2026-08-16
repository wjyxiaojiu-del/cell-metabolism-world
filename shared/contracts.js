// 项目共享契约：核心通路清单、routeGroups、测试契约。
// 目标：逐步替换 index.html / tools / tests 中重复硬编码的同一份数字与列表。
// 本文件同时支持 CommonJS（Node 工具/测试）与浏览器全局（后续 index.html 可加载）。
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CMW_CONTRACTS = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // 21 条核心通路（权威源：index.html coreStudyModules）
  const CORE_STUDY_MODULES = {
    biooxidation: ['pdh', 'tca', 'malate_aspartate', 'glycerol_phosphate', 'etc', 'oxphos'],
    carbohydrate: ['glycolysis', 'gluconeogenesis', 'glycogenesis', 'glycogenolysis', 'ppp'],
    lipid: ['fa_synthesis', 'carnitine', 'beta_oxidation', 'ketone'],
    amino: ['transamination', 'urea', 'aa_carbon'],
    nucleotide: ['purine', 'pyrimidine', 'nucleotide_degradation']
  };

  const CORE_STUDY_PATHWAY_IDS = Object.values(CORE_STUDY_MODULES).flat();
  const CORE_STUDY_PATHWAY_SET = new Set(CORE_STUDY_PATHWAY_IDS);

  // 34 条扩展通路（不在学习主线中；其中 transport 无场景热点，UI 不可达）
  const OMITTED_EXTENDED_PATHWAYS = [
    'starch', 'fructose', 'galactose', 'uronic', 'polyol', 'pyruvate_fates',
    'glyoxylate', 'atp_transport', 'transport', 'lipoprotein', 'fa_elongation',
    'vlcfa', 'tag', 'phospholipid', 'sphingolipid', 'cholesterol', 'steroid_bile',
    'glutamate_glutamine', 'bcaa', 'aromatic_aa', 'serine_glycine',
    'methionine_cysteine', 'aa_biosynthesis', 'nitrogen', 'sulfur', 'salvage',
    'folate', 'heme', 'glutathione', 'glycosylation', 'lysosomal', 'autophagy',
    'membrane_transport', 'plasmalogen'
  ];

  // 步骤解析与统计工具共用的 routeGroups
  const ROUTE_GROUPS = {
    glycolysis: 'glycolysis', pdh: 'pdh', tca: 'tca', etc: 'etc', oxphos: 'etc',
    malate_aspartate: 'transport', glycerol_phosphate: 'transport', atp_transport: 'transport'
  };

  // 测试与 UI 之间的硬性契约（改动需同步测试和 HANDOVER §3.5）
  const TEST_CONTRACTS = Object.freeze({
    corePathwayCount: 21,
    studentPathwaySelectOptions: 21,
    studentArrowMarkerWidth: 12,
    glycolysisMainSteps: 10,
    primerFont: Object.freeze({
      storyStrongMinPx: 19,
      storyPMinPx: 16,
      factsDDMinPx: 16
    }),
    learningSteps: Object.freeze({
      total: 290,
      interactive: 271,
      explanatory: 19,
      brokenLinks: 0
    })
  });

  return Object.freeze({
    CORE_STUDY_MODULES,
    CORE_STUDY_PATHWAY_IDS,
    CORE_STUDY_PATHWAY_SET,
    OMITTED_EXTENDED_PATHWAYS,
    ROUTE_GROUPS,
    TEST_CONTRACTS
  });
});
