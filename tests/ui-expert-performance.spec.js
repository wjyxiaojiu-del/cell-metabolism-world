const { test, expect, appUrl } = require('./helpers.js');

async function enterExpertMap(page) {
  await page.goto(appUrl('expert-performance-regression'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await expect(page.locator('#studentWorkspace')).toBeVisible();
  await page.getByRole('button', { name: '专家地图', exact: true }).click();
  await expect(page.locator('body')).toHaveClass(/expert-map/);
  await expect(page.locator('.pathbar')).toBeVisible();
}

test('expert detail image and iPad pinch stay inside an interactive frame budget', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'maxTouchPoints', { configurable: true, get: () => 5 });
  });
  await page.setViewportSize({ width: 1194, height: 834 });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await enterExpertMap(page);
  const pinch = await page.locator('#viewport').evaluate(async svg => {
    const frameGaps = [];
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
    let previous = performance.now();
    for (let index = 1; index <= 24; index += 1) {
      fire('pointermove', 41, 470 - index * 2, 410, true);
      fire('pointermove', 42, 724 + index * 2, 410);
      await new Promise(resolve => requestAnimationFrame(now => {
        frameGaps.push(now - previous);
        previous = now;
        resolve();
      }));
    }
    fire('pointerup', 41, 422, 410, true);
    fire('pointerup', 42, 772, 410);
    const activationFrameGapMs = Math.max(...frameGaps.slice(0, 2).filter(gap => gap > 0));
    const steadyFrameGaps = frameGaps.slice(2).filter(gap => gap > 0);
    const sorted = [...steadyFrameGaps].sort((a, b) => a - b);
    return {
      frameGaps,
      activationFrameGapMs,
      p95FrameGapMs: sorted[Math.floor(sorted.length * 0.95)],
      maxFrameGapMs: Math.max(...steadyFrameGaps)
    };
  });

  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 2 });
  await page.locator('.path-filter[data-path="etc"]').click();
  await page.locator('#expertPathPreview').click();
  await page.locator('.scene-hotspot[data-target="mitochondria-inner-membrane"]').click();

  const imageMetrics = await page.locator('.scene-hotspot[data-pathway="etc"]').evaluate(async hotspot => {
    const image = document.querySelector('#sceneBackground');
    const startedAt = performance.now();
    const loaded = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('ETC image did not load')), 5000);
      const onLoad = () => {
        if (!image.currentSrc.includes('26-etc-complexes-detailed.webp')) return;
        clearTimeout(timeout);
        image.removeEventListener('load', onLoad);
        resolve();
      };
      image.addEventListener('load', onLoad);
    });
    hotspot.click();
    const clickHandlerMs = performance.now() - startedAt;
    await loaded;
    await image.decode();
    return {
      imageReadyMs: performance.now() - startedAt,
      clickHandlerMs
    };
  });

  console.log(JSON.stringify({ ...imageMetrics, ...pinch }));
  expect(imageMetrics.imageReadyMs).toBeLessThanOrEqual(500);
  expect(pinch.activationFrameGapMs).toBeLessThanOrEqual(180);
  expect(pinch.p95FrameGapMs).toBeLessThanOrEqual(34);
  expect(pinch.maxFrameGapMs).toBeLessThanOrEqual(40);
});
