#!/usr/bin/env node
// Tests `open-ds create` as a user gets it: packs the CLI the way npm would publish it, creates a
// design system project from the packed file outside the repository, installs it and builds it.
//
//   pnpm test:create                        dense-data
//   pnpm test:create --scheme multi-brand   any scheme
//   pnpm test:create --keep                 keep the project: see the printed path
//
// Needs the npm registry: the project installs Storybook, Docusaurus and Style Dictionary.

import { execFileSync, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const args = process.argv.slice(2);
const keep = args.includes("--keep");
const scheme = args.includes("--scheme")
  ? args[args.indexOf("--scheme") + 1]
  : "dense-data";
const work = mkdtempSync(join(tmpdir(), "open-ds-create-"));
const project = join(work, "test-ds");
let failed = 0;
let tgz;

const run = (cmd, argv, cwd = root) =>
  execFileSync(cmd, argv, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 64 * 1024 * 1024,
  });

function step(name, fn) {
  if (failed) return;
  try {
    const note = fn();
    console.log(`✓ ${name}${note ? `: ${note}` : ""}`);
  } catch (error) {
    failed++;
    const out =
      `${error.stdout ?? ""}${error.stderr ?? ""}${error.message ?? ""}`
        .trim()
        .split("\n")
        .slice(-15)
        .join("\n");
    console.log(`✗ ${name}\n${out}`);
  }
}
const must = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

step("Build the tokens and bundle the CLI", () => {
  run("pnpm", ["--dir", "tokens", "build"]);
  run("node", ["cli/scripts/bundle.mjs"]);
});

step("Pack the CLI", () => {
  const [info] = JSON.parse(
    run(
      "npm",
      ["pack", "--json", "--pack-destination", work],
      join(root, "cli"),
    ),
  );
  tgz = join(work, info.filename);
  const files = info.files.map((f) => f.path);
  for (const need of [
    "src/create.mjs",
    "templates/project/tokens/build.mjs",
    "templates/project/gitignore",
    "assets/stories/button.stories.tsx",
  ])
    must(files.includes(need), `the package has no ${need}`);
  return info.filename;
});

step(`Run the packed CLI: create test-ds --scheme ${scheme}`, () => {
  const out = run(
    "npx",
    [
      "--yes",
      `--package=${tgz}`,
      "open-ds",
      "create",
      "test-ds",
      "--scheme",
      scheme,
      "--open-ds",
      `file:${tgz}`,
      "--json",
    ],
    work,
  );
  const record = JSON.parse(out);
  must(record.scheme === scheme, `create wrote ${record.scheme}`);
  for (const need of [
    ".gitignore",
    "tokens/build.mjs",
    "tokens/src/primitive/color/violet.tokens.json",
    "tokens/src/theme/default.tokens.json",
    "tokens/src/semantic/color.tokens.json",
    ".storybook/preview.tsx",
    "stories/button.stories.tsx",
    "docs/docs/index.md",
    "scheme.json",
    "AGENTS.md",
    "context/index.json",
    "context/components/button.md",
    "context/tasks/build.md",
  ])
    must(existsSync(join(project, need)), `missing ${need}`);
  return `${record.files.length} files`;
});

step("Install the project", () => {
  run(
    "npm",
    ["install", "--no-audit", "--no-fund", "--loglevel=error"],
    project,
  );
  must(
    existsSync(join(project, "node_modules", "open-ds", "package.json")),
    "open-ds is not installed",
  );
});

step("Build the tokens with Style Dictionary", () => {
  run("npm", ["run", "tokens"], project);
  const css = readFileSync(join(project, "build", "tokens.css"), "utf8");
  must(
    css.includes("--button-primary-background") && css.includes(".dark"),
    "tokens.css has no component keys or dark mode",
  );
  return readdirSync(join(project, "build")).join(", ");
});

step("Ask why through the installed package", () => {
  must(
    run(
      "npm",
      ["run", "--silent", "why", "--", "typography.definition"],
      project,
    ).trim().length > 0,
    "why printed nothing",
  );
});

step("Check the project's UI with the installed CLI", () => {
  // OD-202: a created project follows its own scheme, so open-ds check finds nothing.
  const out = run(
    "npx",
    ["--no-install", "open-ds", "check", ".", "--json"],
    project,
  );
  const res = JSON.parse(out);
  must(
    res.pass,
    res.findings
      .slice(0, 5)
      .map((f) => `${f.file}:${f.line} ${f.rule} ${f.message}`)
      .join("; "),
  );
  return "clean";
});

step("Type-check the components and stories", () => {
  run("npx", ["tsc", "--noEmit"], project);
});

step("Build Storybook", () => {
  run("npm", ["run", "build-storybook"], project);
  must(
    existsSync(join(project, "storybook-static", "index.html")),
    "no storybook-static/index.html",
  );
});

step("Open every story and docs page in a browser", () => {
  const out = run("node", [
    join(root, "harness", "storybook-renders.cjs"),
    join(project, "storybook-static"),
  ]);
  const res = JSON.parse(out.trim().split("\n").pop());
  if (res.missing) return "skipped: Playwright is not installed";
  must(!res.error, res.error);
  must(
    !res.failed.length,
    res.failed
      .slice(0, 5)
      .map((f) => `${f.id}: ${f.problem}`)
      .join("; "),
  );
  return `${res.entries} render`;
});

step("Build the docs with Docusaurus", () => {
  // Docusaurus prints warnings on stderr, so read both streams.
  const r = spawnSync("npm", ["run", "build-docs"], {
    cwd: project,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (r.status !== 0) throw Object.assign(new Error("build-docs failed"), r);
  const out = `${r.stdout}${r.stderr}`;
  const warn = out.split("\n").filter((l) => /\[WARNING\]/.test(l));
  must(!warn.length, `the docs build warns: ${warn.slice(0, 3).join("; ")}`);
  must(
    existsSync(join(project, "docs", "build", "index.html")),
    "no docs/build/index.html",
  );
});

if (keep) console.log(`\nThe project is in ${project}`);
else rmSync(work, { recursive: true, force: true });
console.log(
  failed
    ? "\nThe create test failed."
    : "\nA created project installs and builds its tokens, Storybook and docs.",
);
process.exitCode = failed ? 1 : 0;
