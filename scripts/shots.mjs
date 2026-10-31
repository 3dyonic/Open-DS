#!/usr/bin/env node
// Screenshots of every component each scheme carries, from its Storybook "Examples" story, for the
// site's Components page. The site shows these pictures instead of linking to a hosted Storybook.
//
//   pnpm shots              build Storybook, then shoot every scheme's inventory
//   pnpm shots --no-build   reuse storybook/storybook-static
//
// Writes site/public/shots/<scheme>/<component>.jpg and <component>@2x.jpg. Run it after changing a component, a story or a
// scheme's tokens or samples, and commit the pictures.

import { execFileSync } from "node:child_process";
import {
  createReadStream,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
} from "node:fs";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const staticDir = join(root, "storybook", "storybook-static");
const out = join(root, "site", "public", "shots");
// Components that open over the page: open them first, so the picture shows what opens.
// "modal" crops to the open layer alone; the rest keep the trigger in the picture.
const OPEN = {
  dialog: "click",
  "alert-dialog": "click",
  sheet: "click",
  drawer: "click",
  popover: "click",
  "dropdown-menu": "click",
  "hover-card": "hover",
  tooltip: "hover",
  "context-menu": "right",
};
const MODAL = new Set(["dialog", "alert-dialog", "sheet", "drawer"]);
const LAYER =
  "[data-radix-popper-content-wrapper], [role=dialog], [role=alertdialog], [role=menu], [role=tooltip], [data-slot=drawer-content]";
const SCHEMES = [
  "dense-data",
  "content-first",
  "accessible-first",
  "multi-brand",
  "brand-expressive",
];

if (!process.argv.includes("--no-build"))
  execFileSync("pnpm", ["--dir", "storybook", "build"], {
    cwd: root,
    stdio: "inherit",
  });

// A tiny static server for the built Storybook.
const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};
const server = createServer((req, res) => {
  let path = join(
    staticDir,
    decodeURIComponent(new URL(req.url, "http://x").pathname),
  );
  if (existsSync(path) && statSync(path).isDirectory())
    path = join(path, "index.html");
  if (!existsSync(path)) return res.writeHead(404).end();
  res.writeHead(200, {
    "Content-Type": TYPES[extname(path)] ?? "application/octet-stream",
  });
  createReadStream(path).pipe(res);
}).listen(0);
const base = `http://localhost:${server.address().port}`;

const { chromium } = createRequire(import.meta.url)("playwright");
const browser = await chromium.launch();
// Each picture at 1x and 2x, for the site's srcset.
const pages = [
  [
    await browser.newPage({
      viewport: { width: 960, height: 640 },
      deviceScaleFactor: 1,
    }),
    "",
  ],
  [
    await browser.newPage({
      viewport: { width: 960, height: 640 },
      deviceScaleFactor: 2,
    }),
    "@2x",
  ],
];
const stories = new Set(
  Object.keys(
    JSON.parse(readFileSync(join(staticDir, "index.json"), "utf8")).entries,
  ),
);

rmSync(out, { recursive: true, force: true });
let count = 0;
for (const id of SCHEMES) {
  const scheme = JSON.parse(
    readFileSync(join(root, "schemes", `${id}.json`), "utf8"),
  );
  const theme =
    Object.keys(scheme.tokens.brands).length > 1
      ? `${id}--${Object.keys(scheme.tokens.brands)[0]}`
      : id;
  mkdirSync(join(out, id), { recursive: true });
  for (const { id: component } of scheme.inventory.in) {
    const story = `components-${component}--examples`;
    if (!stories.has(story)) continue;
    for (const [page, suffix] of pages) {
      await page.goto(
        `${base}/iframe.html?id=${story}&viewMode=story&globals=scheme:${theme}`,
      );
      await page.waitForTimeout(700);
      const how = OPEN[component];
      if (how) {
        const trigger = page
          .locator(
            "#storybook-root button, #storybook-root [data-slot$=trigger]",
          )
          .first();
        if (how === "hover") await trigger.hover();
        else if (how === "right") await trigger.click({ button: "right" });
        else await trigger.click();
        await page.waitForTimeout(600);
      }
      // The story's own content (the first element inside the padded scheme wrapper) and any open layer.
      const box = await page.evaluate(
        ({ layer, modal }) => {
          const layers = [...document.querySelectorAll(layer)];
          const roots =
            modal && layers.length
              ? layers
              : [
                  document.querySelector("#storybook-root > div > *"),
                  ...layers,
                ].filter(Boolean);
          if (!roots.length) return null;
          // The union of what is drawn (text and controls), so a short row is not padded to the full width.
          const r = { x: Infinity, y: Infinity, right: 0, bottom: 0 };
          const add = (b) => {
            if (b.width === 0 || b.height === 0) return;
            r.x = Math.min(r.x, b.x);
            r.y = Math.min(r.y, b.y);
            r.right = Math.max(r.right, b.right);
            r.bottom = Math.max(r.bottom, b.bottom);
          };
          for (const el of roots) {
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
            while (walker.nextNode())
              if (walker.currentNode.textContent.trim()) {
                const range = document.createRange();
                range.selectNodeContents(walker.currentNode);
                add(range.getBoundingClientRect());
              }
            for (const n of [el, ...el.querySelectorAll("*")]) {
              const cs = getComputedStyle(n);
              const drawn =
                n.matches(
                  "table, input, textarea, button, svg, img, [role=radio], [role=checkbox], [role=switch], [role=slider], [role=combobox], [role=tab], [role=progressbar], [role=separator]",
                ) ||
                parseFloat(cs.borderTopWidth) > 0 ||
                cs.backgroundColor !== "rgba(0, 0, 0, 0)";
              if (drawn) add(n.getBoundingClientRect());
            }
          }
          if (r.x === Infinity) return null;
          r.width = r.right - r.x;
          r.height = r.bottom - r.y;
          const x = Math.max(r.x - 16, 0),
            y = Math.max(r.y - 16, 0);
          return {
            x,
            y,
            width: Math.min(r.width + 32, 960 - x),
            height: Math.min(r.height + 32, 640 - y),
          };
        },
        { layer: LAYER, modal: MODAL.has(component) },
      );
      if (!box || box.width < 8 || box.height < 8) break;
      await page.screenshot({
        path: join(out, id, `${component}${suffix}.jpg`),
        type: "jpeg",
        quality: 82,
        clip: box,
      });
    }
    if (existsSync(join(out, id, `${component}.jpg`))) count++;
  }
}
await browser.close();
server.close();
console.log(`Wrote ${count} components, at 1x and 2x, into site/public/shots.`);
