/**
 * Steps: a short flow read left to right, such as the path from a question to the UI, as an ordered
 * list in one caption line. The data follows doc-composites/schemas/steps.schema.json; the page holds
 * one line: ::steps{id="flow"}
 */
import * as React from "react";

export type StepsData = { steps: string[] };

export default function Steps({ data }: { data: StepsData }) {
  return (
    <div data-composite="steps">
      <ol className="m-0 flex list-none flex-wrap items-center gap-[var(--space-gap-tight)] p-0 text-[length:var(--type-caption-font-size)] text-[color:var(--color-text-muted)]">
        {data.steps.map((s, i) => (
          <li key={s} className="m-0 inline-flex items-center gap-[var(--space-gap-tight)]">
            {i > 0 && <span aria-hidden="true">→</span>}
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}
