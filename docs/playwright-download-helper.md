# Playwright download helper

`scripts/lib/playwright-download.mjs` exposes a reusable `captureDownload(page, trigger, options)` for Playwright-driven QA scripts in this repo.

## Why

The existing QA scripts (`scripts/qa-feature-proof.mjs`, `scripts/qa-config-outcomes.mjs`) trigger downloads dynamically (PDF export, workspace JSON export). When a download silently fails to fire — common in headless CI — the test usually hangs or reports a vague "no download" message. This helper:

- waits for `page.waitForEvent('download')` with a bounded timeout,
- runs the dynamic trigger inside the helper so the race is correct,
- saves the file with `download.saveAs(...)`,
- always logs the download URL, suggested filename, and final saved path,
- emits an actionable diagnostic if the download event never fires, including the supplied `label` so you can tell which trigger went silent in CI logs.

## API

```js
import { captureDownload } from './lib/playwright-download.mjs';

const result = await captureDownload(page, trigger, options);
```

### Parameters

| Name | Type | Notes |
| --- | --- | --- |
| `page` | `playwright.Page` | required |
| `trigger` | `() => Promise<unknown> \| unknown` | runs *after* the wait promise is registered so the download race is safe |
| `options.timeoutMs` | `number` | default `15000` |
| `options.outputDir` | `string` | default `./downloads`, created if missing |
| `options.filename` | `string` | overrides the sanitized `suggestedFilename()` |
| `options.label` | `string` | included in every log line — set this so CI logs can identify which trigger failed |
| `options.throwOnFailure` | `boolean` | default `false`; when `true` the helper re-throws instead of returning `{ ok: false }` |

### Return value

```ts
{
  ok: boolean,
  savedPath?: string,            // present on success
  url?: string,                  // download.url()
  suggestedFilename?: string,    // download.suggestedFilename()
  reason?: 'timeout' | 'trigger-error' | 'save-error' | 'download-error',
  error?: Error,                 // present on failure
  timeoutMs: number,
  label?: string,
}
```

## Usage

```js
import { chromium } from 'playwright';
import { captureDownload } from './lib/playwright-download.mjs';

const browser = await chromium.launch();
const page = await (await browser.newContext()).newPage();
await page.goto('https://www.compassultra.com/app?demo=true');

const result = await captureDownload(
  page,
  async () => {
    await page.locator('button[aria-label="Export workspace"]').click();
  },
  { label: 'workspace-json-export', timeoutMs: 10000, outputDir: 'downloads' },
);

if (!result.ok) {
  // result.reason and result.error are populated; the helper already logged
  // a diagnostic line including the label and timeout.
  process.exitCode = 1;
}
```

A runnable example lives at `scripts/qa-download-example.mjs`. Run it locally with:

```
node scripts/qa-download-example.mjs
```

## CI/CD notes

- Failures never throw by default — set `throwOnFailure: true` if you'd rather your test crash.
- Every log line is prefixed with an ISO timestamp and the optional `label`, which makes them grep-able in CI build output.
- The helper never relies on `page.waitForTimeout()` — if the download event never fires, it bails at `timeoutMs` rather than hanging.
- When the download is created via in-page `Blob` + `link.click()` (e.g. jsPDF's `doc.save()`), Playwright may not raise the `download` event at all. The helper logs this case as `reason: 'timeout'` with the trigger label, which is the signal to fall back to inspecting in-page state instead of treating the test as broken.
