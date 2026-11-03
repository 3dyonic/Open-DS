// How foregrounds pair with fills (OD-222), shared by the harness, the CLI, the MCP and the docs.
//
// Every fill states its tone, light or dark, in each brand and mode: a decision, written on the fill in
// the theme as $extensions["open-ds"].tone. What sits on a fill comes from its tone's set,
// color.on-light or color.on-dark. color.text.*, color.text.link, color.border.strong and
// color.border.focus are the mode's own set: the one that sits on the page's own surfaces.
// The grammar's semantics.tones lists the roles, their contrast and what each fill carries.

const OWN = {
  "color.text.primary": "text.primary",
  "color.text.secondary": "text.secondary",
  "color.text.muted": "text.muted",
  "color.text.link": "link",
  "color.border.strong": "border",
  "color.border.focus": "focus",
};

/** The tone and role of a key in a tone set, or null. tone is "light", "dark" or "own" (the mode's own set). */
export function toneRole(id) {
  const m = id.match(/^color\.on-(light|dark)\.(.+)$/);
  if (m) return { tone: m[1], role: m[2] };
  return OWN[id] ? { tone: "own", role: OWN[id] } : null;
}

/** The fills a key may sit on: its listed pairs, or every fill that carries its role. */
export function sitsOn(g, k) {
  if (k.pairs?.on) return k.pairs.on;
  const r = toneRole(k.id);
  if (!r) return [];
  return (g.semantics?.tones?.fills ?? [])
    .filter((f) => f.carries.includes(r.role))
    .map((f) => f.id);
}

const node = (tree, path) =>
  path
    .split(".")
    .reduce((n, p) => (n && typeof n === "object" ? n[p] : undefined), tree);

/** A fill's decision in one brand's theme and mode: { tone, waits } or null. */
export function toneOf(theme, mode, fill) {
  const x = node(theme?.[mode], fill)?.$extensions?.["open-ds"];
  return x ? { tone: x.tone, waits: x.waits } : null;
}

/** The pairs to check in one brand and mode: [{ key, on, contrast, waits }]. */
export function pairsIn(g, scheme, brand, mode) {
  const theme = scheme.tokens.brands[brand].theme;
  const own = toneOf(theme, mode, "color.surface.canvas")?.tone ?? mode;
  const out = [];
  for (const k of g.semantics?.keys ?? []) {
    if (!k.pairs?.contrast) continue;
    if (k.pairs.on) {
      for (const on of k.pairs.on)
        out.push({ key: k.id, on, contrast: k.pairs.contrast });
      continue;
    }
    const r = toneRole(k.id);
    if (!r) continue;
    const want = r.tone === "own" ? own : r.tone;
    for (const f of g.semantics.tones.fills) {
      if (!f.carries.includes(r.role)) continue;
      const t = toneOf(theme, mode, f.id);
      if (t?.tone === want)
        out.push({
          key: k.id,
          on: f.id,
          contrast: k.pairs.contrast,
          ...(t.waits && { waits: t.waits }),
        });
    }
  }
  return out;
}
