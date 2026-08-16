const { test, expect, appUrl } = require('./helpers.js');

async function enterLearning(page) {
  await page.goto(appUrl('pathway-only-learning'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await expect(page.locator('#studentWorkspace')).toBeVisible();
}

test('learning mode is pathway-only and removes course layers', async ({ page }) => {
  await enterLearning(page);

  await expect(page.locator('#studentCourseModeBtn')).toHaveCount(0);
  await expect(page.locator('#studentTopicProgress')).toHaveCount(0);
  await expect(page.locator('#studentLessonQuiz')).toHaveCount(0);
  await expect(page.locator('#studentLessonFinish')).toHaveCount(0);
  await expect(page.locator('#studentCourseBar')).toHaveCount(0);
  await expect(page.locator('#studentCourseQuiz')).toHaveCount(0);
  await expect(page.locator('#studentCourseChallenge')).toHaveCount(0);
  await expect(page.locator('#studentCourseHome')).toContainText('学习路径');
  await expect(page.locator('#studentCourseHome')).not.toContainText('系统学习');
  await expect(page.locator('#studentCourseHome')).not.toContainText('课后自测');

  await page.locator('#studentCourseStart').click();
  await expect(page.locator('#studentTopicPanel')).toBeVisible();
  await expect(page.locator('#studentTopicCount')).toContainText('条通路');
  await expect(page.locator('#studentTopicLessons .student-topic-lesson')).toHaveCount(6);
  await expect(page.locator('#studentTopicLessons')).not.toContainText('已完成');
  await expect(page.locator('#studentTopicLessons')).not.toContainText('自由浏览');

  await page.locator('#studentTopicStart').click();
  await expect(page.locator('#studentPathwayPanel')).toBeVisible();
  await expect(page.locator('#studentPrimer')).toBeVisible();
  await expect(page.locator('#studentPathwayMap')).toBeAttached();
  await expect(page.locator('#studentDetail')).toContainText('尚未选中反应');
});

test('pathway selection stays direct after reload and does not write learning progress', async ({ page }) => {
  await enterLearning(page);
  await page.locator('#studentTopics .student-topic-card[data-topic="carbohydrate"]').click();
  await page.locator('#studentTopicLessons .student-topic-lesson[data-pathway="glycolysis"]').click();
  await expect(page.locator('#flowTitle')).toHaveText('糖酵解');
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await expect(page.locator('#studentPathwayPanel')).toBeHidden();
  const keys = await page.evaluate(() => Object.keys(localStorage).filter(key => /student-progress|course-progress|course/i.test(key)));
  expect(keys).toEqual([]);
});
