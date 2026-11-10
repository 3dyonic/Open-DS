// OD-234: every component gets its own token API. For each component in ui/src/components, every class
// that reads a system value directly (a shadcn color, a corner, a shadow, a Tailwind spacing, size, text
// size, weight, speed or opacity) becomes the component's own token, which aliases a semantic token. The
// class is rewritten to read the component's CSS variable; the token is written into the grammar and
// every scheme. Run once per change of the rules: node scripts/component-api.mjs [--dry]
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { SHADCN, SHADCN_SCALE } from "../cli/src/shadcn.mjs";
import { stepFor } from "../cli/src/spacing-map.mjs";

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
// spacing semantics by kind: a padding takes the inset of its kind of component, a gap the gap family
const SPACE = {
  container: ["space.inset.container"],
  control: ["space.inset.control-x"],
  cell: ["space.inset.cell-x"],
  gap: [
    "space.gap.tight",
    "space.gap.default",
    "space.gap.group",
    "space.gap.section",
  ],
};
// the semantic of the right kind with the same value; none means a new semantic is needed
const nearest = (want, kinds) => {
  const all = kinds
    .flatMap((k) => SPACE[k])
    .map((p) => ({ p, v: rem(valueOf(p)) }));
  const same = all.find((x) => Math.abs(x.v - want) < 1e-6);
  if (same) return { sem: same.p, moved: false };
  // OD-235: no semantic of the same value → the step of the component spacing map
  if (want > 0)
    return { sem: `component-spacing-map.${stepFor(want * 16)}`, moved: false };
  const best = all.sort(
    (a, b) => Math.abs(a.v - want) - Math.abs(b.v - want),
  )[0];
  return { sem: best.p, moved: true, from: `${want}rem`, to: `${best.v}rem` };
};
const css2path = (c) => {
  // a CSS name back to its token path: try every way of grouping its dashes into segments, so
  // border-width-focus finds border-width.focus and color-action-primary finds color.action.primary.@
  const seg = c.split("-");
  const tries = [];
  for (let mask = 0; mask < 1 << (seg.length - 1); mask++) {
    const parts = [seg[0]];
    for (let i = 1; i < seg.length; i++)
      mask & (1 << (i - 1))
        ? (parts[parts.length - 1] += `-${seg[i]}`)
        : parts.push(seg[i]);
    tries.push(parts.join("."));
  }
  for (const q of tries) {
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
    const r = nearest(want, [
      /^(table|data-table)$/.test(comp)
        ? "cell"
        : CONTAINERS.test(comp)
          ? "container"
          : "control",
    ]);
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
      ...nearest(want, ["gap"]),
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
  if ((m = util.match(/^h-([\d.]+)$/))) {
    // a height takes the size semantic with the same value (a control, a row, an icon), else stays fixed
    const want = TW(m[1]);
    const sizes = [
      "size.control.default",
      "size.control.compact",
      "size.control.large",
      "size.row",
      "size.icon",
    ];
    const same = sizes.find((p) => Math.abs(rem(valueOf(p)) - want) < 1e-6);
    return same
      ? { name: "height", sem: same, out: (v) => `h-[var(${v})]` }
      : {
          name: "height",
          sem: "size.control.default",
          moved: true,
          from: `${want}rem`,
          to: `${rem(valueOf("size.control.default"))}rem`,
          out: (v) => `h-[var(${v})]`,
        };
  }
  if ((m = util.match(/^text-(xs|sm|base|lg|xl|2xl)$/))) {
    // shadcn's text sizes already point at the scheme's type tokens (SHADCN_SCALE): same value
    const v = SHADCN_SCALE[`--text-${m[1]}`]?.match(/var\(--(.+)\)/)?.[1];
    const sem = v && css2path(v);
    const lh =
      SHADCN_SCALE[`--text-${m[1]}--line-height`]?.match(/var\(--(.+)\)/)?.[1];
    const lsem = lh && css2path(lh);
    return sem
      ? {
          name: "font-size",
          sem,
          ...(lsem && { also: { name: "line-height", sem: lsem } }),
          out: (x) => `text-[length:var(${x})]`,
        }
      : null;
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
        sem: "radius.pill",
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
      /^(bg|text|border-[tblrxy]|border|ring-offset|ring|fill|stroke|divide|outline|placeholder)-([a-z0-9-]+)$/,
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

// a token name for a class that reads a semantic by hand, from its utility and the semantic's kind
function byPrefix(u, sem) {
  const pre = u.replace(/-?\[.*$/, "");
  const hint = u.match(
    /\[(length|color|font-family|font-weight|line-height|letter-spacing):/,
  )?.[1];
  if (/^\[?font-family/.test(u) || hint === "font-family") return "font-family";
  if (/^\[?font-weight/.test(u) || hint === "font-weight") return "font-weight";
  if (/^\[?line-height/.test(u) || /^leading/.test(pre)) return "line-height";
  if (/^\[?letter-spacing/.test(u) || /^tracking/.test(pre))
    return "letter-spacing";
  const P = {
    p: "padding",
    px: "padding-x",
    py: "padding-y",
    pt: "padding-top",
    pb: "padding-bottom",
    pl: "padding-left",
    pr: "padding-right",
    m: "margin",
    mx: "margin-x",
    my: "margin-y",
    mt: "margin-top",
    mb: "margin-bottom",
    ml: "margin-left",
    mr: "margin-right",
    gap: "gap",
    "gap-x": "gap-x",
    "gap-y": "gap-y",
    size: "size",
    h: "height",
    w: "width",
    "min-h": "min-height",
    "min-w": "min-width",
    "max-w": "max-width",
    rounded: "radius",
    shadow: "shadow",
    opacity: "opacity",
    duration: "duration",
    ease: "easing",
    bg: "background",
    fill: "icon",
    stroke: "icon",
    outline: "outline",
    divide: "border",
  };
  if (P[pre]) return P[pre];
  if (pre === "text") return sem.startsWith("type.") ? "font-size" : "label";
  if (/^border/.test(pre))
    return sem.startsWith("border-width") ? "border-width" : "border";
  if (pre === "ring")
    return sem.startsWith("border-width") ? "focus-ring-width" : "focus-ring";
  if (pre === "ring-offset")
    return sem.startsWith("border-width")
      ? "focus-ring-offset-width"
      : "focus-ring-offset";
  return sem
    .split(".")
    .filter((x) => x !== "@")
    .slice(-1)[0];
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
  [/^dark$/, "dark"],
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
    // the data-slot only counts when the string sits inside that same element's opening tag
    const inTag =
      tagStart >= 0 && !before.slice(tagStart).replace(/=>/g, "").includes(">");
    const slot = inTag
      ? before.slice(tagStart).match(/data-slot="([a-z0-9-]+)"/)?.[1]
      : null;
    const variantKey = before
      .match(/(?:^|[{,\n])\s*([a-zA-Z][\w-]*|"[\w-]+")\s*:\s*$/)?.[1]
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
      if (!cls.trim()) return cls;
      // a class that already reads a semantic by hand (p-[var(--space-inset-container)]) reads it
      // through the component's own token instead
      if (/var\(--/.test(cls)) {
        const u = cls.replace(/^.*:(?=[^\]]*$)/, "").replace(/^!/, "");
        const states = cls
          .slice(0, cls.length - u.length)
          .split(":")
          .filter(Boolean)
          .map((x) => STATE.find(([re]) => re.test(x))?.[1])
          .filter(Boolean);
        let outCls = cls;
        for (const [, v] of cls.matchAll(/var\(--([a-z0-9-]+)\)/g)) {
          const sem = !v.startsWith(`${comp}-`) && css2path(v);
          if (!sem) continue;
          const name = byPrefix(u, sem);
          const base = [
            "component",
            comp,
            ...(part ? part.split("-") : []),
            [name, ...new Set(states)].join("-"),
          ].join(".");
          let path = keyOf.get(`${base}|${sem}`);
          if (!path) {
            path = base;
            for (let n = 2; made.has(path) && made.get(path) !== sem; n++)
              path = `${base}-${n}`;
            made.set(path, sem);
            keyOf.set(`${base}|${sem}`, path);
          }
          outCls = outCls.replace(`var(--${v})`, `var(${cssVar(path)})`);
          changed = true;
        }
        return outCls;
      }
      // variants before the last colon outside brackets
      let depth = 0;
      let cut = -1;
      for (let i = 0; i < cls.length; i++) {
        if (cls[i] === "[") depth++;
        else if (cls[i] === "]") depth--;
        else if (cls[i] === ":" && depth === 0) cut = i;
      }
      const prefix = cut >= 0 ? cls.slice(0, cut + 1) : "";
      // an opacity tint (bg-primary/90) stays on the class; the token carries the color
      const important = cls.endsWith("!") ? "!" : "";
      const [util, tint] = cls
        .slice(cut + 1)
        .replace(/^!|!$/g, "")
        .split("/");
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
      const own = (hname, sem) => {
        const base = [
          "component",
          comp,
          ...(part ? part.split("-") : []),
          [hname, ...new Set(states)].join("-"),
        ].join(".");
        let path = keyOf.get(`${base}|${sem}`);
        if (!path) {
          path = base;
          for (let n = 2; made.has(path) && made.get(path) !== sem; n++)
            path = `${base}-${n}`;
          made.set(path, sem);
          keyOf.set(`${base}|${sem}`, path);
        }
        return path;
      };
      const path = own(hit.name, hit.sem);
      changed = true;
      // a text size brings its line height (text-sm sets both); an explicit /leading on the class wins
      if (hit.also && !tint)
        return `${prefix}${hit.out(cssVar(path))}/[var(${cssVar(own(hit.also.name, hit.also.sem))})]${important}`;
      return `${prefix}${hit.out(cssVar(path))}${tint ? `/${tint}` : ""}${important}`;
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
