const { test, expect, appUrl } = require('./helpers.js');

const URL = appUrl('topic-canvas-max-1');

async function openTopic(page) {
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await expect(page.locator('#studentWorkspace')).toBeVisible();
  await page.locator('.student-sidebar-toggle').hover();
  await expect.poll(() => page.locator('#studentCatalogBody').evaluate(element => Number.parseFloat(getComputedStyle(element).opacity))).toBeGreaterThan(.99);
  await page.waitForTimeout(80);
  await page.locator('.student-topic-card[data-topic="carbohydrate"]').click();
  await expect(page.locator('#studentTopicPanel')).toBeVisible();
  await page.locator('#studentTopicAtlas > summary').click();
  await page.locator('[data-topic-view="lanes"]').click();
  await page.mouse.move(1320, 720);
  await page.locator('.student-topic-stage').focus();
  await page.waitForTimeout(260);
}

test('both learning sidebars default to compact rails and can be pinned open', async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openTopic(page);

  const compact = await page.evaluate(() => {
    const layout = document.querySelector('.student-layout');
    const catalog = document.querySelector('.lesson-catalog').getBoundingClientRect();
    const lane = document.querySelector('.student-topic-pinned-lane').getBoundingClientRect();
    const stage = document.querySelector('.student-topic-stage').getBoundingClientRect();
    const firstNode = document.querySelector('.student-topic-node').getBoundingClientRect();
    return {
      catalogCollapsed: layout.classList.contains('catalog-collapsed'),
      lanesCollapsed: document.querySelector('.student-topic-stage').classList.contains('topic-lanes-collapsed'),
      catalogWidth: catalog.width,
      laneWidth: lane.width,
      nodeOffset: firstNode.left - stage.left
    };
  });
  expect(compact.catalogCollapsed).toBe(true);
  expect(compact.lanesCollapsed).toBe(true);
  expect(compact.catalogWidth).toBeLessThanOrEqual(46);
  expect(compact.laneWidth).toBeLessThanOrEqual(54);
  expect(compact.nodeOffset).toBeLessThan(190);
  await page.screenshot({ path: '../output/playwright/ui-collapsible-sidebars-default.png' });

  const flowWidthCompact = await page.locator('#flowPanel').evaluate(element => element.getBoundingClientRect().width);
  await page.locator('#studentSidebarToggle').click();
  await page.waitForTimeout(280);
  await expect(page.locator('.student-layout')).not.toHaveClass(/catalog-collapsed/);
  await expect(page.locator('#studentSidebarToggle')).toHaveAttribute('aria-expanded', 'true');
  const flowWidthOpen = await page.locator('#flowPanel').evaluate(element => element.getBoundingClientRect().width);
  expect(flowWidthCompact - flowWidthOpen).toBeGreaterThan(170);

  await page.locator('#studentTopicLanesToggle').click();
  await page.waitForTimeout(280);
  await expect(page.locator('.student-topic-stage')).not.toHaveClass(/topic-lanes-collapsed/);
  await expect(page.locator('#studentTopicLanesToggle')).toHaveAttribute('aria-expanded', 'true');
  const openLane = await page.locator('.student-topic-pinned-lane').first().evaluate(element => element.getBoundingClientRect().width);
  const openNodeOffset = await page.evaluate(() => {
    const stage = document.querySelector('.student-topic-stage').getBoundingClientRect();
    const node = document.querySelector('.student-topic-node').getBoundingClientRect();
    return node.left - stage.left;
  });
  expect(openLane).toBeGreaterThan(280);
  expect(openNodeOffset).toBeGreaterThan(300);
  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test('collapsed rails reveal on hover without shrinking the map', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openTopic(page);
  const flowWidth = await page.locator('#flowPanel').evaluate(element => element.getBoundingClientRect().width);

  await page.locator('.student-topic-pinned-lane').nth(2).hover();
  await page.waitForTimeout(240);
  const lanePeek = await page.evaluate(() => ({
    width: document.querySelector('.student-topic-pinned-lane').getBoundingClientRect().width,
    labelVisibility: getComputedStyle(document.querySelector('.student-topic-pinned-lane span')).visibility,
    flowWidth: document.querySelector('#flowPanel').getBoundingClientRect().width
  }));
  expect(lanePeek.width).toBeGreaterThan(280);
  expect(lanePeek.labelVisibility).toBe('visible');
  expect(Math.abs(lanePeek.flowWidth - flowWidth)).toBeLessThanOrEqual(1);
  await page.screenshot({ path: '../output/playwright/ui-collapsible-topic-lanes-hover.png' });

  await page.locator('.student-topic-stage').focus();
  await page.locator('#studentSidebarToggle').hover();
  await page.waitForTimeout(240);
  const catalogPeek = await page.evaluate(() => ({
    visibility: getComputedStyle(document.querySelector('#studentCatalogBody')).visibility,
    opacity: Number.parseFloat(getComputedStyle(document.querySelector('#studentCatalogBody')).opacity),
    flowWidth: document.querySelector('#flowPanel').getBoundingClientRect().width
  }));
  expect(catalogPeek.visibility).toBe('visible');
  expect(catalogPeek.opacity).toBeGreaterThan(.9);
  expect(Math.abs(catalogPeek.flowWidth - flowWidth)).toBeLessThanOrEqual(1);
  await page.screenshot({ path: '../output/playwright/ui-collapsible-catalog-hover.png' });
});

test('mobile uses a tap-to-expand catalog without hover dependency', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.waitForTimeout(950);
  await expect(page.locator('.student-layout')).toHaveClass(/catalog-collapsed/);
  await expect(page.locator('#studentCatalogBody')).toBeHidden();
  await expect(page.locator('#studentTopicLanesToggle')).toBeHidden();
  await page.locator('#studentSidebarToggle').click();
  await expect(page.locator('.student-layout')).not.toHaveClass(/catalog-collapsed/);
  await expect(page.locator('#studentCatalogBody')).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.screenshot({ path: '../output/playwright/ui-collapsible-sidebar-mobile.png', fullPage: true });
});

test('top navigation can collapse, peek from the top edge, and pin open again', async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.setViewportSize({ width: 1200, height: 700 });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.waitForTimeout(950);

  await expect(page.locator('body')).not.toHaveClass(/topbar-collapsed/);
  await page.locator('#topbarCollapseToggle').click();
  await page.waitForTimeout(320);
  await expect(page.locator('body')).toHaveClass(/topbar-collapsed/);
  await expect(page.locator('#topbarRevealButton')).toBeVisible();
  const collapsed = await page.evaluate(() => ({
    opacity: Number.parseFloat(getComputedStyle(document.querySelector('.topbar')).opacity),
    pointerEvents: getComputedStyle(document.querySelector('.topbar')).pointerEvents,
    workspacePaddingTop: Number.parseFloat(getComputedStyle(document.querySelector('.student-workspace')).paddingTop)
  }));
  expect(collapsed.opacity).toBeLessThan(.05);
  expect(collapsed.pointerEvents).toBe('none');
  expect(collapsed.workspacePaddingTop).toBeLessThan(50);
  await page.screenshot({ path: '../output/playwright/ui-topbar-collapsed.png' });

  await page.locator('#topbarRevealZone').hover({ position: { x: 850, y: 5 } });
  await page.waitForTimeout(320);
  const peekOpacity = await page.locator('.topbar').evaluate(element => Number.parseFloat(getComputedStyle(element).opacity));
  expect(peekOpacity).toBeGreaterThan(.95);
  await page.screenshot({ path: '../output/playwright/ui-topbar-hover-peek.png' });

  await page.locator('#topbarCollapseToggle').click();
  await page.waitForTimeout(320);
  await expect(page.locator('body')).not.toHaveClass(/topbar-collapsed/);
  await expect(page.locator('#topbarRevealButton')).toBeHidden();
  await expect(page.locator('#topbarCollapseToggle')).toHaveAttribute('aria-expanded', 'true');
  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test('topic canvas is taller by default and supports an immersive viewport mode', async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openTopic(page);

  const defaultCanvas = await page.locator('.student-topic-stage').evaluate(element => ({
    height: element.getBoundingClientRect().height,
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight
  }));
  expect(defaultCanvas.height).toBeGreaterThanOrEqual(690);
  expect(defaultCanvas.scrollWidth).toBeGreaterThan(defaultCanvas.clientWidth);
  expect(defaultCanvas.scrollHeight).toBeGreaterThan(defaultCanvas.clientHeight);
  await page.screenshot({ path: '../output/playwright/ui-topic-canvas-larger.png', fullPage: true });

  await page.locator('#studentTopicMaximize').click();
  await page.waitForTimeout(160);
  await expect(page.locator('body')).toHaveClass(/student-topic-maximized/);
  await expect(page.locator('#studentTopicMaximize')).toHaveAttribute('aria-pressed', 'true');
  const maximized = await page.evaluate(() => {
    const panel = document.querySelector('#flowPanel').getBoundingClientRect();
    const stage = document.querySelector('.student-topic-stage');
    return {
      panel: { top: panel.top, left: panel.left, right: panel.right, bottom: panel.bottom },
      stageHeight: stage.getBoundingClientRect().height,
      viewport: { width: innerWidth, height: innerHeight }
    };
  });
  expect(maximized.panel.top).toBeLessThanOrEqual(12);
  expect(maximized.panel.left).toBeLessThanOrEqual(12);
  expect(maximized.viewport.width - maximized.panel.right).toBeLessThanOrEqual(12);
  expect(maximized.viewport.height - maximized.panel.bottom).toBeLessThanOrEqual(12);
  expect(maximized.stageHeight).toBeGreaterThan(defaultCanvas.height);

  await page.locator('[data-topic-pan="right"]').click();
  await page.waitForTimeout(500);
  expect(await page.locator('.student-topic-stage').evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
  await page.screenshot({ path: '../output/playwright/ui-topic-canvas-maximized.png' });

  await page.keyboard.press('Escape');
  await expect(page.locator('body')).not.toHaveClass(/student-topic-maximized/);
  await expect(page.locator('#studentTopicMaximize')).toHaveAttribute('aria-pressed', 'false');

  await page.locator('#studentTopicMaximize').click();
  await page.locator('.student-topic-node').first().click({ force: true });
  await expect(page.locator('#studentPathwayPanel')).toBeVisible();
  await expect(page.locator('body')).not.toHaveClass(/student-topic-maximized/);
  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test('immersive topic canvas also fits the mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.waitForTimeout(900);
  await page.locator('#studentSidebarToggle').click();
  await page.locator('.student-topic-card[data-topic="carbohydrate"]').click();
  await page.locator('#studentTopicAtlas > summary').click();
  await page.locator('[data-topic-view="lanes"]').click();
  await page.locator('#studentTopicMaximize').click();
  await expect(page.locator('body')).toHaveClass(/student-topic-maximized/);
  await expect(page.locator('.topbar')).toHaveCSS('opacity', '0');
  const mobile = await page.evaluate(() => {
    const panel = document.querySelector('#flowPanel').getBoundingClientRect();
    const stage = document.querySelector('.student-topic-stage').getBoundingClientRect();
    return {
      panelWidth: panel.width,
      panelHeight: panel.height,
      stageHeight: stage.height,
      documentOverflow: document.documentElement.scrollWidth - innerWidth
    };
  });
  expect(mobile.panelWidth).toBeGreaterThanOrEqual(378);
  expect(mobile.panelHeight).toBeGreaterThanOrEqual(830);
  expect(mobile.stageHeight).toBeGreaterThan(620);
  expect(mobile.documentOverflow).toBeLessThanOrEqual(1);
  await page.screenshot({ path: '../output/playwright/ui-topic-canvas-maximized-mobile.png' });
});
