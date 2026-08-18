const { test, expect, appUrl } = require('./helpers.js');

const URL = appUrl('canvas-refine-1');

async function enterLearning(page) {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await expect(page.locator('#studentWorkspace')).toBeVisible();
  await expect(page.locator('body')).toHaveClass(/student-mode/);
  await page.waitForTimeout(1400);
  expect(pageErrors).toEqual([]);
}

test('learning map exposes reversible and single-direction reactions', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await enterLearning(page);
  await page.locator('#studentPathwaySelect').evaluate(select => {
    select.value = 'tca';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const reversibleEdge = page.locator('#studentMapEdges .student-map-edge[data-direction="reversible"]').first();
  const forwardEdge = page.locator('#studentMapEdges .student-map-edge[data-direction="forward"]').first();
  await expect(reversibleEdge).toHaveAttribute('marker-start', /student-arrow/);
  await expect(reversibleEdge).toHaveAttribute('marker-end', /student-arrow/);
  await expect(reversibleEdge).toHaveAttribute('aria-label', /^可逆反应/);
  await expect(forwardEdge).not.toHaveAttribute('marker-start', /.+/);
  await expect(forwardEdge).toHaveAttribute('marker-end', /student-arrow/);
  await expect(forwardEdge).toHaveAttribute('aria-label', /^单向反应/);
  await expect(page.locator('#studentMapNodes .node-number')).toHaveCount(0);
  await expect(page.locator('#studentMapZoomOut')).toBeVisible();
  await expect(page.locator('#studentMapZoomIn')).toBeVisible();
  await page.locator('#studentMapZoomIn').click();
  await expect(page.locator('#studentMapZoomValue')).toHaveText('115%');
  await expect(page.locator('.student-map-stage')).toHaveClass(/is-zoomed/);
  await page.locator('#studentMapCenter').click();
  await page.locator('#studentMapZoomFit').click();
  await expect(page.locator('#studentMapZoomValue')).toHaveText('100%');
  await expect(page.locator('.student-map-stage')).not.toHaveClass(/is-zoomed/);
  const reversibleCount = await page.locator('#studentMapEdges .student-map-edge:not(.branch)[data-direction="reversible"]').count();
  await expect(page.locator('.student-map-direction-label')).toHaveCount(reversibleCount);
  const labelNodeOverlaps = await page.evaluate(() => {
    const labels = [...document.querySelectorAll('.student-map-direction-label')].map(item => item.getBoundingClientRect());
    const nodes = [...document.querySelectorAll('#studentMapNodes .student-map-node rect')].map(item => item.getBoundingClientRect());
    return labels.filter(label => nodes.some(node => !(
      label.right <= node.left || label.left >= node.right || label.bottom <= node.top || label.top >= node.bottom
    ))).length;
  });
  expect(labelNodeOverlaps).toBe(0);
  await page.locator('#flowPanel').screenshot({ path: 'output/playwright/reversible-learning-desktop.png' });

  await page.locator('#studentReactionToggle').click();
  await expect(page.locator('.student-reaction-direction.reversible').first()).toContainText('可逆');
  await expect(page.locator('.student-reaction-direction:not(.reversible)').first()).toContainText('单向');
});

test('expert map uses double-ended arrows only for reversible reactions', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await enterLearning(page);
  await page.getByRole('button', { name: '专家地图', exact: true }).click();
  await expect(page.locator('body')).toHaveClass(/expert-map/);

  const reversibleRoute = page.locator('#routeLayer .route[data-direction="reversible"]').first();
  const forwardRoute = page.locator('#routeLayer .route[data-direction="forward"]').first();
  await expect(reversibleRoute).toHaveAttribute('marker-start', /arrow-/);
  await expect(reversibleRoute).toHaveAttribute('marker-end', /arrow-/);
  await expect(reversibleRoute).toHaveAttribute('aria-label', /^可逆反应/);
  await expect(forwardRoute).not.toHaveAttribute('marker-start', /.+/);
  await expect(forwardRoute).toHaveAttribute('aria-label', /^单向反应/);
  const routeGeometry = await page.locator('#routeLayer .route').evaluateAll(routes => routes.map(route => {
    const length = route.getTotalLength();
    const start = route.getPointAtLength(0);
    const end = route.getPointAtLength(length);
    const direct = Math.hypot(end.x - start.x, end.y - start.y);
    return { d: route.getAttribute('d') || '', curved: length > direct * 1.0005 };
  }));
  expect(routeGeometry.length).toBeGreaterThan(300);
  expect(routeGeometry.every(route => / C /.test(route.d))).toBe(true);
  expect(routeGeometry.filter(route => route.curved).length / routeGeometry.length).toBeGreaterThan(.95);
  await forwardRoute.dispatchEvent('click');
  const enzymeProfile = page.locator('#enzymeProfile');
  await expect(enzymeProfile).toBeVisible();
  await expect(enzymeProfile).toContainText('结构');
  await expect(enzymeProfile).toContainText('辅酶 / 辅因子');
  await expect(enzymeProfile.locator('.reaction-equation-line')).toHaveCount(1);
  await expect(enzymeProfile.locator('.reaction-equation-side')).toHaveCount(2);
  await page.screenshot({ path: 'output/playwright/reversible-expert-desktop.png' });
});

test('direction legend and map remain usable on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterLearning(page);
  await page.locator('#studentCourseHome .student-course-topic').first().click();
  await page.locator('#studentTopicLessons .student-topic-lesson').first().click();
  await expect(page.locator('.student-map-direction-key')).toHaveCount(2);
  await expect(page.locator('#studentMapNodes .node-number')).toHaveCount(0);
  await expect(page.locator('#studentMapZoomFit')).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.locator('#flowPanel').scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'output/playwright/reversible-learning-mobile.png' });
});

test('refined pathway canvas remains usable on tablet', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await enterLearning(page);
  await page.locator('#studentCourseHome .student-course-topic').first().click();
  await page.locator('#studentTopicLessons .student-topic-lesson').first().click();
  await expect(page.locator('#studentMapNodes .node-number')).toHaveCount(0);
  await expect(page.locator('.student-map-zoombar')).toBeVisible();
  await page.locator('#studentMapZoomIn').click();
  await expect(page.locator('#studentMapZoomValue')).toHaveText('115%');
  const metrics = await page.evaluate(() => ({
    pageOverflow: document.documentElement.scrollWidth - innerWidth,
    canvasScrollable: document.querySelector('.student-map-stage').scrollWidth > document.querySelector('.student-map-stage').clientWidth
  }));
  expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  expect(metrics.canvasScrollable).toBe(true);
  await page.locator('#flowPanel').screenshot({ path: 'output/playwright/refined-canvas-tablet.png' });
});
