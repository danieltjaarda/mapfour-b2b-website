import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--no-first-run", "--allow-file-access-from-files"], defaultViewport: { width: 1200, height: 630, deviceScaleFactor: 1 } });
const page = await browser.newPage();
await page.goto("file:///Users/daniel/mapfour-website/tools/og.html", { waitUntil: "networkidle0" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "/Users/daniel/mapfour-website/public/og.png" });
await browser.close();
console.log("og.png geschreven");
