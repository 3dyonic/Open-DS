/**
 * AnatomyLegend: every part of a component, as a tree. Each row is the part's number from the drawing,
 * its name, whether it is required, whether its value changes by scheme, and the jobs it does. A part
 * inside another hangs from it on the tree's lines, as on the Decision reference. Built from the
 * scheme's Badge (through Label), used through its props only. The data follows
 * doc-composites/schemas/anatomy-legend.schema.json; the page holds one line:
 * ::anatomy-legend{id="alert-dialog"}
 */
import * as React from "react";
import Label from "./base/Label";
import { Tree, Twig } from "./base/Tree";

export type LegendPart = {
  n?: number;
  label: string;
  need: string;
  note?: string;
  noToken?: boolean;
  byScheme: boolean;
  roles: string[];
  children?: LegendPart[];
};
export type AnatomyLegendData = { parts: LegendPart[] };

// The number a part carries on the drawing: the same filled circle the drawing draws.
export function PartNumber({ n }: { n: number }) {
  return (
    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-action-primary)] text-[length:var(--type-caption-font-size)] font-semibold text-[color:var(--color-text-on-action)]">
      {n}
    </span>
  );
}

function Row({ p }: { p: LegendPart }) {
  return (
    <span className="flex flex-wrap items-center gap-x-[var(--space-gap-default)] gap-y-[var(--space-gap-tight)]">
      {p.n ? <PartNumber n={p.n} /> : <span className="size-5 shrink-0" />}
      <b className="text-[color:var(--color-text-primary)]">{p.label}</b>
      <span className="text-[length:var(--type-caption-font-size)] text-[color:var(--color-text-muted)]">
        {[p.need, p.note, p.noToken ? "no token yet" : null].filter(Boolean).join(" · ")}
      </span>
      {p.byScheme && <Label tone="info">By scheme</Label>}
      {p.roles.length > 0 && (
        <span className="ml-auto flex flex-wrap gap-[var(--space-gap-tight)]">
          {p.roles.map((r) => (
            <Label key={r}>{r}</Label>
          ))}
        </span>
      )}
    </span>
  );
}

function Branch({ parts, root = false }: { parts: LegendPart[]; root?: boolean }) {
  return (
    <Tree root={root}>
      {parts.map((p, i) => (
        <Twig key={`${p.label}-${i}`} root={root}>
          <Row p={p} />
          {p.children?.length ? <Branch parts={p.children} /> : null}
        </Twig>
      ))}
    </Tree>
  );
}

export default function AnatomyLegend({ data }: { data: AnatomyLegendData }) {
  return (
    <div data-composite="anatomy-legend">
      <Branch parts={data.parts} root />
    </div>
  );
}
