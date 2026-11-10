/**
 * StatusColors: each status in use, as the product shows it: the scheme's Badge with its dot, the
 * status on its subtle fill with what it means, and the contrast of that pair in each mode. Built from
 * the scheme's Card and Badge (through Label), used through their props only; the fill is a drawing.
 * The data follows doc-composites/schemas/status-colors.schema.json; the page holds one line:
 * ::status-colors{id="default"}
 */
import * as React from "react";
import { Card, CardContent } from "@open-ds/ui/components/card";
import Label from "./Label";

type Tone = "info" | "success" | "warning" | "danger";
export type StatusColorsData = {
  statuses: { label: string; tone: Tone; meaning: string; contrast: { mode: string; ratio: number }[] }[];
};

// AA for text: the ratio a status needs on its fill.
const FLOOR = 4.5;

export default function StatusColors({ data }: { data: StatusColorsData }) {
  return (
    <div data-composite="status-colors">
      <Card>
        <CardContent>
          <div className="flex flex-col">
            {data.statuses.map((s) => (
              <div
                key={s.label}
                className="grid items-center gap-[var(--space-gap-default)] border-b border-[var(--color-border-default)] py-[var(--space-gap-group)] last:border-b-0 sm:grid-cols-[auto_1fr_auto]"
              >
                <span className="flex w-40">
                  <Label tone={s.tone}>
                    <i aria-hidden="true" className="size-1.5 rounded-full bg-current" />
                    {s.label}
                  </Label>
                </span>
                <p
                  className="rounded-[var(--radius-control)] border-l-3 p-[var(--space-gap-default)] text-[length:var(--type-caption-font-size)]"
                  style={{
                    background: `var(--color-status-${s.tone}-subtle)`,
                    borderColor: `var(--color-status-${s.tone})`,
                  }}
                >
                  <b>{s.label}.</b> {s.meaning}
                </p>
                <span className="flex gap-[var(--space-gap-tight)] [font-family:var(--type-data-font-family)]">
                  {s.contrast.map((c) => (
                    <Label key={c.mode} tone={c.ratio >= FLOOR ? "success" : "danger"}>
                      {c.mode} {c.ratio.toFixed(1)}:1
                    </Label>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
