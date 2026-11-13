/**
 * ScaleOptions: the same key color built with other answers to color.definition.steps, as mini
 * strips side by side. The scheme's own answer is outlined. Built on the Frame, Columns and Ribbon
 * base forms. The data follows doc-composites/schemas/scale-options.schema.json; the page holds one
 * line: ::scale-options{id="key"}
 */
import * as React from "react";
import Columns from "./base/Columns";
import Frame from "./base/Frame";
import Ribbon from "./base/Ribbon";

export type ScaleOption = {
  option: string;
  label: string;
  description?: string;
  easing: number;
  own: boolean;
  steps: { step: string; hex: string }[];
};
export type ScaleOptionsData = { hue: string; key: string; options: ScaleOption[] };

export default function ScaleOptions({ data }: { data: ScaleOptionsData }) {
  return (
    <div data-composite="scale-options">
      <Columns count="3">
        {data.options.map((o) => (
          <div
            key={o.option}
            className={`rounded-[var(--radius-surface)] ${o.own ? "outline outline-[length:var(--border-width-focus)] outline-[var(--color-border-selected)]" : ""}`}
          >
            <Frame>
              <div className="flex flex-col gap-[var(--space-gap-tight)]">
                <p className="m-0 font-semibold text-[color:var(--color-text-primary)]">
                  {o.label}
                  {o.own ? <span className="font-normal text-[color:var(--color-text-muted)]"> (this scheme)</span> : null}
                </p>
                <Ribbon steps={o.steps} keyStep={data.key} size="sm" />
                <p className="m-0 text-[length:var(--type-caption-font-size)] text-[color:var(--color-text-secondary)]">
                  Easing {o.easing}. {o.description}
                </p>
              </div>
            </Frame>
          </div>
        ))}
      </Columns>
    </div>
  );
}
