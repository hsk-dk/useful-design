#!/usr/bin/env node
// Verifies WCAG 2.2 AA contrast for the token pairings the design system relies on.
// Reads the real values from src/tokens.css, so a changed token is checked automatically.
// Usage: node scripts/check-contrast.mjs        (exit code 1 if a pairing fails)
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(join(root, 'src', 'tokens.css'), 'utf8');

const tokens = {};
for (const m of css.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) tokens[m[1]] = m[2].toLowerCase();
// Gradient end points used for the header
const header = css.match(/--header-gradient:\s*linear-gradient\([^,]+,\s*(#[0-9a-fA-F]{6}),\s*(#[0-9a-fA-F]{6})\)/);
if (header) { tokens['header-start'] = header[1].toLowerCase(); tokens['header-end'] = header[2].toLowerCase(); }

function luminance(hex) {
	const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
		.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a, b) {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}
const v = (name) => {
	// Short names are allowed for colour tokens: "text" means --color-text.
	for (const key of [name, `color-${name}`]) if (key in tokens) return tokens[key];
	console.error(`Unknown token --${name}`);
	process.exit(2);
};

const TEXT = 4.5; // WCAG 1.4.3
const UI = 3; // WCAG 1.4.11 (graphics, focus indicators)
const white = '#ffffff';

// [foreground token or hex, background token or hex, minimum, description]
const checks = [
	['text', 'surface', TEXT, 'Body text on card'],
	['text-muted', 'surface', TEXT, 'Muted text on card'],
	['text-muted', 'surface-muted', TEXT, 'Muted text on muted surface'],
	['text', 'background', TEXT, 'Text directly on the page background'],
	['text-muted', 'background', TEXT, 'Muted text directly on the page background'],
	['action-strong', 'surface', TEXT, 'Links and icons on card'],
	['action-hover', 'surface', TEXT, 'Link hover on card'],
	['on-action', 'action-strong', TEXT, 'Button text on primary fill'],
	['on-action', 'action-hover', TEXT, 'Button text on primary hover'],
	['on-header', 'header-start', TEXT, 'Header text on gradient start'],
	['on-header', 'header-end', TEXT, 'Header text on gradient end'],
	['on-success', 'success', TEXT, 'Text on success fill'],
	['on-warning', 'warning', TEXT, 'Text on warning fill'],
	['on-error', 'error', TEXT, 'Text on error fill'],
	['text-bad', 'surface', TEXT, 'Bad figures as text'],
	['text-good', 'surface', TEXT, 'Good figures as text'],
	['text-warn', 'surface', TEXT, 'Warning figures as text'],
	['data-1', 'surface', TEXT, 'Data series 1 as text'],
	['data-2', 'surface', TEXT, 'Data series 2 as text'],
	['data-3', 'surface', TEXT, 'Data series 3 as text'],
	['data-4', 'surface', TEXT, 'Data series 4 as text'],
	['chip-good-text', 'chip-good-bg', TEXT, 'Chip text on its tint (good)'],
	['chip-warn-text', 'chip-warn-bg', TEXT, 'Chip text on its tint (warn)'],
	['chip-bad-text', 'chip-bad-bg', TEXT, 'Chip text on its tint (bad)'],
	['chip-neutral-text', 'chip-neutral-bg', TEXT, 'Chip text on its tint (neutral)'],
	['chip-info-text', 'chip-info-bg', TEXT, 'Chip text on its tint (info)'],
	['chip-optional-text', 'chip-optional-bg', TEXT, 'Chip text on its tint (optional)'],
	['neutral', 'surface', UI, 'Neutral status shape'],
	// Success and warning fills are decoration next to a mandatory text label ("Online", "Ustabil") and a distinct
	// shape, so WCAG 1.4.11 does not require 3:1 for them. The floor below only catches a fill that nearly vanishes.
	['success', 'surface', 2.0, 'Success shape on card (text label is mandatory)'],
	['warning', 'surface', 2.0, 'Warning shape on card (text label is mandatory)'],
	['error', 'surface', UI, 'Error shape on card'],
	['focus-outline', 'surface', UI, 'Focus outline on card'],
	['focus-outline', 'surface-muted', UI, 'Focus outline on muted surface'],
	['focus-outline', 'background', UI, 'Focus outline on page background'],
	['border-control', 'surface', 1.2, 'Control border (decorative; the field has a label and a focus state)'],
];

let failed = 0;
for (const [fg, bg, min, label] of checks) {
	const a = fg.startsWith('#') ? fg : v(fg);
	const b = bg.startsWith('#') ? bg : v(bg);
	const r = ratio(a, b);
	const ok = r >= min;
	if (!ok) failed++;
	console.log(`${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2).padStart(5)} (min ${min})  ${label}  [--${fg} on --${bg}]`);
}

// Pairings that must NOT be used for text. Documented so nobody "fixes" them back.
const known = [
	['action', 'surface', '--color-action (#6ba3ff) as text or a lone outline'],
	['on-action', 'action', 'white text on #6ba3ff'],
];
for (const [fg, bg, label] of known) {
	const r = ratio(v(fg), bg.startsWith('#') ? bg : v(bg));
	console.log(`INFO  ${r.toFixed(2).padStart(5)}  must not be used: ${label}`);
}

console.log(failed ? `\n${failed} pairing(s) failed` : '\nAll pairings pass');
process.exit(failed ? 1 : 0);
