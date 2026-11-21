# Diagrammer

Gælder alle apps med diagrammer. Erfaringerne er fra SparkSpend, hvor reglerne er afprøvet mod rigtige produktionsdata. Kravene i D23 kontrolleres af `scripts/check-contrast.mjs`.

## Farver: hvilke og hvornår (D12, D23, D24)

| Situation | Brug |
|---|---|
| Op til fire serier med fast betydning (fx "mine løb", "min varmepumpe") | `--data-1` til `--data-4`. Første serie er altid blå. De kan stå som tekst. |
| Mere end fire serier, fx ét år pr. linje, eller mange kategorier | `--series-1` til `--series-6`, i rækkefølge. Kun til linjer og flader, ikke til tekst. |
| Et fortløbende tidsforløb (år, uger) som serie | `--series-*`. Genbrug ikke domænefarverne som identitet, for hvis et år også er blåt, læses det som "mit løb" eller "EV". |

Hvorfor lysstyrke og ikke kun farvetone: de fire `--data-*` har næsten samme lysstyrke, så for en, der ser kontrast frem for farvetone (fx rød-grøn-farveblind), bliver naboer til samme gråtone. `--series-*` er trinnet i lysstyrke og har også delta E 30 parvis under fire slags farvesyn. Det blev først opdaget med rigtige data: SparkSpends første seks årsfarver bestod en ren afstandskontrol, men marineblå og mørk rød havde samme lysstyrke.

Paletten har seks farver og er kun målt for seks. Har et diagram flere serier, så vis de seks vigtigste (fx de nyeste år) eller brug et lille diagram pr. serie.

## Markørform pr. serie (D11, D23)

Farve alene bærer aldrig en serie. Linjer får et punkt i denne rækkefølge: cirkel, trekant, firkant, rombe, kryds, stjerne (Chart.js: `circle`, `triangle`, `rect`, `rectRot`, `crossRot`, `star`). Det samme gælder forklaringen: markøren står ved siden af farven.

```js
const SERIES_COLORS = ['--series-1', '--series-2', '--series-3', '--series-4', '--series-5', '--series-6']
  .map((n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim());
const SERIES_POINTS = ['circle', 'triangle', 'rect', 'rectRot', 'crossRot', 'star'];
datasets.forEach((ds, i) => { ds.borderColor = SERIES_COLORS[i]; ds.pointStyle = SERIES_POINTS[i]; ds.pointRadius = 4; });
```

## Tekstalternativ (D26)

Et diagram er tavst for en skærmlæser. Giv hvert diagram `role="img"` og en `aria-label` med: titel, art, antal punkter og for hver serie laveste, højeste og seneste værdi. Cirkeldiagrammer siger hver skives andel.

Regler, der blev rettet efter fejl:

- **Manglende værdi er ingen værdi.** `Number(null)` er 0, og så læses et hul som et rekordlavt punkt. Filtrér `null` og `undefined` fra, før du tager min og maks.
- **Andele summer til 100.** Afrund med størst-rest-metoden, ellers står der 33 %, 33 %, 33 %.
- **Et ufuldstændigt år er ikke "laveste".** Skriv "hidtil" eller udelad det fra laveste og højeste, ellers fortæller teksten, at året var rekordlavt.
- **Sparklines** har punkter 0, 1, 2. Det er ikke et interval, der er værd at læse op.
- Hold teksten under cirka 480 tegn.

Én global plugin gør, at et diagram, der laves i morgen, også har teksten (Chart.js):

```js
function chartText(title, labels, datasets) {
  const nums = (ds) => ds.data.filter((v) => v !== null && v !== undefined).map(Number).filter(Number.isFinite);
  const fmt = (v) => new Intl.NumberFormat('da-DK', { maximumFractionDigits: 1 }).format(v);
  const parts = datasets.slice(0, 6).map((ds) => {
    const n = nums(ds);
    if (!n.length) return `${ds.label}: ingen værdier`;
    return `${ds.label}: laveste ${fmt(Math.min(...n))}, højeste ${fmt(Math.max(...n))}, seneste ${fmt(n[n.length - 1])}`;
  });
  return `${title}. Kurvediagram med ${labels.length} punkter. ${parts.join('. ')}.`;
}
Chart.register({
  id: 'a11yLabel',
  afterUpdate(chart) {
    chart.canvas.setAttribute('role', 'img');
    chart.canvas.setAttribute('aria-label', chartText(chart.canvas.dataset.a11yTitle || 'Diagram', chart.data.labels, chart.data.datasets));
  },
});
```

Diagrammer, der er en div fuld af SVG (fx ApexCharts), læses brik for brik. Sæt `role="img"` og en `aria-label` på beholderen.

## Spring til indhold og overskrifter (D26)

- `u-skip-link` er første stop i tabrækkefølgen. Flytter appen siden i `#hash` (en router), så fang klikket og sæt fokus på `<main tabindex="-1">` uden at ændre adressen.
- Ét skjult `h2` (`u-visually-hidden`) pr. visning og kortenes titler som `h3`, så rækkefølgen er h1, h2, h3.
- Navngiv menuer (`aria-label`), markér valgt side med `aria-current="page"` og knapper, der slår en visning eller serie til og fra, med `aria-pressed`.
