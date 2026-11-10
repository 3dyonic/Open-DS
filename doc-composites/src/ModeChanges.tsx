/**
 * ModeChanges: every job a mode changes, in one table: a row for each group, then each job with what
 * every mode points it at, its swatch, the primitive and the step it goes through. Built from the
 * scheme's Table, used through its props only; the swatches are drawings of values. The data follows
 * doc-composites/schemas/mode-changes.schema.json; the page holds one line: ::mode-changes{id="default"}
 */
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@open-ds/ui/components/table";

type Cell = { primitive?: string; via?: string; hex?: string; value?: string };
export type ModeChangesData = {
  modes: string[];
  groups: { title: string; rows: { job: string; cells: Cell[] }[] }[];
};

const data = "[font-family:var(--type-data-font-family)] text-[length:var(--type-caption-font-size)] text-[color:var(--color-text-secondary)]";
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function Value({ c }: { c: Cell }) {
  if (!c.primitive) return <code>{c.value}</code>;
  return (
    <span className="flex items-center gap-[var(--space-gap-default)]">
      <i
        aria-hidden="true"
        className="size-4 shrink-0 rounded-[var(--radius-badge)] border border-[var(--color-border-default)]"
        style={{ background: c.hex }}
      />
      <span className={`whitespace-nowrap ${data}`}>
        {c.primitive}
        {c.via && ` · via ${c.via}`}
      </span>
    </span>
  );
}

export default function ModeChanges({ data: d }: { data: ModeChangesData }) {
  return (
    <div data-composite="mode-changes">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job</TableHead>
            {d.modes.map((m) => (
              <TableHead key={m}>{cap(m)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {d.groups.map((g) => (
            <React.Fragment key={g.title}>
              <TableRow>
                <TableCell colSpan={d.modes.length + 1}>
                  <b>
                    {g.title} · {g.rows.length}
                  </b>
                </TableCell>
              </TableRow>
              {g.rows.map((r) => (
                <TableRow key={r.job}>
                  <TableCell>
                    <code>{r.job}</code>
                  </TableCell>
                  {r.cells.map((c, i) => (
                    <TableCell key={i}>
                      <Value c={c} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
