// OD-300: the round 1 and 2 decisions the owner (Yonatan) made on 2026-11-12, written into the
// grammar and every scheme. Each section names its In item. Each value it adds or changes gets a
// reason. Idempotent: run it again and nothing changes.
//
//   node scripts/od-300-decisions.mjs
import { grammar as loadGrammar, loadScheme, saveGrammar, saveScheme, schemeIds } from "../cli/src/schemes.mjs";

const g = loadGrammar();
const keyOf = (id) => {
  const k = g.component_keys.find((x) => x.id === id);
  if (!k) throw new Error(`No component key ${id} in the grammar.`);
  return k;
};
const setKey = (id, def, description) => Object.assign(keyOf(id), { default: def, description });

saveGrammar(g);

// ---------- Schemes ----------
for (const id of schemeIds()) {
  const s = loadScheme(id);

  // Item 5: Multi-brand makes two corner sizes, not three.
  if (id === "multi-brand") {
    const a = s.answers.find((x) => x.question === "shape.count");
    a.option = "two";
    a.why = "Two corner sizes: one for controls and badges, and a larger one for containers, as Aster's 4px and 8px corners show.";
    a.because = ["shape.roles", "shape.values"];
  }

  saveScheme(s);
}
console.log("OD-300: grammar and every scheme written.");
