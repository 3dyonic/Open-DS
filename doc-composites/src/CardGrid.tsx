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
  samples?: { kind: string; value: string }[];
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

function OneCard({ card }: { card: CardItem }) {
  const body = (
    <Card>
      {card.robot && (
        <span aria-hidden="true" className="w-24">
          <img
            src={card.robot.day}
            alt=""
            loading="lazy"
            className="dark:hidden"
          />
          <img
            src={card.robot.night}
            alt=""
            loading="lazy"
            className="hidden dark:block"
          />
        </span>
      )}
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
        data.cards.length > 1
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
