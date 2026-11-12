// Repetition (OD-298): a sentence that several reasons repeat, once token names are taken out, says
// nothing about any one value. Counted per scheme as the extra copies of each repeated sentence.
import { measureOf, perSchemeOf, sum } from "./measure.mjs";

export const FAMILY = "repetition";
/** A sentence shorter than this, once token names are out, is too short to count as a reason. */
export const MIN_WORDS = 4;

// A token name: two or more dotted segments ("type.body", "radius.2", "color.neutral.50").
const TOKEN_NAME = /\b[a-z][a-z0-9-]*(?:\.[a-z0-9_@-]+)+/gi;

/** The sentences of a reason, token names out, lower case, without punctuation at the ends. */
export function sentencesOf(text) {
  return String(text ?? "")
    .replace(TOKEN_NAME, " ")
    .split(/(?<=[.!?;])\s+/)
    .map((s) =>
      s
        .toLowerCase()
        .replace(/[^\p{L}\p{N}%:'×\s-]+/gu, " ")
        .replace(/^[\s:]+|[\s:]+$/g, "")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter((s) => s.split(" ").filter(Boolean).length >= MIN_WORDS);
}

/** The repeated sentences of one scheme's reasons: [{ sentence, count, where }], most copies first. */
export function repeatedSentences(reasons) {
  const seen = new Map();
  for (const r of reasons)
    for (const s of new Set(sentencesOf(r.text))) seen.set(s, [...(seen.get(s) ?? []), r.where]);
  return [...seen]
    .filter(([, where]) => where.length > 1)
    .map(([sentence, where]) => ({ sentence, count: where.length, where }))
    .sort((a, b) => b.count - a.count || a.sentence.localeCompare(b.sentence));
}

export function measure(snapshot) {
  const repeated = perSchemeOf(snapshot, (s) => repeatedSentences(s.reasons));
  const extra = Object.fromEntries(Object.entries(repeated).map(([id, list]) => [id, list.reduce((n, r) => n + r.count - 1, 0)]));
  return [
    measureOf({
      id: "repetition.repeated-sentences",
      family: FAMILY,
      title: "Extra copies of sentences repeated across reasons, token names taken out",
      direction: "down",
      value: sum(extra),
      perScheme: extra,
      details: Object.entries(repeated).flatMap(([id, list]) => list.map((r) => `${id}: ×${r.count} "${r.sentence}" (${r.where.slice(0, 3).join("; ")}${r.where.length > 3 ? "; …" : ""})`)),
    }),
  ];
}
