// One scope for one scheme, built from the Figma frame S01 Scope (114:900). The same five
// questions and the same parts for every scope, voice included.
import Link from "next/link";
import type { ScopePage } from "@/lib/scope";
import { Legend, Swatch } from "./chrome";

const cssVar = (path: string) => `var(--${path.replaceAll(".", "-")})`;
const isColor = (v: string) => /^#[0-9a-f]{3,8}$/i.test(v) || v.startsWith("rgb");

function Cells({ on, total }: { on: number; total: number }) {
  return (
    <span aria-hidden className="flex flex-wrap gap-[4px]">
      {Array.from({ length: Math.max(total, on) }, (_, i) => (
        <span key={i} className={`size-[18px] ${i < on ? "bg-accent" : "bg-tag"}`} />
      ))}
    </span>
  );
}

function RowLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-[140px] shrink-0 font-mono text-[11px] font-medium uppercase tracking-[0.44px] text-muted">
      {children}
    </span>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-[14px] rounded-[8px] border border-line bg-white p-5 lg:p-7">
      {children}
    </div>
  );
}

function Sample({ p, role }: { p: ScopePage; role: string }) {
  const items = p.tokens.filter(
    (t) =>
      t.path.split(".").slice(-2).join(".") === role ||
      t.path.includes(`.${role.split(".").pop()}.`) ||
      t.path.endsWith(role),
  );
  const first = items[0];
  if (!first) return null;
  if (first.path.startsWith("type.")) {
    const base = first.path.split(".").slice(0, 2).join(".");
    return (
      <span
        data-scheme={p.scheme.id}
        style={{
          fontFamily: cssVar(`${base}.font-family`),
          fontSize: cssVar(`${base}.font-size`),
          lineHeight: cssVar(`${base}.line-height`),
          fontWeight: cssVar(`${base}.font-weight`),
        }}
      >
        {p.sample}
      </span>
    );
  }
  if (items.every((t) => isColor(t.light)))
    return (
      <span className="flex flex-wrap gap-1">
        {items.map((t) => (
          <span
            key={t.path}
            title={`${t.path} ${t.light}`}
            className="size-5 rounded-[3px] border border-line"
            style={{ background: t.light }}
          />
        ))}
      </span>
    );
  return (
    <span className="font-mono text-[12px] text-[#3e3a31]">
      {items.map((t) => (t.path.startsWith("content.") ? `“${t.light}”` : t.light)).join(" · ")}
    </span>
  );
}

export function ScopeView({ p }: { p: ScopePage }) {
  const visuals = [
    // Roles
    <Panel key="roles">
      {p.roles.map((r) => (
        <div key={r.name} className="flex flex-wrap items-center gap-5 py-1">
          <RowLabel>{r.name.split(".").pop()}</RowLabel>
          <Sample p={p} role={r.name} />
        </div>
      ))}
    </Panel>,
    // How many
    <Panel key="count">
      {(p.counts.length ? p.counts : p.roles).map((r) => (
        <div key={r.name} className="flex flex-wrap items-center gap-5 py-1">
          <RowLabel>{r.name.split(".").slice(-2).join(" ")}</RowLabel>
          <Cells on={r.count} total={r.max} />
          <span className="text-[22px] font-extrabold">{r.count}</span>
        </div>
      ))}
      <Legend
        items={[
          [Swatch.countOn, `${p.scheme.name}’s answer`],
          [Swatch.countOff, "More that other schemes use"],
        ]}
      />
    </Panel>,
    // How defined
    <Panel key="definition">
      <ul className="flex flex-wrap gap-[10px]">
        <li className="rounded-[4px] border border-line bg-paper px-[11px] py-[7px] font-mono text-[12px]">
          {p.questions[2].label}
        </li>
        {p.refs.map((r) => (
          <li
            key={r}
            className="rounded-[4px] border border-line bg-paper px-[11px] py-[7px] font-mono text-[12px]"
          >
            from {r}
          </li>
        ))}
      </ul>
      <p className="font-mono text-[12px] text-muted">
        {p.refs.length
          ? "Decisions point at primitives, so the rule lives in one place."
          : "These tokens are the decisions themselves; no primitive sits under them."}
      </p>
    </Panel>,
    // Values
    <Panel key="values">
      <ul className="grid gap-4 md:grid-cols-2">
        {p.groups.map((grp) => (
          <li key={grp.role} className="flex flex-col gap-1">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.44px] text-muted">
              {grp.role.split(".").pop()}
            </span>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-[2px] font-mono text-[12px]">
              {grp.rows.map((r) => (
                <div key={r.prop} className="contents">
                  <dt className="text-muted">{r.prop}</dt>
                  <dd className="flex flex-wrap items-center gap-2">
                    {isColor(r.light) && (
                      <span
                        className="size-3 rounded-[2px] border border-line"
                        style={{ background: r.light }}
                      />
                    )}
                    {/* A decision shows the primitive it points to; raw values live only on primitives. */}
                    {r.lightRef ? `→ ${r.lightRef}` : r.light}
                    {(r.darkRef ? r.darkRef !== r.lightRef : r.dark !== r.light) && (
                      <span className="flex items-center gap-1 text-muted">
                        · dark{" "}
                        {isColor(r.dark) && (
                          <span
                            className="size-3 rounded-[2px] border border-line"
                            style={{ background: r.dark }}
                          />
                        )}
                        {r.darkRef ? `→ ${r.darkRef}` : r.dark}
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </Panel>,
    // Lands in
    <Panel key="lands">
      <ul className="flex flex-wrap gap-[10px]">
        {p.lands.map((c) => (
          <li
            key={c.id}
            className="rounded-[4px] border border-line bg-paper px-[11px] py-[7px] font-mono text-[12px]"
          >
            {c.id}
            {c.keys.length ? ` · ${c.keys.length} keys` : ""}
          </li>
        ))}
      </ul>
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.44px] text-muted">
        When to use
      </p>
      <ul className="flex flex-col gap-3">
        {p.usage.map((u) => (
          <li
            key={u.situation}
            className="grid gap-1 border-t border-tag pt-3 text-[15px] md:grid-cols-[180px_1fr]"
          >
            <span className="font-semibold">{u.title}</span>
            <span>
              <span className="font-semibold">Use:</span> {u.use}.{" "}
              <span className="text-muted">Not: {u.not}.</span> {u.why}
              {u.example && (
                <span className="mt-1 block rounded-[4px] bg-paper px-2 py-1">“{u.example}”</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </Panel>,
  ];

  return (
    <div className="flex flex-col gap-12 px-5 pb-20 lg:px-20">
      <header className="flex flex-col gap-[14px]">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-[10px] font-mono text-[12px] font-medium uppercase tracking-[0.48px] text-muted"
        >
          <Link href="/schemes/">Schemes</Link>
          <span>/</span>
          <Link
            href={`/schemes/${p.scheme.id}/`}
            className="flex items-center gap-2 rounded-[4px] bg-ink px-[10px] py-[5px] normal-case text-paper"
          >
            <span aria-hidden className="size-[8px] bg-accent" />
            {p.scheme.name}
          </Link>
          <span>/</span>
          <span className="text-accent-text">{p.scope.title}</span>
        </nav>
        <h1 className="text-[44px] font-extrabold leading-[1.05] md:text-[52px]">
          {p.scope.title}
        </h1>
        <p className="max-w-[860px] text-[19px] leading-[1.45] text-[#3e3a31]">
          Five questions every design system answers about {p.scope.title.toLowerCase()}. These are{" "}
          {p.scheme.name}’s answers, and each one points back to the reasons that chose it.
        </p>
        <a
          href="#all-tokens"
          className="self-start rounded-[4px] border border-ink px-[13px] py-[8px] text-[15px] font-semibold"
        >
          View all {p.tokens.length} {p.scope.title.toLowerCase()} tokens ↓
        </a>
      </header>

      <section
        aria-label="Reasons"
        className="flex flex-col gap-[14px] rounded-[8px] border border-line bg-white p-6"
      >
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.44px] text-muted">
          The reasons this scheme answers from
        </p>
        <ul className="flex flex-wrap gap-[10px]">
          {p.reasons.map((r) => (
            <li
              key={r.tag}
              className="flex items-center gap-2 rounded-[4px] border border-line bg-paper px-[11px] py-[8px]"
            >
              <span className="font-mono text-[11px] font-medium text-accent-text">{r.tag}</span>
              <span className="font-mono text-[12px] text-muted">{r.title}</span>
              <span className="text-[15px] font-semibold">{r.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {p.questions.map((q, i) => (
        <section
          key={q.id}
          id={q.method}
          className="flex flex-col gap-8 lg:flex-row lg:items-start"
        >
          <div className="flex flex-col gap-3 lg:w-[380px] lg:shrink-0">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.44px] text-accent-text">
              Question {i + 1}
            </p>
            <h2 className="text-[28px] font-extrabold leading-[1.15]">{q.text}</h2>
            <p className="text-[16px] leading-[1.45] text-[#3e3a31]">
              <span className="font-semibold text-ink">{q.label}.</span> {q.why}
            </p>
            {q.because.length > 0 && (
              <p className="flex flex-wrap items-center gap-[6px]">
                <span className="font-mono text-[12px] text-muted">because</span>
                {q.because.map((b) => (
                  <span
                    key={b.id}
                    title={b.id}
                    className="rounded-[3px] bg-accent-soft px-2 py-1 font-mono text-[12px] font-medium text-accent-text"
                  >
                    {b.tag}
                  </span>
                ))}
              </p>
            )}
          </div>
          {visuals[i]}
        </section>
      ))}

      <section
        id="all-tokens"
        className="flex flex-col gap-[18px] rounded-[8px] border border-line bg-white p-7"
      >
        <div className="flex flex-wrap items-baseline gap-3">
          <h2 className="text-[28px] font-extrabold">All {p.scope.title.toLowerCase()} tokens</h2>
          <p className="font-mono text-[12px] text-muted">
            {p.tokens.length} tokens · each decision and the primitive it points to
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {p.primitives.map((f) => (
            <li key={f.family} className="flex flex-col gap-2 rounded-[4px] bg-paper p-3">
              <span className="font-mono text-[11px] font-medium uppercase text-accent-text">
                {f.family} · {f.tokens.length}
              </span>
              {f.tokens.map((t) => (
                <span key={t.path} className="flex flex-col font-mono text-[12px]">
                  <code>{t.path}</code>
                  <code className="text-muted">{t.value}</code>
                </span>
              ))}
            </li>
          ))}
          <li className="flex flex-col gap-2 rounded-[4px] bg-accent-soft p-3 sm:col-span-2 lg:col-span-1">
            <span className="font-mono text-[11px] font-medium uppercase text-accent-text">
              Decisions · {p.tokens.length}
            </span>
            {p.tokens.map((t) => (
              <span key={t.path} className="flex flex-col font-mono text-[12px]">
                <code>{t.path}</code>
                <code className="text-muted">{t.ref}</code>
              </span>
            ))}
          </li>
        </ul>
        <p className="font-mono text-[12px] text-muted">
          Decisions reference primitives, so changing one primitive updates every decision and
          component that uses it.
        </p>
      </section>

      <p className="flex items-start gap-4 rounded-[8px] bg-ink p-6 text-[20px] leading-[1.45] text-paper">
        <span aria-hidden className="mt-2 size-4 shrink-0 bg-accent" />
        {p.line}
      </p>
    </div>
  );
}
