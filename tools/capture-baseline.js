#!/usr/bin/env node
// Capture visual regression baseline screenshots.
// Usage:
//   1. Start the local preview server (npm run preview) on http://127.0.0.1:8000
//   2. node tools/capture-baseline.js
// Output:
//   output/baseline/*.png  (git-ignored, actual images)
//   docs/baseline-manifest.json  (committed, sha256 + metadata)
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'output', 'baseline');
const MANIFEST = path.join(ROOT, 'docs', 'baseline-manifest.json');
const BASE = process.env.CMW_BASE_URL || 'http://127.0.0.1:8000';

const scenarios = [
  { name: 'cover-desktop', url: '/index.html?v=baseline-cover-desktop', width: 1440, height: 1000 },
  { name: 'cover-mobile', url: '/index.html?v=baseline-cover-mobile', width: 390, height: 844 },
  { name: 'student-home-desktop', url: '/index.html?v=baseline-student-home', width: 1440, height: 1000 },
  { name: 'student-glycolysis-desktop', url: '/index.html?v=baseline-student-glycolysis', width: 1440, height: 1000 },
  { name: 'student-glycolysis-mobile', url: '/index.html?v=baseline-student-glycolysis-mobile', width: 390, height: 844 },
  { name: 'expert-overview-desktop', url: '/index.html?v=baseline-expert-overview', width: 1440, height: 1000 },
  { name: 'expert-tca-desktop', url: '/index.html?v=baseline-expert-tca', width: 1440, height: 1000 },
  { name: 'scene-mitochondria-desktop', url: '/index.html?v=baseline-scene-mitochondria', width: 1440, height: 1000 }
];

async function enterLearning(page) {
  await page.getByRole('button', { name: /进入学习模式/ }).click();
  await page.locator('#studentWorkspace').waitFor({ state: 'visible', timeout: 5000 });
}

async function selectStudentPathway(page, pathwayId) {
  await page.locator('#studentPathwaySelect').evaluate((select, value) => {
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }, pathwayId);
  await page.waitForTimeout(350);
}

async function enterExpertMap(page) {
  await enterLearning(page);
  await page.getByRole('button', { name: '专家地图', exact: true }).click();
  await page.locator('body').waitFor({ state: 'visible' });
  await page.waitForTimeout(350);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const entries = [];

  for (const scenario of scenarios) {
    const context = await browser.newContext({ viewport: { width: scenario.width, height: scenario.height } });
    const page = await context.newPage();
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    // Make captures deterministic: disable CSS animations/transitions before load.
    await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }' });
    await page.goto(BASE + scenario.url, { waitUntil: 'networkidle', timeout: 20000 });
    await page.evaluate(() => document.fonts ? document.fonts.ready : Promise.resolve());

    if (scenario.name.startsWith('student-')) {
      await enterLearning(page);
      if (scenario.name.includes('glycolysis')) {
        await selectStudentPathway(page, 'glycolysis');
      }
    } else if (scenario.name.startsWith('expert-')) {
      await enterExpertMap(page);
      if (scenario.name.includes('tca')) {
        await page.locator('.path-filter[data-path="tca"]').evaluate(button => button.click());
        await page.waitForTimeout(500);
      }
    } else if (scenario.name.startsWith('scene-')) {
      await enterExpertMap(page);
      // Open mitochondria scene through the organelle focus path used by tests.
      await page.locator('#viewport .organelle').first().dblclick().catch(() => {});
      await page.waitForTimeout(500);
    }

    await page.waitForTimeout(300);
    const file = path.join(OUT_DIR, `${scenario.name}.png`);
    await page.screenshot({ path: file, fullPage: false });
    const hash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    entries.push({
      name: scenario.name,
      file: `output/baseline/${scenario.name}.png`,
      width: scenario.width,
      height: scenario.height,
      sha256: hash,
      pageErrors
    });
    console.log(`captured ${scenario.name} (${hash.slice(0, 12)}…)`);
    await context.close();
  }

  await browser.close();
  const manifest = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE,
    scenarios: entries
  };
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(`manifest written: ${MANIFEST}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
