import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { addComponent, deploy } from "../src/cli.mjs";
import { grammar, keyInfo, loadScheme, schemeIds, when, why } from "../src/schemes.mjs";

const bin = join(import.meta.dirname, "..", "bin", "open-ds.js");
const cli = (...args) => execFileSync("node", [bin, ...args], { encoding: "utf8" });
const temp = () => mkdtempSync(join(tmpdir(), "open-ds-scheme-"));

test("list shows the five schemes", () => {
  assert.deepEqual(schemeIds(), ["accessible-first", "brand-expressive", "content-first", "dense-data", "multi-brand"]);
  const out = JSON.parse(cli("list", "--json"));
  assert.equal(out.length, 5);
  assert.deepEqual(out.find((s) => s.id === "multi-brand").brands, ["aster", "birch", "coral"]);
});

test("help names every scheme command", () => {
  const out = cli("--help");
  for (const c of ["list", "show", "why", "when", "init", "add"]) assert.match(out, new RegExp(`open-ds ${c}`));
});

test("why follows the because chain back to the reasons", () => {
  const w = why(loadScheme("dense-data"), "typography.q3");
  assert.equal(w.answer, "On the grid, with the user's text size");
  assert.ok(w.because.length > 0);
  assert.ok(w.because.some((b) => b.question.startsWith("tasks.") || b.question.startsWith("people.")));
});

test("why explains a component key in every theme", () => {
  const k = keyInfo("multi-brand", "button/radius");
  assert.equal(k.semantic, "radius.control");
  assert.notEqual(k.values["aster-light"], k.values["coral-light"]);
});

test("when finds a rule by id and by plain words", () => {
  const s = loadScheme("dense-data");
  assert.equal(when(s, "number-in-table").use, "type.data");
  assert.equal(when(s, "a number in a table").situation, "number-in-table");
  assert.equal(when(s, "zzzz"), null);
  assert.equal(when(s, "a xyzzy"), null);
});

test("init deploys tokens, components, AGENTS.md and the skill", () => {
  const dir = temp();
  try {
    const record = deploy("dense-data", dir);
    for (const f of [
      "src/styles/open-ds.css",
      "src/lib/utils.ts",
      "src/components/ui/button.tsx",
      "AGENTS.md",
      ".claude/skills/open-ds/SKILL.md",
      ".open-ds/scheme.json",
      ".open-ds/tokens/light.tokens.json",
      ".open-ds/tokens/dark.tokens.json",
      "open-ds.json",
    ])
      assert.ok(existsSync(join(dir, f)), `missing ${f}`);
    const css = readFileSync(join(dir, "src/styles/open-ds.css"), "utf8");
    assert.match(css, /--button-primary-background:/);
    assert.match(css, /\.dark/);
    assert.match(css, /--primary: var\(--color-action-primary\)/);
    assert.match(readFileSync(join(dir, "src/components/ui/button.tsx"), "utf8"), /from "\.\.\/\.\.\/lib\/utils"/);
    const agents = readFileSync(join(dir, "AGENTS.md"), "utf8");
    assert.match(agents, /\| Situation \| Use \| Not \| Why \|/);
    assert.match(agents, /## Voice and tone/);
    assert.equal(agents.match(/^\| (?!Situation|---)/gm).length, grammar().situations.length);
    assert.match(readFileSync(join(dir, ".claude/skills/open-ds/SKILL.md"), "utf8"), /^---\nname: open-ds\ndescription: /);
    assert.equal(record.components.length, 14);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("init with a brand writes the brand into AGENTS.md and rejects unknown brands", () => {
  const dir = temp();
  try {
    deploy("multi-brand", dir, { brand: "coral" });
    assert.match(readFileSync(join(dir, "AGENTS.md"), "utf8"), /data-brand="coral"/);
    assert.throws(() => deploy("multi-brand", dir, { brand: "nope" }), /no brand "nope"/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("add copies one component and needs an initialised project", () => {
  const dir = temp();
  try {
    assert.throws(() => addComponent("button", dir), /Run "open-ds init <scheme>" first/);
    deploy("content-first", dir);
    rmSync(join(dir, "src/components/ui/badge.tsx"));
    addComponent("badge", dir);
    assert.ok(existsSync(join(dir, "src/components/ui/badge.tsx")));
    assert.throws(() => addComponent("nope", dir), /No component called "nope"/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("an unknown scheme says how to find the real ones", () => {
  assert.throws(() => loadScheme("nope"), /Run "open-ds list"/);
});

test("init through the binary prints the next steps", () => {
  const dir = temp();
  try {
    const out = cli("init", "accessible-first", "--dir", dir, "--yes");
    assert.match(out, /Deployed accessible-first/);
    assert.match(out, /npm install radix-ui/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("init refuses to overwrite a project unless asked", () => {
  const dir = temp();
  try {
    deploy("dense-data", dir);
    assert.throws(() => deploy("dense-data", dir), /--yes to overwrite/);
    deploy("content-first", dir, { overwrite: true });
    assert.equal(JSON.parse(readFileSync(join(dir, "open-ds.json"), "utf8")).scheme, "content-first");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("errors are clear, and JSON when --json is set", () => {
  const fail = (...args) => {
    try {
      execFileSync("node", [bin, ...args], { encoding: "utf8", stdio: "pipe" });
      return null;
    } catch (e) {
      return e;
    }
  };
  assert.match(fail("init", "dense-dta", "--dir", temp()).stderr, /No scheme called "dense-dta"/);
  assert.match(fail("init", "dense-data", "--dir").stderr, /--dir needs a value/);
  assert.deepEqual(Object.keys(JSON.parse(fail("show", "nope", "--json").stdout)), ["error"]);
});

test("recipe commands from the first preview still run through the new entry point", () => {
  const out = cli("diff");
  assert.match(out, /diff is not ready/);
});
