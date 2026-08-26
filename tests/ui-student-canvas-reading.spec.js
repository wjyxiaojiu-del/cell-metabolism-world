const { test, expect, appUrl } = require('./helpers.js');

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
  await expect(mainNodes).toHaveCount(10);
  await expect(mainNodes.nth(4)).toContainText('磷酸二羟丙酮');
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
  await expect(studentDetail.locator('.student-detail-count')).toHaveText(/1 \/ \d+通路内反应/);
  await expect(studentDetail.locator('[data-student-detail-nav="-1"]')).toBeDisabled();
  await expect(studentDetail.locator('[data-student-detail-nav="1"]')).toBeEnabled();
  await studentDetail.locator('[data-student-detail-nav="1"]').click();
  await expect(detailTitle).not.toHaveText(initialDetailTitle);
  await expect(studentDetail.locator('.student-detail-count')).toHaveText(/2 \/ \d+通路内反应/);
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
  await expect(page.locator('.student-destination-legend')).toContainText('流入该通路');
  await expect(page.locator('.student-destination-legend')).toContainText('由该通路生成');
  await expect(page.locator('.student-destination-legend')).toContainText('通路中间体');
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
    if (edge.flow === 'incoming') { expect(edge.markerStart).toContain('incoming'); expect(edge.markerEnd).toBeNull(); }
    if (edge.flow === 'outgoing') { expect(edge.markerStart).toBeNull(); expect(edge.markerEnd).toContain('outgoing'); }
    if (edge.flow === 'through') { expect(edge.markerStart).toContain('through'); expect(edge.markerEnd).toContain('through'); }
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
  await expect(studentDetail.locator('.enzyme-summary strong')).not.toHaveText('—');
  await expect(studentDetail.locator('.student-enzyme-facts')).toContainText('结构');
  await expect(studentDetail.locator('.student-enzyme-facts')).toContainText('辅酶 / 辅因子');
  await expect(studentDetail.locator('.student-learning-card')).toHaveCount(0);

  await page.locator('#studentReactions .student-reaction', { hasText: '1,3-二磷酸甘油酸 + ADP' }).click();
  await expect(studentDetail.locator('.student-detail-statuses .direction')).toContainText('可逆');
  expect(pageErrors).toEqual([]);

  await page.setViewportSize({ width: 390, height: 844 });
  await studentDetail.evaluate(element => element.scrollIntoView({ block: 'start' }));
  const hasMobilePageOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(hasMobilePageOverflow).toBe(false);
  await studentDetail.screenshot({ path: 'output/playwright/student-reaction-learning-panel-mobile.png' });
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
      const entries = paths.filter(path => path.dataset.side === side).map(path => ({
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
    return { orderFailures, cardHits };
  });
  expect(audit.orderFailures).toEqual([]);
  expect(audit.cardHits).toEqual([]);
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
    return { failures, reactionViews, uniqueReactions: reactionIds.size, expectedReactions: window.METABOLIC_COMPILED.reactions.length };
  });
  expect(audit.reactionViews).toBeGreaterThanOrEqual(audit.expectedReactions);
  expect(audit.uniqueReactions).toBe(audit.expectedReactions);
  expect(audit.failures).toEqual([]);

  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'pdh';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.locator('#studentReactionToggle').click();
  await page.locator('#studentReactions .student-reaction', { hasText: /乙酰-?辅酶/ }).click();
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
