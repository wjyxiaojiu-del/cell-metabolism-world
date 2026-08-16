const { test, expect, appUrl } = require('./helpers.js');

test('expert map skips missing endpoints and treats labels as text', async ({ page }) => {
  const pageErrors = [];
  const warnings = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'warning') warnings.push(message.text()); });
  await page.route('**/data-compiled-core.js*', async route => {
    const response = await route.fetch();
    const body = await response.text();
    await route.fulfill({
      response,
      body: `${body}\nwindow.METABOLIC_COMPILED.entities[0].label = '<a id="expertInjectionProbe">bad</a>';\nwindow.METABOLIC_COMPILED.reactions.push({ id: 'rx-missing-endpoint', from: 'missing@cytosol', to: window.METABOLIC_COMPILED.entities[0].id, group: 'glycolysis', enzyme: '测试酶', equation: 'missing → test', reversible: false });`
    });
  });

  await page.goto(appUrl('expert-resilience-1'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.getByRole('button', { name: '专家地图', exact: true }).click();
  // 扩展通路在重点总览中按产品范围隐藏；断言使用仍应可见的核心线路。
  await expect(page.locator('#routeLayer .route:not(.route-extended)').first()).toBeVisible();
  await expect(page.locator('#routeLayer [data-id="rx-missing-endpoint"]')).toHaveCount(0);
  await expect(page.locator('#enzymeLayer [data-id="rx-missing-endpoint"]')).toHaveCount(0);
  await expect(page.locator('#expertInjectionProbe')).toHaveCount(0);
  await expect(page.locator('#entityLayer .entity-label').first()).toHaveText('<a id="expertInjectionProbe">bad</a>');
  expect(warnings.some(message => message.includes('rx-missing-endpoint'))).toBe(true);
  expect(pageErrors).toEqual([]);
});
