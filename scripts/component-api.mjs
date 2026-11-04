// OD-234: every component gets its own token API. For each component in ui/src/components, every class
// that reads a system value directly (a shadcn color, a corner, a shadow, a Tailwind spacing, size, text
// size, weight, speed or opacity) becomes the component's own token, which aliases a semantic token. The
// class is rewritten to read the component's CSS variable; the token is written into the grammar and
// every scheme. Run once per change of the rules: node scripts/component-api.mjs [--dry]
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { SHADCN, SHADCN_SCALE } from "../cli/src/shadcn.mjs";

const ROOT = new URL("..", import.meta.url).pathname;
const UI = `${ROOT}ui/src/components/`;
const SCHEMES = [
  "dense-data",
  "content-first",
  "accessible-first",
  "brand-expressive",
  "multi-brand",
];
const dry = process.argv.includes("--dry");
const read = (p) => readFileSync(ROOT + p, "utf8");
const g = JSON.parse(read("schemes/grammar.json"));
const schemes = Object.fromEntries(
  SCHEMES.map((id) => [id, JSON.parse(read(`schemes/${id}.json`))]),
);
const ref = schemes["dense-data"].tokens;

// the value a semantic ends at in Dense data, to match Tailwind's fixed values
const leaf = (tree, path) => path.split(".").reduce((n, k) => n && n[k], tree);
const valueOf = (path) => {
  let v = leaf(ref.semantic, path)?.$value;
  for (let i = 0; i < 6 && typeof v === "string" && /^\{.+\}$/.test(v); i++) {
    const p = v.slice(1, -1);
    v = (leaf(ref.semantic, p) ?? leaf(ref.primitive, p))?.$value;
  }
  return v;
};
const rem = (v) =>
  typeof v === "string" && /rem$/.test(v)
    ? parseFloat(v)
    : typeof v === "string" && /px$/.test(v)
      ? parseFloat(v) / 16
      : NaN;
const SPACE = {
  inset: [
    "space.inset.control-x",
    "space.inset.container",
    "space.inset.cell-x",
  ],
  gap: [
    "space.gap.tight",
    "space.gap.default",
    "space.gap.group",
    "space.gap.section",
  ],
};
// the semantic of the right kind with the same value; else the nearest of that kind (a visual change)
const nearest = (want, kinds) => {
  const all = kinds
    .flatMap((k) => SPACE[k])
    .map((p) => ({ p, v: rem(valueOf(p)) }));
  const same = all.find((x) => Math.abs(x.v - want) < 1e-6);
  if (same) return { sem: same.p, moved: false };
  const best = all.sort(
    (a, b) => Math.abs(a.v - want) - Math.abs(b.v - want),
  )[0];
  return { sem: best.p, moved: true, from: `${want}rem`, to: `${best.v}rem` };
};
const css2path = (c) => {
  // color-action-primary → color.action.primary.@ when it is a group with a base
  const p = c.replace(/-/g, ".");
  if (leaf(ref.semantic, p)?.$value !== undefined) return p;
  if (leaf(ref.semantic, `${p}.@`)?.$value !== undefined) return `${p}.@`;
  // names with dashes inside a segment: try joining from the end
  const seg = c.split("-");
  for (let i = seg.length - 1; i > 0; i--) {
    const q = [...seg.slice(0, i), seg.slice(i).join("-")].join(".");
    if (leaf(ref.semantic, q)?.$value !== undefined) return q;
    if (leaf(ref.semantic, `${q}.@`)?.$value !== undefined) return `${q}.@`;
  }
  return null;
};
const CONTAINERS =
  /^(accordion|alert|alert-dialog|attachment|bubble|calendar|card|chart|command|context-menu|data-table|dialog|drawer|dropdown-menu|empty|hover-card|item|menubar|message|message-scroller|navigation-menu|popover|sheet|sidebar|table|toast|tooltip)$/;
const TW = (n) => parseFloat(n) * 0.25;

/** A class utility → { name, sem, out(var) } or null. */
function map(util, comp) {
  let m;
  if ((m = util.match(/^(p|px|py|pt|pb|pl|pr)-([\d.]+)$/))) {
    const want = TW(m[2]);
    if (!want) return null;
    const r = nearest(
      want,
      CONTAINERS.test(comp) ? ["inset", "gap"] : ["inset", "gap"],
    );
    const name = {
      p: "padding",
      px: "padding-x",
      py: "padding-y",
      pt: "padding-top",
      pb: "padding-bottom",
      pl: "padding-left",
      pr: "padding-right",
    }[m[1]];
    return { name, ...r, out: (v) => `${m[1]}-[var(${v})]` };
  }
  if ((m = util.match(/^(gap|gap-x|gap-y)-([\d.]+)$/))) {
    const want = TW(m[2]);
    if (!want) return null;
    return {
      name: m[1],
      ...nearest(want, ["gap", "inset"]),
      out: (v) => `${m[1]}-[var(${v})]`,
    };
  }
  if ((m = util.match(/^size-([\d.]+)$/))) {
    const want = TW(m[1]);
    const sem = want <= 1.25 ? "size.icon" : "size.control.default";
    const to = rem(valueOf(sem));
    return {
      name: want <= 1.25 ? "icon-size" : "size",
      sem,
      moved: Math.abs(to - want) > 1e-6,
      from: `${want}rem`,
      to: `${to}rem`,
      out: (v) => `size-[var(${v})]`,
    };
  }
  if ((m = util.match(/^h-(8|9|10)$/))) {
    const want = TW(m[1]);
    const to = rem(valueOf("size.control.default"));
    return {
      name: "height",
      sem: "size.control.default",
      moved: Math.abs(to - want) > 1e-6,
      from: `${want}rem`,
      to: `${to}rem`,
      out: (v) => `h-[var(${v})]`,
    };
  }
  if ((m = util.match(/^text-(xs|sm|base|lg)$/))) {
    const want = { xs: 0.75, sm: 0.875, base: 1, lg: 1.125 }[m[1]];
    const sem = {
      xs: "type.caption.font-size",
      sm: "type.body.font-size",
      base: "type.heading.font-size",
      lg: "type.title.font-size",
    }[m[1]];
    const to = rem(valueOf(sem));
    return {
      name: "font-size",
      sem,
      moved: Math.abs(to - want) > 1e-6,
      from: `${want}rem`,
      to: `${to}rem`,
      out: (v) => `text-[length:var(${v})]`,
    };
  }
  if ((m = util.match(/^font-(normal|medium|semibold|bold)$/))) {
    const want = { normal: 400, medium: 500, semibold: 600, bold: 700 }[m[1]];
    const sem = {
      normal: "type.body.font-weight",
      medium: "type.label.font-weight",
      semibold: "type.title.font-weight",
      bold: "type.display.font-weight",
    }[m[1]];
    const to = Number(valueOf(sem));
    return {
      name: "font-weight",
      sem,
      moved: to !== want,
      from: String(want),
      to: String(to),
      out: (v) => `[font-weight:var(${v})]`,
    };
  }
  if ((m = util.match(/^opacity-50$/)))
    return {
      name: "disabled-opacity",
      sem: "opacity.disabled",
      out: (v) => `opacity-[var(${v})]`,
    };
  if ((m = util.match(/^duration-(\d+)$/)))
    return {
      name: "duration",
      sem: "motion.duration.feedback",
      out: (v) => `duration-[var(${v})]`,
    };
  if ((m = util.match(/^shadow(-xs|-sm|-md|-lg|-xl)?$/))) {
    const v =
      SHADCN_SCALE[`--shadow${m[1] ?? "-sm"}`]?.match(/var\(--(.+)\)/)?.[1];
    const sem = v && css2path(v);
    return sem
      ? { name: "shadow", sem, out: (x) => `shadow-[var(${x})]` }
      : null;
  }
  if ((m = util.match(/^rounded(-xs|-sm|-md|-lg|-xl|-full)?$/))) {
    if (m[1] === "-full")
      return {
        name: "radius",
        sem: "radius.round",
        out: (x) => `rounded-[var(${x})]`,
      };
    const v =
      SHADCN_SCALE[`--radius${m[1] ?? "-sm"}`]?.match(/var\(--(.+)\)/)?.[1];
    const sem = v && css2path(v);
    return sem
      ? { name: "radius", sem, out: (x) => `rounded-[var(${x})]` }
      : null;
  }
  if (
    (m = util.match(
      /^(bg|text|border|border-[tblrxy]|ring|ring-offset|fill|stroke|divide|outline|placeholder)-([a-z0-9-]+)$/,
    ))
  ) {
    const v = SHADCN[m[2]];
    const sem = v && css2path(v);
    if (!sem) return null;
    const role =
      {
        bg: "background",
        text: "label",
        fill: "icon",
        stroke: "icon",
        ring: "focus-ring",
        "ring-offset": "focus-ring-offset",
        outline: "outline",
        placeholder: "placeholder",
      }[m[1]] ?? "border";
    return { name: role, sem, out: (x) => `${m[1]}-[color:var(${x})]` };
  }
  return null;
}

const STATE = [
  [/^hover$|^group-hover/, "hover"],
  [/^focus-visible$|^focus$|^focus-within$/, "focus"],
  [/^active$/, "active"],
  [/^disabled$|data-\[disabled|aria-disabled/, "disabled"],
  [/state=open|data-open/, "open"],
  [/state=checked|data-checked/, "checked"],
  [/state=on/, "on"],
  [/selected|aria-selected/, "selected"],
  [/aria-invalid|invalid/, "invalid"],
  [/^placeholder$/, "placeholder"],
];

const report = { comps: 0, tokens: 0, moved: [], fixed: [] };
const files = readdirSync(UI)
  .filter((f) => f.endsWith(".tsx"))
  .sort();
for (const f of files) {
  const comp = f.replace(/\.tsx$/, "");
  let src = readFileSync(UI + f, "utf8");
  const made = new Map(); // path → sem
  const keyOf = new Map(); // `${base}|${sem}` → path
  const cssVar = (path) =>
    `--${path
      .replace(/^component\./, "")
      .split(".")
      .filter((x) => x !== "@")
      .join("-")}`;
  let out = "";
  let last = 0;
  // every double-quoted string that holds classes
  for (const m of src.matchAll(/"([^"\n]*)"/g)) {
    const str = m[1];
    const at = m.index;
    const before = src.slice(Math.max(0, at - 400), at);
    if (
      /import\s[^;]*$|from\s*$|data-slot=$|=\s*$/.test(before) &&
      !/className=$/.test(before) &&
      !/cn\($|cva\($/.test(before.trimEnd())
    ) {
      // a JSX attribute value other than className, or an import: not classes
      if (!/className=$/.test(before)) continue;
    }
    if (
      !/\b(p|px|py|pt|pb|pl|pr|gap|size|h|text|font|opacity|duration|shadow|rounded|bg|border|ring|fill|stroke|divide|outline|placeholder)(-|\b)/.test(
        str,
      )
    )
      continue;
    // the part: the data-slot on the same element, else the cva variant key, else the root
    const tagStart = before.lastIndexOf("<");
    const slot =
      tagStart >= 0
        ? before.slice(tagStart).match(/data-slot="([a-z0-9-]+)"/)?.[1]
        : null;
    const variantKey = before
      .match(/([a-z][a-zA-Z0-9-]*|"[a-z-]+")\s*:\s*$/)?.[1]
      ?.replace(/"/g, "");
    let part =
      slot && slot !== comp ? slot.replace(new RegExp(`^${comp}-`), "") : null;
    if (
      !slot &&
      variantKey &&
      !["className", "variant", "size"].includes(variantKey)
    )
      part = variantKey;
    const classes = str.split(/(\s+)/);
    let changed = false;
    const next = classes.map((cls) => {
      if (
        !cls.trim() ||
        /var\(--/.test(cls) ||
        cls.includes("/") ||
        /^dark:/.test(cls)
      )
        return cls;
      // variants before the last colon outside brackets
      let depth = 0;
      let cut = -1;
      for (let i = 0; i < cls.length; i++) {
        if (cls[i] === "[") depth++;
        else if (cls[i] === "]") depth--;
        else if (cls[i] === ":" && depth === 0) cut = i;
      }
      const prefix = cut >= 0 ? cls.slice(0, cut + 1) : "";
      if (/dark:/.test(prefix)) return cls;
      const util = cls.slice(cut + 1).replace(/^!/, "");
      const hit = map(util, comp);
      if (!hit) return cls;
      if (hit.moved) {
        report.fixed.push(
          `${comp}: ${util} (${hit.from}) has no semantic with the same value; nearest ${hit.sem} is ${hit.to}`,
        );
        return cls;
      }
      const states = prefix
        .split(":")
        .filter(Boolean)
        .map((v) => STATE.find(([re]) => re.test(v))?.[1])
        .filter(Boolean);
      const name = [hit.name, ...new Set(states)].join("-");
      const base = [
        "component",
        comp,
        ...(part ? part.split("-") : []),
        name,
      ].join(".");
      let path = keyOf.get(`${base}|${hit.sem}`);
      if (!path) {
        path = base;
        for (let n = 2; made.has(path) && made.get(path) !== hit.sem; n++)
          path = `${base}-${n}`;
        made.set(path, hit.sem);
        keyOf.set(`${base}|${hit.sem}`, path);
      }
      changed = true;
      return `${prefix}${hit.out(cssVar(path))}`;
    });
    if (!changed) continue;
    out += src.slice(last, at) + `"${next.join("")}"`;
    last = at + m[0].length;
  }
  if (!made.size) continue;
  out += src.slice(last);
  report.comps++;
  report.tokens += made.size;
  if (!dry) writeFileSync(UI + f, out);
  // the tokens: in the grammar and every scheme
  const keys = [...made.entries()];
  const gc =
    g.components.find((c) => c.id === comp) ??
    (g.components.push({
      id: comp,
      description: `The ${comp.replace(/-/g, " ")} component.`,
      keys: [],
    }),
    g.components.at(-1));
  for (const [path, sem] of keys) {
    const rel = path.replace(`component.${comp}.`, "");
    const id = `${comp}/${rel.replace(/\./g, "/")}`;
    if (!gc.keys.includes(id)) gc.keys.push(id);
    if (!g.component_keys.some((k) => k.id === id))
      g.component_keys.push({
        id,
        component: comp,
        description:
          `${rel.replace(/[.-]/g, " ")} of the ${comp.replace(/-/g, " ")}.`.replace(
            /^./,
            (c) => c.toUpperCase(),
          ),
        default: sem,
      });
    for (const s of Object.values(schemes)) {
      const segs = rel.split(".");
      let n = (s.tokens.component[comp] ??= {});
      for (const seg of segs.slice(0, -1)) {
        if (n[seg]?.$value !== undefined) n[seg] = { "@": n[seg] };
        n = n[seg] ??= {};
      }
      const lastSeg = segs.at(-1);
      const tok = {
        $value: `{${sem}}`,
        $description: g.component_keys.find((k) => k.id === id).description,
      };
      if (n[lastSeg] && n[lastSeg].$value === undefined) n[lastSeg]["@"] = tok;
      else n[lastSeg] = tok;
    }
  }
}
if (!dry) {
  writeFileSync(
    ROOT + "schemes/grammar.json",
    JSON.stringify(g, null, 2) + "\n",
  );
  for (const [id, s] of Object.entries(schemes))
    writeFileSync(
      ROOT + `schemes/${id}.json`,
      JSON.stringify(s, null, 2) + "\n",
    );
}
const fixed = [...new Set(report.fixed)];
console.log(
  `${report.comps} components, ${report.tokens} new tokens; ${fixed.length} fixed values left for new semantics`,
);
if (!dry)
  writeFileSync(
    ROOT + "harness/component-api-fixed.json",
    JSON.stringify(
      {
        description:
          "OD-234: fixed values with no semantic of the same value yet. Each needs a new semantic (for example space.indent or size.avatar), decided with the owner, before it becomes a token.",
        values: fixed,
      },
      null,
      2,
    ) + "\n",
  );
console.log(fixed.join("\n"));
