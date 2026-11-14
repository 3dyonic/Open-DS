// The decision reference: every question a scheme answers, by section, with its answer, why,
// the earlier answers it came from, and every design decision that cites it directly: a later
// answer, a usage rule or a component variant. One source for the docs page (Decision reference),
// the MCP tool get_decision_reference and `open-ds decisions`, so they never disagree.
import { questions } from "./schemes.mjs";

// Plain sentences from the data: a lowercase start unless the word is a token, a quote or an
// acronym, and one period at the end.
const lc = (s) => {
  const t = String(s ?? "").trim();
  const w = t.split(/\s/)[0];
  return /[."'“]/.test(w) || (w.length > 1 && w === w.toUpperCase())
    ? t
    : t.charAt(0).toLowerCase() + t.slice(1);
};
const stop = (s) =>
  String(s ?? "")
    .trim()
    .replace(/[.\s]+$/, "");
export const sentence = (s) => (stop(s) ? `${stop(s)}.` : "");
export const lower = lc;
const title = (id) => id[0].toUpperCase() + id.slice(1).replace(/-/g, " ");

// "For a status, use badge with a subtle fill. Don't use a full-strength fill. {why}" Every rule
// says why, so a choice over its alternative is never left unexplained. A situation that
// opens with a preposition reads on its own: "Between page sections, use …".
function ruleText(sit, u) {
  const t = stop(sit.title);
  // The grammar gives the opening when "For a {title}" does not read.
  const lead = sit.lead
    ? sit.lead
    : /^(between|in|on|at|inside|outside|under|above|below|near|with|within|across|around|after|before|during|for)\b/i.test(
          t,
        )
      ? t
      : /^(a|an|the)\b/i.test(t)
        ? `For ${lc(t)}`
        : `For a ${lc(t)}`;
  return `${lead}, use ${sentence(lc(u.use))}${u.not ? ` Don't use ${sentence(lc(u.not))}` : ""}${u.why ? ` ${sentence(u.why)}` : ""}`;
}

export function decisionReference(scheme, g) {
  const qs = questions(g);
  const sits = Object.fromEntries(g.situations.map((s) => [s.id, s]));
  const answer = (id) => scheme.answers.find((a) => a.question === id);
  const label = (id) =>
    qs[id].options.find((o) => o.id === answer(id).option).label;
  const sections = [
    ...g.reasons.map((r) => ({ ...r, group: "Reasons", scope: null })),
    ...g.scopes.map((r) => ({ ...r, group: "Scopes", scope: r.id })),
  ].filter((r) => (r.questions ?? []).length);
  const secOf = {};
  for (const r of sections) for (const q of r.questions) secOf[q.id] = r;
  const inv = new Set((scheme.inventory?.in ?? []).map((c) => c.id));
  const answerText = (q) =>
    `${secOf[q].scope ? `${secOf[q].title} · ` : ""}${qs[q].text} → ${label(q)}`;
  const decided = {};
  const at = (q) => (decided[q] ??= { answers: [], rules: [], variants: [], picks: [] });
  for (const a of scheme.answers)
    for (const q of a.because ?? []) {
      const sec = secOf[a.question];
      at(q).answers.push({
        question: a.question,
        text: answerText(a.question),
        page: sec.scope ? `foundations/${sec.scope}` : null,
        page_title: sec.scope ? sec.title : null,
        section: sec.id,
      });
    }
  for (const u of scheme.usage)
    for (const q of u.because ?? []) {
      const sit = sits[u.situation];
      at(q).rules.push({
        situation: u.situation,
        use: u.use,
        not: u.not ?? null,
        why: u.why ?? null,
        text: ruleText(sit, u),
        page: `foundations/${sit.scope}`,
        page_title: title(sit.scope),
      });
    }
  for (const c of scheme.inventory?.in ?? [])
    for (const [axis, opts] of Object.entries(c.variants ?? {}))
      for (const [variant, d] of Object.entries(opts))
        for (const q of d.because ?? [])
          at(q).variants.push({
            component: c.id,
            axis,
            variant,
            used: !d.not_used,
            text: `${title(c.id)}'s ${variant} ${axis}${d.not_used ? " isn't used" : ""}. ${sentence(d.use ?? d.why)}`.trim(),
            page: inv.has(c.id) ? `components/${c.id}` : null,
            page_title: title(c.id),
          });
  // The theme picks an answer sets: each pick names the answers it follows from, so
  // the reference shows the cascade from the decision's side. The first brand speaks for the scheme.
  const firstBrand = Object.values(scheme.tokens?.brands ?? {})[0];
  const pageOf = (path) =>
    path.startsWith("color.") ? ["foundations/color", "Color"]
    : path.startsWith("type.") ? ["foundations/typography", "Typography"]
    : path.startsWith("radius.") ? ["foundations/shape", "Shape"]
    : path.startsWith("elevation.") ? ["foundations/elevation", "Elevation"]
    : [null, null];
  const walk = (o, p = [], acc = []) => {
    if (!o || typeof o !== "object") return acc;
    if ("$value" in o) return (acc.push([p.join("."), o]), acc);
    for (const [k, v] of Object.entries(o)) if (k[0] !== "$") walk(v, [...p, k], acc);
    return acc;
  };
  for (const mode of ["base", "light", "dark"])
    for (const [path, node] of walk(firstBrand?.theme?.[mode]))
      for (const q of node.$extensions?.["open-ds"]?.because ?? []) {
        if (!qs[q]) continue;
        const sem = path.replace(/\.@$/, "");
        const [page, page_title] = pageOf(sem);
        at(q).picks.push({
          token: sem,
          mode: mode === "base" ? "every mode" : mode,
          pick: String(node.$value).replace(/^\{|\}$/g, ""),
          why: node.$extensions["open-ds"].why ?? null,
          text: `${sem}${mode === "base" ? "" : ` in ${mode}`}: ${node.$extensions["open-ds"].why ?? String(node.$value)}`,
          page,
          page_title,
        });
      }
  const count = (q) => {
    const d = decided[q];
    return d ? d.answers.length + d.rules.length + d.variants.length + d.picks.length : 0;
  };
  return {
    scheme: scheme.id,
    name: scheme.name,
    answers: scheme.answers.length,
    sections: sections.map((r) => ({
      id: r.id,
      title: r.title,
      group: r.group,
      scope: r.scope,
      decisions: r.questions.reduce((t, q) => t + count(q.id), 0),
      questions: r.questions.map((q) => ({
        id: q.id,
        text: q.text,
        answer: label(q.id),
        why: sentence(answer(q.id).why),
        because: (answer(q.id).because ?? []).map((b) => ({
          question: b,
          text: qs[b].text,
          answer: label(b),
          line: answerText(b),
        })),
        decided: decided[q.id] ?? { answers: [], rules: [], variants: [], picks: [] },
        // What the answer must weigh, and how this scheme meets each one.
        ...(q.considers && {
          considers: q.considers.map((k) => ({ ...k, how: answer(q.id).considers?.[k.id] ?? null })),
        }),
      })),
    })),
  };
}

// The reference as plain text, for the CLI. With a question id, only that question.
export function decisionText(ref, only) {
  const out = [];
  for (const s of ref.sections)
    for (const q of s.questions) {
      if (only && q.id !== only) continue;
      out.push(`${s.title} · ${q.text}`, `  ${q.answer}`, `  Why: ${q.why}`);
      if (q.considers)
        out.push("  Considers:", ...q.considers.map((k) => `    - ${k.label}: ${k.how ?? "not answered"}`));
      out.push(
        `  Because of: ${q.because.length ? q.because.map((b) => b.line).join("; ") : "nothing before it, a first answer"}`,
      );
      for (const [k, t] of [
        ["answers", "Answers it led to"],
        ["rules", "Rules it sets"],
        ["variants", "Variants it picks"],
        ["picks", "Theme picks it sets"],
      ])
        if (q.decided[k].length)
          out.push(
            `  ${t} (${q.decided[k].length}):`,
            ...q.decided[k].map((d) => `    - ${d.text}`),
          );
      out.push("");
    }
  return out.join("\n").trimEnd();
}
