# useful-design

Fælles designsystem for Useful-apps: **tokens**, **framework-neutrale CSS-komponenter** og **stilguiden**. Formålet er, at Running, Homelab-portalen, SparkSpend og clean.useful.dk ser ud og opfører sig som samme familie, uden at de skal bruge den samme teknologi.

> Status: **udkast 0.2.0.** Beslutningerne er truffet ud fra en gennemgang af de fire apps (se `docs/decisions.md`), men ingen app er migreret endnu.

## Hvad der er her

| Mappe / fil | Indhold |
|---|---|
| `dist/useful.css` | **Den fil, apps tager i brug.** Tokens, basisstil og komponenter i én fil med versionsbanner. Genereres, redigér den ikke. |
| `src/` | Kilden: `tokens.css`, `base.css`, `components.css`. |
| `docs/index.html` | Stilguiden med levende eksempler og kopierbar HTML. |
| `docs/decisions.md` | De 22 designbeslutninger med begrundelse og konsekvens for hver app. |
| `docs/migration.md` | Tjekliste pr. app. |
| `docs/k5-forslag.md` | Forslag til ny konvention K5 i dashboardets `platform-conventions.md`. |
| `scripts/` | `build.mjs` (samler filen), `check-contrast.mjs` (WCAG 2.2 AA), `check-version.mjs` (er en app bagud?). |
| `assets/` | Baggrundsfoto og logoer. |

## Sådan tager en app den i brug

1. Kopiér `dist/useful.css` ind i appen (eller peg på et tag). **Lås versionen:** første linje bærer `useful-design vX.Y.Z`.
2. Sæt `class="u-page"` på `<body>` og peg `--u-background-image` på en fil, der ligger i appen. Hent den ikke fra en anden vært.
3. Brug tokens (`var(--color-text)` osv.) og `u-`-klasserne. Ingen enkeltstående farver, skygge, radier eller afstande, hvor et token findes.
4. Har appen et framework som Bootstrap, så lad tokens stå ved siden af, og fastlås frameworkets egne variabler.
5. Kør `node scripts/check-version.mjs din/useful.css` for at se, om du er bagud.

Eksempel:

```html
<link rel="stylesheet" href="/css/useful.css">
<body class="u-page" style="--u-background-image: url('/img/background.jpg')">
  <header class="u-header"> … </header>
  <main class="u-container">
    <div class="u-card"><h2 class="u-card__title">Titel</h2></div>
  </main>
</body>
```

## Hvad der deles, og hvad der ikke gør

- **Deles:** tokens og CSS-klasser (`u-`-præfiks), HTML-opskrifter og tilgængelighedsregler.
- **Deles ikke:** JavaScript-komponenter i et bestemt framework. Hver app vælger sin stak frit (i dag SvelteKit, React, PHP med Bootstrap og ren HTML). Et komponentbibliotek i ét framework passer kun til én app.
- **Uafhængighed:** hver app fastlåser en version og opgraderer, når den selv vil. En fejl i en ny version rammer ingen andre. Se `docs/k5-forslag.md`.

## Versionering

Semantisk versionering: **patch** for rettelser, **minor** for nye tokens eller klasser, **major** for brydende ændringer (omdøbte eller fjernede tokens/klasser, ændrede betydninger). Hver ændring kommer i `CHANGELOG.md`. Udgiv en version ved at sætte et tag (`v0.1.0`).

## Ændringer

1. Redigér i `src/`.
2. `npm run build` (eller `node scripts/build.mjs`) samler `dist/useful.css` og `docs/useful.css`.
3. `npm run check` bygger i kontroltilstand og kører kontrastkontrollen. CI gør det samme og fejler, hvis `dist` er forældet eller en parring ikke består.
4. Opdatér `CHANGELOG.md`. Brydende ændring øger hovedversionen.

Kræver Node 20 eller nyere og ingen pakker.

## Hvad der ikke er med endnu

- **Web Components** til header og brugermenu, hvor to apps har brug for samme adfærd. De virker på tværs af frameworks, men koster ved server-rendering i SvelteKit og i React 18. De tages først med, når behovet er dokumenteret.
- **Fælles ikonsæt.** Beslutning D14 siger kun, hvordan ikoner skal bygges.
- **Mørk tilstand.** Er ikke en del af Useful-udtrykket.
- **Logo og baggrund** er kopieret fra SparkSpends `images/`. Bekræft, at de er de rigtige originaler.

## Kilder

Samlet fra `dashboard` (designguide, inventar, godkendte tokens og konvention K5), `SparkSpend` (`includes/style.css`), `clean-text` (clean.useful.dk) og `running-app` (frontend).
