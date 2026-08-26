const { test, expect, appUrl } = require('./helpers.js');

async function enterLearning(page) {
  await page.goto(appUrl('beginner-learning-1'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await expect(page.locator('#cellCover')).toBeHidden({ timeout: 1800 });
  await expect(page.locator('#studentWorkspace')).toBeVisible();
}

test('beginner sees a concept primer before the detailed pathway map', async ({ page }) => {
  await enterLearning(page);

  const home = page.locator('#studentCourseHome');
  await expect(home).toBeVisible();
  await expect(home).toContainText('按主题查看代谢主线');
  await expect(home.locator('.student-course-topic')).toHaveCount(5);
  expect(await home.locator('.student-course-topic-index').allTextContents()).toEqual(['生', '糖', '脂', '氨', '核']);
  await expect(home.locator('.student-course-topic-copy')).toHaveCount(5);
  await expect(home).toContainText('丙酮酸、三羧酸循环、电子传递链、氧化磷酸化');
  await expect(home.locator('.student-course-chain')).toHaveCount(0);
  await expect(page.locator('#studentPathwayPanel')).toBeHidden();
  await page.locator('#studentCourseHome .student-course-topic').first().click();

  const topic = page.locator('#studentTopicPanel');
  await expect(topic).toBeVisible();
  await expect(page.locator('#studentTopicTitle')).toHaveText('生物氧化');
  await expect(page.locator('#studentTopicLessons .student-topic-lesson')).toHaveCount(6);
  await expect(page.locator('#studentTopicStructure')).toContainText('从碳氧化到 ATP 的四个位置');
  await expect(page.locator('#studentTopicStructure .student-topic-structure-item')).toHaveCount(4);
  await expect(page.locator('#studentTopicStructure .student-topic-structure-visual')).toHaveCount(2);
  await expect(page.locator('#studentTopicStructure .student-topic-structure-visual img').nth(0)).toHaveAttribute('src', /39-pdh-complex-mechanism\.svg/);
  await expect(page.locator('#studentTopicStructure .student-topic-structure-visual img').nth(1)).toHaveAttribute('src', /27-etc-electron-transport-full\.webp/);
  await expect(page.locator('#lessonCards .lesson-card')).toHaveCount(6);
  await expect(page.locator('#studentTopicAtlas')).not.toHaveAttribute('open', '');
  await expect(page.locator('.student-topic-stage')).toBeHidden();
  await expect.poll(() => page.evaluate(() => (
    document.querySelector('#studentTopicTitle').getBoundingClientRect().top
      >= document.querySelector('.topbar').getBoundingClientRect().bottom - 2
  ))).toBe(true);
  await page.screenshot({ path: 'output/playwright/student-topic-course-hierarchy.png', fullPage: true });
  await page.locator('#studentTopicLessons .student-topic-lesson').first().click();

  const primer = page.locator('#studentPrimer');
  await expect(home).toBeHidden();
  await expect(page.locator('#flowTitle')).toHaveText('丙酮酸脱氢酶复合体');
  await expect(primer).toContainText('丙酮酸为什么要进入线粒体？');
  await expect(primer).toContainText('丙酮酸、辅酶 A、NAD⁺');
  await expect(primer).toContainText('乙酰辅酶 A、CO₂、NADH');
  await expect(primer).toContainText('线粒体基质');
  await expect(primer.locator('.student-primer-story-step')).toHaveCount(3);
  await expect(primer.locator('.student-primer-term')).toHaveCount(3);
  await primer.screenshot({ path: 'output/playwright/beginner-compact-primer.png' });

  const primerComesFirst = await page.evaluate(() => {
    const primer = document.querySelector('#studentPrimer');
    const lesson = document.querySelector('#studentLessonBody');
    return Boolean(primer?.compareDocumentPosition(lesson) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  expect(primerComesFirst).toBe(true);

  await expect(page.locator('#studentPathwayPanel')).toHaveClass(/student-lesson-started/);
  await expect(page.locator('#studentMapNodes .student-map-node.is-current')).toHaveCount(1);
  await expect(page.locator('.student-map-stage')).toBeVisible();
  await expect(page.locator('#studentPathwayMapVisual')).toBeVisible();
  await expect(page.locator('#studentPathwayMapVisualImage')).toHaveAttribute('src', /pathway-learning\/optimized\/pdh\.webp/);
  await page.locator('#studentPathwayMapVisualImage').click();
  await expect(page.locator('#pathwayVisualDialog')).toBeVisible();
  await expect(page.locator('#pathwayVisualDialogImage')).toHaveAttribute('src', /pathway-learning\/optimized\/pdh\.webp/);
  await page.locator('#pathwayVisualDialog').screenshot({ path: 'output/playwright/pdh-mechanism-lightbox.png' });
  await page.locator('#pathwayVisualDialogClose').click();
  await expect(page.locator('#pathwayVisualDialog')).toBeHidden();
  await expect(page.locator('#pathwayVisualDialogImage')).not.toHaveAttribute('src', /.+/);
  await page.locator('#studentPathwayMapVisualImage').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#pathwayVisualDialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#pathwayVisualDialog')).toBeHidden();

  await page.locator('#studentCourseBack').click();
  await expect(topic).toBeVisible();
  await page.locator('#studentTopicHomeBack').click();
  await expect(home).toBeVisible();
});

test('student mode stays map-first without course completion controls', async ({ page }) => {
  await enterLearning(page);
  await expect(page.locator('body')).not.toContainText(/第\s*[0-9一二三四五六七八九十]+\s*课|这一课|本课|完成课程|下一课/);
  await expect(page.locator('#studentCourseStart')).toHaveCount(0);
  await expect(page.locator('#studentTopicStart')).toHaveCount(0);
  await expect(page.locator('#studentLessonComplete')).toHaveCount(0);
  await expect(page.locator('#studentLessonNext')).toHaveCount(0);
  await expect(page.locator('#studentLessonFinish')).toHaveCount(0);
  await page.locator('#studentCourseHome .student-course-topic').nth(2).click();
  await expect(page.locator('#studentTopicTitle')).toHaveText('脂代谢');
  await expect(page.locator('#studentTopicStructure')).toContainText('先动员，再决定合成还是氧化');
  await expect(page.locator('#studentTopicStructure')).toContainText('合成储存');
  await expect(page.locator('#studentTopicStructure')).toContainText('进入线粒体');
  await expect(page.locator('#studentTopicStructure')).toContainText('β-氧化供能');
  await expect(page.locator('#studentTopicStructure')).toContainText('空腹输出');
  await expect(page.locator('#studentTopicLessons .student-topic-lesson > i').first()).toHaveText('合成');
  expect(await page.locator('#studentTopicLessons .student-topic-lesson > i').allTextContents()).toEqual(['合成', '运输', '分解', '输出']);
  await page.locator('#studentTopicPanel').screenshot({ path: 'output/playwright/lipid-topic-structure.png' });
  await page.locator('#studentTopicLessons .student-topic-lesson').first().click();
  await expect(page.locator('#studentPathwayPanel')).toHaveClass(/student-lesson-started/);
  await expect(page.locator('.student-map-stage')).toBeVisible();
});

test('electron transport primer makes purpose, inputs, outputs, and location explicit on mobile', async ({ page }) => {
  await enterLearning(page);
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'etc';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const primer = page.locator('#studentPrimer');
  await expect(primer).toContainText('呼吸链怎样把电子流变成“可用的力”？');
  await expect(primer).toContainText('NADH、FADH₂、氧气');
  await expect(primer).toContainText('NAD⁺、FAD、水、质子动力势');
  await expect(primer).toContainText('线粒体内膜；质子积在膜间隙一侧');
  await expect(primer).toContainText('建立 ATP 合酶可以利用的电化学梯度。');
  await expect(page.locator('#studentPathwayMapVisual')).toBeVisible();
  await expect(page.locator('#studentPathwayMapVisual img')).toHaveAttribute('src', /27-etc-electron-transport-full\.webp/);

  await page.waitForTimeout(450);
  const primerPosition = await page.evaluate(() => ({
    primerTop: document.querySelector('#studentPrimer').getBoundingClientRect().top,
    topbarBottom: document.querySelector('.topbar').getBoundingClientRect().bottom
  }));
  expect(primerPosition.primerTop).toBeGreaterThanOrEqual(primerPosition.topbarBottom - 2);

  await page.setViewportSize({ width: 390, height: 844 });
  const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(hasHorizontalOverflow).toBe(false);

  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'glycolysis';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await expect(page.locator('#studentPathwayMapVisual')).toBeVisible();
  await expect(page.locator('#studentPathwayMapVisual img')).toHaveAttribute('src', /pathway-learning\/optimized\/glycolysis\.webp/);

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'beta_oxidation';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  const betaPlate = page.locator('#studentPathwayMapVisual img');
  await expect(page.locator('#studentPathwayMapVisual')).toBeVisible();
  await expect(betaPlate).toHaveAttribute('src', /pathway-learning\/optimized\/beta_oxidation-v2\.webp/);
  await expect(betaPlate).not.toHaveAttribute('src', /40-fatty-acid-beta-oxidation-mechanism\.svg/);
  await expect(page.locator('#studentPathwayMapVisualCaption')).toContainText('每轮释放乙酰-CoA');
  await betaPlate.screenshot({ path: 'output/playwright/beta-oxidation-textbook-plate.png' });
});

test('pathway overview restores structural images and expands opaque abbreviations', async ({ page }) => {
  await enterLearning(page);
  const selectPathway = pathwayId => page.locator('#studentPathwaySelect').evaluate((select, value) => {
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }, pathwayId);

  await selectPathway('fa_synthesis');
  await expect(page.locator('#studentPrimer')).toContainText('乙酰辅酶 A 羧化酶');
  await expect(page.locator('#studentPathwayMapVisual')).toBeVisible();
  await expect(page.locator('#studentPathwayMapVisualImage')).toHaveAttribute('src', /pathway-learning\/optimized\/fa_synthesis-v4\.png/);
  await expect(page.locator('#studentPathwayMapScientificOverlayLayer .overlay-schematic')).toHaveCount(0);
  await expect(page.locator('#studentPathwayMapVisualCaption')).toContainText('脂肪酸合酶');
  await page.locator('#studentPathwayMapVisual').screenshot({ path: 'output/playwright/fa-synthesis-scientific-learning-map.png' });

  await selectPathway('carnitine');
  await expect(page.locator('#studentPrimer')).toContainText('肉碱棕榈酰转移酶 1');
  await expect(page.locator('#studentPrimer')).toContainText('肉碱-脂酰肉碱转位酶');
  await expect(page.locator('#studentPrimer')).toContainText('重新形成脂酰辅酶 A');
  await expect(page.locator('#studentPrimer')).not.toContainText(/CPT-I|CPT-II|CACT/);

  await selectPathway('purine');
  const nodeTitles = page.locator('#studentMapNodes title');
  await expect(nodeTitles.filter({ hasText: '甘氨酰胺核糖核苷酸' })).toHaveCount(1);
  await expect(nodeTitles.filter({ hasText: '5-氨基咪唑-4-甲酰胺核糖核苷酸' })).toHaveCount(1);

  await selectPathway('pdh');
  await expect(nodeTitles.filter({ hasText: '电压依赖性阴离子通道' })).toHaveCount(1);
  await expect(nodeTitles.filter({ hasText: '线粒体丙酮酸载体' })).toHaveCount(1);
});

test('high-risk learning pathways use the corrected textbook mechanism plates', async ({ page }) => {
  await enterLearning(page);
  const selectPathway = pathwayId => page.locator('#studentPathwaySelect').evaluate((select, value) => {
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }, pathwayId);

  const expected = {
    fa_synthesis: /fa_synthesis-v4\.png/,
    aa_carbon: /aa_carbon-v4\.png/,
    nucleotide_degradation: /nucleotide_degradation-v4\.png/
  };
  for (const [pathwayId, source] of Object.entries(expected)) {
    await selectPathway(pathwayId);
    await expect(page.locator('#studentPathwayMapVisualImage')).toHaveAttribute('src', source);
  }
  await selectPathway('nucleotide_degradation');
  await expect(page.locator('#studentPrimer')).toContainText('主要在细胞质');
  await expect(page.locator('#studentPrimer')).not.toContainText('溶酶体');
});

test('every core pathway exposes a complete beginner primer', async ({ page }) => {
  await enterLearning(page);
  const audit = await page.evaluate(() => {
    const select = document.querySelector('#studentPathwaySelect');
    const failures = [];
    const visualFailures = [];
    [...select.options].forEach(option => {
      select.value = option.value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      const factValues = [...document.querySelectorAll('.student-primer-facts dd')].map(item => item.textContent.trim());
      const storyCount = document.querySelectorAll('.student-primer-story-step').length;
      const termCount = document.querySelectorAll('.student-primer-term').length;
      if (factValues.some(value => !value) || storyCount !== 3 || termCount !== 3) failures.push(option.value);
      const mapFigure = document.querySelector('#studentPathwayMapVisual');
      const mapImage = document.querySelector('#studentPathwayMapVisualImage');
      const overlayGroup = document.querySelector('#studentPathwayMapScientificOverlayLayer .overlay-schematic');
      const hasScientificMap = !mapFigure?.hidden
        && /(?:pathway-learning\/optimized\/|27-etc-electron-transport-full)/.test(mapImage?.getAttribute('src') || '')
        && !overlayGroup;
      if (!hasScientificMap) visualFailures.push(option.value);
    });
    return { failures, visualFailures };
  });
  expect(audit.failures).toEqual([]);
  expect(audit.visualFailures).toEqual([]);
});
