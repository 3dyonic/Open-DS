/**
 * PrimitiveTable: one group of a scheme's primitives, each with its value drawn and every token that
 * uses it, one per line. Built from the scheme's Table, used through its props only; Sample draws each
 * value. The data follows doc-composites/schemas/primitive-table.schema.json; the page holds one line:
 * ::primitive-table{id="space"}
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
import Sample from "./Sample";

export type PrimitiveRow = {
  primitive: string;
  value: string;
  sample?: { kind: string; value: string; note?: string };
  usedBy: { token: string; where: string }[];
};
export type PrimitiveTableData = { rows: PrimitiveRow[] };

const muted = "text-[color:var(--color-text-muted)]";

export default function PrimitiveTable({ data }: { data: PrimitiveTableData }) {
  return (
    <div data-composite="primitive-table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Primitive</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Sample</TableHead>
            <TableHead>Used by</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.rows.map((r) => (
            <TableRow key={r.primitive}>
              <TableCell>
                <code>{r.primitive}</code>
              </TableCell>
              <TableCell>
                {/* A length stays on one line; a font stack may wrap. */}
                <span className={r.value.includes(",") ? "" : "whitespace-nowrap"}>{r.value}</span>
              </TableCell>
              <TableCell>
                {r.sample && <Sample kind={r.sample.kind} value={r.sample.value} note={r.sample.note} />}
              </TableCell>
              <TableCell>
                {r.usedBy.length ? (
                  <span className="flex flex-col">
                    {r.usedBy.map((u) => (
                      <span key={`${u.token}|${u.where}`}>
                        <code>{u.token}</code> <span className={muted}>({u.where})</span>
                      </span>
                    ))}
                  </span>
                ) : (
                  <span className={muted}>Not used yet</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
