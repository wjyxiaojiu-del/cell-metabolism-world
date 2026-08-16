const { test, expect, appUrl } = require('./helpers.js');

const URL = appUrl('topic-controls-1');

async function openCarbohydrateNetwork(page) {
  await page.addInitScript(() => localStorage.removeItem('metabolism.studentTopicView'));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await expect(page.locator('#studentWorkspace')).toBeVisible();
  if (await page.locator('.student-layout').evaluate(el => el.classList.contains('catalog-collapsed'))) {
    await page.locator('#studentSidebarToggle').click();
  }
  await page.locator('.student-topic-card[data-topic="carbohydrate"]').click();
  await expect(page.locator('#studentTopicPanel')).toBeVisible();
  await page.locator('#studentTopicAtlas > summary').click();
  await expect(page.locator('#studentTopicAtlas')).toHaveAttribute('open', '');
  await expect(page.locator('[data-topic-view="network"]')).toHaveAttribute('aria-pressed', 'true');
  await page.waitForTimeout(320);
}

test('hub network merges repeated metabolites and exposes pathway jumps', async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openCarbohydrateNetwork(page);

  const metrics = await page.evaluate(() => {
    const stage = document.querySelector('.student-topic-stage');
    return {
      networkMode: stage.classList.contains('topic-network-view'),
      nodeCount: document.querySelectorAll('.student-topic-network-node').length,
      sharedCount: document.querySelectorAll('.student-topic-network-node.shared').length,
      edgeCount: document.querySelectorAll('.student-topic-network-edge').length,
      primaryEdgeCount: document.querySelectorAll('.student-topic-network-edge.is-primary-route').length,
      visibleEdgeCount: [...document.querySelectorAll('.student-topic-network-edge')].filter(edge => Number.parseFloat(getComputedStyle(edge).opacity) > .3).length,
      chipCount: document.querySelectorAll('.student-topic-route-chip').length,
      pinnedDisplay: getComputedStyle(document.querySelector('.student-topic-pinned-lanes')).display,
      scrollTop: stage.scrollTop,
      canScrollX: stage.scrollWidth > stage.clientWidth,
      canScrollY: stage.scrollHeight > stage.clientHeight
    };
  });
  expect(metrics.networkMode).toBe(true);
  expect(metrics.nodeCount).toBeGreaterThan(14);
  expect(metrics.nodeCount).toBeLessThan(30);
  expect(metrics.sharedCount).toBeGreaterThanOrEqual(5);
  expect(metrics.edgeCount).toBeGreaterThan(20);
  expect(metrics.primaryEdgeCount).toBeGreaterThan(0);
  expect(metrics.visibleEdgeCount).toBe(metrics.primaryEdgeCount);
  expect(metrics.visibleEdgeCount).toBeLessThan(metrics.edgeCount / 2);
  expect(metrics.chipCount).toBe(5);
  expect(metrics.pinnedDisplay).toBe('none');
  expect(metrics.scrollTop).toBe(0);
  expect(metrics.canScrollX).toBe(true);
  expect(metrics.canScrollY).toBe(true);

  const pppChip = page.locator('.student-topic-route-chip', { hasText: '磷酸戊糖途径' });
  await pppChip.hover();
  await expect.poll(() => page.locator('.student-topic-network-edge.is-route-active').count()).toBeGreaterThan(0);
  await expect.poll(() => page.locator('.student-topic-network-edge.is-route-dim').count()).toBeGreaterThan(0);

  await page.locator('#studentTopicMaximize').click();
  await expect(page.locator('body')).toHaveClass(/student-topic-maximized/);
  const sharedG6p = page.locator('.student-topic-network-node.shared').filter({ hasText: '葡萄糖-6-磷酸' }).first();
  await sharedG6p.click();
  await expect(page.locator('#studentTopicNodeContext')).toBeVisible();
  await expect(page.locator('#studentTopicNodeContextTitle')).toContainText('葡萄糖-6-磷酸 连接 5 条通路');
  await expect(page.locator('#studentTopicNodeContextRoutes button')).toHaveCount(5);
  await expect.poll(() => page.evaluate(() => [...document.querySelectorAll('.student-topic-network-edge:not(.is-node-active)')]
    .filter(edge => Number.parseFloat(getComputedStyle(edge).opacity) > .1).length)).toBe(0);
  const localEdgeMetrics = await page.evaluate(() => ({
    active: document.querySelectorAll('.student-topic-network-edge.is-node-active').length
  }));
  expect(localEdgeMetrics.active).toBeGreaterThan(1);
  expect(localEdgeMetrics.active).toBeLessThan(12);
  await page.screenshot({ path: '../output/playwright/ui-topic-network-shared-node.png' });

  await page.locator('#studentTopicNodeContextRoutes button', { hasText: '磷酸戊糖途径' }).click();
  await expect(page.locator('#studentPathwayPanel')).toBeVisible();
  await expect(page.locator('#flowTitle')).toHaveText('磷酸戊糖途径');
  await expect(page.locator('body')).not.toHaveClass(/student-topic-maximized/);
  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test('network and lane views remain directly switchable', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openCarbohydrateNetwork(page);
  await expect(page.locator('#studentTopicRouteLegend')).toBeVisible();

  await page.locator('[data-topic-view="lanes"]').click();
  await expect(page.locator('[data-topic-view="lanes"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#studentTopicRouteLegend')).toBeHidden();
  await expect(page.locator('.student-topic-pinned-lane')).toHaveCount(5);
  await expect(page.locator('.student-topic-edge')).not.toHaveCount(0);

  await page.locator('[data-topic-view="network"]').click();
  await expect(page.locator('#studentTopicRouteLegend')).toBeVisible();
  await expect(page.locator('.student-topic-network-node')).not.toHaveCount(0);
});

test('pathway chips persistently focus the network before an explicit route entry', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openCarbohydrateNetwork(page);
  const chip = page.locator('.student-topic-route-chip', { hasText: '磷酸戊糖途径' });

  await chip.click();
  await expect(page.locator('#studentTopicPanel')).toBeVisible();
  await expect(page.locator('#studentPathwayPanel')).toBeHidden();
  await expect(page.locator('#studentTopicRouteContext')).toBeVisible();
  await expect(page.locator('#studentTopicRouteContextTitle')).toHaveText('磷酸戊糖途径');
  await expect(chip).toHaveClass(/is-active/);
  await expect.poll(() => page.locator('.student-topic-network-edge.is-route-active').count()).toBeGreaterThan(0);
  await expect.poll(() => page.locator('.student-topic-network-edge.is-route-dim').count()).toBeGreaterThan(0);
  await page.screenshot({ path: '../output/playwright/ui-topic-network-route-focus.png' });

  await page.locator('.student-topic-network-node.shared').filter({ hasText: '葡萄糖-6-磷酸' }).first().click();
  await expect(page.locator('#studentTopicNodeContext')).toBeVisible();
  await expect(page.locator('#studentTopicRouteContext')).toBeHidden();
  await page.locator('#studentTopicNodeContextClose').click();

  await chip.click();
  await expect(page.locator('#studentTopicRouteContext')).toBeVisible();
  await chip.click();
  await expect(page.locator('#studentTopicRouteContext')).toBeHidden();
  await expect(page.locator('.student-topic-network-edge.is-route-active')).toHaveCount(0);

  await chip.click();
  await page.locator('#studentTopicRouteEnter').click();
  await expect(page.locator('#studentPathwayPanel')).toBeVisible();
  await expect(page.locator('#flowTitle')).toHaveText('磷酸戊糖途径');
});

test('topic zoom preserves the visual center and enforces readable bounds', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openCarbohydrateNetwork(page);
  const before = await page.evaluate(() => {
    const stage = document.querySelector('.student-topic-stage');
    const map = document.querySelector('#studentTopicMap');
    return {
      centerX: stage.scrollLeft + stage.clientWidth / 2,
      mapWidth: map.getBoundingClientRect().width
    };
  });

  await page.locator('#studentTopicZoomIn').click();
  await expect(page.locator('#studentTopicZoomValue')).toHaveText('110%');
  const after = await page.evaluate(() => {
    const stage = document.querySelector('.student-topic-stage');
    const map = document.querySelector('#studentTopicMap');
    return {
      centerX: (stage.scrollLeft + stage.clientWidth / 2) / 1.1,
      mapWidth: map.getBoundingClientRect().width
    };
  });
  expect(Math.abs(after.centerX - before.centerX)).toBeLessThanOrEqual(2);
  expect(after.mapWidth / before.mapWidth).toBeCloseTo(1.1, 2);

  await page.locator('#studentTopicZoomReset').click();
  await expect(page.locator('#studentTopicZoomValue')).toHaveText('100%');
  await page.locator('#studentTopicZoomFit').click();
  await expect.poll(() => page.locator('#studentTopicZoomValue').textContent()).toMatch(/^(55|56|57|58|59|60|61|62|63|64|65)%$/);

  await page.evaluate(() => {
    for (let index = 0; index < 20; index += 1) document.querySelector('#studentTopicZoomIn').click();
  });
  await expect(page.locator('#studentTopicZoomValue')).toHaveText('160%');
  await expect(page.locator('#studentTopicZoomIn')).toBeDisabled();
  await page.evaluate(() => {
    for (let index = 0; index < 20; index += 1) document.querySelector('#studentTopicZoomOut').click();
  });
  await expect(page.locator('#studentTopicZoomValue')).toHaveText('55%');
  await expect(page.locator('#studentTopicZoomOut')).toBeDisabled();
});

test('desktop minimap mirrors the viewport and repositions the main canvas', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openCarbohydrateNetwork(page);
  const minimap = page.locator('#studentTopicMinimap');
  await expect(minimap).toBeVisible();
  const initialViewportLeft = await page.locator('#studentTopicMinimapViewport').evaluate(element => Number.parseFloat(element.style.left));
  await page.locator('.student-topic-stage').evaluate(element => element.scrollTo({ left: element.scrollWidth, top: element.scrollTop, behavior: 'auto' }));
  await expect.poll(() => page.locator('#studentTopicMinimapViewport').evaluate(element => Number.parseFloat(element.style.left))).toBeGreaterThan(initialViewportLeft + 20);
  const beforeLocate = await page.locator('.student-topic-stage').evaluate(element => element.scrollLeft);
  const box = await minimap.boundingBox();
  await minimap.click({ position: { x: 24, y: box.height * .55 } });
  await expect.poll(() => page.locator('.student-topic-stage').evaluate(element => element.scrollLeft)).toBeLessThan(beforeLocate - 100);
  await page.screenshot({ path: '../output/playwright/ui-topic-network-controls.png' });
});

test('all five topic networks render without node overlap or invalid paths', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openCarbohydrateNetwork(page);
  const topicIds = ['biooxidation', 'carbohydrate', 'lipid', 'amino', 'nucleotide'];
  for (const topicId of topicIds) {
    await page.locator(`.student-topic-card[data-topic="${topicId}"]`).click();
    await page.locator('#studentTopicAtlas > summary').click();
    await expect(page.locator('.student-topic-network-node').first()).toBeVisible();
    await expect(page.locator('.student-topic-route-chip').first()).toBeVisible();
    const metrics = await page.evaluate(() => {
      const rectangles = [...document.querySelectorAll('.student-topic-network-node')].map(node => node.getBoundingClientRect());
      let overlaps = 0;
      for (let index = 0; index < rectangles.length; index += 1) {
        for (let comparison = index + 1; comparison < rectangles.length; comparison += 1) {
          const horizontal = Math.min(rectangles[index].right, rectangles[comparison].right) - Math.max(rectangles[index].left, rectangles[comparison].left);
          const vertical = Math.min(rectangles[index].bottom, rectangles[comparison].bottom) - Math.max(rectangles[index].top, rectangles[comparison].top);
          if (horizontal > 2 && vertical > 2) overlaps += 1;
        }
      }
      return {
        overlaps,
        invalidPaths: [...document.querySelectorAll('.student-topic-network-edge')].filter(edge => /NaN|undefined/.test(edge.getAttribute('d'))).length,
        primaryEdges: document.querySelectorAll('.student-topic-network-edge.is-primary-route').length,
        visibleSecondaryEdges: [...document.querySelectorAll('.student-topic-network-edge:not(.is-primary-route)')]
          .filter(edge => Number.parseFloat(getComputedStyle(edge).opacity) > .1).length,
        nodeCount: rectangles.length,
        routeCount: document.querySelectorAll('.student-topic-route-chip').length
      };
    });
    expect(metrics.nodeCount).toBeGreaterThan(0);
    expect(metrics.routeCount).toBeGreaterThan(0);
    expect(metrics.overlaps, `${topicId} node overlaps`).toBe(0);
    expect(metrics.invalidPaths, `${topicId} invalid paths`).toBe(0);
    expect(metrics.primaryEdges).toBeGreaterThan(0);
    expect(metrics.visibleSecondaryEdges).toBe(0);
  }
});

test('hub network stays usable in the mobile immersive canvas', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openCarbohydrateNetwork(page);
  const before = await page.evaluate(() => ({
    pageOverflow: document.documentElement.scrollWidth - innerWidth,
    chipsScrollable: document.querySelector('#studentTopicRouteLegend').scrollWidth > document.querySelector('#studentTopicRouteLegend').clientWidth,
    viewSwitchVisible: getComputedStyle(document.querySelector('.student-topic-view-switch')).display !== 'none'
  }));
  expect(before.pageOverflow).toBeLessThanOrEqual(1);
  expect(before.chipsScrollable).toBe(true);
  expect(before.viewSwitchVisible).toBe(true);
  await expect(page.locator('#studentTopicMinimap')).toBeHidden();

  await page.locator('#studentTopicMaximize').click();
  await expect(page.locator('.topbar')).toHaveCSS('opacity', '0');
  const maximized = await page.evaluate(() => {
    const panel = document.querySelector('#flowPanel').getBoundingClientRect();
    const stage = document.querySelector('.student-topic-stage');
    return {
      panelWidth: panel.width,
      panelHeight: panel.height,
      scrollableX: stage.scrollWidth > stage.clientWidth,
      scrollableY: stage.scrollHeight > stage.clientHeight,
      pageOverflow: document.documentElement.scrollWidth - innerWidth
    };
  });
  expect(maximized.panelWidth).toBeGreaterThanOrEqual(378);
  expect(maximized.panelHeight).toBeGreaterThanOrEqual(830);
  expect(maximized.scrollableX).toBe(true);
  expect(maximized.scrollableY).toBe(true);
  expect(maximized.pageOverflow).toBeLessThanOrEqual(1);
  await page.screenshot({ path: '../output/playwright/ui-topic-network-mobile.png' });
});

test('narrow desktop keeps the topic guide horizontal and the network in view', async ({ page }) => {
  await page.setViewportSize({ width: 1108, height: 705 });
  await openCarbohydrateNetwork(page);
  await page.locator('#studentTopicPanel').evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'auto' }));
  await page.locator('.student-topic-stage').scrollIntoViewIfNeeded();
  await page.waitForTimeout(80);

  const metrics = await page.evaluate(() => {
    const toolbar = document.querySelector('.student-topic-toolbar').getBoundingClientRect();
    const guide = document.querySelector('#studentTopicGuide').getBoundingClientRect();
    const pan = document.querySelector('.student-topic-pan').getBoundingClientRect();
    const stage = document.querySelector('.student-topic-stage').getBoundingClientRect();
    const viewport = { left: 0, top: 0, right: innerWidth, bottom: innerHeight };
    const intersects = (first, second) => (
      Math.min(first.right, second.right) - Math.max(first.left, second.left) > 1 &&
      Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top) > 1
    );
    const visibleNodes = [...document.querySelectorAll('.student-topic-network-node')]
      .map(node => node.getBoundingClientRect())
      .filter(rect => intersects(rect, stage) && intersects(rect, viewport)).length;
    return {
      toolbarHeight: toolbar.height,
      guideWidth: guide.width,
      guideHeight: guide.height,
      guideWhiteSpace: getComputedStyle(document.querySelector('#studentTopicGuide')).whiteSpace,
      controlsContained: pan.left >= toolbar.left - 1 && pan.right <= toolbar.right + 1,
      stageVisible: intersects(stage, viewport),
      visibleNodes,
      pageOverflow: document.documentElement.scrollWidth - innerWidth
    };
  });

  expect(metrics.toolbarHeight).toBeLessThan(100);
  expect(metrics.guideWidth).toBeGreaterThan(300);
  expect(metrics.guideHeight).toBeLessThan(30);
  expect(metrics.guideWhiteSpace).toBe('nowrap');
  expect(metrics.controlsContained).toBe(true);
  expect(metrics.stageVisible).toBe(true);
  expect(metrics.visibleNodes).toBeGreaterThan(0);
  expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  await page.screenshot({ path: '../output/playwright/ui-topic-network-narrow-desktop.png' });
});
