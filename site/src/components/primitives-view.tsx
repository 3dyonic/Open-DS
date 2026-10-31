// The Primitives page of one scheme: every option token, its value, a specimen and who uses it.
import Link from "next/link";
import type { Primitive, PrimitiveGroup, PrimitivesPage } from "@/lib/primitives";

function Specimen({ p, brand }: { p: Primitive; brand?: string }) {
  const v = p.value;
  const box =
    "flex h-[40px] w-[64px] shrink-0 items-center justify-center rounded-[4px] border border-line bg-white";
  if (p.ref) return <span className={`${box} font-mono text-[10px] text-muted`}>→</span>;
  if (p.type === "color")
    return (
      <span
        className="h-[40px] w-[64px] shrink-0 rounded-[4px] border border-line"
        style={{ background: v }}
      />
    );
  if (p.type === "fontFamily")
    return (
      <span className={`${box} text-[20px]`} style={{ fontFamily: v }}>
        Aa
      </span>
    );
  if (p.path.startsWith("font.size"))
    return (
      <span className={`${box} overflow-hidden`} style={{ fontSize: v }}>
        Aa
      </span>
    );
  if (p.path.startsWith("font.weight"))
    return (
      <span className={`${box} text-[18px]`} style={{ fontWeight: Number(v) || v }}>
        Aa
      </span>
    );
  if (p.path.startsWith("space") || p.path.startsWith("size"))
    return (
      <span className={box}>
        <span className="h-[8px] max-w-[56px] bg-ink/70" style={{ width: v }} />
      </span>
    );
  if (p.path.startsWith("radius"))
    return (
      <span className={box}>
        <span className="size-[26px] border-2 border-ink/70" style={{ borderRadius: v }} />
      </span>
    );
  if (p.type === "shadow")
    return (
      <span className="flex h-[40px] w-[64px] shrink-0 items-center justify-center">
        <span className="h-[26px] w-[44px] rounded-[3px] bg-white" style={{ boxShadow: v }} />
      </span>
    );
  return (
    <span className={`${box} font-mono text-[10px] text-muted`} data-brand={brand}>
      ·
    </span>
  );
}

function Group({ g, brand }: { g: PrimitiveGroup; brand?: string }) {
  return (
    <section className="flex flex-col gap-3" aria-label={g.title}>
      <div className="flex flex-col gap-1">
        <h3 className="text-[22px] font-extrabold">
          {g.title}{" "}
          <span className="font-mono text-[12px] font-normal text-muted">{g.items.length}</span>
        </h3>
        <p className="text-[15px] text-[#3e3a31]">{g.why}</p>
      </div>
      <ul className="flex flex-col divide-y divide-line rounded-[8px] border border-line bg-white">
        {g.items.map((p) => (
          <li
            key={p.path}
            id={p.path}
            className="grid gap-3 p-4 md:grid-cols-[64px_minmax(0,1fr)_minmax(0,1.2fr)] md:items-start md:gap-5"
          >
            <Specimen p={p} brand={brand} />
            <div className="flex min-w-0 flex-col gap-1">
              <code className="font-mono text-[13px] font-semibold break-all">{p.path}</code>
              <span className="font-mono text-[12px] break-all text-muted">
                {p.ref ? `→ ${p.ref}` : p.value}
              </span>
              {p.description && (
                <span className="text-[13px] leading-[1.4] text-[#3e3a31]">{p.description}</span>
              )}
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-[12px] font-medium uppercase tracking-[0.44px] text-muted">
                Used by
              </span>
              {p.usedBy.length ? (
                <ul className="flex flex-wrap gap-[6px]">
                  {p.usedBy.map((u) => (
                    <li
                      key={`${u.mode}-${u.path}`}
                      className="rounded-[3px] bg-paper px-2 py-[2px] font-mono text-[12px] break-all"
                    >
                      {u.path}
                      {u.mode !== "base" && <span className="text-muted"> · {u.mode}</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-[13px] text-muted">
                  Nothing yet. A spare option, ready if a decision needs it.
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PrimitivesView({ p }: { p: PrimitivesPage }) {
  const count =
    p.shared.reduce((n, g) => n + g.items.length, 0) +
    p.brands.reduce((n, b) => n + b.groups.reduce((m, g) => m + g.items.length, 0), 0);
  return (
    <div className="flex flex-col gap-12 px-5 pb-20 lg:px-20">
      <header className="flex flex-col gap-4">
        <nav
          aria-label="Breadcrumb"
          className="flex gap-[10px] font-mono text-[12px] font-medium uppercase tracking-[0.48px]"
        >
          <Link href="/schemes/" className="text-muted">
            Schemes
          </Link>
          <span>/</span>
          <Link href={`/schemes/${p.scheme.id}/`} className="text-muted">
            {p.scheme.name}
          </Link>
          <span>/</span>
          <span className="text-accent-text">Primitives</span>
        </nav>
        <h1 className="text-[44px] leading-[1.05] font-extrabold md:text-[52px]">Primitives</h1>
        <div className="flex max-w-[860px] flex-col gap-3 text-[18px] leading-[1.5] text-[#3e3a31]">
          <p>
            {p.scheme.name} has {count} primitives. Think of them as{" "}
            <strong className="text-ink">option tokens</strong>: the raw choices on the shelf, such
            as a colour ramp or a spacing scale. They carry no meaning on their own.
          </p>
          <p>
            The meaning comes from <strong className="text-ink">decision tokens</strong> (semantic
            tokens), which pick one option and say what it is for: &ldquo;the primary action&rdquo;,
            &ldquo;a card corner&rdquo;. Each primitive below lists the decisions that use it.
            Change a primitive, and every decision that points at it changes too.
          </p>
        </div>
      </header>

      {p.multiBrand ? (
        <>
          <section className="flex flex-col gap-8">
            <h2 className="text-[30px] font-extrabold">Shared by every brand</h2>
            {p.shared.map((g) => (
              <Group key={g.id} g={g} />
            ))}
          </section>
          {p.brands.map((b) => (
            <section key={b.id} data-brand={b.id} className="flex flex-col gap-8">
              <h2 className="text-[30px] font-extrabold">Brand: {b.label}</h2>
              {b.groups.map((g) => (
                <Group key={g.id} g={g} brand={b.id} />
              ))}
            </section>
          ))}
        </>
      ) : (
        <section className="flex flex-col gap-8">
          {/* One brand: its own options join the shared ones, group by group. */}
          {p.shared.map((g) => {
            const own = p.brands[0]?.groups.find((x) => x.id === g.id);
            return <Group key={g.id} g={own ? { ...g, items: [...own.items, ...g.items] } : g} />;
          })}
          {p.brands[0]?.groups
            .filter((x) => !p.shared.some((g) => g.id === x.id))
            .map((g) => (
              <Group key={g.id} g={g} />
            ))}
        </section>
      )}
    </div>
  );
}
