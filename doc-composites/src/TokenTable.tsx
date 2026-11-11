/**
 * TokenTable: the tokens a component reads, one row per part, from its token to the value it ends at
 * in each theme. Built from the scheme's Table and Badge (through Label), used through their props
 * only. The docs generator writes the rows (_composites.json); the page holds one line:
 * ::token-table{component="field"}
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
import Label from "./Label";

type Swatch = { color?: string; corner?: string; shadow?: string };
export type TokenValue = {
  theme?: string;
  swatch?: Swatch;
  token?: string;
  text: string;
  span?: number;
};
type Chain =
  | { token: string; alias: string; variable: string }
  | { system: string; variable: string }
  | { cls: string; variable: string; token: string };
export type TokenRow = {
  group?: string;
  part: string;
  when?: string;
  themed?: boolean;
  chain: Chain;
  values: TokenValue[];
};
export type TokenTableData = {
  kind: "own" | "class";
  legend?: { label: string; text: string; title: string };
  head: string[];
  rows: TokenRow[];
};

const small =
  "text-[length:var(--type-caption-font-size)] [font-family:var(--type-data-font-family)]";
const stack = "flex flex-col items-start gap-[var(--space-gap-tight)]";

// The one drawn part: the value itself, as a color, a corner or a shadow.
function SwatchMark({ swatch }: { swatch: Swatch }) {
  const style: React.CSSProperties = swatch.color
    ? { background: swatch.color }
    : swatch.corner
      ? { borderRadius: swatch.corner }
      : { boxShadow: swatch.shadow };
  return (
    <span
      aria-hidden="true"
      className="inline-block size-[var(--type-caption-font-size)] shrink-0 border border-[var(--color-border-default)] bg-[var(--color-surface-raised)]"
      style={style}
    />
  );
}

function Value({ value }: { value: TokenValue }) {
  return (
    <span className="inline-flex items-center gap-[var(--space-gap-tight)]">
      {value.swatch && <SwatchMark swatch={value.swatch} />}
      <span className={small}>
        {value.token && (
          <>
            <Label>{value.token}</Label>:
          </>
        )}
        {value.text}
      </span>
    </span>
  );
}

function ChainCell({ chain }: { chain: Chain }) {
  if ("alias" in chain)
    return (
      <span className={stack}>
        <Label tone="info">{chain.token}</Label>
        <Label>{chain.alias}</Label>
        <code>var(--{chain.variable})</code>
      </span>
    );
  if ("system" in chain)
    return (
      <span className={stack}>
        <Label>{chain.system}</Label>
        <span className={small}>
          straight from the system, through <code>--{chain.variable}</code>
        </span>
      </span>
    );
  return (
    <span className="inline-flex flex-wrap items-center gap-[var(--space-gap-tight)]">
      <code>{chain.cls}</code>
      <span aria-hidden="true">→</span>
      <code>--{chain.variable}</code>
      <span aria-hidden="true">→</span>
      <Label>{chain.token}</Label>
    </span>
  );
}

export default function TokenTable({ data }: { data: TokenTableData }) {
  const columns = data.head.length;
  return (
    <div data-composite="token-table" className={stack}>
      {data.legend && (
        <p className="flex flex-wrap items-center gap-[var(--space-gap-tight)]">
          <Label tone="info">{data.legend.label}</Label>
          <span className={small}>{data.legend.text}</span>
        </p>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            {data.head.map((h) => (
              <TableHead key={h} scope="col">
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.rows.map((row, i) => (
            <React.Fragment key={i}>
              {row.group && row.group !== data.rows[i - 1]?.group && (
                <TableRow>
                  <TableHead colSpan={columns} scope="colgroup">
                    {row.group}
                  </TableHead>
                </TableRow>
              )}
              <TableRow>
                <TableCell>
                  <span className={stack}>
                    <b>{row.part}</b>
                    {row.themed && data.legend && (
                      <span title={data.legend.title}>
                        <Label tone="info">{data.legend.label}</Label>
                      </span>
                    )}
                    {row.when && <span className={small}>{row.when}</span>}
                  </span>
                </TableCell>
                <TableCell>
                  <ChainCell chain={row.chain} />
                </TableCell>
                {data.kind === "own" ? (
                  <TableCell>
                    <span className={stack}>
                      {row.values.map((v, j) => (
                        <span
                          key={j}
                          className="inline-flex flex-wrap items-center gap-[var(--space-gap-tight)]"
                        >
                          {v.theme && <em>{v.theme}</em>}
                          <Value value={v} />
                        </span>
                      ))}
                    </span>
                  </TableCell>
                ) : (
                  row.values.map((v, j) => (
                    <TableCell key={j} colSpan={v.span}>
                      <Value value={v} />
                    </TableCell>
                  ))
                )}
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
