import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_OUTPUT_DIR = path.join(process.cwd(), 'downloads');

function nowIso() {
  return new Date().toISOString();
}

function log(level, label, message, extra) {
  const prefix = `[${nowIso()}] [playwright-download]${label ? ` [${label}]` : ''} ${level}:`;
  if (extra !== undefined) {
    console.log(prefix, message, extra);
  } else {
    console.log(prefix, message);
  }
}

function sanitizeFilename(name) {
  return String(name).replace(/[^A-Za-z0-9._-]+/g, '_').replace(/^_+|_+$/g, '') || 'download.bin';
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Capture a Playwright download triggered by a dynamic action.
 *
 * Usage:
 *   const result = await captureDownload(page, async () => {
 *     await page.getByRole('button', { name: 'Export PDF' }).click();
 *   }, { label: 'pdf-export', outputDir: 'downloads' });
 *
 *   if (result.ok) console.log('saved to', result.savedPath);
 *
 * The helper never throws on the common failure paths (timeout, save error,
 * trigger error). It returns a result object so callers in CI can decide how
 * to surface failures while still getting actionable logs on the console.
 *
 * @param {import('playwright').Page} page
 * @param {() => Promise<unknown> | unknown} trigger - dynamic action that
 *   causes the download. Anything from a click to a custom JS call.
 * @param {object} [options]
 * @param {number} [options.timeoutMs] - how long to wait for the download
 *   event before bailing. Defaults to 15s.
 * @param {string} [options.outputDir] - where to save the file via
 *   download.saveAs. Defaults to ./downloads relative to cwd.
 * @param {string} [options.filename] - override saved filename. When omitted,
 *   the suggestedFilename() is sanitized and used.
 * @param {string} [options.label] - human-readable context (e.g. trigger
 *   name) included in every log line; especially useful in CI logs.
 * @param {boolean} [options.throwOnFailure] - when true, re-throws the
 *   underlying error instead of returning { ok: false }. Defaults to false.
 * @returns {Promise<{
 *   ok: boolean,
 *   savedPath?: string,
 *   url?: string,
 *   suggestedFilename?: string,
 *   reason?: 'timeout' | 'trigger-error' | 'save-error' | 'download-error',
 *   error?: Error,
 *   timeoutMs: number,
 *   label?: string
 * }>}
 */
export async function captureDownload(page, trigger, options = {}) {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    outputDir = DEFAULT_OUTPUT_DIR,
    filename,
    label,
    throwOnFailure = false,
  } = options;

  if (!page || typeof page.waitForEvent !== 'function') {
    const err = new Error('captureDownload: a Playwright Page is required');
    log('ERROR', label, err.message);
    if (throwOnFailure) throw err;
    return { ok: false, reason: 'trigger-error', error: err, timeoutMs, label };
  }
  if (typeof trigger !== 'function') {
    const err = new Error('captureDownload: trigger must be a function');
    log('ERROR', label, err.message);
    if (throwOnFailure) throw err;
    return { ok: false, reason: 'trigger-error', error: err, timeoutMs, label };
  }

  log('INFO', label, `Awaiting download (timeout=${timeoutMs}ms, outputDir=${outputDir})`);

  const downloadPromise = page.waitForEvent('download', { timeout: timeoutMs });

  let triggerError;
  try {
    await trigger();
  } catch (err) {
    triggerError = err instanceof Error ? err : new Error(String(err));
    log(
      'ERROR',
      label,
      `Trigger threw before download could be captured: ${triggerError.message}`,
    );
  }

  let download;
  try {
    download = await downloadPromise;
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    const isTimeout = /Timeout|timeout/.test(error.message);
    const reason = triggerError
      ? 'trigger-error'
      : isTimeout
        ? 'timeout'
        : 'download-error';
    log(
      'ERROR',
      label,
      `Download event was never emitted (${reason}) after ${timeoutMs}ms. ` +
        `Trigger context: ${label || '(none)'}. ` +
        (triggerError ? `Trigger error: ${triggerError.message}. ` : '') +
        `Underlying: ${error.message}`,
    );
    if (throwOnFailure) throw triggerError || error;
    return {
      ok: false,
      reason,
      error: triggerError || error,
      timeoutMs,
      label,
    };
  }

  const url = (() => {
    try { return download.url(); } catch { return undefined; }
  })();
  const suggestedFilename = (() => {
    try { return download.suggestedFilename(); } catch { return undefined; }
  })();

  log('INFO', label, `Download received. url=${url || '(unknown)'} suggestedFilename=${suggestedFilename || '(unknown)'}`);

  try {
    ensureDir(outputDir);
    const safeName = sanitizeFilename(filename || suggestedFilename || 'download.bin');
    const savedPath = path.join(outputDir, safeName);
    await download.saveAs(savedPath);
    log('INFO', label, `Saved download to ${savedPath}`);
    return {
      ok: true,
      savedPath,
      url,
      suggestedFilename,
      timeoutMs,
      label,
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    log('ERROR', label, `Failed to save download: ${error.message}`);
    if (throwOnFailure) throw error;
    return {
      ok: false,
      reason: 'save-error',
      error,
      url,
      suggestedFilename,
      timeoutMs,
      label,
    };
  }
}

export const __testing = { sanitizeFilename, DEFAULT_TIMEOUT_MS, DEFAULT_OUTPUT_DIR };
