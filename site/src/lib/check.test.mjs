import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { checkRecipe, fingerprintRecipe, missingQuestionReport } from "./check.mjs";

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

test("multi-brand recommends separation and a missed recommendation stays silent", async () => {
  const brand = packs.purpose.questions.find((item) => item.id === "brand-variance");
  const multi = brand.options.find((item) => item.id === "multi-brand");
  assert.equal(multi.requires, undefined);
  assert.match(multi.recommends[0].reason, /theme values/);
  const draft = structuredClone(recipe);
  for (const pick of draft.picks) {
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
  const result = await checkRecipe(draft, packs);
  assert.equal(result.ok, true, JSON.stringify(result.findings));
  assert.equal(ids(result).includes("required-option"), false);
  assert.equal(ids(result).includes("recommend"), false);
  assert.equal(typeof result.fingerprint, "string");
});

test("required-option names the missing option and the pack reason", async () => {
  const fixture = JSON.parse(
    readFileSync(join(root, "fixtures", "recipes", "required-option.json"), "utf8"),
  );
  const result = await checkRecipe(fixture.recipe, fixture.packs);
  const required = result.findings.find((item) => item.id === "required-option");
  assert.equal(required.because, "Ship");
  assert.equal(required.targetLabel, "Calm");
  assert.equal(required.targetOption, "calm");
  assert.equal(required.targetQuestion, "tone");
  assert.equal(required.reason, "This fixture requires a calm tone.");
  assert.equal(required.message, "Ship needs Calm (tone). This fixture requires a calm tone.");
});

test("missing questions are named and summarized", async () => {
  const bad = structuredClone(recipe);
  bad.picks = bad.picks.filter((pick) => pick.question !== "voice" && pick.question !== "density");
  const result = await checkRecipe(bad, packs);
  const voice = result.findings.find(
    (item) => item.id === "missing-question" && item.question === "voice",
  );
  assert.equal(voice.scheme, "purpose");
  assert.equal(voice.question, "voice");
  const report = missingQuestionReport(result.findings);
  assert.equal(report.summary, "2 questions still need an answer.");
  assert.equal(report.fix, "Fix: pick an answer on /build, then run open-ds init <recipe.json>.");
  assert.deepEqual(report.lines, [
    "density has no answer yet. Pick one to finish your recipe.",
    "voice has no answer yet. Pick one to finish your recipe.",
  ]);
  assert.equal(
    report.lines.filter((line) => line === "This required question has no answer.").length,
    0,
  );
});

test("gap questions remain", () => {
  assert.ok(packs.accessibility.questions.some((item) => item.id === "contrast-check"));
  assert.ok(packs["color-primitives"].questions.some((item) => item.id === "on-color-pairing"));
  assert.ok(packs.theming.questions.some((item) => item.id === "theme-shape"));
  assert.ok(packs.delivery.questions.some((item) => item.id === "shareable-item"));
  assert.ok(packs.delivery.questions.some((item) => item.id === "locked-at-init"));
});
