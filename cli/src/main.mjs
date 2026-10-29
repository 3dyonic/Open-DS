import { cpSync, mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { checkRecipe } from "../../site/src/lib/check.mjs";

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

async function findByFingerprint(root, fingerprint, packs) {
  const base = join(root, "boilerplates");
  for (const name of readdirSync(base)) {
    const manifestPath = join(base, name, "manifest.json");
    if (!existsSync(manifestPath)) continue;
    const manifest = readJson(manifestPath);
    if (manifest.fingerprint !== fingerprint) continue;
    const recipe = readJson(join(root, manifest.recipePath));
    const checked = await checkRecipe(recipe, packs);
    if (!checked.ok || checked.fingerprint !== fingerprint) {
      throw new Error("The boilerplate manifest does not match its recipe.");
    }
    return { dir: join(base, name), manifest, recipe, checked };
  }
  return null;
}

export async function init(arg, outDir, root = repoRoot()) {
  const packs = loadPacks(root);
  let recipe;
  if (arg.endsWith(".json")) {
    recipe = readJson(resolve(arg));
  } else {
    const found = await findByFingerprint(root, arg, packs);
    if (!found) throw new Error("No authored boilerplate matches that fingerprint.");
    recipe = found.recipe;
  }
  const checked = await checkRecipe(recipe, packs);
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

export async function check(dir, root = repoRoot()) {
  const file = join(dir, "open-ds.json");
  if (!existsSync(file)) throw new Error("open-ds.json is missing. Run init first.");
  const installed = readJson(file);
  const packs = loadPacks(root);
  const result = await checkRecipe(installed.recipe, packs);
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
  return result;
}

export async function run(argv) {
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
      const result = await check(resolve(dir));
      if (!result.ok) {
        for (const item of result.findings) console.log(`${item.severity} ${item.id}`);
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
