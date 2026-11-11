// Put components' parts layers (OD-229) into the grammar's catalogue, after checking each one: every
// token is a component key that exists, every answer is a question the schemes answer, every rule a situation, every role a role.
// A part layer that fails is refused whole. Used to merge the parts layers parallel workers write.
//
//   node scripts/apply-anatomy.mjs anatomy-sidebar.json [anatomy-field.json …]
import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import { grammar, loadScheme, saveGrammar } from "../cli/src/schemes.mjs";

const ROOT = new URL("..", import.meta.url).pathname;
const read = (p) => JSON.parse(readFileSync(ROOT + p, "utf8"));
const g = grammar();
const scheme = loadScheme("dense-data");
const roles = new Set(g.anatomy.roles.map((r) => r.id));
const rules = new Set(g.situations.map((s) => s.id));
const questions = new Set(scheme.answers.map((a) => a.question));
const keyExists = (t) => {
  if (!t.startsWith("component.")) return false;
  const path = t.slice("component.".length).split(".");
  const n = path.reduce((o, k) => o?.[k], scheme.tokens.component);
  return Boolean(n && (n.$value !== undefined || n["@"]?.$value !== undefined));
};

export function checkAnatomy(component, spec) {
  const errs = [];
  let src = "";
  try {
    src = readFileSync(`${ROOT}ui/src/components/${component}.tsx`, "utf8");
  } catch {
    errs.push(`no ui/src/components/${component}.tsx`);
  }
  if (!g.catalogue.items.some((i) => i.id === component))
    errs.push(`${component} is not in the catalogue`);
  if (!spec.intro) errs.push("no intro");
  const flat = (l) =>
    l.flatMap((p) => [p, ...(p.children ? flat(p.children) : [])]);
  const parts = flat(spec.parts ?? []);
  const nums = new Set();
  for (const p of parts) {
    for (const r of p.roles ?? [])
      if (!roles.has(r)) errs.push(`part ${p.id}: role ${r} is not a role`);
    for (const t of p.tokens ?? [])
      if (!keyExists(t)) errs.push(`part ${p.id}: ${t} is not a component key`);
    if (!["required", "optional", "state"].includes(p.need))
      errs.push(`part ${p.id}: need ${p.need}`);
    if (p.n) {
      if (nums.has(p.n)) errs.push(`number ${p.n} is used twice`);
      nums.add(p.n);
    }
  }
  for (const c of spec.cards ?? []) {
    for (const n of c.parts)
      if (!nums.has(n))
        errs.push(`card ${c.title}: part ${n} has no number in the legend`);
    for (const r of c.roles ?? [])
      if (!roles.has(r)) errs.push(`card ${c.title}: role ${r}`);
    for (const q of c.answers ?? [])
      if (!questions.has(q))
        errs.push(`card ${c.title}: ${q} is not an answered question`);
    for (const r of c.rules ?? [])
      if (!rules.has(r)) errs.push(`card ${c.title}: ${r} is not a situation`);
    for (const t of c.tokens ?? [])
      if (!keyExists(t))
        errs.push(`card ${c.title}: ${t} is not a component key`);
  }
  return errs;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  let bad = 0;
  for (const f of process.argv.slice(2)) {
    const component = basename(f)
      .replace(/^anatomy-/, "")
      .replace(/\.json$/, "");
    const spec = JSON.parse(readFileSync(f, "utf8"));
    const errs = checkAnatomy(component, spec);
    if (errs.length) {
      bad++;
      console.error(`${component}: refused\n  ${errs.join("\n  ")}`);
      continue;
    }
    g.catalogue.items.find((i) => i.id === component).anatomy = spec;
    console.log(
      `${component}: parts layer in the grammar (${spec.cards.length} cards).`,
    );
  }
  saveGrammar(g);
  if (bad) process.exit(1);
}
