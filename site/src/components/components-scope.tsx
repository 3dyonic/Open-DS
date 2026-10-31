// The Components scope: the inventory first, each component with its reason, then how the scheme's
// decisions cascade into it.
import Link from "next/link";
import type { ComponentsPage } from "@/lib/inventory";

const eyebrow = "font-mono text-[11px] font-medium uppercase tracking-[0.44px]";

export function ComponentsScopeView({ p }: { p: ComponentsPage }) {
  return (
    <div className="flex flex-col gap-12 px-5 pt-10 pb-16 lg:px-20">
      <header className="flex flex-col gap-4">
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
          <span className="text-accent-text">Components</span>
        </nav>
        <h1 className="text-[44px] font-extrabold leading-[1.05] md:text-[52px]">Components</h1>
        <p className="max-w-[860px] text-[19px] leading-[1.45] text-[#3e3a31]">
          <span className="font-semibold text-ink">{p.count} components</span> are in{" "}
          {p.scheme.name}. Each one is here for a reason, and every reason traces back to the
          answers further down.
        </p>
        <a
          href="#cascade"
          className="self-start rounded-[4px] border border-ink px-[13px] py-[8px] text-[15px] font-semibold"
        >
          How the decisions cascade into them ↓
        </a>
      </header>

      <section aria-labelledby="inventory" className="flex flex-col gap-6">
        <h2 id="inventory" className="text-[28px] font-extrabold">
          The inventory
        </h2>
        <div className="flex max-w-[960px] flex-col gap-4">
          {p.groups.map((g) => (
            <section
              key={g.id}
              className="flex flex-col gap-3 rounded-[8px] border border-line bg-white p-6"
              aria-label={g.title}
            >
              <div className="flex flex-col gap-1">
                <p className={`${eyebrow} text-accent-text`}>
                  {g.title} · {g.items.length}
                </p>
                <p className="text-[14px] text-muted">{g.description}</p>
              </div>
              <ul className="flex flex-col divide-y divide-line">
                {g.items.map((i) => (
                  <li key={i.id} className="grid gap-1 py-[10px] sm:grid-cols-[200px_1fr] sm:gap-4">
                    <span className="text-[16px] font-semibold">{i.name}</span>
                    <span className="flex flex-col gap-3">
                      <span className="text-[15px] leading-[1.45] text-[#3e3a31]">{i.why}</span>
                      {i.shot && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={i.shot}
                          srcSet={`${i.shot} 1x, ${i.shot.replace(/\.jpg$/, "@2x.jpg")} 2x`}
                          alt={`${i.name} in ${p.scheme.name}`}
                          loading="lazy"
                          className="max-h-[240px] max-w-full self-start rounded-[4px] border border-line object-contain object-left-top"
                        />
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section id="cascade" aria-labelledby="cascade-title" className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 id="cascade-title" className="text-[28px] font-extrabold">
            How the decisions cascade into them
          </h2>
          <p className="max-w-[860px] text-[17px] leading-[1.45] text-[#3e3a31]">
            The reasons come first. Five answers follow from them, and each answer shapes the
            inventory.
          </p>
        </div>

        <ol className="flex flex-col gap-4">
          <li className="flex flex-col gap-3 rounded-[8px] border border-line bg-white p-6">
            <p className={`${eyebrow} text-muted`}>1 · The reasons</p>
            <ul className="flex flex-wrap gap-[10px]">
              {p.reasons.map((r) => (
                <li
                  key={r.tag}
                  className="flex items-center gap-2 rounded-[4px] border border-line bg-paper px-[11px] py-[8px]"
                >
                  <span className="font-mono text-[11px] font-medium text-accent-text">
                    {r.tag}
                  </span>
                  <span className="font-mono text-[12px] text-muted">{r.title}</span>
                  <span className="text-[15px] font-semibold">{r.text}</span>
                </li>
              ))}
            </ul>
          </li>

          <li className="flex flex-col gap-3 rounded-[8px] border border-line bg-white p-6">
            <p className={`${eyebrow} text-muted`}>
              2 · Five answers, and what each does to the inventory
            </p>
            <ul className="flex flex-col divide-y divide-line">
              {p.questions.map((q) => (
                <li
                  key={q.id}
                  className="grid gap-2 py-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-6"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-[16px] font-semibold">{q.text}</span>
                    <span className="flex flex-wrap items-center gap-[6px]">
                      <span className="font-mono text-[12px] text-muted">because</span>
                      {q.because.map((b) => (
                        <span
                          key={b.id}
                          title={b.id}
                          className="rounded-[3px] bg-accent-soft px-2 py-[2px] font-mono text-[12px] font-medium text-accent-text"
                        >
                          {b.tag}
                        </span>
                      ))}
                    </span>
                  </div>
                  <p className="text-[15px] leading-[1.45]">
                    <span className="font-semibold">{q.label}.</span>{" "}
                    <span className="text-[#3e3a31]">{q.why}</span>
                  </p>
                  <p className="text-[15px] leading-[1.45] text-[#3e3a31]">{q.effect}</p>
                </li>
              ))}
            </ul>
          </li>

          <li className="flex flex-col gap-2 rounded-[8px] border border-line bg-white p-6">
            <p className={`${eyebrow} text-muted`}>3 · The inventory</p>
            <p className="text-[15px] leading-[1.45] text-[#3e3a31]">
              {p.count} components, listed above, each with the reason it passed.{" "}
              <a href="#inventory" className="font-semibold text-ink underline">
                Back to the list
              </a>
            </p>
          </li>
        </ol>
      </section>

      <p className="flex items-start gap-4 rounded-[8px] bg-ink p-6 text-[20px] leading-[1.45] text-paper">
        <span aria-hidden className="mt-2 size-4 shrink-0 bg-accent" />
        {p.line}
      </p>
    </div>
  );
}
