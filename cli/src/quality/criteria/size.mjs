// Size: how many tokens a scheme ships, how many CSS bytes, and the semantic tokens nothing
// reads. Token count and bytes are shown, not gated: a new decision may need new tokens. An unused
// semantic is gated: it is a value no component carries.
import { measureOf, perSchemeOf, sum } from "./measure.mjs";

export const FAMILY = "size";

/** The semantic tokens nothing reads: no token references them and no CSS or component reads their variable. */
export function unusedSemantics(s, ui) {
  const referenced = new Set(s.tokens.referenced);
  const reads = new Set([...(ui?.reads ?? []), ...(s.css?.reads ?? [])]);
  return Object.entries(s.tokens.css)
    .filter(([name, css]) => !referenced.has(name) && !reads.has(css))
    .map(([name]) => name)
    .sort();
}

export function measure(snapshot) {
  const unused = perSchemeOf(snapshot, (s) => unusedSemantics(s, snapshot.ui));
  const counts = perSchemeOf(snapshot, (s) => s.tokens.semantic + s.tokens.component);
  const hasCss = Object.values(snapshot.schemes).every((s) => s.css);
  const bytes = perSchemeOf(snapshot, (s) => s.css?.bytes ?? null);
  return [
    measureOf({
      id: "size.tokens",
      family: FAMILY,
      title: "Semantic and component tokens",
      direction: "report",
      value: sum(counts),
      perScheme: counts,
      details: Object.entries(snapshot.schemes).map(([id, s]) => `${id}: ${s.tokens.semantic} semantic, ${s.tokens.component} component`),
    }),
    measureOf({
      id: "size.css-bytes",
      family: FAMILY,
      title: "Bytes of each scheme's generated tokens.css",
      direction: "report",
      value: hasCss ? sum(bytes) : null,
      perScheme: bytes,
      details: hasCss ? Object.entries(snapshot.schemes).map(([id, s]) => `${id}: ${s.css.bytes} bytes, ${s.css.properties} custom properties`) : ["not present: the tokens were not built"],
    }),
    measureOf({
      id: "size.unused-semantics",
      family: FAMILY,
      title: "Semantic tokens no token, CSS or component reads",
      direction: "down",
      value: sum(Object.fromEntries(Object.entries(unused).map(([id, l]) => [id, l.length]))),
      perScheme: Object.fromEntries(Object.entries(unused).map(([id, l]) => [id, l.length])),
      details: Object.entries(unused).map(([id, l]) => `${id}: ${l.join(", ") || "none"}`),
    }),
  ];
}
