// One change at a time to a stored scheme, for the blast radius (OD-298). Each perturbation names what
// it changes and returns a changed copy of the stored file; the caller reloads it with the ref's own
// loader and compares what moved. Each anchor also says what is recorded as derived from it (derives),
// apart from the reference chain the change travels along, so a hard-coded copy shows as an orphan
// and a stray reference as a hidden coupling. Pure: no file access, the input is never changed.
import { fromLch, lch, scale as rampScale } from "../ramps.mjs";
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

// Where a semantic's pick is stored: the semantic itself when it names a primitive or holds a raw
// value, or each brand's theme pick when it names the theme. [{ path: [..keys from the stored root],
// ref }]; ref is null for a raw value.
function pickNodes(stored, semantic) {
  const node = at(stored.tokens?.semantic, semantic);
  if (!node || typeof node !== "object" || !("$value" in node)) return [];
  const ref = typeof node.$value === "string" && node.$value.match(REF)?.[1];
  if (!ref || !ref.startsWith("theme.")) return [{ path: ["tokens", "semantic", ...semantic.split(".")], ref: ref || null }];
  const key = ref.slice("theme.".length);
  const out = [];
  for (const [brand, def] of Object.entries(stored.tokens?.brands ?? {}))
    for (const part of ["base", "light", "dark"]) {
      const pick = at(def.theme?.[part], key);
      if (!pick || typeof pick !== "object" || !("$value" in pick)) continue;
      const r = typeof pick.$value === "string" && pick.$value.match(REF)?.[1];
      out.push({ path: ["tokens", "brands", brand, "theme", part, ...key.split(".")], ref: r || null });
    }
  return out;
}

// Re-point a semantic's pick to the next step on its scale: the decision moves, the options stay. A
// pick that holds a raw value cannot follow: it stays, and the anchor's own token shows as an orphan.
function repoint(stored, id, semantic) {
  const all = pickNodes(stored, semantic);
  if (!all.length) return { kind: "anchor", id, notPresent: `the scheme stores no ${semantic}` };
  const raw = all.filter((n) => !n.ref);
  const nodes = all
    .filter((n) => n.ref)
    .map((n) => {
      const group = n.ref.split(".").slice(0, -1).join(".");
      const to = neighbour(at(stored.tokens?.primitive, group), n.ref.split(".").at(-1));
      return to ? { ...n, to: `${group}.${to}` } : null;
    })
    .filter(Boolean);
  if (!nodes.length && !raw.length) return { kind: "anchor", id, notPresent: `${semantic} has no stored pick on a scale with a next step` };
  const change = [
    ...new Set(nodes.map((n) => `${n.ref} → ${n.to}`)),
    ...raw.map((n) => `${n.path.slice(n.path[1] === "brands" ? 2 : 1).join(".")} holds a raw value (${JSON.stringify(at(stored, n.path.join(".")).$value)}), so it cannot move`),
  ].join(", ");
  return {
    kind: "anchor",
    id,
    change,
    derives: { tokens: [semantic], inputs: [semantic] },
    apply: (s) => {
      const next = structuredClone(s);
      for (const n of nodes) at(next, n.path.join(".")).$value = `{${n.to}}`;
      return next;
    },
  };
}

// The key turned 40° in hue, and every step the generator made from the old key made again from the new
// one, as the scheme writer does. A step stored by hand (not the generator's output) stays.
function turnKey(stored, hue, modes, canvas, generateScale) {
  const turn = (k) => {
    const [L, C, H] = lch(k);
    return fromLch(L, C, (H + 40) % 360);
  };
  const spec = stored.tokens.primitive.color[hue].$extensions["open-ds"];
  const regenerable = (m) => m === "light" || /^#[0-9a-f]{6}$/i.test(canvas ?? "");
  return {
    change: modes.map((m) => `${hue} ${m} key ${spec[m].key} → ${turn(spec[m].key)}`).join(", "),
    apply: (s) => {
      const next = structuredClone(s);
      const group = next.tokens.primitive.color[hue];
      const x = group.$extensions["open-ds"];
      for (const m of modes) {
        const was = regenerable(m) ? generateScale(x[m], m, canvas) : {};
        x[m].key = turn(x[m].key);
        const now = regenerable(m) ? generateScale(x[m], m, canvas) : {};
        for (const [step, hex] of Object.entries(was)) {
          const t = group[m]?.[step];
          if (t && String(t.$value).toUpperCase() === String(hex).toUpperCase()) t.$value = now[step];
        }
      }
      return next;
    },
  };
}

/**
 * The anchors a scheme's values hang from, each moved once: the base step (the 4px space step), the
 * key color of the primary action's hue, the default control height and the default radius.
 * primaryHue: the hue of the primary action's color scale. darkCanvas: the dark canvas the dark scales
 * are generated over. colorScales: each step of the loaded scheme with the generator's output for it
 * ({ hue, mode, step, stored, generated }), the record of what the key generates. generateScale: the
 * ref's own generator.
 * [{ kind, id, change, derives, apply }] or { kind, id, notPresent } when the scheme stores no such anchor.
 * derives is what the scheme records as derived from the anchor: { tokens } named outright, { family,
 * px } every token of a family at the anchor's value, { stepPaths, steps } the steps the key generates
 * (a token that points at one, or copies its value), and inputs, where the relations' links start.
 */
export function anchorPerturbations(stored, { primaryHue = null, darkCanvas = null, colorScales = [], generateScale = rampScale } = {}) {
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
      // Spacing at the base step is the base step; the spacing map multiplies it.
      derives: { family: ["space.", "component-spacing-map."], px: 4, inputs: [`space.${step}`] },
      apply: (s) => {
        const next = structuredClone(s);
        next.tokens.primitive.space[step].$value = to;
        return next;
      },
    });
  }

  const hue = primaryHue;
  const group = hue && stored.tokens?.primitive?.color?.[hue];
  const spec = group?.$extensions?.["open-ds"];
  if (!spec?.light?.key) out.push({ kind: "anchor", id: "key-color", notPresent: hue ? `the ${hue} hue records no key color` : "the primary action ends on no color scale" });
  else {
    const modes = ["light", "dark"].filter((m) => spec[m]?.key);
    // The generated scale is the record: each step of the hue that is the generator's output from its key.
    // A step stored by hand overrides the generator, so nothing records it as following the key.
    const generated = colorScales.filter((c) => c.hue === hue && String(c.stored).toUpperCase() === String(c.generated).toUpperCase());
    out.push({
      kind: "anchor",
      id: "key-color",
      hue,
      ...turnKey(stored, hue, modes, darkCanvas, generateScale),
      derives: { stepPaths: generated.map((c) => `color.${hue}.${c.mode}.${c.step}`), steps: [...new Set(generated.map((c) => String(c.stored).toUpperCase()))], inputs: [] },
    });
  }

  // OD-301: the control scale is a record, and the loader generates the heights from it. Move the record's
  // default one step; with no record, move the stored pick as before.
  const controlScale = stored.tokens?.semantic?.size?.$extensions?.["open-ds"];
  if (Number.isFinite(controlScale?.default) && Number.isFinite(controlScale?.step))
    out.push({
      kind: "anchor",
      id: "control-height",
      change: `the control scale's default: ${controlScale.default}px → ${controlScale.default + controlScale.step}px`,
      // The record generates every control height and the row, so each one follows the default.
      derives: { tokens: ["size.control.default", "size.control.compact", "size.control.large", "size.row"], inputs: ["size.control.default"] },
      apply: (s) => {
        const next = structuredClone(s);
        next.tokens.semantic.size.$extensions["open-ds"].default += controlScale.step;
        return next;
      },
    });
  else out.push(repoint(stored, "control-height", "size.control.default"));
  out.push(repoint(stored, "default-radius", "radius.control"));
  return out;
}
