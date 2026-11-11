// OD-286: radius.element, a moderate corner for boxes that grow with their content: list items,
// accordion rows, text areas, calendars, attachments, skeletons and media. Where a theme's control
// corner is a pill, a box that grows past one line turns into an oval, so element takes a moderate 12px
// there; everywhere else it is the control corner, and nothing changes. Idempotent.
import { formatGrammar, grammar as loadGrammar, loadScheme, saveGrammar, saveScheme } from "../cli/src/schemes.mjs";

const SCHEMES = ["accessible-first", "brand-expressive", "content-first", "dense-data", "multi-brand"];
// The keys on boxes that grow with their content; buttons, inputs, toggles and badges keep the control corner.
const BLOCK = [
  "accordion/trigger/radius",
  "item/radius",
  "item/media/image/radius",
  "textarea/radius",
  "calendar/radius",
  "attachment/radius",
  "attachment/media/radius",
  "skeleton/radius",
  "alert-dialog/media/radius",
];
const MODERATE = { $type: "dimension", $value: "0.75rem" };
const WHY_PILL = "radius.12: a moderate corner, so a box that grows with its content stays a box, not an oval.";
const WHY_SAME = (ref) => `${ref}: the control corner; it is not a pill, so a growing box keeps it.`;

const get = (o, path) => path.split("/").reduce((n, k) => n?.[k], o);

function scheme(name) {
  const t = loadScheme(name);
  const tok = t.tokens;
  let needs12 = false;
  for (const brand of Object.values(tok.brands ?? {}))
    for (const mode of Object.values(brand.theme ?? {})) {
      const r = mode.radius;
      if (!r?.control || r.element) continue;
      const pill = r.control.$value === "{radius.pill}";
      if (pill) needs12 = true;
      const ref = pill ? "{radius.12}" : r.control.$value;
      // Inserted after option, so the theme reads control, badge, option, element, surface.
      const entry = {
        $type: "dimension",
        $value: ref,
        $extensions: { "open-ds": { why: pill ? WHY_PILL : WHY_SAME(ref.slice(1, -1)), because: ["shape.roles", "shape.values"] } },
      };
      mode.radius = Object.fromEntries(Object.entries(r).flatMap(([k, v]) => (k === "option" ? [[k, v], ["element", entry]] : [[k, v]])));
    }
  if (needs12 && !tok.primitive.radius["12"]) {
    // Kept in step order: the number keys first, then the shapes.
    const { round, pill, ...rest } = tok.primitive.radius;
    tok.primitive.radius = { ...rest, 12: MODERATE, round, pill };
  }
  const sem = tok.semantic.radius;
  if (!sem.element)
    tok.semantic.radius = Object.fromEntries(
      Object.entries(sem).flatMap(([k, v]) =>
        k === "option"
          ? [
              [k, v],
              ["element", { $type: "dimension", $value: "{theme.radius.element}", $description: "Corner of an element that holds content and can grow past one line: a list item, an accordion row, a text area, a calendar, an attachment, a skeleton or media." }],
            ]
          : [[k, v]],
      ),
    );
  for (const id of BLOCK) {
    const k = get(tok.component, id);
    if (!k) throw new Error(`${name}: no component key ${id}`);
    k.$value = "{radius.element}";
  }
  saveScheme(t);
}

function grammar() {
  // The edits are text edits on the grammar's one layout (formatGrammar).
  let s = formatGrammar(loadGrammar());
  for (const id of BLOCK) {
    const re = new RegExp(`("id": "${id.replaceAll("/", "\\/")}",[^}]*?"default": )"radius\\.[a-z]+"`);
    if (!re.test(s)) throw new Error(`grammar: ${id} has no default to change`);
    s = s.replace(re, '$1"radius.element"');
  }
  saveGrammar(JSON.parse(s));
  const g = JSON.parse(s);
  for (const k of g.component_keys)
    if (BLOCK.includes(k.id) && k.default !== "radius.element") throw new Error(`grammar: ${k.id} reads ${k.default}`);
}

for (const n of SCHEMES) scheme(n);
grammar();
console.log("OD-286 radius.element: 5 schemes and the grammar updated.");
