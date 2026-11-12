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
import Label, { type LabelProps } from "./base/Label";
import Robot, { type RobotPics } from "./base/Robot";
import Sample from "./Sample";
import Drawn from "./drawn";

export type CardItem = {
  // A line above the title, such as the question a card answers.
  eyebrow?: string;
  title: string;
  text: string;
  // A second fact beside the text, such as "53 in use".
  note?: string;
  // A state, and a detail of it shown after it, such as In, built.
  label?: { text: string; note?: string; tone?: LabelProps["tone"] };
  // The answer that sets the card's values, such as "Values: Large".
  answer?: { label: string; text: string };
  // A picture for the card: a robot's day and night editions.
  robot?: RobotPics;
  // A few values drawn small (kind and value), or a short line of text or code.
  samples?: { kind: string; value?: string; note?: string; names?: string[] }[];
  // How much of a set is in use, as the scheme's Progress.
  meter?: { value: number; max: number; label: string };
  // A key the card cites, shown as code at its foot.
  code?: string;
  href?: string;
  // A link card ends with an arrow, so it reads as a way on.
  go?: boolean;
};
export type CardGridData = { cards: CardItem[] };

const cardText = (card: CardItem) => (card.note ? `${card.text} · ${card.note}` : card.text);

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
        ) : x.kind === "names" ? (
          <span key={i} className="text-[length:var(--type-caption-font-size)]">
            {x.names?.join(" · ")}
          </span>
        ) : (
          <Sample key={i} kind={x.kind} value={x.value ?? ""} />
        ),
      )}
    </div>
  );
}

// A scope card: the robot on a band across the top, the title, its values, the count and the meter.
function ScopeCard({ card }: { card: CardItem }) {
  // Shadows sit on a sunken band on the Primitives cards, as RC1 drew them.
  const lifted = !card.answer && card.samples?.some((x) => x.kind === "shadow");
  return (
    <Card>
      <Robot
        robot={card.robot!}
        className="mx-[calc(var(--card-padding)*-1)] mt-[calc(var(--card-padding)*-1)] flex h-42 min-w-0 justify-center overflow-hidden rounded-t-[var(--card-radius)] bg-[var(--color-surface-sunken)] p-[var(--space-gap-default)] [&_img]:max-h-full [&_img]:min-w-0 [&_img]:object-contain"
      />
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
        {!card.answer && <CardDescription>{cardText(card)}</CardDescription>}
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
        <CardDescription>{cardText(card)}</CardDescription>
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
            <Label tone={card.label.tone}>
              {card.label.note ? `${card.label.text} · ${card.label.note}` : card.label.text}
            </Label>
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
      className="grid min-w-0 text-[inherit] no-underline hover:no-underline [&>*]:min-w-0"
    >
      {body}
    </a>
  ) : (
    <div className="grid min-w-0 [&>*]:min-w-0">{body}</div>
  );
}

export default function CardGrid({ data }: { data: CardGridData }) {
  return (
    <div
      data-composite="card-grid"
      className={
        data.cards.some((c) => c.robot)
          ? // As many scope cards as fit: a card is never narrower than its words need plus the
            // scheme's own card padding, so a roomy scheme shows fewer across, not squeezed ones.
            "grid gap-[var(--space-gap-group)] [grid-template-columns:repeat(auto-fill,minmax(calc(10rem+2*var(--card-padding)),1fr))]"
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
