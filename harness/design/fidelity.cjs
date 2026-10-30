#!/usr/bin/env node
// Compares the built site with the Figma frames. For each page in pages.json it serves
// site/out, takes a 1440px screenshot and checks:
//   texts   every static text from the frame appears on the page, in the frame's order
//   fold    the top 900px looks like the frame (downscaled pixel similarity)
//   palette the colours on the page match the frame's colours (histogram overlap)
//   height  the page is not far shorter or longer than the frame
// Prints one JSON line: { pages: [{ route, ok, texts, fold, palette, height, problems }] }.
// Usage: node harness/design/fidelity.cjs [siteOutDir]

const { createServer } = require("node:http");
const { readFileSync, existsSync, statSync } = require("node:fs");
const { join, extname } = require("node:path");

const here = __dirname;
const out = process.argv[2] ?? join(here, "..", "..", "site", "out");
const spec = JSON.parse(readFileSync(join(here, "pages.json"), "utf8"));

let playwright;
try {
  playwright = require("playwright");
} catch {
  console.log(JSON.stringify({ missing: "playwright" }));
  process.exit(0);
}

const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/plain",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

function serve() {
  const server = createServer((req, res) => {
    let p = join(out, decodeURIComponent(req.url.split("?")[0]));
    if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
    if (!existsSync(p) && existsSync(`${p}.html`)) p = `${p}.html`;
    if (!existsSync(p)) {
      res.writeHead(404);
      return res.end();
    }
    res.writeHead(200, { "content-type": TYPES[extname(p)] ?? "application/octet-stream" });
    res.end(readFileSync(p));
  });
  return new Promise((r) => server.listen(0, () => r(server)));
}

// Runs in the browser: compares two PNG data URLs.
async function compareImages([a, b, offset]) {
  const load = (src) =>
    new Promise((r) => {
      const i = new Image();
      i.onload = () => r(i);
      i.src = src;
    });
  const [A, B] = await Promise.all([load(a), load(b)]);
  const pixels = (img, sy, sh, w, h) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const x = c.getContext("2d");
    x.drawImage(img, 0, sy, img.width, sh, 0, 0, w, h);
    return x.getImageData(0, 0, w, h).data;
  };
  // Fold: the top 900px of each, at 48 by 30.
  const fa = pixels(A, offset, Math.min(900, A.height - offset), 48, 30);
  const fb = pixels(B, 0, Math.min(900, B.height), 48, 30);
  let diff = 0;
  for (let i = 0; i < fa.length; i += 4)
    diff += (Math.abs(fa[i] - fb[i]) + Math.abs(fa[i + 1] - fb[i + 1]) + Math.abs(fa[i + 2] - fb[i + 2])) / 3;
  const fold = 1 - diff / (255 * (fa.length / 4));
  // Palette: 4-bit-per-channel histograms of the whole page at 96px wide.
  const hist = (img) => {
    const h = Math.max(1, Math.round((img.height / img.width) * 96));
    const d = pixels(img, 0, img.height, 96, h);
    const m = new Map();
    for (let i = 0; i < d.length; i += 4) {
      const k = ((d[i] >> 5) << 6) | ((d[i + 1] >> 5) << 3) | (d[i + 2] >> 5);
      m.set(k, (m.get(k) ?? 0) + 1);
    }
    const n = d.length / 4;
    for (const [k, v] of m) m.set(k, v / n);
    return m;
  };
  const ha = hist(A);
  const hb = hist(B);
  let overlap = 0;
  for (const [k, v] of ha) overlap += Math.min(v, hb.get(k) ?? 0);
  return { fold, palette: overlap, heights: [A.height, B.height] };
}

(async () => {
  const server = await serve();
  const base = `http://localhost:${server.address().port}`;
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const pages = [];
  for (const p of spec.pages) {
    const problems = [];
    await page.goto(base + p.route, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const text = (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, " ");
    let at = 0;
    let found = 0;
    for (const t of p.texts) {
      const i = text.indexOf(t, at);
      if (i < 0) problems.push(text.includes(t) ? `out of order: "${t}"` : `missing: "${t}"`);
      else {
        found++;
        at = i + t.length;
      }
    }
    const shot = (await page.screenshot({ fullPage: true })).toString("base64");
    const ref = readFileSync(join(here, p.reference)).toString("base64");
    const img = await page.evaluate(compareImages, [
      `data:image/png;base64,${shot}`,
      `data:image/png;base64,${ref}`,
      p.offset ?? 0,
    ]);
    const ratio = img.heights[0] / img.heights[1];
    const t = spec.thresholds;
    if (img.fold < t.fold) problems.push(`fold similarity ${img.fold.toFixed(2)} < ${t.fold}`);
    if (img.palette < t.palette) problems.push(`palette overlap ${img.palette.toFixed(2)} < ${t.palette}`);
    if (ratio < t.height[0] || ratio > t.height[1])
      problems.push(`height ${img.heights[0]}px vs frame ${img.heights[1]}px`);
    pages.push({
      route: p.route,
      frame: p.frame,
      ok: problems.length === 0,
      texts: `${found}/${p.texts.length}`,
      fold: Number(img.fold.toFixed(3)),
      palette: Number(img.palette.toFixed(3)),
      height: Number(ratio.toFixed(2)),
      problems,
    });
  }
  await browser.close();
  server.close();
  console.log(JSON.stringify({ pages }));
})().catch((e) => {
  console.log(JSON.stringify({ error: e.message }));
  process.exit(1);
});
