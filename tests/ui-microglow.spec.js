const { test, expect, appUrl } = require('./helpers.js');

const URL = appUrl('microglow-learning-2');

async function enterLearning(page) {
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await expect(page.locator('#studentWorkspace')).toBeVisible();
  await expect(page.locator('body')).toHaveClass(/student-mode/);
  await page.waitForTimeout(950);
}

test('microglow learning UI works on desktop', async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await enterLearning(page);

  const metrics = await page.evaluate(() => {
    const head = getComputedStyle(document.querySelector('.student-head'));
    const panel = getComputedStyle(document.querySelector('.flow-panel'));
    const stage = getComputedStyle(document.querySelector('.student-map-stage'));
    return {
      pageOverflow: document.documentElement.scrollWidth - innerWidth,
      headRadius: parseFloat(head.borderTopLeftRadius),
      panelRadius: parseFloat(panel.borderTopLeftRadius),
      stageRadius: parseFloat(stage.borderTopLeftRadius),
      headBackdrop: head.backdropFilter || head.webkitBackdropFilter,
      stageBackground: stage.backgroundImage
    };
  });
  expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  expect(metrics.headRadius).toBeGreaterThanOrEqual(30);
  expect(metrics.panelRadius).toBeGreaterThanOrEqual(28);
  expect(metrics.stageRadius).toBeGreaterThanOrEqual(24);
  expect(metrics.headBackdrop).toContain('blur');
  expect(metrics.stageBackground).toContain('radial-gradient');
  await page.screenshot({ path: 'output/playwright/ui-microglow-student-desktop.png' });

  const lessons = page.locator('.lesson-card');
  await page.locator('#studentCourseHome .student-course-topic').first().click();
  if (await lessons.count() > 1) {
    await page.locator('#studentSidebarToggle').click();
    await lessons.nth(1).click();
    await expect(lessons.nth(1)).toHaveClass(/active/);
    await page.locator('#studentSidebarToggle').click();
  }
  await expect(page.locator('.student-map-stage')).toBeVisible();
  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test('microglow learning UI has no mobile page overflow', async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await enterLearning(page);
  await page.locator('#studentCourseHome .student-course-topic').first().click();
  await page.locator('#studentTopicLessons .student-topic-lesson').first().click();

  const metrics = await page.evaluate(() => ({
    pageOverflow: document.documentElement.scrollWidth - innerWidth,
    workspaceOverflowX: getComputedStyle(document.querySelector('#studentWorkspace')).overflowX,
    mapCanScroll: document.querySelector('.student-map-stage').scrollWidth > document.querySelector('.student-map-stage').clientWidth,
    headRadius: parseFloat(getComputedStyle(document.querySelector('.student-head')).borderTopLeftRadius),
    catalogPosition: getComputedStyle(document.querySelector('.lesson-catalog')).position
  }));
  expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  expect(metrics.workspaceOverflowX).toBe('hidden');
  expect(metrics.mapCanScroll).toBe(true);
  expect(metrics.headRadius).toBeGreaterThanOrEqual(24);
  expect(metrics.catalogPosition).toBe('static');
  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);

  await page.screenshot({ path: 'output/playwright/ui-microglow-student-mobile-top.png' });
  await page.locator('#flowPanel').scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  await page.screenshot({ path: 'output/playwright/ui-microglow-student-mobile-map.png' });
});

test('microglow learning UI adapts to tablet', async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.setViewportSize({ width: 768, height: 1024 });
  await enterLearning(page);

  const metrics = await page.evaluate(() => ({
    pageOverflow: document.documentElement.scrollWidth - innerWidth,
    columns: getComputedStyle(document.querySelector('.student-layout')).gridTemplateColumns,
    catalogPosition: getComputedStyle(document.querySelector('.lesson-catalog')).position
  }));
  expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  expect(metrics.columns.split(' ').length).toBe(1);
  expect(metrics.catalogPosition).toBe('static');
  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
  await page.screenshot({ path: 'output/playwright/ui-microglow-student-tablet.png' });
});
