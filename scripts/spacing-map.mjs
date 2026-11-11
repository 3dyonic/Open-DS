// OD-235: writes each scheme's component spacing map from its spec. Run after changing a rhythm or
// which steps hold still: node scripts/spacing-map.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mapTokens, remOf } from "../cli/src/spacing-map.mjs";
import { loadScheme, saveScheme } from "../cli/src/schemes.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Each scheme's decision lives in the scheme (the map's $extensions). These seed a scheme that has
// none yet; after that, change the scheme and rerun.
export const SEED = {
  "dense-data": {
    rhythm: 1,
    fixed: ["x1", "x2"],
    because: ["spacing.values"],
    why: "Compact: more records fit on one screen, so components keep their tightest spacing.",
  },
  "content-first": {
    rhythm: 1.5,
    fixed: ["x1", "x2"],
    because: ["spacing.values"],
    why: "Spacious: room around the text helps reading, so panels and fields breathe; rows stay tight.",
  },
  "accessible-first": {
    rhythm: 1.75,
    fixed: ["x1", "x2"],
    because: ["spacing.values", "people.q2"],
    why: "Spacious: space lowers effort and mis-taps, so components get the most room short of the brand scheme; rows stay tight.",
  },
  "brand-expressive": {
    rhythm: 2,
    fixed: ["x1", "x2"],
    because: ["spacing.values"],
    why: "Spacious: big space makes big moments, so panels double their room; rows stay tight.",
  },
  "multi-brand": {
    rhythm: 1.5,
    fixed: ["x1", "x2"],
    because: ["spacing.values"],
    why: "Comfortable in every brand: panels and fields breathe; rows stay tight.",
  },
};

for (const id of Object.keys(SEED)) {
  const s = loadScheme(id);
  const spec = s.tokens.semantic["component-spacing-map"]?.$extensions?.[
    "open-ds"
  ]?.because
    ? s.tokens.semantic["component-spacing-map"].$extensions["open-ds"]
    : SEED[id];
  const { group, primitives } = mapTokens(spec);
  // the space primitives the map links to, added in size order beside the scheme's own
  const space = s.tokens.primitive.space;
  delete space.unit;
  for (const px of primitives)
    space[String(px)] ??= { $type: "dimension", $value: remOf(px) };
  const { $description, ...opts } = space;
  s.tokens.primitive.space = {
    $description,
    ...Object.fromEntries(Object.entries(opts).sort(([a], [b]) => Number(a) - Number(b))),
  };
  s.tokens.semantic["component-spacing-map"] = group;
  saveScheme(s);
}
console.log(
  `Wrote the component spacing map in ${Object.keys(SEED).length} schemes.`,
);
