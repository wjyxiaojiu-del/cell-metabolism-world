const { test, expect, appUrl } = require('./helpers.js');

test('all learning steps link to a metabolite or a representative reaction', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(appUrl('student-step-links-1'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await expect(page.locator('#studentWorkspace')).toBeVisible();

  const pathwayIds = await page.locator('#studentPathwaySelect option').evaluateAll(options => options.map(option => option.value));
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

  expect(totals.steps).toBe(115);
  expect(totals.disabled).toBe(0);
  expect(totals.metabolite + totals.enzyme + totals.process).toBe(totals.steps);
  expect(totals.enzyme).toBeGreaterThan(0);
  expect(totals.process).toBeGreaterThan(0);
  expect(boundaryFailures).toEqual([]);
  expect(pageErrors).toEqual([]);
});
