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
  await expect(primer).toContainText('NADH、琥珀酸、氧气');
  await expect(primer).not.toContainText(/FADH₂.*(?:输入|出口)|(?:输入|出口).*FADH₂/);
  await expect(primer).toContainText('NAD⁺、延胡索酸、CoQH₂、水、质子动力势');
  await expect(primer).toContainText('琥珀酸在复合体 II 内由酶内 FAD 接收电子');
  await expect(primer).toContainText('线粒体内膜；质子积在膜间隙一侧');
  await expect(primer).toContainText('建立 ATP 合酶可以利用的电化学梯度。');
  await expect(page.locator('#studentPathwayMapVisual')).toBeVisible();
  await expect(page.locator('#studentPathwayMapVisual img')).toHaveAttribute('src', /27-etc-electron-transport-full\.webp/);

  const map = page.locator('#studentPathwayMap');
  await expect(map).toHaveAttribute('data-map-layout', 'etc-electron-flow');
  for (const key of ['nadh', 'complex-i', 'succinate', 'complex-ii', 'coq', 'complex-iii', 'cyt-c', 'complex-iv', 'oxygen', 'water', 'pmf']) {
    await expect(map.locator(`[data-map-key="${key}"]`)).toHaveCount(1);
  }
  await expect(map.locator('[data-map-key="succinate"]')).toHaveAttribute('data-entity-id', '琥珀酸@mito-matrix');
  await expect(map.locator('[data-edge-from="succinate"][data-edge-to="complex-ii"]')).toHaveAttribute('data-reaction', /.+/);
  await expect(map.locator('[data-edge-from="complex-i"][data-edge-to="coq"]')).toHaveCount(1);
  await expect(map.locator('[data-edge-from="complex-ii"][data-edge-to="coq"]')).toHaveCount(1);
  await expect(map.locator('[data-next-pathway="oxphos"]')).toContainText('氧化磷酸化');
  await expect(map.locator('[data-map-hint="horizontal"]')).toContainText('横向查看完整主线');
  await expect(page.locator('#studentPathwayMapVisualFrame')).toHaveClass(/is-etc-cropped/);
  await expect(map).not.toContainText(/ATP\s*合酶|ADP|ATP/);
  await expect(map).toContainText('琥珀酸');
  await expect(map).toContainText('经酶内 FAD/FADH₂');

  await page.waitForTimeout(450);
  const primerPosition = await page.evaluate(() => ({
    primerTop: document.querySelector('#studentPrimer').getBoundingClientRect().top,
    topbarBottom: document.querySelector('.topbar').getBoundingClientRect().bottom
  }));
  expect(primerPosition.primerTop).toBeGreaterThanOrEqual(primerPosition.topbarBottom - 2);

  await page.setViewportSize({ width: 390, height: 844 });
  const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(hasHorizontalOverflow).toBe(false);

  await map.locator('[data-next-pathway="oxphos"]').click();
  await expect(page.locator('#flowTitle')).toHaveText('氧化磷酸化');

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
  await expect(page.locator('#studentPrimer')).toContainText('饱和偶数碳链');
  await expect(page.locator('#studentPrimer')).toContainText('末轮 C4 会切下 2 个');
  await expect(page.locator('#studentPrimer')).toContainText('酶内 FAD');
  await expect(page.locator('#studentPathwayMapVisualCaption')).toContainText('通常每轮释放 1 个乙酰-CoA');
  await expect(page.locator('#studentPathwayMapVisualCaption')).toContainText('末轮 C4 释放 2 个');
  await betaPlate.screenshot({ path: 'output/playwright/beta-oxidation-textbook-plate.png' });
});

test('oxidative phosphorylation map separates ATP synthesis from nucleotide and phosphate transport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterLearning(page);
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'oxphos';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const map = page.locator('#studentPathwayMap');
  await expect(map).toHaveAttribute('data-map-layout', 'oxphos-coupling');
  for (const key of [
    'h-ims', 'atp-synthase', 'h-matrix', 'adp-matrix', 'pi-matrix', 'atp-matrix',
    'ant', 'adp-ims', 'atp-ims', 'phosphate-carrier', 'pi-ims', 'vdac',
    'adp-cytosol', 'pi-cytosol', 'atp-cytosol'
  ]) {
    await expect(map.locator(`[data-map-key="${key}"]`)).toHaveCount(1);
  }

  for (const [from, to] of [
    ['h-ims', 'atp-synthase'], ['atp-synthase', 'h-matrix'],
    ['adp-matrix', 'atp-synthase'], ['pi-matrix', 'atp-synthase'], ['atp-synthase', 'atp-matrix'],
    ['atp-matrix', 'ant'], ['ant', 'atp-ims'], ['adp-ims', 'ant'], ['ant', 'adp-matrix'],
    ['pi-ims', 'phosphate-carrier'], ['phosphate-carrier', 'pi-matrix'],
    ['atp-ims', 'vdac'], ['vdac', 'atp-cytosol'],
    ['adp-cytosol', 'vdac'], ['vdac', 'adp-ims'],
    ['pi-cytosol', 'vdac'], ['vdac', 'pi-ims']
  ]) {
    await expect(map.locator(`[data-edge-from="${from}"][data-edge-to="${to}"]`)).toHaveCount(1);
  }

  await expect(map.locator('[data-map-hint="horizontal"]')).toContainText('横向查看三条机制通道');
  await expect(page.locator('#studentMapCount')).toContainText('10 个反应 · 15 个教学节点');
  await expect(map).not.toContainText(/NADH|乳酸|琥珀酸|CoQ|辅酶\s*Q|氧气/);
  await expect(page.locator('#studentPathwayMapVisualImage')).toHaveAttribute('src', /oxphos-v2\.webp/);

  const hasPageOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(hasPageOverflow).toBe(false);
});

test('PDH learning map separates mitochondrial entry from the E1 E2 E3 cofactor handoff', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterLearning(page);
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'pdh';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const map = page.locator('#studentPathwayMap');
  await expect(map).toHaveAttribute('data-map-layout', 'pdh-entry-handoff');
  for (const key of [
    'pyruvate-cytosol', 'vdac', 'pyruvate-ims', 'mpc', 'pyruvate-matrix',
    'e1', 'hydroxyethyl-tpp', 'co2', 'e2', 'coa', 'acetyl-coa', 'e3', 'nad', 'nadh'
  ]) {
    await expect(map.locator(`[data-map-key="${key}"]`)).toHaveCount(1);
  }

  for (const [from, to] of [
    ['pyruvate-cytosol', 'vdac'], ['vdac', 'pyruvate-ims'],
    ['pyruvate-ims', 'mpc'], ['mpc', 'pyruvate-matrix'],
    ['pyruvate-matrix', 'e1'], ['e1', 'hydroxyethyl-tpp'], ['e1', 'co2'],
    ['hydroxyethyl-tpp', 'e2'], ['coa', 'e2'], ['e2', 'acetyl-coa'],
    ['e2', 'e3'], ['nad', 'e3'], ['e3', 'nadh'], ['e3', 'e2']
  ]) {
    await expect(map.locator(`[data-edge-from="${from}"][data-edge-to="${to}"]`)).toHaveCount(1);
  }

  await expect(page.locator('#studentMapCount')).toContainText('3 个反应 · 14 个教学节点');
  await expect(map).toContainText('E1 · TPP');
  await expect(map).toContainText('E2 · 硫辛酰胺摆臂');
  await expect(map).toContainText('E3 · FAD');
  await expect(map).toContainText('H⁺同向输入');
  await expect(map.locator('[data-next-pathway="tca"]')).toContainText('三羧酸循环');
  await expect(map.locator('[data-map-hint="horizontal"]')).toContainText('跨膜进入 → 三酶接力 → TCA');
  await expect(map).not.toContainText(/乳酸|丙氨酸|草酰乙酸/);

  const hasPageOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(hasPageOverflow).toBe(false);

  for (const viewport of [{ width: 768, height: 1024 }, { width: 1440, height: 1000 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(150);
    const collisions = await map.locator('.student-map-node, .student-map-next-pathway').evaluateAll(nodes => {
      const records = nodes.map(node => ({
        key: node.getAttribute('data-map-key') || node.getAttribute('data-next-pathway'),
        rect: node.getBoundingClientRect()
      }));
      const overlaps = [];
      for (let left = 0; left < records.length; left += 1) {
        for (let right = left + 1; right < records.length; right += 1) {
          const first = records[left];
          const second = records[right];
          const width = Math.max(0, Math.min(first.rect.right, second.rect.right)
            - Math.max(first.rect.left, second.rect.left));
          const height = Math.max(0, Math.min(first.rect.bottom, second.rect.bottom)
            - Math.max(first.rect.top, second.rect.top));
          if (width * height > 1) overlaps.push(`${first.key} / ${second.key}`);
        }
      }
      return overlaps;
    });
    expect(collisions).toEqual([]);
  }
});

test('TCA learning map teaches the eight-step yield cycle and the complex II membrane handoff', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterLearning(page);
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'tca';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const map = page.locator('#studentPathwayMap');
  await expect(map).toHaveAttribute('data-map-layout', 'tca-yield-cycle');
  for (const key of [
    'acetyl-coa', 'oaa', 'citrate', 'isocitrate', 'alpha-ketoglutarate',
    'succinyl-coa', 'succinate', 'fumarate', 'malate'
  ]) {
    await expect(map.locator(`[data-map-key="${key}"]`)).toHaveCount(1);
  }

  for (const [from, to] of [
    ['acetyl-coa', 'citrate'], ['oaa', 'citrate'], ['citrate', 'isocitrate'],
    ['isocitrate', 'alpha-ketoglutarate'], ['alpha-ketoglutarate', 'succinyl-coa'],
    ['succinyl-coa', 'succinate'], ['succinate', 'fumarate'],
    ['fumarate', 'malate'], ['malate', 'oaa']
  ]) {
    await expect(map.locator(`[data-edge-from="${from}"][data-edge-to="${to}"]`)).toHaveCount(1);
  }

  expect(await map.locator('[data-tca-enzyme]').allTextContents()).toEqual(expect.arrayContaining([
    '柠檬酸合酶', '顺乌头酸酶', '异柠檬酸脱氢酶', 'α-酮戊二酸脱氢酶复合体',
    '琥珀酰-CoA 合成酶', '琥珀酸脱氢酶', '延胡索酸酶', 'MDH2'
  ]));
  for (const key of ['nadh-idh', 'co2-idh', 'nadh-ogdh', 'co2-ogdh', 'gtp', 'coqh2', 'nadh-mdh']) {
    await expect(map.locator(`[data-tca-yield="${key}"]`)).toHaveCount(1);
  }

  await expect(page.locator('#studentMapCount')).toContainText('8 个酶步骤 · 9 个循环节点');
  await expect(page.locator('#studentReactionCount')).toContainText('8 个反应');
  await expect(page.locator('#studentReactions .student-reaction')).toHaveCount(8);
  await expect(page.locator('#studentReactions .student-reaction[data-reaction-aliases]')).toHaveCount(1);
  await expect(map).toContainText('OAA 再生');
  await expect(map).toContainText('内膜复合体 II');
  await expect(map).toContainText('酶内 FAD → CoQH₂');
  await expect(map).toContainText('每轮净收支');
  await expect(map).toContainText('3 NADH');
  await expect(map).toContainText('2 CO₂');
  await expect(map).not.toContainText('FADH₂');
  await expect(map.locator('[data-next-pathway="etc"]')).toContainText('电子传递链');
  await expect(map.locator('[data-map-hint="horizontal"]')).toContainText('碳进入 → 两次脱羧 → 产能 → OAA 再生');

  const hasPageOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(hasPageOverflow).toBe(false);

  for (const viewport of [{ width: 768, height: 1024 }, { width: 1440, height: 1000 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(150);
    const collisions = await map.locator('.student-map-node, .student-map-next-pathway, .student-tca-summary').evaluateAll(nodes => {
      const records = nodes.map(node => ({
        key: node.getAttribute('data-map-key') || node.getAttribute('data-next-pathway') || 'summary',
        rect: node.getBoundingClientRect()
      }));
      const overlaps = [];
      for (let left = 0; left < records.length; left += 1) {
        for (let right = left + 1; right < records.length; right += 1) {
          const first = records[left];
          const second = records[right];
          const width = Math.max(0, Math.min(first.rect.right, second.rect.right)
            - Math.max(first.rect.left, second.rect.left));
          const height = Math.max(0, Math.min(first.rect.bottom, second.rect.bottom)
            - Math.max(first.rect.top, second.rect.top));
          if (width * height > 1) overlaps.push(`${first.key} / ${second.key}`);
        }
      }
      return overlaps;
    });
    expect(collisions).toEqual([]);
  }
});

test('malate aspartate learning map shows the six-event redox shuttle across the inner membrane', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterLearning(page);
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'malate_aspartate';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const map = page.locator('#studentPathwayMap');
  await expect(map).toHaveAttribute('data-map-layout', 'malate-aspartate-cycle');
  for (const zone of ['cytosol', 'transport', 'matrix', 'net']) {
    await expect(map.locator(`[data-shuttle-zone="${zone}"]`)).toHaveCount(1);
  }
  expect(await map.locator('[data-mas-event]').allTextContents()).toEqual(expect.arrayContaining([
    'MDH1', 'SLC25A11', 'MDH2', 'GOT2', 'SLC25A12/13', 'GOT1'
  ]));
  await expect(map.locator('[data-mas-event]')).toHaveCount(6);
  for (const anchor of [
    '胞质 NADH → NAD⁺', '基质 NAD⁺ → NADH',
    '苹果酸入 · α-KG 出', '天冬氨酸出 · 谷氨酸 + H⁺入',
    '还原当量转移', 'NADH 不跨膜', '基质 NADH → 复合体 I'
  ]) {
    await expect(map).toContainText(anchor);
  }

  await expect(page.locator('#studentMapCount')).toContainText('6 个机制事件');
  await expect(page.locator('#studentReactionCount')).toContainText('6 个反应');
  await expect(page.locator('#studentReactions .student-reaction')).toHaveCount(6);
  await expect(page.locator('#studentReactions .student-reaction[data-reaction-aliases]')).toHaveCount(4);
  await expect(map.locator('[data-next-pathway="etc"]')).toContainText('复合体 I');
  await expect(map.locator('[data-map-hint="horizontal"]')).toContainText('胞质半环 → 两台交换器 → 基质半环');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);

  for (const viewport of [{ width: 768, height: 1024 }, { width: 1440, height: 1000 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(150);
    const collisions = await map.locator('.student-map-node, .student-mas-summary, .student-map-next-pathway').evaluateAll(nodes => {
      const rects = nodes.map(node => ({
        key: node.getAttribute('data-map-key') || node.getAttribute('data-next-pathway') || 'summary',
        rect: node.getBoundingClientRect()
      }));
      const overlaps = [];
      for (let left = 0; left < rects.length; left += 1) {
        for (let right = left + 1; right < rects.length; right += 1) {
          const a = rects[left];
          const b = rects[right];
          const width = Math.max(0, Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left));
          const height = Math.max(0, Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top));
          if (width * height > 1) overlaps.push(`${a.key} / ${b.key}`);
        }
      }
      return overlaps;
    });
    expect(collisions).toEqual([]);
  }
});

test('glycerol phosphate learning map shows the four-event shuttle from cytosolic NADH to the CoQ pool', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterLearning(page);
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'glycerol_phosphate';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const map = page.locator('#studentPathwayMap');
  await expect(map).toHaveAttribute('data-map-layout', 'glycerol-phosphate-cycle');
  for (const zone of ['cytosol', 'outer-membrane', 'intermembrane', 'inner-membrane', 'net']) {
    await expect(map.locator(`[data-gp-zone="${zone}"]`)).toHaveCount(1);
  }
  expect(await map.locator('[data-gp-event]').allTextContents()).toEqual(expect.arrayContaining([
    'GPD1', 'VDAC · 甘油-3-P', 'GPD2', 'VDAC · DHAP'
  ]));
  await expect(map.locator('[data-gp-event]')).toHaveCount(4);
  for (const key of [
    'dhap-c', 'g3p-c', 'nadh-c', 'nad-c', 'vdac-g3p', 'g3p-ims',
    'gpd2', 'fad', 'fadh2', 'coq', 'coqh2', 'dhap-ims', 'vdac-dhap'
  ]) {
    await expect(map.locator(`[data-map-key="${key}"]`)).toHaveCount(1);
  }
  for (const anchor of [
    '胞质 NADH → NAD⁺', '酶内 FAD → FADH₂', 'CoQ → CoQH₂',
    'NADH 不跨膜', '不生成基质 NADH', '绕过复合体 I', 'CoQH₂ → 复合体 III'
  ]) {
    await expect(map).toContainText(anchor);
  }

  await expect(page.locator('#studentMapCount')).toContainText('4 个机制事件');
  await expect(page.locator('#studentReactionCount')).toContainText('4 个反应');
  await expect(page.locator('#studentReactions .student-reaction')).toHaveCount(4);
  await expect(page.locator('#studentReactions .student-reaction[data-reaction-aliases]')).toHaveCount(2);
  await expect(map.locator('[data-next-pathway="etc"]')).toContainText('复合体 III');
  await expect(map.locator('[data-map-hint="horizontal"]')).toContainText('GPD1 → VDAC → GPD2 → CoQ 池');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);

  for (const viewport of [{ width: 768, height: 1024 }, { width: 1440, height: 1000 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(150);
    const collisions = await map.locator('.student-map-node, .student-gp-summary, .student-map-next-pathway').evaluateAll(nodes => {
      const rects = nodes.map(node => ({
        key: node.getAttribute('data-map-key') || node.getAttribute('data-next-pathway') || 'summary',
        rect: node.getBoundingClientRect()
      }));
      const overlaps = [];
      for (let left = 0; left < rects.length; left += 1) {
        for (let right = left + 1; right < rects.length; right += 1) {
          const a = rects[left];
          const b = rects[right];
          const width = Math.max(0, Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left));
          const height = Math.max(0, Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top));
          if (width * height > 1) overlaps.push(`${a.key} / ${b.key}`);
        }
      }
      return overlaps;
    });
    expect(collisions).toEqual([]);
  }
});

test('glycolysis learning map makes the ten steps and ATP balance calculable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterLearning(page);
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'glycolysis';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const map = page.locator('#studentPathwayMap');
  await expect(map).toHaveAttribute('data-map-layout', 'glycolysis-ten-step');
  for (const zone of ['investment', 'cleavage', 'payoff', 'net']) {
    await expect(map.locator(`[data-glycolysis-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(map.locator('[data-glycolysis-event]')).toHaveCount(10);
  await expect(map.locator('[data-glycolysis-event].irreversible')).toHaveCount(3);
  for (const key of [
    'glucose', 'g6p', 'f6p', 'f16bp', 'dhap', 'gap',
    'bpg13', 'pg3', 'pg2', 'pep', 'pyruvate'
  ]) {
    await expect(map.locator(`[data-map-key="${key}"]`)).toHaveCount(1);
  }
  for (const anchor of [
    'PFK-1 · 承诺步骤', '后半程每步 ×2', '投入 2 ATP', '产生 4 ATP + 2 NADH',
    '净 2 ATP + 2 NADH + 2 丙酮酸', '需氧：丙酮酸 → PDH', '缺氧 / 红细胞：LDH 再生 NAD⁺'
  ]) {
    await expect(map).toContainText(anchor);
  }
  await expect(page.locator('#studentMapCount')).toContainText('10 个酶步骤');
  await expect(page.locator('#studentReactionCount')).toContainText('10 个反应');
  await expect(page.locator('#studentReactions .student-reaction')).toHaveCount(10);
  await expect(map.locator('[data-next-pathway="pdh"]')).toContainText('PDH');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);

  for (const viewport of [{ width: 768, height: 1024 }, { width: 1440, height: 1000 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(150);
    const collisions = await map.locator('.student-map-node, .student-glycolysis-summary, .student-map-next-pathway, .student-glycolysis-alt-exit').evaluateAll(nodes => {
      const rects = nodes.map(node => ({
        key: node.getAttribute('data-map-key') || node.getAttribute('data-next-pathway') || node.className.baseVal,
        rect: node.getBoundingClientRect()
      }));
      const overlaps = [];
      for (let left = 0; left < rects.length; left += 1) {
        for (let right = left + 1; right < rects.length; right += 1) {
          const a = rects[left];
          const b = rects[right];
          const width = Math.max(0, Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left));
          const height = Math.max(0, Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top));
          if (width * height > 1) overlaps.push(`${a.key} / ${b.key}`);
        }
      }
      return overlaps;
    });
    expect(collisions).toEqual([]);
  }
});

test('gluconeogenesis learning map teaches three bypasses, compartments and the six-phosphate cost', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterLearning(page);
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'gluconeogenesis';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const map = page.locator('#studentPathwayMap');
  await expect(map).toHaveAttribute('data-map-layout', 'gluconeogenesis-three-bypass');
  for (const zone of ['inputs', 'matrix', 'shuttle', 'cytosol', 'er-ledger']) {
    await expect(map.locator(`[data-gluconeogenesis-zone="${zone}"]`)).toHaveCount(1);
  }
  for (const bypass of ['pk', 'pfk1', 'hk-gk']) {
    await expect(map.locator(`[data-gluconeogenesis-bypass="${bypass}"]`)).toHaveCount(1);
  }
  await expect(map.locator('.gluconeogenesis-node')).toHaveCount(18);
  await expect(map.locator('[data-gluconeogenesis-event]')).toHaveCount(8);
  for (const anchor of [
    'OAA 不能直接跨内膜', 'PC + 苹果酸穿梭 + PEPCK', 'G6P 转运入 ER',
    '4 ATP', '2 GTP', '2 NADH', '6 个高能磷酸键',
    '乳酸', '丙氨酸', '甘油', '入口不同，前段成本不同'
  ]) {
    await expect(map).toContainText(anchor);
  }
  await expect(page.locator('#studentMapCount')).toContainText('3 个绕行');
  await expect(page.locator('#studentReactionCount')).toContainText('22 个反应');
  await expect(page.locator('#studentReactions .student-reaction')).toHaveCount(22);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);

  for (const viewport of [{ width: 768, height: 1024 }, { width: 1440, height: 1000 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(150);
    const collisions = await map.locator('.gluconeogenesis-node, .student-gluconeogenesis-ledger, .student-gluconeogenesis-entry').evaluateAll(nodes => {
      const rects = nodes.map(node => ({
        key: node.getAttribute('data-map-key') || node.getAttribute('data-entry') || node.className.baseVal,
        rect: node.getBoundingClientRect()
      }));
      const overlaps = [];
      for (let left = 0; left < rects.length; left += 1) {
        for (let right = left + 1; right < rects.length; right += 1) {
          const a = rects[left];
          const b = rects[right];
          const width = Math.max(0, Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left));
          const height = Math.max(0, Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top));
          if (width * height > 1) overlaps.push(`${a.key} / ${b.key}`);
        }
      }
      return overlaps;
    });
    expect(collisions).toEqual([]);
  }
});

test('glycogenesis learning map separates nucleotide-sugar activation, priming, elongation and branching', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterLearning(page);
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'glycogenesis';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const map = page.locator('#studentPathwayMap');
  await expect(map).toHaveAttribute('data-map-layout', 'glycogenesis-branched-granule');
  for (const zone of ['activation', 'primer', 'elongation', 'branching']) {
    await expect(map.locator(`[data-glycogenesis-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(map.locator('[data-glycogenesis-event]')).toHaveCount(6);
  await expect(map.locator('.glycogenesis-node')).toHaveCount(11);
  for (const anchor of [
    'UTP → UDP-葡萄糖 + PPi', 'PPi 水解驱动', '糖原合酶不能从零起始',
    'α-1,4 延长', 'α-1,6 分支', '多个非还原端',
    '从游离葡萄糖：1 ATP + 1 UTP', '从 G6P：1 UTP'
  ]) {
    await expect(map).toContainText(anchor);
  }
  await expect(page.locator('#studentMapCount')).toContainText('6 个教学事件');
  await expect(page.locator('#studentReactionCount')).toContainText('4 个反应');
  await expect(page.locator('#studentReactions .student-reaction')).toHaveCount(4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);

  for (const viewport of [{ width: 768, height: 1024 }, { width: 1440, height: 1000 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(150);
    const collisions = await map.locator('.glycogenesis-node, .student-glycogenesis-energy').evaluateAll(nodes => {
      const rects = nodes.map(node => ({
        key: node.getAttribute('data-map-key') || node.className.baseVal,
        rect: node.getBoundingClientRect()
      }));
      const overlaps = [];
      for (let left = 0; left < rects.length; left += 1) {
        for (let right = left + 1; right < rects.length; right += 1) {
          const a = rects[left];
          const b = rects[right];
          const width = Math.max(0, Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left));
          const height = Math.max(0, Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top));
          if (width * height > 1) overlaps.push(`${a.key} / ${b.key}`);
        }
      }
      return overlaps;
    });
    expect(collisions).toEqual([]);
  }
});

test('glycogenolysis learning map separates phosphorolysis, debranching and tissue fates', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterLearning(page);
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'glycogenolysis';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const map = page.locator('#studentPathwayMap');
  await expect(map).toHaveAttribute('data-map-layout', 'glycogenolysis-debranch-tissue-split');
  for (const zone of ['chain', 'debranching', 'conversion', 'tissue-fates']) {
    await expect(map.locator(`[data-glycogenolysis-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(map.locator('[data-glycogenolysis-event]')).toHaveCount(7);
  expect(await map.locator('.glycogenolysis-node').count()).toBeGreaterThanOrEqual(12);
  for (const anchor of [
    '停在分支前 4 个残基', '转移 3 个残基', '水解 α-1,6', '释放 1 个游离葡萄糖',
    '肌肉缺少 G6Pase', '就地进入糖酵解', 'G6P 转运入 ER', '腔面 G6Pase',
    '绕过己糖激酶，节省 1 ATP'
  ]) {
    await expect(map).toContainText(anchor);
  }
  await expect(page.locator('#studentMapCount')).toContainText('7 个教学事件');
  await expect(page.locator('#studentReactionCount')).toContainText('6 个反应');
  await expect(page.locator('#studentReactions .student-reaction')).toHaveCount(6);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('PPP learning map separates oxidative yield, reversible carbon rearrangement and demand modes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterLearning(page);
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'ppp';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const map = page.locator('#studentPathwayMap');
  await expect(map).toHaveAttribute('data-map-layout', 'ppp-demand-carbon-balance');
  for (const zone of ['oxidative', 'pentose-hub', 'rearrangement', 'demand-modes']) {
    await expect(map.locator(`[data-ppp-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(map.locator('[data-ppp-event]')).toHaveCount(8);
  expect(await map.locator('.ppp-node').count()).toBeGreaterThanOrEqual(12);
  for (const anchor of [
    '第 1 个 NADPH', '第 2 个 NADPH + CO₂', '净：2 NADPH + CO₂', 'PPP 不直接产生 ATP',
    '转酮酶 1 · TPP · 转移 2C', '转醛酶 · 转移 3C', '转酮酶 2 · TPP · 转移 2C',
    '3×5C ⇌ 2×6C + 1×3C', 'R5P 优先', 'NADPH 优先', '同时需要 NADPH 与 R5P'
  ]) {
    await expect(map).toContainText(anchor);
  }
  await expect(page.locator('#studentMapCount')).toContainText('8 个教学事件');
  await expect(page.locator('#studentReactionCount')).toContainText('8 个反应');
  await expect(page.locator('#studentReactions .student-reaction')).toHaveCount(8);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('fatty acid synthesis learning map separates citrate carbon export, ACC commitment and the seven-cycle FAS ledger', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterLearning(page);
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'fa_synthesis';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const map = page.locator('#studentPathwayMap');
  await expect(map).toHaveAttribute('data-map-layout', 'fa-synthesis-citrate-fas-cycle');
  for (const zone of ['carbon-export', 'commitment', 'fas-cycle', 'ledger-downstream']) {
    await expect(map.locator(`[data-fa-synthesis-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(map.locator('[data-fa-synthesis-event]')).toHaveCount(7);
  expect(await map.locator('.fa-synthesis-node').count()).toBeGreaterThanOrEqual(12);
  for (const anchor of [
    '乙酰-CoA不能直接穿过线粒体内膜', 'SLC25A1', 'ACLY · 消耗 1 ATP',
    'ACC · HCO₃⁻ + 1 ATP · 生物素', '承诺 / 主要调控步骤',
    '缩合', '还原 1', '脱水', '还原 2', '每轮 +2C · 2 NADPH',
    '7 轮：C2 → C4 → C6 → C8 → C10 → C12 → C14 → C16',
    '1 乙酰-CoA + 7 丙二酰-CoA + 14 NADPH',
    '8 乙酰-CoA + 7 ATP + 14 NADPH', 'PPP / 苹果酸酶',
    'malonyl-CoA 抑制 CPT1', 'ER · ELOVL / SCD'
  ]) {
    await expect(map).toContainText(anchor);
  }
  await expect(page.locator('#studentMapCount')).toContainText('7 个教学事件');
  await expect(page.locator('#studentReactionCount')).toContainText('4 个反应');
  await expect(page.locator('#studentReactions .student-reaction')).toHaveCount(4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('carnitine shuttle learning map separates both membranes, CACT antiport and the two CoA pools', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterLearning(page);
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'carnitine';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const map = page.locator('#studentPathwayMap');
  await expect(map).toHaveAttribute('data-map-layout', 'carnitine-double-membrane-antiport');
  for (const zone of ['cytosol-gate', 'outer-membrane', 'inner-membrane-exchange', 'matrix-handoff', 'net']) {
    await expect(map.locator(`[data-carnitine-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(map.locator('[data-carnitine-event]')).toHaveCount(4);
  expect(await map.locator('.carnitine-node').count()).toBeGreaterThanOrEqual(14);
  for (const anchor of [
    '长链脂酰-CoA不跨内膜', 'CPT1 · 外膜胞质侧', 'malonyl-CoA 抑制 CPT1',
    'VDAC · 外膜通道', 'CACT / SLC25A20 · 内膜反向交换',
    '脂酰肉碱入基质', '游离肉碱向外', 'CPT2 · 内膜基质侧',
    '胞质 CoA 池', '基质 CoA 池', 'CoA 不跨内膜', '游离肉碱循环再用',
    '穿梭本身不额外耗 ATP', '上游 ACSL：ATP → AMP + PPi', '进入 β-氧化'
  ]) {
    await expect(map).toContainText(anchor);
  }
  await expect(page.locator('#studentMapCount')).toContainText('4 个核心事件');
  await expect(page.locator('#studentReactionCount')).toContainText('6 个反应');
  await expect(page.locator('#studentReactions .student-reaction')).toHaveCount(6);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('beta oxidation learning map teaches the four-step spiral, electron routes and the C16 ledger', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterLearning(page);
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'beta_oxidation';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const map = page.locator('#studentPathwayMap');
  await expect(map).toHaveAttribute('data-map-layout', 'beta-oxidation-four-step-spiral');
  for (const zone of ['entry-boundary', 'four-step-cycle', 'spiral-ledger', 'pathway-outputs']) {
    await expect(map.locator(`[data-beta-oxidation-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(map.locator('[data-beta-oxidation-event]')).toHaveCount(4);
  expect(await map.locator('.beta-oxidation-node').count()).toBeGreaterThanOrEqual(14);
  for (const anchor of [
    '基质脂酰-CoA', '上游：活化 + 肉碱穿梭', 'trans-Δ²-烯酰-CoA',
    '酶内 FAD → ETF → ETF:QO → CoQ', 'L-β-羟脂酰-CoA', 'H₂O',
    'NAD⁺ → NADH + H⁺', 'CoA-SH', '缩短 2C，返回下一轮',
    '每轮：1 乙酰-CoA + 1 NADH + 1 对电子进入 CoQ',
    'C16 → C14 → C12 → C10 → C8 → C6 → C4',
    '7 轮 → 8 乙酰-CoA + 7 NADH + 7 对电子进入 CoQ',
    '末轮 C4 → 2 乙酰-CoA', 'β-氧化本身不直接产生 ATP',
    '进入 TCA', '进入呼吸链', '饱和偶数链主线'
  ]) {
    await expect(map).toContainText(anchor);
  }
  await expect(page.locator('#studentMapCount')).toContainText('4 个核心事件');
  await expect(page.locator('#studentReactionCount')).toContainText('4 个反应');
  await expect(page.locator('#studentReactions .student-reaction')).toHaveCount(4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('ketone learning map separates hepatic production, blood transport and extrahepatic use', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterLearning(page);
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'ketone';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const map = page.locator('#studentPathwayMap');
  await expect(map).toHaveAttribute('data-map-layout', 'ketone-liver-blood-periphery');
  for (const zone of ['hepatic-ketogenesis', 'circulation-redox', 'extrahepatic-ketolysis', 'tissue-boundary']) {
    await expect(map.locator(`[data-ketone-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(map.locator('[data-ketone-event]')).toHaveCount(7);
  expect(await map.locator('.ketone-node').count()).toBeGreaterThanOrEqual(16);
  for (const anchor of [
    '肝线粒体 · 生成', 'β-氧化提供乙酰-CoA', 'HMGCS2', 'HMGCL',
    '3 个乙酰-CoA参与，1 个返还；净耗 2 个',
    'BDH1 · NADH + H⁺ → NAD⁺', '高 NADH/NAD⁺ 推动 D-β-羟丁酸',
    '丙酮：少量自发脱羧，主要呼出', 'MCT · 血液运输',
    '外周线粒体 · 利用', 'BDH1 · NAD⁺ → NADH + H⁺',
    'SCOT / OXCT1', '琥珀酰-CoA → 琥珀酸', 'SCOT 不直接消耗 ATP',
    '2 乙酰-CoA', '进入 TCA', '肝细胞缺少 SCOT，不能利用自己生成的酮体',
    '红细胞没有线粒体，不能利用酮体', '心 / 骨骼肌 / 肾 / 脑可利用',
    'D-β-羟丁酸不是化学意义的酮'
  ]) {
    await expect(map).toContainText(anchor);
  }
  await expect(page.locator('#studentMapCount')).toContainText('7 个核心事件');
  await expect(page.locator('#studentReactionCount')).toContainText('7 个反应');
  await expect(page.locator('#studentReactions .student-reaction')).toHaveCount(7);
  await expect(map.locator('[data-map-key="acetone"]')).toHaveAttribute('data-reaction', '');
  await expect(map.locator('[data-map-key="acetone"]')).not.toHaveAttribute('role', 'button');
  await expect(map.locator('.ketone-edge.minor')).toHaveAttribute('data-reaction', '');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('transamination learning map separates amino transfer, mitochondrial deamination and the two urea nitrogens', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterLearning(page);
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'transamination';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const map = page.locator('#studentPathwayMap');
  await expect(map).toHaveAttribute('data-map-layout', 'transamination-nitrogen-funnel');
  for (const zone of ['amino-transfer', 'inner-membrane-entry', 'matrix-deamination', 'urea-handoff']) {
    await expect(map.locator(`[data-transamination-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(map.locator('[data-transamination-event]')).toHaveCount(4);
  expect(await map.locator('.transamination-node').count()).toBeGreaterThanOrEqual(18);
  for (const anchor of [
    '氨基酸 + α-KG ⇌ 对应 α-酮酸 + 谷氨酸',
    'ALT / GPT', '丙氨酸 ⇌ 丙酮酸', 'AST / GOT', '天冬氨酸 ⇌ 草酰乙酸',
    'PLP · 维生素 B₆衍生辅酶', '转氨不释放游离 NH₄⁺',
    'GC1 / GC2', 'SLC25A22 / SLC25A18', '谷氨酸 + H⁺同向输入',
    'GDH / GLUD', 'NAD(P)⁺ + H₂O', 'NAD(P)H + H⁺',
    '尿素第 1 份氮', '尿素第 2 份氮', 'CPS1', '天冬氨酸',
    '进入尿素循环', 'α-KG 回到 TCA / 转氨受体池'
  ]) {
    await expect(map).toContainText(anchor);
  }
  await expect(map.locator('[data-next-pathway="urea"]')).toHaveCount(1);
  await expect(map.locator('[data-next-pathway="tca"]')).toHaveCount(1);
  await expect(page.locator('#studentMapCount')).toContainText('4 个核心事件');
  await expect(page.locator('#studentReactionCount')).toContainText('4 个反应');
  await expect(page.locator('#studentReactions .student-reaction')).toHaveCount(4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('urea learning map separates the mitochondrial entry, membrane exchange, cytosolic cycle and atom-energy ledger', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterLearning(page);
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'urea';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const map = page.locator('#studentPathwayMap');
  await expect(map).toHaveAttribute('data-map-layout', 'urea-two-compartment-cycle');
  for (const zone of ['matrix-entry', 'inner-membrane-exchange', 'cytosolic-cycle', 'atom-energy-ledger']) {
    await expect(map.locator(`[data-urea-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(map.locator('[data-urea-step]')).toHaveCount(5);
  expect(await map.locator('.urea-node').count()).toBeGreaterThanOrEqual(19);
  for (const anchor of [
    'NAGS → NAG', 'NAG · CPS1 必需激活因子',
    'NH₄⁺ + HCO₃⁻ + 2 ATP', 'CPS1', '氨甲酰磷酸', 'OTC',
    'ORNT1 / SLC25A15', '鸟氨酸入基质', '瓜氨酸出胞质',
    'citrin / SLC25A13', '天冬氨酸出基质',
    'ASS1 · ATP → AMP + PPi', '精氨代琥珀酸', 'ASL', '延胡索酸',
    'ARG1', '尿素 + 鸟氨酸', '鸟氨酸循环再生',
    '第 1 份氮：NH₄⁺', '第 2 份氮：天冬氨酸', '羰基碳：HCO₃⁻',
    '3 ATP · 4 个高能磷酸键', '天冬氨酸—精氨代琥珀酸旁路'
  ]) {
    await expect(map).toContainText(anchor);
  }
  await expect(map.locator('[data-next-pathway="transamination"]')).toHaveCount(1);
  await expect(map.locator('[data-next-pathway="tca"]')).toHaveCount(1);
  await expect(page.locator('#studentMapCount')).toContainText('5 个核心步骤');
  await expect(page.locator('#studentReactionCount')).toContainText('11 个反应');
  await expect(page.locator('#studentReactions .student-reaction')).toHaveCount(11);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('amino acid carbon learning map resolves seven gateways and the glucogenic ketogenic boundary', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterLearning(page);
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'aa_carbon';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const map = page.locator('#studentPathwayMap');
  await expect(map).toHaveAttribute('data-map-layout', 'aa-carbon-seven-gateways');
  for (const zone of ['nitrogen-handoff', 'seven-gateways', 'metabolic-fates', 'classification-ledger']) {
    await expect(map.locator(`[data-aa-carbon-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(map.locator('[data-aa-carbon-entry]')).toHaveCount(7);
  expect(await map.locator('.aa-carbon-node').count()).toBeGreaterThanOrEqual(18);
  for (const anchor of [
    '转氨 / 脱氨', '氮 → 尿素循环', '不同多步分解路径', '区室依具体路径而异',
    '丙酮酸', '丙氨酸 · 半胱氨酸 · 甘氨酸 · 丝氨酸 · 苏氨酸 · 色氨酸',
    '乙酰-CoA', '乙酰乙酸 / 乙酰乙酰-CoA',
    'α-酮戊二酸', '精氨酸 · 谷氨酸 · 谷氨酰胺 · 组氨酸 · 脯氨酸',
    '琥珀酰-CoA', '异亮氨酸 · 蛋氨酸 · 苏氨酸 · 缬氨酸',
    '延胡索酸', '苯丙氨酸 · 酪氨酸', '草酰乙酸', '天冬氨酸 · 天冬酰胺',
    '生糖入口：丙酮酸 + 4 个 TCA 中间体', '生酮入口：乙酰-CoA + 乙酰乙酸方向',
    '乙酰-CoA不能净生糖', '纯生酮：亮氨酸 · 赖氨酸',
    '兼具两类：异亮氨酸 · 苯丙氨酸 · 苏氨酸 · 色氨酸 · 酪氨酸',
    '分类映射，不是单一反应或统一计量'
  ]) {
    await expect(map).toContainText(anchor);
  }
  for (const pathway of ['transamination', 'tca', 'gluconeogenesis', 'ketone']) {
    await expect(map.locator(`[data-next-pathway="${pathway}"]`)).toHaveCount(1);
  }
  await expect(page.locator('#studentMapCount')).toContainText('7 类中央代谢入口');
  await expect(page.locator('#studentReactionCount')).toContainText('7 个反应');
  await expect(page.locator('#studentReactions .student-reaction')).toHaveCount(7);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('purine learning map builds IMP in ten steps before the energy-balanced AMP GMP split', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterLearning(page);
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'purine';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const map = page.locator('#studentPathwayMap');
  await expect(map).toHaveAttribute('data-map-layout', 'purine-imp-two-branch');
  for (const zone of ['prpp-entry', 'imp-assembly', 'amp-gmp-branch', 'atom-energy-regulation']) {
    await expect(map.locator(`[data-purine-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(map.locator('[data-purine-step]')).toHaveCount(10);
  expect(await map.locator('.purine-node').count()).toBeGreaterThanOrEqual(24);
  for (const anchor of [
    'R5P + ATP → PRPP + AMP', 'PPAT · 第一承诺步骤', 'Gln → Glu + PPi',
    '5-PRA', 'GAR', 'FGAR', 'FGAM', 'AIR', 'CAIR', 'SAICAR', 'AICAR', 'FAICAR', 'IMP',
    'GART · GAR synthetase', 'GART · GAR transformylase', 'PFAS · FGAM synthetase',
    'GART · AIR synthetase', 'PAICS · AIR carboxylase', 'PAICS · SAICAR synthetase',
    'ADSL · SAICAR lyase', 'ATIC · AICAR transformylase', 'ATIC · IMP cyclohydrolase',
    'IMP · AMP / GMP共同分叉',
    'ADSS · Asp + GTP', 'ADSL · AMP + 延胡索酸',
    'IMPDH · NAD⁺ → NADH', 'XMP', 'GMPS · Gln + ATP → AMP + PPi',
    'N3/N9：谷氨酰胺', 'C4/C5/N7：甘氨酸', 'C2/C8：10-甲酰-THF', 'C6：CO₂', 'N1：天冬氨酸',
    '从 R5P 到 IMP：5 个 ATP分子', 'AMP分支用 GTP · GMP分支用 ATP',
    'AMP抑制 ADSS · GMP抑制 IMPDH', 'APRT / HGPRT · 补救合成使用 PRPP',
    '补救合成不属于十步从头主干'
  ]) {
    await expect(map).toContainText(anchor);
  }
  for (const pathway of ['ppp', 'nucleotide_degradation']) {
    await expect(map.locator(`[data-next-pathway="${pathway}"]`)).toHaveCount(1);
  }
  await expect(page.locator('#studentMapCount')).toContainText('10 步成 IMP');
  await expect(page.locator('#studentReactionCount')).toContainText('9 个反应');
  await expect(page.locator('#studentReactions .student-reaction')).toHaveCount(9);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('pyrimidine learning map builds the ring before PRPP and keeps the RNA DNA branches continuous', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterLearning(page);
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'pyrimidine';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const map = page.locator('#studentPathwayMap');
  await expect(map).toHaveAttribute('data-map-layout', 'pyrimidine-ring-first-branch');
  for (const zone of ['cad-ring', 'dhodh-interface', 'umps-ump', 'rna-dna-branch', 'atom-energy-regulation']) {
    await expect(map.locator(`[data-pyrimidine-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(map.locator('[data-pyrimidine-step]')).toHaveCount(6);
  expect(await map.locator('.pyrimidine-node').count()).toBeGreaterThanOrEqual(28);
  for (const anchor of [
    '环先合成，再接 PRPP',
    '1 · CAD · CPS II', '氨甲酰磷酸', '2 · CAD · ATCase', '氨甲酰天冬氨酸',
    '3 · CAD · DHOase', '二氢乳清酸', '4 · DHODH · FMN', 'CoQ → CoQH₂', '乳清酸',
    '5 · UMPS · OPRTase', '乳清酸 + PRPP → OMP + PPi', 'OMP',
    '6 · UMPS · OMP decarboxylase', 'OMP → UMP + CO₂', 'UMP',
    'UDP', 'UTP', 'CTPS · Gln + ATP', 'CTP',
    'RNR · thioredoxin(red)', 'dUDP', 'NDPK', 'dUTP', 'DUT · dUTPase', 'dUMP',
    'TYMS · 5,10-亚甲基-THF', 'DHF', 'dTMP', 'dTTP',
    'dCTP 分支：CDP→dCDP 经 RNR', 'dCMP 脱氨也可形成 dUMP',
    'N3：谷氨酰胺', 'C2：HCO₃⁻', 'N1/C4/C5/C6：天冬氨酸',
    '形成 UMP：CAD/CPS II 直接消耗 2 ATP', 'PRPP 的活化成本另计',
    'UTP抑制 CAD/CPS II · PRPP激活',
    'DHODH锚定线粒体内膜外侧 · 不需要专用转运体'
  ]) {
    await expect(map).toContainText(anchor);
  }
  for (const pathway of ['ppp', 'etc', 'nucleotide_degradation']) {
    await expect(map.locator(`[data-next-pathway="${pathway}"]`)).toHaveCount(1);
  }
  await expect(page.locator('#studentMapCount')).toContainText('6 步成 UMP');
  await expect(page.locator('#studentReactionCount')).toContainText('11 个反应');
  await expect(page.locator('#studentReactions .student-reaction')).toHaveCount(11);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('nucleotide degradation learning map separates shared processing, terminal branches, and salvage boundary', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterLearning(page);
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'nucleotide_degradation';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  const map = page.locator('#studentPathwayMap');
  await expect(map).toHaveAttribute('data-map-layout', 'nucleotide-degradation-branch-ledger');
  for (const zone of ['phosphate-release', 'nucleoside-cleavage', 'purine-branch', 'pyrimidine-branch', 'salvage-ledger']) {
    await expect(map.locator(`[data-nucleotide-degradation-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(map.locator('[data-nucleotide-degradation-step]')).toHaveCount(7);
  expect(await map.locator('.nucleotide-degradation-node').count()).toBeGreaterThanOrEqual(12);
  for (const anchor of [
    '核苷酸', '核苷酸酶', 'Pi', '核苷', '核苷磷酸化酶', '碱基', '核糖-1-磷酸',
    '次黄嘌呤', '鸟嘌呤', '黄嘌呤氧化酶', '尿酸', '尿嘧啶', 'β-丙氨酸',
    '胸腺嘧啶', 'β-氨基异丁酸', '补救回收接口', 'APRT / HGPRT 不属于本图主干'
  ]) await expect(map).toContainText(anchor);
  await expect(page.locator('#studentMapCount')).toContainText('终审反应');
  await expect(page.locator('#studentReactionCount')).toContainText('6 个反应');
  await expect(page.locator('#studentReactions .student-reaction')).toHaveCount(6);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('pathway overview restores structural images and expands opaque abbreviations', async ({ page }) => {
  await enterLearning(page);
  const selectPathway = pathwayId => page.locator('#studentPathwaySelect').evaluate((select, value) => {
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }, pathwayId);

  await selectPathway('fa_synthesis');
  await expect(page.locator('#studentPrimer')).toContainText('乙酰辅酶 A 羧化酶');
  await expect(page.locator('#studentPrimer')).toContainText('先以柠檬酸形式送到细胞质');
  await expect(page.locator('#studentPrimer')).not.toContainText('乙酰辅酶 A 被搬到细胞质');
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

test('second-round quantitative primers keep nucleotide and urea ledgers explicit', async ({ page }) => {
  await enterLearning(page);
  const selectPathway = pathwayId => page.locator('#studentPathwaySelect').evaluate((select, value) => {
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }, pathwayId);

  await selectPathway('urea');
  await expect(page.locator('#studentPrimer')).toContainText('直接消耗 3 ATP');
  await expect(page.locator('#studentPrimer')).toContainText('4 个高能磷酸键');
  await expect(page.locator('#studentPrimer')).toContainText('ASS1 的 ATP→AMP + PPi');

  await selectPathway('purine');
  await expect(page.locator('#studentPrimer')).toContainText('5 个 ATP 分子');
  await expect(page.locator('#studentPrimer')).toContainText('6 个高能磷酸键等价物');
  await expect(page.locator('#studentPrimer')).toContainText('AMP 分支消耗 GTP，GMP 分支经 XMP 消耗 ATP');

  await selectPathway('pyrimidine');
  await expect(page.locator('#studentPrimer')).toContainText('必须经过 UDP/CDP');
  await expect(page.locator('#studentPrimer')).toContainText('只还原 UDP/CDP');
  await expect(page.locator('#studentPrimer')).toContainText('dUDP 经 dUTP→dUMP→dTMP→dTTP');
  await expect(page.locator('#studentPrimer')).toContainText('dCDP 经 dCTP 支路');
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
