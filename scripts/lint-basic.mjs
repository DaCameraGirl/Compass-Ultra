import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const ignored = new Set(['.git', 'node_modules', 'dist', 'assets']);
const extensions = new Set(['.js', '.jsx', '.mjs', '.json', '.md', '.yml', '.yaml']);
const forbidden = ['<'.repeat(7), '='.repeat(7), '>'.repeat(7)];
const failures = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (!extensions.has(path.extname(entry.name))) continue;
    const text = fs.readFileSync(fullPath, 'utf8');
    for (const marker of forbidden) {
      if (text.includes(marker)) failures.push(`${path.relative(root, fullPath)} contains ${marker}`);
    }
  }
}

walk(root);

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Basic lint passed.');
