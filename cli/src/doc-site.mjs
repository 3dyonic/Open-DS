// The parts of a docs site that draw the pages' composites, for a created project. A page's
// directive (::token-table{component="field"}) becomes a composite through the remark plugin; the
// composites are built from the project's own ui components; Tailwind compiles the classes they use.
// One source: the files the Open DS docs use, with their import paths pointed at the project.

import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { PACKAGES } from "./components.mjs";

const UI_IMPORT = /from "@open-ds\/ui\/components\/([a-z-]+)"/g;

// Every composite source file, base forms included, as paths relative to the composites folder.
const sources = (roots) => {
  const walk = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(join(dir, e.name)) : [relative(roots.composites, join(dir, e.name))],
    );
  return walk(roots.composites);
};

/** The ui components the composites import. */
export function compositeComponents(roots) {
  const names = new Set();
  for (const f of sources(roots))
    for (const [, name] of readFileSync(join(roots.composites, f), "utf8").matchAll(UI_IMPORT))
      names.add(name);
  return [...names].sort();
}

/** The npm packages the composites import themselves, such as lucide-react for icons, with versions. */
export function compositePackages(roots) {
  const used = new Set();
  for (const f of sources(roots)) {
    const src = readFileSync(join(roots.composites, f), "utf8");
    for (const pkg of Object.keys(PACKAGES)) if (src.includes(`from "${pkg}"`)) used.add(pkg);
  }
  return Object.fromEntries([...used].sort().map((p) => [p, PACKAGES[p]]));
}

/**
 * The docs site files, keyed by their path under docs/src. ui is the path from docs/src/composites
 * to the project's components folder; components are the ones the composites draw with.
 */
export function docSiteFiles(roots, { ui = "../../../src/components/ui", components = compositeComponents(roots) } = {}) {
  const files = {};
  for (const f of sources(roots)) {
    // A base form sits one folder deeper, so its path to the components does too.
    const up = "../".repeat(f.split("/").length - 1);
    files[`composites/${f}`] = readFileSync(join(roots.composites, f), "utf8").replace(
      UI_IMPORT,
      (_, name) => `from "${up}${ui}/${name}"`,
    );
  }
  files["remark/composites.mjs"] = readFileSync(join(roots.docsSrc, "remark", "composites.mjs"), "utf8");
  files["theme/MDXComponents.tsx"] = readFileSync(
    join(roots.docsSrc, "theme", "MDXComponents.tsx"),
    "utf8",
  ).replaceAll(`from "@open-ds/doc-composites/`, `from "../composites/`);
  // Tailwind reads only the components the composites draw with. The rest of a project's components
  // carry selectors that the docs' webpack CSS step warns about, and the docs never show them.
  const sourced = `${ui}/{${components.join(",")}}.tsx`;
  files["css/tailwind.css"] = readFileSync(join(roots.docsSrc, "css", "tailwind.css"), "utf8")
    .replace(/^@source "\.\.\/\.\.\/\.\.\/ui\/src\/components[^"]*";$/m, `@source "${sourced}";`)
    .replace(/^@source "\.\.\/components";\n/m, "")
    .replace(/^@source "\.\.\/\.\.\/\.\.\/doc-composites\/src";$/m, `@source "../composites";`)
    // The icon stroke rule is written in, since a project's docs sit apart from the ui folder.
    .replace(/^@import "\.\.\/\.\.\/\.\.\/ui\/src\/icons\.css";\n/m, () => readFileSync(join(roots.ui, "icons.css"), "utf8"));
  return files;
}
