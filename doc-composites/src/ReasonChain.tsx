/**
 * ReasonChain: one answer and what follows from it. The question, the scheme's answer and why, then
 * what that answer decided and what would move if it changed. Built on the Frame base form, so its
 * box takes the scheme's surface corner (a pill Item drew it as an oval in Brand expressive, OD-286),
 * and the scheme's Badge (through Label), used through its props only. The docs generator writes the steps
 * (_composites.json); the page holds one line: ::reason-chain{id="field/people.q1"}
 */
import * as React from "react";
import Frame from "./base/Frame";
import { Check, Minus } from "lucide-react";
import { Icon } from "@open-ds/ui/components/icon";
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
    <div className="flex min-w-0 flex-col gap-[var(--space-gap-tight)]">
      <div className="flex items-center gap-[var(--space-gap-tight)] font-semibold text-[color:var(--color-text-primary)]">
        {/* The step's number in a small circle, as on RC1. */}
        <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-sunken)] text-[length:var(--type-caption-font-size)] text-[color:var(--color-text-secondary)]">
          {n}
        </span>
        {step.title}
      </div>
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
              <li key={i} className="flex items-start gap-[var(--space-gap-tight)]">
                {/* Used: a check in the success color. Not used: a dash in the muted color. */}
                <span className={`mt-[calc((1lh_-_var(--size-icon))/2)] flex ${l.used ? "text-[color:var(--color-status-success)]" : "text-[color:var(--color-text-muted)]"}`}>
                  <Icon icon={l.used ? Check : Minus} label={l.used ? "used" : "not used"} />
                </span>
                <span>
                  {l.verb} <b>{l.subject}</b>: {l.text}
                </span>
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
    </div>
  );
}

export default function ReasonChain({ data }: { data: ReasonChainData }) {
  return (
    <section id={data.anchor} data-composite="reason-chain" className="mb-[var(--space-gap-default)]">
      <Frame>
        <div className="mb-[var(--space-gap-default)] flex flex-wrap items-center justify-between gap-[var(--space-gap-tight)]">
          <b className="text-[color:var(--color-text-primary)]">{data.question}</b>
          <code>{data.key}</code>
        </div>
        <div className="grid gap-[var(--space-gap-default)] sm:grid-cols-3">
          {data.steps.map((s, i) => (
            <Step key={i} step={s} n={i + 1} />
          ))}
        </div>
      </Frame>
    </section>
  );
}
