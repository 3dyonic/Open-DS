// Renders hero.html to hero.png at 2x with the Playwright Chromium that is installed.
// Run: node .github/assets/render-hero.cjs
const { chromium } = require("playwright");
const path = require("node:path");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 640 }, deviceScaleFactor: 2 });
  await page.goto(`file://${path.join(__dirname, "hero.html")}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(__dirname, "hero.png") });
  await browser.close();
})();
