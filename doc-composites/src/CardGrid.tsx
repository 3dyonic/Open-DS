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
import Label, { type LabelProps } from "./Label";

export type CardItem = {
  // A line above the title, such as the question a card answers.
  eyebrow?: string;
  title: string;
  text: string;
  label?: { text: string; tone?: LabelProps["tone"] };
  // A key the card cites, shown as code at its foot.
  code?: string;
  href?: string;
  // A link card ends with an arrow, so it reads as a way on.
  go?: boolean;
};
export type CardGridData = { cards: CardItem[] };

function OneCard({ card }: { card: CardItem }) {
  const body = (
    <Card>
      <CardHeader>
        {card.eyebrow && <CardDescription>{card.eyebrow}</CardDescription>}
        <CardTitle>{card.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{card.text}</CardDescription>
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
