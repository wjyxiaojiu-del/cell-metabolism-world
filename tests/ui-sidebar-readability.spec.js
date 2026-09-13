const { test, expect, appUrl } = require('./helpers.js');

async function enterLearning(page) {
  await page.goto(appUrl('sidebar-readable-type'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await expect(page.locator('#cellCover')).toBeHidden({ timeout: 1800 });
  await expect(page.locator('#studentWorkspace')).toBeVisible();
}

async function numericStyle(locator, property) {
  return locator.evaluate((element, cssProperty) => Number.parseFloat(getComputedStyle(element)[cssProperty]), property);
}

test('learning sidebar keeps topic and pathway copy comfortably readable', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await enterLearning(page);

  await page.locator('#studentCourseHome .student-course-topic').nth(1).click();
  await page.locator('#studentSidebarToggle').click();
  await expect(page.locator('#studentTopics .student-topic-card').nth(1)).toBeVisible();
  await expect(page.locator('#lessonCards .lesson-card')).toHaveCount(5);

  const topic = page.locator('#studentTopics .student-topic-card').nth(1);
  const lesson = page.locator('#lessonCards .lesson-card').first();

  expect(await numericStyle(page.locator('.student-sidebar-toggle-label'), 'fontSize')).toBeGreaterThanOrEqual(11);
  expect(await numericStyle(page.locator('.student-topic-heading'), 'fontSize')).toBeGreaterThanOrEqual(11);
  expect(await numericStyle(page.locator('.student-section-label'), 'fontSize')).toBeGreaterThanOrEqual(11);
  expect(await numericStyle(topic.locator('strong'), 'fontSize')).toBeGreaterThanOrEqual(14);
  expect(await numericStyle(topic.locator('small'), 'fontSize')).toBeGreaterThanOrEqual(11);
  expect(await numericStyle(topic.locator('b'), 'fontSize')).toBeGreaterThanOrEqual(12);
  expect(await numericStyle(lesson.locator('strong'), 'fontSize')).toBeGreaterThanOrEqual(14);
  expect(await numericStyle(lesson.locator('small'), 'fontSize')).toBeGreaterThanOrEqual(11);
  expect(await numericStyle(lesson.locator('b'), 'fontSize')).toBeGreaterThanOrEqual(12);
  expect(await numericStyle(topic, 'minHeight')).toBeGreaterThanOrEqual(58);
  expect(await numericStyle(lesson, 'minHeight')).toBeGreaterThanOrEqual(68);
  await page.screenshot({ path: 'output/playwright/sidebar-readable-type-1440.png', fullPage: true });
});

for (const width of [390, 768, 1440]) {
  test(`learning sidebar enlarged copy stays contained at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await enterLearning(page);
    await page.locator('#studentCourseHome .student-course-topic').nth(1).click();
    await page.locator('#studentSidebarToggle').click();

    const catalog = page.locator('#studentCatalogBody');
    await expect(catalog).toBeVisible();
    await expect(page.locator('#lessonCards .lesson-card')).toHaveCount(5);

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
    expect(await catalog.evaluate(element => {
      const cards = [...element.querySelectorAll('.student-topic-card, .lesson-card')];
      return cards.every(card => {
        const cardBox = card.getBoundingClientRect();
        return [...card.querySelectorAll('strong, small, b')].every(copy => {
          const copyBox = copy.getBoundingClientRect();
          return copyBox.left >= cardBox.left - 1
            && copyBox.right <= cardBox.right + 1
            && copyBox.top >= cardBox.top - 1
            && copyBox.bottom <= cardBox.bottom + 1;
        });
      });
    })).toBe(true);
  });
}
