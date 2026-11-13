// Named checks for the definition-of-done harness.
// Each check says what it needs to exist (`requires`). If that is missing, the layer is
// "not built" yet, which is different from "fail". Slow checks (full builds) run with --full.

import { themeTokens } from "../cli/src/tokens.mjs";
import { toneOf } from "../cli/src/tones.mjs";
import { follow } from "../cli/src/scale-map.mjs";
import { grammar as loadGrammar, loadScheme, storedScheme as loadStored } from "../cli/src/schemes.mjs";
import { contrastPairs, flatten, picksCiteAnswers, rawValues, resolve, spacingOffGrid, tokensResolve } from "../cli/src/scheme-checks.mjs";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
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
  // Schemes load through cli/src/schemes.mjs, the one path (OD-289), from this root's schemes/.
  const roots = { schemes: p("schemes") };
  const grammar = () => loadGrammar(roots);
  const scheme = (id) => loadScheme(id, roots);
  const storedScheme = (id) => loadStored(id, roots);
  return { root, p, has, read, json, walk, sh, grammar, scheme, storedScheme };
}

const ok = (detail = "") => ({ ok: true, detail });
const bad = (detail) => ({ ok: false, detail });
// Not a failure: the work this check proves has not happened yet.
const pending = (detail) => ({ ok: false, pending: true, detail });
const tail = (s) => s.split("\n").slice(-6).join("\n");

// The ignore groups that hold generated files (OD-305). A group is a run of lines under one comment
// header, up to the next blank line. The header names the group: "Generated ..." or "Written ...".
// The patterns come from .gitignore, so a new pattern in a group is guarded with no edit here.
export function generatedIgnorePatterns(gitignoreText) {
  const patterns = [];
  let generated = false;
  for (const raw of gitignoreText.split("\n")) {
    const line = raw.trim();
    if (!line) generated = false;
    else if (line.startsWith("#")) generated = /^#\s*(generated|written)\b/i.test(line);
    else if (generated) patterns.push(line);
  }
  return patterns;
}

// Tracked paths that match the patterns. Git does the matching, so it is the same as .gitignore.
export function trackedMatching(c, patterns) {
  const dir = mkdtempSync(join(tmpdir(), "od-ignore-"));
  try {
    const exclude = join(dir, "exclude");
    writeFileSync(exclude, `${patterns.join("\n")}\n`);
    const r = c.sh("git", ["ls-files", "-z", "--cached", "--ignored", "--exclude-from", exclude]);
    return { code: r.code, paths: r.out.split("\0").filter(Boolean), out: r.out };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

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

// The token helpers live with the scheme rules (OD-292); the harness re-exports them.
export { flatten, resolve } from "../cli/src/scheme-checks.mjs";

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

  "generated-files-untracked": {
    requires: [".gitignore"],
    run: (c) => {
      const patterns = generatedIgnorePatterns(c.read(".gitignore"));
      if (!patterns.length) return bad("no generated-file group found in .gitignore: a header must start with Generated or Written");
      const found = trackedMatching(c, patterns);
      if (found.code !== 0) return bad(`git ls-files failed: ${tail(found.out)}`);
      return found.paths.length
        ? bad(found.paths.slice(0, 20).map((f) => `${f} is tracked but generated: run git rm --cached ${f}`).join("; "))
        : ok(`no tracked file matches the ${patterns.length} generated-file patterns in .gitignore`);
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
      const g = c.grammar();
      const qids = [...g.reasons, ...g.scopes].flatMap((x) => x.questions.map((q) => q.id));
      const gaps = [];
      for (const s of SCHEMES) {
        const answered = new Set(c.scheme(s).answers.map((a) => a.question));
        const miss = qids.filter((q) => !answered.has(q));
        if (miss.length) gaps.push(`${s}: ${miss.length} unanswered (${miss.slice(0, 3).join(", ")}…)`);
      }
      return gaps.length ? bad(gaps.join("; ")) : ok(`${qids.length} questions answered by every scheme`);
    },
  },
  "schemes-because-resolves": {
    requires: ["schemes/grammar.json", ...SCHEMES.map((s) => `schemes/${s}.json`)],
    run: (c) => {
      const g = c.grammar();
      const qids = new Set([...g.reasons, ...g.scopes].flatMap((x) => x.questions.map((q) => q.id)));
      const broken = [];
      for (const s of SCHEMES) {
        const sch = c.scheme(s);
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
      const sits = c.grammar().situations.map((s) => s.id);
      const gaps = [];
      for (const s of SCHEMES) {
        const have = new Set((c.scheme(s).usage ?? []).filter((u) => u.why).map((u) => u.situation));
        const miss = sits.filter((x) => !have.has(x));
        if (miss.length) gaps.push(`${s}: ${miss.length} situations without a rule and a why`);
      }
      return gaps.length ? bad(gaps.join("; ")) : ok(`${sits.length} situations answered with a why by every scheme`);
    },
  },

  "schemes-tokens-resolve": {
    requires: ["schemes/grammar.json", ...SCHEMES.map((s) => `schemes/${s}.json`)],
    run: (c) => {
      // The rule lives in cli/src/scheme-checks.mjs (OD-292), so the build runs it too.
      const problems = SCHEMES.flatMap((s) => tokensResolve(c.scheme(s)));
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
      // Every color semantic has guidance in the grammar; every key it names exists; every pair keeps
      // its contrast in every brand and mode. No exceptions: a failing pair fails the check.
      const g = c.grammar();
      const guide = new Map(g.semantics.keys.map((k) => [k.id, k]));
      const gaps = [];
      for (const id of g.semantics.urgency.order)
        if (!guide.has(id)) gaps.push(`urgency names ${id}, which has no guidance`);
      let pairs = 0;
      const waiting = new Set();
      for (const s of SCHEMES) {
        const t = c.scheme(s).tokens;
        const semantic = Object.keys(flatten(t.semantic)).filter((p) => p.startsWith("color."));
        // OD-228: the neutral steps are one scale with one entry, the grammar's semantics.neutral.
        const scaleOk = (p) =>
          p.startsWith("color.neutral.") && [...(g.semantics.neutral?.steps ?? []), g.semantics.neutral?.floor?.step].includes(p.split(".")[2]);
        for (const p of semantic)
          if (!guide.has(p) && !scaleOk(p)) gaps.push(`${s}: ${p} has no guidance in the grammar`);
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
            // OD-222: every fill states its tone; text, icons, borders and focus pair by tone.
            for (const f of g.semantics.tones?.fills ?? [])
              if (!toneOf(t.brands[brand].theme, mode, f.id))
                gaps.push(`${s}/${brand}/${mode}: ${f.id} states no tone`);
            // OD-227: a per-fill text name is the pair its fill's tone picks.
            for (const [name, fill] of [
              ["color.text.inverse", "color.surface.inverse"],
              ["color.text.on-action", "color.action.primary.@"],
              ["color.text.on-danger", "color.action.danger.@"],
            ]) {
              const tn = toneOf(t.brands[brand].theme, mode, fill)?.tone;
              if (tn && hex(name) !== hex(`color.text.on-${tn}`))
                gaps.push(`${s}/${brand}/${mode}: ${name} is not color.text.on-${tn}, the text for ${fill}'s tone`);
            }
          }
        // The contrast pairs are a build rule (cli/src/scheme-checks.mjs, OD-292).
        const contrast = contrastPairs({ id: s, tokens: t }, g);
        pairs += contrast.pairs;
        gaps.push(...contrast.gaps);
        for (const w of contrast.waiting) waiting.add(w);
      }
      return gaps.length
        ? bad(`${gaps.length} problems: ${gaps.slice(0, 5).join("; ")}`)
        : ok(
            `${guide.size} color semantics have guidance; ${pairs} pairs keep their contrast in every brand and mode` +
              (waiting.size ? `, except on fills that wait for a fix: ${[...waiting].join("; ")}` : ""),
          );
    },
  },

  "tokens-semantics-are-links": {
    requires: ["schemes/grammar.json"],
    run: (c) => {
      // Raw values live only on primitives (cli/src/scheme-checks.mjs, OD-292).
      const gaps = SCHEMES.map((id) => [id, rawValues(c.scheme(id))])
        .filter(([, raw]) => raw.length)
        .map(([id, raw]) => `${id}: raw values on ${raw.slice(0, 4).join(", ")}`);
      return gaps.length
        ? bad(gaps.join("; "))
        : ok("every semantic and component token is a link; values live on primitives");
    },
  },


  "components-tokens-mapped": {
    requires: ["cli/src/shadcn.mjs", "ui/src/components", "cli/templates/project/tokens/build.mjs"],
    run: async (c) => {
      // OD-215: every shadcn variable a component reads is mapped onto a scheme token, so its "Tokens
      // it reads" table is complete; and a created project's token build maps the same way as ours.
      const { SHADCN, SHADCN_SCALE } = await import(pathToFileURL(c.p("cli/src/shadcn.mjs")).href);
      const LOOKS_SHADCN =
        /^(background|foreground|card|popover|primary|secondary|muted|accent|destructive|border|input|ring|sidebar|chart)(-[a-z0-9-]+)?$/;
      const gaps = [];
      for (const f of readdirSync(c.p("ui/src/components")).filter((x) => x.endsWith(".tsx"))) {
        const src = readFileSync(c.p(`ui/src/components/${f}`), "utf8");
        for (const m of src.matchAll(
          /(?:^|[\s"'`:])(?:bg|text|border|ring|fill|stroke|outline|divide|placeholder|caret)-([a-z][a-z0-9-]*)(?:\/\d+)?(?=[\s"'`]|$)/gm,
        )) {
          const name = m[1];
          if (LOOKS_SHADCN.test(name) && !SHADCN[name]) gaps.push(`${f}: reads --${name}, which no scheme token maps`);
        }
      }
      const tpl = c.read("cli/templates/project/tokens/build.mjs");
      for (const [k, v] of Object.entries(SHADCN))
        if (!tpl.includes(`"${k}": "${v}"`) && !tpl.includes(`${k}: "${v}"`))
          gaps.push(`the project template maps ${k} differently`);
      for (const [k, v] of Object.entries(SHADCN_SCALE))
        if (!tpl.includes(`"${k}": "${v}"`)) gaps.push(`the project template maps ${k} differently`);
      return gaps.length
        ? bad([...new Set(gaps)].slice(0, 8).join("; "))
        : ok("every shadcn variable a component reads maps onto a scheme token, the same in created projects");
    },
  },

  "e2e-app-packages": {
    requires: ["cli/src/components.mjs", "e2e/app/package.json"],
    run: async (c) => {
      // OD-219: the package test builds a fresh app with the workspace's installs, so that app must list
      // every package a component can import, or a component that starts importing one fails in CI only.
      const { PACKAGES } = await import(pathToFileURL(c.p("cli/src/components.mjs")).href);
      const deps = c.json("e2e/app/package.json").dependencies ?? {};
      const missing = Object.keys(PACKAGES).filter((p) => !deps[p]);
      return missing.length
        ? bad(`e2e/app/package.json lacks ${missing.join(", ")}, which components import`)
        : ok(`the package test app lists all ${Object.keys(PACKAGES).length} component packages`);
    },
  },

  "options-distinct": {
    requires: ["schemes/grammar.json"],
    run: (c) => {
      // OD-221: the grammar's options rules. In every scheme, each step of a covered option set has the
      // rule's type and sits at least min_gap from every other step, so no two options look the same.
      const rules = c.grammar().options?.rules ?? [];
      if (!rules.length) return bad("the grammar has no options rules");
      const gaps = [];
      for (const id of SCHEMES) {
        const prim = c.scheme(id).tokens.primitive;
        for (const r of rules) {
          const set = r.applies_to.split(".").reduce((o, k) => o?.[k], prim) ?? {};
          const steps = Object.entries(set).filter(([k]) => !k.startsWith("$"));
          for (const [k, v] of steps)
            if (r.type && v.$type !== r.type) gaps.push(`${id}: ${r.applies_to}.${k} is ${v.$type}, not ${r.type}`);
          const vals = steps
            .map(([, v]) => Number(v.$value))
            .filter((n) => !Number.isNaN(n))
            .sort((a, b) => a - b);
          for (let i = 1; i < vals.length; i++)
            if (vals[i] - vals[i - 1] < r.min_gap - 1e-9)
              gaps.push(`${id}: ${r.id} steps ${vals[i - 1]} and ${vals[i]} are closer than ${r.min_gap}`);
        }
      }
      return gaps.length
        ? bad(gaps.slice(0, 6).join("; "))
        : ok(`every scheme's options are clearly apart: ${rules.map((r) => r.say).join("; ")}`);
    },
  },

  "options-used": {
    requires: ["schemes/grammar.json"],
    run: (c) => {
      // OD-222: outside the groups kept whole (color ramps), every primitive is read by a semantic, a theme,
      // a component key or another primitive. An option nothing reads is a choice nobody made.
      const used = c.grammar().options?.used;
      if (!used) return bad("the grammar's options say nothing about unused options");
      const gaps = [];
      for (const id of SCHEMES) {
        const t = c.scheme(id).tokens;
        const prim = flatten(t.primitive);
        const readers = JSON.stringify([t.semantic, t.component, t.brands, Object.values(prim).map((x) => x.$value)]);
        for (const p of Object.keys(prim))
          if (!used.except.some((g) => p === g || p.startsWith(`${g}.`)) && !readers.includes(`{${p}}`))
            gaps.push(`${id}: ${p} is read by nothing`);
      }
      return gaps.length
        ? bad(gaps.slice(0, 8).join("; "))
        : ok(`every scheme keeps only the options it reads (${used.say})`);
    },
  },

  "answers-match-tokens": {
    requires: ["schemes/grammar.json"],
    run: (c) => {
      // OD-222: a count answer has that many tokens. motion.count names how many speeds exist, so the
      // motion durations hold exactly that many distinct values.
      const N = { one: 1, two: 2, three: 3 };
      const gaps = [];
      for (const id of SCHEMES) {
        const s = c.scheme(id);
        const count = N[s.answers.find((a) => a.question === "motion.count")?.option];
        const prim = flatten(s.tokens.primitive);
        // A duration may name another move's duration ({motion.duration.feedback}): follow it to its step.
        const own = flatten(s.tokens.semantic.motion?.duration ?? {});
        const stepOf = (v) => {
          const ref = String(v).replace(/[{}]/g, "");
          return ref.startsWith("motion.duration.") ? stepOf(own[ref.slice("motion.duration.".length)]?.$value) : (prim[ref]?.$value ?? v);
        };
        const durs = Object.values(own).map((d) => stepOf(d.$value));
        const distinct = new Set(durs).size;
        if (!count) gaps.push(`${id}: no motion.count answer`);
        else if (distinct !== count)
          gaps.push(
            `${id}: motion.count says ${count}, the motion tokens hold ${distinct} (${[...new Set(durs)].join(", ")})`,
          );
      }
      return gaps.length ? bad(gaps.join("; ")) : ok("every scheme's motion count answer matches its motion tokens");
    },
  },

  "spacing-map-generated": {
    requires: ["cli/src/spacing-map.mjs"],
    run: async (c) => {
      // OD-235: every scheme's component spacing map equals the generator's output from its rhythm
      // and fixed steps; the rhythm names the answers it comes from. A hand-edited step fails.
      const { steps, STEP_IDS } = await import(pathToFileURL(c.p("cli/src/spacing-map.mjs")).href);
      const gaps = [];
      for (const id of SCHEMES) {
        const s = c.scheme(id);
        const map = s.tokens.semantic["component-spacing-map"];
        const spec = map?.$extensions?.["open-ds"];
        if (!spec) {
          gaps.push(`${id}: no component spacing map`);
          continue;
        }
        for (const q of spec.because ?? [])
          if (!s.answers.some((a) => `${a.question}` === q))
            gaps.push(`${id}: the rhythm's because ${q} is not an answer`);
        const all = flatten(themeTokens({ id, tokens: s.tokens }, Object.keys(s.tokens.brands)[0], "light"));
        const want = steps(spec);
        for (const st of STEP_IDS) {
          const got = Math.round(parseFloat(String(resolve(all, `component-spacing-map.${st}`)?.value ?? "")) * 16);
          if (got !== want[st])
            gaps.push(`${id}: component-spacing-map.${st} is ${got}px, the rule gives ${want[st]}px`);
        }
      }
      return gaps.length
        ? bad(gaps.join("; "))
        : ok(`the component spacing map in ${SCHEMES.length} schemes matches its rule`);
    },
  },
  "type-scale-generated": {
    requires: ["cli/src/type-scale.mjs", "cli/src/type-space-generated.mjs"],
    run: async (c) => {
      // OD-294, OD-301: each scheme stores its type scale, and the loader generates every size and line
      // height from it. The file stores no size, line height or font option by hand, every role has a
      // step, and each generated reason names its own value.
      const { sizes, lineHeights, specProblems } = await import(pathToFileURL(c.p("cli/src/type-scale.mjs")).href);
      const { generatedProblems } = await import(pathToFileURL(c.p("cli/src/type-space-generated.mjs")).href);
      const gaps = [];
      for (const id of SCHEMES) {
        const s = c.scheme(id);
        const type = s.tokens.semantic.type;
        const spec = type?.$extensions?.["open-ds"];
        if (!spec?.steps || !spec?.rounding) {
          gaps.push(`${id}: no type scale with a rounding rule on the type group`);
          continue;
        }
        gaps.push(...specProblems(spec).map((p) => `${id}: ${p}`));
        for (const q of spec.follows ?? [])
          if (!s.answers.some((a) => a.question === q)) gaps.push(`${id}: the type scale follows ${q}, which is not an answer`);
        for (const role of Object.keys(type).filter((k) => !k.startsWith("$")))
          if (!(role in spec.steps)) gaps.push(`${id}: type.${role} has no step on the scale`);
        const own = generatedProblems(s, c.storedScheme(id)).filter((p) => /: (type|font)\./.test(p));
        gaps.push(...own);
        const px = sizes(spec);
        const lines = lineHeights(spec);
        for (const role of Object.keys(spec.steps)) {
          const why = (key) => type[role]?.[key]?.$extensions?.["open-ds"]?.why ?? "";
          if (!why("font-size").includes(`${px[role]}px`)) gaps.push(`${id}: the reason of type.${role}.font-size does not name ${px[role]}px`);
          const line = lines[role].grid ? `${lines[role].px}px` : String(lines[role].ratio);
          if (!why("line-height").includes(line)) gaps.push(`${id}: the reason of type.${role}.line-height does not name ${line}`);
        }
      }
      return gaps.length
        ? bad(gaps.slice(0, 8).join("; "))
        : ok(`${SCHEMES.length} schemes store their type scale, and the loader generates every size and line height from it`);
    },
  },
  "spacing-use-cases-generated": {
    requires: ["cli/src/spacing-use-cases.mjs", "cli/src/type-space-generated.mjs", "schemes/grammar.json"],
    run: async (c) => {
      // OD-294, OD-301: each scheme stores its spacing record and its control scale, and the loader
      // generates every gap, inset, control height and row from them; the spacing.definition answer sets
      // the space base. The file stores none of those values by hand, every gap and inset has a use case,
      // a row is one default control tall, and each generated reason names its own value.
      const { baseOf, spaceValues, spaceProblems, controlHeights, controlProblems } = await import(
        pathToFileURL(c.p("cli/src/spacing-use-cases.mjs")).href
      );
      const { generatedProblems } = await import(pathToFileURL(c.p("cli/src/type-space-generated.mjs")).href);
      const spacing = c.grammar().scopes.find((sc) => sc.id === "spacing");
      const gaps = [];
      if (!spacing?.use_cases) gaps.push("the spacing scope names no use-case words");
      for (const id of SCHEMES) {
        const s = c.scheme(id);
        const semantic = s.tokens.semantic;
        const answer = (q) => s.answers.find((a) => a.question === q)?.option;
        const space = semantic.space?.$extensions?.["open-ds"];
        const size = semantic.size?.$extensions?.["open-ds"];
        if (!space?.["use-cases"] || !size?.steps) {
          gaps.push(`${id}: no spacing record on space or no control scale on size`);
          continue;
        }
        gaps.push(
          ...spaceProblems(space, { vocabulary: spacing?.use_cases, definition: answer("spacing.definition") }).map((p) => `${id}: ${p}`),
          ...controlProblems(size).map((p) => `${id}: ${p}`),
          ...generatedProblems(s, c.storedScheme(id)).filter((p) => /: (space|size)\./.test(p)),
        );
        for (const q of [...(space.follows ?? []), ...(size.follows ?? [])])
          if (!s.answers.some((a) => a.question === q)) gaps.push(`${id}: a record follows ${q}, which is not an answer`);
        for (const group of ["gap", "inset"])
          for (const k of Object.keys(semantic.space[group] ?? {}).filter((k) => !k.startsWith("$")))
            if (!(`${group}.${k}` in space["use-cases"])) gaps.push(`${id}: space.${group}.${k} has no use case`);
        const want = {
          ...Object.fromEntries(Object.entries(spaceValues(space, baseOf(answer("spacing.definition")))).map(([k, v]) => [`space.${k}`, v])),
          ...Object.fromEntries(Object.entries(controlHeights(size)).map(([k, v]) => [`size.${k}`, v])),
        };
        for (const [name, value] of Object.entries(want)) {
          const token = name.split(".").reduce((n, k) => n?.[k], semantic);
          if (!(token?.$extensions?.["open-ds"]?.why ?? "").includes(`${value}px`)) gaps.push(`${id}: the reason of ${name} does not name ${value}px`);
        }
        if (semantic.size.row?.$value !== semantic.size.control?.default?.$value)
          gaps.push(`${id}: size.row is ${semantic.size.row?.$value}, not one default control tall (${semantic.size.control?.default?.$value})`);
      }
      return gaps.length
        ? bad(gaps.slice(0, 8).join("; "))
        : ok(`${SCHEMES.length} schemes store their spacing records, and the loader generates every gap, inset, control height and row from them`);
    },
  },
  "visible-where-it-meets": {
    requires: ["schemes/grammar.json", ...SCHEMES.map((s) => `schemes/${s}.json`)],
    run: (c) => {
      // OD-242: decorative means no contrast floor, not invisible. In dark, every scheme once picked one
      // neutral step for the menu, its hover and its divider, so both read 1.00:1 and no check asked.
      // Each hover fill and default edge needs a minimum difference from every surface it sits on.
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
      // The floors are the lightest pairs the light themes already ship: a fill at 1.08:1, a 1px line at 1.15:1.
      const MEETS = [
        // OD-241: the state fill is color.surface.highlight; sunken is depth only, a well on content.
        {
          key: "color.surface.highlight",
          job: "highlight fill",
          min: 1.08,
          on: ["color.surface.default", "color.surface.raised"],
        },
        { key: "color.surface.sunken", job: "well", min: 1.08, on: ["color.surface.default"] },
        {
          key: "color.border.default",
          job: "divider",
          min: 1.15,
          on: ["color.surface.canvas", "color.surface.default", "color.surface.raised"],
        },
      ];
      const gaps = [];
      let pairs = 0;
      let lowest = Infinity;
      for (const s of SCHEMES) {
        const t = c.scheme(s).tokens;
        for (const brand of Object.keys(t.brands))
          for (const mode of ["light", "dark"]) {
            const all = flatten(themeTokens({ id: s, tokens: t }, brand, mode));
            const hex = (p) => {
              const v = resolve(all, p).value;
              return typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v) ? v : null;
            };
            for (const m of MEETS)
              for (const on of m.on) {
                const [a, b] = [hex(m.key), hex(on)];
                if (!a || !b) {
                  gaps.push(`${s}/${brand}/${mode}: ${m.key} or ${on} has no color`);
                  continue;
                }
                pairs++;
                const r = ratio(a, b);
                lowest = Math.min(lowest, r);
                if (r < m.min)
                  gaps.push(
                    `${s}/${brand}/${mode}: the ${m.job} ${m.key} on ${on} is ${r.toFixed(2)}:1, needs ${m.min}:1`,
                  );
              }
          }
      }
      return gaps.length
        ? bad(`${gaps.length} problems: ${gaps.slice(0, 5).join("; ")}`)
        : ok(`${pairs} hover fills and dividers are visible where they meet; the lowest is ${lowest.toFixed(2)}:1`);
    },
  },
  "answers-consider": {
    requires: ["schemes/grammar.json", ...SCHEMES.map((s) => `schemes/${s}.json`)],
    run: (c) => {
      // OD-245: a question that lists what an answer must weigh (the typeface: readability, legibility,
      // scalability, numerals, scripts, recognition, familiarity, personality, performance, licensing,
      // fallback) gets an answer that meets each one in words. A skipped consideration is a decision
      // nobody made.
      const g = c.grammar();
      const qs = [...g.reasons, ...g.scopes].flatMap((x) => x.questions).filter((q) => q.considers?.length);
      const gaps = [];
      let n = 0;
      for (const s of SCHEMES) {
        const answers = c.scheme(s).answers;
        for (const q of qs) {
          const a = answers.find((x) => x.question === q.id);
          if (!a) continue;
          for (const k of q.considers) {
            if (a.considers?.[k.id]?.trim()) n++;
            else gaps.push(`${s}: ${q.id} does not say how it meets ${k.label.toLowerCase()}`);
          }
          for (const id of Object.keys(a.considers ?? {}))
            if (!q.considers.some((k) => k.id === id))
              gaps.push(`${s}: ${q.id} answers ${id}, which the question does not ask`);
        }
      }
      return gaps.length
        ? bad(gaps.slice(0, 6).join("; "))
        : ok(`${n} considerations met in words, across ${qs.length} question in ${SCHEMES.length} schemes`);
    },
  },
  "anatomy-assets": {
    requires: ["schemes/grammar.json"],
    run: (c) => {
      // OD-229: an Anatomy reference drawn as Figma assets ships every image it shows, for every
      // scheme: the stage and one per card, each exported from a frame whose node id the parts layer
      // records, so the drawing can be opened and changed in Figma.
      const g = c.grammar();
      const gaps = [];
      let n = 0;
      for (const item of g.catalogue.items.filter((i) => i.anatomy?.drawing?.kind === "asset")) {
        const a = item.anatomy;
        if (!a.drawing.figma?.file) gaps.push(`${item.id}: no Figma file`);
        for (const s of SCHEMES) {
          const want = [
            ["stage", a.drawing.figma?.stage?.[s]],
            ...a.cards.map((card, i) => [`card-${i + 1}`, card.figma?.[s]]),
          ];
          for (const [file, node] of want) {
            n++;
            if (!node) gaps.push(`${item.id}/${s}/${file}: no Figma node`);
            if (!existsSync(c.p(`docs/static/anatomy/${s}/${item.id}/${file}.png`)))
              gaps.push(`${item.id}/${s}/${file}.png is missing`);
          }
        }
      }
      return gaps.length
        ? bad(`${gaps.length}: ${gaps.slice(0, 6).join("; ")}`)
        : ok(`${n} anatomy images, each exported from a Figma frame, in ${SCHEMES.length} schemes`);
    },
  },
  "anatomy-text-from-samples": {
    requires: ["schemes/grammar.json", "scripts/anatomy-figma/sample-text.mjs"],
    run: async (c) => {
      // OD-135: each scheme shows its UI with its own content, as Storybook does. Every text in a tree
      // drawing reads a sample path that resolves in every scheme, or says why it keeps its own text.
      const { sampleText, textNodes } = await import(pathToFileURL(c.p("scripts/anatomy-figma/sample-text.mjs")).href);
      const samples = SCHEMES.map((id) => [id, c.scheme(id).samples]);
      const gaps = [];
      let read = 0;
      let kept = 0;
      for (const item of c.grammar().catalogue.items.filter((i) => i.anatomy?.drawing?.kind === "tree")) {
        for (const node of textNodes(item.anatomy)) {
          if (!node.sample) {
            if (typeof node.fixed === "string" && node.fixed.trim() && typeof node.text === "string") kept++;
            else gaps.push(`${item.id}: "${node.text}" reads no sample`);
            continue;
          }
          read++;
          for (const [id, smp] of samples) {
            const { missing } = sampleText(node, smp);
            if (missing) gaps.push(`${item.id}: ${id} has no samples.${missing.join(", samples.")}`);
          }
        }
      }
      return gaps.length
        ? bad(`${gaps.length}: ${gaps.slice(0, 6).join("; ")}`)
        : ok(
            `${read} anatomy texts read a sample in all ${SCHEMES.length} schemes; ${kept} keep their own text, each with a reason`,
          );
    },
  },
  "floating-panels-agree": {
    requires: ["schemes/grammar.json", "ui/src/components"],
    run: (c) => {
      // OD-243: a panel that floats over the page (a menu, a list, a popover, a dialog) is one kind of
      // surface, so it reads one decision: the overlay corner, the overlay elevation and a border of
      // its own. shadcn decided each one apart, and they drifted (control corners, card shadows). A
      // sheet or a drawer sits on an edge, and a tooltip is a label: they decide their own.
      const g = c.grammar();
      const floats = c
        .walk("ui/src/components", (x) => x.endsWith(".tsx"))
        .filter((f) => /Portal|Viewport/.test(c.read(f)))
        .map((f) =>
          f
            .split("/")
            .pop()
            .replace(/\.tsx$/, ""),
        )
        .filter((x) => !["sheet", "drawer", "tooltip"].includes(x));
      const want = { radius: "radius.surface", shadow: "elevation.overlay" };
      const gaps = [];
      let n = 0;
      for (const comp of floats) {
        const keys = g.component_keys.filter(
          (e) => !e.replaced_by && new RegExp(`^${comp}/(content|sub/content|viewport|popup)/`).test(e.id),
        );
        const panels = [...new Set(keys.map((e) => e.id.replace(/\/[^/]+$/, "")))];
        for (const p of panels) {
          if (!keys.some((e) => e.id === `${p}/radius`)) continue; // not a surface of its own
          n++;
          for (const [prop, sem] of Object.entries(want)) {
            const e = keys.find((x) => x.id === `${p}/${prop}`);
            if (e && e.default !== sem) gaps.push(`${p}/${prop} reads ${e.default}, not ${sem}`);
          }
          if (!keys.some((e) => e.id === `${p}/border`)) gaps.push(`${p} has no border key of its own`);
        }
      }
      return gaps.length
        ? bad(`${gaps.length}: ${gaps.slice(0, 8).join("; ")}`)
        : ok(
            `${n} floating panels in ${floats.length} components read the overlay corner, elevation and a border of their own`,
          );
    },
  },
  "picks-cite-answers": {
    requires: SCHEMES.map((s) => `schemes/${s}.json`),
    run: (c) => {
      // A pick's because must name a question this scheme answers (cli/src/scheme-checks.mjs, OD-292).
      const results = SCHEMES.map((id) => picksCiteAnswers(c.scheme(id)));
      const gaps = results.flatMap((r) => r.gaps);
      const n = results.reduce((sum, r) => sum + r.cited, 0);
      return gaps.length
        ? bad(`${gaps.length} broken: ${gaps.slice(0, 5).join("; ")}`)
        : ok(`${n} answers cited by theme picks, each one this scheme answers`);
    },
  },

  "gaps-only-go-down": {
    requires: ["schemes/grammar.json", "cli/src/gaps.mjs", "harness/gaps-baseline.json"],
    run: async (c) => {
      // OD-243: the gap ledger is the measured baseline of where the decision trace breaks. Each count,
      // per scheme and kind, may only go down. A fix lowers the baseline in the same change (node
      // scripts/gaps.mjs --baseline), so every drop is on record; a new gap fails here.
      const { gapCounts } = await import(pathToFileURL(c.p("scripts/gaps.mjs")).href);
      const base = c.json("harness", "gaps-baseline.json").counts;
      const now = gapCounts();
      const rose = [];
      const fell = [];
      let total = 0;
      for (const [s, kinds] of Object.entries(now))
        for (const [k, n] of Object.entries(kinds)) {
          total += n;
          const was = base[s]?.[k];
          if (was === undefined) rose.push(`${s} ${k}: ${n}, not in the baseline`);
          else if (n > was) rose.push(`${s} ${k}: ${was} → ${n}`);
          else if (n < was) fell.push(`${s} ${k}: ${was} → ${n}`);
        }
      if (rose.length) return bad(`new gaps: ${rose.slice(0, 6).join("; ")}. open-ds gaps <scheme> lists them.`);
      if (fell.length)
        return bad(`gaps fell (good): ${fell.slice(0, 6).join("; ")}. Record it: node scripts/gaps.mjs --baseline.`);
      return ok(`${total} gaps across ${Object.keys(now).length} schemes, none new; each count may only go down`);
    },
  },
  "values-traced": {
    requires: ["cli/src/trace.mjs", "cli/src/token-map-view.mjs", "schemes/grammar.json"],
    run: async (c) => {
      // OD-293: one trace engine for coverage, the Token map and the CLI. Every semantic value reaches
      // an answer, every grammar trace rule cites questions the grammar asks, and the Token map shows
      // a reason for every decision it draws.
      const { traceScheme, untraced } = await import(pathToFileURL(c.p("cli/src/trace.mjs")).href);
      const { tokenMapView } = await import(pathToFileURL(c.p("cli/src/token-map-view.mjs")).href);
      const g = c.grammar();
      const asked = new Set([...g.reasons, ...g.scopes].flatMap((x) => x.questions.map((q) => q.id)));
      const gaps = [];
      for (const r of g.trace ?? [])
        for (const q of r.follows) if (!asked.has(q)) gaps.push(`trace rule ${r.tokens.join(", ")}: ${q} is not a grammar question`);
      let values = 0;
      let decisions = 0;
      for (const id of SCHEMES) {
        const s = c.scheme(id);
        const trace = traceScheme(s, g);
        values += trace.total;
        for (const t of untraced(trace)) gaps.push(`${id}: ${t.token} reaches no answer`);
        for (const brand of Object.keys(s.tokens.brands)) {
          const v = tokenMapView({ scheme: s, grammar: g, brand });
          for (const d of [v.shared, v.modes.light, v.modes.dark].flatMap((m) => Object.values(m.decisions))) {
            decisions++;
            if (!(d.why || d.answers.length || d.stepWhy)) gaps.push(`${id}/${brand}: the Token map shows ${d.id} with no reason`);
          }
        }
      }
      return gaps.length
        ? bad(`${gaps.length} gaps; ${gaps.slice(0, 4).join("; ")}. Run open-ds trace <scheme> <token>.`)
        : ok(`${values} semantic values in ${SCHEMES.length} schemes reach their answers; the Token map shows a reason for all ${decisions} decisions`);
    },
  },
  "reasons-explain-values": {
    requires: ["cli/src/trace.mjs"],
    run: async (c) => {
      // OD-293: a link to an answer is not a reason. Every semantic value carries a reason of its own (its
      // pick, its own words, the group that generates it, or a usage rule that names exactly it). The
      // reason is 6 words or more, cites an answer, and is not another value's sentence.
      const { traceScheme, weakReasons } = await import(pathToFileURL(c.p("cli/src/trace.mjs")).href);
      const g = c.grammar();
      const gaps = [];
      let total = 0;
      for (const id of SCHEMES) {
        const trace = traceScheme(c.scheme(id), g);
        total += trace.total;
        for (const w of weakReasons(trace)) gaps.push(`${id}: ${w.token}, ${w.problem}`);
      }
      return gaps.length
        ? bad(`${gaps.length} values lack a reason that explains them; ${gaps.slice(0, 4).join("; ")}. Run open-ds trace <scheme> --weak.`)
        : ok(`${total} semantic values in ${SCHEMES.length} schemes each have a reason that explains them`);
    },
  },
  "scheme-quality": {
    requires: ["cli/src/quality/extract.mjs", "cli/src/quality/scorecard.mjs", "harness/quality-baseline.json"],
    run: async (c) => {
      // OD-298: the scheme quality gate. Every criterion is a number computed by code: traceability,
      // derived against literal values, invariants, blast radius, accessibility, motion, repetition and
      // size. The baseline holds each number on origin/master with the way it may move; a gated number
      // that moves the wrong way fails. open-ds compare --base origin/master shows the detail.
      const err = ensureTokens(c);
      if (err) return bad(tail(err));
      const { extractRef } = await import(pathToFileURL(c.p("cli/src/quality/extract.mjs")).href);
      const { gateAgainstBaseline } = await import(pathToFileURL(c.p("cli/src/quality/scorecard.mjs")).href);
      const baseline = c.json("harness", "quality-baseline.json");
      const r = gateAgainstBaseline(await extractRef({ root: c.root }), baseline);
      const against = `${baseline.ref} (${String(baseline.sha).slice(0, 10)})`;
      if (!r.ok)
        return bad(
          `${r.worse.length} criteria are worse than ${against}: ${r.worse.slice(0, 6).join("; ")}. Run open-ds compare --base ${baseline.ref} for the detail.`,
        );
      const gated = Object.values(baseline.criteria).filter((x) => x.direction !== "report").length;
      return ok(
        `${gated} gated criteria hold against ${against}` +
          (r.better.length ? `; better: ${r.better.slice(0, 4).join("; ")}` : "") +
          (r.missing.length ? `; not in the baseline yet: ${r.missing.join(", ")} (open-ds compare --base ${baseline.ref} --write-baseline)` : ""),
      );
    },
  },
  "reasons-say-why": {
    requires: ["cli/src/trace.mjs", "scripts/reason-form.mjs", "harness/reason-form-baseline.json"],
    run: async (c) => {
      // OD-294: a reason states its job ("in order to"), how the property does it ("does this by"), what
      // people get ("so") and the decision ("because"), and cites an answer. Scopes convert in rounds:
      // the count of values not yet in the form, per scheme, may only go down. Shape and elevation are
      // converted: every reason they write, in every brand and mode, must be in the form now.
      const { formOfSchemes } = await import(pathToFileURL(c.p("scripts/reason-form.mjs")).href);
      const { formGaps, writtenReasons } = await import(pathToFileURL(c.p("cli/src/trace.mjs")).href);
      const g = c.grammar();
      const base = c.json("harness", "reason-form-baseline.json").counts;
      const rose = [];
      const fell = [];
      const lines = [];
      for (const f of formOfSchemes()) {
        const n = f.off.length;
        const was = base[f.scheme];
        if (was === undefined) rose.push(`${f.scheme} has ${n}, and the baseline does not list it`);
        else if (n > was) rose.push(`${f.scheme} went from ${was} to ${n}`);
        else if (n < was) fell.push(`${f.scheme} went from ${was} to ${n}`);
        lines.push(`${f.scheme} ${n} of ${f.total}`);
      }
      const converted = /^(radius|border-width|elevation)\./;
      const off = [];
      for (const id of SCHEMES)
        for (const r of writtenReasons(c.scheme(id)))
          if (converted.test(r.token)) {
            const missing = formGaps(g, r.token, r.why, r.because);
            if (missing.length) off.push(`${id} ${r.where} ${r.token} misses ${missing.join(", ")}`);
          }
      const counts = `Values whose reason is not in the form yet: ${lines.join("; ")}`;
      if (off.length) return bad(`${off.length} shape or elevation reasons are not in the reason form: ${off.slice(0, 4).join("; ")}`);
      if (rose.length)
        return bad(`more reasons are out of the form: ${rose.join("; ")}. Write them in the grammar's reason_form; node scripts/reason-form.mjs lists them. ${counts}.`);
      if (fell.length)
        return ok(`fewer reasons are out of the form (good): ${fell.join("; ")}. Lower the baseline: node scripts/reason-form.mjs --baseline. ${counts}.`);
      return ok(`every shape and elevation reason is in the form. ${counts}. Each count may only go down.`);
    },
  },
  // OD-297: the design decisions the owner accepted, each checked where it lives.
  "motion-families": {
    requires: ["cli/src/motion.mjs", "schemes/grammar.json"],
    run: async (c) => {
      // Each scheme's family follows motion.roles; its durations keep the family's limits, and each move
      // type's easing is a curve kind the family allows. Only the expressive emphasize move overshoots.
      const { checkMotion } = await import(pathToFileURL(c.p("cli/src/motion.mjs")).href);
      const g = c.grammar();
      const gaps = [];
      const families = [];
      let n = 0;
      for (const id of SCHEMES) {
        const r = checkMotion(c.scheme(id), g);
        gaps.push(...r.errors);
        for (const x of r.results) {
          n++;
          if (!x.holds) gaps.push(`${id}: ${x.token}: ${x.says}`);
        }
        families.push(`${id} ${r.family}`);
      }
      return gaps.length
        ? bad(`${gaps.length}: ${gaps.slice(0, 5).join("; ")}`)
        : ok(`${n} durations and move easings keep their family's limits (${families.join(", ")})`);
    },
  },
  "reduced-motion-keeps-fades": {
    requires: ["ui/src/styles.css", "cli/src/style-rules.mjs"],
    run: async (c) => {
      // Under prefers-reduced-motion nothing moves, and a change still shows: no cut to zero.
      const { reducedMotion } = await import(pathToFileURL(c.p("cli/src/style-rules.mjs")).href);
      const r = reducedMotion(c.read("ui/src/styles.css"));
      const gaps = [];
      if (!r.found) gaps.push("ui/src/styles.css has no prefers-reduced-motion: reduce block");
      else {
        if (r.instant) gaps.push("it cuts motion to zero, so a change no longer shows");
        if (r.movesTransform) gaps.push("transitions may still move: transform or layout is in transition-property");
        if (!r.keepsFade) gaps.push("it drops fades or color changes");
        if (!r.stopsSlides) gaps.push("enter and exit animations still slide or zoom");
      }
      return gaps.length
        ? bad(`ui/src/styles.css: ${gaps.join("; ")}`)
        : ok("under reduced motion nothing moves; fades and color changes stay, at the feedback duration");
    },
  },
  "disabled-by-color": {
    requires: ["ui/src/components", "cli/src/style-rules.mjs", "schemes/grammar.json"],
    run: async (c) => {
      // Disabled reads muted colors and keeps its label readable; opacity is for loading and dragging.
      const { disabledOpacity } = await import(pathToFileURL(c.p("cli/src/style-rules.mjs")).href);
      const gaps = [];
      for (const f of c.walk("ui/src/components", (x) => x.endsWith(".tsx")))
        for (const h of disabledOpacity(c.read(f))) gaps.push(`${f}:${h.line} ${h.cls}`);
      for (const k of c.grammar().component_keys)
        if (!k.replaced_by && k.default === "opacity.disabled") gaps.push(`${k.id} reads opacity.disabled`);
      for (const id of SCHEMES)
        if (!c.scheme(id).tokens.semantic.opacity?.disabled?.$deprecated) gaps.push(`${id}: opacity.disabled is not deprecated`);
      return gaps.length
        ? bad(`${gaps.length}: ${gaps.slice(0, 6).join("; ")}`)
        : ok("no component dims a disabled state with opacity; disabled parts read color.disabled.*");
    },
  },
  "dark-depth": {
    requires: ["cli/src/shape-elevation.mjs", "schemes/grammar.json"],
    run: async (c) => {
      // In dark, raised is lighter than content with a solid, lighter ring; sunken is darker; only
      // floating layers cast a shade. Unlike the OD-294 findings, a break here fails.
      const { checkRelations } = await import(pathToFileURL(c.p("cli/src/shape-elevation.mjs")).href);
      const g = c.grammar();
      const gaps = [];
      let n = 0;
      for (const id of SCHEMES)
        for (const x of checkRelations(c.scheme(id), g).results) {
          const depth = ["color.surface.raised", "color.border.raised"].includes(x.token) || x.says.includes("not a floating layer");
          if (x.relation !== "dark-shade" || x.mode !== "dark" || !depth) continue;
          n++;
          if (!x.holds) gaps.push(`${id}/${x.brand}: ${x.says}`);
        }
      return gaps.length
        ? bad(`${gaps.length}: ${gaps.slice(0, 5).join("; ")}`)
        : ok(`${n} dark depth results hold: raised lighter with a solid lighter ring, sunken darker, shades on floating layers only`);
    },
  },
  "hit-area": {
    requires: ["ui/src/components", "cli/src/style-rules.mjs", "cli/src/shape-elevation.mjs"],
    run: async (c) => {
      // size.hit-area is 24px for a pointer and 44px for touch (accessibility.values). The controls drawn
      // under 24px grow a pseudo-element to it, and the groups keep two hit areas from overlapping.
      const { readsHitArea } = await import(pathToFileURL(c.p("cli/src/style-rules.mjs")).href);
      const { px } = await import(pathToFileURL(c.p("cli/src/shape-elevation.mjs")).href);
      const gaps = [];
      for (const id of SCHEMES) {
        const s = c.scheme(id);
        const target = s.answers.find((a) => a.question === "accessibility.values")?.option;
        const want = target === "pointer" ? 24 : 44;
        const ref = /^\{(.+)\}$/.exec(s.tokens.semantic.size?.["hit-area"]?.$value ?? "")?.[1];
        const got = ref ? px(ref.split(".").reduce((n, k) => n?.[k], s.tokens.primitive)?.$value) : null;
        if (got !== want) gaps.push(`${id}: size.hit-area is ${got ?? "missing"}, the ${target} answer asks ${want}px`);
      }
      const reads = {
        "checkbox.tsx": ["--checkbox-hit-area"],
        "radio-group.tsx": ["--radio-group-item-hit-area"],
        "switch.tsx": ["--switch-hit-area"],
        "slider.tsx": ["--slider-thumb-hit-area"],
        // OD-300: a compact button on touch (36px in Multi-brand) grows to the 44px hit area.
        "button.tsx": ["--button-hit-area"],
      };
      for (const [file, vars] of Object.entries(reads)) {
        const text = c.read(`ui/src/components/${file}`);
        for (const v of vars) if (!readsHitArea(text, v)) gaps.push(`${file} does not grow its hit area from ${v}`);
      }
      if (!c.read("ui/src/components/radio-group.tsx").includes("calc(var(--radio-group-item-hit-area)-var(--radio-group-item-icon-size))"))
        gaps.push("radio-group.tsx: the gap does not keep two radios' hit areas apart");
      if (!c.read("ui/src/components/field.tsx").includes("min-h-[var(--field-group-hit-area)]"))
        gaps.push("field.tsx: a checkbox group's rows are not one hit area tall");
      if (!c.read("ui/src/components/button-group.tsx").includes("[&>[data-slot=button]]:after:hidden"))
        gaps.push("button-group.tsx: stacked buttons grow hit areas over each other");
      return gaps.length
        ? bad(gaps.slice(0, 6).join("; "))
        : ok("size.hit-area is 24px for a pointer and 44px for touch; 5 controls grow to it, and their groups keep hit areas apart");
    },
  },
  "focus-ring-token": {
    requires: ["cli/src/shape-elevation.mjs", "schemes/grammar.json"],
    run: async (c) => {
      // The focus ring is its own token, not a third border width, and one step heavier than the line.
      const { checkRelations } = await import(pathToFileURL(c.p("cli/src/shape-elevation.mjs")).href);
      const g = c.grammar();
      const gaps = [];
      for (const k of g.component_keys)
        if (!k.replaced_by && /^border-width\.focus/.test(k.default)) gaps.push(`${k.id} reads ${k.default}`);
      for (const id of SCHEMES) {
        const s = c.scheme(id);
        const ring = s.tokens.semantic.focus?.ring ?? {};
        for (const leaf of ["width", "offset"]) if (!ring[leaf] || ring[leaf].$deprecated) gaps.push(`${id}: no focus.ring.${leaf}`);
        for (const leaf of ["focus", "focus-offset"])
          if (s.tokens.semantic["border-width"]?.[leaf] && !s.tokens.semantic["border-width"][leaf].$deprecated)
            gaps.push(`${id}: border-width.${leaf} is still a border width`);
        for (const x of checkRelations(s, g).results)
          if (x.token === "focus.ring.width" && !x.holds) gaps.push(`${id}/${x.brand}: ${x.says}`);
      }
      return gaps.length
        ? bad(gaps.slice(0, 6).join("; "))
        : ok("focus.ring.width and focus.ring.offset are their own tokens; the ring is one step heavier than the default line in every scheme");
    },
  },
  "edge-rule": {
    requires: ["cli/src/shape-elevation.mjs", "schemes/grammar.json"],
    run: async (c) => {
      // OD-300: a line that is the only cue that you can click or type reads the strong border and
      // meets 3:1 in every brand and mode; a quiet line reads the faint one. Unlike the OD-294
      // boundary findings, a break here fails.
      const { edgeRule } = await import(pathToFileURL(c.p("cli/src/shape-elevation.mjs")).href);
      const g = c.grammar();
      const gaps = [];
      let n = 0;
      for (const id of SCHEMES) {
        const r = edgeRule(c.scheme(id), g);
        n += r.checked;
        gaps.push(...r.gaps);
      }
      return gaps.length
        ? bad(`${gaps.length}: ${gaps.slice(0, 5).join("; ")}`)
        : ok(`${n} edges hold the edge rule: each only cue reads color.border.strong at 3:1 or more, each quiet line reads color.border.default`);
    },
  },
  "uppercase-tracking": {
    requires: ["cli/src/style-rules.mjs"],
    run: async (c) => {
      // Uppercase labels use 0.05 to 0.12em of letter spacing, wherever a scheme is drawn.
      const { trackingOutOfRange, uppercaseLabels, UPPERCASE_TRACKING } = await import(pathToFileURL(c.p("cli/src/style-rules.mjs")).href);
      const roots = ["ui/src", "doc-composites/src", "docs/src", "storybook/stories", "storybook/src", "cli/templates"];
      const gaps = [];
      let n = 0;
      for (const root of roots.filter((r) => c.has(r)))
        for (const f of c.walk(root, (x) => /\.(tsx?|css)$/.test(x))) {
          const text = c.read(f);
          n += uppercaseLabels(text).length;
          for (const x of trackingOutOfRange(text)) gaps.push(`${f}:${x.line} tracks ${x.em === null ? "in a unit other than em" : `${x.em}em`}`);
        }
      return gaps.length
        ? bad(`${gaps.length}: ${gaps.slice(0, 6).join("; ")}`)
        : ok(`${n} uppercase labels track ${UPPERCASE_TRACKING.min}–${UPPERCASE_TRACKING.max}em`);
    },
  },
  "shape-elevation-relations": {
    requires: ["cli/src/shape-elevation.mjs", "schemes/grammar.json"],
    run: async (c) => {
      // OD-294: control and surface corners are decisions; option, element and badge follow them by a
      // relation; the focus ring follows the default line; shadows are one scale by layer, and dark
      // keeps the light shape. A record that is missing or cannot be checked fails. Where today's values
      // break a relation, the check lists it as a finding and passes: the user decides those.
      const { checkRelations, elevationScale } = await import(pathToFileURL(c.p("cli/src/shape-elevation.mjs")).href);
      const g = c.grammar();
      const errors = [];
      // Findings by token, so one cause reads as one line however many themes it shows in.
      const findings = new Map();
      let held = 0;
      const schemes = SCHEMES.map((id) => c.scheme(id));
      for (const s of schemes) {
        const r = checkRelations(s, g);
        errors.push(...r.errors);
        for (const x of r.results)
          if (x.holds) held++;
          else {
            const f = findings.get(x.token) ?? { themes: [], says: x.says };
            f.themes.push(`${s.id}/${x.brand}/${x.mode}`);
            findings.set(x.token, f);
          }
      }
      for (const row of elevationScale(schemes, g))
        if (!row.same)
          findings.set(`elevation.values ${row.values} step ${row.step}`, { themes: row.shapes.map((x) => x.scheme), says: row.shapes.map((x) => `${x.scheme} ${x.shape}`).join(", ") });
      if (errors.length) return bad(`${errors.length} relation records cannot be checked: ${errors.slice(0, 4).join("; ")}`);
      const list = [...findings].map(([token, f]) => `${token} in ${f.themes.length} themes (first ${f.themes[0]}: ${f.says})`);
      return ok(`${held} relations hold${list.length ? `; findings for the user to decide (warnings): ${list.join("; ")}` : ""}`);
    },
  },
  "decisions-cover-values": {
    requires: ["schemes/grammar.json", "cli/src/coverage.mjs", "harness/coverage-baseline.json"],
    run: async (c) => {
      // OD-273: every semantic value rests on a decision, through a theme pick or a usage rule that
      // cites an answer. The count of values with none, per scheme, may only go down.
      const { coverageOfSchemes } = await import(pathToFileURL(c.p("scripts/coverage.mjs")).href);
      const base = c.json("harness", "coverage-baseline.json").counts;
      const rose = [];
      const fell = [];
      const lines = [];
      for (const cov of coverageOfSchemes()) {
        const n = cov.unlinked.length;
        const was = base[cov.scheme];
        if (was === undefined) rose.push(`${cov.scheme} has ${n}, and the baseline does not list it`);
        else if (n > was) rose.push(`${cov.scheme} went from ${was} to ${n}`);
        else if (n < was) fell.push(`${cov.scheme} went from ${was} to ${n}`);
        const first = cov.unlinked.slice(0, 4).map((u) => u.token);
        lines.push(`${cov.scheme} ${n} of ${cov.total} (first: ${first.join(", ") || "none"})`);
      }
      const counts = `Values with no decision: ${lines.join("; ")}`;
      if (rose.length)
        return bad(
          `more values rest on no decision: ${rose.join("; ")}. Cite an answer in the pick or a usage rule; node scripts/coverage.mjs lists them. ${counts}.`,
        );
      if (fell.length)
        return ok(
          `fewer values rest on no decision (good): ${fell.join("; ")}. Lower the baseline: node scripts/coverage.mjs --baseline. ${counts}.`,
        );
      return ok(`${counts}. Each count may only go down.`);
    },
  },
  "scheme-order": {
    requires: ["schemes/grammar.json", "storybook/src/scheme-context.tsx", "site/src/lib/home.ts"],
    run: (c) => {
      // One order everywhere: the grammar's scheme_order. The CLI, MCP, docs and website sort by it in
      // code; Storybook's toolbar and the website's home list are written by hand, so check them.
      const order = c.grammar().scheme_order?.order ?? [];
      const ids = readdirSync(c.p("schemes"))
        .filter((f) => f.endsWith(".json") && f !== "grammar.json")
        .map((f) => f.replace(/\.json$/, ""));
      const gaps = [];
      for (const id of ids) if (!order.includes(id)) gaps.push(`scheme_order leaves out ${id}`);
      for (const id of order) if (!ids.includes(id)) gaps.push(`scheme_order names ${id}, which is not a scheme`);
      const inOrder = (list) => list.every((id, i) => i === 0 || order.indexOf(list[i - 1]) <= order.indexOf(id));
      const toolbar = [
        ...new Set(
          [...c.read("storybook/src/scheme-context.tsx").matchAll(/value: "([a-z-]+?)(?:--[a-z]+)?"/g)].map(
            (m) => m[1],
          ),
        ),
      ];
      if (!inOrder(toolbar)) gaps.push(`Storybook's toolbar lists ${toolbar.join(", ")}`);
      const home = JSON.parse(c.read("site/src/lib/home.ts").match(/HOME_SCHEMES = (\[[^\]]*\])/)?.[1] ?? "[]");
      if (!inOrder(home)) gaps.push(`the website's home lists ${home.join(", ")}`);
      return gaps.length ? bad(gaps.join("; ")) : ok(`one order everywhere: ${order.join(", ")}`);
    },
  },

  "docs-css-tone": {
    requires: ["schemes/grammar.json", "docs/src/css/custom.css", "docs/src/css/visual.css"],
    run: (c) => {
      // OD-222, in our own CSS: text on a fill follows the fill's tone. The grammar's tone rule keeps
      // color.text.* (link, secondary, primary) for the page's own surfaces; on any other fill (a
      // selected row, an action, a status, the inverse surface) the text is on-light or on-dark by the
      // fill's tone. A link-colored label on the selected fill passed contrast and still read as mush.
      const g = c.grammar();
      const page = new Set([
        "color.surface.canvas",
        "color.surface.default",
        "color.surface.raised",
        "color.surface.sunken",
        "color.surface.highlight",
        "color.surface.pressed",
      ]);
      const css = (id) => `--${id.replace(/\.@$/, "").replaceAll(".", "-")}`;
      const fills = (g.semantics.tones?.fills ?? [])
        .map((f) => f.id)
        .filter((id) => !page.has(id))
        .map(css);
      // Allowed text on a toned fill: the tone pairs, the per-fill names, and the docs' variable that
      // the generator sets from the tone (--ods-text-on-selected).
      const allowed =
        /^(inherit|currentColor|var\(--(ods-text-on-[a-z-]+|color-text-on-[a-z-]+|color-text-[a-z]+-on-(light|dark)|color-text-inverse)\b)/;
      const files = [
        "docs/src/css/custom.css",
        "docs/src/css/visual.css",
        "cli/templates/project/docs/src/css/custom.css",
        "cli/templates/project/docs/src/css/visual.css",
      ].filter((f) => c.has(f));
      const gaps = [];
      let rules = 0;
      for (const f of files) {
        const text = c.read(f);
        for (const m of text.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
          const bg = m[2].match(/(?:^|;|\s)background(?:-color)?:\s*([^;]+);/)?.[1] ?? "";
          if (!fills.some((v) => bg.includes(`var(${v})`) || bg.includes(`var(${v},`))) continue;
          rules++;
          const color = m[2].match(/(?:^|;|\s)color:\s*([^;]+);/)?.[1]?.trim();
          if (color && !allowed.test(color)) {
            const line = text.slice(0, m.index).split("\n").length;
            const sel = m[1]
              .replace(/\/\*[\s\S]*?\*\//g, "")
              .trim()
              .replace(/\s+/g, " ");
            gaps.push(`${f}:${line} ${sel}: ${color} on ${bg.trim()}`);
          }
        }
      }
      return gaps.length
        ? bad(
            `text that ignores its fill's tone: ${gaps.slice(0, 6).join("; ")}${gaps.length > 6 ? ` and ${gaps.length - 6} more` : ""}`,
          )
        : ok(`${rules} rules paint a toned fill in the docs CSS; each one's text follows the tone`);
    },
  },

  "docs-no-native-select": {
    requires: ["docs/src"],
    run: (c) => {
      // Open DS decision (2026-11-05): our own sites use no native select. It opens the operating
      // system's menu and the browser's focus ring, so the docs would stop wearing the scheme.
      const gaps = [];
      const walk = (dir) => {
        for (const e of readdirSync(c.p(dir), { withFileTypes: true })) {
          const rel = `${dir}/${e.name}`;
          if (e.isDirectory()) walk(rel);
          else if (/\.(tsx|jsx|ts|js|mdx|md|html)$/.test(e.name) && /<select[\s>]/.test(c.read(rel))) gaps.push(rel);
        }
      };
      for (const d of ["docs/src", "cli/templates/project/docs/src", "site/src"]) if (c.has(d)) walk(d);
      return gaps.length
        ? bad(
            `a native <select> in ${gaps.join(", ")}: use the picker (docs/src/theme/NavbarItem/SchemeSwitcher.tsx, site/src/components/picker.tsx)`,
          )
        : ok("no native select in the docs, the created project's docs or the website");
    },
  },

  "spacing-on-grid": {
    run: async (c) => {
      // OD-235: on the 4px grid, at most 64px, the hairline aside (cli/src/scheme-checks.mjs, OD-292).
      const gaps = SCHEMES.flatMap((id) => spacingOffGrid(c.scheme(id)));
      return gaps.length
        ? bad(`off the 4px grid or over 64px: ${gaps.join("; ")}`)
        : ok("every spacing in every scheme is a multiple of 4px, at most 64px (the 2px hairline aside)");
    },
  },

  "scales-generated": {
    requires: ["cli/src/ramps.mjs"],
    run: async (c) => {
      // OD-223: every colored hue's scales are whole and equal to the generator's output from its
      // recorded key colors and adjustments. A hand-edited step fails.
      const { scale, STEPS } = await import(pathToFileURL(c.p("cli/src/ramps.mjs")).href);
      const gaps = [];
      let n = 0;
      for (const id of SCHEMES) {
        const s = c.scheme(id);
        const all = flatten(themeTokens({ id, tokens: s.tokens }, Object.keys(s.tokens.brands)[0], "dark"));
        const canvas = String(resolve(all, "color.surface.canvas").value).slice(0, 7).toUpperCase();
        for (const [hue, g] of Object.entries(s.tokens.primitive.color)) {
          const spec = g?.$extensions?.["open-ds"];
          if (!spec) continue;
          for (const mode of ["light", "dark"]) {
            const want = scale(spec[mode], mode, canvas);
            for (const st of STEPS) {
              const got = String(g[mode]?.[st]?.$value ?? "").toUpperCase();
              if (got !== want[st])
                gaps.push(`${id}: ${hue}.${mode}.${st} is ${got || "missing"}, the generator gives ${want[st]}`);
            }
          }
          n++;
        }
      }
      return gaps.length
        ? bad(gaps.slice(0, 6).join("; "))
        : ok(`${n} colored hues have whole scales, generated from their key colors`);
    },
  },

  "hints-measured": {
    requires: ["schemes/grammar.json", "cli/src/ramps.mjs"],
    run: async (c) => {
      // OD-230: the decision hints that can be measured hold. Every hint names the decisions it came
      // from; every chroma adjustment sits on a step that needed it (generated chroma below the 0.04
      // target, OD-231); and status text on dark shows its hue (chroma 0.04+) at 7:1 or more.
      const { scale, lch, contrast } = await import(pathToFileURL(c.p("cli/src/ramps.mjs")).href);
      const { follow } = await import(pathToFileURL(c.p("cli/src/scale-map.mjs")).href);
      const g = c.grammar();
      const hints = g.scopes.flatMap((s) => (s.hints ?? []).map((h) => ({ ...h, scope: s.id })));
      const gaps = [];
      if (!hints.length) gaps.push("the grammar has no decision hints");
      for (const h of hints) if (!h.from?.length) gaps.push(`hint ${h.scope}.${h.id} names no decision`);
      const TARGET = 0.04;
      let moves = 0;
      let texts = 0;
      for (const id of SCHEMES) {
        const s = c.scheme(id);
        const at = (p) =>
          String(p.split(".").reduce((n, k) => n && n[k], s.tokens.primitive)?.$value ?? "").slice(0, 7);
        for (const [hue, grp] of Object.entries(s.tokens.primitive.color)) {
          const spec = grp?.$extensions?.["open-ds"];
          for (const mode of ["light", "dark"])
            for (const [st, adj] of Object.entries(spec?.[mode]?.adjust ?? {})) {
              if (adj.C == null || adj.C <= 0) continue;
              moves++;
              if (mode !== "light") continue;
              const generated = scale({ key: spec.light.key }, "light")[st];
              if (lch(generated)[1] >= TARGET)
                gaps.push(
                  `${id}: ${hue}.${mode}.${st} takes more chroma, but its generated chroma already meets ${TARGET}`,
                );
            }
        }
        for (const b of Object.keys(s.tokens.brands))
          for (const k of ["info", "success", "warning", "danger"]) {
            const t = follow(s.tokens, b, "dark", `color.text.${k}-on-dark`);
            const f = follow(s.tokens, b, "dark", `color.status.${k}.subtle`);
            if (!t || !f) continue;
            texts++;
            const tv = at(t.prim);
            const fv = at(f.prim);
            if (lch(tv)[1] < TARGET - 0.002)
              gaps.push(`${id}/${b}: text.${k}-on-dark reads as white (chroma ${lch(tv)[1].toFixed(3)})`);
            if (contrast(tv, fv) < 7)
              gaps.push(
                `${id}/${b}: text.${k}-on-dark is ${contrast(tv, fv).toFixed(1)}:1 on its dark tint, under 7:1`,
              );
          }
      }
      return gaps.length
        ? bad(gaps.slice(0, 6).join("; "))
        : ok(
            `${hints.length} decision hints, each from a decision; ${moves} chroma moves, each where needed; ${texts} status texts on dark show their hue at 7:1 or more`,
          );
    },
  },

  "neutral-semantic": {
    requires: ["schemes/grammar.json"],
    run: (c) => {
      // OD-228: roles read color.neutral, color.neutral points at one gray from the grammar's menu, and the
      // theme says which gray and why.
      const g = c.grammar().semantics?.neutral;
      if (!g) return bad("the grammar has no neutral menu");
      const menu = new Map(g.grays.map((x) => [x.id, x]));
      const gaps = [];
      for (const id of SCHEMES) {
        const s = c.scheme(id);
        const sem = s.tokens.semantic.color?.neutral;
        for (const st of g.steps) if (!sem?.[st]) gaps.push(`${id}: no color.neutral.${st}`);
        const grays = g.grays.map((x) => x.id);
        for (const [brand, br] of Object.entries(s.tokens.brands)) {
          const n = br.theme.neutral;
          if (!n) {
            gaps.push(`${id}/${brand}: no neutral decision`);
            continue;
          }
          if (!menu.has(n.gray)) gaps.push(`${id}/${brand}: ${n.gray} is not on the grammar's gray menu`);
          else if (menu.get(n.gray).temperature !== n.temperature)
            gaps.push(`${id}/${brand}: ${n.gray} is ${menu.get(n.gray).temperature}, not ${n.temperature}`);
          for (const q of n.because)
            if (!s.answers.some((a) => a.question === q))
              gaps.push(`${id}/${brand}: neutral cites ${q}, which has no answer`);
          for (const mode of ["light", "dark"]) {
            const scale = br.theme[mode].color?.neutral ?? {};
            for (const st of g.steps)
              if (scale[st]?.$value !== `{color.${n.gray}.${mode}.${st}}`)
                gaps.push(`${id}/${brand}/${mode}: neutral.${st} does not point at ${n.gray}.${mode}.${st}`);
            // The floor, where a scheme has one: below 0 in dark; step 0 in light, as nothing is above white.
            const floor = g.floor?.step;
            const want = { light: `{color.${n.gray}.light.0}`, dark: `{color.${n.gray}.dark.${floor}}` }[mode];
            if (floor && sem?.[floor] && scale[floor]?.$value !== want) gaps.push(`${id}/${brand}/${mode}: neutral.${floor} does not point at ${want}`);
            const rest = JSON.stringify({ ...br.theme[mode].color, neutral: undefined });
            for (const gr of grays)
              if (rest.includes(`{color.${gr}.`))
                gaps.push(`${id}/${brand}/${mode}: a role reads the gray ${gr} directly`);
          }
        }
      }
      return gaps.length
        ? bad(gaps.slice(0, 6).join("; "))
        : ok(
            `roles read color.neutral; each scheme's neutral points at one gray from the menu of ${g.grays.length}, with its reason`,
          );
    },
  },

  "focus-ring-gap": {
    requires: ["ui/src/components"],
    run: (c) => {
      // OD-222: the focus ring is the accent, often the color of the fill it surrounds, so every ring
      // keeps a gap in the canvas color between it and the control. OD-243: the gap is a decision,
      // border-width.focus-offset, read through the component's own focus-offset key.
      const gaps = [];
      for (const f of c.walk("ui/src/components", (x) => x.endsWith(".tsx")))
        for (const cls of c.read(f).match(/"[^"\n]*"/g) ?? []) {
          // A ring drawn on focus, on focus inside (focus-within), or through has-[…:focus-visible].
          const draws = /(focus-visible\]?|focus-within|has-focus|focus):ring-(?!0\b|offset)/.test(cls);
          if (draws && !/ring-offset-\[length:var\(--[a-z0-9-]+-focus-offset\)\]/.test(cls))
            gaps.push(`${f}: a focus ring with no gap, or a gap not read from its focus-offset key`);
        }
      return gaps.length
        ? bad(gaps.slice(0, 6).join("; "))
        : ok("every focus ring keeps its gap from the control, read from focus.ring.offset");
    },
  },

  "selection-not-color-alone": {
    requires: ["ui/src/components"],
    run: (c) => {
      // OD-222: a selected or current item shows an edge as well as a fill, so selection is never color alone.
      const gaps = [];
      for (const f of c.walk("ui/src/components", (x) => x.endsWith(".tsx")))
        for (const cls of c.read(f).match(/"[^"\n]*"/g) ?? []) {
          const fill = cls.match(/(data-\[(?:state=selected|active=true)\]):bg-/);
          if (fill && !cls.includes(`${fill[1]}:shadow-[inset_`)) gaps.push(`${f}: ${fill[1]} has a fill and no edge`);
        }
      return gaps.length
        ? bad(gaps.slice(0, 6).join("; "))
        : ok("every selected or current item has an edge beside its fill");
    },
  },

  "danger-apart": {
    requires: ["schemes/grammar.json"],
    run: (c) => {
      // OD-222: the primary and danger fills stay clearly apart in every brand and mode. The rule is a
      // stays-apart connection in the grammar (OD-304).
      const rule = c.grammar().semantics?.connections?.items?.find((x) => x.id === "danger-apart-from-primary");
      if (!rule) return bad("the grammar has no danger-apart-from-primary connection");
      const lab = (hex) => {
        const [r, g, b] = [1, 3, 5]
          .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
          .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
        const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
        const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
        const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
        return [
          0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
          1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
          0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
        ];
      };
      const dE = (a, b) => Math.hypot(...lab(a).map((v, i) => v - lab(b)[i])) * 100;
      const gaps = [];
      const waiting = [];
      for (const s of SCHEMES) {
        const t = c.scheme(s).tokens;
        for (const brand of Object.keys(t.brands))
          for (const mode of ["light", "dark"]) {
            const all = flatten(themeTokens({ id: s, tokens: t }, brand, mode));
            const [p, d] = ["color.action.primary.@", "color.action.danger.@"].map((x) => resolve(all, x).value);
            if (!/^#/.test(p ?? "") || !/^#/.test(d ?? "")) {
              gaps.push(`${s}/${brand}/${mode}: no primary or danger fill`);
              continue;
            }
            const v = dE(p, d);
            if (v >= rule.min_delta_e) continue;
            const w = toneOf(t.brands[brand].theme, mode, "color.action.primary.@")?.waits;
            const what = `${s}/${brand}/${mode}: primary and danger are ${v.toFixed(1)} apart`;
            if (w) waiting.push(`${what} (${w.for})`);
            else gaps.push(`${what}, need ${rule.min_delta_e}`);
          }
      }
      return gaps.length
        ? bad(gaps.slice(0, 6).join("; "))
        : ok(`${rule.says}` + (waiting.length ? `, except where a fix waits: ${waiting.join("; ")}` : ""));
    },
  },

  "catalogue-built": {
    requires: ["schemes/grammar.json", "ui/src/components"],
    run: (c) => {
      // OD-214: a component is In or Left out, nothing else. Every catalogue component is built, with
      // its stories, so every scheme can carry it, render it and document it.
      const items = c.grammar().catalogue.items.map((i) => i.id);
      const built = new Set(readdirSync(c.p("ui/src/components")).map((f) => f.replace(/\.tsx$/, "")));
      const stories = new Set(readdirSync(c.p("storybook/stories")).map((f) => f.replace(/\.stories\.tsx$/, "")));
      const gaps = [
        ...items.filter((i) => !built.has(i)).map((i) => `${i} is not built`),
        ...items.filter((i) => !stories.has(i)).map((i) => `${i} has no stories`),
      ];
      return gaps.length
        ? bad(gaps.join("; "))
        : ok(`all ${items.length} catalogue components are built, with stories`);
    },
  },

  "inventory-decided": {
    requires: ["schemes/grammar.json"],
    run: (c) => {
      // OD-211: every catalogue item is decided in every scheme. It is in, with why (a limited use
      // says where it fits), or out, with the reason argued from the scheme's answers and what to use
      // instead. Nothing falls out by default.
      const items = c.grammar().catalogue.items.map((i) => i.id);
      const gaps = [];
      for (const id of SCHEMES) {
        const s = c.scheme(id);
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
        attachment: "conversation",
        bubble: "conversation",
        marker: "conversation",
        message: "conversation",
        "message-scroller": "conversation",
        item: "menu",
        menubar: "menu",
        "hover-card": "card",
      };
      const gaps = [];
      const seen = new Map();
      for (const id of SCHEMES) {
        const s = c.scheme(id);
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
      const g = c.grammar();
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
            // a key, bare or quoted, followed by a space: never the start of a wrapped class like "hover:bg-…"
            const m = line.match(/^\s*(?:([a-zA-Z-]+)|"([a-zA-Z-]+)"):(?:\s|$)/);
            if (m) axis.push(m[1] ?? m[2]);
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
        const s = c.scheme(sid);
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
      const g = c.grammar();
      const items = Object.fromEntries((g.catalogue?.items ?? []).map((i) => [i.id, i]));
      // The families each roles option admits live in the grammar, so the site and this check agree.
      const ROLES = g.catalogue?.roles ?? {};
      const gaps = [];
      for (const id of SCHEMES) {
        const s = c.scheme(id);
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
        const sch = c.scheme(s);
        const v = sch.voice;
        const g = c.grammar();
        const voiceSits = g.situations.filter((x) => x.scope === "voice").map((x) => x.id);
        const withExample = sch.usage.filter((u) => voiceSits.includes(u.situation) && u.example);
        if (!v?.summary?.text || voiceSits.length < 5 || withExample.length !== voiceSits.length)
          gaps.push(`${s}: voice and tone incomplete (every voice situation needs a rule with an example)`);
        for (const b of Object.keys(sch.tokens.brands)) {
          for (const m of ["light", "dark"])
            if (!sch.themes.some((t) => t.brand === b && t.mode === m)) gaps.push(`${s}: ${b} has no ${m}`);
        }
      }
      const brands = Object.keys(c.scheme("multi-brand").tokens.brands);
      if (brands.length < 3) gaps.push(`multi-brand has ${brands.length} brands; a real setup needs at least 3`);
      return gaps.length
        ? bad(gaps.join("; "))
        : ok("voice and tone in every scheme; light and dark for every brand; multi-brand has 3 brands");
    },
  },

  "scopes-uniform-template": {
    requires: ["schemes/grammar.json", ...SCHEMES.map((s) => `schemes/${s}.json`)],
    run: (c) => {
      const g = c.grammar();
      const gaps = [];
      const methods = (g.methods ?? []).map((m) => m.id);
      if (methods.join() !== "roles,count,definition,values,lands")
        gaps.push(`methods are ${methods.join() || "missing"}`);
      if (g.reasons.some((r) => r.id === "voice")) gaps.push("voice is a reason; it must be a scope");
      if (!g.scopes.some((x) => x.id === "voice")) gaps.push("voice and tone is not a scope");
      const comps = new Map(g.components.map((x) => [x.id, x]));
      const keyDefault = new Map(g.component_keys.map((k) => [k.id, k.default]));
      const schemes = SCHEMES.map((id) => c.scheme(id));
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
        // lands_in is traced from the components' code (lands-in-traced); here, each is a real component.
        for (const cid of sc.lands_in ?? [])
          if (!c.has(`ui/src/components/${cid}.tsx`)) gaps.push(`${sc.id}: lands in ${cid}, which is not a component`);
      }
      for (const x of g.situations)
        if (!g.scopes.some((sc) => sc.id === x.scope)) gaps.push(`situation ${x.id} has no scope`);
      return gaps.length
        ? bad(gaps.slice(0, 12).join("; "))
        : ok(`${g.scopes.length} scopes, each with the 5 method questions, owned tokens, components and situations`);
    },
  },

  "components-own-api": {
    requires: ["cli/src/lands.mjs", "harness/component-api-fixed.json"],
    run: async (c) => {
      // OD-234: every component has its own token API. Its code reads only its own tokens (each an alias
      // of a semantic), never a system token or a shadcn utility directly; and a fixed Tailwind spacing
      // or size is allowed only while it waits, listed, for a semantic of the same value.
      const { componentApi } = await import(pathToFileURL(c.p("cli/src/lands.mjs")).href);
      const scheme = c.scheme("dense-data");
      const fixed = new Set(c.json("harness", "component-api-fixed.json").values.map((x) => x.split(" (")[0]));
      // OD-235: spacing is never fixed any more; only sizes may wait on the list
      const gaps = [];
      for (const x of fixed)
        if (/: (p|px|py|pt|pb|pl|pr|gap|gap-x|gap-y)-/.test(x))
          gaps.push(`${x} is a fixed spacing; it takes a step of the component spacing map`);
      const dir = c.p("ui/src/components");
      let own = 0;
      let n = 0;
      for (const f of readdirSync(dir).filter((x) => x.endsWith(".tsx"))) {
        const comp = f.replace(/\.tsx$/, "");
        const api = componentApi(scheme, comp, { ui: c.p("ui/src") });
        n++;
        own += api.filter((x) => x.own).length;
        for (const x of api.filter((y) => !y.own)) gaps.push(`${comp} reads ${x.token} directly`);
        const src = c.read("ui/src/components", f);
        for (const m of src.matchAll(
          /(?:^|[\s"'`:])((?:p|px|py|pt|pb|pl|pr|gap|gap-x|gap-y|size|h)-[\d.]+)(?=[\s"'`]|$)/gm,
        )) {
          if (/-0$/.test(m[1])) continue;
          if (!fixed.has(`${comp}: ${m[1]}`)) gaps.push(`${comp} has a fixed ${m[1]} that is not listed`);
        }
        // OD-243: a focus ring's width and gap are decisions (border-width.focus, .focus-offset). shadcn
        // wrote them by hand (ring-2, ring-[3px], ring-offset-2); none may come back unlisted.
        for (const m of src.matchAll(
          /(?:^|[\s"'`:])((?:ring|ring-offset|outline|outline-offset)-(?:[1-9]\d*|\[\d+px\]))(?=[\s"'`]|$)/gm,
        ))
          if (!fixed.has(`${comp}: ${m[1]}`))
            gaps.push(`${comp} has a hand-written ${m[1]}; read border-width.focus or .focus-offset through a key`);
      }
      return gaps.length
        ? bad([...new Set(gaps)].slice(0, 8).join("; "))
        : ok(
            `${n} components read ${own} tokens of their own and nothing else; ${fixed.size} fixed values wait, listed, for a semantic`,
          );
    },
  },

  "lands-in-traced": {
    requires: ["schemes/grammar.json", "cli/src/lands.mjs"],
    run: async (c) => {
      // OD-233: where each scope lands is traced from the components' own code, never hand-written.
      // Every component that reads a token the scope owns is listed, and nothing else.
      const { landsIn } = await import(pathToFileURL(c.p("cli/src/lands.mjs")).href);
      const g = c.grammar();
      const schemes = SCHEMES.map((id) => c.scheme(id));
      const want = landsIn(schemes, g, { ui: c.p("ui/src"), stories: c.p("storybook/stories") });
      const gaps = [];
      for (const sc of g.scopes) {
        const got = (sc.lands_in ?? []).join();
        if (got !== (want[sc.id] ?? []).join()) gaps.push(sc.id);
      }
      return gaps.length
        ? bad(`Out of date for ${gaps.join(", ")}. Run: node scripts/lands.mjs`)
        : ok(g.scopes.map((sc) => `${sc.id} ${sc.lands_in.length}`).join(", ") + " components, traced from their code");
    },
  },

  "outputs-follow-answers": {
    requires: ["schemes/grammar.json", ...SCHEMES.map((s) => `schemes/${s}.json`)],
    run: (c) => {
      const g = c.grammar();
      const qids = new Set([...g.reasons, ...g.scopes].flatMap((x) => x.questions.map((q) => q.id)));
      const gaps = [];
      if (!g.reasons.some((r) => r.id === "scenarios")) gaps.push("no use scenario questions");
      let n = 0;
      for (const id of SCHEMES) {
        const s = c.scheme(id);
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
        ["grammar", c.grammar(), "schema/grammar.schema.json"],
        ...SCHEMES.filter((s) => c.has("schemes", `${s}.json`)).map((s) => [s, c.scheme(s), "schema/scheme.schema.json"]),
        ["harness/specs.json", c.json("harness/specs.json"), "harness/harness.schema.json"],
      ];
      const errs = [];
      for (const [name, data, schema] of targets) {
        const validate = a.compile(c.json(schema));
        if (!validate(data)) errs.push(`${name}: ${a.errorsText(validate.errors).slice(0, 200)}`);
        a.removeSchema();
      }
      return errs.length ? bad(errs.join(" | ")) : ok(`${targets.length} files valid`);
    },
  },

  // OD-303: the decision chain. Every semantic token traces from the scheme's answers, through the
  // grammar's rules, to its value, and every part of its name means something. Plain data, no reading.
  "decision-chain-complete": {
    requires: ["cli/src/trace.mjs", "schemes/grammar.json"],
    run: async (c) => {
      const { decisionTree } = await import(pathToFileURL(c.p("cli/src/trace.mjs")).href);
      const { flatTokens } = await import(pathToFileURL(c.p("cli/src/tokens.mjs")).href);
      const g = c.grammar();
      const off = [];
      let n = 0;
      for (const id of SCHEMES) {
        const scheme = c.scheme(id);
        for (const [path, token] of flatTokens(scheme.tokens.semantic)) {
          if (token.$deprecated) continue;
          n++;
          const tree = decisionTree(scheme, g, path);
          const group = tree.some((x) => x.level === "group" && x.says);
          const property = tree.find((x) => x.level === "property");
          const meaning = tree.find((x) => x.level === "token")?.says || (group && property?.name);
          const lacks = [!group && "a group meaning", !property?.decided_by?.length && "an answer that decides it", !meaning && "a meaning"].filter(Boolean);
          if (lacks.length) off.push(`${id} ${path} has no ${lacks.join(", ")}`);
        }
      }
      return off.length
        ? bad(`${off.length} tokens break the decision chain: ${off.slice(0, 5).join("; ")}. Add the group to grammar semantics.groups, or the token to a mapping entry or trace rule.`)
        : ok(`${n} semantic tokens in ${SCHEMES.length} schemes each have a group meaning, a property and the answers that decide it`);
    },
  },
  "citations-follow-engine": {
    requires: ["cli/src/trace.mjs", "schemes/grammar.json"],
    run: async (c) => {
      // A reason cites a question that decides its token, cites nothing the engine does not allow unless its
      // text names it, cites every answer its text names, and holds what the writer would write.
      const { citationGaps, citationsOf, writtenReasons } = await import(pathToFileURL(c.p("cli/src/trace.mjs")).href);
      const g = c.grammar();
      const off = [];
      let n = 0;
      for (const id of SCHEMES) {
        const scheme = c.scheme(id);
        for (const x of citationGaps(scheme, g))
          off.push(`${id} ${x.where} ${x.token}${x.missing ? " cites none of " + x.deciders.join("/") : ""}${x.stray.length ? " cites " + x.stray.join(", ") + " without a rule" : ""}${x.uncited.length ? " names " + x.uncited.join(", ") + " uncited" : ""}`);
        for (const r of writtenReasons(scheme)) {
          if (!r.because.length) continue;
          n++;
          const want = citationsOf(scheme, g, r.token, r.because, r.why);
          if (want.join() !== r.because.join()) off.push(`${id} ${r.where} ${r.token} cites ${r.because.join(", ")}, the writer gives ${want.join(", ")}`);
        }
      }
      return off.length
        ? bad(`${off.length} reasons do not follow the engine: ${off.slice(0, 5).join("; ")}. Run node scripts/theme-reasons.mjs.`)
        : ok(`${n} reasons in ${SCHEMES.length} schemes cite what the engine says decides their token`);
    },
  },
  "token-map-equals-engine": {
    requires: ["cli/src/token-map-view.mjs", "cli/src/trace.mjs"],
    run: async (c) => {
      // The token map card shows the engine's output, never its own: the deciding answers, the name's
      // meanings, and the pick's whole reason (the measure and the because clause too).
      const { tokenMapView } = await import(pathToFileURL(c.p("cli/src/token-map-view.mjs")).href);
      const { decisionTree } = await import(pathToFileURL(c.p("cli/src/trace.mjs")).href);
      const g = c.grammar();
      const off = [];
      let n = 0;
      for (const id of SCHEMES) {
        const scheme = c.scheme(id);
        const view = tokenMapView({ scheme, grammar: g });
        const answered = new Set((scheme.answers ?? []).map((a) => a.question));
        const all = { ...view.shared.decisions, ...view.modes.light.decisions };
        for (const [name, d] of Object.entries(all)) {
          n++;
          const path = scheme.tokens.semantic && name.split(".").reduce((o, k) => o?.[k], scheme.tokens.semantic)?.$value !== undefined ? name : `${name}.@`;
          const tree = decisionTree(scheme, g, path);
          const want = (tree.find((x) => x.level === "property")?.decided_by ?? []).map((a) => a.id).filter((q) => answered.has(q));
          if (want.join() !== (d.answers ?? []).join()) off.push(`${id} ${name} shows ${d.answers?.join(", ")}, the engine gives ${want.join(", ")}`);
          const groups = tree.filter((x) => (x.level === "group" || x.level === "variant") && x.says).map((x) => x.name);
          if (groups.join() !== (d.meaning ?? []).map((m) => m.name).join()) off.push(`${id} ${name} shows meanings ${(d.meaning ?? []).map((m) => m.name)}, the engine gives ${groups}`);
          const pick = tree.find((x) => x.level === "pick")?.says;
          if (pick && d.why && !pick.endsWith(d.why)) off.push(`${id} ${name} cuts its reason: "${d.why}"`);
          // OD-304: a color card shows the engine's role, connections and the reason it writes from the fields.
          const reason = tree.find((x) => x.level === "reason")?.says ?? null;
          if (reason !== (d.graph?.reason ?? null)) off.push(`${id} ${name} shows the reason "${d.graph?.reason}", the engine writes "${reason}"`);
          const links = tree.filter((x) => x.level === "connection").map((x) => x.name);
          if (links.join() !== (d.graph?.connections ?? []).map((x) => x.id).join()) off.push(`${id} ${name} shows connections ${(d.graph?.connections ?? []).map((x) => x.id)}, the engine gives ${links}`);
        }
      }
      return off.length
        ? bad(`${off.length} token map cards differ from the engine: ${off.slice(0, 5).join("; ")}`)
        : ok(`${n} token map cards in ${SCHEMES.length} schemes show the engine's answers, meanings, connections and whole reasons`);
    },
  },

  // OD-304: the decision graph. Every token of a group that plays roles (color, type) has each link of its
  // chain, as plain data: role, job, property, answer, rule (its slot, its entry's rule or a connection)
  // and value, in every brand and mode.
  "color-links-complete": {
    requires: ["cli/src/decision-graph.mjs", "cli/src/trace.mjs", "schemes/grammar.json"],
    run: async (c) => {
      const { graphGroups, indexesOf, missingLinks } = await import(pathToFileURL(c.p("cli/src/decision-graph.mjs")).href);
      const { decisionTree } = await import(pathToFileURL(c.p("cli/src/trace.mjs")).href);
      const { flatTokens } = await import(pathToFileURL(c.p("cli/src/tokens.mjs")).href);
      const g = c.grammar();
      const off = [];
      let n = 0;
      for (const id of SCHEMES) {
        const scheme = c.scheme(id);
        const indexOf = indexesOf(scheme);
        const names = flatTokens(scheme.tokens.semantic)
          .filter(([p, t]) => graphGroups(g).includes(p.split(".")[0]) && !t.$deprecated)
          .map(([p]) => p);
        for (const brand of Object.keys(scheme.tokens.brands))
          for (const mode of ["light", "dark"])
            for (const name of names) {
              n++;
              const lacks = missingLinks(scheme, g, name, decisionTree(scheme, g, name, { brand, mode, index: indexOf(brand, mode) }));
              if (lacks.length) off.push(`${id} ${brand}/${mode} ${name} has no ${lacks.join(", ")}`);
            }
      }
      return off.length
        ? bad(`${off.length} ${graphGroups(g).join(" and ")} tokens miss a link: ${off.slice(0, 5).join("; ")}. Add a role to the token's mapping entry, or a rule or a connection.`)
        : ok(`${n} ${graphGroups(g).join(" and ")} tokens in every brand and mode of ${SCHEMES.length} schemes each have a role, a job, a property, an answer, a rule and a value`);
    },
  },
  "color-connections-hold": {
    requires: ["cli/src/decision-graph.mjs", "schemes/grammar.json", "harness/connections-baseline.json"],
    run: async (c) => {
      // Every connection, color and type, holds in every brand and mode, waits for a recorded fix, or is in the baseline.
      // The count of gaps per connection and scheme may only go down. The gaps are findings for the
      // owner: the check changes no value.
      const { connectionGaps, evaluateConnections } = await import(pathToFileURL(c.p("cli/src/decision-graph.mjs")).href);
      const g = c.grammar();
      const base = c.json("harness", "connections-baseline.json").counts;
      const rose = [];
      const fell = [];
      const known = [];
      let n = 0;
      for (const id of SCHEMES) {
        const checks = evaluateConnections(c.scheme(id), g);
        n += checks.length;
        const gaps = connectionGaps(checks);
        for (const conn of g.semantics.connections.items) {
          const mine = gaps.filter((x) => x.connection === conn.id);
          const was = base[conn.id]?.[id] ?? 0;
          if (mine.length > was) rose.push(`${id} ${conn.id} went from ${was} to ${mine.length}: ${mine.map((x) => x.says).join("; ")}`);
          else if (mine.length < was) fell.push(`${id} ${conn.id} went from ${was} to ${mine.length}`);
          known.push(...mine.map((x) => `${id}: ${x.says}`));
        }
      }
      if (rose.length) return bad(`${rose.length} connections break more than the baseline allows: ${rose.slice(0, 4).join(" | ")}`);
      return ok(
        `${n} connection checks in ${SCHEMES.length} schemes hold, wait for a fix, or are in the baseline (${known.length} known gaps: ${known.slice(0, 4).join("; ")}${known.length > 4 ? "; …" : ""})` +
          (fell.length ? `; fewer gaps now, lower harness/connections-baseline.json: ${fell.join("; ")}` : ""),
      );
    },
  },
  // OD-304: answers create choices. Each shipped role (color, type) is created by an option the scheme chose,
  // or the grammar marks it always-on with a reason and the answers that shape it. Each option of a question
  // a role depends on lists what it creates, and each listed role exists.
  "color-roles-created": {
    requires: ["cli/src/decision-graph.mjs", "schemes/grammar.json"],
    run: async (c) => {
      const { creatorsOf, graphGroups, roleOf } = await import(pathToFileURL(c.p("cli/src/decision-graph.mjs")).href);
      const { questions } = await import(pathToFileURL(c.p("cli/src/schemes.mjs")).href);
      const { flatTokens } = await import(pathToFileURL(c.p("cli/src/tokens.mjs")).href);
      const g = c.grammar();
      const asked = questions(g);
      const roles = (g.mapping ?? []).flatMap((e) => (e.roles ?? []).map((r) => ({ ...r, question: e.question })));
      const ids = new Set(roles.map((r) => r.id));
      const off = [];
      // The questions a role depends on: those of each scope that owns a group playing roles (color, type),
      // each role's deciding question, and each always-on role's shaping ones.
      const depends = new Set([
        ...(g.scopes ?? []).filter((s) => (s.owns ?? []).some((o) => graphGroups(g).includes(o))).flatMap((s) => s.questions.map((q) => q.id)),
        ...roles.map((r) => r.question),
        ...roles.flatMap((r) => r.always_on?.shaped_by ?? []),
      ]);
      for (const id of depends) {
        if (!asked[id]) off.push(`${id} is not a question`);
        for (const o of asked[id]?.options ?? []) {
          if (!Array.isArray(o.creates)) off.push(`${id} option ${o.id} lists nothing it creates`);
          for (const r of o.creates ?? []) if (!ids.has(r)) off.push(`${id} option ${o.id} creates ${r}, which is no role`);
        }
      }
      let n = 0;
      for (const id of SCHEMES) {
        const scheme = c.scheme(id);
        const shipped = new Map();
        for (const [path, t] of flatTokens(scheme.tokens.semantic))
          if (graphGroups(g).includes(path.split(".")[0]) && !t.$deprecated) {
            const r = roleOf(g, path)?.role;
            if (r && !shipped.has(r.id)) shipped.set(r.id, { role: r, token: path });
          }
        for (const { role, token } of shipped.values()) {
          n++;
          if (!role.always_on && !creatorsOf(scheme, g, role.id).length)
            off.push(`${id} ships ${role.id} (${token}), but no option it chose creates it and the role is not always-on`);
        }
      }
      return off.length
        ? bad(`${off.length} roles have no answer that creates them: ${off.slice(0, 5).join("; ")}`)
        : ok(`${n} shipped color and type roles in ${SCHEMES.length} schemes are created by a chosen option or always-on; ${depends.size} questions list what each option creates`);
    },
  },
  "json-sources-one-layout": {
    requires: ["cli/src/schemes.mjs", "schemes/grammar.json", "schema/grammar.schema.json", "schema/scheme.schema.json"],
    run: async (c) => {
      // The grammar and the schemas have one layout (formatGrammar), so an edit changes only its own lines
      // and two branches that touch different parts never conflict on whitespace.
      const { layoutGaps } = await import(pathToFileURL(c.p("cli/src/schemes.mjs")).href);
      const off = layoutGaps();
      return off.length
        ? bad(`not in the one layout: ${off.join(", ")}. Write them with saveGrammar or formatGrammar from cli/src/schemes.mjs.`)
        : ok("the grammar and its 2 schemas are in the one layout");
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
      const g = c.grammar();
      for (const layer of [...g.reasons, ...g.scopes]) {
        if (!layer.description) missing.push(`grammar ${layer.id}`);
        for (const q of layer.questions) if (!q.description) missing.push(`grammar ${q.id}`);
      }
      for (const s of g.situations) if (!s.description) missing.push(`grammar ${s.id}`);
      for (const s of SCHEMES) {
        const sch = c.scheme(s);
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
      // route holds its rule; build.md holds every layout and color rule and write.md every voice
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
      const keys = c.grammar().component_keys.map(
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
        if (/#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(|oklch\(/.test(src)) offenders.push(`${f}: raw color`);
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
      const { docsPages } = await import(pathToFileURL(c.p("cli/src/docs.mjs")).href);
      const { assetRoots, grammar, loadScheme } = await import(pathToFileURL(c.p("cli/src/schemes.mjs")).href);
      const roots = assetRoots();
      const text = Object.values(
        docsPages(loadScheme("dense-data", roots), grammar(roots), roots, { all: true, robots: true, base: "/docs/" }),
      ).join("\n");
      // Robot pictures in the pages' data (OD-284) carry the base URL; a directive names its robot and
      // the docs resolve it with the base URL when the page renders.
      if (/"\/robots\//.test(text) || !text.includes('"/docs/robots/')) gaps.push("robot pictures ignore the base URL");
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
  // The docs' composites (OD-284) use the scheme's ui components through their props only, with
  // scheme tokens for their own layout, so each scheme draws its docs in its own design system.
  "doc-composites-props-only": {
    requires: ["doc-composites/src"],
    run: (c) => {
      const dir = "doc-composites/src";
      const gaps = [];
      const files = readdirSync(c.p(dir)).filter((f) => f.endsWith(".tsx"));
      for (const f of files) {
        const text = c.read(`${dir}/${f}`);
        const ui = [...text.matchAll(/import \{([^}]+)\} from "@open-ds\/ui\/components\/[\w-]+"/g)]
          .flatMap((m) => m[1].split(","))
          .map((n) =>
            n
              .trim()
              .split(/\s+as\s+/)
              .pop(),
          )
          .filter((n) => /^[A-Z]/.test(n));
        for (const n of ui)
          if (new RegExp(`<${n}\\b[^>]*\\bclassName=`).test(text))
            gaps.push(`${f}: <${n}> gets a className; set it through its props`);
        for (const m of text.matchAll(/className="([^"]*)"/g))
          if (/#[0-9a-f]{3,8}\b|\[-?\d+(\.\d+)?(px|rem|em|%)\]/i.test(m[1]))
            gaps.push(`${f}: a raw value in "${m[1]}"; use a scheme token`);
      }
      if (!files.length) return bad(`${dir} has no composites`);
      return gaps.length
        ? bad(gaps.join("; "))
        : ok(`${files.length} composites use the ui components through their props and the scheme's tokens`);
    },
  },
  // The docs rules (OD-284, Orchestra "rules for building the Open DS docs pages"), 3 to 7: a composite
  // styles itself with Tailwind classes scoped to it, reads every value from a CSS variable and never
  // knows which scheme it is in. No page-wide classes, no stylesheet of its own, no fixed values.
  "doc-composites-scoped-styles": {
    requires: ["doc-composites/src", "schemes"],
    run: (c) => {
      const dir = "doc-composites/src";
      const walk = (d) =>
        readdirSync(c.p(d), { withFileTypes: true }).flatMap((e) =>
          e.isDirectory() ? walk(`${d}/${e.name}`) : /\.tsx?$/.test(e.name) ? [`${d}/${e.name}`] : [],
        );
      const schemeIds = readdirSync(c.p("schemes"))
        .filter((f) => f.endsWith(".json") && f !== "grammar.json")
        .map((f) => f.replace(/\.json$/, ""));
      const gaps = [];
      for (const f of walk(dir)) {
        const text = c.read(f);
        const name = f.slice(dir.length + 1);
        if (/import\s+["'][^"']+\.css["']/.test(text)) gaps.push(`${name}: imports a stylesheet; style with scoped Tailwind classes`);
        for (const m of text.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\})/g)) {
          const cls = m[1] ?? m[2];
          if (/(^|\s)(odv|ods)-/.test(cls)) gaps.push(`${name}: page-wide class in "${cls.slice(0, 60)}"`);
          if (/#[0-9a-f]{3,8}\b|\[-?\d+(\.\d+)?(px|rem|em|%)\]/i.test(cls))
            gaps.push(`${name}: a fixed value in "${cls.slice(0, 60)}"; read a CSS variable`);
        }
        // An inline style may draw a value from the data, never a literal color or length.
        for (const m of text.matchAll(/style=\{\{([^}]*)\}\}/g))
          if (/["'`]#[0-9a-f]{3,8}\b|["'`]-?\d+(\.\d+)?(px|rem|em)["'`]/i.test(m[1]))
            gaps.push(`${name}: a fixed value in an inline style; read a CSS variable or the data`);
        for (const id of schemeIds)
          if (new RegExp(`["'\`]${id}["'\`]`).test(text)) gaps.push(`${name}: names the scheme ${id}; a composite never knows its scheme`);
      }
      return gaps.length
        ? bad(`${gaps.length} styling gaps; ${gaps.slice(0, 4).join("; ")}`)
        : ok("every composite styles itself with scoped Tailwind classes and reads every value from a CSS variable");
    },
  },
  // Rules 8 to 10: a few base forms (doc-composites/src/base/), each composite built on one, and props
  // that name real choices. A composite takes its content in one data prop; any other prop is a
  // choice from a fixed list (a union of words) or a yes/no.
  "doc-composites-base-forms": {
    requires: ["doc-composites/src"],
    run: (c) => {
      const dir = "doc-composites/src";
      const base = existsSync(c.p(`${dir}/base`))
        ? readdirSync(c.p(`${dir}/base`)).filter((f) => f.endsWith(".tsx"))
        : [];
      if (!base.length) return bad(`no base forms in ${dir}/base; build the shared forms the composites extend`);
      // A composite is a file whose name starts with a capital letter; lowercase files are helpers.
      const composites = readdirSync(c.p(dir)).filter((f) => /^[A-Z].*\.tsx$/.test(f));
      const gaps = [];
      for (const f of composites) {
        const text = c.read(`${dir}/${f}`);
        if (!/from "\.\/base\//.test(text)) gaps.push(`${f}: builds on no base form`);
        const sig = text.match(/export default function \w+\(\s*\{[^}]*\}\s*:\s*\{([^}]*)\}/);
        if (!sig) continue;
        for (const [, prop, type] of sig[1].matchAll(/(\w+)\??:\s*([^;]+);?/g)) {
          if (["data", "children"].includes(prop)) continue;
          if (!/^\s*("[^"]+"\s*\|\s*)*"[^"]+"\s*$|^\s*boolean\s*$/.test(type))
            gaps.push(`${f}: prop ${prop} is ${type.trim()}; content goes in data, a prop names one choice`);
        }
      }
      return gaps.length
        ? bad(`${gaps.length} gaps; ${gaps.slice(0, 4).join("; ")}`)
        : ok(`${composites.length} composites built on ${base.length} base forms, each prop a named choice`);
    },
  },
  // Rules 11 to 13: a page's JSON holds facts a person can read without the page: names, values,
  // numbers, token paths. No text formatted for display, no class names, no markup.
  "doc-composites-facts": {
    requires: ["docs/docs"],
    run: (c) => {
      const walk = (d) =>
        readdirSync(c.p(d), { withFileTypes: true }).flatMap((e) =>
          e.isDirectory()
            ? walk(`${d}/${e.name}`)
            : e.name.endsWith(".json") && !e.name.startsWith("_")
              ? [`${d}/${e.name}`]
              : [],
        );
      const SIGNS = [
        [/\b\d+(\.\d+)?:1\b/, "a ratio written as text; store the number"],
        [/ · /, "values joined for display; store each one"],
        [/(^|\s)(odv|ods)-[a-z]/, "a class name"],
        [/<\/?[a-z][^>]*>/i, "markup"],
      ];
      const found = {};
      let files = 0;
      const visit = (v, f) => {
        if (typeof v === "string") {
          for (const [re, what] of SIGNS) if (re.test(v)) (found[what] ??= []).push(`${f}: "${v.slice(0, 50)}"`);
        } else if (v && typeof v === "object") for (const x of Object.values(v)) visit(x, f);
      };
      for (const f of walk("docs/docs")) {
        files++;
        visit(c.json(f), f.replace(/^docs\/docs\//, ""));
      }
      const kinds = Object.entries(found);
      return kinds.length
        ? bad(kinds.map(([what, hits]) => `${hits.length}× ${what}, such as ${hits[0]}`).join("; "))
        : ok(`the data in ${files} page files holds facts only`);
    },
  },
  // OD-285: icons follow each scheme. The style answer names its stroke and icon.stroke-width holds it;
  // icons.css gives every Lucide icon that stroke; the large size differs only where the scheme answers
  // two sizes. The docs' own visuals draw icons through Icon, and an icon-only button has a name.
  "icons-follow-scheme": {
    requires: [...SCHEMES.map((s) => `schemes/${s}.json`), "ui/src/icons.css", "doc-composites/src", "storybook/stories"],
    run: (c) => {
      const gaps = [];
      if (!/\.lucide\s*\{[^}]*stroke-width:\s*var\(--icon-stroke-width\)/.test(c.read("ui", "src", "icons.css")))
        gaps.push("ui/src/icons.css does not give .lucide the icon stroke");
      for (const id of SCHEMES) {
        const s = c.scheme(id);
        const ref = String(s.tokens.semantic.icon?.["stroke-width"]?.$value ?? "").match(/^\{(.+)\}$/)?.[1];
        const stroke = ref?.split(".").reduce((n, k) => n?.[k], s.tokens.primitive)?.$value;
        const answer = s.answers.find((a) => a.question === "iconography.definition");
        if (stroke === undefined) gaps.push(`${id}: icon.stroke-width does not resolve to a primitive`);
        else if (!answer?.why?.includes(`${stroke}px`)) gaps.push(`${id}: the style answer does not name its ${stroke}px stroke`);
        const two = s.answers.find((a) => a.question === "iconography.count")?.option === "two";
        const large = s.tokens.component.icon?.["size-large"]?.$value;
        if (two === (large === "{size.icon}"))
          gaps.push(`${id}: the large icon size ${two ? "matches the default though the scheme answers two sizes" : "differs though the scheme answers one size"}`);
      }
      // The docs' own visuals draw a Lucide icon only through Icon.
      const walk = (dir) =>
        readdirSync(c.p(dir), { withFileTypes: true }).flatMap((e) =>
          e.isDirectory() ? walk(`${dir}/${e.name}`) : e.name.endsWith(".tsx") ? [`${dir}/${e.name}`] : [],
        );
      for (const f of walk("doc-composites/src")) {
        const text = c.read(f);
        const names = (text.match(/import \{([^}]*)\} from "lucide-react"/)?.[1] ?? "").split(",").map((x) => x.trim()).filter(Boolean);
        for (const n of names) if (new RegExp(`<${n}[\\s/>]`).test(text)) gaps.push(`${f}: draws ${n} directly; use Icon`);
      }
      // An icon-only button names itself, on the button or the Icon.
      for (const f of [...walk("doc-composites/src"), ...walk("storybook/stories")]) {
        for (const m of c.read(f).matchAll(/<Button\b([^>]*)>\s*<Icon\b([^>]*?)\/>\s*<\/Button>/g))
          if (!/aria-label=/.test(m[1]) && !/\blabel=/.test(m[2])) gaps.push(`${f}: an icon-only button has no name`);
      }
      return gaps.length
        ? bad(gaps.slice(0, 6).join("; "))
        : ok(`${SCHEMES.length} schemes name their icon stroke and every Lucide icon reads it; the docs draw icons through Icon, and every icon-only button has a name`);
    },
  },
  // Rule 15 (OD-284): a color fact names the step it reads. Where the docs show what a color token
  // resolves to, the data carries the neutral step it goes through as via, so the page shows
  // neutral.600, not the gray primitive behind it. Each entry is traced again through the scheme.
  "doc-composites-steps": {
    requires: [...SCHEMES.map((s) => `schemes/${s}.json`), "docs/docs"],
    run: (c) => {
      const gaps = [];
      let facts = 0;
      for (const s of SCHEMES) {
        const tokens = c.scheme(s).tokens;
        const page = `docs/docs/${s}/foundations/color.json`;
        if (!existsSync(c.p(page))) continue;
        const d = c.json(page);
        const trace = (b, mode, token) =>
          follow(tokens, b, mode, token) ?? follow(tokens, b, mode, `${token}.@`);
        const expect = (where, b, mode, token, x) => {
          const f = trace(b, mode, token);
          if (!f) return;
          facts++;
          if ((x.via ?? null) !== (f.via ?? null))
            gaps.push(`${s} ${where} ${token} in ${mode}: via is ${x.via ?? "missing"}, the scheme reads ${f.via ?? "no neutral step"}`);
          if (x.primitive && x.primitive !== f.prim)
            gaps.push(`${s} ${where} ${token} in ${mode}: primitive is ${x.primitive}, the scheme reads ${f.prim}`);
        };
        for (const [b, chart] of Object.entries(d["pairs-chart"] ?? {}))
          for (const m of chart.modes)
            for (const f of Object.values(m.fills).flat()) {
              expect("pairs chart", b, m.mode, f.fill, f);
              for (const p of f.pairs) expect("pairs chart", b, m.mode, p.text, p);
            }
        for (const [b, t] of Object.entries(d["fill-tones"] ?? {}))
          for (const f of t.fills) for (const x of f.tones) expect("fill tones", b, x.mode, f.fill, x);
        const theming = `docs/docs/${s}/foundations/theming.json`;
        if (existsSync(c.p(theming)))
          for (const [b, t] of Object.entries(c.json(theming)["mode-changes"] ?? {}))
            for (const g of t.groups)
              for (const r of g.rows)
                for (const x of r.cells) if (x.primitive) expect("mode changes", b, x.mode, r.token, x);
      }
      return gaps.length
        ? bad(`${gaps.length} color facts name the wrong step; ${gaps.slice(0, 3).join("; ")}`)
        : ok(`${facts} color facts in ${SCHEMES.length} schemes name the step they read`);
    },
  },
  // The committed docs hold no local address (OD-284): pages and their data files link Storybook and
  // the site by path, so what an agent reads in the repo is what the site serves.
  // OD-289: one load and save path. Only cli/src/schemes.mjs reads or writes schemes/*.json; each
  // bundled app (site, Storybook) reads them in one module. The packaging scripts copy the folder.
  "schemes-one-path": {
    requires: ["cli/src/schemes.mjs"],
    run: (c) => {
      const ALLOWED = new Set([
        "cli/src/schemes.mjs",
        "site/src/lib/schemes.ts",
        "storybook/src/schemes.ts",
        "cli/scripts/bundle.mjs",
        "scripts/test-package.mjs",
        // OD-298's independent seeded-defect tests: each edits a temporary copy of schemes/, never the real files.
        "cli/test/verify-a-harness.mjs",
        "cli/test/verify-b-cli.test.mjs",
        "cli/test/verify-b-helpers.mjs",
        "cli/test/verify-c-fixture.mjs",
      ]);
      const DIRS = ["cli/src", "cli/scripts", "cli/test", "docs/scripts", "docs/src", "harness", "scripts", "site/src", "storybook/src", "storybook/stories", "storybook/.storybook", "tokens", "mcp/src", "mcp/test", "doc-composites/src", "ui/scripts", "e2e", "site/scripts"];
      const SKIP = /node_modules|\/dist\/|\/build\/|\.next|\.docusaurus/;
      const walk = (d) =>
        !existsSync(c.p(d)) || SKIP.test(d)
          ? []
          : readdirSync(c.p(d), { withFileTypes: true }).flatMap((e) =>
              e.isDirectory() ? walk(`${d}/${e.name}`) : /\.(mjs|js|cjs|ts|tsx)$/.test(e.name) ? [`${d}/${e.name}`] : [],
            );
      // A file name in a read, a write or an import; a message that names the file is not a read.
      const FILE = /schemes\/(grammar|\$\{[^}]+\}|[a-z][a-z-]*)\.json/;
      const ACCESS = /readFileSync|writeFileSync|\bread\(|\bwrite\(|import\s|from\s+["']|require\(|new URL\(|\.json\(/;
      const hits = [];
      for (const f of [...new Set(DIRS.flatMap(walk))]) {
        if (ALLOWED.has(f)) continue;
        c.read(f).split("\n").forEach((line, i) => {
          if (/^\s*(\/\/|\*)/.test(line)) return;
          // A path string that starts at schemes/ (or ../schemes/), even when the read is on another line.
          // requires: lists only say a file must exist; .includes() tests text, not a path.
          if (/requires:|\.includes\(/.test(line)) return;
          const path = /["'`](\.\.\/|\.\/)*schemes\/([^"'`\s]*\.json)?["'`]/.test(line);
          // A path built in parts: join(root, "schemes", `${id}.json`), join(root, "schemes") for a listing,
          // or a json("schemes", …) helper.
          const joined =
            /\.json\(\s*["'`]schemes["'`]|\bjson\(\s*["'`]schemes["'`]\s*,|join\(\s*roots\.schemes\s*,\s*[`"'][^`"']*\.json/.test(line) ||
            /join\([^)]*["'`]schemes["'`]\s*,\s*[`"'][^`"']*\.json[`"']\s*\)/.test(line) ||
            (/join\([^)]*["'`]schemes["'`]\s*\)/.test(line) && /readdirSync|readFileSync|writeFileSync/.test(line));
          if (path || joined || (FILE.test(line) && ACCESS.test(line)))
            hits.push(`${f}:${i + 1}`);
        });
      }
      return hits.length
        ? bad(`${hits.length} direct reads or writes of schemes/*.json, such as ${hits.slice(0, 4).join(", ")}; use loadScheme, grammar, saveScheme and saveGrammar from cli/src/schemes.mjs`)
        : ok("every read and write of a scheme goes through cli/src/schemes.mjs, or the one schemes module of its app");
    },
  },
  // OD-292: a scheme file stores the key colors and the spacing rhythm, not what they generate. A stored
  // scale or spacing map step equal to the generator's output is a copy that can drift: saveScheme leaves it out.
  "generated-not-stored": {
    requires: ["cli/src/scheme-generated.mjs"],
    run: async (c) => {
      const { withoutGenerated } = await import(pathToFileURL(c.p("cli/src/scheme-generated.mjs")).href);
      const copies = [];
      for (const id of SCHEMES) {
        const stored = c.storedScheme(id);
        const n = (o) => JSON.stringify(o).length;
        if (n(withoutGenerated(stored)) !== n(stored)) copies.push(id);
      }
      return copies.length
        ? bad(`${copies.join(", ")} store color scales or spacing map steps that the generator makes; load and save each with loadScheme and saveScheme`)
        : ok(`${SCHEMES.length} schemes store key colors and spacing rhythms, not the scales and steps they generate`);
    },
  },
  // OD-291: a scheme file stores only the component values it decides. A token equal to the grammar's
  // default (value and description) is a copy that can drift: saveScheme leaves it out.
  "component-defaults-not-stored": {
    requires: ["cli/src/scheme-defaults.mjs"],
    run: async (c) => {
      const { withoutDefaults } = await import(pathToFileURL(c.p("cli/src/scheme-defaults.mjs")).href);
      const g = c.grammar();
      const copies = [];
      for (const id of SCHEMES) {
        const stored = c.storedScheme(id);
        const n = (o) => JSON.stringify(o).length;
        if (n(withoutDefaults(stored, g)) !== n(stored)) copies.push(id);
      }
      return copies.length
        ? bad(`${copies.join(", ")} store component values equal to the grammar's defaults; load and save each with loadScheme and saveScheme`)
        : ok(`${SCHEMES.length} schemes store only the component values they decide`);
    },
  },
  "docs-no-localhost": {
    requires: ["docs/docs"],
    run: (c) => {
      const walk = (dir) =>
        readdirSync(c.p(dir), { withFileTypes: true }).flatMap((e) =>
          e.isDirectory() ? walk(`${dir}/${e.name}`) : /\.(md|json)$/.test(e.name) ? [`${dir}/${e.name}`] : [],
        );
      const hits = walk("docs/docs").filter((f) => /localhost|127\.0\.0\.1/.test(c.read(f)));
      return hits.length
        ? bad(`${hits.length} docs files hold a local address, such as ${hits[0]}; link by site path`)
        : ok("no docs page or data file holds a local address");
    },
  },
  // The docs pages are semantic Markdown (OD-284): visuals are directives, and their data sits in
  // <page>.json beside them. Every HTML tag left in a page counts; the count only goes down, to zero.
  "docs-no-html": {
    requires: ["docs/docs", "harness/docs-html-baseline.json"],
    run: (c) => {
      const walk = (dir) =>
        readdirSync(c.p(dir), { withFileTypes: true }).flatMap((e) =>
          e.isDirectory() ? walk(`${dir}/${e.name}`) : e.name.endsWith(".md") ? [`${dir}/${e.name}`] : [],
        );
      const tags = (text) =>
        text
          .replace(/^---\n[\s\S]*?\n---\n/, "")
          .replace(/```[\s\S]*?```/g, "")
          .replace(/`[^`\n]*`/g, "")
          .match(/<\/?[a-zA-Z][^>]*>|<!--/g)?.length ?? 0;
      const pages = walk("docs/docs").map((f) => [f, tags(c.read(f))]);
      const total = pages.reduce((a, [, n]) => a + n, 0);
      const clean = pages.filter(([, n]) => !n).length;
      const { tags: baseline } = c.json("harness/docs-html-baseline.json");
      if (total > baseline)
        return bad(`${total} HTML tags in the docs pages, up from ${baseline}; write a directive and its data instead`);
      return total
        ? ok(
            `${total} HTML tags left in the docs pages (baseline ${baseline}); ${clean} of ${pages.length} pages have none`,
          )
        : ok(`no HTML in the ${pages.length} docs pages`);
    },
  },
  // Each docs page's data (<page>.json, OD-284) matches the schema of the composite it feeds
  // (doc-composites/schemas/<kind>.schema.json): facts only, every field described for an agent.
  "doc-composites-data": {
    requires: ["docs/docs", "doc-composites/schemas"],
    run: (c) => {
      const a = ajv();
      const schemas = Object.fromEntries(
        readdirSync(c.p("doc-composites/schemas"))
          .filter((f) => f.endsWith(".schema.json"))
          .map((f) => [f.replace(/\.schema\.json$/, ""), a.compile(c.json(`doc-composites/schemas/${f}`))]),
      );
      const walk = (dir) =>
        readdirSync(c.p(dir), { withFileTypes: true }).flatMap((e) =>
          e.isDirectory()
            ? walk(`${dir}/${e.name}`)
            : e.name.endsWith(".json") && !e.name.startsWith("_")
              ? [`${dir}/${e.name}`]
              : [],
        );
      const gaps = [];
      const missing = {};
      let checked = 0;
      // Rule 14: every field of every schema says what it holds.
      const undescribed = [];
      const look = (node, at, file) => {
        if (!node || typeof node !== "object") return;
        for (const [k, v] of Object.entries(node.properties ?? {})) {
          if (!v.description && !v.$ref) undescribed.push(`${file} ${at}${k}`);
          look(v, `${at}${k}.`, file);
        }
        if (node.items) look(node.items, at, file);
        for (const [k, v] of Object.entries(node.$defs ?? {})) look(v, `${k}.`, file);
      };
      for (const f of readdirSync(c.p("doc-composites/schemas")).filter((x) => x.endsWith(".schema.json")))
        look(c.json(`doc-composites/schemas/${f}`), "", f);
      for (const f of walk("docs/docs"))
        for (const [kind, entries] of Object.entries(c.json(f))) {
          const valid = schemas[kind];
          if (!valid) {
            (missing[kind] ??= f);
            continue;
          }
          for (const [id, data] of Object.entries(entries)) {
            checked++;
            if (!valid(data)) gaps.push(`${f} ${kind} ${id}: ${a.errorsText(valid.errors)}`);
          }
        }
      const kinds = Object.keys(missing);
      if (kinds.length)
        gaps.unshift(`${kinds.length} data kinds have no schema (${kinds.join(", ")}); write doc-composites/schemas/<kind>.schema.json`);
      if (undescribed.length)
        gaps.unshift(`${undescribed.length} schema fields have no description, such as ${undescribed[0]}`);
      return gaps.length
        ? bad(`${gaps.length} gaps; ${gaps.slice(0, 3).join("; ")}`)
        : ok(`${checked} composite entries match their ${Object.keys(schemas).length} schemas; every field described`);
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
          // An Anatomy reference (OD-229) is its own kind of page: the parts, the cards, the way in.
          if (m[1].endsWith("-anatomy")) {
            const lacking = [
              "## Design roles",
              "## The parts",
              "## How the decisions reach each part",
              "## For agents",
            ].filter((h) => !text.includes(h));
            if (lacking.length) gaps.push(`${id} ${p}: no ${lacking.join(", ")}`);
            continue;
          }
          const item = g.catalogue.items.find((i) => i.id === m[1]);
          const want = ["## See it live", "## Use it in code"];
          if (item?.apply_when) want.push("## When to use it");
          if (item?.variants) want.push("## Variants", "## Why it works this way");
          const lacking = want.filter((h) => !text.includes(h));
          if (lacking.length) gaps.push(`${id} ${p}: no ${lacking.join(", ")}`);
        }
        // OD-182: the docs lead with visuals. The home shows a product screen and the answers, the
        // color page shows its colors in use, component pages show each variant live.
        const visual = [
          ["index.md", ":::hero{"],
          ["index.md", '::card-grid{id="home/sections"}'],
          ["foundations/color.md", '::color-keys{id="'],
          ["foundations/color.md", "::surface-stack{"],
          ["primitives/color.md", "::color-scale{"],
          ["components/button.md", ":::panel{"],
          ["components/button.md", "::reason-chain{"],
          ["components/button.md", "::token-table{"],
        ];
        for (const [pg, cls] of visual)
          if (pages[pg] && !pages[pg].includes(cls)) gaps.push(`${id} ${pg}: no ${cls.replace(/\{$/, "")} block`);
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
      // OD-207: open each scheme's page in a browser: its colors, the switch, a left-out component.
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
        : ok(`docs build; ${res.pages} pages open in a browser: every scheme in its colors, the switch keeps the page`);
    },
  },
  "docs-schemes": {
    requires: ["docs/scripts/generate.mjs", "docs/schemes.json"],
    run: (c) => {
      // OD-207: the repo docs hold every scheme, and switching never lands on a missing page or
      // another scheme's colors. Every scheme has the same pages; each scheme's tokens apply only on
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
      const g = c.grammar();
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
