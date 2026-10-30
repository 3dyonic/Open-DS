#!/usr/bin/env node
// Copies what the CLI needs into cli/assets so the package works outside the repository:
// schemes, built tokens, component sources and the agent skill. Run after the tokens build.

import { cpSync, existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const cli = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(cli, "..");
const assets = join(cli, "assets");

if (!existsSync(join(repo, "tokens", "dist", "index.json"))) {
  console.error("Build the tokens first: pnpm --dir tokens build");
  process.exit(1);
}
rmSync(assets, { recursive: true, force: true });
cpSync(join(repo, "schemes"), join(assets, "schemes"), { recursive: true, filter: (p) => !p.endsWith(".md") });
cpSync(join(repo, "tokens", "dist"), join(assets, "tokens"), { recursive: true });
for (const part of ["components", "lib", "styles.css"]) {
  cpSync(join(repo, "ui", "src", part), join(assets, "ui", part), { recursive: true });
}
cpSync(join(repo, "skills"), join(assets, "skills"), { recursive: true });
console.log(`Bundled assets into ${assets}`);
