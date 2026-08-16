const { test, expect, appUrl } = require('./helpers.js');

const URL = appUrl('topic-network-1');

async function openCarbohydrateTopic(page) {
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await expect(page.locator('#studentWorkspace')).toBeVisible();
  if (await page.locator('.student-layout').evaluate(el => el.classList.contains('catalog-collapsed'))) {
    await page.locator('#studentSidebarToggle').click();
  }
  await page.locator('.student-topic-card[data-topic="carbohydrate"]').click();
  await page.locator('#studentSidebarToggle').click();
  await expect(page.locator('#studentTopicPanel')).toBeVisible();
  await expect(page.locator('#studentTopicTitle')).toHaveText('糖代谢');
  await page.locator('#studentTopicAtlas > summary').click();
  await expect(page.locator('#studentTopicAtlas')).toHaveAttribute('open', '');
  await page.locator('[data-topic-view="lanes"]').click();
  await page.waitForTimeout(500);
}

test('topic panorama keeps every pathway in a readable left-to-right lane', async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openCarbohydrateTopic(page);

  const metrics = await page.evaluate(() => {
    const visible = element => {
      const style = getComputedStyle(element);
      return style.display !== 'none' && style.visibility !== 'hidden';
    };
    const intersects = (a, b) => (
      Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 &&
      Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1
    );
    const pinned = [...document.querySelectorAll('.student-topic-pinned-lane')].filter(visible);
    const nodes = [...document.querySelectorAll('.student-topic-node')].filter(visible);
    const pinnedRects = pinned.map(element => element.getBoundingClientRect());
    const nodeRects = nodes.map(element => element.getBoundingClientRect());
    const overlapCount = pinnedRects.reduce((count, lane) => (
      count + nodeRects.filter(node => intersects(lane, node)).length
    ), 0);
    const bridgeEdges = [...document.querySelectorAll('.student-topic-bridge-edge')];
    const stepBadges = document.querySelectorAll('.student-topic-node .topic-step-badge');
    return {
      pageOverflow: document.documentElement.scrollWidth - innerWidth,
      overlapCount,
      pinnedCount: pinned.length,
      nodeCount: nodes.length,
      stepBadgeCount: stepBadges.length,
      mainEdgeCount: document.querySelectorAll('.student-topic-edge').length,
      bridgeEdgeCount: bridgeEdges.length,
      visibleBridgeCount: bridgeEdges.filter(edge => Number.parseFloat(getComputedStyle(edge).opacity) > .01).length,
      laneTitleDisplay: getComputedStyle(document.querySelector('.student-topic-lane-title')).display,
      firstNodeLeft: nodeRects.length ? Math.min(...nodeRects.map(rect => rect.left)) : 0,
      pinnedRight: pinnedRects.length ? Math.max(...pinnedRects.map(rect => rect.right)) : 0
    };
  });

  expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  expect(metrics.pinnedCount).toBe(5);
  expect(metrics.nodeCount).toBeGreaterThan(14);
  expect(metrics.stepBadgeCount).toBe(metrics.nodeCount);
  expect(metrics.mainEdgeCount).toBeGreaterThan(8);
  expect(metrics.bridgeEdgeCount).toBeGreaterThan(0);
  expect(metrics.visibleBridgeCount).toBe(0);
  expect(metrics.laneTitleDisplay).toBe('none');
  expect(metrics.overlapCount).toBe(0);
  expect(metrics.firstNodeLeft - metrics.pinnedRight).toBeGreaterThanOrEqual(20);
  await page.screenshot({ path: '../output/playwright/ui-topic-layout-clean-desktop.png', fullPage: true });

  const sharedNode = page.locator('.student-topic-node.shared').first();
  await sharedNode.hover();
  await page.waitForTimeout(240);
  const active = await page.evaluate(() => ({
    edges: document.querySelectorAll('.student-topic-bridge-edge.is-active').length,
    nodes: document.querySelectorAll('.student-topic-node.is-shared-active').length,
    visibleEdges: [...document.querySelectorAll('.student-topic-bridge-edge.is-active')]
      .filter(edge => Number.parseFloat(getComputedStyle(edge).opacity) > .01).length
  }));
  expect(active.edges).toBeGreaterThan(0);
  expect(active.nodes).toBeGreaterThan(1);
  expect(active.visibleEdges).toBe(active.edges);

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
  await page.locator('.student-topic-stage').screenshot({ path: '../output/playwright/ui-topic-layout-shared-hover.png' });
});

test('topic panorama uses in-canvas lane titles on mobile without page overflow', async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await openCarbohydrateTopic(page);

  const metrics = await page.evaluate(() => ({
    pageOverflow: document.documentElement.scrollWidth - innerWidth,
    pinnedDisplay: getComputedStyle(document.querySelector('.student-topic-pinned-lanes')).display,
    laneTitleDisplay: getComputedStyle(document.querySelector('.student-topic-lane-title')).display,
    stageScrollable: document.querySelector('.student-topic-stage').scrollWidth > document.querySelector('.student-topic-stage').clientWidth
  }));
  expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  expect(metrics.pinnedDisplay).toBe('none');
  expect(metrics.laneTitleDisplay).not.toBe('none');
  expect(metrics.stageScrollable).toBe(true);
  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);

  await page.locator('#studentTopicPanel').scrollIntoViewIfNeeded();
  await page.screenshot({ path: '../output/playwright/ui-topic-layout-clean-mobile.png', fullPage: true });
});

test('topic panorama supports real two-axis scrolling on a laptop viewport', async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.setViewportSize({ width: 1200, height: 600 });
  await openCarbohydrateTopic(page);

  const stage = page.locator('.student-topic-stage');
  await stage.scrollIntoViewIfNeeded();
  await stage.hover();
  const before = await page.evaluate(() => {
    const workspace = document.querySelector('.student-workspace');
    const stage = document.querySelector('.student-topic-stage');
    const pinned = document.querySelector('.student-topic-pinned-lane').getBoundingClientRect();
    const node = document.querySelector('.student-topic-node').getBoundingClientRect();
    return {
      workspaceTop: workspace.scrollTop,
      overflow: getComputedStyle(stage).overflow,
      scrollWidth: stage.scrollWidth,
      clientWidth: stage.clientWidth,
      scrollHeight: stage.scrollHeight,
      clientHeight: stage.clientHeight,
      pinnedLeft: pinned.left,
      laneOffset: pinned.top - node.top
    };
  });
  expect(before.overflow).toBe('auto');
  expect(before.scrollWidth).toBeGreaterThan(before.clientWidth);
  expect(before.scrollHeight).toBeGreaterThan(before.clientHeight);

  await page.locator('[data-topic-pan="right"]').click();
  await expect.poll(() => stage.evaluate(element => element.scrollLeft)).toBeGreaterThan(200);
  await page.locator('[data-topic-pan="left"]').click();
  await expect.poll(() => stage.evaluate(element => element.scrollLeft)).toBeLessThan(40);
  await stage.evaluate(element => element.scrollTo({ left: 0, top: 0, behavior: 'auto' }));
  await stage.hover();

  await page.mouse.wheel(0, 320);
  await page.waitForTimeout(150);
  const afterVertical = await page.evaluate(() => {
    const workspace = document.querySelector('.student-workspace');
    const stage = document.querySelector('.student-topic-stage');
    const pinned = document.querySelector('.student-topic-pinned-lane').getBoundingClientRect();
    const node = document.querySelector('.student-topic-node').getBoundingClientRect();
    return {
      workspaceTop: workspace.scrollTop,
      stageTop: stage.scrollTop,
      laneOffset: pinned.top - node.top
    };
  });
  expect(afterVertical.stageTop).toBeGreaterThan(250);
  expect(afterVertical.workspaceTop).toBe(before.workspaceTop);
  expect(Math.abs(afterVertical.laneOffset - before.laneOffset)).toBeLessThanOrEqual(1);

  await page.keyboard.down('Shift');
  await page.mouse.wheel(0, 420);
  await page.keyboard.up('Shift');
  await page.waitForTimeout(150);
  const afterHorizontal = await page.evaluate(() => {
    const workspace = document.querySelector('.student-workspace');
    const stage = document.querySelector('.student-topic-stage');
    const pinned = document.querySelector('.student-topic-pinned-lane').getBoundingClientRect();
    return {
      workspaceTop: workspace.scrollTop,
      stageTop: stage.scrollTop,
      stageLeft: stage.scrollLeft,
      pinnedLeft: pinned.left
    };
  });
  expect(afterHorizontal.stageLeft).toBeGreaterThan(300);
  expect(afterHorizontal.stageTop).toBe(afterVertical.stageTop);
  expect(afterHorizontal.workspaceTop).toBe(before.workspaceTop);
  expect(Math.abs(afterHorizontal.pinnedLeft - before.pinnedLeft)).toBeLessThanOrEqual(1);
  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
  await page.screenshot({ path: '../output/playwright/ui-topic-layout-scrollable-laptop.png' });
});
