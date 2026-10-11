const { test, expect, appUrl } = require('./helpers.js');

test('a learning pathway link opens the requested map directly', async ({ page }) => {
  await page.goto(`${appUrl('learning-deep-link-1')}#learn=glycolysis`, { waitUntil: 'networkidle' });

  await expect(page.locator('#cellCover')).toBeHidden();
  await expect(page.locator('#studentWorkspace')).toBeVisible();
  await expect(page.locator('#studentCourseHome')).toBeHidden();
  await expect(page.locator('#studentTopicPanel')).toBeHidden();
  await expect(page.locator('#studentPathwayPanel')).toBeVisible();
  await expect(page.locator('#studentPathwaySelect')).toHaveValue('glycolysis');
  await expect(page.locator('#flowTitle')).toHaveText('糖酵解');
});

test('an invalid learning link keeps the simple cover flow', async ({ page }) => {
  await page.goto(`${appUrl('learning-deep-link-invalid')}#learn=unknown`, { waitUntil: 'networkidle' });

  await expect(page.locator('#cellCover')).toBeVisible();
  await expect(page.locator('#cellCover')).not.toBeHidden();
  await expect(page.locator('#studentCourseHome')).toBeHidden();
});

test('the current learning pathway can be copied and reopened', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://127.0.0.1:8000' });
  await page.goto(`${appUrl('learning-deep-link-copy')}#learn=glycolysis`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: '复制通路链接' }).click();

  await expect(page.getByRole('button', { name: '已复制链接' })).toBeVisible();
  const copiedUrl = await page.evaluate(() => navigator.clipboard.readText());
  expect(copiedUrl).toMatch(/index\.html\?v=learning-deep-link-copy#learn=glycolysis$/);

  const reopened = await context.newPage();
  await reopened.goto(copiedUrl, { waitUntil: 'networkidle' });
  await expect(reopened.locator('#studentPathwayPanel')).toBeVisible();
  await expect(reopened.locator('#studentPathwaySelect')).toHaveValue('glycolysis');
  await expect(reopened.locator('#flowTitle')).toHaveText('糖酵解');
  await reopened.close();
});
