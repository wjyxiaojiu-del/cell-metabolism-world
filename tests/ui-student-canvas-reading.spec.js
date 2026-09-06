const { test, expect, appUrl } = require('./helpers.js');
const { TEST_CONTRACTS } = require('../shared/contracts.js');

test('student canvas keeps current and next step in sync', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(appUrl('student-canvas-reading-1'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await expect(page.locator('#studentWorkspace')).toBeVisible();
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'glycolysis';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const mainNodes = page.locator('#studentMapNodes .student-map-node[data-step-index]');
  await expect(mainNodes).toHaveCount(TEST_CONTRACTS.glycolysisMainSteps);
  await expect(mainNodes.nth(4)).toContainText('甘油醛-3-磷酸');
  await expect(page.locator('#flowSteps .flow-step').nth(4)).toContainText('甘油醛-3-磷酸');
  await expect(page.locator('#studentMapNodes .student-map-node.is-current')).toHaveCount(1);
  await expect(page.locator('#studentMapNodes .student-map-node.is-next')).toHaveCount(1);
  await expect(page.locator('#studentMapCurrent')).toHaveText('葡萄糖');
  await expect(page.locator('#studentMapNext')).toHaveText('葡萄糖-6-磷酸');
  const hiddenBadges = await page.locator('#studentMapNodes .node-scene-badge').evaluateAll(nodes =>
    nodes.length > 0 && nodes.every(node => getComputedStyle(node).display === 'none')
  );
  expect(hiddenBadges).toBe(true);

  await mainNodes.nth(1).click();
  await expect(page.locator('#studentMapCurrent')).toHaveText('葡萄糖-6-磷酸');
  await expect(page.locator('#studentMapNext')).toHaveText('果糖-6-磷酸');
  await expect(page.locator('#studentMapNodes .student-map-node.is-current')).toHaveAttribute('data-step-index', '1');
  await expect(page.locator('#studentMapNodes .student-map-node.is-next')).toHaveAttribute('data-step-index', '2');
  await expect(page.locator('#studentDetail')).not.toHaveClass(/empty/);
  const studentDetail = page.locator('#studentDetail');
  await page.locator('#studentReactionToggle').click();
  await expect(page.locator('#studentReactions')).toContainText('甘油醛-3-磷酸');
  await expect(page.locator('#studentReactions')).not.toContainText('G3P');
  await page.locator('#studentReactions .student-reaction').first().click();
  const detailTitle = studentDetail.getByRole('heading', { level: 3 });
  const initialDetailTitle = await detailTitle.textContent();
  await expect(studentDetail.locator('.student-detail-count')).toHaveText(/1 \/ \d+反应/);
  await expect(studentDetail.locator('[data-student-detail-nav="-1"]')).toBeDisabled();
  await expect(studentDetail.locator('[data-student-detail-nav="1"]')).toBeEnabled();
  await studentDetail.locator('[data-student-detail-nav="1"]').click();
  await expect(detailTitle).not.toHaveText(initialDetailTitle);
  await expect(studentDetail.locator('.student-detail-count')).toHaveText(/2 \/ \d+反应/);
  await expect(studentDetail.locator('[data-student-detail-nav="-1"]')).toBeEnabled();
  const detailTextSizes = await studentDetail.evaluate(detail => ({
    description: parseFloat(getComputedStyle(detail.querySelector('.student-detail-description')).fontSize),
    equation: parseFloat(getComputedStyle(detail.querySelector('.equation-summary strong')).fontSize),
    enzyme: parseFloat(getComputedStyle(detail.querySelector('.enzyme-summary strong')).fontSize)
  }));
  expect(detailTextSizes.description).toBeGreaterThanOrEqual(14);
  expect(detailTextSizes.equation).toBeGreaterThanOrEqual(16);
  expect(detailTextSizes.enzyme).toBeGreaterThanOrEqual(14);
  await expect(studentDetail.locator('.student-learning-notes')).toHaveCount(0);
  await expect(studentDetail.locator('.student-detail-statuses .review')).toHaveCount(0);
  await studentDetail.scrollIntoViewIfNeeded();
  await studentDetail.screenshot({ path: 'output/playwright/student-reaction-learning-panel.png' });
  const destinationPaths = await page.locator('#studentDestinationEdges .student-destination-edge').evaluateAll(paths => paths.map(path => path.getAttribute('d') || ''));
  expect(destinationPaths.length).toBeGreaterThan(0);
  expect(destinationPaths.every(path => (path.match(/ C /g) || []).length === 1 && !/ [HV] /.test(path))).toBe(true);
  expect(new Set(destinationPaths.map(path => path.match(/^M\s+([^ ]+\s+[^ ]+)/)?.[1])).size).toBe(destinationPaths.length);
  await expect(page.locator('.student-destination-legend')).toContainText('目标通路使用它');
  await expect(page.locator('.student-destination-legend')).toContainText('目标通路生成它');
  await expect(page.locator('.student-destination-legend')).toContainText('目标通路中继续参与');
  const destinationSemantics = await page.locator('#studentDestinationEdges .student-destination-edge').evaluateAll(paths => paths.map(path => {
    const start = path.getPointAtLength(0);
    const end = path.getPointAtLength(path.getTotalLength());
    return {
      flow: path.dataset.flow,
      side: path.dataset.side,
      color: getComputedStyle(path).stroke,
      markerStart: path.getAttribute('marker-start'),
      markerEnd: path.getAttribute('marker-end'),
      start: { x: start.x, y: start.y },
      end: { x: end.x, y: end.y }
    };
  }));
  expect(new Set(destinationSemantics.map(edge => edge.color)).size).toBeGreaterThan(1);
  destinationSemantics.forEach(edge => {
    expect(['outgoing', 'incoming', 'through', 'neutral']).toContain(edge.flow);
    expect(edge.markerStart).toBeNull();
    expect(edge.markerEnd).toContain(edge.flow);
  });
  ['left', 'right'].forEach(side => {
    const edges = destinationSemantics.filter(edge => edge.side === side).sort((a, b) => a.end.y - b.end.y);
    for (let index = 1; index < edges.length; index += 1) expect(edges[index].start.y).toBeGreaterThanOrEqual(edges[index - 1].start.y);
  });
  await page.locator('#studentDestinationPanel').screenshot({ path: 'output/playwright/student-destination-direction-colors.png' });

  await page.locator('.student-map-stage').scrollIntoViewIfNeeded();
  await page.locator('#studentMapEdges .student-map-edge[data-step-index="2"]').dispatchEvent('click');
  await expect(page.locator('#studentMapCurrent')).toHaveText('果糖-6-磷酸');
  await expect(page.locator('#studentMapNext')).toHaveText('果糖-1,6-二磷酸');
  await expect(page.locator('#studentMapEdges .student-map-edge.is-next')).toHaveCount(1);
  await expect(page.locator('#studentMapEdges .student-map-edge.active')).toHaveCount(1);
  const toolbarTextSizes = await page.locator('.student-map-toolbar').evaluate(toolbar => ({
    toolbar: parseFloat(getComputedStyle(toolbar).fontSize),
    reading: parseFloat(getComputedStyle(toolbar.querySelector('.student-map-reading')).fontSize),
    legend: parseFloat(getComputedStyle(toolbar.querySelector('.student-map-legend')).fontSize),
    toggle: parseFloat(getComputedStyle(toolbar.querySelector('.student-reaction-toggle')).fontSize)
  }));
  expect(toolbarTextSizes.toolbar).toBeGreaterThanOrEqual(12);
  expect(toolbarTextSizes.reading).toBeGreaterThanOrEqual(12);
  expect(toolbarTextSizes.legend).toBeGreaterThanOrEqual(11);
  expect(toolbarTextSizes.toggle).toBeGreaterThanOrEqual(11);
  await page.locator('.student-map-toolbar').screenshot({ path: 'output/playwright/student-map-toolbar-readable.png' });

  await page.locator('#studentReactions .student-reaction', { hasText: '果糖-6-磷酸 + ATP' }).click();
  const beginnerNote = studentDetail.locator('.student-reaction-note');
  await expect(beginnerNote).toContainText('做什么');
  await expect(beginnerNote.locator('.note-source')).toHaveText('人工精讲');
  await expect(beginnerNote).toContainText('为什么');
  await expect(beginnerNote).toContainText('记忆点');
  const noteBeforeEquation = await studentDetail.evaluate(detail => {
    const note = detail.querySelector('.student-reaction-note');
    const equation = detail.querySelector('.equation-summary');
    return Boolean(note && equation && (note.compareDocumentPosition(equation) & Node.DOCUMENT_POSITION_FOLLOWING));
  });
  expect(noteBeforeEquation).toBe(true);
  await expect(studentDetail.locator('.enzyme-summary strong')).not.toHaveText('—');
  await expect(studentDetail.locator('.student-enzyme-more')).not.toHaveAttribute('open', '');
  await expect(studentDetail.locator('.student-enzyme-facts')).not.toBeVisible();
  await studentDetail.locator('.student-enzyme-more summary').click();
  await expect(studentDetail.locator('.student-enzyme-facts')).toBeVisible();
  await expect(studentDetail.locator('.student-enzyme-facts')).toContainText('结构');
  await expect(studentDetail.locator('.student-enzyme-facts')).toContainText('辅酶 / 辅因子');
  await expect(studentDetail.locator('.student-learning-card')).toHaveCount(0);

  const convention = page.locator('.student-map-conventions');
  await expect(convention).not.toHaveAttribute('open', '');
  await convention.locator('summary').click();
  await expect(convention).toContainText('不应重复计算为额外一步');

  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'gluconeogenesis';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.locator('#studentReactionToggle').click();
  await page.locator('#studentReactions .student-reaction').first().click();
  const gluconeogenesisNote = page.locator('#studentDetail .student-reaction-note');
  await expect(gluconeogenesisNote).not.toHaveClass(/generated/);
  await expect(gluconeogenesisNote.locator('.note-source')).toHaveText('人工精讲');

  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'fa_synthesis';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.locator('#studentReactionToggle').click();
  await page.locator('#studentReactions .student-reaction').first().click();
  const faSynthesisNote = page.locator('#studentDetail .student-reaction-note');
  await expect(faSynthesisNote).not.toHaveClass(/generated/);
  await expect(faSynthesisNote.locator('.note-source')).toHaveText('人工精讲');

  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'glycolysis';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.locator('#studentReactionToggle').click();

  await page.locator('#studentReactions .student-reaction', { hasText: '1,3-二磷酸甘油酸 + ADP' }).click();
  await expect(studentDetail.locator('.student-detail-statuses .direction')).toContainText('可逆');
  expect(pageErrors).toEqual([]);

  await page.setViewportSize({ width: 390, height: 844 });
  await studentDetail.evaluate(element => element.scrollIntoView({ block: 'start' }));
  const hasMobilePageOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(hasMobilePageOverflow).toBe(false);
  await studentDetail.screenshot({ path: 'output/playwright/student-reaction-learning-panel-mobile.png' });
});

test('PDH lesson centers the E1 E2 E3 relay instead of membrane transport', async ({ page }) => {
  await page.goto(appUrl('student-pdh-focus-1'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'pdh';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const nodes = page.locator('#studentMapNodes .student-map-node[data-step-index]');
  await expect(nodes).toHaveCount(5);
  await expect(nodes.nth(0)).toContainText('丙酮酸（3 碳）');
  await expect(nodes.nth(1)).toContainText('丙酮酸脱氢酶（E1）');
  await expect(nodes.nth(1)).toContainText('脱羧并释放 CO₂');
  await expect(nodes.nth(2)).toContainText('二氢硫辛酰转乙酰酶（E2）');
  await expect(nodes.nth(2)).toContainText('转移乙酰基');
  await expect(nodes.nth(3)).toContainText('二氢硫辛酰脱氢酶（E3）');
  await expect(nodes.nth(3)).toContainText('使辅酶再生');
  await expect(page.locator('#studentMapNodes')).not.toContainText('VDAC');
  await expect(page.locator('#studentMapNodes')).not.toContainText('MPC');
  await expect(page.locator('#studentPdhMechanism')).toBeVisible();
  await expect(page.locator('#studentPdhMechanism')).toContainText('丙酮酸脱氢酶复合体的催化循环');
  await expect(page.locator('#studentPdhMechanism')).toContainText('焦磷酸硫胺素（TPP）');
  await expect(page.locator('#studentPdhMechanism')).toContainText('丙酮酸（3 碳）→ 羟乙基-TPP + CO₂');
  await expect(page.locator('#studentPdhMechanism')).toContainText('羟乙基-TPP → 乙酰-硫辛酰胺');
  await expect(page.locator('#studentPdhMechanism')).toContainText('辅酶 A（CoA-SH）→ 乙酰辅酶 A');
  await expect(page.locator('#studentPdhMechanism')).toContainText('NAD⁺ → NADH + H⁺');
  await expect(page.locator('#student-arrow')).toHaveAttribute('markerWidth', String(TEST_CONTRACTS.studentArrowMarkerWidth));
  const mainStrokeWidth = await page.locator('#studentMapEdges .student-map-edge').first().evaluate(edge => parseFloat(getComputedStyle(edge).strokeWidth));
  expect(mainStrokeWidth).toBeGreaterThanOrEqual(3);
  await page.locator('.student-map-stage').screenshot({ path: 'output/playwright/student-pdh-mechanism-map.png' });

  await page.locator('#studentReactionToggle').click();
  await page.locator('#studentReactions .student-reaction').first().click();
  const detail = page.locator('#studentDetail');
  await expect(detail.locator('.student-reaction-note')).toContainText('丙酮酸脱氢酶（E1）用焦磷酸硫胺素（TPP）脱羧');
  await expect(detail.locator('.student-enzyme-more')).toHaveAttribute('open', '');
  await expect(detail.locator('.student-enzyme-more summary')).toHaveText('PDH 复合体结构与五种辅酶（本课重点）');
  await expect(detail.locator('.student-enzyme-facts')).toContainText('E1、E2、E3');
  await detail.scrollIntoViewIfNeeded();
  await detail.screenshot({ path: 'output/playwright/student-pdh-focus.png' });
});

test('all beginner pathway nodes use full names instead of unexplained abbreviations', async ({ page }) => {
  await page.goto(appUrl('student-full-node-names-1'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  const pathwayIds = await page.locator('#studentPathwaySelect option').evaluateAll(options => options.map(option => option.value).filter(Boolean));
  const forbiddenBareLabels = new Set([
    'ATP', 'ADP', 'NADH', 'NAD⁺', 'NADPH', 'FAD', 'FADH₂', 'ANT', 'GAR', 'AICAR',
    'GMP', 'GTP', 'PRPP', 'IMP', 'AMP', 'CTP', 'UDP', 'UMP', 'UTP', 'dTMP',
    'CPT1', 'CACT', 'CPT2', 'NH₄⁺', 'HMG-CoA', '脂酰-CoA', '烯酰-CoA'
  ]);

  for (const pathwayId of pathwayIds) {
    await page.locator('#studentPathwaySelect').evaluate((select, value) => {
      select.value = value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }, pathwayId);
    const labels = await page.locator('#studentMapNodes .node-name').allTextContents();
    expect(labels.filter(label => forbiddenBareLabels.has(label)), pathwayId).toEqual([]);
  }

  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'purine';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await expect(page.locator('#studentMapNodes')).toContainText('甘氨酰胺核糖核苷酸');
  await expect(page.locator('#studentMapNodes')).toContainText('5-氨基咪唑-4-甲酰胺核糖核苷酸');
  await expect(page.locator('#studentMapNodes')).toContainText('鸟苷一磷酸');
});

test('glycogen synthesis includes primer formation, chain extension, and branching', async ({ page }) => {
  await page.goto(appUrl('student-glycogenesis-complete-1'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'glycogenesis';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await expect(page.locator('#studentMapNodes .student-map-node[data-step-index]')).toHaveCount(7);
  await expect(page.locator('#studentMapNodes')).toContainText('糖原素引物');
  await expect(page.locator('#studentMapNodes')).toContainText('线性糖原');
  await expect(page.locator('#studentPrimer')).toContainText('焦磷酸被水解');
  await expect(page.locator('#studentPrimer')).toContainText('α-1,6 分支');

  await page.locator('#studentReactionToggle').click();
  await expect(page.locator('#studentReactions .student-reaction')).toHaveCount(6);
  await expect(page.locator('#studentReactions')).toContainText('糖原素 + n UDP-葡萄糖');
  await expect(page.locator('#studentReactions')).toContainText('线性糖原');
});

test('glycogen breakdown teaches the phosphorylase and debranching-enzyme handoff', async ({ page }) => {
  await page.goto(appUrl('student-glycogenolysis-complete-1'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'glycogenolysis';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await expect(page.locator('#studentMapNodes')).toContainText('极限糊精');
  await expect(page.locator('#studentMapNodes')).toContainText('去分支糖原');
  await expect(page.locator('#studentPrimer')).toContainText('转移三个残基');
  await expect(page.locator('#studentPrimer')).toContainText('α-1,6');

  await page.locator('#studentReactionToggle').click();
  await expect(page.locator('#studentReactions')).toContainText('极限糊精 + H₂O');
  await page.locator('#studentReactions .student-reaction', { hasText: '极限糊精 + H₂O' }).click();
  await expect(page.locator('#studentDetail')).toContainText('糖原去分支酶');
});

test('gluconeogenesis foregrounds all three irreversible-step bypasses', async ({ page }) => {
  await page.goto(appUrl('student-gluconeogenesis-bypasses-1'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'gluconeogenesis';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await expect(page.locator('#studentMapNodes')).toContainText('草酰乙酸');
  await expect(page.locator('#studentMapNodes')).toContainText('磷酸烯醇式丙酮酸');
  await expect(page.locator('#studentPrimer')).toContainText('丙酮酸羧化酶');
  await expect(page.locator('#studentPrimer')).toContainText('果糖-1,6-二磷酸酶-1');
  await expect(page.locator('#studentPrimer')).toContainText('葡萄糖-6-磷酸酶');
});

test('amino acid lessons distinguish real reactions, representation edges, and category maps', async ({ page }) => {
  await page.goto(appUrl('student-amino-acid-notes-1'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();

  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'transamination';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.locator('#studentReactionToggle').click();
  await page.locator('#studentReactions .student-reaction').first().click();
  await expect(page.locator('#studentDetail .note-source')).toHaveText('人工精讲');
  await expect(page.locator('#studentDetail')).toContainText('磷酸吡哆醛（PLP）');

  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'urea';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.locator('#studentReactionToggle').click();
  await page.locator('#studentReactions .student-reaction', { hasText: 'NH₄⁺ + CO₂ + 2 ATP' }).click();
  await expect(page.locator('#studentDetail')).toContainText('N-乙酰谷氨酸');
  await page.locator('#studentReactions .student-reaction', { hasText: '氨甲酰磷酸 + 鸟氨酸' }).nth(1).click();
  await expect(page.locator('#studentDetail')).toContainText('不是额外一步');

  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'aa_carbon';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.locator('#studentReactionToggle').click();
  await page.locator('#studentReactions .student-reaction').first().click();
  await expect(page.locator('#studentDetail')).toContainText('碳骨架归宿总览，不是一条酶催化的一步反应');
});

test('high fan-out scene links stay ordered and avoid unrelated cards', async ({ page }) => {
  await page.goto(appUrl('student-high-fanout-routing-1'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'glycolysis';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.locator('#studentReactionToggle').click();
  await page.locator('#studentReactions .student-reaction', { hasText: '1,3-二磷酸甘油酸 + ADP' }).click();
  await page.locator('.student-detail-more summary').click();
  await page.locator('.student-participant').filter({ hasText: /^ATP/ }).first().click();

  const panel = page.locator('#studentDestinationPanel');
  await expect(panel).toBeVisible();
  const edgeCount = await panel.locator('.student-destination-edge').count();
  expect(edgeCount).toBeGreaterThan(15);
  await expect(panel.locator('.student-destination-stage')).toHaveClass(/is-scrollable/);
  const trunkCount = await panel.locator('.student-destination-bundle.trunk').count();
  expect(trunkCount).toBeGreaterThan(0);
  expect(trunkCount).toBeLessThanOrEqual(4);

  const audit = await panel.evaluate(root => {
    const paths = [...root.querySelectorAll('#studentDestinationEdges .student-destination-edge')];
    const targetNodes = [...root.querySelectorAll('#studentDestinationNodes .student-destination-node:not(.source)')];
    const orderFailures = [];
    const cardHits = [];
    ['left', 'right'].forEach(side => {
      const entries = paths.filter(path => path.dataset.side === side && !path.classList.contains('transport')).map(path => ({
        startY: path.getPointAtLength(0).y,
        endY: path.getPointAtLength(path.getTotalLength()).y
      })).sort((a, b) => a.endY - b.endY);
      for (let index = 1; index < entries.length; index += 1) {
        if (entries[index].startY + .01 < entries[index - 1].startY) orderFailures.push(side);
      }
    });
    paths.forEach((path, pathIndex) => {
      const length = path.getTotalLength();
      for (let sample = 1; sample < 20; sample += 1) {
        const point = path.getPointAtLength(length * sample / 20);
        targetNodes.forEach((node, nodeIndex) => {
          if (nodeIndex === pathIndex) return;
          const box = node.querySelector('rect').getBBox();
          if (point.x > box.x && point.x < box.x + box.width && point.y > box.y && point.y < box.y + box.height) cardHits.push(`${pathIndex}:${nodeIndex}`);
        });
      }
    });
    const transportEdges = paths.filter(path => path.classList.contains('transport')).map(path => ({
      dash: getComputedStyle(path).strokeDasharray,
      markerStart: path.getAttribute('marker-start'),
      markerEnd: path.getAttribute('marker-end')
    }));
    return { orderFailures, cardHits, transportEdges };
  });
  expect(audit.orderFailures).toEqual([]);
  expect(audit.cardHits).toEqual([]);
  expect(audit.transportEdges.length).toBeGreaterThan(0);
  audit.transportEdges.forEach(edge => {
    expect(edge.dash).toBe('none');
    expect(edge.markerStart).toBeNull();
    expect(edge.markerEnd).toContain('arrow-');
  });
  await panel.screenshot({ path: 'output/playwright/student-destination-high-fanout.png' });
});

test('composite serine synthesis shows three enzymes and hides database ids', async ({ page }) => {
  await page.goto(appUrl('student-composite-serine-1'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.locator('#studentPathwaySelect').evaluate(select => {
    const archived = document.createElement('option');
    archived.value = 'aa_biosynthesis';
    archived.textContent = '非必需氨基酸合成（底层回归）';
    select.appendChild(archived);
    select.value = 'aa_biosynthesis';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.locator('#studentReactionToggle').click();
  await page.locator('#studentReactions .student-reaction', { hasText: '3-磷酸甘油酸 + NAD⁺' }).click();

  const detail = page.locator('#studentDetail');
  await expect(detail.locator('.student-detail-description')).not.toContainText(/KEGG|RHEA|Reactome|R-HSA/);
  await expect(detail.locator('.student-detail-statuses .direction')).toHaveText('→ 合并后的净方向');
  await expect(detail.locator('.student-detail-basic.equation-summary > span')).toHaveText('总反应式');
  await expect(detail.locator('.student-composite-step')).toHaveCount(3);
  await expect(detail.locator('.student-composite-step').nth(0)).toContainText('PHGDH');
  await expect(detail.locator('.student-composite-step').nth(0)).toContainText('⇌');
  await expect(detail.locator('.student-composite-step').nth(1)).toContainText('PSAT1');
  await expect(detail.locator('.student-composite-step').nth(1)).toContainText('⇌');
  await expect(detail.locator('.student-composite-step').nth(2)).toContainText('PSPH');
  await expect(detail.locator('.student-composite-step').nth(2)).toContainText('→');
  await expect(detail.locator('.student-composite-note')).toContainText('不能把“净方向”理解成三步全部不可逆');

  const evidence = detail.locator('.student-evidence');
  await expect(evidence.locator('summary')).toHaveText('查看依据（7 条）');
  await expect(evidence).not.toHaveAttribute('open', '');
  await expect(evidence.locator('a').first()).not.toBeVisible();
  await evidence.locator('summary').click();
  await expect(evidence.locator('a')).toHaveCount(7);
  await expect(evidence.locator('a').first()).toBeVisible();
  await expect(evidence.locator('a', { hasText: 'KEGG R01513' })).toHaveAttribute('href', 'https://www.kegg.jp/entry/R01513');
  await detail.screenshot({ path: 'output/playwright/student-composite-serine.png' });
});

test('all student reaction summaries keep database ids inside closed evidence disclosures', async ({ page }) => {
  await page.goto(appUrl('student-evidence-disclosure-audit-1'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  const audit = await page.evaluate(() => {
    const select = document.querySelector('#studentPathwaySelect');
    const toggle = document.querySelector('#studentReactionToggle');
    const failures = [];
    let reactionViews = 0;
    let evidenceViews = 0;
    [...select.options].forEach(option => {
      select.value = option.value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      toggle.click();
      [...document.querySelectorAll('#studentReactions .student-reaction')].forEach((button, index) => {
        button.click();
        reactionViews += 1;
        const description = document.querySelector('#studentDetail .student-detail-description')?.textContent || '';
        if (/(?:KEGG\s*:|RHEA\s*:|Reactome\s+R-|UniProt\s*:|R-HSA-)/i.test(description)) failures.push(`${option.value}:${index}:编号泄漏`);
        const disclosure = document.querySelector('#studentDetail .student-evidence');
        if (disclosure) {
          evidenceViews += 1;
          if (disclosure.open) failures.push(`${option.value}:${index}:依据默认展开`);
        }
      });
    });
    return { failures, reactionViews, evidenceViews };
  });
  expect(audit.reactionViews).toBeGreaterThan(180);
  expect(audit.evidenceViews).toBeGreaterThan(10);
  expect(audit.failures).toEqual([]);
});

test('all compiled reactions expose enzyme facts and readable equations', async ({ page }) => {
  await page.goto(appUrl('student-enzyme-facts-audit-1'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  const audit = await page.evaluate(() => {
    const select = document.querySelector('#studentPathwaySelect');
    const failures = [];
    const reactionIds = new Set();
    let reactionViews = 0;
    Object.keys(window.METABOLIC_COMPILED.pathwayMeta).forEach(pathwayId => {
      if ([...select.options].some(option => option.value === pathwayId)) return;
      const option = document.createElement('option');
      option.value = pathwayId;
      option.textContent = window.METABOLIC_COMPILED.pathwayMeta[pathwayId].label;
      select.appendChild(option);
    });
    [...select.options].forEach(option => {
      select.value = option.value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      if (document.querySelector('#studentReactionIndex').hidden) document.querySelector('#studentReactionToggle').click();
      [...document.querySelectorAll('#studentReactions .student-reaction')].forEach((button, index) => {
        button.click();
        reactionViews += 1;
        reactionIds.add(button.dataset.reaction);
        const structure = document.querySelector('#studentDetail .student-enzyme-facts p:first-child b')?.textContent?.trim() || '';
        const factors = document.querySelector('#studentDetail .student-enzyme-facts p:last-child b')?.textContent?.trim() || '';
        const equation = document.querySelector('#studentDetail .equation-summary .reaction-equation-lines');
        if (!structure || /未知|待补/.test(structure)) failures.push(`${option.value}:${index}:结构`);
        if (!factors || /未知|待补/.test(factors)) failures.push(`${option.value}:${index}:辅因子`);
        if (!equation || !equation.querySelector('.reaction-equation-line')) failures.push(`${option.value}:${index}:反应式`);
      });
    });
    return { failures, reactionViews, uniqueReactions: reactionIds.size, compiledReactions: window.METABOLIC_COMPILED.reactions.length };
  });
  expect(audit.reactionViews).toBeGreaterThanOrEqual(audit.compiledReactions);
  expect(audit.uniqueReactions).toBe(audit.compiledReactions);
  expect(audit.failures).toEqual([]);

  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'pdh';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.locator('#studentReactionToggle').click();
  await page.locator('#studentReactions .student-reaction').first().click();
  const facts = page.locator('#studentDetail .student-enzyme-facts');
  await expect(facts).toContainText('E1、E2、E3');
  await expect(facts).toContainText('TPP');
  await expect(facts).toContainText('硫辛酰胺');
  await expect(facts).toContainText('FAD');
  await expect(facts).toContainText('CoA');
  await expect(facts).toContainText('NAD⁺');
});

test('cross-compartment reactions expose both endpoint compartments', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(appUrl('student-cross-compartment-detail-1'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'gluconeogenesis';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.locator('#studentReactionToggle').click();
  await page.locator('#studentReactions .student-reaction', { hasText: '丙酮酸胞质 ⇌ 丙酮酸膜间隙' }).click();

  const detail = page.locator('#studentDetail');
  await expect(detail.getByRole('heading', { level: 3 })).toHaveText('丙酮酸（细胞质） ⇌ 丙酮酸（线粒体膜间隙）');
  await expect(detail.locator('.student-detail-statuses .direction')).toHaveText('⇌ 可逆转运');
  await expect(detail.locator('.student-detail-statuses .transport')).toHaveText('细胞质 ⇌ 线粒体膜间隙');
  await expect(detail.locator('.equation-summary .reaction-equation-lines')).toHaveAttribute('aria-label', '丙酮酸胞质 ⇌ 丙酮酸膜间隙');
  await detail.locator('.student-detail-header').screenshot({ path: 'output/playwright/student-cross-compartment-detail.png' });
  expect(pageErrors).toEqual([]);
});
