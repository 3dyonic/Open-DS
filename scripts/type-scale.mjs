// OD-294: writes each scheme's type sizes and line heights from its type scale. Run after changing a
// base, a ratio, a step or a line height: node scripts/type-scale.mjs
import { remOf, scaleTokens, specProblems } from "../cli/src/type-scale.mjs";
import { loadScheme, saveScheme } from "../cli/src/schemes.mjs";

// Each scheme's scale lives in the scheme (the type group's $extensions). These seed a scheme that has
// none yet; after that, change the scheme and rerun.
const kind = (ratio, roles) => ({ ratio, roles });
export const SEED = {
  "dense-data": {
    base: 14,
    ratio: 1.2,
    steps: { display: 3, title: 2, heading: 1, body: 0, label: -1, caption: -1, data: 0 },
    "line-height": {
      tight: kind(1.2, ["display", "title", "heading", "label"]),
      open: kind(1.45, ["body", "caption", "data"]),
    },
    follows: ["typography.count", "typography.values", "typography.definition"],
    why: "Few sizes: a small 14px body and a 1.2 ratio, each role on the next step, so every size is clearly apart and none is wasted. Short lines sit tight at 1.2; text that wraps opens to 1.45.",
  },
  "content-first": {
    base: 18,
    ratio: 1.12,
    steps: { display: 8, title: 6, heading: 4, body: 0, label: -1, caption: -2, data: 0 },
    "line-height": {
      tight: kind(1.15, ["display", "title", "heading", "label"]),
      open: kind(1.65, ["body", "caption", "data"]),
    },
    follows: ["typography.count", "typography.values", "typography.definition"],
    why: "Many fine steps: a large 18px body and a 1.12 ratio, with two steps between the headings, so long pages can set their own hierarchy. Short lines sit tight at 1.15; text that wraps opens to 1.65 for reading.",
  },
  "accessible-first": {
    base: 19,
    ratio: 1.22,
    steps: { display: 3, title: 2, heading: 1, body: 0, label: 0, caption: -1, data: 0 },
    "line-height": {
      tight: kind(1.25, ["display", "title", "heading"]),
      open: kind(1.6, ["body", "label", "caption", "data"]),
    },
    follows: ["typography.count", "typography.values", "typography.definition", "people.q1"],
    why: "Few sizes: a large 19px body and a 1.22 ratio, each role on the next step, and no step under 16px. Headings sit tight at 1.25; every other role wraps at 1.6, labels too, because a label wraps when people zoom.",
  },
  "brand-expressive": {
    base: 17,
    ratio: 1.114,
    steps: { display: 11, title: 8, heading: 5, body: 0, label: -1, caption: -2, data: 0 },
    "line-height": {
      tight: kind(1.1, ["display", "title", "heading", "label"]),
      open: kind(1.55, ["body", "caption", "data"]),
    },
    follows: ["typography.count", "typography.values", "typography.definition"],
    why: "Many fine steps: a regular 17px body and a 1.114 ratio, with wide gaps up to the display, so big moments have room. Headlines and labels sit tight at 1.1; text that wraps opens to 1.55.",
  },
  "multi-brand": {
    base: 16,
    ratio: 1.26,
    steps: { display: 3, title: 2, heading: 1, body: 0, label: -1, caption: -1, data: 0 },
    "line-height": {
      tight: kind(1.2, ["display", "title", "heading", "label"]),
      open: kind(1.5, ["body", "caption", "data"]),
    },
    follows: ["typography.count", "typography.values", "typography.definition"],
    why: "One size per kind of text: a regular 16px body and a 1.26 ratio, each kind on the next step, so the scale suits every brand face. Short lines sit tight at 1.2; text that wraps opens to 1.5.",
  },
};

// Keys of an object sorted by number, with $description first.
const byNumber = (group) => {
  const { $description, ...rest } = group;
  return {
    ...($description && { $description }),
    ...Object.fromEntries(Object.entries(rest).sort(([a], [b]) => Number(a.replace("_", ".")) - Number(b.replace("_", ".")))),
  };
};

for (const id of Object.keys(SEED)) {
  const s = loadScheme(id);
  const type = s.tokens.semantic.type;
  const spec = type.$extensions?.["open-ds"] ?? SEED[id];
  const problems = specProblems(spec);
  if (problems.length) throw new Error(`${id}: the type scale is not whole. ${problems.join("; ")}. Fix the scale in the scheme and rerun.`);
  const { roles, primitives } = scaleTokens(spec);
  for (const [role, values] of Object.entries(roles)) {
    if (!type[role]) throw new Error(`${id}: the scale has a step for ${role}, but the scheme has no type.${role}. Add the role or remove its step.`);
    for (const [key, value] of Object.entries(values)) type[role][key].$value = value;
  }
  // The scale owns the size and line height primitives: it keeps the ones it links to, and no others.
  const font = s.tokens.primitive.font;
  const sizeDescription = font.size.$description;
  font.size = byNumber({
    $description: sizeDescription,
    ...Object.fromEntries(primitives.size.map((px) => [String(px), { $type: "dimension", $value: remOf(px) }])),
  });
  font["line-height"] = byNumber(
    Object.fromEntries(
      primitives["line-height"].map(({ name, value }) => [
        name,
        { $type: "number", $value: value, $description: "A ratio of the text size." },
      ]),
    ),
  );
  const { $description, ...rest } = type;
  s.tokens.semantic.type = {
    ...($description && { $description }),
    $extensions: { "open-ds": spec },
    ...Object.fromEntries(Object.entries(rest).filter(([k]) => k !== "$extensions")),
  };
  saveScheme(s);
}
console.log(`Wrote the type scale in ${Object.keys(SEED).length} schemes.`);
