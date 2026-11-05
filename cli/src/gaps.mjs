// The gap ledger (OD-243): every place where the decision trace breaks, generated from the code and
// the schemes, never written by hand.
//
// The trace: part → property → state → semantic → rule (its why) → the pick per brand and mode → value.
// A component's own token should name its part and its state, and link to the semantic whose written
// rule covers that job. A gap is a link that is missing or wrong. Fixing a gap makes its count drop;
// the harness lets the counts only go down (harness/gaps-baseline.json).

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { componentApi } from "./lands.mjs";
import { builtComponents } from "./components.mjs";

/** The kinds of gap, in the order of the trace. */
export const GAP_KINDS = [
  {
    id: "key-hides-part",
    title: "The key does not name its part",
    why: "A key that does not name its part cannot say which part a decision reaches, so a change looks like it moves the whole component.",
  },
  {
    id: "key-hides-state",
    title: "The key does not name its state",
    why: "A state shown on a part is a decision. When the key does not name the state, the trace cannot show that the state is decided at all.",
  },
  {
    id: "wrong-semantic",
    title: "The link goes to the wrong semantic",
    why: "The alias breaks a written rule or borrows another component's role, so changing that rule or role moves parts it was never meant to reach.",
  },
  {
    id: "two-jobs",
    title: "One semantic carries two jobs",
    why: "When one semantic fills a part at rest and in a state, or in two states, nothing can keep the jobs apart: one pick moves them all, and a pick that breaks one job looks fine for the other.",
  },
  {
    id: "rule-not-written",
    title: "The rule is not written",
    why: "Components show this state, but no semantic's rule says how. The decision is in use and nobody can read it.",
  },
  {
    id: "pick-without-reason",
    title: "A pick has no reason",
    why: "A theme pick without a why cannot be checked against the decision it carries out, so a wrong step looks as good as a right one.",
  },
];

// The fix ticket for each kind, where one exists. null means no ticket yet; the ledger says so.
const TICKET = {
  "key-hides-state": "OD-241",
  "two-jobs": "OD-241",
  "rule-not-written": "OD-241",
};

// Tailwind variant → state. Variants that are not a state (dark:, sm:, data-[side=…], group-…) are
// ignored. A disabled variant wins over the others: a disabled control does not change on hover.
// The first state in this order wins.
const STATES = [
  ["disabled", /^(disabled|aria-disabled|data-\[disabled(?:=true)?\]|group-data-\[disabled(?:=true)?\]|peer-disabled)$/],
  ["destructive", /variant=destructive|data-\[tone=danger\]/],
  ["invalid", /^aria-invalid$|data-\[invalid/],
  // An interaction wins over a lasting state: data-[active=true]:hover: paints a current item on hover.
  ["pressed", /^active$|data-\[pressed/],
  ["highlight", /^(focus|focus-visible|focus-within)$|data-\[highlighted\]/],
  ["hover", /^hover$/],
  ["current", /^data-\[active=true\]$|^aria-current|data-\[state=active\]/],
  ["selected", /^aria-selected|data-\[selected(?:=true)?\]/],
  ["checked", /data-\[state=(checked|on)\]|^aria-checked|data-\[checked/],
  ["open", /data-\[state=open\]|^aria-expanded/],
];
// Words in a key that name each state.
const STATE_WORDS = {
  disabled: ["disabled"],
  destructive: ["destructive", "danger"],
  invalid: ["invalid", "error"],
  current: ["current", "active"],
  selected: ["selected"],
  checked: ["checked", "on"],
  open: ["open", "expanded"],
  pressed: ["pressed", "active"],
  highlight: ["highlight", "highlighted", "focus"],
  hover: ["hover"],
};
// Words in a semantic's rule (its intent and use for) that cover each state.
const RULE_WORDS = {
  disabled: /disabled|cannot be used/i,
  destructive: /destructive|delete|cannot be undone/i,
  invalid: /invalid|error/i,
  current: /current/i,
  selected: /selected/i,
  checked: /checked/i,
  open: /\bopen\b|expanded/i,
  pressed: /press/i,
  highlight: /highlight/i,
  hover: /hover|pointer/i,
};
// A Tailwind utility → the property it paints.
const PROPERTY = [
  [/^(bg|from|to|via)-/, "background"],
  [/^text-\[length/, "font-size"],
  [/^(text|placeholder)-/, "text"],
  [/^(border|divide|outline)-\[(?:color:)?var/, "border"],
  [/^(border|divide)/, "border"],
  [/^(ring|ring-offset)-/, "focus-ring"],
  [/^(fill|stroke)-/, "icon"],
  [/^rounded/, "radius"],
  [/^shadow/, "shadow"],
];
// Which semantic families can carry a rule for each painted property.
const FAMILY = {
  background: /^color\.(surface|action|disabled\.surface|status)/,
  border: /^color\.(border|disabled\.border|status)/,
  text: /^color\.(text|disabled\.text|status)/,
  icon: /^color\.(text|disabled\.text|status)/,
};

const words = (key) => key.split(/[.\-]/);

/** Where each CSS variable is used in a component's source: the part (data-slot), the property and the state. */
export function usages(src, comp, cssVar) {
  const esc = cssVar.replace(/[-]/g, "\\-");
  const re = new RegExp(`([^\\s"'\`{}()]*?)(?:\\[(?:color:|length:)?)?var\\(${esc}\\)`, "g");
  const out = [];
  for (const m of src.matchAll(re)) {
    const cls = m[1];
    const variants = cls.split(":");
    const util = variants.pop();
    const property = PROPERTY.find(([r]) => r.test(util))?.[1] ?? null;
    let state = null;
    for (const v of variants) {
      const hit = STATES.find(([, r]) => r.test(v));
      if (!hit) continue;
      // The first matching state in STATES order wins (disabled before hover, current before hover).
      if (!state || STATES.findIndex(([n]) => n === hit[0]) < STATES.findIndex(([n]) => n === state)) state = hit[0];
    }
    // A state set in code, not a variant: tone === "danger" && "text-[…]".
    if (!state) {
      const line = src.slice(src.lastIndexOf("\n", m.index) + 1, m.index);
      if (/(tone|variant)\s*===\s*["'](danger|destructive)["']/.test(line)) state = "destructive";
    }
    out.push({ part: partAt(src, m.index, comp), property, state, cls });
  }
  return out;
}

// The data-slot of the element whose className holds the position. A class written in a const
// (cva, a string) outside the element is traced to the element that uses the const.
function partAt(src, at, comp) {
  const slotIn = (from, to) => src.slice(from, to).match(/data-slot="([a-z0-9-]+)"/)?.[1];
  const elementAround = (pos) => {
    const before = src.slice(0, pos);
    const open = Math.max(before.lastIndexOf("<"), 0);
    // The element must still be open at pos: no plain ">" (not "=>") between its "<" and pos.
    const between = src.slice(open, pos);
    if (/[^=]>/.test(between.replace(/=>/g, ""))) return null;
    const close = src.slice(pos).search(/[^=]>/);
    const slot = slotIn(open, close < 0 ? src.length : pos + close + 1);
    if (slot) return slot;
    // No data-slot: a primitive's part names itself (<MenuPrimitive.Separator> is the separator).
    const tag = src.slice(open).match(/^<([A-Za-z][\w.]*)/)?.[1] ?? "";
    const sub = tag.includes(".") ? tag.split(".").pop() : null;
    return sub ? `${comp}-${sub.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}` : null;
  };
  let slot = elementAround(at);
  if (!slot) {
    const name = [...src.slice(0, at).matchAll(/const (\w+)\s*=/g)].pop()?.[1];
    if (name) {
      const use = src.indexOf(`${name}(`, at);
      if (use > 0) slot = elementAround(use);
    }
  }
  if (!slot) return "root";
  return slot === comp ? "root" : slot.replace(new RegExp(`^${comp}-`), "");
}

/** The gaps in the code's component layer: kinds 1 to 5. The same in every scheme, so read in one. */
export function componentGaps(scheme, g, roots) {
  const comps = builtComponents(roots);
  const catalogue = new Set(g.catalogue.items.map((i) => i.id));
  const rule = new Map(g.semantics.keys.map((k) => [k.id.replace(/\.@$/, ""), `${k.intent ?? ""} ${(k.use_for ?? []).join(", ")}`]));
  const rulesFor = (state, property) =>
    [...rule].filter(([id, text]) => FAMILY[property]?.test(id) && RULE_WORDS[state].test(text)).map(([id]) => id);
  const gaps = [];
  const jobs = new Map(); // semantic → job → [keys]
  const unwritten = new Map(); // "state property" → [keys]
  for (const comp of comps) {
    let src;
    try {
      src = readFileSync(join(roots.ui, "components", `${comp}.tsx`), "utf8");
    } catch {
      continue;
    }
    for (const t of componentApi(scheme, comp, roots)) {
      if (!t.own || !t.aliases) continue;
      const key = t.token.replace(`component.${comp}.`, "");
      // component.overlay.* and other shared recipes name their own parts; their key is the recipe's.
      const recipe = key.startsWith("component.");
      const kw = words(key);
      const uses = usages(src, comp, t.css);
      const base = { component: comp, key: t.token, aliases: t.aliases };
      // 1. The key does not name its part.
      const parts = [...new Set(uses.map((u) => u.part).filter((p) => p !== "root"))];
      if (!recipe && parts.length && !parts.some((p) => words(p).some((w) => kw.includes(w))))
        gaps.push({
          ...base,
          kind: "key-hides-part",
          part: parts.join(", "),
          says: `${t.token} paints the ${parts.join(" and ")} part${parts.length > 1 ? "s" : ""}, and its key does not say so.`,
        });
      for (const u of uses) {
        if (!u.state || !u.property) continue;
        // 2. The key does not name its state.
        if (!STATE_WORDS[u.state].some((w) => kw.includes(w)))
          gaps.push({
            ...base,
            kind: "key-hides-state",
            part: u.part,
            state: u.state,
            says: `${t.token} paints the ${u.part === "root" ? comp : u.part} ${u.property} when ${u.state}, and its key does not say ${u.state}.`,
          });
        // 3. The link goes to the wrong semantic: a written rule names another semantic for this job.
        if (/^color\./.test(t.aliases) && FAMILY[u.property]) {
          const covers = rulesFor(u.state, u.property);
          if (!covers.length) {
            const k = `${u.state} ${u.property}`;
            unwritten.set(k, [...(unwritten.get(k) ?? []), t.token]);
          } else if (!covers.includes(t.aliases) && !RULE_WORDS[u.state].test(rule.get(t.aliases) ?? ""))
            gaps.push({
              ...base,
              kind: "wrong-semantic",
              part: u.part,
              state: u.state,
              should: covers,
              says: `${t.token} links ${t.aliases} for the ${u.state} ${u.property}, but the written rule for that job is ${covers.join(" or ")}.`,
            });
        }
      }
      // 3. Borrowed: another component's role (radius.badge in a menu).
      const role = t.aliases.match(/^(radius|size)\.([a-z-]+)$/)?.[2];
      // A role whose written rule names this component is not borrowed: radius.badge is "Corner of
      // badges and checkboxes", so the checkbox reads its own rule.
      const roleRule = role ? t.aliases.split(".").reduce((n, k) => n?.[k], scheme.tokens.semantic)?.$description ?? "" : "";
      // "menu items" names the items of every menu (dropdown-menu, context-menu): the component's last
      // word and the part.
      const part = key.split(".").find((w) => w === "item" || w === "items");
      const named =
        new RegExp(`\\b${comp.replace(/-/g, "[ -]")}(e?s)?\\b`, "i").test(roleRule) ||
        (part && new RegExp(`\\b${comp.split("-").pop()} items\\b`, "i").test(roleRule));
      if (role && catalogue.has(role) && role !== comp && !comp.startsWith(role) && !named)
        gaps.push({
          ...base,
          kind: "wrong-semantic",
          says: `${t.token} borrows ${t.aliases}, the ${role}'s role, so a change to the ${role} moves the ${comp} too.`,
        });
      // 3. A surface used as text: text on a fill pairs by the fill's tone (OD-222).
      if (/^color\.surface\./.test(t.aliases) && uses.some((u) => u.property === "text" || u.property === "icon"))
        gaps.push({
          ...base,
          kind: "wrong-semantic",
          says: `${t.token} paints text or an icon with ${t.aliases}, a fill. Text on a fill pairs by the fill's tone: on-light or on-dark.`,
        });
      // Collect the jobs of each color semantic on fills, for kind 4.
      if (/^color\./.test(t.aliases))
        for (const u of uses.filter((x) => x.property === "background" && x.state !== "disabled")) {
          // States the semantic's own rule covers are one job: surface.highlight's rule covers the
          // pointer (hover) and the keyboard (highlight); surface.selected's covers selected and current.
          // Its own rule's states are the semantic's job, the same as its use at rest.
          const job = !u.state || RULE_WORDS[u.state].test(rule.get(t.aliases) ?? "") ? "its job" : u.state;
          const j = jobs.get(t.aliases) ?? new Map();
          j.set(job, [...new Set([...(j.get(job) ?? []), t.token])]);
          jobs.set(t.aliases, j);
        }
    }
  }
  // 4. One semantic carries two jobs on fills.
  for (const [sem, j] of jobs) {
    if (j.size < 2) continue;
    const list = [...j].map(([job, keys]) => `${job} (${keys.length})`).join(", ");
    gaps.push({
      kind: "two-jobs",
      semantic: sem,
      jobs: Object.fromEntries(j),
      says: `${sem} fills parts in ${j.size} jobs: ${list}.`,
    });
  }
  // 5. The rule is not written.
  for (const [k, keys] of unwritten) {
    const [state, property] = k.split(" ");
    gaps.push({
      kind: "rule-not-written",
      state,
      property,
      keys: [...new Set(keys)],
      says: `${new Set(keys).size} component tokens paint the ${property} when ${state}, and no semantic's rule says how the ${property} shows ${state === "open" ? "when open" : `in the ${state} state`}.`,
    });
  }
  // One gap per kind, key, state and sentence: a key used on two parts in one state is one gap.
  const seen = new Set();
  return gaps.filter((x) => {
    const id = `${x.kind}|${x.key ?? x.semantic ?? ""}|${x.state ?? ""}|${x.property ?? ""}|${x.kind === "key-hides-part" ? "" : x.says}`;
    return seen.has(id) ? false : (seen.add(id), true);
  });
}

/** Kind 6: theme picks with no reason, per brand and mode. */
export function pickGaps(scheme) {
  const gaps = [];
  const leaves = (o, p = []) =>
    !o || typeof o !== "object"
      ? []
      : "$value" in o
        ? [[p.join("."), o]]
        : Object.entries(o).flatMap(([k, v]) => (k[0] === "$" ? [] : leaves(v, [...p, k])));
  for (const [brand, def] of Object.entries(scheme.tokens.brands))
    for (const mode of ["base", "light", "dark"])
      for (const [path, node] of leaves(def.theme?.[mode] ?? {})) {
        const e = node.$extensions?.["open-ds"] ?? {};
        if (e.why || e.because) continue;
        gaps.push({
          kind: "pick-without-reason",
          scheme: scheme.id,
          brand,
          mode,
          token: `theme.${path}`,
          pick: node.$value,
          says: `theme.${path} picks ${node.$value} in ${brand}/${mode} with no why.`,
        });
      }
  return gaps;
}

/** The whole ledger for one scheme, or one component in it. Each gap carries its kind's ticket. */
export function gapLedger(scheme, g, roots, { component = null } = {}) {
  const gaps = component
    ? componentLedger(scheme, g, roots, component)
    : [...componentGaps(scheme, g, roots), ...pickGaps(scheme)].map((x) => ({ ...x, ticket: TICKET[x.kind] ?? null }));
  const counts = Object.fromEntries(GAP_KINDS.map((k) => [k.id, gaps.filter((x) => x.kind === k.id).length]));
  return { scheme: scheme.id, component, kinds: GAP_KINDS, counts, gaps };
}

/** The gaps that touch one component: its own, plus the two-jobs and unwritten rules its keys share. */
export function componentLedger(scheme, g, roots, component) {
  const all = componentGaps(scheme, g, roots);
  const mine = (k) => k?.startsWith(`component.${component}.`);
  return all
    .filter((x) => x.component === component || Object.values(x.jobs ?? {}).flat().some(mine) || x.keys?.some(mine))
    .map((x) => ({ ...x, ticket: TICKET[x.kind] ?? null }));
}

/** The ledger as plain text: the counts, then each kind with its why and its gaps. */
export function gapText(ledger, { limit = 12 } = {}) {
  const lines = [
    `Gaps in ${ledger.scheme}${ledger.component ? `, ${ledger.component}` : ""}: where the decision trace breaks.`,
    "The trace: part, property, state, semantic, rule, pick, value.",
    "",
  ];
  for (const k of ledger.kinds) {
    const list = ledger.gaps.filter((x) => x.kind === k.id);
    if (!list.length) continue;
    const ticket = list[0].ticket;
    lines.push(`${k.title}: ${list.length}${ticket ? ` (${ticket})` : ""}`, `  Why it matters: ${k.why}`);
    for (const x of list.slice(0, limit)) lines.push(`  - ${x.says}`);
    if (list.length > limit) lines.push(`  …and ${list.length - limit} more. Add --json for all.`);
    lines.push("");
  }
  if (!ledger.gaps.length) lines.push("No gaps.");
  return lines.join("\n").trimEnd();
}
