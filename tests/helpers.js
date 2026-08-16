const { test, expect } = require('playwright/test');

function appUrl(version) {
  return `/index.html?v=${encodeURIComponent(version)}`;
}

module.exports = { test, expect, appUrl };
