#!/usr/bin/env node
// Version bumps decided by the public surface (OD-165).
//
// The public surface is what a user's code or an agent can notice: each scheme's CSS variables, the
// component key ids, the scheme and brand ids, the CLI commands and the MCP tool names. cli/surface.json
// holds the surface of the last release. A removal is breaking (major, or minor while the major is 0);
// an addition is a feature (minor, or patch while the major is 0); anything else is a patch.
//
//   node scripts/release.mjs status            what changed since the last release, and the bump it needs
//   node scripts/release.mjs check             exit 1 if cli/package.json and cli/surface.json disagree
//   node scripts/release.mjs <patch|minor|major>  bump the CLI and update the snapshot; refuses a too-small bump
//
// Needs the built tokens (pnpm --dir tokens build).
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (...p) => readFileSync(join(root, ...p), "utf8");
const json = (...p) => JSON.parse(read(...p));
const LEVELS = ["patch", "minor", "major"];

/** The public surface now: sorted lists, one per kind. */
export function surface() {
  const ids = readdirSync(join(root, "schemes"))
    .filter((f) => f.endsWith(".json") && f !== "grammar.json")
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
  if (!existsSync(join(root, "tokens", "dist", "index.json")))
    throw new Error("Build the tokens first: pnpm --dir tokens build");
  const vars = ids.flatMap((id) =>
    [
      ...new Set(
        [
          ...read("tokens", "dist", id, "tokens.css").matchAll(
            /^\s*(--[a-z0-9-]+):/gm,
          ),
        ].map((m) => m[1]),
      ),
    ].map((v) => `${id} ${v}`),
  );
  const cli = read("cli", "src", "cli.mjs");
  const mcp = read("cli", "src", "mcp.mjs");
  return {
    schemes: ids,
    brands: ids.flatMap((id) =>
      Object.keys(json("schemes", `${id}.json`).tokens.brands).map(
        (b) => `${id} ${b}`,
      ),
    ),
    css_variables: vars.sort(),
    component_keys: json("schemes", "grammar.json")
      .component_keys.map((k) => k.id)
      .sort(),
    cli_commands: [
      ...new Set([...cli.matchAll(/cmd === "([a-z-]+)"/g)].map((m) => m[1])),
    ].sort(),
    mcp_tools: [...mcp.matchAll(/registerTool\(\s*"([a-z_]+)"/g)]
      .map((m) => m[1])
      .sort(),
  };
}

/** What was removed and added since a snapshot, and the smallest bump that allows it. */
export function diff(before, now, version) {
  const removed = {};
  const added = {};
  for (const kind of Object.keys(now)) {
    const b = new Set(before[kind] ?? []);
    const n = new Set(now[kind]);
    const r = [...b].filter((x) => !n.has(x));
    const a = [...n].filter((x) => !b.has(x));
    if (r.length) removed[kind] = r;
    if (a.length) added[kind] = a;
  }
  const breaking = Object.keys(removed).length > 0;
  const feature = Object.keys(added).length > 0;
  const zero = version.split(".")[0] === "0";
  const needs = breaking
    ? zero
      ? "minor"
      : "major"
    : feature
      ? zero
        ? "patch"
        : "minor"
      : "patch";
  return { removed, added, needs, changed: breaking || feature };
}

const bump = (version, level) => {
  const [ma, mi, pa] = version.split(".").map(Number);
  return level === "major"
    ? `${ma + 1}.0.0`
    : level === "minor"
      ? `${ma}.${mi + 1}.0`
      : `${ma}.${mi}.${pa + 1}`;
};

/** The release level from one version to the next, or null when it is not a step up. */
const levelOf = (from, to) => {
  const [a, b] = [from, to].map((v) => v.split(".").map(Number));
  if (b[0] > a[0]) return "major";
  if (b[0] === a[0] && b[1] > a[1]) return "minor";
  if (b[0] === a[0] && b[1] === a[1] && b[2] > a[2]) return "patch";
  return null;
};

function main() {
  const [cmd] = process.argv.slice(2);
  const snapFile = join(root, "cli", "surface.json");
  const snap = JSON.parse(readFileSync(snapFile, "utf8"));
  const pkgFile = join(root, "cli", "package.json");
  const pkg = JSON.parse(readFileSync(pkgFile, "utf8"));
  const now = surface();
  const d = diff(snap.surface, now, snap.version);

  if (cmd === "status") {
    console.log(
      `Last release ${snap.version}. The next release needs at least a ${d.needs} bump.`,
    );
    for (const [k, v] of Object.entries(d.removed))
      console.log(`  removed ${k}: ${v.join(", ")}`);
    for (const [k, v] of Object.entries(d.added))
      console.log(`  added ${k}: ${v.join(", ")}`);
    return 0;
  }
  if (cmd === "check") {
    // Between releases the package keeps the snapshot's version; a release changes both together.
    if (pkg.version !== snap.version) {
      console.error(
        `cli/package.json is ${pkg.version} but cli/surface.json is ${snap.version}. Release with: node scripts/release.mjs <patch|minor|major>`,
      );
      return 1;
    }
    console.log(
      d.changed
        ? `${pkg.version}: unreleased surface changes; the next release needs at least a ${d.needs} bump.`
        : `${pkg.version}: the surface matches the last release.`,
    );
    return 0;
  }
  if (LEVELS.includes(cmd)) {
    if (pkg.version !== snap.version)
      throw new Error(
        `cli/package.json (${pkg.version}) and cli/surface.json (${snap.version}) disagree.`,
      );
    if (LEVELS.indexOf(cmd) < LEVELS.indexOf(d.needs))
      throw new Error(
        `A ${cmd} bump is too small: the surface changed in a way that needs at least ${d.needs}. Run status to see why.`,
      );
    const next = bump(pkg.version, cmd);
    pkg.version = next;
    writeFileSync(pkgFile, JSON.stringify(pkg, null, 2) + "\n");
    writeFileSync(
      snapFile,
      JSON.stringify(snapshot(next, now), null, 2) + "\n",
    );
    console.log(
      `${snap.version} → ${next} (${cmd}). Commit cli/package.json and cli/surface.json in one release PR.`,
    );
    return 0;
  }
  console.error(
    "Usage: node scripts/release.mjs status | check | patch | minor | major",
  );
  return 1;
}

export const snapshot = (version, s) => ({
  description:
    "The public surface of the last open-ds release: what users and agents can notice. scripts/release.mjs compares the current surface with it to decide the version bump (OD-165). Generated; do not edit by hand.",
  version,
  surface: s,
});

export { levelOf };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    process.exitCode = main();
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  }
}
