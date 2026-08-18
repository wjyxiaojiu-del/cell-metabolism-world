const { test, expect, appUrl } = require('./helpers.js');

const CORE_PATHWAYS = [
  'pdh', 'tca', 'malate_aspartate', 'glycerol_phosphate', 'etc', 'oxphos',
  'glycolysis', 'gluconeogenesis', 'glycogenesis', 'glycogenolysis', 'ppp',
  'fa_synthesis', 'carnitine', 'beta_oxidation', 'ketone',
  'transamination', 'urea', 'aa_carbon',
  'purine', 'pyrimidine', 'nucleotide_degradation'
];

test('all 21 expert pathways keep focused labels readable inside the visible canvas', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(appUrl('expert-pathway-layout-regression'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.getByRole('button', { name: '专家地图', exact: true }).click();

  for (const pathwayId of CORE_PATHWAYS) {
    await page.locator(`.path-filter[data-path="${pathwayId}"]`).click();
    await page.waitForTimeout(450);
    const metrics = await page.evaluate(() => {
      const visibleTop = document.querySelector('.topbar')?.getBoundingClientRect().bottom || 0;
      const visibleBottom = document.querySelector('.pathbar')?.getBoundingClientRect().top || innerHeight;
      const labels = [...document.querySelectorAll('#entityLayer .entity.pathway-active .entity-label')]
        .filter(label => Number(getComputedStyle(label).opacity) > .5)
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
        clipped: labels.filter(label => label.x < 0 || label.right > innerWidth
          || label.y < visibleTop || label.bottom > visibleBottom).map(label => label.text)
      };
    });
    expect(metrics.count, `${pathwayId} should show pathway labels`).toBeGreaterThan(1);
    expect(metrics.overlaps, `${pathwayId} has overlapping labels`).toEqual([]);
    expect(metrics.clipped, `${pathwayId} has labels hidden by navigation`).toEqual([]);
  }
});

test('cross-compartment pathways keep their membrane-side order and show the matching guide', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(appUrl('expert-compartment-topology-regression'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.getByRole('button', { name: '专家地图', exact: true }).click();

  const checkPathway = async (pathwayId, guideId, orderedNodes) => {
    await page.locator(`.path-filter[data-path="${pathwayId}"]`).click();
    await page.waitForTimeout(520);
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
