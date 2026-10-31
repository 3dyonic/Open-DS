#!/usr/bin/env node
// The hosted Open DS server: the MCP (Streamable HTTP) at /mcp, health at /health, and, when SITE_DIR
// points at the built site (site/out), the website on every other path. One engine with the CLI.
// PORT and HOST come from the environment (Fly sets PORT). No authentication yet (OD-145).
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { mcpHandler } from "open-ds/mcp";

const port = Number(process.env.PORT ?? 8787);
const host = process.env.HOST ?? "0.0.0.0";
const site = process.env.SITE_DIR ? resolve(process.env.SITE_DIR) : null;
const mcp = mcpHandler();

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

/** A file under the site folder for a URL path: the file, its index.html, or path.html. Never outside it. */
function fileFor(path) {
  const base = normalize(join(site, decodeURIComponent(path)));
  if (!base.startsWith(site)) return null;
  for (const p of [base, join(base, "index.html"), `${base}.html`])
    if (existsSync(p) && statSync(p).isFile()) return p;
  return null;
}

export const server = createServer((req, res) => {
  const path = new URL(req.url, "http://x").pathname;
  if (!site || path === "/mcp" || path === "/health") return mcp(req, res);
  if (req.method !== "GET" && req.method !== "HEAD")
    return res.writeHead(405, { allow: "GET, HEAD" }).end();
  const file = fileFor(path);
  const notFound = join(site, "404.html");
  const send = file ?? (existsSync(notFound) ? notFound : null);
  if (!send) return res.writeHead(404).end();
  res.writeHead(file ? 200 : 404, {
    "content-type": TYPES[extname(send)] ?? "application/octet-stream",
    // Next.js puts content hashes in _next/ file names, so those never change.
    "cache-control": path.startsWith("/_next/")
      ? "public, max-age=31536000, immutable"
      : "public, max-age=300",
  });
  if (req.method === "HEAD") return res.end();
  createReadStream(send).pipe(res);
});

if (
  process.argv[1] &&
  resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)
)
  server.listen(port, host, () =>
    console.error(
      `Open DS on http://${host}:${port}${site ? ` (site from ${site})` : ""}, MCP at /mcp (no authentication).`,
    ),
  );
