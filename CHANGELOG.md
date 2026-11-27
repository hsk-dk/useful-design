# Changelog

## 0.6.0 (udkast)

Ny mindre version. Ingen brydende ændringer: alt nyt er valgfrit.

- Nye tokens `--heat-1` til `--heat-5`, `--heat-on-1` til `--heat-on-5`, `--heat-border` og `--heat-none` (D28): varmeskala til matricer og kalendere.
- Nye klasser `u-heat`, `u-heat--1…5` og `u-heat--none` (skraveret "ingen værdi"). Størrelsen følger `u-pointer-aware` (D25).
- Kontrastkontrollen tester tekst på hvert trin, kanten, lysstyrketrin og farveblinde-afstand.
- Ny beslutning D28 og et afsnit om varmeskala i `docs/charts.md`.

## 0.5.0

Ny mindre version. Ingen brydende ændringer: alt nyt er valgfrit.

- Ny valgfri modifikator `u-card--spotlight` (D27): et blødt lys følger markøren over kortet. Kun pynt, kun med `hover: hover`. Eksempel i README.
- README og `docs/migration.md` har den faktiske status for Running, SparkSpend og portalen.

## 0.4.0

Ny mindre version, fra SparkSpends overgang til pakken. Ingen brydende ændringer: alt nyt er tilføjet, og ingen app ændrer sig uden at vælge det.

- Nye tokens `--series-1` til `--series-6` (D23): datafarver til flere end fire serier, trinnet i lysstyrke. Kontrastkontrollen tester 3:1 mod hvid, delta E 30 parvis for fire slags farvesyn, 14 L* mellem de tre første og 8 L* mellem naboer.
- Nyt token `--target-size-fine` (36 px) og valgfri klasse `u-pointer-aware` (D25): klikmål 36 px med mus og 44 px med finger (`pointer: coarse`). Uden klassen er alt som før (D21).
- Ny `docs/charts.md` (D23, D24, D26): markørform pr. serie, domænefarver mod årsserier, tekstalternativ til diagrammer med kode, og spring-til-indhold.
- Nye beslutninger D23 til D26. Stilguiden viser seriefarverne og nævner `u-pointer-aware`.

## 0.3.0

Ny mindre version, samlet fra homelab-portalens overgang til pakken. Ingen brydende ændringer: alt nyt er tilføjet, og eksisterende klasser virker som før.

- Ny logoudgave: `assets/useful-logo-light.svg` (hvid) til den blå header.
- Ny modifikator `u-header__nav--tabbar`: primær navigation bliver en bundtabbar på telefon (D9). Frivillig, så en eksisterende header ikke ændrer sig.
- Ny `u-card__action` til et sekundært link i et interaktivt kort. Kun linkets eget område er klikbart, mens `u-card--interactive a::after` stadig strækker det primære link.
- Ny komponent `u-loading` (spinner og tekst, til `role="status"`). Bevægelsen følger reduced-motion-reglen.
- Ny `u-notice--info`, og `u-notice__level` har layout til et ikon eller en form.
- Migreringsplanen advarer om, at `.u-page` ændrer tekststørrelse og linjehøjde (D10).
- README: Running og homelab-portalen bruger pakken.

## 0.2.0

Ny mindre version. Ingen brydende ændringer.

- Nye tokens: `--text-warn` og seks sæt mærkefarver (`--chip-{good,warn,bad,neutral,info,optional}-{bg,border,text}`).
- Ny komponent: `u-chip` med varianterne `--good`, `--warn`, `--bad`, `--info` og `--optional` (neutral er standard).
- Kontrastkontrollen tester nu også mærkerne og `--text-warn`.
- Nye beslutninger D20 (mærker), D21 (alle knapper mindst 44 px) og D22 (`--text-warn`).

## 0.1.0 (udkast)

Første samling af Useful-designsystemet.

- Tokens: godkendte tokens fra dashboardet (2026-10-01), udvidet med typeskala, fokus-outline, appheader-gradient, datafarver, tekstfarver til godt/dårligt, tre indholdsbredder, bevægelse og kortskygge.
- Komponenter (`u-`-præfiks): `u-page`, `u-container`, `u-panel`, `u-header`, `u-btn`, `u-tabs`/`u-tab`, `u-card`, `u-tile`, `u-status`, `u-badge`, `u-notice`, `u-field`, `u-skeleton`, `u-empty`, `u-delta` og typografi- og layouthjælpere.
- Stilguide med levende eksempler (`docs/index.html`).
- Kontrastkontrol (WCAG 2.2 AA) af alle token-parringer og automatisk kontrol af, at `dist` er opdateret.
- 19 designbeslutninger (`docs/decisions.md`), migreringsplan pr. app og forslag til ny K5.
