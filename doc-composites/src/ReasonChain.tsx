/**
 * ReasonChain: one answer and what follows from it. The question, the scheme's answer and why, then
 * what that answer decided and what would move if it changed. Built from the scheme's Item and Badge
 * (through Label), used through their props only. The docs generator writes the steps
 * (_composites.json); the page holds one line: ::reason-chain{id="field/people.q1"}
 */
import * as React from "react";
import {
  Item,
  ItemContent,
  ItemHeader,
  ItemTitle,
} from "@open-ds/ui/components/item";
import Label from "./Label";

export type ReasonLine = {
  used: boolean;
  verb: string;
  subject: string;
  text: string;
};
export type ReasonStep =
  | { kind: "answer"; title: string; answer: string; why: string }
  | {
      kind: "decided";
      title: string;
      lines: ReasonLine[];
      also?: { label: string; items: string[] };
    }
  | {
      kind: "change";
      title: string;
      count: number;
      caption: string;
      text: string;
    };
export type ReasonChainData = {
  anchor: string;
  question: string;
  key: string;
  steps: ReasonStep[];
};

const small = "text-[length:var(--type-caption-font-size)]";
const stack = "flex flex-col items-start gap-[var(--space-gap-tight)]";

function Step({ step, n }: { step: ReasonStep; n: number }) {
  return (
    <ItemContent>
      <ItemTitle>
        <Label>{n}</Label>
        {step.title}
      </ItemTitle>
      {step.kind === "answer" && (
        <div className={stack}>
          <Label tone="info">{step.answer}</Label>
          <p>{step.why}</p>
        </div>
      )}
      {step.kind === "decided" && (
        <div className={stack}>
          <ul className={`${stack} list-none pl-0`}>
            {step.lines.map((l, i) => (
              <li key={i}>
                <span aria-hidden="true">{l.used ? "✓" : "–"}</span> {l.verb}{" "}
                <b>{l.subject}</b>: {l.text}
              </li>
            ))}
          </ul>
          {step.also && (
            <p className="flex flex-wrap items-center gap-[var(--space-gap-tight)]">
              <span className={small}>{step.also.label}</span>
              {step.also.items.map((x) => (
                <Label key={x}>{x}</Label>
              ))}
            </p>
          )}
        </div>
      )}
      {step.kind === "change" && (
        <div className={stack}>
          <b className="text-[length:var(--type-display-font-size)]">
            {step.count}
          </b>
          <span className={small}>{step.caption}</span>
          <p>{step.text}</p>
        </div>
      )}
    </ItemContent>
  );
}

export default function ReasonChain({ data }: { data: ReasonChainData }) {
  return (
    <Item variant="outline" asChild>
      <section id={data.anchor} data-composite="reason-chain">
        <ItemHeader>
          <ItemTitle>{data.question}</ItemTitle>
          <code>{data.key}</code>
        </ItemHeader>
        <div className="grid basis-full gap-[var(--space-gap-default)] sm:grid-cols-3">
          {data.steps.map((s, i) => (
            <Step key={i} step={s} n={i + 1} />
          ))}
        </div>
      </section>
    </Item>
  );
}
