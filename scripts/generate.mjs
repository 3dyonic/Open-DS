#!/usr/bin/env node
// Writes every file that the build generates from the schemes and that git does not keep (OD-302):
// the tokens (tokens/dist), the docs pages and their data (docs/docs, docs/static, docs/src/css) and
// the shadcn registry (ui/registry.json, ui/r). Run it after a clone and after a change to a scheme,
// before a step that reads these files. The harness runs it first.
//
//   node scripts/generate.mjs
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// In order: the docs read the built tokens.
export const GENERATORS = [
  { id: "tokens", script: "tokens/build.mjs" },
  { id: "docs", script: "docs/scripts/generate.mjs" },
  { id: "registry", script: "ui/scripts/build-registry.mjs" },
];

/**
 * Runs the generators of a checkout, in order. `only` limits the run to some ids. Throws on the first
 * generator that fails, with its last lines and the command that shows the full error.
 */
export function generate({ repo = root, only = null, log = (line) => console.error(line) } = {}) {
  for (const g of GENERATORS.filter((x) => !only || only.includes(x.id))) {
    const r = spawnSync(process.execPath, [join(repo, g.script)], {
      cwd: repo,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
    if (r.status !== 0) {
      const last = `${r.stderr ?? ""}${r.stdout ?? ""}`.trim().split("\n").slice(-6).join("\n");
      throw new Error(`${g.script} failed in ${repo}:\n${last}\nRun: node ${g.script}`);
    }
    log(`${g.id}: ${(r.stdout ?? "").trim().split("\n").at(-1)}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    generate();
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
