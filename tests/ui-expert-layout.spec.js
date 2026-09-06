const { test, expect, appUrl } = require('./helpers.js');
const { CORE_STUDY_PATHWAY_IDS: CORE_PATHWAYS } = require('../shared/contracts.js');

async function focusExpertPathway(page, pathwayId, { waitForView = false } = {}) {
  // Pathway chips live in a horizontally clipped teaching dock. Trigger the
  // button's native click directly; dedicated navigation specs cover pointer
  // actionability, while this helper is responsible for deterministic state.
  await page.locator(`.path-filter[data-path="${pathwayId}"]`).evaluate(button => button.click());
  const activeRoutes = page.locator('#routeLayer .route.pathway-active');
  await expect.poll(() => activeRoutes.evaluateAll(routes => routes.filter(route => {
    const style = getComputedStyle(route);
    return Number(style.opacity) > .5 && style.stroke !== 'none';
  }).length)).toBeGreaterThan(0);
  await expect.poll(() => page.locator('#routeLayer .route:not(.pathway-active)').evaluateAll(routes =>
    routes.filter(route => Number(getComputedStyle(route).opacity) > .1).length
  )).toBe(0);
  if (waitForView) await page.waitForTimeout(480); // focusPathway animates the viewBox for 420 ms.
  return activeRoutes;
}

async function hoverRouteHitArea(page, selector) {
  const point = await page.locator(selector).first().evaluate(path => {
    const total = path.getTotalLength();
    const matrix = path.getScreenCTM();
    if (!matrix || !total) return null;
    for (const fraction of [.5, .35, .65, .2, .8]) {
      const local = path.getPointAtLength(total * fraction);
      const screen = new DOMPoint(local.x, local.y).matrixTransform(matrix);
      const hit = document.elementFromPoint(screen.x, screen.y)?.closest?.('.route,.route-aura');
      if (hit?.dataset.id === path.dataset.id
        || (path.dataset.moduleId && hit?.dataset.moduleId === path.dataset.moduleId)) {
        return { x: screen.x, y: screen.y };
      }
    }
    return null;
  });
  expect(point, `${selector} needs an unobstructed hover segment`).toBeTruthy();
  await page.mouse.move(point.x, point.y);
}

test('all 21 focused expert pathways render visible routes and matching arrows', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(appUrl('expert-pathway-route-regression'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.getByRole('button', { name: '专家地图', exact: true }).click();
  await expect(page.locator('.path-filter[data-path="all"]')).toHaveCount(1);
  await expect(page.locator('.path-filter:not([data-path="all"])')).toHaveCount(CORE_PATHWAYS.length);
  await expect(page.locator('#enzymeLayer .enzyme.reaction-module')).toHaveCount(12);

  for (const pathwayId of CORE_PATHWAYS) {
    await focusExpertPathway(page, pathwayId);
    const metrics = await page.evaluate(() => {
      const routes = [...document.querySelectorAll('#routeLayer .route.pathway-active')];
      return routes.map(route => {
        const stroke = getComputedStyle(route).stroke;
        const markerEnd = route.getAttribute('marker-end') || '';
        const markerId = markerEnd.match(/#([^)]*)/)?.[1];
        const markerPath = markerId ? document.querySelector(`#${CSS.escape(markerId)} path`) : null;
        const markerStroke = markerPath ? getComputedStyle(markerPath).stroke : null;
        return {
          stroke,
          markerEnd,
          markerStroke,
          reversible: route.classList.contains('reversible'),
          markerStart: route.getAttribute('marker-start') || ''
        };
      });
    });
    const enzymeMetrics = await page.evaluate(() => ({
      registered: document.querySelectorAll('#enzymeLayer .enzyme.pathway-active').length,
      visibleActive: [...document.querySelectorAll('#enzymeLayer .enzyme.pathway-active')]
        .filter(enzyme => Number(getComputedStyle(enzyme).opacity) > .5).length,
      unrelated: [...document.querySelectorAll('#enzymeLayer .enzyme:not(.pathway-active)')]
        .filter(enzyme => Number(getComputedStyle(enzyme).opacity) > .5).length,
      unrelatedRoutes: [...document.querySelectorAll('#routeLayer .route:not(.pathway-active)')]
        .filter(route => Number(getComputedStyle(route).opacity) > .1).length,
      numberedSteps: [...document.querySelectorAll('#entityLayer .entity.pathway-active[data-expert-step]')]
        .map(entity => Number(entity.dataset.expertStep))
        .sort((left, right) => left - right)
    }));
    expect(metrics.length, `${pathwayId} should show active routes`).toBeGreaterThan(0);
    expect(metrics.every(route => route.stroke !== 'none'), `${pathwayId} routes need a visible stroke`).toBeTruthy();
    expect(metrics.every(route => route.markerEnd && route.markerStroke === route.stroke), `${pathwayId} arrows should match route color`).toBeTruthy();
    expect(metrics.every(route => !route.reversible || route.markerStart === route.markerEnd), `${pathwayId} reversible routes need arrows at both ends`).toBeTruthy();
    expect(enzymeMetrics.registered, `${pathwayId} should register its enzyme labels`).toBeGreaterThan(0);
    expect(enzymeMetrics.visibleActive, `${pathwayId} should keep enzyme labels hidden until requested`).toBe(0);
    expect(enzymeMetrics.unrelated, `${pathwayId} should hide unrelated enzyme labels`).toBe(0);
    expect(enzymeMetrics.unrelatedRoutes, `${pathwayId} should hide unrelated routes`).toBe(0);
    expect(enzymeMetrics.numberedSteps.length, `${pathwayId} should expose numbered map nodes`).toBeGreaterThan(0);
    expect(enzymeMetrics.numberedSteps, `${pathwayId} step numbers should stay consecutive`).toEqual(
      Array.from({ length: enzymeMetrics.numberedSteps.length }, (_, index) => index + 1)
    );
    if (pathwayId === 'pdh') {
      const revealRoute = page.locator('#routeLayer .route.pathway-active:not(.route-teaching-detail):not(.route-classification)').first();
      const revealId = await revealRoute.getAttribute('data-id');
      await hoverRouteHitArea(page, `#routeLayer .route-aura.pathway-active[data-id="${revealId}"]`);
      await expect.poll(() => page.locator('#enzymeLayer .enzyme.pathway-active').evaluateAll(nodes =>
        nodes.filter(node => Number(getComputedStyle(node).opacity) > .5).length
      ), { message: `${pathwayId} route hover should reveal its enzyme` }).toBeGreaterThan(0);
      await page.mouse.move(2, 2);
      await expect.poll(() => page.locator('#enzymeLayer .enzyme.pathway-active').evaluateAll(nodes =>
        nodes.filter(node => Number(getComputedStyle(node).opacity) > .5).length
      )).toBe(0);
    }
  }
});

test('expert pathway step navigator follows numbered nodes without leaving focus', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(appUrl('expert-step-navigator'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.getByRole('button', { name: '专家地图', exact: true }).click();
  await focusExpertPathway(page, 'tca');

  const status = page.locator('#expertStepStatus');
  await expect(status).toHaveText(/— \/ \d+/);
  await page.locator('#expertStepNext').click();
  await expect(status).toHaveText(/1 \/ \d+/);
  await expect(page.locator('body')).toHaveClass(/pathway-focus/);
  await expect(page.locator('#inspector')).not.toHaveClass(/open/);
  await expect(page.locator('#entityLayer .entity.active[data-expert-step="1"]')).toHaveCount(1);

  await page.locator('#expertStepNext').click();
  await expect(status).toHaveText(/2 \/ \d+/);
  await expect(page.locator('#entityLayer .entity.active[data-expert-step="2"]')).toHaveCount(1);
  await page.locator('#expertStepPrev').click();
  await expect(status).toHaveText(/1 \/ \d+/);
});

test('all 21 expert pathway briefs expose a pathway-specific teaching contract', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(appUrl('expert-pathway-brief-contract'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.getByRole('button', { name: '专家地图', exact: true }).click();

  const contracts = {};
  for (const pathwayId of CORE_PATHWAYS) {
    await focusExpertPathway(page, pathwayId);
    contracts[pathwayId] = await page.evaluate(() => ({
      title: document.getElementById('expertBriefTitle')?.textContent.trim(),
      purpose: document.getElementById('expertBriefPurpose')?.textContent.trim(),
      input: document.getElementById('expertBriefInput')?.textContent.trim(),
      output: document.getElementById('expertBriefOutput')?.textContent.trim(),
      location: document.getElementById('expertBriefLocation')?.textContent.trim(),
      order: document.getElementById('expertBriefOrder')?.textContent.trim()
    }));
    const values = Object.values(contracts[pathwayId]);
    expect(values.every(Boolean), `${pathwayId} brief should fill all five teaching fields`).toBeTruthy();
    expect(`${contracts[pathwayId].input} ${contracts[pathwayId].output}`).not.toMatch(/见主链|—/);
    expect(contracts[pathwayId].order, `${pathwayId} needs a concrete reading sequence`).toContain('→');
    expect(contracts[pathwayId].order).not.toBe('沿高亮主线 → 再看支路');
  }

  expect(contracts.etc.order).toMatch(/I \/ II.*CoQ.*III.*Cyt c.*IV \/ O₂/);
  expect(contracts.gluconeogenesis.order).toMatch(/丙酮酸入基质.*OAA.*G6P 入内质网/);
  expect(contracts.carnitine.order).toMatch(/CPT1.*CACT.*CPT2.*β-氧化/);
  expect(contracts.purine.order).toMatch(/PRPP.*IMP.*AMP 或 GMP/);
  expect(contracts.nucleotide_degradation.order).toMatch(/嘌呤.*尿酸.*嘧啶/);
  expect(new Set(Object.values(contracts).map(contract => contract.order)).size).toBe(CORE_PATHWAYS.length);
});

test('multi-participant reactions converge on one enzyme module', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(appUrl('expert-reaction-module-regression'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.getByRole('button', { name: '专家地图', exact: true }).click();

  for (const pathwayId of ['oxphos', 'urea', 'malate_aspartate', 'glycerol_phosphate']) {
    await focusExpertPathway(page, pathwayId, { waitForView: true });
    const modules = await page.locator('#enzymeLayer .enzyme.reaction-module.pathway-active').evaluateAll(nodes => nodes.map(node => ({
      id: node.dataset.moduleId,
      reactionCount: Number(node.dataset.reactionCount),
      visible: Number(getComputedStyle(node).opacity) > .5,
      routeCount: document.querySelectorAll(`#routeLayer .route[data-module-id="${CSS.escape(node.dataset.moduleId)}"]`).length
    })));
    expect(modules.length, `${pathwayId} should expose grouped reaction modules`).toBeGreaterThan(0);
    expect(modules.every(module => !module.visible && module.reactionCount > 1 && module.routeCount === module.reactionCount), `${pathwayId} module legs should share one hidden-by-default label`).toBeTruthy();
    const moduleId = modules[0].id;
    await hoverRouteHitArea(page, `#routeLayer .route-aura[data-module-id="${moduleId}"]`);
    await expect(page.locator(`#enzymeLayer .enzyme[data-module-id="${moduleId}"]`)).toHaveCSS('opacity', '1');
    await page.mouse.move(2, 2);
  }
});

test('all 21 expert pathways keep focused labels readable inside the visible canvas', async ({ page }) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(appUrl('expert-pathway-layout-regression'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.getByRole('button', { name: '专家地图', exact: true }).click();

  for (const pathwayId of CORE_PATHWAYS) {
    await focusExpertPathway(page, pathwayId, { waitForView: true });
    const metrics = await page.evaluate(() => {
      const visibleTop = document.querySelector('.topbar')?.getBoundingClientRect().bottom || 0;
      const visibleBottom = document.querySelector('.pathbar')?.getBoundingClientRect().top || innerHeight;
      const brief = document.querySelector('.expert-pathway-brief')?.getBoundingClientRect();
      const labels = [...document.querySelectorAll('#entityLayer .entity.pathway-active .entity-label')]
        .filter(label => {
          const entityStyle = getComputedStyle(label.closest('.entity'));
          return entityStyle.visibility !== 'hidden' && Number(entityStyle.opacity) > .5
            && Number(getComputedStyle(label).opacity) > .5;
        })
        .map(label => {
          const rect = label.getBoundingClientRect();
          return { text: label.textContent, x: rect.x, y: rect.y, right: rect.right, bottom: rect.bottom };
        });
      const overlaps = [];
      for (let left = 0; left < labels.length; left += 1) {
        for (let right = left + 1; right < labels.length; right += 1) {
          const a = labels[left], b = labels[right];
          if (Math.min(a.right, b.right) > Math.max(a.x, b.x)
            && Math.min(a.bottom, b.bottom) > Math.max(a.y, b.y)) overlaps.push(`${a.text}~${b.text}`);
        }
      }
      return {
        count: labels.length,
        overlaps,
        briefOverlaps: brief ? labels.filter(label => Math.min(label.right, brief.right) > Math.max(label.x, brief.left)
          && Math.min(label.bottom, brief.bottom) > Math.max(label.y, brief.top)).map(label => label.text) : [],
        clipped: labels.filter(label => label.x < 0 || label.right > innerWidth
          || label.y < visibleTop || label.bottom > visibleBottom).map(label => label.text)
      };
    });
    expect(metrics.count, `${pathwayId} should show pathway labels`).toBeGreaterThan(1);
    expect(metrics.overlaps, `${pathwayId} has overlapping labels`).toEqual([]);
    expect(metrics.briefOverlaps, `${pathwayId} has labels hidden under its teaching brief`).toEqual([]);
    expect(metrics.clipped, `${pathwayId} has labels hidden by navigation`).toEqual([]);
  }
});

test('ETC focused view keeps enzyme labels clear of each other and entity labels', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(appUrl('expert-etc-label-spacing-regression'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.getByRole('button', { name: '专家地图', exact: true }).click();
  await focusExpertPathway(page, 'etc');
  await expect.poll(() => page.locator('#enzymeLayer .enzyme.pathway-active').evaluateAll(nodes =>
    nodes.filter(node => Number(getComputedStyle(node).opacity) > .5).length
  )).toBe(0);
  await page.locator('#expertDetailToggle').click();
  await expect(page.locator('#expertDetailToggle')).toHaveAttribute('aria-pressed', 'true');

  const overlaps = await page.evaluate(() => {
    const area = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left))
      * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    const enzymes = [...document.querySelectorAll('#enzymeLayer .enzyme.pathway-active rect')]
      .filter(node => Number(getComputedStyle(node).opacity) > .5)
      .map(node => ({ kind: 'enzyme', name: node.parentElement?.textContent.trim(), rect: node.getBoundingClientRect() }));
    const entities = [...document.querySelectorAll('#entityLayer .entity.pathway-active .entity-label')]
      .filter(node => Number(getComputedStyle(node).opacity) > .5)
      .map(node => ({ kind: 'entity', name: node.textContent.trim(), rect: node.getBoundingClientRect() }));
    const labels = [...enzymes, ...entities];
    const collisions = [];
    for (let left = 0; left < labels.length; left += 1) {
      for (let right = left + 1; right < labels.length; right += 1) {
        if (labels[left].kind === 'entity' && labels[right].kind === 'entity') continue;
        const overlap = area(labels[left].rect, labels[right].rect);
        if (overlap > 8) collisions.push(`${labels[left].name}~${labels[right].name}:${Math.round(overlap)}`);
      }
    }
    return collisions;
  });
  expect(overlaps).toEqual([]);
});

test('expert details stay on demand and ETC hands ATP synthesis to oxphos', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(appUrl('expert-progressive-disclosure-regression'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.getByRole('button', { name: '专家地图', exact: true }).click();
  await focusExpertPathway(page, 'etc');

  const details = page.locator('#routeLayer .route.route-teaching-detail.pathway-active');
  await expect(details).toHaveCount(4);
  await expect.poll(() => details.evaluateAll(routes => routes.filter(route => Number(getComputedStyle(route).opacity) > .1).length)).toBe(0);
  await expect(page.locator('#expertBriefOutput')).toHaveText('质子动力势 + H₂O');
  await expect(page.locator('#expertBriefOrder')).toContainText('IV / O₂');

  await page.locator('#expertDetailToggle').click();
  await expect.poll(() => details.evaluateAll(routes => routes.filter(route => Number(getComputedStyle(route).opacity) > .3).length)).toBe(4);
  await expect(page.locator('#expertDetailToggle')).toHaveText('隐藏酶与细节');

  await focusExpertPathway(page, 'oxphos');
  await expect(page.locator('#expertBriefOutput')).toContainText('ATP');
  await expect(page.locator('#expertBriefOrder')).toContainText('ANT');
});

test('cross-compartment pathways keep their membrane-side order and show the matching guide', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(appUrl('expert-compartment-topology-regression'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.getByRole('button', { name: '专家地图', exact: true }).click();

  const checkPathway = async (pathwayId, guideId, orderedNodes) => {
    await focusExpertPathway(page, pathwayId);
    await expect(page.locator(`[data-guide="${guideId}"]`)).toHaveClass(/active/);
    const positions = await page.evaluate(nodes => {
      const data = window.METABOLIC_COMPILED;
      const layout = data.expertPathwayLayouts;
      return nodes.map(node => {
        const entity = data.entities.find(item => item.name === node.name && item.compartment === node.compartment);
        return entity ? layout[node.pathwayId][entity.id]?.y : null;
      });
    }, orderedNodes.map(node => ({ ...node, pathwayId })));
    expect(positions.every(Number.isFinite), `${pathwayId} topology nodes should resolve`).toBeTruthy();
    for (let index = 1; index < positions.length; index += 1) {
      expect(positions[index], `${pathwayId} vertical topology order`).toBeGreaterThan(positions[index - 1]);
    }
  };

  await checkPathway('etc', 'mitochondrial-inner-membrane-unfolded', [
    { name: '膜间隙 H⁺', compartment: '线粒体膜间隙' },
    { name: '复合体 I', compartment: '线粒体内膜' },
    { name: 'NADH', compartment: '线粒体基质' }
  ]);
  await checkPathway('glycogenolysis', 'endoplasmic-reticulum-membrane-unfolded', [
    { name: '葡萄糖-6-磷酸', compartment: '细胞质' },
    { name: '葡萄糖-6-磷酸', compartment: '内质网腔' }
  ]);
  await checkPathway('gluconeogenesis', 'gluconeogenesis-cross-compartment-route', [
    { name: '丙酮酸', compartment: '细胞质' },
    { name: '丙酮酸', compartment: '线粒体膜间隙' },
    { name: '丙酮酸', compartment: '线粒体基质' }
  ]);
});

test('P1 pathway layouts preserve their pathway-specific topology', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(appUrl('expert-p1-topology-regression'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.getByRole('button', { name: '专家地图', exact: true }).click();

  const focus = async pathwayId => {
    await focusExpertPathway(page, pathwayId);
  };

  await focus('tca');
  const tcaPairs = await page.evaluate(() => {
    const data = window.METABOLIC_COMPILED;
    const entityById = new Map(data.entities.map(entity => [entity.id, entity]));
    return [...document.querySelectorAll('#routeLayer .route.pathway-active')].map(route => {
      const reaction = data.reactions.find(item => item.id === route.dataset.id);
      return reaction ? `${entityById.get(reaction.from)?.name}>${entityById.get(reaction.to)?.name}` : '';
    });
  });
  expect(tcaPairs).toEqual(expect.arrayContaining([
    '柠檬酸>异柠檬酸',
    '异柠檬酸>α-酮戊二酸',
    'α-酮戊二酸>琥珀酰辅酶 A',
    '琥珀酰辅酶 A>琥珀酸',
    '琥珀酸>延胡索酸',
    '延胡索酸>苹果酸',
    '苹果酸>草酰乙酸',
    '草酰乙酸>柠檬酸'
  ]));

  await focus('oxphos');
  const ant = await page.evaluate(() => {
    const enzyme = [...document.querySelectorAll('#enzymeLayer .enzyme.pathway-active')]
      .find(node => node.textContent.includes('ANT'));
    const moduleId = enzyme?.dataset.moduleId;
    const paths = moduleId
      ? [...document.querySelectorAll(`#routeLayer .route[data-module-id="${CSS.escape(moduleId)}"]`)]
      : [];
    return {
      moduleId,
      routeCount: paths.length,
      cubicSegments: paths.map(path => (path.getAttribute('d').match(/\bC\b/g) || []).length)
    };
  });
  expect(ant.moduleId, 'ANT exchange should remain one named module').toBeTruthy();
  expect(ant.routeCount, 'ANT should render two parallel nucleotide exchange routes').toBe(2);
  expect(ant.cubicSegments, 'ANT routes should connect directly instead of forming a shared X/triangle').toEqual([1, 1]);

  await focus('carnitine');
  const carnitine = await page.evaluate(() => ({
    enzymes: [...document.querySelectorAll('#enzymeLayer .enzyme.pathway-active')]
      .map(node => node.textContent.trim()),
    annotation: [...document.querySelectorAll('.expert-pathway-annotation.active')]
      .map(node => node.textContent).join(' ')
  }));
  expect(carnitine.enzymes.some(label => label.includes('CPT1'))).toBeTruthy();
  expect(carnitine.enzymes.some(label => label.includes('CACT'))).toBeTruthy();
  expect(carnitine.enzymes.some(label => label.includes('CPT2'))).toBeTruthy();
  expect(carnitine.annotation).toContain('CPT1');
  expect(carnitine.annotation).toContain('CACT');
  expect(carnitine.annotation).toContain('CPT2');

  await focus('aa_carbon');
  await expect(page.locator('#routeLayer .route.route-teaching-detail.pathway-active')).toHaveCount(3);
  await expect(page.locator('#entityLayer .entity.pathway-teaching-detail.pathway-active')).toHaveCount(3);
  await expect.poll(() => page.locator('#entityLayer .entity.pathway-teaching-detail.pathway-active').evaluateAll(nodes =>
    nodes.filter(node => Number(getComputedStyle(node).opacity) > .1).length
  )).toBe(0);
  await expect.poll(() => page.locator('#entityLayer .entity.pathway-teaching-detail.pathway-active').evaluateAll(nodes =>
    nodes.every(node => node.getAttribute('tabindex') === '-1')
  )).toBe(true);
  await expect.poll(() => page.locator('#routeLayer .route.route-teaching-detail.pathway-active').evaluateAll(routes =>
    routes.every(route => route.getAttribute('tabindex') === '-1' && route.getAttribute('aria-hidden') === 'true')
  )).toBe(true);
  await page.locator('#expertDetailToggle').click();
  await expect.poll(() => page.locator('#entityLayer .entity.pathway-teaching-detail.pathway-active').evaluateAll(nodes =>
    nodes.every(node => node.getAttribute('tabindex') === '0')
  )).toBe(true);
  await expect.poll(() => page.locator('#routeLayer .route.route-teaching-detail.pathway-active').evaluateAll(routes =>
    routes.every(route => route.getAttribute('tabindex') === '0' && route.getAttribute('aria-hidden') === 'false')
  )).toBe(true);
  await page.waitForTimeout(480);
  await expect.poll(() => page.locator('#entityLayer .entity.pathway-teaching-detail.pathway-active').evaluateAll(nodes => {
    const top = document.querySelector('.topbar')?.getBoundingClientRect().bottom || 0;
    const bottom = document.querySelector('.pathbar')?.getBoundingClientRect().top || innerHeight;
    const brief = document.querySelector('.expert-pathway-brief')?.getBoundingClientRect();
    return nodes.every(node => {
      const box = node.getBoundingClientRect();
      const overlapsBrief = brief && Math.min(box.right, brief.right) > Math.max(box.left, brief.left)
        && Math.min(box.bottom, brief.bottom) > Math.max(box.top, brief.top);
      return box.top >= top && box.bottom <= bottom && box.left >= 0 && box.right <= innerWidth
        && !overlapsBrief;
    });
  })).toBe(true);

  await focus('tca');
  const matrixAlphaKetoglutarate = page.locator('#entityLayer .entity.pathway-active').filter({ hasText: 'α-酮戊二酸' });
  await expect.poll(() => matrixAlphaKetoglutarate.evaluateAll(nodes =>
    nodes.some(node => node.getAttribute('tabindex') === '0' && node.getAttribute('aria-hidden') === 'false')
  )).toBe(true);

  await focus('urea');
  await expect(page.locator('[data-guide="nitrogen-cytosol-matrix-cycle"]')).toHaveClass(/active/);
  await expect(page.locator('[data-guide="mitochondrial-inner-membrane-unfolded"]')).not.toHaveClass(/active/);

  await focus('glycogenolysis');
  await expect(page.locator('.expert-pathway-annotation.active')).toContainText('仅肝 / 肾');

  await focus('nucleotide_degradation');
  await expect(page.locator('[data-guide="cytosol-focused-pathway-field"]')).toHaveClass(/active/);
  await expect(page.locator('.expert-pathway-annotation.active .expert-context-link')).toHaveCount(0);
  await expect(page.locator('#routeLayer .route.route-classification.pathway-active')).toHaveCount(4);
  await expect(page.locator('#routeLayer .route.route-classification.pathway-active[role="button"]')).toHaveCount(0);
  await expect(page.locator('.expert-pathway-annotation.active')).toContainText('不可点击为单一化学反应');

  await focus('gluconeogenesis');
  await expect(page.locator('.expert-pathway-annotation.active .expert-substrate-leg')).toHaveCount(1);
  await expect(page.locator('.expert-pathway-annotation.active').filter({ hasText: 'DHAP 与 G3P 汇聚' })).toHaveCount(1);

  await focus('pyrimidine');
  await expect(page.locator('[data-guide="cytosol-focused-pathway-field"]')).toHaveClass(/active/);
  const pyrimidineMaxSpan = await page.evaluate(() => {
    const data = window.METABOLIC_COMPILED;
    const layout = data.expertPathwayLayouts.pyrimidine;
    const entityById = new Map(data.entities.map(entity => [entity.id, entity]));
    return Math.max(...data.reactions
      .filter(reaction => (Array.isArray(reaction.group) ? reaction.group : [reaction.group]).includes('pyrimidine'))
      .map(reaction => {
        const from = layout[reaction.from], to = layout[reaction.to];
        return from && to ? Math.hypot(from.x - to.x, from.y - to.y) : Infinity;
      }));
  });
  expect(pyrimidineMaxSpan).toBeLessThanOrEqual(160);

  await focus('glycolysis');
  await expect(page.locator('[data-guide="cytosol-focused-pathway-field"]')).toHaveClass(/active/);
  const triose = await page.evaluate(() => {
    const enzymes = [...document.querySelectorAll('#enzymeLayer .enzyme.pathway-active')];
    const aldolase = enzymes.find(node => node.textContent.includes('醛缩酶'));
    return {
      aldolaseProducts: Number(aldolase?.dataset.reactionCount || 0),
      hasTpi: enzymes.some(node => node.textContent.includes('磷酸丙糖异构酶')),
      annotation: [...document.querySelectorAll('.expert-pathway-annotation.active')]
        .map(node => node.textContent).join(' ')
    };
  });
  expect(triose.aldolaseProducts, 'aldolase should explicitly split F-1,6-BP into DHAP and G3P').toBe(2);
  expect(triose.hasTpi, 'TPI should remain a separate DHAP/G3P connection').toBeTruthy();
  expect(triose.annotation).toContain('醛缩酶');
  expect(triose.annotation).toContain('两个三碳分子');
});
