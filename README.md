# MapFour B2B · website

De publieke website voor dealers: assortiment, dealerprogramma, aanvraagformulier en doorklik naar het B2B Portal.
Dit is een **apart project**, los van de webapplicatie in `~/mapfour-b2b` (het portal). De twee delen alleen een link: de knop "Inloggen" opent het portal in de taal van de bezoeker.

Stack: Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript. Geen database.

## Starten

```bash
export PATH="$HOME/.local/node/bin:$PATH"   # node 22 staat hier op deze Mac
cd ~/mapfour-website
npm install            # eenmalig
npm run dev            # http://localhost:3200
```

Productie: `npm run build && npm start` (ook poort 3200).

Het portal draait apart op poort 3100 (`cd ~/mapfour-b2b && npm run dev`). De website werkt ook zonder draaiend portal; alleen de inlogknop heeft het nodig.

## Instellingen (omgevingsvariabelen)

| Variabele | Standaard | Waarvoor |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3200` | Publiek adres van de website (sitemap, canonical, hreflang, deelafbeelding) |
| `NEXT_PUBLIC_PORTAL_URL` | `http://localhost:3100` | Adres van het B2B Portal voor de inlogknoppen |
| `LEAD_WEBHOOK_URL` | leeg | Optioneel: aanvragen doorsturen naar een webhook (Slack, Make, Zapier, eigen API) |

Zet ze in `.env.local` of in de hostingomgeving.

## Pagina's

Alle pagina's bestaan in zeven talen onder `/<taal>/…` (`nl`, `en`, `de`, `fr`, `es`, `zh`, `el`). `/` stuurt door naar de taal van de browser (anders Engels).

| Pad | Inhoud |
| --- | --- |
| `/<taal>` | Home: donkere hero met aanmeldformulier (2 stappen) en gekantelde portal-preview, assortiment, techniek, dealerprogramma, portal, stappen, kerncijfers, store, FAQ |
| `/<taal>/models` | Alle zeven modellen met filter en kleurkiezer |
| `/<taal>/models/<model>` | Modelpagina: kleuren, extra aanzichten (voor, achter, opgevouwen), kerncijfers, hoogtepunten, beelden, specificaties |
| `/<taal>/accessories` | Accessoires |
| `/<taal>/dealers` | Dealerprogramma en aanvraagformulier (`#aanvraag`) |
| `/<taal>/about`, `/contact`, `/privacy` | Over MapFour, contactformulier, privacyverklaring |
| `/sitemap.xml`, `/robots.txt` | Voor zoekmachines, met hreflang per taal |

## Vormgeving in het kort

- **Kop**: donker, met alleen het logo en een blauwe knop "Inloggen". Er staat bewust geen navigatie in; die loopt via de pagina zelf en de voettekst. Daarboven een smalle balk naar de consumentensite.
- **Taal wisselen**: zwevende knop aan de rechterrand (`FloatingLanguage`) en taallinks in de voettekst.
- **Titels**: zonder labeltje erboven (`SectionHeading` heeft daar geen optie meer voor).
- **Hero** (`src/app/[locale]/page.tsx`): links de titel met daaronder `HeroPreview`, rechts `HeroSignup`.
  De preview is een echte schermafbeelding van het portal per taal (`public/images/portal/catalog-<taal>.webp`), gekanteld met `rotate(-5.5deg) skewX(9deg)`.
  Opnieuw maken na een wijziging in het portal: `node tools/portal-shots.mjs` (het portal moet draaien).

## Waar pas je wat aan

- **Bedrijfs- en contactgegevens, socials, portal-URL**: `src/config/site.ts`. Deze gegevens komen van mapfour.com (contact, impressum); controleer ze voordat de site live gaat.
- **Teksten**: `src/i18n/<taal>.ts`. Nederlands (`nl.ts`) is de bron; TypeScript geeft een fout als een andere taal een sleutel mist.
- **Modellen, specificaties, adviesprijzen, kleuren**: `src/data/models.ts`. Waarden zijn taalneutraal; woorden tussen `{accolades}` worden vertaald via `specs.values` in de taalbestanden.
- **Beelden**: `public/images/` (sfeer), `public/images/bikes/` (vrijstaande fietsen, ook `…-front`, `…-rear` en `…-folded` voor de extra aanzichten), `public/images/details/`, `public/images/portal/` (hero-preview). Een deel komt uit de map met officiële MapFour-foto's (studio-opnames van Ray en Loop); de achtergrond is verwijderd met `~/mapfour-b2b/tools/bgremove.swift`.
- **Stijl en animaties**: `src/app/globals.css` (merkkleur `#52B5C4`, squircle-hoeken, scroll-reveal).

## Aanvragen en contactberichten

De formulieren posten naar `src/app/api/aanvraag/route.ts`. Elke inzending wordt:

1. gecontroleerd (verplichte velden, e-mailadres, toestemming, honeypot tegen bots, maximaal 5 per 10 minuten per IP-adres);
2. opgeslagen als één JSON-regel in `data/aanvragen.jsonl`;
3. doorgestuurd naar `LEAD_WEBHOOK_URL`, als die is ingesteld.

Bekijken: `cat data/aanvragen.jsonl` (of open het bestand in een editor).

**Let op bij serverless hosting (Vercel):** het bestandssysteem is daar niet blijvend. Stel dan `LEAD_WEBHOOK_URL` in, anders gaan aanvragen verloren. Op een eigen server of VPS werkt het bestand gewoon.

## Hulpmiddelen (`tools/`)

Niet nodig om de site te draaien. Ze gebruiken headless Chrome via `puppeteer-core` (`npm i -D puppeteer-core`).

- `tools/portal-shots.mjs` – maakt de portal-schermafbeeldingen voor de hero, in alle zeven talen.
- `tools/img.mjs` – zet foto's om naar WebP en snijdt transparante randen weg (`node tools/img.mjs jobs.json`).
- `tools/og.html` + `tools/og.mjs` – maakt de deelafbeelding `public/og.png` (1200×630).

## Online zetten

Het project draait overal waar Next.js draait. Voor Vercel: importeer de map, zet de drie omgevingsvariabelen en koppel het domein. Zet `NEXT_PUBLIC_PORTAL_URL` op het echte adres van het portal.
