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

// ---- Series colours (D23) ------------------------------------------------------------------------------------------------
// More than four series need more than hue: lightness spread, and a distance that holds for every kind of colour vision.
const series = [1, 2, 3, 4, 5, 6].map((i) => v(`series-${i}`));
const M = {
	normal: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
	protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
	deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
	tritan: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.3039]],
};
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function lab(hex, kind) {
	const l = [1, 3, 5].map((i) => lin(parseInt(hex.slice(i, i + 2), 16) / 255));
	const [R, G, B] = M[kind].map((r) => Math.min(1, Math.max(0, r[0] * l[0] + r[1] * l[1] + r[2] * l[2])));
	let X = 0.4124564 * R + 0.3575761 * G + 0.1804375 * B;
	const Y = 0.2126729 * R + 0.7151522 * G + 0.072175 * B;
	let Z = 0.0193339 * R + 0.119192 * G + 0.9503041 * B;
	const f = (x) => (x > 216 / 24389 ? Math.cbrt(x) : ((24389 / 27) * x + 16) / 116);
	X /= 0.95047; Z /= 1.08883;
	return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
}
const dE = (a, b, k) => Math.hypot(...lab(a, k).map((x, i) => x - lab(b, k)[i]));
const L = (h) => lab(h, 'normal')[0];
const seriesRows = [];
series.forEach((c, i) => seriesRows.push([`series-${i + 1}`, 'surface', UI, `Series ${i + 1} as a graphic`]));
for (const [fg, bg, min, label] of seriesRows) {
	const r = ratio(v(fg), v(bg));
	const ok = r >= min;
	if (!ok) failed++;
	console.log(`${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2).padStart(5)} (min ${min})  ${label}  [--${fg} on --${bg}]`);
}
function rule(ok, text, detail) {
	if (!ok) failed++;
	console.log(`${ok ? 'PASS' : 'FAIL'}  ${text}${detail ? '  ' + detail : ''}`);
}
let worst = Infinity;
for (let i = 0; i < series.length; i++) for (let j = i + 1; j < series.length; j++) for (const k of Object.keys(M)) worst = Math.min(worst, dE(series[i], series[j], k));
rule(worst >= 30, 'Series: every pair is delta E 30 or more for normal, protan, deutan and tritan vision', `(worst ${worst.toFixed(0)})`);
const firstThree = [L(series[0]), L(series[1]), L(series[2])].sort((a, b) => a - b);
rule(firstThree[1] - firstThree[0] >= 14 && firstThree[2] - firstThree[1] >= 14, 'Series: the first three differ by 14 L* or more', `(${firstThree.map((x) => x.toFixed(0)).join(' / ')})`);
let nb = Infinity;
for (let i = 0; i + 1 < series.length; i++) nb = Math.min(nb, Math.abs(L(series[i]) - L(series[i + 1])));
rule(nb >= 8, 'Series: neighbours differ by 8 L* or more', `(smallest ${nb.toFixed(0)})`);
const fine = css.match(/--target-size-fine:\s*([0-9.]+)rem/);
rule(!!fine && parseFloat(fine[1]) * 16 >= 24, 'Pointer-aware target is at least 24px (WCAG 2.5.8)', fine ? `(${parseFloat(fine[1]) * 16}px)` : '(missing)');

// ---- Heat scale (D28) ------------------------------------------------------------------------------------------------------
for (let i = 1; i <= 5; i++) {
	const r = ratio(v(`heat-on-${i}`), v(`heat-${i}`));
	rule(r >= TEXT, `Heat step ${i}: value text on its fill`, `(${r.toFixed(2)}, min ${TEXT})`);
}
for (const bg of ['surface', 'heat-1']) {
	const r = ratio(v('heat-border'), v(bg));
	rule(r >= UI, `Heat cell border on ${bg}`, `(${r.toFixed(2)}, min ${UI})`);
}
let heatNb = Infinity;
for (let i = 1; i < 5; i++) heatNb = Math.min(heatNb, L(v(`heat-${i}`)) - L(v(`heat-${i + 1}`)));
rule(heatNb >= 9, 'Heat: each step is at least 9 L* darker than the one before (order survives greyscale)', `(smallest ${heatNb.toFixed(1)})`);
let heatDe = Infinity;
for (let i = 1; i < 5; i++) for (const k of Object.keys(M)) heatDe = Math.min(heatDe, dE(v(`heat-${i}`), v(`heat-${i + 1}`), k));
rule(heatDe >= 10, 'Heat: neighbouring steps are delta E 10 or more for every kind of colour vision', `(smallest ${heatDe.toFixed(0)})`);

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
