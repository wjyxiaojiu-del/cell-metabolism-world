const { test, expect, appUrl } = require('./helpers.js');

const URL = appUrl('reaction-notes-1');

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

async function openPathwayMechanism(page, pathwayId) {
  await page.locator(`.path-filter[data-path="${pathwayId}"]`).click();
  await page.locator('#expertPathPreview').click();
  if (await page.locator(`#sceneDeck.pathway-visual-active[data-pathway="${pathwayId}"]`).count()) return;
  const hotspot = page.locator(`#sceneHotspots .scene-hotspot[data-pathway="${pathwayId}"]`);
  if (await hotspot.count()) await hotspot.first().click({ force: true });
  else await page.locator(`.scene-route-lane[data-pathway="${pathwayId}"]`).click({ force: true });
  await expect(page.locator(`#sceneDeck.pathway-visual-active[data-pathway="${pathwayId}"]`)).toBeAttached();
}

test('reaction detail shows the plain-language note with doing why hook', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await enterExpertMap(page);

  await openPathwayMechanism(page, 'glycolysis');
  const steps = page.locator('#scopeExchange .scene-reaction-step');
  await expect(steps.first()).toBeVisible();
  await steps.first().click();
  await expect(page.locator('#sceneDeck')).toHaveClass(/pathway-reaction-active/);

  const note = page.locator('#inspectorReactionNote');
  await expect(note).toBeVisible();
  await expect(note.locator('#reactionNoteDoing')).not.toBeEmpty();
  await expect(note.locator('#reactionNoteWhy')).not.toBeEmpty();
  await expect(note.locator('#reactionNoteHook')).not.toBeEmpty();
  await expect(note).toContainText('葡萄糖');

  // 非反应详情（回到通路机制页）时整块隐藏，不残留上一条精讲。
  await page.locator('#sceneBack').click();
  await expect(page.locator('#sceneDeck')).not.toHaveClass(/pathway-reaction-active/);
  await expect(note).toBeHidden();

  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
});

test('every core pathway reaction resolves a complete note in the loaded page data', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await expect(page.locator('#studentWorkspace')).toBeVisible();

  const audit = await page.evaluate(() => {
    const modules = {
      biooxidation: ['pdh', 'tca', 'malate_aspartate', 'glycerol_phosphate', 'etc', 'oxphos'],
      carbohydrate: ['glycolysis', 'gluconeogenesis', 'glycogenesis', 'glycogenolysis', 'ppp'],
      lipid: ['fa_synthesis', 'carnitine', 'beta_oxidation', 'ketone'],
      amino: ['transamination', 'urea', 'aa_carbon'],
      nucleotide: ['purine', 'pyrimidine', 'nucleotide_degradation']
    };
    const notes = window.STUDENT_REACTION_NOTES || {};
    const data = window.METABOLIC_COMPILED;
    const groupsFor = reaction => Array.isArray(reaction.group) ? reaction.group : [reaction.group];
    const missing = [];
    const incomplete = [];
    let total = 0;
    let covered = 0;
    for (const ids of Object.values(modules)) {
      for (const pathwayId of ids) {
        for (const reaction of data.reactions) {
          if (!groupsFor(reaction).includes(pathwayId)) continue;
          total += 1;
          const note = notes[`${pathwayId}|${reaction.from}>${reaction.to}`];
          if (!note) { missing.push(`${pathwayId}|${reaction.from}>${reaction.to}`); continue; }
          if (!note.doing || !note.why || !note.hook) incomplete.push(`${pathwayId}|${reaction.from}>${reaction.to}`);
          else covered += 1;
        }
      }
    }
    return { total, covered, missing, incomplete, loaded: Object.keys(notes).length };
  });

  expect(audit.loaded).toBe(171);
  expect(audit.total).toBe(171);
  expect(audit.covered).toBe(171);
  expect(audit.missing).toEqual([]);
  expect(audit.incomplete).toEqual([]);
  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
});
