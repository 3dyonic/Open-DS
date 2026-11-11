/**
 * Rule: when to use a token and when not, with the reason, from the scheme's usage rules. A base form:
 * the specimens and the anatomy steps extend it. A check in the success color says use for; a cross in
 * the danger color says not for. Both are Lucide icons drawn through Icon (OD-285).
 */
import * as React from "react";
import { Check, X } from "lucide-react";
import { Icon } from "@open-ds/ui/components/icon";

export type RuleLine = {
  kind: "use" | "not";
  // The situation, as the grammar titles it, such as "Page title".
  situation: string;
  // For a use: how, such as "with a hairline". For a not: what to use instead.
  detail?: string;
  why?: string;
};

export default function Rule({ kind, situation, detail, why }: RuleLine) {
  const head = `${kind === "use" ? "Use for" : "Not for"} ${situation}${detail ? ` — ${detail}` : ""}.`;
  return (
    <span className="flex items-start gap-[var(--space-gap-tight)] text-[length:var(--type-caption-font-size)]">
      <span
        className={`mt-[calc((1lh_-_var(--size-icon))/2)] flex ${kind === "use" ? "text-[color:var(--color-status-success)]" : "text-[color:var(--color-status-danger)]"}`}
      >
        <Icon icon={kind === "use" ? Check : X} label={kind === "use" ? "Use for" : "Not for"} />
      </span>
      <span className="min-w-0">
        <b className="font-medium text-[color:var(--color-text-primary)]">{head}</b>
        {why && <span className="text-[color:var(--color-text-muted)]"> {why}</span>}
      </span>
    </span>
  );
}
