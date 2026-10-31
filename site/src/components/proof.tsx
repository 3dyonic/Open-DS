"use client";
// The home proof panel (Figma 115:945): pick a scheme, see its reasons, its answers to the same
// questions, and a live specimen built with that scheme's tokens.
import { Button } from "@open-ds/ui";
import { useState } from "react";
import { Label, Legend, Swatch } from "./chrome";
import type { ProofData } from "@/lib/home";

function Square({ lit, size = 10 }: { lit: boolean; size?: 8 | 10 }) {
  return (
    <span
      aria-hidden
      className={`${lit ? "bg-accent" : "bg-tag"} ${size === 8 ? "size-[8px]" : "size-[10px]"} shrink-0`}
    />
  );
}

function Step({ n, title, note }: { n: number; title: string; note: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="rounded-[3px] bg-ink px-2 py-[3px] font-mono text-[12px] font-medium text-paper">
        {n}
      </span>
      <h3 className="text-[24px] font-extrabold">{title}</h3>
      <p className="font-mono text-[12px] text-muted">{note}</p>
    </div>
  );
}

// A cell only this scheme answers this way: a soft tint of the scheme's own primary colour.
const LIT =
  "border-[color-mix(in_srgb,var(--color-action-primary)_45%,transparent)] bg-[color-mix(in_srgb,var(--color-action-primary)_12%,white)]";

function Specimen({ p }: { p: ProofData }) {
  return (
    <div className="flex w-full flex-col gap-3 rounded-[6px] border border-line bg-paper p-5 lg:w-[400px] lg:shrink-0">
      <Label size={10}>Where the answers land</Label>
      <div
        data-scheme={p.id}
        className="flex w-full flex-col gap-[10px] rounded-[var(--radius-container)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-4 text-[var(--color-text-primary)] [font-family:var(--type-body-font-family)]"
      >
        <p className="[font-family:var(--type-heading-font-family)] text-[length:var(--type-heading-font-size)] [font-weight:var(--type-heading-font-weight)]">
          {p.sample.screen}
        </p>
        <div className="flex flex-wrap gap-4">
          {p.sample.metrics.map((m) => (
            <div key={m.label} className="flex flex-col gap-[2px]">
              <span className="text-[11px] font-medium uppercase text-[var(--color-text-secondary)]">
                {m.label}
              </span>
              <span className="[font-family:var(--type-data-font-family)] text-[16px]">
                {m.value}
              </span>
            </div>
          ))}
        </div>
        {p.sample.table && (
          <table className="w-full border border-[var(--table-row-border)] text-[length:var(--table-font-size)]">
            <tbody>
              {p.sample.table.rows.map((r, ri) => (
                <tr key={ri}>
                  {r.map((c, ci) => (
                    <td
                      key={ci}
                      className={`px-2 py-1 ${p.sample.table!.numeric[ci] ? "text-right [font-family:var(--type-data-font-family)]" : ci === 0 ? "" : "text-[var(--color-text-secondary)]"}`}
                    >
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!p.sample.table && p.sample.card && (
          <div className="flex flex-col gap-1 rounded-[var(--radius-container)] border border-[var(--color-border-default)] p-3">
            <span className="[font-family:var(--type-heading-font-family)] text-[17px] [font-weight:var(--type-heading-font-weight)]">
              {p.sample.card.title}
            </span>
            <span className="text-[14px] text-[var(--color-text-secondary)]">
              {p.sample.card.description}
            </span>
            {p.sample.card.status && (
              <span className="text-[12px] font-medium uppercase text-[var(--color-text-secondary)]">
                {p.sample.card.status}
              </span>
            )}
          </div>
        )}
        <div className="flex gap-2">
          <Button size="compact">{p.sample.primary}</Button>
          <Button size="compact" variant="secondary">
            {p.sample.secondary}
          </Button>
        </div>
      </div>
      <p className="text-[15px] font-semibold leading-[1.35]">{p.because}</p>
    </div>
  );
}

export function Proof({ data }: { data: ProofData[] }) {
  const [id, setId] = useState(data[0].id);
  const p = data.find((d) => d.id === id)!;
  return (
    <section
      aria-label="A scheme, its reasons and its answers"
      className="flex w-full flex-col gap-6 rounded-[10px] border border-line bg-white p-5 lg:p-8"
    >
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Scheme">
        <Label>Scheme</Label>
        {data.map((d) => (
          <button
            key={d.id}
            type="button"
            aria-pressed={d.id === id}
            onClick={() => setId(d.id)}
            className={`flex items-center gap-2 rounded-[4px] border px-3 py-[7px] text-[15px] ${
              d.id === id ? "border-ink bg-ink font-semibold text-paper" : "border-line bg-paper"
            }`}
          >
            <Square lit={d.id === id} size={8} />
            {d.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-[14px]">
        <Step n={1} title="Reasons" note="why this scheme exists" />
        <Legend
          items={[
            [Swatch.reasonTop, "Matters most for this scheme"],
            [Swatch.reasonOther, "Other reasons"],
          ]}
        />
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {p.reasons.map((r) => (
            <li
              key={r.id}
              className={`flex flex-col gap-2 rounded-[6px] border bg-white p-4 ${r.lit ? "border-ink" : "border-line"}`}
            >
              <span className="flex items-center gap-2">
                <Square lit={r.lit} />
                <Label>{r.label}</Label>
              </span>
              <span className="text-[16px] font-semibold leading-[1.3]">{r.text}</span>
            </li>
          ))}
        </ul>
        <p className="rounded-[6px] bg-paper p-4 font-mono text-[12px] leading-[1.4] text-muted">
          Every scheme answers the same reason questions. Different answers here lead to different
          design answers below.
        </p>
        <div className="flex flex-col gap-3 lg:flex-row">
          <div
            className={`flex flex-1 flex-col gap-3 rounded-[6px] border bg-white p-5 ${p.brand.lit ? "border-ink" : "border-line"}`}
          >
            <span className="flex items-center gap-2">
              <Square lit={p.brand.lit} />
              <Label>Brand</Label>
            </span>
            <p className="text-[20px] font-semibold">{p.brand.text}</p>
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex gap-1">
                {p.brand.swatches.map((c) => (
                  <span key={c} className="size-5 rounded-[3px]" style={{ background: c }} />
                ))}
              </span>
              <span
                className="text-[28px] font-semibold leading-none"
                style={{ fontFamily: p.brand.display }}
              >
                Aa
              </span>
              <span className="font-mono text-[12px] text-muted">{p.brand.fonts}</span>
            </div>
            <p className="font-mono text-[12px] text-muted">
              How it should feel. It pulls color, type and shape answers.
            </p>
          </div>
          <div
            className={`flex flex-1 flex-col gap-3 rounded-[6px] border bg-white p-5 ${p.voice.lit ? "border-ink" : "border-line"}`}
          >
            <span className="flex items-center gap-2">
              <Square lit={p.voice.lit} />
              <Label>Voice and tone</Label>
            </span>
            <p className="text-[20px] font-semibold">{p.voice.text}</p>
            <div className="flex flex-col gap-[10px] sm:flex-row">
              {[
                ["Toast", p.voice.toast],
                ["Error", p.voice.error],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex flex-1 flex-col gap-[2px] rounded-[4px] bg-[#f7f8fa] px-[10px] py-2"
                >
                  <Label size={10}>{k}</Label>
                  <span className="text-[14px]" style={{ fontFamily: p.voice.body }}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
            <p className="font-mono text-[12px] text-muted">
              How it speaks. It answers the words in every component.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div data-scheme={p.id} className="flex min-w-0 flex-1 flex-col gap-[10px]">
          <Step n={2} title="Answers" note="same questions for every scheme" />
          <p className="font-mono text-[12px] text-muted">
            {p.name}’s answers, chosen because of the reasons above:
          </p>
          <div className="max-lg:overflow-x-auto">
            <table className="w-full table-fixed border-separate border-spacing-[6px] max-lg:min-w-[640px]">
              <thead>
                <tr>
                  <td className="w-[110px]" />
                  {p.methods.map((m) => (
                    <th
                      key={m}
                      scope="col"
                      className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.4px] text-muted"
                    >
                      {m}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {p.rows.map((r) => (
                  <tr key={r.id}>
                    <th scope="row" className="text-left text-[15px] font-semibold">
                      {r.title}
                    </th>
                    {r.cells.map((c) => (
                      <td
                        key={c.id}
                        title={c.question}
                        className={`rounded-[3px] border p-[10px] align-top font-mono text-[12px] ${
                          c.lit
                            ? `${LIT} font-semibold text-ink`
                            : "border-line bg-paper text-[#3e3a31]"
                        }`}
                      >
                        {c.label}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Legend
            items={[
              [
                <span key="own" className={`block size-[18px] rounded-[3px] border ${LIT}`} />,
                `Only ${p.name} answers this way`,
              ],
              [Swatch.answerShared, "Other schemes give the same answer"],
            ]}
          />
        </div>
        <Specimen p={p} />
      </div>
    </section>
  );
}
