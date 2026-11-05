// OD-243: the gap between a control and its focus ring is a decision, border-width.focus-offset.
// shadcn wrote it by hand (ring-offset-2) in every focusable component. Each scheme gets the semantic
// (border-width.2, the 2px it was), each component that draws the gap a key of its own, and its
// source reads the key. Idempotent.
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const ROOT = new URL("..", import.meta.url).pathname;
const SCHEMES = ["dense-data", "content-first", "accessible-first", "brand-expressive", "multi-brand"];
const read = (p) => JSON.parse(readFileSync(ROOT + p, "utf8"));
const write = (p, o) => writeFileSync(ROOT + p, `${JSON.stringify(o, null, 2)}\n`);
const DESC = "The gap between a control and its focus ring, so the ring never touches the control and reads on any fill.";

for (const id of SCHEMES) {
  const s = read(`schemes/${id}.json`);
  const bw = s.tokens.semantic["border-width"];
  if (!bw["focus-offset"]) {
    bw["focus-offset"] = { $type: "dimension", $value: "{border-width.2}", $description: DESC };
    write(`schemes/${id}.json`, s);
  }
}

const dir = `${ROOT}ui/src/components/`;
const g = read("schemes/grammar.json");
let n = 0;
for (const f of readdirSync(dir).filter((x) => x.endsWith(".tsx"))) {
  const comp = f.replace(/\.tsx$/, "");
  let src = readFileSync(dir + f, "utf8");
  if (!/\bring-offset-2\b/.test(src)) continue;
  const key = `${comp}/focus-offset`;
  if (!g.component_keys.some((e) => e.id === key))
    execFileSync("node", [`${ROOT}scripts/add-key.mjs`, key, "--to", "border-width.focus-offset", "--description", `Gap between the ${comp.replace(/-/g, " ")} and its focus ring.`], { stdio: "inherit" });
  src = src.replace(/\bring-offset-2\b/g, `ring-offset-[length:var(--${comp}-focus-offset)]`);
  writeFileSync(dir + f, src);
  n++;
}
console.log(`border-width.focus-offset in ${SCHEMES.length} schemes; ${n} components read a focus-offset key of their own.`);
