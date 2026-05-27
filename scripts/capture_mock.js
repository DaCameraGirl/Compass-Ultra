const { chromium } = require("playwright");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 820 } });

  async function snap(htmlFile, pngName) {
    const p = path.join(ROOT, "docs", htmlFile);
    await page.goto("file://" + p.replace(/\\/g, "/"), { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    const out = path.join(ROOT, "docs", pngName);
    await page.screenshot({ path: out });
    console.log(`  ${pngName}`);
  }

  console.log("Capturing frames...");
  await snap("mock_hero.html", "frame1_hero.png");
  await snap("mock_demo.html", "frame2_demo.png");
  await snap("mock_ai.html", "frame3_ai.png");
  await browser.close();
  console.log("Done — run python scripts/build_gif.py next");
})();
