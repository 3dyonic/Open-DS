// The tools behind the skills: each one does a step that a skill would otherwise judge by
// eye. One engine for the CLI and the MCP server, like the rest of the package.
//   checkUi    review and build: raw values, components the scheme does not carry, unused variants,
//              button labels too long for one line
//   checkCopy  write: text against the scheme's voice and the rule for its situation
//   planChange change: the edits a changed answer or primitive needs, and the contrast it keeps
//   findToken  build: the token or component key for an intent, with its guidance
//   fitScheme  choose: the schemes ranked against a product description, with the reasons

import { spacingGuide } from "./spacing-map.mjs";
import { tokenIndex, aliasChain } from "./lands.mjs";
import { followers } from "./component.mjs";
import { questions, when } from "./schemes.mjs";
import { themeTokens } from "./tokens.mjs";
import { pairsIn, sitsOn } from "./tones.mjs";

const get = (tree, path) =>
  path
    .split(".")
    .reduce((n, p) => (n && typeof n === "object" ? n[p] : undefined), tree);
const isToken = (v) => v && typeof v === "object" && "$value" in v;
const lineOf = (text, index) => text.slice(0, index).split("\n").length;
const kebab = (name) =>
  name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

// Words for matching free text: lower case, no stop words, a light stem.
const STOP = new Set(
  "a an the on in of or and to for with is it be do i my me how what which should can this that some something thing things our we you your their they who where when all very more most".split(
    " ",
  ),
);
const stem = (w) => w.replace(/(ings?|ed|es|s|ly|e)$/, "");
const words = (text) =>
  String(text)
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map(stem)
    .filter((w) => w.length > 2);
const overlap = (query, text) => {
  const hay = new Set(words(text));
  return [...new Set(query)].filter((w) => hay.has(w));
};

// --- checkUi -------------------------------------------------------------------------------------

// Not product UI: generated output, the components and token styles themselves (they read only keys),
// the docs site's and Storybook's own chrome, and the package's index, which re-exports what
// components import.
const SKIP =
  /(^|\/)(node_modules|dist|build|storybook-static|\.open-ds|\.storybook|tokens|docs|src\/components\/ui|src\/styles)\/|(^|\/)src\/index\.[jt]s$/;
const PALETTE =
  /\b(?:bg|text|border|ring|fill|stroke|from|via|to|outline|divide|placeholder|shadow)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white)(?:-\d{2,3})?\b/g;
const HEX =
  /(?<![\w&/])#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
const FUNC = /\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/g;
const ARBITRARY = /\b[a-z][a-z-]*-\[-?\d+(?:\.\d+)?(?:px|rem|em)\]/g;

/**
 * Checks project files against a scheme. files: [{ path, content }]. Returns { pass, findings },
 * one finding per problem with the file, the line, the rule and the fix.
 */
// A Tailwind spacing utility with a number (p-6, md:gap-1.5, -mt-2), never 0.
const SPACING_NUMBER =
  /(^|[\s"'`{])((?:[\w-]+:)*-?(?:p|px|py|pt|pb|pl|pr|ps|pe|m|mx|my|mt|mb|ml|mr|ms|me|gap|gap-x|gap-y|space-x|space-y)-(\d+(?:\.\d+)?))(?=[\s"'`}]|$)/g;

// The role with this px value in the scheme, else the nearest step of the component spacing map.
// (an inset for padding, a gap for gaps and margins)
function spacingName(scheme, px, util) {
  const g = spacingGuide(scheme, {
    index: tokenIndex(scheme),
    chain: aliasChain,
  });
  const kind = /^p[xytblrse]?$/.test(util) ? "space.inset." : "space.gap.";
  const role = g.roles.find((r) => r.px === px && r.token.startsWith(kind));
  if (role) return role;
  const step = [...g.steps].sort(
    (a, b) => Math.abs(a.px - px) - Math.abs(b.px - px),
  )[0];
  return { ...step, utility: `map-${step.step}` };
}

/**
 * Where each finding is answered: a file in a created project and its section heading.
 * Each one must exist.
 */
export const SEE = {
  "raw-color": "context/tasks/build.md: Situations",
  "raw-size": "context/tasks/build.md: Situations",
  "raw-spacing": "AGENTS.md: Never",
  "not-in-inventory": "AGENTS.md: Components",
  "variant-not-used": "context/components/<id>.md: Variants here",
  "context-drift": "context/README.md",
  "long-label": "context/tasks/write.md: Situations",
};

/** The most words a button label holds on one line (the voice rule): one verb and its object. */
export const BUTTON_LABEL_WORDS = 3;
// A Button with plain text as its label: <Button …>Save changes</Button>.
const BUTTON_LABEL = /<Button\b[^<>]*>([^<>{}]+)<\/Button>/g;

export function checkUi(scheme, g, files) {
  const carried = new Map((scheme.inventory?.in ?? []).map((c) => [c.id, c]));
  const out = new Map((scheme.inventory?.out ?? []).map((c) => [c.id, c.why]));
  const catalogue = new Set(g.catalogue.items.map((i) => i.id));
  const findings = [];
  const add = (file, text, index, rule, message, fix, see = SEE[rule]) =>
    findings.push({ file, line: lineOf(text, index), rule, message, fix, see });
  for (const { path, content } of files) {
    if (SKIP.test(path) || !/\.(tsx|jsx|ts|js|css|html|vue|svelte)$/.test(path))
      continue;
    const text = String(content);
    const css = path.endsWith(".css");
    // Raw colors: hex, color functions and Tailwind palette classes.
    for (const re of [HEX, FUNC]) {
      re.lastIndex = 0;
      for (const m of text.matchAll(re)) {
        // A CSS custom property definition is where a token's value lives, not a raw use.
        const decl = text.slice(
          Math.max(
            text.lastIndexOf(";", m.index),
            text.lastIndexOf("{", m.index),
          ) + 1,
          m.index,
        );
        if (css && /^\s*--/.test(decl)) continue;
        add(
          path,
          text,
          m.index,
          "raw-color",
          `A raw color: ${m[0]}`,
          "Use a semantic color token or a component key. Find it with find_token.",
        );
      }
    }
    if (!css)
      for (const m of text.matchAll(PALETTE))
        add(
          path,
          text,
          m.index,
          "raw-color",
          `A palette color class: ${m[0]}`,
          "Use a class that reads the scheme's color variables, or a component key.",
        );
    // Raw spacing: a Tailwind spacing number. Name the role or map step with that value here.
    if (!css)
      for (const m of text.matchAll(SPACING_NUMBER)) {
        if (Number(m[3]) === 0) continue;
        const px = Number(m[3]) * 4;
        const util = m[2]
          .replace(/^(?:[\w-]+:)*-?/, "")
          .replace(/-[\d.]+$/, "");
        const name = spacingName(scheme, px, util);
        add(
          path,
          text,
          m.index + m[1].length,
          "raw-spacing",
          `A spacing as a number: ${m[2]} (${px}px)`,
          `Use ${m[2].replace(/-\d+(?:\.\d+)?$/, `-${name.utility}`)}: ${name.token}, ${name.px}px in this scheme. Between things a role, inside a component a map step.`,
        );
      }
    // Raw sizes: arbitrary Tailwind values, and px in CSS declarations.
    for (const m of text.matchAll(ARBITRARY))
      add(
        path,
        text,
        m.index,
        "raw-size",
        `A raw size: ${m[0]}`,
        "Use the scheme's spacing, size or radius tokens.",
      );
    if (css)
      for (const m of text.matchAll(
        /(?<=[{;\s])([a-z][a-z-]*)\s*:\s*([^;{}]*\b\d+(?:\.\d+)?px\b[^;{}]*)/g,
      ))
        // A px that is only a var() fallback is not a raw use.
        if (/\b\d+(?:\.\d+)?px\b/.test(m[2].replace(/var\([^)]*\)/g, "")))
          add(
            path,
            text,
            m.index,
            "raw-size",
            `A raw size: ${m[1]}: ${m[2].trim()}`,
            "Use the scheme's spacing, size or radius tokens.",
          );
    // Components the scheme does not carry, by import path.
    for (const m of text.matchAll(
      /from\s+["'][^"']*components\/ui\/([a-z0-9-]+)["']/g,
    )) {
      const id = m[1];
      if (catalogue.has(id) && !carried.has(id))
        add(
          path,
          text,
          m.index,
          "not-in-inventory",
          `${scheme.name} does not carry ${id}.`,
          out.get(id) ??
            "It is not in the inventory. Pick a component the scheme carries.",
        );
    }
    // A button label that would break onto two lines: the voice says it never does.
    if (!css)
      for (const m of text.matchAll(BUTTON_LABEL)) {
        const label = m[1].trim().replace(/\s+/g, " ");
        const n = label ? label.split(" ").length : 0;
        if (n > BUTTON_LABEL_WORDS)
          add(
            path,
            text,
            m.index,
            "long-label",
            `A button label of ${n} words: "${label}". A button label stays on one line and never breaks onto two.`,
            `Use one verb and its object, ${BUTTON_LABEL_WORDS} words at most. Check it with check_copy.`,
          );
      }
    // Variants the scheme decided not to use, from JSX props with a string value.
    for (const m of text.matchAll(/<([A-Z][A-Za-z0-9]*)\b([^<>]*?)\/?>/g)) {
      const id = kebab(m[1]);
      const c = carried.get(id);
      if (!c?.variants) continue;
      for (const p of m[2].matchAll(/\b([a-z][A-Za-z]*)=["']([^"']+)["']/g)) {
        const d = c.variants[p[1]]?.[p[2]];
        if (d?.not_used) {
          const used = Object.entries(c.variants[p[1]])
            .filter(([, x]) => !x.not_used)
            .map(([v]) => v);
          add(
            path,
            text,
            m.index,
            "variant-not-used",
            `${scheme.name} does not use ${m[1]} ${p[1]}="${p[2]}". ${d.why}`,
            used.length
              ? `Use ${p[1]}: ${used.join(", ")}.`
              : `Leave ${p[1]} out.`,
            `context/components/${id}.md: Variants here`,
          );
        }
      }
    }
  }
  findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
  return { pass: findings.length === 0, findings };
}

// --- checkCopy -----------------------------------------------------------------------------------

export const COPY_KINDS = {
  button: "button-label",
  error: "error-words",
  success: "success-words",
  empty: "empty-words",
  confirm: "confirm-words",
  hint: "first-visit",
};

/** Checks one piece of interface text against the scheme's voice and its situation's rule. */
export function checkCopy(scheme, g, { kind, text }) {
  const situation = COPY_KINDS[kind];
  if (!situation)
    throw new Error(
      `kind must be one of: ${Object.keys(COPY_KINDS).join(", ")}.`,
    );
  const t = String(text).trim();
  const findings = [];
  for (const w of scheme.voice?.words?.avoid ?? []) {
    const re = new RegExp(
      `\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "i",
    );
    if (re.test(t))
      findings.push({
        rule: "avoid-word",
        message: `"${w}" is on the scheme's avoid list.`,
      });
  }
  const principles = (scheme.voice?.principles ?? [])
    .map((p) => p.text.toLowerCase())
    .join(" ");
  if (/exclamation/.test(principles) && t.includes("!"))
    findings.push({
      rule: "no-exclamation",
      message: "The voice says no exclamation marks.",
    });
  const sentences = t.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (kind === "button") {
    if (t.split(/\s+/).length > BUTTON_LABEL_WORDS)
      findings.push({
        rule: "button-shape",
        message: `A button label is one verb and its object: ${BUTTON_LABEL_WORDS} words at most, so it stays on one line.`,
      });
    if (/[.!?]$/.test(t))
      findings.push({
        rule: "button-shape",
        message: "A button label has no end punctuation.",
      });
  } else if (sentences.length > 2)
    findings.push({
      rule: "too-long",
      message: `${sentences.length} sentences. Keep it to two: what happened, then what to do.`,
    });
  const rule = when(scheme, situation, g);
  return {
    pass: findings.length === 0,
    findings,
    situation,
    rule: rule && {
      use: rule.use,
      not: rule.not,
      why: rule.why,
      ...(rule.example && { example: rule.example }),
    },
  };
}

// --- planChange ----------------------------------------------------------------------------------

/** The end of a token's alias chain in one theme: the primitive path and its raw value. */
function resolve(tree, path) {
  let at = path;
  for (let i = 0; i < 12; i++) {
    const node = get(tree, at);
    if (!isToken(node)) return { path: at, value: undefined };
    const m =
      typeof node.$value === "string" && node.$value.match(/^\{(.+)\}$/);
    if (!m) return { path: at, value: node.$value };
    at = m[1];
  }
  return { path: at, value: undefined };
}

function contrast(a, b) {
  const lum = (hex) => {
    const c = String(hex).replace("#", "").slice(0, 6).match(/../g);
    if (!c) return NaN;
    const [r, gr, bl] = c.map((x) => {
      const v = parseInt(x, 16) / 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * gr + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
}

/**
 * The plan for one change, without making it. change is { question, option } for a decision, or
 * { token, value } for a primitive. Returns the edits, what they reopen or touch, and, for a color,
 * the contrast of every pair it reaches in every theme, before and after.
 */
export function planChange(scheme, g, change) {
  const qs = questions(g);
  if (change.question) {
    const q = qs[change.question];
    if (!q) throw new Error(`"${change.question}" is not a question id.`);
    const opt = q.options.find((o) => o.id === change.option);
    if (!opt)
      throw new Error(
        `"${change.option}" is not an option of ${change.question}: ${q.options.map((o) => o.id).join(", ")}.`,
      );
    const answer = scheme.answers.find((a) => a.question === change.question);
    const f = followers(scheme, change.question);
    const moved = new Set([change.question, ...f]);
    const label = (id) => {
      const a = scheme.answers.find((x) => x.question === id);
      return (
        qs[id]?.options.find((o) => o.id === a?.option)?.label ?? a?.option
      );
    };
    const variants = (scheme.inventory?.in ?? []).flatMap((c) =>
      Object.entries(c.variants ?? {}).flatMap(([axis, vs]) =>
        Object.entries(vs)
          .filter(([, d]) => (d.because ?? []).some((b) => moved.has(b)))
          .map(([variant, d]) => ({
            component: c.id,
            axis,
            variant,
            now: d.not_used ? `not used: ${d.why}` : d.use,
          })),
      ),
    );
    const rules = scheme.usage
      .filter((u) => (u.because ?? []).some((b) => moved.has(b)))
      .map((u) => ({ situation: u.situation, now: u.use }));
    const scope = g.scopes.find((s) =>
      s.questions.some((x) => x.id === change.question),
    );
    return {
      kind: "answer",
      question: change.question,
      text: q.text,
      from: answer && {
        option: answer.option,
        label: label(change.question),
        why: answer.why,
      },
      to: { option: opt.id, label: opt.label },
      same: answer?.option === opt.id,
      edits: [
        `In the ${scheme.id} source (schemes/${scheme.id}/), set the answer to ${change.question} to "${opt.id}" and write a new why.`,
        ...f.map(
          (x) =>
            `Review the answer to ${x} (${label(x)}): it follows from this one.`,
        ),
        ...variants.map(
          (v) =>
            `Review ${v.component} ${v.axis}=${v.variant}: it cites a moved answer.`,
        ),
        ...rules.map(
          (r) => `Review the rule for ${r.situation}: it cites a moved answer.`,
        ),
        ...(scope?.owns?.length
          ? [
              `Check the ${scope.owns.join(", ")} tokens of the ${scope.id} scope, then rebuild the tokens.`,
            ]
          : []),
      ],
      follows: f.map((x) => ({
        question: x,
        text: qs[x]?.text,
        answer: label(x),
      })),
      variants,
      rules,
      tokens: scope?.owns ?? [],
    };
  }
  if (change.token) {
    const prim = get(scheme.tokens.primitive, change.token);
    if (!isToken(prim))
      throw new Error(
        `"${change.token}" is not a primitive of ${scheme.name}. To change a semantic token or a component key, point it at another token (find it with why or get_key).`,
      );
    const themes = scheme.themes.map((t) => ({
      ...t,
      tree: themeTokens(scheme, t.brand, t.mode),
    }));
    const keys = g.semantics?.keys ?? [];
    const affected = {};
    for (const t of themes)
      affected[t.id] = keys
        .filter((k) => resolve(t.tree, k.id).path === change.token)
        .map((k) => k.id);
    const valueIn = (t, id, after) => {
      const r = resolve(t.tree, id);
      return after && r.path === change.token ? change.value : r.value;
    };
    const pairs = [];
    for (const t of themes)
      for (const { key: id, on, contrast: needs } of pairsIn(
        g,
        scheme,
        t.brand,
        t.mode,
      )) {
        const k = { id, pairs: { contrast: needs } };
        {
          if (!affected[t.id].includes(k.id) && !affected[t.id].includes(on))
            continue;
          const before = contrast(
            valueIn(t, k.id, false),
            valueIn(t, on, false),
          );
          const after = contrast(valueIn(t, k.id, true), valueIn(t, on, true));
          if (Number.isNaN(after)) continue;
          pairs.push({
            theme: t.id,
            token: k.id,
            on,
            needs: k.pairs.contrast,
            before,
            after,
            pass: after >= k.pairs.contrast,
          });
        }
      }
    const componentKeys = g.component_keys
      .filter((ck) =>
        themes.some(
          (t) =>
            affected[t.id].includes(ck.default) ||
            resolve(t.tree, ck.default).path === change.token,
        ),
      )
      .map((ck) => ck.id);
    return {
      kind: "token",
      token: change.token,
      from: prim.$value,
      to: change.value,
      edits: [
        `In schemes/${scheme.id}/scheme.json, set tokens.primitive.${change.token} to ${change.value}, then rebuild the tokens.`,
        ...pairs
          .filter((p) => !p.pass)
          .map(
            (p) =>
              `Fix ${p.token} on ${p.on} in ${p.theme}: ${p.after}:1 is under ${p.needs}:1.`,
          ),
      ],
      semantic: affected,
      component_keys: componentKeys,
      pairs,
      pass: pairs.every((p) => p.pass),
    };
  }
  throw new Error("A change is { question, option } or { token, value }.");
}

// --- findToken -----------------------------------------------------------------------------------

/** The tokens and component keys that fit an intent, best first, with their guidance. */
// Words people use for the same thing as the grammar's names.
const SYNONYMS = {
  field: "input",
  form: "input",
  error: "danger",
  invalid: "danger",
  fail: "danger",
  warn: "warning",
  fill: "background",
  label: "text",
  text: "label",
  outline: "border",
  edge: "border",
  ring: "focus",
  link: "link",
  page: "canvas",
};

export function findToken(scheme, g, query, limit = 5) {
  const q = [
    ...new Set(
      words(query).flatMap((w) => (SYNONYMS[w] ? [w, stem(SYNONYMS[w])] : [w])),
    ),
  ];
  if (!q.length)
    throw new Error(
      "find_token needs words that describe what the token is for.",
    );
  const semantic = (g.semantics?.keys ?? []).map((k) => {
    const head = overlap(q, k.id.replace(/[.@]/g, " "));
    const body = overlap(q, `${k.intent} ${(k.use_for ?? []).join(" ")}`);
    return {
      token: k.id,
      kind: "semantic",
      intent: k.intent,
      use_for: k.use_for ?? [],
      not_for: k.not_for ?? [],
      ...(k.pairs && { sits_on: sitsOn(g, k) }),
      score: head.length * 2 + body.length,
      matched: [...new Set([...head, ...body])],
    };
  });
  // A component key ranks only when the query names its component (every component has its own keys).
  // A deprecated key (replaced_by) is never offered; its replacement is.
  const keys = g.component_keys
    .filter((k) => !k.replaced_by)
    .map((k) => {
      const named = overlap(q, k.component.replace(/-/g, " ")).length > 0;
      const head = named ? overlap(q, k.id.replace(/[/@-]/g, " ")) : [];
      const body = named ? overlap(q, k.description) : [];
      return {
        token: k.id,
        kind: "component key",
        intent: k.description,
        reads: k.default,
        score: head.length * 2 + body.length,
        matched: [...new Set([...head, ...body])],
      };
    });
  // Spacing: the layout roles and the component spacing map's steps, with this scheme's px.
  const sg = spacingGuide(scheme, {
    index: tokenIndex(scheme),
    chain: aliasChain,
  });
  const spacing = [
    ...sg.roles.map((r) => ({
      ...r,
      text: `${r.for} spacing space between padding gap margin layout`,
    })),
    ...sg.steps.map((x) => ({
      ...x,
      text: `A step of the component spacing map, ${x.px}px here: spacing inside a component, padding gap within`,
    })),
  ].map((x) => {
    const head = overlap(q, x.token.replace(/[.-]/g, " "));
    const body = overlap(q, x.text);
    return {
      token: x.token,
      kind: "spacing",
      intent: x.for || x.text.split(":")[0],
      utility: x.step ? `map-${x.step}` : x.utility,
      px: x.px,
      score: head.length * 2 + body.length,
      matched: [...new Set([...head, ...body])],
    };
  });
  const ranked = [...semantic, ...keys, ...spacing]
    .filter((r) => r.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.matched.length - a.matched.length ||
        (a.kind === "semantic" ? -1 : 1) - (b.kind === "semantic" ? -1 : 1) ||
        a.token.localeCompare(b.token),
    );
  // Cover every word asked about: if the best few miss one, swap in the best result for it.
  const results = ranked.slice(0, limit);
  for (const w of q) {
    if (
      !ranked.some((r) => r.matched.includes(w)) ||
      results.some((r) => r.matched.includes(w))
    )
      continue;
    const pick = ranked.find((r) => r.matched.includes(w));
    results.splice(Math.max(results.length - 1, 0), 1, pick);
  }
  const rule = when(scheme, query, g);
  return {
    query,
    results,
    ...(rule && {
      situation: {
        id: rule.situation,
        title: rule.title,
        use: rule.use,
        not: rule.not,
        why: rule.why,
      },
    }),
  };
}

// --- fitScheme -----------------------------------------------------------------------------------

/** The schemes ranked against a product description, with the words that matched and the reasons. */
export function fitScheme(schemes, product) {
  const q = words(product);
  // Show the words as the person typed them, not their stems.
  const typed = Object.fromEntries(
    String(product)
      .toLowerCase()
      .split(/\W+/)
      .map((w) => [stem(w), w]),
  );
  const shown = (list) => list.map((w) => typed[w] ?? w);
  if (!q.length)
    throw new Error(
      "fit_scheme needs a description of the product: its people, content and main task.",
    );
  return schemes
    .map((s) => {
      const fit = overlap(
        q,
        `${s.ai.use_when} ${s.ai.example_products.join(" ")}`,
      );
      const context = overlap(
        q,
        `${s.summary} ${s.scenarios.map((x) => x.text).join(" ")}`,
      ).filter((w) => !fit.includes(w));
      const avoid = overlap(q, s.ai.avoid_when);
      return {
        scheme: s.id,
        name: s.name,
        score: fit.length * 2 + context.length - avoid.length * 2,
        matched: shown(fit),
        also: shown(context),
        against: shown(avoid),
        use_when: s.ai.use_when,
        avoid_when: s.ai.avoid_when,
      };
    })
    .sort((a, b) => b.score - a.score || a.scheme.localeCompare(b.scheme));
}
