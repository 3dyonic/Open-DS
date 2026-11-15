#!/usr/bin/env node
// Tests what agents and users get from the packed CLI and the MCP host, for every change to the
// schemes' public answers: the icon sizes, the keys an answer creates, component keys that read
// decisions, the focus ring gap colour, the layer order, and the token map against the tools.
//
//   pnpm test:tools                 build the tokens, pack the CLI, run every case
//   pnpm test:tools --skip-build    reuse tokens/dist (faster while you work)
//
// Steps:
//   1. Build the tokens and pack the CLI with npm pack: the exact file npm would publish.
//   2. Unpack it into a folder outside the repository, with the CLI's own dependencies from the
//      workspace install, so the test needs no network.
//   3. Start the MCP host (mcp/server.mjs) on that package and call its tools over HTTP.
//   4. Run the packed CLI for the same answers.
//   5. Print one row per case: pass or fail, the surface, the time and what it found.
// The docs' token map data is built the way docs/scripts/generate.mjs builds it, from the repository.

import { execFileSync, spawn } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const skipBuild = args.includes("--skip-build");
const work = mkdtempSync(join(tmpdir(), "open-ds-tools-"));
const pkg = join(work, "node_modules", "open-ds");

const SCHEMES = [
  "dense-data",
  "content-first",
  "accessible-first",
  "brand-expressive",
  "multi-brand",
];
const TWO_SIZES = "brand-expressive";
const ONE_SIZE = SCHEMES.filter((s) => s !== TWO_SIZES);
const LAYERS = ["sticky", "backdrop", "modal", "dropdown", "toast", "tooltip"];
// The old names of the focus ring gap colour, as key ids and as CSS variables. The bare
// --focus-ring-offset is the gap itself and stays.
const OLD_FOCUS = [
  /[./]focus-ring-offset(?![-\w])/,
  /focus-ring-offset-focus/,
  /focus-ring[./]offset-color/,
  /--[a-z0-9-]+-focus-ring-offset(?![-\w])/,
];

const rows = [];
const seen = []; // every tool answer, for the scans of old names
const ms = (t) => `${Math.round(performance.now() - t)} ms`;

const run = (cmd, argv, cwd = root) =>
  execFileSync(cmd, argv, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 256 * 1024 * 1024,
  });

/** One row: fn returns { pass, note } or throws. */
async function check(id, surface, name, fn) {
  const t = performance.now();
  let pass = false;
  let note = "";
  try {
    ({ pass, note = "" } = await fn());
  } catch (error) {
    note = String(error.message ?? error).split("\n")[0];
  }
  rows.push({ id, surface, name, pass, time: ms(t), note });
}

// --- setup ---------------------------------------------------------------------------------------

const setup = [];
function step(name, fn) {
  const t = performance.now();
  const note = fn();
  setup.push(`${name}: ${note} (${ms(t)})`);
}

step("Build the tokens", () => {
  if (skipBuild) return "skipped, tokens/dist reused";
  run("pnpm", ["--dir", "tokens", "build"]);
  return "tokens/dist";
});
let tgz;
step("Pack the CLI", () => {
  // npm pack runs prepack, which bundles cli/assets.
  const [info] = JSON.parse(
    run("npm", ["pack", "--json", "--pack-destination", work], join(root, "cli")),
  );
  tgz = join(work, info.filename);
  return `${info.filename}, ${info.files.length} files`;
});
step("Unpack it outside the repository", () => {
  mkdirSync(pkg, { recursive: true });
  run("tar", ["-xzf", tgz, "-C", pkg, "--strip-components=1"]);
  // The CLI's dependencies come from the workspace install: no network.
  const deps = Object.keys(
    JSON.parse(readFileSync(join(pkg, "package.json"), "utf8")).dependencies,
  );
  for (const d of deps) {
    const from = realpathSync(join(root, "cli", "node_modules", d));
    mkdirSync(dirname(join(work, "node_modules", d)), { recursive: true });
    symlinkSync(from, join(work, "node_modules", d), "dir");
  }
  cpSync(join(root, "mcp", "server.mjs"), join(work, "server.mjs"));
  writeFileSync(join(work, "package.json"), '{ "type": "module" }\n');
  return work;
});

const port = await new Promise((resolve) => {
  const s = createServer().listen(0, "127.0.0.1", () => {
    const p = s.address().port;
    s.close(() => resolve(p));
  });
});
const host = spawn(process.execPath, [join(work, "server.mjs")], {
  cwd: work,
  env: { ...process.env, PORT: String(port), HOST: "127.0.0.1" },
});
{
  const t = performance.now();
  await new Promise((resolve, reject) => {
    host.stderr.on("data", (d) => String(d).includes("/mcp") && resolve());
    host.on("exit", (code) => reject(new Error(`the MCP host exited ${code}`)));
  });
  setup.push(`Start the MCP host on the packed package: port ${port} (${ms(t)})`);
}

let rpc = 0;
/** A tool call over HTTP: the parsed JSON, the text, or { error }. */
async function mcp(name, argv) {
  const post = () =>
    fetch(`http://127.0.0.1:${port}/mcp`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: ++rpc,
        method: "tools/call",
        params: { name, arguments: argv },
      }),
    });
  // The host closes an idle keep-alive socket after 5 s; a request sent as it closes is sent again once.
  const r = await post().catch((error) => {
    if (host.exitCode !== null) throw new Error(`the MCP host exited ${host.exitCode}`);
    if (error.cause?.code !== "UND_ERR_SOCKET") throw error;
    return post();
  });
  const body = await r.json();
  if (body.error) return { error: body.error.message };
  const text = body.result.content[0].text;
  seen.push({ from: `MCP ${name} ${JSON.stringify(argv).slice(0, 80)}`, text });
  if (body.result.isError) return { error: text };
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

const bin = join(pkg, "bin", "open-ds.js");
/** The packed CLI, run outside the repository: JSON with --json, else the text. */
function cli(...argv) {
  let text;
  try {
    text = run(process.execPath, [bin, ...argv], work);
  } catch (error) {
    text = `${error.stdout ?? ""}${error.stderr ?? ""}`;
    if (!argv.includes("--json") || !text.trim().startsWith("{")) {
      seen.push({ from: `CLI ${argv.join(" ")}`, text });
      return { error: text.trim().split("\n")[0], status: error.status };
    }
  }
  seen.push({ from: `CLI ${argv.join(" ")}`, text });
  return argv.includes("--json") ? JSON.parse(text) : text;
}

// The packed engine's own modules, for the data an agent's tools read.
const packed = (m) => import(pathToFileURL(join(pkg, "src", m)).href);
const P = {
  schemes: await packed("schemes.mjs"),
  defaults: await packed("scheme-defaults.mjs"),
};
const pg = P.schemes.grammar();
const pScheme = Object.fromEntries(SCHEMES.map((id) => [id, P.schemes.loadScheme(id)]));
const css = (id, file = "tokens.css") =>
  readFileSync(join(pkg, "assets", "tokens", id, file), "utf8");

const pxOf = (v) =>
  /rem$/.test(v) ? parseFloat(v) * 16 : /px$/.test(v) ? parseFloat(v) : NaN;
const firstValue = (t) => Object.values(t.values)[0];

// get_component is what an agent reads before it builds: every component in two schemes, and the
// components the cases name in the other three (each call takes about 0.2 s).
const FULL = ["dense-data", TWO_SIZES];
const NAMED = ["icon", "dialog", "button", "sidebar", "data-table"];
const guides = {};
{
  const t = performance.now();
  const every = pg.catalogue.items.map((i) => i.id);
  for (const s of SCHEMES) {
    guides[s] = {};
    const ids = FULL.includes(s) ? every : NAMED;
    for (let i = 0; i < ids.length; i += 8)
      await Promise.all(
        ids.slice(i, i + 8).map(async (c) => {
          guides[s][c] = await mcp("get_component", { scheme_id: s, component: c });
        }),
      );
  }
  setup.push(`Read get_component: ${every.length} components in ${FULL.join(", ")}, ${NAMED.length} in the others (${ms(t)})`);
}
const tokensOf = (s) =>
  Object.values(guides[s]).flatMap((g) => (g.tokens ?? []).map((t) => ({ ...t, in: g.component })));

// --- 1. one icon size, or two ----------------------------------------------------------------------

await check("1a", "pack", "CSS ships --icon-size-large only in Brand expressive, at 28px", () => {
  const ships = SCHEMES.filter((s) => css(s).includes("--icon-size-large:"));
  const large = css(TWO_SIZES).match(/--size-icon-large:\s*([^;]+);/)?.[1];
  return {
    pass: ships.join() === TWO_SIZES && pxOf(large) === 28,
    note: `ships: ${ships.join(", ") || "none"}; --size-icon-large ${large}`,
  };
});

await check("1b", "MCP", "get_component icon: size-large only in Brand expressive, reading size.icon.large", () => {
  const out = SCHEMES.map((s) => {
    const t = guides[s].icon.tokens.find((x) => x.token === "component.icon.size-large");
    const large = guides[s].icon.variants.find((v) => v.axis === "size" && v.id === "large");
    return { s, t, large };
  });
  const be = out.find((o) => o.s === TWO_SIZES);
  const ok =
    be.t?.aliases === "size.icon.large" &&
    pxOf(firstValue(be.t).value) === 28 &&
    !be.large.here.not_used &&
    /28px/.test(be.large.here.use) &&
    out.filter((o) => o.s !== TWO_SIZES).every((o) => !o.t && o.large.here.not_used);
  return {
    pass: ok,
    note: `${TWO_SIZES}: ${be.t?.aliases} ${firstValue(be.t ?? { values: { x: {} } }).value}, large "${be.large.here.use}"; others: large not_used`,
  };
});

await check("1c", "MCP", "get_scheme tokens: size.icon.large with its reason only in Brand expressive", async () => {
  const out = {};
  for (const s of SCHEMES)
    out[s] = (await mcp("get_scheme", { scheme_id: s, part: "tokens" })).tokens?.semantic?.size?.icon?.large;
  const why = out[TWO_SIZES]?.$extensions?.["open-ds"]?.why ?? "";
  return {
    pass: /28px/.test(why) && out[TWO_SIZES].$value === "{size.28}" && ONE_SIZE.every((s) => !out[s]),
    note: `why: "${why.slice(0, 60)}…"`,
  };
});

await check("1d", "CLI", "component <scheme> icon: the same token API", () => {
  const out = SCHEMES.map((s) => [s, cli("component", s, "icon", "--json")]);
  const has = out
    .filter(([, c]) => c.tokens.some((t) => t.token === "component.icon.size-large"))
    .map(([s]) => s);
  const same = out.every(([s, c]) => JSON.stringify(c.tokens) === JSON.stringify(guides[s].icon.tokens));
  return { pass: has.join() === TWO_SIZES && same, note: `size-large in: ${has.join(", ")}; same as MCP: ${same}` };
});

await check("1e", "MCP+CLI", "find_token / token \"large icon size\": icon/size-large only where it exists", async () => {
  const notes = [];
  let ok = true;
  for (const s of SCHEMES) {
    const m = await mcp("find_token", { scheme_id: s, query: "large icon size" });
    const c = cli("token", s, "large", "icon", "size", "--json");
    const pick = (r) => r.results.map((x) => x.token);
    const want = s === TWO_SIZES;
    const got = pick(m).includes("icon/size-large");
    if (got !== want || JSON.stringify(pick(m)) !== JSON.stringify(pick(c))) ok = false;
    if (want) {
      const r = m.results.find((x) => x.token === "icon/size-large");
      if (r?.reads !== "size.icon.large" || m.results[0].token !== "icon/size-large") ok = false;
      notes.push(`${s}: first ${m.results[0].token} reads ${r?.reads}`);
    } else if (got) notes.push(`${s} offers icon/size-large`);
  }
  return { pass: ok, note: notes.join("; ") || "absent in the one-size schemes" };
});

await check("1f", "MCP+CLI", "get_context icon / context: icon/size-large listed only in Brand expressive", async () => {
  const lists = [];
  for (const s of SCHEMES) {
    const md = await mcp("get_context", { scheme_id: s, target: "icon" });
    const js = cli("context", s, "icon", "--json");
    lists.push([s, md.includes("icon/size-large"), js.keys.some((k) => k.key === "icon/size-large")]);
  }
  const ok = lists.every(([s, a, b]) => a === (s === TWO_SIZES) && b === a);
  return { pass: ok, note: lists.map(([s, a]) => `${s} ${a ? "has" : "no"}`).join(", ") };
});

await check("1g", "MCP", "get_key icon/size-large: 28px in Brand expressive, refused elsewhere", async () => {
  const be = await mcp("get_key", { scheme_id: TWO_SIZES, key: "icon/size-large" });
  const others = await Promise.all(
    ONE_SIZE.map((s) => mcp("get_key", { scheme_id: s, key: "icon/size-large" })),
  );
  return {
    pass:
      be.semantic === "size.icon.large" &&
      Object.values(be.values).every((v) => pxOf(v) === 28) &&
      others.every((o) => o.error),
    note: `${TWO_SIZES} ${JSON.stringify(be.values)}; others: "${others[0].error}"`,
  };
});

const ICON_LARGE = `import { Icon } from "@/components/ui/icon";\nexport const Feature = () => <Icon size="large" />;\n`;
await check("1h", "MCP", "check_ui <Icon size=\"large\" />: rejected in four schemes, accepted in Brand expressive", async () => {
  const out = {};
  for (const s of SCHEMES)
    out[s] = await mcp("check_ui", {
      scheme_id: s,
      files: [{ path: "src/app/page.tsx", content: ICON_LARGE }],
    });
  const rejected = ONE_SIZE.every((s) => out[s].findings.some((f) => f.rule === "variant-not-used"));
  return {
    pass: rejected && out[TWO_SIZES].pass,
    note: `${out["dense-data"].findings[0]?.message ?? "no finding"}; ${TWO_SIZES} pass: ${out[TWO_SIZES].pass}`,
  };
});

await check("1i", "CLI", "check --scheme <id> on a folder: the same verdicts", () => {
  const dir = join(work, "app");
  mkdirSync(join(dir, "src", "app"), { recursive: true });
  writeFileSync(join(dir, "src", "app", "page.tsx"), ICON_LARGE);
  const out = Object.fromEntries(SCHEMES.map((s) => [s, cli("check", dir, "--scheme", s, "--json")]));
  const variant = (s) => out[s].findings.some((f) => f.rule === "variant-not-used");
  return {
    pass: ONE_SIZE.every(variant) && !variant(TWO_SIZES),
    note: SCHEMES.map((s) => `${s} ${variant(s) ? "rejects" : "accepts"}`).join(", "),
  };
});

// --- 2. every scheme fills every key its answers create ---------------------------------------------

const RULE = "every scheme fills every key its answers create";
await check("2a", "pack", "packed grammar states the rule, and every packed scheme keeps it", () => {
  const states = pg.description.toLowerCase().includes(RULE);
  const at = (tree, path) => path.reduce((n, k) => n?.[k], tree);
  const problems = [];
  for (const s of SCHEMES) {
    const scheme = pScheme[s];
    for (const k of pg.component_keys) {
      const node = at(scheme.tokens.component, k.id.split("/")) ?? at(scheme.tokens.component, [...k.id.split("/"), "@"]);
      const made = P.defaults.keyCreated(k, scheme);
      if (made && !node) problems.push(`${s} misses ${k.id}`);
      if (!made && node) problems.push(`${s} ships ${k.id}`);
    }
  }
  const created = pg.component_keys.filter((k) => k.created_by).map((k) => k.id);
  return {
    pass: states && !problems.length,
    note: problems.slice(0, 3).join("; ") || `${created.length} key(s) an answer creates: ${created.join(", ")}`,
  };
});

const projects = {};
await check("2b", "CLI", "create: each new project holds every key its answers create, and no other", () => {
  const notes = [];
  let ok = true;
  for (const s of [ONE_SIZE[0], TWO_SIZES]) {
    const dir = join(work, `ds-${s}`);
    const rec = cli("create", `ds-${s}`, "--scheme", s, "--open-ds", `file:${tgz}`, "--json");
    if (rec.error) throw new Error(`create ${s}: ${rec.error}`);
    projects[s] = dir;
    const comp = {};
    for (const f of readdirSync(join(dir, "tokens", "src", "component")).filter((f) => f.endsWith(".json")))
      Object.assign(comp, JSON.parse(readFileSync(join(dir, "tokens", "src", "component", f), "utf8")));
    const at = (path) => path.reduce((n, k) => n?.[k], comp);
    const missing = [];
    const extra = [];
    for (const k of pg.component_keys) {
      const node = at(k.id.split("/")) ?? at([...k.id.split("/"), "@"]);
      const made = P.defaults.keyCreated(k, pScheme[s]);
      if (made && !node) missing.push(k.id);
      if (!made && node) extra.push(k.id);
    }
    const built = readFileSync(join(dir, "build", "scheme.json"), "utf8");
    const builtLarge = built.includes('"size-large"');
    const md = readFileSync(join(dir, "context", "components", "icon.md"), "utf8");
    const want = s === TWO_SIZES;
    if (missing.length || extra.length || builtLarge !== want || md.includes("icon/size-large") !== want) ok = false;
    notes.push(
      `${s}: ${missing.length} missing, ${extra.length} extra${extra.length ? ` (${extra.join(", ")})` : ""}, size-large in build ${builtLarge}, in context ${md.includes("icon/size-large")}`,
    );
  }
  return { pass: ok, note: notes.join("; ") };
});

// --- 3. component keys read decisions -------------------------------------------------------------

const SHAPES = new Set(["radius.round", "radius.pill"]);
await check("3a", "pack", "no packed component key reads a primitive but radius.round / radius.pill", () => {
  const leaves = (t, p = []) =>
    Object.entries(t ?? {}).flatMap(([k, v]) =>
      k.startsWith("$") || !v || typeof v !== "object" ? [] : "$value" in v ? [[[...p, k].join("."), v]] : leaves(v, [...p, k]),
    );
  const has = (t, path) => {
    const n = path.split(".").reduce((n, k) => n?.[k], t);
    return n && typeof n === "object" && "$value" in n;
  };
  const bad = [];
  let n = 0;
  for (const s of SCHEMES)
    for (const [path, tok] of leaves(pScheme[s].tokens.component)) {
      n++;
      const m = String(tok.$value).match(/^\{(.+)\}$/);
      if (m && has(pScheme[s].tokens.primitive, m[1]) && !SHAPES.has(m[1])) bad.push(`${s} ${path} → ${m[1]}`);
    }
  return { pass: !bad.length, note: bad.slice(0, 3).join("; ") || `${n} keys in ${SCHEMES.length} schemes` };
});

await check("3b", "MCP", "get_component: every own key aliases a decision, but the two shapes", () => {
  const bad = [];
  let n = 0;
  for (const s of FULL)
    for (const t of tokensOf(s).filter((t) => t.own)) {
      n++;
      const end = firstValue(t).primitive;
      if (t.aliases === end && !SHAPES.has(end)) bad.push(`${s} ${t.token} → ${end}`);
    }
  return { pass: !bad.length, note: bad.slice(0, 3).join("; ") || `${n} key reads checked` };
});

// --- 4. the focus ring gap colour ------------------------------------------------------------------

await check("4a", "pack", "packed grammar and CSS carry *-focus-ring-offset-color, no old name", () => {
  const ids = pg.component_keys.map((k) => k.id);
  const now = ids.filter((id) => id.endsWith("focus-ring-offset-color"));
  const old = ids.filter((id) => OLD_FOCUS.some((re) => re.test(id)));
  const oldCss = SCHEMES.flatMap((s) =>
    [...css(s).matchAll(/(--[a-z0-9-]+-focus-ring-offset)(?![-\w])/g)].map((m) => `${s} ${m[1]}`),
  );
  return {
    pass: now.length > 0 && !old.length && !oldCss.length,
    note: `${now.length} keys; old ids: ${old.length}; old CSS: ${oldCss.slice(0, 2).join(", ") || 0}`,
  };
});

await check("4b", "MCP+CLI", "find_token / get_component: the new name, with its CSS variable", async () => {
  const f = await mcp("find_token", { scheme_id: "dense-data", query: "button focus ring offset color" });
  const c = cli("token", "dense-data", "button", "focus", "ring", "offset", "color", "--json");
  const t = guides["dense-data"].button.tokens.find((x) => x.token === "component.button.focus-ring-offset-color");
  const hit = (r) => r.results.some((x) => x.token === "button/focus-ring-offset-color");
  return {
    pass: hit(f) && hit(c) && t?.css === "--button-focus-ring-offset-color",
    note: `find_token first ${f.results[0]?.token}; get_component ${t?.css} → ${t?.aliases}`,
  };
});

await check("4c", "CHANGELOG", "the changelog lists the rename and each old name", () => {
  const text = readFileSync(join(root, "CHANGELOG.md"), "utf8");
  const unreleased = text.split(/^## \[/m)[1] ?? "";
  const line = unreleased.split("\n").find((l) => l.includes("focus-ring-offset-color")) ?? "";
  const names = ["*-focus-ring-offset`", "*-focus-ring-offset-focus`", "*/focus-ring/offset-color`"];
  const missing = names.filter((n) => !line.includes(n));
  return { pass: !!line && !missing.length, note: missing.length ? `misses ${missing.join(", ")}` : "Unreleased › Breaking" };
});

// --- 5. the layer order --------------------------------------------------------------------------

await check("5a", "MCP+CLI", "get_context build / context --json: six layers with z-* classes, in order", async () => {
  const notes = [];
  let ok = true;
  for (const s of SCHEMES) {
    const m = await mcp("get_context", { scheme_id: s, target: "build", section: "all" });
    const order = (m.layers ?? []).map((l) => `${l.utility}=${l.value}`);
    const want = LAYERS.map((l) => `z-${l}`);
    if (JSON.stringify((m.layers ?? []).map((l) => l.utility)) !== JSON.stringify(want)) ok = false;
    if (!(m.layers ?? []).every((l, i, a) => !i || l.value > a[i - 1].value)) ok = false;
    if (s === "dense-data") {
      const c = cli("context", s, "build", "--json");
      if (JSON.stringify(c.layers) !== JSON.stringify(m.layers)) ok = false;
      notes.push(order.join(" "));
    }
  }
  return { pass: ok, note: notes.join("") };
});

await check("5b", "MCP+CLI", "find_token: layer.* with its class, and <component>/layer", async () => {
  const sticky = await mcp("find_token", { scheme_id: "dense-data", query: "sticky header layer" });
  const tooltip = await mcp("find_token", { scheme_id: "dense-data", query: "tooltip layer" });
  const c = cli("token", "dense-data", "sticky", "header", "layer", "--json");
  const st = sticky.results.find((r) => r.token === "layer.sticky");
  const key = tooltip.results.find((r) => r.token === "tooltip/layer");
  return {
    pass: st?.utility === "z-sticky" && key?.reads === "layer.tooltip" && c.results.some((r) => r.token === "layer.sticky"),
    note: `layer.sticky ${st?.utility} ${st?.value}; tooltip/layer reads ${key?.reads}`,
  };
});

await check("5c", "MCP+CLI", "get_component dialog: dialog.layer and dialog.backdrop-layer", () => {
  const notes = [];
  let ok = true;
  for (const s of SCHEMES) {
    const t = guides[s].dialog.tokens;
    const layer = t.find((x) => x.token === "component.dialog.layer");
    const back = t.find((x) => x.token === "component.dialog.backdrop-layer");
    if (layer?.aliases !== "layer.modal" || back?.aliases !== "layer.backdrop" || layer.css !== "--dialog-layer") ok = false;
    if (firstValue(layer ?? { values: { x: {} } }).value <= firstValue(back ?? { values: { x: {} } }).value) ok = false;
    if (s === "dense-data") notes.push(`${layer?.css} → ${layer?.aliases} ${firstValue(layer).value}; ${back?.css} → ${back?.aliases} ${firstValue(back).value}`);
  }
  const c = cli("component", "dense-data", "dialog", "--json");
  if (!c.tokens.some((x) => x.token === "component.dialog.layer")) ok = false;
  return { pass: ok, note: notes.join("") };
});

await check("5d", "MCP", "get_context dialog keys, and the sticky readers (sidebar, data table)", async () => {
  const md = await mcp("get_context", { scheme_id: "dense-data", target: "dialog", section: "keys" });
  const sticky = ["sidebar", "data-table"].filter((c) =>
    guides["dense-data"][c].tokens.some((t) => t.aliases === "layer.sticky"),
  );
  return {
    pass:
      md.includes("dialog/layer → layer.modal") &&
      md.includes("dialog/backdrop-layer → layer.backdrop") &&
      sticky.length === 2,
    note: `sticky read by: ${sticky.join(", ")}`,
  };
});

await check("5e", "pack", "packed Tailwind theme makes z-sticky … z-tooltip in every scheme", () => {
  const miss = SCHEMES.flatMap((s) =>
    LAYERS.filter((l) => !css(s, "shadcn.css").includes(`--z-index-${l}: var(--layer-${l})`)).map((l) => `${s} ${l}`),
  );
  return { pass: !miss.length, note: miss.slice(0, 3).join(", ") || `${LAYERS.length} classes × ${SCHEMES.length}` };
});

// --- 6. size.icon and size.icon.large, and the names tools print -----------------------------------

await check("6a", "MCP+CLI", "icon/size reads size.icon in every scheme; size.icon.large only in Brand expressive", async () => {
  const notes = [];
  let ok = true;
  for (const s of SCHEMES) {
    const k = await mcp("get_key", { scheme_id: s, key: "icon/size" });
    const w = cli("why", s, "icon/size", "--json");
    if (k.semantic !== "size.icon" || w.semantic !== "size.icon") ok = false;
    const sem = pScheme[s].tokens.semantic.size.icon;
    const large = "large" in sem;
    if (large !== (s === TWO_SIZES)) ok = false;
    notes.push(`${s} ${Object.values(k.values)[0]}${large ? " + large" : ""}`);
  }
  return { pass: ok, note: notes.join(", ") };
});

// What each tool prints for the icon size's name. The token map shows size.icon, never size.icon.@.
const ICON_CALLS = [
  ["get_component", (s) => mcp("get_component", { scheme_id: s, component: "icon" })],
  ["get_context icon", (s) => mcp("get_context", { scheme_id: s, target: "icon", section: "all" })],
  ["get_context icon keys", (s) => mcp("get_context", { scheme_id: s, target: "icon", section: "keys" })],
  ["get_context icon/size", (s) => mcp("get_context", { scheme_id: s, target: "icon/size" })],
  ["get_key", (s) => mcp("get_key", { scheme_id: s, key: "icon/size" })],
  ["why", (s) => mcp("why", { scheme_id: s, target: "icon/size" })],
  ["find_token", (s) => mcp("find_token", { scheme_id: s, query: "icon size" })],
  ["get_anatomy", (s) => mcp("get_anatomy", { scheme_id: s, component: "icon" })],
  ["get_context build", (s) => mcp("get_context", { scheme_id: s, target: "build", section: "all" })],
  ["CLI component", (s) => cli("component", s, "icon")],
  ["CLI context", (s) => cli("context", s, "icon", "--section", "keys")],
  ["CLI why", (s) => cli("why", s, "icon/size")],
  ["CLI token", (s) => cli("token", s, "icon", "size")],
];
const atNames = (x) => [...new Set((typeof x === "string" ? x : JSON.stringify(x)).match(/[a-z][a-z0-9-]*(?:\.[a-z0-9-]+)+\.@(?![\w])/g) ?? [])];
const printed = {};
await check("6b", "MCP+CLI", "no tool prints size.icon.@ for the icon size", async () => {
  const bad = [];
  for (const [name, call] of ICON_CALLS) {
    const names = new Set();
    for (const s of [ONE_SIZE[0], TWO_SIZES]) for (const n of atNames(await call(s))) names.add(n);
    printed[name] = [...names];
    if (names.has("size.icon.@")) bad.push(name);
  }
  return { pass: !bad.length, note: bad.length ? `prints size.icon.@: ${bad.join(", ")}` : `${ICON_CALLS.length} tools` };
});

// --- 7. the token map and the tools agree ----------------------------------------------------------

const PICKS = {
  Color: ["color.text.primary", "color.status.danger"],
  Spacing: ["space.gap.tight", "space.inset.container"],
  Size: ["size.icon", "size.control.default"],
  Type: ["type.body.font-size", "type.label.font-size"],
  Shape: ["radius.control", "border-width.default"],
  Elevation: ["elevation.overlay", "elevation.card"],
  Layer: ["layer.modal", "layer.tooltip"],
  Motion: ["motion.duration.panels", "motion.easing.standard"],
};
const repo = {
  view: await import(pathToFileURL(join(root, "cli", "src", "token-map-view.mjs")).href),
  schemes: await import(pathToFileURL(join(root, "cli", "src", "schemes.mjs")).href),
};
// The component source and waits, as docs/scripts/generate.mjs reads them.
const componentDir = join(root, "ui", "src", "components");
const componentSource = readdirSync(componentDir)
  .filter((f) => f.endsWith(".tsx"))
  .sort()
  .map((f) => readFileSync(join(componentDir, f), "utf8"))
  .join("\n");
const waiting = JSON.parse(readFileSync(join(root, "harness", "connections-baseline.json"), "utf8")).failures;
const tokenName = (id) => id.replace(/\.@$/, "");
const same = (a, b) => (typeof a === "object" ? JSON.stringify(a) : String(a)) === String(b);
const shadowIn = (text, v) => [v.offsetX, v.offsetY, v.blur, v.color].every((x) => String(text).includes(x));

for (const s of FULL) {
  const t = performance.now();
  const scheme = repo.schemes.loadScheme(s);
  const map = repo.view.tokenMapView({ scheme, grammar: repo.schemes.grammar(), componentSource, waiting });
  setup.push(`Build the token map data for ${s}, as the docs do (${ms(t)})`);
  const light = map.modes.light.decisions;
  const build = await mcp("get_context", { scheme_id: s, target: "build", section: "all" });
  const spacing = await mcp("get_component_spacing_map", { scheme_id: s });
  const all = tokensOf(s);
  const picks = s === TWO_SIZES ? { ...PICKS, Size: [...PICKS.Size, "size.icon.large"] } : PICKS;
  for (const [area, ids] of Object.entries(picks)) {
    await check(`7 ${area}`, "map↔MCP", `${s}: ${ids.join(", ")}`, async () => {
      const notes = [];
      let ok = true;
      for (const id of ids) {
        const d = map.shared.decisions[id] ?? light[id];
        if (!d) throw new Error(`${id} is not on the token map`);
        const reads = all.filter((t) => t.aliases === id);
        // Used by: the components whose keys read it, the map's count. get_component names the
        // components whose code reads those keys, so the owner is the key's own component.
        const owners = new Set(reads.filter((t) => t.own).map((t) => t.token.split(".")[1]));
        const usedOk = owners.size === d.components.length;
        const code = new Set(reads.map((t) => t.in)).size;
        const v = reads[0] && firstValue(reads[0]).value;
        let measure;
        if (area === "Color") {
          // Contrast and pairs: plan_change measures every pair a primitive reaches, before a change.
          const [hue, step] = d.resolves.name.split(" ");
          const prim = `color.${hue}.light.${step}`;
          const plan = await mcp("plan_change", { scheme_id: s, token: prim, value: d.resolves.value });
          const theme = scheme.themes[0].id;
          const pairs = plan.pairs.filter((p) => p.theme === theme && tokenName(p.token) === id);
          const low = pairs.reduce((a, b) => (b.before / b.needs < a.before / a.needs ? b : a), pairs[0] ?? {});
          const mapPairs = d.graph.connections.filter((c) => /pairs/.test(c.id)).flatMap((c) => c.pairs)
            .map((x) => x.match(/^(\S+) on (\S+) is/)).filter((m) => m && m[1] === id).map((m) => m[2]);
          const toolPairs = pairs.map((p) => tokenName(p.on));
          const extra = mapPairs.filter((x) => !toolPairs.includes(x));
          const ctx = await mcp("get_context", { scheme_id: s, target: id, section: "all" });
          const contrastOk = Math.abs(low.before - d.contrast.ratio) <= 0.02 && tokenName(low.on) === d.contrast.on && low.needs === d.contrast.floor && ctx.guidance.contrast === d.contrast.floor;
          const pairsOk = !extra.length && toolPairs.every((x) => mapPairs.includes(x));
          ok &&= contrastOk && pairsOk && usedOk && v === d.resolves.value;
          measure = `contrast map ${d.contrast.ratio} on ${d.contrast.on} / tools ${low.before} on ${tokenName(low.on ?? "")}; pairs map ${mapPairs.length} / tools ${toolPairs.length}${extra.length ? ` (tools miss ${extra.join(", ")})` : ""}`;
        } else if (area === "Elevation") {
          ok &&= usedOk && shadowIn(d.resolves.value, v);
          measure = `value ${d.resolves.value}`;
        } else if (area === "Layer") {
          const l = build.layers.find((x) => x.token === id);
          const card = d.cards?.light;
          ok &&= usedOk && same(v, d.resolves.value) && same(l?.value, d.resolves.value) && l?.utility === card?.code;
          measure = `value ${d.resolves.value}, class map ${card?.code} / get_context ${l?.utility}`;
        } else if (area === "Spacing") {
          const role = spacing.roles.find((r) => r.token === id);
          ok &&= usedOk && same(v, d.resolves.value) && role?.px === pxOf(d.resolves.value);
          measure = `value ${d.resolves.value}, spacing map ${role?.px}px ${role?.utility}`;
        } else {
          ok &&= usedOk && same(v, d.resolves.value);
          measure = `value map ${d.resolves.value} / tools ${typeof v === "object" ? JSON.stringify(v) : v}`;
        }
        notes.push(`${id}: ${measure}; used by map ${d.components.length} / keys ${owners.size} (code ${code})`);
      }
      return { pass: ok, note: notes.join(" | ") };
    });
  }
}

// --- the old focus ring names, in every answer above -------------------------------------------------

await check("4d", "MCP+CLI", `no answer prints an old focus ring gap name`, () => {
  const hits = [];
  for (const x of seen)
    for (const re of OLD_FOCUS) {
      const m = x.text.match(re);
      if (m) hits.push(`${x.from}: ${m[0]}`);
    }
  return { pass: !hits.length, note: hits.slice(0, 3).join("; ") || `${seen.length} answers scanned` };
});

// --- 8. the version the surface needs --------------------------------------------------------------

await check("8", "release", "release check names the bump", () => {
  const t = run(process.execPath, [join(root, "scripts", "release.mjs"), "check"]).trim();
  const status = run(process.execPath, [join(root, "scripts", "release.mjs"), "status"]);
  const kinds = [...status.matchAll(/^\s+(removed|added) ([a-z_]+): (.*)$/gm)].map(
    (m) => `${m[1]} ${m[3].split(", ").length} ${m[2]}`,
  );
  return {
    pass: /needs at least a (minor|major) bump|matches the last release/.test(t),
    note: `${t} ${kinds.join(", ")}`,
  };
});

host.kill();
rmSync(work, { recursive: true, force: true });

// --- report ---------------------------------------------------------------------------------------

console.log(setup.map((l) => `· ${l}`).join("\n"));
console.log("");
const w = (k) => Math.max(...rows.map((r) => String(r[k]).length), k.length);
const line = (r) =>
  `${(r.pass ? "pass" : "FAIL").padEnd(4)}  ${r.id.padEnd(w("id"))}  ${r.surface.padEnd(w("surface"))}  ${r.time.padStart(8)}  ${r.name}\n${" ".repeat(6)}${r.note}`;
console.log(rows.map(line).join("\n"));
console.log("\nWhat each tool prints with a raw @ (icon, in", ONE_SIZE[0], "and", TWO_SIZES + "):");
for (const [name, names] of Object.entries(printed)) console.log(`  ${name.padEnd(22)} ${names.join(", ") || "none"}`);
const failed = rows.filter((r) => !r.pass);
console.log(failed.length ? `\n${failed.length} of ${rows.length} cases fail.` : `\nAll ${rows.length} cases pass.`);
process.exitCode = failed.length ? 1 : 0;
