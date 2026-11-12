// One change at a time to a stored scheme, for the blast radius (OD-298). Each perturbation names what
// it changes and returns a changed copy of the stored file; the caller reloads it with the ref's own
// loader and compares what moved. Pure: no file access, the input is never changed.
import { fromLch, lch } from "../ramps.mjs";
import { px } from "./values.mjs";

const REF = /^\{([^}]+)\}$/;
const at = (tree, path) => path.split(".").reduce((n, k) => (n && typeof n === "object" ? n[k] : undefined), tree);

/** Each answer moved to the next option of its question: [{ kind, id, change, apply }]. */
export function answerPerturbations(stored, grammar) {
  const asked = new Map([...(grammar.reasons ?? []), ...(grammar.scopes ?? [])].flatMap((g) => g.questions.map((q) => [q.id, q])));
  const out = [];
  (stored.answers ?? []).forEach((a, i) => {
    const options = asked.get(a.question)?.options?.map((o) => o.id) ?? [];
    if (options.length < 2) return;
    const to = options[(options.indexOf(a.option) + 1) % options.length];
    out.push({
      kind: "answer",
      id: a.question,
      change: `${a.option} → ${to}`,
      apply: (s) => {
        const next = structuredClone(s);
        next.answers[i] = { ...next.answers[i], option: to };
        return next;
      },
    });
  });
  return out;
}

// The step next to `step` in a primitive group, by size: the next larger, else the next smaller.
function neighbour(group, step) {
  const steps = Object.entries(group ?? {})
    .filter(([k, v]) => !k.startsWith("$") && v && typeof v === "object" && "$value" in v && px(v.$value) !== null)
    .map(([k, v]) => [k, px(v.$value)])
    .sort((a, b) => a[1] - b[1]);
  const i = steps.findIndex(([k]) => k === step);
  if (i < 0) return null;
  return steps[i + 1]?.[0] ?? steps[i - 1]?.[0] ?? null;
}

// Where a semantic's pick is stored: the semantic itself when it names a primitive, or each brand's
// theme pick when it names the theme. [{ path: [..keys from the stored root], ref }]
function pickNodes(stored, semantic) {
  const node = at(stored.tokens?.semantic, semantic);
  const ref = typeof node?.$value === "string" && node.$value.match(REF)?.[1];
  if (!ref) return [];
  if (!ref.startsWith("theme.")) return [{ path: ["tokens", "semantic", ...semantic.split(".")], ref }];
  const key = ref.slice("theme.".length);
  const out = [];
  for (const [brand, def] of Object.entries(stored.tokens?.brands ?? {}))
    for (const part of ["base", "light", "dark"]) {
      const pick = at(def.theme?.[part], key);
      const r = typeof pick?.$value === "string" && pick.$value.match(REF)?.[1];
      if (r) out.push({ path: ["tokens", "brands", brand, "theme", part, ...key.split(".")], ref: r });
    }
  return out;
}

// Re-point a semantic's pick to the next step on its scale: the decision moves, the options stay.
function repoint(stored, id, semantic) {
  const nodes = pickNodes(stored, semantic)
    .map((n) => {
      const group = n.ref.split(".").slice(0, -1).join(".");
      const to = neighbour(at(stored.tokens?.primitive, group), n.ref.split(".").at(-1));
      return to ? { ...n, to: `${group}.${to}` } : null;
    })
    .filter(Boolean);
  if (!nodes.length) return { kind: "anchor", id, notPresent: `${semantic} has no stored pick on a scale with a next step` };
  const theme = at(stored.tokens?.semantic, semantic).$value.match(REF)[1];
  return {
    kind: "anchor",
    id,
    change: [...new Set(nodes.map((n) => `${n.ref} → ${n.to}`))].join(", "),
    nodes: [semantic, ...(theme.startsWith("theme.") ? [theme] : [])],
    apply: (s) => {
      const next = structuredClone(s);
      for (const n of nodes) at(next, n.path.join(".")).$value = `{${n.to}}`;
      return next;
    },
  };
}

/**
 * The anchors a scheme's values hang from, each moved once: the base step (the 4px space step), the
 * key color of the primary action's hue, the default control height and the default radius.
 * first: the resolved chains of the first theme, to find the primary action's hue.
 * [{ kind, id, change, nodes, hue?, apply }] or { kind, id, notPresent } when the scheme stores no such anchor.
 */
export function anchorPerturbations(stored, { firstChains = {} } = {}) {
  const out = [];
  const space = stored.tokens?.primitive?.space ?? {};
  const base = Object.entries(space).find(([k, v]) => !k.startsWith("$") && px(v?.$value) === 4);
  if (!base) out.push({ kind: "anchor", id: "base-step", notPresent: "no stored 4px space step" });
  else {
    const [step, token] = base;
    const unit = /rem$/.test(token.$value) ? "rem" : "px";
    const to = unit === "rem" ? `${5 / 16}rem` : "5px";
    out.push({
      kind: "anchor",
      id: "base-step",
      change: `space.${step}: ${token.$value} → ${to}`,
      nodes: [`space.${step}`],
      apply: (s) => {
        const next = structuredClone(s);
        next.tokens.primitive.space[step].$value = to;
        return next;
      },
    });
  }

  const end = firstChains["color.action.primary"]?.end ?? "";
  const hue = end.match(/^color\.([a-z0-9-]+)\.(light|dark)\.[^.]+$/)?.[1];
  const spec = hue && stored.tokens?.primitive?.color?.[hue]?.$extensions?.["open-ds"];
  if (!spec?.light?.key) out.push({ kind: "anchor", id: "key-color", notPresent: hue ? `the ${hue} hue records no key color` : "the primary action ends on no color scale" });
  else {
    const turn = (k) => {
      const [L, C, H] = lch(k);
      return fromLch(L, C, (H + 40) % 360);
    };
    const modes = ["light", "dark"].filter((m) => spec[m]?.key);
    out.push({
      kind: "anchor",
      id: "key-color",
      hue,
      change: modes.map((m) => `${hue} ${m} key ${spec[m].key} → ${turn(spec[m].key)}`).join(", "),
      nodes: [`color.${hue}`],
      apply: (s) => {
        const next = structuredClone(s);
        const x = next.tokens.primitive.color[hue].$extensions["open-ds"];
        for (const m of modes) x[m].key = turn(x[m].key);
        return next;
      },
    });
  }

  out.push(repoint(stored, "control-height", "size.control.default"));
  out.push(repoint(stored, "default-radius", "radius.control"));
  return out;
}
