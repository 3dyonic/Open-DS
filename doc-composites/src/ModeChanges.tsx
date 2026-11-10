/**
 * ModeChanges: every job a mode changes, in one table: a row for each group, then each job with what
 * every mode points it at: its swatch, drawn from the token in that mode, and the neutral step or
 * primitive it reads. Built from the
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
import Chain from "./base/Chain";
import Swatch from "./base/Swatch";
import { tokenVar } from "./base/token";

type Mode = "light" | "dark";
type Cell = { mode: Mode; primitive?: string; via?: string; value?: string };
export type ModeChangesData = {
  modes: Mode[];
  groups: { group: string; rows: { token: string; cells: Cell[] }[] }[];
};

const data = "[font-family:var(--type-data-font-family)] text-[length:var(--type-caption-font-size)] text-[color:var(--color-text-secondary)]";
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
// The page shows token names without their color. prefix.
const name = (token: string) => token.replace(/^color\./, "");

// A job that is not a color, such as a shadow: the primitive it ends at, then that primitive's value,
// split into its parts. A shadow's color shows as a swatch with its hex.
function Parts({ c }: { c: Cell }) {
  const hex = c.value!.match(/#[0-9A-Fa-f]{6,8}\b/)?.[0];
  const rest = hex ? c.value!.replace(hex, "").trim() : c.value!;
  // The geometry and the color are one value, so no arrow sits between them.
  const parts: React.ReactNode[] = [
    <span key="v" className="inline-flex items-center gap-[var(--space-gap-tight)]">
      {rest}
      {hex && <Swatch color={hex} size="sm" />}
      {hex}
    </span>,
  ];
  return (
    <span className={data}>
      {c.primitive ? <Chain parts={[name(c.primitive), ...parts]} /> : <Chain parts={parts} />}
    </span>
  );
}

// One mode's cell: the job's own swatch, drawn from its token in that mode, and what it reads. A gray
// names its neutral step; any other color its primitive (rule 15).
function Value({ token, c }: { token: string; c: Cell }) {
  if (c.value !== undefined) return <Parts c={c} />;
  return (
    <span className="flex items-center gap-[var(--space-gap-default)]">
      {/* Only the swatch sits in the mode's scope; the text stays in the page's colors. */}
      <span data-mode={c.mode} className="flex">
        <Swatch color={tokenVar(token)} size="sm" />
      </span>
      <span className={`whitespace-nowrap ${data}`}>{name(c.via ?? c.primitive)}</span>
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
            <React.Fragment key={g.group}>
              <TableRow>
                <TableCell colSpan={d.modes.length + 1}>
                  <b>
                    {cap(g.group.split(".").pop()!)} · {g.rows.length}
                  </b>
                </TableCell>
              </TableRow>
              {g.rows.map((r) => (
                <TableRow key={r.token}>
                  <TableCell>
                    <code>{name(r.token)}</code>
                  </TableCell>
                  {r.cells.map((c, i) => (
                    <TableCell key={i}>
                      <Value token={r.token} c={c} />
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
