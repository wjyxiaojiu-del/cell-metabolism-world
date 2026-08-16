const { test, expect, appUrl } = require('./helpers.js');

const MB = 1024 * 1024;

test('page resource budget stays within limits', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(appUrl('performance-budget'), { waitUntil: 'networkidle' });

  const metrics = await page.evaluate(() => {
    const entries = performance.getEntriesByType('resource');
    const sum = (predicate) => entries
      .filter(predicate)
      .reduce((total, entry) => total + (entry.transferSize || 0), 0);
    const total = sum(() => true);
    const indexHtml = sum(entry => /\/index\.html/.test(entry.name));
    const dataCompiled = sum(entry => /\/data-compiled\.js/.test(entry.name));
    const optimizedImages = sum(entry => /\/cell-metabolism-assets\/optimized\//.test(entry.name));
    const oversized = entries
      .filter(entry => (entry.transferSize || 0) > 3 * 1024 * 1024)
      .map(entry => ({ name: entry.name, bytes: entry.transferSize }));
    return { total, indexHtml, dataCompiled, optimizedImages, oversized, resourceCount: entries.length };
  });

  expect(errors).toEqual([]);
  expect(metrics.total).toBeLessThan(15 * MB);
  expect(metrics.indexHtml).toBeLessThan(1 * MB);
  expect(metrics.dataCompiled).toBeLessThan(1.5 * MB);
  expect(metrics.optimizedImages).toBeLessThan(12 * MB);
  expect(metrics.oversized).toEqual([]);
  expect(metrics.resourceCount).toBeGreaterThan(0);
});
