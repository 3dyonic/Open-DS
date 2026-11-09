// Compares two docs snapshots (scripts/docs-snapshot.mjs) for OD-284: did any page's content change,
// and which screenshots differ. Content is compared word by word, ignoring layout whitespace. The
// visual changes are listed for review, side by side, in a page written next to the snapshots.
//
//   node scripts/docs-snapshot-compare.mjs <before dir> <after dir> [--report <file.html>]
//
// Exits 1 when any page's text changed, so a content change cannot pass unseen.
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative, dirname } from "node:path";

const [before, after] = process.argv.slice(2);
if (!before || !after) {
  console.error("Usage: node scripts/docs-snapshot-compare.mjs <before dir> <after dir> [--report <file.html>]");
  process.exit(2);
}
const read = (dir) => JSON.parse(readFileSync(join(dir, "text.json"), "utf8"));
const words = (s) => s.replace(/\s+/g, " ").trim();
const [a, b] = [read(before), read(after)];

const missing = Object.keys(a).filter((k) => !(k in b));
const added = Object.keys(b).filter((k) => !(k in a));
const changed = Object.keys(a).filter((k) => k in b && words(a[k]) !== words(b[k]));

// The first point where two texts part, with a little context, so a reviewer sees what moved.
const firstDiff = (x, y) => {
  const [p, q] = [words(x), words(y)];
  let i = 0;
  while (i < p.length && p[i] === q[i]) i++;
  return { before: p.slice(Math.max(0, i - 60), i + 80), after: q.slice(Math.max(0, i - 60), i + 80) };
};

console.log(`${Object.keys(a).length} pages before, ${Object.keys(b).length} after`);
console.log(`  text changed: ${changed.length}   missing: ${missing.length}   new: ${added.length}`);
for (const k of changed.slice(0, 20)) {
  const d = firstDiff(a[k], b[k]);
  console.log(`  ${k}\n    before: …${d.before}…\n    after:  …${d.after}…`);
}

const shots = existsSync(join(before, "shots")) ? readdirSync(join(before, "shots")).sort() : [];
const pairs = shots.filter((f) => existsSync(join(after, "shots", f)));
console.log(`  screenshots to review side by side: ${pairs.length}`);

const i = process.argv.indexOf("--report");
if (i > 0) {
  const file = process.argv[i + 1];
  const rel = (dir, f) => relative(dirname(file), join(dir, "shots", f));
  const rows = pairs
    .map((f) => `<h2>${f.replace(/\.jpg$/, "").replace(/__/g, " · ")}</h2><div class="pair"><figure><figcaption>Before</figcaption><img src="${rel(before, f)}" loading="lazy"></figure><figure><figcaption>After</figcaption><img src="${rel(after, f)}" loading="lazy"></figure></div>`)
    .join("\n");
  writeFileSync(
    file,
    `<!doctype html><meta charset="utf-8"><title>OD-284 visual review</title><style>body{font:14px system-ui;margin:16px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:12px}img{width:100%;border:1px solid #ccc}h2{font-size:15px;margin:24px 0 8px}</style><h1>OD-284 visual review</h1><p>Text changed on ${changed.length} pages.</p>${rows}`,
  );
  console.log(`  review page: ${file}`);
}
process.exit(changed.length || missing.length ? 1 : 0);
