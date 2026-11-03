// Named checks for the definition-of-done harness.
// Each check says what it needs to exist (`requires`). If that is missing, the layer is
// "not built" yet, which is different from "fail". Slow checks (full builds) run with --full.

import { themeTokens } from "../cli/src/tokens.mjs";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

export const SCHEMES = ["dense-data", "content-first", "accessible-first", "multi-brand", "brand-expressive"];
export const COMPONENTS = [
  "button",
  "input",
  "label",
  "select",
  "checkbox",
  "switch",
  "badge",
  "card",
  "table",
  "tabs",
  "tooltip",
  "dialog",
  "dropdown-menu",
  "toast",
];
export const LAYOUT = [
  "schemes",
  "schema",
  "tokens",
  "ui",
  "cli",
  "mcp",
  "storybook",
  "site",
  "docs",
  "skills",
  "harness",
];
const SHADCN_VARS = [
  "--background",
  "--foreground",
  "--primary",
  "--primary-foreground",
  "--border",
  "--ring",
  "--radius",
];
const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  "out",
  "dist",
  "build",
  ".docusaurus",
  "storybook-static",
  ".venv",
]);

// ---------- helpers ----------

export function makeContext(root) {
  const p = (...parts) => join(root, ...parts);
  const has = (...parts) => existsSync(p(...parts));
  const read = (...parts) => readFileSync(p(...parts), "utf8");
  const json = (...parts) => JSON.parse(read(...parts));
  const walk = (dir, filter) => {
    const out = [];
    const start = p(dir);
    if (!existsSync(start)) return out;
    const stack = [start];
    while (stack.length) {
      const d = stack.pop();
      for (const name of readdirSync(d)) {
        if (SKIP_DIRS.has(name)) continue;
        const full = join(d, name);
        if (statSync(full).isDirectory()) stack.push(full);
        else if (!filter || filter(full)) out.push(relative(root, full));
      }
    }
    return out.sort();
  };
  const sh = (cmd, args, opts = {}) => {
    const r = spawnSync(cmd, args, {
      cwd: opts.cwd ?? root,
      encoding: "utf8",
      timeout: opts.timeout ?? 600_000,
      env: { ...process.env, ...opts.env },
    });
    return { code: r.status ?? 1, out: `${r.stdout ?? ""}${r.stderr ?? ""}`.trim() };
  };
  return { root, p, has, read, json, walk, sh };
}

const ok = (detail = "") => ({ ok: true, detail });
const bad = (detail) => ({ ok: false, detail });
// Not a failure: the work this check proves has not happened yet.
const pending = (detail) => ({ ok: false, pending: true, detail });
const tail = (s) => s.split("\n").slice(-6).join("\n");

function ajv() {
  const a = new Ajv2020({ allErrors: true, strict: false });
  addFormats(a);
  return a;
}

// Walk every object in a JSON value, with its path.
function* objects(value, path = "$") {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) yield* objects(value[i], `${path}[${i}]`);
  } else if (value && typeof value === "object") {
    yield [path, value];
    for (const [k, v] of Object.entries(value)) yield* objects(v, `${path}.${k}`);
  }
}

// Flatten a DTCG group into { "a.b.c": token }.
export function flatten(group, prefix = "") {
  const out = {};
  for (const [k, v] of Object.entries(group ?? {})) {
    if (k.startsWith("$")) continue;
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && "$value" in v) out[path] = v;
    else if (v && typeof v === "object") Object.assign(out, flatten(v, path));
  }
  return out;
}

// Merge DTCG trees the way Style Dictionary does: a token replaces a group with the same path.
export function mergeTrees(...trees) {
  const out = {};
  for (const tree of trees) {
    for (const [k, v] of Object.entries(tree ?? {})) {
      const isGroup = (x) => x && typeof x === "object" && !("$value" in x);
      out[k] = isGroup(v) && isGroup(out[k]) ? mergeTrees(out[k], v) : v;
    }
  }
  return out;
}

// Follow {references} to a literal value.
export function resolve(all, path, seen = new Set()) {
  if (seen.has(path)) return { error: "is part of a reference cycle" };
  const t = all[path];
  if (!t) return { error: "does not exist" };
  const m = typeof t.$value === "string" && t.$value.match(/^\{([^}]+)\}$/);
  if (!m) return { value: t.$value };
  seen.add(path);
  const r = resolve(all, m[1], seen);
  return r.error ? { error: `→ ${m[1]} ${r.error}` } : r;
}

function frontMatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  return m ? m[1] : null;
}

// Build the tokens once per run if a check needs the output.
let tokensBuilt = false;
function ensureTokens(c) {
  if (tokensBuilt) return null;
  const r = c.sh("pnpm", ["--dir", "tokens", "build"]);
  if (r.code !== 0) return r.out;
  tokensBuilt = true;
  return null;
}

// ---------- checks ----------

export const CHECKS = {
  // Harness
  "harness-covers-specs": {
    requires: ["harness/specs.json"],
    run: (c) => {
      const items = c.json("harness/specs.json").items;
      const missing = items.flatMap((i) => i.checks).filter((n) => !CHECKS[n]);
      const noIn = items.filter((i) => !i.in?.length).map((i) => i.id);
      if (missing.length) return bad(`unknown checks: ${missing.join(", ")}`);
      if (noIn.length) return bad(`specs without In: ${noIn.join(", ")}`);
      return ok(`${items.length} specs mapped`);
    },
  },
  "harness-self-test": {
    requires: ["harness/test"],
    slow: true,
    run: (c) => {
      const r = c.sh("node", ["--test"], { cwd: c.p("harness") });
      return r.code === 0 ? ok("harness tests pass") : bad(tail(r.out));
    },
  },

  // Schemes
  "schemes-five": {
    requires: ["schemes/grammar.json"],
    run: (c) => {
      const missing = SCHEMES.filter((s) => !c.has("schemes", `${s}.json`));
      return missing.length ? bad(`missing: ${missing.join(", ")}`) : ok("5 schemes");
    },
  },
  "schemes-answer-every-question": {
    requires: ["schemes/grammar.json", ...SCHEMES.map((s) => `schemes/${s}.json`)],
    run: (c) => {
      const g = c.json("schemes/grammar.json");
      const qids = [...g.reasons, ...g.scopes].flatMap((x) => x.questions.map((q) => q.id));
      const gaps = [];
      for (const s of SCHEMES) {
        const answered = new Set(c.json("schemes", `${s}.json`).answers.map((a) => a.question));
        const miss = qids.filter((q) => !answered.has(q));
        if (miss.length) gaps.push(`${s}: ${miss.length} unanswered (${miss.slice(0, 3).join(", ")}…)`);
      }
      return gaps.length ? bad(gaps.join("; ")) : ok(`${qids.length} questions answered by every scheme`);
    },
  },
  "schemes-because-resolves": {
    requires: ["schemes/grammar.json", ...SCHEMES.map((s) => `schemes/${s}.json`)],
    run: (c) => {
      const g = c.json("schemes/grammar.json");
      const qids = new Set([...g.reasons, ...g.scopes].flatMap((x) => x.questions.map((q) => q.id)));
      const broken = [];
      for (const s of SCHEMES) {
        const sch = c.json("schemes", `${s}.json`);
        for (const a of sch.answers)
          for (const b of a.because ?? []) if (!qids.has(b)) broken.push(`${s}:${a.question}→${b}`);
        for (const u of sch.usage ?? [])
          for (const b of u.because ?? []) if (!qids.has(b)) broken.push(`${s}:${u.situation}→${b}`);
      }
      return broken.length
        ? bad(`broken because links: ${broken.slice(0, 5).join(", ")}`)
        : ok("every because link resolves");
    },
  },
  "schemes-usage-rules": {
    requires: ["schemes/grammar.json", ...SCHEMES.map((s) => `schemes/${s}.json`)],
    run: (c) => {
      const sits = c.json("schemes/grammar.json").situations.map((s) => s.id);
      const gaps = [];
      for (const s of SCHEMES) {
        const have = new Set((c.json("schemes", `${s}.json`).usage ?? []).filter((u) => u.why).map((u) => u.situation));
        const miss = sits.filter((x) => !have.has(x));
        if (miss.length) gaps.push(`${s}: ${miss.length} situations without a rule and a why`);
      }
      return gaps.length ? bad(gaps.join("; ")) : ok(`${sits.length} situations answered with a why by every scheme`);
    },
  },

  "schemes-tokens-resolve": {
    requires: ["schemes/grammar.json", ...SCHEMES.map((s) => `schemes/${s}.json`)],
    run: (c) => {
      const problems = [];
      for (const s of SCHEMES) {
        const t = c.json("schemes", `${s}.json`).tokens;
        for (const brand of Object.keys(t.brands)) {
          const th = t.brands[brand].theme;
          if (Object.keys(flatten(th.light)).sort().join() !== Object.keys(flatten(th.dark)).sort().join())
            problems.push(`${s}/${brand}: the light and dark themes have different keys`);
          for (const mode of ["light", "dark"]) {
            const all = flatten(themeTokens({ id: s, tokens: t }, brand, mode));
            for (const path of Object.keys(all)) {
              const r = resolve(all, path);
              if (r.error) problems.push(`${s}/${brand}/${mode}: ${path} ${r.error}`);
            }
          }
        }
      }
      return problems.length
        ? bad(`${problems.length} problems: ${problems.slice(0, 4).join("; ")}`)
        : ok("every token resolves in every brand and mode");
    },
  },

  "release-surface": {
    requires: ["cli/package.json", "cli/surface.json", "scripts/release.mjs"],
    run: async (c) => {
      // The CLI's version and the snapshot of its public surface move together (OD-165).
      const err = ensureTokens(c);
      if (err) return bad(tail(err));
      const { surface, diff } = await import(pathToFileURL(c.p("scripts/release.mjs")).href);
      const pkg = c.json("cli/package.json");
      const snap = c.json("cli/surface.json");
      if (pkg.version !== snap.version)
        return bad(
          `cli/package.json is ${pkg.version}, cli/surface.json is ${snap.version}: release with node scripts/release.mjs`,
        );
      const d = diff(snap.surface, surface(), snap.version);
      return ok(
        d.changed
          ? `${pkg.version}: unreleased surface changes; the next release needs at least a ${d.needs} bump`
          : `${pkg.version}: the public surface matches the last release`,
      );
    },
  },

  "semantics-guidance": {
    requires: ["schemes/grammar.json", ...SCHEMES.map((s) => `schemes/${s}.json`)],
    run: (c) => {
      // Every colour semantic has guidance in the grammar; every key it names exists; every pair keeps
      // its contrast in every brand and mode. No exceptions: a failing pair fails the check.
      const g = c.json("schemes", "grammar.json");
      const guide = new Map(g.semantics.keys.map((k) => [k.id, k]));
      const gaps = [];
      const lum = (hex) => {
        const [r, gr, b] = [1, 3, 5]
          .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
          .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
        return 0.2126 * r + 0.7152 * gr + 0.0722 * b;
      };
      const ratio = (a, b) => {
        const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
        return (x + 0.05) / (y + 0.05);
      };
      for (const id of g.semantics.urgency.order)
        if (!guide.has(id)) gaps.push(`urgency names ${id}, which has no guidance`);
      let pairs = 0;
      for (const s of SCHEMES) {
        const t = c.json("schemes", `${s}.json`).tokens;
        const semantic = Object.keys(flatten(t.semantic)).filter((p) => p.startsWith("color."));
        for (const p of semantic) if (!guide.has(p)) gaps.push(`${s}: ${p} has no guidance in the grammar`);
        for (const k of guide.values()) {
          if (!semantic.includes(k.id)) gaps.push(`${s}: guidance for ${k.id}, which the scheme does not define`);
          for (const n of k.not_for)
            if (!semantic.includes(n.use)) gaps.push(`${k.id}: not_for names ${n.use}, which ${s} does not define`);
          for (const on of k.pairs?.on ?? [])
            if (!semantic.includes(on)) gaps.push(`${k.id}: pairs with ${on}, which ${s} does not define`);
          if (k.pairs && k.pairs.contrast === null && !k.exempt) gaps.push(`${k.id}: no contrast and no exempt reason`);
        }
        for (const brand of Object.keys(t.brands))
          for (const mode of ["light", "dark"]) {
            const all = flatten(themeTokens({ id: s, tokens: t }, brand, mode));
            const hex = (p) => {
              const v = resolve(all, p).value;
              return typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v) ? v : null;
            };
            for (const k of guide.values()) {
              if (!k.pairs?.contrast) continue;
              for (const on of k.pairs.on) {
                const [a, b] = [hex(k.id), hex(on)];
                if (!a || !b) continue;
                pairs++;
                const r = ratio(a, b);
                if (r < k.pairs.contrast)
                  gaps.push(
                    `${s}/${brand}/${mode}: ${k.id} on ${on} is ${r.toFixed(2)}:1, needs ${k.pairs.contrast}:1`,
                  );
              }
            }
          }
      }
      return gaps.length
        ? bad(`${gaps.length} problems: ${gaps.slice(0, 5).join("; ")}`)
        : ok(
            `${guide.size} colour semantics have guidance; ${pairs} pairs keep their contrast in every brand and mode`,
          );
    },
  },

  "tokens-semantics-are-links": {
    requires: ["schemes/grammar.json"],
    run: (c) => {
      // Raw values live only on primitives. Every semantic and component token points to another token.
      const gaps = [];
      const walk = (node, path, out) => {
        if (node && typeof node === "object" && "$value" in node) {
          const v = node.$value;
          if (!(typeof v === "string" && /^\{[^}]+\}$/.test(v))) out.push(path);
          return;
        }
        if (node && typeof node === "object")
          for (const [k, v] of Object.entries(node)) if (!k.startsWith("$")) walk(v, path ? `${path}.${k}` : k, out);
      };
      for (const id of SCHEMES) {
        const t = c.json("schemes", `${id}.json`).tokens;
        const raw = [];
        walk(t.semantic, "", raw);
        for (const b of Object.values(t.brands)) walk(b.theme, "", raw);
        walk(t.component, "", raw);
        if (raw.length) gaps.push(`${id}: raw values on ${raw.slice(0, 4).join(", ")}`);
      }
      return gaps.length
        ? bad(gaps.join("; "))
        : ok("every semantic and component token is a link; values live on primitives");
    },
  },

  "inventory-decided": {
    requires: ["schemes/grammar.json"],
    run: (c) => {
      // OD-211: every catalogue item is decided in every scheme. It is in, with why (a limited use
      // says where it fits), or out, with the reason argued from the scheme's answers and what to use
      // instead. Nothing falls out by default.
      const items = c.json("schemes", "grammar.json").catalogue.items.map((i) => i.id);
      const gaps = [];
      for (const id of SCHEMES) {
        const s = c.json("schemes", `${id}.json`);
        const inn = new Map(s.inventory.in.map((x) => [x.id, x]));
        const out = new Map(s.inventory.out.map((x) => [x.id, x]));
        const answers = new Set(s.answers.map((a) => a.question));
        const undecided = items.filter((i) => !inn.has(i) && !out.has(i));
        if (undecided.length)
          gaps.push(
            `${id}: no decision on ${undecided.slice(0, 5).join(", ")}${undecided.length > 5 ? ` and ${undecided.length - 5} more` : ""}`,
          );
        const both = [...out.keys()].filter((i) => inn.has(i));
        if (both.length) gaps.push(`${id}: both in and out: ${both.join(", ")}`);
        for (const [cid, o] of out) {
          if (!o.why?.trim()) gaps.push(`${id}/${cid}: out with no why`);
          if (!o.instead?.length) gaps.push(`${id}/${cid}: out with nothing to use instead`);
          for (const x of o.instead ?? [])
            if (!inn.has(x) || x === cid) gaps.push(`${id}/${cid}: instead ${x} is not in the inventory`);
          if (!o.because?.length) gaps.push(`${id}/${cid}: out with no answers behind it`);
          for (const q of o.because ?? [])
            if (!answers.has(q)) gaps.push(`${id}/${cid}: because ${q} is not an answer`);
        }
      }
      return gaps.length
        ? bad(gaps.slice(0, 8).join("; ") + (gaps.length > 8 ? `; and ${gaps.length - 8} more` : ""))
        : ok(
            "every scheme decides every catalogue component: in with why, or out with its answers and what to use instead",
          );
    },
  },

  "storybook-stories-uniform": {
    requires: ["storybook/stories", "storybook/.storybook/component-docs.mdx"],
    run: (c) => {
      // Every component's stories have the same shape: parameters.openDs names the component and its
      // situations, then Playground and Examples. Explanations live on the docs page, not in the canvas.
      const dir = join(c.root, "storybook", "stories");
      const gaps = [];
      for (const f of readdirSync(dir).filter((x) => x.endsWith(".stories.tsx"))) {
        const text = readFileSync(join(dir, f), "utf8");
        const name = f.replace(".stories.tsx", "");
        const exports = [...text.matchAll(/export const (\w+): Story/g)].map((m) => m[1]);
        if (exports.join(",") !== "Playground,Examples")
          gaps.push(`${f}: exports ${exports.join(", ")}, not Playground, Examples`);
        if (!new RegExp(`openDs: \\{\\s*component: "${name}"`).test(text))
          gaps.push(`${f}: no openDs parameters for ${name}`);
        if (/<Usage\b/.test(text)) gaps.push(`${f}: usage text inside the canvas`);
      }
      return gaps.length
        ? bad(gaps.slice(0, 6).join("; "))
        : ok("every component's stories are Playground and Examples, with one docs template");
    },
  },

  "schemes-samples": {
    requires: ["schemes/grammar.json"],
    run: (c) => {
      // Each scheme shows itself with its own content: every sample part a story reads is there, so every
      // component renders in every scheme, carried or not (OD-192). Statuses carry a meaning, rows use
      // those statuses, and no two schemes share a screen or rows.
      const NEEDS = {
        badge: "statuses",
        card: "card",
        checkbox: "checkbox",
        dialog: "confirm",
        "dropdown-menu": "menu",
        select: "select",
        switch: "switches",
        table: "table",
        tabs: "tabs",
        toast: "messages",
        tooltip: "icon_action",
      };
      const gaps = [];
      const seen = new Map();
      for (const id of SCHEMES) {
        const s = c.json("schemes", `${id}.json`);
        const smp = s.samples;
        if (!smp) {
          gaps.push(`${id}: no samples`);
          continue;
        }
        const inv = s.inventory.in.map((i) => i.id);
        for (const [comp, part] of Object.entries(NEEDS))
          if (!smp[part])
            gaps.push(
              `${id}: samples has no ${part}, so ${comp} cannot show ${inv.includes(comp) ? "its inventory" : "in this scheme"}`,
            );
        const labels = new Set((smp.statuses ?? []).map((x) => x.label));
        for (const r of smp.table?.rows ?? []) {
          if (!labels.has(r.status)) gaps.push(`${id}: row status "${r.status}" is not in statuses`);
          if (r.cells.length !== smp.table.columns.length - 1) gaps.push(`${id}: a row has the wrong number of cells`);
        }
        if (smp.card && !labels.has(smp.card.status))
          gaps.push(`${id}: card status "${smp.card.status}" is not in statuses`);
        for (const key of [smp.screen, ...(smp.table?.rows ?? []).map((r) => r.cells.join("|"))]) {
          if (seen.has(key)) gaps.push(`${id} and ${seen.get(key)} share "${key}"`);
          seen.set(key, id);
        }
      }
      return gaps.length
        ? bad(gaps.slice(0, 6).join("; "))
        : ok("every scheme has its own content for every component, and every status has a meaning");
    },
  },

  "components-reference": {
    requires: ["schemes/grammar.json"],
    run: (c) => {
      // OD-185. The reference says what each component and variant is for, the same in every design
      // system; each scheme decides every variant of what it carries. Applies to every catalogue item
      // with a reference, so it widens as components are filled in.
      const g = c.json("schemes", "grammar.json");
      const items = g.catalogue?.items ?? [];
      const ids = new Set(items.map((i) => i.id));
      const sits = new Set(g.situations.map((s) => s.id));
      const gaps = [];
      // The variant axes and options a built component declares in its cva(...) call.
      const builtAxes = (id) => {
        if (!c.has("ui", "src", "components", `${id}.tsx`)) return null;
        const src = c.read("ui", "src", "components", `${id}.tsx`);
        const start = src.indexOf("variants: {");
        if (start < 0) return {};
        const axes = {};
        let depth = 0;
        let axis = null;
        for (const line of src.slice(start + "variants: {".length).split("\n")) {
          if (depth === 0) {
            const m = line.match(/^\s*([a-zA-Z-]+): \{/);
            if (m) axis = axes[m[1]] = [];
          } else if (depth === 1 && axis) {
            const m = line.match(/^\s*"?([a-zA-Z-]+)"?:/);
            if (m) axis.push(m[1]);
          }
          for (const ch of line) depth += ch === "{" ? 1 : ch === "}" ? -1 : 0;
          if (depth < 0) break;
        }
        return axes;
      };
      const ref = items.filter((i) => i.overview);
      for (const i of ref) {
        for (const f of ["apply_when", "not_when", "source"]) if (!i[f]) gaps.push(`${i.id}: reference has no ${f}`);
        for (const v of i.vs ?? [])
          if (!v.outside && !ids.has(v.id)) gaps.push(`${i.id}: vs ${v.id} is not in the catalogue`);
        for (const s of i.situations ?? [])
          if (!sits.has(s)) gaps.push(`${i.id}: situation ${s} is not in the grammar`);
        const built = builtAxes(i.id);
        if (built)
          for (const [axis, opts] of Object.entries(built)) {
            const refOpts = (i.variants?.[axis] ?? []).map((v) => v.id);
            if (opts.join() !== refOpts.join())
              gaps.push(
                `${i.id}: the built ${axis} axis is ${opts.join(", ")} but the reference says ${refOpts.join(", ") || "nothing"}`,
              );
          }
      }
      const byId = Object.fromEntries(ref.map((i) => [i.id, i]));
      for (const sid of SCHEMES) {
        const s = c.json("schemes", `${sid}.json`);
        const answered = new Set(s.answers.map((a) => a.question));
        const carried = Object.fromEntries(s.inventory.in.map((x) => [x.id, x]));
        const decided = (comp, axis, v) => carried[comp]?.variants?.[axis]?.[v];
        for (const [id, item] of Object.entries(carried)) {
          const r = byId[id];
          if (!r) continue;
          for (const [axis, list] of Object.entries(r.variants ?? {})) {
            for (const v of list)
              if (!decided(id, axis, v.id)) gaps.push(`${sid}: ${id} ${axis} ${v.id} is not decided`);
            for (const extra of Object.keys(item.variants?.[axis] ?? {}))
              if (!list.some((v) => v.id === extra))
                gaps.push(`${sid}: ${id} ${axis} ${extra} is not in the reference`);
          }
          for (const [axis, vs] of Object.entries(item.variants ?? {}))
            for (const [v, d] of Object.entries(vs))
              for (const q of d.because ?? [])
                if (!answered.has(q)) gaps.push(`${sid}: ${id} ${axis} ${v} cites ${q}, which it does not answer`);
        }
        for (const u of s.usage)
          for (const x of u.uses ?? []) {
            if (!carried[x.component])
              gaps.push(`${sid}: ${u.situation} uses ${x.component}, which is not in the inventory`);
            else if (x.variant) {
              const d = decided(x.component, x.axis, x.variant);
              if (byId[x.component] && !d)
                gaps.push(`${sid}: ${u.situation} uses ${x.component} ${x.axis} ${x.variant}, which is not decided`);
              if (d?.not_used)
                gaps.push(`${sid}: ${u.situation} uses ${x.component} ${x.axis} ${x.variant}, which it does not use`);
            }
          }
      }
      return gaps.length
        ? bad(gaps.slice(0, 8).join("; ") + (gaps.length > 8 ? ` (+${gaps.length - 8} more)` : ""))
        : ok(
            `${ref.length} components have a reference; every scheme decides every variant of them, and every uses entry checks out`,
          );
    },
  },

  "schemes-inventory": {
    requires: ["schemes/grammar.json"],
    run: (c) => {
      // Each scheme's inventory is an output of its components answers: real catalogue items. The
      // roles answer names the families it draws from first; a component from another family can be in
      // when its entry says where it fits (OD-214, less rigid). The count answer describes the size.
      const g = c.json("schemes", "grammar.json");
      const items = Object.fromEntries((g.catalogue?.items ?? []).map((i) => [i.id, i]));
      // The families each roles option admits live in the grammar, so the site and this check agree.
      const ROLES = g.catalogue?.roles ?? {};
      const gaps = [];
      for (const id of SCHEMES) {
        const s = c.json("schemes", `${id}.json`);
        const inv = s.inventory;
        if (!inv?.in?.length) {
          gaps.push(`${id}: no inventory`);
          continue;
        }
        const answer = (q) => s.answers.find((a) => a.question === q)?.option;
        const families = ROLES[answer("components.roles")] ?? [];
        const ids = inv.in.map((i) => i.id);
        if (new Set(ids).size !== ids.length) gaps.push(`${id}: an inventory item is listed twice`);
        for (const i of inv.in) {
          if (!items[i.id]) gaps.push(`${id}: ${i.id} is not in the catalogue`);
          else if (!families.includes(items[i.id].family) && !i.why?.trim())
            gaps.push(
              `${id}: ${i.id} is ${items[i.id].family}, outside its roles answer, with no word on where it fits`,
            );
        }
        for (const o of inv.out ?? []) {
          if (!items[o.id]) gaps.push(`${id}: out item ${o.id} is not in the catalogue`);
          if (ids.includes(o.id)) gaps.push(`${id}: ${o.id} is both in and out`);
        }
        if (!inv.follows?.some((f) => f.startsWith("components.")))
          gaps.push(`${id}: the inventory follows no components answer`);
      }
      return gaps.length
        ? bad(gaps.slice(0, 6).join("; "))
        : ok("every scheme's inventory matches its components answers and the catalogue");
    },
  },

  "schemes-voice-and-themes": {
    requires: [...SCHEMES.map((s) => `schemes/${s}.json`)],
    run: (c) => {
      const gaps = [];
      for (const s of SCHEMES) {
        const sch = c.json("schemes", `${s}.json`);
        const v = sch.voice;
        const g = c.json("schemes", "grammar.json");
        const voiceSits = g.situations.filter((x) => x.scope === "voice").map((x) => x.id);
        const withExample = sch.usage.filter((u) => voiceSits.includes(u.situation) && u.example);
        if (!v?.summary?.text || voiceSits.length < 5 || withExample.length !== voiceSits.length)
          gaps.push(`${s}: voice and tone incomplete (every voice situation needs a rule with an example)`);
        for (const b of Object.keys(sch.tokens.brands)) {
          for (const m of ["light", "dark"])
            if (!sch.themes.some((t) => t.brand === b && t.mode === m)) gaps.push(`${s}: ${b} has no ${m}`);
        }
      }
      const brands = Object.keys(c.json("schemes", "multi-brand.json").tokens.brands);
      if (brands.length < 3) gaps.push(`multi-brand has ${brands.length} brands; a real setup needs at least 3`);
      return gaps.length
        ? bad(gaps.join("; "))
        : ok("voice and tone in every scheme; light and dark for every brand; multi-brand has 3 brands");
    },
  },

  "scopes-uniform-template": {
    requires: ["schemes/grammar.json", ...SCHEMES.map((s) => `schemes/${s}.json`)],
    run: (c) => {
      const g = c.json("schemes", "grammar.json");
      const gaps = [];
      const methods = (g.methods ?? []).map((m) => m.id);
      if (methods.join() !== "roles,count,definition,values,lands")
        gaps.push(`methods are ${methods.join() || "missing"}`);
      if (g.reasons.some((r) => r.id === "voice")) gaps.push("voice is a reason; it must be a scope");
      if (!g.scopes.some((x) => x.id === "voice")) gaps.push("voice and tone is not a scope");
      const comps = new Map(g.components.map((x) => [x.id, x]));
      const keyDefault = new Map(g.component_keys.map((k) => [k.id, k.default]));
      const schemes = SCHEMES.map((id) => c.json("schemes", `${id}.json`));
      const has = (tree, path) =>
        path.split(".").reduce((n, p) => (n && typeof n === "object" ? n[p] : undefined), tree) !== undefined;
      const semantic = (sch) => sch.tokens.semantic;
      for (const sc of g.scopes) {
        const got = sc.questions.map((q) => q.method).join();
        if (got !== methods.join()) gaps.push(`${sc.id}: methods ${got}`);
        for (const q of sc.questions) if (q.id !== `${sc.id}.${q.method}`) gaps.push(`${sc.id}: question id ${q.id}`);
        if (!sc.owns?.length) gaps.push(`${sc.id}: owns no tokens`);
        if (!sc.lands_in?.length) gaps.push(`${sc.id}: lands in no component`);
        const sits = g.situations.filter((x) => x.scope === sc.id).map((x) => x.id);
        if (!sits.length) gaps.push(`${sc.id}: has no situation`);
        if ((sc.situations ?? []).join() !== sits.join()) gaps.push(`${sc.id}: situations list is out of date`);
        for (const sch of schemes) {
          const trees = [
            sch.tokens.primitive,
            semantic(sch),
            { theme: Object.values(sch.tokens.brands)[0].theme },
            { component: sch.tokens.component },
            { content: sch.tokens.content },
          ];
          for (const o of sc.owns ?? [])
            if (!trees.some((t) => has(t, o))) gaps.push(`${sch.id}: ${sc.id} owns ${o}, which is not a token`);
        }
        const semanticOwns = (sc.owns ?? []).filter((o) => has(semantic(schemes[0]), o));
        for (const cid of sc.lands_in ?? []) {
          if (!comps.has(cid)) {
            gaps.push(`${sc.id}: lands in ${cid}, which is not a component`);
            continue;
          }
          if (
            semanticOwns.length &&
            !comps.get(cid).keys.some((k) => semanticOwns.some((o) => keyDefault.get(k).startsWith(o)))
          )
            gaps.push(`${sc.id}: lands in ${cid}, but no ${cid} key reads ${semanticOwns.join(" or ")}`);
        }
      }
      for (const x of g.situations)
        if (!g.scopes.some((sc) => sc.id === x.scope)) gaps.push(`situation ${x.id} has no scope`);
      return gaps.length
        ? bad(gaps.slice(0, 12).join("; "))
        : ok(`${g.scopes.length} scopes, each with the 5 method questions, owned tokens, components and situations`);
    },
  },

  "outputs-follow-answers": {
    requires: ["schemes/grammar.json", ...SCHEMES.map((s) => `schemes/${s}.json`)],
    run: (c) => {
      const g = c.json("schemes", "grammar.json");
      const qids = new Set([...g.reasons, ...g.scopes].flatMap((x) => x.questions.map((q) => q.id)));
      const gaps = [];
      if (!g.reasons.some((r) => r.id === "scenarios")) gaps.push("no use scenario questions");
      let n = 0;
      for (const id of SCHEMES) {
        const s = c.json("schemes", `${id}.json`);
        const extra = Object.keys(s.voice).filter((k) => !["summary", "principles", "words", "brands"].includes(k));
        if (extra.length) gaps.push(`${id}: free voice text outside the outputs: ${extra.join(", ")}`);
        const outputs = [
          ["voice summary", s.voice.summary],
          ...s.voice.principles.map((p) => ["voice principle", p]),
          ["voice words", s.voice.words],
          ...Object.entries(s.voice.brands ?? {}).map(([b, v]) => [`voice brand ${b}`, v]),
          ...s.scenarios.map((x) => ["scenario", x]),
        ];
        for (const [what, o] of outputs) {
          n++;
          if (!o?.follows?.length) gaps.push(`${id}: ${what} follows no answer`);
          for (const f of o?.follows ?? [])
            if (!qids.has(f)) gaps.push(`${id}: ${what} follows ${f}, which is not a question`);
        }
        if (!s.scenarios.some((x) => x.follows?.some((f) => f.startsWith("scenarios."))))
          gaps.push(`${id}: no scenario follows the use scenario questions`);
      }
      return gaps.length ? bad(gaps.slice(0, 12).join("; ")) : ok(`${n} written outputs, each following real answers`);
    },
  },

  "content-no-real-names": {
    requires: [],
    run: (c) => {
      const NAMES = /\b(Northwind|Contoso|Fabrikam|Adventure Works|Initech|Globex|Acme Corp)\b/;
      const roots = ["schemes", "site/src", "storybook/stories", "docs/docs", "guide", "ui/src", "skills", "cli/src"];
      const hits = roots
        .flatMap((r) => c.walk(r, (f) => /\.(json|tsx?|mdx?|mjs)$/.test(f)))
        .filter((f) => NAMES.test(c.read(f)));
      return hits.length
        ? bad(`well-known sample names in: ${hits.join(", ")}`)
        : ok("no well-known sample company names");
    },
  },

  // JSON standards
  "json-schemas-2020-12": {
    requires: ["schema/scheme.schema.json"],
    run: (c) => {
      const files = c.walk("schema", (f) => f.endsWith(".schema.json")).concat(["harness/harness.schema.json"]);
      const wrong = files.filter((f) => c.json(f).$schema !== "https://json-schema.org/draft/2020-12/schema");
      return wrong.length
        ? bad(`not draft 2020-12: ${wrong.join(", ")}`)
        : ok(`${files.length} schemas on draft 2020-12`);
    },
  },
  "json-files-validate": {
    requires: ["schema/scheme.schema.json", "schemes/grammar.json"],
    run: (c) => {
      const a = ajv();
      const targets = [
        ["schemes/grammar.json", "schema/grammar.schema.json"],
        ...SCHEMES.filter((s) => c.has("schemes", `${s}.json`)).map((s) => [
          `schemes/${s}.json`,
          "schema/scheme.schema.json",
        ]),
        ["harness/specs.json", "harness/harness.schema.json"],
      ];
      const errs = [];
      for (const [file, schema] of targets) {
        const validate = a.compile(c.json(schema));
        if (!validate(c.json(file))) errs.push(`${file}: ${a.errorsText(validate.errors).slice(0, 200)}`);
        a.removeSchema();
      }
      return errs.length ? bad(errs.join(" | ")) : ok(`${targets.length} files valid`);
    },
  },

  // LLM context
  "llm-schema-descriptions": {
    requires: ["schema/scheme.schema.json"],
    run: (c) => {
      const missing = [];
      for (const f of ["schema/scheme.schema.json", "schema/grammar.schema.json"]) {
        if (!c.has(f)) continue;
        for (const [path, o] of objects(c.json(f))) {
          const isProp = /\.properties\.[^.]+$/.test(path) || /\.\$defs\.[^.]+$/.test(path);
          if (isProp && !o.description) missing.push(`${f} ${path}`);
        }
      }
      return missing.length
        ? bad(`${missing.length} schema properties without description: ${missing.slice(0, 4).join(", ")}`)
        : ok("every schema property has a description");
    },
  },
  "llm-scheme-descriptions": {
    requires: ["schemes/grammar.json", ...SCHEMES.map((s) => `schemes/${s}.json`)],
    run: (c) => {
      const missing = [];
      const g = c.json("schemes/grammar.json");
      for (const layer of [...g.reasons, ...g.scopes]) {
        if (!layer.description) missing.push(`grammar ${layer.id}`);
        for (const q of layer.questions) if (!q.description) missing.push(`grammar ${q.id}`);
      }
      for (const s of g.situations) if (!s.description) missing.push(`grammar ${s.id}`);
      for (const s of SCHEMES) {
        const sch = c.json("schemes", `${s}.json`);
        if (!sch.description || !sch.ai?.use_when) missing.push(`${s} root`);
        for (const a of sch.answers) if (!a.why) missing.push(`${s} ${a.question}`);
      }
      return missing.length
        ? bad(`${missing.length} objects without agent context: ${missing.slice(0, 5).join(", ")}`)
        : ok("every grammar and scheme object has agent context");
    },
  },
  "llm-files": {
    requires: ["scripts/build-llms.mjs"],
    run: (c) => {
      const need = ["llms.txt", "llms-full.txt", "AGENTS.md"];
      const missing = need.filter((f) => !c.has(f));
      if (missing.length) return bad(`missing: ${missing.join(", ")}`);
      const llms = c.read("llms.txt");
      if (!llms.startsWith("# ")) return bad("llms.txt must start with an H1 (llmstxt.org format)");
      const stale = SCHEMES.filter((s) => !llms.includes(s));
      const fresh = c.sh("node", ["scripts/build-llms.mjs", "--check"]);
      if (fresh.code !== 0) return bad(fresh.out);
      return stale.length
        ? bad(`llms.txt does not list: ${stale.join(", ")}`)
        : ok("llms.txt, llms-full.txt and AGENTS.md present and current");
    },
  },
  "llm-skill": {
    requires: ["skills"],
    run: (c) => {
      const f = "skills/open-ds/SKILL.md";
      if (!c.has(f)) return bad(`missing ${f}`);
      const fm = frontMatter(c.read(f));
      if (!fm || !/^name:\s*\S+/m.test(fm) || !/^description:\s*\S+/m.test(fm))
        return bad("SKILL.md needs front matter with name and description");
      return ok("agent skill has name and description");
    },
  },
  "skills-shape": {
    requires: ["skills", "cli/src/mcp.mjs", "cli/src/cli.mjs"],
    run: (c) => {
      // OD-198: every skill follows the skill standard in Orchestra, and names only real tools.
      // Front matter: name (the folder), a description that says what and "Use when" in at most 25
      // words, and tools: the grant list. Body: Why, When, Input, Run, Done, in that order, with at most
      // 20 words a sentence. Every listed tool exists and appears in a step; every tool, command and
      // skill the body names exists. A standard that nothing checks gets missed.
      const tools = new Set([...c.read("cli/src/mcp.mjs").matchAll(/registerTool\(\s*"(\w+)"/g)].map((m) => m[1]));
      const commands = new Set([...c.read("cli/src/cli.mjs").matchAll(/open-ds ([a-z]+)\s/g)].map((m) => m[1]));
      const names = c.walk("skills", (f) => f.endsWith("SKILL.md")).map((f) => f.split("/").at(-2));
      const SECTIONS = ["Why", "When", "Input", "Run", "Done"];
      const gaps = [];
      for (const name of names) {
        const f = `skills/${name}/SKILL.md`;
        const text = c.read(f);
        const fm = frontMatter(text) ?? "";
        const body = text.replace(/^---\n[\s\S]*?\n---\n/, "");
        const field = (k) => fm.match(new RegExp(`^${k}:\\s*(.*)$`, "m"))?.[1]?.trim() ?? "";
        if (field("name") !== name) gaps.push(`${f}: name is not ${name}`);
        const desc = field("description");
        if (!/\bUse when\b/.test(desc)) gaps.push(`${f}: the description has no "Use when"`);
        if (desc.split(/\s+/).length > 25) gaps.push(`${f}: the description has more than 25 words`);
        // tools: a YAML list, one tool a line ("  - get_component"), or inline ([a, b]).
        const block = fm.match(/^tools:\s*\n((?:\s+-\s+\S+\n?)+)/m)?.[1];
        const granted = block
          ? [...block.matchAll(/-\s+(\S+)/g)].map((m) => m[1])
          : (field("tools").match(/^\[(.*)\]$/)?.[1] ?? "")
              .split(",")
              .map((x) => x.trim())
              .filter(Boolean);
        if (!granted.length) gaps.push(`${f}: no tools list in the front matter`);
        const heads = [...body.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
        if (heads.join(",") !== SECTIONS.join(","))
          gaps.push(`${f}: sections are ${heads.join(", ")}, not ${SECTIONS.join(", ")}`);
        const steps = body.split(/^## Run$/m)[1]?.split(/^## /m)[0] ?? "";
        for (const tool of granted) {
          if (!tools.has(tool)) gaps.push(`${f}: tools lists ${tool}, which the MCP server does not have`);
          else if (!steps.includes(`\`${tool}`)) gaps.push(`${f}: ${tool} is listed but no Run step uses it`);
        }
        for (const m of body.matchAll(/`((?:get|list|plan|compare|what|when|check|find|fit)_[a-z_]+)/g))
          if (!tools.has(m[1]) && !["use_when", "avoid_when"].includes(m[1]))
            gaps.push(`${f}: names ${m[1]}, which is not an MCP tool`);
        for (const m of body.matchAll(/`(?:npx )?open-ds ([a-z]+)/g))
          if (!commands.has(m[1])) gaps.push(`${f}: names open-ds ${m[1]}, which is not a CLI command`);
        for (const m of body.matchAll(/`(open-ds-[a-z]+)`/g))
          if (!names.includes(m[1])) gaps.push(`${f}: names ${m[1]}, which is not a skill`);
        // Sentences: prose and list items, without tables, headings and code.
        const prose = body
          .split("\n")
          .filter((l) => !/^\s*(\||#)/.test(l))
          .map((l) => l.replace(/^\s*(?:[-*]|\d+\.)\s+/, "").replace(/`[^`]*`/g, "X"))
          .join("\n");
        for (const s of prose.split(/(?<=[.!?])\s+|\n{2,}|\n(?=\S)/)) {
          const words = s.trim().split(/\s+/).filter(Boolean).length;
          if (words > 20) gaps.push(`${f}: a sentence has ${words} words: "${s.trim().slice(0, 50)}…"`);
        }
      }
      return gaps.length
        ? bad(gaps.slice(0, 8).join("; "))
        : ok(`${names.length} skills follow the standard: front matter, Why to Done, short sentences, real tools`);
    },
  },
  "mcp-instructions": {
    requires: ["cli/src/mcp.mjs", "skills"],
    run: (c) => {
      // OD-204: the server instructions are the first thing an agent reads when it connects. Every
      // tool they name exists, every prompt they name is a skill, and every tool reaches agents:
      // through the instructions or a skill's tools list. Nothing else checks this text, so it drifted
      // once already.
      const src = c.read("cli/src/mcp.mjs");
      const tools = [...src.matchAll(/registerTool\(\s*"(\w+)"/g)].map((m) => m[1]);
      const start = src.indexOf("const INSTRUCTIONS = `");
      if (start < 0) return bad("cli/src/mcp.mjs has no INSTRUCTIONS");
      const text = src.slice(start, src.indexOf("`;", start));
      const skills = c.walk("skills", (f) => f.endsWith("SKILL.md"));
      const names = skills.map((f) => f.split("/").at(-2));
      const granted = new Set(skills.flatMap((f) => [...c.read(f).matchAll(/^\s+-\s+(\w+)\s*$/gm)].map((m) => m[1])));
      const gaps = [];
      for (const m of text.matchAll(/\b((?:get|list|plan|compare|what|when|check|find|fit)_[a-z_]+)\b/g))
        if (!tools.includes(m[1])) gaps.push(`the instructions name ${m[1]}, which is not a tool`);
      for (const m of text.matchAll(/\b(open-ds-[a-z]+)\b/g))
        if (!names.includes(m[1])) gaps.push(`the instructions name the prompt ${m[1]}, which is not a skill`);
      for (const t of tools)
        if (!new RegExp(`\\b${t}\\b`).test(text) && !granted.has(t))
          gaps.push(`${t} reaches no agent: not in the instructions or any skill's tools`);
      return gaps.length
        ? bad([...new Set(gaps)].slice(0, 8).join("; "))
        : ok(`the instructions name only real tools and prompts, and all ${tools.length} tools reach agents`);
    },
  },
  "context-booklets": {
    requires: ["cli/src/brief.mjs", "cli/src/agents.mjs"],
    run: async () => {
      // OD-205: a created project's context/ is the engine's short answers as files. Per scheme:
      // AGENTS.md, each booklet and each file route stay within budget; every route resolves to a
      // booklet that is written; every component and task booklet is reachable from a route; every
      // booklet with sections ends with its hints and the exact call.
      const { BUDGET, booklets, routeFile } = await import("../cli/src/brief.mjs");
      const { agentsMd } = await import("../cli/src/agents.mjs");
      const { componentsFor } = await import("../cli/src/components.mjs");
      const { assetRoots, grammar, loadScheme } = await import("../cli/src/schemes.mjs");
      const roots = assetRoots();
      const g = grammar(roots);
      const B = (t) => Buffer.byteLength(t, "utf8");
      const gaps = [];
      let files = 0;
      for (const id of SCHEMES) {
        const s = loadScheme(id, roots);
        const comps = componentsFor(s, roots);
        const set = booklets(s, g, comps, roots);
        files += Object.keys(set).length;
        const agents = agentsMd(s, g, { components: comps, project: true });
        if (B(agents) > BUDGET.agents) gaps.push(`${id} AGENTS.md is ${B(agents)} B, over ${BUDGET.agents}`);
        for (const [f, t] of Object.entries(set)) {
          if (!f.endsWith(".md") || f === "README.md") continue;
          if (B(t) > BUDGET.booklet) gaps.push(`${id} ${f} is ${B(t)} B, over ${BUDGET.booklet}`);
          if (
            /^(components|tasks)\//.test(f) &&
            !/\nMore, ask by section:\n[\s\S]*\nExample: get_context target=/.test(t)
          )
            gaps.push(`${id} ${f} has no section hints`);
        }
        const index = JSON.parse(set["index.json"]);
        const reached = new Set();
        const route = (label, list) => {
          for (const f of list) {
            if (!(f in set)) gaps.push(`${id}: ${label} routes to ${f}, which is not written`);
            reached.add(f);
          }
          // A route is the booklets it lists; AGENTS.md has its own budget, read once on top.
          const size = list.reduce((n, f) => n + B(set[f] ?? ""), 0);
          if (size > BUDGET.route) gaps.push(`${id}: the route for ${label} is ${size} B, over ${BUDGET.route}`);
        };
        for (const c of comps) {
          route(`src/components/ui/${c}.tsx`, routeFile(index, `src/components/ui/${c}.tsx`));
          route(`stories/${c}.stories.tsx`, routeFile(index, `stories/${c}.stories.tsx`));
        }
        for (const [t, list] of Object.entries(index.tasks)) route(`task ${t}`, list);
        for (const [x, list] of Object.entries(index.situations)) route(`situation ${x}`, list);
        for (const f of Object.keys(set))
          if (/^(components|tasks)\//.test(f) && !reached.has(f))
            gaps.push(`${id}: ${f} is not reachable from any route`);
      }
      return gaps.length
        ? bad(gaps.slice(0, 8).join("; "))
        : ok(
            `${files} context files in ${SCHEMES.length} schemes: within budget, every route resolves, every booklet reachable`,
          );
    },
  },
  "context-fixtures": {
    requires: ["cli/src/brief.mjs"],
    run: async () => {
      // OD-205: the short form keeps what an agent needs, from each scheme's own rules. A situation's
      // route holds its rule; build.md holds every layout and colour rule and write.md every voice
      // rule; a component's booklet holds how the scheme uses each variant, or that it does not.
      const { booklets, routeFile } = await import("../cli/src/brief.mjs");
      const { componentsFor } = await import("../cli/src/components.mjs");
      const { assetRoots, grammar, loadScheme } = await import("../cli/src/schemes.mjs");
      const roots = assetRoots();
      const g = grammar(roots);
      const voice = new Set(g.situations.filter((x) => x.scope === "voice").map((x) => x.id));
      const gaps = [];
      let n = 0;
      for (const id of SCHEMES) {
        const s = loadScheme(id, roots);
        const comps = componentsFor(s, roots);
        const set = booklets(s, g, comps, roots);
        const index = JSON.parse(set["index.json"]);
        const has = (f, text, what) => {
          n++;
          if (!(set[f] ?? "").includes(text)) gaps.push(`${id} ${f} lacks ${what}: "${text.slice(0, 40)}"`);
        };
        for (const u of s.usage.filter((u) => u.use)) {
          const use = u.use.replace(/[.]+$/, "");
          has(voice.has(u.situation) ? "tasks/write.md" : "tasks/build.md", use, `the rule for ${u.situation}`);
          for (const f of index.situations[u.situation] ?? [])
            if (f.startsWith("components/") && (u.uses ?? []).some((x) => f === `components/${x.component}.md`))
              has(f, use, `the rule for ${u.situation}`);
        }
        for (const c of s.inventory.in.filter((c) => comps.includes(c.id)))
          for (const [axis, list] of Object.entries(c.variants ?? {}))
            for (const [v, d] of Object.entries(list))
              has(
                `components/${c.id}.md`,
                d.not_used ? `${axis} ${v}: not used` : `${axis} ${v}: ${d.use}`,
                `the ${axis} ${v} decision`,
              );
        for (const c of comps)
          if (!routeFile(index, `src/components/ui/${c}.tsx`).includes(`components/${c}.md`))
            gaps.push(`${id}: src/components/ui/${c}.tsx does not route to its booklet`);
      }
      return gaps.length
        ? bad(gaps.slice(0, 8).join("; "))
        : ok(`${n} fixtures from the schemes' own rules hold in the short form`);
    },
  },
  "context-guidance": {
    requires: ["cli/src/brief.mjs", "cli/src/mcp.mjs", "cli/src/tools.mjs", "skills"],
    run: async (c) => {
      // OD-205: agents learn the structure from any way in. The read-once text is in the MCP
      // instructions, AGENTS.md and context/README.md, and names only real tools; every check_ui
      // finding names a booklet section that exists; the build, review, write and change skills start
      // from their booklet.
      const { READ_ONCE, booklets } = await import("../cli/src/brief.mjs");
      const { agentsMd } = await import("../cli/src/agents.mjs");
      const { SEE } = await import("../cli/src/tools.mjs");
      const { componentsFor } = await import("../cli/src/components.mjs");
      const { assetRoots, grammar, loadScheme } = await import("../cli/src/schemes.mjs");
      const roots = assetRoots();
      const g = grammar(roots);
      const src = c.read("cli/src/mcp.mjs");
      const tools = [...src.matchAll(/registerTool\(\s*"(\w+)"/g)].map((m) => m[1]);
      const gaps = [];
      const start = src.indexOf("const INSTRUCTIONS = `");
      if (!src.slice(start, src.indexOf("`;", start)).includes("${READ_ONCE}"))
        gaps.push("the MCP instructions do not carry the read-once text");
      for (const m of READ_ONCE.matchAll(/\b([a-z]+_[a-z_]+)\b/g))
        if (!tools.includes(m[1])) gaps.push(`the read-once text names ${m[1]}, which is not a tool`);
      for (const id of SCHEMES) {
        const s = loadScheme(id, roots);
        const comps = componentsFor(s, roots);
        const set = booklets(s, g, comps, roots);
        const agents = agentsMd(s, g, { components: comps, project: true });
        if (!agents.includes(READ_ONCE)) gaps.push(`${id} AGENTS.md does not carry the read-once text`);
        if (!set["README.md"].includes(READ_ONCE))
          gaps.push(`${id} context/README.md does not carry the read-once text`);
        for (const [rule, see] of Object.entries(SEE)) {
          const [file, section] = see
            .replace("<id>", comps.find((c) => /## Variants here/.test(set[`components/${c}.md`] ?? "")) ?? "button")
            .split(": ");
          const text = file === "AGENTS.md" ? agents : set[file.replace(/^context\//, "")];
          if (!text) gaps.push(`${id}: ${rule} points to ${file}, which a project does not have`);
          else if (section && !text.includes(`## ${section}`))
            gaps.push(`${id}: ${rule} points to ${file}: ${section}, which it does not have`);
        }
      }
      for (const name of ["open-ds", "open-ds-build", "open-ds-review", "open-ds-write", "open-ds-change"]) {
        const run = c.read(`skills/${name}/SKILL.md`).split("## Run")[1]?.split("## Done")[0] ?? "";
        if (
          !run
            .split("\n")
            .filter((l) => /^\d+\./.test(l))
            .slice(0, 4)
            .some((l) => /get_context/.test(l))
        )
          gaps.push(`${name}: the Run steps do not start from get_context`);
      }
      return gaps.length
        ? bad(gaps.slice(0, 8).join("; "))
        : ok("the read-once text is in all three places; every finding and every skill points to a booklet");
    },
  },
  "context-benchmark": {
    requires: ["cli/src/brief.mjs"],
    run: async () => {
      // OD-205: before and after, measured on every run, so a regression shows as a number. Before is
      // the full answer (JSON, as get_context returned it) and the full AGENTS.md; after is the short
      // form a project ships.
      const { brief } = await import("../cli/src/brief.mjs");
      const { context, TASKS } = await import("../cli/src/context.mjs");
      const { agentsMd } = await import("../cli/src/agents.mjs");
      const { componentsFor } = await import("../cli/src/components.mjs");
      const { assetRoots, grammar, loadScheme } = await import("../cli/src/schemes.mjs");
      const roots = assetRoots();
      const g = grammar(roots);
      const B = (t) => Buffer.byteLength(t, "utf8");
      let before = 0;
      let after = 0;
      const parts = [];
      for (const id of SCHEMES) {
        const s = loadScheme(id, roots);
        const comps = componentsFor(s, roots);
        const a0 = B(agentsMd(s, g, { components: comps }));
        const a1 = B(agentsMd(s, g, { components: comps, project: true }));
        let b = a0;
        let f = a1;
        for (const t of [...TASKS, ...comps]) {
          b += B(JSON.stringify(context(id, t, roots, g), null, 2));
          f += B(brief(id, t, { roots, g }));
        }
        before += b;
        after += f;
        if (id === "dense-data") {
          const job = (list) =>
            list.reduce(
              (n, t) => [
                n[0] + B(JSON.stringify(context(id, t, roots, g), null, 2)),
                n[1] + B(brief(id, t, { roots, g })),
              ],
              [a0, a1],
            );
          const [x0, x1] = job(["build", "button", "dialog"]);
          parts.push(`dense-data, add a delete action: ${(x0 / 1024).toFixed(1)} → ${(x1 / 1024).toFixed(1)} KB`);
        }
      }
      if (after >= before) return bad(`the short form is not smaller: ${before} → ${after} B`);
      return ok(
        `AGENTS.md, tasks and components, 5 schemes: ${(before / 1024).toFixed(0)} → ${(after / 1024).toFixed(0)} KB (−${Math.round((1 - after / before) * 100)}%); ${parts.join("; ")}`,
      );
    },
  },
  "llm-mcp-docstrings": {
    requires: ["cli/src/mcp.mjs"],
    run: (c) => {
      const src = c.read("cli/src/mcp.mjs");
      const all = [...src.matchAll(/registerTool\(\s*"(\w+)",\s*\{([\s\S]*?)\},\s*async/g)];
      const missing = all.filter((m) => !/description:\s*"/.test(m[2])).map((m) => m[1]);
      return missing.length
        ? bad(`tools without description: ${missing.join(", ")}`)
        : ok(`${all.length} MCP tools documented`);
    },
  },
  "llm-docs-frontmatter": {
    requires: ["docs/docusaurus.config.ts"],
    run: (c) => {
      // The delivered design system's docs, and the Open DS guide in guide/.
      const pages = [
        ...c.walk("docs/docs", (f) => /\.mdx?$/.test(f)),
        ...c.walk("guide", (f) => /\.mdx?$/.test(f) && !f.includes("/archive/")),
      ];
      if (!pages.length) return bad("no docs pages");
      const missing = pages.filter((f) => !/^description:\s*\S+/m.test(frontMatter(c.read(f)) ?? ""));
      return missing.length
        ? bad(`${missing.length} pages without a description: ${missing.slice(0, 4).join(", ")}`)
        : ok(`${pages.length} pages with descriptions`);
    },
  },

  // Tokens
  "tokens-style-dictionary": {
    requires: ["tokens/package.json"],
    run: (c) => {
      const pkg = c.json("tokens/package.json");
      return pkg.dependencies?.["style-dictionary"] || pkg.devDependencies?.["style-dictionary"]
        ? ok("style-dictionary is a dependency")
        : bad("tokens/ does not use style-dictionary");
    },
  },
  "tokens-built-all-schemes": {
    requires: ["tokens/package.json"],
    slow: true,
    run: (c) => {
      const err = ensureTokens(c);
      if (err) return bad(tail(err));
      const missing = SCHEMES.flatMap((s) =>
        ["tokens.css", "theme.css", "tokens.json"].map((f) => `tokens/dist/${s}/${f}`),
      ).filter((f) => !c.has(f));
      return missing.length ? bad(`missing outputs: ${missing.join(", ")}`) : ok("all 5 schemes built");
    },
  },
  "tokens-light-dark": {
    requires: ["tokens/package.json"],
    slow: true,
    run: (c) => {
      const err = ensureTokens(c);
      if (err) return bad(tail(err));
      const bad1 = SCHEMES.filter((s) => {
        const css = c.has("tokens", "dist", s, "tokens.css") ? c.read("tokens", "dist", s, "tokens.css") : "";
        return !css.includes(":root") || !css.includes(".dark");
      });
      return bad1.length ? bad(`no light and dark blocks: ${bad1.join(", ")}`) : ok("light and dark in every scheme");
    },
  },
  "tokens-shadcn-mapping": {
    requires: ["tokens/package.json"],
    slow: true,
    run: (c) => {
      const err = ensureTokens(c);
      if (err) return bad(tail(err));
      const gaps = [];
      for (const s of SCHEMES) {
        const css = c.has("tokens", "dist", s, "theme.css") ? c.read("tokens", "dist", s, "theme.css") : "";
        const miss = SHADCN_VARS.filter((v) => !css.includes(`${v}:`));
        if (miss.length) gaps.push(`${s}: ${miss.join(" ")}`);
      }
      return gaps.length ? bad(gaps.join("; ")) : ok("shadcn variables mapped in every scheme");
    },
  },
  "tokens-component-keys-resolve": {
    requires: ["tokens/package.json"],
    slow: true,
    run: (c) => {
      const err = ensureTokens(c);
      if (err) return bad(tail(err));
      const keys = c.json("schemes/grammar.json").component_keys.map(
        (k) =>
          `--${k.id
            .split("/")
            .filter((p) => p !== "@")
            .join("-")}`,
      );
      const gaps = [];
      for (const s of SCHEMES) {
        const css = c.has("tokens", "dist", s, "tokens.css") ? c.read("tokens", "dist", s, "tokens.css") : "";
        const miss = keys.filter((k) => !css.includes(`${k}:`));
        if (miss.length) gaps.push(`${s}: ${miss.length} keys missing`);
      }
      return gaps.length ? bad(gaps.join("; ")) : ok(`${keys.length} component keys defined in every scheme`);
    },
  },

  // Components
  "ui-components": {
    requires: ["ui/package.json"],
    run: (c) => {
      const missing = COMPONENTS.filter((n) => !c.has("ui", "src", "components", `${n}.tsx`));
      return missing.length ? bad(`missing: ${missing.join(", ")}`) : ok(`${COMPONENTS.length} components`);
    },
  },
  "ui-component-keys-only": {
    requires: ["ui/src/components"],
    run: (c) => {
      const offenders = [];
      for (const f of c.walk("ui/src/components", (x) => x.endsWith(".tsx"))) {
        const src = c.read(f);
        if (/#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(|oklch\(/.test(src)) offenders.push(`${f}: raw colour`);
        if (/\b(bg|text|border)-(red|blue|gray|slate|zinc|neutral|green|amber)-\d/.test(src))
          offenders.push(`${f}: palette class`);
      }
      return offenders.length ? bad(offenders.slice(0, 5).join("; ")) : ok("components read tokens only");
    },
  },
  "ui-registry": {
    requires: ["ui/registry.json"],
    run: (c) => {
      const reg = c.json("ui/registry.json");
      const names = new Set(reg.items?.map((i) => i.name));
      const missing = [...COMPONENTS, ...SCHEMES.map((s) => `theme-${s}`)].filter((n) => !names.has(n));
      if (!reg.$schema?.includes("shadcn")) return bad("registry.json must point at the shadcn registry schema");
      return missing.length
        ? bad(`registry missing: ${missing.join(", ")}`)
        : ok("registry lists every component and scheme theme");
    },
  },

  // CLI
  "cli-package": {
    requires: ["cli/package.json"],
    run: (c) => {
      const pkg = c.json("cli/package.json");
      return pkg.bin?.["open-ds"] ? ok("cli has the open-ds bin") : bad("cli/package.json has no open-ds bin");
    },
  },
  "cli-package-works": {
    requires: ["scripts/test-package.mjs"],
    slow: true,
    run: (c) => {
      // Packs the CLI as npm would publish it and runs it from the packed file in a fresh app.
      const r = c.sh("node", ["scripts/test-package.mjs"]);
      return r.code === 0 ? ok("the packed CLI deploys a scheme into a fresh app that builds") : bad(tail(r.out));
    },
  },
  "cli-create-works": {
    requires: ["scripts/test-create.mjs"],
    slow: true,
    run: (c) => {
      // Packs the CLI, creates a design system project from the packed file, installs and builds it.
      const r = c.sh("node", ["scripts/test-create.mjs"]);
      return r.code === 0 ? ok("a created project builds its tokens, Storybook and docs") : bad(tail(r.out));
    },
  },
  "cli-create-temp": {
    requires: ["cli/src/create.mjs", "tokens/package.json"],
    run: (c) => {
      const err = ensureTokens(c);
      if (err) return bad(tail(err));
      const dir = join(mkdtempSync(join(tmpdir(), "ods-harness-")), "ds");
      try {
        const r = c.sh("node", ["cli/bin/open-ds.js", "create", dir, "--scheme", "multi-brand"]);
        if (r.code !== 0) return bad(tail(r.out));
        const need = [
          "tokens/build.mjs",
          "tokens/src/primitive/color/teal.tokens.json",
          "tokens/src/theme/coral.tokens.json",
          "tokens/src/semantic/color.tokens.json",
          ".storybook/preview.tsx",
          "stories/button.stories.tsx",
          "docs/docusaurus.config.ts",
          "docs/docs/index.md",
          "scheme.json",
          "AGENTS.md",
          ".github/workflows/ci.yml",
        ];
        const missing = need.filter((f) => !existsSync(join(dir, f)));
        return missing.length
          ? bad(`create did not write: ${missing.join(", ")}`)
          : ok("create wrote tokens source and build, components, Storybook, docs, agent files and CI");
      } finally {
        rmSync(dirname(dir), { recursive: true, force: true });
      }
    },
  },
  "cli-commands": {
    requires: ["cli/src/schemes.mjs"],
    run: (c) => {
      const r = c.sh("node", ["cli/bin/open-ds.js", "--help"]);
      const missing = ["list", "show", "why", "when", "create", "init", "add"].filter(
        (cmd) => !new RegExp(`\\b${cmd}\\b`).test(r.out),
      );
      return missing.length
        ? bad(`help does not list: ${missing.join(", ")}`)
        : ok("list, show, why, when, create, init, add");
    },
  },
  "cli-init-temp": {
    requires: ["cli/src/schemes.mjs", "tokens/package.json", "ui/src/components"],
    run: (c) => {
      const err = ensureTokens(c);
      if (err) return bad(tail(err));
      const dir = mkdtempSync(join(tmpdir(), "ods-harness-"));
      try {
        const r = c.sh("node", ["cli/bin/open-ds.js", "init", "dense-data", "--dir", dir, "--yes"]);
        if (r.code !== 0) return bad(tail(r.out));
        const need = [
          "AGENTS.md",
          ".claude/skills/open-ds/SKILL.md",
          "open-ds.json",
          "src/styles/open-ds.css",
          "src/components/ui/button.tsx",
        ];
        const missing = need.filter((f) => !existsSync(join(dir, f)));
        return missing.length
          ? bad(`init did not write: ${missing.join(", ")}`)
          : ok("init wrote tokens, components, AGENTS.md and the skill");
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    },
  },

  // MCP
  "mcp-node-sdk": {
    requires: ["cli/package.json"],
    run: (c) =>
      /@modelcontextprotocol\/sdk/.test(c.read("cli/package.json"))
        ? ok("Node MCP server on the official SDK, inside the open-ds package")
        : bad("the open-ds package does not depend on @modelcontextprotocol/sdk"),
  },
  "mcp-tools": {
    requires: ["cli/src/mcp.mjs"],
    run: (c) => {
      const src = c.read("cli/src/mcp.mjs");
      const want = [
        "list_schemes",
        "get_scheme",
        "get_answer",
        "why",
        "when_to_use",
        "compare_schemes",
        "get_inventory",
        "what_moves",
        "get_key",
        "plan_create",
        "plan_init",
        "plan_add",
      ];
      const missing = want.filter((t) => !src.includes(`"${t}"`));
      return missing.length ? bad(`missing tools: ${missing.join(", ")}`) : ok(`${want.length} MCP tools, read-only`);
    },
  },
  "mcp-uses-cli-engine": {
    requires: ["cli/src/mcp.mjs"],
    run: (c) => {
      const src = c.read("cli/src/mcp.mjs");
      return /from "\.\/schemes\.mjs"/.test(src) && /from "\.\/create\.mjs"/.test(src)
        ? ok("the MCP server imports the CLI's own modules: one engine")
        : bad("the MCP server does not import the CLI's modules");
    },
  },
  "mcp-tests": {
    requires: ["cli/test/mcp.test.mjs"],
    slow: true,
    run: (c) => {
      const r = c.sh("node", ["--test", "cli/test/mcp.test.mjs", "mcp/test/server.test.mjs"]);
      return r.code === 0
        ? ok(
            tail(r.out)
              .split("\n")
              .filter((l) => l.startsWith("# pass"))
              .pop() ?? "pass",
          )
        : bad(tail(r.out));
    },
  },

  // Storybook
  "storybook-stories": {
    requires: ["storybook/package.json"],
    run: (c) => {
      const missing = COMPONENTS.filter((n) => !c.has("storybook", "stories", `${n}.stories.tsx`));
      return missing.length ? bad(`no story for: ${missing.join(", ")}`) : ok(`${COMPONENTS.length} stories`);
    },
  },
  "storybook-switches": {
    requires: ["storybook/.storybook/preview.tsx"],
    run: (c) => {
      const src = c.read("storybook/.storybook/preview.tsx");
      return /scheme/.test(src) && /mode|dark/.test(src)
        ? ok("scheme and mode switches")
        : bad("preview has no scheme and mode switches");
    },
  },
  "storybook-build": {
    requires: ["storybook/package.json"],
    slow: true,
    run: (c) => {
      const r = c.sh("pnpm", ["--dir", "storybook", "build"]);
      return r.code === 0 ? ok("storybook builds") : bad(tail(r.out));
    },
  },
  "storybook-renders": {
    requires: ["storybook/package.json", "harness/storybook-renders.cjs"],
    slow: true,
    run: (c) => {
      // A build can pass while stories fail to show, so open every story and docs page (OD-178).
      const b = c.sh("pnpm", ["--dir", "storybook", "build"]);
      if (b.code !== 0) return bad(tail(b.out));
      // The build must not warn: a chunk past the limit, or a bundler message, is a defect to fix.
      const warn = b.out.split("\n").filter((l) => /^\s*!\s|\(!\)/.test(l));
      if (warn.length) return bad(`storybook build warns: ${warn.slice(0, 3).join("; ")}`);
      // Every entry as it opens, then every story in each other toolbar scheme (OD-192).
      const others = [...c.read("storybook/src/scheme-context.tsx").matchAll(/value: "([^"]+)"/g)]
        .map((m) => m[1])
        .filter((v) => v !== "dense-data");
      const r = c.sh("node", [
        "harness/storybook-renders.cjs",
        c.p("storybook/storybook-static"),
        "--schemes",
        others.join(","),
      ]);
      let res;
      try {
        res = JSON.parse(r.out.trim().split("\n").pop());
      } catch {
        return bad(tail(r.out));
      }
      if (res.missing)
        return pending("Playwright is not installed: npm i -g playwright && npx playwright install chromium");
      if (res.error) return bad(res.error);
      return res.failed.length
        ? bad(
            res.failed
              .slice(0, 5)
              .map((f) => `${f.id}: ${f.problem}`)
              .join("; "),
          )
        : ok(`${res.entries} renders: every story and docs page, and every story in every scheme`);
    },
  },

  // Site
  "site-stack": {
    requires: ["site/package.json"],
    run: (c) => {
      const pkg = c.json("site/package.json");
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      const missing = ["next", "react", "tailwindcss"].filter((d) => !deps[d]);
      return missing.length ? bad(`missing: ${missing.join(", ")}`) : ok("Next.js, React, Tailwind");
    },
  },
  "site-static-export": {
    requires: ["site/next.config.ts"],
    run: (c) =>
      /output:\s*"export"/.test(c.read("site/next.config.ts"))
        ? ok("static export (SPA)")
        : bad("next.config is not a static export"),
  },
  "site-routes": {
    requires: ["site/src/app/schemes"],
    run: (c) => {
      const need = [
        "site/src/app/page.tsx",
        "site/src/app/schemes/page.tsx",
        "site/src/app/schemes/[id]/page.tsx",
        "site/src/app/schemes/[id]/[scope]/page.tsx",
        "site/src/app/schemes/[id]/moves/page.tsx",
        "site/src/app/compare/page.tsx",
        "site/src/app/take/page.tsx",
        "site/src/app/contribute/page.tsx",
        "site/src/app/questions/page.tsx",
        "site/src/app/install/page.tsx",
      ];
      const missing = need.filter((f) => !c.has(f));
      return missing.length
        ? bad(`missing routes: ${missing.join(", ")}`)
        : ok("home, schemes, scheme, scope, what moves, compare, take, contribute, questions, install");
    },
  },
  "site-build": {
    requires: ["site/package.json"],
    slow: true,
    run: (c) => {
      const r = c.sh("pnpm", ["--dir", "site", "build"]);
      return r.code === 0 ? ok("site builds") : bad(tail(r.out));
    },
  },

  "site-design-fidelity": {
    requires: ["site/package.json", "harness/design/pages.json"],
    slow: true,
    run: (c) => {
      // Build every time, so the check never reads a stale site/out.
      const b = c.sh("pnpm", ["--dir", "site", "build"]);
      if (b.code !== 0) return bad(tail(b.out));
      const r = c.sh("node", ["harness/design/fidelity.cjs"]);
      let res;
      try {
        res = JSON.parse(r.out.trim().split("\n").pop());
      } catch {
        return bad(tail(r.out));
      }
      if (res.missing)
        return pending("Playwright is not installed: npm i -g playwright && npx playwright install chromium");
      if (res.error) return bad(res.error);
      const failed = res.pages.filter((p) => !p.ok);
      return failed.length
        ? bad(failed.map((p) => `${p.route} (${p.frame}): ${p.problems.slice(0, 3).join("; ")}`).join(" | "))
        : ok(`${res.pages.length} pages match their Figma frames: texts in order, fold, palette and height`);
    },
  },

  // Docs
  "site-docs-storybook": {
    requires: ["site/src/lib/places.ts", "storybook/.storybook/component-docs.mdx", "docs/docusaurus.config.ts"],
    run: async (c) => {
      // OD-210: the docs and Storybook live on open-ds.dev, each with its own path, and a quiet link
      // between them. The site links both from the nav, the footer and each scheme page; the docs
      // honour a base URL (/docs/ on the site); Storybook ends each component page with one text
      // link to the same component in the docs.
      const read = (f) => readFileSync(c.p(f), "utf8");
      const gaps = [];
      const chrome = read("site/src/components/chrome.tsx");
      if (!/\["Docs", `\$\{DOCS\}\/`\]/.test(chrome) || !/\["Storybook", `\$\{STORYBOOK\}\/`\]/.test(chrome))
        gaps.push("site nav or footer has no Docs and Storybook links");
      const page = read("site/src/app/schemes/[id]/page.tsx");
      if (!page.includes("docsOf(s.id)") || !/storybookOf\(\s*s.id/.test(page))
        gaps.push("a scheme page has no Docs and Storybook cards");
      const config = read("docs/docusaurus.config.ts");
      if (!/baseUrl: BASE/.test(config) || !config.includes("DOCS_BASE_URL"))
        gaps.push("the docs base URL is not configurable");
      if (!read("docs/src/theme/NavbarItem/SchemeSwitcher.tsx").includes("withBaseUrl("))
        gaps.push("the scheme switch ignores the base URL");
      if (!read("docs/src/theme/NavbarItem/SchemeLinks.tsx").includes("useBaseUrl("))
        gaps.push("the llms.txt link ignores the base URL");
      const { docsPages } = await import(pathToFileURL(c.p("cli/src/docs.mjs")).href);
      const { assetRoots, grammar, loadScheme } = await import(pathToFileURL(c.p("cli/src/schemes.mjs")).href);
      const roots = assetRoots();
      const text = Object.values(
        docsPages(loadScheme("dense-data", roots), grammar(roots), roots, { all: true, robots: true, base: "/docs/" }),
      ).join("\n");
      if (/src="\/robots\//.test(text) || !text.includes('src="/docs/robots/'))
        gaps.push("robot pictures ignore the base URL");
      if (!/<DocsLink \/>\s*$/.test(read("storybook/.storybook/component-docs.mdx")))
        gaps.push("Storybook's component page does not end with the docs link");
      const blocks = read("storybook/src/docs-blocks.tsx");
      const link = blocks.slice(blocks.indexOf("export function DocsLink"));
      if (
        !blocks.includes("STORYBOOK_DOCS_URL") ||
        !link.includes('target="_top"') ||
        /<button|className="[^"]*btn/.test(link)
      )
        gaps.push("the Storybook docs link is not a quiet text link to the configured docs");
      return gaps.length
        ? bad(gaps.join("; "))
        : ok("site links docs and Storybook; docs honour /docs/; Storybook ends each component page with a docs link");
    },
  },
  "docs-docusaurus": {
    requires: ["docs/package.json"],
    run: (c) =>
      c.json("docs/package.json").dependencies?.["@docusaurus/core"]
        ? ok("Docusaurus in docs/")
        : bad("docs/ is not Docusaurus"),
  },
  "docs-sections": {
    requires: ["docs/docusaurus.config.ts", "cli/src/docs.mjs"],
    run: async (c) => {
      // Docusaurus documents the delivered design system: every scheme gets the same pages.
      const { docsPages } = await import(pathToFileURL(c.p("cli/src/docs.mjs")).href);
      const { assetRoots, grammar, loadScheme, schemeIds } = await import(
        pathToFileURL(c.p("cli/src/schemes.mjs")).href
      );
      ensureTokens(c);
      const roots = assetRoots();
      const g = grammar(roots);
      const gaps = [];
      for (const id of schemeIds(roots)) {
        const pages = docsPages(loadScheme(id, roots), g, roots);
        const need = [
          "index.md",
          "voice.md",
          "themes.md",
          "agents.md",
          ...g.scopes.map((sc) => `foundations/${sc.id}.md`),
          "primitives/index.md",
        ];
        const missing = need.filter((p) => !pages[p]);
        if (missing.length) gaps.push(`${id}: ${missing.join(", ")}`);
        if (!Object.keys(pages).some((p) => p.startsWith("components/"))) gaps.push(`${id}: no component pages`);
        // OD-194: every component page embeds Storybook and says how to use it in code; where the
        // reference has variants, it shows this scheme's decisions and what a change would move.
        for (const [p, text] of Object.entries(pages)) {
          const m = p.match(/^components\/(.+)\.md$/);
          if (!m || m[1] === "inventory") continue;
          const item = g.catalogue.items.find((i) => i.id === m[1]);
          const want = ["## See it live", "## Use it in code"];
          if (item?.apply_when) want.push("## When to use it");
          if (item?.variants) want.push("## Variants", "## Why it works this way");
          const lacking = want.filter((h) => !text.includes(h));
          if (lacking.length) gaps.push(`${id} ${p}: no ${lacking.join(", ")}`);
        }
        // OD-182: the docs lead with visuals. The home shows a product screen and the answers, the
        // colour page shows its colours in use, component pages show each variant live.
        const visual = [
          ["index.md", "odv-hero"],
          ["index.md", "odv-tile"],
          ["foundations/color.md", "odv-band"],
          ["foundations/color.md", "odv-stack"],
          ["primitives/color.md", "odv-ramp"],
          ["components/button.md", "odv-variant"],
          ["components/button.md", "odv-trail"],
        ];
        for (const [pg, cls] of visual)
          if (pages[pg] && !pages[pg].includes(cls)) gaps.push(`${id} ${pg}: no ${cls} block`);
        // OD-184, OD-195: the Primitives section counts every primitive.
        const prim = pages["primitives/index.md"] ?? "";
        const count = (function n(x) {
          return x && typeof x === "object"
            ? "$value" in x
              ? 1
              : Object.entries(x)
                  .filter(([k]) => !k.startsWith("$"))
                  .reduce((a, [, v]) => a + n(v), 0)
            : 0;
        })(loadScheme(id, roots).tokens.primitive);
        if (!prim.includes(`**${count}** primitives`))
          gaps.push(`${id}: the primitives page does not list all ${count} primitives`);
      }
      // The visual blocks look the same in these docs and in a created project's docs.
      if (c.read("docs/src/css/visual.css") !== c.read("cli/templates/project/docs/src/css/visual.css"))
        gaps.push("docs/src/css/visual.css and the project template's copy differ");
      const gen = c.sh("node", ["docs/scripts/generate.mjs", "--check"]);
      if (gen.code !== 0) gaps.push(tail(gen.out));
      for (const d of ["product", "business", "brand", "contributing"])
        if (!c.has("guide", d)) gaps.push(`guide/${d} is missing`);
      return gaps.length
        ? bad(gaps.join("; "))
        : ok(
            "every scheme has about, voice, a page per scope, primitives, component pages with the Storybook embed and decisions, themes and agents; the Open DS guide is in guide/",
          );
    },
  },
  "docs-build": {
    requires: ["docs/package.json", "harness/docs-renders.cjs"],
    slow: true,
    run: (c) => {
      const r = c.sh("pnpm", ["--dir", "docs", "build"]);
      if (r.code !== 0) return bad(tail(r.out));
      // A warning is a defect too: broken anchors once hid behind one.
      const warn = r.out.split("\n").filter((l) => /\[WARNING\]/.test(l));
      if (warn.length) return bad(`docs build warns: ${warn.slice(0, 3).join("; ")}`);
      // OD-207: open each scheme's page in a browser: its colours, the switch, a left-out component.
      const v = c.sh("node", ["harness/docs-renders.cjs", c.p("docs")]);
      let res;
      try {
        res = JSON.parse(v.out.trim().split("\n").pop());
      } catch {
        return bad(tail(v.out));
      }
      if (res.missing)
        return pending("Playwright is not installed: npm i -g playwright && npx playwright install chromium");
      if (res.error) return bad(res.error);
      return res.failed.length
        ? bad(
            res.failed
              .slice(0, 5)
              .map((f) => `${f.id}: ${f.problem}`)
              .join("; "),
          )
        : ok(
            `docs build; ${res.pages} pages open in a browser: every scheme in its colours, the switch keeps the page`,
          );
    },
  },
  "docs-schemes": {
    requires: ["docs/scripts/generate.mjs", "docs/schemes.json"],
    run: (c) => {
      // OD-207: the repo docs hold every scheme, and switching never lands on a missing page or
      // another scheme's colours. Every scheme has the same pages; each scheme's tokens apply only on
      // its pages; category links and the home slug point inside the scheme's folder.
      const schemes = c.json("docs/schemes.json");
      const gaps = [];
      const ids = schemes.map((s) => s.id);
      if (ids.length !== SCHEMES.length || SCHEMES.some((id) => !ids.includes(id)))
        gaps.push(`docs/schemes.json lists ${ids.join(", ")}`);
      const list = (id) =>
        c
          .walk(`docs/docs/${id}`, () => true)
          .map((f) => f.slice(`docs/docs/${id}/`.length))
          .sort();
      const first = list(ids[0]);
      for (const id of ids.slice(1)) {
        const l = list(id);
        const missing = first.filter((f) => !l.includes(f));
        const extra = l.filter((f) => !first.includes(f));
        if (missing.length || extra.length)
          gaps.push(
            `${id} differs from ${ids[0]}: ${[...missing.map((f) => `no ${f}`), ...extra.map((f) => `extra ${f}`)].slice(0, 4).join(", ")}`,
          );
      }
      for (const id of ids) {
        const css = c.read(`docs/src/css/schemes/${id}.css`);
        if (/(^|[\s,])(:root|\.dark)\b/m.test(css))
          gaps.push(`docs/src/css/schemes/${id}.css sets tokens outside html[data-scheme="${id}"]`);
        for (const f of c.walk(`docs/docs/${id}`, (f) => f.endsWith("_category_.json")))
          for (const m of c.read(f).matchAll(/"id": "([^"]+)"/g))
            if (!m[1].startsWith(`${id}/`)) gaps.push(`${f} links to ${m[1]}`);
        const home = c.read(`docs/docs/${id}/index.md`);
        if (!home.includes(`slug: "/${id}/"`)) gaps.push(`docs/docs/${id}/index.md is not at /${id}/`);
      }
      // OD-209: the home page shows each scheme's robot, the Foundations page each scope's, the
      // inventory Shelf and the 404 Slumber, each in a day and a night edition.
      const scopeRobot = { color: "swatch", spacing: "measure", components: "shelf" };
      const g = c.json("schemes/grammar.json");
      const names = [...ids, "slumber", ...g.scopes.map((sc) => scopeRobot[sc.id] ?? `scopes/${sc.id}`)];
      for (const n of new Set(names))
        for (const f of [`${n}.webp`, `${n}-dark.webp`])
          if (!c.has("docs", "static", "robots", ...f.split("/"))) gaps.push(`docs/static/robots/${f} is missing`);
      if (!c.read("docs/src/css/schemes.css").includes("schemes/"))
        gaps.push("docs/src/css/schemes.css imports no scheme");
      for (const f of [
        "docs/src/theme/NavbarItem/SchemeSwitcher.tsx",
        "docs/src/pages/index.tsx",
        "docs/src/clientModules/scheme.ts",
      ])
        if (!c.has(...f.split("/"))) gaps.push(`${f} is missing`);
      return gaps.length
        ? bad(gaps.slice(0, 8).join("; "))
        : ok(`${ids.length} schemes, ${first.length} pages each, every scheme's tokens scoped to its own pages`);
    },
  },

  // Structure and standards
  "structure-layout": {
    requires: [],
    run: (c) => {
      const missing = LAYOUT.filter((d) => !c.has(d));
      return missing.length ? pending(`not built yet: ${missing.join(", ")}`) : ok("layout matches the plan");
    },
  },
  "standards-node-tests": {
    requires: ["cli/test"],
    slow: true,
    run: (c) => {
      // One package at a time: the tokens tests rebuild tokens/dist, which other tests read.
      const r = c.sh("pnpm", ["-r", "--workspace-concurrency=1", "--if-present", "test"]);
      return r.code === 0 ? ok("node tests pass") : bad(tail(r.out));
    },
  },
  "standards-site-lint": {
    requires: ["site/package.json"],
    slow: true,
    run: (c) => {
      const r = c.sh("pnpm", ["--dir", "site", "lint"]);
      return r.code === 0 ? ok("eslint and prettier pass") : bad(tail(r.out));
    },
  },

  // End to end
  "e2e-guide": {
    requires: ["TESTING.md"],
    run: (c) => {
      const t = c.read("TESTING.md");
      const missing = ["open-ds.js init", "open-ds mcp", "storybook", "docs", "site", "pnpm e2e"].filter(
        (w) => !t.toLowerCase().includes(w),
      );
      return missing.length
        ? bad(`TESTING.md does not cover: ${missing.join(", ")}`)
        : ok("guide covers CLI, MCP, Storybook, docs and site");
    },
  },
  "e2e-run": {
    requires: ["scripts/e2e.mjs"],
    slow: true,
    run: (c) => {
      const r = c.sh("node", ["scripts/e2e.mjs"]);
      return r.code === 0 ? ok("end to end passes") : bad(tail(r.out));
    },
  },
};
