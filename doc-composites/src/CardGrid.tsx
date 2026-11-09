/**
 * CardGrid: one or more cards, each with a title, a short text, an optional label and an optional
 * link. Built from the scheme's Card and Badge (through Label), used through their props only. The
 * docs generator writes the cards (_composites.json); the page holds one line:
 * ::card-grid{id="inventory/actions"}
 */
import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@open-ds/ui/components/card";
import { Progress } from "@open-ds/ui/components/progress";
import { TriangleAlert } from "lucide-react";
import Label, { type LabelProps } from "./Label";
import Sample from "./Sample";

export type CardItem = {
  // A line above the title, such as the question a card answers.
  eyebrow?: string;
  title: string;
  text: string;
  label?: { text: string; tone?: LabelProps["tone"] };
  // The answer that sets the card's values, such as "Values: Large".
  answer?: { label: string; text: string };
  // A picture for the card: a robot's day and night editions.
  robot?: { day: string; night: string };
  // A few values drawn small (kind and value), or a short line of text or code.
  samples?: { kind: string; value: string; note?: string }[];
  // How much of a set is in use, as the scheme's Progress.
  meter?: { value: number; max: number; label: string };
  // A key the card cites, shown as code at its foot.
  code?: string;
  href?: string;
  // A link card ends with an arrow, so it reads as a way on.
  go?: boolean;
};
export type CardGridData = { cards: CardItem[] };

function Samples({ list }: { list: NonNullable<CardItem["samples"]> }) {
  return (
    <div className="flex flex-wrap items-end gap-[var(--space-gap-tight)]">
      {list.map((x, i) =>
        x.kind === "text" ? (
          <span key={i} className="text-[length:var(--type-caption-font-size)]">
            {x.value}
          </span>
        ) : x.kind === "code" ? (
          <code key={i}>{x.value}</code>
        ) : (
          <Sample key={i} kind={x.kind} value={x.value} />
        ),
      )}
    </div>
  );
}

// A scope card's values, drawn small as RC1 drew them: swatches, rising columns, outlined corners,
// type set in each family, a moving dot, lifted boxes. Drawings of values, in the scheme's tokens.
const note = "[font-family:var(--type-data-font-family)] text-[length:var(--type-caption-font-size)] text-[color:var(--color-text-muted)]";
function Drawn({ x }: { x: { kind: string; value: string; note?: string } }) {
  switch (x.kind) {
    case "column":
      return <i aria-hidden="true" className="w-2 rounded-[var(--radius-badge)] bg-[var(--color-action-primary)]" style={{ height: `max(3px, ${x.value})` }} />;
    case "target":
      return <i aria-hidden="true" className="rounded-[var(--radius-control)] border-2 border-dashed border-[var(--color-action-primary)]" style={{ width: x.value, height: x.value }} />;
    case "mode":
      return <i aria-hidden="true" className="h-5.5 w-7.5 rounded-[var(--radius-badge)] border border-[var(--color-border-default)]" style={{ background: x.value }} />;
    case "icon-label":
      return (
        <span className="rounded-[var(--radius-control)] border border-[var(--color-border-default)] px-[var(--space-gap-default)] text-[length:var(--type-caption-font-size)]">
          <TriangleAlert aria-hidden="true" className="inline size-3 align-baseline" /> {x.value}
        </span>
      );
    case "quote":
      return <span className="border-l-3 border-[var(--color-action-primary)] pl-[var(--space-gap-default)] text-[length:var(--type-caption-font-size)] font-semibold">{x.value}</span>;
    case "count":
      return (
        <span className="flex items-baseline gap-[var(--space-gap-tight)] text-[length:var(--type-caption-font-size)]">
          <b className="text-[length:var(--type-title-font-size)] text-[color:var(--color-action-primary)]">{x.value}</b>
          <span className="font-semibold">{x.note}</span>
        </span>
      );
    case "color":
      return <i aria-hidden="true" className="size-5.5 rounded-[var(--radius-badge)] border border-[var(--color-border-default)]" style={{ background: x.value }} />;
    case "bar":
      return <i aria-hidden="true" className="h-2.5 rounded-[var(--radius-badge)] bg-[var(--color-action-primary)] opacity-80" style={{ width: x.value }} />;
    case "radius":
      return <i aria-hidden="true" className="h-5.5 w-7.5 border-2 border-[var(--color-action-primary)]" style={{ borderRadius: x.value }} />;
    case "font":
      return <span aria-hidden="true" className="text-2xl leading-none font-semibold" style={{ fontFamily: x.value }}>Aa</span>;
    case "shadow":
      return <i aria-hidden="true" className="h-6.5 w-10 rounded-[var(--radius-control)] border border-[var(--color-border-default)] bg-[var(--color-surface-raised)]" style={{ boxShadow: x.value }} />;
    case "duration":
      return (
        <>
          <i aria-hidden="true" className="ods-slide size-2.5 rounded-full bg-[var(--color-action-primary)]" style={{ ["--ods-d" as string]: x.value }} />
          {x.note && <span className={note}>{x.note}</span>}
        </>
      );
    case "text":
      return <span className={note}>{x.value}</span>;
    case "code":
      return <code className="text-[length:var(--type-caption-font-size)]">{x.value}</code>;
    default:
      return <Sample kind={x.kind} value={x.value} />;
  }
}

// A scope card: the robot on a band across the top, the title, its values, the count and the meter.
function ScopeCard({ card }: { card: CardItem }) {
  // Shadows sit on a sunken band on the Primitives cards, as RC1 drew them.
  const lifted = !card.answer && card.samples?.some((x) => x.kind === "shadow");
  return (
    <Card>
      <span aria-hidden="true" className="-mx-[var(--card-padding)] -mt-[var(--card-padding)] flex h-42 justify-center rounded-t-[var(--card-radius)] bg-[var(--color-surface-sunken)] p-[var(--space-gap-default)] [&_img]:max-h-full">
        <img src={card.robot!.day} alt="" loading="lazy" className="dark:hidden" />
        <img src={card.robot!.night} alt="" loading="lazy" className="hidden dark:block" />
      </span>
      <CardHeader>
        <CardTitle>{card.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {card.answer && (
          // A long answer wraps inside the card.
          <span className="flex max-w-full [&>*]:flex-wrap [&>*]:whitespace-normal">
            <Label tone="info">
              <span className="[font-family:var(--type-data-font-family)] font-normal uppercase tracking-wider">{card.answer.label}</span>
              {card.answer.text}
            </Label>
          </span>
        )}
        {card.answer && <CardDescription>{card.text}</CardDescription>}
        {card.samples && (
          <div className={`flex min-h-8 flex-wrap items-end gap-[var(--space-gap-default)] ${lifted ? "rounded-[var(--radius-control)] bg-[var(--color-surface-sunken)] p-[var(--space-gap-default)]" : ""}`}>
            {card.samples.map((x, i) => (
              <Drawn key={i} x={x} />
            ))}
          </div>
        )}
        {!card.answer && <CardDescription>{card.text}</CardDescription>}
        {card.meter && (
          <Progress value={(card.meter.value / card.meter.max) * 100} aria-label={card.meter.label} />
        )}
      </CardContent>
    </Card>
  );
}

function OneCard({ card }: { card: CardItem }) {
  const body = card.robot ? (
    <ScopeCard card={card} />
  ) : (
    <Card>
      <CardHeader>
        {card.eyebrow && <CardDescription>{card.eyebrow}</CardDescription>}
        <CardTitle>{card.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {card.answer && (
          <span className="flex flex-wrap items-center gap-[var(--space-gap-tight)]">
            <CardDescription>{card.answer.label}</CardDescription>
            <Label tone="info">{card.answer.text}</Label>
          </span>
        )}
        <CardDescription>{card.text}</CardDescription>
        {card.samples && <Samples list={card.samples} />}
        {card.meter && (
          <Progress
            value={(card.meter.value / card.meter.max) * 100}
            aria-label={card.meter.label}
          />
        )}
      </CardContent>
      {(card.label || card.code || card.go) && (
        <CardFooter>
          {card.label && (
            <Label tone={card.label.tone}>{card.label.text}</Label>
          )}
          {card.code && <code>{card.code}</code>}
          {card.go && <span aria-hidden="true">→</span>}
        </CardFooter>
      )}
    </Card>
  );
  return card.href ? (
    <a
      href={card.href}
      className="grid text-[inherit] no-underline hover:no-underline"
    >
      {body}
    </a>
  ) : (
    <div className="grid">{body}</div>
  );
}

export default function CardGrid({ data }: { data: CardGridData }) {
  return (
    <div
      data-composite="card-grid"
      className={
        data.cards.some((c) => c.robot)
          ? "grid gap-[var(--space-gap-group)] sm:grid-cols-2 lg:grid-cols-4"
          : data.cards.length > 1
            ? "grid gap-[var(--space-gap-default)] sm:grid-cols-2 lg:grid-cols-3"
            : "grid gap-[var(--space-gap-default)]"
      }
    >
      {data.cards.map((c) => (
        <OneCard key={c.title} card={c} />
      ))}
    </div>
  );
}
