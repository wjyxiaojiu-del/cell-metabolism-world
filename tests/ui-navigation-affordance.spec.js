const { test, expect, appUrl } = require('./helpers.js');

const URL = appUrl('navigation-affordance-1');

async function enterExpertMap(page) {
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await expect(page.locator('#studentWorkspace')).toBeVisible();
  await page.getByRole('button', { name: '专家地图', exact: true }).click();
  await expect(page.locator('body')).toHaveClass(/expert-map/);
  await expect(page.locator('.pathbar')).toBeVisible();
  await page.waitForTimeout(350);
}

function watchRuntimeErrors(page) {
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  return { consoleErrors, pageErrors };
}

async function openEtcMechanism(page) {
  await page.locator('.path-filter[data-path="etc"]').click();
  await page.locator('#expertPathPreview').click();
  if (await page.locator('#sceneDeck.pathway-visual-active[data-pathway="etc"]').count()) return;
  const hotspot = page.locator('#sceneHotspots .scene-hotspot[data-pathway="etc"]');
  if (await hotspot.count()) await hotspot.first().click({ force: true });
  else await page.locator('.scene-route-lane[data-pathway="etc"]').click({ force: true });
  await expect(page.locator('#sceneDeck.pathway-visual-active[data-pathway="etc"]')).toBeAttached();
}

async function statusLine(page) {
  return page.locator('#sceneSource');
}

test('hovering jump targets announces the destination in the scene status line', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await enterExpertMap(page);
  await openEtcMechanism(page);
  const status = await statusLine(page);
  await expect(status).toContainText('当前视角');

  // 视角条按钮：机制页上「当前通路图」处于激活态，提示「再点一次放大」；
  // 切到站视图后它变为未激活，提示回到「点击进入」。
  const pathwayView = page.locator('#sceneViews .scene-pathway-view');
  await pathwayView.hover();
  await expect(status).toContainText('再点一次放大：');
  await page.mouse.move(10, 10);
  await expect(status).toContainText('当前视角');

  const stations = page.locator('#sceneViews .scene-station-view');
  await stations.nth(0).hover();
  await expect(status).toContainText('点击查看：站 1');
  await page.mouse.move(10, 10);
  await stations.nth(0).click();
  await expect(page.locator('#sceneDeck')).toHaveClass(/pathway-station-active/);
  await page.mouse.move(10, 10);
  await stations.nth(0).hover();
  await expect(status).toContainText('再点一次放大：站 1');
  await page.mouse.move(10, 10);
  await pathwayView.hover();
  await expect(status).toContainText('点击进入：');
  await page.mouse.move(10, 10);

  // 返回机制页后切到同场景的结构视图：泳道悬停显示去向，caption 写明进入机制图。
  await page.locator('#sceneBack').click();
  await expect(page.locator('#sceneDeck')).not.toHaveClass(/pathway-station-active/);
  await page.locator('#scopeTransport .scope-item', { hasText: '查看区室结构' }).click();
  await expect(page.locator('#sceneDeck')).not.toHaveClass(/pathway-visual-active/);

  const lanes = page.locator('.scene-route-lane');
  if (await lanes.count()) {
    await lanes.first().hover();
    await expect(status).toContainText('点击进入：');
    await page.mouse.move(10, 10);
    await expect(status).toContainText('当前视角');
    const captions = await page.locator('.scene-route-caption').allInnerTexts();
    for (const caption of captions) expect(caption).not.toContain('点击查看通路详情');
  }

  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
});

test('pathway hotspots carry the jump arrow on non-subcompartment scenes', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await enterExpertMap(page);

  await page.locator('.path-filter[data-path="glycolysis"]').click();
  await page.locator('#expertPathPreview').click();
  await expect(page.locator('#sceneDeck.pathway-visual-active[data-pathway="glycolysis"]')).toBeAttached();
  await page.locator('#scopeTransport .scope-item', { hasText: '查看区室结构' }).click();
  await expect(page.locator('#sceneDeck')).not.toHaveClass(/pathway-visual-active/);

  const pathwayHotspot = page.locator('#sceneHotspots .scene-hotspot[data-pathway]').first();
  await expect(pathwayHotspot).toBeVisible();
  const arrow = await pathwayHotspot.evaluate(node => getComputedStyle(node, '::after').content);
  expect(arrow).toContain('↗');
  const status = await statusLine(page);
  await pathwayHotspot.hover();
  await expect(status).toContainText('点击进入：');
  await page.mouse.move(10, 10);
  await expect(status).toContainText('当前视角');

  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
});

test('pathway preview card states the destination before entering', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await enterExpertMap(page);

  await page.locator('.path-filter[data-path="tca"]').click();
  const preview = page.locator('#expertPathPreview');
  await expect(preview).toBeVisible();
  await expect(page.locator('#expertPathPreviewCaption')).toContainText('点这里进入机制图');
  await expect(page.locator('#expertPathPreviewCaption')).toContainText('线粒体基质');

  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
});
