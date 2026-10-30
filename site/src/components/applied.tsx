"use client";
// "One screen built only from its answers" (Figma 117:990). Real components in the scheme's
// tokens, with a brand and mode switch. Only data attributes change.
import {
  Badge,
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@open-ds/ui";
import { useState } from "react";

const ROWS: [string, string, string, "success" | "warning" | "danger", string, string][] = [
  ["#1042", "Pine Street Co.", "Oct 28", "success", "Shipped", "1,240.00"],
  ["#1043", "Lumen Labs", "Oct 28", "warning", "Pending", "86.50"],
  ["#1044", "Atlas Foods", "Oct 27", "success", "Shipped", "3,915.20"],
  ["#1045", "Kite & Co.", "Oct 27", "danger", "Refunded", "212.00"],
  ["#1046", "Harbor Studio", "Oct 27", "success", "Shipped", "640.75"],
  ["#1047", "Oro Market", "Oct 26", "warning", "Pending", "1,078.40"],
  ["#1048", "Fieldnote", "Oct 26", "success", "Shipped", "54.90"],
];

const KPIS: [string, string, string][] = [
  ["Revenue today", "12,480.00", "+4.2%"],
  ["Open orders", "86", "−3"],
  ["Refunds", "3", "+1"],
  ["Avg. ship time", "1.8 d", "−0.2"],
];

export function Applied({
  scheme,
  brands,
  toast,
}: {
  scheme: string;
  brands: { id: string; label: string }[];
  toast: string;
}) {
  const [brand, setBrand] = useState(brands[0].id);
  const [dark, setDark] = useState(false);
  const chip =
    "rounded-[4px] border border-line px-[10px] py-[5px] font-mono text-[12px] aria-pressed:bg-ink aria-pressed:text-paper";
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Theme">
        {brands.length > 1 &&
          brands.map((b) => (
            <button
              key={b.id}
              type="button"
              aria-pressed={brand === b.id}
              onClick={() => setBrand(b.id)}
              className={chip}
            >
              {b.label}
            </button>
          ))}
        <button type="button" aria-pressed={!dark} onClick={() => setDark(false)} className={chip}>
          Light
        </button>
        <button type="button" aria-pressed={dark} onClick={() => setDark(true)} className={chip}>
          Dark
        </button>
      </div>
      <div
        data-scheme={scheme}
        data-brand={brands.length > 1 ? brand : undefined}
        className={`${dark ? "dark " : ""}flex flex-col gap-4 rounded-[8px] border border-[var(--color-border-default)] bg-[var(--color-surface-canvas)] p-6 text-[var(--color-text-primary)] [font-family:var(--type-body-font-family)] text-[length:var(--type-body-font-size)]`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <p className="[font-family:var(--type-title-font-family)] text-[length:var(--type-title-font-size)] [font-weight:var(--type-title-font-weight)]">
            Orders
          </p>
          <div className="ml-auto flex flex-wrap items-center gap-3">
            <Input
              aria-label="Filter by customer"
              placeholder="Filter by customer"
              className="w-[240px]"
            />
            <Button variant="secondary">Export</Button>
            <Button>New order</Button>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {KPIS.map(([k, v, d]) => (
            <div
              key={k}
              className="rounded-[var(--radius-container)] border border-[var(--card-border)] bg-[var(--card-background)] p-3"
            >
              <p className="text-[length:var(--type-caption-font-size)] uppercase text-[var(--color-text-secondary)]">
                {k}
              </p>
              <p className="[font-family:var(--type-data-font-family)] text-[length:var(--type-title-font-size)]">
                {v}{" "}
                <span className="text-[length:var(--type-caption-font-size)] text-[var(--color-text-muted)]">
                  {d}
                </span>
              </p>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-[var(--radius-container)] border border-[var(--card-border)] bg-[var(--card-background)]">
          <Table>
            <TableHeader>
              <TableRow>
                {["Order", "Customer", "Date", "Status", "Amount"].map((h) => (
                  <TableHead key={h} className={h === "Amount" ? "text-right" : ""}>
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROWS.map(([id, who, date, tone, state, amount]) => (
                <TableRow key={id}>
                  <TableCell className="[font-family:var(--type-data-font-family)]">{id}</TableCell>
                  <TableCell>{who}</TableCell>
                  <TableCell>{date}</TableCell>
                  <TableCell>
                    <Badge tone={tone}>{state}</Badge>
                  </TableCell>
                  <TableCell className="text-right [font-family:var(--type-data-font-family)]">
                    {amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-[length:var(--type-caption-font-size)] text-[var(--color-text-secondary)]">
          {toast}
        </p>
      </div>
    </div>
  );
}
