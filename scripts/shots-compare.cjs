// OD-234: before and after screenshots of every component story, in a few themes, compared pixel by
// pixel. node scripts/shots-compare.cjs capture <dir> | compare <before> <after>
const { chromium } = require("playwright");
const {
  readFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
  writeFileSync,
} = require("node:fs");
const { join } = require("node:path");
const http = require("node:http");

const STATIC = join(__dirname, "..", "storybook", "storybook-static");
const THEMES = [
  "dense-data",
  "content-first",
  "accessible-first",
  "brand-expressive",
  "multi-brand--aster",
  "multi-brand--birch",
  "multi-brand--coral",
].flatMap((s) => [`${s}:light`, `${s}:dark`]);

function serve() {
  const types = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".woff2": "font/woff2",
  };
  const server = http.createServer((req, res) => {
    const p = join(
      STATIC,
      decodeURIComponent(req.url.split("?")[0]).replace(/\/$/, "/index.html"),
    );
    if (!existsSync(p)) return res.writeHead(404).end();
    res.writeHead(200, {
      "content-type":
        types[p.slice(p.lastIndexOf("."))] ?? "application/octet-stream",
    });
    res.end(readFileSync(p));
  });
  return new Promise((r) => server.listen(0, () => r(server)));
}

async function capture(dir) {
  mkdirSync(dir, { recursive: true });
  const index = JSON.parse(readFileSync(join(STATIC, "index.json"), "utf8"));
  const stories = Object.values(index.entries).filter(
    (e) => e.type === "story" && /^components-/.test(e.id),
  );
  const server = await serve();
  const base = `http://localhost:${server.address().port}`;
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 900, height: 700 } });
  for (const s of stories)
    for (const t of THEMES) {
      const [scheme, mode] = t.split(":");
      await page.goto(
        `${base}/iframe.html?id=${s.id}&viewMode=story&globals=scheme:${scheme};mode:${mode}`,
      );
      await page.waitForTimeout(250);
      await page.screenshot({
        path: join(dir, `${s.id}__${scheme}__${mode}.png`),
        fullPage: true,
      });
    }
  await b.close();
  server.close();
  console.log(`${stories.length} stories × ${THEMES.length} themes`);
}

async function compare(before, after) {
  const b = await chromium.launch();
  const page = await b.newPage();
  const out = [];
  for (const f of readdirSync(before).filter((x) => x.endsWith(".png"))) {
    const A = readFileSync(join(before, f));
    const B = existsSync(join(after, f)) ? readFileSync(join(after, f)) : null;
    if (B && A.equals(B)) continue;
    const diff = B
      ? await page.evaluate(
          async ([a, c]) => {
            const load = (src) =>
              new Promise((r) => {
                const i = new Image();
                i.onload = () => r(i);
                i.src = src;
              });
            const [x, y] = await Promise.all([load(a), load(c)]);
            const w = Math.max(x.width, y.width),
              h = Math.max(x.height, y.height);
            const px = (img) => {
              const cv = new OffscreenCanvas(w, h);
              const g = cv.getContext("2d");
              g.drawImage(img, 0, 0);
              return g.getImageData(0, 0, w, h).data;
            };
            const p = px(x),
              q = px(y);
            let n = 0;
            for (let i = 0; i < p.length; i += 4)
              if (
                Math.abs(p[i] - q[i]) +
                  Math.abs(p[i + 1] - q[i + 1]) +
                  Math.abs(p[i + 2] - q[i + 2]) >
                24
              )
                n++;
            return {
              n,
              total: w * h,
              size: x.width !== y.width || x.height !== y.height,
            };
          },
          [
            `data:image/png;base64,${A.toString("base64")}`,
            `data:image/png;base64,${B.toString("base64")}`,
          ],
        )
      : { n: -1 };
    out.push({ f, ...diff });
  }
  await b.close();
  writeFileSync(join(after, "diff.json"), JSON.stringify(out, null, 2));
  const changed = out.filter((x) => x.n !== 0);
  console.log(`${changed.length} screenshots differ`);
  for (const x of changed.sort((a, b) => b.n - a.n).slice(0, 60))
    console.log(
      `${x.f}  ${x.n < 0 ? "missing" : `${x.n} px${x.size ? ", size changed" : ""}`}`,
    );
}

const [cmd, a, c] = process.argv.slice(2);
(cmd === "capture" ? capture(a) : compare(a, c)).catch((e) => {
  console.error(e);
  process.exit(1);
});
