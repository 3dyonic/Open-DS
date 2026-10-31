// The Primitives page of one scheme: every option token, its value, a specimen and who uses it.
import Link from "next/link";
import type { Primitive, PrimitiveGroup, PrimitivesPage } from "@/lib/primitives";

// A hue's base value is the group's own token: named after the group (color.violet), written $root in the source.
const name = (path: string) => (path.endsWith(".$root") ? path.slice(0, -6) : path);

function Specimen({ p, brand }: { p: Primitive; brand?: string }) {
  const v = p.value;
  const box =
    "flex h-[40px] w-[64px] shrink-0 items-center justify-center rounded-[4px] border border-line bg-white";
  if (p.ref && p.type !== "color")
    return <span className={`${box} font-mono text-[10px] text-muted`}>→</span>;
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

function Group({ g, brand, anchor }: { g: PrimitiveGroup; brand?: string; anchor: string }) {
  return (
    <section id={anchor} className="flex scroll-mt-[72px] flex-col gap-3" aria-label={g.title}>
      <div className="flex flex-col gap-1">
        <h3 className="text-[22px] font-extrabold">
          {g.title}{" "}
          <span className="font-mono text-[12px] font-normal text-muted">{g.items.length}</span>
        </h3>
        <p className="text-[15px] text-body">{g.why}</p>
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
              <code className="font-mono text-[13px] font-semibold break-all">
                {name(p.path)}
                {p.path.endsWith(".$root") && (
                  <span className="ml-2 rounded-[3px] bg-paper px-[6px] py-[1px] font-sans text-[11px] font-medium text-muted">
                    base
                  </span>
                )}
              </code>
              <span className="font-mono text-[12px] break-all text-muted">
                {p.ref ? `→ ${p.ref}` : p.value}
              </span>
              {p.description && (
                <span className="text-[13px] leading-[1.4] text-body">{p.description}</span>
              )}
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              {p.pointedBy.length > 0 && (
                <span className="text-[13px] text-body">
                  Picked by{" "}
                  <span className="font-mono break-all">{p.pointedBy.map(name).join(", ")}</span>
                </span>
              )}
              <span className="text-[12px] font-medium uppercase tracking-[0.44px] text-muted">
                Used by
              </span>
              {p.usedBy.length ? (
                <ul className="flex flex-wrap gap-[6px]">
                  {p.usedBy.map((u) => (
                    <li
                      key={`${u.brand ?? ""}-${u.mode}-${u.path}`}
                      className="rounded-[3px] bg-paper px-2 py-[2px] font-mono text-[12px] break-all"
                    >
                      {u.path}
                      {(u.brand || u.mode !== "base") && (
                        <span className="text-muted">
                          {" "}
                          · {[u.brand, u.mode !== "base" ? u.mode : ""].filter(Boolean).join(" ")}
                        </span>
                      )}
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
  // The jump links: one per group, in page order.
  const jumps: [string, string][] = p.multiBrand
    ? [
        ...p.shared.map((g): [string, string] => [`shared-${g.id}`, g.title]),
        ...p.brands.flatMap((b) =>
          b.groups.map((g): [string, string] => [`${b.id}-${g.id}`, `${b.label}: ${g.title}`]),
        ),
      ]
    : [
        ...p.shared.map((g): [string, string] => [g.id, g.title]),
        ...(p.brands[0]?.groups ?? [])
          .filter((x) => !p.shared.some((g) => g.id === x.id))
          .map((g): [string, string] => [g.id, g.title]),
      ];
  return (
    <div data-scheme={p.scheme.id} className="flex flex-col gap-12 px-5 pb-20 lg:px-20">
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
        <div className="flex max-w-[860px] flex-col gap-3 text-[18px] leading-[1.5] text-body">
          <p>
            {p.scheme.name} has {count} primitives. Think of them as{" "}
            <strong className="text-ink">option tokens</strong>: the raw choices on the shelf, such
            as a colour ramp or a spacing scale. They carry no meaning on their own.
          </p>
          <p>
            The meaning comes from <strong className="text-ink">decision tokens</strong> (semantic
            tokens), which pick one option and say what it is for: &ldquo;the primary action&rdquo;,
            &ldquo;a card corner&rdquo;. In between, each brand&rsquo;s theme picks a primitive for
            every brand-dependent decision, in light and dark. Colours come by hue, then mode, then
            step (color.violet.light.600), and each hue has a base value named after the hue itself
            (color.violet, written $root in the token source). Each primitive below lists the
            decisions that reach it. Change a primitive, and every decision that points at it
            changes too.
          </p>
        </div>
      </header>

      <nav
        aria-label="Jump to a group"
        className="sticky top-0 z-20 -mx-5 border-b border-line bg-paper/95 px-5 py-3 backdrop-blur lg:-mx-20 lg:px-20"
      >
        <ul className="flex gap-2 overflow-x-auto md:flex-wrap md:overflow-visible">
          {jumps.map(([id, title]) => (
            <li key={id} className="shrink-0">
              <a
                href={`#${id}`}
                className="block rounded-[4px] border border-line bg-white px-3 py-[6px] text-[14px] font-semibold whitespace-nowrap hover:border-ink"
              >
                {title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {p.multiBrand ? (
        <>
          <section className="flex flex-col gap-8">
            <h2 className="text-[30px] font-extrabold">Shared by every brand</h2>
            {p.shared.map((g) => (
              <Group key={g.id} g={g} anchor={`shared-${g.id}`} />
            ))}
          </section>
          {p.brands.map((b) => (
            <section key={b.id} data-brand={b.id} className="flex flex-col gap-8">
              <h2 className="text-[30px] font-extrabold">Brand: {b.label}</h2>
              {b.groups.map((g) => (
                <Group key={g.id} g={g} brand={b.id} anchor={`${b.id}-${g.id}`} />
              ))}
            </section>
          ))}
        </>
      ) : (
        <section className="flex flex-col gap-8">
          {/* One brand: its own options join the shared ones, group by group. */}
          {p.shared.map((g) => {
            const own = p.brands[0]?.groups.find((x) => x.id === g.id);
            return (
              <Group
                key={g.id}
                g={own ? { ...g, items: [...own.items, ...g.items] } : g}
                anchor={g.id}
              />
            );
          })}
          {p.brands[0]?.groups
            .filter((x) => !p.shared.some((g) => g.id === x.id))
            .map((g) => (
              <Group key={g.id} g={g} anchor={g.id} />
            ))}
        </section>
      )}
    </div>
  );
}
