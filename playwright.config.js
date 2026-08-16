const { defineConfig } = require('playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },
  use: {
    baseURL: 'http://127.0.0.1:8000',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'node tools/serve-static.js',
    url: 'http://127.0.0.1:8000/index.html',
    reuseExistingServer: true,
    timeout: 15_000
  }
});
