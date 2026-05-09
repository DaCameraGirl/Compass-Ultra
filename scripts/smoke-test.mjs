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

console.log('Smoke tests passed.');
