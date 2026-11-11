// A snapshot of the built docs (OD-284): every page's text, and screenshots of each page type in light
// and dark. Taken before and after a change to the page templates, it shows that the content stayed the
// same and lists every visual change for review.
//
//   node scripts/docs-snapshot.mjs <base url> <out dir>        e.g. http://localhost:3211 /tmp/before
//
// Writes <out>/text.json ({ "<scheme>/<page>": text }) and <out>/shots/<scheme>__<page>__<mode>.jpg.
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const [base, out] = process.argv.slice(2);
if (!base || !out) {
  console.error("Usage: node scripts/docs-snapshot.mjs <base url> <out dir>");
  process.exit(1);
}

const DOCS = new URL("../docs/docs", import.meta.url).pathname;
const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.mdx?$/.test(f) ? [p] : [];
  });
// A page's route: its front matter slug when it has one (anatomy pages: /<scheme>/components/<c>/anatomy),
// else its path. The snapshot keys pages by file, so before and after line up.
const routes = walk(DOCS)
  .map((p) => {
    const file = relative(DOCS, p).replace(/\.mdx?$/, "");
    const slug = /^slug:\s*"?([^"\n]+)"?$/m.exec(readFileSync(p, "utf8").split("\n---")[0])?.[1];
    const dir = file.split("/").slice(0, -1).join("/");
    // An absolute slug starts with "/"; a relative one sits in the page's folder.
    const url = !slug ? file.replace(/(^|\/)index$/, "") : slug.startsWith("/") ? slug.slice(1).replace(/\/$/, "") : `${dir}/${slug}`.replace(/\/$/, "");
    return { file: file.replace(/(^|\/)index$/, ""), url };
  })
  .sort((a, b) => a.file.localeCompare(b.file));

// One page of each type, plus the pages that hold the single-page visuals.
const SHOT = new Set([
  "",
  "themes",
  "decision-reference",
  "foundations",
  "foundations/color",
  "foundations/theming",
  "foundations/spacing",
  "primitives",
  "primitives/color",
  "primitives/type",
  "components/inventory",
  "components/button",
  "components/field",
  "components/data-table",
  "components/calendar",
  "components/button-anatomy",
  "components/data-table-anatomy",
  "components/calendar-anatomy",
]);

mkdirSync(join(out, "shots"), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const text = {};
let shots = 0;
for (const { file: route, url } of routes) {
  const [scheme, ...rest] = route.split("/");
  const path = rest.join("/");
  await page.goto(`${base}/${url}${url ? "/" : ""}`, { waitUntil: "networkidle" });
  text[route] = await page.evaluate(() => (document.querySelector("article") ?? document.querySelector("main"))?.innerText ?? "");
  if (!SHOT.has(path)) continue;
  for (const mode of ["light", "dark"]) {
    await page.evaluate((m) => {
      localStorage.setItem("theme", m);
      document.documentElement.setAttribute("data-theme", m);
    }, mode);
    await page.waitForTimeout(250);
    const name = `${scheme}__${path.replace(/\//g, "_") || "home"}__${mode}.jpg`;
    await page.screenshot({ path: join(out, "shots", name), fullPage: true, type: "jpeg", quality: 70 });
    shots++;
  }
  await page.evaluate(() => localStorage.setItem("theme", "light"));
}
await browser.close();
writeFileSync(join(out, "text.json"), JSON.stringify(text, null, 1) + "\n");
console.log(`${Object.keys(text).length} pages read, ${shots} screenshots, in ${out}`);
