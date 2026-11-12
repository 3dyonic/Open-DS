/**
 * AnatomySteps: how the design decisions reach one part, from the answer about the product, through
 * the rule it set, to the token that carries it and the value you see. Each step opens with the icon
 * the Decision reference gives its kind, and its detail hangs from the tree's lines. Built from the
 * scheme's Badge (through Label) and the Chain base form, used through their props only. The data
 * follows doc-composites/schemas/anatomy-steps.schema.json; the page holds one line:
 * ::anatomy-steps{id="alert-dialog/card-1"}
 */
import * as React from "react";
import { Brush, MessageCircle, Scale } from "lucide-react";
import Chain from "./base/Chain";
import { measuredText, type MeasuredText } from "./base/Measured";
import Label from "./base/Label";
import { Tree, Twig } from "./base/Tree";

export type AnatomyStep =
  | { kind: "answer"; scope?: string; question: string; answer: string; why: string }
  | { kind: "rule"; situation: string; use: string; not?: string; why?: string }
  | {
      kind: "token";
      semantic: string;
      key?: string;
      value: string;
      darkValue?: string;
      byScheme: boolean;
      rule?: string;
      // Why the scheme picks the value, with each contrast ratio as a number.
      pick: MeasuredText;
      darkPick?: MeasuredText;
      shares: string[];
    };
export type AnatomyStepsData = { steps: AnatomyStep[] };

// The Decision reference's icon for each kind: an answer is said, a rule weighs, a token is the paint.
const ICON = { answer: MessageCircle, rule: Scale, token: Brush };
const TITLE = { answer: "Answer", rule: "Rule", token: "Token" };
const head = "inline-flex items-center gap-[var(--space-gap-tight)] text-[length:var(--type-caption-font-size)] font-semibold text-[color:var(--color-text-primary)]";
const muted = "text-[length:var(--type-caption-font-size)] text-[color:var(--color-text-muted)]";
const mono = "[font-family:var(--type-data-font-family)] text-[length:var(--type-caption-font-size)]";

function Detail({ s }: { s: AnatomyStep }) {
  if (s.kind === "answer")
    return (
      <>
        <span>
          {s.scope ? `${s.scope} · ` : ""}
          {s.question} → {s.answer}
        </span>
        <span className={`block ${muted}`}>{s.why}</span>
      </>
    );
  if (s.kind === "rule")
    return (
      <>
        <span>
          For {s.situation}, use {s.use}.{s.not ? ` Don't use ${s.not}.` : ""}
        </span>
        {s.why && <span className={`block ${muted}`}>{s.why}</span>}
      </>
    );
  const lines: [string, string][] = [
    ["Pick", measuredText(s.pick)],
    ...(s.darkPick ? ([["Dark", measuredText(s.darkPick)]] as [string, string][]) : []),
    ...(s.shares.length
      ? ([["Shares the step with", `${s.shares.join(", ")}. Changing this pick moves only what reads ${s.semantic}.`]] as [string, string][])
      : []),
  ];
  return (
    <>
      <span className="flex flex-wrap items-center gap-x-[var(--space-gap-default)] gap-y-[var(--space-gap-tight)]">
        <span className={mono}>
          <Chain parts={[s.semantic, s.key ?? "no key of its own yet", s.darkValue ? `${s.value} · dark ${s.darkValue}` : s.value]} />
        </span>
        {s.byScheme && <Label tone="info">By scheme</Label>}
      </span>
      {s.rule && <span className={`block ${muted}`}>{s.rule}</span>}
      <Tree>
        {lines.map(([k, v]) => (
          <Twig key={k}>
            <span className={muted}>
              <b className="text-[color:var(--color-text-primary)]">{k}</b> {v}
            </span>
          </Twig>
        ))}
      </Tree>
    </>
  );
}

export default function AnatomySteps({ data }: { data: AnatomyStepsData }) {
  return (
    <div data-composite="anatomy-steps">
      <Tree root>
        {data.steps.map((s, i) => (
          <Twig key={i} root>
            <span className={head}>
              {React.createElement(ICON[s.kind], { "aria-hidden": true, className: "size-4 shrink-0" })}
              {TITLE[s.kind]}
            </span>
            <Tree>
              <Twig>
                <Detail s={s} />
              </Twig>
            </Tree>
          </Twig>
        ))}
      </Tree>
    </div>
  );
}
