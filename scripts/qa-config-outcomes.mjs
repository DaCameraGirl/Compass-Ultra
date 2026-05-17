import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.BASE_URL || 'https://127.0.0.1:5173';
const report = [];

function add(name, expected, actual, ok) {
  report.push({ name, expected, actual, status: ok ? 'PASS' : 'FAIL' });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  console.log(`  expected: ${expected}`);
  console.log(`  actual: ${actual}`);
}

async function body(page) {
  return page.locator('body').innerText();
}

async function clipboard(page) {
  return page.evaluate(() => navigator.clipboard.readText().catch(() => ''));
}

async function setActiveSeat(page, label) {
  await page.locator('label').filter({ hasText: 'active actor' }).locator('select').selectOption({ label });
  await page.waitForTimeout(250);
}

async function releaseInput(page, key) {
  return page.locator('section.panel').filter({ hasText: 'Release Control' }).locator('label').filter({ hasText: key }).locator('input');
}

async function contextInput(page, key) {
  return page.locator('section.panel').filter({ hasText: 'Evaluation Context' }).locator('label').filter({ hasText: key }).locator('input');
}

async function inspectorInput(page, key) {
  return page.locator('section.inspector-panel').locator('label').filter({ hasText: key }).locator('input');
}

async function inspectorSelect(page, key) {
  return page.locator('section.inspector-panel').locator('label').filter({ hasText: key }).locator('select');
}

async function selectFlag(page, key) {
  await page.locator('.flag-row').filter({ hasText: key }).first().click();
  await page.waitForTimeout(250);
}

async function copyWorkspaceJson(page) {
  await page.getByRole('button', { name: 'Copy workspace JSON' }).click();
  await page.waitForTimeout(250);
  return JSON.parse(await clipboard(page));
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    ignoreHTTPSErrors: true,
    viewport: { width: 1440, height: 1400 },
    permissions: ['clipboard-read', 'clipboard-write'],
  });

  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto(`${BASE}/app?demo=true`, { waitUntil: 'networkidle', timeout: 60000 });
  if (await page.getByText('Skip for now').isVisible().catch(() => false)) {
    await page.getByText('Skip for now').click();
  }

  await setActiveSeat(page, 'QA Operator - operator');
  await (await releaseInput(page, 'changeTicket')).fill('CHG-QA-9999');
  await (await releaseInput(page, 'releaseCaptain')).fill('QA Captain');
  await (await contextInput(page, 'region')).fill('eu-west');
  await (await contextInput(page, 'device')).fill('mobile');
  const afterOperatorEdits = await body(page);
  add(
    'Operator can edit release and context',
    'Runbook/body includes CHG-QA-9999, QA Captain, eu-west, mobile',
    [
      afterOperatorEdits.includes('CHG-QA-9999'),
      afterOperatorEdits.includes('QA Captain'),
      afterOperatorEdits.includes('eu-west'),
      afterOperatorEdits.includes('mobile'),
    ].join(','),
    afterOperatorEdits.includes('CHG-QA-9999')
      && afterOperatorEdits.includes('QA Captain')
      && afterOperatorEdits.includes('eu-west')
      && afterOperatorEdits.includes('mobile')
  );

  const beforeRows = await page.locator('.flag-row').count();
  await page.locator('input[placeholder="team.flag_name"]').fill('qa.config_flag');
  await page.locator('input[placeholder="Flag name"]').fill('QA Config Flag');
  await page.locator('section.panel').filter({ hasText: 'Add Flag' }).getByRole('button', { name: 'Add flag' }).click();
  await page.waitForTimeout(400);
  const afterRows = await page.locator('.flag-row').count();
  add('Operator can add a flag', 'flag count increases by 1 and flag appears', `${beforeRows}->${afterRows}`, afterRows === beforeRows + 1 && (await body(page)).includes('QA Config Flag'));

  await selectFlag(page, 'inventory.realtime_sync');
  const rollout = await inspectorInput(page, 'rollout');
  await rollout.focus();
  await page.keyboard.press('Home');
  for (let i = 0; i < 50; i += 1) await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(400);
  const canaryCleared = await body(page);
  add(
    'Canary blocker responds to rollout config',
    'Inventory at 50 leaves 2 canary-required flags above 50%',
    canaryCleared.match(/(\d+) canary-required flags exceed 50%/)?.[0] || 'not found',
    canaryCleared.includes('2 canary-required flags exceed 50%')
  );

  await (await inspectorSelect(page, 'override')).selectOption('true');
  await page.waitForTimeout(400);
  const overrideWarn = await body(page);
  add(
    'Production override warning responds to override config',
    'Production override discipline reports 1 manual override',
    overrideWarn.match(/(\d+) manual overrides active in production/)?.[0] || 'not found',
    overrideWarn.includes('1 manual overrides active in production')
  );

  await setActiveSeat(page, 'Release Approver - approver');
  await selectFlag(page, 'inventory.realtime_sync');
  const ownerBefore = await (await inspectorInput(page, 'owner')).inputValue();
  await (await inspectorInput(page, 'owner')).fill('Should Not Save');
  await page.waitForTimeout(300);
  const workspaceAfterBlockedEdit = await copyWorkspaceJson(page);
  const inventoryAfterBlockedEdit = workspaceAfterBlockedEdit.flags.find((flag) => flag.key === 'inventory.realtime_sync');
  add(
    'Approver cannot persist flag edits',
    `owner remains ${ownerBefore}`,
    inventoryAfterBlockedEdit?.owner,
    inventoryAfterBlockedEdit?.owner === ownerBefore
  );

  await setActiveSeat(page, 'Admin Reviewer - admin');
  const launchdarklyRow = page.locator('.integration-row').filter({ hasText: 'LaunchDarkly' }).first();
  await launchdarklyRow.locator('input[type="password"]').fill('ld-test-key');
  await page.waitForTimeout(400);
  const providerConfigured = await body(page);
  add(
    'Admin provider key changes provider policy gate',
    'Provider check reports at least 1 configured provider',
    providerConfigured.match(/(\d+) read-only provider connection\(s\) configured/)?.[0] || 'not found',
    providerConfigured.includes('1 read-only provider connection(s) configured')
  );

  const workspaceJson = await copyWorkspaceJson(page);
  add(
    'Workspace JSON reflects edited release/context/integration',
    'JSON has CHG-QA-9999, eu-west, ld-test-key',
    `${workspaceJson.release?.changeTicket}, ${workspaceJson.context?.region}, ${workspaceJson.integrations?.find((item) => item.id === 'launchdarkly')?.apiKey}`,
    workspaceJson.release?.changeTicket === 'CHG-QA-9999'
      && workspaceJson.context?.region === 'eu-west'
      && workspaceJson.integrations?.find((item) => item.id === 'launchdarkly')?.apiKey === 'ld-test-key'
  );

  await page.getByRole('button', { name: 'Copy release runbook' }).click();
  await page.waitForTimeout(250);
  const runbook = await clipboard(page);
  add(
    'Runbook reflects edited release/context',
    'Runbook includes CHG-QA-9999, QA Captain, eu-west, mobile',
    runbook.slice(0, 240).replace(/\s+/g, ' '),
    runbook.includes('CHG-QA-9999') && runbook.includes('QA Captain') && runbook.includes('eu-west') && runbook.includes('mobile')
  );

  add('No browser runtime errors during config QA', 'no console/page errors', errors.slice(0, 3).join(' | ') || 'none', errors.length === 0);

  await browser.close();

  const failed = report.filter((row) => row.status === 'FAIL').length;
  const lines = [
    'Compass Ultra Config Outcome QA',
    `Base: ${BASE}`,
    `Date: ${new Date().toISOString()}`,
    '',
    ...report.map((row) => `${row.status} | ${row.name}\nExpected: ${row.expected}\nActual: ${row.actual}`),
    '',
    `Summary: PASS=${report.length - failed}, FAIL=${failed}`,
  ];
  fs.writeFileSync('qa-config-outcomes-report.txt', lines.join('\n\n'));
  if (failed) process.exit(1);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
