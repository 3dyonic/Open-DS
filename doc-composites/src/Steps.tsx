/**
 * Steps: a short flow read left to right, such as the path from a question to the UI, in one caption
 * line. Built on the Chain base form, which joins each step to the next. The data follows
 * doc-composites/schemas/steps.schema.json; the page holds one line: ::steps{id="flow"}
 */
import * as React from "react";
import Chain from "./base/Chain";

export type StepsData = { steps: string[] };

export default function Steps({ data }: { data: StepsData }) {
  return (
    <div data-composite="steps" className="text-[length:var(--type-caption-font-size)] text-[color:var(--color-text-muted)]">
      <Chain parts={data.steps} />
    </div>
  );
}
