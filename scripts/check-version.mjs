#!/usr/bin/env node
// Tells an app whether its vendored copy of useful.css is behind.
// Usage: node scripts/check-version.mjs path/to/vendored/useful.css
// Reads the "useful-design vX.Y.Z" banner in the first line and compares it with this repo's VERSION.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const file = process.argv[2];
if (!file) { console.error('Usage: node scripts/check-version.mjs <useful.css>'); process.exit(2); }

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const latest = readFileSync(join(root, 'VERSION'), 'utf8').trim();
const head = readFileSync(file, 'utf8').slice(0, 300);
const m = head.match(/useful-design v(\d+)\.(\d+)\.(\d+)/);
if (!m) { console.error(`No "useful-design vX.Y.Z" banner in ${file}`); process.exit(2); }

const have = m.slice(1).map(Number), want = latest.split('.').map(Number);
const label = `${have.join('.')} (latest ${latest})`;
if (have[0] < want[0]) { console.error(`MAJOR update available: ${label}. Read CHANGELOG.md before upgrading.`); process.exit(1); }
if (have.join('.') !== want.join('.')) { console.log(`Behind: ${label}. Not breaking.`); process.exit(0); }
console.log(`Up to date: ${label}`);
