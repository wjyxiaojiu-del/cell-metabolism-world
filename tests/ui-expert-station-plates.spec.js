const { test, expect, appUrl } = require('./helpers.js');

const URL = appUrl('etc-station-plates-1');

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

test('ETC mechanism page exposes the five-station causal plates', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await enterExpertMap(page);

  await openEtcMechanism(page);
  const stations = page.locator('#sceneViews .scene-station-view');
  await expect(stations).toHaveCount(5);
  await expect(stations.nth(0)).toContainText('复合体 I');
  await expect(stations.nth(4)).toContainText('ATP 合酶');

  await stations.nth(1).click();
  await expect(page.locator('#sceneDeck')).toHaveClass(/pathway-station-active/);
  await expect(page.locator('#sceneBackground')).toHaveAttribute('src', /etc-step-2-complex-iii\.webp/);
  const overlayOpacity = await page.locator('#sceneExpertOverlay').evaluate(node => Number(getComputedStyle(node).opacity));
  expect(overlayOpacity).toBe(0);
  await expect(page.locator('#sceneLevelHint')).toContainText('五站机制图');
  await expect(page.locator('#sceneDescription')).toContainText('复合体 III');
  await expect(page.locator('#sceneBackground')).toHaveAttribute('aria-label', /放大查看站 2/);

  await stations.nth(1).click();
  await expect(page.locator('#pathwayVisualDialog')).toBeVisible();
  await expect(page.locator('#pathwayVisualDialogImage')).toHaveAttribute('src', /etc-step-2-complex-iii\.webp/);
  await page.locator('#pathwayVisualDialogClose').click();
  await expect(page.locator('#pathwayVisualDialog')).toBeHidden();

  await page.locator('#sceneBack').click();
  await expect(page.locator('#sceneDeck')).not.toHaveClass(/pathway-station-active/);
  const restoredOpacity = await page.locator('#sceneExpertOverlay').evaluate(node => Number(getComputedStyle(node).opacity));
  expect(restoredOpacity).toBeGreaterThan(0);
  await expect(page.locator('#sceneBackground')).not.toHaveAttribute('src', /etc-step/);

  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
});

test('station plates stay reachable on mobile and restore the mechanism overlay', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);

  await openEtcMechanism(page);
  const stations = page.locator('#sceneViews .scene-station-view');
  await expect(stations).toHaveCount(5);

  await stations.nth(3).click();
  await expect(page.locator('#sceneDeck')).toHaveClass(/pathway-station-active/);
  await expect(page.locator('#sceneBackground')).toHaveAttribute('src', /etc-step-4-proton-gradient\.webp/);
  const strip = await page.locator('#sceneViews').evaluate(node => ({
    scrollable: node.scrollWidth >= node.clientWidth,
    clipped: node.scrollWidth - node.clientWidth
  }));
  expect(strip.clipped).toBeGreaterThanOrEqual(0);

  await page.locator('#sceneBack').click();
  await expect(page.locator('#sceneDeck')).not.toHaveClass(/pathway-station-active/);

  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
});
