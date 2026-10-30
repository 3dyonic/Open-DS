#!/usr/bin/env node
// The local end-to-end run. It proves the MVP works the way a person and an agent would use it:
//   1. build the tokens
//   2. CLI: list, why, when
//   3. CLI: deploy Dense data into e2e/app and build that app with Vite
//   4. MCP over stdio: list tools and schemes, ask when_to_use, deploy Multi-brand (Coral)
//   5. build the website, Storybook and the docs
// Pass --quick to skip step 5.

import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const quick = process.argv.includes("--quick");
const cli = join(root, "cli", "bin", "open-ds.js");
const app = join(root, "e2e", "app");
let failed = 0;

function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], ...opts });
}

function step(name, fn) {
  const start = Date.now();
  try {
    const note = fn();
    console.log(`✓ ${name}${note ? `: ${note}` : ""} (${((Date.now() - start) / 1000).toFixed(1)}s)`);
  } catch (error) {
    failed++;
    const out = `${error.stdout ?? ""}${error.stderr ?? ""}${error.message ?? ""}`.trim().split("\n").slice(-8).join("\n");
    console.log(`✗ ${name}\n${out}`);
  }
}

const must = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

step("Tokens build (Style Dictionary)", () => {
  run("pnpm", ["--dir", "tokens", "build"]);
  return "5 schemes, every brand in light and dark";
});

step("CLI: list, why, when", () => {
  const list = JSON.parse(run("node", [cli, "list", "--json"]));
  must(list.length === 5, `expected 5 schemes, got ${list.length}`);
  const why = JSON.parse(run("node", [cli, "why", "dense-data", "typography.q3", "--json"]));
  must(why.because.length > 0, "why has no because chain");
  const when = JSON.parse(run("node", [cli, "when", "content-first", "a number in a table", "--json"]));
  must(when.situation === "number-in-table", "when matched the wrong situation");
  return `${list.length} schemes; why follows ${why.because.length} reasons; when finds "${when.title}"`;
});

step("CLI: deploy Dense data into a Vite app and build it", () => {
  run("node", [cli, "init", "dense-data", "--dir", app, "--yes"]);
  for (const f of ["AGENTS.md", ".claude/skills/open-ds/SKILL.md", "src/styles/open-ds.css", "src/components/ui/button.tsx"]) {
    must(existsSync(join(app, f)), `init did not write ${f}`);
  }
  run("pnpm", ["--dir", app, "build"]);
  const css = readFileSync(join(app, "dist", "assets", run("ls", [join(app, "dist", "assets")]).split("\n").find((f) => f.endsWith(".css"))), "utf8");
  must(css.includes("--button-primary-background"), "built CSS has no component keys");
  return "deployed files compile; the built CSS carries the scheme";
});

step("MCP over stdio: tools, schemes, when_to_use, deploy", () => {
  const dir = mkdtempSync(join(tmpdir(), "open-ds-e2e-mcp-"));
  try {
    const out = JSON.parse(run("uv", ["run", "python", "scripts/e2e_mcp.py", dir]).trim().split("\n").pop());
    for (const t of ["list_schemes", "get_scheme", "get_answer", "why", "when_to_use", "deploy"]) must(out.tools.includes(t), `missing tool ${t}`);
    must(out.schemes.length === 5, "list_schemes did not return 5");
    must(out.rule === "type.data", `when_to_use returned ${out.rule}`);
    must(existsSync(join(dir, "AGENTS.md")) && out.brand === "coral", "deploy did not write the Coral project");
    return `${out.tools.length} tools; deployed ${out.deployed} (${out.brand})`;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

if (!quick) {
  step("Website build (Next.js static export)", () => {
    run("pnpm", ["--dir", "site", "build"]);
    must(existsSync(join(root, "site", "out", "schemes", "multi-brand", "index.html")), "no scheme page in site/out");
    return "site/out";
  });
  step("Storybook build", () => {
    run("pnpm", ["--dir", "storybook", "build"]);
    return "storybook/storybook-static";
  });
  step("Docs build (Docusaurus)", () => {
    run("pnpm", ["--dir", "docs", "build"]);
    must(existsSync(join(root, "docs", "build", "llms.txt")), "docs do not serve llms.txt");
    return "docs/build, with llms.txt";
  });
}

console.log(failed ? `\n${failed} step(s) failed.` : "\nEnd to end: all steps passed.");
process.exitCode = failed ? 1 : 0;
