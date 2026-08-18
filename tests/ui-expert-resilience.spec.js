const { test, expect, appUrl } = require('./helpers.js');

test('expert map skips missing endpoints and treats labels as text', async ({ page }) => {
  const pageErrors = [];
  const warnings = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'warning') warnings.push(message.text()); });
  await page.route('**/data-compiled.js*', async route => {
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
  await expect(page.locator('#routeLayer .route').first()).toBeVisible();
  await expect(page.locator('#routeLayer [data-id="rx-missing-endpoint"]')).toHaveCount(0);
  await expect(page.locator('#enzymeLayer [data-id="rx-missing-endpoint"]')).toHaveCount(0);
  await expect(page.locator('#expertInjectionProbe')).toHaveCount(0);
  await expect(page.locator('#entityLayer .entity-label').first()).toHaveText('<a id="expertInjectionProbe">bad</a>');
  expect(warnings.some(message => message.includes('rx-missing-endpoint'))).toBe(true);
  expect(pageErrors).toEqual([]);
});

test('clearing an expert pathway restores overview before the next focus', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(appUrl('expert-clear-selection-regression'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.getByRole('button', { name: '专家地图', exact: true }).click();

  await page.locator('.path-filter[data-path="tca"]').click();
  await expect(page.locator('body')).toHaveClass(/pathway-focus/);
  await expect(page.locator('.path-filter[data-path="tca"]')).toHaveClass(/active/);

  await page.locator('#clearBtn').click();
  await page.waitForTimeout(420);
  await expect(page.locator('body')).not.toHaveClass(/pathway-focus/);
  await expect(page.locator('.path-filter[data-path="all"]')).toHaveClass(/active/);
  await expect(page.locator('.path-filter[data-path="tca"]')).not.toHaveClass(/active/);

  await page.locator('.path-filter[data-path="pdh"]').click();
  await expect(page.locator('body')).toHaveClass(/pathway-focus/);
  await expect(page.locator('.path-filter[data-path="pdh"]')).toHaveClass(/active/);
  await expect(page.locator('#routeLayer .route.pathway-active')).not.toHaveCount(0);
});

test('expert pathway controls remain usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(appUrl('expert-mobile-controls-regression'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.getByRole('button', { name: '专家地图', exact: true }).click();
  await page.locator('.path-filter[data-path="tca"]').click();
  await expect(page.locator('.path-filter[data-path="tca"]')).toHaveClass(/active/);

  const metrics = await page.evaluate(() => {
    const pathbar = document.querySelector('.pathbar');
    const filters = document.querySelector('.path-filters');
    return {
      pageOverflow: document.documentElement.scrollWidth > innerWidth,
      pathbarOverflow: pathbar ? pathbar.scrollWidth > pathbar.clientWidth : true,
      filtersHeight: filters?.getBoundingClientRect().height || 0,
      activeButtonVisible: [...document.querySelectorAll('.path-filter.active')]
        .some(button => { const rect = button.getBoundingClientRect(); return rect.width > 0 && rect.height > 0; })
    };
  });
  expect(metrics.pageOverflow).toBe(false);
  expect(metrics.filtersHeight).toBeGreaterThan(0);
  expect(metrics.activeButtonVisible).toBe(true);
});
