// Builds one scope page for one scheme. Every scope has the same five method questions and
// the same parts (owned tokens, landing components, situations), so one builder serves all.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { answerOf, grammar, scheme, schemes, type Scheme } from "./schemes";

type Tree = { [k: string]: Tree | unknown };
const tokensDir = join(process.cwd(), "..", "tokens", "dist");
const readTheme = (id: string, theme: string): Tree =>
  JSON.parse(readFileSync(join(tokensDir, id, `${theme}.tokens.json`), "utf8"));

const get = (tree: unknown, path: string): unknown =>
  path
    .split(".")
    .reduce<unknown>((n, p) => (n && typeof n === "object" ? (n as Tree)[p] : undefined), tree);

function merge(a: Tree, b: Tree): Tree {
  const out: Tree = { ...a };
  for (const [k, v] of Object.entries(b))
    out[k] =
      v && typeof v === "object" && !("$value" in (v as Tree)) && out[k]
        ? merge(out[k] as Tree, v as Tree)
        : v;
  return out;
}

const isToken = (v: unknown) => !!v && typeof v === "object" && "$value" in (v as Tree);

function leaves(
  node: unknown,
  path: string,
): { path: string; ref: unknown; description?: string }[] {
  if (isToken(node)) {
    const t = node as { $value: unknown; $description?: string };
    return [{ path, ref: t.$value, description: t.$description }];
  }
  if (!node || typeof node !== "object") return [];
  return Object.entries(node as Tree)
    .filter(([k]) => !k.startsWith("$"))
    .flatMap(([k, v]) => leaves(v, `${path}.${k}`));
}

/** Where a scope's owned paths live in a scheme: semantics, brand primitives, keys or words. */
function sources(s: Scheme): Tree[] {
  const t = s.tokens as unknown as {
    semantic: { base: Tree; light: Tree };
    brands: Record<string, { primitive: Tree }>;
    component: Tree;
    content: Tree;
  };
  return [
    merge(t.semantic.base, t.semantic.light),
    Object.values(t.brands)[0].primitive,
    { component: t.component },
    { content: t.content },
  ];
}

export function ownedTokens(s: Scheme, owns: string[]) {
  const src = sources(s);
  return owns.flatMap((o) => {
    const tree = src.find((x) => get(x, o) !== undefined);
    return tree ? leaves(get(tree, o), o) : [];
  });
}

const show = (v: unknown) =>
  typeof v === "string"
    ? v
    : Array.isArray(v)
      ? `cubic-bezier(${v.join(", ")})`
      : v && typeof v === "object"
        ? Object.values(v as Tree).join(" ")
        : String(v);

/** Roles: the children of each owned path, or the leaves when the path has no groups. */
function roles(list: ReturnType<typeof ownedTokens>, owns: string[]) {
  const out = new Map<string, number>();
  for (const t of list) {
    const base = owns.find((o) => t.path === o || t.path.startsWith(`${o}.`))!;
    const rest = t.path.slice(base.length + 1).split(".");
    const role = rest[0] ? `${base.split(".").pop()}.${rest[0]}` : base;
    out.set(role, (out.get(role) ?? 0) + 1);
  }
  return [...out.entries()].map(([name, count]) => ({ name, count }));
}

/** How many distinct primitives each family gives this scope, e.g. 6 font sizes. */
function families(list: ReturnType<typeof ownedTokens>) {
  const out = new Map<string, Set<string>>();
  for (const t of list) {
    const r = typeof t.ref === "string" && t.ref.startsWith("{") ? t.ref.slice(1, -1) : null;
    if (!r) continue;
    const fam = r.split(".").slice(0, -1).join(".");
    if (!out.has(fam)) out.set(fam, new Set());
    out.get(fam)!.add(r);
  }
  return [...out.entries()].map(([name, set]) => ({ name, count: set.size }));
}

const rem = (v: string) =>
  /^-?[\d.]+rem$/.test(v) ? `${v} · ${Math.round(parseFloat(v) * 16)}px` : v;
const lower = (t: string) => (/^[A-Z]{2}/.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1));

export function scopePage(schemeId: string, scopeId: string) {
  const g = grammar();
  const s = scheme(schemeId);
  const all = schemes();
  const scope = g.scopes.find((x) => x.id === scopeId)!;
  const owns = scope.owns ?? [];
  const theme = s.themes[0];
  const darkTheme = s.themes.find((t) => t.brand === theme.brand && t.mode === "dark")!;
  const light = readTheme(schemeId, theme.id);
  const dark = readTheme(schemeId, darkTheme.id);
  const list = ownedTokens(s, owns);
  const value = (tree: Tree, path: string, ref: unknown) => {
    const v = get(tree, path);
    return show(
      v === undefined ||
        (v && typeof v === "object" && !Array.isArray(v) && !("color" in (v as Tree)))
        ? ref
        : v,
    );
  };
  // What a token points to in dark mode, when its semantics differ there.
  const sem = s.tokens as unknown as { semantic: { base: Tree; dark: Tree } };
  const darkTree = merge(sem.semantic.base, sem.semantic.dark);
  const refOf = (v: unknown) => (typeof v === "string" && v.startsWith("{") ? v.slice(1, -1) : "");
  const tokens = list.map((t) => ({
    path: t.path,
    ref: show(t.ref),
    lightRef: refOf(t.ref),
    darkRef: refOf((get(darkTree, t.path) as Tree | undefined)?.$value ?? t.ref),
    light: value(light, t.path, t.ref),
    dark: value(dark, t.path, t.ref),
    description: t.description,
  }));
  const others = all.map((o) => roles(ownedTokens(o, owns), owns));
  const myRoles = roles(list, owns).map((r) => ({
    ...r,
    max: Math.max(...others.map((o) => o.find((x) => x.name === r.name)?.count ?? 0)),
  }));
  const maxRoles = Math.max(...others.map((o) => o.length));
  const otherFams = all.map((o) => families(ownedTokens(o, owns)));
  const counts = families(list).map((f) => ({
    ...f,
    max: Math.max(...otherFams.map((o) => o.find((x) => x.name === f.name)?.count ?? 0)),
  }));
  const reasonIds = g.reasons.map((r) => r.id);
  const cited: string[] = [];
  const qs = scope.questions.map((q) => {
    const a = answerOf(s, g, q.id);
    for (const b of a.answer.because) {
      const grp = b.split(".")[0];
      if (reasonIds.includes(grp) && !cited.includes(grp)) cited.push(grp);
    }
    return {
      ...q,
      chosen: a.option.id,
      label: a.option.label,
      why: a.answer.why,
      because: a.answer.because,
    };
  });
  const tag = (id: string) => {
    const grp = id.split(".")[0];
    if (reasonIds.includes(grp)) return `R${cited.indexOf(grp) + 1}`;
    if (grp === scopeId) return `Q${scope.questions.findIndex((q) => q.id === id) + 1}`;
    return `${g.scopes.find((x) => x.id === grp)?.title ?? grp} ${id.split(".")[1]}`;
  };
  const refs = [
    ...new Set(
      tokens
        .map((t) => t.ref)
        .filter((r) => r.startsWith("{"))
        .map((r) => r.slice(1, -1).split(".").slice(0, -1).join(".")),
    ),
  ];
  const keys = g.component_keys.filter((k) => owns.some((o) => k.default.startsWith(o)));
  return {
    scheme: { id: s.id, name: s.name },
    scope: { id: scope.id, title: scope.title, description: scope.description },
    reasons: cited.map((grp, i) => {
      const r = g.reasons.find((x) => x.id === grp)!;
      return {
        tag: `R${i + 1}`,
        title: r.title,
        text: r.questions
          .map((q, i) => (i ? lower : (x: string) => x)(answerOf(s, g, q.id).option.label))
          .join(", "),
      };
    }),
    questions: qs.map((q) => ({ ...q, because: q.because.map((b) => ({ id: b, tag: tag(b) })) })),
    roles: myRoles,
    counts,
    primitives: families(list).map((f) => {
      const refs = [
        ...new Set(
          list
            .map((t) =>
              typeof t.ref === "string" && t.ref.startsWith(`{${f.name}.`)
                ? t.ref.slice(1, -1)
                : null,
            )
            .filter(Boolean),
        ),
      ] as string[];
      return {
        family: f.name,
        tokens: refs.map((r) => ({ path: r, value: rem(show(get(light, r))) })),
      };
    }),
    groups: myRoles.map((r) => {
      const prefix =
        owns
          .map((o) => o.split(".").slice(0, -1).join("."))
          .find((p) => tokens.some((t) => t.path.startsWith(p ? `${p}.${r.name}` : r.name))) ?? "";
      const full = prefix ? `${prefix}.${r.name}` : r.name;
      return {
        role: r.name,
        rows: tokens
          .filter((t) => t.path === full || t.path.startsWith(`${full}.`))
          .map((t) => ({
            prop: t.path === full ? r.name.split(".").pop()! : t.path.slice(full.length + 1),
            light: rem(t.light),
            dark: rem(t.dark),
            lightRef: t.lightRef,
            darkRef: t.darkRef,
          })),
      };
    }),
    maxRoles,
    refs,
    tokens,
    lands: scope.lands_in!.map((c) => ({
      id: c,
      keys: keys.filter((k) => k.component === c).map((k) => k.id),
    })),
    usage: s.usage
      .filter((u) => g.situations.find((x) => x.id === u.situation)!.scope === scopeId)
      .map((u) => ({ ...u, title: g.situations.find((x) => x.id === u.situation)!.title })),
    // A line of the scheme's own content, for type samples.
    sample: (() => {
      const m = (s as unknown as { samples: { metrics: { label: string; value: string }[] } })
        .samples.metrics[0];
      return `${m.label} ${m.value}`;
    })(),
    line: `${scope.title} in ${s.name}: ${lower(qs[3].label)}. ${qs[3].why} ${qs[4].why}`,
  };
}
export type ScopePage = ReturnType<typeof scopePage>;
