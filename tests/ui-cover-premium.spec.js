const { test, expect, appUrl } = require('./helpers.js');
const { CORE_STUDY_PATHWAY_IDS, TEST_CONTRACTS } = require('../shared/contracts.js');

const URL = appUrl('premium-cell-cover-1');

function watchRuntimeErrors(page) {
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  return { consoleErrors, pageErrors };
}

test('premium cell cover has a layered scientific entry and smooth handoff', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);

  const metrics = await page.evaluate(() => {
    const cover = document.querySelector('.cell-cover');
    const panel = document.querySelector('.cell-cover-copy');
    const button = document.querySelector('.cell-cover-enter');
    const image = document.querySelector('.cell-cover-image');
    const panelStyle = getComputedStyle(panel);
    return {
      pageOverflow: document.documentElement.scrollWidth - innerWidth,
      coverHeight: cover.getBoundingClientRect().height,
      panelRadius: parseFloat(panelStyle.borderTopLeftRadius),
      panelBackdrop: panelStyle.backdropFilter || panelStyle.webkitBackdropFilter,
      buttonHeight: button.getBoundingClientRect().height,
      imageAnimation: getComputedStyle(image).animationName,
      topicCount: document.querySelectorAll('.cell-cover-topics span').length,
      frameVisible: getComputedStyle(document.querySelector('.cell-cover-frame')).display !== 'none',
      deferredLessonCards: document.querySelectorAll('#lessonCards .lesson-card').length,
      deferredTopicCards: document.querySelectorAll('#studentTopics .student-topic-card').length
    };
  });

  expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  expect(metrics.coverHeight).toBe(1000);
  expect(metrics.panelRadius).toBeGreaterThanOrEqual(32);
  expect(metrics.panelBackdrop).toContain('blur');
  expect(metrics.buttonHeight).toBeGreaterThanOrEqual(57);
  expect(metrics.imageAnimation).toContain('cover-cell-breathe');
  expect(metrics.topicCount).toBe(5);
  expect(metrics.frameVisible).toBe(true);
  expect(metrics.deferredLessonCards).toBe(0);
  expect(metrics.deferredTopicCards).toBe(0);
  await page.screenshot({ path: '../output/playwright/ui-premium-cover-desktop.png' });

  const enter = page.getByRole('button', { name: /进入学习模式/ });
  await page.keyboard.press('Tab');
  await expect(enter).toBeFocused();
  await enter.hover();
  await enter.click();
  await expect(page.locator('#cellCover')).toHaveClass(/is-exiting/);
  await page.waitForTimeout(280);
  await page.screenshot({ path: '../output/playwright/ui-premium-cover-transition.png' });
  await expect(page.locator('#cellCover')).toBeHidden({ timeout: 1500 });
  await expect(page.locator('#studentWorkspace')).toBeVisible();
  await expect(page.locator('#lessonCards .lesson-card')).toHaveCount(0);
  await expect(page.locator('#studentPathwaySelect option')).toHaveCount(TEST_CONTRACTS.studentPathwaySelectOptions);
  await expect(page.locator('#studentTopics .student-topic-card')).toHaveCount(5);
  await expect(page.locator('#studentCourseHome')).toBeVisible();
  await expect(page.locator('#studentCourseHome .student-course-topic')).toHaveCount(5);
  await expect(page.locator('#flowTitle')).toHaveText('丙酮酸脱氢酶复合体');
  const visibleScope = await page.evaluate(() => ({
    pathways: [...document.querySelectorAll('#studentPathwaySelect option')].map(option => option.value),
    visibleLessons: document.querySelectorAll('#lessonCards .lesson-card').length,
    topics: [...document.querySelectorAll('#studentTopics .student-topic-card')].map(card => card.dataset.topic)
  }));
  expect([...visibleScope.pathways].sort()).toEqual([...CORE_STUDY_PATHWAY_IDS].sort());
  expect(visibleScope.visibleLessons).toBe(0);
  expect(visibleScope.topics).toEqual(['biooxidation', 'carbohydrate', 'lipid', 'amino', 'nucleotide']);
  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
});

test('premium cell cover stays readable on mobile', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(850);

  const metrics = await page.evaluate(() => {
    const panel = document.querySelector('.cell-cover-copy').getBoundingClientRect();
    const button = document.querySelector('.cell-cover-enter').getBoundingClientRect();
    return {
      pageOverflow: document.documentElement.scrollWidth - innerWidth,
      panelLeft: Math.round(panel.left),
      panelRight: Math.round(innerWidth - panel.right),
      panelBottom: Math.round(innerHeight - panel.bottom),
      panelHeight: Math.round(panel.height),
      buttonHeight: Math.round(button.height),
      editionDisplay: getComputedStyle(document.querySelector('.cell-cover-edition')).display
    };
  });

  expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  expect(metrics.panelLeft).toBe(16);
  expect(metrics.panelRight).toBe(16);
  expect(metrics.panelBottom).toBe(86);
  expect(metrics.panelHeight).toBeLessThan(500);
  expect(metrics.buttonHeight).toBeGreaterThanOrEqual(51);
  expect(metrics.editionDisplay).toBe('none');
  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
  await page.screenshot({ path: '../output/playwright/ui-premium-cover-mobile.png' });
});
