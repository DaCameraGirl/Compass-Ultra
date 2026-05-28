import { chromium } from 'playwright';
import { captureDownload } from './lib/playwright-download.mjs';

const BASE = process.env.COMPASS_BASE_URL || 'https://www.compassultra.com';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  await page.goto(`${BASE}/app?demo=true`, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(1500);

  const pdf = await captureDownload(
    page,
    async () => {
      const btn = page.locator('button[aria-label="Export proof PDF"], button:has-text("Export Proof")').first();
      await btn.click({ force: true });
    },
    { label: 'pdf-export', timeoutMs: 10000, outputDir: 'downloads' },
  );

  const json = await captureDownload(
    page,
    async () => {
      await page.locator('button[aria-label="Export workspace"]').first().click({ force: true });
    },
    { label: 'workspace-json-export', timeoutMs: 10000, outputDir: 'downloads' },
  );

  await browser.close();

  const results = { pdf, json };
  console.log('\n=== captureDownload summary ===');
  console.log(JSON.stringify(results, (_, v) => (v instanceof Error ? v.message : v), 2));

  if (!pdf.ok && !json.ok) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('qa-download-example crashed:', err);
  process.exit(2);
});
