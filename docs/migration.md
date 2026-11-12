# Migrering pr. app

En app er migreret, når den bruger `useful.css` (eller tokens) uden enkeltstående farver, og tjeklisten nederst er opfyldt. Rækkefølgen er vejledende, og hver app kan tage det i eget tempo (se README om fastlåsning af version).

## Running (React, `frontend/src`)

- [ ] Kopiér `dist/useful.css` ind, importér den i `main.tsx` og sæt klassen `u-page` på `body`. Peg `--u-background-image` på en lokal fil.
- [ ] Flyt de indlejrede farver i `App.tsx`, `AdminPage.tsx`, `OverviewPage.tsx`, `ActivitiesPage.tsx`, `PlanPage.tsx` og `AiSuggestionsPage.tsx` til tokens.
- [ ] Topbjælke: gradienten `#5D8FD9 → #6EA0EB` → `--header-gradient` (`.u-header`).
- [ ] Primære knapper: gradienten `#9DC0FF → #446EA8` → `.u-btn--primary`.
- [ ] Dæmpet tekst: `#64748B`, `#475569` og `#6B7280` → `--color-text-muted` (`#425061`).
- [ ] Kort: 10 px → 14 px (`.u-card`). Statiske kort mister tung skygge.
- [ ] Baggrundsbillede: hentes i dag fra `auth.useful.dk`; server det lokalt.
- [ ] Diagrammer (Recharts): serie 1 i `--data-1`, ændringer med `.u-delta`.
- [ ] Tal i nøgletal og tabeller: `.u-num`.

## SparkSpend (PHP, Bootstrap 5.3, `includes/style.css`)

- [ ] Header: `--brand-dark` `#1A2635` → `--header-gradient`.
- [ ] `.btn-primary`: flad `#6BA3FF` med hvid tekst (2,53 til 1) → `#446EA8`.
- [ ] Stigning/fald som tekst: `#EF4444` og `#22C55E` → `--text-bad` og `--text-good`. Farven følger, om "op" er godt for målet (pris op er dårligt).
- [ ] `.dashboard-card` 16 px og `.card` 14 px → 14 px.
- [ ] Behold de Bootstrap-variabler, der allerede er fastlåst (`--bs-body-color`, radier), og tilføj tokens ved siden af.
- [ ] Trendgrafer (Chart.js): `#6BA3FF` → `--data-fill` til søjler, `--data-1` til tekst.
- [ ] `prefers-reduced-motion` findes allerede. Behold.

## Homelab-portalen (SvelteKit, `src/lib/styles/tokens.css`)

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
