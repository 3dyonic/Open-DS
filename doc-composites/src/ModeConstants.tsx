/**
 * ModeConstants: what stays the same in every mode: the corners, each drawn with its name and value,
 * and the type families, each with the roles set in it. Built from the scheme's Card, used through its
 * props only; the corners are the shared value drawing. The data follows
 * doc-composites/schemas/mode-constants.schema.json; the page holds one line: ::mode-constants{id="default"}
 */
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@open-ds/ui/components/card";
import Drawn from "./drawn";

export type ModeConstantsData = {
  corners: { token: string; value: string; px?: string }[];
  families: { family: string; roles: string[] }[];
};

const data = "[font-family:var(--type-data-font-family)] text-[length:var(--type-caption-font-size)] text-[color:var(--color-text-secondary)]";
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function ModeConstants({ data: d }: { data: ModeConstantsData }) {
  return (
    <div data-composite="mode-constants" className="grid gap-[var(--space-gap-group)] sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Corners</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-[var(--space-gap-group)]">
            {d.corners.map((c) => (
              <span key={c.token} className="flex flex-col items-center gap-[var(--space-gap-tight)]">
                <Drawn x={{ kind: "radius", value: c.value }} />
                <span className={data}>
                  {c.token} · {c.value}
                  {c.px && ` (${c.px})`}
                </span>
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Type families</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            {d.families.map((f) => (
              <div
                key={f.family}
                className="flex items-center justify-between gap-[var(--space-gap-group)] border-b border-[var(--color-border-default)] py-[var(--space-gap-default)] last:border-b-0"
              >
                <span className="text-[length:var(--type-caption-font-size)] text-[color:var(--color-text-secondary)]">
                  {f.roles.map(cap).join(", ")}
                </span>
                <span className="text-right" style={{ fontFamily: `"${f.family}"` }}>
                  {f.family}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
