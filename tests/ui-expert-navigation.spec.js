const { test, expect, appUrl } = require('./helpers.js');

const URL = appUrl('expert-feature-nav-1');

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

test('expert pathway navigation is a large two-row feature dock on desktop', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await enterExpertMap(page);

  const metrics = await page.evaluate(() => {
    const dock = document.querySelector('.pathbar');
    const filters = document.querySelector('.path-filters');
    const button = document.querySelector('.path-filter');
    const dockStyle = getComputedStyle(dock);
    const filterStyle = getComputedStyle(filters);
    const buttonStyle = getComputedStyle(button);
    return {
      pageOverflow: document.documentElement.scrollWidth - innerWidth,
      dockHeight: dock.getBoundingClientRect().height,
      dockRadius: parseFloat(dockStyle.borderTopLeftRadius),
      dockDisplay: dockStyle.display,
      columns: dockStyle.gridTemplateColumns,
      filterDisplay: filterStyle.display,
      filterRows: filterStyle.gridTemplateRows,
      buttonHeight: button.getBoundingClientRect().height,
      canScrollPathways: filters.scrollWidth > filters.clientWidth,
      pathwayCount: document.querySelectorAll('.path-filter').length
    };
  });

  expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  expect(metrics.dockHeight).toBeGreaterThanOrEqual(128);
  expect(metrics.dockRadius).toBeGreaterThanOrEqual(28);
  expect(metrics.dockDisplay).toBe('grid');
  expect(metrics.columns.split(' ').length).toBe(3);
  expect(metrics.filterDisplay).toBe('grid');
  expect(metrics.filterRows.split(' ').length).toBe(2);
  expect(metrics.buttonHeight).toBeGreaterThanOrEqual(42);
  expect(metrics.canScrollPathways).toBe(true);
  expect(metrics.pathwayCount).toBe(22);
  await expect(page.locator('.path-filter[data-path="autophagy"]')).toHaveCount(0);
  await expect(page.locator('.path-filter[data-path="etc"]')).toHaveCount(1);

  const wheelBatching = await page.locator('#viewport').evaluate(async svg => {
    let viewBoxChanges = 0;
    const initialViewBox = svg.getAttribute('viewBox');
    const observer = new MutationObserver(records => {
      viewBoxChanges += records.filter(record => record.attributeName === 'viewBox').length;
    });
    observer.observe(svg, { attributes: true, attributeFilter: ['viewBox'] });
    for (let index = 0; index < 24; index += 1) {
      svg.dispatchEvent(new WheelEvent('wheel', {
        bubbles: true,
        cancelable: true,
        deltaY: -4,
        clientX: innerWidth / 2,
        clientY: innerHeight / 2
      }));
    }
    await new Promise(resolve => setTimeout(resolve, 140));
    observer.disconnect();
    return { initialViewBox, finalViewBox: svg.getAttribute('viewBox'), viewBoxChanges };
  });
  expect(wheelBatching.finalViewBox).not.toBe(wheelBatching.initialViewBox);
  expect(wheelBatching.viewBoxChanges).toBeLessThanOrEqual(2);

  const target = page.locator('.path-filter').nth(2);
  await target.click();
  await expect(target).toHaveClass(/active/);
  await expect(page.locator('body')).toHaveClass(/pathway-focus/);
  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
  await page.screenshot({ path: '../output/playwright/ui-feature-expert-nav-desktop.png' });
});

test('expert overview hides dense secondary nodes until their pathway is selected', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.setViewportSize({ width: 1194, height: 834 });
  await enterExpertMap(page);

  const overviewState = await page.locator('#entityLayer .entity-secondary').evaluateAll(nodes => ({
    count: nodes.length,
    visible: nodes.filter(node => {
      const style = getComputedStyle(node);
      return style.visibility !== 'hidden' && Number(style.opacity) > 0;
    }).length
  }));
  expect(overviewState.count).toBeGreaterThan(0);
  expect(overviewState.visible).toBe(0);

  const pathway = page.locator('.path-filter[data-path="purine"]');
  await expect(pathway).toBeVisible();
  await pathway.click();
  await expect(page.locator('body')).toHaveClass(/pathway-focus/);
  await expect(page.locator('#entityLayer .entity-secondary.pathway-active').first()).toHaveCSS('visibility', 'visible');
  await page.waitForTimeout(280);

  const selectedState = await page.locator('#entityLayer .entity-secondary.pathway-active').evaluateAll(nodes => ({
    count: nodes.length,
    visible: nodes.filter(node => {
      const style = getComputedStyle(node);
      return style.visibility === 'visible' && Number(style.opacity) > .8;
    }).length
  }));
  expect(selectedState.count).toBeGreaterThan(0);
  expect(selectedState.visible).toBe(selectedState.count);
  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
});

test('all 21 core expert pathways expose a loadable visual entry', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await enterExpertMap(page);

  const audit = await page.evaluate(async () => {
    const buttons = [...document.querySelectorAll('.path-filter')].filter(button => button.dataset.path !== 'all');
    const missing = [];
    const broken = [];
    const sources = new Set();
    for (const button of buttons) {
      button.click();
      const image = document.querySelector('#expertPathPreviewImage');
      const source = image?.getAttribute('src');
      if (!source) { missing.push(button.dataset.path); continue; }
      sources.add(source);
      try { await image.decode(); } catch { broken.push(button.dataset.path); }
    }
    return { count: buttons.length, missing, broken, sourceCount: sources.size };
  });

  expect(audit.count).toBe(21);
  expect(audit.missing).toEqual([]);
  expect(audit.broken).toEqual([]);
  expect(audit.sourceCount).toBeGreaterThanOrEqual(6);
  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
});

test('expert pathway preview enters its organelle and shows local route lanes', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await enterExpertMap(page);

  const pathway = page.locator('.path-filter[data-path="pdh"]');
  await pathway.click();
  await expect(page.locator('#expertPathPreview')).toBeVisible();
  await expect(page.locator('#expertPathPreviewImage')).toHaveAttribute('src', /39-pdh-complex-mechanism\.svg/);
  const selectedOverflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(selectedOverflow).toBeLessThanOrEqual(1);
  await page.locator('#expertPathPreview').click();
  await expect(page.locator('body')).toHaveClass(/scene-open/);
  await expect(page.locator('#sceneTitle')).toHaveText('线粒体基质代谢');
  await expect(page.locator('#sceneBackground')).toHaveAttribute('src', /39-pdh-complex-mechanism\.svg/);
  await expect(page.locator('.scene-pathway-view')).toHaveClass(/active/);
  await expect(page.locator('#sceneDeck')).toHaveClass(/pathway-visual-active/);
  await expect(page.locator('#sceneAnnotationCount')).toHaveText('机制图模式');
  await expect(page.locator('#sceneHotspots')).toBeEmpty();
  await page.locator('.scene-pathway-view').click();
  await expect(page.locator('#pathwayVisualDialog')).toBeVisible();
  await page.locator('#pathwayVisualDialogClose').click();
  await expect(page.locator('#sceneRouteLanes .scene-route-lane')).toHaveCount(6);
  await expect(page.locator('#sceneRouteLaneCount')).toHaveText('6 条');
  await page.locator('#sceneRouteLanes .scene-route-lane').first().click();
  await expect(page.locator('#inspectorName')).toHaveText('丙酮酸脱氢酶复合体');
  await expect(page.locator('#sceneRouteLanes .scene-route-lane').first()).toHaveClass(/active/);
  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
});

test('core route lanes expose pathway visuals and switch the scene image with the selected lane', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await enterExpertMap(page);

  await page.locator('.path-filter[data-path="etc"]').click();
  await page.locator('#expertPathPreview').click();
  const laneState = await page.locator('#sceneRouteLanes .scene-route-lane').evaluateAll(nodes => ({
    count: nodes.length,
    withThumb: nodes.filter(node => node.querySelector('.scene-route-lane-thumb')?.getAttribute('src')).length
  }));
  expect(laneState.count).toBe(6);
  expect(laneState.withThumb).toBe(6);

  const oxphosLane = page.locator('#sceneRouteLanes .scene-route-lane[data-pathway="oxphos"]');
  await oxphosLane.click();
  await expect(oxphosLane).toHaveClass(/active/);
  await expect(page.locator('#sceneBackground')).toHaveAttribute('src', /27-etc-electron-transport-full\.webp/);
  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
});

test('expert pathway navigation remains usable on mobile', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);

  const metrics = await page.evaluate(() => {
    const dock = document.querySelector('.pathbar');
    const filters = document.querySelector('.path-filters');
    const firstButton = document.querySelector('.path-filter');
    return {
      pageOverflow: document.documentElement.scrollWidth - innerWidth,
      dockHeight: dock.getBoundingClientRect().height,
      dockRight: Math.round(innerWidth - dock.getBoundingClientRect().right),
      dockLeft: Math.round(dock.getBoundingClientRect().left),
      buttonHeight: firstButton.getBoundingClientRect().height,
      filterOverflowX: getComputedStyle(filters).overflowX,
      filterCanScroll: filters.scrollWidth > filters.clientWidth,
      noteDisplay: getComputedStyle(document.querySelector('.path-note')).display
    };
  });

  expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  expect(metrics.dockHeight).toBeGreaterThanOrEqual(158);
  expect(metrics.dockLeft).toBe(10);
  expect(metrics.dockRight).toBe(10);
  expect(metrics.buttonHeight).toBeGreaterThanOrEqual(39);
  expect(metrics.filterOverflowX).toBe('auto');
  expect(metrics.filterCanScroll).toBe(true);
  expect(metrics.noteDisplay).toBe('none');

  const target = page.locator('.path-filter').nth(1);
  await target.click();
  await expect(target).toHaveClass(/active/);
  await expect(page.locator('#expertPathPreview')).toBeVisible();
  await expect(page.locator('#expertPathPreviewImage')).toHaveAttribute('src', /39-pdh-complex-mechanism\.svg/);
  await page.locator('#expertPathPreview').click();
  await expect(page.locator('body')).toHaveClass(/scene-open/);
  await expect(page.locator('#inspector')).not.toHaveClass(/open/);
  await expect(page.locator('#sceneRouteLanes .scene-route-lane[data-pathway="pdh"]')).toHaveClass(/active/);
  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
  await page.screenshot({ path: '../output/playwright/ui-feature-expert-nav-mobile.png' });
});

test('iPad landscape supports batched pinch gestures and tablet fullscreen', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'maxTouchPoints', { configurable: true, get: () => 5 });
  });
  await page.setViewportSize({ width: 1194, height: 834 });
  await enterExpertMap(page);

  const fullscreenButton = page.locator('#appFullscreenToggle');
  await expect(fullscreenButton).toBeVisible();
  const fullscreenMetrics = await fullscreenButton.evaluate(button => ({
    height: button.getBoundingClientRect().height,
    label: button.getAttribute('aria-label')
  }));
  expect(fullscreenMetrics.height).toBeGreaterThanOrEqual(44);
  expect(fullscreenMetrics.label).toBe('进入全屏');

  const gesture = await page.locator('#viewport').evaluate(async svg => {
    let viewBoxChanges = 0;
    const initialViewBox = svg.getAttribute('viewBox');
    const observer = new MutationObserver(records => {
      viewBoxChanges += records.filter(record => record.attributeName === 'viewBox').length;
    });
    observer.observe(svg, { attributes: true, attributeFilter: ['viewBox'] });
    const fire = (type, pointerId, clientX, clientY, isPrimary = false) => {
      svg.dispatchEvent(new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        pointerId,
        pointerType: 'touch',
        isPrimary,
        buttons: type === 'pointerup' ? 0 : 1,
        clientX,
        clientY
      }));
    };
    fire('pointerdown', 41, 470, 410, true);
    fire('pointerdown', 42, 724, 410);
    for (let index = 1; index <= 24; index += 1) {
      fire('pointermove', 41, 470 - index * 2, 410, true);
      fire('pointermove', 42, 724 + index * 2, 410);
    }
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const pinchedViewBox = svg.getAttribute('viewBox');
    const activeDuringGesture = document.body.classList.contains('map-gesture-active');
    fire('pointerup', 41, 422, 410, true);
    fire('pointerup', 42, 772, 410);
    await new Promise(resolve => requestAnimationFrame(resolve));
    observer.disconnect();
    return {
      initialViewBox,
      pinchedViewBox,
      finalViewBox: svg.getAttribute('viewBox'),
      viewBoxChanges,
      activeDuringGesture,
      activeAfterGesture: document.body.classList.contains('map-gesture-active')
    };
  });

  const initialWidth = Number(gesture.initialViewBox.split(/\s+/)[2]);
  const pinchedWidth = Number(gesture.pinchedViewBox.split(/\s+/)[2]);
  expect(pinchedWidth).toBeLessThan(initialWidth);
  expect(gesture.finalViewBox).toBe(gesture.pinchedViewBox);
  expect(gesture.viewBoxChanges).toBeLessThanOrEqual(2);
  expect(gesture.activeDuringGesture).toBe(true);
  expect(gesture.activeAfterGesture).toBe(false);

  await fullscreenButton.click();
  await expect(fullscreenButton).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => page.evaluate(() => Boolean(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.body.classList.contains('app-fullscreen-fallback')
  ))).toBe(true);
  await fullscreenButton.click();
  await expect(fullscreenButton).toHaveAttribute('aria-pressed', 'false');

  const pageOverflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(pageOverflow).toBeLessThanOrEqual(1);
  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
  await page.screenshot({ path: '../output/playwright/ui-expert-ipad-fullscreen.png' });
});
