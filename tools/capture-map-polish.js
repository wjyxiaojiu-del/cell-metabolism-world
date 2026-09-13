const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

function option(name, fallback = '') {
  const prefix = `--${name}=`;
  const value = process.argv.find(argument => argument.startsWith(prefix));
  return value ? value.slice(prefix.length) : fallback;
}

const pathwayId = option('pathway');
const phase = option('phase', 'before');
const now = new Date();
const localDate = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
const captureDate = option('date', localDate);
const baseUrl = option('base-url', 'http://127.0.0.1:8000');
const requestedModes = new Set(option('modes', 'learning,expert').split(',').map(value => value.trim()).filter(Boolean));
const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 }
];

if (!pathwayId) {
  console.error('用法: node tools/capture-map-polish.js --pathway=<id> [--phase=before|final] [--modes=learning,expert]');
  process.exit(1);
}

function evidencePath(mode, suffix) {
  const directory = path.resolve(__dirname, '..', 'docs', 'map-polish', 'evidence', mode, pathwayId);
  fs.mkdirSync(directory, { recursive: true });
  return path.join(directory, `${captureDate}-${phase}-${suffix}.png`);
}

async function enterLearning(page) {
  await page.goto(`${baseUrl}/index.html?v=map-polish-capture-${Date.now()}`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.locator('#studentWorkspace').waitFor({ state: 'visible' });
  await page.locator('#cellCover').waitFor({ state: 'hidden' });
}

async function selectLearningPathway(page) {
  await page.locator('#studentPathwaySelect').evaluate((select, id) => {
    select.value = id;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }, pathwayId);
  await page.waitForFunction(id => document.querySelector('#studentPathwaySelect')?.value === id, pathwayId);
  await page.locator('#studentPathwayMap').waitFor({ state: 'visible' });
  await page.waitForFunction(() => {
    const image = document.querySelector('#studentPathwayMapVisualImage');
    if (!image || image.getBoundingClientRect().width <= 0 || image.getBoundingClientRect().height <= 0) return true;
    return image.complete && image.naturalWidth > 0;
  });
  const learningPlate = page.locator('#studentPathwayMapVisualImage');
  if (await learningPlate.isVisible()) await learningPlate.evaluate(image => image.decode());
  await page.waitForTimeout(150);
}

async function openExpertPathway(page) {
  await page.getByRole('button', { name: '专家地图', exact: true }).click();
  await page.locator(`.path-filter[data-path="${pathwayId}"]`).click();
  await page.locator('#expertPathPreview').click();
  const activeDeck = page.locator(`#sceneDeck.pathway-visual-active[data-pathway="${pathwayId}"]`);
  if (!await activeDeck.count()) {
    const hotspot = page.locator(`#sceneHotspots .scene-hotspot[data-pathway="${pathwayId}"]`);
    if (await hotspot.count()) await hotspot.first().click({ force: true });
    else await page.locator(`.scene-route-lane[data-pathway="${pathwayId}"]`).click({ force: true });
  }
  await page.locator(`#sceneExpertOverlayLayer .overlay-schematic-${pathwayId}`).waitFor({ state: 'attached' });
  await page.waitForFunction(() => {
    const image = document.querySelector('#sceneBackground');
    return image?.complete && image.naturalWidth > 0;
  });
  await page.locator('#sceneBackground').evaluate(image => image.decode());
  // 机制覆盖层、背景切换和场景导航都有约 0.4–0.5s 的入场动画；
  // 等待稳定帧，避免把过渡残影写进 canonical final 证据。
  await page.waitForTimeout(700);
}

async function captureLearning(browser) {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    await enterLearning(page);
    await selectLearningPathway(page);
    await page.screenshot({ path: evidencePath('learning', String(viewport.width)), fullPage: true });
    await page.locator('.student-map-stage').screenshot({ path: evidencePath('learning', `${viewport.width}-map-viewport`) });
    if (viewport.width === 390) {
      await page.locator('.student-map-stage').evaluate(stage => {
        stage.scrollLeft = Math.max(0, (stage.scrollWidth - stage.clientWidth) / 2);
      });
      await page.locator('.student-map-stage').screenshot({ path: evidencePath('learning', '390-map-core') });
    }
    if (viewport.width === 1440) {
      await page.locator('#studentPathwayMap').screenshot({ path: evidencePath('learning', 'map-direct') });
      const plate = page.locator('#studentPathwayMapVisualFrame');
      if (await plate.isVisible()) await plate.screenshot({ path: evidencePath('learning', 'plate-direct') });
    }
    await page.close();
  }
}

async function captureExpert(browser) {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    await enterLearning(page);
    await openExpertPathway(page);
    await page.screenshot({ path: evidencePath('expert', String(viewport.width)), fullPage: true });
    await page.locator('#sceneDeck').screenshot({ path: evidencePath('expert', `${viewport.width}-deck`) });
    if (viewport.width === 1440) {
      await page.locator('#sceneExpertOverlay').screenshot({ path: evidencePath('expert', 'overlay') });
    }
    await page.close();
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    if (requestedModes.has('learning')) await captureLearning(browser);
    if (requestedModes.has('expert')) await captureExpert(browser);
  } finally {
    await browser.close();
  }
  console.log(`已生成 ${pathwayId} 的 ${[...requestedModes].join(' / ')} ${phase} 证据。`);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
