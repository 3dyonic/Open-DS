/**
 * DecisionAnswer: one answer of a scheme under its question: why, what it weighs, what it came from
 * and every design decision it made, as a tree. Built from the scheme's Badge (through Label), used
 * through its props only; the connector lines and the kind icons are drawings. The data follows
 * doc-composites/schemas/decision-answer.schema.json; the page holds the question as a heading, then
 * one line: ::decision-answer{id="people-q1"}
 */
import * as React from "react";
import Label from "./Label";
import { Tree, Twig } from "./tree";

type Link = { label: string; href: string };
export type DecisionAnswerData = {
  answer: string;
  why: string;
  weighs?: { group: string; items: { label: string; text: string }[] }[];
  because: string[];
  decided: {
    groups: { kind: "answers" | "rules" | "variants" | "picks"; items: { text: string; link?: Link }[] }[];
    values?: Link;
  };
};

// Lucide icons (MIT), drawn at 16px: message-circle, scale, component, brush.
const ICONS: Record<string, React.ReactNode> = {
  answers: <path d="M5.27 13.33A6 6 0 1 0 2.67 10.73L1.33 14.67Z" />,
  rules: (
    <>
      <path d="m10.67 10.67 2-5.34 2 5.34a3.3 3.3 0 0 1-4 0Z" />
      <path d="m1.33 10.67 2-5.34 2 5.34a3.3 3.3 0 0 1-4 0Z" />
      <path d="M4.67 14h6.66M8 2v12M2 4.67h1.33C4.67 4.67 6.67 4 8 3.33c1.33.67 3.33 1.34 4.67 1.34H14" />
    </>
  ),
  variants: (
    <>
      <path d="m10.36 7.53 1.58-1.59a.67.67 0 0 1 .94 0l1.59 1.59a.67.67 0 0 1 0 .94l-1.59 1.59a.67.67 0 0 1-.94 0l-1.58-1.59a.67.67 0 0 1 0-.94Z" />
      <path d="m1.53 7.53 1.59-1.59a.67.67 0 0 1 .94 0l1.58 1.59a.67.67 0 0 1 0 .94l-1.58 1.59a.67.67 0 0 1-.94 0L1.53 8.47a.67.67 0 0 1 0-.94Z" />
      <path d="m5.94 11.94 1.59-1.58a.67.67 0 0 1 .94 0l1.59 1.58a.67.67 0 0 1 0 .94l-1.59 1.59a.67.67 0 0 1-.94 0l-1.59-1.59a.67.67 0 0 1 0-.94Z" />
      <path d="m5.94 3.12 1.59-1.59a.67.67 0 0 1 .94 0l1.59 1.59a.67.67 0 0 1 0 .94L8.47 5.64a.67.67 0 0 1-.94 0L5.94 4.06a.67.67 0 0 1 0-.94Z" />
    </>
  ),
  picks: (
    <g transform="scale(0.6667)">
      <path d="m11 10 3 3M6.5 21A3.5 3.5 0 1 0 3 17.5a2.62 2.62 0 0 1-.71 1.79A1 1 0 0 0 3 21zM9.97 17.03 21.38 5.62a1 1 0 0 0-3-3L6.97 14.03" />
    </g>
  ),
};
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
    <div data-composite="decision-answer" className="flex flex-col items-start gap-[var(--space-gap-tight)]">
      <Label tone="info">{data.answer}</Label>
      <div className="w-full">
        <Tree>
          <Twig>
            <span className="inline-flex flex-wrap gap-[var(--space-gap-tight)]">
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
            <span className={head}>Because of</span>
            <Tree>
              {data.because.length ? (
                data.because.map((b) => <Twig key={b}>{b}</Twig>)
              ) : (
                <Twig>
                  <span className={muted}>Nothing before it. It's one of the first answers.</span>
                </Twig>
              )}
            </Tree>
          </Twig>
          <Twig>
            <span className={head}>What it decided{count ? ` (${count})` : ""}</span>
            <Tree>
              {data.decided.groups.map((g) => (
                <Twig key={g.kind}>
                  <span className={`inline-flex items-center gap-[var(--space-gap-tight)] ${head}`}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {ICONS[g.kind]}
                    </svg>
                    {TITLES[g.kind]} ({g.items.length})
                  </span>
                  <Tree>
                    {g.items.map((d, i) => (
                      <Twig key={i}>
                        <Line {...d} />
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
