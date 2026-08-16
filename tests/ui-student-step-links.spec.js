const { test, expect, appUrl } = require('./helpers.js');

test('all learning steps link to a metabolite or a representative reaction', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(appUrl('student-step-links-1'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await expect(page.locator('#studentWorkspace')).toBeVisible();

  const pathwayIds = await page.locator('#studentPathwaySelect option').evaluateAll(options => options.map(option => option.value));
  const expectedSteps = await page.evaluate(ids => ids.reduce((sum, id) => (
    sum + (window.METABOLIC_ATLAS_DATA?.pathways?.[id]?.steps?.length || 0)
  ), 0), pathwayIds);
  const totals = { steps: 0, disabled: 0, metabolite: 0, enzyme: 0, process: 0 };
  const boundaryFailures = [];
  for (const pathwayId of pathwayIds) {
    await page.locator('#studentPathwaySelect').evaluate((select, value) => {
      select.value = value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }, pathwayId);
    const counts = await page.locator('#flowSteps').evaluate(root => ({
      steps: root.querySelectorAll('.flow-step').length,
      disabled: root.querySelectorAll('.flow-step:disabled').length,
      metabolite: root.querySelectorAll('.flow-step[data-step-kind="metabolite"]').length,
      enzyme: root.querySelectorAll('.flow-step[data-step-kind="enzyme"]').length,
      process: root.querySelectorAll('.flow-step[data-step-kind="process"]').length
    }));
    Object.keys(totals).forEach(key => { totals[key] += counts[key]; });
    const boundaries = await page.locator('#studentPathwayMap').evaluate((svg, id) => {
      const viewBox = svg.viewBox.baseVal;
      const failures = [];
      svg.querySelectorAll('#studentMapNodes .student-map-node').forEach(node => {
        const rect = node.querySelector('rect');
        const label = node.querySelector('.node-name');
        if (!rect || !label) return;
        const rectBox = rect.getBBox();
        const labelBox = label.getBBox();
        if (labelBox.x < rectBox.x - .5 || labelBox.x + labelBox.width > rectBox.x + rectBox.width + .5) {
          failures.push(`${id}:文字:${node.getAttribute('aria-label')}`);
        }
        if (rectBox.x < viewBox.x || rectBox.y < viewBox.y
          || rectBox.x + rectBox.width > viewBox.x + viewBox.width
          || rectBox.y + rectBox.height > viewBox.y + viewBox.height) {
          failures.push(`${id}:节点:${node.getAttribute('aria-label')}`);
        }
      });
      return failures;
    }, pathwayId);
    boundaryFailures.push(...boundaries);
  }

  expect(totals.steps).toBe(expectedSteps);
  expect(totals.disabled).toBe(0);
  expect(totals.metabolite + totals.enzyme + totals.process).toBe(totals.steps);
  expect(totals.enzyme).toBeGreaterThan(0);
  expect(totals.process).toBeGreaterThan(0);
  expect(boundaryFailures).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test('look-alike enzyme names resolve to the intended reaction', async ({ page }) => {
  await page.goto(appUrl('student-step-semantic-links-1'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  const selectPathway = async pathwayId => {
    await page.locator('#studentPathwaySelect').evaluate((select, value) => {
      select.value = value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }, pathwayId);
  };
  const expectStepEnzyme = async (stepName, enzymeName) => {
    await page.locator('#flowSteps .flow-step', { hasText: stepName }).first().evaluate(button => button.click());
    await expect(page.locator('#studentDetail .enzyme-summary strong')).toContainText(enzymeName);
  };

  await selectPathway('etc');
  await expectStepEnzyme('呼吸链复合体 III', '复合体 III');
  await expectStepEnzyme('呼吸链复合体 IV', '复合体 IV');

  await selectPathway('oxphos');
  await expectStepEnzyme('质子通过三磷酸腺苷合酶', 'ATP 合酶');
  await expectStepEnzyme('腺嘌呤核苷酸转位酶（ANT）', '腺嘌呤核苷酸转位酶');

  await selectPathway('carnitine');
  await expectStepEnzyme('肉碱-脂酰肉碱转位酶（CACT）', '肉碱-脂酰肉碱转位酶');
});

test('cross-pathway transport steps never fall back to an unrelated reaction', async ({ page }) => {
  await page.goto(appUrl('student-step-cross-pathway-1'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  const crossPathwayResolution = await page.evaluate(() => {
    const atlas = window.METABOLIC_ATLAS_DATA;
    const compiled = window.METABOLIC_COMPILED;
    const options = {
      pathwayId: 'pdh',
      pathway: atlas.pathways.pdh,
      routeGroup: 'pdh',
      entities: compiled.entities,
      reactions: compiled.reactions,
      entityById: Object.fromEntries(compiled.entities.map(entity => [entity.id, entity]))
    };
    return ['电压依赖性阴离子通道（VDAC）', '线粒体丙酮酸载体（MPC）'].map(step => {
      const result = window.STUDENT_STEP_RESOLVER.resolveStep({ ...options, step });
      return { step, kind: result.kind, reaction: result.reaction?.enzyme || null };
    });
  });
  expect(crossPathwayResolution).toEqual([
    { step: '电压依赖性阴离子通道（VDAC）', kind: 'enzyme', reaction: 'VDAC 外膜通道' },
    { step: '线粒体丙酮酸载体（MPC）', kind: 'enzyme', reaction: '线粒体丙酮酸载体 MPC' }
  ]);
  const h2o2Resolution = await page.evaluate(() => {
    const atlas = window.METABOLIC_ATLAS_DATA;
    const compiled = window.METABOLIC_COMPILED;
    const result = window.STUDENT_STEP_RESOLVER.resolveStep({
      pathwayId: 'vlcfa', pathway: atlas.pathways.vlcfa, routeGroup: 'vlcfa',
      step: '过氧化氢（H₂O₂）', entities: compiled.entities, reactions: compiled.reactions,
      entityById: Object.fromEntries(compiled.entities.map(entity => [entity.id, entity]))
    });
    return { kind: result.kind, entity: result.entity?.id || null, reaction: result.reaction?.enzyme || null };
  });
  expect(h2o2Resolution).toEqual({ kind: 'metabolite', entity: 'H₂O₂@peroxisome', reaction: '过氧化氢酶' });

  const exchangeResolution = await page.evaluate(() => {
    const atlas = window.METABOLIC_ATLAS_DATA;
    const compiled = window.METABOLIC_COMPILED;
    const result = window.STUDENT_STEP_RESOLVER.resolveStep({
      pathwayId: 'transport', pathway: atlas.pathways.transport, routeGroup: 'transport',
      step: '核苷酸与磷酸交换', entities: compiled.entities, reactions: compiled.reactions,
      entityById: Object.fromEntries(compiled.entities.map(entity => [entity.id, entity]))
    });
    return { kind: result.kind, entity: result.entity?.id || null, reaction: result.reaction?.enzyme || null };
  });
  expect(exchangeResolution).toEqual({ kind: 'process', entity: null, reaction: null });
});

test('student search expands resolver aliases and protects word boundaries', async ({ page }) => {
  await page.goto(appUrl('student-search-boundaries-1'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  const search = page.getByRole('textbox', { name: '搜索代谢知识实体' });

  await search.fill('G1P');
  await search.press('Enter');
  await expect(page.locator('body')).toHaveClass(/student-mode/);
  await expect(page.locator('#searchStatus')).toContainText('葡萄糖-1-磷酸');

  await search.fill('UDP-Glc');
  await search.press('Enter');
  await expect(page.locator('body')).toHaveClass(/student-mode/);
  await expect(page.locator('#searchStatus')).toContainText('UDP-葡萄糖');

  const pathwayBeforeSam = await page.locator('#studentPathwaySelect').inputValue();
  await search.fill('SAM');
  await search.press('Enter');
  await expect(page.locator('body')).toHaveClass(/student-mode/);
  await expect(page.locator('#searchStatus')).toContainText('再次按 Enter');
  await expect(page.locator('#studentPathwaySelect')).toHaveValue(pathwayBeforeSam);
});
