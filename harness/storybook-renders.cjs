#!/usr/bin/env node
// Opens every entry of a built Storybook in a browser and checks that it renders (OD-178).
// A build can pass while every story shows "No Preview" (a bad preview option did that once),
// so this loads each story and docs page from index.json in iframe.html and fails on:
//   - Storybook's error or no-preview screen
//   - an empty root
//   - an uncaught page error
//   - a story that says its scheme has no sample content for the component
// With --schemes a,b,c it also opens every story in each of those toolbar schemes (OD-192: every
// component renders in every scheme, including the ones a scheme does not carry).
// Prints one JSON line: { entries, failed: [{ id, problem }] } or { missing } or { error }.
// Usage: node harness/storybook-renders.cjs <storybook-static dir> [--schemes a,b,c]

const { createServer } = require("node:http");
const { readFileSync, existsSync, statSync } = require("node:fs");
const { join, extname } = require("node:path");

const out = process.argv[2];
const at = process.argv.indexOf("--schemes");
const schemes = at > 0 ? process.argv[at + 1].split(",").filter(Boolean) : [];
if (!out || !existsSync(join(out, "index.json"))) {
  console.log(JSON.stringify({ error: `no index.json in ${out}` }));
  process.exit(0);
}

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
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".png": "image/png",
};

function serve() {
  const server = createServer((req, res) => {
    let p = join(out, decodeURIComponent(req.url.split("?")[0]));
    if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
    if (!existsSync(p)) {
      res.writeHead(404);
      return res.end();
    }
    res.writeHead(200, { "content-type": TYPES[extname(p)] ?? "application/octet-stream" });
    res.end(readFileSync(p));
  });
  return new Promise((r) => server.listen(0, "127.0.0.1", () => r(server)));
}

async function main() {
  const index = JSON.parse(readFileSync(join(out, "index.json"), "utf8"));
  // Every entry as it opens, then every story again in each extra scheme.
  const entries = Object.values(index.entries).map((e) => ({ ...e, globals: "" }));
  for (const s of schemes)
    for (const e of Object.values(index.entries))
      if (e.type === "story") entries.push({ ...e, globals: `&globals=scheme:${s}` });
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  const failed = [];
  try {
    for (const e of entries) {
      const errors = [];
      const onError = (err) => errors.push(err.message);
      page.on("pageerror", onError);
      await page.goto(`${base}/iframe.html?id=${e.id}&viewMode=${e.type === "docs" ? "docs" : "story"}${e.globals}`);
      // Storybook sets one of these body classes when it finishes: show-main, show-error or show-nopreview.
      const state = await page
        .waitForFunction(
          () => {
            const c = document.body.classList;
            if (c.contains("sb-show-errordisplay")) return "error";
            if (c.contains("sb-show-nopreview")) return "nopreview";
            if (c.contains("sb-show-main")) {
              const docs = document.querySelector("#storybook-docs");
              const root = docs && !docs.hidden ? docs : document.querySelector("#storybook-root");
              return (root?.innerText ?? "").trim() || root?.children.length ? "ok" : false;
            }
            return false;
          },
          null,
          { timeout: 15000 },
        )
        .then((h) => h.jsonValue())
        .catch(() => "timeout");
      page.off("pageerror", onError);
      const where = e.globals ? `${e.id} (${e.globals.split(":")[1]})` : e.id;
      const gap =
        state === "ok" &&
        (await page
          .locator("#storybook-root, #storybook-docs")
          .first()
          .innerText()
          .then((x) => /has no sample content for this component/.test(x))
          .catch(() => false));
      if (state === "error") {
        const msg = await page
          .locator("#error-message")
          .innerText()
          .catch(() => "");
        failed.push({ id: where, problem: `error: ${msg.split("\n")[0]}` });
      } else if (state !== "ok") failed.push({ id: where, problem: state });
      else if (errors.length) failed.push({ id: where, problem: `page error: ${errors[0]}` });
      else if (gap) failed.push({ id: where, problem: "no sample content for this component" });
    }
  } finally {
    await browser.close();
    server.close();
  }
  console.log(JSON.stringify({ entries: entries.length, failed }));
}

main().catch((err) => {
  console.log(JSON.stringify({ error: err.message }));
});
