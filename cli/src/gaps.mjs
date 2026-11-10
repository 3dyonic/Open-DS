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
import { SHADCN, SHADCN_SCALE } from "./shadcn.mjs";

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
    id: "borrows-a-key",
    title: "A component reads another component's key",
    why: "Another component's key carries that component's decision. Read here, a change to the card or the table moves this part too, and this part has no key of its own to tune.",
  },
  {
    id: "reads-the-system",
    title: "A component reads the system directly",
    why: "A bare utility (border, ring, bg-muted) reads a system variable, not a key of the component. Its part follows every other part that reads the same variable, and the trace can't say which part a decision reaches.",
  },
  {
    id: "nested-corner",
    title: "An option's corner is not its container's corner less the padding",
    why: "Corners inside corners stay concentric: inner = outer - the padding between them. A pill option in a rounded menu, or a square one in a round one, reads as two shapes fighting.",
  },
  {
    id: "fades-a-color",
    title: "A color is faded by hand",
    why: "An opacity modifier (/10, /50) makes a new color inside the component. No semantic carries it, so no scheme decides it, no contrast check sees it, and a change to the color it fades moves it blindly.",
  },
  {
    id: "decided-in-code",
    title: "A spacing, line or offset is decided in code",
    why: "A margin, a hairline or an offset prop written as a number is a decision only the component can see. The gap between a trigger and its menu was 4, 6 or 8px, depending on the component; a separator stayed 1px in schemes whose lines are 2px.",
  },
  {
    id: "skips-a-component",
    title: "A component draws what a catalogue component is for",
    why: "When a component draws its own empty state, it skips the Empty pattern and its rule (why it is empty and the one action that fills it), so the decision behind Empty never reaches it.",
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
  [
    "disabled",
    /^(disabled|aria-disabled|data-\[disabled(?:=true)?\]|group-data-\[disabled(?:=true)?\](?:\/[\w-]+)?|peer-disabled|(?:group-)?has-\[[^\]]*disabled[^\]]*\](?:\/[\w-]+)?|has-disabled)$/,
  ],
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
  checked: /checked|(is|are) on\b/i,
  open: /\bopen\b|expanded/i,
  pressed: /press/i,
  // A highlight comes from the pointer or keyboard focus (focus-visible): a focus rule covers it.
  highlight: /highlight|keyboard focus|focus ring/i,
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
  [/^(p|px|py|pt|pb|pl|pr)-$/, "padding"],
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
  const re = new RegExp(
    `([^\\s"'\`{}()]*?)(?:\\[(?:color:|length:)?)?var\\(${esc}\\)`,
    "g",
  );
  const out = [];
  for (const m of src.matchAll(re)) {
    const cls = m[1];
    // Split on the colons between variants, never on one inside brackets (has-[select:disabled]:).
    const variants = [];
    let depth = 0;
    let cur = "";
    for (const ch of cls) {
      if (ch === "[" || ch === "(") depth++;
      if (ch === "]" || ch === ")") depth--;
      if (ch === ":" && depth === 0) {
        variants.push(cur);
        cur = "";
      } else cur += ch;
    }
    variants.push(cur);
    const util = variants.pop();
    const property = PROPERTY.find(([r]) => r.test(util))?.[1] ?? null;
    let state = null;
    for (const v of variants) {
      // cmdk marks the option the pointer or the keyboard is on data-[selected=true]: a highlight there.
      // The OTP input marks the slot the keyboard is on data-[active=true]: a highlight there too.
      if (
        (comp === "command" && v === "data-[selected=true]") ||
        (comp === "input-otp" && v === "data-[active=true]")
      ) {
        state = "highlight";
        continue;
      }
      const hit = STATES.find(([, r]) => r.test(v));
      if (!hit) continue;
      // The first matching state in STATES order wins (disabled before hover, current before hover).
      if (
        !state ||
        STATES.findIndex(([n]) => n === hit[0]) <
          STATES.findIndex(([n]) => n === state)
      )
        state = hit[0];
    }
    // A state set in code, not a variant: tone === "danger" && "text-[…]".
    if (!state) {
      const line = src.slice(src.lastIndexOf("\n", m.index) + 1, m.index);
      if (/(tone|variant)\s*===\s*["'](danger|destructive)["']/.test(line))
        state = "destructive";
    }
    // A variant that reaches into a child (*:data-[slot=input-group]:, [&_[data-slot=x]]:) paints
    // that child, not the element the class is written on.
    const child = variants
      // Only a selector that reaches down: *:data-[slot=x], **:data-[slot=x], [&_[data-slot=x]] or
      // [&>[data-slot=x]]. An ancestor context ([[data-slot=tooltip-content]_&]) or a bare
      // data-[slot=x] (a condition on the element itself) still paints this part.
      .map(
        (v, k) =>
          (/^\*{1,2}$/.test(variants[k - 1] ?? "")
            ? v.match(/^data-\[slot=([a-z0-9-]+)\]$/)
            : v.match(/^\[&[_>]\[data-slot=([a-z0-9-]+)\]\]$/))?.[1],
      )
      .find(Boolean);
    const part = child
      ? child === comp
        ? "root"
        : child.replace(new RegExp(`^${comp}-`), "")
      : partAt(src, m.index, comp);
    // A line drawn on a pseudo-element (after:w-[2px] after:bg-…) is a border, not a fill.
    const line =
      property === "background" &&
      variants.some((v) => v === "after" || v === "before")
        ? "border"
        : property;
    out.push({ part, property: line, state, cls });
  }
  return out;
}

// The data-slot of the element whose className holds the position. A class written in a const
// (cva, a string) outside the element is traced to the element that uses the const.
function partAt(src, at, comp) {
  const slotIn = (from, to) =>
    src.slice(from, to).match(/data-slot="([a-z0-9-]+)"/)?.[1];
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
    return sub
      ? `${comp}-${sub.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}`
      : null;
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

/** A component that speaks of no results or no data, and doesn't use the Empty component. */
export const drawsOwnEmpty = (src, comp) =>
  comp !== "empty" &&
  /\b(noResults|noData|emptyText)\s*:\s*["'`]|No results|Nothing (here|found)/.test(
    src,
  ) &&
  !/from "\.\/empty"/.test(src);

/** The gaps in the code's component layer: kinds 1 to 5. The same in every scheme, so read in one. */
// The component layer's gaps, once per scheme and asset root: every component page asks for them.
const gapMemo = new Map();
export function componentGaps(scheme, g, roots) {
  const key = `${roots.ui}|${scheme.id}`;
  if (!gapMemo.has(key)) gapMemo.set(key, componentGapsNow(scheme, g, roots));
  return gapMemo.get(key);
}

function componentGapsNow(scheme, g, roots) {
  const comps = builtComponents(roots);
  const catalogue = new Set(g.catalogue.items.map((i) => i.id));
  const rule = new Map(
    g.semantics.keys.map((k) => [
      k.id.replace(/\.@$/, ""),
      `${k.intent ?? ""} ${(k.use_for ?? []).join(", ")}`,
    ]),
  );
  const rulesFor = (state, property) =>
    [...rule]
      .filter(
        ([id, text]) =>
          FAMILY[property]?.test(id) && RULE_WORDS[state].test(text),
      )
      .map(([id]) => id);
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
    const api = componentApi(scheme, comp, roots);
    // A system variable read without a key of the component's own: a shadcn color utility (bg-muted),
    // a bare border (its width, and its color from --border), or a scale utility (rounded-md, text-sm).
    // The same detection as the docs' "From the system" rows.
    const sysSeen = new Set();
    for (const cls of src.match(/[!\w:[\]=&>*()+.,'"\/-]+/g) ?? []) {
      // A class keeps no quote or comma of the string around it ("border … at the start, first:border-l",).
      const util = cls
        .replace(/^["'`,]+|["'`,]+$/g, "")
        .split(":")
        .pop()
        .replace(/^!/, "")
        .replace(/\/\d+$/, "");
      const color = util.match(
        /^(bg|text|border(?:-[tblrxy])?|ring-offset|ring|outline|fill|stroke|divide|placeholder|caret|accent|decoration)-([a-z0-9-]+)$/,
      );
      const scale = util.match(
        /^(rounded(?:-[tblrse]{1,2})?|shadow|text)-(xs|sm|md|lg|xl|base)$/,
      );
      const scaleVar =
        scale &&
        `--${scale[1].startsWith("rounded") ? "radius" : scale[1]}-${scale[2]}`;
      const hit =
        color && SHADCN[color[2]]
          ? `--${color[2]}`
          : /^border(-[tblrxy])?$/.test(util)
            ? "--border"
            : scaleVar && SHADCN_SCALE[scaleVar]
              ? scaleVar
              : null;
      if (!hit || sysSeen.has(`${util}|${hit}`)) continue;
      sysSeen.add(`${util}|${hit}`);
      gaps.push({
        kind: "reads-the-system",
        component: comp,
        key: hit,
        says: `${comp} uses \`${util}\`, which reads ${hit} from the system, not a key of its own.`,
      });
    }
    // A color faded by hand: a key or a named color with an opacity modifier (bg-[var(--x)]/10,
    // bg-black/50). The tint is then decided in the component, where no scheme can see or change it.
    const fadeSeen = new Set();
    for (const m of src.matchAll(
      /\b(bg|text|border|ring|fill|stroke|outline|divide)-(?:\[(?:color:)?var\((--[a-z0-9-]+)\)\]|(black|white|transparent|current))\/(\d+)\b/g,
    )) {
      const what = m[2] ?? m[3];
      if (fadeSeen.has(`${m[1]}|${what}|${m[4]}`)) continue;
      fadeSeen.add(`${m[1]}|${what}|${m[4]}`);
      gaps.push({
        kind: "fades-a-color",
        component: comp,
        key: what,
        says: `${comp} fades ${m[2] ? `var(${m[2]})` : m[3]} to ${m[4]}% by hand (${m[0]}); the tint has no semantic, so no scheme decides it.`,
      });
    }
    // A spacing or a line weight decided in code: a margin (mt-1.5, -mx-1), a hairline (h-px) or a
    // Radix offset prop (sideOffset = 4). Each is a decision no scheme reaches; read it through a key.
    const codeSeen = new Set();
    const literal = [
      ...[
        ...src.matchAll(
          /(?:^|[\s"'`:])(-?(?:m|mx|my|mt|mb|ml|mr|ms|me)-(?!0\b)[\d.]+|space-[xy]-(?!0\b)[\d.]+)(?=[\s"'`]|$)/gm,
        ),
      ].map((m) => [m[1], "spacing"]),
      ...[
        ...src.matchAll(
          /(?:^|[\s"'`:])((?:h|w)-(?:px|\[\d+px\]))(?=[\s"'`]|$)/gm,
        ),
      ].map((m) => [m[1], "line weight"]),
      ...[
        ...src.matchAll(/\b((?:side|align)Offset\s*=\s*\{?-?[1-9]\d*\}?)/g),
      ].map((m) => [m[1].replace(/\s+/g, " "), "offset"]),
    ];
    for (const [lit, what] of literal) {
      if (codeSeen.has(lit)) continue;
      codeSeen.add(lit);
      gaps.push({
        kind: "decided-in-code",
        component: comp,
        key: lit,
        says: `${comp} sets a ${what} in code (${lit}); no scheme decides it, so it can't follow the decision it belongs to.`,
      });
    }
    // An empty state drawn by hand: the labels speak of no results or no data, and Empty isn't used.
    if (drawsOwnEmpty(src, comp))
      gaps.push({
        kind: "skips-a-component",
        component: comp,
        says: `${comp} draws its own empty state; the Empty component (why it is empty and the one action that fills it) is not used.`,
      });
    // Nested corners: an option's corner against its container's corner less the padding between them.
    // radius.pill is calc(infinity * 1px): read it as the 9999px pill the message names.
    const px = (v) =>
      typeof v !== "string"
        ? null
        : /infinity/.test(v)
          ? 9999
          : /rem$/.test(v)
          ? parseFloat(v) * 16
          : /px$/.test(v)
            ? parseFloat(v)
            : null;
    const byPart = new Map();
    for (const t of api.filter((x) => x.own))
      for (const u of usages(src, comp, t.css)) {
        const e = byPart.get(u.part) ?? {};
        if (u.property === "radius" && !e.radius) e.radius = t;
        // The padding that nests an option is on every side (p-), not one axis (px-, a heading's).
        if (u.property === "padding" && /(^|:)p-$/.test(u.cls) && !e.padding)
          e.padding = t;
        byPart.set(u.part, e);
      }
    // A panel that holds options (a menu, a list) or a bar that holds triggers (the menubar, a tab list).
    const container = [...byPart].find(
      ([p, e]) =>
        /content|list|popup|menu$|^root$/.test(p) &&
        e.radius &&
        e.padding &&
        [...byPart].some(
          ([q, f]) =>
            q !== p &&
            f.radius &&
            (/item|option/.test(q) ||
              (/trigger/.test(q) && /^root$|list$/.test(p))),
        ),
    );
    if (container) {
      const val = (t) => px(Object.values(t.values)[0]?.value);
      const outer = val(container[1].radius);
      const pad = val(container[1].padding);
      for (const [p, e] of byPart)
        if (
          (/item|option/.test(p) ||
            (/trigger/.test(p) && /^root$|list$/.test(container[0]))) &&
          p !== container[0] &&
          e.radius &&
          outer != null &&
          pad != null
        ) {
          const inner = val(e.radius);
          const want = Math.max(0, outer - pad);
          if (inner != null && Math.abs(inner - want) > 0.5)
            gaps.push({
              kind: "nested-corner",
              component: comp,
              key: e.radius.token,
              part: p,
              says: `${comp}'s ${p} corner is ${inner >= 999 ? "a pill" : `${inner}px`}; inside a ${outer}px ${container[0]} with ${pad}px padding it should be ${want}px.`,
            });
        }
    }
    for (const t of api) {
      if (!t.own || !t.aliases) continue;
      const key = t.token.replace(`component.${comp}.`, "");
      // component.overlay.* and other shared recipes name their own parts; their key is the recipe's.
      const recipe = key.startsWith("component.");
      const kw = words(key);
      const uses = usages(src, comp, t.css);
      const base = { component: comp, key: t.token, aliases: t.aliases };
      // 1. The key does not name its part.
      const parts = [
        ...new Set(uses.map((u) => u.part).filter((p) => p !== "root")),
      ];
      if (
        !recipe &&
        parts.length &&
        !parts.some((p) => words(p).some((w) => kw.includes(w)))
      )
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
          } else if (
            !covers.includes(t.aliases) &&
            !RULE_WORDS[u.state].test(rule.get(t.aliases) ?? "")
          )
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
      // A value borrowed for its number: the disabled opacity read with no disabled state (shadcn's
      // opacity-50 on a chevron at rest, linked to opacity.disabled because the values matched).
      if (t.aliases === "opacity.disabled")
        for (const u of uses.filter((x) => x.state !== "disabled"))
          gaps.push({
            ...base,
            kind: "wrong-semantic",
            says: `${t.token} reads opacity.disabled on the ${u.part} at rest; nothing about it is disabled, so a change to how disabled things look would move it.`,
          });
      // 3. Borrowed: another component's role (radius.badge in a menu).
      const role = t.aliases.match(/^(radius|size)\.([a-z-]+)$/)?.[2];
      // A role whose written rule names this component is not borrowed: radius.badge is "Corner of
      // badges and checkboxes", so the checkbox reads its own rule.
      const roleRule = role
        ? (t.aliases.split(".").reduce((n, k) => n?.[k], scheme.tokens.semantic)
            ?.$description ?? "")
        : "";
      // "menu items" names the items of every menu (dropdown-menu, context-menu): the component's last
      // word and the part.
      const part = key.split(".").find((w) => w === "item" || w === "items");
      const named =
        new RegExp(`\\b${comp.replace(/-/g, "[ -]")}(e?s)?\\b`, "i").test(
          roleRule,
        ) ||
        (part &&
          new RegExp(`\\b${comp.split("-").pop()} items\\b`, "i").test(
            roleRule,
          )) ||
        // A rule that names the part itself ("badges, chips and checkboxes" for a combobox chip).
        key
          .split(".")
          .some(
            (w) =>
              w.length > 2 &&
              !/^(radius|size|background|border|label)$/.test(w) &&
              new RegExp(`\\b${w}s?\\b`, "i").test(roleRule),
          );
      if (
        role &&
        catalogue.has(role) &&
        role !== comp &&
        !comp.startsWith(role) &&
        !named
      )
        gaps.push({
          ...base,
          kind: "wrong-semantic",
          says: `${t.token} borrows ${t.aliases}, the ${role}'s role, so a change to the ${role} moves the ${comp} too.`,
        });
      // 3. A surface used as text: text on a fill pairs by the fill's tone (OD-222).
      if (
        /^color\.surface\./.test(t.aliases) &&
        uses.some((u) => u.property === "text" || u.property === "icon")
      )
        gaps.push({
          ...base,
          kind: "wrong-semantic",
          says: `${t.token} paints text or an icon with ${t.aliases}, a fill. Text on a fill pairs by the fill's tone: on-light or on-dark.`,
        });
      // A key of another catalogue component (component.card.radius in the data table): borrowed.
      const owner = t.token.split(".")[1];
      if (owner !== comp && catalogue.has(owner))
        gaps.push({
          ...base,
          kind: "borrows-a-key",
          says: `${comp} reads ${t.token}, the ${owner}'s key, for ${[...new Set(uses.map((u) => `its ${u.part === "root" ? comp : u.part} ${u.property ?? "value"}`))].join(" and ") || "a part"}.`,
        });
      // Collect the jobs of each color semantic on fills, for kind 4.
      if (/^color\./.test(t.aliases))
        for (const u of uses.filter(
          (x) => x.property === "background" && x.state !== "disabled",
        )) {
          // States the semantic's own rule covers are one job: surface.highlight's rule covers the
          // pointer (hover) and the keyboard (highlight); surface.selected's covers selected and current.
          // Its own rule's states are the semantic's job, the same as its use at rest.
          const job =
            !u.state || RULE_WORDS[u.state].test(rule.get(t.aliases) ?? "")
              ? "its job"
              : u.state;
          const j = jobs.get(t.aliases) ?? new Map();
          j.set(job, [...new Set([...(j.get(job) ?? []), t.token])]);
          jobs.set(t.aliases, j);
        }
    }
  }
  // 4. One semantic carries two jobs on fills.
  for (const [sem, j] of jobs) {
    if (j.size < 2) continue;
    const list = [...j]
      .map(([job, keys]) => `${job} (${keys.length})`)
      .join(", ");
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
        : Object.entries(o).flatMap(([k, v]) =>
            k[0] === "$" ? [] : leaves(v, [...p, k]),
          );
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
    : [...componentGaps(scheme, g, roots), ...pickGaps(scheme)].map((x) => ({
        ...x,
        ticket: TICKET[x.kind] ?? null,
      }));
  const counts = Object.fromEntries(
    GAP_KINDS.map((k) => [k.id, gaps.filter((x) => x.kind === k.id).length]),
  );
  return { scheme: scheme.id, component, kinds: GAP_KINDS, counts, gaps };
}

/** The gaps that touch one component: its own, plus the two-jobs and unwritten rules its keys share. */
export function componentLedger(scheme, g, roots, component) {
  const all = componentGaps(scheme, g, roots);
  const mine = (k) => k?.startsWith(`component.${component}.`);
  return all
    .filter(
      (x) =>
        x.component === component ||
        Object.values(x.jobs ?? {})
          .flat()
          .some(mine) ||
        x.keys?.some(mine),
    )
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
    lines.push(
      `${k.title}: ${list.length}${ticket ? ` (${ticket})` : ""}`,
      `  Why it matters: ${k.why}`,
    );
    for (const x of list.slice(0, limit)) lines.push(`  - ${x.says}`);
    if (list.length > limit)
      lines.push(`  …and ${list.length - limit} more. Add --json for all.`);
    lines.push("");
  }
  if (!ledger.gaps.length) lines.push("No gaps.");
  return lines.join("\n").trimEnd();
}
