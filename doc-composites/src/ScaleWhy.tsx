/**
 * ScaleWhy: the answers that lead to a scheme's step answer, earliest first, beside the reason in
 * words. The reason is the page's own Markdown, inside the directive. Built on the Frame and Columns
 * base forms. The data follows doc-composites/schemas/scale-why.schema.json; the page holds
 * :::scale-why{id="key"} … :::
 */
import * as React from "react";
import Columns from "./base/Columns";
import Frame from "./base/Frame";

export type ScaleWhyStep = { question: string; group: string; text: string; option: string; answer: string; why: string; repeatsLabel: boolean };
export type ScaleWhyData = { steps: ScaleWhyStep[] };

export default function ScaleWhy({ data, children }: { data: ScaleWhyData; children?: React.ReactNode }) {
  return (
    <div data-composite="scale-why">
      <Columns count="2" gap="group">
        <ol className="m-0 flex list-none flex-col p-0">
          {data.steps.map((s, i) => {
            const last = i === data.steps.length - 1;
            return (
              <li key={s.question} className="flex flex-col">
                <div className={`rounded-[var(--radius-surface)] ${last ? "outline outline-[length:var(--focus-ring-width)] outline-[var(--color-border-selected)]" : ""}`}>
                  <Frame variant={last ? "sunken" : "card"}>
                    <p className="m-0 text-[length:var(--type-caption-font-size)] text-[color:var(--color-text-muted)]">
                      {s.group}: {s.text}
                    </p>
                    <p className="m-0 font-semibold text-[color:var(--color-text-primary)]">{s.answer}</p>
                    {/* A why that only repeats the answer says nothing new, so it stays hidden. */}
                    {!s.repeatsLabel && <p className="m-0 text-[length:var(--type-caption-font-size)] text-[color:var(--color-text-secondary)]">{s.why}</p>}
                  </Frame>
                </div>
                {!last && <span aria-hidden="true" className="ml-[var(--space-gap-group)] h-[var(--space-gap-default)] w-[var(--focus-ring-width)] bg-[var(--color-border-strong)]" />}
              </li>
            );
          })}
        </ol>
        <div className="flex flex-col justify-center rounded-[var(--radius-surface)] bg-[var(--color-surface-inverse)] p-[var(--space-inset-container)] text-[color:var(--color-text-inverse)] [&_p]:m-0 [&_strong]:text-[color:var(--color-text-inverse)]">
          {children}
        </div>
      </Columns>
    </div>
  );
}
