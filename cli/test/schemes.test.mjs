import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { addComponent, deploy } from "../src/cli.mjs";
import {
  assetRoots,
  grammar,
  keyInfo,
  loadScheme,
  schemeIds,
  when,
  why,
} from "../src/schemes.mjs";

const bin = join(import.meta.dirname, "..", "bin", "open-ds.js");
const cli = (...args) =>
  execFileSync("node", [bin, ...args], { encoding: "utf8" });
const temp = () => mkdtempSync(join(tmpdir(), "open-ds-scheme-"));

test("list shows the five schemes", () => {
  assert.deepEqual(schemeIds(), [
    "accessible-first",
    "brand-expressive",
    "content-first",
    "dense-data",
    "multi-brand",
  ]);
  const out = JSON.parse(cli("list", "--json"));
  assert.equal(out.length, 5);
  assert.deepEqual(out.find((s) => s.id === "multi-brand").brands, [
    "aster",
    "birch",
    "coral",
  ]);
});

test("help names every scheme command", () => {
  const out = cli("--help");
  for (const c of ["list", "show", "why", "when", "create", "init", "add"])
    assert.match(out, new RegExp(`open-ds ${c}`));
});

test("why follows the because chain back to the reasons", () => {
  const w = why(loadScheme("dense-data"), "typography.definition");
  assert.equal(w.answer, "A ratio, line heights on the grid");
  assert.ok(w.because.length > 0);
  assert.ok(
    w.because.some(
      (b) =>
        b.question.startsWith("tasks.") || b.question.startsWith("people."),
    ),
  );
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
    assert.match(
      readFileSync(join(dir, "src/components/ui/button.tsx"), "utf8"),
      /from "\.\.\/\.\.\/lib\/utils"/,
    );
    const agents = readFileSync(join(dir, "AGENTS.md"), "utf8");
    assert.match(agents, /\| Situation \| Use \| Not \| Why \|/);
    assert.match(agents, /## Voice and tone/);
    assert.match(
      agents,
      /Tone per moment, with an example:\n\n- A button label: .+ Example: "Export"/,
    );
    assert.match(agents, /## Use scenarios\n\n- A security analyst/);
    assert.ok(
      readFileSync(join(dir, ".open-ds/content.json"), "utf8").includes(
        '"commit"',
      ),
    );
    assert.equal(
      agents.match(/^\| (?!Situation|---|Token|`)/gm).length,
      grammar().situations.length,
    );
    // The colour guidance: one row per semantic key, from the grammar.
    assert.equal(agents.match(/^\| `color\./gm).length, grammar().semantics.keys.length);
    assert.match(
      readFileSync(join(dir, ".claude/skills/open-ds/SKILL.md"), "utf8"),
      /^---\nname: open-ds\ndescription: /,
    );
    // The scheme's inventory, plus what those components import (toggle-group brings toggle), and nothing else.
    const inventory = loadScheme("dense-data").inventory.in.map((i) => i.id);
    for (const id of inventory)
      assert.ok(record.components.includes(id), `missing ${id}`);
    assert.ok(record.components.includes("toggle"));
    assert.ok(!record.components.includes("carousel"));
    assert.ok(!existsSync(join(dir, "src/components/ui/carousel.tsx")));
    assert.ok(
      record.dependencies.includes("recharts") &&
        !record.dependencies.includes("embla-carousel-react"),
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("init with a brand writes the brand into AGENTS.md and rejects unknown brands", () => {
  const dir = temp();
  try {
    deploy("multi-brand", dir, { brand: "coral" });
    assert.match(
      readFileSync(join(dir, "AGENTS.md"), "utf8"),
      /data-brand="coral"/,
    );
    assert.throws(
      () => deploy("multi-brand", dir, { brand: "nope" }),
      /no brand "nope"/,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("add copies one component and needs an initialised project", () => {
  const dir = temp();
  try {
    assert.throws(
      () => addComponent("button", dir),
      /Run "open-ds init <scheme>" first/,
    );
    deploy("content-first", dir);
    rmSync(join(dir, "src/components/ui/badge.tsx"));
    addComponent("badge", dir);
    assert.ok(existsSync(join(dir, "src/components/ui/badge.tsx")));
    assert.throws(
      () => addComponent("nope", dir),
      /No component called "nope"/,
    );
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
    assert.match(out, /npm install .*radix-ui/);
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
    assert.equal(
      JSON.parse(readFileSync(join(dir, "open-ds.json"), "utf8")).scheme,
      "content-first",
    );
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
  assert.match(
    fail("init", "dense-dta", "--dir", temp()).stderr,
    /No scheme called "dense-dta"/,
  );
  assert.match(
    fail("init", "dense-data", "--dir").stderr,
    /--dir needs a value/,
  );
  assert.deepEqual(
    Object.keys(JSON.parse(fail("show", "nope", "--json").stdout)),
    ["error"],
  );
});

test("unknown commands and init without a scheme fail with a clear message", () => {
  const fail = (...args) => {
    try {
      execFileSync(process.execPath, [bin, ...args], {
        encoding: "utf8",
        stdio: "pipe",
      });
      return null;
    } catch (e) {
      return e.stderr;
    }
  };
  assert.match(fail("diff"), /Unknown command "diff"/);
  assert.match(fail("init"), /init needs a scheme/);
});

test("docs pages cover every scope and component, for every scheme", async () => {
  const { docsPages, docsLlms } = await import("../src/docs.mjs");
  const roots = assetRoots();
  const g = grammar(roots);
  const components = readdirSync(join(roots.ui, "components")).filter((f) =>
    f.endsWith(".tsx"),
  );
  for (const id of schemeIds(roots)) {
    const pages = docsPages(loadScheme(id, roots), g, roots);
    for (const p of ["index.md", "voice.md", "themes.md", "agents.md"])
      assert.ok(pages[p], `${id}: ${p}`);
    for (const sc of g.scopes)
      assert.match(pages[`foundations/${sc.id}.md`], /## The five answers/);
    // An inventory page, then one page per built component that is in the inventory.
    const scheme = loadScheme(id, roots);
    const inv = scheme.inventory.in.map((i) => i.id);
    const carried = inv;
    const expected = components
      .map((f) => f.replace(/\.tsx$/, ""))
      .filter((c) => carried.includes(c));
    assert.match(
      pages["components/inventory.md"],
      new RegExp(`\\*\\*${inv.length}\\*\\* components are in`),
    );
    assert.deepEqual(
      Object.keys(pages)
        .filter(
          (p) =>
            p.startsWith("components/") &&
            p.endsWith(".md") &&
            p !== "components/inventory.md",
        )
        .sort(),
      expected.map((c) => `components/${c}.md`).sort(),
    );
    assert.match(
      docsLlms(loadScheme(id, roots), pages),
      /- \[Voice and tone\]\(\/voice\)/,
    );
  }
});

test("init --docs writes the design system's docs", () => {
  const dir = mkdtempSync(join(tmpdir(), "open-ds-docs-"));
  try {
    const record = deploy("content-first", dir, { docs: true });
    assert.ok(record.files["docs/index.md"]);
    assert.match(
      readFileSync(join(dir, "docs/foundations/typography.md"), "utf8"),
      /# Typography/,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("create writes a full design system project", async () => {
  const { createProject } = await import("../src/create.mjs");
  const dir = join(temp(), "ds");
  const record = createProject("multi-brand", dir, {
    brand: "coral",
    openDs: "file:../open-ds.tgz",
  });
  assert.equal(record.kind, "project");
  assert.equal(record.brand, "coral");
  for (const f of [
    ".gitignore",
    "tokens/build.mjs",
    "tokens/src/theme/aster.tokens.json",
    "tokens/src/primitive/color/teal.tokens.json",
    "tokens/src/semantic/color.tokens.json",
    ".storybook/preview.tsx",
    "stories/button.stories.tsx",
    "docs/docs/index.md",
    "scheme.json",
    "AGENTS.md",
  ])
    assert.ok(existsSync(join(dir, f)), f);
  const themes = JSON.parse(
    readFileSync(join(dir, "tokens/themes.json"), "utf8"),
  );
  assert.equal(themes.brands[0].id, "coral");
  const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  assert.equal(pkg.devDependencies["open-ds"], "file:../open-ds.tgz");
  assert.ok(
    !readFileSync(join(dir, "stories/button.stories.tsx"), "utf8").includes(
      "@open-ds/ui",
    ),
  );
  assert.ok(
    !readFileSync(join(dir, ".storybook/preview-head.html"), "utf8").includes(
      "__",
    ),
    "a template placeholder was left in",
  );
  assert.throws(() => createProject("multi-brand", dir), /not empty/);
  const fresh = join(temp(), "fresh");
  mkdirSync(join(fresh, "vendor"), { recursive: true });
  writeFileSync(join(fresh, "package-lock.json"), "{}");
  assert.equal(createProject("dense-data", fresh).scheme, "dense-data");
  rmSync(dirname(fresh), { recursive: true, force: true });
  rmSync(dirname(dir), { recursive: true, force: true });
});

test("add brings the components a component imports and names the packages it needs", () => {
  const dir = temp();
  try {
    deploy("accessible-first", dir);
    assert.ok(!existsSync(join(dir, "src/components/ui/sheet.tsx")));
    const record = addComponent("sidebar", dir);
    for (const c of ["sidebar", "sheet", "skeleton", "tooltip"])
      assert.ok(existsSync(join(dir, `src/components/ui/${c}.tsx`)), c);
    assert.ok(existsSync(join(dir, "src/lib/use-mobile.ts")));
    assert.ok(record.components.includes("sheet"));
    const chart = addComponent("chart", dir);
    assert.ok(chart.added.packages.includes("recharts"));
    assert.ok(
      JSON.parse(
        readFileSync(join(dir, "open-ds.json"), "utf8"),
      ).dependencies.includes("recharts"),
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("guidance: every colour key has intent and not_for; pairs and urgency read back", async () => {
  const { guidanceFor, withGuidance } = await import("../src/guidance.mjs");
  const { grammar, loadScheme } = await import("../src/schemes.mjs");
  const g = grammar();
  const info = guidanceFor(g, "color.status.info");
  assert.equal(info.id, "color.status.info.@");
  assert.equal(info.urgency.level, 1);
  assert.ok(guidanceFor(g, "color.surface.default").takes.some((t) => t.key === "color.text.primary"));
  assert.equal(guidanceFor(g, "space.gap.default"), null);
  const s = withGuidance(loadScheme("dense-data"), g);
  assert.equal(s.tokens.semantic.color.status.danger["@"].$description, guidanceFor(g, "color.status.danger").intent);
});

test("context: a task, a component key, a situation and nothing", async () => {
  const { context } = await import("../src/context.mjs");
  assert.equal(context("content-first", "write").voice.summary.text.length > 0, true);
  assert.equal(context("content-first", "button/primary/background").kind, "component key");
  assert.equal(context("content-first", "status-label").kind, "situation");
  assert.equal(context("content-first", "nothing-here"), null);
});
