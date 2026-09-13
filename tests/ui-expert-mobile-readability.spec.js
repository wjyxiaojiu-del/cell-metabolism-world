const { test, expect } = require('playwright/test');

const URL = '/index.html?v=expert-mobile-readability';

test('mobile zoom preserves the current mechanism and makes it scrollably readable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);
  await page.locator('.path-filter[data-path="glycolysis"]').click();
  await page.locator('#expertPathPreview').click();
  await page.locator('[data-pathway-view="glycolysis"]').click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('PFK-1');
  await expect(dialog).toContainText('净 2 ATP + 2 NADH + 2 丙酮酸');
  const reading = await dialog.evaluate(element => {
    const stage = element.querySelector('.pathway-visual-dialog-stage');
    const text = [...element.querySelectorAll('svg text')].find(node => node.textContent.includes('PFK-1'));
    stage.scrollLeft = stage.scrollWidth;
    return { labelHeight: Number.parseFloat(getComputedStyle(text).fontSize), canPan: stage.scrollLeft > 0,
      pageOverflow: document.documentElement.scrollWidth - innerWidth };
  });
  expect(reading.labelHeight).toBeGreaterThanOrEqual(16);
  expect(reading.canPan).toBe(true);
  expect(reading.pageOverflow).toBeLessThanOrEqual(1);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.locator('#sceneExpertOverlayLayer .overlay-schematic-glycolysis')).toContainText('PFK-1');
});

async function enterExpertMap(page) {
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await expect(page.locator('#studentWorkspace')).toBeVisible();
  await page.getByRole('button', { name: '专家地图', exact: true }).click();
  await expect(page.locator('body')).toHaveClass(/expert-map/);
}

test('primary expert controls meet the mobile touch target', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);

  const controls = await page.locator([
    '#learnBtn',
    '#topbarCollapseToggle',
    '#zoomIn',
    '#zoomOut',
    '#resetBtn',
    '.path-filter'
  ].join(',')).evaluateAll(elements => elements
    .filter(element => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    })
    .map(element => {
      const rect = element.getBoundingClientRect();
      return {
        name: element.getAttribute('aria-label') || element.textContent.trim(),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      };
    }));

  expect(controls.length).toBeGreaterThan(0);
  expect(controls.filter(control => control.width < 44 || control.height < 44)).toEqual([]);
});

test('TCA mechanism separates the eight-step cycle from its yield and inner-membrane handoff', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);

  await page.locator('.path-filter[data-path="tca"]').click();
  await page.locator('#expertPathPreview').click();
  const schematic = page.locator('#sceneExpertOverlayLayer .overlay-schematic-tca');
  await expect(schematic).toHaveCount(1);
  await expect(schematic.locator('[data-tca-zone="cycle"]')).toHaveCount(1);
  await expect(schematic.locator('[data-tca-zone="yield"]')).toHaveCount(1);
  for (const anchor of [
    'CS', 'ACO2', 'IDH3', 'OGDH', 'SUCL', 'SDH / CII', 'FH', 'MDH2',
    '内膜复合体 II',
    '酶内 FAD → CoQH₂', '3 NADH', '2 CO₂', 'OAA 再生'
  ]) {
    await expect(schematic).toContainText(anchor);
  }
  await expect(schematic).not.toContainText('FADH₂');

  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(250);
    const metrics = await schematic.evaluate(group => {
      const groupRect = group.getBoundingClientRect();
      const labels = [...group.querySelectorAll([
        '.schematic-title', '.schematic-label', '.schematic-node-label', '.schematic-enzyme',
        '.schematic-cofactor', '.schematic-transporter', '.schematic-exchange', '.schematic-output'
      ].join(','))]
        .filter(label => label.textContent.trim())
        .map(label => ({ text: label.textContent.trim(), rect: label.getBoundingClientRect(), fontSize: Number.parseFloat(getComputedStyle(label).fontSize) }));
      const collisions = [];
      for (let left = 0; left < labels.length; left += 1) {
        for (let right = left + 1; right < labels.length; right += 1) {
          const first = labels[left];
          const second = labels[right];
          const width = Math.max(0, Math.min(first.rect.right, second.rect.right)
            - Math.max(first.rect.left, second.rect.left));
          const height = Math.max(0, Math.min(first.rect.bottom, second.rect.bottom)
            - Math.max(first.rect.top, second.rect.top));
          if (width * height > 1) collisions.push(`${first.text} / ${second.text}`);
        }
      }
      return {
        minFontSize: Math.min(...labels.map(label => label.fontSize)),
        clipped: labels.filter(label => label.rect.left < groupRect.left - 1
          || label.rect.right > groupRect.right + 1
          || label.rect.top < groupRect.top - 1
          || label.rect.bottom > groupRect.bottom + 1).map(label => label.text),
        collisions,
        pageOverflow: document.documentElement.scrollWidth - innerWidth
      };
    });
    expect(metrics.minFontSize).toBeGreaterThanOrEqual(10);
    expect(metrics.clipped).toEqual([]);
    expect(metrics.collisions).toEqual([]);
    expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  }
});

test('malate aspartate mechanism separates both half-cycles, two exchangers and the net redox transfer', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);

  await page.locator('.path-filter[data-path="malate_aspartate"]').click();
  await page.locator('#expertPathPreview').click();
  const schematic = page.locator('#sceneExpertOverlayLayer .overlay-schematic-malate_aspartate');
  await expect(schematic).toHaveCount(1);
  for (const zone of ['cytosol', 'transport', 'matrix', 'net']) {
    await expect(schematic.locator(`[data-mas-zone="${zone}"]`)).toHaveCount(1);
  }
  for (const anchor of [
    'MDH1', 'SLC25A11', 'MDH2', 'GOT2', 'SLC25A12/13', 'GOT1',
    '苹果酸入 · α-KG 出', '天冬氨酸出 · 谷氨酸 + H⁺入',
    '还原当量转移', 'NADH 不跨膜', '基质 NADH → 复合体 I'
  ]) {
    await expect(schematic).toContainText(anchor);
  }
  await expect(schematic.locator('.schematic-step-disc')).toHaveCount(6);
  await expect(page.locator('#scopeExchange .scene-reaction-step')).toHaveCount(6);

  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(250);
    const metrics = await schematic.evaluate(group => {
      const groupRect = group.getBoundingClientRect();
      const labels = [...group.querySelectorAll([
        '.schematic-title', '.schematic-label', '.schematic-node-label', '.schematic-enzyme',
        '.schematic-cofactor', '.schematic-transporter', '.schematic-exchange',
        '.schematic-output', '.schematic-note'
      ].join(','))]
        .filter(label => label.textContent.trim())
        .map(label => ({ text: label.textContent.trim(), rect: label.getBoundingClientRect(), fontSize: Number.parseFloat(getComputedStyle(label).fontSize) }));
      const collisions = [];
      for (let left = 0; left < labels.length; left += 1) {
        for (let right = left + 1; right < labels.length; right += 1) {
          const first = labels[left];
          const second = labels[right];
          const width = Math.max(0, Math.min(first.rect.right, second.rect.right) - Math.max(first.rect.left, second.rect.left));
          const height = Math.max(0, Math.min(first.rect.bottom, second.rect.bottom) - Math.max(first.rect.top, second.rect.top));
          if (width * height > 1) collisions.push(`${first.text} / ${second.text}`);
        }
      }
      return {
        minFontSize: Math.min(...labels.map(label => label.fontSize)),
        clipped: labels.filter(label => label.rect.left < groupRect.left - 1
          || label.rect.right > groupRect.right + 1
          || label.rect.top < groupRect.top - 1
          || label.rect.bottom > groupRect.bottom + 1).map(label => label.text),
        collisions,
        pageOverflow: document.documentElement.scrollWidth - innerWidth
      };
    });
    expect(metrics.minFontSize).toBeGreaterThanOrEqual(10);
    expect(metrics.clipped).toEqual([]);
    expect(metrics.collisions).toEqual([]);
    expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  }
});

test('glycerol phosphate mechanism separates cytosolic GPD1, VDAC, intermembrane GPD2 and the CoQ entry', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);

  await page.locator('.path-filter[data-path="glycerol_phosphate"]').click();
  await page.locator('#expertPathPreview').click();
  const schematic = page.locator('#sceneExpertOverlayLayer .overlay-schematic-glycerol_phosphate');
  await expect(schematic).toHaveCount(1);
  for (const zone of ['cytosol', 'outer-membrane', 'intermembrane', 'inner-membrane', 'net']) {
    await expect(schematic.locator(`[data-gp-zone="${zone}"]`)).toHaveCount(1);
  }
  for (const anchor of [
    'GPD1', 'VDAC', 'GPD2', '酶内 FAD → FADH₂', 'CoQ → CoQH₂',
    'NADH 不跨膜', '不生成基质 NADH', '绕过复合体 I', 'CoQH₂ → 复合体 III'
  ]) {
    await expect(schematic).toContainText(anchor);
  }
  await expect(schematic.locator('.schematic-step-disc')).toHaveCount(4);
  await expect(page.locator('#scopeExchange .scene-reaction-step')).toHaveCount(4);

  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(250);
    const metrics = await schematic.evaluate(group => {
      const groupRect = group.getBoundingClientRect();
      const labels = [...group.querySelectorAll([
        '.schematic-title', '.schematic-compartment-title', '.schematic-label', '.schematic-node-label',
        '.schematic-enzyme', '.schematic-cofactor', '.schematic-transporter', '.schematic-exchange',
        '.schematic-output', '.schematic-note'
      ].join(','))]
        .filter(label => label.textContent.trim())
        .map(label => ({ text: label.textContent.trim(), rect: label.getBoundingClientRect(), fontSize: Number.parseFloat(getComputedStyle(label).fontSize) }));
      const collisions = [];
      for (let left = 0; left < labels.length; left += 1) {
        for (let right = left + 1; right < labels.length; right += 1) {
          const first = labels[left];
          const second = labels[right];
          const width = Math.max(0, Math.min(first.rect.right, second.rect.right) - Math.max(first.rect.left, second.rect.left));
          const height = Math.max(0, Math.min(first.rect.bottom, second.rect.bottom) - Math.max(first.rect.top, second.rect.top));
          if (width * height > 1) collisions.push(`${first.text} / ${second.text}`);
        }
      }
      return {
        minFontSize: Math.min(...labels.map(label => label.fontSize)),
        clipped: labels.filter(label => label.rect.left < groupRect.left - 1
          || label.rect.right > groupRect.right + 1
          || label.rect.top < groupRect.top - 1
          || label.rect.bottom > groupRect.bottom + 1).map(label => label.text),
        collisions,
        pageOverflow: document.documentElement.scrollWidth - innerWidth
      };
    });
    expect(metrics.minFontSize).toBeGreaterThanOrEqual(10);
    expect(metrics.clipped).toEqual([]);
    expect(metrics.collisions).toEqual([]);
    expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  }
});

test('glycolysis expert mechanism exposes all ten steps, three irreversible gates and the net yield', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);

  await page.locator('.path-filter[data-path="glycolysis"]').click();
  await page.locator('#expertPathPreview').click();
  const schematic = page.locator('#sceneExpertOverlayLayer .overlay-schematic-glycolysis');
  await expect(schematic).toHaveCount(1);
  for (const zone of ['investment', 'cleavage', 'payoff', 'net']) {
    await expect(schematic.locator(`[data-glycolysis-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(schematic.locator('.schematic-step-disc')).toHaveCount(10);
  await expect(schematic.locator('.schematic-node')).toHaveCount(11);
  for (const anchor of [
    'DHAP', 'GAP ×2', 'PFK-1 · 承诺步骤', '3 个不可逆关卡',
    '投入 2 ATP', '产生 4 ATP + 2 NADH', '净 2 ATP + 2 NADH + 2 丙酮酸'
  ]) {
    await expect(schematic).toContainText(anchor);
  }
  await expect(page.locator('#scopeExchange .scene-reaction-step')).toHaveCount(10);

  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(250);
    const metrics = await schematic.evaluate(group => {
      const groupRect = group.getBoundingClientRect();
      const labels = [...group.querySelectorAll([
        '.schematic-title', '.schematic-compartment-title', '.schematic-label', '.schematic-node-label',
        '.schematic-enzyme', '.schematic-cofactor', '.schematic-output', '.schematic-note'
      ].join(','))]
        .filter(label => label.textContent.trim())
        .map(label => ({ text: label.textContent.trim(), rect: label.getBoundingClientRect(), fontSize: Number.parseFloat(getComputedStyle(label).fontSize) }));
      return {
        minFontSize: Math.min(...labels.map(label => label.fontSize)),
        clipped: labels.filter(label => label.rect.left < groupRect.left - 1
          || label.rect.right > groupRect.right + 1
          || label.rect.top < groupRect.top - 1
          || label.rect.bottom > groupRect.bottom + 1).map(label => label.text),
        pageOverflow: document.documentElement.scrollWidth - innerWidth
      };
    });
    expect(metrics.minFontSize).toBeGreaterThanOrEqual(10);
    expect(metrics.clipped).toEqual([]);
    expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  }
});

test('gluconeogenesis expert mechanism separates the three bypasses across matrix cytosol and ER', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);

  await page.locator('.path-filter[data-path="gluconeogenesis"]').click();
  await page.locator('#expertPathPreview').click();
  const schematic = page.locator('#sceneExpertOverlayLayer .overlay-schematic-gluconeogenesis');
  await expect(schematic).toHaveCount(1);
  for (const zone of ['matrix', 'shuttle', 'cytosol', 'er', 'ledger']) {
    await expect(schematic.locator(`[data-gluconeogenesis-zone="${zone}"]`)).toHaveCount(1);
  }
  for (const bypass of ['pk', 'pfk1', 'hk-gk']) {
    await expect(schematic.locator(`[data-gluconeogenesis-bypass="${bypass}"]`)).toHaveCount(1);
  }
  expect(await schematic.locator('.schematic-node').count()).toBeGreaterThanOrEqual(14);
  for (const anchor of [
    'OAA 不能直接跨内膜', '代表性苹果酸路线', '实际出口依前体 / 组织而变',
    'PC + 穿梭 + PEPCK', 'G6P 转运入 ER', '4 ATP', '2 GTP', '2 NADH', '6 个高能磷酸键'
  ]) {
    await expect(schematic).toContainText(anchor);
  }
  await expect(page.locator('#scopeExchange .scene-reaction-step')).toHaveCount(22);

  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(250);
    const metrics = await schematic.evaluate(group => {
      const groupRect = group.getBoundingClientRect();
      const labels = [...group.querySelectorAll([
        '.schematic-title', '.schematic-compartment-title', '.schematic-label', '.schematic-node-label',
        '.schematic-enzyme', '.schematic-cofactor', '.schematic-output', '.schematic-note', '.schematic-transporter'
      ].join(','))]
        .filter(label => label.textContent.trim())
        .map(label => ({ text: label.textContent.trim(), rect: label.getBoundingClientRect(), fontSize: Number.parseFloat(getComputedStyle(label).fontSize) }));
      return {
        minFontSize: Math.min(...labels.map(label => label.fontSize)),
        clipped: labels.filter(label => label.rect.left < groupRect.left - 1
          || label.rect.right > groupRect.right + 1
          || label.rect.top < groupRect.top - 1
          || label.rect.bottom > groupRect.bottom + 1).map(label => label.text),
        pageOverflow: document.documentElement.scrollWidth - innerWidth
      };
    });
    expect(metrics.minFontSize).toBeGreaterThanOrEqual(10);
    expect(metrics.clipped).toEqual([]);
    expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  }
});

test('glycogenesis expert mechanism separates activation, glycogenin priming, elongation and branching', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);

  await page.locator('.path-filter[data-path="glycogenesis"]').click();
  await page.locator('#expertPathPreview').click();
  const schematic = page.locator('#sceneExpertOverlayLayer .overlay-schematic-glycogenesis');
  await expect(schematic).toHaveCount(1);
  for (const zone of ['activation', 'primer', 'elongation', 'branching', 'energy']) {
    await expect(schematic.locator(`[data-glycogenesis-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(schematic.locator('.schematic-step-disc')).toHaveCount(6);
  expect(await schematic.locator('.schematic-node').count()).toBeGreaterThanOrEqual(10);
  for (const anchor of [
    'UTP → UDP-葡萄糖 + PPi', 'PPi 水解驱动', '糖原合酶不能从零起始',
    'α-1,4 延长', 'α-1,6 分支', '多个非还原端',
    '1 ATP + 1 UTP', '从 G6P 起算只需 1 UTP'
  ]) {
    await expect(schematic).toContainText(anchor);
  }
  await expect(page.locator('#scopeExchange .scene-reaction-step')).toHaveCount(4);

  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(250);
    const metrics = await schematic.evaluate(group => {
      const groupRect = group.getBoundingClientRect();
      const labels = [...group.querySelectorAll([
        '.schematic-title', '.schematic-compartment-title', '.schematic-label', '.schematic-node-label',
        '.schematic-enzyme', '.schematic-cofactor', '.schematic-output', '.schematic-note'
      ].join(','))]
        .filter(label => label.textContent.trim())
        .map(label => ({ text: label.textContent.trim(), rect: label.getBoundingClientRect(), fontSize: Number.parseFloat(getComputedStyle(label).fontSize) }));
      return {
        minFontSize: Math.min(...labels.map(label => label.fontSize)),
        clipped: labels.filter(label => label.rect.left < groupRect.left - 1
          || label.rect.right > groupRect.right + 1
          || label.rect.top < groupRect.top - 1
          || label.rect.bottom > groupRect.bottom + 1).map(label => label.text),
        pageOverflow: document.documentElement.scrollWidth - innerWidth
      };
    });
    expect(metrics.minFontSize).toBeGreaterThanOrEqual(10);
    expect(metrics.clipped).toEqual([]);
    expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  }
});

test('glycogenolysis expert mechanism separates the limit dextrin, two debranching activities and tissue fates', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);
  await page.locator('.path-filter[data-path="glycogenolysis"]').click();
  await page.locator('#expertPathPreview').click();
  const schematic = page.locator('#sceneExpertOverlayLayer .overlay-schematic-glycogenolysis');
  await expect(schematic).toHaveCount(1);
  for (const zone of ['chain', 'debranching', 'conversion', 'muscle', 'liver-er']) {
    await expect(schematic.locator(`[data-glycogenolysis-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(schematic.locator('.schematic-step-disc')).toHaveCount(7);
  expect(await schematic.locator('.schematic-node').count()).toBeGreaterThanOrEqual(12);
  for (const anchor of [
    '停在分支前 4 个残基', '转移 3 个残基', '水解 α-1,6', '释放 1 个游离葡萄糖',
    '肌肉缺少 G6Pase', 'G6P 转运入 ER', '腔面 G6Pase', '绕过己糖激酶，节省 1 ATP'
  ]) {
    await expect(schematic).toContainText(anchor);
  }
  await expect(page.locator('#scopeExchange .scene-reaction-step')).toHaveCount(6);

  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(250);
    const metrics = await schematic.evaluate(group => {
      const groupRect = group.getBoundingClientRect();
      const labels = [...group.querySelectorAll('.schematic-title,.schematic-compartment-title,.schematic-label,.schematic-node-label,.schematic-enzyme,.schematic-cofactor,.schematic-output,.schematic-note')]
        .filter(label => label.textContent.trim())
        .map(label => ({ text: label.textContent.trim(), rect: label.getBoundingClientRect(), fontSize: Number.parseFloat(getComputedStyle(label).fontSize) }));
      const collisions = [];
      for (let left = 0; left < labels.length; left += 1) {
        for (let right = left + 1; right < labels.length; right += 1) {
          const first = labels[left];
          const second = labels[right];
          const width = Math.max(0, Math.min(first.rect.right, second.rect.right) - Math.max(first.rect.left, second.rect.left));
          const height = Math.max(0, Math.min(first.rect.bottom, second.rect.bottom) - Math.max(first.rect.top, second.rect.top));
          if (width * height > 1) collisions.push(`${first.text} / ${second.text}`);
        }
      }
      return {
        minFontSize: Math.min(...labels.map(label => label.fontSize)),
        clipped: labels.filter(label => label.rect.left < groupRect.left - 1 || label.rect.right > groupRect.right + 1
          || label.rect.top < groupRect.top - 1 || label.rect.bottom > groupRect.bottom + 1).map(label => label.text),
        collisions,
        pageOverflow: document.documentElement.scrollWidth - innerWidth
      };
    });
    expect(metrics.minFontSize).toBeGreaterThanOrEqual(10);
    expect(metrics.clipped).toEqual([]);
    expect(metrics.collisions).toEqual([]);
    expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  }
});

test('PPP expert mechanism separates oxidative yield, carbon balance and cellular demand modes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);
  await page.locator('.path-filter[data-path="ppp"]').click();
  await page.locator('#expertPathPreview').click();
  const schematic = page.locator('#sceneExpertOverlayLayer .overlay-schematic-ppp');
  await expect(schematic).toHaveCount(1);
  for (const zone of ['oxidative', 'pentose-hub', 'rearrangement', 'demand-modes']) {
    await expect(schematic.locator(`[data-ppp-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(schematic.locator('.schematic-step-disc')).toHaveCount(8);
  expect(await schematic.locator('.schematic-node').count()).toBeGreaterThanOrEqual(12);
  for (const anchor of [
    '第 1 个 NADPH', '第 2 个 NADPH + CO₂', '净：2 NADPH + CO₂', 'PPP 不直接产生 ATP',
    '转酮酶 1 · TPP · 转移 2C', '转醛酶 · 转移 3C', '转酮酶 2 · TPP · 转移 2C',
    '3×5C ⇌ 2×6C + 1×3C', 'R5P 优先', 'NADPH 优先', '同时需要 NADPH 与 R5P'
  ]) {
    await expect(schematic).toContainText(anchor);
  }
  await expect(page.locator('#scopeExchange .scene-reaction-step')).toHaveCount(8);

  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(250);
    const metrics = await schematic.evaluate(group => {
      const groupRect = group.getBoundingClientRect();
      const labels = [...group.querySelectorAll('.schematic-title,.schematic-compartment-title,.schematic-label,.schematic-node-label,.schematic-enzyme,.schematic-cofactor,.schematic-output,.schematic-note')]
        .filter(label => label.textContent.trim())
        .map(label => ({ text: label.textContent.trim(), rect: label.getBoundingClientRect(), fontSize: Number.parseFloat(getComputedStyle(label).fontSize) }));
      const collisions = [];
      for (let left = 0; left < labels.length; left += 1) {
        for (let right = left + 1; right < labels.length; right += 1) {
          const first = labels[left];
          const second = labels[right];
          const width = Math.max(0, Math.min(first.rect.right, second.rect.right) - Math.max(first.rect.left, second.rect.left));
          const height = Math.max(0, Math.min(first.rect.bottom, second.rect.bottom) - Math.max(first.rect.top, second.rect.top));
          if (width * height > 1) collisions.push(`${first.text} / ${second.text}`);
        }
      }
      return {
        minFontSize: Math.min(...labels.map(label => label.fontSize)),
        clipped: labels.filter(label => label.rect.left < groupRect.left - 1 || label.rect.right > groupRect.right + 1
          || label.rect.top < groupRect.top - 1 || label.rect.bottom > groupRect.bottom + 1).map(label => label.text),
        collisions,
        pageOverflow: document.documentElement.scrollWidth - innerWidth
      };
    });
    expect(metrics.minFontSize).toBeGreaterThanOrEqual(10);
    expect(metrics.clipped).toEqual([]);
    expect(metrics.collisions).toEqual([]);
    expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  }
});

test('fatty acid synthesis expert mechanism separates citrate export, ACC commitment, the FAS cycle and downstream control', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);
  await page.locator('.path-filter[data-path="fa_synthesis"]').click();
  await page.locator('#expertPathPreview').click();
  const schematic = page.locator('#sceneExpertOverlayLayer .overlay-schematic-fa_synthesis');
  await expect(schematic).toHaveCount(1);
  for (const zone of ['carbon-export', 'commitment', 'fas-cycle', 'ledger-downstream']) {
    await expect(schematic.locator(`[data-fa-synthesis-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(schematic.locator('.schematic-step-disc')).toHaveCount(7);
  expect(await schematic.locator('.schematic-node').count()).toBeGreaterThanOrEqual(12);
  for (const anchor of [
    '乙酰-CoA不能直接跨内膜', 'SLC25A1', 'ACLY · 1 ATP',
    'ACC · HCO₃⁻ + 1 ATP · 生物素', '承诺 / 主要调控步骤',
    '缩合', '还原 1', '脱水', '还原 2', 'ACP 携带中间体',
    '每轮 +2C · 2 NADPH', '×7 → 棕榈酸 C16:0', '14 NADPH',
    'PPP / 苹果酸酶', 'malonyl-CoA ┤ CPT1', 'ER · ELOVL / SCD',
    '1 acetyl + 7 malonyl + 14 NADPH', '8 acetyl + 7 ATP + 14 NADPH'
  ]) {
    await expect(schematic).toContainText(anchor);
  }
  await expect(page.locator('#scopeExchange .scene-reaction-step')).toHaveCount(4);

  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(250);
    const metrics = await schematic.evaluate(group => {
      const groupRect = group.getBoundingClientRect();
      const labels = [...group.querySelectorAll('.schematic-title,.schematic-compartment-title,.schematic-label,.schematic-node-label,.schematic-enzyme,.schematic-cofactor,.schematic-transporter,.schematic-output,.schematic-note')]
        .filter(label => label.textContent.trim())
        .map(label => ({ text: label.textContent.trim(), rect: label.getBoundingClientRect(), fontSize: Number.parseFloat(getComputedStyle(label).fontSize) }));
      const collisions = [];
      for (let left = 0; left < labels.length; left += 1) {
        for (let right = left + 1; right < labels.length; right += 1) {
          const first = labels[left];
          const second = labels[right];
          const width = Math.max(0, Math.min(first.rect.right, second.rect.right) - Math.max(first.rect.left, second.rect.left));
          const height = Math.max(0, Math.min(first.rect.bottom, second.rect.bottom) - Math.max(first.rect.top, second.rect.top));
          if (width * height > 1) collisions.push(`${first.text} / ${second.text}`);
        }
      }
      return {
        minFontSize: Math.min(...labels.map(label => label.fontSize)),
        clipped: labels.filter(label => label.rect.left < groupRect.left - 1 || label.rect.right > groupRect.right + 1
          || label.rect.top < groupRect.top - 1 || label.rect.bottom > groupRect.bottom + 1).map(label => label.text),
        collisions,
        pageOverflow: document.documentElement.scrollWidth - innerWidth
      };
    });
    expect(metrics.minFontSize, JSON.stringify(metrics)).toBeGreaterThanOrEqual(10);
    expect(metrics.clipped).toEqual([]);
    expect(metrics.collisions).toEqual([]);
    expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  }
});

test('carnitine shuttle expert mechanism separates both membranes, CACT antiport and the two CoA pools', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);
  await page.locator('.path-filter[data-path="carnitine"]').click();
  await page.locator('#expertPathPreview').click();
  const schematic = page.locator('#sceneExpertOverlayLayer .overlay-schematic-carnitine');
  await expect(schematic).toHaveCount(1);
  for (const zone of ['cytosol-gate', 'outer-membrane', 'inner-membrane-exchange', 'matrix-handoff', 'net']) {
    await expect(schematic.locator(`[data-carnitine-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(schematic.locator('.schematic-step-disc')).toHaveCount(4);
  expect(await schematic.locator('.schematic-node').count()).toBeGreaterThanOrEqual(14);
  for (const anchor of [
    '长链脂酰-CoA不跨内膜', 'CPT1 · 外膜胞质侧', 'malonyl-CoA ┤ CPT1',
    'VDAC · 外膜通道', 'CACT / SLC25A20', '脂酰肉碱入基质', '游离肉碱向外',
    'CPT2 · 内膜基质侧', '胞质 CoA 池', '基质 CoA 池', 'CoA 不跨内膜',
    '游离肉碱循环再用', '穿梭本身不额外耗 ATP', 'ACSL 激活：ATP → AMP + PPi', '→ β-氧化'
  ]) {
    await expect(schematic).toContainText(anchor);
  }
  await expect(page.locator('#scopeExchange .scene-reaction-step')).toHaveCount(6);

  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(250);
    const metrics = await schematic.evaluate(group => {
      const groupRect = group.getBoundingClientRect();
      const labels = [...group.querySelectorAll('.schematic-title,.schematic-compartment-title,.schematic-label,.schematic-node-label,.schematic-enzyme,.schematic-cofactor,.schematic-transporter,.schematic-output,.schematic-note')]
        .filter(label => label.textContent.trim())
        .map(label => ({ text: label.textContent.trim(), rect: label.getBoundingClientRect(), fontSize: Number.parseFloat(getComputedStyle(label).fontSize) }));
      const collisions = [];
      for (let left = 0; left < labels.length; left += 1) {
        for (let right = left + 1; right < labels.length; right += 1) {
          const first = labels[left];
          const second = labels[right];
          const width = Math.max(0, Math.min(first.rect.right, second.rect.right) - Math.max(first.rect.left, second.rect.left));
          const height = Math.max(0, Math.min(first.rect.bottom, second.rect.bottom) - Math.max(first.rect.top, second.rect.top));
          if (width * height > 1) collisions.push(`${first.text} / ${second.text}`);
        }
      }
      return {
        minFontSize: Math.min(...labels.map(label => label.fontSize)),
        clipped: labels.filter(label => label.rect.left < groupRect.left - 1 || label.rect.right > groupRect.right + 1
          || label.rect.top < groupRect.top - 1 || label.rect.bottom > groupRect.bottom + 1).map(label => label.text),
        collisions,
        pageOverflow: document.documentElement.scrollWidth - innerWidth
      };
    });
    expect(metrics.minFontSize, JSON.stringify(metrics)).toBeGreaterThanOrEqual(10);
    expect(metrics.clipped).toEqual([]);
    expect(metrics.collisions).toEqual([]);
    expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  }
});

test('beta oxidation expert mechanism separates the four-step spiral, ETF electron route and the C16 ledger', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);
  await page.locator('.path-filter[data-path="beta_oxidation"]').click();
  await page.locator('#expertPathPreview').click();
  const schematic = page.locator('#sceneExpertOverlayLayer .overlay-schematic-beta_oxidation');
  await expect(schematic).toHaveCount(1);
  for (const zone of ['entry-boundary', 'four-step-cycle', 'spiral-ledger', 'pathway-outputs']) {
    await expect(schematic.locator(`[data-beta-oxidation-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(schematic.locator('.schematic-step-disc')).toHaveCount(4);
  expect(await schematic.locator('.schematic-node').count()).toBeGreaterThanOrEqual(14);
  for (const anchor of [
    '基质脂酰-CoA', 'trans-Δ²-烯酰-CoA', 'L-β-羟脂酰-CoA', 'β-酮脂酰-CoA',
    '酶内 FAD → ETF → ETF:QO → CoQ', 'NAD⁺ → NADH + H⁺', 'CoA-SH',
    '缩短 2C，返回下一轮', '末轮 C4 → 2 乙酰-CoA',
    '7 轮 → 8 乙酰-CoA + 7 NADH + 7 对电子进入 CoQ',
    'β-氧化本身不直接产生 ATP', '→ TCA', '→ 呼吸链', '饱和偶数链主线'
  ]) {
    await expect(schematic).toContainText(anchor);
  }
  await expect(page.locator('#scopeExchange .scene-reaction-step')).toHaveCount(4);

  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(250);
    const metrics = await schematic.evaluate(group => {
      const groupRect = group.getBoundingClientRect();
      const labels = [...group.querySelectorAll('.schematic-title,.schematic-compartment-title,.schematic-label,.schematic-node-label,.schematic-enzyme,.schematic-cofactor,.schematic-output,.schematic-note')]
        .filter(label => label.textContent.trim())
        .map(label => ({ text: label.textContent.trim(), rect: label.getBoundingClientRect(), fontSize: Number.parseFloat(getComputedStyle(label).fontSize) }));
      const collisions = [];
      for (let left = 0; left < labels.length; left += 1) {
        for (let right = left + 1; right < labels.length; right += 1) {
          const first = labels[left];
          const second = labels[right];
          const width = Math.max(0, Math.min(first.rect.right, second.rect.right) - Math.max(first.rect.left, second.rect.left));
          const height = Math.max(0, Math.min(first.rect.bottom, second.rect.bottom) - Math.max(first.rect.top, second.rect.top));
          if (width * height > 1) collisions.push(`${first.text} / ${second.text}`);
        }
      }
      return {
        minFontSize: Math.min(...labels.map(label => label.fontSize)),
        clipped: labels.filter(label => label.rect.left < groupRect.left - 1 || label.rect.right > groupRect.right + 1
          || label.rect.top < groupRect.top - 1 || label.rect.bottom > groupRect.bottom + 1).map(label => label.text),
        collisions,
        pageOverflow: document.documentElement.scrollWidth - innerWidth
      };
    });
    expect(metrics.minFontSize, JSON.stringify(metrics)).toBeGreaterThanOrEqual(10);
    expect(metrics.clipped).toEqual([]);
    expect(metrics.collisions).toEqual([]);
    expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  }
});

test('ketone expert mechanism separates liver production, circulation and extrahepatic SCOT use', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);
  await page.locator('.path-filter[data-path="ketone"]').click();
  await page.locator('#expertPathPreview').click();
  const schematic = page.locator('#sceneExpertOverlayLayer .overlay-schematic-ketone');
  await expect(schematic).toHaveCount(1);
  for (const zone of ['hepatic-ketogenesis', 'circulation-redox', 'extrahepatic-ketolysis', 'tissue-boundary']) {
    await expect(schematic.locator(`[data-ketone-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(schematic.locator('.schematic-step-disc')).toHaveCount(7);
  expect(await schematic.locator('.schematic-node').count()).toBeGreaterThanOrEqual(16);
  for (const anchor of [
    '肝线粒体 · 生成', 'HMGCS2', 'HMGCL', '净耗 2 乙酰-CoA',
    'BDH1 · NADH + H⁺ → NAD⁺', '丙酮 · 少量旁支', 'MCT · 血液运输',
    '外周线粒体 · 利用', 'BDH1 · NAD⁺ → NADH + H⁺', 'SCOT / OXCT1',
    '琥珀酰-CoA → 琥珀酸', 'SCOT 不直接耗 ATP', '2 乙酰-CoA → TCA',
    '肝缺少 SCOT', '红细胞无线粒体，不能利用', '心 / 肌 / 肾 / 脑可利用'
  ]) {
    await expect(schematic).toContainText(anchor);
  }
  await expect(page.locator('#scopeExchange .scene-reaction-step')).toHaveCount(7);

  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(250);
    const metrics = await schematic.evaluate(group => {
      const groupRect = group.getBoundingClientRect();
      const labels = [...group.querySelectorAll('.schematic-title,.schematic-compartment-title,.schematic-label,.schematic-node-label,.schematic-enzyme,.schematic-cofactor,.schematic-transporter,.schematic-output,.schematic-note')]
        .filter(label => label.textContent.trim())
        .map(label => ({ text: label.textContent.trim(), rect: label.getBoundingClientRect(), fontSize: Number.parseFloat(getComputedStyle(label).fontSize) }));
      const collisions = [];
      for (let left = 0; left < labels.length; left += 1) {
        for (let right = left + 1; right < labels.length; right += 1) {
          const first = labels[left];
          const second = labels[right];
          const width = Math.max(0, Math.min(first.rect.right, second.rect.right) - Math.max(first.rect.left, second.rect.left));
          const height = Math.max(0, Math.min(first.rect.bottom, second.rect.bottom) - Math.max(first.rect.top, second.rect.top));
          if (width * height > 1) collisions.push(`${first.text} / ${second.text}`);
        }
      }
      return {
        minFontSize: Math.min(...labels.map(label => label.fontSize)),
        clipped: labels.filter(label => label.rect.left < groupRect.left - 1 || label.rect.right > groupRect.right + 1
          || label.rect.top < groupRect.top - 1 || label.rect.bottom > groupRect.bottom + 1).map(label => label.text),
        collisions,
        pageOverflow: document.documentElement.scrollWidth - innerWidth
      };
    });
    expect(metrics.minFontSize, JSON.stringify(metrics)).toBeGreaterThanOrEqual(10);
    expect(metrics.clipped).toEqual([]);
    expect(metrics.collisions).toEqual([]);
    expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  }
});

test('transamination expert mechanism separates PLP transfer, glutamate transport, GDH and urea handoff', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);
  await page.locator('.path-filter[data-path="transamination"]').click();
  await page.locator('#expertPathPreview').click();
  const schematic = page.locator('#sceneExpertOverlayLayer .overlay-schematic-transamination');
  await expect(schematic).toHaveCount(1);
  for (const zone of ['amino-transfer', 'inner-membrane-entry', 'matrix-deamination', 'urea-handoff']) {
    await expect(schematic.locator(`[data-transamination-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(schematic.locator('.schematic-step-disc')).toHaveCount(4);
  expect(await schematic.locator('.schematic-node').count()).toBeGreaterThanOrEqual(16);
  for (const anchor of [
    'ALT / GPT', '丙氨酸氨基转移酶', 'AST / GOT', '天冬氨酸氨基转移酶',
    'PLP · 酶结合辅酶', '转氨不释放游离 NH₄⁺',
    'GC1 / GC2', 'SLC25A22 / SLC25A18', '谷氨酸 + H⁺入基质',
    'GDH / GLUD', '谷氨酸脱氢酶', 'NAD(P)⁺ + H₂O → NAD(P)H + H⁺',
    'GTP 抑制', 'ADP / 亮氨酸激活',
    'NH₄⁺ → CPS1 · 尿素第 1 份氮', '天冬氨酸 · 尿素第 2 份氮',
    'α-KG → TCA / 转氨受体池'
  ]) {
    await expect(schematic).toContainText(anchor);
  }
  await expect(page.locator('#scopeExchange .scene-reaction-step')).toHaveCount(4);

  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(250);
    const metrics = await schematic.evaluate(group => {
      const groupRect = group.getBoundingClientRect();
      const labels = [...group.querySelectorAll('.schematic-title,.schematic-compartment-title,.schematic-label,.schematic-node-label,.schematic-enzyme,.schematic-cofactor,.schematic-transporter,.schematic-output,.schematic-note')]
        .filter(label => label.textContent.trim())
        .map(label => ({ text: label.textContent.trim(), rect: label.getBoundingClientRect(), fontSize: Number.parseFloat(getComputedStyle(label).fontSize) }));
      const collisions = [];
      for (let left = 0; left < labels.length; left += 1) {
        for (let right = left + 1; right < labels.length; right += 1) {
          const first = labels[left];
          const second = labels[right];
          const width = Math.max(0, Math.min(first.rect.right, second.rect.right) - Math.max(first.rect.left, second.rect.left));
          const height = Math.max(0, Math.min(first.rect.bottom, second.rect.bottom) - Math.max(first.rect.top, second.rect.top));
          if (width * height > 1) collisions.push(`${first.text} / ${second.text}`);
        }
      }
      return {
        minFontSize: Math.min(...labels.map(label => label.fontSize)),
        clipped: labels.filter(label => label.rect.left < groupRect.left - 1 || label.rect.right > groupRect.right + 1
          || label.rect.top < groupRect.top - 1 || label.rect.bottom > groupRect.bottom + 1).map(label => label.text),
        collisions,
        pageOverflow: document.documentElement.scrollWidth - innerWidth
      };
    });
    expect(metrics.minFontSize, JSON.stringify(metrics)).toBeGreaterThanOrEqual(10);
    expect(metrics.clipped).toEqual([]);
    expect(metrics.collisions).toEqual([]);
    expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  }
});

test('urea expert mechanism separates five reactions, two carriers, atom origins and the four-bond energy ledger', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);
  await page.locator('.path-filter[data-path="urea"]').click();
  await page.locator('#expertPathPreview').click();
  const schematic = page.locator('#sceneExpertOverlayLayer .overlay-schematic-urea');
  await expect(schematic).toHaveCount(1);
  for (const zone of ['matrix-entry', 'inner-membrane-exchange', 'cytosolic-cycle', 'atom-energy-ledger']) {
    await expect(schematic.locator(`[data-urea-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(schematic.locator('.schematic-step-disc')).toHaveCount(5);
  expect(await schematic.locator('.schematic-node').count()).toBeGreaterThanOrEqual(20);
  for (const anchor of [
    'NAGS / NAG', 'CPS1', 'NH₄⁺ + HCO₃⁻ + 2 ATP', 'NAG 必需变构激活',
    'OTC', '鸟氨酸 + 氨甲酰磷酸 → 瓜氨酸',
    'ORNT1 / SLC25A15', '鸟氨酸入 / 瓜氨酸出',
    'citrin / SLC25A13', '天冬氨酸出 / 谷氨酸 + H⁺入',
    'ASS1 · ATP → AMP + PPi', 'ASL · 精氨酸 + 延胡索酸',
    'ARG1 · H₂O → 尿素 + 鸟氨酸',
    '第 1 份氮 · NH₄⁺', '第 2 份氮 · 天冬氨酸', '羰基碳 · HCO₃⁻',
    '3 ATP / 4 个高能磷酸键', '天冬氨酸—精氨代琥珀酸旁路'
  ]) {
    await expect(schematic).toContainText(anchor);
  }
  await expect(page.locator('#scopeExchange .scene-reaction-step')).toHaveCount(11);

  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(250);
    const metrics = await schematic.evaluate(group => {
      const groupRect = group.getBoundingClientRect();
      const labels = [...group.querySelectorAll('.schematic-title,.schematic-compartment-title,.schematic-label,.schematic-node-label,.schematic-enzyme,.schematic-cofactor,.schematic-transporter,.schematic-output,.schematic-note')]
        .filter(label => label.textContent.trim())
        .map(label => ({ text: label.textContent.trim(), rect: label.getBoundingClientRect(), fontSize: Number.parseFloat(getComputedStyle(label).fontSize) }));
      const collisions = [];
      for (let left = 0; left < labels.length; left += 1) {
        for (let right = left + 1; right < labels.length; right += 1) {
          const first = labels[left];
          const second = labels[right];
          const width = Math.max(0, Math.min(first.rect.right, second.rect.right) - Math.max(first.rect.left, second.rect.left));
          const height = Math.max(0, Math.min(first.rect.bottom, second.rect.bottom) - Math.max(first.rect.top, second.rect.top));
          if (width * height > 1) collisions.push(`${first.text} / ${second.text}`);
        }
      }
      return {
        minFontSize: Math.min(...labels.map(label => label.fontSize)),
        clipped: labels.filter(label => label.rect.left < groupRect.left - 1 || label.rect.right > groupRect.right + 1
          || label.rect.top < groupRect.top - 1 || label.rect.bottom > groupRect.bottom + 1).map(label => label.text),
        collisions,
        pageOverflow: document.documentElement.scrollWidth - innerWidth
      };
    });
    expect(metrics.minFontSize, JSON.stringify(metrics)).toBeGreaterThanOrEqual(10);
    expect(metrics.clipped).toEqual([]);
    expect(metrics.collisions).toEqual([]);
    expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  }
});

test('amino acid carbon expert mechanism resolves seven gateways without inventing a universal transporter', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);
  await page.locator('.path-filter[data-path="aa_carbon"]').click();
  await page.locator('#expertPathPreview').click();
  const schematic = page.locator('#sceneExpertOverlayLayer .overlay-schematic-aa_carbon');
  await expect(schematic).toHaveCount(1);
  for (const zone of ['nitrogen-handoff', 'seven-gateways', 'metabolic-fates', 'classification-ledger']) {
    await expect(schematic.locator(`[data-aa-carbon-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(schematic.locator('.schematic-step-disc')).toHaveCount(7);
  expect(await schematic.locator('.schematic-node').count()).toBeGreaterThanOrEqual(20);
  for (const anchor of [
    '转氨 / 脱氨', '多条分解路径 · 非统一载体', '区室依具体路径而异',
    '丙酮酸', '乙酰-CoA', '乙酰乙酸 / 乙酰乙酰-CoA', 'α-酮戊二酸', '琥珀酰-CoA', '延胡索酸', '草酰乙酸',
    'Ala · Cys · Gly · Ser · Thr · Trp', 'Arg · Glu · Gln · His · Pro',
    'Ile · Met · Thr · Val', 'Phe · Tyr', 'Asp · Asn',
    '生糖 · 可形成糖异生前体', '生酮 · 乙酰-CoA不能净生糖',
    '纯生酮 · Leu / Lys', '兼具两类 · Ile / Phe / Thr / Trp / Tyr',
    '教学分类映射 · 不表示单一反应或统一计量'
  ]) {
    await expect(schematic).toContainText(anchor);
  }
  await expect(schematic).not.toContainText('碳骨架跨区室接口');
  await expect(page.locator('#scopeExchange .scene-reaction-step')).toHaveCount(7);

  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(250);
    const metrics = await schematic.evaluate(group => {
      const groupRect = group.getBoundingClientRect();
      const labels = [...group.querySelectorAll('.schematic-title,.schematic-compartment-title,.schematic-label,.schematic-node-label,.schematic-enzyme,.schematic-cofactor,.schematic-transporter,.schematic-output,.schematic-note')]
        .filter(label => label.textContent.trim())
        .map(label => ({ text: label.textContent.trim(), rect: label.getBoundingClientRect(), fontSize: Number.parseFloat(getComputedStyle(label).fontSize) }));
      const collisions = [];
      for (let left = 0; left < labels.length; left += 1) {
        for (let right = left + 1; right < labels.length; right += 1) {
          const first = labels[left];
          const second = labels[right];
          const width = Math.max(0, Math.min(first.rect.right, second.rect.right) - Math.max(first.rect.left, second.rect.left));
          const height = Math.max(0, Math.min(first.rect.bottom, second.rect.bottom) - Math.max(first.rect.top, second.rect.top));
          if (width * height > 1) collisions.push(`${first.text} / ${second.text}`);
        }
      }
      return {
        minFontSize: Math.min(...labels.map(label => label.fontSize)),
        clipped: labels.filter(label => label.rect.left < groupRect.left - 1 || label.rect.right > groupRect.right + 1
          || label.rect.top < groupRect.top - 1 || label.rect.bottom > groupRect.bottom + 1).map(label => label.text),
        collisions,
        pageOverflow: document.documentElement.scrollWidth - innerWidth
      };
    });
    expect(metrics.minFontSize, JSON.stringify(metrics)).toBeGreaterThanOrEqual(10);
    expect(metrics.clipped).toEqual([]);
    expect(metrics.collisions).toEqual([]);
    expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  }
});

test('purine expert mechanism exposes the ten-step IMP assembly, atom ledger and reciprocal branch energy', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);
  await page.locator('.path-filter[data-path="purine"]').click();
  await page.locator('#expertPathPreview').click();
  const schematic = page.locator('#sceneExpertOverlayLayer .overlay-schematic-purine');
  await expect(schematic).toHaveCount(1);
  for (const zone of ['prpp-entry', 'imp-assembly', 'amp-gmp-branch', 'atom-energy-regulation']) {
    await expect(schematic.locator(`[data-purine-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(schematic.locator('.schematic-step-disc')).toHaveCount(10);
  expect(await schematic.locator('.schematic-node').count()).toBeGreaterThanOrEqual(25);
  for (const anchor of [
    'R5P', 'PRPP synthetase · ATP → AMP', 'PRPP', 'PPAT · 第一承诺步骤', '5-PRA',
    'GAR', 'FGAR', 'FGAM', 'AIR', 'CAIR', 'SAICAR', 'AICAR', 'FAICAR', 'IMP',
    'GART · GAR-S', 'GART · GAR-T', 'PFAS · FGAM-S', 'GART · AIR-S',
    'PAICS · AIR-C', 'PAICS · SAICAR-S', 'ADSL', 'ATIC · AICAR-T', 'ATIC · IMP-C',
    'ADSS · Asp + GTP', 'ADSL · AMP + fumarate',
    'IMPDH · NAD⁺ → NADH', 'XMP', 'GMPS · Gln + ATP → AMP + PPi',
    'N3/N9 · Gln', 'C4/C5/N7 · Gly', 'C2/C8 · 10-formyl-THF', 'C6 · CO₂', 'N1 · Asp',
    'R5P→IMP · 5 ATP分子', 'AMP用GTP · GMP用ATP',
    'AMP⊣ADSS · GMP⊣IMPDH', 'APRT / HGPRT · salvage uses PRPP',
    'salvage不属于十步从头主干'
  ]) {
    await expect(schematic).toContainText(anchor);
  }
  await expect(page.locator('#scopeExchange .scene-reaction-step')).toHaveCount(9);

  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(250);
    const metrics = await schematic.evaluate(group => {
      const groupRect = group.getBoundingClientRect();
      const labels = [...group.querySelectorAll('.schematic-title,.schematic-compartment-title,.schematic-label,.schematic-node-label,.schematic-enzyme,.schematic-cofactor,.schematic-transporter,.schematic-output,.schematic-note')]
        .filter(label => label.textContent.trim())
        .map(label => ({ text: label.textContent.trim(), rect: label.getBoundingClientRect(), fontSize: Number.parseFloat(getComputedStyle(label).fontSize) }));
      const collisions = [];
      for (let left = 0; left < labels.length; left += 1) {
        for (let right = left + 1; right < labels.length; right += 1) {
          const first = labels[left];
          const second = labels[right];
          const width = Math.max(0, Math.min(first.rect.right, second.rect.right) - Math.max(first.rect.left, second.rect.left));
          const height = Math.max(0, Math.min(first.rect.bottom, second.rect.bottom) - Math.max(first.rect.top, second.rect.top));
          if (width * height > 1) collisions.push(`${first.text} / ${second.text}`);
        }
      }
      return {
        minFontSize: Math.min(...labels.map(label => label.fontSize)),
        clipped: labels.filter(label => label.rect.left < groupRect.left - 1 || label.rect.right > groupRect.right + 1
          || label.rect.top < groupRect.top - 1 || label.rect.bottom > groupRect.bottom + 1).map(label => label.text),
        collisions,
        pageOverflow: document.documentElement.scrollWidth - innerWidth
      };
    });
    expect(metrics.minFontSize, JSON.stringify(metrics)).toBeGreaterThanOrEqual(10);
    expect(metrics.clipped).toEqual([]);
    expect(metrics.collisions).toEqual([]);
    expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  }
});

test('pyrimidine expert mechanism keeps six-step UMP synthesis and both nucleotide branches continuous', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);
  await page.locator('.path-filter[data-path="pyrimidine"]').click();
  await page.locator('#expertPathPreview').click();
  const schematic = page.locator('#sceneExpertOverlayLayer .overlay-schematic-pyrimidine');
  await expect(schematic).toHaveCount(1);
  for (const zone of ['cad-cytosol', 'dhodh-imm', 'umps-cytosol', 'rna-dna-branches', 'atom-energy-regulation']) {
    await expect(schematic.locator(`[data-pyrimidine-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(schematic.locator('.schematic-step-disc')).toHaveCount(6);
  expect(await schematic.locator('.schematic-node').count()).toBeGreaterThanOrEqual(28);
  for (const anchor of [
    '环先合成 · 再接 PRPP', 'CAD · CPS II', 'CAD · ATCase', 'CAD · DHOase',
    '氨甲酰磷酸', '氨甲酰天冬氨酸', '二氢乳清酸',
    'DHODH · FMN', 'CoQ → CoQH₂', '内膜外侧 · 底物/产物保持胞质可达',
    '乳清酸', 'UMPS · OPRTase', 'OMP', 'UMPS · OMP decarboxylase', 'UMP',
    'UDP', 'UTP', 'CTPS · Gln + ATP', 'CTP',
    'RNR', 'thioredoxin(red)', 'dUDP', 'NDPK', 'dUTP', 'DUT', 'dUMP',
    'TYMS', '5,10-亚甲基-THF → DHF', 'dTMP', 'dTTP',
    'dCTP：CDP 经 RNR', 'dCMP deaminase → dUMP',
    'N3 · Gln', 'C2 · HCO₃⁻', 'N1/C4/C5/C6 · Asp',
    'CAD/CPS II · 2 ATP', 'UTP⊣CAD · PRPP→CAD', '不虚构 DHODH 专用转运体'
  ]) {
    await expect(schematic).toContainText(anchor);
  }
  await expect(page.locator('#scopeExchange .scene-reaction-step')).toHaveCount(11);

  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(250);
    const metrics = await schematic.evaluate(group => {
      const groupRect = group.getBoundingClientRect();
      const labels = [...group.querySelectorAll('.schematic-title,.schematic-compartment-title,.schematic-label,.schematic-node-label,.schematic-enzyme,.schematic-cofactor,.schematic-transporter,.schematic-output,.schematic-note')]
        .filter(label => label.textContent.trim())
        .map(label => ({ text: label.textContent.trim(), rect: label.getBoundingClientRect(), fontSize: Number.parseFloat(getComputedStyle(label).fontSize) }));
      const collisions = [];
      for (let left = 0; left < labels.length; left += 1) {
        for (let right = left + 1; right < labels.length; right += 1) {
          const first = labels[left];
          const second = labels[right];
          const width = Math.max(0, Math.min(first.rect.right, second.rect.right) - Math.max(first.rect.left, second.rect.left));
          const height = Math.max(0, Math.min(first.rect.bottom, second.rect.bottom) - Math.max(first.rect.top, second.rect.top));
          if (width * height > 1) collisions.push(`${first.text} / ${second.text}`);
        }
      }
      return {
        minFontSize: Math.min(...labels.map(label => label.fontSize)),
        clipped: labels.filter(label => label.rect.left < groupRect.left - 1 || label.rect.right > groupRect.right + 1
          || label.rect.top < groupRect.top - 1 || label.rect.bottom > groupRect.bottom + 1).map(label => label.text),
        collisions,
        pageOverflow: document.documentElement.scrollWidth - innerWidth
      };
    });
    expect(metrics.minFontSize, JSON.stringify(metrics)).toBeGreaterThanOrEqual(10);
    expect(metrics.clipped).toEqual([]);
    expect(metrics.collisions).toEqual([]);
    expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  }
});

test('ETC mechanism starts below the mobile scene navigation instead of being covered', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);

  await page.locator('.path-filter[data-path="etc"]').click();
  await page.locator('#expertPathPreview').click();
  await expect(page.locator('#sceneExpertOverlayLayer .overlay-schematic-etc')).toHaveCount(1);
  await page.waitForTimeout(450);

  const geometry = await page.evaluate(() => {
    const nav = document.querySelector('.scene-nav').getBoundingClientRect();
    const overlay = document.querySelector('#sceneExpertOverlay').getBoundingClientRect();
    return { navBottom: nav.bottom, overlayTop: overlay.top };
  });
  expect(geometry.overlayTop).toBeGreaterThanOrEqual(geometry.navBottom + 6);
});

test('OxPhos mechanism separates ATP synthase, ANT and phosphate carrier on mobile and tablet', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);
  await page.locator('.path-filter[data-path="oxphos"]').click();
  await page.locator('#expertPathPreview').click();
  const schematic = page.locator('#sceneExpertOverlayLayer .overlay-schematic-oxphos');
  await expect(schematic).toHaveCount(1);

  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(250);
    const metrics = await schematic.evaluate(group => {
      const labels = [...group.querySelectorAll([
        '.schematic-title', '.schematic-label', '.schematic-node-label', '.schematic-enzyme',
        '.schematic-cofactor', '.schematic-transporter', '.schematic-exchange', '.schematic-output'
      ].join(','))]
        .filter(label => label.textContent.trim())
        .map(label => ({ text: label.textContent.trim(), rect: label.getBoundingClientRect(), fontSize: Number.parseFloat(getComputedStyle(label).fontSize) }));
      const collisions = [];
      for (let left = 0; left < labels.length; left += 1) {
        for (let right = left + 1; right < labels.length; right += 1) {
          const first = labels[left];
          const second = labels[right];
          const width = Math.max(0, Math.min(first.rect.right, second.rect.right)
            - Math.max(first.rect.left, second.rect.left));
          const height = Math.max(0, Math.min(first.rect.bottom, second.rect.bottom)
            - Math.max(first.rect.top, second.rect.top));
          if (width * height > 1) collisions.push(`${first.text} / ${second.text}`);
        }
      }
      return {
        minFontSize: Math.min(...labels.map(label => label.fontSize)),
        collisions,
        pageOverflow: document.documentElement.scrollWidth - innerWidth
      };
    });
    expect(metrics.minFontSize).toBeGreaterThanOrEqual(10);
    expect(metrics.collisions).toEqual([]);
    expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  }
});

test('PDH mechanism separates membrane entry from E1 E2 E3 handoff on mobile and tablet', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);
  await page.locator('.path-filter[data-path="pdh"]').click();
  await page.locator('#expertPathPreview').click();
  const schematic = page.locator('#sceneExpertOverlayLayer .overlay-schematic-pdh');
  await expect(schematic).toHaveCount(1);
  await expect(schematic.locator('[data-pdh-zone="transport"]')).toHaveCount(1);
  await expect(schematic.locator('[data-pdh-zone="complex"]')).toHaveCount(1);

  for (const anchor of ['VDAC', 'MPC1/2', 'E1 · TPP', 'E2 · 硫辛酰胺', 'E3 · FAD', 'NADH + H⁺']) {
    await expect(schematic).toContainText(anchor);
  }

  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(250);
    const metrics = await schematic.evaluate(group => {
      const labels = [...group.querySelectorAll([
        '.schematic-title', '.schematic-label', '.schematic-node-label', '.schematic-enzyme',
        '.schematic-cofactor', '.schematic-transporter', '.schematic-exchange', '.schematic-output'
      ].join(','))]
        .filter(label => label.textContent.trim())
        .map(label => ({ text: label.textContent.trim(), rect: label.getBoundingClientRect(), fontSize: Number.parseFloat(getComputedStyle(label).fontSize) }));
      const collisions = [];
      for (let left = 0; left < labels.length; left += 1) {
        for (let right = left + 1; right < labels.length; right += 1) {
          const first = labels[left];
          const second = labels[right];
          const width = Math.max(0, Math.min(first.rect.right, second.rect.right)
            - Math.max(first.rect.left, second.rect.left));
          const height = Math.max(0, Math.min(first.rect.bottom, second.rect.bottom)
            - Math.max(first.rect.top, second.rect.top));
          if (width * height > 1) collisions.push(`${first.text} / ${second.text}`);
        }
      }
      return {
        minFontSize: Math.min(...labels.map(label => label.fontSize)),
        collisions,
        pageOverflow: document.documentElement.scrollWidth - innerWidth
      };
    });
    expect(metrics.minFontSize).toBeGreaterThanOrEqual(10);
    expect(metrics.collisions).toEqual([]);
    expect(metrics.pageOverflow).toBeLessThanOrEqual(1);
  }
});

test('pyrimidine mobile mechanism separates the RNA and DNA precursor branches', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);

  await page.locator('.path-filter[data-path="pyrimidine"]').click();
  await page.locator('#expertPathPreview').click();
  const schematic = page.locator('#sceneExpertOverlayLayer .overlay-schematic-pyrimidine');
  await expect(schematic).toHaveCount(1);

  await expect(schematic.getByText('dUDP', { exact: true })).toHaveCount(1);
  await expect(schematic.getByText('RNR → dUMP', { exact: true })).toHaveCount(0);
  await expect(schematic.getByText('RNR', { exact: true })).toHaveCount(1);
  await expect(schematic.getByText('TYMS', { exact: true })).toHaveCount(1);

  const overlaps = await schematic.evaluate(group => {
    const auditedLabels = new Set([
      '乳清酸', 'OMP', 'UMP', 'UMPS · PRPP', 'OMP 脱羧',
      'UTP', 'CTP', 'UDP', 'dUDP', 'dUMP', 'dTMP', 'RNR', 'TYMS',
      'N⁵,N¹⁰-亚甲基-THF'
    ]);
    const labels = [...group.querySelectorAll('text')]
      .filter(label => auditedLabels.has(label.textContent.trim()))
      .map(label => ({ text: label.textContent.trim(), rect: label.getBoundingClientRect(), fontSize: Number.parseFloat(getComputedStyle(label).fontSize) }));
    const collisions = [];
    for (let left = 0; left < labels.length; left += 1) {
      for (let right = left + 1; right < labels.length; right += 1) {
        const first = labels[left];
        const second = labels[right];
        const width = Math.max(0, Math.min(first.rect.right, second.rect.right)
          - Math.max(first.rect.left, second.rect.left));
        const height = Math.max(0, Math.min(first.rect.bottom, second.rect.bottom)
          - Math.max(first.rect.top, second.rect.top));
        if (width * height > 1) collisions.push(`${first.text} / ${second.text}`);
      }
    }
    return collisions;
  });
  expect(overlaps).toEqual([]);
});

test('mechanism return and reaction detail close controls meet the mobile touch target', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);

  await page.locator('.path-filter[data-path="tca"]').click();
  await page.locator('#expertPathPreview').click();
  await expect(page.locator('#sceneBack')).toBeVisible();

  const returnSize = await page.locator('#sceneBack').evaluate(element => {
    const rect = element.getBoundingClientRect();
    return { width: Math.round(rect.width), height: Math.round(rect.height) };
  });

  await page.locator('.scene-reaction-step').first().click();
  await expect(page.locator('#closeInspector')).toBeVisible();
  const closeSize = await page.locator('#closeInspector').evaluate(element => {
    const rect = element.getBoundingClientRect();
    return { width: Math.round(rect.width), height: Math.round(rect.height) };
  });

  expect(returnSize.width).toBeGreaterThanOrEqual(44);
  expect(returnSize.height).toBeGreaterThanOrEqual(44);
  expect(closeSize.width).toBeGreaterThanOrEqual(44);
  expect(closeSize.height).toBeGreaterThanOrEqual(44);
});

test('nucleotide degradation expert map keeps salvage separate from purine and pyrimidine terminal branches', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);
  await page.locator('.path-filter[data-path="nucleotide_degradation"]').click();
  await page.locator('#expertPathPreview').click();
  const schematic = page.locator('#sceneExpertOverlayLayer .overlay-schematic-nucleotide_degradation');
  await expect(schematic).toHaveCount(1);
  for (const zone of ['phosphate-release', 'nucleoside-cleavage', 'purine-branch', 'pyrimidine-branch', 'salvage-ledger']) {
    await expect(schematic.locator(`[data-nucleotide-degradation-zone="${zone}"]`)).toHaveCount(1);
  }
  await expect(schematic).toContainText('核苷酸酶');
  await expect(schematic).toContainText('核苷磷酸化酶');
  await expect(schematic).toContainText('黄嘌呤氧化酶');
  await expect(schematic).toContainText('尿酸');
  await expect(schematic).toContainText('β-丙氨酸');
  await expect(schematic).toContainText('β-氨基异丁酸');
  await expect(schematic).toContainText('APRT / HGPRT 不属于本图主干');
  await expect(page.locator('#scopeExchange .scene-reaction-step')).toHaveCount(6);
});

test('all 21 core mechanisms keep essential labels readable on mobile', async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await enterExpertMap(page);

  const pathwayIds = await page.locator('.path-filter[data-path]:not([data-path="all"])')
    .evaluateAll(buttons => buttons.map(button => button.dataset.path));
  expect(pathwayIds).toHaveLength(21);

  const failures = [];
  for (const pathwayId of pathwayIds) {
    await page.locator(`.path-filter[data-path="${pathwayId}"]`).click();
    await page.locator('#expertPathPreview').click();
    const schematic = page.locator(`#sceneExpertOverlayLayer .overlay-schematic-${pathwayId}`);
    await expect(schematic).toHaveCount(1);

    const metrics = await page.locator('#sceneExpertOverlayLayer').evaluate(layer => {
      const layerRect = layer.getBoundingClientRect();
      const labels = [...layer.querySelectorAll([
        '.schematic-title',
        '.schematic-compartment-title',
        '.schematic-label',
        '.schematic-node-label',
        '.schematic-enzyme',
        '.schematic-cofactor',
        '.schematic-transporter',
        '.schematic-exchange',
        '.schematic-output'
      ].join(','))]
        .filter(label => label.textContent.trim())
        .map(label => {
          const rect = label.getBoundingClientRect();
          return {
            text: label.textContent.trim(),
            height: rect.height,
            clipped: rect.left < layerRect.left - 1
              || rect.right > layerRect.right + 1
              || rect.top < layerRect.top - 1
              || rect.bottom > layerRect.bottom + 1
          };
        });
      return {
        labels,
        pageOverflow: document.documentElement.scrollWidth - innerWidth
      };
    });

    const unreadable = metrics.labels.filter(label => label.height < 10);
    const clipped = metrics.labels.filter(label => label.clipped);
    if (!metrics.labels.length || unreadable.length || clipped.length || metrics.pageOverflow > 1) {
      failures.push({
        pathwayId,
        labelCount: metrics.labels.length,
        unreadable: unreadable.map(label => `${label.text}:${label.height.toFixed(1)}px`),
        clipped: clipped.map(label => label.text),
        pageOverflow: metrics.pageOverflow
      });
    }

    for (let depth = 0; depth < 4 && await page.locator('body').evaluate(body => body.classList.contains('scene-open')); depth += 1) {
      await page.locator('#sceneBack').dispatchEvent('click');
    }
    await expect(page.locator('body')).not.toHaveClass(/scene-open/);
  }

  expect(failures).toEqual([]);
});
