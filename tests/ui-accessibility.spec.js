const { test, expect, appUrl } = require('./helpers.js');
const AxeBuilder = require('@axe-core/playwright').default;

// 已知存量问题：专家地图颜色对比度、landmark 包裹。冒烟测试允许这些已知项，
// 但会拦截新增的 critical/serious 违规，防止可访问性回退。
const ALLOWED_SERIOUS = new Set(['color-contrast']);

async function expectNoUnexpectedViolations(page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
    .analyze();
  const unexpected = results.violations.filter(v =>
    v.impact === 'critical' || (v.impact === 'serious' && !ALLOWED_SERIOUS.has(v.id))
  );
  expect(unexpected, JSON.stringify(unexpected.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })), null, 2)).toEqual([]);
}

test('cover page has no unexpected axe violations on desktop', async ({ page }) => {
  await page.goto(appUrl('a11y-cover-desktop'), { waitUntil: 'networkidle' });
  await expectNoUnexpectedViolations(page);
});

test('cover page has no unexpected axe violations on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(appUrl('a11y-cover-mobile'), { waitUntil: 'networkidle' });
  await expectNoUnexpectedViolations(page);
});

test('student home has no unexpected axe violations', async ({ page }) => {
  await page.goto(appUrl('a11y-student-home'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.locator('#studentWorkspace').waitFor({ state: 'visible' });
  await expectNoUnexpectedViolations(page);
});

test('expert map overview has no unexpected axe violations', async ({ page }) => {
  await page.goto(appUrl('a11y-expert'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.locator('#studentWorkspace').waitFor({ state: 'visible' });
  await page.getByRole('button', { name: '专家地图', exact: true }).click();
  await page.waitForTimeout(400);
  await expectNoUnexpectedViolations(page);
});
