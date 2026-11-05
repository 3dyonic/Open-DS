#!/usr/bin/env node
// Opens the built repo docs in a browser (OD-207) and checks the scheme switch:
//   - each scheme's button page sets html[data-scheme] and wears that scheme's primary color
//   - the switcher keeps the page: /<a>/components/button becomes /<b>/components/button
//   - a component a scheme leaves out has the regular page, with a "Left out of" badge and what to use instead
//   - no uncaught page error
// Prints one JSON line: { pages, failed: [{ id, problem }] } or { missing } or { error }.
// Usage: node harness/docs-renders.cjs <docs dir>

const { createServer } = require("node:http");
const { readFileSync, existsSync, statSync } = require("node:fs");
const { join, extname } = require("node:path");

const docs = process.argv[2];
const out = join(docs ?? "", "build");
if (!docs || !existsSync(join(out, "index.html"))) {
  console.log(JSON.stringify({ error: `no build in ${out}` }));
  process.exit(0);
}
let playwright;
try {
  playwright = require("playwright");
} catch {
  console.log(JSON.stringify({ missing: "playwright" }));
  process.exit(0);
}
const schemes = JSON.parse(readFileSync(join(docs, "schemes.json"), "utf8"));
const repo = join(docs, "..");
// The light primary each scheme ships: the first --color-action-primary in its tokens.
const primary = (id) =>
  readFileSync(join(repo, "tokens", "dist", id, "tokens.css"), "utf8")
    .match(/--color-action-primary:\s*([^;]+);/)[1]
    .trim()
    .toLowerCase();
const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
};

const server = createServer((req, res) => {
  let p = join(out, decodeURIComponent(req.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  else if (!existsSync(p) && existsSync(`${p}.html`)) p = `${p}.html`;
  if (!existsSync(p)) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, { "content-type": TYPES[extname(p)] ?? "application/octet-stream" });
  res.end(readFileSync(p));
});

server.listen(0, async () => {
  const base = `http://localhost:${server.address().port}`;
  const failed = [];
  let pages = 0;
  const browser = await playwright.chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const state = () =>
      page.evaluate(() => ({
        scheme: document.documentElement.dataset.scheme ?? null,
        primary: getComputedStyle(document.documentElement)
          .getPropertyValue("--ifm-color-primary")
          .trim()
          .toLowerCase(),
        path: location.pathname.replace(/\/$/, ""),
      }));
    for (const [i, s] of schemes.entries()) {
      await page.goto(`${base}/${s.id}/components/button`, { waitUntil: "networkidle" });
      pages++;
      const st = await state();
      if (st.scheme !== s.id) failed.push({ id: s.id, problem: `data-scheme is ${st.scheme}` });
      if (st.primary !== primary(s.id))
        failed.push({ id: s.id, problem: `primary is ${st.primary}, not ${primary(s.id)}` });
      // Switch to the next scheme from the navbar; the page must stay the button page.
      const next = schemes[(i + 1) % schemes.length].id;
      // The switcher is a listbox, not a native select (OD-240): open it and pick the scheme by name.
      const nextName = schemes[(i + 1) % schemes.length].name;
      await page.click('.navbar .ods-picker:has(.ods-picker-label:text-is("Scheme")) .ods-picker-trigger');
      await page.click(`.navbar [role="option"]:has-text("${nextName}")`);
      await page
        .waitForFunction((n) => document.documentElement.dataset.scheme === n, next, { timeout: 5000 })
        .catch(() => {});
      const after = await state();
      if (after.path !== `/${next}/components/button`)
        failed.push({ id: s.id, problem: `switching to ${next} went to ${after.path}` });
      if (after.scheme !== next) failed.push({ id: s.id, problem: `after the switch data-scheme is ${after.scheme}` });
    }
    // A left-out component (OD-211): Dense data leaves out the carousel. Its page is the regular one
    // (it shows live), with a badge and what to use instead.
    const dense = schemes.find((s) => s.id === "dense-data");
    if (dense) {
      await page.goto(`${base}/dense-data/components/carousel`, { waitUntil: "networkidle" });
      pages++;
      if (!(await page.locator("text=Left out of Dense data").count()))
        failed.push({ id: "dense-data/carousel", problem: 'no "Left out of Dense data" badge' });
      if (!(await page.locator(".odv-instead a").count()))
        failed.push({ id: "dense-data/carousel", problem: "no component to use instead" });
      if (!(await page.locator("h2:text('See it live')").count()))
        failed.push({ id: "dense-data/carousel", problem: "not the regular component page" });
    }
    for (const e of errors) failed.push({ id: "page", problem: e.slice(0, 160) });
  } catch (e) {
    console.log(JSON.stringify({ error: String(e.message ?? e).slice(0, 300) }));
    await browser.close();
    server.close();
    return;
  }
  await browser.close();
  server.close();
  console.log(JSON.stringify({ pages, failed }));
});
