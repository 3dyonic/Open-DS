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
import { useTheme } from "@/components/theme-switch";

// Everything shown comes from the scheme's own samples: its screen, figures, rows, statuses and
// words. A table appears only when the scheme carries one; otherwise its card and field do the work.
type Meaning = "neutral" | "success" | "warning" | "danger";
export interface AppliedSamples {
  screen: string;
  actions: { primary: string; secondary: string };
  statuses: { label: string; meaning: Meaning }[];
  metrics: { label: string; value: string }[];
  field: { label: string; placeholder: string; hint: string };
  table?: {
    caption: string;
    columns: { label: string; numeric?: boolean }[];
    rows: { cells: string[]; status: string }[];
  };
  card?: { title: string; description: string; status: string; primary: string; secondary: string };
  messages?: { success: string };
}

export function Applied({
  scheme,
  brands,
  toast,
  samples: s,
  inventory,
}: {
  scheme: string;
  brands: { id: string; label: string }[];
  toast: string;
  samples: AppliedSamples;
  inventory: string[];
}) {
  const tone = (label: string): Meaning =>
    s.statuses.find((x) => x.label === label)?.meaning ?? "neutral";
  const [brand, setBrand] = useState(brands[0].id);
  // Light or dark: the site theme until someone picks one here.
  const siteTheme = useTheme();
  const [picked, setDark] = useState<boolean | null>(null);
  const dark = picked ?? siteTheme === "dark";
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
        data-mode={dark ? undefined : "light"}
        className={`${dark ? "dark " : ""}flex flex-col gap-4 rounded-[8px] border border-[var(--color-border-default)] bg-[var(--color-surface-canvas)] p-6 text-[var(--color-text-primary)] [font-family:var(--type-body-font-family)] text-[length:var(--type-body-font-size)]`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <p className="[font-family:var(--type-title-font-family)] text-[length:var(--type-title-font-size)] [font-weight:var(--type-title-font-weight)]">
            {s.screen}
          </p>
          <div className="ml-auto flex flex-wrap items-center gap-3">
            <Input
              aria-label={s.field.label}
              placeholder={s.field.placeholder || s.field.label}
              className="w-[240px]"
            />
            <Button variant="secondary">{s.actions.secondary}</Button>
            <Button>{s.actions.primary}</Button>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {s.metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-[var(--radius-container)] border border-[var(--card-border)] bg-[var(--card-background)] p-3"
            >
              <p className="text-[length:var(--type-caption-font-size)] uppercase text-[var(--color-text-secondary)]">
                {m.label}
              </p>
              <p className="[font-family:var(--type-data-font-family)] text-[length:var(--type-title-font-size)]">
                {m.value}
              </p>
            </div>
          ))}
        </div>
        {s.table && inventory.includes("table") ? (
          <div className="overflow-x-auto rounded-[var(--radius-container)] border border-[var(--card-border)] bg-[var(--card-background)]">
            <Table aria-label={s.table.caption}>
              <TableHeader>
                <TableRow>
                  {s.table.columns.map((c) => (
                    <TableHead key={c.label} className={c.numeric ? "text-right" : ""}>
                      {c.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {s.table.rows.slice(0, 7).map((r) => (
                  <TableRow key={r.cells[0]}>
                    {r.cells.map((cell, j) => (
                      <TableCell
                        key={j}
                        className={
                          s.table!.columns[j].numeric || j === 0
                            ? `[font-family:var(--type-data-font-family)]${s.table!.columns[j].numeric ? " text-right" : ""}`
                            : ""
                        }
                      >
                        {cell}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Badge tone={tone(r.status)}>{r.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          s.card && (
            <div className="flex flex-col gap-2 rounded-[var(--card-radius)] border border-[var(--card-border)] bg-[var(--card-background)] p-[var(--card-padding)]">
              <p className="[font-family:var(--type-heading-font-family)] text-[length:var(--type-heading-font-size)] [font-weight:var(--type-heading-font-weight)]">
                {s.card.title}
              </p>
              <p className="text-[var(--color-text-secondary)]">{s.card.description}</p>
              {inventory.includes("badge") && (
                <span>
                  <Badge tone={tone(s.card.status)}>{s.card.status}</Badge>
                </span>
              )}
              <div className="flex flex-wrap gap-3">
                <Button>{s.card.primary}</Button>
                <Button variant="ghost">{s.card.secondary}</Button>
              </div>
            </div>
          )
        )}
        <p className="text-[length:var(--type-caption-font-size)] text-[var(--color-text-secondary)]">
          {s.messages?.success ?? toast}
        </p>
      </div>
    </div>
  );
}
