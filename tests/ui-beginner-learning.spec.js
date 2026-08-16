const { test, expect, appUrl } = require('./helpers.js');

async function enterLearning(page) {
  await page.goto(appUrl('beginner-learning-1'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await expect(page.locator('#cellCover')).toBeHidden({ timeout: 1800 });
  await expect(page.locator('#studentWorkspace')).toBeVisible();
}

test('ETC lesson reveals the respiratory chain in five causal stations', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1024 });
  await enterLearning(page);
  await page.evaluate(() => {
    document.querySelector('#studentCourseStart')?.click();
    const select = document.querySelector('#studentPathwaySelect');
    select.value = 'etc';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await expect(page.locator('#flowTitle')).toContainText('电子传递链');
  await page.locator('#studentLessonStart').click();
  const mechanism = page.locator('#studentEtcMechanism');
  await expect(mechanism).toBeVisible();
  await expect(mechanism.locator('[role="tab"]')).toHaveCount(5);
  await expect(page.locator('#etcMechanismStepTitle')).toHaveText('复合体 I');
  await expect(page.locator('#etcMechanismImage')).toHaveAttribute('src', /etc-step-1-complex-i\.webp$/);
  await mechanism.screenshot({ path: 'output/playwright/etc-progressive-mechanism.png' });
  await page.locator('#etcMechanismImage').screenshot({ path: 'output/playwright/etc-stage-1-image.png' });
  await page.locator('#etcMechanismNextButton').click();
  await expect(page.locator('#etcMechanismStepTitle')).toHaveText('Q 与复合体 III');
  await expect(page.locator('#etcMechanismImage')).toHaveAttribute('src', /etc-step-2-complex-iii\.webp$/);
  await expect.poll(() => page.locator('#etcMechanismImage').evaluate(async image => {
    if (!image.complete || image.naturalWidth === 0 || !image.currentSrc.endsWith('etc-step-2-complex-iii.webp')) return false;
    await image.decode();
    return true;
  })).toBe(true);
  await mechanism.screenshot({ path: 'output/playwright/etc-progressive-complex-iii.png' });
  await page.locator('#etcMechanismImage').screenshot({ path: 'output/playwright/etc-stage-2-image.png' });
  await page.locator('#etcMechanismNextButton').click();
  await expect(page.locator('#etcMechanismStepTitle')).toHaveText('细胞色素 c 与复合体 IV');
  await expect(page.locator('#etcMechanismImage')).toHaveAttribute('src', /etc-step-3-complex-iv\.webp$/);
  await expect.poll(() => page.locator('#etcMechanismImage').evaluate(async image => {
    if (!image.complete || image.naturalWidth === 0 || !image.currentSrc.endsWith('etc-step-3-complex-iv.webp')) return false;
    await image.decode();
    return true;
  })).toBe(true);
  await mechanism.screenshot({ path: 'output/playwright/etc-progressive-complex-iv.png' });
  await page.locator('#etcMechanismImage').screenshot({ path: 'output/playwright/etc-stage-3-image.png' });
  await mechanism.locator('[role="tab"]').nth(4).click();
  await expect(page.locator('#etcMechanismResult')).toContainText('ADP + Pi → ATP');
  await expect(page.locator('#etcMechanismImage')).toHaveAttribute('src', /etc-step-5-atp-synthase\.webp$/);
  await expect.poll(() => page.locator('#etcMechanismImage').evaluate(async image => {
    if (!image.complete || image.naturalWidth === 0 || !image.currentSrc.endsWith('etc-step-5-atp-synthase.webp')) return false;
    await image.decode();
    return true;
  })).toBe(true);
  await mechanism.screenshot({ path: 'output/playwright/etc-progressive-atp-synthase.png' });
  await page.locator('#etcMechanismImage').screenshot({ path: 'output/playwright/etc-stage-5-image.png' });
  const extension = page.locator('#studentEtcExtension');
  await expect(extension).toBeVisible();
  await expect(extension).not.toHaveAttribute('open', '');
  await page.locator('#etcMechanismNextButton').click();
  await expect(extension).toHaveAttribute('open', '');
  await expect(extension).toContainText('复合体 II 没有跨膜泵质子的构象');
  await expect(extension).toContainText('电子流、H⁺ 梯度和 ATP 合成是一条因果链');
  await expect(extension.locator('img')).toHaveCount(2);
  await expect.poll(() => extension.locator('img').evaluateAll(async images => {
    await Promise.all(images.map(image => image.decode()));
    return images.every(image => image.complete && image.naturalWidth > 0);
  })).toBe(true);
  await extension.locator('.etc-extension-card.complex-ii').screenshot({ path: 'output/playwright/etc-supplementary-complex-ii.png' });
  await extension.locator('.etc-extension-card.overview').screenshot({ path: 'output/playwright/etc-supplementary-overview.png' });
  await page.locator('#etcMechanismPrev').click();
  await expect(page.locator('#etcMechanismStepTitle')).toHaveText('H⁺ 电化学梯度');
  await expect.poll(() => page.locator('#etcMechanismImage').evaluate(async image => {
    if (!image.complete || image.naturalWidth === 0 || !image.currentSrc.endsWith('etc-step-4-proton-gradient.webp')) return false;
    await image.decode();
    return true;
  })).toBe(true);
  await mechanism.screenshot({ path: 'output/playwright/etc-progressive-proton-gradient.png' });
  await page.locator('#etcMechanismImage').screenshot({ path: 'output/playwright/etc-stage-4-image.png' });
  await expect(page.locator('.student-map-stage')).toBeAttached();
});

test('beginner sees a concept primer before the detailed pathway map', async ({ page }) => {
  await enterLearning(page);

  const home = page.locator('#studentCourseHome');
  await expect(home).toBeVisible();
  await expect(home).toContainText('细胞代谢，其实先抓住一条主线就够了');
  await expect(home.locator('.student-course-topic')).toHaveCount(5);
  await expect(home).toContainText('质子梯度 → ATP');
  await expect(page.locator('#studentPathwayPanel')).toBeHidden();
  await page.locator('#studentCourseStart').click();

  const topic = page.locator('#studentTopicPanel');
  await expect(topic).toBeVisible();
  await expect(page.locator('#studentTopicTitle')).toHaveText('生物氧化');
  await expect(page.locator('#studentTopicLessons .student-topic-lesson')).toHaveCount(6);
  await expect(page.locator('#lessonCards .lesson-card')).toHaveCount(6);
  await expect(page.locator('#lessonCards .lesson-card').first()).toContainText(/\d+ 个关键节点/);
  await expect(page.locator('#studentTopicLessons .student-topic-lesson').first()).toContainText(/\d+ 个关键节点/);
  await expect(page.locator('#studentTopicAtlas')).not.toHaveAttribute('open', '');
  await expect(page.locator('.student-topic-stage')).toBeHidden();
  await expect.poll(() => page.evaluate(() => (
    document.querySelector('#studentTopicTitle').getBoundingClientRect().top
      >= document.querySelector('.topbar').getBoundingClientRect().bottom - 2
  ))).toBe(true);
  await page.screenshot({ path: 'output/playwright/student-topic-course-hierarchy.png', fullPage: true });
  await page.locator('#studentTopicStart').click();

  const primer = page.locator('#studentPrimer');
  await expect(home).toBeHidden();
  await expect(page.locator('#flowTitle')).toHaveText('丙酮酸脱氢酶复合体');
  await expect(primer).toContainText('丙酮酸脱氢酶复合体（PDH）：丙酮酸如何变成乙酰辅酶 A？');
  await expect(primer).toContainText('丙酮酸脱氢酶（E1）：脱羧');
  await expect(primer).toContainText('二氢硫辛酰转乙酰酶（E2）：转乙酰基');
  await expect(primer).toContainText('二氢硫辛酰脱氢酶（E3）：恢复工作状态');
  await expect(primer).toContainText('辅酶 A（CoA）');
  await expect(primer).toContainText('氧化型烟酰胺腺嘌呤二核苷酸（NAD⁺）');
  await expect(primer).toContainText('还原型烟酰胺腺嘌呤二核苷酸（NADH）');
  await expect(primer).toContainText('线粒体基质');
  await expect(primer.locator('.student-primer-story-step')).toHaveCount(3);
  await expect(primer.locator('.student-primer-term')).toHaveCount(3);
  const primerTypeScale = await primer.evaluate(element => ({
    storyHeading: parseFloat(getComputedStyle(element.querySelector('.student-primer-story-step strong')).fontSize),
    storyDetail: parseFloat(getComputedStyle(element.querySelector('.student-primer-story-step p')).fontSize),
    factValue: parseFloat(getComputedStyle(element.querySelector('.student-primer-facts dd')).fontSize)
  }));
  expect(primerTypeScale.storyHeading).toBeGreaterThanOrEqual(19);
  expect(primerTypeScale.storyDetail).toBeGreaterThanOrEqual(16);
  expect(primerTypeScale.factValue).toBeGreaterThanOrEqual(16);
  await primer.screenshot({ path: 'output/playwright/beginner-compact-primer.png' });

  const primerComesFirst = await page.evaluate(() => {
    const primer = document.querySelector('#studentPrimer');
    const lesson = document.querySelector('#studentLessonBody');
    return Boolean(primer?.compareDocumentPosition(lesson) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  expect(primerComesFirst).toBe(true);

  const start = page.locator('#studentLessonStart');
  await expect(start).toHaveAttribute('aria-expanded', 'false');
  await start.click();
  await expect(start).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#studentDetail')).toContainText('点击上方步骤或反应，查看白话讲解');
  await expect(page.locator('#studentPathwayPanel')).toHaveClass(/student-lesson-started/);
  await expect(page.locator('#studentMapNodes .student-map-node.is-current')).toHaveCount(1);
  await expect(page.locator('.student-map-stage')).toBeFocused();

  await page.locator('#studentCourseBack').click();
  await expect(topic).toBeVisible();
  await page.locator('#studentTopicHomeBack').click();
  await expect(home).toBeVisible();
});

test('student learning has no progress state and remains direct after reload', async ({ page }) => {
  await enterLearning(page);
  await page.locator('#studentCourseStart').click();
  await page.locator('#studentTopicStart').click();
  await expect(page.locator('#studentPathwayPanel')).toBeVisible();
  await expect(page.locator('#studentTopicProgress')).toHaveCount(0);
  await expect(page.locator('#studentLessonProgress')).toHaveCount(0);
  await expect(page.locator('#studentLessonQuiz')).toHaveCount(0);
  const keys = await page.evaluate(() => Object.keys(localStorage).filter(key => /student-progress|course-progress|course/i.test(key)));
  expect(keys).toEqual([]);
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await expect(page.locator('#studentCourseHome')).toBeVisible();
});

test('electron transport primer makes purpose, inputs, outputs, and location explicit on mobile', async ({ page }) => {
  await enterLearning(page);
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'etc';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const primer = page.locator('#studentPrimer');
  await expect(primer).toContainText('呼吸链怎样把电子流变成“可用的力”？');
  await expect(primer).toContainText('还原型烟酰胺腺嘌呤二核苷酸（NADH）、还原型黄素腺嘌呤二核苷酸（FADH₂）、氧气');
  await expect(primer).toContainText('氧化型烟酰胺腺嘌呤二核苷酸（NAD⁺）、黄素腺嘌呤二核苷酸（FAD）、水、质子动力势');
  await expect(primer).toContainText('线粒体内膜；质子积在膜间隙一侧');
  await expect(primer).toContainText('建立腺苷三磷酸合酶（ATP 合酶）可以利用的电化学梯度。');

  await page.waitForTimeout(450);
  const primerPosition = await page.evaluate(() => ({
    primerTop: document.querySelector('#studentPrimer').getBoundingClientRect().top,
    topbarBottom: document.querySelector('.topbar').getBoundingClientRect().bottom
  }));
  expect(primerPosition.primerTop).toBeGreaterThanOrEqual(primerPosition.topbarBottom - 2);

  await page.setViewportSize({ width: 390, height: 844 });
  const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(hasHorizontalOverflow).toBe(false);
});

test('every core pathway exposes a complete beginner primer', async ({ page }) => {
  await enterLearning(page);
  const missing = await page.evaluate(() => {
    const select = document.querySelector('#studentPathwaySelect');
    const failures = [];
    [...select.options].forEach(option => {
      select.value = option.value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      const factValues = [...document.querySelectorAll('.student-primer-facts dd')].map(item => item.textContent.trim());
      const storyCount = document.querySelectorAll('.student-primer-story-step').length;
      const termCount = document.querySelectorAll('.student-primer-term').length;
      if (factValues.some(value => !value) || storyCount !== 3 || termCount !== 3) failures.push(option.value);
    });
    return failures;
  });
  expect(missing).toEqual([]);
});
