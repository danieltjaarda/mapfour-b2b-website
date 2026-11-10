// Zet afbeeldingen om naar WebP via de canvas-encoder van Chrome (geen extra beeldbibliotheken nodig).
// Gebruik: node img.mjs jobs.json
// jobs.json: [{ "src": "/pad/bron.png", "dest": "/pad/doel.webp", "maxW": 2000, "q": 0.8, "trim": false }]
// trim: snijdt transparante randen weg (voor vrijstaande productfoto's).
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const jobs = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--no-first-run"],
});
const page = await browser.newPage();
await page.goto("about:blank");

for (const job of jobs) {
  const mime = MIME[path.extname(job.src).toLowerCase()];
  if (!mime) throw new Error("onbekend type: " + job.src);
  const data = fs.readFileSync(job.src).toString("base64");
  const result = await page.evaluate(
    async (b64, mime, maxW, q, trim) => {
      const img = new Image();
      img.src = `data:${mime};base64,${b64}`;
      await img.decode();
      let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
      if (trim) {
        const c0 = document.createElement("canvas");
        c0.width = sw; c0.height = sh;
        const g = c0.getContext("2d", { willReadFrequently: true });
        g.drawImage(img, 0, 0);
        const d = g.getImageData(0, 0, sw, sh).data;
        let x1 = sw, y1 = sh, x2 = -1, y2 = -1;
        for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
          if (d[(y * sw + x) * 4 + 3] > 24) { if (x < x1) x1 = x; if (x > x2) x2 = x; if (y < y1) y1 = y; if (y > y2) y2 = y; }
        }
        if (x2 > x1 && y2 > y1) {
          const pad = Math.round(Math.max(x2 - x1, y2 - y1) * 0.02);
          sx = Math.max(0, x1 - pad); sy = Math.max(0, y1 - pad);
          sw = Math.min(img.naturalWidth, x2 + pad) - sx; sh = Math.min(img.naturalHeight, y2 + pad) - sy;
        }
      }
      const scale = Math.min(1, maxW / sw);
      const w = Math.round(sw * scale), h = Math.round(sh * scale);
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const ctx = c.getContext("2d");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      return { w, h, url: c.toDataURL("image/webp", q) };
    },
    data, mime, job.maxW ?? 2000, job.q ?? 0.8, !!job.trim,
  );
  fs.mkdirSync(path.dirname(job.dest), { recursive: true });
  fs.writeFileSync(job.dest, Buffer.from(result.url.split(",")[1], "base64"));
  console.log(`${path.basename(job.dest).padEnd(34)} ${String(result.w).padStart(4)}x${String(result.h).padEnd(4)} ${(fs.statSync(job.dest).size / 1024).toFixed(0).padStart(4)} KB`);
}
await browser.close();
