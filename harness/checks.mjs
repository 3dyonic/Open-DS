// Named checks for the definition-of-done harness.
// Each check says what it needs to exist (`requires`). If that is missing, the layer is
// "not built" yet, which is different from "fail". Slow checks (full builds) run with --full.

import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
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
  "harness-covers-instructions": {
    requires: ["harness/instructions.json"],
    run: (c) => {
      const items = c.json("harness/instructions.json").items;
      const missing = items.flatMap((i) => i.checks).filter((n) => !CHECKS[n]);
      return missing.length ? bad(`unknown checks: ${missing.join(", ")}`) : ok(`${items.length} instructions mapped`);
    },
  },
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
        const lightPaths = Object.keys(flatten(t.semantic.light)).sort().join();
        if (lightPaths !== Object.keys(flatten(t.semantic.dark)).sort().join())
          problems.push(`${s}: light and dark differ`);
        for (const brand of Object.keys(t.brands)) {
          for (const mode of ["light", "dark"]) {
            const all = flatten(
              mergeTrees(t.primitive, t.brands[brand].primitive, t.semantic.base, t.semantic[mode], t.component),
            );
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
      const semantic = (sch) => mergeTrees(sch.tokens.semantic.base, sch.tokens.semantic.light);
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
            ...Object.values(sch.tokens.brands).map((b) => b.primitive),
            semantic(sch),
            sch.tokens.semantic.dark,
            { component: sch.tokens.component },
            { content: sch.tokens.content },
          ];
          for (const o of sc.owns ?? [])
            if (!trees.some((t) => has(t, o))) gaps.push(`${sch.id}: ${sc.id} owns ${o}, which is not a token`);
        }
        const semanticOwns = (sc.owns ?? []).filter(
          (o) => has(semantic(schemes[0]), o) || has(schemes[0].tokens.semantic.dark, o),
        );
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
        ["harness/instructions.json", "harness/harness.schema.json"],
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
  "llm-mcp-docstrings": {
    requires: ["mcp/src/open_ds_mcp/server.py"],
    run: (c) => {
      const src = c.read("mcp/src/open_ds_mcp/server.py");
      const tools = [
        ...src.matchAll(/@mcp\.tool[^\n]*\n(?:async\s+)?def\s+(\w+)\([\s\S]*?\)\s*(?:->[^:]+)?:\s*\n\s+("""|''')/g),
      ].map((m) => m[1]);
      const all = [...src.matchAll(/@mcp\.tool[^\n]*\n(?:async\s+)?def\s+(\w+)/g)].map((m) => m[1]);
      const missing = all.filter((t) => !tools.includes(t));
      return missing.length
        ? bad(`tools without docstring: ${missing.join(", ")}`)
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
      const keys = c.json("schemes/grammar.json").component_keys.map((k) => `--${k.id.replaceAll("/", "-")}`);
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
  "cli-commands": {
    requires: ["cli/src/schemes.mjs"],
    run: (c) => {
      const r = c.sh("node", ["cli/bin/open-ds.js", "--help"]);
      const missing = ["list", "show", "why", "when", "init", "add"].filter(
        (cmd) => !new RegExp(`\\b${cmd}\\b`).test(r.out),
      );
      return missing.length ? bad(`help does not list: ${missing.join(", ")}`) : ok("list, show, why, when, init, add");
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
  "mcp-fastmcp": {
    requires: ["mcp/pyproject.toml"],
    run: (c) =>
      /fastmcp/.test(c.read("mcp/pyproject.toml")) ? ok("FastMCP dependency") : bad("mcp does not depend on fastmcp"),
  },
  "mcp-tools": {
    requires: ["mcp/src/open_ds_mcp/schemes.py"],
    run: (c) => {
      const src = c.read("mcp/src/open_ds_mcp/server.py");
      const missing = ["list_schemes", "get_scheme", "get_answer", "why", "when_to_use", "deploy"].filter(
        (t) => !new RegExp(`def ${t}\\(`).test(src),
      );
      return missing.length ? bad(`missing tools: ${missing.join(", ")}`) : ok("6 MCP tools");
    },
  },
  "mcp-deploy-uses-cli": {
    requires: ["mcp/src/open_ds_mcp/schemes.py"],
    run: (c) =>
      /open-ds\.js|"open-ds"/.test(c.read("mcp/src/open_ds_mcp/server.py"))
        ? ok("deploy calls the CLI")
        : bad("deploy does not call the CLI"),
  },
  "mcp-tests": {
    requires: ["mcp/tests"],
    slow: true,
    run: (c) => {
      const r = c.sh("uv", ["run", "pytest", "-q", "mcp/tests"]);
      return r.code === 0 ? ok(tail(r.out).split("\n").pop()) : bad(tail(r.out));
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
        ];
        const missing = need.filter((p) => !pages[p]);
        if (missing.length) gaps.push(`${id}: ${missing.join(", ")}`);
        if (!Object.keys(pages).some((p) => p.startsWith("components/"))) gaps.push(`${id}: no component pages`);
      }
      const gen = c.sh("node", ["docs/scripts/generate.mjs", "--check"]);
      if (gen.code !== 0) gaps.push(tail(gen.out));
      for (const d of ["product", "business", "brand", "contributing"])
        if (!c.has("guide", d)) gaps.push(`guide/${d} is missing`);
      return gaps.length
        ? bad(gaps.join("; "))
        : ok(
            "every scheme has about, voice, a page per scope, components, themes and agents; the Open DS guide is in guide/",
          );
    },
  },
  "docs-build": {
    requires: ["docs/package.json"],
    slow: true,
    run: (c) => {
      const r = c.sh("pnpm", ["--dir", "docs", "build"]);
      return r.code === 0 ? ok("docs build") : bad(tail(r.out));
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
  "standards-python": {
    requires: ["mcp"],
    slow: true,
    run: (c) => {
      const a = c.sh("uv", ["run", "ruff", "check", "validator", "mcp"]);
      const b = c.sh("uv", ["run", "ruff", "format", "--check", "validator", "mcp"]);
      return a.code === 0 && b.code === 0 ? ok("ruff check and format pass") : bad(tail(a.out + "\n" + b.out));
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

  // Git
  "git-rc1-from-master": {
    requires: [],
    run: (c) => {
      const r = c.sh("git", ["merge-base", "--is-ancestor", "origin/master", "origin/RC1"]);
      return r.code === 0 ? ok("RC1 contains master") : bad("origin/RC1 missing or not based on master");
    },
  },
  "git-feature-merges": {
    requires: [],
    run: (c) => {
      const r = c.sh("git", ["log", "origin/RC1", "--merges", "--format=%s", "--first-parent"]);
      const merges = r.out.split("\n").filter((l) => /feat\/OD-\d+/.test(l));
      return merges.length
        ? ok(`${merges.length} feature merges into RC1`)
        : pending("no feature branch merged into RC1 yet");
    },
  },

  // Process evidence (kept in harness/evidence.json, one entry per merged feature)
  "evidence-subagent-merges": {
    requires: ["harness/evidence.json"],
    run: (c) => {
      const e = c.json("harness/evidence.json").merges ?? [];
      const missing = e.filter((m) => !m.pr || !m.merged_by_subagent || !m.sha);
      return !e.length
        ? pending("no merges recorded yet")
        : missing.length
          ? bad(`${missing.length} merges without PR, sub-agent or SHA`)
          : ok(`${e.length} PRs merged by a sub-agent`);
    },
  },
  "evidence-orchestra-skills": {
    requires: ["harness/evidence.json"],
    run: (c) => {
      const e = c.json("harness/evidence.json").merges ?? [];
      const missing = e.filter((m) => !m.skills?.length);
      return !e.length
        ? pending("no merges recorded yet")
        : missing.length
          ? bad(`${missing.length} merges without an Orchestra skill`)
          : ok("every merge used Orchestra skills");
    },
  },
  "evidence-jira-orchestra": {
    requires: ["harness/evidence.json"],
    run: (c) => {
      const e = c.json("harness/evidence.json").merges ?? [];
      const missing = e.filter((m) => !m.jira || !m.orchestra);
      return !e.length
        ? pending("no merges recorded yet")
        : missing.length
          ? bad(`${missing.length} merges without a Jira update and an Orchestra record`)
          : ok("every merge updated Jira and Orchestra");
    },
  },

  // End to end
  "e2e-guide": {
    requires: ["TESTING.md"],
    run: (c) => {
      const t = c.read("TESTING.md");
      const missing = ["open-ds.js init", "open-ds-mcp", "storybook", "docs", "site", "pnpm e2e"].filter(
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
