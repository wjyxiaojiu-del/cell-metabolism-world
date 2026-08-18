const { test, expect, appUrl } = require('./helpers.js');

test('all scene views have structural teaching annotations', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(appUrl('scene-annotations-1'), { waitUntil: 'networkidle' });

  const coverage = await page.evaluate(() => {
    const atlas = window.METABOLIC_ATLAS_DATA;
    const missing = [];
    let viewCount = 0;
    for (const [sceneId, scene] of Object.entries(atlas.scenes)) {
      scene.views.forEach((_, viewIndex) => {
        viewCount += 1;
        const mapEntry = atlas.sceneAnnotationProfileMap[sceneId];
        const profileId = Array.isArray(mapEntry) ? mapEntry[viewIndex] : mapEntry;
        const annotations = atlas.annotationProfiles[profileId] || [];
        if (annotations.length < 4) missing.push(`${sceneId}:${viewIndex}`);
      });
    }
    return { viewCount, missing };
  });
  expect(coverage.viewCount).toBe(42);
  expect(coverage.missing).toEqual([]);

  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.locator('#studentSidebarToggle').click();
  await page.locator('#studentOrganelleBtn').click();
  await expect(page.locator('#sceneDeck')).toHaveClass(/open/);
  await expect(page.locator('.scene-landmark')).toHaveCount(7);
  await expect(page.locator('#sceneAnnotationCount')).toHaveText('7 个讲解地标');
  await expect(page.locator('.scene-annotation-reader')).toContainText('细胞质基质');
  await expect(page.locator('#sceneViews .scene-view')).toHaveCount(4);
  await expect(page.locator('#sceneViews')).not.toContainText('标注');
  const cellViewSources = await page.evaluate(() => window.METABOLIC_ATLAS_DATA.scenes['cell-atlas'].views.map(view => Array.isArray(view) ? view[1] : view.src));
  expect(cellViewSources.some(source => source.includes('13-cell-overview-annotated'))).toBe(false);
  await expect(page.locator('#sceneDeck')).not.toHaveClass(/loading|switching/);
  await page.locator('#sceneDeck').screenshot({ path: 'output/playwright/cell-atlas-clean-views.png' });

  await page.locator('.scene-hotspot[data-target="plasma-membrane"]').click();
  await page.getByRole('button', { name: '质膜横截面', exact: true }).click();
  await expect(page.locator('.scene-landmark')).toHaveCount(6);
  await expect(page.locator('.scene-annotation-reader')).toContainText('胞外液');
  await page.locator('.scene-landmark').nth(2).click();
  await expect(page.locator('.scene-annotation-reader')).toContainText('疏水脂肪酸尾部');

  const mapContainment = await page.evaluate(() => {
    const map = document.querySelector('.scene-map').getBoundingClientRect();
    const labels = [...document.querySelectorAll('.scene-landmark-label')].filter(label => getComputedStyle(label).display !== 'none');
    return labels.every(label => {
      const box = label.getBoundingClientRect();
      return box.left >= map.left - 1 && box.right <= map.right + 1 && box.top >= map.top - 1 && box.bottom <= map.bottom + 1;
    });
  });
  expect(mapContainment).toBe(true);

  const toggle = page.locator('#sceneAnnotationToggle');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('#sceneDeck')).toHaveClass(/annotations-hidden/);
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#sceneDeck').screenshot({ path: 'output/playwright/scene-annotations-plasma-membrane.png' });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.scene-landmark')).toHaveCount(6);
  const hasPageOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(hasPageOverflow).toBe(false);
  await page.locator('#sceneDeck').screenshot({ path: 'output/playwright/scene-annotations-mobile.png' });
  expect(pageErrors).toEqual([]);
});

test('plant metabolism uses plant-specific spatial views', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(appUrl('plant-scene-corrected-1'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.locator('#studentSidebarToggle').click();
  await page.locator('#studentOrganelleBtn').click();
  await page.locator('.scene-hotspot[data-target="plant-extension"]').click();

  await expect(page.locator('#sceneTitle')).toHaveText('植物细胞代谢扩展');
  await expect(page.locator('#sceneDescription')).not.toContainText('动物细胞');
  await expect(page.locator('#sceneBackground')).toHaveAttribute('src', /37-plant-cell-overview\.svg$/);
  await expect(page.locator('#sceneAnnotationCount')).toHaveText('6 个讲解地标');
  await expect(page.locator('.scene-annotation-reader')).toContainText('中央液泡');
  await expect(page.locator('#scopeLocal')).toBeEmpty();
  await expect(page.locator('#scopeTransportCount')).toHaveText('2 条连接');
  await expect(page.locator('#scopeTransport')).toContainText('亚硝酸盐 · 细胞质 → 质体（机制待审校）');

  const overviewPixels = await page.locator('#sceneBackground').evaluate(image => {
    const canvas = document.createElement('canvas');
    canvas.width = 80; canvas.height = 50;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const colors = new Set();
    for (let index = 0; index < pixels.length; index += 64) colors.add(`${pixels[index]},${pixels[index + 1]},${pixels[index + 2]}`);
    return colors.size;
  });
  expect(overviewPixels).toBeGreaterThan(20);
  await page.locator('#sceneDeck').screenshot({ path: 'output/playwright/plant-cell-overview-corrected.png' });

  await page.getByRole('button', { name: '质体—乙醛酸体接口', exact: true }).click();
  await expect(page.locator('#sceneBackground')).toHaveAttribute('src', /38-plant-organelle-interface\.svg$/);
  await expect(page.locator('.scene-annotation-reader')).toContainText('质体基质');
  await page.locator('#sceneDeck').screenshot({ path: 'output/playwright/plant-organelle-interface-corrected.png' });

  await page.setViewportSize({ width: 390, height: 844 });
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(hasOverflow).toBe(false);
  await page.locator('#sceneDeck').screenshot({ path: 'output/playwright/plant-cell-scene-mobile.png' });
  expect(pageErrors).toEqual([]);
});
