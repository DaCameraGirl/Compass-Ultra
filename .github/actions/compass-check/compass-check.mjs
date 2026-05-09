import fs from 'node:fs';
import path from 'node:path';

const apiUrl = process.env.COMPASS_API_URL || 'https://api.compass-ultra.com';
const apiKey = process.env.COMPASS_API_KEY;
const workspacePath = process.env.COMPASS_WORKSPACE;
const failOn = process.env.COMPASS_FAIL_ON || 'high';

if (!apiKey) {
  console.error('COMPASS_API_KEY is required.');
  process.exit(2);
}

if (!workspacePath) {
  console.error('COMPASS_WORKSPACE is required.');
  process.exit(2);
}

const resolvedPath = path.resolve(process.cwd(), workspacePath);
const workspace = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));

const response = await fetch(`${apiUrl.replace(/\/$/, '')}/api/v1/check`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify({ workspace, failOn }),
});

const body = await response.json().catch(() => ({}));

if (!response.ok) {
  console.error(`Compass check request failed: ${response.status}`);
  console.error(JSON.stringify(body, null, 2));
  process.exit(2);
}

console.log(body.markdown || body.summary || 'Compass check complete.');

if (process.env.GITHUB_STEP_SUMMARY && body.markdown) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${body.markdown}\n`);
}

if (body.failed) {
  console.error(`Compass release gate failed: ${body.riskLevel} risk meets ${body.failOn} threshold.`);
  process.exit(1);
}
