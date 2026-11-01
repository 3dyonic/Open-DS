// One scheme, built from the Figma frame S02 Scheme (117:900).
import { primitivesPage } from "@/lib/primitives";
import { DemoNote } from "@/components/demo-note";
import { Options } from "@/components/options";
import type { Metadata } from "next";
import Link from "next/link";
import { Applied, type AppliedSamples } from "@/components/applied";
import { Eyebrow, Legend, Swatch } from "@/components/chrome";
import { ScopeMini } from "@/components/scope-mini";
import { cardMark, REASON_LABEL } from "@/lib/home";
import { figmaKit } from "@/lib/figma-kits";
import { answerOf, grammar, scheme, schemeIds } from "@/lib/schemes";

export function generateStaticParams() {
  return schemeIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const s = scheme(id);
  return { title: s.name, description: s.summary };
}

const lower = (t: string) => (/^[A-Z]{2}/.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1));

export default async function SchemePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const kit = figmaKit(id);
  const s = scheme(id);
  const g = grammar();
  const label = (q: string) => answerOf(s, g, q).option.label;
  const scopeIds = new Set(g.scopes.flatMap((x) => x.questions.map((q) => q.id)));
  const cites = new Map<string, number>();
  for (const a of s.answers)
    if (scopeIds.has(a.question))
      for (const b of a.because)
        if (!scopeIds.has(b)) cites.set(b.split(".")[0], (cites.get(b.split(".")[0]) ?? 0) + 1);
  const top = [...cites.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([k]) => k);
  // This scheme's own token values and inventory, not the shared catalogue.
  const leaves = (o: unknown): number =>
    !o || typeof o !== "object"
      ? 0
      : "$value" in o
        ? 1
        : Object.values(o).reduce((n: number, v) => n + leaves(v), 0);
  // Every primitive, every brand's theme picks, the semantics and the component keys.
  const tokenCount = leaves(s.tokens);
  const componentCount = (s as unknown as { inventory: { in: unknown[] } }).inventory.in.length;
  const prim = primitivesPage(id);
  const primitiveCount =
    prim.shared.reduce((n, x) => n + x.items.length, 0) +
    prim.brands.reduce((n, b) => n + b.groups.reduce((m, x) => m + x.items.length, 0), 0);
  const brands = Object.entries(s.tokens.brands).map(([bid, b]) => ({ id: bid, label: b.label }));
  const rule = (sit: string) => s.usage.find((u) => u.situation === sit)!;
  const meta = [
    `${g.scopes.length} scopes`,
    `${s.answers.length} answers`,
    `${tokenCount} tokens`,
    `${componentCount} components`,
    ...(brands.length > 1 ? [`${brands.length} brands`] : []),
  ];
  return (
    <article className="flex flex-col gap-14 px-5 pb-20 lg:px-20">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-end">
        <div className="flex flex-col gap-4">
          <nav
            aria-label="Breadcrumb"
            className="flex gap-[10px] font-mono text-[12px] font-medium uppercase tracking-[0.48px]"
          >
            <Link href="/schemes/" className="text-muted">
              Schemes
            </Link>
            <span className="text-muted">/</span>
            <span className="text-accent-text">{s.name}</span>
          </nav>
          <span aria-hidden className="flex flex-col gap-[4px]">
            {cardMark(s).map((row, r) => (
              <span key={r} className="flex gap-[4px]">
                {row.map((l, i) => (
                  <span key={i} className={`size-[16px] ${l ? "bg-accent" : "bg-tag"}`} />
                ))}
              </span>
            ))}
          </span>
          <h1 className="text-[44px] leading-[1.05] font-extrabold md:text-[56px]">{s.name}</h1>
          <p className="text-[22px] text-body">{s.summary}</p>
          <ul className="flex flex-wrap gap-2">
            {meta.map((m) => (
              <li
                key={m}
                className="rounded-[3px] border border-line bg-white px-[9px] py-[5px] font-mono text-[12px]"
              >
                {m}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-[10px] lg:ml-auto">
          <Link
            href={`/take/?scheme=${s.id}`}
            className="flex items-center gap-[10px] self-start rounded-[4px] bg-ink px-5 py-[14px] text-[17px] font-semibold text-paper"
          >
            <span aria-hidden className="size-[8px] bg-accent" />
            Take this scheme
          </Link>
          <Link
            href="/compare/"
            className="rounded-[4px] border border-ink px-5 py-[14px] text-[17px] font-semibold"
          >
            Compare with another scheme
          </Link>
        </div>
      </header>
      <DemoNote />
      <Link
        href={`/schemes/${s.id}/primitives/`}
        className="flex flex-col gap-3 rounded-[8px] border border-line bg-white p-6 hover:border-ink md:flex-row md:items-center md:gap-6"
      >
        <span className="flex flex-1 flex-col gap-1">
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.44px] text-accent-text">
            Primitives · {primitiveCount}
          </span>
          <span className="text-[20px] font-extrabold">
            The raw options every answer picks from
          </span>
          <span className="text-[15px] leading-[1.45] text-body">
            The palette, type, space, corners, shadows and motion steps of {s.name}: each value, and
            the decisions that use it.
          </span>
        </span>
        <span className="self-start rounded-[4px] bg-ink px-4 py-[10px] text-[16px] font-semibold text-paper md:self-center">
          Open primitives →
        </span>
      </Link>

      <section className="flex flex-col gap-5" aria-labelledby="reasons">
        <Eyebrow>Why this scheme exists</Eyebrow>
        <h2 id="reasons" className="text-[36px] font-extrabold">
          Its answers to the reasons
        </h2>
        <Legend
          items={[
            [Swatch.reasonTop, "Matters most for this scheme"],
            [Swatch.reasonOther, "Other reasons"],
          ]}
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {g.reasons.map((r) => (
            <li
              key={r.id}
              className={`flex flex-col gap-[10px] rounded-[6px] border bg-white p-5 ${top.includes(r.id) ? "border-ink" : "border-line"}`}
            >
              <span className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={`size-[10px] ${top.includes(r.id) ? "bg-accent" : "bg-tag"}`}
                />
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.44px] text-muted">
                  {REASON_LABEL[r.id]}
                </span>
              </span>
              <span className="text-[17px] font-semibold leading-[1.35]">
                {r.questions.map((q, i) => (i ? lower(label(q.id)) : label(q.id))).join(", ")}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-5" aria-labelledby="applied">
        <Eyebrow>This scheme, applied</Eyebrow>
        <h2 id="applied" className="text-[36px] font-extrabold">
          One screen built only from its answers
        </h2>
        <Applied
          scheme={s.id}
          brands={brands}
          toast={rule("success-words").example ?? ""}
          samples={(s as unknown as { samples: AppliedSamples }).samples}
          inventory={(s as unknown as { inventory: { in: { id: string }[] } }).inventory.in.map(
            (i) => i.id,
          )}
        />
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="scopes">
        <Eyebrow>Scopes</Eyebrow>
        <h2 id="scopes" className="text-[36px] font-extrabold">
          {g.scopes.length} scopes, each answered for this scheme
        </h2>
        <p className="max-w-[860px] text-[16px] leading-[1.45] text-body">
          Every scope answers the same five questions:{" "}
          {g.methods.map((m) => m.title.toLowerCase()).join(", ")}.
        </p>
        <ul className="flex flex-col gap-4">
          {g.scopes.map((sc) => {
            const a = (m: number) => s.answers.find((x) => x.question === sc.questions[m].id)!;
            return (
              <li key={sc.id}>
                <Link
                  href={`/schemes/${s.id}/${sc.id}/`}
                  className="flex flex-col gap-6 rounded-[8px] border border-line bg-white p-6 hover:border-ink md:flex-row md:items-center"
                >
                  <ScopeMini scheme={s} scope={sc.id} toast={rule("success-words").example ?? ""} />
                  <span className="flex min-w-0 flex-1 flex-col gap-2">
                    <span className="text-[24px] font-extrabold">{sc.title}</span>
                    <span className="text-[16px] leading-[1.45] text-body">
                      {a(3).why} {a(4).why}
                    </span>
                    {/* Each question in full words, with every option and this scheme's choice highlighted. */}
                    <span className="flex flex-col gap-[12px] pt-1">
                      {sc.questions.map((q) => (
                        <span key={q.id} className="flex flex-col gap-[6px]">
                          <span className="text-[15px] font-semibold leading-[1.35] text-ink">
                            {q.text}
                            {q.id === "components.count" && (
                              <>
                                {" "}
                                {s.name} carries{" "}
                                {
                                  (s as unknown as { inventory: { in: unknown[] } }).inventory.in
                                    .length
                                }
                                .
                              </>
                            )}
                          </span>
                          <Options
                            variant="inline"
                            options={q.options}
                            chosen={answerOf(s, g, q.id).option.id}
                            label={`The options for: ${q.text}`}
                          />
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="text-[16px] font-semibold">Open →</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {kit && (
        <section
          className="flex flex-col gap-4 rounded-[8px] border border-line bg-white p-8 md:flex-row md:items-center md:justify-between"
          aria-labelledby="figma"
        >
          <div className="flex max-w-[760px] flex-col gap-2">
            <Eyebrow>Figma kit</Eyebrow>
            <h2 id="figma" className="text-[28px] font-extrabold">
              {s.name} in Figma
            </h2>
            <p className="text-[16px] leading-[1.45] text-body">
              Variables for every theme with their CSS names, text and effect styles, the components
              bound to the component keys, and a page with all {s.answers.length} answers and their
              reasons. Generated from the scheme, so it matches the code.
            </p>
          </div>
          <a
            href={kit}
            rel="noopener"
            className="flex shrink-0 items-center gap-[10px] self-start rounded-[4px] bg-ink px-5 py-[14px] text-[17px] font-semibold text-paper md:self-center"
          >
            <span aria-hidden className="size-[8px] bg-accent" />
            Open the Figma kit
          </a>
        </section>
      )}

      <section className="inverse flex flex-col gap-8 rounded-[8px] bg-ink p-10 text-paper lg:flex-row">
        <div className="flex flex-col gap-3 lg:w-[640px]">
          <Eyebrow tone="accent">Take this scheme</Eyebrow>
          <h2 className="text-[36px] font-extrabold">Start from {s.name}.</h2>
          <p className="text-[16px] leading-[1.45] text-line">
            You get {tokenCount} tokens, the variants of {componentCount} components, and all{" "}
            {s.answers.length} answers with their reasons. Change any answer later, and see what it
            moves.
          </p>
        </div>
        <ul className="flex flex-1 flex-col gap-[10px]">
          {[
            ["CLI", `open-ds init ${s.id}`],
            ["Link", `/schemes/${s.id}`],
            ["Agent", `MCP · get_scheme("${s.id}")`],
            ...(kit ? [["Figma", "Figma kit · variables, styles, components"]] : []),
          ].map(([k, v]) => (
            <li key={k} className="flex gap-4 rounded-[4px] border border-muted px-4 py-3">
              <span className="w-[60px] shrink-0 font-mono text-[11px] font-medium uppercase tracking-[0.44px] text-line">
                {k}
              </span>
              <code className="font-mono text-[15px]">{v}</code>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
