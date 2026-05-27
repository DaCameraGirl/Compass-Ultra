const { chromium } = require("playwright");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BASE = "https://www.compassultra.com";
const DEMO = BASE + "/app?demo=true";

(async () => {
  const browser = await chromium.launch({
    channel: "chrome",
    headless: false,
    args: ["--window-position=0,0", "--start-maximized"],
  });

  const ctx = await browser.newContext({
    viewport: { width: 1400, height: 820 },
    locale: "en-US",
  });

  const page = await ctx.newPage();

  async function snap(name, wait = 4000) {
    console.log(`Navigating to ${name}...`);
    await page.waitForTimeout(wait);
    const filePath = path.join(ROOT, "docs", name + ".png");
    await page.screenshot({ path: filePath, fullPage: false });
    console.log(`  Saved ${name}.png`);
  }

  // Frame 1 — Landing page hero
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  console.log("\n--- Frame 1: Landing page ---");
  console.log("Please wait for the page to fully render (Vercel challenge may appear).");
  console.log("Once you see the Compass Ultra landing page, press ENTER in this terminal.");
  await new Promise(r => process.stdin.once("data", r));
  await snap("frame1_hero", 1000);

  // Frame 2 — Demo workspace (release review)
  console.log("\n--- Frame 2: Demo workspace ---");
  await page.goto(DEMO, { waitUntil: "domcontentloaded" });
  console.log("Please complete any Vercel challenge if needed.");
  console.log("Once the demo app loads with flag evaluations visible, press ENTER.");
  await new Promise(r => process.stdin.once("data", r));
  await snap("frame2_demo", 1000);

  // Frame 3 — AI DevOps widget visible
  console.log("\n--- Frame 3: AI DevOps ---");
  console.log("Navigate to a page showing the AI DevOps widget, or stay on demo.");
  console.log("Press ENTER when ready for the final screenshot.");
  await new Promise(r => process.stdin.once("data", r));
  await snap("frame3_ai", 1000);

  await browser.close();
  console.log("\nAll 3 frames captured in docs/. Run the GIF build script next.");
})();
