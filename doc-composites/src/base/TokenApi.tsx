/**
 * TokenApi: the tokens one thing is built from, each with its value. A base form: the token groups of
 * every foundation page extend it. A primitive shows only when its name says something the value does
 * not, such as radius.pill or shadow.overlay (OD-286); the generator decides, the data carries it.
 * Every step from a token to its value is joined by the Chain base form.
 */
import * as React from "react";
import Chain from "./Chain";

export type ApiRow = {
  token: string;
  primitive?: string;
  value: string;
  // The value in dark mode, when it differs.
  dark?: string;
};

const mono = "[font-family:var(--type-data-font-family)] text-[length:var(--type-caption-font-size)]";

export default function TokenApi({ rows }: { rows: ApiRow[] }) {
  return (
    <ul className={`m-0 grid list-none grid-cols-[auto_minmax(0,1fr)] gap-x-[var(--space-gap-default)] gap-y-[var(--space-gap-tight)] p-0 ${mono}`}>
      {rows.map((r) => (
        <li key={r.token} className="col-span-2 m-0 grid grid-cols-subgrid">
          <span className="text-[color:var(--color-text-primary)]">{r.token}</span>
          {/* A chain through a named primitive is long: it takes its own line under the token. */}
          <span
            className={`min-w-0 text-[color:var(--color-text-muted)] ${r.primitive ? "col-span-2 pl-[var(--space-gap-default)]" : ""}`}
          >
            <Chain lead parts={[...(r.primitive ? [r.primitive] : []), r.dark ? `${r.value} · dark ${r.dark}` : r.value]} />
          </span>
        </li>
      ))}
    </ul>
  );
}
