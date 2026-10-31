#!/usr/bin/env node
// Tests the open-ds CLI as a user gets it: packs it the way npm would publish it, then runs it from
// the packed file in a fresh app outside the repository, the way `npx open-ds init` would.
//
//   pnpm test:package          pack, deploy Dense data into a fresh app, type-check and build it
//   pnpm test:package --keep   the same, and keep the app so you can run it: see the printed path
//   pnpm test:package --scheme multi-brand --brand coral
//
// Steps, each printed with ✓ or ✗:
//   1. Build the tokens and bundle the CLI's assets (schemes, tokens, components, skill).
//   2. Pack the CLI with npm pack: the exact file npm would publish.
//   3. Copy the blank test app (e2e/app) to a temporary folder outside the repository.
//   4. Run the packed CLI there with npx: list, then init <scheme> --docs.
//   5. Check what init wrote, then type-check and build the app with Vite.

import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const keep = args.includes("--keep");
const opt = (name, fallback) =>
  args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const scheme = opt("--scheme", "dense-data");
const brand = opt("--brand");

const work = mkdtempSync(join(tmpdir(), "open-ds-package-"));
const app = join(work, "app");
let failed = 0;
let tgz;

const run = (cmd, argv, cwd = root) =>
  execFileSync(cmd, argv, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env },
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
        .slice(-10)
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
  return "cli/assets";
});

step("Pack the CLI", () => {
  const out = run(
    "npm",
    ["pack", "--json", "--pack-destination", work],
    join(root, "cli"),
  );
  const [info] = JSON.parse(out);
  tgz = join(work, info.filename);
  must(existsSync(tgz), "npm pack wrote no file");
  const files = info.files.map((f) => f.path);
  for (const need of [
    "bin/open-ds.js",
    "src/cli.mjs",
    "assets/schemes/grammar.json",
    "assets/tokens/index.json",
    "assets/ui/components/button.tsx",
  ])
    must(files.includes(need), `the package has no ${need}`);
  must(
    !files.some((f) => f.startsWith("test/")),
    "the package ships its tests",
  );
  return `${info.filename}, ${files.length} files, ${(info.size / 1024).toFixed(0)} kB`;
});

step("Make a fresh app outside the repository", () => {
  mkdirSync(app);
  const src = join(root, "e2e", "app");
  for (const f of [
    "index.html",
    "package.json",
    "tsconfig.json",
    "vite.config.ts",
  ])
    cpSync(join(src, f), join(app, f));
  mkdirSync(join(app, "src"));
  for (const f of ["main.tsx", "index.css", "vite-env.d.ts"])
    cpSync(join(src, "src", f), join(app, "src", f));
  // The app's own packages (React, Vite, Tailwind) come from the workspace install, so the test needs
  // no network. Only the open-ds CLI comes from the packed file.
  must(
    existsSync(join(src, "node_modules")),
    "e2e/app has no node_modules. Run: pnpm install",
  );
  symlinkSync(join(src, "node_modules"), join(app, "node_modules"), "dir");
  return app;
});

const npx = (...argv) =>
  run("npx", ["--yes", `--package=${tgz}`, "open-ds", ...argv], app);

step("Run the packed CLI: list", () => {
  const list = JSON.parse(npx("list", "--json"));
  must(list.length === 5, `expected 5 schemes, got ${list.length}`);
  return list.map((s) => s.id).join(", ");
});

step(
  `Run the packed CLI: init ${scheme}${brand ? ` --brand ${brand}` : ""} --docs`,
  () => {
    const out = npx(
      "init",
      scheme,
      ...(brand ? ["--brand", brand] : []),
      "--docs",
      "--json",
    );
    const record = JSON.parse(out);
    must(record.scheme === scheme, `init wrote ${record.scheme}`);
    return `${Object.keys(record.files).length} files`;
  },
);

step("Check what init wrote", () => {
  const need = [
    "src/styles/open-ds.css",
    "src/components/ui/button.tsx",
    "src/lib/utils.ts",
    "AGENTS.md",
    ".claude/skills/open-ds/SKILL.md",
    ".open-ds/scheme.json",
    ".open-ds/content.json",
    "open-ds.json",
    "docs/index.md",
    "docs/foundations/typography.md",
  ];
  const missing = need.filter((f) => !existsSync(join(app, f)));
  must(!missing.length, `missing: ${missing.join(", ")}`);
  must(
    readFileSync(join(app, "src/styles/open-ds.css"), "utf8").includes(
      "--button-primary-background",
    ),
    "the CSS has no component keys",
  );
  return `${readdirSync(join(app, "src/components/ui")).length} components, tokens, AGENTS.md, the skill, the docs`;
});

step("Type-check the app", () => {
  run("npx", ["tsc", "--noEmit"], app);
  return "tsc passes";
});

step("Build the app with Vite", () => {
  run("npx", ["vite", "build"], app);
  const css = readdirSync(join(app, "dist", "assets")).find((f) =>
    f.endsWith(".css"),
  );
  must(
    css &&
      readFileSync(join(app, "dist", "assets", css), "utf8").includes(
        "--color-action-primary",
      ),
    "the built CSS has no scheme tokens",
  );
  return "dist/ with the scheme's CSS";
});

if (keep && !failed) {
  console.log(
    `\nThe app is in ${app}\nSee it in a browser:\n  cd ${app}\n  npx vite\nThen open the address it prints. Read what an agent gets in ${join(app, "AGENTS.md")}.`,
  );
} else {
  rmSync(work, { recursive: true, force: true });
}
console.log(
  failed
    ? "\nThe package test failed."
    : "\nThe package works outside the repository.",
);
process.exitCode = failed ? 1 : 0;
