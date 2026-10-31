#!/usr/bin/env node
// Writes ui/registry.json (a shadcn registry) and ui/r/<item>.json (built items with file
// content). Components are the files in src/components. Themes come from the built tokens:
// one theme per scheme, plus one per extra brand for multi-brand schemes.

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = join(dirname(fileURLToPath(import.meta.url)), "..");
const root = join(here, "..");
const tokensDist = join(root, "tokens", "dist");
const read0 = (p) => readFileSync(p, "utf8");
const NPM = Object.keys(JSON.parse(read0(join(here, "package.json"))).dependencies).filter(
  (d) => !["clsx", "tailwind-merge"].includes(d),
);

const read = (p) => readFileSync(p, "utf8");
const describe = (src) => (src.match(/^\/\*\*\n \* (.+?)\n/) ?? [])[1] ?? "";

function flatten(obj, prefix = "") {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}-${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) Object.assign(out, flatten(v, key));
    else out[key] = typeof v === "object" ? JSON.stringify(v) : String(v);
  }
  return out;
}

function shadcnVars(vars) {
  const map = JSON.parse(read(join(tokensDist, "shadcn-map.json")));
  return Object.fromEntries(Object.entries(map).map(([k, v]) => [k, vars[v]]));
}

export function buildRegistry() {
  const items = [
    {
      name: "utils",
      type: "registry:lib",
      title: "cn helper",
      description: "Joins class names; later Tailwind classes win.",
      dependencies: ["clsx", "tailwind-merge"],
      files: [{ path: "src/lib/utils.ts", type: "registry:lib" }],
    },
    {
      name: "use-mobile",
      type: "registry:lib",
      title: "useIsMobile hook",
      description: "True below the phone breakpoint. The sidebar uses it.",
      files: [{ path: "src/lib/use-mobile.ts", type: "registry:lib" }],
    },
  ];
  for (const file of readdirSync(join(here, "src", "components")).sort()) {
    const name = file.replace(/\.tsx$/, "");
    const src = read(join(here, "src", "components", file));
    items.push({
      name,
      type: "registry:ui",
      title: name.replace(/(^|-)(\w)/g, (_, s, c) => (s ? " " : "") + c.toUpperCase()),
      description: describe(src),
      dependencies: NPM.filter((d) => src.includes(`from "${d}"`)),
      // The cn helper, and the other components this one imports.
      registryDependencies: [
        "utils",
        ...[...src.matchAll(/from "\.\.\/lib\/(use-[a-z-]+)"/g)].map((m) => m[1]),
        ...[...src.matchAll(/from "\.\/([a-z-]+)"/g)].map((m) => m[1]),
      ],
      files: [{ path: `src/components/${file}`, type: "registry:ui" }],
    });
  }
  const index = JSON.parse(read(join(tokensDist, "index.json")));
  for (const scheme of index.schemes) {
    for (const [i, brand] of scheme.brands.entries()) {
      const theme = (mode) => scheme.themes.find((t) => t.brand === brand.id && t.mode === mode).id;
      const light = flatten(JSON.parse(read(join(tokensDist, scheme.id, `${theme("light")}.tokens.json`))));
      const dark = flatten(JSON.parse(read(join(tokensDist, scheme.id, `${theme("dark")}.tokens.json`))));
      items.push({
        name: i === 0 ? `theme-${scheme.id}` : `theme-${scheme.id}-${brand.id}`,
        type: "registry:theme",
        title: scheme.brands.length > 1 ? `${scheme.name}: ${brand.label}` : scheme.name,
        description: `Every ${scheme.name} token${scheme.brands.length > 1 ? ` for the ${brand.label} brand` : ""}, light and dark, plus shadcn's variables mapped onto them.`,
        cssVars: { light: { ...light, ...shadcnVars(light) }, dark: { ...dark, ...shadcnVars(dark) } },
      });
    }
  }
  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "open-ds",
    homepage: "https://github.com/3dyonic/Open-DS",
    items,
  };
  writeFileSync(join(here, "registry.json"), JSON.stringify(registry, null, 2) + "\n");
  mkdirSync(join(here, "r"), { recursive: true });
  for (const item of items) {
    const built = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      ...item,
      // shadcn rewrites @/ imports to the project's aliases, so components find lib/utils.
      files: item.files?.map((f) => ({
        ...f,
        content: read(join(here, f.path)).replaceAll(`from "../lib/`, `from "@/lib/`),
      })),
    };
    writeFileSync(join(here, "r", `${item.name}.json`), JSON.stringify(built, null, 2) + "\n");
  }
  return registry;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const r = buildRegistry();
  console.log(`Registry: ${r.items.length} items`);
}
