// OD-286: two shape primitives replace radius.full and radius.999. radius.round (50%) makes a circle
// of a square: avatars, radio dots, thumbs, round buttons. radius.pill (calc(infinity * 1px)) makes a
// capsule of any box: tracks, progress, the scroll thumb, the drawer handle and pill controls.
// The semantic radius.round goes: a shape that every scheme sets the same is a constant, so its
// component keys read the primitive. radius.container becomes radius.surface; the old name stays as
// a deprecated alias for one minor release. Idempotent: a second run changes nothing.
import { readFileSync, writeFileSync } from "node:fs";

const SCHEMES = ["accessible-first", "brand-expressive", "content-first", "dense-data", "multi-brand"];
const PILL = new Set(["drawer/handle/radius", "drawer/radius", "progress/radius", "scroll-area/thumb/radius", "slider/track/radius", "switch/radius"]);
const ROUND = new Set([
  "avatar/radius", "avatar/fallback/radius", "avatar/badge/radius", "avatar/group/count/radius",
  "carousel/previous/radius", "carousel/next/radius", "radio-group/item/radius", "slider/thumb/radius", "switch/thumb/radius",
]);
const SHAPES = {
  round: { $type: "dimension", $value: "50%", $description: "A circle of a square: avatars, radio dots, thumbs and round buttons." },
  pill: { $type: "dimension", $value: "calc(infinity * 1px)", $description: "A capsule of any box: tracks, progress, the scroll thumb and pill controls." },
};

// Rename a key in place, so the file keeps its order.
const renameKey = (o, from, to) =>
  Object.fromEntries(Object.entries(o).map(([k, v]) => [k === from ? to : k, v]));

const swap = (text) =>
  text
    .replaceAll("{radius.999}", "{radius.pill}")
    .replaceAll("radius.999:", "radius.pill:")
    .replaceAll("{theme.radius.container}", "{theme.radius.surface}")
    .replaceAll("{radius.container}", "{radius.surface}");

function scheme(name) {
  const file = `schemes/${name}.json`;
  const t = JSON.parse(swap(readFileSync(file, "utf8")));
  const tok = t.tokens;
  // Primitives: the two shapes, in place of full and 999.
  const { full, 999: nines, ...steps } = tok.primitive.radius;
  tok.primitive.radius = { ...steps, ...SHAPES };
  // Semantics: surface in place of container, then the deprecated alias; no semantic round.
  // A second run finds surface already there and the alias in container: it renames nothing.
  let sem = tok.semantic.radius.surface ? { ...tok.semantic.radius } : renameKey(tok.semantic.radius, "container", "surface");
  if (sem.surface.$value !== "{theme.radius.surface}")
    sem.surface = { $type: "dimension", $value: "{theme.radius.surface}", $description: "Corner of cards, menus and dialogs." };
  delete sem.round;
  sem.container = {
    $type: "dimension",
    $value: "{radius.surface}",
    $description: "Deprecated: use radius.surface.",
    $deprecated: "Use radius.surface. Removed in the next minor release.",
  };
  tok.semantic.radius = sem;
  // Each brand's theme, in every mode.
  for (const brand of Object.values(tok.brands ?? {}))
    for (const mode of Object.values(brand.theme ?? {}))
      if (mode.radius?.container && !mode.radius.surface) mode.radius = renameKey(mode.radius, "container", "surface");
  // Component keys that read the old round now read the shape they draw.
  const walk = (o, path) => {
    for (const [k, v] of Object.entries(o)) {
      if (!v || typeof v !== "object") continue;
      const p = [...path, k];
      if (v.$value === "{radius.round}") {
        const id = p.join("/");
        if (PILL.has(id)) v.$value = "{radius.pill}";
        else if (ROUND.has(id)) v.$value = "{radius.round}";
        else throw new Error(`${name}: ${id} reads radius.round and is in neither list. Add it to PILL or ROUND.`);
      } else walk(v, p);
    }
  };
  walk(tok.component, []);
  writeFileSync(file, JSON.stringify(t, null, 2) + "\n");
}

// The grammar does not round-trip through JSON.stringify, so its edits are text edits.
function grammar() {
  const file = "schemes/grammar.json";
  let s = readFileSync(file, "utf8").replaceAll('"radius.container"', '"radius.surface"');
  for (const id of PILL) {
    const re = new RegExp(`("id": "${id.replaceAll("/", "\\/")}",[\\s\\S]*?"default": )"radius\\.round"`);
    s = s.replace(re, '$1"radius.pill"');
  }
  writeFileSync(file, s);
  const g = JSON.parse(s);
  for (const k of g.component_keys)
    if (PILL.has(k.id) && k.default !== "radius.pill") throw new Error(`grammar: ${k.id} still reads ${k.default}`);
}

for (const n of SCHEMES) scheme(n);
grammar();
console.log("OD-286 radius: 5 schemes and the grammar updated.");
