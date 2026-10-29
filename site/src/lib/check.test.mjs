import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { checkRecipe, fingerprintRecipe } from "./check.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");

function loadPacks() {
  const packs = {};
  for (const name of readdirSync(join(root, "packs"))) {
    if (!name.endsWith(".json")) continue;
    const pack = JSON.parse(readFileSync(join(root, "packs", name), "utf8"));
    packs[pack.id] = pack;
  }
  return packs;
}

const packs = loadPacks();
const recipe = JSON.parse(readFileSync(join(root, "recipes", "3dyonic.json"), "utf8"));
const manifest = JSON.parse(
  readFileSync(join(root, "boilerplates", "3dyonic", "manifest.json"), "utf8"),
);

function ids(result, severity) {
  return result.findings
    .filter((item) => !severity || item.severity === severity)
    .map((item) => item.id);
}

test("3dyonic fingerprint matches the Python manifest", async () => {
  const result = await checkRecipe(recipe, packs);
  assert.equal(result.ok, true, JSON.stringify(result.findings));
  assert.equal(result.fingerprint, manifest.fingerprint);
  assert.equal(await fingerprintRecipe(recipe), manifest.fingerprint);
});

test("a missing rationale is rejected with no fingerprint", async () => {
  const bad = structuredClone(recipe);
  bad.picks = bad.picks.map((pick) =>
    pick.question === "voice" ? { ...pick, rationale: "   " } : pick,
  );
  const result = await checkRecipe(bad, packs);
  assert.equal(result.ok, false);
  assert.ok(ids(result).includes("missing-rationale"));
  assert.equal(result.fingerprint, undefined);
});

test("an unmet requirement is an error and a missed recommendation is info", async () => {
  const bad = structuredClone(recipe);
  for (const pick of bad.picks) {
    if (pick.question === "brand-variance") {
      pick.option = "multi-brand";
      pick.rationale = "Two brands share this starter.";
    }
    if (pick.question === "structure-theme-separation") {
      pick.option = "combined";
      pick.rationale = "Keep the values in the components.";
    }
    if (pick.question === "line-height") {
      pick.option = "tight";
      pick.rationale = "Try a tighter line height.";
    }
  }
  const result = await checkRecipe(bad, packs);
  assert.equal(result.ok, false);
  assert.ok(ids(result, "error").includes("required-option"));
  assert.equal(result.fingerprint, undefined);
  const required = result.findings.find((item) => item.id === "required-option");
  assert.match(required.reason, /theme values/);
  assert.equal(required.because, "Multi-brand");
});

test("gap questions remain", () => {
  assert.ok(packs.accessibility.questions.some((item) => item.id === "contrast-check"));
  assert.ok(packs["color-primitives"].questions.some((item) => item.id === "on-color-pairing"));
  assert.ok(packs.theming.questions.some((item) => item.id === "theme-shape"));
  assert.ok(packs.delivery.questions.some((item) => item.id === "shareable-item"));
  assert.ok(packs.delivery.questions.some((item) => item.id === "locked-at-init"));
});
