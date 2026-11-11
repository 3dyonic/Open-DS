/**
 * Chain: one value resolving to the next, such as a token → its neutral step or primitive → its hex.
 * A base form: the standard connector for such a chain is a thin arrow in the text's own color at half
 * strength, so it reads as a link, not as content. lead puts an arrow before the first part too, for a
 * chain that continues a name shown beside it.
 */
import * as React from "react";

export default function Chain({ parts, lead = false }: { parts: React.ReactNode[]; lead?: boolean }) {
  const arrow = (key: string) => (
    <span key={key} aria-hidden="true" className="opacity-50">
      →
    </span>
  );
  return (
    <span className="inline-flex flex-wrap items-center gap-x-[var(--space-gap-tight)]">
      {parts.flatMap((p, i) => [
        ...(i || lead ? [arrow(`a${i}`)] : []),
        <span key={`p${i}`} className="min-w-0 [overflow-wrap:anywhere]">
          {p}
        </span>,
      ])}
    </span>
  );
}
