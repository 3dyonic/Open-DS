/**
 * DecisionAnswer: one answer of a scheme under its question: why, what it weighs, what it came from
 * and every design decision it made, as a tree. Built from the scheme's Badge (through Label), used
 * through its props only; the kind icons are lucide-react, as in the components; the connector lines are a drawing. The data follows
 * doc-composites/schemas/decision-answer.schema.json; the page holds the question as a heading, then
 * one line: ::decision-answer{id="people-q1"}
 */
import * as React from "react";
import Label from "./base/Label";
import { Tree, Twig } from "./base/Tree";
import { measuredText, type MeasuredText } from "./base/Measured";
import { Brush, Component, MessageCircle, Scale } from "lucide-react";

type Link = { label: string; href: string };
// An answer of the scheme: its scope (for a scope question), the question and the answer.
type AnswerFact = { scope?: string; question: string; answer: string };
// A theme pick: the token, the mode it holds in, the step it picks and why, with each ratio a number.
type PickFact = { token: string; mode: "light" | "dark" | "every mode"; pick: string; why?: MeasuredText };
type Decision = ({ text: string } | AnswerFact | PickFact) & { link?: Link };
export type DecisionAnswerData = {
  answer: string;
  why: string;
  weighs?: { group: string; items: { label: string; text: string }[] }[];
  because: AnswerFact[];
  decided: {
    groups: { kind: "answers" | "rules" | "variants" | "picks"; items: Decision[] }[];
    values?: Link;
  };
};

const answerLine = (a: AnswerFact) => `${a.scope ? `${a.scope} · ` : ""}${a.question} → ${a.answer}`;
const decisionLine = (d: Decision) =>
  "text" in d
    ? d.text
    : "question" in d
      ? answerLine(d)
      : `${d.token}${d.mode === "every mode" ? "" : ` in ${d.mode}`}: ${d.why ? measuredText(d.why) : d.pick}`;

// One icon per kind of decision, from lucide-react, the icons the scheme's components use.
const ICONS = { answers: MessageCircle, rules: Scale, variants: Component, picks: Brush };
const TITLES = {
  answers: "Answers it led to",
  rules: "Rules it sets",
  variants: "Variants it picks",
  picks: "Theme picks it sets",
};

const head = "text-[length:var(--type-caption-font-size)] font-semibold text-[color:var(--color-text-primary)]";
const muted = "text-[color:var(--color-text-muted)]";
const go = "ml-auto shrink-0 whitespace-nowrap text-[length:var(--type-caption-font-size)]";

function Line({ text, link }: { text: string; link?: Link }) {
  return (
    <span className="flex items-start gap-[var(--space-gap-default)]">
      <span className="min-w-0">{text}</span>
      {link && (
        <a className={go} href={link.href}>
          {link.label} →
        </a>
      )}
    </span>
  );
}

export default function DecisionAnswer({ data }: { data: DecisionAnswerData }) {
  const count = data.decided.groups.reduce((n, g) => n + g.items.length, 0);
  return (
    <div data-composite="decision-answer" className="ml-[var(--space-gap-group)] flex flex-col items-start gap-[var(--space-gap-default)]">
      <Label tone="info">{data.answer}</Label>
      <div className="w-full">
        <Tree>
          <Twig>
            <span className="inline-flex flex-wrap gap-[var(--space-gap-default)]">
              <span className={head}>Why</span>
              <span className={muted}>{data.why}</span>
            </span>
          </Twig>
          {data.weighs?.length ? (
            <Twig>
              <span className={head}>What it weighs ({data.weighs.reduce((n, g) => n + g.items.length, 0)})</span>
              <Tree>
                {data.weighs.map((g) => (
                  <Twig key={g.group}>
                    <span className={head}>{g.group}</span>
                    <Tree>
                      {g.items.map((k) => (
                        <Twig key={k.label}>
                          <b>{k.label}.</b> {k.text}
                        </Twig>
                      ))}
                    </Tree>
                  </Twig>
                ))}
              </Tree>
            </Twig>
          ) : null}
          <Twig>
            {data.because.length ? (
              <>
                <span className={head}>Because of</span>
                <Tree>
                  {data.because.map((b) => (
                    <Twig key={b.question}>{answerLine(b)}</Twig>
                  ))}
                </Tree>
              </>
            ) : (
              <span className="inline-flex flex-wrap gap-[var(--space-gap-default)]">
                <span className={head}>Because of</span>
                <span className={muted}>Nothing before it. It's one of the first answers.</span>
              </span>
            )}
          </Twig>
          <Twig>
            <span className={head}>What it decided{count ? ` (${count})` : ""}</span>
            <Tree>
              {data.decided.groups.map((g) => (
                <Twig key={g.kind}>
                  <span className={`inline-flex items-center gap-[var(--space-gap-tight)] ${head}`}>
                    {React.createElement(ICONS[g.kind], { "aria-hidden": true, className: "size-4 shrink-0" })}
                    {TITLES[g.kind]} ({g.items.length})
                  </span>
                  <Tree>
                    {g.items.map((d, i) => (
                      <Twig key={i}>
                        <Line text={decisionLine(d)} link={d.link} />
                      </Twig>
                    ))}
                  </Tree>
                </Twig>
              ))}
              {data.decided.values && (
                <Twig>
                  <Line text="It sets the values of its tokens." link={data.decided.values} />
                </Twig>
              )}
            </Tree>
          </Twig>
        </Tree>
      </div>
    </div>
  );
}
