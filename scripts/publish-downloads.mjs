import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const STANCES = ["accessible-first", "dense-data", "multi-brand", "content-first", "brand-expressive"];

const here = dirname(fileURLToPath(import.meta.url));

export function repoRoot() {
  return resolve(here, "..");
}

export function publishDownloads(root = repoRoot(), destRoot = join(root, "site/public/downloads")) {
  const bin = join(root, "cli/bin/open-ds.js");
  mkdirSync(destRoot, { recursive: true });
  for (const name of STANCES) {
    const dir = mkdtempSync(join(tmpdir(), `open-ds-pub-${name}-`));
    try {
      execFileSync(process.execPath, [bin, "init", join(root, "recipes", `${name}.json`), "--out", dir], {
        cwd: root,
        stdio: "inherit",
      });
      const dest = join(destRoot, name);
      mkdirSync(dest, { recursive: true });
      const files = [
        ["recipe.json", "recipe.json"],
        ["theme/tokens.json", "tokens.json"],
        ["links.json", "links.json"],
        ["AGENTS.md", "AGENTS.md"],
      ];
      for (const [from, to] of files) cpSync(join(dir, from), join(dest, to));
      execFileSync(
        "uv",
        [
          "run",
          "--frozen",
          "python",
          "-m",
          "open_ds_validator.contract",
          "zip",
          "--out",
          join(dest, `${name}.zip`),
          "--recipe",
          join(dest, "recipe.json"),
          "--tokens",
          join(dest, "tokens.json"),
          "--links",
          join(dest, "links.json"),
          "--agents",
          join(dest, "AGENTS.md"),
        ],
        { cwd: root, stdio: "inherit" },
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }
  return destRoot;
}

const invoked = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) publishDownloads();
