#!/usr/bin/env node
// Copies what the CLI needs into cli/assets so the package works outside the repository:
// schemes, built tokens, component sources, Storybook stories, the agent skill and the docs' composites. Run after the tokens build.

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
// The scheme schema, for the build's schema rule (OD-292).
cpSync(join(repo, "schema", "scheme.schema.json"), join(assets, "schema", "scheme.schema.json"));
cpSync(join(repo, "tokens", "dist"), join(assets, "tokens"), { recursive: true });
for (const part of ["components", "lib", "styles.css", "icons.css"]) {
  cpSync(join(repo, "ui", "src", part), join(assets, "ui", part), { recursive: true });
}
cpSync(join(repo, "storybook", "stories"), join(assets, "stories"), { recursive: true });
cpSync(join(repo, "skills"), join(assets, "skills"), { recursive: true });
// The docs' composites and the parts of the docs site that draw them (OD-284): the remark plugin,
// the MDX component map and the Tailwind entry. create writes them into a project's docs.
cpSync(join(repo, "doc-composites", "src"), join(assets, "doc-composites"), { recursive: true });
for (const part of ["remark/composites.mjs", "theme/MDXComponents.tsx", "css/tailwind.css"])
  cpSync(join(repo, "docs", "src", part), join(assets, "docs-src", part));
console.error(`Bundled assets into ${assets}`);
