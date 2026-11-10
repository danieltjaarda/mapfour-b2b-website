// Maakt per taal een schermafbeelding van de catalogus in het B2B Portal, voor de preview in de hero.
// Vereist: het portal draait (standaard http://localhost:3100) met de demo-gegevens.
// Gebruik: node tools/portal-shots.mjs            (uitvoer: public/images/portal/catalog-<taal>.webp)
// Inloggegevens: PORTAL_EMAIL / PORTAL_PASSWORD, anders het demo-klantaccount uit de README van het portal.
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const PORTAL = (process.env.PORTAL_URL ?? "http://localhost:3100").replace(/\/$/, "");
const OUT = process.env.OUT_DIR ?? "/Users/daniel/mapfour-website/public/images/portal";
const EMAIL = process.env.PORTAL_EMAIL ?? "inkoop@vandijk-installaties.nl";
const PASSWORD = process.env.PORTAL_PASSWORD ?? "welkom123";
const LOCALES = ["nl", "en", "de", "fr", "es", "zh", "el"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

fs.mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--no-first-run", "--hide-scrollbars"],
  defaultViewport: { width: 1120, height: 800, deviceScaleFactor: 2 },
});
const page = await browser.newPage();

// eenmalig inloggen
await page.goto(`${PORTAL}/taal/set?locale=nl&to=/login`, { waitUntil: "networkidle0" });
await page.type('input[name="email"]', EMAIL);
await page.type('input[name="password"]', PASSWORD);
await Promise.all([page.waitForNavigation({ waitUntil: "networkidle0" }), page.click('main form button[type="submit"]')]);
if (!page.url().endsWith("/portal")) throw new Error("Inloggen in het portal is niet gelukt: " + page.url());

for (const locale of LOCALES) {
  await page.goto(`${PORTAL}/taal/set?locale=${locale}&to=/portal`, { waitUntil: "networkidle0" });
  await sleep(1200); // intrede-animaties laten uitspelen
  // staffel zichtbaar maken op de eerste kaart (alleen in de browser, er wordt niets opgeslagen)
  const chips = await page.$$("article:first-of-type button[title]");
  if (chips[1]) await chips[1].click();
  await sleep(400);
  // ontwikkelindicator van Next.js verbergen
  await page.evaluate(() => document.querySelectorAll("nextjs-portal").forEach((n) => n.remove()));
  const file = path.join(OUT, `catalog-${locale}.webp`);
  await page.screenshot({ path: file, type: "webp", quality: 84 });
  console.log(`${locale}: ${path.basename(file)} ${(fs.statSync(file).size / 1024).toFixed(0)} KB`);
}

// uitloggen zodat er geen sessie achterblijft
await page.goto(`${PORTAL}/taal/set?locale=nl&to=/portal`, { waitUntil: "networkidle0" });
const out = await page.$('aside form button[type="submit"]');
if (out) await Promise.all([page.waitForNavigation({ waitUntil: "networkidle0" }), out.click()]);
await browser.close();
