const { test, expect, appUrl } = require('./helpers.js');

const URL = appUrl('expert-feature-nav-1');

async function enterExpertMap(page) {
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await expect(page.locator('body')).not.toHaveClass(/cover-transitioning/);
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

test('expert overview uses a spatial atlas index and controlled layers on desktop', async ({ page }) => {
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
      dockWidth: dock.getBoundingClientRect().width,
      dockLeft: Math.round(dock.getBoundingClientRect().left),
      dockRight: Math.round(innerWidth - dock.getBoundingClientRect().right),
      dockHeight: dock.getBoundingClientRect().height,
      dockRadius: parseFloat(dockStyle.borderTopLeftRadius),
      dockDisplay: dockStyle.display,
      rows: dockStyle.gridTemplateRows,
      filterDisplay: filterStyle.display,
      filterOverflowX: filterStyle.overflowX,
      filterOverflowY: filterStyle.overflowY,
      buttonHeight: button.getBoundingClientRect().height,
      canScrollPathways: filters.scrollHeight > filters.clientHeight,
      pathwayCount: document.querySelectorAll('.path-filter').length,
      groupCount: document.querySelectorAll('.path-filter-group').length,
      overviewVisible: getComputedStyle(document.querySelector('.expert-overview-panel')).display !== 'none',
      visibleRoutes: [...document.querySelectorAll('#routeLayer .route')].filter(node => {
        const style = getComputedStyle(node);
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0;
      }).length,
      visibleEntities: [...document.querySelectorAll('#entityLayer .entity')].filter(node => {
        const style = getComputedStyle(node);
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0;
      }).length,
      visibleEnzymes: [...document.querySelectorAll('#enzymeLayer .enzyme')].filter(node => {
        const style = getComputedStyle(node);
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0;
      }).length,
      anchorCount: document.querySelectorAll('#organelleLayer .organelle-anchor-dot').length,
      controls: [...document.querySelectorAll('.expert-layer-controls button')].map(button => ({
        id: button.id,
        pressed: button.getAttribute('aria-pressed')
      }))
    };
  });

  expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  expect(metrics.dockWidth).toBeGreaterThanOrEqual(240);
  expect(metrics.dockWidth).toBeLessThanOrEqual(280);
  expect(metrics.dockLeft).toBe(22);
  expect(metrics.dockRight).toBeGreaterThanOrEqual(20);
  expect(metrics.dockHeight).toBeGreaterThanOrEqual(128);
  expect(metrics.dockRadius).toBeGreaterThanOrEqual(14);
  expect(metrics.dockDisplay).toBe('grid');
  expect(metrics.rows.split(' ').length).toBe(3);
  expect(metrics.filterDisplay).toBe('flex');
  expect(metrics.filterOverflowX).toBe('hidden');
  expect(metrics.filterOverflowY).toBe('auto');
  expect(metrics.buttonHeight).toBeGreaterThanOrEqual(32);
  expect(metrics.buttonHeight).toBeLessThanOrEqual(36);
  expect(metrics.canScrollPathways).toBe(true);
  expect(metrics.pathwayCount).toBe(22);
  expect(metrics.groupCount).toBe(5);
  expect(metrics.overviewVisible).toBe(true);
  expect(metrics.visibleRoutes).toBe(0);
  expect(metrics.visibleEntities).toBe(0);
  expect(metrics.visibleEnzymes).toBe(0);
  expect(metrics.anchorCount).toBeGreaterThanOrEqual(8);
  expect(metrics.controls).toEqual([
    { id: 'expertStructureToggle', pressed: 'true' },
    { id: 'expertRouteToggle', pressed: 'true' },
    { id: 'expertLabelToggle', pressed: 'true' },
    { id: 'expertOverviewReset', pressed: null }
  ]);
  await expect(page.locator('.path-filter[data-path="autophagy"]')).toHaveCount(0);
  await expect(page.locator('.path-filter[data-path="etc"]')).toHaveCount(1);
  await expect(page.locator('.expert-overview-axes')).toHaveCount(0);
  await expect(page.locator('.path-filter-group')).toHaveText([
    '生物氧化', '糖代谢', '脂代谢', '氨基酸与氮', '核苷酸'
  ]);

  for (const [id, className] of [
    ['expertStructureToggle', 'expert-structure-muted'],
    ['expertRouteToggle', 'expert-routes-hidden'],
    ['expertLabelToggle', 'expert-labels-hidden']
  ]) {
    await page.locator(`#${id}`).click();
    await expect(page.locator(`#${id}`)).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('body')).toHaveClass(new RegExp(className));
    await page.locator(`#${id}`).click();
    await expect(page.locator(`#${id}`)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('body')).not.toHaveClass(new RegExp(className));
  }

  await page.locator('.path-filter[data-path="etc"]').click();
  await expect(page.locator('.path-filter[data-path="etc"]')).toHaveClass(/active/);
  await expect(page.locator('body')).toHaveClass(/pathway-focus/);
  await expect.poll(() => page.locator('#routeLayer .route.pathway-active').evaluateAll(nodes =>
    nodes.filter(node => Number(getComputedStyle(node).opacity) > 0).length
  )).toBeGreaterThan(0);
  await page.locator('.path-filter[data-path="all"]').click();
  await expect(page.locator('body')).not.toHaveClass(/pathway-focus/);

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

  const extendedOverview = await page.locator('#entityLayer .entity-extended, #routeLayer .route-extended, #enzymeLayer .enzyme-extended').evaluateAll(nodes => ({
    count: nodes.length,
    visible: nodes.filter(node => {
      const style = getComputedStyle(node);
      return style.visibility !== 'hidden' && Number(style.opacity) > 0;
    }).length
  }));
  expect(extendedOverview.count).toBeGreaterThan(0);
  expect(extendedOverview.visible).toBe(0);

  const overviewInteractive = await page.evaluate(() => ({
    routes: [...document.querySelectorAll('#routeLayer .route')]
      .filter(node => node.tabIndex === 0 || node.getAttribute('aria-hidden') !== 'true').length,
    entities: [...document.querySelectorAll('#entityLayer .entity')]
      .filter(node => node.tabIndex === 0 || node.getAttribute('aria-hidden') !== 'true').length,
    enzymes: [...document.querySelectorAll('#enzymeLayer .enzyme')]
      .filter(node => node.tabIndex === 0 || node.getAttribute('aria-hidden') !== 'true').length
  }));
  expect(overviewInteractive).toEqual({ routes: 0, entities: 0, enzymes: 0 });

  const plasmaCholesterol = await page.evaluate(() => {
    const entity = window.METABOLIC_COMPILED.entities.find(item => item.id === '胆固醇@plasma-membrane');
    return entity ? { x: entity.x, y: entity.y } : null;
  });
  expect(plasmaCholesterol).not.toBeNull();
  expect(Math.hypot((plasmaCholesterol.x - 800) / 718, (plasmaCholesterol.y - 600) / 498)).toBeGreaterThan(.8);
  expect(Math.hypot(plasmaCholesterol.x - 800, plasmaCholesterol.y - 600)).toBeGreaterThan(300);

  const pathway = page.locator('.path-filter[data-path="purine"]');
  await expect(pathway).toBeVisible();
  await pathway.click();
  await expect(page.locator('body')).toHaveClass(/pathway-focus/);
  await expect(page.locator('#entityLayer .entity-secondary.pathway-active').first()).toHaveCSS('visibility', 'visible');
  await page.waitForTimeout(280);

  const selectedState = await page.locator('#entityLayer .entity-secondary.pathway-active').evaluateAll(nodes => {
    const mainNodes = nodes.filter(node => !node.classList.contains('pathway-teaching-detail'));
    return {
    count: mainNodes.length,
    visible: mainNodes.filter(node => {
      const style = getComputedStyle(node);
      return style.visibility === 'visible' && Number(style.opacity) > .8;
    }).length
  }});
  expect(selectedState.count).toBeGreaterThan(0);
  expect(selectedState.visible).toBe(selectedState.count);

  const focusedInteractive = await page.evaluate(() => {
    const routes = [...document.querySelectorAll('#routeLayer .route')].filter(node => node.tabIndex === 0);
    const entities = [...document.querySelectorAll('#entityLayer .entity')].filter(node => node.tabIndex === 0);
    return {
      routeCount: routes.length,
      entityCount: entities.length,
      routesStayInPathway: routes.every(node => node.classList.contains('pathway-active')),
      entitiesStayInPathway: entities.every(node => node.classList.contains('pathway-active'))
    };
  });
  expect(focusedInteractive.routeCount).toBeGreaterThan(0);
  expect(focusedInteractive.entityCount).toBeGreaterThan(0);
  expect(focusedInteractive.routesStayInPathway).toBe(true);
  expect(focusedInteractive.entitiesStayInPathway).toBe(true);
  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
});

test('expert route hit decoration stays transparent and double click enters the spatial scene', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.setViewportSize({ width: 1194, height: 834 });
  await enterExpertMap(page);

  await expect(page.locator('#routeLayer .route-aura').first()).toHaveCSS('pointer-events', 'none');
  await page.locator('.path-filter[data-path="tca"]').click();
  const matrixEntity = page.locator('#entityLayer .entity[data-id="柠檬酸@mito-matrix"]');
  await expect(matrixEntity).toBeVisible();
  await matrixEntity.dblclick();
  await expect(page.locator('#sceneDeck')).toHaveClass(/open/);
  await expect(page.locator('#sceneTitle')).toContainText('线粒体');
  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
});

test('expert overview index remains usable on mobile', async ({ page }) => {
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
      filterOverflowY: getComputedStyle(filters).overflowY,
      filterCanScroll: filters.scrollHeight > filters.clientHeight,
      groupCount: document.querySelectorAll('.path-filter-group').length,
      noteDisplay: getComputedStyle(document.querySelector('.path-note')).display
    };
  });

  expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  expect(metrics.dockHeight).toBeGreaterThanOrEqual(158);
  expect(metrics.dockLeft).toBe(10);
  expect(metrics.dockRight).toBe(10);
  expect(metrics.buttonHeight).toBeGreaterThanOrEqual(30);
  expect(metrics.buttonHeight).toBeLessThanOrEqual(32);
  expect(metrics.filterOverflowX).toBe('hidden');
  expect(metrics.filterOverflowY).toBe('auto');
  expect(metrics.filterCanScroll).toBe(true);
  expect(metrics.groupCount).toBe(5);
  expect(metrics.noteDisplay).toBe('none');

  const target = page.locator('.path-filter').nth(1);
  await target.click();
  await expect(target).toHaveClass(/active/);
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
