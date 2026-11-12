// Say each reason once (OD-297). A theme pick that repeats the reason of the same token's pick in an
// earlier brand or mode, with the same value, points to that pick instead of copying its sentences.
// Picks the contrast writer generates (scripts/theme-reasons.mjs) are left to it.
//
//   node scripts/reason-pointers.mjs          rewrite every scheme
import { fileURLToPath } from "node:url";
import { grammar, loadScheme, saveScheme, schemeIds } from "../cli/src/schemes.mjs";
import { propertyOf } from "../cli/src/trace.mjs";

const g = grammar();

const MODES = ["base", "light", "dark"];
// A token name (two or more dotted segments) says nothing about the sentence around it.
const TOKEN_NAME = /\b[a-z][a-z0-9-]*(?:\.[a-z0-9_@-]+)+/gi;

/** The sentences of a reason, token names out, lower case: what two reasons can share. */
export function sentencesOf(text) {
  return String(text ?? "")
    .replace(TOKEN_NAME, " ")
    .split(/(?<=[.!?;])\s+/)
    .map((s) =>
      s
        .toLowerCase()
        .replace(/[^\p{L}\p{N}%:'×\s-]+/gu, " ")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter((s) => s.split(" ").length >= 4);
}

const leaves = (node, path = []) =>
  !node || typeof node !== "object"
    ? []
    : "$value" in node
      ? [[path.join("."), node]]
      : Object.entries(node).flatMap(([k, v]) => (k.startsWith("$") ? [] : leaves(v, [...path, k])));

const count = (list) => ["no", "one", "two", "three", "four", "five", "six"][list.length] ?? String(list.length);
const capital = (w) => w[0].toUpperCase() + w.slice(1);
// "color.surface.raised" reads "raised surface"; "elevation.card" reads "card elevation".
const wordsOf = (path) => path.replace(/^color\./, "").replace(/\.@$/, "").split(".").reverse().join(" ").replace(/-/g, " ");

/**
 * The pointer reason of one pick, in the reason form: the anchor it takes, the job it keeps (a job of
 * its grammar property that the anchor's reason names), and why the two places share the step.
 */
function pointer({ step, path, brand, mode, anchor, brands, jobs }) {
  const many = brands.length > 1;
  const place = (b, m) => `${many ? `${capital(b)}'s ` : "the "}${m === "base" ? "" : `${m} `}`;
  const owner = `${place(brand, mode)}${wordsOf(path)}`;
  const from = `${place(anchor.brand, anchor.mode)}pick`;
  const job = jobs.find((j) => new RegExp(`(^|[^a-z])${j}([^a-z]|$)`, "i").test(anchor.why));
  const sameBrand = anchor.brand === brand;
  const sameMode = anchor.mode === mode;
  const as = sameMode
    ? { text: `the ${count(brands)} brands share this step (business.q2)`, because: ["business.q2"] }
    : sameBrand
      ? { text: `the step reads the same in ${mode} (theming.values)`, because: ["theming.values"] }
      : { text: `the ${count(brands)} brands share this step in light and dark (business.q2, theming.values)`, because: ["business.q2", "theming.values"] };
  return {
    why: `${step}: We use ${from} for ${owner} in order to keep ${job ? `the ${job} ` : "what "}it sets, and the step does this by the same means, so ${owner} and ${from} never differ, because ${as.text}.`,
    because: as.because,
  };
}

/** Rewrite the repeated picks of one scheme in place. Returns how many it rewrote. */
export function pointRepeats(scheme) {
  const brands = Object.keys(scheme.tokens.brands);
  const seen = new Map(); // path → [{ brand, mode, value, sentences }]
  let rewritten = 0;
  for (const brand of brands)
    for (const mode of MODES)
      for (const [path, node] of leaves(scheme.tokens.brands[brand].theme[mode])) {
        const od = node.$extensions?.["open-ds"];
        if (!od?.why) continue;
        const value = JSON.stringify(node.$value);
        const sentences = new Set(sentencesOf(od.why));
        const earlier = seen.get(path) ?? [];
        if (!od.generated) {
          const shares = earlier.filter((e) => e.value === value && [...e.sentences].some((s) => sentences.has(s)));
          const anchor =
            shares.find((e) => e.mode === mode) ?? shares.find((e) => e.brand === brand) ?? shares[0];
          if (anchor) {
            const step = typeof node.$value === "string" ? node.$value.replace(/^\{(color\.)?|\}$/g, "") : JSON.stringify(node.$value);
            const p = pointer({ step, path, brand, mode, anchor, brands, jobs: (propertyOf(g, path)?.jobs ?? []).map((j) => j.id) });
            od.why = p.why;
            od.because = p.because;
            rewritten++;
            continue;
          }
        }
        earlier.push({ brand, mode, value, sentences, why: od.why });
        seen.set(path, earlier);
      }
  return rewritten;
}

/**
 * Say each mechanism once per token group (OD-298 repetition). Where tokens of one group (space.gap,
 * space.inset, size.control) repeat a sentence of the group's first token, the later ones drop it and
 * their first sentence points to the first token instead. The pointer sits inside a sentence that names
 * the token's own value, so it is not a repeated sentence itself.
 */
export function pointGroupMechanisms(scheme) {
  const groups = ["space.gap", "space.inset", "size.control"];
  const split = (why) => why.split(/(?<=\.)\s+(?=[A-Z])/);
  let rewritten = 0;
  for (const group of groups) {
    const node = group.split(".").reduce((n, k) => n?.[k], scheme.tokens.semantic);
    if (!node) continue;
    const keys = Object.keys(node).filter((k) => !k.startsWith("$") && node[k]?.$extensions?.["open-ds"]?.why);
    if (keys.length < 2) continue;
    const anchor = `${group}.${keys[0]}`;
    const anchorSentences = new Set(split(node[keys[0]].$extensions["open-ds"].why).slice(1));
    for (const k of keys.slice(1)) {
      const od = node[k].$extensions["open-ds"];
      const parts = split(od.why);
      const kept = parts.filter((s, i) => i === 0 || !anchorSentences.has(s));
      if (kept.length === parts.length) continue;
      kept[0] = kept[0].replace(/\.$/, `, and it does this by the means stated in the reason of ${anchor}.`);
      od.why = kept.join(" ");
      rewritten++;
    }
  }
  return rewritten;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const id of schemeIds()) {
    const s = loadScheme(id);
    const n = pointRepeats(s);
    const m = pointGroupMechanisms(s);
    saveScheme(s);
    console.log(`${id}: ${n} picks point to an earlier pick; ${m} group tokens point to their group's mechanism.`);
  }
}
