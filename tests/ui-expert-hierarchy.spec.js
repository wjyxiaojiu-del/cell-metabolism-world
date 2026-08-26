const { test, expect, appUrl } = require('./helpers.js');

test('expert hierarchy keeps the root scene structural and hotspot groups separated', async ({ page }) => {
  await page.goto(appUrl('expert-hierarchy-contract'), { waitUntil: 'networkidle' });
  const contract = await page.evaluate(() => {
    const atlas = window.METABOLIC_ATLAS_DATA;
    const root = atlas.scenes['cell-atlas'];
    const membrane = atlas.scenes['mitochondria-inner-membrane'];
    const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
    const hotspots = root.hotspots || [];
    const membraneHotspots = (membrane.hotspots || []).filter(item => item.pathway);
    const distances = hotspots.flatMap((left, index) => hotspots.slice(index + 1)
      .map(right => distance(left, right)));
    return {
      rootPathways: hotspots.filter(item => item.pathway).map(item => item.pathway),
      rootMinDistance: Math.min(...distances),
      expertEntries: {
        gluconeogenesis: atlas.pathways.gluconeogenesis.expertEntryScene,
        glycogenolysis: atlas.pathways.glycogenolysis.expertEntryScene
      },
      membraneUpper: membraneHotspots.filter(item => item.y < 55).length,
      membraneLower: membraneHotspots.filter(item => item.y >= 65).length,
      membraneMinDistance: Math.min(...membraneHotspots.flatMap((left, index) => membraneHotspots.slice(index + 1)
        .map(right => distance(left, right))))
    };
  });

  expect(contract.rootPathways).toEqual([]);
  expect(contract.rootMinDistance).toBeGreaterThanOrEqual(7.5);
  expect(contract.expertEntries).toEqual({ gluconeogenesis: 'cytosol', glycogenolysis: 'cytosol' });
  expect(contract.membraneUpper).toBeGreaterThanOrEqual(3);
  expect(contract.membraneLower).toBeGreaterThanOrEqual(3);
  expect(contract.membraneMinDistance).toBeGreaterThanOrEqual(7.5);
});

test('expert pathway preview enters the dedicated scene instead of the root scene', async ({ page }) => {
  await page.goto(appUrl('expert-hierarchy-navigation'), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.getByRole('button', { name: '专家地图', exact: true }).click();
  await page.locator('.path-filter[data-path="gluconeogenesis"]').click();

  await expect(page.locator('#sceneRouteLanes .scene-route-lane')).toHaveCount(0);
  await page.locator('#expertPathPreview').click();
  await expect(page.locator('#sceneDeck')).toHaveAttribute('data-scene', 'cytosol');
  await expect(page.locator('#sceneDeck')).toHaveClass(/pathway-visual-active/);
  await expect(page.locator('#sceneExpertOverlayLayer .overlay-schematic-gluconeogenesis')).toHaveCount(1);
});

test('every cross-compartment same-substance reaction has a carrier annotation', async ({ page }) => {
  await page.goto(appUrl('expert-hierarchy-transfer-contract'), { waitUntil: 'networkidle' });
  const missing = await page.evaluate(() => window.METABOLIC_COMPILED.reactions
    .filter(reaction => {
      const fromAt = reaction.from.lastIndexOf('@');
      const toAt = reaction.to.lastIndexOf('@');
      return fromAt > 0 && toAt > 0
        && reaction.from.slice(0, fromAt) === reaction.to.slice(0, toAt)
        && reaction.from.slice(fromAt + 1) !== reaction.to.slice(toAt + 1);
    })
    .filter(reaction => !String(reaction.enzyme || '').trim())
    .map(reaction => reaction.id));
  expect(missing).toEqual([]);
});
