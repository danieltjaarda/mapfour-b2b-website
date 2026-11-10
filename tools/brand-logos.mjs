// Maakt de merklogo's voor de strook "Gebouwd met componenten van" klaar voor gebruik:
// SVG's worden opgeschoond en strak bijgesneden (viewBox op de inhoud), PNG's krijgen hun transparante rand eraf.
// De kleur blijft origineel; de website maakt ze zwart met CSS (filter: brightness(0)).
// Gebruik: node tools/brand-logos.mjs <map-met-bronbestanden> <uitvoermap>
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const [, , RAW, OUT] = process.argv;
if (!RAW || !OUT) throw new Error("gebruik: node brand-logos.mjs <bronmap> <uitvoermap>");
fs.mkdirSync(OUT, { recursive: true });

// keepTop: alleen de bovenste regel houden (woordmerk zonder ondertitel of sierlijnen), voor leesbaarheid op klein formaat
const SPECS = [
  { name: "mivice", file: "mivice-primary.svg" },
  { name: "shimano", file: "shimano.svg", keepTop: true },
  { name: "tektro", file: "tektro.png" },
  { name: "samsung", file: "samsung.svg" },
  { name: "lg", file: "lg.svg" },
  { name: "michelin", file: "michelin.svg" },
  { name: "kenda", file: "kenda.png" },
  { name: "selle-royal", file: "selle-royal.svg" },
  { name: "toray", file: "toray.svg", keepTop: true },
];

const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--no-first-run"] });
const page = await browser.newPage();
await page.setJavaScriptEnabled(true);
const meta = {};

for (const spec of SPECS) {
  const src = path.join(RAW, spec.file);
  if (spec.file.endsWith(".svg")) {
    // tekstueel opschonen vóór het de pagina in gaat: geen scripts, geen event-attributen, geen ingesloten HTML
    let text = fs.readFileSync(src, "utf8")
      .replace(/<\?xml[^>]*\?>/g, "")
      .replace(/<!DOCTYPE[^>]*>/gi, "")
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "")
      .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*')/gi, "");
    await page.setContent(`<!doctype html><html><body style="margin:0;background:#fff">${text}</body></html>`);
    const result = await page.evaluate((keepTop) => {
      const svg = document.querySelector("svg");
      if (!svg.getAttribute("viewBox")) {
        const w = parseFloat(svg.getAttribute("width")), h = parseFloat(svg.getAttribute("height"));
        svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      }
      svg.removeAttribute("width"); svg.removeAttribute("height"); svg.removeAttribute("style");
      svg.style.width = "1600px"; svg.style.height = "auto"; svg.style.display = "block";
      // editor-metadata en commentaar weg
      svg.querySelectorAll("metadata, title, desc").forEach((n) => n.remove());
      Array.from(svg.querySelectorAll("*")).filter((n) => n.tagName.includes(":")).forEach((n) => n.remove());
      const walker = document.createTreeWalker(svg, NodeFilter.SHOW_COMMENT);
      const comments = []; while (walker.nextNode()) comments.push(walker.currentNode);
      comments.forEach((c) => c.remove());

      const hidden = (el) => el.closest("defs, clipPath, mask, symbol, pattern, linearGradient, radialGradient");
      let leaves = Array.from(svg.querySelectorAll("path, polygon, rect, circle, ellipse, polyline, line, text, use, image")).filter((el) => !hidden(el));
      let boxes = leaves.map((el) => ({ el, r: el.getBoundingClientRect() })).filter((b) => b.r.width > 0 && b.r.height > 0);
      if (keepTop && boxes.length > 1) {
        boxes.sort((a, b) => a.r.top - b.r.top);
        const total = Math.max(...boxes.map((b) => b.r.bottom)) - Math.min(...boxes.map((b) => b.r.top));
        let bottom = boxes[0].r.bottom;
        const keep = [boxes[0]];
        for (const b of boxes.slice(1)) {
          if (b.r.top <= bottom + total * 0.03) { keep.push(b); bottom = Math.max(bottom, b.r.bottom); }
          else break;
        }
        const keepSet = new Set(keep.map((b) => b.el));
        boxes.filter((b) => !keepSet.has(b.el)).forEach((b) => b.el.remove());
        boxes = keep;
      }
      const x1 = Math.min(...boxes.map((b) => b.r.left)), y1 = Math.min(...boxes.map((b) => b.r.top));
      const x2 = Math.max(...boxes.map((b) => b.r.right)), y2 = Math.max(...boxes.map((b) => b.r.bottom));
      const inv = svg.getScreenCTM().inverse();
      const pt = (x, y) => { const p = svg.createSVGPoint(); p.x = x; p.y = y; return p.matrixTransform(inv); };
      const a = pt(x1, y1), b = pt(x2, y2);
      const pad = Math.max(b.x - a.x, b.y - a.y) * 0.004;
      const vb = [a.x - pad, a.y - pad, b.x - a.x + 2 * pad, b.y - a.y + 2 * pad];
      svg.setAttribute("viewBox", vb.map((n) => +n.toFixed(3)).join(" "));
      svg.removeAttribute("style");
      // lege groepen opruimen
      let removed = true;
      while (removed) { removed = false; svg.querySelectorAll("g").forEach((g) => { if (!g.children.length) { g.remove(); removed = true; } }); }
      // overbodige editor-attributen
      for (const el of [svg, ...svg.querySelectorAll("*")]) for (const at of Array.from(el.attributes)) {
        if (/^(inkscape|sodipodi|xmlns:(inkscape|sodipodi|dc|cc|rdf|svg)|data-name|xml:space|enable-background)/.test(at.name) || (at.name === "id" && el !== svg)) el.removeAttribute(at.name);
      }
      svg.removeAttribute("id"); svg.removeAttribute("version"); svg.removeAttribute("x"); svg.removeAttribute("y");
      return { svg: new XMLSerializer().serializeToString(svg), w: vb[2], h: vb[3], kept: boxes.length };
    }, !!spec.keepTop);
    const out = path.join(OUT, `${spec.name}.svg`);
    fs.writeFileSync(out, result.svg.replace(/\n\s*\n/g, "\n") + "\n");
    meta[spec.name] = { src: `/images/brands/${spec.name}.svg`, ratio: +(result.w / result.h).toFixed(3) };
    console.log(`${spec.name.padEnd(12)} svg  ${result.w.toFixed(1)} x ${result.h.toFixed(1)}  verhouding ${(result.w / result.h).toFixed(2)}  elementen ${result.kept}  ${(fs.statSync(out).size / 1024).toFixed(1)} KB`);
  } else {
    const b64 = fs.readFileSync(src).toString("base64");
    await page.setContent("<!doctype html><html><body></body></html>");
    const result = await page.evaluate(async (data) => {
      const img = new Image(); img.src = "data:image/png;base64," + data; await img.decode();
      const w = img.naturalWidth, h = img.naturalHeight;
      const c0 = document.createElement("canvas"); c0.width = w; c0.height = h;
      const g = c0.getContext("2d", { willReadFrequently: true }); g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, w, h).data;
      let x1 = w, y1 = h, x2 = -1, y2 = -1;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] > 16) { if (x < x1) x1 = x; if (x > x2) x2 = x; if (y < y1) y1 = y; if (y > y2) y2 = y; }
      const sw = x2 - x1 + 1, sh = y2 - y1 + 1, scale = Math.min(1, 720 / sw);
      const c = document.createElement("canvas"); c.width = Math.round(sw * scale); c.height = Math.round(sh * scale);
      const ctx = c.getContext("2d"); ctx.imageSmoothingQuality = "high"; ctx.drawImage(img, x1, y1, sw, sh, 0, 0, c.width, c.height);
      return { url: c.toDataURL("image/png"), w: c.width, h: c.height };
    }, b64);
    const out = path.join(OUT, `${spec.name}.png`);
    fs.writeFileSync(out, Buffer.from(result.url.split(",")[1], "base64"));
    meta[spec.name] = { src: `/images/brands/${spec.name}.png`, ratio: +(result.w / result.h).toFixed(3) };
    console.log(`${spec.name.padEnd(12)} png  ${result.w} x ${result.h}  verhouding ${(result.w / result.h).toFixed(2)}  ${(fs.statSync(out).size / 1024).toFixed(1)} KB`);
  }
}
await browser.close();
fs.writeFileSync(path.join(OUT, "brands.json"), JSON.stringify(meta, null, 1) + "\n");
console.log("klaar:", Object.keys(meta).length, "logo's");
