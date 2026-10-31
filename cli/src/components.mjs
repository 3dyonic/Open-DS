// Which components a scheme gets, and which npm packages they need. A scheme carries its inventory;
// each component also brings the components it imports (a sidebar brings button, sheet and more).

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

// The npm packages components may import, with the versions Open DS tests against.
export const PACKAGES = {
  "@base-ui/react": "^1.9.0",
  "@tanstack/react-table": "^8.21.3",
  "class-variance-authority": "^0.7.1",
  clsx: "^2.1.1",
  cmdk: "^1.1.1",
  "embla-carousel-react": "^8.6.0",
  "input-otp": "^1.5.0",
  "lucide-react": "^1.65.0",
  "radix-ui": "^1.8.1",
  "react-day-picker": "^10.0.2",
  "react-hook-form": "^7.91.0",
  "react-resizable-panels": "^4.15.3",
  recharts: "^3.10.1",
  "tailwind-merge": "^3.7.0",
  vaul: "^1.1.2",
};

/** Every component built in the package. */
export function builtComponents(roots) {
  return readdirSync(join(roots.ui, "components"))
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => f.replace(/\.tsx$/, ""))
    .sort();
}

const source = (roots, name) => readFileSync(join(roots.ui, "components", `${name}.tsx`), "utf8");

/** The given components plus every component they import, transitively. */
export function withImports(names, roots) {
  const built = new Set(builtComponents(roots));
  const out = new Set();
  const visit = (name) => {
    if (out.has(name) || !built.has(name)) return;
    out.add(name);
    for (const [, dep] of source(roots, name).matchAll(/from "\.\/([a-z-]+)"/g)) visit(dep);
  };
  names.forEach(visit);
  return [...out].sort();
}

/** The scheme's inventory that is built, plus every component those import. */
export function componentsFor(scheme, roots) {
  const built = builtComponents(roots);
  // Patterns (a data table) are built from inventory components and installed like them.
  const picked = scheme.inventory ? [...scheme.inventory.in, ...(scheme.inventory.patterns ?? [])].map((i) => i.id) : built;
  const wanted = picked.filter((id) => built.includes(id));
  return withImports(wanted, roots);
}

/** The npm packages the given components import, with versions. clsx and tailwind-merge always: the cn helper. */
export function packagesFor(names, roots) {
  const used = new Set(["clsx", "tailwind-merge"]);
  for (const n of names) for (const pkg of Object.keys(PACKAGES)) if (source(roots, n).includes(`from "${pkg}"`)) used.add(pkg);
  return Object.fromEntries([...used].sort().map((p) => [p, PACKAGES[p]]));
}
