import fs from 'node:fs';

const requiredFiles = [
  '.github/actions/compass-check/action.yml',
  '.github/actions/compass-check/compass-check.mjs',
  'docs/github-action.md',
  'SECURITY.md',
  'CHANGELOG.md',
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`Missing required file: ${file}`);
    process.exit(1);
  }
}

const action = fs.readFileSync('.github/actions/compass-check/action.yml', 'utf8');
if (!action.includes('Compass Ultra Release Gate') || !action.includes('fail-on')) {
  console.error('Compass Action metadata is incomplete.');
  process.exit(1);
}
for (const output of ['result', 'decision', 'riskLevel', 'failed', 'summary', 'findings']) {
  if (!action.includes(`${output}:`) || !action.includes(`steps.compass-check.outputs.${output}`)) {
    console.error(`Compass Action output is not exposed correctly: ${output}`);
    process.exit(1);
  }
}
if (!action.includes('id: compass-check')) {
  console.error('Compass Action run step must keep id: compass-check so composite outputs are wired.');
  process.exit(1);
}

// Demo analyzer must use the real backend with a realistic timeout. The live
// AI service has been observed to take ~20–30s, so any default below 30s
// effectively forces a fallback and breaks the demo experience.
const apiSource = fs.readFileSync('app/src/api.js', 'utf8');
const demoTimeoutMatch = apiSource.match(/analyzeDemoFlags:\s*\(payload,\s*\{\s*timeoutMs\s*=\s*(\d+)\s*\}/);
if (!demoTimeoutMatch) {
  console.error('Could not find analyzeDemoFlags default timeout in app/src/api.js');
  process.exit(1);
}
const demoTimeoutMs = Number(demoTimeoutMatch[1]);
if (!Number.isFinite(demoTimeoutMs) || demoTimeoutMs < 30000) {
  console.error(`analyzeDemoFlags default timeout is ${demoTimeoutMs}ms; must be >= 30000ms so the live analyzer can complete.`);
  process.exit(1);
}
if (!apiSource.includes("'/api/v1/analyze/demo'")) {
  console.error('analyzeDemoFlags must call /api/v1/analyze/demo on the real backend.');
  process.exit(1);
}

// Demo branch in App.jsx must call the real analyzer first; the fallback
// must only run after the real call fails and must be labeled as a fallback.
const appSource = fs.readFileSync('app/src/App.jsx', 'utf8');
if (!appSource.includes('api.analyzeDemoFlags(')) {
  console.error('App.jsx must call api.analyzeDemoFlags for the demo risk analyzer.');
  process.exit(1);
}
if (/analyzeDemoFlags\([^)]*timeoutMs:\s*\d{1,4}\b/.test(appSource)) {
  console.error('App.jsx must not pass a short timeoutMs override to analyzeDemoFlags.');
  process.exit(1);
}
if (!/Deterministic fallback/.test(appSource)) {
  console.error('App.jsx must label the demo fallback path as a deterministic fallback.');
  process.exit(1);
}

console.log('Smoke tests passed.');
