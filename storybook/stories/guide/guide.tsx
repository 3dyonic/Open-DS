// The design system's own guide in Storybook (OD-178): the Introduction, the Foundations pages and the
// blocks of every component's docs page. Everything comes from the scheme (its answers, inventory,
// usage rules, voice and tokens) and the grammar's component reference (OD-185), so each design
// system shows its own text. Token values are read live from CSS variables, so the pages follow the
// scheme, brand and mode chosen in the toolbar. useGuideData (./guide-data) says where the data lives:
// the Open DS Storybook reads the active scheme; a created project reads its own scheme.json. open-ds create
// copies this file and the guide stories into each project.
// No component imports: the pages render with tokens only, so they work in every design system.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useOf } from "@storybook/addon-docs/blocks";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { useGuideData, ABOUT_OPEN_DS } from "./guide-data";

type Any = any;

const CSS = `
.odg{font-family:var(--type-body-font-family);color:var(--color-text-primary);font-size:var(--type-body-font-size);line-height:1.55;max-width:1040px}
.odg h1{font:var(--type-display-font-weight) calc(var(--type-display-font-size)*1.4)/1.1 var(--type-display-font-family);margin:4px 0 8px;letter-spacing:-.01em}
.odg h2{font:var(--type-title-font-weight) var(--type-title-font-size)/1.25 var(--type-title-font-family);margin:40px 0 4px}
.odg h3{font:var(--type-heading-font-weight) var(--type-heading-font-size)/1.3 var(--type-heading-font-family);margin:0 0 6px}
.odg p{margin:0}
.odg .eyebrow{font:500 var(--type-caption-font-size) var(--type-data-font-family);text-transform:uppercase;letter-spacing:.06em;color:var(--color-text-muted)}
.odg .lede{font-size:calc(var(--type-body-font-size)*1.15);color:var(--color-text-secondary);max-width:680px}
.odg .sub{color:var(--color-text-muted);font-size:var(--type-caption-font-size);margin:0 0 14px}
.odg .muted{color:var(--color-text-muted)}
.odg [title]{cursor:help}
.odg .pmotion{position:relative;display:inline-block;width:72px;height:12px;border-radius:9999px;background:var(--color-surface-sunken)}
.odg .pmotion>span{position:absolute;left:0;top:0;width:12px;height:12px;border-radius:9999px;background:var(--color-action-primary);transition-property:left;transition-duration:320ms;transition-timing-function:var(--motion-easing-standard,ease)}
.odg .prim:hover .pmotion>span{left:60px}
@media (prefers-reduced-motion:reduce){.odg .pmotion>span{transition:none}}
.odg .ptile{width:64px;height:40px;border:2px solid var(--color-action-primary);background:var(--color-surface-selected)}
.odg .pline{width:60px;background:var(--color-text-primary)}
.odg .paa{font-weight:600;line-height:1;color:var(--color-text-primary)}
.odg .plead{position:relative;display:inline-block;margin:0 56px 0 8px;white-space:nowrap;font-size:16px;color:var(--color-text-primary);isolation:isolate}
.odg .plead::before{content:"";position:absolute;inset:0 -6px auto -6px;height:1lh;border-left:3px solid var(--color-action-primary);background:var(--color-surface-selected);z-index:-1}
.odg .plead::after{content:attr(data-h);position:absolute;top:0;right:-6px;height:1lh;display:flex;align-items:center;padding-left:6px;transform:translateX(100%);font:500 10px/1 var(--type-data-font-family,monospace);color:var(--color-action-primary)}
.odg .plift{width:56px;height:28px;border-radius:var(--radius-control);background:var(--color-surface-raised,var(--color-surface-default))}
.odg .grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}
.odg .grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}
.odg .grid4{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px}
.odg .card{background:var(--color-surface-default);border:var(--border-width-default) solid var(--color-border-default);border-radius:var(--radius-container);padding:var(--space-inset-container)}
.odg .chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
.odg .chip{display:inline-flex;align-items:center;padding:1px 8px;border-radius:var(--radius-badge);font-size:var(--type-caption-font-size);background:var(--color-surface-sunken);color:var(--color-text-secondary)}
.odg .chip.use{background:var(--color-status-success-subtle);color:var(--color-text-primary)}
.odg .chip.avoid{background:var(--color-status-danger-subtle);color:var(--color-text-primary);text-decoration:line-through}
.odg .dot{display:inline-block;width:8px;height:8px;border-radius:99px;margin-right:6px}
.odg blockquote{margin:0;padding:12px 14px;border-left:3px solid var(--color-border-strong);background:var(--color-surface-sunken);color:var(--color-text-secondary)}
.odg pre{margin:0;padding:12px 14px;background:var(--color-surface-inverse);color:var(--color-text-inverse);border-radius:var(--radius-container);font:var(--type-data-font-size)/1.6 var(--type-data-font-family);overflow:auto;white-space:pre-wrap}
.odg code{font-family:var(--type-data-font-family);font-size:var(--type-data-font-size)}
.odg .step{display:grid;grid-template-columns:28px 1fr 1.2fr;gap:16px;align-items:start;margin-bottom:12px}
.odg .num{width:28px;height:28px;border-radius:var(--radius-control);background:var(--color-surface-inverse);color:var(--color-text-inverse);display:flex;align-items:center;justify-content:center;font-weight:600}
.odg .why{display:flex;gap:8px;align-items:baseline;flex-wrap:wrap;background:var(--color-surface-sunken);border-radius:var(--radius-container);padding:10px 14px;margin:6px 0 16px;color:var(--color-text-secondary);font-size:var(--type-caption-font-size)}
.odg .why b{color:var(--color-text-primary)}
.odg .sw{border:var(--border-width-default) solid var(--color-border-default);border-radius:var(--radius-container);overflow:hidden;background:var(--color-surface-default)}
.odg .sw .chipbox{height:52px;border-bottom:var(--border-width-default) solid var(--color-border-default)}
.odg .sw .meta{padding:8px 10px;font-size:var(--type-caption-font-size)}
.odg .row{display:grid;grid-template-columns:1.3fr 190px 1.2fr;gap:16px;align-items:baseline;padding:12px 0;border-top:var(--border-width-default) solid var(--color-border-default)}
.odg .spec{font:var(--type-caption-font-size) var(--type-data-font-family);color:var(--color-text-muted)}
.odg .bar{height:14px;background:var(--color-status-info-subtle);border-left:3px solid var(--color-status-info)}
.odg .layers{display:grid;grid-template-columns:1fr 18px 1fr 18px 1fr 18px 1fr;align-items:center;gap:6px}
.odg .rule{border:var(--border-width-default) solid var(--color-border-default);border-radius:var(--radius-container);background:var(--color-surface-default);margin-bottom:12px;overflow:hidden}
.odg .rule .t{padding:10px 14px;font-weight:600;border-bottom:var(--border-width-default) solid var(--color-border-default);display:flex;justify-content:space-between;gap:12px}
.odg .dd{display:grid;grid-template-columns:1fr 1fr}
.odg .do,.odg .dont{padding:12px 14px}
.odg .do{border-right:var(--border-width-default) solid var(--color-border-default)}
.odg .lab{font:600 11px var(--type-label-font-family);letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px}
.odg .do .lab{color:var(--color-status-success)} .odg .dont .lab{color:var(--color-status-danger)}
.odg .reason{padding:9px 14px;background:var(--color-surface-sunken);font-size:var(--type-caption-font-size);color:var(--color-text-secondary)}
.odg .variant{display:grid;grid-template-columns:200px 1fr 1fr;gap:16px;align-items:start;padding:14px 0;border-top:var(--border-width-default) solid var(--color-border-default)}
.odg .demo{min-height:44px;display:flex;align-items:center;padding:8px;border-radius:var(--radius-control);background:var(--color-surface-sunken)}
.odg .demo.off{opacity:.4;filter:grayscale(1)}
.odg .not{color:var(--color-status-danger);font-weight:600}
.odg .leftout-chip{color:var(--color-status-warning);background:var(--color-status-warning-subtle);border-color:var(--color-status-warning)}
.odg .cite{font:11px var(--type-data-font-family);color:var(--color-text-muted);margin-top:4px}
.odg a{color:var(--color-text-link)}
.odg .prim{border:var(--border-width-default) solid var(--color-border-default);border-radius:var(--radius-container);overflow:hidden;background:var(--color-surface-default)}
.odg .prim.unused{border-style:dashed}
.odg .prim .c{height:40px;border-bottom:var(--border-width-default) solid var(--color-border-default)}
.odg .prim .t{padding:6px 8px;font-size:var(--type-caption-font-size);line-height:1.4}
.odg .prim .t code{font-family:var(--type-data-font-family)}
.odg .used{color:var(--color-text-link)}
.odg .bar{height:8px;border-radius:2px;background:var(--color-action-primary)}
@media (max-width:720px){.odg .step,.odg .row,.odg .variant,.odg .dd,.odg .layers{grid-template-columns:1fr}.odg .do{border-right:0}}
`;

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="odg sb-unstyled">
      <style>{CSS}</style>
      {children}
    </div>
  );
}

// ---------- data helpers ----------

/** Every leaf token under a semantic group, as {path, cssVar, description}. "@" is a group's base. */
function leaves(node: Any, path: string[] = []): { path: string; cssVar: string; description: string }[] {
  if (!node || typeof node !== "object") return [];
  return Object.entries(node).flatMap(([k, v]: [string, Any]) => {
    if (k.startsWith("$")) return [];
    const p = [...path, k];
    if (v && typeof v === "object" && "$value" in v)
      return [
        {
          path: p.join("."),
          cssVar: `--${p.filter((x) => x !== "@").join("-")}`,
          description: v.$description ?? "",
        },
      ];
    return leaves(v, p);
  });
}

const answer = (s: Any, q: string) => s.answers.find((a: Any) => a.question === q);

/** The live value of CSS variables on the element, re-read when the scheme, brand or mode changes. */
function useVars(names: string[], key: string) {
  const ref = useRef<HTMLDivElement>(null);
  const [vals, setVals] = useState<Record<string, string>>({});
  const joined = names.join(",");
  useEffect(() => {
    const read = () => {
      if (!ref.current) return;
      const cs = getComputedStyle(ref.current);
      setVals(Object.fromEntries(joined.split(",").map((n) => [n, cs.getPropertyValue(n).trim()])));
    };
    read();
    const t = setTimeout(read, 60);
    return () => clearTimeout(t);
  }, [joined, key]);
  return { ref, vals };
}

const get = (tree: Any, path: string) =>
  path.split(".").reduce((n: Any, p) => (n && typeof n === "object" ? n[p] : undefined), tree);

/** The aliases a token points through: component → semantic → theme (brand, light) → primitive. */
function chain(s: Any, path: string) {
  const t = s.tokens;
  const theme: Any = Object.values(t.brands)[0] as Any;
  const trees = [t.component, t.semantic, { theme: { ...theme.theme.base, ...theme.theme.light } }, t.primitive];
  const steps = [path];
  let at = path;
  for (let i = 0; i < 8; i++) {
    const node = trees.map((x) => get(x, at)).find((n) => n && typeof n === "object" && "$value" in n);
    const m = typeof node?.$value === "string" && node.$value.match(/^\{(.+)\}$/);
    if (!m) {
      if (node && i) steps.push(String(node.$value));
      break;
    }
    steps.push(m[1]);
    at = m[1];
  }
  return steps;
}

// ---------- Introduction (OD-179) ----------

// A small number as a word, for headings ("Five design systems"); larger ones stay digits.
const WORDS = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
];
const count = (n: number) => WORDS[n] ?? String(n);

export function Introduction() {
  const { scheme: s, key } = useGuideData();
  const brands = Object.keys(s.tokens.brands);
  const carriesButton = s.inventory.in.some((i: Any) => i.id === "button");
  const msgs = s.samples?.messages;
  const { ref } = useVars([], key);
  return (
    <Frame>
      <div ref={ref}>
        {ABOUT_OPEN_DS && (
          // OD-216: the Open DS Storybook first says what Open DS is, then shows the scheme picked. The
          // scheme's robot changes with the toolbar; Shelf keeps the components. Night editions in dark.
          <section className="about" aria-labelledby="about-open-ds">
            <div className="about-text">
              <div className="eyebrow">Open DS</div>
              <h2 id="about-open-ds">
                {count(ABOUT_OPEN_DS.schemes)} design systems. Same questions. Different answers.
              </h2>
              <p>
                Open DS is a set of design system schemes. Each scheme answers the same questions, such as who uses the
                product, what they do all day and how it should feel, in its own way. Every token, component and rule
                follows from those answers, and each one says why.
              </p>
              <p>
                This Storybook shows every component in every scheme. Pick a scheme and a mode in the toolbar, and every
                page and story changes with it. To start your own design system from {s.name}:
              </p>
              <pre>
                <code>npx open-ds create my-ds --scheme {s.id}</code>
              </pre>
            </div>
            <div className="about-robots" aria-hidden="true">
              {[s.id, "shelf"].map((r) => (
                <span key={r} className="about-robot">
                  <img className="day" src={`robots/${r}.webp`} alt="" />
                  <img className="night" src={`robots/${r}-dark.webp`} alt="" />
                </span>
              ))}
            </div>
          </section>
        )}
        <div className="eyebrow">
          Open DS · {s.name} · v{s.version}
        </div>
        <h1>{s.name}</h1>
        <p className="lede">{s.summary}</p>
        <div className="chips">
          <span className="chip">{s.inventory.in.length} components</span>
          <span className="chip">
            {brands.length > 1 ? `${brands.length} brands, light and dark` : "Light and dark"}
          </span>
          <span className="chip">Every decision has a reason</span>
        </div>

        <h2>What it&apos;s for</h2>
        <p className="sub">
          From the scheme&apos;s answers. If this isn&apos;t your product, another scheme fits better.
        </p>
        <div className="grid2">
          <div className="card">
            <h3>
              <span className="dot" style={{ background: "var(--color-status-success)" }} />
              Use it for
            </h3>
            <p>{s.ai.use_when}</p>
            <div className="chips">
              {s.ai.example_products.map((p: string) => (
                <span key={p} className="chip">
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div className="card">
            <h3>
              <span className="dot" style={{ background: "var(--color-status-danger)" }} />
              Not for
            </h3>
            <p>{s.ai.avoid_when}</p>
          </div>
        </div>

        <h2>Who it&apos;s for</h2>
        <p className="sub">The moments this design system was built around.</p>
        <div className="grid2">
          {s.scenarios.map((x: Any) => (
            <blockquote key={x.text}>{x.text}</blockquote>
          ))}
        </div>

        <h2>How to use it</h2>
        <p className="sub">Components read only tokens, so changing a token changes every component that uses it.</p>
        <div className="step">
          <span className="num">1</span>
          <div>
            <h3>Import the styles</h3>
            <p className="muted">
              Once, at the root of your app. Light and dark come with it{brands.length > 1 ? ", and every brand" : ""}.
            </p>
          </div>
          <pre>{`import "./styles/index.css"; // src/styles/index.css`}</pre>
        </div>
        <div className="step">
          <span className="num">2</span>
          <div>
            <h3>Use a component</h3>
            <p className="muted">Each one has a page under Components, with when to use it and each variant.</p>
          </div>
          <pre>
            {carriesButton
              ? `<Button>${s.samples?.actions?.primary ?? "Continue"}</Button>`
              : `import { ... } from "./components/ui/...";`}
          </pre>
        </div>
        <div className="step">
          <span className="num">3</span>
          <div>
            <h3>Change a token</h3>
            <p className="muted">Edit the source under tokens/src, then rebuild. Storybook and the docs follow.</p>
          </div>
          <pre>npm run tokens</pre>
        </div>

        <h2>Voice</h2>
        <p className="sub">{s.voice.summary.text}</p>
        <div className="card">
          {s.voice.principles.map((p: Any) => (
            <p key={p.text} style={{ padding: "8px 0" }}>
              {p.text}
            </p>
          ))}
          <div className="grid2" style={{ marginTop: 12 }}>
            <div>
              <div className="eyebrow">Words to use</div>
              <div className="chips">
                {s.voice.words.use.map((w: string) => (
                  <span key={w} className="chip use">
                    {w}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="eyebrow">Words to avoid</div>
              <div className="chips">
                {s.voice.words.avoid.map((w: string) => (
                  <span key={w} className="chip avoid">
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {msgs && (
            <p className="muted" style={{ marginTop: 14 }}>
              In this voice: <q>{msgs.success}</q> · <q>{msgs.error.title}</q>
            </p>
          )}
        </div>

        <h2>Explore</h2>
        <div className="grid3">
          <a className="card" href="?path=/story/foundations--overview" target="_top">
            <div className="eyebrow">Foundations</div>
            <h3 style={{ marginTop: 6 }}>Color, type, spacing</h3>
            <p className="muted">The tokens, shown, with the reason for each.</p>
          </a>
          <a className="card" href="?path=/docs/components-button--docs" target="_top">
            <div className="eyebrow">Components · {s.inventory.in.length}</div>
            <h3 style={{ marginTop: 6 }}>Every component</h3>
            <p className="muted">What each is for, when to use it, and each variant here.</p>
          </a>
          <div className="card">
            <div className="eyebrow">Docs site</div>
            <h3 style={{ marginTop: 6 }}>The reasons</h3>
            <p className="muted">
              Every question this system answers, and why: <code>npm run docs</code>.
            </p>
          </div>
        </div>
      </div>
    </Frame>
  );
}

// ---------- Foundations (OD-180) ----------

function Why({ s, scope }: { s: Any; scope: string }) {
  const a = answer(s, `${scope}.definition`);
  if (!a) return null;
  return (
    <div className="why">
      <b>{a.why}</b>
      <span className="spec">
        {scope}.definition: {a.option}
      </span>
    </div>
  );
}

export function FoundationsOverview() {
  const { scheme: s } = useGuideData();
  const steps = chain(s, "button.primary.background.@");
  const labels = ["Component key", "Semantic", "Theme (brand and mode)", "Primitive"];
  return (
    <Frame>
      <div className="eyebrow">Foundations</div>
      <h1>The tokens, and why</h1>
      <p className="lede">
        Every value here is an answer, with its reason. Components never use raw values: they read these tokens, so a
        change here changes every component that uses it.
      </p>
      <h2>Three layers, and the theme between them</h2>
      <p className="sub">
        Primitives hold the values. Semantic tokens give them a job; the theme picks which primitive each job uses in
        each brand and mode. Component keys point components at the jobs. A real chain from {s.name}:
      </p>
      <div className="layers">
        {steps.slice(0, 4).map((x, i) => (
          <div key={x} style={{ display: "contents" }}>
            {i > 0 && <span className="muted">→</span>}
            <div className="card">
              <div className="eyebrow">{labels[i]}</div>
              <code>{x}</code>
            </div>
          </div>
        ))}
      </div>
      <h2>The answers behind the foundations</h2>
      <div className="grid2">
        {["color", "typography", "spacing", "shape", "elevation", "motion"].map((scope) => {
          const a = answer(s, `${scope}.definition`);
          return a ? (
            <div key={scope} className="card">
              <div className="eyebrow">{scope}</div>
              <p style={{ marginTop: 6 }}>{a.why}</p>
              <div className="cite">
                {scope}.definition: {a.option}
              </div>
            </div>
          ) : null;
        })}
      </div>
    </Frame>
  );
}

export function FoundationsColor() {
  const { scheme: s, key } = useGuideData();
  const groups = Object.entries(s.tokens.semantic.color).filter(([k]) => !k.startsWith("$"));
  const all = groups.flatMap(([g, node]) => leaves(node, ["color", g]));
  const { ref, vals } = useVars(
    all.map((t) => t.cssVar),
    key,
  );
  return (
    <Frame>
      <div ref={ref}>
        <div className="eyebrow">Foundations</div>
        <h1>Color</h1>
        <Why s={s} scope="color" />
        {groups.map(([g, node]) => (
          <div key={g}>
            <h2 style={{ textTransform: "capitalize" }}>{g}</h2>
            <div className="grid4">
              {leaves(node, ["color", g]).map((t) => (
                <div key={t.path} className="sw" title={t.description}>
                  <div className="chipbox" style={{ background: `var(${t.cssVar})` }} />
                  <div className="meta">
                    <div style={{ fontWeight: 600 }}>{t.path.replace(/\.@$/, "")}</div>
                    <div className="spec">{vals[t.cssVar]}</div>
                    <div className="muted">{t.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

export function FoundationsTypography() {
  const { scheme: s, key } = useGuideData();
  const roles = Object.keys(s.tokens.semantic.type).filter((k) => !k.startsWith("$"));
  const names = roles.flatMap((r) =>
    ["font-size", "font-weight", "font-family", "line-height"].map((p) => `--type-${r}-${p}`),
  );
  const { ref, vals } = useVars(names, key);
  const usedFor = (role: string) =>
    s.usage.filter((u: Any) => u.use === `type.${role}` || u.use.startsWith(`type.${role} `));
  return (
    <Frame>
      <div ref={ref}>
        <div className="eyebrow">Foundations</div>
        <h1>Typography</h1>
        <Why s={s} scope="typography" />
        {roles.map((r) => (
          <div key={r} className="row">
            <div
              style={{
                font: `var(--type-${r}-font-weight) var(--type-${r}-font-size)/var(--type-${r}-line-height) var(--type-${r}-font-family)`,
              }}
            >
              {r === "data" ? "2041 · 0.982 · 14:03" : (s.samples?.screen ?? s.name)}
            </div>
            <div className="spec">
              type.{r}
              <br />
              {vals[`--type-${r}-font-size`]} · {vals[`--type-${r}-font-weight`]} ·{" "}
              {(vals[`--type-${r}-font-family`] ?? "").split(",")[0].replaceAll('"', "")}
            </div>
            <div className="muted">
              {usedFor(r).map((u: Any) => (
                <p key={u.situation}>
                  <b>{u.situation.replaceAll("-", " ")}:</b> {u.why}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

export function FoundationsSpacing() {
  const { scheme: s, key } = useGuideData();
  const space = leaves(s.tokens.semantic.space, ["space"]);
  const size = leaves(s.tokens.semantic.size, ["size"]);
  const { ref, vals } = useVars(
    [...space, ...size].map((t) => t.cssVar),
    key,
  );
  const List = ({ items }: { items: typeof space }) => (
    <div style={{ display: "grid", gap: 8 }}>
      {items.map((t) => (
        <div
          key={t.path}
          style={{ display: "grid", gridTemplateColumns: "220px 1fr 90px", gap: 12, alignItems: "center" }}
        >
          <span>
            {t.path}
            <div className="muted" style={{ fontSize: "var(--type-caption-font-size)" }}>
              {t.description}
            </div>
          </span>
          <div className="bar" style={{ width: `var(${t.cssVar})` }} />
          <span className="spec">{vals[t.cssVar]}</span>
        </div>
      ))}
    </div>
  );
  return (
    <Frame>
      <div ref={ref}>
        <div className="eyebrow">Foundations</div>
        <h1>Spacing and density</h1>
        <Why s={s} scope="spacing" />
        <h2>Space</h2>
        <List items={space} />
        <h2>Sizes</h2>
        <List items={size} />
      </div>
    </Frame>
  );
}

export function FoundationsShape() {
  const { scheme: s, key } = useGuideData();
  const radius = leaves(s.tokens.semantic.radius, ["radius"]);
  const elevation = leaves(s.tokens.semantic.elevation, ["elevation"]);
  const { ref, vals } = useVars(
    [...radius, ...elevation].map((t) => t.cssVar),
    key,
  );
  return (
    <Frame>
      <div ref={ref}>
        <div className="eyebrow">Foundations</div>
        <h1>Shape and elevation</h1>
        <Why s={s} scope="shape" />
        <div className="grid4">
          {radius.map((t) => (
            <div key={t.path} style={{ textAlign: "center" }}>
              <div
                style={{
                  height: 72,
                  border: "2px solid var(--color-border-strong)",
                  borderRadius: `var(${t.cssVar})`,
                  background: "var(--color-surface-default)",
                  marginBottom: 6,
                }}
              />
              <code>{t.path}</code>
              <div className="spec">{vals[t.cssVar]}</div>
            </div>
          ))}
        </div>
        <h2>Elevation</h2>
        <Why s={s} scope="elevation" />
        <div className="grid3">
          {elevation.map((t) => (
            <div key={t.path} className="card" style={{ boxShadow: `var(${t.cssVar})`, minHeight: 90 }}>
              <code>{t.path}</code>
              <p className="muted">{t.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/** Every primitive, its value, and what points to it (OD-184). Unused primitives stay, dashed. */
function primitiveUse(s: Any) {
  const used: Record<string, string[]> = {};
  const scan = (node: Any, path: string, where: string) => {
    if (!node || typeof node !== "object") return;
    if ("$value" in node) {
      for (const m of JSON.stringify(node.$value).matchAll(/\{([^}]+)\}/g))
        (used[m[1]] ??= []).push(`${path.replace(/\.@$/, "")} (${where})`);
      return;
    }
    for (const [k, v] of Object.entries(node)) if (!k.startsWith("$")) scan(v, path ? `${path}.${k}` : k, where);
  };
  for (const brand of Object.values(s.tokens.brands ?? {}) as Any[])
    for (const [mode, tree] of Object.entries(brand.theme ?? {})) scan(tree, "", mode === "base" ? "every mode" : mode);
  scan(s.tokens.semantic, "", "semantic");
  scan(s.tokens.component, "", "component key");
  return used;
}

function primitiveLeaves(node: Any, path: string[] = []): { path: string; value: Any }[] {
  if (!node || typeof node !== "object") return [];
  if ("$value" in node) return [{ path: path.join("."), value: node.$value }];
  return Object.entries(node)
    .filter(([k]) => !k.startsWith("$"))
    .flatMap(([k, v]) => primitiveLeaves(v, [...path, k]));
}

const showValue = (v: Any) =>
  Array.isArray(v)
    ? `cubic-bezier(${v.join(", ")})`
    : v && typeof v === "object"
      ? `${v.offsetY} ${v.blur ?? ""} ${v.color}`
      : String(v);

/**
 * One primitive shown as itself (OD-220), as the docs show it: a corner as a rounded tile, a type size
 * or weight as Aa, a line height as two lines, a shadow as a lifted box. Only space and size are bars.
 */
function PrimSample({
  path,
  value,
  n,
  max,
  stages,
}: {
  path: string;
  value: Any;
  n: number | null;
  max: number;
  stages?: Record<"light" | "dark", { canvas: string; raised: string }>;
}) {
  const v = showValue(value);
  const box = { padding: "16px 8px 0", minHeight: 44, display: "flex", alignItems: "flex-end" } as const;
  if (path.startsWith("radius."))
    return (
      <div style={box}>
        <div className="ptile" style={{ borderRadius: String(value) === "9999px" ? 9999 : v }} />
      </div>
    );
  if (path.startsWith("border-width."))
    return (
      <div style={box}>
        <div className="pline" style={{ height: v }} />
      </div>
    );
  if (path.startsWith("font.size."))
    return (
      <div style={box}>
        <span className="paa" style={{ fontSize: `min(${v}, 40px)` }}>
          Aa
        </span>
      </div>
    );
  if (path.startsWith("font.weight."))
    return (
      <div style={box}>
        <span className="paa" style={{ fontWeight: v }}>
          Aa
        </span>
      </div>
    );
  if (path.startsWith("font.line-height.")) {
    // The line box (OD-221): one line of Ag at a fixed 16px on a band exactly one line height tall.
    const px = Math.round(Number(String(value).replace(/rem$/, "")) * 16);
    return (
      <div style={box}>
        <span className="plead" style={{ lineHeight: v }} data-h={`${px}px`}>
          Ag Ag Ag
        </span>
      </div>
    );
  }
  if (path.startsWith("font.letter"))
    return (
      <div style={box}>
        <span className="paa" style={{ letterSpacing: v }}>
          Aa Aa
        </span>
      </div>
    );
  if (path.startsWith("font.family."))
    return (
      <div style={box}>
        <span className="paa" style={{ fontFamily: v }}>
          Aa 123
        </span>
      </div>
    );
  if (path.startsWith("duration.") || path.startsWith("easing."))
    return (
      <div style={box} title="Hover to play">
        <span className="pmotion">
          <span
            style={
              path.startsWith("duration.")
                ? { transitionDuration: v }
                : { transitionTimingFunction: Array.isArray(value) ? `cubic-bezier(${value.join(",")})` : v }
            }
          />
        </span>
      </div>
    );
  if (path.startsWith("shadow.")) {
    // A shadow belongs to a mode: show it on that mode's own canvas and raised surface, whichever mode
    // Storybook is in (OD-220). The -dark shadows are the dark mode's; the rest are light.
    const stage = stages?.[/-dark$/.test(path) ? "dark" : "light"];
    return (
      <div style={{ ...box, background: stage?.canvas, borderRadius: 8, padding: 12, marginTop: 8 }}>
        <div
          className="plift"
          style={{
            background: stage?.raised,
            boxShadow: `${value?.offsetX ?? "0px"} ${value?.offsetY ?? "0px"} ${value?.blur ?? "0px"} ${value?.spread ?? "0px"} ${value?.color ?? "transparent"}`,
          }}
        />
      </div>
    );
  }
  if (path.startsWith("opacity."))
    return (
      <div style={box}>
        <div className="ptile" style={{ background: "var(--color-text-primary)", opacity: Number(value) }} />
      </div>
    );
  if (n !== null)
    return (
      <div style={{ padding: "16px 8px 0" }}>
        <div className="bar" style={{ width: `${Math.max(4, (n / max) * 100)}%` }} />
      </div>
    );
  return null;
}

/** The kinds of primitive, one Storybook page each (OD-195), the same as the docs' Primitives section. */
export const PRIMITIVE_KINDS: { id: string; title: string; match: (p: string) => boolean }[] = [
  { id: "color", title: "Color", match: (p) => p.startsWith("color.") },
  { id: "space-and-size", title: "Space and size", match: (p) => /^(space|size)\./.test(p) },
  { id: "shape", title: "Shape", match: (p) => /^(radius|border-width)\./.test(p) },
  { id: "type", title: "Type", match: (p) => p.startsWith("font.") },
  { id: "motion", title: "Motion", match: (p) => /^(duration|easing)\./.test(p) },
  { id: "effects", title: "Effects", match: (p) => /^(opacity|shadow)\./.test(p) },
];

export function Primitives({ kind }: { kind: string }) {
  const { scheme: s } = useGuideData();
  const used = primitiveUse(s);
  const k = PRIMITIVE_KINDS.find((x) => x.id === kind) ?? PRIMITIVE_KINDS[0];
  const every = primitiveLeaves(s.tokens.primitive);
  const all = every.filter((x) => k.match(x.path));
  const family = (p: string) => {
    const x = p.split(".");
    return x[0] === "color" ? x.slice(0, 3).join(".") : x[0] === "font" ? x.slice(0, 2).join(".") : x[0];
  };
  const families = [...new Set(all.map((x) => family(x.path)))];
  const nUsed = all.filter((x) => used[x.path]).length;
  // Each mode's canvas and raised surface, resolved to their primitive values, for the shadow stages.
  const resolve = (ref: Any): string => {
    for (let i = 0, v = ref; i < 6; i++) {
      const m = typeof v === "string" && v.match(/^\{(.+)\}$/);
      if (!m) return String(v);
      v = m[1].split(".").reduce((o: Any, k: string) => o?.[k], s.tokens.primitive)?.$value;
    }
    return "";
  };
  const firstBrand = Object.values(s.tokens.brands ?? {})[0] as Any;
  const stage = (mode: "light" | "dark") => ({
    canvas: resolve(firstBrand?.theme?.[mode]?.color?.surface?.canvas?.$value),
    raised: resolve(firstBrand?.theme?.[mode]?.color?.surface?.raised?.$value),
  });
  const stages = { light: stage("light"), dark: stage("dark") };
  const rem = (v: Any) => {
    const m = String(v).match(/^([\d.]+)(rem|px)$/);
    return m ? +m[1] * (m[2] === "rem" ? 16 : 1) : null;
  };
  return (
    <Frame>
      <div className="eyebrow">Primitives</div>
      <h1>{k.title}</h1>
      <p className="lede">
        The raw {k.title.toLowerCase()} values in {s.name}. Primitives hold the values; semantic tokens give them a job,
        and components read only the jobs.
      </p>
      <p style={{ marginTop: 10 }}>
        <b>{all.length}</b> primitives. <b>{nUsed}</b> are used. <b>{all.length - nUsed}</b> are not used yet: they
        stay, so a brand or a changed answer can use them without adding a value. Hover one to see what points to it.
      </p>
      {families.map((f) => {
        const list = all.filter((x) => family(x.path) === f);
        const max = Math.max(1, ...list.map((x) => rem(x.value) ?? 0));
        return (
          <div key={f}>
            <h2>
              <code>{f}</code>
            </h2>
            <p className="sub">
              {list.filter((x) => used[x.path]).length} of {list.length} used
            </p>
            <div className="grid4">
              {list.map((x) => {
                const u = used[x.path] ?? [];
                const n = rem(x.value);
                return (
                  <div
                    key={x.path}
                    className={`prim${u.length ? "" : " unused"}`}
                    title={u.join("\n") || "Not used yet"}
                  >
                    {f.startsWith("color") ? (
                      <div className="c" style={{ background: String(x.value) }} />
                    ) : (
                      <PrimSample path={x.path} value={x.value} n={n} max={max} stages={stages} />
                    )}
                    <div className="t">
                      <code style={{ fontWeight: 600 }}>{x.path.slice(f.length + 1) || x.path}</code>
                      <div className="muted">
                        <code>{showValue(x.value)}</code>
                      </div>
                      <div className={u.length ? "used" : "muted"}>
                        {u.length ? `${u.length} use${u.length > 1 ? "s" : ""}` : "Not used yet"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </Frame>
  );
}

export function FoundationsMotion() {
  const { scheme: s, key } = useGuideData();
  const motion = leaves(s.tokens.semantic.motion, ["motion"]);
  const { ref, vals } = useVars(
    motion.map((t) => t.cssVar),
    key,
  );
  const [on, setOn] = useState(false);
  const duration = motion.find((t) => t.path.startsWith("motion.duration"))?.cssVar;
  const easing = motion.find((t) => t.path.startsWith("motion.easing"))?.cssVar;
  return (
    <Frame>
      <div ref={ref}>
        <div className="eyebrow">Foundations</div>
        <h1>Motion</h1>
        <Why s={s} scope="motion" />
        {motion.map((t) => (
          <p key={t.path}>
            <code>{t.path}</code> <span className="spec">{vals[t.cssVar]}</span>{" "}
            <span className="muted">{t.description}</span>
          </p>
        ))}
        <div className="card" style={{ marginTop: 16 }}>
          <button
            type="button"
            onClick={() => setOn((x) => !x)}
            style={{
              font: "inherit",
              padding: "6px 12px",
              borderRadius: "var(--radius-control)",
              border: "var(--border-width-default) solid var(--color-border-strong)",
              background: "var(--color-surface-default)",
              color: "var(--color-text-primary)",
              cursor: "pointer",
            }}
          >
            Play
          </button>
          <div style={{ marginTop: 14, height: 40, position: "relative" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "var(--radius-control)",
                background: "var(--color-action-primary)",
                transform: `translateX(${on ? 260 : 0}px)`,
                transition: `transform ${duration ? `var(${duration})` : "200ms"} ${easing ? `var(${easing})` : "ease-out"}`,
              }}
            />
          </div>
          <p className="muted" style={{ marginTop: 8 }}>
            Reduced motion is honoured:{" "}
            {s.usage.find((u: Any) => u.situation === "reduced-motion")?.use ?? "see the docs"}.
          </p>
        </div>
      </div>
    </Frame>
  );
}

// ---------- Component docs page (OD-181) ----------

function useMeta(): Any {
  const resolved: Any = useOf("meta");
  return resolved?.type === "meta" ? resolved : {};
}

function useComponent() {
  const { scheme: s, grammar: g } = useGuideData();
  const meta = useMeta();
  const id: string = meta.preparedMeta?.parameters?.openDs?.component ?? "";
  const item = g.catalogue.items.find((i: Any) => i.id === id);
  const carried = s.inventory.in.find((x: Any) => x.id === id);
  const left = s.inventory.out.find((x: Any) => x.id === id);
  return { s, g, meta, id, item, carried, left };
}

/** Family, purpose (the reference), and whether this design system carries it and why. */
export function ComponentHeader() {
  const { s, item, carried, left } = useComponent();
  if (!item) return null;
  return (
    <Frame>
      <div className="eyebrow">Components · {item.family}</div>
      <p className="lede" style={{ marginTop: 6 }}>
        {item.overview ?? item.description}
      </p>
      {carried ? (
        <p style={{ marginTop: 10 }}>
          <span className="chip">In {s.name}</span>
        </p>
      ) : (
        // OD-192, OD-211: a component the scheme leaves out renders in its tokens like any other. Only
        // the badge, its reason and what to use instead set it apart.
        <p style={{ marginTop: 10 }}>
          <span className="chip leftout-chip" style={{ marginRight: 8 }}>
            Left out of {s.name}
          </span>
          {left?.why}
          {left?.instead?.length ? <span className="muted"> Use instead: {left.instead.join(", ")}.</span> : null}
        </p>
      )}
    </Frame>
  );
}

/** When to use it, when not, and what to use instead (the reference). */
export function WhenToUse() {
  const { s, item, carried } = useComponent();
  if (!item?.apply_when && !carried?.why) return null;
  const carriedIds = new Set(s.inventory.in.map((x: Any) => x.id));
  return (
    <Frame>
      <h2>When to use it</h2>
      {/* OD-211: a kept component's own use leads: where this scheme uses it. */}
      {carried?.why && (
        <p style={{ marginBottom: 12 }}>
          <b>In {s.name}:</b> {carried.why}
        </p>
      )}
      <div className="grid2">
        <div className="card">
          <div className="lab" style={{ color: "var(--color-status-success)" }}>
            Use it when
          </div>
          <p>{item.apply_when}</p>
        </div>
        <div className="card">
          <div className="lab" style={{ color: "var(--color-status-danger)" }}>
            Not when
          </div>
          <p>{item.not_when}</p>
        </div>
      </div>
      {item.vs?.length > 0 && (
        <>
          <h3 style={{ marginTop: 18 }}>Instead</h3>
          <div className="grid3">
            {item.vs.map((v: Any) => (
              <div key={v.id} className="card">
                <div className="eyebrow">
                  {v.outside ? "Outside the catalogue" : carriedIds.has(v.id) ? `In ${s.name}` : `Not in ${s.name}`}
                </div>
                <h3 style={{ marginTop: 4 }}>
                  {!v.outside && carriedIds.has(v.id) ? (
                    <a href={`?path=/docs/components-${v.id}--docs`} target="_top">
                      {v.id}
                    </a>
                  ) : (
                    v.id
                  )}
                </h3>
                <p className="muted">{v.why}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </Frame>
  );
}

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <span className="muted">See the Playground.</span> : this.props.children;
  }
}

/** Each variant: what it is for in general, and this design system's decision, with a live sample. */
export function Variants() {
  const { s, item, carried, meta } = useComponent();
  if (!item?.variants) return null;
  const story: Any =
    Object.values(meta.csfFile?.stories ?? {}).find((x: Any) => x.name === "Playground") ??
    (Object.values(meta.csfFile?.stories ?? {})[0] as Any);
  const C = meta.preparedMeta?.component;
  const render = story?.render ?? meta.preparedMeta?.render ?? (C ? (args: Any) => <C {...args} /> : null);
  const base = {
    ...(meta.csfFile?.meta?.args ?? {}),
    ...(meta.preparedMeta?.initialArgs ?? {}),
    ...(meta.preparedMeta?.args ?? {}),
    ...(story?.args ?? {}),
  };
  return (
    <Frame>
      <h2>Variants</h2>
      <p className="sub">What each variant is for in any design system, and what {s.name} decided.</p>
      {Object.entries(item.variants).map(([axis, list]: [string, Any]) => (
        <div key={axis}>
          <h3 style={{ marginTop: 18 }}>{axis}</h3>
          {list.map((v: Any) => {
            const d = carried?.variants?.[axis]?.[v.id];
            const sample =
              axis === "state" ? null : render ? <Boundary>{render({ ...base, [axis]: v.id }, {})}</Boundary> : null;
            return (
              <div key={v.id} className="variant">
                <div>
                  <code style={{ fontWeight: 700 }}>{v.id}</code>
                  <p className="muted">{v.overview}</p>
                </div>
                <div>{sample && <div className={`demo${d?.not_used ? " off" : ""}`}>{sample}</div>}</div>
                <div>
                  {!carried ? (
                    <p className="muted">Not in {s.name}.</p>
                  ) : !d ? (
                    <p className="muted">Not decided yet.</p>
                  ) : d.not_used ? (
                    <p>
                      <span className="not">Not used here.</span> {d.why}
                    </p>
                  ) : (
                    <p>
                      <b>Here:</b> {d.use}
                    </p>
                  )}
                  {d?.because && <div className="cite">because {d.because.join(", ")}</div>}
                  {!d && (v.apply_when || v.not_when) && (
                    <p className="muted" style={{ marginTop: 4 }}>
                      {v.apply_when} {v.not_when ? `Not: ${v.not_when}` : ""}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </Frame>
  );
}

/** The situations this component serves, as this design system decided them: do, don't and why. */
export function SituationRules() {
  const { s, g, id, item, meta } = useComponent();
  const fromStories: string[] = meta.preparedMeta?.parameters?.openDs?.situations ?? [];
  const named = new Set([...(item?.situations ?? []), ...fromStories]);
  const titles = Object.fromEntries(g.situations.map((x: Any) => [x.id, x.title]));
  const rules = s.usage.filter(
    (u: Any) => named.has(u.situation) || (u.uses ?? []).some((x: Any) => x.component === id),
  );
  if (!rules.length) return null;
  return (
    <Frame>
      <h2>How {s.name} uses it</h2>
      <p className="sub">The situations this component serves, as this design system decided them.</p>
      {rules.map((r: Any) => (
        <div key={r.situation} className="rule">
          <div className="t">
            <span>{titles[r.situation] ?? r.situation}</span>
            <span className="spec">{r.situation}</span>
          </div>
          <div className="dd">
            <div className="do">
              <div className="lab">✓ Do</div>
              <p>{r.use}</p>
              {r.example && <p className="muted">“{r.example}”</p>}
            </div>
            <div className="dont">
              <div className="lab">✕ Don&apos;t</div>
              <p>{r.not}</p>
            </div>
          </div>
          <div className="reason">
            <b>Why:</b> {r.why}
          </div>
        </div>
      ))}
    </Frame>
  );
}

/** Accessibility and keyboard, from the reference. */
export function Accessibility() {
  const { item } = useComponent();
  if (!item?.accessibility?.length && !item?.keyboard?.length) return null;
  return (
    <Frame>
      <h2>Accessibility and keyboard</h2>
      <div className="grid2">
        {item.accessibility?.length > 0 && (
          <div className="card">
            <h3>Accessibility</h3>
            {item.accessibility.map((a: Any) => (
              <p key={a.id} style={{ padding: "4px 0" }}>
                {a.overview}
                {a.not_when && <span className="muted"> Not: {a.not_when}</span>}
              </p>
            ))}
          </div>
        )}
        {item.keyboard?.length > 0 && (
          <div className="card">
            <h3>Keyboard</h3>
            {item.keyboard.map((a: Any) => (
              <p key={a.id} style={{ padding: "4px 0" }}>
                {a.overview}
              </p>
            ))}
          </div>
        )}
      </div>
      {item.source && (
        <p className="cite" style={{ marginTop: 10 }}>
          Reference: {item.source.name}
          {item.source.id ? ` (${item.source.id})` : ""}, {item.source.license}
        </p>
      )}
    </Frame>
  );
}

/** The scheme's words, on components that carry text people read. */
export function Words() {
  const { s, item } = useComponent();
  if (!item || !["action", "feedback", "overlay"].includes(item.family)) return null;
  return (
    <Frame>
      <h2>Words</h2>
      <p className="sub">{s.voice.summary.text}</p>
      <div className="grid2">
        <div className="card">
          <div className="lab" style={{ color: "var(--color-status-success)" }}>
            Use
          </div>
          <div className="chips">
            {s.voice.words.use.map((w: string) => (
              <span key={w} className="chip use">
                {w}
              </span>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="lab" style={{ color: "var(--color-status-danger)" }}>
            Avoid
          </div>
          <div className="chips">
            {s.voice.words.avoid.map((w: string) => (
              <span key={w} className="chip avoid">
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}
