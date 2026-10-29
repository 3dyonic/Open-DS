import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { check, formatCheckFailure, init, repoRoot, run } from "../src/main.mjs";

const root = repoRoot();
const recipePath = join(root, "recipes", "3dyonic.json");
const manifest = JSON.parse(readFileSync(join(root, "boilerplates", "3dyonic", "manifest.json"), "utf8"));

test("package is private", () => {
  const pkg = JSON.parse(readFileSync(join(root, "cli", "package.json"), "utf8"));
  assert.equal(pkg.private, true);
  assert.equal(pkg.name, "open-ds");
});

test("init and check work against the authored boilerplate", async () => {
  const dir = mkdtempSync(join(tmpdir(), "open-ds-"));
  try {
    const installed = await init(recipePath, dir, root);
    assert.equal(installed.fingerprint, manifest.fingerprint);
    assert.ok(installed.items.includes("tokens"));
    assert.ok(installed.items.includes("css"));
    assert.ok(installed.items.includes("components"));
    const file = JSON.parse(readFileSync(join(dir, "open-ds.json"), "utf8"));
    assert.deepEqual(file.locked, manifest.lockedAtInit);
    const result = await check(dir, root);
    assert.equal(result.ok, true);
    assert.equal(result.fingerprint, manifest.fingerprint);
    const byFingerprint = await init(manifest.fingerprint, join(dir, "again"), root);
    assert.equal(byFingerprint.fingerprint, manifest.fingerprint);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("check rejects a recipe with no rationale and prints no fingerprint", async () => {
  const dir = mkdtempSync(join(tmpdir(), "open-ds-"));
  try {
    await init(recipePath, dir, root);
    const installed = JSON.parse(readFileSync(join(dir, "open-ds.json"), "utf8"));
    installed.recipe.picks[0].rationale = "";
    const { writeFileSync } = await import("node:fs");
    writeFileSync(join(dir, "open-ds.json"), JSON.stringify(installed));
    const result = await check(dir, root);
    assert.equal(result.ok, false);
    assert.equal(result.fingerprint, undefined);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("add and diff are stubs", async () => {
  const logs = [];
  const original = console.log;
  console.log = (line) => logs.push(String(line));
  try {
    assert.equal(await run(["add", "button"]), 0);
    assert.match(logs.join("\n"), /add is not ready/);
    logs.length = 0;
    assert.equal(await run(["diff"]), 0);
    assert.match(logs.join("\n"), /diff is not ready/);
  } finally {
    console.log = original;
  }
});

async function installed() {
  const dir = mkdtempSync(join(tmpdir(), "open-ds-"));
  await init(recipePath, dir, root);
  return dir;
}

test("check fails when an installed file is changed", async () => {
  const { appendFileSync, readdirSync } = await import("node:fs");
  const dir = await installed();
  try {
    assert.equal((await check(dir, root)).ok, true);
    appendFileSync(join(dir, "theme", "tokens.css"), "/* drift */\n");
    const result = await check(dir, root);
    assert.equal(result.ok, false);
    assert.equal(result.fingerprint, undefined);
    assert.ok(result.findings.some((f) => f.id === "drift-changed" && f.message.includes("theme/tokens.css")));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("check fails when an installed file is deleted", async () => {
  const dir = await installed();
  try {
    rmSync(join(dir, "theme", "tokens.css"));
    const result = await check(dir, root);
    assert.equal(result.ok, false);
    assert.ok(result.findings.some((f) => f.id === "drift-missing"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

async function capture(argv) {
  const logs = [];
  const original = console.log;
  console.log = (line) => logs.push(String(line));
  try {
    const code = await run(argv);
    return { code, text: logs.join("\n") };
  } finally {
    console.log = original;
  }
}

test("check --dir names a missing install and how to fix it", async () => {
  const dir = mkdtempSync(join(tmpdir(), "open-ds-empty-"));
  try {
    const { code, text } = await capture(["check", "--dir", dir]);
    assert.equal(code, 1);
    assert.ok(text.includes(`error no-install: open-ds.json is missing in ${dir}.`));
    assert.ok(text.includes("Fix: run open-ds init, or pass --dir <folder init created>."));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("check prints each failure with the question and a fix", async () => {
  const { writeFileSync } = await import("node:fs");
  const dir = await installed();
  try {
    const installedFile = JSON.parse(readFileSync(join(dir, "open-ds.json"), "utf8"));
    installedFile.recipe.picks = installedFile.recipe.picks.filter((pick) => pick.question !== "voice");
    installedFile.recipe.picks = installedFile.recipe.picks.map((pick) =>
      pick.question === "density" ? { ...pick, rationale: "   " } : pick,
    );
    writeFileSync(join(dir, "open-ds.json"), JSON.stringify(installedFile));
    const result = await check(dir, root);
    const missing = result.findings.find((item) => item.id === "missing-question");
    assert.equal(missing.question, "voice");
    assert.equal(missing.scheme, "purpose");
    const rationale = result.findings.find((item) => item.id === "missing-rationale");
    assert.equal(rationale.question, "density");
    assert.equal(rationale.scheme, "purpose");
    const { code, text } = await capture(["check", "--dir", dir]);
    assert.equal(code, 1);
    assert.match(text, /error missing-question: purpose\/voice has no answer yet\./);
    assert.match(text, /Fix: pick an answer on \/build, then run open-ds init <recipe\.json>\./);
    assert.match(text, /error missing-rationale: purpose\/density: Write a rationale in your own words\./);
    assert.match(text, /Fix: write a rationale in your own words\./);
    const lines = text.split("\n").filter(Boolean);
    for (let i = 0; i < lines.length; i += 2) {
      assert.match(lines[i], /^(error|warning|info) \S+: /);
      assert.match(lines[i + 1], /^Fix: /);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("listed failures print a reason and a fix", () => {
  const cases = [
    [
      "missing-purpose",
      "A recipe with no Purpose picks is not accepted.",
      "Fix: run open-ds build and answer a Purpose question.",
    ],
    [
      "recipe-schema",
      "The recipe is missing packs or picks.",
      "Fix: correct the recipe JSON so it matches the recipe schema.",
    ],
    [
      "fingerprint-mismatch",
      "open-ds.json does not match the recipe.",
      "Fix: run open-ds init again so open-ds.json matches the recipe.",
    ],
    [
      "locked-mismatch",
      "Locked fields do not match the manifest.",
      "Fix: restore the locked fields so they match the manifest.",
    ],
    [
      "missing-item",
      "Installed items are missing tokens.",
      "Fix: run open-ds init again so the missing item is installed.",
    ],
    [
      "missing-boilerplate",
      "No boilerplate for this recipe.",
      "Fix: use a recipe that has an authored boilerplate. Open DS does not generate one.",
    ],
  ];
  for (const [id, message, fix] of cases) {
    const [line, fixLine] = formatCheckFailure({ id, severity: "error", message });
    assert.equal(line, `error ${id}: ${message}`);
    assert.equal(fixLine, fix);
  }
});

test("check ignores edits to user-owned files outside manifest items", async () => {
  const { appendFileSync } = await import("node:fs");
  const dir = await installed();
  try {
    appendFileSync(join(dir, "README.md"), "\nNotes the team added.\n");
    appendFileSync(join(dir, "AGENTS.md"), "\nLocal agent notes.\n");
    appendFileSync(join(dir, "CHANGELOG.md"), "\nLocal changelog.\n");
    const result = await check(dir, root);
    assert.equal(result.ok, true);
    assert.equal(result.fingerprint, manifest.fingerprint);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("required-option names the missing option and the pack reason", async () => {
  const { writeFileSync } = await import("node:fs");
  const dir = await installed();
  try {
    const installedFile = JSON.parse(readFileSync(join(dir, "open-ds.json"), "utf8"));
    for (const pick of installedFile.recipe.picks) {
      if (pick.question === "brand-variance") {
        pick.option = "multi-brand";
        pick.rationale = "Two brands share this starter.";
      }
      if (pick.question === "structure-theme-separation") {
        pick.option = "combined";
        pick.rationale = "Keep the values in the components.";
      }
    }
    writeFileSync(join(dir, "open-ds.json"), JSON.stringify(installedFile));
    const { code, text } = await capture(["check", "--dir", dir]);
    assert.equal(code, 1);
    assert.match(
      text,
      /error required-option: Multi-brand needs Separate \(structure-theme-separation\)\. Two brands can share components only when theme values stay outside them\./,
    );
    assert.match(text, /Fix: Add Separate to finish your recipe, then run open-ds check again\./);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("check prints a fix for a changed boilerplate file", async () => {
  const { appendFileSync } = await import("node:fs");
  const dir = await installed();
  try {
    appendFileSync(join(dir, "theme", "tokens.css"), "/* drift */\n");
    const { code, text } = await capture(["check", "--dir", dir]);
    assert.equal(code, 1);
    assert.match(text, /error drift-changed: theme\/tokens\.css differs from the boilerplate\./);
    assert.match(text, /Fix: restore the changed file so it matches the boilerplate\./);
    const printed = formatCheckFailure({
      id: "drift-missing",
      severity: "error",
      message: "theme/tokens.css is missing.",
    });
    assert.deepEqual(printed, [
      "error drift-missing: theme/tokens.css is missing.",
      "Fix: restore the missing file from the boilerplate.",
    ]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
