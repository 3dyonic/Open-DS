/**
 * Specimen: values shown as themselves, such as a corner, a color, a shadow or a typeface, each with
 * its name. Built from the scheme's Card and Badge (through Label), used through their props only.
 * The drawing is the one custom part. The docs generator writes the items (<page>.json beside the
 * page); the page holds one line: ::specimen{id="type/fonts"}
 */
import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@open-ds/ui/components/card";
import Label, { type LabelProps } from "./Label";

export type SpecimenItem = {
  // The value drawn: a fill, a corner or a shadow.
  draw?: { color?: string; radius?: string; shadow?: string };
  // A typeface: its CSS font-family, and a large sample set in it.
  font?: string;
  big?: string;
  token?: string;
  // A status shown as the scheme's Badge, before its lines.
  label?: { text: string; tone?: LabelProps["tone"] };
  lines?: string[];
  // Text set in the item's typeface.
  sample?: string[];
  weights?: { weight: number; name: string }[];
  read?: { label: string; codes: string[] };
  foot?: string;
};
export type SpecimenData = { title?: string; items: SpecimenItem[] };

const small = "text-[length:var(--type-caption-font-size)]";
const data = "[font-family:var(--type-data-font-family)]";
const muted = "text-[color:var(--color-text-muted)]";

function Drawing({ draw }: { draw: NonNullable<SpecimenItem["draw"]> }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block size-[var(--type-title-font-size)] shrink-0 border border-[var(--color-border-strong)] bg-[var(--color-surface-sunken)]"
      style={{
        background: draw.color,
        borderRadius: draw.radius,
        boxShadow: draw.shadow,
      }}
    />
  );
}

function Item({ item }: { item: SpecimenItem }) {
  const face = item.font ? { fontFamily: item.font } : undefined;
  return (
    <div className="flex flex-col gap-[var(--space-gap-tight)]">
      {(item.big || item.token) && (
        <div className="flex flex-wrap items-end justify-between gap-[var(--space-gap-tight)]">
          {item.big && (
            <span className="text-6xl leading-none" style={face}>
              {item.big}
            </span>
          )}
          {item.token && <span className={`${small} ${data} ${muted}`}>{item.token}</span>}
        </div>
      )}
      {(item.draw || item.label || item.lines) && (
        <div className="flex items-center gap-[var(--space-gap-tight)]">
          {item.draw && <Drawing draw={item.draw} />}
          {item.label && (
            <Label tone={item.label.tone}>{item.label.text}</Label>
          )}
          {item.lines && (
            <span className="flex flex-col">
              {item.lines.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </span>
          )}
        </div>
      )}
      {item.sample?.map((l) => (
        <span key={l} className="text-lg" style={face}>
          {l}
        </span>
      ))}
      {item.weights && (
        <div
          className="flex flex-wrap gap-[var(--space-gap-default)]"
          style={face}
        >
          {item.weights.map((w) => (
            <span
              key={w.weight}
              className="flex flex-col"
              style={{ fontWeight: w.weight }}
            >
              {w.name}
              <span className={`${small} ${data} ${muted} font-normal`}>{w.weight}</span>
            </span>
          ))}
        </div>
      )}
      {item.read && (
        <div
          className={`flex flex-wrap items-center gap-[var(--space-gap-tight)] ${small}`}
        >
          {item.read.label}
          {item.read.codes.map((c) => (
            <code key={c} className={muted}>
              {c}
            </code>
          ))}
        </div>
      )}
      {item.foot && <span className={`${small} ${data} ${muted}`}>{item.foot}</span>}
    </div>
  );
}

export default function Specimen({ data }: { data: SpecimenData }) {
  // Typefaces each get a card, two across; statuses stack, one per line; small values wrap in a row.
  if (data.items.some((i) => i.big))
    return (
      <div data-composite="specimen" className="mb-[var(--space-gap-group)] grid gap-[var(--space-gap-group)] sm:grid-cols-2">
        {data.items.map((item, i) => (
          <Card key={i}>
            <CardContent>
              <Item item={item} />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  const layout = data.items.some((i) => i.label)
    ? "flex flex-col gap-[var(--space-gap-default)]"
    : "flex flex-wrap gap-[var(--space-gap-default)]";
  return (
    <div data-composite="specimen">
      <Card>
        {data.title && (
          <CardHeader>
            <CardTitle>{data.title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className={layout}>
            {data.items.map((item, i) => (
              <Item key={i} item={item} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
