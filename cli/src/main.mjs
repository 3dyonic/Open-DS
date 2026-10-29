import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const FIX_BY_ID = {
  "missing-question": "pick an answer on /build, then run open-ds init <recipe.json>.",
  "uv-missing": "install uv (https://docs.astral.sh/uv/), then rerun open-ds check.",
  "missing-purpose": "run open-ds build and answer a Purpose question.",
  "recipe-schema": "correct the recipe JSON so it matches the recipe schema.",
  "fingerprint-mismatch": "run open-ds init again so open-ds.json matches the recipe.",
  "drift-changed": "restore the changed file so it matches the boilerplate.",
  "drift-missing": "restore the missing file from the boilerplate.",
  "locked-mismatch": "restore the locked fields so they match the manifest.",
  "missing-item": "run open-ds init again so the missing item is installed.",
  "missing-boilerplate": "use a recipe that has an authored boilerplate. Open DS does not generate one.",
  "no-install": "run open-ds init, or pass --dir <folder init created>.",
  "missing-rationale": "write a rationale in your own words.",
  "rationale-length": "keep the rationale between 1 and 280 characters.",
  "unknown-question": "remove the question that is not in the selected packs.",
  "unknown-option": "pick an option that the question cites.",
  "unknown-pack": "use a pack id that exists in packs/.",
  "duplicate-question": "keep one answer for that question.",
  "missing-param": "set the required parameter.",
  "unknown-param": "remove the unknown parameter.",
  "param-type": "use the parameter type the question asks for.",
  "param-pattern": "make the parameter match the expected pattern.",
  "param-range": "keep the parameter inside the allowed range.",
  "missing-dependency": "select the required dependency.",
  "conflict": "change one of the conflicting answers.",
  "required-option": "select the option your purpose needs.",
  recommend: "consider the recommended option.",
  discourage: "reconsider this pick. It is worth a second look.",
  "unknown-feeds-into": "point feeds_into at a question id that exists.",
  "unbacked-feeds-into": "add a requires, discourages, or recommends rule that points at that question.",
  "missing-fragment": "add the fragment file or remove the fragment path.",
  "why-care-length": "keep why_care to 25 words or fewer.",
  "empty-affects": "list what this question affects, or remove the empty list.",
  "floor-contrast": "declare text contrast of at least 4.5:1 and non-text contrast of at least 3:1.",
  "floor-resize": "declare that text can resize to 200% without losing content.",
  "floor-text-spacing":
    "declare line height 1.5, paragraph spacing 2, letter spacing 0.12, and word spacing 0.16.",
  "floor-target-size": "declare a 24px target or sufficient spacing.",
  "floor-confirm-destructive":
    "require a confirmation for destructive, payment, and legal-commitment actions.",
  "coga.critical-not-hidden": "keep a critical component out of hover and accordions.",
  "voice-why": "shorten why to 35 words or fewer.",
  "voice-when": "start when_to_choose with Choose this if or Choose this when, in 25 words or fewer.",
  "voice-cost": "shorten the trade-off to 15 words or fewer.",
  "broken-effect": "point the effect at a question and an option that exist.",
  "pack-schema": "correct the pack JSON so it matches the pack schema.",
};

// Recipe rules, pack fields, and floors live in the Python validator.
// `open-ds check` keeps drift and installed-file checks and asks open-ds-validate for the rest.
function uvMissing() {
  return {
    ok: false,
    findings: [
      {
        id: "uv-missing",
        severity: "error",
        message: "open-ds check needs uv to run recipe rules.",
      },
    ],
  };
}

function checkRecipeWithPython(recipe, root, uvBin = "uv") {
  const dir = mkdtempSync(join(tmpdir(), "open-ds-recipe-"));
  const recipePath = join(dir, "recipe.json");
  try {
    writeFileSync(recipePath, JSON.stringify(recipe));
    const result = spawnSync(uvBin, ["run", "--frozen", "open-ds-validate", "--json", recipePath], {
      cwd: root,
      encoding: "utf8",
    });
    if (result.error && result.error.code === "ENOENT") return uvMissing();
    if (result.error) throw new Error(`Could not run the Python validator: ${result.error.message}`);
    const stdout = (result.stdout || "").trim();
    if (!stdout) throw new Error((result.stderr || "The Python validator produced no output.").trim());
    return JSON.parse(stdout);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

export function formatCheckFailure(item) {
  const severity = item.severity === "error" || !item.severity ? "error" : item.severity;
  if (item.id === "required-option") {
    const label = item.targetLabel || "the required option";
    return [
      `${severity} required-option: ${item.message}`,
      `Fix: Add ${label} to finish your recipe, then run open-ds check again.`,
    ];
  }
  let message = item.message || "";
  if (item.id === "missing-question") {
    message = `${item.question} has no answer yet.`;
  } else {
    const name = item.scheme && item.question ? `${item.scheme}/${item.question}` : item.question || "";
    if (name && !message.includes(name)) message = `${name}: ${message}`;
  }
  const fix = FIX_BY_ID[item.id] || "fix the reported problem and run open-ds check again.";
  return [`${severity} ${item.id}: ${message}`, `Fix: ${fix}`];
}

const here = dirname(fileURLToPath(import.meta.url));

export function repoRoot(start = here) {
  let dir = resolve(start);
  for (let i = 0; i < 8; i += 1) {
    if (existsSync(join(dir, "boilerplates")) && existsSync(join(dir, "packs"))) return dir;
    dir = dirname(dir);
  }
  throw new Error("Run open-ds from a checkout of this repository.");
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function loadPacks(root) {
  const packs = {};
  for (const name of readdirSync(join(root, "packs"))) {
    if (!name.endsWith(".json")) continue;
    const pack = readJson(join(root, "packs", name));
    packs[pack.id] = pack;
  }
  return packs;
}

function findBoilerplate(root, recipe) {
  const base = join(root, "boilerplates");
  for (const name of readdirSync(base)) {
    const manifestPath = join(base, name, "manifest.json");
    if (!existsSync(manifestPath)) continue;
    const manifest = readJson(manifestPath);
    if (manifest.recipeId === recipe.id) return { dir: join(base, name), manifest };
  }
  return null;
}

async function findByFingerprint(root, fingerprint) {
  const base = join(root, "boilerplates");
  for (const name of readdirSync(base)) {
    const manifestPath = join(base, name, "manifest.json");
    if (!existsSync(manifestPath)) continue;
    const manifest = readJson(manifestPath);
    if (manifest.fingerprint !== fingerprint) continue;
    const recipe = readJson(join(root, manifest.recipePath));
    const checked = checkRecipeWithPython(recipe, root);
    if (!checked.ok || checked.fingerprint !== fingerprint) {
      throw new Error("The boilerplate manifest does not match its recipe.");
    }
    return { dir: join(base, name), manifest, recipe, checked };
  }
  return null;
}

export function manifestItemPaths(manifest) {
  const paths = [];
  const seen = new Set();
  for (const item of manifest?.items || []) {
    const listed = Array.isArray(item.files) && item.files.length ? item.files : item.paths || [];
    for (const rel of listed) {
      const normalized = String(rel).split("\\").join("/");
      if (!normalized || seen.has(normalized)) continue;
      seen.add(normalized);
      paths.push(normalized);
    }
  }
  return paths;
}

function hashFile(dir, rel) {
  const full = join(dir, rel);
  if (!existsSync(full) || !statSync(full).isFile()) return null;
  return createHash("sha256").update(readFileSync(full)).digest("hex");
}

export async function init(arg, outDir, root = repoRoot()) {
  let recipe;
  if (arg.endsWith(".json")) {
    recipe = readJson(resolve(arg));
  } else {
    const found = await findByFingerprint(root, arg);
    if (!found) throw new Error("No authored boilerplate matches that fingerprint.");
    recipe = found.recipe;
  }
  const checked = checkRecipeWithPython(recipe, root);
  if (!checked.ok) {
    const lines = checked.findings.filter((item) => item.severity === "error").map((item) => item.id);
    throw new Error(`The recipe was rejected: ${lines.join(", ")}`);
  }
  const kit = findBoilerplate(root, recipe);
  if (!kit || kit.manifest.fingerprint !== checked.fingerprint) {
    throw new Error("No authored boilerplate matches this recipe. Open DS does not generate one.");
  }
  mkdirSync(outDir, { recursive: true });
  cpSync(kit.dir, outDir, { recursive: true });
  const installed = {
    recipe,
    fingerprint: checked.fingerprint,
    locked: kit.manifest.lockedAtInit,
    items: kit.manifest.items.map((item) => item.name),
  };
  writeFileSync(join(outDir, "open-ds.json"), `${JSON.stringify(installed, null, 2)}\n`);
  return installed;
}

export async function check(dir, root = repoRoot(), options = {}) {
  const file = join(dir, "open-ds.json");
  if (!existsSync(file)) {
    return {
      ok: false,
      findings: [
        {
          id: "no-install",
          severity: "error",
          message: `open-ds.json is missing in ${dir}.`,
        },
      ],
    };
  }
  const installed = readJson(file);
  const result = checkRecipeWithPython(installed.recipe, root, options.uvBin);
  if (!result.ok) return result;
  if (result.fingerprint !== installed.fingerprint) {
    return {
      ok: false,
      findings: [{ id: "fingerprint-mismatch", severity: "error", message: "open-ds.json does not match the recipe." }],
    };
  }
  const kit = findBoilerplate(root, installed.recipe);
  if (!kit) {
    return { ok: false, findings: [{ id: "missing-boilerplate", severity: "error", message: "No boilerplate for this recipe." }] };
  }
  const locked = [...installed.locked].sort().join(",");
  const expected = [...kit.manifest.lockedAtInit].sort().join(",");
  if (locked !== expected) {
    return { ok: false, findings: [{ id: "locked-mismatch", severity: "error", message: "Locked fields do not match the manifest." }] };
  }
  const items = new Set(installed.items);
  for (const name of kit.manifest.items.map((item) => item.name)) {
    if (!items.has(name)) {
      return { ok: false, findings: [{ id: "missing-item", severity: "error", message: `Installed items are missing ${name}.` }] };
    }
  }
  const tracked = manifestItemPaths(kit.manifest);
  const drift = [];
  for (const rel of tracked) {
    const expected = hashFile(kit.dir, rel);
    const actual = hashFile(dir, rel);
    if (actual === null) drift.push({ id: "drift-missing", severity: "error", message: `${rel} is missing.` });
    else if (expected !== null && actual !== expected) {
      drift.push({ id: "drift-changed", severity: "error", message: `${rel} differs from the boilerplate.` });
    }
  }
  if (drift.length) return { ok: false, findings: drift };
  return result;
}

export async function run(argv, options = {}) {
  const [cmd, ...rest] = argv;
  if (!cmd || cmd === "--help" || cmd === "-h") {
    console.log("open-ds init <fingerprint|recipe.json> --out <dir>");
    console.log("open-ds check --dir <dir>");
    console.log("open-ds add <item>");
    console.log("open-ds diff");
    return 0;
  }
  try {
    if (cmd === "add") {
      const item = rest[0] || "(none)";
      console.log(`add is not ready in this preview. init installs the full set: tokens, CSS, and components. Nothing was added for ${item}.`);
      return 0;
    }
    if (cmd === "diff") {
      console.log("diff is not ready in this preview. It will compare your locked choices with a newer pack version. Nothing was compared.");
      return 0;
    }
    if (cmd === "init") {
      const target = rest[0];
      const outFlag = rest.indexOf("--out");
      const outDir = outFlag >= 0 ? rest[outFlag + 1] : "open-ds-starter";
      if (!target) throw new Error("init needs a fingerprint or a recipe.json path.");
      const installed = await init(target, resolve(outDir));
      console.log(`Installed ${installed.items.join(", ")} into ${outDir}`);
      console.log(installed.fingerprint);
      return 0;
    }
    if (cmd === "check") {
      const dirFlag = rest.indexOf("--dir");
      const dir = dirFlag >= 0 ? rest[dirFlag + 1] : ".";
      const result = await check(resolve(dir), repoRoot(), options);
      if (!result.ok) {
        for (const item of result.findings) {
          for (const line of formatCheckFailure(item)) console.log(line);
        }
        return 1;
      }
      console.log(result.fingerprint);
      return 0;
    }
    console.log(`Unknown command ${cmd}.`);
    return 1;
  } catch (error) {
    console.log(error.message);
    return 1;
  }
}
