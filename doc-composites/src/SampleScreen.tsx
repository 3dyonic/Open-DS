/**
 * SampleScreen: the scheme's own sample screen on its home page, built from its real components (Card,
 * Table, Badge through the Label base form, Button, Input) with its own sample content: a table where the scheme carries one, else
 * a card, an article opening, a form step, a launch or the same card in each brand. The docs generator
 * writes the content (<page>.json beside the page); the page holds one line: ::sample-screen{id="home"}
 */
import * as React from "react";
import Label, { type LabelProps } from "./base/Label";
import { Button } from "@open-ds/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@open-ds/ui/components/card";
import { Input } from "@open-ds/ui/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@open-ds/ui/components/table";

type Status = { text: string; tone?: LabelProps["tone"] };
export type SampleScreenData = {
  // The screen's name, shown in its bar.
  screen?: string;
  // Each brand's name, when the same card shows once per brand.
  brands?: string[];
  eyebrow?: string;
  title?: string;
  status?: Status;
  description?: string;
  body?: string;
  metrics?: { value: string; label: string }[];
  field?: { label: string; hint?: string; placeholder?: string };
  table?: {
    caption: string;
    columns: { label: string; numeric?: boolean }[];
    rows: { cells: string[]; status: Status }[];
  };
  actions?: { primary?: string; secondary?: string; link?: string };
};

function Actions({ a }: { a?: SampleScreenData["actions"] }) {
  if (!a || !(a.primary || a.secondary || a.link)) return null;
  return (
    <CardFooter>
      {a.secondary && <Button variant="secondary">{a.secondary}</Button>}
      {a.primary && <Button>{a.primary}</Button>}
      {a.link && <span>{a.link}</span>}
    </CardFooter>
  );
}

function Body({ d, eyebrow }: { d: SampleScreenData; eyebrow?: string }) {
  return (
    <>
      {(eyebrow || d.title || d.status) && (
        <CardHeader>
          {eyebrow && <CardDescription>{eyebrow}</CardDescription>}
          <div className="flex flex-wrap items-center justify-between gap-[var(--space-gap-tight)]">
            {d.title && <CardTitle>{d.title}</CardTitle>}
            {d.status && <Label tone={d.status.tone}>{d.status.text}</Label>}
          </div>
        </CardHeader>
      )}
      <CardContent>
        {d.description && <CardDescription>{d.description}</CardDescription>}
        {d.body && <p>{d.body}</p>}
        {d.metrics && (
          <div className="flex flex-wrap gap-[var(--space-gap-group)]">
            {d.metrics.map((m) => (
              <div key={m.label} className="flex flex-col">
                <b className="text-[length:var(--type-title-font-size)]">
                  {m.value}
                </b>
                <span className="text-[length:var(--type-caption-font-size)]">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        )}
        {d.field && (
          <label className="flex flex-col gap-[var(--space-gap-tight)]">
            <span>{d.field.label}</span>
            {d.field.hint && <CardDescription>{d.field.hint}</CardDescription>}
            <Input readOnly placeholder={d.field.placeholder ?? ""} />
          </label>
        )}
        {d.table && (
          <Table>
            <TableHeader>
              <TableRow>
                {d.table.columns.map((c) => (
                  <TableHead key={c.label}>{c.label}</TableHead>
                ))}
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {d.table.rows.map((r, i) => (
                <TableRow key={i}>
                  {r.cells.map((c, k) => (
                    <TableCell key={k} numeric={d.table?.columns[k]?.numeric}>
                      {c}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Label tone={r.status.tone}>{r.status.text}</Label>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <Actions a={d.actions} />
    </>
  );
}

export default function SampleScreen({ data }: { data: SampleScreenData }) {
  if (data.brands)
    return (
      <div
        data-composite="sample-screen"
        className="grid gap-[var(--space-gap-default)] sm:grid-cols-2"
      >
        {data.brands.map((b) => (
          <Card key={b}>
            <Body d={data} eyebrow={b} />
          </Card>
        ))}
      </div>
    );
  return (
    <div data-composite="sample-screen">
      <Card>
        {data.screen && (
          <CardHeader>
            <CardTitle>{data.screen}</CardTitle>
          </CardHeader>
        )}
        <Body d={data} eyebrow={data.eyebrow} />
      </Card>
    </div>
  );
}
