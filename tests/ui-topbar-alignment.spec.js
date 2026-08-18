const { test, expect, appUrl } = require('./helpers.js');

const URL = appUrl('aligned-topbar-1');

async function enterLearning(page) {
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await expect(page.locator('#studentWorkspace')).toBeVisible();
  await expect(page.locator('body')).toHaveClass(/student-mode/);
  await page.waitForTimeout(950);
}

function alignmentMetrics() {
  const rect = selector => document.querySelector(selector).getBoundingClientRect();
  const center = box => box.top + box.height / 2;
  const topbar = rect('.topbar');
  const brand = rect('.brand');
  const search = rect('.search');
  const actions = rect('.top-actions');
  const input = rect('#search');
  const buttons = [...document.querySelectorAll('.top-actions .btn')]
    .filter(button => getComputedStyle(button).display !== 'none')
    .map(button => button.getBoundingClientRect());
  return {
    pageOverflow: document.documentElement.scrollWidth - innerWidth,
    display: getComputedStyle(document.querySelector('.topbar')).display,
    topbarHeight: topbar.height,
    brandCenter: center(brand),
    searchCenter: center(search),
    actionsCenter: center(actions),
    searchHeight: input.height,
    buttonHeights: buttons.map(button => button.height),
    visibleButtons: buttons.length
  };
}

test('learning navigation uses one strict desktop baseline', async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.setViewportSize({ width: 1233, height: 760 });
  await enterLearning(page);

  const metrics = await page.evaluate(alignmentMetrics);
  expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  expect(metrics.display).toBe('grid');
  expect(Math.abs(metrics.brandCenter - metrics.searchCenter)).toBeLessThanOrEqual(1);
  expect(Math.abs(metrics.actionsCenter - metrics.searchCenter)).toBeLessThanOrEqual(1);
  expect(metrics.searchHeight).toBe(44);
  expect(metrics.buttonHeights.every(height => height === 44)).toBe(true);
  expect(metrics.visibleButtons).toBe(2);
  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
  await page.screenshot({ path: '../output/playwright/ui-aligned-topbar-desktop.png' });

  await page.getByRole('button', { name: '专家地图', exact: true }).click();
  await expect(page.locator('body')).toHaveClass(/expert-map/);
  const expertMetrics = await page.evaluate(alignmentMetrics);
  expect(Math.abs(expertMetrics.brandCenter - expertMetrics.searchCenter)).toBeLessThanOrEqual(1);
  expect(Math.abs(expertMetrics.actionsCenter - expertMetrics.searchCenter)).toBeLessThanOrEqual(1);
});

test('learning navigation uses a clean two-row mobile layout', async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await enterLearning(page);

  const metrics = await page.evaluate(alignmentMetrics);
  expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  expect(metrics.display).toBe('grid');
  expect(Math.abs(metrics.brandCenter - metrics.actionsCenter)).toBeLessThanOrEqual(1);
  expect(metrics.searchCenter).toBeGreaterThan(metrics.brandCenter + 30);
  expect(metrics.searchHeight).toBe(42);
  expect(metrics.buttonHeights).toEqual([38]);
  expect(metrics.visibleButtons).toBe(1);
  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
  await page.screenshot({ path: '../output/playwright/ui-aligned-topbar-mobile.png' });
});
