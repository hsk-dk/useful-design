# Migrering pr. app

En app er migreret, når den bruger `useful.css` (eller tokens) uden enkeltstående farver, og tjeklisten nederst er opfyldt. Rækkefølgen er vejledende, og hver app kan tage det i eget tempo (se README om fastlåsning af version).

## Running (React, `frontend/src`)

*Status: pakken er i brug, men fastlåst på v0.2.0 (nu: v0.4.0). Mange indlejrede farver i `src/pages` er flyttet til tokens; canvas og SVG-plakater (`FlightMap`, `ShareCard`, `AreaPosters`, `YearPlayback`, `ContactSheet`) har stadig hex, fordi de ikke kan læse CSS-variabler direkte. Afkryds nedenfor kun det, der er kontrolleret i appen.*

- [ ] Kopiér `dist/useful.css` ind, importér den i `main.tsx` og sæt klassen `u-page` på `body`. Peg `--u-background-image` på en lokal fil.
- [ ] Flyt de indlejrede farver i `App.tsx`, `AdminPage.tsx`, `OverviewPage.tsx`, `ActivitiesPage.tsx`, `PlanPage.tsx` og `AiSuggestionsPage.tsx` til tokens.
- [ ] Topbjælke: gradienten `#5D8FD9 → #6EA0EB` → `--header-gradient` (`.u-header`).
- [ ] Primære knapper: gradienten `#9DC0FF → #446EA8` → `.u-btn--primary`.
- [ ] Dæmpet tekst: `#64748B`, `#475569` og `#6B7280` → `--color-text-muted` (`#425061`).
- [ ] Kort: 10 px → 14 px (`.u-card`). Statiske kort mister tung skygge.
- [ ] Baggrundsbillede: hentes i dag fra `auth.useful.dk`; server det lokalt.
- [ ] Diagrammer (Recharts): serie 1 i `--data-1`, ændringer med `.u-delta`.
- [ ] Tal i nøgletal og tabeller: `.u-num`.
- [ ] Status- og kategorimærker: `u-chip` med varianter (D20).
- [ ] Alle knapper mindst 44 px (D21): ingen knapper på 11 til 13 px.

## SparkSpend (PHP, Bootstrap 5.3, `includes/style.css`)

*Gjort 2026-11-21 (v0.4.0): trin 1 til 8 i SparkSpends `BACKLOG.md`. Tjeklisten nedenfor er den oprindelige; afkryds kun efter at have kontrolleret mod appen.*

- [ ] Header: `--brand-dark` `#1A2635` → `--header-gradient`.
- [ ] `.btn-primary`: flad `#6BA3FF` med hvid tekst (2,53 til 1) → `#446EA8`.
- [ ] Stigning/fald som tekst: `#EF4444` og `#22C55E` → `--text-bad` og `--text-good`. Farven følger, om "op" er godt for målet (pris op er dårligt).
- [ ] `.dashboard-card` 16 px og `.card` 14 px → 14 px.
- [ ] Behold de Bootstrap-variabler, der allerede er fastlåst (`--bs-body-color`, radier), og tilføj tokens ved siden af.
- [ ] Trendgrafer (Chart.js): `#6BA3FF` → `--data-fill` til søjler, `--data-1` til tekst.
- [ ] `prefers-reduced-motion` findes allerede. Behold.

## Alle apps: brandlaget (D31, v0.7.0)

- [ ] Header: `u-header` → `u-header u-header--night`, og brand-linket bliver et `u-wordmark` med `u-wordmark__mark`, `u-wordmark__name` (USEFUL) og `u-wordmark__app` (appnavnet).
- [ ] Footer: `u-footer` med ordmærket, taglinen og et link til useful.dk.
- [ ] Kroppen beholdes: foto, `u-panel` og `u-card`. `u-hero` kun på en forside.
- [ ] Overlap: gjort 2026-11-27.

## Overlap (SvelteKit)

*Gjort 2026-11-27 (v0.7.0): bruger kun tokens og `u-`-klasser, med natblå header, ordmærke, footer og hero på startsiden. Fastlåst med version og checksum i `package.json`.*

## Alle apps: tekststørrelse

- [ ] `.u-page` sætter 14 px og linjehøjde 1,6 på `body` (D10). Det ændrer en apps eksisterende tekst. Tjek siderne bagefter, eller sæt `font-size` og `line-height` på `.u-page` midlertidigt, mens komponenterne flyttes over.

## Homelab-portalen (SvelteKit, `src/lib/styles/tokens.css`)

*Gjort 2026-11-16 (v0.2.0): tokens, baggrund, fokus, komponenter, header og navigation. Se portalens `docs/design-adoption-plan.md`.*

- [ ] Erstat `tokens.css` med tokens fra `dist/useful.css` (nye: header, fokus, data, tekstfarver, skala, bredder).
- [ ] Header: hvid → `.u-header` (dyb blå), logo og titel bevares.
- [ ] Fokus: `outline` i `--color-focus-outline`, ikke kun glød.
- [ ] `--content-width`: tokenet er 960 px, mens inventaret siger 800 px. Brug `--content-width` (960) som standard.
- [ ] Faner (`DashboardTabs`) bliver sekundære faner (`.u-tab`). Primær navigation flytter til headeren.
- [ ] Skygge: kun klikbare tjenestekort får `--shadow-small`. Statiske kort får `--shadow-card`.
- [ ] Behold `tokens.contrast.test.ts` eller erstat den med `scripts/check-contrast.mjs`.

## clean.useful.dk (`clean-text`)

- [ ] `.primary-btn`: gradient → flad `#446EA8`.
- [ ] Baggrundsbillede hentes fra `auth.useful.dk`; server lokalt.
- [ ] Grå tekstfarver (`#6B7280`, `#4B5563`) til brødtekst → `--color-text-muted`.
- [ ] Appen har ingen header og får heller ingen. Den bruger `.u-container--narrow` (800 px).

## Tjekliste for en migreret skærm

- [ ] Ingen enkeltstående farver, skygger, radier eller afstande, hvor et token findes
- [ ] Fungerer ved 320 px uden vandret scroll
- [ ] Alt kan nås med tastatur, og fokus er synligt
- [ ] Klikmål mindst 44 px
- [ ] Status har tekst, form og farve
- [ ] Tomme, indlæsende, fejl- og forældede tilstande er designet
- [ ] `prefers-reduced-motion` respekteres
- [ ] Tekstkontrast mindst 4,5 til 1 (kør `node scripts/check-contrast.mjs` for tokens)
