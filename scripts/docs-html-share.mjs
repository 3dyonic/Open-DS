// How much of each generated docs page is inline HTML (OD-284). A page's share is the characters on its
// HTML lines (a line that starts with a tag, not an HTML comment) over all its characters, front
// matter left out. OD-284 moves the visuals into components, so the share should fall below 10%.
//
//   node scripts/docs-html-share.mjs                 print the summary
//   node scripts/docs-html-share.mjs --save <file>   also write every page's numbers as JSON
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const DOCS = join(ROOT, "docs/docs");

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.mdx?$/.test(f) ? [p] : [];
  });

/** { total, html, share } for one page's text. */
export function htmlShare(text) {
  const body = text.replace(/^---\n[\s\S]*?\n---\n/, "");
  let total = 0;
  let html = 0;
  for (const line of body.split("\n")) {
    total += line.length;
    const t = line.trimStart();
    if (t.startsWith("<") && !t.startsWith("<!--") && !t.startsWith("{/*")) html += line.length;
  }
  return { total, html, share: total ? html / total : 0 };
}

const pages = walk(DOCS).map((p) => ({ page: relative(DOCS, p), ...htmlShare(readFileSync(p, "utf8")) }));
const sum = (xs, k) => xs.reduce((a, x) => a + x[k], 0);
const pct = (n) => `${(n * 100).toFixed(1)}%`;
const byKind = (pred) => pages.filter((p) => pred(p.page));
const kinds = [
  ["component pages", (p) => /\/components\/(?!.*-anatomy)(?!inventory)[^/]+\.mdx?$/.test(p)],
  ["anatomy pages", (p) => /-anatomy\.mdx?$/.test(p)],
  ["other pages", (p) => !/\/components\/[^/]+\.mdx?$/.test(p) || /inventory/.test(p)],
];
console.log(`${pages.length} pages, ${pct(sum(pages, "html") / sum(pages, "total"))} HTML overall`);
for (const [name, pred] of kinds) {
  const xs = byKind(pred);
  console.log(`  ${name}: ${xs.length} pages, ${pct(sum(xs, "html") / sum(xs, "total"))} HTML`);
}
const top = [...pages].sort((a, b) => b.share - a.share).slice(0, 5);
console.log("  highest:", top.map((p) => `${p.page} ${pct(p.share)}`).join(", "));
const over = pages.filter((p) => p.share >= 0.1).length;
console.log(`  pages at 10% HTML or more: ${over}`);

const i = process.argv.indexOf("--save");
if (i > 0) writeFileSync(process.argv[i + 1], JSON.stringify({ pages }, null, 1) + "\n");
