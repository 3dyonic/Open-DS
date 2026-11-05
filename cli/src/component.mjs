// One component in one design system (OD-185): the reference (what the component and each variant
// are for, the same in every design system, from the grammar's catalogue) next to this scheme's
// decisions (whether it carries the component, how it uses each variant, or that it does not).
// The CLI's component and context commands and the MCP's get_component and get_context use it.

import { assetRoots, grammar, loadScheme } from "./schemes.mjs";
import { componentApi } from "./lands.mjs";
import { componentLedger } from "./gaps.mjs";

/** The reference and this scheme's decisions for one catalogue component, or null if there is none. */
export function componentGuide(
  schemeId,
  id,
  roots = assetRoots(),
  g = grammar(roots),
) {
  const item = g.catalogue.items.find((i) => i.id === id);
  if (!item) return null;
  const scheme = loadScheme(schemeId, roots);
  const carried = scheme.inventory.in.find((x) => x.id === id);
  const left = scheme.inventory.out.find((x) => x.id === id);
  const titles = Object.fromEntries(g.situations.map((s) => [s.id, s.title]));

  // Every variant in the reference, with what this scheme decided for it.
  const variants = Object.entries(item.variants ?? {}).flatMap(([axis, list]) =>
    list.map((v) => {
      const here = carried?.variants?.[axis]?.[v.id] ?? null;
      return {
        axis,
        id: v.id,
        reference: {
          overview: v.overview,
          apply_when: v.apply_when,
          not_when: v.not_when,
        },
        here,
      };
    }),
  );

  // The scheme's rules for this component: the situations the reference names, and every rule whose
  // uses name it. Rules without uses fall back to the situations list only.
  const named = new Set(item.situations ?? []);
  const rules = scheme.usage
    .filter(
      (u) =>
        named.has(u.situation) ||
        (u.uses ?? []).some((x) => x.component === id),
    )
    .map((u) => ({
      situation: u.situation,
      title: titles[u.situation],
      use: u.use,
      not: u.not,
      why: u.why,
      ...(u.uses && { uses: u.uses }),
      ...(u.example && { example: u.example }),
    }));

  return {
    component: id,
    scheme: scheme.id,
    family: item.family,
    carried: Boolean(carried),
    why: carried?.why ?? left?.why ?? null,
    // A left-out component (OD-212): what to use instead, each kept by this scheme, and the answers
    // the decision rests on, as the docs and get_inventory give them.
    ...(left && {
      instead: (left.instead ?? []).map((x) => ({
        id: x,
        what: g.catalogue.items.find((i) => i.id === x)?.description ?? "",
      })),
      because: left.because ?? [],
    }),
    reference: item.overview
      ? {
          overview: item.overview,
          apply_when: item.apply_when,
          not_when: item.not_when,
          vs: item.vs ?? [],
          accessibility: item.accessibility ?? [],
          keyboard: item.keyboard ?? [],
          source: item.source,
        }
      : { overview: item.description },
    variants,
    rules,
    // Its token API (OD-234): every token it reads, what each aliases, and its value in every theme.
    tokens: componentApi(scheme, id, roots),
    // Its gaps (OD-243): where its decision trace breaks. Where a gap stands, the scheme has no answer
    // yet; say so instead of inventing one.
    gaps: componentLedger(scheme, g, roots, id),
    // Its anatomy is its own tool (OD-229): get_anatomy, or open-ds anatomy. Here only whether the
    // parts people see are described yet.
    anatomy: {
      parts_layer: Boolean(item.anatomy),
      see: `get_anatomy ${id}`,
    },
  };
}

/** The answers that follow from one answer, directly or through others: what a change to it would
 * reopen. The MCP's what_moves and the docs' "What moves" section both use it. */
export function followers(scheme, questionId) {
  const follows = new Set([questionId]);
  for (let grew = true; grew; ) {
    grew = false;
    for (const a of scheme.answers)
      if (!follows.has(a.question) && a.because.some((b) => follows.has(b))) {
        follows.add(a.question);
        grew = true;
      }
  }
  follows.delete(questionId);
  return [...follows];
}

/** The guide as plain text, for people at a terminal. */
export function componentText(guide) {
  const lines = [];
  const r = guide.reference;
  lines.push(
    `${guide.component} (${guide.family}) in ${guide.scheme}: ${guide.carried ? "carried" : "not carried"}. ${guide.why ?? ""}`.trim(),
  );
  if (guide.instead?.length)
    lines.push(
      `Use instead in ${guide.scheme}: ${guide.instead.map((x) => x.id).join(", ")}. Because: ${guide.because.join(", ")}.`,
    );
  lines.push("", `What it is: ${r.overview}`);
  if (r.apply_when) lines.push(`Use it when: ${r.apply_when}`);
  if (r.not_when) lines.push(`Not when: ${r.not_when}`);
  for (const v of r.vs ?? []) lines.push(`  Instead, ${v.id}: ${v.why}`);
  if (guide.variants.length) {
    lines.push("", "Variants:");
    let axis = "";
    for (const v of guide.variants) {
      if (v.axis !== axis) lines.push(`  ${(axis = v.axis)}`);
      const here = !v.here
        ? "not decided"
        : v.here.not_used
          ? `not used: ${v.here.why}`
          : v.here.use;
      lines.push(`    ${v.id}: ${v.reference.overview}`, `      Here: ${here}`);
    }
  }
  if (guide.rules.length) {
    lines.push("", "When to use it here:");
    for (const u of guide.rules) {
      const use = /^not used/i.test(u.use) ? u.use : `use ${u.use}`;
      lines.push(`  ${u.title}: ${use}. Not: ${u.not}. ${u.why}`);
    }
  }
  if (guide.tokens?.length) {
    lines.push("", "Tokens it reads:");
    for (const t of guide.tokens) {
      const vals = [
        ...new Set(
          Object.values(t.values).map(
            (v) =>
              `${v.primitive} ${typeof v.value === "object" ? JSON.stringify(v.value) : v.value}`,
          ),
        ),
      ];
      lines.push(
        `  ${t.token}${t.aliases ? ` → ${t.aliases}` : ""}  (${t.css})${t.changes_with_theme ? "  changes with theme" : ""}`,
        `      ${vals.join(" | ")}`,
      );
    }
  }
  lines.push("", `Anatomy: open-ds anatomy ${guide.scheme} ${guide.component}${guide.anatomy?.parts_layer ? "" : " (its parts layer isn't written yet)"}.`);
  if (guide.gaps?.length) {
    lines.push("", `Gaps (${guide.gaps.length}): where the decision trace breaks. No answer here yet.`);
    for (const x of guide.gaps) lines.push(`  [${x.kind}] ${x.says}${x.ticket ? ` (${x.ticket})` : ""}`);
  }
  if (r.source)
    lines.push(
      "",
      `Reference: ${r.source.name}${r.source.id ? ` (${r.source.id})` : ""}, ${r.source.license}.`,
    );
  return lines.join("\n");
}
