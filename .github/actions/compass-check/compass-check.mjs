import fs from 'node:fs';
import path from 'node:path';

function writeOutput(name, value) {
  if (!process.env.GITHUB_OUTPUT) return;
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value ?? '');
  const delimiter = `EOF_${name}_${Date.now()}`;
  if (stringValue.includes('\n') || stringValue.includes('\r')) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}<<${delimiter}\n${stringValue}\n${delimiter}\n`);
  } else {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${stringValue}\n`);
  }
}

function sanitizeAnnotation(value) {
  return String(value ?? '')
    .replace(/[\r\n]/g, ' ')
    .replace(/%/g, '%25')
    .replace(/\]/g, '%5D');
}

const apiUrl = process.env.COMPASS_API_URL || 'https://api.compassultra.com';
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
    'x-compass-api-key': apiKey,
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

// Emit GitHub Actions outputs
writeOutput('result', body);
writeOutput('decision', body.decision || 'UNKNOWN');
writeOutput('riskLevel', body.riskLevel || 'UNKNOWN');
writeOutput('failed', body.failed || false);
writeOutput('summary', body.summary || 'Check complete.');
writeOutput('findings', body.findings || []);

if (process.env.GITHUB_STEP_SUMMARY && body.markdown) {
  const status = body.failed ? '❌ **FAILED**' : '✅ **PASSED**';
  const header = `# Compass Ultra Release Gate — ${status}\n\n`;
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${header}${body.markdown}\n`);

  // Add annotations for each finding
  if (Array.isArray(body.findings) && process.env.GITHUB_WORKFLOW) {
    for (const f of body.findings) {
      const code = sanitizeAnnotation(f.code || 'Finding');
      const message = sanitizeAnnotation(f.message || '');
      process.stdout.write(`::warning title=Compass ${code}::${message}\n`);
    }
  }
}

if (body.failed) {
  const riskLevel = sanitizeAnnotation(body.riskLevel || 'UNKNOWN');
  const failOn = sanitizeAnnotation(body.failOn || 'configured');
  const count = Array.isArray(body.findings) ? body.findings.length : 0;
  console.error(`::error title=Compass Release Gate::Gate failed: ${riskLevel} risk meets ${failOn} threshold. ${count} findings.`);
  process.exit(1);
}
