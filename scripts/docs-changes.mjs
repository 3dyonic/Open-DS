#!/usr/bin/env node
// The docs pages that a change adds, removes or changes (OD-302), as markdown for the CI job summary.
// Git does not keep the pages, so the script generates both sides: the base in a temporary worktree,
// the head in this checkout. The owner sees what changed without the docs server.
//
//   node scripts/docs-changes.mjs --base <ref> [--limit 150]
//
// A page is its source files under docs/docs/<scheme>/ (the .md or .mdx and its .json data), plus the
// token map data (static/token-map) and the agents' index (static/<scheme>/llms.txt). The line counts
// compare the lines as a multiset: a moved line does not count.
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { generate } from "./generate.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** { scheme, page } for a generated file, from its path under docs/; null for a file that is not part of a page. */
export function pageOf(rel) {
  let m = rel.match(/^docs\/([^/]+)\/(.+)\.(mdx?|json)$/);
  if (m) return { scheme: m[1], page: m[2] };
  m = rel.match(/^static\/token-map\/([^/.]+)(?:\.json|\/[^/]+\.json)$/);
  if (m) return { scheme: m[1], page: "token-map" };
  m = rel.match(/^static\/([^/]+)\/llms\.txt$/);
  if (m) return { scheme: m[1], page: "llms.txt" };
  return null;
}

/** Lines in `after` that `before` does not hold ({ added }), and the reverse ({ removed }). */
export function lineCounts(before, after) {
  const count = (text) => {
    const n = new Map();
    for (const line of text === "" ? [] : text.split("\n")) n.set(line, (n.get(line) ?? 0) + 1);
    return n;
  };
  const a = count(before);
  const b = count(after);
  let added = 0;
  let removed = 0;
  for (const [line, k] of b) added += Math.max(0, k - (a.get(line) ?? 0));
  for (const [line, k] of a) removed += Math.max(0, k - (b.get(line) ?? 0));
  return { added, removed };
}

/**
 * The pages that differ between two sets of generated files ({ rel: text }), sorted by scheme and page:
 * [{ scheme, page, status: "added" | "removed" | "changed", added, removed }].
 */
export function pageChanges(base, head) {
  const pages = new Map();
  for (const rel of new Set([...Object.keys(base), ...Object.keys(head)])) {
    const where = pageOf(rel);
    if (!where) continue;
    const key = `${where.scheme}/${where.page}`;
    const row = pages.get(key) ?? { ...where, inBase: false, inHead: false, added: 0, removed: 0 };
    row.inBase ||= rel in base;
    row.inHead ||= rel in head;
    const { added, removed } = lineCounts(base[rel] ?? "", head[rel] ?? "");
    row.added += added;
    row.removed += removed;
    pages.set(key, row);
  }
  return [...pages.values()]
    .filter((r) => !r.inBase || !r.inHead || r.added || r.removed)
    .map(({ scheme, page, inBase, inHead, added, removed }) => ({
      scheme,
      page,
      status: !inBase ? "added" : !inHead ? "removed" : "changed",
      added,
      removed,
    }))
    .sort((x, y) => x.scheme.localeCompare(y.scheme) || x.page.localeCompare(y.page));
}

/** The job summary: a count per scheme, then one row per page, at most `limit` rows. */
export function changesMarkdown({ rows, base, head, limit = 150 }) {
  const out = ["## Docs pages this change touches", ""];
  out.push(`Base \`${base}\`, head \`${head}\`. Both sides are generated from their schemes.`, "");
  if (!rows.length) return [...out, "No docs page changes.", ""].join("\n");
  const by = (status) => rows.filter((r) => r.status === status).length;
  out.push(`${rows.length} ${rows.length === 1 ? "page" : "pages"}: ${by("added")} added, ${by("removed")} removed, ${by("changed")} changed.`, "");
  out.push("| Scheme | Added | Removed | Changed |", "| --- | ---: | ---: | ---: |");
  for (const scheme of [...new Set(rows.map((r) => r.scheme))]) {
    const of = rows.filter((r) => r.scheme === scheme);
    const n = (status) => of.filter((r) => r.status === status).length;
    out.push(`| ${scheme} | ${n("added")} | ${n("removed")} | ${n("changed")} |`);
  }
  out.push("", "| Scheme | Page | Change | Lines |", "| --- | --- | --- | ---: |");
  for (const r of rows.slice(0, limit)) out.push(`| ${r.scheme} | \`${r.page}\` | ${r.status} | +${r.added} −${r.removed} |`);
  if (rows.length > limit)
    out.push(
      "",
      `The table shows ${limit} of ${rows.length} pages. For the full list, run: \`node scripts/docs-changes.mjs --base ${base} --limit ${rows.length}\``,
    );
  return [...out, ""].join("\n");
}

// ---------- I/O ----------

function git(repo, args) {
  const r = spawnSync("git", ["-C", repo, ...args], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`git ${args.join(" ")} failed: ${(r.stderr || r.stdout).trim()}`);
  return r.stdout.trim();
}

/** Every generated docs file of a checkout that a page uses, as { rel: text }, rel under docs/. */
function readGenerated(repo) {
  const docs = join(repo, "docs");
  const files = {};
  const walk = (dir) => {
    if (!existsSync(dir)) return;
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else {
        const rel = relative(docs, p);
        if (pageOf(rel)) files[rel] = readFileSync(p, "utf8");
      }
    }
  };
  walk(join(docs, "docs"));
  walk(join(docs, "static"));
  return files;
}

// The checkout's installed packages, linked into the worktree, so the base generates without an install.
function linkDependencies(worktree) {
  for (const dir of ["", "tokens", "cli", "docs", "ui"]) {
    const from = join(root, dir, "node_modules");
    const to = join(worktree, dir, "node_modules");
    if (existsSync(from) && !existsSync(to) && existsSync(join(worktree, dir))) symlinkSync(realpathSync(from), to, "dir");
  }
}

/** The base's generated docs files, from a temporary worktree that is gone when this returns. */
function generatedAt(sha) {
  const worktree = mkdtempSync(join(tmpdir(), "open-ds-docs-changes-"));
  rmSync(worktree, { recursive: true, force: true });
  git(root, ["worktree", "add", "--detach", worktree, sha]);
  try {
    linkDependencies(worktree);
    generate({ repo: worktree, only: ["tokens", "docs"] });
    return readGenerated(worktree);
  } finally {
    spawnSync("git", ["-C", root, "worktree", "remove", "--force", worktree]);
    rmSync(worktree, { recursive: true, force: true });
    spawnSync("git", ["-C", root, "worktree", "prune"]);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const flag = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
  const ref = flag("--base", null);
  const limit = Number(flag("--limit", 150));
  if (!ref || !Number.isInteger(limit) || limit < 1) {
    console.error("Usage: node scripts/docs-changes.mjs --base <ref> [--limit <rows>]. Example: --base origin/RC1");
    process.exit(1);
  }
  const sha = spawnSync("git", ["-C", root, "rev-parse", "--verify", "--quiet", `${ref}^{commit}`], { encoding: "utf8" }).stdout.trim();
  if (!sha) {
    console.error(`No commit for "${ref}". Fetch it first: git fetch origin <branch>. Then run again.`);
    process.exit(1);
  }
  try {
    const base = generatedAt(sha);
    generate({ repo: root, only: ["tokens", "docs"] });
    const head = readGenerated(root);
    const short = (s) => s.slice(0, 10);
    console.log(changesMarkdown({ rows: pageChanges(base, head), base: short(sha), head: short(git(root, ["rev-parse", "HEAD"])), limit }));
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
