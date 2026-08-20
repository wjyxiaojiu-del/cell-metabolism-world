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

async function openScenePathway(page, pathwayId) {
  const hotspot = page.locator(`#sceneHotspots .scene-hotspot[data-pathway="${pathwayId}"]`);
  if (await hotspot.count()) {
    await hotspot.first().click({ force: true });
    return;
  }
  await page.locator(`.scene-route-lane[data-pathway="${pathwayId}"]`).click({ force: true });
}

test('expert pathway navigation is a large two-row feature dock on desktop', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await enterExpertMap(page);
  await expect(page.locator('.path-filter-icon')).toHaveCount(22);
  await page.waitForFunction(() => [...document.querySelectorAll('.path-filter-icon')]
    .every(icon => icon.complete && icon.naturalWidth > 0));

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
    iconCount: document.querySelectorAll('.path-filter-icon').length,
    iconMetrics: [...document.querySelectorAll('.path-filter-icon')].map(icon => ({
      width: Math.round(icon.getBoundingClientRect().width),
      height: Math.round(icon.getBoundingClientRect().height),
      naturalWidth: icon.naturalWidth,
      naturalHeight: icon.naturalHeight,
      source: icon.getAttribute('src')
    })),
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
  expect(metrics.iconCount).toBe(22);
  expect(metrics.iconMetrics.every(icon => icon.width === 28 && icon.height === 28)).toBe(true);
  expect(metrics.iconMetrics.every(icon => icon.naturalWidth > 0 && icon.naturalWidth === icon.naturalHeight)).toBe(true);
  expect(metrics.iconMetrics.every(icon => /pathway-icons\/optimized\/.+\.webp$/.test(icon.source))).toBe(true);
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
  expect(audit.sourceCount).toBeGreaterThanOrEqual(5);
  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
});

test('expert pathway preview keeps organelle, subcompartment and reaction points in separate layers', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await enterExpertMap(page);

  const pathway = page.locator('.path-filter[data-path="pdh"]');
  await pathway.click();
  await expect(page.locator('#expertPathPreview')).toBeVisible();
  await expect(page.locator('#expertPathPreviewImage')).toHaveAttribute('src', /18-mitochondrion-isolated\.webp/);
  const selectedOverflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(selectedOverflow).toBeLessThanOrEqual(1);
  await page.locator('#expertPathPreview').click();
  await expect(page.locator('body')).toHaveClass(/scene-open/);
  await expect(page.locator('#sceneTitle')).toHaveText('线粒体总览');
  await expect(page.locator('#sceneBackground')).toHaveAttribute('src', /18-mitochondrion-isolated\.webp/);
  await expect(page.locator('#sceneDeck')).not.toHaveClass(/pathway-visual-active/);
  await expect(page.locator('#sceneExpertOverlayLayer > *')).toHaveCount(0);
  await expect(page.locator('#sceneHotspots .scene-hotspot')).toHaveCount(3);
  expect(await page.locator('#sceneRouteLanes .scene-route-lane').count()).toBeGreaterThanOrEqual(10);
  await expect(page.locator('#sceneRouteLaneCount')).toHaveText(/\d+ 条/);
  const pointStyle = await page.evaluate(() => {
    const pdh = document.querySelector('.scene-route-lane[data-pathway="pdh"]');
    const tca = document.querySelector('.scene-route-lane[data-pathway="tca"]');
    const style = getComputedStyle(pdh);
    return {
      pdhTone: style.getPropertyValue('--tone').trim(),
      tcaTone: getComputedStyle(tca).getPropertyValue('--tone').trim()
    };
  });
  expect(pointStyle.pdhTone).not.toBe(pointStyle.tcaTone);
  await openScenePathway(page, 'pdh');
  await expect(page.locator('#sceneDeck')).toHaveClass(/pathway-visual-active/);
  await expect(page.locator('#sceneHotspots')).toBeEmpty();
  await expect(page.locator('#sceneExpertOverlayLayer .overlay-schematic-pdh')).toHaveCount(1);
  await expect(page.locator('#sceneExpertOverlayLayer .overlay-schematic-pdh .schematic-node')).not.toHaveCount(0);
  await expect(page.locator('#sceneExpertOverlayLayer .overlay-schematic-pdh .schematic-node').first()).toHaveAttribute('r', '0.4');
  await expect(page.locator('#inspector')).not.toHaveClass(/open/);
  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
});

test('inner-membrane pathway points open only inside the inner-membrane layer', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await enterExpertMap(page);

  await page.locator('.path-filter[data-path="etc"]').click();
  await page.locator('#expertPathPreview').click();
  const laneState = await page.locator('#sceneRouteLanes .scene-route-lane').evaluateAll(nodes => ({
    count: nodes.length,
    withThumb: nodes.filter(node => node.querySelector('.scene-route-lane-thumb')?.getAttribute('src')).length
  }));
  expect(laneState.count).toBe(10);
  expect(laneState.withThumb).toBeGreaterThanOrEqual(5);
  expect(laneState.withThumb).toBeLessThanOrEqual(laneState.count);

  await page.locator('.scene-hotspot[data-target="mitochondria-inner-membrane"]').click();
  await expect(page.locator('#sceneTitle')).toHaveText('线粒体内膜与能量转换');
  await expect(page.locator('.scene-hotspot[data-pathway="etc"]')).toHaveCount(1);
  await page.locator('.scene-hotspot[data-pathway="etc"]').click();
  await expect(page.locator('#sceneBackground')).toHaveAttribute('src', /26-etc-complexes-detailed\.webp/);
  await expect(page.locator('#sceneExpertOverlayLayer .overlay-schematic-etc')).toHaveCount(1);
  await expect(page.locator('#sceneExpertOverlayLayer')).toContainText('复合体 IV');
  await expect(page.locator('#sceneExpertOverlayLayer')).toContainText('O₂');
  await page.screenshot({ path: 'output/playwright/etc-premium-sample-v2-local.png' });
  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
});

test('cyclic pathways use real closed reaction routes inside their scene image', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await enterExpertMap(page);

  await page.locator('.path-filter[data-path="urea"]').click();
  await page.locator('#expertPathPreview').click();
  await openScenePathway(page, 'urea');
  const ureaState = await page.locator('#sceneExpertOverlayLayer').evaluate(layer => ({
    schematic: Boolean(layer.querySelector('.overlay-schematic-urea')),
    routes: layer.querySelectorAll('.schematic-route').length,
    nodes: [...layer.querySelectorAll('.schematic-node')].map(node => `${node.getAttribute('cx')},${node.getAttribute('cy')}`),
    labels: layer.textContent,
    background: document.querySelector('#sceneBackground')?.getAttribute('src')
  }));
  expect(ureaState.schematic).toBe(true);
  expect(ureaState.routes).toBeGreaterThanOrEqual(10);
  expect(new Set(ureaState.nodes).size).toBeGreaterThan(6);
  expect(ureaState.labels).toContain('CPS I');
  expect(ureaState.labels).toContain('尿素');
  expect(ureaState.background).toMatch(/04-cytoplasm-mito-interface\.webp/);
  expect(ureaState.labels).toContain('ORNT1');
  const ureaLabelLayout = await page.locator('.overlay-schematic-urea').evaluate(root => {
    const rect = node => {
      const box = node.getBoundingClientRect();
      return { left: box.left, right: box.right, top: box.top, bottom: box.bottom };
    };
    const overlaps = (a, b, gap = 4) => !(
      a.right + gap <= b.left || b.right + gap <= a.left ||
      a.bottom + gap <= b.top || b.bottom + gap <= a.top
    );
    const transporter = rect(root.querySelector('[data-role="ornt1-label"]'));
    const exchange = rect(root.querySelector('[data-role="ornt1-exchange"]'));
    const cps1 = rect(root.querySelector('[data-role="cps1-label"]'));
    const ass1 = rect(root.querySelector('[data-role="ass1-label"]'));
    const citrullines = [...root.querySelectorAll('.schematic-label')]
      .filter(node => node.textContent === '瓜氨酸')
      .map(rect);
    return {
      transporterTouchesCitrulline: citrullines.some(node => overlaps(transporter, node)),
      exchangeTouchesCitrulline: citrullines.some(node => overlaps(exchange, node)),
      ornt1TouchesCps1: overlaps(transporter, cps1) || overlaps(exchange, cps1),
      ass1TouchesCitrulline: citrullines.some(node => overlaps(ass1, node))
    };
  });
  expect(ureaLabelLayout).toEqual({
    transporterTouchesCitrulline: false,
    exchangeTouchesCitrulline: false,
    ornt1TouchesCps1: false,
    ass1TouchesCitrulline: false
  });
  await page.screenshot({ path: 'output/playwright/urea-premium-sample-v2-local.png' });

  await page.locator('#sceneBack').click();
  await expect(page.locator('#sceneTitle')).toHaveText('线粒体总览');
  await page.locator('.scene-hotspot[data-target="mitochondria-inner-membrane"]').click();
  await page.locator('.scene-hotspot[data-pathway="malate_aspartate"]').click();
  const shuttleState = await page.locator('#sceneExpertOverlayLayer').evaluate(layer => ({
    routes: layer.querySelectorAll('.schematic-route').length,
    nodes: [...layer.querySelectorAll('.schematic-label')].map(node => node.textContent),
    background: document.querySelector('#sceneBackground')?.getAttribute('src')
  }));
  expect(shuttleState.routes).toBeGreaterThanOrEqual(6);
  expect(shuttleState.nodes.length).toBeGreaterThan(5);
  expect(new Set(shuttleState.nodes)).toEqual(new Set(['草酰乙酸', '苹果酸', '天冬氨酸']));
  expect(shuttleState.background).toMatch(/26-etc-complexes-detailed\.webp/);
  await page.screenshot({ path: 'output/playwright/malate-aspartate-premium-sample-v2-local.png' });

  await expect(page.locator('.scene-route-lane:visible')).toHaveCount(1);
  await page.locator('#sceneBack').click();
  await openScenePathway(page, 'glycerol_phosphate');
  await expect(page.locator('#sceneExpertOverlayLayer .overlay-schematic-glycerol_phosphate')).toHaveCount(1);
  await expect(page.locator('#sceneExpertOverlayLayer .overlay-schematic-malate_aspartate')).toHaveCount(0);
  await expect(page.locator('#sceneExpertOverlayLayer')).toContainText('本穿梭不把 NADH 本身送入基质');
  await page.screenshot({ path: 'output/playwright/glycerol-phosphate-premium-sample-v2-local.png' });
  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
});

test('TCA pathway uses a dedicated textbook mechanism overlay on the matrix image', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await enterExpertMap(page);

  await page.locator('.path-filter[data-path="tca"]').click();
  await page.locator('#expertPathPreview').click();
  await page.locator('.scene-hotspot[data-target="mitochondria-matrix"]').click();
  await page.locator('.scene-hotspot[data-pathway="tca"]').click();

  const tcaState = await page.locator('#sceneExpertOverlayLayer').evaluate(layer => ({
    schematic: Boolean(layer.querySelector('.overlay-schematic-tca')),
    nodeCount: layer.querySelectorAll('.overlay-schematic-tca .schematic-node').length,
    labels: layer.textContent,
    background: document.querySelector('#sceneBackground')?.getAttribute('src'),
    visibleLanes: [...document.querySelectorAll('.scene-route-lane')]
      .filter(node => getComputedStyle(node).display !== 'none').length,
    hotspotCount: document.querySelectorAll('#sceneHotspots .scene-hotspot').length
  }));

  expect(tcaState.schematic).toBe(true);
  expect(tcaState.nodeCount).toBe(9);
  expect(tcaState.labels).toContain('柠檬酸');
  expect(tcaState.labels).toContain('α-KGDH');
  expect(tcaState.labels).toContain('NADH');
  expect(tcaState.labels).toContain('FADH₂');
  expect(tcaState.labels).toContain('GTP');
  expect(tcaState.background).toMatch(/25-mitochondrial-matrix-detailed\.webp/);
  expect(tcaState.visibleLanes).toBe(1);
  expect(tcaState.hotspotCount).toBe(0);
  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
});

test('PDH pathway shows E1-E2-E3 cofactor handoff on the matrix image', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await enterExpertMap(page);

  await page.locator('.path-filter[data-path="pdh"]').click();
  await page.locator('#expertPathPreview').click();
  await openScenePathway(page, 'pdh');

  const pdhState = await page.locator('#sceneExpertOverlayLayer').evaluate(layer => ({
    schematic: Boolean(layer.querySelector('.overlay-schematic-pdh')),
    nodes: layer.querySelectorAll('.overlay-schematic-pdh .schematic-node').length,
    enzymeNodes: layer.querySelectorAll('.overlay-schematic-pdh .schematic-enzyme-node').length,
    labels: layer.textContent,
    background: document.querySelector('#sceneBackground')?.getAttribute('src'),
    genericCompartmentLabel: [...layer.querySelectorAll('.schematic-compartment-title')]
      .map(node => node.textContent)
  }));

  expect(pdhState.schematic).toBe(true);
  expect(pdhState.nodes).toBe(4);
  expect(pdhState.enzymeNodes).toBe(3);
  expect(pdhState.labels).toContain('E1 · 脱羧酶');
  expect(pdhState.labels).toContain('E2 · 转乙酰酶');
  expect(pdhState.labels).toContain('E3 · 脱氢酶');
  expect(pdhState.labels).toContain('TPP');
  expect(pdhState.labels).toContain('FAD → FADH₂');
  expect(pdhState.labels).toContain('NADH + H⁺');
  expect(pdhState.background).toMatch(/04-cytoplasm-mito-interface\.webp/);
  expect(pdhState.genericCompartmentLabel).toEqual([]);
  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
});

test('beta oxidation shows the four textbook reactions and the two-carbon split', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await enterExpertMap(page);

  await page.locator('.path-filter[data-path="beta_oxidation"]').click();
  await page.locator('#expertPathPreview').click();
  await page.locator('.scene-hotspot[data-target="mitochondria-matrix"]').click();
  await page.locator('.scene-hotspot[data-pathway="beta_oxidation"]').click();

  const betaState = await page.locator('#sceneExpertOverlayLayer').evaluate(layer => ({
    schematic: Boolean(layer.querySelector('.overlay-schematic-beta_oxidation')),
    nodes: layer.querySelectorAll('.overlay-schematic-beta_oxidation .schematic-node').length,
    routes: layer.querySelectorAll('.overlay-schematic-beta_oxidation .schematic-route').length,
    labels: layer.textContent,
    background: document.querySelector('#sceneBackground')?.getAttribute('src')
  }));

  expect(betaState.schematic).toBe(true);
  expect(betaState.nodes).toBe(6);
  expect(betaState.routes).toBeGreaterThanOrEqual(6);
  expect(betaState.labels).toContain('脂酰-CoA 脱氢酶');
  expect(betaState.labels).toContain('烯酰-CoA 水合酶');
  expect(betaState.labels).toContain('β-羟脂酰-CoA 脱氢酶');
  expect(betaState.labels).toContain('β-酮硫解酶');
  expect(betaState.labels).toContain('FAD → FADH₂');
  expect(betaState.labels).toContain('NAD⁺ → NADH + H⁺');
  expect(betaState.labels).toContain('缩短 2C，进入下一轮');
  expect(betaState.background).toMatch(/25-mitochondrial-matrix-detailed\.webp/);
  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
});

test('remaining core pathways each open their own bottom-image mechanism page', async ({ page }) => {
  test.setTimeout(120_000);
  const cases = [
    ['glycolysis', '细胞质代谢网络', /02-cytoplasm-overview\.webp/, ['葡萄糖', 'GAPDH', '丙酮酸']],
    ['gluconeogenesis', '细胞结构与代谢入口', /04-cytoplasm-mito-interface\.webp/, ['丙酮酸羧化酶', 'PEPCK', '葡萄糖-6-磷酸酶']],
    ['glycogenesis', '细胞质代谢网络', /02-cytoplasm-overview\.webp/, ['UDP-葡萄糖', '糖原合酶', '分支酶']],
    ['glycogenolysis', '细胞结构与代谢入口', /28-cell-overview-rev2\.webp/, ['糖原磷酸化酶', '去分支酶', 'G1P']],
    ['ppp', '细胞质代谢网络', /02-cytoplasm-overview\.webp/, ['G6PD', 'NADPH', 'R5P']],
    ['fa_synthesis', '细胞质代谢网络', /02-cytoplasm-overview\.webp/, ['ACC', '脂肪酸合酶', '棕榈酸']],
    ['purine', '细胞质代谢网络', /02-cytoplasm-overview\.webp/, ['PRPP', 'IMP', 'AMP']],
    ['pyrimidine', '线粒体总览', /04-cytoplasm-mito-interface\.webp/, ['DHODH', 'UMP', 'CTP', '主体在细胞质']],
    ['nucleotide_degradation', '细胞质代谢网络', /02-cytoplasm-overview\.webp/, ['核苷酸', '尿酸', '补救回收']]
  ];
  await page.setViewportSize({ width: 1280, height: 900 });
  await enterExpertMap(page);
  for (const [pathwayId, sceneTitle, backgroundPattern, labels] of cases) {
    await page.locator(`.path-filter[data-path="${pathwayId}"]`).click();
    await page.locator('#expertPathPreview').click({ force: true });
    await expect(page.locator('#sceneTitle')).toHaveText(sceneTitle);
    if (pathwayId === 'pyrimidine') {
      await page.locator('.scene-hotspot[data-target="mitochondria-inner-membrane"]').dispatchEvent('click');
    }
    await openScenePathway(page, pathwayId);
    await expect(page.locator(`#sceneExpertOverlayLayer .overlay-schematic-${pathwayId}`)).toHaveCount(1);
    await expect(page.locator('#sceneBackground')).toHaveAttribute('src', backgroundPattern);
    const text = await page.locator('#sceneExpertOverlayLayer').textContent();
    for (const label of labels) expect(text).toContain(label);
    if (['gluconeogenesis', 'glycogenesis', 'glycogenolysis', 'ppp', 'purine'].includes(pathwayId)) {
      await page.screenshot({ path: `output/playwright/${pathwayId}-premium-sample-v2-local.png` });
    }
    if (pathwayId === 'gluconeogenesis') {
      const g6pase = page.locator('.overlay-schematic-gluconeogenesis [data-role="g6pase-er"]');
      await expect(g6pase).toHaveAttribute('cx', '27');
      await expect(g6pase).toHaveAttribute('cy', '32');
      const titleInset = await page.locator('.overlay-schematic-gluconeogenesis').evaluate(root => {
        const overlay = root.ownerSVGElement.getBoundingClientRect();
        const title = root.querySelector('[data-role="er-title"]').getBoundingClientRect();
        return { left: title.left - overlay.left, top: title.top - overlay.top };
      });
      expect(titleInset.left).toBeGreaterThanOrEqual(24);
      expect(titleInset.top).toBeGreaterThanOrEqual(8);
    }
    if (pathwayId === 'glycogenolysis') {
      await expect(page.locator('.overlay-schematic-glycogenolysis')).toContainText('少量游离葡萄糖');
      await expect(page.locator('.overlay-schematic-glycogenolysis')).toContainText('α-1,6-糖苷酶');
      const labelGap = await page.locator('.overlay-schematic-glycogenolysis').evaluate(root => {
        const debranching = root.querySelector('[data-role="debranching-label"]').getBoundingClientRect();
        const freeGlucose = [...root.querySelectorAll('.schematic-label')]
          .find(node => node.textContent === '少量游离葡萄糖')
          .getBoundingClientRect();
        return freeGlucose.top - debranching.bottom;
      });
      expect(labelGap).toBeGreaterThanOrEqual(8);
    }
    if (pathwayId === 'fa_synthesis') {
      const erElongation = page.locator('.overlay-schematic-fa_synthesis [data-role="er-elongation"]');
      await expect(erElongation).toHaveAttribute('cx', '88');
      await expect(erElongation).toHaveAttribute('cy', '68');
      await expect(page.locator('.overlay-schematic-fa_synthesis')).toContainText('乙酰-CoA 引物');
      await page.screenshot({ path: 'output/playwright/fa_synthesis-premium-sample-v2-local.png' });
    }
    if (pathwayId === 'pyrimidine') {
      const dhodh = page.locator('.overlay-schematic-pyrimidine [data-role="dhodh"]');
      await expect(dhodh).toHaveAttribute('cx', '79');
      await expect(dhodh).toHaveAttribute('cy', '52');
      const carbamoylBox = await page.locator('.overlay-schematic-pyrimidine text').evaluateAll(nodes => {
        const target = nodes.find(node => node.textContent.includes('氨甲酰磷酸'));
        if (!target) return null;
        const rect = target.getBoundingClientRect();
        return { left: rect.left, right: rect.right };
      });
      expect(carbamoylBox).not.toBeNull();
      expect(carbamoylBox.left).toBeGreaterThan(300);
      await page.screenshot({ path: 'output/playwright/pyrimidine-premium-sample-v2-local.png' });
    }
    if (pathwayId === 'nucleotide_degradation') {
      await expect(page.locator('.overlay-schematic-nucleotide_degradation')).not.toContainText('溶酶体腔');
      await expect(page.locator('.overlay-schematic-nucleotide_degradation')).not.toContainText('DNA / RNA');
      await expect(page.locator('.overlay-schematic-nucleotide_degradation')).toContainText('AMP / GMP / UMP / TMP');
      await expect(page.locator('.overlay-schematic-nucleotide_degradation')).toContainText('核苷酸池（补救）');
      await page.screenshot({ path: 'output/playwright/nucleotide_degradation-premium-sample-v2-local.png' });
    }
    await expect(page.locator('.scene-route-lane:visible')).toHaveCount(1);
    await expect(page.locator('#sceneHotspots')).toBeEmpty();
    for (let depth = 0; depth < 4 && await page.locator('body').evaluate(body => body.classList.contains('scene-open')); depth += 1) {
      await page.locator('#sceneBack').dispatchEvent('click');
    }
    await expect(page.locator('body')).not.toHaveClass(/scene-open/);
  }
});

test('energy, lipid transport and amino-acid pathways use dedicated organelle mechanisms', async ({ page }) => {
  test.setTimeout(90_000);
  const cases = [
    ['oxphos', 'mitochondria-inner-membrane', /26-etc-complexes-detailed\.webp/, ['ATP 合酶', 'H⁺回流', 'ANT']],
    ['carnitine', null, /23-mitochondrion-blueprint\.webp/, ['CPT1', 'CACT', 'CPT2', 'CoA 不跨内膜']],
    ['ketone', 'mitochondria-matrix', /25-mitochondrial-matrix-detailed\.webp/, ['HMG-CoA', '乙酰乙酸', 'SCOT']],
    ['aa_carbon', null, /04-cytoplasm-mito-interface\.webp/, ['7 类中央代谢入口', '乙酰乙酰-CoA', '草酰乙酸']],
    ['transamination', null, /04-cytoplasm-mito-interface\.webp/, ['ALT / AST', '谷氨酸脱氢酶', 'NH₄⁺']]
  ];
  await page.setViewportSize({ width: 1280, height: 900 });
  await enterExpertMap(page);
  for (const [pathwayId, subcompartment, backgroundPattern, labels] of cases) {
    await page.locator(`.path-filter[data-path="${pathwayId}"]`).click();
    await page.locator('#expertPathPreview').click({ force: true });
    if (subcompartment) await page.locator(`.scene-hotspot[data-target="${subcompartment}"]`).dispatchEvent('click');
    await openScenePathway(page, pathwayId);
    await expect(page.locator(`#sceneExpertOverlayLayer .overlay-schematic-${pathwayId}`)).toHaveCount(1);
    await expect(page.locator('#sceneBackground')).toHaveAttribute('src', backgroundPattern);
    const text = await page.locator('#sceneExpertOverlayLayer').textContent();
    for (const label of labels) expect(text).toContain(label);
    if (pathwayId === 'oxphos') {
      const anchors = await page.locator('.overlay-schematic-oxphos [data-role]').evaluateAll(nodes => Object.fromEntries(
        nodes.map(node => [node.getAttribute('data-role'), Number(node.getAttribute('cx'))])
      ));
      expect(anchors).toEqual({ 'atp-synthase': 104, ant: 96, 'phosphate-carrier': 79 });
      expect(anchors['atp-synthase']).toBeGreaterThan(anchors.ant);
      await page.screenshot({ path: 'output/playwright/oxphos-premium-sample-v2-local.png' });
    }
    if (pathwayId === 'carnitine') {
      const anchors = await page.locator('.overlay-schematic-carnitine [data-role]').evaluateAll(nodes => Object.fromEntries(
        nodes.map(node => [node.getAttribute('data-role'), [Number(node.getAttribute('cx')), Number(node.getAttribute('cy'))]])
      ));
      expect(anchors).toEqual({ cpt1: [39, 40], cact: [59, 50], cpt2: [78, 58] });
      expect(anchors.cpt1[0]).toBeLessThan(anchors.cact[0]);
      expect(anchors.cact[0]).toBeLessThan(anchors.cpt2[0]);
      await page.screenshot({ path: 'output/playwright/carnitine-premium-sample-v2-local.png' });
    }
    if (['aa_carbon', 'transamination'].includes(pathwayId)) {
      await page.screenshot({ path: `output/playwright/${pathwayId}-premium-sample-v2-local.png` });
    }
    if (pathwayId === 'ketone') {
      const scot = page.locator('.overlay-schematic-ketone [data-role="scot"]');
      await expect(scot).toHaveAttribute('cx', '57');
      await expect(page.locator('.overlay-schematic-ketone')).toContainText('肝缺少 SCOT');
      await page.screenshot({ path: 'output/playwright/ketone-premium-sample-v2-local.png' });
    }
    await expect(page.locator('.scene-route-lane:visible')).toHaveCount(1);
    await expect(page.locator('#sceneHotspots')).toBeEmpty();
    for (let depth = 0; depth < 4 && await page.locator('body').evaluate(body => body.classList.contains('scene-open')); depth += 1) {
      await page.locator('#sceneBack').dispatchEvent('click');
    }
    await expect(page.locator('body')).not.toHaveClass(/scene-open/);
  }
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
  await expect(page.locator('#expertPathPreviewImage')).toHaveAttribute('src', /18-mitochondrion-isolated\.webp/);
  await page.locator('#expertPathPreview').click();
  await expect(page.locator('body')).toHaveClass(/scene-open/);
  await expect(page.locator('#inspector')).not.toHaveClass(/open/);
  await expect(page.locator('#sceneDeck')).not.toHaveClass(/pathway-visual-active/);
  await openScenePathway(page, 'pdh');
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
