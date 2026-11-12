# Forslag til ny K5 (Design) i `platform-conventions.md`

Dette afløser K5 i `hsk-dk/dashboard/docs/platform-conventions.md`. Nuværende K5 siger, at kun tokens deles, og at ingen kode deles. Det er for snævert, når delt kode giver en klar fordel og kan holdes uafhængig.

## Forslag

| Aftale | Indhold |
|---|---|
| Kilde | Repoet `hsk-dk/useful-design`. Det er den eneste kilde til designtokens og fælles CSS. Useful-sitesene (`useful.dk`, `clean.useful.dk`, `auth.useful.dk`) er referencer, ikke kilde. |
| Delt | **Tokens** (CSS-variabler) og **framework-neutrale CSS-komponentklasser** (`u-`-præfiks) i én fil: `dist/useful.css`. Tilgængelige HTML-opskrifter. |
| Ikke delt | JavaScript-komponenter i et bestemt framework (Svelte, React, Angular). Hver app vælger sin stak frit. |
| Uafhængighed | En app **fastlåser en version** af `useful.css` (kopieret ind eller peget på et tag) og opgraderer, når den vil. Aldrig "nyeste" ved kørsel. En fejl i en ny version rammer ingen andre apps. |
| Ændringer | En ændring af et token kræver, at `scripts/check-contrast.mjs` består, og en post i `CHANGELOG.md`. Brydende ændringer øger hovedversionen. |
| Sprog | Dansk brugerflade. Kode og teknisk dokumentation må være engelsk. |
| Tilgængelighed | WCAG 2.2 AA, synligt tastaturfokus, `prefers-reduced-motion`, fra 320 px. |

## Hvorfor ændringen

- Tre af fire apps bruger forskellige teknologier, så delte JS-komponenter ville kun passe til én. CSS-klasser virker alle steder uden build.
- Kontrastfejl og afvigelser (to apps består ikke AA i dag) blev opdaget først ved sammenligning. Én kilde med en automatisk kontrolkørsel forhindrer, at det sker igen.
- Princip 2 ("ingen delt kode, delt tilstand eller fælles udgivelse") er bevaret i sin hensigt: hvert projekt kan stadig bygges, opdateres og rulles tilbage alene, fordi versionen er fastlåst.

## Ændring i princip 2

> Før: Ingen delt kode, delt tilstand eller fælles udgivelse.
> Efter: Ingen delt **kørsel** eller tilstand. Delt kode er tilladt, når den er framework-neutral, versioneret og fastlåst i hver app.
